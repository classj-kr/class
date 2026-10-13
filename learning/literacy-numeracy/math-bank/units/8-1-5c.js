// 중학교 2학년 1학기 5단원 일차함수와 그 그래프 — 실력 문항.
// 단원 틀과 도구, 싣는 기준, 뺀 것과 까닭은 8-1-5a.js 에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 ①의 장치는 이 잘못을 가진 아이가 걸리게 만들었다)
//  - 함수는 「x의 값 하나에 y의 값이 하나씩」 정해지는 관계라는 뜻을 놓친다. 「자연수 x의 약수 y」는 함수가 아니지만 「약수의 개수 y」는 함수이다.
//    서로 다른 x가 같은 y로 가도 함수이다(절댓값, 나머지). 식으로 적을 수 없으면 함수가 아니라고 여기기도 한다.
//  - x가 보이는 식이면 일차함수라고 여긴다. 정리하면 x의 항이 사라지는 식(y = 2x − 2(x + 3))과 x²이 남는 식(y = x(3 − x))은 일차함수가 아니다.
//    거꾸로 y = (몇) 꼴로 적혀 있지 않은 식(y + 4x = −4x + 3)을 일차함수에서 뺀다.
//  - 괄호가 있는 식의 기울기를 괄호 앞의 수나 괄호 안의 x의 계수로 읽는다. y = 2(1 − x)의 기울기는 −2이다. 평행이동하여도 기울기는 그대로이다.
//  - 기울기를 (x의 값의 증가량) ÷ (y의 값의 증가량)으로 거꾸로 나누거나, 감소를 음수의 증가로 바꾸지 못한다. x의 값이 감소하면 x의 값의 증가량이 음수이다.
//  - 기울기가 같으면 모두 평행하다고 여긴다. y절편까지 같으면 일치하므로 「만나지 않는」 것이 아니다.
//  - 기울기가 큰 직선이 y축에 가깝다고 여긴다. y축에 가까운 것은 기울기의 절댓값이 큰 직선이다.
//  - 선분의 길이를 절편 그대로 적는다. 길이는 절편의 절댓값이고, 넓이·길이에서 거꾸로 구한 수의 부호는 문제의 조건으로 정한다.
//
// 실력에는 ① 문제의 식·그림·상황에 함정이 있어 뜻을 정확히 대야 풀리는 문제와 ② 세 단계 넘게 이어 생각해야 풀리는 문제만 실었다.
// 수집본 기본 문서에 여러 번 나오는 꼴(세 점이 한 직선 위 ①36 ②40, 두 그래프가 x축 위에서 만날 때 ②31, 그래프로 준 활용 ②77, 기울기와 한 점·두 점으로 식 구하기)은 기본 묶음에 두고,
// 같은 얼개에 한 겹이 더 있는 것(세 점으로 미지수를 구해 x절편까지 심26, 두 축 위에서 만나는 조건 둘 심17)을 실력에 두었다.
// 과제 글이 실력에 한 유형씩만 두라고 한 것: 넓이로 수 구하기(hard-area-coef), 선분과 만나는 기울기의 범위(hard-slope-range), 다른 그래프에서 읽은 부호로 사분면 가리기(hard-signs-other-graph).
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, N, M, C } = B.kit;
  const { LAB, MINUS, GT, LT, Q, qsub, qmul, qneg, qcmp, fl, nb, tail, js, V, nz, pm } = B.kit.mid;
  const { Board, TINT } = B.kit.mgeo;
  const { S14, S15, S16, X, Y, FN, A, BB, K, XA, YA, XI, YI, TAG6, iq, jn, par, sgn, tm, lt, ex, eqT, fxT, eq, fv, is, cmp, pt, ptj, vals, rows1, QN, missQ, xcut, FORM, pl, plOk, RATIO, signFig, SIGN_FORMS, signWord, sideWord, partWord } = B.kit.m815;
  // 실력 문항. 기본 자료에서만 나온 꼴은 ref 를 '기본 ①48' 처럼 적는다.
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: ref.startsWith('기본 ') ? '수집본 기본 자료(' + ref.slice(3) + ')' : /①|②/.test(ref) ? '수집본 기본·심화 자료(' + ref + ')' : '수집본 심화 자료(' + ref + ')', make }, more || {});
  const HALF = frac(1, 2);
  const tagsOf = (flags, tags) => flags.map((f, i) => (f ? (tags || TAG6)[i] : '')).filter(Boolean).join(', ');
  // 함수인 것과 아닌 것의 짝: 말이 비슷하지만 하나는 y의 값이 하나로 정해지고 하나는 정해지지 않는다.
  const FUNC_PAIRS = [
    [() => `자연수 ${X}의 약수의 개수 ${Y}`, () => `자연수 ${X}의 약수 ${Y}`],
    [() => `수 ${X}의 절댓값 ${Y}`, () => `절댓값이 ${X}인 수 ${Y}`],
    [() => `자연수 ${X}보다 작은 소수의 개수 ${Y}`, () => `자연수 ${X}보다 작은 소수 ${Y}`],
    [(d) => { const k = d.pick([3, 4, 5]); return `자연수 ${X}를 ${k}${tail(k, '으로/로')} 나눈 나머지 ${Y}`; }, () => `자연수 ${X}의 배수 ${Y}`],
    [(d) => `자연수 ${X}와 ${d.pick([6, 10, 12])}의 최대공약수 ${Y}`, () => `자연수 ${X}와 서로소인 자연수 ${Y}`]
  ];
  // 직사각형 ABCD 와 변 BC 위의 점 P, 색칠한 삼각형 APC. 가로와 세로의 길이를 적는다.
  function rectFig(w, h) {
    const k = Math.min(190 / w, 110 / h), W = w * k, Hh = h * k, pA = [0, 0], pB = [0, Hh], pC = [W, Hh], pD = [W, 0], pP = [W * 0.38, Hh], b = Board();
    b.poly([pA, pB, pC, pD], 'fill:#fff').poly([pA, pP, pC], TINT).dot(pP).name(pA, 'A', 135).name(pB, 'B', 225).name(pC, 'C', 315).name(pD, 'D', 45).name(pP, 'P', 270);
    b.beside(pA, pD, `${w} cm`, pB).beside(pD, pC, `${h} cm`, pA);
    return b.svg(`직사각형 ABCD: 변 AD의 길이는 ${w} cm, 변 DC의 길이는 ${h} cm이다. 변 BC 위에 점 P가 있고, 삼각형 APC를 색칠하였다.`);
  }

  B.addGroup('8-1-5', {
    id: 'hard', title: '실력 문제', standard: S16,
    types: [
      // ── ① 식·그림·상황에 함정이 있어 뜻을 정확히 대야 풀리는 문제 ──
      H('hard-func-count', '말이 비슷한 대응 가운데 함수인 것 세기', '①5 심1·2', (d) => {
        // 함정: 「약수」와 「약수의 개수」, 「절댓값이 x인 수」와 「x의 절댓값」을 가리지 못하는 아이. 두 짝은 둘 다 싣고, 나머지 짝에서는 한쪽씩만 싣는다.
        const order = d.shuffle([0, 1, 2, 3, 4]), sides = [d.bool(), d.bool()];
        const rows = d.shuffle([[order[0], true], [order[0], false], [order[1], true], [order[1], false], [order[2], sides[0]], [order[3], sides[1]]].map(([k, yes]) => ({ h: FUNC_PAIRS[k][yes ? 0 : 1](d), yes })));
        const flags = rows.map((r) => r.yes), n = flags.filter(Boolean).length;
        return N(`다음 중 ${Y}가 ${X}의 함수인 것은 모두 몇 개인가?`, n, { unit: '개', standard: S14,
          figure: rows1(rows.map((r) => r.h)),
          explain: `${X}의 값 하나에 ${Y}의 값이 하나씩 정해지면 함수이다. 개수, 절댓값, 나머지, 최대공약수는 ${X}의 값마다 하나로 정해진다. 약수, 배수, 소수, 서로소인 수, 절댓값이 ${X}인 수는 여러 개이거나 없을 수 있다. 함수인 것은 ${tagsOf(flags)}의 ${n}개이다.`,
          facts: { count: flags }
        });
      }, { standard: S14 }),
      H('hard-linear-count', '정리해야 보이는 식 가운데 일차함수인 것 세기', '기본 ①14·16 ②14·15', (d) => {
        // 함정: x가 보이면 일차함수로 세는 아이(x의 항이 사라지는 식, x²이 남는 식), y = (몇) 꼴이 아니라고 빼는 아이(옮겨 적어야 하는 식).
        const rows = d.shuffle([FORM.vanish, FORM.prod, FORM.move].concat(d.shuffle([FORM.over, FORM.negParen, FORM.sum, FORM.konst, FORM.invPlus]).slice(0, 3)).map((f) => f(d)));
        const flags = rows.map((r) => r.lin), n = flags.filter(Boolean).length;
        return N(`다음 중 ${Y}가 ${X}에 대한 일차함수인 것은 모두 몇 개인가?`, n, { unit: '개',
          figure: rows1(rows.map((r) => r.h)),
          explain: `${rows.map((r, i) => (r.as ? `${TAG6[i]}은 정리하면 ${r.as}이다.` : '')).filter(Boolean).join(' ')} ${Y}가 ${X}에 대한 일차식으로 나타나는 것은 ${tagsOf(flags)}의 ${n}개이다. ${X}의 항이 사라지거나 ${X}${'<sup>2</sup>'}의 항이 남는 식, ${X}가 분모에 있는 식은 일차함수가 아니다.`,
          facts: { count: flags }
        });
      }, { standard: S15 }),
      H('hard-shift-overlap', '정리해야 기울기가 보이는 식 가운데 평행이동하면 겹쳐지는 것 세기', '심11', (d) => {
        // 함정: 괄호 앞의 수나 괄호 안의 x의 계수를 기울기로 읽는 아이. 평행이동하여도 기울기는 그대로이므로 기울기가 a인 것만 겹쳐진다.
        const a = pm(d) * d.int(2, 3), n = Math.abs(a), s = a > 0 ? 1 : -1, k = () => d.int(1, 4), c = () => nz(d, -7, 7), k1 = k(), k2 = k(), k3 = k(), swap = d.bool(), plain = d.bool();
        const rows = d.shuffle([
          { h: nb(`${Y} = ${iq(-a)}(${k1} ${MINUS} ${X})`), ok: true, as: eq(a, -a * k1) },                                    // 괄호 안의 x의 계수가 −1
          { h: nb(`${Y} = ${iq(2 * a)}(${X} ${MINUS} ${k2}) ${s > 0 ? MINUS : '+'} ${n}${X}`), ok: true, as: eq(a, -2 * a * k2) },   // 동류항을 모아야 한다
          { h: nb(`${Y} = ${iq(-a)}(${X} + ${k3})`), ok: false, as: eq(-a, -a * k3) },                                          // 기울기의 부호가 다르다
          { h: eq(Q(s, n), c()), ok: false },                                                                                   // 기울기가 역수
          swap ? { h: eqT(tm(c()), tm(a, X)), ok: true } : { h: eqT(tm(c()), tm(-a, X)), ok: false },                           // 상수항을 앞에 적은 식
          plain ? { h: eq(a, c()), ok: true } : { h: eq(-a, c()), ok: false }
        ]);
        const flags = rows.map((r) => r.ok), cnt = flags.filter(Boolean).length;
        return N(`다음 일차함수 중 그 그래프가 일차함수 ${eq(a, 0)}의 그래프를 평행이동하였을 때 겹쳐지는 것은 모두 몇 개인가?`, cnt, { unit: '개',
          figure: rows1(rows.map((r) => r.h)),
          explain: `평행이동하여도 기울기는 변하지 않으므로 기울기가 ${iq(a)}인 것만 겹쳐진다. ${rows.map((r, i) => (r.as ? `${TAG6[i]}은 정리하면 ${r.as}이다.` : '')).filter(Boolean).join(' ')} 기울기가 ${iq(a)}인 것은 ${tagsOf(flags)}의 ${cnt}개이다.`,
          facts: { count: flags }
        });
      }, { standard: S15 }),
      H('hard-slope-decrease', 'x의 값이 감소할 때 y의 값의 증가량', '심22·23', (d) => {
        // 함정: x의 값이 감소하면 x의 값의 증가량이 음수이다. 부호를 놓치면 답의 부호가 뒤집힌다.
        const a = pm(d) * d.int(2, 4), b = nz(d, -6, 6), [x1, x2] = d.until(() => [d.int(-3, 5), d.int(-5, 3)], ([u, v]) => u - v >= 2 && u - v <= 5), dy = a * (x2 - x1);
        return N(`일차함수 ${eq(a, b)}에서 ${X}의 값이 ${iq(x1)}에서 ${iq(x2)}까지 감소할 때, ${Y}의 값의 증가량은?`, dy, { signed: true, standard: S15,
          explain: `${X}의 값의 증가량은 ${iq(x2)} ${MINUS} ${par(x1)} = ${iq(x2 - x1)}이다. ${RATIO} = ${iq(a)}이므로 (${Y}의 값의 증가량) = ${iq(a)} × ${par(x2 - x1)} = ${iq(dy)}이다.`,
          facts: { value: `${jn(a)}*(${jn(x2)}-${jn(x1)})` }
        });
      }, { standard: S15 }),
      H('hard-parallel-not-same', '일치하는 것을 가려 만나지 않는 그래프 고르기', '기본 ②58·60', (d) => {
        // 함정: 기울기만 보고 고르는 아이(기울기도 y절편도 같은 식은 일치하므로 만난다), 괄호 안의 수를 그대로 기울기·y절편으로 읽는 아이.
        const k = d.pick([2, 3]), m = d.pick([2, 3]), c = d.int(1, 4), neg = d.bool(), a = neg ? -k * m : k * m, b = neg ? k * c : -k * c;
        const h = nb(`${Y} = ${k}(${neg ? `${c} ${MINUS} ${m}${X}` : `${m}${X} ${MINUS} ${c}`})`), off = d.until(() => nz(d, -3, 3), (v) => b + v !== 0);
        const rows = d.shuffle([[eq(a, b), a, b], [eq(a, b + off), a, b + off], [eq(neg ? -m : m, neg ? c : -c), neg ? -m : m, neg ? c : -c], [eq(-a, b), -a, b]]), ok = (r) => r[1] === a && r[2] !== b;
        return C(`다음 일차함수 중 그 그래프가 일차함수 ${h}의 그래프와 만나지 않는 것은?`, rows.map((r) => r[0]), rows.findIndex(ok), {
          explain: `${h}에서 ${eq(a, b)}이다. 두 그래프가 만나지 않으려면 서로 평행해야 하므로 기울기는 같고 ${YI}은 달라야 한다. ${eq(a, b)}의 그래프는 기울기도 ${YI}도 같아 일치하고, ${eq(a, b + off)}의 그래프가 평행하다.`,
          facts: { truth: rows.map(ok), want: true }
        });
      }),
      H('hard-intercept-length', '축과 만나는 점까지의 길이로 기울기 구하기', '심19', (d) => {
        // 함정: 선분의 길이를 x절편 그대로 놓는 아이. 길이는 절편의 절댓값이고, a의 부호는 문제의 조건으로 정한다.
        const k = d.pick([2, 3, 4]), b = pm(d) * k * d.int(1, 3), s = pm(d), a = s * k, h = eqT(lt(A + X), tm(b));
        return N(`일차함수 ${h}의 그래프가 ${XA}, ${YA}과 만나는 점을 각각 A, B라 하자. 선분 OB의 길이가 선분 OA의 길이의 ${k}배일 때, 수 ${A}의 값은? (단, O는 원점이고 ${cmp(A, s > 0 ? GT : LT)}이다.)`, a, { signed: true, standard: S15,
          explain: `${YI}이 ${iq(b)}이므로 선분 OB의 길이는 ${Math.abs(b)}이고, 선분 OA의 길이는 ${Math.abs(b)} ÷ ${k} = ${Math.abs(b) / k}이다. ${XI}은 ${Math.abs(b) / k} 또는 ${iq(-Math.abs(b) / k)}이다. ${cmp(A, s > 0 ? GT : LT)}이고 ${YI}이 ${signWord(b)}이므로 ${XI}은 ${iq(-b / a)}이다. ${h}에 ${is(X, -b / a)}, ${is(Y, 0)}${tail(0, '을/를')} 대입하면 ${is(A, a)}이다.`,
          facts: { value: s > 0 ? `${Math.abs(b)}/(${Math.abs(b)}/${k})` : `0-${Math.abs(b)}/(${Math.abs(b)}/${k})`, unseen: [0] }
        });
      }, { standard: S15 }),
      H('hard-slope-ratios', '삼각형의 내부의 점과 세 기울기의 크기 비교', '심27', (d) => {
        // 세 분수는 직선 OA, OC, CA의 기울기이다. 점 C가 삼각형 AOB의 내부에 있으므로 (OC의 기울기) < (OA의 기울기) < (CA의 기울기)이다.
        const P = V('p'), Qv = V('q'), sOA = frac(BB, A), sOC = frac(Qv, P), sCA = frac(`${BB} ${MINUS} ${Qv}`, `${A} ${MINUS} ${P}`), [ax, ay, cx, cy] = d.pick([[4, 5, 3, 2], [5, 4, 3, 1], [4, 4, 3, 2], [5, 5, 4, 2]]);
        // 세 견주기: [작은 쪽, 큰 쪽]. 문장마다 부등호의 방향을 따로 정한다.
        const pairs = [[sOC, sOA], [sOA, sCA], [sOC, sCA]], mk = ([lo, hi]) => { const ok = d.bool(), gt = d.bool(), flip = ok === gt; return { h: nb(`${flip ? hi : lo} ${gt ? GT : LT} ${flip ? lo : hi}`), ok }; };
        const rows = d.until(() => d.shuffle(pairs).map(mk), (list) => { const n = list.filter((r) => r.ok).length; return n === 1 || n === 2; });
        const flags = rows.map((r) => r.ok), sets = [[0], [1], [2], [0, 1], [0, 2], [1, 2], [0, 1, 2]], right = sets.findIndex((set) => set.length === flags.filter(Boolean).length && set.every((i) => flags[i]));
        const others = d.shuffle(sets.map((_, i) => i).filter((i) => i !== right)).slice(0, 3), opts = d.shuffle([right].concat(others));
        return C(`그림과 같이 제1사분면 위의 점 A${nb(`(${A}, ${BB})`)}에서 ${XA}에 내린 수선이 ${XA}과 만나는 점을 B라 하고, 삼각형 AOB의 내부의 한 점을 C${nb(`(${P}, ${Qv})`)}라 할 때, 다음 중 옳은 것을 모두 고른 것은? (단, O는 원점이다.)`, opts.map((i) => sets[i].map((j) => LAB[j]).join(', ')), opts.indexOf(right), {
          figure: pl({ x: [-1, ax + 1], y: [-1, ay + 1], grid: false, ticks: 'none', poly: [[0, 0], [ax, 0], [ax, ay]], points: [{ x: ax, y: ay, name: 'A', side: 'ur' }, { x: ax, y: 0, name: 'B', side: 'dr' }, { x: cx, y: cy, name: 'C', side: 'dr' }] }) + rows1(rows.map((r) => r.h), LAB),
          explain: `${sOA}, ${sOC}, ${sCA}는 차례로 직선 OA, OC, CA의 기울기이다. 점 C가 삼각형 AOB의 내부에 있으므로 직선 OC는 직선 OA보다 덜 기울어져 있고, 직선 CA는 직선 OA보다 더 기울어져 있다. 따라서 ${nb(`${sOC} ${LT} ${sOA} ${LT} ${sCA}`)}이고, 옳은 것은 ${tagsOf(flags, LAB)}이다.`,
          facts: { truth: opts.map((i) => i === right), want: true }
        });
      }, { standard: S15 }),
      // ── ② 세 단계 넘게 이어 생각해야 풀리는 문제 ──
      H('hard-value-chain', '식의 수를 구하고 함숫값의 셈이 다시 함숫값이 되는 x의 값 구하기', '심7', (d) => {
        // a 구하기 → 함숫값 둘 → 셈 → 그 값이 되는 x의 값
        const a = pm(d) * d.int(2, 4), b = nz(d, -6, 6), p = nz(d, -3, 3), v = a * p + b, [c1, c2] = d.pick([[2, 1], [3, 2]]), [x1, x2] = d.until(() => [nz(d, -4, 4), nz(d, -4, 4)], ([u, w]) => u !== w), f = (x) => a * x + b, t = c1 * f(x1) - c2 * f(x2), kv = c1 * x1 - c2 * x2;
        const av = `(${jn(v)}-${jn(b)})/${jn(p)}`, fx1 = `(${av}*${jn(x1)}+${jn(b)})`, fx2 = `(${av}*${jn(x2)}+${jn(b)})`, sec = c2 === 1 ? fv(x2) : c2 + fv(x2);
        return N(`함수 ${fxT(lt(A + X), tm(b))}에 대하여 ${is(fv(p), v)}일 때, ${nb(`${c1}${fv(x1)} ${MINUS} ${sec} = ${fv(K)}`)}를 만족시키는 ${K}의 값은? (단, ${A}는 수이다.)`, kv, { signed: true, standard: S14,
          explain: `${fv(p)} = ${ex(lt(Math.abs(p) === 1 ? A : Math.abs(p) + A, p < 0), tm(b))} = ${iq(v)}에서 ${is(A, a)}이다. ${is(fv(x1), f(x1))}, ${is(fv(x2), f(x2))}이므로 ${c1}${fv(x1)} ${MINUS} ${sec} = ${iq(t)}이다. ${fv(K)} = ${ex(lt(Math.abs(a) + K, a < 0), tm(b))} = ${iq(t)}에서 ${is(K, kv)}이다.`,
          facts: { value: `(${c1}*${fx1}-${c2 === 1 ? '' : c2 + '*'}${fx2}-${jn(b)})/(${av})` }
        });
      }, { standard: S14 }),
      H('hard-two-points-shift', '두 점을 지나는 그래프를 평행이동한 그래프가 지나는 점', '심16', (d) => {
        // 기울기 → 식 → 평행이동 → 대입
        const a = pm(d) * d.int(2, 4), b = nz(d, -6, 6), s = d.until(() => nz(d, -6, 6), (v) => v + b !== 0), [x1, x2, x3] = d.until(() => [nz(d, -3, 3), nz(d, -3, 3), nz(d, -4, 4)], ([u, v, w]) => u !== v && w !== u && w !== v), y1 = a * x1 + b, y2 = a * x2 + b, kv = a * x3 + b + s;
        return N(`두 점 ${pt(x1, y1)}, ${ptj(x2, y2, '을/를')} 지나는 일차함수의 그래프를 ${YA}의 방향으로 ${iq(s)}만큼 평행이동하면 점 ${pt(x3, K)}를 지난다. ${K}의 값은?`, kv, { signed: true,
          explain: `두 점을 지나는 직선의 기울기는 ${frac(`${iq(y2)} ${MINUS} ${par(y1)}`, `${iq(x2)} ${MINUS} ${par(x1)}`)} = ${iq(a)}이고, 점 ${ptj(x1, y1, '을/를')} 지나므로 식은 ${eq(a, b)}이다. 평행이동한 그래프의 식은 ${eq(a, b + s)}이고, ${is(X, x3)}${tail(Math.abs(x3), '을/를')} 대입하면 ${is(K, kv)}이다.`,
          facts: { value: `${jn(y1)}+(${jn(y2)}-${jn(y1)})*(${jn(x3)}-${jn(x1)})/(${jn(x2)}-${jn(x1)})+${jn(s)}` }
        });
      }),
      H('hard-diff-slope', '함숫값의 차로 기울기를 알아 x절편 구하기', '심24', (d) => {
        // 함숫값의 차를 x의 값의 차로 나누면 기울기이다 → y축 위에서 만나므로 y절편 → x절편
        const a = pm(d) * d.int(2, 4), p = nz(d, -4, 4), q = -a * p, [x1, x2] = d.until(() => [d.int(-4, 3), d.int(-3, 5)], ([u, v]) => v - u >= 2 && v - u <= 6), D = a * (x2 - x1), a2 = d.until(() => pm(d) * d.int(2, 6), (v) => v !== a);
        return N(`일차함수 ${nb(`${Y} = ${FN}(${X})`)}에 대하여 ${nb(`${fv(x2)} ${MINUS} ${fv(x1)} = ${iq(D)}`)}이고, 이 함수의 그래프가 일차함수 ${eq(a2, q)}의 그래프와 ${YA} 위에서 만난다. 일차함수 ${nb(`${Y} = ${FN}(${X})`)}의 그래프의 ${XI}은?`, p, { signed: true,
          explain: `${X}의 값이 ${iq(x1)}에서 ${iq(x2)}까지 ${x2 - x1}만큼 증가할 때 함숫값이 ${iq(D)}만큼 증가하므로 기울기는 ${frac(iq(D), x2 - x1)} = ${iq(a)}이다. ${YA} 위에서 만나므로 ${YI}은 ${iq(q)}이고, ${fxT(tm(a, X), tm(q))}이다. ${is(Y, 0)}${tail(0, '을/를')} 대입하면 ${XI}은 ${iq(p)}이다.`,
          facts: { value: `(0-${jn(q)})*(${jn(x2)}-${jn(x1)})/${jn(D)}`, unseen: [0] }
        });
      }),
      H('hard-collinear-xint', '세 점이 한 직선 위에 있을 조건으로 미지수를 구해 x절편 구하기', '심26', (d) => {
        // 두 기울기가 같다는 식으로 k → 기울기 → 식 → x절편
        const c = d.until(() => {
          const a = pm(d) * d.int(2, 3), p = nz(d, -4, 4), b = -a * p, [x1, x2, x3] = d.shuffle([-3, -2, -1, 1, 2, 3, 4, 5]).slice(0, 3), kv = nz(d, -4, 4), j = d.pick([2, 3]);
          return { a, p, b, x1, x2, x3, kv, j, y1: a * x1 + b, c2: a * x2 + b - kv, c3: a * x3 + b - j * kv };
        }, (v) => v.x1 !== v.p && v.x2 !== v.p && v.x3 !== v.p && v.c2 !== 0 && v.c3 !== 0 && (v.x3 - v.x1) !== v.j * (v.x2 - v.x1) && Math.abs(v.c2) <= 12 && Math.abs(v.c3) <= 15 && Math.abs(v.y1) <= 15);
        const { a, p, b, x1, x2, x3, kv, j, y1, c2, c3 } = c, yB = ex(lt(K), tm(c2)), yC = ex(lt(j + K), tm(c3));
        const kx = `((${jn(c3)}-${jn(y1)})*(${jn(x2)}-${jn(x1)})-(${jn(c2)}-${jn(y1)})*(${jn(x3)}-${jn(x1)}))/((${jn(x3)}-${jn(x1)})-${j}*(${jn(x2)}-${jn(x1)}))`, sl = `((${kx})+${jn(c2)}-${jn(y1)})/(${jn(x2)}-${jn(x1)})`;
        return N(`세 점 ${pt(x1, y1)}, ${pt(x2, yB)}, ${pt(x3, yC)}${tail(Math.abs(c3), '을/를')} 지나는 일차함수의 그래프의 ${XI}은?`, p, { signed: true,
          explain: `한 직선 위의 점은 어느 두 점으로 구해도 기울기가 같으므로 ${frac(`${yB} ${MINUS} ${par(y1)}`, `${iq(x2)} ${MINUS} ${par(x1)}`)} = ${frac(`${yC} ${MINUS} ${par(y1)}`, `${iq(x3)} ${MINUS} ${par(x1)}`)}에서 ${is(K, kv)}이다. 그래프는 두 점 ${pt(x1, y1)}, ${ptj(x2, kv + c2, '을/를')} 지나므로 기울기는 ${iq(a)}이고 식은 ${eq(a, b)}이다. ${is(Y, 0)}${tail(0, '을/를')} 대입하면 ${XI}은 ${iq(p)}이다.`,
          facts: { value: `${jn(x1)}-${jn(y1)}/(${sl})` }
        });
      }),
      H('hard-signs-other-graph', '그래프에서 읽은 a, b의 부호로 다른 일차함수의 그래프가 지나지 않는 사분면 구하기', '기본 ①44 ②52', (d) => {
        // 그림에서 a, b의 부호 → 다른 식의 기울기와 y절편의 부호 → 지나지 않는 사분면. 묻는 식은 a와 b의 자리가 바뀌어 있다.
        const ga = pm(d), gb = pm(d), f = d.pick([SIGN_FORMS[3], SIGN_FORMS[4], SIGN_FORMS[5]]), ra = f.a(ga, gb), rb = f.b(ga, gb), miss = missQ(ra, rb);
        return C(`일차함수 ${SIGN_FORMS[0].h}의 그래프가 그림과 같을 때, 일차함수 ${f.h}의 그래프가 지나지 않는 사분면은?`, QN, miss, {
          figure: signFig(d, ga, gb),
          explain: `그림의 그래프가 오른쪽 ${sideWord(ga)}로 향하고 ${YA}과 ${partWord(gb)}의 부분에서 만나므로 ${cmp(A, ga > 0 ? GT : LT)}, ${cmp(BB, gb > 0 ? GT : LT)}이다. ${f.h}의 그래프는 기울기 ${f.sl}${tail(2, '이/가')} ${signWord(ra)}, ${YI} ${f.ic}${tail(2, '이/가')} ${signWord(rb)}이므로 ${QN[miss]}을 지나지 않는다.`,
          facts: { truth: QN.map((_, i) => i === miss), want: true }
        });
      }),
      H('hard-slope-range', '선분과 만나도록 하는 기울기의 범위', '①38 ②41 심58', (d) => {
        // 그래프는 늘 y축 위의 한 점을 지난다. 선분의 두 끝 점을 지날 때의 기울기가 범위의 두 끝이다. 틀린 범위: y절편을 놓치고 구한 끝 값을 섞은 것.
        const fig = (v) => ({ x: [-1, v.x2 + 1], y: [Math.min(v.c, 0) - 1, Math.max(v.y1, v.y2) + 1], grid: false, ticks: 'none', lines: [{ a: Q(v.s1.p * v.s2.q + v.s2.p * v.s1.q, 2 * v.s1.q * v.s2.q), b: v.c }], segs: [[v.x1, v.y1, v.x2, v.y2]],
          points: [{ x: v.x1, y: v.y1, name: 'A', side: v.y1 > v.y2 ? 'ur' : 'ul', guide: true }, { x: v.x2, y: v.y2, name: 'B', side: v.y1 > v.y2 ? 'ur' : 'dr', guide: true }], xnums: [{ v: v.x1 }, { v: v.x2 }], ynums: [{ v: v.y1 }, { v: v.y2 }, { v: v.c }] });
        const c = d.until(() => { const cc = pm(d) * d.int(1, 2), x1 = d.int(1, 2), x2 = d.int(3, 5), y1 = d.int(1, 5), y2 = d.int(1, 5); return { c: cc, x1, x2, y1, y2, s1: Q(y1 - cc, x1), s2: Q(y2 - cc, x2), w1: Q(y1, x1), w2: Q(y2, x2) }; },
          (v) => v.y1 !== v.y2 && v.s1.p > 0 && v.s2.p > 0 && v.s1.q <= 4 && v.s2.q <= 4 && qcmp(v.s1, v.s2) !== 0 && new Set([v.s1, v.s2, v.w1, v.w2].map(fl)).size === 4 && plOk(fig(v)));
        const lo = qcmp(c.s1, c.s2) < 0 ? c.s1 : c.s2, hi = qcmp(c.s1, c.s2) < 0 ? c.s2 : c.s1, wLo = qcmp(c.w1, c.w2) < 0 ? c.w1 : c.w2, wHi = qcmp(c.w1, c.w2) < 0 ? c.w2 : c.w1, h = eqT(lt(A + X), tm(c.c));
        const span = (u, v) => (qcmp(u, v) < 0 ? [u, v] : [v, u]), cands = [[lo, hi], span(lo, wHi), span(wLo, hi), [wLo, wHi]], rows = d.shuffle(cands), same = (r) => qcmp(r[0], lo) === 0 && qcmp(r[1], hi) === 0;
        return C(`그림과 같이 좌표평면 위에 두 점 A${pt(c.x1, c.y1)}, B${pt(c.x2, c.y2)}${tail(c.y2, '이/가')} 있다. 일차함수 ${h}의 그래프가 선분 AB와 만나도록 하는 수 ${A}의 값의 범위는?`, rows.map((r) => nb(`${iq(r[0])} ≤ ${A} ≤ ${iq(r[1])}`)), rows.findIndex(same), {
          figure: pl(fig(c)),
          explain: `${h}의 그래프는 ${A}의 값에 관계없이 점 ${ptj(0, c.c, '을/를')} 지난다. 점 A를 지날 때 ${A} = ${frac(`${c.y1} ${MINUS} ${par(c.c)}`, c.x1)} = ${iq(c.s1)}, 점 B를 지날 때 ${A} = ${frac(`${c.y2} ${MINUS} ${par(c.c)}`, c.x2)} = ${iq(c.s2)}이다. 그래프가 선분 AB와 만나려면 기울기가 이 두 값 사이에 있어야 하므로 ${nb(`${iq(lo)} ≤ ${A} ≤ ${iq(hi)}`)}이다.`,
          facts: { truth: rows.map(same), want: true }
        });
      }),
      H('hard-area-two-graphs', '두 그래프와 y축으로 둘러싸인 도형의 넓이', '심51', (d) => {
        // 두 그래프의 x절편이 같아 x축 위에서 만난다는 것을 알아채야 한다: 밑변은 두 y절편 사이의 선분, 높이는 x절편의 절댓값.
        const c = d.until(() => { const p = pm(d) * d.int(2, 4), a1 = d.int(2, 4), a2 = -d.int(2, 4); return { p, a1, a2, b1: -a1 * p, b2: -a2 * p }; }, (v) => (Math.abs(v.b1 - v.b2) * Math.abs(v.p)) % 2 === 0 && v.a1 !== -v.a2);
        const { p, a1, a2, b1, b2 } = c, base = Math.abs(b1 - b2), area = base * Math.abs(p) / 2, hiB = Math.max(b1, b2), loB = Math.min(b1, b2), first = hiB === b1 ? [b1, a1] : [b2, a2];
        return N(`두 일차함수 ${eq(a1, b1)}, ${eq(a2, b2)}의 그래프와 ${YA}으로 둘러싸인 도형의 넓이는?`, area, {
          explain: `두 그래프의 ${XI}은 모두 ${iq(p)}이므로 두 그래프는 점 ${pt(p, 0)}에서 만난다. 두 그래프의 ${YI}은 ${iq(b1)}, ${iq(b2)}이므로 둘러싸인 도형은 밑변의 길이가 ${iq(hiB)} ${MINUS} ${par(loB)} = ${base}, 높이가 ${Math.abs(p)}인 삼각형이다. 넓이는 ${HALF} × ${base} × ${Math.abs(p)} = ${area}이다.`,
          facts: { value: `(${jn(hiB)}-${jn(loB)})*${Math.abs(first[0])}/${Math.abs(first[1])}/2`, unseen: [2] }
        });
      }),
      H('hard-area-shift', '평행이동한 두 그래프와 두 축으로 둘러싸인 도형의 넓이', '심52', (d) => {
        // 두 그래프의 절편 넷 → 큰 삼각형의 넓이에서 작은 삼각형의 넓이를 뺀다.
        const [ap, aq, b, s] = d.pick([[1, 2, 4, 2], [1, 2, 3, 2], [1, 2, 4, 3], [2, 1, 6, 2], [2, 1, 6, 4], [2, 1, 8, 4], [2, 3, 4, 2], [3, 2, 6, 3]]), sg = pm(d), a = Q(sg * ap, aq), nbv = b - s;
        const x1 = -sg * b * aq / ap, x2 = -sg * nbv * aq / ap, big = b * b * aq / ap / 2, small = nbv * nbv * aq / ap / 2, area = big - small, lo = Math.min(x1, 0), hi = Math.max(x1, 0);
        return N(`그림과 같이 일차함수 ${eq(a, b)}의 그래프와 이 그래프를 ${YA}의 방향으로 ${iq(-s)}만큼 평행이동한 그래프가 있다. 두 그래프와 ${XA}, ${YA}으로 둘러싸인 색칠한 부분의 넓이는?`, area, {
          figure: pl({ x: [Math.floor(lo) - 1, Math.ceil(hi) + 1], y: [-1, b + 1], grid: false, ticks: 'none', poly: [[x1, 0], [x2, 0], [0, nbv], [0, b]], lines: [{ a, b }, { a, b: nbv }], say: '두 직선과 두 축 사이의 부분을 색칠하였다.' }),
          explain: `평행이동한 그래프의 식은 ${eq(a, nbv)}이다. ${eq(a, b)}의 그래프의 ${XI}은 ${iq(x1)}, ${YI}은 ${b}이고, ${eq(a, nbv)}의 그래프의 ${XI}은 ${iq(x2)}, ${YI}은 ${nbv}이다. 색칠한 부분의 넓이는 큰 삼각형의 넓이에서 작은 삼각형의 넓이를 뺀 ${HALF} × ${Math.abs(x1)} × ${b} ${MINUS} ${HALF} × ${Math.abs(x2)} × ${nbv} = ${area}이다.`,
          facts: { value: `(${b}*${b}-(${b}-${s})*(${b}-${s}))${aq === 1 ? '' : '*' + aq}/${ap}/2`, unseen: [2] }
        });
      }),
      H('hard-parallel-two-points', '미지수가 든 두 점을 지나는 그래프가 평행할 때 y절편 구하기', '심42', (d) => {
        // 두 점의 기울기를 k로 나타내어 평행한 그래프의 기울기와 같게 놓는다 → k → 한 점 → y절편
        const c = d.until(() => { const a = pm(d) * d.int(2, 3), j = d.pick([2, 3]), kv = nz(d, -4, 4), x1 = nz(d, -3, 3), x2 = nz(d, -3, 4); return { a, j, kv, x1, x2, cc: (j + 1) * kv + a * (x2 - x1), yi: kv - a * x1 }; }, (v) => v.x1 < v.x2 && v.cc !== 0 && v.yi !== 0 && Math.abs(v.cc) <= 20);
        const { a, j, kv, x1, x2, cc, yi } = c, y2 = ex(tm(cc), lt(j + K, true)), other = d.until(() => nz(d, -7, 7), (v) => v !== yi), kx = `(${jn(cc)}-${jn(a)}*(${jn(x2)}-${jn(x1)}))/(${j}+1)`;
        return N(`두 점 ${pt(x1, K)}, ${pt(x2, y2)}를 지나는 일차함수의 그래프가 일차함수 ${eq(a, other)}의 그래프와 평행할 때, 이 그래프의 ${YI}은?`, yi, { signed: true,
          explain: `두 점을 지나는 직선의 기울기는 ${frac(`${y2} ${MINUS} ${K}`, `${iq(x2)} ${MINUS} ${par(x1)}`)} = ${frac(ex(tm(cc), lt((j + 1) + K, true)), x2 - x1)}이다. 평행한 두 그래프는 기울기가 같으므로 이 값이 ${iq(a)}이고, ${is(K, kv)}이다. ${eqT(tm(a, X), lt(BB))}에 ${is(X, x1)}, ${is(Y, kv)}${tail(Math.abs(kv), '을/를')} 대입하면 ${is(BB, yi)}이므로 ${YI}은 ${iq(yi)}이다.`,
          facts: { value: `${kx}-${jn(a)}*${jn(x1)}`, unseen: [1] }
        });
      }),
      H('hard-use-equal', '두 양이 같아지는 때 구하기', '심62', (d) => {
        // 식 둘을 세우고(몇 분마다의 변화를 1분마다로), 두 식의 값이 같아지는 x의 값을 구한다.
        const c = d.until(() => { const m = d.pick([3, 4, 5]), ra = d.int(2, 4), rb = ra + d.int(1, 2), LA = d.pick([40, 50, 60]), LB = LA + d.pick([10, 20, 30]); return { m, ra, rb, LA, LB, t: (LB - LA) * m / (rb - ra) }; }, (v) => Number.isInteger(v.t) && v.LA - v.ra * v.t / v.m > 0);
        const { m, ra, rb, LA, LB, t } = c;
        return N(`물통 A에는 ${LA} L, 물통 B에는 ${LB} L의 물이 들어 있다. 두 물통에서 동시에 물이 빠져나가기 시작하여 A에서는 ${m}분마다 ${ra} L씩, B에서는 ${m}분마다 ${rb} L씩 일정하게 물이 빠져나간다. 두 물통에 남아 있는 물의 양이 같아지는 것은 물이 빠져나가기 시작한 지 몇 분 후인가?`, t, { unit: '분',
          explain: `물이 빠져나가기 시작한 지 ${X}분 후에 남아 있는 물의 양을 ${Y} L라 하면 A는 ${eq(Q(-ra, m), LA)}, B는 ${eq(Q(-rb, m), LB)}이다. ${ex(tm(Q(-ra, m), X), tm(LA))} = ${ex(tm(Q(-rb, m), X), tm(LB))}에서 ${ex(tm(Q(rb - ra, m), X))} = ${LB - LA}이므로 ${is(X, t)}이다.`,
          facts: { value: `(${LB}-${LA})*${m}/(${rb}-${ra})` }
        });
      }),
      H('hard-use-clock', '처음 양이 따로 있는 상황에서 시각 구하기', '기본 ②78', (d) => {
        // 몇 분마다의 양을 식으로 옮기고, 걸린 시간을 구한 뒤 시각으로 바꾼다.
        const m = d.pick([20, 30]), r = d.pick([100, 150, 200]), W0 = d.pick([600, 900, 1200]), hh = d.int(2, 8), mi = m === 20 ? d.pick([20, 40]) : 30, T = 60 * hh + mi, W = W0 + r * T / m, tx = `(${W}-${W0})*${m}/${r}`;
        return M(`어느 저수지에서 오전에 ${W0} t의 물을 흘려보내고 수문을 닫았다가, 낮 12시부터 다시 수문을 열어 ${m}분마다 ${r} t씩 일정하게 물을 흘려보낸다. 이날 흘려보낸 물의 양이 모두 ${W} t이 되는 시각은 오후 몇 시 몇 분인가?`, [{ lead: '오후', answer: hh, unit: '시' }, { answer: mi, unit: '분' }], {
          shown: `오후 ${hh}시 ${mi}분`,
          explain: `낮 12시부터 ${X}분 동안 흘려보낸 뒤의 물의 양을 ${Y} t이라 하면 ${eq(Q(r, m), W0)}이다. ${is(Y, W)}${tail(W, '을/를')} 대입하면 ${is(X, T)}이다. ${T}분은 ${hh}시간 ${mi}분이므로 오후 ${hh}시 ${mi}분이다.`,
          facts: { calc: [[`(${tx}-${tx}%60)/60`, 0], [`${tx}%60`, 1]], unseen: [60] }
        });
      }),
      H('hard-moving-point', '직사각형의 변 위를 움직이는 점이 만드는 삼각형의 넓이', '②79 심63', (d) => {
        // 밑변 PC의 길이를 x의 식으로 나타내야 한다(넓이가 줄어든다). 식 → 넓이가 주어진 값이 되는 때
        const v = d.pick([1, 2]), h = d.pick([6, 8, 10, 12]), w = d.pick([12, 16, 18, 20]), t = d.until(() => d.int(2, 8), (u) => v * u < w), S = (w - v * t) * h / 2;
        return N(`그림과 같이 가로의 길이가 ${w} cm, 세로의 길이가 ${h} cm인 직사각형 ABCD에서 점 P가 꼭짓점 B를 출발하여 변 BC를 따라 꼭짓점 C까지 매초 ${v} cm의 빠르기로 움직인다. 삼각형 APC의 넓이가 ${S} cm²가 되는 것은 점 P가 출발한 지 몇 초 후인가?`, t, { unit: '초',
          figure: rectFig(w, h),
          explain: `출발한 지 ${X}초 후 선분 BP의 길이는 ${v === 1 ? '' : v}${X} cm이므로 선분 PC의 길이는 (${w} ${MINUS} ${v === 1 ? '' : v}${X}) cm이다. 삼각형 APC의 넓이를 ${Y} cm²라 하면 ${Y} = ${HALF} × (${w} ${MINUS} ${v === 1 ? '' : v}${X}) × ${h}, 곧 ${eqT(tm(-v * h / 2, X), tm(w * h / 2))}이다. ${is(Y, S)}${tail(S, '을/를')} 대입하면 ${is(X, t)}이다.`,
          facts: { value: `(${w}-2*${S}/${h})/${v}`, unseen: [2] }
        });
      })
    ]
  });
  // ── 기본 묶음에 덧붙이는 꼴 ──
  // 받으면서 실력에서 기본으로 내린 꼴: 기본에서 하는 일을 다시 묻거나 한 번에 풀리는 것.
  const TB = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 자료(' + ref + ')', make }, more || {});
  B.addTypes('8-1-5', 'slope', [
    TB('slope-meaning', '기울기의 뜻에 맞는 증가량 고르기', '심21·28', (d) => {
      // 보기는 모두 「x의 값이 얼마만큼 증가하면 y의 값이 얼마만큼 증가(감소)한다」이다. 함정: 거꾸로 나눈 것 둘, 증가와 감소를 바꾼 것.
      const [p, q] = d.pick([[3, 2], [2, 3], [5, 2], [4, 3], [3, 4], [5, 3]]), s = pm(d), a = Q(s * p, q), b = nz(d, -6, 6), word = (v) => (v > 0 ? '증가' : '감소'), one = d.bool();
      const say = (dx, dy, dir) => `${X}의 값이 ${dx}만큼 증가하면 ${Y}의 값은 ${dy}만큼 ${word(dir)}한다.`;
      const rows = d.shuffle([
        one ? [say(1, frac(p, q), s), true] : [say(2 * q, 2 * p, s), true],
        [say(1, frac(q, p), s), false],      // 거꾸로 나눈 값
        [say(p, q, s), false],               // x와 y의 증가량을 바꾼 것
        [say(q, p, -s), false]               // 증가와 감소를 바꾼 것
      ]);
      return C(`일차함수 ${eq(a, b)}의 그래프에 대한 설명으로 옳은 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
        explain: `기울기는 ${RATIO} = ${iq(a)}이다. ${X}의 값이 ${q}만큼 증가하면 ${Y}의 값은 ${p}만큼 ${word(s)}하고, ${X}의 값이 1만큼 증가하면 ${Y}의 값은 ${frac(p, q)}만큼 ${word(s)}한다.`,
        facts: { truth: rows.map((r) => r[1]), want: true }
      });
    }, { standard: S15 })
  ]);
  B.addTypes('8-1-5', 'nature', [
    TB('nature-near-axis', '그래프의 방향과 축에 가까운 정도로 식 고르기', '①48 심37', (d) => {
      // 함정: 기울기의 크기만 견주는 아이. 축에 가까운 정도는 기울기의 절댓값으로 정해진다(음수끼리는 수가 작을수록 y축에 가깝다).
      const [rp, rq] = d.pick([[3, 2], [6, 5], [4, 3], [5, 4]]), rs = pm(d), ref = Q(rs * rp, rq), down = d.bool(), toY = d.bool(), c = nz(d, -5, 5), big = d.pick([Q(2), Q(5, 2), Q(3)]), small = d.pick([Q(1, 3), Q(1, 2), Q(2, 3)]);
      const mk = (sign, mag) => Q(sign * mag.p, mag.q), rows = d.shuffle([[mk(-1, big), true, true], [mk(1, big), false, true], [mk(-1, small), true, false], [mk(1, small), false, false]]), ok = (r) => r[1] === down && r[2] === toY;
      return C(`다음 조건을 모두 만족시키는 일차함수의 식은?`, rows.map((r) => eq(r[0], c)), rows.findIndex(ok), {
        figure: lines([`㈎ 그래프가 오른쪽 ${down ? '아래' : '위'}로 향한다.`, `㈏ 그래프가 일차함수 ${eq(ref, nz(d, -5, 5))}의 그래프보다 ${toY ? YA : XA}에 가깝다.`]),
        explain: `㈎에서 기울기는 ${down ? '음수' : '양수'}이다. 기울기의 절댓값이 클수록 그래프는 ${YA}에 가깝고, 작을수록 ${XA}에 가깝다. ㈏에서 기울기의 절댓값은 ${frac(rp, rq)}보다 ${toY ? '크다' : '작다'}. 두 조건에 맞는 것은 ${eq(rows.find(ok)[0], c)}이다.`,
        facts: { truth: rows.map(ok), want: true }
      });
    })
  ]);
  B.addTypes('8-1-5', 'intercept', [
    TB('intercept-area-coef', '그래프와 두 축으로 둘러싸인 도형의 넓이로 기울기 구하기', '①54 심49', (d) => {
      // 넓이 → 밑변의 길이(x절편의 절댓값) → 조건으로 x절편의 부호 → 기울기
      const [bm, k] = d.pick([[4, 2], [6, 2], [6, 3], [8, 2], [8, 4], [12, 3], [12, 2], [10, 5], [12, 4], [12, 6]]), b = pm(d) * bm, s = pm(d), a = s * k, S = bm * bm / (2 * k), h = eqT(lt(A + X), tm(b));
      return N(`일차함수 ${h}의 그래프와 ${XA}, ${YA}으로 둘러싸인 도형의 넓이가 ${S}일 때, 수 ${A}의 값은? (단, ${cmp(A, s > 0 ? GT : LT)}이다.)`, a, { signed: true,
        explain: `둘러싸인 도형은 직각삼각형이고 높이는 ${YI}의 절댓값 ${bm}이다. ${HALF} × (밑변의 길이) × ${bm} = ${S}에서 밑변의 길이는 ${2 * S / bm}이므로 ${XI}은 ${2 * S / bm} 또는 ${iq(-2 * S / bm)}이다. ${cmp(A, s > 0 ? GT : LT)}이고 ${YI}이 ${signWord(b)}이므로 ${XI}은 ${iq(-b / a)}이고, ${h}에 ${is(X, -b / a)}, ${is(Y, 0)}${tail(0, '을/를')} 대입하면 ${is(A, a)}이다.`,
        facts: { value: `${s > 0 ? '' : '0-'}${bm}*${bm}/(2*${S})`, unseen: [0, 2] }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
