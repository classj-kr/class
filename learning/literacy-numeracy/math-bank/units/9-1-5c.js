// 중학교 3학년 1학기 5단원 이차함수와 그 그래프 — 실력 문항.
// 단원 틀과 도구, 싣는 기준, 뺀 것과 까닭은 9-1-5a.js 에 있다. ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 ①의 장치는 이 잘못을 가진 아이가 걸리게 만들었다)
//  - 폭을 계수 그 자체로 비교한다. 폭은 계수의 절댓값으로 비교하고, 계수의 크기(대소)는 부호까지 본다. 위로 볼록한 두 그래프 가운데 폭이 좁은 쪽의 계수가 더 작다.
//  - 계수를 문자로 둔 채 비교할 때 문자의 부호를 놓친다. a < 0이면 −a, −(1/2)a 는 양수이다(아래로 볼록한 그래프의 식이 −(1/2)ax² 일 수 있다).
//  - 「두 그래프 사이」를 한쪽만 생각한다. 위로 볼록한 그래프와 아래로 볼록한 그래프 사이에는 두 쪽으로 볼록한 그래프가 모두 들어간다.
//  - 「x < 0일 때 x의 값이 증가하면 y의 값도 증가한다」를 아래로 볼록으로 읽는다. 그런 그래프는 위로 볼록하다.
//  - am² = (수)에서 m² 대신 m 을 약수로 놓는다.
// 실력에는 ① 문제의 식·그림·조건에 함정이 있어 뜻을 정확히 대야 풀리는 문제와 ② 세 단계 넘게 이어 생각해야 풀리는 문제(점을 문자로 놓고 길이를 식으로 세우는 것 포함)만 실었다.
// 수집본 기본 문서에 여러 번 나오는 꼴(두 조건으로 계수 구하기 ①12, x축에 대칭인 그래프가 문자 좌표의 점을 지날 때 ①36)과 두세 단계로 끝나는 길이 문제(심11·15·17)는 기본 묶음에 두었다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, N, M, C, F, inline } = B.kit;
  const { LAB, MINUS, Q, qadd, qsub, qmul, qdiv, qneg, qabs, qcmp, isInt, fl, nb, tail, lastOf, js, V, sup, nz, pm, ansV, asQ, plain, SG } = B.kit.mid;
  const { S21, S22, X, Y, FN, GN, A, BB, K, MM, X2, XA, YA, TAG6, num, iq, jn, par, is, quad, eqY, eqA, fx, fv, pt, ptj, ejosa, sgnTerm, sgnCoef, rows1, grid2, tagsOf, setPick, sqOf, times, MAGS, sgnQ, convex, geo } = B.kit.m915;
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: ref.startsWith('기본 ') ? '수집본 기본 자료(' + ref.slice(3) + ')' : /①/.test(ref) ? (/심/.test(ref) ? '수집본 기본·심화 자료(' + ref + ')' : '수집본 기본 자료(' + ref + ')') : '수집본 심화 자료(' + ref + ')', make }, more || {});
  const same = (p, q) => qcmp(asQ(p), asQ(q)) === 0;
  const AX = (c) => nb(`${Y} = ${c}${A}${X2}`);   // y = (계수)ax²

  B.addGroup('9-1-5', {
    id: 'hard', title: '단원 종합', standard: S22,
    types: [
      // ── ① 식·그림·조건에 함정이 있어 뜻을 정확히 대야 풀리는 문제 ──
      H('hard-coef-letter', '기준 그래프의 계수를 문자로 둔 채 다른 그래프의 식 고르기', '심6', (d) => {
        // ㉠ 이 y = ax² 이다. ㉡ 의 계수는 ㉠ 의 계수에 −2, −1, −1/2, 1/2, 2 가운데 하나를 곱한 것이다.
        // 함정: ㉠ 이 위로 볼록하면 a < 0 이라 「아래로 볼록 → 양수처럼 보이는 식(1/2 ax²)」을 고르는 아이가 걸린다.
        const s = d.bool() ? -1 : 1, KS = [[-2, '−2'], [-1, '−'], [-0.5, MINUS + frac(1, 2)], [0.5, frac(1, 2)], [2, '2']], pick = d.pick([0, 1, 2, 3, 4]), f = KS[pick][0];
        const fig = { x: [-3, 3], y: [-4, 4], grid: false, ticks: 'none', parabolas: [{ a: s * 1, name: '㉠', side: 'l' }, { a: s * f, name: '㉡', side: 'r' }],
          aria: `두 포물선 ㉠, ㉡은 원점을 꼭짓점으로 한다. ㉠은 ${s > 0 ? '아래로' : '위로'} 볼록하다. ㉡은 ${(s * f) > 0 ? '아래로' : '위로'} 볼록하고 ${Math.abs(f) === 1 ? '㉠과 폭이 같다' : Math.abs(f) > 1 ? '㉠보다 폭이 좁다' : '㉠보다 폭이 넓다'}.` };
        const opts = d.shuffle(KS.map((k) => AX(k[1])));
        return C(`이차함수 ${eqY(A + X2)}의 그래프가 그림의 ㉠과 같을 때, 다음 중 ㉡의 그래프의 식으로 알맞은 것은? (단, ${A}는 수이다.)`, opts, opts.indexOf(AX(KS[pick][1])), {
          figure: geo(fig),
          explain: `㉠이 ${s > 0 ? '아래로' : '위로'} 볼록하므로 ${nb(`${A} ${s > 0 ? '&gt;' : '&lt;'} 0`)}이다. ㉡은 ${(s * f) > 0 ? '아래로' : '위로'} 볼록하므로 ㉡의 ${X}${sup(2)}의 계수는 ${A}와 부호가 ${f < 0 ? '반대' : '같고'}${f < 0 ? '이고' : ''}, ${Math.abs(f) === 1 ? '폭이 같으므로 절댓값이 같다' : Math.abs(f) > 1 ? '폭이 좁으므로 절댓값이 더 크다' : '폭이 넓으므로 절댓값이 더 작다'}. 따라서 ${AX(KS[pick][1])}이다.`,
          facts: { truth: opts.map((o) => o === AX(KS[pick][1])), want: true }
        });
      }),
      H('hard-coef-order', '네 그래프의 계수의 대소', '심7', (d) => {
        // 아래로 볼록한 둘, 위로 볼록한 둘. 함정: 위로 볼록한 것끼리는 폭이 좁은 쪽의 계수가 더 작다.
        const letters = d.shuffle(['a', 'b', 'c', 'd']), disp = [2.4, 0.5, -2.4, -0.5];
        const value = {}; letters.forEach((l, i) => { value[l] = disp[i]; });
        const order = (cmp) => letters.slice().sort(cmp).join(' &gt; ');
        const right = order((p, q) => value[q] - value[p]);
        const byAbsInside = letters.slice().sort((p, q) => (Math.sign(value[q]) - Math.sign(value[p])) || (Math.abs(value[q]) - Math.abs(value[p]))).join(' &gt; ');
        const byAbs = order((p, q) => Math.abs(value[q]) - Math.abs(value[p]) || value[q] - value[p]);
        const ups = letters.filter((l) => value[l] > 0).sort((p, q) => value[q] - value[p]), downs = letters.filter((l) => value[l] < 0).sort((p, q) => value[q] - value[p]);
        const flipUp = [ups[1], ups[0], downs[0], downs[1]].join(' &gt; ');
        const cands = [right, byAbsInside, byAbs, flipUp, [ups[1], ups[0], downs[1], downs[0]].join(' &gt; '), [downs[0], downs[1], ups[1], ups[0]].join(' &gt; ')].map((o) => o.replace(/[abcd]/g, (l) => V(l)));
        const opts = d.shuffle(cands.filter((o, i, all) => all.indexOf(o) === i).slice(0, 5)), rightV = right.replace(/[abcd]/g, (l) => V(l));
        const fig = { x: [-3, 3], y: [-4, 4], grid: false, ticks: 'none', parabolas: letters.map((l, i) => ({ a: disp[i], name: `${Y} = ${V(l)}${X2}` })),
          aria: `네 포물선은 모두 원점을 꼭짓점으로 한다. y = ${ups[0]}x²와 y = ${ups[1]}x²의 그래프는 아래로 볼록하고 y = ${ups[0]}x²의 그래프가 더 좁다. y = ${downs[1]}x²와 y = ${downs[0]}x²의 그래프는 위로 볼록하고 y = ${downs[1]}x²의 그래프가 더 좁다.` };
        return C(`네 이차함수 ${['a', 'b', 'c', 'd'].map((l) => eqY(V(l) + X2)).join(', ')}의 그래프가 그림과 같을 때, 네 수 ${['a', 'b', 'c', 'd'].map(V).join(', ')}의 대소 관계로 옳은 것은?`, opts, opts.indexOf(rightV), {
          figure: geo(fig),
          explain: `아래로 볼록한 ${V(ups[0])}, ${V(ups[1])}는 양수이고 폭이 좁은 쪽이 더 크므로 ${nb(`${V(ups[0])} &gt; ${V(ups[1])}`)}이다. 위로 볼록한 ${V(downs[0])}, ${V(downs[1])}는 음수이고 폭이 좁은 쪽의 절댓값이 더 크므로 ${nb(`${V(downs[0])} &gt; ${V(downs[1])}`)}이다. 따라서 ${rightV}이다.`,
          facts: { truth: opts.map((o) => o === rightV), want: true }
        });
      }),
      H('hard-between-two', '위로 볼록한 그래프와 아래로 볼록한 그래프 사이에 있는 y = ax²', '심16', (d) => {
        // 원문은 [a] 의 값을 모두 구하게 하였다. 가우스 기호는 교육과정 밖이라 빼고, 될 수 있는 a 를 모두 고르게 하였다.
        // 함정: 「사이」를 한쪽만 보거나(음수 a 를 빠뜨림), 절댓값으로만 비교한다(−q < a 인 음수를 고름).
        const [p, q] = d.until(() => d.shuffle([Q(1), Q(2), Q(3), Q(1, 2), Q(3, 2), Q(5, 2), Q(4)]).slice(0, 2), ([u, v]) => qcmp(u, v) !== 0);
        const inNeg = MAGS.filter((m) => fl(m) < fl(p)).map(qneg), inPos = MAGS.filter((m) => fl(m) < fl(q)), outNeg = MAGS.filter((m) => fl(m) > fl(p) && fl(m) < Math.max(fl(q), fl(p)) * 2).map(qneg), outPos = MAGS.filter((m) => fl(m) > fl(q));
        const vals = d.until(() => d.shuffle([d.pick(inNeg), d.pick(inPos), d.pick(outNeg.length ? outNeg : [qneg(qadd(p, Q(1)))]), d.pick(outPos.length ? outPos : [qadd(q, Q(1))]), d.pick(inNeg.concat(inPos, outNeg, outPos))]), (vs) => vs.every((v, i) => vs.findIndex((w) => same(w, v)) === i));
        const flags = vals.map((v) => fl(v) > -fl(p) && fl(v) < fl(q)), pick = setPick(d, flags, TAG6, 4);
        return C(`이차함수 ${eqY(A + X2)}의 그래프가 두 이차함수 ${eqA(qneg(p))}, ${eqA(q)}의 그래프 사이에 있을 때, 다음 중 수 ${A}의 값이 될 수 있는 것을 모두 고른 것은?`, pick.options, pick.at, {
          figure: grid2(vals.map(iq)),
          explain: `${eqA(qneg(p))}의 그래프는 위로, ${eqA(q)}의 그래프는 아래로 볼록하다. 두 그래프 사이에 있으려면 위로 볼록할 때는 ${eqA(qneg(p))}의 그래프보다 폭이 넓고(${nb(`${iq(qneg(p))} &lt; ${A} &lt; 0`)}), 아래로 볼록할 때는 ${eqA(q)}의 그래프보다 폭이 넓어야 한다(${nb(`0 &lt; ${A} &lt; ${iq(q)}`)}). 그런 수는 ${tagsOf(flags)}이다.`,
          facts: { truth: pick.truth, want: true }
        });
      }),
      H('hard-cond-convex', '증가·감소 조건과 지나는 점으로 정수 a 의 값 모두 고르기', '①37', (d) => {
        // ㈏ 는 볼록한 쪽을 말로 준 것이다. 함정: am² = −v 에서 m² 대신 m 을 약수로 놓는다, 부호를 놓친다.
        const v = d.pick([4, 8, 9, 12, 16, 18, 27]), neg = d.bool(), side = d.bool();
        const ms = [1, 2, 3, 4, 5].filter((m) => v % (m * m) === 0), right = ms.map((m) => (neg ? -1 : 1) * v / (m * m)).sort((p, q) => p - q);
        const byM = [1, 2, 3, 4, 6, 8, 9, 12, 16, 18, 27].filter((m) => v % m === 0).map((m) => (neg ? -1 : 1) * v / m).sort((p, q) => p - q);
        const setText = (list) => list.map(iq).join(', ');
        const cands = [setText(right), setText(byM), setText(right.map((x) => -x).sort((p, q) => p - q)), setText([right[neg ? 0 : right.length - 1]])].filter((o, i, all) => all.indexOf(o) === i);
        const opts = d.shuffle(cands.slice(0, 4)), y0 = neg ? -v : v;
        // ㈏: a < 0 이면 x < 0 일 때 증가(또는 x > 0 일 때 감소), a > 0 이면 x < 0 일 때 감소(또는 x > 0 일 때 증가)
        const cond = neg ? (side ? `${nb(`${X} &lt; 0`)}일 때, ${X}의 값이 증가하면 ${Y}의 값도 증가한다.` : `${nb(`${X} &gt; 0`)}일 때, ${X}의 값이 증가하면 ${Y}의 값은 감소한다.`) : (side ? `${nb(`${X} &lt; 0`)}일 때, ${X}의 값이 증가하면 ${Y}의 값은 감소한다.` : `${nb(`${X} &gt; 0`)}일 때, ${X}의 값이 증가하면 ${Y}의 값도 증가한다.`);
        return C(`이차함수 ${eqY(A + X2)}의 그래프가 다음 조건을 모두 만족시킨다. 정수 ${A}의 값을 모두 고른 것은? (단, ${MM}은 자연수이다.)`, opts, opts.indexOf(setText(right)), {
          figure: lines([`㈎ 점 ${ptj(MM, y0, '을/를')} 지난다.`, `㈏ ${cond}`]),
          explain: `㈏에서 그래프는 ${neg ? '위로' : '아래로'} 볼록하므로 ${nb(`${A} ${neg ? '&lt;' : '&gt;'} 0`)}이다. ㈎에서 ${nb(`${A}${MM}${sup(2)} = ${iq(y0)}`)}이므로 ${MM}${sup(2)}은 ${v}의 약수인 제곱수이다. ${ms.map((m) => `${is(MM, m)}이면 ${is(A, (neg ? -1 : 1) * v / (m * m))}`).join(', ')}이므로 ${A}의 값은 ${setText(right)}이다.`,
          facts: { truth: opts.map((o) => o === setText(right)), want: true }
        });
      }),
      // ── ② 세 단계 넘게 이어 생각해야 풀리는 문제 ──
      H('hard-g-define', '함숫값으로 약속한 식에서 a 의 값 구하기', '심5', (d) => {
        // f(x) = x² + px + q, g(m, n) = f(m) + f(n). g(a + 1, a − 1) = c 를 정리하면 a² + pa + (1 + q − c/2) = 0
        const [r1, r2] = d.until(() => [nz(d, -5, 5), nz(d, -5, 5)], ([u, v]) => u > v && u + v !== 0), p = -(r1 + r2), q = nz(d, -6, 6), c = 2 * (1 + q - r1 * r2);
        const root = (sgn) => `(0-${jn(p)}${sgn}(${jn(p)}**2-4*(1+${jn(q)}-${jn(c)}/2))**(1/2))/2`;
        return M(`이차함수 ${fx(quad(1, p, q))}에 대하여 ${nb(`${GN}(${MM}, ${V('n')}) = ${FN}(${MM}) + ${FN}(${V('n')})`)}으로 약속할 때, ${is(`${GN}(${A} + 1, ${A} ${MINUS} 1)`, c)}${tail(Math.abs(c), '을/를')} 만족시키는 ${A}의 값을 모두 구하시오.`, [{ lead: A + ' =', answer: r1, signed: true }, { lead: '또는 ' + A + ' =', answer: r2, signed: true }], {
          unordered: true,
          shown: `${is(A, r1)} 또는 ${is(A, r2)}`,
          explain: `${GN}(${A} + 1, ${A} ${MINUS} 1) = ${FN}(${A} + 1) + ${FN}(${A} ${MINUS} 1) = ${nb(`2${A}${sup(2)} ${sgnCoef(2 * p, A)} ${sgnTerm(2 + 2 * q)}`)}이다. 이것이 ${iq(c)}이므로 ${nb(`${A}${sup(2)} ${sgnCoef(p, A)} ${sgnTerm(r1 * r2)} = 0`)}, ${nb(`(${A} ${sgnTerm(-r1)})(${A} ${sgnTerm(-r2)}) = 0`)}에서 ${is(A, r1)} 또는 ${is(A, r2)}이다.`,
          facts: { calc: [[root('+'), 0], [root('-'), 1]], unseen: [0, 1, 2, 4] }
        });
      }),
      H('hard-line-two', '그래프 위의 두 점을 지나는 직선의 식', '①38 심13', (d) => {
        const a = nz(d, -3, 3), [p, r] = d.until(() => [nz(d, -4, 4), nz(d, -4, 4)], ([u, v]) => u !== v && u + v !== 0 && Math.abs(u) !== Math.abs(v)), q = a * p * p, mm = a * r * r, slope = a * (p + r), icpt = -a * p * r;
        return inline(`이차함수 ${eqY(A + X2)}의 그래프 위의 두 점 ${pt(p, q)}, ${ptj(r, MM, '을/를')} 지나는 직선을 그래프로 하는 일차함수의 식을 구하시오. (단, ${A}는 수이다.)`, `${Y} = {0}${X} {1}`, [{ answer: slope, signed: true }, { answer: icpt, signed: true }], {
          shown: eqY(quad(0, slope, icpt)),
          explain: `${nb(`${iq(q)} = ${A} × ${sqOf(p)}`)}에서 ${is(A, a)}이고, ${MM} = ${times(a, sqOf(r))} = ${iq(mm)}이다. 두 점 ${pt(p, q)}, ${pt(r, mm)}을 지나는 직선의 기울기는 ${frac(`${iq(mm)} ${MINUS} ${par(q)}`, `${iq(r)} ${MINUS} ${par(p)}`)} = ${iq(slope)}이고, ${Y}절편은 ${iq(icpt)}이므로 ${eqY(quad(0, slope, icpt))}이다.`,
          facts: { calc: [[`${jn(q)}/${jn(p)}**2*(${jn(p)}+${jn(r)})`, 0], [`0-${jn(q)}/${jn(p)}**2*${jn(p)}*${jn(r)}`, 1]], unseen: [0] }
        });
      }),
      H('hard-rect-on', '포물선과 x축 사이의 직사각형', '①39 심14', (d) => {
        // 위로 열린(아래로 볼록) 포물선이면 A, D 가 포물선 위, B, C 가 x축 위. 아래로 열린 포물선이면 A, D 가 x축 위, B, C 가 포물선 위.
        // 점 C 의 x좌표를 c 라 하면 가로 2c, 세로 |k|c². 「가로 = r × 세로」에서 c = 2/(r|k|).
        const c0 = d.until(() => { const k = sgnQ(pm(d), d.pick([Q(1, 2), Q(1), Q(2), Q(3), Q(1, 3), Q(3, 2), Q(2, 3)])), r = d.pick([1, 2, 3, 4]); return { k, r, c: qdiv(Q(2), qmul(Q(r), qabs(k))) }; }, (o) => !isInt(o.c) && o.c.q <= 9);
        const { k, r, c } = c0, upC = num(k) > 0, cd = 1.5, h = 3 / r, kd = (upC ? 1 : -1) * h / (cd * cd);
        const top = upC ? Math.max(h, 1) + 0.9 : 0.8, bot = upC ? -0.8 : -(Math.max(h, 1) + 0.9);
        const P = [[-cd, kd * cd * cd], [cd, kd * cd * cd]], Xs = [[-cd, 0], [cd, 0]];
        const pts = upC ? { A: P[0], B: Xs[0], C: Xs[1], D: P[1] } : { A: Xs[0], B: P[0], C: P[1], D: Xs[1] };
        const fig = { x: [-3, 3], y: [bot, top], grid: false, ticks: 'none', parabolas: [{ a: kd }], poly: [pts.A, pts.B, pts.C, pts.D],
          points: ['A', 'B', 'C', 'D'].map((nm) => ({ x: pts[nm][0], y: pts[nm][1], name: nm, side: (pts[nm][1] > (upC ? 0.01 : -0.01) ? 'u' : 'd') + (pts[nm][0] < 0 ? 'l' : 'r') })),
          aria: `꼭짓점이 원점이고 ${upC ? '아래로' : '위로'} 볼록한 포물선이 있다. ${upC ? '두 점 A, D는 포물선 위에, 두 점 B, C는 x축 위에' : '두 점 A, D는 x축 위에, 두 점 B, C는 포물선 위에'} 있고, 사각형 ABCD의 각 변은 x축 또는 y축에 평행하다. 점 A, B는 y축의 왼쪽, 점 C, D는 y축의 오른쪽에 있다.` };
        const cond = r === 1 ? '사각형 ABCD가 정사각형일 때' : `사각형 ABCD가 직사각형이고 ${nb(`${SG('AD')} = ${r}${SG('AB')}`)}일 때`;
        return ansV(`그림과 같이 이차함수 ${eqA(k)}의 그래프 위의 두 점 ${upC ? 'A, D' : 'B, C'}와 ${XA} 위의 두 점 ${upC ? 'B, C' : 'A, D'}를 꼭짓점으로 하는 ${cond}, 점 C의 ${X}좌표는?`, c, 'frac', {
          figure: geo(fig),
          explain: `점 C의 ${X}좌표를 ${V('c')}(${V('c')} &gt; 0)라 하면 그래프가 ${YA}에 대칭이므로 ${is(SG('AD'), '2' + V('c'))}이고, ${is(SG('AB'), `${iq(qabs(k))}${V('c')}${sup(2)}`.replace(/^1(?=<)/, ''))}이다. ${nb(`2${V('c')} = ${r === 1 ? '' : r}${r === 1 ? '' : ' × '}${iq(qabs(k))}${V('c')}${sup(2)}`)}에서 ${V('c')} = ${iq(c)}이다.`,
          facts: { value: `2/(${r}*${js(qabs(k))})`, unseen: [1, 2, r] }
        });
      }),
      H('hard-square-two', '두 포물선 위에 꼭짓점이 있는 정사각형', '①39', (d) => {
        // A(t, pt²), D(t, qt²)(D 는 A 바로 위), C(t + s, qt²) 는 y = px² 위. q = 4p 이면 t = s = 1/(3p), q = 9p 이면 t = 1/(4p), s = 1/(2p).
        const c0 = d.until(() => { const p = d.pick([Q(1), Q(2), Q(1, 2), Q(1, 3), Q(3)]), ratio = d.pick([4, 9]), s = ratio === 4 ? qdiv(Q(1), qmul(Q(3), p)) : qdiv(Q(1), qmul(Q(2), p)); return { p, ratio, s, area: qmul(s, s) }; }, (o) => !isInt(o.area) && o.area.q <= 400 && o.area.p <= 30);
        const { p, ratio, area } = c0, q = qmul(p, Q(ratio)), pd = ratio === 4 ? 0.12 : 0.1, td = ratio === 4 ? 1 / (3 * pd) : 1 / (4 * pd), sd = ratio === 4 ? 1 / (3 * pd) : 1 / (2 * pd), yA = pd * td * td;
        const Ap = [td, yA], Bp = [td + sd, yA], Cp = [td + sd, yA + sd], Dp = [td, yA + sd];
        const fig = { x: [-1, td + sd + 0.6], y: [-0.5, yA + sd + 0.7], grid: false, ticks: 'none', parabolas: [{ a: pd }, { a: pd * ratio }], poly: [Ap, Bp, Cp, Dp],
          points: [{ x: Ap[0], y: Ap[1], name: 'A', side: ratio === 4 ? 'd' : 'ul' }, { x: Bp[0], y: Bp[1], name: 'B', side: 'r' }, { x: Cp[0], y: Cp[1], name: 'C', side: 'r' }, { x: Dp[0], y: Dp[1], name: 'D', side: 'ul' }],
          aria: `꼭짓점이 원점이고 아래로 볼록한 두 포물선이 있다. 정사각형 ABCD의 각 변은 x축 또는 y축에 평행하고, 점 A는 왼쪽 아래, 점 C는 오른쪽 위 꼭짓점이다. 점 A와 점 C는 폭이 넓은 포물선 위에, 점 D는 폭이 좁은 포물선 위에 있다.` };
        return F(`그림에서 사각형 ABCD는 정사각형이고, 각 변은 ${XA} 또는 ${YA}에 평행하다. 두 점 A, C는 이차함수 ${eqA(p)}의 그래프 위의 점이고, 점 D는 이차함수 ${eqA(q)}의 그래프 위의 점이다. 점 A의 ${X}좌표가 양수일 때, 사각형 ABCD의 넓이는?`, area.p, area.q, { improper: area.p > area.q, anyForm: true,
          figure: geo(fig),
          explain: `점 A의 ${X}좌표를 ${V('t')}라 하면 A${pt(V('t'), `${iq(p)}${V('t')}${sup(2)}`.replace(/^1(?=<)/, ''))}, D${pt(V('t'), `${iq(q)}${V('t')}${sup(2)}`.replace(/^1(?=<)/, ''))}이므로 한 변의 길이는 ${iq(qsub(q, p))}${V('t')}${sup(2)}이다. 점 C의 ${X}좌표는 ${V('t')}의 ${ratio === 4 ? 2 : 3}배이므로(점 C의 ${Y}좌표가 점 D와 같다) 한 변의 길이는 ${ratio === 4 ? '' : 2}${V('t')}이기도 하다. ${nb(`${iq(qsub(q, p))}${V('t')}${sup(2)} = ${ratio === 4 ? '' : 2}${V('t')}`)}에서 ${V('t')} = ${iq(qdiv(Q(ratio === 4 ? 1 : 2), qsub(q, p)))}이고, 한 변의 길이는 ${iq(c0.s)}, 넓이는 ${iq(area)}이다.`,
          facts: { value: ratio === 4 ? `1/(3*${js(p)})/(3*${js(p)})` : `1/(2*${js(p)})/(2*${js(p)})`, unseen: [1, 2, 3] }
        });
      }),
      H('hard-hline-ratio', 'x축에 평행한 직선 위의 선분의 비로 a 구하기', '①40', (d) => {
        // 직선 y = h 가 y = kx²(넓은 것)와 A, D, y = ax²(좁은 것)와 B, C, y축과 E 에서 만난다(A, B, E, C, D 의 차례). r × CE = CD 이면 a = (1 + r)²k.
        const c0 = d.until(() => { const k = d.pick([Q(1, 2), Q(1, 3), Q(2, 3), Q(1, 4), Q(3, 4), Q(1, 5), Q(2, 5), Q(3, 2), Q(5, 2)]), r = d.pick([1, 2, 3]), h = d.pick([2, 3, 4, 6, 8]); return { k, r, h, a: qmul(k, Q((1 + r) * (1 + r))) }; }, (o) => !isInt(o.a));
        const { k, r, h, a } = c0, kd = 0.4, yd = 3.2, xD = Math.sqrt(yd / kd), xC = xD / (1 + r), ad = yd / (xC * xC);
        const fig = { x: [-3.4, 3.4], y: [-0.6, 4.2], grid: false, ticks: 'none', parabolas: [{ a: kd }, { a: ad }], hlines: [{ y: yd }],
          points: [{ x: -xD, y: yd, name: 'A', side: 'ul' }, { x: -xC, y: yd, name: 'B', side: 'ul' }, { x: 0, y: yd, name: 'E', side: 'ur' }, { x: xC, y: yd, name: 'C', side: 'ur' }, { x: xD, y: yd, name: 'D', side: 'ur' }],
          aria: `꼭짓점이 원점이고 아래로 볼록한 두 포물선과 x축에 평행한 직선이 있다. 직선 위에 왼쪽부터 점 A, B, E, C, D가 있고, 점 A, D는 폭이 넓은 포물선 위에, 점 B, C는 폭이 좁은 포물선 위에, 점 E는 y축 위에 있다.` };
        const cond = r === 1 ? `${nb(`${SG('CE')} = ${SG('CD')}`)}` : `${nb(`${r}${SG('CE')} = ${SG('CD')}`)}`;
        return ansV(`그림과 같이 직선 ${is(Y, h)}${tail(h, '이/가')} 두 이차함수 ${eqY(A + X2)}, ${eqA(k)}의 그래프 및 ${YA}과 만나는 점을 각각 A, B, C, D, E라 하자. ${cond}일 때, 수 ${A}의 값은? (단, 점 B, C는 이차함수 ${eqY(A + X2)}의 그래프 위의 점이다.)`, a, 'frac', {
          figure: geo(fig),
          explain: `점 D의 ${X}좌표를 ${V('d')}라 하면 ${nb(`${times(k, V('d') + sup(2))} = ${h}`)}에서 ${is(V('d') + sup(2), qdiv(Q(h), k))}이다. ${cond}이므로 ${SG('CE')}는 ${SG('ED')}의 ${frac(1, 1 + r)}이고, 점 C의 ${X}좌표는 ${frac(V('d'), 1 + r)}이다. ${nb(`${h} = ${A} × ${frac(V('d') + sup(2), (1 + r) * (1 + r))}`)}에서 ${A} = ${frac(`${h} × ${(1 + r) * (1 + r)}`, iq(qdiv(Q(h), k)))} = ${iq(a)}이다.`,
          facts: { value: `${h}*${(1 + r) * (1 + r)}/(${h}/${js(k)})`, unseen: [1, (1 + r) * (1 + r)] }
        });
      }),
      H('hard-triangle-aob', '포물선 위의 두 점과 원점이 만드는 삼각형의 넓이', '①41', (d) => {
        // A, B 의 x좌표가 a − s, a 이고 직선 AB 의 기울기가 m: k(2a − s) = m. 넓이는 |k·(a − s)·a·s| ÷ 2.
        const c0 = d.until(() => { const k = d.pick([Q(1), Q(2), Q(3), Q(1, 2)]), s = d.int(3, 6), a = d.int(1, s - 1); const m = qmul(k, Q(2 * a - s)), xA = a - s, yA = qmul(k, Q(xA * xA)), yB = qmul(k, Q(a * a)), area = qabs(qmul(k, Q(xA * a * s, 2))); return { k, s, a, m, xA, yA, yB, area }; },
          (o) => isInt(o.m) && o.m.p !== 0 && isInt(o.area) && isInt(o.yA) && isInt(o.yB) && o.area.p <= 400);
        const { k, s, a, m, xA, yA, yB, area } = c0, kd = 0.42, xAd = -2.8, xBd = 0.95;
        const Ad = [xAd, kd * xAd * xAd], Bd = [xBd, kd * xBd * xBd];
        const fig = { x: [-3.4, 2.4], y: [-0.7, 4.0], grid: false, ticks: 'none', parabolas: [{ a: kd }], poly: [Ad, [0, 0], Bd], marks: [[xAd, 0, xAd, Ad[1]], [xBd, 0, xBd, Bd[1]]],
          points: [{ x: Ad[0], y: Ad[1], name: 'A', side: 'ul' }, { x: Bd[0], y: Bd[1], name: 'B', side: 'r' }], xnums: [{ v: xAd, text: `${V('a')} ${MINUS} ${s}` }, { v: xBd, text: V('a') }],
          aria: `꼭짓점이 원점이고 아래로 볼록한 포물선 위에 점 A, B가 있다. 점 A는 y축의 왼쪽, 점 B는 y축의 오른쪽에 있고, 삼각형 AOB를 색칠하였다. x축에 점 A의 x좌표 a − ${s}, 점 B의 x좌표 a가 적혀 있다.` };
        return N(`그림과 같이 이차함수 ${eqA(k)}의 그래프 위에 두 점 A, B가 있다. 두 점 A, B의 ${X}좌표가 각각 ${V('a')} ${MINUS} ${s}, ${V('a')}이고 직선 AB의 기울기가 ${iq(m)}일 때, 삼각형 AOB의 넓이는? (단, O는 원점이다.)`, area.p, {
          figure: geo(fig),
          explain: `A${pt(`${V('a')} ${MINUS} ${s}`, `${iq(k)}(${V('a')} ${MINUS} ${s})${sup(2)}`.replace(/^1(?=\()/, ''))}, B${pt(V('a'), `${iq(k)}${V('a')}${sup(2)}`.replace(/^1(?=<)/, ''))}이므로 직선 AB의 기울기는 ${frac(`${iq(k)}${V('a')}${sup(2)} ${MINUS} ${iq(k)}(${V('a')} ${MINUS} ${s})${sup(2)}`.replace(/(^|− )1(?=[<(])/g, '$1'), s)} = ${iq(qmul(k, Q(2)))}${V('a')} ${MINUS} ${iq(qmul(k, Q(s)))}이다. 이것이 ${iq(m)}이므로 ${is(V('a'), a)}, A${pt(xA, yA)}, B${pt(a, yB)}이다. 두 점에서 ${XA}에 수선을 내려 사다리꼴의 넓이에서 두 직각삼각형을 빼면 삼각형 AOB의 넓이는 ${iq(area)}이다.`,
          facts: { value: `(${s}*${js(k)}+(${jn(m)}))/(2*${js(k)})*(${s}-(${s}*${js(k)}+(${jn(m)}))/(2*${js(k)}))*${s}*${js(k)}/2`, unseen: [1, 2] }
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
