// 고등학교 1학년 1학기 공통수학1 Ⅰ-2 「나머지정리와 인수분해」 — 뒤쪽 묶음(인수분해 공식, 공통부분을 묶는 인수분해, 인수정리를 이용한 인수분해,
// 여러 문자가 섞인 식, 인수분해로 수 계산하기).
// 단원 틀과 도구(식 글·다항식·조립제법 표·인수분해한 식의 답 칸), 싣는 기준, 뺀 것과 까닭은 10-1-2a.js 에 있다. ref: ①n = 기본꼴_1, ②n = 기본꼴_2의 n번.
// 인수분해한 식은 괄호째 끼워 넣는 칸으로 받는다. 차례를 바꾸어 적어도 되는 인수는 묶음(blocks)이나 차례 무관(unordered)으로 받고,
// 답이 하나로 정해지도록 「각 인수의 최고차항의 계수는 자연수」를 문제 글에 붙인다. 한 유형 안에서는 인수의 꼴(일차·이차, 몇 개)이 늘 같다 —
// 더 인수분해되는 이차식이 남는 꼴과 남지 않는 꼴은 서로 다른 유형으로 나누었다.
// 고르기의 틀린 보기는 부호를 바꾼 식, 공식의 가운데 항 부호를 바꾼 식처럼 아이들이 하는 잘못으로 만들고, 참·거짓은 전개해 견주어 코드가 가린다.
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, C } = B.kit;
  const { MINUS, gcd, Q, nb, tail, V, sup, ex, nz } = B.kit.mid;
  const K = B.kit.m1012;
  const { UNIT, S2, NOTE1, T, sn, jn, sh, sgv, nj, pv, plusN, X, PX, va, vb, vc, eqL, HAN, range, xv, same, srcOf, term, pNeg, xh, xe, xex, ej, xj, pn, lin, Dsc,
    aMul, aProd, aDiv, aSrc, aH, aJ, L, numU, slots, polyQ, facAns, facPoly, pickQ, comboQ, valX } = K;
  const X2 = X + sup(2), Y = V('y'), Y2 = V('y') + sup(2), XY = X + V('y'), XX = V('X'), A3 = va + sup(3);
  const isSq = (n) => n >= 0 && Number.isInteger(Math.sqrt(n));
  const irr = (b, c) => !isSq(b * b - 4 * c);                    // x² + bx + c 는 정수 계수로 더 인수분해되지 않는다
  const isCube = (n) => Number.isInteger(Math.round(Math.cbrt(n))) && Math.round(Math.cbrt(n)) ** 3 === n;
  const isPrime = (n) => { if (n < 2) return false; for (let k = 2; k * k <= n; k += 1) if (n % k === 0) return false; return true; };
  const FACT = '다음 식을 인수분해하시오.';
  // 거듭제곱의 글: 항이 문자 하나(계수 1)이면 괄호 없이 x³, 아니면 (3x)³
  const pw = (s0, n) => (/^-?[a-z]$/.test(s0) && !s0.startsWith('-') ? xh(s0) + sup(n) : '(' + xh(s0) + ')' + sup(n));
  const NOTE_LEAD = ' (단, 각 인수의 최고차항의 계수는 자연수이고, 계수가 1이면 1을 적는다.)';
  // 인수분해 문항: 답(factors)을 전개한 것이 처음 식과 같은지 확인한 뒤 칸을 만든다.
  function facQ(text, target, factors, o) {
    if (!same(facPoly(factors), xv(target))) throw new Error('인수분해가 처음 식과 다르다: ' + target);
    return facAns(text, factors, Object.assign({ poly: target, figure: xex(target) }, o));
  }
  const lf = (c) => ({ t: [[1, X, 'f'], [c, '', 's']] });          // x + c
  const qf = (b, c) => ({ t: [[1, X2, 'f'], [b, X, 's'], [c, '', 's']] });   // x² + bx + c
  const fx = (c) => xh(lin(1, c));                                // x + c 의 글
  const fq = (b, c) => xh(pn([[1, 'x^2'], [b, 'x'], [c, '']]));   // x² + bx + c 의 글

  // ── 마. 인수분해 공식 ──
  const GOOD = [['a^2+b^2+c^2+2ab+2bc+2ca', '(a+b+c)^2'], ['a^3+3a^2b+3ab^2+b^3', '(a+b)^3'], ['a^3-3a^2b+3ab^2-b^3', '(a-b)^3'], ['a^3+b^3', '(a+b)(a^2-ab+b^2)'], ['a^3-b^3', '(a-b)(a^2+ab+b^2)']];
  const BAD = [['a^3+b^3', '(a+b)(a^2+ab+b^2)'], ['a^3-b^3', '(a-b)(a^2-ab+b^2)'], ['a^3+b^3', '(a+b)^3'], ['a^3-b^3', '(a-b)^3'], ['a^3-3a^2b+3ab^2-b^3', '(a+b)(a-b)^2'],
    ['a^2+b^2+c^2-2ab-2bc-2ca', '(a-b-c)^2'], ['a^3+3a^2b+3ab^2+b^3', '(a+b)(a^2+ab+b^2)'], ['a^3-3a^2b+3ab^2-b^3', '(b-a)^3']];
  const formulaTypes = [
    T('fml-which', '인수분해 공식 가리기', '②1', (d) => {
      const wantTrue = d.bool(), good = d.shuffle(GOOD).slice(0, wantTrue ? 1 : 4), bad = d.shuffle(BAD).slice(0, wantTrue ? 4 : 1);
      const rows = good.concat(bad).map(([l, r]) => ({ h: xh(l) + ' = ' + xh(r), ok: same(xv(l), xv(r)) }));
      const wrong = rows.filter((r) => !r.ok).map((r) => r.h);
      return pickQ(d, `다음 중 인수분해가 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, rows, {
        want: wantTrue, explain: `오른쪽을 전개하여 왼쪽과 견준다. 인수분해 공식은 ${GOOD.map(([l, r]) => xh(l) + ' = ' + xh(r)).slice(3).join(', ')}처럼 가운데 항의 부호가 둘째 인수의 부호와 반대이다. ${wantTrue ? '옳지 않은 것은 ' + wrong.join(', ') + '이다.' : '옳지 않은 것은 ' + wrong[0] + '이다.'}`
      });
    }),
    T('fml-sq3', '(a+b+c)² 꼴 인수분해', '②2', (d, n) => {
      if (n === 0) {
        const p = d.int(1, 3), q = nz(d, -3, 3), r = nz(d, -3, 3);
        if (p === 1 && Math.abs(q) === 1 && Math.abs(r) === 1) return null;
        const target = pn([[p * p, 'a^2'], [q * q, 'b^2'], [r * r, 'c^2'], [2 * p * q, 'ab'], [2 * q * r, 'bc'], [2 * r * p, 'ca']]);
        return facQ(FACT, target, [{ t: [[p, va, 'n'], [q, vb, 's'], [r, vc, 's']], p: 2 }], {
          note: ` (단, ${va}의 계수는 자연수이고, 계수가 1이면 1을 적는다.)`, rule: 'three',
          explain: `세 항 ${xh(pn([[p, 'a']]))}, ${xh(pn([[q, 'b']]))}, ${xh(pn([[r, 'c']]))}의 제곱의 합과 두 항끼리 곱의 2배의 합이므로 ${xh(target)} = ${xh(`(${pn([[p, 'a'], [q, 'b'], [r, 'c']])})^2`)}이다. 제곱항에서 크기를, ${va}${vb}, ${vb}${vc}, ${vc}${va}의 계수의 부호에서 각 항의 부호를 정한다.`
        });
      }
      const p = d.int(1, 3), q = nz(d, -3, 3), r = nz(d, -3, 3);
      const target = pn([[p * p, 'x^2'], [q * q, 'y^2'], [r * r, ''], [2 * p * q, 'xy'], [2 * q * r, 'y'], [2 * p * r, 'x']]);
      return facQ(FACT, target, [{ t: [[p, X, 'n'], [q, Y, 's'], [r, '', 's']], p: 2 }], {
        note: ` (단, ${X}의 계수는 자연수이고, 계수가 1이면 1을 적는다.)`, rule: 'with-constant',
        explain: `세 항 ${xh(pn([[p, 'x']]))}, ${xh(pn([[q, 'y']]))}, ${sn(r)}의 제곱과 두 항끼리 곱의 2배로 이루어져 있으므로 ${xh(target)} = ${xh(`(${pn([[p, 'x'], [q, 'y'], [r, '']])})^2`)}이다.`
      });
    }, { count: 2 }),
    T('fml-cube', '완전세제곱 꼴 인수분해', '②3', (d, n) => {
      const p = d.int(1, 3), q = nz(d, -3, 3);
      if (gcd(p, Math.abs(q)) !== 1 || (p === 1 && Math.abs(q) === 1)) return null;
      if (n === 0) {
        const target = pn([[p ** 3, 'x^3'], [3 * p * p * q, 'x^2'], [3 * p * q * q, 'x'], [q ** 3, '']]);
        return facQ(FACT, target, [{ t: [[p, X, 'n'], [q, '', 's']], p: 3 }], {
          rule: 'one-letter',
          explain: `${xh(target)} = ${pw(pn([[p, 'x']]), 3)} ${q < 0 ? MINUS : '+'} 3 × ${pw(pn([[p, 'x']]), 2)} × ${Math.abs(q)} + 3 × ${xh(pn([[p, 'x']]))} × ${Math.abs(q)}${sup(2)} ${q < 0 ? MINUS : '+'} ${Math.abs(q)}${sup(3)}이므로 ${xh(`(${lin(p, q)})^3`)}이다.`
        });
      }
      const target = pn([[p ** 3, 'a^3'], [3 * p * p * q, 'a^2b'], [3 * p * q * q, 'ab^2'], [q ** 3, 'b^3']]);
      return facQ(FACT, target, [{ t: [[p, va, 'n'], [q, vb, 's']], p: 3 }], {
        rule: 'two-letters',
        explain: `첫째 항이 ${pw(pn([[p, 'a']]), 3)}, 넷째 항이 ${pw(pn([[q, 'b']]), 3)}이고 가운데 두 항이 ${xh(`3(${pn([[p, 'a']])})^2(${pn([[q, 'b']])})`)}, ${xh(`3(${pn([[p, 'a']])})(${pn([[q, 'b']])})^2`)}이므로 ${xh(`(${pn([[p, 'a'], [q, 'b']])})^3`)}이다.`
      });
    }, { count: 2 }),
    T('fml-sumcube', '세제곱의 합·차 인수분해', '②4', (d, n) => {
      const p = d.int(1, 4), q = d.int(1, 5), s = d.pick([1, -1]);
      if (gcd(p, q) !== 1 || (p === 1 && q === 1 && n === 1)) return null;
      const ex2 = `(${pn([[p, 'x'], [s * q, n === 0 ? '' : 'y']])})`;
      if (n === 0) {
        const target = pn([[p ** 3, 'x^3'], [s * q ** 3, '']]);
        return facQ(FACT + NOTE_LEAD, target, [{ t: [[p, X, 'n'], [s * q, '', 's']] }, { t: [[p * p, X2, 'n'], [-s * p * q, X, 's'], [q * q, '', 's']] }], {
          note: '', rule: 'number',
          explain: `${xh(target)} = ${pw(pn([[p, 'x']]), 3)} ${s < 0 ? MINUS : '+'} ${q}${sup(3)}이므로 공식 ${xh(s < 0 ? 'a^3-b^3' : 'a^3+b^3')} = ${xh(s < 0 ? '(a-b)(a^2+ab+b^2)' : '(a+b)(a^2-ab+b^2)')}에서 ${xh(`${ex2}(${pn([[p * p, 'x^2'], [-s * p * q, 'x'], [q * q, '']])})`)}이다.`
        });
      }
      const target = pn([[p ** 3, 'x^3'], [s * q ** 3, 'y^3']]);
      return facQ(FACT + NOTE_LEAD, target, [{ t: [[p, X, 'n'], [s * q, Y, 's']] }, { t: [[p * p, X2, 'n'], [-s * p * q, XY, 's'], [q * q, Y2, 's']] }], {
        note: '', rule: 'two-letters',
        explain: `${xh(target)} = ${pw(pn([[p, 'x']]), 3)} ${s < 0 ? MINUS : '+'} ${pw(pn([[q, 'y']]), 3)}이므로 ${xh(`${ex2}(${pn([[p * p, 'x^2'], [-s * p * q, 'xy'], [q * q, 'y^2']])})`)}이다.`
      });
    }, { count: 2 }),
    T('fml-common', '공통인수를 묶은 뒤 공식', '②5', (d) => {
      const k = d.int(2, 5), p = d.int(1, 3), q = d.int(1, 3), s = d.pick([1, -1]);
      if (gcd(p, q) !== 1 || (p === 1 && q === 1)) return null;
      const target = pn([[k * p ** 3, 'x^3'], [s * k * q ** 3, 'y^3']]);
      return facQ(FACT + NOTE_LEAD, target, [{ raw: true, t: [[k, '', 'n']] }, { t: [[p, X, 'n'], [s * q, Y, 's']] }, { t: [[p * p, X2, 'n'], [-s * p * q, XY, 's'], [q * q, Y2, 's']] }], {
        note: '',
        explain: `공통인수 ${k}${tail(k, '으로/로')} 묶으면 ${k}(${xh(pn([[p ** 3, 'x^3'], [s * q ** 3, 'y^3']]))})이고, 괄호 안을 세제곱의 ${s < 0 ? '차' : '합'} 공식으로 인수분해하면 ${xh(`${k}(${pn([[p, 'x'], [s * q, 'y']])})(${pn([[p * p, 'x^2'], [-s * p * q, 'xy'], [q * q, 'y^2']])})`)}이다.`
      });
    }),
    T('fml-six', '제곱의 차에서 세제곱의 합·차로', '②6', (d) => {
      const k = d.pick([1, 2, 3]), target = `x^6-${k ** 6}`, K2 = k * k;
      const right = `(x+${k})(x-${k})(x^2+${k === 1 ? '' : k}x+${K2})(x^2-${k === 1 ? '' : k}x+${K2})`;
      const pool = [`(x+${k})(x-${k})(x^2+${K2})^2`, `(x+${k})^2(x-${k})^2(x^2+${K2})`, `(x-${k})^2(x^2+${k === 1 ? '' : k}x+${K2})^2`, `(x+${k})(x-${k})(x^2+${k === 1 ? '' : k}x-${K2})(x^2-${k === 1 ? '' : k}x-${K2})`, `(x+${k})^3(x-${k})^3`, `(x-${k})(x+${k})(x^2+${K2})(x^2-${K2})`];
      // 보기는 인수마다 묶어 좁은 화면에서는 인수 사이에서 줄이 갈리게 한다.
      const xhF = (w) => w.match(/\([^()]*\)(\^\d+)?/g).map(xh).join('');
      const rows = [{ h: xhF(right), ok: true }].concat(d.shuffle(pool).slice(0, 4).map((w) => ({ h: xhF(w), ok: same(xv(w), xv(target)) })));
      return pickQ(d, `다항식 ${xj(`x^6-${k ** 6}`, '을/를')} 인수분해한 것은?`, rows, {
        explain: `${xh(target)} = (${X}${sup(3)})${sup(2)} ${MINUS} ${k ** 3}${sup(2)} = (${xh(`x^3+${k ** 3}`)})(${xh(`x^3-${k ** 3}`)})이고, 세제곱의 합과 차를 다시 인수분해하면 ${xh(right)}이다.`
      });
    }),
    T('fml-cube-block', '덩어리의 완전세제곱 꼴', '②7', (d, n) => {
      if (n === 0) {
        const s = nz(d, -4, 4), k = d.pick([1, -1, 2, -2]), A = `(x${sh(s)})`;
        if (s + k === 0) return null;
        const target = `${A}^3${sgv(3 * k, A + '^2')}${sgv(3 * k * k, A)}${sh(k ** 3)}`;
        return facQ(FACT, target, [{ t: [[1, X, 'f'], [s + k, '', 's']], p: 3 }], {
          rule: 'one-block',
          explain: `${xh(`x${sh(s)}`)} = ${XX}로 놓으면 주어진 식은 ${xh(pn([[1, 'X^3'], [3 * k, 'X^2'], [3 * k * k, 'X'], [k ** 3, '']]))} = ${xh(`(X${sh(k)})^3`)}이다. ${XX}에 ${xj(`x${sh(s)}`, '을/를')} 넣으면 ${xh(`(x${sh(s + k)})^3`)}이다.`
        });
      }
      const s = nz(d, -3, 3), c = d.pick([1, 2]), t = nz(d, -3, 3), A = `(x${sh(s)})`, Bs = `(${pn([[c, 'x'], [t, 'y']])})`;
      const target = `${A}^3+3${A}^2${Bs}+3${A}${Bs}^2+${Bs}^3`;
      return facQ(FACT, target, [{ t: [[1 + c, X, 'n'], [t, Y, 's'], [s, '', 's']], p: 3 }], {
        note: ` (단, ${X}의 계수는 자연수이다.)`, rule: 'two-blocks',
        explain: `${xh(A.slice(1, -1))} = ${V('A')}, ${xh(Bs.slice(1, -1))} = ${V('B')}로 놓으면 주어진 식은 ${xh('A^3+3A^2B+3AB^2+B^3')} = ${xh('(A+B)^3')}이다. ${V('A')} + ${V('B')} = ${xh(pn([[1 + c, 'x'], [t, 'y'], [s, '']]))}이므로 ${xh(`(${pn([[1 + c, 'x'], [t, 'y'], [s, '']])})^3`)}이다.`
      });
    }, { count: 2 })
  ];

  // ── 바. 공통부분을 묶는 인수분해 ──
  // (x² + px + α)(x² + px + β) + γ 꼴이나 (x² + px)² + m(x² + px) + n 꼴의 글
  function commonSrc(d, p, u, v) {
    const Xs = `x^2${sgv(p, 'x')}`;
    if (d.bool()) { const m = u + v, nn = u * v; return m === 0 ? null : `(${Xs})^2${sgv(m, '(' + Xs + ')')}${nn ? sh(nn) : ''}`; }
    const al = d.pick([0, d.int(-6, 6)]), be = u + v - al, ga = u * v - al * be;
    if (ga === 0 || al === u || al === v || al === be) return null;
    return `(${Xs}${al ? sh(al) : ''})(${Xs}${be ? sh(be) : ''})${sh(ga)}`;
  }
  const subTold = (target, p, u, v, last) => `${xh(`x^2${sgv(p, 'x')}`)} = ${XX}로 놓으면 주어진 식은 ${xh(pn([[1, 'X^2'], [u + v, 'X'], [u * v, '']]))} = ${xh(`(X${sh(u)})(X${sh(v)})`)}이다. ${XX}를 되돌리면 ${xh(`(x^2${sgv(p, 'x')}${sh(u)})(x^2${sgv(p, 'x')}${sh(v)})`)}${last ? ' = ' + last : ''}이다.`;
  const substTypes = [
    T('sub-common-split', '공통부분이 보이는 식(한 인수가 더 갈라짐)', '②8 심6', (d) => {
      const [r1, r2] = d.shuffle(range(-5, 5).filter((x) => x !== 0)).slice(0, 2), p = -(r1 + r2), u = r1 * r2, v = nz(d, -8, 8);
      if (p === 0 || v === u || !irr(p, v)) return null;
      const target = commonSrc(d, p, u, v);
      if (!target) return null;
      const ans = `(x${sh(-r1)})(x${sh(-r2)})(x^2${sgv(p, 'x')}${sh(v)})`;
      return facQ(FACT, target, [lf(-r1), lf(-r2), qf(p, v)], { blocks: [[0], [1]], explain: subTold(target, p, u, v, xh(ans)) });
    }),
    T('sub-common-two', '공통부분이 보이는 식(이차식 둘)', '②8', (d) => {
      const p = nz(d, -5, 5), u = nz(d, -9, 9), v = nz(d, -9, 9);
      if (u === v || !irr(p, u) || !irr(p, v)) return null;
      const target = commonSrc(d, p, u, v);
      if (!target) return null;
      return facQ(FACT, target, [qf(p, u), qf(p, v)], { blocks: [[0], [1]], explain: subTold(target, p, u, v, '') + ` 두 이차식은 더 인수분해되지 않는다.` });
    }),
    T('sub-common-P', '공통부분을 묶어 나머지 인수 구하기', '②8 홍교중8', (d) => {
      const s = nz(d, -3, 3), v = nz(d, -9, 9), al = nz(d, -5, 5), k = s * s + v - 2 * al, c = s * s * v - al * al, Xs = `x^2${sgv(2 * s, 'x')}`;
      if (v === s * s || k === 0 || c === 0) return null;
      const target = `(${Xs}${sh(al)})^2${sgv(k, '(' + Xs + ')')}${sh(c)}`;
      if (!same(xv(target), xv(`(x${sh(s)})^2(${Xs}${sh(v)})`))) return null;
      return polyQ(`다항식 ${xj(target, '을/를')} 인수분해하면 ${nb(`${xh(`(x${sh(s)})^2`)}${PX}`)}일 때, 다항식 ${PX}는?`, Dsc(1, 2 * s, v), ['1', `2*${jn(s)}`, `(${jn(c)}+${jn(al)}**2)/${jn(s)}**2`], {
        explain: `${xh(Xs)} = ${XX}로 놓으면 주어진 식은 ${xh(`(X${sh(al)})^2${sgv(k, 'X')}${sh(c)}`)} = ${xh(pn([[1, 'X^2'], [s * s + v, 'X'], [s * s * v, '']]))} = ${xh(`(X${sh(s * s)})(X${sh(v)})`)}이다. ${xh(`${Xs}${sh(s * s)}`)} = ${xh(`(x${sh(s)})^2`)}이므로 ${PX} = ${xh(`${Xs}${sh(v)}`)}이다.`
      });
    }),
    T('sub-linear', '일차식 덩어리 치환', '②9', (d) => {
      const k = nz(d, -3, 3), c = nz(d, -3, 3), u = nz(d, -6, 6), v = nz(d, -6, 6), m = u + v - 2 * c, nn = u * v - c * c;
      if (u >= v || m === 0) return null;
      const inner = pn([[1, 'x'], [k, 'y']]), target = `(${inner}${sh(c)})^2${sgv(m, '(' + inner + ')')}${nn ? sh(nn) : ''}`;
      return facQ(FACT, target, [{ t: [[1, X, 'f'], [k, Y, 's'], [u, '', 's']] }, { t: [[1, X, 'f'], [k, Y, 's'], [v, '', 's']] }], {
        blocks: [[0], [1]],
        explain: `${xh(inner)} = ${XX}로 놓으면 주어진 식은 ${xh(`(X${sh(c)})^2${sgv(m, 'X')}${nn ? sh(nn) : ''}`)} = ${xh(pn([[1, 'X^2'], [u + v, 'X'], [u * v, '']]))} = ${xh(`(X${sh(u)})(X${sh(v)})`)}이다. 되돌리면 ${xh(`(${inner}${sh(u)})(${inner}${sh(v)})`)}이다.`
      });
    }),
    T('sub-xx', 'x(x−p)를 덩어리로', '②10', (d) => {
      const p = nz(d, -5, 5), [t1, t2] = d.shuffle(range(-6, 6).filter((t) => t !== 0 && t !== p)).slice(0, 2), roots = [t1, p - t1, t2, p - t2];
      if (new Set(roots).size !== 4 || roots.includes(0)) return null;
      const u = t1 * (t1 - p), v = t2 * (t2 - p), m = -(u + v), nn = u * v;
      if (m === 0 || Math.abs(nn) > 150) return null;
      const target = `x^2(x${sh(-p)})^2${sgv(m, `x(x${sh(-p)})`)}${sh(nn)}`;
      return facQ(FACT, target, roots.map((r) => lf(-r)), {
        unordered: true,
        explain: `${xh(`x(x${sh(-p)})`)} = ${XX}로 놓으면 ${xh(`x^2(x${sh(-p)})^2`)} = ${XX}${sup(2)}이므로 주어진 식은 ${xh(pn([[1, 'X^2'], [m, 'X'], [nn, '']]))} = ${xh(`(X${sh(-u)})(X${sh(-v)})`)}이다. 되돌리면 ${xh(`(x^2${sgv(-p, 'x')}${sh(-u)})(x^2${sgv(-p, 'x')}${sh(-v)})`)} = ${xh(roots.map((r) => `(x${sh(-r)})`).join(''))}이다.`
      });
    }),
    T('sub-bi', 'x²를 한 문자로 — 복이차식', '②11', (d) => {
      const k = d.int(1, 4), t = nz(d, -8, 9), m = t - k * k, nn = -k * k * t;
      if (t === -k * k || m === 0 || isSq(-t)) return null;
      const target = pn([[1, 'x^4'], [m, 'x^2'], [nn, '']]);
      return facQ(FACT, target, [{ t: [[1, X, 'f'], [k, '', 'n']] }, { t: [[1, X, 'f'], [-k, '', 'm']] }, { t: [[1, X2, 'f'], [t, '', 's']] }], {
        explain: `${X}${sup(2)} = ${XX}로 놓으면 ${xh(pn([[1, 'X^2'], [m, 'X'], [nn, '']]))} = ${xh(`(X${sh(-k * k)})(X${sh(t)})`)}이다. 되돌리면 ${xh(`(x^2${sh(-k * k)})(x^2${sh(t)})`)}이고 ${xh(`x^2${sh(-k * k)}`)} = ${xh(`(x+${k})(x-${k})`)}이므로 ${xh(`(x+${k})(x-${k})(x^2${sh(t)})`)}이다.`
      });
    }),
    T('sub-a3', 'a³을 한 문자로', '②11의 변형', (d) => {
      const [u, v] = d.shuffle(range(-9, 9).filter((x) => x !== 0 && !isCube(Math.abs(x)))).slice(0, 2), m = u + v;
      if (m === 0) return null;
      const target = pn([[1, 'a^6'], [m, 'a^3'], [u * v, '']]);
      return facQ(FACT, target, [{ t: [[1, A3, 'f'], [u, '', 's']] }, { t: [[1, A3, 'f'], [v, '', 's']] }], {
        unordered: true,
        explain: `${va}${sup(3)} = ${XX}로 놓으면 ${xh(pn([[1, 'X^2'], [m, 'X'], [u * v, '']]))} = ${xh(`(X${sh(u)})(X${sh(v)})`)}이므로 ${xh(`(a^3${sh(u)})(a^3${sh(v)})`)}이다.`
      });
    }),
    T('sub-ab2', 'A²−B² 꼴로 고치는 복이차식', '②12', (d) => {
      const c = nz(d, -5, 5), k = d.int(1, 4), m = 2 * c - k * k;
      if (isSq(k * k - 4 * c) || isSq(m * m - 4 * c * c)) return null;
      const target = pn([[1, 'x^4'], [m, 'x^2'], [c * c, '']]);
      return facQ(FACT, target, [{ t: [[1, X2, 'f'], [k, X, 'n'], [c, '', 's']] }, { t: [[1, X2, 'f'], [-k, X, 'm'], [c, '', 's']] }], {
        explain: `${xh(target)} = ${xh(`(x^4${sgv(2 * c, 'x^2')}+${c * c})`)} ${MINUS} ${xh(pn([[k * k, 'x^2']]))} = (${xh(`x^2${sh(c)}`)})${sup(2)} ${MINUS} (${xh(pn([[k, 'x']]))})${sup(2)}이므로 ${xh(`(x^2${sgv(k, 'x')}${sh(c)})(x^2${sgv(-k, 'x')}${sh(c)})`)}이다.`
      });
    }),
    T('sub-ab2-two', '두 문자의 복이차식', '②13', (d) => {
      const c = nz(d, -5, 5), k = d.int(1, 4), m = 2 * c - k * k;
      if (isSq(k * k - 4 * c) || isSq(m * m - 4 * c * c)) return null;
      const target = pn([[1, 'x^4'], [m, 'x^2y^2'], [c * c, 'y^4']]);
      return facQ(FACT, target, [{ t: [[1, X2, 'f'], [k, XY, 'n'], [c, Y2, 's']] }, { t: [[1, X2, 'f'], [-k, XY, 'm'], [c, Y2, 's']] }], {
        explain: `${xh(target)} = (${xh(`x^2${sgv(c, 'y^2')}`)})${sup(2)} ${MINUS} (${xh(pn([[k, 'xy']]))})${sup(2)}이므로 ${xh(`(x^2${sgv(k, 'xy')}${sgv(c, 'y^2')})(x^2${sgv(-k, 'xy')}${sgv(c, 'y^2')})`)}이다.`
      });
    }),
    T('sub-ab2-pick', '복이차식의 인수 고르기', '②14', (d) => {
      const c = d.int(1, 5), k = d.int(1, 3), m = 2 * c - k * k, s = d.pick([1, -1]);
      if (isSq(k * k - 4 * c) || isSq(m * m - 4 * c * c)) return null;
      const P = Dsc(1, 0, m, 0, c * c), cand = [[s * k, c], [s * k, -c], [c, k], [-s * k, c + 1], [0, c], [s * (k + 1), c], [k, c - 1]];
      const rows = cand.map(([b, e]) => ({ h: xh(pn([[1, 'x^2'], [b, 'x'], [e, '']])), ok: aDiv(P, Dsc(1, b, e)).r.every((q) => q.p === 0) }));
      const one = rows[0], rest = d.shuffle(rows.slice(1).filter((r) => !r.ok)).slice(0, 4);
      return pickQ(d, `다음 중 다항식 ${aH(P)}의 인수인 것은?`, [one].concat(rest), {
        explain: `${aH(P)} = (${xh(`x^2+${c}`)})${sup(2)} ${MINUS} (${xh(pn([[k, 'x']]))})${sup(2)} = ${xh(`(x^2${sgv(k, 'x')}+${c})(x^2${sgv(-k, 'x')}+${c})`)}이므로 인수인 것은 ${one.h}이다.`
      });
    }),
    T('sub-four', '네 일차식의 곱에 수를 더한 식', '②15', (d) => {
      const p = nz(d, -6, 6), [a, b] = d.shuffle(range(-6, 6).filter((x) => x !== 0 && x !== p && 2 * x !== p)).slice(0, 2), dd = p - a, c = p - b;
      if (new Set([a, b, c, dd]).size !== 4 || [c, dd].includes(0) || Math.abs(c) > 7 || Math.abs(dd) > 7) return null;
      const u = nz(d, -12, 12), v = a * dd + b * c - u, e = u * v - a * dd * b * c;
      if (u === v || e === 0 || !irr(p, u) || !irr(p, v) || Math.abs(e) > 300) return null;
      const target = d.shuffle([a, b, c, dd]).map((r) => `(x${sh(r)})`).join('') + sh(e);
      return facQ(FACT, target, [qf(p, u), qf(p, v)], {
        blocks: [[0], [1]],
        explain: `상수항의 합이 같은 것끼리 짝지으면 ${xh(`(x${sh(a)})(x${sh(dd)})`)} = ${xh(pn([[1, 'x^2'], [p, 'x'], [a * dd, '']]))}, ${xh(`(x${sh(b)})(x${sh(c)})`)} = ${xh(pn([[1, 'x^2'], [p, 'x'], [b * c, '']]))}이다. ${xh(pn([[1, 'x^2'], [p, 'x']]))} = ${XX}로 놓으면 ${xh(`(X${sh(a * dd)})(X${sh(b * c)})${sh(e)}`)} = ${xh(pn([[1, 'X^2'], [u + v, 'X'], [u * v, '']]))} = ${xh(`(X${sh(u)})(X${sh(v)})`)}이므로 ${xh(`(x^2${sgv(p, 'x')}${sh(u)})(x^2${sgv(p, 'x')}${sh(v)})`)}이다.`
      });
    }),
    T('sub-four-sq', '네 일차식의 곱에 수를 더해 완전제곱식', '②15', (d) => {
      const p = nz(d, -7, 7), [a, b] = d.shuffle(range(-6, 6).filter((x) => x !== 0 && x !== p && 2 * x !== p)).slice(0, 2), dd = p - a, c = p - b;
      if (new Set([a, b, c, dd]).size !== 4 || [c, dd].includes(0) || Math.abs(c) > 7 || Math.abs(dd) > 7) return null;
      const diff = a * dd - b * c, w = (a * dd + b * c) / 2, e = (diff / 2) ** 2;
      if (diff % 2 !== 0 || diff === 0 || w === 0 || !irr(p, w) || e > 100) return null;
      const target = d.shuffle([a, b, c, dd]).map((r) => `(x${sh(r)})`).join('') + sh(e);
      return facQ(FACT, target, [{ t: [[1, X2, 'f'], [p, X, 's'], [w, '', 's']], p: 2 }], {
        explain: `${xh(`(x${sh(a)})(x${sh(dd)})`)} = ${xh(pn([[1, 'x^2'], [p, 'x'], [a * dd, '']]))}, ${xh(`(x${sh(b)})(x${sh(c)})`)} = ${xh(pn([[1, 'x^2'], [p, 'x'], [b * c, '']]))}이다. ${xh(pn([[1, 'x^2'], [p, 'x']]))} = ${XX}로 놓으면 ${xh(`(X${sh(a * dd)})(X${sh(b * c)})${sh(e)}`)} = ${xh(pn([[1, 'X^2'], [2 * w, 'X'], [w * w, '']]))} = ${xh(`(X${sh(w)})^2`)}이므로 ${xh(`(x^2${sgv(p, 'x')}${sh(w)})^2`)}이다.`
      });
    })
  ];

  // ── 사. 인수정리를 이용한 인수분해 ──
  const zTold = (P, r) => `${PX} = ${ej(aH(P), '이라/라')} 하면 ${at2(r)} = 0이므로 ${xj(lin(1, -r), '은/는')} ${PX}의 인수이다. 조립제법으로 나누어 인수분해한다.`;
  const at2 = (r) => V('P') + '(' + sn(r) + ')';
  const factorizeTypes = [
    T('fz-cubic-three', '인수정리로 삼차식 인수분해(일차식 셋)', '②17', (d) => {
      const roots = d.shuffle(range(-5, 5).filter((x) => x !== 0)).slice(0, 3), P = aProd(...roots.map((r) => L(1, -r)));
      if (Math.abs(P[0].p) > 60) return null;
      const target = aSrc(P);
      return facQ(FACT, target, roots.map((r) => lf(-r)), { unordered: true, rule: 'three', explain: zTold(P, roots[0]) + ` 몫 ${aH(aMul(L(1, -roots[1]), L(1, -roots[2])))}도 인수분해하면 ${xh(roots.map((r) => `(x${sh(-r)})`).join(''))}이다.` });
    }),
    T('fz-cubic-quad', '인수정리로 삼차식 인수분해(일차식과 이차식)', '②17', (d) => {
      const r = nz(d, -4, 4), b = nz(d, -5, 5), c = nz(d, -8, 8), P = aMul(L(1, -r), Dsc(1, b, c));
      if (!irr(b, c) || Math.abs(P[0].p) > 60) return null;
      const target = aSrc(P);
      return facQ(FACT, target, [lf(-r), qf(b, c)], { rule: 'linear-quad', explain: zTold(P, r) + ` 몫은 ${fq(b, c)}이고 더 인수분해되지 않으므로 ${xh(`(x${sh(-r)})(${pn([[1, 'x^2'], [b, 'x'], [c, '']])})`)}이다.` });
    }),
    T('fz-cubic-double', '인수정리로 삼차식 인수분해(같은 인수 둘)', '②17', (d) => {
      const [r, s] = d.shuffle(range(-4, 4).filter((x) => x !== 0)).slice(0, 2), P = aProd(L(1, -r), L(1, -r), L(1, -s));
      if (Math.abs(P[0].p) > 60) return null;
      const target = aSrc(P);
      return facQ(FACT, target, [{ t: [[1, X, 'f'], [-r, '', 's']], p: 2 }, lf(-s)], { rule: 'double', explain: zTold(P, s) + ` 몫 ${aH(aMul(L(1, -r), L(1, -r)))}${tail(r * r, '은/는')} ${xh(`(x${sh(-r)})^2`)}이므로 ${xh(`(x${sh(-r)})^2(x${sh(-s)})`)}이다.` });
    }),
    T('fz-quartic', '인수정리로 사차식 인수분해', '②18 심7', (d) => {
      const [r1, r2] = d.shuffle(range(-3, 3).filter((x) => x !== 0)).slice(0, 2), b = nz(d, -4, 4), c = nz(d, -7, 7), P = aProd(L(1, -r1), L(1, -r2), Dsc(1, b, c));
      if (!irr(b, c) || Math.abs(P[0].p) > 60 || r1 + r2 === 0) return null;
      const target = aSrc(P);
      return facQ(FACT, target, [lf(-r1), lf(-r2), qf(b, c)], {
        blocks: [[0], [1]],
        explain: `${PX} = ${ej(aH(P), '이라/라')} 하면 ${at2(r1)} = 0, ${at2(r2)} = 0이므로 ${xh(lin(1, -r1))}, ${xj(lin(1, -r2), '은/는')} ${PX}의 인수이다. 조립제법을 두 번 하면 남는 몫은 ${fq(b, c)}이고 더 인수분해되지 않으므로 ${xh(`(x${sh(-r1)})(x${sh(-r2)})(${pn([[1, 'x^2'], [b, 'x'], [c, '']])})`)}이다.`
      });
    }),
    T('fz-coef-then', '계수를 구하고 인수분해', '②19', (d) => {
      const r = nz(d, -4, 4), b = nz(d, -5, 5), c = nz(d, -8, 8), P = aMul(L(1, -r), Dsc(1, b, c)), a = P[0].p, c1 = P[1].p, c2 = P[2].p;
      if (!irr(b, c) || !c1 || !c2 || Math.abs(a) > 60) return null;
      const target = aSrc(P), what = d.bool() ? `${xj(lin(1, -r), '을/를')} 인수로 가질` : `${xj(lin(1, -r), '으로/로')} 나누어떨어질`;
      return facAns(`다항식 ${xj(`x^3${sgv(c2, 'x^2')}${sgv(c1, 'x')}+a`, '이/가')} ${what} 때, 상수 ${va}의 값과 이 다항식을 인수분해한 식을 구하시오.`, [{ raw: true, t: [[a, '', 's']], after: ', ' }, lf(-r), qf(b, c)], {
        pre: nb(`${va} = `), preShown: `${va} = `, poly: target, note: NOTE1,
        explain: `인수정리에 의하여 ${X} = ${nj(r, '을/를')} 넣은 값이 0이므로 ${va} = ${sn(a)}이다. 조립제법으로 ${xj(lin(1, -r), '으로/로')} 나누면 몫은 ${fq(b, c)}이고 더 인수분해되지 않으므로 ${xh(`(x${sh(-r)})(${pn([[1, 'x^2'], [b, 'x'], [c, '']])})`)}이다.`
      });
    }),
    T('fz-steps', '인수정리로 인수분해하는 차례', '②21', (d) => {
      const cards = ['대입하여 0이 되는 x의 값 찾기', '이차식을 인수분해 공식으로 인수분해하기', '조립제법으로 나누어 몫 구하기', '±(상수항의 약수) 찾기'], right = [3, 0, 2, 1], tags = ['㉠', '㉡', '㉢', '㉣'];
      const key = (o) => o.map((i) => tags[i]).join(' → '), all = [];
      const perm = (pre, rest) => { if (!rest.length) { all.push(pre); return; } rest.forEach((x, i) => perm(pre.concat([x]), rest.filter((_, j) => j !== i))); };
      perm([], [0, 1, 2, 3]);
      const wrong = d.shuffle(all.filter((o) => key(o) !== key(right))).slice(0, 4);
      return pickQ(d, `계수가 정수인 삼차식을 인수정리를 이용하여 인수분해하려고 한다. 다음 ㉠~㉣을 하는 차례대로 나열한 것은?`, [{ h: key(right), ok: true }].concat(wrong.map((o) => ({ h: key(o), ok: false }))), {
        figure: lines(cards.map((cd, i) => tags[i] + ' ' + cd.replace('x', X))),
        explain: `먼저 넣어 볼 수(±(상수항의 약수))를 찾고(㉣), 그 가운데 대입하여 0이 되는 값 α를 찾는다(㉠). ${ej(nb(`${X} ${MINUS} α`), '으로/로')} 조립제법을 하여 몫을 구하고(㉢), 남은 이차식을 인수분해한다(㉡).`
      });
    })
  ];

  // ── 아. 여러 문자가 섞인 식 ──
  // P 가 일차식 v + k·w(문자 v, w)를 인수로 갖는가: v = −k·w 를 넣어 0이 되는지 본다.
  const hasFactor = (Psrc, v, k, w) => valX(Psrc, { [v]: [term(Q(-k), { [w]: 1 })] }).length === 0;
  const lettersTypes = [
    T('multi-sort', '한 문자에 대하여 정리해 인수분해', '②25', (d, n) => {
      if (n === 0) {
        const s = [d.pick([1, -1]), d.pick([1, -1]), d.pick([1, -1])], mk2 = (t) => `(x${sgv(t[0], 'y')})(y${sgv(t[1], 'z')})(z${sgv(t[2], 'x')})`, P = xv(mk2(s)), target = srcOf(P);
        const pool = [];
        for (let m = 0; m < 8; m += 1) { const t = [m & 1 ? 1 : -1, m & 2 ? 1 : -1, m & 4 ? 1 : -1]; pool.push(mk2(t)); }
        const rows = [{ h: xh(mk2(s)), ok: true }].concat(d.shuffle(pool.filter((w) => !same(xv(w), P))).slice(0, 4).map((w) => ({ h: xh(w), ok: false })));
        return pickQ(d, `다항식 ${xj(target, '을/를')} 인수분해한 것은?`, rows, {
          rule: 'three-letters',
          explain: `차수가 가장 낮은 문자 하나에 대하여 내림차순으로 정리한 뒤 공통인수를 묶는다. 보기를 전개해 견주면 ${xh(target)} = ${xh(mk2(s))}이다.`
        });
      }
      const k = d.int(1, 4), m = d.int(1, 3), target = `${m * m === 1 ? '' : m * m}x-(xy+${k * m * m})y+${k === 1 ? '' : k}y^3`;
      const right = `(x${sgv(-k, 'y')})(${m}+y)(${m}-y)`, P = xv(right);
      if (!same(xv(target), P)) return null;
      const pool = [`(x${sgv(k, 'y')})(${m}+y)(${m}-y)`, `(x${sgv(-k, 'y')})(y+${m})(y-${m})`, `(x${sgv(-k, 'y')})(${m}-y)^2`, `(x${sgv(-k, 'y')})(${m}+y)^2`, `(x-y)(${m}+${k === 1 ? '' : k}y)(${m}-${k === 1 ? '' : k}y)`, `(x${sgv(k, 'y')})(y+${m})(y-${m})`];
      const rows = [{ h: xh(right), ok: true }].concat(d.shuffle(pool.filter((w) => !same(xv(w), P))).slice(0, 4).map((w) => ({ h: xh(w), ok: false })));
      return pickQ(d, `다항식 ${xj(target, '을/를')} 인수분해한 것은?`, rows, {
        rule: 'two-letters',
        explain: `괄호를 풀면 ${xh(`${m * m === 1 ? '' : m * m}x-xy^2${sgv(-k * m * m, 'y')}${sgv(k, 'y^3')}`)}이고, 차수가 가장 낮은 ${X}에 대하여 정리하면 ${X}(${xh(`${m * m}-y^2`)}) ${MINUS} ${xh(pn([[k, 'y']]))}(${xh(`${m * m}-y^2`)}) = ${xh(`(x${sgv(-k, 'y')})(${m * m}-y^2)`)} = ${xh(right)}이다.`
      });
    }, { count: 2 }),
    T('multi-pick', '여러 문자 식의 인수 모두 고르기', '②26', (d) => {
      const s = d.pick([1, -1, 2, -2]), t = d.pick([1, 2]), P = xv(`(a${sgv(s, 'c')})(a^2-${t * t === 1 ? '' : t * t}b^2)`);
      const shown = pn(d.shuffle(P).map((u) => [u.q, Object.keys(u.e).filter((key) => u.e[key]).sort().map((key) => key + (u.e[key] > 1 ? '^' + u.e[key] : '')).join('')]));
      const cand = d.shuffle([['b', -t], ['b', t], ['c', s], ['c', -s]]);
      const rows = cand.map(([w, k]) => xh(`a${sgv(k, w)}`)), truths = cand.map(([w, k]) => hasFactor(shown, 'a', k, w));
      return comboQ(d, `다항식 ${xh(shown)}의 인수인 것만을 보기에서 있는 대로 고른 것은?`, rows, truths, {
        explain: `${vc}에 대하여 정리하면 ${xh(shown)} = ${xh(`a^2(a${sgv(s, 'c')})-${t * t === 1 ? '' : t * t}b^2(a${sgv(s, 'c')})`)} = ${xh(`(a${sgv(s, 'c')})(a${sgv(t, 'b')})(a${sgv(-t, 'b')})`)}이다.`
      });
    }),
    T('multi-ab', '두 식의 합·차로 나타내기', '②28', (d) => {
      const k = d.pick([3, -1]), target = `(x^2-xy+y^2)(x^2+xy+y^2)${sgv(-k, 'x^2y^2')}`;
      const opts = [['a^2b^2', (a, b) => a * a * b * b], ['(a+b)^2', (a, b) => (a + b) ** 2], ['(a-b)^2', (a, b) => (a - b) ** 2], ['a^2b', (a, b) => a * a * b], ['ab^2', (a, b) => a * b * b], ['[(a^2+b^2)^2|4]', (a, b) => (a * a + b * b) ** 2 / 4], ['(a^2+b^2)^2', (a, b) => (a * a + b * b) ** 2]];
      const f = (x, y) => (x * x - x * y + y * y) * (x * x + x * y + y * y) - k * x * x * y * y;
      const okOf = (g) => [[1, 2], [2, -3], [5, 1], [-2, 7]].every(([x, y]) => Math.abs(g(x + y, x - y) - f(x, y)) < 1e-9);
      const rows = opts.map(([h, g]) => ({ h: xh(h), ok: okOf(g) })), right = rows.find((r) => r.ok);
      return pickQ(d, `${nb(`${X} + ${V('y')} = ${va}`)}, ${nb(`${X} ${MINUS} ${V('y')} = ${vb}`)}일 때, ${xj(target, '을/를')} 인수분해하여 ${va}, ${vb}로 나타낸 것은?`, [right].concat(d.shuffle(rows.filter((r) => !r.ok)).slice(0, 4)), {
        explain: `${xh('(x^2-xy+y^2)(x^2+xy+y^2)')} = ${xh('(x^2+y^2)^2-x^2y^2')}이므로 주어진 식은 ${xh(k === 3 ? 'x^4-2x^2y^2+y^4' : 'x^4+2x^2y^2+y^4')} = ${xh(k === 3 ? '(x^2-y^2)^2' : '(x^2+y^2)^2')}이다. ${k === 3 ? `${xh('x^2-y^2')} = (${X} + ${V('y')})(${X} ${MINUS} ${V('y')}) = ${va}${vb}이므로 ${xh('a^2b^2')}이다.` : `${xh('x^2+y^2')} = ${frac(xh('(x+y)^2+(x-y)^2'), 2)} = ${frac(xh('a^2+b^2'), 2)}이므로 ${xh('[(a^2+b^2)^2|4]')}이다.`}`
      });
    })
  ];

  // ── 자. 인수분해로 수 계산하기 ──
  const numTypes = [
    T('num-sumcube', '세제곱의 합·차 공식으로 분수의 값', '②29', (d) => {
      const Nn = d.int(20, 2999), k = d.int(1, 4), minus = d.bool(), v = minus ? Nn - k : Nn + k, other = minus ? Nn + k : Nn - k;
      const top = `${Nn}${sup(3)} ${minus ? MINUS : '+'} ${k ** 3}`, bot = `${Nn} × ${other} + ${k * k}`;
      return numU('인수분해 공식을 이용하여 다음 식의 값을 구하시오.', v, {
        figure: ex(frac(top, bot)), value: minus ? `${Nn}-(${other}-${Nn})` : `${Nn}+(${Nn}-${other})`,
        explain: `${Nn} = ${X}로 놓으면 분자는 ${xh(pn([[1, 'x^3'], [minus ? -(k ** 3) : k ** 3, '']]))} = ${xh(`(x${sh(minus ? -k : k)})(x^2${sgv(minus ? k : -k, 'x')}+${k * k})`)}이고 분모는 ${xh(`x(x${sh(minus ? k : -k)})+${k * k}`)} = ${xh(`x^2${sgv(minus ? k : -k, 'x')}+${k * k}`)}이다. 약분하면 ${xh(`x${sh(minus ? -k : k)}`)} = ${v}이다.`
      });
    }),
    T('num-cube', '완전세제곱 꼴로 수의 값', '②30', (d) => {
      const Nn = d.int(21, 98), k = d.int(2, 4), minus = d.bool(), v = minus ? Nn - k : Nn + k, sg = minus ? MINUS : '+';
      return numU(`${nb(`${Nn}${sup(3)} ${sg} ${3 * k} × ${Nn}${sup(2)} + ${3 * k * k} × ${Nn} ${sg} ${k ** 3}`)} = ${V('n')}${sup(3)}일 때, 자연수 ${V('n')}의 값은?`, v, {
        value: `${Nn}${minus ? '-' : '+'}${3 * k}/3`,
        explain: `${Nn} = ${va}, ${k} = ${vb}로 놓으면 주어진 식은 ${xh(minus ? 'a^3-3a^2b+3ab^2-b^3' : 'a^3+3a^2b+3ab^2+b^3')} = ${xh(minus ? '(a-b)^3' : '(a+b)^3')}이므로 ${V('n')} = ${Nn} ${sg} ${k} = ${v}이다.`
      });
    }),
    T('num-many', '공식 여럿을 겹쳐 쓴 수의 값', '②32', (d) => {
      const Nn = d.pick([29, 39, 49, 59, 99, 199, 299]);
      return numU('인수분해 공식을 이용하여 다음 식의 값을 구하시오.', Nn + 3, {
        figure: ex(frac(`${Nn + 2}${sup(2)} ${MINUS} 1`, `${Nn}${sup(2)} ${MINUS} 1`) + ' × ' + frac(`${Nn}${sup(3)} ${MINUS} 1`, `${Nn}${sup(2)} + ${Nn} + 1`)), value: `${Nn}+3`,
        explain: `${Nn + 2}${sup(2)} ${MINUS} 1 = ${Nn + 3} × ${Nn + 1}, ${Nn}${sup(2)} ${MINUS} 1 = ${Nn + 1} × ${Nn - 1}, ${Nn}${sup(3)} ${MINUS} 1 = ${Nn - 1} × (${Nn}${sup(2)} + ${Nn} + 1)이므로 약분하면 ${Nn + 3}이다.`
      });
    }),
    T('num-prime', '큰 수를 소인수의 곱으로', '②33', (d, n) => {
      if (n === 0) {
        const pairs = [];
        for (let a = 3; a <= 12; a += 1) for (let b = 1; b < a; b += 1) { const t = [a - b, a + b, a * a + b * b]; if (t.every(isPrime) && new Set(t).size === 3) pairs.push([a, b]); }
        const [a, b] = d.pick(pairs);
        return slots(`세 소수 ${V('p')}, ${V('q')}, ${V('r')}에 대하여 ${nb(`${a}${sup(4)} ${MINUS} ${b}${sup(4)} = ${V('p')} × ${V('q')} × ${V('r')}`)}일 때, ${V('p')}, ${V('q')}, ${V('r')}의 값은? (단, ${V('p')} &lt; ${V('q')} &lt; ${V('r')})`, [[eqL('p'), a - b, `${a}-${b}`, false], [eqL('q'), a + b, `${a}+${b}`, false], [eqL('r'), a * a + b * b, `${a}**2+${b}**2`, false]], {
          derived: [2], rule: 'four',
          explain: `${nb(`${a}${sup(4)} ${MINUS} ${b}${sup(4)}`)} = (${a}${sup(2)} + ${b}${sup(2)})(${a}${sup(2)} ${MINUS} ${b}${sup(2)}) = (${a}${sup(2)} + ${b}${sup(2)})(${a} + ${b})(${a} ${MINUS} ${b}) = ${a * a + b * b} × ${a + b} × ${a - b}이다.`
        });
      }
      const c = d.pick([1, 2, 3]), m = d.int(c + 2, 40), p = m - c, q = m + 2 * c;
      if (!isPrime(p) || !isPrime(q)) return null;
      const Nn = m ** 3 - 3 * c * c * m + 2 * c ** 3;
      return slots(`자연수 ${ej(nb(`${V('N')} = ${m}${sup(3)} ${MINUS} ${3 * c * c} × ${m} + ${2 * c ** 3}`), '을/를')} 소인수분해하면 ${nb(`${V('p')}${sup(2)} × ${V('q')}`)}일 때, 서로 다른 소수 ${V('p')}, ${V('q')}의 값은?`, [[eqL('p'), p, `${m}-${c}`, false], [eqL('q'), q, `${m}+2*${c}`, false]], {
        derived: [2, c], rule: 'cubic',
        explain: `${m} = ${X}로 놓으면 ${V('N')} = ${xh(pn([[1, 'x^3'], [-3 * c * c, 'x'], [2 * c ** 3, '']]))}이다. ${X} = ${nj(c, '을/를')} 넣으면 0이므로 인수정리와 조립제법으로 ${xh(`(x-${c})^2(x+${2 * c})`)}이고, ${V('N')} = ${p}${sup(2)} × ${q}이다(${V('N')} = ${Nn}).`
      });
    }, { count: 2 }),
    T('num-composite', '인수분해로 합성수 가리기', '②34', (d, n) => {
      const m = d.pick([100, 200, 300, 1000]), k = d.int(2, 9), minus = n === 1, Nn = minus ? m ** 3 - k ** 3 : m ** 3 + k ** 3, right = minus ? m - k : m + k;
      const cand = [right, right + 2, right - 2, right + 4, right - 4, minus ? m + k : m - k, right + 6].filter((x) => x === right || Nn % x !== 0);
      if (cand.length < 5) return null;
      return pickQ(d, `${nb(`${Nn} = ${m}${sup(3)} ${minus ? MINUS : '+'} ${k}${sup(3)}`)}임을 이용할 때, 다음 중 ${Nn}의 약수인 것은?`, [cand[0]].concat(d.shuffle(cand.slice(1)).slice(0, 4)).map((x, i) => ({ h: String(x), ok: i === 0 })), {
        rule: minus ? 'minus' : 'plus',
        explain: `${xh(minus ? 'a^3-b^3' : 'a^3+b^3')} = ${xh(minus ? '(a-b)(a^2+ab+b^2)' : '(a+b)(a^2-ab+b^2)')}에서 ${Nn} = (${m} ${minus ? MINUS : '+'} ${k}) × (${m}${sup(2)} ${minus ? '+' : MINUS} ${m} × ${k} + ${k}${sup(2)}) = ${right} × ${Nn / right}이므로 ${right}${tail(right, '은/는')} ${Nn}의 약수이고 ${Nn}${tail(Nn, '은/는')} 합성수이다.`
      });
    }, { count: 2 })
  ];

  B.addGroup(UNIT, { id: 'formula', title: '인수분해 공식', standard: S2, types: formulaTypes });
  B.addGroup(UNIT, { id: 'subst', title: '공통부분을 묶는 인수분해', standard: S2, types: substTypes });
  B.addGroup(UNIT, { id: 'factorize', title: '인수정리를 이용한 인수분해', standard: S2, types: factorizeTypes });
  B.addGroup(UNIT, { id: 'letters', title: '여러 문자가 섞인 식의 인수분해', standard: S2, types: lettersTypes });
  B.addGroup(UNIT, { id: 'numcalc', title: '인수분해로 수 계산하기', standard: S2, types: numTypes });
  B.kit.m1012b = { isSq, irr, isCube, isPrime, facQ, lf, qf, fx, fq, X2, Y, Y2, XY, XX, hasFactor };
})(typeof window !== 'undefined' ? window : globalThis);
