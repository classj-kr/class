// 고1 1학기 5단원 여러 가지 방정식 — 실력 문항. 단원 틀과 도구는 10-1-5a.js 에 있다(B.kit.m1015).
// ref: ①n·②n = 기본꼴의 n번(기본 자료에서 어려움이 단원의 뜻이나 셋을 넘는 단계에서 오는 것), 심n = 심화꼴(대단원 기출 모의고사)의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것
//  - 방정식을 x 로 나누어 근 0을 잃는다(x⁴ − 8x = 0, x² = 2xy). 연립방정식에서 x = 0 갈래를 버린다.
//  - 중근을 두 번 센다(「서로 다른 근의 개수」). 삼차식이 (일차)(이차)로 나뉠 때 「이차식이 남은 일차식의 근을 근으로 갖는 경우」를 놓친다.
//  - x³ = −1 의 허근에 ω³ = 1을 그대로 쓴다. 1/ω = ω̄ = ω² 을 가리지 못한다.
//  - 계수가 실수일 때만 켤레복소수도 근이라는 것, 근이 m/(u + vi) 꼴로 주어지면 먼저 a + bi 꼴로 고쳐야 한다는 것.
//  - (일차식)(일차식) = 상수 꼴을 0 = 0 꼴처럼 「각 인수 = 상수」로 푼다. 두 식을 더하고 빼면 x + y, xy 가 나오는 것을 보지 못한다.
//  - 실수인 해가 있을 조건(판별식 ≥ 0)과 해가 한 쌍일 조건(판별식 = 0), 유리수 a, b 에 대한 a + bπ = c + dπ 를 가르지 못한다.
// 실력은 ① 뜻을 정확히 대야 풀리는 함정 문제 ② 세 단계 넘게 잇는 문제만 싣는다(과제 글). 유형마다 ①/② 를 적었다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, N, M, C, F, inline } = B.kit;
  const { MINUS, gcd, Q, tx, nb, tail, V, sup, rt, grp, sqParts, radAns, sys, SG } = B.kit.mid;
  const { STD3, STD2, X, Y, I, W_, va, vb, vk, vm, iq, sT, isSq, sqfree, H, sumH, termH, eqH, polyH, linH, facH, endJ, keep, emW, choose, valsQ, fromRoots, pMul, pEval, cx, cadd, cmul, cpow, cnear, OMEGA, wp, quad, pmH, realRoots } = B.kit.m1015;
  const { Board, at, dist, mid: midP } = B.kit.mgeo;
  const X2 = X + sup(2), Y2 = Y + sup(2), XY = X + Y;
  const A_ = V('α'), Bt = V('β'), G_ = V('γ');
  const sysQ = (rows) => { const width = Math.max(...rows.map(emW)) + 1.2, size = Math.min(1.15, 16 / width); return `<span style="font-size:${Math.max(size, 0.78).toFixed(2)}em">${sys(rows)}</span>`; };
  // k 가 든 계수 (c1·k + c0) 의 글: 계수 자리에 쓰면 괄호를 친다.
  const kTerm = (c1, c0) => sumH([[c1, vk], [c0, '']]);
  const kCoef = (c1, c0, h, first) => {
    if (c1 === 0) return termH(c0, h, first);
    if (c0 === 0) return (first ? (c1 < 0 ? MINUS : '') : c1 < 0 ? ' ' + MINUS + ' ' : ' + ') + (Math.abs(c1) === 1 ? '' : Math.abs(c1)) + vk + h;
    return (first ? '' : ' + ') + '(' + kTerm(c1, c0) + ')' + h;
  };
  const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41], [12, 35, 37]];

  B.addGroup('10-1-5', {
    id: 'hard', title: '실력 문제', standard: STD3, types: [
      H('hard-baby', '② n³ + n²의 표로 푸는 삼차방정식(바빌로니아의 방법)', '①19', (d) => {
        const opts = [];
        for (const m of [2, 3, 4, 5, 6]) for (let n = 2; n <= 8; n += 1) if (gcd(m, n) === 1 && (n ** 3 + n * n) % m === 0) opts.push([m, n]);
        const [m, n] = d.pick(opts), c = (n ** 3 + n * n) / m;
        const rows = Array.from({ length: 8 }, (_, i) => [String(i + 1), String((i + 1) ** 3 + (i + 1) ** 2)]);
        const tbl = '<div class="mb-table-wrap"><table class="mb-table" aria-label="n³ + n²의 표: ' + rows.map(([a, b]) => `n = ${a}일 때 ${b}`).join(', ') + '"><thead><tr><th>' + V('n') + '</th><th>' + V('n') + sup(3) + ' + ' + V('n') + sup(2) + '</th></tr></thead><tbody>' + rows.map(([a, b]) => `<tr><td>${a}</td><td>${b}</td></tr>`).join('') + '</tbody></table></div>';
        return F(`표는 자연수 ${V('n')}에 대하여 ${nb(V('n') + sup(3) + ' + ' + V('n') + sup(2))}의 값을 나타낸 것이다. 바빌로니아 사람들은 이런 표를 써서 삼차방정식을 풀었다. 이 표를 이용하여 삼차방정식 ${nb(eqH(sumH([[m * m, X + sup(3)], [m, X2]]), String(c)))}의 실근을 구하시오.`, n, m, {
          figure: tbl, improper: n > m, anyForm: true,
          explain: `양변에 ${m}${tail(m, '을/를')} 곱하면 ${nb(m ** 3 + X + sup(3) + ' + ' + m * m + X2 + ' = ' + c * m)}, 곧 ${nb('(' + m + X + ')' + sup(3) + ' + (' + m + X + ')' + sup(2) + ' = ' + c * m)}이다. 표에서 ${nb(V('n') + sup(3) + ' + ' + V('n') + sup(2) + ' = ' + c * m)}인 ${V('n')}${endJ(V('n'), '은/는')} ${n}이므로 ${nb(m + X + ' = ' + n)}, ${nb(X + ' = ' + tx(Q(n, m)))}이다. (${nb(V('n') + sup(3) + ' + ' + V('n') + sup(2))}${endJ(sup(2), '은/는')} ${V('n')}이 커질수록 커지므로 실근은 이것 하나뿐이다.)`,
          facts: { value: `${c}*${m}/${c * m}*${n}/${m}`, unseen: [c * m, n].filter((v) => v > 1) }
        });
      }),
      H('hard-ratio', '② 복이차방정식의 두 양의 실근의 비로 계수 구하기', '①22', (d) => {
        const s = d.int(1, 3), k = d.pick([2, 3]), c = k * k * s * s, Mv = s * (1 + k * k);
        return N(`사차방정식 ${nb(eqH(X + sup(4) + ' ' + MINUS + ' ' + vm + X2 + ' + ' + c, '0'))}이 서로 다른 네 실근을 갖는다. 두 양의 실근을 ${A_}, ${Bt}라 할 때 ${nb(A_ + ' : ' + Bt + ' = 1 : ' + k)}이면 실수 ${vm}의 값은?`, Mv, {
          explain: `${nb(X2 + ' = ' + V('X'))}로 놓으면 ${nb(V('X') + sup(2) + ' ' + MINUS + ' ' + vm + V('X') + ' + ' + c + ' = 0')}의 두 양의 근이 ${A_ + sup(2)}, ${Bt + sup(2)}이다. 근과 계수의 관계에서 ${nb(A_ + sup(2) + Bt + sup(2) + ' = ' + c)}, ${nb(A_ + sup(2) + ' + ' + Bt + sup(2) + ' = ' + vm)}이다. ${nb(Bt + ' = ' + k + A_)}이므로 ${nb(k * k + A_ + sup(4) + ' = ' + c)}, ${nb(A_ + sup(2) + ' = ' + s)}이고 ${nb(vm + ' = ' + s + ' + ' + k * k * s + ' = ' + Mv)}이다.`,
          facts: { calc: [[`${c}/(${k}*${k}*${s})*(1+${k}*${k})`, 0]], unseen: [s].filter((v) => v > 1) }
        });
      }),
      H('hard-distinct', '② 삼차방정식의 서로 다른 근이 2개가 되는 조건(두 경우)', '①26', (d) => {
        // (x − r)(x² + bx + ck): (i) 이차식이 r 을 근으로 (ii) 이차식이 중근
        const r = d.until(() => d.int(-3, 3), (v) => v !== 0), b = d.until(() => d.int(-5, 5), (v) => v !== 0), c = d.pick([1, 2, 4, -1, -2]);
        const k1 = Q(-(r * r + b * r), c), k2 = Q(b * b, 4 * c), other = -b - r, dbl = Q(-b, 2);
        if (k1.p === 0 || k1.p * k2.q === k2.p * k1.q || other === r || (dbl.q === 1 && dbl.p === r)) return null;
        // 전개: x³ + (b − r)x² + (ck − br)x − rck
        const eq = eqH(X + sup(3) + termH(b - r, X2) + kCoef(c, -b * r, X) + kCoef(-r * c, 0, ''), '0');
        const kv = (q) => nb(vk + ' = ' + tx(q)), neg = (q) => Q(-q.p, q.q);
        const rows = [[`${kv(k1)} 또는 ${kv(k2)}`, true], [kv(k1), false], [kv(k2), false], [`${kv(k1)} 또는 ${kv(neg(k2))}`, false], [`${kv(neg(k1))} 또는 ${kv(k2)}`, false]];
        const qd = sumH([[1, X2], [b, X]]) + kCoef(c, 0, '');
        return choose(d, `삼차방정식 ${keep(eq)}의 서로 다른 근의 개수가 2가 되도록 하는 실수 ${vk}의 값을 모두 고른 것은?`, rows, {
          explain: `${nb(X + ' = ' + iq(r))}${tail(Math.abs(r), '을/를')} 대입하면 ${vk}에 관계없이 0이므로 좌변은 ${nb('(' + linH(r) + ')(' + qd + ')')}${endJ(qd, '으로/로')} 인수분해된다. 서로 다른 근이 2개가 되는 것은 두 경우이다. (i) ${nb(qd + ' = 0')}이 ${iq(r)}${tail(Math.abs(r), '을/를')} 근으로 가질 때: ${nb(vk + ' = ' + tx(k1))}이고, 이때 나머지 근은 ${iq(other)}이다. (ii) ${nb(qd + ' = 0')}이 중근을 가질 때: 판별식이 0이므로 ${nb(vk + ' = ' + tx(k2))}이고, 중근 ${tx(dbl)}${endJ(tx(dbl), '은/는')} ${iq(r)}${endJ(iq(r), '과/와')} 다르다. 한 경우만 따지면 답을 놓친다.`
        });
      }),
      H('hard-intmax', '② 한 실근과 두 허근을 갖는 정수 조건에서 α² + β²의 최댓값', '①27', (d) => {
        const v = d.int(1, 6), tmax = Math.ceil(2 * Math.sqrt(v)) - 1, best = tmax * tmax - 2 * v;
        const eq = eqH(X + sup(3) + ' ' + MINUS + ' ' + va + X2 + ' + (' + va + termH(v - 1, '') + ')' + X + termH(-v, ''), '0').replace('(' + va + ')', va);
        return N(`삼차방정식 ${keep(eq)}이 한 개의 실근과 두 개의 허근 ${A_}, ${Bt}를 가질 때, ${nb(A_ + sup(2) + ' + ' + Bt + sup(2))}의 최댓값은? (단, ${va}는 정수이다.)`, best, {
          signed: true,
          explain: `${nb(X + ' = 1')}을 대입하면 0이므로 좌변은 ${nb('(' + X + ' ' + MINUS + ' 1)(' + X2 + ' ' + MINUS + ' (' + va + ' ' + MINUS + ' 1)' + X + ' + ' + v + ')')}${tail(v, '으로/로')} 인수분해된다. 이차식이 허근을 가지려면 판별식 ${nb('(' + va + ' ' + MINUS + ' 1)' + sup(2) + ' ' + MINUS + ' ' + 4 * v + ' &lt; 0')}이어야 한다. ${nb(A_ + sup(2) + ' + ' + Bt + sup(2) + ' = (' + va + ' ' + MINUS + ' 1)' + sup(2) + ' ' + MINUS + ' ' + 2 * v)}이고, 정수 ${va}에 대하여 ${nb('(' + va + ' ' + MINUS + ' 1)' + sup(2))}의 가장 큰 값은 ${tmax * tmax}이므로 최댓값은 ${iq(best)}이다.`,
          facts: { calc: [[`${tmax}*${tmax}-2*${v}`, 0]], unseen: [tmax, 2].filter((x) => x > 1) }
        });
      }),
      H('hard-omega-prod', '② ω가 든 네 인수의 곱', '①32', (d) => {
        const c = d.pick([-2, -1, 2, 3]), res = d.shuffle([1, 2, 1, 2]), exps = [];
        for (const r of res) exps.push(3 * d.int(0, 3) + r);
        if (new Set(exps).size !== 4) return null;
        const v = (c * c - c + 1) ** 2;
        let prod = cx(1);
        for (const e of exps) prod = cmul(prod, cadd(cpow(OMEGA, e), cx(c)));
        if (!cnear(prod, cx(v))) return null;
        const h = exps.map((e) => '(' + wp(e) + termH(c, '') + ')').join('');
        return N(`방정식 ${nb(X + sup(3) + ' = 1')}의 한 허근을 ${W_}라 할 때, ${keep(h)}의 값은?`, v, {
          explain: `${nb(wp(3) + ' = 1')}이므로 각 인수는 ${nb('(' + W_ + termH(c, '') + ')')}${endJ(String(Math.abs(c)), '이/가')} 둘, ${nb('(' + wp(2) + termH(c, '') + ')')}${endJ(String(Math.abs(c)), '이/가')} 둘이다. ${nb('(' + W_ + termH(c, '') + ')(' + wp(2) + termH(c, '') + ') = ' + wp(3) + termH(c, '(' + W_ + ' + ' + wp(2) + ')') + termH(c * c, '') + ' = 1' + termH(-c, '') + termH(c * c, '') + ' = ' + (c * c - c + 1))}이므로(${nb(W_ + ' + ' + wp(2) + ' = ' + MINUS + '1')}) 주어진 식은 ${nb((c * c - c + 1) + sup(2) + ' = ' + v)}이다.`,
          facts: { calc: [[`((${c})*(${c})-(${c})+1)*((${c})*(${c})-(${c})+1)`, 0]] }
        });
      }),
      H('hard-cplx-root', '② 분수 꼴로 주어진 허근으로 나머지 두 근의 합 구하기', '①24', (d) => {
        const u = d.until(() => d.int(-3, 3), (v) => v !== 0), w = d.int(1, 3), r = d.until(() => d.int(-4, 4), (v) => v !== 0 && v !== -u), mm = u * u + w * w, c0 = -r * mm;
        const den = '(' + (u < 0 ? MINUS + -u : u) + ' + ' + (w === 1 ? '' : w) + I + ')';
        const sumRe = u + r;
        return inline(`계수가 실수인 삼차방정식 ${nb(eqH(X + sup(3) + ' + ' + V('p') + X2 + ' + ' + V('q') + X + termH(c0, ''), '0'))}의 한 근이 ${nb(frac(mm, den.slice(1, -1)))}일 때, 나머지 두 근의 합을 ${nb(V('a') + ' + ' + V('b') + I)} 꼴로 나타내시오. (단, ${V('a')}, ${V('b')}는 실수이다.)`,
          '{0} {1}' + I, [{ answer: sumRe, signed: true }, { answer: w, signed: true }], {
            shown: nb(iq(sumRe) + ' + ' + (w === 1 ? '' : w) + I),
            explain: `${nb(frac(mm, den.slice(1, -1)) + ' = ' + frac(mm + '(' + iq(u) + ' ' + MINUS + ' ' + (w === 1 ? '' : w) + I + ')', mm) + ' = ' + iq(u) + ' ' + MINUS + ' ' + (w === 1 ? '' : w) + I)}이다. 계수가 실수이므로 켤레복소수 ${nb(iq(u) + ' + ' + (w === 1 ? '' : w) + I)}도 근이고, 두 허근의 합은 ${iq(2 * u)}, 곱은 ${mm}이므로 좌변은 ${nb(sumH([[1, X2], [-2 * u, X], [mm, '']]))}${tail(mm, '으로/로')} 나누어떨어진다. 나머지 근을 ${vk}라 하면 상수항에서 ${nb(MINUS + mm + vk + ' = ' + iq(c0))}, ${nb(vk + ' = ' + iq(r))}이다. 따라서 나머지 두 근의 합은 ${nb(iq(u) + ' + ' + (w === 1 ? '' : w) + I + (r < 0 ? ' + (' + iq(r) + ')' : ' + ' + r) + ' = ' + iq(sumRe) + ' + ' + (w === 1 ? '' : w) + I)}이다.`,
            facts: { calc: [[`(${u})+(${c0})/(0-${mm})`, 0], [`((${mm})-(${u})*(${u}))/${w}`, 1]], unseen: [Math.abs(u), w].filter((v) => v > 1) }
          });
      }),
      H('hard-x0', '① x로 나누면 잃는 해 — 실수인 해의 개수', '②10', (d) => {
        // kxy = x² = y² + by + e
        const k = d.pick([2, 3]), b = d.int(-3, 3), e = d.int(-3, 3);
        const D1 = b * b - 4 * e, n1 = D1 > 0 ? 2 : D1 === 0 ? 1 : 0;           // x = 0 갈래: y² + by + e = 0
        const a2 = k * k - 1, D2 = b * b + 4 * a2 * e, n2 = D2 > 0 ? 2 : D2 === 0 ? 1 : 0;   // x = ky 갈래: (k² − 1)y² − by − e = 0
        const both = e === 0 ? 1 : 0, count = n1 + n2 - both;
        if (count < 2 || n1 === 0) return null;
        const opts = [1, 2, 3, 4, 5];
        const eq = nb((k === 1 ? '' : k) + XY + ' = ' + X2 + ' = ' + sumH([[1, Y2], [b, Y], [e, '']]));
        return C(`연립방정식 ${eq}${endJ(e !== 0 ? String(Math.abs(e)) : b !== 0 ? Y : sup(2), '을/를')} 만족시키는 실수 ${X}, ${Y}의 순서쌍 ${nb('(' + X + ', ' + Y + ')')}의 개수는?`, opts.map(String), opts.indexOf(count), {
          explain: `${nb(eqH((k === 1 ? '' : k) + XY, X2))}에서 ${nb(X + '(' + X + ' ' + MINUS + ' ' + k + Y + ') = 0')}이므로 ${nb(X + ' = 0')} 또는 ${nb(X + ' = ' + k + Y)}이다(양변을 ${X}로 나누면 ${nb(X + ' = 0')}인 해를 잃는다). ${nb(X + ' = 0')}이면 ${nb(sumH([[1, Y2], [b, Y], [e, '']]) + ' = 0')}에서 실수 ${Y}가 ${n1}개, ${nb(X + ' = ' + k + Y)}이면 ${nb(sumH([[a2, Y2], [-b, Y], [-e, '']]) + ' = 0')}에서 실수 ${Y}가 ${n2}개이다.${both ? ` 두 갈래 모두 ${nb('(0, 0)')}을 주므로 한 번만 센다.` : ''} 따라서 ${count}개이다.`,
          facts: { pick: { expr: both ? `${n1}+${n2}-1` : `${n1}+${n2}`, options: opts }, unseen: [n1, n2].filter((v) => v > 1) }
        });
      }),
      H('hard-nosol', '② 대칭식으로 바꾸어 실수인 해가 없을 조건 구하기', '②15', (d) => {
        const a = d.int(1, 3), b = d.int(1, 4), c = d.int(-5, 6), count = 4 * a * (a + b) - 1;
        const r1 = eqH(a + '(' + X + ' + ' + Y + ') + ' + XY, '0'), r2 = eqH(b + '(' + X + ' + ' + Y + ') ' + MINUS + ' ' + XY, vk + termH(-c, ''));
        return N(`${X}, ${Y}에 대한 연립방정식 ${sysQ([r1.replace(/^1\(/, '('), r2.replace(/^1\(/, '(')])}을 만족시키는 실수 ${X}, ${Y}가 존재하지 않도록 하는 정수 ${vk}의 개수는?`, count, {
          explain: `${nb(X + ' + ' + Y + ' = ' + V('u'))}, ${nb(XY + ' = ' + V('v'))}로 놓으면 ${nb(a + V('u') + ' + ' + V('v') + ' = 0')}, ${nb(b + V('u') + ' ' + MINUS + ' ' + V('v') + ' = ' + vk + termH(-c, ''))}에서 ${nb(V('u') + ' = ' + frac(vk + termH(-c, ''), a + b))}, ${nb(V('v') + ' = ' + MINUS + a + V('u'))}이다. ${X}, ${Y}는 ${nb(V('t') + sup(2) + ' ' + MINUS + ' ' + V('u') + V('t') + ' + ' + V('v') + ' = 0')}의 두 근이므로 실수가 아니려면 판별식 ${nb(V('u') + sup(2) + ' + ' + 4 * a + V('u') + ' &lt; 0')}, 곧 ${nb(MINUS + 4 * a + ' &lt; ' + V('u') + ' &lt; 0')}이다. 따라서 ${nb(MINUS + 4 * a * (a + b) + ' &lt; ' + vk + termH(-c, '') + ' &lt; 0')}이고 정수 ${vk}는 ${count}개이다.`,
          facts: { calc: [[`4*${a}*(${a}+${b})-1`, 0]], unseen: [4] }
        });
      }),
      H('hard-peri', '② 둘레와 넓이가 주어진 직각삼각형의 빗변', '②18', (d) => {
        const [a, b, c] = d.pick(TRIPLES), k = d.pick([1, 2]), P = (a + b + c) * k, S = a * b * k * k / 2;
        if (P > 120) return null;
        return N(`둘레의 길이가 ${P}이고 넓이가 ${S}인 직각삼각형의 빗변의 길이는?`, c * k, {
          explain: `직각을 낀 두 변을 ${X}, ${Y}, 빗변을 ${V('z')}라 하면 ${nb(X + ' + ' + Y + ' = ' + P + ' ' + MINUS + ' ' + V('z'))}, ${nb(XY + ' = ' + 2 * S)}, ${nb(X2 + ' + ' + Y2 + ' = ' + V('z') + sup(2))}이다. ${nb('(' + X + ' + ' + Y + ')' + sup(2) + ' = ' + X2 + ' + ' + Y2 + ' + 2' + XY)}에서 ${nb('(' + P + ' ' + MINUS + ' ' + V('z') + ')' + sup(2) + ' = ' + V('z') + sup(2) + ' + ' + 4 * S)}, 곧 ${nb(2 * P + V('z') + ' = ' + (P * P - 4 * S))}이므로 빗변의 길이는 ${c * k}이다.`,
          facts: { calc: [[`(${P}*${P}-4*${S})/(2*${P})`, 0]], unseen: [4, 2] }
        });
      }),
      H('hard-semi', '② 반원에 내접하는 직사각형의 둘레와 넓이로 반지름 구하기', '②23', (d) => {
        const opts = [];
        for (let a = 2; a <= 6; a += 1) for (let b = 2; b < 2 * a; b += 1) if (sqfree(a * a + b * b) && b !== 2 * a) opts.push([a, b]);
        const [a, b] = d.pick(opts), P = 2 * (2 * a + b), S = 2 * a * b, n = a * a + b * b;
        // 그림: 반지름 R, 직사각형 B(−a, 0) C(a, 0) D(a, b) A(−a, b)
        const R = Math.sqrt(n), s = 110 / R, O = [140, 130], p = (x, y) => [O[0] + x * s, O[1] - y * s];
        const brd = Board();
        brd.arc(O, R * s, 0, 180).seg(p(-R, 0), p(R, 0));
        brd.poly([p(-a, 0), p(a, 0), p(a, b), p(-a, b)]);
        brd.dot(O).name(O, 'O', 270, 12).name(p(-a, 0), 'B', 250, 12).name(p(a, 0), 'C', 290, 12).name(p(a, b), 'D', 45, 12).name(p(-a, b), 'A', 135, 12);
        const fig = brd.svg('점 O를 중심으로 하는 반원과 그 안의 직사각형 ABCD: 변 BC는 반원의 지름 위에 있고 점 O는 BC의 가운데이다. 두 꼭짓점 A, D는 반원의 호 위에 있다.');
        return radAns(`그림과 같이 점 O를 중심으로 하는 반원에 직사각형 ABCD가 내접한다. 직사각형 ABCD의 둘레의 길이가 ${P}이고 넓이가 ${S}일 때, 반원의 반지름의 길이는? (단, ${nb(SG('BC') + ' &gt; ' + SG('AB'))})`, 1, n, {
          figure: fig,
          explain: `${nb(SG('OC') + ' = ' + va)}, ${nb(SG('CD') + ' = ' + vb)}라 하면 ${nb('2(2' + va + ' + ' + vb + ') = ' + P)}, ${nb('2' + va + vb + ' = ' + S)}이다. ${nb(vb + ' = ' + (2 * a + b) + ' ' + MINUS + ' 2' + va)}${endJ(va, '을/를')} 대입하면 ${nb('2' + va + sup(2) + ' ' + MINUS + ' ' + (2 * a + b) + va + ' + ' + a * b + ' = 0')}이므로 ${nb(va + ' = ' + a)} 또는 ${nb(va + ' = ' + tx(Q(b, 2)))}이다. ${nb(SG('BC') + ' = 2' + va + ' &gt; ' + SG('AB') + ' = ' + vb)}인 것은 ${nb(va + ' = ' + a + ', ' + vb + ' = ' + b)}이므로 반지름의 길이는 ${nb(SG('OD') + ' = ' + rt(a + sup(2) + ' + ' + b + sup(2)) + ' = ' + rt(n))}이다.`,
          facts: { calc: [[`${a}*${a}+${b}*${b}`, 0]], unseen: [a, b].filter((v) => v > 1) }
        });
      }),
      H('hard-s1', '① 세 근 가운데 실수가 하나뿐인 조건 따지기', '심1', (d) => {
        const m = d.pick([1, 2, 3, -1, -2]), c = d.until(() => d.int(-4, 4), (v) => v !== 0 && v * m < 0 && Math.abs(v * m) <= 9), k = c * m, v = m * m + k;
        const eq = eqH(X + sup(3) + termH(-m, X2) + ' ' + MINUS + ' ' + vk + X + (m > 0 ? ' + ' : ' ' + MINUS + ' ') + (Math.abs(m) === 1 ? '' : Math.abs(m)) + vk, '0');
        return N(`삼차방정식 ${nb(eq)}의 세 근을 ${A_}, ${Bt}, ${G_}라 하자. ${A_}, ${Bt} 가운데 실수는 하나뿐이고 ${nb(A_ + sup(2) + ' = ' + (c === 1 ? '' : c === -1 ? MINUS : sT(c)) + Bt)}일 때, ${nb(Bt + sup(2) + ' + ' + G_ + sup(2))}의 값은? (단, ${vk}는 0이 아닌 실수이다.)`, v, {
          signed: true,
          explain: `좌변을 인수분해하면 ${nb('(' + linH(m) + ')(' + X2 + ' ' + MINUS + ' ' + vk + ') = 0')}이므로 근은 ${iq(m)}${endJ(iq(m), '과/와')} ${nb(X2 + ' = ' + vk)}의 두 근이다. ${nb(vk + ' &gt; 0')}이면 세 근이 모두 실수이므로 ${nb(vk + ' &lt; 0')}이고, 실근은 ${iq(m)}뿐이다. ${nb(A_ + ' = ' + iq(m))}이면 ${nb(Bt + ' = ' + tx(Q(m * m, c)))}도 실수가 되어 맞지 않으므로 ${nb(Bt + ' = ' + iq(m))}, ${nb(A_ + sup(2) + ' = ' + iq(k))}이다. ${A_}, ${G_}는 ${nb(X2 + ' = ' + vk)}의 근이므로 ${nb(vk + ' = ' + iq(k))}, ${nb(G_ + sup(2) + ' = ' + iq(k))}이다. 따라서 ${nb(Bt + sup(2) + ' + ' + G_ + sup(2) + ' = ' + iq(m * m) + termH(k, '') + ' = ' + iq(v))}이다.`,
          facts: { calc: [[`(${m})*(${m})+(${c})*(${m})`, 0]], unseen: [Math.abs(m)].filter((x) => x > 1) }
        });
      }),
      H('hard-s2', '② 네 일차식으로 다시 짝지어 허근으로 만든 식의 값 구하기', '심2', (d) => {
        const r1 = d.int(-2, 2), gap = d.int(1, 2), r2 = r1 + gap, r3 = r2 + d.int(1, 2), r4 = r2 + r3 - r1;
        const S = r1 + r4;
        if (r2 + r3 !== S || new Set([r1, r2, r3, r4]).size !== 4) return null;
        const Y1 = d.int(-2, 8), Y2 = -(r1 * r4 + r2 * r3) - Y1, K = (Y1 + r1 * r4) * (Y1 + r2 * r3);
        if (S * S + 4 * Y1 < 0 || S * S + 4 * Y2 >= 0 || K <= 0 || K > 400 || S === 0) return null;
        const q1 = fromRoots([r1, r3]), q2 = fromRoots([r2, r4]), xf = (v) => (v === 0 ? V('X') : '(' + V('X') + termH(v, '') + ')');
        return N(`방정식 ${nb(eqH('(' + polyH(q1) + ')(' + polyH(q2) + ')', String(K)))}의 한 허근을 ${W_}라 할 때, ${nb(wp(2) + termH(-S, W_))}의 값은?`, Y2, {
          signed: true,
          explain: `좌변은 ${nb(facH([r1, r3]) + facH([r2, r4]))}이다. 더하는 수의 합이 같게 ${nb(facH([r1, r4]) + ' = ' + polyH(fromRoots([r1, r4])))}, ${nb(facH([r2, r3]) + ' = ' + polyH(fromRoots([r2, r3])))}${endJ(polyH(fromRoots([r2, r3])), '으로/로')} 다시 짝지은 뒤 ${nb(sumH([[1, X2], [-S, X]]) + ' = ' + V('X'))}로 놓으면 ${nb(xf(r1 * r4) + xf(r2 * r3) + ' = ' + K)}, 곧 ${nb(facH([Y1, Y2], 'X') + ' = 0')}이다. ${nb(sumH([[1, X2], [-S, X]]) + ' = ' + iq(Y1))}${endJ(iq(Y1), '은/는')} 판별식이 0 이상이라 실근을 주므로 허근 ${W_}는 ${nb(sumH([[1, X2], [-S, X]]) + ' = ' + iq(Y2))}의 근이다. 따라서 ${nb(wp(2) + termH(-S, W_) + ' = ' + iq(Y2))}이다.`,
          facts: { calc: [[`0-(${r1 * r4})-(${r2 * r3})-(${Y1})`, 0]], unseen: [Math.abs(r1 * r4), Math.abs(r2 * r3), Math.abs(Y1)].filter((x) => x > 1) }
        });
      }),
      H('hard-s3', '② 닮음으로 세우는 연립이차방정식(삼각형의 둘레)', '심3', (d) => {
        const opts = [];
        for (let q = 3; q <= 10; q += 1) for (let y = q + 1; y <= 20; y += 1) for (let p = 2; p <= 12; p += 1) {
          if ((y * y) % q !== 0 || (p * y) % q !== 0) continue;
          const BC = y * y / q, x = BC - q, AC = p * y / q, t = x - AC;
          if (x <= 0 || t < 1 || t > 5 || y + AC <= BC || y + BC <= AC || AC + BC <= y || y >= p + q || p >= y + q || BC > 30) continue;
          opts.push([p, q, y, BC, x, AC, t]);
        }
        const [p, q, y, BC, x, AC, t] = d.pick(opts), per = y + BC + AC;
        // 그림: B(0, 0), C(BC, 0), A 는 AB = y, AC 로
        const ax = (y * y - AC * AC + BC * BC) / (2 * BC), ay = Math.sqrt(y * y - ax * ax), s = 240 / BC;
        const P = (u, v) => [20 + u * s, 20 + (ay - v) * s], A = P(ax, ay), Bp = P(0, 0), Cp = P(BC, 0), Dp = P(q, 0);
        const brd = Board();
        brd.poly([A, Bp, Cp]).seg(A, Dp);
        brd.corner(A, Bp, Dp, '', { r: 16 }).corner(Cp, Bp, A, '', { r: 16 });
        brd.name(A, 'A', 90, 11).name(Bp, 'B', 210, 11).name(Cp, 'C', 330, 11).name(Dp, 'D', 270, 12);
        brd.beside(A, Dp, String(p), Bp).beside(Bp, Dp, String(q), A);
        const fig = brd.svg(`삼각형 ABC와 변 BC 위의 점 D. 선분 AD의 길이는 ${p}, 선분 BD의 길이는 ${q}이고, 각 BAD와 각 BCA에 같은 각의 표시가 있다.`);
        return N(`그림과 같이 삼각형 ABC의 변 BC 위의 점 D에 대하여 ${nb(SG('AD') + ' = ' + p)}, ${nb(SG('BD') + ' = ' + q)}이고 ${nb('∠BAD = ∠BCA')}이다. ${nb(SG('AC') + ' = ' + SG('CD') + ' ' + MINUS + ' ' + t)}일 때, 삼각형 ABC의 둘레의 길이는?`, per, {
          figure: fig,
          explain: `두 삼각형 ABC와 DBA에서 ∠B는 공통이고 ${nb('∠BCA = ∠BAD')}이므로 서로 닮음이다. ${nb(SG('CD') + ' = ' + X)}, ${nb(SG('AB') + ' = ' + Y)}라 하면 ${nb(SG('AB') + ' : ' + SG('AC') + ' = ' + SG('DB') + ' : ' + SG('DA'))}에서 ${nb(Y + ' : (' + X + ' ' + MINUS + ' ' + t + ') = ' + q + ' : ' + p)}, ${nb(SG('AB') + ' : ' + SG('BC') + ' = ' + SG('DB') + ' : ' + SG('BA'))}에서 ${nb(Y2 + ' = ' + q + '(' + q + ' + ' + X + ')')}이다. 두 식을 연립하면 ${nb(Y2 + ' ' + MINUS + ' ' + p + Y + ' ' + MINUS + ' ' + q * (q + t) + ' = 0')}에서 ${nb(Y + ' = ' + y)}, ${nb(X + ' = ' + x)}이다. 따라서 둘레의 길이는 ${y} + ${BC} + ${AC} = ${per}이다.`,
          facts: { calc: [[`${y}+${y}*${y}/${q}+${p}*${y}/${q}`, 0]], unseen: [y] }
        });
      }),
      H('hard-s4', '① 유리수 조건으로 가르는 연립방정식(구멍 뚫린 정육면체의 겉넓이)', '심4', (d) => {
        const a = d.int(4, 10), b = d.int(1, Math.floor((a - 1) / 2)), S = 6 * a * a, Tt = 2 * b * (a - b);
        // 그림: 정육면체(비스듬한 그림)와 윗면의 원
        const e = 120, o = 45, x0 = 20, y0 = 20 + o * 0.6, r1 = (v) => Math.round(v * 10) / 10;
        const fr = [[x0, y0], [x0 + e, y0], [x0 + e, y0 + e], [x0, y0 + e]], bk = fr.map(([u, w]) => [u + o, w - o * 0.6]);
        const rr = e * b / a / 1.0, cxp = x0 + e / 2 + o / 2, cyp = y0 - o * 0.3;
        let out = `<path d="M${fr.map((pt) => pt.map(r1).join(' ')).join('L')}Z" style="fill:#fef3c7;stroke:#1f2933;stroke-width:1.5"/>`;
        out += `<path d="M${r1(fr[0][0])} ${r1(fr[0][1])}L${r1(bk[0][0])} ${r1(bk[0][1])}L${r1(bk[1][0])} ${r1(bk[1][1])}L${r1(fr[1][0])} ${r1(fr[1][1])}Z" style="fill:#fde68a;stroke:#1f2933;stroke-width:1.5"/>`;
        out += `<path d="M${r1(fr[1][0])} ${r1(fr[1][1])}L${r1(bk[1][0])} ${r1(bk[1][1])}L${r1(bk[2][0])} ${r1(bk[2][1])}L${r1(fr[2][0])} ${r1(fr[2][1])}Z" style="fill:#fcd34d;stroke:#1f2933;stroke-width:1.5"/>`;
        out += `<ellipse cx="${r1(cxp)}" cy="${r1(cyp)}" rx="${r1(rr)}" ry="${r1(rr * 0.42)}" style="fill:#fff;stroke:#1f2933;stroke-width:1.3"/>`;
        out += `<line x1="${r1(cxp)}" y1="${r1(cyp)}" x2="${r1(cxp + rr)}" y2="${r1(cyp)}" style="stroke:#1d4ed8;stroke-width:1.2"/><text x="${r1(cxp + rr / 2)}" y="${r1(cyp - 4)}" text-anchor="middle" style="font-size:13px;font-style:italic;font-family:'MB Math','Times New Roman',serif;fill:#1d4ed8">b</text>`;
        out += `<text x="${r1(x0 + e / 2)}" y="${r1(y0 + e + 16)}" text-anchor="middle" style="font-size:13px;font-style:italic;font-family:'MB Math','Times New Roman',serif">a</text>`;
        const W = r1(x0 + e + o + 16), Hh = r1(y0 + e + 24);
        const fig = `<svg class="mb-geo" viewBox="0 0 ${W} ${Hh}" width="${Math.round(W)}" role="img" aria-label="한 모서리의 길이가 a인 정육면체의 윗면 가운데에 반지름의 길이가 b인 원 모양의 구멍이 있고, 이 구멍이 아랫면까지 곧게 뚫려 있다.">${out}</svg>`;
        return valsQ(`그림과 같이 한 모서리의 길이가 ${va}인 정육면체 모양의 나무토막에 밑면의 반지름의 길이가 ${vb}이고 높이가 ${va}인 원기둥 모양의 구멍을 윗면에서 아랫면까지 뚫었다. 남은 입체도형의 겉넓이가 ${nb(S + ' + ' + Tt + 'π')}일 때, 두 유리수 ${va}, ${vb}의 값을 구하시오. (단, ${nb(va + ' &gt; 2' + vb)})`, [[va, a, false], [vb, b, false]], {
          figure: fig,
          explain: `남은 입체도형의 겉넓이는 ${nb('6' + va + sup(2) + ' ' + MINUS + ' 2π' + vb + sup(2) + ' + 2π' + va + vb)}(위아래의 원을 빼고 구멍의 옆넓이를 더한다)이므로 ${nb('6' + va + sup(2) + ' + 2(' + va + vb + ' ' + MINUS + ' ' + vb + sup(2) + ')π = ' + S + ' + ' + Tt + 'π')}이다. ${va}, ${vb}가 유리수이고 π는 무리수이므로 ${nb('6' + va + sup(2) + ' = ' + S)}, ${nb(va + vb + ' ' + MINUS + ' ' + vb + sup(2) + ' = ' + Tt / 2)}이다. ${nb(va + ' = ' + a)}이고 ${nb(vb + sup(2) + ' ' + MINUS + ' ' + a + vb + ' + ' + Tt / 2 + ' = 0')}에서 ${nb(vb + ' = ' + b)} 또는 ${nb(vb + ' = ' + (a - b))}인데 ${nb(va + ' &gt; 2' + vb)}이므로 ${nb(vb + ' = ' + b)}이다.`,
          facts: { calc: [[`${S}/6/${a}`, 0], [`${Tt}/2/(${a}-${b})`, 1]], unseen: [6, a, b].filter((v) => v > 1) }
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
