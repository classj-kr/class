// 고등학교 1학년 공통수학1 Ⅳ-1 행렬과 그 연산 — 뒤쪽 묶음(행렬의 곱셈, 단위행렬·거듭제곱과 섞인 계산, 곱셈이 낀 등식, 행렬의 곱셈의 활용).
// 단원 틀·도구와 싣는 기준·뺀 것은 10-1-8a.js 머리 주석에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번(번호가 ①46에서 이어진다).
// 곱셈은 교육과정대로 행과 열의 수가 각각 2 이하인 행렬끼리만 한다(1×2, 2×1, 2×2). 곱이 정의되는지를 가리는 문항도 그 크기의 행렬만 쓴다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, frac, lines, table, N, M, C, inline } = B.kit;
  const { MINUS, Q, nb, tail, V, sup, nz, poly, ansV, gcd } = B.kit.mid;
  const K = B.kit.m1018;
  const { S2, UNIT, T, sn, pn, jn, nj, range, nzs, cf, pj, Vj, SQ, ent2, mat, matSlots, nm, show, rowsOf, madd, msub, msc, mmul, same, EYE, maxAbs, cAdd, cMul, cOf, rm, matQ, vals, eqL, num1, pickOne, UNIT_E, UNIT_O, WORDS, code, wordMat, letterTable } = K;
  const MV = (a, b) => mat(a) + mat(b);                  // 곱 AB 의 꼴로 붙여 적은 두 행렬
  const ord = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ'];

  // ── 행렬의 곱셈 ──
  const SHAPE_CAND = [['A', 'A'], ['B', 'B'], ['C', 'C'], ['A', 'B'], ['B', 'A'], ['A', 'C'], ['C', 'A'], ['B', 'C'], ['C', 'B']];
  const prodLab = ([x, y]) => (x === y ? V(x) + sup(2) : V(x) + V(y));
  const mulTypes = [
    T('mul-defined', '곱이 정의되는가', '①32', (d, n) => {
      const SH = d.shuffle([[2, 2], [2, 1], [1, 2]]), shape = { A: SH[0], B: SH[1], C: SH[2] };
      const ok = ([x, y]) => shape[x][1] === shape[y][0];
      const intro = `행렬 ${Vj('A', '이/가')} ${shape.A[0]}×${shape.A[1]} 행렬, 행렬 ${Vj('B', '이/가')} ${shape.B[0]}×${shape.B[1]} 행렬, 행렬 ${Vj('C', '이/가')} ${shape.C[0]}×${shape.C[1]} 행렬일 때,`;
      const why = (p) => `${prodLab(p)}${ok(p) ? '' : ''}`;
      if (n === 0) {
        const good = d.shuffle(SHAPE_CAND.filter(ok)).slice(0, 4), bad = d.pick(SHAPE_CAND.filter((p) => !ok(p)));
        return pickOne(d, `${intro} 다음 중 행렬의 곱을 계산할 수 없는 것은?`, good.map((p) => [prodLab(p), false]).concat([[prodLab(bad), true]]), {
          explain: `두 행렬의 곱은 앞 행렬의 열의 개수와 뒤 행렬의 행의 개수가 같을 때만 계산할 수 있다. ${why(bad)}에서 ${Vj(bad[0], '의')} 열의 개수는 ${shape[bad[0]][1]}, ${Vj(bad[1], '의')} 행의 개수는 ${shape[bad[1]][0]}이므로 계산할 수 없다.`
        });
      }
      const list = d.until(() => d.shuffle(SHAPE_CAND).slice(0, 5), (l) => { const c = l.filter(ok).length; return c >= 2 && c <= 4; });
      const cnt = list.filter(ok).length;
      return N(`${intro} 다음 중 행렬의 곱을 계산할 수 있는 것의 개수는?`, cnt, {
        figure: show(list.map((p, i) => `${ord[i]}. ${prodLab(p)}`).join('&emsp;')),
        explain: `앞 행렬의 열의 개수와 뒤 행렬의 행의 개수가 같은 것은 ${list.filter(ok).map(prodLab).join(', ')}이므로 ${cnt}개이다.`, facts: { check: { shape, list, count: cnt } }
      });
    }, { count: 2 }),
    T('mul-row-col', '행 하나와 열 하나의 곱', '①35', (d) => {
      const A = rm(d, 1, 2, -9, 9), Bm = rm(d, 2, 1, -9, 9), Rm = mmul(A, Bm);
      return matQ('다음을 계산하시오.', null, Rm, {
        figure: show(MV(A, Bm)), calc: cMul(A, Bm), rule: 'mul-1x2-2x1',
        explain: `제1행의 성분과 제1열의 성분을 차례로 곱하여 더하면 ${nb(`${sn(A[0][0])} × ${pn(Bm[0][0])} + ${pn(A[0][1])} × ${pn(Bm[1][0])}`)} = ${nb(`${sn(Rm[0][0])}`)}이므로 ${mat(Rm)}이다. 1×2 행렬과 2×1 행렬의 곱은 1×1 행렬이다.`
      });
    }),
    T('mul-col-row', '열 하나와 행 하나의 곱', '①36', (d) => {
      const A = rm(d, 2, 1, -9, 9), Bm = rm(d, 1, 2, -9, 9), Rm = mmul(A, Bm);
      return matQ('다음을 계산하시오.', null, Rm, {
        figure: show(MV(A, Bm)), calc: cMul(A, Bm), rule: 'mul-2x1-1x2',
        explain: `2×1 행렬과 1×2 행렬의 곱은 2×2 행렬이다. (${V('i')}, ${V('j')}) 성분은 앞 행렬의 제${V('i')}행과 뒤 행렬의 제${V('j')}열의 곱이므로 ${mat(A.map((r) => Bm[0].map((b) => nb(`${sn(r[0])} × ${pn(b)}`))))} = ${mat(Rm)}이다.`
      });
    }),
    T('mul-mat-vec', '2×2 행렬과 행 하나·열 하나의 곱', '①37', (d, n) => {
      if (n === 0) {
        const A = rm(d, 1, 2, -6, 6), Bm = rm(d, 2, 2, -6, 6), Rm = mmul(A, Bm);
        return matQ('다음을 계산하시오.', null, Rm, {
          figure: show(MV(A, Bm)), calc: cMul(A, Bm), rule: 'mul-1x2-2x2',
          explain: `1×2 행렬과 2×2 행렬의 곱은 1×2 행렬이다. (1, 1) 성분은 ${nb(`${sn(A[0][0])} × ${pn(Bm[0][0])} + ${pn(A[0][1])} × ${pn(Bm[1][0])}`)} = ${sn(Rm[0][0])}, (1, 2) 성분은 ${nb(`${sn(A[0][0])} × ${pn(Bm[0][1])} + ${pn(A[0][1])} × ${pn(Bm[1][1])}`)} = ${sn(Rm[0][1])}이므로 ${mat(Rm)}이다.`
        });
      }
      const A = rm(d, 2, 2, -6, 6), Bm = rm(d, 2, 1, -6, 6), Rm = mmul(A, Bm);
      return matQ('다음을 계산하시오.', null, Rm, {
        figure: show(MV(A, Bm)), calc: cMul(A, Bm), rule: 'mul-2x2-2x1',
        explain: `2×2 행렬과 2×1 행렬의 곱은 2×1 행렬이다. ${mat([[nb(`${sn(A[0][0])} × ${pn(Bm[0][0])} + ${pn(A[0][1])} × ${pn(Bm[1][0])}`)], [nb(`${sn(A[1][0])} × ${pn(Bm[0][0])} + ${pn(A[1][1])} × ${pn(Bm[1][0])}`)]])} = ${mat(Rm)}이다.`
      });
    }, { count: 2 }),
    T('mul-2x2', '2×2 행렬끼리의 곱', '①38', (d) => {
      const [A, Bm] = d.until(() => [rm(d, 2, 2, -5, 5), rm(d, 2, 2, -5, 5)], ([X, Y]) => !same(mmul(X, Y), mmul(Y, X)));
      const Rm = mmul(A, Bm);
      return matQ(`두 행렬 ${V('A')}, ${Vj('B', '에')} 대하여 ${V('A')}${Vj('B', '을/를')} 구하시오.`, V('A') + V('B'), Rm, {
        figure: show(nm('A', A), nm('B', Bm)), calc: cMul(A, Bm),
        explain: `${V('A')}${Vj('B', '의')} (${V('i')}, ${V('j')}) 성분은 ${Vj('A', '의')} 제${V('i')}행과 ${Vj('B', '의')} 제${V('j')}열의 성분을 차례로 곱하여 더한 것이다. 이를테면 (1, 1) 성분은 ${nb(`${sn(A[0][0])} × ${pn(Bm[0][0])} + ${pn(A[0][1])} × ${pn(Bm[1][0])}`)} = ${nb(`${sn(Rm[0][0])}`)}이다. ${V('A')}${V('B')} = ${mat(Rm)}이다.`
      });
    }),
    T('mul-steps', '곱의 계산 과정의 빈칸', '①39', (d) => {
      const A = rm(d, 2, 2, -5, 5), Bm = rm(d, 2, 2, -5, 5), Rm = mmul(A, Bm), b = (t) => `<span class="mb-box">${t}</span>`;
      const mid = [[nb(`${pn(A[0][0])} × ${b('㉠')} + ${pn(A[0][1])} × ${pn(Bm[1][0])}`), Rm[0][1]], [nb(`${b('㉡')} × ${pn(Bm[0][0])} + ${pn(A[1][1])} × ${b('㉢')}`), b('㉣')]];
      return vals('다음은 두 행렬의 곱을 계산하는 과정이다. ㉠~㉣에 알맞은 수는?', [['㉠', Bm[0][0], jn(Bm[0][0])], ['㉡', A[1][0], jn(A[1][0])], ['㉢', Bm[1][0], jn(Bm[1][0])], ['㉣', Rm[1][1], `${jn(A[1][0])}*${jn(Bm[0][1])}+${jn(A[1][1])}*${jn(Bm[1][1])}`]], {
        figure: rowsOf([MV(A, Bm), `= <span style="font-size:0.9em">${mat(mid)}</span>`]),
        explain: `(${V('i')}, ${V('j')}) 성분은 앞 행렬의 제${V('i')}행과 뒤 행렬의 제${V('j')}열을 차례로 곱하여 더한 것이다. ㉠ = ${sn(Bm[0][0])}, ㉡ = ${sn(A[1][0])}, ㉢ = ${sn(Bm[1][0])}이고 ㉣ = ${nb(`${sn(A[1][0])} × ${pn(Bm[0][1])} + ${pn(A[1][1])} × ${pn(Bm[1][1])}`)} = ${sn(Rm[1][1])}이다.`
      });
    }),
    T('mul-entry', '곱의 한 성분', '①40', (d, n) => {
      if (n === 0) {
        // AB 의 (i, j) 성분이 v 일 때 B 의 미지수 x
        const i = d.int(1, 2), j = d.int(1, 2), k = d.int(1, 2), x = nz(d, -6, 6);
        const A = rm(d, 2, 2, -6, 6), Bm = rm(d, 2, 2, -6, 6); Bm[k - 1][j - 1] = x;
        const v = A[i - 1][0] * Bm[0][j - 1] + A[i - 1][1] * Bm[1][j - 1], o = 3 - k;
        const Bs = Bm.map((r, a) => r.map((t, c) => (a === k - 1 && c === j - 1 ? V('x') : t)));
        return num1(`두 행렬 ${V('A')}, ${Vj('B', '에')} 대하여 행렬 ${V('A')}${Vj('B', '의')} (${i}, ${j}) 성분이 ${sn(v)}일 때, 실수 ${Vj('x', '의')} 값은?`, x, {
          figure: show(nm('A', A), nm('B', Bs)), calc: `(${jn(v)}-${jn(A[i - 1][o - 1])}*${jn(Bm[o - 1][j - 1])})/${jn(A[i - 1][k - 1])}`, rule: 'entry-x',
          explain: `(${i}, ${j}) 성분은 ${Vj('A', '의')} 제${i}행과 ${Vj('B', '의')} 제${j}열로만 셈한다. ${nb(`${k === 1 ? `${sn(A[i - 1][0])} × ${V('x')} + ${pn(A[i - 1][1])} × ${pn(Bm[1][j - 1])}` : `${sn(A[i - 1][0])} × ${pn(Bm[0][j - 1])} + ${pn(A[i - 1][1])} × ${V('x')}`} = ${sn(v)}`)}이므로 ${V('x')} = ${sn(x)}이다.`
        });
      }
      // pA + B + rX = A − qB + (r + 1)X 에서 X = (p − 1)A + (1 + q)B, X² 의 (2, 1) 성분
      const [p, q, r] = [d.int(2, 3), d.int(1, 2), d.int(1, 2)];
      const [A, Bm] = d.until(() => [rm(d, 2, 2, -3, 3), rm(d, 2, 2, -3, 3)], ([X, Y]) => { const Z = madd(msc(p - 1, X), msc(1 + q, Y)); return maxAbs(Z) <= 9 && Z[1][0] !== 0 && mmul(Z, Z)[1][0] !== 0; });
      const Xm = madd(msc(p - 1, A), msc(1 + q, Bm)), v = mmul(Xm, Xm)[1][0];
      const xs = (a, c) => `((${p}-1)*${jn(A[a][c])}+(1+${q})*${jn(Bm[a][c])})`;
      const eq = `${p}${V('A')} + ${V('B')} + ${cf(r, V('X'))} = ${V('A')} ${MINUS} ${cf(q, V('B'))} + ${r + 1}${V('X')}`;
      return num1(`두 행렬 ${V('A')}, ${Vj('B', '에')} 대하여 행렬 ${Vj('X', '이/가')} 등식 ${nb(eq)}${pj('X', '을/를')} 만족시킬 때, 행렬 ${V('X')}${sup(2)}의 (2, 1) 성분은?`, v, {
        figure: show(nm('A', A), nm('B', Bm)), calc: `${xs(1, 0)}*${xs(0, 0)}+${xs(1, 1)}*${xs(1, 0)}`, unseen: [1], rule: 'entry-x2',
        explain: `등식을 정리하면 ${nb(`${V('X')}`)} = ${nb(`${poly([[p - 1, V('A')], [1 + q, V('B')]])}`)} = ${mat(Xm)}이다. ${V('X')}${sup(2)}의 (2, 1) 성분은 ${Vj('X', '의')} 제2행과 제1열로 셈하여 ${nb(`${pn(Xm[1][0])} × ${pn(Xm[0][0])} + ${pn(Xm[1][1])} × ${pn(Xm[1][0])}`)} = ${nb(`${sn(v)}`)}이다.`
      });
    }, { count: 2 })
  ];

  // ── 단위행렬·거듭제곱과 섞인 계산 ──
  const Ee = V('E');
  const powTypes = [
    T('pow-calc', '정사각행렬의 거듭제곱', '①41', (d, n) => {
      const A = d.until(() => rm(d, 2, 2, -3, 3, true), (X) => X.flat().filter((v) => v !== 0).length >= 3 && maxAbs(mmul(mmul(X, X), X)) <= 60);
      const A2 = mmul(A, A);
      if (n === 0) {
        return matQ(`행렬 ${Vj('A', '에')} 대하여 ${V('A')}${sup(2)}${SQ('을/를')} 구하시오.`, V('A') + sup(2), A2, {
          figure: show(nm('A', A)), calc: cMul(A, A), rule: 'pow-2',
          explain: `${V('A')}${sup(2)} = ${V('A')}${V('A')} = ${MV(A, A)} = ${mat(A2)}이다.`
        });
      }
      const A3 = mmul(A2, A), c2 = cMul(A, A);
      return matQ(`행렬 ${Vj('A', '에')} 대하여 ${V('A')}${sup(3)}${SQ('을/를')} 구하시오.`, V('A') + sup(3), A3, {
        figure: show(nm('A', A)), calc: A.map((r, i) => r.map((_, j) => `(${c2[i][0]})*${jn(A[0][j])}+(${c2[i][1]})*${jn(A[1][j])}`)), rule: 'pow-3',
        explain: `${V('A')}${sup(2)} = ${mat(A2)}이므로 ${V('A')}${sup(3)} = ${V('A')}${sup(2)}${V('A')} = ${MV(A2, A)} = ${mat(A3)}이다.`
      });
    }, { count: 2 }),
    T('pow-unit', '단위행렬의 성질', '①42', (d, n) => {
      if (n === 0) {
        // E 의 거듭제곱: E^n = E, (−E)^n = ±E
        const c = d.pick([2, 3, -2]), m = d.int(2, 5);
        const forms = [
          { h: `${Ee}${sup(3)} + (${MINUS}${Ee})${sup(3)}`, v: 0, s: '1**3+(-1)**3' },
          { h: `(${MINUS}${Ee})${sup(2)} ${MINUS} ${m}${Ee}`, v: 1 - m, s: `(-1)**2-${m}` },
          { h: `(${sn(c)}${Ee})${sup(2)} + (${MINUS}${Ee})${sup(3)}`, v: c * c - 1, s: `${jn(c)}*${jn(c)}+(-1)**3` },
          { h: `${Ee}${sup(4)} + (${MINUS}${Ee})${sup(5)} ${MINUS} ${m}${Ee}`, v: 1 - 1 - m, s: `1**4+(-1)**5-${m}` }
        ];
        const f = d.pick(forms), Rm = [[f.v, 0], [0, f.v]];
        return matQ(`다음을 계산하시오.${UNIT_E}`, null, Rm, {
          figure: show(f.h), calc: [[f.s, '0'], ['0', f.s]], unseen: [0, 1], rule: 'unit-pow',
          explain: `${Ee}${sup(V('n'))} = ${Ee}이고 (${MINUS}${Ee})${sup(V('n'))}은 지수가 짝수이면 ${Ee}, 홀수이면 ${MINUS}${Ee}이다. 따라서 주어진 식은 ${f.v === 0 ? '영행렬' : cf(f.v, Ee)}이므로 ${mat(Rm)}이다.`
        });
      }
      const A = rm(d, 2, 2, -3, 3, true), Bm = rm(d, 2, 2, -3, 3, true);
      if (d.bool()) {
        const k = d.int(2, 4), Rm = madd(A, EYE);
        return matQ(`행렬 ${Vj('A', '에')} 대하여 ${nb(`${V('A')}${Ee} + ${Ee}${sup(k)}`)}${SQ('을/를')} 구하시오.${UNIT_E}`, null, Rm, {
          figure: show(nm('A', A)), calc: A.map((r, i) => r.map((v, j) => (i === j ? `${jn(v)}+1` : jn(v)))), unseen: [1], rule: 'unit-ae',
          explain: `${V('A')}${Ee} = ${V('A')}, ${Ee}${sup(k)} = ${Ee}이므로 ${nb(`${V('A')}${Ee} + ${Ee}${sup(k)}`)} = ${nb(`${V('A')} + ${Ee}`)} = ${mat(Rm)}이다.`
        });
      }
      const D = msub(A, Bm), Rm = mmul(A, D);
      return matQ(`두 행렬 ${V('A')}, ${Vj('B', '에')} 대하여 ${nb(`${V('A')}(${Ee}${V('A')} ${MINUS} ${V('B')}${Ee})`)}를 구하시오.${UNIT_E}`, null, Rm, {
        figure: show(nm('A', A), nm('B', Bm)), calc: A.map((r) => [0, 1].map((j) => `${jn(r[0])}*(${jn(A[0][j])}-${jn(Bm[0][j])})+${jn(r[1])}*(${jn(A[1][j])}-${jn(Bm[1][j])})`)), rule: 'unit-ea',
        explain: `${Ee}${V('A')} = ${V('A')}, ${V('B')}${Ee} = ${V('B')}이므로 ${nb(`${V('A')}(${Ee}${V('A')} ${MINUS} ${V('B')}${Ee})`)} = ${nb(`${V('A')}(${V('A')} ${MINUS} ${V('B')})`)}이다. ${nb(`${V('A')} − ${V('B')}`)} = ${mat(D)}이므로 ${MV(A, D)} = ${mat(Rm)}이다.`
      });
    }, { count: 2 }),
    T('pow-ke', '단위행렬의 실수배가 낀 덧셈 등식', '①43', (d, n) => {
      if (n === 0) {
        // A + kE = P, A − B = Q 일 때 A + mB
        const [k, m] = [d.pick([2, 3, 4, -2, -3]), d.pick([2, 3, -2])];
        const A0 = rm(d, 2, 2, -5, 5), B0 = rm(d, 2, 2, -5, 5), P = madd(A0, msc(k, EYE)), Qm = msub(A0, B0), Rm = madd(A0, msc(m, B0));
        const a = (i, j) => (i === j ? `(${jn(P[i][j])}-${jn(k)})` : jn(P[i][j]));
        return matQ(`두 행렬 ${V('A')}, ${Vj('B', '이/가')} 다음 두 등식을 만족시킬 때, ${nb(poly([[1, V('A')], [m, V('B')]]))}${pj('B', '을/를')} 구하시오.${UNIT_E}`, null, Rm, {
          figure: rowsOf([`${V('A')} ${k < 0 ? MINUS : '+'} ${cf(Math.abs(k), Ee)} = ${mat(P)}`, `${V('A')} ${MINUS} ${V('B')} = ${mat(Qm)}`]),
          calc: [0, 1].map((i) => [0, 1].map((j) => `(1+${jn(m)})*${a(i, j)}-${jn(m)}*${jn(Qm[i][j])}`)), unseen: [1], rule: 'ke-two',
          explain: `${cf(k, Ee)}${pj('E', '은/는')} 대각선 성분만 ${sn(k)}인 행렬이므로 ${V('A')} = ${mat(A0)}이다. ${nb(`${V('B')}`)} = ${nb(`${V('A')} − (${V('A')} − ${V('B')})`)} = ${mat(B0)}이므로 ${nb(poly([[1, V('A')], [m, V('B')]]))} = ${mat(Rm)}이다.`
        });
      }
      // A = (a b; a b), A + E 의 제1열의 합 s1, 제2열의 합 s2
      const [a, b] = [nz(d, -6, 6), nz(d, -6, 6)], s1 = 2 * a + 1, s2 = 2 * b + 1;
      return vals(`실수 ${V('a')}, ${Vj('b', '에')} 대하여 행렬 ${V('A')}${pj('A', '이/가')} 다음과 같다. 행렬 ${nb(`${V('A')} + ${Ee}`)}의 제1열의 모든 성분의 합이 ${sn(s1)}, 제2열의 모든 성분의 합이 ${sn(s2)}일 때, ${V('a')}, ${Vj('b', '의')} 값은?${UNIT_E}`, [[eqL('a'), a, `(${jn(s1)}-1)/2`], [eqL('b'), b, `(${jn(s2)}-1)/2`]], {
        figure: show(nm('A', [[V('a'), V('b')], [V('a'), V('b')]])), unseen: [1, 2], rule: 'ke-sum',
        explain: `${nb(`${V('A')} + ${Ee}`)} = ${mat([[poly([[1, V('a')], [1, '']]), V('b')], [V('a'), poly([[1, V('b')], [1, '']])]])}이므로 제1열의 합은 ${nb(`2${V('a')} + 1`)} = ${nb(`${sn(s1)}`)}, 제2열의 합은 ${nb(`2${V('b')} + 1`)} = ${nb(`${sn(s2)}`)}이다. ${V('a')} = ${sn(a)}, ${V('b')} = ${sn(b)}이다.`
      });
    }, { count: 2 }),
    T('pow-scalar', '실수배와 곱', '①44', (d) => {
      const k = d.pick([2, 3, -2, -3]), A = rm(d, 2, 2, -4, 4), Bm = rm(d, 2, 2, -4, 4), AB = mmul(A, Bm), Rm = msc(k, AB);
      return matQ(`두 행렬 ${V('A')}, ${Vj('B', '에')} 대하여 ${nb(`${V('A')}(${cf(k, V('B'))})`)}를 구하시오.`, null, Rm, {
        figure: show(nm('A', A), nm('B', Bm)), calc: cMul(A, Bm).map((r) => r.map((s) => `${jn(k)}*(${s})`)),
        explain: `${nb(`${V('A')}(${cf(k, V('B'))})`)} = ${nb(`${cf(k, '(' + V('A') + V('B') + ')')}`)}이다. ${V('A')}${V('B')} = ${mat(AB)}이므로 ${mat(Rm)}이다.`
      });
    }),
    T('pow-mixed', '곱·합·실수배가 섞인 식', '①45', (d, n) => {
      const A = rm(d, 2, 2, -4, 4, true), Bm0 = rm(d, 2, 2, -4, 4, true);
      if (n === 0) {
        const p = nz(d, -3, 3), A2 = mmul(A, A), Rm = madd(A2, msc(p, A)), c2 = cMul(A, A);
        return matQ(`행렬 ${Vj('A', '에')} 대하여 ${nb(poly([[1, V('A') + sup(2)], [p, V('A')]]))}${pj('A', '을/를')} 구하시오.`, null, Rm, {
          figure: show(nm('A', A)), calc: c2.map((r, i) => r.map((s, j) => `${s}+${jn(p)}*${jn(A[i][j])}`)), unseen: [1], rule: 'mix-a2',
          explain: `${V('A')}${sup(2)} = ${mat(A2)}, ${cf(p, V('A'))} = ${mat(msc(p, A))}이므로 더하면 ${mat(Rm)}이다.`
        });
      }
      if (n === 1) {
        const S = madd(A, Bm0), Rm = mmul(S, A);
        return matQ(`두 행렬 ${V('A')}, ${Vj('B', '에')} 대하여 ${nb(`(${V('A')} + ${V('B')})${V('A')}`)}를 구하시오.`, null, Rm, {
          figure: show(nm('A', A), nm('B', Bm0)), calc: [0, 1].map((i) => [0, 1].map((j) => `(${jn(A[i][0])}+${jn(Bm0[i][0])})*${jn(A[0][j])}+(${jn(A[i][1])}+${jn(Bm0[i][1])})*${jn(A[1][j])}`)), rule: 'mix-sum-a',
          explain: `${nb(`${V('A')} + ${V('B')}`)} = ${mat(S)}이므로 ${nb(`(${V('A')} + ${V('B')})${V('A')}`)} = ${MV(S, A)} = ${mat(Rm)}이다.`
        });
      }
      if (n === 2) {
        const [X, Y] = d.until(() => [rm(d, 2, 2, -4, 4, true), rm(d, 2, 2, -4, 4, true)], ([u, w]) => !same(mmul(u, w), mmul(w, u)));
        const AB = mmul(X, Y), BA = mmul(Y, X), Rm = msub(AB, BA), cAB = cMul(X, Y), cBA = cMul(Y, X);
        return matQ(`두 행렬 ${V('A')}, ${Vj('B', '에')} 대하여 ${nb(`${V('A')}${V('B')} ${MINUS} ${V('B')}${V('A')}`)}를 구하시오.`, null, Rm, {
          figure: show(nm('A', X), nm('B', Y)), calc: cAB.map((r, i) => r.map((s, j) => `${s}-(${cBA[i][j]})`)), rule: 'mix-comm',
          explain: `${V('A')}${V('B')} = ${mat(AB)}, ${V('B')}${V('A')} = ${mat(BA)}이므로 ${nb(`${V('A')}${V('B')} ${MINUS} ${V('B')}${V('A')}`)} = ${mat(Rm)}이다. 행렬의 곱은 곱하는 차례를 바꾸면 달라질 수 있다.`
        });
      }
      if (n === 3) {
        // A + B = kE 이면 A² + AB = A(A + B) = kA
        const k = d.pick([2, 3, -2, 4]), Bm = msub(msc(k, EYE), A), Rm = msc(k, A);
        return matQ(`두 행렬 ${V('A')}, ${Vj('B', '에')} 대하여 ${nb(`${V('A')}${sup(2)} + ${V('A')}${V('B')}`)}를 구하시오.`, null, Rm, {
          figure: show(nm('A', A), nm('B', Bm)), calc: cMul(A, madd(A, Bm)).map((r, i) => r.map((_, j) => `${jn(A[i][0])}*(${jn(A[0][j])}+${jn(Bm[0][j])})+${jn(A[i][1])}*(${jn(A[1][j])}+${jn(Bm[1][j])})`)), rule: 'mix-factor',
          explain: `${nb(`${V('A')}${sup(2)} + ${V('A')}${V('B')}`)} = ${nb(`${V('A')}(${V('A')} + ${V('B')})`)}이고 ${nb(`${V('A')} + ${V('B')}`)} = ${mat(madd(A, Bm))} = ${cf(k, Ee)}이므로 ${nb(`${V('A')}(${cf(k, Ee)})`)} = ${nb(`${cf(k, V('A'))}`)} = ${mat(Rm)}이다. (${Ee}${pj('E', '은/는')} 단위행렬)`
        });
      }
      // AB + BA = k(1 1; 1 1)
      const [a, b] = [nz(d, -5, 5), nz(d, -5, 5)], top = d.bool();
      const Am = top ? [[a, a], [0, 0]] : [[0, 0], [a, a]], Bm = top ? [[0, 0], [b, b]] : [[b, b], [0, 0]], k = a * b;
      return num1(`두 행렬 ${V('A')}, ${Vj('B', '과/와')} 실수 ${Vj('k', '이/가')} 다음 등식을 만족시킬 때, ${Vj('k', '의')} 값은?`, k, {
        figure: show(nm('A', Am), nm('B', Bm), `${V('A')}${V('B')} + ${V('B')}${V('A')} = ${V('k')}${mat([[1, 1], [1, 1]])}`), calc: `${jn(a)}*${jn(b)}`, rule: 'mix-ksum',
        explain: `${V('A')}${V('B')} = ${mat(mmul(Am, Bm))}, ${V('B')}${V('A')} = ${mat(mmul(Bm, Am))}이므로 ${nb(`${V('A')}${V('B')} + ${V('B')}${V('A')}`)} = ${mat(madd(mmul(Am, Bm), mmul(Bm, Am)))}이고 ${V('k')} = ${sn(k)}이다.`
      });
    }, { count: 5 }),
    T('pow-three', '세 행렬의 곱과 실수배', '①46', (d) => {
      const [P, Qm, a] = d.until(() => [rm(d, 1, 2, -4, 4), rm(d, 2, 2, -3, 3, true), nz(d, -4, 4)], ([p, q]) => { const u = mmul(p, q)[0]; return u[0] !== 0 && u[1] !== 0; });
      const PQ = mmul(P, Qm), r1 = a * PQ[0][0], b = a * PQ[0][1];
      return vals(`두 행렬 ${V('P')}, ${Vj('Q', '과/와')} 실수 ${V('a')}, ${Vj('b', '에')} 대하여 다음 등식이 성립할 때, ${V('a')}, ${Vj('b', '의')} 값은?`, [[eqL('a'), a, `${jn(r1)}/(${jn(P[0][0])}*${jn(Qm[0][0])}+${jn(P[0][1])}*${jn(Qm[1][0])})`], [eqL('b'), b, `${jn(r1)}/(${jn(P[0][0])}*${jn(Qm[0][0])}+${jn(P[0][1])}*${jn(Qm[1][0])})*(${jn(P[0][0])}*${jn(Qm[0][1])}+${jn(P[0][1])}*${jn(Qm[1][1])})`]], {
        figure: show(nm('P', P), nm('Q', Qm), `${V('a')}${V('P')}${V('Q')} = ${mat([[r1, V('b')]])}`),
        explain: `${V('P')}${V('Q')} = ${mat(PQ)}이므로 ${V('a')}${V('P')}${V('Q')} = ${mat([[nb(`${sn(PQ[0][0])}${V('a')}`), nb(`${sn(PQ[0][1])}${V('a')}`)]])}이다. ${nb(`${sn(PQ[0][0])}${V('a')}`)} = ${nb(`${sn(r1)}`)}에서 ${V('a')} = ${sn(a)}, ${V('b')} = ${nb(`${sn(PQ[0][1])} × ${pn(a)}`)} = ${sn(b)}이다.`
      });
    }),
    T('pow-alpha', '근과 계수의 관계와 거듭제곱의 성분의 합', '②68', (d) => {
      const X = V('x'), Al = V('α'), Be = V('β');
      const [s, p] = d.until(() => [nz(d, -6, 6), nz(d, -6, 6)], ([ss, pp]) => { const D = ss * ss - 4 * pp; return D > 0 && !Number.isInteger(Math.sqrt(D)); });
      const v = s * s - 2 * p + 2 + 2 * s;
      return num1(`이차방정식 ${nb(poly([[1, X + sup(2)], [-s, X], [p, '']]) + ' = 0')}의 두 근을 ${Al}, ${Be}라 할 때, 행렬 ${Vj('A', '에')} 대하여 행렬 ${V('A')}${sup(2)}의 모든 성분의 합은?`, v, {
        figure: show(nm('A', [[Al, 1], [1, Be]])), calc: `${jn(s)}*${jn(s)}-2*${jn(p)}+2+2*${jn(s)}`, unseen: [1, 2],
        explain: `${V('A')}${sup(2)} = ${mat([[nb(`${Al}${sup(2)} + 1`), nb(`${Al} + ${Be}`)], [nb(`${Al} + ${Be}`), nb(`${Be}${sup(2)} + 1`)]])}이므로 모든 성분의 합은 ${nb(`${Al}${sup(2)} + ${Be}${sup(2)} + 2(${Al} + ${Be}) + 2`)}이다. ${nb(`${Al} + ${Be}`)} = ${nb(`${sn(s)}`)}, ${nb(`${Al}${Be}`)} = ${nb(`${sn(p)}`)}이므로 ${nb(`(${Al} + ${Be})${sup(2)} − 2${Al}${Be} + 2(${Al} + ${Be}) + 2`)} = ${nb(`${sn(v)}`)}이다.`
      });
    })
  ];

  // ── 곱셈이 낀 등식 ──
  const X = V('x'), Y = V('y');
  const mulEqTypes = [
    T('muleq-sys', '곱의 등식을 연립방정식으로', '②47', (d) => {
      const [A, x, y] = d.until(() => [rm(d, 2, 2, -4, 4), nz(d, -6, 6), nz(d, -6, 6)], ([a]) => a[0][0] * a[1][1] - a[0][1] * a[1][0] !== 0);
      const [p, q] = [A[0][0] * x + A[0][1] * y, A[1][0] * x + A[1][1] * y], det = `(${jn(A[0][0])}*${jn(A[1][1])}-${jn(A[0][1])}*${jn(A[1][0])})`;
      return vals(`다음 등식을 만족시키는 실수 ${X}, ${Vj('y', '의')} 값은?`, [[eqL('x'), x, `(${jn(p)}*${jn(A[1][1])}-${jn(A[0][1])}*${jn(q)})/${det}`], [eqL('y'), y, `(${jn(A[0][0])}*${jn(q)}-${jn(A[1][0])}*${jn(p)})/${det}`]], {
        figure: show(`${mat(A)}${mat([[X], [Y]])} = ${mat([[p], [q]])}`),
        explain: `좌변은 ${mat([[poly([[A[0][0], X], [A[0][1], Y]])], [poly([[A[1][0], X], [A[1][1], Y]])]])}이므로 두 성분을 비교하여 연립하면 ${X} = ${sn(x)}, ${Y} = ${sn(y)}이다.`
      });
    }),
    T('muleq-none', '해가 없는 곱의 등식', '②48', (d) => {
      const [k, m] = d.until(() => [nz(d, -9, 9), d.pick([2, 3, 4, 5])], ([kk, mm]) => kk % mm !== 0);
      const [u, v] = d.until(() => [nz(d, -9, 9), nz(d, -9, 9)], ([uu, vv]) => m * uu !== k * vv);
      const A = [[V('a'), k], [1, m]];
      return ansV(`세 행렬 ${V('A')}, ${V('X')}, ${Vj('B', '에')} 대하여 ${nb(`${V('A')}${V('X')} = ${V('B')}`)}를 만족시키는 실수 ${X}, ${Vj('y', '이/가')} 존재하지 않을 때, 상수 ${Vj('a', '의')} 값은?`, Q(k, m), 'frac', {
        figure: show(nm('A', A), nm('X', [[X], [Y]]), nm('B', [[u], [v]])), facts: { value: `${jn(k)}/${m}` },
        explain: `${nb(`${V('A')}${V('X')}`)} = ${nb(`${V('B')}`)}에서 ${sys2(`${V('a')}${X} ${k < 0 ? MINUS : '+'} ${cf(Math.abs(k), Y)} = ${sn(u)}`, `${poly([[1, X], [m, Y]])} = ${sn(v)}`)}이다. 해가 없으려면 ${X}, ${Vj('y', '의')} 계수의 비가 같고 상수항의 비는 달라야 하므로 ${nb(`${V('a')} : 1`)} = ${nb(`${sn(k)} : ${m}`)}, ${V('a')} = ${frac((k < 0 ? MINUS : '') + Math.abs(k), m)}이다.`
      });
    }),
    T('muleq-zero', '곱이 영행렬인 등식', '②49', (d, n) => {
      if (n === 0) {
        // A = (1 x; c y), B = (x m; −1 nn), AB = O → x = −m/nn, y = cx
        const [x, nn, c] = d.until(() => [nz(d, -5, 5), d.pick([1, 2, 3, -1, -2]), nz(d, -4, 4)], ([xx, n2, cc]) => Math.abs(xx * n2) <= 12 && Math.abs(cc * xx) <= 20);
        const m = -x * nn, y = c * x;
        return vals(`두 행렬 ${V('A')}, ${Vj('B', '이/가')} ${nb(`${V('A')}${V('B')} = ${V('O')}`)}를 만족시킬 때, 실수 ${X}, ${Vj('y', '의')} 값은?${UNIT_O}`, [[eqL('x'), x, `(0-${jn(m)})/${jn(nn)}`], [eqL('y'), y, `${jn(c)}*(0-${jn(m)})/${jn(nn)}`]], {
          figure: show(nm('A', [[1, X], [c, Y]]), nm('B', [[X, m], [-1, nn]])), unseen: [0, 1], rule: 'zero-two',
          explain: `${V('A')}${V('B')} = ${mat([[0, poly([[nn, X], [m, '']])], [poly([[c, X], [-1, Y]]), nb(`${sn(c * m)} ${nn < 0 ? MINUS : '+'} ${cf(Math.abs(nn), Y)}`)]])}이 영행렬이므로 ${nb(`${poly([[nn, X], [m, '']])}`)} = ${nb(`0`)}에서 ${X} = ${sn(x)}, ${nb(`${poly([[c, X], [-1, Y]])}`)} = ${nb(`0`)}에서 ${Y} = ${sn(y)}이다.`
        });
      }
      // A(B + C) = O: A = (a b; 1 −r), B + C = (rw, a + c0; w, a)
      const [r, a, w] = d.until(() => [d.pick([2, 3, -1, -2]), nz(d, -4, 4), nz(d, -3, 3)], ([rr, aa]) => Math.abs(aa * rr) <= 12);
      const b = -a * r, c0 = a * (r - 1), [b11, b21] = [d.int(-5, 5), d.int(-5, 5)], c11 = r * w - b11, c21 = w - b21;
      return vals(`세 행렬 ${V('A')}, ${V('B')}, ${Vj('C', '에')} 대하여 ${nb(`${V('A')}(${V('B')} + ${V('C')}) = ${V('O')}`)}일 때, 실수 ${V('a')}, ${Vj('b', '의')} 값은?${UNIT_O}`, [[eqL('a'), a, `${jn(c0)}/(${jn(r)}-1)`], [eqL('b'), b, `(0-${jn(c0)}/(${jn(r)}-1))*${jn(r)}`]], {
        figure: show(nm('A', [[V('a'), V('b')], [1, -r]]), nm('B', [[b11, V('a')], [b21, V('a')]]), nm('C', [[c11, c0], [c21, 0]])), unseen: [0, 1], rule: 'zero-sum',
        explain: `${nb(`${V('B')} + ${V('C')}`)} = ${mat([[r * w, poly([[1, V('a')], [c0, '']])], [w, V('a')]])}이다. ${nb(`${V('A')}(${V('B')} + ${V('C')})`)}의 (2, 2) 성분은 ${nb(`${poly([[1, V('a')], [c0, '']])} ${r < 0 ? '+' : MINUS} ${cf(Math.abs(r), V('a'))}`)} = ${nb(`0`)}이므로 ${V('a')} = ${sn(a)}이고, (1, 1) 성분은 ${nb(`${sn(r * w)}${V('a')} ${w < 0 ? MINUS : '+'} ${cf(Math.abs(w), V('b'))}`)} = ${nb(`0`)}이므로 ${V('b')} = ${sn(b)}이다.`
      });
    }, { count: 2 }),
    T('muleq-comm', '곱의 교환이 성립하는 행렬', '②50', (d, n) => {
      if (n === 0) {
        // A = αE + βB 꼴로 지은 A 의 (2, 2) 성분 a
        const [Bm, al, be] = d.until(() => [rm(d, 2, 2, -4, 4), d.int(-4, 4), d.pick([1, -1, 2, -2])], ([b]) => b[0][0] !== b[1][1]);
        const A = [[al + be * Bm[0][0], be * Bm[0][1]], [be * Bm[1][0], al + be * Bm[1][1]]], a = A[1][1];
        return num1(`두 행렬 ${V('A')}, ${Vj('B', '에')} 대하여 ${nb(`${V('A')}${V('B')} = ${V('B')}${V('A')}`)}가 성립하도록 하는 실수 ${Vj('a', '의')} 값은?`, a, {
          figure: show(nm('A', [[A[0][0], A[0][1]], [A[1][0], V('a')]]), nm('B', Bm)), calc: `${jn(A[0][0])}+${jn(A[0][1])}*(${jn(Bm[1][1])}-${jn(Bm[0][0])})/${jn(Bm[0][1])}`, rule: 'comm-one',
          explain: `${V('A')}${V('B')}와 ${V('B')}${Vj('A', '의')} (1, 2) 성분을 비교하면 ${nb(`${pn(A[0][0])} × ${pn(Bm[0][1])} + ${pn(A[0][1])} × ${pn(Bm[1][1])}`)} = ${nb(`${pn(Bm[0][0])} × ${pn(A[0][1])} + ${pn(Bm[0][1])} × ${V('a')}`)}이므로 ${V('a')} = ${sn(a)}이다. 이때 나머지 성분도 같다.`
        });
      }
      // B = αE + βA: A = (a11 a12; a21 x), B = (b11 b12; y b22)
      const [A0, al, be] = d.until(() => [rm(d, 2, 2, -4, 4), d.int(-3, 3), d.pick([1, -1, 2, -2])], ([a]) => a[0][0] !== a[1][1]);
      const x = A0[1][1], b11 = al + be * A0[0][0], b12 = be * A0[0][1], y = be * A0[1][0], b22 = al + be * x;
      return vals(`두 행렬 ${V('A')}, ${Vj('B', '에')} 대하여 ${nb(`${V('A')}${V('B')} = ${V('B')}${V('A')}`)}가 성립할 때, 실수 ${X}, ${Vj('y', '의')} 값은?`, [[eqL('x'), x, `(${jn(A0[0][0])}*${jn(b12)}+${jn(A0[0][1])}*${jn(b22)}-${jn(b11)}*${jn(A0[0][1])})/${jn(b12)}`], [eqL('y'), y, `${jn(b12)}*${jn(A0[1][0])}/${jn(A0[0][1])}`]], {
        figure: show(nm('A', [[A0[0][0], A0[0][1]], [A0[1][0], X]]), nm('B', [[b11, b12], [Y, b22]])), rule: 'comm-two',
        explain: `(1, 1) 성분을 비교하면 ${nb(`${pn(A0[0][0])} × ${pn(b11)} + ${pn(A0[0][1])}${Y}`)} = ${nb(`${pn(b11)} × ${pn(A0[0][0])} + ${pn(b12)} × ${pn(A0[1][0])}`)}이므로 ${Y} = ${sn(y)}이다. (1, 2) 성분을 비교하면 ${nb(`${pn(A0[0][0])} × ${pn(b12)} + ${pn(A0[0][1])} × ${pn(b22)}`)} = ${nb(`${pn(b11)} × ${pn(A0[0][1])} + ${pn(b12)}${X}`)}이므로 ${X} = ${sn(x)}이다.`
      });
    }, { count: 2 }),
    T('muleq-sum', '곱과 합이 같은 등식', '②51', (d) => {
      const [a, b] = d.until(() => [nz(d, -4, 5), nz(d, -4, 5)], ([u, w]) => u !== 1 && w !== 1);
      const Bm = rm(d, 2, 2, -4, 4), Cm = [[a * Bm[0][0] - a - Bm[0][0], (a - 1) * Bm[0][1]], [(b - 1) * Bm[1][0], b * Bm[1][1] - b - Bm[1][1]]];
      return vals(`세 행렬 ${V('A')}, ${V('B')}, ${Vj('C', '에')} 대하여 ${nb(`${V('A')}${V('B')} = ${V('A')} + ${V('B')} + ${V('C')}`)}를 만족시키는 실수 ${V('a')}, ${Vj('b', '의')} 값은?`, [[eqL('a'), a, `(${jn(Bm[0][1])}+${jn(Cm[0][1])})/${jn(Bm[0][1])}`], [eqL('b'), b, `(${jn(Bm[1][0])}+${jn(Cm[1][0])})/${jn(Bm[1][0])}`]], {
        figure: show(nm('A', [[V('a'), 0], [0, V('b')]]), nm('B', Bm), nm('C', Cm)),
        explain: `${V('A')}${V('B')} = ${mat([[cf(Bm[0][0], V('a')), cf(Bm[0][1], V('a'))], [cf(Bm[1][0], V('b')), cf(Bm[1][1], V('b'))]])}이다. (1, 2) 성분에서 ${nb(`${cf(Bm[0][1], V('a'))}`)} = ${nb(`${sn(Bm[0][1] + Cm[0][1])}`)}이므로 ${V('a')} = ${sn(a)}, (2, 1) 성분에서 ${nb(`${cf(Bm[1][0], V('b'))}`)} = ${nb(`${sn(Bm[1][0] + Cm[1][0])}`)}이므로 ${V('b')} = ${sn(b)}이다.`
      });
    }),
    T('muleq-both', '곱이 양쪽에 있는 등식에서 식의 값', '②52', (d) => {
      const Aa = V('a'), Bb = V('b');
      const [p, q, r0, t] = d.until(() => [d.int(2, 5), d.int(2, 6), nz(d, -6, 6), nz(d, -5, 5)], ([, , rr, tt]) => tt * tt + 4 * rr > 0);
      const ask = d.pick([{ h: `${Aa}${sup(2)} + ${Bb}${sup(2)}`, v: t * t + 2 * r0, c: `(0-${jn(t)})*(0-${jn(t)})-2*(0-${jn(r0)})`, how: `(${Aa} + ${Bb})${sup(2)} − 2${Aa}${Bb}` }, { h: `${Aa}${sup(3)} + ${Bb}${sup(3)}`, v: -(t ** 3) - 3 * r0 * t, c: `(0-${jn(t)})*(0-${jn(t)})*(0-${jn(t)})-3*(0-${jn(r0)})*(0-${jn(t)})`, how: `(${Aa} + ${Bb})${sup(3)} − 3${Aa}${Bb}(${Aa} + ${Bb})` }]);
      return num1(`다음 등식을 만족시키는 실수 ${Aa}, ${Vj('b', '에')} 대하여 ${ask.h}의 값은?`, ask.v, {
        figure: show(`${mat([[p, Aa], [q, 1]])}${mat([[Aa], [Bb]])} = ${mat([[r0, p], [t, q - 1]])}${mat([[-1], [Aa]])}`), calc: ask.c, unseen: [0, 1, 2, 3],
        explain: `좌변은 ${mat([[nb(`${p}${Aa} + ${Aa}${Bb}`)], [nb(`${q}${Aa} + ${Bb}`)]])}, 우변은 ${mat([[nb(`${sn(-r0)} + ${p}${Aa}`)], [nb(`${sn(-t)} + ${cf(q - 1, Aa)}`)]])}이므로 ${nb(`${Aa}${Bb}`)} = ${nb(`${sn(-r0)}`)}, ${nb(`${Aa} + ${Bb}`)} = ${nb(`${sn(-t)}`)}이다. ${nb(`${ask.h}`)} = ${nb(`${ask.how}`)} = ${nb(`${sn(ask.v)}`)}이다.`
      });
    }),
    T('muleq-basis', '두 열로 정해지는 행렬', '②54', (d) => {
      const A = rm(d, 2, 2, -5, 5), [u, v] = [nz(d, -4, 4), nz(d, -4, 4)], Rm = mmul(A, [[u], [v]]);
      return matQ(`2×2 행렬 ${Vj('A', '이/가')} 다음 두 등식을 만족시킬 때, 행렬 ${V('A')}${mat([[u], [v]])}의 두 성분을 구하시오.`, V('A') + mat([[u], [v]]), Rm, {
        figure: rowsOf([`${V('A')}${mat([[1], [0]])} = ${mat([[A[0][0]], [A[1][0]]])}`, `${V('A')}${mat([[0], [1]])} = ${mat([[A[0][1]], [A[1][1]]])}`]),
        calc: [[`${jn(A[0][0])}*${jn(u)}+${jn(A[0][1])}*${jn(v)}`], [`${jn(A[1][0])}*${jn(u)}+${jn(A[1][1])}*${jn(v)}`]],
        explain: `첫째 등식의 우변은 ${Vj('A', '의')} 제1열, 둘째 등식의 우변은 ${Vj('A', '의')} 제2열이므로 ${V('A')} = ${mat(A)}이다. ${V('A')}${mat([[u], [v]])} = ${mat(Rm)}이다.`
      });
    }),
    T('muleq-pow0', '제곱이 영행렬인 행렬', '②56', (d) => {
      const dd = nz(d, -4, 4), divs = range(1, dd * dd).filter((t) => (dd * dd) % t === 0), b = d.pick(divs) * d.pick([1, -1]), c = -(dd * dd) / b;
      return num1(`행렬 ${Vj('A', '이/가')} ${nb(`${V('A')}${sup(2)} = ${V('O')}`)}를 만족시킬 때, 실수 ${Vj('a', '의')} 값은?${UNIT_O}`, -dd, {
        figure: show(nm('A', [[V('a'), b], [c, dd]])), calc: `0-${jn(dd)}`, unseen: [0],
        explain: `${V('A')}${sup(2)}의 (1, 2) 성분은 ${nb(`${V('a')} × ${pn(b)} + ${pn(b)} × ${pn(dd)}`)} = ${nb(cf(b, `(${V('a')} ${dd < 0 ? MINUS : '+'} ${Math.abs(dd)})`))}이고 이것이 0이므로 ${V('a')} = ${sn(-dd)}이다. 이때 (1, 1) 성분 ${nb(`${V('a')}${sup(2)} + ${pn(b)} × ${pn(c)}`)}도 0이 된다(${nb(`${V('a')}${sup(2)}`)} = ${nb(`${dd * dd}`)}만 보면 ${V('a')} = ±${Math.abs(dd)}의 두 값이 나오니 다른 성분까지 맞춰 보아야 한다).`
      });
    }),
    T('muleq-period', 'Aⁿ = E가 되는 가장 작은 n', '②57', (d) => {
      const want = d.pick([2, 3, 4, 6]);
      const orderOf = (A) => { let P = A; for (let n = 1; n <= 12; n += 1) { if (same(P, EYE)) return n; P = mmul(P, A); } return 0; };
      const A = d.until(() => rm(d, 2, 2, -3, 3, true), (X) => orderOf(X) === want && X.flat().filter((v) => v !== 0).length >= 3);
      const pows = [A]; while (!same(pows[pows.length - 1], EYE)) pows.push(mmul(pows[pows.length - 1], A));
      const shown = pows.slice(1, Math.min(pows.length, want === 6 ? 3 : want)).map((P, i) => `${V('A')}${sup(i + 2)} = ${mat(P)}`).join(', ');
      return N(`행렬 ${Vj('A', '에')} 대하여 ${nb(`${V('A')}${sup(V('n'))} = ${Ee}`)}를 만족시키는 자연수 ${Vj('n', '의')} 최솟값은?${UNIT_E}`, want, {
        figure: show(nm('A', A)), facts: { check: { order: want } },
        explain: want === 2 ? `${V('A')}${sup(2)} = ${mat(pows[1])} = ${Ee}이므로 최솟값은 2이다.`
          : want === 3 ? `${shown}이고 ${V('A')}${sup(3)} = ${Ee}이므로 최솟값은 3이다.`
            : want === 4 ? `${V('A')}${sup(2)} = ${mat(pows[1])} = ${MINUS}${Ee}이므로 ${nb(`${V('A')}${sup(4)} = (${MINUS}${Ee})${sup(2)} = ${Ee}`)}이다. ${V('A')}, ${V('A')}${sup(2)}, ${V('A')}${sup(3)}${SQ('은/는')} ${Ee}가 아니므로 최솟값은 4이다.`
              : `${shown}이고 ${V('A')}${sup(3)} = ${MINUS}${Ee}이므로 ${nb(`${V('A')}${sup(6)}`)} = ${nb(`(${MINUS}${Ee})${sup(2)}`)} = ${nb(`${Ee}`)}이다. 그보다 작은 거듭제곱은 ${Ee}가 아니므로 최솟값은 6이다.`
      });
    })
  ];

  // ── 행렬의 곱셈의 활용 ──
  const SCENES = [
    { what: '햄버거 가게', rows: ['가게 X', '가게 Y'], items: ['햄버거', '콜라'], unit: 'kcal', ranges: [[450, 800], [80, 160]], people: true, ask: (p, s) => `${name(p, '이/가')} ${s}에서 산 햄버거와 콜라의 총 열량`, head: '1개의 열량' },
    { what: '제과점', rows: ['제과점 P', '제과점 Q'], items: ['과자', '음료'], unit: '원', ranges: [[800, 2500], [500, 1800]], people: true, ask: (p, s) => `${name(p, '이/가')} ${s}에서 과자와 음료를 살 때 내야 하는 돈`, head: '1개의 값' },
    { what: '가구 공장', rows: ['공장 X', '공장 Y'], items: ['소파', '침대'], unit: '개', ranges: [[3, 12], [3, 12]], parts: ['부품 P', '부품 Q'], ask: (part, s) => `${s}에서 하루에 필요한 ${part}의 개수`, head: '하루 생산량' }
  ];
  const mulLifeTypes = [
    T('life-mean', '곱의 성분이 뜻하는 것', '②61', (d) => {
      const sc = d.pick(SCENES), cols = sc.people ? d.shuffle(NAMES).slice(0, 2) : sc.parts;
      const A = [0, 1].map(() => sc.ranges.map(([lo, hi]) => { const v = d.int(lo, hi); return sc.unit === '원' ? Math.round(v / 100) * 100 : v; }));
      const Bm = rm(d, 2, 2, 1, 6, true), i = d.int(1, 2), j = d.int(1, 2);
      const t1 = K.capt('[표 1] ' + sc.head, table([`(단위: ${sc.unit})`].concat(sc.items), sc.rows.map((r, k) => [r].concat(A[k].map(String)))));
      const t2 = K.capt(sc.people ? '[표 2] 사려는 개수' : '[표 2] 1개에 필요한 부품 수', table(['(단위: 개)'].concat(cols), sc.items.map((it, k) => [it].concat(Bm[k].map(String)))));
      const target = sc.ask(cols[j - 1], sc.rows[i - 1]);
      const lab = (P, a, b) => `행렬 ${V(P[0])}${Vj(P[1], '의')} (${a}, ${b}) 성분`;
      const right = lab('AB', i, j), pool = [lab('AB', j, i), lab('AB', 3 - i, j), lab('AB', i, 3 - j), lab('BA', i, j), lab('BA', j, i)].filter((h, k, all) => h !== right && all.indexOf(h) === k);
      return pickOne(d, `두 표를 각각 행렬 ${V('A')}, ${Vj('B', '으로/로')} 나타낼 때, ${josa(target, '을/를')} 나타내는 것은?`, [[right, true]].concat(d.shuffle(pool).slice(0, 3).map((h) => [h, false])), {
        figure: t1 + t2,
        explain: sc.people
          ? `${sc.rows[i - 1]}의 ${sc.items[0]}·${sc.items[1]} 1개의 ${sc.unit === '원' ? '값' : '열량'}은 ${Vj('A', '의')} 제${i}행, ${name(cols[j - 1], '이/가')} 사는 ${sc.items[0]}·${sc.items[1]}의 개수는 ${Vj('B', '의')} 제${j}열이다. 둘을 차례로 곱하여 더한 값이 ${V('A')}${Vj('B', '의')} (${i}, ${j}) 성분이다.`
          : `${sc.rows[i - 1]}의 ${sc.items[0]}·${sc.items[1]} 하루 생산량은 ${Vj('A', '의')} 제${i}행, ${sc.items[0]}·${sc.items[1]} 하나에 필요한 ${cols[j - 1]}의 개수는 ${Vj('B', '의')} 제${j}열이다. 둘을 차례로 곱하여 더한 값이 ${V('A')}${Vj('B', '의')} (${i}, ${j}) 성분이다.`
      });
    }),
    T('life-express', '원하는 양을 행렬의 곱으로', '②62', (d, n) => {
      if (n === 0) {
        // 제품 A, B 를 m 개, n 개 만들 때의 재료비. 맞는 식은 하나, 틀린 보기는 곱하는 차례·자리를 바꾼 식이다.
        const xv = V('x'), yv = V('y');
        const mk = (R, Mx) => ({ h: `${mat([R])}${mat(Mx)}${mat([[xv], [yv]])}`, c: [R[0] * Mx[0][0] + R[1] * Mx[1][0], R[0] * Mx[0][1] + R[1] * Mx[1][1]] });
        const mk2 = (Mx, R) => ({ h: `${mat([[xv, yv]])}${mat(Mx)}${mat([[R[0]], [R[1]]])}`, c: [Mx[0][0] * R[0] + Mx[0][1] * R[1], Mx[1][0] * R[0] + Mx[1][1] * R[1]] });
        const [Tm, m, nn, all, right] = d.until(() => {
          const T0 = rm(d, 2, 2, 1, 6, true), a = d.int(5, 30), b = d.int(5, 30), Tt = [[T0[0][0], T0[1][0]], [T0[0][1], T0[1][1]]];
          const r = [T0[0][0] * a + T0[1][0] * b, T0[0][1] * a + T0[1][1] * b];
          return [T0, a, b, [mk([a, b], T0), mk([b, a], T0), mk([a, b], Tt), mk([b, a], Tt), mk2(T0, [a, b]), mk2(T0, [b, a])], r];
        }, ([T0, a, b, list, r]) => a !== b && T0[0][1] !== T0[1][0] && new Set(list.map((o) => o.h)).size === list.length && list.slice(1).filter((o) => o.c[0] !== r[0] || o.c[1] !== r[1]).length >= 3);
        const isRight = (o) => o.c[0] === right[0] && o.c[1] === right[1];
        const wrongs = d.shuffle(all.slice(1).filter((o) => !isRight(o))).slice(0, 3);
        const tbl = table(['(단위: kg)', '목재', '고무'], [['제품 A', String(Tm[0][0]), String(Tm[0][1])], ['제품 B', String(Tm[1][0]), String(Tm[1][1])]]);
        return pickOne(d, `어느 공장에서 제품 A, B를 하나씩 만드는 데 필요한 목재와 고무의 양은 표와 같다. 목재와 고무를 1 kg에 각각 ${xv}원, ${yv}원에 살 때, 제품 A를 ${m}개, 제품 B를 ${nn}개 만드는 데 드는 재료의 값을 행렬의 곱으로 나타낸 것은?`, [[all[0].h, true]].concat(wrongs.map((o) => [o.h, false])), {
          figure: tbl, rule: 'express-cost',
          explain: `제품 하나에 드는 재료의 값은 ${mat(Tm)}${mat([[xv], [yv]])}의 성분이고, 제품 A ${m}개와 B ${nn}개의 값은 이 두 성분에 ${nj(m, '과/와')} ${nj(nn, '을/를')} 곱하여 더한 것이므로 ${all[0].h}이다.`
        });
      }
      if (n === 1) {
        // 오전·오후 요금(a_ij)과 인원(b_i1)의 곱 (p; q): 아끼는 요금
        const morningCheap = d.bool(), Pv = V('p'), Qv = V('q');
        const t1 = K.capt('[표 1] 관람 요금', table(['(단위: 원)', '어른', '청소년'], [['오전', ent2('a', 1, 1), ent2('a', 1, 2)], ['오후', ent2('a', 2, 1), ent2('a', 2, 2)]]));
        const t2 = K.capt('[표 2] 인원수', table(['(단위: 명)', '인원수'], [['어른', ent2('b', 1, 1)], ['청소년', ent2('b', 2, 1)]]));
        const right = morningCheap ? `${Qv} ${MINUS} ${Pv}` : `${Pv} ${MINUS} ${Qv}`;
        const opts = [Pv, Qv, `${Pv} + ${Qv}`, `${Pv} ${MINUS} ${Qv}`, `${Qv} ${MINUS} ${Pv}`].map((h) => [h, h === right]);
        return pickOne(d, `표 1은 어느 전시관의 관람 요금, 표 2는 관람할 일행의 인원수이다. ${morningCheap ? '오전' : '오후'} 관람 요금이 더 쌀 때, 두 표로 만든 아래 등식의 ${Pv}, ${Vj('q', '에')} 대하여 이 일행이 ${morningCheap ? '오후 대신 오전에' : '오전 대신 오후에'} 관람하여 아낄 수 있는 요금을 나타낸 것은?`, opts, {
          figure: t1 + t2 + show(`${mat([[ent2('a', 1, 1), ent2('a', 1, 2)], [ent2('a', 2, 1), ent2('a', 2, 2)]])}${mat([[ent2('b', 1, 1)], [ent2('b', 2, 1)]])} = ${mat([[Pv], [Qv]])}`), rule: 'express-save',
          explain: `${Pv}${pj('p', '은/는')} 표 1의 오전 요금과 인원수를 곱하여 더한 오전의 관람 요금, ${Qv}${pj('q', '은/는')} 오후의 관람 요금이다. 아낄 수 있는 요금은 비싼 쪽에서 싼 쪽을 뺀 ${right}이다.`
        });
      }
      // 과수원: (a_ij)(b_ij) = (a b; c d), (a_ij)(1; 1) = (p; q) — 한 그루당 평균 열매 수
      const crop = d.pick([0, 1]), names = ['대추', '배'], Pv = V('p'), Qv = V('q'), L = (s) => V(s);
      const t1 = K.capt('[표 1] 그루 수', table(['(단위: 그루)', '과수원 A', '과수원 B'], [['대추나무', ent2('a', 1, 1), ent2('a', 1, 2)], ['배나무', ent2('a', 2, 1), ent2('a', 2, 2)]]));
      const t2 = K.capt('[표 2] 한 그루당 평균 열매 수', table(['(단위: 개)', '대추', '배'], [['과수원 A', ent2('b', 1, 1), ent2('b', 1, 2)], ['과수원 B', ent2('b', 2, 1), ent2('b', 2, 2)]]));
      const right = crop === 0 ? frac(L('a'), Pv) : frac(L('d'), Qv);
      const pool = [frac(L('a'), Pv), frac(L('d'), Qv), frac(L('b'), Qv), frac(L('c'), Pv), frac(L('d'), Pv), frac(L('a'), Qv)];
      const rows = [[right, true]].concat(d.shuffle(pool.filter((h) => h !== right)).slice(0, 3).map((h) => [h, false]));
      const Am = mat([[ent2('a', 1, 1), ent2('a', 1, 2)], [ent2('a', 2, 1), ent2('a', 2, 2)]]);
      return pickOne(d, `표 1은 두 과수원 A, B의 대추나무와 배나무의 그루 수, 표 2는 과수원마다 한 그루에 열리는 열매의 평균 개수이다. 두 표로 만든 아래 두 등식의 ${L('a')}, ${L('b')}, ${L('c')}, ${L('d')}, ${Pv}, ${Vj('q', '에')} 대하여 두 과수원을 합친 ${names[crop]}나무 한 그루당 평균 열매 수를 나타낸 것은?`, rows, {
        figure: t1 + t2 + rowsOf([`${Am}${mat([[ent2('b', 1, 1), ent2('b', 1, 2)], [ent2('b', 2, 1), ent2('b', 2, 2)]])} = ${mat([[L('a'), L('b')], [L('c'), L('d')]])}`, `${Am}${mat([[1], [1]])} = ${mat([[Pv], [Qv]])}`]), rule: 'express-avg',
        explain: crop === 0 ? `${V('a')}(${nb(`= ${ent2('a', 1, 1)}${ent2('b', 1, 1)} + ${ent2('a', 1, 2)}${ent2('b', 2, 1)}`)})${pj('a', '은/는')} 두 과수원의 대추의 총개수, ${Pv}(${nb(`= ${ent2('a', 1, 1)} + ${ent2('a', 1, 2)}`)})${pj('p', '은/는')} 대추나무의 총그루 수이므로 ${right}이다.`
          : `${V('d')}(${nb(`= ${ent2('a', 2, 1)}${ent2('b', 1, 2)} + ${ent2('a', 2, 2)}${ent2('b', 2, 2)}`)})${pj('d', '은/는')} 두 과수원의 배의 총개수, ${Qv}(${nb(`= ${ent2('a', 2, 1)} + ${ent2('a', 2, 2)}`)})${pj('q', '은/는')} 배나무의 총그루 수이므로 ${right}이다.`
      });
    }, { count: 3 }),
    T('life-calc', '실생활 곱 계산', '②63', (d, n) => {
      if (n === 0) {
        // 판매 수량 A(지점 × 부품), 판매 가격 B, 원가 C → 판매 이익 AB − AC
        const A = rm(d, 2, 2, 2, 12, true);
        const [price, cost] = d.until(() => { const p = [d.int(2, 8) * 50, d.int(2, 8) * 50]; return [p, p.map((v) => v - d.int(1, 3) * 50)]; }, ([p, c]) => c.every((v) => v > 0) && p[0] !== p[1]);
        const Bm = price.map((v) => [v]), Cm = cost.map((v) => [v]), Rm = msub(mmul(A, Bm), mmul(A, Cm));
        const t1 = table(['(단위: 개)', '부품 P', '부품 Q'], [['본점', String(A[0][0]), String(A[0][1])], ['대리점', String(A[1][0]), String(A[1][1])]]);
        const t2 = table(['(단위: 원)', '판매 가격', '원가'], [['부품 P', String(price[0]), String(cost[0])], ['부품 Q', String(price[1]), String(cost[1])]]);
        return matQ(`어느 회사의 본점과 대리점이 오늘 판 부품의 수와 부품 한 개의 판매 가격, 원가가 표와 같다. 판 부품의 수를 행렬 ${nb(`${V('A')}`)}(행은 지점, 열은 부품), 부품의 판매 가격과 원가를 각각 2×1 행렬 ${V('B')}, ${Vj('C', '으로/로')} 나타낼 때, 두 지점의 오늘 판매 이익을 나타내는 행렬 ${nb(`${V('A')}${V('B')} ${MINUS} ${V('A')}${V('C')}`)}를 구하시오.`, `${V('A')}${V('B')} ${MINUS} ${V('A')}${V('C')}`, Rm, {
          figure: t1 + t2, signed: false, rule: 'calc-profit',
          calc: [0, 1].map((i) => [`${A[i][0]}*${price[0]}+${A[i][1]}*${price[1]}-(${A[i][0]}*${cost[0]}+${A[i][1]}*${cost[1]})`]),
          explain: `${V('A')}${Vj('B', '의')} 성분은 지점마다의 판매 금액, ${V('A')}${Vj('C', '의')} 성분은 지점마다의 원가의 합이다. ${V('A')}${V('B')} = ${mat(mmul(A, Bm))}, ${V('A')}${V('C')} = ${mat(mmul(A, Cm))}이므로 판매 이익은 ${mat(Rm)}이다.`
        });
      }
      // 판매 가격·생산 비용(천 원) A = (가 나 / 가 나), 판매량 B(1월 2월) → C = AB
      const price = [d.int(3, 9), d.int(3, 9)], costv = price.map((p) => p - d.int(1, Math.min(3, p - 1)));
      const A = [price, costv], Bm = rm(d, 2, 2, 10, 90, true), Cm = mmul(A, Bm);
      const t1 = K.capt('[표 1]', table(['(단위: 천 원)', '(가)', '(나)'], [['판매 가격', String(price[0]), String(price[1])], ['생산 비용', String(costv[0]), String(costv[1])]]));
      const t2 = K.capt('[표 2]', table(['(단위: 개)', '1월', '2월'], [['(가)', String(Bm[0][0]), String(Bm[0][1])], ['(나)', String(Bm[1][0]), String(Bm[1][1])]]));
      const cs = (i, j) => `${A[i][0]}*${Bm[0][j]}+${A[i][1]}*${Bm[1][j]}`;
      const c = (i, j) => V('c') + `<sub>${i}${j}</sub>`;
      const rev = Cm[0][0] + Cm[0][1], cost2 = Cm[1][0] + Cm[1][1];
      return vals(`어느 가게에서 파는 두 샌드위치 (가), (나)의 판매 가격과 생산 비용은 표 1, 1월과 2월의 판매량은 표 2와 같다. 두 표를 각각 행렬 ${V('A')}, ${Vj('B', '으로/로')} 나타내고 ${nb(`${V('A')}${V('B')} = ${V('C')}`)}, ${Vj('C', '의')} (${V('i')}, ${V('j')}) 성분을 ${V('c')}<sub>${V('i')}${V('j')}</sub>라 할 때, 다음 값은? (단위: 천 원)`,
        [[nb(`${c(1, 1)} + ${c(1, 2)} =`), rev, `${cs(0, 0)}+${cs(0, 1)}`, false], [nb(`${c(2, 1)} + ${c(2, 2)} =`), cost2, `${cs(1, 0)}+${cs(1, 1)}`, false], ['두 달 동안의 순이익', rev - cost2, `${cs(0, 0)}+${cs(0, 1)}-(${cs(1, 0)}+${cs(1, 1)})`, false]], {
        figure: t1 + t2, rule: 'calc-sandwich',
        explain: `${c(1, 1)} + ${c(1, 2)}${tail(2, '은/는')} 1, 2월의 판매 금액의 합, ${c(2, 1)} + ${c(2, 2)}${tail(2, '은/는')} 생산 비용의 합이다. ${V('C')} = ${mat(Cm)}이므로 ${rev}, ${cost2}이고 순이익은 ${nb(`${rev} − ${cost2}`)} = ${nb(`${rev - cost2}`)}(천 원)이다.`
      });
    }, { count: 2 }),
    T('life-move', '이동 비율로 1년 뒤 인구', '②65', (d) => {
      const [c, nn, r1, r2] = d.until(() => [d.pick([40, 50, 60, 80, 100, 120]), d.pick([20, 40, 60]), d.pick([10, 20]), d.pick([5, 10, 25])], ([cc, n2, a, b]) => ((100 - a) * cc + b * n2) % 100 === 0 && (a * cc + (100 - b) * n2) % 100 === 0);
      const dec = (p) => String(p / 100), A = [[dec(100 - r1), dec(r2)], [dec(r1), dec(100 - r2)]];
      const Rm = [[((100 - r1) * c + r2 * nn) / 100], [(r1 * c + (100 - r2) * nn) / 100]];
      return matQ(`어느 시의 인구는 ${c}만 명, 이웃한 새 도시의 인구는 ${nn}만 명이다. 해마다 시 인구의 ${r1} %는 새 도시로, 새 도시 인구의 ${r2} %는 시로 옮겨 가고 나머지는 그대로 남는다. 인구의 이동 비율을 행렬 ${V('A')}, 지금의 인구를 행렬 ${Vj('B', '으로/로')} 나타낼 때, 1년 뒤 두 도시의 인구(단위: 만 명)를 나타내는 행렬 ${V('A')}${Vj('B', '을/를')} 구하시오. (단, 다른 곳과의 이동은 없다.)`, V('A') + V('B'), Rm, {
        figure: show(nm('A', A), nm('B', [[c], [nn]])), signed: false, calc: [[`((100-${r1})*${c}+${r2}*${nn})/100`], [`(${r1}*${c}+(100-${r2})*${nn})/100`]], unseen: [100],
        explain: `1년 뒤 시의 인구는 남은 ${100 - r1} %와 새 도시에서 온 ${r2} %를 더한 ${nb(`${dec(100 - r1)} × ${c} + ${dec(r2)} × ${nn}`)} = ${nb(`${Rm[0][0]}`)}, 새 도시의 인구는 ${nb(`${dec(r1)} × ${c} + ${dec(100 - r2)} × ${nn}`)} = ${nb(`${Rm[1][0]}`)}이므로 ${V('A')}${V('B')} = ${mat(Rm)}이다.`
      });
    }),
    T('life-code-mul', '곱셈으로 만든 암호', '②66', (d, n) => {
      const Xk = d.pick([[[1, 2], [2, 3]], [[2, 1], [1, 1]], [[1, 1], [1, 2]], [[3, 2], [1, 1]], [[2, 3], [1, 2]]]);
      const intro = `표와 같이 A부터 Z까지의 알파벳에 1부터 26까지의 자연수를 차례로 대응시키고, 네 글자 영어 낱말의 글자에 대응하는 수를 차례로 (1, 1), (1, 2), (2, 1), (2, 2) 성분으로 하는 행렬 ${V('A')}에 행렬 ${Vj('X', '을/를')} 곱한 행렬 ${V('A')}${Vj('X', '을/를')} 암호로 쓴다.`;
      const fig = letterTable() + show(nm('X', Xk));
      if (n === 0) {
        const w = d.pick(WORDS), A = wordMat(w), Rm = mmul(A, Xk);
        return matQ(`${intro} 낱말 ${w}의 암호를 구하시오.`, null, Rm, {
          figure: fig, calc: cMul(A, Xk), signed: false, rule: 'code-mul',
          explain: `${w}${pj(w, '은/는')} ${A.flat().join(', ')}에 대응하므로 ${V('A')} = ${mat(A)}이고 암호는 ${V('A')}${V('X')} = ${mat(Rm)}이다.`
        });
      }
      const words = d.shuffle(WORDS).slice(0, 4), w = words[0], A = wordMat(w), Rm = mmul(A, Xk);
      return pickOne(d, `${intro} 암호가 ${mat(Rm)}일 때, 원래 낱말은?`, words.map((x, i) => [x, i === 0]), {
        figure: fig,
        explain: `${V('A')} = ${mat([[V('a'), V('b')], [V('c'), V('d')]])}라 하면 ${V('A')}${V('X')} = ${mat(Rm)}에서 ${nb(`${poly([[Xk[0][0], V('a')], [Xk[1][0], V('b')]])}`)} = ${nb(`${Rm[0][0]}`)}, ${nb(`${poly([[Xk[0][1], V('a')], [Xk[1][1], V('b')]])}`)} = ${nb(`${Rm[0][1]}`)}${tail(Rm[0][1], '과/와')} ${nb(`${poly([[Xk[0][0], V('c')], [Xk[1][0], V('d')]])}`)} = ${nb(`${Rm[1][0]}`)}, ${nb(`${poly([[Xk[0][1], V('c')], [Xk[1][1], V('d')]])}`)} = ${nb(`${Rm[1][1]}`)}${tail(Rm[1][1], '을/를')} 연립하여 풀면 ${A.flat().join(', ')}이고, 이는 ${w.split('').join(', ')}이다.`
      });
    }, { count: 2 })
  ];

  // 연립방정식(풀이 글): 중괄호로 묶어 위아래로
  function sys2(a, b) { return B.kit.mid.sys([a, b]); }

  B.addGroup(UNIT, { id: 'mul', title: '행렬의 곱셈', standard: S2, types: mulTypes });
  B.addGroup(UNIT, { id: 'unitpow', title: '단위행렬, 거듭제곱과 섞인 계산', standard: S2, types: powTypes });
  B.addGroup(UNIT, { id: 'muleq', title: '곱셈이 낀 등식', standard: S2, types: mulEqTypes });
  B.addGroup(UNIT, { id: 'mullife', title: '행렬의 곱셈의 활용', standard: S2, types: mulLifeTypes });
  Object.assign(B.kit.m1018, { MV, prodLab });
})(typeof window !== 'undefined' ? window : globalThis);
