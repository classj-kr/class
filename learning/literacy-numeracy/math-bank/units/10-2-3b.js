// 10-2-3 도형의 이동 — 뒤쪽 묶음(점의 대칭이동, 도형의 대칭이동, 평행이동과 대칭이동을 잇기, 대칭이동을 이용한 최단 거리).
// 틀과 이 단원의 도구는 10-2-3a.js(B.kit.m1023)에 있다. 싣는 기준과 뺀 것도 그 파일 머리에 모아 적었다.
// 대칭이동은 원점, x축, y축, 직선 y = x 넷만 다룬다(성취기준). 최단 거리는 좌표축이나 직선 y = x 위의 점을 거치는 길만 다룬다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { lines, N, M, C, inline } = B.kit;
  const { MINUS, gcd, Q, tx, nb, V, sup, poly, pointAns, plane, rt, sqParts, radText, radAns, ansV, claimQ, SG } = B.kit.mid;
  const {
    UNIT, S07, srcOf, retry, X, Y, XA, YA, X2, Y2, VA, VB, VK, VM, VR, sn, par, J, pt, jw, minus, sq, circ, gcirc, gline, sline, mv, subMove,
    MNAME, MIRROR, subMirror, MIRROR_E, lineMove, LINE_MIRROR, toSlope, nz, pm, isSq, lineAns, circAns, vals, two, rad, ptsFig
  } = B.kit.m1023;
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: srcOf(ref), make: retry(make) }, more || {});
  const KEYS = ['x', 'y', 'o', 'd'];
  // 점 (x, y)를 대칭이동한 점의 꼴
  const RULE = { x: nb(`(${X}, ${MINUS}${Y})`), y: nb(`(${MINUS}${X}, ${Y})`), o: nb(`(${MINUS}${X}, ${MINUS}${Y})`), d: nb(`(${Y}, ${X})`) };
  // 이동 하나: { t: 'm', k } 대칭이동, { t: 't', a, b } 평행이동
  const say = (op) => (op.t === 'm' ? `${MNAME[op.k]}에 대하여 대칭이동한` : `${mv(op.a, op.b)} 평행이동한`);
  const movePt = (op, P) => (op.t === 'm' ? MIRROR[op.k](P) : [P[0] + op.a, P[1] + op.b]);
  const backPt = (op, P) => (op.t === 'm' ? MIRROR[op.k](P) : [P[0] - op.a, P[1] - op.b]);
  // 검사 식으로 적은 좌표에 이동을 거꾸로 한다(글에 적힌 수로 셈하게)
  const backE = (op, P) => (op.t === 'm' ? MIRROR_E[op.k](P) : [`(${P[0]}-${J(op.a)})`, `(${P[1]}-${J(op.b)})`]);
  const fwdE = (op, P) => (op.t === 'm' ? MIRROR_E[op.k](P) : [`(${P[0]}+${J(op.a)})`, `(${P[1]}+${J(op.b)})`]);
  const moveLine = (op, L) => (op.t === 'm' ? LINE_MIRROR[op.k](L) : lineMove(L, op.a, op.b));
  const moveCirc = (op, [p, q, r2]) => movePt(op, [p, q]).concat([r2]);
  // 검사 식으로 적은 직선 [A, B, C](Ax + By + C = 0)의 이동
  const LINE_MIRROR_E = { x: ([a, b, c]) => [a, `(0-${b})`, c], y: ([a, b, c]) => [`(0-${a})`, b, c], o: ([a, b, c]) => [`(0-${a})`, `(0-${b})`, c], d: ([a, b, c]) => [b, a, c] };
  const moveLineE = (op, L) => (op.t === 'm' ? LINE_MIRROR_E[op.k](L) : [L[0], L[1], `(${L[2]}-${L[0]}*${J(op.a)}-${L[1]}*${J(op.b)})`]);
  // 이동 둘을 고른다: 평행이동 → 대칭이동, 대칭이동 → 평행이동, 대칭이동 → 대칭이동 가운데 하나
  function twoOps(d, keys) {
    const ks = keys || KEYS, m1 = { t: 'm', k: d.pick(ks) }, tr = { t: 't', a: nz(d, -4, 4), b: nz(d, -4, 4) }, kind = d.int(0, 2);
    if (kind === 0) return [tr, m1];
    if (kind === 1) return [m1, tr];
    const k2 = d.pick(ks.filter((k) => k !== m1.k));
    return [m1, { t: 'm', k: k2 }];
  }

  // ── 라. 점의 대칭이동 ──
  const smoveTypes = [
    T('smove-point', '점을 x축·y축·원점·직선 y = x에 대하여 대칭이동한 점', '②1', (d, n) => {
      const k = n === 0 ? d.pick(['x', 'y', 'o']) : 'd', x = nz(d, -7, 7), y = nz(d, -7, 7);
      if (k === 'd' && x === y) return null;
      const [u, v] = MIRROR[k]([x, y]), [eu, ev] = MIRROR_E[k]([J(x), J(y)]);
      return pointAns(`점 ${jw(pt(x, y), '을/를')} ${MNAME[k]}에 대하여 대칭이동한 점의 좌표는?`, u, v, {
        explain: `점 (${X}, ${Y})를 ${MNAME[k]}에 대하여 대칭이동한 점은 ${RULE[k]}이므로 ${pt(u, v)}이다.`,
        facts: { calc: [[eu, 0], [ev, 1]] }
      });
    }, { count: 2 }),
    T('smove-online', '대칭이동한 점이 직선 위에 있을 조건', '②2', (d) => {
      const k = d.pick(KEYS), x = nz(d, -6, 6), y = nz(d, -6, 6), m = nz(d, -3, 3), [u, v] = MIRROR[k]([x, y]), c = v - m * u, [eu, ev] = MIRROR_E[k]([J(x), J(y)]);
      if (c === 0 || (k === 'd' && x === y)) return null;
      return N(`점 ${jw(pt(x, y), '을/를')} ${MNAME[k]}에 대하여 대칭이동한 점이 직선 ${nb(`${Y} = ${poly([[m, X]])} + ${VK}`)} 위에 있을 때, 상수 ${VK}의 값은?`, c, {
        signed: true,
        explain: `대칭이동한 점은 ${pt(u, v)}이므로 ${nb(`${sn(v)} = ${poly([[m * u, '']]) === '0' ? '0' : sn(m * u)} + ${VK}`)}에서 ${nb(`${VK} = ${sn(c)}`)}이다.`,
        facts: { calc: [[`${ev}-${J(m)}*${eu}`, 0]] }
      });
    }),
    T('smove-area', '대칭이동한 점들을 꼭짓점으로 하는 삼각형의 넓이', '②3', (d) => {
      const a = nz(d, -6, 6), b = nz(d, -6, 6), S = 2 * Math.abs(a * b);
      return N(`점 ${jw(pt(a, b), '을/를')} ${XA}, ${YA}, 원점에 대하여 대칭이동한 점을 각각 A, B, C라 할 때, 삼각형 ABC의 넓이는?`, S, {
        explain: `A${pt(a, -b)}, B${pt(-a, b)}, C${pt(-a, -b)}이다. 삼각형 ABC는 ∠C = 90°인 직각삼각형이고 두 변의 길이가 ${2 * Math.abs(a)}, ${String(2 * Math.abs(b))}이므로 넓이는 ${nb(`${2 * Math.abs(a)} × ${2 * Math.abs(b)} ÷ 2 = ${S}`)}이다.`,
        facts: { calc: [[`2*${Math.abs(a)}*${Math.abs(b)}`, 0]], derived: [2] }
      });
    }),
    T('smove-centroid', '대칭이동한 점들로 만든 삼각형의 무게중심', '②4', (d) => {
      const [k1, k2] = d.shuffle(KEYS).slice(0, 2), x = nz(d, -6, 6), y = nz(d, -6, 6), P = [x, y], Qp = MIRROR[k1](P), R = MIRROR[k2](P);
      const sx = x + Qp[0] + R[0], sy = y + Qp[1] + R[1], area2 = (Qp[0] - x) * (R[1] - y) - (R[0] - x) * (Qp[1] - y);
      if (sx % 3 !== 0 || sy % 3 !== 0 || area2 === 0) return null;
      const [eq0, eq1] = MIRROR_E[k1]([J(x), J(y)]), [er0, er1] = MIRROR_E[k2]([J(x), J(y)]);
      return pointAns(`점 P${jw(pt(x, y), '을/를')} ${MNAME[k1]}에 대하여 대칭이동한 점을 Q, ${MNAME[k2]}에 대하여 대칭이동한 점을 R라 할 때, 삼각형 PQR의 무게중심의 좌표는?`, sx / 3, sy / 3, {
        explain: `Q${pt(Qp[0], Qp[1])}, R${pt(R[0], R[1])}이므로 무게중심은 ${nb(`(${sn(sx)} ÷ 3, ${sn(sy)} ÷ 3)`)}, 곧 ${pt(sx / 3, sy / 3)}이다.`,
        facts: { calc: [[`(${J(x)}+${eq0}+${er0})/3`, 0], [`(${J(y)}+${eq1}+${er1})/3`, 1]], derived: [3] }
      });
    }),
    T('smove-twice', '두 번 대칭이동한 점', '②5', (d) => {
      const [k1, k2] = d.shuffle(KEYS).slice(0, 2), x = nz(d, -7, 7), y = nz(d, -7, 7);
      if (x === y || x === -y) return null;
      const P1 = MIRROR[k1]([x, y]), P2 = MIRROR[k2](P1), E = MIRROR_E[k2](MIRROR_E[k1]([J(x), J(y)]));
      return pointAns(`점 ${jw(pt(x, y), '을/를')} ${MNAME[k1]}에 대하여 대칭이동한 다음 ${MNAME[k2]}에 대하여 대칭이동한 점의 좌표는?`, P2[0], P2[1], {
        explain: `${MNAME[k1]}에 대하여 대칭이동하면 ${pt(P1[0], P1[1])}이고, 이 점을 ${MNAME[k2]}에 대하여 대칭이동하면 ${pt(P2[0], P2[1])}이다.`,
        facts: { calc: [[E[0], 0], [E[1], 1]] }
      });
    }),
    T('smove-twice-letter', '두 번 대칭이동한 점이 문자로 준 점과 같을 때 직선의 y절편', '②6', (d) => {
      const [k1, k2] = d.pick([['x', 'd'], ['y', 'd'], ['o', 'd'], ['d', 'x'], ['d', 'y'], ['d', 'o']]), a = nz(d, -5, 5), s = nz(d, -5, 5);
      const [b, t] = MIRROR[k2](MIRROR[k1]([a, s]));
      if (a === b || s === t) return null;
      const num = s * b - a * t, den = b - a, v = Q(num, den);
      if (v.q === 1 || v.q > 12 || Math.abs(v.p) > 60) return null;
      const sa = a / t, sb = b / s, Ja = sa > 0 ? J(t) : `(0-${J(t)})`, Jb = sb > 0 ? J(s) : `(0-${J(s)})`;
      return ansV(`점 ${jw(nb(`A(${VA}, ${sn(s)})`), '을/를')} ${MNAME[k1]}에 대하여 대칭이동한 다음 ${MNAME[k2]}에 대하여 대칭이동한 점이 ${nb(`B(${VB}, ${sn(t)})`)}일 때, 직선 AB의 ${Y}절편은? (단, ${VA}, ${VB}는 상수이다.)`, v, 'frac', {
        explain: `A를 차례로 대칭이동한 점은 ${nb(`(${sn(sb * s)}, ${sa > 0 ? VA : MINUS + VA})`)}이고, 이것이 ${jw(nb(`B(${VB}, ${sn(t)})`), '과/와')} 같으므로 ${nb(`${VA} = ${sn(a)}`)}, ${nb(`${VB} = ${sn(b)}`)}이다. 두 점 A${pt(a, s)}, B${jw(pt(b, t), '을/를')} 지나는 직선의 ${Y}절편은 ${tx(v)}이다.`,
        facts: { value: `(${J(s)}*${Jb}-${Ja}*${J(t)})/(${Jb}-${Ja})` }
      });
    }),
    T('smove-twice-circle', '두 번 대칭이동한 점을 중심으로 하는 원이 처음 점을 지날 때', '②7', (d) => {
      const [k1, k2] = d.pick([['x', 'd'], ['y', 'd'], ['o', 'd'], ['d', 'x'], ['d', 'y'], ['d', 'o']]), s = nz(d, -5, 5), a = d.int(2, 8);
      const F = (aa) => MIRROR[k2](MIRROR[k1]([aa, s])), f = (aa) => { const [u, v] = F(aa); return (aa - u) ** 2 + (s - v) ** 2; };
      const R2 = f(a), al = (f(1) + f(-1)) / 2 - f(0), be = (f(1) - f(-1)) / 2, ga = f(0);
      if (al <= 0 || R2 < 2 || R2 > 200) return null;
      const other = (ga - R2) / (al * a);
      if (other > 0) return null;
      const [bu, bv] = F(a);
      return N(`점 ${jw(nb(`A(${VA}, ${sn(s)})`), '을/를')} ${MNAME[k1]}에 대하여 대칭이동한 다음 ${MNAME[k2]}에 대하여 대칭이동한 점을 B라 하자. 중심이 B이고 반지름의 길이가 ${rad(R2)}인 원이 점 A를 지날 때, 양수 ${VA}의 값은?`, a, {
        explain: `B의 좌표를 ${VA}로 나타내어 ${jw(nb(`AB${sup(2)} = ${R2}`), '으로/로')} 놓으면 ${VA}에 대한 이차방정식이 되고, 그 해는 ${nb(`${VA} = ${a}`)} 또는 ${nb(`${VA} = ${tx(Q(ga - R2, al * a))}`)}이다. 양수인 것은 ${a}이다(이때 B${pt(bu, bv)}).`,
        facts: { calc: [[`${a}`, 0]], derived: [a] }
      });
    })
  ];

  // ── 마. 도형의 대칭이동 ──
  const sfigTypes = [
    T('sfig-line', '직선을 대칭이동한 직선의 방정식', '②9', (d, n) => {
      if (n === 0) {
        const k = d.pick(['x', 'y', 'o']), m = pm(d) * d.int(2, 4), c = nz(d, -7, 7), res = { x: [-m, -c], y: [-m, c], o: [m, -c] }[k];
        const subst = { x: nb(`${MINUS}${Y} = ${poly([[m, X], [c, '']])}`), y: nb(`${Y} = ${sn(m)}(${MINUS}${X}) ${c < 0 ? MINUS : '+'} ${Math.abs(c)}`), o: nb(`${MINUS}${Y} = ${sn(m)}(${MINUS}${X}) ${c < 0 ? MINUS : '+'} ${Math.abs(c)}`) }[k];
        return lineAns(`직선 ${jw(sline(m, c), '을/를')} ${MNAME[k]}에 대하여 대칭이동한 직선의 방정식을 구하시오.`, res[0], res[1], {
          explain: `${subMirror[k]} ${subst}, 곧 ${sline(res[0], res[1])}이다.`,
          facts: { calc: k === 'x' ? [[`0-${J(m)}`, 0], [`0-${J(c)}`, 1]] : k === 'y' ? [[`0-${J(m)}`, 0], [`${J(c)}`, 1]] : [[`${J(m)}`, 0], [`0-${J(c)}`, 1]] }
        });
      }
      const q = pm(d) * d.int(2, 4), c = nz(d, -7, 7);
      return lineAns(`직선 ${jw(gline([1, q, c]), '을/를')} 직선 ${nb(`${Y} = ${X}`)}에 대하여 대칭이동한 직선의 방정식을 구하시오.`, -q, -c, {
        explain: `${subMirror.d} ${nb(poly([[1, Y], [q, X], [c, '']]) + ' = 0')}, 곧 ${sline(-q, -c)}이다.`,
        facts: { calc: [[`0-${J(q)}`, 0], [`0-${J(c)}`, 1]] }
      });
    }, { count: 2 }),
    T('sfig-circle', '원을 대칭이동한 원의 방정식', '②10', (d) => {
      const k = d.pick(KEYS), p = nz(d, -6, 6), q = nz(d, -6, 6), r2 = d.int(1, 20), [u, v] = MIRROR[k]([p, q]), [eu, ev] = MIRROR_E[k]([J(p), J(q)]);
      if (p === q && k === 'd') return null;
      return circAns(`원 ${jw(circ(p, q, r2), '을/를')} ${MNAME[k]}에 대하여 대칭이동한 원의 방정식을 구하시오.`, u, v, r2, {
        explain: `${subMirror[k]} ${circ(u, v, r2)}이다. 중심 ${jw(pt(p, q), '이/가')} ${jw(pt(u, v), '으로/로')} 옮겨지고 반지름의 길이는 그대로이다.`,
        facts: { calc: [[`0-${eu}`, 0], [`0-${ev}`, 1], [`${r2}`, 2]] }
      });
    }),
    T('sfig-circle-gen', '일반형으로 준 원을 대칭이동한 원의 방정식', '②10', (d) => {
      const k = d.pick(KEYS), h = nz(d, -5, 5), k0 = nz(d, -5, 5), R = d.int(1, 6), Cc = h * h + k0 * k0 - R * R, [u, v] = MIRROR[k]([h, k0]);
      if (Cc === 0 || (h === k0 && k === 'd')) return null;
      const [eu, ev] = MIRROR_E[k]([`(${J(-2 * h)}/2)`, `(${J(-2 * k0)}/2)`].map((e) => `(0-${e})`));
      return circAns(`원 ${jw(gcirc(-2 * h, -2 * k0, Cc), '을/를')} ${MNAME[k]}에 대하여 대칭이동한 원의 방정식을 구하시오.`, u, v, R * R, {
        explain: `주어진 원은 ${circ(h, k0, R * R)}이다. 중심 ${jw(pt(h, k0), '을/를')} ${MNAME[k]}에 대하여 대칭이동하면 ${pt(u, v)}이므로 ${circ(u, v, R * R)}이다.`,
        facts: { calc: [[`0-${eu}`, 0], [`0-${ev}`, 1], [`${R}*${R}`, 2]], derived: [2, R] }
      });
    }),
    T('sfig-feature', '대칭이동한 직선의 절편, 원의 중심과 반지름', '②11', (d, n) => {
      if (n === 0) {
        const k = d.pick(['x', 'y', 'o']), a = d.int(1, 4), b = pm(d) * d.int(1, 4), L = a * Math.abs(b) / gcd(a, Math.abs(b)), c = nz(d, -3, 3) * L;
        if (gcd(gcd(a, Math.abs(b)), Math.abs(c)) !== 1 || Math.abs(c) > 24) return null;
        const [a2, b2] = LINE_MIRROR[k]([a, b, c]), xi = -c / a2 + 0, yi = -c / b2 + 0;
        return vals(`직선 ${jw(gline([a, b, c]), '을/를')} ${MNAME[k]}에 대하여 대칭이동한 직선의 ${X}절편과 ${Y}절편은?`, [[X + '절편', xi], [Y + '절편', yi]], {
          explain: `${subMirror[k]} ${gline([a2, b2, c])}이다. ${nb(`${Y} = 0`)}을 대입하면 ${nb(`${X} = ${sn(xi)}`)}, ${nb(`${X} = 0`)}을 대입하면 ${nb(`${Y} = ${sn(yi)}`)}이다.`,
          facts: { calc: [[`(0-${J(c)})/${J(a2)}`, 0], [`(0-${J(c)})/${J(b2)}`, 1]] }
        });
      }
      const k = d.pick(KEYS), h = nz(d, -5, 5), k0 = nz(d, -5, 5), R = d.int(2, 6), [u, v] = MIRROR[k]([h, k0]), [eu, ev] = MIRROR_E[k]([J(h), J(k0)]);
      if (h === k0 && k === 'd') return null;
      return inline(`원 ${jw(circ(h, k0, R * R), '을/를')} ${MNAME[k]}에 대하여 대칭이동한 원의 중심의 좌표와 반지름의 길이는?`, `중심: ({0}, {1}), 반지름의 길이: {2}`,
        [{ answer: u, signed: true }, { answer: v, signed: true }, { answer: R }], {
          shown: `중심 ${pt(u, v)}, 반지름의 길이 ${R}`,
          explain: `처음 원의 중심 ${jw(pt(h, k0), '을/를')} ${MNAME[k]}에 대하여 대칭이동하면 ${pt(u, v)}이고, 반지름의 길이는 그대로 ${R}이다.`,
          facts: { calc: [[eu, 0], [ev, 1], [`${R}`, 2]], derived: [R] }
        });
    }, { count: 2 }),
    T('sfig-slope', '직선 y = mx + n의 대칭이동과 기울기·y절편의 변화', '②12', (d) => {
      const m = pm(d) * d.int(2, 5), c = nz(d, -7, 7), line = sline(m, c);
      const S = (k, what, v) => `직선 ${jw(line, '을/를')} ${MNAME[k]}에 대하여 대칭이동한 직선의 ${what === 's' ? '기울기는' : Y + '절편은'} ${v}이다.`;
      const yes = [S('x', 's', sn(-m)), S('y', 's', sn(-m)), S('o', 's', sn(m)), S('d', 's', tx(Q(1, m))), S('x', 'i', sn(-c)), S('y', 'i', sn(c)), S('o', 'i', sn(-c))];
      const no = [
        [S('o', 's', sn(-m)), `원점에 대하여 대칭이동하면 기울기는 그대로 ${sn(m)}이다.`, yes[2]],
        [S('y', 's', sn(m)), `${YA}에 대하여 대칭이동하면 기울기는 ${sn(-m)}이다.`, yes[1]],
        [S('d', 's', sn(-m)), `직선 ${nb(`${Y} = ${X}`)}에 대하여 대칭이동하면 기울기는 역수 ${tx(Q(1, m))}이다.`, yes[3]],
        [S('x', 'i', sn(c)), `${XA}에 대하여 대칭이동하면 ${Y}절편은 ${sn(-c)}이다.`, yes[4]],
        [S('y', 'i', sn(-c)), `${YA}에 대하여 대칭이동하면 ${Y}절편은 그대로 ${sn(c)}이다.`, yes[5]],
        [S('o', 'i', sn(c)), `원점에 대하여 대칭이동하면 ${Y}절편은 ${sn(-c)}이다.`, yes[6]]
      ];
      return claimQ(d, '다음 중 옳은 것은?', yes, no, true);
    }),
    T('sfig-through', '대칭이동한 도형이 주어진 점을 지날 조건', '②14', (d, n) => {
      const k = d.pick(KEYS);
      if (n === 0) {
        const p = d.int(1, 5), q = pm(d) * d.int(1, 4), c = nz(d, -9, 9), s = nz(d, -5, 5), L2 = LINE_MIRROR[k]([p, q, c]);
        if (gcd(gcd(p, Math.abs(q)), Math.abs(c)) !== 1 || (L2[0] * s + c) % L2[1] !== 0) return null;
        const K = -(L2[0] * s + c) / L2[1] + 0;
        if (K === 0) return null;
        return N(`직선 ${jw(gline([p, q, c]), '을/를')} ${MNAME[k]}에 대하여 대칭이동한 직선이 점 ${jw(nb(`(${sn(s)}, ${VK})`), '을/를')} 지날 때, 상수 ${VK}의 값은?`, K, {
          signed: true,
          explain: `${subMirror[k]} ${gline(L2)}이다. 점 ${nb(`(${sn(s)}, ${VK})`)}를 대입하면 ${nb(`${VK} = ${sn(K)}`)}이다.`,
          facts: { calc: [[`(0-(${J(L2[0])}*${J(s)}+${J(c)}))/${J(L2[1])}`, 0]] }
        });
      }
      const h = nz(d, -5, 5), k0 = nz(d, -5, 5), s = nz(d, -6, 6), t = nz(d, -6, 6), [u, v] = MIRROR[k]([h, k0]), r2 = (s - u) ** 2 + (t - v) ** 2;
      if (r2 < 2 || sqParts(r2)[0] !== 1 || (s === h && t === k0)) return null;
      const [eu, ev] = MIRROR_E[k]([J(h), J(k0)]);
      return radAns(`중심이 ${pt(h, k0)}이고 반지름의 길이가 ${VR}인 원을 ${MNAME[k]}에 대하여 대칭이동하였더니 점 ${jw(pt(s, t), '을/를')} 지났다. ${VR}의 값은? (단, ${nb(`${VR} &gt; 0`)})`, 1, r2, {
        explain: `대칭이동한 원의 중심은 ${pt(u, v)}이고 반지름의 길이는 그대로 ${VR}이다. 이 원이 ${jw(pt(s, t), '을/를')} 지나므로 ${nb(`${VR}${sup(2)} = ${par(s - u)}${sup(2)} + ${par(t - v)}${sup(2)} = ${r2}`)}, 곧 ${nb(`${VR} = `)}${rt(r2)}이다.`,
        facts: { calc: [[`(${J(s)}-${eu})*(${J(s)}-${eu})+(${J(t)}-${ev})*(${J(t)}-${ev})`, 0]] }
      });
    }, { count: 2 }),
    T('sfig-center-line', '대칭이동한 원의 중심이 직선 위에 있을 조건', '②15', (d, n) => {
      if (n === 0) {
        const k = d.pick(KEYS), p = nz(d, -5, 5), q = nz(d, -5, 5), r2 = d.int(1, 16), m = nz(d, -3, 3), [u, v] = MIRROR[k]([p, q]), K = v - m * u, [eu, ev] = MIRROR_E[k]([J(p), J(q)]);
        if (K === 0 || (p === q && k === 'd')) return null;
        return N(`원 ${jw(circ(p, q, r2), '을/를')} ${MNAME[k]}에 대하여 대칭이동한 원의 중심이 직선 ${nb(`${Y} = ${poly([[m, X]])} + ${VK}`)} 위에 있을 때, 상수 ${VK}의 값은?`, K, {
          signed: true,
          explain: `대칭이동한 원의 중심은 ${pt(u, v)}이므로 ${nb(`${sn(v)} = ${sn(m * u)} + ${VK}`)}에서 ${nb(`${VK} = ${sn(K)}`)}이다.`,
          facts: { calc: [[`${ev}-${J(m)}*${eu}`, 0]] }
        });
      }
      // x² + y² + 2ax + By + C = 0 을 y = x 에 대하여 대칭이동: 중심 (−B/2, −a). 이 점과 원점을 지나는 직선의 기울기 2a/B
      const a = nz(d, -5, 5), Bh = nz(d, -4, 4), Bc = 2 * Bh, R = d.int(1, 3), Cc = a * a + Bh * Bh - R * R, g = Q(2 * a, Bc);
      if (Cc === 0 || Math.abs(Bh) === Math.abs(a)) return null;
      const gJ = g.p < 0 ? `(0-${Math.abs(g.p)}/${g.q})` : `(${g.p}/${g.q})`;
      return N(`원 ${nb(`${X2} + ${Y2} + 2${VA}${X} ${Bc < 0 ? MINUS : '+'} ${Math.abs(Bc)}${Y} ${Cc < 0 ? MINUS : '+'} ${Math.abs(Cc)} = 0`)}을 직선 ${nb(`${Y} = ${X}`)}에 대하여 대칭이동한 원의 중심과 원점을 지나는 직선의 기울기가 ${tx(g)}일 때, 상수 ${VA}의 값은?`, a, {
        signed: true,
        explain: `주어진 원은 ${nb(`(${X} + ${VA})${sup(2)} + ${sq(Y, -Bh)} = ${VA}${sup(2)}${Bh * Bh - Cc === 0 ? '' : ` ${Bh * Bh - Cc < 0 ? MINUS : '+'} ${Math.abs(Bh * Bh - Cc)}`}`)}이므로 중심이 ${nb(`(${MINUS}${VA}, ${sn(-Bh)})`)}이고, 대칭이동한 원의 중심은 ${nb(`(${sn(-Bh)}, ${MINUS}${VA})`)}이다. 원점과 이 점을 지나는 직선의 기울기는 ${nb(`${MINUS}${VA} ÷ ${par(-Bh)}`)}이므로 ${nb(`${VA} = ${sn(a)}`)}이다.`,
        facts: { calc: [[`${gJ}*${J(Bc)}/2`, 0]], derived: [2, g.q, Math.abs(g.p)] }
      });
    }, { count: 2 }),
    T('sfig-line-halve', '대칭이동한 직선이 원의 넓이를 이등분할 조건', '②16', (d) => {
      const k = d.pick(KEYS), p = d.int(1, 3), q = pm(d) * d.int(1, 3), c = nz(d, -9, 9), k0 = nz(d, -5, 5), r2 = d.int(1, 9), L2 = LINE_MIRROR[k]([p, q, c]);
      // 중심 (−a, k0)가 직선 L2 위: L2[0](−a) + L2[1]k0 + c = 0
      if ((L2[1] * k0 + c) % L2[0] !== 0 || gcd(gcd(p, Math.abs(q)), Math.abs(c)) !== 1) return null;
      const a = (L2[1] * k0 + c) / L2[0] + 0;
      if (a === 0) return null;
      return N(`직선 ${jw(gline([p, q, c]), '을/를')} ${MNAME[k]}에 대하여 대칭이동하였더니 원 ${nb(`(${X} + ${VA})${sup(2)} + ${sq(Y, k0)} = ${r2}`)}의 넓이를 이등분하였다. 상수 ${VA}의 값은?`, a, {
        signed: true,
        explain: `${subMirror[k]} ${gline(L2)}이다. 원의 넓이를 이등분하는 직선은 원의 중심 ${jw(nb(`(${MINUS}${VA}, ${sn(k0)})`), '을/를')} 지나므로 대입하면 ${nb(`${VA} = ${sn(a)}`)}이다.`,
        facts: { calc: [[`(${J(L2[1])}*${J(k0)}+${J(c)})/${J(L2[0])}`, 0]] }
      });
    }),
    T('sfig-tangent', '대칭이동한 직선이 원에 접할 조건', '②17', (d) => {
      const k = d.pick(['x', 'y', 'o']), [p, q] = d.pick([[3, 4], [4, 3], [3, -4], [4, -3]]), h = d.int(-4, 4), k0 = d.int(-4, 4), r = d.int(1, 3), L2 = LINE_MIRROR[k]([p, q, 0]);
      const S = L2[0] * h + L2[1] * k0, plus = -S + 5 * r, minusA = -S - 5 * r;
      if (!(plus > 0 && minusA < 0) || (h === 0 && k0 === 0)) return null;
      return N(`직선 ${nb(poly([[p, X], [q, Y]]) + ` + ${VA} = 0`)}을 ${MNAME[k]}에 대하여 대칭이동한 직선이 원 ${circ(h, k0, r * r)}에 접할 때, 양수 ${VA}의 값은?`, plus, {
        explain: `대칭이동한 직선은 ${nb(poly([[L2[0], X], [L2[1], Y]]) + ` + ${VA} = 0`)}이다. 원의 중심 ${jw(pt(h, k0), '과/와')} 이 직선 사이의 거리가 반지름의 길이 ${jw(String(r), '과/와')} 같아야 하므로 ${nb(`|${VA} ${S < 0 ? MINUS : '+'} ${Math.abs(S)}| ÷ 5 = ${r}`)}이다. ${nb(`${VA} = ${sn(minusA)}`)} 또는 ${nb(`${VA} = ${plus}`)} 가운데 양수는 ${plus}이다.`,
        facts: { calc: [[`0-(${J(L2[0])}*${J(h)}+${J(L2[1])}*${J(k0)})+5*${r}`, 0]], derived: [5, r] }
      });
    }),
    T('sfig-count', '대칭이동한 직선과 원의 위치 관계', '②18', (d) => {
      const [p, q] = d.pick([[3, 4], [4, 3], [3, -4], [4, -3]]), h = nz(d, -4, 4), k0 = nz(d, -4, 4), R = d.int(1, 4), want = d.int(0, 2);
      // y = x 대칭: px + qy + c = 0 → qx + py + c = 0. 중심까지의 거리 |qh + pk0 + c| / 5
      const base = q * h + p * k0, target = want === 1 ? 5 * R : want === 0 ? 5 * R - d.int(1, 5 * R - 1) : 5 * R + d.int(1, 6);
      const c = pm(d) * target - base, Cc = h * h + k0 * k0 - R * R;
      if (c === 0 || Cc === 0 || Math.abs(c) > 40) return null;
      const dist = Math.abs(q * h + p * k0 + c), ans = dist < 5 * R ? 0 : dist === 5 * R ? 1 : 2;
      const opts = ['서로 다른 두 점에서 만난다.', '한 점에서 만난다.', '만나지 않는다.'];
      return C(`직선 ${jw(gline([p, q, c]), '을/를')} 직선 ${nb(`${Y} = ${X}`)}에 대하여 대칭이동한 직선을 ${V('l')}이라 할 때, 직선 ${V('l')}과 원 ${gcirc(-2 * h, -2 * k0, Cc)}의 위치 관계로 옳은 것은?`, opts, ans, {
        explain: `직선 ${V('l')}은 ${gline([q, p, c])}이고, 원은 ${circ(h, k0, R * R)}이다. 중심 ${jw(pt(h, k0), '과/와')} 직선 ${V('l')} 사이의 거리는 ${nb(`${dist} ÷ 5`)}이고 반지름의 길이 ${dist < 5 * R ? R + '보다 작으므로 서로 다른 두 점에서 만난다' : dist === 5 * R ? jw(String(R), '과/와') + ' 같으므로 한 점에서 만난다(접한다)' : R + '보다 크므로 만나지 않는다'}.`,
        facts: { truth: opts.map((_, i) => i === ans), want: true }
      });
    }),
    T('sfig-bisect-two', '원과 그 대칭 원의 넓이를 동시에 이등분하는 직선', '②20', (d) => {
      const p = nz(d, -6, 6), q = nz(d, -6, 6), r2 = d.int(2, 20);
      if (p === q || p + q === 0) return null;
      return N(`원 ${jw(circ(p, q, r2), '과/와')} 이 원을 직선 ${nb(`${Y} = ${X}`)}에 대하여 대칭이동한 원의 넓이를 동시에 이등분하는 직선의 ${Y}절편은?`, p + q, {
        signed: true,
        explain: `대칭이동한 원의 중심은 ${pt(q, p)}이다. 두 원의 넓이를 동시에 이등분하는 직선은 두 중심 ${pt(p, q)}, ${jw(pt(q, p), '을/를')} 지나므로 ${sline(-1, p + q)}이고, ${Y}절편은 ${sn(p + q)}이다.`,
        facts: { calc: [[`${J(p)}+${J(q)}`, 0]] }
      });
    }),
    T('sfig-minpq', '원과 그 원점 대칭 원 위의 두 점 사이의 거리의 최솟값', '②21', (d) => {
      const [h0, k0] = d.pick([[3, 4], [4, 3], [6, 8], [8, 6], [5, 12], [12, 5]]), h = pm(d) * h0, k = pm(d) * k0, D = Math.sqrt(h0 * h0 + k0 * k0), R = d.int(1, Math.min(4, D - 1)), Cc = h * h + k * k - R * R;
      return N(`원 C<sub>1</sub>: ${gcirc(-2 * h, -2 * k, Cc)}을 원점에 대하여 대칭이동한 원을 C<sub>2</sub>라 하자. 원 C<sub>1</sub> 위의 점 P와 원 C<sub>2</sub> 위의 점 Q에 대하여 선분 PQ의 길이의 최솟값은?`, 2 * D - 2 * R, {
        explain: `C<sub>1</sub>은 ${circ(h, k, R * R)}이고 C<sub>2</sub>는 ${circ(-h, -k, R * R)}이다. 두 중심 사이의 거리는 ${nb(`${rt(`${2 * h0}${sup(2)} + ${2 * k0}${sup(2)}`)} = ${2 * D}`)}이므로 PQ의 최솟값은 ${nb(`${2 * D} ${MINUS} ${R} ${MINUS} ${R} = ${2 * D - 2 * R}`)}이다.`,
        facts: { calc: [[`${2 * D}-2*${R}`, 0]], derived: [2, 2 * D, R] }
      });
    }),
    T('sfig-perp', '대칭이동한 두 직선이 서로 수직일 조건', '②22', (d) => {
      const k1 = d.pick(['x', 'y', 'o']), k2 = d.pick(['x', 'y', 'o']), sg = pm(d), kk = d.int(2, 4), b1 = nz(d, -6, 6), b2 = nz(d, -6, 6);
      const e1 = k1 === 'o' ? 1 : -1, e2 = k2 === 'o' ? 1 : -1, a = -e1 * e2 * sg * kk;
      const l1 = nb(`${Y} = ${VA}${X} ${b1 < 0 ? MINUS : '+'} ${Math.abs(b1)}`), l2 = sline(Q(sg, kk), b2), s2 = Q(e2 * sg, kk);
      return N(`두 직선 ${l1}, ${jw(l2, '이/가')} 있다. 직선 ${jw(l1, '을/를')} ${MNAME[k1]}에 대하여 대칭이동한 직선과 직선 ${jw(l2, '을/를')} ${MNAME[k2]}에 대하여 대칭이동한 직선이 서로 수직일 때, 상수 ${VA}의 값은?`, a, {
        signed: true,
        explain: `직선 ${jw(l1, '을/를')} ${MNAME[k1]}에 대하여 대칭이동한 직선의 기울기는 ${e1 > 0 ? '그대로 ' + VA : MINUS + VA}이고, 직선 ${jw(l2, '을/를')} ${MNAME[k2]}에 대하여 대칭이동한 직선의 기울기는 ${tx(s2)}이다. 두 직선이 수직이므로 ${nb(`${e1 > 0 ? VA : '(' + MINUS + VA + ')'} × ${s2.p < 0 ? '(' + tx(s2) + ')' : tx(s2)} = ${MINUS}1`)}에서 ${nb(`${VA} = ${sn(a)}`)}이다.`,
        facts: { calc: [[`${J(-e1 * e2 * sg)}*${kk}`, 0]] }
      });
    }),
    T('sfig-coef', '대칭이동한 원의 중심으로 처음 원의 계수 구하기', '②23', (d) => {
      const k = d.pick(KEYS), u = nz(d, -5, 5), v = nz(d, -5, 5), [a, b] = MIRROR[k]([u, v]), Cc = d.pick([0, 0, nz(d, -6, 6)]);
      if (a * a + b * b - Cc <= 0 || (u === v && k === 'd')) return null;
      const [ea, eb] = MIRROR_E[k]([J(u), J(v)]);
      return vals(`원 ${nb(`${X2} + ${Y2} ${MINUS} 2${VA}${X} ${MINUS} 2${VB}${Y}${Cc === 0 ? '' : ` ${Cc < 0 ? MINUS : '+'} ${Math.abs(Cc)}`} = 0`)}을 ${MNAME[k]}에 대하여 대칭이동한 원의 중심이 ${pt(u, v)}일 때, 상수 ${VA}, ${VB}의 값은?`, [[VA, a], [VB, b]], {
        explain: `주어진 원의 중심은 ${nb(`(${VA}, ${VB})`)}이다. 이 점을 ${MNAME[k]}에 대하여 대칭이동한 점이 ${pt(u, v)}이므로 ${nb(`(${VA}, ${VB})`)}는 ${jw(pt(u, v), '을/를')} 다시 ${MNAME[k]}에 대하여 대칭이동한 점 ${pt(a, b)}이다.`,
        facts: { calc: [[ea, 0], [eb, 1]] }
      });
    }),
    T('sfig-match', '대칭이동한 원이 주어진 원과 같을 때의 계수와 반지름', '②24', (d) => {
      const k = d.pick(['x', 'y', 'o']), h = nz(d, -5, 5), k0 = nz(d, -5, 5), R = d.int(1, 6), Cc = h * h + k0 * k0 - R * R, [fx, fy] = MIRROR[k]([h, k0]);
      if (Cc === 0) return null;
      const a = -2 * k0, b = -fx, m = fy;
      return vals(`방정식 ${nb(`${X2} + ${Y2} ${-2 * h < 0 ? MINUS : '+'} ${Math.abs(2 * h)}${X} + ${VA}${Y} ${Cc < 0 ? MINUS : '+'} ${Math.abs(Cc)} = 0`)}이 나타내는 도형을 ${MNAME[k]}에 대하여 대칭이동하였더니 원 ${nb(`(${X} + ${VB})${sup(2)} + ${sq(Y, m)} = ${VR}${sup(2)}`)}과 일치하였다. 상수 ${VA}, ${VB}, ${VR}의 값은? (단, ${nb(`${VR} &gt; 0`)})`, [[VA, a], [VB, b], [VR, R, true]], {
        explain: `대칭이동한 원의 중심은 ${nb(`(${MINUS}${VB}, ${sn(m)})`)}이므로 처음 원의 중심은 이 점을 다시 ${MNAME[k]}에 대하여 대칭이동한 ${nb(`(${k === 'x' ? MINUS + VB : VB}, ${sn(k === 'y' ? m : -m)})`)}이다. 주어진 방정식의 중심은 ${nb(`(${sn(h)}, ${MINUS}${VA} ÷ 2)`)}이므로 ${nb(`${VB} = ${sn(b)}`)}, ${nb(`${VA} = ${sn(a)}`)}이고, ${nb(`${VR}${sup(2)} = ${par(h)}${sup(2)} + ${par(k0)}${sup(2)} ${Cc < 0 ? '+' : MINUS} ${Math.abs(Cc)} = ${R * R}`)}에서 ${nb(`${VR} = ${R}`)}이다.`,
        facts: { calc: [[`${k === 'y' ? '(0-2)' : '2'}*${J(m)}`, 0], [`${k === 'x' ? '' : '0-'}${J(-2 * h)}/2`, 1], [`${R}`, 2]], derived: [2, R] }
      });
    })
  ];

  // ── 바. 평행이동과 대칭이동을 잇기 ──
  const mixTypes = [
    T('mix-twice', '두 번 이동한 도형의 방정식', '②26', (d, n) => {
      if (n === 0) {
        const ops = twoOps(d, ['x', 'y', 'o']), m = pm(d) * d.int(2, 4), c = nz(d, -6, 6), L0 = [m, -1, c], L1 = moveLine(ops[0], L0), L2 = moveLine(ops[1], L1), sl = toSlope(L2), mid = toSlope(L1);
        if (!sl || !mid || sl[1] === 0 || Math.abs(sl[1]) > 30) return null;
        return lineAns(`직선 ${jw(sline(m, c), '을/를')} ${say(ops[0])} 다음 ${say(ops[1])} 직선의 방정식을 구하시오.`, sl[0], sl[1], {
          explain: `처음 이동으로 ${jw(sline(mid[0], mid[1]), '이/가')} 되고, 이 직선을 다시 옮기면 ${sline(sl[0], sl[1])}이다. 차례를 바꾸면 다른 직선이 될 수 있다.`,
          facts: (() => { const E = moveLineE(ops[1], moveLineE(ops[0], [J(m), '(0-1)', J(c)])); return { calc: [[`(0-${E[0]})/${E[1]}`, 0], [`(0-${E[2]})/${E[1]}`, 1]] }; })()
        });
      }
      const ops = twoOps(d), p = nz(d, -5, 5), q = nz(d, -5, 5), r2 = d.int(1, 16), C1 = moveCirc(ops[0], [p, q, r2]), C2 = moveCirc(ops[1], C1);
      if (C2[0] === 0 || C2[1] === 0 || C1[0] === 0 || C1[1] === 0 || (p === q && ops[0].t === 'm' && ops[0].k === 'd')) return null;
      const E = fwdE(ops[1], fwdE(ops[0], [J(p), J(q)]));
      return circAns(`원 ${jw(circ(p, q, r2), '을/를')} ${say(ops[0])} 다음 ${say(ops[1])} 원의 방정식을 구하시오.`, C2[0], C2[1], r2, {
        explain: `중심만 차례로 옮긴다. ${pt(p, q)} → ${pt(C1[0], C1[1])} → ${pt(C2[0], C2[1])}이고 반지름의 길이는 그대로이므로 ${circ(C2[0], C2[1], r2)}이다.`,
        facts: { calc: [[`0-${E[0]}`, 0], [`0-${E[1]}`, 1], [`${r2}`, 2]] }
      });
    }, { count: 2 }),
    T('mix-through', '두 번 이동한 직선이 주어진 점을 지날 조건', '②27', (d) => {
      const ops = twoOps(d), coef = d.bool(), aStar = nz(d, -4, 4), xs = nz(d, -4, 4), c = nz(d, -6, 6), m = pm(d) * d.int(2, 3);
      // 거꾸로 옮긴 점 (xs, ys)가 처음 직선 위에 있게 한다.
      const ys = coef ? -c - aStar * xs : m * xs + aStar, Qp = movePt(ops[1], movePt(ops[0], [xs, ys]));
      if (Math.abs(Qp[0]) > 12 || Math.abs(Qp[1]) > 12 || (Qp[0] === 0 && Qp[1] === 0)) return null;
      const back = backE(ops[0], backE(ops[1], [J(Qp[0]), J(Qp[1])]));
      const line = coef ? nb(`${VA}${X} + ${Y} ${c < 0 ? MINUS : '+'} ${Math.abs(c)} = 0`) : nb(`${Y} = ${sn(m)}${X} + ${VA}`);
      return N(`직선 ${jw(line, '을/를')} ${say(ops[0])} 다음 ${say(ops[1])} 직선이 점 ${jw(pt(Qp[0], Qp[1]), '을/를')} 지날 때, 상수 ${VA}의 값은?`, aStar, {
        signed: true,
        explain: `옮긴 직선이 ${jw(pt(Qp[0], Qp[1]), '을/를')} 지나면 처음 직선은 이 점을 거꾸로 옮긴 ${jw(pt(xs, ys), '을/를')} 지난다(나중 이동부터 거꾸로 한다). 처음 직선의 방정식에 대입하면 ${nb(`${VA} = ${sn(aStar)}`)}이다.`,
        facts: { calc: [[coef ? `(0-(${back[1]}+${J(c)}))/${back[0]}` : `${back[1]}-${J(m)}*${back[0]}`, 0]] }
      });
    }),
    T('mix-halve', '두 번 이동한 원의 넓이를 직선이 이등분할 조건', '②28', (d, n) => {
      const ops = twoOps(d);
      if (n === 0) {
        const p = nz(d, -5, 5), q = nz(d, -5, 5), r2 = d.int(1, 16), [u, v] = movePt(ops[1], movePt(ops[0], [p, q])), c = nz(d, -6, 6);
        if (u === 0 || (v - c) % u !== 0 || (p === q && ops.some((o) => o.t === 'm' && o.k === 'd'))) return null;
        const a = (v - c) / u + 0, E = fwdE(ops[1], fwdE(ops[0], [J(p), J(q)]));
        if (a === 0) return null;
        return N(`원 ${jw(circ(p, q, r2), '을/를')} ${say(ops[0])} 다음 ${say(ops[1])} 원의 넓이를 직선 ${jw(nb(`${Y} = ${VA}${X} ${c < 0 ? MINUS : '+'} ${Math.abs(c)}`), '이/가')} 이등분할 때, 상수 ${VA}의 값은?`, a, {
          signed: true,
          explain: `옮긴 원의 중심은 ${pt(u, v)}이다. 넓이를 이등분하는 직선은 중심을 지나므로 ${nb(`${sn(v)} = ${poly([[u, VA], [c, '']])}`)}에서 ${nb(`${VA} = ${sn(a)}`)}이다.`,
          facts: { calc: [[`(${E[1]}-${J(c)})/${E[0]}`, 0]] }
        });
      }
      // 원 (x − p)² + (y − a)² = r² 의 중심이 옮겨진 뒤 직선 y = mx + c 위에 있다(a 가 미지수).
      const p = nz(d, -5, 5), a = nz(d, -5, 5), r2 = d.int(1, 16), m = nz(d, -3, 3);
      const cen = (aa) => movePt(ops[1], movePt(ops[0], [p, aa])), [u0, v0] = cen(0), [u1, v1] = cen(1), du = u1 - u0, dv = v1 - v0;
      if (dv - m * du === 0) return null;
      const [u, v] = cen(a), c = v - m * u;
      if (c === 0 || Math.abs(c) > 30) return null;
      return N(`원 ${jw(nb(`${sq(X, p)} + (${Y} ${MINUS} ${VA})${sup(2)} = ${r2}`), '을/를')} ${say(ops[0])} 다음 ${say(ops[1])} 원의 넓이를 직선 ${jw(sline(m, c), '이/가')} 이등분할 때, 상수 ${VA}의 값은?`, a, {
        signed: true,
        explain: `처음 원의 중심 ${jw(nb(`(${sn(p)}, ${VA})`), '을/를')} 차례로 옮긴 점은 ${nb(`(${poly([[du, VA], [u0, '']])}, ${poly([[dv, VA], [v0, '']])})`)}이고, 이 점이 직선 ${sline(m, c)} 위에 있어야 하므로 대입하면 ${nb(`${VA} = ${sn(a)}`)}이다(이때 중심은 ${pt(u, v)}).`,
        facts: (() => { const E0 = fwdE(ops[1], fwdE(ops[0], [J(p), '0'])), E1 = fwdE(ops[1], fwdE(ops[0], [J(p), '1'])); return { calc: [[`(${J(m)}*${E0[0]}+${J(c)}-${E0[1]})/((${E1[1]}-${E0[1]})-${J(m)}*(${E1[0]}-${E0[0]}))`, 0]] }; })()
      });
    }, { count: 2 }),
    T('mix-match', '대칭이동한 원과 평행이동한 원이 일치할 때 이동의 양', '②29', (d) => {
      const k = d.pick(KEYS), p = nz(d, -5, 5), q = nz(d, -5, 5), r2 = d.int(1, 16), [u, v] = MIRROR[k]([p, q]), a = u - p, b = v - q, [eu, ev] = MIRROR_E[k]([J(p), J(q)]);
      if (a === 0 || b === 0) return null;
      return vals(`원 ${jw(circ(p, q, r2), '을/를')} ${MNAME[k]}에 대하여 대칭이동한 원과 ${XA}의 방향으로 ${VA}만큼, ${YA}의 방향으로 ${VB}만큼 평행이동한 원이 일치할 때, 상수 ${VA}, ${VB}의 값은?`, [[VA, a], [VB, b]], {
        explain: `대칭이동한 원의 중심은 ${pt(u, v)}이다. 평행이동한 원의 중심 ${nb(`(${sn(p)} + ${VA}, ${sn(q)} + ${VB})`)}가 이 점과 같아야 하므로 ${nb(`${VA} = ${sn(a)}`)}, ${nb(`${VB} = ${sn(b)}`)}이다.`,
        facts: { calc: [[`${eu}-${J(p)}`, 0], [`${ev}-${J(q)}`, 1]] }
      });
    }),
    T('mix-system', '평행이동 후 대칭이동한 점이 문자로 준 점과 같을 때', '②31', (d) => {
      const k = d.pick(['d', 'o']), a = nz(d, -5, 5), b = nz(d, -5, 5), al = d.pick([-2, 2, 3]), be = d.pick([-2, 2, 3]);
      const [sx, sy] = MIRROR[k]([al * b, be * a]), s = sx - a, t = sy - b;
      if (s === 0 || t === 0 || (k === 'o' && 1 - al * be === 0) || Math.abs(s) > 14 || Math.abs(t) > 14) return null;
      const co = (kk, v) => (kk === 1 ? v : kk === -1 ? MINUS + v : sn(kk) + v), to = nb(`(${co(al, VB)}, ${co(be, VA)})`);
      const facts = k === 'd' ? [[`${J(s)}/(${J(be)}-1)`, 0], [`${J(t)}/(${J(al)}-1)`, 1]] : [[`(0-${J(s)}+${J(al)}*${J(t)})/(1-${J(al)}*${J(be)})`, 0], [`(0-${J(t)}+${J(be)}*${J(s)})/(1-${J(al)}*${J(be)})`, 1]];
      const moved = k === 'd' ? nb(`(${minus(VB, -t)}, ${minus(VA, -s)})`) : nb(`(${MINUS}${VA} ${s < 0 ? '+' : MINUS} ${Math.abs(s)}, ${MINUS}${VB} ${t < 0 ? '+' : MINUS} ${Math.abs(t)})`);
      return vals(`점 ${nb(`(${VA}, ${VB})`)}를 ${mv(s, t)} 평행이동한 다음 ${MNAME[k]}에 대하여 대칭이동한 점의 좌표가 ${to}일 때, 상수 ${VA}, ${VB}의 값은?`, [[VA, a], [VB, b]], {
        explain: `${jw(nb(`(${minus(VA, -s)}, ${minus(VB, -t)})`), '을/를')} ${MNAME[k]}에 대하여 대칭이동한 점은 ${moved}이다. 이 점이 ${jw(to, '과/와')} 같으므로 두 식을 연립하여 풀면 ${nb(`${VA} = ${sn(a)}`)}, ${nb(`${VB} = ${sn(b)}`)}이다.`,
        facts: { calc: facts }
      });
    }),
    T('mix-back', '이동한 결과로 처음 점 구하기', '②32', (d) => {
      const kind = d.bool(), m1 = { t: 'm', k: d.pick(KEYS) }, tr = { t: 't', a: nz(d, -5, 5), b: nz(d, -5, 5) }, ops = kind ? [tr, m1] : [m1, tr];
      const u = nz(d, -6, 6), v = nz(d, -6, 6), P = backPt(ops[0], backPt(ops[1], [u, v])), E = backE(ops[0], backE(ops[1], [J(u), J(v)]));
      if (P[0] === 0 || P[1] === 0) return null;
      const mid = backPt(ops[1], [u, v]);
      return pointAns(`점 P를 ${say(ops[0])} 다음 ${say(ops[1])} 점이 ${pt(u, v)}일 때, 점 P의 좌표는?`, P[0], P[1], {
        explain: `나중 이동부터 거꾸로 한다. ${pt(u, v)}에서 둘째 이동을 거꾸로 하면 ${pt(mid[0], mid[1])}이고, 첫째 이동을 거꾸로 하면 ${pt(P[0], P[1])}이다.`,
        facts: { calc: [[E[0], 0], [E[1], 1]] }
      });
    })
  ];

  // ── 사. 대칭이동을 이용한 최단 거리 ──
  const shortTypes = [
    T('short-axis', '좌표축 위의 점을 거쳐 가는 거리의 합의 최솟값', '②35', (d) => {
      const onX = d.bool(), sg = pm(d), x1 = d.int(-5, 5), x2 = d.int(-5, 5), y1 = d.int(1, 6) * sg, y2 = d.int(1, 6) * sg;
      // x축 위의 점: B′ = (x2, −y2) / y축 위의 점: 좌표를 바꾸어 쓴다.
      const A = onX ? [x1, y1] : [y1, x1], Bp = onX ? [x2, y2] : [y2, x2], D2 = (x2 - x1) ** 2 + (y1 + y2) ** 2, [cf, rd] = sqParts(D2);
      if (cf < 2 || rd < 2 || x1 === x2) return null;
      const axis = onX ? XA : YA, B2 = onX ? [x2, -y2] : [-y2, x2];
      return radAns(`두 점 A${pt(A[0], A[1])}, B${jw(pt(Bp[0], Bp[1]), '과/와')} ${axis} 위의 점 P에 대하여 ${SG('AP')} + ${SG('BP')}의 최솟값은?`, cf, rd, {
        figure: ptsFig([['A', A], ['B', Bp]]),
        explain: `점 B를 ${axis}에 대하여 대칭이동한 점을 B′이라 하면 B′${pt(B2[0], B2[1])}이고 ${nb(`${SG('BP')} = ${SG('B′P')}`)}이므로 ${nb(`${SG('AP')} + ${SG('BP')} = ${SG('AP')} + ${SG('PB′')} ≥ ${SG('AB′')}`)}이다. ${nb(`${SG('AB′')} = ${rt(`${Math.abs(B2[0] - A[0])}${sup(2)} + ${Math.abs(B2[1] - A[1])}${sup(2)}`)} = ${radText(cf, rd)}`)}이다.`,
        facts: { calc: [[`${cf}`, 0], [`${rd}`, 1]], derived: [cf, rd] }
      });
    }),
    T('short-axis-point', '거리의 합이 최소가 되는 x축 위의 점', '②36', (d) => {
      const x1 = d.int(-5, 6), x2 = d.int(-5, 8), y1 = d.int(1, 7), y2 = d.int(1, 7), top = (x2 - x1) * y1;
      if (x1 === x2 || top % (y1 + y2) !== 0) return null;
      const p = x1 + top / (y1 + y2);
      if (p === x1 || p === x2 || p === 0) return null;
      return N(`두 점 A${pt(x1, y1)}, B${jw(pt(x2, y2), '과/와')} ${XA} 위의 점 P에 대하여 ${SG('AP')} + ${SG('BP')}의 값이 최소가 되도록 하는 점 P의 ${X}좌표는?`, p, {
        signed: true,
        figure: ptsFig([['A', [x1, y1]], ['B', [x2, y2]]]),
        explain: `B를 ${XA}에 대하여 대칭이동한 점 B′${jw(pt(x2, -y2), '을/를')} 잡으면 P는 직선 AB′과 ${XA}의 교점일 때 최소가 된다. 직선 AB′의 기울기는 ${tx(Q(-y2 - y1, x2 - x1))}이고 ${nb(`${Y} = 0`)}일 때 ${nb(`${X} = ${sn(p)}`)}이다.`,
        facts: { calc: [[`${J(x1)}+(${J(x2)}-${J(x1)})*${y1}/(${y1}+${y2})`, 0]] }
      });
    }),
    T('short-yx', '직선 y = x 위의 점을 거쳐 가는 거리의 합', '②37', (d, n) => {
      // A, B 는 직선 y = x 의 같은 쪽(둘 다 y > x 이거나 둘 다 y < x)
      const side = pm(d), xa = d.int(-4, 5), xb = d.int(-4, 5), ya = xa + side * d.int(1, 5), yb = xb + side * d.int(1, 5), Bp = [yb, xb];
      if (xa === xb && ya === yb) return null;
      const fig = ptsFig([['A', [xa, ya]], ['B', [xb, yb]]], { diag: true, square: true });
      if (n === 0) {
        const D2 = (Bp[0] - xa) ** 2 + (Bp[1] - ya) ** 2;
        if (D2 < 2 || sqParts(D2)[0] !== 1) return null;
        return radAns(`두 점 A${pt(xa, ya)}, B${jw(pt(xb, yb), '과/와')} 직선 ${nb(`${Y} = ${X}`)} 위의 점 P에 대하여 ${SG('AP')} + ${SG('BP')}의 최솟값은?`, 1, D2, {
          figure: fig,
          explain: `점 B를 직선 ${nb(`${Y} = ${X}`)}에 대하여 대칭이동한 점은 B′${pt(Bp[0], Bp[1])}이고 ${nb(`${SG('AP')} + ${SG('BP')} = ${SG('AP')} + ${SG('PB′')} ≥ ${SG('AB′')}`)}이다. ${nb(`${SG('AB′')} = ${rt(`${Math.abs(Bp[0] - xa)}${sup(2)} + ${Math.abs(Bp[1] - ya)}${sup(2)}`)} = `)}${rt(D2)}이다.`,
          facts: { calc: [[`(${J(yb)}-${J(xa)})*(${J(yb)}-${J(xa)})+(${J(xb)}-${J(ya)})*(${J(xb)}-${J(ya)})`, 0]] }
        });
      }
      // 직선 AB′ 과 y = x 의 교점 (t, t): A + s(B′ − A) 에서 x = y
      const dx = Bp[0] - xa, dy = Bp[1] - ya, num = xa - ya, den = dy - dx;
      if (den === 0) return null;
      const tPar = Q(num, den), tx0 = Q(xa * den + dx * num, den);
      if (tx0.q !== 1 || tPar.p <= 0 || tPar.p >= tPar.q) return null;
      const tt = tx0.p;
      if (tt === 0) return null;
      return pointAns(`두 점 A${pt(xa, ya)}, B${jw(pt(xb, yb), '과/와')} 직선 ${nb(`${Y} = ${X}`)} 위의 점 P에 대하여 ${SG('AP')} + ${SG('BP')}의 값이 최소가 되도록 하는 점 P의 좌표는?`, tt, tt, {
        figure: fig,
        explain: `점 B를 직선 ${nb(`${Y} = ${X}`)}에 대하여 대칭이동한 점 B′${jw(pt(Bp[0], Bp[1]), '을/를')} 잡으면 P는 직선 AB′과 직선 ${nb(`${Y} = ${X}`)}의 교점일 때 최소가 된다. 직선 AB′의 방정식에 ${nb(`${Y} = ${X}`)}를 대입하여 풀면 P${pt(tt, tt)}이다.`,
        facts: { calc: [[`(${J(xa)}*(${J(xb)}-${J(ya)}-(${J(yb)}-${J(xa)}))+(${J(yb)}-${J(xa)})*(${J(xa)}-${J(ya)}))/(${J(xb)}-${J(ya)}-(${J(yb)}-${J(xa)}))`, 0], [`(${J(xa)}*(${J(xb)}-${J(ya)}-(${J(yb)}-${J(xa)}))+(${J(yb)}-${J(xa)})*(${J(xa)}-${J(ya)}))/(${J(xb)}-${J(ya)}-(${J(yb)}-${J(xa)}))`, 1]] }
      });
    }, { count: 2 }),
    T('short-two', '두 좌표축을 거쳐 가는 꺾인 길의 최솟값', '②38', (d) => {
      const [X0, Y0] = d.pick([[6, 8], [8, 6], [5, 12], [12, 5], [9, 12], [12, 9], [8, 15], [15, 8], [12, 16], [16, 12]]), xa = d.int(1, X0 - 1), ya = d.int(1, Y0 - 1), xb = X0 - xa, yb = Y0 - ya;
      if (ya * xb <= yb * xa || Math.max(xa, ya, xb, yb) > 12) return null;
      const D = Math.sqrt(X0 * X0 + Y0 * Y0);
      return N(`두 점 A${pt(xa, ya)}, B${jw(pt(xb, yb), '과/와')} ${YA} 위의 점 P, ${XA} 위의 점 Q에 대하여 ${SG('AP')} + ${SG('PQ')} + ${SG('QB')}의 최솟값은?`, D, {
        figure: ptsFig([['A', [xa, ya]], ['B', [xb, yb]]]),
        explain: `A를 ${YA}에 대하여 대칭이동한 점 A′${pt(-xa, ya)}, B를 ${XA}에 대하여 대칭이동한 점 B′${jw(pt(xb, -yb), '을/를')} 잡으면 ${nb(`${SG('AP')} + ${SG('PQ')} + ${SG('QB')} = ${SG('A′P')} + ${SG('PQ')} + ${SG('QB′')} ≥ ${SG('A′B′')}`)}이다. ${nb(`${SG('A′B′')} = ${rt(`${X0}${sup(2)} + ${Y0}${sup(2)}`)} = ${D}`)}이다.`,
        facts: { calc: [[`${D}`, 0]], derived: [D] }
      });
    })
  ];

  B.addGroup(UNIT, { id: 'smove', title: '점의 대칭이동', standard: S07, types: smoveTypes });
  B.addGroup(UNIT, { id: 'sfig', title: '도형의 대칭이동', standard: S07, types: sfigTypes });
  B.addGroup(UNIT, { id: 'mix', title: '평행이동과 대칭이동을 잇기', standard: S07, types: mixTypes });
  B.addGroup(UNIT, { id: 'short', title: '대칭이동을 이용한 최단 거리', standard: S07, types: shortTypes });
})(typeof window !== 'undefined' ? window : globalThis);
