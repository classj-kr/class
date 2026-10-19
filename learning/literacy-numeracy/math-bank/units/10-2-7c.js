// 고등학교 1학년 2학기(공통수학2) Ⅲ-2 유리함수와 무리함수 — 실력 문제.
// 단원 틀·싣는 기준·뺀 것과 까닭은 10-2-7a.js 머리에 적었다. 도구는 B.kit.m1027(a 파일)과 B.kit.m1027b(b 파일)를 쓴다.
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것
//  - 유리함수의 그래프의 점근선은 분모를 0으로 하는 값과 「분자의 상수항」이라고 여긴다(분모의 x의 계수로 나누는 것을 빠뜨린다).
//  - y = f(x)의 그래프와 그 역함수의 그래프의 교점은 모두 직선 y = x 위에 있다고 여긴다(감소하는 함수는 그 밖에서도 만난다).
//  - f(f(x)) = x 를 「f(x) = x」로 읽는다(f = f⁻¹ 이라는 뜻이다).
//  - 정의역과 치역이 같다는 조건을 「점근선이 같다」로 읽지 못한다(정의역 {x ≠ p}, 치역 {y ≠ q} 에서 p = q).
//  - 정해진 범위에서의 최대·최소를 늘 범위의 왼쪽 끝·오른쪽 끝에 두고, 증가·감소를 따지지 않는다.
//  - 점근선의 교점을 지나는 직선은 기울기에 따라 그래프와 만나지 않을 수도 있다는 것, 점근선 자체(기울기 0)도 만나지 않는다는 것을 놓친다.
//  - 무리함수와 직선이 두 점에서 만나는 범위에서 끝점을 지날 때(등호)와 접할 때(등호 없음)를 가리지 않는다.
//  - √(A²) 를 A 로 바로 적는다(A 의 부호를 보지 않는다).
// 실력에 둔 까닭: ① 문제의 장치에 함정이 있어 배운 뜻을 정확히 대야 풀리는 것, ② 세 단계 넘게 이어 생각해야 풀리는 것만 남겼다(유형마다 주석).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, N, M, C, F, inline } = B.kit;
  const { LAB, MINUS, gcd, Q, isInt, nb, V, sup, tag, ex, nz, pm, poly, plane, rt, radAns, sys, sqParts } = B.kit.mid;
  const K = B.kit.m1027, K2 = B.kit.m1027b;
  const { S4, S5, H, stripH, X, Y, X2, Av, Bv, Cv, Dv, Kv, Mv, Nv, Pv, Qv, iq, jn, sgnT, L, term, den, is, pt, yIs, fIs, setX, setY, jw, pickFn, vals, numAns, stdR, genR, hypGen, rfig, span, pick2, divisorsOf, quadsRoot, quadText, QN, par0 } = K;
  const { isSq, sqr, R1, rootR, coefIn, rootStd, RT, fInv } = K2;
  const AL = V('α'), BE = V('β');
  // 보기 다섯을 글로 받아 고르기로(정답 하나, 보기는 서로 다르다)
  function pick5(d, text, right, wrongs, o) {
    const pool = d.shuffle(wrongs.filter((w, i, all) => stripH(w) !== stripH(right) && all.findIndex((v) => stripH(v) === stripH(w)) === i)).slice(0, 4);
    if (pool.length < 4) return null;
    const rows = d.shuffle([right].concat(pool));
    return C(text, rows, rows.indexOf(right), Object.assign({}, o, { facts: Object.assign({ truth: rows.map((r) => r === right), want: true }, (o && o.facts) || {}) }));
  }
  const rng = (lo, lr, hr, hi) => nb(`${lo} ${RT[lr]} ${Kv} ${RT[hr]} ${hi}`);   // 「lo < k ≤ hi」

  const hard = [
    // ① 그림에서 점근선과 절편의 부호를 읽어 계수 사이의 관계를 가린다(분모의 계수로 나눈 비만 정해진다는 뜻).
    H('hard-r-coef-sign', '그래프에서 유리함수의 계수 사이의 관계 가리기', '①25', (d) => {
      const p = nz(d, -3, 3), q = nz(d, -3, 3), Y0 = nz(d, -4, 4);
      if (Y0 === q || Math.abs(Y0) > 4) return null;
      const Kk = -p * (Y0 - q), X0 = Q(Y0 * p, q);
      if (Math.abs(Kk) > 8 || Math.abs(X0.p / X0.q) > 5) return null;
      // 계수 a 를 1로 두면 b = −p, c = q, d = Y0·b. 비·부호는 a 의 크기에 상관없다.
      const st = [
        [`${is(Bv, Cv)}`, -p === q], [`${nb(`${Bv} + ${Cv} = 0`)}`, p === q], [`${nb(`${Av}${Bv} &gt; 0`)}`, -p > 0], [`${nb(`${Av}${Cv} &gt; 0`)}`, q > 0],
        [`${nb(`${Bv}${Cv} &gt; 0`)}`, -p * q > 0], [`${nb(`${frac(Dv, Bv)} &gt; 0`)}`, Y0 > 0], [`${nb(`${frac(Dv, Cv)} &gt; 0`)}`, -Y0 * p / q > 0], [`${nb(`${Av}${Dv} &gt; 0`)}`, -p * Y0 > 0]
      ];
      const yes = d.shuffle(st.filter((s) => s[1])), no = d.shuffle(st.filter((s) => !s[1]));
      if (!yes.length || no.length < 4) return null;
      const rows = d.shuffle([yes[0]].concat(no.slice(0, 4)));
      const xr = span([p, X0.p / X0.q], 2.5), yr = span([q, Y0], 2.5);
      if (xr[1] - xr[0] > 12 || yr[1] - yr[0] > 12) return null;
      const figure = rfig({ x: xr, y: yr, hyps: [{ k: Kk, p, q }] });
      return C(`함수 ${yIs(frac(`${Cv}${X} + ${Dv}`, `${Av}${X} + ${Bv}`))}의 그래프가 그림과 같을 때, 다음 중 옳은 것은? (단, ${Av}, ${Bv}, ${Cv}, ${jw(Dv, '은/는')} 상수이다.)`, rows.map((r) => r[0]), rows.findIndex((r) => r === yes[0]), { figure,
        explain: `점근선은 ${is(X, `${MINUS}${frac(Bv, Av)}`)}, ${is(Y, frac(Cv, Av))}이므로 그림에서 ${is(`${MINUS}${frac(Bv, Av)}`, p)}, ${is(frac(Cv, Av), q)}, 곧 ${is(Bv, term(-p, Av))}, ${is(Cv, term(q, Av))}이다. ${Y}절편은 ${is(frac(Dv, Bv), Y0)}, ${X}절편은 ${is(`${MINUS}${frac(Dv, Cv)}`, X0)}이다. 이것으로 보기를 따지면 옳은 것은 「${yes[0][0]}」이다.`,
        facts: { truth: rows.map((r) => r === yes[0]), want: true } });
    }),
    // ① 「정의역과 치역이 같다」를 p = q 로 읽어야 한다.
    H('hard-r-domain-range', '정의역과 치역이 같은 유리함수의 함숫값', '①27', (d) => {
      const b = nz(d, -5, 5), m = d.until(() => nz(d, -3, 4), (v) => v !== 1), n0 = b * (1 - m), t = d.int(-6, 6);
      if (t === b || t === 0) return null;
      const v = Q(b * t, t - b);
      if (isInt(v) || Math.abs(n0) > 20) return null;
      return numAns(`유리함수 ${jw(fIs(frac(Bv + X, `${X} + 2${Av}`)), '이/가')} 다음 조건을 모두 만족시킬 때, ${V('f')}(${iq(t)})의 값은? (단, ${Av}, ${jw(Bv, '은/는')} 상수이다.)`, v, {
        figure: lines([`㈎ 정의역과 치역이 같다.`, `㈏ 직선 ${jw(yIs(poly([[m, X], [n0, '']])), '은/는')} 함수 ${yIs(`${V('f')}(${X})`)}의 그래프의 두 점근선의 교점을 지난다.`]),
        explain: `${fIs(frac(Bv + X, `${X} + 2${Av}`))}의 정의역은 ${setX(`${X} ≠ ${MINUS}2${Av}인 실수`)}, 치역은 ${setY(`${Y} ≠ ${Bv}인 실수`)}이므로 ㈎에서 ${is(`${MINUS}2${Av}`, Bv)}이다. 두 점근선의 교점 ${jw(pt(Bv, Bv), '이/가')} 직선 위에 있으므로 ${is(Bv, poly([[m, Bv], [n0, '']]))}, ${is(Bv, b)}이다. ${fIs(genR(b, 0, 1, -b))}에서 ${V('f')}(${iq(t)}) = ${iq(v)}이다.`,
        facts: { value: `(${jn(n0)}/(1-(${jn(m)})))*${jn(t)}/(${jn(t)}-${jn(n0)}/(1-(${jn(m)})))` } });
    }),
    // ② 점근선 → 역함수의 값(f⁻¹(0) = r ⇔ f(r) = 0) → 지나는 점 → 함숫값: 네 단계
    H('hard-r-three-cond', '점·점근선·역함수의 값으로 유리함수를 정해 함숫값 구하기', '①28', (d) => {
      const q = nz(d, -4, 4), r = d.int(-4, 4), p = d.int(-4, 4);
      if (p === r) return null;
      const k = -q * (r - p), divs = divisorsOf(k).filter((u) => Math.abs(u) <= 6);
      const [u1, u2] = pick2(d, divs), x1 = p + u1, t = p + u2, y1 = q + k / u1, ft = q + k / u2;
      if (x1 === r || t === r || y1 === 0 || Math.abs(y1) > 12 || Math.abs(ft) > 30) return null;
      const cE = `(${jn(q)}*${jn(x1)}-(${jn(q)})*(${jn(r)}))/(${jn(y1)})-(${jn(x1)})`;
      return N(`함수 ${fIs(frac(`${Av}${X} + ${Bv}`, `${X} + ${Cv}`))}의 그래프는 점 ${jw(pt(x1, y1), '을/를')} 지나고 두 점근선 중 하나가 직선 ${is(Y, q)}이다. ${V('f')}의 역함수 ${fInv}에 대하여 ${nb(`${fInv}(0) = ${iq(r)}`)}일 때, ${V('f')}(${iq(t)})의 값은? (단, ${Av}, ${Bv}, ${jw(Cv, '은/는')} 상수이다.)`, ft, { signed: true,
        explain: `점근선 ${is(Y, Av)}에서 ${is(Av, q)}이다. ${nb(`${fInv}(0) = ${iq(r)}`)}이면 ${nb(`${V('f')}(${iq(r)}) = 0`)}이므로 ${is(`${iq(q)} × ${par0(r)} + ${Bv}`, 0)}, ${is(Bv, -q * r)}이다. 점 ${jw(pt(x1, y1), '을/를')} 지나므로 ${is(Cv, -p)}이고 ${fIs(genR(q, -q * r, 1, -p))}에서 ${V('f')}(${iq(t)}) = ${iq(ft)}이다.`,
        facts: { value: `(${jn(q)}*${jn(t)}-(${jn(q)})*(${jn(r)}))/(${jn(t)}+(${cE}))` } });
    }),
    // ② 점 A가 두 점근선의 교점임을 알아채고(뜻), 거리의 제곱을 세워 산술평균과 기하평균의 관계로 최솟값을 구한다.
    H('hard-r-min-dist', '그래프 위의 점과 두 점근선의 교점 사이의 거리의 최솟값', '①32', (d) => {
      const p = nz(d, -4, 4), q = nz(d, -4, 4), k = nz(d, -8, 8), a = q, b = k - q * p;
      if (Math.abs(b) > 30) return null;
      const kE = `${jn(b)}+${jn(a)}*${jn(p)}`;
      return N(`점 ${jw(`A${pt(p, q)}`, '과/와')} 함수 ${yIs(hypGen(k, p, q))}의 그래프 위의 점 P에 대하여, 점 A를 중심으로 하고 점 P를 지나는 원의 넓이의 최솟값을 ${Kv}π라 할 때, 상수 ${Kv}의 값은?`, 2 * Math.abs(k), {
        explain: `${yIs(hypGen(k, p, q))} = ${stdR(k, p, q)}이므로 A는 두 점근선의 교점이다. P${jw(pt(`${iq(p)} + ${V('t')}`, `${iq(q)} ${k < 0 ? MINUS : '+'} ${frac(Math.abs(k), V('t'))}`), '으로/로')} 놓으면 ${nb(`AP${sup(2)} = ${V('t')}${sup(2)} + ${frac(k * k, V('t') + sup(2))} ≥ 2${rt(`${V('t')}${sup(2)} × ${frac(k * k, V('t') + sup(2))}`)} = ${2 * Math.abs(k)}`)}(산술평균과 기하평균의 관계)이다. 원의 넓이는 ${nb(`π × AP${sup(2)}`)}이므로 최솟값은 ${2 * Math.abs(k)}π이다.`,
        facts: { value: k > 0 ? `2*(${kE})` : `2*(0-(${kE}))`, derived: [2] } });
    }),
    // ① f(f(x)) = x 를 f = f⁻¹ 로 읽어야 한다(「f(x) = x」가 아니다).
    H('hard-r-self-inverse-asym', 'f(f(x)) = x 이고 점근선이 주어진 유리함수의 계수', '①34', (d) => {
      const d0 = nz(d, -3, 3), r = d.until(() => nz(d, -5, 5), (v) => d0 % v !== 0), e = nz(d, -6, 6);
      if (e === d0 * r) return null;
      const a = Q(-d0, r), b = -d0, row = (A, Bb) => `${is(Av, A)}, ${is(Bv, Bb)}`;
      const right = row(a, b), wrongs = [row(Q(-r, d0), b), row(a, -b), row(Q(d0, r), b), row(Q(r), b), row(Q(-d0, r), Q(r)), row(Q(r, d0), -b)];
      return pick5(d, `함수 ${fIs(frac(`${Bv}${X} ${sgnT(e)}`, `${Av}${X} ${sgnT(d0)}`))} ${nb(`(${Av} ≠ 0)`)}의 그래프의 한 점근선의 방정식이 ${is(X, r)}이다. ${nb(`${X} ≠ ${iq(r)}`)}인 모든 실수 ${X}에 대하여 ${jw(nb(`${V('f')}(${V('f')}(${X})) = ${X}`), '이/가')} 성립할 때, 상수 ${Av}, ${Bv}의 값은?`, right, wrongs, {
        explain: `${nb(`${V('f')}(${V('f')}(${X})) = ${X}`)}이면 ${nb(`${V('f')} = ${fInv}`)}이다. 점근선 ${is(X, `${d0 > 0 ? MINUS : ''}${frac(Math.abs(d0), Av)}`)} = ${iq(r)}에서 ${is(Av, a)}이고, 두 점근선의 교점이 직선 ${yIs(X)} 위에 있어야 하므로 ${is(frac(Bv, Av), r)}, ${is(Bv, b)}이다.` });
    }),
    // ② 증가·감소를 a < 0 으로 먼저 정해야 어느 끝이 최솟값인지 안다: 변형 → 증감 → 최솟값으로 a → 최댓값.
    H('hard-r-range-back', '정의역과 치역에서 유리함수의 상수 구하기', '①37', (d) => {
      const m = d.int(1, 4), L0 = -d.int(1, 4), e = L0 * d.int(1, 4), a = -e / L0, w = d.int(1, 5);
      if (a >= 0 || (m * w + e) % (w - a) !== 0) return null;
      const bb = (m * w + e) / (w - a), aE = `0-(${jn(e)})/(${jn(L0)})`;
      return vals(`정의역이 ${setX(`0 ≤ ${X} ≤ ${w}`)}인 함수 ${yIs(frac(L(m, e), `${X} ${MINUS} ${Av}`))}의 치역이 ${setY(`${iq(L0)} ≤ ${Y} ≤ ${Bv}`)}일 때, 상수 ${Av}, ${Bv}의 값을 구하시오. ${nb(`(단, ${Av} &lt; 0)`)}`, [[Av, a], [Bv, bb]], {
        explain: `${yIs(frac(L(m, e), `${X} ${MINUS} ${Av}`))} = ${frac(`${m === 1 ? '' : m}${Av} ${sgnT(e)}`, `${X} ${MINUS} ${Av}`)} + ${m}이고 ${nb(`${Av} &lt; 0`)}이면 ${nb(`${m === 1 ? '' : m}${Av} ${sgnT(e)} &lt; 0`)}이므로 ${nb(`${X} &gt; ${Av}`)}에서 ${Y}의 값은 증가한다. 최솟값은 ${is(X, 0)}일 때 ${is(frac(iq(e), `${MINUS}${Av}`), L0)}에서 ${is(Av, a)}, 최댓값은 ${is(X, w)}일 때 ${is(Bv, bb)}이다.`,
        facts: { calc: [[aE, 0], [`(${m}*${w}+(${jn(e)}))/(${w}-(${aE}))`, 1]] } });
    }),
    // ② 지나는 점으로 b 를 a 로 나타낸 뒤, 증가·감소 두 경우를 따져 맞는 쪽을 고른다.
    H('hard-r-min-back', '지나는 점과 최솟값으로 유리함수의 계수 구하기', '①37', (d) => {
      const c0 = d.int(1, 3), s = 0, t = d.int(2, 4), a = nz(d, -4, 4), k = nz(d, -12, 12), b = k + a * c0;
      const f = (x) => a + k / (x + c0), M0 = Math.min(f(s), f(t));
      if (!Number.isInteger(M0)) return null;
      const x1 = -c0 + d.pick(divisorsOf(k).filter((u) => Math.abs(u) <= 4)), y1 = f(x1);
      if (x1 === s || x1 === t || x1 >= s && x1 <= t || Math.abs(y1) > 15) return null;
      // 두 경우: 감소(k > 0, 최솟값은 x = t) / 증가(k < 0, 최솟값은 x = s). 맞는 경우가 꼭 하나여야 한다.
      const caseA = (end) => { const den0 = end - x1; if (den0 === 0) return null; const aa = (M0 * (end + c0) - y1 * (x1 + c0)) / den0; return aa; };
      const aT = caseA(t), aS = caseA(s), okT = aT != null && (y1 - aT) * (x1 + c0) > 0, okS = aS != null && (y1 - aS) * (x1 + c0) < 0;
      if (okT === okS || !Number.isInteger(k > 0 ? aT : aS)) return null;
      const end = k > 0 ? t : s, aE = `((${jn(M0)})*(${end}+${c0})-(${jn(y1)})*(${jn(x1)}+${c0}))/(${end}-(${jn(x1)}))`;
      return vals(`함수 ${fIs(frac(`${Av}${X} + ${Bv}`, L(1, c0)))}의 그래프가 점 ${jw(pt(x1, y1), '을/를')} 지나고, ${nb(`${s} ≤ ${X} ≤ ${t}`)}에서 이 함수의 최솟값이 ${iq(M0)}일 때, 상수 ${Av}, ${Bv}의 값을 구하시오.`, [[Av, a], [Bv, b]], {
        explain: `점 ${jw(pt(x1, y1), '을/를')} 지나므로 ${is(Bv, poly([[y1 * (x1 + c0), ''], [-x1, Av]]))}이고 ${fIs(`${Av} + ${frac(`${Bv} ${MINUS} ${c0 === 1 ? '' : c0}${Av}`, L(1, c0))}`)}이다. ${nb(`${Bv} ${MINUS} ${c0 === 1 ? '' : c0}${Av} &gt; 0`)}이면 감소하여 ${is(X, t)}에서, ${nb(`&lt; 0`)}이면 증가하여 ${is(X, s)}에서 최솟값을 갖는다. 두 경우를 풀면 ${k > 0 ? '감소' : '증가'}하는 경우만 조건에 맞아 ${is(Av, a)}, ${is(Bv, b)}이다.`,
        facts: { calc: [[aE, 0], [`(${jn(y1)})*(${jn(x1)}+${c0})-(${aE})*(${jn(x1)})`, 1]] } });
    }),
    // ① 직선이 늘 두 점근선의 교점을 지난다는 것, 기울기가 0이면 점근선이라 만나지 않는다는 것을 대야 한다.
    H('hard-r-line-center', '두 점근선의 교점을 지나는 직선과 만나지 않을 조건', '①38', (d) => {
      const q = nz(d, -5, 5), k = nz(d, -6, 6), rows = [nb(`${Mv} ≥ 0`), nb(`${Mv} &gt; 0`), nb(`${Mv} ≤ 0`), nb(`${Mv} &lt; 0`), nb(`${Mv} ≠ 0`)], ans = k < 0 ? 0 : 2;
      const order = d.shuffle([0, 1, 2, 3, 4]);
      return C(`함수 ${yIs(frac(L(q, k), X))}의 그래프와 직선 ${jw(yIs(poly([[1, Mv + X], [q, '']])), '이/가')} 만나지 않도록 하는 실수 ${Mv}의 값의 범위는?`, order.map((i) => rows[i]), order.indexOf(ans), {
        explain: `${yIs(frac(L(q, k), X))} = ${stdR(k, 0, q)}의 두 점근선의 교점은 ${pt(0, q)}이고, 직선은 ${Mv}의 값에 관계없이 이 점을 지난다. ${is(Mv, 0)}이면 직선이 점근선 ${is(Y, q)}이라 만나지 않는다. ${nb(`${Mv} ≠ 0`)}이면 ${is(`${Mv}${X} ${sgnT(q)}`, stdR(k, 0, q))}에서 ${is(`${Mv}${X2}`, k)}이므로 ${jw(Mv, '과/와')} ${iq(k)}의 부호가 같으면 만나고 다르면 만나지 않는다. 따라서 ${rows[ans]}이다.`,
        facts: { truth: order.map((i) => i === ans), want: true } });
    }),
    // ② 정점 → 끝점을 지날 때의 기울기 → 접할 때(판별식)의 기울기 → 범위: 네 단계
    H('hard-r-slope-range', '정점을 지나는 직선이 구간의 그래프와 만나는 기울기의 범위', '①39', (d) => {
      const [Qq, k, dd] = d.pick([[6, 9, 1], [8, 16, 1], [12, 18, 1], [12, 36, 2], [10, 25, 1], [16, 32, 1], [16, 64, 2], [8, 8, 1], [4, 4, 1]]);
      const us = 2 * k / Qq, e = Math.ceil(us) + d.int(0, 2), p = nz(d, -3, 3), sg = pm(d);
      const al = Q(-Qq * Qq, 4 * k), be = Q(k - Qq * dd, dd * dd);
      const [A, Bb] = sg > 0 ? [al, be] : [Q(-be.p, be.q), Q(-al.p, al.q)];
      if (!isInt(A) || !isInt(Bb)) return null;
      const lo = p + dd, hi = p + e, fx = sg > 0 ? stdR(k, p, -Qq) : stdR(-k, p, Qq);
      const line = nb(`${Mv}${X} ${MINUS} ${Y} ${p > 0 ? MINUS : '+'} ${Math.abs(p) === 1 ? '' : Math.abs(p)}${Mv} = 0`);
      const alE = `0-${Qq}*${Qq}/(4*${k})`, beE = `${k}/((${jn(lo)}-(${jn(p)}))*(${jn(lo)}-(${jn(p)})))-${Qq}/(${jn(lo)}-(${jn(p)}))`;
      return vals(`${nb(`${iq(lo)} ≤ ${X} ≤ ${iq(hi)}`)}에서 함수 ${yIs(fx)}의 그래프와 직선 ${jw(line, '이/가')} 만나도록 하는 실수 ${Mv}의 값의 범위가 ${nb(`${AL} ≤ ${Mv} ≤ ${BE}`)}일 때, 상수 ${AL}, ${BE}의 값을 구하시오.`, [[AL, A.p], [BE, Bb.p]], {
        explain: `직선 ${jw(is(Y, `${Mv}(${den(p)})`), '은/는')} ${Mv}의 값에 관계없이 점 ${jw(pt(p, 0), '을/를')} 지난다. 직선이 그래프의 ${sg > 0 ? '왼쪽 끝' : '왼쪽 끝'} 점 ${jw(pt(lo, sg * (k / dd - Qq)), '을/를')} 지날 때 ${is(Mv, sg > 0 ? be : Q(-be.p, be.q))}이고, 그래프에 접할 때 ${jw(is(fx, `${Mv}(${den(p)})`), '을/를')} 정리한 이차방정식의 판별식이 0이 되어 ${is(Mv, sg > 0 ? al : Q(-al.p, al.q))}이다. 그 사이의 기울기에서 만나므로 ${is(AL, A)}, ${is(BE, Bb)}이다.`,
        facts: { calc: sg > 0 ? [[alE, 0], [beE, 1]] : [[`0-(${beE})`, 0], [`0-(${alE})`, 1]], derived: [4] } });
    }),
    // ② 원점을 지나는 두 직선 사이에 곡선을 끼우려면 끝점의 기울기를 비교해야 한다: 그래프 → 원점 → 끝점 기울기 → 최대·최소.
    H('hard-r-squeeze', '유리함수를 원점을 지나는 두 직선 사이에 끼우는 부등식', '①40', (d) => {
      const p = d.int(-1, 2), s = Math.max(p, 0) + d.int(1, 2), t = s + d.int(1, 2), A1 = s * (s - p), A2 = t * (t - p);
      const l = A1 * A2 / gcd(A1, A2), k = l * d.int(1, 2);
      if (k > 72) return null;
      const amax = k / A2, bmin = k / A1;
      return vals(`${nb(`${s} ≤ ${X} ≤ ${t}`)}인 모든 실수 ${X}에 대하여 부등식 ${jw(nb(`${Av}${X} ≤ ${frac(k, p === 0 ? X : den(p))} ≤ ${Bv}${X}`), '이/가')} 성립할 때, 실수 ${Av}의 최댓값과 실수 ${Bv}의 최솟값을 구하시오.`, [[`${Av}의 최댓값`, amax], [`${Bv}의 최솟값`, bmin]], {
        explain: `${nb(`${s} ≤ ${X} ≤ ${t}`)}에서 ${yIs(frac(k, p === 0 ? X : den(p)))}의 그래프는 점 ${pt(s, k / (s - p))}에서 점 ${pt(t, k / (t - p))}까지 내려가는 곡선이다. 원점을 지나는 직선 ${jw(yIs(Av + X), '은/는')} 점 ${jw(pt(t, k / (t - p)), '을/를')} 지날 때보다 기울기가 작거나 같아야 하고, ${jw(yIs(Bv + X), '은/는')} 점 ${jw(pt(s, k / (s - p)), '을/를')} 지날 때보다 기울기가 크거나 같아야 한다. 따라서 ${Av}의 최댓값은 ${frac(k / (t - p), t)} = ${iq(amax)}, ${Bv}의 최솟값은 ${frac(k / (s - p), s)} = ${iq(bmin)}이다.`,
        facts: { calc: [[`${k}/((${t}-(${jn(p)}))*${t})`, 0], [`${k}/((${s}-(${jn(p)}))*${s})`, 1]] } });
    }),
    // ② 세 점의 좌표 → 기울기가 같다 → 이차방정식 → 조건(부호와 서로 다른 점)으로 하나 고르기
    H('hard-r-collinear', 'x절편·y절편·두 점근선의 교점이 한 직선 위에 있을 때', '심2', (d) => {
      const p = nz(d, -4, 4), q = nz(d, -4, 4), k = -p * q, sign = k > 0 ? '&gt;' : '&lt;';
      return N(`좌표평면에서 곡선 ${nb(`${Y} = ${frac(Kv, den(p))} ${sgnT(q)}`)} ${jw(nb(`(${Kv} ${sign} 0)`), '이/가')} ${X}축, ${Y}축과 만나는 점을 각각 A, B라 하고, 이 곡선의 두 점근선의 교점을 C라 하자. 세 점 A, B, C가 한 직선 위에 있도록 하는 상수 ${Kv}의 값은?`, k, { signed: true,
        explain: `A${pt(`${iq(p)} ${q > 0 ? MINUS : '+'} ${Math.abs(q) === 1 ? Kv : frac(Kv, Math.abs(q))}`, 0)}, B${pt(0, `${iq(q)} ${p > 0 ? MINUS : '+'} ${Math.abs(p) === 1 ? Kv : frac(Kv, Math.abs(p))}`)}, C${pt(p, q)}이다. 직선 AC와 직선 BC의 기울기가 같으므로 ${is(frac(`${iq(q * q)}`, Kv), p * p === 1 ? Kv : frac(Kv, iq(p * p)))}, ${is(Kv + sup(2), p * p * q * q)}이다. ${is(Kv, p * q)}이면 곡선이 원점을 지나 A와 B가 같은 점이 되므로 ${nb(`${Kv} ${sign} 0`)}에서 ${is(Kv, k)}이다.`,
        facts: { value: `0-(${jn(p)})*(${jn(q)})` } });
    }),
    // ② k 의 부호에 따라 두 곡선의 교점 수가 바뀐다(경우 나누기) → 연속한 정수의 합을 맞춘다.
    H('hard-r-two-curves', '두 유리함수의 그래프의 교점의 개수와 정수 k', '심3', (d) => {
      const a = d.int(1, 3), dd = d.int(1, 2), n = d.pick([3, 4]), j = d.int(1, n - 1), target = n + j, ans = 1 + j - n;
      const terms = Array.from({ length: n }, (_, i) => `${V('h')}(${Kv}${i ? ' + ' + i : ''})`).join(' + ');
      return N(`두 함수 ${fIs(`${MINUS}${frac(a, X)} + ${Kv}`)}, ${jw(nb(`${V('g')}(${X}) = ${frac(a, den(dd))} ${MINUS} ${Kv}`), '이/가')} 있다. 정수 ${Kv}에 대하여 두 곡선 ${yIs(`${V('f')}(${X})`)}, ${yIs(`${V('g')}(${X})`)}의 교점 중 ${X}좌표가 양수인 점의 개수를 ${V('h')}(${Kv})라 할 때, ${jw(nb(`${terms} = ${target}`), '을/를')} 만족시키는 정수 ${Kv}의 값은?`, ans, { signed: true,
        explain: `${is(`${MINUS}${frac(a, X)} + ${Kv}`, `${frac(a, den(dd))} ${MINUS} ${Kv}`)}에서 ${nb(`2${Kv}${X2} ${MINUS} (2${Kv} ${dd === 1 ? '' : '× ' + dd} + ${2 * a})${X} + ${a * dd} = 0`)}(${Kv} ≠ 0)이고, 판별식이 늘 양수이므로 두 근이 있다. 두 근의 곱이 ${frac(a * dd, `2${Kv}`)}이므로 ${nb(`${Kv} &gt; 0`)}이면 두 근이 모두 양수, ${nb(`${Kv} &lt; 0`)}이면 하나만 양수이고, ${is(Kv, 0)}이면 ${is(X, Q(dd, 2))} 하나이다. 곧 ${nb(`${V('h')}(${Kv}) = 1`)} (${Kv} ≤ 0), ${nb(`${V('h')}(${Kv}) = 2`)} (${Kv} &gt; 0)이다. 합이 ${target}이려면 연속한 ${n}개의 정수 가운데 양수가 ${j}개이어야 하므로 ${is(Kv, ans)}이다.`,
        facts: { check: `h(k)=1 (k<=0), 2 (k>0)` } });
    }),
    // ① √(A²) = |A| — a > 0 이라 a + 1/a 가 양수임을 대야 근호가 벗겨진다(완전제곱을 알아채는 것도 장치이다).
    H('hard-i-perfect-square', '근호 안을 완전제곱식으로 바꾸어 간단히 하기', '②7', (d) => {
      const p = d.int(1, 3), minus = d.bool(), A = Av, PP = [[0.3], [0.7], [1.4], [2.6], [5.1]];
      const xs = p === 1 ? `${A} ${MINUS} ${frac(1, A)}` : `${p}(${A} ${MINUS} ${frac(1, A)})`, xf = (a) => p * (a - 1 / a);
      const right = minus ? { h: frac(2 * p, A), f: (a) => 2 * p / a } : { h: `${2 * p}${A}`, f: (a) => 2 * p * a };
      const wrongs = [minus ? { h: `${2 * p}${A}`, f: (a) => 2 * p * a } : { h: frac(2 * p, A), f: (a) => 2 * p / a }, { h: MINUS + right.h, f: (a) => -right.f(a) },
        { h: frac(2, A), f: (a) => 2 / a }, { h: `${2 * p}${A} ${MINUS} ${frac(2 * p, A)}`, f: (a) => 2 * p * a - 2 * p / a }, { h: p === 1 ? `${A} + ${frac(1, A)}` : `${p}(${A} + ${frac(1, A)})`, f: (a) => p * (a + 1 / a) }, { h: frac(2 * p, A + sup(2)), f: (a) => 2 * p / (a * a) }];
      return pickFn(d, `${nb(`${X} = ${xs}`)} ${nb(`(${Av} &gt; 0)`)}일 때, ${jw(nb(`${rt(`${X2} + ${4 * p * p}`)} ${minus ? MINUS : '+'} ${X}`), '을/를')} ${Av}에 대한 식으로 나타내면?`, { pts: PP,
        explain: `${nb(`${X2} + ${4 * p * p} = ${p === 1 ? '' : p * p}(${A} ${MINUS} ${frac(1, A)})${sup(2)} + ${4 * p * p}`)} ${nb(`= ${p === 1 ? '' : p * p}(${A} + ${frac(1, A)})${sup(2)}`)}이고, ${nb(`${Av} &gt; 0`)}이므로 ${nb(`${A} + ${frac(1, A)} &gt; 0`)}이다. 따라서 ${nb(`${rt(`${X2} + ${4 * p * p}`)} = ${p === 1 ? '' : p}(${A} + ${frac(1, A)})`)}이고 구하는 식은 ${right.h}이다.` }, right, wrongs);
    }),
    // ② 다른 그래프에서 계수(부호·값) → 시작점 → 뻗는 쪽 → 사분면: 네 단계
    H('hard-i-quadrant', '다른 그래프에서 계수를 읽어 무리함수가 지나는 사분면 구하기', '②19', (d, n) => {
      const POOL = [[0], [1], [0, 1], [1, 2], [0, 3], [2, 3], [0, 1, 2], [0, 1, 3], [1, 2, 3], [0, 2, 3]];
      const show = (list) => list.map((i) => QN[i]).join(', ');
      const opts = (pass) => { const key = pass.join(','), others = d.shuffle(POOL.filter((c) => c.join(',') !== key)).slice(0, 4); return d.shuffle(others.concat([pass])); };
      if (n === 0) {
        // 이차함수 y = A(x − P)² + Qv 의 그림(눈금 없음). a = A, b = −2AP, c = AP² + Qv(> 0) → y = √(ax + b) + c: 시작점 (2P, c), a 의 부호 쪽으로 뻗는다.
        const A = d.pick([1, -1]), P = d.pick([-2, -1, 1, 2]), Qv0 = A > 0 ? d.int(-1, 2) : P * P + d.int(1, 5 - P * P), c = A * P * P + Qv0;
        if (c <= 0) return null;
        const pass = [0, 1, 2, 3].filter((i) => quadsRoot(A, 2 * P, c, 1)[i]), rows = opts(pass);
        const figure = plane({ x: [-4, 4], y: [-4, 5], ticks: 'none', grid: false, parabolas: [{ a: A, p: P, q: Qv0 }] });
        return C(`이차함수 ${yIs(`${Av}${X2} + ${Bv}${X} + ${Cv}`)}의 그래프가 그림과 같을 때, 무리함수 ${yIs(`${rt(`${Av}${X} + ${Bv}`)} + ${Cv}`)}의 그래프가 지나는 사분면만을 모두 고른 것은? (단, ${Av}, ${Bv}, ${jw(Cv, '은/는')} 상수이다.)`, rows.map(show), rows.findIndex((r) => r.join(',') === pass.join(',')), { figure,
          explain: `포물선이 ${A > 0 ? '아래로' : '위로'} 볼록하므로 ${nb(`${Av} ${A > 0 ? '&gt;' : '&lt;'} 0`)}, 축이 ${Y}축의 ${P > 0 ? '오른쪽' : '왼쪽'}에 있으므로 ${nb(`${MINUS}${frac(Bv, `2${Av}`)} ${P > 0 ? '&gt;' : '&lt;'} 0`)}, ${Y}절편이 양수이므로 ${nb(`${Cv} &gt; 0`)}이다. ${yIs(`${rt(`${Av}(${X} + ${frac(Bv, Av)})`)} + ${Cv}`)}의 그래프는 점 ${pt(`${MINUS}${frac(Bv, Av)}`, Cv)}에서 시작하여 ${A > 0 ? '오른쪽' : '왼쪽'} 위로 뻗고, ${nb(`${MINUS}${frac(Bv, Av)} ${P > 0 ? '&gt;' : '&lt;'} 0`)}이므로 ${jw(show(pass), '을/를')} 지난다.`,
          facts: { truth: rows.map((r) => r.join(',') === pass.join(',')), want: true, rule: 'iq-0' } });
      }
      if (n === 1) {
        // 유리함수 y = (bx + c)/(x − a)의 그림 → a, b, c → y = √(ax − b) + c
        const a = nz(d, -3, 3), b = nz(d, -3, 3), Y0 = nz(d, -4, 4), c = -a * Y0;
        if (Y0 === b || c === 0 || Math.abs(c) > 9) return null;
        const Kk = c + a * b, pass = [0, 1, 2, 3].filter((i) => quadsRoot(a, b / a, c, 1)[i]), rows = opts(pass);
        if (!POOL.some((x) => x.join(',') === pass.join(','))) return null;
        const xr = span([a], 2.5), yr = span([b, Y0], 2.5);
        if (xr[1] - xr[0] > 12 || yr[1] - yr[0] > 12) return null;
        const figure = rfig({ x: xr, y: yr, hyps: [{ k: Kk, p: a, q: b }], points: [{ x: 0, y: Y0 }] });
        return C(`유리함수 ${yIs(frac(`${Bv}${X} + ${Cv}`, `${X} ${MINUS} ${Av}`))}의 그래프가 그림과 같을 때, 무리함수 ${yIs(`${rt(`${Av}${X} ${MINUS} ${Bv}`)} + ${Cv}`)}의 그래프가 지나는 사분면만을 모두 고른 것은? (단, ${Av}, ${Bv}, ${jw(Cv, '은/는')} 상수이다.)`, rows.map(show), rows.findIndex((r) => r.join(',') === pass.join(',')), { figure,
          explain: `점근선이 ${is(X, a)}, ${is(Y, b)}이므로 ${is(Av, a)}, ${is(Bv, b)}이고, ${Y}절편이 ${iq(Y0)}이므로 ${is(frac(Cv, `${MINUS}${Av}`), Y0)}, ${is(Cv, c)}이다. ${yIs(rootR(1, a, -b, c))}의 그래프는 점 ${pt(Q(b, a), c)}에서 시작하여 ${a > 0 ? '오른쪽' : '왼쪽'} 위로 뻗으므로 ${jw(show(pass), '을/를')} 지난다.`,
          facts: { truth: rows.map((r) => r.join(',') === pass.join(',')), want: true, rule: 'iq-1' } });
      }
      // 점근선의 방정식으로 a, b → y = s√(ax + b) + c0
      const a = nz(d, -3, 3), r = nz(d, -4, 4), e = nz(d, -6, 6), s = pm(d), c0 = nz(d, -3, 3);
      if (e + a * r === 0) return null;
      const pass = [0, 1, 2, 3].filter((i) => quadsRoot(a, -r / a, c0, s)[i]), rows = opts(pass);
      if (!POOL.some((x) => x.join(',') === pass.join(','))) return null;
      return C(`유리함수 ${yIs(frac(`${Av}${X} ${sgnT(e)}`, den(r)))}의 그래프의 점근선의 방정식이 ${is(X, Bv)}, ${is(Y, a)}일 때, 무리함수 ${yIs(`${s < 0 ? MINUS : ''}${rt(`${Av}${X} + ${Bv}`)} ${sgnT(c0)}`)}의 그래프가 지나는 사분면만을 모두 고른 것은? (단, ${Av}, ${jw(Bv, '은/는')} 상수이다.)`, rows.map(show), rows.findIndex((x) => x.join(',') === pass.join(',')), {
        explain: `${yIs(frac(`${Av}${X} ${sgnT(e)}`, den(r)))}의 점근선은 ${is(X, r)}, ${is(Y, Av)}이므로 ${is(Av, a)}, ${is(Bv, r)}이다. ${yIs(rootR(s, a, r, c0))}의 그래프는 점 ${pt(Q(-r, a), c0)}에서 시작하여 ${a > 0 ? '오른쪽' : '왼쪽'} ${jw(s > 0 ? '위' : '아래', '으로/로')} 뻗으므로 ${jw(show(pass), '을/를')} 지난다.`,
        facts: { truth: rows.map((x) => x.join(',') === pass.join(',')), want: true, rule: 'iq-2' } });
    }, { count: 3, standard: S5 }),
    // ① (f⁻¹∘f⁻¹∘f⁻¹)(a) = t 이면 a = f(f(f(t))) 임을 대야 하고, 구간마다 다른 식을 세 번 고른다.
    H('hard-i-inv-thrice', '구간마다 다른 식인 함수의 역함수를 세 번 합성한 값', '②30', (d) => {
      const c = d.int(1, 3), [s1, s3] = pick2(d, [1, 2, 3]), Kk = s1 * s3 * s3, t = c + s1 * s1, ans = c - s3;
      const fx = sys([`${MINUS}${R1(1, -c)} + ${c} ${nb(`(${X} ≥ ${c})`)}`, `${frac(L(c, -(c * c + Kk)), den(c))} ${nb(`(${X} &lt; ${c})`)}`]);
      return N(`함수 ${nb(`${V('f')}(${X}) = ${fx}`)}에 대하여 ${jw(nb(`(${fInv} ∘ ${fInv} ∘ ${fInv})(${Av}) = ${t}`), '을/를')} 만족시키는 상수 ${Av}의 값은?`, ans, { signed: true,
        explain: `${fInv} ∘ ${fInv} ∘ ${fInv}의 역함수는 ${V('f')} ∘ ${V('f')} ∘ ${V('f')}이므로 ${nb(`${Av} = ${V('f')}(${V('f')}(${V('f')}(${t})))`)}이다. ${nb(`${t} ≥ ${c}`)}이므로 ${nb(`${V('f')}(${t}) = ${MINUS}${s1} + ${c} = ${iq(c - s1)}`)}, ${nb(`${iq(c - s1)} &lt; ${c}`)}이므로 ${nb(`${V('f')}(${iq(c - s1)}) = ${c + s3 * s3}`)}, ${nb(`${V('f')}(${c + s3 * s3}) = ${MINUS}${s3} + ${c} = ${iq(ans)}`)}이다.`,
        facts: { check: `a = f(f(f(${t})))` } });
    }, { standard: S5 }),
    // ② 역함수와의 교점 → 직선 y = x 와의 교점으로 옮김 → 끝점이 y = x 위일 때 → 접할 때(판별식) → 범위
    H('hard-i-inv-two', '무리함수와 그 역함수의 그래프가 서로 다른 두 점에서 만날 조건', '②32', (d, n) => {
      if (n === 0) {
        const A = d.pick([1, 2, 4]), p = d.int(-3, 3), lo = Q(4 * p - A, 4), hi = Q(p);
        const R = (a, ra, rb, b) => rng(iq(a), ra, rb, iq(b));
        const right = R(lo, '<', '<=', hi), wrongs = [R(lo, '<=', '<=', hi), R(lo, '<', '<', hi), R(hi, '<', '<=', Q(4 * p + A, 4)), R(Q(4 * p - A, 2), '<', '<=', hi), R(lo, '<=', '<', hi)];
        return pick5(d, `함수 ${fIs(`${R1(A, -A * p)} + ${Kv}`)}의 그래프와 그 역함수 ${yIs(`${fInv}(${X})`)}의 그래프가 서로 다른 두 점에서 만나도록 하는 실수 ${Kv}의 값의 범위는?`, right, wrongs, {
          explain: `증가하는 함수이므로 두 그래프의 교점은 ${yIs(`${V('f')}(${X})`)}의 그래프와 직선 ${yIs(X)}의 교점이다. 그래프는 점 ${pt(p, Kv)}에서 시작하므로 (ⅰ) 이 점이 직선 ${yIs(X)} 위에 있으면 ${is(Kv, p)}(두 점에서 만난다), (ⅱ) 직선 ${yIs(X)}에 접하면 ${rt(`${A}(${den(p)})`)} = ${jw(`${X} ${MINUS} ${Kv}`, '을/를')} 제곱한 이차방정식의 판별식이 0이 되어 ${is(Kv, lo)}(한 점에서 만난다)이다. 따라서 ${right}이다.` });
      }
      const m = d.pick([3, 4, 5]), top = Math.ceil(m * m / 4) - 1, list = (lo, hi) => Array.from({ length: hi - lo + 1 }, (_, i) => iq(lo + i)).join(', ');
      const right = list(0, top), wrongs = [list(1, top), list(0, top + 1), list(1, top + 1), list(0, top - 1), list(-1, top)];
      return pick5(d, `두 함수 ${fIs(frac(`${X2} + ${Kv}`, m))} ${nb(`(${X} ≥ 0)`)}, ${nb(`${V('g')}(${X}) = ${rt(`${m}${X} ${MINUS} ${Kv}`)}`)}의 그래프가 서로 다른 두 점에서 만나도록 하는 정수 ${Kv}의 값을 모두 고른 것은?`, right, wrongs, {
        explain: `${jw(V('g'), '은/는')} ${V('f')}의 역함수이므로 두 그래프의 교점은 ${yIs(`${V('f')}(${X})`)}의 그래프와 직선 ${yIs(X)}의 교점이다. ${is(frac(`${X2} + ${Kv}`, m), X)}, 곧 ${jw(nb(`${X2} ${MINUS} ${m}${X} + ${Kv} = 0`), '이/가')} 서로 다른 두 음이 아닌 실근을 가져야 하므로 판별식 ${nb(`${m * m} ${MINUS} 4${Kv} &gt; 0`)}, 두 근의 곱 ${nb(`${Kv} ≥ 0`)}이다. 따라서 ${nb(`0 ≤ ${Kv} &lt; ${iq(Q(m * m, 4))}`)}이고 정수 ${jw(Kv, '은/는')} ${right}이다.` });
    }, { count: 2, standard: S5 }),
    // ② 평행이동한 식 → 직선 y = x 와 접함 → 제곱한 이차방정식의 판별식: 세 단계 넘게
    H('hard-i-inv-tangent', '평행이동한 무리함수와 그 역함수의 그래프가 접할 때', '②32', (d) => {
      const m = d.pick([2, 4]), c = d.int(-3, 3), e = m === 4 ? d.until(() => d.int(-6, 7), (v) => v % 4 !== 0) : 2 * d.int(-3, 3), a = Q(4 * c * m + m * m - 4 * e, 4 * m);
      if (isInt(a)) return null;
      return numAns(`함수 ${yIs(rootR(1, m, -e, c))}의 그래프를 ${X}축의 방향으로 ${Av}만큼 평행이동한 그래프를 나타내는 함수를 ${yIs(`${V('f')}(${X})`)}라 하자. 함수 ${yIs(`${V('f')}(${X})`)}의 그래프와 그 역함수의 그래프가 접할 때, 상수 ${Av}의 값은?`, a, {
        explain: `${jw(fIs(`${rt(`${m}(${X} ${MINUS} ${Av})${e ? ' ' + sgnT(-e) : ''}`)}${c ? ' ' + sgnT(c) : ''}`), '은/는')} 증가하는 함수이므로 두 그래프가 접하면 ${yIs(`${V('f')}(${X})`)}의 그래프가 직선 ${yIs(X)}에 접한다. ${is(rt(`${m}${X} ${MINUS} ${m}${Av}${e ? ' ' + sgnT(-e) : ''}`), L(1, -c))}의 양변을 제곱하여 정리한 ${jw(nb(`${poly([[1, X2], [-(2 * c + m), X], [m, Av], [c * c + e, '']])} = 0`), '이/가')} 중근을 가지므로 판별식에서 ${is(Av, a)}이다.`,
        facts: { value: `${jn(c)}+${m}/4-(${jn(e)})/${m}`, derived: [4] } });
    }, { standard: S5 }),
    // ② 끝점을 지날 때(등호 포함)와 접할 때(등호 없음)를 가려야 한다.
    H('hard-i-line-two', '무리함수의 그래프와 직선이 두 점에서 만날 조건', '②34', (d) => {
      const m = d.pick([1, 2, 3, 4]), p = d.int(-3, 3), lo = Q(-p), hi = Q(m - 4 * p, 4);
      if (isInt(hi) && hi.p === lo.p) return null;
      const R = (a, ra, rb, b) => rng(iq(a), ra, rb, iq(b));
      const right = R(lo, '<=', '<', hi), wrongs = [R(lo, '<', '<', hi), R(lo, '<=', '<=', hi), R(lo, '<', '<=', hi), R(Q(p), '<=', '<', Q(m + 4 * p, 4)), R(lo, '<=', '<', Q(m - 2 * p, 2))];
      return pick5(d, `함수 ${yIs(R1(m, -m * p))}의 그래프와 직선 ${jw(yIs(`${X} + ${Kv}`), '이/가')} 서로 다른 두 점에서 만나도록 하는 실수 ${Kv}의 값의 범위는?`, right, wrongs, {
        explain: `그래프는 점 ${pt(p, 0)}에서 시작하여 오른쪽 위로 뻗는다. (ⅰ) 직선이 점 ${jw(pt(p, 0), '을/를')} 지나면 ${is(Kv, lo)}이고 두 점에서 만난다. (ⅱ) 직선이 그래프에 접하면 ${jw(is(R1(m, -m * p), `${X} + ${Kv}`), '을/를')} 제곱한 이차방정식의 판별식이 0이 되어 ${is(Kv, hi)}이고 한 점에서 만난다. 두 점에서 만나는 것은 그 사이이므로 ${right}이다.` });
    }, { standard: S5 }),
    // ② 곡선 위의 점으로 k 를 나타내고 √ 부분을 한 문자로 놓아 이차식의 최댓값을 구한다(접할 때).
    H('hard-i-line-max', '무리함수의 그래프와 직선이 만나는 k의 최댓값', '②34', (d) => {
      const s = d.pick([1, 2]), c = d.pick([1, 2, 3, 4].filter((v) => (v * v * s) % 4 === 0)), p = s * d.int(-2, 2), q = d.int(-3, 3), kmax = c * c * s / 4 + q + p / s;
      const lineH = s === 1 ? `${MINUS}${X} + ${Kv}` : `${MINUS}${frac(1, s)}${X} + ${Kv}`, curve = `${c === 1 ? '' : c}${R1(-1, p)}${q ? ' ' + sgnT(q) : ''}`;
      return N(`직선 ${jw(yIs(lineH), '이/가')} 함수 ${yIs(curve)}의 그래프와 만나도록 하는 실수 ${Kv}의 최댓값은?`, kmax, { signed: true,
        explain: `그래프 위의 점 ${jw(pt(X, Y), '을/를')} 직선이 지나려면 ${is(Kv, `${Y} + ${s === 1 ? X : frac(X, s)}`)}이다. ${is(R1(-1, p), V('u'))} (${nb(`${V('u')} ≥ 0`)})로 놓으면 ${is(X, `${iq(p)} ${MINUS} ${V('u')}${sup(2)}`)}, ${is(Y, `${c === 1 ? '' : c}${V('u')}${q ? ' ' + sgnT(q) : ''}`)}이므로 ${jw(Kv, '은/는')} ${V('u')}에 대한 이차식이 되고, ${is(V('u'), Q(c * s, 2))}일 때(직선이 그래프에 접할 때) 최댓값 ${jw(iq(kmax), '을/를')} 갖는다.`,
        facts: { value: `${c}*${c}*${s}/4+(${jn(q)})+(${jn(p)})/${s}`, derived: [4] } });
    }, { standard: S5 }),
    // ② 두 곡선을 따로 세어 더한다: 각 곡선과 직선의 교점 수(끝점·접할 때) → 합이 3인 범위
    H('hard-i-two-curves', '두 무리함수의 그래프와 직선의 교점이 셋일 조건', '②35', (d) => {
      const a = d.int(2, 6), lo = Q(a), hi = Q(4 * a + 1, 4), R = (x, ra, rb, y) => rng(iq(x), ra, rb, iq(y));
      const right = R(lo, '<=', '<', hi), wrongs = [R(lo, '<', '<', hi), R(lo, '<=', '<=', hi), R(Q(-a), '<=', '<', hi), R(Q(4 * a - 1, 4), '<', '<=', lo), R(lo, '<', '<=', hi)];
      return pick5(d, `두 집합 ${nb(`A = {(${X}, ${Y}) | ${Y} = ${X} + ${Kv}}`)}, ${nb(`B = {(${X}, ${Y}) | ${Y} = ${R1(1, a)}`)} 또는 ${nb(`${Y} = ${R1(-1, a)}}`)}에 대하여 ${jw(nb(`${V('n')}(A ∩ B) = 3`), '이/가')} 되도록 하는 실수 ${Kv}의 값의 범위는?`, right, wrongs, {
        explain: `직선 ${jw(yIs(`${X} + ${Kv}`), '은/는')} ${yIs(R1(-1, a))}의 그래프(점 ${pt(a, 0)}에서 왼쪽 위로)와 ${nb(`${Kv} ≥ ${iq(-a)}`)}이면 한 점에서 만난다. ${yIs(R1(1, a))}의 그래프(점 ${pt(-a, 0)}에서 오른쪽 위로)와는 직선이 점 ${jw(pt(-a, 0), '을/를')} 지날 때(${is(Kv, a)})부터 접할 때(${is(Kv, hi)}) 전까지 두 점에서 만난다. 두 곡선이 만나는 점 ${jw(pt(0, rt(a)), '을/를')} 지나는 ${jw(is(Kv, rt(a)), '은/는')} 이 범위 밖이므로 ${right}이다.` });
    }, { standard: S5 }),
    // ② 함수의 시작점 (k, c)와 역함수의 시작점 (c, k)를 따로 직선과 견준다.
    H('hard-i-inv-line', '함수와 그 역함수가 각각 한 직선과 만나는지에 따른 범위', '②36', (d) => {
      const c = nz(d, -2, 4), e = d.int(2, 6), lo = c - e, hi = c + e, R = (x, ra, rb, y) => rng(iq(x), ra, rb, iq(y));
      const right = R(lo, '<', '<=', hi), wrongs = [R(lo, '<=', '<=', hi), R(lo, '<', '<', hi), R(lo, '<=', '<', hi), R(Q(-hi), '<', '<=', Q(-lo)), R(lo, '<', '<=', Q(c + 2 * e))];
      return pick5(d, `함수 ${fIs(`${MINUS}${rt(`${X} ${MINUS} ${Kv}`)} ${sgnT(c)}`)}에 대하여 함수 ${yIs(`${V('f')}(${X})`)}의 그래프는 직선 ${jw(yIs(L(1, -e)), '과/와')} 만나고, 그 역함수 ${yIs(`${fInv}(${X})`)}의 그래프는 직선 ${jw(yIs(L(1, -e)), '과/와')} 만나지 않는다. 이때 실수 ${Kv}의 값의 범위는?`, right, wrongs, {
        explain: `${yIs(`${V('f')}(${X})`)}의 그래프는 점 ${pt(Kv, c)}에서 시작하여 오른쪽 아래로 뻗으므로 직선과 만나려면 ${nb(`${iq(c)} ≥ ${Kv} ${MINUS} ${e}`)}, 곧 ${nb(`${Kv} ≤ ${iq(hi)}`)}이다. 역함수의 그래프는 점 ${pt(c, Kv)}에서 시작하여 왼쪽 위로 뻗으므로 직선과 만나지 않으려면 ${nb(`${Kv} &gt; ${iq(c)} ${MINUS} ${e}`)}, 곧 ${nb(`${Kv} &gt; ${iq(lo)}`)}이다. 따라서 ${right}이다.` });
    }, { standard: S5 }),
    // ② 넓이가 최대인 점은 OA에 평행한 접선의 접점이다: 접선(판별식) → 평행선 사이의 거리 → 넓이
    H('hard-i-area-max', '그래프 위를 움직이는 점이 만드는 삼각형의 넓이의 최댓값', '②38', (d) => {
      const [aa, c] = d.pick([[2, 1], [4, 1], [4, 2], [4, 4], [4, 8], [6, 1], [6, 3], [6, 9]]), xA = aa * aa / c, S = aa * aa * aa / (8 * c);
      if (!Number.isInteger(xA) || !Number.isInteger(S)) return null;
      return N(`함수 ${yIs(rt(term(c, X)))}의 그래프 위의 점 P가 원점 O와 점 A${pt(xA, aa)} 사이를 움직일 때, 삼각형 OAP의 넓이의 최댓값은?`, S, {
        explain: `넓이가 가장 클 때 P는 직선 OA에 평행한 직선이 그래프에 접하는 점이다. OA의 기울기는 ${iq(Q(aa, xA))}이고, 이 기울기의 직선이 ${yIs(rt(term(c, X)))}에 접하는 점은 P${pt(Q(xA, 4), Q(aa, 2))}이다. 삼각형 OAP의 넓이는 ${frac(1, 2)} × |${xA} × ${iq(Q(aa, 2))} ${MINUS} ${iq(Q(xA, 4))} × ${aa}| = ${S}이다.`,
        facts: { value: `${aa}*${aa}*${aa}/(8*${c})`, derived: [8] } });
    }, { standard: S5 }),
    // ① f⁻¹(g(x)) = rx 의 양변에 f 를 씌워 g(x) = f(rx) 로 바꾸는 뜻을 대야 한다.
    H('hard-i-inv-compose', 'f⁻¹(g(x)) = rx 를 만족시키는 g의 값', '심6', (d) => {
      const m = d.int(1, 4), r = d.int(2, 3), e = d.int(1, 12), t = d.int(2, 5), v = m * r * t - e;
      if (v < 2 || sqParts(v)[0] !== 1) return null;
      const s0 = Math.ceil(e / (m * r));
      return radAns(`함수 ${jw(fIs(rt(`${m === 1 ? '' : m}${X} ${MINUS} ${e}`)), '이/가')} 있다. 함수 ${V('g')}(${X})가 ${nb(`${X} ≥ ${s0}`)}인 모든 실수 ${X}에 대하여 ${jw(nb(`${fInv}(${V('g')}(${X})) = ${r}${X}`), '을/를')} 만족시킬 때, ${V('g')}(${t})의 값은?`, 1, v, {
        explain: `${nb(`${fInv}(${V('g')}(${X})) = ${r}${X}`)}의 양변을 ${V('f')}에 넣으면 ${nb(`${V('g')}(${X}) = ${V('f')}(${r}${X})`)}이다. 따라서 ${nb(`${V('g')}(${t}) = ${V('f')}(${r * t}) = ${rt(String(v))}`)}이다.`,
        facts: { check: `g(${t}) = f(${r * t})` } });
    }, { standard: S5 })
  ];

  B.addGroup('10-2-7', { id: 'hard', title: '실력 문제', standard: S4, types: hard });
})(typeof window !== 'undefined' ? window : globalThis);
