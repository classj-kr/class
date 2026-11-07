// 고등학교 기하 3단원 「도형의 방정식」(11-4-8) — 뒤쪽 묶음(평면의 방정식, 두 평면·직선과 평면이 이루는 각, 점과 평면 사이의 거리, 구의 방정식, 구와 직선·평면).
// 싣는 기준과 뺀 것은 11-4-8a.js 머리 주석에, 꼴마다의 판정은 references/textbooks/수학/_분석/11-4-8/싣기_대조표.md 에 있다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, N, M } = B.kit;
  const { MINUS, V, sup, nb, poly, rt, radAns } = B.kit.mid;
  const { vec, jh, coordAns, qAns, ms, trig, space, sub: subH } = B.kit.hs;
  const K = B.kit.u48x;
  const { UNIT, S5, gcd, range, z0, realRoots, onePos, dot, add, sub, mul, n2, gall, prim, isSq, sqf, allNZ, nz2, nz, sgn, distinct, pq, coefTx,
    VEC3, DEG, angKey, ANG3, INT3, pickAng, X, Y, Z, AX, iq, js, tup, ptN, vecIs, numer, rootTx, lj, termTx, lineTx, flips, varPlus,
    planeTx, planeR, sphereTx, tailTx, sphereGen, COS, absS, dotS, n2S, angS, planeAns, sphereAns, angAns, valsAns, twoVals, pickC, T, PLANES } = K;

  // ── 이 파일에서 쓰는 도구 ──
  const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);
  // 평면의 방정식에 점과 법선벡터를 넣은 식: a(x − x₁) + b(y − y₁) + c(z − z₁) = 0
  function pnTx(n, p) {
    const out = [];
    n.forEach((c, i) => {
      if (c === 0) return;
      const body = p[i] === 0 ? AX[i] : `(${numer(AX[i], p[i])})`, a = Math.abs(c), k = a === 1 ? '' : a;
      out.push(out.length ? ` ${c < 0 ? MINUS : '+'} ${k}${body}` : `${c < 0 ? MINUS : ''}${k}${body}`);
    });
    return nb(out.join('') + ' = 0');
  }
  // 평면의 방정식을 가끔 상수항을 오른쪽에 두고 적는다.
  const planeAny = (d, n, dd) => (d.int(0, 2) === 0 && dd !== 0 ? planeR(n, z0(-dd)) : planeTx(n, dd));
  const smallP = (d, lo, hi) => [d.int(lo, hi), d.int(lo, hi), d.int(lo, hi)];
  const nzP = (d, lo, hi) => [nz(d, lo, hi), nz(d, lo, hi), nz(d, lo, hi)];
  const xSign = (n) => (n[0] < 0 ? -1 : 1);
  const alpha = V('α'), beta = V('β');
  // 크기가 정수인 법선벡터(0인 성분은 하나까지)
  const intN = (d, ok) => d.until(() => d.pick(INT3), ([v, nu]) => nz2(v) && nu <= 11 && Math.max(...v.map(Math.abs)) <= 9 && (!ok || ok(v, nu)));
  // 반지름의 제곱이 R 인 구 위의 모눈 점(중심에서 본 벡터)
  const LAT = new Map();
  function lat(R) {
    if (!LAT.has(R)) { const out = []; for (const x of range(-6, 6)) for (const y of range(-6, 6)) for (const z of range(-6, 6)) if (x * x + y * y + z * z === R) out.push([x, y, z]); LAT.set(R, out); }
    return LAT.get(R);
  }
  const RICH = [9, 14, 17, 21, 26, 29, 30, 35, 38, 41, 45, 50];
  const par0 = (v, c) => (c === 0 ? v : `(${numer(v, c)})`);
  const posOf = (nm, p) => `점 ${ptN(nm, p)}의 위치벡터를 ${vec(nm.toLowerCase())}`;

  // ── 라. 평면의 방정식 ──
  const planeTypes = [
    T('pl-normal', '한 점과 법선벡터로 평면의 방정식', '①21', (d) => {
      const p = smallP(d, -5, 5), n = d.until(() => [d.pick([-4, -3, -2, -1, 1, 2, 3, 4]), d.int(-4, 4), d.int(-4, 4)], (v) => gall(v) === 1 && nz2(v));
      const sg = xSign(n), nn = mul(sg, n), dd = z0(-dot(nn, p));
      const text = d.bool() ? `점 ${lj(ptN('A', p), '을/를')} 지나고 법선벡터가 ${vecIs('n', n)}인 평면의 방정식을 구하시오.` : `점 ${lj(ptN('A', p), '을/를')} 지나고 벡터 ${vecIs('n', n)}에 수직인 평면의 방정식을 구하시오.`;
      return planeAns(text, nn, dd, {
        explain: `평면 위의 점 ${ms('P(x, y, z)')}에 대하여 ${vec('AP')} · ${vec('n')} = 0이므로 ${pnTx(n, p)}, 곧 ${planeTx(nn, dd)}이다.`,
        facts: { calc: [[`${js(n[1])}*${sg}`, 0], [`${js(n[2])}*${sg}`, 1], [`0-(${dotS(n, p)})*${sg}`, 2]] }
      });
    }),
    T('pl-perp-line', '한 점을 지나고 직선에 수직인 평면의 방정식', '①22', (d) => {
      const p = smallP(d, -5, 5), u = d.until(() => d.pick(VEC3), (v) => v[0] !== 0 && nz2(v)), g = smallP(d, -4, 4), sg = xSign(u), nn = mul(sg, u), dd = z0(-dot(nn, p));
      return planeAns(`점 ${lj(ptN('A', p), '을/를')} 지나고 직선 ${lineTx(g, u, flips(d, 3))}에 수직인 평면의 방정식을 구하시오.`, nn, dd, {
        explain: `직선의 방향벡터 ${lj(vecIs('u', u), '이/가')} 구하는 평면의 법선벡터이다. ${pnTx(u, p)}, 곧 ${planeTx(nn, dd)}이다.`,
        facts: { calc: [[`${js(u[1])}*${sg}`, 0], [`${js(u[2])}*${sg}`, 1], [`0-(${dotS(u, p)})*${sg}`, 2]] }
      });
    }),
    T('pl-axis', '한 점을 지나고 좌표축에 수직인 평면 고르기', '①23', (d) => {
      const p = d.until(() => nzP(d, -6, 6), (q) => new Set(q.map(Math.abs)).size === 3), ax = d.int(0, 2), o = [0, 1, 2].filter((i) => i !== ax);
      const eq = (i) => nb(`${AX[i]} = ${iq(p[i])}`), right = eq(ax), wrongs = [eq(o[0]), eq(o[1]), `${eq(o[0])}, ${eq(o[1])}`];
      return pickC(d, `점 ${lj(ptN('A', p), '을/를')} 지나고 ${'xyz'[ax]}축에 수직인 평면의 방정식으로 옳은 것은?`, right, wrongs, {
        explain: `${'xyz'[ax]}축에 수직인 평면의 법선벡터는 ${tup([0, 1, 2].map((i) => (i === ax ? 1 : 0)))}이므로 평면 위의 점은 ${'xyz'[ax]}좌표가 늘 ${iq(p[ax])}이다. 따라서 ${right}이다. ${eq(o[0])}, ${lj(eq(o[1]), '은/는')} ${'xyz'[ax]}축에 평행한 직선이다.`
      });
    }),
    T('pl-parallel', '한 점을 지나고 평면에 평행한 평면의 방정식', '①24', (d) => {
      const p = smallP(d, -5, 5), n = d.until(() => [d.pick([-3, -2, -1, 1, 2, 3, 4, 5]), d.int(-5, 5), d.int(-4, 4)], (v) => gall(v) === 1 && nz2(v));
      const sg = xSign(n), nn = mul(sg, n), dd = z0(-dot(nn, p)), d0 = d.until(() => nz(d, -9, 9), (x) => z0(sg * x) !== dd);
      return planeAns(`점 ${lj(ptN('A', p), '을/를')} 지나고 평면 ${planeAny(d, n, d0)}에 평행한 평면의 방정식을 구하시오.`, nn, dd, {
        explain: `평행한 두 평면은 법선벡터가 같으므로 ${lj(vecIs('n', n), '을/를')} 쓴다. ${pnTx(n, p)}, 곧 ${planeTx(nn, dd)}이다.`,
        facts: { calc: [[`${js(n[1])}*${sg}`, 0], [`${js(n[2])}*${sg}`, 1], [`0-(${dotS(n, p)})*${sg}`, 2]] }
      });
    }),
    T('pl-intercept', '세 좌표축 위의 점을 지나는 평면의 방정식', '①25', (d) => {
      const [a, b, c] = d.until(() => nzP(d, -6, 6), (q) => q.every((v) => Math.abs(v) >= 1) && new Set(q).size === 3);
      const raw = [b * c, a * c, a * b], k = a * b * c, g = gall(raw.concat([k])), sg = raw[0] < 0 ? -1 : 1, nn = raw.map((v) => z0(sg * v / g)), dd = z0(-sg * k / g);
      return planeAns(`세 점 ${ptN('A', [a, 0, 0])}, ${ptN('B', [0, b, 0])}, ${lj(ptN('C', [0, 0, c]), '을/를')} 지나는 평면의 방정식을 구하시오.`, nn, dd, {
        explain: `세 점 ${ms('(a, 0, 0)')}, ${ms('(0, b, 0)')}, ${lj(ms('(0, 0, c)'), '을/를')} 지나는 평면은 ${frac(X, ms('a'))} + ${frac(Y, ms('b'))} + ${frac(Z, ms('c'))} = 1이다. ${frac(X, iq(a))} + ${frac(Y, iq(b))} + ${frac(Z, iq(c))} = 1의 양변에 ${lj(iq(sg * k / g), '을/를')} 곱하면 ${planeTx(nn, dd)}이다.`,
        facts: { calc: [[`${js(a)}*${js(c)}*${sg}/${g}`, 0], [`${js(a)}*${js(b)}*${sg}/${g}`, 1], [`0-${js(a)}*${js(b)}*${js(c)}*${sg}/${g}`, 2]] }
      });
    }),
    T('pl-meet-line', '직선과 평면의 교점', '①26', (d) => {
      const Q = smallP(d, -5, 5), u = d.until(() => d.pick(VEC3), nz2), n = d.until(() => [d.int(-3, 3), d.int(-3, 3), d.int(-3, 3)], (v) => gall(v) === 1 && nz2(v) && dot(v, u) !== 0);
      const P = add(Q, mul(nz(d, -2, 2), u)), dd = z0(-dot(n, Q)), tS = `(0-(${dotS(n, P)}+${js(dd)})/(${dotS(n, u)}))`;
      return coordAns(`직선 ${lj(lineTx(P, u, flips(d, 3)), '과/와')} 평면 ${planeAny(d, n, dd)}의 교점의 좌표를 구하시오.`, Q, {
        explain: `${lineTx(P, u)} = ${lj(V('t'), '으로/로')} 놓으면 ${nb(`(${[0, 1, 2].map((i) => poly([[u[i], V('t')], [P[i], '']])).join(', ')})`)}이다. 이를 평면의 식에 넣어 ${lj(V('t'), '을/를')} 구하면 교점은 ${tup(Q)}이다.`,
        facts: { calc: [0, 1, 2].map((i) => [`${js(P[i])}+${js(u[i])}*${tS}`, i]) }
      });
    }),
    T('pl-meet-perp', '직선과 평면의 교점을 지나고 직선에 수직인 평면', '①27', (d) => {
      const pk = d.until(() => {
        const Q = smallP(d, -4, 4), u = d.pick(VEC3), n = [d.int(-3, 3), d.int(-3, 3), d.int(-3, 3)], r = [d.int(-4, 4), d.int(-4, 4)];
        return { Q, u, n, r };
      }, ({ Q, u, n, r }) => nz2(u) && u[2] !== 0 && gall(n) === 1 && nz2(n) && dot(n, u) !== 0 && (u[0] * (r[0] - Q[0]) + u[1] * (r[1] - Q[1])) % u[2] === 0 && !parallel3(n, u));
      const { Q, u, n, r } = pk, P = add(Q, mul(nz(d, -2, 2), u)), dd = z0(-dot(n, Q)), k = z0(Q[2] - (u[0] * (r[0] - Q[0]) + u[1] * (r[1] - Q[1])) / u[2]);
      const tS = `(0-(${dotS(n, P)}+${js(dd)})/(${dotS(n, u)}))`, qS = (i) => `(${js(P[i])}+${js(u[i])}*${tS})`;
      return N(`직선 ${V('l')}: ${lj(lineTx(P, u, flips(d, 3)), '과/와')} 평면 ${planeAny(d, n, dd)}의 교점을 지나고 직선 ${V('l')}에 수직인 평면 ${lj(alpha, '이/가')} 점 ${lj(nb(`(${iq(r[0])}, ${iq(r[1])}, ${V('k')})`), '을/를')} 지날 때, 상수 ${V('k')}의 값은?`, k, {
        signed: true,
        explain: `직선 ${lj(V('l'), '과/와')} 평면의 교점은 ${tup(Q)}이다. 평면 ${alpha}의 법선벡터는 ${V('l')}의 방향벡터 ${tup(u)}이므로 ${alpha}: ${pnTx(u, Q)}이다. ${lj(nb(`(${iq(r[0])}, ${iq(r[1])}, ${V('k')})`), '을/를')} 넣으면 ${nb(`${V('k')} = ${iq(k)}`)}이다.`,
        facts: { calc: [[`${qS(2)}-(${js(u[0])}*(${js(r[0])}-${qS(0)})+${js(u[1])}*(${js(r[1])}-${qS(1)}))/${js(u[2])}`, 0]] }
      });
    }),
    T('pl-foot', '점에서 평면에 내린 수선의 발', '①28', (d) => {
      const Hh = smallP(d, -4, 4), n = d.until(() => [d.int(-3, 3), d.int(-3, 3), d.int(-3, 3)], (v) => gall(v) === 1 && nz2(v)), A = add(Hh, mul(nz(d, -2, 2), n)), dd = z0(-dot(n, Hh));
      const tS = `((${dotS(n, A)}+${js(dd)})/(${n2S(n)}))`;
      return coordAns(`점 ${ptN('A', A)}에서 평면 ${planeAny(d, n, dd)}에 내린 수선의 발의 좌표를 구하시오.`, Hh, {
        explain: `수선의 발 H는 A를 지나고 법선벡터 ${lj(tup(n), '을/를')} 방향벡터로 하는 직선 위에 있으므로 ${lj(nb(`H(${[0, 1, 2].map((i) => poly([[n[i], V('t')], [A[i], '']])).join(', ')})`), '으로/로')} 놓는다. 평면의 식에 넣어 ${lj(V('t'), '을/를')} 구하면 ${nb('H' + tup(Hh))}이다.`,
        facts: { calc: [0, 1, 2].map((i) => [`${js(A[i])}-${js(n[i])}*${tS}`, i]) }
      });
    }),
    T('pl-foot-dot', '원점에서 두 평면에 내린 수선의 발과 내적', '①28', (d) => {
      const [n1, n2v] = d.until(() => [d.pick(VEC3), d.pick(VEC3)], ([a, b]) => nz2(a) && nz2(b) && dot(a, b) !== 0 && !parallel3(a, b));
      const t1 = nz(d, -2, 2), t2 = nz(d, -2, 2), k1 = t1 * n2(n1), k2 = t2 * n2(n2v), H1 = mul(t1, n1), H2 = mul(t2, n2v), ans = dot(H1, H2);
      const h1 = ms('H_1'), h2 = ms('H_2'), tH = (n) => nb(`(${[0, 1, 2].map((i) => poly([[n[i], V('t')]])).join(', ')})`);
      return N(`원점 O에서 두 평면 ${alpha}: ${planeTx(n1, z0(-k1))}, ${beta}: ${planeTx(n2v, z0(-k2))}에 내린 수선의 발을 각각 ${h1}, ${h2}라고 할 때, ${nb(oh(1) + ' · ' + oh(2))}의 값은?`, ans, {
        signed: true,
        explain: `${lj(h1, '은/는')} 원점을 지나고 방향벡터가 ${tup(n1)}인 직선 위에 있으므로 ${lj(tH(n1), '으로/로')} 놓아 평면 ${alpha}의 식에 넣으면 ${nb(h1 + tup(H1))}이다. 같은 방법으로 ${nb(h2 + tup(H2))}이므로 ${nb(oh(1) + ' · ' + oh(2))} = ${dotTx(H1, H2)} = ${iq(ans)}이다.`,
        facts: { calc: [[`${js(k1)}*${js(k2)}*(${dotS(n1, n2v)})/((${n2S(n1)})*(${n2S(n2v)}))`, 0]] }
      });
    }),
    T('pl-foot-back', '수선의 발이 주어질 때 평면의 계수', '①29', (d) => {
      const pk = d.until(() => ({ Hh: smallP(d, -4, 4), w: d.pick(VEC3), lam: d.pick([1, 2, -1]), mu: d.pick([1, 2, -1, -2, 3]), f: d.int(0, 1) }), ({ w, mu, f }) => allNZ(w) && Math.abs(mu * w[f]) >= 2);
      const { Hh, w, lam, mu, f } = pk, A = sub(Hh, mul(lam, w)), n = mul(mu, w), cc = z0(-dot(n, Hh)), va = V('a'), vb = V('b'), vc = V('c');
      const fixedTx = (c, v) => `${c < 0 ? MINUS : ''}${Math.abs(c) === 1 ? '' : Math.abs(c)}${v}`;
      const planeShown = f === 0 ? `${fixedTx(n[0], X)} + ${va}${Y} + ${vb}${Z} + ${vc} = 0` : `${va}${X} ${n[1] < 0 ? MINUS : '+'} ${fixedTx(Math.abs(n[1]), Y)} + ${vb}${Z} + ${vc} = 0`;
      const others = f === 0 ? [1, 2] : [0, 2], ratio = `${js(n[f])}/(${js(Hh[f])}-${js(A[f])})`;
      return valsAns(`점 ${ptN('A', A)}에서 평면 ${nb(planeShown)}에 내린 수선의 발이 ${ptN('H', Hh)}일 때, 상수 ${va}, ${vb}, ${vc}의 값은?`, [['a', n[others[0]]], ['b', n[others[1]]], ['c', cc]], {
        explain: `${vec('AH')} = ${lj(tup(sub(Hh, A)), '은/는')} 평면의 법선벡터와 평행하다. ${'xyz'[f]}의 계수가 ${lj(iq(n[f]), '이/가')}므로 법선벡터는 ${tup(n)}이고, H가 평면 위에 있으므로 ${nb(`${vc} = ${iq(cc)}`)}이다.`,
        facts: { calc: [[`${ratio}*(${js(Hh[others[0]])}-${js(A[others[0]])})`, 0], [`${ratio}*(${js(Hh[others[1]])}-${js(A[others[1]])})`, 1], [`0-(${[0, 1, 2].map((i) => `${ratio}*(${js(Hh[i])}-${js(A[i])})*${js(Hh[i])}`).join('+')})`, 2]] }
      });
    })
  ];
  function parallel3(a, b) { return a[1] * b[2] - a[2] * b[1] === 0 && a[2] * b[0] - a[0] * b[2] === 0 && a[0] * b[1] - a[1] * b[0] === 0; }
  const oh = (k) => vec('OH' + subH(String(k)));
  const dotTx = (a, b) => a.map((v, i) => `${pq(v)} × ${pq(b[i])}`).join(' + ');

  // ── 마. 두 평면·직선과 평면이 이루는 각 ──
  const pangleTypes = [
    T('pa-two', '두 평면이 이루는 각의 크기', '②1', (d) => {
      const [n1, n2v] = pickAng(d, ANG3, [1, 2, 2, 3], ([a, b]) => nz2(a) && nz2(b)), deg = DEG[angKey(n1, n2v)];
      return angAns(`두 평면 ${alpha}: ${planeAny(d, n1, d.int(-6, 6))}, ${beta}: ${lj(planeAny(d, n2v, d.int(-6, 6)), '이/가')} 이루는 각의 크기는?`, deg, angS(n1, n2v), {
        explain: `법선벡터 ${nb(nsub(1) + ' = ' + tup(n1))}, ${nb(nsub(2) + ' = ' + tup(n2v))}에서 ${trig('cos', 'θ')} = ${frac('|' + nsub(1) + ' · ' + nsub(2) + '|', '|' + nsub(1) + '||' + nsub(2) + '|')} = ${frac(String(Math.abs(dot(n1, n2v))), rootTx(n2(n1) * n2(n2v)))} = ${COS[deg]}이므로 두 평면이 이루는 각의 크기는 ${deg}°이다.`
      });
    }),
    T('pa-coord', '평면과 좌표평면이 이루는 각의 cos 값', '②2', (d) => {
      const pl = d.pick(PLANES), [n, nu] = intN(d, (v) => v[pl.k] !== 0), dd = d.int(-8, 8), a = Math.abs(n[pl.k]);
      return qAns(`평면 ${lj(planeAny(d, n, dd), '이/가')} ${lj(pl.nm, '과/와')} 이루는 각의 크기를 ${V('θ')}라고 할 때, ${trig('cos', 'θ')}의 값은?`, [a, nu], {
        explain: `${pl.nm}의 법선벡터는 ${tup([0, 1, 2].map((i) => (i === pl.k ? 1 : 0)))}이다. 평면의 법선벡터 ${lj(tup(n), '과/와')} 이루는 각을 생각하면 ${trig('cos', 'θ')} = ${frac(String(a), rootTx(nu * nu))}이다.`,
        facts: { value: `${a}/${nu}` }
      });
    }),
    T('pa-intercept', '세 좌표축 위의 점을 지나는 평면과 좌표평면이 이루는 각의 cos 값', '②2', (d) => {
      const pl = d.pick(PLANES);
      const [n, nu] = intN(d, (v) => allNZ(v) && (() => { const L = v.reduce((s, x) => lcm(s, x), 1); return v.every((x) => Math.abs(L / x) <= 12); })());
      const L = n.reduce((s, x) => lcm(s, x), 1), [a, b, c] = n.map((x) => L / x), cc = Math.abs(n[pl.k]);
      return qAns(`세 점 ${ptN('A', [a, 0, 0])}, ${ptN('B', [0, b, 0])}, ${lj(ptN('C', [0, 0, c]), '을/를')} 지나는 평면이 ${lj(pl.nm, '과/와')} 이루는 각의 크기를 ${V('θ')}라고 할 때, ${trig('cos', 'θ')}의 값은?`, [cc, nu], {
        explain: `세 점을 지나는 평면은 ${frac(X, iq(a))} + ${frac(Y, iq(b))} + ${frac(Z, iq(c))} = 1, 곧 ${planeR(n, L)}이다. 법선벡터 ${lj(tup(n), '과/와')} ${pl.nm}의 법선벡터 ${lj(tup([0, 1, 2].map((i) => (i === pl.k ? 1 : 0))), '으로/로')} ${trig('cos', 'θ')} = ${frac(String(cc), rootTx(nu * nu))}이다.`,
        facts: { value: `${cc}/${nu}` }
      });
    }),
    T('pa-perpline', '직선에 수직인 평면과 다른 평면이 이루는 각의 cos 값', '②3', (d) => {
      const pk = d.until(() => { const u = [d.int(1, 3), d.int(1, 4), d.int(1, 4)], perm = d.shuffle([0, 1, 2]), sg = [sgn(d), sgn(d), sgn(d)]; return { u, w: perm.map((i, j) => sg[j] * u[i]) }; },
        ({ u, w }) => gall(u) === 1 && new Set(u).size >= 2 && !parallel3(u, w) && dot(u, w) !== 0);
      const { u, w } = pk, L = u.reduce((s, x) => lcm(s, x), 1), p = smallP(d, -4, 4), dd = d.int(-6, 6), D = Math.abs(dot(u, w)), U = n2(u);
      const part = (i) => { const c = L / u[i], body = p[i] === 0 ? AX[i] : c === 1 ? numer(AX[i], p[i]) : `(${numer(AX[i], p[i])})`; return nb((c === 1 ? '' : c) + body); };
      return qAns(`직선 ${[0, 1, 2].map(part).join(' = ')}에 수직인 평면과 평면 ${lj(planeAny(d, w, dd), '이/가')} 이루는 예각의 크기를 ${V('θ')}라고 할 때, ${trig('cos', 'θ')}의 값은?`, [D, U], {
        explain: `주어진 직선의 식을 ${lj(L, '으로/로')} 나누면 ${lineTx(p, u)}이므로 방향벡터 ${lj(tup(u), '이/가')} 직선에 수직인 평면의 법선벡터이다. 다른 평면의 법선벡터 ${lj(tup(w), '과/와')} ${trig('cos', 'θ')} = ${frac(String(D), rootTx(U * n2(w)))}이다.`,
        facts: { value: `(${absS(dotS(u, w), dot(u, w))})/(${n2S(u)})` }
      });
    }),
    T('pa-par1', '두 평면이 평행할 때 미지수(하나)', '②4', (d) => {
      const pk = d.until(() => ({ q: [nz(d, -3, 3), nz(d, -3, 3), nz(d, -3, 3)], k: d.pick([-3, -2, 2, 3]) }), ({ q, k }) => gall(q) === 1 && -k * q[1] - q[0] !== 0);
      const { q, k } = pk, a = -k * q[1], s = -k * q[1] - q[0], va = V('a');
      const [d1, d2] = d.until(() => [d.int(-8, 8), d.int(-8, 8)], ([x, y]) => x !== k * y);
      const al = poly([[k * q[0], X]]) + ` ${MINUS} ${va}${Y}` + tailTx([[k * q[2], Z], [d1, '']]) + ' = 0', be = `(${varPlus('a', -s)})${X}` + tailTx([[q[1], Y], [q[2], Z], [d2, '']]) + ' = 0';
      return N(`두 평면 ${alpha}: ${nb(al)}, ${beta}: ${lj(nb(be), '이/가')} 서로 평행할 때, 상수 ${va}의 값은?`, a, {
        signed: true,
        explain: `법선벡터 ${nb(`(${iq(k * q[0])}, ${MINUS}${va}, ${iq(k * q[2])})`)}, ${lj(nb(`(${varPlus('a', -s)}, ${iq(q[1])}, ${iq(q[2])})`), '이/가')} 평행하다. z성분에서 ${iq(k)}배이므로 ${nb(`${MINUS}${va} = ${iq(k)} × ${pq(q[1])}`)}, 곧 ${nb(`${va} = ${iq(a)}`)}이고 x성분도 맞는다.`,
        facts: { calc: [[`0-${js(k * q[2])}*${js(q[1])}/${js(q[2])}`, 0]] }
      });
    }),
    T('pa-par2', '두 평면이 평행할 때 미지수(둘)', '②4', (d) => {
      const pk = d.until(() => ({ q0: nz(d, -3, 3), q1: nz(d, -3, 3), b: nz(d, -4, 4), lam: d.pick([-3, -2, 2, 3]) }), ({ q0, q1, b }) => gall([q0, q1, b]) === 1);
      const { q0, q1, b, lam } = pk, va = V('a'), vb = V('b'), [d1, d2] = d.until(() => [d.int(-8, 8), d.int(-8, 8)], ([x, y]) => x !== lam * y);
      const al = poly([[lam * q0, X]]) + ` + ${va}${Y}` + tailTx([[lam * b, Z], [d1, '']]) + ' = 0', be = poly([[q0, X], [q1, Y]]) + ` + ${vb}${Z}` + tailTx([[d2, '']]) + ' = 0';
      return valsAns(`두 평면 ${alpha}: ${nb(al)}, ${beta}: ${lj(nb(be), '이/가')} 서로 평행할 때, 상수 ${va}, ${vb}의 값은?`, [['a', lam * q1], ['b', b]], {
        explain: `법선벡터 ${lj(nb(`(${iq(lam * q0)}, ${va}, ${iq(lam * b)})`), '이/가')} ${nb(`(${iq(q0)}, ${iq(q1)}, ${vb})`)}의 ${iq(lam)}배이다(x성분). 그러므로 ${nb(`${va} = ${iq(lam)} × ${pq(q1)} = ${iq(lam * q1)}`)}, ${nb(`${iq(lam * b)} = ${iq(lam)}${vb}`)}에서 ${nb(`${vb} = ${iq(b)}`)}이다.`,
        facts: { calc: [[`${js(lam * q0)}*${js(q1)}/${js(q0)}`, 0], [`${js(lam * b)}*${js(q0)}/${js(lam * q0)}`, 1]] }
      });
    }),
    T('pa-perp', '두 평면이 수직일 때 미지수', '②5', (d) => {
      const pk = d.until(() => ({ p0: nz(d, -3, 3), p1: nz(d, -3, 3), s: nz(d, -4, 4), q0: nz(d, -3, 3), t: nz(d, -4, 4), q2: nz(d, -3, 3) }), (o) => {
        const den = o.p1 + o.q2, num = -(o.p0 * o.q0 + o.p1 * o.t + o.s * o.q2); return den !== 0 && num % den === 0 && num / den !== 0 && Math.abs(num / den) <= 9 && num / den + o.s !== 0 && num / den + o.t !== 0;
      });
      const a = z0(-(pk.p0 * pk.q0 + pk.p1 * pk.t + pk.s * pk.q2) / (pk.p1 + pk.q2)), va = V('a'), d1 = d.int(-6, 6), d2 = d.int(-6, 6);
      const al = poly([[pk.p0, X], [pk.p1, Y]]) + ` + (${varPlus('a', pk.s)})${Z}` + tailTx([[d1, '']]) + ' = 0', be = poly([[pk.q0, X]]) + ` + (${varPlus('a', pk.t)})${Y}` + tailTx([[pk.q2, Z], [d2, '']]) + ' = 0';
      return N(`두 평면 ${alpha}: ${nb(al)}, ${beta}: ${lj(nb(be), '이/가')} 서로 수직일 때, 상수 ${va}의 값은?`, a, {
        signed: true,
        explain: `두 법선벡터의 내적이 0이므로 ${nb(`${pq(pk.p0)} × ${pq(pk.q0)}`)} + ${nb(`${pq(pk.p1)}(${varPlus('a', pk.t)})`)} + ${nb(`(${varPlus('a', pk.s)}) × ${pq(pk.q2)} = 0`)}에서 ${nb(`${va} = ${iq(a)}`)}이다.`,
        facts: { calc: [[`0-(${js(pk.p0)}*${js(pk.q0)}+${js(pk.p1)}*${js(pk.t)}+${js(pk.s)}*${js(pk.q2)})/(${js(pk.p1)}+${js(pk.q2)})`, 0]] }
      });
    }),
    T('pa-line', '직선과 평면이 이루는 각의 크기', '②6', (d) => {
      const [u, n] = pickAng(d, ANG3, [1, 2, 3], ([a, b]) => nz2(a) && nz2(b)), deg = 90 - DEG[angKey(u, n)], g = smallP(d, -4, 4);
      return angAns(`직선 ${lj(lineTx(g, u, flips(d, 3)), '과/와')} 평면 ${lj(planeAny(d, n, d.int(-6, 6)), '이/가')} 이루는 각의 크기는?`, deg, `90-(${angS(u, n)})`, {
        explain: `직선의 방향벡터 ${lj(vecIs('u', u), '과/와')} 평면의 법선벡터 ${lj(vecIs('n', n), '이/가')} 이루는 각은 구하는 각 ${V('θ')}의 여각이다. ${trig('cos', '(90° - θ)')} = ${frac(String(Math.abs(dot(u, n))), rootTx(n2(u) * n2(n)))} = ${COS[90 - deg]}이므로 ${nb(`90° ${MINUS} ${V('θ')} = ${90 - deg}°`)}, 곧 ${nb(`${V('θ')} = ${deg}°`)}이다.`
      });
    }),
    T('pa-line-find', '직선과 평면이 이루는 각이 주어질 때 미지수', '②7', (d) => {
      const pk = d.until(() => {
        const u = d.pick(VEC3), p = nz(d, -3, 3), q = nz(d, -3, 3), deg = d.pick([30, 30, 60]), m = deg === 30 ? 1 : 3;
        const c0 = u[0] * p + u[1] * q, roots = realRoots(4 * u[2] * u[2] - m * n2(u), 8 * u[2] * c0, 4 * c0 * c0 - m * n2(u) * (p * p + q * q)).filter((a) => Math.abs(c0 + u[2] * a) > 1e-9);
        return { u, p, q, deg, m, roots };
      }, (o) => nz2(o.u) && o.u[2] !== 0 && onePos(o.roots) !== null);
      const { u, p, q, deg, m, roots } = pk, a = onePos(roots), va = V('a'), g = smallP(d, -4, 4), dd = nz(d, -6, 6);
      const pl = poly([[p, X], [q, Y]]) + ` + ${va}${Z}` + tailTx([[dd, '']]) + ' = 0';
      return N(`직선 ${lj(lineTx(g, u, flips(d, 3)), '과/와')} 평면 ${lj(nb(pl), '이/가')} 이루는 각의 크기가 ${deg}°일 때, 상수 ${va}의 값은? (단, ${nb(`${va} &gt; 0`)})`, a, {
        signed: true,
        explain: `방향벡터 ${lj(tup(u), '과/와')} 법선벡터 ${lj(nb(`(${iq(p)}, ${iq(q)}, ${va})`), '이/가')} 이루는 각은 ${90 - deg}°이므로 ${frac(`|${poly([[u[2], va], [u[0] * p + u[1] * q, '']])}|`, rt(n2(u)) + rt(`${p * p + q * q} + ${va}${sup(2)}`))} = ${COS[90 - deg]}이다. 양변을 제곱하여 풀면 양수인 해는 ${nb(`${va} = ${a}`)}이다.`,
        facts: { digit: { template: `-1<4*(${js(u[0])}*${js(p)}+${js(u[1])}*${js(q)}+${js(u[2])}*□)*(${js(u[0])}*${js(p)}+${js(u[1])}*${js(q)}+${js(u[2])}*□)-${m}*(${n2S(u)})*(${js(p)}*${js(p)}+${js(q)}*${js(q)}+□*□)<1`, lo: 1, hi: 30, ask: 'min' } }
      });
    })
  ];
  const nsub = (k) => nb(vec('n') + subH(String(k)));

  // ── 바. 점과 평면 사이의 거리 ──
  const distTypes = [
    T('di-pt', '점과 평면 사이의 거리', '②9', (d, k) => {
      const [n, nu] = intN(d), m = d.int(1, 3);
      if (k === 1) {
        const dd = sgn(d) * m * nu;
        return N(`원점과 평면 ${planeTx(n, dd)} 사이의 거리는?`, m, {
          explain: `원점과 평면 ${ms('ax + by + cz + d = 0')} 사이의 거리는 ${frac('|' + ms('d') + '|', rt(ms('a^2 + b^2 + c^2')))}이므로 ${frac(String(Math.abs(dd)), rt(n2(n)))} = ${m}이다.`,
          facts: { calc: [[`${Math.abs(dd)}/${nu}`, 0]] }
        });
      }
      const P = smallP(d, -5, 5), dd = z0(sgn(d) * m * nu - dot(n, P)), v = dot(n, P) + dd;
      return N(`점 ${lj(ptN('A', P), '과/와')} 평면 ${planeTx(n, dd)} 사이의 거리는?`, m, {
        explain: `점과 평면 사이의 거리는 ${frac(`|${dotTx(n, P).replace(/ × /g, '×')} ${dd < 0 ? MINUS : '+'} ${Math.abs(dd)}|`, rt(n2(n)))} = ${frac(String(Math.abs(v)), String(nu))} = ${m}이다.`,
        facts: { calc: [[`${absS(`${dotS(n, P)}+${js(dd)}`, v)}/${nu}`, 0]] }
      });
    }, { count: 2 }),
    T('di-par-planes', '평행한 두 평면 사이의 거리', '②11', (d) => {
      const [n, nu] = intN(d), m = d.int(1, 3), k1 = d.int(-9, 9), k2 = k1 + sgn(d) * m * nu;
      return N(`평행한 두 평면 ${planeR(n, k1)}, ${planeR(n, k2)} 사이의 거리는?`, m, {
        explain: `한 평면 위의 점을 하나 잡아 다른 평면까지의 거리를 구한다. 이는 ${frac(`|${iq(k1)} ${MINUS} ${pq(k2)}|`, rt(n2(n)))} = ${frac(String(Math.abs(k1 - k2)), String(nu))} = ${lj(String(m), '과/와')} 같다.`,
        facts: { calc: [[`${absS(`${js(k1)}-${js(k2)}`, k1 - k2)}/${nu}`, 0]] }
      });
    }),
    T('di-par-d', '평면에 평행하고 한 점에서 거리가 주어진 평면', '②12', (d) => {
      const pk = d.until(() => ({ n: d.pick(VEC3), P: smallP(d, -4, 4), j: d.pick([1, 1, 2]) }), ({ n, P }) => nz2(n) && n[0] > 0 && dot(n, P) !== 0 && n2(n) <= 14);
      const { n, P, j } = pk, N2 = n2(n), dist = rootTx(j * j * N2), v1 = z0(-dot(n, P) + j * N2), v2 = z0(-dot(n, P) - j * N2), d0 = d.until(() => d.int(-9, 9), (x) => x !== v1 && x !== v2), vk = V('k');
      return twoVals(`평면 ${planeTx(n, d0)}에 평행하고 점 ${ptN('A', P)}에서의 거리가 ${dist}인 평면의 방정식을 ${nb(poly([[n[0], X], [n[1], Y], [n[2], Z]]) + ` + ${vk} = 0`)}이라고 할 때, 상수 ${vk}의 값은?`, 'k', v1, v2, {
        explain: `${frac(`|${dotTx(n, P).replace(/ × /g, '×')} + ${vk}|`, rt(N2))} = ${dist}이므로 ${nb(`|${iq(dot(n, P))} + ${vk}| = ${j * N2}`)}이다. 따라서 ${nb(`${vk} = ${iq(v1)}`)} 또는 ${nb(`${vk} = ${iq(v2)}`)}이다.`,
        facts: { calc: [[`0-(${dotS(n, P)})+${j}*(${n2S(n)})`, 0], [`0-(${dotS(n, P)})-${j}*(${n2S(n)})`, 1]] }
      });
    }),
    T('di-box', '좌표공간의 직육면체 — 세 꼭짓점을 지나는 평면과 꼭짓점 사이의 거리', '②13', (d) => {
      const [nv, nu] = intN(d, (v) => v.every((x) => x > 0) && (() => { const L = v.reduce((s, x) => lcm(s, x), 1); return v.every((x) => L / x <= 8); })());
      const L = nv.reduce((s, x) => lcm(s, x), 1), [a, b, c] = nv.map((x) => L / x), which = d.pick(['B', 'B', 'A', 'C', 'F']);
      const V8 = { B: [a, b, c], A: [a, 0, c], C: [0, b, c], F: [a, b, 0] }, P = V8[which], val = dot(nv, P) - L;
      const u = Math.min(26, Math.floor(230 / (b + 1.6 + 0.4 * (a + 1.5))));
      const fig = space({ u }).axes({ x: a + 1.5, y: b + 1.2, z: c + 1.1 }, null, { x: a, y: b, z: c }).box([0, 0, 0], [a, b, c], ['', 'E', 'F', 'G', 'D', 'A', 'B', 'C'])
        .svg(`공간 그림: 좌표공간에 놓인 직육면체 ABCD−EFGO. 꼭짓점 O는 원점, 모서리 OE는 x축, OG는 y축, OD는 z축 위에 있다. OE = ${a}, OG = ${b}, OD = ${c}.`);
      return qAns(`그림과 같이 좌표공간에 세 모서리 OE, OG, OD가 각각 x축, y축, z축 위에 있는 직육면체 ABCD−EFGO가 있다. ${nb(`OE = ${a}`)}, ${nb(`OG = ${b}`)}, ${nb(`OD = ${c}`)}일 때, 세 점 D, E, G를 지나는 평면과 점 ${which} 사이의 거리는?`, [Math.abs(val), nu], {
        figure: fig,
        explain: `${nb(`D(0, 0, ${c})`)}, ${nb(`E(${a}, 0, 0)`)}, ${lj(nb(`G(0, ${b}, 0)`), '을/를')} 지나는 평면은 ${frac(X, String(a))} + ${frac(Y, String(b))} + ${frac(Z, String(c))} = 1, 곧 ${planeR(nv, L)}이다. ${which}${tup(P)}와의 거리는 ${frac(String(Math.abs(val)), rt(n2(nv)))} = ${frac(String(Math.abs(val)), String(nu))}이다.`,
        facts: { value: `${absS(`${nv[0]}*${P[0]}+${nv[1]}*${P[1]}+${nv[2]}*${P[2]}-${L}`, val)}/${nu}` }
      });
    })
  ];

  // ── 사. 구의 방정식 — 벡터로 나타낸 조건 ──
  const PV = `점 ${ms('P(x, y, z)')}의 위치벡터를 ${vec('p')}`;
  const sphereTypes = [
    T('sp-abs', '|p⃗ − a⃗| = r 꼴의 조건이 나타내는 구의 방정식', '②14', (d, k) => {
      const A = nzP(d, -5, 5), vp = vec('p'), va = vec('a');
      if (k === 1) {
        const R = d.pick([4, 9, 16, 25, 5, 6, 10, 13]);
        return sphereAns(`${posOf('A', A)}, ${PV}라고 할 때, ${lj(nb(`(${vp} ${MINUS} ${va}) · (${vp} ${MINUS} ${va}) = ${R}`), '을/를')} 만족시키는 점 P가 나타내는 도형의 방정식을 구하시오.`, A, R, {
          explain: `(${vp} − ${va}) · (${vp} − ${va}) = |${vp} − ${va}|${sup(2)}이므로 ${nb(`|${vp} ${MINUS} ${va}|${sup(2)} = ${R}`)}, 곧 점 P는 A로부터 거리의 제곱이 ${R}인 점이다. 따라서 ${sphereTx(A, R)}이다.`,
          facts: { calc: [0, 1, 2].map((i) => [`0-${js(A[i])}`, i]).concat([[String(R), 3]]) }
        });
      }
      const r = d.int(2, 6), byP = d.bool();
      const cond = byP ? nb(`|${vec('AP')}| = ${r}`) : nb(`|${vp} ${MINUS} ${va}| = ${r}`);
      const head = byP ? `점 ${ptN('A', A)}에 대하여` : `${posOf('A', A)}, ${PV}라고 할 때,`;
      return sphereAns(`${head} ${lj(cond, '을/를')} 만족시키는 점 ${byP ? lj(ms('P(x, y, z)'), '이/가') : 'P가'} 나타내는 도형의 방정식을 구하시오.`, A, r * r, {
        explain: `점 P는 A로부터 거리가 ${r}인 점이므로 중심이 A, 반지름의 길이가 ${r}인 구이다. 따라서 ${sphereTx(A, r * r)}이다.`,
        facts: { calc: [0, 1, 2].map((i) => [`0-${js(A[i])}`, i]).concat([[`${r}*${r}`, 3]]) }
      });
    }, { count: 2 }),
    T('sp-neg', '(p⃗ + a⃗)·(p⃗ + a⃗) = k 꼴 — 중심이 −a⃗ 인 구', '②15', (d) => {
      const A = nzP(d, -5, 5), R = d.pick([4, 9, 16, 25, 6, 10]), vp = vec('p'), va = vec('a'), Cc = mul(-1, A);
      return sphereAns(`${posOf('A', A)}, ${PV}라고 할 때, ${lj(nb(`(${vp} + ${va}) · (${vp} + ${va}) = ${R}`), '을/를')} 만족시키는 점 P가 나타내는 도형의 방정식을 구하시오.`, Cc, R, {
        explain: `${nb(`|${vp} + ${va}|${sup(2)} = ${R}`)}에서 ${nb(`${vp} + ${va} = ${vp} − (${MINUS}${va})`)}이므로 중심은 A가 아니라 ${tup(Cc)}이다. 따라서 ${sphereTx(Cc, R)}이다.`,
        facts: { calc: [0, 1, 2].map((i) => [`${js(A[i])}`, i]).concat([[String(R), 3]]) }
      });
    }),
    T('sp-area', '|p⃗ − a⃗| = |b⃗ − a⃗| 가 나타내는 구의 겉넓이', '②16', (d) => {
      const A = smallP(d, -5, 5), Bp = d.until(() => smallP(d, -5, 5), (q) => n2(sub(q, A)) >= 3 && n2(sub(q, A)) <= 60), R = n2(sub(Bp, A)), vk = V('k');
      return N(`두 점 ${ptN('A', A)}, ${ptN('B', Bp)}의 위치벡터를 각각 ${vec('a')}, ${vec('b')}, ${PV}라고 할 때, ${lj(nb(`|${vec('p')} ${MINUS} ${vec('a')}| = |${vec('b')} ${MINUS} ${vec('a')}|`), '을/를')} 만족시키는 점 P가 나타내는 도형의 겉넓이가 ${nb(vk + 'π')}일 때, 상수 ${vk}의 값은?`, 4 * R, {
        explain: `점 P는 중심이 A이고 반지름의 길이가 ${nb(`|${vec('b')} − ${vec('a')}| = ${rt(R)}`)}인 구 위에 있다. 겉넓이는 ${nb(`4π × ${R} = ${4 * R}π`)}이다.`,
        facts: { calc: [[`4*(${n2S(sub(Bp, A))})`, 0]] }
      });
    }),
    T('sp-expand', '전개한 꼴을 |p⃗ − c⃗|² 으로 묶어 구의 겉넓이', '②17', (d, k) => {
      const A = smallP(d, -4, 4), Bp = d.until(() => smallP(d, -4, 4), (q) => distinct([q, A]) && n2(sub(q, A)) >= 3 && n2(q) >= 2), vp = vec('p'), va = vec('a'), vb = vec('b'), vk = V('k');
      const head = `두 점 ${ptN('A', A)}, ${lj(ptN('B', Bp), '과/와')} 점 P의 위치벡터를 각각 ${va}, ${vb}, ${vp}라고 할 때,`;
      if (k === 1) {
        const m = d.pick([2, 3]), A2 = d.until(() => smallP(d, -3, 3), (q) => n2(q) >= 2 && n2(q) <= 14), R = m * m * n2(A2);
        return N(`두 점 ${ptN('A', A2)}, ${lj(ptN('B', Bp), '과/와')} 점 P의 위치벡터를 각각 ${va}, ${vb}, ${vp}라고 할 때, ${lj(nb(`|${vp}|${sup(2)} ${MINUS} 2${vb} · ${vp} + |${vb}|${sup(2)} = ${m * m}|${va}|${sup(2)}`), '을/를')} 만족시키는 점 P가 나타내는 도형의 겉넓이가 ${nb(vk + 'π')}일 때, 상수 ${vk}의 값은?`, 4 * R, {
          explain: `왼쪽은 ${nb(`|${vp} − ${vb}|${sup(2)}`)}이므로 ${nb(`|${vp} − ${vb}| = ${m}|${va}|`)}이다. 점 P는 중심이 B, 반지름의 길이가 ${nb(`${m}|${va}| = ${rootTx(R)}`)}인 구 위에 있으므로 겉넓이는 ${nb(`4π × ${R} = ${4 * R}π`)}이다.`,
          facts: { calc: [[`4*${m * m}*(${n2S(A2)})`, 0]], rule: 'expB' }
        });
      }
      const R = n2(sub(Bp, A));
      return N(`${head} ${lj(nb(`|${vp}|${sup(2)} ${MINUS} 2${vp} · ${va} + |${va}|${sup(2)} = |${vb} ${MINUS} ${va}|${sup(2)}`), '을/를')} 만족시키는 점 P가 나타내는 도형의 겉넓이가 ${nb(vk + 'π')}일 때, 상수 ${vk}의 값은?`, 4 * R, {
        explain: `왼쪽은 ${nb(`|${vp} − ${va}|${sup(2)}`)}이므로 ${nb(`|${vp} − ${va}| = |${vb} − ${va}| = ${rt(R)}`)}이다. 점 P는 중심이 A인 구 위에 있으므로 겉넓이는 ${nb(`4π × ${R} = ${4 * R}π`)}이다.`,
        facts: { calc: [[`4*(${n2S(sub(Bp, A))})`, 0]], rule: 'expA' }
      });
    }, { count: 2 }),
    T('sp-diam', 'AP⃗·BP⃗ = 0 을 만족시키는 점 P가 나타내는 구', '②18', (d) => {
      const pk = d.until(() => ({ A: smallP(d, -5, 5), Bp: smallP(d, -5, 5) }), ({ A, Bp }) => A.every((v, i) => (v - Bp[i]) % 2 === 0) && n2(sub(A, Bp)) >= 8 && allNZ(add(A, Bp)));
      const { A, Bp } = pk, Cc = add(A, Bp).map((v) => v / 2), R = n2(sub(A, Bp)) / 4;
      return sphereAns(`두 점 ${ptN('A', A)}, ${ptN('B', Bp)}에 대하여 ${lj(nb(`${vec('AP')} · ${vec('BP')} = 0`), '을/를')} 만족시키는 점 ${lj(ms('P(x, y, z)'), '이/가')} 나타내는 도형의 방정식을 구하시오.`, Cc, R, {
        explain: `${vec('AP')} · ${vec('BP')} = 0을 성분으로 쓰면 ${[0, 1, 2].map((i) => nb(par0(AX[i], A[i]) + par0(AX[i], Bp[i]))).join(' + ')} = 0이다. 정리하면 선분 AB를 지름으로 하는 구 ${sphereTx(Cc, R)}이다.`,
        facts: { calc: [0, 1, 2].map((i) => [`0-(${js(A[i])}+${js(Bp[i])})/2`, i]).concat([[`(${n2S(sub(A, Bp))})/4`, 3]]) }
      });
    }),
    T('sp-origin', 'p⃗·(p⃗ − a⃗) = 0 — 원점과 A를 지름의 양 끝으로 하는 구의 부피', '②19', (d, k) => {
      const base = d.pick([[2, 4, 4], [2, 4, 4], [4, 8, 8], [6, 12, 12]]), perm = d.shuffle([0, 1, 2]), A = perm.map((i) => base[i] * sgn(d)), r = Math.sqrt(n2(A)) / 2, vk = V('k');
      const vol = (4 * r * r * r) / 3;
      const text = k === 1
        ? `점 ${lj(ptN('A', A), '과/와')} 원점 O에 대하여 ${lj(nb(`${vec('OA')} · ${vec('OP')} = |${vec('OP')}|${sup(2)}`), '을/를')} 만족시키는 점 P가 나타내는 도형의 부피가 ${nb(vk + 'π')}일 때, 상수 ${vk}의 값은?`
        : `${posOf('A', A)}, 점 P의 위치벡터를 ${vec('p')}라고 할 때, ${lj(nb(`${vec('p')} · (${vec('p')} ${MINUS} ${vec('a')}) = 0`), '을/를')} 만족시키는 점 P가 나타내는 도형의 부피가 ${nb(vk + 'π')}일 때, 상수 ${vk}의 값은?`;
      return N(text, vol, {
        explain: `${k === 1 ? `${nb(`${vec('OP')} · (${vec('OP')} − ${vec('OA')}) = 0`)}, 곧 ${nb(`${vec('OP')} · ${vec('AP')} = 0`)}` : `${nb(`${vec('OP')} · ${vec('AP')} = 0`)}`}이므로 점 P는 선분 OA를 지름으로 하는 구 위에 있다. 반지름의 길이는 ${nb(`${frac('1', '2')}OA = ${r}`)}이므로 부피는 ${nb(`${frac('4', '3')}π × ${r}${sup(3)} = ${vol}π`)}이다.`,
        facts: { calc: [[`(${n2S(A)})*${r}/3`, 0]], rule: k === 1 ? 'orgB' : 'orgA' }
      });
    }, { count: 2 }),
    T('sp-mid', 'AP⃗·(AP⃗ + BP⃗) = 0 — 중점을 써서 구하는 구', '②20', (d, k) => {
      const pk = d.until(() => ({ A: smallP(d, -4, 4), Mm: smallP(d, -4, 4) }), ({ A, Mm }) => A.every((v, i) => (v - Mm[i]) % 2 === 0) && n2(sub(A, Mm)) >= 8 && allNZ(add(A, Mm)));
      const { A, Mm } = pk, Bp = sub(mul(2, Mm), A), Cc = add(A, Mm).map((v) => v / 2), R = n2(sub(A, Mm)) / 4;
      const cond = k === 1 ? nb(`|${vec('AP')}|${sup(2)} = ${vec('AP')} · ${vec('PB')}`) : nb(`${vec('AP')} · (${vec('AP')} + ${vec('BP')}) = 0`);
      return sphereAns(`두 점 ${ptN('A', A)}, ${ptN('B', Bp)}에 대하여 ${lj(cond, '을/를')} 만족시키는 점 ${lj(ms('P(x, y, z)'), '이/가')} 나타내는 도형의 방정식을 구하시오.`, Cc, R, {
        explain: `${k === 1 ? `${nb(`${vec('AP')} · (${vec('AP')} − ${vec('PB')}) = 0`)}이고 ${nb(`${vec('AP')} − ${vec('PB')} = ${vec('AP')} + ${vec('BP')}`)}이다. ` : ''}선분 AB의 중점을 ${lj(nb('M' + tup(Mm)), '이라/라')}고 하면 ${nb(`${vec('AP')} + ${vec('BP')} = 2${vec('MP')}`)}이므로 ${nb(`${vec('AP')} · ${vec('MP')} = 0`)}이다. 점 P는 선분 AM을 지름으로 하는 구 위에 있으므로 ${sphereTx(Cc, R)}이다.`,
        facts: { calc: [0, 1, 2].map((i) => [`0-(${js(A[i])}+(${js(A[i])}+${js(Bp[i])})/2)/2`, i]).concat([[`((${js(A[0])}-${js(Bp[0])})*(${js(A[0])}-${js(Bp[0])})+(${js(A[1])}-${js(Bp[1])})*(${js(A[1])}-${js(Bp[1])})+(${js(A[2])}-${js(Bp[2])})*(${js(A[2])}-${js(Bp[2])}))/16`, 3]]), rule: k === 1 ? 'midB' : 'midA' }
      });
    }, { count: 2 })
  ];

  // ── 아. 구와 직선·평면 ──
  const meetTypes = [
    T('me-chord', '직선과 구의 두 교점 사이의 거리', '②21', (d) => {
      const pk = d.until(() => { const R = d.pick(RICH), L2 = lat(R), v1 = d.pick(L2), v2 = d.pick(L2); return { R, v1, v2 }; },
        ({ v1, v2 }) => !parallel3(v1, v2) && sqf(n2(sub(v2, v1))) && nz2(sub(v2, v1)));
      const { R, v1, v2 } = pk, Cc = d.bool() ? [0, 0, 0] : smallP(d, -3, 3), P = add(Cc, v1), w = prim(sub(v2, v1)), P0 = add(P, mul(d.int(-1, 1), w)), e = sub(P0, Cc), L2 = n2(sub(v2, v1));
      const sp = Cc.every((v) => v === 0) ? nb(`${X}${sup(2)} + ${Y}${sup(2)} + ${Z}${sup(2)} = ${R}`) : sphereTx(Cc, R);
      return radAns(`직선 ${lj(lineTx(P0, w, flips(d, 3)), '과/와')} 구 ${sp}의 두 교점을 A, B라고 할 때, 선분 AB의 길이는?`, 1, L2, {
        explain: `직선 위의 점을 ${lj(nb(`(${[0, 1, 2].map((i) => poly([[w[i], V('t')], [P0[i], '']])).join(', ')})`), '으로/로')} 놓아 구의 식에 넣고 ${lj(V('t'), '을/를')} 구하면 두 교점은 ${tup(P)}, ${lj(tup(add(Cc, v2)), '이/가')}다. 따라서 ${nb(`AB = ${rt(L2)}`)}이다.`,
        facts: { calc: [[`(4*(${dotS(w, e)})*(${dotS(w, e)})-4*(${n2S(w)})*((${n2S(e)})-${R}))/(${n2S(w)})`, 0]] }
      });
    }),
    T('me-disc', '직선과 구가 서로 다른 두 점에서 만나는 조건(판별식)', '②22', (d) => {
      const pk = d.until(() => ({ w: [d.pick([1, 2, -1]), d.pick([1, 2, 3, -2]), d.pick([1, 1, 2, -1])], Cc: [nz(d, -4, 4), nz(d, -4, 4), d.int(-3, 3)], R: d.pick([3, 5, 6, 7, 10, 11]) }), ({ w, Cc, R }) => {
        const W = n2(w), lhs = W - w[2] * w[2], rhs = W * R; if (lhs <= 0) return false; const cnt = range(-30, 30).filter((x) => x * x * lhs < rhs).length; return cnt >= 3 && cnt <= 11 && gall(w) === 1 && !isSq(rhs / lhs);
      });
      const { w, Cc, R } = pk, W = n2(w), lhs = W - w[2] * w[2], cnt = range(-30, 30).filter((x) => x * x * lhs < W * R).length, va = V('a');
      const zt = w[2] === 1 ? `${Z} ${MINUS} ${va}` : frac(`${Z} ${MINUS} ${va}`, iq(w[2]));
      const ln = [0, 1].map((i) => nb(termTx(AX[i], Cc[i], w[i]))).concat([nb(zt)]).join(' = ');
      return N(`직선 ${lj(ln, '과/와')} 구 ${lj(sphereTx(Cc, R), '이/가')} 서로 다른 두 점에서 만나도록 하는 정수 ${va}의 개수는?`, cnt, {
        explain: `직선 위의 점 ${lj(nb(`(${poly([[w[0], V('t')], [Cc[0], '']])}, ${poly([[w[1], V('t')], [Cc[1], '']])}, ${poly([[w[2], V('t')]])} + ${va})`), '을/를')} 구의 식에 넣으면 ${V('t')}에 대한 이차방정식 ${lj(nb(`${W}${V('t')}${sup(2)} + ${w[2] === 1 ? '' : pq(2 * w[2])}${w[2] === 1 ? '2' : ''}(${varPlus('a', -Cc[2])})${V('t')} + (${varPlus('a', -Cc[2])})${sup(2)} ${MINUS} ${R} = 0`), '이/가')} 된다. 서로 다른 두 실근을 가지려면 판별식이 양수여야 하므로 ${nb(`${lhs}(${varPlus('a', -Cc[2])})${sup(2)} &lt; ${W * R}`)}이고, 이를 만족시키는 정수 ${lj(va, '은/는')} ${cnt}개이다.`,
        facts: { digit: { template: `(□-${js(Cc[2])})*(□-${js(Cc[2])})*${lhs}<${W * R}`, lo: Cc[2] - 30, hi: Cc[2] + 30, ask: 'count' } }
      });
    }),
    T('me-circle-r', '구와 평면이 만나서 생기는 원의 반지름의 길이', '②23', (d) => {
      const [r, dist, rho] = d.pick([[5, 3, 4], [5, 4, 3], [10, 6, 8], [10, 8, 6], [13, 5, 12], [13, 12, 5], [15, 9, 12], [15, 12, 9], [17, 8, 15], [17, 15, 8]]);
      const [n, nu] = intN(d), A = smallP(d, -4, 4), dd = z0(sgn(d) * dist * nu - dot(n, A)), v = dot(n, A) + dd;
      return N(`중심이 ${ptN('A', A)}이고 반지름의 길이가 ${r}인 구와 평면 ${lj(planeTx(n, dd), '이/가')} 만나서 생기는 원의 반지름의 길이는?`, rho, {
        explain: `구의 중심 A와 평면 사이의 거리는 ${frac(String(Math.abs(v)), String(nu))} = ${dist}이다. 원의 반지름의 길이는 ${nb(`${rt(`${r}${sup(2)} ${MINUS} ${dist}${sup(2)}`)} = ${rho}`)}이다.`,
        facts: { digit: { template: `-1<□*□+((${dotS(n, A)}+${js(dd)})*(${dotS(n, A)}+${js(dd)}))/(${n2S(n)})-${r}*${r}<1`, lo: 1, hi: 30, ask: 'min' } }
      });
    }),
    T('me-circle-area', '|AP⃗| = r 인 구와 평면이 만나서 생기는 원의 넓이', '②23', (d) => {
      const r = d.int(3, 7), dist = d.int(1, r - 1), [n, nu] = intN(d), A = smallP(d, -4, 4), dd = z0(sgn(d) * dist * nu - dot(n, A)), vk = V('k');
      return N(`점 ${ptN('A', A)}에 대하여 ${lj(nb(`|${vec('AP')}| = ${r}`), '을/를')} 만족시키는 점 P가 나타내는 도형과 평면 ${lj(planeTx(n, dd), '이/가')} 만나서 생기는 원의 넓이가 ${nb(vk + 'π')}일 때, 상수 ${vk}의 값은?`, r * r - dist * dist, {
        explain: `점 P는 중심이 A, 반지름의 길이가 ${r}인 구 위에 있다. A와 평면 사이의 거리는 ${dist}이므로 원의 반지름의 길이의 제곱은 ${nb(`${r}${sup(2)} ${MINUS} ${dist}${sup(2)} = ${r * r - dist * dist}`)}이고 넓이는 ${nb(`${r * r - dist * dist}π`)}이다.`,
        facts: { calc: [[`${r}*${r}-((${dotS(n, A)}+${js(dd)})*(${dotS(n, A)}+${js(dd)}))/(${n2S(n)})`, 0]] }
      });
    }),
    T('me-circle-back', '구와 평면이 만나서 생기는 원의 넓이로 구의 반지름(거꾸로)', '②24', (d) => {
      const dist = d.int(1, 6), rho2 = d.pick([4, 9, 16, 5, 7, 8]), [n, nu] = intN(d), A = nzP(d, -4, 4), dd = z0(sgn(d) * dist * nu - dot(n, A)), vk = V('k');
      const sp = [0, 1, 2].map((i) => nb(`(${numer(AX[i], A[i])})${sup(2)}`)).join(' + ') + ' = ' + vk;
      return N(`구 ${lj(sp, '이/가')} 평면 ${lj(planeTx(n, dd), '과/와')} 만나서 생기는 원의 넓이가 ${nb(rho2 + 'π')}일 때, 상수 ${vk}의 값은?`, dist * dist + rho2, {
        explain: `구의 중심 ${lj(tup(A), '과/와')} 평면 사이의 거리는 ${dist}이고, 원의 반지름의 길이의 제곱은 ${rho2}이다. 구의 반지름의 길이의 제곱은 ${nb(`${dist}${sup(2)} + ${rho2} = ${dist * dist + rho2}`)}이므로 ${nb(`${vk} = ${dist * dist + rho2}`)}이다.`,
        facts: { calc: [[`((${dotS(n, A)}+${js(dd)})*(${dotS(n, A)}+${js(dd)}))/(${n2S(n)})+${rho2}`, 0]] }
      });
    }),
    T('me-maxmin', '구 위의 점과 평면 사이의 거리의 최댓값과 최솟값', '②25', (d, k) => {
      const r = d.int(1, 4), dist = d.int(r + 1, r + 6), [n, nu] = intN(d), Cc = nzP(d, -4, 4), dd = z0(sgn(d) * dist * nu - dot(n, Cc)), v = dot(n, Cc) + dd;
      const sp = k === 1 ? sphereGen(Cc, r * r) : sphereTx(Cc, r * r);
      const dS = `${absS(`${dotS(n, Cc)}+${js(dd)}`, v)}/${nu}`;
      return M(`구 ${sp} 위의 점과 평면 ${planeTx(n, dd)} 사이의 거리의 최댓값과 최솟값을 각각 구하시오.`, [{ answer: dist + r, label: '최댓값' }, { answer: dist - r, label: '최솟값' }], {
        shown: `최댓값 ${dist + r}, 최솟값 ${dist - r}`,
        explain: `${k === 1 ? `구의 식을 고치면 ${sphereTx(Cc, r * r)}이다. ` : ''}구의 중심 ${lj(tup(Cc), '과/와')} 평면 사이의 거리는 ${frac(String(Math.abs(v)), String(nu))} = ${dist}이고 반지름의 길이 ${r}보다 크므로 구와 평면은 만나지 않는다. 최댓값은 ${nb(`${dist} + ${r} = ${dist + r}`)}, 최솟값은 ${nb(`${dist} ${MINUS} ${r} = ${dist - r}`)}이다.`,
        facts: { calc: [[`${dS}+${r}`, 0], [`${dS}-${r}`, 1]], rule: k === 1 ? 'mmGen' : 'mmStd' }
      });
    }, { count: 2 }),
    T('me-tan-par', '평면에 평행하고 구에 접하는 평면', '②27', (d) => {
      const r = d.int(1, 4), [n, nu] = intN(d), Cc = d.until(() => smallP(d, -4, 4), (q) => dot(n, q) !== 0), v1 = z0(-dot(n, Cc) + r * nu), v2 = z0(-dot(n, Cc) - r * nu), d0 = d.until(() => d.int(-9, 9), (x) => x !== v1 && x !== v2), vk = V('k');
      return twoVals(`평면 ${planeTx(n, d0)}에 평행하고 구 ${sphereTx(Cc, r * r)}에 접하는 평면의 방정식을 ${nb(poly([[n[0], X], [n[1], Y], [n[2], Z]]) + ` + ${vk} = 0`)}이라고 할 때, 상수 ${vk}의 값은?`, 'k', v1, v2, {
        explain: `구에 접하는 평면은 구의 중심 ${tup(Cc)}에서의 거리가 반지름의 길이 ${lj(String(r), '과/와')} 같다. ${frac(`|${iq(dot(n, Cc))} + ${vk}|`, rt(n2(n)))} = ${r}이므로 ${nb(`|${iq(dot(n, Cc))} + ${vk}| = ${r * nu}`)}, 곧 ${nb(`${vk} = ${iq(v1)}`)} 또는 ${nb(`${vk} = ${iq(v2)}`)}이다.`,
        facts: { calc: [[`0-(${dotS(n, Cc)})+${r}*${nu}`, 0], [`0-(${dotS(n, Cc)})-${r}*${nu}`, 1]] }
      });
    }),
    T('me-tangent-pt', '구 위의 점에서 구에 접하는 평면', '②29', (d) => {
      const pk = d.until(() => { const R = d.pick(RICH), w = d.pick(lat(R)), Cc = smallP(d, -3, 3); return { R, w, Cc, P: add(Cc, w) }; }, ({ w, P }) => w[0] !== 0 && nz2(w) && dot(w, P) % w[0] === 0);
      const { R, w, Cc, P } = pk, x0 = z0(dot(w, P) / w[0]);
      return N(`구 ${sphereTx(Cc, R)} 위의 점 ${ptN('P', P)}에서 구에 접하는 평면이 x축과 만나는 점의 x좌표는?`, x0, {
        signed: true,
        explain: `구의 중심을 ${lj(nb('C' + tup(Cc)), '이라/라')}고 하면 ${vec('CP')} = ${lj(tup(w), '이/가')} 접하는 평면의 법선벡터이다. 평면은 ${pnTx(w, P)}이고, ${lj(nb(`${Y} = ${Z} = 0`), '을/를')} 넣으면 ${nb(`${X} = ${iq(x0)}`)}이다.`,
        facts: { calc: [[`(${[0, 1, 2].map((i) => `(${js(P[i])}-${js(Cc[i])})*${js(P[i])}`).join('+')})/(${js(P[0])}-${js(Cc[0])})`, 0]] }
      });
    })
  ];

  B.addGroup(UNIT, { id: 'plane', title: '평면의 방정식', standard: S5, types: planeTypes });
  B.addGroup(UNIT, { id: 'pangle', title: '두 평면·직선과 평면이 이루는 각', standard: S5, types: pangleTypes });
  B.addGroup(UNIT, { id: 'dist', title: '점과 평면 사이의 거리', standard: S5, types: distTypes });
  B.addGroup(UNIT, { id: 'sphere', title: '구의 방정식', standard: S5, types: sphereTypes });
  B.addGroup(UNIT, { id: 'meet', title: '구와 직선·평면', standard: S5, types: meetTypes });
  Object.assign(K, { lcm, pnTx, planeAny, smallP, nzP, xSign, alpha, beta, intN, lat, RICH, parallel3, dotTx, nsub });
})(typeof window !== 'undefined' ? window : globalThis);
