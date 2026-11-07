// 고등학교 기하 Ⅱ-2 공간좌표 — 실력 문제. 단원 틀·싣는 기준·뺀 것과 까닭은 11-4-5a.js 머리에 적었다. 도구는 11-4-5a.js 가 내보낸 B.kit.u45x 를 쓴다.
// 이 단원에서 아이들이 흔히 잘못 아는 것
//  - 거리의 합의 최솟값에서 두 점이 좌표평면의 같은 쪽인지 보지 않고 대칭이동한다(다른 쪽이면 AB 가 바로 최솟값이다).
//    두 평면을 차례로 거치는 꺾인 선(①19)에서는 어느 점을 어느 평면에 대칭이동하는지와, 대칭점을 이은 선분이 두 평면을 그 차례로 지나는지를 놓친다.
//    (원문 교마12·104쪽 적용·확장은 선분이 차례를 거꾸로 지나 원문 답이 닿지 않는 값이었다 — hard-broken 은 차례가 맞는 수만 고른다.)
//  - 「세 좌표평면에 동시에 접한다」에서 중심의 부호를 지나는 점의 부호로 정하지 않거나, 「좌표축에 접한다」를 좌표평면에 접하는 것과 헷갈린다
//    (x축까지의 거리는 √(y² + z²)이다).
//  - 정사면체에 좌표를 잡을 때 꼭짓점에서 밑면에 내린 수선의 발이 밑면 정삼각형의 무게중심임을 쓰지 못한다.
//  - 이면각의 sin 값을 cos 로 적는다(hard-plane-claims 의 ㄴ).
// 실력의 잣대: ① 뜻을 정확히 대야 풀리는 함정, ② 세 단계 넘게 잇는 문제. 꼴 목록의 어려운 꼴(①19·①37·①38, ②10·②16·②22~②25)을 이 잣대로 가렸고 모두 실었다.
//  ①16(문자가 든 두 점 사이 거리의 최솟값)은 고1 10-2-1 이 기본에 둔 같은 일이고 세 단계 안에 끝나 기본(dist-min-param)에 두었다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, N, C } = B.kit;
  const { MINUS, Q, tx, nb, tail, V, sup, nz, pm, poly, rt, sqParts, radText, SG, gcd } = B.kit.mid;
  const { jh, qAns, space } = B.kit.hs;
  const K = B.kit.u45x;
  const { S4, S5, H, X, Y, Z, VA, VB, VC, VK, VR, AX, iq, jn, par, pt3, P3, P3j, axisH, PL, planeH, sq2, isSq, lenH, lenE, add3, sub3, mul3, d2, n2of, inBox, isInt3, round3, d2e, d2h, symOf, signE, radLen, lenAns, coordOf, rnd3, nz3, PYTH } = K;

  // 한 점을 지나고 세 좌표평면에 접하는 두 구: 점의 좌표의 절댓값 (p, q, s) 가운데 두 반지름이 서로 다른 자연수이고 차가 2 이상인 것
  const TWO = [];
  for (let p = 1; p <= 6; p += 1) for (let q = 1; q <= 6; q += 1) for (let s = 1; s <= 6; s += 1) {
    const S = p + q + s, T2 = p * p + q * q + s * s, disc = S * S - 2 * T2;
    if (disc <= 0 || !isSq(disc)) continue;
    const e = Math.sqrt(disc);
    if ((S + e) % 2 !== 0 || e < 2) continue;
    const r1 = (S - e) / 2, r2 = (S + e) / 2;
    if (r1 >= 1) TWO.push([p, q, s, r1, r2]);
  }
  // 구 x² + y² + (z − r)² = r² 위의 점 (0, 0, 2r)을 지나는 평면의 단면 넓이 kπ 와 xy평면 위의 원 x² + y² = R² 위의 두 점 P, Q: PQ 가 자연수인 것
  const SEC = [];
  for (let r = 2; r <= 5; r += 1) for (let k = 1; k < r * r; k += 1) for (let R = 2; R <= 14; R += 1) {
    const m2 = Q(4 * r * r * (r * r - k), k), pq2 = Q(4 * (R * R * m2.q - m2.p), m2.q);
    if (pq2.q !== 1 || pq2.p <= 0 || !isSq(pq2.p) || m2.p * 1 >= R * R * m2.q) continue;
    SEC.push([r, k, R, Math.sqrt(pq2.p), m2]);
  }

  const hard = [
    H('hard-broken', '두 좌표평면을 차례로 거치는 꺾인 선의 길이의 최솟값', '①19', (d) => {
      const [i, j] = d.shuffle([0, 1, 2]).slice(0, 2), k = 3 - i - j;
      const A = [0, 0, 0], Bq = [0, 0, 0];
      A[i] = d.int(1, 5); A[j] = d.int(1, 5); A[k] = d.int(-4, 4); Bq[i] = d.int(1, 5); Bq[j] = d.int(1, 5); Bq[k] = d.int(-4, 4);
      // 대칭점을 이은 선분 A′B′이 첫째 평면(i 좌표 0)을 둘째 평면(j 좌표 0)보다 먼저 지나야 최솟값이 닿는다: A_i·B_j < A_j·B_i
      if (A[i] * Bq[j] >= A[j] * Bq[i]) return null;
      const Ap = symOf(A, { kind: 'plane', i }), Bp = symOf(Bq, { kind: 'plane', i: j }), n2 = d2(Ap, Bp), [a, b] = sqParts(n2);
      if (a < 2 || b < 2) return null;
      const e = [0, 1, 2].map((x) => `(${signE(Bq, Bp, x)}-(${signE(A, Ap, x)}))*(${signE(Bq, Bp, x)}-(${signE(A, Ap, x)}))`).join('+');
      return lenAns(`두 점 ${P3('A', A)}, ${P3j('B', Bq, '과/와')} ${planeH(i)} 위의 점 P, ${planeH(j)} 위의 점 Q에 대하여 ${nb(`${SG('AP')} + ${SG('PQ')} + ${SG('QB')}`)}의 최솟값은?`, n2, e, {
        explain: `점 A를 ${planeH(i)}에 대하여 대칭이동한 점을 A′${pt3(Ap)}, 점 B를 ${planeH(j)}에 대하여 대칭이동한 점을 B′${pt3(Bp)}이라 하면 ${nb(`${SG('AP')} = ${SG("A′P")}`)}, ${nb(`${SG('QB')} = ${SG("QB′")}`)}이므로 ${nb(`${SG('AP')} + ${SG('PQ')} + ${SG('QB')} ≥ ${SG("A′B′")}`)}이다. 선분 A′B′은 ${planeH(i)}을 먼저, ${planeH(j)}을 나중에 지나므로 그 두 교점을 P, Q로 잡으면 등호가 성립한다. 최솟값은 ${SG("A′B′")} = ${d2h(Ap, Bp)} = ${radText(a, b)}이다.`
      });
    }, { standard: S4 }),
    H('hard-min-point', '거리의 합이 최소가 되는 좌표평면 위의 점', '①37', (d) => {
      const i = d.int(0, 2), sg = pm(d), A = nz3(d, -5, 5), Bq = nz3(d, -5, 5);
      A[i] = sg * d.int(1, 4); Bq[i] = sg * d.int(1, 4);
      const Ap = symOf(A, { kind: 'plane', i }), s = Math.abs(A[i]) + Math.abs(Bq[i]);
      const P0 = [0, 1, 2].map((x) => (x === i ? 0 : Ap[x] + Math.abs(A[i]) * (Bq[x] - Ap[x]) / s));
      if (!isInt3(P0) || (Bq.every((v, x) => v === A[x]))) return null;
      const p0 = round3(P0), ai = jn(Math.abs(A[i])), bi = jn(Math.abs(Bq[i]));
      return coordOf(`두 점 ${P3('A', A)}, ${P3j('B', Bq, '과/와')} ${planeH(i)} 위의 점 P에 대하여 ${nb(`${SG('AP')} + ${SG('BP')}`)}의 값이 최소가 되도록 하는 점 P의 좌표는?`, p0,
        [0, 1, 2].map((x) => (x === i ? '0' : `${jn(A[x])}+${ai}*(${jn(Bq[x])}-${jn(A[x])})/(${ai}+${bi})`)), {
          explain: `두 점 A, B의 ${AX[i]}좌표의 부호가 같으므로 두 점은 ${planeH(i)}의 같은 쪽에 있다. 점 A를 ${planeH(i)}에 대하여 대칭이동한 점 A′${pt3(Ap)}에 대하여 ${nb(`${SG('AP')} + ${SG('BP')} = ${SG("A′P")} + ${SG('BP')} ≥ ${SG("A′B")}`)}이므로, 점 P가 선분 A′B와 ${planeH(i)}의 교점일 때 최소이다. 그 점은 ${AX[i]}좌표가 0이 되는 점, 곧 선분 A′B를 ${K.ratioj(Math.abs(A[i]), Math.abs(Bq[i]), '으로/로')} 내분하는 점이므로 P${pt3(p0)}이다.`
        });
    }, { standard: S4 }),
    H('hard-tetra', '좌표공간에 놓인 정사면체의 높이를 내분하는 점', '①38', (d) => {
      const kk = d.int(1, 3), [m, n] = d.pick([[3, 1], [1, 3], [2, 1], [1, 2]]);
      // 값 num·√rad/den 의 글
      const surd = (num, den, rad) => { const g = gcd(Math.abs(num), den), a = num / g, b = den / g, body = (a === 1 ? '' : a) + (rad === 1 ? '' : rt(rad)); return b === 1 ? (body || '1') : frac(body || '1', b); };
      const xC = surd(kk, 3, 3), yC = String(kk), zOf = (w) => surd(2 * kk * w, 3 * (m + n), 6);
      const opt = (x, z) => nb(`(${x}, ${yC}, ${z})`);
      const rows = [[opt(xC, zOf(n)), true], [opt(xC, zOf(m)), false], [opt(surd(kk, 2, 3), zOf(n)), false], [opt(xC, surd(kk * n, m + n, 3)), false]];
      const u = 2.2, Av = [Math.sqrt(3) * u / 2, u / 2, 0], Bv = [0, u, 0], Hv = [Math.sqrt(3) * u / 6, u / 2, 0], Cv = [Hv[0], Hv[1], u * Math.sqrt(6) / 3], Pv = add3(mul3(Cv, m / (m + n)), mul3(Hv, n / (m + n)));
      const S = space({ u: 52 });
      S.axes({ x: 2.4, y: u + 1, z: Cv[2] + 0.8 }, null, { x: 0, y: u, z: 0 });
      S.solid({ O: [0, 0, 0], A: Av, B: Bv, C: Cv }, 'OA AB OB OC AC BC', 'OB', { names: false });
      S.name(Av, 'A', 250).name(Bv, 'B', 300).name(Cv, 'C', 90).seg(Cv, Hv, 'dash').dot(Hv, 'H', 215).dot(Pv, 'P', 0);
      const figure = S.svg(`공간 그림: 원점 O에 한 꼭짓점이 있는 정사면체 OABC. 꼭짓점 A는 xy평면 위에 있고 B(0, ${2 * kk}, 0)은 y축 위에 있다. 꼭짓점 C에서 밑면 OAB에 내린 수선의 발 H와 선분 CH 위의 점 P가 있다.`);
      return K.pick(d, `그림과 같이 좌표공간에 정사면체 OABC가 있다. 꼭짓점 A의 좌표는 (${VA}, ${VB}, 0), 꼭짓점 B의 좌표는 (0, ${2 * kk}, 0)이고 꼭짓점 C의 ${Z}좌표는 양수이다. 꼭짓점 C에서 밑면 OAB에 내린 수선의 발을 H라 할 때, 선분 CH를 ${K.ratioj(m, n, '으로/로')} 내분하는 점 P의 좌표는? ${nb(`(단, ${VA} &gt; 0, ${VB} &gt; 0)`)}`, rows, {
        figure,
        explain: `한 모서리의 길이가 ${2 * kk}이므로 A${pt3([surd(kk, 1, 3), kk, 0])}이다. 정사면체에서 꼭짓점 C에서 밑면에 내린 수선의 발 H는 정삼각형 OAB의 무게중심이므로 H${pt3([xC, kk, 0])}이고, ${nb(`${SG('CH')}${sup(2)} = ${SG('OC')}${sup(2)} ${MINUS} ${SG('OH')}${sup(2)}`)}에서 ${SG('CH')} = ${surd(2 * kk, 3, 6)}이므로 C${pt3([xC, kk, surd(2 * kk, 3, 6)])}이다. 점 P의 ${Z}좌표는 ${frac(`${m} × 0 + ${n} × ` + surd(2 * kk, 3, 6), `${m} + ${n}`)} = ${zOf(n)}이므로 P${pt3([xC, kk, zOf(n)])}이다.`
      });
    }, { standard: S4 }),
    H('hard-two-spheres', '한 점을 지나고 세 좌표평면에 접하는 두 구의 중심 사이의 거리', '②10', (d) => {
      const [p, q, s, r1, r2] = d.pick(TWO), sg = [pm(d), pm(d), pm(d)], P0 = [p * sg[0], q * sg[1], s * sg[2]];
      const a = r2 - r1;
      const c1 = sg.map((g) => g * r1), c2 = sg.map((g) => g * r2);
      const Se = `(${p}+${q}+${s})`, Te = `(${p}*${p}+${q}*${q}+${s}*${s})`;
      return radLen(`점 ${jh(pt3(P0), '을/를')} 지나고 세 좌표평면에 동시에 접하는 두 구의 중심 사이의 거리는?`, a, 3, {
        explain: `세 좌표평면에 접하는 구의 반지름의 길이를 ${VR}라 하면, 구가 점 ${K.pt3j(P0, '을/를')} 지나므로 중심은 그 점과 같은 쪽에 있어 ${pt3(sg.map((g) => (g > 0 ? VR : MINUS + VR)))}이다. ${nb(`(${p} ${MINUS} ${VR})${sup(2)} + (${q} ${MINUS} ${VR})${sup(2)} + (${s} ${MINUS} ${VR})${sup(2)} = ${VR}${sup(2)}`)}을 정리하면 ${nb(`${poly([[1, VR + sup(2)], [-(p + q + s), VR], [(p * p + q * q + s * s) / 2, '']])} = 0`)}이므로 ${VR} = ${r1} 또는 ${VR} = ${r2}이다. 두 중심 ${pt3(c1)}, ${pt3(c2)} 사이의 거리는 ${rt(`3 × ${a}${sup(2)}`)} = ${radText(a, 3)}이다.`,
        facts: { calc: [[`(${Se}*${Se}-2*${Te})**0.5`, 0], [`3`, 1]], derived: [2, 3, 0.5] }
      });
    }),
    H('hard-tangent-axes', '두 좌표축에 접하는 구 — 단면의 넓이와 현의 길이로 반지름', '②16', (d) => {
      const a = d.int(2, 8), h2 = d.pick([2, 3, 5, 6, 8, 9, 12, 18]), chord2 = 4 * h2, r2 = 2 * a * a + h2;
      return N(`중심이 A(${VA}, ${VB}, ${VC})인 구 S가 ${X}축과 ${Y}축에 각각 접하고 ${Z}축과 서로 다른 두 점에서 만난다. 구 S가 ${planeH(2)}과 만나서 생기는 원의 넓이가 ${a * a}π이고, 구 S가 ${Z}축과 만나는 두 점 사이의 거리가 ${lenH(chord2)}일 때, 구 S의 반지름의 길이를 ${jh(VR, '이라/라')} 하자. ${VR}${sup(2)}의 값은? ${nb(`(단, ${VA} &gt; 0, ${VB} &gt; 0, ${VC} &gt; 0)`)}`, r2, {
        explain: `${X}축에 접하므로 ${nb(`${VR}${sup(2)} = ${VB}${sup(2)} + ${VC}${sup(2)}`)}, ${Y}축에 접하므로 ${nb(`${VR}${sup(2)} = ${VA}${sup(2)} + ${VC}${sup(2)}`)}이고, ${planeH(2)}과의 단면은 중심이 (${VA}, ${VB}, 0)이고 반지름의 길이의 제곱이 ${nb(`${VR}${sup(2)} ${MINUS} ${VC}${sup(2)} = ${VA}${sup(2)} = ${VB}${sup(2)}`)}인 원이다. 넓이가 ${a * a}π이므로 ${nb(`${VA} = ${VB} = ${a}`)}이고, 중심에서 ${Z}축까지의 거리는 ${rt(`${a}${sup(2)} + ${a}${sup(2)}`)}이다. ${Z}축 위의 두 점 사이의 거리의 절반의 제곱은 ${h2}이므로 ${nb(`${VR}${sup(2)} = ${2 * a * a} + ${h2} = ${r2}`)}이다.`,
        facts: { calc: [[`2*${a * a}+${lenE(chord2)}/4`, 0]], derived: [2, 4] }
      });
    }),
    H('hard-circle-sphere', '좌표평면 위의 원 위의 점과 구 위의 점 사이의 거리의 최솟값', '②22', (d) => {
      const rho = d.int(1, 3), [s1, s2, t] = d.pick([[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [0, 5, 5], [5, 0, 5], [0, 7, 7], [5, 12, 13]]);
      const near = t - rho, w = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 16, 20, 24].filter((z) => isSq(near * near + z * z));
      if (!w.length || near < 1) return null;
      const wz = d.pick(w), L = Math.sqrt(near * near + wz * wz), R = d.int(1, Math.min(wz - 1, L - 1));
      if (R < 1) return null;
      const p = d.int(-3, 3), q = d.int(-3, 3), u = p + s1 * pm(d), v = q + s2 * pm(d), c = [u, v, wz * pm(d)];
      const term2 = (vv, a0) => (a0 === 0 ? vv + sup(2) : `(${poly([[1, vv], [-a0, '']])})${sup(2)}`);
      const circle = nb(`${term2(X, p)} + ${term2(Y, q)} = ${rho * rho}`), sphere = nb(`${term2(X, c[0])} + ${term2(Y, c[1])} + ${term2(Z, c[2])} = ${R * R}`);
      const tE = `((${jn(u)}-${jn(p)})*(${jn(u)}-${jn(p)})+(${jn(v)}-${jn(q)})*(${jn(v)}-${jn(q)}))**0.5`, rhoE = `${rho * rho}**0.5`;
      return N(`좌표공간에서 구 S: ${jh(sphere, '과/와')} ${planeH(2)} 위의 원 C: ${jh(circle, '이/가')} 있다. 원 C 위의 점 P와 구 S 위의 점 Q에 대하여 선분 PQ의 길이의 최솟값은?`, L - R, {
        explain: `구 S의 중심을 C′${pt3(c)}, 그 ${planeH(2)} 위로의 정사영을 H${pt3([u, v, 0])}이라 하자. 선분 PQ의 길이는 ${nb(`${SG("PC′")} ${MINUS} ${R}`)} 이상이고, ${nb(`${SG("PC′")}${sup(2)} = ${SG('PH')}${sup(2)} + ${wz * wz}`)}이므로 ${SG('PH')}가 가장 짧을 때 최소이다. 원 C의 중심에서 H까지의 거리는 ${t}이므로 ${SG('PH')}의 최솟값은 ${nb(`${t} ${MINUS} ${rho} = ${near}`)}이고, 이때 ${SG("PC′")} = ${rt(`${near}${sup(2)} + ${wz}${sup(2)}`)} = ${L}이다. 따라서 최솟값은 ${nb(`${L} ${MINUS} ${R} = ${L - R}`)}이다.`,
        facts: { calc: [[`((${tE}-${rhoE})*(${tE}-${rhoE})+${jn(c[2])}*${jn(c[2])})**0.5-${R * R}**0.5`, 0]], derived: [0.5] }
      });
    }),
    H('hard-sphere-locus', '구 위에서 원점까지의 거리가 일정한 점이 그리는 원의 둘레', '②23', (d) => {
      const [r, l, c] = d.pick([[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13], [12, 5, 13], [8, 15, 17], [15, 8, 17], [9, 12, 15], [12, 9, 15]]), i = d.int(0, 2);
      const q = Q(2 * r * l, c);
      if (q.q === 1) return null;
      const Cc = [0, 0, 0]; Cc[i] = c * pm(d);
      return qAns(`${axisH(i)} 위의 점 ${jh(P3('C', Cc), '을/를')} 중심으로 하고 반지름의 길이가 ${r}인 구 위를 움직이는 점 P가 있다. 원점 O에 대하여 선분 OP의 길이가 ${l}${tail(l, '이/가')} 되는 점 P가 나타내는 도형의 둘레의 길이가 ${VK}π일 때, 상수 ${VK}의 값은?`, q, {
        explain: `${nb(`${SG('OC')} = ${c}`)}, ${nb(`${SG('CP')} = ${r}`)}, ${nb(`${SG('OP')} = ${l}`)}에서 ${nb(`${r}${sup(2)} + ${l}${sup(2)} = ${c}${sup(2)}`)}이므로 ∠OPC = 90°이다. 점 P는 ${axisH(i)}에 수직인 한 평면 위의 원을 그리고, 그 반지름의 길이는 직각삼각형 OPC에서 빗변 OC에 내린 높이 ${frac(`${r} × ${l}`, c)}이다. 둘레의 길이는 ${nb(`2π × ${frac(r * l, c)}`)} = ${tx(q)}π이다.`,
        facts: { value: `2*${r}*${l}/${c}`, derived: [2] }
      });
    }),
    H('hard-plane-claims', 'x축을 품고 구에 접하는 평면 — 옳은 것 고르기', '②24', (d) => {
      const ax = d.pick([0, 1]), oth = 1 - ax, dd = d.int(3, 6), r = d.int(1, dd - 1), c = [0, 0, 0];
      c[ax] = d.int(-4, 4); c[oth] = dd * pm(d);
      const e2 = dd * dd - r * r, [ea, eb] = sqParts(e2);
      // cos θ = √(d² − r²)/d, sin θ = r/d
      const cosH = eb === 1 ? tx(Q(ea, dd)) : frac((ea === 1 ? '' : ea) + rt(eb), dd);
      const sinH = tx(Q(r, dd));
      const areaPi = (num, den, rad) => { const g = gcd(num, den), a = num / g, b = den / g, body = (a === 1 && rad !== 1 ? '' : a) + (rad === 1 ? '' : rt(rad)); return (b === 1 ? body : frac(body, b)) + 'π'; };
      const projTrue = areaPi(r * r * ea, dd, eb), projFalse = areaPi(r * r * r, dd, 1);
      const pat = d.pick([[true, false, true], [true, true, true], [false, true, true], [true, true, false], [true, false, false], [false, false, true], [false, true, false]]);
      const claim = [
        pat[0] ? `도형 C의 넓이는 ${r * r === 1 ? '' : r * r}π이다.` : `도형 C의 넓이는 ${2 * r}π이다.`,
        pat[1] ? nb(`cos θ = ${cosH}`) + '이다.' : nb(`cos θ = ${sinH}`) + '이다.',
        pat[2] ? `도형 C의 평면 α 위로의 정사영의 넓이는 ${projTrue}이다.` : `도형 C의 평면 α 위로의 정사영의 넓이는 ${projFalse}이다.`
      ];
      if (!pat[0] && 2 * r === r * r) return null;
      if (!pat[1] && sinH === cosH) return null;
      const NM = ['ㄱ', 'ㄴ', 'ㄷ'], ALL = [[0], [1], [2], [0, 1], [0, 2], [1, 2], [0, 1, 2]], right = [0, 1, 2].filter((x) => pat[x]);
      const others = d.shuffle(ALL.filter((s) => s.join() !== right.join())).slice(0, 4), opts = ALL.filter((s) => s.join() === right.join() || others.some((o) => o.join() === s.join()));
      const term2 = (vv, a0) => (a0 === 0 ? vv + sup(2) : `(${poly([[1, vv], [-a0, '']])})${sup(2)}`);
      const sph = nb(`${term2(X, c[0])} + ${term2(Y, c[1])} + ${Z}${sup(2)} = ${r * r}`);
      return C(`좌표공간에서 ${axisH(ax)}을 포함하는 평면 α가 구 S: ${sph}에 접하고 있다. 구 S와 ${planeH(2)}이 만나서 생기는 도형을 C라 하고, 평면 α와 ${planeH(2)}이 이루는 예각의 크기를 θ라 할 때, 보기에서 옳은 것만을 있는 대로 고른 것은?<br>ㄱ. ${claim[0]}<br>ㄴ. ${claim[1]}<br>ㄷ. ${claim[2]}`, opts.map((s) => s.map((x) => NM[x]).join(', ')), opts.findIndex((s) => s.join() === right.join()), {
        explain: `ㄱ. 구의 중심 ${pt3(c)}이 ${planeH(2)} 위에 있으므로 C는 반지름의 길이가 ${r}인 원이고 넓이는 ${r * r === 1 ? '' : r * r}π이다. ㄴ. 중심에서 ${axisH(ax)}에 내린 수선의 발을 H, 평면 α와 구의 접점을 T라 하면 ${nb(`${SG('CH')} = ${dd}`)}, ${nb(`${SG('CT')} = ${r}`)}이고, 삼수선 정리에 의하여 θ = ∠CHT이다. ${nb(`sin θ = ${sinH}`)}이므로 ${nb(`cos θ = ${cosH}`)}이다. ㄷ. 정사영의 넓이는 ${nb(`${r * r === 1 ? '' : r * r}π × cos θ`)} = ${projTrue}이다. 따라서 옳은 것은 ${right.map((x) => NM[x]).join(', ')}이다.`,
        facts: { truth: opts.map((s) => s.join() === right.join()), want: true }
      });
    }),
    H('hard-plane-section', '구 위의 한 점을 지나는 평면이 자른 원으로 선분의 길이 구하기', '②25', (d) => {
      const [r, k, R, pq, m2] = d.pick(SEC);
      const sph = nb(`${X}${sup(2)} + ${Y}${sup(2)} + (${Z} ${MINUS} ${r})${sup(2)} = ${r * r}`), circ = nb(`${X}${sup(2)} + ${Y}${sup(2)} = ${R * R}`);
      const dist2 = r * r - k;                                                   // 구의 중심에서 평면까지의 거리의 제곱
      return N(`좌표공간에 구 S: ${jh(sph, '과/와')} ${planeH(2)} 위의 원 C: ${jh(circ, '이/가')} 있다. 원 C 위의 두 점 P, Q를 포함하고 구 S 위의 점 ${P3j('R', [0, 0, 2 * r], '을/를')} 지나는 평면이 구 S와 만나서 생기는 도형의 넓이가 ${k}π일 때, 선분 PQ의 길이는?`, pq, {
        explain: `구 S의 중심 ${pt3([0, 0, r])}에서 평면까지의 거리를 ${VT_()}라 하면 단면의 반지름의 길이의 제곱이 ${k}이므로 ${nb(`${VT_()}${sup(2)} = ${r * r} ${MINUS} ${k} = ${dist2}`)}이다. 선분 PQ의 중점을 M이라 하면 삼수선 정리에 의하여 평면과 ${planeH(2)}이 이루는 각은 ∠RMO이고, 점 R, M, O를 지나는 단면에서 구의 중심에서 직선 RM까지의 거리가 ${rt(dist2)}이다. 직각삼각형 ROM에서 ${nb(`${SG('OR')} = ${2 * r}`)}이므로 이를 풀면 ${nb(`${SG('OM')}${sup(2)} = ${tx(m2)}`)}이고, ${nb(`${SG('PM')}${sup(2)} = ${R * R} ${MINUS} ${tx(m2)}`)}에서 ${nb(`${SG('PQ')} = 2${SG('PM')} = ${pq}`)}이다.`,
        facts: { value: `2*(${R * R}-4*${r}*${r}*(${r}*${r}-${k})/${k})**0.5`, derived: [2, 4, 0.5] }
      });
    })
  ];
  function VT_() { return V('t'); }

  B.addGroup('11-4-5', { id: 'hard', title: '실력 문제', standard: S5, types: hard });
})(typeof window !== 'undefined' ? window : globalThis);
