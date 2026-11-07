// 고등학교 확률과 통계 Ⅲ-2 「통계적 추정」 — 뒤쪽 묶음(모평균의 추정, 모비율과 표본비율, 모비율의 추정, 신뢰구간의 길이와 표본의 크기).
// 단원 틀과 도구, 싣는 기준, 뺀 것과 까닭은 11-3-7a.js 에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, frac, table, C } = B.kit;
  const { MINUS, Q, qadd, qsub, qmul, qdiv, nb, V, sup } = B.kit.mid;
  const { ms, pr, ev, vr, sd, nrm, bar, hat, pw, jh, plainOf } = B.kit.hs;
  const K = B.kit.u37x;
  const { UNIT, STD6, STD7, dstr, qs, qv, dq, places, fq, fqs, jx, XB, xb, PH, Mv, Sg, Nv, Sv, P95, P99, ZC, zcond, ZS, zp, p4, zq, ztabOf, ztx,
    amt, amtJ, CTX, lead, leadM, many, T, numQ, ratQ, slots, oneQ, probQ, ciQ, setQ, KOR } = K;

  const Pv = V('p'), PHQ = hat('p') + hat('q');
  const zOf = (conf) => Q(ZC[conf], 100);                                   // 1.96, 2.58
  const zT = (conf) => (conf === 95 ? '1.96' : '2.58');
  const other = (conf) => (conf === 95 ? 99 : 95);
  // 표본의 크기 n = r² 과 모표준편차(또는 표본표준편차) σ 로 신뢰구간의 반폭 z·σ/√n
  const halfOf = (conf, sig, r) => qdiv(qmul(zOf(conf), sig), Q(r));
  const ci = (xbar, h) => [qsub(xbar, h), qadd(xbar, h)];
  const ciT = (lo, hi, v) => ms(`${qs(lo)} <= ${v || 'm'} <= ${qs(hi)}`);
  // 검사 식: 아래 끝 x̄ − z·σ/r 을 정수끼리 셈하고 마지막에 한 번 나눈다.
  const loExpr = (xbar, conf, sig, r, k) => `(${xbar.p}*100*${sig.q}*${r}-${k || 1}*${ZC[conf]}*${sig.p}*${xbar.q})/(${xbar.q}*100*${sig.q}*${r})`;
  // 수 글: 표본평균은 정수나 소수 첫째 자리
  const xbarPick = (d, lo, hi) => (d.bool() ? Q(d.int(lo, hi)) : Q(d.int(lo * 10, hi * 10), 10));

  // 비율의 상황: known(k) — 모비율이 k % 라는 글, from — 뽑는 대상, u — 세는 말, trait — 그 속성, rate — 모비율의 이름
  const PCTX = [
    { known: (k) => `어느 고등학교 학생 가운데 방과 후 수업을 신청한 학생의 비율은 ${k} %이다.`, from: '이 학교 학생', any: '어느 고등학교 학생', u: '명', trait: '방과 후 수업을 신청한 학생', rate: '이 학교 학생의 방과 후 수업 신청률' },
    { known: (k) => `어느 공장에서 만드는 볼펜의 불량률은 ${k} %이다.`, from: '이 공장에서 만든 볼펜', any: '어느 공장에서 만든 볼펜', u: '자루', trait: '불량품', rate: '이 공장에서 만드는 볼펜의 불량률' },
    { known: (k) => `어느 지역의 가구 가운데 반려동물을 기르는 가구의 비율은 ${k} %이다.`, from: '이 지역의 가구', any: '어느 지역의 가구', u: '가구', trait: '반려동물을 기르는 가구', rate: '이 지역에서 반려동물을 기르는 가구의 비율' },
    { known: (k) => `새로 개발한 어느 옥수수 씨앗의 발아율은 ${k} %이다.`, from: '이 옥수수 씨앗', any: '새로 개발한 어느 옥수수 씨앗', u: '개', trait: '싹이 튼 씨앗', rate: '이 옥수수 씨앗의 발아율' },
    { known: (k) => `어느 제품을 산 소비자 가운데 이 제품에 만족한 사람의 비율은 ${k} %이다.`, from: '이 제품을 산 소비자', any: '어느 제품을 산 소비자', u: '명', trait: '이 제품에 만족한 사람', rate: '이 제품에 대한 소비자 만족도' },
    { known: (k) => `어느 도시의 시민 가운데 대중교통으로 출근하는 사람의 비율은 ${k} %이다.`, from: '이 도시의 시민', any: '어느 도시의 시민', u: '명', trait: '대중교통으로 출근하는 사람', rate: '이 도시에서 대중교통으로 출근하는 사람의 비율' }
  ];
  const takeN = (c, n) => josa(n + c.u, '을/를');
  const found = (c, x) => `${josa(c.trait, '이/가')} ${josa(x + c.u, '이었다/였다')}`;
  // 표본비율의 표준편차 σ(p̂) = s/1000 이 깔끔한 (모비율 k %, 표본의 크기 n). x = 그 속성을 가진 수
  const PCOMBO = [];
  for (let k = 2; k <= 98; k += 1) for (const s of [5, 10, 15, 20, 25, 30, 40, 50, 60, 100]) {
    const num = k * (100 - k) * 100;
    if (num % (s * s)) continue;
    const n = num / (s * s);
    if (n < 20 || n > 5000 || (k * n) % 100) continue;
    const x = (k * n) / 100;
    if (x < 5 || n - x < 5) continue;
    PCOMBO.push({ k, n, s, x });
  }
  const sigP = (cb) => Q(cb.s, 1000);
  const pOf = (cb) => Q(cb.k, 100);
  const comboPick = (d, ok) => d.pick(PCOMBO.filter(ok));

  // ════════════════════════════════════════════════════════════════
  // ── 모평균의 추정 ──
  const SMALL = CTX.filter((c) => c.lo <= 50);

  B.addTypes(UNIT, 'est', [
    T('est-sigma', '모표준편차를 알 때 모평균의 신뢰구간', '②1', (d) => {
      const c = d.pick(CTX), conf = d.pick([95, 99]), r = d.pick([4, 5, 6, 7, 8, 10, 12, 15, 20]), sig = Q(d.int(2, 30)), xbar = xbarPick(d, c.lo, c.hi);
      const h = halfOf(conf, sig, r), [lo, hi] = ci(xbar, h);
      if (places(lo) > 4) return null;
      const h2 = halfOf(other(conf), sig, r), rows = [[lo, hi], ci(xbar, h2), ci(xbar, qmul(h, Q(2))), ci(xbar, qdiv(h, Q(2))), ci(xbar, qmul(h2, Q(2)))];
      return ciQ(d, `${leadM(c, sig.p)} ${c.from} 가운데 ${many(c, r * r)} 임의추출하여 조사하였더니 ${c.what}의 평균이 ${amtJ(qs(xbar), c.u, '이었다/였다')}. 이 결과를 이용하여 구한 ${c.all}의 평균 ${Mv}에 대한 신뢰도 ${conf} %의 신뢰구간은? ${zcond(conf)}`, rows, 'm', {
        expr: loExpr(xbar, conf, sig, r),
        explain: `n = ${r * r}, x̄ = ${qs(xbar)}, σ = ${sig.p}이므로 신뢰구간은 ${qs(xbar)} − ${zT(conf)} × ${sig.p}/√${r * r} ≤ m ≤ ${qs(xbar)} + ${zT(conf)} × ${sig.p}/√${r * r}, 곧 ${ciT(lo, hi)}이다.`
      });
    }),
    T('est-s', '표본표준편차로 모평균의 신뢰구간(표본이 클 때)', '②2', (d) => {
      const c = d.pick(CTX), conf = d.pick([95, 99]), r = d.pick([8, 10, 12, 15, 16, 20, 25]), s = Q(d.int(2, 60), d.pick([1, 1, 10])), xbar = xbarPick(d, c.lo, c.hi);
      if (places(s) > 1) return null;
      const h = halfOf(conf, s, r), [lo, hi] = ci(xbar, h);
      if (places(lo) > 4) return null;
      const h2 = halfOf(other(conf), s, r), rows = [[lo, hi], ci(xbar, h2), ci(xbar, qmul(h, Q(2))), ci(xbar, qdiv(h, Q(2))), ci(xbar, qmul(h2, Q(2)))];
      return ciQ(d, `${josa(c.subj, '은/는')} 평균이 ${amtJ(Mv, c.u, '인/인')} 정규분포를 따른다고 한다. ${c.from} 가운데 ${many(c, r * r)} 임의추출하여 조사하였더니 ${c.what}의 평균이 ${amt(qs(xbar), c.u)}, 표준편차가 ${amtJ(qs(s), c.u, '이었다/였다')}. 이 결과를 이용하여 구한 ${c.all}의 평균 ${Mv}에 대한 신뢰도 ${conf} %의 신뢰구간은? ${zcond(conf)}`, rows, 'm', {
        expr: loExpr(xbar, conf, s, r),
        explain: `모표준편차를 모르지만 표본의 크기 ${jx(r * r, '이/가')} 충분히 크므로 σ 대신 표본표준편차 ${jx(qs(s), '을/를')} 쓴다. ${qs(xbar)} − ${zT(conf)} × ${qs(s)}/${r} ≤ m ≤ ${qs(xbar)} + ${zT(conf)} × ${qs(s)}/${r}, 곧 ${ciT(lo, hi)}이다.`
      });
    }),
    T('est-int', '신뢰구간에 속하는 정수의 개수', '②3', (d) => {
      const c = d.pick(CTX), conf = d.pick([95, 99]), r = d.pick([8, 10, 16, 20]), s = Q(d.int(3, 40)), xbar = Q(d.int(c.lo, c.hi));
      const [lo, hi] = ci(xbar, halfOf(conf, s, r));
      if (lo.q === 1 || hi.q === 1 || places(lo) > 4) return null;
      const a = Math.ceil(qv(lo)), b = Math.floor(qv(hi)), cnt = b - a + 1;
      if (cnt < 2) return null;
      return numQ(`${josa(c.subj, '은/는')} 정규분포를 따른다고 한다. ${c.from} 가운데 ${many(c, r * r)} 임의추출하여 ${josa(c.what, '을/를')} 조사하였더니 평균이 ${amt(qs(xbar), c.u)}, 표준편차가 ${amtJ(qs(s), c.u, '이었다/였다')}. 이 결과를 이용하여 구한 모평균 ${Mv}에 대한 신뢰도 ${conf} %의 신뢰구간에 속하는 정수는 몇 개인가? ${zcond(conf)}`, cnt, {
        value: `${b}-${a}+1`,
        explain: `표본이 크므로 표본표준편차를 쓴다. 신뢰구간은 ${ciT(lo, hi)}이므로 속하는 정수는 ${a}부터 ${b}까지 ${cnt}개이다.`
      });
    }),
    T('est-end', '신뢰구간의 한 끝으로 표본평균과 다른 끝', '②4 심3', (d) => {
      const c = d.pick(SMALL), conf = d.pick([95, 99]), se = conf === 95 ? d.pick([Q(5, 2), Q(5), Q(15, 2), Q(10)]) : d.pick([Q(5), Q(10)]), r = d.pick([4, 6, 8, 10, 12]);
      const sig = qmul(se, Q(r)); if (sig.q !== 1) return null;
      const xbar = d.int(Math.max(c.lo, 20), Math.min(c.hi, 70)), h = qmul(zOf(conf), se), [lo, hi] = ci(Q(xbar), h), giveLo = d.bool();
      if (qv(lo) <= 0 || qv(hi) >= 100) return null;
      const known = giveLo ? lo : hi, ans = giveLo ? hi : lo, letter = giveLo ? 'b' : 'a';
      const shownCI = giveLo ? ms(`${qs(lo)} <= m <= b`) : ms(`a <= m <= ${qs(hi)}`);
      return slots(`${leadM(c, sig.p)} ${c.from} 가운데 ${many(c, r * r)} 임의추출하여 얻은 표본평균 ${xb}를 이용하여 구한 모평균 ${Mv}에 대한 신뢰도 ${conf} %의 신뢰구간이 ${shownCI}이다. ${jh(xb, '과/와')} ${V(letter)}의 값을 차례로 구하시오. ${zcond(conf)}`, [
        [xb, xbar, `(${known.p}*100*${se.q}${giveLo ? '+' : '-'}${ZC[conf]}*${se.p}*${known.q})/(${known.q}*100*${se.q})`, false], [V(letter), qv(ans), `(${xbar}*100*${se.q}${giveLo ? '+' : '-'}${ZC[conf]}*${se.p})/(100*${se.q})`, true]
      ], {
        shown: `${xb} = ${xbar}, ${V(letter)} = ${qs(ans)}`,
        explain: `반폭은 ${zT(conf)} × ${sig.p}/√${r * r} = ${qs(h)}이다. ${giveLo ? `${xb} − ${qs(h)} = ${qs(lo)}에서 ${xb} = ${xbar}, b = ${xbar} + ${qs(h)} = ${qs(hi)}` : `${xb} + ${qs(h)} = ${qs(hi)}에서 ${xb} = ${xbar}, a = ${xbar} − ${qs(h)} = ${qs(lo)}`}이다.`
      });
    }),
    T('est-n', '신뢰구간의 한 끝으로 표본의 크기와 다른 끝', '②5', (d) => {
      const c = d.pick(SMALL), se = d.pick([Q(5, 2), Q(5), Q(15, 2)]), r = d.pick([8, 10, 12, 14, 16, 20]), s = qmul(se, Q(r));
      if (s.q !== 1) return null;
      const xbar = d.int(Math.max(c.lo, 25), Math.min(c.hi, 70)), h = qmul(zOf(95), se), [lo, hi] = ci(Q(xbar), h), giveLo = d.bool();
      if (qv(lo) <= 0 || qv(hi) >= 100) return null;
      const known = giveLo ? lo : hi, ans = giveLo ? hi : lo, letter = giveLo ? 'b' : 'a';
      const shownCI = giveLo ? ms(`${qs(lo)} <= m <= b`) : ms(`a <= m <= ${qs(hi)}`);
      return slots(`${josa(c.subj, '은/는')} 정규분포를 따른다고 한다. ${c.from} 가운데 ${Nv}${josa(c.cnt, '을/를')} 임의추출하여 조사하였더니 ${c.what}의 평균이 ${amt(xbar, c.u)}, 표준편차가 ${amtJ(s.p, c.u, '이었다/였다')}. 이 결과를 이용하여 구한 모평균 ${Mv}에 대한 신뢰도 95 %의 신뢰구간이 ${shownCI}일 때, ${jh(Nv, '과/와')} ${V(letter)}의 값을 차례로 구하시오. (단, ${Nv}은 충분히 큰 수이고, ${V('Z')}가 표준정규분포를 따르는 확률변수일 때, ${pr('|Z| <= 1.96')} = 0.95로 계산한다.)`, [
        [Nv, r * r, `(196*${s.p}*${known.q})*(196*${s.p}*${known.q})/((100*(${giveLo ? `${xbar}*${known.q}-${known.p}` : `${known.p}-${xbar}*${known.q}`}))*(100*(${giveLo ? `${xbar}*${known.q}-${known.p}` : `${known.p}-${xbar}*${known.q}`})))`, false], [V(letter), qv(ans), `(${xbar}*100*${se.q}${giveLo ? '+' : '-'}196*${se.p})/(100*${se.q})`, true]
      ], {
        shown: `${Nv} = ${r * r}, ${V(letter)} = ${qs(ans)}`,
        explain: `반폭은 ${giveLo ? `${xbar} − ${qs(lo)}` : `${qs(hi)} − ${xbar}`} = ${qs(h)}이므로 1.96 × ${s.p}/√n = ${qs(h)}, √n = ${r}, n = ${r * r}이다. ${letter} = ${xbar} ${giveLo ? '+' : MINUS} ${qs(h)} = ${qs(ans)}이다.`
      });
    })
  ]);

  // ════════════════════════════════════════════════════════════════
  // ── 모비율과 표본비율 ──
  const VILLAGE = [
    { whole: (N, K) => `주민이 ${N}명인 어느 마을에 고등학생이 ${K}명 살고 있다.`, take: (n, x) => `이 마을 주민 가운데 ${n}명을 임의추출하였더니 그 가운데 ${josa(x + '명', '이었다/였다').replace(/^/, '고등학생이 ')}.`, pop: '이 마을 주민 전체', what: '고등학생의 비율' },
    { whole: (N, K) => `어느 도서관에 있는 책 ${N}권 가운데 소설책이 ${K}권이다.`, take: (n, x) => `이 도서관의 책 가운데 ${n}권을 임의추출하였더니 그 가운데 소설책이 ${josa(x + '권', '이었다/였다')}.`, pop: '이 도서관의 책 전체', what: '소설책의 비율' },
    { whole: (N, K) => `어느 공장에서 오늘 만든 제품 ${N}개 가운데 불량품이 ${K}개이다.`, take: (n, x) => `오늘 만든 제품 가운데 ${n}개를 임의추출하였더니 그 가운데 불량품이 ${josa(x + '개', '이었다/였다')}.`, pop: '오늘 만든 제품 전체', what: '불량품의 비율' }
  ];

  B.addTypes(UNIT, 'ratio', [
    T('ratio-phat', '모비율과 표본비율 가려 구하기', '②7', (d) => {
      const v = d.pick(VILLAGE), N = d.int(12, 60) * 50, K0 = d.int(2, 30), K = Math.round((N * K0) / 100), n = d.pick([50, 80, 100, 120, 150, 200]), x = d.int(3, Math.floor(n / 2));
      const p = Q(K, N), ph = Q(x, n), askHat = d.bool(), ans = askHat ? ph : p;
      if (p.p === ph.p && p.q === ph.q) return null;
      return ratQ(`${v.whole(N, K)} ${v.take(n, x)} ${v.pop}를 모집단으로 할 때, ${v.what}에 대한 ${askHat ? '표본비율 ' + PH : '모비율 ' + Pv}의 값은?`, ans, {
        value: askHat ? `${x}/${n}` : `${K}/${N}`,
        explain: `모비율은 모집단 전체에서의 비율 ${K}/${N}${K / N === p.p / p.q && p.q !== N ? ' = ' + fqs(p) : ''}, 표본비율은 뽑은 표본 안에서의 비율 ${x}/${n}${ph.q !== n ? ' = ' + fqs(ph) : ''}이다.`
      });
    }),
    T('ratio-ev', '모비율과 표본의 크기로 표본비율의 분산·표준편차', '②8', (d, n) => {
      if (n === 0) {
        const k = d.int(5, 95), size = d.pick([20, 25, 30, 40, 50, 60, 80, 100, 120, 150, 200, 300, 400]), v = Q(k * (100 - k), 10000 * size);
        if (v.q > 9999) return null;
        const pt = qs(Q(k, 100));
        return ratQ(`모비율이 ${pt}인 모집단에서 임의추출한 크기가 ${size}인 표본의 표본비율 ${PH}에 대하여 ${vr(PH)}의 값은?`, v, {
          value: `${k}*(100-${k})/(10000*${size})`, explain: `${vr(PH)} = pq/n = ${pt} × ${qs(Q(100 - k, 100))}/${size} = ${fqs(v)}이다.`
        });
      }
      const cb = comboPick(d, (x) => x.n >= 30 && x.s <= 60), c = d.pick(PCTX), sg = sigP(cb);
      return ratQ(`${c.known(cb.k)} ${c.from} 가운데 ${takeN(c, cb.n)} 임의추출할 때, ${c.trait}의 비율을 ${PH}이라 하자. ${sd(PH)}의 값은?`, sg, {
        value: `${cb.s}/1000`, explain: `${sd(PH)} = √(pq/n) = √(${qs(pOf(cb))} × ${qs(Q(100 - cb.k, 100))}/${cb.n}) = ${qs(sg)} = ${fqs(sg)}이다.`
      });
    }, { count: 2 }),
    T('ratio-normal', '표본비율이 따르는 정규분포', '②9', (d) => {
      const cb = comboPick(d, (x) => x.n >= 50 && x.s <= 60), c = d.pick(PCTX), sg = sigP(cb), p = pOf(cb);
      const sq = (x) => pw(qs(x), 2), mean = qs(p);
      const rows = [
        { h: nrm(mean, sq(sg)), ok: true },
        { h: nrm(String(cb.x), sq(qmul(sg, Q(cb.n)))), ok: false },
        { h: nrm(mean, sq(qmul(sg, sg))), ok: false },
        { h: nrm(qs(Q(100 - cb.k, 100)), sq(sg)), ok: false }
      ];
      if (rows.some((r) => /null/.test(r.h)) || cb.k === 50) return null;
      return oneQ(d, `${c.known(cb.k)} ${c.from} 가운데 ${takeN(c, cb.n)} 임의추출할 때, ${c.trait}의 비율 ${PH}은 근사적으로 정규분포를 따른다. ${jh(PH, '이/가')} 따르는 정규분포는?`, rows, true, {
        explain: `n이 충분히 크면 ${PH}은 근사적으로 N(p, pq/n)을 따른다. ${ev(PH)} = ${mean}, ${sd(PH)} = √(${mean} × ${qs(Q(100 - cb.k, 100))}/${cb.n}) = ${qs(sg)}이다. N(${cb.x}, …)은 그 속성을 가진 수가 따르는 분포이다.`
      });
    }),
    T('ratio-prob', '표본비율이 범위에 들 확률', '②10', (d, n) => {
      const cb = comboPick(d, (x) => x.n >= 50 && x.s >= 10 && x.s <= 60), c = d.pick(PCTX), sg = sigP(cb), p = pOf(cb);
      const z1 = d.pick([0.5, 1, 1.2, 1.5, 2, 2.5]), z2 = d.pick([0.5, 1, 1.5, 2, 2.5, 3]);
      if (n === 0) {
        const above = d.bool(), ge = d.bool(), cut = qadd(p, qmul(Q(above ? 1 : -1), qmul(zq(z1), sg)));
        if (places(cut) > 3 || qv(cut) <= 0 || qv(cut) >= 1) return null;
        const pz = zp(z1), right = ge === above ? 5000 - pz : 5000 + pz;
        const near = ZS.filter((z) => Math.abs(z - z1) <= 0.5 && z !== z1).map((z) => (ge === above ? 5000 - zp(z) : 5000 + zp(z)));
        return probQ(d, `${c.known(cb.k)} ${c.from} 가운데 ${takeN(c, cb.n)} 임의추출할 때, ${c.trait}의 비율이 ${qs(cut)} ${ge ? '이상' : '이하'}일 확률을 아래 표준정규분포표를 이용하여 구한 것은?`, right, [10000 - right, pz, ...near, 10000 - near[0]], {
          figure: ztabOf(d, [z1]), expr: `(5000${right > 5000 ? '+' : '-'}${pz})/10000`,
          explain: `${PH}은 근사적으로 정규분포 ${nrm(qs(p), pw(qs(sg), 2))}을 따른다(σ = √(${qs(p)} × ${qs(Q(100 - cb.k, 100))}/${cb.n}) = ${qs(sg)}). ${pr(PH + ms((ge ? ' >= ' : ' <= ') + qs(cut)))} = ${pr(ms('Z' + (ge ? ' >= ' : ' <= ') + (above ? '' : '-') + z1))} = ${p4(right)}이다.`
        });
      }
      const lo = qsub(p, qmul(zq(z1), sg)), hi = qadd(p, qmul(zq(z2), sg));
      if (places(lo) > 3 || places(hi) > 3 || qv(lo) <= 0 || qv(hi) >= 1) return null;
      const a = zp(z1), b = zp(z2), right = a + b;
      return probQ(d, `${c.known(cb.k)} ${c.from} 가운데 ${takeN(c, cb.n)} 임의추출할 때, ${c.trait}의 비율이 ${qs(lo)} 이상 ${qs(hi)} 이하일 확률을 아래 표준정규분포표를 이용하여 구한 것은?`, right, [Math.abs(b - a), 5000 + a, 5000 + b, 10000 - a - b, 5000 - a + b, 5000 - b + a], {
        figure: ztabOf(d, [...new Set([z1, z2])]), expr: `(${a}+${b})/10000`,
        explain: `${PH}은 근사적으로 정규분포 ${nrm(qs(p), pw(qs(sg), 2))}을 따른다. ${pr(ms(qs(lo) + ' <= ') + PH + ms(' <= ' + qs(hi)))} = ${pr(ms('-' + z1 + ' <= Z <= ' + z2))} = ${p4(a)} + ${p4(b)} = ${p4(right)}이다.`
      });
    }, { count: 2 }),
    T('ratio-n', '표본비율의 확률이 주어질 때 표본의 크기', '②12', (d) => {
      const cb = comboPick(d, (x) => x.s >= 20), c = d.pick(PCTX), sg = sigP(cb), p = pOf(cb), z = d.pick([0.5, 1, 1.5, 2, 2.5]);
      const cut = qadd(p, qmul(zq(z), sg));
      if (places(cut) > 2 || qv(cut) >= 1) return null;
      const val = 5000 + zp(z), k = cb.k;
      return numQ(`${c.known(k)} ${c.from} 가운데 ${Nv}${josa(c.u, '을/를')} 임의추출할 때, ${c.trait}의 비율을 ${PH}이라 하자. ${pr(PH + ms(' <= ' + qs(cut)))} = ${jx(p4(val), '을/를')} 만족시키는 자연수 ${Nv}의 값을 아래 표준정규분포표를 이용하여 구하시오.`, cb.n, {
        figure: ztabOf(d, [z], 3), value: `(${k}*(100-${k})*${zq(z).p}*${zq(z).p}*${cut.q}*${cut.q})/(${zq(z).q}*${zq(z).q}*(${cut.p}*100-${k}*${cut.q})*(${cut.p}*100-${k}*${cut.q}))`,
        explain: `${PH}은 근사적으로 N(${qs(p)}, ${qs(p)} × ${qs(Q(100 - k, 100))}/n)을 따른다. ${qs(qsub(cut, p))}/√(${qs(Q(k * (100 - k), 10000))}/n) = ${z}이어야 하므로 √(${qs(Q(k * (100 - k), 10000))}/n) = ${qs(sg)}, n = ${cb.n}이다.`
      });
    }),
    T('ratio-trend', '표본의 크기가 커질 때 표본비율의 확률의 변화', '②13', (d) => {
      const k = d.pick([20, 30, 40, 60, 70, 80]), dlt = d.pick([5, 10]) * (d.bool() ? 1 : -1), cut = k + dlt, ge = d.bool();
      const tail = ge ? cut > k : cut < k;     // 꼬리 쪽 확률이면 줄어든다
      const rows = [{ h: '커진다', ok: !tail }, { h: '작아진다', ok: tail }, { h: '변하지 않는다', ok: false }];
      return oneQ(d, `모비율이 ${qs(Q(k, 100))}인 모집단에서 임의추출한 크기가 ${Nv}인 표본의 표본비율을 ${PH}이라 하자. ${Nv}의 값이 점점 커질 때, ${pr(PH + ms((ge ? ' >= ' : ' <= ') + qs(Q(cut, 100))))}의 값은 어떻게 되는가?`, rows, true, {
        keep: true,
        explain: `${pr(PH + ms((ge ? ' >= ' : ' <= ') + qs(Q(cut, 100))))} = ${pr(ms('Z' + (ge ? ' >= ' : ' <= ')) + `(${qs(Q(cut - k, 100))})√n/√${qs(Q(k * (100 - k), 10000))}`)}이다. n이 커지면 경계 ${tail ? '값이 평균에서 멀어져 꼬리 쪽 확률은 작아진다' : '값이 평균의 반대쪽으로 멀어져 확률은 1에 가까워지며 커진다'}.`
      });
    })
  ]);

  // ════════════════════════════════════════════════════════════════
  // ── 모비율의 추정 ──
  const pci = (cb, conf) => { const h = qmul(zOf(conf), sigP(cb)); return [qsub(pOf(cb), h), qadd(pOf(cb), h)]; };
  const pExpr = (cb, conf, k2) => `(${cb.k}*100000-${k2 || 1}*${ZC[conf]}*${cb.s}*100)/10000000`;

  B.addTypes(UNIT, 'pest', [
    T('pest-ci', '표본비율로 모비율의 신뢰구간', '②14', (d) => {
      const cb = comboPick(d, (x) => x.n >= 100 && x.s <= 50), c = d.pick(PCTX), conf = d.pick([95, 99]);
      const [lo, hi] = pci(cb, conf), h = qmul(zOf(conf), sigP(cb)), h2 = qmul(zOf(other(conf)), sigP(cb)), p = pOf(cb);
      if (qv(lo) <= 0 || qv(hi) >= 1) return null;
      const rows = [[lo, hi], ci(p, h2), ci(p, qmul(h, Q(2))), ci(p, qmul(h2, Q(2))), ci(p, qdiv(h, Q(2)))];
      return ciQ(d, `${c.any} 가운데 ${takeN(c, cb.n)} 임의추출하여 조사하였더니 ${found(c, cb.x)}. 이 결과를 이용하여 구한 ${c.rate} ${Pv}에 대한 신뢰도 ${conf} %의 신뢰구간은? ${zcond(conf)}`, rows, 'p', {
        expr: pExpr(cb, conf),
        explain: `${PH} = ${cb.x}/${cb.n} = ${qs(p)}이고 √(${PH}${hat('q')}/n) = √(${qs(p)} × ${qs(Q(100 - cb.k, 100))}/${cb.n}) = ${qs(sigP(cb))}이므로 신뢰구간은 ${qs(p)} ± ${zT(conf)} × ${qs(sigP(cb))}, 곧 ${ciT(lo, hi, 'p')}이다.`
      });
    }),
    T('pest-count', '모비율의 신뢰구간으로 표본에서 그 속성을 가진 수', '②15', (d) => {
      const cb = comboPick(d, (x) => x.n >= 100 && x.n <= 2000), c = d.pick(PCTX), conf = d.pick([95, 99]), [lo, hi] = pci(cb, conf);
      if (qv(lo) <= 0 || qv(hi) >= 1 || places(lo) > 5) return null;
      return numQ(`${c.any} 가운데 ${takeN(c, cb.n)} 임의추출하여 구한 표본비율로 추정한 ${c.rate} ${Pv}에 대한 신뢰도 ${conf} %의 신뢰구간이 ${ciT(lo, hi, 'p')}이다. 임의추출한 ${cb.n}${c.u} 가운데 ${josa(c.trait, '은/는')} 몇 ${c.u}인가? ${zcond(conf)}`, cb.x, {
        value: `${cb.n}*(${lo.p}*${hi.q}+${hi.p}*${lo.q})/(2*${lo.q}*${hi.q})`,
        explain: `신뢰구간의 가운데가 표본비율이므로 ${PH} = (${qs(lo)} + ${qs(hi)})/2 = ${qs(pOf(cb))}이다. 그 수는 ${cb.n} × ${qs(pOf(cb))} = ${cb.x}이다.`
      });
    }),
    T('pest-n', '모비율의 신뢰구간으로 표본의 크기', '②16', (d) => {
      const cb = comboPick(d, (x) => x.n >= 100 && x.n <= 3000 && x.s >= 10), c = d.pick(PCTX), conf = d.pick([95, 99]), [lo, hi] = pci(cb, conf);
      if (qv(lo) <= 0 || qv(hi) >= 1 || places(lo) > 5) return null;
      const h = qmul(zOf(conf), sigP(cb));
      return numQ(`${c.any} 가운데 ${Nv}${josa(c.u, '을/를')} 임의추출하여 구한 표본비율로 추정한 ${c.rate} ${Pv}에 대한 신뢰도 ${conf} %의 신뢰구간이 ${ciT(lo, hi, 'p')}이다. ${Nv}의 값은? ${zcond(conf)}`, cb.n, {
        value: `(${cb.k}*(100-${cb.k})*${ZC[conf]}*${ZC[conf]}*${h.q}*${h.q})/(100000000*${h.p}*${h.p})`,
        explain: `가운데가 ${PH} = ${qs(pOf(cb))}, 반폭이 ${qs(h)}이다. ${zT(conf)}√(${qs(pOf(cb))} × ${qs(Q(100 - cb.k, 100))}/n) = ${qs(h)}에서 √(${qs(Q(cb.k * (100 - cb.k), 10000))}/n) = ${qs(sigP(cb))}, n = ${cb.n}이다.`
      });
    }),
    T('pest-read', '신뢰구간의 뜻과 신뢰구간으로 판단하기', '②17', (d, n) => {
      const c = d.pick(CTX), r = d.pick([6, 7, 8, 10, 12]), s = Q(d.int(2, 30)), xbar = Q(d.int(c.lo * 10, c.hi * 10), 10), h = halfOf(95, s, r), [lo, hi] = ci(xbar, h);
      if (places(lo) > 3) return null;
      const data = `${c.from} 가운데 ${many(c, r * r)} 임의추출하여 조사하였더니 ${c.what}의 평균이 ${amt(qs(xbar), c.u)}, 표준편차가 ${amtJ(s.p, c.u, '이었다/였다')}.`;
      if (n === 0) {
        const askTrue = d.bool();
        const trues = [
          { h: `이와 같은 방법으로 크기가 ${r * r}인 표본을 여러 번 뽑아 신뢰구간을 만들면, 그 가운데 약 95 %가 모평균 ${Mv}을 포함한다.`, ok: true },
          { h: `크기가 ${r * r}인 표본을 다시 뽑으면 이와 다른 신뢰구간을 얻을 수 있다.`, ok: true },
          { h: `같은 표본으로 신뢰도 99 %의 신뢰구간을 구하면 이 구간보다 길어진다.`, ok: true }
        ];
        const rows = [
          trues[0],
          { h: `모평균 ${Mv}이 ${amt(qs(lo), c.u)} 이상 ${amt(qs(hi), c.u)} 이하일 확률이 0.95이다.`, ok: false },
          { h: `임의추출한 ${r * r}${c.cnt} 가운데 약 95 %의 ${josa(c.what, '이/가')} ${amt(qs(lo), c.u)} 이상 ${amt(qs(hi), c.u)} 이하이다.`, ok: false },
          { h: `다른 표본을 뽑아도 똑같은 신뢰구간을 얻는다.`, ok: false },
          { h: `표본평균 ${xb}가 ${amt(qs(lo), c.u)} 이상 ${amt(qs(hi), c.u)} 이하일 확률이 0.95이다.`, ok: false }
        ];
        const falses = d.shuffle(rows.slice(1)), pickRows = askTrue ? [trues[0]].concat(falses.slice(0, 3)) : trues.concat(falses.slice(0, 1));
        return oneQ(d, `${josa(c.subj, '은/는')} 평균이 ${amtJ(Mv, c.u, '인/인')} 정규분포를 따른다고 한다. ${data} 이 결과로 구한 모평균 ${Mv}에 대한 신뢰도 95 %의 신뢰구간은 ${ciT(lo, hi)}이다. 이 신뢰구간에 대한 설명으로 ${askTrue ? '옳은' : '옳지 않은'} 것은? ${P95}`, pickRows, askTrue, {
          explain: `모평균 m은 정해진 수이고 신뢰구간은 뽑은 표본에 따라 달라진다. 신뢰도 95 %는 크기가 같은 표본을 거듭 뽑아 만든 신뢰구간 가운데 95 %가 m을 포함한다는 뜻이다. 이미 구한 한 구간은 m을 포함하거나 포함하지 않으므로 「m이 이 구간에 있을 확률이 0.95」라고 하지 않는다.`
        });
      }
      const where = d.pick(['below', 'above', 'inside']);
      const ref = where === 'below' ? Math.floor(qv(lo)) - d.int(0, 2) : where === 'above' ? Math.ceil(qv(hi)) + d.int(0, 2) : Math.round(qv(xbar));
      if ((where === 'inside' && (ref <= qv(lo) || ref >= qv(hi))) || ref === qv(lo) || ref === qv(hi)) return null;
      const rows = [
        { h: `모평균 ${Mv}은 ${amt(ref, c.u)}보다 크다고 판단할 수 있다.`, ok: where === 'below' },
        { h: `모평균 ${Mv}은 ${amt(ref, c.u)}보다 작다고 판단할 수 있다.`, ok: where === 'above' },
        { h: `신뢰구간에 ${amtJ(ref, c.u, '이/가')} 들어 있어 ${Mv}이 ${amt(ref, c.u)}보다 큰지 작은지 판단할 수 없다.`, ok: where === 'inside' }
      ];
      return oneQ(d, `${josa(c.subj, '은/는')} 정규분포를 따른다고 한다. ${data} 이 결과를 이용하여 ${c.all}의 평균 ${Mv}이 ${amt(ref, c.u)}보다 큰지 신뢰도 95 %의 신뢰구간으로 판단하려 한다. 옳은 것은? ${P95}`, rows, true, {
        keep: true,
        explain: `표본이 크므로 표본표준편차를 쓴다. 신뢰구간은 ${ciT(lo, hi)}이다. ${where === 'below' ? `아래 끝 ${jx(qs(lo), '이/가')} ${ref}보다 크므로 m은 ${ref}보다 크다고 판단한다.` : where === 'above' ? `위 끝 ${jx(qs(hi), '이/가')} ${ref}보다 작으므로 m은 ${ref}보다 작다고 판단한다.` : `${jx(ref, '이/가')} 구간 안에 있으므로 이 결과만으로는 판단할 수 없다.`}`
      });
    }, { count: 2 })
  ]);

  // ════════════════════════════════════════════════════════════════
  // ── 신뢰구간의 길이와 표본의 크기 ──
  B.addTypes(UNIT, 'len', [
    T('len-formula', '신뢰구간의 길이와 그 변화', '②18', (d, n) => {
      if (n === 0) {
        const conf = d.pick([95, 99]), right = 2 * ZC[conf], vals = d.shuffle([right, ZC[conf], 2 * ZC[other(conf)], ZC[other(conf)]]);
        return C(`모표준편차가 ${Sg}인 정규분포를 따르는 모집단에서 크기가 ${Nv}인 표본을 임의추출하여 모평균 ${Mv}을 추정할 때, 신뢰도 ${conf} %의 신뢰구간 ${ms('a <= m <= b')}의 길이 ${ms('b - a')}는 ${V('k')} × ${frac(Sg, '√' + Nv)}이다. 상수 ${V('k')}의 값은? ${zcond(conf)}`, vals.map((v) => dstr(v, 100)), vals.indexOf(right), {
          explain: `신뢰구간은 x̄ − ${zT(conf)}σ/√n ≤ m ≤ x̄ + ${zT(conf)}σ/√n이므로 길이는 2 × ${zT(conf)} × σ/√n = ${dstr(right, 100)} × σ/√n이다.`,
          facts: { pick: { expr: `2*${ZC[conf]}/100`, options: vals.map((v) => v / 100) } }
        });
      }
      const kind = d.pick(['confUp', 'confDown', 'nUp', 'nDown']);
      const ask = { confUp: '표본의 크기가 일정할 때, 신뢰도를 95 %에서 99 %로 높이면', confDown: '표본의 크기가 일정할 때, 신뢰도를 99 %에서 95 %로 낮추면', nUp: '신뢰도가 일정할 때, 표본의 크기를 크게 하면', nDown: '신뢰도가 일정할 때, 표본의 크기를 작게 하면' }[kind];
      const longer = kind === 'confUp' || kind === 'nDown';
      const rows = [{ h: '길어진다', ok: longer }, { h: '짧아진다', ok: !longer }, { h: '변하지 않는다', ok: false }];
      return oneQ(d, `모표준편차가 ${Sg}인 정규분포를 따르는 모집단에서 임의추출한 표본으로 모평균 ${Mv}에 대한 신뢰구간을 구하려 한다. ${ask} 신뢰구간의 길이는 어떻게 되는가?`, rows, true, {
        keep: true, explain: `신뢰구간의 길이는 2 × z × σ/√n이다(신뢰도 95 %는 z = 1.96, 99 %는 z = 2.58). ${kind.startsWith('conf') ? 'z가' : '√n이'} ${kind === 'confUp' || kind === 'nUp' ? '커지므로' : '작아지므로'} 길이는 ${longer ? '길어진다' : '짧아진다'}.`
      });
    }, { count: 2 }),
    T('len-claims', '신뢰구간의 성질 — 옳은 것 모두', '②19', (d) => {
      const k = d.pick([2, 3, 4]);
      const pool = [
        { h: '신뢰도가 같을 때, 표본의 크기를 크게 하면 신뢰구간의 길이는 짧아진다.', ok: true },
        { h: '표본의 크기가 같을 때, 신뢰도를 높이면 신뢰구간의 길이는 길어진다.', ok: true },
        { h: `같은 표본으로 구한 모평균 ${Mv}에 대한 신뢰도 99 %의 신뢰구간은 신뢰도 95 %의 신뢰구간을 포함한다.`, ok: true },
        { h: `표본평균 ${XB}의 분산은 표본의 크기에 반비례한다.`, ok: true },
        { h: `신뢰도가 같을 때, 표본의 크기를 ${k * k}배로 하면 신뢰구간의 길이는 ${frac(1, k)}배가 된다.`, ok: true },
        { h: '신뢰도가 같을 때, 표본의 크기가 작을수록 신뢰구간의 길이는 짧아진다.', ok: false },
        { h: `신뢰도가 같을 때, 표본의 크기를 ${k}배로 하면 신뢰구간의 길이는 ${frac(1, k)}배가 된다.`, ok: false },
        { h: `표본평균 ${XB}의 표준편차는 표본의 크기에 반비례한다.`, ok: false },
        { h: '표본의 크기가 같을 때, 신뢰도를 낮추면 신뢰구간의 길이는 길어진다.', ok: false }
      ];
      const picks = d.shuffle(pool).slice(0, 3);
      if (!picks.some((p) => p.ok)) return null;
      return setQ(d, '정규분포를 따르는 모집단에서 임의추출한 표본으로 모평균을 추정하려 한다. 옳은 것만을 보기에서 있는 대로 고른 것은? (단, 모표준편차는 일정하다.)', picks, {
        explain: `신뢰구간의 길이는 2zσ/√n이고 ${vr(XB)} = σ²/n, ${sd(XB)} = σ/√n이다. 표본의 크기를 a배로 하면 길이는 1/√a배가 된다. 옳은 것: ${picks.map((p, i) => (p.ok ? KOR[i] : null)).filter(Boolean).join(', ')}.`
      });
    }),
    T('len-n', '모평균의 신뢰구간 길이가 주어진 값 이하가 되는 표본의 크기', '②20', (d) => {
      const conf = d.pick([95, 99]), sig = Q(d.int(2, 20)), L = dq(d.pick(['0.5', '0.7', '0.8', '1', '1.2', '1.5', '2', '2.5', '3', '4'])), strict = d.bool();
      const t = qdiv(qmul(Q(2 * ZC[conf], 100), sig), L), T2 = qmul(t, t);
      const need = strict ? Math.floor(qv(T2)) + 1 : Math.ceil(qv(T2) - 1e-12);
      if (need < 10 || need > 5000) return null;
      return numQ(`모표준편차가 ${sig.p}인 정규분포를 따르는 모집단에서 크기가 ${Nv}인 표본을 임의추출하여 구한 모평균 ${Mv}에 대한 신뢰도 ${conf} %의 신뢰구간이 ${ms('a <= m <= b')}이다. ${jh(ms('b - a ' + (strict ? '<' : '<=') + ' ' + qs(L)), '을/를')} 만족시키는 자연수 ${Nv}의 최솟값은? ${zcond(conf)}`, need, {
        range: { ineq: `x*${T2.q}>${strict ? T2.p : T2.p - 1}`, lo: 1, hi: 10000, want: 'min' },
        explain: `b − a = 2 × ${zT(conf)} × ${sig.p}/√n ${strict ? '<' : '≤'} ${qs(L)}에서 √n ${strict ? '>' : '≥'} ${qs(t) || fqs(t)}, n ${strict ? '>' : '≥'} ${qs(T2) || fqs(T2)}이다. 자연수 n의 최솟값은 ${need}이다.`
      });
    }),
    T('len-table', '표에서 표본비율을 읽어 모비율 신뢰구간의 길이', '②22', (d) => {
      const cb = comboPick(d, (x) => x.n >= 100 && x.n <= 1000 && x.k >= 10 && x.k <= 40), conf = d.pick([95, 99]);
      const names = ['A', 'B', 'C', 'D'], at = d.int(0, 2), rest = cb.n - cb.x;
      const a = d.int(Math.ceil(rest * 0.2), Math.floor(rest * 0.5)), b = d.int(Math.ceil((rest - a) * 0.3), Math.floor((rest - a) * 0.7)), cnts = [a, b, rest - a - b];
      cnts.splice(at, 0, cb.x);
      if (cnts.some((v) => v <= 0) || new Set(cnts).size !== 4) return null;
      const sg = sigP(cb), L = qmul(Q(2 * ZC[conf], 100), sg);
      const vals = [L, qdiv(L, Q(2)), qmul(Q(2 * ZC[other(conf)], 100), sg), qmul(Q(ZC[other(conf)], 100), sg), qmul(L, Q(2))];
      if (vals.some((v) => qs(v) == null) || new Set(vals.map(qv)).size !== 5) return null;
      const order = d.shuffle([0, 1, 2, 3, 4]);
      return C(`다음은 어느 지역의 스마트폰 이용자 가운데 임의추출한 ${cb.n}명이 쓰는 스마트폰의 제조사를 조사한 표이다. 이 결과를 이용하여 구한 이 지역 스마트폰 이용자 가운데 제조사가 ${names[at]}사인 사람의 비율 ${Pv}에 대한 신뢰도 ${conf} %의 신뢰구간을 ${ms('a <= p <= b')}라 할 때, ${ms('b - a')}의 값은? ${zcond(conf)}`, order.map((i) => qs(vals[i])), order.indexOf(0), {
        figure: table(['제조사', '사람 수(명)'], [...names.slice(0, 3).map((n, i) => [n + '사', String(cnts[i])]), ['그 밖', String(cnts[3])], ['합계', String(cb.n)]]),
        explain: `${PH} = ${cb.x}/${cb.n} = ${qs(pOf(cb))}이고 √(${qs(pOf(cb))} × ${qs(Q(100 - cb.k, 100))}/${cb.n}) = ${qs(sg)}이므로 b − a = 2 × ${zT(conf)} × ${qs(sg)} = ${qs(L)}이다.`,
        facts: { pick: { expr: `2*${ZC[conf]}*${cb.s}/100000`, options: order.map((i) => qv(vals[i])) } }
      });
    }),
    T('len-ratio-n', '모비율의 신뢰구간 길이로 표본의 크기', '②23', (d) => {
      const cb = comboPick(d, (x) => x.n >= 50 && x.n <= 3000 && x.s >= 10 && x.s <= 60 && x.k % 5 === 0), c = d.pick(PCTX), conf = d.pick([95, 99]);
      const L = qmul(Q(2 * ZC[conf], 100), sigP(cb));
      if (places(L) > 5) return null;
      return numQ(`${c.any} 가운데 ${Nv}${josa(c.u, '을/를')} 임의추출하여 조사하였더니 ${c.trait}의 비율이 ${jx(qs(pOf(cb)), '이었다/였다')}. 이 결과를 이용하여 구한 ${c.rate} ${Pv}에 대한 신뢰도 ${conf} %의 신뢰구간이 ${ms('a <= p <= b')}이고 ${ms('b - a = ' + qs(L))}일 때, ${Nv}의 값은? ${zcond(conf)}`, cb.n, {
        value: `(${cb.k}*(100-${cb.k})*(2*${ZC[conf]})*(2*${ZC[conf]})*${L.q}*${L.q})/(100000000*${L.p}*${L.p})`,
        explain: `b − a = 2 × ${zT(conf)} × √(${qs(pOf(cb))} × ${qs(Q(100 - cb.k, 100))}/n) = ${qs(L)}에서 √(${qs(Q(cb.k * (100 - cb.k), 10000))}/n) = ${qs(sigP(cb))}, n = ${cb.n}이다.`
      });
    }),
    T('len-max', '표본비율을 모를 때 모비율 신뢰구간 길이의 최댓값', '②24', (d) => {
      const r = d.pick([10, 20, 25, 40, 50]), conf = d.pick([95, 99]), z = Q(ZC[conf], 100);
      const right = qdiv(z, Q(r)), z2 = Q(ZC[other(conf)], 100), vals = [right, qmul(right, Q(2)), qdiv(right, Q(2)), qdiv(z2, Q(r)), qdiv(qmul(z2, Q(2)), Q(r))];
      if (vals.some((v) => qs(v) == null) || new Set(vals.map(qv)).size !== 5) return null;
      const order = d.shuffle([0, 1, 2, 3, 4]);
      return C(`어느 모집단에서 임의추출한 크기가 ${r * r}인 표본의 표본비율 ${PH}을 이용하여 추정한 모비율 ${Pv}에 대한 신뢰도 ${conf} %의 신뢰구간이 ${ms('a <= p <= b')}이다. ${ms('b - a')}의 최댓값은? ${zcond(conf)}`, order.map((i) => qs(vals[i])), order.indexOf(0), {
        explain: `${PHQ} = ${PH}(1 − ${PH}) = −(${PH} − 1/2)² + 1/4이므로 ${PH} = 1/2일 때 가장 크고 그 값은 1/4이다. b − a = 2 × ${zT(conf)} × √(${PHQ}/${r * r}) ≤ 2 × ${zT(conf)} × √(1/${4 * r * r}) = ${qs(right)}이다.`,
        facts: { pick: { expr: `${ZC[conf]}/(100*${r})`, options: order.map((i) => qv(vals[i])) } }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
