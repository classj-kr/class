// 중학교 2학년 1학기 2단원 식의 계산 — 실력 문항.
// 단원 틀과 도구(식 글), 싣는 기준, 뺀 것과 까닭은 8-1-2a.js 에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 ①의 장치는 이 잘못을 가진 아이가 걸리게 만들었다)
//  - 거듭제곱의 덧셈에서 지수를 더한다(a² + a² 을 a⁴ 으로). 곱셈에서 지수를 곱하고(a³ × a⁴ 을 a¹² 으로) 거듭제곱의 거듭제곱에서 지수를 더한다((a²)⁴ 을 a⁶ 으로).
//    같은 식끼리 나눈 몫을 0이라 한다(지수 5 − 5 = 0을 그대로 답한다). 나누는 식의 지수가 클 때 큰 지수에서 작은 지수를 빼고 분수 꼴로 보내지 않는다.
//  - 괄호 밖의 지수를 계수에는 곱한다((2a²)³ 을 6a⁶ 으로) 또는 계수에는 아무것도 하지 않는다(2a⁶). (−a)² 과 −a² 을, −2² 과 (−2)² 을 같은 것으로 본다.
//    분수 꼴의 거듭제곱에서 분자만 거듭제곱한다.
//  - 곱셈과 나눗셈이 섞이면 뒤의 곱셈부터 계산한다. 괄호가 차례를 바꾼다는 것을 놓친다(a ÷ (b × c) 와 a ÷ b × c).
//  - 계수가 분수인 단항식으로 나눌 때 계수만 뒤집는다((3/4)x²y 의 역수를 (4/3)x²y 로). 역수를 곱하지 않고 그대로 곱한다.
//  - 괄호 앞의 −, 음수인 단항식을 괄호 안의 첫 항에만 적용한다. (다항식) ÷ (단항식)에서 한 항만 나눈다. 동류항끼리 계산하고 지수를 더한다.
//  - 문자에 제곱이 보이면 이차식이라 여긴다(x² + 3x − x², x(x + 2) − x², 1/x² + 3). 정리해야 차수가 정해진다는 것을 놓친다.
//  - 잘못 계산한 식을 바로잡을 때 「어떤 식」을 구한 데서 멈춘다. □ 가 나누는 자리에 있을 때 결과에 나머지 식을 곱한다(□ = (앞의 식) ÷ (결과)인 것을 놓친다).
//
// 실력에는 ① 식에 함정이 있어 뜻을 정확히 대야 풀리는 문제(뜻이 맞서는 등식을 섞어 놓고 옳은 것의 개수 세기, 풀이에서 처음으로 틀린 줄 찾기, 괄호가 차례를 바꾸는 식,
// 정리하면 이차항이 사라지는 식)와 ② 세 단계 넘게 이어 생각해야 풀리는 문제(잘못 계산한 식 바로잡기, 나누는 자리나 괄호 속에 있는 □, 문자식을 정리한 뒤 대입하기,
// 세 식을 각각 계산하여 대입하기, 자릿수, 거듭제곱을 문자로 나타내기, 계수의 조건으로 미지수 구하기, 도형에서 여러 번 셈하기)만 실었다.
// 옳은 것 하나를 고르는 문제, 계산이 길기만 한 것, 거꾸로 한 번 구하는 것, 두 단계를 잇는 것은 기본 묶음에 실었다.
// (2026-10-13: 처음에 뺐던 꼴을 다시 따져 파일 끝의 「다시 실은 꼴」에 덧붙였다 — 지수법칙을 수에 쓰는 문제, 뿔·구·회전체, 요령이 드는 문제.)
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, box, frac, lines, N, M, C } = B.kit;
  const { LAB, MINUS, gcd, lcm, Q, qadd, qsub, qmul, qdiv, qneg, qabs, qcmp, isInt, mag, tx, nb, tail, lastOf, js, V, sup, fit, tag, proc, nz, pm, co, asQ, SG } = B.kit.mid;
  const K = B.kit.m812;
  const { STD1, STD2, STD3, UNIT, X, keyOf, mk, pAdd, pNeg, pMul, pDiv, same, valX, coefS, letters, degOf, ordered, fpart, termH, ph, pt, htmlX, emX, xh, xe, xex, eqx, xtagged, xv, xsame, magS, vs, ms, pa, pn, kp, srcOf, told, CALC, UNSEEN, monoOK, polyOK, monoQ, polyQ, pickQ, slots, eqLabel, pair, one, sjs, ej, xj, pj, pe, nth, boxN, BOX_ASK, BOX_EXPR, lin, lin3, quad, sg, many, degP, named, times, INK, TINT, plainX, svg, label, word, shapeD, boxFig } = K;
  // 실력 문항. 기본 자료에서만 나온 꼴은 ref 를 '기본 ①8' 처럼 적는다.
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: ref.startsWith('기본 ') ? '수집본 기본 자료(' + ref.slice(3) + ')' : '수집본 심화 자료(' + ref + ')', make }, more || {});
  const TAGS = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ'], v2s = (v) => v + '^2';
  // 이름표(ㄱㄴㄷ…)를 붙인 등식 여러 줄. 줄은 { l 왼쪽 식 글, shown 오른쪽에 적은 다항식 }
  function claimsFig(rows) {
    const style = fit(Math.max(...rows.map((r) => emX(r.l) + emX({ t: 'val', p: r.shown }) + 1.62)) + 2.6);
    return lines(rows.map((r, i) => tag(TAGS[i]) + '<span class="mb-expr"' + (style || ' style="font-size:1.2rem"') + '>' + xe(r.l) + ' <i>=</i> ' + ph(r.shown, true) + '</span>'));
  }
  // 등식 여럿에서 옳은 것의 개수. pool 의 줄은 [왼쪽 식 글, 잘못 쓴 오른쪽(다항식)]. 옳게 적을 줄의 수는 1개에서 (줄 수 − 1)개 사이에서 고른다.
  function countQ(d, text, pool, size, rule) {
    const picked = d.shuffle(pool).slice(0, size), k = d.int(1, size - 1), flags = d.shuffle(picked.map((_, i) => i < k));
    const rows = picked.map(([l, bad], i) => { const good = xv(l); if (same(good, bad)) throw new Error('잘못 쓴 식이 바른 식과 같다: ' + l); return { l, good, shown: flags[i] ? good : bad }; });
    const line = (r) => htmlX(r.l) + ' = ' + ph(r.good);
    return N(text, k, {
      figure: claimsFig(rows), unit: '개',
      explain: `옳은 것은 ${TAGS.filter((_, i) => flags[i]).join(', ')}의 ${k}개이다. 나머지를 바르게 고치면 ${rows.filter((_, i) => !flags[i]).map(line).join(', ')}이다.`,
      facts: { count: flags, rule }
    });
  }
  // 직사각형 ABCD 의 변 BC 위의 점 E, 변 CD 위의 점 F 와 삼각형 AEF. W·Hs: 가로·세로의 식 글, p: 선분 EC 의 길이, q: 선분 CF 의 길이
  function rectTriFig(W, Hs, p, q) {
    const x0 = 46, y0 = 28, w = 176, h = 104, ex = x0 + w - 52, fy = y0 + h - 42, r = x0 + w, b = y0 + h;
    return svg(264, 164, `직사각형 ABCD와 그 안의 삼각형 AEF를 색칠한 그림: 변 AD와 변 BC의 길이는 ${plainX(W)}, 변 AB와 변 DC의 길이는 ${plainX(Hs)}이다. 점 E는 변 BC 위에 있고 선분 EC의 길이는 ${p}이다. 점 F는 변 CD 위에 있고 선분 CF의 길이는 ${q}이다.`,
      shapeD(`M${x0} ${y0}H${r}V${b}H${x0}z`, '#fff') + shapeD(`M${x0} ${y0}L${ex} ${b}L${r} ${fy}z`, TINT)
      + word(x0 - 9, y0 - 5, 'A') + word(x0 - 9, b + 15, 'B') + word(r + 9, b + 15, 'C') + word(r + 9, y0 - 5, 'D') + word(ex, b + 15, 'E') + word(r + 9, fy + 4, 'F')
      + label(x0 + w / 2, y0 - 9, W) + label(x0 - 8, y0 + h / 2 + 5, Hs, 'end')
      + `<text x="${(ex + r) / 2}" y="${b + 15}" text-anchor="middle" style="font-size:13px;font-weight:700;fill:#1d4ed8">${p}</text><text x="${r + 9}" y="${(fy + b) / 2 + 6}" text-anchor="middle" style="font-size:13px;font-weight:700;fill:#1d4ed8">${q}</text>`);
  }

  B.addGroup(UNIT, {
    id: 'hard', title: '실력 문제', standard: STD1,
    types: [
      // ── ① 뜻을 정확히 대야 풀리는 문제 ──
      H('hard-count-true', '뜻이 맞서는 계산을 섞어 놓고 옳은 것의 개수 세기', '심3·4·27 / 기본 ①10 ②13·39', (d, n) => {
        if (n === 0) {
          // 지수법칙: 덧셈·곱셈·거듭제곱·나눗셈의 뜻을 하나씩 따져야 한다. 잘못 쓴 오른쪽은 저마다 다른 잘못을 가진 아이가 옳다고 여기는 식이다.
          const a = one(d), [p, q] = d.until(() => [d.int(2, 5), d.int(2, 5)], ([x, y]) => x + y !== x * y && x !== y), r = d.int(3, 7);
          return countQ(d, '다음 보기 가운데 옳은 것은 모두 몇 개인가?', [
            [`${a}^${p}+${a}^${p}`, mk(1, { [a]: 2 * p })],          // 덧셈에서도 지수를 더하는 아이
            [`${a}^${p}*${a}^${q}`, mk(1, { [a]: p * q })],          // 곱셈에서 지수를 곱하는 아이
            [`(${a}^${p})^${q}`, mk(1, { [a]: p + q })],             // 거듭제곱의 거듭제곱에서 지수를 더하는 아이
            [`${a}^${r}:${a}^${r}`, []],                             // 지수 r − r = 0을 답으로 적는 아이
            [`(-${a})^2`, mk(-1, { [a]: 2 })],                       // (−a)² 과 −a² 을 같게 보는 아이
            [`(2${a}^${p})^3`, mk(6, { [a]: 3 * p })],               // 계수에 지수를 곱하는 아이
            [`${a}^${p}:${a}^${p + q}`, mk(1, { [a]: q })],          // 큰 지수에서 작은 지수를 빼고 분수 꼴로 보내지 않는 아이
            [`${a}^${q}*${a}^${q}`, mk(2, { [a]: q })]               // 곱셈을 덧셈처럼 계산하는 아이
          ], 5, 'count-law');
        }
        // 단항식의 곱셈과 나눗셈: 부호, 역수, 계산의 차례
        const v = d.pick(['x', 'a']), w = v === 'x' ? 'y' : 'b', [p, q] = [d.int(2, 4), d.int(2, 3)];
        return countQ(d, '다음 보기 가운데 옳은 것은 모두 몇 개인가?', [
          [`-3^2*${v}^${p}`, mk(9, { [v]: p })],                                   // −3² 을 (−3)² 으로 보는 아이
          [`(-2${v})^2*(-${v})^3`, mk(4, { [v]: 5 })],                             // (−x)³ 의 부호를 놓치는 아이
          [`6${v}^${p + 1}:[1|2]${v}`, mk(3, { [v]: p })],                         // 역수를 곱하지 않고 그대로 곱하는 아이
          [`8${v}^3${w}:2${v}${w}*4${v}`, mk(1, { [v]: 1 })],                      // 뒤의 곱셈부터 계산하는 아이
          [`12${v}^2${w}:(-[2|3]${v}${w})`, mk(-8, { [v]: 1 })],                   // 역수를 곱하지 않는 아이(12 × 2/3)
          [`(-4${v}^${q})^2:2${v}^${2 * q}`, mk(-8, {})],                          // (−4)² 을 −16으로 보는 아이
          [`9${v}^${p + 2}:[3|2]${v}^2`, mk(6, { [v]: p + 4 })]                    // 계수만 뒤집어 (2/3)x² 을 곱하는 아이
        ], 4, 'count-mono');
      }, { count: 2 }),
      H('hard-first-wrong', '계산 과정에서 처음으로 틀린 곳 찾기', '기본 ①8 ②34 / 심27·43·59', (d, n) => {
        // 틀린 풀이를 한 줄씩 따져야 한다. 틀린 곳 뒤의 줄은 그 잘못을 그대로 이어받아 바르게 계산한 것이다(처음 틀린 곳은 하나뿐이다).
        const ASK = '다음 계산 과정에서 처음으로 틀린 곳은?';
        if (n === 0) {
          // (x^p)^q × x^r ÷ (x^s)^t: ㉠ 거듭제곱의 거듭제곱에서 지수를 더함 ㉡ 뒤의 거듭제곱에서 지수를 더함 ㉢ 곱셈에서 지수를 곱함 ㉣ 나눗셈에서 지수를 더함
          const v = one(d), at = d.int(0, 3);
          const [p, q, r, s, t] = d.until(() => [d.int(2, 4), d.int(3, 4), d.int(2, 5), d.int(2, 3), d.int(2, 3)], ([p1, q1, r1, s1, t1]) => p1 + q1 !== p1 * q1 && s1 + t1 !== s1 * t1 && [p1 * q1 + r1 - s1 * t1, p1 + q1 + r1 - s1 * t1, p1 * q1 + r1 - (s1 + t1), p1 * q1 * r1 - s1 * t1].every((e) => e >= 2) && p1 * q1 * r1 !== p1 * q1 + r1);
          const A = at === 0 ? p + q : p * q, Cc = at === 1 ? s + t : s * t, Bv = at === 2 ? A * r : A + r, Dv = at === 3 ? Bv + Cc : Bv - Cc;
          const src = `(${v}^${p})^${q}*${v}^${r}:(${v}^${s})^${t}`, steps = [`${v}^${A}*${v}^${r}:(${v}^${s})^${t}`, `${v}^${A}*${v}^${r}:${v}^${Cc}`, `${v}^${Bv}:${v}^${Cc}`, `${v}^${Dv}`];
          const first = steps.findIndex((st) => !xsame(st, src));
          if (first !== at) throw new Error('처음 틀린 곳이 정한 곳과 다르다');
          const why = [`거듭제곱의 거듭제곱은 지수끼리 곱한다. ${xh(`(${v}^${p})^${q}`)} = ${pe(v, p * q)}이다.`, `거듭제곱의 거듭제곱은 지수끼리 곱한다. ${xh(`(${v}^${s})^${t}`)} = ${pe(v, s * t)}이다.`, `거듭제곱의 곱은 지수끼리 더한다. ${xh(`${v}^${A}*${v}^${r}`)} = ${pe(v, A + r)}이다.`, `거듭제곱의 나눗셈은 지수끼리 뺀다. ${xh(`${v}^${Bv}:${v}^${Cc}`)} = ${pe(v, Bv - Cc)}이다.`][at];
          return C(ASK, LAB.slice(0, 4), at, {
            figure: proc([{ h: xe(src) }].concat(steps.map((st, i) => ({ h: xe(st), mark: LAB[i] })))),
            explain: `${why} 바르게 계산하면 ${told(src)}이다.`, facts: { truth: steps.map((st, i) => i === first), want: true, rule: 'first-wrong-law' }
          });
        }
        if (n === 1) {
          // (−c a^p b^q)² ÷ (k/m) a^r b^s: ㉠ (−c)² 을 −c² 으로 ㉡ 역수를 계수만 뒤집음 ㉢ 나눗셈에서 지수를 더함
          const [a, b] = pair(d), at = d.int(0, 2), c = d.int(2, 4), m = d.pick([2, 3]), k = d.until(() => d.int(1, 5), (x) => gcd(x, m) === 1 && x !== 1), [p, q] = [d.int(2, 3), d.int(1, 3)], [r, s] = [d.int(1, 2 * p - 1), d.int(1, Math.max(1, 2 * q - 1))];
          const C1 = at === 0 ? -c * c : c * c, head = ms(C1, [[a, 2 * p], [b, 2 * q]]), tailV = vs([[a, r], [b, s]]);
          const src = `(${ms(-c, [[a, p], [b, q]])})^2:[${k}|${m}]${tailV}`, s0 = `${head}:[${k}|${m}]${tailV}`, s1 = at === 1 ? `${head}*[${m}|${k}]${tailV}` : `${head}*[${m}|${k}${tailV}]`, V1 = xv(s1);
          const last = at === 2 ? mk(V1[0].q, { [a]: 2 * p + r, [b]: 2 * q + s }) : V1, vals = [xv(s0), V1, last], good = xv(src), first = vals.findIndex((P) => !same(P, good));
          if (first !== at) throw new Error('처음 틀린 곳이 정한 곳과 다르다');
          const why = [`음수를 제곱하면 양수이다. ${nb(`(${tx(Q(-c))})${sup(2)}`)} = ${c * c}이다.`, `${xh(`[${k}|${m}]${tailV}`)} = ${xh(`[${k}${tailV}|${m}]`)}이므로 역수는 계수와 문자를 통째로 뒤집은 ${xh(`[${m}|${k}${tailV}]`)}이다.`, `분모의 문자와 약분하면 지수끼리 뺀다.`][at];
          return C(ASK, LAB.slice(0, 3), at, {
            figure: proc([{ h: xe(src) }, { h: xe(s0), mark: LAB[0] }, { h: xe(s1), mark: LAB[1] }, { h: ph(last, true), mark: LAB[2] }]),
            explain: `${why} 바르게 계산하면 ${told(src)}이다.`, facts: { truth: vals.map((P, i) => i === first), want: true, rule: 'first-wrong-recip' }
          });
        }
        // −k v(a v − b) − (c v³ − e v²) ÷ m v: ㉠ 음수인 단항식을 첫 항에만 곱함 ㉡ 한 항의 계수만 나눔 ㉢ 괄호 앞의 −를 첫 항에만 ㉣ 동류항끼리 계산하고 지수를 더함
        const v = d.pick(['x', 'a']), at = d.int(0, 3), v2 = v + '^2';
        const [k, a, b, m, c, e] = d.until(() => [d.int(2, 4), d.int(1, 4), d.int(1, 5), d.int(2, 4), d.int(1, 4), d.int(1, 5)], ([k1, a1, b1, m1, c1, e1]) => [k1 * b1 + e1, -k1 * b1 + e1, k1 * b1 + m1 * e1, k1 * b1 - e1].every((x) => x !== 0) && m1 * e1 !== e1);
        const F = [-k * a, at === 0 ? -k * b : k * b], Dq = [c, at === 1 ? -m * e : -e], G = [-Dq[0], at === 2 ? Dq[1] : -Dq[1]], sum = [F[0] + G[0], F[1] + G[1]];
        const src = `${ms(-k, [[v, 1]])}(${pn([[a, v], [-b, '']])})-(${pn([[m * c, v + '^3'], [-m * e, v2]])}):${m}${v}`;
        const steps = [`${pn([[F[0], v2], [F[1], v]])}-(${pn([[m * c, v + '^3'], [-m * e, v2]])}):${m}${v}`, `${pn([[F[0], v2], [F[1], v]])}-(${pn([[Dq[0], v2], [Dq[1], v]])})`, pn([[F[0], v2], [F[1], v], [G[0], v2], [G[1], v]]), at === 3 ? pn([[sum[0], v + '^4'], [sum[1], v2]]) : pn([[sum[0], v2], [sum[1], v]])];
        const first = steps.findIndex((st) => !xsame(st, src));
        if (first !== at) throw new Error('처음 틀린 곳이 정한 곳과 다르다');
        const why = [`${xh(ms(-k, [[v, 1]]))}를 괄호 안의 모든 항에 곱한다. ${xh(`${ms(-k, [[v, 1]])}*(-${b})`)} = ${xh(ms(k * b, [[v, 1]]))}이다.`, `다항식의 모든 항을 ${xh(`${m}${v}`)}로 나눈다. ${xh(`(-${m * e}${v2}):${m}${v}`)} = ${xh(ms(-e, [[v, 1]]))}이다.`, '괄호 앞에 −가 있으면 괄호 안의 모든 항의 부호가 바뀐다.', '동류항끼리 계산할 때는 계수끼리 계산하고 문자와 지수는 그대로 둔다.'][at];
        return C(ASK, LAB.slice(0, 4), at, {
          figure: proc([{ h: xe(src) }].concat(steps.map((st, i) => ({ h: xe(st), mark: LAB[i] })))),
          explain: `${why} 바르게 계산하면 ${told(src)}이다.`, facts: { truth: steps.map((st, i) => i === first), want: true, rule: 'first-wrong-mixed' }
        });
      }, { count: 3 }),
      H('hard-paren-odd', '괄호가 계산의 차례를 바꾸는 식 가리기', '심5 / 기본 ①12', (d) => {
        // x^p ÷ x^q × x^r 과 결과가 같은 식 셋과, 괄호 때문에(또는 나눗셈을 두 번 하여) 결과가 달라지는 식 하나.
        // 틀린 보기(결과가 같은 식)를 고르는 아이: 괄호를 무시하고 앞에서부터 계산하는 아이, 괄호 안의 나눗셈이 바깥에서 뒤집힌다는 것을 모르는 아이
        const v = one(d), [p, q, r] = d.until(() => [d.int(6, 10), d.int(3, 5), d.int(2, 4)], ([x, y, z]) => y > z && x - y - z >= 1);
        const sameOnes = d.shuffle([`${v}^${p}:${v}^${q}*${v}^${r}`, `${v}^${p}:(${v}^${q}:${v}^${r})`, `${v}^${p}*${v}^${r}:${v}^${q}`, `${v}^${p}*(${v}^${r}:${v}^${q})`]).slice(0, 3);
        const odd = d.pick([`${v}^${p}:(${v}^${q}*${v}^${r})`, `${v}^${p}:${v}^${q}:${v}^${r}`]), rows = d.shuffle(sameOnes.concat([odd]));
        return C('다음 중 계산 결과가 나머지 셋과 다른 하나는?', rows.map(xh), rows.indexOf(odd), {
          explain: `괄호 안을 먼저 계산하고, 괄호가 없으면 앞에서부터 차례로 계산한다. 계산 결과는 차례로 ${rows.map((st) => pt(xv(st))).join(', ')}이다.`,
          facts: { truth: rows.map((st) => !xsame(st, sameOnes[0])), want: true, rule: 'odd-paren' }
        });
      }),
      H('hard-quad-count', '정리해야 가려지는 식에서 이차식의 개수 세기', '기본 ①60 ②58', (d) => {
        // 이차식인 것: 전개하거나 정리하면 차수가 2인 다항식. 함정: 정리하면 이차항이 사라지는 식, 분모에 문자가 있는 식, 삼차식
        const v = d.pick(['x', 'a']), v2 = v + '^2', [c1, c2, c3] = many(d, 3, -6, 6), k = d.int(2, 5), m = d.int(2, 4);
        const yes = d.shuffle([quad([c1, c2, c3], v), `${k}${v}(${v}${sg(c2, '')})`, pn([[c3, ''], [c1, v2]]), `${v}(${v}+${k})${sg(c3, '')}`, `${m}${v2}-(${v2}${sg(c2, v)})`]);
        const no = d.shuffle([`${v2}${sg(c2, v)}-${v2}`, `${v}(${v}+${k})-${v2}`, `${k}-(${m}+${v2})+${v2}`, `[${k}|${v2}]${sg(c3, '')}`, pn([[c1, v + '^3'], [-1, v2], [c3, '']]), `${m}${v2}-${m}(${v2}${sg(c2, v)})`]);
        const count = d.int(1, 4), rows = d.shuffle(yes.slice(0, count).concat(no.slice(0, 5 - count))), flags = rows.map((st) => degP(xv(st)) === 2);
        if (flags.filter(Boolean).length !== count) throw new Error('이차식의 수가 정한 것과 다르다');
        return N('다음 식 가운데 이차식은 모두 몇 개인가?', count, {
          figure: xtagged(rows, TAGS), unit: '개',
          explain: `식을 전개하고 동류항끼리 정리한 다음 차수를 본다. 이차식은 ${TAGS.filter((_, i) => flags[i]).join(', ')}의 ${count}개이다. 정리하면 차례로 ${rows.map((st) => pt(xv(st))).join(', ')}이다.`,
          facts: { count: flags }
        });
      }, { standard: STD2 }),

      // ── ② 세 단계 넘게 이어 생각해야 풀리는 문제 ──
      H('hard-mono-box', '곱셈과 나눗셈이 섞인 식에서 나누는 자리에 있는 단항식 구하기', '심33 / 기본 ①43 ②42', (d) => {
        // A² ÷ □ × B = C: 거듭제곱을 계산한다 → A² × B 를 구한다 → □ 는 그것을 C 로 나눈 식이다(C 에 무엇을 곱하면 틀린다).
        const [a, b] = pair(d);
        const [As, Bs, Xs] = d.until(() => [`(${ms(d.int(2, 4) * pm(d), [[a, d.int(1, 3)], [b, d.int(1, 2)]])})^2`, ms(d.pick([2, 3, 4, 6]) * pm(d), [[a, d.int(1, 2)], [b, d.int(1, 3)]]), ms(d.pick([2, 3, 4, 6, 8]) * pm(d), [[a, d.int(1, 4)], [b, d.int(1, 4)]])],
          ([x, y, z]) => monoOK(`${x}:${pa(z)}*${pa(y)}`, [a, b]) && Math.abs(xv(`${x}:${pa(z)}*${pa(y)}`)[0].q.p) <= 99);
        const Cs = srcOf(xv(`${As}:${pa(Xs)}*${pa(Bs)}`)), AB = srcOf(xv(`${As}*${pa(Bs)}`)), src = `${As}*${pa(Bs)}:${pa(Cs)}`;
        return monoQ(BOX_EXPR, src, [a, b], {
          figure: eqx(`${As}:?*${pa(Bs)}`, Cs),
          explain: `${xh(`${As}*${pa(Bs)}`)} = ${xh(AB)}이므로 ${xh(AB)} ÷ □ = ${xh(Cs)}이다. □ = ${xh(`${pa(AB)}:${pa(Cs)}`)} = ${pt(xv(src))}이다.`
        });
      }),
      H('hard-box-nested', '여러 겹 괄호 속에 있는 □ 안의 다항식 구하기', '기본 ①66', (d) => {
        // c1 a − {c2 b − k(c3 a − □)} = R: 괄호를 풀면 −k□ 가 남는다 → 나머지를 정리한다 → k□ = (정리한 식) − R → k 로 나눈다.
        const [a, b] = pair(d), parts = [a, b], [c1, c2, k, c3] = [d.int(2, 7), d.int(1, 6), d.int(2, 4), d.int(1, 5)], [p, q] = d.until(() => [nz(d, -5, 5), nz(d, -5, 5)], ([x, y]) => c1 + k * c3 - k * x !== 0 && -c2 - k * y !== 0);
        const Rs = lin([c1 + k * c3 - k * p, -c2 - k * q], a, b), rest = `${pn([[c1, a]])}-{${pn([[c2, b]])}-${k}(${pn([[c3, a]])})}`, src = `[${rest}-(${Rs})|${k}]`, open = srcOf(xv(rest));
        return polyQ(BOX_EXPR, src, parts, {
          figure: eqx(`${pn([[c1, a]])}-{${pn([[c2, b]])}-${k}(${pn([[c3, a]])}-?)}`, Rs),
          explain: `좌변의 괄호를 풀면 ${xh(open)} − ${k}□이다. ${k}□ = ${xh(`(${open})-(${Rs})`)} = ${xh(srcOf(xv(`(${open})-(${Rs})`)))}이므로 □ = ${pt(xv(src))}이다.`
        });
      }, { standard: STD2 }),
      H('hard-poly-box', '나눗셈과 곱셈이 이어진 식에서 □ 안의 다항식 구하기', '기본 ①80 ②74', (d) => {
        // □ ÷ M1 × M2 = P: 거꾸로 P 를 M2 로 나누고 M1 을 곱한다(□ = P ÷ M2 × M1).
        const [a, b] = pair(d), parts = [a + '^2', a + b], k1 = d.int(2, 4) * pm(d), k2 = d.int(2, 5), [x1, x2] = d.until(() => many(d, 2, -4, 4), ([x, y]) => Math.abs(x) !== Math.abs(y));
        const M1 = ms(k1, [[a, 1]]), M2 = ms(k2, [[a, 1], [b, 1]]), Xs = pn([[k1 * x1, a + '^2'], [k1 * x2, a + b]]), Ps = srcOf(xv(`(${Xs}):${pa(M1)}*${M2}`)), back = srcOf(xv(`(${Ps}):${M2}`)), src = `(${Ps}):${M2}*${pa(M1)}`;
        return polyQ(BOX_EXPR, src, parts, {
          figure: eqx(`(?):${pa(M1)}*${M2}`, Ps),
          explain: `□ ÷ ${k1 < 0 ? '(' + xh(M1) + ')' : xh(M1)} = ${xh(`(${Ps}):${M2}`)} = ${xh(back)}이다. □ = ${xh(`(${back})*${pa(M1)}`)} = ${pt(xv(src))}이다.`
        });
      }, { standard: STD3 }),
      H('hard-subst-nested', '괄호가 겹친 문자식을 정리한 다음 다항식 대입하기', '심46 / 기본 ①69', (d) => {
        // −k1 A − {B + k2(A − k3 B)}: 중괄호 안을 정리한다 → 전체를 정리한다 → 식을 대입한다 → 전개하여 정리한다.
        const [a, b] = ['x', 'y'], parts = [a, b];
        const [pa1, pb1, k1, k2, k3] = d.until(() => [many(d, 2, -4, 4), many(d, 2, -4, 4), d.int(2, 4), d.int(2, 3), d.int(2, 3)], ([x, y, u, w, z]) => x[0] * y[1] !== x[1] * y[0] && polyOK(`${-u - w}(${lin(x, a, b)})+${w * z - 1}(${lin(y, a, b)})`, parts));
        const As = lin(pa1, a, b), Bs = lin(pb1, a, b), env = { A: xv(As), B: xv(Bs) }, form = `-${k1}A-{B+${k2}(A-${k3}B)}`, simple = srcOf(xv(form, {}));
        return polyQ(`다음 두 식 ${V('A')}, ${V('B')}에 대하여 ${xj(form, '을/를')} 계산하시오.`, form, parts, {
          env, figure: named([['A', As], ['B', Bs]]),
          explain: `먼저 식을 간단히 하면 ${told(form, {})}이다. ${V('A')}, ${V('B')}에 식을 대입하면 ${told(simple.replace(/A/, `(${As})`).replace(/B/, `(${Bs})`))}이다.`
        });
      }, { standard: STD2 }),
      H('hard-three-calc', '여러 식을 각각 계산한 다음 대입하여 정리하기', '심67·68 / 기본 ②87', (d, n) => {
        const v = 'x', parts = [v + '^2', v, ''];
        if (n === 1) {
          // A 는 (다항식) ÷ (단항식)², B 는 다항식에서 전개한 식을 뺀 것이다. 둘을 계산한다 → k1 A − k2(B + C) = R 에서 k2(B + C) 를 구한다 → k2 로 나눈다 → B 를 뺀다.
          const [As, Bs, Rs, k1, k2] = d.until(() => {
            const m = d.pick([2, 3]), [u, w] = [d.int(2, 3), d.int(2, 3)], A0 = `(${pn([[m * m * nz(d, -3, 3), v + '^4'], [m * m * nz(d, -3, 3), v + '^3'], [m * m * nz(d, -4, 4), v2s(v)]])}):(${m}${v})^2`, B0 = `${quad(many(d, 3, -5, 5), v)}-${d.int(2, 3)}${v}(${v}${sg(nz(d, -4, 4), '')})`, cs = many(d, 3, -4, 4);
            return [A0, B0, srcOf(xv(`${u}(${A0})-${w}{(${B0})+(${quad(cs, v)})}`)), u, w];
          }, ([x, y, r, u, w]) => xv(x).length === 3 && xv(y).length >= 2 && xv(r).length === 3 && polyOK(`[${u}(${x})-(${r})|${w}]-(${y})`, parts));
          const src = `[${k1}(${As})-(${Rs})|${k2}]-(${Bs})`, A1 = srcOf(xv(As)), B1 = srcOf(xv(Bs)), form = `${k1}A-${k2}(B+C)`, inner = srcOf(xv(`[${k1}(${As})-(${Rs})|${k2}]`));
          return polyQ(`다음 두 식 ${V('A')}, ${V('B')}에 대하여 ${nb(`${htmlX(form)} = ${htmlX(Rs)}`)}${ej(htmlX(Rs), '을/를').slice(htmlX(Rs).length)} 만족시키는 다항식 ${V('C')}를 구하시오.`, src, parts, {
            figure: named([['A', As], ['B', Bs]]), rule: 'three-calc-solve',
            explain: `두 식을 계산하면 ${V('A')} = ${xh(A1)}, ${V('B')} = ${xh(B1)}이다. ${nb(`${k2}(${V('B')} + ${V('C')})`)} = ${xh(`${k1}(${A1})-(${Rs})`)} = ${pt(xv(`${k1}(${A1})-(${Rs})`))}이므로 ${nb(`${V('B')} + ${V('C')}`)} = ${xh(inner)}이다. ${V('C')} = ${xh(`(${inner})-(${B1})`)} = ${pt(xv(src))}이다.`
          });
        }
        // A 는 다항식의 뺄셈, B 는 (다항식) ÷ (단항식), C 는 단항식의 나눗셈이다. 셋을 계산한 다음 k1 A + k2 B − C 에 넣는다.
        const [As, Bs, Cs, k1, k2] = d.until(() => {
          const m = d.int(2, 4), c = d.pick([2, 3]), e = d.int(1, 3);
          return [`${quad(many(d, 3, -5, 5), v)}-(${pn([[nz(d, -4, 4), v + '^2'], [nz(d, -5, 5), v]])})`, `(${pn([[m * nz(d, -3, 3), v + '^3'], [m * nz(d, -4, 4), v + '^2']])}):${m}${v}`, `(${c}${v}^${e + 1}y^2)^2:${c}${v}^${2 * e + 1}y^4`, d.int(2, 3), d.int(2, 3)];
        }, ([x, y, z, u, w]) => xv(x).length === 3 && xv(y).length === 2 && polyOK(`${u}(${x})+${w}(${y})-${z}`, parts));
        const env = { A: xv(As), B: xv(Bs), C: xv(Cs) }, form = `${k1}A+${k2}B-C`, [A1, B1, C1] = [As, Bs, Cs].map((s) => srcOf(xv(s)));
        return polyQ(`다음 세 식 ${V('A')}, ${V('B')}, ${V('C')}에 대하여 ${xj(form, '을/를')} 계산하시오.`, form, parts, {
          env, figure: named([['A', As], ['B', Bs], ['C', Cs]]), rule: 'three-calc-plug',
          explain: `세 식을 계산하면 ${V('A')} = ${xh(A1)}, ${V('B')} = ${xh(B1)}, ${V('C')} = ${xh(C1)}이다. ${xh(form)} = ${told(`${k1}(${A1})+${k2}(${B1})-${C1}`)}이다.`
        });
      }, { count: 2, standard: STD3 }),
      H('hard-digits', '2와 5의 거듭제곱의 곱이 몇 자리 자연수인지 구하기', '심22 / 기본 ①29 ②24', (d) => {
        // 2와 5를 짝지어 10의 거듭제곱을 만든다 → 남은 거듭제곱의 값을 구한다 → (남은 수의 자릿수) + (0의 개수)
        const more2 = d.bool(), k = d.int(2, more2 ? 6 : 3), t = d.int(5, 12), left = (more2 ? 2 : 5) ** k, digits = String(left).length, p = more2 ? t + k : t, q = more2 ? t : t + k, src = `2^${p}*5^${q}`;
        return N(`${xj(src, '은/는')} 몇 자리 자연수인가?`, t + digits, {
          unit: '자리', explain: `2와 5를 ${t}개씩 짝지으면 ${xh(src)} = ${nb(`${more2 ? 2 : 5}${sup(k)} × (2 × 5)${sup(t)}`)} = ${left} × ${nb('10' + sup(t))}이다. ${left} 뒤에 0이 ${t}개 붙으므로 ${digits} + ${t} = ${t + digits}(자리)이다.`,
          facts: { calc: [[`${digits}+${t}`, 0]], unseen: [digits, t] }
        });
      }),
      H('hard-as-letter', '거듭제곱을 문자로 놓고 다른 거듭제곱 나타내기', '심12 / 기본 ①26', (d) => {
        // 밑을 같게 고친다 → 지수의 곱의 차례를 바꾼다 → 문자로 바꾼다: 8^x = (2³)^x = (2^x)³ = a³
        const b = d.pick([2, 3]), k = d.int(3, b === 2 ? 5 : 4), name = d.pick(['a', 'A']), big = b ** k;
        return N(`${nb(`${V(name)} = ${b}${sup(V('x'))}`)}일 때, ${nb(big + sup(V('x')))}을 ${V(name)}를 사용하여 나타내면 ${nb(V(name) + sup(box()))}이다. □ 안에 알맞은 수는?`, k, {
          explain: `${big} = ${nb(b + sup(k))}이므로 ${nb(big + sup(V('x')))} = ${nb(`(${b}${sup(k)})${sup(V('x'))}`)} = ${nb(b + sup(k + V('x')))} = ${nb(`(${b}${sup(V('x'))})${sup(k)}`)} = ${nb(V(name) + sup(k))}이다.`,
          facts: { calc: [[String(k), 0]], unseen: [k] }
        });
      }),
      H('hard-coef-cond', '계수의 조건으로 식 속의 미지수 구하기', '심48·62 / 기본 ②59·79', (d, n) => {
        if (n === 0) {
          // −k1(a x² + c1 x + c2) + k2(x² − b x + c3): 정리한다 → 상수항을 구한다 → x² 의 계수와 x 의 계수가 상수항과 같다는 조건으로 a, b 를 구한다.
          const [k1, k2, a, b, c1, c2, c3] = d.until(() => [d.int(2, 3), d.int(2, 4), nz(d, -3, 3), nz(d, -3, 3), nz(d, -5, 5), nz(d, -5, 5), nz(d, -5, 5)], ([u, w, a1, b1, x, y, z]) => u !== w && w - u * a1 === -u * y + w * z && -u * x - w * b1 === w - u * a1 && w - u * a1 !== 0), Kc = -k1 * c2 + k2 * c3;
          const src = `-${k1}(ax^2${sg(c1, 'x')}${sg(c2, '')})+${k2}(x^2-bx${sg(c3, '')})`;
          return slots(`다음 식을 계산하면 ${nb(V('x') + sup(2))}의 계수와 ${V('x')}의 계수가 모두 상수항과 같다. 수 ${V('a')}, ${V('b')}의 값은?`, [[eqLabel('a'), a, `(${k2}-(-${k1}*${sjs(c2)}+${k2}*${sjs(c3)}))/${k1}`, true], [eqLabel('b'), b, `(-${k1}*${sjs(c1)}-(-${k1}*${sjs(c2)}+${k2}*${sjs(c3)}))/${k2}`, true]], {
            figure: xex(src), rule: 'coef-cond-add', unseen: [1],
            explain: `정리하면 ${nb(`(−${k1}${V('a')} + ${k2})${V('x')}${sup(2)} + (${tx(Q(-k1 * c1))} − ${k2}${V('b')})${V('x')} ${Kc < 0 ? MINUS : '+'} ${Math.abs(Kc)}`)}이다. 상수항이 ${tx(Q(Kc))}이므로 −${k1}${V('a')} + ${k2} = ${tx(Q(Kc))}에서 ${V('a')} = ${tx(Q(a))}이고, ${tx(Q(-k1 * c1))} − ${k2}${V('b')} = ${tx(Q(Kc))}에서 ${V('b')} = ${tx(Q(b))}이다.`
          });
        }
        // k1 x(x − c1 y) + (a x − y) × (−k2 x): 전개한다 → x² 의 계수 k1 − k2 a 와 xy 의 계수 −k1 c1 + k2 를 구한다 → 두 계수가 같다는 조건으로 a 를 구한다.
        const [k1, k2, c1, a] = d.until(() => [d.int(2, 5), d.int(2, 4), d.int(2, 8), nz(d, -5, 5)], ([u, w, x, a1]) => u - w * a1 === -u * x + w && Math.abs(a1) > 1), same2 = k1 - k2 * a;
        const src = `${k1}x(x-${c1}y)+(ax-y)*(-${k2}x)`;
        return N(`다음 식을 전개하여 정리하면 ${nb(V('x') + sup(2))}의 계수와 ${nb(V('x') + V('y'))}의 계수가 서로 같다. 수 ${V('a')}의 값은?`, a, {
          signed: true, figure: xex(src),
          explain: `전개하면 ${nb(`${k1}${V('x')}${sup(2)} − ${k1 * c1}${V('x')}${V('y')} − ${k2}${V('a')}${V('x')}${sup(2)} + ${k2}${V('x')}${V('y')}`)}이므로 ${nb(V('x') + sup(2))}의 계수는 ${k1} − ${k2}${V('a')}, ${nb(V('x') + V('y'))}의 계수는 −${k1 * c1} + ${k2} = ${tx(Q(-k1 * c1 + k2))}이다. ${k1} − ${k2}${V('a')} = ${tx(Q(same2))}에서 ${V('a')} = ${tx(Q(a))}이다.`,
          facts: { calc: [[`(${k1}-(-${k1}*${c1}+${k2}))/${k2}`, 0]], rule: 'coef-cond-dist' }
        });
      }, { count: 2, standard: STD3 }),
      H('hard-rect-triangles', '직사각형에서 세 직각삼각형을 뺀 삼각형의 넓이', '기본 ①89 ②80', (d) => {
        // 넓이 = (직사각형) − (직각삼각형 셋). 삼각형마다 (단항식) × (다항식)을 전개해야 한다(네 번 셈한다).
        const [a, b] = pair(d), parts = [a, b, ''];
        const [w, h, p, q] = d.until(() => [d.int(3, 8), d.int(3, 8), d.int(2, 6), d.int(2, 6)], ([w1, h1, p1, q1]) => (p1 * h1) % 2 === 0 && (q1 * w1) % 2 === 0 && (p1 * q1) % 2 === 0 && p1 !== q1 && q1 * w1 !== p1 * h1);
        const W = ms(w, [[a, 1]]), Hs = ms(h, [[b, 1]]), src = `${W}*${Hs}-[1|2]*${Hs}(${W}-${p})-[1|2]*${p}*${q}-[1|2]*${W}(${Hs}-${q})`;
        const t1 = pt(xv(`[1|2]*${Hs}(${W}-${p})`)), t3 = pt(xv(`[1|2]*${W}(${Hs}-${q})`));
        return polyQ(`다음 그림과 같이 가로의 길이가 ${xh(W)}, 세로의 길이가 ${xh(Hs)}인 직사각형 ABCD에서 변 BC 위의 점 E와 변 CD 위의 점 F에 대하여 ${nb(SG('EC') + ' = ' + p)}, ${nb(SG('CF') + ' = ' + q)}이다. 삼각형 AEF의 넓이를 구하시오.`, src, parts, {
          figure: rectTriFig(W, Hs, p, q), unseen: [2],
          explain: `직사각형의 넓이 ${pt(xv(`${W}*${Hs}`))}에서 세 직각삼각형의 넓이를 뺀다. 삼각형 ABE의 넓이는 ${frac(1, 2)} × ${xh(Hs)} × (${xh(`${W}-${p}`)}) = ${t1}, 삼각형 ECF의 넓이는 ${frac(1, 2)} × ${p} × ${q} = ${p * q / 2}, 삼각형 AFD의 넓이는 ${frac(1, 2)} × ${xh(W)} × (${xh(`${Hs}-${q}`)}) = ${t3}이다. 삼각형 AEF의 넓이는 ${pt(xv(src))}이다.`
        });
      }, { standard: STD3 }),
      H('hard-surface', '부피에서 높이를 구하여 직육면체의 겉넓이 구하기', '기본 ②48·82', (d) => {
        // 밑넓이를 구한다 → 부피를 밑넓이로 나누어 높이를 구한다 → 세 쌍의 면의 넓이를 구한다 → 동류항끼리 모아 2배 한다.
        const v = d.pick(['a', 'x']), parts = [v + '^4', v + '^3'], [c1, c2, c3] = d.until(() => [d.int(2, 5), d.int(2, 6), d.int(2, 5)], ([x, y, z]) => x !== z && x * y * z <= 99);
        const W = ms(c1, [[v, 2]]), L = ms(c2, [[v, 1]]), Hh = ms(c3, [[v, 2]]), Vs = srcOf(xv(`${W}*${L}*${Hh}`)), base = srcOf(xv(`${W}*${L}`)), src = `2{${W}*${L}+${W}*(${Vs}:(${W}*${L}))+${L}*(${Vs}:(${W}*${L}))}`;
        return polyQ(`다음 그림과 같이 밑면의 가로의 길이가 ${xh(W)}, 세로의 길이가 ${xh(L)}인 직육면체의 부피가 ${xh(Vs)}일 때, 이 직육면체의 겉넓이를 구하시오.`, src, parts, {
          figure: boxFig(W, L), unseen: [2],
          explain: `밑넓이는 ${xh(`${W}*${L}`)} = ${xh(base)}이므로 높이는 ${xh(`${Vs}:${base}`)} = ${xh(Hh)}이다. 겉넓이는 ${xh(`2(${base}+${srcOf(xv(`${W}*${Hh}`))}+${srcOf(xv(`${L}*${Hh}`))})`)} = ${pt(xv(src))}이다.`
        });
      }),
      H('hard-missing-term', '나누어지는 다항식 속의 빈 항 구하기', '심65', (d) => {
        // k x(c1 x + c2) − (T − □) ÷ M = R: 전개한다 → (T − □) ÷ M 을 구한다 → M 을 곱한다 → T 에서 뺀다.
        const [k, c1, c2, m, s] = d.until(() => [d.int(2, 4), d.int(1, 4), nz(d, -5, 5), d.int(2, 4), nz(d, -5, 5)], ([k1, , x, , s1]) => k1 * x + s1 !== 0 && Math.abs(s1) > 0), u = d.until(() => d.int(1, 5), (x) => k * c1 - x !== 0);
        const F = `${k}x(${pn([[c1, 'x'], [c2, '']])})`, Ms = `${m}x^2y`, Ts = `${m * u}x^4y`, Rs = pn([[k * c1 - u, 'x^2'], [k * c2 + s, 'x']]), src = `${Ts}-((${F})-(${Rs}))*${Ms}`, midS = srcOf(xv(`(${F})-(${Rs})`));
        return monoQ('다음 식의 □ 안에 알맞은 단항식을 구하시오.', src, ['x', 'y'], {
          figure: eqx(`${F}-(${Ts}-?):${Ms}`, Rs),
          explain: `${xh(F)} = ${pt(xv(F))}이므로 (${xh(Ts)} − □) ÷ ${xh(Ms)} = ${xh(`(${srcOf(xv(F))})-(${Rs})`)} = ${xh(midS)}이다. ${xh(Ts)} − □ = ${xh(`(${midS})*${Ms}`)} = ${pt(xv(`(${midS})*${Ms}`))}이므로 □ = ${pt(xv(src))}이다.`
        });
      }, { standard: STD3 })
    ]
  });
  // ── 기본 묶음에 덧붙이는 꼴 ──
  // 받으면서 실력에서 기본으로 내린 꼴: 기본에서 하는 일을 다시 묻거나 한 번에 풀리는 것.
  const TB = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 자료(' + ref + ')', make }, more || {});
  B.addTypes('8-1-2', 'mono', [
    TB('mono-wrong', '단항식의 곱셈·나눗셈을 잘못 계산한 식 바로잡기', '심35·36 / 기본 ①46 ②44', (d, n) => {
      // 단계: 잘못 계산한 결과에서 거꾸로 셈해 어떤 식을 구한다 → 바르게 계산한다. 어떤 식을 구한 데서 멈추면 틀린다.
      const [a, b] = pair(d);
      if (n === 0) {
        // X 에 어떤 식을 곱해야 할 것을 나누었더니 R → 어떤 식 = X ÷ R, 바른 식 = X × (X ÷ R)
        const [Xs, Ms] = d.until(() => [ms(d.pick([4, 6, 8, 12]) * pm(d), [[a, d.int(2, 4)], [b, d.int(2, 5)]]), ms(d.pick([2, 3, 4]), [[a, d.int(1, 2)], [b, d.int(1, 3)]])], ([x, y]) => monoOK(`${pa(x)}:${y}`, [a, b]) && Math.abs(xv(`${pa(x)}*${y}`)[0].q.p) <= 99);
        const Rs = srcOf(xv(`${pa(Xs)}:${Ms}`)), src = `${pa(Xs)}*(${pa(Xs)}:${pa(Rs)})`;
        return monoQ(`${xh(Xs)}에 어떤 식을 곱해야 할 것을 잘못하여 나누었더니 ${xj(Rs, '이/가')} 되었다. 바르게 계산한 식을 구하시오.`, src, [a, b], {
          figure: null, rule: 'mono-wrong-mul', explain: `${xh(Xs)} ÷ (어떤 식) = ${xh(Rs)}이므로 어떤 식은 ${xh(`${pa(Xs)}:${pa(Rs)}`)} = ${xh(Ms)}이다. 바르게 계산하면 ${xh(`${pa(Xs)}*${Ms}`)} = ${pt(xv(src))}이다.`
        });
      }
      // 어떤 식을 A 로 나누어야 할 것을 곱했더니 P → 어떤 식 = P ÷ A, 바른 식 = P ÷ A ÷ A
      const [As, Ans] = d.until(() => [ms(d.pick([2, 3]) * pm(d), [[a, d.int(1, 2)], [b, d.int(1, 2)]]), ms(nz(d, -6, 6), [[a, d.int(1, 3)], [b, d.int(1, 3)]])], ([x, y]) => Math.abs(xv(`${pa(y)}*${pa(x)}*${pa(x)}`)[0].q.p) <= 99 && Math.abs(xv(y)[0].q.p) > 1);
      const Ps = srcOf(xv(`${pa(Ans)}*${pa(As)}*${pa(As)}`)), mid = srcOf(xv(`${pa(Ans)}*${pa(As)}`)), src = `${pa(Ps)}:${pa(As)}:${pa(As)}`;
      return monoQ(`어떤 식을 ${xj(As, '으로/로')} 나누어야 할 것을 잘못하여 곱했더니 ${xj(Ps, '이/가')} 되었다. 바르게 계산한 식을 구하시오.`, src, [a, b], {
        figure: null, rule: 'mono-wrong-div', explain: `(어떤 식) × ${As.startsWith('-') ? '(' + xh(As) + ')' : xh(As)} = ${xh(Ps)}이므로 어떤 식은 ${xh(`${pa(Ps)}:${pa(As)}`)} = ${xh(mid)}이다. 바르게 계산하면 ${xh(`${pa(mid)}:${pa(As)}`)} = ${pt(xv(src))}이다.`
      });
    }, { count: 2 })
  ]);
  B.addTypes('8-1-2', 'addsub', [
    TB('add-wrong', '다항식의 덧셈·뺄셈을 잘못 계산한 식 바로잡기', '심50 / 기본 ①68 ②61', (d, n) => {
      // 단계: 잘못 계산한 결과에서 거꾸로 셈해 어떤 식을 구한다 → 바르게 계산한다.
      const v = d.pick(['x', 'a']), parts = [v + '^2', v, ''];
      const [p, r] = d.until(() => [many(d, 3, -6, 6), many(d, 3, -7, 7)], ([x, y]) => x.every((c, i) => [y[i] + 2 * c, y[i] + c, 2 * c - y[i], y[i] - c].every((t) => t !== 0))), P = quad(p, v), R = quad(r, v);
      if (n === 0) {
        // 어떤 식에 P 를 더해야 할 것을 뺐더니 R → 어떤 식 = R + P, 바른 식 = R + P + P
        const src = `(${R})+(${P})+(${P})`, some = quad(r.map((c, i) => c + p[i]), v);
        return polyQ(`어떤 식에 ${xj(P, '을/를')} 더해야 할 것을 잘못하여 뺐더니 ${xj(R, '이/가')} 되었다. 바르게 계산한 식을 구하시오.`, src, parts, {
          figure: null, rule: 'poly-wrong-known', explain: `어떤 식에서 ${xj(P, '을/를')} 빼어 ${xj(R, '이/가')} 되었으므로 어떤 식은 ${xh(`(${R})+(${P})`)} = ${xh(some)}이다. 바르게 계산하면 ${xh(`(${some})+(${P})`)} = ${pt(xv(src))}이다.`
        });
      }
      // P 에서 어떤 식을 빼야 할 것을 더했더니 R → 어떤 식 = R − P, 바른 식 = P − (R − P)
      const src = `(${P})-{(${R})-(${P})}`, some = quad(r.map((c, i) => c - p[i]), v);
      return polyQ(`${xh(P)}에서 어떤 식을 빼야 할 것을 잘못하여 더했더니 ${xj(R, '이/가')} 되었다. 바르게 계산한 식을 구하시오.`, src, parts, {
        figure: null, rule: 'poly-wrong-unknown', explain: `${xh(P)}에 어떤 식을 더하여 ${xj(R, '이/가')} 되었으므로 어떤 식은 ${xh(`(${R})-(${P})`)} = ${xh(some)}이다. 바르게 계산하면 ${xh(`(${P})-(${some})`)} = ${pt(xv(src))}이다.`
      });
    }, { count: 2, standard: STD2 })
  ]);
  B.addTypes('8-1-2', 'dist', [
    TB('dist-wrong', '다항식에 단항식을 곱할 것을 나눈 계산 바로잡기', '기본 ①81 ②75', (d) => {
      // 어떤 다항식에 M 을 곱해야 할 것을 나누었더니 R → 어떤 다항식 = R × M, 바른 식 = R × M × M
      const [a, b] = pair(d), parts = [a + '^3' + b + '^2', a + '^2' + b + '^3'], k = d.pick([2, 3]) * pm(d), [c1, c2] = d.until(() => many(d, 2, -5, 5), ([x, y]) => Math.abs(x) !== Math.abs(y));
      const Ms = ms(k, [[a, 1], [b, 1]]), Rs = lin([c1, c2], a, b), some = srcOf(xv(`(${Rs})*${pa(Ms)}`)), src = `(${Rs})*${pa(Ms)}*${pa(Ms)}`;
      return polyQ(`어떤 다항식에 ${xj(Ms, '을/를')} 곱해야 할 것을 잘못하여 나누었더니 ${xj(Rs, '이/가')} 되었다. 바르게 계산한 식을 구하시오.`, src, parts, {
        figure: null, explain: `(어떤 다항식) ÷ ${k < 0 ? '(' + xh(Ms) + ')' : xh(Ms)} = ${xh(Rs)}이므로 어떤 다항식은 ${xh(`(${Rs})*${pa(Ms)}`)} = ${xh(some)}이다. 바르게 계산하면 ${xh(`(${some})*${pa(Ms)}`)} = ${pt(xv(src))}이다.`
      });
    }, { standard: STD3 })
  ]);

  // ── 다시 실은 꼴 ──
  // 처음 지을 때 「지수법칙을 수의 성질 문제로 끌고 간다」「뿔·구·회전체가 나온다」「요령·꼬임이다」「한 유형만 싣는다」는 까닭으로 뺀 꼴을 다시 따져 덧붙였다
  // (사용자: 「수학실력에 필요해보이는문제는 다 넣어」). 꼴마다의 판정은 대조표(싣기_대조표.md)의 「다시 본 꼴」에 있다.
  //  - 실은 것: 공약수로 괄호 밖의 지수 정하기(①18 ②26 심21), 이어진 등식(①20 심20), 지수가 이웃한 거듭제곱의 합(①21 심19), 간단히 하면 거듭제곱이 같아지는 수(①23),
  //    거듭제곱을 문자로 나타내기의 다른 꼴(①27·28 ②22 심12·13), 일의 자리의 숫자(①30 심23), 거듭제곱의 크기 비교(②25), 접어 올리는 합(심2), 밑이 다른 수의 거듭제곱(심10),
  //    묶어서 약분하기(심11), 지수가 문자의 식인 나눗셈과 약속 기호(심15·16), 지수의 등식(심17·18 ②20의 그런 변형), 한 수의 거듭제곱으로 묶기(심24), 둘씩 곱한 값(심26),
  //    계수에서 바깥 지수를 먼저 구하는 섞인 계산(①40·②40·심30의 변형), 자릿수의 다른 꼴(①29 ②24 심22의 변형), 회전체(심42 ②46의 변형), 넘친 물(심72),
  //    □ 가 두 번 나오는 등식(심34), 같은 식으로 나눈 두 몫(심37), 차수로 가르는 두 단항식(심70), 계수가 순환소수인 단항식(심31 — 앞 단원 8-1-1의 내용),
  //    뿔·삼각기둥의 높이(①49 ②47), 부피가 같은 두 입체도형(①50 심41), 두 입체도형의 부피 견주기(①51·52).
  //  - 그대로 뺀 것: 지수가 0이 될 수 있는 꼴(지수 x − 1, 2m − 6 — 같은 일을 지수 x + 1 꼴로 실었다), 분모에 문자가 있는 식을 계산해야 하는 것(심14, ①52의 원문 높이 — 높이를 단항식으로 바꾸어 실었다),
  //    그림을 알 수 없는 것(②29 마방진 ①53), 중1과 같은 문제, (다항식) × (다항식)이 되는 것, 등식의 변형.
  // 지수 자리에 식이 오는 수의 거듭제곱(9^(x + 4))은 식 글로 적을 수 없어 화면 글을 바로 짓는다. 그런 유형의 답은 코드가 따로 셈하고, 화면 글만 읽어 다시 푸는 풀이로 씨앗 여럿에서 맞춰 보았다.
  const { inline } = B.kit;
  const { ex, emOf, taggedEx, rep, ansV, range } = B.kit.mid;
  const { T: TN, inv, thin, SIMP, intVal } = K;
  const X1 = V('x'), Y1 = V('y'), Z1 = V('z');
  const np = (base, e) => base + (e === 1 ? '' : sup(e));              // 수의 거듭제곱의 글(지수 자리에 식을 적을 수 있다)
  const ne = (base, e) => nb(np(base, e));                             // 글줄 속에 적는 것
  const OX = ' <i>×</i> ', OD = ' <i>÷</i> ', OE = ' <i>=</i> ', OPL = ' <i>+</i> ';
  // 지수 자리의 일차식: lx(2, 1) → 2x + 1, lx(1, 0) → x
  const lx = (c, k, name) => (c === 1 ? '' : c) + (name || X1) + (k ? ' + ' + k : '');
  const CYCLE = { 2: [2, 4, 8, 6], 3: [3, 9, 7, 1], 7: [7, 9, 3, 1], 8: [8, 4, 2, 6] }, NTH = ['첫째', '둘째', '셋째', '넷째'];
  // 제곱을 적는 식 글: 글자 하나이면 a^2, 아니면 (2a)^2
  const sq2 = (M) => (/^[a-zπ]$/.test(M) ? `${M}^2` : `(${M})^2`);
  // 직각삼각형 ABC(각 B 가 직각): 변 AB 는 세로로, 변 BC 는 가로로 놓고 두 변의 길이(식 글)를 변 옆에 적는다.
  const rightTriFig = (M1, M2) => svg(250, 148, `직각삼각형 ABC: 각 B가 직각이고, 변 AB의 길이는 ${plainX(M1)}, 변 BC의 길이는 ${plainX(M2)}이다.`,
    shapeD('M84 22V112H214z', TINT) + thin('M84 102h10v10') + word(84, 16, 'A') + word(74, 126, 'B') + word(222, 126, 'C') + label(76, 72, M1, 'end') + label(149, 131, M2));

  B.addTypes(UNIT, 'hard', [
    // ── ② 세 단계 넘게 이어 생각해야 풀리는 문제: 지수법칙을 수에 쓰기 ──
    H('hard-max-outer', '공약수를 따져 괄호 밖의 지수 정하기', '심21 / 기본 ①18 ②26', (d, n) => {
      // (x^a y^b z^c)^d = x^A y^B z^C: ad = A, bd = B, cd = C 이므로 d 는 A, B, C 의 공약수이다 → 가장 큰 것(최대공약수)이나 1이 아닌 가장 작은 것을 고른다 → a, b, c 를 구한다.
      const g = d.pick(n === 0 ? [4, 6, 4, 6, 8] : [4, 6, 9, 4, 6]), [a, b, c] = d.until(() => [d.int(1, 7), d.int(1, 7), d.int(1, 7)], (t) => new Set(t).size === 3 && gcd(gcd(t[0], t[1]), t[2]) === 1 && Math.max(...t) * g <= 48);
      const [A, Bq, Cq] = [a * g, b * g, c * g], k = n === 0 ? g : g % 2 === 0 ? 2 : 3, fracForm = d.bool(), name = n === 0 ? 'd' : 'k', W = V(name);
      const lhs = fracForm ? `([x^ay^b|z^c])^${name}` : `(x^ay^bz^c)^${name}`, rhs = fracForm ? `[x^${A}y^${Bq}|z^${Cq}]` : `x^${A}y^${Bq}z^${Cq}`, divs = range(1, g).filter((i) => g % i === 0);
      return slots(`다음 식을 만족시키는 ${n === 0 ? '가장 큰 자연수' : '1이 아닌 가장 작은 자연수'} ${W}와 그때의 자연수 ${V('a')}, ${V('b')}, ${V('c')}의 값은?`,
        [[eqLabel(name), k, String(k)], [eqLabel('a'), A / k, `${A}/${k}`], [eqLabel('b'), Bq / k, `${Bq}/${k}`], [eqLabel('c'), Cq / k, `${Cq}/${k}`]], {
          figure: eqx(lhs, rhs), unseen: [k], rule: n === 0 ? 'outer-max' : 'outer-min',
          explain: `괄호 안의 지수마다 ${W}를 곱하므로 ${nb(`${V('a')}${W} = ${A}`)}, ${nb(`${V('b')}${W} = ${Bq}`)}, ${nb(`${V('c')}${W} = ${Cq}`)}이다. ${W}는 ${A}, ${Bq}, ${Cq}의 공약수 ${divs.join(', ')} 가운데 하나이고, ${n === 0 ? '가장 큰 것' : '1이 아닌 가장 작은 것'}은 ${k}이다. ${nb(`${W} = ${k}`)}일 때 ${nb(`${V('a')} = ${A} ÷ ${k} = ${A / k}`)}, ${nb(`${V('b')} = ${Bq} ÷ ${k} = ${Bq / k}`)}, ${nb(`${V('c')} = ${Cq} ÷ ${k} = ${Cq / k}`)}이다.`
        });
    }, { count: 2 }),
    H('hard-chain-eq', '이어진 등식에서 지수 자리의 두 문자의 값 구하기', '심20 / 기본 ①20', (d, n) => {
      const b = d.pick([2, 3]), es = b === 2 ? [2, 3, 4, 5] : [2, 3, 4];
      if (n === 0) {
        // B^(x + p) = B^x × b^y = C^r: 밑을 b 로 고친다 → 첫 식과 끝 식에서 x 를 구한다 → 가운데 식과 끝 식에서 y 를 구한다.
        const [e1, e3, p, r, x] = d.until(() => { const u = d.pick([2, 3]), w = d.pick(es.filter((e) => e !== u)), p0 = d.int(1, 5), x0 = d.int(1, 6); return [u, w, p0, u * (x0 + p0) / w, x0]; }, (t) => Number.isInteger(t[3]) && t[3] >= 2 && t[3] <= 9);
        const B1 = b ** e1, C1 = b ** e3, total = e3 * r, y = total - e1 * x;
        return slots(`다음 식을 만족시키는 자연수 ${X1}, ${Y1}의 값은?`, [[eqLabel('x'), x, `${e3}*${r}/${e1}-${p}`], [eqLabel('y'), y, `${e3}*${r}-${e1}*(${e3}*${r}/${e1}-${p})`]], {
          figure: ex(np(B1, lx(1, p)) + OE + np(B1, X1) + OX + np(b, Y1) + OE + np(C1, r)), unseen: [e1, e3], rule: 'chain-eq',
          explain: `${B1} = ${ne(b, e1)}, ${C1} = ${ne(b, e3)}이므로 ${ne(B1, lx(1, p))} = ${ne(b, `${e1}(${lx(1, p)})`)}, ${ne(C1, r)} = ${ne(b, total)}이다. ${nb(`${e1}(${lx(1, p)}) = ${total}`)}에서 ${nb(`${X1} = ${x}`)}이다. ${nb(`${np(B1, X1)} × ${np(b, Y1)}`)} = ${ne(b, `${e1 * x} + ${Y1}`)}이므로 ${nb(`${e1 * x} + ${Y1} = ${total}`)}에서 ${nb(`${Y1} = ${y}`)}이다.`
        });
      }
      // B^(x + p) = C^q ÷ b^(y + j) = b^t 에서 x, y 를 구한다 → 단항식의 식을 간단히 한다 → 대입한다.
      const [e1, e3, p, q, j, x, y, src] = d.until(() => {
        const u = d.pick([2, 3]), w = d.pick(es), p0 = d.int(1, 3), j0 = d.int(1, 3), x0 = d.int(2, 5), y0 = d.int(2, 5), [a1, b1, k1, a2, b2, a3, k3] = [d.int(1, 2), d.int(1, 3), d.int(2, 3), d.int(2, 5), d.int(2, 4), d.int(1, 3), d.pick([2, 4])];
        return [u, w, p0, (u * (x0 + p0) + y0 + j0) / w, j0, x0, y0, `(${vs([['x', a1], ['y', b1]])})^${k1}:(-${vs([['x', a2], ['y', b2]])})^2*(-${vs([['x', a3]])})^${k3}`];
      }, (t) => {
        if (!Number.isInteger(t[3]) || t[3] < 2 || t[3] > 9) return false;
        const P = xv(t[7])[0], v = intVal(xv(t[7], { x: t[5], y: t[6] }));
        return P.e.x >= 1 && P.e.x <= 6 && P.e.y !== 0 && Math.abs(P.e.y) <= 4 && Boolean(v) && isInt(v) && v.p >= 2 && v.p <= 999 && t[5] !== 1;
      });
      const B1 = b ** e1, C1 = b ** e3, t = e1 * (x + p), P = xv(src)[0], [ux, uy] = [P.e.x, P.e.y], v = intVal(xv(src, { x, y })).p;
      const xs = `(${t}/${e1}-${p})`, ys = `(${e3}*${q}-${j}-${t})`, plugged = uy > 0 ? `${np(x, ux)} × ${np(y, uy)}` : frac(np(x, ux), np(y, -uy));
      return ansV(`자연수 ${X1}, ${Y1}가 등식 ㈎를 만족시킬 때, 식 ㈏의 값은?`, Q(v), 'int', {
        figure: taggedEx([np(B1, lx(1, p)) + OE + np(C1, q) + OD + np(b, lx(1, j, Y1)) + OE + np(b, t), xe(src)], ['㈎', '㈏']),
        explain: `${B1} = ${ne(b, e1)}이므로 ${nb(`${e1}(${lx(1, p)}) = ${t}`)}에서 ${nb(`${X1} = ${x}`)}이다. ${ne(C1, q)} = ${ne(b, e3 * q)}이므로 ${nb(`${e3 * q} − (${lx(1, j, Y1)}) = ${t}`)}에서 ${nb(`${Y1} = ${y}`)}이다. ㈏를 간단히 하면 ${told(src)}이다. ${nb(`${X1} = ${x}`)}, ${nb(`${Y1} = ${y}`)}${tail(y, '을/를')} 대입하면 ${nb(plugged)} = ${v}이다.`,
        facts: { value: uy > 0 ? `${xs}**${ux}*${ys}**${uy}` : `${xs}**${ux}/${ys}**${-uy}`, unseen: [e1, e3, ux, Math.abs(uy)] }
      });
    }, { count: 2 }),
    H('hard-expo-sum', '지수가 이웃한 거듭제곱의 합에서 지수 구하기', '심19 / 기본 ①21', (d) => {
      // b^(x + 2) + b^(x + 1) (+ b^x) = N: 거듭제곱마다 b^x 을 떼어 낸다 → (b² + b (+ 1)) × b^x 으로 모은다 → b^x 의 값을 구한다 → x 를 구한다.
      const b = d.pick([2, 3, 5]), three = d.bool(), x = d.int(2, b === 2 ? 5 : b === 3 ? 4 : 3), k = b * b + b + (three ? 1 : 0), total = k * b ** x;
      return N(`다음 식을 만족시키는 자연수 ${X1}의 값은?`, x, {
        figure: ex(np(b, lx(1, 2)) + OPL + np(b, lx(1, 1)) + (three ? OPL + np(b, X1) : '') + OE + total),
        explain: `${ne(b, lx(1, 2))} = ${nb(`${b * b} × ${np(b, X1)}`)}, ${ne(b, lx(1, 1))} = ${nb(`${b} × ${np(b, X1)}`)}이므로 좌변은 ${nb(`(${b * b} + ${b}${three ? ' + 1' : ''}) × ${np(b, X1)}`)} = ${nb(`${k} × ${np(b, X1)}`)}이다. ${nb(`${k} × ${np(b, X1)} = ${total}`)}에서 ${nb(`${np(b, X1)} = ${b ** x}`)} = ${ne(b, x)}이므로 ${nb(`${X1} = ${x}`)}이다.`,
        facts: { calc: [[String(x), 0]], unseen: [x], rule: 'expo-sum' }
      });
    }),
    H('hard-pow-eq', '식을 간단히 하여 거듭제곱이 같은 수 구하기', '기본 ①23', (d) => {
      // (x^p / c)^k ÷ (−x)² × (m / x^q)^n = R: 분수 꼴의 거듭제곱을 계산한다 → 약분하여 (계수) × x^t 으로 간단히 한다 → x^t 의 값을 구한다 → 같은 지수의 거듭제곱으로 고쳐 x 를 구한다.
      const [c, k, m, nn, p, q, ans, t, R] = d.until(() => {
        const [c0, k0, m0, n0, p0, q0, a0] = [d.pick([2, 3]), d.int(2, 4), d.pick([2, 3]), d.int(2, 3), d.int(2, 4), d.int(1, 2), d.pick([2, 3])], t0 = p0 * k0 - 2 - q0 * n0;
        return [c0, k0, m0, n0, p0, q0, a0, t0, t0 >= 2 ? m0 ** n0 * a0 ** t0 / c0 ** k0 : 0];
      }, (v) => v[7] >= 2 && v[7] <= 4 && Number.isInteger(v[8]) && v[8] >= 2 && v[8] <= 999);
      const src = `([x^${p}|${c}])^${k}:(-x)^2*([${m}|${vs([['x', q]])}])^${nn}`, coef = xv(src)[0].q;
      return N(`다음 식을 만족시키는 자연수 ${X1}의 값은?`, ans, {
        figure: eqx(src, String(R)),
        explain: `좌변을 간단히 하면 ${told(src)}이다. ${coef.p === 1 && coef.q === 1 ? `${nb(`${X1}${sup(t)} = ${R}`)}이고` : `${nb(`${ph(xv(src))} = ${R}`)}에서 ${nb(`${X1}${sup(t)} = ${R} ÷ ${tx(coef)} = ${ans ** t}`)}이다.`} ${ans ** t} = ${ne(ans, t)}이므로 ${nb(`${X1} = ${ans}`)}이다.`,
        facts: { calc: [[String(ans), 0]], unseen: [ans], rule: 'pow-eq' }
      });
    }),
    H('hard-recip-letter', '분수 꼴이 되는 거듭제곱을 문자로 나타내기', '기본 ①27', (d) => {
      // 나눗셈의 몫을 분수 꼴로 적는다 → 밑을 같게 고친다 → 지수의 곱의 차례를 바꾸어 문자로 적는다. A 가 분수 꼴이면 A^n, 거듭제곱이면 1/A^n 이 된다.
      // 틀린 보기: 분수 꼴인지를 놓친 아이(뒤집은 것), 지수를 나누지 않고 뺀 아이(지수 k(n − 1)), 둘 다
      const b = d.pick([2, 3, 5, 7]), e = b <= 3 ? d.pick([2, 3]) : 2, B1 = b ** e, given = d.bool();
      const [k, n] = d.until(() => [d.int(2, 5), d.int(2, 3)], ([k0, n0]) => (k0 * n0) % e === 0 && k0 !== e && k0 * n0 / e + (given ? 1 : 0) <= 12), total = k * n, m = total / e + (given ? 1 : 0);
      const w = [k * (n - 1), total, n + 1].find((v) => v !== n && v >= 2), A = V('A'), pw = (u) => A + sup(u), under = (u) => frac('1', pw(u));
      const rows = d.shuffle([{ h: pw(n), ok: given }, { h: under(n), ok: !given }, { h: pw(w), ok: false }, { h: under(w), ok: false }]);
      const text = given ? `${nb(`${A} = ${frac('1', np(b, k))}`)}일 때, ${nb(`${B1} ÷ ${np(B1, m)}`)}을 ${A}를 사용하여 나타낸 것은?` : `${nb(`${np(b, k)} = ${A}`)}일 때, ${nb(frac('1', np(B1, m)))}을 ${A}를 사용하여 나타낸 것은?`;
      const lead = given ? `${nb(`${B1} ÷ ${np(B1, m)}`)} = ${frac('1', np(B1, m - 1))}이고 ` : '';
      return C(text, rows.map((r) => r.h), rows.findIndex((r) => r.ok), {
        explain: `${lead}${B1} = ${ne(b, e)}이므로 ${frac('1', np(B1, given ? m - 1 : m))} = ${frac('1', np(b, total))} = ${frac('1', `(${np(b, k)})${sup(n)}`)}이다. ${given ? `${frac('1', np(b, k))} = ${A}이므로 ${pw(n)}이다.` : `${ne(b, k)} = ${A}이므로 ${under(n)}이다.`}`,
        facts: { truth: rows.map((r) => r.ok), want: true }
      });
    }),
    H('hard-letter-split', '지수를 쪼개어 거듭제곱을 문자로 나타내기', '심12·13 / 기본 ①28 ②22', (d, n) => {
      const b = d.pick([2, 3]), name = d.pick(['a', 'A']), W = V(name);
      if (n === 0) {
        // a = b^x 일 때 B^(x + k): 지수의 합을 곱으로 쪼갠다 → 밑을 b 로 고친다 → 지수의 곱의 차례를 바꾼다 → 남은 거듭제곱의 값을 계수로 적는다.
        const e = d.pick([2, 3]), B1 = b ** e, k = d.int(2, B1 === 27 ? 2 : 3), c = B1 ** k;
        return inline(`${nb(`${W} = ${np(b, X1)}`)}일 때, ${ne(B1, lx(1, k))}을 ${W}를 사용하여 나타내시오. (단, ${X1}는 자연수이다.)`, `{0}${W}<sup>{1}</sup>`, [{ answer: c, signed: true }, { answer: e }], {
          shown: nb(c + W + sup(e)),
          explain: `${ne(B1, lx(1, k))} = ${nb(`${np(B1, X1)} × ${np(B1, k)}`)}이다. ${ne(B1, X1)} = ${nb(`(${np(b, e)})${sup(X1)}`)} = ${nb(`(${np(b, X1)})${sup(e)}`)} = ${nb(W + sup(e))}이고 ${ne(B1, k)} = ${c}이므로 ${nb(c + W + sup(e))}이다.`,
          facts: { calc: [[`${B1}**${k}`, 0], [String(e), 1]], unseen: [e, 1] }
        });
      }
      if (n === 1) {
        // b^k = a 일 때 B^m: 밑을 b 로 고친다 → 지수를 k 로 나눈 몫과 나머지로 가른다 → 나머지만큼의 거듭제곱이 계수가 된다.
        const [k, e, m] = d.until(() => [d.int(3, 5), d.pick(b === 2 ? [2, 3, 5] : [2, 3]), d.int(2, 9)], ([k0, e0, m0]) => (e0 * m0) % k0 !== 0 && e0 * m0 > 2 * k0 && e0 * m0 <= 30), B1 = b ** e, total = e * m, r = total % k, cnt = (total - r) / k, c = b ** r;
        return inline(`${nb(`${np(b, k)} = ${W}`)}일 때, ${ne(B1, m)}을 ${W}를 사용하여 나타내시오.`, `{0}${W}<sup>{1}</sup>`, [{ answer: c, signed: true }, { answer: cnt }], {
          shown: nb(c + W + sup(cnt)),
          explain: `${B1} = ${ne(b, e)}이므로 ${ne(B1, m)} = ${ne(b, total)}이다. ${nb(`${total} = ${k} × ${cnt} + ${r}`)}이므로 ${ne(b, total)} = ${nb(`(${np(b, k)})${sup(cnt)} × ${np(b, r)}`)} = ${nb(c + W + sup(cnt))}이다.`,
          facts: { calc: [[`${b}**(${e}*${m}%${k})`, 0], [`(${e}*${m}-${e}*${m}%${k})/${k}`, 1]], unseen: [e] }
        });
      }
      if (n === 2) {
        // a = b^(x + j) 일 때 B^x: b^x 을 a 로 나타낸다(a 를 b^j 으로 나눈다) → 밑을 b 로 고쳐 지수의 곱의 차례를 바꾼다 → 분자와 분모를 각각 거듭제곱한다.
        const e = d.pick([2, 3]), B1 = b ** e, j = d.int(1, 2), low = b ** j, den = low ** e;
        return slots(`${nb(`${W} = ${np(b, lx(1, j))}`)}일 때, ${ne(B1, X1)}을 ${W}를 사용하여 나타내면 다음과 같다. ㉠, ㉡에 알맞은 수는? (단, ${X1}는 자연수이다.)`, [[LAB[0], e, String(e)], [LAB[1], den, `${b}**(${j}*${e})`]], {
          figure: ex(np(B1, X1) + OE + frac(W + sup(box(LAB[0])), box(LAB[1]))), unseen: [e],
          explain: `${nb(`${W} = ${np(b, lx(1, j))}`)} = ${nb(`${np(b, X1)} × ${low}`)}이므로 ${ne(b, X1)} = ${nb(frac(W, low))}이다. ${ne(B1, X1)} = ${nb(`(${np(b, e)})${sup(X1)}`)} = ${nb(`(${np(b, X1)})${sup(e)}`)} = ${nb(`(${frac(W, low)})${sup(e)}`)} = ${nb(frac(W + sup(e), den))}이다.`
        });
      }
      // A = b^n 일 때 b^(n − p) + b^(n + q): 지수의 차와 합을 나눗셈과 곱셈으로 쪼갠다 → 저마다 A 의 몇 배인지 구한다 → 더한다.
      const [p, q] = d.until(() => [d.int(1, 3), d.int(1, 3)], ([p0, q0]) => b ** (p0 + q0) <= 80), n0 = d.pick([20, 30, 40, 50, 100]), A = V('A'), top = 1 + b ** (p + q), bot = b ** p;
      return ansV(`${nb(`${A} = ${np(b, n0)}`)}일 때, ${nb(`${np(b, n0 - p)} + ${np(b, n0 + q)}`)}은 ${A}의 몇 배인가?`, Q(top, bot), 'frac', {
        unit: '배',
        explain: `${ne(b, n0 - p)} = ${nb(`${np(b, n0)} ÷ ${np(b, p)}`)} = ${nb(frac('1', bot) + A)}, ${ne(b, n0 + q)} = ${nb(`${np(b, n0)} × ${np(b, q)}`)} = ${nb(b ** q + A)}이다. 합은 ${nb(`(${frac('1', bot)} + ${b ** q})${A}`)} = ${nb(frac(top, bot) + A)}이므로 ${A}의 ${frac(top, bot)}배이다.`,
        facts: { value: `1/${b}**(${n0}-${n0 - p})+${b}**(${n0 + q}-${n0})`, unseen: [1] }
      });
    }, { count: 4 }),
    H('hard-last-digit', '거듭제곱의 일의 자리의 숫자', '심23 / 기본 ①30', (d, n) => {
      if (n === 0) {
        // 지수법칙으로 거듭제곱 하나로 고친다 → 일의 자리의 숫자가 되풀이되는 차례를 찾는다 → 지수를 4로 나눈 나머지로 숫자를 정한다.
        const b = d.pick([2, 3, 7, 8]), div = d.bool(), [p, q] = div ? d.until(() => [d.int(40, 120), d.int(10, 60)], ([p0, q0]) => p0 - q0 >= 20) : [d.int(5, 25), d.int(3, 12)], e = div ? p - q : p * q, r = e % 4, digit = CYCLE[b][(e + 3) % 4];
        const shown = div ? `${np(b, p)} ÷ ${np(b, q)}` : `(${np(b, p)})${sup(q)}`;
        return N(`${nb(shown)}의 일의 자리의 숫자는?`, digit, {
          explain: `${nb(shown)} = ${ne(b, e)}이다. ${b}의 거듭제곱의 일의 자리의 숫자는 ${CYCLE[b].join(', ')}의 차례로 되풀이된다. ${e}${tail(e, '을/를')} 4로 나눈 나머지가 ${r}이므로 ${ne(b, e)}의 일의 자리의 숫자는 ${NTH[(r + 3) % 4]} 수인 ${digit}이다.`,
          facts: { calc: [[div ? `${b}**((${p}-${q})%4+4)%10` : `${b}**(${p}*${q}%4+4)%10`, 0]], unseen: [4, 10], rule: 'last-digit' }
        });
      }
      // 3^a × 4^b × 5^c × 9^e: 밑을 소수로 고친다 → 2와 5를 짝지어 10의 거듭제곱을 뗀다 → 남은 수의 일의 자리의 숫자를 3의 거듭제곱의 되풀이로 구한다.
      const [a3, b4, c5, e9, k2] = d.until(() => { const c0 = d.int(5, 15), k0 = d.int(1, 4); return [d.int(5, 20), (c0 + k0) / 2, c0, d.int(5, 30), k0]; }, (t) => Number.isInteger(t[1])), e3 = a3 + 2 * e9, r = e3 % 4, d3 = CYCLE[3][(e3 + 3) % 4], left = 2 ** k2, digit = (left * d3) % 10;
      const shown = `${np(3, a3)} × ${np(4, b4)} × ${np(5, c5)} × ${np(9, e9)}`;
      return slots(`${nb(shown)}의 값에서 처음으로 0이 아닌 숫자는 일의 자리부터 세어 ${nb('㉠번째')} 자리에 있고, 그 숫자는 ${nb('㉡이다.')} ㉠, ㉡에 알맞은 수는?`, [[LAB[0], c5 + 1, `${c5}+1`], [LAB[1], digit, `2**(2*${b4}-${c5})*3**((${a3}+2*${e9})%4+4)%10`]], {
        unseen: [1, 2, 10],
        explain: `${ne(4, b4)} = ${ne(2, 2 * b4)}, ${ne(9, e9)} = ${ne(3, 2 * e9)}이므로 주어진 수는 ${nb(`${np(2, 2 * b4)} × ${np(3, e3)} × ${np(5, c5)}`)} = ${nb(`${np(2, k2)} × ${np(3, e3)} × ${np(10, c5)}`)}이다. 끝에 0이 ${c5}개 있으므로 처음으로 0이 아닌 숫자는 ${c5 + 1}번째 자리에 있다. 3의 거듭제곱의 일의 자리의 숫자는 3, 9, 7, 1의 차례로 되풀이되고 ${e3}${tail(e3, '을/를')} 4로 나눈 나머지가 ${r}이므로 ${ne(3, e3)}의 일의 자리의 숫자는 ${d3}이다. ${k2 > 1 ? `${ne(2, k2)} = ${left}이고 ` : ''}${nb(`${left} × ${d3} = ${left * d3}`)}의 일의 자리의 숫자가 구하는 숫자이므로 ㉡ = ${digit}이다.`
      });
    }, { count: 2 }),
    H('hard-compare', '지수를 같게 고쳐 거듭제곱의 크기 비교하기', '기본 ②25', (d) => {
      // 지수의 공약수로 지수를 같게 고친다(거듭제곱의 거듭제곱을 거꾸로 쓴다) → 밑을 계산한다 → 밑의 크기로 견준다.
      // 틀린 보기: 적힌 밑이 큰 수가 크다고 여기는 아이(밑의 차례), 지수가 큰 수가 크다고 여기는 아이(지수의 차례), 그 밖의 차례 하나.
      // 수의 벌은 바른 차례가 밑의 차례와도 지수의 차례와도 다른 것만 골랐다(어림으로 고른 답이 맞지 않게).
      const set = d.shuffle(d.pick([[[2, 3], [3, 2], [5, 1]], [[2, 3], [3, 2], [7, 1]], [[2, 5], [3, 3], [6, 2]], [[2, 4], [3, 3], [5, 2]], [[2, 7], [3, 4], [5, 3]], [[2, 6], [3, 4], [7, 2]]]));
      const g = d.pick(Math.max(...set.map((s) => s[1])) >= 5 ? [5, 10] : [10, 11, 12, 20]), names = ['A', 'B', 'C'], low = set.map(([base, m]) => base ** m);
      const by = (f) => [0, 1, 2].sort((i, j) => f(i) - f(j)), right = by((i) => low[i]), byBase = by((i) => set[i][0]), byExp = by((i) => set[i][1]), all = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
      const taken = [right, byBase, byExp].map((o) => o.join());
      if (new Set(taken).size !== 3) throw new Error('바른 차례가 어림한 차례와 겹친다');
      const orders = d.shuffle([right, byBase, byExp, d.pick(all.filter((o) => !taken.includes(o.join())))]);
      return C(`세 수 ${set.map(([base, m], i) => nb(`${V(names[i])} = ${np(base, m * g)}`)).join(', ')}의 대소 관계로 옳은 것은?`, orders.map((o) => nb(o.map((i) => V(names[i])).join(' &lt; '))), orders.findIndex((o) => o.join() === right.join()), {
        explain: `지수를 ${g}${tail(g, '으로/로')} 같게 고치면 ${set.map(([base, m], i) => nb(`${V(names[i])} = ${m > 1 ? `(${np(base, m)})${sup(g)} = ` : ''}${np(low[i], g)}`)).join(', ')}이다. 지수가 같으면 밑이 큰 수가 크므로 ${nb(right.map((i) => V(names[i])).join(' &lt; '))}이다.`,
        facts: { choose: { exprs: set.map(([base, m]) => `${base}**${m * g}`), rule: 'ascending', orders } }
      });
    }),
    H('hard-fold-sum', '거듭제곱의 합을 차례로 접어 거듭제곱 하나로 나타내기', '심2', (d) => {
      // 2^k + 2^k + 2^(k+1) + … + 2^n: 앞의 두 항이 2 × 2^k = 2^(k+1) 이 되어 다음 항과 같아진다 → 같은 일을 끝까지 되풀이한다(같은 거듭제곱의 덧셈은 지수를 더하지 않는다).
      const k = d.int(1, 3), len = d.int(3, 4), last = k + len, src = [k].concat(range(k, last)).map((e) => (e > 1 ? `2^${e}` : '2')).join('+');
      return boxN('다음 식의 좌변을 간단히 하여 2의 거듭제곱 하나로 나타낼 때, □ 안에 알맞은 수는?', last + 1, eqx(src, '2^?'), `${last}+1`,
        `${nb(`${np(2, k)} + ${np(2, k)}`)} = ${nb(`2 × ${np(2, k)}`)} = ${ne(2, k + 1)}이다. 이것을 다음 항과 더하면 ${nb(`${np(2, k + 1)} + ${np(2, k + 1)}`)} = ${ne(2, k + 2)}이다. 이와 같이 앞에서부터 차례로 더해 가면 마지막에 ${nb(`${np(2, last)} + ${np(2, last)}`)} = ${ne(2, last + 1)}이 된다.`, { unseen: [1] });
    }),
    H('hard-factor-cancel', '밑이 다른 수의 거듭제곱을 같은 밑으로 고쳐 간단히 하기', '심10', (d, n) => {
      if (n === 0) {
        // N1^p ÷ N2^q: 두 수를 소인수분해 한다 → 저마다 거듭제곱한다 → 한 소인수는 약분되어 사라지고 다른 소인수는 지수끼리 뺀다.
        // 줄: [N1, N2, 사라지는 소인수 u, 남는 소인수 v, N1 의 u·v 의 지수, N2 의 u·v 의 지수, 지수 p : q]
        const [N1, N2, u, v, i, j, s, t, kp, kq] = d.pick([[15, 45, 3, 5, 1, 1, 2, 1, 2, 1], [12, 18, 3, 2, 1, 2, 2, 1, 2, 1], [20, 50, 5, 2, 1, 2, 2, 1, 2, 1], [45, 75, 5, 3, 1, 2, 2, 1, 2, 1], [72, 216, 3, 2, 2, 3, 3, 3, 3, 2], [24, 54, 3, 2, 1, 3, 3, 1, 3, 1], [18, 12, 2, 3, 1, 2, 2, 1, 2, 1], [50, 20, 2, 5, 1, 2, 2, 1, 2, 1]]);
        const m = d.int(2, kp === 3 ? 3 : 5), p = kp * m, q = kq * m, a = p * j - q * t, fac = (x, y) => (u < v ? `${np(u, x)} × ${np(v, y)}` : `${np(v, y)} × ${np(u, x)}`);
        return boxN(BOX_ASK, a, eqx(`[${N1}^${p}|${N2}^${q}]`, `${v}^?`), `${p}*${j}-${q}*${t}`,
          `${N1} = ${nb(fac(i, j))}, ${N2} = ${nb(fac(s, t))}이므로 분자는 ${nb(fac(i * p, j * p))}, 분모는 ${nb(fac(s * q, t * q))}이다. ${ne(u, i * p)}은 약분되어 사라지고 ${v}의 지수는 ${j * p} − ${t * q} = ${a}이다.`, { unseen: [j, t], rule: 'factor-cancel' });
      }
      // 0.25^p × 4^q: 소수를 분수로 고친다 → 분수의 거듭제곱은 분모만 거듭제곱이 된다 → 지수의 차만큼 남는다.
      const [dec, B1, top] = d.pick([['0.25', 4, 4], ['0.5', 2, 9], ['0.2', 5, 4], ['0.125', 8, 3]]), p = d.int(20, 80), diff = d.int(2, top), q = p + diff, value = B1 ** diff;
      return N(`${nb(`${np(dec, p)} × ${np(B1, q)}`)}의 값은?`, value, {
        signed: true,
        explain: `${dec} = ${frac('1', B1)}이므로 ${ne(dec, p)} = ${nb(frac('1', np(B1, p)))}이다. ${nb(`${np(dec, p)} × ${np(B1, q)}`)} = ${nb(`${np(B1, q)} ÷ ${np(B1, p)}`)} = ${ne(B1, `${q} − ${p}`)} = ${ne(B1, diff)} = ${value}이다.`,
        facts: { calc: [[`${B1}**(${q}-${p})`, 0]], rule: 'decimal-power' }
      });
    }, { count: 2 }),
    H('hard-bundle-cancel', '거듭제곱의 합끼리의 나눗셈을 묶어서 간단히 하기', '심11', (d) => {
      // (B1^p + B2^q) ÷ (B1^r + B2^t): 밑을 b 로 고친다 → 분자의 두 항이 분모의 두 항에 같은 거듭제곱을 곱한 것임을 알아본다 → 분배법칙으로 묶어 약분한다.
      const b = d.pick([2, 3]), [e1, e2] = d.pick([[3, 2], [2, 1], [3, 1], [2, 3]]), L = lcm(e1, e2), s = L * d.int(1, L === 6 ? 1 : 2);
      const [r, t] = d.until(() => [d.int(2, 5), d.int(2, 6)], ([r0, t0]) => e1 * r0 !== e2 * t0 && e1 * r0 + s <= 24 && e2 * t0 + s <= 24), p = r + s / e1, q = t + s / e2, B1 = b ** e1, B2 = b ** e2, two = (x, y) => `${np(b, x)} + ${np(b, y)}`;
      return boxN(BOX_ASK, s, eqx(`[${B1}^${p}+${B2}^${q}|${B1}^${r}+${B2}^${t}]`, `${b}^?`), `${e1}*(${p}-${r})`,
        `${[B1, B2].filter((v) => v !== b).map((v) => `${v} = ${ne(b, v === B1 ? e1 : e2)}`).join(', ')}이므로 분자는 ${nb(two(e1 * p, e2 * q))}, 분모는 ${nb(two(e1 * r, e2 * t))}이다. 분자의 두 항은 분모의 두 항에 각각 ${ne(b, s)}을 곱한 것이므로 분자는 ${nb(`${np(b, s)} × (${two(e1 * r, e2 * t)})`)}이다. 분모와 약분하면 ${ne(b, s)}이다.`, { unseen: [e1], rule: 'bundle-cancel' });
    }),
    H('hard-expo-letter-div', '지수가 문자의 식인 거듭제곱의 나눗셈', '심15·16', (d, n) => {
      const b = d.pick(n === 0 ? [2, 3, 5] : [2, 3]);
      if (n === 0) {
        // (b^(c1 x + d1) / b^(c2 x)) ÷ (b^(c3 x + d3) / b^d4): 분수마다 지수끼리 뺀다(문자의 식의 뺄셈) → 두 몫의 지수를 다시 뺀다. 문자는 사라지고 수만 남는다.
        // 틀린 보기: 분수 꼴로 보낼지를 거꾸로 정하는 아이, 뒤의 분수의 분모의 지수 d4 까지 빼는 아이, 뒤의 분수를 뒤집지 않고 곱하는 아이
        const [c2, c3, d1, d3, d4] = d.until(() => [d.int(1, 2), d.int(1, 2), d.int(1, 4), d.int(3, 7), d.int(1, 4)], (t) => t[3] - t[4] >= 1 && t[2] !== t[3] && t[2] - t[3] + t[4] !== 0 && Math.abs(t[2] - t[3] + t[4]) <= 3), c1 = c2 + c3, D = d3 - d4, E = d1 - D, E2 = d1 - d3 - d4;
        const pw = (e) => (e === 0 ? '1' : e > 0 ? np(b, e) : frac('1', np(b, -e))), f1 = frac(np(b, lx(c1, d1)), np(b, lx(c2, 0))), f2 = frac(np(b, lx(c3, d3)), np(b, d4)), mid = `${np(b, lx(c3, d1))} ÷ ${np(b, lx(c3, D))}`;
        const rows = d.shuffle([{ h: pw(E), ok: true }, { h: pw(-E), ok: false }, { h: pw(E2), ok: false }, { h: np(b, lx(2 * c3, d1 + D)), ok: false }]);
        return C(`다음을 계산한 것은? (단, ${X1}는 자연수이다.)`, rows.map((r) => nb(r.h)), rows.findIndex((r) => r.ok), {
          figure: ex(f1 + OD + f2),
          explain: `${nb(f1)} = ${ne(b, `(${lx(c1, d1)}) − ${lx(c2, 0)}`)} = ${ne(b, lx(c3, d1))}, ${nb(f2)} = ${ne(b, `(${lx(c3, d3)}) − ${d4}`)} = ${ne(b, lx(c3, D))}이다. ${E > 0 ? `${nb(mid)} = ${ne(b, `${d1} − ${D}`)} = ${nb(pw(E))}이다.` : `나누는 수의 지수가 ${-E}만큼 더 크므로 ${nb(mid)} = ${nb(pw(E))}이다.`}`,
          facts: { truth: rows.map((r) => r.ok), want: true }
        });
      }
      // P(b^a) = a 로 약속한다. b^(c(m + j)) ÷ B^(c2 m + dd): 밑을 b 로 고친다 → 지수끼리 뺀다(문자가 사라진다) → 약속대로 지수를 읽는다.
      const e = d.pick([2, 3]), B1 = b ** e, [c2, j, dd] = d.until(() => [d.int(1, 3), d.int(1, 4), d.int(1, 5)], ([c0, j0, d0]) => e * c0 * j0 - e * d0 >= 2 && e * c0 * j0 - e * d0 <= 12), c = e * c2, M1 = V('m'), val = c * j - e * dd;
      return N(`자연수 ${V('a')}에 대하여 ${nb(`${V('X')} = ${np(b, V('a'))}`)}일 때 ${nb(`P(${V('X')}) = ${V('a')}`)}로 약속한다. 다음 식의 값은? (단, ${M1}은 자연수이다.)`, val, {
        signed: true, figure: ex(`P(${np(b, `${c}(${lx(1, j, M1)})`)}${OD}${np(B1, lx(c2, dd, M1))})`),
        explain: `${B1} = ${ne(b, e)}이므로 ${ne(B1, lx(c2, dd, M1))} = ${ne(b, `${e}(${lx(c2, dd, M1)})`)} = ${ne(b, lx(c, e * dd, M1))}이다. ${ne(b, `${c}(${lx(1, j, M1)})`)} = ${ne(b, lx(c, c * j, M1))}이므로 ${nb(`${np(b, lx(c, c * j, M1))} ÷ ${np(b, lx(c, e * dd, M1))}`)} = ${ne(b, `${c * j} − ${e * dd}`)} = ${ne(b, val)}이다. 약속에 따라 ${nb(`P(${np(b, val)}) = ${val}`)}이다.`,
        facts: { calc: [[`${c}*${j}-${e}*${dd}`, 0]], unseen: [e], rule: 'new-symbol' }
      });
    }, { count: 2 }),
    H('hard-expo-eq', '밑을 같게 고쳐 지수의 등식에서 문자의 값 구하기', '심17·18 / 기본 ②20', (d, n) => {
      if (n === 0) {
        // B1^(x + p1) × B2^(x + p2) = B3^(x + p3): 밑을 b 로 고친다 → 양변의 지수를 일차식으로 정리한다 → 일차방정식을 푼다.
        const b = d.pick([2, 3]), es = b === 2 ? [1, 2, 3, 4, 5] : [1, 2, 3, 4];
        const [e1, e2, e3, p1, p2, p3, x] = d.until(() => { const [u, v, w] = d.shuffle(es).slice(0, 3), [q1, q2, q3] = [d.int(1, 5), d.int(1, 5), d.int(1, 6)]; return [u, v, w, q1, q2, q3, (w * q3 - u * q1 - v * q2) / (u + v - w)]; }, (t) => t[0] + t[1] !== t[2] && Number.isInteger(t[6]) && t[6] >= 1 && t[6] <= 6);
        const [B1, B2, B3] = [e1, e2, e3].map((e) => b ** e), KL = e1 * p1 + e2 * p2, KR = e3 * p3;
        return N(`다음 식을 만족시키는 자연수 ${X1}의 값은?`, x, {
          figure: ex(np(B1, lx(1, p1)) + OX + np(B2, lx(1, p2)) + OE + np(B3, lx(1, p3))),
          explain: `${[[B1, e1], [B2, e2], [B3, e3]].filter(([, e]) => e > 1).map(([v, e]) => `${v} = ${ne(b, e)}`).join(', ')}이므로 좌변은 ${nb(`${np(b, e1 > 1 ? `${e1}(${lx(1, p1)})` : lx(1, p1))} × ${np(b, e2 > 1 ? `${e2}(${lx(1, p2)})` : lx(1, p2))}`)} = ${ne(b, lx(e1 + e2, KL))}, 우변은 ${ne(b, lx(e3, KR))}이다. ${nb(`${lx(e1 + e2, KL)} = ${lx(e3, KR)}`)}에서 ${nb(`${X1} = ${x}`)}이다.`,
          facts: { calc: [[`(${e3}*${p3}-${e1}*${p1}-${e2}*${p2})/(${e1}+${e2}-${e3})`, 0]], unseen: [e1, e2, e3], rule: 'expo-eq' }
        });
      }
      // B1^x × (소수)^(p − c x) = 1: 소수를 분수로 고치고 밑을 2로 고친다 → 값이 1이므로 분자와 분모의 지수가 같다 → 일차방정식을 푼다.
      const [e1, e2, dec, c, p, x] = d.until(() => { const u = d.int(1, 5), [w, s] = d.pick([[1, '0.5'], [2, '0.25'], [3, '0.125']]), c0 = d.int(1, 2), p0 = d.int(3, 12); return [u, w, s, c0, p0, w * p0 / (u + w * c0)]; }, (t) => Number.isInteger(t[5]) && t[5] >= 1 && t[5] <= 5 && t[4] - t[3] * t[5] >= 1);
      const B1 = 2 ** e1, rest = `${p} − ${c === 1 ? '' : c}${X1}`;
      return N(`다음 식을 만족시키는 자연수 ${X1}의 값은?`, x, {
        figure: ex(np(B1, X1) + OX + np(dec, rest) + OE + '1'),
        explain: `${e1 > 1 ? `${B1} = ${ne(2, e1)}, ` : ''}${dec} = ${nb(frac('1', np(2, e2)))}이므로 좌변은 ${nb(`${np(2, lx(e1, 0))} ÷ ${np(2, e2 > 1 ? `${e2}(${rest})` : rest)}`)}이다. 값이 1이므로 두 지수가 같다. ${nb(`${lx(e1, 0)} = ${e2 > 1 ? `${e2}(${rest})` : rest}`)}에서 ${nb(`${lx(e1 + e2 * c, 0)} = ${e2 * p}`)}이므로 ${nb(`${X1} = ${x}`)}이다.`,
        facts: { calc: [[`${e2}*${p}/(${e1}+${e2}*${c})`, 0]], unseen: [e1, e2, c], rule: 'expo-eq-one' }
      });
    }, { count: 2 }),
    H('hard-pow-bundle', '거듭제곱의 곱을 한 수의 거듭제곱으로 묶어 소인수의 지수 구하기', '심24', (d) => {
      // 2^E0 × 3^E1 × 5^E2 = a^m, a = N^b, ab = 2^x × 3^y × 5^z: 지수를 m 으로 나누어 a 를 소인수의 곱으로 적는다 → N 을 소인수분해 하여 b 를 구한다 → a 에 b 를 곱한다.
      const [N0, ijk] = d.pick([[30, [1, 1, 1]], [60, [2, 1, 1]], [90, [1, 2, 1]], [150, [1, 1, 2]], [180, [2, 2, 1]], [300, [2, 1, 2]], [450, [1, 2, 2]]]);
      const [bb, m] = d.until(() => [d.pick([2, 3, 4, 5]), d.pick([2, 3, 4, 6])], ([x, y]) => x * y <= 12), extra = { 2: [1, 0, 0], 3: [0, 1, 0], 4: [2, 0, 0], 5: [0, 0, 1] }[bb];
      const inA = ijk.map((e) => e * bb), E = inA.map((e) => e * m), ans = inA.map((e, i) => e + extra[i]), prod = (es, op) => es.map((e, i) => np([2, 3, 5][i], e)).join(op || ' × '), A = V('a'), Bv = V('b');
      return slots(`자연수 ${A}, ${Bv}가 두 등식 ㈎, ㈏를 만족시킨다. ${nb(`${A}${Bv} = ${np(2, X1)} × ${np(3, Y1)} × ${np(5, Z1)}`)}일 때, 자연수 ${X1}, ${Y1}, ${Z1}의 값은?`,
        [[eqLabel('x'), ans[0], `${E[0]}/${m}+${extra[0]}`], [eqLabel('y'), ans[1], `${E[1]}/${m}+${extra[1]}`], [eqLabel('z'), ans[2], `${E[2]}/${m}+${extra[2]}`]], {
          figure: taggedEx([prod(E, OX) + OE + A + sup(m), A + OE + np(N0, Bv)], ['㈎', '㈏']), unseen: [0, 1, 2],
          explain: `㈎의 좌변은 ${nb(`(${prod(inA)})${sup(m)}`)}이므로 ${nb(`${A} = ${prod(inA)}`)}이다. ${nb(`${N0} = ${prod(ijk)}`)}이므로 ㈏에서 ${nb(`${A} = (${prod(ijk)})${sup(Bv)}`)}이고, 지수를 견주면 ${nb(`${Bv} = ${bb}`)}이다. ${bb === 4 ? `4 = ${ne(2, 2)}이므로 ` : ''}${nb(`${A}${Bv} = ${prod(inA)} × ${bb}`)} = ${nb(prod(ans))}이다.`
        });
    }),
    H('hard-three-products', '둘씩 곱한 값으로 문자의 제곱의 값 구하기', '심26', (d) => {
      // xy, xz, yz 의 값이 주어진다 → 단항식의 곱셈과 나눗셈으로 xy × xz ÷ yz = x² 을 만든다 → 같은 일을 세 번 한다.
      // 원문은 x² 이 3, 12, 27 이 되어 x, y, z 가 중3에서 배우는 수(무리수)가 된다. 세 제곱이 모두 제곱수가 되게 수를 골라 x, y, z 가 유리수인 경우만 낸다.
      const [p, q, r] = d.shuffle([2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3), [P, Qv, R] = [p * q, p * r, q * r], sq = (h) => nb(h + sup(2)), lab = (h) => sq(h) + ' =';
      return slots(`세 수 ${X1}, ${Y1}, ${Z1}에 대하여 ${nb(`${X1}${Y1} = ${P}`)}, ${nb(`${X1}${Z1} = ${Qv}`)}, ${nb(`${Y1}${Z1} = ${R}`)}일 때, ${sq(X1)}, ${sq(Y1)}, ${sq(Z1)}의 값은?`,
        [[lab(X1), p * p, `${P}*${Qv}/${R}`, true], [lab(Y1), q * q, `${P}*${R}/${Qv}`, true], [lab(Z1), r * r, `${Qv}*${R}/${P}`, true]], {
          explain: `${nb(`${X1}${Y1} × ${X1}${Z1} ÷ ${Y1}${Z1}`)} = ${sq(X1)}이므로 ${sq(X1)} = ${nb(`${P} × ${Qv} ÷ ${R}`)} = ${p * p}이다. 같은 방법으로 ${sq(Y1)} = ${nb(`${X1}${Y1} × ${Y1}${Z1} ÷ ${X1}${Z1}`)} = ${nb(`${P} × ${R} ÷ ${Qv}`)} = ${q * q}, ${sq(Z1)} = ${nb(`${X1}${Z1} × ${Y1}${Z1} ÷ ${X1}${Y1}`)} = ${nb(`${Qv} × ${R} ÷ ${P}`)} = ${r * r}이다.`
        });
    }),
    H('hard-find-outer', '계수에서 괄호 밖의 지수를 먼저 구하는 단항식의 계산', '심30 / 기본 ①40 ②40', (d) => {
      // (x^p y)^q × (−k x y^r)^a ÷ m x^s y^t = C x^b y^c: 계수 (−k)^a ÷ m = C 에서 a 를 구한다(부호로 홀짝, 크기로 값) → a 를 넣어 x 의 지수 → y 의 지수.
      const k = d.pick([2, 3]), a = d.pick(k === 2 ? [2, 3, 4, 5] : [2, 3]), up = d.bool() && k ** (a + 1) <= 64, m = up ? k ** (a + 1) : k ** (a - 1), sign = a % 2 ? -1 : 1, Cq = up ? Q(sign, k) : Q(sign * k);
      const [p, q, r, s, t] = d.until(() => [d.int(1, 3), d.int(2, 3), d.int(1, 3), d.int(1, 5), d.int(1, 5)], (v) => v[0] * v[1] + a - v[3] >= 1 && v[1] + v[2] * a - v[4] >= 1 && v[0] * v[1] + a - v[3] !== v[1] + v[2] * a - v[4]), bq = p * q + a - s, cq = q + r * a - t;
      const lhs = `(${vs([['x', p], ['y', 1]])})^${q}*(-${k}${vs([['x', 1], ['y', r]])})^a:${m}${vs([['x', s], ['y', t]])}`, Cs = (Cq.p < 0 ? '-' : '') + magS(Cq), An = V('a'), powA = nb(`(−${k})${sup(An)}`);
      return slots(`다음 식을 만족시키는 자연수 ${An}, ${V('b')}, ${V('c')}의 값은?`, [[eqLabel('a'), a, String(a)], [eqLabel('b'), bq, `${p}*${q}+${a}-${s}`], [eqLabel('c'), cq, `${q}+${r}*${a}-${t}`]], {
        figure: eqx(lhs, `${Cs}x^by^c`), unseen: [a, 1],
        explain: `좌변의 계수는 ${powA} ÷ ${m}이고 우변의 계수는 ${tx(Cq)}이므로 ${powA} = ${nb(`${Cq.p < 0 ? `(${tx(Cq)})` : tx(Cq)} × ${m}`)} = ${tx(Q(sign * k ** a))}이다. 따라서 ${nb(`${An} = ${a}`)}이다. ${X1}의 지수는 ${nb(`${p} × ${q} + ${a} − ${s} = ${bq}`)}, ${Y1}의 지수는 ${nb(`${q} + ${r} × ${a} − ${t} = ${cq}`)}이다.`
      });
    }),
    H('hard-digits-more', '2와 5의 거듭제곱에 다른 수가 곱해진 수의 자릿수', '심22 / 기본 ①29 ②24', (d, n) => {
      const leftOf = (two, five, rest) => { const t = Math.min(two, five); return 2 ** (two - t) * 5 ** (five - t) * rest; };
      if (n === 0) {
        // 다른 수가 곱해져 있다: 수를 소인수의 곱으로 고쳐 2와 5의 지수를 모은다 → 2와 5를 짝지어 10의 거듭제곱을 뗀다 → 남은 수를 계산한다 → 자릿수를 센다.
        const [src, two, five, rest, note] = d.until(() => {
          const p = d.int(5, 14), q = d.int(5, 14), form = d.int(0, 2);
          if (form === 0) { const r = d.pick([3, 7, 11, 13]); return [`2^${p}*5^${q}*${r}`, p, q, r, '']; }
          if (form === 1) return [`2^${p}*3^2*5^${q}`, p, q, 9, `${ne(3, 2)} = 9이므로 `];
          const [N0, a2, a5, r] = d.pick([[12, 2, 0, 3], [18, 1, 0, 9], [36, 2, 0, 9], [45, 0, 1, 9], [75, 0, 2, 3], [14, 1, 0, 7], [35, 0, 1, 7], [28, 2, 0, 7]]);
          return [`${N0}*2^${p}*5^${q}`, p + a2, q + a5, r, `${N0} = ${nb([a2 ? np(2, a2) : '', a5 ? np(5, a5) : '', r === 9 ? np(3, 2) : String(r)].filter(Boolean).join(' × '))}이므로 `];
        }, ([, x, y, r]) => x !== y && leftOf(x, y, r) >= 10 && leftOf(x, y, r) <= 999);
        const t = Math.min(two, five), L = leftOf(two, five, rest), digits = String(L).length;
        return N(`${xj(src, '은/는')} 몇 자리 자연수인가?`, t + digits, {
          unit: '자리',
          explain: `${note}${xh(src)} = ${nb(`${np(two > five ? 2 : 5, Math.abs(two - five))} × ${rest} × (2 × 5)${sup(t)}`)} = ${nb(`${L} × ${np(10, t)}`)}이다. ${L} 뒤에 0이 ${t}개 붙으므로 ${digits} + ${t} = ${t + digits}(자리)이다.`,
          facts: { calc: [[`${digits}+${t}`, 0]], unseen: [digits, t], rule: 'digits-more' }
        });
      }
      if (n === 1) {
        // 분수 꼴: 분자와 분모의 수를 소인수의 곱으로 고쳐 약분한다 → 2와 5를 짝지어 10의 거듭제곱을 뗀다 → 남은 수의 자릿수를 더한다.
        const r = d.pick([3, 7]), [p, q, s] = d.until(() => { const s0 = d.int(5, 10); return [s0 + d.int(3, 10), s0 + d.int(0, 1), s0]; }, ([p0, q0, s0]) => p0 - s0 !== q0 && leftOf(p0 - s0, q0, r ** (q0 - s0)) >= 2 && leftOf(p0 - s0, q0, r ** (q0 - s0)) <= 999);
        const two = p - s, t = Math.min(two, q), L = leftOf(two, q, r ** (q - s)), digits = String(L).length, src = `[2^${p}*${5 * r}^${q}|${2 * r}^${s}]`;
        return N('다음 수는 몇 자리 자연수인가?', t + digits, {
          figure: xex(src), unit: '자리',
          explain: `${5 * r} = ${nb(`5 × ${r}`)}, ${2 * r} = ${nb(`2 × ${r}`)}이므로 주어진 수는 ${xh(`[2^${p}*5^${q}*${r}^${q}|2^${s}*${r}^${s}]`)} = ${nb(`${np(2, two)} × ${np(5, q)}${q > s ? ` × ${r}` : ''}`)} = ${nb(`${L} × ${np(10, t)}`)}이다. ${L} 뒤에 0이 ${t}개 붙으므로 ${digits} + ${t} = ${t + digits}(자리)이다.`,
          facts: { calc: [[`${digits}+${t}`, 0]], unseen: [digits, t], rule: 'digits-frac' }
        });
      }
      // 자릿수를 주고 지수를 묻는다: 10의 거듭제곱을 뗀다 → 남은 수가 두 자리 수가 되는 경우를 모두 따진다.
      const r = d.pick([3, 7, 9]), q = d.int(6, 12), want = q + 2, lenOf = (x) => Math.min(x, q) + String(leftOf(x, q, r)).length;
      const hits = range(1, q + 8).filter((x) => lenOf(x) === want), lo = hits[0], hi = hits[hits.length - 1];
      if (hits.length < 2 || hi - lo + 1 !== hits.length || lo <= q || range(1, q).some((x) => lenOf(x) > q + 1)) throw new Error('지수가 이어진 범위로 정해지지 않는다');
      const gap = `${X1} − ${q}`, tries = range(1, hi - q + 1).map((k) => nb(`${np(2, k)} × ${r} = ${2 ** k * r}`)).join(', ');
      return M(`${nb(`${np(2, X1)} × ${np(5, q)} × ${r}`)}${tail(r, '이/가')} ${want}자리 자연수가 되도록 하는 자연수 ${X1}의 값 중에서 가장 작은 수와 가장 큰 수는?`, [{ label: '가장 작은 수', answer: lo }, { label: '가장 큰 수', answer: hi }], {
        explain: `${X1}가 ${q} 이하이면 주어진 수는 ${q + 1}자리 이하이다. ${X1}가 ${q}보다 크면 주어진 수는 ${nb(`${np(2, gap)} × ${r} × ${np(10, q)}`)}이므로 ${nb(`${np(2, gap)} × ${r}`)}${tail(r, '이/가')} 두 자리 수이어야 한다. ${tries}이므로 ${nb(gap)}의 값은 ${range(lo - q, hi - q).join(', ')}이다. 따라서 ${X1}의 값은 ${hits.join(', ')}이고 가장 작은 수는 ${lo}, 가장 큰 수는 ${hi}이다.`,
        facts: { calc: [[String(lo), 0], [String(hi), 1]], unseen: [lo, hi], rule: 'digits-range' }
      });
    }, { count: 3 }),

    // ── 단항식·다항식의 계산과 도형 ──
    H('hard-rotate', '직각삼각형을 두 변을 축으로 회전시킨 두 입체도형의 부피 견주기', '심42 / 기본 ②46', (d) => {
      // ① 축이 바뀌면 밑면의 반지름과 높이가 서로 바뀐다: 변 AB 가 축이면 반지름이 BC, 높이가 AB 인 원뿔이다. ② 두 원뿔의 부피를 구한다 → 나눈다.
      // 틀린 보기: 축으로 삼은 변을 반지름으로 여기는 아이(뒤집은 것), 높이는 같다고 보고 반지름의 제곱만 견주는 아이(제곱한 것), 반지름을 제곱하지 않는 아이(1)
      const [a, b] = pair(d);
      const [M1, M2] = d.until(() => [ms(d.int(1, 4), [[a, d.int(1, 3)], [b, d.int(0, 3)]]), ms(d.int(1, 4), [[a, d.int(0, 3)], [b, d.int(1, 3)]])], ([m1, m2]) => { const t = xv(`${m2}:${m1}`)[0]; return m1.length <= 6 && m2.length <= 6 && letters(t).length >= 1 && t.q.q <= 4 && t.q.p <= 4; });
      const R = xv(`${M2}:${M1}`), P = xv(`[1|3]*π*${sq2(M2)}*${M1}`), Qp = xv(`[1|3]*π*${sq2(M1)}*${M2}`), Pn = V('P'), Qn = V('Q');
      return pickQ(d, `다음 그림과 같이 ∠B = 90°인 직각삼각형 ABC에서 ${nb(SG('AB') + ' = ' + htmlX(M1))}, ${nb(SG('BC') + ' = ' + htmlX(M2))}이다. 이 삼각형을 변 AB를 축으로 하여 1회전 시킬 때 생기는 입체도형의 부피를 ${Pn}, 변 BC를 축으로 하여 1회전 시킬 때 생기는 입체도형의 부피를 ${Qn}라 할 때, ${nb(`${Pn} ÷ ${Qn}`)}를 계산한 것은?`, R, [inv(R), pMul(R, R), inv(pMul(R, R)), mk(1, {})], {
        figure: rightTriFig(M1, M2),
        explain: `변 AB를 축으로 하면 밑면의 반지름의 길이가 ${xh(M2)}, 높이가 ${xh(M1)}인 원뿔이 생기므로 ${Pn} = ${nb(`${frac(1, 3)} × π × ${htmlX(sq2(M2))} × ${htmlX(M1)}`)} = ${pt(P)}이다. 변 BC를 축으로 하면 밑면의 반지름의 길이가 ${xh(M1)}, 높이가 ${xh(M2)}인 원뿔이 생기므로 ${Qn} = ${nb(`${frac(1, 3)} × π × ${htmlX(sq2(M1))} × ${htmlX(M2)}`)} = ${pt(Qp)}이다. ${nb(`${Pn} ÷ ${Qn}`)} = ${pt(R)}이다.`
      });
    }),
    H('hard-overflow', '넘친 물의 양으로 원뿔 모양의 그릇의 높이 구하기', '심72', (d) => {
      // 원기둥 모양의 그릇에 든 물의 부피를 구한다 → 넘친 것이 1/n 이면 원뿔 모양의 그릇의 부피는 물의 (n − 1)/n 이다 → 원뿔의 부피의 식을 세운다 → 높이를 구한다.
      const [a, b] = pair(d), [p, q, n] = d.pick([[1, 1, 3], [1, 1, 2], [1, 2, 3], [1, 1, 4], [2, 1, 2], [1, 2, 5], [3, 2, 3], [2, 1, 3]]), f = Q(3 * (n - 1) * p * p, n * q * q);
      const [k1, k2] = d.until(() => [d.int(1, 3), d.int(1, 3) * pm(d)], ([x, y]) => x !== Math.abs(y) && Math.abs(f.p * x) <= 30 && Math.abs(f.p * y) <= 30);
      const Hs = lin([f.q * k1, f.q * k2], a, b), Rc = ms(p, [[a, 1]]), Rk = ms(q, [[a, 1]]), water = `π*${sq2(Rc)}*(${Hs})`, kept = `[${n - 1}|${n}]*${water}`, src = `3*${kept}:(π*${sq2(Rk)})`, hn = V('h');
      return polyQ(`밑면의 반지름의 길이가 ${xh(Rc)}, 높이가 ${xh(Hs)}인 원기둥 모양의 그릇에 물이 가득 들어 있다. 이 물을 밑면의 반지름의 길이가 ${xh(Rk)}인 원뿔 모양의 그릇에 모두 부었더니 부은 물의 ${frac(1, n)}이 넘쳤다. 원뿔 모양의 그릇의 높이를 구하시오. (단, 그릇의 두께는 생각하지 않는다.)`, src, [a, b], {
        figure: null, unseen: [3, n - 1, 2],
        explain: `물의 부피는 ${nb(`π × ${htmlX(sq2(Rc))} × (${htmlX(Hs)})`)} = ${pt(xv(water))}이다. 부은 물의 ${frac(1, n)}이 넘쳤으므로 원뿔 모양의 그릇의 부피는 물의 부피의 ${frac(n - 1, n)}인 ${pt(xv(kept))}이다. 그릇의 높이를 ${hn}라 하면 ${nb(`${frac(1, 3)} × π × ${htmlX(sq2(Rk))} × ${hn}`)} = ${pt(xv(kept))}이므로 ${hn} = ${pt(xv(src))}이다.`
      });
    }, { standard: STD3 }),
    H('hard-box-cubed', '□ 가 두 번 나오는 등식에서 알맞은 단항식 구하기', '심34', (d) => {
      // A ÷ □ = (□)² ÷ B: 양변에 □ 와 B 를 곱하여 (□)³ = A × B 로 모은다 → 곱을 계산한다 → 세제곱하여 그 식이 되는 단항식을 찾는다(곱의 거듭제곱을 거꾸로 쓴다).
      const [a, b] = pair(d), c = d.pick([2, 3]) * pm(d), [p, q] = [d.int(1, 3), d.int(1, 3)], [al, be] = d.pick(Math.abs(c) === 2 ? [[2, 4], [4, 2], [1, 8]] : [[3, 9], [9, 3], [1, 27]]), [i, j] = [d.int(1, 3 * p - 1), d.int(1, 3 * q - 1)];
      const A = ms(Math.sign(c) * al, [[a, i], [b, j]]), Bm = ms(be, [[a, 3 * p - i], [b, 3 * q - j]]), ans = ms(c, [[a, p], [b, q]]), cube = srcOf(xv(`(${ans})^3`));
      return monoQ('다음 식의 □ 안에 공통으로 들어갈 식을 구하시오.', ans, [a, b], {
        figure: eqx(`${A}:?`, `[(?)^2|${Bm}]`), unseen: [Math.abs(c), p, q],
        explain: `우변은 (□)${sup(2)} ÷ ${xh(Bm)}이다. 양변에 □와 ${xj(Bm, '을/를')} 곱하면 (□)${sup(3)} = ${xh(`${pa(A)}*${Bm}`)} = ${xh(cube)}이다. ${xh(cube)} = ${xh(`(${ans})^3`)}이므로 □ = ${xh(ans)}이다.`
      });
    }),
    H('hard-same-divisor', '같은 식으로 나눈 두 몫으로 두 식의 몫 구하기', '심37', (d) => {
      // A ÷ B 와 C ÷ B 가 주어진다 → A 와 C 를 B 를 써서 나타낸다 → A ÷ C 에서 B 가 약분된다 → 두 거듭제곱을 계산하여 나눈다.
      const v = one(d);
      const [s1, s2] = d.until(() => { const c1 = d.pick([2, 3]), c2 = d.pick([1, 1, c1]); return [`(${c1}${v}^${d.int(2, 4)})^${d.pick([2, 3])}`, `(-${c2 > 1 ? c2 : ''}${vs([[v, d.int(1, 3)]])})^${d.pick([2, 3])}`]; }, ([x, y]) => monoOK(`${x}:${y}`, [v]) && Math.abs(xv(`${x}:${y}`)[0].q.p) >= 2);
      const src = `${s1}:${s2}`, A = V('A'), Bv = V('B'), Cv = V('C'), v1 = xv(s1), v2 = xv(s2), wrap = (P) => (P[0].q.p < 0 ? `(${ph(P)})` : ph(P));
      return monoQ(`세 단항식 ${A}, ${Bv}, ${Cv}에 대하여 ${nb(`${A} ÷ ${Bv} = ${htmlX(s1)}`)}, ${nb(`${Cv} ÷ ${Bv} = ${htmlX(s2)}`)}일 때, ${nb(`${A} ÷ ${Cv}`)}를 계산하시오.`, src, [v], {
        figure: null,
        explain: `${nb(`${A} = ${htmlX(s1)} × ${Bv}`)} = ${nb(`${ph(v1)} × ${Bv}`)}, ${nb(`${Cv} = ${htmlX(s2)} × ${Bv}`)} = ${nb(`${wrap(v2)} × ${Bv}`)}이다. ${nb(`${A} ÷ ${Cv}`)}를 계산하면 ${Bv}는 약분되므로 ${nb(`${A} ÷ ${Cv}`)} = ${nb(`${ph(v1)} ÷ ${wrap(v2)}`)} = ${pt(xv(src))}이다.`
      });
    }),
    H('hard-degree-match', '차수를 견주어 두 단항식을 정하기', '심70', (d) => {
      // (A ± c x^(n+1)) ÷ x^n = k x^t + B: 양변에 x^n 을 곱한다 → B 가 일차식이므로 B x^n 의 차수는 n + 1 이다 → 차수가 같은 항끼리 짝 지어 A, B 를 정한다 → 나눈다.
      const nn = d.pick([2, 3]), t = d.int(2, 4), c = d.int(2, 6), k = c * d.int(2, 4), plus = d.bool(), A = V('A'), Bv = V('B');
      const As = `${k}x^${t + nn}`, Bs = `${plus ? '' : '-'}${c}x`, top = `A${plus ? '+' : '-'}${c}x^${nn + 1}`, right = `${k}x^${t}+B`, src = `${As}:${pa(Bs)}`, left = `[${top}|x^${nn}]`;
      const row = '<span class="mb-expr"' + (fit(emX(left) + emX(right) + 1.62 + 2.6) || ' style="font-size:1.2rem"') + '>' + xe(left) + OE + xe(right) + '</span>';
      return monoQ(`두 단항식 ${A}, ${Bv}가 다음 조건을 모두 만족시킬 때, ${nb(`${A} ÷ ${Bv}`)}를 계산하시오.`, src, ['x'], {
        figure: lines([tag('㈎') + `${Bv}는 ${X1}에 대한 일차식이다.`, tag('㈏') + row]), unseen: [t + nn],
        explain: `㈏의 양변에 ${xj(`x^${nn}`, '을/를')} 곱하면 ${nb(`${htmlX(top)} = ${htmlX(`${As}+Bx^${nn}`)}`)}이다. ${Bv}가 일차식이므로 ${xh(`Bx^${nn}`)}의 차수는 ${nn + 1}이다. ${A}는 단항식이므로 차수가 같은 항끼리 견주면 ${nb(`${A} = ${htmlX(As)}`)}, ${nb(`${htmlX(`Bx^${nn}`)} = ${htmlX(`${plus ? '' : '-'}${c}x^${nn + 1}`)}`)}에서 ${nb(`${Bv} = ${htmlX(Bs)}`)}이다. ${nb(`${A} ÷ ${Bv}`)} = ${xh(src)} = ${pt(xv(src))}이다.`
      });
    }, { standard: STD3 }),
    H('hard-rep-mono', '계수가 순환소수인 단항식의 곱셈과 나눗셈', '심31', (d) => {
      // 순환소수를 분수로 고친다(세 번 — 앞 단원) → 거듭제곱을 계산한다 → 나눗셈을 역수의 곱셈으로 고친다 → 계수끼리, 문자끼리 계산한다.
      const [a, b] = pair(d), [pd, qd, rd] = d.until(() => [d.int(1, 8), d.int(1, 3), d.int(1, 8)], ([x, y, z]) => (x * z) % (y * y) === 0 && x * z / (y * y) >= 2 && x * z / (y * y) <= 32);
      const [i, j, k, l] = d.until(() => [d.int(2, 4), d.int(3, 6), d.int(1, 2), d.int(1, 3)], ([i0, j0, k0, l0]) => i0 - 2 + l0 >= 1 && j0 - 2 * k0 + 1 >= 1), neg3 = d.bool();
      const [v1, v2, v3] = [vs([[a, i], [b, j]]), vs([[a, 1], [b, k]]), vs([[a, l], [b, 1]])], dot = (x) => rep('0.', String(x)), plainDot = (x) => '0.' + x;
      const build = (w) => `${w(pd)}${xe(v1)}${OD}(${MINUS}${w(qd)}${xe(v2)})${sup(2)}${OX}${neg3 ? `(${MINUS}${w(rd)}${xe(v3)})` : w(rd) + xe(v3)}`;
      const src = `${ms(Q(pd, 9), [[a, i], [b, j]])}:(-${ms(Q(qd, 9), [[a, 1], [b, k]])})^2*${neg3 ? '(-' : ''}${ms(Q(rd, 9), [[a, l], [b, 1]])}${neg3 ? ')' : ''}`;
      return monoQ(SIMP, src, [a, b], {
        figure: '<span class="mb-expr"' + fit(emOf(build(plainDot))) + '>' + build(dot) + '</span>', rule: 'rep-mono', unseen: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        explain: `${[...new Set([pd, qd, rd])].map((x) => `${dot(x)} = ${tx(Q(x, 9))}`).join(', ')}이다. 순환소수를 분수로 고쳐 계산하면 ${told(src)}이다.`
      });
    })
  ]);

  // 기본 묶음에 덧붙이는 꼴: 뿔과 구가 나온다는 까닭으로 뺐던 것이다(부피의 공식은 중1에서 배웠다). 거꾸로 한 번 구하거나 두 식을 각각 계산하여 나누는 것이라 기본에 둔다.
  B.addTypes(UNIT, 'mono', [
    TN('mono-solid-height', '부피가 단항식인 뿔과 삼각기둥의 높이', '①49 ②47', (d, n) => {
      const [a, b] = pair(d), THIRD = frac(1, 3);
      if (n === 0) {
        // 원뿔: 1/3 × π × (반지름)² × (높이) = (부피)
        const r = d.int(2, 4), c = r % 3 === 0 ? d.int(2, 6) : d.pick([3, 6, 9]), [p, p2, s, t] = [d.int(1, 2), d.int(0, 2), d.int(1, 3), d.int(1, 3)];
        const R = ms(r, [[a, p], [b, p2]]), Hs = ms(c, [[a, s], [b, t]]), Vs = `${r * r * c / 3}π${vs([[a, 2 * p + s], [b, 2 * p2 + t]])}`, base = srcOf(xv(`π*(${R})^2`));
        return monoQ(`밑면의 반지름의 길이가 ${xh(R)}이고 부피가 ${xh(Vs)}인 원뿔의 높이를 구하시오.`, `3*${Vs}:(π*(${R})^2)`, [a, b], {
          figure: null, rule: 'solid-cone', unseen: [3, 2],
          explain: `(원뿔의 부피) = ${THIRD} × (밑넓이) × (높이)이다. 밑넓이는 π × ${xh(`(${R})^2`)} = ${xh(base)}이므로 ${THIRD} × ${xh(base)} × (높이) = ${xh(Vs)}이다. (높이) = ${xh(`3*${Vs}:${base}`)} = ${xh(Hs)}이다.`
        });
      }
      if (n === 1) {
        // 사각뿔: 1/3 × (한 변)² × (높이) = (부피)
        const s0 = d.int(2, 6), c = s0 % 3 === 0 ? d.int(2, 5) : d.pick([3, 6]), [p, q, s, t] = [d.int(1, 2), d.int(1, 2), d.int(1, 3), d.int(1, 3)];
        const S = ms(s0, [[a, p], [b, q]]), Hs = ms(c, [[a, s], [b, t]]), Vs = ms(s0 * s0 * c / 3, [[a, 2 * p + s], [b, 2 * q + t]]), base = srcOf(xv(`(${S})^2`));
        return monoQ(`밑면이 한 변의 길이가 ${xh(S)}인 정사각형이고 부피가 ${xh(Vs)}인 사각뿔의 높이를 구하시오.`, `3*${Vs}:(${S})^2`, [a, b], {
          figure: null, rule: 'solid-pyramid', unseen: [3, 2],
          explain: `(사각뿔의 부피) = ${THIRD} × (밑넓이) × (높이)이다. 밑넓이는 ${xh(`(${S})^2`)} = ${xh(base)}이므로 ${THIRD} × ${xh(base)} × (높이) = ${xh(Vs)}이다. (높이) = ${xh(`3*${Vs}:${base}`)} = ${xh(Hs)}이다.`
        });
      }
      // 삼각기둥: (밑넓이) = 1/2 × (밑변의 길이) × (높이), (부피) = (밑넓이) × (기둥의 높이). 밑넓이의 계수가 분수가 되기도 한다.
      const [Bs, Ts, Hs] = d.until(() => [ms(d.pick([4, 6, 8]), [[a, d.int(1, 2)]]), ms(d.pick([Q(2, 3), Q(1, 2), Q(3, 2), Q(1, 3), Q(3), Q(2)]), [[b, 1]]), ms(d.int(2, 9), [[a, d.int(1, 3)], [b, d.int(1, 2)]])], ([x, y, z]) => { const tm = xv(`[1|2]*${x}*${y}*${z}`)[0]; return isInt(tm.q) && tm.q.p <= 99; });
      const Vm = srcOf(xv(`[1|2]*${Bs}*${Ts}*${Hs}`)), base = srcOf(xv(`[1|2]*${Bs}*${Ts}`));
      return monoQ(`밑면이 밑변의 길이가 ${xh(Bs)}, 높이가 ${xh(Ts)}인 삼각형인 삼각기둥이 있다. 이 삼각기둥의 부피가 ${xh(Vm)}일 때, 삼각기둥의 높이를 구하시오.`, `${Vm}:([1|2]*${Bs}*${Ts})`, [a, b], {
        figure: null, rule: 'solid-prism', unseen: [2],
        explain: `밑넓이는 ${frac(1, 2)} × ${xh(Bs)} × ${xh(Ts)} = ${xh(base)}이다. (높이) = (부피) ÷ (밑넓이)이므로 ${xh(`${Vm}:${base}`)} = ${xh(Hs)}이다.`
      });
    }, { count: 3 }),
    TN('mono-same-volume', '부피가 같은 두 입체도형에서 높이 구하기', '①50 심41', (d, n) => {
      const [a, b] = pair(d);
      if (n === 0) {
        // 직육면체의 부피를 구한다 → 삼각뿔의 밑넓이를 구한다 → 1/3 × (밑넓이) × (높이) = (부피)에서 높이를 구한다.
        const mono1 = () => ms(d.int(2, 4), [[a, d.int(0, 2)], [b, d.int(0, 2)]]), ansOf = (t) => `3*${t[0]}*${t[1]}*${t[2]}:([1|2]*${t[3]}*${t[4]})`;
        const five = d.until(() => [mono1(), mono1(), mono1(), mono1(), mono1()], (t) => t.every((s) => /[a-z]/.test(s)) && new Set(t).size === 5 && monoOK(ansOf(t), [a, b]) && xv(ansOf(t))[0].q.p >= 2 && xv(ansOf(t))[0].q.p <= 48);
        const [W, L, Hh, P, Qs] = five, Vs = srcOf(xv(`${W}*${L}*${Hh}`)), base = srcOf(xv(`[1|2]*${P}*${Qs}`));
        return monoQ(`세 모서리의 길이가 ${xh(W)}, ${xh(L)}, ${xh(Hh)}인 직육면체와 밑면이 직각을 낀 두 변의 길이가 ${xh(P)}, ${xh(Qs)}인 직각삼각형인 삼각뿔의 부피가 서로 같다. 이 삼각뿔의 높이를 구하시오.`, ansOf(five), [a, b], {
          figure: null, rule: 'same-volume-height', unseen: [3, 2],
          explain: `직육면체의 부피는 ${xh(`${W}*${L}*${Hh}`)} = ${xh(Vs)}이다. 삼각뿔의 밑넓이는 ${frac(1, 2)} × ${xh(P)} × ${xh(Qs)} = ${xh(base)}이므로 ${frac(1, 3)} × ${xh(base)} × (높이) = ${xh(Vs)}이다. (높이) = ${xh(`3*${Vs}:${base}`)} = ${pt(xv(ansOf(five)))}이다.`
        });
      }
      // 두 입체도형의 높이를 문자로 놓고 부피의 식을 세운다 → 두 식이 같다 → 한 높이가 다른 높이의 몇 배인지 읽는다.
      const [s0, m1, m2] = d.until(() => [d.pick([2, 3, 4, 6]), d.int(2, 9), d.int(2, 9)], ([x, y, z]) => (3 * y * z) % (x * x) === 0 && 3 * y * z / (x * x) >= 2 && 3 * y * z / (x * x) <= 6 && y !== z), ratio = 3 * m1 * m2 / (s0 * s0), [i, j] = d.pick([[1, 1], [2, 1], [1, 2]]);
      const M1 = ms(m1, [[a, 2 * i]]), M2 = ms(m2, [[b, 2 * j]]), S = ms(s0, [[a, i], [b, j]]), hb = V('h'), hp = V('k'), boxV = ph(xv(`${M1}*${M2}`)) + hb, pyrV = ph(xv(`[1|3]*(${S})^2`)) + hp;
      return N(`밑면의 가로의 길이가 ${xh(M1)}, 세로의 길이가 ${xh(M2)}인 직육면체와 밑면이 한 변의 길이가 ${xh(S)}인 정사각형인 사각뿔의 부피가 서로 같다. 사각뿔의 높이는 직육면체의 높이의 몇 배인가?`, ratio, {
        unit: '배',
        explain: `직육면체의 높이를 ${hb}, 사각뿔의 높이를 ${hp}라 하면 직육면체의 부피는 ${nb(`${htmlX(M1)} × ${htmlX(M2)} × ${hb}`)} = ${nb(boxV)}, 사각뿔의 부피는 ${nb(`${frac(1, 3)} × ${htmlX(`(${S})^2`)} × ${hp}`)} = ${nb(pyrV)}이다. 두 부피가 같으므로 ${nb(`${boxV} = ${pyrV}`)}에서 ${nb(`${hp} = ${ratio}${hb}`)}이다. 사각뿔의 높이는 직육면체의 높이의 ${ratio}배이다.`,
        facts: { calc: [[`3*${m1}*${m2}/${s0}**2`, 0]], unseen: [3, 2], rule: 'same-volume-ratio' }
      });
    }, { count: 2 }),
    TN('mono-volume-ratio', '두 입체도형의 부피를 각각 구하여 견주기', '①51·52', (d, n) => {
      if (n === 0) {
        // 원뿔과 원기둥의 부피를 각각 구한다 → 나눈다. 틀린 보기: 거꾸로 나눈 아이, 원뿔의 1/3 을 놓친 아이, 반지름을 제곱하지 않은 아이, 1/3 을 원기둥에 곱한 아이
        const [a, b] = pair(d), mono1 = () => ms(d.int(1, 4), [[a, d.int(0, 2)], [b, d.int(0, 2)]]), ratioOf = (t) => `π*${sq2(t[2])}*${t[3]}:([1|3]*π*${sq2(t[0])}*${t[1]})`;
        const four = d.until(() => [mono1(), mono1(), mono1(), mono1()], (t) => { if (!t.every((s) => /[a-z]/.test(s)) || new Set(t).size < 4) return false; const tm = xv(ratioOf(t))[0]; return letters(tm).length >= 1 && tm.q.q <= 4 && tm.q.p <= 24; });
        const [R1, H1, R2, H2] = four, R = xv(ratioOf(four)), cone = xv(`[1|3]*π*${sq2(R1)}*${H1}`), cyl = xv(`π*${sq2(R2)}*${H2}`);
        const item = pickQ(d, `밑면의 반지름의 길이가 ${xh(R1)}, 높이가 ${xh(H1)}인 원뿔과 밑면의 반지름의 길이가 ${xh(R2)}, 높이가 ${xh(H2)}인 원기둥이 있다. 원기둥의 부피는 원뿔의 부피의 몇 배인가?`, R, [inv(R), pDiv(R, xv('3')), xv(`3*${R2}*${H2}:(${R1}*${H1})`), pDiv(R, xv('9')), inv(pDiv(R, xv('3')))], {
          explain: `원뿔의 부피는 ${nb(`${frac(1, 3)} × π × ${htmlX(sq2(R1))} × ${htmlX(H1)}`)} = ${pt(cone)}, 원기둥의 부피는 ${nb(`π × ${htmlX(sq2(R2))} × ${htmlX(H2)}`)} = ${pt(cyl)}이다. ${pt(cyl)} ÷ ${pt(cone)} = ${pt(R)}이므로 ${pt(R)}배이다.`
        });
        item.choice.options = item.choice.options.map((o) => o + '배');
        return item;
      }
      // 찰흙(직육면체)의 부피와 구슬(구) 한 개의 부피를 구한다 → 나눈다(문자가 모두 약분되어 수만 남는다).
      const [s0, rho, c] = d.pick([[2, 1, 2], [2, 1, 4], [2, 1, 5], [2, 1, 3], [4, 2, 4], [4, 2, 8], [4, 2, 10], [4, 1, 1], [4, 1, 2]]), count = s0 * s0 * c / (4 * rho ** 3);
      const [u, v, i, j] = d.until(() => [d.int(1, 2), d.int(1, 2), d.int(1, 3), d.int(1, 3)], ([u0, v0, i0, j0]) => 2 * i0 <= 3 * u0 && 2 * j0 <= 3 * v0);
      const S = ms(s0, [['x', i], ['y', j]]), r = ms(rho, [['x', u], ['y', v]]), Hs = ms(Q(c, 3), [['π', 1], ['x', 3 * u - 2 * i], ['y', 3 * v - 2 * j]]), clay = xv(`(${S})^2*${Hs}`), ball = xv(`[4|3]*π*(${r})^3`);
      return N(`밑면이 한 변의 길이가 ${xh(S)}인 정사각형이고 높이가 ${xh(Hs)}인 직육면체 모양의 찰흙이 있다. 이 찰흙을 모두 사용하여 반지름의 길이가 ${xh(r)}인 구 모양의 구슬을 만들 때, 만들 수 있는 구슬은 모두 몇 개인가?`, count, {
        unit: '개',
        explain: `찰흙의 부피는 ${xh(`(${S})^2*${Hs}`)} = ${pt(clay)}이고, 구슬 한 개의 부피는 ${nb(`${frac(4, 3)} × π × ${htmlX(`(${r})^3`)}`)} = ${pt(ball)}이다. ${pt(clay)} ÷ ${pt(ball)} = ${count}이므로 구슬을 ${count}개 만들 수 있다.`,
        facts: { calc: [[`${s0}**2*${c}/(4*${rho}**3)`, 0]], unseen: [4, 3, 2, 1, c], rule: 'clay-balls' }
      });
    }, { count: 2 })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
