// 고등학교 1학년 공통수학1 Ⅳ-1 행렬과 그 연산 — 실력 문항.
// 이 단원에서 아이들이 흔히 잘못 아는 것:
//  - 행과 열을 바꾸어 읽는다(m×n 의 m 이 열의 개수라고 여긴다, (i, j) 성분을 j행 i열로 찾는다). b_ij = a_ji 를 a_ij 와 같은 자리로 본다.
//  - 두 행렬이 같을 조건에서 한 칸에서 얻은 값만 쓰고 나머지 칸을 맞춰 보지 않는다(이차식 칸의 두 근을 둘 다 답으로 남긴다).
//  - 곱 AB 는 앞 행렬의 열의 개수와 뒤 행렬의 행의 개수가 같아야 정의된다는 것을 잊고, 곱의 꼴(m×n)을 거꾸로 되짚지 못한다.
//  - 수의 곱처럼 AB = BA 로 여겨 (A + B)² = A² + 2AB + B², (A + B)(A − B) = A² − B² 을 그대로 쓴다.
//  - A² 이 단위행렬의 실수배이면 A³ 을 곧바로 줄일 수 있다는 것, A(kX) = kAX 로 이미 아는 곱을 다시 쓸 수 있다는 것을 알아채지 못한다.
//  - 실생활 표를 행렬로 옮길 때 곱하는 차례(어느 행과 어느 열이 짝인가)를 놓친다.
// 실력에 둔 것은 ① 상황·식의 장치 때문에 배운 뜻을 정확히 대야 풀리는 문제와 ② 세 단계 넘게 이어 생각해야 풀리는 문제뿐이다(10-1-8a.js 머리 주석의 기준).
// 이 단원은 심화 문서가 없어 모두 기본 문서의 꼴이다. 기본 문서에 한 번만 나오고 셈·판단을 넷 넘게 잇는 꼴, 뜻의 함정이 장치인 꼴을 실었다.
// 판단이 갈리는 것: ①33 은 원문이 2×3·3×2 행렬을 쓰지만(교육과정 밖의 곱) 행렬의 크기를 2 이하로 바꾸어 같은 일을 실었다. ①34 는 원문대로 두면 답이 늘 4 라
//  곱하는 행렬의 개수(3 또는 4)를 바꾸어 답이 달라지게 했다. ②58 은 원문 식(x² + 2mx + n = 0)이면 행렬이 늘 같아 식의 계수와 성분을 정하는 규칙(1·−1)을 바꾸어 실었다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, frac, lines, table, N, M, C, inline } = B.kit;
  const { MINUS, Q, nb, tail, V, sup, nz, poly, ansV, rt } = B.kit.mid;
  const K = B.kit.m1018;
  const { S2, UNIT, sn, pn, jn, nj, range, cf, pj, Vj, SQ, ent2, mat, matSlots, nm, show, rowsOf, madd, msub, msc, mmul, same, EYE, maxAbs, cMul, rm, matQ, vals, eqL, num1, pickOne, UNIT_E, UNIT_O, MV, prodLab } = K;
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const X = V('x'), Y = V('y'), Z = V('z'), Ee = V('E');
  const ord = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ'];

  // ②58: x² + αmx + βn = 0 의 근으로 정한 성분. 거듭제곱이 E 가 되는 것만 미리 골라 둔다.
  const DISC = [];
  for (const al of [1, 2, 3, 4]) for (const be of [-4, -3, -2, -1, 1, 2, 3, 4]) for (const sg of [1, -1]) {
    const A = [1, 2].map((m) => [1, 2].map((n) => { const D = al * al * m * m - 4 * be * n; return sg * (D > 0 ? 1 : D === 0 ? 0 : -1); }));
    let P = A, order = 0;
    for (let k = 1; k <= 12; k += 1) { if (same(P, EYE)) { order = k; break; } P = mmul(P, A); }
    if ([2, 3, 4, 6].includes(order)) DISC.push({ al, be, sg, A, order });
  }

  B.addGroup(UNIT, {
    id: 'hard', title: '단원 종합', standard: S2,
    types: [
      // ── ① 뜻을 정확히 대야 풀리는 문제 ──
      H('hard-allcells', '모든 칸을 다 맞추어야 하는 같을 조건', '①16', (d) => {
        // (1, 1) z² − xz = c0 의 두 근 zt, zf 가운데 (2, 1) z = z² + 2y 도 만족시키는 zt 만 답이다.
        const [zt, zf, m, t0] = d.until(() => [nz(d, -5, 5), nz(d, -5, 5), d.pick([2, 3, 4, 5]), nz(d, -5, 5)], ([a, b]) => a !== b && b !== 1 - a && a !== 1 && a + b !== 0 && Math.abs(a * b) <= 20);
        const x = zt + zf, c0 = -zt * zf, y = (zt * (1 - zt)) / 2;
        const A = [[poly([[1, Z + sup(2)], [-1, X + Z]]), m * x], [Z, y + t0]], Bm = [[c0, poly([[m, X]])], [poly([[1, Z + sup(2)], [2, Y]]), poly([[1, Y], [t0, '']])]];
        return vals(`두 행렬 ${V('A')}, ${Vj('B', '에')} 대하여 ${nb(`${V('A')} = ${V('B')}`)}를 만족시키는 실수 ${X}, ${Y}, ${Vj('z', '의')} 값은?`, [[eqL('x'), x, `${jn(m * x)}/${m}`], [eqL('y'), y, `${jn(y + t0)}-${jn(t0)}`], [eqL('z'), zt, null]], {
          figure: show(nm('A', A), nm('B', Bm)), check: { z: { first: [1, -x, -c0], second: [1, -1, 2 * y] } },
          explain: `(1, 2) 성분에서 ${nb(`${sn(m * x)}`)} = ${nb(`${m}${X}`)}이므로 ${X} = ${sn(x)}, (2, 2) 성분에서 ${nb(`${sn(y + t0)}`)} = ${nb(`${poly([[1, Y], [t0, '']])}`)}이므로 ${Y} = ${sn(y)}이다. (1, 1) 성분에서 ${nb(`${poly([[1, Z + sup(2)], [-x, Z]])}`)} = ${nb(`${sn(c0)}`)}, 곧 ${Z} = ${sn(zt)} 또는 ${Z} = ${sn(zf)}이다. (2, 1) 성분 ${nb(`${Z}`)} = ${nb(`${Z}${sup(2)} ${y < 0 ? MINUS : '+'} ${Math.abs(2 * y)}`)}에 넣어 보면 ${Z} = ${nj(zf, '은/는')} 맞지 않으므로 ${Z} = ${sn(zt)}이다.`
        });
      }),
      H('hard-shape-back', '곱의 꼴에서 행렬의 크기 되짚기', '①33', (d) => {
        // A 의 꼴과 (BA)C 의 꼴로 B, C 의 꼴을 되짚는다(행과 열의 개수는 2 이하로 바꾸었다).
        const [p, q] = d.pick([[1, 2], [2, 1]]), [r, s] = d.pick([[1, 1], [1, 2], [2, 1], [2, 2]]);
        const shape = { A: [p, q], B: [r, p], C: [q, s] }, ok = ([u, w]) => shape[u][1] === shape[w][0];
        const CAND = [['A', 'A'], ['B', 'B'], ['C', 'C'], ['A', 'B'], ['B', 'A'], ['A', 'C'], ['C', 'A'], ['B', 'C'], ['C', 'B']];
        const list = d.until(() => d.shuffle(CAND).slice(0, 6), (l) => { const c = l.filter(ok).length; return c >= 2 && c <= 5 && l.some((x) => x[0] === x[1]); });
        const cnt = list.filter(ok).length;
        return N(`세 행렬 ${V('A')}, ${V('B')}, ${Vj('C', '에')} 대하여 ${Vj('A', '은/는')} ${p}×${q} 행렬이고, ${nb(`(${V('B')}${V('A')})${V('C')}`)}는 ${r}×${s} 행렬이다. 다음 중 행렬의 곱이 정의되는 것의 개수는?`, cnt, {
          figure: show(list.map((x, i) => `${ord[i]}. ${prodLab(x)}`).join('&emsp;')), facts: { check: { shape, list, count: cnt } },
          explain: `${V('B')}${Vj('A', '이/가')} 정의되려면 ${Vj('B', '의')} 열의 개수가 ${p}, ${nb(`(${V('B')}${V('A')})${V('C')}`)}가 정의되려면 ${Vj('C', '의')} 행의 개수가 ${q}이다. 곱의 꼴이 ${r}×${s}이므로 ${Vj('B', '은/는')} ${r}×${p} 행렬, ${Vj('C', '은/는')} ${q}×${s} 행렬이다. 정의되는 것은 ${list.filter(ok).map(prodLab).join(', ')}이므로 ${cnt}개이다.`
        });
      }),
      H('hard-shape-count', '여러 행렬의 곱이 정해진 꼴일 때 가짓수', '①34', (d) => {
        const k = d.pick([3, 4]), [r, s] = d.pick([[1, 1], [1, 2], [2, 1], [2, 2]]), names = ['A', 'B', 'C', 'D'].slice(0, k), ans = 2 ** (k - 1);
        return N(`행과 열의 개수가 각각 2 이하인 ${k}개의 행렬 ${names.map(V).join(', ')}${pj(names[k - 1], '을/를')} 이 차례로 곱했더니 ${r}×${s} 행렬이 되었다. 행렬 ${names.map(V).join(', ')}의 꼴로 가능한 것은 모두 몇 가지인가?`, ans, {
          facts: { check: { k, shape: [r, s], count: ans } },
          explain: `${Vj('A', '의')} 행의 개수는 ${r}, ${Vj(names[k - 1], '의')} 열의 개수는 ${s}로 정해진다. 이웃한 두 행렬마다 앞 행렬의 열의 개수와 뒤 행렬의 행의 개수가 같아야 하고, 그런 자리 ${k - 1}곳이 저마다 1 또는 2일 수 있으므로 ${nb(`2${sup(k - 1)}`)} = ${nb(`${ans}`)}가지이다.`
        });
      }),
      H('hard-reuse', '주어진 곱으로 다른 곱 만들기', '②55', (d) => {
        // A X1 = k X2, A X2 = Y 이면 (A + A²) X1 = k X2 + k Y
        const [X1, X2, k] = d.until(() => [[[d.int(1, 4)], [d.int(1, 5)]], [[nz(d, -4, 4)], [nz(d, -4, 4)]], d.pick([2, 3, -2])], ([u, w]) => u[0][0] * w[1][0] - u[1][0] * w[0][0] !== 0);
        const V1 = msc(k, X2), Ym = rm(d, 2, 1, -6, 6), Rm = madd(V1, msc(k, Ym));
        return matQ(`2×2 행렬 ${Vj('A', '이/가')} 다음 두 등식을 만족시킬 때, 행렬 ${nb(`(${V('A')} + ${V('A')}${sup(2)})`)}${mat(X1)}의 두 성분을 구하시오.`, `(${V('A')} + ${V('A')}${sup(2)})${mat(X1)}`, Rm, {
          figure: rowsOf([`${V('A')}${mat(X1)} = ${mat(V1)}`, `${V('A')}${mat(X2)} = ${mat(Ym)}`]),
          calc: [0, 1].map((i) => [`${jn(V1[i][0])}+${jn(V1[0][0])}/${jn(X2[0][0])}*${jn(Ym[i][0])}`]), rule: 'reuse',
          explain: `${mat(V1)} = ${cf(k, mat(X2))}이므로 ${nb(`${V('A')}${sup(2)}${mat(X1)}`)} = ${nb(`${V('A')}${mat(V1)}`)} = ${nb(`${cf(k, V('A') + mat(X2))}`)} = ${mat(msc(k, Ym))}이다. 따라서 ${nb(`(${V('A')} + ${V('A')}${sup(2)})${mat(X1)}`)} = ${mat(V1)} + ${mat(msc(k, Ym))} = ${mat(Rm)}이다.`
        });
      }),
      H('hard-pow-eq', '거듭제곱이 낀 등식', '②56', (d, n) => {
        if (n === 0) {
          // A = (x m; nn y), A² + kE = O → y = −x, x² = −m·nn − k → x² + y² = 2x²
          const [x0, m, nn] = d.until(() => [d.int(1, 4), nz(d, -4, 4), nz(d, -4, 4)], ([a, b, c]) => -b * c - a * a !== 0 && Math.abs(b * c + a * a) <= 15);
          const k = -m * nn - x0 * x0;
          return N(`행렬 ${Vj('A', '이/가')} ${nb(`${V('A')}${sup(2)} ${k < 0 ? MINUS : '+'} ${cf(Math.abs(k), Ee)} = ${V('O')}`)}를 만족시킬 때, ${nb(`${X}${sup(2)} + ${Y}${sup(2)}`)}의 값은? (단, ${X}, ${Vj('y', '은/는')} 실수이고, ${Vj('E', '은/는')} 단위행렬, ${Vj('O', '은/는')} 영행렬이다.)`, 2 * x0 * x0, {
            figure: show(nm('A', [[X, m], [nn, Y]])), facts: { calc: [[`2*(0-${jn(m)}*${jn(nn)}-${jn(k)})`, 0]], unseen: [0, 2] },
            explain: `${V('A')}${sup(2)} = ${mat([[nb(`${X}${sup(2)} ${m * nn < 0 ? MINUS : '+'} ${Math.abs(m * nn)}`), nb(`${sn(m)}(${X} + ${Y})`)], [nb(`${sn(nn)}(${X} + ${Y})`), nb(`${Y}${sup(2)} ${m * nn < 0 ? MINUS : '+'} ${Math.abs(m * nn)}`)]])}이다. 영행렬이 되려면 ${nb(`${X} + ${Y}`)} = ${nb(`0`)}, ${nb(`${X}${sup(2)}`)} = ${nb(`${Y}${sup(2)}`)} = ${nb(`${x0 * x0}`)}이므로 ${X} = ±${x0}, ${Y} = ∓${x0}이고 어느 쪽이든 ${nb(`${X}${sup(2)} + ${Y}${sup(2)}`)} = ${nb(`${2 * x0 * x0}`)}이다.`
          });
        }
        // A = (a b; k −a), A³ = O: A² = (a² + bk)E 이므로 A³ = (a² + bk)A
        const a = nz(d, -4, 4), b = d.pick(range(1, a * a).filter((t) => (a * a) % t === 0)) * d.pick([1, -1]), k = -(a * a) / b;
        return num1(`행렬 ${Vj('A', '이/가')} ${nb(`${V('A')}${sup(3)} = ${V('O')}`)}를 만족시킬 때, 실수 ${Vj('k', '의')} 값은?${UNIT_O}`, k, {
          figure: show(nm('A', [[a, b], [V('k'), -a]])), calc: `(0-${jn(a)}*${jn(a)})/${jn(b)}`, unseen: [0], rule: 'pow-cube',
          explain: `${V('A')}${sup(2)} = ${mat([[nb(`${a * a} ${b < 0 ? MINUS : '+'} ${cf(Math.abs(b), V('k'))}`), 0], [0, nb(`${a * a} ${b < 0 ? MINUS : '+'} ${cf(Math.abs(b), V('k'))}`)]])} = ${nb(`(${a * a} ${b < 0 ? MINUS : '+'} ${cf(Math.abs(b), V('k'))})${Ee}`)}이므로 ${nb(`${V('A')}${sup(3)}`)} = ${nb(`(${a * a} ${b < 0 ? MINUS : '+'} ${cf(Math.abs(b), V('k'))})${V('A')}`)}이다. ${Vj('A', '은/는')} 영행렬이 아니므로 ${nb(`${a * a} ${b < 0 ? MINUS : '+'} ${cf(Math.abs(b), V('k'))}`)} = ${nb(`0`)}, ${V('k')} = ${sn(k)}이다.`
        });
      }, { count: 2 }),
      H('hard-formula', '곱셈 공식이 행렬에서 성립하는가', '②59', (d, n) => {
        if (n === 0) {
          const [A, Bm] = d.until(() => [rm(d, 2, 2, -3, 3, true), rm(d, 2, 2, -3, 3, true)], ([u, w]) => !same(mmul(u, w), mmul(w, u)));
          const AB = mmul(A, Bm), BA = mmul(Bm, A), Rm = msub(BA, AB), cAB = cMul(A, Bm), cBA = cMul(Bm, A);
          return matQ(`두 행렬 ${V('A')}, ${Vj('B', '에')} 대하여 ${nb(`(${V('A')} + ${V('B')})${sup(2)} ${MINUS} (${V('A')}${sup(2)} + 2${V('A')}${V('B')} + ${V('B')}${sup(2)})`)}${SQ('을/를')} 구하시오.`, null, Rm, {
            figure: show(nm('A', A), nm('B', Bm)), calc: cBA.map((r, i) => r.map((s, j) => `${s}-(${cAB[i][j]})`)), rule: 'formula-square',
            explain: `${nb(`(${V('A')} + ${V('B')})${sup(2)}`)}${SQ('을/를')} 셈하면 ${nb(`${V('A')}${sup(2)} + ${V('A')}${V('B')} + ${V('B')}${V('A')} + ${V('B')}${sup(2)}`)}${SQ('과/와')} 같으므로 주어진 식은 ${nb(`${V('B')}${V('A')} ${MINUS} ${V('A')}${V('B')}`)}이다. ${V('A')}${V('B')} = ${mat(AB)}, ${V('B')}${V('A')} = ${mat(BA)}이므로 ${mat(Rm)}이다. ${V('A')}${V('B')}${pj('B', '과/와')} ${V('B')}${Vj('A', '이/가')} 다르면 수에서처럼 0이 되지 않는다.`
          });
        }
        // (A + B)(A − B) = A² − B² ⇔ AB = BA: A = (a11 a; a21 a22), B = (b11 b12; b b22), B = αE + βA 꼴
        const [A0, al, be] = d.until(() => [rm(d, 2, 2, -4, 4), d.int(-3, 3), d.pick([1, -1, 2, -2])], ([u]) => u[0][0] !== u[1][1]);
        const a = A0[0][1], b11 = al + be * A0[0][0], b12 = be * a, b = be * A0[1][0], b22 = al + be * A0[1][1];
        return vals(`두 행렬 ${V('A')}, ${Vj('B', '에')} 대하여 ${nb(`(${V('A')} + ${V('B')})(${V('A')} ${MINUS} ${V('B')}) = ${V('A')}${sup(2)} ${MINUS} ${V('B')}${sup(2)}`)}${SQ('이/가')} 성립할 때, 실수 ${V('a')}, ${Vj('b', '의')} 값은?`, [[eqL('a'), a, `${jn(b12)}*(${jn(A0[1][1])}-${jn(A0[0][0])})/(${jn(b22)}-${jn(b11)})`], [eqL('b'), b, `${jn(A0[1][0])}*(${jn(b22)}-${jn(b11)})/(${jn(A0[1][1])}-${jn(A0[0][0])})`]], {
          figure: show(nm('A', [[A0[0][0], V('a')], [A0[1][0], A0[1][1]]]), nm('B', [[b11, b12], [V('b'), b22]])), rule: 'formula-diff',
          explain: `좌변을 셈하면 ${nb(`${V('A')}${sup(2)} ${MINUS} ${V('A')}${V('B')} + ${V('B')}${V('A')} ${MINUS} ${V('B')}${sup(2)}`)}${SQ('과/와')} 같으므로 주어진 등식은 ${nb(`${V('A')}${V('B')}`)} = ${nb(`${V('B')}${V('A')}`)}와 같다. (1, 2) 성분을 비교하면 ${nb(`${pn(A0[0][0])} × ${pn(b12)} + ${V('a')} × ${pn(b22)}`)} = ${nb(`${pn(b11)}${V('a')} + ${pn(b12)} × ${pn(A0[1][1])}`)}에서 ${V('a')} = ${sn(a)}, (2, 1) 성분을 비교하면 ${nb(`${pn(A0[1][0])} × ${pn(b11)} + ${pn(A0[1][1])}${V('b')}`)} = ${nb(`${V('b')} × ${pn(A0[0][0])} + ${pn(b22)} × ${pn(A0[1][0])}`)}에서 ${V('b')} = ${sn(b)}이다.`
        });
      }, { count: 2 }),
      // ── ② 세 단계 넘게 이어 생각해야 풀리는 문제 ──
      H('hard-days', '가동 일수로 생산량 맞추기', '①31', (d) => {
        const [A, Bm, a, b] = d.until(() => [rm(d, 2, 2, 10, 70, true), rm(d, 2, 2, 10, 70, true), d.int(2, 6), d.int(2, 6)], ([u, w]) => u[0][0] * w[1][1] - w[0][0] * u[1][1] !== 0);
        const T1 = a * A[0][0] + b * Bm[0][0], T2 = a * A[1][1] + b * Bm[1][1], ans = a * A[0][1] + b * Bm[0][1];
        const det = `(${A[0][0]}*${Bm[1][1]}-${Bm[0][0]}*${A[1][1]})`;
        const t = (Mx, nmv) => K.capt(nmv, table(['(단위: 개)', '밀가루', '메밀가루'], [['1 kg짜리', String(Mx[0][0]), String(Mx[0][1])], ['500 g짜리', String(Mx[1][0]), String(Mx[1][1])]]));
        return N(`어느 제면소의 두 생산 라인 A, B가 하루 동안 만드는 1 kg짜리와 500 g짜리 밀가루와 메밀가루의 개수가 표와 같다. 지난주에 생산 라인 A는 ${V('a')}일, B는 ${V('b')}일 가동하여 1 kg짜리 밀가루를 ${T1}개, 500 g짜리 메밀가루를 ${T2}개 만들었다. 지난주에 만든 1 kg짜리 메밀가루는 몇 개인가?`, ans, {
          figure: t(A, '생산 라인 A') + t(Bm, '생산 라인 B'),
          facts: { calc: [[`((${T1}*${Bm[1][1]}-${Bm[0][0]}*${T2})/${det})*${A[0][1]}+((${A[0][0]}*${T2}-${A[1][1]}*${T1})/${det})*${Bm[0][1]}`, 0]] },
          explain: `두 표를 행렬 ${V('P')}, ${Vj('Q', '으로/로')} 나타내면 지난주 생산량은 ${nb(`${V('a')}${V('P')} + ${V('b')}${V('Q')}`)}이다. (1, 1) 성분과 (2, 2) 성분에서 ${nb(`${A[0][0]}${V('a')} + ${Bm[0][0]}${V('b')}`)} = ${nb(`${T1}`)}, ${nb(`${A[1][1]}${V('a')} + ${Bm[1][1]}${V('b')}`)} = ${nb(`${T2}`)}이므로 ${V('a')} = ${a}, ${V('b')} = ${b}이다. (1, 2) 성분은 ${nb(`${A[0][1]} × ${a} + ${Bm[0][1]} × ${b}`)} = ${nb(`${ans}`)}이다.`
        });
      }),
      H('hard-abc-min', '세 행렬의 곱의 최솟값', '①46', (d) => {
        const [p, q, b12, b21, b22] = d.until(() => [nz(d, -4, 4), nz(d, -4, 4), d.int(-3, 3), nz(d, -5, 5), nz(d, -3, 3)], ([pp, qq, u, w]) => { const L = pp * w + qq * u; return L !== 0 && L % 2 === 0 && Math.abs(L) <= 14; });
        const L = p * b21 + q * b12, cst = p * q * b22, a = -L / 2, m = cst - (L * L) / 4;
        const Ls = `(${jn(p)}*${jn(b21)}+${jn(q)}*${jn(b12)})`;
        return vals(`세 행렬 ${V('A')}, ${V('B')}, ${Vj('C', '에')} 대하여 행렬 ${V('A')}${V('B')}${Vj('C', '의')} 성분은 ${nb(`${X} = ${V('a')}`)}일 때 최솟값 ${Vj('m', '을/를')} 갖는다. 실수 ${V('a')}, ${Vj('m', '의')} 값은?`, [[eqL('a'), a, `(0-${Ls})/2`], [eqL('m'), m, `${jn(p)}*${jn(q)}*${jn(b22)}-${Ls}*${Ls}/4`]], {
          figure: show(nm('A', [[X, p]]), nm('B', [[1, b12], [b21, b22]]), nm('C', [[X], [q]])), unseen: [0, 2, 4],
          explain: `${V('A')}${V('B')} = ${mat([[poly([[1, X], [p * b21, '']]), poly([[b12, X], [p * b22, '']])]])}이므로 ${V('A')}${V('B')}${V('C')} = ${mat([[poly([[1, X + sup(2)], [L, X], [cst, '']])]])}이다. ${nb(`${poly([[1, X + sup(2)], [L, X], [cst, '']])}`)} = ${nb(`(${poly([[1, X], [-a, '']])})${sup(2)} ${m < 0 ? MINUS : '+'} ${Math.abs(m)}`)}이므로 ${X} = ${sn(a)}일 때 최솟값 ${nj(m, '을/를')} 갖는다.`
        });
      }),
      H('hard-two-products', '곱의 등식으로 행렬을 구해 다른 곱', '②53', (d, n) => {
        if (n === 0) {
          const [A, a, b, c, dd] = d.until(() => [rm(d, 2, 2, -4, 4), nz(d, -4, 4), nz(d, -4, 4), nz(d, -4, 4), nz(d, -4, 4)], ([M0]) => M0[0][0] * M0[1][1] - M0[0][1] * M0[1][0] !== 0);
          const AB = mmul(A, [[a], [b]]), CA = mmul([[c, dd]], A), Rm = mmul([[a], [b]], [[c, dd]]);
          const det = `(${jn(A[0][0])}*${jn(A[1][1])}-${jn(A[0][1])}*${jn(A[1][0])})`, [u, v] = [AB[0][0], AB[1][0]], [w, z] = CA[0];
          const sa = `((${jn(u)}*${jn(A[1][1])}-${jn(A[0][1])}*${jn(v)})/${det})`, sb = `((${jn(A[0][0])}*${jn(v)}-${jn(A[1][0])}*${jn(u)})/${det})`;
          const sc = `((${jn(w)}*${jn(A[1][1])}-${jn(z)}*${jn(A[1][0])})/${det})`, sd = `((${jn(z)}*${jn(A[0][0])}-${jn(w)}*${jn(A[0][1])})/${det})`;
          return matQ(`세 행렬 ${V('A')}, ${V('B')}, ${Vj('C', '이/가')} 다음을 만족시킬 때, 행렬 ${V('B')}${Vj('C', '을/를')} 구하시오.`, V('B') + V('C'), Rm, {
            figure: rowsOf([`${nm('A', A)}, ${nm('B', [[V('a')], [V('b')]])}, ${nm('C', [[V('c'), V('d')]])}`, `${V('A')}${V('B')} = ${mat(AB)}, ${V('C')}${V('A')} = ${mat(CA)}`]),
            calc: [[`${sa}*${sc}`, `${sa}*${sd}`], [`${sb}*${sc}`, `${sb}*${sd}`]], rule: 'two-bc',
            explain: `${V('A')}${V('B')} = ${mat(AB)}에서 연립하면 ${V('a')} = ${sn(a)}, ${V('b')} = ${sn(b)}이고, ${V('C')}${V('A')} = ${mat(CA)}에서 ${V('c')} = ${sn(c)}, ${V('d')} = ${sn(dd)}이다. 따라서 ${V('B')}${V('C')} = ${MV([[a], [b]], [[c, dd]])} = ${mat(Rm)}이다.`
          });
        }
        const [Bm, a, b, c, dd] = d.until(() => [rm(d, 2, 2, -4, 4), nz(d, -4, 4), nz(d, -4, 4), nz(d, -4, 4), nz(d, -4, 4)], ([M0]) => M0[0][0] * M0[1][1] - M0[0][1] * M0[1][0] !== 0);
        const AB = mmul([[a, b]], Bm), BC = mmul(Bm, [[c], [dd]]), Rm = [[a * c + b * dd]];
        const det = `(${jn(Bm[0][0])}*${jn(Bm[1][1])}-${jn(Bm[0][1])}*${jn(Bm[1][0])})`, [u, v] = AB[0], [w, z] = [BC[0][0], BC[1][0]];
        const sa = `((${jn(u)}*${jn(Bm[1][1])}-${jn(v)}*${jn(Bm[1][0])})/${det})`, sb = `((${jn(v)}*${jn(Bm[0][0])}-${jn(u)}*${jn(Bm[0][1])})/${det})`;
        const sc = `((${jn(w)}*${jn(Bm[1][1])}-${jn(Bm[0][1])}*${jn(z)})/${det})`, sd = `((${jn(Bm[0][0])}*${jn(z)}-${jn(Bm[1][0])}*${jn(w)})/${det})`;
        return matQ(`세 행렬 ${V('A')}, ${V('B')}, ${Vj('C', '이/가')} 다음을 만족시킬 때, 행렬 ${V('A')}${Vj('C', '을/를')} 구하시오.`, V('A') + V('C'), Rm, {
          figure: rowsOf([`${nm('A', [[V('a'), V('b')]])}, ${nm('B', Bm)}, ${nm('C', [[V('c')], [V('d')]])}`, `${V('A')}${V('B')} = ${mat(AB)}, ${V('B')}${V('C')} = ${mat(BC)}`]),
          calc: [[`${sa}*${sc}+${sb}*${sd}`]], rule: 'two-ac',
          explain: `${V('A')}${V('B')} = ${mat(AB)}에서 연립하면 ${V('a')} = ${sn(a)}, ${V('b')} = ${sn(b)}이고, ${V('B')}${V('C')} = ${mat(BC)}에서 ${V('c')} = ${sn(c)}, ${V('d')} = ${sn(dd)}이다. 따라서 ${V('A')}${V('C')} = ${MV([[a, b]], [[c], [dd]])} = ${mat(Rm)}이다.`
        });
      }, { count: 2 }),
      H('hard-disc-pow', '판별식으로 성분을 정한 행렬의 거듭제곱', '②58', (d) => {
        const c = d.pick(DISC), m = V('m'), n = V('n'), amn = V('a') + '<sub>' + m + n + '</sub>';
        const rule = c.sg > 0 ? ['1', '0', MINUS + '1'] : [MINUS + '1', '0', '1'];
        const eq = poly([[1, X + sup(2)], [c.al, m + X], [c.be, n]]);
        let k = 0; const slots = c.A.map((r) => r.map(() => '{' + (k++) + '}'));
        const template = nb(V('A') + ' =') + ' ' + matSlots(slots) + '&emsp;' + nb(`${V('k')}의 최솟값: {4}`);
        const P = [c.A]; while (!same(P[P.length - 1], EYE)) P.push(mmul(P[P.length - 1], c.A));
        return inline(`2×2 행렬 ${Vj('A', '의')} (${m}, ${n}) 성분 ${amn}${pj('n', '을/를')} ${X}에 대한 이차방정식 ${nb(`${eq} = 0`)}이 서로 다른 두 실근을 가지면 ${rule[0]}, 중근을 가지면 ${rule[1]}, 허근을 가지면 ${rule[2]}로 정한다. 행렬 ${V('A')}${pj('A', '과/와')} ${nb(`${V('A')}${sup(V('k'))} = ${Ee}`)}를 만족시키는 자연수 ${Vj('k', '의')} 최솟값을 구하시오.${UNIT_E}`,
          template, c.A.flat().map((v) => ({ answer: v, signed: true })).concat([{ answer: c.order }]), {
            shown: `${V('A')} = ${mat(c.A)}, ${V('k')}의 최솟값 ${c.order}`, facts: { check: { disc: [c.al, c.be, c.sg], A: c.A, order: c.order } },
            explain: `판별식의 부호를 (${m}, ${n}) = (1, 1), (1, 2), (2, 1), (2, 2)마다 따지면 ${V('A')} = ${mat(c.A)}이다. ${P.slice(1).map((Pk, i) => `${V('A')}${sup(i + 2)} = ${mat(Pk)}`).join(', ')}이므로 처음으로 ${Ee}가 되는 ${V('k')}${pj('k', '은/는')} ${c.order}이다.`
          });
      }),
      H('hard-ke-max', '영행렬과 단위행렬의 실수배 조건에서 최댓값', '②60', (d) => {
        const p = d.int(1, 4), s = d.pick([3, 5, 7, 9]);
        const A = [[p, V('a')], [V('b'), -p]], Bm = [[-p, poly([[1, V('b')], [-s, '']])], [poly([[1, V('a')], [-s, '']]), p]];
        return ansV(`두 행렬 ${V('A')}, ${Vj('B', '에')} 대하여 ${nb(`${V('A')} + ${V('B')} = ${V('O')}`)}이고 ${nb(`${V('A')}${sup(2)} = ${V('k')}${Ee}`)}일 때, 실수 ${Vj('k', '의')} 최댓값은? (단, ${V('a')}, ${Vj('b', '은/는')} 실수이고, ${Vj('O', '은/는')} 영행렬, ${Vj('E', '은/는')} 단위행렬이다.)`, Q(4 * p * p + s * s, 4), 'frac', {
          figure: show(nm('A', A), nm('B', Bm)), facts: { value: `${p}*${p}+${s}*${s}/4`, unseen: [4] },
          explain: `${nb(`${V('A')} + ${V('B')}`)} = ${mat([[0, poly([[1, V('a')], [1, V('b')], [-s, '']])], [poly([[1, V('a')], [1, V('b')], [-s, '']]), 0]])} = ${V('O')}에서 ${nb(`${V('b')}`)} = ${nb(`${s} − ${V('a')}`)}이다. ${V('A')}${sup(2)} = ${nb(`(${p * p} + ${V('a')}${V('b')})${Ee}`)}이므로 ${nb(`${V('k')}`)} = ${nb(`${p * p} + ${V('a')}(${s} − ${V('a')})`)} = ${nb(`−(${V('a')} − ${frac(s, 2)})${sup(2)} + ${frac(4 * p * p + s * s, 4)}`)}이고, 최댓값은 ${V('a')} = ${frac(s, 2)}일 때 ${frac(4 * p * p + s * s, 4)}이다.`
        });
      }),
      H('hard-shop-back', '실생활 곱에서 모르는 개수 되짚기', '②64', (d) => {
        const [who1, who2] = d.shuffle(NAMES).slice(0, 2);
        const [g1, h1, g2, h2, x0, dl, c1, y0] = d.until(() => [d.int(5, 12) * 100, d.int(6, 16) * 50, d.int(5, 12) * 100, d.int(6, 16) * 50, d.int(4, 9), d.int(1, 3), d.int(2, 6), d.int(2, 9)], ([a, b, c, e, x, l, k, y]) => x - l >= 1 && (a * (x - l) + b * y) !== (a * x + b * k) && c * (x - l) + e * y <= 9999 && (a !== c || b !== e));
        const T1 = g1 * x0 + h1 * c1, T2 = g1 * (x0 - dl) + h1 * y0, D = T2 - T1, ans = g2 * (x0 - dl) + h2 * y0;
        const t1 = K.capt('[표 1]', table(['(단위: 원)', '샤프', '형광펜'], [['문구점 P', String(g1), String(h1)], ['문구점 Q', String(g2), String(h2)]]));
        const t2 = K.capt('[표 2]', table(['(단위: 개)', who1, who2], [['샤프', X, poly([[1, X], [-dl, '']])], ['형광펜', String(c1), Y]]));
        const xs = `((${T1}-${h1}*${c1})/${g1})`, ys = `((${T1}${D > 0 ? '+' : '-'}${Math.abs(D)}-${g1}*(${xs}-${dl}))/${h1})`;
        return N(`두 문구점 P, Q의 샤프와 형광펜 한 개의 값은 표 1, ${name(who1, '과/와')} ${name(who2, '이/가')} 사려는 개수는 표 2와 같다. ${name(who1, '이/가')} 문구점 P에서 내야 하는 돈은 ${T1}원이고, 이는 ${name(who2, '이/가')} 문구점 P에서 내야 하는 돈보다 ${Math.abs(D)}원 ${D > 0 ? '적다' : '많다'}. ${name(who2, '이/가')} 문구점 Q에서 샤프와 형광펜을 살 때 내야 하는 돈은 몇 원인가?`, ans, {
          figure: t1 + t2, facts: { calc: [[`${g2}*(${xs}-${dl})+${h2}*${ys}`, 0]] },
          explain: `표 1, 표 2를 행렬로 나타낸 곱의 (1, 1) 성분이 ${name(who1, '이/가')} P에서 낼 돈이므로 ${nb(`${g1}${X} + ${h1} × ${c1}`)} = ${nb(`${T1}`)}, ${X} = ${x0}이다. (1, 2) 성분에서 ${nb(`${g1}(${x0} − ${dl}) + ${h1}${Y}`)} = ${nb(`${T2}`)}이므로 ${Y} = ${y0}이다. 구하는 돈은 (2, 2) 성분 ${nb(`${g2} × ${x0 - dl} + ${h2} × ${y0}`)} = ${nb(`${ans}`)}(원)이다.`
        });
      }),
      H('hard-complex-pow', '복소수 조건과 거듭제곱의 성분의 합', '②69', (d) => {
        const s = nz(d, -5, 5), t = d.int(1, 6), v = s * s + 2 * t + 2 - 2 * s, zz = (k) => V('z') + '<sub>' + k + '</sub>';
        return N(`두 실수 ${X}, ${Vj('y', '에')} 대하여 두 복소수 ${nb(`${zz(1)} = ${poly([[1, X], [1, Y], [s, '']])} + ${X}${Y}${V('i')}`)}, ${nb(`${zz(2)} = ${X} + (${poly([[1, X + Y], [t, '']])})${V('i')}`)}가 있다. ${zz(1)}${sup(2)}이 음의 실수이고 ${zz(2)}${sup(2)}이 양의 실수일 때, 행렬 ${V('A')}${pj('A', '에')} 대하여 행렬 ${V('A')}${sup(2)}의 모든 성분의 합은? (단, ${nb(`${V('i')} = ${rt(MINUS + '1')}`)}이다.)`, v, {
          figure: show(nm('A', [[X, 1], [1, Y]])), facts: { calc: [[`${jn(s)}*${jn(s)}+2*${t}+2-2*${jn(s)}`, 0]], unseen: [2] },
          explain: `${zz(1)}${sup(2)}이 음의 실수이면 ${zz(1)}${tail(1, '은/는')} 0이 아닌 순허수이므로 ${nb(`${X} + ${Y}`)} = ${nb(`${sn(-s)}`)}, ${nb(`${X}${Y} ≠ 0`)}이다. ${zz(2)}${sup(2)}이 양의 실수이면 ${zz(2)}${tail(2, '은/는')} 0이 아닌 실수이므로 ${nb(`${X}${Y}`)} = ${nb(`${sn(-t)}`)}이다. ${V('A')}${sup(2)} = ${mat([[nb(`${X}${sup(2)} + 1`), nb(`${X} + ${Y}`)], [nb(`${X} + ${Y}`), nb(`${Y}${sup(2)} + 1`)]])}이므로 합은 ${nb(`(${X} + ${Y})${sup(2)} − 2${X}${Y} + 2(${X} + ${Y}) + 2`)} = ${nb(`${v}`)}이다.`
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
