// 중학교 2학년 1학기 5단원 일차함수와 그 그래프 — 뒤쪽 묶음(기울기, 그래프의 성질, 평행과 일치, 일차함수의 식 구하기, 일차함수의 활용).
// 단원 틀과 도구, 싣는 기준, 뺀 것과 까닭은 8-1-5a.js 에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { box, frac, lines, N, M, C, D, inline } = B.kit;
  const { LAB, MINUS, GT, LT, Q, qsub, qmul, qneg, qcmp, fl, nb, tail, js, V, nz, pm, ansV, claimQ } = B.kit.mid;
  const K8 = B.kit.m815;
  const { T, X, Y, A, BB, K, XA, YA, XI, YI, TAG6, iq, jn, par, sgn, tm, lt, ex, eqT, eq, eqAB, is, cmp, pt, ptj, mulA, divA, eqAns, vals, rows1, xyTable, pairPick, QN, missQ, xcut, slope, it, cutX, cutY, pl, plOk, TICKS, gridOf, axesOf, picks, cutMini, gr } = K8;
  // 기울기의 뜻
  const RATIO = frac(`(${Y}의 값의 증가량)`, `(${X}의 값의 증가량)`);
  const upDown = (v) => (v > 0 ? '증가' : '감소');
  // 눈금 없는 좌표평면에 그린 직선과, 직선 위의 두 점에서 두 축에 내린 점선·수(두 점은 축 위에 있지 않다).
  function dotFig(x1, y1, x2, y2) {
    const a = Q(y2 - y1, x2 - x1), b = qsub(Q(y1), qmul(a, Q(x1)));
    return { x: [Math.min(x1, 0) - 1, Math.max(x2, 0) + 1], y: [Math.min(y1, y2, 0) - 1, Math.max(y1, y2, 0) + 1], grid: false, ticks: 'none', lines: [{ a, b }],
      points: [{ x: x1, y: y1, guide: true }, { x: x2, y: y2, guide: true }], xnums: [{ v: x1, up: y1 < 0 }, { v: x2, up: y2 < 0 }], ynums: [{ v: y1, right: x1 < 0 }, { v: y2, right: x2 < 0 }] };
  }
  // 부호만 읽는 그림: 눈금도 수도 없이 직선 하나만 그린다(기울기의 부호 sa, y절편의 부호 sb).
  const signFig = (d, sa, sb) => { const base = d.pick([Q(1), Q(2, 3), Q(3, 2)]); return pl({ x: [-4, 4], y: [-4, 4], grid: false, ticks: 'none', lines: [{ a: Q(sa * base.p, base.q), b: sb * 2 }] }); };
  // a, b 의 부호로 기울기와 y절편의 부호가 정해지는 식. sl·ic: 기울기·y절편의 글, a·b: 그 부호
  const SIGN_FORMS = [
    { h: eqAB, sl: A, ic: BB, a: (sa) => sa, b: (sa, sb) => sb },
    { h: eqT(lt(A + X, true), lt(BB)), sl: MINUS + A, ic: BB, a: (sa) => -sa, b: (sa, sb) => sb },
    { h: eqT(lt(A + X), lt(BB, true)), sl: A, ic: MINUS + BB, a: (sa) => sa, b: (sa, sb) => -sb },
    { h: eqT(lt(BB + X), lt(A)), sl: BB, ic: A, a: (sa, sb) => sb, b: (sa) => sa },
    { h: eqT(lt(BB + X, true), lt(A)), sl: MINUS + BB, ic: A, a: (sa, sb) => -sb, b: (sa) => sa },
    { h: eqT(lt(BB + X), lt(A, true)), sl: BB, ic: MINUS + A, a: (sa, sb) => sb, b: (sa) => -sa },
    { h: eqT(lt(A + X, true), lt(BB, true)), sl: MINUS + A, ic: MINUS + BB, a: (sa) => -sa, b: (sa, sb) => -sb }
  ];
  const signWord = (s) => (s > 0 ? '양수' : '음수'), sideWord = (s) => (s > 0 ? '위' : '아래'), partWord = (s) => (s > 0 ? '양' : '음');
  // 직선 y = ax + b (a, b 는 0이 아닌 정수)에 대한 옳은 설명과 틀린 설명. 틀린 설명: 거꾸로 나눈 기울기, 부호를 놓친 기울기·절편, 상수항의 부호를 놓친 점, 다른 사분면.
  function lineClaims(d, a, b) {
    const xc = xcut(a, b), miss = missQ(a, b), other = (miss + 1 + d.int(0, 2)) % 4, x3 = nz(d, -3, 3), y3 = a * x3 + b;
    const yes = [`기울기는 ${iq(a)}이다.`, `${YI}은 ${iq(b)}이다.`, `${XI}은 ${iq(xc)}이다.`, `점 ${ptj(x3, y3, '을/를')} 지난다.`, `${QN[miss]}을 지나지 않는다.`];
    const no = [
      d.bool() ? [`기울기는 ${iq(Q(1, a))}이다.`, `기울기는 ${RATIO}이므로 ${iq(a)}이다.`, yes[0]] : [`기울기는 ${iq(-a)}이다.`, `기울기는 ${iq(a)}이다.`, yes[0]],
      [`${XI}은 ${iq(qneg(xc))}이다.`, `${is(Y, 0)}일 때 ${is(X, xc)}이므로 ${XI}은 ${iq(xc)}이다.`, yes[2]],
      [`${YI}은 ${iq(-b)}이다.`, `${YI}은 ${iq(b)}이다.`, yes[1]],
      [`점 ${ptj(x3, y3 - 2 * b, '을/를')} 지난다.`, `${is(X, x3)}일 때 ${is(Y, y3)}이므로 점 ${ptj(x3, y3, '을/를')} 지난다.`, yes[3]],
      [`${QN[other]}을 지나지 않는다.`, `기울기가 ${signWord(a)}이고 ${YI}이 ${signWord(b)}이므로 지나지 않는 사분면은 ${QN[miss]}이다.`, yes[4]]
    ];
    return { yes, no };
  }
  // 답이 식과 값인 활용 문항: 「y = [±][ ]x [±][ ]」와 값 한 칸. a 는 ±1이 아닌 정수, b 는 0이 아닌 정수.
  function useAns(text, a, b, ask, value, unit, o) {
    if (!Number.isInteger(a) || !Number.isInteger(b) || Math.abs(a) < 2 || b === 0) throw new Error('활용의 식: 기울기는 ±1이 아닌 정수, y절편은 0이 아닌 정수여야 한다');
    return inline(text, `${Y} = {0}${X} {1}<br>${ask} {2}`, [{ answer: a, signed: true }, { answer: b, signed: true }, { answer: value, unit }], Object.assign({}, o, { shown: `${eq(a, b)}, ${ask} ${value}${/^[A-Za-z°]/.test(unit) ? ' ' : ''}${unit}` }));
  }

  // ── 기울기 ──
  B.addTypes('8-1-5', 'slope', [
    T('slope-from-eq', '식에서 기울기 구하기', '①32 ②34', (d) => {
      // 상수항을 앞에 적은 식도 섞는다(x의 계수가 기울기이다).
      const a = slope(d, 'frac'), b = nz(d, -9, 9), h = d.bool() ? eqT(tm(b), tm(a, X)) : eq(a, b);
      return ansV(`일차함수 ${h}의 그래프의 기울기는?`, a, 'frac', {
        explain: `일차함수 ${eqAB}의 그래프의 기울기는 ${X}의 계수 ${A}이다. ${h}에서 ${X}의 계수는 ${iq(a)}이다.`,
        facts: { value: js(a) }
      });
    }),
    T('slope-compare', '기울기의 크기 비교하기', '②35', (d) => {
      // 절댓값이 가장 큰 기울기가 음수이다(부호를 버리고 견주면 틀린다).
      const big = d.bool();
      const list = d.until(() => d.shuffle([Q(-d.int(4, 6)), Q(d.int(1, 3)), Q(-1, d.pick([2, 3])), Q(pm(d) * d.pick([1, 2]), d.pick([3, 5]))]), (rows) => new Set(rows.map(fl)).size === 4);
      const sizes = list.map(fl), at = sizes.indexOf(big ? Math.max(...sizes) : Math.min(...sizes));
      return C(`다음 일차함수 중 그 그래프의 기울기가 가장 ${big ? '큰' : '작은'} 것은?`, list.map((a) => eq(a, nz(d, -8, 8))), at, {
        explain: `기울기는 차례로 ${list.map((a) => iq(a)).join(', ')}이다. 음수는 절댓값이 클수록 작으므로 가장 ${big ? '큰' : '작은'} 수는 ${iq(list[at])}이다.`,
        facts: { rank: { values: sizes, nth: big ? 1 : 4 } }
      });
    }),
    T('slope-increase', '기울기와 증가량', '①33', (d, n) => {
      if (n === 0) {
        const a = slope(d, 'frac'), b = nz(d, -6, 6), t = d.int(1, 4), dx = a.q * t, dy = a.p * t;
        return N(`일차함수 ${eq(a, b)}에서 ${X}의 값이 ${dx}만큼 증가할 때, ${Y}의 값의 증가량은?`, dy, { signed: true,
          explain: `${RATIO} = ${iq(a)}이므로 (${Y}의 값의 증가량) = ${iq(a)} × ${dx} = ${iq(dy)}이다.`,
          facts: { value: mulA(a, String(dx)), rule: 'inc-y' }
        });
      }
      const [dx, dy] = d.until(() => [d.int(2, 5), pm(d) * d.int(2, 12)], ([u, v]) => v % u === 0), a = dy / dx, b = nz(d, -6, 6);
      return N(`일차함수 ${eqT(lt(A + X), tm(b))}에서 ${X}의 값이 ${dx}만큼 증가할 때 ${Y}의 값이 ${Math.abs(dy)}만큼 ${upDown(dy)}한다. 수 ${A}의 값은?`, a, { signed: true,
        explain: `${Y}의 값의 증가량은 ${iq(dy)}이다. 기울기는 ${RATIO} = ${frac(iq(dy), dx)} = ${iq(a)}이므로 ${is(A, a)}이다.`,
        facts: { value: `${jn(dy)}/${dx}`, rule: 'inc-a' }
      });
    }, { count: 2 }),
    T('slope-interval', '구간에서의 증가량으로 기울기 구하기', '②38', (d) => {
      const [x1, x2] = d.until(() => [d.int(-6, 3), d.int(-3, 6)], ([u, v]) => v - u >= 2 && v - u <= 6), a = pm(d) * d.int(2, 4), dy = a * (x2 - x1), b = nz(d, -6, 6);
      return N(`일차함수 ${eqT(lt(A + X), tm(b))}에서 ${X}의 값이 ${iq(x1)}에서 ${iq(x2)}까지 증가할 때 ${Y}의 값이 ${Math.abs(dy)}만큼 ${upDown(dy)}한다. 수 ${A}의 값은?`, a, { signed: true,
        explain: `${X}의 값의 증가량은 ${iq(x2)} ${MINUS} ${par(x1)} = ${x2 - x1}이고, ${Y}의 값의 증가량은 ${iq(dy)}이다. 기울기는 ${frac(iq(dy), x2 - x1)} = ${iq(a)}이므로 ${is(A, a)}이다.`,
        facts: { value: `${jn(dy)}/(${jn(x2)}-${jn(x1)})` }
      });
    }),
    T('slope-two-points', '두 점을 지나는 직선의 기울기', '①34', (d) => {
      const [x1, y1, x2, y2] = d.until(() => [d.int(-5, 5), d.int(-6, 6), d.int(-5, 5), d.int(-6, 6)], ([a, b, c, e]) => a !== c && b !== e && (e - b) % (c - a) !== 0), a = Q(y2 - y1, x2 - x1);
      return ansV(`두 점 ${pt(x1, y1)}, ${ptj(x2, y2, '을/를')} 지나는 일차함수의 그래프의 기울기는?`, a, 'frac', {
        explain: `기울기는 ${RATIO} = ${frac(`${iq(y2)} ${MINUS} ${par(y1)}`, `${iq(x2)} ${MINUS} ${par(x1)}`)} = ${iq(a)}이다.`,
        facts: { value: `(${jn(y2)}-${jn(y1)})/(${jn(x2)}-${jn(x1)})` }
      });
    }),
    T('slope-fill-coord', '기울기가 주어질 때 점의 좌표 구하기', '①35 ②39', (d, n) => {
      const a = n === 0 ? slope(d, d.bool() ? 'int' : 'frac') : slope(d, 'frac'), x1 = d.int(-4, 4), y1 = d.int(-5, 5), t = nz(d, -3, 3), x2 = x1 + a.q * t, y2 = y1 + a.p * t;
      if (n === 0) {
        return N(`두 점 ${pt(x1, y1)}, ${pt(x2, K)}를 지나는 일차함수의 그래프의 기울기가 ${iq(a)}일 때, ${K}의 값은?`, y2, { signed: true,
          explain: `${X}의 값의 증가량은 ${iq(x2)} ${MINUS} ${par(x1)} = ${iq(x2 - x1)}이므로 ${Y}의 값의 증가량은 ${iq(a)} × ${par(x2 - x1)} = ${iq(y2 - y1)}이다. ${K} = ${iq(y1)} + ${par(y2 - y1)} = ${iq(y2)}이다.`,
          facts: { value: `${jn(y1)}+${mulA(a, `(${jn(x2)}-${jn(x1)})`)}`, rule: 'fill-y' }
        });
      }
      return N(`두 점 ${pt(x1, y1)}, ${ptj(K, y2, '을/를')} 지나는 일차함수의 그래프의 기울기가 ${iq(a)}일 때, ${K}의 값은?`, x2, { signed: true,
        explain: `${Y}의 값의 증가량은 ${iq(y2)} ${MINUS} ${par(y1)} = ${iq(y2 - y1)}이므로 ${frac(iq(y2 - y1), `${K} ${sgn(-x1)}`)} = ${iq(a)}에서 ${K} ${sgn(-x1)} = ${iq(x2 - x1)}이다. 따라서 ${is(K, x2)}이다.`,
        facts: { value: `${jn(x1)}+${divA(`(${jn(y2)}-${jn(y1)})`, a)}`, unseen: x1 === 0 ? [0] : [], rule: 'fill-x' }
      });
    }, { count: 2 }),
    T('slope-collinear', '세 점이 한 직선 위에 있을 때 좌표 구하기', '①36 ②40 심25', (d) => {
      const a = slope(d, d.bool() ? 'int' : 'frac'), b0 = d.int(-5, 5), [t1, t2, t3] = d.shuffle([-3, -2, -1, 0, 1, 2, 3]).slice(0, 3), f = (t) => [a.q * t, a.p * t + b0];
      const [x1, y1] = f(t1), [x2, y2] = f(t2), [x3, y3] = f(t3);
      return N(`세 점 ${pt(x1, y1)}, ${pt(x2, y2)}, ${pt(x3, A)}가 한 직선 위에 있을 때, ${A}의 값은?`, y3, { signed: true,
        explain: `두 점 ${pt(x1, y1)}, ${ptj(x2, y2, '을/를')} 지나는 직선의 기울기는 ${frac(`${iq(y2)} ${MINUS} ${par(y1)}`, `${iq(x2)} ${MINUS} ${par(x1)}`)} = ${iq(a)}이다. 한 직선 위의 점은 어느 두 점으로 구해도 기울기가 같으므로 ${frac(`${A} ${sgn(-y2)}`, `${iq(x3)} ${MINUS} ${par(x2)}`)} = ${iq(a)}에서 ${is(A, y3)}이다.`,
        facts: { value: `${jn(y2)}+(${jn(y2)}-${jn(y1)})*(${jn(x3)}-${jn(x2)})/(${jn(x2)}-${jn(x1)})`, unseen: y2 === 0 ? [0] : [] }
      });
    }),
    T('slope-read', '그래프에서 기울기 읽기', '①27·37 ②36', (d, n) => {
      if (n === 0) {
        // 모눈 그림: 직선 위의 두 모눈 점에 점을 찍었다(기울기는 정수).
        const c = d.until(() => { const a = pm(d) * d.int(1, 3), b = nz(d, -3, 3), xs = d.shuffle([-3, -2, -1, 0, 1, 2, 3]).filter((x) => Math.abs(a * x + b) <= 3).slice(0, 2).sort((u, v) => u - v); return { a, b, xs }; },
          (v) => v.xs.length === 2 && plOk(gridOf(Q(v.a), v.b, v.xs.map((x) => [x, v.a * x + v.b]))));
        const [x1, x2] = c.xs, y1 = c.a * x1 + c.b, y2 = c.a * x2 + c.b;
        return ansV(`그림과 같은 일차함수의 그래프의 기울기는?`, Q(c.a), 'int', {
          figure: pl(gridOf(Q(c.a), c.b, [[x1, y1], [x2, y2]])),
          explain: `그래프가 두 점 ${pt(x1, y1)}, ${ptj(x2, y2, '을/를')} 지난다. ${X}의 값이 ${x2 - x1}만큼 증가할 때 ${Y}의 값은 ${iq(y2 - y1)}만큼 증가하므로 기울기는 ${frac(iq(y2 - y1), x2 - x1)} = ${iq(c.a)}이다.`,
          facts: { value: `${jn(c.a)}/1`, rule: 'read-grid' }
        });
      }
      // 눈금 없는 그림: 두 점에서 두 축에 점선을 내리고 수를 적었다(기울기는 분수).
      const c = d.until(() => ({ x1: nz(d, -3, 3), y1: nz(d, -3, 4), x2: nz(d, -3, 4), y2: nz(d, -3, 4) }), (v) => v.x1 < v.x2 && v.y1 !== v.y2 && (v.y2 - v.y1) % (v.x2 - v.x1) !== 0 && plOk(dotFig(v.x1, v.y1, v.x2, v.y2)));
      const { x1, y1, x2, y2 } = c, a = Q(y2 - y1, x2 - x1);
      return ansV(`그림과 같은 일차함수의 그래프의 기울기는?`, a, 'frac', {
        figure: pl(dotFig(x1, y1, x2, y2)),
        explain: `그래프가 두 점 ${pt(x1, y1)}, ${ptj(x2, y2, '을/를')} 지나므로 기울기는 ${frac(`${iq(y2)} ${MINUS} ${par(y1)}`, `${iq(x2)} ${MINUS} ${par(x1)}`)} = ${iq(a)}이다.`,
        facts: { value: `(${jn(y2)}-${jn(y1)})/(${jn(x2)}-${jn(x1)})`, rule: 'read-dots' }
      });
    }, { count: 2 }),
    T('slope-three-points', '좌표평면 위의 세 점에서 두 점을 지나는 직선의 기울기', '②37', (d) => {
      // 직선은 그리지 않고 점만 찍었다. 보기: 바른 기울기, 그 부호를 놓친 것, 다른 두 점에서 거꾸로 나눈 것, 또 다른 두 점에서 부호를 놓친 것.
      const NAME = ['A', 'B', 'C'], PAIRS = [[0, 1], [1, 2], [2, 0]], sideOf = ([x, y]) => (y > 0 ? 'u' : 'd') + (x > 0 ? 'r' : 'l');
      const fig = (pts) => ({ x: [-4, 4], y: [-4, 4], ticks: TICKS, points: pts.map((p, i) => ({ x: p[0], y: p[1], name: NAME[i], side: sideOf(p) })) });
      const sl = (pts, [i, j]) => Q(pts[j][1] - pts[i][1], pts[j][0] - pts[i][0]);
      const pts = d.until(() => [0, 1, 2].map(() => [nz(d, -3, 3), nz(d, -3, 3)]), (ps) => new Set(ps.map((p) => p[0])).size === 3 && new Set(ps.map((p) => p[1])).size === 3
        && ps.every((p, i) => ps.every((q, j) => j <= i || Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]) >= 3)) && qcmp(sl(ps, PAIRS[0]), sl(ps, PAIRS[1])) !== 0 && PAIRS.every((pr) => Math.abs(fl(sl(ps, pr))) !== 1) && plOk(fig(ps)));
      const order = d.shuffle([0, 1, 2]), [i0, i1, i2] = order, s = PAIRS.map((pr) => sl(pts, pr)), inv = (q) => Q(q.q * (q.p < 0 ? -1 : 1), Math.abs(q.p));
      const rows = d.shuffle([[i0, s[i0]], [i0, qneg(s[i0])], [i1, inv(s[i1])], [i2, qneg(s[i2])]]), ok = (r) => qcmp(r[1], s[r[0]]) === 0, lineName = (k) => NAME[PAIRS[k][0]] + NAME[PAIRS[k][1]];
      return C(`그림의 세 점 A, B, C에 대하여 두 점을 지나는 직선의 기울기를 바르게 구한 것은?`, rows.map((r) => `직선 ${lineName(r[0])}: ${iq(r[1])}`), rows.findIndex(ok), {
        figure: pl(fig(pts)),
        explain: `${NAME.map((nm, i) => nm + pt(pts[i][0], pts[i][1])).join(', ')}이다. 기울기는 ${RATIO}이므로 ${[0, 1, 2].map((k) => `직선 ${lineName(k)}의 기울기는 ${iq(s[k])}`).join(', ')}이다.`,
        facts: { truth: rows.map(ok), want: true }
      });
    }),
    T('slope-draw-steps', '기울기와 y절편으로 그래프가 지나는 점 찾기', '②47', (d) => {
      const a = slope(d, 'frac'), b = nz(d, -4, 4);
      return M(`일차함수 ${eq(a, b)}의 그래프를 다음과 같은 차례로 그리려고 한다. ㉠, ㉡, ㉢에 알맞은 수는?`, [{ label: LAB[0], answer: b, signed: true }, { label: LAB[1], answer: a.p, signed: true }, { label: LAB[2], answer: b + a.p, signed: true }], {
        figure: lines([`① ${YI}이 ${box(LAB[0])}이므로 점 ${nb(`(0, ${box(LAB[0])})`)}을 지난다.`, `② 기울기가 ${iq(a)}이므로 이 점에서 ${XA}의 방향으로 ${a.q}만큼, ${YA}의 방향으로 ${box(LAB[1])}만큼 이동한 점 ${nb(`(${a.q}, ${box(LAB[2])})`)}을 지난다.`, '③ 두 점을 직선으로 잇는다.']),
        explain: `${YI}은 ${iq(b)}이므로 ㉠은 ${iq(b)}이다. 기울기가 ${iq(a)}이므로 ${X}의 값이 ${a.q}만큼 증가할 때 ${Y}의 값은 ${iq(a.p)}만큼 증가한다. ㉡은 ${iq(a.p)}, ㉢은 ${iq(b)} + ${par(a.p)} = ${iq(b + a.p)}이다.`,
        facts: { calc: [[jn(b), 0], [jn(a.p), 1], [`${jn(b)}+${jn(a.p)}`, 2]] }
      });
    })
  ]);

  // ── 그래프의 성질 ──
  // 기울기와 y절편의 부호가 저마다 다른 네 직선(+ +, + −, − +, − − 차례). 직선의 이름이 서로 닿지 않게 고른 것이다.
  const LINE_SETS = [
    [[Q(1, 2), 1], [Q(3), -2], [Q(-1), 2], [Q(-1, 2), -2]],
    [[Q(1), 1], [Q(1, 2), -2], [Q(-2), 3], [Q(-1, 3), -2]],
    [[Q(2, 3), 1], [Q(2), -3], [Q(-3, 2), 2], [Q(-1, 4), -3]]
  ];
  B.addTypes('8-1-5', 'nature', [
    T('nature-pick-graph', '식에 맞는 그래프 고르기', '①39·40 ②46', (d) => {
      // 보기: 바른 그래프, x절편의 부호를 놓친 것, y절편의 부호를 놓친 것, 두 절편의 자리를 바꾼 것
      const [p, q] = d.until(() => [pm(d) * d.int(2, 5), pm(d) * d.int(2, 5)], ([u, v]) => Math.abs(u) !== Math.abs(v)), a = Q(-q, p), cands = [[p, q], [-p, q], [p, -q], [q, p]], order = d.shuffle([0, 1, 2, 3]), R = Math.max(Math.abs(p), Math.abs(q)) + 2;
      return C(`다음 ㉠~㉣ 가운데 일차함수 ${eq(a, q)}의 그래프는?`, LAB.slice(0, 4), order.indexOf(0), {
        figure: picks(order.map((j, i) => cutMini(cands[j][0], cands[j][1], LAB[i], R))),
        explain: `${is(Y, 0)}${tail(0, '을/를')} 대입하면 ${is(X, p)}, ${is(X, 0)}${tail(0, '을/를')} 대입하면 ${is(Y, q)}이므로 ${XI}은 ${iq(p)}, ${YI}은 ${iq(q)}이다. 그래프는 두 점 ${pt(p, 0)}, ${ptj(0, q, '을/를')} 지나는 직선이다.`,
        facts: { truth: order.map((j) => j === 0), want: true }
      });
    }),
    T('nature-direction', '기울기와 y절편의 부호로 그래프의 모양 가리기', '①41 ②49', (d, n) => {
      // 넷 가운데 둘이 조건에 맞는다. 첫째는 기울기의 부호(상수항을 앞에 적은 식도 섞는다), 둘째는 y절편의 부호.
      const rows = d.until(() => [0, 1, 2, 3].map(() => ({ a: slope(d, d.bool() ? 'int' : 'frac'), b: nz(d, -8, 8), swap: d.bool() })), (list) => list.filter((r) => (n === 0 ? r.a.p > 0 : r.b > 0)).length === 2 && new Set(list.map((r) => r.a.p + '/' + r.a.q + '/' + r.b)).size === 4);
      const hs = rows.map((r) => (r.swap && n === 0 ? eqT(tm(r.b), tm(r.a, X)) : eq(r.a, r.b))), s = pm(d), flags = rows.map((r) => (n === 0 ? r.a.p > 0 : r.b > 0) === (s > 0)), hit = flags.map((f, i) => (f ? LAB[i] : '')).filter(Boolean).join(', ');
      if (n === 0) {
        const text = d.bool() ? `다음 일차함수 중 그 그래프가 오른쪽 ${sideWord(s)}로 향하는 것을 모두 고른 것은?` : `다음 일차함수 중 ${X}의 값이 증가할 때 ${Y}의 값${s > 0 ? '도 증가' : '은 감소'}하는 것을 모두 고른 것은?`;
        return pairPick(d, text, hs, flags, `기울기가 양수이면 ${X}의 값이 증가할 때 ${Y}의 값도 증가하고 그래프는 오른쪽 위로 향한다. 기울기가 음수이면 ${Y}의 값은 감소하고 그래프는 오른쪽 아래로 향한다. 기울기가 ${signWord(s)}인 것은 ${hit}이다.`, rows1(hs, LAB));
      }
      return pairPick(d, `다음 일차함수 중 그 그래프가 ${YA}과 ${partWord(s)}의 부분에서 만나는 것을 모두 고른 것은?`, hs, flags, `그래프가 ${YA}과 만나는 점의 ${Y}좌표가 ${YI}이다. ${YI}이 ${signWord(s)}인 것은 ${hit}이다.`, rows1(hs, LAB));
    }, { count: 2 }),
    T('nature-quadrant', '그래프가 지나지 않는 사분면', '①42', (d, n) => {
      if (n === 0) {
        const a = slope(d, d.bool() ? 'int' : 'frac'), b = nz(d, -8, 8), miss = missQ(a, b);
        return C(`일차함수 ${eq(a, b)}의 그래프가 지나지 않는 사분면은?`, QN, miss, {
          explain: `기울기가 ${signWord(a.p)}이므로 오른쪽 ${sideWord(a.p)}로 향하고, ${YI}이 ${signWord(b)}이므로 ${YA}과 ${partWord(b)}의 부분에서 만난다. 이 직선은 ${QN[miss]}을 지나지 않는다.`,
          facts: { truth: QN.map((_, i) => i === miss), want: true, rule: 'quad-eq' }
        });
      }
      const p = nz(d, -6, 6), q = nz(d, -6, 6), miss = missQ(Q(-q, p), q);
      return C(`${XI}이 ${iq(p)}이고 ${YI}이 ${iq(q)}인 일차함수의 그래프가 지나지 않는 사분면은?`, QN, miss, {
        explain: `그래프는 두 점 ${pt(p, 0)}, ${ptj(0, q, '을/를')} 지나는 직선이다. ${XA}과 ${partWord(p)}의 부분에서, ${YA}과 ${partWord(q)}의 부분에서 만나는 직선이므로 ${QN[miss]}을 지나지 않는다.`,
        facts: { truth: QN.map((_, i) => i === miss), want: true, rule: 'quad-cut' }
      });
    }, { count: 2 }),
    T('nature-quadrant-pick', '어느 사분면을 지나지 않는 일차함수 고르기', '①42 심32', (d) => {
      // 기울기와 y절편의 부호가 저마다 다른 네 식: 지나지 않는 사분면이 모두 다르다.
      const rows = d.shuffle([[1, 1], [1, -1], [-1, 1], [-1, -1]]).map(([sa, sb]) => { const m = slope(d, d.bool() ? 'int' : 'frac'); return { a: Q(sa * Math.abs(m.p), m.q), b: sb * d.int(1, 8) }; }), at = d.int(0, 3), k = missQ(rows[at].a, rows[at].b);
      return C(`다음 일차함수 중 그 그래프가 ${QN[k]}을 지나지 않는 것은?`, rows.map((r) => eq(r.a, r.b)), at, {
        explain: `${QN[k]}을 지나지 않는 직선은 기울기가 ${signWord(rows[at].a.p)}이고 ${YI}이 ${signWord(rows[at].b)}이다. 알맞은 것은 ${eq(rows[at].a, rows[at].b)}이다.`,
        facts: { truth: rows.map((r) => missQ(r.a, r.b) === k), want: true }
      });
    }),
    T('nature-signs', '그래프를 보고 a, b의 부호 구하기', '①43 ②51', (d, n) => {
      // 눈금 없는 그림에서 기울기와 y절편의 부호만 읽는다. 둘째는 식이 y = −ax + b, y = ax − b 꼴이어서 부호를 한 번 뒤집는다.
      const ga = pm(d), gb = pm(d), f = n === 0 ? SIGN_FORMS[0] : d.pick([SIGN_FORMS[1], SIGN_FORMS[2]]), opts = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
      const at = opts.findIndex(([sa, sb]) => f.a(sa, sb) === ga && f.b(sa, sb) === gb), [ra, rb] = opts[at];
      return C(`일차함수 ${f.h}의 그래프가 그림과 같을 때, 수 ${A}, ${BB}의 부호로 옳은 것은?`, opts.map(([sa, sb]) => `${cmp(A, sa > 0 ? GT : LT)}, ${cmp(BB, sb > 0 ? GT : LT)}`), at, {
        figure: signFig(d, ga, gb),
        explain: `그래프가 오른쪽 ${sideWord(ga)}로 향하므로 기울기는 ${signWord(ga)}이고, ${YA}과 ${partWord(gb)}의 부분에서 만나므로 ${YI}은 ${signWord(gb)}이다. 기울기는 ${f.sl}, ${YI}은 ${f.ic}이므로 ${cmp(A, ra > 0 ? GT : LT)}, ${cmp(BB, rb > 0 ? GT : LT)}이다.`,
        facts: { truth: opts.map((_, i) => i === at), want: true, rule: 'signs-' + n }
      });
    }, { count: 2 }),
    T('nature-signs-lines', '여러 직선 가운데 a, b의 부호에 맞는 그래프 찾기', '②50', (d) => {
      const c = d.until(() => { const set = d.pick(LINE_SETS), order = d.shuffle([0, 1, 2, 3]); return { set, order, fig: { x: [-4, 4], y: [-4, 4], grid: false, ticks: 'none', lines: order.map((k, i) => ({ a: set[k][0], b: set[k][1], name: LAB[i] })) } }; }, (v) => plOk(v.fig));
      const want = d.int(0, 3), sa = want < 2 ? 1 : -1, sb = want % 2 === 0 ? 1 : -1, at = c.order.indexOf(want);
      return C(`그림의 네 직선 ㉠~㉣은 모두 일차함수의 그래프이다. ${cmp(A, sa > 0 ? GT : LT)}, ${cmp(BB, sb > 0 ? GT : LT)}일 때, 일차함수 ${eqAB}의 그래프가 될 수 있는 것은?`, LAB.slice(0, 4), at, {
        figure: pl(c.fig),
        explain: `${cmp(A, sa > 0 ? GT : LT)}이므로 오른쪽 ${sideWord(sa)}로 향하고, ${cmp(BB, sb > 0 ? GT : LT)}이므로 ${YA}과 ${partWord(sb)}의 부분에서 만나는 직선이다. 알맞은 것은 ${LAB[at]}이다.`,
        facts: { truth: c.order.map((k) => k === want), want: true }
      });
    }),
    T('nature-signs-given', 'a, b의 부호가 주어질 때 그래프가 지나지 않는 사분면', '②53 심33', (d) => {
      const sa = pm(d), sb = pm(d), f = d.pick(SIGN_FORMS.slice(1)), ra = f.a(sa, sb), rb = f.b(sa, sb), miss = missQ(ra, rb);
      return C(`수 ${A}, ${BB}에 대하여 ${cmp(A, sa > 0 ? GT : LT)}, ${cmp(BB, sb > 0 ? GT : LT)}일 때, 일차함수 ${f.h}의 그래프가 지나지 않는 사분면은?`, QN, miss, {
        explain: `기울기 ${f.sl}의 부호는 ${signWord(ra)}이고, ${YI} ${f.ic}의 부호는 ${signWord(rb)}이다. 오른쪽 ${sideWord(ra)}로 향하고 ${YA}과 ${partWord(rb)}의 부분에서 만나는 직선이므로 ${QN[miss]}을 지나지 않는다.`,
        facts: { truth: QN.map((_, i) => i === miss), want: true }
      });
    }),
    T('nature-claims', '수가 주어진 일차함수의 그래프에 대한 설명의 참·거짓', '①46 ②55', (d) => {
      const a = slope(d, 'frac'), b = nz(d, -6, 6), up = a.p > 0, miss = missQ(a, b), other = (miss + 1 + d.int(0, 2)) % 4, t = nz(d, -2, 2), x1 = a.q * t, y1 = a.p * t + b, xc = xcut(a, b), want = d.bool();
      const yes = [
        `점 ${ptj(x1, y1, '을/를')} 지난다.`,
        `오른쪽 ${up ? '위' : '아래'}로 향하는 직선이다.`,
        `${QN[miss]}을 지나지 않는다.`,
        `${X}의 값이 ${a.q}만큼 증가하면 ${Y}의 값은 ${Math.abs(a.p)}만큼 ${up ? '증가' : '감소'}한다.`,
        `일차함수 ${eq(a, 0)}의 그래프를 ${YA}의 방향으로 ${iq(b)}만큼 평행이동한 것이다.`,
        `${XI}은 ${iq(xc)}이다.`
      ];
      const no = [
        [`점 ${ptj(x1, y1 - 2 * b, '을/를')} 지난다.`, `${is(X, x1)}일 때 ${is(Y, y1)}이므로 점 ${ptj(x1, y1, '을/를')} 지난다.`, yes[0]],
        [`오른쪽 ${up ? '아래' : '위'}로 향하는 직선이다.`, `기울기가 ${signWord(a.p)}이므로 오른쪽 ${up ? '위' : '아래'}로 향한다.`, yes[1]],
        [`${QN[other]}을 지나지 않는다.`, `기울기가 ${signWord(a.p)}이고 ${YI}이 ${signWord(b)}이므로 지나지 않는 사분면은 ${QN[miss]}이다.`, yes[2]],
        [`${X}의 값이 ${a.q}만큼 증가하면 ${Y}의 값은 ${Math.abs(a.p)}만큼 ${up ? '감소' : '증가'}한다.`, `기울기가 ${iq(a)}이므로 ${X}의 값이 ${a.q}만큼 증가하면 ${Y}의 값은 ${Math.abs(a.p)}만큼 ${up ? '증가' : '감소'}한다.`, yes[3]],
        [`일차함수 ${eq(a, 0)}의 그래프를 ${YA}의 방향으로 ${iq(-b)}만큼 평행이동한 것이다.`, `${eq(a, 0)}의 그래프를 ${YA}의 방향으로 ${iq(b)}만큼 평행이동한 것이다.`, yes[4]],
        [`${XI}은 ${iq(qneg(xc))}이다.`, `${is(Y, 0)}일 때 ${is(X, xc)}이므로 ${XI}은 ${iq(xc)}이다.`, yes[5]]
      ];
      return claimQ(d, `일차함수 ${eq(a, b)}의 그래프에 대한 설명으로 ${want ? '옳은' : '옳지 않은'} 것은?`, yes, no, want);
    }),
    T('nature-general-claims', '일차함수 y = ax + b의 그래프의 성질', '①47 심31', (d) => {
      const want = d.bool(), P1 = (h) => nb(`(1, ${h})`), base = eqT(lt(A + X));
      const yes = [
        `${YI}은 ${BB}이다.`,
        `${XI}은 ${nb(MINUS + frac(BB, A))}이다.`,
        `점 ${P1(`${A} + ${BB}`)}를 지난다.`,
        `${cmp(A, GT)}이면 오른쪽 위로 향하는 직선이다.`,
        `${cmp(A, LT)}이면 ${X}의 값이 증가할 때 ${Y}의 값은 감소한다.`,
        `일차함수 ${base}의 그래프를 ${YA}의 방향으로 ${BB}만큼 평행이동한 직선이다.`,
        `${cmp(A, GT)}, ${cmp(BB, LT)}이면 제2사분면을 지나지 않는다.`,
        `${cmp(A, LT)}, ${cmp(BB, GT)}이면 제3사분면을 지나지 않는다.`
      ];
      const no = [
        [`${YI}은 ${A}이다.`, `${is(X, 0)}일 때 ${is(Y, BB)}이므로 ${YI}은 ${BB}이다.`, yes[0]],
        [`${XI}은 ${frac(BB, A)}이다.`, `${is(Y, 0)}일 때 ${nb(`${X} = ${MINUS}${frac(BB, A)}`)}이므로 ${XI}은 ${nb(MINUS + frac(BB, A))}이다.`, yes[1]],
        [`점 ${P1(A)}를 지난다.`, `${is(X, 1)}일 때 ${nb(`${Y} = ${A} + ${BB}`)}이므로 점 ${P1(`${A} + ${BB}`)}를 지난다.`, yes[2]],
        [`${cmp(A, GT)}이면 오른쪽 아래로 향하는 직선이다.`, `${cmp(A, GT)}이면 오른쪽 위로 향하는 직선이다.`, yes[3]],
        [`${cmp(A, LT)}이면 ${X}의 값이 증가할 때 ${Y}의 값도 증가한다.`, `${cmp(A, LT)}이면 ${X}의 값이 증가할 때 ${Y}의 값은 감소한다.`, yes[4]],
        [`일차함수 ${base}의 그래프를 ${XA}의 방향으로 ${BB}만큼 평행이동한 직선이다.`, `${base}의 그래프를 ${YA}의 방향으로 ${BB}만큼 평행이동한 직선이다.`, yes[5]],
        [`${cmp(A, GT)}, ${cmp(BB, LT)}이면 제1사분면을 지나지 않는다.`, `${cmp(A, GT)}, ${cmp(BB, LT)}이면 제2사분면을 지나지 않는다.`, yes[6]],
        [`${cmp(A, LT)}, ${cmp(BB, GT)}이면 제1사분면을 지나지 않는다.`, `${cmp(A, LT)}, ${cmp(BB, GT)}이면 제3사분면을 지나지 않는다.`, yes[7]]
      ];
      return claimQ(d, `일차함수 ${eqAB}의 그래프에 대한 설명으로 ${want ? '옳은' : '옳지 않은'} 것은? (단, ${A}, ${BB}는 0이 아닌 수이다.)`, yes, no, want);
    })
  ]);

  // ── 평행과 일치 ──
  B.addTypes('8-1-5', 'parallel', [
    T('parallel-pick', '한 그래프와 평행한 그래프 고르기', '②57', (d) => {
      // 틀린 식: 기울기의 부호가 다른 것, 기울기가 역수인 것
      const a = slope(d, d.bool() ? 'int' : 'frac'), b = nz(d, -6, 6), cs = d.until(() => [nz(d, -9, 9), nz(d, -9, 9), nz(d, -9, 9), nz(d, -9, 9)], (list) => !list.includes(b) && new Set(list).size === 4), s = a.p > 0 ? 1 : -1, inv = Q(s * a.q, Math.abs(a.p));
      const rows = d.shuffle([{ a, b: cs[0], ok: true }, { a, b: cs[1], ok: true }, { a: qneg(a), b: cs[2], ok: false }, { a: d.bool() ? inv : qneg(inv), b: cs[3], ok: false }]), hs = rows.map((r) => eq(r.a, r.b));
      return pairPick(d, `다음 일차함수 중 그 그래프가 일차함수 ${eq(a, b)}의 그래프와 평행한 것을 모두 고른 것은?`, hs, rows.map((r) => r.ok),
        `기울기가 같고 ${YI}이 다른 두 일차함수의 그래프는 서로 평행하다. 기울기가 ${iq(a)}인 것은 ${rows.map((r, i) => (r.ok ? LAB[i] : '')).filter(Boolean).join(', ')}이다.`, rows1(hs, LAB));
    }),
    T('parallel-pairs', '정리해야 기울기가 보이는 식에서 평행한 짝 찾기', '①49 ②58', (d) => {
      // 여섯 식 가운데 평행한 짝은 둘이고, 보기에는 그 가운데 하나만 있다. 틀린 짝: y절편만 같은 것, 기울기가 역수인 것, 기울기의 부호가 다른 것.
      const m = d.int(2, 4), s = pm(d), a1 = s * m, k = d.until(() => d.int(2, 4), (v) => v !== m), s2 = pm(d), a2 = Q(s2, k), [c0, c1, c4, c5] = d.until(() => [nz(d, -7, 7), nz(d, -7, 7), nz(d, -7, 7), nz(d, -7, 7)], (list) => new Set(list).size === 4), p = k * d.int(1, 3), c3 = nz(d, -4, 4), b3 = c3 - s2 * p / k;
      const list = [
        { h: eqT(tm(c0), tm(a1, X)), a: Q(a1), b: c0 },                                                       // 차례를 바꾼 식
        { h: eq(a1, c1), a: Q(a1), b: c1 },
        { h: eq(-a1, c0), a: Q(-a1), b: c0 },                                                                  // y절편만 같다
        { h: nb(`${Y} = ${s2 < 0 ? MINUS : ''}${frac(1, k)}(${X} ${MINUS} ${p}) ${sgn(c3)}`), a: a2, b: b3 },   // 괄호를 풀어야 하는 식
        { h: eq(a2, c4), a: a2, b: c4 },
        { h: eq(Q(s, m), c5), a: Q(s, m), b: c5 }                                                              // 기울기가 역수
      ];
      const order = d.shuffle([0, 1, 2, 3, 4, 5]), rows = order.map((i) => list[i]), at = (i) => order.indexOf(i), tagOf = (pair) => pair.map(at).sort((u, v) => u - v).map((i) => TAG6[i]).join(', ');
      const pairs = d.shuffle([[0, 1], [0, 2], [1, 5], [2, 3]]), ok = ([i, j]) => qcmp(list[i].a, list[j].a) === 0 && list[i].b !== list[j].b;
      return C(`다음 일차함수 중 그 그래프가 서로 평행한 것끼리 짝 지은 것은?`, pairs.map(tagOf), pairs.findIndex(ok), {
        figure: rows1(rows.map((r) => r.h), TAG6),
        explain: `식을 ${eqAB} 꼴로 정리하면 기울기는 차례로 ${rows.map((r) => iq(r.a)).join(', ')}이다. 기울기가 같고 ${YI}이 다른 두 그래프가 서로 평행하므로 ${tagOf([0, 1])}의 그래프가 서로 평행하다.`,
        facts: { truth: pairs.map(ok), want: true }
      });
    }),
    T('parallel-coef', '평행 조건과 지나는 점으로 수 구하기', '①50 심40', (d) => {
      const m = pm(d) * d.int(2, 5), [c1, c2] = d.until(() => [nz(d, -7, 7), nz(d, -7, 7)], ([u, v]) => u !== v), x0 = nz(d, -4, 4), bv = m * x0 + c1, h = eqT(lt(A + X), tm(c1));
      return vals(`일차함수 ${h}의 그래프가 일차함수 ${eq(m, c2)}의 그래프와 평행하고 점 ${pt(x0, BB)}를 지날 때, 수 ${A}, ${BB}의 값은?`, [[A, m], [BB, bv]], {
        explain: `서로 평행한 두 일차함수의 그래프는 기울기가 같으므로 ${is(A, m)}이다. ${eq(m, c1)}에 ${is(X, x0)}${tail(Math.abs(x0), '을/를')} 대입하면 ${BB} = ${iq(m * x0)} ${sgn(c1)} = ${iq(bv)}이다.`,
        facts: { calc: [[jn(m), 0], [`${jn(m)}*${jn(x0)}+${jn(c1)}`, 1]] }
      });
    }),
    T('parallel-xint', '평행한 그래프의 x절편 구하기', '①50', (d) => {
      const a = slope(d, d.bool() ? 'int' : 'frac'), t = nz(d, -4, 4), c2 = -a.p * t, p = a.q * t, c1 = d.until(() => nz(d, -7, 7), (v) => v !== c2), h = eqT(lt(A + X), tm(c2));
      return N(`일차함수 ${h}의 그래프가 일차함수 ${eq(a, c1)}의 그래프와 평행할 때, 일차함수 ${h}의 그래프의 ${XI}은?`, p, { signed: true,
        explain: `서로 평행한 두 일차함수의 그래프는 기울기가 같으므로 ${is(A, a)}이다. ${eq(a, c2)}에 ${is(Y, 0)}${tail(0, '을/를')} 대입하면 ${is(X, p)}이므로 ${XI}은 ${iq(p)}이다.`,
        facts: { value: divA(`(0-${jn(c2)})`, a), unseen: [0] }
      });
    }),
    T('parallel-fig-xint', '그림의 그래프가 다른 그래프와 평행할 때 x절편 구하기', '①51 심41', (d) => {
      // 그림에는 y절편의 수와, x축과 만나는 곳의 문자 k가 적혀 있다. 기울기를 k로 나타내어 평행한 그래프의 기울기와 같게 놓는다.
      const fig = (v) => axesOf(Q(v.m), v.q, 'xy', { xnums: [cutX(Q(v.m), v.q, it('k'))] });
      const c = d.until(() => { const m = pm(d) * d.int(2, 3), kv = nz(d, -3, 3); return { m, kv, q: -m * kv }; }, (v) => Math.abs(v.q) <= 6 && plOk(fig(v))), cc = nz(d, -6, 6);
      return N(`그림과 같은 일차함수의 그래프가 일차함수 ${eq(c.m, c.q === cc ? cc + 1 : cc)}의 그래프와 평행할 때, ${K}의 값은?`, c.kv, { signed: true,
        figure: pl(fig(c)),
        explain: `그림의 그래프는 두 점 ${pt(K, 0)}, ${ptj(0, c.q, '을/를')} 지나므로 기울기는 ${frac(`${iq(c.q)} ${MINUS} 0`, `0 ${MINUS} ${K}`)}이다. 서로 평행한 두 그래프는 기울기가 같으므로 ${nb(`${MINUS}${frac(iq(c.q), K)} = ${iq(c.m)}`)}에서 ${is(K, c.kv)}이다.`,
        facts: { value: `(0-${jn(c.q)})/${jn(c.m)}`, unseen: [0] }
      });
    }),
    T('parallel-same-coef', '두 그래프가 일치할 때 수 구하기', '②61', (d) => {
      const c = pm(d) * d.int(2, 4), av = nz(d, -4, 4), m = c * av, j = pm(d) * d.int(2, 3), bv = nz(d, -4, 4), k = j * bv;
      const h1 = eqT(lt(Math.abs(c) + A + X, c < 0), tm(k)), h2 = eqT(tm(m, X), lt(Math.abs(j) + BB, j < 0));
      return vals(`두 일차함수 ${h1}, ${h2}의 그래프가 일치할 때, 수 ${A}, ${BB}의 값은?`, [[A, av], [BB, bv]], {
        explain: `두 일차함수의 그래프가 일치하면 기울기와 ${YI}이 각각 같다. ${ex(lt(Math.abs(c) + A, c < 0))} = ${iq(m)}에서 ${is(A, av)}이고, ${ex(lt(Math.abs(j) + BB, j < 0))} = ${iq(k)}에서 ${is(BB, bv)}이다.`,
        facts: { calc: [[`${jn(m)}/${jn(c)}`, 0], [`${jn(k)}/${jn(j)}`, 1]] }
      });
    }),
    T('parallel-and-same', '평행 조건과 일치 조건으로 수 둘 구하기', '②62', (d) => {
      const P = V('p'), Qv = V('q'), m = pm(d) * d.int(2, 5), s = nz(d, -5, 5), pv = m - s, [c0, c1] = d.until(() => [nz(d, -8, 8), nz(d, -8, 8)], ([u, v]) => u !== v), n2 = pm(d) * d.int(2, 5), j = d.pick([2, 3, 4]), qv = nz(d, -4, 4), e = nz(d, -6, 6), r = d.until(() => pv + e - j * qv, () => true);
      const h1 = nb(`${Y} = (${P} ${sgn(s)})${X} ${sgn(c0)}`), h3 = eqT(tm(n2, X), lt(P), tm(e)), h4 = eqT(tm(n2, X), lt(j + Qv), tm(r));
      return vals(`다음 조건을 모두 만족시키는 수 ${P}, ${Qv}의 값은?`, [[P, pv], [Qv, qv]], {
        figure: lines([`㈎ 두 일차함수 ${h1}, ${eq(m, c1)}의 그래프는 서로 평행하다.`, `㈏ 두 일차함수 ${h3}, ${h4}의 그래프는 일치한다.`]),
        explain: `㈎에서 기울기가 같으므로 ${P} ${sgn(s)} = ${iq(m)}, 곧 ${is(P, pv)}이다. ㈏에서 ${YI}이 같으므로 ${ex(lt(P), tm(e))} = ${ex(lt(j + Qv), tm(r))}이다. ${is(P, pv)}${tail(Math.abs(pv), '을/를')} 대입하면 ${iq(pv + e)} = ${ex(lt(j + Qv), tm(r))}에서 ${is(Qv, qv)}이다.`,
        facts: { calc: [[`${jn(m)}-${jn(s)}`, 0], [`(${jn(m)}-${jn(s)}+${jn(e)}-${jn(r)})/${j}`, 1]], unseen: r === 0 ? [0] : [] }
      });
    })
  ]);

  // ── 일차함수의 식 구하기 ──
  const ASK = '직선을 그래프로 하는 일차함수의 식을 구하시오.';
  // 기울기 a(±2~±5)와 0이 아닌 y절편 b
  const ab = (d) => [pm(d) * d.int(2, 5), nz(d, -9, 9)];
  B.addTypes('8-1-5', 'equation', [
    T('equation-slope-yint', '기울기와 y절편으로 식 구하기', '①56 ②63', (d, n) => {
      const [a, b] = ab(d);
      if (n === 0) {
        return eqAns(d.bool() ? `기울기가 ${iq(a)}이고 ${YI}이 ${iq(b)}인 ${ASK}` : `기울기가 ${iq(a)}이고 점 ${ptj(0, b, '을/를')} 지나는 ${ASK}`, a, b, {
          explain: `기울기가 ${iq(a)}이고 ${YI}이 ${iq(b)}이므로 ${eq(a, b)}이다.`,
          facts: { calc: [[jn(a), 0], [jn(b), 1]], unseen: [0], rule: 'slope-yint' }
        });
      }
      // 기울기를 증가량으로 준다.
      const dx = d.int(2, 4), dy = a * dx;
      return eqAns(`${X}의 값이 ${dx}만큼 증가할 때 ${Y}의 값이 ${Math.abs(dy)}만큼 ${upDown(dy)}하고, ${YI}이 ${iq(b)}인 ${ASK}`, a, b, {
        explain: `기울기는 ${RATIO} = ${frac(iq(dy), dx)} = ${iq(a)}이고 ${YI}이 ${iq(b)}이므로 ${eq(a, b)}이다.`,
        facts: { calc: [[`${jn(dy)}/${dx}`, 0], [jn(b), 1]], rule: 'increase-yint' }
      });
    }, { count: 2 }),
    T('equation-parallel-yint', '평행한 그래프와 y절편으로 식 구하기', '②64', (d) => {
      const [a, b] = ab(d), c = d.until(() => nz(d, -9, 9), (v) => v !== b);
      return eqAns(`일차함수 ${eq(a, c)}의 그래프와 평행하고 ${YI}이 ${iq(b)}인 ${ASK}`, a, b, {
        explain: `서로 평행한 두 일차함수의 그래프는 기울기가 같으므로 기울기는 ${iq(a)}이다. ${YI}이 ${iq(b)}이므로 ${eq(a, b)}이다.`,
        facts: { calc: [[jn(a), 0], [jn(b), 1]] }
      });
    }),
    T('equation-slope-point', '기울기와 한 점으로 식 구하기', '①57 ②65', (d) => {
      const [a, b] = ab(d), x0 = nz(d, -4, 4), y0 = a * x0 + b;
      return eqAns(`기울기가 ${iq(a)}이고 점 ${ptj(x0, y0, '을/를')} 지나는 ${ASK}`, a, b, {
        explain: `기울기가 ${iq(a)}이므로 ${eqT(tm(a, X), lt(BB))}로 놓는다. ${is(X, x0)}, ${is(Y, y0)}${tail(Math.abs(y0), '을/를')} 대입하면 ${iq(y0)} = ${iq(a * x0)} + ${BB}에서 ${is(BB, b)}이다. 따라서 ${eq(a, b)}이다.`,
        facts: { calc: [[jn(a), 0], [`${jn(y0)}-${jn(a)}*${jn(x0)}`, 1]] }
      });
    }),
    T('equation-increase-point', '증가량으로 준 기울기와 한 점으로 식 구하기', '①57 ②66', (d) => {
      const [a, b] = ab(d), dx = d.int(2, 4), dy = a * dx, x0 = nz(d, -4, 4), y0 = a * x0 + b;
      return eqAns(`${X}의 값이 ${dx}만큼 증가할 때 ${Y}의 값이 ${Math.abs(dy)}만큼 ${upDown(dy)}하고, 점 ${ptj(x0, y0, '을/를')} 지나는 ${ASK}`, a, b, {
        explain: `기울기는 ${frac(iq(dy), dx)} = ${iq(a)}이므로 ${eqT(tm(a, X), lt(BB))}로 놓는다. ${is(X, x0)}, ${is(Y, y0)}${tail(Math.abs(y0), '을/를')} 대입하면 ${is(BB, b)}이다. 따라서 ${eq(a, b)}이다.`,
        facts: { calc: [[`${jn(dy)}/${dx}`, 0], [`${jn(y0)}-${jn(dy)}*${jn(x0)}/${dx}`, 1]] }
      });
    }),
    T('equation-increase-then-point', '증가량으로 식을 정하고 그래프 위의 다른 점 구하기', '②66', (d) => {
      const a = slope(d, d.bool() ? 'int' : 'frac'), t0 = d.int(1, 3), dx = a.q * t0, dy = a.p * t0, x0 = d.int(-4, 4), y0 = d.int(-5, 5), t = nz(d, -3, 3), x1 = x0 + a.q * t, kv = y0 + a.p * t;
      return N(`${X}의 값이 ${dx}만큼 증가할 때 ${Y}의 값이 ${Math.abs(dy)}만큼 ${upDown(dy)}하는 일차함수의 그래프가 두 점 ${pt(x0, y0)}, ${pt(x1, K)}를 지날 때, ${K}의 값은?`, kv, { signed: true,
        explain: `기울기는 ${frac(iq(dy), dx)} = ${iq(a)}이다. ${X}의 값이 ${iq(x0)}에서 ${iq(x1)}까지 ${iq(x1 - x0)}만큼 증가하므로 ${Y}의 값은 ${iq(a)} × ${par(x1 - x0)} = ${iq(kv - y0)}만큼 증가한다. ${K} = ${iq(y0)} + ${par(kv - y0)} = ${iq(kv)}이다.`,
        facts: { value: `${jn(y0)}+${jn(dy)}*(${jn(x1)}-${jn(x0)})/${dx}` }
      });
    }),
    T('equation-parallel-point', '평행한 그래프와 한 점으로 식 구하기', '①58', (d) => {
      const [a, b] = ab(d), c = d.until(() => nz(d, -9, 9), (v) => v !== b), x0 = nz(d, -4, 4), y0 = a * x0 + b;
      return eqAns(`점 ${ptj(x0, y0, '을/를')} 지나고 일차함수 ${eq(a, c)}의 그래프와 평행한 ${ASK}`, a, b, {
        explain: `서로 평행한 두 일차함수의 그래프는 기울기가 같으므로 ${eqT(tm(a, X), lt(BB))}로 놓는다. ${is(X, x0)}, ${is(Y, y0)}${tail(Math.abs(y0), '을/를')} 대입하면 ${is(BB, b)}이다. 따라서 ${eq(a, b)}이다.`,
        facts: { calc: [[jn(a), 0], [`${jn(y0)}-${jn(a)}*${jn(x0)}`, 1]] }
      });
    }),
    T('equation-two-points', '두 점으로 식 구하기', '①59 ②67', (d) => {
      const [a, b] = ab(d), [x1, x2] = d.until(() => [nz(d, -4, 4), nz(d, -4, 4)], ([u, v]) => u !== v), y1 = a * x1 + b, y2 = a * x2 + b, run = `(${jn(x2)}-${jn(x1)})`, rise = `(${jn(y2)}-${jn(y1)})`;
      return eqAns(`두 점 ${pt(x1, y1)}, ${ptj(x2, y2, '을/를')} 지나는 ${ASK}`, a, b, {
        explain: `기울기는 ${frac(`${iq(y2)} ${MINUS} ${par(y1)}`, `${iq(x2)} ${MINUS} ${par(x1)}`)} = ${iq(a)}이므로 ${eqT(tm(a, X), lt(BB))}로 놓는다. ${is(X, x1)}, ${is(Y, y1)}${tail(Math.abs(y1), '을/를')} 대입하면 ${is(BB, b)}이다. 따라서 ${eq(a, b)}이다.`,
        facts: { calc: [[`${rise}/${run}`, 0], [`${jn(y1)}-${rise}*${jn(x1)}/${run}`, 1]] }
      });
    }),
    T('equation-two-points-frac', '두 점으로 기울기가 분수인 식 고르기', '①59 ②67', (d) => {
      // 틀린 식: 기울기를 거꾸로 나눈 것, 기울기의 부호를 놓친 것, y절편의 부호를 놓친 것
      const a = slope(d, 'frac'), b = nz(d, -6, 6), [t1, t2] = d.until(() => [d.int(-3, 3), d.int(-3, 3)], ([u, v]) => u !== v && u !== 0 && v !== 0), x1 = a.q * t1, y1 = a.p * t1 + b, x2 = a.q * t2, y2 = a.p * t2 + b, s = a.p > 0 ? 1 : -1;
      const rows = d.shuffle([[a, b], [Q(s * a.q, Math.abs(a.p)), b], [qneg(a), b], [a, -b]]), on = ([m, c]) => qcmp(qmul(m, Q(x1)), Q(y1 - c)) === 0 && qcmp(qmul(m, Q(x2)), Q(y2 - c)) === 0;
      return C(`두 점 ${pt(x1, y1)}, ${ptj(x2, y2, '을/를')} 지나는 직선을 그래프로 하는 일차함수의 식은?`, rows.map(([m, c]) => eq(m, c)), rows.findIndex(on), {
        explain: `기울기는 ${frac(`${iq(y2)} ${MINUS} ${par(y1)}`, `${iq(x2)} ${MINUS} ${par(x1)}`)} = ${iq(a)}이므로 ${eqT(tm(a, X), lt(BB))}로 놓는다. ${is(X, x1)}, ${is(Y, y1)}${tail(Math.abs(y1), '을/를')} 대입하면 ${is(BB, b)}이다. 따라서 ${eq(a, b)}이다.`,
        facts: { truth: rows.map(on), want: true }
      });
    }),
    T('equation-xint-point', 'x절편과 한 점으로 식 구하기', '②67 심45·47', (d) => {
      // x절편이 p이면 그래프가 점 (p, 0)을 지난다.
      const a = pm(d) * d.int(2, 5), p = nz(d, -4, 4), x0 = d.until(() => nz(d, -5, 5), (v) => v !== p), y0 = a * (x0 - p), b = -a * p, run = `(${jn(x0)}-${jn(p)})`;
      return eqAns(`${XI}이 ${iq(p)}이고 점 ${ptj(x0, y0, '을/를')} 지나는 ${ASK}`, a, b, {
        explain: `${XI}이 ${iq(p)}이므로 그래프가 점 ${ptj(p, 0, '을/를')} 지난다. 두 점 ${pt(p, 0)}, ${ptj(x0, y0, '을/를')} 지나므로 기울기는 ${frac(`${iq(y0)} ${MINUS} 0`, `${iq(x0)} ${MINUS} ${par(p)}`)} = ${iq(a)}이다. ${eqT(tm(a, X), lt(BB))}에 ${is(X, p)}, ${is(Y, 0)}${tail(0, '을/를')} 대입하면 ${is(BB, b)}이므로 ${eq(a, b)}이다.`,
        facts: { calc: [[`${jn(y0)}/${run}`, 0], [`0-${jn(y0)}*${jn(p)}/${run}`, 1]], unseen: [0] }
      });
    }),
    T('equation-intercepts', 'x절편과 y절편으로 식 구하기', '①60 ②69', (d) => {
      const a = pm(d) * d.int(2, 4), p = nz(d, -3, 3), q = -a * p;
      return eqAns(`${XI}이 ${iq(p)}이고 ${YI}이 ${iq(q)}인 ${ASK}`, a, q, {
        explain: `그래프가 두 점 ${pt(p, 0)}, ${ptj(0, q, '을/를')} 지나므로 기울기는 ${frac(`${iq(q)} ${MINUS} 0`, `0 ${MINUS} ${par(p)}`)} = ${iq(a)}이다. ${YI}이 ${iq(q)}이므로 ${eq(a, q)}이다.`,
        facts: { calc: [[`(0-${jn(q)})/${jn(p)}`, 0], [jn(q), 1]], unseen: [0] }
      });
    }),
    T('equation-from-two-graphs', '다른 두 그래프와 축 위에서 만나는 직선의 식 구하기', '①31 ②69', (d) => {
      // x축 위에서 만나면 x절편이, y축 위에서 만나면 y절편이 같다.
      const a = pm(d) * d.int(2, 4), p = nz(d, -3, 3), q = -a * p, a1 = d.until(() => pm(d) * d.int(2, 5), (v) => v !== a), b1 = -a1 * p, a2 = d.until(() => slope(d, d.bool() ? 'int' : 'frac'), (v) => qcmp(v, Q(a)) !== 0 && qcmp(v, Q(a1)) !== 0);
      return eqAns(`일차함수 ${eq(a1, b1)}의 그래프와 ${XA} 위에서 만나고, 일차함수 ${eq(a2, q)}의 그래프와 ${YA} 위에서 만나는 ${ASK}`, a, q, {
        explain: `${eq(a1, b1)}의 그래프의 ${XI}은 ${iq(p)}이고, ${eq(a2, q)}의 그래프의 ${YI}은 ${iq(q)}이다. 구하는 직선은 두 점 ${pt(p, 0)}, ${ptj(0, q, '을/를')} 지나므로 기울기는 ${iq(a)}이고, ${eq(a, q)}이다.`,
        facts: { calc: [[`${jn(q)}*${jn(a1)}/${jn(b1)}`, 0], [jn(q), 1]] }
      });
    }),
    T('equation-graph-intercepts', '두 절편이 보이는 그래프에서 식 구하기', '①61 ②70', (d) => {
      // 모눈 그림: 직선이 두 축과 만나는 곳에 점을 찍었다.
      const c = d.until(() => { const p = pm(d), a = pm(d) * d.int(2, 3), q = -a * p; return { p, a, q }; }, (v) => plOk(gridOf(Q(v.a), v.q, [[v.p, 0], [0, v.q]])));
      return eqAns(`그림과 같은 ${ASK}`, c.a, c.q, {
        figure: pl(gridOf(Q(c.a), c.q, [[c.p, 0], [0, c.q]])),
        explain: `그래프가 두 점 ${pt(c.p, 0)}, ${ptj(0, c.q, '을/를')} 지나므로 기울기는 ${frac(`${iq(c.q)} ${MINUS} 0`, `0 ${MINUS} ${par(c.p)}`)} = ${iq(c.a)}이고 ${YI}은 ${iq(c.q)}이다. 따라서 ${eq(c.a, c.q)}이다.`,
        facts: { calc: [[`(0-${jn(c.q)})/${jn(c.p)}`, 0], [jn(c.q), 1]], unseen: [0], rule: 'graph-cuts' }
      });
    }),
    T('equation-graph-points', '그래프 위의 두 점에서 식 구하기', '①62', (d) => {
      // 눈금 없는 그림: 축 위에 있지 않은 두 점에서 두 축에 점선을 내리고 수를 적었다.
      const c = d.until(() => { const a = pm(d) * 2, b = nz(d, -3, 3), x1 = nz(d, -2, 2), x2 = nz(d, -2, 3); return { a, b, x1, y1: a * x1 + b, x2, y2: a * x2 + b }; },
        (v) => v.x1 < v.x2 && v.y1 !== 0 && v.y2 !== 0 && Math.abs(v.y1) <= 5 && Math.abs(v.y2) <= 5 && plOk(dotFig(v.x1, v.y1, v.x2, v.y2)));
      const { a, b, x1, y1, x2, y2 } = c, run = `(${jn(x2)}-${jn(x1)})`, rise = `(${jn(y2)}-${jn(y1)})`;
      return eqAns(`그림과 같은 ${ASK}`, a, b, {
        figure: pl(dotFig(x1, y1, x2, y2)),
        explain: `그래프가 두 점 ${pt(x1, y1)}, ${ptj(x2, y2, '을/를')} 지나므로 기울기는 ${frac(`${iq(y2)} ${MINUS} ${par(y1)}`, `${iq(x2)} ${MINUS} ${par(x1)}`)} = ${iq(a)}이다. ${eqT(tm(a, X), lt(BB))}에 ${is(X, x1)}, ${is(Y, y1)}${tail(Math.abs(y1), '을/를')} 대입하면 ${is(BB, b)}이므로 ${eq(a, b)}이다.`,
        facts: { calc: [[`${rise}/${run}`, 0], [`${jn(y1)}-${rise}*${jn(x1)}/${run}`, 1]], rule: 'graph-dots' }
      });
    }),
    T('equation-graph-xint', '그래프 위의 두 점으로 식을 구해 x절편 구하기', '②72 심48', (d) => {
      // 눈금 없는 그림의 두 점으로 식을 구하고(기울기는 분수), 그림에 적혀 있지 않은 x절편을 구한다.
      const c = d.until(() => { const [m, q] = d.pick([[1, 2], [1, 3], [2, 3], [3, 2], [1, 4]]), s = pm(d), p = nz(d, -6, 6), [t1, t2] = d.shuffle([-3, -2, -1, 1, 2, 3]).slice(0, 2).sort((u, v) => u - v); return { p, x1: p + q * t1, y1: s * m * t1, x2: p + q * t2, y2: s * m * t2 }; },
        (v) => v.x1 !== 0 && v.x2 !== 0 && Math.abs(v.x1) <= 4 && Math.abs(v.x2) <= 4 && Math.abs(v.y1) <= 4 && Math.abs(v.y2) <= 4 && plOk(dotFig(v.x1, v.y1, v.x2, v.y2)));
      const { p, x1, y1, x2, y2 } = c, a = Q(y2 - y1, x2 - x1), b = qsub(Q(y1), qmul(a, Q(x1)));
      return N(`그림과 같은 일차함수의 그래프의 ${XI}은?`, p, { signed: true,
        figure: pl(dotFig(x1, y1, x2, y2)),
        explain: `그래프가 두 점 ${pt(x1, y1)}, ${ptj(x2, y2, '을/를')} 지나므로 기울기는 ${frac(`${iq(y2)} ${MINUS} ${par(y1)}`, `${iq(x2)} ${MINUS} ${par(x1)}`)} = ${iq(a)}이고, 식은 ${eq(a, b)}이다. ${is(Y, 0)}${tail(0, '을/를')} 대입하면 ${is(X, p)}이므로 ${XI}은 ${iq(p)}이다.`,
        facts: { value: `${jn(x1)}-${jn(y1)}*(${jn(x2)}-${jn(x1)})/(${jn(y2)}-${jn(y1)})` }
      });
    }),
    T('equation-parallel-fig', '그림의 직선과 평행하고 한 점을 지나는 직선의 식 구하기', '①63 ②71', (d) => {
      // 눈금 없는 그림: 직선이 두 축과 만나는 곳에 수를 적었다.
      const c = d.until(() => { const a = pm(d) * d.int(2, 3), p = pm(d) * d.int(1, 2), q = -a * p, x0 = nz(d, -4, 4), b = nz(d, -9, 9); return { a, p, q, x0, y0: a * x0 + b, b }; }, (v) => v.b !== v.q && plOk(axesOf(Q(v.a), v.q)));
      return eqAns(`그림의 직선과 평행하고 점 ${ptj(c.x0, c.y0, '을/를')} 지나는 ${ASK}`, c.a, c.b, {
        figure: pl(axesOf(Q(c.a), c.q)),
        explain: `그림의 직선은 두 점 ${pt(c.p, 0)}, ${ptj(0, c.q, '을/를')} 지나므로 기울기는 ${frac(`${iq(c.q)} ${MINUS} 0`, `0 ${MINUS} ${par(c.p)}`)} = ${iq(c.a)}이다. 평행한 직선의 기울기도 ${iq(c.a)}이므로 ${eqT(tm(c.a, X), lt(BB))}에 ${is(X, c.x0)}, ${is(Y, c.y0)}${tail(Math.abs(c.y0), '을/를')} 대입하면 ${is(BB, c.b)}이다. 따라서 ${eq(c.a, c.b)}이다.`,
        facts: { calc: [[`(0-${jn(c.q)})/${jn(c.p)}`, 0], [`${jn(c.y0)}+${jn(c.q)}*${jn(c.x0)}/${jn(c.p)}`, 1]], unseen: [0] }
      });
    }),
    T('equation-parallel-two-points', '두 점을 지나는 직선과 평행하고 한 점을 지나는 직선의 식 구하기', '②68', (d) => {
      const [a, b] = ab(d), [x1, x2] = d.until(() => [d.int(-4, 4), d.int(-4, 4)], ([u, v]) => u !== v), c = d.until(() => d.int(-6, 6), (v) => v !== b), y1 = a * x1 + c, y2 = a * x2 + c, x0 = nz(d, -4, 4), y0 = a * x0 + b, run = `(${jn(x2)}-${jn(x1)})`, rise = `(${jn(y2)}-${jn(y1)})`;
      return eqAns(`두 점 ${pt(x1, y1)}, ${ptj(x2, y2, '을/를')} 지나는 직선과 평행하고 점 ${ptj(x0, y0, '을/를')} 지나는 ${ASK}`, a, b, {
        explain: `두 점 ${pt(x1, y1)}, ${ptj(x2, y2, '을/를')} 지나는 직선의 기울기는 ${frac(`${iq(y2)} ${MINUS} ${par(y1)}`, `${iq(x2)} ${MINUS} ${par(x1)}`)} = ${iq(a)}이다. 평행한 직선의 기울기도 ${iq(a)}이므로 ${eqT(tm(a, X), lt(BB))}에 ${is(X, x0)}, ${is(Y, y0)}${tail(Math.abs(y0), '을/를')} 대입하면 ${is(BB, b)}이다. 따라서 ${eq(a, b)}이다.`,
        facts: { calc: [[`${rise}/${run}`, 0], [`${jn(y0)}-${rise}*${jn(x0)}/${run}`, 1]] }
      });
    }),
    T('equation-claims', '두 점을 지나는 직선에 대한 설명의 참·거짓', '②56', (d) => {
      const [a, b] = ab(d), [x1, x2] = d.until(() => [nz(d, -4, 4), nz(d, -4, 4)], ([u, v]) => u !== v), y1 = a * x1 + b, y2 = a * x2 + b, cl = lineClaims(d, a, b), want = d.bool();
      const item = claimQ(d, `두 점 ${pt(x1, y1)}, ${ptj(x2, y2, '을/를')} 지나는 직선에 대한 설명으로 ${want ? '옳은' : '옳지 않은'} 것은?`, cl.yes, cl.no, want);
      item.explain = `기울기는 ${frac(`${iq(y2)} ${MINUS} ${par(y1)}`, `${iq(x2)} ${MINUS} ${par(x1)}`)} = ${iq(a)}이고, 점 ${ptj(x1, y1, '을/를')} 지나므로 이 직선을 그래프로 하는 일차함수의 식은 ${eq(a, b)}이다. ${item.explain}`;
      return item;
    }),
    T('equation-graph-claims', '그래프를 보고 식을 구해 설명의 참·거짓 가리기', '②56 심29', (d) => {
      // 모눈 그림: 직선이 두 축과 만나는 곳에 점을 찍었다.
      const c = d.until(() => { const p = pm(d), a = pm(d) * d.int(2, 3), q = -a * p; return { p, a, q }; }, (v) => plOk(gridOf(Q(v.a), v.q, [[v.p, 0], [0, v.q]])));
      const cl = lineClaims(d, c.a, c.q), want = d.bool(), keep = (list) => list.filter((s) => !/절편/.test(typeof s === 'string' ? s : s[0]));
      const item = claimQ(d, `그림과 같은 일차함수의 그래프에 대한 설명으로 ${want ? '옳은' : '옳지 않은'} 것은?`, keep(cl.yes).concat([`일차함수 ${eq(c.a, 0)}의 그래프와 평행하다.`]), keep(cl.no).concat([[`일차함수 ${eq(-c.a, c.q)}의 그래프와 평행하다.`, `기울기가 ${iq(c.a)}이므로 ${eq(-c.a, c.q)}의 그래프와 평행하지 않다.`]]), want);
      item.figure = pl(gridOf(Q(c.a), c.q, [[c.p, 0], [0, c.q]]));
      item.explain = `그래프가 두 점 ${pt(c.p, 0)}, ${ptj(0, c.q, '을/를')} 지나므로 기울기는 ${iq(c.a)}, ${YI}은 ${iq(c.q)}이고 식은 ${eq(c.a, c.q)}이다. ${item.explain}`;
      return item;
    }),
    T('equation-then-area', '식을 구해 그래프와 두 축으로 둘러싸인 도형의 넓이 구하기', '①53 ②33', (d) => {
      const [a, b] = d.pick([[2, 4], [2, -4], [-2, 6], [-2, -6], [3, 6], [-3, 6], [-4, 8], [4, -8], [2, 8], [-2, -8], [-3, -6], [2, 6], [-2, 4]]), x0 = d.until(() => nz(d, -4, 4), (v) => a * v + b !== 0), y0 = a * x0 + b, p = -b / a, area = Math.abs(b * p) / 2, bx = `(${jn(y0)}-${jn(a)}*${jn(x0)})`;
      return N(`기울기가 ${iq(a)}이고 점 ${ptj(x0, y0, '을/를')} 지나는 일차함수의 그래프와 ${XA}, ${YA}으로 둘러싸인 도형의 넓이는?`, area, {
        explain: `${eqT(tm(a, X), lt(BB))}에 ${is(X, x0)}, ${is(Y, y0)}${tail(Math.abs(y0), '을/를')} 대입하면 ${is(BB, b)}이므로 ${eq(a, b)}이다. ${XI}은 ${iq(p)}, ${YI}은 ${iq(b)}이므로 넓이는 ${frac(1, 2)} × ${Math.abs(p)} × ${Math.abs(b)} = ${area}이다.`,
        facts: { value: `${bx}*${bx}/${Math.abs(a)}/2`, unseen: [2] }
      });
    })
  ]);

  // ── 일차함수의 활용 ──
  B.addTypes('8-1-5', 'use', [
    T('use-per-one', '일정하게 변하는 양을 식으로 나타내고 값 구하기', '①64·67 ②73', (d) => {
      const s = d.pick([
        () => { const r = d.int(2, 3), t = d.int(3, 7), L = r * d.int(9, 12); return { a: -r, b: L, t, v: L - r * t, ask: '길이', unit: 'cm', text: `길이가 ${L} cm인 양초에 불을 붙이면 1분마다 ${r} cm씩 일정하게 짧아진다. 불을 붙인 지 ${X}분 후의 양초의 길이를 ${Y} cm라 할 때, ${Y}를 ${X}에 대한 식으로 나타내고 불을 붙인 지 ${t}분 후의 양초의 길이를 구하시오.`, told: `1분마다 ${r} cm씩 짧아지므로` }; },
        () => { const r = d.int(2, 5), t = d.int(4, 9), c = d.pick([10, 15, 20]); return { a: r, b: c, t, v: c + r * t, ask: '온도', unit: '°C', text: `온도가 ${c} °C인 물을 데우면 1분마다 온도가 ${r} °C씩 일정하게 올라간다. 데우기 시작한 지 ${X}분 후의 물의 온도를 ${Y} °C라 할 때, ${Y}를 ${X}에 대한 식으로 나타내고 데우기 시작한 지 ${t}분 후의 물의 온도를 구하시오.`, told: `1분마다 ${r} °C씩 올라가므로` }; },
        () => { const r = d.pick([4, 5, 6]), t = d.int(5, 12), L = d.pick([120, 150, 180]); return { a: -r, b: L, t, v: L - r * t, ask: '물의 양', unit: 'L', text: `물이 ${L} L 들어 있는 물통에서 1분마다 ${r} L씩 일정하게 물이 빠져나간다. 물이 빠져나가기 시작한 지 ${X}분 후에 남아 있는 물의 양을 ${Y} L라 할 때, ${Y}를 ${X}에 대한 식으로 나타내고 ${t}분 후에 남아 있는 물의 양을 구하시오.`, told: `1분마다 ${r} L씩 줄어들므로` }; }
      ])(), r = Math.abs(s.a);
      return useAns(s.text, s.a, s.b, s.ask, s.v, s.unit, {
        explain: `${s.told} ${eq(s.a, s.b)}이다. ${is(X, s.t)}${tail(s.t, '을/를')} 대입하면 ${Y} = ${iq(s.a)} × ${s.t} + ${s.b} = ${s.v}이다.`,
        facts: { calc: [[s.a < 0 ? `0-${r}` : `${r}`, 0], [`${s.b}`, 1], [s.a < 0 ? `${s.b}-${r}*${s.t}` : `${s.b}+${r}*${s.t}`, 2]], unseen: [0] }
      });
    }),
    T('use-value-to-x', '식을 세워 y의 값이 주어질 때 x의 값 구하기', '①67·69 ②73 심60', (d) => {
      const s = d.pick([
        () => { const v = d.pick([2, 3, 4]), D = v * d.pick([100, 120, 150]), R = D - v * d.int(30, 80); return { ans: (D - R) / v, unit: '분', value: `(${D}-${R})/${v}`, text: `${D} km 떨어진 도시까지 분속 ${v} km로 일정하게 달리는 기차를 타고 간다. 남은 거리가 ${R} km가 되는 것은 출발한 지 몇 분 후인가?`, told: `출발한 지 ${X}분 후의 남은 거리를 ${Y} km라 하면 ${eqT(tm(D), tm(-v, X))}이다. ${is(Y, R)}${tail(R, '을/를')} 대입하면 ${is(X, (D - R) / v)}이다.` }; },
        () => { const r = d.pick([15, 20, 25]), L = r * d.int(12, 20); return { ans: L / r, unit: '분', value: `${L}/${r}`, text: `물이 ${L} L 들어 있는 물탱크에서 1분마다 ${r} L씩 일정하게 물이 빠져나간다. 물탱크의 물이 모두 빠져나가는 데 걸리는 시간은 몇 분인가?`, told: `물이 빠져나가기 시작한 지 ${X}분 후에 남아 있는 물의 양을 ${Y} L라 하면 ${eqT(tm(L), tm(-r, X))}이다. ${is(Y, 0)}${tail(0, '을/를')} 대입하면 ${is(X, L / r)}이다.` }; },
        () => { const r = d.int(3, 6), c = d.pick([10, 12, 16]), t = d.int(8, 14), T2 = c + r * t; return { ans: t, unit: '분', value: `(${T2}-${c})/${r}`, text: `온도가 ${c} °C인 물을 데우면 1분마다 온도가 ${r} °C씩 일정하게 올라간다. 물의 온도가 ${T2} °C가 되는 것은 데우기 시작한 지 몇 분 후인가?`, told: `데우기 시작한 지 ${X}분 후의 물의 온도를 ${Y} °C라 하면 ${eq(r, c)}이다. ${is(Y, T2)}${tail(T2, '을/를')} 대입하면 ${is(X, t)}이다.` }; }
      ])();
      return N(s.text, s.ans, { unit: s.unit, explain: s.told, facts: { value: s.value } });
    }),
    T('use-per-several', '몇 단위마다 일정하게 변하는 양', '①64·66 ②74', (d, n) => {
      if (n === 0) {
        // 몇 분마다 얼마씩 내려가는 온도(①64): 시간이 그 단위의 배수이다.
        const [m, c] = d.pick([[2, 3], [2, 5], [4, 3], [4, 5], [5, 2], [5, 3], [5, 4], [5, 6]]), T = d.pick([80, 85, 90, 95]), t = m * d.int(3, 8), v = T - c * t / m;
        return N(`온도가 ${T} °C인 물을 식히면 ${m}분마다 온도가 ${c} °C씩 일정하게 내려간다. 식히기 시작한 지 ${t}분 후 물의 온도는 몇 °C인가?`, v, { unit: '°C',
          explain: `1분마다 온도가 ${frac(c, m)} °C씩 내려간다. 식히기 시작한 지 ${X}분 후의 물의 온도를 ${Y} °C라 하면 ${eq(Q(-c, m), T)}이다. ${is(X, t)}일 때 ${is(Y, v)}이다.`,
          facts: { value: `${T}-${c}*${t}/${m}`, rule: 'several-forward' }
        });
      }
      if (n === 1) {
        const [m, c] = d.pick([[3, 1], [3, 2], [4, 1], [5, 1], [5, 2]]), k = d.int(3, 8), L = c * d.int(10, 14), R = L - c * k, t = m * k;
        return N(`길이가 ${L} cm인 양초에 불을 붙이면 ${m}분마다 ${c} cm씩 일정하게 짧아진다. 양초의 길이가 ${R} cm가 되는 것은 불을 붙인 지 몇 분 후인가?`, t, { unit: '분',
          explain: `1분마다 ${frac(c, m)} cm씩 짧아진다. 불을 붙인 지 ${X}분 후의 길이를 ${Y} cm라 하면 ${eq(Q(-c, m), L)}이다. ${is(Y, R)}${tail(R, '을/를')} 대입하면 ${is(X, t)}이다.`,
          facts: { value: `(${L}-${R})*${m}/${c}`, rule: 'several-back' }
        });
      }
      // 용수철(①66 ②74의 변형): 물체의 무게가 추의 무게의 배수가 아니어서 1 g마다 늘어나는 길이로 고쳐야 한다(답이 소수).
      const [g, c, w] = d.pick([[4, 3, 10], [4, 3, 6], [2, 3, 5], [2, 3, 7], [4, 1, 6], [4, 1, 10], [2, 1, 5], [2, 1, 9]]), L = d.pick([6, 8, 10, 12]), v = L + c * w / g;
      return D(`길이가 ${L} cm인 용수철에 무게가 ${g} g인 추를 한 개 매달 때마다 길이가 ${c} cm씩 일정하게 늘어난다. 이 용수철에 무게가 ${w} g인 물체를 매달았을 때, 용수철의 길이는 몇 cm인가?`, v, { unit: 'cm',
        explain: `무게가 1 g 늘어날 때마다 길이가 ${frac(c, g)} cm씩 늘어난다. 무게가 ${X} g인 물체를 매달았을 때의 길이를 ${Y} cm라 하면 ${eq(Q(c, g), L)}이다. ${is(X, w)}일 때 ${Y} = ${frac(c, g)} × ${w} + ${L} = ${v}이다.`,
        facts: { value: `${L}+${c}*${w}/${g}`, rule: 'several-decimal' }
      });
    }, { count: 3 }),
    T('use-pick-eq', '몇 단위마다 변하는 상황에 맞는 식 고르기', '심59', (d) => {
      // 기울기는 1 kg마다 늘어나는 길이이다. 틀린 식: 여러 단위마다의 변화량을 그대로 쓴 것, 거꾸로 나눈 것, 처음 길이를 뺀 것.
      const [g, c] = d.pick([[3, 6], [2, 6], [2, 8], [3, 9], [4, 8], [5, 10], [2, 10], [3, 12]]), L = d.pick([12, 15, 18, 20]), r = c / g, rows = d.shuffle([[eq(r, L), true], [eq(c, L), false], [eq(Q(g, c), L), false], [eq(r, 0), false]]);
      return C(`길이가 ${L} cm인 용수철에 물체를 매달면 물체의 무게가 ${g} kg 늘어날 때마다 길이가 ${c} cm씩 일정하게 늘어난다. 무게가 ${X} kg인 물체를 매달았을 때의 용수철의 길이를 ${Y} cm라 할 때, ${X}와 ${Y} 사이의 관계식은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
        explain: `무게가 ${g} kg 늘어날 때마다 ${c} cm씩 늘어나므로 1 kg 늘어날 때마다 ${c} ÷ ${g} = ${r}(cm)씩 늘어난다. 처음 길이가 ${L} cm이므로 ${eq(r, L)}이다.`,
        facts: { truth: rows.map((row) => row[1]), want: true }
      });
    }),
    T('use-table-eq', '표를 보고 식을 구해 값 구하기', '①64', (d) => {
      const step = d.pick([2, 5]), r = d.int(2, 4), y0 = d.pick([10, 15, 20]), xs = [0, 1, 2, 3].map((i) => i * step), ys = xs.map((x) => y0 + r * x), t = d.until(() => d.int(11, 25), (v) => v % step !== 0), v = y0 + r * t;
      return useAns(`어떤 액체를 데우면서 ${X}분 후의 온도 ${Y} °C를 재었더니 다음 표와 같았다. 온도가 일정하게 올라간다고 할 때, ${Y}를 ${X}에 대한 식으로 나타내고 데우기 시작한 지 ${t}분 후의 온도를 구하시오.`, r, y0, '온도', v, '°C', {
        figure: xyTable(xs, ys, [`${X}(분)`, `${Y}(°C)`]),
        explain: `${X}의 값이 ${step}만큼 증가할 때 ${Y}의 값은 ${r * step}만큼 증가하므로 기울기는 ${frac(r * step, step)} = ${r}이다. ${is(X, 0)}일 때 ${is(Y, y0)}이므로 ${eq(r, y0)}이고, ${is(X, t)}일 때 ${is(Y, v)}이다.`,
        facts: { calc: [[`(${ys[1]}-${y0})/${step}`, 0], [`${y0}`, 1], [`${y0}+(${ys[1]}-${y0})*${t}/${step}`, 2]] }
      });
    }),
    T('use-initial', '두 때의 값으로 처음의 양 구하기', '①68 ②76', (d) => {
      const r = d.int(2, 5), t1 = d.pick([4, 5, 6]), t2 = t1 + d.pick([5, 6, 10]), c = d.pick([10, 12, 15, 20]), v1 = c + r * t1, v2 = c + r * t2;
      return N(`물이 들어 있는 수조에 일정한 속력으로 물을 채우고 있다. 물을 채운 시간과 수조에 들어 있는 물의 양이 다음 표와 같을 때, 물을 채우기 전 수조에 들어 있던 물의 양은 몇 L인가?`, c, { unit: 'L',
        figure: xyTable([t1, t2], [v1, v2], ['채운 시간(분)', '물의 양(L)']),
        explain: `${t2 - t1}분 동안 물이 ${v2} ${MINUS} ${v1} = ${v2 - v1}(L) 늘어났으므로 1분마다 ${r} L씩 늘어난다. ${t1}분 동안 ${r * t1} L를 채웠으므로 처음에 들어 있던 물의 양은 ${v1} ${MINUS} ${r * t1} = ${c}(L)이다.`,
        facts: { value: `${v1}-(${v2}-${v1})*${t1}/(${t2}-${t1})` }
      });
    }),
    T('use-unit-change', '단위를 바꾸어 식을 세우는 활용', '①64·69 ②74 심60', (d) => {
      const s = d.pick([
        () => { const g = d.pick([18, 20, 24]), h = d.int(1, 3), T2 = g - 6 * h; return { ans: h, unit: 'km', value: `(${g}-${T2})/0.6*100/1000`, unseen: [1000], text: `지면에서 높이가 100 m 높아질 때마다 기온이 0.6 °C씩 일정하게 내려간다고 한다. 지면의 기온이 ${g} °C일 때, 기온이 ${T2} °C인 곳의 지면으로부터의 높이는 몇 km인가?`, told: `높이가 1 km 높아질 때마다 기온이 6 °C씩 내려간다. 높이가 ${X} km인 곳의 기온을 ${Y} °C라 하면 ${eq(-6, g)}이다. ${is(Y, T2)}${tail(T2, '을/를')} 대입하면 ${is(X, h)}이다.` }; },
        () => { const v = d.pick([2, 3]), m = d.pick([1, 2]), H = v * 60 * m + d.pick([20, 30, 60]); return { ans: H - v * 60 * m, unit: 'm', value: `${H}-${v}*60*${m}`, unseen: [60], text: `지상 ${H} m 높이에 있는 전망대에서 엘리베이터가 초속 ${v} m로 일정하게 내려온다. 출발한 지 ${m}분 후 엘리베이터의 높이는 지상 몇 m인가?`, told: `${m}분은 ${60 * m}초이다. 출발한 지 ${X}초 후의 높이를 ${Y} m라 하면 ${eqT(tm(H), tm(-v, X))}이다. ${is(X, 60 * m)}${tail(0, '을/를')} 대입하면 ${is(Y, H - v * 60 * m)}이다.` }; },
        () => { const v = d.pick([60, 90, 120]), D = d.pick([150, 180, 240]), t = d.pick([20, 40, 50]); return { ans: D - v * t / 60, unit: 'km', value: `${D}-${v}*${t}/60`, unseen: [60], text: `${D} km 떨어진 곳까지 시속 ${v} km로 일정하게 달리는 자동차를 타고 간다. 출발한 지 ${t}분 후 남은 거리는 몇 km인가?`, told: `시속 ${v} km는 1분에 ${frac(v / 30, 2)} km씩 가는 빠르기이다. 출발한 지 ${X}분 후의 남은 거리를 ${Y} km라 하면 ${eqT(tm(D), tm(Q(-v, 60), X))}이다. ${is(X, t)}${tail(t, '을/를')} 대입하면 ${is(Y, D - v * t / 60)}이다.` }; }
      ])();
      return N(s.text, s.ans, { unit: s.unit, explain: s.told, facts: { value: s.value, unseen: s.unseen } });
    }),
    T('use-fuel', '달린 거리와 남은 연료', '②75', (d) => {
      const k = d.pick([12, 15, 16, 18, 20]), F = d.pick([40, 50, 60]), u = d.int(10, 30), dist = k * u, left = F - u;
      return N(`1 L의 휘발유로 ${k} km를 달리는 자동차에 휘발유가 ${F} L 들어 있다. 이 자동차가 ${dist} km를 달린 후 남아 있는 휘발유의 양은 몇 L인가?`, left, { unit: 'L',
        explain: `1 km를 달리는 데 휘발유가 ${frac(1, k)} L 든다. ${X} km를 달린 후 남아 있는 휘발유의 양을 ${Y} L라 하면 ${eqT(tm(F), tm(Q(-1, k), X))}이다. ${is(X, dist)}${tail(dist, '을/를')} 대입하면 ${Y} = ${F} ${MINUS} ${u} = ${left}이다.`,
        facts: { value: `${F}-${dist}/${k}` }
      });
    }),
    T('use-given-eq', '식이 주어진 상황에서 값 구하기', '①65', (d) => {
      const g = d.pick([12, 15, 18, 21]), h = d.int(1, 4), T2 = g - 6 * h;
      return N(`지면으로부터의 높이가 ${X} km인 곳의 기온을 ${Y} °C라 할 때, ${eq(-6, g)}인 관계가 있다고 한다. 기온이 ${iq(T2)} °C인 곳의 지면으로부터의 높이는 몇 km인가?`, h, { unit: 'km',
        explain: `${eq(-6, g)}에 ${is(Y, T2)}${tail(Math.abs(T2), '을/를')} 대입하면 ${iq(T2)} = ${ex(tm(-6, X), tm(g))}에서 ${is(X, h)}이다.`,
        facts: { value: `(${jn(T2)}-${g})/(-6)` }
      });
    }),
    T('use-shrink-rect', '변의 길이를 줄인 직사각형의 넓이', '①71', (d) => {
      const h = d.int(4, 8), w = d.int(9, 15), x = d.int(2, 6), S = h * (w - x);
      return N(`가로의 길이가 ${w} cm, 세로의 길이가 ${h} cm인 직사각형이 있다. 가로의 길이를 줄여 넓이가 ${S} cm²인 직사각형을 만들려면 가로의 길이를 몇 cm 줄여야 하는가?`, x, { unit: 'cm',
        explain: `가로의 길이를 ${X} cm 줄였을 때의 넓이를 ${Y} cm²라 하면 ${Y} = ${h}(${w} ${MINUS} ${X}), 곧 ${eqT(tm(-h, X), tm(h * w))}이다. ${is(Y, S)}${tail(S, '을/를')} 대입하면 ${is(X, x)}이다.`,
        facts: { value: `${w}-${S}/${h}` }
      });
    }),
    T('use-graph', '그래프로 주어진 활용', '②77 심61', (d, n) => {
      if (n === 0) {
        // 두 축 위의 점을 이은 그래프(남은 양): 눈금 사이의 값은 식을 세워 구한다.
        const [b, k] = d.pick([[80, 7], [40, 12], [40, 10], [80, 5], [120, 4]]), c = b * k, q = c * d.pick([3, 5]) / 8, v = b - q / k;
        return N(`그림은 어느 자동차가 ${X} km를 달린 후 남아 있는 휘발유의 양을 ${Y} L라 할 때, ${X}와 ${Y} 사이의 관계를 나타낸 그래프이다. 이 자동차가 ${q} km를 달린 후 남아 있는 휘발유의 양은 몇 L인가?`, v, { unit: 'L',
          figure: gr({ xname: 'x(km)', yname: 'y(L)', xmax: c, ymax: b, xstep: c / 4, ystep: b / 4, paths: [{ pts: [[0, b], [c, 0]] }] }),
          explain: `그래프가 두 점 ${pt(0, b)}, ${ptj(c, 0, '을/를')} 지나므로 기울기는 ${frac(`0 ${MINUS} ${b}`, `${c} ${MINUS} 0`)} = ${iq(Q(-1, k))}이고 식은 ${eq(Q(-1, k), b)}이다. ${is(X, q)}${tail(q, '을/를')} 대입하면 ${Y} = ${b} ${MINUS} ${q / k} = ${v}이다.`,
          facts: { value: `${b}-${b}*${q}/${c}`, rule: 'graph-axes' }
        });
      }
      // 축 위에 있지 않은 두 점이 표시된 그래프(두 점은 눈금 선 위에 있다): 식을 세워 그래프 밖의 값을 구한다.
      const [x1, x2, y1, y2, ystep, x3] = d.pick([[3, 9, 3000, 5000, 1000, 15], [3, 9, 3000, 5000, 1000, 18], [2, 6, 3000, 5000, 1000, 12], [4, 8, 3000, 4000, 1000, 20], [2, 8, 2000, 5000, 1000, 14], [2, 6, 2000, 3000, 1000, 16]]);
      const r = Q(y2 - y1, x2 - x1), base = y1 - (y2 - y1) * x1 / (x2 - x1), xmax = x2 + x1, top = base + (y2 - y1) * xmax / (x2 - x1), ymax = Math.ceil(top / ystep) * ystep, v = base + (y2 - y1) * x3 / (x2 - x1);
      return N(`그림은 어느 택배 회사에서 무게가 ${X} kg인 물건을 보내는 요금을 ${Y}원이라 할 때, ${X}와 ${Y} 사이의 관계를 나타낸 그래프이다. 무게가 ${x3} kg인 물건을 보내는 요금은 얼마인가?`, v, { unit: '원',
        figure: gr({ xname: 'x(kg)', yname: 'y(원)', xmax, ymax, xstep: x1, ystep, paths: [{ pts: [[0, base], [xmax, top]] }], marks: [[x1, y1], [x2, y2]], say: `선 위의 두 점에서 내린 점선이 가로축의 ${x1}, ${x2}${tail(x2, '과/와')} 세로축의 ${y1}, ${y2}에 닿는다.` }),
        explain: `그래프가 두 점 ${pt(x1, y1)}, ${ptj(x2, y2, '을/를')} 지나므로 기울기는 ${frac(`${y2} ${MINUS} ${y1}`, `${x2} ${MINUS} ${x1}`)} = ${iq(r)}이다. ${eqT(tm(r, X), lt(BB))}에 ${is(X, x1)}, ${is(Y, y1)}${tail(y1, '을/를')} 대입하면 ${is(BB, base)}이므로 ${eq(r, base)}이다. ${is(X, x3)}일 때 ${is(Y, v)}이다.`,
        facts: { value: `${y1}+(${y2}-${y1})*(${x3}-${x1})/(${x2}-${x1})`, rule: 'graph-points' }
      });
    }, { count: 2 })
  ]);

  // 실력 파일(8-1-5c.js)이 함께 쓰는 도구
  Object.assign(K8, { RATIO, upDown, dotFig, signFig, SIGN_FORMS, signWord, sideWord, partWord, lineClaims, useAns, LINE_SETS });
})(typeof window !== 'undefined' ? window : globalThis);
