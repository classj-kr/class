// 고등학교 확률과 통계 Ⅲ-1-04 「정규분포」 — 실력 문항.
// 아이들이 흔히 잘못 아는 것
//  - 정규분포 N(m, σ²)의 둘째 자리를 표준편차로 읽는다(N(0, σ²/4)의 표준편차는 σ/2).
//  - 대칭을 쓰는 식을 평균과 상관없이 늘 맞다고 여긴다(P(X ≤ u) + P(X ≤ v) = 1은 u + v = 2m일 때만, 「어떤 b에 대하여」 꼴도 b와 상관없이 대칭축이 정해져야 한다).
//  - a < m인데도 P(X ≥ a) = 0.5 − P(a ≤ X ≤ m)으로 뺀다.
//  - 「모두 수리할 수 있다」「모두 빌릴 수 있다」를 어떤 확률변수의 어느 쪽 범위로 옮길지 모른다(취소한 사람 수는 많아야 좋다).
//  - 표준화한 구간의 길이가 일정할 때 확률이 가장 큰 자리(가운데가 평균에 가장 가까운 곳)를 놓친다.
// 실력의 잣대: ① 상황·식의 장치 때문에 배운 뜻을 정확히 대야 풀리는 것 ② 세 단계 넘게 이어 생각해야 풀리는 것.
// ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번. 꼴 목록의 「실력 후보」 가운데 ①8·①20·①23 은 세 단계 안쪽이라 기본(11-3-6a·b.js)에 두었다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, C } = B.kit;
  const { MINUS, Q, V, sup, nb, rt } = B.kit.mid;
  const { ms, fn, nrm, bin, pw, ztab, jh, nC } = B.kit.hs;
  const { UNIT, STD, num, dec, zt, p4, X, Y, Z, Mv, Sv, nX, Pz, Z01, ZT, zp, cdf, zval, zexpr, P0, zSteps, tabOf, probQ, H, numQ, setsQ } = B.kit.u1136;
  const josa = B.kit.josa;
  const fr = (n, d) => (d === 1 ? String(n) : frac(n, d));
  const ZKEYS = [5, 8, 10, 12, 13, 14, 15, 17, 18, 20, 22, 23, 24, 25];
  const fitKeys = (s) => ZKEYS.filter((k) => (k * s) % 10 === 0);
  const ev = () => nb(fn('E') + '(' + X + ')'), sdx = () => nb(Sv + '(' + X + ')');
  // 이항분포 [n, p 분자, p 분모, 평균, 표준편차] — npq 가 제곱수
  function binList(pairs, lo, hi) {
    const out = [];
    for (const [p, q] of pairs) for (let n = 30; n <= 3000; n += 1) {
      if ((n * p) % q) continue;
      const v = n * p * (q - p) / (q * q), s = Math.round(Math.sqrt(v));
      if (Number.isInteger(v) && s * s === v && n * p / q >= 5 && n * (q - p) / q >= 5 && s >= lo && s <= hi) out.push([n, p, q, n * p / q, s]);
    }
    return out;
  }

  // 상자 속 공 두 개를 동시에 꺼낼 때 사건의 확률: [숫자 1·2·3이 적힌 공의 수, 사건, 수, 경우의 수, 전체, n, 평균, 표준편차]
  const BALLS = [];
  for (let c1 = 1; c1 <= 3; c1 += 1) for (let c2 = 1; c2 <= 3; c2 += 1) for (let c3 = 1; c3 <= 3; c3 += 1) {
    const cnt = [c1, c2, c3], tot = (c1 + c2 + c3) * (c1 + c2 + c3 - 1) / 2;
    const pairs = [];
    for (let i = 0; i < 3; i += 1) for (let j = i; j < 3; j += 1) pairs.push([i + 1, j + 1, i === j ? cnt[i] * (cnt[i] - 1) / 2 : cnt[i] * cnt[j]]);
    const events = [];
    for (let s = 3; s <= 5; s += 1) events.push(['le', s, pairs.filter(([a, b]) => a + b <= s).reduce((t, x) => t + x[2], 0)]);
    events.push(['same', 0, pairs.filter(([a, b]) => a === b).reduce((t, x) => t + x[2], 0)]);
    for (const [kind, s, fav] of events) {
      if (fav <= 0 || fav >= tot) continue;
      const pq = Q(fav, tot);
      for (let n = 30; n <= 900; n += 1) {
        if ((n * pq.p) % pq.q) continue;
        const v = n * pq.p * (pq.q - pq.p) / (pq.q * pq.q), sd = Math.round(Math.sqrt(v));
        if (Number.isInteger(v) && sd * sd === v && sd >= 4 && sd <= 12 && n * pq.p / pq.q >= 5 && n * (pq.q - pq.p) / pq.q >= 5) { BALLS.push({ cnt, kind, s, fav, tot, n, m: n * pq.p / pq.q, sd, pq }); break; }
      }
    }
  }

  // 주사위 놀이의 이항분포(성공 확률 1/6, 1/3)
  const GAME = { 6: binList([[1, 6]], 4, 15), 3: binList([[1, 3]], 4, 15) };
  // 두 자리 표(원문 학기 시험처럼): z 와 P(0 ≤ Z ≤ z)(소수 둘째 자리)
  const ZT2 = { 5: 19, 10: 34, 15: 43, 20: 48 };
  const tab2 = () => ztab([[0.5, '0.19'], [1, '0.34'], [1.5, '0.43'], [2, '0.48']]);
  // 세 자리 표(2024 수능 30번처럼)
  const ZT3 = { 2: 79, 4: 155, 5: 191, 6: 226, 8: 288, 10: 341, 12: 385, 14: 419, 15: 433, 16: 445 };
  const p3 = (n) => '0.' + String(n).padStart(3, '0');

  B.addGroup(UNIT, { id: 'hard', title: '실력 문제', standard: STD, types: [
    H('hard-symtrap', '정규분포의 대칭으로 확률 식의 참·거짓 가리기', '①4', (d) => {
      const m = d.int(3, 12);
      // ㄱ: a 가 평균의 어느 쪽인가에 따라 0.5에서 빼는가 더하는가
      const ok1 = d.bool(), a = ok1 ? m + d.int(1, 6) : m - d.int(1, 6);
      const r1 = ok1
        ? { h: `${Pz('X >= ' + a)} = 0.5 ${MINUS} ${Pz(m + ' <= X <= ' + a)}`, ok: true, why: `${a} &gt; ${m}이므로 ${Pz('X >= ' + a)} = ${Pz('X >= ' + m)} ${MINUS} ${Pz(m + ' <= X <= ' + a)} = 0.5 ${MINUS} ${Pz(m + ' <= X <= ' + a)}이다.` }
        : { h: `${Pz('X >= ' + a)} = 0.5 ${MINUS} ${Pz(a + ' <= X <= ' + m)}`, ok: false, why: `${a} &lt; ${m}이므로 ${Pz('X >= ' + a)} = ${Pz(a + ' <= X <= ' + m)} + ${Pz('X >= ' + m)} = 0.5 + ${Pz(a + ' <= X <= ' + m)}이다.` };
      // ㄴ: 두 수가 평균에 대칭인가
      const ok2 = d.bool(), u = m - d.int(1, 7), v = ok2 ? 2 * m - u : 2 * m - u + d.pick([-2, -1, 1, 2]);
      const r2 = { h: `${Pz('X <= ' + num(u))} + ${Pz('X <= ' + num(v))} = 1`, ok: ok2,
        why: ok2 ? `${num(u)}, ${jh(num(v), '은/는')} 평균 ${m}에 대하여 대칭이므로 ${Pz('X <= ' + num(v))} = ${Pz('X >= ' + num(u))}, 합은 1이다.` : `두 식의 합이 1이려면 ${num(u)}, ${num(v)}의 가운데 ${jh(dec((u + v) / 2), '이/가')} 평균이어야 하는데 평균은 ${m}이다.` };
      // ㄷ: 「어떤 실수 b」 — b 와 상관없이 가운데 c 가 평균일 때만 성립한다
      const ok3 = d.bool(), c = ok3 ? m : m + d.pick([-2, -1, 1, 2]);
      const r3 = { h: `어떤 실수 ${V('b')}에 대하여 ${Pz('X <= b + ' + c)} + ${Pz('X <= ' + c + ' - b')} = 1이다.`, ok: ok3,
        why: ok3 ? `${ms('b + ' + c)}, ${ms(c + ' - b')}의 가운데가 ${jh(String(c), '으로/로')} 평균과 같으므로 모든 ${V('b')}에 대하여 성립한다.` : `두 수 ${ms('b + ' + c)}, ${ms(c + ' - b')}의 가운데는 ${V('b')}와 상관없이 ${c}이고 평균 ${jh(String(m), '과/와')} 다르므로 어떤 ${V('b')}에 대해서도 성립하지 않는다.` };
      return setsQ(d, `확률변수 ${jh(X, '이/가')} 정규분포 ${jh(nrm(m, 'σ^2'), '을/를')} 따를 때, 옳은 것만을 보기에서 있는 대로 고른 것은? (단, ${nb(Sv + ' &gt; 0')})`, [r1, r2, r3], {});
    }),

    H('hard-twoabs', '평균이 같고 표준편차가 다른 두 정규분포의 대칭 구간 견주기', '①24', (d) => {
      const k = d.pick([2, 3]), q10 = d.pick([6, 7, 8, 9]), ok3 = d.bool();
      const rTrue = 2 * q10 - 10, rFalse = d.pick([10 - q10, q10 - 5, 2 * q10 - 10 + d.pick([-1, 1])].filter((t) => t > 0 && t < 10 && t !== rTrue));
      if (!rFalse) return null;
      const r = ok3 ? rTrue : rFalse;
      const g1 = d.pick([{ h: ms('a > b'), ok: true }, { h: nb(ms('a = ' + k + 'b')), ok: true }, { h: ms('a < b'), ok: false }, { h: nb(ms('b = ' + k + 'a')), ok: false }]);
      const ok2 = d.bool();
      const r2h = `${Pz('Y > ' + frac(V('a'), k))} = ${Pz('Z > ' + frac(ok2 ? k + V('b') : V('b'), Sv))}`;
      const rows = [
        { h: g1.h, ok: g1.ok, why: `${Pz('|X| <= a')} = ${Pz('|Z| <= ' + frac(V('a'), Sv))}, ${Pz('|Y| <= b')} = ${Pz('|Z| <= ' + frac(k + V('b'), Sv))}이므로 ${nb(ms('a = ' + k + 'b'))}이다. 따라서 ${jh(g1.h, '은/는')} ${g1.ok ? '옳다' : '옳지 않다'}.` },
        { h: r2h, ok: ok2, why: `${frac(V('a'), k)} = ${V('b')}이고 ${Y}의 표준편차는 ${frac(Sv, k)}이므로 ${Pz('Y > b')} = ${Pz('Z > ' + frac(k + V('b'), Sv))}이므로 이 식은 ${ok2 ? '옳다' : '옳지 않다'}.` },
        { h: `${nb(Pz('Y <= b') + ' = ' + dec(q10 / 10))}이면 ${nb(Pz('|X| <= a') + ' = ' + dec(r / 10))}이다.`, ok: ok3, why: `${Pz('0 <= Y <= b')} = ${dec(q10 / 10)} ${MINUS} 0.5 = ${dec(q10 / 10 - 0.5)}이므로 ${Pz('|X| <= a')} = ${Pz('|Y| <= b')} = 2 × ${dec(q10 / 10 - 0.5)} = ${dec(rTrue / 10)}이다.` }
      ];
      return setsQ(d, `두 확률변수 ${X}, ${jh(Y, '이/가')} 각각 정규분포 ${nrm(0, 'σ^2')}, ${jh(nrm(0, frac(ms('σ^2'), k * k)), '을/를')} 따르고, 확률변수 ${jh(Z, '이/가')} 표준정규분포 ${jh(Z01, '을/를')} 따른다. 두 양수 ${V('a')}, ${V('b')}에 대하여 ${nb(Pz('|X| <= a') + ' = ' + Pz('|Y| <= b'))}일 때, 옳은 것만을 보기에서 있는 대로 고른 것은?`, rows, {});
    }),

    H('hard-pdfeq', '확률밀도함수의 같은 값으로 두 평균을 찾아 확률 구하기', '①25', (d) => {
      const p = d.int(1, 3), q = p + d.pick([2, 4]), r = d.int(p + 1, q - 1), z0 = d.pick([5, 10, 15, 20]);
      const Mh = (p + q) / 2, e = (q - p) / 2, k = z0 / 10 / e;           // m₁ = Ma, m₂ = (M + r − q)a, a/σ = k
      const m2a = Mh + r - q;
      const cands = [];
      for (let s = 0; s <= q + 2; s += 1) for (let t = s + 1; t <= q + 3; t += 1) {
        const zs = (s - Mh) * k * 10, zT = (t - Mh) * k * 10;
        if ([zs, zT].every((z) => Number.isInteger(Math.round(z * 1e6) / 1e6) && Math.abs(z) <= 30 && Math.round(z) % 5 === 0) && !(zs === 0 && zT === 0) && zs < zT) cands.push([s, t, Math.round(zs), Math.round(zT)]);
      }
      const good = cands.filter(([, , a1, b1]) => a1 !== 0 && b1 !== 0);
      if (!good.length) return null;
      const [s, t, lo, hi] = d.pick(good), v = zval(lo, hi);
      const aH = (c) => (c === 0 ? '0' : c === 1 ? V('a') : c + V('a'));
      const m1H = ms('m_1'), m2H = ms('m_2'), F = ms('f'), G = ms('g');
      return probQ(d, `정규분포 ${jh(nrm('m_1', 'σ^2'), '을/를')} 따르는 확률변수 ${jh(X, '과/와')} 정규분포 ${jh(nrm('m_2', 'σ^2'), '을/를')} 따르는 확률변수 ${Y}의 확률밀도함수를 각각 ${ms('f(x)')}, ${ms('g(x)')}라 하자. 양수 ${V('a')}에 대하여 ${nb(F + '(' + aH(p) + ') = ' + F + '(' + aH(q) + ') = ' + G + '(' + aH(r) + ')')}, ${nb(fn('P') + '(' + Y + ' ≤ ' + aH(r) + ') = ' + p4(cdf(z0)))}이고 ${nb(m1H + ' &gt; ' + m2H)}일 때, ${nb(fn('P') + '(' + aH(s) + ' ≤ ' + X + ' ≤ ' + aH(t) + ')')}의 값을 다음 표준정규분포표를 이용하여 구한 것은? (단, ${jh(Sv, '은/는')} 양수이다.)`, v, zexpr(lo, hi), [zp(lo), zp(hi)], {
        figure: tabOf(d, [z0, lo, hi], 1),
        explain: `${F}의 그래프는 직선 ${nb(ms('x = ') + m1H)}에 대하여 대칭이고 ${nb(F + '(' + aH(p) + ') = ' + F + '(' + aH(q) + ')')}이므로 ${nb(m1H + ' = ' + aH(Mh))}이다. 두 곡선의 표준편차가 같으므로 ${G}의 그래프는 ${F}의 그래프를 평행이동한 것이고, ${nb(m1H + ' &gt; ' + m2H)}에서 ${nb(G + '(' + aH(r) + ') = ' + F + '(' + aH(q) + ')')}, 곧 ${nb(m2H + ' = ' + aH(m2a))}이다. ${nb(fn('P') + '(' + Y + ' ≤ ' + aH(r) + ') = ' + fn('P') + '(' + Z + ' ≤ ' + frac(aH(r) + ' ' + MINUS + ' ' + aH(m2a), Sv) + ')')} = ${p4(cdf(z0))}이고 표에서 ${frac(e === 1 ? V('a') : e + V('a'), Sv)} = ${zt(z0)}이다. 따라서 ${nb(fn('P') + '(' + aH(s) + ' ≤ ' + X + ' ≤ ' + aH(t) + ')')} = ${Pz(zt(lo) + ' <= Z <= ' + zt(hi))} = ${zSteps(lo, hi)}이다.`
      });
    }),

    H('hard-ballbin', '한 번의 확률을 경우의 수로 구한 뒤 이항분포를 정규분포로 근사하기', '①29', (d) => {
      const b = d.pick(BALLS), keys = fitKeys(b.sd);
      if (!keys.length) return null;
      const kind = d.int(0, 2), [lo, hi] = kind === 0 ? [-d.pick(keys), d.pick(keys)] : kind === 1 ? [d.pick([1, -1]) * d.pick(keys), null] : [null, d.pick([1, -1]) * d.pick(keys)];
      const at = (z) => b.m + z * b.sd / 10, v = zval(lo, hi);
      const rangeT = lo == null ? `${at(hi)}회 이하` : hi == null ? `${at(lo)}회 이상` : `${at(lo)}회 이상 ${at(hi)}회 이하`;
      const ballT = b.cnt.map((c, i) => `숫자 ${josa(i + 1, '이/가')} 적힌 공 ${c}개`).join(', '), N = b.cnt[0] + b.cnt[1] + b.cnt[2];
      const evT = b.kind === 'same' ? '두 수가 서로 같은' : `두 수의 합이 ${b.s} 이하인`;
      const body = lo == null ? 'X <= ' + at(hi) : hi == null ? 'X >= ' + at(lo) : at(lo) + ' <= X <= ' + at(hi);
      return probQ(d, `${ballT}가 들어 있는 상자가 있다. 이 상자에서 공 2개를 동시에 꺼내어 공에 적힌 수를 확인한 후 다시 넣는 시행을 ${b.n}회 반복할 때, 꺼낸 공에 적힌 ${evT} 횟수가 ${rangeT}일 확률을 다음 표준정규분포표를 이용하여 구한 것은?`, v, zexpr(lo, hi), [zp(lo || 0), zp(hi || 0)], {
        figure: tabOf(d, [lo || 0, hi || 0]),
        explain: `공 2개를 꺼내는 경우는 ${nC(N, 2)} = ${b.tot}가지이고, 그중 ${evT} 경우는 ${b.fav}가지이므로 한 번의 시행에서 그 확률은 ${fr(b.pq.p, b.pq.q)}이다. 그 횟수를 ${jh(X, '이라/라')} 하면 ${jh(X, '은/는')} 이항분포 ${jh(bin(b.n, fr(b.pq.p, b.pq.q)), '을/를')} 따르고 ${ev()} = ${b.m}, ${sdx()} = ${b.sd}이므로 근사적으로 ${jh(nX(b.m, b.sd), '을/를')} 따른다. 따라서 ${Pz(body)} = ${zSteps(lo, hi)}이다.`
      });
    }),

    H('hard-defect', '정규분포로 구한 불량률로 다시 이항분포를 정규분포로 근사하기', '①30', (d) => {
      const m = d.int(100, 300), s = d.int(3, 12), cut = d.bool() ? m - 2 * s : m + 2 * s, low = cut < m;
      const [n, mY, sY] = d.pick([[2500, 50, 7], [10000, 200, 14]]);
      const zk = d.pick([5, 10, 15, 20]), up = d.bool(), lim = up ? mY - zk * sY / 10 : mY + zk * sY / 10;
      if (!Number.isInteger(lim)) return null;
      const v = 50 + ZT2[zk];                                                       // 백분의 몇
      const show = (x) => '0.' + String(x).padStart(2, '0');
      const wrong = [100 - v, ZT2[zk], 50 - ZT2[zk], 2 * ZT2[zk], 50 + ZT2[zk === 20 ? 15 : zk + 5], 50 + ZT2[zk === 5 ? 10 : zk - 5]].filter((x) => x > 0 && x < 100 && x !== v);
      const opts = [v].concat(d.shuffle([...new Set(wrong)]).slice(0, 4)).sort((x, y) => x - y);
      if (opts.length < 5) return null;
      return C(`어느 공장에서 생산하는 제품 A의 무게는 평균이 ${m} g, 표준편차가 ${s} g인 정규분포를 따르고, 이 공장에서는 무게가 ${cut} g ${low ? '미만' : '초과'}인 제품 A를 불량품으로 판정한다. 하루에 생산한 제품 A ${n}개 가운데 불량품이 ${lim}개 ${up ? '이상' : '이하'}일 확률을 다음 표준정규분포표를 이용하여 구한 것은?`, opts.map(show), opts.indexOf(v), {
        figure: tab2(),
        explain: `무게를 ${X}라 하면 불량품일 확률은 ${Pz(low ? 'X < ' + cut : 'X > ' + cut)} = ${Pz(low ? 'Z < -2' : 'Z > 2')} = 0.5 ${MINUS} 0.48 = 0.02이다. 불량품의 수를 ${Y}라 하면 ${jh(Y, '은/는')} 이항분포 ${bin(n, '0.02')}를 따르고 평균은 ${n} × 0.02 = ${mY}, 표준편차는 ${rt(n + ' × 0.02 × 0.98')} = ${sY}이므로 근사적으로 ${jh(nX(mY, sY), '을/를')} 따른다. 따라서 ${Pz((up ? 'Y >= ' : 'Y <= ') + lim)} = ${Pz((up ? 'Z >= ' : 'Z <= ') + MINUS.repeat(up ? 1 : 0) + zt(zk))} = 0.5 + ${show(ZT2[zk])} = ${show(v)}이다.`,
        facts: { pick: { expr: `50+${ZT2[zk]}`, options: opts }, unseen: [50] }
      });
    }),

    H('hard-range', '조건을 횟수의 범위로 바꾸어 이항분포를 정규분포로 근사하기', '①31', (d, n) => {
      if (n === 0) {
        const [N, pc, mm, sg] = d.pick([[400, 10, 40, 6], [900, 10, 90, 9], [100, 20, 20, 4], [400, 20, 80, 8], [225, 20, 45, 6], [625, 20, 125, 10]]);
        const keys = fitKeys(sg);
        if (!keys.length) return null;
        const k = d.pick(keys) * d.pick([1, 1, -1]), x0 = mm + k * sg / 10, cap = N - x0, v = zval(k, null);
        const ctx = d.pick([
          { lead: `어느 자동차 정비 공장에서 하루에 수리할 수 있는 자동차는 ${cap}대이다. 어느 날 이 공장에 자동차 수리를 예약한 손님은 ${N}명이고, 손님 한 명이 예약을 취소할 확률은 ${pc} %이다.`, ask: '이날 예약한 손님의 자동차를 모두 수리할 수 있을 확률', note: '(단, 손님 한 명이 맡기는 자동차는 1대이고, 손님마다 예약 취소는 서로 영향을 주지 않는다.)' },
          { lead: `어느 체험 학습장은 하루에 ${cap}명까지 받을 수 있다. 어느 날 이 학습장에 체험을 예약한 사람은 ${N}명이고, 한 사람이 예약을 취소할 확률은 ${pc} %이다.`, ask: '이날 예약하고 온 사람이 모두 체험할 수 있을 확률', note: '(단, 사람마다 예약 취소는 서로 영향을 주지 않는다.)' }
        ]);
        return probQ(d, `${ctx.lead} ${jh(ctx.ask, '을/를')} 다음 표준정규분포표를 이용하여 구한 것은? ${ctx.note}`, v, zexpr(k, null), [zp(k)], {
          figure: tabOf(d, [k]), rule: 'range-cancel',
          explain: `예약을 취소하는 사람의 수를 ${jh(X, '이라/라')} 하면 ${jh(X, '은/는')} 이항분포 ${jh(bin(N, dec(pc / 100)), '을/를')} 따르고 ${ev()} = ${mm}, ${sdx()} = ${sg}이므로 근사적으로 ${jh(nX(mm, sg), '을/를')} 따른다. 모두 받으려면 오는 사람이 ${cap} 이하, 곧 ${N} ${MINUS} ${X} ≤ ${cap}에서 ${nb(X + ' ≥ ' + x0)}이어야 한다. 따라서 ${Pz('X >= ' + x0)} = ${Pz('Z >= ' + zt(k))} = ${zSteps(k, null)}이다.`
        });
      }
      const [pp, gain, eye] = d.pick([[6, 5, '6의 눈'], [3, 2, '3의 배수의 눈']]);
      const pool = GAME[pp];
      const r = d.pick(pool), [N, , , mm, sg] = r, keys = fitKeys(sg);
      if (!keys.length || N > 3000) return null;
      const k = d.pick(keys), x0 = mm + k * sg / 10, S = (gain + 1) * x0 - N, v = zval(k, null);
      return probQ(d, `한 개의 주사위를 던져 ${eye}이 나오면 ${gain}점을 얻고, 그 외의 눈이 나오면 1점을 잃는 놀이가 있다. 0점에서 시작하여 이 놀이를 ${N}번 할 때, 점수가 ${S}점 이상일 확률을 다음 표준정규분포표를 이용하여 구한 것은?`, v, zexpr(k, null), [zp(k)], {
        figure: tabOf(d, [k]), rule: 'range-game',
        explain: `${eye}이 나오는 횟수를 ${jh(X, '이라/라')} 하면 점수는 ${gain}${X} ${MINUS} (${N} ${MINUS} ${X}) = ${gain + 1}${X} ${MINUS} ${N}이고, ${nb((gain + 1) + X + ' ' + MINUS + ' ' + N + ' ≥ ' + S)}에서 ${nb(X + ' ≥ ' + x0)}이다. ${jh(X, '은/는')} 이항분포 ${jh(bin(N, frac(1, pp)), '을/를')} 따르고 ${ev()} = ${mm}, ${sdx()} = ${sg}이므로 근사적으로 ${jh(nX(mm, sg), '을/를')} 따른다. 따라서 ${Pz('X >= ' + x0)} = ${Pz('Z >= ' + zt(k))} = ${zSteps(k, null)}이다.`
      });
    }, { count: 2 }),

    H('hard-cars', '확률 조건을 만족시키도록 준비할 최소 개수 구하기', '①32', (d) => {
      const [N, pc, mm, sg] = d.pick([[400, 50, 200, 10], [100, 50, 50, 5], [900, 50, 450, 15], [1600, 50, 800, 20], [400, 20, 80, 8], [625, 20, 125, 10], [225, 20, 45, 6]]);
      const [z0, pz, want] = d.pick([[1.65, '0.45', '0.95'], [1.28, '0.40', '0.90'], [2.33, '0.49', '0.99']]);
      const t = mm + z0 * sg, need = Math.ceil(t - 1e-9), gap = t - Math.floor(t);
      if (gap < 0.05 || gap > 0.95) return null;
      return numQ(`어느 렌터카 회사를 하루에 찾아오는 손님 ${N}명은 각각 ${pc} %의 확률로 자동차를 빌린다고 한다. 자동차를 빌리려는 손님이 모두 빌릴 수 있을 확률이 ${want} 이상이 되도록 할 때, 이 회사가 준비해야 하는 자동차는 최소 몇 대인지 구하시오. (단, 손님 한 명은 자동차를 1대만 빌리고, ${jh(Z, '이/가')} 표준정규분포를 따르는 확률변수일 때 ${jh(nb(Pz('0 <= Z <= ' + z0) + ' = ' + pz), '으로/로')} 계산한다.)`, need, {
        unit: '대',
        explain: `자동차를 빌리려는 손님의 수를 ${jh(X, '이라/라')} 하면 ${jh(X, '은/는')} 이항분포 ${jh(bin(N, dec(pc / 100)), '을/를')} 따르고 ${ev()} = ${mm}, ${sdx()} = ${sg}이므로 근사적으로 ${jh(nX(mm, sg), '을/를')} 따른다. 자동차가 ${V('a')}대일 때 모두 빌릴 수 있으려면 ${nb(X + ' ≤ ' + V('a'))}이므로 ${nb(Pz('X <= a') + ' = ' + Pz('Z <= ' + frac(ms('a - ' + mm), sg)) + ' ≥ ' + want)}, 곧 ${frac(ms('a - ' + mm), sg)} ≥ ${z0}이어야 한다. ${nb(ms('a ≥ ' + mm + ' + ' + z0 + ' × ' + sg) + ' = ' + dec(t))}이므로 최소 ${need}대이다.`,
        value: `(${N}*${pc}/100+${z0}*(${N}*${pc}/100*(100-${pc})/100)**0.5)-(${N}*${pc}/100+${z0}*(${N}*${pc}/100*(100-${pc})/100)**0.5)%1+1`, derived: [100, 0.5]
      });
    }),

    H('hard-csat19', '두 정규분포의 확률의 합 조건으로 다른 정규분포의 확률 구하기', '심1', (d) => {
      const m1 = d.int(5, 20), s1 = d.pick([2, 3, 4, 5, 6]), dd = d.int(1, 2 * s1), w = Q(dd, s1);
      if (w.q === 1) return null;
      const z = d.pick([15, 20, 25]), c = Q(z * w.q - 10 * w.p, 10 * w.q);              // z/10 − w
      if (c.p <= 0) return null;
      const cH = c.q === 1 ? (c.p === 1 ? '' : c.p) + 'σ' : frac((c.p === 1 ? '' : c.p) + Sv, c.q);
      const v = 5000 + zp(z), half = frac(1, 2);
      return probQ(d, `확률변수 ${jh(X, '은/는')} 평균이 ${m1}, 표준편차가 ${s1}인 정규분포를 따르고, 확률변수 ${jh(Y, '은/는')} 평균이 ${Mv}, 표준편차가 ${Sv}인 정규분포를 따른다. 두 확률변수 ${X}, ${jh(Y, '이/가')} ${jh(nb(Pz((m1 - dd) + ' <= X <= ' + m1) + ' + ' + Pz('Y >= ' + m1) + ' = ' + half), '을/를')} 만족시킬 때, ${nb(fn('P') + '(' + Y + ' ≤ ' + m1 + ' + ' + (c.q === 1 ? ms(cH) : cH) + ')')}의 값을 다음 표준정규분포표를 이용하여 구한 것은?`, v, `5000+${zp(z)}`, [zp(z), zp(z === 25 ? 20 : z + 5)], {
        figure: ztab([10, 15, 20, 25].map((k) => [k / 10, ZT[k] / 10000])),
        explain: `${Pz((m1 - dd) + ' <= X <= ' + m1)} = ${Pz(MINUS + frac(dd, s1) + ' <= Z <= 0')} = ${Pz('0 <= Z <= ' + frac(w.p, w.q))}이고 ${Pz('Y >= ' + m1)} = ${Pz('Z >= ' + frac(ms(m1 + ' - m'), Sv))}이다. 합이 ${half}이므로 ${Pz('Z >= ' + frac(ms(m1 + ' - m'), Sv))} = 0.5 ${MINUS} ${Pz('0 <= Z <= ' + frac(w.p, w.q))} = ${Pz('Z >= ' + frac(w.p, w.q))}, 곧 ${frac(ms(m1 + ' - m'), Sv)} = ${frac(w.p, w.q)}이다. ${nb(Mv + ' = ' + m1 + ' ' + MINUS + ' ' + frac(w.p + Sv, w.q))}이므로 ${nb(fn('P') + '(' + Y + ' ≤ ' + m1 + ' + ' + (c.q === 1 ? ms(cH) : cH) + ')')} = ${Pz('Z <= ' + zt(z))} = 0.5 + ${p4(zp(z))} = ${p4(v)}이다.`
      });
    }),

    H('hard-csat30', '평균·표준편차에 t가 든 정규분포에서 구간 확률의 최댓값', '심2', (d) => {
      const [mu, kk] = d.pick([[1, 5], [2, 5], [1, 2], [3, 5], [2, 10], [3, 6]]), t0 = mu / kk, a = Math.round((1 - t0) * 10), b = Math.round((1 + t0) * 10);
      const need = [a, b], extra = d.shuffle(Object.keys(ZT3).map(Number).filter((x) => !need.includes(x))).slice(0, 3);
      const rows = need.concat(extra).sort((x, y) => x - y).map((x) => [x / 10, p3(ZT3[x])]), k1000 = ZT3[a] + ZT3[b];
      return numQ(`양수 ${V('t')}에 대하여 확률변수 ${jh(X, '이/가')} 정규분포 ${jh(nrm(mu, ms('t^2')), '을/를')} 따른다. ${nb(Pz('X <= ' + kk + 't') + ' ≥ ' + frac(1, 2))}이 되도록 하는 모든 양수 ${V('t')}에 대하여 ${Pz('t^2 - t + ' + mu + ' <= X <= t^2 + t + ' + mu)}의 최댓값을 다음 표준정규분포표를 이용하여 구한 값을 ${V('k')}라 할 때, ${nb('1000 × ' + V('k'))}의 값을 구하시오.`, k1000, {
        figure: ztab(rows),
        explain: `평균이 ${mu}이므로 ${nb(Pz('X <= ' + kk + 't') + ' ≥ ' + frac(1, 2))}에서 ${nb(ms(kk + 't >= ' + mu))}, 곧 ${nb(ms('t >= ') + fr(Q(mu, kk).p, Q(mu, kk).q))}이다. 표준화하면 ${Pz('t^2 - t + ' + mu + ' <= X <= t^2 + t + ' + mu)} = ${Pz('t - 1 <= Z <= t + 1')}이고, 길이가 2로 일정하므로 가운데 ${jh(V('t'), '이/가')} 0에 가까울수록 크다. 따라서 ${nb(ms('t = ') + fr(Q(mu, kk).p, Q(mu, kk).q))}일 때 최대이고 ${nb(ms('k') + ' = ' + Pz(zt(-a) + ' <= Z <= ' + zt(b)))} = ${p3(ZT3[a])} + ${p3(ZT3[b])} = ${dec(k1000 / 1000)}이므로 ${nb('1000 × ' + V('k') + ' = ' + k1000)}이다.`,
        value: `1000*(${p3(ZT3[a])}+${p3(ZT3[b])})`
      });
    })
  ] });
})(typeof window !== 'undefined' ? window : globalThis);
