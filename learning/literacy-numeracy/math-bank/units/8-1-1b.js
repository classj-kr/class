// 중학교 2학년 1학기 1단원 유리수와 순환소수 — 뒤쪽 묶음(유한소수·순환소수가 되게 하는 수, 순환소수를 분수로 나타내기, 순환소수의 크기 비교와 계산, 유리수와 순환소수의 관계).
// 단원 틀과 도구, 싣는 기준, 뺀 것과 까닭은 8-1-1a.js 에 있다. ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
//  - 순환소수를 분수로 나타내는 문항은 과정(10x − x, 1000x − 10x 꼴의 빈칸, 가장 편리한 식, 뺀 값)과 값(기약분수)을 따로 묻는다. 공식 꼴((전체 − 앞부분)/990)을 외워야 가릴 수 있는 문항은 없다.
//  - 순환소수의 계산은 분수로 고쳐서 하는 계산 한 번까지이다: 역수, 두 순환소수의 합, 자연수를 곱해 자연수가 되게 하기.
//  - 관계를 말하는 문장은 2022 자료의 말로 적는다(「정수가 아닌 유리수는 유한소수 또는 순환소수로 나타낼 수 있다」「순환소수는 모두 유리수이다」「무한소수 가운데에는 순환소수가 아닌 것도 있다」).
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { box, frac, lines, numbers, tagged, LABELS, N, M, C, F } = B.kit;
  const { qadd } = B.kit.mid;
  const {
    LAB, range, gcd, lcm, Q, qcmp, fl, nb, tail, V, claimQ, nline, rep, ruled, asc,
    fz, fval, strip25, need, fin, expand, okRep, pickRep, pickFrac, headOf, repOf, valOf, unroll, unrollOf, lastJ, repJ, fden, par, ffrac, eqn, row, x,
    repDen, repJs, repUnseen, BIG, LOOSE, shortDec, twoFive, sortF
  } = B.kit.m811;
  const U = '8-1-1', MINUS = '−';   // 음의 분수(유리수 고르기의 보기)에만 쓴다
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const a = V('a'), b = V('b');
  // 소인수분해 한 식에 값을 덧붙인 글: 3 × 7 = 21 (소수 하나이면 그 수만)
  const asProduct = (k) => { const f = fz(k); return f.length === 1 && f[0][1] === 1 ? String(k) : nb(`${fden(f)} = ${k}`); };
  // 순환소수를 분수로 고칠 때 나오는 수: A 순환마디 끝까지의 수, B 순환마디 앞까지의 수, den 9…90…0, small·big 곱하는 10의 거듭제곱
  const parts = (r) => { const f = r.pre.length, k = r.cyc.length; return { f, k, A: Number(r.whole + r.pre + r.cyc), B: Number(r.whole + r.pre), den: repDen(r), small: 10 ** f, big: 10 ** (f + k) }; };
  const mulX = (n) => (n === 1 ? '' : n) + x;
  // 분모를 소인수분해 한 글: 「45 = 3² × 5이므로 」(분모가 소수이면 「분모가 7이므로 」)
  const denTold = (q) => { const f = fz(q); return f.length === 1 && f[0][1] === 1 ? `분모가 ${q}이므로 ` : `${eqn(q)}이므로 `; };
  // 분수로 고치는 풀이 글
  function fracTold(r) {
    const { f, A, B: Bn, den, small, big } = parts(r), v = valOf(r), tailEnd = `${frac(A - Bn, den)}${v.q === den ? '' : ` = ${frac(v.p, v.q)}`}`;
    return f === 0
      ? `${nb(`${x} = ${unrollOf(r)}`)}${lastJ(r.cyc, '으로/로')} 놓으면 ${nb(`${big}${x} = ${unroll(A + '.', r.cyc)}`)}이다. ${nb(`${big}${x} − ${x} = ${A - Bn}`)}이므로 ${nb(`${big - 1}${x} = ${A - Bn}`)}, ${nb(`${x} = ${tailEnd}`)}이다.`
      : `${nb(`${x} = ${unrollOf(r)}`)}${lastJ(r.cyc, '으로/로')} 놓으면 ${nb(`${small}${x} = ${unroll(Bn + '.', r.cyc)}`)}, ${nb(`${big}${x} = ${unroll(A + '.', r.cyc)}`)}이다. ${nb(`${big}${x} − ${small}${x} = ${A - Bn}`)}이므로 ${nb(`${big - small}${x} = ${A - Bn}`)}, ${nb(`${x} = ${tailEnd}`)}이다.`;
  }
  // 분수로 고친 한 줄: 0.43̇ = 39/90 = 13/30
  const asFrac = (r) => { const { A, B: Bn, den } = parts(r), v = valOf(r); return `${repOf(r)} = ${frac(A - Bn, den)}${v.q === den ? '' : ` = ${frac(v.p, v.q)}`}`; };
  const toFrac = (r, rule) => { const v = valOf(r); return F(`순환소수 ${repJ(r, '을/를')} 기약분수로 나타내시오.`, v.p, v.q, { improper: v.p > v.q, explain: fracTold(r), facts: { value: repJs(r), unseen: repUnseen(r), rule } }); };
  // 가장 편리한 식: 소수점 아래 부분이 같아지는 두 식의 차
  const SIGS = [[0, 1], [0, 2], [0, 3], [1, 1], [1, 2], [2, 1]];
  const bestExpr = (f, k) => `${10 ** (f + k)}${x} − ${mulX(10 ** f)}`;

  // 실력 파일(8-1-1c.js)도 쓰는 도구
  Object.assign(B.kit.m811, { asProduct, denTold, parts, fracTold, asFrac });

  B.addTypes(U, 'make', [
    T('make-least', '분수에 곱하여 유한소수가 되게 하는 가장 작은 자연수', '①38 심18', (d, n) => {
      // 첫째는 가장 작은 자연수(지울 소인수가 하나, 둘의 곱, 거듭제곱인 것과 약분부터 해야 하는 것이 섞여 나온다), 둘째는 분모를 소인수분해 한 꼴로 주고 분자를 묻고, 셋째는 가장 작은 두 자리 자연수를 묻는다.
      if (n === 1) {
        const f = sortF(twoFive(d).concat(d.pick([[[3, 1], [7, 1]], [[3, 1], [11, 1]], [[3, 2]], [[7, 1], [11, 1]], [[3, 1], [13, 1]], [[3, 2], [7, 1]], [[3, 2], [11, 1]]]))), q = fval(f), k = need(1, q);
        return N(`${nb(ffrac(x, f) + '가')} 유한소수가 되게 하는 가장 작은 자연수 ${x}의 값은?`, k, {
          explain: `분모의 소인수 가운데 2와 5가 아닌 것이 분자와 모두 약분되어야 한다. ${x}는 ${asProduct(k)}의 배수이어야 하므로 가장 작은 자연수는 ${k}이다.`,
          facts: { digit: { template: `(□*${BIG})%${q}<1`, lo: 1, hi: k + 20, ask: 'min' }, rule: 'make-least-numerator' }
        });
      }
      const [p, q] = n === 0
        ? d.pick([[3, 56], [5, 28], [9, 70], [11, 42], [13, 66], [5, 84], [13, 180], [7, 90], [11, 360], [14, 90], [33, 105], [15, 72], [21, 90], [9, 84], [15, 126], [12, 45]])
        : d.pick([[6, 350], [9, 140], [7, 60], [11, 150], [7, 180], [13, 90], [3, 280], [21, 180], [14, 180], [9, 350], [5, 72]]);
      const g = gcd(p, q), k = need(p, q), answer = n === 0 ? k : k * Math.ceil(10 / k);
      const told = `${g > 1 ? `약분하면 ${frac(p, q)} = ${frac(p / g, q / g)}이다. ` : ''}${denTold(q / g)}${a}는 ${asProduct(k)}의 배수이어야 한다.`;
      return N(`${nb(frac(p, q) + ' × ' + a + '가')} 유한소수가 되게 하는 가장 작은 ${n === 0 ? '' : '두 자리 '}자연수 ${a}의 값은?`, answer, {
        explain: `${told} ${n === 0 ? `가장 작은 자연수는 ${k}이다.` : `${k}의 배수 가운데 가장 작은 두 자리 수는 ${answer}이다.`}`,
        facts: { digit: { template: `(${p}*□*${BIG})%${q}<1`, lo: n === 0 ? 1 : 10, hi: answer + 25, ask: 'min' }, rule: n === 0 ? 'make-least-natural' : 'make-least-two-digit' }
      });
    }, { count: 3 }),
    T('make-pick', '분자가 될 수 없는 수 고르기(유한소수 / 순환소수가 될 때)', '①39·47', (d, n) => {
      // 첫째는 유한소수가 될 때(분자는 지울 수의 배수이어야 한다), 둘째는 순환소수가 될 때(그 배수이면 약분되어 유한소수가 된다)이다.
      // 지울 수가 9, 21, 33이면 틀리기 쉬운 수(3이나 7, 11의 배수이기만 한 수)를 섞는다.
      const [q, k] = d.pick([[280, 7], [120, 3], [210, 21], [330, 33], [140, 7], [180, 9], [450, 9], [60, 3], [660, 33], [420, 21]]);
      const multiples = range(1, 8).map((m) => k * m).filter((v) => v < q), composite = fz(k).length > 1 || fz(k)[0][1] > 1;
      const others = range(6, 69).filter((v) => v % k !== 0 && (composite ? gcd(v, k) > 1 : v % 10 !== 0));
      if (n === 0) {
        const bad = d.pick(others), rows = d.shuffle(d.shuffle(multiples).slice(0, 4).concat([bad]));
        return ruled(C(`${nb(frac(x, q) + '가')} 유한소수가 될 때, 다음 중 자연수 ${x}의 값이 될 수 없는 것은?`, rows.map(String), rows.indexOf(bad), {
          explain: `${eqn(q)}이므로 ${x}는 ${asProduct(k)}의 배수이어야 한다. ${bad}${tail(bad, '은/는')} ${k}의 배수가 아니므로 ${x}의 값이 될 수 없다.`,
          facts: { truth: rows.map((v) => fin(v, q)), want: false }
        }), 'make-pick-finite');
      }
      const good = d.pick(multiples), rows = d.shuffle(d.shuffle(others).slice(0, 4).concat([good])), g = gcd(good, q);
      return ruled(C(`${nb(frac(x, q) + '가')} 순환소수가 될 때, 다음 중 자연수 ${x}의 값이 될 수 없는 것은?`, rows.map(String), rows.indexOf(good), {
        explain: `${eqn(q)}이므로 ${x}가 ${asProduct(k)}의 배수이면 약분되어 유한소수가 된다. ${good}${tail(good, '은/는')} ${k}의 배수이고 ${frac(good, q)} = ${frac(good / g, q / g)}${tail(good / g, '은/는')} 유한소수이다.`,
        facts: { truth: rows.map((v) => !fin(v, q)), want: false }
      }), 'make-pick-repeating');
    }, { count: 2 }),
    T('make-count', '유한소수가 되게 하는 두 자리 자연수의 개수', '①40', (d) => {
      const q = d.pick([110, 130, 170, 190, 210, 220, 260, 330, 420]), k = need(1, q), hits = range(10, 99).filter((v) => v % k === 0);
      return N(`${nb(frac(x, q) + '가')} 유한소수가 되게 하는 두 자리 자연수 ${x}는 모두 몇 개인가?`, hits.length, {
        unit: '개', explain: `${eqn(q)}이므로 ${x}는 ${asProduct(k)}의 배수이어야 한다. 두 자리 자연수 가운데 ${k}의 배수는 ${hits.length > 6 ? `${hits.slice(0, 3).join(', ')}, …, ${hits[hits.length - 1]}` : hits.join(', ')}의 ${hits.length}개이다.`,
        facts: { count: range(10, 99).map((v) => fin(v, q)) }
      });
    }),
    T('make-denom-pick', '분모에 곱해진 수가 될 수 없는 것 고르기', '①41', (d) => {
      // 분자와 약분되는 3이나 7은 분모에 곱해져도 된다. 분자에 든 것보다 많이 곱해지면 남는다(분자가 3이면 9, 분자가 9이면 27).
      const [num, f] = d.pick([[63, [[2, 2], [7, 1]]], [9, [[2, 2], [5, 1]]], [21, [[2, 1], [5, 2]]], [3, [[2, 3], [5, 1]]], [33, [[2, 2], [5, 1]]], [21, [[2, 3]]], [9, [[5, 2]]], [3, [[2, 1], [5, 2]]]]), D0 = fval(f);
      const cand = range(2, 40), tricky = cand.filter((v) => fin(num, D0 * v) && strip25(v) > 1), plain = cand.filter((v) => fin(num, D0 * v) && strip25(v) === 1 && v <= 20);
      const bad = d.pick(cand.filter((v) => !fin(num, D0 * v) && fz(v).every(([p]) => p === 2 || p === 5 || num % p === 0)));
      const shownTricky = d.shuffle(tricky).slice(0, d.int(2, 3)), rows = d.shuffle(shownTricky.concat(d.shuffle(plain).slice(0, 4 - shownTricky.length), [bad]));
      const low = (v) => { const g = gcd(num, D0 * v); return frac(num / g, par(fden(fz(D0 * v / g)))); };
      return C(`${nb(ffrac(num, f, a) + tail(num, '이/가'))} 유한소수가 될 때, 다음 중 자연수 ${a}의 값이 될 수 없는 것은?`, rows.map(String), rows.indexOf(bad), {
        explain: `${a} = ${bad}이면 약분하여 ${low(bad)}${tail(num / gcd(num, D0 * bad), '이/가')} 되고, 분모에 2와 5 이외의 소인수가 남으므로 유한소수가 될 수 없다. ${shownTricky.map((v) => `${a} = ${v}이면 ${low(v)}`).join(', ')}처럼 분자와 모두 약분되는 수는 곱해져도 유한소수가 된다.`,
        facts: { truth: rows.map((v) => fin(num, D0 * v)), want: false }
      });
    })
  ]);

  B.addTypes(U, 'tofrac', [
    T('tofrac-steps-pure', '순환소수를 분수로 나타내는 과정의 빈칸(순환마디가 소수점 아래 첫째 자리부터)', '①50', (d) => {
      const r = pickRep(d, { whole: [0, 3], k: d.int(1, 2) }), { A, B: Bn, big } = parts(r), v = valOf(r);
      return M(`다음은 순환소수 ${repJ(r, '을/를')} 분수로 나타내는 과정이다. ㉠, ㉡, ㉢에 알맞은 수는?`, [{ label: LAB[0], answer: big }, { label: LAB[1], answer: big - 1 }, { label: LAB[2], answer: A - Bn }], {
        figure: lines([row(`${x} = ${unrollOf(r)}`), row(`${box(LAB[0])}${x} = ${unroll(A + '.', r.cyc)}`), row(`${box(LAB[0])}${x} − ${x} = ${box(LAB[2])}`), row(`${box(LAB[1])}${x} = ${box(LAB[2])}, ${x} = ${frac(box(LAB[2]), box(LAB[1]))}`)]),
        explain: `소수점 아래 부분이 같아지도록 ${x}에 ${big}${tail(big, '을/를')} 곱하면 ${nb(`${big}${x} = ${unroll(A + '.', r.cyc)}`)}이다. ${nb(`${big}${x} − ${x} = ${Bn ? `${A} − ${Bn} = ` : ''}${A - Bn}`)}이므로 ${nb(`${big - 1}${x} = ${A - Bn}`)}이다. ㉠은 ${big}, ㉡은 ${big - 1}, ㉢은 ${A - Bn}이고 ${x} = ${frac(A - Bn, big - 1)}${v.q === big - 1 ? '' : ` = ${frac(v.p, v.q)}`}이다.`,
        facts: { calc: [[`10**${r.cyc.length}`, 0], [`10**${r.cyc.length}-1`, 1], [`${A}-${Bn}`, 2]], unseen: [10, 1, r.cyc.length] }
      });
    }),
    T('tofrac-steps-mixed', '순환소수를 분수로 나타내는 과정의 빈칸(순환하지 않는 자리가 있음)', '①51 심27', (d) => {
      const r = pickRep(d, { whole: [0, 2], f: 1, k: d.int(1, 2) }), { f, k, A, B: Bn, small, big } = parts(r), v = valOf(r);
      return M(`다음은 순환소수 ${repJ(r, '을/를')} 분수로 나타내는 과정이다. ㉠, ㉡, ㉢에 알맞은 수는?`, [{ label: LAB[0], answer: small }, { label: LAB[1], answer: big }, { label: LAB[2], answer: big - small }], {
        figure: lines([row(`${x} = ${unrollOf(r)}`), row(`${box(LAB[0])}${x} = ${unroll(Bn + '.', r.cyc)}`), row(`${box(LAB[1])}${x} = ${unroll(A + '.', r.cyc)}`), row(`${box(LAB[1])}${x} − ${box(LAB[0])}${x} = ${A - Bn}`), row(`${box(LAB[2])}${x} = ${A - Bn}, ${x} = ${frac(A - Bn, box(LAB[2]))}`)]),
        explain: `소수점 아래 부분이 같아지는 두 식을 만든다. ${nb(`${small}${x} = ${unroll(Bn + '.', r.cyc)}`)}, ${nb(`${big}${x} = ${unroll(A + '.', r.cyc)}`)}이므로 ㉠은 ${small}, ㉡은 ${big}이다. 변끼리 빼면 ${nb(`${big - small}${x} = ${A - Bn}`)}이므로 ㉢은 ${big - small}이고 ${x} = ${frac(A - Bn, big - small)}${v.q === big - small ? '' : ` = ${frac(v.p, v.q)}`}이다.`,
        facts: { calc: [[`10**${f}`, 0], [`10**${f + k}`, 1], [`10**${f + k}-10**${f}`, 2]], unseen: [10, f, f + k] }
      });
    }),
    T('tofrac-best', '분수로 나타낼 때 가장 편리한 식', '①52·53', (d, n) => {
      // 첫째는 순환소수를 주고 식을, 둘째는 식을 주고 순환소수를 고른다. 틀린 보기는 순환하지 않는 자리의 수나 순환마디의 자리 수를 잘못 센 식이다.
      const [f, k] = d.pick(SIGS), right = bestExpr(f, k);
      if (n === 0) {
        const r = pickRep(d, { whole: [0, 4], f, k }), { A, B: Bn, small, big } = parts(r);
        const rows = d.shuffle([right].concat(d.shuffle(SIGS.filter((s) => s[0] !== f || s[1] !== k)).slice(0, 4).map(([i, j]) => bestExpr(i, j))));
        return C(`순환소수 ${x} = ${repJ(r, '을/를')} 분수로 나타낼 때, 가장 편리한 식은?`, rows, rows.indexOf(right), {
          explain: `소수점 아래 부분이 같은 두 식을 만들어 뺀다. ${nb(`${big}${x} = ${unroll(A + '.', r.cyc)}`)}, ${nb(`${mulX(small)} = ${unroll(Bn + '.', r.cyc)}`)}이므로 ${nb(right)}를 계산하면 소수점 아래 부분이 없어진다.`,
          facts: { truth: rows.map((v) => v === right), want: true }
        });
      }
      const sigs = [[f, k]].concat(d.shuffle(SIGS.filter((s) => s[0] !== f || s[1] !== k)).slice(0, 4)), list = d.shuffle(sigs.map(([i, j]) => ({ r: pickRep(d, { whole: [0, 4], f: i, k: j }), ok: i === f && j === k, expr: bestExpr(i, j) })));
      return C(`다음 순환소수를 ${x}라 하고 분수로 나타낼 때, ${nb(right)}를 이용하는 것이 가장 편리한 것은?`, list.map((v) => repOf(v.r)), list.findIndex((v) => v.ok), {
        explain: `소수점 아래 부분이 같아지는 두 식의 차를 이용한다. ${list.map((v) => `${repOf(v.r)}${lastJ(v.r.cyc, '은/는')} ${v.expr}`).join(', ')}가 가장 편리하다.`,
        facts: { truth: list.map((v) => v.ok), want: true }
      });
    }, { count: 2 }),
    T('tofrac-diff-value', '10의 거듭제곱을 곱한 두 식의 차의 값', '①54', (d) => {
      const [f, k] = d.pick([[0, 1], [0, 2], [1, 1], [1, 2], [2, 1]]), r = pickRep(d, { whole: [0, 3], f, k }), { A, B: Bn, small, big } = parts(r), v = valOf(r);
      return N(`${x} = ${repOf(r)}일 때, ${nb(bestExpr(f, k))}의 값은?`, A - Bn, {
        explain: `${nb(`${big}${x} = ${unroll(A + '.', r.cyc)}`)}, ${nb(`${mulX(small)} = ${unroll(Bn + '.', r.cyc)}`)}이고 두 수의 소수점 아래 부분이 같다. ${nb(`${bestExpr(f, k)} = ${A} − ${Bn} = ${A - Bn}`)}이다.`,
        facts: { calc: [[`(${big}-${small})*${v.p}/${v.q}`, 0]], unseen: [1, v.p, v.q] }
      });
    }),
    T('tofrac-pure', '순환소수를 기약분수로 나타내기(순환마디가 소수점 아래 첫째 자리부터)', '①56', (d, n) => toFrac(n === 0 ? pickRep(d, { k: d.pick([1, 2, 2, 3]) }) : pickRep(d, { whole: [1, 5], k: d.int(1, 2) }), n === 0 ? 'tofrac-pure' : 'tofrac-pure-whole'), { count: 2 }),
    T('tofrac-mixed', '순환소수를 기약분수로 나타내기(순환하지 않는 자리가 있음)', '①57', (d, n) => {
      const [f, k] = n === 0 ? d.pick([[1, 1], [1, 2], [2, 1]]) : d.pick([[1, 1], [1, 2]]);
      return toFrac(pickRep(d, { whole: n === 0 ? 0 : [1, 3], f, k }), n === 0 ? 'tofrac-mixed' : 'tofrac-mixed-whole');
    }, { count: 2 }),
    T('tofrac-claims', '순환소수를 분수로 나타낸 것이 옳지 않은 것 고르기', '①58', (d) => {
      // 틀린 식: 순환하지 않는 자리가 있는데 전체의 수를 분자로 삼은 것(0.43̇ = 43/90), 분모를 9뿐인 수로 삼은 것(0.43̇ = 39/99), 정수 부분을 빼지 않은 것(2.6̇3̇ = 263/99)
      const made = d.until(() => {
        const rs = [pickRep(d, { k: d.int(1, 2) }), pickRep(d, { f: 1, k: 1 }), pickRep(d, { f: 1, k: 2 }), pickRep(d, { whole: [1, 3], k: d.int(1, 2) })], at = d.int(1, 3), kind = d.bool();
        return rs.map((r, i) => {
          const { f, k, A, B: Bn, den } = parts(r), v = valOf(r), w = i !== at ? v : f === 0 || kind ? Q(A, den) : Q(A - Bn, 10 ** (f + k) - 1);
          return { r, text: `${repOf(r)} = ${frac(w.p, w.q)}`, expr: `${A - Bn}/${den}`, said: w.p / w.q, ok: i !== at, w, differs: i !== at || qcmp(w, v) !== 0 };
        });
      }, (list) => list.every((v) => v.differs && v.w.q > 1 && v.w.q <= 990 && v.w.p <= 999) && list.filter((v) => v.ok).every((v) => v.w.q < 500));
      const rows = d.shuffle(made), bad = rows.find((v) => !v.ok);
      return C('순환소수를 기약분수로 나타낸 것으로 옳지 않은 것은?', rows.map((v) => v.text), rows.indexOf(bad), {
        explain: `${fracTold(bad.r)} 따라서 ${nb(`${repOf(bad.r)} = ${frac(valOf(bad.r).p, valOf(bad.r).q)}`)}이다.`,
        facts: { claimed: rows.map((v) => [v.expr, v.said]), claimedWant: false }
      });
    }),
    T('tofrac-match', '순환소수와 같은 분수의 분자(분모) 구하기', '①60', (d) => {
      const r = d.until(() => { const [f, k] = d.pick([[0, 1], [0, 2], [1, 1], [1, 2]]); return pickRep(d, { whole: [0, 1], f, k }); }, (v) => valOf(v).q <= 110 && valOf(v).p >= 2 && valOf(v).q < repDen(v));
      const { A, B: Bn, den } = parts(r), v = valOf(r), top = d.bool();
      return N(`${nb(frac(top ? x : v.p, top ? v.q : x) + ' = ' + repOf(r))}일 때, 자연수 ${x}의 값은?`, top ? v.p : v.q, {
        explain: `${asFrac(r)}이다. ${frac(top ? x : v.p, top ? v.q : x)} = ${frac(v.p, v.q)}이므로 ${x} = ${top ? v.p : v.q}이다.`,
        facts: { calc: [[top ? `(${A}-${Bn})*${v.q}/${den}` : `${v.p}*${den}/(${A}-${Bn})`, 0]], unseen: [A, Bn, den] }
      });
    }),
    T('tofrac-digit', '분수와 같은 순환소수의 한 숫자 구하기', '①61', (d) => {
      const { p, q, e } = pickFrac(d, [15, 18, 22, 30, 45, 55, 66, 90], (v) => v.e.pre.length === 1 && v.e.pre !== '0' && v.e.cyc.length <= 2 && okRep(v.e.pre, v.e.cyc));
      return N(`${nb(rep('0.' + a, e.cyc) + ' = ' + frac(p, q))}일 때, 한 자리 자연수 ${a}의 값은?`, Number(e.pre), {
        explain: `${p} ÷ ${q} = ${unrollOf(e)}이므로 ${frac(p, q)} = ${repOf(e)}이다. 소수점 아래 첫째 자리의 숫자를 견주면 ${a} = ${e.pre}이다.`,
        facts: { calc: [[`(${p}*10-${p}*10%${q})/${q}`, 0]], unseen: [10] }
      });
    }),
    T('tofrac-one-claims', '순환소수 하나에 대한 설명의 참·거짓', '①63 심28', (d) => {
      // 틀린 설명: 순환마디에서 0을 빼거나 한 칸 밀어 잡은 것, 순환하지 않는 자리까지 점을 찍은 것, 순환마디 앞까지의 수를 빼지 않은 분수, 순환하지 않는 자리를 보지 않은 식, 유리수가 아니라고 한 것,
      //  순환하는 부분을 한 자리 앞당겨 쪼갠 것(0.30404… = 0.3 + 0.0̇4̇)
      const wantTrue = d.bool(), r = pickRep(d, { f: 1, k: 2, ok: (u) => u.pre !== '0' && !u.cyc.endsWith('0') }), { A, B: Bn, den } = parts(r), v = valOf(r), w = Bn ? Q(A, den) : Q(A - Bn, 900), c = r.cyc, badCyc = c[0] === '0' ? c[1] : c[1] + c[0];
      const yes = [`${x}는 유리수이다.`, `순환마디는 ${c}이다.`, `점을 찍어 나타내면 ${repOf(r)}이다.`, `기약분수로 나타내면 ${frac(v.p, v.q)}이다.`, `분수로 나타낼 때 가장 편리한 식은 ${bestExpr(1, 2)}이다.`, `${x}는 ${nb(`0.${r.pre} + ${rep('0.0', c)}`)}${lastJ(c, '과/와')} 같다.`];
      const no = [
        [`${x}는 유리수가 아니다.`, '순환소수는 분수로 나타낼 수 있으므로 유리수이다.', yes[0]],
        [`순환마디는 ${badCyc}이다.`, `소수점 아래 둘째 자리부터 ${c.split('').join(', ')}${lastJ(c, '이/가')} 이 차례로 되풀이되므로 순환마디는 ${c}이다.`, yes[1]],
        [`점을 찍어 나타내면 ${rep('0.', r.pre + c)}이다.`, `소수점 아래 첫째 자리의 숫자 ${r.pre}${lastJ(r.pre, '은/는')} 되풀이되지 않으므로 ${repJ(r, '으로/로')} 나타낸다.`, yes[2]],
        [`기약분수로 나타내면 ${frac(w.p, w.q)}이다.`, `1000${x} − 10${x} = ${A - Bn}이므로 ${x} = ${frac(A - Bn, den)}${v.q === den ? '' : ` = ${frac(v.p, v.q)}`}이다.`, yes[3]],
        [`분수로 나타낼 때 가장 편리한 식은 ${bestExpr(0, 2)}이다.`, `100${x}와 ${x}는 소수점 아래 부분이 다르다. 소수점 아래 부분이 같은 1000${x}와 10${x}의 차를 이용한다.`, yes[4]],
        [`${x}는 ${nb(`0.${r.pre} + ${rep('0.', c)}`)}${lastJ(c, '과/와')} 같다.`, `${nb(`${x} = 0.${r.pre} + ${unroll('0.0', c)}`)}이므로 ${x}는 ${nb(`0.${r.pre} + ${rep('0.0', c)}`)}${lastJ(c, '과/와')} 같다.`, yes[5]]
      ];
      return claimQ(d, `순환소수 ${x} = ${unrollOf(r)}에 대한 설명으로 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, yes, no, wantTrue);
    }),
    T('tofrac-line', '수직선에서 순환소수를 나타내는 점 찾기', '①64', (d) => {
      // 0.3̇ = 1/3, 0.6̇ = 2/3이므로 1을 3칸으로 나눈 눈금 위의 점이다.
      const ks = d.until(() => asc(d.shuffle([1, 2, 4, 5, 7, 8, 10, 11]).slice(0, 4)), (list) => list.every((v, i) => i === 0 || v - list[i - 1] >= 2)), names = ['A', 'B', 'C', 'D'], at = d.int(0, 3), k = ks[at];
      const r = { whole: Math.floor(k / 3), pre: '', cyc: k % 3 === 1 ? '3' : '6' };
      return C(`다음 수직선에서 ${repJ(r, '을/를')} 나타내는 점은?`, names.map((v) => '점 ' + v), at, {
        figure: nline(0, 4, { parts: 3, points: ks.map((v, i) => ({ at: Q(v, 3), name: names[i] })) }),
        explain: `${rep('0.', r.cyc)} = ${frac(r.cyc, 9)} = ${frac(k % 3, 3)}이${r.whole ? `므로 ${repOf(r)} = ${r.whole} + ${frac(k % 3, 3)} = ${frac(k, 3)}이` : ''}다. 1을 똑같이 3칸으로 나눈 작은 눈금으로 0에서 오른쪽으로 ${k}칸 간 점 ${names[at]}이다.`,
        facts: { truth: ks.map((v) => qcmp(Q(v, 3), valOf(r)) === 0), want: true }
      });
    }),
    T('tofrac-two-forms', '순환소수를 분수로 고친 분자와 기약분수의 분모', '심29', (d) => {
      // 원문은 순환마디가 9인 수(3.79̇)였다. 유한소수를 순환소수로 나타낸 수가 되지 않게 순환마디가 9가 아닌 수만 쓴다.
      const r = d.until(() => { const [f, k] = d.pick([[1, 1], [0, 2], [1, 2]]); return pickRep(d, { whole: [0, 3], f, k }); }, (v) => { const q = valOf(v).q; return q < repDen(v) && parts(v).A - parts(v).B >= 12; });
      const { k, A, B: Bn, den } = parts(r), v = valOf(r), nines = 10 ** k - 1;
      return M(`순환소수 ${repJ(r, '을/를')} 분수로 나타내면 ${frac(a, den)}이고, 이것을 기약분수로 나타내면 ${frac(v.p, b)}이다. 자연수 ${a}, ${b}의 값은?`, [{ label: a, answer: A - Bn }, { label: b, answer: v.q }], {
        shown: `${a} = ${A - Bn}, ${b} = ${v.q}`, explain: `${fracTold(r)} ${a} = ${A - Bn}, ${b} = ${v.q}이다.`,
        facts: { calc: [[`${Bn}*${nines}+${Number(r.cyc)}`, 0], [`${den}/((${Bn}*${nines}+${Number(r.cyc)})/${v.p})`, 1]], unseen: [Bn, nines, Number(r.cyc)] }
      });
    })
  ]);

  B.addTypes(U, 'calc', [
    T('calc-biggest', '점의 자리가 다른 순환소수의 크기 비교', '①66 심4', (d, n) => {
      // 숫자가 같아도 점의 자리가 다르면 다른 수이다. 풀어 써서 앞자리부터 견준다. 첫째는 가장 큰 수, 둘째는 유한소수가 낀 네 수를 큰 것부터 늘어놓는다.
      const [p, q, s] = d.shuffle(range(1, 8)).slice(0, 3).map(String), h = '0.';
      const open = (r) => (headOf(r) + r.cyc.repeat(6)).slice(0, 8) + '…';
      if (n === 0) {
        const rs = d.shuffle([{ whole: 0, pre: p + q, cyc: s }, { whole: 0, pre: p, cyc: q + s }, { whole: 0, pre: '', cyc: p + q + s }, { whole: 0, pre: p, cyc: q }, { whole: 0, pre: '', cyc: p + q }]), values = rs.map((r) => fl(valOf(r))), at = values.indexOf(Math.max(...values));
        return C('다음 순환소수 가운데 가장 큰 것은?', rs.map(repOf), at, {
          explain: `순환마디를 되풀이하여 풀어 쓰면 차례로 ${rs.map(open).join(', ')}이다. 소수점 아래 첫째 자리부터 차례로 견주면 가장 큰 수는 ${repOf(rs[at])}이다.`,
          facts: { rank: { values, nth: 1 } }
        });
      }
      const rs = d.shuffle([{ whole: 0, pre: p, cyc: q + s }, { text: h + p + q + s }, { whole: 0, pre: '', cyc: p + q + s }, { whole: 0, pre: p, cyc: q }]), show = (r) => (r.text ? r.text : repOf(r));
      const values = rs.map((r) => (r.text ? Number(r.text) : fl(valOf(r)))), order = [0, 1, 2, 3].sort((i, j) => values[j] - values[i]), name = (list) => list.map((i) => LABELS[i]).join(', ');
      const orders = d.shuffle([order, [order[1], order[0], order[2], order[3]], [order[0], order[1], order[3], order[2]], [order[0], order[2], order[1], order[3]]]);
      return C('다음 수를 큰 것부터 차례로 늘어놓은 것은?', orders.map(name), orders.indexOf(order), {
        figure: tagged(rs.map(show)),
        explain: `순환소수는 순환마디를 되풀이하여 풀어 쓴다. ${rs.map((r, i) => `${LABELS[i]} ${r.text ? r.text : open(r)}`).join(', ')}이다. 소수점 아래 첫째 자리부터 차례로 견주면 큰 것부터 ${name(order)}이다.`,
        facts: { choose: { exprs: rs.map((r) => (r.text ? r.text : repJs(r))), rule: 'descending', orders }, unseen: rs.filter((r) => !r.text).map(repDen) }
      });
    }, { count: 2 }),
    T('calc-reciprocal', '순환소수의 역수', '①67 심30', (d, n) => {
      // 첫째는 역수를 기약분수로, 둘째는 순환소수로 준 분수의 역수를 다시 순환소수로 나타낸다(기약분수로 고쳐야 분자와 분모가 정해진다).
      if (n === 0) {
        const r = d.until(() => { const [f, k] = d.pick([[0, 1], [0, 2], [1, 1]]); return pickRep(d, { whole: [0, 1], f, k }); }, (v) => valOf(v).p >= 2 && valOf(v).p <= 99 && valOf(v).q <= 99), v = valOf(r);
        return F(`순환소수 ${repOf(r)}의 역수를 기약분수로 나타내시오.`, v.q, v.p, {
          improper: v.q > v.p, explain: `${asFrac(r)}이다. 역수는 분자와 분모를 바꾼 ${frac(v.q, v.p)}이다.`,
          facts: { value: `1/${repJs(r)}`, unseen: repUnseen(r).concat([1]) }
        });
      }
      const [head, cyc] = d.pick([['0.', '54'], ['0.3', '6'], ['0.7', '3'], ['0.91', '6'], ['1.', '2'], ['1.8', '3']]), [whole, pre] = head.split('.'), r = { whole: Number(whole), pre, cyc }, v = valOf(r), e = expand(v.q, v.p), w = e.whole + '.';
      const right = repOf(e), rows = d.shuffle(e.pre ? [right, rep(w, e.pre + e.cyc), w + e.pre + e.cyc, rep(w + e.cyc, e.pre)] : [right, rep(w + e.cyc[0], e.cyc[1]), w + e.cyc, rep(w, e.cyc[1] + e.cyc[0])]);
      return C(`서로소인 두 자연수 ${a}, ${b}에 대하여 ${nb(frac(b, a) + ' = ' + repOf(r))}일 때, ${nb(frac(a, b) + '를')} 순환소수로 나타낸 것은?`, rows, rows.indexOf(right), {
        explain: `${asFrac(r)}이다. ${a}, ${b}는 서로소이므로 ${a} = ${v.q}, ${b} = ${v.p}이다. ${frac(a, b)} = ${frac(v.q, v.p)}이고 ${v.q} ÷ ${v.p} = ${unrollOf(e)}이므로 ${right}이다.`,
        facts: { truth: rows.map((t) => t === right), want: true }
      });
    }, { count: 2 }),
    T('calc-add', '두 순환소수의 합', '①68', (d) => {
      // 분수로 고쳐서 한 번 계산한다. 소수점 아래 숫자끼리 더하면 틀린다(0.8̇ + 0.4̇는 12/9 = 4/3).
      const [r1, r2, v] = d.until(() => {
        const shape = d.pick([[[0, 1], [0, 1]], [[0, 1], [1, 1]], [[0, 2], [0, 1]], [[1, 1], [0, 1]]]), x1 = pickRep(d, { f: shape[0][0], k: shape[0][1] }), x2 = pickRep(d, { f: shape[1][0], k: shape[1][1] });
        return [x1, x2, qadd(valOf(x1), valOf(x2))];
      }, ([, , out]) => out.q > 1 && out.q <= 99 && out.p <= 199);
      const v1 = valOf(r1), v2 = valOf(r2), L = lcm(v1.q, v2.q), n1 = v1.p * L / v1.q, n2 = v2.p * L / v2.q;
      return F(`${nb(repOf(r1) + ' + ' + repOf(r2))}${lastJ(r2.cyc, '을/를')} 계산하여 기약분수로 나타내시오.`, v.p, v.q, {
        improper: v.p > v.q,
        explain: `분수로 고쳐서 계산한다. ${asFrac(r1)}, ${asFrac(r2)}이므로 ${nb(`${frac(v1.p, v1.q)} + ${frac(v2.p, v2.q)}${v1.q === L && v2.q === L ? '' : ` = ${frac(n1, L)} + ${frac(n2, L)}`}`)} = ${nb(`${frac(n1 + n2, L)}${v.q === L ? '' : ` = ${frac(v.p, v.q)}`}`)}이다.`,
        facts: { value: `${repJs(r1)}+${repJs(r2)}`, unseen: repUnseen(r1).concat(repUnseen(r2)) }
      });
    }),
    T('calc-make-natural', '순환소수에 곱하여 자연수가 되게 하는 가장 작은 자연수', '①71 심43', (d) => {
      // 기약분수로 고친 분모의 배수를 곱해야 한다(0.7̇2̇ = 72/99 = 8/11이므로 99가 아니라 11).
      const r = d.until(() => { const [f, k] = d.pick([[0, 2], [1, 1], [1, 2], [0, 1]]); return pickRep(d, { whole: [0, 1], f, k }); }, (v) => valOf(v).q < repDen(v) && valOf(v).q >= 3 && valOf(v).q <= 110), { A, B: Bn, den } = parts(r), v = valOf(r);
      return N(`${nb(repOf(r) + ' × ' + a + '가')} 자연수가 되게 하는 가장 작은 자연수 ${a}의 값은?`, v.q, {
        explain: `${asFrac(r)}이다. ${frac(v.p, v.q)} × ${a}가 자연수가 되려면 ${a}는 기약분수의 분모 ${v.q}의 배수이어야 한다. 가장 작은 자연수는 ${v.q}이다.`,
        facts: { digit: { template: `(□*${A - Bn})%${den}<1`, lo: 1, hi: den, ask: 'min' } }
      });
    })
  ]);

  // 유리수와 소수의 관계를 말한 문장. 틀린 문장은 [글, 바로잡은 말, 함께 싣지 않을 옳은 문장]
  const third = frac(1, 3), PI = V('π');
  const REL_TRUE = ['순환소수는 모두 유리수이다.', '유한소수는 모두 유리수이다.', '정수가 아닌 유리수는 유한소수 또는 순환소수로 나타낼 수 있다.', '순환소수는 모두 분수로 나타낼 수 있다.', '유한소수는 분모가 10의 거듭제곱인 분수로 나타낼 수 있다.'];
  const REL_FALSE = [
    ['모든 유리수는 유한소수로 나타낼 수 있다.', `${third} = 0.333…은 유한소수로 나타낼 수 없다.`, REL_TRUE[2]],
    ['순환소수 가운데에는 분수로 나타낼 수 없는 것도 있다.', '순환소수는 모두 분수로 나타낼 수 있다.', REL_TRUE[3]],
    ['유한소수 가운데에는 유리수가 아닌 것도 있다.', '유한소수는 분모가 10의 거듭제곱인 분수로 나타낼 수 있으므로 모두 유리수이다.', REL_TRUE[1]],
    ['순환소수는 유리수가 아니다.', '순환소수는 분수로 나타낼 수 있으므로 유리수이다.', REL_TRUE[0]],
    ['정수가 아닌 유리수는 모두 유한소수로 나타낼 수 있다.', `${third} = 0.333…은 정수가 아닌 유리수이지만 유한소수로 나타낼 수 없다.`, REL_TRUE[2]]
  ];
  const INF_TRUE = ['순환소수는 모두 무한소수이다.', '무한소수 가운데에는 순환소수가 아닌 것도 있다.', '무한소수 가운데에는 유리수인 것도 있다.', '순환소수가 아닌 무한소수는 유리수가 아니다.', `원주율 ${PI}는 순환소수가 아닌 무한소수이다.`];
  const INF_FALSE = [
    ['무한소수는 모두 순환소수이다.', `${PI} = 3.141592…는 순환소수가 아닌 무한소수이다.`, INF_TRUE[1]],
    ['무한소수는 모두 유리수가 아니다.', `무한소수 가운데 순환소수는 유리수이다. 0.333… = ${third}이다.`, INF_TRUE[2]],
    ['무한소수는 모두 유리수이다.', `${PI} = 3.141592…는 무한소수이지만 유리수가 아니다.`, INF_TRUE[3]],
    [`원주율 ${PI}는 순환소수이다.`, `${PI} = 3.141592…에는 한없이 되풀이되는 숫자의 배열이 없다.`, INF_TRUE[4]],
    ['순환소수가 아닌 무한소수도 분수로 나타낼 수 있다.', '분수로 나타낼 수 있는 소수는 유한소수와 순환소수뿐이다.', INF_TRUE[3]]
  ];

  B.addTypes(U, 'relation', [
    T('relation-not-rational', '수 목록에서 유리수가 아닌 것 고르기', '①1', (d) => {
      // 순환소수는 점을 찍은 것도, 풀어 쓴 것도 유리수이다. 유리수가 아닌 것은 순환소수가 아닌 무한소수(π, 되풀이되는 배열이 없는 소수)뿐이다.
      const odd = d.pick([PI, d.pick(LOOSE), frac(PI, 2)]), r1 = pickRep(d, { whole: [0, 3], f: d.int(0, 1), k: d.int(1, 2) }), r2 = pickRep(d, { whole: [0, 3], k: d.int(1, 2) }), fr = pickFrac(d, [3, 4, 7, 9, 11], null, 3);
      const rows = d.shuffle([odd, MINUS + frac(fr.p, fr.q), shortDec(d), repOf(r1), unrollOf(r2)]);
      return C('다음 중 유리수가 아닌 것은?', rows, rows.indexOf(odd), {
        explain: `${odd === PI ? `${PI} = 3.141592…는 순환소수가 아닌 무한소수이므로 유리수가 아니다.` : String(odd).includes('mb-frac') ? `${PI} = 3.141592…는 순환소수가 아닌 무한소수이므로 ${PI}도, ${PI}를 2로 나눈 수도 유리수가 아니다.` : `${odd}${lastJ(odd, '은/는')} 되풀이되는 숫자의 배열이 없는, 순환소수가 아닌 무한소수이므로 유리수가 아니다.`} 유한소수와 순환소수는 모두 분수로 나타낼 수 있으므로 유리수이다.`,
        facts: { truth: rows.map((v) => v !== odd), want: false }
      });
    }),
    T('relation-rational-count', '수 목록에서 유리수의 개수 세기', '①2', (d) => {
      // 3.14는 유한소수이므로 유리수이다(π와 다르다). 순환소수도 유리수이다.
      const r1 = pickRep(d, { whole: [0, 3], f: d.int(0, 1), k: d.int(1, 2) }), r2 = pickRep(d, { whole: [0, 5], k: d.int(1, 2) }), fr = pickFrac(d, [6, 7, 9, 12, 15], null, 2), loose = d.pick(LOOSE), both = d.bool();
      const rows = d.shuffle([{ html: '3.14', ok: true }, { html: MINUS + shortDec(d), ok: true }, { html: frac(fr.p, fr.q), ok: true }, { html: repOf(r1), ok: true }, { html: PI, ok: false }].concat(both ? [{ html: loose, ok: false }] : [{ html: unrollOf(r2), ok: true }]));
      const hit = rows.filter((v) => v.ok).length;
      return N('다음 수 가운데 유리수는 모두 몇 개인가?', hit, {
        unit: '개', figure: numbers(rows.map((v) => v.html)),
        explain: `유한소수와 순환소수는 분수로 나타낼 수 있으므로 유리수이다. 3.14는 유한소수이다. ${PI} = 3.141592…${both ? `와 ${loose}${lastJ(loose, '은/는')}` : '는'} 순환소수가 아닌 무한소수이므로 유리수가 아니다. 유리수는 ${hit}개이다.`,
        facts: { count: rows.map((v) => v.ok) }
      });
    }),
    T('relation-claims', '유리수와 소수의 관계에 대한 설명의 참·거짓', '①74·75 심45', (d, n) => {
      // 첫째는 유리수·유한소수·순환소수의 관계, 둘째는 무한소수와 순환소수의 관계(무한소수라고 모두 순환소수는 아니다)를 묻는다.
      const wantTrue = d.bool();
      return n === 0
        ? claimQ(d, `유리수와 소수의 관계에 대한 설명으로 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, REL_TRUE, REL_FALSE, wantTrue)
        : claimQ(d, `무한소수와 순환소수에 대한 설명으로 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, INF_TRUE, INF_FALSE, wantTrue);
    }, { count: 2 })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
