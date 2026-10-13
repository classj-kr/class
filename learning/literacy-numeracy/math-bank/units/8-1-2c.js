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
})(typeof window !== 'undefined' ? window : globalThis);
