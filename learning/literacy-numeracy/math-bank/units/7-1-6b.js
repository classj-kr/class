// 중학교 1학년 1학기 6단원 정비례와 반비례 — 뒤쪽 묶음(반비례 관계, 반비례 관계의 그래프, 정비례와 반비례의 그래프, 그래프와 도형의 넓이, 실생활 활용).
// 단원 틀과 도구, 싣는 기준, 뺀 것과 까닭은 7-1-6a.js 에 있다. ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { box, frac, lines, numbers, N, M, C, F } = B.kit;
  const { LAB, MINUS, GT, LT, gcd, Q, qneg, qmul, qdiv, qcmp, fl, mag, tx, nb, tail, V, nz, pm, co, fr, distinct, ansV, claimQ, pointAns, graph } = B.kit.mid;
  const { STD, keep, X, Y, A, XY, TAG6, CM2, jn, iq, signed, eqD, eqI, eqDa, eqIa, boxD, boxI, pt, ptj, quads, grid2, xyTable, REL, why, SIT, storyRows, mini, picks, pairPick, planeT, TICKS, clearGuide } = B.kit.m716;
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: (ref.includes('①') ? '수집본 기본 자료(' : '수집본 심화 자료(') + ref + ')', make: (d, n) => keep(make(d, n)) }, more || {});
  const HALF = frac(1, 2);
  // 반비례 관계식에 쓰는 수의 크기(약수가 넉넉한 수)와 그 약수
  const divisors = (m, lo, hi) => { const out = []; for (let v = lo; v <= hi; v += 1) if (m % v === 0) out.push(v); return out; };
  // 고쳐 쓴 꼴 뒤에 「(으)로」를 붙인다: y = ax 꼴은 x로 끝나고, y = a/x 꼴은 a로 끝난다.
  const asTo = (r) => r.as + (r.end != null ? tail(r.end, '으로/로') : '로');
  // 답이 둘인 활용 문항: 관계식의 수 ㉠과 구하는 양
  const two = (text, a, label, b, unit, o) => M(text, [{ label: LAB[0], answer: a }, { label, answer: b, unit }], o);

  B.addTypes('7-1-6', 'inverse', [
    T('inverse-meaning', '반비례의 뜻: x의 값이 몇 배가 될 때 y의 값', '①28·29', (d) => {
      const x1 = d.int(2, 6), k = d.int(2, 5), x2 = x1 * k;
      return F(`${Y}가 ${X}에 반비례할 때, ${X}의 값이 ${x1}에서 ${x2}${tail(x2, '으로/로')} 변하면 ${Y}의 값은 몇 배가 되는가?`, 1, k, {
        unit: '배', anyForm: true,
        explain: `${Y}가 ${X}에 반비례하면 ${X}의 값이 2배, 3배, 4배, …가 될 때 ${Y}의 값은 ${HALF}배, ${frac(1, 3)}배, ${frac(1, 4)}배, …가 된다. ${X}의 값이 ${x2} ÷ ${x1} = ${k}(배)가 되었으므로 ${Y}의 값은 ${frac(1, k)}배가 된다.`,
        facts: { value: `${x1}/${x2}` }
      });
    }),
    T('inverse-pick-eq', '식을 보고 반비례 관계 찾기', '①29', (d) => {
      const k = () => d.int(2, 9), s = () => pm(d);
      const good = d.pick([REL.i(s() * k()), REL.iProd(s() * k()), REL.iKx(s() * co(d, 2, 1, 5), d.pick([2, 4, 8]))]);
      const bad = d.shuffle([REL.d(Q(s() * k())), REL.dOver(d.int(2, 7), s()), REL.iPlus(d.int(2, 9), s() * d.int(1, 5)), REL.minus(k()), REL.sum(k())]).slice(0, 3);
      const rows = d.shuffle([good].concat(bad));
      return C(`다음 관계식 중 ${Y}가 ${X}에 반비례하는 것은?`, rows.map((r) => r.h), rows.indexOf(good), {
        explain: `${Y}가 ${X}에 반비례하면 관계식은 ${eqIa}(${A} ≠ 0) 꼴로 나타낼 수 있다. ${why(good)} 나머지는 이 꼴로 나타낼 수 없다.`,
        facts: { truth: rows.map((r) => r.kind === 'I'), want: true }
      });
    }),
    T('inverse-count-eq', '여러 꼴의 식에서 반비례 관계의 개수 세기', '①29 심2', (d) => {
      // xy = −3, x = −2/y 처럼 고쳐 써야 y = a/x 꼴이 보이는 식과, x가 커질 때 y가 작아지지만 반비례가 아닌 식(y = 5 − x, x + y = 2)을 섞는다.
      const k = () => d.int(2, 9), s = () => pm(d);
      const goods = d.shuffle([REL.i(s() * k()), REL.iProd(s() * k()), REL.iX(s() * k()), REL.iKx(s() * co(d, 2, 1, 5), d.pick([2, 4]))]).slice(0, d.int(2, 3));
      const bads = d.shuffle([REL.d(Q(s() * k())), REL.minus(k()), REL.sum(k()), REL.dXY(d.pick([-1, 2, 3])), REL.iPlus(d.int(2, 9), s() * d.int(1, 5))]).slice(0, 6 - goods.length);
      const rows = d.shuffle(goods.concat(bads)), flags = rows.map((r) => r.kind === 'I');
      const fixed = rows.map((r, i) => (r.as && r.kind === 'I' ? `${TAG6[i]}은 ${asTo(r)} 고쳐 쓸 수 있다.` : r.as && r.kind === 'D' ? `${TAG6[i]}은 ${asTo(r)} 고쳐 쓸 수 있으므로 정비례 관계이다.` : '')).filter(Boolean).join(' ');
      return N(`다음 중 ${Y}가 ${X}에 반비례하는 것은 모두 몇 개인가?`, goods.length, {
        unit: '개', figure: grid2(rows.map((r) => r.h)),
        explain: `${Y}가 ${X}에 반비례하면 관계식은 ${eqIa}(${A} ≠ 0) 꼴로 나타낼 수 있다. ${fixed} 반비례하는 것은 ${rows.map((r, i) => (flags[i] ? TAG6[i] : '')).filter(Boolean).join(', ')}의 ${goods.length}개이다.`,
        facts: { count: flags }
      });
    }),
    T('inverse-pick-story', '문장을 보고 반비례 관계 찾기', '①30', (d) => {
      const rows = storyRows(d, [SIT.area, SIT.trip, SIT.rope, SIT.chairs, SIT.juice], [[SIT.klass, SIT.peri], [SIT.half, SIT.daily], [SIT.left, SIT.change], [SIT.price, SIT.polygon]]);
      const good = rows.find((r) => r.kind === 'I');
      return C(`다음 중 ${Y}가 ${X}에 반비례하는 것은?`, rows.map((r) => r.say), rows.indexOf(good), {
        explain: `관계식은 차례로 ${rows.map((r) => r.eq).join(', ')}이다. 이 가운데 ${eqIa} 꼴인 것은 ${good.eq}뿐이다. ${X}의 값이 커질 때 ${Y}의 값이 작아진다고 모두 반비례하는 것은 아니다.`,
        facts: { truth: rows.map((r) => r.kind === 'I'), want: true }
      });
    }),
    T('inverse-story-eq', '상황을 식으로 나타내고 반비례하는지 판단하기', '①31', (d, n) => {
      // 첫째는 반비례하는 상황, 둘째는 x가 커질 때 y가 작아지지만 반비례하지 않는 상황(합이 일정한 두 양, 남은 양)이다.
      const s = n === 0 ? d.pick([SIT.area, SIT.trip, SIT.rope, SIT.chairs, SIT.juice])(d) : d.pick([SIT.klass, SIT.peri, SIT.left, SIT.change])(d), miss = n === 0 ? s.miss : s.missI;
      const rows = d.shuffle([[s.eq, true], [s.eq, false], [miss, true], [miss, false]]).map(([eq, says]) => ({ h: `${eq}이고, ${Y}는 ${X}에 ${says ? '반비례한다' : '반비례하지 않는다'}.`, ok: eq === s.eq && says === (s.kind === 'I') }));
      return C(`${s.full} ${X}와 ${Y} 사이의 관계를 바르게 설명한 것은?`, rows.map((r) => r.h), rows.findIndex((r) => r.ok), {
        explain: n === 0 ? `관계식은 ${s.eq}이다. ${eqIa}(${A} ≠ 0) 꼴이므로 ${Y}는 ${X}에 반비례한다.` : `관계식은 ${s.eq}이다. ${X}의 값이 2배가 되어도 ${Y}의 값은 ${HALF}배가 되지 않으므로 ${Y}는 ${X}에 반비례하지 않는다.`,
        facts: { truth: rows.map((r) => r.ok), want: true, rule: 'inverse-story-' + n }
      });
    }, { count: 2 }),
    T('inverse-story-coef', '넓이가 정해진 삼각형의 밑변과 높이 사이의 관계식', '①31', (d) => {
      // 관계식의 수가 문제에 적힌 넓이가 아니라 그 두 배이다. 틀린 식: 넓이를 그대로 쓴 것, 넓이의 반을 쓴 것, 정비례로 본 것.
      const s = 2 * d.int(3, 12), rows = d.shuffle([[eqI(2 * s), true], [eqI(s), false], [eqI(s / 2), false], [eqD(2 * s), false]]);
      return C(`넓이가 ${s} ${CM2}인 삼각형의 밑변의 길이를 ${X} cm, 높이를 ${Y} cm라 할 때, ${X}와 ${Y} 사이의 관계식은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
        explain: `(삼각형의 넓이) = ${HALF} × (밑변의 길이) × (높이)이므로 ${HALF}${XY} = ${s}, 곧 ${XY} = ${2 * s}이다. 따라서 ${eqI(2 * s)}이다.`,
        facts: { truth: rows.map((r) => r[1]), want: true }
      });
    }),
    T('inverse-table-story', '상황을 표와 관계식으로 나타내기', '①32', (d) => {
      const s = d.pick([
        () => { const t = d.pick([12, 18, 20, 24, 30, 36]); return { t, xs: [1].concat(d.shuffle(divisors(t, 2, t - 1)).slice(0, 3).sort((u, v) => u - v)), full: `넓이가 ${t} ${CM2}인 직사각형의 가로의 길이는 ${X} cm, 세로의 길이는 ${Y} cm이다.` }; },
        () => ({ t: 1200, xs: [100, 150, 200, 300], full: `1200자인 글을 1분에 ${X}자씩 치면 모두 치는 데 ${Y}분이 걸린다.` }),
        () => { const t = d.pick([120, 180, 240]); return { t, xs: [2, 3, 4, 6], full: `길이가 ${t} cm인 끈을 ${X}도막으로 똑같이 나누면 한 도막의 길이는 ${Y} cm이다.` }; }
      ])();
      const t = s.t, xs = s.xs, [p, q] = d.shuffle([1, 2, 3]).slice(0, 2).sort((u, v) => u - v);
      const ys = xs.map((x, i) => (i === p ? box(LAB[0]) : i === q ? box(LAB[1]) : t / x));
      return M(`${s.full} 다음 표와 관계식 ${boxI(LAB[2])}에서 ㉠, ㉡, ㉢에 알맞은 수를 구하시오.`, [{ label: LAB[0], answer: t / xs[p] }, { label: LAB[1], answer: t / xs[q] }, { label: LAB[2], answer: t }], {
        figure: xyTable(xs, ys),
        explain: `${X}와 ${Y}의 곱이 ${t}${tail(t, '으로/로')} 일정하므로 관계식은 ${eqI(t)}이다. ㉠은 ${t} ÷ ${xs[p]} = ${t / xs[p]}, ㉡은 ${t} ÷ ${xs[q]} = ${t / xs[q]}이다.`,
        facts: { calc: [[`${t}/${xs[p]}`, 0], [`${t}/${xs[q]}`, 1], [`${t}`, 2]] }
      });
    }),
    T('inverse-table-fill', '반비례한다는 것만으로 표 완성하기', '①33', (d) => {
      const xs = d.pick([[1, 2, 3, 6], [1, 2, 3, 4], [2, 3, 4, 6], [-3, -1, 2, 6], [-6, -2, 1, 3], [-4, -2, 3, 6]]), a = pm(d) * 12 * d.int(1, 3), at = d.int(0, 3), ys = xs.map((x) => a / x);
      const blanks = [0, 1, 2, 3].filter((i) => i !== at);
      return M(`${Y}가 ${X}에 반비례할 때, 표의 ㉠, ㉡, ㉢에 알맞은 수는?`, blanks.map((i, j) => ({ label: LAB[j], answer: ys[i], signed: true })), {
        figure: xyTable(xs, ys.map((y, i) => (i === at ? y : box(LAB[blanks.indexOf(i)])))),
        explain: `${X} = ${iq(xs[at])}일 때 ${Y} = ${iq(ys[at])}이므로 ${X}와 ${Y}의 곱은 항상 ${iq(a)}이고, 관계식은 ${eqI(a)}이다. ${blanks.map((i, j) => `${LAB[j]}은 ${iq(ys[i])}`).join(', ')}이다.`,
        facts: { calc: blanks.map((i, j) => [`${jn(ys[at])}*${jn(xs[at])}/${jn(xs[i])}`, j]) }
      });
    }),
    T('inverse-table-back', '반비례 관계의 표에서 x의 값과 y의 값 거꾸로 구하기', '①34 심6', (d) => {
      // 정비례처럼 같은 배수로 채우면 틀린다. 곱이 일정하다는 것으로 y의 값 하나와 x의 값 하나를 구한다.
      const m = d.pick([12, 18, 20, 24, 30, 36, 40, 60]), a = pm(d) * m, [x1, x2, x3] = d.shuffle(divisors(m, 2, 12)).slice(0, 3).map((v) => pm(d) * v), y1 = a / x1, y2 = a / x2, y3 = a / x3;
      return M(`${Y}가 ${X}에 반비례할 때, 표의 ㉠, ㉡에 알맞은 수는?`, [{ label: LAB[0], answer: y2, signed: true }, { label: LAB[1], answer: x3, signed: true }], {
        figure: xyTable([x1, x2, box(LAB[1])], [y1, box(LAB[0]), y3]),
        explain: `${X} = ${iq(x1)}일 때 ${Y} = ${iq(y1)}이므로 ${X}와 ${Y}의 곱은 항상 ${iq(a)}이고, 관계식은 ${eqI(a)}이다. ${X} = ${iq(x2)}일 때 ${Y} = ${iq(y2)}이므로 ㉠은 ${iq(y2)}이고, ${Y} = ${iq(y3)}일 때 ${X} = ${iq(x3)}이므로 ㉡은 ${iq(x3)}이다.`,
        facts: { calc: [[`${jn(y1)}*${jn(x1)}/${jn(x2)}`, 0], [`${jn(y1)}*${jn(x1)}/${jn(y3)}`, 1]] }
      });
    }),
    T('inverse-table-eq', '표를 보고 관계식 고르기', '①35', (d) => {
      // 틀린 식: 첫 칸만 맞는 정비례 관계식, 둘째 칸의 y의 값을 a로 쓴 것, 부호를 놓친 것.
      const xs = d.pick([[1, 2, 3, 4], [1, 2, 3, 6], [1, 2, 4, 6]]), a = pm(d) * 12 * d.int(1, 2), ys = xs.map((x) => a / x);
      const rows = d.shuffle([[eqI(a), true], [eqD(a), false], [eqI(a / 2), false], [eqI(-a), false]]);
      return C(`두 변수 ${X}, ${Y} 사이의 관계를 나타낸 표가 다음과 같을 때, ${X}와 ${Y} 사이의 관계식은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
        figure: xyTable(xs, ys),
        explain: `${X}의 값이 2배, 3배, …가 될 때 ${Y}의 값은 ${HALF}배, ${frac(1, 3)}배, …가 되므로 ${Y}는 ${X}에 반비례한다. ${X}와 ${Y}의 곱이 항상 ${iq(a)}이므로 관계식은 ${eqI(a)}이다.`,
        facts: { truth: rows.map((r) => r[1]), want: true }
      });
    }),
    T('inverse-eq-from-pair', '한 쌍의 값으로 반비례 관계식 구하기', '①36 심8', (d, n) => {
      const [x0, y0] = d.until(() => [nz(d, -6, 6), nz(d, -9, 9)], ([u, v]) => Math.abs(u) > 1 && Math.abs(v) > 1 && (n === 0 || u * v < 0)), a = x0 * y0;
      const told = `${eqIa}에 ${X} = ${iq(x0)}, ${Y} = ${iq(y0)}${tail(Math.abs(y0), '을/를')} 대입하면 ${iq(y0)} = ${frac(A, iq(x0))}이므로 ${A} = ${iq(a)}이다. 관계식은 ${eqI(a)}이다.`;
      if (n === 0) {
        return ansV(`${Y}가 ${X}에 반비례하고, ${X} = ${iq(x0)}일 때 ${Y} = ${iq(y0)}이다. ${X}와 ${Y} 사이의 관계식을 ${boxI()}로 나타낼 때, ${box()} 안에 알맞은 수는?`, Q(a), 'int', { explain: told, facts: { value: `${jn(x0)}*${jn(y0)}`, rule: 'pair-box' } });
      }
      // 곱이 일정하다는 말로 반비례임을 알린다. 틀린 식: 부호를 놓침, 정비례로 봄, 곱을 구하고 정비례 꼴로 씀.
      const rows = d.shuffle([[eqI(a), true], [eqI(-a), false], [eqD(Q(y0, x0)), false], [eqD(a), false]]);
      return C(`${X}와 ${Y}의 곱 ${XY}의 값이 항상 일정하고, ${X} = ${iq(x0)}일 때 ${Y} = ${iq(y0)}이다. ${X}와 ${Y} 사이의 관계식은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
        explain: `${XY}의 값이 일정하므로 ${Y}는 ${X}에 반비례한다. ${XY} = ${iq(x0)} × ${y0 < 0 ? `(${iq(y0)})` : y0} = ${iq(a)}이므로 관계식은 ${eqI(a)}이다.`,
        facts: { truth: rows.map((r) => r[1]), want: true, rule: 'pair-pick' }
      });
    }, { count: 2 }),
    T('inverse-value-from-pair', '한 쌍의 값을 알 때 다른 x의 값에 대한 y의 값', '①37', (d) => {
      const m = d.pick([12, 18, 20, 24, 30, 36]), a = pm(d) * m, [x0, x1] = d.shuffle(divisors(m, 2, 12)).slice(0, 2).map((v) => pm(d) * v), y0 = a / x0, y1 = a / x1;
      return ansV(`${Y}가 ${X}에 반비례하고, ${X} = ${iq(x0)}일 때 ${Y} = ${iq(y0)}이다. ${X} = ${iq(x1)}일 때 ${Y}의 값은?`, Q(y1), 'int', {
        explain: `${eqIa}에 ${X} = ${iq(x0)}, ${Y} = ${iq(y0)}${tail(Math.abs(y0), '을/를')} 대입하면 ${A} = ${iq(a)}이므로 관계식은 ${eqI(a)}이다. ${X} = ${iq(x1)}일 때 ${Y} = ${iq(y1)}이다.`,
        facts: { value: `${jn(x0)}*${jn(y0)}/${jn(x1)}` }
      });
    }),
    T('inverse-claims', '반비례 관계식에 대한 설명의 참·거짓', '①39', (d) => {
      const m = d.pick([6, 8, 10, 12, 18, 20]), a = pm(d) * m, k = d.pick([2, 3]), [x1, x2, x3] = d.until(() => d.shuffle(divisors(m, 2, m)).slice(0, 3), (list) => list.length === 3), y1 = a / x1, y2 = a / x2;
      const yes = [`${Y}는 ${X}에 반비례한다.`, `${X}의 값이 ${k}배가 되면 ${Y}의 값은 ${frac(1, k)}배가 된다.`, `${X} = ${x1}일 때 ${Y} = ${iq(y1)}이다.`, `${XY}의 값은 항상 일정하다.`, `${Y} = ${iq(y2)}일 때 ${X} = ${x2}이다.`];
      const no = [
        [`${X}의 값이 ${k}배가 되면 ${Y}의 값도 ${k}배가 된다.`, `${X}의 값이 ${k}배가 되면 ${Y}의 값은 ${frac(1, k)}배가 된다.`, yes[1]],
        [`${frac(Y, X)}의 값은 항상 일정하다.`, `일정한 것은 ${XY}의 값이다. ${frac(Y, X)}의 값이 일정한 것은 정비례 관계이다.`, yes[3]],
        [`${Y}는 ${X}에 정비례한다.`, `${eqIa} 꼴이므로 ${Y}는 ${X}에 반비례한다.`, yes[0]],
        [`${X} = ${x3}일 때 ${Y} = ${iq(a * x3)}이다.`, `${X} = ${x3}일 때 ${Y} = ${iq(a / x3)}이다.`]
      ];
      const want = d.bool();
      return claimQ(d, `반비례 관계 ${eqI(a)}에 대한 설명으로 ${want ? '옳은' : '옳지 않은'} 것은?`, yes, no, want);
    })
  ]);

  B.addTypes('7-1-6', 'igraph', [
    T('igraph-pick-graph', '식을 보고 반비례 관계의 그래프 고르기', '①40·41', (d) => {
      // 보기: 바른 그래프, 부호를 놓친 것, 같은 사분면에서 a가 다른 것, 같은 점을 지나는 직선(정비례 관계로 본 것). 그래프마다 지나는 점 하나에 점선을 내렸다.
      const [m, px, m2] = d.pick([[4, 2, 8], [4, 2, 6], [6, 2, 8], [6, 2, 4], [6, 3, 12], [8, 2, 4], [8, 2, 6], [8, 4, 12], [12, 3, 6], [12, 4, 8]]), s = pm(d), a = s * m, py = m / px;
      const cands = [{ curve: a, point: [s * px, py] }, { curve: -a, point: [-s * px, py] }, { curve: s * m2, point: [s * px, m2 / px] }, { line: Q(py, s * px), point: [s * px, py] }];
      const order = d.shuffle([0, 1, 2, 3]), R = Math.max(...cands.map((c) => Math.max(...c.point.map(Math.abs)))) + 1;
      return C(`다음 ㉠~㉣ 가운데 반비례 관계 ${eqI(a)}의 그래프는?`, LAB.slice(0, 4), order.indexOf(0), {
        figure: picks(order.map((j, i) => mini(Object.assign({ name: LAB[i], R }, cands[j])))),
        explain: `반비례 관계의 그래프는 한 쌍의 매끄러운 곡선이다. ${eqI(a)}에서 ${X} = ${iq(s * px)}일 때 ${Y} = ${py}이므로 그래프는 점 ${ptj(s * px, py, '을/를')} 지난다.`,
        facts: { truth: order.map((j) => j === 0), want: true }
      });
    }),
    T('igraph-pick-situation', '양수만 되는 두 양 사이의 반비례 관계를 나타낸 그래프 고르기', '①42', (d) => {
      // 길이는 양수이므로 그래프는 제1사분면의 곡선 한 가닥이다. 보기: 한 쌍의 곡선, 곡선 한 가닥, 원점을 지나는 직선, 원점에서 뻗은 선.
      const s = d.pick([12, 18, 24, 36]), cands = [{ curve: 3, half: true }, { curve: 3 }, { line: 1 }, { line: 1, half: true }], order = d.shuffle([0, 1, 2, 3]);
      return C(`넓이가 ${s} ${CM2}인 직사각형의 가로의 길이를 ${X} cm, 세로의 길이를 ${Y} cm라 할 때, 다음 ㉠~㉣ 가운데 ${X}와 ${Y} 사이의 관계를 나타낸 그래프로 알맞은 것은?`, LAB.slice(0, 4), order.indexOf(0), {
        figure: picks(order.map((j, i) => mini(Object.assign({ name: LAB[i], grid: false }, cands[j])))),
        explain: `${XY} = ${s}이므로 관계식은 ${eqI(s)}이고 ${Y}는 ${X}에 반비례한다. 길이는 양수이므로 ${X} ${GT} 0, ${Y} ${GT} 0이고, 그래프는 제1사분면에만 있는 매끄러운 곡선이다.`,
        facts: { truth: order.map((j) => j === 0), want: true }
      });
    }),
    T('igraph-claims', '식이 주어진 반비례 관계의 그래프에 대한 설명의 참·거짓', '①43 심23', (d) => {
      const m = d.pick([4, 6, 8, 10, 12]), a = pm(d) * m, pos = a > 0, [x1, x2] = d.shuffle(divisors(m, 2, m)).slice(0, 2).map((v) => pm(d) * v), y1 = a / x1, y2 = a / x2;
      const yes = ['한 쌍의 매끄러운 곡선이다.', `점 ${ptj(x1, y1, '을/를')} 지난다.`, `${quads(pos)}을 지난다.`, `${X}축, ${Y}축과 만나지 않는다.`, `${X}의 값이 2배가 되면 ${Y}의 값은 ${HALF}배가 된다.`, `${X} ${GT} 0일 때, ${X}의 값이 증가하면 ${Y}의 값${pos ? '은 감소' : '도 증가'}한다.`];
      const no = [
        ['원점을 지난다.', '반비례 관계의 그래프는 원점을 지나지 않는다.', yes[3]],
        [`점 ${ptj(x2, -y2, '을/를')} 지난다.`, `${X} = ${iq(x2)}일 때 ${Y} = ${iq(y2)}이므로 점 ${ptj(x2, y2, '을/를')} 지난다.`],
        [`${quads(!pos)}을 지난다.`, `${quads(pos)}을 지난다.`, yes[2]],
        [`${X}축과 한 점에서 만난다.`, `${X}축, ${Y}축과 만나지 않는다.`, yes[3]],
        [`${X} ${GT} 0일 때, ${X}의 값이 증가하면 ${Y}의 값${pos ? '도 증가' : '은 감소'}한다.`, `${X} ${GT} 0일 때, ${X}의 값이 증가하면 ${Y}의 값${pos ? '은 감소' : '도 증가'}한다.`, yes[5]],
        ['원점을 지나는 직선이다.', '반비례 관계의 그래프는 한 쌍의 매끄러운 곡선이다.', yes[0]]
      ];
      const want = d.bool();
      return claimQ(d, `반비례 관계 ${eqI(a)}의 그래프에 대한 설명으로 ${want ? '옳은' : '옳지 않은'} 것은?`, yes, no, want);
    }),
    T('igraph-general', '반비례 관계 y = a/x의 그래프의 성질', '①44 심22', (d) => {
      const yes = ['한 쌍의 매끄러운 곡선이다.', `${X}축, ${Y}축과 만나지 않는다.`, `점 ${pt(1, A)}를 지난다.`, `${A} ${GT} 0일 때 제1사분면과 제3사분면을 지난다.`, `${A} ${LT} 0일 때 제2사분면과 제4사분면을 지난다.`, `${A}의 절댓값이 클수록 원점에서 멀리 떨어져 있다.`,
        `${A} ${GT} 0이고 ${X} ${GT} 0일 때, ${X}의 값이 증가하면 ${Y}의 값은 감소한다.`, `${A} ${LT} 0이고 ${X} ${GT} 0일 때, ${X}의 값이 증가하면 ${Y}의 값도 증가한다.`];
      const no = [
        ['원점을 지난다.', '반비례 관계의 그래프는 원점을 지나지 않는다.', yes[1]],
        [`${X}축과 한 점에서 만난다.`, `${X}축, ${Y}축과 만나지 않는다.`, yes[1]],
        [`${Y}축과 한 점에서 만난다.`, `${X}축, ${Y}축과 만나지 않는다.`, yes[1]],
        [`${A} ${LT} 0일 때 제1사분면과 제3사분면을 지난다.`, `${A} ${LT} 0일 때 제2사분면과 제4사분면을 지난다.`, yes[4]],
        [`${A}의 절댓값이 클수록 원점에 가깝다.`, `${A}의 절댓값이 클수록 원점에서 멀리 떨어져 있다.`, yes[5]],
        [`${A} ${LT} 0이고 ${X} ${GT} 0일 때, ${X}의 값이 증가하면 ${Y}의 값은 감소한다.`, `${A} ${LT} 0이고 ${X} ${GT} 0일 때, ${X}의 값이 증가하면 ${Y}의 값도 증가한다.`, yes[7]],
        ['원점을 지나는 직선이다.', '반비례 관계의 그래프는 한 쌍의 매끄러운 곡선이다.', yes[0]]
      ];
      const want = d.bool();
      return claimQ(d, `반비례 관계 ${eqIa}의 그래프에 대한 설명으로 ${want ? '옳은' : '옳지 않은'} 것은? (단, ${A}는 0이 아닌 수이다.)`, yes, no, want);
    }),
    T('igraph-curve-claims', '그림의 곡선에서 관계식을 구해 설명의 참·거짓 가리기', '①45', (d) => {
      const [px, py] = d.pick([[2, 3], [3, 2], [2, 4], [4, 2], [3, 4], [4, 3], [2, 2]]), sx = pm(d), sy = pm(d), x0 = sx * px, y0 = sy * py, a = x0 * y0, pos = a > 0;
      const side = (sy > 0 ? 'u' : 'd') + (sx > 0 ? 'r' : 'l'), other = d.pick([1, 2, 3, 4, 6].filter((v) => a % v === 0 && v !== px)) * pm(d);
      const yes = [`점 ${ptj(-x0, -y0, '을/를')} 지난다.`, `${XY}의 값은 항상 ${iq(a)}${tail(Math.abs(a), '으로/로')} 일정하다.`, `반비례 관계 ${eqI(a)}의 그래프이다.`, `${X} ${GT} 0일 때, ${X}의 값이 증가하면 ${Y}의 값${pos ? '은 감소' : '도 증가'}한다.`, `점 ${ptj(other, a / other, '을/를')} 지난다.`];
      const found = `그래프가 점 A${pt(x0, y0)}${tail(py, '을/를')} 지나므로 ${A} = ${iq(x0)} × ${y0 < 0 ? `(${iq(y0)})` : y0} = ${iq(a)}이다.`;
      const no = [
        [`반비례 관계 ${eqI(-a)}의 그래프이다.`, `관계식은 ${eqI(a)}이다.`, yes[2]],
        [`점 ${ptj(-x0, y0, '을/를')} 지난다.`, `${X} = ${iq(-x0)}일 때 ${Y} = ${iq(-y0)}이므로 점 ${ptj(-x0, -y0, '을/를')} 지난다.`, yes[0]],
        [`${X} ${GT} 0일 때, ${X}의 값이 증가하면 ${Y}의 값${pos ? '도 증가' : '은 감소'}한다.`, `${A} ${pos ? GT : LT} 0이므로 ${X} ${GT} 0일 때, ${X}의 값이 증가하면 ${Y}의 값${pos ? '은 감소' : '도 증가'}한다.`, yes[3]],
        [`${frac(Y, X)}의 값은 항상 일정하다.`, `반비례 관계에서 일정한 것은 ${XY}의 값이다.`, yes[1]]
      ];
      const want = d.bool(), item = claimQ(d, `그림은 반비례 관계 ${eqIa}의 그래프이고, 점 A는 이 그래프 위의 점이다. 이 그래프에 대한 설명으로 ${want ? '옳은' : '옳지 않은'} 것은?`, yes, no, want);
      item.figure = planeT({ x: [-5, 5], y: [-5, 5], ticks: TICKS, curves: [{ a }], points: [{ x: x0, y: y0, name: 'A', side, guide: clearGuide(x0, y0) }] });
      item.explain = found + ' ' + item.explain;
      return item;
    }),
    T('igraph-quadrant', '지나는 사분면으로 반비례 관계 고르기', '①46', (d) => {
      const pos = d.bool(), mags = d.shuffle([2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 18]).slice(0, 4), up = d.shuffle([0, 1, 2, 3]).slice(0, 2);
      const list = mags.map((v, i) => (up.includes(i) ? v : -v)), flags = list.map((v) => (v > 0) === pos);
      return pairPick(d, `다음 반비례 관계 중 그래프가 ${quads(pos)}을 지나는 것을 모두 고른 것은?`, list.map(eqI), flags,
        `반비례 관계 ${eqIa}의 그래프는 ${A} ${GT} 0일 때 제1사분면과 제3사분면을, ${A} ${LT} 0일 때 제2사분면과 제4사분면을 지난다. ${A}의 값이 ${pos ? '양수' : '음수'}인 것은 ${flags.map((f, i) => (f ? LAB[i] : '')).filter(Boolean).join(', ')}이다.`);
    }),
    T('igraph-range', '두 곡선의 그림에서 a의 값의 범위 고르기', '①47', (d) => {
      // 모눈 없이 그린다: 곡선이 있는 사분면에서 부호를, 기준 곡선보다 원점에서 먼지 가까운지에서 절댓값의 크기를 읽는다.
      // 두 곡선의 이름이 서로의 곡선에 닿지 않도록 a의 크기가 세 배 넘게 차이 나는 짝만 쓴다.
      const [m, n] = d.pick([[1, 6], [2, 8], [2, 10], [2, 6], [6, 1], [8, 2], [6, 2], [10, 2]]), s = pm(d), k = s * m, t = s * n, far = n > m;
      const opts = [[`${A} ${GT} ${m}`, 1, true], [`0 ${LT} ${A} ${LT} ${m}`, 1, false], [`${MINUS}${m} ${LT} ${A} ${LT} 0`, -1, false], [`${A} ${LT} ${MINUS}${m}`, -1, true]], at = opts.findIndex((o) => o[1] === s && o[2] === far);
      return C(`그림에서 곡선 ㉠은 반비례 관계 ${eqI(k)}의 그래프이고, 곡선 ㉡은 반비례 관계 ${eqIa}의 그래프이다. 수 ${A}의 값의 범위로 옳은 것은?`, opts.map((o) => nb(o[0])), at, {
        figure: planeT({ x: [-5, 5], y: [-5, 5], grid: false, ticks: 'none', curves: [{ a: k, name: LAB[0] }, { a: t, name: LAB[1] }] }),
        explain: `곡선 ㉡은 ${quads(s > 0)}에 있으므로 ${A} ${s > 0 ? GT : LT} 0이다. 또 곡선 ㉠보다 원점에서 ${far ? '멀리 떨어져' : '가까이'} 있으므로 ${A}의 절댓값은 ${m}보다 ${far ? '크다' : '작다'}. 따라서 ${opts[at][0]}이다.`,
        facts: { truth: opts.map((o, i) => i === at), want: true }
      });
    }),
    T('igraph-point-on', '점이 반비례 관계의 그래프 위에 있는지 가리기', '①48', (d) => {
      const m = d.pick([6, 8, 12, 18, 24]), a = pm(d) * m, want = d.bool(), [d1, d2, d3] = d.shuffle(divisors(m, 1, m)), off = d.pick([4, 8, 9, 16].filter((v) => m % v !== 0));
      // 그래프 위의 점: 정수 좌표 둘과 분수 좌표 하나. 그래프 위에 없는 점: 부호를 놓친 것 둘과 y좌표가 1만큼 다른 것.
      const good = d.shuffle([[Q(d1), Q(a / d1)], [Q(-d2), Q(-a / d2)], [Q(off), Q(a, off)]]), bad = d.shuffle([[Q(d1), Q(-a / d1)], [Q(-d3), Q(a / d3)], [Q(d2), Q(a / d2 + 1)]]);
      const rows = d.shuffle(want ? [good[0]].concat(bad) : good.concat([bad[0]])), hit = (r) => qcmp(qmul(r[0], r[1]), Q(a)) === 0, at = rows.findIndex((r) => hit(r) === want);
      return C(`다음 중 반비례 관계 ${eqI(a)}의 그래프 위의 점${want ? '은' : '이 아닌 것은'}?`, rows.map((r) => pt(r[0], r[1])), at, {
        explain: `${X}좌표와 ${Y}좌표의 곱이 ${iq(a)}이면 그래프 위의 점이다. 점 ${pt(rows[at][0], rows[at][1])}에서 ${X}좌표와 ${Y}좌표의 곱은 ${tx(qmul(rows[at][0], rows[at][1]))}이므로 이 점은 그래프 위의 점${want ? '이다' : '이 아니다'}.`,
        facts: { claimed: rows.map((r) => [`${jn(r[0].p)}*${jn(r[1].p)}`, a * r[0].q * r[1].q]), claimedWant: want }
      });
    }),
    T('igraph-point-fill', '반비례 관계의 그래프가 지나는 점의 빈 좌표 구하기', '①49 심25', (d) => {
      const m = d.pick([6, 8, 12, 18, 20, 24]), a = pm(d) * m, [x1, y2] = d.shuffle(divisors(m, 1, m)).slice(0, 2).map((v) => pm(d) * v), y1 = a / x1, x2 = a / y2;
      return M(`반비례 관계 ${eqI(a)}의 그래프가 두 점 ${pt(x1, LAB[0])}, ${ptj(LAB[1], y2, '을/를')} 지날 때, ㉠, ㉡에 알맞은 수는?`, [{ label: LAB[0], answer: y1, signed: true }, { label: LAB[1], answer: x2, signed: true }], {
        explain: `${eqI(a)}에 ${X} = ${iq(x1)}${tail(Math.abs(x1), '을/를')} 대입하면 ${Y} = ${iq(y1)}이므로 ㉠은 ${iq(y1)}이다. ${Y} = ${iq(y2)}${tail(Math.abs(y2), '을/를')} 대입하면 ${X} = ${iq(x2)}이므로 ㉡은 ${iq(x2)}이다.`,
        facts: { calc: [[`${jn(a)}/${jn(x1)}`, 0], [`${jn(a)}/${jn(y2)}`, 1]] }
      });
    }),
    T('igraph-a-from-point', '그래프가 지나는 한 점으로 y = a/x의 a 구하기', '①50', (d) => {
      const [x0, y0] = d.until(() => [nz(d, -7, 7), nz(d, -9, 9)], ([u, v]) => Math.abs(u) > 1 && Math.abs(v) > 1), a = x0 * y0;
      return ansV(`반비례 관계 ${eqIa}의 그래프가 점 ${ptj(x0, y0, '을/를')} 지날 때, 수 ${A}의 값은?`, Q(a), 'int', {
        explain: `${eqIa}에 ${X} = ${iq(x0)}, ${Y} = ${iq(y0)}${tail(Math.abs(y0), '을/를')} 대입하면 ${iq(y0)} = ${frac(A, iq(x0))}이므로 ${A} = ${iq(x0)} × ${y0 < 0 ? `(${iq(y0)})` : y0} = ${iq(a)}이다.`,
        facts: { value: `${jn(x0)}*${jn(y0)}` }
      });
    }),
    T('igraph-point-on-after', '한 점으로 a를 구한 뒤 그래프 위에 없는 점 찾기', '①51 심26', (d) => {
      // 곱이 a와 부호만 다른 점을 하나 섞는다. 그래프 위의 점에는 분수 좌표인 것도 있다.
      const [px, py] = d.pick([[3, 4], [2, 6], [4, 6], [3, 6], [2, 9], [3, 8]]), sx = pm(d), sy = pm(d), x0 = sx * px, y0 = sy * py, a = x0 * y0, m = px * py, off = d.pick([8, 9, 16].filter((v) => m % v !== 0));
      const good = [[Q(-x0), Q(-y0)], [Q(pm(d)), null], [Q(off), Q(a, off)]], bad = [Q(y0), Q(-x0)];
      good[1][1] = Q(a * good[1][0].p);
      const rows = d.shuffle(good.concat([bad])), at = rows.indexOf(bad);
      return C(`반비례 관계 ${eqIa}의 그래프가 점 ${ptj(x0, y0, '을/를')} 지날 때, 다음 중 이 그래프 위의 점이 아닌 것은?`, rows.map((r) => pt(r[0], r[1])), at, {
        explain: `${A} = ${iq(x0)} × ${y0 < 0 ? `(${iq(y0)})` : y0} = ${iq(a)}이므로 관계식은 ${eqI(a)}이다. 그래프 위의 점은 ${X}좌표와 ${Y}좌표의 곱이 ${iq(a)}이다. 점 ${pt(bad[0], bad[1])}에서는 그 곱이 ${iq(-a)}이므로 이 점은 그래프 위의 점이 아니다.`,
        facts: { claimed: rows.map((r) => [`${jn(r[0].p)}*${jn(r[1].p)}`, a * r[0].q * r[1].q]), claimedWant: false }
      });
    }),
    T('igraph-two-points', '그래프가 지나는 두 점에서 a와 한 점의 좌표 구하기', '①52', (d) => {
      const m = d.pick([6, 8, 12, 18, 20, 24]), a = pm(d) * m, [x0, x1] = d.shuffle(divisors(m, 2, 9)).slice(0, 2).map((v) => pm(d) * v), y0 = a / x0, y1 = a / x1, b = V('b');
      return M(`반비례 관계 ${eqIa}의 그래프가 두 점 ${pt(x0, y0)}, ${pt(x1, b)}를 지날 때, 수 ${A}, ${b}의 값은?`, [{ lead: `${A} =`, answer: a, signed: true }, { lead: `${b} =`, answer: y1, signed: true }], {
        shown: `${A} = ${iq(a)}, ${b} = ${iq(y1)}`,
        explain: `${eqIa}에 ${X} = ${iq(x0)}, ${Y} = ${iq(y0)}${tail(Math.abs(y0), '을/를')} 대입하면 ${A} = ${iq(a)}이므로 관계식은 ${eqI(a)}이다. ${X} = ${iq(x1)}${tail(Math.abs(x1), '을/를')} 대입하면 ${b} = ${iq(y1)}이다.`,
        facts: { calc: [[`${jn(x0)}*${jn(y0)}`, 0], [`${jn(x0)}*${jn(y0)}/${jn(x1)}`, 1]] }
      });
    }),
    T('igraph-eq-from-graph', '그래프를 보고 반비례 관계식 구하기', '①54', (d) => {
      const m = d.pick([4, 6, 8, 12]), a = pm(d) * m, px = m === 12 ? 3 : 2, py = a / px;
      return ansV(`그림은 반비례 관계 ${eqIa}의 그래프이다. 수 ${A}의 값은?`, Q(a), 'int', {
        figure: planeT({ x: [-5, 5], y: [-5, 5], ticks: TICKS, curves: [{ a }] }),
        explain: `그래프가 점 ${ptj(px, py, '을/를')} 지나므로 ${eqIa}에 ${X} = ${px}, ${Y} = ${iq(py)}${tail(Math.abs(py), '을/를')} 대입하면 ${A} = ${px} × ${py < 0 ? `(${iq(py)})` : py} = ${iq(a)}이다.`,
        facts: { value: `${px}*${jn(py)}` }
      });
    })
  ]);

  B.addTypes('7-1-6', 'both', [
    T('both-quadrant-count', '정비례·반비례 관계가 섞인 식에서 지나는 사분면으로 개수 세기', '①56', (d) => {
      const quad = d.int(1, 4), wantPos = quad % 2 === 1;
      const rows = d.until(() => d.shuffle([Q(d.int(2, 6)), fr(d, [2, 3, 5], 2), Q(d.int(2, 6))].map((v) => { const a = signed(pm(d), v); return { h: eqD(a), pos: a.p > 0 }; })
        .concat([d.int(2, 9), d.int(2, 9), d.int(2, 9)].map((v) => { const a = pm(d) * v; return { h: eqI(a), pos: a > 0 }; }))),
      (list) => { const n = list.filter((r) => r.pos === wantPos).length; return n >= 2 && n <= 4 && new Set(list.map((r) => r.h)).size === 6; });
      const flags = rows.map((r) => r.pos === wantPos), n = flags.filter(Boolean).length;
      return N(`다음 중 그래프가 제${quad}사분면을 지나는 것은 모두 몇 개인가?`, n, {
        unit: '개', figure: grid2(rows.map((r) => r.h)),
        explain: `정비례 관계 ${eqDa}의 그래프와 반비례 관계 ${eqIa}의 그래프는 모두 ${A} ${GT} 0일 때 제1사분면과 제3사분면을, ${A} ${LT} 0일 때 제2사분면과 제4사분면을 지난다. 제${quad}사분면을 지나는 것은 ${A}의 값이 ${wantPos ? '양수' : '음수'}인 ${rows.map((r, i) => (flags[i] ? TAG6[i] : '')).filter(Boolean).join(', ')}의 ${n}개이다.`,
        facts: { count: flags }
      });
    }),
    T('both-pick-graph', '직선과 곡선이 섞인 그림에서 식에 맞는 그래프 고르기', '①57', (d) => {
      // 모눈 없이 그린다: 직선인가 곡선인가로 정비례·반비례를, 지나는 사분면으로 부호를 가린다.
      const names = d.shuffle(LAB.slice(0, 4)), p = Q(1, d.pick([2, 3])), q = Q(-1, d.pick([2, 3])), c1 = d.pick([3, 4]), c2 = -d.pick([3, 4]);
      const rels = [{ h: eqD(p), kind: '정비례', line: true, pos: true }, { h: eqD(q), kind: '정비례', line: true, pos: false }, { h: eqI(c1), kind: '반비례', line: false, pos: true }, { h: eqI(c2), kind: '반비례', line: false, pos: false }];
      const at = d.int(0, 3), target = rels[at], shown = d.shuffle(rels);
      return C(`그림의 ㉠~㉣은 아래 네 관계식의 그래프이다. ${target.kind} 관계 ${target.h}의 그래프는?`, LAB.slice(0, 4), LAB.indexOf(names[at]), {
        figure: planeT({ x: [-4, 4], y: [-4, 4], grid: false, ticks: 'none', lines: [{ a: p, name: names[0] }, { a: q, name: names[1] }], curves: [{ a: c1, name: names[2] }, { a: c2, name: names[3] }] }) + numbers(shown.map((r) => r.h)),
        explain: `${target.kind} 관계 ${target.h}의 그래프는 ${target.line ? '원점을 지나는 직선' : '한 쌍의 매끄러운 곡선'}이고, ${quads(target.pos)}을 지난다. 알맞은 것은 ${names[at]}이다.`,
        facts: { truth: LAB.slice(0, 4).map((label) => label === names[at]), want: true }
      });
    }),
    T('both-meet', '두 그래프가 만나는지 지나는 사분면으로 판단하기', '①58', (d) => {
      const baseLine = d.bool(), meet = d.bool(), sb = pm(d), base = baseLine ? eqD(sb * d.int(2, 5)) : eqI(sb * d.int(2, 9));
      const mags = d.shuffle([2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4), same = d.shuffle([0, 1, 2, 3]).slice(0, 2), list = mags.map((v, i) => (same.includes(i) ? sb : -sb) * v), flags = list.map((v) => (v * sb > 0) === meet);
      return pairPick(d, `다음 중 그래프가 ${baseLine ? '정비례' : '반비례'} 관계 ${base}의 그래프와 ${meet ? '만나는' : '만나지 않는'} 것을 모두 고른 것은?`, list.map((v) => (baseLine ? eqI(v) : eqD(v))), flags,
        `${base}의 그래프는 ${quads(sb > 0)}을 지난다. 정비례 관계의 그래프와 반비례 관계의 그래프는 지나는 사분면이 같으면 만나고, 다르면 만나지 않는다. ${quads(meet ? sb > 0 : sb < 0)}을 지나는 것은 ${flags.map((f, i) => (f ? LAB[i] : '')).filter(Boolean).join(', ')}이다.`);
    }),
    T('both-by-conditions', '뜻과 지나는 사분면의 조건에 맞는 관계식 고르기', '심7', (d) => {
      const direct = d.bool(), pos = d.bool(), a = d.int(2, 9), b = d.int(2, 9), rows = d.shuffle([[eqD(a), true, true], [eqD(-a), true, false], [eqI(b), false, true], [eqI(-b), false, false]]);
      const first = direct ? `${X}의 값이 2배, 3배, 4배, …가 되면 ${Y}의 값도 2배, 3배, 4배, …가 된다.` : `${X}의 값이 2배, 3배, 4배, …가 되면 ${Y}의 값은 ${HALF}배, ${frac(1, 3)}배, ${frac(1, 4)}배, …가 된다.`;
      return C(`다음 조건을 모두 만족시키는 ${X}와 ${Y} 사이의 관계식은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1] === direct && r[2] === pos), {
        figure: lines([`㈎ ${first}`, `㈏ 그래프가 ${quads(pos)}을 지난다.`]),
        explain: `㈎에서 ${Y}는 ${X}에 ${direct ? '정비례' : '반비례'}하므로 관계식은 ${direct ? eqDa : eqIa} 꼴이다. ㈏에서 ${A} ${pos ? GT : LT} 0이다. 두 조건에 모두 맞는 것은 ${direct ? eqD(pos ? a : -a) : eqI(pos ? b : -b)}이다.`,
        facts: { truth: rows.map((r) => r[1] === direct && r[2] === pos), want: true }
      });
    }),
    T('both-two-values', '한 그래프에서 구한 값을 다른 관계식에 넣어 좌표 구하기', '심33', (d) => {
      const m = d.pick([6, 8, 12, 18, 20]), a = pm(d) * m, x0 = d.pick(divisors(m, 2, m - 1)) * pm(d), k = a / x0, b = pm(d) * d.int(2, 5), K = V('k');
      return ansV(`반비례 관계 ${eqI(a)}의 그래프가 점 ${pt(x0, K)}를 지날 때, 정비례 관계 ${eqD(b)}의 그래프 위의 점 가운데 ${X}좌표가 ${K}인 점의 ${Y}좌표는?`, Q(b * k), 'int', {
        explain: `${eqI(a)}에 ${X} = ${iq(x0)}${tail(Math.abs(x0), '을/를')} 대입하면 ${K} = ${iq(k)}이다. ${eqD(b)}에 ${X} = ${iq(k)}${tail(Math.abs(k), '을/를')} 대입하면 ${Y} = ${iq(b * k)}이다.`,
        facts: { value: `${jn(b)}*${jn(a)}/${jn(x0)}` }
      });
    })
  ]);

  B.addTypes('7-1-6', 'area', [
    T('area-rect', '반비례 관계의 그래프 위의 점과 두 축으로 만든 직사각형의 넓이', '①61 심36', (d) => {
      // 모눈과 눈금 없이 그린다. 점 P의 좌표를 읽을 수 없으므로 x좌표와 y좌표의 곱이 a라는 것으로 구한다. 점이 제2사분면에 있으면 넓이는 a의 절댓값이다.
      const [px, py] = d.pick([[2, 3], [3, 2], [2, 4], [4, 2], [3, 4], [4, 3], [2, 5], [5, 2], [3, 5], [5, 3]]), left = d.bool(), x = left ? -px : px, a = x * py;
      return N(`그림과 같이 반비례 관계 ${eqI(a)}의 그래프 위의 점 P에서 ${X}축, ${Y}축에 그은 수선이 ${X}축, ${Y}축과 만나는 점을 각각 A, B라 할 때, 직사각형 OAPB의 넓이는? (단, O는 원점이다.)`, px * py, {
        figure: planeT({ x: left ? [-6, 1] : [-1, 6], y: [-1, 6], grid: false, ticks: 'none', curves: [{ a }], poly: [[0, 0], [x, 0], [x, py], [0, py]], points: [{ x, y: py, name: 'P', side: left ? 'ul' : 'ur' }, { x, y: 0, name: 'A', side: left ? 'dl' : 'dr' }, { x: 0, y: py, name: 'B', side: left ? 'ur' : 'ul' }] }),
        explain: `점 P는 ${eqI(a)}의 그래프 위의 점이므로 ${X}좌표와 ${Y}좌표의 곱이 ${iq(a)}이다. 직사각형의 가로의 길이와 세로의 길이의 곱은 그 곱의 절댓값과 같으므로 넓이는 ${px * py}이다.`,
        facts: { value: `${px * py}` }
      });
    }),
    T('area-rect-vertex', '직사각형의 넓이로 반비례 관계의 그래프 위의 꼭짓점의 좌표 구하기', '①62', (d) => {
      // 직사각형이 y축의 왼쪽에 놓이기도 한다(꼭짓점의 x좌표가 음수).
      const ax = d.int(2, 5), by = d.until(() => d.int(2, 6), (v) => v !== ax), s = ax * by, left = d.bool(), x = left ? -ax : ax;
      return pointAns(`그림과 같이 반비례 관계 ${eqIa}의 그래프 위의 점 B와 ${X}축 위의 점 A${pt(x, 0)}, ${Y}축 위의 점 C에 대하여 직사각형 OABC의 넓이가 ${s}일 때, 점 B의 좌표는? (단, O는 원점이다.)`, x, by, {
        figure: planeT({ x: left ? [-6, 1] : [-1, 6], y: [-1, Math.max(by + 1, 6)], grid: false, ticks: 'none', curves: [{ a: x * by }], poly: [[0, 0], [x, 0], [x, by], [0, by]], points: [{ x, y: by, name: 'B', side: left ? 'ul' : 'ur' }, { x, y: 0, name: 'A', side: left ? 'dl' : 'dr' }, { x: 0, y: by, name: 'C', side: left ? 'ur' : 'ul' }] }),
        explain: `점 B의 ${X}좌표는 점 A와 같은 ${iq(x)}이다. 직사각형의 가로의 길이가 ${ax}이고 넓이가 ${s}이므로 세로의 길이는 ${s} ÷ ${ax} = ${by}이다. 점 B는 ${X}축의 위쪽에 있으므로 점 B의 좌표는 ${pt(x, by)}이다.`,
        facts: { calc: [[`${jn(x)}`, 0], [`${s}/${ax}`, 1]] }
      });
    }),
    T('area-tri', '정비례 관계의 그래프 위의 점에서 x축에 그은 수선과 삼각형의 넓이', '①64', (d) => {
      const [a, y0] = d.pick([[Q(2, 3), 4], [Q(1, 2), 3], [Q(2), 4], [Q(3, 2), 3], [Q(3, 4), 3], [Q(1, 2), 2], [Q(4, 3), 4], [Q(2, 3), 2]]), x0 = y0 * a.q / a.p, area = x0 * y0 / 2;
      return N(`그림과 같이 정비례 관계 ${eqD(a)}의 그래프 위의 점 A의 ${Y}좌표가 ${y0}이다. 점 A에서 ${X}축에 그은 수선이 ${X}축과 만나는 점을 B라 할 때, 삼각형 AOB의 넓이는? (단, O는 원점이다.)`, area, {
        figure: planeT({ x: [-1, x0 + 1], y: [-1, y0 + 1], grid: false, ticks: 'none', lines: [{ a }], poly: [[0, 0], [x0, 0], [x0, y0]], points: [{ x: x0, y: y0, name: 'A', side: 'ul' }, { x: x0, y: 0, name: 'B', side: 'dr' }] }),
        explain: `${eqD(a)}에 ${Y} = ${y0}${tail(y0, '을/를')} 대입하면 ${X} = ${x0}이므로 A${pt(x0, y0)}, B${pt(x0, 0)}이다. 삼각형 AOB의 넓이는 ${HALF} × ${x0} × ${y0} = ${area}이다.`,
        facts: { value: `${y0}*${a.q}/${a.p}*${y0}/2`, unseen: [1, 2] }
      });
    })
  ]);

  B.addTypes('7-1-6', 'use', [
    T('use-fill', '물을 일정하게 채우는 상황의 관계식과 가득 차는 시간', '①70', (d) => {
      const [h, k] = d.pick([[1, 4], [1, 5], [2, 5], [2, 8], [3, 12], [3, 15], [2, 10], [3, 20]]), full = 100 * h / k;
      return two(`높이가 ${h} m인 빈 물탱크에 물을 넣으면 수면의 높이가 1분에 ${k} cm씩 일정하게 올라간다. 물을 넣기 시작한 지 ${X}분 후의 수면의 높이를 ${Y} cm라 할 때, 관계식 ${boxD(LAB[0])}의 ㉠에 알맞은 수와 물탱크에 물이 가득 차는 데 걸리는 시간을 구하시오.`, k, '시간', full, '분', {
        explain: `수면의 높이가 1분에 ${k} cm씩 올라가므로 ${eqD(k)}이다. ${h} m = ${100 * h} cm이므로 ${100 * h} = ${k}${X}에서 ${X} = ${full}이다. 가득 차는 데 ${full}분이 걸린다.`,
        facts: { calc: [[`${k}`, 0], [`${h}*100/${k}`, 1]], unseen: [100] }
      });
    }),
    T('use-rate', '한 쌍의 값으로 정비례 관계식을 구해 다른 값 구하기', '①71 심47', (d) => {
      const s = d.pick([
        () => { const d0 = d.pick([5, 10]), a = d.pick([120, 150, 200, 240, 300]), c0 = a * d0, d1 = d.until(() => d.pick([15, 20, 25, 30]), (v) => a * v <= 9000), c1 = a * d1;
          return { a, v: d1, label: '거리', unit: 'km', nums: [c0, d0, c1], text: `어느 택배 회사의 배송 요금은 배송 거리에 정비례한다. ${d0} km 떨어진 곳에 물건을 보내는 요금이 ${c0}원이다. 배송 거리가 ${X} km일 때의 요금을 ${Y}원이라 할 때, 관계식 ${boxD(LAB[0])}의 ㉠에 알맞은 수와 요금이 ${c1}원일 때의 배송 거리를 구하시오.`, told: `${Y} = ${c1}일 때 ${X} = ${c1} ÷ ${a} = ${d1}이므로 배송 거리는 ${d1} km이다.` }; },
        () => { const l0 = d.pick([3, 5, 10]), a = d.pick([7, 12, 14, 15, 21]), d0 = a * l0, l1 = d.pick([20, 25, 30, 35, 40]), d1 = a * l1;
          return { a, v: l1, label: '휘발유의 양', unit: 'L', nums: [d0, l0, d1], text: `휘발유 ${l0} L로 ${d0} km를 달리는 자동차가 있다. 이 자동차가 휘발유 ${X} L로 달리는 거리를 ${Y} km라 할 때, 관계식 ${boxD(LAB[0])}의 ㉠에 알맞은 수와 ${d1} km를 달리는 데 필요한 휘발유의 양을 구하시오.`, told: `${Y} = ${d1}일 때 ${X} = ${d1} ÷ ${a} = ${l1}이므로 필요한 휘발유는 ${l1} L이다.` }; },
        () => { const t0 = d.pick([2, 3]), a = d.pick([60, 80, 90, 120]), d0 = a * t0, t1 = d.until(() => d.int(4, 8), (v) => v !== t0), d1 = a * t1;
          return { a, v: t1, label: '시간', unit: '시간', nums: [d0, t0, d1], text: `일정한 속력으로 달리는 기차가 ${t0}시간 동안 ${d0} km를 달렸다. 이 기차가 ${X}시간 동안 달리는 거리를 ${Y} km라 할 때, 관계식 ${boxD(LAB[0])}의 ㉠에 알맞은 수와 ${d1} km를 달리는 데 걸리는 시간을 구하시오.`, told: `${Y} = ${d1}일 때 ${X} = ${d1} ÷ ${a} = ${t1}이므로 ${t1}시간이 걸린다.` }; }
      ])(), [y0, x0, y1] = s.nums;
      return two(s.text, s.a, s.label, s.v, s.unit, {
        explain: `${Y}는 ${X}에 정비례하므로 ${eqDa}에 ${X} = ${x0}, ${Y} = ${y0}${tail(y0, '을/를')} 대입하면 ${A} = ${s.a}이고, 관계식은 ${eqD(s.a)}이다. ${s.told}`,
        facts: { calc: [[`${y0}/${x0}`, 0], [`${y1}*${x0}/${y0}`, 1]] }
      });
    }),
    T('use-discount', '할인하여 파는 가격의 관계식', '①72', (d) => {
      const r = d.pick([10, 20, 30, 40]), p = d.int(2, 9) * 1000, a = (100 - r) / 100, v = p * (100 - r) / 100;
      return M(`어느 가게에서 모든 물건을 정가의 ${r} %만큼 할인하여 판다. 정가가 ${X}원인 물건의 판매 가격을 ${Y}원이라 할 때, 관계식 ${boxD(LAB[0])}의 ㉠에 알맞은 소수와 정가가 ${p}원인 물건의 판매 가격을 구하시오.`, [{ label: LAB[0], answer: a, decimal: true }, { label: '판매 가격', answer: v, unit: '원' }], {
        explain: `정가의 ${r} %만큼 할인하면 판매 가격은 정가의 ${100 - r} %이므로 ${Y} = ${a}${X}이다. 정가가 ${p}원이면 판매 가격은 ${a} × ${p} = ${v}(원)이다.`,
        facts: { calc: [[`(100-${r})/100`, 0], [`${p}*(100-${r})/100`, 1]], unseen: [100] }
      });
    }),
    T('use-triangle', '밑변이 정해진 삼각형의 높이와 넓이 사이의 관계식', '①73 심50', (d) => {
      const b = 2 * d.int(4, 9), a = b / 2, h = d.int(6, 24), s = a * h;
      return two(`밑변의 길이가 ${b} cm, 높이가 ${X} cm인 삼각형의 넓이를 ${Y} ${CM2}라 할 때, 관계식 ${boxD(LAB[0])}의 ㉠에 알맞은 수와 넓이가 ${s} ${CM2}일 때의 높이를 구하시오.`, a, '높이', h, 'cm', {
        explain: `(삼각형의 넓이) = ${HALF} × (밑변의 길이) × (높이)이므로 ${Y} = ${HALF} × ${b} × ${X}, 곧 ${eqD(a)}이다. ${Y} = ${s}일 때 ${X} = ${s} ÷ ${a} = ${h}이므로 높이는 ${h} cm이다.`,
        facts: { calc: [[`${b}/2`, 0], [`${s}/(${b}/2)`, 1]], unseen: [2] }
      });
    }),
    T('use-graph-eq', '실생활 그래프를 보고 관계식을 구해 그래프 밖의 값 구하기', '①75', (d) => {
      const s = d.pick([
        () => { const a = d.pick([1500, 1600, 1800]); return { a, x0: 2, xmax: 4, q: 5, xn: 'x(L)', yn: 'y(원)', label: '값', unit: '원', lead: `그림은 휘발유 ${X} L의 값을 ${Y}원이라 할 때`, ask: (q) => `휘발유 ${q} L의 값` }; },
        () => { const a = d.pick([6, 8, 12]); return { a, x0: 3, xmax: 5, q: d.pick([10, 15, 20]), xn: 'x(분)', yn: 'y(L)', label: '물의 양', unit: 'L', lead: `그림은 어느 수도꼭지에서 ${X}분 동안 나온 물의 양을 ${Y} L라 할 때`, ask: (q) => `${q}분 동안 나온 물의 양` }; }
      ])(), a = s.a, y0 = a * s.x0;
      return two(`${s.lead}, ${X}와 ${Y} 사이의 관계를 나타낸 그래프이다. 관계식 ${boxD(LAB[0])}의 ㉠에 알맞은 수와 ${s.ask(s.q)}을 구하시오.`, a, s.label, a * s.q, s.unit, {
        figure: graph({ xname: s.xn, yname: s.yn, xmax: s.xmax, ymax: a * s.xmax, xstep: 1, ystep: a, paths: [{ pts: [[0, 0], [s.xmax, a * s.xmax]] }], marks: [[s.x0, y0]], say: `선은 점 (${s.x0}, ${y0})을 지난다.` }),
        explain: `그래프가 원점을 지나는 직선이므로 ${Y}는 ${X}에 정비례한다. 그래프가 점 ${ptj(s.x0, y0, '을/를')} 지나므로 ${A} = ${y0} ÷ ${s.x0} = ${a}이고, 관계식은 ${eqD(a)}이다. ${X} = ${s.q}일 때 ${Y} = ${a * s.q}이다.`,
        facts: { calc: [[`${y0}/${s.x0}`, 0], [`${s.q}*${y0}/${s.x0}`, 1]] }
      });
    }),
    T('use-pages', '전체 양이 정해진 반비례 상황의 관계식', '①77 심55', (d) => {
      const n = d.pick([120, 150, 180, 240, 300]), days = d.pick(divisors(n, 5, 12)), v = n / days;
      return two(`전체 ${n}쪽인 책을 하루에 ${X}쪽씩 읽으면 ${Y}일 만에 다 읽는다고 할 때, 관계식 ${boxI(LAB[0])}의 ㉠에 알맞은 수와 ${days}일 만에 다 읽으려면 하루에 읽어야 하는 쪽수를 구하시오.`, n, '쪽수', v, '쪽', {
        explain: `(하루에 읽는 쪽수) × (읽는 날수) = ${n}이므로 ${XY} = ${n}, 곧 ${eqI(n)}이다. ${Y} = ${days}일 때 ${X} = ${n} ÷ ${days} = ${v}이므로 하루에 ${v}쪽씩 읽어야 한다.`,
        facts: { calc: [[`${n}`, 0], [`${n}/${days}`, 1]] }
      });
    }),
    T('use-share', '곱이 일정한 두 나눔 비교하기', '①78 심56', (d) => {
      const [a, b, c] = d.until(() => [d.int(3, 9), d.int(4, 30), d.int(3, 12)], ([u, v, w]) => u !== w && (u * v) % w === 0 && u * v / w !== v && u * v / w >= 2), v = a * b / c;
      const s = d.pick([
        { text: `공책을 한 명에게 ${a}권씩 주면 ${b}명에게 남김없이 나누어 줄 수 있다. 한 명에게 ${c}권씩 주면 몇 명에게 남김없이 나누어 줄 수 있는가?`, unit: '명', told: `공책은 모두 ${a} × ${b} = ${a * b}(권)이다. 한 명에게 ${c}권씩 주면 ${a * b} ÷ ${c} = ${v}(명)에게 줄 수 있다.` },
        { text: `기계 ${a}대로 ${b}시간이 걸리는 일이 있다. 이 일을 ${c}시간 만에 끝내려면 기계가 몇 대 필요한가? (단, 기계 한 대가 한 시간에 하는 일의 양은 모두 같다.)`, unit: '대', told: `기계 한 대가 한 시간에 하는 일의 양을 1이라 하면 전체 일의 양은 ${a} × ${b} = ${a * b}이다. ${c}시간 만에 끝내려면 ${a * b} ÷ ${c} = ${v}(대)가 필요하다.` },
        { text: `빈 욕조에 1분에 ${a} L씩 물이 나오도록 수도를 틀면 물을 가득 채우는 데 ${b}분이 걸린다. 1분에 ${c} L씩 물이 나오도록 수도를 틀면 물을 가득 채우는 데 몇 분이 걸리는가?`, unit: '분', told: `욕조에 가득 찬 물의 양은 ${a} × ${b} = ${a * b}(L)이다. 1분에 ${c} L씩 넣으면 ${a * b} ÷ ${c} = ${v}(분)이 걸린다.` }
      ]);
      return N(s.text, v, { unit: s.unit, explain: `두 양의 곱이 일정하므로 한 양은 다른 양에 반비례한다. ${s.told}`, facts: { value: `${a}*${b}/${c}` } });
    }),
    T('use-gear', '맞물린 톱니바퀴의 톱니 수와 회전수 사이의 관계식', '①79 심58', (d) => {
      const n = d.pick([12, 15, 18, 24]), k = d.int(2, 6), t = n * k, m = d.pick(divisors(t, 6, 40).filter((v) => v !== n)), v = t / m;
      return two(`톱니가 ${n}개인 톱니바퀴 A와 톱니가 ${X}개인 톱니바퀴 B가 서로 맞물려 돌고 있다. A가 ${k}번 회전하는 동안 B는 ${Y}번 회전한다고 할 때, 관계식 ${boxI(LAB[0])}의 ㉠에 알맞은 수와 B의 톱니가 ${m}개일 때 B가 회전하는 횟수를 구하시오.`, t, '횟수', v, '번', {
        explain: `두 톱니바퀴에서 맞물려 돌아간 톱니의 수는 서로 같으므로 ${n} × ${k} = ${X} × ${Y}, 곧 ${eqI(t)}이다. ${X} = ${m}일 때 ${Y} = ${t} ÷ ${m} = ${v}이므로 B는 ${v}번 회전한다.`,
        facts: { calc: [[`${n}*${k}`, 0], [`${n}*${k}/${m}`, 1]] }
      });
    }),
    T('use-lever', '지렛대가 수평을 이루는 무게와 거리 사이의 관계식', '①80 심59', (d) => {
      const [d0, w0] = d.pick([[2, 6], [3, 8], [2, 12], [4, 6], [3, 10], [2, 15], [4, 9]]), t = d0 * w0, d1 = d.pick(divisors(t, 2, 12).filter((v) => v !== d0)), v = t / d1;
      return two(`지렛대가 수평을 이룰 때, 받침점의 양쪽에서 (물체의 무게) × (받침점에서 물체까지의 거리)의 값은 서로 같다. 받침점에서 ${d0} m 떨어진 곳에 무게가 ${w0} kg인 물체가 놓여 있다. 반대쪽으로 받침점에서 ${X} m 떨어진 곳에 무게가 ${Y} kg인 물체를 놓아 지렛대가 수평을 이루게 할 때, 관계식 ${boxI(LAB[0])}의 ㉠에 알맞은 수와 받침점에서 ${d1} m 떨어진 곳에 놓아야 하는 물체의 무게를 구하시오.`, t, '무게', v, 'kg', {
        explain: `${X} × ${Y} = ${d0} × ${w0} = ${t}이므로 ${eqI(t)}이다. ${X} = ${d1}일 때 ${Y} = ${t} ÷ ${d1} = ${v}이므로 물체의 무게는 ${v} kg이다.`,
        facts: { calc: [[`${d0}*${w0}`, 0], [`${d0}*${w0}/${d1}`, 1]] }
      });
    }),
    T('use-speed', '같은 거리를 가는 속력과 걸리는 시간 사이의 관계식', '심57', (d) => {
      const [v0, t0, v1] = d.pick([[40, 3, 60], [40, 3, 30], [60, 2, 40], [60, 2, 30], [60, 3, 90], [60, 3, 45], [80, 3, 60], [80, 3, 120], [90, 2, 60], [90, 2, 45]]), t = v0 * t0, t1 = t / v1;
      return two(`집에서 할머니 댁까지 자동차를 타고 시속 ${v0} km로 가면 ${t0}시간이 걸린다. 같은 길을 시속 ${X} km로 가면 ${Y}시간이 걸린다고 할 때, 관계식 ${boxI(LAB[0])}의 ㉠에 알맞은 수와 시속 ${v1} km로 갈 때 걸리는 시간을 구하시오.`, t, '시간', t1, '시간', {
        explain: `집에서 할머니 댁까지의 거리는 ${v0} × ${t0} = ${t}(km)이다. (속력) × (시간) = (거리)이므로 ${XY} = ${t}, 곧 ${eqI(t)}이다. ${X} = ${v1}일 때 ${Y} = ${t} ÷ ${v1} = ${t1}이므로 ${t1}시간이 걸린다.`,
        facts: { calc: [[`${v0}*${t0}`, 0], [`${v0}*${t0}/${v1}`, 1]] }
      });
    }),
    T('use-minute-hand', '분침이 회전한 각도의 관계식', '심48', (d) => {
      const m = d.pick([12, 15, 20, 25, 35, 40]);
      return two(`시계의 분침이 ${X}분 동안 회전한 각도를 ${Y}°라 할 때, 관계식 ${boxD(LAB[0])}의 ㉠에 알맞은 수와 분침이 ${m}분 동안 회전한 각도를 구하시오.`, 6, '각도', 6 * m, '°', {
        explain: `분침은 60분 동안 360°를 회전하므로 1분 동안 360 ÷ 60 = 6(°)씩 회전한다. 관계식은 ${eqD(6)}이고, ${m}분 동안 회전한 각도는 6 × ${m} = ${6 * m}(°)이다.`,
        facts: { calc: [['360/60', 0], [`${m}*360/60`, 1]], unseen: [360, 60] }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
