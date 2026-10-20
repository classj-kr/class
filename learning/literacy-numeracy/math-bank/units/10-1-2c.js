// 고등학교 1학년 1학기 공통수학1 Ⅰ-2 「나머지정리와 인수분해」 — 실력 문항.
// 이 단원에서 아이들이 흔히 잘못 아는 것:
//  - 「x, y의 값에 관계없이 분수식의 값이 일정하다」를 분자와 분모의 계수가 같다고 읽는다(값이 k 이면 분자 = k × 분모).
//  - 조건식(x − y = 2)이 붙은 항등식을 x 에 대한 항등식으로 보고 계수를 0으로 놓는다(한 문자로 바꾸어 넣은 뒤에야 항등식이 된다).
//  - 나머지정리로 얻은 수가 음수이면 그대로 나머지라고 쓴다(나머지는 0 이상이고 나누는 수보다 작다 — 2026⁹⁹ 을 2027로 나눈 나머지는 −1이 아니다).
//  - (x − a)²으로 나눈 나머지에서 P(a)를 읽을 수 있다는 것을 모른다(나머지에 x = a 를 넣은 값이 P(a)이다).
//  - 몫 Q(x)의 값은 나눗셈 등식에 다른 수를 넣어야 나온다는 것, 삼차식으로 나눈 나머지는 이차식이라는 것을 놓친다.
//  - 최고차항의 계수가 1이 아닌 다항식에서 넣어 볼 수를 정수에서만 찾는다(±(상수항의 약수)/(최고차항의 계수의 약수)).
// 실력에 둔 잣대(과제 글): ① 뜻을 정확히 대야 풀리는 함정 ② 세 단계 넘게 잇는 문제. 대단원 기출 모의고사의 꼴과 수집본에 한 번 나오는 긴 문제가 여기에 온다.
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, F } = B.kit;
  const { MINUS, gcd, Q, nb, tail, V, sup, ex, nz, rt } = B.kit.mid;
  const K = B.kit.m1012, KB = B.kit.m1012b;
  const { UNIT, S1, S2, H, sn, jn, sh, sgv, nj, pv, cv, plusN, plusS, X, PX, QX, at, va, vb, vc, vk, eqL, range, xv, same, xh, xe, xex, ej, xj, pn, lin, Dsc, aMul, aProd, aSrc, aH, aJ, L, ival, aVal, aDiv,
    num, numU, slots, linQ, polyQ, facAns, pickQ } = K;
  const { isSq, irr, isPrime, facQ, lf, qf, X2 } = KB;
  const NOTE_LEAD = ' (단, 각 인수의 최고차항의 계수는 자연수이고, 계수가 1이면 1을 적는다.)';

  const hardTypes = [
    H('hard-frac-const', '값이 늘 일정한 분수식', '①11', (d) => {
      const p = nz(d, -3, 3), q = nz(d, -4, 4), r = nz(d, -5, 5), k = nz(d, -3, 3), c = k * r;
      if (k === 1 || Math.abs(c) > 15) return null;
      const den = pn([[p, 'x'], [q, 'y'], [r, '']]);
      return slots(`${X}, ${V('y')}의 값에 관계없이 다음 분수식의 값이 항상 일정할 때, 상수 ${va}, ${vb}의 값은? (단, ${nb(xh(den) + ' ≠ 0')})`, [[eqL('a'), k * p, `${jn(c)}/${jn(r)}*${jn(p)}`], [eqL('b'), k * q, `${jn(c)}/${jn(r)}*${jn(q)}`]], {
        figure: ex(frac(xe(`ax+by${sh(c)}`), xe(den))),
        explain: `일정한 값을 ${V('k')}라 하면 ${xh(`ax+by${sh(c)}`)} = ${V('k')}(${xh(den)})이고, 이것이 ${X}, ${V('y')}에 대한 항등식이다. 상수항에서 ${sn(c)} = ${cv(r, V('k'))}이므로 ${V('k')} = ${sn(k)}이고, ${va} = ${sn(k)} × ${pv(p)} = ${sn(k * p)}, ${vb} = ${sn(k)} × ${pv(q)} = ${sn(k * q)}이다. 분자와 분모의 계수가 같다고 보면 틀린다.`
      });
    }),
    H('hard-cond-ident', '조건식을 만족시키는 모든 x, y에 대한 항등식', '①12', (d) => {
      const t = nz(d, -3, 3), a = nz(d, -3, 3), plus = d.bool(), m = -2 * a * t, b = -a, c = a * t * t;
      const aE = `-${jn(m)}/(2*${jn(t)})`;
      return slots(`${nb(xh(plus ? `x+y` : `x-y`) + ' = ' + nj(t, '을/를'))} 만족시키는 모든 실수 ${X}, ${V('y')}에 대하여 등식 ${nb(xh(`ax^2${sgv(m, 'x')}+by^2+c`) + ' = 0')}이 성립할 때, 상수 ${va}, ${vb}, ${vc}의 값은?`, [[eqL('a'), a, aE], [eqL('b'), b, `${jn(m)}/(2*${jn(t)})`], [eqL('c'), c, `(${aE})*${jn(t)}**2`]], {
        explain: `${X} = ${xj(plus ? lin(-1, t, 'y') : lin(1, t, 'y'), '을/를')} 넣으면 ${V('y')}에 대한 항등식 ${xh(`(a+b)y^2+(${plus ? `${pn([[-2 * t, 'a']])}${sh(-m)}` : `${pn([[2 * t, 'a']])}${sh(m)}`})y+(${pn([[t * t, 'a'], [m * t, ''], [1, 'c']])})`)} = 0이 된다. 계수가 모두 0이므로 ${va} = ${sn(a)}, ${vb} = ${sn(b)}, ${vc} = ${sn(c)}이다. 처음 등식을 ${X}에 대한 항등식으로 보면 안 된다.`
      });
    }),
    H('hard-degree', '차수와 최고차항으로 다항식 정하기', '①15', (d) => {
      const a = d.pick([1, 2, 3]), b = nz(d, -3, 3), t = d.pick([2, 3, -1, -2]), k = a * a, c2 = 2 * a * a * b, c1 = 3 * a * b * b, c0 = b ** 3, v = a * t + b;
      return num(`최고차항의 계수가 양수인 다항식 ${PX}가 모든 실수 ${X}에 대하여 다음 등식을 만족시킬 때, ${at('P', t)}의 값은?`, v, {
        figure: ex(`{${V('P')}(${X})}${sup(3)} <i>=</i> ${k === 1 ? '' : k}${X}${sup(2)}${V('P')}(${X}) ${c2 < 0 ? `<i>${MINUS}</i>` : '<i>+</i>'} ${xe(pn([[c2, 'x^2'], [c1, 'x'], [c0, '']]).replace(/^-/, ''))}`),
        value: `${a}*${jn(t)}+${jn(b)}`, derived: [a, Math.abs(b)],
        explain: `${PX}의 차수를 ${V('n')}이라 하면 좌변은 3${V('n')}차, 우변은 (${V('n')} + 2)차이므로 ${V('n')} = 1이다. ${PX} = ${xh('ax+b')}(${va} &gt; 0)로 놓으면 최고차항에서 ${va}${sup(3)} = ${k}${va}이므로 ${va} = ${a}이고, 상수항에서 ${vb}${sup(3)} = ${sn(c0)}이므로 ${vb} = ${sn(b)}이다. ${PX} = ${xh(lin(a, b))}이므로 ${at('P', t)} = ${sn(v)}이다.`
      });
    }),
    H('hard-fg-system', '두 다항식의 나머지를 연립하기', '①30', (d) => {
      const c = d.pick([1, -1, 2, -2]), p = c * c, s = nz(d, -3, 3), q = p - s, al = d.int(2, 3), be = d.int(1, 3), Fv = nz(d, -6, 6), Gv = nz(d, -6, 6), r1 = Fv + al * Gv, r2 = Fv - be * Gv;
      if (q === 0 || s === 0) return null;
      const f = V('f'), g = V('g'), GE = `(${jn(r1)}-${jn(r2)})/(${al}+${be})`;
      return num(`두 다항식 ${f}(${X}), ${g}(${X})에 대하여 ${ej(nb(`${f}(${X}) + ${al}${g}(${X})`), '을/를')} ${xj(lin(1, -p), '으로/로')} 나누었을 때의 나머지는 ${sn(r1)}이고, ${ej(nb(`${f}(${xh(lin(1, s))}) ${MINUS} ${be === 1 ? '' : be}${g}(${xh(lin(1, s))})`), '을/를')} ${xj(lin(1, -q), '으로/로')} 나누었을 때의 나머지는 ${sn(r2)}이다. ${ej(nb(`${f}(${X}${sup(2)}) + ${g}(${X}${sup(2)})`), '을/를')} ${xj(lin(1, -c), '으로/로')} 나누었을 때의 나머지는?`, Fv + Gv, {
        value: `${jn(r1)}-${al}*${GE}+${GE}`,
        explain: `나머지정리에 의하여 ${f}(${p}) + ${al}${g}(${p}) = ${sn(r1)}, ${f}(${p}) ${MINUS} ${be === 1 ? '' : be}${g}(${p}) = ${sn(r2)}이다(${X} = ${nj(q, '을/를')} 넣으면 ${xh(lin(1, s))} = ${p}). 연립하면 ${f}(${p}) = ${sn(Fv)}, ${g}(${p}) = ${sn(Gv)}이다. ${X} = ${sn(c)}일 때 ${X}${sup(2)} = ${p}이므로 구하는 나머지는 ${f}(${p}) + ${g}(${p}) = ${sn(Fv + Gv)}이다.`
      });
    }),
    H('hard-nested-rem', '몫을 다시 나눈 관계로 이차식 나머지', '①36', (d) => {
      const [p, q] = d.shuffle(range(-3, 3).filter((x) => x !== 0)).slice(0, 2), r = nz(d, -6, 6), s = nz(d, -5, 5), b = r - s * p;
      if (b === 0) return null;
      return linQ(`다항식 ${PX}를 ${xj(lin(1, -p), '으로/로')} 나누었을 때의 몫은 ${QX}, 나머지는 ${sn(r)}이고, ${QX}를 ${xj(lin(1, -q), '으로/로')} 나누었을 때의 나머지는 ${sn(s)}이다. ${PX}를 ${xj(`(x${sh(-p)})(x${sh(-q)})`, '으로/로')} 나누었을 때의 나머지는?`, s, b, {
        ea: jn(s), eb: `${jn(r)}-${jn(s)}*${jn(p)}`,
        explain: `${QX}를 ${xj(lin(1, -q), '으로/로')} 나눈 몫을 ${V('Q')}<sub>1</sub>(${X})라 하면 ${PX} = (${xh(lin(1, -p))})${QX}${plusN(r)} = (${xh(lin(1, -p))}){(${xh(lin(1, -q))})${V('Q')}<sub>1</sub>(${X})${plusN(s)}}${plusN(r)} = ${xh(`(x${sh(-p)})(x${sh(-q)})`)}${V('Q')}<sub>1</sub>(${X}) + ${xh(lin(s, b))}이다. ${xj(lin(s, b), '은/는')} 이차식보다 차수가 낮으므로 나머지이다.`
      });
    }),
    H('hard-quot-value', '몫 Q(x)의 값', '①35', (d, n) => {
      if (n === 0) {
        const [p, q] = d.shuffle(range(-3, 3).filter((x) => x !== 0)).slice(0, 2), u = -(p + q), w = p * q, k = d.int(1, 3), m = nz(d, -4, 4), nn = nz(d, -5, 5), Qq = Dsc(k, m, nn), P = aMul(Dsc(1, u, w), Qq);
        const t = d.pick(range(-3, 4).filter((x) => x !== p && x !== q)), c3 = P[3].p, c0 = P[0].p, v = ival(Qq, t);
        if (u === 0 || !c3 || !c0 || Math.abs(c0) > 40 || v === 0) return null;
        return num(`다항식 ${PX} = ${xj(`${k === 1 ? '' : k}x^4${sgv(c3, 'x^3')}+ax^2+bx${sh(c0)}`, '이/가')} ${aJ(Dsc(1, u, w), '으로/로')} 나누어떨어질 때의 몫을 ${QX}라 하자. ${QX}를 ${xj(lin(1, -t), '으로/로')} 나누었을 때의 나머지는? (단, ${va}, ${vb}는 상수이다.)`, v, {
          value: `${jn(k)}*${jn(t)}**2+(${jn(c3)}-${jn(k)}*${jn(u)})*${jn(t)}+${jn(c0)}/${jn(w)}`, rule: 'divisible',
          explain: `${QX}는 최고차항의 계수가 ${k}인 이차식이므로 ${xh(`${k === 1 ? '' : k}x^2+mx+n`)}이라 하면 ${PX} = (${aH(Dsc(1, u, w))})(${xh(`${k === 1 ? '' : k}x^2+mx+n`)})이다. ${X}${sup(3)}의 계수에서 ${V('m')} ${k * u < 0 ? MINUS : '+'} ${Math.abs(k * u)} = ${sn(c3)}, 상수항에서 ${cv(w, V('n'))} = ${sn(c0)}이므로 ${QX} = ${aH(Qq)}이다. 구하는 나머지는 ${at('Q', t)} = ${sn(v)}이다.`
        });
      }
      if (n === 1) {
        const [p, q] = d.shuffle(range(-3, 3).filter((x) => x !== 0)).slice(0, 2), m = nz(d, -4, 4), nn = nz(d, -6, 6), Q1 = Dsc(1, m, nn), s = ival(Q1, q), P = aMul(L(1, -p), Q1), c2 = P[2].p, t = d.pick(range(-3, 3).filter((x) => x !== p && x !== q)), v = ival(P, t);
        if (!c2 || s === 0 || v === 0 || Math.abs(v) > 999) return null;
        const mE = `(${jn(c2)}+${jn(p)})`;
        return num(`다항식 ${PX} = ${xj(`x^3${sgv(c2, 'x^2')}+ax+b`, '은/는')} ${xj(lin(1, -p), '으로/로')} 나누어떨어지고, 그 몫을 ${xj(lin(1, -q), '으로/로')} 나누었을 때의 나머지는 ${sn(s)}이다. ${PX}를 ${xj(lin(1, -t), '으로/로')} 나누었을 때의 나머지는? (단, ${va}, ${vb}는 상수이다.)`, v, {
          value: `(${jn(t)}-${jn(p)})*(${jn(t)}**2+${mE}*${jn(t)}+${jn(s)}-${jn(q)}**2-${mE}*${jn(q)})`, rule: 'quotient-rem',
          explain: `몫을 ${V('Q')}<sub>1</sub>(${X})라 하면 ${PX} = (${xh(lin(1, -p))})${V('Q')}<sub>1</sub>(${X})이고 ${V('Q')}<sub>1</sub>(${sn(q)}) = ${sn(s)}이다. ${X} = ${nj(q, '을/를')} 넣으면 ${at('P', q)} = ${sn(q - p)} × ${pv(s)} = ${sn((q - p) * s)}이고 ${at('P', p)} = 0이므로, 연립하면 ${PX} = ${aH(P)}이다. 구하는 나머지는 ${at('P', t)} = ${sn(v)}이다.`
        });
      }
      const m = d.int(20, 60), k = d.int(5, m - 5), al = nz(d, -3, 3), be = nz(d, -4, 4), P1 = 1 + al + be, R = (-1) ** m + al * (-1) ** k + be, v = (P1 - R) / 2;
      if (v === 0) return null;
      return num(`다항식 ${xj(pn([[1, 'x^' + m], [al, 'x^' + k], [be, '']]), '을/를')} ${xj('x+1', '으로/로')} 나누었을 때의 몫을 ${QX}라 할 때, ${QX}를 ${xj('x-1', '으로/로')} 나누었을 때의 나머지는?`, v, {
        value: `((1+${jn(al)}+${jn(be)})-((-1)**${m}+${jn(al)}*(-1)**${k}+${jn(be)}))/2`, derived: [2], rule: 'high-degree',
        explain: `나머지를 ${V('R')}이라 하면 ${xh(pn([[1, 'x^' + m], [al, 'x^' + k], [be, '']]))} = (${xh('x+1')})${QX} + ${V('R')}이다. ${X} = ${MINUS}1을 넣으면 ${V('R')} = ${sn(R)}, ${X} = 1을 넣으면 ${sn(P1)} = 2${V('Q')}(1)${plusN(R)}이므로 ${V('Q')}(1) = ${sn(v)}이다.`
      });
    }, { count: 3 }),
    H('hard-square-rem', '(x−a)²으로 나눈 나머지에서 P(a) 읽기', '①37', (d) => {
      const [p, q] = d.shuffle(range(-3, 3).filter((x) => x !== 0)).slice(0, 2), m = nz(d, -6, 6), nn = nz(d, -8, 8), Pp = m * p + nn, a = Pp / (p - q), b = -a * q;
      if (!Number.isInteger(a) || a === 0 || Pp === 0) return null;
      const aE = `(${jn(m)}*${jn(p)}+${jn(nn)})/(${jn(p)}-${jn(q)})`;
      return linQ(`다항식 ${PX}는 ${xj(lin(1, -q), '으로/로')} 나누어떨어지고, ${xj(`(x${sh(-p)})^2`, '으로/로')} 나누었을 때의 나머지는 ${xh(lin(m, nn))}이다. ${PX}를 ${xj(`(x${sh(-q)})(x${sh(-p)})`, '으로/로')} 나누었을 때의 나머지는?`, a, b, {
        ea: aE, eb: `-(${aE})*${jn(q)}`,
        explain: `${PX} = ${xh(`(x${sh(-p)})^2`)}${QX}${plusS(lin(m, nn))}에 ${X} = ${nj(p, '을/를')} 넣으면 ${at('P', p)} = ${sn(Pp)}이다. 또 ${at('P', q)} = 0이다. 구하는 나머지를 ${xh('ax+b')}라 하면 ${xh(pn([[p, 'a'], [1, 'b']]))} = ${sn(Pp)}, ${xh(pn([[q, 'a'], [1, 'b']]))} = 0이므로 나머지는 ${xh(lin(a, b))}이다.`
      });
    }),
    H('hard-cubic-rem', '삼차식으로 나눈 나머지', '①38', (d, n) => {
      if (n === 0) {
        const [p, q] = d.shuffle(range(-3, 3).filter((x) => x !== 0)).slice(0, 2), m = nz(d, -5, 5), nn = nz(d, -6, 6), A = nz(d, -3, 3), r = A * (q - p) ** 2 + m * q + nn, R = [A * p * p + nn, m - 2 * A * p, A];
        if (R.some((c) => c === 0) || r === 0) return null;
        const AE = `(${jn(r)}-${jn(m)}*${jn(q)}-${jn(nn)})/(${jn(q)}-${jn(p)})**2`;
        return polyQ(`다항식 ${PX}를 ${xj(lin(1, -q), '으로/로')} 나누었을 때의 나머지는 ${sn(r)}이고, ${xj(`(x${sh(-p)})^2`, '으로/로')} 나누었을 때의 나머지는 ${xh(lin(m, nn))}이다. ${PX}를 ${xj(`(x${sh(-q)})(x${sh(-p)})^2`, '으로/로')} 나누었을 때의 나머지는?`, R, [AE, `${jn(m)}-2*(${AE})*${jn(p)}`, `(${AE})*${jn(p)}**2+${jn(nn)}`], {
          rule: 'square',
          explain: `나머지는 이차 이하의 식이고, 그것을 ${xj(`(x${sh(-p)})^2`, '으로/로')} 나눈 나머지는 ${xh(lin(m, nn))}이어야 하므로 ${xh(`A(x${sh(-p)})^2`)}${plusS(lin(m, nn))} 꼴이다. ${X} = ${nj(q, '을/를')} 넣으면 ${cv((q - p) ** 2, V('A'))}${plusN(m * q + nn)} = ${sn(r)}이므로 ${V('A')} = ${sn(A)}이고, 나머지는 ${aH(R)}이다.`
        });
      }
      const q = nz(d, -3, 3), u = nz(d, -3, 3), w = d.int(1, 5), m = nz(d, -5, 5), nn = nz(d, -6, 6), A = nz(d, -3, 3), Dq = q * q + u * q + w, r = A * Dq + m * q + nn, R = [A * w + nn, A * u + m, A];
      if (u * u - 4 * w >= 0 || R.some((c) => c === 0) || r === 0) return null;
      const Dv = aMul(L(1, -q), Dsc(1, u, w)), AE = `(${jn(r)}-${jn(m)}*${jn(q)}-${jn(nn)})/(${jn(q)}**2+${jn(u)}*${jn(q)}+${jn(w)})`;
      return polyQ(`다항식 ${PX}를 ${xj(lin(1, -q), '으로/로')} 나누었을 때의 나머지는 ${sn(r)}이고, ${aJ(Dsc(1, u, w), '으로/로')} 나누었을 때의 나머지는 ${xh(lin(m, nn))}이다. ${PX}를 ${aJ(Dv, '으로/로')} 나누었을 때의 나머지는?`, R, [AE, `(${AE})*${jn(u)}+${jn(m)}`, `(${AE})*${jn(w)}+${jn(nn)}`], {
        rule: 'quadratic',
        explain: `${aH(Dv)} = (${xh(lin(1, -q))})(${aH(Dsc(1, u, w))})이다. 나머지는 이차 이하의 식이고 ${xj(pn([[1, 'x^2'], [u, 'x'], [w, '']]), '으로/로')} 나눈 나머지가 ${xh(lin(m, nn))}이므로 ${V('A')}(${aH(Dsc(1, u, w))})${plusS(lin(m, nn))} 꼴이다. ${X} = ${nj(q, '을/를')} 넣으면 ${cv(Dq, V('A'))}${plusN(m * q + nn)} = ${sn(r)}이므로 ${V('A')} = ${sn(A)}이고, 나머지는 ${aH(R)}이다.`
      });
    }, { count: 2 }),
    H('hard-xn-rem', 'xⁿ이 곱해진 식의 나머지', '①38의 변형 홍중11', (d) => {
      const r = d.pick([2, 3]), c = d.pick([1, 2, 3, 4]), a = c - 2 * r, b = -r * (c - r);
      if (a === 0 || b === 0) return null;
      const rem = `${c === 1 ? '' : c + ' × '}${r}<sup>${V('n')}</sup>(${xh(lin(1, -r))})`;
      return slots(`자연수 ${V('n')}에 대하여 다항식 ${ej(nb(`${X}<sup>${V('n')}</sup>(${xh('x^2+ax+b')})`), '을/를')} ${xj(`(x-${r})^2`, '으로/로')} 나누었을 때의 나머지가 ${nb(rem)}일 때, 상수 ${va}, ${vb}의 값은?`, [[eqL('a'), a, `${c}-2*${r}`], [eqL('b'), b, `-${r}*(${c}-${r})`]], {
        explain: `몫을 ${QX}라 하면 ${X}<sup>${V('n')}</sup>(${xh('x^2+ax+b')}) = ${xh(`(x-${r})^2`)}${QX} + ${nb(rem)}이다. ${X} = ${r}를 넣으면 ${r}<sup>${V('n')}</sup>(${xh(`${r * r}+${r}a+b`)}) = 0이므로 ${xj('x^2+ax+b', '은/는')} ${xj(lin(1, -r), '을/를')} 인수로 갖고 ${xh(`(x-${r})(x+a+${r})`)}이다. 양변을 ${xj(lin(1, -r), '으로/로')} 나누면 ${X}<sup>${V('n')}</sup>(${xh(`x+a+${r}`)}) = (${xh(lin(1, -r))})${QX} + ${c === 1 ? '' : c + ' × '}${r}<sup>${V('n')}</sup>이고, ${X} = ${r}를 넣으면 ${xh(`a+${2 * r}`)} = ${c}이다. 따라서 ${va} = ${sn(a)}, ${vb} = ${sn(b)}이다.`.replace(new RegExp(`= ${r}를 넣`, 'g'), `= ${r}${tail(r, '을/를')} 넣`)
      });
    }),
    H('hard-quot-eq-rem', '몫과 나머지가 같다', '①39', (d) => {
      const [p, q] = d.shuffle(range(-3, 3).filter((x) => x !== 0)).slice(0, 2), A = nz(d, -3, 3), Bc = nz(d, -4, 4), r1 = A * p + Bc, r2 = A * q + Bc, t = d.pick(range(-3, 4).filter((x) => x !== p && x !== q)), v = (A * t + Bc) * ((t - p) * (t - q) + 1);
      if (r1 === 0 || r2 === 0 || Math.abs(v) > 999) return null;
      const AE = `(${jn(r1)}-${jn(r2)})/(${jn(p)}-${jn(q)})`, BE = `${jn(r1)}-(${AE})*${jn(p)}`;
      return num(`다항식 ${PX}를 ${xj(lin(1, -p), '으로/로')} 나누었을 때의 나머지는 ${sn(r1)}, ${xj(lin(1, -q), '으로/로')} 나누었을 때의 나머지는 ${sn(r2)}이고, ${xj(`(x${sh(-p)})(x${sh(-q)})`, '으로/로')} 나누었을 때의 몫과 나머지가 서로 같다. ${at('P', t)}의 값은?`, v, {
        value: `((${AE})*${jn(t)}+${BE})*((${jn(t)}-${jn(p)})*(${jn(t)}-${jn(q)})+1)`,
        explain: `몫과 나머지를 ${xh('ax+b')}라 하면 ${PX} = ${xh(`(x${sh(-p)})(x${sh(-q)})`)}(${xh('ax+b')}) + ${xh('ax+b')} = (${xh('ax+b')}){${xh(`(x${sh(-p)})(x${sh(-q)})`)} + 1}이다. ${at('P', p)} = ${xh(pn([[p, 'a'], [1, 'b']]))} = ${sn(r1)}, ${at('P', q)} = ${xh(pn([[q, 'a'], [1, 'b']]))} = ${sn(r2)}에서 ${va} = ${sn(A)}, ${vb} = ${sn(Bc)}이므로 ${at('P', t)} = ${pv(A * t + Bc)} × ${(t - p) * (t - q) + 1 < 0 ? '(' + sn((t - p) * (t - q) + 1) + ')' : (t - p) * (t - q) + 1} = ${sn(v)}이다.`
      });
    }),
    H('hard-shifted-coef', '다항식 꼴을 주고 바꾼 식의 나머지로 계수', '①42', (d) => {
      const u = nz(d, -2, 2), w = nz(d, -3, 3), e = nz(d, -4, 4), a = nz(d, -3, 3), b = nz(d, -5, 5), h = nz(d, -2, 2), s = d.pick([1, 2]);
      const P = aAddC(aMul(Dsc(1, u, w), Dsc(a, b)), e), V1 = ival(P, h + s), V2 = ival(P, h - s), m = (V1 - V2) / (2 * s), nn = (V1 + V2) / 2;
      const Q1 = (h + s) ** 2 + u * (h + s) + w, Q2 = (h - s) ** 2 + u * (h - s) + w;
      if (!Number.isInteger(m) || !Number.isInteger(nn) || m === 0 || nn === 0 || Q1 === 0 || Q2 === 0) return null;
      const hs = `(${jn(h)}+${s})`, hm = `(${jn(h)}-${s})`, L1 = `((${jn(m)}*${s}+${jn(nn)})-${jn(e)})/(${hs}**2+${jn(u)}*${hs}+${jn(w)})`, L2 = `((-${jn(m)}*${s}+${jn(nn)})-${jn(e)})/(${hm}**2+${jn(u)}*${hm}+${jn(w)})`, aE = `(${L1}-${L2})/(2*${s})`;
      return slots(`다항식 ${nb(`${PX} = (${xh(pn([[1, 'x^2'], [u, 'x'], [w, '']]))})(${xh('ax+b')})${plusN(e)}`)}에 대하여 ${ej(nb(`${V('P')}(${xh(lin(1, h))})`), '을/를')} ${xj(`x^2-${s * s}`, '으로/로')} 나누었을 때의 나머지가 ${xh(lin(m, nn))}일 때, 상수 ${va}, ${vb}의 값은?`, [[eqL('a'), a, aE], [eqL('b'), b, `${L1}-(${aE})*${hs}`]], {
        derived: [s],
        explain: `${nb(`${V('P')}(${xh(lin(1, h))})`)} = ${xh(`(x+${s})(x-${s})`)}${QX}${plusS(lin(m, nn))}에 ${X} = ${s}, ${X} = ${MINUS}${s}를 넣으면 ${at('P', h + s)} = ${sn(V1)}, ${at('P', h - s)} = ${sn(V2)}이다. ${PX}의 식에 넣으면 ${sn(Q1)}(${xh(pn([[h + s, 'a'], [1, 'b']]))})${plusN(e)} = ${sn(V1)}, ${sn(Q2)}(${xh(pn([[h - s, 'a'], [1, 'b']]))})${plusN(e)} = ${sn(V2)}이므로 연립하면 ${va} = ${sn(a)}, ${vb} = ${sn(b)}이다.`.replace(`${MINUS}${s}를`, `${MINUS}${s}${tail(s, '을/를')}`)
      });
    }),
    H('hard-quad-P', '바꾼 식의 조건 둘로 이차식 정하기', '①43', (d) => {
      const g = d.pick([1, 2]), t = nz(d, -3, 3), h = d.int(-4, 4), z0 = g * t + h, c = d.pick([2, 3, -2]), al = nz(d, -4, 4), be = nz(d, -5, 5), sx = d.pick([2, 3, -2]);
      if (z0 === 1 || z0 === -1 || sx === z0) return null;
      const zf = z0 === 0 ? 'x' : `(x${sh(-z0)})`;
      const P = aMul(L(1, -z0), Dsc(al, be)), P1 = ival(P, 1), Pm = ival(P, -1), m = ((1 - c) ** 2 * P1 - (1 + c) ** 2 * Pm) / 2, nn = ((1 - c) ** 2 * P1 + (1 + c) ** 2 * Pm) / 2, v = ival(P, sx);
      if (!Number.isInteger(m) || !Number.isInteger(nn) || m === 0 || nn === 0 || P1 === 0 || Pm === 0 || Math.abs(v) > 999) return null;
      const z0E = `(${jn(g)}*${jn(t)}+${jn(h)})`, S1 = `(${jn(m)}+${jn(nn)})/(1-${jn(c)})**2/(1-${z0E})`, S2 = `(${jn(nn)}-${jn(m)})/(1+${jn(c)})**2/(-1-${z0E})`;
      return num(`이차식 ${PX}에 대하여 ${ej(nb(`${V('P')}(${xh(lin(g, h))})`), '이/가')} ${xj(lin(1, -t), '으로/로')} 나누어떨어지고, ${ej(nb(`${xh(`(x${sh(-c)})^2`)}${PX}`), '을/를')} ${xj('x^2-1', '으로/로')} 나누었을 때의 나머지가 ${xh(lin(m, nn))}이다. ${at('P', sx)}의 값은?`, v, {
        value: `(${jn(sx)}-${z0E})*((${S1}-(${S2}))/2*${jn(sx)}+(${S1}+(${S2}))/2)`,
        explain: `${X} = ${nj(t, '을/를')} 넣으면 ${at('P', z0)} = 0이므로 ${PX} = ${xh(zf)}(${xh('ax+b')})로 놓는다. ${X} = 1, ${MINUS}1을 넣으면 ${cv((1 - c) ** 2, at('P', 1))} = ${sn(m + nn)}, ${cv((1 + c) ** 2, at('P', -1))} = ${sn(nn - m)}이므로 ${at('P', 1)} = ${sn(P1)}, ${at('P', -1)} = ${sn(Pm)}이다. 연립하면 ${PX} = ${xh(`${zf}(${lin(al, be)})`)}이고 ${at('P', sx)} = ${sn(v)}이다.`
      });
    }),
    H('hard-bignum-neg', '나머지가 음수로 나오는 큰 수의 나머지', '①34의 변형', (d) => {
      const k = d.pick([1, 2]), nn = d.pick([3, 5, 7, 9, 11, 99]), D = d.int(1000, 3000), Nn = D - k, rr = (-k) ** nn;
      if (Math.abs(rr) >= D) return null;
      const v = D + rr;
      return numU(`${ej(nb(`${Nn}${sup(nn)}`), '을/를')} ${D}${tail(D, '으로/로')} 나누었을 때의 나머지는?`, v, {
        value: `${D}-(${D}-${Nn})**${nn}`, rule: 'negative',
        explain: `${Nn} = ${X}로 놓으면 ${X}${sup(nn)}을 ${xj(lin(1, k), '으로/로')} 나누었을 때의 나머지는 (${MINUS}${k})${sup(nn)} = ${sn(rr)}이므로 ${Nn}${sup(nn)} = ${D} × ${V('Q')}(${Nn}) ${MINUS} ${-rr}이다. 나머지는 0 이상 ${D}보다 작아야 하므로 ${Nn}${sup(nn)} = ${D} × {${V('Q')}(${Nn}) ${MINUS} 1} + ${v}이고 구하는 나머지는 ${v}이다.`
      });
    }),
    H('hard-quot-quad', '나누어떨어질 때의 몫(이차식으로)', '①48', (d) => {
      const [p, q] = d.shuffle(range(-3, 3).filter((x) => x !== 0)).slice(0, 2), u = -(p + q), w = p * q, m = -u, nn = nz(d, -6, 6), P = aMul(Dsc(1, u, w), Dsc(1, m, nn)), c1 = P[1].p;
      if (u === 0 || !c1 || P[3].p !== 0) return null;
      return polyQ(`상수 ${va}, ${vb}에 대하여 다항식 ${xj(`x^4+ax^2${sgv(c1, 'x')}+b`, '이/가')} ${aJ(Dsc(1, u, w), '으로/로')} 나누어떨어질 때, 그 몫은?`, Dsc(1, m, nn), ['1', `-${jn(u)}`, `(${jn(c1)}+${jn(w)}*${jn(u)})/${jn(u)}`], {
        explain: `몫은 ${X}${sup(2)}의 계수가 1인 이차식이므로 ${xh('x^2+mx+n')}이라 하면 주어진 식은 (${aH(Dsc(1, u, w))})(${xh('x^2+mx+n')})이다. ${X}${sup(3)}의 계수에서 ${sn(u)} + ${V('m')} = 0, ${X}의 계수에서 ${cv(w, V('m'))} + ${cv(u, V('n'))} = ${sn(c1)}이므로 ${V('m')} = ${sn(m)}, ${V('n')} = ${sn(nn)}이고 몫은 ${aH(Dsc(1, m, nn))}이다.`
      });
    }),
    H('hard-find-quad', '나누어떨어지게 하는 이차식 찾기', '①51', (d) => {
      const [r1, r2] = d.shuffle(range(-4, 4).filter((x) => x !== 0)).slice(0, 2), s = nz(d, -3, 3), t = d.int(1, 6), P = aProd(L(1, -r1), L(1, -r2), Dsc(1, s, t)), a1 = -(r1 + r2), b1 = r1 * r2;
      if (irr(s, t) === false || a1 === 0 || Math.sign(a1) === Math.sign(s)) return null;
      const pos = d.bool(), pickLin = pos ? a1 > 0 : a1 < 0, a = pickLin ? a1 : s, b = pickLin ? b1 : t;
      return slots(`다항식 ${aJ(P, '이/가')} ${xj('x^2+ax+b', '으로/로')} 나누어떨어질 때, 상수 ${va}, ${vb}의 값은? (단, ${va} ${pos ? '&gt;' : '&lt;'} 0)`, [[eqL('a'), a, pickLin ? `-(${jn(r1)}+${jn(r2)})` : jn(s)], [eqL('b'), b, pickLin ? `${jn(r1)}*${jn(r2)}` : jn(t)]], {
        derived: [Math.abs(r1), Math.abs(r2), Math.abs(s), t],
        explain: `${at('P', r1)} = 0, ${at('P', r2)} = 0이므로 인수정리와 조립제법으로 ${aH(P)} = ${xh(`(x${sh(-r1)})(x${sh(-r2)})(${pn([[1, 'x^2'], [s, 'x'], [t, '']])})`)}이다. 이차식인 인수는 ${aJ(aMul(L(1, -r1), L(1, -r2)), '과/와')} ${aH(Dsc(1, s, t))}이고, ${va} ${pos ? '&gt;' : '&lt;'} 0인 것은 ${aH(Dsc(1, a, b))}이다.`
      });
    }),
    H('hard-cubic-cond', '조건 여럿으로 삼차식 정하기', '①55', (d) => {
      const p = nz(d, -3, 3), k = nz(d, -5, 5), al = nz(d, -3, 3), be = nz(d, -4, 4), [q1, q2, t] = d.shuffle(range(-3, 4).filter((x) => x !== p)).slice(0, 3);
      const P = aAddC(aMul(aMul(L(1, -p), L(1, -p)), Dsc(al, be)), -k), v1 = ival(P, q1), v2 = ival(P, q2), v = ival(P, t);
      if (Math.abs(v) > 999 || v1 === v2) return null;
      const A1 = `(${jn(v1)}+${jn(k)})/(${jn(q1)}-${jn(p)})**2`, A2 = `(${jn(v2)}+${jn(k)})/(${jn(q2)}-${jn(p)})**2`, aE = `(${A1}-(${A2}))/(${jn(q1)}-${jn(q2)})`;
      return num(`삼차식 ${PX}에 대하여 ${nb(`${PX} ${k < 0 ? MINUS : '+'} ${Math.abs(k)}`)}${tail(Math.abs(k), '은/는')} ${xj(`(x${sh(-p)})^2`, '으로/로')} 나누어떨어지고, ${PX}를 ${xj(lin(1, -q1), '으로/로')} 나누었을 때의 나머지는 ${sn(v1)}, ${xj(lin(1, -q2), '으로/로')} 나누었을 때의 나머지는 ${sn(v2)}이다. ${at('P', t)}의 값은?`, v, {
        value: `(${jn(t)}-${jn(p)})**2*((${aE})*${jn(t)}+${A1}-(${aE})*${jn(q1)})-(${jn(k)})`,
        explain: `${PX}가 삼차식이므로 ${nb(`${PX} ${k < 0 ? MINUS : '+'} ${Math.abs(k)}`)} = ${xj(`(x${sh(-p)})^2(ax+b)`, '으로/로')} 놓는다. ${X} = ${q1}, ${q2}를 넣으면 ${xh(pn([[q1, 'a'], [1, 'b']]))} = ${sn((v1 + k) / (q1 - p) ** 2)}, ${xh(pn([[q2, 'a'], [1, 'b']]))} = ${sn((v2 + k) / (q2 - p) ** 2)}이므로 ${va} = ${sn(al)}, ${vb} = ${sn(be)}이다. 따라서 ${PX} = ${xh(`(x${sh(-p)})^2(${lin(al, be)})`)}${plusN(-k)}이고 ${at('P', t)} = ${sn(v)}이다.`.replace(`${X} = ${q1}, ${q2}를`, `${X} = ${sn(q1)}, ${nj(q2, '을/를')}`)
      });
    }),
    H('hard-ident-poly', '항등식 속 다항식의 값', '심1', (d) => {
      const zs = d.shuffle(range(-3, 3)).slice(0, 3), [p, q] = d.shuffle(range(-3, 3)).slice(0, 2), Lf = (x) => (x - zs[0]) * (x - zs[1]) * (x - zs[2]);
      const a = (Lf(p) - Lf(q)) / (p - q), b = Lf(p) - a * p, mode = d.pick(['a-b', 'a+b', 'b-a']), sv = mode === 'a-b' ? a - b : mode === 'a+b' ? a + b : b - a;
      if (!Number.isInteger(a) || a === 0 || b === 0 || sv === p || sv === q || Math.abs(sv) > 6) return null;
      const v = (Lf(sv) - a * sv - b) / ((sv - p) * (sv - q));
      if (!Number.isInteger(v) || Math.abs(v) > 999) return null;
      const Lx = (x) => `(${x}-${jn(zs[0])})*(${x}-${jn(zs[1])})*(${x}-${jn(zs[2])})`, aE = `(${Lx(jn(p))}-${Lx(jn(q))})/(${jn(p)}-${jn(q)})`, bE = `(${Lx(jn(p))}-(${aE})*${jn(p)})`, sE = mode === 'a-b' ? `((${aE})-${bE})` : mode === 'a+b' ? `((${aE})+${bE})` : `(${bE}-(${aE}))`;
      const Lsrc = zs.map((z) => (z === 0 ? 'x' : `(x${sh(-z)})`)).join(''), Ds = [p, q].map((z) => (z === 0 ? 'x' : `(x${sh(-z)})`)).join('');
      const ask = mode === 'a-b' ? `${va} ${MINUS} ${vb}` : mode === 'a+b' ? `${va} + ${vb}` : `${vb} ${MINUS} ${va}`;
      return num(`다항식 ${PX}가 모든 실수 ${X}에 대하여 ${nb(`${xh(Lsrc)} =`)} ${ej(nb(`${xh(Ds)}${PX} + ${xh('ax+b')}`), '을/를')} 만족시킬 때, ${nb(`${V('P')}(${ask})`)}의 값은? (단, ${va}, ${vb}는 상수이다.)`, v, {
        value: `(${Lx(sE)}-(${aE})*${sE}-${bE})/((${sE}-${jn(p)})*(${sE}-${jn(q)}))`,
        explain: `${X} = ${sn(p)}, ${nj(q, '을/를')} 넣으면 ${xh(pn([[p, 'a'], [1, 'b']]))} = ${sn(Lf(p))}, ${xh(pn([[q, 'a'], [1, 'b']]))} = ${sn(Lf(q))}이므로 ${va} = ${sn(a)}, ${vb} = ${sn(b)}이고 ${ask} = ${sn(sv)}이다. 등식에 ${X} = ${nj(sv, '을/를')} 넣으면 ${sn(Lf(sv))} = ${sn((sv - p) * (sv - q))}${at('P', sv)}${plusN(a * sv + b)}이므로 ${at('P', sv)} = ${sn(v)}이다.`
      });
    }),
    H('hard-same-rem', '나머지가 같다는 조건으로 사차식 정하기', '심5', (d) => {
      const e = nz(d, -3, 3), s = d.pick([2, 3, 5, 6, 7]), h = d.pick([1, 2, -1]), Vv = nz(d, -8, 8), A1 = (h - e) * (h * h - s), A2 = (h - 1 - e) * ((h - 1) ** 2 - s);
      if (A2 === A1) return null;
      const a0 = (A2 * (h - 1) - A1 * h) / (A2 - A1);
      if (!Number.isInteger(a0)) return null;
      const R = Vv - A1 * (h - a0), t = d.pick(range(-3, 5).filter((x) => x !== e && x !== a0 && x * x !== s)), v = (t - e) * (t * t - s) * (t - a0) + R;
      if (Math.abs(v) > 999 || Math.abs(R) > 99) return null;
      const A1E = `(${jn(h)}-${jn(e)})*(${jn(h)}**2-${s})`, A2E = `(${jn(h)}-1-${jn(e)})*((${jn(h)}-1)**2-${s})`, a0E = `((${A2E})*(${jn(h)}-1)-(${A1E})*${jn(h)})/((${A2E})-(${A1E}))`, RE = `(${jn(Vv)}-(${A1E})*(${jn(h)}-${a0E}))`;
      const f = V('f');
      return num(`최고차항의 계수가 1인 사차식 ${f}(${X})가 다음 조건을 만족시킬 때, ${f}(${sn(t)})의 값은?`, v, {
        figure: `<div class="mb-lines"><div>(가) ${f}(${X})를 ${xj(lin(1, -e), '으로/로')} 나누었을 때의 나머지와 ${f}(${X})를 ${xj(`x^2-${s}`, '으로/로')} 나누었을 때의 나머지는 서로 같다.</div><div>(나) ${nb(`${f}(${xh(lin(1, h))}) ${Vv < 0 ? '+' : MINUS} ${Math.abs(Vv)}`)}${tail(Math.abs(Vv), '은/는')} ${xj('x^2+x', '으로/로')} 나누어떨어진다.</div></div>`,
        value: `(${jn(t)}-${jn(e)})*(${jn(t)}**2-${s})*(${jn(t)}-${a0E})+${RE}`,
        explain: `(가)에서 두 나머지가 같은데 ${xj(lin(1, -e), '으로/로')} 나눈 나머지는 상수이므로 그 나머지는 상수 ${V('R')}이다. 곧 ${f}(${X}) ${MINUS} ${V('R')}은 ${xj(lin(1, -e), '과/와')} ${xj(`x^2-${s}`, '을/를')} 모두 인수로 가지므로 ${nb(`${f}(${X}) = ${xh(`(x${sh(-e)})(x^2-${s})(x-k)`)} + ${V('R')}`)}이다. (나)에서 ${X} = 0, ${MINUS}1을 넣으면 ${f}(${sn(h)}) = ${f}(${sn(h - 1)}) = ${sn(Vv)}이고, 이를 연립하면 ${V('k')} = ${sn(a0)}, ${V('R')} = ${sn(R)}이다. 따라서 ${f}(${sn(t)}) = ${sn(v)}이다.`
      });
    }),
    H('hard-sqrt-four', '네 수의 곱에 수를 더한 값의 제곱근', '②16', (d, n) => {
      if (n === 0) {
        const Nn = d.int(10, 95), v = Nn * Nn + 3 * Nn + 1;
        return numU(`인수분해를 이용하여 다음 식의 값을 구하시오.`, v, {
          figure: ex(rt(`${Nn} × ${Nn + 1} × ${Nn + 2} × ${Nn + 3} + 1`)), value: `${Nn}**2+3*${Nn}+1`, derived: [2, 3], rule: 'consecutive',
          explain: `${Nn} = ${X}로 놓으면 근호 안은 ${xh('x(x+3)(x+1)(x+2)+1')} = ${xh('(x^2+3x)(x^2+3x+2)+1')}이다. ${xh('x^2+3x')} = ${V('X')}로 놓으면 ${xh('X^2+2X+1')} = ${xh('(X+1)^2')}이므로 구하는 값은 ${xh('x^2+3x+1')} = ${v}이다.`
        });
      }
      const dd = d.pick([2, 4, 6]), x = d.int(dd + 10, 99), half = dd * dd / 2, c = dd ** 4 / 4, v = x * x - half;
      return numU(`인수분해를 이용하여 다음 식의 값을 구하시오.`, v, {
        figure: ex(rt(`${x - dd} × ${x}${sup(2)} × ${x + dd} + ${c}`)), value: `${x}**2-${half}`, derived: [half], rule: 'symmetric',
        explain: `${x} = ${X}로 놓으면 ${xh(`(x-${dd})x^2(x+${dd})+${c}`)} = ${xh(`x^4-${dd * dd}x^2+${c}`)} = ${xh(`(x^2-${half})^2`)}이므로 구하는 값은 ${x}${sup(2)} ${MINUS} ${half} = ${v}이다.`
      });
    }, { count: 2, standard: S2 }),
    H('hard-nonmonic', '최고차항의 계수가 1이 아닌 삼차식', '②20', (d) => {
      const a = d.pick([2, 3]), b = nz(d, -3, 3), p = nz(d, -3, 3), q = nz(d, -4, 4), P = aMul(L(a, b), Dsc(1, p, q));
      if (gcd(a, Math.abs(b)) !== 1 || !irr(p, q) || P.some((c) => c.p === 0)) return null;
      const target = aSrc(P);
      return facQ('다음 식을 인수분해하시오.' + NOTE_LEAD, target, [{ t: [[a, X, 'n'], [b, '', 's']] }, { t: [[1, X2, 'n'], [p, X, 's'], [q, '', 's']] }], {
        note: '',
        explain: `넣어 볼 수는 ±(상수항의 약수)/(${a}의 약수)이다. 정수 가운데에는 0이 되는 수가 없고, ${X} = ${nj(Q(-b, a), '을/를')} 넣으면 0이므로 ${xj(lin(a, b), '이/가')} 인수이다. 조립제법으로 ${X} = ${nj(Q(-b, a), '으로/로')} 나눈 몫을 ${a}${tail(a, '으로/로')} 나누면 ${aH(Dsc(1, p, q))}이고 더 인수분해되지 않으므로 ${xh(`(${lin(a, b)})(${pn([[1, 'x^2'], [p, 'x'], [q, '']])})`)}이다.`
      });
    }, { standard: S2 }),
    H('hard-rest-factor', '인수 조건으로 남은 인수 정하기', '②22', (d, n) => {
      if (n === 0) {
        const s = nz(d, -5, 5), t = nz(d, -5, 5), k = s + t, n0 = s * t, m = n0 - 1, G = 1 + k + n0;
        if (k === 0 || m === 0 || s === t) return null;
        const target = `x^4+kx^3${sgv(m, 'x^2')}-kx${sh(-n0)}`;
        return facAns(`다항식 ${ej(nb(`${V('f')}(${X}) = ${xh(target)}`), '이/가')} ${ej(nb(`${xh('(x+1)(x-1)')}${V('g')}(${X})`), '으로/로')} 인수분해되고 ${V('g')}(1) = ${sn(G)}일 때, ${V('g')}(${X})를 인수분해하시오. (단, ${vk}는 상수이다.)`, [lf(s), lf(t)], {
          unordered: true, poly: `(x+${s})(x+${t})`, rule: 'gx',
          explain: `${xh('(x+1)(x-1)')} = ${xh('x^2-1')}이고 ${V('f')}(${X})의 최고차항과 상수항을 보면 ${V('g')}(${X}) = ${xh(`x^2+kx${sh(n0)}`)}이다(전개해 견주면 ${X}${sup(2)}의 계수 ${sn(n0)} ${MINUS} 1 = ${nj(m, '이/가')} 맞는다). ${V('g')}(1) = ${xh(`1+k${sh(n0)}`)} = ${sn(G)}이므로 ${vk} = ${sn(k)}이고 ${V('g')}(${X}) = ${aH(Dsc(1, k, n0))} = ${xh(`(x${sh(s)})(x${sh(t)})`)}이다.`
        });
      }
      const roots = d.shuffle(range(-4, 4).filter((x) => x !== 0)).slice(0, 4), P = aProd(...roots.map((r) => L(1, -r))), z = d.pick([3, 2, -3]), w = d.pick([1, -1, 0, 2]);
      const pairs = []; for (let i = 0; i < 4; i += 1) for (let j = i + 1; j < 4; j += 1) pairs.push([roots[i], roots[j]]);
      const fz = (pr) => (z - pr[0]) * (z - pr[1]), target = d.pick(pairs), vz = fz(target);
      if (pairs.filter((pr) => fz(pr) === vz).length !== 1 || roots.includes(z)) return null;
      const rest = roots.filter((r) => !target.includes(r)), v = (w - rest[0]) * (w - rest[1]);
      return num(`최고차항의 계수가 1인 두 이차식 ${V('f')}(${X}), ${V('g')}(${X})에 대하여 ${nb(`${V('f')}(${X})${V('g')}(${X}) = ${aH(P)}`)}이고, ${V('f')}(${X})를 ${xj(lin(1, -z), '으로/로')} 나누었을 때의 나머지가 ${sn(vz)}일 때, ${V('g')}(${sn(w)})의 값은?`, v, {
        value: `(${jn(w)}-${jn(rest[0])})*(${jn(w)}-${jn(rest[1])})`, derived: roots.map(Math.abs), rule: 'fg',
        explain: `인수정리와 조립제법으로 ${aH(P)} = ${xh(roots.map((r) => `(x${sh(-r)})`).join(''))}이다. 네 일차식 가운데 둘을 곱한 이차식 가운데 ${X} = ${nj(z, '을/를')} 넣어 ${nj(vz, '이/가')} 되는 것은 ${xh(`(x${sh(-target[0])})(x${sh(-target[1])})`)}뿐이므로 ${V('g')}(${X}) = ${xh(`(x${sh(-rest[0])})(x${sh(-rest[1])})`)}이고 ${V('g')}(${sn(w)}) = ${sn(v)}이다.`
      });
    }, { count: 2, standard: S2 }),
    H('hard-triangle', '인수분해한 일차식의 근으로 삼각형', '②23', (d) => {
      const c = d.pick([3, 5, 7]), k = `[${c}|2]`;
      return F(`다항식 ${xj(`x^3-${1 + c}x^2-(k^2-${c}k-${c})x+k^2-${c}k`, '이/가')} ${xj('(x-a)(x-b)(x-c)', '으로/로')} 인수분해된다. ${va}, ${vb}, ${vc}를 세 변의 길이로 하는 삼각형이 이등변삼각형이 되도록 하는 상수 ${vk}의 값은?`, c, 2, {
        improper: true, anyForm: true, facts: { value: `${c}/2` },
        explain: `${X} = 1을 넣으면 0이므로 조립제법으로 ${xh(`(x-1)(x^2-${c}x+${c}k-k^2)`)} = ${xh(`(x-1)(x-k)(x-${c}+k)`)}이다. 세 변은 1, ${vk}, ${xh(`${c}-k`)}이다. ${vk} = 1이나 ${xh(`${c}-k`)} = 1이면 세 변이 1, 1, ${nj(c - 1, '이/가')} 되어 삼각형이 되지 않으므로 ${vk} = ${xh(`${c}-k`)}, 곧 ${vk} = ${xh(k)}이다(세 변 1, ${xh(k)}, ${xh(k)}).`
      });
    }, { standard: S2 }),
    H('hard-block', '부피 식을 인수분해해 수 읽기', '②24', (d) => {
      const dd = d.pick([3, 6, 9]);
      return slots(`밑면의 가로와 세로의 길이가 각각 ${xh(`x+${dd}`)}이고 높이가 ${xh(`x-${dd}`)}인 직육면체 모양의 나무토막에서 한 모서리의 길이가 ${xh(`x-${dd}`)}인 정육면체 모양의 나무토막 4개를 잘라 내어 블록을 만들었다. 이 블록의 부피가 ${nb(`${MINUS}3${xh('(x-a)(x-b)(x-c)')}`)}일 때, 상수 ${va}, ${vb}, ${vc}의 값은? (단, ${va} &lt; ${vb} &lt; ${vc}이고 ${nb(`${dd} &lt; ${X} &lt; ${3 * dd}`)})`, [[eqL('a'), dd / 3, `${dd}/3`, false], [eqL('b'), dd, `${dd}`, false], [eqL('c'), 3 * dd, `3*${dd}`, false]], {
        explain: `부피는 ${xh(`(x+${dd})^2(x-${dd})-4(x-${dd})^3`)} = (${xh(`x-${dd}`)}){(${xh(`x+${dd}`)})${sup(2)} ${MINUS} 2${sup(2)}(${xh(`x-${dd}`)})${sup(2)}} = ${xh(`(x-${dd})(-x+${3 * dd})(3x-${dd})`)} = ${MINUS}3${xh(`(x-${dd / 3})(x-${dd})(x-${3 * dd})`)}이다. 따라서 ${va} = ${dd / 3}, ${vb} = ${dd}, ${vc} = ${3 * dd}이다.`
      });
    }, { standard: S2 }),
    H('hard-cyclic-value', '인수분해해서 식의 값', '②27', (d) => {
      const m = nz(d, -4, 4), n2 = nz(d, -4, 4), v = m * n2 * (m + n2);
      if (m + n2 === 0) return null;
      return num(`${nb(`${xh('a-b')} = ${sn(m)}`)}, ${nb(`${xh('c-a')} = ${sn(n2)}`)}일 때, ${xh('a^2b-ab^2+b^2c-bc^2+c^2a-ca^2')}의 값은?`, v, {
        value: `${jn(m)}*${jn(n2)}*(${jn(m)}+${jn(n2)})`,
        explain: `${va}에 대하여 정리하면 ${xh('(b-c)a^2-(b^2-c^2)a+bc(b-c)')} = ${xh('(b-c)(a^2-(b+c)a+bc)')} = ${xh('(b-c)(a-b)(a-c)')}이다. ${xh('b-c')} = ${xh('(b-a)+(a-c)')} = ${sn(-m - n2)}, ${xh('a-c')} = ${sn(-n2)}이므로 값은 ${pv(-m - n2)} × ${pv(m)} × ${pv(-n2)} = ${sn(v)}이다.`
      });
    }, { standard: S2 }),
    H('hard-x4x21', 'x⁴+x²+1 꼴로 분수의 값', '②31', (d, n) => {
      if (n === 0) {
        const Nn = d.int(20, 99), v = Nn * Nn - Nn + 1;
        return numU('인수분해를 이용하여 다음 식의 값을 구하시오.', v, {
          figure: ex(frac(`${Nn}${sup(4)} + ${Nn * Nn + 1}`, `${Nn}${sup(2)} + ${Nn + 1}`)), value: `${Nn}**2-${Nn}+1`, rule: 'power',
          explain: `${Nn} = ${X}로 놓으면 ${Nn * Nn + 1} = ${X}${sup(2)} + 1, ${Nn + 1} = ${X} + 1이므로 식은 ${frac(xh('x^4+x^2+1'), xh('x^2+x+1'))}이다. ${xh('x^4+x^2+1')} = ${xh('(x^2+1)^2-x^2')} = ${xh('(x^2+x+1)(x^2-x+1)')}이므로 값은 ${xh('x^2-x+1')} = ${v}이다.`
        });
      }
      const x = d.int(11, 60), x2 = x * x, Dn = x2 + x + 1, v = x2 - x + 1;
      return numU('인수분해를 이용하여 다음 식의 값을 구하시오.', v, {
        figure: ex(frac(`${x2} × ${x2 + 1} + 1`, String(Dn))), value: `${x2}-(${Dn}-${x2 + 1})+1`, rule: 'product',
        explain: `${x2} = ${x}${sup(2)}이므로 ${x} = ${X}로 놓으면 분자는 ${xh('x^2(x^2+1)+1')} = ${xh('x^4+x^2+1')}, 분모는 ${xh('x^2+x+1')}이다. ${xh('x^4+x^2+1')} = ${xh('(x^2+x+1)(x^2-x+1)')}이므로 값은 ${xh('x^2-x+1')} = ${v}이다.`
      });
    }, { count: 2, standard: S2 }),
    H('hard-num-four', '수를 문자로 놓고 인수분해해 네 인수', '심8', (d) => {
      const p = d.pick([2, 4]), [r1, r3] = d.shuffle(range(-6, 6).filter((r) => r !== 0 && 2 * r !== p)).slice(0, 2), r2 = p - r1, r4 = p - r3, u = r1 * r2, v = r3 * r4;
      const Nn = d.int(8, 40), fs = [Nn + r1, Nn + r2, Nn + r3, Nn + r4].sort((x, y) => x - y);
      if (u === v || new Set(fs).size !== 4 || !fs.every(isPrime)) return null;
      const al = u + v, be = u * v, Xs = `${Nn}${sup(2)} + ${p} × ${Nn}`;
      return slots(`2 이상인 네 자연수 ${va}, ${vb}, ${vc}, ${V('d')}에 대하여 다음 등식이 성립할 때, ${va}, ${vb}, ${vc}, ${V('d')}의 값은? (단, ${va} &lt; ${vb} &lt; ${vc} &lt; ${V('d')})`, fs.map((f2, i) => [eqL('abcd'[i]), f2, `${Nn}${sh(f2 - Nn)}`, false]), {
        figure: ex(`(${Xs})${sup(2)} ${al < 0 ? MINUS : '+'} ${Math.abs(al)} × (${Xs}) ${be < 0 ? MINUS : '+'} ${Math.abs(be)} = ${va} × ${vb} × ${vc} × ${V('d')}`),
        derived: [r1, r2, r3, r4].map(Math.abs),
        explain: `${Nn} = ${X}로 놓고 ${xh(pn([[1, 'x^2'], [p, 'x']]))} = ${V('X')}로 놓으면 ${xh(pn([[1, 'X^2'], [al, 'X'], [be, '']]))} = ${xh(`(X${sh(u)})(X${sh(v)})`)} = ${xh(`(x${sh(r1)})(x${sh(r2)})(x${sh(r3)})(x${sh(r4)})`)}이다. ${X} = ${Nn}을 넣으면 ${fs.join(' × ')}이고 네 수가 모두 소수이므로 ${va} = ${fs[0]}, ${vb} = ${fs[1]}, ${vc} = ${fs[2]}, ${V('d')} = ${fs[3]}이다.`.replace(`${X} = ${Nn}을`, `${X} = ${Nn}${tail(Nn, '을/를')}`)
      });
    }, { standard: S2 })
  ];
  // 계수 배열에 상수 더하기
  function aAddC(p, c) { const o = p.slice(); o[0] = Q(o[0].p * 1 + c * o[0].q, o[0].q); return o; }

  B.addGroup(UNIT, { id: 'hard', title: '단원 종합', standard: S1, types: hardTypes });
})(typeof window !== 'undefined' ? window : globalThis);
