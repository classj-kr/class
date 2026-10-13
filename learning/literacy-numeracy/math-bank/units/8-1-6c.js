// 중학교 2학년 1학기 6단원 일차함수와 일차방정식의 관계 — 실력 문항.
// 단원 틀·도구·싣는 기준·뺀 것과 까닭은 8-1-6a.js 의 머리 주석에 있다. 여기서는 그 파일들이 내보낸 도구(B.kit.m816)를 쓴다.
// ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것
//  - ax + by + c = 0 의 기울기는 −a/b, y절편은 −c/b 이다. x의 계수 a 를 그대로 기울기로, 상수항 c 를 그대로 y절편으로 읽는다(y 에 대하여 풀 때 생기는 − 를 놓친다).
//  - 절편은 0을 대입하여 구한다. 계수에 문자가 있으면 절편을 구할 수 없다고 여긴다(ax + 2a = 0 은 a ≠ 0 이면 x = −2 이다).
//  - x = p 의 그래프는 y축에 평행하다(y의 계수가 0이다). 「x = p 이므로 x축에 평행하다」고 말한다. 원점을 지나는 직선은 상수항이 0이다.
//  - 「두 그래프가 x축 위에서 만난다」는 x절편이 같다는 말이다. y절편이 같다고 읽거나, 두 그래프가 같다고 읽는다.
//  - 해가 없으면 두 그래프가 평행하다(기울기만 같다). 해가 무수히 많으면 두 그래프가 일치한다(y절편까지 같다). 기울기만 맞추고 끝낸다.
//
// 실력에 둔 것은 둘뿐이다.
//  ① 뜻을 정확히 대야 풀리는 것: 계수의 부호와 지나는 사분면(hard-signs-quadrant, hard-signs-swap), 원점을 지나는 그래프와 축에 평행한 그래프(hard-origin-swap, hard-axis-coef-sign),
//     축 위에서 만나는 두 그래프(hard-meet-on-axis), 평행에서 일치로(hard-shift-to-coincide), 문자가 든 식의 x절편(hard-xgap-letter).
//  ② 세 단계 넘게 이어야 풀리는 것: 교점을 지나고 다른 일차방정식의 그래프와 평행한 직선(hard-meet-parallel), 그림의 두 직선의 식을 세워 넓이까지(hard-area-from-figure),
//     넓이에서 거꾸로 계수(hard-area-to-coef), 넓이를 이등분하는 직선(hard-bisect), 두 그래프가 만나는 때(hard-two-graphs-meet), 교점으로 수를 구해 x절편 사이의 거리(hard-meet-then-xgap).
// 고르기 문항의 틀린 보기는 저마다 잘못 하나에서 나온다(유형마다 주석에 적었다).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, N, M, NAMES, name } = B.kit;
  const { MINUS, GT, LT, Q, tx, nb, V, nz, pm, ansV, graph, sys } = B.kit.mid;
  const { STD1, STD2, src, spun, X, Y, A, Bv, Cv, K, QUAD, jn, iq, tl, un, Lt, sum, eq0, eqR, gen, std, fn, yint, byCuts, through, onLine, X0, Y0, missing, pt, ptj, lineAns, pick1, pl, intLine, twoThrough, CUTS, cutMeet, cutFigure, cutY, absx } = B.kit.m816;
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: src(ref), make: spun(id, make) }, more || {});

  const ABC = eq0(Lt(A + X), Lt(Bv + Y), Lt(Cv));   // ax + by + c = 0
  // 공용 graph 의 눈금 수·축의 이름(10.5~11.5px)을 12px 로 키운다.
  const graph12 = (o) => graph(o).replace(/font-size:1[01](?:\.5)?px/g, 'font-size:12px');
  const rel = (s) => (s > 0 ? GT : LT), word = (s) => (s > 0 ? '양수' : '음수');
  // 눈금 없는 좌표평면에 직선 하나(기울기의 부호 s1, y절편의 부호 s2. s2 가 0이면 원점을 지난다)
  const plainLine = (s1, s2, mag) => pl({ x: [-4, 4], y: [-4, 4], grid: false, lines: [s2 === 0 ? { a: s1 * mag } : { a: s1 * mag, b: 2 * s2 }], label: `좌표평면: 눈금 없는 그림. 직선이 ${s2 === 0 ? '원점을 지나고 ' : ''}오른쪽 ${s1 > 0 ? '위' : '아래'}로 향${s2 === 0 ? '한다.' : `하고, y축과 원점의 ${s2 > 0 ? '위' : '아래'}쪽에서 만난다.`}` });

  B.addGroup('8-1-6', {
    id: 'hard', title: '실력 문제', standard: STD2,
    types: [
      H('hard-signs-quadrant', '계수의 부호와 그래프가 지나지 않는 사분면', '심22·23', (d, n) => {
        if (n === 0) {
          // ab, bc 의 부호 → 기울기 −a/b, y절편 −c/b 의 부호 → 지나지 않는 사분면.
          // 보기를 고르는 아이: 기울기를 a/b 로 본 아이(− 를 놓침), y절편을 c/b 로 본 아이, 둘 다 놓친 아이 — 넷이 모두 다른 사분면이 된다.
          const sab = pm(d), sbc = pm(d), miss = missing(-sab, -sbc);
          return pick1(d, `세 수 ${A}, ${Bv}, ${Cv}에 대하여 ${nb(`${A}${Bv} ${rel(sab)} 0`)}, ${nb(`${Bv}${Cv} ${rel(sbc)} 0`)}일 때, 일차방정식 ${ABC}의 그래프가 지나지 않는 사분면은?`, QUAD.map((q, i) => [q, i === miss - 1]), {
            fixed: true,
            explain: `${ABC}에서 ${nb(`${Y} = ${MINUS}${frac(A, Bv)}${X} ${MINUS} ${frac(Cv, Bv)}`)}이다. ${nb(`${A}${Bv} ${rel(sab)} 0`)}이므로 ${frac(A, Bv)}는 ${word(sab)}이고 기울기 ${nb(MINUS + frac(A, Bv))}는 ${word(-sab)}이다. ${nb(`${Bv}${Cv} ${rel(sbc)} 0`)}이므로 ${frac(Cv, Bv)}는 ${word(sbc)}이고 ${Y}절편 ${nb(MINUS + frac(Cv, Bv))}는 ${word(-sbc)}이다. 그래프는 오른쪽 ${sab < 0 ? '위' : '아래'}로 향하고 ${Y}축과 원점의 ${sbc < 0 ? '위' : '아래'}쪽에서 만나므로 ${QUAD[miss - 1]}을 지나지 않는다.`,
            facts: { rule: 'signs-to-quadrant' }
          });
        }
        // 지나지 않는 사분면 → 기울기와 y절편의 부호 → 계수의 부호.
        // 보기: 맞는 것, a 의 부호만 틀린 것(기울기를 a/b 로 본 아이), c 의 부호만 틀린 것(y절편을 c/b 로 본 아이), b 의 부호만 틀린 것(둘 다 놓친 아이)
        const miss = d.int(1, 4), sm = miss === 4 || miss === 2 ? 1 : -1, sk = miss === 4 || miss === 3 ? 1 : -1, sab = -sm, sbc = -sk, sb = pm(d), sa = sab * sb, sc = sbc * sb;
        const row = (a, b, c) => [`${nb(`${A} ${rel(a)} 0`)}, ${nb(`${Bv} ${rel(b)} 0`)}, ${nb(`${Cv} ${rel(c)} 0`)}`, a * b === sab && b * c === sbc];
        return pick1(d, `일차방정식 ${ABC}의 그래프가 ${QUAD[miss - 1]}을 지나지 않을 때, 다음 중 옳은 것은? (단, ${nb(`${A}${Bv}${Cv} ≠ 0`)})`, [row(sa, sb, sc), row(-sa, sb, sc), row(sa, sb, -sc), row(sa, -sb, sc)], {
          explain: `${QUAD[miss - 1]}을 지나지 않는 직선은 오른쪽 ${sm > 0 ? '위' : '아래'}로 향하고 ${Y}축과 원점의 ${sk > 0 ? '위' : '아래'}쪽에서 만나므로 기울기는 ${word(sm)}, ${Y}절편은 ${word(sk)}이다. ${ABC}에서 ${nb(`${Y} = ${MINUS}${frac(A, Bv)}${X} ${MINUS} ${frac(Cv, Bv)}`)}이므로 ${nb(MINUS + frac(A, Bv))}는 ${word(sm)}, ${nb(MINUS + frac(Cv, Bv))}는 ${word(sk)}이다. 따라서 ${A}와 ${Bv}의 부호는 서로 ${sab > 0 ? '같고' : '다르고'}, ${Bv}와 ${Cv}의 부호는 서로 ${sbc > 0 ? '같다' : '다르다'}.`,
          facts: { rule: 'quadrant-to-signs' }
        });
      }, { count: 2, standard: STD1 }),
      H('hard-signs-swap', '그래프를 보고 계수를 바꿔 끼운 일차방정식의 그래프 알아보기', '①19 심26', (d) => {
        // 그림에서 기울기 −a/b 의 부호 s1, y절편 −c/b 의 부호 s2 를 읽는다: ab 의 부호는 −s1, bc 의 부호는 −s2, ac 의 부호는 s1·s2.
        // 틀린 보기를 고르는 아이: 그림의 직선이 지나지 않는 사분면을 그대로 고른 아이, 새 식에서도 − 를 놓친 아이.
        const s1 = pm(d), s2 = pm(d), sab = -s1, sbc = -s2, sac = sab * sbc, way = d.int(0, 1);
        // 0: cx + ay + b = 0 (기울기 −c/a, y절편 −b/a) / 1: bx + cy + a = 0 (기울기 −b/c, y절편 −a/c)
        const eq2 = way === 0 ? eq0(Lt(Cv + X), Lt(A + Y), Lt(Bv)) : eq0(Lt(Bv + X), Lt(Cv + Y), Lt(A)), sm = way === 0 ? -sac : -sbc, sk = way === 0 ? -sab : -sac, miss = missing(sm, sk);
        const top = way === 0 ? [Cv, Bv] : [Bv, A], bot = way === 0 ? A : Cv;
        return pick1(d, `일차방정식 ${ABC}의 그래프가 그림과 같을 때, 일차방정식 ${eq2}의 그래프가 지나지 않는 사분면은?`, QUAD.map((q, i) => [q, i === miss - 1]), {
          fixed: true,
          figure: plainLine(s1, s2, d.pick([1, 0.75])),
          explain: `${ABC}에서 ${nb(`${Y} = ${MINUS}${frac(A, Bv)}${X} ${MINUS} ${frac(Cv, Bv)}`)}이다. 그림에서 기울기 ${nb(MINUS + frac(A, Bv))}는 ${word(s1)}, ${Y}절편 ${nb(MINUS + frac(Cv, Bv))}는 ${word(s2)}이므로 ${A}와 ${Bv}의 부호는 서로 ${sab > 0 ? '같고' : '다르고'}, ${Bv}와 ${Cv}의 부호는 서로 ${sbc > 0 ? '같다' : '다르다'}. 따라서 ${A}와 ${Cv}의 부호는 서로 ${sac > 0 ? '같다' : '다르다'}. ${eq2}에서 ${nb(`${Y} = ${MINUS}${frac(top[0], bot)}${X} ${MINUS} ${frac(top[1], bot)}`)}이고, 기울기 ${nb(MINUS + frac(top[0], bot))}는 ${word(sm)}, ${Y}절편 ${nb(MINUS + frac(top[1], bot))}는 ${word(sk)}이므로 그래프는 ${QUAD[miss - 1]}을 지나지 않는다.`
        });
      }, { standard: STD1 }),
      H('hard-origin-swap', '원점을 지나는 그래프에서 계수를 바꿔 끼운 일차방정식의 그래프 알아보기', '심27', (d) => {
        // 원점을 지나므로 c = 0. 그림에서 기울기 −a/b 의 부호 s1 을 읽으면 a/b 의 부호는 −s1 이다. 새 식에서 c 가 든 항이 사라져 x = (수) 또는 y = (수) 꼴이 된다.
        // 틀린 보기를 고르는 아이: 축을 바꿔 말한 아이(x = p 를 x축에 평행하다고 본다), 부호를 놓친 아이, 둘 다인 아이.
        const s1 = pm(d), sr = -s1, way = d.int(0, 3);
        // [새 식, c = 0 을 넣은 식, 정리한 식의 좌변 문자, 우변, 우변의 부호]
        const made = [
          [eq0(Lt(Bv + X, -1), Lt(Cv + Y), Lt(A)), eq0(Lt(Bv + X, -1), Lt(A)), 'x', frac(A, Bv), sr],
          [eq0(Lt(Bv + X), Lt(Cv + Y), Lt(A)), eq0(Lt(Bv + X), Lt(A)), 'x', MINUS + frac(A, Bv), -sr],
          [eq0(Lt(Cv + X), Lt(A + Y), Lt(Bv)), eq0(Lt(A + Y), Lt(Bv)), 'y', MINUS + frac(Bv, A), -sr],
          [eq0(Lt(Cv + X), Lt(A + Y, -1), Lt(Bv)), eq0(Lt(A + Y, -1), Lt(Bv)), 'y', frac(Bv, A), sr]
        ][way], [eq2, cut, letter, right, sv] = made;
        const rows = [['y', 1, `${Y}축에 평행하고 제1사분면과 제4사분면을 지난다.`], ['y', -1, `${Y}축에 평행하고 제2사분면과 제3사분면을 지난다.`], ['x', 1, `${X}축에 평행하고 제1사분면과 제2사분면을 지난다.`], ['x', -1, `${X}축에 평행하고 제3사분면과 제4사분면을 지난다.`]];
        const para = letter === 'x' ? 'y' : 'x';
        return pick1(d, `일차방정식 ${ABC}의 그래프가 그림과 같이 원점을 지날 때, 일차방정식 ${eq2}의 그래프에 대한 설명으로 옳은 것은?`, rows.map((r) => [r[2], r[0] === para && r[1] === sv]), {
          fixed: true,
          figure: plainLine(s1, 0, d.pick([1, 0.75])),
          explain: `그래프가 원점을 지나므로 ${nb(X + ' = 0')}, ${nb(Y + ' = 0')}을 대입하면 ${nb(Cv + ' = 0')}이다. ${eq0(Lt(A + X), Lt(Bv + Y))}에서 ${nb(`${Y} = ${MINUS}${frac(A, Bv)}${X}`)}이고 기울기 ${nb(MINUS + frac(A, Bv))}가 ${word(s1)}이므로 ${frac(A, Bv)}는 ${word(sr)}이다. ${eq2}에 ${nb(Cv + ' = 0')}을 대입하면 ${cut}, 곧 ${nb(`${letter === 'x' ? X : Y} = ${right}`)}이다. 우변이 ${word(sv)}이므로 그래프는 ${para === 'y' ? Y : X}축에 평행하고 ${letter === 'x' ? `${Y}축의 ${sv > 0 ? '오른쪽' : '왼쪽'}` : `${X}축의 ${sv > 0 ? '위쪽' : '아래쪽'}`}에 있는 직선이다.`
        });
      }, { standard: STD1 }),
      H('hard-shift-to-coincide', '해가 없는 연립방정식의 그래프를 평행이동하여 일치시키기', '①58 심38', (d) => {
        // 해가 없다 = 평행(기울기만 같다). 일치하려면 y절편까지 같아야 한다.
        const m = pm(d) * d.int(2, 4), [c1, c2] = d.until(() => [nz(d, -5, 5), nz(d, -6, 6)], ([u, v]) => u !== v), l2 = intLine(m, c2, d.pick([1, 2, 3])), e1 = eq0(Lt(A + X), [-1, Y], [c1, '']);
        return M(`연립방정식 ${sys([e1, gen(l2)])}의 해가 없다. 일차방정식 ${e1}의 그래프를 ${Y}축의 방향으로 ${K}만큼 평행이동하면 일차방정식 ${gen(l2)}의 그래프와 일치할 때, 수 ${A}, ${K}의 값을 각각 구하시오.`, [{ label: `${A} =`, answer: m, signed: true }, { label: `${K} =`, answer: c2 - c1, signed: true }], {
          explain: `${e1}에서 ${nb(`${Y} = ${A}${X} ${c1 > 0 ? '+' : MINUS} ${Math.abs(c1)}`)}, ${gen(l2)}에서 ${fn(m, c2)}이다. 해가 없으므로 두 그래프는 서로 평행하고, 기울기가 같아야 하므로 ${A} = ${iq(m)}이다. ${fn(m, c1)}의 그래프를 ${Y}축의 방향으로 ${K}만큼 평행이동한 그래프가 ${fn(m, c2)}의 그래프와 일치하려면 ${Y}절편이 같아야 하므로 ${nb(`${iq(c1)} + ${K} = ${iq(c2)}`)}에서 ${K} = ${iq(c2 - c1)}이다.`,
          facts: { calc: [[`-${jn(l2.a)}/${jn(l2.b)}`, 0], [`-${jn(l2.c)}/${jn(l2.b)}-${jn(c1)}`, 1]], unseen: un(l2.a, l2.b) }
        });
      }),
      H('hard-xgap-letter', '문자가 든 두 일차방정식의 그래프가 x축과 만나는 두 점 사이의 거리', '①66', (d) => {
        // k1·ax − y + c1·a = 0 의 x절편은 −c1/k1 (a 가 지워진다). 첫째 그래프는 원점의 왼쪽(A), 둘째 그래프는 오른쪽(B)에서 x축과 만난다.
        const [k1, k2] = d.until(() => [d.int(1, 2), d.int(1, 3)], ([u, v]) => u !== v), xa = -d.int(1, 3), xb = d.int(1, 3), c1 = -k1 * xa, c2 = k2 * xb;
        const co = (n) => (n === 1 ? '' : n), e1 = eq0(Lt(co(k1) + A + X), [-1, Y], Lt(co(c1) + A)), e2 = eq0(Lt(co(k2) + A + X), [-1, Y], Lt(co(c2) + A, -1));
        return N(`그림은 두 일차방정식 ${e1}, ${e2}의 그래프이다. 두 그래프가 ${X}축과 만나는 점을 각각 A, B라 할 때, 선분 AB의 길이는? (단, ${A} ${GT} 0)`, xb - xa, {
          figure: pl({ x: [xa - 2, xb + 2], y: [-3, 4], grid: false, lines: [{ a: k1, b: -k1 * xa }, { a: k2, b: -k2 * xb }], points: [{ x: xa, y: 0, name: 'A', side: 'ul' }, { x: xb, y: 0, name: 'B', side: 'dr' }], label: '좌표평면: 눈금 없는 그림. 오른쪽 위로 향하는 두 직선이 x축과 각각 점 A, 점 B에서 만난다. 점 A는 원점의 왼쪽에, 점 B는 원점의 오른쪽에 있다.' }),
          explain: `${X}축 위의 점은 ${Y}좌표가 0이다. ${e1}에 ${nb(Y + ' = 0')}을 대입하면 ${nb(`${co(k1)}${A}${X} + ${co(c1)}${A} = 0`)}이고, ${A} ≠ 0이므로 양변을 ${A}로 나누면 ${X} = ${iq(xa)}이다. 같은 방법으로 ${e2}에서 ${X} = ${iq(xb)}이다. 두 점 A${pt(xa, 0)}, B${pt(xb, 0)} 사이의 거리는 ${nb(`${xb} − (${iq(xa)}) = ${xb - xa}`)}이다.`,
          facts: { value: `${c2}/${k2}+${c1}/${k1}`, unseen: [1] }
        });
      }, { standard: STD1 }),
      H('hard-meet-parallel', '교점을 지나고 다른 일차방정식의 그래프와 평행한 직선의 방정식', '①46 심32', (d) => {
        const v = d.until(() => { const t = twoThrough(d, 12), m = pm(d) * d.int(2, 4); return Object.assign(t, { m, lp: intLine(m, nz(d, -6, 6), d.pick([1, 2, 3])) }); }, (w) => w.y0 - w.m * w.x0 !== 0 && Math.abs(w.y0 - w.m * w.x0) <= 15 && !onLine(w.lp, w.x0, w.y0));
        const { x0, y0, l1, l2, m, lp } = v, k = y0 - m * x0;
        return lineAns(`두 일차방정식 ${std(l1)}, ${std(l2)}의 그래프의 교점을 지나고 일차방정식 ${gen(lp)}의 그래프와 평행한 직선의 방정식은?`, m, k, {
          explain: `연립방정식 ${sys([std(l1), std(l2)])}${tl(l2.c, '을/를')} 풀면 ${X} = ${iq(x0)}, ${Y} = ${iq(y0)}이므로 교점의 좌표는 ${pt(x0, y0)}이다. ${gen(lp)}에서 ${fn(m, yint(lp))}이므로 평행한 직선의 기울기는 ${iq(m)}이다. 직선의 방정식을 ${nb(`${Y} = ${sum([[m, X], Lt(Bv)])}`)}로 놓고 ${X} = ${iq(x0)}, ${Y} = ${iq(y0)}${tl(y0, '을/를')} 대입하면 ${Bv} = ${iq(k)}이다. 따라서 ${fn(m, k)}이다.`,
          facts: { calc: [[`-${jn(lp.a)}/${jn(lp.b)}`, 0], [`(${Y0(l1, l2)})-(-${jn(lp.a)}/${jn(lp.b)})*(${X0(l1, l2)})`, 1]], unseen: un(l1.a, l1.b, l2.a, l2.b, lp.a, lp.b) }
        });
      }),
      H('hard-area-from-figure', '그림의 두 직선의 식을 세워 x축과 둘러싸인 도형의 넓이 구하기', '①62', (d) => {
        const set = d.until(() => d.pick(CUTS), (s) => ((s[2] - s[0]) * cutMeet(s)[1]) % 2 === 0), [p1, q1, p2, q2] = set, [x0, y0] = cutMeet(set), area = (p2 - p1) * y0 / 2;
        return N(`그림에서 두 직선 ㉠, ㉡과 ${X}축으로 둘러싸인 도형의 넓이는?`, area, {
          figure: cutFigure(set, true),
          explain: `직선 ㉠은 두 점 ${pt(p1, 0)}, ${ptj(0, q1, '을/를')} 지나므로 ${fn(Q(-q1, p1), q1)}이고, 직선 ㉡은 두 점 ${pt(p2, 0)}, ${ptj(0, q2, '을/를')} 지나므로 ${fn(Q(-q2, p2), q2)}이다. 두 식을 연립하여 풀면 교점의 좌표는 ${pt(x0, y0)}이다. 둘러싸인 도형은 밑변의 길이가 ${nb(`${iq(p2)} − ${p1 < 0 ? '(' + iq(p1) + ')' : p1} = ${p2 - p1}`)}, 높이가 ${y0}인 삼각형이므로 넓이는 ${frac(1, 2)} × ${p2 - p1} × ${y0} = ${area}이다.`,
          facts: { value: `(${jn(p2)}-${jn(p1)})*(${cutY(set)})/2`, unseen: [2] }
        });
      }),
      H('hard-area-to-coef', '둘러싸인 도형의 넓이에서 일차방정식의 수 구하기', '①64', (d) => {
        // y = ax − k (a < 0), y = mx − k (m > 0): 두 그래프가 y축 위의 점 (0, −k)에서 만난다. x축과 둘러싸인 삼각형의 높이는 k, 밑변은 k/m − k/a 이다.
        const v = d.until(() => { const k = d.pick([4, 6, 8]), m = d.int(1, 4), e = d.int(1, 6); return { k, m, e, area: k * (k / m + k / e) / 2 }; }, (w) => w.k % w.m === 0 && w.k % w.e === 0 && Number.isInteger(w.area) && w.area <= 60);
        const { k, m, e, area } = v, a = -e, xp = k / m, xn = k / a, e1 = eq0(Lt(A + X), [-1, Y], [-k, '']), e2 = eq0([-m, X], [1, Y], [k, '']);
        return ansV(`두 일차방정식 ${e1}, ${e2}의 그래프와 ${X}축으로 둘러싸인 도형의 넓이가 ${area}일 때, 음수 ${A}의 값은?`, Q(a), 'int', {
          explain: `두 일차방정식에 ${nb(X + ' = 0')}을 대입하면 모두 ${Y} = ${iq(-k)}이므로 두 그래프는 점 ${pt(0, -k)}에서 만난다. 둘러싸인 도형은 높이가 ${k}인 삼각형이므로 ${X}축 위의 변의 길이는 ${nb(`${area} × 2 ÷ ${k} = ${2 * area / k}`)}이다. ${e2}의 그래프의 ${X}절편은 ${xp}이고, ${A} ${LT} 0이므로 ${e1}의 그래프의 ${X}절편은 음수이다. 그 ${X}절편은 ${nb(`${xp} − ${2 * area / k} = ${iq(xn)}`)}이므로 ${e1}에 ${X} = ${iq(xn)}, ${nb(Y + ' = 0')}을 대입하면 ${A} = ${iq(a)}이다.`,
          facts: { value: `${k}/(${k}/${m}-2*${area}/${k})`, unseen: [1, 2] }
        });
      }),
      H('hard-bisect', '넓이를 이등분하는 직선', '①65 심49·50', (d, n) => {
        if (n === 0) {
          // 원점을 지나는 직선 y = ax 가 그래프와 두 축으로 둘러싸인 삼각형의 넓이를 이등분한다: 그래프와 만나는 점의 높이가 절반이 된다.
          const [p, q] = d.until(() => [2 * nz(d, -4, 4), 2 * nz(d, -4, 4)], ([u, v]) => v % u !== 0 && Math.abs(u) !== Math.abs(v)), l = byCuts(p, q), a = Q(q, p), half = Math.abs(p * q) / 4;
          return ansV(`일차방정식 ${gen(l)}의 그래프와 ${X}축, ${Y}축으로 둘러싸인 도형의 넓이를 직선 ${nb(`${Y} = ${A}${X}`)}가 이등분할 때, 수 ${A}의 값은?`, a, 'frac', {
            explain: `그래프가 ${X}축, ${Y}축과 만나는 점을 각각 A${pt(p, 0)}, B${pt(0, q)}라 하면 삼각형 AOB의 넓이는 ${frac(1, 2)} × ${Math.abs(p)} × ${Math.abs(q)} = ${2 * half}이다. 직선 ${nb(`${Y} = ${A}${X}`)}가 선분 AB와 만나는 점을 P라 하면 삼각형 AOP의 넓이가 ${half}이어야 한다. 밑변 OA의 길이가 ${Math.abs(p)}이므로 높이는 ${Math.abs(q) / 2}이고, 점 P의 ${Y}좌표는 ${iq(q / 2)}이다. ${gen(l)}에 ${Y} = ${iq(q / 2)}${tl(q / 2, '을/를')} 대입하면 ${X} = ${iq(p / 2)}이므로 P${pt(p / 2, q / 2)}이다. ${nb(`${Y} = ${A}${X}`)}가 이 점을 지나므로 ${A} = ${tx(a)}이다.`,
            facts: { value: `(-${jn(l.c)}/${jn(l.b)})/(-${jn(l.c)}/${jn(l.a)})`, unseen: un(l.a, l.b), rule: 'bisect-origin' }
          });
        }
        // 두 그래프의 교점을 지나는 직선이 두 그래프와 x축으로 둘러싸인 삼각형의 넓이를 이등분한다: 높이가 같으므로 x축 위의 변을 이등분하는 점을 지난다.
        const v = d.until(() => { const mid = nz(d, -3, 3), e = pm(d) * d.int(1, 2), m = pm(d) * d.int(2, 4), h = d.int(2, 4); return { mid, m, x0: mid + e, y0: m * e, p1: mid - h, p2: mid + h }; }, (w) => w.x0 !== w.p1 && w.x0 !== w.p2 && [through(w.p1, 0, w.y0, w.x0 - w.p1), through(w.p2, 0, w.y0, w.x0 - w.p2)].every((l) => Math.abs(l.a) <= 6 && Math.abs(l.b) <= 6 && Math.abs(l.c) <= 24) && Math.abs(w.m * w.mid) <= 15);
        const { mid, m, x0, y0, p1, p2 } = v, l1 = through(p1, 0, y0, x0 - p1), l2 = through(p2, 0, y0, x0 - p2), k = -m * mid;
        const P1 = `(-${jn(l1.c)}/${jn(l1.a)})`, P2 = `(-${jn(l2.c)}/${jn(l2.a)})`, MID = `((${P1}+${P2})/2)`, SL = `((${Y0(l1, l2)})/((${X0(l1, l2)})-${MID}))`;
        return lineAns(`두 일차방정식 ${gen(l1)}, ${gen(l2)}의 그래프의 교점을 지나는 직선이 두 그래프와 ${X}축으로 둘러싸인 도형의 넓이를 이등분할 때, 이 직선의 방정식은?`, m, k, {
          explain: `두 일차방정식을 연립하여 풀면 교점의 좌표는 ${pt(x0, y0)}이고, 두 그래프의 ${X}절편은 각각 ${iq(p1)}, ${iq(p2)}이다. 교점을 지나는 직선이 나눈 두 삼각형은 높이가 같으므로, 넓이가 같으려면 ${X}축 위의 밑변의 길이가 같아야 한다. 직선은 두 점 ${pt(p1, 0)}, ${pt(p2, 0)}의 한가운데 점 ${ptj(mid, 0, '을/를')} 지난다. 두 점 ${pt(x0, y0)}, ${ptj(mid, 0, '을/를')} 지나는 직선의 기울기는 ${iq(m)}이므로 ${fn(m, k)}이다.`,
          facts: { calc: [[SL, 0], [`-${SL}*${MID}`, 1]], unseen: un(l1.a, l1.b, l2.a, l2.b).concat([2]), rule: 'bisect-vertex' }
        });
      }, { count: 2 }),
      H('hard-two-graphs-meet', '두 그래프가 만나는 때 구하기', '①69 심58', (d) => {
        // 그림에는 두 그래프가 만나기 전까지만 그려져 있다. 그래프에서 두 식을 세워 교점을 구한다. s: 세로 눈금 한 칸.
        if (d.bool()) {
          // 물을 빼는 물탱크 A 와 물을 넣는 물탱크 B
          const v = d.until(() => { const s = d.pick([100, 200]), xs = d.int(2, 4), a0 = d.int(4, 6), ua = d.int(1, 3), b0 = d.int(0, 2), ub = d.int(1, 2); return { s, xs, a0, ua, b0, ub, t: (a0 - b0) * xs / (ua + ub) }; }, (w) => Number.isInteger(w.t) && w.t > w.xs && w.a0 - w.ua > w.b0 + w.ub && w.b0 * w.s > 0);
          const { s, xs, a0, ua, b0, ub, t } = v, A0 = s * a0, A1 = s * (a0 - ua), B0 = s * b0, B1 = s * (b0 + ub);
          return N(`물이 ${A0} L 들어 있는 물탱크 A에서는 일정한 속력으로 물을 빼고, 물이 ${B0} L 들어 있는 물탱크 B에는 일정한 속력으로 물을 넣는다. 그림은 물을 빼고 넣기 시작한 지 ${X}분 후에 두 물탱크에 들어 있는 물의 양 ${Y} L를 나타낸 그래프의 일부이다. 두 물탱크에 들어 있는 물의 양이 같아지는 것은 몇 분 후인가?`, t, {
            unit: '분 후',
            figure: graph12({ xname: 'x(분)', yname: 'y(L)', xmax: xs, ymax: A0, xstep: 1, ystep: s, paths: [{ pts: [[0, A0], [xs, A1]], name: 'A' }, { pts: [[0, B0], [xs, B1]], name: 'B' }] }),
            explain: `물탱크 A의 물은 ${xs}분 동안 ${A0 - A1} L 줄었으므로 1분에 ${(A0 - A1) / xs} L씩 줄어들고, ${nb(`${Y} = ${MINUS}${(A0 - A1) / xs}${X} + ${A0}`)}이다. 물탱크 B의 물은 ${xs}분 동안 ${B1 - B0} L 늘었으므로 1분에 ${(B1 - B0) / xs} L씩 늘어나고, ${nb(`${Y} = ${(B1 - B0) / xs}${X} + ${B0}`)}이다. 두 식을 연립하여 풀면 ${X} = ${t}이므로 ${t}분 후에 물의 양이 같아진다.`,
            facts: { value: `(${A0}-${B0})*${xs}/((${B1}-${B0})-(${A1}-${A0}))`, rule: 'meet-tanks' }
          });
        }
        // 앞에서 출발한 사람과 뒤따라가는 사람
        const v = d.until(() => { const s = d.pick([100, 200]), xs = d.int(2, 4), a0 = d.int(1, 3), ua = d.int(1, 2), ub = d.int(2, 4); return { s, xs, a0, ua, ub, t: a0 * xs / (ub - ua) }; }, (w) => w.ub > w.ua && Number.isInteger(w.t) && w.t > w.xs && w.a0 + w.ua > w.ub && w.a0 + w.ua <= 5 && w.s * w.ub / w.xs <= 100);
        const { s, xs, a0, ua, ub, t } = v, A0 = s * a0, A1 = s * (a0 + ua), B1 = s * ub, [n1, n2] = d.shuffle(NAMES).slice(0, 2);
        return N(`${name(n1, '은/는')} 학교에서 ${A0} m 떨어진 곳에서, ${name(n2, '은/는')} 학교에서 동시에 출발하여 같은 길을 따라 같은 쪽으로 각자 일정한 속력으로 걷는다. 그림은 출발한 지 ${X}분 후에 학교에서 두 사람까지의 거리 ${Y} m를 나타낸 그래프의 일부이다. ${name(n2, '이/가')} ${name(n1, '을/를')} 따라잡는 것은 출발한 지 몇 분 후인가?`, t, {
          unit: '분 후',
          figure: graph12({ xname: 'x(분)', yname: 'y(m)', xmax: xs, ymax: A1, xstep: 1, ystep: s, paths: [{ pts: [[0, A0], [xs, A1]], name: n1 }, { pts: [[0, 0], [xs, B1]], name: n2 }] }),
          explain: `${name(n1, '은/는')} ${xs}분 동안 ${A1 - A0} m를 걸었으므로 1분에 ${(A1 - A0) / xs} m씩 걷고, ${nb(`${Y} = ${(A1 - A0) / xs}${X} + ${A0}`)}이다. ${name(n2, '은/는')} ${xs}분 동안 ${B1} m를 걸었으므로 1분에 ${B1 / xs} m씩 걷고, ${nb(`${Y} = ${B1 / xs}${X}`)}이다. 두 식을 연립하여 풀면 ${X} = ${t}이므로 출발한 지 ${t}분 후에 따라잡는다.`,
          facts: { value: `(${A0}-0)*${xs}/((${B1}-0)-(${A1}-${A0}))`, rule: 'meet-walkers' }
        });
      }),
      H('hard-meet-then-xgap', '교점으로 수를 구한 뒤 두 그래프의 x절편 사이의 거리 구하기', '①43 심34', (d) => {
        // ax + b1·y = c1 (a 를 모른다), x + b2·y = b (b 를 모른다). 교점 (x0, y0)으로 a, b 를 구하고 두 x절편 c1/a, b 사이의 거리를 구한다.
        const v = d.until(() => { const x0 = nz(d, -4, 4), y0 = nz(d, -5, 5), a = nz(d, -4, 4), b1 = nz(d, -3, 3), b2 = nz(d, -3, 3); return { x0, y0, a, b1, b2, c1: a * x0 + b1 * y0, b: x0 + b2 * y0 }; }, (w) => w.c1 !== 0 && w.c1 % w.a === 0 && Math.abs(w.c1) <= 15 && Math.abs(w.c1 / w.a - w.b) >= 2 && Math.abs(w.c1 / w.a - w.b) <= 15 && w.a * w.b2 !== w.b1);
        const { x0, y0, a, b1, b2, c1, b } = v, e1 = eqR([Lt(A + X), [b1, Y]], c1), e2 = eqR([[1, X], [b2, Y]], Bv), xp = c1 / a, len = Math.abs(xp - b);
        return N(`두 일차방정식 ${e1}, ${e2}의 그래프의 교점의 좌표가 ${pt(x0, y0)}이다. 두 그래프가 ${X}축과 만나는 점을 각각 P, Q라 할 때, 선분 PQ의 길이는?`, len, {
          explain: `${X} = ${iq(x0)}, ${Y} = ${iq(y0)}${tl(y0, '을/를')} 두 일차방정식에 대입하면 ${A} = ${iq(a)}, ${Bv} = ${iq(b)}이다. ${eqR([[a, X], [b1, Y]], c1)}에 ${nb(Y + ' = 0')}을 대입하면 ${X} = ${iq(xp)}이고, ${eqR([[1, X], [b2, Y]], b)}에 ${nb(Y + ' = 0')}을 대입하면 ${X} = ${iq(b)}이다. 두 점 P${pt(xp, 0)}, Q${pt(b, 0)} 사이의 거리는 ${len}이다.`,
          facts: { value: absx(`${jn(c1)}/((${jn(c1)}-${jn(b1)}*${jn(y0)})/${jn(x0)})-(${jn(x0)}+${jn(b2)}*${jn(y0)})`, xp - b), unseen: un(b1, b2) }
        });
      })
    ]
  });
  // ── 기본 묶음에 덧붙이는 꼴 ──
  // 받으면서 실력에서 기본으로 내린 꼴: 기본에서 하는 일을 다시 묻거나 한 번에 풀리는 것.
  const TB = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: src(ref), make: spun(id, make) }, more || {});
  B.addTypes('8-1-6', 'line', [
    TB('line-meet-on-axis', '다른 그래프와 축 위에서 만나고 한 점을 지나는 직선의 방정식', '①8·32 심16', (d) => {
      // 「x축 위에서 만난다」는 x절편이 같다는 말이다(y축 위에서 만나면 y절편이 같다). 구하는 직선은 기울기가 정수가 되게 짓는다.
      const onX = d.bool(), m = pm(d) * d.int(2, 4), p = pm(d) * d.int(1, 3), k = -m * p;   // 구하는 직선: x절편 p, y절편 k, 기울기 m
      if (onX) {
        const q2 = d.until(() => nz(d, -6, 6), (v) => v !== k && Math.abs(v) !== Math.abs(p)), l = byCuts(p, q2);
        return lineAns(`일차방정식 ${gen(l)}의 그래프와 ${X}축 위에서 만나고 점 ${ptj(0, k, '을/를')} 지나는 직선의 방정식은?`, m, k, {
          explain: `${X}축 위에서 만나는 두 직선은 ${X}절편이 같다. ${gen(l)}에 ${nb(Y + ' = 0')}을 대입하면 ${X} = ${iq(p)}이므로 구하는 직선은 두 점 ${pt(p, 0)}, ${ptj(0, k, '을/를')} 지난다. 기울기는 ${nb(`${frac(`${iq(k)} − 0`, `0 − ${p < 0 ? '(' + iq(p) + ')' : p}`)} = ${iq(m)}`)}이고 ${Y}절편은 ${iq(k)}이므로 ${fn(m, k)}이다.`,
          facts: { calc: [[`${jn(k)}*${jn(l.a)}/${jn(l.c)}`, 0], [jn(k), 1]], unseen: un(l.a), rule: 'on-x-axis' }
        });
      }
      const p1 = d.until(() => nz(d, -6, 6), (v) => v !== p && Math.abs(v) !== Math.abs(k)), l = byCuts(p1, k);
      return lineAns(`일차방정식 ${gen(l)}의 그래프와 ${Y}축 위에서 만나고 점 ${ptj(p, 0, '을/를')} 지나는 직선의 방정식은?`, m, k, {
        explain: `${Y}축 위에서 만나는 두 직선은 ${Y}절편이 같다. ${gen(l)}에 ${nb(X + ' = 0')}을 대입하면 ${Y} = ${iq(k)}이므로 구하는 직선은 두 점 ${pt(0, k)}, ${ptj(p, 0, '을/를')} 지난다. 기울기는 ${nb(`${frac(`0 − ${k < 0 ? '(' + iq(k) + ')' : k}`, `${iq(p)} − 0`)} = ${iq(m)}`)}이고 ${Y}절편은 ${iq(k)}이므로 ${fn(m, k)}이다.`,
        facts: { calc: [[`${jn(l.c)}/(${jn(l.b)}*${jn(p)})`, 0], [`-${jn(l.c)}/${jn(l.b)}`, 1]], unseen: un(l.b, p), rule: 'on-y-axis' }
      });
    }, { standard: STD1 })
  ]);
  B.addTypes('8-1-6', 'axis', [
    TB('axis-coef-sign', '축에 평행한 직선의 그림에서 계수의 조건 알기', '심10', (d) => {
      // 세로선이면 y의 계수 b = 0, 가로선이면 x의 계수 a = 0. 남은 계수의 부호는 직선이 축의 어느 쪽에 있는지로 정한다(x = −c/a).
      // 틀린 보기를 고르는 아이: 0이 되는 계수를 바꿔 고른 아이(x = p 꼴이니 x가 없다고 본다), 부호에서 − 를 놓친 아이.
      const vert = d.bool(), sv = pm(d), c = pm(d) * d.int(1, 6), sLive = -Math.sign(c) * sv, eq = eq0(Lt(A + X), Lt(Bv + Y), [c, '']);
      const row = (kind, s) => [kind === 'a' ? `${nb(`${A} ${rel(s)} 0`)}, ${nb(Bv + ' = 0')}` : `${nb(A + ' = 0')}, ${nb(`${Bv} ${rel(s)} 0`)}`, (kind === 'a') === vert && s === sLive];
      const live = vert ? A : Bv, own = vert ? X : Y;
      return pick1(d, `일차방정식 ${eq}의 그래프가 그림과 같을 때, 다음 중 옳은 것은?`, [row('a', 1), row('a', -1), row('b', 1), row('b', -1)], {
        fixed: true,
        figure: pl({ x: [-3, 3], y: [-3, 3], grid: false, lines: [vert ? { x: 2 * sv } : { a: 0, b: 2 * sv }], label: `좌표평면: 눈금 없는 그림. 직선이 ${vert ? 'y' : 'x'}축에 평행하고 ${vert ? `y축의 ${sv > 0 ? '오른쪽' : '왼쪽'}` : `x축의 ${sv > 0 ? '위쪽' : '아래쪽'}`}에 있다.` }),
        explain: `그래프가 ${vert ? Y : X}축에 평행하므로 직선의 방정식은 ${nb(`${own} = ${V(vert ? 'p' : 'q')}`)} 꼴이다. ${vert ? Y : X}의 계수가 0이어야 하므로 ${nb((vert ? Bv : A) + ' = 0')}이다. ${eq0(Lt(live + own), [c, ''])}에서 ${nb(`${own} = ${c > 0 ? MINUS : ''}${frac(Math.abs(c), live)}`)}이고, 그래프가 ${vert ? `${Y}축의 ${sv > 0 ? '오른쪽' : '왼쪽'}` : `${X}축의 ${sv > 0 ? '위쪽' : '아래쪽'}`}에 있으므로 ${nb(`${c > 0 ? MINUS : ''}${frac(Math.abs(c), live)}`)}는 ${word(sv)}이다. 따라서 ${nb(`${live} ${rel(sLive)} 0`)}이다.`
      });
    }, { standard: STD1 })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
