// 고등학교 1학년 2학기 1단원 평면좌표와 직선의 방정식 — 실력 문항.
// 단원 틀과 도구, 싣는 기준, 뺀 것과 까닭은 10-2-1a.js 에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 ①의 장치는 이 잘못을 가진 아이가 걸리게 만들었다)
//  - 「AP = k × BP 인 점」을 선분 AB 위에서만 찾는다(절댓값을 풀면 선분 밖의 점도 답이다).
//  - 한 점을 지나는 직선을 y − y₁ = m(x − x₁)로만 놓아, y축에 평행한 직선 x = x₁ 을 빠뜨린다.
//  - 실수 k 에 관계없이 지나는 점을 지나는 직선과 한 점 사이의 거리에 「최댓값이 없다」고 여기거나, 식을 k 에 대한 분수식으로만 다룬다(두 점 사이의 거리가 최댓값이다).
//  - 평행한 두 직선 위의 두 점 사이의 거리가 가장 짧을 때가 두 직선 사이의 거리임을 놓친다.
//  - 각의 이등분선 위의 점은 두 변까지의 거리가 같다는 것(그래서 넓이의 비가 변의 길이의 비가 된다)을 놓친다.
//
// 실력에는 ① 문제의 상황에 함정이 있어 배운 뜻을 정확히 대야 풀리는 문제와 ② 세 단계 넘게 이어 생각해야 풀리는 문제만 실었다.
// 수집본 기본 문서 세 개 이상에 나오는 꼴(정점을 지나는 직선과 선분·삼각형의 범위 ②10, 두 직선이 이루는 각의 이등분선 ②38, 거리가 주어진 직선 ②39)은 단계가 많아도 기본에 두었다.
// 대단원 기출 모의고사(심화)의 꼴 가운데 기본 문항과 같은 일(심1·2·4·5)은 기본에서 묻고, 근과 계수의 관계로 무게중심을 구하는 심3과 수직 조건·대칭인 점으로 직선을 구하는 심7을 실력에 실었다.
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」 문자는 맨 「수 a」로 부르지 않는다: 값을 물으면 「상수 a」, 범위·최댓값·최솟값을 물으면 「실수 a」.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, N, M, C, F, inline } = B.kit;
  const { MINUS, gcd, Q, qadd, qsub, qmul, qdiv, qneg, qabs, qcmp, fl, tx, nb, tail, lastOf, js, V, sup, nz, pm, asQ, poly, pointAns, ansV, rt, grp, sqParts, radText, SG } = B.kit.mid;
  const { Board } = B.kit.mgeo;
  const K = B.kit.m1021, KB = B.kit.m1021b;
  const { STD1, STD2, STD3, H, X, Y, VA, VB, VK, VM, VT, iq, jn, par, nj, cv, jw, fr, pt, ptj, P, Pj, P1, P1j, ratio, ratioj, genH, slopeH, slopej, isSq, lenH, sqForm, sq, df, lineAns, radLen, vals, pick, sameLen, inBox, add, sub, mul, d2, PYTH } = K;
  const { norm, through, lh, onL, slopeQ, famH, famOf, lineThrough, meetX, meetY, PY } = KB;
  const VC2 = V('c');
  // 점 이름표를 둘 방향: 점 p 둘레 여러 방향 가운데 그은 선분들에서 가장 멀리 떨어진 쪽(화면 좌표, 각은 시계 반대쪽 도)
  const segDist = (P0, u, v) => { const dx = v[0] - u[0], dy = v[1] - u[1], t = Math.max(0, Math.min(1, ((P0[0] - u[0]) * dx + (P0[1] - u[1]) * dy) / (dx * dx + dy * dy))); return Math.hypot(P0[0] - u[0] - t * dx, P0[1] - u[1] - t * dy); };
  const freeAngle = (p, segs, gap) => { let best = 0, score = -1; for (let a = 0; a < 360; a += 15) { const q = [p[0] + gap * Math.cos(a * Math.PI / 180), p[1] - gap * Math.sin(a * Math.PI / 180)], sc = Math.min(...segs.map(([u, v]) => segDist(q, u, v))); if (sc > score + 1e-9) { score = sc; best = a; } } return best; };
  // 사람 이름 뒤 「는」: 받침이 있으면 「이는」(서연이는, 지우는)
  const ij = (nm) => nm + ((nm.charCodeAt(nm.length - 1) - 0xAC00) % 28 ? '이는' : '는');

  B.addGroup('10-2-1', {
    id: 'hard', title: '단원 종합', standard: STD1,
    types: [
      // ── ① 상황에 함정이 있어 뜻을 정확히 대야 풀리는 문제 ──
      H('hard-ratio-outside', '수직선 위에서 거리의 비가 주어진 점', '①8', (d) => {
        // 함정: P를 선분 AB 위에서만 찾아 안쪽 점(내분점)만 구하는 아이는 가장 큰(작은) 값으로 그 점을 적는다. 답은 선분 밖의 점이다.
        const k = d.int(2, 4), a = d.int(-8, 6), b = a + nz(d, -6, 6), xin = (k * b + a) / (k + 1), xout = (k * b - a) / (k - 1);
        if (!Number.isInteger(xin) || !Number.isInteger(xout) || Math.abs(xout) > 30) return null;
        const big = b > a;
        return N(`수직선 위의 세 점 ${P1('A', a)}, ${P1('B', b)}, ${P1('P', X)}에 대하여 ${nb(`${SG('AP')} = ${k}${SG('BP')}`)}를 만족시키는 ${X}의 값 가운데 가장 ${big ? '큰' : '작은'} 것은?`, xout, {
          signed: true,
          explain: `${nb(`|${poly([[1, X], [-a, '']])}| = ${k}|${poly([[1, X], [-b, '']])}|`)}에서 ${nb(`${poly([[1, X], [-a, '']])} = ${k}(${poly([[1, X], [-b, '']])})`)} 또는 ${nb(`${poly([[1, X], [-a, '']])} = ${MINUS}${k}(${poly([[1, X], [-b, '']])})`)}이다. 앞의 식에서 ${X} = ${iq(xout)}(선분 AB 밖의 점), 뒤의 식에서 ${X} = ${iq(xin)}(선분 AB 위의 점)이므로 가장 ${big ? '큰' : '작은'} 것은 ${iq(xout)}이다.`,
          facts: { calc: [[`(${k}*${jn(b)}-${jn(a)})/(${k}-1)`, 0]] }
        });
      }),
      H('hard-dist-through-point', '한 점을 지나고 다른 점에서의 거리가 주어진 직선', '②40', (d) => {
        // 함정: 기울기를 m 으로 놓으면 y축에 평행한 직선 x = x₀ 이 빠진다. 그 직선만 있는 보기, 기울기 하나만 있는 보기, 부호를 바꾼 기울기를 섞은 보기를 둔다.
        const Pp = [d.int(-4, 4), d.int(-4, 4)], dx = nz(d, -4, 4), dy = nz(d, -4, 4), Qp = [Pp[0] + dx, Pp[1] + dy], D = Math.abs(dx), m = Q(dy * dy - dx * dx, 2 * dx * dy);
        if (m.p === 0 || m.q > 6 || Math.abs(m.p) > 9 || !inBox([Qp])) return null;
        const Lv = norm(1, 0, -Pp[0]), Lm = norm(m.p, -m.q, -(m.p * Pp[0] - m.q * Pp[1])), Lw = norm(-m.p, -m.q, -(-m.p * Pp[0] - m.q * Pp[1])), Lh = norm(0, 1, -Pp[1]);
        const dist = (l) => Q(Math.abs(l.a * Qp[0] + l.b * Qp[1] + l.c) ** 2, l.a * l.a + l.b * l.b), ok = (l) => onL(l, Pp) && qcmp(dist(l), Q(D * D)) === 0;
        const sets = [[Lv, Lm], [Lm], [Lv], [Lm, Lw], [Lh, Lm]].filter((s) => !s.some((l, i) => s.some((l2, j) => j > i && l.a === l2.a && l.b === l2.b && l.c === l2.c)));
        const right = (s) => s.length === 2 && s.every(ok);
        return pick(d, `점 ${ptj(Pp[0], Pp[1], '을/를')} 지나고 점 ${pt(Qp[0], Qp[1])}에서의 거리가 ${nj(D, '인/인')} 직선을 모두 고른 것은?`, sets.map((s) => [s.map(lh).join(', '), right(s)]), {
          explain: `기울기를 ${VM}이라 하면 ${nb(`${Pp[1] === 0 ? Y : `${Y} ${MINUS} ${par(Pp[1])}`} = ${VM}${Pp[0] === 0 ? X : `(${poly([[1, X], [-Pp[0], '']])})`}`)}이고, 점 ${pt(Qp[0], Qp[1])}에서의 거리가 ${D}인 조건을 제곱하여 정리하면 ${VM}에 대한 일차방정식이 되어 ${VM} = ${iq(m)} 하나만 나온다. 기울기로 나타낼 수 없는 직선 ${lh(Lv)}도 점 ${ptj(Pp[0], Pp[1], '을/를')} 지나고 점 ${pt(Qp[0], Qp[1])}에서의 거리가 ${iq(D)}이므로 답은 ${lh(Lm)}, ${lh(Lv)}이다.`
        });
      }),
      H('hard-max-dist-family', '실수에 관계없이 지나는 점을 지나는 직선과 한 점 사이의 거리의 최댓값', '②41', (d, n) => {
        // 함정: 거리를 k 의 분수식으로만 다루면 막힌다. 직선은 늘 한 점 F 를 지나므로 거리는 PF 를 넘지 못하고, PF 에 수직인 직선이 이 식에 들어 있으면 최댓값은 PF 이다.
        const Fp = [d.int(-4, 4), d.int(-4, 4)], [vx0, vy0, L] = d.pick([[0, 4, 4], [0, 5, 5], [3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13]]), v = [vx0 * pm(d), vy0 * pm(d)], Pp = add(Fp, d.bool() ? v : [v[1], v[0]]), w = sub(Pp, Fp);
        if (!inBox([Pp], 14)) return null;
        let fam, which;
        if (n === 0) {
          // a(x − x0) + (y − y0) = 0: x = x0 인 직선만 빠진다. PF 에 수직인 직선이 y축에 평행하면 안 된다.
          if (w[1] === 0) return null;
          fam = famH([[0, 1, X], [1, 0, Y], [-Fp[1], -Fp[0], '']], VA);
          which = `${VA} = ${iq(Q(w[0], w[1]))}`;
        } else {
          const l1 = lineThrough(d, Fp, (l) => l.a * w[0] + l.b * w[1] !== 0 && l.a !== 0 && l.b !== 0), l2 = lineThrough(d, Fp, (l) => l.a !== 0 && l.b !== 0 && l.a * l1.b !== l.b * l1.a);
          // L2 + k L1 = 0: L1 만 빠진다. L1 이 PF 에 수직이 아니므로 PF 에 수직인 직선이 들어 있다.
          fam = famOf(l2, l1);
          const pa = w[0], pb = w[1], kk = Q(-(l2.a * pb - l2.b * pa), l1.a * pb - l1.b * pa);
          which = `${VK} = ${iq(kk)}`;
        }
        return N(`점 ${jw(pt(Pp[0], Pp[1]), '과/와')} 직선 ${fam} 사이의 거리의 최댓값은? (단, ${n === 0 ? VA : VK}는 실수이다.)`, L, {
          explain: `주어진 직선은 ${n === 0 ? VA : VK}의 값에 관계없이 점 ${jw(`F${pt(Fp[0], Fp[1])}`, '을/를')} 지난다. 점 ${jw(`P${pt(Pp[0], Pp[1])}`, '과/와')} F를 지나는 직선 사이의 거리는 ${nb(`${SG('PF')} = ${L}`)}보다 클 수 없고, 직선이 선분 PF에 수직일 때(${which}) ${nj(L, '이/가')} 된다. 따라서 최댓값은 ${L}이다.`,
          facts: { calc: [[`(${df(Pp[0], Fp[0])}*${df(Pp[0], Fp[0])}+${df(Pp[1], Fp[1])}*${df(Pp[1], Fp[1])})/${L}`, 0]], derived: [Fp[0], Fp[1], L] }
        });
      }, { count: 2 }),
      H('hard-equi-min', '평행한 두 직선 위의 두 점을 잇는 선분과 정삼각형의 넓이의 최솟값', '②48', (d) => {
        // 함정: 두 점을 마음대로 고를 수 있으므로 넓이가 가장 작을 때는 선분이 가장 짧을 때, 곧 두 직선 사이의 거리일 때이다.
        const m = pm(d) * d.int(1, 3), S = m * m + 1, j = d.int(1, 2), c1 = d.int(-6, 6), c2 = c1 - pm(d) * 2 * S * j, coef = S * j * j;
        if (Math.abs(c2) > 30 || coef < 2) return null;
        return radLen(`직선 ${slopeH(m, c1)} 위의 점 A와 직선 ${slopeH(m, c2)} 위의 점 B에 대하여 선분 AB를 한 변으로 하는 정삼각형의 넓이의 최솟값은?`, coef, 3, {
          explain: `두 직선은 평행하므로 선분 AB의 길이가 가장 짧을 때는 두 직선 사이의 거리 ${frac(`|${iq(c1)} ${MINUS} ${par(c2)}|`, rt(S))} = ${lenH(4 * S * j * j)}일 때이다. 이때 정삼각형의 넓이는 ${frac(rt(3), 4)} × (${lenH(4 * S * j * j)})${sup(2)} = ${radText(coef, 3)}이다.`,
          facts: { calc: [[`(${df(c1, c2)}*${df(c1, c2)})/(4*(${jn(m)}*${jn(m)}+1))`, 0], ['3', 1]], derived: [4, 3] }
        });
      }),
      H('hard-bisector-point', '각의 이등분선이 대변을 나누는 점', '①31', (d) => {
        // 함정: 각의 이등분선이 대변의 중점을 지난다고 여기는 아이. 이등분선 위의 점은 두 변까지의 거리가 같으므로 넓이의 비가 AB : AC 이다.
        const pr = d.until(() => sameLen(d), Boolean), [e1, e2] = pr, [r, s] = d.pick([[1, 2], [2, 1], [1, 3], [3, 1], [2, 3], [3, 2]]), A = [d.int(-5, 5), d.int(-5, 5)];
        if (e1[0] * e2[1] - e1[1] * e2[0] === 0) return null;
        const Bp = add(A, mul(e1, r)), Cp = add(A, mul(e2, s)), Dx = (s * Bp[0] + r * Cp[0]) / (r + s), Dy = (s * Bp[1] + r * Cp[1]) / (r + s);
        if (!Number.isInteger(Dx) || !Number.isInteger(Dy) || !inBox([Bp, Cp], 12)) return null;
        const ab2 = d2(A, Bp), ac2 = d2(A, Cp);
        return pointAns(`세 점 ${P('A', A[0], A[1])}, ${P('B', Bp[0], Bp[1])}, ${Pj('C', Cp[0], Cp[1], '을/를')} 꼭짓점으로 하는 삼각형 ABC에서 ∠A의 이등분선이 변 BC와 만나는 점을 D라 할 때, 점 D의 좌표는?`, Dx, Dy, {
          explain: `D는 ∠A의 이등분선 위의 점이므로 두 직선 AB, AC까지의 거리가 같다. 그래서 두 삼각형 ABD, ADC의 넓이의 비는 ${nb(`${SG('AB')} : ${SG('AC')}`)}이고, 두 삼각형은 높이가 같으므로 넓이의 비는 ${nb(`${SG('BD')} : ${SG('DC')}`)}이기도 하다. ${nb(`${SG('AB')} = ${lenH(ab2)}`)}, ${nb(`${SG('AC')} = ${lenH(ac2)}`)}이므로 ${nb(`${SG('BD')} : ${SG('DC')} = ${r} : ${s}`)}이고, D는 변 BC를 ${ratioj(r, s, '으로/로')} 내분하는 점 ${pt(Dx, Dy)}이다.`,
          facts: { calc: [[`(${s}*${jn(Bp[0])}+${r}*${jn(Cp[0])})/(${r}+${s})`, 0], [`(${s}*${jn(Bp[1])}+${r}*${jn(Cp[1])})/(${r}+${s})`, 1]], derived: [r, s] }
        });
      }),
      // ── ② 세 단계 넘게 이어 생각해야 풀리는 문제 ──
      H('hard-walkers-time', '수직인 두 길 위를 움직이는 두 사람 사이의 거리가 가장 짧은 시각', '①10', (d) => {
        const u = d.int(1, 5), w = d.int(1, 5), p = d.int(2, 12), q = d.int(2, 12), h0 = d.int(7, 9), num = 60 * (u * p + w * q), den = u * u + w * w;
        if (num % den !== 0) return null;
        const mins = num / den, total = h0 * 60 + mins, hh = Math.floor(total / 60), mm = total % 60;
        if (mm === 0 || hh >= 12 || mins <= 0) return null;
        const [n1, n2] = d.shuffle(['서연', '준혁', '하린', '도현', '수아', '민재']).slice(0, 2), flip = d.bool();
        const [d1, d1to, d2w, d2to] = flip ? ['동쪽', '서쪽', '북쪽', '남쪽'] : ['서쪽', '동쪽', '남쪽', '북쪽'];
        const tot = `(${h0}*60+60*(${u}*${p}+${w}*${q})/(${u}*${u}+${w}*${w}))`, xs = flip ? poly([[-u, VT], [p, '']]) : poly([[u, VT], [-p, '']]), ys = flip ? poly([[-w, VT], [q, '']]) : poly([[w, VT], [-q, '']]);
        return M(`교차점 O에서 수직으로 만나는 두 직선 도로가 있다. ${ij(n1)} 교차점 O로부터 ${d1}으로 ${p} km 떨어진 지점에서 ${d1to}을 향하여 시속 ${u} km로 움직이고, ${ij(n2)} 교차점 O로부터 ${d2w}으로 ${q} km 떨어진 지점에서 ${d2to}을 향하여 시속 ${w} km로 움직인다. 두 사람이 오전 ${h0}시에 동시에 출발할 때, 두 사람 사이의 거리가 가장 짧은 시각은?`,
          [{ lead: '오전', answer: hh, unit: '시' }, { answer: mm, unit: '분' }], {
            shown: `오전 ${hh}시 ${mm}분`,
            explain: `O를 원점, 동쪽과 북쪽을 양의 방향으로 하는 좌표평면에 나타내면 ${VT}시간 뒤 두 사람의 위치는 ${pt(xs, 0)}, ${pt(0, ys)}이다. 두 사람 사이의 거리의 제곱은 ${nb(`(${xs})${sup(2)} + (${ys})${sup(2)}`)} = ${nb(poly([[den, VT + sup(2)], [-2 * (u * p + w * q), VT], [p * p + q * q, '']]))}이므로 ${nb(`${VT} = ${frac((u * p + w * q) / gcd(u * p + w * q, den), den / gcd(u * p + w * q, den))}`)}일 때 가장 짧다. ${frac((u * p + w * q) / gcd(u * p + w * q, den), den / gcd(u * p + w * q, den))}시간은 ${mins}분이므로 오전 ${hh}시 ${mm}분이다.`,
            facts: { calc: [[`(${tot}-${tot}%60)/60`, 0], [`${tot}%60`, 1]], derived: [60] }
          });
      }),
      H('hard-walkers-dist', '수직인 두 길 위를 움직이는 두 사람 사이의 거리의 최솟값', '①10', (d) => {
        const u = d.int(1, 3), w = d.int(1, 3), S = u * u + w * w, p = d.int(2, 12), q = d.int(2, 12), diff = Math.abs(p * w - q * u);
        if (u === w || sqParts(S)[0] !== 1 || diff % S !== 0 || diff / S < 2) return null;
        const j = diff / S, [n1, n2] = d.shuffle(['서인', '동석', '지우', '채원', '시우', '은호']).slice(0, 2);
        return inline(`교차점 O에서 수직으로 만나는 두 직선 도로가 있다. ${ij(n1)} 교차점 O로부터 북쪽으로 ${p} km 떨어진 지점에서 남쪽을 향하여 시속 ${u} km로 움직이고, ${ij(n2)} 교차점 O로부터 동쪽으로 ${q} km 떨어진 지점에서 서쪽을 향하여 시속 ${w} km로 움직인다. 두 사람이 동시에 출발하여 움직일 때, 두 사람 사이의 거리의 최솟값은 몇 km인가?`,
          grp('{0}' + rt('{1}')) + ' km', [{ answer: j }, { answer: S }], {
            shown: radText(j, S) + ' km',
            explain: `O를 원점, 동쪽과 북쪽을 양의 방향으로 하면 ${VT}시간 뒤 두 사람의 위치는 ${pt(0, poly([[-u, VT], [p, '']]))}, ${pt(poly([[-w, VT], [q, '']]), 0)}이다. 거리의 제곱은 ${nb(poly([[S, VT + sup(2)], [-2 * (u * p + w * q), VT], [p * p + q * q, '']]))}이고, 완전제곱식으로 고치면 최솟값은 ${frac((p * w - q * u) ** 2, S)} = ${j * j * S}이다. 따라서 거리의 최솟값은 ${rt(j * j * S)} = ${radText(j, S)} km이다.`,
            facts: { calc: [[`${p * w - q * u < 0 ? '0-' : ''}(${p}*${w}-${q}*${u})/(${u}*${u}+${w}*${w})`, 0], [`${u}*${u}+${w}*${w}`, 1]] }
          });
      }),
      H('hard-segment-min', '선분 위를 움직이는 점과 거리의 제곱의 합의 최솟값', '①13', (d) => {
        const m = nz(d, -3, 3), k = d.int(-5, 5), xa = d.int(-4, 3), xb = xa + d.int(2, 5), A = [xa, m * xa + k], Bp = [xb, m * xb + k];
        if (!inBox([A, Bp], 12) || (A[0] === 0 && A[1] === 0) || (Bp[0] === 0 && Bp[1] === 0)) return null;
        // P(t, mt + k): OP² + AP² = αt² + βt + γ
        const al = 2 + 2 * m * m, be = 2 * m * k - 2 * A[0] + 2 * m * (k - A[1]), ga = k * k + A[0] * A[0] + (k - A[1]) ** 2, tq = Q(-be, 2 * al), vq = qsub(Q(ga), Q(be * be, 4 * al));
        if (!(fl(tq) > xa && fl(tq) < xb) || vq.q !== 1 || vq.p <= 0) return null;
        // 검사 식: 직선 AB 의 기울기·y절편을 두 점의 좌표로 셈한다.
        const mE = `(${df(Bp[1], A[1])}/${df(Bp[0], A[0])})`, kE = `(${jn(A[1])}-${mE}*${jn(A[0])})`;
        const alE = `(2+2*${mE}*${mE})`, beE = `(2*${mE}*${kE}-2*${jn(A[0])}+2*${mE}*(${kE}-${jn(A[1])}))`, gaE = `(${kE}*${kE}+${jn(A[0])}*${jn(A[0])}+(${kE}-${jn(A[1])})*(${kE}-${jn(A[1])}))`;
        return N(`원점 O와 두 점 ${P('A', A[0], A[1])}, ${P('B', Bp[0], Bp[1])}에 대하여 점 P가 선분 AB 위를 움직일 때, ${nb(`${SG('OP')}${sup(2)} + ${SG('AP')}${sup(2)}`)}의 최솟값은?`, vq.p, {
          explain: `직선 AB의 방정식은 ${slopeH(m, k)}이므로 P${pt(VT, poly([[m, VT], [k, '']]))}(${nb(`${iq(xa)} ≤ ${VT} ≤ ${iq(xb)}`)})라 하면 ${nb(`${SG('OP')}${sup(2)} + ${SG('AP')}${sup(2)}`)} = ${nb(poly([[al, VT + sup(2)], [be, VT], [ga, '']]))} = ${sqForm(al, VT, tq, vq.p)}이다. ${VT} = ${iq(tq)}${jw(iq(tq), '은/는').slice(iq(tq).length)} 범위 안에 있으므로 최솟값은 ${vq.p}이다.`,
          facts: { calc: [[`${gaE}-(${beE})*(${beE})/(4*${alE})`, 0]], derived: [2, 4] }
        });
      }),
      H('hard-rhombus-vertex', '마름모의 꼭짓점의 미지수 구하기', '①30', (d) => {
        const Bp = [d.int(-3, 3), d.int(-3, 3)], u = [nz(d, -4, 4), nz(d, -4, 4)], Cp = add(Bp, u), L2 = u[0] ** 2 + u[1] ** 2;
        const opts = []; for (let x = -7; x <= 7; x += 1) for (let y = -7; y <= 7; y += 1) if (x * x + y * y === L2 && x !== 0 && !(x === u[0] && y === u[1]) && !(x === -u[0] && y === -u[1])) opts.push([x, y]);
        if (!opts.length) return null;
        const v = d.pick(opts), A = add(Bp, v), Dp = add(A, u), other = 2 * Bp[0] - A[0], A2 = [other, A[1]], w2 = sub(A2, Bp);
        if (!inBox([Cp, A, Dp], 12) || (A2[0] === Cp[0] && A2[1] === Cp[1]) || w2[0] * u[1] - w2[1] * u[0] === 0) return null;
        const big = A[0] > Bp[0];
        return vals(`네 점 ${P('A', VA, A[1])}, ${P('B', Bp[0], Bp[1])}, ${P('C', Cp[0], Cp[1])}, ${Pj('D', VB, Dp[1], '을/를')} 꼭짓점으로 하는 사각형 ABCD가 마름모일 때, 상수 ${VA}, ${VB}의 값은? (단, ${nb(`${VA} ${big ? '&gt;' : '&lt;'} ${iq(Bp[0])}`)})`, [[VA, A[0]], [VB, Dp[0]]], {
          explain: `마름모는 평행사변형이므로 두 대각선 AC, BD의 중점이 같고, 두 중점의 ${X}좌표에서 ${nb(`${VA} + ${par(Cp[0])} = ${iq(Bp[0])} + ${VB}`)}이다. 또 ${nb(`${SG('AB')} = ${SG('BC')}`)}이므로 ${nb(`${sqForm(1, VA, Bp[0], 0)} + ${par(Bp[1] - A[1])}${sup(2)} = ${L2}`)}에서 ${VA} = ${iq(A[0])} 또는 ${VA} = ${iq(other)}이다. ${nb(`${VA} ${big ? '&gt;' : '&lt;'} ${iq(Bp[0])}`)}이므로 ${VA} = ${iq(A[0])}, ${VB} = ${iq(Dp[0])}이다.`,
          facts: { calc: [[`2*${jn(Bp[0])}-(${jn(other)})`, 0], [`2*${jn(Bp[0])}-(${jn(other)})+${jn(Cp[0])}-${jn(Bp[0])}`, 1]], derived: [2, other] }
        });
      }),
      H('hard-equi-centroid', '정삼각형의 한 꼭짓점과 무게중심으로 넓이 구하기', '①32', (d) => {
        const G = d.bool() ? [0, 0] : [d.int(-3, 3), d.int(-3, 3)], [vx0, vy0, L] = d.pick([[0, 2, 2], [0, 4, 4], [0, 6, 6], [6, 8, 10], [8, 6, 10]]), v = d.bool() ? [vx0 * pm(d), vy0 * pm(d)] : [vy0 * pm(d), vx0 * pm(d)], A = add(G, v), coef = 3 * L * L / 4;
        if (!inBox([A], 12)) return null;
        const Gh = G[0] === 0 && G[1] === 0 ? '원점' : `점 ${pt(G[0], G[1])}`;
        return radLen(`좌표평면 위의 점 ${Pj('A', A[0], A[1], '을/를')} 한 꼭짓점으로 하는 정삼각형 ABC의 무게중심이 ${Gh}일 때, 삼각형 ABC의 넓이는?`, coef, 3, {
          explain: `무게중심을 G, 변 BC의 중점을 M이라 하면 ${nb(`${SG('AG')} = ${L}`)}이고 G는 선분 AM을 2 : 1로 내분하므로 ${nb(`${SG('AM')} = ${frac(3, 2)} × ${L} = ${3 * L / 2}`)}이다. 정삼각형의 높이가 ${3 * L / 2}이므로 한 변의 길이는 ${radText(L, 3)}이고, 넓이는 ${frac(1, 2)} × ${radText(L, 3)} × ${3 * L / 2} = ${radText(coef, 3)}이다.`,
          facts: { calc: [[`3*${sq(A[0] - G[0], A[1] - G[1])}/4`, 0], ['3', 1]], derived: [3, 4, A[0] - G[0], A[1] - G[1]] }
        });
      }),
      H('hard-curve-centroid', '곡선과 직선의 교점이 만드는 삼각형의 넓이와 무게중심', '①33', (d) => {
        // 무게중심이 정수가 되려면 p 와 m 이 모두 3의 배수여야 한다(p − m ≡ 0, m(m + p) ≡ 0 (mod 3)).
        const p = 3 * d.int(3, 5), m = -3 * d.int(1, Math.floor((p / 2 - 0.5) / 3)), yB = -m * (m + p), S2 = p * yB;
        if (S2 % 2 !== 0 || (p - m) % 3 !== 0 || yB % 3 !== 0 || -m >= p / 2) return null;
        const S = S2 / 2, xB = -m;
        return pointAns(`곡선 ${nb(`${Y} = ${MINUS}${X}${sup(2)} + ${p}${X}`)}와 ${X}축이 만나는 점 가운데 원점이 아닌 점을 A, 점 A를 지나고 기울기가 ${VM}인 직선이 이 곡선과 만나는 점 가운데 A가 아닌 점을 B라 하자. 삼각형 OAB의 넓이가 ${nj(S, '일/일')} 때, 삼각형 OAB의 무게중심의 좌표는? (단, ${nb(`${MINUS}${iq(Q(p, 2))} &lt; ${VM} &lt; 0`)}이고, O는 원점이다.)`, (p + xB) / 3, yB / 3, {
          explain: `A${pt(p, 0)}이고 직선은 ${nb(`${Y} = ${VM}(${X} ${MINUS} ${p})`)}이다. ${nb(`${MINUS}${X}${sup(2)} + ${p}${X} = ${VM}(${X} ${MINUS} ${p})`)}에서 ${nb(`(${X} ${MINUS} ${p})(${X} + ${VM}) = 0`)}이므로 B의 ${X}좌표는 ${MINUS}${VM}, ${Y}좌표는 ${nb(`${MINUS}${VM}(${VM} + ${p})`)}이다. 넓이에서 ${nb(`${frac(1, 2)} × ${p} × {${MINUS}${VM}(${VM} + ${p})} = ${S}`)}, 곧 ${nb(`${VM}${sup(2)} + ${p}${VM} + ${S2 / p} = 0`)}이고 ${nb(`${MINUS}${iq(Q(p, 2))} &lt; ${VM} &lt; 0`)}이므로 ${VM} = ${iq(m)}이다. B${pt(xB, yB)}이므로 무게중심은 ${pt((p + xB) / 3, yB / 3)}이다.`,
          facts: { calc: [[`(${p}-(${jn(m)}))/3`, 0], [`(0-${jn(m)}*(${jn(m)}+${p}))/3`, 1]], derived: [3, m] }
        });
      }),
      H('hard-vieta-centroid', '곡선과 직선의 두 교점과 원점이 만드는 삼각형의 무게중심', '심3', (d) => {
        const b = d.int(-8, 8), c = d.int(-6, 6), k = nz(d, -4, 4), l = d.int(-6, 8), s = k - b, disc = s * s - 4 * (c - l);
        if (disc <= 0 || isSq(disc) || s % 3 !== 0 || (k * s + 2 * l) % 3 !== 0 || s === 0) return null;
        const gx = s / 3, gy = (k * s + 2 * l) / 3;
        return pointAns(`곡선 ${jw(nb(`${Y} = ${poly([[1, X + sup(2)], [b, X], [c, '']])}`), '과/와')} 직선 ${slopej(k, l, '이/가')} 만나는 두 점을 A, B라 할 때, 삼각형 OAB의 무게중심의 좌표는? (단, O는 원점이다.)`, gx, gy, {
          explain: `두 교점의 ${X}좌표를 α, β라 하면 α, β는 이차방정식 ${nb(`${poly([[1, X + sup(2)], [b - k, X], [c - l, '']])} = 0`)}의 두 근이므로 근과 계수의 관계에서 ${nb(`α + β = ${iq(s)}`)}이다. 두 교점의 ${Y}좌표의 합은 ${nb(`${cv(k, '(α + β)')} + ${par(2 * l)} = ${iq(k * s + 2 * l)}`)}이므로 무게중심은 ${nb(`(${fr(s, 3)}, ${fr(k * s + 2 * l, 3)})`)} = ${pt(gx, gy)}이다(근을 하나하나 구하지 않아도 된다).`,
          facts: { calc: [[`(${jn(k)}-${jn(b)})/3`, 0], [`(${jn(k)}*(${jn(k)}-${jn(b)})+2*${jn(l)})/3`, 1]], derived: [2, 3] }
        });
      }),
      H('hard-perp-area-bisect', '수직인 직선으로 삼각형의 넓이를 이등분하기', '②12', (d) => {
        // l: px + qy − r = 0(p > q, p² + q² 은 제곱수)과 두 축으로 둘러싸인 삼각형의 넓이를 l 에 수직인 직선 m 이 이등분한다. m 의 y절편 a + b√2.
        const [p, q, s, r] = d.pick([[4, 3, 5, 24], [4, 3, 5, 48], [12, 5, 13, 120], [15, 8, 17, 240]]), X0 = r / p, Y0 = r / q, bq = Q(-r * s, 2 * p * q);
        if (bq.q !== 1) return null;
        return vals(`직선 ${genH(p, q, -r)}${jw(genH(p, q, -r), '과/와').slice(genH(p, q, -r).length)} ${X}축, ${Y}축으로 둘러싸인 삼각형의 넓이를 이 직선에 수직인 직선 ${VM}이 이등분할 때, 직선 ${VM}의 ${Y}절편은 ${nb(`${VA} + ${VB}${rt(2)}`)}이다. 유리수 ${VA}, ${VB}의 값은?`, [[VA, Y0], [VB, bq.p]], {
          explain: `삼각형의 넓이는 ${frac(1, 2)} × ${X0} × ${Y0} = ${X0 * Y0 / 2}이다. 직선 ${VM}을 ${nb(`${Y} = ${frac(q, p)}${X} + ${VK}`)}라 하면 두 직선과 ${Y}축으로 둘러싸인 삼각형의 넓이가 ${X0 * Y0 / 4}이어야 한다. 두 직선의 교점의 ${X}좌표는 ${nb(frac(`${p * q}(${Y0} ${MINUS} ${VK})`, p * p + q * q))}이므로 ${nb(`${frac(1, 2)}(${Y0} ${MINUS} ${VK}) × ${frac(`${p * q}(${Y0} ${MINUS} ${VK})`, p * p + q * q)} = ${X0 * Y0 / 4}`)}, ${nb(`(${Y0} ${MINUS} ${VK})${sup(2)} = ${X0 * Y0 * (p * p + q * q) / (2 * p * q)}`)}이다. ${VK} &lt; ${Y0}이므로 ${nb(`${VK} = ${Y0} ${MINUS} ${radText(-bq.p, 2)}`)}이고 ${VA} = ${Y0}, ${VB} = ${iq(bq.p)}이다.`,
          facts: { calc: [[`${r}/${q}`, 0], [`(0-${r}*${s})/(2*${p}*${q})`, 1]], derived: [s, 2] }
        });
      }),
      H('hard-perp-reflect', '수직 조건과 수직이등분선으로 정한 점을 지나는 직선의 y절편', '심7', (d) => {
        const xA = nz(d, -3, 3), yA = nz(d, -4, 4), yB = nz(d, -6, 6), a = -yA * yB / xA;
        if (!Number.isInteger(a) || a === 0 || yB === xA || Math.abs(a) > 20 || (a === yB)) return null;
        const Cp = [yB, a], sl = Q(a - yA, yB - xA), icp = qsub(Q(yA), qmul(sl, Q(xA)));
        if (icp.q === 1) return null;
        return ansV(`세 점 ${P('A', xA, yA)}, ${P('B', VA, yB)}, ${P('C', VB, VC2)}가 다음 조건을 만족시킨다. ㈎ 두 직선 OA, OB는 서로 수직이다. ㈏ 선분 BC의 수직이등분선은 직선 ${nb(`${Y} = ${X}`)}이다. 직선 AC의 ${Y}절편은? (단, O는 원점이다.)`, icp, 'frac', {
          explain: `㈎에서 두 직선 OA, OB의 기울기의 곱이 −1이므로 ${nb(`${iq(Q(yA, xA))} × ${yB < 0 ? `(${fr(yB, VA)})` : fr(yB, VA)} = −1`)}, ${VA} = ${iq(a)}이다. ㈏에서 직선 BC는 ${nb(`${Y} = ${X}`)}에 수직이고 선분 BC의 중점은 ${nb(`${Y} = ${X}`)} 위에 있으므로 ${nb(`${frac(`${VC2} ${MINUS} ${par(yB)}`, `${VB} ${MINUS} ${par(a)}`)} = −1`)}, ${nb(`${frac(`${iq(yB)} + ${VC2}`, 2)} = ${frac(`${iq(a)} + ${VB}`, 2)}`)}에서 C${pt(Cp[0], Cp[1])}이다. 직선 AC의 기울기는 ${iq(sl)}이므로 ${Y}절편은 ${iq(icp)}이다.`,
          facts: { value: `${jn(yA)}-((0-${jn(yA)}*${jn(yB)}/${jn(xA)})-${jn(yA)})/(${jn(yB)}-${jn(xA)})*${jn(xA)}` }
        });
      }),
      H('hard-perp-dist-then', '수직이고 거리가 주어진 두 직선 가운데 하나를 골라 지나는 점 구하기', '②39', (d) => {
        const [a0, b0, Nn] = d.pick(PY.filter(([x, y]) => gcd(x, y) === 1)), a = a0, b = -pm(d) * b0, sg = pm(d), D = d.int(1, 3), Qp = d.until(() => [d.int(-8, 8), d.int(-8, 8)], (q) => a * q[0] + b * q[1] === sg * D * Nn);
        const c2 = -2 * sg * D * Nn, L0 = norm(b, -a, nz(d, -12, 12)), y1 = d.int(-8, 8), top = -(b * y1 + c2);
        if (top % a !== 0) return null;
        const xa = top / a;
        if (Math.abs(xa) > 20) return null;
        return N(`직선 ${lh(L0)}에 수직이고 점 ${pt(Qp[0], Qp[1])}에서의 거리가 ${nj(D, '인/인')} 직선 가운데 원점을 지나지 않는 직선이 점 ${ptj(VA, y1, '을/를')} 지날 때, 상수 ${VA}의 값은?`, xa, {
          signed: true,
          explain: `직선 ${lh(L0)}에 수직인 직선은 ${nb(`${poly([[a, X], [b, Y]])} + ${VC2} = 0`)}으로 놓을 수 있다. 점 ${pt(Qp[0], Qp[1])}에서의 거리가 ${D}이므로 ${nb(`${frac(`|${poly([[a * Qp[0] + b * Qp[1], '']])} + ${VC2}|`, Nn)} = ${D}`)}, ${VC2} = 0 또는 ${VC2} = ${iq(c2)}이다. 원점을 지나지 않는 직선은 ${genH(a, b, c2)}이고, 점 ${ptj(VA, y1, '을/를')} 지나므로 ${VA} = ${iq(xa)}이다.`,
          facts: { calc: [[`(0-(${jn(b)}*${jn(y1)}-2*${sg}*${D}*${Nn}))/${jn(a)}`, 0]], derived: [2, Nn, a, b] }
        });
      }),
      H('hard-centroid-line-dist', '무게중심과 직선 사이의 거리로 꼭짓점의 좌표 구하기', '②46', (d) => {
        const [xa, ya, Nn] = d.pick([[3, 4, 5], [4, 3, 5], [8, 6, 10], [6, 8, 10], [12, 5, 13], [5, 12, 13]]), gx = d.int(1, 6), xb = 3 * gx - xa, b1 = d.int(1, 9), a1 = 3 * b1 - ya;
        const num = Math.abs(ya * gx - xa * b1);
        if (xb <= 0 || a1 <= 0 || num === 0 || num % Nn !== 0) return null;
        const dd = num / Nn, b2 = Q(2 * ya * gx - xa * b1, xa), a2 = qsub(qmul(Q(3), b2), Q(ya));
        if (a2.p > 0) return null;
        const sgn = ya * gx - xa * b1 > 0 ? 1 : -1;
        return vals(`세 점 O(0, 0), ${P('A', xa, ya)}, ${Pj('B', xb, VA, '을/를')} 꼭짓점으로 하는 삼각형 OAB의 무게중심 G의 좌표가 ${pt(gx, VB)}이다. 점 G와 직선 OA 사이의 거리가 ${nj(dd, '일/일')} 때, 상수 ${VA}, ${VB}의 값은? (단, 점 B는 제1사분면 위의 점이다.)`, [[VA, a1], [VB, b1]], {
          explain: `무게중심의 좌표에서 ${nb(`${VB} = ${frac(`${iq(ya)} + ${VA}`, 3)}`)}이다. 직선 OA의 방정식은 ${genH(ya / gcd(xa, ya), -xa / gcd(xa, ya), 0)}이므로 ${nb(`${frac(`|${ya * gx / gcd(xa, ya)} ${MINUS} ${cv(xa / gcd(xa, ya), VB)}|`, Nn / gcd(xa, ya))} = ${dd}`)}에서 ${VB} = ${iq(b1)} 또는 ${VB} = ${iq(b2)}이다. ${VB} = ${iq(b2)}이면 ${jw(`${VA} = ${iq(a2)}`, '이어서/여서')} B가 제1사분면 위에 있지 않으므로 ${VB} = ${b1}, ${VA} = ${a1}이다.`,
          facts: { calc: [[`3*(${ya}*${gx}${sgn > 0 ? '-' : '+'}${dd}*${Nn})/${xa}-${ya}`, 0], [`(${ya}*${gx}${sgn > 0 ? '-' : '+'}${dd}*${Nn})/${xa}`, 1]], derived: [3, Nn] }
        });
      }),
      H('hard-incenter', '세 변에서 같은 거리에 있는 점(내심)', '②47', (d) => {
        const NRM = [[0, -1, 1], [0, 1, 1], [-1, 0, 1], [1, 0, 1], [3, 4, 5], [4, 3, 5], [-3, 4, 5], [-4, 3, 5], [3, -4, 5], [4, -3, 5], [-3, -4, 5], [-4, -3, 5]];
        const I = [d.int(-3, 3), d.int(-3, 3)], r = d.int(1, 3), ns = d.shuffle(NRM).slice(0, 3);
        // 세 법선이 원점을 감싸야(어느 반평면에도 모두 들지 않아야) 삼각형이 내심을 감싼다.
        const ang = ns.map(([x, y]) => Math.atan2(y, x)).sort((u, v) => u - v), gaps = [ang[1] - ang[0], ang[2] - ang[1], 2 * Math.PI + ang[0] - ang[2]];
        if (gaps.some((g) => g >= Math.PI - 1e-9)) return null;
        const ls = ns.map(([x, y, n]) => ({ a: x, b: y, c: -(x * I[0] + y * I[1] + r * n) }));
        const vs = [[0, 1], [1, 2], [2, 0]].map(([i, j]) => { const den = ls[i].a * ls[j].b - ls[j].a * ls[i].b, x = (ls[i].b * ls[j].c - ls[j].b * ls[i].c) / den, y = (ls[j].a * ls[i].c - ls[i].a * ls[j].c) / den; return [x, y]; });
        if (!vs.every(([x, y]) => Number.isInteger(x) && Number.isInteger(y)) || !inBox(vs, 12)) return null;
        const [A, Bp, Cp] = d.shuffle(vs), a = Math.sqrt(d2(Bp, Cp)), b = Math.sqrt(d2(Cp, A)), c = Math.sqrt(d2(A, Bp));
        if (![a, b, c].every(Number.isInteger)) return null;
        return pointAns(`세 점 ${P('A', A[0], A[1])}, ${P('B', Bp[0], Bp[1])}, ${Pj('C', Cp[0], Cp[1], '을/를')} 꼭짓점으로 하는 삼각형 ABC의 내심의 좌표는?`, I[0], I[1], {
          explain: `내심은 세 변에서 같은 거리에 있는 점이다. 세 변이 놓인 직선은 ${ls.map((l) => lh(norm(l.a, l.b, l.c))).join(', ')}이고, 내심 ${pt(X, Y)}에서 세 직선까지의 거리가 같다는 식을 세우고, 내심이 삼각형의 안쪽에 있다는 것으로 절댓값 기호 안의 부호를 정하여 연립하면 ${pt(I[0], I[1])}이다. 내심에서 세 변까지의 거리는 ${r}이다.`,
          facts: { calc: [[`(${a}*${jn(A[0])}+${b}*${jn(Bp[0])}+${c}*${jn(Cp[0])})/(${a}+${b}+${c})`, 0], [`(${a}*${jn(A[1])}+${b}*${jn(Bp[1])}+${c}*${jn(Cp[1])})/(${a}+${b}+${c})`, 1]], derived: [a, b, c] }
        });
      }),
      H('hard-fold', '정사각형을 접었을 때 점과 직선 사이의 거리', '②49', (d) => {
        const s = d.int(3, 8), [p, q] = d.pick([[1, 2], [1, 3], [2, 1], [1, 1], [1, 4], [2, 3], [3, 1]]), e = s * p / (p + q);
        if (!Number.isInteger(e) || e >= s || e <= 0) return null;
        const v = Q(s * (s * s - e * e), s * s + e * e);
        if (v.q === 1) return null;
        // 그림: B(0, 0), C(s, 0), D(s, s), A(0, s), E(s, e). C' 은 C 를 직선 BE 에 대하여 대칭시킨 점(B 에서 거리 s, 각 2θ).
        const k = 150 / s, th = Math.atan2(e, s), sc = (x, y) => [20 + x * k, 20 + (s - y) * k];
        const Cq = [s * Math.cos(2 * th), s * Math.sin(2 * th)];
        const g = Board(), pA = sc(0, s), pB = sc(0, 0), pC = sc(s, 0), pD = sc(s, s), pE = sc(s, e), pC2 = sc(Cq[0], Cq[1]);
        g.poly([pA, pB, pC, pD]).seg(pB, pE, 'cut').seg(pB, pC2).seg(pE, pC2).dot(pC2)
          .name(pA, 'A', 135).name(pB, 'B', 225).name(pC, 'C', 315).name(pD, 'D', 45).name(pE, 'E', 0).name(pC2, 'C′', freeAngle(pC2, [[pA, pB], [pB, pC], [pC, pD], [pD, pA], [pB, pE], [pB, pC2], [pE, pC2]], 13), 13);
        const figure = g.svg(`한 변의 길이가 ${s}인 정사각형 ABCD(A 왼쪽 위, B 왼쪽 아래, C 오른쪽 아래, D 오른쪽 위). 변 CD 위의 점 E와 B를 잇는 점선을 따라 접어 C가 사각형 ABED 안의 점 C′으로 옮겨졌다. 선분 BC′, EC′이 그어져 있다.`);
        return F(`그림과 같이 한 변의 길이가 ${s}인 정사각형 ABCD에서 변 CD를 ${ratioj(p, q, '으로/로')} 내분하는 점을 E라 하자. 선분 BE를 접는 선으로 하여 정사각형을 접었더니 점 C가 사각형 ABED의 내부의 점 C′으로 옮겨졌다. 점 A와 직선 BC′ 사이의 거리는?`, v.p, v.q, {
          figure, improper: v.p > v.q,
          explain: `B를 원점, 직선 BC를 ${X}축으로 하면 A${pt(0, s)}, E${pt(s, e)}이다. 접었으므로 점 E와 직선 BC′ 사이의 거리는 ${nb(`${SG('EC')} = ${e}`)}이다. 직선 BC′을 ${nb(`${Y} = ${VM}${X}`)}라 하면 ${nb(`${frac(`|${s}${VM} ${MINUS} ${e}|`, rt(`${VM}${sup(2)} + 1`))} = ${e}`)}에서 ${VM} = 0(직선 BC) 또는 ${VM} = ${iq(Q(2 * s * e, s * s - e * e))}이다. 따라서 점 A와 직선 BC′ 사이의 거리는 ${frac(s, rt(`${VM}${sup(2)} + 1`))} = ${iq(v)}이다.`,
          facts: { value: `${s}*(${s}*${s}-(${s}*${p}/(${p}+${q}))*(${s}*${p}/(${p}+${q})))/(${s}*${s}+(${s}*${p}/(${p}+${q}))*(${s}*${p}/(${p}+${q})))` }
        });
      }),
      H('hard-sum-sq-max', '세 점에서 원점을 지나는 직선까지의 거리의 제곱의 합의 최댓값', '②50', (d) => {
        const A = [d.int(-4, 4), d.int(-5, 5)], Bp = [d.int(-4, 4), d.int(-5, 5)], need = -(A[0] * A[1] + Bp[0] * Bp[1]);
        const divs = []; for (let x = -4; x <= 4; x += 1) if (x !== 0 && need % x === 0 && Math.abs(need / x) <= 7) divs.push(x);
        if (!divs.length) return null;
        const xc = d.pick(divs), Cp = [xc, need / xc], X2 = A[0] ** 2 + Bp[0] ** 2 + Cp[0] ** 2, Y2 = A[1] ** 2 + Bp[1] ** 2 + Cp[1] ** 2;
        if (Y2 <= X2 || new Set([A, Bp, Cp].map(String)).size < 3) return null;
        return N(`세 점 ${P('A', A[0], A[1])}, ${P('B', Bp[0], Bp[1])}, ${P('C', Cp[0], Cp[1])}에서 직선 ${nb(`${Y} = ${VM}${X}`)}에 이르는 거리의 제곱의 합의 최댓값은? (단, ${VM}은 실수이다.)`, Y2, {
          explain: `세 점에서 직선 ${nb(`${VM}${X} ${MINUS} ${Y} = 0`)}까지의 거리의 제곱은 분모가 모두 ${nb(`${VM}${sup(2)} + 1`)}이고, 분자는 각각 ${[A, Bp, Cp].map((q) => nb(`(${poly([[q[0], VM], [-q[1], '']])})${sup(2)}`)).join(', ')}이다. 세 분자를 더하면 ${VM}의 일차항이 지워져 ${nb(`${X2}${VM}${sup(2)} + ${Y2}`)}이므로 거리의 제곱의 합은 ${frac(`${X2}${VM}${sup(2)} + ${Y2}`, `${VM}${sup(2)} + 1`)} = ${nb(`${X2} + ${frac(Y2 - X2, `${VM}${sup(2)} + 1`)}`)}이다. ${nb(`${VM}${sup(2)} + 1 ≥ 1`)}이므로 ${VM} = 0일 때 최댓값 ${nj(Y2, '을/를')} 갖는다.`,
          facts: { calc: [[`${jn(A[1])}*${jn(A[1])}+${jn(Bp[1])}*${jn(Bp[1])}+${jn(Cp[1])}*${jn(Cp[1])}`, 0]] }
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
