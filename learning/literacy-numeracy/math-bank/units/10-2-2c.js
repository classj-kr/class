// 고등학교 1학년 2학기 2단원 원의 방정식 — 실력 문항.
// 단원 틀과 도구, 싣는 기준, 뺀 것과 까닭은 10-2-2a.js 에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 ①의 장치는 이 잘못을 가진 아이가 걸리게 만들었다)
//  - 두 좌표축에 접하는 원의 중심을 (r, r)로만 놓는다 — 중심이 제2·4사분면에 있으면 (−r, r), (r, −r)이다(|x좌표| = |y좌표|의 두 갈래).
//  - 원 밖의 점에서 그은 접선을 기울기 m 으로 놓고 풀어 하나만 구한다 — 원 밖의 점에서 그은 접선은 늘 둘이고, 하나가 y축에 평행하면 기울기로 놓은 식에서 빠진다.
//    기울기 공식 y = mx ± r√(m² + 1)에 ± 를 모두 붙여 넷을 답으로 적는다 — 그 점을 지나는지 확인해야 한다.
//  - 원이 원점을 지나는지 보지 않고 「원점과 접선 사이의 거리」를 중심까지의 거리 ± 반지름으로 셈한다.
//  - 조건 둘(원점을 지난다, 두 점에서 만난다)을 따로 쓰지 않고 첫 조건에서 나온 두 값을 모두 쓴다.
//  - 「두 직선에서 같은 거리에 있는 점」이 두 직선의 교점을 지나는 기울기 ±1 직선 위에 있다는 것을 쓰지 않고, 근이 없는 갈래를 버리지 않는다.
//
// 실력에는 ① 문제의 식·그림·상황에 함정이 있어 뜻을 정확히 대야 풀리는 문제와 ② 세 단계 넘게 이어 생각해야 풀리는 문제만 실었다.
// 수집본 기본 문서에 여러 번 나오는 꼴(두 축에 접하고 한 점을 지나는 원, 원 밖의 점에서 그은 접선, 두 접선의 기울기의 합과 곱, 두 접선이 이루는 각의 이등분선,
// 가장 작은 원, 넓이를 이등분하는 직선)은 기본 묶음에 두었다. 대단원 기출 모의고사의 꼴(심2·심3)은 실력에 두었다.
// 「꼬여 있다」는 까닭으로 빼지 않은 것: 중심이 포물선 위에 있는 원(①23 — 근이 없는 갈래를 버린다), 원과 반원으로 이루어진 도형과 직선(②45).
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, N, M, C, F, inline } = B.kit;
  const { LAB, MINUS, gcd, lcm, Q, qneg, mag, tx, nb, tail, js, V, sup, nz, pm, asQ, poly, pointAns, ansV, rt, grp, sqParts, radText, whereOnPlane, f1 } = B.kit.mid;
  const K = B.kit.m1022;
  const { S04, S05, H, X, Y, X2, Y2, VA, VB, VC, VK, VM, VN, VR, iq, jn, sgn, cx, pt, P2, sqT, stdL, stdE, genL, genE, toGen, lineY, lineG, ej, NOTE1, isSq, sqf, lattice, PYTH,
    circAns, valsQ, twoValsAns, radNum, rootText, fig, figOk, AXIS } = K;
  const G = B.kit.mgeo;
  const circ0 = (R) => stdE(0, 0, R);
  const absE = (e, v) => (v < 0 ? `(0-(${e}))` : `(${e})`);
  // 직선의 글(기울기가 없으면 x = p)
  const lineText = (l) => (l.x != null ? nb(`${X} = ${iq(l.x)}`) : lineY(l.m, l.n));
  const setText = (list) => (list.length === 1 ? `${lineText(list[0])} 하나뿐이다` : list.map(lineText).join(', '));

  B.addGroup('10-2-2', {
    id: 'hard', title: '단원 종합', standard: S05,
    types: [
      // ── ① 식·그림·상황에 함정이 있어 뜻을 정확히 대야 풀리는 문제 ──
      H('hard-center-line-axes', '중심이 직선 위에 있고 두 좌표축에 동시에 접하는 원', '①22', (d) => {
        // 함정: 중심을 (r, r)로만 놓아 제2·4사분면의 원을 빠뜨리는 아이.
        const p = nz(d, -3, 3), q = nz(d, -3, 3), w = d.int(1, 2);
        if (p + q === 0 || p - q === 0 || gcd(Math.abs(p), Math.abs(q)) !== 1) return null;
        const c = lcm(Math.abs(p + q), Math.abs(p - q)) * w * pm(d), t1 = c / (p + q), t2 = c / (p - q);
        if (Math.abs(t1) === Math.abs(t2) || Math.abs(t1) > 15 || Math.abs(t2) > 15) return null;
        const r1 = Math.abs(t1), r2 = Math.abs(t2);
        return M(`중심이 직선 ${nb(`${poly([[p, X], [q, Y]])} = ${iq(c)}`)} 위에 있고 ${AXIS.x}과 ${AXIS.y}에 동시에 접하는 원은 두 개이다. 두 원의 반지름의 길이를 각각 구하시오.`, [{ answer: Math.min(r1, r2) }, { answer: Math.max(r1, r2) }], {
          unordered: true, shown: `${Math.min(r1, r2)}, ${Math.max(r1, r2)}`,
          explain: `두 축에 동시에 접하는 원의 중심은 ${X}좌표와 ${Y}좌표의 절댓값이 같으므로 직선 ${nb(`${Y} = ${X}`)} 또는 ${nb(`${Y} = ${MINUS}${X}`)} 위에 있다. 중심을 ${pt(VA, VA)}로 놓으면 ${nb(`${VA} = ${iq(t1)}`)}, ${pt(VA, MINUS + VA)}로 놓으면 ${nb(`${VA} = ${iq(t2)}`)}이다. 따라서 두 원의 중심은 ${pt(t1, t1)}, ${pt(t2, -t2)}이고 반지름의 길이는 ${r1}, ${r2}이다. ${nb(`${Y} = ${MINUS}${X}`)} 쪽(제2·4사분면)의 원을 빠뜨리지 않아야 한다.`,
          facts: { calc: [[Math.abs(t1) < Math.abs(t2) ? absE(`${jn(c)}/(${jn(p)}+${jn(q)})`, t1) : absE(`${jn(c)}/(${jn(p)}-${jn(q)})`, t2), 0], [Math.abs(t1) < Math.abs(t2) ? absE(`${jn(c)}/(${jn(p)}-${jn(q)})`, t2) : absE(`${jn(c)}/(${jn(p)}+${jn(q)})`, t1), 1]] }
        });
      }, { standard: S04 }),
      H('hard-tangent-missing', '원 밖의 점에서 그은 접선을 모두 고르기', '②59', (d, n) => {
        if (n === 0) {
          // 함정: 접선을 기울기 m 으로 놓아 y축에 평행한 접선 x = p 를 빠뜨리는 아이.
          const r = d.int(1, 2), sg = pm(d), p = sg * r, q = nz(d, -4, 4), R = r * r;
          if (Math.abs(q) === r) return null;
          const m = Q(q * q - R, 2 * p * q), nn = Q(q * q + R, 2 * q);
          const good = [{ x: p }, { m, n: nn }], rows = [[good, true], [[{ m, n: nn }], false], [[{ m, n: nn }, { m: qneg(m), n: nn }], false], [[{ x: p }, { m: Q(0), n: Q(q) }], false]];
          const order = d.shuffle([0, 1, 2, 3]);
          return C(`점 ${ej(pt(p, q), '에서/에서').slice(0, -2)}에서 원 ${ej(circ0(R), '에/에')} 그은 접선을 모두 구한 것은?`, order.map((i) => setText(rows[i][0])), order.indexOf(0), {
            explain: `접선의 기울기를 ${VM}이라 하고 거리 조건으로 풀면 ${nb(`${VM} = ${iq(m)}`)} 하나만 나온다. 그러나 원 밖의 점에서 그은 접선은 늘 두 개이다. 점 ${ej(pt(p, q), '을/를')} 지나고 ${AXIS.y}에 평행한 직선 ${ej(nb(`${X} = ${iq(p)}`), '은/는')} 원점과의 거리가 ${r}이므로 원에 접한다(기울기가 없어 기울기로 놓은 식에서 빠진다). 따라서 접선은 ${nb(`${X} = ${iq(p)}`)}, ${ej(lineY(m, nn), '이다/이다').slice(0, -2)}이다.`,
            facts: { truth: order.map((i) => rows[i][1]), want: true, rule: 'tm-0' }
          });
        }
        // 함정: y = mx ± r√(m² + 1)에 ± 를 모두 붙여 넷을 답으로 적는 아이.
        const [aa, l1, l2] = d.pick([[5, 3, 4], [5, 4, 3], [13, 5, 12], [13, 12, 5], [10, 6, 8], [10, 8, 6]]), sx = pm(d), p = sx * aa, R = l1 * l1, m = Q(l1, l2), c0 = Q(l1 * aa, l2);
        const L = (s1, s2) => ({ m: s1 > 0 ? m : qneg(m), n: s2 > 0 ? c0 : qneg(c0) });
        // 점 (p, 0)을 지나는 것: y = m(x − p) → 기울기 +m 이면 절편 −mp
        const right = [L(1, -sx), L(-1, sx)], all4 = [L(1, 1), L(1, -1), L(-1, 1), L(-1, -1)];
        const rows = [[right, true], [all4, false], [[L(1, sx), L(-1, -sx)], false], [[L(1, -sx)], false]];
        const order = d.shuffle([0, 1, 2, 3]);
        return C(`점 ${ej(pt(p, 0), '에서/에서').slice(0, -2)}에서 원 ${ej(circ0(R), '에/에')} 그은 접선을 모두 구한 것은?`, order.map((i) => setText(rows[i][0])), order.indexOf(0), {
          explain: `기울기가 ${VM}인 접선 ${nb(`${Y} = ${VM}${X} ± ${l1}${rt(`${VM}${sup(2)} + 1`)}`)}이 점 ${ej(pt(p, 0), '을/를')} 지나도록 풀면 ${nb(`${VM} = ±${iq(m)}`)}이다. 이때 ± 를 모두 붙인 네 직선 가운데 점 ${ej(pt(p, 0), '을/를')} 지나는 것은 둘뿐이다. 원 밖의 점에서 그은 접선은 두 개이므로 ${lineText(right[0])}, ${ej(lineText(right[1]), '이다/이다').slice(0, -2)}이다.`,
          facts: { truth: order.map((i) => rows[i][1]), want: true, rule: 'tm-1' }
        });
      }, { count: 2 }),
      H('hard-tangent-dist-origin', '원점을 지나는 원의 접선과 원점 사이의 거리의 최댓값', '②67', (d) => {
        // 함정: 원이 원점을 지난다(R = p² + q²)는 것을 보지 못하고 중심까지의 거리 ± 반지름으로 셈하는 아이.
        const p = nz(d, -4, 4), q = nz(d, -4, 4), R = p * p + q * q, [k, s] = sqParts(R);
        if (s === 1) return null;
        return radNum(`원 ${stdE(p, q, R)} 위의 점 P에서의 접선을 ${V('l')}이라 할 때, 원점과 직선 ${V('l')} 사이의 거리의 최댓값은?`, 2 * k, s, {
          explain: `${nb(`${iq(p * p)} + ${iq(q * q)} = ${R}`)}이므로 이 원은 원점을 지난다. 원 위의 한 점(원점)과 점 P에서의 접선 사이의 거리는 점 P가 원점의 맞은편(원점을 지나는 지름의 다른 끝)에 있을 때 가장 크고, 그때의 거리는 지름의 길이와 같다. 반지름의 길이가 ${radText(k, s)}이므로 최댓값은 ${radText(2 * k, s)}이다.`,
          facts: { calc: [[`2*(${R}/${s})**0.5`, 0], [String(s), 1]], derived: [s] }
        });
      }),
      H('hard-two-cond-chord', '두 조건으로 미지수를 고른 뒤 원과 직선이 만나는 두 점 사이의 거리', '②42 심3', (d) => {
        // 함정: 「원점을 지난다」에서 나온 두 값 가운데 「두 점에서 만난다」에 맞지 않는 것을 버리지 않는 아이.
        const p = nz(d, -4, 4), s = d.int(2, 5), t = d.int(-8, 8), R = p * p + s * s, sg = pm(d), a = sg * s, other = -a;
        if ((t - a) ** 2 >= R || (t - other) ** 2 < R || t === 0) return null;
        const [k, q] = sqParts(4 * (R - (t - a) ** 2));
        if (k < 2 || q < 2) return null;
        const left = poly([[1, X2], [1, Y2], [-2 * p, X], [-2, VA + Y], [1, VA + sup(2)], [-s * s, '']]);
        return radNum(`원 ${V('C')}: ${nb(`${left} = 0`)}이 다음 조건을 만족시킬 때, 원 ${ej(V('C'), '과/와')} 직선 ${ej(nb(`${Y} = ${iq(t)}`), '이/가')} 만나는 두 점 사이의 거리는? (단, ${VA}는 상수이다.)<br>(가) 원 ${ej(V('C'), '은/는')} 원점을 지난다.<br>(나) 원 ${ej(V('C'), '은/는')} 직선 ${ej(nb(`${Y} = ${iq(t)}`), '과/와')} 서로 다른 두 점에서 만난다.`, k, q, {
          explain: `(가)에서 ${nb(`${VA}${sup(2)} ${MINUS} ${s * s} = 0`)}, ${nb(`${VA} = ±${s}`)}이다. 원은 ${nb(`${sqT(X, p)} + (${Y} ${MINUS} ${VA})${sup(2)} = ${R}`)}이다. ${nb(`${VA} = ${iq(other)}`)}이면 중심 ${ej(pt(p, other), '과/와')} 직선 ${nb(`${Y} = ${iq(t)}`)} 사이의 거리가 ${ej(String(Math.abs(t - other)), '으로/로')} 반지름의 길이 ${rootText(R)}보다 작지 않아 (나)를 만족시키지 않는다. 따라서 ${nb(`${VA} = ${iq(a)}`)}이고, 중심에서 직선까지의 거리는 ${Math.abs(t - a)}이므로 두 점 사이의 거리는 ${nb(`2${rt(`${R} ${MINUS} ${(t - a) ** 2}`)} = ${radText(k, q)}`)}이다.`,
          facts: { calc: [[`((${R}-(${jn(t)}-${jn(a)})*(${jn(t)}-${jn(a)}))*4/${q})**0.5`, 0], [String(q), 1]], derived: [q, Math.abs(a), R] }
        });
      }),
      H('hard-yinyang', '원과 반원으로 이루어진 도형과 직선이 다섯 점에서 만날 기울기의 범위', '②45', (d) => {
        // 함정: 직선이 (−1, 0)을 늘 지난다는 것과, 교점을 도형 조각마다 세어야 한다는 것을 놓치는 아이. (그림이 정해져 있어 답은 늘 같다 — 보기의 차례만 바뀐다.)
        const o = { x: [-3, 3], y: [-3, 3], xticks: [-2, -1, 1, 2], yticks: [2, -2], circles: [{ cx: 0, cy: 0, r: 2 }, { cx: -1, cy: 0, r: 1, part: 'down' }, { cx: 1, cy: 0, r: 1, part: 'up' }], say: '원 하나와 반원 두 개로 이루어진 도형이 있다.' };
        const s3 = frac(rt(3), 3), opts = [nb(`0 &lt; ${VA} &lt; ${s3}`), nb(`0 &lt; ${VA} &lt; ${rt(3)}`), nb(`${MINUS}${s3} &lt; ${VA} &lt; ${s3}`), nb(`0 &lt; ${VA} ≤ ${s3}`), nb(`0 &lt; ${VA} &lt; ${frac(1, 2)}`)];
        const pickSet = [0].concat(d.shuffle([1, 2, 3, 4]).slice(0, 3)), order = d.shuffle(pickSet);
        return C(`그림과 같이 좌표평면 위에 원 ${ej(circ0(4), '과/와')} 반원 두 개로 이루어진 도형이 있다. 이 도형과 직선 ${ej(nb(`${Y} = ${VA}(${X} + 1)`), '이/가')} 서로 다른 다섯 개의 점에서 만나도록 하는 실수 ${VA}의 값의 범위는? (단, 두 반원은 반지름의 길이가 1이다.)`, order.map((i) => opts[i]), order.indexOf(0), {
          figure: fig(o),
          explain: `직선 ${nb(`${Y} = ${VA}(${X} + 1)`)}은 ${VA}의 값에 관계없이 점 ${ej(pt(-1, 0), '을/를')} 지난다. 이 점은 원 ${circ0(4)}의 안쪽에 있어 직선은 큰 원과 늘 두 점에서 만나고, 아래쪽 반원(중심 ${pt(-1, 0)})과는 ${nb(`${VA} &gt; 0`)}일 때 한 점에서 만난다. 다섯 점이 되려면 위쪽 반원(중심 ${pt(1, 0)})과 두 점에서 만나야 하고, 그 경계는 직선이 이 반원에 접할 때이다. ${nb(`|2${VA}| ÷ ${rt(`${VA}${sup(2)} + 1`)} = 1`)}에서 ${nb(`${VA} = ${s3}`)}이므로 ${opts[0]}이다.`,
          facts: { truth: order.map((i) => i === 0), want: true }
        });
      }),
      H('hard-tangent-point-coord', '접선이 주어진 점을 지나는 원 위의 점의 좌표', '심2', (d) => {
        const R = d.int(1, 20), t = pm(d) * d.int(2, 7), sx = pm(d), onY = d.bool();
        if (t * t <= R) return null;
        const [k, q] = sqParts(R * (t * t - R)), g = gcd(k, Math.abs(t)), kk = k / g, cc = Math.abs(t) / g;
        if (q < 2 || cc < 2 || kk < 2) return null;
        const quadOf = (x, y) => (x > 0 ? (y > 0 ? 1 : 4) : (y > 0 ? 2 : 3)), sy = t > 0 ? 1 : -1, quad = onY ? quadOf(sx, sy) : quadOf(sy, sx);
        const P0 = onY ? pt(0, t) : pt(t, 0), ask = onY ? X : Y, near = onY ? Y : X;
        return inline(`원 ${circ0(R)} 위의 점 가운데 제${quad}사분면에 있는 점 P에서의 접선이 점 ${ej(P0, '을/를')} 지날 때, 점 P의 ${ask}좌표를 구하시오.`, frac('{0}' + rt('{1}'), '{2}'), [{ answer: sx * kk, signed: true }, { answer: q }, { answer: cc }], {
          shown: (sx < 0 ? MINUS : '') + frac(radText(kk, q), cc),
          explain: `점 P를 ${pt(V('x') + '<sub>1</sub>', V('y') + '<sub>1</sub>')}이라 하면 접선은 ${nb(`${X}<sub>1</sub>${X} + ${Y}<sub>1</sub>${Y} = ${R}`)}이고 점 ${ej(P0, '을/를')} 지나므로 ${nb(`${near}<sub>1</sub> = ${iq(Q(R, t))}`)}이다. ${nb(`${X}<sub>1</sub>${sup(2)} + ${Y}<sub>1</sub>${sup(2)} = ${R}`)}에 넣으면 ${nb(`${ask}<sub>1</sub>${sup(2)} = ${iq(Q(R * (t * t - R), t * t))}`)}이고, 점 P가 제${quad}사분면에 있으므로 ${nb(`${ask}<sub>1</sub> = ${sx < 0 ? MINUS : ''}${frac(radText(kk, q), cc)}`)}이다.`,
          facts: { calc: [[`${sx < 0 ? '0-' : ''}((${R}*(${jn(t)}*${jn(t)}-${R}))/${q})**0.5*${cc}/${Math.abs(t)}`, 0], [String(q), 1], [String(cc), 2]], derived: [q, cc] }
        });
      }),
      // ── ② 세 단계 넘게 이어 생각해야 풀리는 문제 ──
      H('hard-center-parabola', '중심이 포물선 위에 있고 두 직선에 동시에 접하는 원', '①23', (d) => {
        // 두 직선 x = p, y = q 까지의 거리가 같은 점은 (p, q)를 지나는 기울기 ±1 직선 위에 있다. 한 갈래는 포물선과 만나지 않는다.
        const p = d.int(3, 6), q = d.int(1, p - 1), sx = pm(d), P = sx * p, total = 1 + 2 * (p + q) + 2 * p + 2 * p * p;
        return N(`중심이 곡선 ${nb(`${Y} = ${X2}`)} 위에 있고 두 직선 ${nb(`${X} = ${iq(P)}`)}, ${ej(nb(`${Y} = ${q}`), '에/에')} 동시에 접하는 모든 원의 넓이의 합은?`, total, { unit: 'π',
          explain: `두 직선에 동시에 접하는 원의 중심은 두 직선까지의 거리가 같으므로 ${nb(`|${X} ${sgn(-P)}| = |${Y} ${MINUS} ${q}|`)}, 곧 점 ${ej(pt(P, q), '을/를')} 지나고 기울기가 1 또는 −1인 직선 위에 있다. 이 가운데 ${ej(sx > 0 ? nb(`${Y} = ${X} ${sgn(q - P)}`) : nb(`${Y} = ${MINUS}${X} ${sgn(q + P)}`), '은/는')} ${nb(`${Y} = ${X2}`)}과 만나지 않는다(정리한 이차방정식의 근의 공식의 근호 안의 수가 음수이다). 다른 직선과의 교점의 ${X}좌표를 ${V('α')}, ${V('β')}라 하면 두 원의 반지름의 길이는 ${nb(`|${V('α')} ${sgn(-P)}|`)}, ${nb(`|${V('β')} ${sgn(-P)}|`)}이고, 근과 계수의 관계로 넓이의 합 ${nb(`{(${V('α')} ${sgn(-P)})${sup(2)} + (${V('β')} ${sgn(-P)})${sup(2)}}π = ${total}π`)}를 얻는다.`,
          facts: { value: `1+2*(${p}+${q})+2*${p}+2*${p}*${p}` }
        });
      }, { standard: S04 }),
      H('hard-max-dist-line-circle', '원점에서 가장 먼 직선과 원 위의 점 사이의 거리의 최솟값', '①25', (d) => {
        const [u, v, h] = d.pick(PYTH), su = pm(d), sv = pm(d), p = su * u, q = sv * v, S = p * p + q * q, a = d.int(-9, 9), b = d.int(-9, 9), r = d.int(1, 3), w = p * a + q * b - S;
        const dist = Q(Math.abs(w), h), m = Q(Math.abs(w) - r * h, h);
        if (m.p <= 0 || m.q === 1 || (a === 0 && b === 0)) return null;
        return F(`점 ${ej(pt(p, q), '을/를')} 지나는 직선 가운데 원점과의 거리가 가장 먼 직선을 ${V('l')}이라 하자. 원 ${stdE(a, b, r * r)} 위의 점 P와 직선 ${V('l')} 사이의 거리의 최솟값은?`, m.p, m.q, { improper: m.p > m.q,
          explain: `원점과의 거리가 가장 먼 직선은 원점과 점 ${ej(pt(p, q), '을/를')} 잇는 선분에 수직인 직선이므로 ${ej(lineG(p, q, -S), '이다/이다').slice(0, -2)}이다. 원의 중심 ${ej(pt(a, b), '과/와')} 이 직선 사이의 거리는 ${ej(nb(`|${iq(w)}| ÷ ${h} = ${iq(dist)}`), '으로/로')} 반지름의 길이 ${r}보다 크므로, 최솟값은 ${nb(`${iq(dist)} ${MINUS} ${r} = ${iq(m)}`)}이다.`,
          facts: { value: `${absE(`${jn(p)}*${jn(a)}+${jn(q)}*${jn(b)}-${jn(p)}*${jn(p)}-${jn(q)}*${jn(q)}`, w)}/(${jn(p)}*${jn(p)}+${jn(q)}*${jn(q)})**0.5-(${r * r})**0.5` }
        });
      }),
      H('hard-bisect-tangent', '한 원의 넓이를 이등분하고 다른 원에 접하는 직선', '①29', (d, n) => {
        if (n === 0) {
          // 원 x² + y² = R 에 접하고 점 (a, b)(둘째 원의 중심)를 지나는 두 직선의 기울기의 합 — 근과 계수의 관계
          const R = d.pick([1, 2, 4, 5]), a = nz(d, -4, 4), b = nz(d, -4, 4), r2 = d.int(1, 3), A2 = a * a - R, sum = Q(2 * a * b, A2);
          if (A2 === 0 || a * a + b * b <= R || sum.q !== 1 || sum.p === 0) return null;
          const disc = 4 * R * (a * a + b * b - R);
          if (isSq(disc)) return null;
          return N(`원 ${ej(circ0(R), '에/에')} 접하고 원 ${ej(stdE(a, b, r2 * r2), '의/의').slice(0, -1)}의 넓이를 이등분하는 두 직선의 기울기의 합은?`, sum.p, { signed: true,
            explain: `넓이를 이등분하는 직선은 둘째 원의 중심 ${ej(pt(a, b), '을/를')} 지나므로 기울기를 ${VM}이라 하면 ${nb(`${poly([[1, VM + X], [-1, Y], [-a, VM], [b, '']])} = 0`)}이다. 이 직선이 첫째 원에 접하므로 ${nb(`(${poly([[a, VM], [-b, '']])})${sup(2)} = ${R}(${VM}${sup(2)} + 1)`)}, 곧 ${nb(`${poly([[A2, VM + sup(2)], [-2 * a * b, VM], [b * b - R, '']])} = 0`)}이다. 두 기울기는 이 이차방정식의 두 근이므로 합은 ${iq(sum)}이다.`,
            facts: { value: `2*${jn(a)}*${jn(b)}/(${jn(a)}*${jn(a)}-${R})`, rule: 'bt-0' }
          });
        }
        // 원 (x − c1)² + y² = R1 에 접하고 (c2, 0)을 지나는 직선 가운데 기울기가 양수인 것의 y절편
        const [D1, l1, l2] = d.pick([[5, 3, 4], [5, 4, 3], [13, 5, 12], [13, 12, 5], [10, 6, 8], [10, 8, 6]]), c1 = d.int(-4, 4), sd = pm(d), c2 = c1 + sd * D1, r2 = d.int(1, 3), R1 = l1 * l1;
        const mq = Q(l1, l2), yi = Q(-c2 * l1, l2);
        if (c2 === 0 || yi.q === 1 || Math.abs(c2) > 15) return null;
        return ansV(`원 ${ej(stdE(c1, 0, R1), '에/에')} 접하고 원 ${ej(stdE(c2, 0, r2 * r2), '의/의').slice(0, -1)}의 넓이를 이등분하는 직선 가운데 기울기가 양수인 직선의 ${Y}절편은?`, yi, 'frac', {
          explain: `넓이를 이등분하는 직선은 둘째 원의 중심 ${ej(pt(c2, 0), '을/를')} 지나므로 ${nb(`${Y} = ${VM}(${X} ${sgn(-c2)})`)}이다. 첫째 원의 중심 ${ej(pt(c1, 0), '과/와')} 이 직선 사이의 거리가 ${l1}이므로 ${nb(`${D1}|${VM}| ÷ ${rt(`${VM}${sup(2)} + 1`)} = ${l1}`)}, ${nb(`${VM}${sup(2)} = ${iq(Q(R1, D1 * D1 - R1))}`)}이다. 기울기가 양수이므로 ${nb(`${VM} = ${iq(mq)}`)}이고, ${Y}절편은 ${nb(`${MINUS}${iq(mq)} × ${iq(c2).replace(MINUS, '(' + MINUS) + (c2 < 0 ? ')' : '')} = ${iq(yi)}`)}이다.`,
          facts: { value: `0-${jn(c2)}*(${R1}/((${jn(c2)}-${jn(c1)})*(${jn(c2)}-${jn(c1)})-${R1}))**0.5`, rule: 'bt-1' }
        });
      }, { count: 2 }),
      H('hard-parallel-through', '평행한 두 직선에 동시에 접하고 한 점을 지나는 원', '①31', (d) => {
        const m = d.pick([1, -1, 2, -2, 3, -3]), u = 1, R = (m * m + 1) * u * u, dd = (m * m + 1) * u, k = d.int(-4, 4), x0 = d.int(-5, 5), y0 = d.int(-6, 6);
        const A = m * m + 1, Bq = -2 * (x0 + m * (y0 - k)), Cq = x0 * x0 + (y0 - k) ** 2 - R, disc = Bq * Bq - 4 * A * Cq;
        if (disc <= 0 || !isSq(disc)) return null;
        const a1 = (-Bq - Math.sqrt(disc)) / (2 * A), a2 = (-Bq + Math.sqrt(disc)) / (2 * A);
        if (!Number.isInteger(a1) || !Number.isInteger(a2) || k - dd === 0 || k + dd === 0) return null;
        const c1 = [a1, m * a1 + k], c2 = [a2, m * a2 + k];
        if ([c1, c2].some(([x, y]) => Math.abs(x) > 9 || Math.abs(y) > 15)) return null;
        const kE = `((${jn(k - dd)}+${jn(k + dd)})/2)`, RE = `((${jn(k + dd)}-${jn(k - dd)})*(${jn(k + dd)}-${jn(k - dd)})/4/(${jn(m)}*${jn(m)}+1))`;
        const AE = `(${jn(m)}*${jn(m)}+1)`, BE = `(0-2*(${jn(x0)}+${jn(m)}*(${jn(y0)}-${kE})))`, CE = `(${jn(x0)}*${jn(x0)}+(${jn(y0)}-${kE})*(${jn(y0)}-${kE})-${RE})`, DE = `(${BE}*${BE}-4*${AE}*${CE})`;
        const r1 = `((0-${BE}-${DE}**0.5)/(2*${AE}))`, r2_ = `((0-${BE}+${DE}**0.5)/(2*${AE}))`;
        return inline(`두 직선 ${lineY(m, k - dd)}, ${ej(lineY(m, k + dd), '에/에')} 동시에 접하고 점 ${ej(pt(x0, y0), '을/를')} 지나는 원은 두 개이다. 두 원의 중심의 좌표를 구하시오.`, grp('({0}, {1})') + ', ' + grp('({2}, {3})'), [{ answer: c1[0], signed: true }, { answer: c1[1], signed: true }, { answer: c2[0], signed: true }, { answer: c2[1], signed: true }], {
          blocks: [[0, 1], [2, 3]], shown: `${pt(c1[0], c1[1])}, ${pt(c2[0], c2[1])}`,
          explain: `평행한 두 직선 사이의 거리는 ${nb(`${2 * dd} ÷ ${rt(m * m + 1)}`)}이고 이것이 지름이므로 반지름의 길이의 제곱은 ${R}이다. 중심은 두 직선의 한가운데 있는 직선 ${ej(lineY(m, k), '위에/위에').slice(0, -2)} 위에 있으므로 중심을 ${ej(pt(VA, nb(`${poly([[m, VA], [k, '']])}`)), '이라/라')} 하면, 점 ${ej(pt(x0, y0), '을/를')} 지나므로 ${nb(`(${iq(x0)} ${MINUS} ${VA})${sup(2)} + (${iq(y0)} ${MINUS} ${poly([[m, VA], [k, '']])})${sup(2)} = ${R}`)}이다. 정리하면 ${nb(`${poly([[A, VA + sup(2)], [Bq, VA], [Cq, '']])} = 0`)}, ${nb(`${VA} = ${iq(a1)}`)} 또는 ${nb(`${VA} = ${iq(a2)}`)}이므로 중심은 ${pt(c1[0], c1[1])}, ${ej(pt(c2[0], c2[1]), '이다/이다').slice(0, -2)}이다.`,
          facts: { calc: [[r1, 0], [`${jn(m)}*${r1}+${kE}`, 1], [r2_, 2], [`${jn(m)}*${r2_}+${kE}`, 3]] }
        });
      }),
      H('hard-triangle-area', '원 위의 점과 두 점으로 만든 삼각형의 넓이의 최대·최소', '①32', (d, n) => {
        const [u, v, h] = d.pick(PYTH), su = pm(d), sv = pm(d);
        if (n === 0) {
          const r = d.int(1, 3), x1 = d.int(-8, 8), y1 = d.int(-8, 8), x2 = x1 + su * u, y2 = y1 + sv * v, cross = Math.abs(x1 * y2 - x2 * y1);
          if (cross <= h * r || (cross + h * r) % 2 !== 0 || x1 * x1 + y1 * y1 <= r * r || x2 * x2 + y2 * y2 <= r * r) return null;
          const big = (cross + h * r) / 2, small = (cross - h * r) / 2;
          if (big > 200) return null;
          return M(`두 점 ${P2('A', x1, y1)}, ${ej(P2('B', x2, y2), '과/와')} 원 ${circ0(r * r)} 위의 점 C에 대하여 삼각형 ABC의 넓이의 최댓값과 최솟값을 구하시오.`, [{ lead: '최댓값:', answer: big }, { lead: '최솟값:', answer: small }], {
            shown: `최댓값 ${big}, 최솟값 ${small}`,
            explain: `밑변 AB의 길이는 ${ej(nb(`${rt(`${u * u} + ${v * v}`)} = ${h}`), '으로/로')} 정해져 있으므로 높이(점 C와 직선 AB 사이의 거리)가 가장 클 때와 가장 작을 때를 찾는다. 원점과 직선 AB 사이의 거리는 ${ej(nb(`${cross} ÷ ${h} = ${iq(Q(cross, h))}`), '으로/로')} 반지름의 길이 ${r}보다 크므로, 높이의 최댓값은 ${nb(`${iq(Q(cross, h))} + ${r}`)}, 최솟값은 ${nb(`${iq(Q(cross, h))} ${MINUS} ${r}`)}이다(점 C에서의 접선이 직선 AB와 평행할 때). 따라서 넓이의 최댓값은 ${nb(`${h} × (${iq(Q(cross, h))} + ${r}) ÷ 2 = ${big}`)}, 최솟값은 ${nb(`${h} × (${iq(Q(cross, h))} ${MINUS} ${r}) ÷ 2 = ${small}`)}이다.`,
            facts: { calc: [[`(${absE(`${jn(x1)}*${jn(y2)}-${jn(x2)}*${jn(y1)}`, x1 * y2 - x2 * y1)}+((${jn(x2)}-${jn(x1)})*(${jn(x2)}-${jn(x1)})+(${jn(y2)}-${jn(y1)})*(${jn(y2)}-${jn(y1)}))**0.5*(${r * r})**0.5)/2`, 0], [`(${absE(`${jn(x1)}*${jn(y2)}-${jn(x2)}*${jn(y1)}`, x1 * y2 - x2 * y1)}-((${jn(x2)}-${jn(x1)})*(${jn(x2)}-${jn(x1)})+(${jn(y2)}-${jn(y1)})*(${jn(y2)}-${jn(y1)}))**0.5*(${r * r})**0.5)/2`, 1]], rule: 'ta-0' }
          });
        }
        // 두 점 A, B 가 원 위에 있을 때 넓이의 최댓값
        const R = d.pick([25, 100, 169, 50, 65, 85]), L = lattice(R), pairs = [];
        for (const A of L) for (const Bp of L) { const dx = Bp[0] - A[0], dy = Bp[1] - A[1], ab = dx * dx + dy * dy; if (ab > 0 && isSq(ab) && A[0] * Bp[1] - Bp[0] * A[1] !== 0) pairs.push([A, Bp]); }
        if (!pairs.length) return null;
        const [[x1, y1], [x2, y2]] = d.pick(pairs), ab = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2), cross = Math.abs(x1 * y2 - x2 * y1), r = Math.sqrt(R);
        if (!Number.isInteger(r)) return null;
        const big = (cross + ab * r) / 2;
        if (!Number.isInteger(big)) return null;
        return N(`원 ${circ0(R)} 위의 두 점 ${P2('A', x1, y1)}, ${ej(P2('B', x2, y2), '과/와')} 이 원 위의 점 C에 대하여 삼각형 ABC의 넓이의 최댓값은?`, big, {
          explain: `밑변 AB의 길이는 ${ab}이다. 원점과 직선 AB 사이의 거리는 ${nb(`${cross} ÷ ${ab} = ${iq(Q(cross, ab))}`)}이므로, 점 C와 직선 AB 사이의 거리의 최댓값은 ${nb(`${iq(Q(cross, ab))} + ${r}`)}이다(점 C가 원의 중심을 지나 AB에 수직인 직선 위, AB의 반대쪽에 있을 때). 따라서 넓이의 최댓값은 ${nb(`${ab} × (${iq(Q(cross, ab))} + ${r}) ÷ 2 = ${big}`)}이다.`,
          facts: { value: `(${absE(`${jn(x1)}*${jn(y2)}-${jn(x2)}*${jn(y1)}`, x1 * y2 - x2 * y1)}+((${jn(x2)}-${jn(x1)})*(${jn(x2)}-${jn(x1)})+(${jn(y2)}-${jn(y1)})*(${jn(y2)}-${jn(y1)}))**0.5*${R}**0.5)/2`, rule: 'ta-1' }
        });
      }, { count: 2 }),
      H('hard-sphere-light', '구 모양의 조형물이 빛을 받는 부분의 최대 높이', '②68', (d) => {
        const [r, s] = d.pick([[1, 2], [1, 3], [2, 4], [2, 6], [3, 6], [3, 9], [4, 8], [3, 4], [2, 3], [1, 4], [2, 5], [4, 6]]), hq = Q(2 * s * s * r, s * s + r * r);
        if (hq.q === 1 || hq.q > 25) return null;
        // 그림: 지면, 구의 단면(원), 지면과 닿는 점 A, 조명 L 과 위쪽 접선
        const k = Math.min(150 / (s + r), 30), b = G.Board(), Cc = [0, -r * k], A0 = [0, 0], L0 = [s * k, 0];
        const tx1 = 2 * s * r * r / (s * s + r * r), ty1 = (s * tx1 - r * r) / r, T0 = [tx1 * k, -(ty1 + r) * k + 0];
        b.seg([-r * k - 14, 0], [s * k + 16, 0]).disk(Cc, r * k).seg(L0, [L0[0] + (T0[0] - L0[0]) * 1.25, T0[1] * 1.25], 'thin', 'stroke:#b42318').seg(Cc, A0, 'cut').dot(A0).dot(L0).dot(Cc);
        b.name(A0, 'A', 225, 12).name(L0, '조명', 300, 16).beside(Cc, A0, `${r} m`, [r * k, -r * k / 2]).dim(A0, L0, `${s} m`, [s * k / 2, -40], 12);
        return F(`반지름의 길이가 ${r} m인 구 모양의 조형물이 점 A에서 평평한 지면과 만난다. 점 A로부터 ${s} m만큼 떨어진 지면 위의 지점에 조명을 두고 비출 때, 이 조형물이 빛을 받는 부분의 지면으로부터의 최대 높이는 몇 m인가? (단, 조명의 크기는 생각하지 않는다.)`, hq.p, hq.q, { improper: hq.p > hq.q, unit: 'm',
          figure: b.svg(`구의 단면인 원이 점 A에서 지면에 닿아 있고, 중심에서 A까지 점선이 있다. A에서 ${s} m 떨어진 지면 위에 조명이 있고 조명에서 원의 위쪽에 접하는 직선이 그어져 있다. 원의 반지름은 ${r} m이다.`),
          explain: `원의 중심을 원점, 지면과 나란한 직선을 ${AXIS.x}으로 잡으면 원은 ${circ0(r * r)}, 조명은 ${ej(pt(s, -r), '이다/이다').slice(0, -2)}이다. 접점을 ${pt(VA, VB)}라 하면 접선 ${ej(nb(`${VA}${X} + ${VB}${Y} = ${r * r}`), '이/가')} 조명을 지나므로 ${nb(`${poly([[s, VA], [-r, VB]])} = ${r * r}`)}이고, ${ej(nb(`${VA}${sup(2)} + ${VB}${sup(2)} = ${r * r}`), '과/와')} 연립하면 ${nb(`${VA} = 0`)}(점 A) 또는 ${nb(`${VB} = ${iq(Q(s * s * r - r * r * r, s * s + r * r))}`)}이다. 빛을 받는 부분의 가장 높은 점은 뒤의 접점이므로 최대 높이는 ${nb(`${iq(Q(s * s * r - r * r * r, s * s + r * r))} + ${r} = ${iq(hq)}`)} (m)이다.`,
          facts: { value: `2*${s}*${s}*${r}/(${s}*${s}+${r}*${r})` }
        });
      }),
      H('hard-chord-perp-tangents', '원과 직선의 두 교점에서의 접선이 서로 수직일 조건', '②69', (d) => {
        const a = nz(d, -3, 3), b = nz(d, -3, 3), r = d.int(1, 3), R = r * r, A2 = 2 * a * a - R, disc = 4 * R * (2 * a * a + 2 * b * b - R), sum = Q(4 * a * b, A2);
        if (A2 === 0 || 2 * (a * a + b * b) <= R || isSq(disc) || sum.q === 1) return null;
        return ansV(`중심이 ${ej(pt(a, b), '이고/이고').slice(0, -2)}이고 반지름의 길이가 ${r}인 원과 직선 ${ej(nb(`${Y} = ${VM}${X}`), '이/가')} 서로 다른 두 점 A, B에서 만난다. 두 점 A, B에서 각각 원에 그은 접선이 서로 수직이 되도록 하는 모든 ${VM}의 값의 합은?`, sum, 'frac', {
          explain: `원의 중심을 C, 두 접선의 교점을 D라 하면 사각형 ADBC는 네 각이 직각이고 ${nb('CA = CB')}이므로 한 변의 길이가 ${r}인 정사각형이다. 따라서 중심 C와 직선 AB 사이의 거리는 대각선의 절반인 ${nb(`${r} ÷ ${rt(2)}`)}이다. ${ej(nb(`|${iq(a)}${VM} ${sgn(-b)}| ÷ ${rt(`${VM}${sup(2)} + 1`)} = ${r} ÷ ${rt(2)}`), '을/를')} 정리하면 ${nb(`${poly([[A2, VM + sup(2)], [-4 * a * b, VM], [2 * b * b - R, '']])} = 0`)}이고, 근과 계수의 관계에 의하여 모든 ${VM}의 값의 합은 ${iq(sum)}이다.`,
          facts: { value: `4*${jn(a)}*${jn(b)}/(2*${jn(a)}*${jn(a)}-${r}*${r})` }
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
