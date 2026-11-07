// 고등학교 확률과 통계 Ⅲ-1 「확률분포」(11-3-5) — 실력 문항.
// 이 단원에서 흔히 잘못 아는 것
//  - 연속확률변수의 확률밀도함수는 그래프 아래 전체 넓이가 1이다 — 높이가 1이라고 여기거나, 대칭인 그래프에서 대칭축 한쪽의 넓이가 1/2임을 쓰지 못한다.
//  - E(X²)를 {E(X)}²으로 착각한다. V(X) = E(X²) − {E(X)}²에서 E(X²)가 주어지면 확률을 정하는 식이 하나 더 생긴다.
//  - 값만 다른 두 표(Y의 값이 X의 값의 10배 + 1)를 따로 셈한다 — Y = aX + b로 보면 E(aX + b), V(aX + b)로 바로 구한다.
//  - 점의 좌표·상금·거리처럼 횟수의 일차식인 확률변수를 이항분포로 바로 셈한다 — 먼저 횟수 Y의 이항분포를 정하고 X = aY + b로 고쳐야 한다.
// 실력에 둔 것: ① 뜻을 정확히 대야 풀리는 꼴(심1 대칭과 확률의 비, 심2 넓이로 정하는 꺾인 점, 심3 E(X²) 조건, 심4 Y = aX + b 알아보기)
//              ② 세 단계 넘게 잇는 꼴(①29 멈출 때까지 꺼낸 개수, ②22 점의 좌표·상금, 심6 이동한 점과 직선 사이의 거리).
// ①29의 둘째 차례: 원문 규칙(첫 공이 짝수이거나 합이 짝수가 되면 멈춘다)은 공의 개수와 상관없이 평균이 늘 2라, 홀짝을 바꾼 규칙(첫 공이 홀수이거나
//  합이 홀수가 되면 멈춘다)으로 실었다. 이러면 공이 5~9개일 때 평균이 3/2, 7/4, 8/5, 9/5, 5/3으로 바뀐다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, frac, lines } = B.kit;
  const { MINUS, qadd, qsub, qmul, qdiv, gcd, nb, V, sup } = B.kit.mid;
  const { ms, pr, ev, vr, dist, jh: jh0, bin, plot } = B.kit.hs;
  const jh = (h, pair) => (pair.includes('/') ? jh0(h, pair) : h + pair);
  const { UNIT, STD1, STD2, STD3, num, par, jn, jq, R, fq, pl, sumQ, comb, X, PX, PR, EX, VX, EX2, rng, cell, distFit, H, numQ, ratQ, slots, meanOf, ex2Of, varOf, meanJ, varJ, sumTold, pdfPlot, areaQ, fl } = B.kit.u1135;
  const plusB = (b) => (b === 0 ? '' : b < 0 ? ' ' + MINUS + ' ' + Math.abs(b) : ' + ' + b);

  B.addGroup(UNIT, {
    id: 'hard', title: '실력 문제', standard: STD2, types: [
      H('hard-stop', '멈출 때까지 꺼낸 공의 개수의 평균', '①29', (d, n) => {
        if (n === 0) {
          const w = d.pick([2, 2, 3]), r = d.int(2, 5), Nn = w + r, all = comb(Nn, w);
          const xs = [], ps = [];
          for (let k = w; k <= Nn; k += 1) { xs.push(k); ps.push(R(comb(k - 1, w - 1), all)); }
          const E = meanOf(xs, ps);
          if (E.q === 1) return null;
          return ratQ(`흰 공 ${w}개와 빨간 공 ${r}개가 들어 있는 상자에서 공을 한 개씩 임의로 꺼낼 때, 흰 공 ${w}개가 모두 나올 때까지 꺼낸 공의 개수를 확률변수 ${jh(X, '이라/라')} 하자. ${jh(EX, '의')} 값은? (단, 꺼낸 공은 상자에 다시 넣지 않는다.)`, E, {
            explain: `${X} = ${V('k')}이면 ${V('k')}번째에 마지막 흰 공이 나오고 그 앞의 ${V('k')} ${MINUS} 1번 가운데 흰 공이 ${w - 1}번 나온다. 공을 모두 꺼내 늘어놓는 방법 가운데 흰 공의 자리를 고르는 방법은 ${all}가지이므로 ${xs.map((x, i) => nb(PX(x) + ' = ' + fq(ps[i]))).join(', ')}이다. 따라서 ${EX} = ${fq(E)}이다.`,
            value: meanJ(xs, ps), auto: true
          });
        }
        const m = d.int(5, 9), O = Math.ceil(m / 2), Ev = m - O;
        // 첫 공이 홀수이면 멈추고, 짝수이면 합이 홀수가 될 때(홀수가 나올 때)까지 꺼낸다.
        const xs = [1], ps = [R(O, m)];
        let left = R(Ev, m);
        for (let k = 2; k <= Ev + 1; k += 1) {
          const evLeft = Ev - (k - 1), tot = m - (k - 1), pOdd = R(O, tot);
          xs.push(k); ps.push(qmul(left, pOdd));
          left = qmul(left, R(evLeft, tot));
        }
        if (sumQ(ps).p !== 1 || sumQ(ps).q !== 1) return null;
        const E = meanOf(xs, ps);
        if (E.q === 1) return null;
        return ratQ(`1부터 ${m}까지의 자연수가 하나씩 적힌 공 ${m}개가 들어 있는 주머니에서 공을 한 개씩 임의로 꺼내며 꺼낸 공에 적힌 수를 더한다. 첫 번째 꺼낸 공에 적힌 수가 홀수이거나, 꺼낸 공에 적힌 수의 합이 홀수가 되면 꺼내기를 멈춘다. 멈출 때까지 꺼낸 공의 개수를 확률변수 ${jh(X, '이라/라')} 할 때, ${jh(EX, '의')} 값은? (단, 꺼낸 공은 주머니에 다시 넣지 않는다.)`, E, {
          explain: `첫 공이 홀수이면 ${X} = 1이다. 첫 공이 짝수이면 합이 짝수인 채로 이어지다가 처음으로 홀수가 나올 때 합이 홀수가 되어 멈춘다. 홀수 ${O}개, 짝수 ${Ev}개이므로 ${xs.map((x, i) => nb(PX(x) + ' = ' + fq(ps[i]))).join(', ')}이고 ${EX} = ${fq(E)}이다.`,
          value: meanJ(xs, ps), auto: true
        });
      }, { count: 2, standard: STD2 }),

      H('hard-move', '점의 좌표·상금을 이항분포 횟수의 일차식으로', '②22', (d, n) => {
        if (n === 0) {
          const ev0 = d.pick([{ t: '세 개의 동전을 동시에 던져 나온 면이 모두 같으면', p: R(1, 4) }, { t: '한 개의 주사위를 던져 6의 눈이 나오면', p: R(1, 6) }, { t: '두 개의 동전을 동시에 던져 모두 앞면이 나오면', p: R(1, 4) }, { t: '한 개의 주사위를 던져 3의 배수의 눈이 나오면', p: R(1, 3) }]);
          const u = d.int(1, 5), v = d.int(1, 4), q = qsub(R(1), ev0.p), unit = ev0.p.q * q.q / gcd(ev0.p.q, q.q);
          const nn = unit * d.int(2, Math.floor(400 / unit)), VY = qmul(qmul(R(nn), ev0.p), q), ans = qmul(R((u + v) * (u + v)), VY);
          if (ans.q !== 1 || ans.p > 9999 || nn > 400) return null;
          return numQ(`수직선의 원점에 점 P가 있다. ${ev0.t} 점 P를 양의 방향으로 ${u}만큼, 그렇지 않으면 음의 방향으로 ${v}만큼 옮기는 시행을 ${nn}번 반복할 때, 옮긴 점 P의 좌표를 확률변수 ${jh(X, '이라/라')} 하자. ${jh(VX, '의')} 값은?`, ans.p, {
            explain: `양의 방향으로 옮긴 횟수를 ${ms('Y')}라 하면 ${jh(ms('Y'), '은/는')} 이항분포 ${jh(bin(nn, frac(ev0.p.p, ev0.p.q)), '을/를')} 따르고 ${vr('Y')} = ${nn} × ${fq(ev0.p)} × ${fq(q)} = ${fq(VY)}이다. ${X} = ${u}${ms('Y')} ${MINUS} ${v}(${nn} ${MINUS} ${ms('Y')}) = ${u + v}${ms('Y')} ${MINUS} ${v * nn}이므로 ${VX} = ${u + v}<sup>2</sup> × ${fq(VY)} = ${ans.p}이다.`,
            value: `(${u}+${v})*(${u}+${v})*${nn}*${jq(ev0.p)}*(1-${jq(ev0.p)})`, auto: true
          });
        }
        const CONDS = [
          { t: '세 눈의 수의 합과 곱이 모두 4의 배수', f: (a, b, c) => (a + b + c) % 4 === 0 && (a * b * c) % 4 === 0 },
          { t: '세 눈의 수의 합이 3의 배수이고 곱이 짝수', f: (a, b, c) => (a + b + c) % 3 === 0 && (a * b * c) % 2 === 0 },
          { t: '세 눈의 수의 합이 짝수이고 곱이 3의 배수', f: (a, b, c) => (a + b + c) % 2 === 0 && (a * b * c) % 3 === 0 },
          { t: '세 눈의 수의 곱이 6의 배수이고 합이 홀수', f: (a, b, c) => (a * b * c) % 6 === 0 && (a + b + c) % 2 === 1 }
        ];
        const C0 = d.pick(CONDS);
        let cnt = 0; for (let a = 1; a <= 6; a += 1) for (let b = 1; b <= 6; b += 1) for (let c = 1; c <= 6; c += 1) if (C0.f(a, b, c)) cnt += 1;
        const p = R(cnt, 216), nn = p.q * d.int(1, Math.floor(720 / p.q)), E = nn * p.p / p.q, prize = d.pick([10, 100]), ans = prize * E;
        if (ans > 9999 || nn < 50) return null;
        return numQ(`세 개의 주사위를 동시에 던지는 시행을 ${nn}번 반복할 때, ${C0.t}인 횟수의 ${prize}배를 상금(원)으로 받는다. 받는 상금의 기댓값은?`, ans, {
          unit: '원',
          explain: `세 눈의 수 216가지 가운데 ${C0.t}인 경우는 ${cnt}가지이므로 한 번의 확률은 ${frac(cnt, 216)}${p.q === 216 ? '' : ' = ' + fq(p)}이다. 그런 횟수를 ${jh(X, '이라/라')} 하면 ${jh(X, '은/는')} 이항분포 ${jh(bin(nn, frac(p.p, p.q)), '을/를')} 따르고 ${EX} = ${nn} × ${fq(p)} = ${E}이므로 ${ev(prize + X)} = ${prize} × ${E} = ${ans}(원)이다.`,
          value: `${prize}*${nn}*${cnt}/216`, derived: [cnt, 216]
        });
      }, { count: 2, standard: STD3 }),

      H('hard-sym', '대칭인 확률밀도함수에서 확률의 비', '심1', (d) => {
        const c = d.int(3, 6), t = d.int(1, c - 1), al = d.int(2, 7), be = d.int(2, 7);
        if (al === be || gcd(al, be) !== 1) return null;
        // α P(t ≤ X ≤ c) = β P(2c − t ≤ X ≤ 2c) → P(t ≤ X ≤ c) = β/(2(α + β))
        const mid = R(be, 2 * (al + be)), edge = R(al, 2 * (al + be)), kind = d.int(0, 2);
        const ask = kind === 0 ? rng(t, 2 * c - t) : kind === 1 ? rng(0, t) : rng(t, 2 * c);
        const ans = kind === 0 ? qmul(R(2), mid) : kind === 1 ? edge : qadd(qmul(R(2), mid), edge);
        return ratQ(`연속확률변수 ${jh(X, '이/가')} 갖는 값의 범위는 ${ms(`0 <= X <= ${2 * c}`)}이고, ${X}의 확률밀도함수의 그래프는 직선 ${jh(ms('x = ' + c), '에')} 대하여 대칭이다. ${jh(nb(al + rng(t, c) + ' = ' + be + rng(2 * c - t, 2 * c)), '일')} 때, ${jh(ask, '의')} 값은?`, ans, {
          explain: `대칭이므로 ${rng(2 * c - t, 2 * c)} = ${rng(0, t)}이고 ${rng(0, c)} = ${frac(1, 2)}이다. ${rng(0, t)} = ${V('u')}, ${rng(t, c)} = ${V('v')}라 하면 ${V('u')} + ${V('v')} = ${frac(1, 2)}, ${al}${V('v')} = ${be}${V('u')}이므로 ${V('u')} = ${fq(edge)}, ${V('v')} = ${fq(mid)}이다. 따라서 ${ask} = ${fq(ans)}이다.`,
          value: kind === 0 ? `2*${be}/(2*(${al}+${be}))` : kind === 1 ? `${al}/(2*(${al}+${be}))` : `(2*${be}+${al})/(2*(${al}+${be}))`, derived: [2]
        });
      }, { standard: STD1 }),

      H('hard-corner', '넓이로 정하는 확률밀도함수의 꺾인 점', '심2', (d) => {
        const t = R(1, d.pick([2, 3, 4])), L = d.int(2, 3), aV = qadd(t, R(d.int(1, 2 * L - 2), 2));
        if (qsub(R(L), aV).p <= 0) return null;
        const h = qdiv(R(2), qsub(qadd(aV, R(L)), t));
        if (h.p >= h.q) return null;
        const ans = qmul(qsub(aV, t), h);
        const fig = pdfPlot([[0, 0], [fl(t), fl(h)], [fl(aV), fl(h)], [L, 0]], {
          xt: [{ v: fl(t), t: pl(t) }, { v: fl(aV), t: 'a' }, { v: L, t: String(L) }], yt: [{ v: fl(h), t: pl(h) }],
          say: `그래프는 점 (0, 0), (${pl(t)}, ${pl(h)}), (a, ${pl(h)}), (${L}, 0)을 차례로 잇는 꺾은선이다.`
        });
        return ratQ(`연속확률변수 ${jh(X, '이/가')} 갖는 값의 범위는 ${ms(`0 <= X <= ${L}`)}이고, ${X}의 확률밀도함수의 그래프가 다음과 같을 때, ${jh(PR(`${pl(t)} <= X <= a`).replace(pl(t), frac(t.p, t.q)), '의')} 값은? (단, ${V('a')}는 상수이다.)`, ans, {
          figure: fig,
          explain: `그래프와 x축으로 둘러싸인 부분의 넓이가 1이므로 ${frac(1, 2)} × ${fq(t)} × ${fq(h)} + (${V('a')} ${MINUS} ${fq(t)}) × ${fq(h)} + ${frac(1, 2)} × (${L} ${MINUS} ${V('a')}) × ${fq(h)} = 1, ${V('a')} = ${fq(aV)}이다. 구하는 확률은 가로 ${fq(qsub(aV, t))}, 세로 ${fq(h)}인 직사각형의 넓이이므로 ${fq(ans)}이다.`,
          value: `(2/${jq(h)}-${L}+${jq(t)}-${jq(t)})*${jq(h)}`, derived: [2]
        });
      }, { standard: STD1 }),

      H('hard-sq', 'E(X²) 조건으로 분포표의 확률을 정해 분산 구하기', '심3', (d) => {
        const dd = d.pick([1, 2, 3]), p0 = R(1, d.pick([4, 5, 6, 8])), D = d.pick([12, 24, 30, 20]), restQ = qsub(R(1), p0);
        const a = R(d.int(1, Math.floor(fl(restQ) * D) - 1), D), b = qsub(restQ, a);
        if (a.p <= 0 || b.p <= 0 || (a.p === b.p && a.q === b.q)) return null;
        const xs = [0, dd, 2 * dd], ps = [p0, a, b], e2 = ex2Of(xs, ps), Vv = varOf(xs, ps);
        if (Vv.q === 1) return null;
        const aH = V('a'), bH = V('b');
        return ratQ(`이산확률변수 ${X}의 확률분포가 다음 표와 같다. ${jh(nb(EX2 + ' = ' + fq(e2)), '일')} 때, ${jh(VX, '의')} 값은? (단, ${aH}, ${bH}는 상수이다.)`, Vv, {
          figure: distFit(xs, [cell(p0), aH, bH]),
          explain: `${fq(p0)} + ${aH} + ${bH} = 1이고 ${EX2} = ${dd * dd}${aH} + ${4 * dd * dd}${bH} = ${fq(e2)}이므로 ${aH} = ${fq(a)}, ${bH} = ${fq(b)}이다. ${EX} = ${fq(meanOf(xs, ps))}이므로 ${VX} = ${fq(e2)} ${MINUS} (${fq(meanOf(xs, ps))})<sup>2</sup> = ${fq(Vv)}이다.`,
          value: varJ(xs, ps), auto: true
        });
      }, { standard: STD2 }),

      H('hard-twin', '확률이 같은 두 표 — Y = aX + b로 보기', '심4', (d) => {
        const [m, v] = d.pick([[R(2), R(1)], [R(3), R(1)], [R(5, 2), R(5, 4)], [R(5, 2), R(1, 4)], [R(2), R(1, 2)], [R(3), R(1, 2)]]);
        const c = d.pick([10, 5, 4, 2, 3, 6]), e = d.pick([1, -1, 2, 3, 0]);
        const EY = qadd(qmul(R(c), m), R(e)), VY = qmul(R(c * c), v);
        if (EY.q !== 1 || VY.q !== 1 || c + e <= 0) return null;
        const e2 = qadd(v, qmul(m, m)), ys = [1, 2, 3, 4].map((x) => c * x + e), ab = ['a', 'b', 'c', 'd'].map((t) => V(t));
        return slots(`두 이산확률변수 ${X}, ${ms('Y')}의 확률분포를 표로 나타내면 각각 다음과 같다. ${nb(EX + ' = ' + fq(m))}, ${jh(nb(EX2 + ' = ' + fq(e2)), '일')} 때, ${ev('Y')}와 ${jh(vr('Y'), '의')} 값은?`, [
          [ev('Y'), EY.p, `${c}*${jq(m)}+${jn(e)}`], [vr('Y'), VY.p, `${c}*${c}*(${jq(e2)}-${jq(m)}*${jq(m)})`]
        ], {
          figure: '<div style="display:grid;gap:6px">' + dist([1, 2, 3, 4], ab) + dist(ys, ab, { v: 'Y' }) + '</div>',
          explain: `두 표에서 확률이 같고 ${ms('Y')}의 값은 ${X}의 값의 ${c}배${e === 0 ? '' : e > 0 ? `에 ${josa(e, '을/를')} 더한` : `에서 ${josa(-e, '을/를')} 뺀`} 것이므로 ${nb(ms('Y') + ' = ' + c + X + plusB(e))}이다. ${VX} = ${fq(e2)} ${MINUS} (${fq(m)})<sup>2</sup> = ${fq(v)}이므로 ${ev('Y')} = ${c} × ${fq(m)}${plusB(e)} = ${EY.p}, ${vr('Y')} = ${c}<sup>2</sup> × ${fq(v)} = ${VY.p}이다.`,
          auto: true
        });
      }, { standard: STD2 }),

      H('hard-line', '옮긴 점과 직선 사이의 거리의 기댓값', '심6', (d) => {
        const [al, be, hyp] = d.pick([[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10]]);
        const die = d.pick([{ t: '2 이하이면', o: '3 이상이면', p: R(1, 3) }, { t: '짝수이면', o: '홀수이면', p: R(1, 2) }, { t: '4 이하이면', o: '5 이상이면', p: R(2, 3) }]);
        const a = d.int(1, 4), b = d.int(1, 3), nn = die.p.q * d.int(3, 8);
        // P(aY, b(n − Y)), 거리 = (α a Y + β b (n − Y)) / hyp
        const k = al * a - be * b, c0 = be * b * nn, EY = qmul(R(nn), die.p), ans = qdiv(qadd(qmul(R(k), EY), R(c0)), R(hyp));
        if (k === 0) return null;
        return ratQ(`좌표평면의 원점에 점 P가 있다. 한 개의 주사위를 던져 나온 눈의 수가 ${die.t} 점 P를 x축의 양의 방향으로 ${a}만큼, ${die.o} y축의 양의 방향으로 ${b}만큼 옮긴다. 이 시행을 ${nn}번 반복하여 옮긴 점 P와 직선 ${nb(ms(`${al}x + ${be}y = 0`))} 사이의 거리를 확률변수 ${jh(X, '이라/라')} 할 때, ${jh(EX, '의')} 값은?`, ans, {
          explain: `눈의 수가 ${die.t.replace('이면', '인')} 횟수를 ${ms('Y')}라 하면 ${jh(ms('Y'), '은/는')} 이항분포 ${jh(bin(nn, frac(die.p.p, die.p.q)), '을/를')} 따르고 ${ev('Y')} = ${fq(EY)}이다. 옮긴 점은 (${a === 1 ? '' : a}${ms('Y')}, ${b === 1 ? '' : b}(${nn} ${MINUS} ${ms('Y')}))이고 좌표가 모두 0 이상이므로 ${X} = ${frac(`${al} × ${a === 1 ? '' : a}${ms('Y')} + ${be} × ${b === 1 ? '' : b}(${nn} ${MINUS} ${ms('Y')})`, hyp)} = ${frac(`${k === 1 ? '' : k === -1 ? MINUS : num(k)}${ms('Y')} + ${c0}`, hyp)}이다. 따라서 ${EX} = ${frac(`${par(k)} × ${fq(EY)} + ${c0}`, hyp)} = ${fq(ans)}이다.`,
          value: `(${al}*${a}*${nn}*${jq(die.p)}+${be}*${b}*(${nn}-${nn}*${jq(die.p)}))/${hyp}`, auto: true
        });
      }, { standard: STD3 })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
