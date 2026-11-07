// 미적분Ⅰ Ⅱ-2 도함수의 활용(1) — 실력 문제.
// 단원 틀·싣는 기준·뺀 것과 까닭은 11-2-4a.js 머리에 적었다. 도구는 B.kit.u24x(a 파일)를 쓴다.
// ref: ①n = 기본꼴_1의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것
//  - 곡선 밖의 점에서 그은 접선을 「그 점에서의 접선」으로 여겨 주어진 점의 x좌표를 도함수에 넣는다(접점을 문자로 두지 않는다).
//  - 두 곡선의 접선이 일치한다는 것을 「기울기가 같다」 하나로만 읽고, 한 접선이 다른 곡선의 접점도 지나야 한다는 것을 놓친다.
//  - 곡선과 직선 사이의 가장 짧은 거리를 곡선 위의 아무 점에서 재거나, 접선이 직선과 평행한 점을 찾고도 수선의 발을 구하지 않는다.
//  - f′(a) = 0이면 x = a에서 반드시 극값을 갖는다고 여긴다(f′의 부호가 바뀌어야 한다 — 중근에서는 바뀌지 않는다).
//  - 극값 조건을 f(p)의 값으로만 쓰고 f′(p) = 0을 쓰지 않는다. 극한 조건 lim (f(x) − w)/(x − u) = z 에서 f(u) = w 를 끌어내지 못한다.
//  - 도함수의 그래프만 보고 f(x)의 상수항까지 정해진다고 여기거나, 극댓값과 극솟값의 자리(어느 쪽이 극대인가)를 바꾸어 쓴다.
// 실력에 둔 까닭: ① 문제의 장치에 함정이 있어 배운 뜻을 정확히 대야 풀리는 것, ② 세 단계 넘게 이어 생각해야 풀리는 것만 남겼다(유형마다 주석).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, N, M, inline } = B.kit;
  const { MINUS, Q, nb, V, sup, nz, poly, grp, polyAns } = B.kit.mid;
  const { plot, jh, qAns, lim, coordAns } = B.kit.hs;
  const K = B.kit.u24x, { plotO } = K;
  const { S5, S7, H, X, Y, Av, Bv, Kv, Fv, FP, iq, jn, sgnT, is, pt, coefT, padd, pval, pder, fromRoots, ptext, fIs, yP, big, valExpr, derExpr, par, facT, lineT, psT, vals } = K;
  const X2 = X + sup(2), X3 = X + sup(3);
  const P = 'P', Qn = 'Q';
  const tailT = (c, body) => (c ? ` ${c < 0 ? MINUS : '+'} ${Math.abs(c) === 1 && body ? '' : Math.abs(c)}${body}` : '');   // 「 + 3x」「 − x」(0이면 적지 않는다)

  const hard = [
    // ② 평행한 접선 → 접점 → 두 수의 곱 → 다른 곡선(곱의 미분) → 접선 → x절편: 다섯 단계를 잇는다.
    H('hard-chain', '평행한 접선의 접점으로 정한 점에서 다른 곡선의 접선', '①6', (d) => {
      const pp = d.int(-4, 4), q0 = nz(d, -6, 6), m = nz(d, -6, 6), a = (m - pp) / 2, k0 = d.int(-6, 6);
      if (!Number.isInteger(a)) return null;
      const f = [q0, pp, 1], b = pval(f, a), X0 = a * b, c0 = nz(d, -5, 5);
      if (Math.abs(X0) > 3 || k0 === b - m * a) return null;
      const g = padd([0, ...f], [c0]), gp = pval(pder(g), X0), gv = pval(g, X0);
      if (!gp) return null;
      const xi = Q(X0 * gp - gv, gp);
      if (xi.q === 1) return null;
      return qAns(`함수 ${fIs(f)}에 대하여 직선 ${lineT(m, k0)}에 평행한 직선이 곡선 ${is(Y, `${Fv}(${X})`)}에 접할 때, 접점의 좌표를 ${pt(Av, Bv)}라 하자. 곡선 ${yIs2(`${X}${Fv}(${X}) ${sgnT(c0)}`)} 위의 ${X}좌표가 ${Av}${Bv}인 점에서의 접선의 ${X}절편은?`, xi, {
        signed: true,
        explain: `${is(`${FP}(${X})`, poly([[2, X], [pp, '']]))} = ${iq(m)}에서 ${is(Av, a)}, ${is(Bv, `${Fv}(${iq(a)}) = ${iq(b)}`)}이므로 ${is(Av + Bv, X0)}이다. ${is(`${V('g')}(${X})`, `${X}${Fv}(${X}) ${sgnT(c0)}`)}라 하면 ${is(`${V('g')}′(${X})`, `${Fv}(${X}) + ${X}${FP}(${X})`)}이고 ${is(`${V('g')}(${iq(X0)})`, gv)}, ${is(`${V('g')}′(${iq(X0)})`, gp)}이다. 접선 ${psT(gp, X0, gv)}에 ${is(Y, 0)}을 넣으면 ${is(X, xi)}이다.`,
        facts: { value: `${jn(X0)}-${jn(gv)}/${jn(gp)}`, derived: [X0, gv, gp] } });
    }, { standard: S5 }),
    // ② 한 점에서 그은 두 접선 → 접점 두 개 → 도형(무게중심·넓이): 네 단계를 잇는다.
    H('hard-two', '한 점에서 그은 두 접선의 접점으로 만든 삼각형', '①8', (d, n) => {
      if (n === 0) {
        // 이차곡선: 접점 t1, t2 의 가운데가 p
        const A = d.pick([-2, -1, 1, 2, 3]), b = d.int(-5, 5), c = d.int(-6, 6), t1 = d.int(-4, 1), t2 = d.int(t1 + 2, 5);
        if ((t1 + t2) % 2) return null;
        const p = (t1 + t2) / 2, f = [c, b, A], q = A * t1 * t2 + b * p + c, sy = q + pval(f, t1) + pval(f, t2);
        if (sy % 3 || Math.abs(q) > 40) return null;
        return coordAns(`점 A${pt(p, q)}에서 곡선 ${yP(f)}에 그은 두 접선의 접점을 각각 B, C라 할 때, 삼각형 ABC의 무게중심의 좌표는?`, [p, sy / 3], {
          explain: `접점의 ${X}좌표를 ${V('t')}라 하면 접선 ${jh(yIs2(`(${ptext(pder(f), V('t'))})(${X} ${MINUS} ${V('t')}) + ${A < 0 ? `(${ptext(f, V('t'))})` : ptext(f, V('t'))}`), '이/가')} 점 A를 지나므로 ${is(nb(`${facT(t1, V('t'))}${facT(t2, V('t'))}`), 0)}, 곧 B${pt(t1, pval(f, t1))}, C${jh(pt(t2, pval(f, t2)), '이다/이다')}. 무게중심은 ${pt(frac(`${iq(p)} + ${par(t1)} + ${par(t2)}`, 3), frac(`${iq(q)} + ${par(pval(f, t1))} + ${par(pval(f, t2))}`, 3))} = ${jh(pt(p, sy / 3), '이다/이다')}.`,
          facts: { calc: [[`(${jn(p)}+${jn(t1)}+${jn(t2)})/3`, 0], [`(${jn(q)}+${valExpr(f, t1)}+${valExpr(f, t2)})/3`, 1]], derived: [t1, t2, 3] } });
      }
      // 삼차곡선: 접점의 x좌표에 대한 방정식이 중근(변곡점)과 한 근을 가져 접선이 둘
      const t1 = d.int(-2, 2), p = d.int(-3, 3);
      if (p === t1 || (3 * p - t1) % 2) return null;
      const kk = d.pick([1, 1, 2, -1, -2, 3]), t2 = (3 * p - t1) / 2, b = -3 * kk * t1, c = d.int(-6, 6), dd = d.int(-6, 6), f = [dd, c, b, kk];   // 넓이는 27·|k|·(p − t1)⁴/16
      const q = pval(f, t1) + pval(pder(f), t1) * (p - t1), A1 = [t1, pval(f, t1)], B1 = [t2, pval(f, t2)];
      const det = (A1[0] - p) * (B1[1] - q) - (B1[0] - p) * (A1[1] - q), area = Math.abs(det) / 2;
      if (!Number.isInteger(area) || !area || Math.abs(q) > 80 || Math.abs(t2) > 5 || area > 999 || big(f) > 40) return null;
      return N(`점 ${P}${pt(p, q)}에서 곡선 ${yP(f)}에 그은 두 접선의 접점을 각각 A, B라 할 때, 삼각형 ${P}AB의 넓이는?`, area, {
        explain: `접점을 ${pt(V('t'), `${Fv}(${V('t')})`)}라 하면 접선 ${yIs2(`${FP}(${V('t')})(${X} ${MINUS} ${V('t')}) + ${Fv}(${V('t')})`)}가 점 ${P}를 지나므로 ${is(nb(`${MINUS}2${facT(t1, V('t'))}${sup(2)}${facT(t2, V('t'))}`), 0)}에서 접점은 A${pt(t1, A1[1])}, B${jh(pt(t2, B1[1]), '이다/이다')}. 세 꼭짓점의 좌표로 넓이를 구하면 ${frac(1, 2)} × |${par(A1[0] - p)} × ${par(B1[1] - q)} ${MINUS} ${par(B1[0] - p)} × ${par(A1[1] - q)}| = ${jh(String(area), '이다/이다')}.`,
        facts: { calc: [[`(${det < 0 ? '0-' : ''}((${jn(t1)}-${jn(p)})*(${valExpr(f, t2)}-${jn(q)})-(${jn(t2)}-${jn(p)})*(${valExpr(f, t1)}-${jn(q)})))/2`, 0]], derived: [t1, t2] } });
    }, { count: 2, standard: S5 }),
    // ② 곡선 위의 점(계수가 문자) → 접선 → 두 절편 → 넓이 방정식 → 조건으로 하나 고르기: 네 단계를 잇는다.
    H('hard-axes', '접선과 두 좌표축으로 둘러싸인 삼각형의 넓이로 계수 구하기', '①9', (d, n) => {
      if (n === 0) {
        // y = x² + Bx + a 위의 점 (x0, k): 기울기 m 은 정해지고 y절편 I = k − m x0 가 넓이로 정해진다(두 가지 → 조건으로 하나)
        const x0 = nz(d, -3, 3), Bc = d.int(-6, 6), m = 2 * x0 + Bc, I = nz(d, -8, 8);
        if (!m || Math.abs(m) > 8) return null;
        const S = Q(I * I, 2 * Math.abs(m)), k = I + m * x0, k2 = -I + m * x0, a = k - x0 * x0 - Bc * x0, cut = k > k2 ? Math.floor((k + k2) / 2) : Math.ceil((k + k2) / 2);
        if (cut === k || cut === k2 || Math.abs(a) > 40 || Math.abs(k) > 40) return null;
        const cond = k > k2 ? `${Kv} &gt; ${iq(cut)}` : `${Kv} &lt; ${iq(cut)}`;
        return vals(`곡선 ${yIs2(`${X2}${tailT(Bc, X)} + ${Av}`)} 위의 점 ${pt(x0, Kv)}에서의 접선과 ${X}축 및 ${Y}축으로 둘러싸인 도형의 넓이가 ${jh(iq(S), '일/일')} 때, 상수 ${Av}, ${Kv}의 값은? ${nb(`(단, ${cond})`)}`, [[Av, a], [Kv, k]], {
          explain: `${is(`${Y}′`, poly([[2, X], [Bc, '']]))}이므로 접선의 기울기는 ${iq(m)}이고, 접선은 ${yIs2(`${coefT(m)}${X} + ${Kv} ${sgnT(-m * x0)}`)}이다. ${Y}절편을 ${V('s')}라 하면 ${X}절편의 절댓값은 ${frac(`|${V('s')}|`, Math.abs(m))}이므로 넓이는 ${frac(`${V('s')}${sup(2)}`, 2 * Math.abs(m))} = ${iq(S)}에서 ${is(V('s'), I)} 또는 ${is(V('s'), -I)}이다. ${is(V('s'), `${Kv} ${sgnT(-m * x0)}`)}이므로 ${is(Kv, k)} 또는 ${is(Kv, k2)}인데 ${jh(cond, '이므로/이므로')} ${is(Kv, k)}이고, 점이 곡선 위에 있으므로 ${is(Av, a)}이다.`,
          facts: { calc: [[jn(a), 0], [jn(k), 1]], derived: [a, k] } });
      }
      // y = x² − ax 위의 점 A(x0, b): 접선의 y절편은 −x0², x절편은 x0²/(2x0 − a)
      const x0 = d.pick([-2, -1, 1, 2]), w = d.pick(Math.abs(x0) === 1 ? [1, 2, 3] : [1, 2, 4, 8]), sgn = x0 > 0 ? 1 : -1;
      const a = 2 * x0 - sgn * w, b = x0 * x0 - a * x0, S = Q(x0 ** 4, 2 * w);
      if (!a || !b) return null;
      const cond = x0 > 0 ? `${Av} &lt; ${2 * x0}` : `${Av} &gt; ${iq(2 * x0)}`;
      return vals(`곡선 ${yIs2(`${X2} ${MINUS} ${Av}${X}`)} 위의 점 A${pt(x0, Bv)}에서의 접선이 ${X}축, ${Y}축과 만나는 점을 각각 B, C라 하자. 삼각형 OCB의 넓이가 ${jh(iq(S), '일/일')} 때, 상수 ${Av}, ${Bv}의 값은? ${nb(`(단, ${cond}이고, O는 원점)`)}`, [[Av, a], [Bv, b]], {
        explain: `${is(Bv, `${iq(x0 * x0)} ${x0 < 0 ? '+' : MINUS} ${Math.abs(x0) === 1 ? '' : Math.abs(x0)}${Av}`)}이고 접선의 기울기는 ${iq(2 * x0)} ${MINUS} ${jh(Av, '이므로/이므로')} 접선은 ${yIs2(`(${iq(2 * x0)} ${MINUS} ${Av})${X} ${MINUS} ${x0 * x0}`)}이다. B${pt(frac(x0 * x0, `${iq(2 * x0)} ${MINUS} ${Av}`), 0)}, C${pt(0, -x0 * x0)}이므로 넓이는 ${frac(1, 2)} × ${frac(x0 * x0, `|${iq(2 * x0)} ${MINUS} ${Av}|`)} × ${x0 * x0} = ${iq(S)}에서 |${iq(2 * x0)} ${MINUS} ${Av}| = ${jh(String(w), '이다/이다')}. ${jh(cond, '이므로/이므로')} ${is(Av, a)}, ${is(Bv, b)}이다.`,
        facts: { calc: [[`2*${jn(x0)}-(${sgn * w})`, 0], [`${jn(x0)}*${jn(x0)}-(2*${jn(x0)}-(${sgn * w}))*${jn(x0)}`, 1]], derived: [w] } });
    }, { count: 2, standard: S5 }),
    // ① 「접선이 일치한다」를 기울기가 같다는 것만으로 읽으면 풀리지 않는다. 한 접선이 다른 곡선의 접점도 지나야 한다(뜻) + 네 단계.
    H('hard-common', '두 곡선의 접선이 일치할 때 두 접점을 잇는 직선의 기울기', '①11', (d) => {
      const x1 = d.int(-3, -1), pp = d.int(-6, 6), Kc = -4 * x1 ** 3, slope = 3 * x1 * x1 + pp;
      if (!slope) return null;
      const f = [0, pp, 0, 1];
      return N(`곡선 ${yP(f)} 위의 점 ${P}에서의 접선과 곡선 ${yIs2(`${ptext(f)} + ${Kc}`)} 위의 점 ${Qn}에서의 접선이 일치할 때, 직선 ${P}${Qn}의 기울기는? ${nb(`(단, 두 점 ${P}, ${Qn}의 ${X}좌표는 서로 다르다.)`)}`, slope, {
        signed: true,
        explain: `두 점의 ${X}좌표를 ${V('p')}, ${V('q')}라 하면 두 곡선의 도함수는 모두 ${jh(ptext(pder(f)), '이므로/이므로')} 기울기가 같으려면 ${is(V('p') + sup(2), V('q') + sup(2))}, 곧 ${is(V('q'), MINUS + V('p'))}이다. 점 ${P}에서의 접선 ${yIs2(`(${ptext(pder(f), V('p'))})${X} ${MINUS} 2${V('p')}${sup(3)}`)}이 점 ${Qn}${jh(`(${MINUS}${V('p')}, ${MINUS}${V('p')}${sup(3)}${tailT(-pp, V('p'))} + ${Kc})`, '을/를')} 지나므로 ${is(`${MINUS}4${V('p')}${sup(3)}`, Kc)}, 곧 ${is(V('p'), x1)}이다. 직선 ${P}${Qn}는 일치하는 접선이므로 기울기는 ${is(`${FP}(${iq(x1)})`, slope)}이다.`,
        facts: { value: `3*${jn(x1)}*${jn(x1)}+${jn(pp)}`, derived: [x1] } });
    }, { standard: S5 }),
    // ① 가장 가까운 점은 직선에 평행한 접선의 접점이다(뜻) + 수직인 직선과의 교점까지 세 단계.
    H('hard-shortest', '곡선 위의 점과 직선 위의 점 사이의 거리가 가장 짧을 때', '①13', (d) => {
      const s = d.pick([-2, -1, 1, 2]), lam = d.int(1, 2), q = d.int(-3, 3), c = s * s + lam * (1 + 4 * s * s);
      const Pp = [s, s * s + q], Qp = [s + 2 * s * lam, s * s - lam + q], k = -c + q;
      if (Math.abs(k) > 40 || Math.abs(Qp[0]) > 12) return null;
      const f = [q, 0, 1];
      return inline(`곡선 ${yP(f)} 위의 점 ${P}와 직선 ${lineT(2 * s, k)} 위의 점 ${Qn} 사이의 거리가 가장 작을 때, 두 점 ${P}, ${Qn}의 좌표는?`, `${grp(`${P}({0}, {1})`)}, ${grp(`${Qn}({2}, {3})`)}`,
        [Pp[0], Pp[1], Qp[0], Qp[1]].map((v) => ({ answer: v, signed: true })), {
          shown: `${P}${pt(Pp[0], Pp[1])}, ${Qn}${pt(Qp[0], Qp[1])}`,
          explain: `거리가 가장 작은 점 ${P}는 그 점에서의 접선이 주어진 직선과 평행한 점이다. ${is(`${Y}′`, `2${X}`)} = ${iq(2 * s)}에서 ${P}${jh(pt(Pp[0], Pp[1]), '이다/이다')}. 점 ${Qn}는 ${P}를 지나고 기울기가 ${jh(iq(Q(-1, 2 * s)), '인/인')} 직선(주어진 직선에 수직)과 주어진 직선의 교점이므로 ${Qn}${jh(pt(Qp[0], Qp[1]), '이다/이다')}.`,
          facts: { calc: [[jn(Pp[0]), 0], [jn(Pp[1]), 1], [jn(Qp[0]), 2], [jn(Qp[1]), 3]], derived: [Pp[0], Pp[1], Qp[0], Qp[1]] } });
    }, { standard: S5 }),
    // ② 도함수의 그래프 → 극점 → 삼차식을 문자 넷으로 두고 계수 비교 → 극댓값·극솟값으로 남은 두 문자: 네 단계를 잇는다.
    H('hard-fprime', '도함수의 그래프와 극값으로 삼차함수 구하기', '①34', (d) => {
      const al = nz(d, -2, 1), w = d.int(1, 3), be = al + w, t = d.int(1, 2), c = nz(d, -6, 6);
      if (!be || al + be === 0 || (t * (al + be)) % 2) return null;
      const f = [c, -3 * t * al * be, 3 * t * (al + be) / 2, -t], vm = pval(f, al), vM = pval(f, be);
      if (Math.abs(vm) > 60 || Math.abs(vM) > 60 || f.some((v) => !v)) return null;
      const g = (x) => -(x - al) * (x - be) * 3 / Math.max(1, (w / 2) ** 2), lo = Math.min(al - 1.2, -0.6), hi = Math.max(be + 1.2, 0.6);
      const fig = plotO({ x: [lo, hi], y: [-3.6, 3.6], w: 250, ys: 0.75, xt: [al, be], curves: [{ f: g, name: "y=f'(x)" }],
        say: `곡선 y = f′(x)는 위로 볼록한 포물선이고 x축과 x = ${al}, x = ${be}에서 만난다.`.replace(/-(\d)/g, '−$1') });
      const tE = `2*(${jn(vM)}-${jn(vm)})/((${jn(be)}-${jn(al)})*(${jn(be)}-${jn(al)})*(${jn(be)}-${jn(al)}))`;
      return polyAns(`그림은 삼차함수 ${Fv}(${X})의 도함수 ${is(Y, `${FP}(${X})`)}의 그래프이다. 함수 ${Fv}(${X})의 극댓값이 ${iq(vM)}, 극솟값이 ${jh(iq(vm), '일/일')} 때, ${Fv}(${X})는?`, [[-t, X3], [f[2], X2], [f[1], X], [c, '']], {
        figure: fig,
        explain: `${is(`${Fv}(${X})`, `${V('p')}${X3} + ${V('q')}${X2} + ${V('r')}${X} + ${V('s')}`)}라 하면 그래프에서 ${is(`${FP}(${X})`, `3${V('p')}${facT(al)}${facT(be)}`)} ${nb(`(${V('p')} &lt; 0)`)}이므로 계수를 비교하면 ${is(V('q'), `${MINUS}${frac(3 * (al + be), 2)}${V('p')}`)}, ${is(V('r'), `${iq(3 * al * be)}${V('p')}`)}이다. ${FP}(${X})의 부호가 ${is(X, al)}에서 −에서 +로, ${is(X, be)}에서 +에서 −로 바뀌므로 극솟값은 ${Fv}(${iq(al)}) = ${iq(vm)}, 극댓값은 ${Fv}(${iq(be)}) = ${jh(iq(vM), '이다/이다')}. ${Fv}(${iq(be)}) ${MINUS} ${Fv}(${iq(al)}) = ${MINUS}${frac(`${par(be - al)}${sup(3)}`, 2)}${V('p')} = ${jh(String(vM - vm), '에서/에서')} ${is(V('p'), -t)}이고, ${Fv}(${iq(al)}) = ${jh(iq(vm), '에서/에서')} ${is(V('s'), c)}이다. 따라서 ${is(`${Fv}(${X})`, ptext(f))}이다.`,
        facts: { calc: [[`0-${tE}`, 0], [`3*${tE}*(${jn(al)}+${jn(be)})/2`, 1], [`0-3*${tE}*${jn(al)}*${jn(be)}`, 2], [`${jn(vm)}+${tE}*${jn(al)}*${jn(al)}*(3*${jn(be)}-${jn(al)})/2`, 3]], derived: [2, 3] } });
    }, { standard: S7 }),
    // ② 극한 조건 → f(u)·f′(u), 극값 조건 → f′(p) = 0, 세 식을 연립 → f(r): 네 단계를 잇는다. 극한에서 f(u) = w 를 끌어내는 것이 함정이다.
    H('hard-limit', '극한 조건과 극대 조건으로 삼차함수의 함숫값 구하기', '①35', (d) => {
      const p = d.int(-3, 1), q = d.int(p + 1, 4), c = d.int(-6, 6), u = d.int(-2, 3), r = d.int(-2, 4);
      if ((p + q) % 2 || u === p || u === q || r === u) return null;
      const f = [c, 3 * p * q, -3 * (p + q) / 2, 1], w = pval(f, u), z = pval(pder(f), u), ans = pval(f, r);
      if (!z || Math.abs(w) > 40 || Math.abs(ans) > 199) return null;
      const lm = lim(`x→${u}`, frac(`${Fv}(${X})${w ? ' ' + sgnT(-w) : ''}`, u ? `${X} ${sgnT(-u)}` : X));
      return N(`최고차항의 계수가 1인 삼차함수 ${Fv}(${X})가 ${is(X, p)}에서 극댓값을 갖고, ${jh(nb(`${lm} = ${iq(z)}`), '을/를')} 만족시킨다. ${Fv}(${iq(r)})의 값은?`, ans, {
        signed: true,
        explain: `극한값이 있고 (분모) → 0이므로 (분자) → 0, 곧 ${is(`${Fv}(${iq(u)})`, w)}이고 극한값은 ${is(`${FP}(${iq(u)})`, z)}이다. ${is(`${Fv}(${X})`, `${X3} + ${Av}${X2} + ${Bv}${X} + ${V('c')}`)}라 하면 ${is(`${FP}(${iq(p)})`, 0)}, ${is(`${FP}(${iq(u)})`, z)}에서 ${is(Av, f[2])}, ${is(Bv, f[1])}이고, ${is(`${Fv}(${iq(u)})`, w)}에서 ${is(V('c'), c)}이다. 따라서 ${is(`${Fv}(${iq(r)})`, ans)}이다.`,
        facts: { value: valExpr(f, r), derived: [f[2], f[1], c].map(Math.abs) } });
    }, { standard: S7 }),
    // ① f′ = 0의 근의 모양을 경우로 나누어야 한다(허근·중근·주어진 근과 겹침). 극솟값이 없다 ⇔ f′의 부호가 한 번만 바뀐다(뜻).
    H('hard-quartic', '사차함수가 극솟값을 갖지 않도록 하는 상수', '①38', (d) => {
      const r = d.pick([1, -1, 2]), pp = d.int(-3, 4), a = r * (r + pp);
      if (a <= 0 || a > 12 || pp === -2 * r || pp === r) return null;
      const c3 = 4 * (r - pp), pr = pp * r;
      const fh = nb(`${Fv}(${X}) = ${MINUS}3${X}${sup(4)} ${sgnT(c3)}${X3} + 6(${Av}${pr ? ' ' + sgnT(pr) : ''})${X2} ${-12 * r < 0 ? MINUS : '+'} ${Math.abs(12 * r)}${Av}${X}`);
      const s = -pp - r;
      return N(`함수 ${jh(fh, '이/가')} 극솟값을 갖지 않도록 하는 양수 ${Av}의 값은?`, a, {
        explain: `${is(`${FP}(${X})`, nb(`${MINUS}12${facT(r)}(${X2}${tailT(pp, X)} ${MINUS} ${Av})`))}이다. 최고차항의 계수가 음수인 사차함수가 극솟값을 갖지 않으려면 ${FP}(${X})의 부호가 한 번만 바뀌어야 하므로, ${X2}${tailT(pp, X)} ${MINUS} ${is(Av, 0)}이 허근이나 중근을 갖거나 ${jh(String(r), '을/를')} 근으로 가져야 한다. 앞의 두 경우는 ${Av} ≤ ${jh(iq(Q(-pp * pp, 4)), '으로/로')} 양수가 아니다. ${jh(String(r), '이/가')} 근이면 ${is(Av, `${iq(r * r)} ${sgnT(pr)}`)} = ${jh(String(a), '이고/이고')}, 이때 ${is(`${FP}(${X})`, nb(`${MINUS}12${facT(r)}${sup(2)}${facT(s)}`))}이므로 ${is(X, s)}에서만 부호가 +에서 −로 바뀌어 극솟값이 없다.`,
        facts: { value: `${jn(r)}*${jn(r)}+${jn(pp)}*${jn(r)}`, derived: [pp] } });
    }, { standard: S7 })
  ];
  function yIs2(h) { return nb(`${Y} = ${h}`); }

  B.addGroup('11-2-4', { id: 'hard', title: '실력 문제', standard: S5, types: hard });
})(typeof window !== 'undefined' ? window : globalThis);
