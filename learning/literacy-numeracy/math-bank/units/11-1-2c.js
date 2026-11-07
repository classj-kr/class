// 고등학교 대수 Ⅰ-2 지수함수와 로그함수 — 실력 문항. 틀·도구·싣는 기준·뺀 것은 11-1-2a.js 머리에 있다.
// 실력의 잣대: ① 문제의 장치에 함정이 있어 배운 뜻을 정확히 대야 풀리는 것 ② 세 단계 넘게 이어 생각해야 풀리는 것.
// 이 단원에서 흔히 잘못 아는 것
//  - aˣ = t 로 치환하면 t 는 양수뿐이다: 「모든 실수 x 에서 성립」을 판별식으로 풀거나(t > 0 에서만 따지면 된다), t 의 범위를 x 의 범위 그대로 쓴다(밑이 1보다 작으면 양 끝이 뒤집힌다).
//  - 지수방정식의 두 근 α, β 와 치환한 이차방정식의 두 근을 섞는다(t 의 두 근은 a^α, a^β 이고 그 곱이 a^(α+β)).
//  - 밑이 1보다 작은 로그는 감소한다는 것을 잊고, 0 &lt; a &lt; b &lt; 1 에서 logₐb 를 1보다 크다고 여긴다(logₐa = 1 과 logₐ1 = 0 사이에 낀다).
//  - 밑에 x 가 있는 로그에서 밑의 조건(x &gt; 0, x ≠ 1)을 빠뜨린다. M⁻ᵃ 처럼 밑이 다른 거듭제곱의 대소를 지수함수의 증감으로 따진다.
//  - 역함수의 그래프가 지나는 점을 그대로 f 에 넣는다(좌표를 바꿔야 한다). y = aˣ 와 y = log_b x 는 둘 다 증가하면 늘 만난다고 여긴다(a = b = 2 는 만나지 않는다).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, N, C } = B.kit;
  const { MINUS, Q, nb, V, sup, rt, radAns, SG } = B.kit.mid;
  const { lg, rtn, jh } = B.kit.hs;
  const { S7, S8, stripH, H, X, Y, Av, Bv, Cv, Kv, Mv, Pv, Tv, al, be, iq, jn, is, yIs, fx, fAt, pt, jj, L, plusC, E, LG, setX, vals, num, choose, GA, comboPick, orderPick, gfig, pick2 } = B.kit.u112;

  // 0 이상 정수 지수의 거듭제곱근 글: m^(p/q)
  function powH(m, p, q) {
    const g = (x, y) => (y ? g(y, x % y) : x), k = g(p, q), a = p / k, b = q / k;
    if (b === 1) return String(m ** a);
    const whole = Math.floor(a / b), rest = a % b, inner = m ** rest, head = whole ? String(m ** whole) : '';
    return head + (b === 2 ? rt(inner) : rtn(b, inner));
  }
  const MV = V('M'), NV = V('N'), mV = V('m');

  const hard = [
    H('hard-exp-sub-minmax', 'aˣ = t로 치환한 이차함수의 최댓값·최솟값', '①21', (d) => {
      const l = d.pick([-3, -2]), h = d.pick([0, 1, 2]), c = d.pick([1, 2]), K = d.int(1, 6), lo = 2 ** -h, hi = 2 ** -l;
      if (!(lo <= c && c <= hi) || Math.abs(hi - c) <= Math.abs(c - lo)) return null;
      const Mx = hi * hi - 2 * c * hi + K, mn = K - c * c;
      const mid = c === 1 ? E(Q(1, 2), L(1, -1)) : `${c}${E(Q(1, 2), L(1, -1))}`;
      return vals(`정의역이 ${setX(`${iq(l)} ≤ ${X} ≤ ${h}`)}인 함수 ${yIs(`${E(Q(1, 4), X)} ${MINUS} ${mid} + ${K}`)}의 최댓값을 ${MV}, 최솟값을 ${mV}이라 할 때, ${MV}, ${mV}의 값을 구하시오.`, [[MV, Mx], [mV, mn]], {
        explain: `${is(E(Q(1, 2), X), Tv)}로 놓으면 ${E(Q(1, 4), X)} = ${Tv}${sup(2)}, ${mid} = ${2 * c}${Tv}이므로 ${yIs(`${Tv}${sup(2)} ${MINUS} ${2 * c}${Tv} + ${K}`)} = ${plusC(`(${Tv} ${MINUS} ${c})${sup(2)}`, mn)}이다. 밑이 1보다 작으므로 ${iq(l)} ≤ ${X} ≤ ${h}에서 ${frac(1, 2 ** h)} ≤ ${Tv} ≤ ${hi}이다(양 끝이 뒤집힌다). ${is(Tv, hi)}일 때 최대 ${iq(Mx)}, ${is(Tv, c)}일 때 최소 ${iq(mn)}이다.`.replace(`${frac(1, 1)}`, '1'),
        facts: { calc: [[`${hi}*${hi}-2*${c}*${hi}+${K}`, 0], [`${K}-${c}*${c}`, 1]], derived: [hi, 2] } });
    }),
    H('hard-exp-vieta', '치환한 이차방정식의 근과 계수의 관계', '①27', (d, n) => {
      if (n === 0) {
        const b = d.pick([2, 3]), s = d.int(3, 4), i = d.int(1, s - 1);
        if (2 * i === s || b ** s > 81) return null;
        const c = b ** i + b ** (s - i);
        return vals(`방정식 ${is(`${E(b, X)} + ${E(b, L(-1, s))}`, c)}의 두 근을 ${al}, ${be}라 할 때, ${al} + ${be}의 값과 ${E(b, al)} + ${E(b, be)}의 값을 구하시오.`, [[`${al} + ${be}`, s], [`${E(b, al)} + ${E(b, be)}`, c]], {
          explain: `양변에 ${jj(E(b, X), '을/를')} 곱하고 ${is(E(b, X), Tv)}로 놓으면 ${Tv}${sup(2)} ${MINUS} ${c}${Tv} + ${b ** s} = 0이다. 이 방정식의 두 근이 ${E(b, al)}, ${E(b, be)}이므로 ${is(`${E(b, al)} + ${E(b, be)}`, c)}, ${is(`${E(b, al)} × ${E(b, be)}`, E(b, `${al} + ${be}`))} = ${b ** s}에서 ${is(`${al} + ${be}`, s)}이다.`,
          facts: { calc: [[`${s}`, 0], [`${c}`, 1]] } });
      }
      const [q, t1, t2, cc, rr] = d.pick([[20, 4, 5, 2, 5], [20, 2, 10, 2, 5], [12, 3, 4, 2, 3], [12, 2, 6, 2, 3], [18, 3, 6, 3, 2], [18, 2, 9, 3, 2], [45, 5, 9, 3, 5], [45, 3, 15, 3, 5]]), p = t1 + t2;
      return radAns(`방정식 ${E(Av, `2${X}`)} ${MINUS} ${p}${E(Av, X)} + ${q} = 0의 서로 다른 두 실근 ${al}, ${be}에 대하여 ${is(`${al} + ${be}`, 2)}일 때, 양수 ${Av}의 값은? (단, ${Av} ≠ 1)`, cc, rr, {
        explain: `${is(E(Av, X), Tv)}(${Tv} &gt; 0)로 놓으면 ${Tv}${sup(2)} ${MINUS} ${p}${Tv} + ${q} = 0이고, 이 방정식의 두 근이 ${E(Av, al)}, ${E(Av, be)}이다. 근과 계수의 관계에서 ${is(`${E(Av, al)} × ${E(Av, be)}`, E(Av, `${al} + ${be}`))} = ${q}이므로 ${is(`${Av}${sup(2)}`, q)}, ${is(Av, `${cc}${rt(rr)}`)}이다.`,
        facts: { calc: [[`(${q}/${rr})**0.5`, 0], [`${rr}`, 1]], derived: [0.5, rr] } });
    }, { count: 2, standard: S8 }),
    H('hard-exp-allx', '모든 실수 x에서 성립하는 지수부등식', '①29', (d) => {
      const b = d.pick([2, 3]), c = d.int(1, 3), K = d.int(2, 9);
      return num(`모든 실수 ${X}에 대하여 부등식 ${E(b * b, X)} + ${c === 1 ? '' : `${c} × `}${E(b, L(1, 1))} + ${Av} ${MINUS} ${K} &gt; 0이 항상 성립할 때, 실수 ${Av}의 최솟값은?`, K, {
        explain: `${is(E(b, X), Tv)}(${Tv} &gt; 0)로 놓으면 ${Tv}${sup(2)} + ${b * c}${Tv} + ${Av} ${MINUS} ${K} &gt; 0이 ${Tv} &gt; 0인 모든 ${Tv}에서 성립해야 한다. 이 이차함수의 축은 ${jj(is(Tv, Q(-b * c, 2)), '으로/로')} 0보다 왼쪽이므로 ${Tv} &gt; 0에서 증가하고, ${Tv} = 0일 때의 값 ${jj(`${Av} ${MINUS} ${K}`, '이/가')} 0 이상이면 된다(판별식은 쓰지 않는다). 따라서 ${Av} ≥ ${K}이고 최솟값은 ${K}이다.`,
        facts: { calc: [[`${K}`, 0]] } });
    }, { standard: S8 }),
    H('hard-log-quadrant', '로그함수의 그래프가 어떤 사분면을 지나지 않을 조건', '②12', (d) => {
      const b = d.pick([2, 3]), c = d.int(2, b === 2 ? 4 : 3), m = d.int(2, 4), top = b ** c;
      return N(`함수 ${is(fx(), `${MINUS}${LG(b, `(${Kv} ${MINUS} ${m}${X})`)} + ${c}`)}에 대하여 ${is(Y, fx())}의 그래프가 제4사분면을 지나지 않도록 하는 자연수 ${Kv}의 최댓값은?`, top, {
        explain: `정의역은 ${X} &lt; ${frac(Kv, m)}이고, ${X}가 커지면 ${Kv} ${MINUS} ${m}${jj(X, '이/가')} 작아져 ${MINUS}${LG(b, `(${Kv} − ${m}${X})`)}는 커진다. 곧 그래프는 점근선 ${is(X, frac(Kv, m))} 쪽으로 한없이 올라가는 증가하는 곡선이다. 제4사분면(${X} &gt; 0, ${Y} &lt; 0)을 지나지 않으려면 ${Y}절편이 0 이상이어야 하므로 ${fAt(0)} = ${MINUS}${LG(b, Kv)} + ${c} ≥ 0, ${Kv} ≤ ${E(b, c)} = ${top}이다. 자연수 ${Kv}의 최댓값은 ${top}이다.`,
        facts: { calc: [[`${b}**${c}`, 0]] } });
    }),
    H('hard-log-abc', '밑이 1보다 작은 로그가 든 세 수의 대소', '②14', (d) => {
      const kind = d.pick(['ba', 'one', 'ab', 'big']);
      const small = kind !== 'big', cond = small ? `0 &lt; ${Av} &lt; ${Bv} &lt; 1` : `1 &lt; ${Av} &lt; ${Bv}`;
      const Ch = { ba: lg(Av, frac(Bv, Av)), one: `1 ${MINUS} ${lg(Bv, Av)}`, ab: lg(Bv, `${Av}${Bv}`), big: lg(Av, frac(1, Bv)) }[kind];
      const lgN = (x, y) => Math.log(y) / Math.log(x);
      const valOf = (a, b) => [lgN(a, b), lgN(b, a), { ba: lgN(a, b / a), one: 1 - lgN(b, a), ab: lgN(b, a * b), big: lgN(a, 1 / b) }[kind]];
      const samples = small ? [[0.2, 0.5], [0.1, 0.9], [0.6, 0.7], [0.05, 0.06], [0.3, 0.95]] : [[2, 3], [1.1, 9], [5, 6], [1.5, 1.6], [3, 50]];
      const order = (v) => [0, 1, 2].sort((i, j) => v[i] - v[j]).join();
      const orders = samples.map((s) => order(valOf(...s)));
      if (new Set(orders).size !== 1) throw new Error('대소가 정해지지 않는 보기: ' + kind);
      const why = {
        ba: `밑이 1보다 작아 감소하므로 ${lg(Av, Av)} &gt; ${lg(Av, Bv)} &gt; ${lg(Av, 1)}, 곧 0 &lt; A &lt; 1이다. ${lg(Bv, Av)} &gt; ${lg(Bv, Bv)} = 1이므로 B &gt; 1이고, C = ${lg(Av, Bv)} ${MINUS} 1 = A ${MINUS} 1 &lt; 0이다. 따라서 C &lt; A &lt; B이다`,
        one: `밑이 1보다 작아 감소하므로 0 &lt; A &lt; 1이고, ${lg(Bv, Av)} &gt; ${lg(Bv, Bv)} = 1이므로 B &gt; 1, C = 1 ${MINUS} B &lt; 0이다. 따라서 C &lt; A &lt; B이다`,
        ab: `밑이 1보다 작아 감소하므로 0 &lt; A &lt; 1, B &gt; 1이고, C = ${lg(Bv, Av)} + ${lg(Bv, Bv)} = B + 1 &gt; B이다. 따라서 A &lt; B &lt; C이다`,
        big: `밑이 1보다 커서 증가하므로 A = ${lg(Av, Bv)} &gt; ${lg(Av, Av)} = 1이고, 0 &lt; B = ${lg(Bv, Av)} &lt; 1, C = ${MINUS}A &lt; 0이다. 따라서 C &lt; B &lt; A이다`
      }[kind];
      return orderPick(d, `${cond}일 때, 세 수 ${is('A', lg(Av, Bv))}, ${is('B', lg(Bv, Av))}, ${is('C', Ch)}의 대소 관계로 옳은 것은?`, ['A', 'B', 'C'], valOf(...samples[0]), {
        explain: why + '.', facts: { rule: 'hard-log-abc-' + kind } });
    }),
    H('hard-log-stmt', '지수·로그의 대소에 대한 설명 가운데 옳지 않은 것', '②15', (d) => {
      const A = Av, inv = `(${frac(1, A)})`, lgN = (x, y) => Math.log(y) / Math.log(x);
      // [글, (a, M, N) → 참인가, 틀린 까닭]
      const pool = [
        [`${E(A, MV)} &gt; ${E(A, NV)}`, (a, M, N0) => a ** M > a ** N0],
        [`${lg(A, MV)} &gt; ${lg(A, NV)}`, (a, M, N0) => lgN(a, M) > lgN(a, N0)],
        [`${lg(MV, NV)} &lt; 1`, (a, M, N0) => lgN(M, N0) < 1],
        [`${lg(MV, A)} &lt; ${lg(NV, A)}`, (a, M, N0) => lgN(M, a) < lgN(N0, a)],
        [`${E(MV, A)} &gt; ${E(NV, A)}`, (a, M, N0) => M ** a > N0 ** a],
        [`${E(inv, MV)} &lt; ${E(inv, NV)}`, (a, M, N0) => (1 / a) ** M < (1 / a) ** N0],
        [`${E(MV, `${MINUS}${A}`)} &gt; ${E(NV, `${MINUS}${A}`)}`, (a, M, N0) => M ** -a > N0 ** -a, `${MINUS}${A} &lt; 0이므로 밑이 큰 ${E(MV, `${MINUS}${A}`)} = ${frac(1, E(MV, A))} 쪽이 더 작다`],
        [`${lg(NV, MV)} &lt; 1`, (a, M, N0) => lgN(N0, M) < 1, `${MV} &gt; ${NV}이므로 ${lg(NV, MV)} &gt; ${lg(NV, NV)} = 1이다`],
        [`${lg(MV, A)} &gt; ${lg(NV, A)}`, (a, M, N0) => lgN(M, a) > lgN(N0, a), `${lg(MV, A)} = ${frac(1, lg(A, MV))}이고 ${lg(A, MV)} &gt; ${lg(A, NV)} &gt; 0이므로 ${lg(MV, A)} &lt; ${lg(NV, A)}이다`],
        [`${E(inv, MV)} &gt; ${E(inv, NV)}`, (a, M, N0) => (1 / a) ** M > (1 / a) ** N0, `밑 ${jj(frac(1, A), '이/가')} 1보다 작아 감소하므로 ${E(inv, MV)} &lt; ${E(inv, NV)}이다`],
        [`${E(A, `${MINUS}${MV}`)} &gt; ${E(A, `${MINUS}${NV}`)}`, (a, M, N0) => a ** -M > a ** -N0, `${MINUS}${MV} &lt; ${MINUS}${NV}이고 밑 ${jj(A, '이/가')} 1보다 크므로 ${E(A, `${MINUS}${MV}`)} &lt; ${E(A, `${MINUS}${NV}`)}이다`]
      ];
      const samples = [[2, 5, 3], [1.5, 9, 1.2], [7, 2, 1.5], [1.1, 3, 2.9], [3, 100, 4]];
      const truth = pool.map(([, f]) => samples.map(([a, M, N0]) => f(a, M, N0)));
      truth.forEach((t, i) => { if (new Set(t).size !== 1) throw new Error('참·거짓이 정해지지 않는 보기 ' + i); });
      const trues = pool.filter((_, i) => truth[i][0]), falses = pool.filter((_, i) => !truth[i][0]);
      const wrong = d.pick(falses), rest = d.shuffle(trues).slice(0, 4);
      return choose(d, `${Av} &gt; 1, ${MV} &gt; ${NV} &gt; 1일 때, 다음 중 옳지 않은 것은?`, wrong[0], rest.map((r) => r[0]), {
        explain: `${wrong[2]}. 나머지는 모두 옳다.`, facts: { rule: 'hard-log-stmt' } });
    }),
    H('hard-log-basex', '밑에 x가 있는 로그부등식', '②24', (d) => {
      const b = d.pick([2, 3, 5]), r2 = d.int(4, 6), r1 = -d.int(1, 3), p = r1 + r2, q = -r1 * r2, sum = (r2 - 1) * r2 / 2 - 1;
      if (p <= 0) return null;
      return N(`부등식 ${LG(b, `(${L(p, q)})`)} &gt; ${frac(2, lg(X, b))}를 만족시키는 모든 정수 ${X}의 값의 합은?`.replace(`${frac(2, lg(X, b))}를`, jj(frac(2, lg(X, b)), '을/를')), sum, {
        explain: `밑의 조건에서 ${X} &gt; 0, ${X} ≠ 1이고 진수의 조건에서 ${L(p, q)} &gt; 0이다. ${frac(2, lg(X, b))} = 2${LG(b, X)} = ${LG(b, `${X}${sup(2)}`)}이므로 ${L(p, q)} &gt; ${X}${sup(2)}, (${L(1, -r2)})(${L(1, -r1)}) &lt; 0, ${iq(r1)} &lt; ${X} &lt; ${r2}이다. 조건을 함께 따지면 0 &lt; ${X} &lt; 1 또는 1 &lt; ${X} &lt; ${r2}이므로 정수 ${X}는 2부터 ${r2 - 1}까지이고, 합은 ${sum}이다.`,
        facts: { calc: [[`(${r2}-1)*${r2}/2-1`, 0]], derived: [r2, 2] } });
    }, { standard: S8 }),
    H('hard-both-equal', '가로선 위 교점들이 같은 간격일 때 밑', '②31', (d) => {
      const m = d.pick([2, 3]), p = d.int(1, 3), unknown = [1, 2, 3].filter((i) => i !== p);
      const names = { [p]: String(m), [unknown[0]]: 'a', [unknown[1]]: 'b' };
      const base = (i) => m ** (p / i), tt = 0.55, k = m ** (p * tt);
      const right = `${is(Av, powH(m, p, unknown[0]))}, ${is(Bv, powH(m, p, unknown[1]))}`;
      const pool = [];
      for (const [x, y] of [[p, unknown[0]], [unknown[0], p], [p, unknown[1]], [unknown[1], p], [2 * p, unknown[0]], [p, 2 * unknown[1]]]) pool.push(powH(m, x, y));
      const wrongs = [];
      for (const u of pool) for (const v of pool) { const t = `${is(Av, u)}, ${is(Bv, v)}`; if (stripH(t) !== stripH(right)) wrongs.push(t); }
      const curves = [1, 2, 3].map((i) => ({ f: (x) => base(i) ** x, name: `y=${names[i]}^x`, at: Math.log(k * 1.9) / Math.log(base(i)) }));
      const figure = gfig({ x: [-0.6, 3 * tt + 0.9], y: [-0.4, k * 2.1], h: 210, curves, lines: [{ y: k, name: 'y=k', said: '직선 y = k' }],
        dots: [{ x: 0, y: k, name: 'A', side: 'ul', said: 'y축 위의 점' }].concat([1, 2, 3].map((i) => ({ x: i * tt, y: k, name: 'BCD'[i - 1], side: 'dr', said: `직선 y = k 위의 ${i}번째 점` }))) });
      return choose(d, `그림과 같이 ${Y}축과 세 함수 ${[1, 2, 3].map((i) => yIs(E(names[i] === String(m) ? m : V(names[i]), X))).join(', ')}의 그래프가 직선 ${is(Y, Kv)}와 만나는 점을 각각 A, B, C, D라 하자. ${is(SG('AB'), SG('BC'))} = ${SG('CD')}일 때, 실수 ${Av}, ${Bv}의 값은? (단, ${Av} &gt; 1, ${Bv} &gt; 1, ${Kv} &gt; 1)`, right, wrongs, {
        figure, explain: `점 B의 ${X}좌표를 ${Tv}라 하면 같은 간격이므로 C, D의 ${X}좌표는 2${Tv}, 3${Tv}이다. 세 점의 ${Y}좌표가 모두 ${Kv}이므로 ${[1, 2, 3].map((i) => E(names[i] === String(m) ? m : V(names[i]), `${i === 1 ? '' : i}${Tv}`)).join(' = ')}이다. ${Tv}제곱근을 하면 ${[1, 2, 3].map((i) => (i === 1 ? (names[i] === String(m) ? String(m) : V(names[i])) : E(names[i] === String(m) ? m : V(names[i]), i))).join(' = ')}이므로 ${right}이다.`.replace(`${Tv}이라`, `${Tv}라`).replace(`${Tv}제곱근을 하면`, `양변을 ${Tv}제곱근 하면`),
        facts: { rule: 'hard-both-equal' } });
    }),
    H('hard-both-meet', '두 함수 y = aˣ, y = log_b x의 그래프가 늘 만나는 경우', '②28', (d) => {
      const cases = [
        [`${Av} &gt; 1이고 ${Bv} &gt; 1`, false, `${is(Av, 2)}, ${is(Bv, 2)}이면 ${yIs(E(2, X))}의 그래프는 늘 ${yIs(X)}의 위, ${yIs(LG(2, X))}의 그래프는 늘 아래에 있어 만나지 않는다`],
        [`${Av} &gt; 1이고 0 &lt; ${Bv} &lt; 1`, true, `${jj(yIs(E(Av, X)), '은/는')} 증가하고 ${yIs(lg(Bv, X))}는 ${X} &gt; 0에서 위로 한없이 큰 값부터 감소하므로 늘 만난다`],
        [`0 &lt; ${Av} &lt; 1이고 0 &lt; ${Bv} &lt; 1`, true, `${X}가 0에 가까우면 ${lg(Bv, X)}가 ${E(Av, X)}보다 크고, ${is(X, 1)}에서 ${is(lg(Bv, 1), 0)} &lt; ${Av}이므로 그 사이에서 만난다`],
        [`0 &lt; ${Av} &lt; 1이고 ${Bv} &gt; 1`, true, `${jj(yIs(E(Av, X)), '은/는')} 감소하고 ${yIs(lg(Bv, X))}는 증가하며 아래로 한없이 작은 값부터 올라가므로 늘 만난다`]
      ];
      const three = d.shuffle(cases).slice(0, 3);
      return comboPick(d, `다음에서 두 함수 ${yIs(E(Av, X))}, ${yIs(lg(Bv, X))}의 그래프가 항상 만나는 경우만을 있는 대로 고른 것은? (단, ${Av} &gt; 0, ${Av} ≠ 1, ${Bv} &gt; 0, ${Bv} ≠ 1)`, three.map((r) => r[0]), three.map((r) => r[1]),
        three.map((r, i) => `${GA[i]}: ${r[2]}`).join('. ') + '.');
    }),
    H('hard-sim-coef', '최댓값·최솟값으로 계수와 상수 구하기', '심3', (d) => {
      const [c, h] = d.pick([[2, 2], [3, 3], [3, 2]]), l = d.pick([-1, 0]), a = d.int(1, 3), dd = d.int(-6, 4), q0 = d.int(l + 1, h - 1);
      const Mx = a * 2 ** (c - l) + dd, mn = a * 2 ** (c - h) + dd, ans = a * 2 ** (c - q0) + dd;
      return num(`${iq(l)} ≤ ${X} ≤ ${h}에서 함수 ${is(fx(), `${Av} × ${E(2, L(-1, c))} + ${Bv}`)}의 최댓값이 ${iq(Mx)}, 최솟값이 ${iq(mn)}일 때, ${fAt(q0)}의 값은? (단, ${Av} &gt; 0이고, ${Av}와 ${Bv}는 상수이다.)`, ans, {
        explain: `${fx()} = ${2 ** c}${Av} × ${E(Q(1, 2), X)} + ${Bv}이고 ${Av} &gt; 0, 밑이 1보다 작으므로 ${fx()}는 감소한다. 최댓값은 ${is(fAt(l), `${2 ** (c - l)}${Av} + ${Bv}`)} = ${iq(Mx)}, 최솟값은 ${is(fAt(h), `${2 ** (c - h) === 1 ? '' : 2 ** (c - h)}${Av} + ${Bv}`)} = ${iq(mn)}이다. 연립하면 ${is(Av, a)}, ${is(Bv, dd)}이므로 ${is(fAt(q0), `${a} × ${E(2, c - q0)} ${dd < 0 ? MINUS : '+'} ${Math.abs(dd)}`)} = ${iq(ans)}이다.`,
        facts: { calc: [[`((${jn(Mx)})-(${jn(mn)}))/(2**(${c}-(${jn(l)}))-2**(${c}-${h}))*2**(${c}-(${jn(q0)}))+(${jn(mn)})-((${jn(Mx)})-(${jn(mn)}))/(2**(${c}-(${jn(l)}))-2**(${c}-${h}))*2**(${c}-${h})`, 0]] } });
    }),
    H('hard-sim-S', '두 로그 곡선과 가로선으로 만든 삼각형의 넓이 함수', '심5', (d) => {
      const b = d.pick([2, 3]), f = [d.bool(), d.bool(), d.bool()];
      if (!f.some(Boolean)) return null;
      const s1 = (b * b - b) / 2, k6 = b ** 6, S = V('S');
      const items = [
        `${is(nb(`${S}(1)`), f[0] ? s1 : b * b - b)}`,
        `${is(nb(`${S}(2)`), `${f[1] ? k6 : b ** 4} × ${nb(`${S}(${MINUS}2)`)}`)}`,
        `${Tv} &gt; 0일 때, ${Tv}의 값이 증가하면 ${frac(nb(`${S}(${Tv})`), nb(`${S}(${MINUS}${Tv})`))}의 값은 ${f[2] ? '증가' : '감소'}한다.`
      ];
      return comboPick(d, `0이 아닌 실수 ${Tv}에 대하여 두 곡선 ${yIs(LG(b, X))}, ${yIs(LG(b * b, X))}와 직선 ${is(Y, Tv)}가 만나는 점을 각각 P, Q라 하자. 삼각형 OPQ의 넓이를 ${nb(`${S}(${Tv})`)}라 할 때, 옳은 것만을 있는 대로 고른 것은? (단, O는 원점이다.)`, items, f,
        `${nb(`P(${E(b, Tv)}, ${Tv})`)}, ${nb(`Q(${E(b * b, Tv)}, ${Tv})`)}이고 높이는 |${Tv}|이다. ${Tv} &gt; 0이면 ${E(b * b, Tv)} &gt; ${E(b, Tv)}이고 ${Tv} &lt; 0이면 ${E(b * b, Tv)} &lt; ${jj(E(b, Tv), '으로/로')} 좌우가 바뀐다. ㄱ. ${nb(`${S}(1)`)} = ${frac(1, 2)} × ${b * b - b} × 1 = ${s1}. ㄴ. ${nb(`${S}(2)`)} = ${frac(1, 2)} × ${b ** 4 - b * b} × 2, ${nb(`${S}(${MINUS}2)`)} = ${frac(1, 2)} × (${frac(1, b * b)} ${MINUS} ${frac(1, b ** 4)}) × 2이므로 ${b ** 6}배이다. ㄷ. ${frac(nb(`${S}(${Tv})`), nb(`${S}(${MINUS}${Tv})`))} = ${E(b, `3${Tv}`)}이므로 증가한다.`);
    }),
    H('hard-sim-k', '진수가 이차식인 로그함수의 최댓값과 최솟값의 합으로 상수', '심6', (d) => {
      const b = d.pick([2, 3]), h = d.int(2, 3), w = d.int(h, 2 * h - 1), list = [];
      for (let k = h * h + 1; k <= h * h + 14; k += 1) { let P = k * (k - h * h), e = 0; while (P % b === 0) { P /= b; e += 1; } if (e >= 1 && P >= 2) list.push([k, e, P]); }
      if (!list.length) return null;
      const [k0, e, r] = d.pick(list), g = (x) => x * x - 2 * h * x + k0;
      return N(`0 ≤ ${X} ≤ ${w}에서 함수 ${is(fx(), LG(b, `(${X}${sup(2)} ${MINUS} ${2 * h}${X} + ${Kv})`))} (${Kv} &gt; ${h * h})의 최댓값과 최솟값의 합이 ${e} + ${LG(b, r)}일 때, 상수 ${Kv}의 값은?`, k0, {
        explain: `${X}${sup(2)} ${MINUS} ${2 * h}${X} + ${Kv} = (${L(1, -h)})${sup(2)} + ${Kv} ${MINUS} ${h * h}이다. 0 ≤ ${X} ≤ ${w}에서 축 ${jj(is(X, h), '으로/로')}부터 더 먼 끝은 ${is(X, 0)}이므로 진수는 ${Kv} ${MINUS} ${h * h} 이상 ${Kv} 이하이다. 밑이 1보다 크므로 최댓값과 최솟값의 합은 ${LG(b, `${Kv}(${Kv} − ${h * h})`)} = ${LG(b, b ** e * r)}이다. ${is(`${Kv}(${Kv} ${MINUS} ${h * h})`, b ** e * r)}에서 ${is(Kv, k0)}이다.`,
        facts: { calc: [[`${k0}`, 0]], derived: [k0], check: `${g(0)}·${g(h)} = ${b ** e * r}` } });
    }),
    H('hard-sim-quad', '지수·로그 곡선과 세로선·기울기 −1인 직선으로 만든 사각형의 넓이', '심7', (d) => {
      const [s, k] = d.pick([[2, 3], [2, 4], [2, 5], [3, 4]]), c0 = 1 + s - 2 ** (k - s - 1), Lh = 2 ** (k - 1) - 2 ** (k - s - 1) + s, a = k - 2;
      const P = { A: [k, 2 ** (k - 1) + c0], C: [k - s, 1 + s], D: [k - 1, 0], B: [k, 1] }, ord = ['A', 'C', 'D', 'B'];
      let two = 0;
      ord.forEach((n0, i) => { const [x1, y1] = P[n0], [x2, y2] = P[ord[(i + 1) % 4]]; two += x1 * y2 - x2 * y1; });
      const area = Math.abs(two) / 2;
      if (!Number.isInteger(area)) return null;
      const ef = (x) => 2 ** (x - 1) + c0, lf = (x) => Math.log(x - a) / Math.log(2), yTop = P.A[1];
      const figure = gfig({ x: [-0.6, k + 1.2], y: [Math.min(-1.4, c0 - 0.5), yTop + 1.2], h: 230,
        curves: [{ f: ef, name: c0 < 0 ? `y=2^{x-1}-${-c0}` : `y=2^{x-1}+${c0}` }, { f: lf, from: a + 0.01, name: 'y=log_2 (x-a)' }],
        lines: [{ x: k, dash: true, said: '직선 x = k' }], segs: [{ p: P.B, q: P.C }],
        dots: ord.map((n0) => ({ x: P[n0][0], y: P[n0][1], name: n0, side: { A: 'r', B: 'dr', C: 'ul', D: 'ul' }[n0], said: { A: '직선 x = k와 첫째 곡선의 교점', B: '직선 x = k와 둘째 곡선의 교점', C: '기울기가 −1인 직선과 첫째 곡선의 교점', D: '둘째 곡선과 x축의 교점' }[n0] })) });
      return N(`그림과 같이 두 상수 ${Av}, ${Kv}에 대하여 직선 ${is(X, Kv)}가 두 곡선 ${yIs(plusC(E(2, L(1, -1)), c0))}, ${yIs(LG(2, `(${X} − ${Av})`))}와 만나는 점을 각각 A, B라 하고, 점 B를 지나고 기울기가 ${MINUS}1인 직선이 곡선 ${jj(yIs(plusC(E(2, L(1, -1)), c0)), '과/와')} 만나는 점을 C라 하자. ${is(SG('AB'), Lh)}, ${is(SG('BC'), `${s}${rt(2)}`)}일 때, 곡선 ${yIs(LG(2, `(${X} − ${Av})`))}가 ${X}축과 만나는 점 D에 대하여 사각형 ACDB의 넓이는? (단, 0 &lt; ${Av} &lt; ${Kv})`, area, {
        figure, explain: `${nb(`A(${Kv}, ${E(2, `${Kv} − 1`)} ${c0 < 0 ? MINUS : '+'} ${Math.abs(c0)})`)}이고 ${is(SG('AB'), Lh)}이므로 점 B의 ${Y}좌표는 ${E(2, `${Kv} − 1`)} ${c0 - Lh < 0 ? MINUS : '+'} ${Math.abs(c0 - Lh)}이다. 기울기가 ${MINUS}1이고 ${is(SG('BC'), `${s}${rt(2)}`)}이므로 C는 B에서 왼쪽으로 ${s}, 위로 ${s}만큼 간 점이다. C가 곡선 위에 있으므로 ${is(E(2, `${Kv} − 1`), `${E(2, `${Kv} − ${s + 1}`)} + ${Lh - s}`)}에서 ${is(Kv, k)}이다. 따라서 ${nb(`A(${P.A})`).replace(',', ', ')}, ${nb(`B(${k}, 1)`)}, ${nb(`C(${k - s}, ${1 + s})`)}이고, ${is(1, LG(2, `(${k} − ${Av})`))}에서 ${is(Av, a)}, ${nb(`D(${k - 1}, 0)`)}이다. 사각형 ACDB를 대각선 BC로 나누면 ${frac(1, 2)} × ${Lh} × ${s} + ${frac(1, 2)} × ${s}${rt(2)} × ${rt(2)} = ${area}이다.`,
        facts: { calc: [[`${Lh}*${s}/2+${s}`, 0]], derived: [2] } });
    })
  ];

  B.addGroup('11-1-2', { id: 'hard', title: '실력 문제', standard: S7, types: hard });
})(typeof window !== 'undefined' ? window : globalThis);
