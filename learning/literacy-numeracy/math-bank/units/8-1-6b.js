// 중학교 2학년 1학기 6단원 일차함수와 일차방정식의 관계 — 뒤쪽 묶음(직선의 방정식, 두 직선의 교점과 연립방정식의 해, 두 직선의 위치 관계와 연립방정식의 해의 개수, 직선으로 둘러싸인 도형의 넓이).
// 단원 틀·도구·싣는 기준·뺀 것과 까닭은 8-1-6a.js 의 머리 주석에 있다. 여기서는 그 파일이 내보낸 도구(B.kit.m816)를 쓴다.
// ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번, 「8-1-4 ①n·심n」 = 8-1-4 꼴 목록의 번호(해가 무수히 많거나 없는 연립방정식 — 이 단원에서 싣는다).
//
// 이 파일에서 눈여겨볼 것
//  - 교점의 좌표는 연립방정식의 해이다. 교점을 그래프에서 읽는 문항(meet-read-solution)은 교점이 모눈 점에 오는 직선 묶음만 쓴다(_work/presets.cjs 로 찾은 것).
//  - 두 직선을 절편으로 준 그림(meet-from-figure-lines, 8-1-6c.js 의 hard-area-from-figure)은 교점이 정수 좌표가 되는 묶음 CUTS 만 쓴다.
//  - 해의 개수: 두 일차방정식의 x, y의 계수의 비가 같고 상수항의 비가 다르면 평행(해가 없다), 셋이 다 같으면 일치(해가 무수히 많다)이다. 참·거짓은 코드가 비로 가린다(relOf).
//  - 「해가 없을 때 a의 값이 될 수 없는 수」(①54), 「한 쌍의 해를 가질 때 a의 값이 될 수 없는 수」(①57)는 원문의 「a ≠ □」를 수 하나로 받게 바꾼 것이다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, N, M, inline, NAMES, name } = B.kit;
  const { LAB, MINUS, gcd, Q, qcmp, fl, tx, nb, tj, nz, pm, ansV, pointAns, sys } = B.kit.mid;
  const { STD1, T, X, Y, A, Bv, K, QUAD, jn, iq, sgn, tl, un, Lt, sum, eq0, eqR, gen, std, fn, xEq, yEq, slope, yint, byFn, byCuts, through, onLine, cross, X0, Y0, missing, pt, ptj, lineAns, pick1, axisPick, cuts, foot, board, bare, FRS, intLine } = B.kit.m816;

  // ── 두 직선의 위치 관계 ──
  // 'one' 한 점에서 만난다 / 'none' 평행하다 / 'many' 일치한다
  const relOf = (l, k) => (l.a * k.b !== k.a * l.b ? 'one' : l.a * k.c === k.a * l.c && l.b * k.c === k.b * l.c ? 'many' : 'none');
  const SOLS = [['해가 없다.', 'none'], ['해가 한 쌍뿐이다.', 'one'], ['해가 무수히 많다.', 'many']];
  // 기준이 되는 일차방정식 px + qy = r (계수가 작은 것)
  const baseLine = (d) => d.until(() => ({ a: d.int(1, 4), b: nz(d, -4, 4), c: nz(d, -6, 6) }), (l) => gcd(l.a, l.b) === 1);
  const times = (l, t, more) => ({ a: t * l.a, b: t * l.b, c: t * l.c + (more || 0) });
  // 교점이 정수 좌표 (x0, y0)인 두 일차방정식(평행하지 않다)
  const twoThrough = (d, lim) => d.until(() => {
    const x0 = nz(d, -5, 5), y0 = nz(d, -5, 5), mk = () => { const a = d.int(1, 4), b = nz(d, -3, 3); return { a, b, c: -(a * x0 + b * y0) }; };
    return { x0, y0, l1: mk(), l2: mk() };
  }, (v) => relOf(v.l1, v.l2) === 'one' && Math.abs(v.l1.c) <= (lim || 15) && Math.abs(v.l2.c) <= (lim || 15) && v.l1.c !== 0 && v.l2.c !== 0 && gcd(gcd(v.l1.a, v.l1.b), v.l1.c) === 1 && gcd(gcd(v.l2.a, v.l2.b), v.l2.c) === 1);
  // 절편으로 준 두 직선 [x절편, y절편, x절편, y절편]: 기울기의 부호가 다르고, 교점이 x축 위쪽의 정수 좌표이며 두 x절편 사이에 있다.
  const CUTS = [[-4, 2, 4, 6], [-4, 6, 4, 2], [-3, 3, 3, 6], [-3, 6, 3, 3], [-2, 2, 2, 6], [-2, 6, 2, 2], [-6, 6, 2, 2], [-2, 2, 6, 6], [-5, 5, 3, 3], [-3, 3, 5, 5], [-4, 4, 2, 2], [-2, 2, 4, 4], [2, -2, 6, 6], [-6, 2, -2, -2], [-6, 6, -2, -2], [-6, 4, -2, -4], [2, -4, 6, 4]];
  const cutMeet = ([p1, q1, p2, q2]) => { const det = q1 * p2 - q2 * p1; return [p1 * p2 * (q1 - q2) / det, q1 * q2 * (p2 - p1) / det]; };
  // 절편으로 준 두 직선의 그림. shade: 두 직선과 x축 사이의 삼각형을 칠한다.
  function cutFigure(set, shade) {
    const [p1, q1, p2, q2] = set, [x0, y0] = cutMeet(set);
    return bare([[p1, 0], [0, q1], [p2, 0], [0, q2], [x0, y0]], {
      lines: [{ a: Q(-q1, p1), b: q1, name: LAB[0] }, { a: Q(-q2, p2), b: q2, name: LAB[1] }], marks: cuts(p1, q1).concat(cuts(p2, q2)), poly: shade ? [[p1, 0], [x0, y0], [p2, 0]] : undefined,
      label: `좌표평면: 직선 ㉠은 x축과 ${sgn(p1)}인 점에서, y축과 ${sgn(q1)}인 점에서 만난다. 직선 ㉡은 x축과 ${sgn(p2)}인 점에서, y축과 ${sgn(q2)}인 점에서 만난다. 두 직선은 x축의 위쪽에서 만난다.${shade ? ' 두 직선과 x축으로 둘러싸인 삼각형에 색칠하였다.' : ''}`
    });
  }
  // 교점의 좌표를 절편의 수만으로 다시 셈하는 식
  const cutX = ([p1, q1, p2, q2]) => `${jn(p1)}*${jn(p2)}*(${jn(q1)}-${jn(q2)})/(${jn(q1)}*${jn(p2)}-${jn(q2)}*${jn(p1)})`;
  const cutY = ([p1, q1, p2, q2]) => `${jn(q1)}*${jn(q2)}*(${jn(p2)}-${jn(p1)})/(${jn(q1)}*${jn(p2)}-${jn(q2)}*${jn(p1)})`;
  // 세 직선 [a, b, c](ax + by = c): 두 개씩 만나는 점이 모두 모눈 점이다.
  const TRIPLES = [
    [[1, 1, 4], [1, -2, 1], [2, -1, -4]],
    [[1, -1, 2], [1, 2, 5], [2, 1, 1]],
    [[1, -2, -1], [1, 1, 2], [2, -1, -5]],
    [[1, -2, -5], [1, 1, -2], [2, -1, -1]],
    [[1, 1, 1], [1, 2, 4], [2, 1, 5]]
  ];
  const asLine = ([a, b, c]) => ({ a, b, c: -c });
  const drawn = (l, nameOf) => ({ a: slope(l), b: yint(l), name: nameOf });
  // 값의 부호에 맞추어 식 앞에 −를 붙인다(넓이·길이처럼 크기를 셈하는 식)
  const absx = (expr, value) => (value < 0 ? `-(${expr})` : expr);

  B.addTypes('8-1-6', 'line', [
    T('line-general-from-slope', '기울기와 y절편이 주어진 직선의 방정식을 일차방정식 꼴로 나타내기', '①32', (d) => {
      const a = pm(d) * d.int(2, 4), k = nz(d, -4, 4), m = Q(-1, a), b = -a * k, eq = eq0([1, X], Lt(A + Y), Lt(Bv));
      return M(`기울기가 ${tx(m)}이고 ${Y}절편이 ${iq(k)}인 직선의 방정식을 ${eq} 꼴로 나타낼 때, 수 ${A}, ${Bv}의 값을 각각 구하시오.`, [{ label: `${A} =`, answer: a, signed: true }, { label: `${Bv} =`, answer: b, signed: true }], {
        explain: `직선의 방정식은 ${fn(m, k)}이다. 양변에 ${iq(a)}${tl(a, '을/를')} 곱하면 ${nb(sum([[a, Y]]) + ' = ' + sum([[-1, X], [a * k, '']]))}이고, 모든 항을 좌변으로 옮기면 ${eq0([1, X], [a, Y], [b, ''])}이다. 따라서 ${A} = ${iq(a)}, ${Bv} = ${iq(b)}이다.`,
        facts: { calc: [[`-${m.q}/${jn(m.p)}`, 0], [`${m.q}/${jn(m.p)}*${jn(k)}`, 1]] }
      });
    }),
    T('line-parallel-to-eq', '일차방정식의 그래프와 평행하고 한 점을 지나는 직선의 방정식', '①33', (d) => {
      const v = d.until(() => { const m = pm(d) * d.int(2, 4), l = intLine(m, nz(d, -6, 6), d.pick([1, 2, 3])), x0 = nz(d, -4, 4), y0 = nz(d, -5, 5); return { m, l, x0, y0, k: y0 - m * x0 }; }, (w) => w.k !== 0 && Math.abs(w.k) <= 15 && !onLine(w.l, w.x0, w.y0));
      const { m, l, x0, y0, k } = v;
      return lineAns(`일차방정식 ${gen(l)}의 그래프와 평행하고 점 ${ptj(x0, y0, '을/를')} 지나는 직선의 방정식은?`, m, k, {
        explain: `${gen(l)}에서 ${fn(m, yint(l))}이므로 기울기는 ${iq(m)}이다. 평행한 직선의 기울기도 ${iq(m)}이므로 직선의 방정식을 ${nb(`${Y} = ${sum([[m, X], Lt(Bv)])}`)}로 놓고 ${X} = ${iq(x0)}, ${Y} = ${iq(y0)}${tl(y0, '을/를')} 대입하면 ${Bv} = ${iq(k)}이다. 따라서 ${fn(m, k)}이다.`,
        facts: { calc: [[`-${jn(l.a)}/${jn(l.b)}`, 0], [`${jn(y0)}-(-${jn(l.a)}/${jn(l.b)})*${jn(x0)}`, 1]], unseen: un(l.a, l.b) }
      });
    }),
    T('line-parallel-two-points', '두 점을 지나는 직선과 일차방정식의 그래프가 평행할 때 수 구하기', '①35', (d) => {
      // ax − qy + c = 0 의 기울기 a/q 가 두 점을 지나는 직선의 기울기 ±p/q 와 같다.
      const v = d.until(() => { const [p, q] = d.pick(FRS), s = pm(d), t = pm(d) * d.int(1, 2), x1 = d.int(-4, 4), y1 = d.int(-4, 4), c = nz(d, -6, 6); return { p, q, s, x1, y1, x2: x1 + q * t, y2: y1 + s * p * t, c }; },
        (w) => Math.abs(w.x2) <= 7 && Math.abs(w.y2) <= 7 && w.s * w.p * w.x1 - w.q * w.y1 + w.c !== 0);
      const { p, q, s, x1, y1, x2, y2, c } = v, a = s * p, m = Q(a, q), eq = eq0(Lt(A + X), [-q, Y], [c, '']);
      return ansV(`두 점 ${pt(x1, y1)}, ${ptj(x2, y2, '을/를')} 지나는 직선과 일차방정식 ${eq}의 그래프가 서로 평행할 때, 수 ${A}의 값은?`, Q(a), 'int', {
        explain: `두 점을 지나는 직선의 기울기는 ${nb(`${frac(`${iq(y2)} − ${y1 < 0 ? '(' + iq(y1) + ')' : y1}`, `${iq(x2)} − ${x1 < 0 ? '(' + iq(x1) + ')' : x1}`)} = ${tx(m)}`)}이다. ${eq}에서 ${nb(`${Y} = ${frac(A, q)}${X} ${c > 0 ? '+' : MINUS} ${frac(Math.abs(c), q)}`)}이므로 ${nb(`${frac(A, q)} = ${tx(m)}`)}에서 ${A} = ${iq(a)}이다.`,
        facts: { value: `(${jn(y2)}-${jn(y1)})*${q}/(${jn(x2)}-${jn(x1)})`, unseen: [] }
      });
    }),
    T('line-not-parallel', '여러 가지로 주어진 직선 가운데 평행하지 않은 것', '①36', (d) => {
      // 기울기 mm, y절편 kk(정수)인 직선을 네 가지로 말한다. 넷 가운데 하나만 기울기가 다르다.
      const say = [
        (mm, kk) => { const x0 = d.until(() => nz(d, -3, 3), (v) => Math.abs(mm * v + kk) <= 12); return `기울기가 ${iq(mm)}이고 점 ${ptj(x0, mm * x0 + kk, '을/를')} 지나는 직선`; },
        (mm, kk) => `일차방정식 ${gen(intLine(mm, kk, d.pick([1, 2])))}의 그래프`,
        (mm, kk) => { const [u, w] = d.until(() => [d.int(-3, 3), d.int(-3, 3)], ([s, t]) => s < t && Math.abs(mm * s + kk) <= 12 && Math.abs(mm * t + kk) <= 12); return `두 점 ${pt(u, mm * u + kk)}, ${ptj(w, mm * w + kk, '을/를')} 지나는 직선`; },
        (mm, kk) => `${X}절편이 ${iq(-kk / mm)}이고 ${Y}절편이 ${iq(kk)}인 직선`
      ];
      const m = pm(d) * d.int(2, 3), odd = d.int(0, 3), other = d.pick([-m, m + 1, m - 1].filter((v) => Math.abs(v) >= 2 || v === -m));
      const slopes = [0, 1, 2, 3].map((i) => (i === odd ? other : m)), ks = d.until(() => slopes.map((s) => s * nz(d, -2, 2)), (list) => new Set(list).size === 4);
      const order = d.shuffle([0, 1, 2, 3]);
      return pick1(d, '다음 직선 중 나머지 셋과 평행하지 않은 것은?', order.map((f, i) => [say[f](slopes[i], ks[i]), i === odd]), {
        fixed: true,
        explain: `기울기를 구하면 차례로 ${slopes.map(iq).join(', ')}이다. 기울기가 ${iq(other)}인 직선만 나머지와 기울기가 달라 평행하지 않다.`
      });
    }),
    T('line-misread', '잘못 본 두 식에서 처음 직선의 방정식 찾기', '①38 심20', (d) => {
      const m = pm(d) * d.int(2, 4), k = nz(d, -6, 6), k1 = d.until(() => nz(d, -6, 6), (v) => v !== k), m2 = d.pick([Q(1, 2), Q(-1, 2), Q(3, 2), Q(-3, 2), Q(1), Q(-1), Q(1, 3), Q(-2, 3)]);
      const l1 = intLine(m, k1, d.pick([1, 2])), l2 = byFn(m2, k), [n1, n2] = d.shuffle(NAMES).slice(0, 2);
      return lineAns(`어떤 직선의 방정식을 구하는데 ${name(n1, '은/는')} ${Y}절편을 잘못 보아 ${gen(l1)}${tl(0, '을/를')} 얻었고, ${name(n2, '은/는')} 기울기를 잘못 보아 ${gen(l2)}${tl(0, '을/를')} 얻었다. 처음 직선의 방정식은?`, m, k, {
        explain: `${name(n1, '은/는')} 기울기를 바르게 보았다. ${gen(l1)}에서 ${fn(m, k1)}이므로 처음 직선의 기울기는 ${iq(m)}이다. ${name(n2, '은/는')} ${Y}절편을 바르게 보았다. ${gen(l2)}에서 ${fn(m2, k)}이므로 처음 직선의 ${Y}절편은 ${iq(k)}이다. 따라서 처음 직선의 방정식은 ${fn(m, k)}이다.`,
        facts: { calc: [[`-${jn(l1.a)}/${jn(l1.b)}`, 0], [`-${jn(l2.c)}/${jn(l2.b)}`, 1]], unseen: un(l1.a, l1.b, l2.b) }
      });
    })
  ]);

  B.addTypes('8-1-6', 'meet', [
    T('meet-read-solution', '그래프에서 연립방정식의 해 읽기', '①39', (d, n) => {
      const set = d.shuffle(d.pick(TRIPLES)).map(asLine), ans = [{ label: `${X} =`, signed: true }, { label: `${Y} =`, signed: true }];
      if (n === 0) {
        // 직선 셋 가운데 연립방정식의 두 일차방정식의 그래프를 찾아 교점을 읽는다.
        const [i, j] = d.until(() => d.pick([[0, 1], [0, 2], [1, 2]]), ([u, w]) => { const p = cross(set[u], set[w]); return p[0].p !== 0 && p[1].p !== 0; }), P = cross(set[i], set[j]), all = [[0, 1], [0, 2], [1, 2]].map(([u, w]) => cross(set[u], set[w]));
        return M(`그림에서 직선 ㉠, ㉡, ㉢은 각각 일차방정식 ${std(set[0])}, ${std(set[1])}, ${std(set[2])}의 그래프이다. 그래프를 이용하여 연립방정식 ${sys([std(set[i]), std(set[j])])}의 해를 구하시오.`, [Object.assign({ answer: P[0].p }, ans[0]), Object.assign({ answer: P[1].p }, ans[1])], {
          figure: board({ lines: set.map((l, at) => drawn(l, LAB[at])), points: all.map((p) => ({ x: p[0].p, y: p[1].p })) }),
          explain: `연립방정식의 해는 두 일차방정식의 그래프의 교점의 좌표와 같다. 두 직선 ${LAB[i]}, ${LAB[j]}의 교점의 좌표가 ${pt(P[0].p, P[1].p)}이므로 해는 ${X} = ${iq(P[0].p)}, ${Y} = ${iq(P[1].p)}이다.`,
          facts: { calc: [[X0(set[i], set[j]), 0], [Y0(set[i], set[j]), 1]], unseen: [1], rule: 'read-three' }
        });
      }
      // 식 없이 그래프만: 교점의 좌표가 곧 해이다. 두 좌표가 모두 0이 아닌 교점을 고른다.
      const [i, j] = d.until(() => d.pick([[0, 1], [0, 2], [1, 2]]), ([u, w]) => { const p = cross(set[u], set[w]); return p[0].p !== 0 && p[1].p !== 0; }), P = cross(set[i], set[j]);
      return M(`그림의 두 직선 ㉠, ㉡은 ${X}, ${Y}에 대한 어떤 연립방정식의 두 일차방정식의 그래프이다. 이 연립방정식의 해를 구하시오.`, [Object.assign({ answer: P[0].p }, ans[0]), Object.assign({ answer: P[1].p }, ans[1])], {
        figure: board({ lines: [drawn(set[i], LAB[0]), drawn(set[j], LAB[1])], points: [{ x: P[0].p, y: P[1].p }] }),
        explain: `연립방정식의 해는 두 일차방정식의 그래프의 교점의 좌표와 같다. 두 직선의 교점의 좌표가 ${pt(P[0].p, P[1].p)}이므로 해는 ${X} = ${iq(P[0].p)}, ${Y} = ${iq(P[1].p)}이다.`,
        facts: { calc: [[jn(P[0].p), 0], [jn(P[1].p), 1]], rule: 'read-two' }
      });
    }, { count: 2 }),
    T('meet-point', '두 일차방정식의 그래프의 교점의 좌표', '①41', (d) => {
      const { x0, y0, l1, l2 } = twoThrough(d);
      return pointAns(`두 일차방정식 ${gen(l1)}, ${gen(l2)}의 그래프의 교점의 좌표는?`, x0, y0, {
        explain: `두 그래프의 교점의 좌표는 연립방정식 ${sys([gen(l1), gen(l2)])}의 해와 같다. 연립방정식을 풀면 ${X} = ${iq(x0)}, ${Y} = ${iq(y0)}이므로 교점의 좌표는 ${pt(x0, y0)}이다.`,
        facts: { calc: [[X0(l1, l2), 0], [Y0(l1, l2), 1]], unseen: un(l1.a, l1.b, l2.a, l2.b) }
      });
    }),
    T('meet-from-figure-lines', '그림의 두 직선의 식을 세워 교점 구하기', '①42 심31', (d) => {
      const set = d.pick(CUTS), [p1, q1, p2, q2] = set, [x0, y0] = cutMeet(set), m1 = Q(-q1, p1), m2 = Q(-q2, p2);
      return pointAns('그림의 두 직선 ㉠, ㉡의 교점의 좌표는?', x0, y0, {
        figure: cutFigure(set, false),
        explain: `직선 ㉠은 두 점 ${pt(p1, 0)}, ${ptj(0, q1, '을/를')} 지나므로 ${fn(m1, q1)}이고, 직선 ㉡은 두 점 ${pt(p2, 0)}, ${ptj(0, q2, '을/를')} 지나므로 ${fn(m2, q2)}이다. 두 식을 연립하여 풀면 ${X} = ${iq(x0)}, ${Y} = ${iq(y0)}이므로 교점의 좌표는 ${pt(x0, y0)}이다.`,
        facts: { calc: [[cutX(set), 0], [cutY(set), 1]] }
      });
    }),
    T('meet-coef-from-point', '교점의 좌표로 두 일차방정식의 수 구하기', '①43', (d) => {
      const v = d.until(() => { const a = nz(d, -4, 4), b = nz(d, -4, 4), x0 = nz(d, -4, 4), y0 = nz(d, -4, 4), b1 = nz(d, -3, 3), a2 = nz(d, -3, 3); return { a, b, x0, y0, b1, a2, c1: a * x0 + b1 * y0, c2: a2 * x0 + b * y0 }; }, (w) => Math.abs(w.c1) <= 15 && Math.abs(w.c2) <= 15 && w.a * w.b !== w.a2 * w.b1);
      const { a, b, x0, y0, b1, a2, c1, c2 } = v, e1 = eqR([Lt(A + X), [b1, Y]], c1), e2 = eqR([[a2, X], Lt(Bv + Y)], c2);
      return M(`두 일차방정식 ${e1}, ${e2}의 그래프의 교점의 좌표가 ${pt(x0, y0)}일 때, 수 ${A}, ${Bv}의 값을 각각 구하시오.`, [{ label: `${A} =`, answer: a, signed: true }, { label: `${Bv} =`, answer: b, signed: true }], {
        explain: `교점은 두 그래프 위에 모두 있으므로 ${X} = ${iq(x0)}, ${Y} = ${iq(y0)}${tl(y0, '을/를')} 두 일차방정식에 각각 대입한다. ${e1}에서 ${A} = ${iq(a)}이고, ${e2}에서 ${Bv} = ${iq(b)}이다.`,
        facts: { calc: [[`(${jn(c1)}-${jn(b1)}*${jn(y0)})/${jn(x0)}`, 0], [`(${jn(c2)}-${jn(a2)}*${jn(x0)})/${jn(y0)}`, 1]], unseen: un(b1, a2) }
      });
    }),
    T('meet-coef-from-x', '교점의 한 좌표나 자리만 알 때 수 구하기', '①44 심29·30', (d, n) => {
      if (n === 0) {
        // 교점의 x좌표(또는 y좌표)만 준다: 수가 다 적힌 식에서 나머지 좌표를 구한 뒤 대입한다.
        const v = d.until(() => { const x0 = nz(d, -4, 4), y0 = nz(d, -5, 5), a1 = d.int(1, 4), b1 = nz(d, -3, 3), al = nz(d, -5, 5), bb = nz(d, -3, 3); return { x0, y0, l1: { a: a1, b: b1, c: -(a1 * x0 + b1 * y0) }, al, bb, c2: -(al * x0 + bb * y0) }; },
          (w) => w.l1.c !== 0 && Math.abs(w.l1.c) <= 15 && w.c2 !== 0 && Math.abs(w.c2) <= 15 && w.l1.a * w.bb !== w.al * w.l1.b);
        const { x0, y0, l1, al, bb, c2 } = v, byX = d.bool(), e2 = eq0(Lt(A + X), [bb, Y], [c2, '']);
        return ansV(`두 일차방정식 ${gen(l1)}, ${e2}의 그래프의 교점의 ${byX ? X : Y}좌표가 ${iq(byX ? x0 : y0)}일 때, 수 ${A}의 값은?`, Q(al), 'int', {
          explain: `${gen(l1)}에 ${byX ? X : Y} = ${iq(byX ? x0 : y0)}${tl(byX ? x0 : y0, '을/를')} 대입하면 ${byX ? Y : X} = ${iq(byX ? y0 : x0)}이므로 교점의 좌표는 ${pt(x0, y0)}이다. ${e2}에 ${X} = ${iq(x0)}, ${Y} = ${iq(y0)}${tl(y0, '을/를')} 대입하면 ${A} = ${iq(al)}이다.`,
          facts: { value: byX ? `-(${jn(bb)}*(-(${jn(l1.a)}*${jn(x0)}+${jn(l1.c)})/${jn(l1.b)})+${jn(c2)})/${jn(x0)}` : `-(${jn(bb)}*${jn(y0)}+${jn(c2)})/(-(${jn(l1.b)}*${jn(y0)}+${jn(l1.c)})/${jn(l1.a)})`, unseen: un(l1.a, l1.b, bb), rule: 'meet-one-coord' }
        });
      }
      if (n === 1) {
        // 교점이 축 위에 있다: y축 위의 점은 x좌표가 0, x축 위의 점은 y좌표가 0이다.
        const onY = d.bool(), v = d.until(() => { const a1 = d.int(1, 5), b1 = nz(d, -5, 5), w = nz(d, -5, 5), a2 = d.int(1, 4), b2 = nz(d, -4, 4); return { l1: { a: a1, b: b1, c: onY ? -b1 * w : -a1 * w }, w, a2, b2 }; }, (s) => Math.abs(s.l1.c) <= 20 && s.l1.a * s.b2 !== s.a2 * s.l1.b && Math.abs(s.l1.a) !== Math.abs(s.l1.b));
        const { l1, w, a2, b2 } = v, k = onY ? -b2 * w : -a2 * w, e2 = eq0([a2, X], [b2, Y], Lt(K));
        return ansV(`두 일차방정식 ${gen(l1)}, ${e2}의 그래프의 교점이 ${onY ? Y : X}축 위에 있을 때, 수 ${K}의 값은?`, Q(k), 'int', {
          explain: `${onY ? Y : X}축 위의 점은 ${onY ? X : Y}좌표가 0이다. ${gen(l1)}에 ${nb((onY ? X : Y) + ' = 0')}을 대입하면 ${onY ? Y : X} = ${iq(w)}이므로 교점의 좌표는 ${onY ? pt(0, w) : pt(w, 0)}이다. ${e2}에 이 점의 좌표를 대입하면 ${K} = ${iq(k)}이다.`,
          facts: { value: onY ? `-${jn(b2)}*(-${jn(l1.c)}/${jn(l1.b)})` : `-${jn(a2)}*(-${jn(l1.c)}/${jn(l1.a)})`, unseen: un(l1.a, l1.b, a2, b2), rule: 'meet-on-axis' }
        });
      }
      // 교점의 좌표가 문자 하나로 적혀 있다: (b, tb). 수가 다 적힌 식에서 b 를 구한 뒤 대입한다.
      const v = d.until(() => { const a1 = d.int(1, 4), b1 = nz(d, -3, 3), t = pm(d) * d.int(2, 3), b = nz(d, -3, 3), a2 = d.int(1, 3), al = nz(d, -4, 4); return { a1, b1, t, b, a2, al, c1: -b * (a1 + b1 * t), c2: -(a2 * b + al * t * b) }; },
        (w) => w.a1 + w.b1 * w.t !== 0 && w.c1 !== 0 && Math.abs(w.c1) <= 15 && w.c2 !== 0 && Math.abs(w.c2) <= 15 && w.a1 * w.al !== w.a2 * w.b1);
      const { a1, b1, t, b, a2, al, c1, c2 } = v, l1 = { a: a1, b: b1, c: c1 }, e2 = eq0([a2, X], Lt(A + Y), [c2, '']), second = (t < 0 ? MINUS : '') + Math.abs(t) + Bv, bx = `(-${jn(c1)}/(${jn(a1)}+${jn(b1)}*${jn(t)}))`;
      return ansV(`두 일차방정식 ${gen(l1)}, ${e2}의 그래프의 교점의 좌표가 ${nb(`(${Bv}, ${second})`)}일 때, 수 ${A}의 값은?`, Q(al), 'int', {
        explain: `교점은 두 그래프 위에 모두 있다. ${gen(l1)}에 ${X} = ${Bv}, ${Y} = ${second}를 대입하면 ${Bv} = ${iq(b)}이므로 교점의 좌표는 ${pt(b, t * b)}이다. ${e2}에 ${X} = ${iq(b)}, ${Y} = ${iq(t * b)}${tl(t * b, '을/를')} 대입하면 ${A} = ${iq(al)}이다.`,
        facts: { value: `-(${jn(a2)}*${bx}+${jn(c2)})/(${jn(t)}*${bx})`, unseen: un(a1, b1, a2), rule: 'meet-letter-point' }
      });
    }, { count: 3 }),
    T('meet-coef-from-figure', '두 그래프의 그림에서 교점을 읽어 수 구하기', '①45 심28', (d, n) => {
      const figure = (x0, y0, s1, k1, s2, k2) => bare([[x0, y0]], { lines: [{ a: s1, b: k1 }, { a: s2, b: k2 }], points: [{ x: x0, y: y0, guide: true }], marks: foot(x0, y0), label: `좌표평면: 두 직선이 한 점에서 만난다. 그 점에서 두 축에 내린 점선이 x축의 ${sgn(x0)}, y축의 ${sgn(y0)}에 닿는다.` });
      const ok = (s1, s2) => qcmp(s1, s2) !== 0 && Math.abs(fl(s1)) <= 3 && Math.abs(fl(s2)) <= 3 && Math.abs(fl(s1) - fl(s2)) >= 0.8;
      if (n === 0) {
        // a1·x + b1·y = a (상수항을 모른다), bx + b2·y = c2 (x의 계수를 모른다)
        const v = d.until(() => { const x0 = pm(d) * d.int(2, 4), y0 = pm(d) * d.int(2, 4), a1 = d.int(1, 3), b1 = nz(d, -3, 3), b = nz(d, -4, 4), b2 = nz(d, -2, 2); return { x0, y0, a1, b1, b, b2, a: a1 * x0 + b1 * y0, c2: b * x0 + b2 * y0 }; }, (w) => w.a !== 0 && Math.abs(w.c2) <= 15 && gcd(w.a1, w.b1) === 1 && ok(Q(-w.a1, w.b1), Q(-w.b, w.b2)));
        const { x0, y0, a1, b1, b, b2, a, c2 } = v, e1 = eqR([[a1, X], [b1, Y]], A), e2 = eqR([Lt(Bv + X), [b2, Y]], c2);
        return M(`그림은 두 일차방정식 ${e1}, ${e2}의 그래프이다. 수 ${A}, ${Bv}의 값을 각각 구하시오.`, [{ label: `${A} =`, answer: a, signed: true }, { label: `${Bv} =`, answer: b, signed: true }], {
          figure: figure(x0, y0, Q(-a1, b1), Q(a, b1), Q(-b, b2), Q(c2, b2)),
          explain: `두 그래프의 교점의 좌표가 ${pt(x0, y0)}이다. ${e1}에 ${X} = ${iq(x0)}, ${Y} = ${iq(y0)}${tl(y0, '을/를')} 대입하면 ${A} = ${iq(a)}이고, ${e2}에 대입하면 ${Bv} = ${iq(b)}이다.`,
          facts: { calc: [[`${jn(a1)}*${jn(x0)}+${jn(b1)}*${jn(y0)}`, 0], [`(${jn(c2)}-${jn(b2)}*${jn(y0)})/${jn(x0)}`, 1]], unseen: un(a1, b1, b2), rule: 'figure-coef' }
        });
      }
      // ax − by = c1, bx + ay = c2: 교점의 좌표를 대입하면 a, b 에 대한 연립방정식이 된다.
      const v = d.until(() => { const a = nz(d, -3, 3), b = nz(d, -3, 3), x0 = pm(d) * d.int(2, 4), y0 = pm(d) * d.int(2, 4); return { a, b, x0, y0, c1: a * x0 - b * y0, c2: b * x0 + a * y0 }; }, (w) => Math.abs(w.a) !== Math.abs(w.b) && Math.abs(w.c1) <= 15 && Math.abs(w.c2) <= 15 && w.c1 !== 0 && w.c2 !== 0);
      const { a, b, x0, y0, c1, c2 } = v, e1 = eqR([Lt(A + X), Lt(Bv + Y, -1)], c1), e2 = eqR([Lt(Bv + X), Lt(A + Y)], c2), den = `(${jn(x0)}*${jn(x0)}+${jn(y0)}*${jn(y0)})`;
      const sub = (u, w, L1, L2, s) => sum([Lt((Math.abs(u) === 1 ? '' : Math.abs(u)) + L1, Math.sign(u)), Lt((Math.abs(w) === 1 ? '' : Math.abs(w)) + L2, s * Math.sign(w))]);
      return M(`그림은 연립방정식 ${sys([e1, e2])}의 해를 구하기 위하여 두 일차방정식의 그래프를 그린 것이다. 수 ${A}, ${Bv}의 값을 각각 구하시오.`, [{ label: `${A} =`, answer: a, signed: true }, { label: `${Bv} =`, answer: b, signed: true }], {
        figure: figure(x0, y0, Q(a, b), Q(-c1, b), Q(-b, a), Q(c2, a)),
        explain: `두 그래프의 교점의 좌표 ${ptj(x0, y0, '이/가')} 연립방정식의 해이다. ${X} = ${iq(x0)}, ${Y} = ${iq(y0)}${tl(y0, '을/를')} 두 일차방정식에 대입하면 ${nb(sub(x0, y0, A, Bv, -1) + ' = ' + iq(c1))}, ${nb(sub(x0, y0, Bv, A, 1) + ' = ' + iq(c2))}이다. 두 식을 연립하여 풀면 ${A} = ${iq(a)}, ${Bv} = ${iq(b)}이다.`,
        facts: { calc: [[`(${jn(c1)}*${jn(x0)}+${jn(c2)}*${jn(y0)})/${den}`, 0], [`(${jn(c2)}*${jn(x0)}-${jn(c1)}*${jn(y0)})/${den}`, 1]], rule: 'figure-system' }
      });
    }, { count: 2 }),
    T('meet-line-with-slope', '교점을 지나고 기울기가 주어진 직선의 방정식', '①46', (d) => {
      const v = d.until(() => Object.assign(twoThrough(d, 12), { m: pm(d) * d.int(2, 4) }), (w) => w.y0 - w.m * w.x0 !== 0 && Math.abs(w.y0 - w.m * w.x0) <= 15), { x0, y0, l1, l2, m } = v, k = y0 - m * x0;
      return lineAns(`두 일차방정식 ${std(l1)}, ${std(l2)}의 그래프의 교점을 지나고 기울기가 ${iq(m)}인 직선의 방정식은?`, m, k, {
        explain: `연립방정식 ${sys([std(l1), std(l2)])}${tl(l2.c, '을/를')} 풀면 ${X} = ${iq(x0)}, ${Y} = ${iq(y0)}이므로 교점의 좌표는 ${pt(x0, y0)}이다. 직선의 방정식을 ${nb(`${Y} = ${sum([[m, X], Lt(Bv)])}`)}로 놓고 ${X} = ${iq(x0)}, ${Y} = ${iq(y0)}${tl(y0, '을/를')} 대입하면 ${Bv} = ${iq(k)}이다. 따라서 ${fn(m, k)}이다.`,
        facts: { calc: [[jn(m), 0], [`(${Y0(l1, l2)})-${jn(m)}*(${X0(l1, l2)})`, 1]], unseen: un(l1.a, l1.b, l2.a, l2.b) }
      });
    }),
    T('meet-axis-line', '교점을 지나고 축에 평행한 직선의 방정식', '①47', (d) => {
      const v = d.until(() => twoThrough(d, 12), (w) => Math.abs(w.x0) !== Math.abs(w.y0)), { x0, y0, l1, l2 } = v, ax = d.pick(['x', 'y']);
      return axisPick(d, `두 일차방정식 ${std(l1)}, ${std(l2)}의 그래프의 교점을 지나고 ${ax === 'x' ? X : Y}축에 평행한 직선의 방정식은?`, ax === 'x' ? ['y', y0] : ['x', x0], ax === 'x' ? x0 : y0, {
        explain: `연립방정식 ${sys([std(l1), std(l2)])}${tl(l2.c, '을/를')} 풀면 ${X} = ${iq(x0)}, ${Y} = ${iq(y0)}이므로 교점의 좌표는 ${pt(x0, y0)}이다. 이 점을 지나고 ${ax === 'x' ? X : Y}축에 평행한 직선의 방정식은 ${ax === 'x' ? yEq(y0) : xEq(x0)}이다.`
      });
    }),
    T('meet-three-lines', '세 직선이 한 점에서 만날 때 수 구하기', '①48 심35', (d) => {
      // 수가 다 적힌 두 일차방정식의 교점을 구해 셋째 식에 대입한다. 구하는 수 a 는 셋째 식의 x의 계수이거나 y의 계수이다.
      const v = d.until(() => Object.assign(twoThrough(d, 12), { al: nz(d, -5, 5), o: nz(d, -3, 3), onX: d.bool() }), (w) => { const l3 = w.onX ? { a: w.al, b: w.o } : { a: w.o, b: w.al }, c3 = l3.a * w.x0 + l3.b * w.y0; return c3 !== 0 && Math.abs(c3) <= 20 && l3.a * w.l1.b !== w.l1.a * l3.b && l3.a * w.l2.b !== w.l2.a * l3.b; });
      const { x0, y0, l1, l2, al, o, onX } = v, c3 = onX ? al * x0 + o * y0 : o * x0 + al * y0, e3 = onX ? eqR([Lt(A + X), [o, Y]], c3) : eqR([[o, X], Lt(A + Y)], c3);
      return ansV(`세 일차방정식 ${std(l1)}, ${std(l2)}, ${e3}의 그래프가 한 점에서 만날 때, 수 ${A}의 값은?`, Q(al), 'int', {
        explain: `세 그래프가 한 점에서 만나므로 두 그래프의 교점을 나머지 그래프도 지난다. 연립방정식 ${sys([std(l1), std(l2)])}${tl(l2.c, '을/를')} 풀면 ${X} = ${iq(x0)}, ${Y} = ${iq(y0)}이므로 교점의 좌표는 ${pt(x0, y0)}이다. ${e3}에 ${X} = ${iq(x0)}, ${Y} = ${iq(y0)}${tl(y0, '을/를')} 대입하면 ${A} = ${iq(al)}이다.`,
        facts: { value: onX ? `(${jn(c3)}-${jn(o)}*(${Y0(l1, l2)}))/(${X0(l1, l2)})` : `(${jn(c3)}-${jn(o)}*(${X0(l1, l2)}))/(${Y0(l1, l2)})`, unseen: un(l1.a, l1.b, l2.a, l2.b, o) }
      });
    }),
    T('meet-four-lines', '네 직선이 한 점에서 만날 때 수 구하기', '①49', (d) => {
      // 수가 다 적힌 두 일차방정식을 골라 교점을 구하고, 그 좌표를 문자가 든 두 식에 하나씩 대입한다. 문자가 든 식과 수만 있는 식을 번갈아 적는다.
      const v = d.until(() => Object.assign(twoThrough(d, 12), { al: nz(d, -5, 5), o1: nz(d, -3, 3), o2: nz(d, -3, 3), be: nz(d, -5, 5) }), (w) => {
        const c3 = w.al * w.x0 + w.o1 * w.y0, c4 = w.o2 * w.x0 + w.be * w.y0, apart = (p, q) => p * w.l1.b !== w.l1.a * q && p * w.l2.b !== w.l2.a * q;
        return c3 !== 0 && c4 !== 0 && Math.abs(c3) <= 20 && Math.abs(c4) <= 20 && apart(w.al, w.o1) && apart(w.o2, w.be) && w.al * w.be !== w.o1 * w.o2;
      });
      const { x0, y0, l1, l2, al, o1, o2, be } = v, c3 = al * x0 + o1 * y0, c4 = o2 * x0 + be * y0, e3 = eqR([Lt(A + X), [o1, Y]], c3), e4 = eqR([[o2, X], Lt(Bv + Y)], c4);
      return M(`네 일차방정식 ${e3}, ${std(l1)}, ${e4}, ${std(l2)}의 그래프가 한 점에서 만날 때, 수 ${A}, ${Bv}의 값을 각각 구하시오.`, [{ label: `${A} =`, answer: al, signed: true }, { label: `${Bv} =`, answer: be, signed: true }], {
        explain: `네 그래프가 한 점에서 만나므로, 수가 모두 주어진 두 일차방정식의 그래프의 교점을 나머지 두 그래프도 지난다. 연립방정식 ${sys([std(l1), std(l2)])}${tl(l2.c, '을/를')} 풀면 ${X} = ${iq(x0)}, ${Y} = ${iq(y0)}이므로 교점의 좌표는 ${pt(x0, y0)}이다. ${X} = ${iq(x0)}, ${Y} = ${iq(y0)}${tl(y0, '을/를')} ${e3}에 대입하면 ${A} = ${iq(al)}이고, ${e4}에 대입하면 ${Bv} = ${iq(be)}이다.`,
        facts: { calc: [[`(${jn(c3)}-${jn(o1)}*(${Y0(l1, l2)}))/(${X0(l1, l2)})`, 0], [`(${jn(c4)}-${jn(o2)}*(${X0(l1, l2)}))/(${Y0(l1, l2)})`, 1]], unseen: un(l1.a, l1.b, l2.a, l2.b, o1, o2) }
      });
    })
  ]);

  B.addTypes('8-1-6', 'count', [
    T('count-from-graph', '두 그래프의 위치 관계를 보고 연립방정식의 해의 개수 알기', '①50', (d) => {
      // 평행한 두 직선이거나, 겹쳐져 한 직선이 된 두 그래프
      const par = d.bool(), m = d.pick([Q(1), Q(-1), Q(2), Q(-2), Q(1, 2), Q(-1, 2)]), [k1, k2] = d.pick([[2, -2], [3, -1], [1, -3]]), kind = par ? 'none' : 'many';
      return pick1(d, par ? `그림의 두 직선 ㉠, ㉡은 ${X}, ${Y}에 대한 어떤 연립방정식의 두 일차방정식의 그래프이고, 서로 평행하다. 이 연립방정식의 해에 대한 설명으로 옳은 것은?` : `${X}, ${Y}에 대한 어떤 연립방정식의 두 일차방정식의 그래프 ㉠, ㉡을 그렸더니 그림과 같이 한 직선으로 겹쳐졌다. 이 연립방정식의 해에 대한 설명으로 옳은 것은?`, SOLS.map((row) => [row[0], row[1] === kind]), {
        fixed: true,
        figure: board({ lines: par ? [{ a: m, b: k1, name: LAB[0] }, { a: m, b: k2, name: LAB[1] }] : [{ a: m, b: k1, name: '㉠, ㉡' }] }),
        explain: par ? '연립방정식의 해는 두 일차방정식의 그래프의 교점의 좌표와 같다. 두 그래프가 서로 평행하면 교점이 없으므로 연립방정식의 해가 없다.' : '연립방정식의 해는 두 일차방정식의 그래프의 교점의 좌표와 같다. 두 그래프가 일치하면 직선 위의 모든 점이 교점이므로 연립방정식의 해가 무수히 많다.'
      });
    }),
    T('count-classify', '연립방정식의 해의 개수 가리기', '①51 · 8-1-4 ①35', (d) => {
      const kind = d.pick(['none', 'many', 'one']), l1 = baseLine(d), t = d.pick([-3, -2, 2, 3]);
      const l2 = kind === 'many' ? times(l1, t) : kind === 'none' ? times(l1, t, nz(d, -5, 5)) : d.until(() => ({ a: t * l1.a, b: t * l1.b + nz(d, -2, 2), c: t * l1.c }), (l) => l.b !== 0);
      const rows = d.shuffle([l1, l2]), told = { none: `${std(l2)}의 ${X}, ${Y}의 계수는 ${std(l1)}의 ${iq(t)}배이고 상수항은 ${iq(t)}배가 아니므로 두 일차방정식의 그래프는 서로 평행하다. 교점이 없으므로 해가 없다.`, many: `${std(l1)}의 양변에 ${iq(t)}${tl(t, '을/를')} 곱하면 ${std(l2)}${tl(l2.c, '이/가')} 되므로 두 일차방정식의 그래프는 일치한다. 따라서 해가 무수히 많다.`, one: `두 일차방정식의 그래프의 기울기가 ${tx(slope(rows[0]))}, ${tj(slope(rows[1]), '으로/로')} 서로 다르므로 두 그래프는 한 점에서 만난다. 따라서 해가 한 쌍뿐이다.` };
      return pick1(d, `연립방정식 ${sys(rows.map(std))}의 해에 대한 설명으로 옳은 것은?`, SOLS.map((row) => [row[0], row[1] === relOf(l1, l2)]), { fixed: true, explain: told[relOf(l1, l2)] });
    }),
    T('count-pick-system', '해가 없는(무수히 많은) 연립방정식 고르기', '①51 · 8-1-4 ①34', (d, n) => {
      const target = n === 0 ? 'none' : 'many';
      const make = (kind) => { const l1 = baseLine(d), t = d.pick([-2, 2, 3]); const l2 = kind === 'many' ? times(l1, t) : kind === 'none' ? times(l1, t, nz(d, -5, 5)) : kind === 'flip' ? { a: l1.a, b: -l1.b, c: l1.c } : { a: t * l1.a, b: t * l1.b + pm(d), c: t * l1.c }; return { l1, l2, t }; };
      const rows = d.shuffle(['none', 'many', 'flip', 'one'].map(make)), hit = rows.find((r) => relOf(r.l1, r.l2) === target);
      return pick1(d, `다음 연립방정식 중 해가 ${n === 0 ? '없는' : '무수히 많은'} 것은?`, rows.map((r) => [sys([std(r.l1), std(r.l2)]), relOf(r.l1, r.l2) === target]), {
        fixed: true,
        explain: n === 0 ? `두 일차방정식의 그래프가 서로 평행하면 해가 없다. ${sys([std(hit.l1), std(hit.l2)])}에서 둘째 식의 ${X}, ${Y}의 계수는 첫째 식의 ${iq(hit.t)}배이고 상수항은 ${iq(hit.t)}배가 아니므로 두 그래프는 평행하다.` : `두 일차방정식의 그래프가 일치하면 해가 무수히 많다. ${sys([std(hit.l1), std(hit.l2)])}에서 첫째 식의 양변에 ${iq(hit.t)}${tl(hit.t, '을/를')} 곱하면 둘째 식이 되므로 두 그래프는 일치한다.`,
        facts: { rule: 'pick-system-' + target }
      });
    }, { count: 2 }),
    T('count-no-meet-pick', '한 직선과 만나지 않는 직선 고르기', '①52', (d) => {
      // 보기: 평행한 것(답), 일치하는 것(만나지 않는 것이 아니다), 기울기의 부호가 다른 것, x와 y의 계수를 바꾼 것
      const [p, q] = d.pick(FRS), s = pm(d), k = nz(d, -4, 4), m = Q(s * p, q), t = d.pick([2, 3]), c0 = d.until(() => nz(d, -7, 7), (v) => v !== s * q * k), base = { a: p, b: -s * q, c: s * q * k };
      const cands = [{ a: p, b: -s * q, c: c0 }, times(base, t), { a: p, b: s * q, c: nz(d, -7, 7) }, { a: q, b: -s * p, c: nz(d, -7, 7) }];
      return pick1(d, `다음 일차방정식 중 그 그래프가 일차함수 ${fn(m, k)}의 그래프와 만나지 않는 것은?`, cands.map((l) => [gen(l), relOf(l, base) === 'none']), {
        explain: `기울기가 같고 ${Y}절편이 다른 두 직선은 서로 평행하여 만나지 않는다. ${gen(cands[0])}에서 ${fn(m, yint(cands[0]))}이므로 기울기는 같고 ${Y}절편은 다르다. ${gen(cands[1])}${tl(0, '은/는')} ${fn(m, k)}${tl(k, '으로/로')} 정리되어 두 그래프가 일치하므로 무수히 많은 점에서 만난다.`
      });
    }),
    T('count-none-coef', '해가 없을 때 수 구하기', '①53 · 8-1-4 ①37 · 8-1-4 심35', (d, n) => {
      const l1 = baseLine(d), t = d.pick([-3, -2, 2, 3]);
      if (n === 0) {
        // x, y의 계수의 비는 같고 상수항의 비만 다르다. 구하는 수 a 는 x의 계수이거나 y의 계수이다.
        const onX = d.bool(), c = d.until(() => nz(d, -9, 9), (v) => v !== -t * l1.c), e2 = onX ? eqR([Lt(A + X), [t * l1.b, Y]], c) : eqR([[t * l1.a, X], Lt(A + Y)], c), rows = d.bool() ? [std(l1), e2] : [e2, std(l1)], a = onX ? t * l1.a : t * l1.b;
        return ansV(`연립방정식 ${sys(rows)}의 해가 없을 때, 수 ${A}의 값은?`, Q(a), 'int', {
          explain: `해가 없으려면 두 일차방정식의 그래프가 서로 평행해야 한다. ${onX ? Y : X}의 계수 ${iq(onX ? t * l1.b : t * l1.a)}${tl(onX ? t * l1.b : t * l1.a, '이/가')} ${iq(onX ? l1.b : l1.a)}의 ${iq(t)}배이므로 ${onX ? X : Y}의 계수도 ${iq(t)}배이어야 한다. 따라서 ${A} = ${iq(onX ? l1.a : l1.b)} × ${t < 0 ? '(' + iq(t) + ')' : t} = ${iq(a)}이다. 이때 상수항은 ${iq(t)}배가 아니므로 두 그래프는 일치하지 않는다.`,
          facts: { value: onX ? `${jn(t * l1.b)}*${jn(l1.a)}/${jn(l1.b)}` : `${jn(t * l1.a)}*${jn(l1.b)}/${jn(l1.a)}`, unseen: un(l1.a, l1.b), rule: 'none-coef' }
        });
      }
      // 정리되지 않은 식: ax + By = ex + c 에서 ex 를 먼저 옮긴다.
      const e = nz(d, -4, 4), c = d.until(() => nz(d, -9, 9), (v) => v !== -t * l1.c), a = e + t * l1.a, e1 = eqR([Lt(A + X), [t * l1.b, Y]], [[e, X], [c, '']]);
      return ansV(`연립방정식 ${sys([e1, std(l1)])}의 해가 없을 때, 수 ${A}의 값은?`, Q(a), 'int', {
        explain: `${e1}에서 ${nb(`(${sum([Lt(A), [-e, '']])})${X} ${t * l1.b < 0 ? MINUS : '+'} ${Math.abs(t * l1.b) === 1 ? '' : Math.abs(t * l1.b)}${Y} = ${iq(c)}`)}이다. 해가 없으려면 두 일차방정식의 그래프가 서로 평행해야 한다. ${Y}의 계수가 ${iq(l1.b)}의 ${iq(t)}배이므로 ${X}의 계수도 ${iq(t)}배이어야 한다. ${nb(sum([Lt(A), [-e, '']]) + ' = ' + iq(t * l1.a))}에서 ${A} = ${iq(a)}이다.`,
        facts: { value: `${jn(e)}+${jn(t * l1.b)}*${jn(l1.a)}/${jn(l1.b)}`, unseen: un(l1.a, l1.b, e), rule: 'none-coef-move' }
      });
    }, { count: 2 }),
    T('count-none-forbidden', '해가 없을 조건: 값과 될 수 없는 값', '①54 심40', (d, n) => {
      const l1 = baseLine(d), t = d.pick([-3, -2, 2, 3]), r = -l1.c;
      if (n === 0) {
        // 계수는 이미 t배이다. 상수항 a 가 t배이면 두 그래프가 일치하므로 a 는 그 값만 될 수 없다.
        const e2 = eqR([[t * l1.a, X], [t * l1.b, Y]], A);
        return ansV(`연립방정식 ${sys([std(l1), e2])}의 해가 없을 때, 수 ${A}의 값이 될 수 없는 수는?`, Q(t * r), 'int', {
          explain: `둘째 식의 ${X}, ${Y}의 계수는 첫째 식의 ${iq(t)}배이다. 상수항도 ${iq(t)}배이면, 곧 ${A} = ${iq(t * r)}이면 두 일차방정식의 그래프가 일치하여 해가 무수히 많다. 해가 없으려면 ${A} ≠ ${iq(t * r)}이어야 한다.`,
          facts: { value: `${jn(t * l1.a)}*${jn(r)}/${jn(l1.a)}`, unseen: un(l1.a), rule: 'none-forbidden' }
        });
      }
      // ax + (tq)y = c, px + qy = b: a = tp 이고 b ≠ c/t
      const w = nz(d, -5, 5), c = t * w, e1 = eqR([Lt(A + X), [t * l1.b, Y]], c), e2 = eqR([[l1.a, X], [l1.b, Y]], Bv);
      return inline(`연립방정식 ${sys([e1, e2])}의 해가 없도록 하는 수 ${A}, ${Bv}의 조건을 구하시오.`, `${nb(`${A} = {0},`)} ${nb(`${Bv} ≠ {1}`)}`, [{ answer: t * l1.a, signed: true }, { answer: w, signed: true }], {
        shown: `${A} = ${iq(t * l1.a)}, ${Bv} ≠ ${iq(w)}`,
        explain: `해가 없으려면 두 일차방정식의 그래프가 서로 평행해야 한다. 첫째 식의 ${Y}의 계수가 둘째 식의 ${iq(t)}배이므로 ${X}의 계수도 ${iq(t)}배이어야 한다. 따라서 ${A} = ${iq(t * l1.a)}이다. 상수항까지 ${iq(t)}배이면 두 그래프가 일치하므로 ${nb(`${t < 0 ? MINUS : ''}${Math.abs(t)}${Bv} ≠ ${iq(c)}`)}, 곧 ${Bv} ≠ ${iq(w)}이어야 한다.`,
        facts: { calc: [[`${jn(t * l1.b)}*${jn(l1.a)}/${jn(l1.b)}`, 0], [`${jn(c)}*${jn(l1.b)}/${jn(t * l1.b)}`, 1]], unseen: un(l1.a, l1.b), rule: 'none-both' }
      });
    }, { count: 2 }),
    T('count-many-coef', '해가 무수히 많을 때 수 구하기', '①55 · 8-1-4 ①36 · 8-1-4 심34', (d, n) => {
      if (n === 0) {
        // px + qy = a, bx + (tq)y = tr: 두 그래프가 일치하려면 계수와 상수항이 모두 t배이다.
        const l1 = baseLine(d), t = d.pick([-3, -2, 2, 3]), r = -l1.c, e1 = eqR([[l1.a, X], [l1.b, Y]], A), e2 = eqR([Lt(Bv + X), [t * l1.b, Y]], t * r);
        return M(`연립방정식 ${sys([e1, e2])}의 해가 무수히 많을 때, 수 ${A}, ${Bv}의 값을 각각 구하시오.`, [{ label: `${A} =`, answer: r, signed: true }, { label: `${Bv} =`, answer: t * l1.a, signed: true }], {
          explain: `해가 무수히 많으려면 두 일차방정식의 그래프가 일치해야 한다. 둘째 식의 ${Y}의 계수가 첫째 식의 ${iq(t)}배이므로 ${X}의 계수와 상수항도 ${iq(t)}배이어야 한다. ${Bv} = ${iq(l1.a)} × ${t < 0 ? '(' + iq(t) + ')' : t} = ${iq(t * l1.a)}이고, ${nb(`${t < 0 ? MINUS : ''}${Math.abs(t)}${A} = ${iq(t * r)}`)}에서 ${A} = ${iq(r)}이다.`,
          facts: { calc: [[`${jn(t * r)}*${jn(l1.b)}/${jn(t * l1.b)}`, 0], [`${jn(l1.a)}*${jn(t * l1.b)}/${jn(l1.b)}`, 1]], unseen: un(l1.a, l1.b), rule: 'many-coef' }
        });
      }
      // (a + u)x + qy = r, (ka + w)x + (tq)y = b: t(a + u) = ka + w 에서 a 를, b = tr 을 구한다.
      const v = d.until(() => { const t = d.pick([-2, 2, 3]), k = d.pick([1, 2, 3]), u = nz(d, -4, 4), a = nz(d, -6, 6), q = pm(d) * d.pick([1, 2]), r = nz(d, -5, 5); return { t, k, u, a, q, r, w: a * (t - k) + t * u }; }, (s) => s.t !== s.k && s.w !== 0 && Math.abs(s.w) <= 12 && s.a + s.u !== 0);
      const { t, k, u, a, q, r, w } = v, c1 = `(${sum([Lt(A), [u, '']])})`, c2 = `(${sum([Lt((k === 1 ? '' : k) + A), [w, '']])})`, e1 = eqR([Lt(c1 + X), [q, Y]], r), e2 = eqR([Lt(c2 + X), [t * q, Y]], Bv);
      return M(`연립방정식 ${sys([e1, e2])}의 해가 무수히 많을 때, 수 ${A}, ${Bv}의 값을 각각 구하시오.`, [{ label: `${A} =`, answer: a, signed: true }, { label: `${Bv} =`, answer: t * r, signed: true }], {
        explain: `해가 무수히 많으려면 두 일차방정식의 그래프가 일치해야 한다. 둘째 식의 ${Y}의 계수가 첫째 식의 ${iq(t)}배이므로 ${X}의 계수와 상수항도 ${iq(t)}배이어야 한다. ${nb(`${t < 0 ? MINUS : ''}${Math.abs(t)}${c1} = ${sum([Lt((k === 1 ? '' : k) + A), [w, '']])}`)}에서 ${A} = ${iq(a)}이고, ${Bv} = ${iq(r)} × ${t < 0 ? '(' + iq(t) + ')' : t} = ${iq(t * r)}이다.`,
        facts: { calc: [[`(${jn(w)}-${jn(t * q)}/${jn(q)}*${jn(u)})/(${jn(t * q)}/${jn(q)}-${k})`, 0], [`${jn(t * q)}/${jn(q)}*${jn(r)}`, 1]], unseen: [1], rule: 'many-coef-expr' }
      });
    }, { count: 2 }),
    T('count-many-then-quadrant', '해가 무수히 많을 조건으로 수를 구해 다른 그래프 알아보기', '①56 심37', (d) => {
      const l1 = baseLine(d), t = d.pick([-3, -2, 2, 3]), r = -l1.c, a = t * l1.a, b = t * r, miss = missing(a, b), e2 = eqR([Lt(A + X), [t * l1.b, Y]], Bv);
      return pick1(d, `연립방정식 ${sys([std(l1), e2])}의 해가 무수히 많을 때, 일차함수 ${nb(`${Y} = ${A}${X} + ${Bv}`)}의 그래프가 지나지 않는 사분면은?`, QUAD.map((q, i) => [q, i === miss - 1]), {
        fixed: true,
        explain: `해가 무수히 많으려면 두 일차방정식의 그래프가 일치해야 한다. 둘째 식의 ${Y}의 계수가 첫째 식의 ${iq(t)}배이므로 ${A} = ${iq(a)}, ${Bv} = ${iq(b)}이다. ${fn(a, b)}의 그래프는 기울기가 ${a > 0 ? '양수' : '음수'}이고 ${Y}절편이 ${b > 0 ? '양수' : '음수'}이므로 ${QUAD[miss - 1]}을 지나지 않는다.`
      });
    }),
    T('count-one-forbidden', '한 쌍의 해를 가질 조건', '①57', (d) => {
      const l1 = baseLine(d), t = d.pick([-3, -2, 2, 3]), c = nz(d, -9, 9), e2 = eqR([Lt(A + X), [t * l1.b, Y]], c);
      return ansV(`연립방정식 ${sys([std(l1), e2])}의 해가 오직 한 쌍뿐일 때, 수 ${A}의 값이 될 수 없는 수는?`, Q(t * l1.a), 'int', {
        explain: `해가 한 쌍뿐이려면 두 일차방정식의 그래프가 한 점에서 만나야 하므로 두 그래프의 기울기가 달라야 한다. 둘째 식의 ${Y}의 계수가 첫째 식의 ${iq(t)}배이므로, ${X}의 계수까지 ${iq(t)}배이면 기울기가 같아진다. 따라서 ${A} ≠ ${iq(t * l1.a)}이어야 한다.`,
        facts: { value: `${jn(t * l1.b)}*${jn(l1.a)}/${jn(l1.b)}`, unseen: un(l1.a, l1.b) }
      });
    })
  ]);

  B.addTypes('8-1-6', 'area', [
    T('area-axes', '그래프와 x축, y축으로 둘러싸인 도형의 넓이', '①60', (d) => {
      const [p, q] = d.until(() => [nz(d, -8, 8), nz(d, -8, 8)], ([u, v]) => (u * v) % 2 === 0 && Math.abs(u) !== Math.abs(v) && Math.abs(u * v) <= 40), l = byCuts(p, q), area = Math.abs(p * q) / 2;
      return N(`일차방정식 ${gen(l)}의 그래프와 ${X}축, ${Y}축으로 둘러싸인 도형의 넓이는?`, area, {
        explain: `${gen(l)}에 ${nb(Y + ' = 0')}을 대입하면 ${X} = ${iq(p)}, ${nb(X + ' = 0')}을 대입하면 ${Y} = ${iq(q)}이므로 ${X}절편은 ${iq(p)}, ${Y}절편은 ${iq(q)}이다. 둘러싸인 도형은 직각을 낀 두 변의 길이가 ${Math.abs(p)}, ${Math.abs(q)}인 직각삼각형이므로 넓이는 ${frac(1, 2)} × ${Math.abs(p)} × ${Math.abs(q)} = ${area}이다.`,
        facts: { value: absx(`${jn(l.c)}*${jn(l.c)}/(${jn(l.a)}*${jn(l.b)})/2`, l.a * l.b), unseen: un(l.a, l.b).concat([2]) }
      });
    }, { standard: STD1 }),
    T('area-two-lines-x', '두 직선과 x축으로 둘러싸인 도형의 넓이', '①61 심42', (d) => {
      // 교점 (x0, y0)과 두 x절편 p1 < p2
      const v = d.until(() => { const x0 = d.int(-3, 3), y0 = pm(d) * d.int(2, 6), p1 = d.int(-7, 2), p2 = d.int(-2, 7); return { x0, y0, p1, p2 }; }, (w) => w.p2 - w.p1 >= 3 && w.p1 !== 0 && w.p2 !== 0 && w.x0 !== w.p1 && w.x0 !== w.p2 && ((w.p2 - w.p1) * w.y0) % 2 === 0 && [through(w.p1, 0, w.y0, w.x0 - w.p1), through(w.p2, 0, w.y0, w.x0 - w.p2)].every((l) => Math.abs(l.a) <= 6 && Math.abs(l.b) <= 6 && Math.abs(l.c) <= 18));
      const { x0, y0, p1, p2 } = v, l1 = through(p1, 0, y0, x0 - p1), l2 = through(p2, 0, y0, x0 - p2), area = (p2 - p1) * Math.abs(y0) / 2;
      return N(`두 일차방정식 ${gen(l1)}, ${gen(l2)}의 그래프와 ${X}축으로 둘러싸인 도형의 넓이는?`, area, {
        explain: `두 그래프의 ${X}절편은 각각 ${iq(p1)}, ${iq(p2)}이고, 두 일차방정식을 연립하여 풀면 교점의 좌표는 ${pt(x0, y0)}이다. 둘러싸인 도형은 밑변의 길이가 ${nb(`${iq(p2)} − ${p1 < 0 ? '(' + iq(p1) + ')' : p1} = ${p2 - p1}`)}, 높이가 ${Math.abs(y0)}인 삼각형이므로 넓이는 ${frac(1, 2)} × ${p2 - p1} × ${Math.abs(y0)} = ${area}이다.`,
        facts: { value: absx(`((-${jn(l2.c)}/${jn(l2.a)})-(-${jn(l1.c)}/${jn(l1.a)}))*(${Y0(l1, l2)})/2`, y0), unseen: un(l1.a, l1.b, l2.a, l2.b).concat([2]) }
      });
    }),
    T('area-two-lines-y', '두 직선과 y축으로 둘러싸인 도형의 넓이', '①63', (d, n) => {
      if (n === 0) {
        // 식을 준다. 교점 (x0, y0)과 두 y절편 q1 > y0 > q2 (한 직선은 내려가고 한 직선은 올라간다)
        const v = d.until(() => { const x0 = pm(d) * d.int(2, 4), y0 = d.int(-2, 3), q1 = d.int(2, 6), q2 = d.int(-5, 1); return { x0, y0, q1, q2 }; }, (w) => w.q1 - w.y0 >= 1 && w.y0 - w.q2 >= 1 && w.q2 !== 0 && w.q1 - w.q2 >= 3 && ((w.q1 - w.q2) * w.x0) % 2 === 0 && [through(0, w.q1, w.y0 - w.q1, w.x0), through(0, w.q2, w.y0 - w.q2, w.x0)].every((l) => Math.abs(l.a) <= 5 && Math.abs(l.b) <= 5 && Math.abs(l.c) <= 18));
        const { x0, y0, q1, q2 } = v, l1 = through(0, q1, y0 - q1, x0), l2 = through(0, q2, y0 - q2, x0), area = (q1 - q2) * Math.abs(x0) / 2;
        return N(`그림과 같이 두 일차방정식 ${gen(l1)}, ${gen(l2)}의 그래프와 ${Y}축으로 둘러싸인 도형의 넓이는?`, area, {
          figure: bare([[x0, y0], [0, q1], [0, q2]], { lines: [{ a: slope(l1), b: q1 }, { a: slope(l2), b: q2 }], poly: [[0, q1], [x0, y0], [0, q2]], label: `좌표평면: 눈금 없는 그림. 두 직선이 y축의 ${x0 > 0 ? '오른쪽' : '왼쪽'}에서 만난다. 두 직선과 y축으로 둘러싸인 삼각형에 색칠하였다.` }),
          explain: `두 그래프의 ${Y}절편은 각각 ${iq(q1)}, ${iq(q2)}이고, 두 일차방정식을 연립하여 풀면 교점의 좌표는 ${pt(x0, y0)}이다. 둘러싸인 도형은 ${Y}축 위의 변의 길이가 ${nb(`${iq(q1)} − ${q2 < 0 ? '(' + iq(q2) + ')' : q2} = ${q1 - q2}`)}, 높이가 ${Math.abs(x0)}인 삼각형이므로 넓이는 ${frac(1, 2)} × ${q1 - q2} × ${Math.abs(x0)} = ${area}이다.`,
          facts: { value: absx(`((-${jn(l1.c)}/${jn(l1.b)})-(-${jn(l2.c)}/${jn(l2.b)}))*(${X0(l1, l2)})/2`, x0), unseen: un(l1.a, l1.b, l2.a, l2.b).concat([2]), rule: 'area-y-eq' }
        });
      }
      // 식 없이 그림만: 교점 (x0, y0), 한 직선의 y절편 q1, 다른 직선의 x절편 p2. 둘째 직선의 y절편을 구해야 한다.
      const v = d.until(() => { const x0 = d.int(3, 5), y0 = d.int(1, 3), p2 = d.int(1, 4), q1 = d.int(2, 5); return { x0, y0, p2, q1 }; }, (w) => w.p2 < w.x0 && w.q1 > w.y0 && (w.p2 * w.y0) % (w.x0 - w.p2) === 0 && w.p2 * w.y0 / (w.x0 - w.p2) <= 5 && ((w.q1 + w.p2 * w.y0 / (w.x0 - w.p2)) * w.x0) % 2 === 0);
      const { x0, y0, p2, q1 } = v, q2 = -p2 * y0 / (x0 - p2), area = (q1 - q2) * x0 / 2, m2 = Q(y0, x0 - p2);
      return N(`그림에서 두 직선의 교점의 좌표가 ${pt(x0, y0)}일 때, 색칠한 부분의 넓이는?`, area, {
        figure: bare([[x0, y0], [0, q1], [0, q2]], { lines: [{ a: Q(y0 - q1, x0), b: q1 }, { a: m2, b: q2 }], poly: [[0, q1], [x0, y0], [0, q2]], points: [{ x: x0, y: y0 }], marks: [{ ax: 'y', at: q1, text: sgn(q1), side: 'l', shift: 4 }, { ax: 'x', at: p2, text: sgn(p2), side: 'd', shift: 8 }], label: `좌표평면: 오른쪽 아래로 향하는 직선은 y축과 ${q1}인 점에서 만나고, 오른쪽 위로 향하는 직선은 x축과 ${p2}인 점에서 만난다. 두 직선은 점 (${x0}, ${y0})에서 만난다. 두 직선과 y축으로 둘러싸인 삼각형에 색칠하였다.` }),
        explain: `오른쪽 위로 향하는 직선은 두 점 ${pt(p2, 0)}, ${ptj(x0, y0, '을/를')} 지나므로 기울기가 ${tx(m2)}이고, ${fn(m2, q2)}에서 ${Y}절편은 ${iq(q2)}이다. 색칠한 부분은 ${Y}축 위의 변의 길이가 ${nb(`${q1} − (${iq(q2)}) = ${q1 - q2}`)}, 높이가 ${x0}인 삼각형이므로 넓이는 ${frac(1, 2)} × ${q1 - q2} × ${x0} = ${area}이다.`,
        facts: { value: `(${q1}-(-${p2}*${y0}/(${x0}-${p2})))*${x0}/2`, unseen: [2], rule: 'area-y-figure' }
      });
    }, { count: 2 }),
    T('area-with-axis-parallel', '축에 평행한 두 직선과 한 직선으로 둘러싸인 도형의 넓이', '심43', (d) => {
      const v = d.until(() => { const l = { a: d.int(1, 4), b: nz(d, -4, 4), c: nz(d, -9, 9) }, p = nz(d, -4, 4), q = nz(d, -4, 4); return { l, p, q, y1: -(l.a * p + l.c) / l.b, x1: -(l.b * q + l.c) / l.a }; }, (w) => Number.isInteger(w.y1) && Number.isInteger(w.x1) && w.y1 !== w.q && Math.abs(w.y1) <= 9 && Math.abs(w.x1) <= 9 && ((w.q - w.y1) * (w.p - w.x1)) % 2 === 0 && Math.abs((w.q - w.y1) * (w.p - w.x1)) <= 80 && gcd(w.l.a, w.l.b) === 1);
      const { l, p, q, y1, x1 } = v, h = Math.abs(q - y1), w = Math.abs(p - x1), area = h * w / 2, ex = eq0([1, X], [-p, '']), ey = eq0([1, Y], [-q, '']);
      return N(`세 직선 ${gen(l)}, ${ex}, ${ey}${tl(0, '으로/로')} 둘러싸인 도형의 넓이는?`, area, {
        explain: `두 직선 ${xEq(p)}, ${yEq(q)}${tl(q, '은/는')} 점 ${pt(p, q)}에서 수직으로 만난다. ${gen(l)}에 ${X} = ${iq(p)}${tl(p, '을/를')} 대입하면 ${Y} = ${iq(y1)}, ${Y} = ${iq(q)}${tl(q, '을/를')} 대입하면 ${X} = ${iq(x1)}이다. 둘러싸인 도형은 직각을 낀 두 변의 길이가 ${h}, ${w}인 직각삼각형이므로 넓이는 ${frac(1, 2)} × ${h} × ${w} = ${area}이다.`,
        facts: { value: absx(`(${jn(q)}-(-(${jn(l.a)}*${jn(p)}+${jn(l.c)})/${jn(l.b)}))*(${jn(p)}-(-(${jn(l.b)}*${jn(q)}+${jn(l.c)})/${jn(l.a)}))/2`, (q - y1) * (p - x1)), unseen: un(l.a, l.b).concat([2]) }
      });
    })
  ]);

  // 8-1-6c.js 가 함께 쓰는 것
  Object.assign(B.kit.m816, { relOf, SOLS, baseLine, times, twoThrough, CUTS, cutMeet, cutFigure, cutX, cutY, asLine, drawn, absx });
})(typeof window !== 'undefined' ? window : globalThis);
