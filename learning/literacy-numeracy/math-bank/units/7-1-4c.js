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
// 2026-10-13: 처음 지을 때 「꼬였다」「지나치게 복잡한 활용이다」「범위 밖이다」로 뺐던 꼴 가운데 중1까지의 내용만으로 풀리는 것을 묶음 끝에 다시 실었다(hard-three-eq 부터).
//  그 유형들이 겨누는 잘못: 「해의 절댓값이 같다」를 「해가 같다」로만 읽는다. 0을 자연수나 음의 정수로 센다. 「해가 무수히 많다」를 x = 0 으로 적거나 일차방정식이 되는 조건과 섞는다.
//  둘째로 준 것이 「남은 것」의 몇 분의 몇임을 놓친다. 두 소금물의 농도를 그냥 더하거나 평균을 낸다. 할인은 정가에, 이익은 원가에 건다는 것을 섞는다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, frac, N, M, C, F } = B.kit;
  const { LAB, MINUS, GE, gcd, lcm, Q, dc, dc2, qadd, qsub, qmul, qdiv, qneg, qcmp, tx, nb, tail, lastOf, js, V, sup, nz, pm, ansV, claimQ } = B.kit.mid;
  const { STD3, STD4, HAN, x, va, vb, vc, iq, xu, tm, tg, tf, ts, sideH, eqH, exq, keep, eqB, eqF, termH, tagEq, eqProc, evS, solJ, gather, sideOf, solQ, flatS, scS, subS, solve, sameEq, follows, valsQ, mix, nice } = B.kit.m714;
  // 실력 문항. 기본 자료에서만 나온 꼴은 ref 를 '기본 ①22' 처럼 적는다.
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: ref.startsWith('기본 ') ? '수집본 기본 자료(' + ref.slice(3) + ')' : '수집본 심화 자료(' + ref + ')', make }, more || {});
  const told = (L, R) => `방정식을 세우면 ${eqB(L, R)}이다. ${solve(L, R, 'x').text}`;
  const span = (minutes) => { const h = Math.floor(minutes / 60), m = minutes % 60; return { h, m, text: (h ? h + '시간' : '') + (h && m ? ' ' : '') + (m ? m + '분' : ''), q: Q(minutes, 60), js: h && m ? `(${h}+${m}/60)` : h ? String(h) : `(${m}/60)` }; };
  // 두 문자의 값을 정했을 때 x² 까지 있는 등식이 x 에 대한 일차방정식인가
  const linearAt = ([L, R], env) => {
    const at = (v) => { const e = Object.assign({ x: Q(v), X: Q(v * v) }, env); return qsub(evS(L, e), evS(R, e)); }, c = at(0), p = at(1), m = at(-1);
    return qsub(qmul(qadd(p, m), Q(1, 2)), c).p === 0 && qsub(p, m).p !== 0;
  };
  // ── 다시 실은 꼴(아래 「처음 지을 때 뺐다가 다시 실은 꼴」)이 쓰는 도구 ──
  const vy = V('y'), vA = V('A');
  // 백분율을 소수로 적은 수(30 % → 0.3, 75 % → 0.75)
  const pct = (p) => (p % 10 === 0 ? dc(p / 10) : dc2(p));
  const upTo = (n) => Array.from({ length: n }, (_, i) => i + 1);
  const divisors = (n) => upTo(n).filter((v) => n % v === 0);
  // 검사가 다시 셈하는 식: a 가 num 의 약수이면 1, 아니면 0 (num 을 a 로 나눈 나머지가 0인가를 몫으로 가린다)
  const divJ = (num, a) => `(1-((${num})%${a}+${a}-1-((${num})%${a}+${a}-1)%${a})/${a})`;
  // 음수는 괄호에 넣어 적는 수(곱셈 기호 뒤)
  const pq = (n) => (n < 0 ? `(${iq(n)})` : String(n));

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
      }),

      // ── 처음 지을 때 뺐다가 다시 실은 꼴(2026-10-13) ──
      // 「꼬였다」「지나치게 복잡한 활용이다」「교육과정의 정도를 넘는다」는 까닭으로 뺐던 꼴 가운데 중1까지의 내용만으로 풀리는 것을 실었다.
      // 답이 여럿인 꼴은 개수·가장 큰(작은) 수·두 칸으로, 뜻 없이 더하게 하던 답(2a − b, 값의 합)은 값마다의 칸으로 바꾸었다.
      H('hard-three-eq', '해가 같은 세 방정식의 상수 둘', '기본 ①49', (d) => {
        // 상수가 없는 ㉮를 풀어 얻은 해를 ㉯, ㉰에 차례로 넣는다. (검사가 정수 셈으로 다시 셈하도록 세 방정식의 계수는 모두 정수이다.)
        const u = () => d.int(1, 9);
        const withA = [
          () => [ts([d.int(2, 5), 'x'], [-u(), '']), ts([1, 'a'])],
          () => [ts([1, 'ax'], [-u(), '']), ts([u(), ''], [-d.int(1, 4), 'x'])],
          () => [[tg(d.int(2, 4), ts([1, 'x'], [1, 'a']))], ts([d.int(5, 9), 'x'], [nz(d, -9, 9), ''])]
        ];
        const withB = [
          () => [ts([u(), ''], [-d.int(2, 5), 'x']), ts([d.int(2, 3), 'b'])],
          () => [ts([1, 'bx'], [u(), '']), ts([d.int(2, 5), 'x'], [-u(), ''])],
          () => [[tg(d.int(2, 4), ts([1, 'b'], [-1, 'x']))], ts([1, 'x'], [nz(d, -9, 9), ''])]
        ];
        const m = d.until(() => {
          const first = d.bool() ? [[tg(d.int(2, 4), ts([1, 'x'], [nz(d, -6, 6), '']))], ts([d.int(1, 6), 'x'], [nz(d, -9, 9), ''])] : [ts([d.int(2, 7), 'x'], [nz(d, -12, 12), '']), [tg(d.int(2, 3), ts([1, 'x'], [nz(d, -5, 5), '']))]];
          const i = d.int(0, 2), j = d.pick([0, 1, 2].filter((w) => w !== i));
          return { first, second: withA[i](), third: withB[j]() };
        }, (r) => {
          const v = solQ(r.first[0], r.first[1]); if (!nice(v, 'int') || Math.abs(v.p) > 9) return false;
          const a = solQ(subS(r.second[0], 'x', v), subS(r.second[1], 'x', v), 'a'), b = solQ(subS(r.third[0], 'x', v), subS(r.third[1], 'x', v), 'b');
          return nice(a, 'int') && nice(b, 'int') && a.p !== b.p && Boolean(solQ(r.second[0], r.second[1], 'x', { a })) && Boolean(solQ(r.third[0], r.third[1], 'x', { b }));
        });
        const v = solQ(m.first[0], m.first[1]), sub = (eq) => [subS(eq[0], 'x', v), subS(eq[1], 'x', v)], [La, Ra] = sub(m.second), [Lb, Rb] = sub(m.third), sa = solve(La, Ra, 'a'), sb = solve(Lb, Rb, 'b');
        const xJ = `(${solJ(m.first[0], m.first[1], 'x', {})})`, put = `${nb(`${x} = ${tx(v)}`)}${tail(lastOf(v), '을/를')} 대입하면`;
        return valsQ(`${x}에 대한 세 방정식 ㉮, ㉯, ㉰의 해가 모두 같을 때, 상수 ${va}, ${vb}의 값은?`, [['a', sa.v.p], ['b', sb.v.p]], {
          figure: tagEq([m.first, m.second, m.third].map(([L, R]) => eqH(L, R)), ['㉮', '㉯', '㉰']),
          explain: `${va}, ${vb}가 없는 ㉮를 먼저 푼다. ㉮에서 ${solve(m.first[0], m.first[1], 'x').text} 세 방정식의 해가 같으므로 ㉯에 ${put} ${eqB(La, Ra)}이다. ${sa.text} ㉰에 ${put} ${eqB(Lb, Rb)}이다. ${sb.text}`,
          facts: { calc: [[solJ(m.second[0], m.second[1], 'a', { x: xJ }), 0], [solJ(m.third[0], m.third[1], 'b', { x: xJ }), 1]], unseen: [0, 1] }
        });
      }),
      H('hard-sol-ratio', '두 방정식의 해의 비가 주어질 때 상수 구하기', '기본 ①51 / 심23', (d) => {
        // 두 방정식을 저마다 x 에 대하여 풀어 해를 a 의 식으로 나타낸 뒤, 해의 비로 비례식을 세운다.
        //  ㉮ (x − p)/k1 = a + q ⇨ x = k1·a + (k1·q + p),  ㉯ k2(x − e) = (k2·c)a ⇨ x = c·a + e
        const m = d.until(() => ({ k1: d.pick([2, 3, 4]), p: nz(d, -5, 5), q: nz(d, -4, 4), k2: d.pick([2, 3]), c: d.int(1, 3), e: nz(d, -6, 6), ratio: d.pick([[2, 1], [3, 1], [1, 2], [3, 2], [2, 3], [1, 3], [4, 3]]) }), (r) => {
          const [u, w] = r.ratio, den = w * r.k1 - u * r.c, num = u * r.e - w * (r.k1 * r.q + r.p); if (den === 0 || num % den !== 0 || r.k1 * r.q + r.p === 0) return false;
          const a = num / den, x1 = r.k1 * a + r.k1 * r.q + r.p, x2 = r.c * a + r.e;
          return a !== 0 && Math.abs(a) <= 12 && x1 > 0 && x2 > 0 && x1 <= 40 && x2 <= 40;
        });
        const { k1, p, q, k2, c, e } = m, [u, w] = m.ratio, E1 = [[tf(ts([1, 'x'], [-p, '']), k1, 1)], ts([1, 'a'], [q, ''])], E2 = [[tg(k2, ts([1, 'x'], [-e, '']))], ts([k2 * c, 'a'])];
        const s1 = ts([k1, 'a'], [k1 * q + p, '']), s2 = ts([c, 'a'], [e, '']), L = w === 1 ? s1 : [tg(w, s1)], R = u === 1 ? s2 : [tg(u, s2)], s = solve(L, R, 'a'), a = s.v.p, said = nb(`${u} : ${w}`);
        return ansV(`${x}에 대한 두 방정식 ㉮, ㉯에서 ㉮의 해와 ㉯의 해의 비가 ${said}일 때, 상수 ${va}의 값은?`, s.v, 'int', {
          figure: tagEq([eqH(E1[0], E1[1]), eqH(E2[0], E2[1])], ['㉮', '㉯']),
          explain: `두 방정식의 해를 ${va}의 식으로 나타낸다. ㉮의 양변에 ${k1}${tail(k1, '을/를')} 곱하면 ${eqB(ts([1, 'x'], [-p, '']), ts([k1, 'a'], [k1 * q, '']))}이므로 ${nb(`${x} = ${sideH(s1, true)}`)}이다. ㉯의 양변을 ${k2}${tail(k2, '으로/로')} 나누면 ${eqB(ts([1, 'x'], [-e, '']), ts([c, 'a']))}이므로 ${nb(`${x} = ${sideH(s2, true)}`)}이다. 두 해의 비가 ${said}이므로 ${nb(`(${sideH(s1, true)}) : (${sideH(s2, true)}) = ${u} : ${w}`)}이다. 비례식에서 외항의 곱과 내항의 곱은 같으므로 ${eqB(L, R)}이다. ${s.text} 이때 ㉮의 해는 ${k1 * a + k1 * q + p}, ㉯의 해는 ${c * a + e}이다.`,
          facts: { value: `(${u}*(${e})-${w}*(${k1}*(${q})+(${p})))/(${w}*${k1}-${u}*${k2 * c}/${k2})` }
        });
      }),
      H('hard-abs-sol', '해의 절댓값이 같은 두 방정식의 상수', '기본 ①52', (d) => {
        // 함정: 「해의 절댓값이 같다」를 「해가 같다」로만 읽는 아이는 값을 하나만 구한다. 절댓값이 같은 수는 그 수와 부호가 반대인 수 둘이다.
        //  (검사가 정수 셈으로 다시 셈하도록 두 방정식의 계수는 모두 정수이다.)
        const u = () => d.int(1, 9);
        const m = d.until(() => {
          const first = d.bool() ? [[tg(d.int(2, 4), ts([1, 'x'], [nz(d, -6, 6), '']))], ts([d.int(1, 6), 'x'], [nz(d, -9, 9), ''])] : [ts([d.int(2, 7), 'x'], [nz(d, -12, 12), '']), ts([d.int(1, 6), 'x'], [nz(d, -12, 12), ''])];
          const second = d.bool() ? [ts([d.int(4, 9), 'x'], [-u(), '']), ts([d.int(1, 3), 'x'], [-d.int(2, 4), 'a'])] : [[tg(d.int(2, 4), ts([1, 'x'], [1, 'a']))], ts([d.int(5, 9), 'x'], [nz(d, -9, 9), ''])];
          return { first, second };
        }, (r) => {
          const v = solQ(r.first[0], r.first[1]); if (!nice(v, 'int') || Math.abs(v.p) > 6) return false;
          const at = (t) => solQ(subS(r.second[0], 'x', Q(t)), subS(r.second[1], 'x', Q(t)), 'a'), same = at(v.p), opp = at(-v.p);
          return nice(same, 'int') && nice(opp, 'int') && same.p !== opp.p;
        });
        const v = solQ(m.first[0], m.first[1]).p, size = Math.abs(v), sub = (t) => [subS(m.second[0], 'x', Q(t)), subS(m.second[1], 'x', Q(t))], [L1, R1] = sub(v), [L2, R2] = sub(-v), s1 = solve(L1, R1, 'a'), s2 = solve(L2, R2, 'a');
        const firstJ = solJ(m.first[0], m.first[1], 'x', {}), j1 = solJ(m.second[0], m.second[1], 'a', { x: `(${firstJ})` }), j2 = solJ(m.second[0], m.second[1], 'a', { x: `(-(${firstJ}))` });
        const small = Math.min(s1.v.p, s2.v.p), big = Math.max(s1.v.p, s2.v.p), put = (t) => `㉯에 ${nb(`${x} = ${iq(t)}`)}${tail(size, '을/를')} 대입하면`;
        return M(`${x}에 대한 두 방정식 ㉮, ㉯의 해의 절댓값이 서로 같을 때, 상수 ${va}의 값이 될 수 있는 수를 모두 구하시오.`, [{ label: '작은 수', answer: small, signed: true }, { label: '큰 수', answer: big, signed: true }], {
          figure: tagEq([eqH(m.first[0], m.first[1]), eqH(m.second[0], m.second[1])], ['㉮', '㉯']),
          shown: `${nb(`${va} = ${iq(small)}`)}, ${nb(`${va} = ${iq(big)}`)}`,
          explain: `${va}가 없는 ㉮를 먼저 푼다. ㉮에서 ${solve(m.first[0], m.first[1], 'x').text} 절댓값이 ${size}인 수는 ${size}${tail(size, '과/와')} ${iq(-size)}이므로 ㉯의 해는 ${nb(`${x} = ${size}`)} 또는 ${nb(`${x} = ${iq(-size)}`)}이다. ${put(v)} ${eqB(L1, R1)}이다. ${s1.text} ${put(-v)} ${eqB(L2, R2)}이다. ${s2.text} 해가 같은 경우만 따지면 값 하나를 놓친다.`,
          facts: { calc: s1.v.p < s2.v.p ? [[j1, 0], [j2, 1]] : [[j2, 0], [j1, 1]], unseen: [0, 1] }
        });
      }, { standard: STD4 }),
      H('hard-natural-sol', '해가 자연수(정수)가 되게 하는 상수 찾기', '기본 ①54 / 심24·25·26', (d, n) => {
        // 해와 상수의 관계를 식으로 나타낸 뒤 자연수(정수)가 되는 경우를 따진다. 「모두 구하시오」는 개수나 가장 큰(작은) 수로 물었다.
        // 함정: 0은 자연수도 음의 정수도 아니다. 해가 0이 되는 상수까지 세는 아이가 걸린다.
        const many = `자연수 ${va}는 모두 몇 개인가?`;
        if (n === 0) {
          // ax + b = c: x = (c − b)/a 이므로 a 는 c − b 의 약수이다.
          const num = d.pick([6, 8, 10, 12, 14, 15, 16, 18, 20, 21, 24, 28, 30]), b = d.until(() => nz(d, -9, 9), (w) => num + w > 0), c = num + b, left = d.bool();
          const L = left ? ts([1, 'ax'], [b, '']) : ts([c, '']), R = left ? ts([c, '']) : ts([1, 'ax'], [b, '']), divs = divisors(num);
          return N(`${x}에 대한 일차방정식 ${eqB(L, R)}의 해가 자연수가 되게 하는 ${many}`, divs.length, {
            unit: '개',
            explain: `${iq(b)}${tail(Math.abs(b), '을/를')} 이항하여 정리하면 ${nb(`${va}${x} = ${num}`)}이므로 ${nb(`${x} = ${frac(num, va)}`)}이다. ${x}가 자연수이려면 ${va}는 ${num}의 약수이어야 한다. ${num}의 약수는 ${divs.join(', ')}의 ${divs.length}개이다.`,
            facts: { value: upTo(num).map((t) => divJ(`${c}-(${b})`, t)).join('+'), unseen: upTo(num), rule: 'natural-0' }
          });
        }
        if (n === 1) {
          // 해가 a 와의 차로 정해진다: 범위만 따진다.
          if (d.bool()) {
            const k = d.int(2, 5), p = d.int(4, 9), L = [tg(k, ts([p, ''], [-1, 'x']))], R = ts([k, 'a']);
            return N(`${x}에 대한 일차방정식 ${eqB(L, R)}의 해가 자연수가 되게 하는 ${many}`, p - 1, {
              unit: '개',
              explain: `양변을 ${k}${tail(k, '으로/로')} 나누면 ${eqB(ts([p, ''], [-1, 'x']), ts([1, 'a']))}이므로 ${nb(`${x} = ${p} − ${va}`)}이다. ${nb(`${p} − ${va}`)}가 자연수이려면 ${va}는 ${p}보다 작은 자연수이어야 하므로 ${va}는 1부터 ${p - 1}까지의 ${p - 1}개이다. ${nb(`${va} = ${p}`)}이면 ${nb(`${x} = 0`)}이고 0은 자연수가 아니다.`,
              facts: { value: `${p}-1`, unseen: [1], rule: 'natural-1' }
            });
          }
          const [k, e] = d.until(() => [d.pick([2, 3, 4, 5]), d.int(1, 4)], ([s, t]) => s * t >= 4 && s * t <= 12), top = k * e, L = [tg(Q(1, k), ts([k - 1, 'x'], [1, 'a']))], R = ts([1, 'x'], [e, '']);
          return N(`다음 ${x}에 대한 일차방정식의 해가 음의 정수가 되게 하는 ${many}`, top - 1, {
            unit: '개', figure: eqF(L, R),
            explain: `양변에 ${k}${tail(k, '을/를')} 곱하면 ${eqB(ts([k - 1, 'x'], [1, 'a']), ts([k, 'x'], [top, '']))}이고, 정리하면 ${nb(`${x} = ${va} − ${top}`)}이다. ${nb(`${va} − ${top}`)}${tail(top, '이/가')} 음의 정수이려면 ${va}는 ${top}보다 작은 자연수이어야 하므로 ${va}는 1부터 ${top - 1}까지의 ${top - 1}개이다. ${nb(`${va} = ${top}`)}이면 ${nb(`${x} = 0`)}이고 0은 음의 정수가 아니다.`,
            facts: { value: `${k}*${e}-1`, unseen: [1], rule: 'natural-1' }
          });
        }
        if (n === 2) {
          // k(p − qx) = a: x 에 자연수를 차례로 넣으면 a 가 정해진다(범위에 배수 조건이 겹친다).
          const [k, q, p] = d.until(() => [d.int(2, 4), d.int(1, 3), d.int(4, 11)], ([, s, t]) => { const count = Math.floor((t - 1) / s); return count >= 2 && count <= 4; });
          const L = [tg(k, ts([p, ''], [-q, 'x']))], R = ts([1, 'a']), count = Math.floor((p - 1) / q), list = upTo(count).map((t) => k * (p - q * t)), next = k * (p - q * (count + 1));
          return N(`${x}에 대한 일차방정식 ${eqB(L, R)}의 해가 자연수가 되게 하는 ${many}`, count, {
            unit: '개',
            explain: `${x}에 자연수를 작은 수부터 차례로 대입하여 ${va}의 값을 구한다. ${list.map((t, i) => `${nb(`${x} = ${i + 1}`)}일 때 ${nb(`${va} = ${t}`)}`).join(', ')}이고, ${nb(`${x} = ${count + 1}`)}일 때는 ${nb(`${va} = ${iq(next)}`)}${tail(Math.abs(next), '이/가')} 되어 자연수가 아니다. ${x}가 커질수록 ${va}는 작아지므로 ${va}는 ${list.join(', ')}의 ${count}개이다.`,
            facts: { value: `(${p}-1-(${p}-1)%${q})/${q}`, unseen: [1], rule: 'natural-2' }
          });
        }
        if (n === 3) {
          // −x + (j/k)(cx + a) = e: 가장 큰 a 는 가장 작은 x 에서 나오지만, x = 1 일 때는 a 가 자연수가 아니다. 조건에 맞는 a 는 둘 넘게 있다.
          const m = d.until(() => { const k = d.pick([3, 4, 5]), j = d.pick([2, 3].filter((w) => w < k && gcd(w, k) === 1)), c = d.int(2, 4), e = d.int(3, 9), D = j * c - k; return { k, j, c, e, D, at: [1, 2, 3].find((t) => k * e - D * t > 0 && (k * e - D * t) % j === 0) }; }, (r) => r.D >= 2 && r.at !== undefined && r.at >= 2 && r.k * r.e - r.D * (r.at + r.j) > 0);
          const { k, j, c, e, D, at } = m, best = (k * e - D * at) / j, L = [tm(-1, 'x'), tg(Q(j, k), ts([c, 'x'], [1, 'a']))], R = ts([e, '']);
          const tries = upTo(at).map((t) => `${nb(`${x} = ${t}`)}일 때 ${nb(`${j}${va} = ${k * e - D * t}`)}에서 ${nb(`${va} = ${tx(Q(k * e - D * t, j))}`)}${t < at ? '이므로 자연수가 아니고' : '이다'}`).join(', ');
          return ansV(`다음 ${x}에 대한 일차방정식의 해가 자연수가 되게 하는 자연수 ${va} 가운데 가장 큰 수는?`, Q(best), 'int', {
            figure: eqF(L, R),
            explain: `양변에 ${k}${tail(k, '을/를')} 곱하면 ${eqB([tm(-k, 'x'), tg(j, ts([c, 'x'], [1, 'a']))], ts([k * e, '']))}이고, 괄호를 풀어 정리하면 ${eqB(ts([D, 'x'], [j, 'a']), ts([k * e, '']))}, 곧 ${nb(`${j}${va} = ${k * e} − ${D}${x}`)}이다. ${x}가 작을수록 ${va}가 크므로 ${x}에 자연수를 작은 수부터 대입한다. ${tries}. 따라서 가장 큰 수는 ${best}이다.`,
            facts: { value: `(${k}*${e}-(${j}*${c}-${k})*${at})/${j}`, unseen: [at], rule: 'natural-3' }
          });
        }
        if (n === 4) {
          // 가장 작은 a: a − e 가 양수이면서 어떤 수의 배수이어야 한다(a = e 이면 해가 0이다).
          const least = `다음 ${x}에 대한 일차방정식의 해가 자연수가 되게 하는 가장 작은 자연수 ${va}의 값은?`;
          if (d.bool()) {
            const [p, q] = d.until(() => [d.int(1, 6), d.int(4, 9)], ([s, t]) => [3, 7, 9].includes(t - s)), D = q - p, e = d.int(2, 9), L = ts([dc(p), 'x'], [1, 'a']), R = ts([dc(q), 'x'], [e, '']);
            return ansV(least, Q(e + D), 'int', {
              figure: eqF(L, R),
              explain: `양변에 10을 곱하면 ${eqB(ts([p, 'x'], [10, 'a']), ts([q, 'x'], [10 * e, '']))}이고, 정리하면 ${nb(`${D}${x} = 10${va} − ${10 * e}`)}, 곧 ${nb(`${D}${x} = 10(${va} − ${e})`)}이다. ${D}${tail(D, '과/와')} 10은 서로소이므로 ${x}가 자연수이려면 ${nb(`${va} − ${e}`)}${tail(e, '이/가')} ${D}의 배수인 자연수이어야 한다. 가장 작은 경우는 ${nb(`${va} − ${e} = ${D}`)}일 때이므로 ${nb(`${va} = ${e + D}`)}이고, 이때 ${nb(`${x} = 10`)}이다. ${nb(`${va} = ${e}`)}이면 ${nb(`${x} = 0`)}이고 0은 자연수가 아니다.`,
              facts: { value: `${e}+(${js(dc(q))}-${js(dc(p))})*10`, unseen: [10], rule: 'natural-4' }
            });
          }
          const k = d.pick([3, 4, 5]), j = d.pick([2, 3].filter((w) => w < k && gcd(w, k) === 1)), e = d.int(2, 9), L = ts([Q(j, k), 'x'], [e, '']), R = ts([1, 'a']);
          return ansV(least, Q(e + j), 'int', {
            figure: eqF(L, R),
            explain: `${e}${tail(e, '을/를')} 이항하고 양변에 ${k}${tail(k, '을/를')} 곱하면 ${nb(`${j}${x} = ${k}(${va} − ${e})`)}이다. ${j}${tail(j, '과/와')} ${k}${tail(k, '은/는')} 서로소이므로 ${x}가 자연수이려면 ${nb(`${va} − ${e}`)}${tail(e, '이/가')} ${j}의 배수인 자연수이어야 한다. 가장 작은 경우는 ${nb(`${va} − ${e} = ${j}`)}일 때이므로 ${nb(`${va} = ${e + j}`)}이고, 이때 ${nb(`${x} = ${k}`)}이다. ${nb(`${va} = ${e}`)}이면 ${nb(`${x} = 0`)}이고 0은 자연수가 아니다.`,
            facts: { value: `${e}+${j}`, rule: 'natural-4' }
          });
        }
        // ax ∓ c = ka: x = k ± c/a 이므로 a 는 c 의 약수이다(a 가 양변에 있다).
        const c = d.pick([6, 8, 10, 12, 14, 15, 18, 20, 21, 22, 26, 27]), k = d.int(2, 6), minus = d.bool(), L = ts([1, 'ax'], [minus ? -c : c, '']), R = ts([k, 'a']), divs = divisors(c);
        return N(`${x}에 대한 일차방정식 ${eqB(L, R)}의 해가 정수가 되게 하는 ${many}`, divs.length, {
          unit: '개',
          explain: `${iq(minus ? -c : c)}${tail(c, '을/를')} 이항하면 ${nb(`${va}${x} = ${k}${va} ${minus ? '+' : MINUS} ${c}`)}이다. ${va}는 0이 아니므로 양변을 ${va}로 나누면 ${nb(`${x} = ${k} ${minus ? '+' : MINUS} ${frac(c, va)}`)}이다. ${x}가 정수이려면 ${nb(frac(c, va) + '가')} 정수이어야 하므로 ${va}는 ${c}의 약수이다. ${c}의 약수는 ${divs.join(', ')}의 ${divs.length}개이다.`,
          facts: { value: upTo(c).map((t) => divJ(String(c), t)).join('+'), unseen: upTo(c), rule: 'natural-5' }
        });
      }, { count: 6 }),
      H('hard-infinite', '해가 무수히 많은 방정식의 상수', '심27', (d) => {
        // 함정: 「해가 무수히 많다」는 x에 어떤 수를 대입하여도 참이라는 뜻이다(항등식). 일차방정식이 되는 조건(x의 계수가 0이 아니다)과 거꾸로이고,
        //  「x = 0」 하나를 해로 적는 아이가 걸린다. 양변의 상수항은 이미 같게 두어 x의 계수만 맞추면 된다.
        const k = d.int(2, 4), q = d.int(2, 5), c0 = d.int(2, 6), first = d.bool(), p = d.until(() => d.int(2, 9), (w) => w !== k * q && w !== k), a = first ? k * q - p : p - k;
        const L = first ? ts([k * c0, ''], [-1, 'ax']) : [tg(k, ts([1, 'x'], [-c0, ''])), tm(1, 'ax')], R = first ? [tm(p, 'x'), tg(k, ts([c0, ''], [-q, 'x']))] : ts([p, 'x'], [-k * c0, '']);
        const tidied = first ? `우변의 괄호를 풀어 정리하면 ${nb(sideH(ts([p - k * q, 'x'], [k * c0, '']), true))}이다. 양변의 상수항이 같으므로 ${x}를 포함한 항을 모두 좌변으로 이항하여 정리하면 ${nb(`(${iq(a)} − ${va})${x} = 0`)}이다.`
          : `좌변의 괄호를 풀어 정리하면 ${nb(`(${k} + ${va})${x} − ${k * c0}`)}이다. 양변의 상수항이 같으므로 ${x}를 포함한 항을 모두 좌변으로 이항하여 정리하면 ${nb(`(${va} ${a > 0 ? MINUS : '+'} ${Math.abs(a)})${x} = 0`)}이다.`;
        return ansV(`다음 ${x}에 대한 방정식의 해가 무수히 많을 때, 상수 ${va}의 값은?`, Q(a), 'int', {
          figure: eqF(L, R),
          explain: `${tidied} ${x}의 계수가 0이 아니면 이 등식을 참이 되게 하는 ${x}의 값은 0 하나뿐이다. 해가 무수히 많으려면 ${x}에 어떤 수를 대입하여도 등식이 참이어야 하므로 ${x}의 계수가 0이어야 한다. 따라서 ${nb(`${va} = ${iq(a)}`)}이고, 이때 주어진 등식은 ${x}에 대한 항등식이다.`,
          facts: { value: first ? `${k}*${q}-${p}` : `${p}-${k}` }
        });
      }, { standard: STD3 }),
      H('hard-chunk', '문자가 둘인 등식에서 되풀이되는 식의 값 구하기', '심28', (d) => {
        // 함정: 문자가 둘이라 x, y의 값은 정해지지 않는다. 같은 식이 두 번 들어 있음을 보고 그 식을 한 문자로 놓으면 일차방정식이 된다.
        const [pc, qc] = d.pick([[2, 1], [1, 2], [3, 1], [1, 3], [2, 3], [3, 2], [1, -2], [2, -1], [3, -2]]);
        const m = d.until(() => { const first = d.bool(), k = d.int(2, 5), j = d.until(() => d.int(2, 6), (w) => w !== k), r = d.int(1, 6), s = d.int(1, 9); return { first, k, j, r, s, num: first ? k * r - s : r + k * s, den: first ? k - 1 : k - j }; }, (t) => t.num % t.den === 0 && t.num !== 0 && Math.abs(t.num / t.den) <= 12);
        // unit(덧붙일 항들): 되풀이되는 식(또는 그 자리에 놓은 한 문자)에 항을 덧붙인 변
        //  times(k): 그 식의 k배(되풀이되는 식은 괄호로 묶고, 한 문자는 계수만 붙인다)
        const build = (unit, times) => (m.first ? [unit().concat([tg(-m.k, unit([[-m.r, '']])), tm(-m.s, '')]), ts([0, ''])] : [[times(m.j), tm(m.r, '')], [tg(m.k, unit([[-m.s, '']]))]]);
        const both = (more) => ts(...[[pc, 'x'], [qc, 'y']].concat(more || [])), [L, R] = build(both, (k) => tg(k, both())), [LA, RA] = build((more) => ts(...[[1, 'A']].concat(more || [])), (k) => tm(k, 'A')), s = solve(LA, RA, 'A'), chunk = nb(sideH(both(), true));
        return ansV(`두 수 ${x}, ${vy}에 대하여 다음 등식이 성립할 때, ${chunk}의 값은?`, s.v, 'int', {
          figure: eqF(L, R),
          explain: `주어진 등식에는 ${chunk}가 두 번 들어 있다. ${chunk}를 한 문자 ${vA}로 놓으면 주어진 등식은 ${vA}에 대한 일차방정식 ${eqB(LA, RA)}이다. ${s.text} 따라서 ${chunk}의 값은 ${tx(s.v)}이다.`,
          facts: { value: m.first ? `(${m.k}*${m.r}-${m.s})/(${m.k}-1)` : `(${m.r}+${m.k}*${m.s})/(${m.k}-${m.j})`, unseen: [1] }
        });
      }),
      H('hard-new-op', '새로 약속한 기호가 든 방정식', '심29·30', (d, n) => {
        // 약속한 대로 식을 바꾸어 적으면 일차방정식이 된다. 첫째는 약속을 두 번 쓰고, 둘째는 약속한 계산의 결과에 약속을 한 번 더 쓰고, 셋째는 일차식을 수의 짝으로 적는 약속이다.
        if (n === 0) {
          const OP = '◎', m = d.until(() => ({ p: d.int(3, 7), q: d.int(2, 6), r: nz(d, -4, 5), s: nz(d, -9, 9) }), (t) => { const den = t.p - t.q, num = t.s + t.p + t.q * t.r - t.q - t.r; return den !== 0 && num % den === 0 && num !== 0 && Math.abs(num / den) <= 12 && t.q * t.r - t.q - t.r !== 0; });
          const { p, q, r, s } = m, xr = ts([1, 'x'], [r, '']), xrH = sideH(xr, true), A = ts([p - 1, 'x'], [-p, '']), Bq = ts([q - 1, 'x'], [q * r - q - r, '']), L = [tg(1, A), tg(-1, Bq)], R = ts([s, '']), sol = solve(L, R, 'x');
          return ansV(`두 수 ${va}, ${vb}에 대하여 ${nb(`${va} ${OP} ${vb} = ${va}${vb} − (${va} + ${vb})`)}로 약속할 때, 다음 방정식을 풀어 ${x}의 값을 구하시오.`, sol.v, 'int', {
            figure: exq(`(${x} <i>${OP}</i> ${p}) <i>${MINUS}</i> {${q} <i>${OP}</i> (${sideH(xr)})} <i>=</i> ${iq(s)}`),
            explain: `약속에 따라 ${nb(`${x} ${OP} ${p} = ${p}${x} − (${x} + ${p})`)} ${nb(`= ${sideH(A, true)}`)}이고, ${keep(`${q} ${OP} (${xrH}) = ${q}(${xrH}) − (${q} + ${xrH})`)} ${nb(`= ${sideH(Bq, true)}`)}이다. 따라서 주어진 방정식은 ${eqB(L, R)}이다. ${sol.text}`,
            facts: { value: `((${s})+${p}+${q}*(${r})-${q}-(${r}))/(${p}-${q})`, rule: 'new-op-0' }
          });
        }
        if (n === 1) {
          const OP = '★', m = d.until(() => { const k = d.int(1, 3), j = d.int(2, 3), p = d.int(1, 3), q = nz(d, -3, 3), v = nz(d, -5, 5), al = 1 - j * p, be = k * p, ga = 1 - j * q, de = k * q; return { k, j, p, q, v, al, be, ga, de, t: ga * (al * v + be) + de }; }, (r) => r.t !== 0 && Math.abs(r.t) <= 60 && r.p !== r.q);
          const { k, j, p, q, al, be, ga, de, t } = m, inner = ts([al, 'x'], [be, '']), L = [tg(ga, inner), tm(de, '')], R = ts([t, '']), sol = solve(L, R, 'x'), qH = pq(q);
          return ansV(`두 수 ${va}, ${vb}에 대하여 ${nb(`${va} ${OP} ${vb} = ${sideH(ts([1, 'a'], [k, 'b'], [-j, 'ab']), true)}`)}로 약속할 때, 다음 등식을 만족시키는 ${x}의 값을 구하시오.`, sol.v, 'int', {
            figure: exq(`(${x} <i>${OP}</i> ${p}) <i>${OP}</i> ${qH} <i>=</i> ${iq(t)}`),
            explain: `약속에 따라 ${keep(`${x} ${OP} ${p} = ${x} + ${k} × ${p} − ${j} × ${x} × ${p}`)} ${nb(`= ${sideH(inner, true)}`)}이다. 이 식을 ${vA}라 하면 ${keep(`${vA} ${OP} ${qH} = ${vA} + ${k} × ${qH} − ${j} × ${vA} × ${qH}`)} ${nb(`= ${sideH(ts([ga, 'A'], [de, '']), true)}`)}이므로 주어진 등식은 ${eqB(L, R)}이다. ${sol.text}`,
            facts: { value: `((${t})-${k}*(${q})-(1-${j}*(${q}))*${k}*${p})/((1-${j}*(${q}))*(1-${j}*${p}))`, unseen: [1], rule: 'new-op-1' }
          });
        }
        const m = d.until(() => ({ p: d.int(1, 9), q: d.int(1, 4), r: nz(d, -6, 6), k: d.int(2, 4), s: nz(d, -5, 5), j: d.int(2, 5) }), (t) => { const num = t.p - t.r - t.k * t.s, den = t.q + t.k; return num % den === 0 && num !== 0 && Math.abs(num / den) <= 9; });
        const { p, q, r, k, s, j } = m, ang = (c1, c2) => `〈${c1}, ${c2}〉`, L = [tm(p, ''), tg(-1, ts([q, 'x'], [r, '']))], R = [tg(k, ts([1, 'x'], [s, '']))], sol = solve(L, R, 'x'), v = sol.v.p;
        return ansV(`${x}에 대한 식 ${nb(`${va}${x} + ${vb}`)}를 ${nb(ang(va, vb))}로 나타내기로 약속할 때, 다음 등식을 만족시키는 ${x}에 대하여 ${nb(ang(j, 0))}의 값은?`, Q(j * v), 'int', {
          figure: exq(`${ang(0, p)} <i>${MINUS}</i> ${ang(q, iq(r))} <i>=</i> ${k}${ang(1, iq(s))}`),
          explain: `약속에 따라 ${nb(`${ang(0, p)} = 0 × ${x} + ${p} = ${p}`)}, ${nb(`${ang(q, iq(r))} = ${sideH(ts([q, 'x'], [r, '']), true)}`)}, ${nb(`${ang(1, iq(s))} = ${sideH(ts([1, 'x'], [s, '']), true)}`)}이므로 주어진 등식은 ${eqB(L, R)}이다. ${sol.text} ${nb(`${ang(j, 0)} = ${j}${x}`)}이므로 구하는 값은 ${nb(`${j} × ${pq(v)} = ${iq(j * v)}`)}이다.`,
          facts: { value: `${j}*((${p})-(${r})-${k}*(${s}))/(${q}+${k})`, rule: 'new-op-2' }
        });
      }, { count: 3 }),
      H('hard-mix-salt', '농도가 다른 두 소금물을 섞기', '기본 ①76', (d) => {
        // 섞기 전 두 소금물에 든 소금의 양의 합이 섞은 뒤의 소금의 양과 같다. 농도끼리 더하거나 평균을 내는 아이가 걸린다(두 소금물의 양이 다르다).
        const m = d.until(() => { const p = d.int(4, 15), v = d.int(5, 20), first = 100 * d.int(1, 5), second = 100 * d.int(1, 5); return { p, v, first, second, r: (p * first + v * second) / (first + second) }; }, (t) => Number.isInteger(t.r) && Math.abs(t.v - t.p) >= 3 && t.first !== t.second);
        const { p, v, first, second, r } = m, all = first + second, L = ts([p * first / 100, ''], [second / 100, 'x']), R = ts([r * all / 100, '']);
        return N(`${p} %의 소금물 ${first} g에 ${x} %의 소금물 ${second} g을 섞었더니 ${r} %의 소금물이 되었다. ${x}의 값은?`, v, {
          explain: `섞기 전 두 소금물에 든 소금의 양의 합은 섞은 뒤의 소금물에 든 소금의 양과 같다. 두 소금물에 든 소금의 양은 ${nb(`${frac(p, 100)} × ${first} = ${p * first / 100}`)}(g), ${nb(`${frac(x, 100)} × ${second} = ${termH(second / 100, 'x')}`)}(g)이고, 섞은 뒤의 소금물 ${all} g에 든 소금의 양은 ${nb(`${frac(r, 100)} × ${all} = ${r * all / 100}`)}(g)이다. ${told(L, R)}`,
          facts: { value: `(${r}*(${first}+${second})-${p}*${first})/${second}` }
        });
      }),
      H('hard-two-discount', '할인율이 다른 두 물건의 정가', '기본 ①79', (d) => {
        // 두 정가를 한 문자로 나타내고(차), 저마다 다른 할인율을 건다.
        const m = d.until(() => { const price = 100 * d.int(10, 40), gap = 100 * d.int(2, 8), p = d.pick([10, 20, 25, 30, 40]), q = d.pick([10, 20, 25, 30, 40]); return { price, gap, p, q, total: (price * (100 - p) + (price - gap) * (100 - q)) / 100 }; }, (t) => t.p !== t.q && t.price - t.gap >= 500 && Number.isInteger(t.total) && t.total % 10 === 0);
        const { price, gap, p, q, total } = m, [dear, cheap] = d.pick([['필통', '지우개'], ['가위', '풀'], ['컵', '접시']]), L = [tm(pct(100 - p), 'x'), tg(pct(100 - q), ts([1, 'x'], [-gap, '']))], R = ts([total, '']);
        return N(`어느 가게에서 ${dear} 한 개의 정가는 ${cheap} 한 개의 정가보다 ${gap}원 비싸다. ${josa(dear, '은/는')} 정가의 ${p} %를, ${josa(cheap, '은/는')} 정가의 ${q} %를 할인하여 한 개씩 샀더니 모두 ${total}원이었다. ${dear} 한 개의 정가는 얼마인가?`, price, {
          unit: '원',
          explain: `${dear} 한 개의 정가를 ${x}원이라 하면 ${cheap} 한 개의 정가는 ${nb(`(${x} − ${gap})`)}원이다. 정가의 ${p} %를 할인한 값은 정가의 ${100 - p} %이고, 정가의 ${q} %를 할인한 값은 정가의 ${100 - q} %이다. ${told(L, R)}`,
          facts: { value: `(100*${total}+(100-${q})*${gap})/((100-${p})+(100-${q}))`, unseen: [100] }
        });
      }),
      H('hard-up-down', '한쪽은 늘고 한쪽은 준 학생 수', '심42', (d) => {
        // 늘어난 수와 줄어든 수의 차가 전체의 변화이다. 구한 해는 작년 남학생의 수이고 묻는 것은 올해 남학생의 수이다.
        const m = d.until(() => { const boys = 50 * d.int(4, 14), girls = 50 * d.int(4, 14), p = d.pick([2, 4, 6, 8, 10, 12]), q = d.pick([2, 4, 6, 8, 10, 12]); return { boys, girls, p, q, change: (boys * p - girls * q) / 100 }; }, (t) => t.p !== t.q && t.change !== 0 && Math.abs(t.change) <= 20 && t.boys !== t.girls);
        const { boys, girls, p, q, change } = m, all = boys + girls, more = boys * p / 100, size = Math.abs(change), L = [tm(pct(p), 'x'), tg(qneg(pct(q)), ts([all, ''], [-1, 'x']))], R = ts([change, '']);
        return N(`어느 중학교의 작년 전체 학생은 ${all}명이었다. 올해는 작년보다 남학생의 수가 ${p} % 늘고 여학생의 수가 ${q} % 줄어서 전체 학생의 수가 ${size}명 ${change > 0 ? '늘었다' : '줄었다'}. 올해 남학생은 몇 명인가?`, boys + more, {
          unit: '명',
          explain: `작년 남학생의 수를 ${x}라 하면 작년 여학생의 수는 ${nb(`${all} − ${x}`)}이다. 늘어난 남학생의 수는 ${nb(sideH([tm(pct(p), 'x')], true))}, 줄어든 여학생의 수는 ${nb(`${tx(pct(q))}(${all} − ${x})`)}이다. 전체 학생의 수가 ${size}명 ${change > 0 ? '늘었으므로' : '줄었으므로'} 늘어난 수에서 줄어든 수를 뺀 값이 ${iq(change)}이다. ${told(L, R)} 작년 남학생이 ${boys}명이므로 올해 남학생은 ${nb(`${boys} + ${more} = ${boys + more}`)}(명)이다.`,
          facts: { value: `(${q}*${all}${change > 0 ? '+' : '-'}${size}*100)/(${p}+${q})*(100+${p})/100`, unseen: [100] }
        });
      }),
      H('hard-ratio-pass', '지원자·합격자·불합격자의 남녀의 비', '심43', (d) => {
        // 합격자를 비로 나누어 수로 고치고, 불합격자를 한 문자로 나타낸 뒤 지원자의 비로 비례식을 세운다.
        const m = d.until(() => {
          const [b1, b2] = d.pick([[5, 2], [3, 2], [4, 3], [2, 1], [3, 1], [5, 3], [4, 1], [5, 4]]), [c1, c2] = d.pick([[1, 1], [1, 1], [2, 1], [1, 2]]), [a1, a2] = d.pick([[3, 2], [2, 1], [4, 3], [5, 3], [5, 4], [7, 5], [7, 4], [3, 1], [5, 2], [6, 5], [7, 6], [1, 1]]);
          return { b1, b2, c1, c2, a1, a2, t: 5 * d.int(2, 12), den: a2 * c1 - a1 * c2, num: a1 * b2 - a2 * b1 };
        }, (r) => { if (r.den === 0 || r.num === 0) return false; const k = r.t * r.num / r.den; return Number.isInteger(k) && k >= 5 && k <= 150 && (r.b1 + r.b2) * r.t <= 600 && r.a1 * r.c2 !== r.a2 * r.c1; });
        const { b1, b2, c1, c2, a1, a2, t } = m, k = t * m.num / m.den, pass = (b1 + b2) * t, men = b1 * t, women = b2 * t, fail = (c1 + c2) * k, said = (p, q) => nb(`${p} : ${q}`);
        const side = (k, list) => (k === 1 ? list : [tg(k, list)]), L = side(a2, ts([men, ''], [c1, 'x'])), R = side(a1, ts([women, ''], [c2, 'x']));
        return N(`어느 시험에서 지원자의 남녀의 비는 ${said(a1, a2)}, 합격자의 남녀의 비는 ${said(b1, b2)}, 불합격자의 남녀의 비는 ${said(c1, c2)}${tail(c2, '이었다/였다')}. 합격자가 ${pass}명일 때, 지원자는 모두 몇 명인가?`, pass + fail, {
          unit: '명',
          explain: `합격자 ${pass}명을 ${said(b1, b2)}${tail(b2, '으로/로')} 나누면 합격한 남자는 ${men}명, 여자는 ${women}명이다. 불합격자의 남녀의 비가 ${said(c1, c2)}이므로 불합격한 남자를 ${termH(c1, 'x')}명, 여자를 ${termH(c2, 'x')}명이라 하면 지원한 남자는 ${nb(`(${men} + ${termH(c1, 'x')})`)}명, 여자는 ${nb(`(${women} + ${termH(c2, 'x')})`)}명이다. 지원자의 남녀의 비에서 ${nb(`(${men} + ${termH(c1, 'x')}) : (${women} + ${termH(c2, 'x')}) = ${a1} : ${a2}`)}이고, 비례식에서 외항의 곱과 내항의 곱은 같으므로 ${told(L, R)} 불합격자는 ${nb(`${c1 + c2} × ${k} = ${fail}`)}(명)이므로 지원자는 ${nb(`${pass} + ${fail} = ${pass + fail}`)}(명)이다.`,
          facts: { value: `${pass}+(${c1}+${c2})*(${a1}*${pass}*${b2}/(${b1}+${b2})-${a2}*${pass}*${b1}/(${b1}+${b2}))/(${a2}*${c1}-${a1}*${c2})` }
        });
      }),
      H('hard-clock', '시침과 분침이 겹치거나 반대 방향으로 일직선이 되는 시각', '심47', (d, n) => {
        // 분침은 1분에 6°, 시침은 1분에 0.5°씩 움직인다. h시 정각에 시침은 12시 방향에서 30h°만큼 돌아간 곳에 있다(분침은 0°).
        //  첫째는 두 바늘이 겹치고(두 각이 같다), 둘째는 반대 방향으로 일직선을 이룬다(두 각의 차가 180°이고, 어느 바늘이 앞서는지는 시각에 따라 다르다).
        const h = n === 0 ? d.int(1, 10) : d.pick([1, 2, 3, 4, 7, 8, 9, 10, 11]), base = 30 * h, ahead = h < 6;
        const L = ts([6, 'x']), R = n === 0 ? ts([dc(5), 'x'], [base, '']) : ts([dc(5), 'x'], [base, ''], [ahead ? 180 : -180, '']), sol = solve(L, R, 'x');
        const hands = `분침은 60분에 360°를 돌므로 1분에 6°씩 움직이고, 시침은 60분에 30°를 돌므로 1분에 0.5°씩 움직인다. ${h}시 정각에 시침은 12시 방향에서 ${base}°만큼 돌아간 곳에 있다. ${h}시 ${x}분에 12시 방향에서 돌아간 각의 크기는 분침이 ${nb(`6${x}°`)}, 시침이 ${nb(`(0.5${x} + ${base})°`)}이다.`;
        return F(n === 0 ? `${h}시와 ${h + 1}시 사이에 시계의 시침과 분침이 겹치는 시각은 ${h}시 몇 분인가?` : `${h}시와 ${h + 1}시 사이에 시계의 시침과 분침이 서로 반대 방향으로 일직선을 이루는 시각은 ${h}시 몇 분인가?`, sol.v.p, sol.v.q, {
          improper: true, anyForm: true, unit: '분',
          explain: n === 0 ? `${hands} 두 바늘이 겹치면 두 각의 크기가 같으므로 ${told(L, R)}`
            : `${hands} 두 바늘이 서로 반대 방향으로 일직선을 이루면 두 각의 크기의 차가 180°이다. ${h}시와 ${h + 1}시 사이에서는 ${ahead ? '분침이 시침보다' : '시침이 분침보다'} 180°만큼 더 돌아간 곳에 있을 때이므로 ${told(L, R)}`,
          facts: { value: `(360/12*${h}${n === 0 ? '' : ahead ? '+180' : '-180'})/(360/60-360/12/60)`, unseen: [360, 12, 60, 180], rule: 'clock-' + n }
        });
      }, { count: 2 }),
      H('hard-evaporate', '물을 증발시킨 뒤 소금을 더 넣어 농도 맞추기', '심48', (d) => {
        // 물을 증발시켜도 소금의 양은 그대로이고, 소금을 더 넣으면 소금의 양과 소금물의 양이 함께 늘어난다.
        const m = d.until(() => { const p = d.int(4, 15), w = 100 * d.int(2, 6), e = 50 * d.int(1, 4), r = d.pick([10, 20, 25, 30, 40]); return { p, w, e, r, v: (r * (w - e) - p * w) / (100 - r) }; }, (t) => t.e <= t.w - 100 && Number.isInteger(t.v) && t.v >= 5 && t.v <= 200);
        const { p, w, e, r, v } = m, salt = p * w / 100, rest = w - e, L = ts([salt, ''], [1, 'x']), R = [tg(pct(r), ts([rest, ''], [1, 'x']))];
        return N(`${p} %의 소금물 ${w} g에서 물 ${e} g을 증발시킨 뒤, 소금을 더 넣어 ${r} %의 소금물을 만들려고 한다. 더 넣어야 하는 소금의 양은 몇 g인가?`, v, {
          unit: 'g',
          explain: `물을 증발시켜도 소금의 양은 변하지 않는다. 처음 소금물에 든 소금의 양은 ${nb(`${frac(p, 100)} × ${w} = ${salt}`)}(g)이고, 물 ${e} g을 증발시키면 소금물의 양은 ${nb(`${w} − ${e} = ${rest}`)}(g)이다. 소금을 ${xu('g')} 더 넣으면 소금의 양은 ${nb(`(${salt} + ${x})`)} g, 소금물의 양은 ${nb(`(${rest} + ${x})`)} g이 되고, 소금의 양이 소금물의 양의 ${r} %이다. ${told(L, R)}`,
          facts: { value: `(${r}*(${w}-${e})-${p}*${w})/(100-${r})`, unseen: [100] }
        });
      }),
      H('hard-work-three', '세 사람이 세 구간으로 나누어 하는 일', '심51', (d) => {
        // 혼자 → 둘이 함께 → 혼자의 세 구간이다. 마지막 구간의 날수는 걸린 날수에서 앞의 두 구간을 빼어 한 문자로 나타낸다.
        const DAYS = [6, 8, 9, 10, 12, 15, 16, 18, 20, 24, 30, 36];
        const m = d.until(() => ({ a: d.pick(DAYS), b: d.pick(DAYS), c: d.pick(DAYS), t: d.int(2, 8), v: d.int(2, 6), y: d.int(1, 6) }), (r) => r.a !== r.b && r.b !== r.c && r.a !== r.c && r.v !== r.y && r.v !== r.t && r.v * r.b * r.c + r.t * r.a * r.c + r.t * r.a * r.b + r.y * r.a * r.c === r.a * r.b * r.c);
        const { a, b, c, t, v, y } = m, total = v + t + y, [p1, p2, p3] = d.shuffle(NAMES).slice(0, 3), both = Q(t * (b + c), b * c);
        const L = [tm(Q(1, a), 'x'), tm(both, ''), tf(ts([total - t, ''], [-1, 'x']), b, 1)], R = ts([1, '']);
        return N(`어떤 일을 혼자서 끝내는 데 ${name(p1, '은/는')} ${a}일, ${name(p2, '은/는')} ${b}일, ${name(p3, '은/는')} ${c}일이 걸린다. 이 일을 ${name(p1, '이/가')} 혼자 며칠 동안 하다가, 이어서 ${name(p2, '과/와')} ${name(p3, '이/가')} 함께 ${t}일 동안 하고, 나머지를 ${name(p2, '이/가')} 혼자 하여 일을 시작한 지 ${total}일 만에 끝냈다. ${name(p1, '이/가')} 혼자 일한 날은 며칠인가?`, v, {
          unit: '일',
          explain: `전체 일의 양을 1이라 하면 하루에 하는 일의 양은 ${name(p1, '이/가')} ${nb(frac(1, a) + ',')} ${name(p2, '이/가')} ${nb(frac(1, b) + ',')} ${name(p3, '이/가')} ${nb(frac(1, c) + '이다.')} ${name(p1, '이/가')} 혼자 일한 날을 ${x}일이라 하면 ${name(p2, '이/가')} 마지막에 혼자 일한 날은 ${nb(`${total} − ${t} − ${x} = ${total - t} − ${x}`)}(일)이다. ${name(p2, '과/와')} ${name(p3, '이/가')} 함께 ${t}일 동안 한 일의 양은 ${nb(`${t} × (${frac(1, b)} + ${frac(1, c)}) = ${tx(both)}`)}이다. 세 구간에서 한 일의 양의 합이 1이므로 ${told(L, R)}`,
          facts: { value: `(1-${t}*(1/${b}+1/${c})-(${total}-${t})/${b})/(1/${a}-1/${b})`, unseen: [1] }
        });
      }),
      H('hard-margin', '할인하여 팔아도 이익이 남게 하는 정가', '심52', (d) => {
        // 할인은 정가에 걸고 이익은 원가에 건다. 할인한 값이 원가에 이익을 더한 값과 같다.
        const m = d.until(() => { const cost = 1000 * d.int(2, 10), p = d.pick([10, 20, 25, 30, 40]), q = d.pick([5, 8, 10, 12, 15, 20, 26, 30, 35, 40, 44, 50]); return { cost, p, q, v: cost * (p + q) / (100 - p) }; }, (t) => Number.isInteger(t.v) && t.v % 100 === 0 && t.v < t.cost && t.v <= 9900);
        const { cost, p, q, v } = m, sold = cost * (100 + q) / 100, L = [tg(pct(100 - p), ts([1, 'x'], [cost, '']))], R = ts([sold, '']);
        return N(`원가가 ${cost}원인 물건이 있다. 정가의 ${p} %를 할인하여 팔아도 원가의 ${q} %의 이익이 남게 하려면, 원가에 얼마의 이익을 붙여 정가를 정해야 하는가?`, v, {
          unit: '원',
          explain: `원가에 ${x}원의 이익을 붙이면 정가는 ${nb(`(${x} + ${cost})`)}원이다. 정가의 ${p} %를 할인한 값은 정가의 ${100 - p} %이므로 ${nb(sideH(L, true))}원이다. 원가의 ${q} %의 이익이 남으려면 판 값이 ${nb(`${cost} + ${cost} × ${frac(q, 100)} = ${sold}`)}(원)이어야 한다. ${told(L, R)}`,
          facts: { value: `${cost}*(100+${q})/(100-${p})-${cost}`, unseen: [100] }
        });
      }),
      H('hard-leftover', '남은 것의 몇 분의 몇을 거듭 주고 남은 수에서 처음 수 구하기', '심53', (d) => {
        // 함정: 둘째로 준 것은 처음 수가 아니라 「남은 것」의 몇 분의 몇이다. 처음 수의 몇 분의 몇으로 식을 세우는 아이가 걸린다.
        const m = d.until(() => { const k1 = d.pick([2, 3, 4, 5]), k2 = d.pick([2, 3, 4]), e1 = d.int(1, 4), e2 = d.int(1, 3), e3 = d.int(1, 3), last = d.int(1, 5), r1 = (last + e3 + e2) * k2 / (k2 - 1); return { k1, k2, e1, e2, e3, last, r1, v: (r1 + e1) * k1 / (k1 - 1) }; }, (t) => t.k1 !== t.k2 && Number.isInteger(t.r1) && Number.isInteger(t.v) && t.v <= 90 && t.v % t.k1 === 0 && t.r1 % t.k2 === 0);
        const { k1, k2, e1, e2, e3, last, v } = m, who = d.pick(NAMES), inner = [tm(Q(k1 - 1, k1), 'x'), tm(-e1, '')], second = [tg(Q(k2 - 1, k2), inner), tm(-e2, '')], L = second.concat([tm(-e3, '')]), R = ts([last, '']);
        return N(`${name(who, '은/는')} 구슬을 몇 개 가지고 있었다. 먼저 가진 구슬의 ${frac(1, k1)}과 ${e1}개를 동생에게 주고, 다음에 남은 구슬의 ${frac(1, k2)}과 ${e2}개를 친구에게 주었다. 마지막으로 ${e3}개를 잃어버렸더니 ${last}개가 남았다. ${name(who, '이/가')} 처음에 가지고 있던 구슬은 몇 개인가?`, v, {
          unit: '개',
          explain: `처음에 가지고 있던 구슬의 수를 ${x}라 하자. 동생에게 주고 남은 구슬의 수는 ${nb(`${x} − ${frac(x, k1)} − ${e1} = ${sideH(inner, true)}`)}이다. 친구에게 준 것은 이 남은 구슬의 ${frac(1, k2)}과 ${e2}개이므로 그 뒤에 남은 구슬의 수는 ${nb(sideH(second, true))}이다. 여기에서 ${e3}개를 잃어버리고 ${last}개가 남았으므로 ${told(L, R)}`,
          facts: { value: `((${last}+${e3}+${e2})*${k2}/(${k2}-1)+${e1})*${k1}/(${k1}-1)`, unseen: [1] }
        });
      }),
      H('hard-pairing', '상대의 수가 한 명씩 늘어나는 짝에서 사람 수 구하기', '심54', (d) => {
        // 함정: 몇 번째 여학생인가와 상대한 남학생의 수의 차가 늘 같다는 것을 찾아야 식이 선다. 마지막 여학생의 차례가 여학생의 수이고, 그 상대가 남학생 전체이다.
        const s = d.int(4, 9), girls = d.int(5, 12), boys = girls + s - 1, all = boys + girls, L = [tm(1, 'x'), tg(1, ts([1, 'x'], [-(s - 1), '']))], R = ts([all, '']);
        return N(`어느 탁구 모임에 남학생과 여학생이 합하여 ${all}명 있다. 첫 번째 여학생은 남학생 ${s}명과 한 번씩 경기를 하였고, 두 번째 여학생은 남학생 ${s + 1}명과, 세 번째 여학생은 남학생 ${s + 2}명과 한 번씩 경기를 하였다. 이와 같이 상대하는 남학생을 한 명씩 늘려 갔더니 마지막 여학생은 남학생 모두와 한 번씩 경기를 하였다. 이 모임의 남학생은 몇 명인가?`, boys, {
          unit: '명',
          explain: `첫 번째 여학생은 남학생 ${s}명, 두 번째 여학생은 ${s + 1}명, 세 번째 여학생은 ${s + 2}명과 경기를 하였으므로 상대한 남학생의 수는 여학생의 차례보다 늘 ${s - 1}만큼 크다. 마지막 여학생의 차례는 여학생의 수와 같고, 이 여학생이 상대한 남학생의 수는 남학생 전체의 수이다. 남학생의 수를 ${x}라 하면 여학생의 수는 ${nb(`${x} − ${s - 1}`)}이다. ${told(L, R)}`,
          facts: { value: `(${all}+${s}-1)/2`, unseen: [1, 2] }
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
