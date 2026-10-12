// 중학교 1학년 1학기 4단원 일차방정식 — 실력 문항.
// 단원 틀과 도구, 싣는 기준, 뺀 것과 까닭은 7-1-4a.js 에 있다. ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 ①의 장치는 이 잘못을 가진 아이가 걸리게 만들었다)
//  - 문자가 든 등식은 모두 방정식이라고 여긴다(x + x = 2x, 0 × x = 0 은 항등식이다). 거짓인 등식(4 + 5 = 7)은 등식이 아니라고 여기거나 방정식으로 센다.
//    좌우가 닮은 식(3 − x = x − 3)을 항등식으로 본다. 0 × x = 0 을 「x = 0」으로 읽는다.
//  - 양변을 문자로 나누어도 된다고 여긴다(ac = bc 이면 a = b, 3x = x 의 양변을 x 로 나누기). 0일 수 있는 수로는 나눌 수 없다.
//  - 이항을 「넘기면 부호가 바뀐다」로만 외워, x의 계수를 넘기는 것(3x = 12 ⇨ x = 4)도 이항이라고 여긴다. 이항은 항을 옮기는 것이고 계수는 항이 아니다.
//  - 일차방정식이 되는 조건을 적힌 그대로의 계수에서 읽는다(ax + 2 = 5 − x 에서 a ≠ 0). 모든 항을 좌변으로 옮겨 정리한 뒤의 계수를 보아야 한다.
//    x² 의 항은 사라져야 하고 x 의 항은 남아야 한다는 두 조건을 거꾸로 댄다.
//  - 분모의 최소공배수를 곱할 때 분수가 아닌 항에는 곱하지 않는다. 분수 앞의 −를 분자의 첫 항에만 건다(−(x − 1)/2 × 6 = −3x − 3).
//  - 방정식의 해를 그대로 답한다. 미지수로 놓은 것(가운데 수, 자녀의 나이, 의자의 수, 작년 학생 수)과 묻는 것(가장 작은 수, 부모의 나이, 학생 수, 올해 학생 수)이 다를 수 있다.
//  - 해가 나오면 답이 있다고 여긴다. 개수가 자연수가 아니면 그 상황은 일어날 수 없다.
//  - 소금물에 물을 넣으면 소금도 늘거나 준다고 여긴다(소금의 양은 그대로이다). 기차가 다리를 건넌 거리를 다리의 길이로만 센다(기차의 길이를 더한다).
//    마지막 의자에 덜 앉은 것을 「모자란다」로 옮겨 b x − s 라 쓴다(b명씩 앉은 의자는 x − 1개이다).
//
// 실력에는 ① 문제의 식·말·상황에 장치가 있어 배운 뜻을 정확히 대야 풀리는 문제와 ② 두 번 넘게 생각해야 풀리는 문제(한 방정식의 해를 다른 방정식에 넣기,
// 해가 같은 두 방정식의 상수, 잘못 본 부호를 되돌려 바르게 풀기, 도중에 바뀌는 속력, 뒤따라가 만나기, 두 사람의 일의 양, 정가와 할인, 한쪽만 늘어난 수)만 실었다.
// 기본에서 하는 일을 고르기로 바꾼 것, 수만 키운 방정식, 풀이 과정의 빈칸, 여러 방정식의 해 비교, 등식의 성질 문장의 참·거짓은 기본 묶음에 있다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, frac, N, M, C } = B.kit;
  const { LAB, MINUS, GE, gcd, lcm, Q, dc, dc2, qadd, qsub, qmul, qdiv, qcmp, tx, nb, tail, lastOf, js, sup, nz, pm, ansV, claimQ } = B.kit.mid;
  const { STD3, STD4, HAN, x, va, vb, vc, iq, xu, tm, tg, tf, ts, sideH, eqH, eqB, eqF, termH, tagEq, eqProc, evS, solJ, gather, sideOf, solQ, flatS, scS, subS, solve, sameEq, follows, mix, nice } = B.kit.m714;
  // 실력 문항. 기본 자료에서만 나온 꼴은 ref 를 '기본 ①22' 처럼 적는다.
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: ref.startsWith('기본 ') ? '수집본 기본 자료(' + ref.slice(3) + ')' : '수집본 심화 자료(' + ref + ')', make }, more || {});
  const told = (L, R) => `방정식을 세우면 ${eqB(L, R)}이다. ${solve(L, R, 'x').text}`;
  const span = (minutes) => { const h = Math.floor(minutes / 60), m = minutes % 60; return { h, m, text: (h ? h + '시간' : '') + (h && m ? ' ' : '') + (m ? m + '분' : ''), q: Q(minutes, 60), js: h && m ? `(${h}+${m}/60)` : h ? String(h) : `(${m}/60)` }; };
  // 두 문자의 값을 정했을 때 x² 까지 있는 등식이 x 에 대한 일차방정식인가
  const linearAt = ([L, R], env) => {
    const at = (v) => { const e = Object.assign({ x: Q(v), X: Q(v * v) }, env); return qsub(evS(L, e), evS(R, e)); }, c = at(0), p = at(1), m = at(-1);
    return qsub(qmul(qadd(p, m), Q(1, 2)), c).p === 0 && qsub(p, m).p !== 0;
  };

  B.addGroup('7-1-4', {
    id: 'hard', title: '실력 문제', standard: STD4,
    types: [
      // ── ① 문제의 식·말·상황에 장치가 있어 뜻을 정확히 대야 풀리는 문제 ──
      H('hard-kinds', '등식·방정식·항등식이 섞인 식 목록에서 방정식과 항등식 세기', '기본 ①5 / 심3', (d, n) => {
        // 함정: 문자가 든 등식을 모두 방정식으로 세는 아이(항등식을 뺀다), 거짓인 등식을 방정식으로 세는 아이,
        //  0 × x = 0 을 x = 0 으로 읽어 방정식으로 세는 아이, 좌우가 닮은 방정식(3 − x = x − 3)을 항등식으로 세는 아이.
        const a = d.int(2, 5), b = d.int(2, 9), c = d.until(() => d.int(2, 9), (v) => v !== b), e = d.until(() => d.int(3, 15), (v) => v !== b + c);
        const kindOf = (L, R) => { const l = gather(L, 'x'), r = gather(R, 'x'); return qcmp(l.a, r.a) !== 0 ? 'eq' : qcmp(l.b, r.b) === 0 ? 'id' : 'none'; };
        const E = (L, R, h) => ({ h: h || eqH(L, R), kind: kindOf(L, R), v: solQ(L, R) });
        const ids = [E([tm(0, 'x')], [tm(0, '')], `0 <i>×</i> ${x} <i>=</i> 0`)].concat(d.shuffle([
          E(ts([a, 'x'], [-(a + b), 'x']), ts([-b, 'x'])), E([tg(a, ts([1, 'x'], [-1, '']))], ts([a, 'x'], [-a, ''])), E(ts([1, 'x'], [1, 'x']), ts([2, 'x'])), E(ts([b, ''], [-1, 'x']), ts([-1, 'x'], [b, '']))
        ]));
        const eqs = d.shuffle([E(ts([c, ''], [-1, 'x']), ts([1, 'x'], [-c, ''])), E(ts([b, ''], [-1, 'x']), ts([b, '']))]).concat(d.shuffle([
          E(ts([a + 1, 'x']), ts([1, 'x'], [c, ''])), E(ts([2, 'x']), ts([2 * c, ''])), E(ts([1, 'x'], [b, '']), ts([b, ''], [-1, 'x']))
        ]));
        const others = [{ h: `${b} <i>+</i> ${c} <i>=</i> ${e}`, kind: 'false' }].concat(d.shuffle([{ h: sideH(ts([a, 'x'], [c, ''])), kind: 'expr' }, { h: `${b + c} <i>${GE}</i> ${c}`, kind: 'ineq' }]));
        const [nId, nEq] = d.pick([[2, 2], [1, 3], [3, 1], [2, 3], [3, 2], [1, 2], [2, 1]]), rows = d.shuffle(ids.slice(0, nId).concat(eqs.slice(0, nEq), others.slice(0, 6 - nId - nEq)));
        const want = n === 0 ? 'eq' : 'id', flags = rows.map((r) => r.kind === want), k = flags.filter(Boolean).length;
        const why = (r) => (r.kind === 'id' ? `${x}에 어떤 수를 대입하여도 참인 항등식` : r.kind === 'eq' ? `${nb(`${x} = ${tx(r.v)}`)}일 때만 참인 방정식` : r.kind === 'false' ? '문자가 없는 거짓인 등식' : r.kind === 'expr' ? '등호가 없는 식' : '부등호를 사용한 식');
        return N(`다음 중 ${n === 0 ? '방정식' : `${x}에 대한 항등식`}은 모두 몇 개인가?`, k, {
          unit: '개', figure: tagEq(rows.map((r) => r.h), HAN),
          explain: `방정식은 ${x}의 값에 따라 참이 되기도 하고 거짓이 되기도 하는 등식이고, 항등식은 ${x}에 어떤 수를 대입하여도 항상 참인 등식이다. ${rows.map((r, i) => `${HAN[i]}은 ${why(r)}`).join(', ')}이다. ${n === 0 ? '방정식' : '항등식'}은 ${k}개이다.`,
          facts: { count: flags, rule: 'kinds-' + n }
        });
      }, { count: 2, standard: STD3 }),
      H('hard-prop-c', '문자를 곱하거나 문자로 나눈 등식의 참·거짓', '심6 / 기본 ①13·14', (d) => {
        // 함정: 「양변을 같은 수로 나누어도 등식은 성립한다」에서 「0이 아닌」을 빼고 외운 아이. c = 0 이면 ac = bc 여도 a 와 b 는 다를 수 있고, c 로 나눌 수도 없다.
        const k = d.int(2, 5), m = d.int(2, 9), ac = `${va}${vc}`, bc = `${vb}${vc}`;
        const yes = [
          `${nb(`${va} = ${vb}`)}이면 ${nb(`${ac} = ${bc}`)}이다.`, `${nb(`${va} = ${vb}`)}이면 ${nb(`${va} − ${vc} = ${vb} − ${vc}`)}이다.`, `${nb(`${frac(va, vc)} = ${frac(vb, vc)}`)}이면 ${nb(`${va} = ${vb}`)}이다.`,
          `${nb(`${va} + ${vc} = ${vb} + ${vc}`)}이면 ${nb(`${va} = ${vb}`)}이다.`, `${nb(`${va} = ${k}${vb}`)}이면 ${nb(`${ac} = ${k}${bc}`)}이다.`, `${nb(`${m}${va} = ${m}${vb}`)}이면 ${nb(`${va} = ${vb}`)}이다.`
        ];
        const no = [
          [`${nb(`${ac} = ${bc}`)}이면 ${nb(`${va} = ${vb}`)}이다.`, `${nb(`${vc} = 0`)}이면 ${va}와 ${vb}가 서로 달라도 ${nb(`${ac} = ${bc} = 0`)}이다. 양변을 나눌 수 있는 것은 0이 아닌 수뿐이므로 ${nb(`${vc} ≠ 0`)}일 때만 ${nb(`${va} = ${vb}`)}이다.`],
          [`${nb(`${va} = ${vb}`)}이면 ${nb(`${frac(va, vc)} = ${frac(vb, vc)}`)}이다.`, `${nb(`${vc} = 0`)}이면 0으로 나눌 수 없다. 양변을 나눌 수 있는 것은 0이 아닌 수뿐이다.`, yes[2]],
          [`${nb(`${ac} = ${k}${bc}`)}이면 ${nb(`${va} = ${k}${vb}`)}이다.`, `${nb(`${vc} = 0`)}이면 ${va}와 ${vb}가 어떤 수이든 ${nb(`${ac} = ${k}${bc} = 0`)}이다. ${nb(`${vc} ≠ 0`)}일 때만 양변을 ${vc}로 나눌 수 있다.`, yes[4]]
        ];
        return claimQ(d, `세 수 ${va}, ${vb}, ${vc}에 대하여 다음 중 옳지 않은 것은?`, yes, no, false);
      }, { standard: STD3 }),
      H('hard-divide-x', '양변을 x로 나눈 풀이의 잘못 찾기', '기본 ①22', (d) => {
        // 함정: 양변을 문자로 나누어도 된다고 여기는 아이는 「해가 없다」를 고르고, 이항을 잘못 댄 아이는 뺀 줄을 탓한다. x 가 0일 수 있으므로 x 로 나눌 수 없다.
        const [a, c] = d.until(() => [d.int(2, 9), d.int(2, 9)], ([p, q]) => p - q >= 2), b = nz(d, -9, 9), L = ts([a, 'x'], [b, '']), R = ts([c, 'x'], [b, '']);
        const right = `㉡에서 0일 수도 있는 ${x}로 양변을 나눈 것이 잘못이다. 이 방정식의 해는 ${nb(`${x} = 0`)}이다.`;
        const wrong = d.shuffle([
          `㉠에서 양변${b > 0 ? '에서 같은 수를 뺀' : '에 같은 수를 더한'} 것이 잘못이다. 이 방정식의 해는 ${nb(`${x} = ${iq(b)}`)}이다.`,
          '풀이에 잘못된 곳이 없다. 이 방정식의 해는 없다.',
          `㉡에서 양변을 ${x}가 아니라 ${a}${tail(a, '으로/로')} 나누어야 한다. 이 방정식의 해는 ${nb(`${x} = ${tx(Q(c, a))}`)}이다.`,
          `㉡에서 ${termH(c, 'x')}를 이항하지 않은 것이 잘못이다. 이 방정식의 해는 ${nb(`${x} = ${a - c}`)}이다.`
        ]).slice(0, 3), { rows, at } = mix(d, right, wrong);
        return C('다음은 방정식을 푼 과정인데, 마지막 줄이 거짓인 등식이 되었다. 이 풀이에 대한 설명으로 옳은 것은?', rows, at, {
          figure: eqProc([{ h: eqH(L, R) }, { note: `㉠ ${b > 0 ? `양변에서 ${b}${tail(b, '을/를')} 뺀다.` : `양변에 ${-b}${tail(-b, '을/를')} 더한다.`}` }, { h: eqH(ts([a, 'x']), ts([c, 'x'])) }, { note: `㉡ 양변을 ${x}로 나눈다.` }, { h: `${a} <i>=</i> ${c}` }]),
          explain: `등식의 양변을 나눌 수 있는 것은 0이 아닌 수뿐이다. ${x}는 0일 수도 있으므로 ${x}로 나누면 안 된다. ${eqB(ts([a, 'x']), ts([c, 'x']))}에서 ${termH(c, 'x')}를 이항하면 ${eqB(ts([a - c, 'x']), ts([0, '']))}이므로 ${nb(`${x} = 0`)}이다.`,
          facts: { truth: rows.map((r) => r === right && solQ(L, R).p === 0), want: true }
        });
      }, { standard: STD3 }),
      H('hard-not-move', '이항하여 고친 것이 아닌 것 찾기', '심12 / 기본 ①23', (d) => {
        // 함정: 「넘기면 바뀐다」로만 외운 아이는 x의 계수를 넘긴 것(3x = 12 ⇨ x = 4)이나 부호를 바꾼 것(−x = 7 ⇨ x = −7)도 이항으로 본다.
        //  네 줄 모두 옳게 고친 식이므로 틀린 계산을 찾아서는 풀리지 않는다.
        const u = () => d.int(2, 9), a = u(), b = u(), c = u(), e = u(), k = nz(d, -6, 6), g = d.until(u, (v) => v !== a);
        const moves = d.shuffle([
          [[ts([1, 'x'], [-b, '']), ts([c, ''])], [ts([1, 'x']), ts([c, ''], [b, ''])]], [[ts([a, 'x']), ts([c, ''], [-1, 'x'])], [ts([a, 'x'], [1, 'x']), ts([c, ''])]],
          [[ts([1, 'x'], [b, '']), ts([a, 'x'])], [ts([1, 'x'], [-a, 'x']), ts([-b, ''])]], [[ts([a, 'x'], [-b, '']), ts([g, 'x'], [e, ''])], [ts([a, 'x'], [-g, 'x']), ts([e, ''], [b, ''])]]
        ]).slice(0, 3);
        const other = d.pick([
          [[ts([a, 'x']), ts([a * k, ''])], [ts([1, 'x']), ts([k, ''])], `양변을 ${a}${tail(a, '으로/로')} 나눈 것이다. ${a}${tail(a, '은/는')} ${x}의 계수이고 항이 아니다.`],
          [[ts([Q(1, a), 'x']), ts([k, ''])], [ts([1, 'x']), ts([a * k, ''])], `양변에 ${a}${tail(a, '을/를')} 곱한 것이다.`],
          [[ts([-1, 'x']), ts([k, ''])], [ts([1, 'x']), ts([-k, ''])], '양변에 −1을 곱한 것이다. 옮긴 항이 없다.']
        ]), { rows, at } = mix(d, other, moves);
        return C('다음은 등식을 옳게 고쳐 쓴 것이다. 이항하여 고친 것이 아닌 것은?', rows.map((r) => `${eqB(r[0][0], r[0][1])} ⇨ ${eqB(r[1][0], r[1][1])}`), at, {
          explain: `이항은 등식의 한 변에 있는 항을 부호를 바꾸어 다른 변으로 옮기는 것이다. ${eqB(other[0][0], other[0][1])} ⇨ ${eqB(other[1][0], other[1][1])}${tail(Math.abs(other[1][1][0].c.p), '은/는')} ${other[2]}`,
          facts: { truth: rows.map((r) => !sameEq(r[0], r[1], ['x']) && follows(r[0], r[1], ['x'])), want: true }
        });
      }),
      H('hard-linear-cond', '일차방정식이 되기 위한 상수의 조건', '기본 ①28 / 심14·13', (d, n) => {
        if (n === 0) {
          // 함정: 적힌 그대로 x의 계수만 보고 a ≠ 0 이라 하는 아이(0을 고른다), 우변의 항을 옮기며 부호를 놓치는 아이(부호가 반대인 수를 고른다).
          const c = pm(d) * d.int(2, 5), [p, q] = d.until(() => [d.int(1, 9), d.int(1, 9)], ([s, t]) => s !== t), left = d.bool();
          const L = left ? ts([1, 'ax'], [p, '']) : ts([c, 'x'], [p, '']), R = left ? ts([q, ''], [c, 'x']) : ts([q, ''], [-1, 'ax']), bad = left ? c : -c;
          const extra = d.pick([1, -1, 2, -2, 3, -3].filter((v) => Math.abs(v) !== Math.abs(c))), values = d.shuffle([c, -c, 0, extra]);
          const coef = left ? `${va} ${c < 0 ? '+' : MINUS} ${Math.abs(c)}` : `${va} ${c < 0 ? MINUS : '+'} ${Math.abs(c)}`;
          return C(`다음 등식이 ${x}에 대한 일차방정식일 때, 상수 ${va}의 값이 될 수 없는 것은?`, values.map(iq), values.indexOf(bad), {
            figure: eqF(L, R),
            explain: `모든 항을 좌변으로 이항하여 정리하면 ${nb(`(${coef})${x} ${p - q < 0 ? MINUS : '+'} ${Math.abs(p - q)} = 0`)}이다. ${x}의 계수 ${nb(coef)}${tail(Math.abs(c), '이/가')} 0이면 ${x}의 항이 사라지므로 ${nb(`${va} ≠ ${iq(bad)}`)}이어야 한다. ${nb(`${va} = 0`)}일 때는 ${x}의 계수가 ${iq(-bad)}${tail(Math.abs(bad), '이/가')} 되어 일차방정식이다.`,
            facts: { pick: { expr: left ? `(${c})` : `-(${c})`, options: values }, rule: 'linear-cond-0' }
          });
        }
        // 함정: x² 의 항은 사라져야 하고(계수가 같다) x 의 항은 남아야 한다(계수가 다르다). 두 조건을 거꾸로 대거나 둘 다 「같다」「다르다」로 대는 아이.
        const k = d.int(2, 6), p = d.until(() => d.int(2, 9), (v) => v !== k), r = d.int(1, 9), s = d.int(1, 9), aOnSquare = d.bool();
        const E = aOnSquare ? [ts([1, 'aX'], [p, 'x'], [-r, '']), ts([k, 'X'], [1, 'bx'], [s, ''])] : [ts([k, 'X'], [1, 'ax'], [-r, '']), ts([1, 'bX'], [p, 'x'], [s, ''])];
        const av = aOnSquare ? k : p, bv = aOnSquare ? p : k;
        // 보기: a 와 b 가 저마다 그 수와 같은가(true) 다른가(false)
        const combos = d.shuffle([[true, true], [true, false], [false, true], [false, false]]), said = ([ea, eb]) => `${nb(`${va} ${ea ? '=' : '≠'} ${av}`)}, ${nb(`${vb} ${eb ? '=' : '≠'} ${bv}`)}`;
        const holds = ([ea, eb]) => linearAt(E, { a: Q(ea ? av : av + 1), b: Q(eb ? bv : bv + 1) }) && linearAt(E, { a: Q(ea ? av : av - 1), b: Q(eb ? bv : bv + 2) });
        const sq = `${x}${sup(2)}`;
        return C(`다음 등식이 ${x}에 대한 일차방정식이 되기 위한 상수 ${va}, ${vb}의 조건은?`, combos.map(said), combos.findIndex(holds), {
          figure: eqF(E[0], E[1]),
          explain: `모든 항을 좌변으로 이항하여 정리하면 ${aOnSquare ? nb(`(${va} − ${k})${sq} + (${p} − ${vb})${x} − ${r + s} = 0`) : nb(`(${k} − ${vb})${sq} + (${va} − ${p})${x} − ${r + s} = 0`)}이다. 일차방정식이 되려면 ${sq}의 항은 사라지고 ${x}의 항은 남아야 한다. ${sq}의 계수가 0이므로 ${nb(`${aOnSquare ? va : vb} = ${k}`)}이고, ${x}의 계수가 0이 아니므로 ${nb(`${aOnSquare ? vb : va} ≠ ${p}`)}이다.`,
          facts: { truth: combos.map(holds), want: true, rule: 'linear-cond-1' }
        });
      }, { count: 2 }),
      H('hard-wrong-line', '분수가 있는 방정식의 풀이에서 처음으로 잘못된 곳 찾기', '기본 ①40 / 심17·19·22', (d, n) => {
        // 함정: 첫째는 분모의 최소공배수를 분수가 아닌 항에 곱하지 않은 풀이, 둘째는 분수 앞의 −를 분자의 첫 항에만 건 풀이.
        //  잘못된 줄 뒤의 줄들은 그 줄에서 옳게 이어 계산한 것이라, 줄마다 앞줄에서 바르게 나왔는지 따져야 찾는다. 소수로 시작하는 풀이는 분수로 고치는 줄이 하나 더 있다.
        const m = d.until(() => {
          const pre = d.bool(), first = pre ? d.pick([2, 5]) : d.pick([2, 3, 4]), top = d.pick([1, 2, 3].filter((v) => gcd(v, first) === 1)), second = d.until(() => d.pick([2, 3, 4, 5]), (v) => v !== first), b = d.int(1, 5), c = nz(d, -4, 4);
          return { pre, first, top, second, b, c };
        }, (r) => { const whole = lcm(r.first, r.second), part = whole / r.second, lead = r.top * whole / r.first - part; return Math.abs(lead) >= 2 && Math.abs(r.c) * whole + part * r.b <= 60 && r.c * whole !== part * r.b && r.c !== part * r.b; });
        const { pre, first, top, second, b, c } = m, all = lcm(first, second), k = all / second;
        const fracL = [tm(Q(top, first), 'x'), tf(ts([1, 'x'], [-b, '']), second, -1)], R0 = ts([c, '']), start = [pre ? [tm(dc(10 * top / first), 'x'), fracL[1]] : fracL, R0];
        const goodMul = [scS(fracL, all), ts([c * all, ''])], goodOpen = [flatS(goodMul[0]), goodMul[1]], mul = n === 0 ? [goodMul[0], R0] : goodMul;
        const open = n === 0 ? [flatS(mul[0]), mul[1]] : [ts([top * all / first, 'x'], [-k, 'x'], [-k * b, '']), mul[1]];
        const gl = gather(open[0], 'x'), gr = gather(open[1], 'x'), coef = qsub(gl.a, gr.a), rhs = qsub(gr.b, gl.b), tidied = [ts([coef, 'x']), ts([rhs, ''])], v = qdiv(rhs, coef), last = [ts([1, 'x']), ts([v, ''])];
        const chain = (pre ? [[fracL, R0]] : []).concat([mul, open, tidied], pre ? [] : [last]);
        // 줄마다 앞줄에서 바르게 나온 식인가(계수의 비가 같은가)를 따진다.
        const fine = chain.map((row, i) => follows(i === 0 ? start : chain[i - 1], row, ['x'])), at = fine.indexOf(false), sol = solQ(fracL, R0);
        return C('다음은 일차방정식을 푸는 과정이다. ㉠~㉣ 가운데 처음으로 잘못된 곳은?', LAB.slice(0, 4), at, {
          figure: eqProc([{ h: eqH(start[0], start[1]) }].concat(chain.map((row, i) => ({ h: eqH(row[0], row[1]), mark: LAB[i] })), pre ? [{ h: eqH(last[0], last[1]) }] : [])),
          explain: n === 0 ? `${LAB[at]}에서 양변에 ${all}${tail(all, '을/를')} 곱할 때 분수가 아닌 항 ${iq(c)}에도 ${all}${tail(all, '을/를')} 곱해야 한다. 바르게 고치면 ${eqB(goodMul[0], goodMul[1])}이고, 이 방정식의 해는 ${nb(`${x} = ${tx(sol)}`)}이다.`
            : `${LAB[at]}에서 괄호를 풀 때 ${k === 1 ? '괄호 앞의 −를 괄호 안의 두 항에 모두 걸어야 한다' : `−${k}${tail(k, '을/를')} 괄호 안의 두 항에 모두 곱해야 한다`}. ${nb(`(−${k}) × (−${b}) = +${k * b}`)}이므로 바르게 고치면 ${eqB(goodOpen[0], goodOpen[1])}이고, 이 방정식의 해는 ${nb(`${x} = ${tx(sol)}`)}이다.`,
          facts: { truth: fine.map((ok) => !ok), want: true, rule: 'wrong-line-' + n }
        });
      }, { count: 2 }),
      H('hard-consecutive', '연속하는 세 수 가운데 묻는 수가 미지수와 다른 문제', '심32 / 기본 ①56', (d) => {
        // 함정: 가운데 수를 x 로 놓고 푼 해를 그대로 답하는 아이. 묻는 것은 가장 작은 수이다.
        const kind = d.pick([{ word: '홀수', g: 2, odd: 1 }, { word: '짝수', g: 2, odd: 0 }, { word: '자연수', g: 1, odd: 0 }]), g = kind.g, m = d.int(3, 4);
        const mid = g === 1 ? d.int(6, 30) : 2 * d.int(4, 20) + kind.odd, k = (m - 2) * mid + g * (m + 1), L = [tg(m, ts([1, 'x'], [g, '']))], R = [tg(1, ts([1, 'x'], [-g, ''])), tm(1, 'x'), tm(k, '')];
        return N(`연속하는 세 ${kind.word}가 있다. 가장 큰 수의 ${m}배는 나머지 두 수의 합보다 ${k}만큼 크다. 세 수 가운데 가장 작은 수는?`, mid - g, {
          explain: `연속하는 ${kind.word}는 ${g}씩 커진다. 가운데 수를 ${x}라 하면 세 수는 ${nb(`${x} − ${g}`)}, ${x}, ${nb(`${x} + ${g}`)}이다. ${told(L, R)} ${nb(`${x} = ${mid}`)}${tail(mid, '은/는')} 가운데 수이므로 가장 작은 수는 ${nb(`${mid} − ${g} = ${mid - g}`)}이다.`,
          facts: { value: `(${k}-${g}*(${m}+1))/(${m}-2)-${g}`, unseen: [1, 2] }
        });
      }),
      H('hard-age', '나이의 합과 몇 년 후의 배로 나이 구하기', '기본 ①59 / 심34', (d) => {
        // 함정: 두 사람의 나이를 한 문자로 나타내야 하고(합에서 뺀다), 몇 년 후에는 두 사람 모두 나이를 먹는다. 구한 해는 자녀의 나이이고 묻는 것은 부모의 나이이다.
        const m = d.until(() => { const k = d.int(2, 3), child = d.int(8, 16), after = d.int(4, 15); return { k, child, after, parent: k * (child + after) - after }; }, (r) => r.parent >= 36 && r.parent <= 55 && r.parent - r.child >= 24);
        const [who, kid] = d.pick([['아버지', '아들'], ['어머니', '딸'], ['아버지', '딸'], ['어머니', '아들']]), { k, child, after, parent } = m, sum = parent + child;
        const L = [tg(1, ts([sum, ''], [-1, 'x'])), tm(after, '')], R = [tg(k, ts([1, 'x'], [after, '']))];
        return N(`올해 ${josa(who, '과/와')} ${kid}의 나이의 합은 ${sum}살이다. ${after}년 후에 ${who}의 나이가 ${kid}의 나이의 ${k}배가 된다고 할 때, 올해 ${who}의 나이는 몇 살인가?`, parent, {
          unit: '살',
          explain: `올해 ${kid}의 나이를 ${x}살이라 하면 올해 ${who}의 나이는 ${nb(`(${sum} − ${x})`)}살이다. ${after}년 후에는 두 사람 모두 ${after}살씩 많아진다. ${told(L, R)} ${nb(`${x} = ${child}`)}${tail(child, '은/는')} ${kid}의 나이이므로 ${who}의 나이는 ${nb(`${sum} − ${child} = ${parent}`)}(살)이다.`,
          facts: { value: `${sum}-(${sum}+${after}-${k}*${after})/(${k}+1)`, unseen: [1] }
        });
      }),
      H('hard-fit', '구한 해가 문제의 상황에 맞는지 확인하기', '기본 ①60·73', (d) => {
        // 함정: 방정식의 해가 나오면 답이 있다고 여기는 아이. 개수는 자연수이어야 하고 합한 개수를 넘을 수 없다.
        //  값의 합이 될 수 있는 금액 셋과 될 수 없는 금액 하나(해가 분수이거나 합한 개수보다 크다)를 섞는다. 금액의 크기 차례로는 가릴 수 없다.
        const p = 100 * d.int(6, 9), q = d.until(() => 100 * d.int(3, 5), (v) => (p - v) % 200 === 0), count = d.int(8, 12), gap = p - q, bill = (k) => q * count + gap * k;
        const over = d.bool(), ks = d.shuffle(Array.from({ length: count - 3 }, (_, i) => i + 2)).slice(0, 3), odd = over ? bill(count + d.int(1, 2)) : bill(d.int(2, count - 3)) + gap / 2;
        const totals = d.shuffle(ks.map(bill).concat([odd])), can = (t) => Array.from({ length: count - 1 }, (_, i) => i + 1).some((v) => p * v + q * (count - v) === t);
        const E = (t) => [[tm(p, 'x'), tg(q, ts([count, ''], [-1, 'x']))], ts([t, ''])], sol = solQ(E(odd)[0], E(odd)[1]);
        return C(`한 개에 ${p}원인 빵과 한 개에 ${q}원인 우유를 합하여 ${count}개 사려고 한다. 다음 중 빵과 우유의 값의 합이 될 수 없는 것은?`, totals.map((t) => `${t}원`), totals.indexOf(odd), {
          explain: `빵을 ${x}개 산다고 하면 우유는 ${nb(`(${count} − ${x})`)}개이다. 값의 합이 ${odd}원이면 ${eqB(E(odd)[0], E(odd)[1])}에서 ${nb(`${x} = ${tx(sol)}`)}이다. ${over ? `빵의 개수는 합한 개수 ${count}보다 클 수 없으므로` : '빵의 개수는 자연수이어야 하므로'} 이런 경우는 없다. 나머지 금액은 빵을 차례로 ${totals.filter((t) => t !== odd).map((t) => tx(solQ(E(t)[0], E(t)[1])) + '개').join(', ')} 살 때의 값이다. 방정식을 푼 뒤에는 구한 해가 문제의 상황에 맞는지 확인해야 한다.`,
          facts: { truth: totals.map((t) => !can(t)), want: true }
        });
      }),
      H('hard-salt', '소금물에 물을 더 넣어 농도 맞추기', '기본 ①77', (d) => {
        // 함정: 물을 넣으면 소금의 양도 달라진다고 여기거나 농도의 차만큼 물을 넣는 아이. 물을 더 넣어도 소금의 양은 그대로이다.
        const m = d.until(() => { const q = d.pick([2, 3, 4, 5, 6, 8]), p = q + d.int(1, 6), w = 100 * d.int(1, 6); return { p, q, w, v: w * (p - q) / q }; }, (r) => Number.isInteger(r.v) && r.v % 10 === 0 && r.v <= 900 && r.p <= 12);
        const { p, q, w, v } = m, salt = p * w / 100, L = ts([salt, '']), R = [tg(dc2(q), ts([w, ''], [1, 'x']))];
        return N(`${p} %의 소금물 ${w} g에 물을 더 넣어 ${q} %의 소금물을 만들려고 한다. 더 넣어야 하는 물의 양은 몇 g인가?`, v, {
          unit: 'g',
          explain: `물을 더 넣어도 소금의 양은 변하지 않는다. ${p} %의 소금물 ${w} g에 든 소금의 양은 ${nb(`${frac(p, 100)} × ${w} = ${salt}`)}(g)이다. 물을 ${xu('g')} 더 넣으면 소금물의 양은 ${nb(`(${w} + ${x})`)} g이고 그 ${q} %가 소금이다. ${told(L, R)}`,
          facts: { value: `${w}*${p}/${q}-${w}` }
        });
      }),
      H('hard-train', '기차가 다리와 터널을 완전히 지나는 데 걸리는 시간으로 기차의 길이 구하기', '기본 ①74 / 심46', (d) => {
        // 함정: 지나간 거리를 다리의 길이로만 세는 아이. 기차가 완전히 지나려면 다리(터널)의 길이에 기차의 길이를 더한 거리를 달려야 한다.
        const m = d.until(() => { const [t1, t2] = d.pick([[30, 20], [40, 30], [50, 40], [60, 40], [45, 30], [36, 24], [20, 15], [25, 20]]), speed = d.pick([20, 25, 30, 40]), v = 10 * d.int(8, 30); return { t1, t2, v, a: speed * t1 - v, b: speed * t2 - v }; }, (r) => r.b >= 200 && r.a <= 2400);
        const { t1, t2, v, a, b } = m, L = [tf(ts([a, ''], [1, 'x']), t1, 1)], R = [tf(ts([b, ''], [1, 'x']), t2, 1)];
        return N(`일정한 속력으로 달리는 기차가 길이가 ${a} m인 다리를 완전히 건너는 데 ${t1}초가 걸리고, 길이가 ${b} m인 터널을 완전히 통과하는 데 ${t2}초가 걸린다. 이 기차의 길이는 몇 m인가?`, v, {
          unit: 'm',
          explain: `기차가 다리를 완전히 건너려면 다리의 길이에 기차의 길이를 더한 거리를 달려야 한다. 기차의 길이를 ${xu('m')}라 하면 다리를 건널 때 달린 거리는 ${nb(`(${a} + ${x})`)} m, 터널을 통과할 때 달린 거리는 ${nb(`(${b} + ${x})`)} m이다. 속력은 (거리) ÷ (시간)이고 두 속력이 같으므로 ${told(L, R)}`,
          facts: { value: `(${a}*${t2}-${b}*${t1})/(${t1}-${t2})` }
        });
      }),
      H('hard-last-seat', '마지막 의자가 덜 차는 과부족', '기본 ①67 / 심38', (d, n) => {
        // 함정: 「마지막 의자에 s명만 앉는다」를 「b명씩 앉으면 모자란다」로 옮겨 bx − s 로 쓰는 아이. b명씩 앉은 의자는 마지막 의자를 뺀 (x − 1)개이고 거기에 s명을 더한다.
        //  둘째는 빈 의자까지 남는다: b명씩 앉은 의자는 빈 의자와 마지막 의자를 뺀 개수이다. 구한 해는 의자의 수이고 묻는 것은 학생의 수이다.
        const m = d.until(() => { const a = d.int(4, 6), b = a + d.int(1, 3), v = d.int(6, 16), s = d.int(1, b - 1), e = n === 0 ? 0 : d.int(1, 2); return { a, b, v, s, e, r: (b - a) * v - b * (1 + e) + s }; }, (r) => r.r >= 1 && r.r <= 15 && r.r !== r.s);
        const { a, b, v, s, e, r } = m, students = a * v + r, L = ts([a, 'x'], [r, '']), R = [tg(b, ts([1, 'x'], [-(1 + e), ''])), tm(s, '')];
        return N(`학생들이 긴 의자에 앉으려고 한다. 한 의자에 ${a}명씩 앉으면 ${r}명이 앉지 못하고, 한 의자에 ${b}명씩 앉으면 마지막 의자에는 ${s}명만 앉게 되${e ? `고 빈 의자가 ${e}개 남는다` : '며 빈 의자는 없다'}. 학생은 모두 몇 명인가?`, students, {
          unit: '명',
          explain: `의자의 수를 ${x}라 하면 ${a}명씩 앉을 때 학생의 수는 ${nb(sideH(L, true))}이다. ${b}명씩 앉으면 ${e ? `빈 의자 ${e}개와 마지막 의자를 뺀 ` : '마지막 의자를 뺀 '}${nb(`(${x} − ${1 + e})`)}개의 의자에는 ${b}명씩 앉고 마지막 의자에 ${s}명이 앉으므로 학생의 수는 ${nb(sideH(R, true))}이다. ${told(L, R)} 의자가 ${v}개이므로 학생의 수는 ${nb(`${a} × ${v} + ${r} = ${students}`)}이다.`,
          facts: { value: n === 0 ? `${a}*(${r}+${b}-${s})/(${b}-${a})+${r}` : `${a}*(${r}+${b}*(1+${e})-${s})/(${b}-${a})+${r}`, unseen: [1], rule: 'last-seat-' + n }
        });
      }, { count: 2 }),

      // ── ② 두 번 넘게 생각해야 풀리는 문제 ──
      H('hard-chain', '한 방정식의 해를 다른 방정식에 넣어 풀기', '기본 ①43 / 심20·21', (d, n) => {
        const u = () => d.int(1, 9);
        if (n === 0) {
          // ㉮를 풀어 얻은 해가 ㉯의 상수이다.
          const m = d.until(() => {
            const first = [ts([d.int(2, 7), 'x'], [nz(d, -12, 12), '']), ts([d.int(1, 6), 'x'], [nz(d, -12, 12), ''])];
            const second = d.bool() ? [ts([Q(1, d.int(2, 6)), 'x'], [1, 'a']), ts([nz(d, -6, 6), ''])] : [ts([1, 'ax'], [-u(), '']), ts([d.int(1, 5), 'x'], [u(), ''])];
            return { first, second };
          }, (r) => { const a = solQ(r.first[0], r.first[1]); return nice(a, 'int') && Math.abs(a.p) <= 9 && nice(solQ(r.second[0], r.second[1], 'x', { a }), 'int'); });
          const a = solQ(m.first[0], m.first[1]), Ls = subS(m.second[0], 'a', a), Rs = subS(m.second[1], 'a', a), s = solve(Ls, Rs, 'x');
          return ansV(`방정식 ㉮의 해가 ${nb(`${x} = ${va}`)}일 때, ${x}에 대한 방정식 ㉯를 풀어 ${x}의 값을 구하시오.`, s.v, 'int', {
            figure: tagEq([eqH(m.first[0], m.first[1]), eqH(m.second[0], m.second[1])], ['㉮', '㉯']),
            explain: `㉮에서 ${solve(m.first[0], m.first[1], 'x').text} 따라서 ${nb(`${va} = ${tx(a)}`)}이다. ㉯에 ${nb(`${va} = ${tx(a)}`)}${tail(lastOf(a), '을/를')} 대입하면 ${eqB(Ls, Rs)}이다. ${s.text}`,
            facts: { value: solJ(m.second[0], m.second[1], 'x', { a: `(${solJ(m.first[0], m.first[1], 'x', {})})` }), unseen: [0, 1], rule: 'chain-0' }
          });
        }
        // ㉮의 해가 주어져 상수를 구하고, 그 상수로 ㉯를 푼다.
        const m = d.until(() => {
          const first = d.bool() ? [ts([1, 'ax'], [u(), '']), ts([d.int(2, 5), 'x'], [-u(), ''])] : [[tg(d.int(2, 4), ts([1, 'x'], [-1, 'a']))], ts([1, 'x'], [nz(d, -9, 9), ''])];
          const second = d.bool() ? [[tg(dc(d.pick([2, 4, 6])), ts([1, 'x'], [-1, 'a']))], ts([dc(d.pick([1, 3, 5, 7])), 'x'], [nz(d, -3, 3), ''])] : [[tg(d.int(2, 4), ts([1, 'x'], [1, 'a']))], ts([d.int(5, 9), 'x'], [nz(d, -9, 9), ''])];
          return { first, second, v: nz(d, -4, 5) };
        }, (r) => { const a = solQ(subS(r.first[0], 'x', Q(r.v)), subS(r.first[1], 'x', Q(r.v)), 'a'); return nice(a, 'int') && Math.abs(a.p) <= 9 && Boolean(solQ(r.first[0], r.first[1], 'x', { a })) && nice(solQ(r.second[0], r.second[1], 'x', { a }), 'int'); });
        const L1 = subS(m.first[0], 'x', Q(m.v)), R1 = subS(m.first[1], 'x', Q(m.v)), s1 = solve(L1, R1, 'a'), a = s1.v, Ls = subS(m.second[0], 'a', a), Rs = subS(m.second[1], 'a', a), s = solve(Ls, Rs, 'x');
        return ansV(`${x}에 대한 방정식 ㉮의 해가 ${nb(`${x} = ${iq(m.v)}`)}일 때, ${x}에 대한 방정식 ㉯를 풀어 ${x}의 값을 구하시오.`, s.v, 'int', {
          figure: tagEq([eqH(m.first[0], m.first[1]), eqH(m.second[0], m.second[1])], ['㉮', '㉯']),
          explain: `㉮에 ${nb(`${x} = ${iq(m.v)}`)}${tail(Math.abs(m.v), '을/를')} 대입하면 ${eqB(L1, R1)}이다. ${s1.text} ㉯에 ${nb(`${va} = ${tx(a)}`)}${tail(lastOf(a), '을/를')} 대입하면 ${eqB(Ls, Rs)}이다. ${s.text}`,
          facts: { value: solJ(m.second[0], m.second[1], 'x', { a: `(${solJ(m.first[0], m.first[1], 'a', { x: js(Q(m.v)) })})` }), unseen: [0, 1], rule: 'chain-1' }
        });
      }, { count: 2 }),
      H('hard-same-sol', '해가 같은(몇 배인) 두 방정식의 상수', '기본 ①48·50 / 심22', (d, n) => {
        // 첫째는 두 방정식의 해가 같고, 둘째는 한 방정식의 해가 다른 방정식의 해의 몇 배이다.
        const u = () => d.int(1, 9), times = n === 0 ? 1 : d.int(2, 3);
        const m = d.until(() => {
          const first = n === 0 ? [ts([d.int(2, 7), 'x'], [nz(d, -12, 12), '']), ts([d.int(1, 6), 'x'], [nz(d, -12, 12), ''])] : [[tg(d.int(2, 4), ts([1, 'x'], [nz(d, -6, 6), '']))], ts([d.int(1, 6), 'x'], [nz(d, -9, 9), ''])];
          const second = (n === 0 ? d.pick([
            () => [ts([1, 'ax'], [-u(), '']), ts([u(), ''], [-d.int(1, 4), 'x'])],
            () => [[tf(ts([1, 'x'], [1, 'a']), d.int(2, 4), 1)], ts([1, 'x'], [-d.int(1, 5), ''])]
          ]) : () => [ts([d.int(2, 5), 'x'], [1, 'a']), [tg(d.int(2, 3), ts([1, 'a'], [-1, 'x']))]])();
          return { first, second };
        }, (r) => {
          const v = solQ(r.first[0], r.first[1]); if (!nice(v, 'int') || Math.abs(v.p * times) > 12) return false;
          const at = Q(v.p * times), a = solQ(subS(r.second[0], 'x', at), subS(r.second[1], 'x', at), 'a');
          return nice(a, 'int') && Boolean(solQ(r.second[0], r.second[1], 'x', { a }));
        });
        const v = solQ(m.first[0], m.first[1]), at = Q(v.p * times), Ls = subS(m.second[0], 'x', at), Rs = subS(m.second[1], 'x', at), s = solve(Ls, Rs, 'a'), first = solJ(m.first[0], m.first[1], 'x', {});
        return ansV(n === 0 ? `${x}에 대한 두 방정식 ㉮, ㉯의 해가 서로 같을 때, 상수 ${va}의 값은?` : `${x}에 대한 방정식 ㉯의 해가 방정식 ㉮의 해의 ${times}배일 때, 상수 ${va}의 값은?`, s.v, 'int', {
          figure: tagEq([eqH(m.first[0], m.first[1]), eqH(m.second[0], m.second[1])], ['㉮', '㉯']),
          explain: `${va}가 없는 ㉮를 먼저 푼다. ㉮에서 ${solve(m.first[0], m.first[1], 'x').text} ${n === 0 ? `㉯의 해도 ${nb(`${x} = ${tx(v)}`)}이므로` : `㉯의 해는 그 ${times}배인 ${nb(`${x} = ${tx(at)}`)}이므로`} ㉯에 대입하면 ${eqB(Ls, Rs)}이다. ${s.text}`,
          facts: { value: solJ(m.second[0], m.second[1], 'a', { x: n === 0 ? `(${first})` : `(${times}*(${first}))` }), unseen: [0, 1], rule: 'same-sol-' + n }
        });
      }, { count: 2 }),
      H('hard-wrong-sign', '상수의 부호를 잘못 보고 푼 해에서 바른 해 구하기', '기본 ①53', (d) => {
        const m = d.until(() => {
          const withParen = d.bool(), a = nz(d, -9, 9);
          const L = withParen ? [tg(d.int(2, 4), ts([d.int(1, 3), 'x'], [-d.int(1, 6), ''])), tm(d.int(1, 9), '')] : ts([d.int(3, 8), 'x'], [nz(d, -9, 9), '']);
          return { L, a, R: ts([1, 'a'], [d.int(1, 2), 'x']) };
        }, (r) => { const right = solQ(r.L, r.R, 'x', { a: Q(r.a) }), wrong = solQ(r.L, r.R, 'x', { a: Q(-r.a) }); return nice(right, 'int') && nice(wrong, 'int'); });
        const Rw = m.R.map((t) => (t.vs === 'a' ? tm(-1, 'a') : t)), wrong = solQ(m.L, m.R, 'x', { a: Q(-m.a) }), Lsub = subS(m.L, 'x', wrong), Rsub = subS(Rw, 'x', wrong), s1 = solve(Lsub, Rsub, 'a');
        const Ls = subS(m.L, 'a', s1.v), Rs = subS(m.R, 'a', s1.v), s = solve(Ls, Rs, 'x');
        return ansV(`다음 ${x}에 대한 방정식을 푸는데, 우변의 상수 ${va}의 부호를 반대로 보고 풀어서 ${nb(`${x} = ${tx(wrong)}`)}${tail(lastOf(wrong), '을/를')} 해로 얻었다. 이 방정식을 바르게 풀어 ${x}의 값을 구하시오.`, s.v, 'int', {
          figure: eqF(m.L, m.R),
          explain: `부호를 반대로 보고 푼 방정식은 ${eqB(m.L, Rw)}이다. 이 방정식에 ${nb(`${x} = ${tx(wrong)}`)}${tail(lastOf(wrong), '을/를')} 대입하면 ${eqB(Lsub, Rsub)}이다. ${s1.text} 처음 방정식에 ${nb(`${va} = ${tx(s1.v)}`)}${tail(lastOf(s1.v), '을/를')} 대입하면 ${eqB(Ls, Rs)}이다. ${s.text}`,
          facts: { value: solJ(m.L, m.R, 'x', { a: `(${solJ(m.L, Rw, 'a', { x: js(wrong) })})` }), unseen: [0, 1] }
        });
      }),
      H('hard-speed-change', '도중에 속력을 바꾸어 간 거리', '기본 ①72 / 심44', (d) => {
        const m = d.until(() => { const u = d.pick([3, 4]), w = d.pick([6, 8, 9, 12]), run = d.int(2, 9), walk = d.int(1, 8); return { u, w, run, walk, min: 60 * walk / u + 60 * run / w }; }, (r) => Number.isInteger(r.min) && r.min % 5 === 0 && r.min <= 240 && r.w > r.u);
        const { u, w, run, walk } = m, all = run + walk, t = span(m.min), L = [tf(ts([all, ''], [-1, 'x']), u, 1), tm(Q(1, w), 'x')], R = ts([t.q, '']);
        return N(`집에서 ${all} km 떨어진 공원까지 가는데, 처음에는 시속 ${u} km로 걷다가 도중에 시속 ${w} km로 달려서 모두 ${t.text}이 걸렸다. 달린 거리는 몇 km인가?`, run, {
          unit: 'km',
          explain: `달린 거리를 ${xu('km')}라 하면 걸은 거리는 ${nb(`(${all} − ${x})`)} km이다. 걸은 시간은 ${frac(`${all} − ${x}`, u)}시간, 달린 시간은 ${frac(x, w)}시간이다. ${t.m ? `${t.text}은 ${tx(t.q)}시간이므로 ` : ''}${told(L, R)}`,
          facts: { value: `(${all}/${u}-${t.js})/(1/${u}-1/${w})`, unseen: [60, 1] }
        });
      }),
      H('hard-chase', '뒤따라가 만나는 시간과 곳', '기본 ①73 / 심45', (d) => {
        const m = d.until(() => { const a = d.pick([50, 60, 70, 80]), b = a + d.pick([20, 30, 40, 50, 60]), t = d.pick([5, 6, 8, 10, 12, 15]); return { a, b, t, v: a * t / (b - a) }; }, (r) => Number.isInteger(r.v) && r.v >= 5 && r.v <= 40 && r.v !== r.t);
        const { a, b, t, v } = m, L = [tg(a, ts([1, 'x'], [t, '']))], R = ts([b, 'x']);
        return M(`동생이 집을 떠난 지 ${t}분 후에 형이 같은 길을 따라 동생을 뒤따라갔다. 동생은 분속 ${a} m로 걷고 형은 분속 ${b} m로 달릴 때, 형은 집을 떠난 지 몇 분 후에, 집에서 몇 m 떨어진 곳에서 동생을 만나는가?`, [{ label: '시간', answer: v, unit: '분 후' }, { label: '거리', answer: b * v, unit: 'm' }], {
          explain: `형이 집을 떠난 지 ${x}분 후에 만난다고 하면 동생이 걸은 시간은 ${nb(`(${x} + ${t})`)}분이다. 두 사람이 만날 때까지 간 거리는 같으므로 ${told(L, R)} 만나는 곳은 집에서 ${nb(`${b} × ${v} = ${b * v}`)}(m) 떨어진 곳이다.`,
          facts: { calc: [[`${a}*${t}/(${b}-${a})`, 0], [`${b}*${a}*${t}/(${b}-${a})`, 1]] }
        });
      }),
      H('hard-work', '두 사람이 하는 일의 양', '기본 ①75 / 심49·50', (d, n) => {
        // 첫째는 한 사람이 하다가 다른 사람이 이어서 하고, 둘째는 한 사람이 혼자 한 뒤 두 사람이 함께 한다. 전체 일의 양을 1로 놓는다.
        const [p1, p2] = d.shuffle(NAMES).slice(0, 2);
        if (n === 0) {
          const m = d.until(() => { const p = d.pick([6, 8, 9, 10, 12, 15]), q = d.pick([8, 10, 12, 15, 16, 18, 20]), a = d.int(2, p - 2); return { p, q, a, v: q * (p - a) / p }; }, (r) => r.p !== r.q && Number.isInteger(r.v) && r.v !== r.a);
          const { p, q, a, v } = m, L = ts([Q(a, p), ''], [Q(1, q), 'x']), R = ts([1, '']);
          return N(`어떤 일을 혼자서 끝내는 데 ${name(p1, '은/는')} ${p}시간, ${name(p2, '은/는')} ${q}시간이 걸린다. 이 일을 ${name(p1, '이/가')} 혼자 ${a}시간 동안 한 뒤, 나머지를 ${name(p2, '이/가')} 혼자 하여 끝냈다. ${name(p2, '이/가')} 일한 시간은 몇 시간인가?`, v, {
            unit: '시간',
            explain: `전체 일의 양을 1이라 하면 한 시간에 하는 일의 양은 ${name(p1, '이/가')} ${frac(1, p)}, ${name(p2, '이/가')} ${frac(1, q)}이다. ${name(p1, '이/가')} ${a}시간 동안 한 일의 양은 ${tx(Q(a, p))}이고, ${name(p2, '이/가')} ${x}시간 동안 한 일의 양은 ${frac(x, q)}이다. 두 사람이 한 일의 양의 합이 1이므로 ${told(L, R)}`,
            facts: { value: `${q}*(${p}-${a})/${p}`, rule: 'work-0' }
          });
        }
        const m = d.until(() => { const p = d.pick([6, 9, 10, 12, 15, 18, 20]), q = d.pick([9, 12, 15, 18, 20, 24, 30]), a = d.int(2, 9); return { p, q, a, v: p * (q - a) / (p + q) }; }, (r) => r.p !== r.q && r.a < r.q - 2 && Number.isInteger(r.v) && r.v >= 2 && r.v !== r.a);
        const { p, q, a, v } = m, L = ts([Q(a, q), ''], [Q(1, p), 'x'], [Q(1, q), 'x']), R = ts([1, '']);
        return N(`어떤 일을 혼자서 끝내는 데 ${name(p1, '은/는')} ${p}일, ${name(p2, '은/는')} ${q}일이 걸린다. 이 일을 ${name(p2, '이/가')} 혼자 ${a}일 동안 한 뒤, 나머지를 두 사람이 함께 하여 끝냈다. 두 사람이 함께 일한 날은 며칠인가?`, v, {
          unit: '일',
          explain: `전체 일의 양을 1이라 하면 하루에 하는 일의 양은 ${name(p1, '이/가')} ${frac(1, p)}, ${name(p2, '이/가')} ${frac(1, q)}이다. ${name(p2, '이/가')} 혼자 ${a}일 동안 한 일의 양은 ${tx(Q(a, q))}이고, 두 사람이 함께 ${x}일 동안 한 일의 양은 ${nb(`${frac(x, p)} + ${frac(x, q)}`)}이다. 한 일의 양의 합이 1이므로 ${told(L, R)}`,
          facts: { value: `${p}*(${q}-${a})/(${p}+${q})`, rule: 'work-1' }
        });
      }, { count: 2 }),
      H('hard-price', '이익을 붙인 정가에서 할인하여 판 물건의 원가', '기본 ①78', (d) => {
        const m = d.until(() => { const rate = d.pick([20, 25, 30, 40, 50]), cost = 100 * d.int(20, 90), off = 100 * d.int(2, 15); return { rate, cost, off, gain: cost * rate / 100 - off }; }, (r) => Number.isInteger(r.gain) && r.gain >= 200 && r.gain % 100 === 0 && r.gain !== r.off);
        const { rate, cost, off, gain } = m, up = rate % 10 === 0 ? dc(10 + rate / 10) : dc2(100 + rate), L = [tm(up, 'x'), tm(-off, '')], R = ts([1, 'x'], [gain, '']);
        return N(`어떤 물건의 원가에 ${rate} %의 이익을 붙여 정가를 정하였다. 이 물건을 정가에서 ${off}원 할인하여 팔았더니 ${gain}원의 이익이 생겼다. 이 물건의 원가는 얼마인가?`, cost, {
          unit: '원',
          explain: `원가를 ${x}원이라 하면 정가는 ${nb(sideH([tm(up, 'x')], true))}원이고, 판 값은 ${nb(`(${sideH(L, true)})`)}원이다. 판 값은 원가에 이익을 더한 것과 같으므로 ${told(L, R)}`,
          facts: { value: `(${off}+${gain})*100/${rate}`, unseen: [100] }
        });
      }),
      H('hard-increase', '한쪽만 늘어난 학생 수', '심41', (d) => {
        // 구한 해는 작년 남학생의 수이고 묻는 것은 올해 남학생의 수이다.
        const m = d.until(() => { const p = d.pick([4, 5, 8, 10]), q = d.pick([2, 4, 5]), inc = d.int(8, 40); return { p, q, inc, boys: inc * 100 / p, all: inc * 100 / q }; }, (r) => r.q < r.p && Number.isInteger(r.boys) && Number.isInteger(r.all) && r.all <= 1500 && r.all - r.boys >= 100);
        const { p, q, inc, boys, all } = m, L = ts([p % 10 === 0 ? dc(p / 10) : dc2(p), 'x']), R = ts([inc, '']);
        return N(`어느 중학교의 작년 전체 학생은 ${all}명이었다. 올해는 작년보다 남학생의 수만 ${p} % 늘고 여학생의 수는 그대로여서 전체 학생의 수가 ${q} % 늘었다. 올해 남학생은 몇 명인가?`, boys + inc, {
          unit: '명',
          explain: `늘어난 전체 학생의 수는 ${nb(`${all} × ${frac(q, 100)} = ${inc}`)}이고, 여학생의 수는 그대로이므로 이것은 늘어난 남학생의 수와 같다. 작년 남학생의 수를 ${x}라 하면 늘어난 남학생의 수는 ${nb(sideH(L, true))}이다. ${told(L, R)} 작년 남학생이 ${boys}명이므로 올해 남학생은 ${nb(`${boys} + ${inc} = ${boys + inc}`)}(명)이다.`,
          facts: { value: `${all}*${q}/${p}*(100+${p})/100`, unseen: [100] }
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
