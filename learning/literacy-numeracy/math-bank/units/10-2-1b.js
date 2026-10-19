// 고등학교 1학년 2학기 1단원 평면좌표와 직선의 방정식 — 뒤쪽 묶음(직선의 방정식, 두 직선의 평행과 수직, 점과 직선 사이의 거리).
// 단원 틀과 도구, 싣는 기준, 뺀 것과 까닭은 10-2-1a.js 에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
// 중학교 단원(8-1-5, 8-1-6)에 이미 있는 일(한 점과 기울기·두 점으로 직선, 평행한 직선, 세 직선이 한 점에서 만나는 조건)은 싣지 않았다.
// 수직 조건·점과 직선 사이의 거리처럼 고등학교에서 새로 배우는 일과, 정점처럼 두 일차식을 연립해야 하는 일만 싣는다.
// 직선의 방정식을 답하는 문항은 답의 기울기와 y절편이 정수가 되게 수를 골랐다(수직인 직선의 기울기가 정수가 되도록 주어진 직선의 기울기를 −1/m 꼴로 고른다).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, N, M, C, F } = B.kit;
  const { MINUS, gcd, Q, qadd, qsub, qmul, qdiv, qneg, qabs, qcmp, fl, tx, nb, tail, lastOf, js, V, sup, nz, pm, asQ, poly, pointAns, plane, rt, sqParts, radText, SG, tag } = B.kit.mid;
  const K = B.kit.m1021;
  const { STD1, STD2, STD3, T, X, Y, VA, VB, VC, VK, VM, VN, iq, jn, par, nj, cx, cv, jw, fr, pt, ptj, P, Pj, ratio, ratioj, QN, QS, genH, genj, slopeH, slopej, isSq, lenH, lenj, sqForm, sq, df,
    lineAns, twoLinesAns, radLen, twoVals, vals, rangeAns, pick, vecs, sameLen, RATIOS, inBox, add, sub, mul, d2, PYTH } = K;
  const VP = V('p'), HAN = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ'];

  // ── 직선 ──
  // 정수 계수 직선 { a, b, c }: ax + by + c = 0. 세 계수의 최대공약수는 1이고 처음 나오는 0이 아닌 계수는 양수로 맞춘다.
  function norm(a, b, c) {
    const g = gcd(gcd(Math.abs(a), Math.abs(b)), Math.abs(c)) || 1, s = (a !== 0 ? a : b) < 0 ? -1 : 1;
    return { a: s * a / g, b: s * b / g, c: s * c / g };
  }
  // 점 p 를 지나고 법선이 (a, b)인 직선
  const through = (p, a, b) => norm(a, b, -(a * p[0] + b * p[1]));
  const lh = (l) => genH(l.a, l.b, l.c), lj = (l, pair) => genj(l.a, l.b, l.c, pair);
  const onL = (l, p) => l.a * p[0] + l.b * p[1] + l.c === 0;
  const slopeQ = (l) => Q(-l.a, l.b);
  // 두 직선의 교점(정수일 때만)
  function meetOf(l1, l2) {
    const den = l1.a * l2.b - l2.a * l1.b;
    if (den === 0) return null;
    const x = (l1.b * l2.c - l2.b * l1.c) / den, y = (l2.a * l1.c - l1.a * l2.c) / den;
    return Number.isInteger(x) && Number.isInteger(y) ? [x, y] : null;
  }
  // 교점을 셈하는 검사 식
  const meetX = (l1, l2) => `((${jn(l1.b)}*${jn(l2.c)}-${jn(l2.b)}*${jn(l1.c)})/(${jn(l1.a)}*${jn(l2.b)}-${jn(l2.a)}*${jn(l1.b)}))`;
  const meetY = (l1, l2) => `((${jn(l2.a)}*${jn(l1.c)}-${jn(l1.a)}*${jn(l2.c)})/(${jn(l1.a)}*${jn(l2.b)}-${jn(l2.a)}*${jn(l1.b)}))`;
  // 작은 계수의 직선 하나(점 p 를 지난다)
  function lineThrough(d, p, ok) {
    return d.until(() => { const a = d.int(-3, 3), b = d.int(-3, 3); return a === 0 && b === 0 ? null : through(p, a, b); }, (l) => l && (!ok || ok(l)));
  }
  // (p + qk) 꼴 계수의 직선: pairs [[상수, 문자의 계수, 문자 글], …](문자 글 '' 은 상수항). 「(k + 1)x − (k − 3)y + k − 15 = 0」
  function famH(pairs, letter) {
    const L = letter || VK, out = [];
    for (const [k0, k1, v] of pairs) {
      if (k0 === 0 && k1 === 0) continue;
      if (v === '') {
        if (k1 !== 0) out.push([k1 < 0, (Math.abs(k1) === 1 ? '' : Math.abs(k1)) + L]);
        if (k0 !== 0) out.push([k0 < 0, String(Math.abs(k0))]);
        continue;
      }
      if (k1 === 0) { out.push([k0 < 0, (Math.abs(k0) === 1 ? '' : Math.abs(k0)) + v]); continue; }
      if (k0 === 0) { out.push([k1 < 0, (Math.abs(k1) === 1 ? '' : Math.abs(k1)) + L + v]); continue; }
      const s = k1 < 0 ? -1 : 1;
      out.push([k1 < 0, '(' + poly([[s * k1, L], [s * k0, '']]) + ')' + v]);
    }
    return nb(out.map(([neg, body], i) => (i === 0 ? (neg ? MINUS : '') : neg ? ` ${MINUS} ` : ' + ') + body).join('') + ' = 0');
  }
  const famOf = (l1, l2) => famH([[l1.a, l2.a, X], [l1.b, l2.b, Y], [l1.c, l2.c, '']]);
  // 범위의 글
  const between = (lo, hi, v, open) => nb(`${iq(lo)} ${open ? '&lt;' : '≤'} ${v} ${open ? '&lt;' : '≤'} ${iq(hi)}`);
  const rays = (lo, hi, v) => `${nb(`${v} ≤ ${iq(lo)}`)} 또는 ${nb(`${v} ≥ ${iq(hi)}`)}`;
  const qmin = (u, w) => (qcmp(u, w) < 0 ? u : w), qmax = (u, w) => (qcmp(u, w) < 0 ? w : u);
  const tagged = (list) => lines(list.map((h, i) => tag(HAN[i]) + h));
  // y − y0 = m(x − x0) 의 글(y0 = 0 이면 y, x0 = 0 이면 mx)
  const psH = (m, x0, y0) => nb(`${y0 === 0 ? Y : `${Y} ${MINUS} ${par(y0)}`} = ${x0 === 0 ? cv(m, X) : `${m === 1 ? '' : m === -1 ? MINUS : iq(m)}(${poly([[1, X], [-x0, '']])})`}`);

  // ════════════════════════════════════════════════════════════════
  // ── 직선의 방정식 ──
  const lineTypes = [
    T('line-fixed-point', '실수 k의 값에 관계없이 직선이 지나는 점', '②6', (d, n) => {
      const Fp = [d.int(-4, 4), d.int(-4, 4)], l1 = lineThrough(d, Fp), l2 = lineThrough(d, Fp, (l) => l.a * l1.b !== l.b * l1.a);
      if (n === 1 && (l2.a === 0 || l2.b === 0 || l1.a === 0 || l1.b === 0)) return null;
      const shown = n === 0 ? nb(`${poly([[l1.a, X], [l1.b, Y], [l1.c, '']])} + ${VK}(${poly([[l2.a, X], [l2.b, Y], [l2.c, '']])}) = 0`) : famOf(l1, l2);
      return pointAns(`직선 ${jw(shown, '이/가')} 실수 ${VK}의 값에 관계없이 항상 지나는 점의 좌표는?`, Fp[0], Fp[1], {
        explain: `${n === 1 ? `${VK}에 대하여 정리하면 ${nb(`${poly([[l1.a, X], [l1.b, Y], [l1.c, '']])} + ${VK}(${poly([[l2.a, X], [l2.b, Y], [l2.c, '']])}) = 0`)}이다. ` : ''}이 식이 ${VK}의 값에 관계없이 성립하려면 ${lh(l1)}, ${lh(l2)}이어야 한다. 연립하여 풀면 ${X} = ${iq(Fp[0])}, ${Y} = ${iq(Fp[1])}이므로 항상 지나는 점은 ${pt(Fp[0], Fp[1])}이다.`,
        facts: { calc: [[meetX(l1, l2), 0], [meetY(l1, l2), 1]] }
      });
    }, { count: 2 }),
    T('line-collinear', '세 점이 한 직선 위에 있을 조건(미지수가 두 자리)', '②7 심4', (d) => {
      const r1 = d.int(-6, -1), r2 = d.int(1, 6), p2 = d.int(-5, 5), q2 = r1 + r2 - p2, prod = (r1 - p2) * (r2 - p2);
      if (p2 === r1 || p2 === r2 || prod === 0) return null;
      const divs = []; for (let t = -6; t <= 6; t += 1) if (t !== 0 && prod % t === 0) divs.push(t);
      const delta = d.pick(divs), p1 = p2 - delta, q3 = q2 + prod / delta;
      if (!inBox([[p1, r1], [p1, r2], [p2, q2], [r1, q3], [r2, q3]]) || [r1, r2].some((r) => p1 === r && r === q3)) return null;
      const wantPos = d.bool(), ans = wantPos ? r2 : r1, other = wantPos ? r1 : r2;
      return N(`서로 다른 세 점 ${P('A', p1, VA)}, ${P('B', p2, q2)}, ${Pj('C', VA, q3, '이/가')} 한 직선 위에 있도록 하는 ${wantPos ? '양수' : '음수'} ${VA}의 값은?`, ans, {
        signed: true,
        explain: `직선 AB와 직선 BC의 기울기가 같으므로 ${nb(`${frac(`${iq(q2)} ${MINUS} ${VA}`, `${iq(p2)} ${MINUS} ${par(p1)}`)} = ${frac(`${iq(q3)} ${MINUS} ${par(q2)}`, `${VA} ${MINUS} ${par(p2)}`)}`)}이다. 정리하면 ${nb(`${poly([[1, VA + sup(2)], [-(r1 + r2), VA], [r1 * r2, '']])} = 0`)}, ${nb(`(${poly([[1, VA], [-r1, '']])})(${poly([[1, VA], [-r2, '']])}) = 0`)}이므로 ${VA} = ${iq(r1)} 또는 ${VA} = ${iq(r2)}이다. ${wantPos ? '양수' : '음수'}인 것은 ${iq(ans)}이다.`,
        facts: { calc: [[`${jn(q2)}+${jn(p2)}-${jn(other)}`, 0]], derived: [other] }
      });
    }),
    T('line-slope-range', '정점을 지나는 직선이 선분·삼각형과 만나는 범위', '②10', (d, n) => {
      if (n === 0) {
        // a(x − x0) + (y − y0) = 0: 정점 F, 기울기 −a. 선분 AB 와 만나는 a 의 범위
        const Fp = [d.int(-4, 4), d.int(-4, 4)], A = [d.int(-6, 6), d.int(-6, 6)], Bp = [d.int(-6, 6), d.int(-6, 6)];
        if (A[0] === Fp[0] || Bp[0] === Fp[0] || (A[0] === Bp[0] && A[1] === Bp[1])) return null;
        const sA = Q(A[1] - Fp[1], A[0] - Fp[0]), sB = Q(Bp[1] - Fp[1], Bp[0] - Fp[0]);
        if (qcmp(sA, sB) === 0 || sA.q > 5 || sB.q > 5 || sA.p === 0 || sB.p === 0) return null;
        const lo = qmin(sA, sB), hi = qmax(sA, sB), across = (A[0] - Fp[0]) * (Bp[0] - Fp[0]) < 0;
        // 기울기 s 의 범위: 같은 쪽이면 lo ≤ s ≤ hi, 서로 다른 쪽이면 s ≤ lo 또는 s ≥ hi. a = −s
        const right = across ? rays(qneg(hi), qneg(lo), VA) : between(qneg(hi), qneg(lo), VA);
        const wrongs = [across ? between(qneg(hi), qneg(lo), VA) : rays(qneg(hi), qneg(lo), VA), across ? rays(lo, hi, VA) : between(lo, hi, VA), across ? between(lo, hi, VA) : rays(lo, hi, VA)];
        const fam = famH([[0, 1, X], [1, 0, Y], [-Fp[1], -Fp[0], '']], VA);
        return pick(d, `두 점 ${P('A', A[0], A[1])}, ${P('B', Bp[0], Bp[1])}에 대하여 직선 ${fam}${jw(fam, '이/가').slice(fam.length)} 선분 AB와 만나도록 하는 실수 ${VA}의 값의 범위는?`, [[right, true]].concat(wrongs.map((h) => [h, false])), {
          explain: `${nb(`${VA}(${poly([[1, X], [-Fp[0], '']])}) + (${poly([[1, Y], [-Fp[1], '']])}) = 0`)}이므로 이 직선은 ${VA}의 값에 관계없이 점 ${ptj(Fp[0], Fp[1], '을/를')} 지나고 기울기는 ${MINUS}${VA}이다. 이 점과 A, B를 잇는 직선의 기울기는 각각 ${iq(sA)}, ${iq(sB)}이다. ${across ? `A, B가 직선 ${nb(`${X} = ${iq(Fp[0])}`)}의 서로 다른 쪽에 있으므로 기울기는 ${iq(lo)} 이하이거나 ${iq(hi)} 이상이어야 한다.` : `A, B가 직선 ${nb(`${X} = ${iq(Fp[0])}`)}의 같은 쪽에 있으므로 기울기는 ${iq(lo)} 이상 ${iq(hi)} 이하이어야 한다.`} 기울기가 ${MINUS}${VA}이므로 ${right}이다.`
        });
      }
      if (n === 1) {
        // m(x − x0) − (y − y0) = 0: 정점 F 는 삼각형의 왼쪽에 있다. 기울기 m 의 범위는 세 꼭짓점까지의 기울기 가운데 가장 작은 것과 가장 큰 것 사이
        const Fp = [d.int(-5, -2), d.int(-3, 3)], pts = [0, 1, 2].map(() => [d.int(Fp[0] + 1, 6), d.int(-5, 6)]);
        if ((pts[1][0] - pts[0][0]) * (pts[2][1] - pts[0][1]) === (pts[2][0] - pts[0][0]) * (pts[1][1] - pts[0][1])) return null;
        const sl = pts.map((p) => Q(p[1] - Fp[1], p[0] - Fp[0]));
        if (new Set(sl.map((s) => s.p + '/' + s.q)).size < 3 || sl.some((s) => s.q > 6)) return null;
        const ord = [0, 1, 2].sort((i, j) => qcmp(sl[i], sl[j])), lo = sl[ord[0]], mid = sl[ord[1]], hi = sl[ord[2]];
        const fam = famH([[0, 1, X], [-1, 0, Y], [Fp[1], -Fp[0], '']], VM);
        const [A, Bp, Cp] = pts;
        return pick(d, `세 점 ${P('A', A[0], A[1])}, ${P('B', Bp[0], Bp[1])}, ${Pj('C', Cp[0], Cp[1], '을/를')} 꼭짓점으로 하는 삼각형 ABC와 직선 ${fam}${jw(fam, '이/가').slice(fam.length)} 만나도록 하는 실수 ${VM}의 값의 범위는?`,
          [[between(lo, hi, VM), true], [between(lo, mid, VM), false], [between(mid, hi, VM), false], [between(qneg(hi), qneg(lo), VM), false]], {
            explain: `${nb(`${VM}(${poly([[1, X], [-Fp[0], '']])}) ${MINUS} (${poly([[1, Y], [-Fp[1], '']])}) = 0`)}이므로 이 직선은 ${VM}의 값에 관계없이 점 ${ptj(Fp[0], Fp[1], '을/를')} 지나고 기울기는 ${VM}이다. 이 점과 세 꼭짓점을 잇는 직선의 기울기는 ${sl.map(iq).join(', ')}이고, 삼각형은 이 점의 오른쪽에 있으므로 ${between(lo, hi, VM)}이다.`
          });
      }
      // 제1사분면에서 만나기: 직선 x + y − c = 0 과, 정점 F(제3사분면)를 지나는 m(x − x0) + (y − y0) = 0
      const c = d.int(2, 6), Fp = [d.int(-4, -1), d.int(-4, -1)], s1 = Q(-Fp[1], c - Fp[0]), s2 = Q(c - Fp[1], -Fp[0]);
      const lo = qneg(s2), hi = qneg(s1), fam = famH([[0, 1, X], [1, 0, Y], [-Fp[1], -Fp[0], '']], VM);
      return pick(d, `두 직선 ${nb(`${X} + ${Y} ${MINUS} ${c} = 0`)}, ${fam}${jw(fam, '이/가').slice(fam.length)} 제1사분면에서 만나도록 하는 실수 ${VM}의 값의 범위는?`,
        [[between(lo, hi, VM, true), true], [between(lo, hi, VM), false], [between(s1, s2, VM, true), false], [between(s1, s2, VM), false]], {
          explain: `둘째 직선은 ${VM}의 값에 관계없이 점 ${ptj(Fp[0], Fp[1], '을/를')} 지나고 기울기는 ${MINUS}${VM}이다. 첫째 직선이 제1사분면에 놓인 부분은 두 점 ${pt(c, 0)}, ${pt(0, c)} 사이(두 끝 점은 축 위라 빠진다)이고, 정점과 두 끝 점을 잇는 직선의 기울기는 ${iq(s1)}, ${iq(s2)}이다. ${nb(`${iq(s1)} &lt; ${MINUS}${VM} &lt; ${iq(s2)}`)}이므로 ${between(lo, hi, VM, true)}이다.`
        });
    }, { count: 3 }),
    T('line-bisect-rects', '두 직사각형의 넓이를 동시에 이등분하는 직선', '②11', (d) => {
      const r = () => { const w = d.int(1, 2), h = d.int(1, 2), x0 = d.int(-6, 6 - 2 * w), y0 = d.int(-6, 6 - 2 * h); return { x0, y0, x1: x0 + 2 * w, y1: y0 + 2 * h, cx: x0 + w, cy: y0 + h }; };
      const a = r(), b = r();
      if (a.cx === b.cx || (b.cy - a.cy) % (b.cx - a.cx) !== 0 || b.cy === a.cy) return null;
      if (!(a.x1 < b.x0 || b.x1 < a.x0 || a.y1 < b.y0 || b.y1 < a.y0)) return null;
      // 직사각형이 축에 닿거나 축을 가로지르면 변이 눈금 수와 겹친다: 한 사분면 안에만 둔다.
      if ([a, b].some((t) => !(t.x1 < 0 || t.x0 > 0) || !(t.y1 < 0 || t.y0 > 0))) return null;
      const m = (b.cy - a.cy) / (b.cx - a.cx), k = a.cy - m * a.cx;
      if (k === 0 || Math.abs(m) > 4) return null;
      const segs = [a, b].flatMap((t) => [[t.x0, t.y0, t.x1, t.y0], [t.x1, t.y0, t.x1, t.y1], [t.x1, t.y1, t.x0, t.y1], [t.x0, t.y1, t.x0, t.y0]]);
      const corner = (t) => [pt(t.x0, t.y0), pt(t.x1, t.y0), pt(t.x1, t.y1), pt(t.x0, t.y1)].join(', ').replace(/<[^>]+>/g, '');
      const figure = plane({ x: [-6, 6], y: [-6, 6], segs, ticks: [-6, -4, -2, 2, 4, 6], say: `직사각형 두 개. 한 직사각형의 네 꼭짓점은 ${corner(a)}이고, 다른 직사각형의 네 꼭짓점은 ${corner(b)}이다.` });
      return lineAns('그림과 같이 좌표평면 위에 두 직사각형이 있다. 두 직사각형의 넓이를 동시에 이등분하는 직선의 방정식은?', m, k, {
        figure,
        explain: `직사각형의 넓이를 이등분하는 직선은 두 대각선의 교점을 지난다. 두 직사각형의 대각선의 교점은 ${pt(a.cx, a.cy)}, ${pt(b.cx, b.cy)}이므로 이 두 점을 지나는 직선 ${slopeH(m, k)}이다.`,
        facts: { calc: [[`((${jn(b.y0)}+${jn(b.y1)})/2-(${jn(a.y0)}+${jn(a.y1)})/2)/((${jn(b.x0)}+${jn(b.x1)})/2-(${jn(a.x0)}+${jn(a.x1)})/2)`, 0], [`(${jn(a.y0)}+${jn(a.y1)})/2-((${jn(b.y0)}+${jn(b.y1)})/2-(${jn(a.y0)}+${jn(a.y1)})/2)/((${jn(b.x0)}+${jn(b.x1)})/2-(${jn(a.x0)}+${jn(a.x1)})/2)*(${jn(a.x0)}+${jn(a.x1)})/2`, 1]], derived: [2] }
      });
    })
  ];

  // ── 두 직선의 평행과 수직 ──
  // 기울기가 u/v 인 직선을 정수 계수 일반형으로: ux − vy + c = 0
  const bySlope = (s, c) => norm(s.p, -s.q, c);
  const ppTypes = [
    T('pp-perp-pick', '수직인 직선 찾기', '②14', (d, n) => {
      const p = nz(d, -3, 3), q = d.int(1, 3);
      if (Math.abs(p) === q || gcd(Math.abs(p), q) !== 1) return null;
      const s1 = Q(p, q), s2 = Q(-q, p), s3 = Q(q, p);       // s3: 역수만 취하고 부호를 그대로 둔 기울기(틀린 짝을 부르는 직선)
      const cs = () => nz(d, -6, 6);
      if (n === 0) {
        const s4 = d.pick([qmul(s1, Q(2)), qmul(s1, Q(1, 2)), qadd(s1, Q(1)), Q(-p * 2, q)]);
        const all = [s1, s2, s3, s4];
        if (new Set(all.map((s) => s.p + '/' + s.q)).size < 4 || s4.p === 0) return null;
        for (let i = 0; i < 4; i += 1) for (let j = i + 1; j < 4; j += 1) { const pr = qmul(all[i], all[j]); if (pr.p === -pr.q && !(i === 0 && j === 1)) return null; }
        const order = d.shuffle([0, 1, 2, 3]), ls = order.map((i) => (all[i].q === 1 && d.bool() ? { slope: all[i], k: cs() } : bySlope(all[i], cs())));
        const show = (l) => (l.slope ? slopeH(l.slope, l.k) : lh(l)), at = (i) => order.indexOf(i);
        const pairs = []; for (let i = 0; i < 4; i += 1) for (let j = i + 1; j < 4; j += 1) pairs.push([i, j]);
        const isPerp = ([i, j]) => { const pr = qmul(all[order[i]], all[order[j]]); return pr.p === -pr.q; };
        const right = pairs.find(isPerp), wrong = d.shuffle(pairs.filter((pr) => !isPerp(pr))).slice(0, 4);
        return pick(d, '다음 직선 가운데 서로 수직인 것끼리 짝 지은 것은?', [right].concat(wrong).map((pr) => [`${HAN[pr[0]]}, ${HAN[pr[1]]}`, isPerp(pr)]), {
          figure: tagged(ls.map(show)),
          explain: `기울기는 차례로 ${ls.map((l, i) => iq(all[order[i]])).join(', ')}이다. 두 기울기의 곱이 −1인 것은 ${HAN[right[0]]}과 ${HAN[right[1]]}이다.`
        });
      }
      // 한 직선 L 에 평행한 것(일치하는 것과 가린다)과 수직인 것(역수만 취한 것과 가린다)
      const c0 = cs(), L = bySlope(s1, c0), par1 = bySlope(s1, d.until(() => cs(), (c) => c !== c0 * 1 && bySlope(s1, c).c !== L.c)), same = { a: 2 * L.a, b: 2 * L.b, c: 2 * L.c }, perp = bySlope(s2, cs()), recip = bySlope(s3, cs());
      const items = d.shuffle([['par', par1], ['same', same], ['perp', perp], ['recip', recip]]), at = (k) => items.findIndex((it) => it[0] === k);
      const rowsH = (a, b) => `평행: ${HAN[a]}, 수직: ${HAN[b]}`;
      return pick(d, `다음 직선 가운데 직선 ${lh(L)}에 평행한 직선과 수직인 직선을 바르게 짝 지은 것은?`, [[rowsH(at('par'), at('perp')), true], [rowsH(at('same'), at('perp')), false], [rowsH(at('par'), at('recip')), false], [rowsH(at('perp'), at('par')), false], [rowsH(at('same'), at('recip')), false]], {
        figure: tagged(items.map((it) => lh(it[1]))),
        explain: `직선 ${lh(L)}의 기울기는 ${iq(s1)}이다. ${HAN[at('same')]}은 양변을 2로 나누면 이 직선과 같아 일치하는 직선이고, ${HAN[at('par')]}은 기울기가 같고 ${Y}절편이 달라 평행하다. ${HAN[at('perp')]}은 기울기가 ${jw(iq(s2), '으로/로')} 곱이 −1이라 수직이고, ${HAN[at('recip')]}은 기울기의 곱이 1이라 수직이 아니다.`
      });
    }, { count: 2 }),
    T('pp-perp-line', '한 점을 지나고 주어진 직선에 수직인 직선의 방정식', '②16', (d, n) => {
      const m = pm(d) * d.int(2, 4), x0 = d.int(-5, 5), y0 = d.int(-5, 5), k = y0 - m * x0;
      if (k === 0 || Math.abs(k) > 20) return null;
      if (n === 0) {
        const s = Q(-1, m), c = nz(d, -5, 5);
        return lineAns(`점 ${ptj(x0, y0, '을/를')} 지나고 직선 ${slopeH(s, c)}에 수직인 직선의 방정식은?`, m, k, {
          explain: `직선 ${slopeH(s, c)}의 기울기가 ${iq(s)}이므로 수직인 직선의 기울기는 ${iq(m)}이다. ${psH(m, x0, y0)}, 곧 ${slopeH(m, k)}이다.`,
          facts: { calc: [[`(0-${s.q})/${jn(s.p)}`, 0], [`${jn(y0)}-((0-${s.q})/${jn(s.p)})*${jn(x0)}`, 1]] }
        });
      }
      const t = d.int(1, 2), L = norm(t, t * m, nz(d, -7, 7));
      return lineAns(`점 ${ptj(x0, y0, '을/를')} 지나고 직선 ${lh(L)}에 수직인 직선의 방정식은?`, m, k, {
        explain: `직선 ${lh(L)}의 기울기는 ${iq(slopeQ(L))}이므로 수직인 직선의 기울기는 ${iq(m)}이다. ${psH(m, x0, y0)}, 곧 ${slopeH(m, k)}이다.`,
        facts: { calc: [[`${jn(L.b)}/${jn(L.a)}`, 0], [`${jn(y0)}-${jn(L.b)}/${jn(L.a)}*${jn(x0)}`, 1]] }
      });
    }, { count: 2 }),
    T('pp-perp-two-points', '두 점을 지나는 직선에 수직인 직선의 방정식', '②17', (d, n) => {
      const m = pm(d) * d.int(1, 3) * (d.bool() ? 1 : 2), u = nz(d, -2, 2), P1 = [d.int(-5, 5), d.int(-5, 5)], P2 = add(P1, [m * u, -u]);
      if (!inBox([P2]) || Math.abs(m) === 1) return null;
      const Qp = n === 0 ? [d.int(-5, 5), d.int(-5, 5)] : [nz(d, -5, 5), 0], k = Qp[1] - m * Qp[0];
      if (k === 0 || Math.abs(k) > 24) return null;
      const mE = `(0-${df(P2[0], P1[0])}/${df(P2[1], P1[1])})`;
      return lineAns(`두 점 ${pt(P1[0], P1[1])}, ${ptj(P2[0], P2[1], '을/를')} 지나는 직선에 수직이고 ${n === 0 ? `점 ${ptj(Qp[0], Qp[1], '을/를')} 지나는` : `${X}절편이 ${nj(Qp[0], '인/인')}`} 직선의 방정식은?`, m, k, {
        explain: `두 점을 지나는 직선의 기울기는 ${frac(`${iq(P2[1])} ${MINUS} ${par(P1[1])}`, `${iq(P2[0])} ${MINUS} ${par(P1[0])}`)} = ${iq(Q(-1, m))}이므로 수직인 직선의 기울기는 ${iq(m)}이다. ${n === 1 ? `${X}절편이 ${iq(Qp[0])}이므로 점 ${ptj(Qp[0], 0, '을/를')} 지난다. ` : ''}${psH(m, Qp[0], Qp[1])}, 곧 ${slopeH(m, k)}이다.`,
        facts: { calc: [[mE, 0], [`${jn(Qp[1])}-${mE}*${jn(Qp[0])}`, 1]] }
      });
    }, { count: 2 }),
    T('pp-meet-perp', '두 직선의 교점을 지나고 주어진 직선에 수직인 직선', '②18', (d) => {
      const Fp = [d.int(-5, 5), d.int(-5, 5)], l1 = lineThrough(d, Fp, (l) => l.a !== 0 && l.b !== 0), l2 = lineThrough(d, Fp, (l) => l.a !== 0 && l.b !== 0 && l.a * l1.b !== l.b * l1.a);
      const m = pm(d) * d.int(2, 4), a3 = d.int(1, 2), L3 = norm(a3, a3 * m, nz(d, -6, 6)), k = Fp[1] - m * Fp[0];
      if (k === 0 || onL(L3, Fp)) return null;
      return lineAns(`두 직선 ${lh(l1)}, ${lh(l2)}의 교점을 지나고 직선 ${lh(L3)}에 수직인 직선의 방정식은?`, m, k, {
        explain: `두 직선의 방정식을 연립하여 풀면 교점은 ${pt(Fp[0], Fp[1])}이다. 직선 ${lh(L3)}의 기울기는 ${iq(slopeQ(L3))}이므로 수직인 직선의 기울기는 ${iq(m)}이고, 구하는 직선은 ${slopeH(m, k)}이다.`,
        facts: { calc: [[`${jn(L3.b)}/${jn(L3.a)}`, 0], [`${meetY(l1, l2)}-${jn(L3.b)}/${jn(L3.a)}*${meetX(l1, l2)}`, 1]] }
      });
    }),
    T('pp-perp-through', '수직인 직선이 다른 점을 지날 때의 미지수', '②19', (d) => {
      const m = pm(d) * d.int(1, 3), t = d.int(1, 2), L = norm(t, t * m, nz(d, -6, 6)), onY = d.bool();
      const P2 = [d.int(-5, 5), d.int(-5, 5)], x1 = onY ? d.int(-5, 5) : null, y1 = onY ? null : d.int(-5, 5);
      if (onY) {
        if (x1 === P2[0]) return null;
        const a = P2[1] + m * (x1 - P2[0]);
        return N(`점 ${ptj(x1, VA, '을/를')} 지나고 직선 ${lh(L)}에 수직인 직선이 점 ${ptj(P2[0], P2[1], '을/를')} 지날 때, 상수 ${VA}의 값은?`, a, {
          signed: true,
          explain: `직선 ${lh(L)}의 기울기는 ${iq(slopeQ(L))}이므로 수직인 직선의 기울기는 ${iq(m)}이다. 점 ${ptj(P2[0], P2[1], '을/를')} 지나는 이 직선은 ${slopeH(m, P2[1] - m * P2[0])}이고, ${nb(`${X} = ${iq(x1)}`)}일 때 ${Y} = ${iq(a)}이므로 ${VA} = ${iq(a)}이다.`,
          facts: { calc: [[`${jn(P2[1])}+${jn(L.b)}/${jn(L.a)}*(${jn(x1)}-${jn(P2[0])})`, 0]] }
        });
      }
      if (y1 === P2[1] || (y1 - P2[1]) % m !== 0) return null;
      const a = P2[0] + (y1 - P2[1]) / m;
      return N(`점 ${ptj(VA, y1, '을/를')} 지나고 직선 ${lh(L)}에 수직인 직선이 점 ${ptj(P2[0], P2[1], '을/를')} 지날 때, 상수 ${VA}의 값은?`, a, {
        signed: true,
        explain: `직선 ${lh(L)}의 기울기는 ${iq(slopeQ(L))}이므로 수직인 직선의 기울기는 ${iq(m)}이다. 점 ${ptj(P2[0], P2[1], '을/를')} 지나는 이 직선은 ${slopeH(m, P2[1] - m * P2[0])}이고, ${nb(`${Y} = ${iq(y1)}`)}일 때 ${X} = ${iq(a)}이므로 ${VA} = ${iq(a)}이다.`,
        facts: { calc: [[`${jn(P2[0])}+(${jn(y1)}-${jn(P2[1])})/(${jn(L.b)}/${jn(L.a)})`, 0]] }
      });
    }),
    T('pp-coef', '평행 조건과 수직 조건으로 계수 구하기', '②20 심5', (d) => {
      const a2 = nz(d, -4, 4), b2 = nz(d, -4, 4), g = Math.abs(a2 * b2) / gcd(Math.abs(a2), Math.abs(b2)), b1 = pm(d) * g * d.int(1, 2), c1 = nz(d, -6, 6), c2 = nz(d, -6, 6);
      const ap = a2 * b1 / b2, aq = -b1 * b2 / a2;
      if (!Number.isInteger(ap) || !Number.isInteger(aq) || ap === aq || ap === 0 || aq === 0 || c1 * b2 === c2 * b1 || Math.abs(b1) > 12 || gcd(gcd(Math.abs(a2), Math.abs(b2)), Math.abs(c2)) !== 1) return null;
      const L1 = nb(`${VA}${X} ${b1 < 0 ? MINUS : '+'} ${Math.abs(b1) === 1 ? '' : Math.abs(b1)}${Y} ${c1 < 0 ? MINUS : '+'} ${Math.abs(c1)} = 0`), L2 = genH(a2, b2, c2);
      return M(`두 직선 ${L1}, ${L2}에 대하여 두 직선이 서로 평행할 때의 상수 ${VA}의 값과 서로 수직일 때의 상수 ${VA}의 값은?`, [{ label: '평행할 때', answer: ap, signed: true }, { label: '수직일 때', answer: aq, signed: true }], {
        shown: `평행할 때 ${VA} = ${iq(ap)}, 수직일 때 ${VA} = ${iq(aq)}`,
        explain: `두 직선의 기울기는 ${nb(`${MINUS}${frac(VA, b1 < 0 ? `(${iq(b1)})` : b1)}`)}, ${iq(Q(-a2, b2))}이다. 평행하려면 기울기가 같아야 하므로 ${VA} = ${iq(ap)}(이때 ${Y}절편은 서로 다르다), 수직이려면 ${nb(`${VA} × ${par(a2)} + ${par(b1)} × ${par(b2)} = 0`)}이므로 ${VA} = ${iq(aq)}이다.`,
        facts: { calc: [[`${jn(a2)}*${jn(b1)}/${jn(b2)}`, 0], [`(0-${jn(b1)}*${jn(b2)})/${jn(a2)}`, 1]] }
      });
    }),
    T('pp-two-conditions', '수직 조건과 평행 조건으로 두 계수 구하기', '②21', (d) => {
      const p = nz(d, -3, 3), q = nz(d, -3, 3), L0 = norm(p, q, nz(d, -6, 6));
      if (Math.abs(L0.a) === Math.abs(L0.b)) return null;
      const b1 = L0.a * nz(d, -2, 2), a = -b1 * L0.b / L0.a, c1 = nz(d, -6, 6), b2 = L0.b * nz(d, -2, 2), e = d.int(-4, 4), b = L0.a * b2 / L0.b - e, c2 = nz(d, -6, 6);
      if (!Number.isInteger(a) || a === 0 || !Number.isInteger(b) || c2 * L0.b === L0.c * b2 || Math.abs(b) > 12 || Math.abs(a) > 12) return null;
      const L1 = nb(`${VA}${X} ${b1 < 0 ? MINUS : '+'} ${Math.abs(b1) === 1 ? '' : Math.abs(b1)}${Y} ${c1 < 0 ? MINUS : '+'} ${Math.abs(c1)} = 0`);
      const bx = e === 0 ? VB : `(${poly([[1, VB], [e, '']])})`, L2 = nb(`${bx}${X} ${b2 < 0 ? MINUS : '+'} ${Math.abs(b2) === 1 ? '' : Math.abs(b2)}${Y} ${c2 < 0 ? MINUS : '+'} ${Math.abs(c2)} = 0`);
      return vals(`직선 ${lh(L0)}에 직선 ${L1}${jw(L1, '은/는').slice(L1.length)} 수직이고 직선 ${L2}${jw(L2, '은/는').slice(L2.length)} 평행할 때, 상수 ${VA}, ${VB}의 값은?`, [[VA, a], [VB, b]], {
        explain: `직선 ${lh(L0)}의 기울기는 ${iq(slopeQ(L0))}이다. 수직이므로 ${nb(`${VA} × ${par(L0.a)} + ${par(b1)} × ${par(L0.b)} = 0`)}에서 ${VA} = ${iq(a)}, 평행하므로 기울기가 같아 ${nb(`${MINUS}${frac(bx, b2 < 0 ? `(${iq(b2)})` : b2)} = ${iq(slopeQ(L0))}`)}에서 ${VB} = ${iq(b)}이다.`,
        facts: { calc: [[`(0-${jn(b1)}*${jn(L0.b)})/${jn(L0.a)}`, 0], [`${jn(L0.a)}*${jn(b2)}/${jn(L0.b)}-${jn(e)}`, 1]] }
      });
    }),
    T('pp-two-conditions-sym', '수직 조건과 평행 조건으로 a² + b²의 값 구하기', '②21', (d) => {
      const p = nz(d, -4, 4), s = nz(d, -5, 5), c = nz(d, -5, 5), r = nz(d, -5, 5), t = nz(d, -6, 6);
      if (s * s - 4 * p <= 0 || t === c || isSq(s * s - 4 * p)) return null;
      const L = nb(`${X} + ${VA}${Y} ${c < 0 ? MINUS : '+'} ${Math.abs(c)} = 0`), Mh = nb(`${cv(p, X)} ${MINUS} ${VB}${Y} ${r < 0 ? MINUS : '+'} ${Math.abs(r)} = 0`), Nh = nb(`${X} ${MINUS} (${poly([[1, VB], [s, '']])})${Y} ${t < 0 ? MINUS : '+'} ${Math.abs(t)} = 0`);
      const v = s * s - 2 * p;
      return N(`직선 ${L}${jw(L, '이/가').slice(L.length)} 직선 ${Mh}에 수직이고 직선 ${Nh}에 평행할 때, 상수 ${VA}, ${VB}에 대하여 ${nb(`${VA}${sup(2)} + ${VB}${sup(2)}`)}의 값은?`, v, {
        explain: `수직이므로 ${nb(`1 × ${par(p)} + ${VA} × (${MINUS}${VB}) = 0`)}에서 ${nb(`${VA}${VB} = ${iq(p)}`)}이다. 평행하므로 ${nb(`${MINUS}${frac(1, VA)} = ${frac(1, poly([[1, VB], [s, '']]))}`)}에서 ${nb(`${VA} + ${VB} = ${iq(-s)}`)}이다. 따라서 ${nb(`${VA}${sup(2)} + ${VB}${sup(2)} = (${VA} + ${VB})${sup(2)} ${MINUS} 2${VA}${VB}`)} ${nb(`= ${par(-s)}${sup(2)} ${MINUS} 2 × ${par(p)} = ${v}`)}이다(이 조건을 만족시키는 ${VA}, ${VB}는 두 쌍이지만 ${nb(`${VA}${sup(2)} + ${VB}${sup(2)}`)}의 값은 하나이다).`,
        facts: { calc: [[`${jn(s)}*${jn(s)}-2*${jn(p)}`, 0]], derived: [2] }
      });
    }),
    T('pp-perp-at-point', '두 직선이 한 점에서 수직으로 만날 때의 계수', '②22', (d) => {
      const Fp = [nz(d, -4, 4), d.int(-5, 5)], b1 = nz(d, -3, 3), b = nz(d, -3, 3), a = b1 * b, c1 = -(a * Fp[0] + b1 * Fp[1]), c = b * Fp[1] - Fp[0];
      if (c1 === 0 || c === 0 || Math.abs(c1) > 20) return null;
      const L1 = nb(`${VA}${X} ${b1 < 0 ? MINUS : '+'} ${Math.abs(b1) === 1 ? '' : Math.abs(b1)}${Y} ${c1 < 0 ? MINUS : '+'} ${Math.abs(c1)} = 0`), L2 = nb(`${X} ${MINUS} ${VB}${Y} + ${VC} = 0`);
      return vals(`두 직선 ${L1}, ${L2}${jw(L2, '이/가').slice(L2.length)} 점 ${pt(Fp[0], Fp[1])}에서 수직으로 만날 때, 상수 ${VA}, ${VB}, ${VC}의 값은?`, [[VA, a], [VB, b], [VC, c]], {
        explain: `첫째 직선이 점 ${ptj(Fp[0], Fp[1], '을/를')} 지나므로 ${VA} = ${iq(a)}이다. 두 직선의 기울기 ${iq(Q(-a, b1))}, ${frac(1, VB)}의 곱이 −1이므로 ${VB} = ${iq(b)}, 둘째 직선이 점 ${ptj(Fp[0], Fp[1], '을/를')} 지나므로 ${VC} = ${iq(c)}이다.`,
        facts: { calc: [[`(0-(${jn(b1)}*${jn(Fp[1])}+${jn(c1)}))/${jn(Fp[0])}`, 0], [`(0-(${jn(b1)}*${jn(Fp[1])}+${jn(c1)}))/(${jn(Fp[0])}*${jn(b1)})`, 1], [`(0-(${jn(b1)}*${jn(Fp[1])}+${jn(c1)}))/(${jn(Fp[0])}*${jn(b1)})*${jn(Fp[1])}-${jn(Fp[0])}`, 2]] }
      });
    }),
    T('pp-perp-coef-point', '주어진 직선에 수직이고 한 점을 지날 때의 계수', '②22', (d) => {
      const L0 = norm(nz(d, -3, 3), nz(d, -3, 3), nz(d, -6, 6)), g = gcd(Math.abs(L0.a), Math.abs(L0.b)), lam = nz(d, -2, 2), a = lam * L0.b / g, b = -lam * L0.a / g, Fp = [d.int(-5, 5), d.int(-5, 5)], k = a * Fp[0] + b * Fp[1];
      if (k === 0 || a === 0 || b === 0) return null;
      const Lh = nb(`${VA}${X} + ${VB}${Y} ${k < 0 ? '+' : MINUS} ${Math.abs(k)} = 0`);
      return vals(`직선 ${Lh}${jw(Lh, '이/가').slice(Lh.length)} 직선 ${lh(L0)}에 수직이고 점 ${ptj(Fp[0], Fp[1], '을/를')} 지날 때, 상수 ${VA}, ${VB}의 값은?`, [[VA, a], [VB, b]], {
        explain: `수직이므로 ${nb(`${poly([[L0.a, VA], [L0.b, VB]])} = 0`)}, 점을 지나므로 ${nb(`${poly([[Fp[0], VA], [Fp[1], VB]])} = ${iq(k)}`)}이다. 연립하여 풀면 ${VA} = ${iq(a)}, ${VB} = ${iq(b)}이다.`,
        facts: { calc: [[`${jn(k)}*${jn(L0.b)}/(${jn(L0.b)}*${jn(Fp[0])}-${jn(L0.a)}*${jn(Fp[1])})`, 0], [`(0-${jn(k)}*${jn(L0.a)})/(${jn(L0.b)}*${jn(Fp[0])}-${jn(L0.a)}*${jn(Fp[1])})`, 1]] }
      });
    }),
    T('pp-perp-on-axis', '두 직선이 y축 위에서 수직으로 만날 때', '②22', (d) => {
      const x1 = nz(d, -6, 6), c = d.int(-5, 5), y1 = d.int(-6, 6), dy = y1 - c;
      if (dy === 0 || x1 % dy !== 0) return null;
      const k = -x1 / dy;
      if (k === 0) return null;
      const Lh = nb(`${VK}${X} ${MINUS} ${Y}${c === 0 ? '' : ` ${c < 0 ? MINUS : '+'} ${Math.abs(c)}`} = 0`);
      return N(`점 ${ptj(x1, y1, '을/를')} 지나는 직선과 직선 ${Lh}${jw(Lh, '이/가').slice(Lh.length)} ${Y}축 위에서 수직으로 만날 때, 상수 ${VK}의 값은?`, k, {
        signed: true,
        explain: `직선 ${Lh}${jw(Lh, '은/는').slice(Lh.length)} ${Y}축과 점 ${pt(0, c)}에서 만나므로 다른 직선은 두 점 ${pt(x1, y1)}, ${ptj(0, c, '을/를')} 지난다. 그 기울기는 ${frac(`${iq(y1)} ${MINUS} ${par(c)}`, `${iq(x1)} ${MINUS} 0`)} = ${iq(Q(dy, x1))}이고, 직선 ${Lh}의 기울기 ${VK}와의 곱이 −1이므로 ${VK} = ${iq(k)}이다.`,
        facts: { calc: [[`(0-${jn(x1)})/(${jn(y1)}-${jn(c)})`, 0]] }
      });
    }),
    T('pp-bisector', '선분의 수직이등분선의 방정식', '②23', (d) => {
      const m = pm(d) * d.int(2, 3), j = nz(d, -2, 2), A = [d.int(-6, 6), d.int(-6, 6)], Bp = add(A, mul([m, -1], 2 * j)), Mm = add(A, mul([m, -1], j)), k = Mm[1] - m * Mm[0];
      if (!inBox([Bp]) || k === 0 || Math.abs(k) > 24) return null;
      const mE = `(0-${df(Bp[0], A[0])}/${df(Bp[1], A[1])})`;
      return lineAns(`두 점 ${P('A', A[0], A[1])}, ${Pj('B', Bp[0], Bp[1], '을/를')} 이은 선분 AB의 수직이등분선의 방정식은?`, m, k, {
        explain: `직선 AB의 기울기는 ${iq(Q(-1, m))}이므로 수직이등분선의 기울기는 ${iq(m)}이고, 선분 AB의 중점 ${ptj(Mm[0], Mm[1], '을/를')} 지난다. 따라서 ${slopeH(m, k)}이다.`,
        facts: { calc: [[mE, 0], [`(${jn(A[1])}+${jn(Bp[1])})/2-${mE}*(${jn(A[0])}+${jn(Bp[0])})/2`, 1]], derived: [2] }
      });
    }),
    T('pp-bisector-area', '수직이등분선과 두 좌표축으로 둘러싸인 넓이', '②23', (d) => {
      const m = pm(d) * d.int(1, 3), j = nz(d, -2, 2), A = [d.int(-6, 6), d.int(-6, 6)], Bp = add(A, mul([m, -1], 2 * j)), Mm = add(A, mul([m, -1], j)), k = Mm[1] - m * Mm[0];
      if (!inBox([Bp]) || k === 0 || (k * k) % (2 * Math.abs(m)) !== 0 || Math.abs(k) > 12) return null;
      const area = k * k / (2 * Math.abs(m)), mE = `(0-${df(Bp[0], A[0])}/${df(Bp[1], A[1])})`, kE = `((${jn(A[1])}+${jn(Bp[1])})/2-${mE}*(${jn(A[0])}+${jn(Bp[0])})/2)`;
      return N(`두 점 ${P('A', A[0], A[1])}, ${Pj('B', Bp[0], Bp[1], '을/를')} 이은 선분 AB의 수직이등분선과 ${X}축, ${Y}축으로 둘러싸인 도형의 넓이는?`, area, {
        explain: `수직이등분선은 기울기가 ${iq(m)}이고 중점 ${ptj(Mm[0], Mm[1], '을/를')} 지나므로 ${slopeH(m, k)}이다. ${X}절편은 ${iq(Q(-k, m))}, ${Y}절편은 ${iq(k)}이므로 넓이는 ${frac(1, 2)} × ${iq(Q(Math.abs(k), Math.abs(m)))} × ${Math.abs(k)} = ${area}이다.`,
        facts: { calc: [[`${kE}*${kE}/(2*${m < 0 ? `(0-${mE})` : mE})`, 0]], derived: [2] }
      });
    }),
    T('pp-square-diagonal', '정사각형의 대각선이 놓인 직선', '②23', (d) => {
      const q = d.pick([1, -1, 2, -2]), p = q * nz(d, -4, 4), m = -p / q, k = (p * p + q * q) / (2 * q);
      if (!Number.isInteger(k) || Math.abs(p) > 7 || k === 0 || Math.abs(m) === 1) return null;
      const A = [Q(p + q, 2), Q(q - p, 2)], Cp = [Q(p - q, 2), Q(q + p, 2)];
      const all = [0, p, fl(A[0]), fl(Cp[0])], ally = [0, q, fl(A[1]), fl(Cp[1])], lo = Math.floor(Math.min(...all, ...ally)) - 1, hi = Math.ceil(Math.max(...all, ...ally)) + 1;
      // 모눈과 눈금을 그리지 않는다(A, C의 좌표를 그림에서 세어 읽지 않게). 그림 설명에도 좌표를 적지 않는다.
      const out = (P0) => (fl(asQ(P0[1])) * 2 > q ? 'u' : 'd') + (fl(asQ(P0[0])) * 2 > p ? 'r' : 'l');   // 정사각형의 중심에서 바깥쪽
      const figure = plane({ x: [lo, hi], y: [lo, hi], grid: false, ticks: 'none', oSide: p < 0 ? 'r' : 'l', poly: [[0, 0], A, [p, q], Cp], points: [{ x: A[0], y: A[1], name: 'A', side: out(A) }, { x: p, y: q, name: 'B', side: out([p, q]) }, { x: Cp[0], y: Cp[1], name: 'C', side: out(Cp) }] }).replace(/aria-label="[^"]*"/, 'aria-label="좌표평면 위의 정사각형 OABC. 꼭짓점 O는 원점이고, O와 마주 보는 꼭짓점이 B이다. 모눈과 눈금은 없다."');
      return lineAns(`그림과 같이 사각형 OABC가 정사각형이고 점 B의 좌표가 ${ptj(p, q, '일/일')} 때, 직선 AC의 방정식은? (단, O는 원점이다.)`, m, k, {
        figure,
        explain: `정사각형의 두 대각선은 서로 다른 것을 수직이등분하므로 직선 AC는 선분 OB의 수직이등분선이다. 직선 OB의 기울기가 ${iq(Q(q, p))}이므로 직선 AC의 기울기는 ${iq(m)}이고, 선분 OB의 중점 ${ptj(Q(p, 2), Q(q, 2), '을/를')} 지나므로 ${slopeH(m, k)}이다.`,
        facts: { calc: [[`(0-${jn(p)})/${jn(q)}`, 0], [`(${jn(p)}*${jn(p)}+${jn(q)}*${jn(q)})/(2*${jn(q)})`, 1]], derived: [2] }
      });
    }),
    T('pp-bisector-find', '수직이등분선으로 선분의 끝 점의 미지수 구하기', '②24', (d, n) => {
      if (n === 0) {
        const Mm = [d.int(-5, 5), d.int(-5, 5)], L = through(Mm, nz(d, -3, 3), nz(d, -3, 3)), j = nz(d, -2, 2);
        if (L.c === 0 || Math.abs(L.c) > 12) return null;
        const A = sub(Mm, mul([L.a, L.b], j)), Bp = add(Mm, mul([L.a, L.b], j));
        if (!inBox([A, Bp]) || A[0] === Bp[0]) return null;
        const sumE = `((0-(${jn(L.a)}*(${jn(A[0])}+${jn(Bp[0])})+2*${jn(L.c)}))/${jn(L.b)})`, difE = `(${jn(L.b)}*(${jn(Bp[0])}-${jn(A[0])})/${jn(L.a)})`;
        return vals(`두 점 ${P('A', A[0], VM)}, ${Pj('B', Bp[0], VN, '을/를')} 이은 선분 AB의 수직이등분선이 직선 ${lj(L, '일/일')} 때, 상수 ${VM}, ${VN}의 값은?`, [[VM, A[1]], [VN, Bp[1]]], {
          explain: `직선 AB는 직선 ${lh(L)}에 수직이므로 ${nb(`${frac(`${VN} ${MINUS} ${VM}`, `${iq(Bp[0])} ${MINUS} ${par(A[0])}`)} × ${par(slopeQ(L))} = −1`)}이고, 선분 AB의 중점 ${pt(Q(A[0] + Bp[0], 2), `${frac(`${VM} + ${VN}`, 2)}`)}이 직선 위에 있다. 두 식을 연립하여 풀면 ${VM} = ${iq(A[1])}, ${VN} = ${iq(Bp[1])}이다.`,
          facts: { calc: [[`(${sumE}-${difE})/2`, 0], [`(${sumE}+${difE})/2`, 1]], derived: [2] }
        });
      }
      const s = pm(d) * d.int(1, 3), A = [d.int(-5, 5), d.int(-5, 5)], dx = 2 * s * nz(d, -2, 2), x2 = A[0] + dx, yB = A[1] - dx / s, Mm = [(A[0] + x2) / 2, (A[1] + yB) / 2], v = Mm[1] - s * Mm[0];
      if (!inBox([[x2, yB]]) || !Number.isInteger(v) || v === 0) return null;
      const Lh = nb(`${Y} = ${poly([[s, X]])} + ${VB}`);
      return vals(`두 점 ${P('A', A[0], A[1])}, ${Pj('B', x2, VA, '을/를')} 이은 선분 AB의 수직이등분선이 직선 ${Lh}일 때, 상수 ${VA}, ${VB}의 값은?`, [[VA, yB], [VB, v]], {
        explain: `직선 AB의 기울기는 ${iq(Q(-1, s))}이므로 ${nb(`${frac(`${VA} ${MINUS} ${par(A[1])}`, `${iq(x2)} ${MINUS} ${par(A[0])}`)} = ${iq(Q(-1, s))}`)}에서 ${VA} = ${iq(yB)}이다. 선분 AB의 중점 ${ptj(Mm[0], Mm[1], '이/가')} 직선 위에 있으므로 ${VB} = ${iq(v)}이다.`,
        facts: { calc: [[`${jn(A[1])}-(${jn(x2)}-${jn(A[0])})/${jn(s)}`, 0], [`(${jn(A[1])}+${jn(A[1])}-(${jn(x2)}-${jn(A[0])})/${jn(s)})/2-${jn(s)}*(${jn(A[0])}+${jn(x2)})/2`, 1]], derived: [2] }
      });
    }, { count: 2 }),
    T('pp-perp-at-division', '내분점을 지나고 선분에 수직인 직선', '②25', (d) => {
      const [mm, nn] = d.pick(RATIOS), sl = pm(d) * d.int(1, 3), j = nz(d, -1, 1), A = [d.int(-6, 6), d.int(-6, 6)], Bp = add(A, mul([sl, -1], (mm + nn) * j)), Pp = add(A, mul([sl, -1], mm * j)), k = Pp[1] - sl * Pp[0];
      if (!inBox([Bp], 12) || k === 0 || Math.abs(k) > 24) return null;
      const mE = `(0-${df(Bp[0], A[0])}/${df(Bp[1], A[1])})`, pxE = `((${mm}*${jn(Bp[0])}+${nn}*${jn(A[0])})/(${mm}+${nn}))`, pyE = `((${mm}*${jn(Bp[1])}+${nn}*${jn(A[1])})/(${mm}+${nn}))`;
      return lineAns(`두 점 ${P('A', A[0], A[1])}, ${Pj('B', Bp[0], Bp[1], '을/를')} 이은 선분 AB를 ${ratioj(mm, nn, '으로/로')} 내분하는 점을 지나고 직선 AB에 수직인 직선의 방정식은?`, sl, k, {
        explain: `내분하는 점은 ${pt(Pp[0], Pp[1])}이다. 직선 AB의 기울기는 ${iq(Q(-1, sl))}이므로 수직인 직선의 기울기는 ${iq(sl)}이고, 구하는 직선은 ${slopeH(sl, k)}이다.`,
        facts: { calc: [[mE, 0], [`${pyE}-${mE}*${pxE}`, 1]] }
      });
    })
  ];

  // ── 점과 직선 사이의 거리 ──
  // 길이의 제곱이 제곱인 수를 인수로 갖지 않는 계수 (a, b)
  const SQF = [[1, 1], [1, 2], [2, 1], [1, 3], [3, 1], [2, 3], [3, 2], [1, 4], [4, 1], [1, 5], [5, 1], [2, 5], [5, 2]];
  const sqfPair = (d) => { const [a, b] = d.pick(SQF); return [a, pm(d) * b]; };
  const PY = [[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [6, 8, 10], [8, 6, 10]];
  const pdTypes = [
    T('pd-basic', '점과 직선 사이의 거리', '②30', (d) => {
      const [a0, b0, Nn] = d.pick(PY), a = a0, b = pm(d) * b0, x0 = d.int(-6, 6), y0 = d.int(-6, 6), D = d.int(1, 4), u = pm(d) * D * Nn, c = u - a * x0 - b * y0;
      if (Math.abs(c) > 40) return null;
      const L = norm(a, b, c);
      if (L.a !== a) return null;
      const e = `(${jn(a)}*${jn(x0)}+${jn(b)}*${jn(y0)}+${jn(c)})`;
      return N(`점 ${jw(pt(x0, y0), '과/와')} 직선 ${lh(L)} 사이의 거리는?`, D, {
        explain: `${frac(`|${iq(a)} × ${par(x0)} + ${par(b)} × ${par(y0)} + ${par(c)}|`, rt(`${a}${sup(2)} + ${par(b)}${sup(2)}`))} = ${frac(Math.abs(u), Nn)} = ${D}이다.`,
        facts: { calc: [[`${u < 0 ? `(0-${e})` : e}/${Nn}`, 0]], derived: [Nn] }
      });
    }),
    T('pd-slope-form', 'y = mx + n 꼴로 주어진 직선과 점 사이의 거리', '②30', (d) => {
      const m = pm(d) * d.int(1, 4), S = m * m + 1, x0 = d.int(-5, 5), y0 = d.int(-6, 6), j = d.int(2, 3), u = pm(d) * j * S, k = u - m * x0 + y0;
      if (Math.abs(k) > 30 || k === 0) return null;
      const e = `(${jn(m)}*${jn(x0)}-${jn(y0)}+${jn(k)})`;
      return radLen(`점 ${jw(pt(x0, y0), '과/와')} 직선 ${slopeH(m, k)} 사이의 거리는?`, j, S, {
        explain: `직선의 방정식을 ${genj(m, -1, k, '으로/로')} 고치면 거리는 ${frac(`|${iq(m)} × ${par(x0)} ${MINUS} ${par(y0)} + ${par(k)}|`, rt(`${par(m)}${sup(2)} + (−1)${sup(2)}`))} = ${frac(Math.abs(u), rt(S))} = ${radText(j, S)}이다.`,
        facts: { calc: [[`${u < 0 ? `(0-${e})` : e}/(${jn(m)}*${jn(m)}+1)`, 0], [`${jn(m)}*${jn(m)}+1`, 1]] }
      });
    }),
    T('pd-axis-line', '좌표축에 평행한 직선과 점 사이의 거리', '②31', (d) => {
      const a = d.int(2, 4), c = nz(d, -9, 9), x0 = d.int(-6, 6), y0 = d.int(-6, 6), vert = d.bool(), v = vert ? a * x0 + c : a * y0 + c;
      if (c % a === 0 || v % a === 0 || gcd(a, Math.abs(c)) !== 1) return null;
      const L = vert ? genH(a, 0, c) : genH(0, a, c), q = Q(Math.abs(v), a), e = `(${jn(a)}*${jn(vert ? x0 : y0)}+${jn(c)})`;
      return F(`점 ${jw(pt(x0, y0), '과/와')} 직선 ${L} 사이의 거리는?`, q.p, q.q, {
        improper: q.p > q.q,
        explain: `직선 ${L}${jw(L, '은/는').slice(L.length)} ${nb(`${vert ? X : Y} = ${iq(Q(-c, a))}`)}이므로 ${vert ? Y : X}축에 평행하다. 점과의 거리는 ${vert ? X : Y}좌표의 차 ${nb(`|${iq(vert ? x0 : y0)} ${MINUS} (${iq(Q(-c, a))})|`)} = ${iq(q)}이다.`,
        facts: { value: `${v < 0 ? `(0-${e})` : e}/${a}` }
      });
    }),
    T('pd-parallel-dist', '평행한 두 직선 사이의 거리', '②32', (d) => {
      const [a, b] = sqfPair(d), S = a * a + b * b, j = d.int(2, 3), c1 = d.int(-8, 8), c2 = c1 + pm(d) * j * S, slopeShown = Math.abs(b) === 1 && d.bool();
      if (Math.abs(c2) > 30) return null;
      const L1 = genH(a, b, c1), L2 = slopeShown ? slopeH(-a / b, -c2 / b) : genH(a, b, c2), e = `(${jn(c1)}-${jn(c2)})`;
      return radLen(`평행한 두 직선 ${L1}, ${L2} 사이의 거리는?`, j, S, {
        explain: `${slopeShown ? `직선 ${L2}${jw(L2, '을/를').slice(L2.length)} 고치면 ${genH(a, b, c2)}이다. ` : ''}직선 ${L1} 위의 한 점에서 다른 직선까지의 거리를 구하면 ${frac(`|${iq(c1)} ${MINUS} ${par(c2)}|`, rt(`${a}${sup(2)} + ${par(b)}${sup(2)}`))} = ${frac(j * S, rt(S))} = ${radText(j, S)}이다.`,
        facts: { calc: [[`${c1 < c2 ? `(0-${e})` : e}/(${jn(a)}*${jn(a)}+${jn(b)}*${jn(b)})`, 0], [`${jn(a)}*${jn(a)}+${jn(b)}*${jn(b)}`, 1]] }
      });
    }),
    T('pd-parallel-const', '평행한 두 직선 사이의 거리로 상수 구하기', '②33', (d) => {
      const [a, b] = sqfPair(d), S = a * a + b * b, j = d.int(1, 3), c1 = nz(d, -8, 8);
      return twoVals(`두 직선 ${genH(a, b, c1)}, ${nb(`${poly([[a, X], [b, Y]])} + ${VK} = 0`)} 사이의 거리가 ${radText(j, S)}일 때, 상수 ${VK}의 값은?`, VK, c1 - j * S, c1 + j * S, {
        explain: `두 직선 사이의 거리는 ${frac(`|${VK} ${MINUS} ${par(c1)}|`, rt(`${a}${sup(2)} + ${par(b)}${sup(2)}`))}이므로 ${nb(`|${VK} ${MINUS} ${par(c1)}| = ${j * S}`)}, ${VK} = ${iq(c1 - j * S)} 또는 ${VK} = ${iq(c1 + j * S)}이다.`,
        facts: { calc: [[`${jn(c1)}-${j}*(${jn(a)}*${jn(a)}+${jn(b)}*${jn(b)})`, 0], [`${jn(c1)}+${j}*(${jn(a)}*${jn(a)}+${jn(b)}*${jn(b)})`, 1]] }
      });
    }),
    T('pd-parallel-then-dist', '평행 조건으로 계수를 정한 뒤 두 직선 사이의 거리', '②34', (d) => {
      const [a, b] = sqfPair(d), S = a * a + b * b, lam = pm(d) * d.int(1, 2), m = nz(d, -4, 4), e = lam * a - m, f = lam * b - m, j = d.int(2, 3), c1 = d.int(-6, 6), c2n = c1 + pm(d) * j * S, c2 = lam * c2n;
      if (a === b || e === f || Math.abs(c2) > 30 || Math.abs(e) > 6 || Math.abs(f) > 6) return null;
      const L2 = famH([[e, 1, X], [f, 1, Y], [c2, 0, '']], VM);
      const mE = `((${jn(a)}*${jn(f)}-${jn(b)}*${jn(e)})/(${jn(b)}-${jn(a)}))`, lamE = `((${mE}+${jn(e)})/${jn(a)})`, dE = `(${jn(c1)}-${jn(c2)}/${lamE})`;
      return radLen(`평행한 두 직선 ${genH(a, b, c1)}, ${L2} 사이의 거리는? (단, ${VM}은 상수이다.)`, j, S, {
        explain: `두 직선이 평행하므로 ${nb(`${frac(poly([[1, VM], [e, '']]), a)} = ${frac(poly([[1, VM], [f, '']]), b < 0 ? `(${iq(b)})` : b)}`)}에서 ${VM} = ${iq(m)}이다. 이때 둘째 직선은 ${genH(lam * a, lam * b, c2)}, 곧 ${genH(a, b, c2n)}이므로 두 직선 사이의 거리는 ${frac(`|${iq(c1)} ${MINUS} ${par(c2n)}|`, rt(S))} = ${radText(j, S)}이다.`,
        facts: { calc: [[`${c1 < c2n ? `(0-${dE})` : dE}/(${jn(a)}*${jn(a)}+${jn(b)}*${jn(b)})`, 0], [`${jn(a)}*${jn(a)}+${jn(b)}*${jn(b)}`, 1]] }
      });
    }),
    T('pd-point-unknown', '거리가 주어질 때 축 위의 점의 좌표', '②35', (d) => {
      const b = pm(d) * d.int(1, 5), S = 1 + b * b, j = d.int(1, 3), onX = d.bool(), c = nz(d, -8, 8);
      // x축 위의 점 P(p, 0)과 x + by + c = 0: |p + c| = jS. y축 위의 점 P(0, p)과 bx + y + c = 0: |p + c| = jS.
      const L = onX ? genH(1, b, c) : genH(b, 1, c), Ph = onX ? P('P', VP, 0) : P('P', 0, VP);
      return twoVals(`${onX ? X : Y}축 위의 점 ${jw(Ph, '과/와')} 직선 ${L} 사이의 거리가 ${radText(j, S)}일 때, ${VP}의 값은?`, VP, -c - j * S, -c + j * S, {
        explain: `${frac(`|${poly([[1, VP], [c, '']])}|`, rt(`1${sup(2)} + ${par(b)}${sup(2)}`))} = ${radText(j, S)}에서 ${nb(`|${poly([[1, VP], [c, '']])}| = ${j * S}`)}이므로 ${VP} = ${iq(-c - j * S)} 또는 ${VP} = ${iq(-c + j * S)}이다.`,
        facts: { calc: [[`(0-${jn(c)})-${j}*(1+${jn(b)}*${jn(b)})`, 0], [`(0-${jn(c)})+${j}*(1+${jn(b)}*${jn(b)})`, 1]] }
      });
    }),
    T('pd-coef-unknown', '거리가 주어질 때 직선의 계수', '②36', (d) => {
      const [a0, k0a, Nn] = d.pick(PY), a = a0, k0 = pm(d) * k0a, x0 = d.int(-5, 5), y0 = nz(d, -6, 6), D = d.int(1, 5), u = pm(d) * D * Nn, c = u - a * x0 - k0 * y0;
      if (Math.abs(c) > 30) return null;
      // (a x0 + c + k y0)² = D²(a² + k²) 의 근: k0 와 다른 근 k1
      const A2 = y0 * y0 - D * D, B1 = 2 * y0 * (a * x0 + c), C0 = (a * x0 + c) ** 2 - D * D * a * a;
      let cond;
      if (A2 === 0) cond = '';                                            // 일차방정식: 근이 하나
      else {
        const k1 = Q(C0, A2 * k0);
        if (k1.q !== 1) cond = '정수';
        else if (k1.p * k0 < 0) cond = k0 > 0 ? '양수' : '음수';
        else return null;
      }
      const L = nb(`${poly([[a, X]])} + ${VK}${Y} ${c < 0 ? MINUS : '+'} ${Math.abs(c)} = 0`);
      return N(`점 ${jw(pt(x0, y0), '과/와')} 직선 ${L} 사이의 거리가 ${nj(D, '일/일')} 때, ${cond ? cond + ' ' : '상수 '}${VK}의 값은?`, k0, {
        signed: true,
        explain: `${frac(`|${iq(a)} × ${par(x0)} + ${VK} × ${par(y0)} + ${par(c)}|`, rt(`${a}${sup(2)} + ${VK}${sup(2)}`))} = ${D}에서 양변을 제곱하여 정리하면 ${nb(`${poly([[A2, VK + sup(2)], [B1, VK], [C0, '']])} = 0`)}이다. ${A2 === 0 ? `이 일차방정식을 풀면 ${VK} = ${iq(k0)}이다.` : `이 이차방정식의 두 근은 ${iq(k0)}, ${iq(Q(C0, A2 * k0))}이고 ${cond}인 것은 ${iq(k0)}이다.`}`,
        facts: A2 === 0 ? { calc: [[`(0-(${jn(a)}*${jn(x0)}+${jn(c)})*(${jn(a)}*${jn(x0)}+${jn(c)})+${D}*${D}*${jn(a)}*${jn(a)})/(2*${jn(y0)}*(${jn(a)}*${jn(x0)}+${jn(c)}))`, 0]], derived: [2] } : { calc: [[`((0-2*${jn(y0)}*(${jn(a)}*${jn(x0)}+${jn(c)}))*${Q(C0, A2 * k0).q}-(${jn(y0)}*${jn(y0)}-${D}*${D})*${jn(Q(C0, A2 * k0).p)})/((${jn(y0)}*${jn(y0)}-${D}*${D})*${Q(C0, A2 * k0).q})`, 0]], derived: [2, Q(C0, A2 * k0).p, Q(C0, A2 * k0).q] }
      });
    }),
    T('pd-equidistant-point', '두 직선에서 같은 거리에 있는 점', '②37', (d) => {
      const [p, q] = d.pick([[1, 2], [1, 3], [2, 3], [1, 4], [2, 5], [3, 4]]), s1 = [p, pm(d) * q], s2 = d.pick([[q, p], [q, -p], [p, -q]]).map((v) => v * pm(d));
      if (s1[0] === s2[0] || s1[0] === -s2[0] || (s1[0] === s2[0] && s1[1] === s2[1])) return null;
      const L1 = norm(s1[0], s1[1], nz(d, -6, 6)), L2 = norm(s2[0], s2[1], nz(d, -6, 6)), y0 = d.int(-4, 4);
      if (L1.a * L1.a + L1.b * L1.b !== L2.a * L2.a + L2.b * L2.b || L1.a === L2.a || L1.a === -L2.a) return null;
      const e1 = L1.b * y0 + L1.c, e2 = L2.b * y0 + L2.c, t1 = Q(e2 - e1, L1.a - L2.a), t2 = Q(-(e1 + e2), L1.a + L2.a);
      const pos = [t1, t2].filter((t) => t.p > 0);
      if (pos.length !== 1 || pos[0].q !== 1 || pos[0].p > 15) return null;
      const ans = pos[0].p, useFirst = qcmp(pos[0], t1) === 0;
      return N(`점 ${pt(VA, y0)}에서 두 직선 ${lh(L1)}, ${lh(L2)}에 이르는 거리가 같을 때, 양수 ${VA}의 값은?`, ans, {
        explain: `두 직선의 ${X}, ${Y}의 계수의 제곱의 합이 같으므로 ${nb(`|${poly([[L1.a, VA], [e1, '']])}| = |${poly([[L2.a, VA], [e2, '']])}|`)}이다. 따라서 ${VA} = ${iq(t1)} 또는 ${VA} = ${iq(t2)}이고, 양수인 것은 ${ans}이다.`,
        facts: { calc: [[useFirst ? `(${jn(L2.b)}*${jn(y0)}+${jn(L2.c)}-${jn(L1.b)}*${jn(y0)}-${jn(L1.c)})/(${jn(L1.a)}-${jn(L2.a)})` : `(0-(${jn(L1.b)}*${jn(y0)}+${jn(L1.c)}+${jn(L2.b)}*${jn(y0)}+${jn(L2.c)}))/(${jn(L1.a)}+${jn(L2.a)})`, 0]] }
      });
    }),
    T('pd-angle-bisector', '두 직선이 이루는 각의 이등분선', '②38', (d) => {
      const [p, q] = d.pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 1]]), s1 = [p, pm(d) * q], s2 = d.pick([[q, -p * Math.sign(s1[1])], [q, p], [p, -s1[1]]]);
      const L1 = { a: s1[0], b: s1[1], c: nz(d, -7, 7) }, L2 = { a: s2[0], b: s2[1], c: nz(d, -7, 7) };
      if (L1.a * L2.b === L2.a * L1.b || L1.a * L1.a + L1.b * L1.b !== L2.a * L2.a + L2.b * L2.b) return null;
      const bis = [{ a: L1.a - L2.a, b: L1.b - L2.b, c: L1.c - L2.c, s: '-' }, { a: L1.a + L2.a, b: L1.b + L2.b, c: L1.c + L2.c, s: '+' }];
      if (bis.some((l) => l.a === 0 || l.b === 0)) return null;
      const wantPos = d.bool(), hit = bis.find((l) => (-l.a / l.b > 0) === wantPos);
      if (!hit || hit.a % hit.b !== 0 || hit.c % hit.b !== 0) return null;
      const m = -hit.a / hit.b, k = -hit.c / hit.b;
      if (k === 0 || Math.abs(m) > 6) return null;
      const op = hit.s, mE = `(0-(${jn(L1.a)}${op}${jn(L2.a)}))/(${jn(L1.b)}${op}${jn(L2.b)})`, kE = `(0-(${jn(L1.c)}${op}${jn(L2.c)}))/(${jn(L1.b)}${op}${jn(L2.b)})`;
      return lineAns(`두 직선 ${lh(L1)}, ${lh(L2)}${jw(lh(L2), '이/가').slice(lh(L2).length)} 이루는 각을 이등분하는 직선 가운데 기울기가 ${wantPos ? '양수' : '음수'}인 직선의 방정식은?`, m, k, {
        explain: `각을 이등분하는 직선 위의 점 ${pt(X, Y)}에서 두 직선까지의 거리가 같고 두 직선의 ${X}, ${Y}의 계수의 제곱의 합이 같으므로 ${nb(`|${poly([[L1.a, X], [L1.b, Y], [L1.c, '']])}| = |${poly([[L2.a, X], [L2.b, Y], [L2.c, '']])}|`)}이다. 이등분선은 ${lh(norm(bis[0].a, bis[0].b, bis[0].c))}, ${lh(norm(bis[1].a, bis[1].b, bis[1].c))}이고, 기울기가 ${wantPos ? '양수' : '음수'}인 것은 ${slopeH(m, k)}이다.`,
        facts: { calc: [[mE, 0], [kE, 1]] }
      });
    }),
    T('pd-line-by-dist', '기울기를 아는 직선 가운데 한 점에서의 거리가 주어진 직선', '②39', (d, n) => {
      const m = pm(d) * d.int(1, 4), S = m * m + 1, x0 = d.int(-5, 5), y0 = d.int(-5, 5), j = d.int(1, 2), base = y0 - m * x0, k1 = base - j * S, k2 = base + j * S;
      if (Math.abs(k1) > 30 || Math.abs(k2) > 30) return null;
      const L = norm(1, m, nz(d, -6, 6)), given = n === 0 ? `기울기가 ${nj(m, '이고/이고')}` : `직선 ${lh(L)}에 수직이고`, mS = n === 0 ? jn(m) : `${jn(L.b)}/${jn(L.a)}`;
      const kE1 = `${jn(y0)}-${jn(m)}*${jn(x0)}-${j}*(${jn(m)}*${jn(m)}+1)`, kE2 = `${jn(y0)}-${jn(m)}*${jn(x0)}+${j}*(${jn(m)}*${jn(m)}+1)`;
      return twoLinesAns(`${given} 점 ${pt(x0, y0)}에서의 거리가 ${radText(j, S)}인 직선의 방정식을 모두 구하면?`, [m, k1], [m, k2], {
        explain: `${n === 1 ? `주어진 직선의 기울기가 ${iq(Q(-1, m))}이므로 구하는 직선의 기울기는 ${iq(m)}이다. ` : ''}구하는 직선을 ${nb(`${Y} = ${cv(m, X)} + ${VK}`)}, 곧 ${nb(`${poly([[m, X], [-1, Y]])} + ${VK} = 0`)}이라 하면 ${frac(`|${iq(m)} × ${par(x0)} ${MINUS} ${par(y0)} + ${VK}|`, rt(S))} = ${radText(j, S)}에서 ${nb(`|${VK} ${MINUS} ${par(base)}| = ${j * S}`)}, ${VK} = ${iq(k1)} 또는 ${VK} = ${iq(k2)}이다.`,
        facts: { calc: [[mS, 0], [kE1, 1], [mS, 2], [kE2, 3]] }
      });
    }, { count: 2 }),
    T('pd-line-by-dist-pick', '수직이고 원점에서의 거리가 주어진 직선 가운데 하나 고르기', '②39', (d) => {
      const m = pm(d) * d.int(1, 3), S = m * m + 1, j = d.int(1, 2), wantPos = d.bool(), k = (wantPos ? 1 : -1) * j * S, L = norm(1, m, nz(d, -6, 6));
      return lineAns(`직선 ${lh(L)}에 수직이고 원점에서의 거리가 ${radText(j, S)}인 직선 가운데 ${Y}절편이 ${wantPos ? '양수' : '음수'}인 직선의 방정식은?`, m, k, {
        explain: `직선 ${lh(L)}의 기울기가 ${iq(Q(-1, m))}이므로 구하는 직선의 기울기는 ${iq(m)}이다. ${nb(`${Y} = ${cv(m, X)} + ${VK}`)}라 하면 원점에서의 거리는 ${frac(`|${VK}|`, rt(S))} = ${radText(j, S)}이므로 ${VK} = ±${j * S}이고, ${Y}절편이 ${wantPos ? '양수' : '음수'}인 것은 ${slopeH(m, k)}이다.`,
        facts: { calc: [[`${jn(L.b)}/${jn(L.a)}`, 0], [`${wantPos ? '' : '0-'}${j}*(${jn(L.b)}*${jn(L.b)}+1)`, 1]] }
      });
    }),
    T('pd-max-dist-line', '한 점을 지나는 직선 가운데 원점에서 가장 먼 직선', '②42', (d) => {
      const y0 = pm(d) * d.int(1, 3), x0 = y0 * nz(d, -3, 3), m = -x0 / y0, k = y0 + x0 * x0 / y0;
      if (Math.abs(m) === 1 || !Number.isInteger(k) || Math.abs(x0) > 8 || Math.abs(k) > 30) return null;
      return lineAns(`점 ${ptj(x0, y0, '을/를')} 지나는 직선 가운데 원점과의 거리가 가장 먼 직선의 방정식은?`, m, k, {
        explain: `원점을 O, 이 점을 P라 하면 P를 지나는 직선과 원점 사이의 거리는 ${SG('OP')}보다 클 수 없고, 직선이 선분 OP에 수직일 때 ${SG('OP')}가 된다. 직선 OP의 기울기가 ${iq(Q(y0, x0))}이므로 구하는 직선의 기울기는 ${iq(m)}이고, 점 P를 지나므로 ${slopeH(m, k)}이다.`,
        facts: { calc: [[`(0-${jn(x0)})/${jn(y0)}`, 0], [`${jn(y0)}+${jn(x0)}*${jn(x0)}/${jn(y0)}`, 1]] }
      });
    }),
    T('pd-fixed-then-dist', '항상 지나는 점과 직선 사이의 거리로 상수 구하기', '②43', (d) => {
      const Fp = [d.int(-4, 4), d.int(-4, 4)], l1 = lineThrough(d, Fp, (l) => l.a !== 0 && l.b !== 0), l2 = lineThrough(d, Fp, (l) => l.a !== 0 && l.b !== 0 && l.a * l1.b !== l.b * l1.a);
      const [a, b] = sqfPair(d), S = a * a + b * b, j = d.int(1, 2), base = -(a * Fp[0] + b * Fp[1]), m1 = base - j * S, m2 = base + j * S;
      if (!((m1 > 0) !== (m2 > 0)) || m1 === 0 || m2 === 0) return null;
      const ans = m1 > 0 ? m1 : m2, sgnE = m1 > 0 ? '-' : '+', fam = famOf(l1, l2);
      return N(`직선 ${fam}${jw(fam, '이/가').slice(fam.length)} 실수 ${VK}의 값에 관계없이 항상 지나는 점을 A라 하자. 점 A와 직선 ${nb(`${poly([[a, X], [b, Y]])} + ${VM} = 0`)} 사이의 거리가 ${radText(j, S)}일 때, 양수 ${VM}의 값은?`, ans, {
        explain: `${VK}에 대하여 정리하면 ${nb(`${poly([[l1.a, X], [l1.b, Y], [l1.c, '']])} + ${VK}(${poly([[l2.a, X], [l2.b, Y], [l2.c, '']])}) = 0`)}이므로 두 일차식이 모두 0이 되는 점 ${jw(`A${pt(Fp[0], Fp[1])}`, '을/를')} 항상 지난다. ${frac(`|${iq(a)} × ${par(Fp[0])} + ${par(b)} × ${par(Fp[1])} + ${VM}|`, rt(S))} = ${radText(j, S)}에서 ${VM} = ${iq(m1)} 또는 ${VM} = ${iq(m2)}이고, 양수인 것은 ${ans}이다.`,
        facts: { calc: [[`(0-(${jn(a)}*${meetX(l1, l2)}+${jn(b)}*${meetY(l1, l2)}))${sgnE}${j}*(${jn(a)}*${jn(a)}+${jn(b)}*${jn(b)})`, 0]] }
      });
    }),
    T('pd-foot', '직선 위의 점 가운데 원점에 가장 가까운 점', '②44', (d) => {
      const m = pm(d) * d.int(1, 3), t = nz(d, -2, 2), k = t * (m * m + 1), foot = [-m * t, t];
      return pointAns(`직선 ${slopeH(m, k)} 위의 점 P에 대하여 선분 OP의 길이가 가장 짧을 때, 점 P의 좌표는? (단, O는 원점이다.)`, foot[0], foot[1], {
        explain: `선분 OP가 가장 짧은 것은 P가 원점에서 직선에 내린 수선의 발일 때이다. 원점을 지나고 이 직선에 수직인 직선은 ${slopeH(Q(-1, m), 0)}이고, 두 직선의 방정식을 연립하여 풀면 P${pt(foot[0], foot[1])}이다.`,
        facts: { calc: [[`(0-${jn(m)}*${jn(k)})/(${jn(m)}*${jn(m)}+1)`, 0], [`${jn(k)}/(${jn(m)}*${jn(m)}+1)`, 1]] }
      });
    }),
    T('pd-triangle-area', '점과 직선 사이의 거리로 삼각형의 넓이 구하기', '②45', (d) => {
      const A = [d.int(-5, 5), d.int(-5, 5)], Bp = [d.int(-5, 5), d.int(-5, 5)], Cp = [d.int(-5, 5), d.int(-5, 5)];
      const cr = (Bp[0] - A[0]) * (Cp[1] - A[1]) - (Cp[0] - A[0]) * (Bp[1] - A[1]);
      if (cr === 0 || cr % 2 !== 0 || Bp[0] === Cp[0] || Bp[1] === Cp[1] || isSq(d2(Bp, Cp))) return null;
      const area = Math.abs(cr) / 2, LBC = norm(Cp[1] - Bp[1], Bp[0] - Cp[0], Cp[0] * Bp[1] - Bp[0] * Cp[1]), e = `((${df(Bp[0], A[0])}*${df(Cp[1], A[1])}-${df(Cp[0], A[0])}*${df(Bp[1], A[1])}))`;
      return N(`세 점 ${P('A', A[0], A[1])}, ${P('B', Bp[0], Bp[1])}, ${Pj('C', Cp[0], Cp[1], '을/를')} 꼭짓점으로 하는 삼각형 ABC의 넓이는?`, area, {
        explain: `${SG('BC')} = ${lenH(d2(Bp, Cp))}이고 직선 BC의 방정식은 ${lh(LBC)}이다. 점 A와 직선 BC 사이의 거리가 높이이고, 그 거리는 ${frac(Math.abs(LBC.a * A[0] + LBC.b * A[1] + LBC.c), rt(LBC.a * LBC.a + LBC.b * LBC.b))}이므로 넓이는 ${frac(1, 2)} × ${lenH(d2(Bp, Cp))} × ${frac(Math.abs(LBC.a * A[0] + LBC.b * A[1] + LBC.c), rt(LBC.a * LBC.a + LBC.b * LBC.b))} = ${area}이다.`,
        facts: { calc: [[`${cr < 0 ? `(0-${e})` : e}/2`, 0]], derived: [2] }
      });
    })
  ];

  B.addGroup('10-2-1', { id: 'line', title: '직선의 방정식', standard: STD2, types: lineTypes });
  B.addGroup('10-2-1', { id: 'pp', title: '두 직선의 평행과 수직', standard: STD2, types: ppTypes });
  B.addGroup('10-2-1', { id: 'pd', title: '점과 직선 사이의 거리', standard: STD3, types: pdTypes });
  B.kit.m1021b = { norm, through, lh, lj, onL, slopeQ, meetOf, meetX, meetY, lineThrough, famH, famOf, between, rays, qmin, qmax, tagged, bySlope, SQF, sqfPair, PY, HAN, VP };
})(typeof window !== 'undefined' ? window : globalThis);
