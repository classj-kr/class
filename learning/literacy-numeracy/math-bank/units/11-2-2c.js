// 고등학교 미적분Ⅰ Ⅰ-2 함수의 연속 — 실력 문제.
// 단원 틀·싣는 기준·뺀 것과 까닭은 11-2-2a.js 머리에 적었다. 도구는 B.kit.u22(a 파일)를 쓴다.
// ref: ①n = 기본꼴_1의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것
//  - 함수 f(x)가 x = a 에서 끊어져 있으면 f(x)g(x)도 반드시 끊어진다고 여긴다(g(a) = 0 이면 곱은 이어질 수 있다).
//  - 극한값이 있으면 연속이라고 여긴다(함숫값과 같아야 한다 — 함숫값이 따로 정해진 점에서는 g 가 0이 되어야 곱이 이어진다).
//  - f(x + p) = f(x) 라는 조건을 연속과 잇지 못해, 구간 끝 x = p 의 값이 x = 0 의 값과 같아야 한다는 것을 놓친다.
//  - 합성함수의 연속을 바깥 함수의 연속만 보고 가린다(안쪽 함수의 값이 어디로 가는지를 먼저 봐야 한다).
//  - f(x) − |f(x)| 의 불연속점을 f(x)의 불연속점과 같다고 여긴다(f 가 0 이상인 곳에서는 끊어져도 0으로 이어진다).
//  - 사잇값 정리로 센 실근의 개수(적어도 몇 개)를 상황의 장치(정차 = 속력 0, 최고 속력이 그 값보다 작은 구간)를 빼고 센다.
//  - 극한 조건 lim f(x)/(x − p) = α 에서 f(p) = 0 만 읽고, α 의 부호로 그 사이의 실근을 가리는 것을 놓친다.
// 실력에 둔 까닭: ① 문제의 장치에 함정이 있어 배운 뜻을 정확히 대야 풀리는 것, ② 세 단계 넘게 이어 생각해야 풀리는 것만 남겼다(유형마다 주석).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, N, M, C, inline } = B.kit;
  const { MINUS, LE, GE, nb, V, sup, nz, pm, poly } = B.kit.mid;
  const { ms, qAns, jh } = B.kit.hs;
  const U = B.kit.u22;
  const { S3, S4, H, X, Av, Bv, Kv, X2, iq, jn, jq, FX, GX, fAt, fIs, LIM, ge, gt, lt, eq, absX, cases, iv, sgnT, pval, fromRoots, ptext, den, par, GA, comboPick, pickOne, vals } = U;
  const ri = (lo, hi) => { const out = []; for (let v = lo; v <= hi; v += 1) out.push(v); return out; };
  const cf = (c) => (c === 1 ? '' : c === -1 ? MINUS : iq(c));   // 곱해진 계수의 글(1·−1은 숫자를 적지 않는다)

  const hard = [
    // ② 주기 조건과 연속: 차례 1 한 조각(대15), 차례 2 두 조각(교점12 발전) — 구간 끝 x = T 의 값을 f(0)으로 옮겨 잇는 단계를 거친다(3단).
    H('hard-period', '주기 조건 f(x + T) = f(x)를 만족시키는 연속함수의 상수', '①16', (d, n) => {
      const T = d.pick([2, 3]);
      if (n === 0) {
        const j = nz(d, -4, 4), p = T * j, a = -(T + j), u = nz(d, -6, 6);
        if (a === 0) return null;
        const cond = lines([`(가) ${nb(`0 ${LE} ${X} &lt; ${T}`)}일 때, ${fIs(poly([[1, X + sup(3)], [1, Av + X2], [p, X], [u, '']]))}`, `(나) 모든 실수 ${X}에 대하여 ${nb(`${FX} = ${V('f')}(${X} + ${T})`)}`]);
        return qAns(`모든 실수 ${X}에서 연속인 함수 ${jh(FX, '이/가')} 다음 조건을 만족시킬 때, 상수 ${Av}의 값은?`, a, { signed: true, figure: cond,
          explain: `(나)에서 ${fAt(T)} = ${fAt(0)} = ${iq(u)}이다. ${jh(FX, '이/가')} ${X} = ${iq(T)}에서 연속이므로 ${LIM(T, null, '-')} = ${fAt(T)}: ${iq(T ** 3)} + ${iq(T * T)}${Av} ${sgnT(p * T)} ${sgnT(u)} = ${iq(u)}, ${Av} = ${iq(a)}이다.`,
          facts: { value: `0-(${T}*${T}+${jn(p)})/${T}` } });
      }
      const b = nz(d, -4, 4), w = d.int(-5, 5), u = b * T + w, a = b + w - 1 - u;
      if (a === 0 || u === 0) return null;
      const f = cases([[poly([[1, X2], [1, Av + X], [u, '']]), nb(`0 ${LE} ${X} &lt; 1`)], [poly([[1, Bv + X], [w, '']]), nb(`1 ${LE} ${X} ${LE} ${T}`)]]);
      const cond = lines([`(가) ${fIs(f)}`, `(나) 모든 실수 ${X}에 대하여 ${nb(`${V('f')}(${X} + ${T}) = ${FX}`)}`]);
      return vals(`모든 실수 ${X}에서 연속인 함수 ${jh(FX, '이/가')} 다음 조건을 만족시킬 때, 상수 ${Av}, ${Bv}의 값은?`, [[Av, a], [Bv, b]], { figure: cond,
        explain: `${X} = 1에서 연속이므로 ${poly([[1, Av], [1 + u, '']])} = ${poly([[1, Bv], [w, '']])}이다. (나)에서 ${fAt(T)} = ${fAt(0)} = ${iq(u)}이고 ${X} = ${iq(T)}에서도 이어져야 하므로 ${poly([[T, Bv], [w, '']])} = ${iq(u)}, ${Bv} = ${iq(b)}이다. 따라서 ${Av} = ${iq(a)}이다.`,
        facts: { calc: [[`(${jn(u)}-${jn(w)})/${T}+${jn(w)}-1-${jn(u)}`, 0], [`(${jn(u)}-${jn(w)})/${T}`, 1]] } });
    }, { count: 2, standard: S3 }),

    // ① 함숫값이 따로 정해진 두 점(극한값 ≠ 함숫값)에서 f(x)g(x)가 이어지려면 g 가 그 두 점에서 0이어야 한다(교대12).
    H('hard-mul2', '극한값과 함숫값이 다른 두 점에서 곱이 연속이 되는 조건', '①25', (d) => {
      const r = d.int(-3, 2), s = d.until(() => d.int(-2, 4), (v) => v > r), P = [nz(d, -4, 4), d.int(-4, 4), 1], Qp = [d.int(-3, 3), d.pick([1, -1, 2])];
      if (pval(P, r) === pval(Qp, r) || pval(P, s) === pval(Qp, s)) return null;
      const sym = r === -s;
      const f = cases([[ptext(P), sym ? absX('≠', s) : nb(`${X} ≠ ${iq(r)}, ${X} ≠ ${iq(s)}`)], [ptext(Qp), sym ? absX('=', s) : nb(`${X} = ${iq(r)} 또는 ${X} = ${iq(s)}`)]]);
      const a = -(r + s), b = r * s;
      return vals(`두 함수 ${fIs(f)}, ${fIs(poly([[1, X2], [1, Av + X], [1, Bv]]), 'g')}에 대하여 함수 ${jh(nb(FX + GX), '이/가')} 모든 실수 ${X}에서 연속일 때, 상수 ${Av}, ${Bv}의 값은?`, [[Av, a], [Bv, b]], {
        explain: `${X} = ${iq(r)}에서 ${LIM(r, nb(FX + GX))} = ${iq(pval(P, r))}${ms(`g(${r < 0 ? '-' + Math.abs(r) : r})`)}, ${fAt(r)}${ms(`g(${r < 0 ? '-' + Math.abs(r) : r})`)} = ${iq(pval(Qp, r))}${ms(`g(${r < 0 ? '-' + Math.abs(r) : r})`)}이고 ${jq(pval(P, r), '과/와')} ${jq(pval(Qp, r), '이/가')} 다르므로 ${ms(`g(${r < 0 ? '-' + Math.abs(r) : r})`)} = 0이어야 한다. 같은 방법으로 ${ms(`g(${s < 0 ? '-' + Math.abs(s) : s})`)} = 0이다. 따라서 ${GX} = ${r === 0 ? X : par(den(r))}${s === 0 ? X : par(den(s))}이고 ${Av} = ${iq(a)}, ${Bv} = ${iq(b)}이다.`,
        facts: { calc: [[`0-${jn(r)}-${jn(s)}`, 0], [`${jn(r)}*${jn(s)}`, 1]] } });
    }),

    // ① 경계 a 도 미지수인 조각 함수와 일차함수의 곱: f 가 이어지는 a 와 g(a) = 0 인 a 를 모두 찾아야 한다(중11 — 원문 「모든 a 의 합」은 모두 고른 것으로).
    H('hard-mul-edge', '경계가 미지수인 곱 f(x)g(x)가 연속이 되는 경계의 값 모두', '①26', (d) => {
      const al = d.int(-4, 2), be = d.until(() => d.int(-2, 5), (v) => v > al), c = al + be, m = d.pick([2, 3, -1, -2]), ga = d.until(() => d.int(-5, 5), (v) => v !== al && v !== be), r = ga * (1 - m);
      if (c === 0 || r === 0) return null;
      const p = nz(d, -6, 6), q = al * be + p;
      const f = cases([[ptext([p, c]), ge(Av)], [ptext([q, 0, 1]), lt(Av)]]), g = `${X} ${MINUS} (${poly([[m, Av], [r, '']])})`;
      const show = (list) => list.slice().sort((x, y) => x - y).map(iq).join(', ');
      const right = show([al, be, ga]);
      const wrongs = [[al, be], [ga], [al, ga], [be, ga], [al], [be]].map(show);
      return pickOne(d, `두 함수 ${fIs(f)}, ${fIs(g, 'g')}에 대하여 함수 ${jh(nb(FX + GX), '이/가')} 모든 실수 ${X}에서 연속이 되도록 하는 실수 ${Av}의 값을 모두 고른 것은?`, right, wrongs, {
        explain: `${X} = ${Av}에서만 보면 된다. 우극한과 함숫값은 (${ptext([p, c], Av)})(${ptext([-r, 1 - m], Av)}), 좌극한은 (${ptext([q, 0, 1], Av)})(${ptext([-r, 1 - m], Av)})이므로 (${ptext([p - q, c, -1], Av)})(${ptext([-r, 1 - m], Av)}) = 0이다. ${ptext([q - p, -c, 1], Av)} = 0에서 ${Av} = ${iq(al)} 또는 ${Av} = ${iq(be)}(${jh(FX, '이/가')} 이어지는 경우), ${ptext([-r, 1 - m], Av)} = 0에서 ${Av} = ${iq(ga)}(${jh(FX, '은/는')} 끊어져도 ${ms('g(a)')} = 0이라 곱이 이어지는 경우)이다.` });
    }),

    // ① 조각 함수끼리의 합성의 연속·극한(대12): 안쪽 함수의 값이 어느 조각으로 가는지를 먼저 보아야 한다.
    H('hard-compose', '조각 함수끼리의 합성의 연속과 극한', '①27', (d) => {
      const vals3 = () => ({ pos: d.int(-1, 3), zero: d.int(-1, 3), neg: d.int(-1, 3) });
      const f = vals3(), g = vals3();
      const jumpy = (h) => !(h.pos === h.zero && h.zero === h.neg);
      if (!jumpy(f) || !jumpy(g)) return null;
      const at = (h, x) => (x > 0 ? h.pos : x === 0 ? h.zero : h.neg);
      const name = { f, g };
      const comp = (u, v) => ({ R: at(name[u], name[v].pos), L: at(name[u], name[v].neg), V: at(name[u], name[v].zero) });
      const pool = [];
      for (const [u, v] of [['f', 'f'], ['f', 'g'], ['g', 'f'], ['g', 'g']]) {
        const c = comp(u, v), body = ms(`${u}(${v}(x))`);
        pool.push({ h: `함수 ${jh(body, '은/는')} ${X} = 0에서 연속이다.`, ok: c.R === c.L && c.L === c.V, why: `${LIM(0, body, '+')} = ${iq(c.R)}, ${LIM(0, body, '-')} = ${iq(c.L)}, ${ms(`${u}(${v}(0))`)} = ${iq(c.V)}` });
        pool.push({ h: `${LIM(0, body)}의 값이 존재한다.`, ok: c.R === c.L, why: `${LIM(0, body, '+')} = ${iq(c.R)}, ${LIM(0, body, '-')} = ${iq(c.L)}` });
      }
      const pick = d.shuffle(pool).slice(0, 3);
      if (new Set(pick.map((p) => p.h)).size < 3 || !pick.some((p) => p.ok) || pick.every((p) => p.ok)) return null;
      const show = (h, nm) => fIs(cases([[iq(h.pos), gt(0)], [iq(h.zero), eq(0)], [iq(h.neg), lt(0)]]), nm);
      return comboPick(d, `두 함수 ${show(f, 'f')}, ${show(g, 'g')}에 대하여 보기에서 옳은 것만을 있는 대로 고른 것은?`, pick.map((p) => p.h), pick.map((p) => p.ok),
        pick.map((p, i) => `${GA[i]}. ${p.why}이므로 ${p.ok ? '옳다' : '옳지 않다'}.`).join(' ') + ` (${X}가 0의 오른쪽에서 다가가면 안쪽 함수의 값은 ${X} &gt; 0일 때의 값으로 정해져 있으므로 바깥 함수에 그 값을 넣는다.)`);
    }),

    // ① f(x) − |f(x)|의 불연속점(중간8): f 가 0 이상인 쪽은 0으로 이어져, f 의 불연속점이 그대로 남지 않는다.
    H('hard-abs', 'f(x) − |f(x)|가 불연속인 점의 개수', '①28', (d) => {
      const b1 = d.int(-2, 0), b2 = b1 + d.int(2, 3);
      const m1 = nz(d, -3, 3), c1 = d.int(-4, 4), V1 = d.int(-3, 3), sq = d.bool(), c2 = d.int(-3, 3), m3 = nz(d, -2, 2), c3 = d.int(-5, 3);
      const p1 = (x) => m1 * x + c1, p2 = (x) => (sq ? x * x + c2 : x + c2), p3 = (x) => m3 * x + c3;
      const pts = [{ x: b1, L: p1(b1), R: p2(b1), V: V1 }, { x: b2, L: p2(b2), R: p3(b2), V: p3(b2) }];
      const disF = pts.filter((t) => !(t.L === t.R && t.R === t.V)).length;
      const h = (y) => 2 * Math.min(y, 0), disH = pts.filter((t) => !(h(t.L) === h(t.R) && h(t.R) === h(t.V)));
      if (disF !== 2 || disH.length >= disF) return null;
      if (pts.some((t) => [t.L, t.R, t.V].some((y) => y === 0)) && d.bool()) return null;
      const f = cases([[ptext([c1, m1]), lt(b1)], [iq(V1), eq(b1)], [sq ? ptext([c2, 0, 1]) : ptext([c2, 1]), nb(`${iq(b1)} &lt; ${X} &lt; ${iq(b2)}`)], [ptext([c3, m3]), ge(b2)]]);
      const say = (t) => `${X} = ${iq(t.x)}에서 ${jh(FX, '은/는')} 좌극한 ${iq(t.L)}, 우극한 ${iq(t.R)}, 함숫값 ${iq(t.V)}이므로 ${jh(nb(`${FX} ${MINUS} |${FX}|`), '은/는')} 좌극한 ${iq(h(t.L))}, 우극한 ${iq(h(t.R))}, 함숫값 ${iq(h(t.V))}이고 ${(h(t.L) === h(t.R) && h(t.R) === h(t.V)) ? '이어진다' : '끊어진다'}`;
      return N(`함수 ${fIs(f)}에 대하여 함수 ${nb(`${Y()} = ${FX} ${MINUS} |${FX}|`)}가 불연속이 되는 ${X}의 값의 개수는?`, disH.length, {
        explain: `${nb(`${FX} ${MINUS} |${FX}|`)}는 ${FX} ${GE} 0인 곳에서 0, ${FX} &lt; 0인 곳에서 ${nb(`2${FX}`)}이다. ${pts.map(say).join('. ')}. 따라서 불연속인 곳은 ${disH.length}개이다(${jh(FX, '은/는')} 두 곳에서 끊어져 있지만 0 이상인 쪽은 0으로 이어진다).`,
        facts: { value: String(disH.length), derived: [disH.length] } });
    }),

    // ① 정차(속력 0)와 구간마다의 최고 속력이 장치다: 최고 속력이 그 값보다 큰 구간마다 두 번(오를 때와 내릴 때), 작은 구간은 한 번도 없다(중12).
    H('hard-speed', '연속으로 변하는 속력이 정해진 값이 되는 순간의 최소 횟수', '①36', (d) => {
      const stops = d.pick([1, 2]), legs = stops + 1, Vs = ri(1, legs).map(() => 10 * d.int(4, 11)), s = 10 * d.int(3, 10) + 5;
      if (!Vs.some((v) => v < s) || !Vs.some((v) => v > s)) return null;
      const above = Vs.filter((v) => v > s).length, names = stops === 1 ? ['A 지점', '휴게소 P', 'B 지점'] : ['A 지점', '휴게소 P', '휴게소 Q', 'B 지점'];
      const route = stops === 1 ? `휴게소 P에 들러 정차한 다음 다시 출발하여 B 지점에 정차하였다` : `휴게소 P, 휴게소 Q에 차례로 들러 정차한 다음 다시 출발하여 B 지점에 정차하였다`;
      const legT = Vs.map((v, i) => `${names[i]}에서 ${names[i + 1]}까지 ${v} km/h`).join(', ');
      return N(`자동차가 A 지점을 출발하여 ${route}. 구간마다의 최고 속력은 ${legT}였다. 자동차의 속력이 시각에 따라 연속적으로 변한다고 할 때, A 지점에서 B 지점에 이를 때까지 속력이 ${s} km/h인 순간은 적어도 몇 번 있었는가?`, 2 * above, {
        explain: `출발할 때와 정차할 때 속력은 0 km/h이다. 최고 속력이 ${s} km/h보다 큰 구간에서는 0에서 최고 속력까지 오를 때와 최고 속력에서 0으로 내릴 때 사잇값 정리에 의하여 각각 적어도 한 번씩 ${s} km/h가 된다. 최고 속력이 ${s} km/h보다 작은 구간에서는 그 속력이 되지 않는다. 그런 구간이 ${above}개이므로 적어도 ${2 * above}번이다.`,
        facts: { value: `2*${above}`, derived: [2, above] } });
    }),

    // ② 보조 함수 g(x) = f(x) − h(x)의 세 끝값 → 두 구간 각각에 실근 → a 의 범위(소2-5): g 만들기, 끝값 셋, 두 부등식의 공통 범위(3단).
    H('hard-aux-range', '보조 함수로 두 구간 각각에 실근을 갖는 상수의 범위', '①39', (d) => {
      const r1 = d.int(-3, 3), r2 = r1 + d.int(1, 4), sg = pm(d), c = d.pick([1, 2, 3]), lin = d.bool();
      const hAt = (x) => (lin ? c * x : c * x * x), hT = lin ? ptext([0, c]) : poly([[c, X2]]);
      const g0 = sg * d.int(1, 6), g2 = sg * d.int(1, 6), u = g0 + hAt(0), w = g2 + hAt(2);
      const F1 = [sg * r1 * r2 + hAt(1), -sg * (r1 + r2), sg];   // f(1) = sg(a − r1)(a − r2) + h(1)
      return inline(`모든 실수 ${X}에서 연속인 함수 ${FX}에 대하여 ${nb(`${fAt(0)} = ${iq(u)}`)}, ${nb(`${fAt(1)} = ${ptext(F1, Av)}`)}, ${nb(`${fAt(2)} = ${iq(w)}`)}일 때, 방정식 ${nb(`${FX} ${MINUS} ${hT} = 0`)}이 두 열린구간 ${iv('(', 0, 1, ')')}, ${iv('(', 1, 2, ')')}에서 각각 적어도 하나의 실근을 갖도록 하는 실수 ${Av}의 값의 범위를 구하시오.`, `{0} &lt; ${Av} &lt; {1}`,
        [{ answer: r1, signed: true }, { answer: r2, signed: true }], {
          shown: `${iq(r1)} &lt; ${Av} &lt; ${iq(r2)}`,
          explain: `${GX} = ${FX} ${MINUS} ${jh(hT, '이라/라')} 하면 ${jh(GX, '은/는')} 연속이다. ${ms('g(0)')} = ${iq(g0)}, ${ms('g(2)')} = ${iq(g2)}이고 ${ms('g(1)')} = ${ptext([sg * r1 * r2, -sg * (r1 + r2), sg], Av)}이다. 두 구간에서 각각 실근을 가지려면 ${ms('g(0)g(1)')} &lt; 0, ${ms('g(1)g(2)')} &lt; 0이어야 하므로 ${ms('g(1)')}의 부호가 ${sg > 0 ? '음' : '양'}이어야 한다. ${sg > 0 ? '' : MINUS}${[r1, r2].map((v) => (v === 0 ? Av : `(${ptext([-v, 1], Av)})`)).join('')} ${sg > 0 ? '&lt;' : '&gt;'} 0에서 ${iq(r1)} &lt; ${Av} &lt; ${iq(r2)}이다.`,
          facts: { calc: [[jn(r1), 0], [jn(r2), 1]], derived: [Math.abs(r1), Math.abs(r2)] } });
    }),

    // ① 문자로만 된 끝값의 부호를 따져 실근의 개수를 정한다(교점13 발전): 사잇값 정리로 하나씩 + 차수로 많아야 그만큼.
    H('hard-letters', '문자 끝값의 부호로 실근의 개수 정하기', '①40', (d) => {
      const four = d.bool(), L = four ? ['a', 'b', 'c', 'd'] : ['a', 'b', 'c'];
      const fac = (skip) => L.filter((l) => l !== skip).map((l) => `(${X} ${MINUS} ${V(l)})`).join('');
      const terms = L.map(fac), n = L.length - 1;
      const order = L.map(V).join(' &lt; ');
      const eqt = four ? lines([nb(terms[0]), `+ ${nb(terms[1])}`, `+ ${nb(terms[2])}`, `+ ${nb(terms[3])} = 0`]) : lines([`${nb(terms[0])} + ${nb(terms[1])}`, `+ ${nb(terms[2])} = 0`]);
      return N(`${four ? '네' : '세'} 실수 ${L.map(V).join(', ')} (${nb(order)})에 대하여 ${four ? '삼차' : '이차'}방정식이 다음과 같을 때, 이 방정식의 서로 다른 실근의 개수는?`, n, { figure: eqt,
        explain: `좌변을 ${jh(FX, '이라/라')} 하면 ${fAt(V('a'))}의 부호는 ${four ? '음' : '양'}, ${fAt(V('b'))}는 ${four ? '양' : '음'}, ${fAt(V('c'))}는 ${four ? '음' : '양'}${four ? `, ${fAt(V('d'))}는 양` : ''}이다(이웃한 끝값의 부호가 늘 다르다). 사잇값 정리에 의하여 ${n}개의 열린구간에 실근이 하나씩 있고, ${four ? '삼차' : '이차'}방정식의 실근은 많아야 ${n}개이므로 ${n}개이다.`,
        facts: { value: String(n), derived: [n] } });
    }),

    // ② 극한 조건으로 f(p) = f(q) = 0 → f = (x − p)(x − q)g(x) → α·β 의 부호로 g(p)g(q)의 부호 → 사잇값 정리(중간23, 4단).
    H('hard-lim-roots', '극한 조건으로 다항함수의 실근의 개수 구하기', '①41', (d) => {
      const p = d.int(-2, 1), q = p + d.int(1, 3), al = nz(d, -6, 6), be = nz(d, -6, 6), n = al * be > 0 ? 3 : 2;
      const lp = LIM(p, frac(FX, p === 0 ? X : den(p))), lq = LIM(q, frac(FX, q === 0 ? X : den(q)));
      return N(`다항함수 ${jh(FX, '이/가')} ${nb(`${lp} = ${iq(al)}`)}, ${jh(nb(`${lq} = ${iq(be)}`), '을/를')} 만족시킬 때, 방정식 ${nb(`${FX} = 0`)}은 닫힌구간 ${iv('[', p, q, ']')}에서 적어도 몇 개의 실근을 갖는가?`, n, {
        explain: `두 극한에서 분모가 0으로 가므로 ${fAt(p)} = ${fAt(q)} = 0이고, ${FX} = ${p === 0 ? X : par(den(p))}${q === 0 ? X : par(den(q))}${GX} (${jh(GX, '은/는')} 다항함수)로 놓을 수 있다. 그러면 ${iq(al)} = ${cf(p - q)}${ms('g')}(${iq(p)}), ${iq(be)} = ${cf(q - p)}${ms('g')}(${iq(q)})이므로 ${al * be > 0 ? `${jh(nb(`${ms('g')}(${iq(p)})`), '과/와')} ${ms('g')}(${iq(q)})의 부호가 달라 사잇값 정리에 의하여 열린구간 ${iv('(', p, q, ')')}에 ${nb(`${GX} = 0`)}의 실근이 적어도 하나 있다. 따라서 적어도 3개이다.` : `${jh(nb(`${ms('g')}(${iq(p)})`), '과/와')} ${ms('g')}(${iq(q)})의 부호가 같아 그 사이에 실근이 있다고 할 수 없다(일차식 ${GX}이면 없다). 따라서 적어도 2개이다.`}`,
        facts: { value: String(n), derived: [n, 2, 3] } });
    })
  ];
  function Y() { return V('y'); }

  B.addGroup('11-2-2', { id: 'hard', title: '단원 종합', standard: S4, types: hard });
})(typeof window !== 'undefined' ? window : globalThis);
