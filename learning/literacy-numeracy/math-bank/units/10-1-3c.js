// 고등학교 1학년 1학기 3단원 복소수와 이차방정식 — 실력 문항.
// 이 단원에서 아이들이 흔히 잘못 아는 것
//  - 「허수」「0이 아닌 실수」「z²이 음의 실수」의 조건에서 실수부분만 0으로 놓고, 허수부분이 0이 아니어야 한다(또는 실수부분이 0이 아니어야 한다)는 조건으로 값을 버리지 않는다.
//  - 허수 z = a + bi 를 놓고 b ≠ 0 을 잊어 b = 0 인 경우까지 답으로 삼거나, 양변을 b 로 나누지 못한다.
//  - 음수의 제곱근에서도 √a√b = √ab, √a/√b = √(a/b)가 늘 성립한다고 여긴다(둘 다 음수일 때, 분모만 음수일 때 깨진다).
//  - 「서로 다른 두 실수 a, b」의 「서로 다른」을 쓰지 않아 (a − b)² ≥ 0 에서 멈춘다. 「k의 값에 관계없이」를 항등식이나 모든 k 로 읽지 못한다.
//  - 근과 계수의 관계로 α − β 를 셈할 때 √ 의 부호(α > β)를 따지지 않는다. 「절댓값이 같고 부호가 다른 두 실근」에서 합이 0인 것만 쓰고 실근 조건(곱 &lt; 0)을 버린다.
//  - 켤레근은 계수가 실수일 때만 쓸 수 있다. kω 가 근이면 다른 근은 kω̄ 이다.
// 실력에 둔 잣대(과제 글·new-unit-guide-m): ① 그림·상황의 장치 때문에 배운 뜻을 정확히 대야 풀리는 것, ② 세 단계 넘게 이어 생각해야 풀리는 것.
// 각 유형 머리의 주석에 ①·②를 적었다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, N, inline } = B.kit;
  const { MINUS, gcd, Q, tx, V, sup, nz, ansV, rt, sqParts } = B.kit.mid;
  const K = B.kit.m1013, QD = K.quad, nb = K.nb;  // 긴 식은 기호 앞에서 줄이 갈릴 수 있게 나눠 붙인다(10-1-3a.js)
  const { UNIT, STD1, H, iq, jn, I, X, X2, Z, ZB, ZBAR_NOTE, va, vb, vk, AL, BE, OM, moreH, sumH, bar, endJ, ej, exq, cz, cadd, cmul, cconj, ipow, cxH, cxP, CALC_ABI, ABI, NOTE01, cxAns, valsQ, choose, polyH } = K;
  const { quadH, judgeQ, eqAns, rangeAns, DD } = QD;
  const VX = V('x'), VY = V('y'), VZ = V('z');
  // 계수가 복소수인 다항식의 글: terms = [[복소수 계수, 문자 글], …](계수가 0인 항은 적지 않는다)
  function cpolyH(terms) {
    const out = [];
    for (const [c, v] of terms) {
      if (c.r.p === 0 && c.m.p === 0) continue;
      let body, neg = false;
      if (c.r.p !== 0 && c.m.p !== 0) body = (v ? cxP(c) + v : '(' + cxH(c) + ')');
      else if (c.m.p === 0) { neg = c.r.p < 0; body = (Math.abs(c.r.p) === 1 && v ? '' : Math.abs(c.r.p)) + v; }
      else { neg = c.m.p < 0; body = (Math.abs(c.m.p) === 1 ? '' : Math.abs(c.m.p)) + v + I; }
      out.push(out.length === 0 ? (neg ? MINUS : '') + body : (neg ? ' ' + MINUS + ' ' : ' + ') + body);
    }
    return nb(out.join('') || '0');
  }

  B.addGroup(UNIT, {
    id: 'hard', title: '실력 문제', standard: STD1,
    types: [
      // ① 허수·0이 아닌 실수·z²이 음의 실수: 실수부분(허수부분)을 0으로 놓아 얻은 두 값 가운데 하나는 다른 쪽 조건에 걸려 버려야 한다.
      H('hard-cond-pick', '복소수가 실수·허수가 되는 조건에서 값 고르기', '①29 ①30', (d, n) => {
        const x1 = nz(d, -4, 4), x2 = d.until(() => nz(d, -4, 4), (t) => t !== x1), w = d.until(() => nz(d, -5, 5), (t) => t !== x2 && t !== x1);
        const p = d.pick([1, 2, -1]), q = d.pick([1, 2, -1]);
        // 0이 되어야 하는 쪽 F(x) = p(x − x1)(x − x2), 0이 아니어야 하는 쪽 G(x) = q(x − x1)(x − w)
        const F = [p * x1 * x2, -p * (x1 + x2), p], G = [q * x1 * w, -q * (x1 + w), q];
        const xv = n === 1 ? va : VX;
        const sq = xv + sup(2);
        if (n === 0 || n === 1) {
          // n = 0: 실수부분 F, 허수부분 G(실수부분이 0인 허수) / n = 1: 허수부분 F, 실수부분 G(0이 아닌 실수)
          const re = n === 0 ? F : G, im = n === 0 ? G : F;
          const z = cpolyH([[cz(re[2], im[2]), sq], [cz(re[1], im[1]), xv], [cz(re[0], im[0]), '']]);
          const ask = n === 0 ? `복소수 ${ej(z, '이/가')} 실수부분이 0인 허수일 때, 실수 ${xv}의 값은?` : `복소수 ${ej(z, '이/가')} 0이 아닌 실수일 때, 실수 ${xv}의 값은?`;
          return ansV(ask, Q(x2), 'int', {
            explain: `주어진 수를 정리하면 ${nb('(' + polyH(re, xv) + ') + (' + polyH(im, xv) + ')' + I)}이다. ${n === 0 ? '실수부분이 0' : '허수부분이 0'}이어야 하므로 ${nb(polyH(F, xv) + ' = 0')}에서 ${nb(xv + ' = ' + iq(x1))} 또는 ${nb(xv + ' = ' + iq(x2))}이다. 그런데 ${nb(xv + ' = ' + iq(x1))}이면 ${n === 0 ? '허수부분도 0이 되어 허수가 아니다' : '실수부분도 0이 되어 주어진 수가 0이다'}. 따라서 ${nb(xv + ' = ' + iq(x2))}이다.`,
            facts: { value: `((0-${jn(F[1])})${(x2 > x1) === (p > 0) ? '+' : '-'}((${jn(F[1])})*(${jn(F[1])})-4*${jn(F[2])}*${jn(F[0])})**0.5)/(2*${jn(F[2])})`, derived: [2, 4, 0.5] }
          });
        }
        // n = 2: z = F(x) + G(x)i 의 제곱이 음의 실수
        const z = nb('(' + polyH(F) + ') + (' + polyH(G) + ')' + I);
        return ansV(`실수 ${X}에 대하여 복소수 ${nb(Z + ' = ' + z)}의 제곱이 음의 실수일 때, ${X}의 값은?`, Q(x2), 'int', {
          explain: `${nb(Z + ' = ' + va + ' + ' + vb + I)}(${va}, ${vb}는 실수)에서 ${nb(Z + sup(2) + ' = ' + va + sup(2) + ' ' + MINUS + ' ' + vb + sup(2) + ' + 2' + va + vb + I)}이 음의 실수이려면 ${nb(va + vb + ' = 0')}이고 ${nb(va + sup(2) + ' &lt; ' + vb + sup(2))}, 곧 ${nb(va + ' = 0')}, ${nb(vb + ' ≠ 0')}이다. ${nb(polyH(F) + ' = 0')}에서 ${nb(X + ' = ' + iq(x1))} 또는 ${nb(X + ' = ' + iq(x2))}이고, ${nb(X + ' = ' + iq(x1))}이면 허수부분도 0이므로 ${nb(X + ' = ' + iq(x2))}이다.`,
          facts: { value: `((0-${jn(F[1])})${(x2 > x1) === (p > 0) ? '+' : '-'}((${jn(F[1])})*(${jn(F[1])})-4*${jn(F[2])}*${jn(F[0])})**0.5)/(2*${jn(F[2])})`, derived: [2, 4, 0.5] }
        });
      }, { count: 3 }),
      // ① 허수 z 이므로 b ≠ 0: (z − k)² 이 실수이면 z 의 실수부분이 k 이다.
      H('hard-zsq-real', '허수 z에 대하여 (z − k)²이 실수일 때 항상 성립하는 것', '①31', (d) => {
        const k = d.int(-3, 3), c = nz(d, -6, 6);
        const head = k === 0 ? nb(Z + sup(2) + moreH([[c, '']])) : nb('(' + Z + moreH([[-k, '']]) + ')' + sup(2) + moreH([[c, '']]));
        // 보기: [글, 늘 참인가] — z = k + bi (b = 1, 2 로 따져 본다)
        const holds = (f) => [1, 2, -3].every((b) => f(cz(k, b)));
        const s = (u) => cadd(u, cconj(u)), pr = (u) => cmul(u, cconj(u)), df = (u) => cadd(u, cmul(cz(-1), cconj(u)));
        const cand = [
          [nb(Z + ' + ' + ZB + ' = ' + iq(2 * k)), (u) => s(u).r.p === 2 * k && s(u).m.p === 0],
          [nb(Z + ' ' + MINUS + ' ' + ZB + ' = 0'), (u) => df(u).r.p === 0 && df(u).m.p === 0],
          [nb(Z + ZB + ' = ' + k * k), (u) => pr(u).r.p === k * k],
          [nb(Z + ' + ' + ZB + ' = ' + iq(-2 * k)), (u) => s(u).r.p === -2 * k],
          [nb(Z + ZB + ' = ' + Z + ' + ' + ZB), (u) => pr(u).r.p === s(u).r.p && s(u).m.p === 0],
          [nb(Z + ZB + ' = 1'), (u) => pr(u).r.p === 1],
          [nb(Z + ' ' + MINUS + ' ' + ZB + ' = ' + iq(2 * k)), (u) => df(u).r.p === 2 * k && df(u).m.p === 0]
        ];
        const rows = [];
        for (const [h, f] of cand) if (!rows.some((r) => r[0] === h)) rows.push([h, holds(f)]);
        const right = rows.filter((r) => r[1]), wrong = d.shuffle(rows.filter((r) => !r[1])).slice(0, 4);
        if (right.length !== 1 || wrong.length < 4) return null;
        return choose(d, `허수 ${Z}에 대하여 ${ej(head, '이/가')} 실수일 때, 다음 가운데 항상 성립하는 것은? ${ZBAR_NOTE}`, right.concat(wrong), {
          explain: `${nb(Z + ' = ' + va + ' + ' + vb + I)}(${va}, ${vb}는 실수, ${nb(vb + ' ≠ 0')})라 하면 ${k === 0 ? nb(Z + sup(2) + ' = ' + va + sup(2) + ' ' + MINUS + ' ' + vb + sup(2) + ' + 2' + va + vb + I) : nb('(' + Z + moreH([[-k, '']]) + ')' + sup(2) + ' = (' + va + moreH([[-k, '']]) + ')' + sup(2) + ' ' + MINUS + ' ' + vb + sup(2) + ' + 2(' + va + moreH([[-k, '']]) + ')' + vb + I)}이다. 이 수가 실수이려면 허수부분이 0이어야 하고 ${nb(vb + ' ≠ 0')}이므로 ${nb(va + ' = ' + iq(k))}이다. 따라서 ${nb(Z + ' + ' + ZB + ' = 2' + va + ' = ' + iq(2 * k))}이다.`,
          facts: { rule: 'zsq-real' }
        });
      }),
      // ① 허수 z 이므로 b ≠ 0 으로 나누어 a² + b² 을 얻는다.
      H('hard-zfrac-real', 'z/m + n/z가 실수인 허수 z의 zz̄', '①35', (d) => {
        const m = d.int(2, 6), n2 = d.int(2, 9);
        return ansV(`실수가 아닌 복소수 ${Z}에 대하여 ${ej(nb(frac(Z, m) + ' + ' + frac(n2, Z)), '이/가')} 실수일 때, ${nb(Z + ZB)}의 값은? ${ZBAR_NOTE}`, Q(m * n2), 'int', {
          explain: `${nb(Z + ' = ' + va + ' + ' + vb + I)}(${va}, ${vb}는 실수, ${nb(vb + ' ≠ 0')})로 놓으면 ${frac(n2, Z)} = ${frac(nb(n2 + '(' + va + ' ' + MINUS + ' ' + vb + I + ')'), nb(va + sup(2) + ' + ' + vb + sup(2)))}이므로 주어진 수의 허수부분은 ${nb(frac(vb, m) + ' ' + MINUS + ' ' + frac(nb(n2 + vb), nb(va + sup(2) + ' + ' + vb + sup(2))))}이다. 이 값이 0이고 ${nb(vb + ' ≠ 0')}이므로 ${nb(va + sup(2) + ' + ' + vb + sup(2) + ' = ' + m * n2)}이다. ${nb(Z + ZB + ' = ' + va + sup(2) + ' + ' + vb + sup(2))}이므로 구하는 값은 ${m * n2}이다.`,
          facts: { value: `${m}*${n2}` }
        });
      }),
      // ① √a√b = √ab, √a/√b = −√(a/b) 가 성립하는 때를 대어 부호를 정한 뒤 절댓값을 푼다.
      H('hard-sqrt-sign', '음수의 제곱근의 성질로 부호를 정해 식 간단히 하기', '①28', (d) => {
        const sxy = (a, b) => nb(rt(a) + rt(b)), pr = (a, b) => rt(a + b), qt = (a, b) => frac(rt(a), rt(b)), rq = (a, b) => rt(frac(a, b));
        const VARS = { x: VX, y: VY, z: VZ };
        // 갈래: 조건 둘(글)과 부호, 간단히 할 식(절댓값·근호 안의 일차식과 그 앞의 부호)
        const kinds = [
          { conds: [`${nb(sxy(VX, VY) + ' = ' + pr(VX, VY))}`, `${nb(qt(VZ, VY) + ' = ' + MINUS + rq(VZ, VY))}`], sign: { x: 1, y: -1, z: 1 }, why: `둘째 식에서 ${nb(VY + ' &lt; 0')}, ${nb(VZ + ' &gt; 0')}이다. 첫째 식은 ${VX}, ${VY}가 모두 음수일 때 성립하지 않으므로 ${nb(VX + ' &gt; 0')}이다` },
          { conds: [`${nb(sxy(VX, VY) + ' = ' + MINUS + pr(VX, VY))}`, `${nb(qt(VZ, VY) + ' = ' + MINUS + rq(VZ, VY))}`], sign: { x: -1, y: -1, z: 1 }, why: `첫째 식에서 ${nb(VX + ' &lt; 0')}, ${nb(VY + ' &lt; 0')}이고, 둘째 식에서 ${nb(VZ + ' &gt; 0')}이다` },
          { conds: [`${nb(qt(VX, VY) + ' = ' + MINUS + rq(VX, VY))}`, `${nb(sxy(VY, VZ) + ' = ' + MINUS + pr(VY, VZ))}`], sign: { x: 1, y: -1, z: -1 }, why: `첫째 식에서 ${nb(VX + ' &gt; 0')}, ${nb(VY + ' &lt; 0')}이고, 둘째 식에서 ${nb(VZ + ' &lt; 0')}이다` }
        ];
        const kd = d.pick(kinds), sg = kd.sign;
        // 일차식 [cx, cy, cz] 의 부호: 부호가 정해지는 것만 쓴다(항마다 부호가 같은 쪽).
        const signOf = (v) => { const t = ['x', 'y', 'z'].map((k, i) => v[i] * sg[k]).filter((w) => w !== 0); return t.every((w) => w > 0) ? 1 : t.every((w) => w < 0) ? -1 : 0; };
        const pool = [];
        for (const [i, j] of [[0, 1], [1, 2], [0, 2]]) for (const sj of [1, -1]) { const v = [0, 0, 0]; v[i] = 1; v[j] = sj; if (signOf(v)) pool.push(v); }
        for (const v of [[1, -1, 1], [1, 1, -1], [-1, 1, 1], [1, -1, -1]]) if (signOf(v)) pool.push(v);
        const picks = d.shuffle(pool).slice(0, 3);
        if (picks.length < 3) return null;
        const outer = [1, d.pick([1, -1]), d.pick([1, -1])], forms = [0, 0, 1];   // 셋째 항은 √(식²)
        const lin = (v) => sumH(v.map((cf, i) => [cf, VARS['xyz'[i]]]));
        const termH = (v, f) => (f ? rt('(' + lin(v) + ')' + sup(2)) : '|' + lin(v) + '|');
        const E = nb(picks.map((v, i) => (i === 0 ? '' : outer[i] > 0 ? ' + ' : ' ' + MINUS + ' ') + termH(v, forms[i])).join(''));
        const value = (assume) => picks.reduce((acc, v, i) => acc.map((a, k) => a + outer[i] * assume[i] * v[k]), [0, 0, 0]);
        const right = value(picks.map(signOf));
        const rows = [[lin(right), true]];
        for (let mask = 0; mask < 8; mask += 1) {
          const assume = picks.map((v, i) => ((mask >> i) & 1 ? -1 : 1) * signOf(v));
          const w = value(assume);
          if (!rows.some((r) => r[0] === lin(w))) rows.push([lin(w), false]);
        }
        if (rows.length < 5) return null;
        return choose(d, `0이 아닌 세 실수 ${VX}, ${VY}, ${VZ}에 대하여 ${kd.conds[0]}, ${kd.conds[1]}일 때, ${ej(E, '을/를')} 간단히 하면?`, rows.slice(0, 1).concat(d.shuffle(rows.slice(1)).slice(0, 4)), {
          explain: `${kd.why}. 따라서 ${picks.map((v) => `${nb(lin(v) + (signOf(v) > 0 ? ' &gt; 0' : ' &lt; 0'))}`).join(', ')}이므로 ${E} = ${lin(right)}이다.`,
          facts: { rule: 'sqrt-sign' }
        });
      }),
      // ② 네 항씩 묶은 합이 늘 2 − 2i 임을 보거나, z² 을 먼저 구해 계수가 붙은 합을 셈한다.
      H('hard-pow-weighted', '계수가 붙은 거듭제곱의 합', '①20 ①22', (d, n) => {
        if (n === 0) {
          const Nn = d.int(9, 40);
          let v = cz(0, 0); for (let k = 1; k <= Nn; k += 1) v = cadd(v, cmul(cz(k), ipow(k)));
          const q4 = `((${Nn}-${Nn}%4)/4)`, r4 = `(${Nn}%4)`;
          return cxAns(CALC_ABI, v, {
            figure: exq(nb(`${I} + 2${I}${sup(2)} + 3${I}${sup(3)} + 4${I}${sup(4)} + ⋯ + ${Nn}${I}${sup(Nn)}`)),
            explain: `${nb(I + ' + 2' + I + sup(2) + ' + 3' + I + sup(3) + ' + 4' + I + sup(4) + ' = ' + I + ' ' + MINUS + ' 2 ' + MINUS + ' 3' + I + ' + 4 = 2 ' + MINUS + ' 2' + I)}이고, 그다음 네 항씩도 ${nb('(4' + V('m') + ' + 1)' + I + ' ' + MINUS + ' (4' + V('m') + ' + 2) ' + MINUS + ' (4' + V('m') + ' + 3)' + I + ' + (4' + V('m') + ' + 4) = 2 ' + MINUS + ' 2' + I)}이다. ${Nn}${endJ(String(Nn), '을/를')} 4로 나누면 몫이 ${(Nn - Nn % 4) / 4}, 나머지가 ${Nn % 4}이므로 묶음 ${(Nn - Nn % 4) / 4}개의 합에 남는 ${Nn % 4}개의 항을 더하면 ${cxH(v)}이다.`,
            calc: [`2*${q4}-(${r4}-${r4}%2)/2*(4*${q4}+2)`, `0-2*${q4}+(${r4}+3-(${r4}+3)%4)/4*(4*${q4}+1)-(${r4}-${r4}%3)/3*(4*${q4}+3)`],
            derived: [2, 3, 4],
            facts: { rule: 'weighted-i' }
          });
        }
        // √2 z ± (1 ∓ i) = 0 → z² = ±i. c0 + c1 z² + c2 z⁴ + c3 z⁶ + c4 z⁸
        const s = d.pick([1, -1]), cs = Array.from({ length: 5 }, () => d.int(1, 9));
        const eq = s < 0 ? nb(rt(2) + Z + ' + 1 ' + MINUS + ' ' + I + ' = 0') : nb(rt(2) + Z + ' ' + MINUS + ' 1 ' + MINUS + ' ' + I + ' = 0');
        const w = cz(0, s);
        let v = cz(0, 0); for (let j = 0; j <= 4; j += 1) { let t = cz(1); for (let k = 0; k < j; k += 1) t = cmul(t, w); v = cadd(v, cmul(cz(cs[j]), t)); }
        const expr = nb(cs[0] + ' + ' + [1, 2, 3, 4].map((j) => (cs[j] === 1 ? '' : cs[j]) + Z + sup(2 * j)).join(' + '));
        return cxAns(`등식 ${ej(eq, '을/를')} 만족시키는 복소수 ${Z}에 대하여 ${ej(expr, '을/를')} ${ABI}(${va}, ${vb}는 실수) 꼴로 나타내시오.`, v, {
          explain: `${nb(Z + ' = ' + frac(nb(s < 0 ? I + ' ' + MINUS + ' 1' : '1 + ' + I), rt(2)))}이므로 ${nb(Z + sup(2) + ' = ' + frac(nb('(' + (s < 0 ? I + ' ' + MINUS + ' 1' : '1 + ' + I) + ')' + sup(2)), 2) + ' = ' + cxH(w))}이다. ${nb(Z + sup(4) + ' = ' + MINUS + '1')}, ${nb(Z + sup(6) + ' = ' + cxH(cconj(w)))}, ${nb(Z + sup(8) + ' = 1')}이므로 주어진 식은 ${cxH(v)}이다.`,
          calc: [`${cs[0]}-${cs[2]}+${cs[4]}`, `${jn(s)}*(${cs[1]}-${cs[3]})`],
          facts: { rule: 'weighted-z' }
        });
      }, { count: 2 }),
      // ① 「서로 다른」 두 실수라서 (a − b)² > 0 / ② 중근 조건 a² = mb 를 넣어 다른 방정식의 판별식을 완전제곱식으로 묶는다.
      H('hard-disc-letter', '조건이 붙은 문자 계수 이차방정식의 근 판별', '②5', (d, n) => {
        if (n === 0) {
          const k = d.int(1, 2), imag = d.bool();
          const eq = imag
            ? nb(X2 + ' + ' + (2 * k) + '(' + va + ' + ' + vb + ')' + X + ' + ' + (2 * k * k) + '(' + va + sup(2) + ' + ' + vb + sup(2) + ') = 0')
            : nb(X2 + ' ' + MINUS + ' ' + (2 * k) + '(' + va + ' + ' + vb + ')' + X + ' + ' + (4 * k * k) + va + vb + ' = 0');
          return judgeQ(`서로 다른 두 실수 ${va}, ${vb}에 대하여 ${X}에 대한 이차방정식 ${eq}의 근을 판별한 것은?`, imag ? -1 : 1, {
            explain: imag
              ? `${nb(DD + '/4 = ' + (k === 1 ? '' : k * k) + '(' + va + ' + ' + vb + ')' + sup(2) + ' ' + MINUS + ' ' + (2 * k * k) + '(' + va + sup(2) + ' + ' + vb + sup(2) + ') = ' + MINUS + (k === 1 ? '' : k * k) + '(' + va + ' ' + MINUS + ' ' + vb + ')' + sup(2))}이다. ${va}, ${vb}가 서로 다른 실수이므로 ${nb('(' + va + ' ' + MINUS + ' ' + vb + ')' + sup(2) + ' &gt; 0')}, 곧 ${nb(DD + ' &lt; 0')}이다. 서로 다른 두 허근을 갖는다.`
              : `${nb(DD + '/4 = ' + (k === 1 ? '' : k * k) + '(' + va + ' + ' + vb + ')' + sup(2) + ' ' + MINUS + ' ' + (4 * k * k) + va + vb + ' = ' + (k === 1 ? '' : k * k) + '(' + va + ' ' + MINUS + ' ' + vb + ')' + sup(2))}이다. ${va}, ${vb}가 서로 다른 실수이므로 ${nb(DD + ' &gt; 0')}이고 서로 다른 두 실근을 갖는다.`,
            facts: { rule: 'letter-distinct' }
          });
        }
        const m = d.pick([1, 2, 3]), r = d.pick([1, 2]), cmin = Math.floor((r ** 4) * m * m / 4) + 1, c = cmin + d.int(0, 4);
        const e1 = nb(X2 + ' + 2' + va + X + ' + ' + (m === 1 ? '' : m) + vb + ' = 0'), e2 = nb(X2 + ' + ' + (2 * r) + va + X + ' + ' + vb + sup(2) + ' + ' + c + ' = 0');
        return judgeQ(`실수 ${va}, ${vb}에 대하여 이차방정식 ${ej(e1, '이/가')} 중근을 가질 때, ${X}에 대한 이차방정식 ${e2}의 근을 판별한 것은?`, -1, {
          explain: `첫째 방정식이 중근을 가지므로 ${nb(DD + '/4 = ' + va + sup(2) + ' ' + MINUS + ' ' + (m === 1 ? '' : m) + vb + ' = 0')}, 곧 ${nb(va + sup(2) + ' = ' + (m === 1 ? '' : m) + vb)}이다. 둘째 방정식에서 ${nb(DD + '/4 = ' + (r * r === 1 ? '' : r * r) + va + sup(2) + ' ' + MINUS + ' ' + vb + sup(2) + ' ' + MINUS + ' ' + c + ' = ' + MINUS + vb + sup(2) + ' + ' + (r * r * m) + vb + ' ' + MINUS + ' ' + c)} = ${nb(MINUS + '(' + vb + ' ' + MINUS + ' ' + tx(Q(r * r * m, 2)) + ')' + sup(2) + ' ' + MINUS + ' ' + tx(Q(4 * c - r ** 4 * m * m, 4)))} &lt; 0이므로 서로 다른 두 허근을 갖는다.`,
          facts: { rule: 'letter-chain' }
        });
      }, { count: 2 }),
      // ② 전개 → 판별식 → 완전제곱식의 합 → 세 변이 같다(네 단계).
      H('hard-triangle', '중근 조건으로 삼각형의 모양 알기', '②6', (d) => {
        const rows = [['정삼각형', true], [`빗변의 길이가 ${V('c')}인 직각삼각형`, false], [`${nb(va + ' = ' + vb)}이고 ${nb(vb + ' ≠ ' + V('c'))}인 이등변삼각형`, false], ['둔각삼각형', false], ['세 변의 길이가 모두 다른 삼각형', false]];
        const vcc = V('c');
        const eq = nb('(' + X + ' ' + MINUS + ' ' + va + ')(' + X + ' ' + MINUS + ' ' + vb + ') + (' + X + ' ' + MINUS + ' ' + vb + ')(' + X + ' ' + MINUS + ' ' + vcc + ') + (' + X + ' ' + MINUS + ' ' + vcc + ')(' + X + ' ' + MINUS + ' ' + va + ') = 0');
        return choose(d, `세 양수 ${va}, ${vb}, ${vcc}에 대하여 ${X}에 대한 이차방정식 ${ej(eq, '이/가')} 중근을 가질 때, 세 변의 길이가 ${va}, ${vb}, ${vcc}인 삼각형은?`, rows, {
          explain: `전개하여 정리하면 ${nb('3' + X2 + ' ' + MINUS + ' 2(' + va + ' + ' + vb + ' + ' + vcc + ')' + X + ' + ' + va + vb + ' + ' + vb + vcc + ' + ' + vcc + va + ' = 0')}이다. 중근을 가지므로 ${nb(DD + '/4 = (' + va + ' + ' + vb + ' + ' + vcc + ')' + sup(2) + ' ' + MINUS + ' 3(' + va + vb + ' + ' + vb + vcc + ' + ' + vcc + va + ') = 0')}, 곧 ${frac(1, 2)}${nb('{(' + va + ' ' + MINUS + ' ' + vb + ')' + sup(2) + ' + (' + vb + ' ' + MINUS + ' ' + vcc + ')' + sup(2) + ' + (' + vcc + ' ' + MINUS + ' ' + va + ')' + sup(2) + '} = 0')}이다. ${va}, ${vb}, ${vcc}가 실수이므로 ${nb(va + ' = ' + vb + ' = ' + vcc)}이고, 정삼각형이다.`,
          facts: { rule: 'triangle' }
        });
      }),
      // ① α > β 이므로 α − β = √((α + β)² − 4αβ) 의 부호를 정한다.
      H('hard-diff-order', 'α > β일 때 근의 차가 든 식의 값', '②19', (d) => {
        const s = nz(d, -7, 7), p = nz(d, -6, 6), D = s * s - 4 * p;
        if (D <= 0) return null;
        const [k, t] = sqParts(D);
        if (t === 1) return null;
        // α/β − β/α = (α + β)(α − β)/(αβ) = s·k√t/p
        let num = s * k, den = p;
        if (den < 0) { num = -num; den = -den; }
        const g = gcd(Math.abs(num), den); num /= g; den /= g;
        if (den < 2) return null;
        const eq = nb(quadH(1, -s, p) + ' = 0');
        return inline(`이차방정식 ${eq}의 두 근을 ${AL}, ${BE}라 할 때, ${nb(frac(AL, BE) + ' ' + MINUS + ' ' + frac(BE, AL))}의 값은? <span style="white-space:nowrap">(단, ${nb(AL + ' &gt; ' + BE)}이고, 0이나 1도 칸에 적는다.)</span>`, frac('{0}' + rt('{1}'), '{2}'), [{ answer: num, signed: true }, { answer: t }, { answer: den }], {
          shown: nb((num < 0 ? MINUS : '') + frac((Math.abs(num) === 1 ? '' : Math.abs(num)) + rt(t), den)),
          explain: `${nb(AL + ' + ' + BE + ' = ' + iq(s))}, ${nb(AL + BE + ' = ' + iq(p))}이다. ${nb('(' + AL + ' ' + MINUS + ' ' + BE + ')' + sup(2) + ' = (' + AL + ' + ' + BE + ')' + sup(2) + ' ' + MINUS + ' 4' + AL + BE + ' = ' + D)}이고 ${nb(AL + ' &gt; ' + BE)}이므로 ${nb(AL + ' ' + MINUS + ' ' + BE + ' = ' + rt(D))}이다. ${frac(AL, BE)} ${MINUS} ${frac(BE, AL)} = ${frac(nb('(' + AL + ' + ' + BE + ')(' + AL + ' ' + MINUS + ' ' + BE + ')'), AL + BE)} = ${frac(nb(iq(s) + ' × ' + rt(D)), iq(p))} = ${nb((num < 0 ? MINUS : '') + frac((Math.abs(num) === 1 ? '' : Math.abs(num)) + rt(t), den))}이다.`,
          facts: { calc: [[`${jn(s)}*((${jn(s)}*${jn(s)}-4*${jn(p)})/${t})**0.5*${p < 0 ? '(0-1)' : '1'}/${g}`, 0], [`(${jn(s)}*${jn(s)}-4*${jn(p)})/${k}/${k}`, 1], [`${Math.abs(p)}/${g}`, 2]], derived: [4, 0.5, t, k, g] }
        });
      }),
      // ① 합이 0 이라는 것만으로는 부족하다: 「두 실근」이려면 곱이 음수여야 한다.
      H('hard-opposite', '절댓값이 같고 부호가 다른 두 실근', '②24', (d) => {
        const r1 = d.int(-4, 4), r2 = d.until(() => d.int(-4, 4), (t) => t !== r1), u = nz(d, -3, 3), v = nz(d, -6, 6);
        const ok = [r1, r2].map((k) => u * k + v < 0);
        if (ok.filter(Boolean).length !== 1) return null;
        const k = ok[0] ? r1 : r2, bad = ok[0] ? r2 : r1;
        const eq = nb(X2 + ' + (' + sumH([[1, vk + sup(2)], [-(r1 + r2), vk], [r1 * r2, '']]) + ')' + X + moreH([[u, vk], [v, '']]) + ' = 0');
        return ansV(`${X}에 대한 이차방정식 ${eq}의 두 실근의 절댓값이 같고 부호가 서로 다를 때, 실수 ${vk}의 값은?`, Q(k), 'int', {
          explain: `두 근의 합이 0이어야 하므로 ${nb(sumH([[1, vk + sup(2)], [-(r1 + r2), vk], [r1 * r2, '']]) + ' = 0')}에서 ${nb(vk + ' = ' + iq(r1))} 또는 ${nb(vk + ' = ' + iq(r2))}이다. 두 근이 실수이고 부호가 다르려면 두 근의 곱 ${ej(sumH([[u, vk], [v, '']]), '이/가')} 음수여야 한다. ${nb(vk + ' = ' + iq(bad))}이면 곱이 ${iq(u * bad + v)}이므로 ${u * bad + v === 0 ? '두 근이 모두 0이다' : '두 근이 허근이다'}. 따라서 ${nb(vk + ' = ' + iq(k))}이다.`,
          facts: { value: jn(k), derived: [Math.abs(k)] }
        });
      }),
      // ② 두 근의 차 = 걸린 시간: 근과 계수의 관계로 (β − α)² = (α + β)² − 4αβ 에 넣어 a 를 구한다.
      H('hard-rocket', '두 근의 차로 쏘아 올린 물체의 처음 속력 구하기', '②22', (d) => {
        const T = d.int(2, 9), s = d.until(() => d.int(T + 1, 16), (x) => (x * x - T * T) % 4 === 0), m = (s * s - T * T) / 4, h = 5 * m, a = 5 * s;
        if (h > 600) return null;
        const tv = V('t');
        return N(`지면에서 수직으로 쏘아 올린 물체의 ${tv}초 후의 높이는 ${nb('(' + MINUS + '5' + tv + sup(2) + ' + ' + V('a') + tv + ') m')}이다. 이 물체가 높이 ${h} m인 곳을 지난 뒤 다시 높이 ${h} m인 곳에 올 때까지 ${T}초가 걸렸을 때, 상수 ${V('a')}의 값은?`, a, {
          explain: `${nb(MINUS + '5' + tv + sup(2) + ' + ' + V('a') + tv + ' = ' + h)}, 곧 ${nb('5' + tv + sup(2) + ' ' + MINUS + ' ' + V('a') + tv + ' + ' + h + ' = 0')}의 두 근을 ${AL}, ${BE}(${nb(AL + ' &lt; ' + BE)})라 하면 ${nb(AL + ' + ' + BE + ' = ' + frac(V('a'), 5))}, ${nb(AL + BE + ' = ' + m)}이고 ${nb(BE + ' ' + MINUS + ' ' + AL + ' = ' + T)}이다. ${nb('(' + BE + ' ' + MINUS + ' ' + AL + ')' + sup(2) + ' = (' + AL + ' + ' + BE + ')' + sup(2) + ' ' + MINUS + ' 4' + AL + BE)}에서 ${nb(T * T + ' = ' + frac(V('a') + sup(2), 25) + ' ' + MINUS + ' ' + 4 * m)}이므로 ${nb(V('a') + sup(2) + ' = ' + a * a)}이고, ${nb(V('a') + ' &gt; 0')}이므로 ${nb(V('a') + ' = ' + a)}이다.`,
          facts: { value: `5*(${T}*${T}+4*${h}/5)**0.5`, derived: [4, 0.5] }
        });
      }),
      // ② 두 방정식에 근을 넣어 a, b 를 연립으로 구하고, 다른 두 근을 구해 새 이차방정식을 만든다.
      H('hard-twoeq', '두 이차방정식의 근이 얽힌 꼴', '②27', (d) => {
        const r = nz(d, -4, 4), al = nz(d, -6, 6), s = nz(d, -3, 3), a = -(r + al), b = r * al, u = s * s - b * s + a, be = b - s;
        if (al === r || u === 0 || r * s + 1 === 0 || be === 0 || al + be === 0 || Math.abs(al * be) > 200) return null;
        const e1 = nb(X2 + ' + ' + va + X + ' + ' + vb + ' = 0'), e2 = nb(X2 + ' ' + MINUS + ' ' + vb + X + ' + (' + va + moreH([[-u, '']]) + ') = 0');
        const bE = `((0-${jn(r)}*${jn(r)}-${jn(r)}*${jn(u)}+${jn(r)}*${jn(s)}*${jn(s)})/(${jn(r)}*${jn(s)}+1))`, aE = `(${jn(u)}-${jn(s)}*${jn(s)}+${bE}*${jn(s)})`, alE = `(0-${aE}-${jn(r)})`, beE = `(${bE}-${jn(s)})`;
        return eqAns(`이차방정식 ${e1}의 두 근이 ${iq(r)}, ${AL}이고, 이차방정식 ${e2}의 두 근이 ${iq(s)}, ${BE}일 때, ${AL}, ${BE}를 두 근으로 하고 ${X2}의 계수가 1인 이차방정식을 구하시오. (단, ${va}, ${vb}는 실수이다.)`, -(al + be), al * be, {
          explain: `${nb(X + ' = ' + iq(r))}${endJ(iq(r), '을/를')} 첫째 방정식에, ${nb(X + ' = ' + iq(s))}${endJ(iq(s), '을/를')} 둘째 방정식에 넣으면 ${nb(sumH([[r, va], [1, vb]]) + ' = ' + iq(-r * r))}, ${nb(sumH([[1, va], [-s, vb]]) + ' = ' + iq(u - s * s))}이다. 연립하여 풀면 ${nb(va + ' = ' + iq(a))}, ${nb(vb + ' = ' + iq(b))}이다. 첫째 방정식의 두 근의 곱에서 ${nb(AL + ' = ' + iq(al))}, 둘째 방정식의 두 근의 합에서 ${nb(BE + ' = ' + iq(be))}이므로 구하는 이차방정식은 ${nb(quadH(1, -(al + be), al * be) + ' = 0')}이다.`,
          facts: { calc: [[`0-(${alE}+${beE})`, 0], [`${alE}*${beE}`, 1]], rule: 'twoeq-hard' }
        });
      }),
      // ① 계수가 실수이므로 kω 가 근이면 kω̄ 도 근이다(ω̄ 도 처음 방정식의 근).
      H('hard-omega', 'ω가 근인 이차방정식으로 kω를 근으로 갖는 이차방정식의 계수', '②34', (d) => {
        const p = nz(d, -3, 3), q = d.until(() => d.int(1, 9), (x) => p * p - 4 * x < 0), k = d.pick([2, 3, -2, -1, 4]);
        const base = nb(quadH(1, p, q) + ' = 0'), kw = nb((k === -1 ? MINUS : k) + OM);
        return valsQ(`이차방정식 ${base}의 한 허근을 ${OM}라 하자. 이차방정식 ${nb(X2 + ' ' + MINUS + ' ' + va + X + ' + ' + vb + ' = 0')}의 한 근이 ${kw}일 때, 실수 ${va}, ${vb}의 값은?`, [['a', -k * p], ['b', k * k * q]], {
          explain: `${OM}의 켤레복소수 ${bar(OM)}도 ${base}의 근이므로 ${nb(OM + ' + ' + bar(OM) + ' = ' + iq(-p))}, ${nb(OM + bar(OM) + ' = ' + q)}이다. 계수가 실수인 이차방정식의 한 근이 ${kw}이므로 다른 한 근은 ${nb((k === -1 ? MINUS : k) + bar(OM))}이다. 따라서 ${nb(va + ' = ' + (k === -1 ? MINUS : k) + '(' + OM + ' + ' + bar(OM) + ') = ' + iq(-k * p))}, ${nb(vb + ' = ' + (k * k === 1 ? '' : k * k) + OM + bar(OM) + ' = ' + k * k * q)}이다.`,
          facts: { calc: [[`0-${jn(k)}*${jn(p)}`, 0], [`${jn(k)}*${jn(k)}*${q}`, 1]], derived: [k * k] }
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
