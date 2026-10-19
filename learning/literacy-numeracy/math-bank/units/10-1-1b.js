// 10-1-1 다항식의 연산 — 뒤쪽 묶음(곱셈 공식, 곱셈 공식의 변형, 다항식의 나눗셈). 틀과 식 글 도구는 10-1-1a.js(B.kit.m1011)에 있다.
// 싣는 기준과 뺀 것은 10-1-1a.js 머리에 모아 적었다.
//  - 곱셈 공식은 고등학교에서 더한 세 꼴 (a + b + c)², (a ± b)³, (a ± b)(a² ∓ ab + b²)과 그것을 잇달아 쓰는 꼴만 싣는다(중3 다섯 꼴은 9-1-3).
//  - 곱셈 공식의 변형은 세제곱의 합·차, 세 문자, 근호가 든 수, a와 1/a 처럼 고등학교 공식이 드는 것만 싣는다(x² + y² = (x + y)² − 2xy 하나로 끝나는 것은 9-1-3).
//  - 다항식의 나눗셈은 직접 나누는 세로셈으로 몫과 나머지를 구한다. 조립제법·나머지정리는 쓰지 않는다(다음 단원).
//    나누는 식이나 나뉠 식에 문자가 든 꼴(②27·②28)도 문자가 든 채로 나누어 나머지를 맞추면 풀린다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, N, M, C, inline } = B.kit;
  const { MINUS, gcd, Q, qadd, qsub, qmul, qdiv, qneg, qabs, isInt, mag, tx, nb, V, sup, ex, nz, asQ, poly, linAns, radAns, rt, sqParts, ansV } = B.kit.mid;
  const {
    UNIT, T, term, keyOf, pAdd, pNeg, pSub, pMul, pDivNum, num, valX, xv, same, coefOf, termOf, ordered, pDiv,
    ph, pt, htmlX, xh, xe, xex, ej, xj, pj, pn, pc, sg, srcOf, fresh, nzs, hasKeys, intCoefs, polyA, divAns, numQ1, slots, pickQ, jn, jd, sd, INK, svg, word
  } = B.kit.m1011;
  const EXPAND = '다음 식을 전개하시오.', DIVIDE = '다음 나눗셈의 몫과 나머지를 구하시오.';
  const Xv = V('x'), Yv = V('y'), va = V('a'), vb = V('b');
  const X2 = Xv + sup(2), X3 = Xv + sup(3);
  // 근호가 든 수의 글: rad(2, 3) → 2√3, rad(1, 5) → √5
  const rad = (q, m) => (q === 1 ? '' : String(q)) + rt(m);
  const isSqf = (m) => m >= 2 && sqParts(m)[0] === 1;

  // ════════════════════════════════════════════════════════════════
  // ── 곱셈 공식 ──
  const FORMULA_ABC = nb(`(${va} + ${vb} + ${V('c')})${sup(2)} = ${va}${sup(2)} + ${vb}${sup(2)} + ${V('c')}${sup(2)} + 2${va}${vb} + 2${vb}${V('c')} + 2${V('c')}${va}`);
  const FORMULA_CUBE = nb(`(${va} ± ${vb})${sup(3)} = ${va}${sup(3)} ± 3${va}${sup(2)}${vb} + 3${va}${vb}${sup(2)} ± ${vb}${sup(3)}`);
  const FORMULA_SUM = nb(`(${va} ± ${vb})(${va}${sup(2)} ∓ ${va}${vb} + ${vb}${sup(2)}) = ${va}${sup(3)} ± ${vb}${sup(3)}`);
  const formulaTypes = [
    T('formula-abc', '(a + b + c)²의 전개', '①25', (d, n) => {
      if (n === 0) {
        const [a, b, c] = [d.int(1, 3), nz(d, -3, 3), nz(d, -4, 4)];
        if (b > 0 && c > 0) return null;
        const src = `(${pn([[a, 'x'], [b, 'y'], [c, 'z']])})^2`, R = xv(src), keys = ['x^2', 'xy', 'xz', 'y^2', 'yz', 'z^2'];
        if (!hasKeys(R, keys)) return null;
        return polyA(EXPAND, R, keys, { figure: xex(src), rule: 'abc-xyz', explain: `곱셈 공식 ${ej(FORMULA_ABC, '을/를')} 이용한다. 세 항을 각각 제곱한 것과 두 항씩 곱해 2배 한 것을 모두 더하면 ${xh(src)} = ${ph(R)}이다.` });
      }
      // 상수항이 낀 꼴: (pa + qb + r)²
      const [a, b, c] = [d.int(1, 3), nz(d, -3, 3), nz(d, -5, 5)];
      const src = `(${pn([[a, 'a'], [b, 'b'], [c, '']])})^2`, R = xv(src), keys = ['a^2', 'ab', 'b^2', 'a', 'b', ''];
      if (!hasKeys(R, keys)) return null;
      return polyA(EXPAND, R, keys, { figure: xex(src), rule: 'abc-const', explain: `상수항도 한 항으로 보고 곱셈 공식 ${ej(FORMULA_ABC, '을/를')} 이용한다. ${xh(src)} = ${ph(R)}이다.` });
    }, { count: 2 }),
    T('formula-cube', '(a ± b)³의 전개', '①26', (d, n) => {
      if (n === 0) {
        const src = `(${pc([d.int(1, 4), nz(d, -5, 5)])})^3`, R = xv(src);
        if (!hasKeys(R, ['x^3', 'x^2', 'x', ''])) return null;
        return polyA(EXPAND, R, ['x^3', 'x^2', 'x', ''], { figure: xex(src), rule: 'cube-one', explain: `곱셈 공식 ${FORMULA_CUBE}(복부호 같은 차례)을 이용한다. ${xh(src)} = ${ph(R)}이다.` });
      }
      const src = `(${pn([[d.int(1, 3), 'x'], [nz(d, -3, 3), 'y']])})^3`, R = xv(src), keys = ['x^3', 'x^2y', 'xy^2', 'y^3'];
      return polyA(EXPAND, R, keys, { figure: xex(src), rule: 'cube-two', explain: `곱셈 공식 ${FORMULA_CUBE}(복부호 같은 차례)을 이용한다. ${xh(src)} = ${ph(R)}이다.` });
    }, { count: 2 }),
    T('formula-sum-cubes', '(a ± b)(a² ∓ ab + b²)의 전개', '①27', (d, n) => {
      const a = d.int(1, 3), b = d.int(1, 4), s = d.pick([1, -1]), y = n === 0 ? '' : 'y';
      const src = `(${pn([[a, 'x'], [s * b, y]])})(${pn([[a * a, 'x^2'], [-s * a * b, 'x' + y], [b * b, y ? 'y^2' : '']])})`, R = xv(src), keys = n === 0 ? ['x^3', ''] : ['x^3', 'y^3'];
      if (!hasKeys(R, keys)) return null;
      return polyA(EXPAND, R, keys, { figure: xex(src), rule: 'sumcube-' + n, explain: `둘째 괄호가 (첫째 항)² ${s > 0 ? MINUS : '+'} (첫째 항)(둘째 항) + (둘째 항)²의 꼴이므로 곱셈 공식 ${FORMULA_SUM}(복부호 같은 차례)을 이용한다. ${xh(src)} = ${ph(R)}이다.` });
    }, { count: 2 }),
    T('formula-steps', '곱셈 공식을 끌어내는 계산 과정의 빈칸', '①28', (d) => {
      const k = d.int(2, 4) * d.pick([1, -1]), A = V('a'), Bv = V('b'), src = `(a${k < 0 ? '-' : '+'}${Math.abs(k)}b)^3`;
      const template = `${xh(src)} = ${A}${sup(3)} + 3 × ${A}${sup(2)} × {0}${Bv} + 3 × ${A} × ({1}${Bv})${sup(2)} + ({2}${Bv})${sup(3)} = ${A}${sup(3)} {3}${A}${sup(2)}${Bv} {4}${A}${Bv}${sup(2)} {5}${Bv}${sup(3)}`;
      const R = xv(src), c2 = coefOf(R, { a: 2, b: 1 }).p, c1 = coefOf(R, { a: 1, b: 2 }).p, c0 = coefOf(R, { b: 3 }).p;
      const kS = jn(k);
      return inline(`다음은 곱셈 공식을 이용하여 ${xj(src, '을/를')} 전개하는 과정이다. 빈칸에 알맞은 수를 차례로 구하시오.`, template,
        [k, k, k, c2, c1, c0].map((answer) => ({ answer, signed: true })), {
          shown: `${A}${sup(3)} + 3 × ${A}${sup(2)} × (${sd(k)}${Bv}) + 3 × ${A} × (${sd(k)}${Bv})${sup(2)} + (${sd(k)}${Bv})${sup(3)} = ${ph(R)}`,
          explain: `${xh(src)}에서 둘째 항은 ${nb(sd(k) + Bv)}이므로 ${A}${sup(3)} + 3 × ${A}${sup(2)} × (${sd(k)}${Bv}) + 3 × ${A} × (${sd(k)}${Bv})${sup(2)} + (${sd(k)}${Bv})${sup(3)} = ${ph(R)}이다.`,
          facts: { calc: [[kS, 0], [kS, 1], [kS, 2], [`3*${kS}`, 3], [`3*${kS}*${kS}`, 4], [`${kS}*${kS}*${kS}`, 5]] }
        });
    }),
    T('formula-regroup', '짝을 바꾸거나 공통부분을 묶어 전개하기', '①29', (d, n) => {
      if (n === 0) {
        // (x + p)³(x − p)³ = (x² − p²)³
        const p = d.int(1, 3), src = `(x+${p})^3(x-${p})^3`, R = xv(src), keys = ['x^6', 'x^4', 'x^2', ''];
        return polyA(EXPAND, R, keys, { figure: xex(src), rule: 'regroup-cube', explain: `곱셈의 교환·결합법칙으로 ${nb(`{(${Xv} + ${p})(${Xv} − ${p})}${sup(3)} = (${Xv}${sup(2)} − ${p * p})${sup(3)}`)}으로 바꾸어 곱셈 공식을 쓴다. ${xh(src)} = ${ph(R)}이다.` });
      }
      if (n === 1) {
        // (x² + ax + b)(x² − ax + b) = (x² + b)² − (ax)²
        const a = d.int(1, 4), b = nz(d, -6, 6), src = `(x^2+${a === 1 ? '' : a}x${sg(b)})(x^2-${a === 1 ? '' : a}x${sg(b)})`, R = xv(src), keys = ['x^4', 'x^2', ''];
        if (!hasKeys(R, keys)) return null;
        return polyA(EXPAND, R, keys, { figure: xex(src), rule: 'regroup-common', explain: `공통부분 ${ej(nb(`${X2} ${b < 0 ? MINUS : '+'} ${Math.abs(b)}`), '을/를')} 한 덩어리로 보면 ${nb(`(${X2} ${b < 0 ? MINUS : '+'} ${Math.abs(b)})${sup(2)} − (${a === 1 ? '' : a}${Xv})${sup(2)}`)}이다. 따라서 ${ph(R)}이다.` });
      }
      // 넷을 짝지어 곱하기: (x + ky)(x − ky)(x² + kxy + k²y²)(x² − kxy + k²y²) = x⁶ − k⁶y⁶, (x − 1)(x² + x + 1)(x⁶ + x³ + 1) = x⁹ − 1
      if (d.bool()) {
        const k = d.int(1, 2), kk = k === 1 ? '' : String(k), k2 = k * k === 1 ? '' : String(k * k);
        const src = `(x+${kk}y)(x-${kk}y)(x^2+${kk}xy+${k2}y^2)(x^2-${kk}xy+${k2}y^2)`, R = xv(src), k3 = k ** 3, k6 = k ** 6;
        const P6 = (c) => (c === 1 ? '' : String(c));
        // 틀린 보기: 부호를 놓침 / 짝을 잘못 지어 (x³ − k³y³)² / 지수를 더하지 않고 곱셈 공식만 흉내 냄 / 넷을 차례로 곱하다 만 식
        return pickQ(d, `${xj(src, '을/를')} 전개한 것은?`, R, [xv(`x^6+${P6(k6)}y^6`), xv(`x^6-${2 * k3}x^3y^3+${P6(k6)}y^6`), xv(`x^4-${P6(k ** 4)}y^4`), xv(`x^6-${P6(k * k)}x^4y^2+${P6(k ** 4)}x^2y^4-${P6(k6)}y^6`)], {
          rule: 'regroup-four', explain: `짝을 바꾸어 ${nb(`(${Xv} + ${kk}${Yv})(${X2} − ${kk}${Xv}${Yv} + ${k2}${Yv}${sup(2)}) = ${X3} + ${P6(k3)}${Yv}${sup(3)}`)}, ${nb(`(${Xv} − ${kk}${Yv})(${X2} + ${kk}${Xv}${Yv} + ${k2}${Yv}${sup(2)}) = ${X3} − ${P6(k3)}${Yv}${sup(3)}`)}을 먼저 곱한다. 따라서 ${nb(`(${X3} + ${P6(k3)}${Yv}${sup(3)})(${X3} − ${P6(k3)}${Yv}${sup(3)})`)} = ${ph(R)}이다.`
        });
      }
      const src = '(x-1)(x^2+x+1)(x^6+x^3+1)', R = xv(src);
      return pickQ(d, `${xj(src, '을/를')} 전개한 것은?`, R, [xv('x^9+1'), xv('x^18-1'), xv('x^9+x^6-x^3-1'), xv('x^9-x^6+x^3-1')], {
        rule: 'regroup-nine', explain: `앞의 두 식을 먼저 곱하면 ${nb(`(${Xv} − 1)(${X2} + ${Xv} + 1) = ${X3} − 1`)}이고, ${X3} = ${va}로 보면 ${nb(`(${va} − 1)(${va}${sup(2)} + ${va} + 1) = ${va}${sup(3)} − 1`)}이다. 따라서 ${ph(R)}이다.`
      });
    }, { count: 3 }),
    T('formula-substitute', '식의 일부를 한 문자로 놓고 전개하기', '①30', (d) => {
      const p = nz(d, -3, 3), plus = d.bool(), A = `x^2${sg(p, 'x')}`;
      // (A + 1)(A² − A + 1) = A³ + 1, (A − 1)(A² + A + 1) = A³ − 1 — 둘째 괄호는 A 를 풀어 적는다.
      const src = plus ? `(${A}+1){(${A})^2-x^2${sg(-p, 'x')}+1}` : `(${A}-1){(${A})^2+x^2${sg(p, 'x')}+1}`, R = xv(src), keys = ['x^6', 'x^5', 'x^4', 'x^3', ''];
      if (!hasKeys(R, keys)) return null;
      const AH = nb(ph(xv(A)));
      return polyA(EXPAND, R, keys, {
        figure: xex(src),
        explain: `${AH} = ${V('A')}로 놓으면 둘째 괄호는 ${nb(plus ? `${V('A')}${sup(2)} − ${V('A')} + 1` : `${V('A')}${sup(2)} + ${V('A')} + 1`)}이므로 주어진 식은 ${nb(plus ? `(${V('A')} + 1)(${V('A')}${sup(2)} − ${V('A')} + 1) = ${V('A')}${sup(3)} + 1` : `(${V('A')} − 1)(${V('A')}${sup(2)} + ${V('A')} + 1) = ${V('A')}${sup(3)} − 1`)}이다. 따라서 ${nb(`(${ph(xv(A))})${sup(3)} ${plus ? '+' : MINUS} 1`)} = ${ph(R)}이다.`
      });
    }),
    T('formula-power-value', 'xⁿ의 값이 주어질 때 곱의 값', '①31', (d, n) => {
      const k = d.int(2, 20);
      if (n === 0) {
        const form = d.pick([['(x-1)(x+1)(x^4+x^2+1)', '(x^2-1)(x^4+x^2+1)'], ['(x^2-1)(x^2-x+1)(x^2+x+1)', '(x^3+1)(x^3-1)']]);
        return numQ1(`${Xv}${sup(6)} = ${k}일 때, ${xh(form[0])}의 값은?`, k - 1, {
          calc: `${k}-1`, rule: 'power-six', explain: `${xh(form[0])} = ${xh(form[1])} = ${Xv}${sup(6)} − 1이므로 값은 ${k} − 1 = ${k - 1}이다.`
        });
      }
      const plus = d.bool(), form = plus ? ['(x+1)(x^2-x+1)(x^6-x^3+1)', '(x^3+1)(x^6-x^3+1)'] : ['(x-1)(x^2+x+1)(x^6+x^3+1)', '(x^3-1)(x^6+x^3+1)'];
      return numQ1(`${Xv}${sup(9)} = ${k}일 때, ${xh(form[0])}의 값은?`, plus ? k + 1 : k - 1, {
        calc: `${k}${plus ? '+' : '-'}1`, rule: 'power-nine', explain: `${xh(form[0])} = ${xh(form[1])} = ${Xv}${sup(9)} ${plus ? '+' : MINUS} 1이므로 값은 ${k} ${plus ? '+' : MINUS} 1 = ${plus ? k + 1 : k - 1}이다.`
      });
    }, { count: 2 }),
    T('formula-numbers', '곱셈 공식으로 수 계산하기', '①33', (d, n) => {
      if (n === 0) {
        const [base, k] = d.pick([[10, 1], [10, -1], [20, 1], [20, -1]]), m = base + k;
        return numQ1(`곱셈 공식을 이용하여 ${m}${sup(3)}을 계산하면?`, m * m * m, {
          signed: false, calc: `${m}*${m}*${m}`, rule: 'num-cube',
          explain: `${m}${sup(3)} = (${base} ${k > 0 ? '+' : MINUS} 1)${sup(3)} = ${base}${sup(3)} ${k > 0 ? '+' : MINUS} 3 × ${base}${sup(2)} × 1 + 3 × ${base} × 1${sup(2)} ${k > 0 ? '+' : MINUS} 1${sup(3)} = ${base ** 3} ${k > 0 ? '+' : MINUS} ${3 * base * base} + ${3 * base} ${k > 0 ? '+' : MINUS} 1 = ${m ** 3}이다.`
        });
      }
      if (n === 1) {
        const [a, s] = d.pick([[10, 1], [10, -1], [20, 1], [20, -1]]), m1 = a + s, m2 = a * a - s * a + 1;
        return numQ1(`곱셈 공식을 이용하여 ${m1} × ${josaNum(m2, '을/를')} 계산하면?`, m1 * m2, {
          signed: false, calc: `${m1}*${m2}`, rule: 'num-sumcube',
          explain: `${m1} × ${m2} = (${a} ${s > 0 ? '+' : MINUS} 1)(${a}${sup(2)} ${s > 0 ? MINUS : '+'} ${a} × 1 + 1${sup(2)}) = ${a}${sup(3)} ${s > 0 ? '+' : MINUS} 1${sup(3)} = ${m1 * m2}이다.`
        });
      }
      // (a³ + k³) ÷ {(a − k) × a + k²} = a + k
      const a = d.int(2024, 2032), k = d.int(2, 5);
      return numQ1(`${a}${sup(3)} + ${josaNum(k ** 3, '을/를')} ${(a - k)} × ${a} + ${josaNum(k * k, '으로/로')} 나누었을 때의 몫은?`, a + k, {
        signed: false, calc: `${a}+(${a}-${a - k})`, rule: 'num-quot',
        explain: `${nb(`${a}${sup(3)} + ${k}${sup(3)} = (${a} + ${k})(${a}${sup(2)} − ${a} × ${k} + ${k}${sup(2)})`)}이고 ${nb(`${a}${sup(2)} − ${a} × ${k} + ${k}${sup(2)} = ${a - k} × ${a} + ${k * k}`)}이므로 몫은 ${a} + ${k} = ${a + k}이다.`
      });
    }, { count: 3 })
  ];
  function josaNum(n, pair) { return B.kit.josa(n, pair); }

  // ════════════════════════════════════════════════════════════════
  // ── 곱셈 공식의 변형 ──
  const cubeSum = (s, p) => s * s * s - 3 * p * s, cubeDiff = (s, p) => s * s * s + 3 * p * s;
  // 직육면체 ABCD−EFGH 그림(윗면 ABCD, 아랫면 EFGH, A 는 왼쪽 뒤 위). mark: 'AG'(대각선) | 'BGD'(세 면의 대각선)
  function cuboid(mark) {
    const P = { B: [40, 64], C: [168, 64], G: [168, 144], F: [40, 144] }, off = [46, -36];
    for (const [k, base] of [['A', 'B'], ['D', 'C'], ['H', 'G'], ['E', 'F']]) P[k] = [P[base][0] + off[0], P[base][1] + off[1]];
    const line = (a, b, css) => `<line x1="${P[a][0]}" y1="${P[a][1]}" x2="${P[b][0]}" y2="${P[b][1]}" style="${css}"/>`;
    const solid = `stroke:${INK};stroke-width:1.4`, dash = `stroke:${INK};stroke-width:1.1;stroke-dasharray:4 3`, blue = 'stroke:#1d4ed8;stroke-width:1.8';
    let body = `<polygon points="${['A', 'D', 'C', 'B'].map((k) => P[k].join(',')).join(' ')}" style="fill:rgba(37,99,235,0.07)"/><polygon points="${['C', 'D', 'H', 'G'].map((k) => P[k].join(',')).join(' ')}" style="fill:rgba(37,99,235,0.13)"/>`;
    body += [['A', 'E'], ['E', 'F'], ['E', 'H']].map(([a, b]) => line(a, b, dash)).join('');
    body += (mark === 'AG' ? [['A', 'G']] : [['B', 'G'], ['G', 'D'], ['D', 'B']]).map(([a, b]) => line(a, b, blue)).join('');
    body += [['B', 'C'], ['C', 'G'], ['G', 'F'], ['F', 'B'], ['A', 'D'], ['A', 'B'], ['D', 'C'], ['D', 'H'], ['H', 'G']].map(([a, b]) => line(a, b, solid)).join('');
    const at = { A: [-6, -6, 'end'], D: [6, -6, 'start'], B: [-6, 4, 'end'], C: [-4, -8, 'end'], G: [6, 14, 'start'], F: [-6, 14, 'end'], H: [7, 6, 'start'], E: [8, 14, 'start'] };
    body += Object.keys(at).map((k) => `<text x="${P[k][0] + at[k][0]}" y="${P[k][1] + at[k][1]}" text-anchor="${at[k][2]}" style="font-size:13px;font-weight:600;fill:${INK};paint-order:stroke;stroke:#fff;stroke-width:3px">${k}</text>`).join('');
    return svg(250, 164, `직육면체 ABCD−EFGH: 윗면 ABCD, 아랫면 EFGH, 세로 모서리 AE, BF, CG, DH. ${mark === 'AG' ? '꼭짓점 A와 G를 잇는 대각선 AG를 그었다.' : '선분 BG, GD, DB를 그었다(세 선분은 서로 다른 세 면의 대각선이다).'}`, body);
  }
  // 세 수로 짓는 직육면체(대각선의 길이가 자연수)
  const BOXES = [[1, 2, 2], [2, 3, 6], [1, 4, 8], [2, 4, 4], [4, 4, 7], [2, 6, 9], [6, 6, 7], [3, 4, 12], [2, 5, 14], [8, 9, 12], [2, 10, 11], [4, 8, 8], [3, 6, 6], [6, 9, 18]];
  const valueTypes = [
    T('value-sum-cube', 'x + y, xy로 x³ + y³', '②1', (d) => {
      const s = nz(d, -6, 6), p = nz(d, -8, 8);
      if (s * s < 4 * p) return null;
      return numQ1(`${nb(`${Xv} + ${Yv} = ${sd(s)}`)}, ${nb(`${Xv}${Yv} = ${sd(p)}`)}일 때, ${nb(`${X3} + ${Yv}${sup(3)}`)}의 값은?`, cubeSum(s, p), {
        calc: `${jn(s)}*${jn(s)}*${jn(s)}-3*${jn(p)}*${jn(s)}`, derived: [3],
        explain: `${nb(`${X3} + ${Yv}${sup(3)} = (${Xv} + ${Yv})${sup(3)} − 3${Xv}${Yv}(${Xv} + ${Yv})`)} = ${nb(`${jd(s)}${sup(3)} − 3 × ${jd(p)} × ${jd(s)}`)} = ${sd(cubeSum(s, p))}이다.`
      });
    }),
    T('value-diff-cube', 'x − y, xy로 x³ − y³', '②2', (d) => {
      const s = nz(d, -6, 6), p = nz(d, -8, 8);
      if (s * s + 4 * p < 0) return null;
      return numQ1(`${nb(`${Xv} − ${Yv} = ${sd(s)}`)}, ${nb(`${Xv}${Yv} = ${sd(p)}`)}일 때, ${nb(`${X3} − ${Yv}${sup(3)}`)}의 값은?`, cubeDiff(s, p), {
        calc: `${jn(s)}*${jn(s)}*${jn(s)}+3*${jn(p)}*${jn(s)}`, derived: [3],
        explain: `${nb(`${X3} − ${Yv}${sup(3)} = (${Xv} − ${Yv})${sup(3)} + 3${Xv}${Yv}(${Xv} − ${Yv})`)} = ${nb(`${jd(s)}${sup(3)} + 3 × ${jd(p)} × ${jd(s)}`)} = ${sd(cubeDiff(s, p))}이다.`
      });
    }),
    T('value-square-sum', 'x ± y와 x² + y²로 x³ ± y³', '②3', (d, n) => {
      const s = d.int(1, 7), t = d.int(2, 60);
      if (n === 0) {
        // x + y = s, x² + y² = t → xy = (s² − t)/2
        if ((s * s - t) % 2 || 2 * t < s * s || s * s === t) return null;
        const p = (s * s - t) / 2;
        return numQ1(`${nb(`${Xv} + ${Yv} = ${s}`)}, ${nb(`${X2} + ${Yv}${sup(2)} = ${t}`)}일 때, ${nb(`${X3} + ${Yv}${sup(3)}`)}의 값은?`, cubeSum(s, p), {
          calc: `${s}*${s}*${s}-3*((${s}*${s}-${t})/2)*${s}`, derived: [2, 3], rule: 'sq-sum',
          explain: `${nb(`${X2} + ${Yv}${sup(2)} = (${Xv} + ${Yv})${sup(2)} − 2${Xv}${Yv}`)}에서 ${nb(`${t} = ${s * s} − 2${Xv}${Yv}`)}, ${nb(`${Xv}${Yv} = ${sd(p)}`)}이다. ${nb(`${X3} + ${Yv}${sup(3)} = ${s}${sup(3)} − 3 × ${jd(p)} × ${s}`)} = ${sd(cubeSum(s, p))}이다.`
        });
      }
      // x − y = s, x² + y² = t → xy = (t − s²)/2
      if ((t - s * s) % 2 || t === s * s || 2 * t < s * s) return null;
      const p = (t - s * s) / 2;
      return numQ1(`${nb(`${Xv} − ${Yv} = ${s}`)}, ${nb(`${X2} + ${Yv}${sup(2)} = ${t}`)}일 때, ${nb(`${X3} − ${Yv}${sup(3)}`)}의 값은?`, cubeDiff(s, p), {
        calc: `${s}*${s}*${s}+3*((${t}-${s}*${s})/2)*${s}`, derived: [2, 3], rule: 'sq-diff',
        explain: `${nb(`${X2} + ${Yv}${sup(2)} = (${Xv} − ${Yv})${sup(2)} + 2${Xv}${Yv}`)}에서 ${nb(`${t} = ${s * s} + 2${Xv}${Yv}`)}, ${nb(`${Xv}${Yv} = ${sd(p)}`)}이다. ${nb(`${X3} − ${Yv}${sup(3)} = ${s}${sup(3)} + 3 × ${jd(p)} × ${s}`)} = ${sd(cubeDiff(s, p))}이다.`
      });
    }, { count: 2 }),
    T('value-reverse', '세제곱의 합·차에서 거꾸로 구하기', '②4', (d, n) => {
      const s = d.int(1, 6), p = nz(d, -6, 6);
      if (n === 0) {
        // x − y = s, x³ − y³ = c → xy
        const c = cubeDiff(s, p);
        if (s * s + 4 * p < 0 || c === 0) return null;
        return numQ1(`${nb(`${Xv} − ${Yv} = ${s}`)}, ${nb(`${X3} − ${Yv}${sup(3)} = ${sd(c)}`)}일 때, ${nb(`${Xv}${Yv}`)}의 값은?`, p, {
          calc: `(${jn(c)}-${s}*${s}*${s})/(3*${s})`, derived: [3], rule: 'rev-xy',
          explain: `${nb(`${X3} − ${Yv}${sup(3)} = (${Xv} − ${Yv})${sup(3)} + 3${Xv}${Yv}(${Xv} − ${Yv})`)}에서 ${nb(`${sd(c)} = ${s * s * s} + ${3 * s}${Xv}${Yv}`)}이므로 ${nb(`${Xv}${Yv} = ${sd(p)}`)}이다.`
        });
      }
      // a + b = s, a³ + b³ = c → ab → b/a + a/b = (s² − 2ab)/ab
      const c = cubeSum(s, p), v = Q(s * s - 2 * p, p);
      if (s * s < 4 * p || isInt(v) || v.q > 30) return null;
      return ansV(`${nb(`${va} + ${vb} = ${s}`)}, ${nb(`${va}${sup(3)} + ${vb}${sup(3)} = ${sd(c)}`)}일 때, ${nb(`${frac(vb, va)} + ${frac(va, vb)}`)}의 값은?`, v, 'frac', {
        explain: `${nb(`${va}${sup(3)} + ${vb}${sup(3)} = (${va} + ${vb})${sup(3)} − 3${va}${vb}(${va} + ${vb})`)}에서 ${nb(`${sd(c)} = ${s * s * s} − ${3 * s}${va}${vb}`)}이므로 ${nb(`${va}${vb} = ${sd(p)}`)}이다. ${nb(`${frac(vb, va)} + ${frac(va, vb)} = ${frac(`${va}${sup(2)} + ${vb}${sup(2)}`, `${va}${vb}`)}`)} = ${frac(`${s * s} − 2 × ${jd(p)}`, sd(p))} = ${tx(v)}이다.`,
        facts: { value: `(${s}*${s}-2*((${s}*${s}*${s}-${jn(c)})/(3*${s})))/((${s}*${s}*${s}-${jn(c)})/(3*${s}))`, derived: [2, 3], rule: 'rev-frac' }
      });
    }, { count: 2 }),
    T('value-surd', '근호가 든 두 수의 세제곱 식', '②5', (d, n) => {
      if (n === 0) {
        // x = p + q√m, y = p − q√m → x³ + y³ = (2p)³ − 3(p² − q²m)(2p)
        const p = d.int(1, 4), q = d.int(1, 2), m = d.pick([2, 3, 5, 6, 7]), xy = p * p - q * q * m, v = 8 * p * p * p - 6 * p * xy;
        if (xy === 0) return null;
        return numQ1(`${nb(`${Xv} = ${p} + ${rad(q, m)}`)}, ${nb(`${Yv} = ${p} − ${rad(q, m)}`)}일 때, ${nb(`${X3} + ${Yv}${sup(3)}`)}의 값은?`, v, {
          calc: `(2*${p})*(2*${p})*(2*${p})-3*(${p}*${p}-${q}*${q}*${m})*(2*${p})`, derived: [2, 3], rule: 'surd-sum',
          explain: `${nb(`${Xv} + ${Yv} = ${2 * p}`)}, ${nb(`${Xv}${Yv} = ${p}${sup(2)} − (${rad(q, m)})${sup(2)} = ${sd(xy)}`)}이므로 ${nb(`${X3} + ${Yv}${sup(3)} = ${2 * p}${sup(3)} − 3 × ${jd(xy)} × ${2 * p}`)} = ${sd(v)}이다.`
        });
      }
      // x + y = k√m, xy = p, x > y → x − y = √(k²m − 4p) = u√w, x³ − y³ = (x − y)((x − y)² + 3xy)
      const k = d.int(1, 3), m = d.pick([2, 3, 5, 6]), p = nz(d, -5, 8), D = k * k * m - 4 * p;
      if (D <= 0) return null;
      const [u, w] = sqParts(D), coef = u * (D + 3 * p);
      if (w < 2 || coef === 0 || coef === -1) return null;
      return radAns(`${nb(`${Xv} + ${Yv} = ${rad(k, m)}`)}, ${nb(`${Xv}${Yv} = ${sd(p)}`)}일 때, ${nb(`${X3} − ${Yv}${sup(3)}`)}의 값은? (단, ${nb(`${Xv} &gt; ${Yv}`)})`, coef, w, {
        explain: `${nb(`(${Xv} − ${Yv})${sup(2)} = (${Xv} + ${Yv})${sup(2)} − 4${Xv}${Yv} = ${k * k * m} − 4 × ${jd(p)} = ${D}`)}이고 ${nb(`${Xv} &gt; ${Yv}`)}이므로 ${nb(`${Xv} − ${Yv} = ${rad(u, w)}`)}이다. ${nb(`${X3} − ${Yv}${sup(3)} = (${Xv} − ${Yv})${sup(3)} + 3${Xv}${Yv}(${Xv} − ${Yv})`)} = ${nb(`${rad(u, w)} × (${D} + 3 × ${jd(p)})`)} = ${rad(coef, w).replace(/^-/, MINUS)}이다.`,
        facts: { calc: [[`${u}*(${k}*${k}*${m}-4*${jn(p)}+3*${jn(p)})`, 0], [`(${k}*${k}*${m}-4*${jn(p)})/(${u}*${u})`, 1]], derived: [3, 4, u] }
      });
    }, { count: 2 }),
    T('value-frac-sym', '분수 꼴 대칭식 b²/a + a²/b의 값', '②5 심3', (d, n) => {
      if (n === 0) {
        // a = p + √q, b = p − √q, ab = r = p² − q 가 작다. b²/a + a²/b = (a³ + b³)/(ab)
        const p = d.int(1, 4), r = d.pick([1, -1, 2, -2]), q = p * p - r;
        if (q < 2 || !isSqf(q) || (8 * p * p * p - 6 * p * r) % r) return null;
        const v = (8 * p * p * p - 6 * p * r) / r;
        return numQ1(`${nb(`${va} = ${p} + ${rt(q)}`)}, ${nb(`${vb} = ${p} − ${rt(q)}`)}일 때, ${nb(`${frac(vb + sup(2), va)} + ${frac(va + sup(2), vb)}`)}의 값은?`, v, {
          calc: `((2*${p})*(2*${p})*(2*${p})-3*(${p}*${p}-${q})*(2*${p}))/(${p}*${p}-${q})`, derived: [2, 3], rule: 'frac-num',
          explain: `${nb(`${va} + ${vb} = ${2 * p}`)}, ${nb(`${va}${vb} = ${sd(r)}`)}이다. ${nb(`${frac(vb + sup(2), va)} + ${frac(va + sup(2), vb)} = ${frac(`${va}${sup(3)} + ${vb}${sup(3)}`, `${va}${vb}`)}`)}이고 ${nb(`${va}${sup(3)} + ${vb}${sup(3)} = ${2 * p}${sup(3)} − 3 × ${jd(r)} × ${2 * p} = ${sd(8 * p * p * p - 6 * p * r)}`)}이므로 값은 ${sd(v)}이다.`
        });
      }
      // x + y = √m, xy = p → x²/y + y²/x = (m − 3p)/p × √m
      const m = d.pick([2, 3, 5, 6, 7, 10]), p = d.pick([1, 2, -1, -2, -3, 3, -5, 5].filter((x) => m % x === 0)), coef = (m - 3 * p) / p;
      if (m < 4 * p || coef === 0 || coef === -1 || !Number.isInteger(coef)) return null;
      return radAns(`${nb(`${Xv} + ${Yv} = ${rt(m)}`)}, ${nb(`${Xv}${Yv} = ${sd(p)}`)}일 때, ${nb(`${frac(X2, Yv)} + ${frac(Yv + sup(2), Xv)}`)}의 값은?`, coef, m, {
        explain: `${nb(`${frac(X2, Yv)} + ${frac(Yv + sup(2), Xv)} = ${frac(`${X3} + ${Yv}${sup(3)}`, `${Xv}${Yv}`)}`)}이고 ${nb(`${X3} + ${Yv}${sup(3)} = (${rt(m)})${sup(3)} − 3 × ${jd(p)} × ${rt(m)} = ${rad(m - 3 * p, m)}`)}이므로 값은 ${rad(coef, m).replace(/^-/, MINUS)}이다.`,
        facts: { calc: [[`(${m}-3*${jn(p)})/${jn(p)}`, 0], [`${m}`, 1]], derived: [3], rule: 'frac-rad' }
      });
    }, { count: 2 }),
    T('value-recip', 'a와 1/a의 식', '②6', (d, n) => {
      if (n === 0) {
        // a² + 1/a² = k → (a − 1/a)² = k − 2 = D, a > 1 이면 a − 1/a = √D, 0 < a < 1 이면 −√D. a³ − 1/a³ = (a − 1/a)³ + 3(a − 1/a)
        const D = d.pick([2, 3, 5, 6, 7]), k = D + 2, big = d.bool(), sgn = big ? 1 : -1;
        return radAns(`${nb(`${va}${sup(2)} + ${frac(1, va + sup(2))} = ${k}`)}일 때, ${nb(`${va}${sup(3)} − ${frac(1, va + sup(3))}`)}의 값은? (단, ${big ? nb(`${va} &gt; 1`) : nb(`0 &lt; ${va} &lt; 1`)})`, sgn * (D + 3), D, {
          explain: `${nb(`(${va} − ${frac(1, va)})${sup(2)} = ${va}${sup(2)} + ${frac(1, va + sup(2))} − 2 = ${D}`)}이고 ${big ? `${nb(`${va} &gt; 1`)}이면 ${nb(`${va} &gt; ${frac(1, va)}`)}` : `${nb(`0 &lt; ${va} &lt; 1`)}이면 ${nb(`${va} &lt; ${frac(1, va)}`)}`}이므로 ${nb(`${va} − ${frac(1, va)} = ${big ? '' : MINUS}${rt(D)}`)}이다. ${nb(`${va}${sup(3)} − ${frac(1, va + sup(3))} = (${va} − ${frac(1, va)})${sup(3)} + 3(${va} − ${frac(1, va)})`)} = ${big ? '' : MINUS}${rad(D + 3, D)}이다.`,
          facts: { calc: [[`${big ? '' : '-'}((${k}-2)+3)`, 0], [`${k}-2`, 1]], derived: [2, 3], rule: 'recip-' + (big ? 'big' : 'small') }
        });
      }
      // x² ∓ px + 1 = 0 → x + 1/x = ±p → (x⁶ + 1)/x³ = x³ + 1/x³ = (±p)³ − 3(±p)
      const p = d.int(2, 5), s = d.pick([1, -1]), t = s * p, v = t * t * t - 3 * t;
      return numQ1(`${nb(`${X2} ${s > 0 ? MINUS : '+'} ${p}${Xv} + 1 = 0`)}일 때, ${frac(`${Xv}${sup(6)} + 1`, X3)}의 값은?`, v, {
        calc: `${jn(t)}*${jn(t)}*${jn(t)}-3*${jn(t)}`, derived: [3], rule: 'recip-eq',
        explain: `${Xv} ≠ 0이므로 양변을 ${Xv}로 나누면 ${nb(`${Xv} + ${frac(1, Xv)} = ${sd(t)}`)}이다. ${nb(`${frac(`${Xv}${sup(6)} + 1`, X3)} = ${X3} + ${frac(1, X3)} = (${Xv} + ${frac(1, Xv)})${sup(3)} − 3(${Xv} + ${frac(1, Xv)})`)} = ${sd(v)}이다.`
      });
    }, { count: 2 }),
    T('value-fourth', '제곱의 합으로 네제곱의 합', '②7', (d) => {
      const s = d.int(1, 7), t = d.int(3, 90);
      if ((s * s - t) % 2 || 2 * t < s * s || s * s === t) return null;
      const p = (s * s - t) / 2, v = t * t - 2 * p * p;
      if (v > 9999) return null;
      return numQ1(`${nb(`${va} + ${vb} = ${s}`)}, ${nb(`${va}${sup(2)} + ${vb}${sup(2)} = ${t}`)}일 때, ${nb(`${va}${sup(4)} + ${vb}${sup(4)}`)}의 값은?`, v, {
        calc: `${t}*${t}-2*((${s}*${s}-${t})/2)*((${s}*${s}-${t})/2)`, derived: [2],
        explain: `${nb(`${va}${sup(2)} + ${vb}${sup(2)} = (${va} + ${vb})${sup(2)} − 2${va}${vb}`)}에서 ${nb(`${va}${vb} = ${sd(p)}`)}이다. ${nb(`${va}${sup(4)} + ${vb}${sup(4)} = (${va}${sup(2)} + ${vb}${sup(2)})${sup(2)} − 2(${va}${vb})${sup(2)} = ${t}${sup(2)} − 2 × ${jd(p)}${sup(2)}`)} = ${v}이다.`
      });
    }),
    T('value-square-expand', '완전제곱 등식에서 식의 값', '②10', (d) => {
      const [p, q] = [d.int(1, 3), d.int(1, 2)], r = nz(d, -3, 3), c = d.int(2, 12);
      if (p === 1 && q === 1) return null;
      const src = `(${pn([[p, 'a'], [q, 'b'], [r, '']])})^2`, P = xv(src), body = P.filter((t) => keyOf(t.e)), mixed = d.shuffle(ordered(body));
      const shownH = nb(mixed.map((t, i) => (i === 0 ? (t.q.p < 0 ? MINUS : '') : t.q.p < 0 ? ` ${MINUS} ` : ' + ') + termText(t)).join(''));
      return numQ1(`${nb(xh(src) + ' = ' + c)}일 때, ${shownH}의 값은?`, c - r * r, {
        calc: `${c}-${jn(r)}*${jn(r)}`,
        explain: `${xh(src)}을 전개하면 ${pt(P)}이다. 이것이 ${c}이므로 상수항 ${josaNum(r * r, '을/를')} 옮기면 구하는 값은 ${c} − ${r * r} = ${sd(c - r * r)}이다.`
      });
    }),
    T('value-abc', 'a + b + c, ab + bc + ca, a² + b² + c² 사이', '②11', (d, n) => {
      const s = nz(d, -6, 6), q = nz(d, -12, 12), t = s * s - 2 * q;
      if (t < q || t <= 0) return null;
      const SUM = nb(`${va} + ${vb} + ${V('c')}`), PAIR = nb(`${va}${vb} + ${vb}${V('c')} + ${V('c')}${va}`), SQ = nb(`${va}${sup(2)} + ${vb}${sup(2)} + ${V('c')}${sup(2)}`);
      const RULE = `${nb(`(${va} + ${vb} + ${V('c')})${sup(2)} = ${va}${sup(2)} + ${vb}${sup(2)} + ${V('c')}${sup(2)} + 2(${va}${vb} + ${vb}${V('c')} + ${V('c')}${va})`)}`;
      if (n === 0) return numQ1(`${SUM} = ${sd(s)}, ${PAIR} = ${sd(q)}일 때, ${SQ}의 값은?`, t, { calc: `${jn(s)}*${jn(s)}-2*${jn(q)}`, derived: [2], rule: 'abc-sq', explain: `${RULE}에서 ${SQ} = ${nb(`${jd(s)}${sup(2)} − 2 × ${jd(q)}`)} = ${t}이다.` });
      return numQ1(`${SUM} = ${sd(s)}, ${SQ} = ${t}일 때, ${PAIR}의 값은?`, q, { calc: `(${jn(s)}*${jn(s)}-${t})/2`, derived: [2], rule: 'abc-pair', explain: `${RULE}에서 ${nb(`${jd(s)}${sup(2)} = ${t} + 2(${va}${vb} + ${vb}${V('c')} + ${V('c')}${va})`)}이므로 ${PAIR} = ${sd(q)}이다.` });
    }, { count: 2 }),
    T('value-abc-recip', '세 문자의 합·제곱의 합·곱으로 1/a + 1/b + 1/c', '②12', (d) => {
      // t³ − s t² + q t − r = 0 이 서로 다른 세 실근을 갖는 s, q, r(판별식이 양수). q 는 r 의 배수.
      const s = nz(d, -5, 5), r = nz(d, -3, 3), m = nz(d, -4, 4), q = r * m, disc = 18 * s * q * r - 4 * s * s * s * r + s * s * q * q - 4 * q * q * q - 27 * r * r;
      if (disc <= 0) return null;
      const t = s * s - 2 * q;
      return numQ1(`${nb(`${va} + ${vb} + ${V('c')} = ${sd(s)}`)}, ${nb(`${va}${sup(2)} + ${vb}${sup(2)} + ${V('c')}${sup(2)} = ${t}`)}, ${nb(`${va}${vb}${V('c')} = ${sd(r)}`)}일 때, ${nb(`${frac(1, va)} + ${frac(1, vb)} + ${frac(1, V('c'))}`)}의 값은?`, m, {
        calc: `((${jn(s)}*${jn(s)}-${t})/2)/${jn(r)}`, derived: [2],
        explain: `${nb(`${va}${vb} + ${vb}${V('c')} + ${V('c')}${va} = ${frac(`(${va} + ${vb} + ${V('c')})${sup(2)} − (${va}${sup(2)} + ${vb}${sup(2)} + ${V('c')}${sup(2)})`, 2)} = ${sd(q)}`)}이다. ${nb(`${frac(1, va)} + ${frac(1, vb)} + ${frac(1, V('c'))} = ${frac(`${va}${vb} + ${vb}${V('c')} + ${V('c')}${va}`, `${va}${vb}${V('c')}`)}`)} = ${frac(sd(q), sd(r))} = ${sd(m)}이다.`
      });
    }),
    T('value-box-diag', '직육면체의 겉넓이와 모서리의 길이의 합으로 대각선의 길이', '②13', (d) => {
      const [a, b, c] = d.pick(BOXES), S = 2 * (a * b + b * c + c * a), L = 4 * (a + b + c), g = Math.round(Math.sqrt(a * a + b * b + c * c));
      return N(`그림과 같은 직육면체 ABCD−EFGH의 겉넓이가 ${S}이고 모든 모서리의 길이의 합이 ${L}일 때, 선분 AG의 길이는?`, g, {
        figure: cuboid('AG'),
        explain: `세 모서리의 길이를 ${va}, ${vb}, ${V('c')}라 하면 ${nb(`2(${va}${vb} + ${vb}${V('c')} + ${V('c')}${va}) = ${S}`)}, ${nb(`4(${va} + ${vb} + ${V('c')}) = ${L}`)}이다. ${nb(`${va}${sup(2)} + ${vb}${sup(2)} + ${V('c')}${sup(2)} = (${va} + ${vb} + ${V('c')})${sup(2)} − 2(${va}${vb} + ${vb}${V('c')} + ${V('c')}${va}) = ${L / 4}${sup(2)} − ${S} = ${g * g}`)}이므로 AG = ${rt(g * g)} = ${g}이다.`,
        facts: { calc: [[`((${L}/4)*(${L}/4)-${S})/${g}`, 0]], unseen: [4, g] }
      });
    }),
    T('value-box-faces', '모서리의 길이의 합과 세 면의 대각선으로 겉넓이', '②14', (d) => {
      const [a, b, c] = d.pick(BOXES.concat([[1, 2, 3], [2, 3, 4], [1, 3, 5], [3, 4, 5], [2, 5, 6]])), L = 4 * (a + b + c), F = 2 * (a * a + b * b + c * c), S = 2 * (a * b + b * c + c * a);
      return N(`그림과 같은 직육면체 ABCD−EFGH의 모든 모서리의 길이의 합이 ${L}이고, 세 선분 BG, GD, DB의 길이를 각각 제곱하여 더한 값이 ${F}일 때, 이 직육면체의 겉넓이는?`, S, {
        figure: cuboid('BGD'),
        explain: `세 모서리의 길이를 ${va}, ${vb}, ${V('c')}라 하면 BG, GD, DB는 서로 다른 세 면의 대각선이므로 제곱의 합은 ${nb(`2(${va}${sup(2)} + ${vb}${sup(2)} + ${V('c')}${sup(2)}) = ${F}`)}이다. ${nb(`${va} + ${vb} + ${V('c')} = ${L / 4}`)}이므로 겉넓이는 ${nb(`2(${va}${vb} + ${vb}${V('c')} + ${V('c')}${va}) = ${L / 4}${sup(2)} − ${F / 2} = ${S}`)}이다.`,
        facts: { calc: [[`(${L}/4)*(${L}/4)-${F}/2`, 0]], unseen: [2, 4] }
      });
    })
  ];
  // 앞에 식이 있을 때 덧붙이는 다항식: 첫 항이 음수이면 「 − …」, 아니면 「 + …」
  const tailP = (Pp) => { const h = ph(Pp); return h.startsWith(MINUS) ? ' ' + MINUS + ' ' + h.slice(MINUS.length) : ' + ' + h; };
  // 긴 등식은 곱 부분과 남은 항 부분에서만 줄을 바꾸고, 뒤에 붙는 조사는 남은 항과 한 덩이로 둔다
  const eqTail = (head, Pp, pair) => nb(head) + ' ' + nb(pair ? ej(tailP(Pp).trim(), pair) : tailP(Pp).trim());
  // 계수와 문자를 붙인 항의 글(부호 없이)
  function termText(t) { const m = Math.abs(t.q.p), v = Object.keys(t.e).filter((k) => t.e[k]).sort().map((k) => V(k) + (t.e[k] > 1 ? sup(t.e[k]) : '')).join(''); return (m === 1 && v ? '' : m) + v; }

  // ════════════════════════════════════════════════════════════════
  // ── 다항식의 나눗셈 ──
  const QK = { 1: ['x', ''], 2: ['x^2', 'x', ''], 3: ['x^3', 'x^2', 'x', ''] };
  // 차수가 n 이고 계수가 모두 0이 아닌 다항식(최고차항의 계수는 lead 가운데에서)
  const dense = (d, n, lead, lo, hi) => xv(pc([d.pick(lead || [1, 2, 3])].concat(nzs(d, n, lo || -5, hi || 5))));
  const divTypes = [
    T('div-linear', '일차식으로 나눈 몫과 나머지', '②19', (d, n) => {
      if (n === 0) {
        // (x + c)(q2 x² + q1 x + q0) + r, 나뉠 식에 빠진 차수가 하나 있다.
        const c = nz(d, -4, 4), q2 = d.int(1, 3), r = nz(d, -9, 9), zero = d.pick([2, 1]);
        let q1 = nz(d, -5, 5), q0 = nz(d, -6, 6);
        if (zero === 2) q1 = -c * q2; else q0 = -c * q1;
        if (q1 === 0 || q0 === 0 || Math.abs(q0) > 12) return null;
        const A = fresh(pAdd(pMul(xv(pc([1, c])), xv(pc([q2, q1, q0]))), num(r))), Bd = xv(pc([1, c])), { Q: Qp, R } = pDiv(A, Bd);
        const src = `(${srcOf(A)})/(${pc([1, c])})`;
        void src;
        return divAns(DIVIDE, Qp, R, QK[2], [''], { figure: ex(`${nb(`(${ph(A, true)})`)} <i>÷</i> ${nb(`(${ph(Bd, true)})`)}`), rule: 'div-lin-1', explain: `빠진 차수의 자리를 비워 두고 차수가 높은 항부터 나누면 몫은 ${pt(Qp)}, 나머지는 ${sd(R.length ? R[0].q.p : 0)}이다. ${nb(`${ph(A)} = (${ph(Bd)})(${ph(Qp)}) ${r < 0 ? MINUS : '+'} ${Math.abs(r)}`)}이다.` });
      }
      // (b x + c) 로 나누기(일차항의 계수가 1이 아니다): 나뉠 식은 사차식
      const b = d.int(2, 3), c = nz(d, -3, 3), Qc = [d.int(1, 2)].concat(nzs(d, 3, -4, 4)), r = nz(d, -6, 6);
      if (gcd(b, Math.abs(c)) !== 1) return null;
      const A = fresh(pAdd(pMul(xv(pc([b, c])), xv(pc(Qc))), num(r))), Bd = xv(pc([b, c])), { Q: Qp, R } = pDiv(A, Bd);
      if (!intCoefs(A, 60)) return null;
      return divAns(DIVIDE, Qp, R, QK[3], [''], { figure: ex(`${nb(`(${ph(A, true)})`)} <i>÷</i> ${nb(`(${ph(Bd, true)})`)}`), rule: 'div-lin-b', explain: `나누는 식의 최고차항 ${b}${Xv}로 나뉠 식의 최고차항부터 차례로 나누어 빼면 몫은 ${pt(Qp)}, 나머지는 ${sd(r)}이다. ${nb(`${ph(A)} = (${ph(Bd)})(${ph(Qp)}) ${r < 0 ? MINUS : '+'} ${Math.abs(r)}`)}이다.` });
    }, { count: 2 }),
    T('div-quad', '이차식으로 나눈 몫과 나머지', '②20', (d, n) => {
      const Bd = xv(pc([d.pick([1, 1, 2]), nz(d, -3, 3), nz(d, -4, 4)])), Rr = xv(pc(nzs(d, 2, -7, 7)));
      const Qp0 = n === 0 ? dense(d, 1, [1, 2, 3]) : dense(d, 2, [1, 2, -1, -2], -4, 4);
      const A = fresh(pAdd(pMul(Bd, Qp0), Rr));
      if (n === 1 && ![3, 2, 1].some((k) => !termOf(A, { x: k }))) return null;   // 사차식은 빠진 차수가 있게
      const { Q: Qp, R } = pDiv(A, Bd);
      if (!intCoefs(A, 40)) return null;
      return divAns(DIVIDE, Qp, R, n === 0 ? QK[1] : QK[2], ['x', ''], { figure: ex(`${nb(`(${ph(A, true)})`)} <i>÷</i> ${nb(`(${ph(Bd, true)})`)}`), rule: 'div-quad-' + n, explain: `차수가 높은 항부터 나누어 나머지의 차수가 나누는 식의 차수(2)보다 낮아질 때까지 계산하면 몫은 ${pt(Qp)}, 나머지는 ${pt(R)}이다. ${nb(`${ph(A)} = (${ph(Bd)})(${ph(Qp)}) + (${ph(R)})`)}이다.` });
    }, { count: 2 }),
    T('div-find-dividend', '몫과 나머지로 나뉠 식 구하기', '②21', (d) => {
      const lin = d.bool(), Bd = lin ? xv(pc([1, nz(d, -4, 4)])) : xv(pc([d.int(1, 3), nz(d, -3, 3), nz(d, -4, 4)]));
      const Qp = lin ? xv(pc([d.int(1, 3), nz(d, -4, 4), nz(d, -4, 4)])) : xv(pc([d.int(1, 3), nz(d, -4, 4)])), Rr = lin ? num(nz(d, -9, 9)) : xv(pc(nzs(d, 2, -6, 6)));
      const A = pAdd(pMul(Bd, Qp), Rr);
      if (!hasKeys(A, QK[3]) || !intCoefs(A, 60)) return null;
      return polyA(`다항식 ${V('A')}를 ${ej(pt(Bd), '으로/로')} 나누었을 때의 몫이 ${pt(Qp)}이고 나머지가 ${pt(Rr)}일 때, 다항식 ${V('A')}는?`, A, QK[3], {
        explain: `${nb(`${V('A')} = (나누는 식) × (몫) + (나머지)`)}이므로 ${nb(`${V('A')} = (${ph(Bd)})(${ph(Qp)}) + ${Rr.length === 1 && !keyOf(Rr[0].e) ? sd(Rr[0].q.p) : '(' + ph(Rr) + ')'}`)} = ${ph(A)}이다.`
      });
    }),
    T('div-find-divisor', '나뉠 식·몫·나머지로 나누는 식 구하기', '②22', (d) => {
      const Bd0 = xv(pc([d.int(1, 2), nz(d, -4, 4), nz(d, -5, 5)])), Qp = xv(pc([d.int(1, 3), nz(d, -4, 4)])), Rr = d.bool() ? num(nz(d, -9, 9)) : xv(pc(nzs(d, 2, -6, 6)));
      const A = fresh(pAdd(pMul(Bd0, Qp), Rr));
      if (!intCoefs(A, 60) || A.length < 3) return null;
      const Rf = fresh(Rr), Qf = fresh(Qp), { Q: Bd, R: rest } = pDiv(pSub(A, Rf), Qf);
      if (rest.length || !same(Bd, Bd0)) return null;
      return polyA(`다항식 ${ej(pt(A), '을/를')} 다항식 ${V('B')}로 나누었을 때의 몫이 ${pt(Qf)}이고 나머지가 ${pt(Rf)}일 때, 다항식 ${V('B')}는?`, Bd, QK[2], {
        explain: `${nb(`${ph(A)} = ${V('B')}(${ph(Qf)}) + ${Rf.length === 1 && !keyOf(Rf[0].e) ? sd(Rf[0].q.p) : '(' + ph(Rf) + ')'}`)}에서 ${nb(`${V('B')}(${ph(Qf)}) = ${ph(pSub(A, Rf))}`)}이다. 따라서 ${V('B')}는 ${ej(pt(pSub(A, Rf)), '을/를')} ${ej(pt(Qf), '으로/로')} 나눈 몫 ${pt(Bd)}이다.`
      });
    }),
    T('div-coef-from-qr', '몫과 나머지가 주어질 때 나뉠 식의 계수 구하기', '②23', (d) => {
      const [p, q, r, u, v] = [nz(d, -4, 4), nz(d, -5, 5), nz(d, -4, 4), nz(d, -5, 5), nz(d, -6, 6)];
      const src = `(x^2${sg(p, 'x')}${sg(q)})(x${sg(r)})${sg(u, 'x')}${sg(v)}`, P = xv(src), ta = termOf(P, { x: 2 }), tb = termOf(P, { x: 1 }), tc = termOf(P, {});
      if (!ta || !tb || !tc) return null;
      return slots(`다항식 ${nb(`${X3} + ${va}${X2} + ${vb}${Xv} + ${V('c')}`)}를 ${ej(xh(`x^2${sg(p, 'x')}${sg(q)}`), '으로/로')} 나누었을 때의 몫이 ${xh(`x${sg(r)}`)}이고 나머지가 ${xh(`${pn([[u, 'x'], [v, '']])}`)}일 때, 상수 ${va}, ${vb}, ${V('c')}의 값은?`, [[va + ' =', ta.q.p, ta.s], [vb + ' =', tb.q.p, tb.s], [V('c') + ' =', tc.q.p, tc.s]], {
        explain: `${nb(`${X3} + ${va}${X2} + ${vb}${Xv} + ${V('c')} = ${htmlX(`(x^2${sg(p, 'x')}${sg(q)})(x${sg(r)})`)} + (${ph(xv(pn([[u, 'x'], [v, '']])))})`)} = ${ph(P)}이므로 ${va} = ${sd(ta.q.p)}, ${vb} = ${sd(tb.q.p)}, ${V('c')} = ${sd(tc.q.p)}이다.`
      });
    }),
    T('div-steps-blank', '다항식의 나눗셈 과정의 빈칸', '②24', (d) => {
      // (x³ + p x² + q x + r) ÷ (x + a): 몫 x² + (p − a)x + b, b = q − a(p − a), 셋째 줄 b x + ab, 나머지 r − ab
      const a = nz(d, -3, 3), p = nz(d, -6, 6), q = nz(d, -6, 6), r = nz(d, -9, 9), m = p - a, b = q - a * m, e = r - a * b;
      if (m === 0 || b === 0 || e === 0 || a * m === 0 || Math.abs(b) > 12) return null;
      const T1 = (c, deg, first) => { if (c === 0) return ''; const v = deg === 0 ? '' : deg === 1 ? Xv : Xv + sup(deg), mg = Math.abs(c) === 1 && deg ? '' : Math.abs(c); return first ? (c < 0 ? MINUS : '') + mg + v : (c < 0 ? MINUS + ' ' : '+ ') + mg + v; };
      const L = (h, first) => (first ? h : '+ ' + h);
      const rows = [
        { cells: ['', T1(1, 2, true), T1(m, 1), L(vb)], quot: true },
        { cells: [T1(1, 3, true), T1(p, 2), T1(q, 1), T1(r, 0)], top: true },
        { cells: [T1(1, 3, true), T1(a, 2), '', ''], line: true },
        { cells: ['', T1(m, 2, true), T1(q, 1), ''] },
        { cells: ['', T1(m, 2, true), T1(a * m, 1), ''], line: true },
        { cells: ['', '', T1(b, 1, true), T1(r, 0)] },
        { cells: ['', '', V('c') + Xv, '+ ' + V('d')], line: true },
        { cells: ['', '', '', V('e')] }
      ];
      const plainT = (h) => String(h).replace(/<sup>(\d)<\/sup>/g, '^$1').replace(/<[^>]+>/g, '');
      const aria = `다항식의 나눗셈 세로셈. 나누는 식 x + a, 나누어지는 식 ${rows[1].cells.map(plainT).join(' ')}, 몫 ${rows[0].cells.map(plainT).join(' ').trim()}. 빼는 식과 남은 식을 차례로: ${rows.slice(2).map((row) => row.cells.map(plainT).join(' ').trim()).join(' / ')}`;
      const fig = polyDivTable(`${Xv} + ${va}`, rows, aria);
      return slots(`다음은 다항식 ${ej(nb(rows[1].cells.join(' ')), '을/를')} ${nb(`${Xv} + ${va}`)}로 나누는 과정이다. 상수 ${va}, ${vb}, ${V('c')}, ${V('d')}, ${V('e')}의 값은?`, [
        [va + ' =', a, jn(a)], [vb + ' =', b, jn(b)], [V('c') + ' =', b, jn(b)], [V('d') + ' =', a * b, `${jn(a)}*${jn(b)}`], [V('e') + ' =', e, `${jn(r)}-${jn(a)}*${jn(b)}`]
      ], {
        figure: fig,
        explain: `첫째 줄에서 ${nb(`(${Xv} + ${va}) × ${X2} = ${X3} ${a < 0 ? MINUS : '+'} ${Math.abs(a) === 1 ? '' : Math.abs(a)}${X2}`)}이므로 ${va} = ${sd(a)}이다. 둘째 뺄셈 뒤에 남은 식이 ${nb(`${T1(b, 1, true)} ${T1(r, 0)}`)}이므로 몫의 상수항은 ${vb} = ${sd(b)}이고, ${nb(`(${Xv} ${a < 0 ? MINUS : '+'} ${Math.abs(a)}) × (${sd(b)}) = ${T1(b, 1, true)} ${T1(a * b, 0)}`)}에서 ${V('c')} = ${sd(b)}, ${V('d')} = ${sd(a * b)}이다. 나머지는 ${V('e')} = ${sd(r)} − (${sd(a * b)}) = ${sd(e)}이다.`
      });
    }),
    T('div-redivide', '몫과 나머지로 식을 구해 다른 식으로 나눈 나머지', '②26', (d) => {
      const B1 = xv(pc([1, nz(d, -3, 3), nz(d, -5, 5)])), Q1 = xv(pc([1, nz(d, -4, 4)])), R1 = xv(pc(nzs(d, 2, -5, 5))), B2 = xv(pc([1, nz(d, -3, 3), nz(d, -5, 5)]));
      if (same(B1, B2)) return null;
      const P = pAdd(pMul(B1, Q1), R1), { R } = pDiv(P, B2), ta = termOf(R, { x: 1 }), tb = termOf(R, {});
      if (!ta || !tb || !intCoefs(R, 60)) return null;
      return linAns(`다항식 ${V('P')}를 ${ej(pt(B1), '으로/로')} 나누었을 때의 몫이 ${pt(Q1)}이고 나머지가 ${pt(R1)}이다. ${V('P')}를 ${ej(pt(B2), '으로/로')} 나누었을 때의 나머지는?`, ta.q.p, tb.q.p, Xv, {
        explain: `${nb(`${V('P')} = (${ph(B1)})(${ph(Q1)}) + (${ph(R1)})`)} = ${ph(P)}이다. 이것을 ${ej(pt(B2), '으로/로')} 나누면 몫은 ${pt(pDiv(P, B2).Q)}, 나머지는 ${pt(R)}이다.`,
        facts: { calc: [[ta.s, 0], [tb.s, 1]] }
      });
    }),
    T('div-exact-param', '나누어떨어질 때 계수 구하기', '②27', (d) => {
      // (x² + m x + b)(p3 x + k) = p3 x³ + (k + m p3) x² + (m k + b p3) x + b k
      const p3 = d.int(1, 3), m = d.int(-3, 3), k = nz(d, -4, 4), b = nz(d, -5, 5), p2 = k + m * p3, a = m * k + b * p3, p0 = b * k;
      if (p2 === 0 || a === 0) return null;
      const dividend = `${pn([[p3, 'x^3'], [p2, 'x^2']])}+ax${sg(p0)}`, divisor = `x^2${m ? sg(m, 'x') : ''}+b`;
      const kS = `(${jn(p2)}-${jn(m)}*${p3})`;
      return slots(`다항식 ${ej(xh(dividend), '이/가')} ${ej(xh(divisor), '으로/로')} 나누어떨어질 때, 상수 ${va}, ${vb}의 값은?`, [[va + ' =', a, `${jn(m)}*${kS}+(${jn(p0)}/${kS})*${p3}`], [vb + ' =', b, `${jn(p0)}/${kS}`]], {
        explain: `문자가 든 채로 나누면 몫은 ${pt(xv(pc([p3, k])))}이고, 나머지는 ${nb(`(${poly([[1, va], [-p3, vb], [-m * k, '']])})${Xv} + (${poly([[-k, vb], [p0, '']])})`)}이다. 나누어떨어지므로 두 계수가 모두 0이어서 ${vb} = ${sd(b)}, ${va} = ${sd(a)}이다.`
      });
    }),
    T('div-rem-param', '나머지가 주어질 때 계수 구하기', '②28', (d, n) => {
      if (n === 0) {
        // x³ + a x + b ÷ (x² + m x + q) = (x − m) … 나머지 u x + v → a = q − m² + u, b = −qm + v
        const m = nz(d, -3, 3), q = nz(d, -5, 5), u = nz(d, -6, 6), v = nz(d, -6, 6), a = q - m * m + u, b = -q * m + v;
        if (a === 0 || b === 0) return null;
        return slots(`다항식 ${nb(`${X3} + ${va}${Xv} + ${vb}`)}를 ${ej(xh(`x^2${sg(m, 'x')}${sg(q)}`), '으로/로')} 나누었을 때의 나머지가 ${xh(pn([[u, 'x'], [v, '']]))}일 때, 상수 ${va}, ${vb}의 값은?`, [[va + ' =', a, `${jn(q)}-${jn(m)}*${jn(m)}+${jn(u)}`], [vb + ' =', b, `-${jn(q)}*${jn(m)}+${jn(v)}`]], {
          rule: 'rem-dividend', explain: `문자가 든 채로 나누면 몫은 ${pt(xv(pc([1, -m])))}이고 나머지는 ${nb(`${m * m - q === 0 ? va : '(' + poly([[1, va], [m * m - q, '']]) + ')'}${Xv} + ${poly([[1, vb], [q * m, '']])}`)}이다. 이것이 ${ej(xh(pn([[u, 'x'], [v, '']])), '과/와')} 같으므로 ${va} = ${sd(a)}, ${vb} = ${sd(b)}이다.`
        });
      }
      // x³ + p x² + q x + r ÷ (x² + a x + s), 나머지 u x + v → 상수항에서 a = p − (r − v)/s
      const a = nz(d, -3, 3), s = d.pick([1, 2, 3, -1, -2]), p = nz(d, -5, 5), q = nz(d, -6, 6), r = nz(d, -9, 9), u = q - s - a * (p - a), v = r - s * (p - a);
      if (u === 0 || v === 0 || p === a) return null;
      // 상수항에서 얻는 a 는 하나뿐이다(일차항의 계수 u = q − s − a(p − a) 는 같은 a 에서 맞는다).
      return numQ1(`다항식 ${ej(xh(pc([1, p, q, r])), '을/를')} ${ej(nb(`${X2} + ${va}${Xv} ${s < 0 ? MINUS : '+'} ${Math.abs(s)}`), '으로/로')} 나누었을 때의 나머지가 ${xh(pn([[u, 'x'], [v, '']]))}일 때, 상수 ${va}의 값은?`, a, {
        calc: `${jn(p)}-(${jn(r)}-${jn(v)})/${jn(s)}`, rule: 'rem-divisor',
        explain: `문자가 든 채로 나누면 몫은 ${nb(`${Xv} + (${sd(p)} − ${va})`)}이고 나머지의 상수항은 ${nb(`${sd(r)} − ${jd(s)} × (${sd(p)} − ${va})`)}이다. 이것이 ${sd(v)}이므로 ${va} = ${sd(a)}이다. 이때 나머지의 일차항의 계수도 ${ej(sd(u), '으로/로')} 맞는다.`
      });
    }, { count: 2 }),
    T('div-eq-value', '나눗셈 등식에서 식의 값', '②29', (d) => {
      const c = nz(d, -4, 4), Qp = xv(pc([1, nz(d, -4, 4), nz(d, -5, 5)])), r = nz(d, -9, 9), k = d.pick([1, 2, -1, 3, -2].filter((x) => x !== -c));
      const src = `(x${sg(c)})(${srcOf(Qp)})${sg(r)}`, V0 = xv(src, { x: k });
      const v = V0.length ? V0[0].q.p : 0;
      if (!V0.length || Math.abs(v) > 999) return null;
      return numQ1(`다항식 ${V('P')}(${Xv})를 ${ej(xh(`x${sg(c)}`), '으로/로')} 나누었을 때의 몫이 ${pt(Qp)}이고 나머지가 ${sd(r)}일 때, ${V('P')}(${sd(k)})의 값은?`, v, {
        calc: V0[0].s, explain: `${nb(`${V('P')}(${Xv}) = (${Xv} ${c < 0 ? MINUS : '+'} ${Math.abs(c)})(${ph(Qp)}) ${r < 0 ? MINUS : '+'} ${Math.abs(r)}`)}이므로 ${Xv} = ${ej(sd(k), '을/를')} 넣으면 ${V('P')}(${sd(k)}) = ${sd(v)}이다.`
      });
    }),
    T('div-degree-meaning', '나머지의 차수와 나눗셈 등식의 뜻', '②30', (d, n) => {
      if (n === 0) {
        const Bd = xv(pc([1, nz(d, -3, 3), nz(d, -4, 4)])), L1 = xv(pc([1, nz(d, -4, 4)])), R1 = xv(pc(nzs(d, 2, -5, 5))), A = pAdd(pMul(Bd, L1), R1);
        const eq = eqTail(`${V('A')} = (${ph(Bd)})(${ph(L1)})`, R1, '이/가');
        const s = [
          [`${V('A')}를 ${ej(pt(Bd), '으로/로')} 나누었을 때의 몫은 ${pt(L1)}, 나머지는 ${pt(R1)}이다.`, true],
          [`${V('A')}를 ${ej(pt(L1), '으로/로')} 나누었을 때의 몫은 ${pt(Bd)}, 나머지는 ${pt(R1)}이다.`, false],
          [`${V('A')}를 ${ej(pt(L1), '으로/로')} 나누었을 때의 나머지는 상수이다.`, true],
          [`${ej(nb(`${V('A')} − (${ph(R1)})`), '은/는')} ${ej(pt(L1), '으로/로')} 나누어떨어진다.`, true]
        ];
        const order = d.shuffle([0, 1, 2, 3]);
        void A;
        return C(`다항식 ${V('A')}에 대하여 등식 ${eq} 성립할 때, 옳지 않은 것은?`, order.map((i) => s[i][0]), order.indexOf(1), {
          explain: `나머지는 나누는 식보다 차수가 낮아야 한다. ${ej(pt(R1), '은/는')} 일차식이므로 일차식 ${ej(pt(L1), '으로/로')} 나눈 나머지가 될 수 없다. ${ej(pt(L1), '으로/로')} 나누면 ${ej(pt(R1), '을/를')} 한 번 더 나누어야 하므로 나머지는 상수이다.`,
          facts: { truth: order.map((i) => s[i][1]), want: false, rule: 'meaning-pick' }
        });
      }
      // A = (x + c)(m x³ + n x²) + (α x² + β x + γ) 에서 A 를 x + c 로 나눈 몫과 나머지
      const c = nz(d, -3, 3), mm = d.int(1, 3), nn = nz(d, -4, 4), al = nz(d, -4, 4), be = nz(d, -5, 5), ga = nz(d, -6, 6);
      const Lc = xv(pc([1, c])), Q0 = xv(pn([[mm, 'x^3'], [nn, 'x^2']])), R0 = xv(pc([al, be, ga])), A = fresh(pAdd(pMul(Lc, Q0), R0));
      const { Q: Qp, R } = pDiv(A, Lc);
      if (!hasKeys(Qp, QK[3]) || !R.length || !intCoefs(A, 60)) return null;
      return divAns(`다항식 ${nb(`${V('A')} = ${ph(A)}`)}에 대하여 등식 ${eqTail(`${V('A')} = (${ph(Lc)})(${ph(Q0)})`, R0, '이/가')} 성립한다. ${V('A')}를 ${ej(pt(Lc), '으로/로')} 나누었을 때의 몫과 나머지를 구하시오.`, Qp, R, QK[3], [''], {
        rule: 'meaning-fix', explain: `${ej(pt(R0), '은/는')} ${pt(Lc)}보다 차수가 낮지 않으므로 나머지가 아니다. ${ej(pt(R0), '을/를')} ${ej(pt(Lc), '으로/로')} 한 번 더 나누면 몫은 ${pt(pDiv(R0, Lc).Q)}, 나머지는 ${pt(pDiv(R0, Lc).R)}이므로 ${V('A')}를 나눈 몫은 ${nb(`${ph(Q0)} + (${ph(pDiv(R0, Lc).Q)})`)} = ${ph(Qp)}, 나머지는 ${pt(R)}이다.`
      });
    }, { count: 2 }),
    T('div-same-rem', '나머지가 같은 다항식 고르기', '②35', (d) => {
      const k = d.int(1, 3), Dv = xv(`x^2+${k}`), A = xv(pc([1, nz(d, -4, 4), nz(d, -4, 4), nz(d, -5, 5)])), RA = pDiv(A, Dv).R;
      const shift = () => pMul(Dv, xv(pc([d.int(-1, 2), nz(d, -3, 3)])));
      const right = pAdd(A, shift());
      const wrong = [num(1), num(-2), xv('x'), xv('-x'), xv('2x+1')].map((delta) => pAdd(pAdd(A, shift()), delta));
      const pool = [right].concat(d.shuffle(wrong).slice(0, 3));
      if (pool.some((P) => P.length < 2 || !intCoefs(P, 30) || !termOf(P, { x: 3 })) || pool.some((P, i) => pool.some((Q2, j) => j > i && same(P, Q2))) || same(right, A)) return null;
      const truth = pool.map((P) => same(pDiv(P, Dv).R, RA));
      if (truth.filter(Boolean).length !== 1) return null;
      const order = d.shuffle([0, 1, 2, 3]);
      return C(`다음 중 ${ej(pt(Dv), '으로/로')} 나누었을 때의 나머지가 다항식 ${ej(pt(A), '을/를')} ${ej(pt(Dv), '으로/로')} 나누었을 때의 나머지와 같은 것은?`, order.map((i) => pt(pool[i])), order.indexOf(0), {
        explain: `${ej(pt(A), '을/를')} ${ej(pt(Dv), '으로/로')} 나눈 나머지는 ${pt(RA)}이다. 보기를 저마다 나누어 보면 나머지가 ${pt(RA)}인 것은 ${pt(right)}뿐이다. 이 식과 ${pt(A)}의 차는 ${ej(pt(Dv), '으로/로')} 나누어떨어진다.`,
        facts: { truth: order.map((i) => truth[i]), want: true }
      });
    })
  ];
  // 다항식의 나눗셈 세로셈(표). rows: [{ cells: [x³ 칸, x² 칸, x 칸, 상수항 칸], quot(몫 줄), top(나뉠 식 줄), line(아래에 줄을 긋는다) }]
  function polyDivTable(divH, rows, aria) {
    const td = (h, css) => `<td style="padding:1px 4px;text-align:right;white-space:nowrap${css ? ';' + css : ''}">${h || ''}</td>`;
    const body = rows.map((row) => `<tr>${td(row.top ? divH : '', row.top ? 'border-right:1.6px solid #1f2933;padding-right:6px' : '')}${row.cells.map((h) => td(h, (row.top ? 'border-top:1.6px solid #1f2933' : '') + (row.line && h ? 'border-bottom:1.2px solid #1f2933' : ''))).join('')}</tr>`).join('');
    return `<table role="img" aria-label="${aria}" style="border-collapse:collapse;font-size:1.08rem;margin:4px auto 2px">${body}</table>`;
  }

  B.addTypes(UNIT, 'formula', formulaTypes);
  B.addTypes(UNIT, 'value', valueTypes);
  B.addTypes(UNIT, 'div', divTypes);
})(typeof window !== 'undefined' ? window : globalThis);
