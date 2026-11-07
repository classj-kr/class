// 고등학교 기하 3단원 「도형의 방정식」(11-4-8) — 실력 문항.
// 이 단원에서 아이들이 흔히 잘못 아는 것:
//  - 두 직선 위를 움직이는 두 점 사이의 거리가 가장 짧을 때 그 선분이 두 직선에 모두 수직이라는 것(공통수선)을 쓰지 못하고, 한 직선에만 수직인 것으로 푼다.
//  - 평면 위의 점 P 에 대하여 AP + BP 의 최솟값을 구할 때 두 점이 평면의 같은 쪽에 있는지 보지 않는다. 대칭점은 수선의 발을 두 배로 늘린 점이다.
//  - 직선과 평면이 이루는 각과 직선의 방향벡터·평면의 법선벡터가 이루는 각을 헷갈린다(서로 여각이다).
//  - 구 위의 점과 평면 사이의 거리의 최댓값은 구와 평면이 만나든 만나지 않든 (중심과 평면 사이의 거리) + (반지름의 길이)이다.
//  - 거울에서 반사되는 빛: 크기가 같은 두 벡터의 합이 두 벡터가 이루는 각을 이등분한다는 것을 쓰지 못한다.
//  - 구와 평면이 만나서 생기는 원 위의 두 점을 구의 중심에서 볼 때 그 각이 가장 큰 것은 두 점이 원의 지름의 양 끝일 때이다.
// 실력에 둔 것은 ① 상황·조건의 장치 때문에 배운 뜻을 정확히 대야 풀리는 문제와 ② 세 단계 넘게 이어 생각해야 풀리는 문제뿐이다(11-4-8a.js 머리 주석의 기준).
// 기하 자료에는 심화 문서(기출 모의고사)가 없어 대단원 평가·중단원 평가의 끝 문제와 교과서 중단원 마무리·대단원 평가하기의 끝 문제에서 골랐다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, N } = B.kit;
  const { MINUS, V, sup, nb, poly, rt, radAns, SG } = B.kit.mid;
  const { vec, coordAns, qAns, ms, trig } = B.kit.hs;
  const K = B.kit.u48x;
  const { UNIT, S4, S5, gcd, range, z0, dot, add, sub, mul, n2, cross, gall, prim, sqf, allNZ, nz2, nz, sgn, pq, coefTx, VEC3, VEC2, INT3,
    X, Y, Z, AX, iq, js, tup, ptN, vecIs, numer, rootTx, lj, L, lineTx, flips, planeTx, sphereTx, absS, dotS, n2S, planeAns, H,
    pnTx, planeAny, smallP, nzP, xSign, alpha, intN, lat, parallel3, dotTx } = K;

  const hardTypes = [
    H('hard-skew', '두 직선 위를 움직이는 두 점 사이의 거리의 최솟값', '①17', (d) => {
      const W = [[2, 1, 0], [1, 2, 0], [1, 0, 2], [2, 0, 1], [0, 1, 2], [0, 2, 1], [1, 1, 1], [1, 2, 3], [2, 1, 3], [1, -2, 1], [2, -1, 1], [1, 1, -2], [3, 1, 1], [1, 3, 1]];
      const pk = d.until(() => ({ w: d.pick(W).map((x) => z0(x * sgn(d))), u: d.pick(VEC3), v: d.pick(VEC3) }), ({ w, u, v }) => sqf(n2(w)) && dot(u, w) === 0 && dot(v, w) === 0 && allNZ(u) && allNZ(v) && !parallel3(u, v));
      const { w, u, v } = pk, F1 = smallP(d, -3, 3), F2 = add(F1, w), a = nz(d, -2, 2), b = nz(d, -2, 2), P = add(F1, mul(a, u)), Q = add(F2, mul(b, v));
      const cr = cross(u, v), e = sub(Q, P), vt = V('t'), vs = V('s');
      const pt = (p0, dir, t) => nb(`(${[0, 1, 2].map((i) => poly([[dir[i], t], [p0[i], '']])).join(', ')})`);
      return radAns(`두 직선 ${L('l')}: ${lineTx(P, u, flips(d, 3))}, ${L('m')}: ${lineTx(Q, v, flips(d, 3))}에 대하여 직선 ${L('l')} 위를 움직이는 점 P와 직선 ${L('m')} 위를 움직이는 점 Q가 있다. 선분 PQ의 길이의 최솟값은?`, 1, n2(w), {
        explain: `${nb('P' + pt(P, u, vt))}, ${lj(nb('Q' + pt(Q, v, vs)), '으로/로')} 놓는다. 선분 PQ의 길이가 가장 짧을 때 ${lj(vec('PQ'), '은/는')} 두 방향벡터 ${tup(u)}, ${lj(tup(v), '과/와')} 모두 수직이다. 두 내적을 0으로 놓고 연립하면 ${nb(`${vt} = ${iq(-a)}`)}, ${nb(`${vs} = ${iq(-b)}`)}이고 ${vec('PQ')} = ${lj(tup(w), '이/가')}므로 최솟값은 ${rt(n2(w))}이다.`,
        facts: { calc: [[`((${dotS(e, cr)})*(${dotS(e, cr)}))/(${n2S(cr)})`, 0]] }
      });
    }, { standard: S4 }),
    H('hard-tri', '좌표평면에서 직선 위의 두 점과 정삼각형 — 내적의 값', '①20', (d) => {
      const pk = d.until(() => ({ u: d.pick(VEC2), k: nz(d, -2, 2) }), ({ u, k }) => allNZ(u) && Math.max(...u.map(Math.abs)) <= 4 && (k * k * n2(u)) % 3 !== 0);
      const { u, k } = pk, Hh = [d.int(-4, 4), d.int(-4, 4)], wv = [-k * u[1], k * u[0]], A = add(Hh, wv), P = add(Hh, mul(nz(d, -2, 2), u)), h2 = n2(wv), e = sub(A, P);
      return qAns(`좌표평면 위의 점 ${lj(ptN('A', A), '과/와')} 직선 ${L('l')}: ${lineTx(P, u, flips(d, 2))} 위의 두 점 B, C에 대하여 삼각형 ABC가 정삼각형일 때, ${nb(vec('BA') + ' · ' + vec('BC'))}의 값은?`, [2 * h2, 3], {
        explain: `A에서 직선 ${L('l')}에 내린 수선의 발을 H라고 하면 ${vec('AH')} · ${vec('u')} = 0(${vecIs('u', u)})에서 ${nb('H' + tup(Hh))}이고 ${nb(`AH = ${rootTx(h2)}`)}이다. 정삼각형의 높이가 ${rootTx(h2)}이므로 한 변의 길이의 제곱은 ${frac(String(4 * h2), '3')}이고, ${nb(vec('BA') + ' · ' + vec('BC'))} = ${frac(String(4 * h2), '3')} × ${trig('cos', '60°')} = ${frac(String(2 * h2), '3')}이다.`,
        facts: { value: `2*((${n2S(e)})-(${dotS(e, u)})*(${dotS(e, u)})/(${n2S(u)}))/3` }
      });
    }, { standard: S4 }),
    H('hard-axis2', '평행한 직선이 두 좌표평면과 만나는 두 점 사이의 거리', '①18', (d) => {
      const pairs = [[2, 0], [2, 1], [0, 1]], names = { 0: 'yz평면', 1: 'zx평면', 2: 'xy평면' };
      const [k1, k2] = d.pick(pairs), [u, nu] = intN(d, (v) => allNZ(v) && Math.max(...v.map(Math.abs)) <= 6 && v[0] !== 0);
      const [t1, t2] = d.until(() => [nz(d, -3, 3), nz(d, -3, 3)], ([a, b]) => a !== b), P0 = [0, 0, 0];
      const other = [0, 1, 2].find((i) => i !== k1 && i !== k2);
      P0[k1] = z0(-t1 * u[k1]); P0[k2] = z0(-t2 * u[k2]); P0[other] = d.int(-4, 4);
      const g = smallP(d, -4, 4), sc = d.pick([1, -1]), Aa = add(P0, mul(t1, u)), Bb = add(P0, mul(t2, u)), ans = Math.abs(t1 - t2) * nu;
      return N(`점 ${lj(ptN('P', P0), '을/를')} 지나고 직선 ${lineTx(g, mul(sc, u), flips(d, 3))}에 평행한 직선이 ${names[k1]}, ${lj(names[k2], '과/와')} 만나는 점을 각각 A, B라고 할 때, 선분 AB의 길이는?`, ans, {
        explain: `방향벡터 ${lj(tup(u), '으로/로')} 직선을 ${lineTx(P0, u)} = ${lj(V('t'), '으로/로')} 놓는다. ${lj(names[k1], '과/와')} 만날 때 ${nb(`${V('t')} = ${iq(t1)}`)}이므로 ${nb('A' + tup(Aa))}, ${lj(names[k2], '과/와')} 만날 때 ${nb(`${V('t')} = ${iq(t2)}`)}이므로 ${nb('B' + tup(Bb))}이다. ${nb(`AB = ${rt(n2(sub(Bb, Aa)))} = ${ans}`)}이다.`,
        facts: { calc: [[`${absS(`${js(-P0[k1])}/${js(u[k1])}-${js(-P0[k2])}/${js(u[k2])}`, t1 - t2)}*${nu}`, 0]] }
      });
    }, { standard: S4 }),
    H('hard-mirror', '거울에서 반사되는 빛 — 거울을 나타내는 평면의 방정식', '①30', (d) => {
      const pk = d.until(() => { const a = d.pick(VEC3), perm = d.shuffle([0, 1, 2]), s = [sgn(d), sgn(d), sgn(d)]; return { a, c: perm.map((i, j) => z0(s[j] * a[i])), k: d.pick([2, 3]) }; },
        ({ a, c }) => nz2(a) && !parallel3(a, c) && a[0] + c[0] !== 0 && Math.max(...a.map(Math.abs)) <= 3);
      const { a, c, k } = pk, Bb = smallP(d, -3, 3), A = add(Bb, a), C = add(Bb, mul(k, c)), s = add(a, c), g = gall(s), sg = s[0] < 0 ? -1 : 1, nn = s.map((v) => z0(sg * v / g)), dd = z0(-dot(nn, Bb));
      const ex = (i) => `((${js(A[i])}-${js(Bb[i])})+(${js(C[i])}-${js(Bb[i])})/${k})*${sg}/${g}`;
      return planeAns(`평면으로 이루어진 거울이 있다. 점 ${lj(ptN('A', A), '을/를')} 지나 거울에 입사된 빛이 거울 위의 점 ${ptN('B', Bb)}에서 반사되어 점 ${lj(ptN('C', C), '을/를')} 지날 때, 거울을 나타내는 평면의 방정식을 구하시오.`, nn, dd, {
        explain: `${vec('BA')} = ${tup(a)}, ${vec('BC')} = ${lj(tup(mul(k, c)), '이/가')}고 ${nb(`|${vec('BC')}| = ${k}|${vec('BA')}|`)}이다. ${lj(vec('BA'), '과/와')} 크기가 같은 ${nb(frac('1', String(k)) + vec('BC'))} = ${lj(tup(c), '을/를')} 잡으면 두 벡터의 합 ${lj(tup(s), '은/는')} 각 ABC를 이등분하고, 이 방향이 거울의 법선벡터이다. B를 지나므로 ${planeTx(nn, dd)}이다.`,
        facts: { calc: [[ex(1), 0], [ex(2), 1], [`0-(${[0, 1, 2].map((i) => `${ex(i)}*${js(Bb[i])}`).join('+')})`, 2]] }
      });
    }, { standard: S5 }),
    H('hard-reflect', '평면 위의 점에 대한 AP + BP 의 최솟값(대칭점)', '①31', (d) => {
      const pk = d.until(() => {
        const n = d.pick(VEC3), Mm = smallP(d, -3, 3), t = d.pick([1, 2]), [w, nu] = d.pick(INT3); return { n, Mm, t, w, nu };
      }, ({ n, Mm, t, w, nu }) => nz2(n) && n2(n) <= 11 && nu <= 9 && Math.max(...w.map(Math.abs)) <= 6 && (() => { const Bp = sub(Mm, mul(t, n)), A = add(Bp, w); return dot(n, sub(A, Mm)) > 0 && !(A.every((v, i) => v === add(Mm, mul(t, n))[i])); })());
      const { n, Mm, t, w, nu } = pk, Bb = add(Mm, mul(t, n)), Bp = sub(Mm, mul(t, n)), A = add(Bp, w), dd = z0(-dot(n, Mm));
      const comp = (i) => `(${js(Bb[i])}-2*(${dotS(n, Bb)}+${js(dd)})/(${n2S(n)})*${js(n[i])}-${js(A[i])})`;
      return N(`두 점 ${ptN('A', A)}, ${lj(ptN('B', Bb), '과/와')} 평면 ${alpha}: ${planeTx(n, dd)} 위의 점 P에 대하여 ${nb(SG('AP') + ' + ' + SG('BP'))}의 최솟값은?`, nu, {
        explain: `두 점을 평면의 식에 넣은 값이 ${iq(dot(n, A) + dd)}, ${lj(iq(dot(n, Bb) + dd), '으로/로')} 부호가 같으므로 A, B는 평면의 같은 쪽에 있다. B에서 평면에 내린 수선의 발은 ${tup(Mm)}이고, 이를 두 배로 늘린 대칭점은 ${nb("B′" + tup(Bp))}이다. 최솟값은 ${nb(`${SG("AB′")} = ${rt(n2(w))} = ${nu}`)}이다.`,
        facts: { digit: { template: `-1<□*□-(${[0, 1, 2].map((i) => `${comp(i)}*${comp(i)}`).join('+')})<1`, lo: 1, hi: 40, ask: 'min' } }
      });
    }, { standard: S5 }),
    H('hard-origin-plane', '원점을 지나는 평면이 직선과 이루는 각으로 점과 평면 사이의 거리', '②8', (d) => {
      const u = d.until(() => d.pick(VEC3), (v) => nz2(v) && sqf(n2(v))), k = d.pick([2, -2]), P = mul(k, u), g = smallP(d, -3, 3);
      return radAns(`평면 ${alpha}: ${lj(ms('ax + by + cz = 0'), '과/와')} 직선 ${L('l')}: ${lj(lineTx(g, u, flips(d, 3)), '이/가')} 이루는 각의 크기가 30°일 때, 점 ${lj(ptN('P', P), '과/와')} 평면 ${alpha} 사이의 거리는? (단, ${lj(ms('a, b, c'), '은/는')} 상수이다.)`, 1, n2(u), {
        explain: `직선 ${L('l')}의 방향벡터를 ${lj(vecIs('u', u), '이라/라')}고 하면 ${vec('OP')} = ${coefTx(k)}${vec('u')}이므로 점 P는 원점을 지나고 ${L('l')}에 평행한 직선 위에 있다. 이 직선도 평면 ${lj(alpha, '과/와')} 30°를 이루고 원점은 ${alpha} 위에 있으므로 거리는 ${nb(`OP × ${trig('sin', '30°')} = ${rootTx(n2(P))} × ${frac('1', '2')} = ${rt(n2(u))}`)}이다(${ms('a, b, c')}의 값을 따로 구하지 않아도 된다).`,
        facts: { calc: [[n2S(u), 0]] }
      });
    }, { standard: S5 }),
    H('hard-sphere-max', '교점으로 정한 구 위의 점과 평면 사이의 거리의 최댓값', '②26', (d) => {
      const pk = d.until(() => {
        const base = d.pick([[2, 4, 4], [4, 8, 8]]), perm = d.shuffle([0, 1, 2]), A = perm.map((i) => z0(base[i] * sgn(d))), [n, nu] = d.pick(INT3);
        return { A, n, nu };
      }, ({ A, n, nu }) => nz2(n) && nu <= 9 && Math.max(...n.map(Math.abs)) <= 7 && dot(n, A) !== 0 && dot(n, A) % (2 * nu) === 0);
      const { A, n, nu } = pk, u = prim(A), Kc = dot(n, A), r = Math.sqrt(n2(A)) / 2, dist = Math.abs(Kc) / (2 * nu), Cc = A.map((v) => v / 2);
      const dS = `${Math.abs(Kc)}/(2*${nu})`, r2S = `(${js(Kc)})*(${js(Kc)})*(${n2S(u)})/((${dotS(n, u)})*(${dotS(n, u)})*4)`;
      return N(`직선 ${L('l')}: ${lj(lineTx([0, 0, 0], u, flips(d, 3)), '과/와')} 평면 ${alpha}: ${planeTx(n, z0(-Kc))}의 교점을 A라고 하자. 원점 O에 대하여 ${lj(nb(`${vec('OA')} · ${vec('OP')} = |${vec('OP')}|${sup(2)}`), '을/를')} 만족시키는 점 P와 평면 ${alpha} 사이의 거리의 최댓값은?`, r + dist, {
        explain: `교점은 ${nb('A' + tup(A))}이다. ${nb(`${vec('OP')} · (${vec('OP')} − ${vec('OA')}) = 0`)}, 곧 ${nb(`${vec('OP')} · ${vec('AP')} = 0`)}이므로 점 P는 선분 OA를 지름으로 하는 구(중심 ${tup(Cc)}, 반지름의 길이 ${r}) 위에 있다. 중심과 평면 ${alpha} 사이의 거리는 ${dist}이므로 최댓값은 ${nb(`${r} + ${dist} = ${r + dist}`)}이다(구가 평면과 만나도 최댓값은 이렇게 구한다).`,
        facts: { digit: { template: `-1<(□-${dS})*(□-${dS})-${r2S}<1`, lo: 1, hi: 40, ask: 'max' } }
      });
    }, { standard: S5 }),
    H('hard-two-spheres', '두 구에 동시에 접하고 벡터에 수직인 평면', '②28', (d) => {
      const pk = d.until(() => {
        const [n, nu] = intN(d, (v) => v[2] !== 0 && Math.max(...v.map(Math.abs)) <= 4), r1 = d.int(1, 3), r2 = d.int(2, 5), s1 = sgn(d), s2 = sgn(d), C1 = smallP(d, -3, 3);
        const d0 = s1 * r1 * nu - dot(n, C1), C2 = smallP(d, -4, 4);
        return { n, nu, r1, r2, s2, C1, C2, d0 };
      }, ({ n, nu, r1, r2, s2, C1, C2, d0 }) => {
        if (dot(n, C2) + d0 !== s2 * r2 * nu || r1 === r2) return false;
        const D1 = [-dot(n, C1) + r1 * nu, -dot(n, C1) - r1 * nu], D2 = [-dot(n, C2) + r2 * nu, -dot(n, C2) - r2 * nu];
        return D1.filter((x) => D2.includes(x)).length === 1 && n2(sub(C1, C2)) > (r1 + r2) * (r1 + r2);
      });
      const { n, nu, r1, r2, C1, C2, d0 } = pk;
      const p = d.until(() => [d.int(-5, 5), d.int(-5, 5)], ([x, y]) => (n[0] * x + n[1] * y + d0) % n[2] === 0), a = z0(-(n[0] * p[0] + n[1] * p[1] + d0) / n[2]), va = V('a');
      return N(`두 구 ${sphereTx(C1, r1 * r1)}, ${sphereTx(C2, r2 * r2)}에 동시에 접하고 벡터 ${vecIs('n', n)}에 수직인 평면이 점 ${lj(nb(`(${iq(p[0])}, ${iq(p[1])}, ${va})`), '을/를')} 지날 때, 상수 ${va}의 값은?`, a, {
        signed: true,
        explain: `평면을 ${lj(nb(poly([[n[0], X], [n[1], Y], [n[2], Z]]) + ` + ${V('d')} = 0`), '으로/로')} 놓는다. 첫째 구의 중심 ${tup(C1)}에서의 거리가 ${r1}이므로 ${nb(`|${iq(dot(n, C1))} + ${V('d')}| = ${r1 * nu}`)}, 둘째 구의 중심 ${tup(C2)}에서의 거리가 ${r2}이므로 ${nb(`|${iq(dot(n, C2))} + ${V('d')}| = ${r2 * nu}`)}이다. 두 식을 함께 만족시키는 것은 ${nb(`${V('d')} = ${iq(d0)}`)}뿐이고, 점을 넣으면 ${nb(`${va} = ${iq(a)}`)}이다.`,
        facts: { calc: [[`0-(${js(n[0])}*${js(p[0])}+${js(n[1])}*${js(p[1])}+${js(d0)})/${js(n[2])}`, 0]] }
      });
    }, { standard: S5 }),
    H('hard-angle-dot', '구와 평면이 만나서 생기는 원 위의 두 점 — 각이 최대일 때의 내적', '②30', (d) => {
      const r = d.int(3, 6), dist = d.int(1, r - 1), [n, nu] = intN(d), A = smallP(d, -3, 3), dd = z0(sgn(d) * dist * nu - dot(n, A)), rho2 = r * r - dist * dist;
      return N(`점 ${ptN('A', A)}에 대하여 ${lj(nb(`|${vec('AP')}| = ${r}`), '을/를')} 만족시키는 점 P가 나타내는 도형과 평면 ${lj(planeTx(n, dd), '이/가')} 만나서 생기는 도형을 S라고 하자. 도형 S 위의 두 점 P, Q에 대하여 두 벡터 ${vec('AP')}, ${lj(vec('AQ'), '이/가')} 이루는 각의 크기가 최대일 때, ${nb(vec('PQ') + ' · ' + vec('PA'))}의 값은?`, 2 * rho2, {
        explain: `A와 평면 사이의 거리는 ${dist}이므로 S는 반지름의 길이의 제곱이 ${nb(`${r}${sup(2)} ${MINUS} ${dist}${sup(2)} = ${rho2}`)}인 원이다. 각 PAQ가 가장 클 때 P, Q는 S의 지름의 양 끝이고, ${lj(vec('PA'), '을/를')} ${vec('PQ')} 위에 내린 길이는 원의 반지름의 길이와 같다. 따라서 ${nb(vec('PQ') + ' · ' + vec('PA'))} = ${nb(`${rootTx(4 * rho2)} × ${rootTx(rho2)} = ${2 * rho2}`)}이다.`,
        facts: { calc: [[`2*(${r}*${r}-((${dotS(n, A)}+${js(dd)})*(${dotS(n, A)}+${js(dd)}))/(${n2S(n)}))`, 0]] }
      });
    }, { standard: S5 }),
    H('hard-chord-vec', 'AP⃗·BP⃗ = 0 인 구와 직선이 만나는 두 점 사이의 거리', '②21', (d) => {
      const pk = d.until(() => {
        const [u, nu] = intN(d, (v) => allNZ(v) && nu3(v)), w = d.pick(VEC3), t = d.int(1, 2), S = smallP(d, -3, 3); return { u, nu, w, t, S, R: n2(w) + t * t * n2(u) };
      }, ({ u, w, R }) => dot(u, w) === 0 && w.some((x) => x !== 0) && lat(R).some((v) => allNZ(v)));
      const { u, nu, w, t, S, R } = pk, v = d.pick(lat(R).filter(allNZ)), A = add(S, v), Bb = sub(S, v), F = add(S, w), P0 = add(F, mul(d.int(-1, 1), u)), e = sub(P0, S), ans = 2 * t * nu;
      const chord2 = `(4*(${dotS(u, e)})*(${dotS(u, e)})-4*(${n2S(u)})*((${n2S(e)})-(${n2S(sub(A, Bb))})/4))/(${n2S(u)})`;
      return N(`두 점 ${ptN('A', A)}, ${ptN('B', Bb)}에 대하여 ${lj(nb(`${vec('AP')} · ${vec('BP')} = 0`), '을/를')} 만족시키는 점 P가 나타내는 도형과 직선 ${lj(lineTx(P0, u, flips(d, 3)), '이/가')} 만나는 두 점을 C, D라고 할 때, 선분 CD의 길이는?`, ans, {
        explain: `점 P는 선분 AB를 지름으로 하는 구, 곧 중심이 ${tup(S)}이고 반지름의 길이의 제곱이 ${R}인 구 위에 있다. 직선 위의 점을 ${lj(nb(`(${[0, 1, 2].map((i) => poly([[u[i], V('t')], [F[i], '']])).join(', ')})`), '으로/로')} 놓아 구의 식에 넣으면 ${nb(`${V('t')} = ±${t}`)}이므로 ${nb(`CD = 2 × ${t} × ${rootTx(n2(u))} = ${ans}`)}이다.`,
        facts: { digit: { template: `-1<□*□-${chord2}<1`, lo: 1, hi: 60, ask: 'min' } }
      });
    }, { standard: S5 })
  ];
  function nu3(v) { return n2(v) === 9; }

  B.addGroup(UNIT, { id: 'hard', title: '실력 문제', standard: S5, types: hardTypes });
})(typeof window !== 'undefined' ? window : globalThis);
