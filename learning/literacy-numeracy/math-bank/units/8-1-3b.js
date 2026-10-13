// 중학교 2학년 1학기 3단원 일차부등식 — 뒤쪽 묶음(여러 가지 일차부등식, 해의 조건과 수 구하기, 활용).
// 단원 틀과 도구, 싣는 기준, 뺀 것과 까닭은 8-1-3a.js 에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
// 풀이 문항은 부등식의 구조가 다른 것만 따로 싣고(차례마다 facts.rule 의 이름이 다르다) 답은 「x [부등호] [수]」 칸으로 받는다. 해의 경계가 분수인 것은 고르기로 낸다.
// 풀이 글은 줄마다 한 단계(분모·소수 없애기 → 괄호 풀기 → 동류항 정리 → 이항 → 양변을 나누기)를 보인다(8-1-3a.js 의 solve).
// 활용은 상황마다 한 유형이다. 답이 자연수여야 하는 것은 범위에서 다시 고른다: 「이하·넘지 않게」는 끝 수가 들고, 「미만·초과·유리하다·많아진다」는 끝 수가 들지 않는다.
//  - 경계가 자연수로 딱 떨어지는 것과 떨어지지 않는 것(버림·올림)을 섞었다. 검사 근거는 문제의 수로 바로 셈한 식(calc)이거나 정수 x 를 차례로 넣어 보는 부등식(range)이다.
//  - 교육과정의 금(지나치게 복잡한 활용)에 따라 농도, 원가·정가·할인·이익, 일의 양, 도중에 바뀌는 속력은 싣지 않았다.
//    왕복에 머무는 시간이 있는 꼴(①53 ②58 심44)은 머무는 시간을 시간 단위로 주어 단위 바꾸기를 뺀 꼴로 바꾸어 실었다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, nick, NAMES, frac, N, C } = B.kit;
  const { LAB, MINUS, lcm, Q, dc, dc2, qadd, qsub, qmul, qneg, qcmp, tx, nb, tail, js, nz, pm, co, ansV, ineqAns } = B.kit.mid;
  const { T, x, va, iq, RH, FLIP, strict, up, tm, tg, tf, ts, sideH, ineqH, iqB, iqF, termH, solH, tagEq, procFig, evS, holds, gather, solI, flatS, scS, denS, solJ, rangeJ, solve, relate, anyRel, mix, lean, pickIq, solveQ, solveC, rayLine } = B.kit.m813;
  const UNIT = '8-1-3';
  // 10의 배수가 아닌 수(소수 한 자리·두 자리로 적을 수)
  const off10 = (d, lo, hi) => d.until(() => d.int(lo, hi), (v) => v % 10 !== 0);
  // 부등식을 세운 뒤의 풀이 글
  const told = (L, r, R) => `부등식을 세우면 ${iqB(L, r, R)}이다. ${solve(L, r, R, 'x').text}`;
  // 분수인 경계가 놓인 두 자연수 사이: 36 < 110/3 < 37
  const between = (v) => { const lo = Math.floor(v.p / v.q); return nb(`${lo} ${RH['<']} ${tx(v)} ${RH['<']} ${lo + 1}`); };

  // ── 여러 가지 일차부등식 ──
  // 풀이 과정에서 처음으로 틀린 줄 찾기에 쓰는 줄 만들기. 줄은 [좌변, 부등호, 우변]이다.
  const lineH = ([L, r, R]) => ineqH(L, r, R);
  const lineB = ([L, r, R]) => iqB(L, r, R);
  const doScale = ([L, r, R], n) => [scS(L, n), r, scS(R, n)];
  const doFlat = ([L, r, R]) => [flatS(L), r, flatS(R)];
  // x 를 포함한 항은 좌변으로, 상수항은 우변으로 옮긴 줄(정리하기 전). slip: 상수항을 부호를 바꾸지 않고 옮긴다.
  function doMove([L, r, R], slip) {
    const gl = gather(L, 'x'), gr = gather(R, 'x');
    return [ts([gl.a, 'x'], [qneg(gr.a), 'x']), r, ts([gr.b, ''], [slip ? gl.b : qneg(gl.b), ''])];
  }
  const doTidy = ([L, r, R]) => { const gl = gather(L, 'x'), gr = gather(R, 'x'); return [ts([qsub(gl.a, gr.a), 'x']), r, ts([qsub(gr.b, gl.b), ''])]; };
  // 양변을 x 의 계수로 나눈 줄. slip: 음수로 나누면서 부등호의 방향을 그대로 둔다.
  const doDivide = ([L, r, R], slip) => { const p = gather(L, 'x').a, q = evS(R, { x: Q(0) }); return [ts([1, 'x']), p.p < 0 && !slip ? FLIP[r] : r, [tm(Q(q.p * p.q, q.q * p.p), '')]]; };
  // 묶음을 풀 때 뒤 항의 부호를 바꾸지 않은 줄(−3(x − 2) 를 −3x − 6 으로)
  function slipFlat([L, r, R]) {
    let done = false;
    const open = (list) => list.reduce((all, t) => {
      if (t.k === 'm') return all.concat([[t.c, t.vs]]);
      const inner = flatS(t.list).map((u) => [qmul(t.m, u.c), u.vs]);
      if (!done && t.m.p < 0 && inner.length > 1) { done = true; inner[inner.length - 1][0] = qneg(inner[inner.length - 1][0]); }
      return all.concat(inner);
    }, []);
    const l = open(L), rr = open(R);
    return done ? [ts(...l), r, ts(...rr)] : null;
  }
  // 양변에 n 을 곱하면서 정수인 상수항에는 곱하지 않은 줄
  const slipScale = ([L, r, R], n) => { const one = (list) => list.reduce((all, t) => all.concat(t.k === 'm' && !t.vs && t.c.q === 1 && !t.c.d ? [t] : scS([t], n)), []); return [one(L), r, one(R)]; };

  B.addTypes(UNIT, 'forms', [
    T('solve-paren', '괄호가 있는 일차부등식', '①24 ②27', (d, n) => {
      // 차례마다 구조가 다르다: 괄호 앞의 수가 양수인 괄호 하나, 괄호 앞이 음수이거나 괄호가 둘.
      const u = () => d.int(1, 9);
      const make = [
        () => d.pick([
          () => [[tg(d.int(2, 5), ts([u(), ''], [-1, 'x']))], anyRel(d), ts([d.int(8, 20), ''], [-1, 'x'])],
          () => [[tm(u(), ''), tg(d.int(2, 5), ts([1, 'x'], [-u(), '']))], anyRel(d), ts([d.int(2, 3), 'x'], [u(), ''])],
          () => [ts([d.int(5, 9), 'x'], [-u(), '']), anyRel(d), [tg(d.int(2, 4), ts([d.int(1, 3), 'x'], [u(), '']))]]
        ])(),
        () => d.pick([
          () => [ts([1, 'x'], [-u(), '']), anyRel(d), [tg(-1, ts([1, 'x'], [-u(), '']))]],
          () => [[tm(d.int(2, 4), 'x'), tg(-1, ts([d.int(5, 7), 'x'], [-u(), '']))], anyRel(d), ts([-u(), ''])],
          () => [[tm(u(), ''), tg(-d.int(2, 4), ts([u(), ''], [1, 'x']))], anyRel(d), ts([d.int(2, 4), 'x'])],
          () => [[tg(d.int(2, 4), ts([1, 'x'], [-u(), '']))], anyRel(d), [tg(d.int(3, 6), ts([1, 'x'], [-u(), '']))]]
        ])()
      ][n], [L, r, R] = pickIq(d, make, 'int');
      return solveQ(L, r, R, 'paren-' + n);
    }, { count: 2 }),
    T('solve-decimal', '계수가 소수인 일차부등식', '①25 ①26 ②28 ②30', (d, n) => {
      // 차례마다 구조가 다르다: 소수 한 자리끼리, 정수인 항이나 소수 두 자리가 섞임(정수인 항에도 곱한다), 소수가 곱해진 괄호.
      const make = [
        () => [ts([dc(off10(d, 1, 19)), 'x'], [dc(-off10(d, 1, 29)), '']), anyRel(d), d.bool() ? ts([dc(off10(d, 1, 19)), 'x']) : ts([dc(off10(d, 1, 19)), 'x'], [dc(pm(d) * off10(d, 1, 29)), ''])],
        () => (d.bool() ? [ts([dc(off10(d, 11, 19)), 'x'], [d.int(1, 4), '']), anyRel(d), ts([dc(off10(d, 1, 19)), 'x'], [dc(off10(d, 11, 49)), ''])]
          : [ts([dc2(d.pick([15, 25, 35, 45])), 'x'], [dc(off10(d, 1, 9)), '']), anyRel(d), ts([dc(off10(d, 1, 5)), 'x'], [dc(-off10(d, 1, 19)), ''])]),
        () => (d.bool() ? [[tg(dc(off10(d, 1, 9)), ts([1, 'x'], [-d.int(1, 5), '']))], anyRel(d), [tg(dc(off10(d, 1, 9)), ts([d.int(2, 3), 'x'], [-d.int(1, 5), '']))]]
          : [[tg(dc(off10(d, 1, 9)), ts([d.int(1, 3), 'x'], [d.int(1, 9), '']))], anyRel(d), ts([dc(off10(d, 1, 19)), 'x'], [dc(-off10(d, 1, 29)), ''])])
      ][n], [L, r, R] = pickIq(d, make, 'int');
      return solveQ(L, r, R, 'decimal-' + n);
    }, { count: 3 }),
    T('solve-frac-coef', '계수가 분수인 일차부등식', '①27 ②29', (d, n) => {
      // 첫째는 x 의 계수만 분수, 둘째는 상수항도 분수이다.
      // 어느 꼴로 낼지는 먼저 정한다(다시 뽑는 동안 쉬운 꼴로 쏠리지 않게).
      const both = d.bool();
      const make = [
        () => { const q = d.pick([2, 3, 4, 5]), s = d.until(() => d.pick([2, 3, 4, 6]), (v) => v !== q); return [ts([Q(co(d, q, 1, 5), q), 'x'], [-d.int(1, 12), '']), anyRel(d), both ? ts([Q(1, s), 'x']) : ts([Q(pm(d), s), 'x'], [d.int(1, 9), ''])]; },
        () => { const q = d.pick([2, 3, 4, 6]), s = d.pick([2, 3, 4, 6]), t = d.until(() => d.pick([2, 3, 4, 6]), (v) => v !== s); return both ? [ts([Q(1, q), 'x'], [Q(co(d, s, 1, s - 1), s), '']), anyRel(d), ts([Q(co(d, t, 1, 2 * t), t), ''], [Q(-1, d.pick([2, 3, 4])), 'x'])] : [ts([Q(1, q), 'x'], [Q(-co(d, s, 1, s - 1), s), '']), anyRel(d), ts([Q(co(d, t, 1, t - 1), t), ''])]; }
      ][n], [L, r, R] = pickIq(d, make, 'int');
      return solveQ(L, r, R, 'frac-coef-' + n);
    }, { count: 2 }),
    T('solve-frac-num', '분자가 일차식인 분수가 있는 일차부등식', '①28 ②29', (d, n) => {
      // 차례마다 구조가 다르다: 분수끼리의 뺄셈(분자 전체에 −가 걸린다), 분수가 아닌 항이 낌, 양변에 분수 하나씩.
      const make = [
        () => { const m = d.pick([2, 3, 4]), k = d.until(() => d.pick([3, 4, 5, 6]), (v) => v !== m); return [[tf(ts([1, 'x'], [-d.int(1, 6), '']), m, 1), tf(ts([d.int(1, 3), 'x'], [pm(d) * d.int(1, 6), '']), k, -1)], anyRel(d), ts([d.pick([0, 0, 1, -1, 2]), ''])]; },
        () => { const m = d.pick([2, 3, 4, 5]), k = d.until(() => d.pick([2, 3, 4]), (v) => v !== m); return d.bool() ? [[tf(ts([d.int(1, 3), 'x'], [-d.int(1, 9), '']), m, 1), tm(1, 'x')], anyRel(d), ts([d.int(1, 5), ''])] : [[tf(ts([1, 'x'], [-d.int(1, 5), '']), m, 1)], anyRel(d), [tf(ts([d.int(1, 3), 'x'], [d.int(1, 6), '']), k, 1), tm(d.int(1, 3), '')]]; },
        () => { const m = d.pick([2, 3, 4]), k = d.until(() => d.pick([3, 4, 5, 6, 8]), (v) => v !== m); return [[tf(ts([d.int(1, 3), 'x'], [pm(d) * d.int(1, 6), '']), m, 1)], anyRel(d), [tf(ts([d.int(1, 5), 'x'], [pm(d) * d.int(1, 6), '']), k, 1)]]; }
      ][n], [L, r, R] = pickIq(d, make, 'int');
      return solveQ(L, r, R, 'frac-num-' + n);
    }, { count: 3 }),
    T('solve-mixed', '소수와 분수가 섞인 일차부등식', '①29 ②30 심16', (d, n) => {
      // 첫째는 소수 계수와 분수 계수(분수가 곱해진 괄호), 둘째는 분자가 일차식인 분수와 소수 계수이다.
      const DEC = [dc(5), dc(2), dc(4), dc(6), dc(15), dc(25)];
      const make = [
        () => (d.bool() ? [ts([d.pick(DEC), 'x'], [-d.int(1, 3), '']), anyRel(d), [tg(Q(1, d.pick([3, 4, 6])), ts([1, 'x'], [d.int(1, 6), '']))]]
          : [ts([d.pick(DEC), 'x'], [dc2(d.pick([25, 75])), '']), anyRel(d), ts([Q(1, d.pick([2, 4])), 'x'], [Q(1, d.pick([2, 4])), ''])]),
        () => (d.bool() ? [[tf(ts([d.int(1, 4), 'x'], [-d.int(1, 6), '']), d.pick([2, 5]), 1)], anyRel(d), ts([dc(off10(d, 11, 39)), 'x'], [dc(off10(d, 1, 39)), ''])]
          : [ts([Q(co(d, 5, 1, 4), 5), 'x'], [dc(-off10(d, 1, 19)), '']), anyRel(d), ts([Q(co(d, 10, 1, 9), 10), 'x'], [dc(off10(d, 1, 19)), ''])])
      ][n], [L, r, R] = pickIq(d, make, 'int');
      return solveQ(L, r, R, 'mixed-' + n);
    }, { count: 2 }),
    T('forms-frac-answer', '괄호·분수가 있고 해의 경계가 분수인 일차부등식', '①26 ①28 ②27 ②29', (d) => {
      const u = () => d.int(1, 9), m = d.pick([3, 4, 5]), k = d.until(() => d.pick([2, 3, 4]), (v) => v !== m);
      const [L, r, R] = pickIq(d, () => (d.bool() ? [ts([d.int(5, 9), 'x'], [-u(), '']), anyRel(d), [tg(d.int(2, 3), ts([d.int(1, 3), 'x'], [u(), '']))]]
        : [[tf(ts([d.int(1, 3), 'x'], [u(), '']), m, 1)], anyRel(d), [tf(ts([1, 'x'], [-u(), '']), k, 1)]]), 'frac');
      return solveC(d, L, r, R, 'forms-frac-answer');
    }),
    T('solve-wrong-line', '풀이 과정에서 처음으로 틀린 곳 찾기', '①30', (d, n) => {
      // 첫째: 계수를 정수로 고치거나 괄호를 풀 때의 잘못(정수인 항에 곱하지 않음, 분자의 뒤 항의 부호). 둘째: 괄호 앞의 음수와 음수로 나누기(부호, 이항, 부등호의 방향).
      // 틀린 줄 뒤의 줄은 그 줄에서 바르게 이어 간다(처음으로 틀린 곳이 하나로 정해진다).
      const m = d.until(() => {
        let given, steps, slipAt, fix;
        if (n === 0 && d.bool()) {
          // 소수 계수: 1.2x < 0.7x + 6. ㉠ 양변에 10 → ㉡ 이항 → ㉢ 정리 → ㉣ 나누기
          const a = off10(d, 11, 29), b = off10(d, 1, 9), c = d.int(2, 9), r = anyRel(d);
          given = [ts([dc(a), 'x']), r, ts([dc(b), 'x'], [c, ''])]; slipAt = d.int(0, 1);
          steps = [(row, bad) => (bad ? slipScale(row, 10) : doScale(row, 10)), (row, bad) => doMove(row, bad), (row) => doTidy(row), (row) => doDivide(row)];
          fix = slipAt === 0 ? `양변에 10을 곱할 때 정수인 항 ${c}에도 10을 곱해야 한다.` : '이항할 때는 항의 부호가 바뀐다.';
          if (slipAt === 1) given = [ts([dc(a), 'x'], [dc(c), '']), r, ts([dc(b), 'x'], [dc(off10(d, 11, 59)), ''])];
        } else if (n === 0) {
          // 분자가 일차식인 분수: (x + 2)/4 − (2x + 1)/3 ≤ 1. ㉠ 양변에 12 → ㉡ 괄호 풀기 → ㉢ 이항하여 정리 → ㉣ 나누기
          const p = d.pick([2, 3, 4]), q = d.until(() => d.pick([3, 4, 5]), (v) => v !== p && lcm(v, p) === v * p), c = d.int(1, 3), r = anyRel(d), all = p * q;
          given = [[tf(ts([1, 'x'], [d.int(1, 5), '']), p, 1), tf(ts([d.int(1, 3), 'x'], [d.int(1, 5), '']), q, -1)], r, ts([c, ''])]; slipAt = d.int(0, 1);
          steps = [(row, bad) => (bad ? slipScale(row, all) : doScale(row, all)), (row, bad) => (bad ? slipFlat(row) : doFlat(row)), (row) => doTidy(doMove(row)), (row) => doDivide(row)];
          fix = slipAt === 0 ? `양변에 ${all}${tail(all, '을/를')} 곱할 때 정수인 항 ${c}에도 ${all}${tail(all, '을/를')} 곱해야 한다.` : '괄호 앞에 −가 있으면 괄호 안의 모든 항의 부호가 바뀐다.';
        } else {
          // 괄호 앞이 음수: −3(x − 2) ≥ 2x − 9. ㉠ 괄호 풀기 → ㉡ 이항 → ㉢ 정리 → ㉣ 나누기(음수로 나눈다)
          const k = d.int(2, 4), c = d.int(1, 4), r = anyRel(d);
          given = [[tg(-k, ts([1, 'x'], [-d.int(1, 6), '']))], r, ts([c, 'x'], [pm(d) * d.int(1, 12), ''])]; slipAt = d.pick([0, 1, 3, 3]);
          steps = [(row, bad) => (bad ? slipFlat(row) : doFlat(row)), (row, bad) => doMove(row, bad), (row) => doTidy(row), (row, bad) => doDivide(row, bad)];
          fix = slipAt === 0 ? '괄호 앞의 수가 음수이면 괄호 안의 모든 항의 부호가 바뀐다.' : slipAt === 1 ? '이항할 때는 항의 부호가 바뀐다.' : '양변을 음수로 나누면 부등호의 방향이 바뀐다.';
        }
        const rows = [given], good = [given];
        steps.forEach((step, i) => { rows.push(step(rows[i], i === slipAt)); good.push(step(good[i], false)); });
        return { rows, good, slipAt, fix };
      }, (t) => {
        if (t.rows.some((row) => !row)) return false;
        const ok = t.rows.slice(1).map((row, i) => relate(t.rows[i], row, ['x'])), last = t.good[4][2][0].c, end = t.rows[4][2][0].c;
        const one = (row) => { const c = gather(row[0], 'x').a; return c.p === 1 && c.q === 1; };
        return lean(t.rows[0][0]) && !one(t.rows[3]) && !one(t.good[3]) && ok.filter((v) => !v).length === 1 && ok.indexOf(false) === t.slipAt && last.q === 1 && last.p !== 0 && Math.abs(last.p) <= 12 && end.q <= 12 && Math.abs(end.p) <= 60 && end.p !== 0
          && t.rows.every(([L, , R]) => L.concat(R).every((u) => u.k !== 'm' || Math.abs(u.c.p) <= 120));
      });
      const { rows, good, slipAt, fix } = m;
      return C('다음은 일차부등식을 푸는 과정이다. 처음으로 틀린 곳은?', LAB.slice(0, 4), slipAt, {
        figure: procFig([{ h: lineH(rows[0]) }].concat(rows.slice(1).map((row, i) => ({ h: lineH(row), mark: LAB[i] })))),
        explain: `${fix} ${LAB[slipAt]}은 ${lineB(good[slipAt + 1])}이어야 한다. 바르게 풀면 해는 ${lineB(good[4])}이다.`,
        facts: { truth: rows.slice(1).map((row, i) => !relate(rows[i], row, ['x'])), want: true, rule: 'wrong-line-' + n }
      });
    }, { count: 2 })
  ]);

  // ── 해의 조건과 수 구하기 ──
  // 상수 a 가 든 부등식(a 는 x 에 곱해져 있지 않다)에서 (좌변 − 우변) = P x + A a + C 의 계수(정수가 되게 분모를 없앤 것)
  function parts(L, R) {
    const at = (xv, av) => qsub(evS(L, { x: Q(xv), a: Q(av) }), evS(R, { x: Q(xv), a: Q(av) })), c = at(0, 0), P = qsub(at(1, 0), c), A = qsub(at(0, 1), c);
    const n = lcm(lcm(P.q, A.q), c.q), k = (q) => qmul(q, Q(n)).p;
    return { P: k(P), A: k(A), C: k(c), n };
  }
  // 그 부등식을 x 에 대하여 푼 글과, 해가 「x rel v」일 때 a 를 구하는 글
  function paramTold(L, r, R, v, a0) {
    // a 의 항과 상수항 가운데 양수인 것을 앞에 적는다(−a + 9 가 아니라 9 − a).
    const two = (ka, kc) => (ka < 0 && kc > 0 ? ts([kc, ''], [ka, 'a']) : ts([ka, 'a'], [kc, '']));
    const { P, A, C: c0, n } = parts(L, R), rel = P < 0 ? FLIP[r] : r, rhs = two(-A, -c0);
    const whole = A % P === 0 && c0 % P === 0, quot = whole ? sideH(two(-A / P, -c0 / P), true) : P < 0 ? frac(sideH(two(A, c0), true), -P) : frac(sideH(rhs, true), P);
    const first = `${n > 1 ? `양변에 ${n}${tail(n, '을/를')} 곱하고 ` : ''}${x}를 포함한 항은 좌변으로, 나머지 항은 우변으로 이항하여 정리하면 ${iqB(ts([P, 'x']), r, rhs)}이다.`;
    const divide = P === 1 ? '' : ` 양변을 ${P < 0 ? '음수 ' : ''}${iq(P)}${tail(Math.abs(P), '으로/로')} 나누면 ${P < 0 ? '부등호의 방향이 바뀌어 ' : ''}${nb(`${x} ${RH[rel]} ${quot}`)}이다.`;
    return { rel, text: `${first}${divide} 이 해가 ${solH('x', rel, v)}${tail(Math.abs(v), '과/와')} 같으므로 ${nb(`${quot} = ${iq(v)}`)}에서 ${nb(`${va} = ${iq(a0)}`)}이다.` };
  }
  // 조건에 맞는 부등식과 a 의 값, 그때의 해를 고른다. want(rel): 해의 부등호에 거는 조건
  function pickParam(d, makeIneq, want, ok) {
    return d.until(() => { const [L, r, R] = makeIneq(), a0 = nz(d, -9, 9); return { L, r, R, a0, s: solI(L, r, R, 'x', { a: Q(a0) }) }; },
      (t) => { const k = parts(t.L, t.R); return Boolean(t.s) && lean(t.L) && lean(t.R) && k.A !== 0 && t.s.v.q === 1 && t.s.v.p !== 0 && Math.abs(t.s.v.p) <= 9 && Math.abs(k.P) <= 12 && Math.abs(k.C) <= 60 && (!want || want(t.s.rel)) && (!ok || ok(t)); });
  }
  const paramFacts = (m, rule) => { const j = solJ(m.L, m.R, 'a', { x: js(Q(m.s.v.p)) }); return { value: j.expr, unseen: j.unseen, rule }; };

  B.addTypes(UNIT, 'param', [
    T('sol-extreme-int', '해 가운데 가장 큰 정수·가장 작은 정수', '①31 ②36 심19', (d, n) => {
      if (n === 0) {
        // 경계가 정수: 등호가 있으면 그 수, 없으면 하나 작은 수
        const [L, r, R] = pickIq(d, () => [ts([dc(off10(d, 1, 9)), 'x'], [dc(-off10(d, 1, 39)), '']), anyRel(d), ts([dc(off10(d, 1, 9)), 'x'], [dc(off10(d, 1, 39)), ''])], 'int', (l, rel, rr, s) => !up(s.rel));
        const s = solve(L, r, R, 'x'), v = s.v.p, ans = strict(s.rel) ? v - 1 : v;
        return N(`다음 일차부등식을 만족시키는 ${x}의 값 가운데 가장 큰 정수는?`, ans, {
          signed: true, figure: iqF(L, r, R),
          explain: `${s.text} ${strict(s.rel) ? `${iq(v)}${tail(Math.abs(v), '은/는')} 해에 들지 않으므로 가장 큰 정수는 ${iq(ans)}이다.` : `${iq(v)}도 해에 들므로 가장 큰 정수는 ${iq(ans)}이다.`}`,
          facts: { range: { ineq: rangeJ(L, r, R), lo: ans - 6, hi: ans + 6, want: 'max' }, rule: 'extreme-0' }
        });
      }
      // 경계가 분수: 그 수보다 큰 정수 가운데 가장 작은 수
      const [L, r, R] = pickIq(d, () => { const p = d.pick([2, 3, 4, 5]), q = d.pick([2, 3, 4]); return d.bool() ? [[tf(ts([d.int(2, 4), 'x'], [-d.int(1, 5), '']), p, 1)], anyRel(d), ts([1, 'x'], [Q(-co(d, q, 1, q - 1), q), ''])] : [ts([d.int(3, 9), 'x'], [-d.int(1, 9), '']), anyRel(d), [tg(d.int(2, 3), ts([1, 'x'], [d.int(1, 6), '']))]]; }, 'frac', (l, rel, rr, s) => up(s.rel));
      const s = solve(L, r, R, 'x'), ans = Math.floor(s.v.p / s.v.q) + 1;
      return N(`다음 일차부등식을 만족시키는 ${x}의 값 가운데 가장 작은 정수는?`, ans, {
        signed: true, figure: iqF(L, r, R), explain: `${s.text} ${nb(`${iq(ans - 1)} ${RH['<']} ${tx(s.v)} ${RH['<']} ${iq(ans)}`)}이므로 가장 작은 정수는 ${iq(ans)}이다.`,
        facts: { range: { ineq: rangeJ(L, r, R), lo: ans - 6, hi: ans + 6, want: 'min' }, rule: 'extreme-1' }
      });
    }, { count: 2 }),
    T('sol-natural-count', '자연수인 해·음의 정수인 해의 개수', '①32 ①33 ②37 심20', (d, n) => {
      // 첫째는 자연수인 해(1부터 센다), 둘째는 음의 정수인 해(−1부터 센다). 경계가 정수이면 등호가 있는지에 따라 끝 수가 들고 빠진다.
      const u = () => d.int(1, 9), sign = n === 0 ? 1 : -1;
      const make = () => d.pick([
        () => [ts([nz(d, -9, 9), 'x'], [nz(d, -15, 15), '']), anyRel(d), ts([nz(d, -9, 9), 'x'], [nz(d, -15, 15), ''])],
        () => [[tm(u(), ''), tg(d.int(2, 4), ts([1, 'x'], [-u(), '']))], anyRel(d), ts([d.int(1, 3), 'x'], [d.int(1, 20), ''])],
        () => { const p = d.pick([2, 3]), q = d.pick([3, 4, 5]); return [[tm(d.int(1, 7), ''), tf(ts([1, 'x'], [d.int(1, 5), '']), p, -1)], anyRel(d), [tf(ts([d.int(1, 4), 'x'], [-u(), '']), q, 1)]]; }
      ])();
      const hit = (L, r, R) => [1, 2, 3, 4, 5, 6, 7, 8, 9].map((t) => holds(L, r, R, { x: Q(sign * t) }));
      const [L, r, R] = d.until(make, ([l, rel, rr]) => { const s = solI(l, rel, rr), k = s ? hit(l, rel, rr).filter(Boolean).length : 0; return Boolean(s) && up(s.rel) === (n === 1) && k >= 2 && k <= 6 && s.v.q <= 6 && Math.abs(gather(l, 'x').a.p) <= 9; });
      const s = solve(L, r, R, 'x'), flags = hit(L, r, R), k = flags.filter(Boolean).length, list = Array.from({ length: k }, (_, i) => iq(sign * (i + 1))).join(', ');
      return N(`다음 일차부등식을 만족시키는 ${n === 0 ? '자연수' : '음의 정수'} ${x}는 모두 몇 개인가?`, k, {
        unit: '개', figure: iqF(L, r, R), explain: `${s.text} 이를 만족시키는 ${n === 0 ? '자연수' : '음의 정수'}는 ${list}의 ${k}개이다.`,
        facts: { count: flags, rule: 'natural-count-' + n }
      });
    }, { count: 2 }),
    T('sol-then-max', '부등식을 푼 범위에서 다른 식의 가장 큰 값', '②38', (d) => {
      // 해가 x ≤ v 이면 계수가 양수인 식, x ≥ v 이면 계수가 음수인 식의 값에 가장 큰 값이 있다.
      const [L, r, R] = pickIq(d, () => [ts([nz(d, -6, 6), 'x'], [nz(d, -12, 12), '']), d.pick(['<=', '>=']), ts([nz(d, -6, 6), 'x'], [nz(d, -12, 12), ''])], 'int', (l, rel, rr, s) => Math.abs(s.v.p) <= 6);
      const s = solve(L, r, R, 'x'), k = (up(s.rel) ? -1 : 1) * d.int(2, 5), c = nz(d, -9, 9), top = k * s.v.p + c, j = solJ(L, R, 'x', {}), target = d.bool() ? ts([k, 'x'], [c, '']) : ts([c, ''], [k, 'x']);
      return N(`${iqB(L, r, R)}일 때, ${nb(sideH(target, true))}의 값 가운데 가장 큰 값은?`, top, {
        signed: true, explain: `${s.text} 양변에 ${k < 0 ? '음수 ' : ''}${iq(k)}${tail(Math.abs(k), '을/를')} 곱하면 ${k < 0 ? '부등호의 방향이 바뀌어 ' : ''}${iqB(ts([k, 'x']), '<=', ts([k * s.v.p, '']))}이고, ${c > 0 ? `양변에 ${c}${tail(c, '을/를')} 더하면` : `양변에서 ${-c}${tail(-c, '을/를')} 빼면`} ${iqB(ts([k, 'x'], [c, '']), '<=', ts([top, '']))}이다. 따라서 가장 큰 값은 ${iq(top)}이다.`,
        facts: { calc: [[`${js(Q(k))}*(${j.expr})+${js(Q(c))}`, 0]], unseen: j.unseen }
      });
    }),
    T('param-given', '해가 주어질 때 상수 구하기', '①34 ②40 심25', (d, n) => {
      // 차례마다 구조가 다르다: x 의 계수가 양수가 되는 것, 음수가 되어 방향이 바뀌는 것, 상수가 괄호·분수 안에 있는 것.
      const u = () => d.int(1, 9);
      const make = [
        () => { const c2 = d.int(1, 4), c1 = c2 + d.int(1, 3); return d.bool() ? [ts([c1, 'x'], [-u(), '']), anyRel(d), ts([c2, 'x'], [1, 'a'])] : [ts([c1, 'x'], [1, 'a']), anyRel(d), ts([c2, 'x'], [u(), ''])]; },
        () => { const c1 = d.int(1, 4), c2 = c1 + d.int(1, 3); return d.bool() ? [ts([c1, 'x'], [-u(), '']), anyRel(d), ts([c2, 'x'], [-1, 'a'])] : [ts([u(), ''], [-d.int(2, 4), 'x']), anyRel(d), ts([1, 'a'])]; },
        () => (d.bool() ? [[tg(d.int(2, 4), ts([1, 'x'], [-1, 'a']))], anyRel(d), ts([1, 'x'], [pm(d) * d.int(1, 12), ''])] : [[tf(ts([d.int(1, 3), 'x'], [1, 'a']), d.pick([2, 3]), 1)], anyRel(d), ts([1, 'x'], [pm(d) * d.int(1, 6), ''])])
      ][n], m = pickParam(d, make), v = m.s.v.p, t = paramTold(m.L, m.r, m.R, v, m.a0);
      return ansV(`${x}에 대한 일차부등식 ${iqB(m.L, m.r, m.R)}의 해가 ${solH('x', m.s.rel, v)}일 때, 상수 ${va}의 값은?`, Q(m.a0), 'int', { explain: t.text, facts: paramFacts(m, 'param-' + n) });
    }, { count: 3 }),
    T('param-extreme', '해 가운데 가장 작은(큰) 수가 주어질 때 상수 구하기', '①34 심26', (d) => {
      const u = () => d.int(1, 9);
      const m = pickParam(d, () => (d.bool() ? [ts([u(), ''], [-d.int(2, 4), 'x']), d.pick(['<=', '>=']), ts([1, 'a'])] : [[tf(ts([d.int(2, 5), 'x'], [u(), '']), d.pick([2, 3]), 1)], d.pick(['<=', '>=']), ts([1, 'a'])])), v = m.s.v.p, t = paramTold(m.L, m.r, m.R, v, m.a0), least = up(m.s.rel);
      return ansV(`${x}에 대한 일차부등식 ${iqB(m.L, m.r, m.R)}의 해 가운데 가장 ${least ? '작은' : '큰'} 수가 ${iq(v)}일 때, 상수 ${va}의 값은?`, Q(m.a0), 'int', {
        explain: `해 가운데 가장 ${least ? '작은' : '큰'} 수가 ${iq(v)}${tail(Math.abs(v), '이/가')} 되려면 해가 ${solH('x', m.s.rel, v)}이어야 한다. ${t.text}`, facts: paramFacts(m, 'param-extreme')
      });
    }),
    T('param-line', '해를 나타낸 수직선을 보고 상수 구하기', '①35 ②41 심28', (d) => {
      const u = () => d.int(1, 9);
      const m = pickParam(d, () => d.pick([
        () => [ts([u(), ''], [-d.int(2, 3), 'x']), anyRel(d), ts([1, 'a'])],
        () => { const c1 = d.int(2, 4); return [ts([c1, 'x'], [1, 'a']), anyRel(d), ts([c1 + d.int(2, 4), 'x'], [-u(), ''])]; },
        () => { const c1 = d.int(4, 6); return [ts([c1, 'x'], [-1, 'a']), anyRel(d), ts([c1 - d.int(1, 3), 'x'], [d.int(1, 3), ''])]; }
      ])(), null, (t) => Math.abs(t.s.v.p) <= 3), v = m.s.v.p, t = paramTold(m.L, m.r, m.R, v, m.a0);
      return ansV(`${x}에 대한 일차부등식 ${iqB(m.L, m.r, m.R)}의 해를 수직선 위에 나타내면 그림과 같을 때, 상수 ${va}의 값은?`, Q(m.a0), 'int', {
        figure: rayLine(-4, 4, v, up(m.s.rel) ? 1 : -1, !strict(m.s.rel)),
        explain: `그림은 ${iq(v)}에 ${strict(m.s.rel) ? '○' : '●'}가 있고 ${up(m.s.rel) ? '오른쪽' : '왼쪽'}으로 선이 뻗어 있으므로 해는 ${solH('x', m.s.rel, v)}이다. ${t.text}`, facts: paramFacts(m, 'param-line')
      });
    }),
    T('param-same', '해가 같은 두 일차부등식의 상수', '①38 ②42 심30', (d, n) => {
      // 첫째는 계수가 정수, 둘째는 ㉠에 분수나 소수가 있다. ㉡의 해가 ㉠의 해와 같아지는 a 를 구한다.
      const u = () => d.int(1, 9);
      const first = [
        () => [ts([nz(d, -6, 6), 'x'], [nz(d, -9, 9), '']), anyRel(d), ts([nz(d, -6, 6), 'x'], [nz(d, -9, 9), ''])],
        () => (d.bool() ? [[tf(ts([d.int(1, 4), 'x'], [u(), '']), d.pick([2, 3, 4]), 1)], anyRel(d), ts([pm(d), 'x'], [-d.int(1, 5), ''])] : [ts([dc(off10(d, 1, 9)), 'x'], [-d.int(1, 3), '']), anyRel(d), ts([1, 'x'], [dc(off10(d, 1, 19)), ''])])
      ][n], [L1, r1, R1] = pickIq(d, first, 'int', (l, rel, rr, s) => Math.abs(s.v.p) <= 6), s1 = solve(L1, r1, R1, 'x'), v = s1.v.p;
      // ㉡: 풀었을 때의 부등호가 ㉠의 해와 같게 적는다.
      const m = d.until(() => {
        const [L, R] = d.pick([() => [ts([1, 'x'], [u(), '']), ts([1, 'a'])], () => [ts([d.int(2, 4), 'x'], [1, 'a']), ts([d.int(5, 9), 'x'], [-u(), ''])], () => [ts([d.int(3, 6), 'x']), ts([u(), ''], [d.int(1, 2), 'x'], [-1, 'a'])]])(), k = parts(L, R);
        return { L, R, r: k.P > 0 ? s1.rel : FLIP[s1.rel], k };
      }, (t) => (-t.k.C - t.k.P * v) % t.k.A === 0 && (-t.k.C - t.k.P * v) / t.k.A !== 0 && Math.abs((-t.k.C - t.k.P * v) / t.k.A) <= 20);
      const a0 = (-m.k.C - m.k.P * v) / m.k.A, t = paramTold(m.L, m.r, m.R, v, a0), j1 = solJ(L1, R1, 'x', {}), j2 = solJ(m.L, m.R, 'a', { x: `(${j1.expr})` });
      return ansV(`두 일차부등식 ㉠, ㉡의 해가 서로 같을 때, 상수 ${va}의 값은?`, Q(a0), 'int', {
        figure: tagEq([ineqH(L1, r1, R1), ineqH(m.L, m.r, m.R)]),
        explain: `㉠에서 ${s1.text} ㉡에서 ${t.text}`, facts: { value: j2.expr, unseen: [...new Set(j1.unseen.concat(j2.unseen))], rule: 'param-same-' + n }
      });
    }, { count: 2 }),
    T('param-letter-coef', 'x의 계수가 문자인 일차부등식(부호가 주어짐)', '①36 ②43 심22 심23', (d, n) => {
      // 첫째는 a 의 부호를 주고 계수가 ka 인 것, 둘째는 a 와 수의 대소를 주고 계수가 (a − k)인 것. 나누는 수의 부호를 따져 방향을 정한다.
      const r = anyRel(d), neg = n === 1 ? true : d.bool();
      if (n === 0) {
        const m = d.until(() => { const k1 = d.int(1, 5), k2 = d.pick([0, 0, d.int(1, 7)]), c1 = d.pick([0, nz(d, -9, 9)]), c2 = nz(d, -9, 9); return { k1, k2, c1, c2 }; }, (t) => t.k1 !== t.k2 && (t.c2 - t.c1) % (t.k1 - t.k2) === 0 && t.c2 !== t.c1);
        const L = ts([m.k1, 'ax'], [m.c1, '']), R = ts([m.k2, 'ax'], [m.c2, '']), k = m.k1 - m.k2, D = m.c2 - m.c1, q = D / k, coefNeg = (k < 0) !== neg, rel = coefNeg ? FLIP[r] : r;
        const optH = ([rr, w]) => nb(`${x} ${RH[rr]} ${w < 0 ? MINUS : ''}${frac(Math.abs(w), va)}`), cand = [[rel, q], [FLIP[rel], q], [rel, -q], [FLIP[rel], -q]], rows = d.shuffle(cand);
        const a0 = neg ? -1 : 1, s = solI(L, r, R, 'x', { a: Q(a0) });
        return C(`${nb(`${va} ${RH[neg ? '<' : '>']} 0`)}일 때, ${x}에 대한 일차부등식 ${iqB(L, r, R)}의 해는?`, rows.map(optH), rows.indexOf(cand[0]), {
          explain: `${m.c1 !== 0 || m.k2 !== 0 ? `${x}를 포함한 항은 좌변으로, 상수항은 우변으로 이항하여 정리하면 ${iqB(ts([k, 'ax']), r, ts([D, '']))}이다. ` : ''}${nb(`${va} ${RH[neg ? '<' : '>']} 0`)}이므로 ${x}의 계수 ${termH(k, 'a')}는 ${coefNeg ? '음수' : '양수'}이다. 양변을 ${termH(k, 'a')}로 나누면 ${coefNeg ? '부등호의 방향이 바뀌어' : '부등호의 방향은 그대로이고'} ${optH(cand[0])}이다.`,
          facts: { truth: rows.map(([rr, w]) => rr === s.rel && qcmp(Q(w, a0), s.v) === 0), want: true, rule: 'letter-coef-0' }
        });
      }
      // ax + c1 r kx + c2 → (a − k)x r c2 − c1
      const k = d.int(2, 5), less = d.bool(), m = d.until(() => ({ c1: nz(d, -9, 9), c2: nz(d, -9, 9) }), (t) => t.c1 !== t.c2), D = m.c2 - m.c1, L = ts([1, 'ax'], [m.c1, '']), R = ts([k, 'x'], [m.c2, '']), rel = less ? FLIP[r] : r;
      const den = `${va} − ${k}`, optH = ([rr, w]) => nb(`${x} ${RH[rr]} ${w < 0 ? MINUS : ''}${frac(Math.abs(w), den)}`), cand = [[rel, D], [FLIP[rel], D], [rel, -D], [FLIP[rel], -D]], rows = d.shuffle(cand);
      const a0 = less ? k - 1 : k + 1, s = solI(L, r, R, 'x', { a: Q(a0) });
      return C(`${nb(`${va} ${RH[less ? '<' : '>']} ${k}`)}일 때, ${x}에 대한 일차부등식 ${iqB(L, r, R)}의 해는?`, rows.map(optH), rows.indexOf(cand[0]), {
        explain: `${x}를 포함한 항은 좌변으로, 상수항은 우변으로 이항하여 정리하면 ${nb(`(${den})${x} ${RH[r]} ${iq(D)}`)}이다. ${nb(`${va} ${RH[less ? '<' : '>']} ${k}`)}이므로 ${x}의 계수 ${nb(den)}${tail(k, '은/는')} ${less ? '음수' : '양수'}이다. 양변을 ${nb(den)}${tail(k, '으로/로')} 나누면 ${less ? '부등호의 방향이 바뀌어' : '부등호의 방향은 그대로이고'} ${optH(cand[0])}이다.`,
        facts: { truth: rows.map(([rr, w]) => rr === s.rel && qcmp(Q(w, a0 - k), s.v) === 0), want: true, rule: 'letter-coef-1' }
      });
    }, { count: 2 })
  ]);

  // ── 활용 ──
  B.addTypes(UNIT, 'word', [
    T('word-number', '조건에 맞는 자연수 가운데 가장 큰 수', '①42', (d) => {
      // a x − b > c x − e (c > a). 경계가 자연수이면 등호가 있는지에 따라 끝 수가 들고 빠진다.
      const a = d.int(2, 5), g = d.int(1, 2), c = a + g, b = d.int(1, 6), same = d.bool(), ans = d.int(3, 9), e = b + (g === 1 ? (same ? ans : ans + 1) : 2 * ans + 1), r = same && g === 1 ? '>=' : '>';
      const L = ts([a, 'x'], [-b, '']), R = ts([c, 'x'], [-e, '']), s = solve(L, r, R, 'x');
      return N(`어떤 자연수의 ${a}배에서 ${b}${tail(b, '을/를')} 뺀 수는 그 자연수의 ${c}배에서 ${e}${tail(e, '을/를')} 뺀 수보다 ${r === '>=' ? '작지 않다' : '크다'}. 이와 같은 자연수 가운데 가장 큰 수는?`, ans, {
        explain: `어떤 자연수를 ${x}라 하자. ${told(L, r, R)} ${s.v.q === 1 ? (strict(s.rel) ? `${s.v.p}${tail(s.v.p, '은/는')} 들지 않으므로` : `${s.v.p}도 들므로`) : `${between(s.v)}이므로`} 가장 큰 자연수는 ${ans}이다.`,
        facts: { range: { ineq: rangeJ(L, r, R), lo: 1, hi: ans + 6, want: 'max' } }
      });
    }),
    T('word-consecutive', '합의 조건에 맞는 연속하는 세 자연수', '①43 ②47', (d) => {
      const top = d.int(9, 30), S = 3 * top - 3 + d.int(1, 3), L = [tg(1, ts([1, 'x'], [-2, ''])), tg(1, ts([1, 'x'], [-1, ''])), tm(1, 'x')], R = ts([S, '']), s = solve(L, '<', R, 'x');
      return N(`연속하는 세 자연수의 합이 ${S}보다 작다고 한다. 합이 가장 큰 경우에 세 자연수 가운데 가장 큰 수는?`, top, {
        explain: `세 자연수 가운데 가장 큰 수를 ${x}라 하면 세 수는 ${nb(`${x} − 2`)}, ${nb(`${x} − 1`)}, ${x}이다. ${told(L, '<', R)} ${s.v.q === 1 ? `${s.v.p}${tail(s.v.p, '은/는')} 들지 않으므로` : `${between(s.v)}이므로`} 가장 큰 수가 될 수 있는 가장 큰 자연수는 ${top}이다.`,
        facts: { range: { ineq: `(x-2)+(x-1)+x<${S}`, lo: 3, hi: top + 6, want: 'max' } }
      });
    }),
    T('word-average', '평균이 얼마 이상이 되기 위한 점수', '①44 ②48', (d, n) => {
      const who = d.pick(NAMES);
      if (n === 0) {
        // 세 번의 점수를 모두 준다.
        const m = d.until(() => { const s = [d.int(72, 98), d.int(72, 98), d.int(72, 98)], t = d.int(80, 92); return { s, t, need: 4 * t - s[0] - s[1] - s[2] }; }, (v) => v.need >= 75 && v.need <= 99 && new Set(v.s).size === 3 && v.need !== v.t);
        const [s1, s2, s3] = m.s, L = [tf(ts([s1, ''], [s2, ''], [s3, ''], [1, 'x']), 4, 1)], R = ts([m.t, '']);
        return N(`${name(who, '은/는')} 세 번의 수학 시험에서 ${s1}점, ${s2}점, ${s3}점을 받았다. 네 번의 시험의 평균이 ${m.t}점 이상이 되려면 네 번째 시험에서 몇 점 이상을 받아야 하는가?`, m.need, {
          unit: '점', explain: `네 번째 시험의 점수를 ${x}점이라 하자. ${told(L, '>=', R)} 따라서 ${m.need}점 이상을 받아야 한다.`,
          facts: { calc: [[`${m.t}*4-(${s1}+${s2}+${s3})`, 0]], unseen: [4], rule: 'average-0' }
        });
      }
      // 앞의 세 번은 평균만 준다(합은 평균의 3배).
      const m = d.until(() => { const avg = d.int(120, 160), t = avg + d.int(2, 8); return { avg, t, need: 4 * t - 3 * avg }; }, (v) => v.need <= 199), L = [tf(ts([3 * m.avg, ''], [1, 'x']), 4, 1)], R = ts([m.t, '']);
      return N(`${name(who, '은/는')} 줄넘기를 세 번 하여 한 번에 평균 ${m.avg}회를 넘었다. 네 번의 평균이 ${m.t}회 이상이 되려면 네 번째에는 몇 회 이상을 넘어야 하는가?`, m.need, {
        unit: '회', explain: `세 번 넘은 횟수의 합은 ${nb(`${m.avg} × 3 = ${3 * m.avg}`)}(회)이다. 네 번째에 넘는 횟수를 ${x}회라 하자. ${told(L, '>=', R)} 따라서 ${m.need}회 이상을 넘어야 한다.`,
        facts: { calc: [[`${m.t}*4-${m.avg}*3`, 0]], unseen: [4, 3], rule: 'average-1' }
      });
    }, { count: 2 }),
    T('word-max-count', '정해진 값에 낱개의 값을 더해 살 수 있는 최대 개수', '①45 ②50', (d) => {
      const m = d.until(() => { const p = 10 * d.pick([24, 35, 45, 60, 65, 70, 80, 90]), q = 500 * d.int(2, 7), r = 1000 * d.int(9, 20); return { p, q, r, ans: Math.floor((r - q) / p) }; }, (v) => (v.r - v.q) % v.p !== 0 && v.ans >= 8 && v.ans <= 40);
      const { p, q, r, ans } = m, [thing, pack] = d.pick([['과자', '상자'], ['귤', '바구니'], ['초콜릿', '상자']]), L = ts([p, 'x'], [q, '']), R = ts([r, '']);
      return N(`한 개에 ${p}원인 ${josa(thing, '을/를')} ${q}원짜리 ${pack}에 담아 사려고 한다. 전체 값이 ${r}원 이하가 되게 하려면 ${josa(thing, '은/는')} 최대 몇 개까지 살 수 있는가?`, ans, {
        unit: '개', explain: `${thing}의 개수를 ${x}개라 하자. ${told(L, '<=', R)} ${between(Q(r - q, p))}이므로 최대 ${ans}개까지 살 수 있다.`,
        facts: { calc: [[`((${r}-${q})-(${r}-${q})%${p})/${p}`, 0]] }
      });
    }),
    T('word-two-kinds', '합한 개수가 정해진 두 물건의 개수', '①46 심42', (d, n) => {
      if (n === 0) {
        // 비싼 것을 최대 몇 개: 경계가 자연수로 떨어지지 않는다(버림).
        const m = d.until(() => { const q = 100 * d.int(5, 15), p = q + 100 * d.int(5, 15), cnt = d.int(10, 15), r = 1000 * d.int(12, 30); return { p, q, cnt, r, top: (r - q * cnt) / (p - q) }; }, (v) => !Number.isInteger(v.top) && v.top > 2 && v.top < v.cnt - 2);
        const { p, q, cnt, r } = m, ans = Math.floor(m.top), L = [tm(p, 'x'), tg(q, ts([cnt, ''], [-1, 'x']))], R = ts([r, '']);
        return N(`한 송이에 ${p}원인 장미와 한 송이에 ${q}원인 튤립을 합하여 ${cnt}송이를 사려고 한다. 전체 값이 ${r}원을 넘지 않게 하려면 장미는 최대 몇 송이까지 살 수 있는가?`, ans, {
          unit: '송이', explain: `장미를 ${x}송이 산다고 하면 튤립은 ${nb(`(${cnt} − ${x})`)}송이를 산다. ${told(L, '<=', R)} ${between(Q(r - q * cnt, p - q))}이므로 최대 ${ans}송이까지 살 수 있다.`,
          facts: { calc: [[`((${r}-${q}*${cnt})-(${r}-${q}*${cnt})%(${p}-${q}))/(${p}-${q})`, 0]], rule: 'two-kinds-0' }
        });
      }
      // 싼 것을 최소 몇 개: 포장값이 덧붙고, 「미만」이며 경계가 자연수로 떨어진다(끝 수는 들지 않는다). 음수로 나누어 방향이 바뀐다.
      const m = d.until(() => { const p = 100 * d.int(2, 5), q = p + 100 * d.int(2, 4), cnt = 10 * d.int(2, 4), pack = 500 * d.int(1, 4), edge = d.int(4, 12); return { p, q, cnt, pack, edge, r: q * cnt + pack - (q - p) * edge }; }, (v) => v.edge < v.cnt - 4 && v.r % 1000 === 0);
      const { p, q, cnt, pack, edge, r } = m, L = [tm(p, 'x'), tg(q, ts([cnt, ''], [-1, 'x'])), tm(pack, '')], R = ts([r, '']);
      return N(`한 자루에 ${p}원인 연필과 한 자루에 ${q}원인 형광펜을 합하여 ${cnt}자루 사서 ${pack}원짜리 필통에 담으려고 한다. 전체 값이 ${r}원 미만이 되게 하려면 연필은 최소 몇 자루를 사야 하는가?`, edge + 1, {
        unit: '자루', explain: `연필을 ${x}자루 산다고 하면 형광펜은 ${nb(`(${cnt} − ${x})`)}자루를 산다. ${told(L, '<', R)} ${edge}${tail(edge, '은/는')} 들지 않으므로 연필은 최소 ${edge + 1}자루를 사야 한다.`,
        facts: { range: { ineq: `${p}*x+${q}*(${cnt}-x)+${pack}<${r}`, lo: 1, hi: cnt - 1, want: 'min' }, rule: 'two-kinds-1' }
      });
    }, { count: 2 }),
    T('word-savings', '두 사람의 예금액 비교', '①48 ②52 심41', (d, n) => {
      const [p, q] = d.shuffle(NAMES).slice(0, 2);
      if (n === 0) {
        // 적게 가진 쪽이 더 많이 모아 앞지른다.
        const m = d.until(() => { const a = 500 * d.int(4, 12), b = 500 * d.int(2, 9), A0 = 1000 * d.int(10, 30), B0 = A0 + 1000 * d.int(5, 20); return { a, b, A0, B0, edge: (B0 - A0) / (a - b) }; }, (v) => v.a > v.b && v.edge >= 3 && v.edge <= 15);
        const { a, b, A0, B0 } = m, ans = Math.floor(m.edge) + 1, L = ts([A0, ''], [a, 'x']), R = ts([B0, ''], [b, 'x']), s = solve(L, '>', R, 'x');
        return N(`현재 ${nick(p)}의 저금통에는 ${A0}원, ${nick(q)}의 저금통에는 ${B0}원이 들어 있다. 다음 달부터 매달 ${name(p, '은/는')} ${a}원씩, ${name(q, '은/는')} ${b}원씩 저금한다면 ${nick(p)}의 저금액이 ${nick(q)}의 저금액보다 많아지는 것은 몇 개월 후부터인가?`, ans, {
          unit: '개월 후', explain: `${x}개월 후의 저금액은 ${nick(p)}가 ${nb(`(${sideH(L, true)})`)}원, ${nick(q)}가 ${nb(`(${sideH(R, true)})`)}원이다. ${told(L, '>', R)} ${s.v.q === 1 ? `${s.v.p}개월 후에는 두 사람의 저금액이 같으므로` : `${between(s.v)}이므로`} ${ans}개월 후부터 많아진다.`,
          facts: { range: { ineq: `${A0}+${a}*x>${B0}+${b}*x`, lo: 1, hi: ans + 6, want: 'min' }, rule: 'savings-0' }
        });
      }
      // 많이 가진 쪽이 상대의 2배보다 적어진다(2배는 식 전체에 곱한다). 경계가 자연수로 떨어진다.
      const m = d.until(() => { const b = 1000 * d.int(3, 6), a = 2 * b - 1000 * d.int(1, 4), B0 = 10000 * d.int(1, 4), edge = d.int(3, 12); return { a, b, B0, edge, A0: 2 * B0 + (2 * b - a) * edge }; }, (v) => v.a >= 2000 && v.A0 % 5000 === 0);
      const { a, b, A0, B0, edge } = m, L = ts([A0, ''], [a, 'x']), R = [tg(2, ts([B0, ''], [b, 'x']))];
      return N(`현재 ${nick(p)}의 예금액은 ${A0}원, ${nick(q)}의 예금액은 ${B0}원이다. 다음 달부터 매달 ${name(p, '은/는')} ${a}원씩, ${name(q, '은/는')} ${b}원씩 예금한다면 ${nick(p)}의 예금액이 ${nick(q)}의 예금액의 2배보다 적어지는 것은 몇 개월 후부터인가?`, edge + 1, {
        unit: '개월 후', explain: `${x}개월 후의 예금액은 ${nick(p)}가 ${nb(`(${sideH(L, true)})`)}원, ${nick(q)}가 ${nb(`(${sideH(ts([B0, ''], [b, 'x']), true)})`)}원이다. ${told(L, '<', R)} ${edge}개월 후에는 꼭 2배가 되므로 ${edge + 1}개월 후부터 2배보다 적어진다.`,
        facts: { range: { ineq: `${A0}+${a}*x<2*(${B0}+${b}*x)`, lo: 1, hi: edge + 7, want: 'min' }, rule: 'savings-1' }
      });
    }, { count: 2 }),
    T('word-age', '나이가 몇 배보다 적어지는 때', '①49 ②49', (d) => {
      const m = d.until(() => { const child = d.int(9, 16), parent = d.int(38, 52); return { child, parent, edge: parent - 2 * child }; }, (v) => v.edge >= 6 && v.edge <= 24 && v.parent - v.child >= 24);
      const [who, kid] = d.pick([['아버지', '딸'], ['어머니', '아들'], ['아버지', '아들'], ['어머니', '딸'], ['이모', '조카'], ['삼촌', '조카']]), { child, parent, edge } = m, L = ts([parent, ''], [1, 'x']), R = [tg(2, ts([child, ''], [1, 'x']))];
      return N(`올해 ${who}의 나이는 ${parent}살이고 ${kid}의 나이는 ${child}살이다. ${who}의 나이가 ${kid}의 나이의 2배보다 적어지는 것은 몇 년 후부터인가?`, edge + 1, {
        unit: '년 후', explain: `${x}년 후에 ${who}의 나이는 ${nb(`(${parent} + ${x})`)}살, ${kid}의 나이는 ${nb(`(${child} + ${x})`)}살이다. ${told(L, '<', R)} ${edge}년 후에는 꼭 2배가 되므로 ${edge + 1}년 후부터 2배보다 적어진다.`,
        facts: { range: { ineq: `${parent}+x<2*(${child}+x)`, lo: 1, hi: edge + 7, want: 'min' } }
      });
    }),
    T('word-far-shop', '교통비를 내고 싼 곳에서 사는 것이 유리한 개수', '①50 ②55 심40', (d) => {
      const m = d.until(() => { const near = 100 * d.int(8, 15), far = near - 100 * d.int(2, 5), fare = 100 * d.int(12, 36); return { near, far, fare, edge: fare / (near - far) }; }, (v) => v.edge >= 3 && v.edge <= 15);
      const { near, far, fare } = m, ans = Math.floor(m.edge) + 1, L = ts([near, 'x']), R = ts([far, 'x'], [fare, '']), s = solve(L, '>', R, 'x');
      return N(`동네 가게에서 한 병에 ${near}원인 주스를 큰 시장에서는 한 병에 ${far}원에 판다. 큰 시장에 다녀오는 데 버스 요금이 ${fare}원 든다면, 주스를 몇 병 이상 살 때 큰 시장에서 사는 것이 유리한가?`, ans, {
        unit: '병', explain: `주스를 ${x}병 산다고 하자. 큰 시장에서 사는 것이 유리하려면 동네 가게에서 사는 값이 더 커야 한다. ${told(L, '>', R)} ${s.v.q === 1 ? `${s.v.p}병을 살 때는 두 곳에서 드는 값이 같으므로` : `${between(s.v)}이므로`} ${ans}병 이상 살 때 유리하다.`,
        facts: { range: { ineq: `${near}*x>${far}*x+${fare}`, lo: 1, hi: ans + 6, want: 'min' } }
      });
    }),
    T('word-group-ticket', '단체 입장권을 사는 것이 유리한 인원', '①51 ②53', (d) => {
      const m = d.until(() => { const price = 500 * d.int(2, 10), off = 100 * d.int(2, 9), group = 10 * d.int(2, 5); return { price, off, group, edge: (price - off) * group / price }; }, (v) => v.off < v.price / 2 && v.edge < v.group - 2);
      const { price, off, group } = m, cut = price - off, ans = Math.floor(m.edge) + 1, L = ts([price, 'x']), R = ts([cut * group, '']), s = solve(L, '>', R, 'x');
      return N(`어느 미술관의 입장료는 한 사람에 ${price}원이고, ${group}명 이상의 단체는 한 사람에 ${cut}원이다. ${group}명 미만인 단체가 ${group}명의 단체 입장권을 사는 것이 유리하려면 몇 명 이상이어야 하는가?`, ans, {
        unit: '명', explain: `${x}명이 입장한다고 하자. ${group}명의 단체 입장권의 값은 ${nb(`${cut} × ${group} = ${cut * group}`)}(원)이다. 한 사람씩 내는 입장료의 합이 이보다 커야 단체 입장권이 유리하다. ${told(L, '>', R)} ${s.v.q === 1 ? `${s.v.p}명일 때는 두 값이 같으므로` : `${between(s.v)}이므로`} ${ans}명 이상이어야 한다.`,
        facts: { range: { ineq: `${price}*x>${cut}*${group}`, lo: 1, hi: group - 1, want: 'min' } }
      });
    }),
    T('word-tier-fee', '기본요금에 넘는 만큼 더 내는 요금의 한도', '②51 심37 심39', (d) => {
      const m = d.until(() => { const base = d.pick([30, 60]), fee = 500 * d.int(2, 6), per = 10 * d.int(2, 6), limit = 500 * d.int(6, 16); return { base, fee, per, limit, extra: (limit - fee) / per }; }, (v) => v.extra >= 40 && v.extra <= 240);
      const { base, fee, per, limit } = m, ans = base + Math.floor(m.extra), L = [tm(fee, ''), tg(per, ts([1, 'x'], [-base, '']))], R = ts([limit, '']), s = solve(L, '<=', R, 'x');
      return N(`어느 자전거 대여소의 요금은 ${base}분까지는 ${fee}원이고, ${base}분을 넘으면 1분마다 ${per}원씩 더 내야 한다. 대여 요금이 ${limit}원 이하가 되게 하려면 자전거를 최대 몇 분 동안 빌릴 수 있는가?`, ans, {
        unit: '분', explain: `${x}분 동안 빌린다고 하면 ${base}분을 넘는 시간은 ${nb(`(${x} − ${base})`)}분이다. ${told(L, '<=', R)} ${s.v.q === 1 ? '따라서' : `${between(s.v)}이므로`} 최대 ${ans}분 동안 빌릴 수 있다.`,
        facts: { calc: [[`${base}+((${limit}-${fee})-(${limit}-${fee})%${per})/${per}`, 0]], unseen: [1] }
      });
    }),
    T('word-rect-perimeter', '둘레의 길이의 조건에 맞는 직사각형의 변의 길이', '②56', (d) => {
      const m = d.until(() => { const short = d.int(2, 9), v = d.int(8, 25); return { short, v, per: 2 * (3 * v - short) }; }, (t) => t.per % 10 === 0), L = [tg(2, [tm(1, 'x'), tg(1, ts([2, 'x'], [-m.short, '']))], '{')], R = ts([m.per, '']);
      return N(`가로의 길이가 세로의 길이의 2배보다 ${m.short} cm 짧은 직사각형이 있다. 이 직사각형의 둘레의 길이가 ${m.per} cm 이하가 되게 하려면 세로의 길이는 몇 cm 이하이어야 하는가?`, m.v, {
        unit: 'cm', explain: `세로의 길이를 ${nb(`${x} cm`)}라 하면 가로의 길이는 ${nb(`(2${x} − ${m.short})`)} cm이다. 직사각형의 둘레의 길이는 가로의 길이와 세로의 길이의 합의 2배이므로 ${told(L, '<=', R)} 따라서 세로의 길이는 ${m.v} cm 이하이어야 한다.`,
        facts: { calc: [[`(${m.per}/2+${m.short})/(2+1)`, 0]], unseen: [1] }
      });
    }),
    T('word-area', '넓이의 조건에 맞는 도형의 길이', '①54 ②57 심35', (d, n) => {
      if (n === 0) {
        // 사다리꼴의 넓이
        const m = d.until(() => { const a = d.int(3, 9), h = 2 * d.int(2, 5), v = d.int(6, 15); return { a, h, v, S: (a + v) * h / 2 }; }, (t) => t.v > t.a), L = [tg(m.h / 2, ts([m.a, ''], [1, 'x']))], R = ts([m.S, '']);
        return N(`윗변의 길이가 ${m.a} cm, 높이가 ${m.h} cm인 사다리꼴이 있다. 이 사다리꼴의 넓이가 ${m.S} cm² 이상이 되게 하려면 아랫변의 길이는 몇 cm 이상이어야 하는가?`, m.v, {
          unit: 'cm', explain: `아랫변의 길이를 ${nb(`${x} cm`)}라 하자. 사다리꼴의 넓이는 ${frac(1, 2)} × {(윗변의 길이) + (아랫변의 길이)} × (높이)이므로 ${nb(`${frac(1, 2)} × (${m.a} + ${x}) × ${m.h} ${RH['>=']} ${m.S}`)}, 곧 ${iqB(L, '>=', R)}이다. ${solve(L, '>=', R, 'x').text} 따라서 아랫변의 길이는 ${m.v} cm 이상이어야 한다.`,
          facts: { calc: [[`${m.S}*2/${m.h}-${m.a}`, 0]], unseen: [2], rule: 'area-0' }
        });
      }
      // 직육면체의 겉넓이
      const m = d.until(() => { const a = d.int(2, 6), b = d.int(3, 8), v = d.int(2, 9); return { a, b, v, S: 2 * (a * b + (a + b) * v) }; }, (t) => t.a < t.b), L = [tg(2, ts([m.a * m.b, ''], [m.a, 'x'], [m.b, 'x']))], R = ts([m.S, '']);
      return N(`밑면의 가로의 길이가 ${m.a} m, 세로의 길이가 ${m.b} m인 직육면체 모양의 상자를 만들려고 한다. 겉넓이가 ${m.S} m² 미만이 되게 하려면 높이는 몇 m 미만이어야 하는가?`, m.v, {
        unit: 'm', explain: `높이를 ${nb(`${x} m`)}라 하자. 직육면체의 겉넓이는 서로 다른 세 면의 넓이의 합의 2배이고, 세 면의 넓이는 ${nb(`${m.a} × ${m.b} = ${m.a * m.b}`)}, ${nb(`${m.a}${x}`)}, ${nb(`${m.b}${x}`)}이다. ${told(L, '<', R)} 따라서 높이는 ${m.v} m 미만이어야 한다.`,
        facts: { calc: [[`(${m.S}/2-${m.a}*${m.b})/(${m.a}+${m.b})`, 0]], unseen: [2], rule: 'area-1' }
      });
    }, { count: 2 }),
    T('word-triangle', '삼각형이 되는 세 변의 길이의 조건', '①55', (d) => {
      const [a, b, c] = d.pick([[-1, 1, 3], [-2, 1, 4], [1, 2, 5], [-1, 2, 4], [-3, -1, 2], [1, 3, 6], [-2, 2, 5], [2, 3, 7]]), side = (k) => nb(`(${x} ${k < 0 ? MINUS : '+'} ${Math.abs(k)})`);
      const L = ts([1, 'x'], [c, '']), R = [tg(1, ts([1, 'x'], [a, ''])), tg(1, ts([1, 'x'], [b, '']))], s = solve(L, '<', R, 'x');
      return ineqAns(`세 변의 길이가 ${side(a)} cm, ${side(b)} cm, ${side(c)} cm인 삼각형을 만들 수 있을 때, ${x}의 값의 범위를 구하시오.`, '>', c - a - b, x, {
        explain: `삼각형에서 가장 긴 변의 길이는 나머지 두 변의 길이의 합보다 작다. 가장 긴 변의 길이는 ${side(c)} cm이므로 ${iqB(L, '<', R)}이다. ${s.text} 이때 세 변의 길이는 모두 양수이다.`,
        facts: { calc: [[`${js(Q(c))}-${js(Q(a))}-${js(Q(b))}`, 1]] }
      });
    }),
    T('word-round-trip', '같은 길을 다른 속력으로 오갈 때 갈 수 있는 가장 먼 거리', '①52', (d) => {
      const [go, back, hours] = d.pick([[2, 3, 5], [3, 2, 5], [3, 6, 2], [6, 3, 3], [3, 6, 4], [4, 6, 5], [6, 4, 5]]), far = hours * go * back / (go + back);
      const L = ts([Q(1, go), 'x'], [Q(1, back), 'x']), R = ts([hours, '']);
      return N(`둘레길을 따라 갈 때는 시속 ${go} km로, 같은 길로 돌아올 때는 시속 ${back} km로 걸어서 ${hours}시간 이내에 돌아오려고 한다. 최대 몇 km 떨어진 곳까지 갔다 올 수 있는가?`, far, {
        unit: 'km', explain: `${nb(`${x} km`)} 떨어진 곳까지 갔다 온다고 하면 갈 때 걸리는 시간은 ${frac(x, go)}시간, 돌아올 때 걸리는 시간은 ${frac(x, back)}시간이다. ${told(L, '<=', R)} 따라서 최대 ${far} km 떨어진 곳까지 갔다 올 수 있다.`,
        facts: { calc: [[`${hours}*${go}*${back}/(${go}+${back})`, 0]] }
      });
    }),
    T('word-go-and-back', '머무는 시간이 있을 때 다녀올 수 있는 가장 먼 거리', '①53 ②58 심44', (d) => {
      // 원문은 머무는 시간을 분으로 주어 단위를 바꾸게 한다. 지나치게 복잡한 활용이 되지 않게 머무는 시간을 시간 단위로 주었다.
      const [hours, stay, speed] = d.pick([[3, 1, 3], [3, 1, 4], [3, 1, 5], [4, 1, 4], [4, 2, 3], [4, 2, 5], [5, 1, 3], [5, 2, 4], [2, 1, 4]]), far = (hours - stay) * speed / 2;
      const L = [tm(Q(1, speed), 'x'), tm(stay, ''), tm(Q(1, speed), 'x')], R = ts([hours, '']);
      return N(`동아리 모임이 시작하기까지 ${hours}시간이 남아서 그동안 학교에서 도서관까지 걸어가 책을 빌려 오려고 한다. 도서관에서 책을 고르는 데 ${stay}시간이 걸리고 시속 ${speed} km로 걷는다면, 학교에서 최대 몇 km 떨어진 도서관까지 다녀올 수 있는가?`, far, {
        unit: 'km', explain: `학교에서 도서관까지의 거리를 ${nb(`${x} km`)}라 하면 가는 데 ${frac(x, speed)}시간, 책을 고르는 데 ${stay}시간, 돌아오는 데 ${frac(x, speed)}시간이 걸린다. ${told(L, '<=', R)} 따라서 최대 ${far} km 떨어진 도서관까지 다녀올 수 있다.`,
        facts: { calc: [[`(${hours}-${stay})*${speed}/2`, 0]], unseen: [2] }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
