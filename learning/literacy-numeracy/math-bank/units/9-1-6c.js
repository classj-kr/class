// 중학교 3학년 1학기 6단원 이차함수 y = ax² + bx + c의 그래프 — 실력 문항.
// 단원 틀과 도구, 싣는 기준, 뺀 것과 까닭은 9-1-6a.js 에 있다. ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 ①의 장치는 이 잘못을 가진 아이가 걸리게 만들었다)
//  - y = a(x + p)² + q 의 꼭짓점의 x좌표를 p 로 읽는다(−p 이다). y절편을 q 로 읽는다(x = 0 을 넣은 값이다).
//  - 이차항의 계수에 문자가 들어 있으면 그 계수가 0이 되는 값도 답에 넣는다(그때는 이차함수가 아니다).
//  - 축이 y축의 오른쪽에 있으면 b > 0 이라고 여긴다(a 와 b 의 부호가 다르다). a + b + c, a − b + c 가 x = 1, −1 에서의 함숫값임을 놓친다.
//  - 꼭짓점이 x축 위에 있는 그래프가 x축 위의 점을 지나면 그 점이 곧 꼭짓점이라는 것을 놓친다. x축과의 두 교점이 축에 대칭임을 놓친다.
//  - 계수의 자리를 바꾼 식(y = cx² + bx + a), 다른 그래프에서 읽은 부호로 만든 식에서 볼록한 쪽·축·y절편을 다시 따지지 않는다.
//
// 실력에는 ① 문제의 식·그림·상황에 함정이 있어 뜻을 정확히 대야 풀리는 문제와 ② 세 단계 넘게 이어 생각해야 풀리는 문제만 실었다.
// 수집본 기본 문서에 여러 번 나오는 꼴(꼭짓점과 한 점으로 식 구하기, 계수의 부호, 두 꼭짓점이 일치, 꼭짓점이 직선 위, 옮긴 두 포물선 사이의 넓이)은 기본 묶음에 두었다.
// 심화 자료에서 기본에 둔 것: 서로의 꼭짓점을 지나는 두 그래프(심1 — 두 단계), 밑변이 같은 두 삼각형의 넓이의 비(심17), b/a·c/a의 부호(심26).
// 「꼬여 있다」는 까닭으로 빼지 않은 것: 제곱의 합이 0(심6), 꼭짓점이 같을 확률(심8), 문자의 구실을 바꾼 중근 조건(심9) — 이 단원에서 배운 꼭짓점·완전제곱식으로 풀린다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, N, M, C, F, inline } = B.kit;
  const { LAB, MINUS, GT, LT, Q, qadd, qsub, qmul, qdiv, qneg, qabs, isInt, fl, mag, tx, nb, tail, lastOf, js, V, sup, nz, pm, ansV, asQ, pointAns, plain, gcd } = B.kit.mid;
  const K9 = B.kit.m916;
  const { S22, sourceOf, X, Y, A, BB, CC, P, QV, K, MM, NN, X2, XA, YA, YI, num, iq, jn, sgn, is, isj, pt, ptj, cmp, par, ka, jw, put, coefText, rhs, std, genR, gen, stdL, genL,
    vtxOf, expand, QN, quadsOf, quadText, genAns, vals, fig, figOk, picks, span, bowl, signFig, signWord, genOf, hasZero, term } = K9;
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: ref.startsWith('기본 ') ? '수집본 기본 자료(' + ref.slice(3) + ')' : sourceOf(ref), make }, more || {});
  const GL = nb(`${Y} = ${A}${X2} + ${BB}${X} + ${CC}`);
  const quadOf = (x, y) => (x > 0 ? (y > 0 ? 0 : 3) : (y > 0 ? 1 : 2));
  // 직선 y = ax + b 가 지나는 사분면(0~3)
  const lineQuads = (sa, sb) => (sa > 0 ? (sb > 0 ? [0, 1, 2] : [0, 2, 3]) : (sb > 0 ? [0, 1, 3] : [1, 2, 3]));
  const qset = (list) => '제' + list.map((i) => i + 1).join(', ') + '사분면';
  // 부호만 읽는 직선 그림(눈금도 수도 없다)
  const lineFig = (sa, sb) => fig({ x: [-4, 4], y: [-4, 4], lines: [{ a: sa * 1.2, b: sb * 2 }], say: `직선 하나(눈금과 수는 없다). 오른쪽 ${sa > 0 ? '위' : '아래'}로 향하고 y축과 원점보다 ${sb > 0 ? '위' : '아래'}에서 만난다.` });

  B.addGroup('9-1-6', {
    id: 'hard', title: '단원 종합', standard: S22,
    types: [
      // ── ① 식·그림·상황에 함정이 있어 뜻을 정확히 대야 풀리는 문제 ──
      H('hard-coef-not-quad', '이차항의 계수에 문자가 든 식의 꼭짓점 조건', '기본 ①37', (d) => {
        // 함정: 꼭짓점의 y좌표가 0이 되는 두 값 가운데 이차항의 계수를 0으로 만드는 값(이차함수가 아니다)을 버리지 않는 아이.
        const c = d.until(() => ({ r1: nz(d, -4, 4), r2: nz(d, -4, 4), p: nz(d, -4, 4) }), (v) => v.r1 !== v.r2 && v.r1 + v.r2 !== 0);
        const sum = c.r1 + c.r2, prod = c.r1 * c.r2;
        return N(`이차함수 ${nb(`${Y} = (${A} ${sgn(-c.r1)})(${X} ${sgn(-c.p)})${sup(2)} + ${A}${sup(2)}${term(-sum, A)}${term(prod, '')}`)}의 그래프의 꼭짓점의 좌표가 ${pt(c.p, 0)}일 때, 수 ${A}의 값은?`, c.r2, { signed: true,
          explain: `꼭짓점의 좌표는 ${pt(c.p, nb(`${A}${sup(2)}${term(-sum, A)}${term(prod, '')}`))}이므로 ${nb(`${A}${sup(2)}${term(-sum, A)}${term(prod, '')} = 0`)}, ${nb(`(${A} ${sgn(-c.r1)})(${A} ${sgn(-c.r2)}) = 0`)}에서 ${is(A, c.r1)} 또는 ${is(A, c.r2)}이다. ${is(A, c.r1)}이면 ${X2}의 계수가 0이 되어 이차함수가 아니므로 ${is(A, c.r2)}이다.`,
          facts: { value: `${jn(sum)}-${jn(c.r1)}`, unseen: [Math.abs(sum)] }
        });
      }),
      H('hard-xaxis-vertex-point', '꼭짓점이 x축 위에 있는 그래프가 x축 위의 점과 다른 점을 지날 때', '심13', (d) => {
        // 함정: x축 위의 점 (r, 0)이 곧 꼭짓점이라는 것을 보지 못하고 미지수 셋으로 풀려는 아이.
        const c = d.until(() => { const a = nz(d, -3, 3), r = nz(d, -4, 4), x1 = r + pm(d) * d.int(1, 3); return { a, r, x1, y1: a * (x1 - r) ** 2, g: genOf(a, r, 0) }; }, (v) => v.x1 !== 0 && !hasZero(v.g) && Math.abs(v.y1) <= 40);
        return genAns(`꼭짓점이 ${XA} 위에 있는 이차함수의 그래프가 두 점 ${pt(c.r, 0)}, ${ptj(c.x1, c.y1, '을/를')} 지날 때, 이 이차함수의 식을 ${GL}의 꼴로 나타내시오.`, c.g.a, c.g.b, c.g.c, {
          explain: `꼭짓점이 ${XA} 위에 있는 포물선은 ${XA}과 꼭짓점 한 곳에서만 만나므로, ${XA} 위의 점 ${jw(pt(c.r, 0), '이/가')} 꼭짓점이다. 식을 ${jw(nb(`${Y} = ${A}(${X} ${sgn(-c.r)})${sup(2)}`), '으로/로')} 놓고 ${put(c.x1, c.y1)} ${nb(`${iq(c.y1)} = ${ka((c.x1 - c.r) ** 2, A)}`)}, ${is(A, c.a)}이다. 전개하면 ${gen(c.g.a, c.g.b, c.g.c)}이다.`,
          facts: { calc: [[`${jn(c.y1)}/((${jn(c.x1)}-${jn(c.r)})*(${jn(c.x1)}-${jn(c.r)}))`, 0], [`0-2*${jn(c.y1)}/((${jn(c.x1)}-${jn(c.r)})*(${jn(c.x1)}-${jn(c.r)}))*${jn(c.r)}`, 1], [`${jn(c.y1)}/((${jn(c.x1)}-${jn(c.r)})*(${jn(c.x1)}-${jn(c.r)}))*${jn(c.r)}*${jn(c.r)}`, 2]], unseen: [0, 2] }
        });
      }),
      H('hard-parabola-to-line', '이차함수의 그래프에서 읽은 부호로 일차함수의 그래프 따지기', '심22', (d, n) => {
        // 함정: 축이 y축의 오른쪽이면 b > 0 이라고 여기는 아이(a, b 의 부호가 다르다).
        const c = d.until(() => { const a = pm(d) * d.pick([0.5, 1]), p = pm(d) * d.int(1, 2), q = nz(d, -3, 3); return { a, p, q, c: a * p * p + q }; }, (v) => Math.abs(v.c) >= 1);
        const sa = Math.sign(c.a), sb = -Math.sign(c.a * c.p);
        if (n === 0) {
          const sets = [[0, 1, 2], [0, 1, 3], [0, 2, 3], [1, 2, 3]], want = lineQuads(sa, sb), at = sets.findIndex((s) => s.join() === want.join());
          return C(`이차함수 ${GL}의 그래프가 그림과 같을 때, 일차함수 ${nb(`${Y} = ${A}${X} + ${BB}`)}의 그래프가 지나는 사분면을 모두 고른 것은? (단, ${A}, ${BB}, ${CC}는 수이다.)`, sets.map(qset), at, {
            figure: signFig(c.a, c.p, c.q),
            explain: `${bowl(c.a)} 포물선이므로 ${cmp(A, signWord(sa))}이고, 축이 ${YA}의 ${c.p > 0 ? '오른쪽' : '왼쪽'}에 있으므로 ${A}, ${BB}의 부호가 ${c.p > 0 ? '달라' : '같아'} ${cmp(BB, signWord(sb))}이다. 기울기가 ${sa > 0 ? '양수' : '음수'}이고 ${YI}이 ${sb > 0 ? '양수' : '음수'}인 직선은 ${jw(qset(want), '을/를')} 지난다.`,
            facts: { truth: sets.map((_, i) => i === at), want: true, rule: 'h-p2l-0' }
          });
        }
        // 일차함수 y = bx + a(기울기 b, y절편 a)가 지나지 않는 사분면
        const pass = lineQuads(sb, sa), miss = [0, 1, 2, 3].find((i) => !pass.includes(i));
        return C(`이차함수 ${GL}의 그래프가 그림과 같을 때, 일차함수 ${nb(`${Y} = ${BB}${X} + ${A}`)}의 그래프가 지나지 않는 사분면은? (단, ${A}, ${BB}, ${CC}는 수이다.)`, QN, miss, {
          figure: signFig(c.a, c.p, c.q),
          explain: `${bowl(c.a)} 포물선이므로 ${cmp(A, signWord(sa))}, 축이 ${YA}의 ${c.p > 0 ? '오른쪽' : '왼쪽'}에 있으므로 ${cmp(BB, signWord(sb))}이다. ${jw(nb(`${Y} = ${BB}${X} + ${A}`), '은/는')} 기울기가 ${sb > 0 ? '양수' : '음수'}, ${YI}이 ${sa > 0 ? '양수' : '음수'}이므로 ${QN[miss]}을 지나지 않는다.`,
          facts: { truth: QN.map((_, i) => i === miss), want: true, rule: 'h-p2l-1' }
        });
      }, { count: 2 }),
      H('hard-line-to-parabola', '일차함수의 그래프에서 읽은 부호로 이차함수의 그래프 따지기', '①85 심21', (d, n) => {
        const sa = pm(d), sb = pm(d);
        if (n === 0) {
          // y = bx² + ax 의 꼭짓점: x = −a/(2b), y = −a²/(4b)
          const vx = -sa * sb, vy = -sb, at = quadOf(vx, vy);
          return C(`일차함수 ${nb(`${Y} = ${A}${X} + ${BB}`)}의 그래프가 그림과 같을 때, 이차함수 ${nb(`${Y} = ${BB}${X2} + ${A}${X}`)}의 그래프의 꼭짓점은 어느 사분면 위에 있는가? (단, ${A}, ${BB}는 수이다.)`, QN, at, {
            figure: lineFig(sa, sb),
            explain: `직선이 오른쪽 ${sa > 0 ? '위' : '아래'}로 향하므로 ${cmp(A, signWord(sa))}, ${YA}과 원점보다 ${sb > 0 ? '위' : '아래'}에서 만나므로 ${cmp(BB, signWord(sb))}이다. ${jw(nb(`${Y} = ${BB}${X2} + ${A}${X}`), '은/는')} ${bowl(sb)} 포물선이고 원점과 ${nb(`${X} = ${MINUS}${frac(A, BB)}`)}에서 ${XA}과 만난다. ${jw(nb(`${MINUS}${frac(A, BB)}`), '은/는')} ${sa * sb < 0 ? '양수' : '음수'}이므로 꼭짓점의 ${X}좌표는 ${vx > 0 ? '양수' : '음수'}이고, ${sb > 0 ? '아래로' : '위로'} 볼록하므로 꼭짓점은 ${XA}보다 ${vy > 0 ? '위' : '아래'}에 있다. 꼭짓점은 ${QN[at]} 위에 있다.`,
            facts: { truth: QN.map((_, i) => i === at), want: true, rule: 'h-l2p-0' }
          });
        }
        // y = −(x + a)² + b: 위로 볼록, 꼭짓점 (−a, b). 보기: 바른 것, 꼭짓점의 x좌표의 부호를 놓친 것, y좌표의 부호를 놓친 것, 볼록한 쪽을 놓친 것
        const cands = [[-1, -sa, sb], [-1, sa, sb], [-1, -sa, -sb], [1, -sa, sb]], order = d.shuffle([0, 1, 2, 3]);
        const small = (k, x, y, i) => fig({ small: true, name: LAB[i], x: [-3, 3], y: [-3, 3], parabolas: [{ a: k * 0.8, p: x * 1.4, q: y * 1.4 }], say: `${bowl(k)} 포물선(눈금과 수는 없다). 꼭짓점은 ${QN[quadOf(x, y)]}에 있다.` });
        return C(`일차함수 ${nb(`${Y} = ${A}${X} + ${BB}`)}의 그래프가 그림과 같을 때, 이차함수 ${nb(`${Y} = ${MINUS}(${X} + ${A})${sup(2)} + ${BB}`)}의 그래프로 알맞은 것은? (단, ${A}, ${BB}는 수이다.)`, LAB.slice(0, 4), order.indexOf(0), {
          figure: lineFig(sa, sb) + picks(order.map((j, i) => small(cands[j][0], cands[j][1], cands[j][2], i))),
          explain: `직선에서 ${cmp(A, signWord(sa))}, ${cmp(BB, signWord(sb))}이다. ${jw(nb(`${Y} = ${MINUS}(${X} + ${A})${sup(2)} + ${BB}`), '은/는')} 위로 볼록하고 꼭짓점이 ${pt(nb(`${MINUS}${A}`), BB)}이다. ${nb(`${MINUS}${A}`)}${sa > 0 ? '는 음수' : '는 양수'}, ${BB}${sb > 0 ? '는 양수' : '는 음수'}이므로 꼭짓점은 ${QN[quadOf(-sa, sb)]}에 있다.`,
          facts: { truth: order.map((j) => j === 0), want: true, rule: 'h-l2p-1' }
        });
      }, { count: 2 }),
      H('hard-swap-coef', '계수의 자리를 바꾼 이차함수의 꼭짓점', '심23', (d) => {
        // 그림에서 a, b, c 의 부호를 읽고 y = cx² + bx + a 의 볼록한 쪽·축·y절편을 다시 따진다. a 와 c 의 부호가 달라야 꼭짓점의 자리가 정해진다.
        const c = d.until(() => { const a = pm(d) * d.pick([0.5, 1]), p = pm(d) * d.int(1, 2), q = nz(d, -3, 3); return { a, p, q, c: a * p * p + q }; }, (v) => Math.abs(v.c) >= 1 && Math.sign(v.c) !== Math.sign(v.a));
        const sa = Math.sign(c.a), sb = -Math.sign(c.a * c.p), sc = Math.sign(c.c), vx = -sb * sc, vy = sa, at = quadOf(vx, vy);
        return C(`이차함수 ${GL}의 그래프가 그림과 같을 때, 이차함수 ${nb(`${Y} = ${CC}${X2} + ${BB}${X} + ${A}`)}의 그래프의 꼭짓점은 어느 사분면 위에 있는가? (단, ${A}, ${BB}, ${CC}는 수이다.)`, QN, at, {
          figure: signFig(c.a, c.p, c.q),
          explain: `그림에서 ${cmp(A, signWord(sa))}, ${cmp(BB, signWord(sb))}, ${cmp(CC, signWord(sc))}이다. ${jw(nb(`${Y} = ${CC}${X2} + ${BB}${X} + ${A}`), '은/는')} ${bowl(sc)} 포물선이고, ${CC}와 ${BB}의 부호가 ${sb === sc ? '같으므로 축은 y축의 왼쪽' : '다르므로 축은 y축의 오른쪽'}에 있으며, ${YA}과 원점보다 ${sa > 0 ? '위' : '아래'}에서 만난다. ${sc > 0 ? '아래로' : '위로'} 볼록한데 ${YA}과 만나는 점이 원점보다 ${sa > 0 ? '위' : '아래'}이므로 꼭짓점도 ${XA}보다 ${sa > 0 ? '위' : '아래'}에 있다. 꼭짓점은 ${QN[at]} 위에 있다.`,
          facts: { truth: QN.map((_, i) => i === at), want: true }
        });
      }),
      H('hard-bisect', '삼각형의 넓이를 이등분하는 직선의 기울기', '심20', (d) => {
        // 함정: 넓이를 반으로 나누는 직선이 밑변의 중점을 지난다는 것(높이가 같은 두 삼각형)을 대지 못하는 아이.
        const c = d.until(() => { const a = pm(d) * d.int(1, 2), r1 = d.int(-6, -1), r2 = d.int(1, 6); const g = { a, b: -a * (r1 + r2), c: a * r1 * r2 }; return Object.assign(g, { r1, r2, mid: (r1 + r2) / 2 }); }, (v) => v.mid !== 0 && Number.isInteger(v.mid) && v.c % v.mid === 0);
        const m = -c.c / c.mid;
        return N(`이차함수 ${gen(c.a, c.b, c.c)}의 그래프가 ${XA}과 만나는 두 점을 A, B, ${YA}과 만나는 점을 C라 하자. 점 C를 지나는 직선 ${jw(nb(`${Y} = ${MM}${X} + ${NN}`), '이/가')} 삼각형 ABC의 넓이를 이등분할 때, ${MM}의 값은?`, m, { signed: true,
          explain: `${isj(Y, 0, '을/를')} 대입하면 ${is(X, c.r1)} 또는 ${is(X, c.r2)}이고 C${pt(0, c.c)}이다. 점 C를 지나는 직선이 넓이를 이등분하려면 선분 AB의 중점 ${jw(pt(c.mid, 0), '을/를')} 지나야 한다(두 삼각형의 높이가 같다). 기울기는 ${nb(`${frac(`${iq(c.c)} − 0`, `0 − ${par(c.mid)}`)} = ${iq(m)}`)}이다.`,
          facts: { value: `2*${jn(c.a)}*${jn(c.c)}/${jn(c.b)}`, unseen: [1, 2] }
        });
      }),
      // ── ② 세 단계 넘게 이어 생각해야 풀리는 문제 ──
      H('hard-all-quadrants', '모든 사분면을 지나는 a의 값의 범위', '기본 ①47', (d) => {
        // 볼록한 쪽(꼭짓점의 y좌표 부호로) → y절편의 부호 → y절편 a·p² + q 의 범위, 세 단계
        const p = nz(d, -4, 4), q = d.until(() => nz(d, -9, 9), (v) => v * v !== p * p * p * p), t = Q(Math.abs(q), p * p), it = Q(p * p, Math.abs(q));
        const lt = (lo, hi) => nb(`${lo} &lt; ${A} &lt; ${hi}`), gtx = (v) => nb(`${A} &gt; ${v}`), ltx = (v) => nb(`${A} &lt; ${v}`);
        const rows = q < 0
          ? [[lt('0', iq(t)), true], [gtx(iq(t)), false], [gtx('0'), false], [lt(iq(qneg(t)), '0'), false], [lt('0', iq(it)), false]]
          : [[lt(iq(qneg(t)), '0'), true], [ltx(iq(qneg(t))), false], [ltx('0'), false], [lt('0', iq(t)), false], [lt(iq(qneg(it)), '0'), false]];
        const opts = d.shuffle(rows);
        return C(`이차함수 ${GL}의 그래프의 꼭짓점의 좌표가 ${pt(p, q)}이다. 이 그래프가 모든 사분면을 지날 때, 수 ${A}의 값의 범위는?`, opts.map((r) => r[0]), opts.findIndex((r) => r[1]), {
          explain: `꼭짓점이 ${QN[quadOf(p, q)]}에 있으므로 모든 사분면을 지나려면 ${q < 0 ? '아래로' : '위로'} 볼록해야 하고(${cmp(A, q < 0 ? GT : LT)}), ${YA}과 원점보다 ${q < 0 ? '아래' : '위'}에서 만나야 한다. 식은 ${nb(`${Y} = ${A}(${X} ${sgn(-p)})${sup(2)} ${sgn(q)}`)}이므로 ${YI}은 ${nb(`${ka(p * p, A)} ${sgn(q)}`)}이고, ${nb(`${ka(p * p, A)} ${sgn(q)} ${q < 0 ? '&lt;' : '&gt;'} 0`)}에서 ${q < 0 ? lt('0', iq(t)) : lt(iq(qneg(t)), '0')}이다.`,
          facts: { truth: opts.map((r) => r[1]), want: true }
        });
      }),
      H('hard-vertex-on-parabola', '문자가 든 꼭짓점이 다른 포물선 위에 있을 때', '심5', (d) => {
        // y = s(x − p)² + kp + m 의 꼭짓점 (p, kp + m)이 y = Ax² + Bx + C 위: A p² + (B − k)p + (C − m) = 0
        const c = d.until(() => { const s = pm(d), k = nz(d, -3, 3), m = d.int(-3, 3), A_ = d.pick([1, 2, -1]), r1 = nz(d, -4, 4), r2 = nz(d, -4, 4); return { s, k, m, A_, r1, r2, B_: k - A_ * (r1 + r2), C_: m + A_ * r1 * r2 }; }, (v) => v.r1 !== v.r2 && v.r1 + v.r2 !== 0 && v.B_ !== 0 && v.C_ !== 0);
        const first = `${term(c.s, X2, true)}${term(-2 * c.s, P + X)}${term(c.s, P + sup(2))}${term(c.k, P)}${term(c.m, '')}`;
        return inline(`이차함수 ${nb(`${Y} = ${first}`)}의 그래프의 꼭짓점이 이차함수 ${gen(c.A_, c.B_, c.C_)}의 그래프 위에 있을 때, 수 ${P}의 값을 모두 구하시오.`, `${P} = {0} 또는 ${P} = {1}`, [{ answer: c.r1, signed: true }, { answer: c.r2, signed: true }], {
          unordered: true, shown: `${is(P, c.r1)} 또는 ${is(P, c.r2)}`,
          explain: `고치면 ${nb(`${Y} = ${c.s < 0 ? MINUS : ''}(${X} ${MINUS} ${P})${sup(2)}${term(c.k, P)}${term(c.m, '')}`)}이므로 꼭짓점은 ${pt(P, nb(`${term(c.k, P, true)}${term(c.m, '')}`))}이다. ${gen(c.A_, c.B_, c.C_)}에 대입하면 ${nb(`${term(c.k, P, true)}${term(c.m, '')} = ${term(c.A_, P + sup(2), true)}${term(c.B_, P)}${term(c.C_, '')}`)}, ${nb(`${coefText(c.A_)}(${P} ${sgn(-c.r1)})(${P} ${sgn(-c.r2)}) = 0`)}에서 ${is(P, c.r1)} 또는 ${is(P, c.r2)}이다.`,
          facts: { calc: [[jn(c.r1), 0], [jn(c.r2), 1]], unseen: [Math.abs(c.r1), Math.abs(c.r2)] }
        });
      }),
      H('hard-vertex-on-parabola-two', '꼭짓점이 포물선 위에 있도록 하는 두 문자(제곱의 합)', '심6', (d) => {
        const k = d.pick([2, 3, -1, -2]), s = nz(d, -4, 4), t = nz(d, -4, 4);
        const first = `${term(k, X2, true)}${term(-2 * k, A + X)}${term(k, A + sup(2))} ${MINUS} ${BB}${sup(2)}${term(2 * t, BB)}`;
        return vals(`이차함수 ${nb(`${Y} = ${first}`)}의 그래프의 꼭짓점이 포물선 ${gen(1, -2 * s, s * s + t * t)} 위에 있도록 하는 수 ${A}, ${BB}의 값은?`, [[A, s], [BB, t]], {
          explain: `고치면 ${nb(`${Y} = ${coefText(k)}(${X} ${MINUS} ${A})${sup(2)} ${MINUS} ${BB}${sup(2)}${term(2 * t, BB)}`)}이므로 꼭짓점은 ${pt(A, nb(`${MINUS}${BB}${sup(2)}${term(2 * t, BB)}`))}이다. 포물선의 식에 대입하여 정리하면 ${nb(`(${A} ${sgn(-s)})${sup(2)} + (${BB} ${sgn(-t)})${sup(2)} = 0`)}이다. 제곱한 두 수의 합이 0이면 두 수가 모두 0이므로 ${is(A, s)}, ${is(BB, t)}이다.`,
          facts: { calc: [[`0-${jn(-2 * s)}/2`, 0], [`${jn(2 * t)}/2`, 1]], unseen: [0, 2] }
        });
      }),
      H('hard-point-and-line', '한 점을 지나고 꼭짓점이 직선 위에 있을 때', '심7', (d) => {
        const c = d.until(() => { const a0 = nz(d, -4, 4), x0 = nz(d, -4, 4), m = 2 * x0 - 2 * a0; return { a0, x0, m, y0: x0 * x0 - a0 * a0, b: m * a0 + a0 * a0 }; }, (v) => v.m !== 0 && v.b !== 0 && v.y0 !== 0 && Math.abs(v.m) <= 8);
        const aE = `(2*${jn(c.x0)}-${jn(c.m)})/2`;
        return vals(`이차함수 ${nb(`${Y} = ${X2} ${MINUS} 2${A}${X} + ${BB}`)}의 그래프가 점 ${ptj(c.x0, c.y0, '을/를')} 지나고 꼭짓점이 직선 ${nb(`${Y} = ${term(c.m, X, true)}`)} 위에 있을 때, 수 ${A}, ${BB}의 값은?`, [[A, c.a0], [BB, c.b]], {
          explain: `꼭짓점은 ${pt(A, nb(`${BB} ${MINUS} ${A}${sup(2)}`))}이므로 ${nb(`${BB} ${MINUS} ${A}${sup(2)} = ${ka(c.m, A)}`)}이다. 점의 좌표를 대입하면 ${nb(`${iq(c.y0)} = ${c.x0 * c.x0} ${c.x0 > 0 ? MINUS : '+'} ${ka(2 * Math.abs(c.x0), A)} + ${BB}`)}이다. 두 식에서 ${BB}를 없애면 ${nb(`(${A} ${sgn(-c.a0)})${sup(2)} = 0`)}이므로 ${is(A, c.a0)}, ${is(BB, c.b)}이다.`,
          facts: { calc: [[aE, 0], [`${jn(c.m)}*${aE}+${aE}*${aE}`, 1]], unseen: [2] }
        });
      }),
      H('hard-dice-prob', '주사위로 정한 계수의 그래프와 꼭짓점이 같을 확률', '심8', (d) => {
        // y = ax² − bx + c 의 꼭짓점 (b/2a, c − b²/4a) 가 (h, 0): b = 2ah, c = ah²
        const h = d.pick([1, 1, 2]), k = d.pick([1, 2, 3]), outs = [];
        for (let a = 1; a <= 6; a += 1) if (2 * a * h <= 6 && a * h * h <= 6) outs.push([a, 2 * a * h, a * h * h]);
        const n = outs.length, g = gcd(n, 216);
        return F(`주사위를 세 번 던져서 나오는 눈의 수를 차례로 ${A}, ${BB}, ${CC}라 할 때, 두 이차함수 ${nb(`${Y} = ${A}${X2} ${MINUS} ${BB}${X} + ${CC}`)}, ${gen(k, -2 * k * h, k * h * h)}의 그래프의 꼭짓점이 서로 같을 확률은?`, n / g, 216 / g, { anyForm: true,
          explain: `${jw(gen(k, -2 * k * h, k * h * h), '은/는')} ${std(k, h, 0)}이므로 꼭짓점은 ${pt(h, 0)}이다. ${nb(`${Y} = ${A}${X2} ${MINUS} ${BB}${X} + ${CC}`)}의 꼭짓점이 ${pt(h, 0)}이려면 ${nb(`${Y} = ${A}(${X} ${sgn(-h)})${sup(2)}`)}, 곧 ${nb(`${BB} = ${ka(2 * h, A)}`)}, ${nb(`${CC} = ${ka(h * h, A)}`)}이어야 한다. 이런 경우는 ${outs.map((o) => `(${o.join(', ')})`).join(', ')}의 ${n}가지이고 모든 경우는 216가지이므로 확률은 ${frac(n / g, 216 / g)}이다.`,
          facts: { value: `${n}/216`, unseen: [n, 216] }
        });
      }),
      H('hard-xints-vertexy', '두 x절편과 꼭짓점의 y좌표로 식 구하기', '심12', (d) => {
        // 축은 두 x절편의 가운데 → 꼭짓점 → a → 전개
        const c = d.until(() => { const a = pm(d) * d.int(1, 3), hh = d.int(1, 2), mid = nz(d, -4, 4); const r1 = mid - hh, r2 = mid + hh, k = -a * hh * hh; return { a, hh, mid, r1, r2, k, g: { a, b: -a * (r1 + r2), c: a * r1 * r2 } }; }, (v) => !hasZero(v.g) && v.r1 !== 0 && v.r2 !== 0);
        const aE = `${jn(c.k)}/(0-(${jn(c.r2)}-${jn(c.r1)})*(${jn(c.r2)}-${jn(c.r1)})/4)`;
        return genAns(`${XA}과 두 점 ${pt(c.r1, 0)}, ${pt(c.r2, 0)}에서 만나고 꼭짓점의 ${Y}좌표가 ${iq(c.k)}인 포물선을 그래프로 하는 이차함수의 식을 ${GL}의 꼴로 나타내시오.`, c.g.a, c.g.b, c.g.c, {
          explain: `두 교점은 축에 대칭이므로 축은 ${is(X, c.mid)}이고 꼭짓점은 ${pt(c.mid, c.k)}이다. 식을 ${jw(nb(`${Y} = ${A}(${X} ${sgn(-c.r1)})(${X} ${sgn(-c.r2)})`), '으로/로')} 놓고 ${put(c.mid, c.k)} ${nb(`${iq(c.k)} = ${ka(-c.hh * c.hh, A)}`)}, ${is(A, c.a)}이다. 전개하면 ${gen(c.g.a, c.g.b, c.g.c)}이다.`,
          facts: { calc: [[aE, 0], [`0-${aE}*(${jn(c.r1)}+${jn(c.r2)})`, 1], [`${aE}*${jn(c.r1)}*${jn(c.r2)}`, 2]], unseen: [0, 4] }
        });
      }),
      H('hard-line-points-formula', '직선의 두 절편과 x축 위 다른 점을 지나는 식', '심15', (d) => {
        const c = d.until(() => { const m = d.pick([1, -1, 2, -2]), xA = nz(d, -4, 4), c1 = d.pick([1, -1, 2, -2].filter((v) => Math.abs(m) % Math.abs(v) === 0)); const n = -m * xA, a = -m / c1; return { m, xA, c1, n, a, g: { a, b: -a * (xA + c1), c: n } }; }, (v) => v.c1 !== v.xA && Number.isInteger(v.a) && !hasZero(v.g));
        return genAns(`직선 ${nb(`${Y} = ${term(c.m, X, true)} ${sgn(c.n)}`)}${tail(Math.abs(c.n), '이/가')} ${XA}, ${YA}과 만나는 점을 각각 A, B라 하자. 이차함수 ${GL}의 그래프가 두 점 A, B와 ${XA} 위의 점 C${jw(pt(c.c1, 0), '을/를')} 지날 때, 이 이차함수의 식을 ${GL}의 꼴로 나타내시오.`, c.g.a, c.g.b, c.g.c, {
          explain: `직선에서 A${pt(c.xA, 0)}, B${pt(0, c.n)}이다. ${XA}과 두 점 A, C에서 만나므로 식을 ${jw(nb(`${Y} = ${A}(${X} ${sgn(-c.xA)})(${X} ${sgn(-c.c1)})`), '으로/로')} 놓고, 점 B를 대입하면 ${nb(`${iq(c.n)} = ${ka(c.xA * c.c1, A)}`)}, ${is(A, c.a)}이다. 전개하면 ${gen(c.g.a, c.g.b, c.g.c)}이다.`,
          facts: { calc: [[`0-${jn(c.m)}/${jn(c.c1)}`, 0], [`${jn(c.m)}/${jn(c.c1)}*((0-${jn(c.n)})/${jn(c.m)}+${jn(c.c1)})`, 1], [jn(c.n), 2]], unseen: [0, 1] }
        });
      }),
      H('hard-tri-horizontal', '꼭짓점과 직선 y = k의 두 교점으로 만든 삼각형', '심19', (d) => {
        const c = d.until(() => { const a = pm(d), p = nz(d, -4, 4), q = d.int(-9, 9), h = d.int(2, 5), g = genOf(a, p, q); return { a, p, q, h, g, k: q + a * h * h }; }, (v) => v.g.b !== 0 && v.k !== 0 && Math.abs(v.k) <= 30);
        const area = c.h * c.h * c.h, qE = `(${jn(c.g.c)}-${jn(c.g.b)}*${jn(c.g.b)}/(4*${jn(c.a)}))`;
        return N(`이차함수 ${gen(c.g.a, c.g.b, c.g.c)}의 그래프의 꼭짓점을 A라 하고, 이 그래프와 직선 ${is(Y, c.k)}의 두 교점을 B, C라 할 때, 삼각형 ABC의 넓이는?`, area, {
          explain: `고치면 ${std(c.a, c.p, c.q)}이므로 A${pt(c.p, c.q)}이다. ${isj(Y, c.k, '을/를')} 대입하면 ${nb(`(${X} ${sgn(-c.p)})${sup(2)} = ${c.h * c.h}`)}, ${is(X, c.p - c.h)} 또는 ${is(X, c.p + c.h)}이므로 선분 BC의 길이는 ${2 * c.h}이다. 높이는 ${Math.abs(c.k - c.q)}이므로 넓이는 ${nb(`${frac(1, 2)} × ${2 * c.h} × ${Math.abs(c.k - c.q)} = ${area}`)}이다.`,
          facts: { value: `${c.h}*(${c.a > 0 ? `${jn(c.k)}-${qE}` : `${qE}-${jn(c.k)}`})`, unseen: [c.h, 4, 1, 0] }
        });
      }),
      H('hard-double-root-locus', '중근 조건에서 나온 이차함수의 꼭짓점', '심9', (d) => {
        // a² − 2(x − s)a + (tx + y + u) = 0 이 중근을 가지면 tx + y + u = (x − s)², 곧 y = x² − (2s + t)x + s² − u
        const c = d.until(() => { const s = nz(d, -3, 3), t = 2 * nz(d, -2, 2), u = nz(d, -5, 5); const vx = (2 * s + t) / 2; return { s, t, u, vx, vy: s * s - u - vx * vx }; }, (v) => v.vx !== 0 && v.vy !== 0);
        return pointAns(`${A}에 대한 이차방정식 ${jw(nb(`${A}${sup(2)} ${MINUS} 2(${X} ${sgn(-c.s)})${A}${term(c.t, X)} + ${Y}${term(c.u, '')} = 0`), '이/가')} 중근을 가질 때, ${X}와 ${Y} 사이의 관계를 나타낸 이차함수의 그래프의 꼭짓점의 좌표는?`, c.vx, c.vy, {
          explain: `${A}에 대한 이차방정식이 중근을 가지려면 좌변이 완전제곱식이어야 하므로 상수항이 ${A}의 계수의 절반의 제곱과 같다: ${nb(`${term(c.t, X, true)} + ${Y}${term(c.u, '')} = (${X} ${sgn(-c.s)})${sup(2)}`)}. 정리하면 ${gen(1, -(2 * c.s + c.t), c.s * c.s - c.u)}이고, 고치면 ${std(1, c.vx, c.vy)}이므로 꼭짓점의 좌표는 ${pt(c.vx, c.vy)}이다.`,
          facts: { calc: [[`(2*${jn(c.s)}+${jn(c.t)})/2`, 0], [`${jn(c.s)}*${jn(c.s)}-${jn(c.u)}-(2*${jn(c.s)}+${jn(c.t)})*(2*${jn(c.s)}+${jn(c.t)})/4`, 1]], unseen: [2, 4] }
        });
      })
    ]
  });
  // 받는 쪽에서 덧붙임(2026-10-16): 심28 — x축과 서로 다른 두 점에서 만나는 것을 꼭짓점의 y좌표로 따진다(판별식을 쓰지 않는다).
  B.addTypes('9-1-6', 'hard', [
    H('hard-point-two-meet', '지나는 점으로 구한 두 값 가운데 x축과 두 점에서 만나는 것', '심28', (d) => {
      // y = mx² + nx + a 가 점 (a, a² + s)를 지난다: (m − 1)a² + (n + 1)a − s = 0 의 두 근 r1(음의 정수), r2 가운데 꼭짓점의 y좌표 a − n²/(4m) 이 음수인 것은 r1 뿐이다.
      const c = d.until(() => {
        const m = d.int(2, 4), n = nz(d, -4, 4), r1 = -d.int(1, 4), r2 = qsub(Q(-(n + 1), m - 1), Q(r1));
        return { m, n, r1, r2, s: qmul(Q(-(m - 1) * r1), r2), cut: Q(n * n, 4 * m) };
      }, (v) => v.n !== -1 && isInt(v.s) && v.s.p !== 0 && Math.abs(v.s.p) <= 30 && fl(v.r2) > fl(v.cut) && Math.abs(fl(v.r2)) <= 6);
      const s = c.s.p, lead = nb(`${Y} = ${c.m}${X2}${term(c.n, X)} + ${A}`);
      return N(`이차함수 ${lead}의 그래프가 점 ${nb(`(${A}, ${A}${sup(2)} ${sgn(s)})`)}${tail(Math.abs(s), '을/를')} 지나고 ${XA}과 서로 다른 두 점에서 만날 때, 수 ${A}의 값은?`, c.r1, { signed: true,
        explain: `점을 지나므로 ${nb(`${c.m}${A}${sup(2)}${term(c.n, A)} + ${A} = ${A}${sup(2)} ${sgn(s)}`)}, 곧 ${nb(`${term(c.m - 1, A + sup(2), true)}${term(c.n + 1, A)} ${sgn(-s)} = 0`)}이다. 이것을 풀면 ${is(A, c.r1)} 또는 ${is(A, c.r2)}이다. `
          + `${jw(lead, '을/를')} 고치면 ${nb(`${Y} = ${c.m}(${X} ${sgn(Q(c.n, 2 * c.m))})${sup(2)} + ${A} ${MINUS} ${iq(c.cut)}`)}이고 그래프가 아래로 볼록하므로, ${XA}과 서로 다른 두 점에서 만나려면 꼭짓점의 ${Y}좌표가 0보다 작아야 한다. ${nb(`${A} ${LT} ${iq(c.cut)}`)}이므로 ${is(A, c.r1)}이다.`,
        facts: { value: String(c.r1), unseen: [Math.abs(c.r1)] }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
