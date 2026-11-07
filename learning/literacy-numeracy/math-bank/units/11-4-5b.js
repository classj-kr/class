// 고등학교 기하 Ⅱ-2 공간좌표 — 뒤쪽 묶음(구의 방정식, 좌표평면·좌표축과 구, 구와 거리 — 접선·최대·최소).
// 단원 틀·싣는 기준·뺀 것과 까닭은 11-4-5a.js 머리에 적었다. 도구는 11-4-5a.js 가 내보낸 B.kit.u45x 를 쓴다.
// ref: ②n = 기본꼴_2의 n번.
//  - 구의 방정식을 답으로 받을 때는 「(x [±][ ])² + (y [±][ ])² + (z [±][ ])² = [ ]」 칸에 넣게 한다(부호 단추가 더하기·빼기 노릇을 한다 — polyAns 와 같은 꼴).
//    그래서 이 칸으로 받는 구는 중심의 좌표가 모두 0이 아니게 수를 골랐다(「(x + 0)²」 같은 칸이 생기지 않게).
//  - 중심과 반지름을 읽는 문항은 「중심 ([±][ ], [±][ ], [±][ ]), 반지름의 길이 [ ]」 한 줄에 받는다. 일반형에서 읽는 유형은 반지름이 늘 a√b(a ≥ 2) 꼴이 되게 하고,
//    표준형에서 읽는 유형은 늘 정수가 되게 했다(한 유형 안에서 칸의 모양이 같다).
//  - 넓이·부피처럼 π가 붙는 값은 「넓이가 kπ일 때, 상수 k의 값은?」으로 묻는다(π 칸이 답의 꼴을 흘리지 않게).
//  - 최댓값과 최솟값을 원문이 합·곱으로 묶어 물은 꼴(교마10, 대13)은 두 칸으로 따로 받는다. 거리가 정수가 되게(네 수 a² + b² + c² = d²) 중심을 골랐다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, N, M, C, inline } = B.kit;
  const { MINUS, Q, tx, nb, tail, sup, nz, pm, poly, rt, grp, sqParts, radText, SG } = B.kit.mid;
  const { jh, qAns, sub } = B.kit.hs;
  const K = B.kit.u45x;
  const { S5, T, stripH, X, Y, Z, VK, AX, iq, jn, par, pt3, P3, P3j, axisH, PL, planeH, sq2, isSq, lenH, lenE, add3, sub3, mul3, d2, n2of, same3, inBox, d2e, d2h, radLen, lenAns, rootAns, vals, rnd3, nz3, vecs, QUAD, PYTH } = K;

  // ── 구의 글 ──
  // (x − a)² 꼴의 항(a = 0 이면 x²)
  const term = (v, a) => (a === 0 ? v + sup(2) : `(${poly([[1, v], [-a, '']])})${sup(2)}`);
  // 표준형: (x − a)² + (y − b)² + (z − c)² = k
  const sphH = (c, k) => nb(`${term(X, c[0])} + ${term(Y, c[1])} + ${term(Z, c[2])} = ${k}`);
  // 일반형: x² + y² + z² + Ax + By + Cz + D = 0 (중심 c, 반지름의 제곱 k)
  const coefOf = (c, k) => ({ A: -2 * c[0], B: -2 * c[1], C: -2 * c[2], D: c[0] * c[0] + c[1] * c[1] + c[2] * c[2] - k });
  const genH = (c, k) => { const f = coefOf(c, k); return nb(poly([[1, X + sup(2)], [1, Y + sup(2)], [1, Z + sup(2)], [f.A, X], [f.B, Y], [f.C, Z], [f.D, '']]) + ' = 0'); };
  // 검사 식: 일반형의 계수로 중심의 좌표(−A/2)와 반지름의 제곱((A² + B² + C²)/4 − D)
  const cE = (c, k, i) => { const f = coefOf(c, k), A = [f.A, f.B, f.C][i]; return `((0-${jn(A)})/2)`; };
  const kE = (c, k) => { const f = coefOf(c, k); return `((${jn(f.A)}*${jn(f.A)}+${jn(f.B)}*${jn(f.B)}+${jn(f.C)}*${jn(f.C)})/4-${jn(f.D)})`; };
  // 일반형을 표준형으로 고치는 풀이 글
  const toStd = (c, k) => `${genH(c, k)}을 고치면 ${sphH(c, k)}`;

  // ── 답 ──
  // 구의 방정식: 「(x [±][ ])² + (y [±][ ])² + (z [±][ ])² = [ ]」 — 중심의 좌표는 모두 0이 아니다.
  function sphereAns(text, c, k, es, o) {
    if (c.some((v) => v === 0) || !Number.isInteger(k) || k < 1) throw new Error('구의 방정식 답: 중심의 좌표는 0이 아닌 정수, 우변은 자연수');
    // 항 하나((x [±][ ])²)는 한 덩이로 묶어 좁은 화면에서도 괄호 가운데서 줄이 갈리지 않게 한다.
    return inline(text, `${grp(`(${X} {0})${sup(2)}`)} + ${grp(`(${Y} {1})${sup(2)}`)} + ${grp(`(${Z} {2})${sup(2)}`)} ${grp('= {3}')}`, [{ answer: -c[0], signed: true }, { answer: -c[1], signed: true }, { answer: -c[2], signed: true }, { answer: k }],
      Object.assign({}, o, { shown: sphH(c, k), facts: Object.assign({}, (o && o.facts) || {}, { calc: es.map((e, i) => [e, i]) }) }));
  }
  // 중심과 반지름: 「중심 ([±][ ], [±][ ], [±][ ]), 반지름의 길이 [ ]」(정수) 또는 「… [ ]√[ ]」(a√b, a ≥ 2)
  function centerRadius(text, c, r, es, o) {
    const rad = Array.isArray(r), tail2 = rad ? '{3}' + rt('{4}') : '{3}';
    const inputs = c.map((v) => ({ answer: v, signed: true })).concat(rad ? [{ answer: r[0] }, { answer: r[1] }] : [{ answer: r }]);
    return inline(text, '중심 (' + grp('{0},') + ' ' + grp('{1},') + ' ' + grp('{2}),') + ' ' + grp('반지름의 길이 ' + tail2), inputs,
      Object.assign({}, o, { shown: `중심 ${pt3(c)}, 반지름의 길이 ${rad ? radText(r[0], r[1]) : r}`, facts: Object.assign({}, (o && o.facts) || {}, { calc: es.map((e, i) => [e, i]) }) }));
  }
  // 최댓값·최솟값 두 칸
  const maxMin = (text, mx, mn, o) => M(text, [{ label: '최댓값', answer: mx }, { label: '최솟값', answer: mn }], Object.assign({}, o, { shown: `최댓값 ${mx}, 최솟값 ${mn}` }));

  // ── 수 고르기 ──
  const nzc = (d, r) => [nz(d, -r, r), nz(d, -r, r), nz(d, -r, r)];
  // 중심이 c 이고 정수 거리 dd 에 있는 점(네 수의 차례와 부호를 섞는다)
  function atDist(d, c) {
    const [a, b, e, dd] = d.pick(QUAD), v = d.shuffle([a, b, e]).map((x) => x * pm(d));
    return { p: add3(c, v), dd };
  }

  // ═══ 라. 구의 방정식 ═══
  const sphere = [
    T('sph-center-r', '중심과 반지름으로 구의 방정식 세우기', '②1', (d) => {
      const c = nzc(d, 6), r = d.int(1, 8);
      return sphereAns(`중심의 좌표가 ${pt3(c)}이고 반지름의 길이가 ${r}인 구의 방정식은?`, c, r * r, c.map((v) => `0-${jn(v)}`).concat([`${r}*${r}`]), {
        explain: `중심이 ${pt3(c)}이고 반지름의 길이가 ${r}인 구의 방정식은 ${sphH(c, r * r)}이다. (중심의 각 좌표의 부호를 바꾸어 괄호 안에 넣고, 우변에는 반지름의 길이의 제곱을 적는다.)`
      });
    }),
    T('sph-through', '중심과 지나는 한 점으로 구의 방정식 세우기', '②2', (d) => {
      const c = nzc(d, 5), useO = d.bool(), p = useO ? [0, 0, 0] : rnd3(d, -5, 5);
      if (same3(c, p)) return null;
      const k = d2(c, p);
      return sphereAns(`중심의 좌표가 ${pt3(c)}이고 ${useO ? '원점을' : '점 ' + K.pt3j(p, '을/를')} 지나는 구의 방정식은?`, c, k, c.map((v) => `0-${jn(v)}`).concat([d2e(c, p)]), {
        explain: `반지름의 길이는 중심과 ${useO ? '원점' : '그 점'} 사이의 거리이므로 ${nb(`${V_('r')}${sup(2)} = ${k}`)}이다. 따라서 구의 방정식은 ${sphH(c, k)}이다.`
      });
    }),
    T('sph-diam', '지름의 양 끝점으로 구의 방정식 세우기', '②3', (d) => {
      const c = nzc(d, 5), w = rnd3(d, -3, 3), A = sub3(c, w), Bq = add3(c, w), k = n2of(w);
      if (k === 0 || !inBox([A, Bq], 9) || w.filter((v) => v === 0).length > 1) return null;
      return sphereAns(`두 점 ${P3('A', A)}, ${P3j('B', Bq, '을/를')} 지름의 양 끝점으로 하는 구의 방정식은?`, c, k, c.map((v, i) => `0-(${jn(A[i])}+${jn(Bq[i])})/2`).concat([`(${d2e(A, Bq)})/4`]), {
        explain: `구의 중심은 선분 AB의 중점 ${pt3(c)}이고, 반지름의 길이는 ${nb(`${frac(1, 2)}${SG('AB')}`)}이므로 ${nb(`${V_('r')}${sup(2)} = ${frac(d2(A, Bq), 4)} = ${k}`)}이다. 따라서 구의 방정식은 ${sphH(c, k)}이다.`,
        facts: { derived: [2, 4] }
      });
    }),
    T('sph-read', '구의 방정식에서 중심과 반지름 읽기', '②4', (d) => {
      const c = rnd3(d, -6, 6), r = d.int(1, 9);
      if (c.filter((v) => v === 0).length > 1) return null;
      return centerRadius(`구 ${sphH(c, r * r)}의 중심의 좌표와 반지름의 길이는?`, c, r, c.map((v) => jn(v)).concat([`${r * r}**0.5`]), {
        explain: `구의 방정식 ${nb(`(${X} ${MINUS} ${V_('a')})${sup(2)} + (${Y} ${MINUS} ${V_('b')})${sup(2)} + (${Z} ${MINUS} ${V_('c')})${sup(2)} = ${V_('r')}${sup(2)}`)}에서 중심은 (${V_('a')}, ${V_('b')}, ${V_('c')}), 반지름의 길이는 ${V_('r')}이다. 괄호 안의 수의 부호를 바꾸어 읽으면 중심은 ${pt3(c)}이고, ${nb(`${V_('r')}${sup(2)} = ${r * r}`)}이므로 반지름의 길이는 ${r}이다.`,
        facts: { derived: [0.5] }
      });
    }),
    T('sph-general', '일반형으로 준 구의 중심과 반지름', '②5', (d) => {
      const c = rnd3(d, -5, 5), a = d.int(2, 4), b = d.pick([2, 3, 5, 6, 7]), k = a * a * b;
      if (c.filter((v) => v === 0).length > 1) return null;
      if (coefOf(c, k).D === 0) return null;
      const e = kE(c, k);
      return centerRadius(`방정식 ${jh(genH(c, k), '이/가')} 나타내는 구의 중심의 좌표와 반지름의 길이는?`, c, [a, b], [0, 1, 2].map((i) => cE(c, k, i)).concat([`(${e}/${b})**0.5`, `${e}/(${a}*${a})`]), {
        explain: `${X}, ${Y}, ${Z}에 대하여 각각 완전제곱식으로 묶으면 ${sphH(c, k)}이다. 따라서 중심은 ${pt3(c)}이고 반지름의 길이는 ${rt(k)} = ${radText(a, b)}이다.`,
        facts: { derived: [2, 4, a, b, 0.5] }
      });
    }),
    T('sph-centers', '일반형으로 준 두 구의 중심 사이의 거리', '②6', (d, n) => {
      const c1 = rnd3(d, -5, 5), k1 = d.int(1, 9), w = rnd3(d, -6, 6), c2 = add3(c1, n === 1 ? mul3(w, 2) : w), k2 = d.int(1, 9);
      const m = n === 1 ? n2of(w) : d2(c1, c2);
      if (m < 2 || isSq(m) || sqParts(m)[0] !== 1 || !inBox([c2], 10) || coefOf(c1, k1).D === 0 || coefOf(c2, k2).D === 0) return null;
      const dist2 = [0, 1, 2].map((i) => `(${cE(c2, k2, i)}-${cE(c1, k1, i)})*(${cE(c2, k2, i)}-${cE(c1, k1, i)})`).join('+');
      if (n === 0) return rootAns(`두 구 ${genH(c1, k1)}, ${jh(genH(c2, k2), '의')} 중심 사이의 거리는?`.replace(/의의/, '의'), m, dist2, {
        explain: `두 방정식을 고치면 ${sphH(c1, k1)}, ${sphH(c2, k2)}이므로 중심은 ${pt3(c1)}, ${pt3(c2)}이다. 중심 사이의 거리는 ${d2h(c1, c2)} = ${rt(m)}이다.`,
        facts: { derived: [2] }
      });
      return rootAns(`두 구 ${genH(c1, k1)}, ${genH(c2, k2)}의 중심을 각각 C${sub(1)}, C${sub(2)}라 할 때, 두 점 C${sub(1)}, C${sub(2)}를 지름의 양 끝점으로 하는 구의 반지름의 길이는?`, m, `(${dist2})/4`, {
        explain: `두 방정식을 고치면 중심은 ${pt3(c1)}, ${pt3(c2)}이다. 두 중심 사이의 거리는 ${d2h(c1, c2)} = ${lenH(4 * m)}이고, 구하는 구의 반지름의 길이는 그 절반인 ${rt(m)}이다.`,
        facts: { derived: [2, 4] }
      });
    }, { count: 2 }),
    T('sph-four', '원점과 세 좌표축 위의 점을 지나는 구의 반지름', '②7', (d) => {
      const p = [d.int(2, 6), d.int(2, 6), d.int(2, 6)].map((v) => v * pm(d)), n2 = n2of(p), [a, b] = sqParts(n2);
      if (b === 1) return null;
      // 값 num√rad/den 의 글
      const surd = (num, den, rad) => { const g = gcdN(num, den), nn = num / g, dd = den / g, body = rad === 1 ? String(nn) : (nn === 1 ? '' : nn) + rt(rad); return dd === 1 ? body : frac(body, dd); };
      const s3 = Math.abs(p[0]) + Math.abs(p[1]) + Math.abs(p[2]);
      const opts = [[surd(a, 2, b), true], [surd(a, 1, b), false], [surd(a, 3, b), false], [surd(a, 4, b), false], [s3 % 2 === 0 ? String(s3 / 2) : frac(s3, 2), false]];
      const pts = [[p[0], 0, 0], [0, p[1], 0], [0, 0, p[2]]];
      const rows = opts;
      const ch = K.pick(d, `좌표공간의 네 점 (0, 0, 0), ${pt3(pts[0])}, ${pt3(pts[1])}, ${jh(pt3(pts[2]), '을/를')} 지나는 구의 반지름의 길이는?`, rows, {
        explain: `구의 방정식을 ${nb(`${X}${sup(2)} + ${Y}${sup(2)} + ${Z}${sup(2)} + ${V_('a')}${X} + ${V_('b')}${Y} + ${V_('c')}${Z} + ${V_('d')} = 0`)}으로 놓고 네 점을 넣으면 ${nb(`${V_('d')} = 0`)}, ${nb(`${V_('a')} = ${iq(-p[0])}`)}, ${nb(`${V_('b')} = ${iq(-p[1])}`)}, ${nb(`${V_('c')} = ${iq(-p[2])}`)}이다. 고치면 중심은 ${pt3(p.map((v) => (v % 2 === 0 ? v / 2 : (v < 0 ? MINUS : '') + frac(Math.abs(v), 2))))}이고 ${nb(`${V_('r')}${sup(2)} = ${frac(n2, 4)}`)}이므로 반지름의 길이는 ${surd(a, 2, b)}이다.`
      });
      return ch;
    })
  ];

  // ═══ 마. 좌표평면·좌표축과 구 ═══
  const PLW = (i) => `${planeH(i)}`;
  const touch = [
    T('touch-pick', '좌표평면에 접하는 구 고르기', '②8', (d, n) => {
      const i = d.int(0, 2), j = d.pick([0, 1, 2].filter((x) => x !== i)), want = n === 0 ? [i] : [i, j];
      const tangent = (c, r) => [0, 1, 2].filter((x) => Math.abs(c[x]) === r);
      const ok = (c, r) => want.every((x) => tangent(c, r).includes(x));
      // force 의 좌표평면에만 접하게(나머지 좌표가 우연히 반지름과 같으면 하나 늘린다)
      const sph = (force) => { const r = d.int(2, 6), c = nzc(d, 7); for (const x of [0, 1, 2]) if (Math.abs(c[x]) === r) c[x] = (r + 1) * Math.sign(c[x]); for (const x of force) c[x] = r * pm(d); return [c, r]; };
      const k3 = [0, 1, 2].find((x) => x !== i && x !== j), others = [0, 1, 2].filter((x) => x !== i);
      const list = [sph(want)].concat(n === 0 ? [sph([others[0]]), sph([others[1]]), sph([])] : [sph([i]), sph([j]), sph([k3])]);
      if (!ok(...list[0]) || list.slice(1).some((x) => ok(...x))) return null;
      const label = n === 0 ? `${planeH(i)}에 접하는 구` : `${planeH(i)}과 ${planeH(j)}에 동시에 접하는 구`;
      return K.pick(d, `다음 중 ${label}의 방정식은?`, list.map(([c, r], g) => [sphH(c, r * r), g === 0]), {
        explain: `${planeH(i)}에 접하려면 중심의 ${AX[i]}좌표의 절댓값이 반지름의 길이와 같아야 한다${n === 1 ? `. ${planeH(j)}에 접하려면 중심의 ${AX[j]}좌표의 절댓값도 반지름의 길이와 같아야 한다` : ''}. 이를 만족시키는 것은 ${sphH(list[0][0], list[0][1] ** 2)}이다.`
      });
    }, { count: 2 }),
    T('touch-three', '세 좌표평면에 동시에 접하는 구의 중심', '②9', (d) => {
      const r = d.int(2, 9);
      return N(`세 좌표평면에 동시에 접하는 구의 반지름의 길이가 ${r}이다. 이 구의 중심의 좌표를 (${V_('a')}, ${V_('b')}, ${V_('c')})라 할 때, ${nb(`${V_('a')}${sup(2)} + ${V_('b')}${sup(2)} + ${V_('c')}${sup(2)}`)}의 값은?`, 3 * r * r, {
        explain: `${X}${Y}평면, ${Y}${Z}평면, ${Z}${X}평면에 동시에 접하므로 중심의 세 좌표의 절댓값이 모두 반지름의 길이와 같다. ${nb(`|${V_('a')}| = |${V_('b')}| = |${V_('c')}| = ${r}`)}이므로 ${nb(`${V_('a')}${sup(2)} + ${V_('b')}${sup(2)} + ${V_('c')}${sup(2)} = 3 × ${r * r} = ${3 * r * r}`)}이다.`,
        facts: { calc: [[`3*${r}*${r}`, 0]], unseen: [3] }
      });
    }),
    T('touch-axis', '좌표축에 접하는 구의 반지름·상수', '②11', (d, n) => {
      const i = d.int(0, 2), [j, k] = [0, 1, 2].filter((x) => x !== i);
      if (n === 0) {
        const [p, q] = d.pick(PYTH), c = [0, 0, 0];
        c[i] = nz(d, -6, 6); c[j] = p * pm(d); c[k] = q * pm(d);
        if (!inBox([c], 12)) return null;
        const r = Math.sqrt(p * p + q * q);
        return N(`중심의 좌표가 ${pt3(c)}이고 ${axisH(i)}에 접하는 구의 반지름의 길이는?`, r, {
          explain: `구가 ${axisH(i)}에 접하므로 반지름의 길이는 중심에서 ${axisH(i)}까지의 거리이다. 중심에서 ${axisH(i)}에 내린 수선의 발은 ${pt3(c.map((v, x) => (x === i ? v : 0)))}이므로 반지름의 길이는 ${rt(`${sq2(c[j])} + ${sq2(c[k])}`)} = ${r}이다.`,
          facts: { calc: [[`(${jn(c[j])}*${jn(c[j])}+${jn(c[k])}*${jn(c[k])})**0.5`, 0]], derived: [0.5] }
        });
      }
      const c = nzc(d, 6), kk = c[i] * c[i], rr = c[j] * c[j] + c[k] * c[k], f = coefOf(c, rr);
      const gen = nb(poly([[1, X + sup(2)], [1, Y + sup(2)], [1, Z + sup(2)], [f.A, X], [f.B, Y], [f.C, Z]]) + ' + ' + VK + ' = 0');
      return N(`구 ${jh(gen, '이/가')} ${axisH(i)}과 한 점에서 만날 때, 상수 ${VK}의 값은?`, kk, {
        signed: true,
        explain: `고치면 ${nb(`${term(X, c[0])} + ${term(Y, c[1])} + ${term(Z, c[2])} = ${c[0] * c[0] + c[1] * c[1] + c[2] * c[2]} ${MINUS} ${VK}`)}이다. ${axisH(i)}과 한 점에서 만나면(접하면) 반지름의 길이는 중심에서 ${axisH(i)}까지의 거리 ${rt(`${sq2(c[j])} + ${sq2(c[k])}`)}이므로 ${nb(`${c[0] * c[0] + c[1] * c[1] + c[2] * c[2]} ${MINUS} ${VK} = ${rr}`)}, ${VK} = ${kk}이다.`,
        facts: { calc: [[`${cE(c, rr, i)}*${cE(c, rr, i)}`, 0]], derived: [2] }
      });
    }, { count: 2 }),
    T('touch-axis-chord', '구가 좌표축과 만나는 두 점과 중심이 만드는 삼각형', '②12', (d) => {
      const i = d.int(0, 2), [j, k] = [0, 1, 2].filter((x) => x !== i), c = [0, 0, 0];
      const zeroOne = d.bool();
      let dd;
      if (zeroOne) { c[j] = 0; c[k] = nz(d, -6, 6); dd = Math.abs(c[k]); }
      else { const [p, q, h0] = d.pick(PYTH); c[j] = p * pm(d); c[k] = q * pm(d); dd = h0; if (dd > 10) return null; }
      c[i] = d.int(-4, 4);
      const h = d.int(2, 8), r2 = dd * dd + h * h, list = vecs(r2, 9);
      if (!list.length) return null;
      const v = d.pick(list), p = add3(c, v);
      if (!inBox([p], 12) || v.filter((x) => x === 0).length > 1) return null;
      const dE = `(${jn(c[j])}*${jn(c[j])}+${jn(c[k])}*${jn(c[k])})`;
      return N(`중심이 ${P3('C', c)}이고 점 ${jh(pt3(p), '을/를')} 지나는 구가 ${axisH(i)}과 만나는 두 점을 A, B라 할 때, 삼각형 CAB의 넓이는?`, h * dd, {
        explain: `반지름의 길이의 제곱은 ${nb(`${V_('r')}${sup(2)} = ${r2}`)}이다. 중심 C에서 ${axisH(i)}까지의 거리는 ${rt(`${sq2(c[j])} + ${sq2(c[k])}`)} = ${dd}이므로 ${nb(`(${frac(SG('AB'), 2)})${sup(2)} = ${r2} ${MINUS} ${dd * dd} = ${h * h}`)}, ${nb(`${SG('AB')} = ${2 * h}`)}이다. 넓이는 ${frac(1, 2)} × ${2 * h} × ${dd} = ${h * dd}이다.`,
        facts: { calc: [[`((${d2e(c, p)})-${dE})**0.5*${dE}**0.5`, 0]], derived: [0.5] }
      });
    }),
    T('touch-chord-r', '좌표축 위의 현의 길이로 구의 반지름 구하기', '②13', (d) => {
      const i = d.int(0, 2), [j, k] = [0, 1, 2].filter((x) => x !== i), [a, b, h, r] = d.pick(QUAD), c = [0, 0, 0];
      c[i] = d.int(-5, 5); c[j] = a * pm(d); c[k] = b * pm(d);
      return N(`중심이 ${P3('C', c)}인 구가 ${axisH(i)}과 만나는 두 점 사이의 거리가 ${2 * h}일 때, 구의 반지름의 길이는?`, r, {
        explain: `중심에서 ${axisH(i)}까지의 거리는 ${rt(`${sq2(c[j])} + ${sq2(c[k])}`)}이고, ${axisH(i)} 위의 두 점 사이의 거리의 절반은 ${h}이다. 피타고라스 정리에 의하여 반지름의 길이는 ${rt(`${sq2(c[j])} + ${sq2(c[k])} + ${h}${sup(2)}`)} = ${r}이다.`,
        facts: { calc: [[`(${jn(c[j])}*${jn(c[j])}+${jn(c[k])}*${jn(c[k])}+(${2 * h}/2)*(${2 * h}/2))**0.5`, 0]], derived: [2, 0.5] }
      });
    }),
    T('touch-section', '구와 좌표평면이 만나서 생기는 원의 넓이', '②14', (d, n) => {
      const i = d.int(0, 2);
      if (n === 0) {
        const c = rnd3(d, -5, 5), r = d.int(2, 8);
        if (Math.abs(c[i]) >= r || c[i] === 0) return null;
        const kk = r * r - c[i] * c[i];
        return N(`구 ${jh(sphH(c, r * r), '이/가')} ${jh(planeH(i), '과/와')} 만나서 생기는 원의 넓이가 ${VK}π일 때, 상수 ${VK}의 값은?`, kk, {
          explain: `중심 ${pt3(c)}에서 ${planeH(i)}까지의 거리는 ${Math.abs(c[i])}이고 반지름의 길이는 ${r}이므로, 단면인 원의 반지름의 길이의 제곱은 ${nb(`${r * r} ${MINUS} ${c[i] * c[i]} = ${kk}`)}이다. 따라서 넓이는 ${kk === 1 ? '' : kk}π이다.`,
          facts: { calc: [[`${r * r}-${jn(c[i])}*${jn(c[i])}`, 0]] }
        });
      }
      const c = rnd3(d, -4, 4), w = rnd3(d, -3, 3), A = sub3(c, w), Bq = add3(c, w), r2 = n2of(w);
      if (Math.abs(c[i]) * Math.abs(c[i]) >= r2 || w.filter((v) => v === 0).length > 1 || !inBox([A, Bq], 9)) return null;
      const kk = r2 - c[i] * c[i];
      return N(`두 점 ${pt3(A)}, ${jh(pt3(Bq), '을/를')} 지름의 양 끝점으로 하는 구가 ${jh(planeH(i), '과/와')} 만나서 생기는 원의 넓이가 ${VK}π일 때, 상수 ${VK}의 값은?`, kk, {
        explain: `구의 중심은 두 점의 중점 ${pt3(c)}이고 반지름의 길이의 제곱은 ${frac(d2(A, Bq), 4)} = ${r2}이다. 중심에서 ${planeH(i)}까지의 거리는 ${Math.abs(c[i])}이므로 단면인 원의 반지름의 길이의 제곱은 ${nb(`${r2} ${MINUS} ${c[i] * c[i]} = ${kk}`)}이고, 넓이는 ${kk === 1 ? '' : kk}π이다.`,
        facts: { calc: [[`(${d2e(A, Bq)})/4-((${jn(A[i])}+${jn(Bq[i])})/2)*((${jn(A[i])}+${jn(Bq[i])})/2)`, 0]], derived: [2, 4] }
      });
    }, { count: 2 }),
    T('touch-cone', '구의 단면을 밑면으로 하고 구에 내접하는 원뿔의 부피', '②15', (d) => {
      const i = d.int(0, 2), c = rnd3(d, -5, 5), r = d.int(3, 9), h0 = Math.abs(c[i]);
      if (h0 === 0 || h0 >= r) return null;
      const base = r * r - h0 * h0, H = r + h0, vol = base * H;
      if (vol % 3 !== 0) return null;
      const kk = vol / 3;
      return N(`구 ${jh(genH(c, r * r), '이/가')} ${planeH(i)}에 의하여 잘린 단면을 밑면으로 하고 구에 내접하는 원뿔 가운데 높이가 더 높은 것의 부피가 ${VK}π일 때, 상수 ${VK}의 값은?`, kk, {
        explain: `${toStd(c, r * r)}이므로 중심은 ${pt3(c)}, 반지름의 길이는 ${r}이다. 중심에서 ${planeH(i)}까지의 거리는 ${h0}이므로 단면의 반지름의 길이의 제곱은 ${nb(`${r * r} ${MINUS} ${h0 * h0} = ${base}`)}이다. 원뿔의 꼭짓점은 단면에서 먼 쪽 끝에 있어 높이는 ${nb(`${r} + ${h0} = ${H}`)}이고, 부피는 ${frac(1, 3)} × ${base}π × ${H} = ${kk}π이다.`,
        facts: { calc: [[`(${kE(c, r * r)}-${cE(c, r * r, i)}*${cE(c, r * r, i)})*(${kE(c, r * r)}**0.5+(${cE(c, r * r, i)}*${cE(c, r * r, i)})**0.5)/3`, 0]], derived: [2, 3, 4, 0.5] }
      });
    }),
    T('touch-proj', '구의 정사영(원)이 직선에 접할 조건', '②17', (d) => {
      const r = d.int(1, 4), u = r * pm(d), v = nz(d, -6, 6), w = d.int(-6, 6), c = [u, v, w], q = Q(v * v - r * r, 2 * u * v);
      if (q.q === 1 || v * v === r * r || coefOf(c, r * r).D === 0) return null;
      const uE = cE(c, r * r, 0), vE = cE(c, r * r, 1);
      return qAns(`구 ${genH(c, r * r)}의 ${planeH(2)} 위로의 정사영이 직선 ${nb(`${Y} = ${VK}${X}`)}에 접할 때, 상수 ${VK}의 값은?`, q, {
        signed: true,
        explain: `${toStd(c, r * r)}이므로 구의 중심은 ${pt3(c)}, 반지름의 길이는 ${r}이다. ${planeH(2)} 위로의 정사영은 중심이 ${nb(`(${iq(u)}, ${iq(v)})`)}이고 반지름의 길이가 ${r}인 원이다. 원의 중심에서 직선 ${nb(`${VK}${X} ${MINUS} ${Y} = 0`)}까지의 거리가 ${r}이므로 ${nb(`${frac(`|${iq(u)}${VK} ${MINUS} ${par(v)}|`, rt(`${VK}${sup(2)} + 1`))} = ${r}`)}이고, 양변을 제곱하여 정리하면 ${nb(`${VK} = ${tx(q)}`)}이다.`,
        facts: { value: `(${vE}*${vE}-${uE}*${uE})/(2*${uE}*${vE})`, derived: [2] }
      });
    })
  ];

  // ═══ 바. 구와 거리 — 접선·최대·최소 ═══
  const far = [
    T('far-tangent', '구 밖의 점에서 그은 접선의 길이', '②18', (d) => {
      const c = rnd3(d, -4, 4), r = d.int(1, 5), A = rnd3(d, -6, 6), t2 = d2(A, c) - r * r, [a, b] = sqParts(Math.max(t2, 1));
      if (t2 <= 0 || a < 2 || b < 2 || coefOf(c, r * r).D === 0) return null;
      const e = `${[0, 1, 2].map((i) => `(${jn(A[i])}-${cE(c, r * r, i)})*(${jn(A[i])}-${cE(c, r * r, i)})`).join('+')}-${kE(c, r * r)}`;
      return lenAns(`점 ${jh(P3('A', A), '을/를')} 지나는 직선이 구 ${genH(c, r * r)} 위의 점 P에서 접할 때, 선분 AP의 길이는?`, t2, e, {
        explain: `${toStd(c, r * r)}이므로 중심 C${pt3(c)}, 반지름의 길이는 ${r}이다. ${nb(`${SG('AC')}${sup(2)} = ${d2(A, c)}`)}이고 접점에서 반지름은 접선에 수직이므로 직각삼각형 ACP에서 ${SG('AP')} = ${rt(`${d2(A, c)} ${MINUS} ${r * r}`)} = ${radText(a, b)}이다.`,
        facts: { derived: [2, 4] }
      });
    }),
    T('far-sphere-point', '구 위의 점과 한 점 사이의 거리의 최댓값과 최솟값', '②19', (d) => {
      const useO = d.bool(), Pq = useO ? [0, 0, 0] : rnd3(d, -4, 4), { p: c, dd } = atDist(d, Pq), r = d.int(1, dd - 1);
      if (!inBox([c], 10) || coefOf(c, r * r).D === 0) return null;
      const dE = `(${[0, 1, 2].map((i) => `(${cE(c, r * r, i)}-${jn(Pq[i])})*(${cE(c, r * r, i)}-${jn(Pq[i])})`).join('+')})**0.5`, rE = `${kE(c, r * r)}**0.5`;
      return maxMin(`구 ${genH(c, r * r)} 위의 점 P와 ${useO ? '원점 O' : '점 ' + P3('A', Pq)} 사이의 거리의 최댓값과 최솟값은?`, dd + r, dd - r, {
        explain: `${toStd(c, r * r)}이므로 중심 C${pt3(c)}, 반지름의 길이는 ${r}이다. ${useO ? 'O' : 'A'}에서 중심까지의 거리는 ${dd}이므로 최댓값은 ${nb(`${dd} + ${r} = ${dd + r}`)}, 최솟값은 ${nb(`${dd} ${MINUS} ${r} = ${dd - r}`)}이다.`,
        facts: { calc: [[`${dE}+${rE}`, 0], [`${dE}-${rE}`, 1]], derived: [2, 4, 0.5] }
      });
    }),
    T('far-two-spheres', '두 구 위의 점 사이의 거리의 최댓값과 최솟값', '②20', (d) => {
      const c1 = rnd3(d, -4, 4), { p: c2, dd } = atDist(d, c1), r1 = d.int(1, 4), r2 = d.int(1, 4);
      if (r1 + r2 >= dd || !inBox([c2], 10) || coefOf(c1, r1 * r1).D === 0 || coefOf(c2, r2 * r2).D === 0) return null;
      const dE = `(${[0, 1, 2].map((i) => `(${cE(c2, r2 * r2, i)}-${cE(c1, r1 * r1, i)})*(${cE(c2, r2 * r2, i)}-${cE(c1, r1 * r1, i)})`).join('+')})**0.5`, rs = `${kE(c1, r1 * r1)}**0.5+${kE(c2, r2 * r2)}**0.5`;
      return maxMin(`구 ${genH(c1, r1 * r1)} 위의 점 P와 구 ${genH(c2, r2 * r2)} 위의 점 Q에 대하여 선분 PQ의 길이의 최댓값과 최솟값은?`, dd + r1 + r2, dd - r1 - r2, {
        explain: `두 방정식을 고치면 중심은 ${pt3(c1)}, ${pt3(c2)}이고 반지름의 길이는 ${r1}, ${r2}이다. 중심 사이의 거리는 ${K.nj(dd, '으로/로')} 두 반지름의 합보다 크므로 두 구는 떨어져 있다. 최댓값은 ${nb(`${dd} + ${r1} + ${r2} = ${dd + r1 + r2}`)}, 최솟값은 ${nb(`${dd} ${MINUS} ${r1} ${MINUS} ${r2} = ${dd - r1 - r2}`)}이다.`,
        facts: { calc: [[`${dE}+${rs}`, 0], [`${dE}-(${rs})`, 1]], derived: [2, 4, 0.5] }
      });
    }),
    T('far-circle-point', '좌표평면 위의 원 위의 점과 공간의 한 점 사이의 거리', '②21', (d, n) => {
      if (n < 2) {
        // xy평면 위의 원 (x − p)² + (y − q)² = ρ² 와 z축 위의 점 A(0, 0, h)
        const [s1, s2, oc] = d.pick([[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13], [0, 5, 5], [4, 0, 4], [0, 6, 6]]), p = s1 * pm(d), q = s2 * pm(d);
        const [far1, h, ans] = d.pick(PYTH), rho = n === 0 ? far1 - oc : oc - far1;
        if (rho < 1 || (n === 1 && oc - rho <= 0)) return null;
        const circle = nb(`${term(X, p)} + ${term(Y, q)} = ${rho * rho}`);
        const ocE = `(${jn(p)}*${jn(p)}+${jn(q)}*${jn(q)})**0.5`, rhoE = `${rho * rho}**0.5`;
        return N(`${planeH(2)} 위의 원 ${circle} 위를 움직이는 점 P와 점 ${P3('A', [0, 0, h])}에 대하여 선분 AP의 길이의 ${n === 0 ? '최댓값' : '최솟값'}은?`, ans, {
          explain: `점 A의 ${planeH(2)} 위로의 정사영은 원점 O이다. O에서 원의 중심 ${nb(`(${iq(p)}, ${iq(q)})`)}까지의 거리는 ${oc}이고 원의 반지름의 길이는 ${rho}이므로, 원 위의 점 P에 대하여 ${SG('OP')}의 ${n === 0 ? '최댓값은 ' + nb(`${oc} + ${rho} = ${far1}`) : '최솟값은 ' + nb(`${oc} ${MINUS} ${rho} = ${far1}`)}이다. ${nb(`${SG('AP')}${sup(2)} = ${SG('OP')}${sup(2)} + ${h}${sup(2)}`)}이므로 구하는 값은 ${rt(`${far1}${sup(2)} + ${h}${sup(2)}`)} = ${ans}이다.`,
          facts: { calc: [[`((${ocE}${n === 0 ? '+' : '-'}${rhoE})*(${ocE}${n === 0 ? '+' : '-'}${rhoE})+${h}*${h})**0.5`, 0]], derived: [0.5] }
        });
      }
      // 구가 xy평면과 만나서 생기는 원 위의 점과 공간의 점 Q 사이의 거리의 최댓값
      const [rho, cz, R] = d.pick([[3, 4, 5], [4, 3, 5], [5, 12, 13], [6, 8, 10], [8, 6, 10], [12, 5, 13]]), [s1, s2, t] = d.pick([[3, 4, 5], [4, 3, 5], [0, 4, 4], [5, 0, 5], [6, 8, 10], [0, 3, 3]]);
      const far1 = t + rho, z0 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 16, 20, 21, 24].find((z) => isSq(far1 * far1 + z * z)) || 0;
      if (!z0) return null;
      const ans = Math.sqrt(far1 * far1 + z0 * z0);
      const c = [d.int(-4, 4), d.int(-4, 4), cz * pm(d)], Qp = [c[0] + s1 * pm(d), c[1] + s2 * pm(d), z0 * pm(d)];
      const tE = `((${jn(Qp[0])}-${jn(c[0])})*(${jn(Qp[0])}-${jn(c[0])})+(${jn(Qp[1])}-${jn(c[1])})*(${jn(Qp[1])}-${jn(c[1])}))**0.5`, rhoE = `(${R * R}-${jn(c[2])}*${jn(c[2])})**0.5`;
      return N(`구 ${jh(sphH(c, R * R), '이/가')} ${planeH(2)}과 만나서 생기는 원 위의 점 P와 점 ${P3('Q', Qp)} 사이의 거리의 최댓값은?`, ans, {
        explain: `${Z} = 0을 넣으면 단면은 중심이 ${nb(`(${iq(c[0])}, ${iq(c[1])}, 0)`)}이고 반지름의 길이가 ${rt(`${R * R} ${MINUS} ${c[2] * c[2]}`)} = ${rho}인 원이다. 점 Q의 ${planeH(2)} 위로의 정사영 Q′${pt3([Qp[0], Qp[1], 0])}에서 원의 중심까지의 거리는 ${t}이므로 원 위에서 Q′과 가장 먼 점까지의 거리는 ${nb(`${t} + ${rho} = ${far1}`)}이다. 최댓값은 ${rt(`${far1}${sup(2)} + ${Math.abs(Qp[2])}${sup(2)}`)} = ${ans}이다.`,
        facts: { calc: [[`((${tE}+${rhoE})*(${tE}+${rhoE})+${jn(Qp[2])}*${jn(Qp[2])})**0.5`, 0]], derived: [0.5] }
      });
    }, { count: 3 })
  ];

  // 글자 도우미(이 파일 안에서만): 기울인 문자
  function V_(ch) { return B.kit.mid.V(ch); }
  function gcdN(a, b) { return B.kit.mid.gcd(Math.abs(a), Math.abs(b)) || 1; }

  B.addTypes('11-4-5', 'sphere', sphere);
  B.addTypes('11-4-5', 'touch', touch);
  B.addTypes('11-4-5', 'far', far);
})(typeof window !== 'undefined' ? window : globalThis);
