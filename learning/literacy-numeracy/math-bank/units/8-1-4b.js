// 중학교 2학년 1학기 4단원 연립일차방정식 — 뒤쪽 묶음(여러 가지 연립방정식, 해의 조건과 수 구하기, 연립방정식의 활용).
// 단원 틀과 도구, 싣는 기준, 뺀 것과 까닭은 8-1-4a.js 에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
// 여러 가지 연립방정식은 식의 구조가 다른 것만 따로 싣는다(차례마다 facts.rule 의 이름이 다르다). 해는 모두 정수가 되게 수를 골랐다.
// 풀이 글은 분모·소수·괄호가 있는 식을 먼저 ax + by = c 꼴로 고쳐 ㉢, ㉣이라 하고 한 미지수를 없애는 과정을 보인다(8-1-4a.js 의 told).
// 활용은 상황마다 한 유형이고, 미지수 둘을 놓아 두 값을 모두 답하게 하였다. 답을 다시 셈하는 식(facts.calc)은 연립방정식을 거치지 않고 문제의 수로 바로 셈한 식이다.
// 중1(7-1-4)에 미지수 하나로 실린 상황과 조건까지 같은 것(합과 차, 남고 모자라는 과부족)은 다시 싣지 않았다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, box, frac, M } = B.kit;
  const { MINUS, lcm, Q, dc, dc2, qadd, qmul, tx, nb, tail, V, nz, pm, ansV, poly } = B.kit.mid;
  const { NAME, GANA, X, Y, va, vb, vk, iq, only, tm, tg, tf, ts, sideH, eqH, eqT, I, solH, sysOf, sysL, wide, steps, evS, at, stdI, solve2, elimCost, tame, cramerJ, solJ, solFacts, stdH, elimTold, told, subTold, endTail, xyAns, valsAns, pickSol, SOLVE, solveQ } = B.kit.m814;
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: (/[①②]/.test(ref) ? '수집본 기본 자료(' : '수집본 심화 자료(') + ref + ')', make }, more || {});
  const UNIT = '8-1-4';
  // 좌변 L 에 해를 넣은 값을 우변으로 삼은 방정식(우변이 정수일 때만)
  const closed = (L, x0, y0) => { const v = evS(L, at(x0, y0)); return v.q === 1 ? [L, ts([v.p, ''])] : null; };
  // 십분의 t 를 소수 한 자리로(정수이면 정수로) 적은 수, 백분의 t 를 소수로 적은 수
  const d1 = (t) => (t % 10 === 0 ? Q(t / 10) : dc(t)), d2 = (t) => (t % 100 === 0 ? Q(t / 100) : t % 10 === 0 ? dc(t / 10) : dc2(t));
  // 소수 두 자리 수에 100을 곱한 값이 끝자리까지 꼭 맞는가(검사가 다시 셈하는 식이 어긋나지 않게)
  const exact2 = (t) => t % 10 === 0 || 100 * Number((Math.abs(t) / 100).toFixed(2)) === Math.abs(t);
  // 걸린 시간(분)을 적는 글과, 분으로 셈하는 식 글
  const span = (min) => { const h = Math.floor(min / 60), m = min % 60; return { text: (h ? h + '시간' : '') + (h && m ? ' ' : '') + (m ? m + '분' : ''), js: h && m ? `(${h}*60+${m})` : h ? `(${h}*60)` : String(m) }; };
  // 미지수를 정하고 연립방정식을 세워 푼 풀이 글
  const setUp = (lead, e1, e2, x, y, tailText) => `${lead} 연립방정식을 세우면 ${eqT(e1)}, ${eqT(e2)}이다. 이 연립방정식을 풀면 ${solH(x, y)}이다.${tailText ? ' ' + tailText : ''}`;

  // ── 여러 가지 연립방정식 ──
  B.addTypes(UNIT, 'forms', [
    T('forms-paren', '괄호가 있는 연립방정식', '①27 ②26 심23', (d, n) => {
      if (n === 0) {
        // 한 식에만 괄호: ㉠ m(x + p) = k(y + q), ㉡ ax + by = c
        const m = d.until(() => { const [mm, k] = d.pick([[2, 3], [3, 2], [3, 4], [4, 3], [2, 5], [5, 2], [3, 5], [4, 5]]), t = nz(d, -2, 2), [x0, y0] = pickSol(d, 6), a = nz(d, -5, 5), b = nz(d, -5, 5); return { mm, k, x0, y0, a, b, p: k * t - x0, q: mm * t - y0 }; },
          (r) => r.p !== 0 && r.q !== 0 && Math.abs(r.p) <= 9 && Math.abs(r.q) <= 9 && r.mm * r.b + r.k * r.a !== 0 && tame(I(r.mm, -r.k, r.k * r.q - r.mm * r.p), I(r.a, r.b, r.a * r.x0 + r.b * r.y0)));
        const e1 = [[tg(m.mm, ts([1, 'x'], [m.p, '']))], [tg(m.k, ts([1, 'y'], [m.q, '']))]], e2 = I(m.a, m.b, m.a * m.x0 + m.b * m.y0);
        return solveQ(e1, e2, 'paren-0');
      }
      // 두 식 모두 괄호
      const m = d.until(() => {
        const [x0, y0] = pickSol(d, 6), m1 = d.int(2, 5), p1 = d.int(1, 6), p2 = d.int(2, 6), k2 = d.int(2, 5), k1 = d.int(2, 3), n2 = d.int(2, 4);
        const [L1, L2] = d.bool() ? [[tg(m1, ts([1, 'x'], [1, 'y'])), tm(-p1, 'y')], [tm(p2, 'x'), tg(-k2, ts([1, 'x'], [1, 'y']))]] : [[tg(m1, ts([1, 'x'], [-k1, 'y'])), tm(-1, 'y')], [tm(1, 'x'), tg(n2, ts([1, 'y'], [1, '']))]];
        return { e1: closed(L1, x0, y0), e2: closed(L2, x0, y0) };
      }, (r) => Boolean(solve2(r.e1, r.e2)) && tame(r.e1, r.e2));
      return solveQ(m.e1, m.e2, 'paren-1');
    }, { count: 2 }),
    T('forms-decimal', '계수가 소수인 연립방정식', '①28 ②27', (d, n) => {
      const co = () => pm(d) * d.pick([1, 2, 3, 4, 5, 6, 7, 8, 9, 12, 15]);
      if (n === 0) {
        // 두 식 모두 소수 한 자리(양변에 10을 곱한다). 계수 하나는 정수일 때도 있다.
        const m = d.until(() => { const [x0, y0] = pickSol(d, 6), a1 = co(), b1 = d.bool() ? co() : pm(d) * 10, a2 = co(), b2 = co(); return { a1, b1, a2, b2, c1: a1 * x0 + b1 * y0, c2: a2 * x0 + b2 * y0 }; },
          (r) => r.a1 * r.b2 - r.a2 * r.b1 !== 0 && r.c1 !== 0 && r.c2 !== 0 && Math.abs(r.c1) <= 99 && Math.abs(r.c2) <= 99 && tame(I(r.a1, r.b1, r.c1), I(r.a2, r.b2, r.c2)));
        return solveQ([ts([d1(m.a1), 'x'], [d1(m.b1), 'y']), ts([d1(m.c1), ''])], [ts([d1(m.a2), 'x'], [d1(m.b2), 'y']), ts([d1(m.c2), ''])], 'decimal-0');
      }
      // 한 식은 소수 한 자리(양변에 10), 다른 식은 소수 두 자리(양변에 100)
      const H2 = [4, 5, 6, 8, 12, 15, 25, 35, 45].filter(exact2);
      const m = d.until(() => { const [x0, y0] = pickSol(d, 6), a1 = co(), b1 = co(), a2 = pm(d) * d.pick(H2), b2 = pm(d) * (d.bool() ? d.pick(H2) : 10 * d.int(1, 9)); return { a1, b1, a2, b2, c1: a1 * x0 + b1 * y0, c2: a2 * x0 + b2 * y0 }; },
        (r) => r.a1 * r.b2 - r.a2 * r.b1 !== 0 && r.c1 !== 0 && r.c2 !== 0 && Math.abs(r.c1) <= 99 && Math.abs(r.c2) <= 300 && exact2(r.c2) && Math.max(Math.abs(r.a2), Math.abs(r.b2)) <= 90 && Math.min(elimCost(r.a1, r.a2), elimCost(r.b1, r.b2)) < 2600 && Math.abs(r.a1 * r.b2 - r.a2 * r.b1) <= 400);
      return solveQ([ts([d1(m.a1), 'x'], [d1(m.b1), 'y']), ts([d1(m.c1), ''])], [ts([d2(m.a2), 'x'], [d2(m.b2), 'y']), ts([d2(m.c2), ''])], 'decimal-1');
    }, { count: 2 }),
    T('forms-decimal-blank', '계수가 소수인 연립방정식을 푸는 과정의 빈칸', '②27', (d) => {
      // ㉠의 우변은 정수이다. 양변에 10을 곱할 때 정수인 우변에도 10을 곱해야 한다.
      const co = () => pm(d) * d.pick([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      const m = d.until(() => { const [x0, y0] = pickSol(d, 6), a1 = co(), b1 = co(), a2 = co(), b2 = co(); return { x0, y0, a1, b1, a2, b2, c1: a1 * x0 + b1 * y0, c2: a2 * x0 + b2 * y0 }; },
        (r) => r.a1 * r.b2 - r.a2 * r.b1 !== 0 && r.c1 !== 0 && r.c1 % 10 === 0 && r.c2 % 10 !== 0 && Math.abs(r.c1) <= 90 && Math.abs(r.c2) <= 99 && tame(I(r.a1, r.b1, r.c1), I(r.a2, r.b2, r.c2)));
      const { x0, y0, a1, b1, a2, b2, c1, c2 } = m, e1 = [ts([d1(a1), 'x'], [d1(b1), 'y']), ts([d1(c1), ''])], e2 = [ts([d1(a2), 'x'], [d1(b2), 'y']), ts([d1(c2), ''])], j = solJ(e1, e2);
      return M(`다음은 연립방정식 ${sysL(e1, e2)}을 푸는 과정이다. ㉮, ㉯, ㉰, ㉱에 알맞은 수는?`, [c1, c2, x0, y0].map((u, i) => ({ label: GANA[i], answer: u, signed: true })), {
        figure: steps([`㉠의 양변에 10을 곱하면`, `${nb(`${poly([[a1, X], [b1, Y]])} = ${box(GANA[0])}`)} …… ㉢`, `㉡의 양변에 10을 곱하면`, `${nb(`${poly([[a2, X], [b2, Y]])} = ${box(GANA[1])}`)} …… ㉣`, `㉢, ㉣을 연립하여 풀면`, `${nb(`${X} = ${box(GANA[2])}`)}, ${nb(`${Y} = ${box(GANA[3])}`)}`]),
        explain: `양변에 10을 곱할 때는 좌변의 두 항과 우변에 모두 10을 곱한다. ㉠의 우변은 ${nb(`${iq(c1 / 10)} × 10 = ${iq(c1)}`)}, ㉡의 우변은 ${nb(`${tx(d1(c2))} × 10 = ${iq(c2)}`)}이다. ${elimTold({ a: a1, b: b1, c: c1 }, { a: a2, b: b2, c: c2 }, '㉢', '㉣').text}`,
        facts: { calc: [[`10*(${c1 / 10})`, 0], [`10*(${(c2 / 10).toFixed(1)})`, 1], [j.x, 2], [j.y, 3]], unseen: j.unseen }
      });
    }),
    T('forms-frac', '계수가 분수인 연립방정식', '①29 ②28', (d, n) => {
      const DEN = [2, 3, 4, 5, 6], fr = () => d.until(() => Q(pm(d) * d.pick([1, 1, 1, 2, 3, 5]), d.pick(DEN)), (v) => v.q !== 1);
      const small = (eq) => { const s = stdI(eq), k = eq[1][0].c; return s.n <= 30 && s.c !== 0 && k.q <= 6 && Math.abs(k.p) <= 35; };
      if (n === 0) {
        // 우변이 분수이거나 정수이다. 계수 하나는 정수일 때도 있다.
        const m = d.until(() => {
          const [x0, y0] = pickSol(d, 6), f = [fr(), fr(), d.bool() ? fr() : Q(nz(d, -3, 3)), fr()];
          const L1 = ts([f[0], 'x'], [f[1], 'y']), L2 = ts([f[2], 'x'], [f[3], 'y']);
          return { e1: [L1, ts([evS(L1, at(x0, y0)), ''])], e2: [L2, ts([evS(L2, at(x0, y0)), ''])] };
        }, (r) => Boolean(solve2(r.e1, r.e2)) && small(r.e1) && small(r.e2) && r.e1[1][0].c.q !== 1 && tame(r.e1, r.e2));
        return solveQ(m.e1, m.e2, 'frac-0');
      }
      // 우변이 0이고 정수인 항이 좌변에 있다. 양변에 분모의 최소공배수를 곱할 때 정수인 항에도 곱한다.
      const m = d.until(() => {
        const [p, q, r, s] = [d.pick(DEN), d.pick(DEN), d.pick(DEN), d.pick(DEN)], x0 = lcm(p, r) * nz(d, -2, 2), y0 = lcm(q, s) * nz(d, -2, 2), s1 = pm(d), s2 = pm(d);
        const k1 = x0 / p + s1 * y0 / q, k2 = x0 / r + s2 * y0 / s;
        return { p, q, r, s, x0, y0, k1, k2, e1: [ts([Q(1, p), 'x'], [Q(s1, q), 'y'], [-k1, '']), ts([0, ''])], e2: [ts([Q(1, r), 'x'], [Q(s2, s), 'y'], [-k2, '']), ts([0, ''])] };
      }, (t) => t.p !== t.q && t.r !== t.s && Math.abs(t.x0) <= 12 && Math.abs(t.y0) <= 12 && t.k1 !== 0 && t.k2 !== 0 && Boolean(solve2(t.e1, t.e2)) && tame(t.e1, t.e2));
      return solveQ(m.e1, m.e2, 'frac-1');
    }, { count: 2 }),
    T('forms-mixed', '한 식의 계수는 소수, 다른 식의 계수는 분수인 연립방정식', '①30 ②29', (d) => {
      const co = () => pm(d) * d.pick([1, 2, 3, 4, 5, 6, 7, 8, 9]), fr = () => d.until(() => Q(pm(d) * d.pick([1, 1, 2, 3]), d.pick([2, 3, 4, 5, 6])), (v) => v.q !== 1);
      const m = d.until(() => {
        const [x0, y0] = pickSol(d, 6), a1 = co(), b1 = co(), L2 = ts([fr(), 'x'], [fr(), 'y']), c1 = a1 * x0 + b1 * y0;
        return { c1, e1: [ts([d1(a1), 'x'], [d1(b1), 'y']), ts([d1(c1), ''])], e2: [L2, ts([evS(L2, at(x0, y0)), ''])] };
      }, (r) => { if (r.c1 === 0 || Math.abs(r.c1) > 99 || !solve2(r.e1, r.e2)) return false; const s = stdI(r.e2), k = r.e2[1][0].c; return s.n <= 30 && s.c !== 0 && k.q <= 6 && Math.abs(k.p) <= 35 && tame(r.e1, r.e2); });
      return solveQ(m.e1, m.e2, 'mixed');
    }),
    T('forms-frac-num', '분자가 일차식인 분수가 있는 연립방정식', '②30', (d) => {
      const m = d.until(() => {
        const [x0, y0] = pickSol(d, 6);
        if (d.bool()) {
          // ㉠ (x + p)/m = (y + q)/k, ㉡ ax + by = c
          const [mm, k] = d.pick([[2, 3], [3, 2], [3, 4], [4, 3], [2, 5], [5, 2], [3, 5], [4, 5]]), t = nz(d, -2, 2), a = nz(d, -5, 5), b = nz(d, -5, 5), p = mm * t - x0, q = k * t - y0;
          return { ok: p !== 0 && q !== 0 && Math.abs(p) <= 9 && Math.abs(q) <= 9, e1: [[tf(ts([1, 'x'], [p, '']), mm, 1)], [tf(ts([1, 'y'], [q, '']), k, 1)]], e2: I(a, b, a * x0 + b * y0) };
        }
        // ㉠ (x ± y)/m = k, ㉡ j(ax + p) = c − y
        const mm = d.int(2, 5), s = pm(d), j = d.int(2, 5), a = d.int(1, 3), p = nz(d, -4, 4), L2 = [tg(j, ts([a, 'x'], [p, '']))];
        return { ok: (x0 + s * y0) % mm === 0 && x0 + s * y0 !== 0, e1: [[tf(ts([1, 'x'], [s, 'y']), mm, 1)], ts([(x0 + s * y0) / mm, ''])], e2: [L2, ts([evS(L2, at(x0, y0)).p + y0, ''], [-1, 'y'])] };
      }, (r) => r.ok && Boolean(solve2(r.e1, r.e2)) && tame(r.e1, r.e2) && r.e2[1][0].vs === '');
      return solveQ(m.e1, m.e2, 'frac-num');
    }),
    T('forms-both', '괄호와 분수·소수가 함께 있는 연립방정식', '①31 심24', (d) => {
      const m = d.until(() => {
        const [x0, y0] = pickSol(d, 6);
        if (d.bool()) {
          // ㉠ m(x + p) − (x − y) = c, ㉡ x/k − (y + q)/j = c
          const mm = d.int(2, 5), p = nz(d, -4, 4), k = d.pick([2, 3, 4]), j = d.pick([2, 3, 4, 6]), q = nz(d, -5, 5);
          const L1 = [tg(mm, ts([1, 'x'], [p, ''])), tg(-1, ts([1, 'x'], [-1, 'y']))], L2 = [tm(Q(1, k), 'x'), tf(ts([1, 'y'], [q, '']), j, -1)];
          return { e1: closed(L1, x0, y0), e2: closed(L2, x0, y0) };
        }
        // ㉠ (ax + p)/m = (y + q)/k, ㉡ 0.u(x + 2y) − 0.w(x + y) = c
        const [mm, k] = d.pick([[2, 3], [3, 2], [3, 4], [4, 3], [2, 5], [5, 2]]), a = d.int(1, 3), t = nz(d, -3, 3), p = mm * t - a * x0, q = k * t - y0, u = d.int(1, 5), w = d.until(() => d.int(1, 5), (v) => v !== u), g = d.int(2, 3);
        const c2 = u * (x0 + g * y0) - w * (x0 + y0);
        return { e1: p !== 0 && q !== 0 && Math.abs(p) <= 9 && Math.abs(q) <= 9 ? [[tf(ts([a, 'x'], [p, '']), mm, 1)], [tf(ts([1, 'y'], [q, '']), k, 1)]] : null, e2: c2 !== 0 && Math.abs(c2) <= 60 ? [[tg(dc(u), ts([1, 'x'], [g, 'y'])), tg(dc(-w), ts([1, 'x'], [1, 'y']))], ts([d1(c2), ''])] : null };
      }, (r) => Boolean(r.e1 && r.e2 && solve2(r.e1, r.e2)) && tame(r.e1, r.e2));
      return solveQ(m.e1, m.e2, 'both');
    }),
    T('forms-ratio', '비례식이 있는 연립방정식', '②31 심26', (d) => {
      // ㉠ (x + p) : (y + q) = m : k (두 항은 모두 양수), ㉡ ax + by = c
      const m = d.until(() => { const [mm, k] = d.pick([[2, 3], [3, 2], [1, 2], [2, 1], [3, 4], [4, 3], [2, 5], [5, 2], [1, 3], [3, 1]]), t = d.int(1, 3), [x0, y0] = pickSol(d, 6), a = nz(d, -5, 5), b = nz(d, -5, 5); return { mm, k, x0, y0, a, b, p: mm * t - x0, q: k * t - y0 }; },
        (r) => r.p !== 0 && r.q !== 0 && Math.abs(r.p) <= 9 && Math.abs(r.q) <= 9 && r.k * r.b + r.mm * r.a !== 0 && tame(I(r.k, -r.mm, r.mm * r.q - r.k * r.p), I(r.a, r.b, r.a * r.x0 + r.b * r.y0)));
      const { mm, k, x0, y0, a, b, p, q } = m, left = ts([1, 'x'], [p, '']), right = ts([1, 'y'], [q, '']), e1 = [k === 1 ? left : [tg(k, left)], mm === 1 ? right : [tg(mm, right)]], e2 = I(a, b, a * x0 + b * y0);
      const ratio = `(${sideH(left)}) : (${sideH(right)}) = ${mm} : ${k}`;
      return solveQ(e1, e2, 'ratio', { rows: [ratio, eqH(e2)], lead: `비례식에서 외항의 곱과 내항의 곱은 같으므로 ㉠은 ${eqT(e1)}이다. ` });
    }),
    T('forms-abc', 'A = B = C 꼴의 방정식', '①32 ②32 심28', (d, n) => {
      const HOW = 'A = B = C 꼴의 방정식은 세 식 가운데 두 식씩 짝 지어 만든 연립방정식으로 푼다.';
      if (n === 0) {
        // C 가 수이다: A = C, B = C 로 짝 짓는다.
        const m = d.until(() => { const [x0, y0] = pickSol(d, 6), [a1, b1, a2, b2] = [nz(d, -5, 5), nz(d, -5, 5), nz(d, -5, 5), nz(d, -5, 5)], c = a1 * x0 + b1 * y0; return { x0, y0, a1, b1, a2, b2, c, k2: c - a2 * x0 - b2 * y0 }; },
          (r) => r.a1 * r.b2 - r.a2 * r.b1 !== 0 && r.a1 !== r.a2 && r.b1 !== r.b2 && r.c !== 0 && r.k2 !== 0 && Math.abs(r.c) <= 30 && Math.abs(r.k2) <= 15 && tame(I(r.a1, r.b1, r.c), I(r.a2, r.b2, r.c - r.k2)));
        const { x0, y0, a1, b1, a2, b2, c, k2 } = m, e1 = I(a1, b1, c), e2 = [ts([a2, 'x'], [b2, 'y'], [k2, '']), ts([c, ''])];
        return xyAns('다음 방정식을 푸시오.', x0, y0, {
          figure: wide(`${sideH(e1[0])} = ${sideH(e2[0])} = ${iq(c)}`),
          explain: `${HOW} ${eqT(e1)} …… ㉠, ${eqT(e2)} …… ㉡이라 하자. ${told(e1, e2).text}`,
          facts: solFacts(e1, e2, 'abc-0')
        });
      }
      // 세 식이 모두 분수 꼴이다: A = B, B = C 로 짝 짓는다.
      const m = d.until(() => {
        const [mm, j, l] = d.shuffle([2, 3, 4, 5, 6]).slice(0, 3), t = nz(d, -3, 3), k3 = nz(d, -6, 6), s1 = pm(d), x0 = j * t, y0 = l * t - k3, k1 = mm * t - x0 - s1 * y0;
        const numA = ts([1, 'x'], [s1, 'y'], [k1, '']), numC = ts([1, 'y'], [k3, '']);
        return { mm, j, l, x0, y0, k1, numA, numC, e1: [[tf(numA, mm, 1)], [tm(Q(1, j), 'x')]], e2: [[tm(Q(1, j), 'x')], [tf(numC, l, 1)]] };
      }, (r) => r.y0 !== 0 && Math.abs(r.y0) <= 12 && Math.abs(r.k1) <= 9 && Boolean(solve2(r.e1, r.e2)) && tame(r.e1, r.e2));
      const { mm, j, l, x0, y0, numA, numC, e1, e2 } = m;
      return xyAns('다음 방정식을 푸시오.', x0, y0, {
        figure: wide(`${frac(sideH(numA), mm)} = ${frac(X, j)} = ${frac(sideH(numC), l)}`),
        explain: `${HOW} ${eqT(e1)} …… ㉠, ${eqT(e2)} …… ㉡이라 하자. ${told(e1, e2).text}`,
        facts: solFacts(e1, e2, 'abc-1')
      });
    }, { count: 2 })
  ]);

  // ── 해의 조건과 수 구하기 ──
  const big = (d, lim) => d.until(() => nz(d, -(lim || 6), lim || 6), (v) => Math.abs(v) > 1);
  B.addTypes(UNIT, 'param', [
    T('param-given', '연립방정식의 해가 주어질 때 상수 구하기', '①38 ②33 심11', (d, n) => {
      const [p, q] = d.until(() => pickSol(d, 4), ([u, w]) => Math.abs(u + w) > 1);
      if (n === 0) {
        // 식마다 상수가 하나씩: ㉠ ax + B₁y = c₁, ㉡ A₂x + by = c₂
        const m = d.until(() => ({ a: big(d), b: big(d), B1: nz(d, -5, 5), A2: nz(d, -5, 5) }), (r) => r.a * r.b - r.A2 * r.B1 !== 0);
        const { a, b, B1, A2 } = m, c1 = a * p + B1 * q, c2 = A2 * p + b * q, r1 = `${poly([[1, va + X], [B1, Y]])} = ${iq(c1)}`, r2 = `${poly([[A2, X], [1, vb + Y]])} = ${iq(c2)}`;
        return valsAns(`연립방정식 ${sysOf([r1, r2], NAME)}의 해가 ${solH(p, q)}일 때, 상수 ${va}, ${vb}의 값은?`, [['a', a], ['b', b]], {
          explain: `연립방정식의 해는 두 일차방정식을 모두 참이 되게 한다. ${solH(p, q)}${tail(Math.abs(q), '을/를')} ㉠에 대입하면 ${nb(`${poly([[p, va], [B1 * q, '']])} = ${iq(c1)}`)}이므로 ${nb(`${va} = ${iq(a)}`)}이고, ㉡에 대입하면 ${nb(`${poly([[A2 * p, ''], [q, vb]])} = ${iq(c2)}`)}이므로 ${nb(`${vb} = ${iq(b)}`)}이다.`,
          facts: { calc: [[`((${c1})-(${B1})*(${q}))/(${p})`, 0], [`((${c2})-(${A2})*(${p}))/(${q})`, 1]], unseen: [1, 0], rule: 'given-0' }
        });
      }
      // 한 상수가 두 식에 걸쳐 있다: ㉠ ax + by = c, ㉡ x + y = a
      const a = p + q, b = d.until(() => big(d), (v) => v !== a), c = a * p + b * q;
      return valsAns(`연립방정식 ${sysOf([`${poly([[1, va + X], [1, vb + Y]])} = ${iq(c)}`, `${X} + ${Y} = ${va}`], NAME)}의 해가 ${solH(p, q)}일 때, 상수 ${va}, ${vb}의 값은?`, [['a', a], ['b', b]], {
        explain: `${solH(p, q)}${tail(Math.abs(q), '을/를')} ㉡에 대입하면 ${nb(`${va} = ${iq(p)} + ${q < 0 ? `(${iq(q)})` : q} = ${iq(a)}`)}이다. ㉠에 ${nb(`${va} = ${iq(a)}`)}${tail(Math.abs(a), '과/와')} ${solH(p, q)}${tail(Math.abs(q), '을/를')} 대입하면 ${nb(`${poly([[a * p, ''], [q, vb]])} = ${iq(c)}`)}이므로 ${nb(`${vb} = ${iq(b)}`)}이다.`,
        facts: { calc: [[`(${p})+(${q})`, 0], [`((${c})-((${p})+(${q}))*(${p}))/(${q})`, 1]], unseen: [1, 0], rule: 'given-1' }
      });
    }, { count: 2 }),
    T('param-half', '해의 한쪽 값도 문자일 때 상수 구하기', '①39 ②34 심12·13', (d) => {
      // 상수가 없는 식에 먼저 대입하여 해의 빈 값을 구한다.
      if (d.bool()) {
        // ㉠ x + By = a, ㉡ A₂x + B₂y = c₂, 해 (b, q)
        const m = d.until(() => ({ Bc: nz(d, -4, 4), A2: big(d, 4), B2: nz(d, -5, 5), b: nz(d, -5, 5), q: nz(d, -5, 5) }), (r) => r.A2 * r.Bc - r.B2 !== 0 && r.b + r.Bc * r.q !== 0 && r.A2 * r.b + r.B2 * r.q !== 0);
        const { Bc, A2, B2, b, q } = m, a = b + Bc * q, c2 = A2 * b + B2 * q, e2 = I(A2, B2, c2), bJ = `(((${c2})-(${B2})*(${q}))/(${A2}))`;
        return valsAns(`연립방정식 ${sysOf([`${poly([[1, X], [Bc, Y]])} = ${va}`, eqH(e2)], NAME)}의 해가 ${nb(`${X} = ${vb}`)}, ${nb(`${Y} = ${iq(q)}`)}일 때, 상수 ${va}, ${vb}의 값은?`, [['a', a], ['b', b]], {
          explain: `${va}가 없는 ㉡에 ${nb(`${X} = ${vb}`)}, ${nb(`${Y} = ${iq(q)}`)}${tail(Math.abs(q), '을/를')} 대입하면 ${nb(`${poly([[A2, vb], [B2 * q, '']])} = ${iq(c2)}`)}이므로 ${nb(`${vb} = ${iq(b)}`)}이다. ${solH(b, q)}${tail(Math.abs(q), '을/를')} ㉠에 대입하면 ${nb(`${va} = ${iq(a)}`)}이다.`,
          facts: { calc: [[`${bJ}+(${Bc})*(${q})`, 0], [bJ, 1]], unseen: [1, 0], rule: 'half-0' }
        });
      }
      // ㉠ x + ay = c₁, ㉡ A₂x + B₂y = c₂, 해 (p, b)
      const m = d.until(() => ({ a: big(d, 5), A2: nz(d, -5, 5), B2: big(d, 4), p: nz(d, -5, 5), b: nz(d, -5, 5) }), (r) => r.A2 * r.a - r.B2 !== 0 && r.p + r.a * r.b !== 0 && r.A2 * r.p + r.B2 * r.b !== 0);
      const { a, A2, B2, p, b } = m, c1 = p + a * b, c2 = A2 * p + B2 * b, e2 = I(A2, B2, c2), bJ = `(((${c2})-(${A2})*(${p}))/(${B2}))`;
      return valsAns(`연립방정식 ${sysOf([`${poly([[1, X], [1, va + Y]])} = ${iq(c1)}`, eqH(e2)], NAME)}의 해가 ${nb(`${X} = ${iq(p)}`)}, ${nb(`${Y} = ${vb}`)}일 때, 상수 ${va}, ${vb}의 값은?`, [['a', a], ['b', b]], {
        explain: `${va}가 없는 ㉡에 ${nb(`${X} = ${iq(p)}`)}, ${nb(`${Y} = ${vb}`)}를 대입하면 ${nb(`${poly([[A2 * p, ''], [B2, vb]])} = ${iq(c2)}`)}이므로 ${nb(`${vb} = ${iq(b)}`)}이다. ${solH(p, b)}${tail(Math.abs(b), '을/를')} ㉠에 대입하면 ${nb(`${poly([[p, ''], [b, va]])} = ${iq(c1)}`)}이므로 ${nb(`${va} = ${iq(a)}`)}이다.`,
        facts: { calc: [[`((${c1})-(${p}))/${bJ}`, 0], [bJ, 1]], unseen: [1, 0], rule: 'half-1' }
      });
    }),
    T('param-cross', '해를 대입하면 a, b에 대한 연립방정식이 되는 것', '①40 ②35', (d) => {
      // ㉠ ax + by = c₁, ㉡ bx + s·ay = c₂ (s = ±1). 해를 대입하면 pa + qb = c₁, s·qa + pb = c₂
      const m = d.until(() => { const [p, q] = pickSol(d, 4), s = pm(d), a = nz(d, -5, 5), b = nz(d, -5, 5); return { p, q, s, a, b }; }, (r) => r.p * r.p - r.s * r.q * r.q !== 0 && r.a !== r.b);
      const { p, q, s, a, b } = m, c1 = a * p + b * q, c2 = b * p + s * a * q, det = `((${p})*(${p})-(${s})*(${q})*(${q}))`;
      const el = elimTold({ a: p, b: q, c: c1 }, { a: s * q, b: p, c: c2 }, '㉢', '㉣', ['a', 'b']);
      return valsAns(`연립방정식 ${sysOf([`${poly([[1, va + X], [1, vb + Y]])} = ${iq(c1)}`, `${poly([[1, vb + X], [s, va + Y]])} = ${iq(c2)}`], NAME)}의 해가 ${solH(p, q)}일 때, 상수 ${va}, ${vb}의 값은?`, [['a', a], ['b', b]], {
        explain: `${solH(p, q)}${tail(Math.abs(q), '을/를')} ㉠, ㉡에 대입하면 ${nb(stdH({ a: p, b: q, c: c1 }, ['a', 'b']))} …… ㉢, ${nb(stdH({ a: s * q, b: p, c: c2 }, ['a', 'b']))} …… ㉣이다. ${va}, ${vb}에 대한 이 연립방정식을 푼다. ${el.text}`,
        facts: { calc: [[`((${c1})*(${p})-(${q})*(${c2}))/${det}`, 0], [`((${p})*(${c2})-(${s})*(${q})*(${c1}))/${det}`, 1]], unseen: [1, 0] }
      });
    }),
    T('param-third', '연립방정식의 해가 다른 일차방정식을 만족시킬 때 상수 구하기', '①41·42 ②38·39 심16·17', (d, n) => {
      const m = d.until(() => { const [x0, y0] = pickSol(d, 5), [a1, b1, a2, b2] = [nz(d, -5, 5), nz(d, -5, 5), nz(d, -5, 5), nz(d, -5, 5)]; return { x0, y0, a1, b1, a2, b2, c1: a1 * x0 + b1 * y0, c2: a2 * x0 + b2 * y0 }; }, (r) => r.a1 * r.b2 - r.a2 * r.b1 !== 0 && r.c1 !== 0 && r.c2 !== 0 && Math.abs(r.c1) <= 30 && Math.abs(r.c2) <= 30);
      const { x0, y0 } = m, e1 = I(m.a1, m.b1, m.c1), e2 = I(m.a2, m.b2, m.c2), j = solJ(e1, e2), s = told(e1, e2);
      if (n === 0) {
        // 주어진 연립방정식을 풀어 셋째 식에 대입한다.
        const [A, a] = d.until(() => [nz(d, -5, 5), big(d)], ([u, w]) => u * x0 + w * y0 !== 0), c3 = A * x0 + a * y0, third = `${poly([[A, X], [1, va + Y]])} = ${iq(c3)}`;
        return ansV(`연립방정식 ${sysL(e1, e2)}의 해가 일차방정식 ${nb(third)}${tail(Math.abs(c3), '을/를')} 만족시킬 때, 상수 ${va}의 값은?`, Q(a), 'int', {
          explain: `${s.text} ${solH(x0, y0)}${tail(Math.abs(y0), '을/를')} ${nb(third)}에 대입하면 ${nb(`${poly([[A * x0, ''], [y0, va]])} = ${iq(c3)}`)}이므로 ${nb(`${va} = ${iq(a)}`)}이다.`,
          facts: { value: `((${c3})-(${A})*(${j.x}))/(${j.y})`, unseen: j.unseen, rule: 'third-0' }
        });
      }
      // 연립방정식의 한 식에 상수가 있다. 상수가 없는 두 식을 짝 지어 먼저 푼다.
      const [A, k] = d.until(() => [nz(d, -5, 5), big(d)], ([u, w]) => u * x0 - w * y0 !== 0), c3 = A * x0 - k * y0, withK = `${poly([[A, X], [-1, vk + Y]])} = ${iq(c3)}`;
      return ansV(`연립방정식 ${sysOf([eqH(e1), withK])}의 해가 일차방정식 ${eqT(e2)}${endTail(e2[1], '을/를')} 만족시킬 때, 상수 ${vk}의 값은?`, Q(k), 'int', {
        explain: `연립방정식의 해는 세 일차방정식을 모두 참이 되게 한다. ${vk}가 없는 두 식 ${eqT(e1)} …… ㉠, ${eqT(e2)} …… ㉡을 짝 지어 푼다. ${s.text} ${solH(x0, y0)}${tail(Math.abs(y0), '을/를')} ${nb(withK)}에 대입하면 ${nb(`${poly([[A * x0, ''], [-y0, vk]])} = ${iq(c3)}`)}이므로 ${nb(`${vk} = ${iq(k)}`)}이다.`,
        facts: { value: `((${A})*(${j.x})-(${c3}))/(${j.y})`, unseen: j.unseen, rule: 'third-1' }
      });
    }, { count: 2 }),
    T('param-relation', 'x와 y 사이의 관계가 주어질 때 상수 구하기', '①43·44 ②40 심14', (d, n) => {
      if (n === 0) {
        // 상수가 한 식에만 있다. 관계식과 상수가 없는 식을 짝 지어 해를 구한다.
        const kind = d.int(0, 2), mm = d.int(2, 4), k = nz(d, -5, 5);
        const m = d.until(() => {
          const t = nz(d, -4, 4), [x0, y0] = kind === 0 ? [mm * t, t] : kind === 1 ? [t, t + k] : [t, mm * t], [a1, b1, a2, b2] = [nz(d, -5, 5), nz(d, -5, 5), nz(d, -5, 5), nz(d, -5, 5)], K = d.int(-9, 9);
          return { x0, y0, a1, b1, a2, b2, K, c1: a1 * x0 + b1 * y0, a: a2 * x0 + b2 * y0 - K };
        }, (r) => r.y0 !== 0 && r.c1 !== 0 && Math.abs(r.c1) <= 40 && Math.abs(r.a) > 1 && Math.abs(r.a) <= 30 && (kind === 0 ? r.a1 * mm + r.b1 : kind === 1 ? r.a1 + r.b1 : r.a1 + r.b1 * mm) !== 0);
        const { x0, y0, a1, b1, a2, b2, K, c1, a } = m, e1 = I(a1, b1, c1), row2 = `${poly([[a2, X], [b2, Y]])} = ${poly([[1, va], [K, '']])}`;
        const said = [`${X}의 값이 ${Y}의 값의 ${mm}배일 때`, `${Y}의 값이 ${X}의 값보다 ${Math.abs(k)}만큼 ${k > 0 ? '클' : '작을'} 때`, `${X}의 값과 ${Y}의 값의 비가 ${nb(`1 : ${mm}`)}일 때`][kind];
        const [v, expr] = kind === 0 ? ['x', ts([mm, 'y'])] : kind === 1 ? ['y', ts([1, 'x'], [k, ''])] : ['y', ts([mm, 'x'])], rel = [ts([1, v]), expr], j = solJ(e1, rel), s = subTold(v, expr, e1, ['㉢', '㉠']);
        return ansV(`연립방정식 ${sysOf([eqH(e1), row2], NAME)}을 만족시키는 ${said}, 상수 ${va}의 값은?`, Q(a), 'int', {
          explain: `주어진 조건을 식으로 나타내면 ${eqT(rel)} …… ㉢이다. ${va}가 없는 ㉠과 ㉢을 짝 지어 푼다. ${s.text} ${solH(x0, y0)}${tail(Math.abs(y0), '을/를')} ㉡에 대입하면 ${nb(`${iq(a2 * x0 + b2 * y0)} = ${poly([[1, va], [K, '']])}`)}이므로 ${nb(`${va} = ${iq(a)}`)}이다.`,
          facts: { value: `(${a2})*(${j.x})+(${b2})*(${j.y})-(${K})`, unseen: j.unseen, rule: 'relation-0' }
        });
      }
      // 상수가 두 식에 모두 있다. 관계식을 두 식에 대입하면 한 미지수와 상수에 대한 연립방정식이 된다.
      const mm = d.pick([2, 3, -2]);
      const m = d.until(() => { const y0 = nz(d, -4, 4), [A1, B1, A2, B2] = [nz(d, -4, 4), nz(d, -4, 4), nz(d, -4, 4), nz(d, -4, 4)], K2 = d.int(-6, 6), a = (A2 * mm + B2) * y0 - K2; return { y0, A1, B1, A2, B2, K2, a, K1: (A1 * mm + B1) * y0 + a }; },
        (r) => r.A1 * mm + r.B1 !== 0 && r.A2 * mm + r.B2 !== 0 && (r.A1 + r.A2) * mm + r.B1 + r.B2 !== 0 && Math.abs(r.a) > 1 && Math.abs(r.a) <= 20 && r.K1 !== 0 && Math.abs(r.K1) <= 30);
      const { y0, A1, B1, A2, B2, K2, a, K1 } = m, u = A1 * mm + B1, w = A2 * mm + B2;
      const r1 = `${poly([[A1, X], [B1, Y]])} = ${poly([[K1, ''], [-1, va]])}`, r2 = `${poly([[A2, X], [B2, Y]])} = ${poly([[1, va], [K2, '']])}`, yJ = `((${K1})+(${K2}))/((${A1})*(${mm})+(${B1})+(${A2})*(${mm})+(${B2}))`;
      return ansV(`연립방정식 ${sysOf([r1, r2], NAME)}을 만족시키는 ${X}의 값이 ${Y}의 값의 ${mm < 0 ? iq(mm) : mm}배일 때, 상수 ${va}의 값은?`, Q(a), 'int', {
        explain: `${X}의 값이 ${Y}의 값의 ${iq(mm)}배이므로 ${nb(`${X} = ${poly([[mm, Y]])}`)}이다. 이것을 ㉠, ㉡에 대입하여 정리하면 ${nb(`${poly([[u, Y]])} = ${poly([[K1, ''], [-1, va]])}`)} …… ㉢, ${nb(`${poly([[w, Y]])} = ${poly([[1, va], [K2, '']])}`)} …… ㉣이다. ㉢ + ㉣을 하면 ${nb(`${poly([[u + w, Y]])} = ${iq(K1 + K2)}`)}이므로 ${nb(`${Y} = ${iq(y0)}`)}이다. 이것을 ㉣에 대입하면 ${nb(`${iq(w * y0)} = ${poly([[1, va], [K2, '']])}`)}이므로 ${nb(`${va} = ${iq(a)}`)}이다.`,
        facts: { value: `((${A2})*(${mm})+(${B2}))*${yJ}-(${K2})`, unseen: [1, 0], rule: 'relation-1' }
      });
    }, { count: 2 }),
    T('param-same', '해가 서로 같은 두 연립방정식의 상수 구하기', '①45 ②41 심18', (d) => {
      // 상수가 없는 두 식(첫째 연립방정식의 둘째 식, 둘째 연립방정식의 첫째 식)을 짝 지어 먼저 푼다.
      const m = d.until(() => { const [x0, y0] = pickSol(d, 5), [a2, b2, a3, b3] = [nz(d, -5, 5), nz(d, -5, 5), nz(d, -5, 5), nz(d, -5, 5)]; return { x0, y0, a2, b2, a3, b3, c2: a2 * x0 + b2 * y0, c3: a3 * x0 + b3 * y0 }; }, (r) => r.a2 * r.b3 - r.a3 * r.b2 !== 0 && r.c2 !== 0 && r.c3 !== 0 && Math.abs(r.c2) <= 30 && Math.abs(r.c3) <= 30);
      const { x0, y0 } = m, e2 = I(m.a2, m.b2, m.c2), e3 = I(m.a3, m.b3, m.c3), [A1, a] = d.until(() => [nz(d, -6, 6), big(d)], ([u, w]) => u * x0 + w * y0 !== 0), [A4, b] = d.until(() => [nz(d, -6, 6), big(d)], ([u, w]) => u * x0 - w * y0 !== 0), c1 = A1 * x0 + a * y0, c4 = A4 * x0 - b * y0, j = solJ(e2, e3);
      const r1 = `${poly([[A1, X], [1, va + Y]])} = ${iq(c1)}`, r4 = `${poly([[A4, X], [-1, vb + Y]])} = ${iq(c4)}`;
      return valsAns(`두 연립방정식 ${sysOf([r1, eqH(e2)])}, ${sysOf([eqH(e3), r4])}의 해가 서로 같을 때, 상수 ${va}, ${vb}의 값은?`, [['a', a], ['b', b]], {
        explain: `두 연립방정식의 해가 같으므로 그 해는 네 일차방정식을 모두 참이 되게 한다. ${va}, ${vb}가 없는 두 식 ${eqT(e2)} …… ㉠, ${eqT(e3)} …… ㉡을 짝 지어 푼다. ${told(e2, e3).text} ${solH(x0, y0)}${tail(Math.abs(y0), '을/를')} ${nb(r1)}에 대입하면 ${nb(`${va} = ${iq(a)}`)}이고, ${nb(r4)}에 대입하면 ${nb(`${vb} = ${iq(b)}`)}이다.`,
        facts: { calc: [[`((${c1})-(${A1})*(${j.x}))/(${j.y})`, 0], [`((${A4})*(${j.x})-(${c4}))/(${j.y})`, 1]], unseen: j.unseen }
      });
    }),
    T('param-chain', '한 연립방정식의 해를 계수로 하는 다른 연립방정식 풀기', '②42', (d) => {
      const m = d.until(() => {
        const [a, b] = pickSol(d, 5), [x1, y1] = pickSol(d, 5), [a1, b1, a2, b2] = [nz(d, -5, 5), nz(d, -5, 5), nz(d, -5, 5), nz(d, -5, 5)];
        return { a, b, x1, y1, a1, b1, a2, b2, c1: a1 * a + b1 * b, c2: a2 * a + b2 * b };
      }, (r) => Math.abs(r.a) !== Math.abs(r.b) && r.a1 * r.b2 - r.a2 * r.b1 !== 0 && r.c1 !== 0 && r.c2 !== 0 && Math.abs(r.c1) <= 30 && Math.abs(r.c2) <= 30 && r.a * r.x1 + r.b * r.y1 !== 0 && r.b * r.x1 + r.a * r.y1 !== 0);
      const { a, b, x1, y1 } = m, e1 = I(m.a1, m.b1, m.c1), e2 = I(m.a2, m.b2, m.c2), c3 = a * x1 + b * y1, c4 = b * x1 + a * y1, j = solJ(e1, e2);
      const [xj, yj] = cramerJ({ a: `(${j.x})`, b: `(${j.y})`, c: `(${c3})` }, { a: `(${j.y})`, b: `(${j.x})`, c: `(${c4})` });
      const r3 = `${poly([[1, va + X], [1, vb + Y]])} = ${iq(c3)}`, r4 = `${poly([[1, vb + X], [1, va + Y]])} = ${iq(c4)}`;
      return xyAns(`연립방정식 ${sysL(e1, e2)}의 해가 ${nb(`${X} = ${va}`)}, ${nb(`${Y} = ${vb}`)}일 때, 연립방정식 ${sysOf([r3, r4])}의 해를 구하시오.`, x1, y1, {
        explain: `${told(e1, e2).text} 따라서 ${nb(`${va} = ${iq(a)}`)}, ${nb(`${vb} = ${iq(b)}`)}이므로 둘째 연립방정식의 두 식은 ${nb(stdH({ a, b, c: c3 }))} …… ㉢, ${nb(stdH({ a: b, b: a, c: c4 }))} …… ㉣이다. ${elimTold({ a, b, c: c3 }, { a: b, b: a, c: c4 }, '㉢', '㉣').text}`,
        facts: { calc: [[xj, 0], [yj, 1]], unseen: j.unseen, rule: 'chain' }
      });
    }),
    T('param-abc', 'A = B = C 꼴의 방정식의 해가 주어질 때 상수 구하기', '①33', (d) => {
      // A₁x + ay = bx + B₂y = c
      const m = d.until(() => { const [p, q] = pickSol(d, 4), A1 = nz(d, -5, 5), B2 = nz(d, -5, 5), a = big(d, 5), c = A1 * p + a * q; return { p, q, A1, B2, a, c, bq: Q(c - B2 * q, p) }; }, (r) => r.c !== 0 && r.bq.q === 1 && Math.abs(r.bq.p) > 1 && Math.abs(r.bq.p) <= 9);
      const { p, q, A1, B2, a, c } = m, b = m.bq.p;
      return valsAns(`방정식 ${nb(`${poly([[A1, X], [1, va + Y]])} = ${poly([[1, vb + X], [B2, Y]])} = ${iq(c)}`)}의 해가 ${solH(p, q)}일 때, 상수 ${va}, ${vb}의 값은?`, [['a', a], ['b', b]], {
        explain: `${solH(p, q)}${tail(Math.abs(q), '을/를')} 대입하면 ${nb(`${poly([[A1 * p, ''], [q, va]])} = ${iq(c)}`)}, ${nb(`${poly([[p, vb], [B2 * q, '']])} = ${iq(c)}`)}이다. 따라서 ${nb(`${va} = ${iq(a)}`)}, ${nb(`${vb} = ${iq(b)}`)}이다.`,
        facts: { calc: [[`((${c})-(${A1})*(${p}))/(${q})`, 0], [`((${c})-(${B2})*(${q}))/(${p})`, 1]], unseen: [1, 0] }
      });
    })
  ]);

  // ── 연립방정식의 활용 ──
  B.addTypes(UNIT, 'word', [
    T('word-sum-times', '합과 「몇 배보다 얼마 큰」 관계를 아는 두 수', '①49 ②45', (d) => {
      const m = d.until(() => { const k = d.int(2, 4), small = d.int(4, 15), r = d.int(1, 5), more = d.bool(); return { k, small, r, more, big: k * small + (more ? r : -r) }; }, (t) => t.big > t.small + 1);
      const { k, small, r, more } = m, sum = m.big + small, e1 = I(1, 1, sum), e2 = [ts([1, 'x']), ts([k, 'y'], [more ? r : -r, ''])], sJ = `(${sum}${more ? '-' : '+'}${r})/(${k}+1)`;
      return M(`합이 ${sum}인 두 자연수가 있다. 큰 수는 작은 수의 ${k}배보다 ${r}만큼 ${more ? '크다' : '작다'}. 두 수를 구하시오.`, [{ label: '큰 수', answer: m.big }, { label: '작은 수', answer: small }], {
        explain: setUp(`큰 수를 ${X}, 작은 수를 ${Y}라 하고`, e1, e2, m.big, small),
        facts: { calc: [[`${sum}-${sJ}`, 0], [sJ, 1]], unseen: [1] }
      });
    }),
    T('word-age', '나이의 합과 몇 년 후의 배로 두 사람의 나이 구하기', '①54 ①53', (d) => {
      const m = d.until(() => { const k = d.int(2, 3), child = d.int(8, 16), after = d.int(3, 12); return { k, child, after, parent: k * (child + after) - after }; }, (r) => r.parent >= 36 && r.parent <= 55 && r.parent - r.child >= 24);
      const [who, kid] = d.pick([['아버지', '아들'], ['어머니', '딸'], ['아버지', '딸'], ['어머니', '아들']]), { k, child, after, parent } = m, sum = parent + child;
      const e1 = I(1, 1, sum), e2 = [ts([1, 'x'], [after, '']), [tg(k, ts([1, 'y'], [after, '']))]], cJ = `(${sum}+${after}-${k}*${after})/(${k}+1)`;
      return M(`올해 ${josa(who, '과/와')} ${kid}의 나이의 합은 ${sum}살이고, ${after}년 후에는 ${who}의 나이가 ${kid}의 나이의 ${k}배가 된다. 올해 ${josa(who, '과/와')} ${kid}의 나이는 각각 몇 살인가?`, [{ label: who, answer: parent, unit: '살' }, { label: kid, answer: child, unit: '살' }], {
        explain: setUp(`올해 ${who}의 나이를 ${X}살, ${kid}의 나이를 ${Y}살이라 하면 ${after}년 후의 나이는 각각 ${nb(`(${X} + ${after})`)}살, ${nb(`(${Y} + ${after})`)}살이다.`, e1, e2, parent, child),
        facts: { calc: [[`${sum}-${cJ}`, 0], [cJ, 1]], unseen: [1] }
      });
    }),
    T('word-quotient', '합과 나눗셈의 몫·나머지를 아는 두 수', '①50 ②46', (d) => {
      const q = d.int(2, 6), small = d.int(5, 15), r = d.int(1, Math.min(small - 1, 9)), bigN = q * small + r, sum = bigN + small, e1 = I(1, 1, sum), e2 = [ts([1, 'x']), ts([q, 'y'], [r, ''])], sJ = `(${sum}-${r})/(${q}+1)`;
      return M(`합이 ${sum}인 두 자연수가 있다. 큰 수를 작은 수로 나누면 몫이 ${q}이고 나머지가 ${r}이다. 두 수를 구하시오.`, [{ label: '큰 수', answer: bigN }, { label: '작은 수', answer: small }], {
        explain: setUp(`큰 수를 ${X}, 작은 수를 ${Y}라 하자. 나누어지는 수는 나누는 수와 몫의 곱에 나머지를 더한 것과 같으므로 ${eqT(e2)}이다.`, e1, e2, bigN, small),
        facts: { calc: [[`${sum}-${sJ}`, 0], [sJ, 1]], unseen: [1] }
      });
    }),
    T('word-digits', '자리의 숫자를 바꾼 두 자리 자연수', '①51 ②47', (d, n) => {
      if (n === 0) {
        // 각 자리의 숫자의 합과, 바꾼 수와 처음 수의 차
        const [t, u] = d.until(() => [d.int(1, 9), d.int(1, 9)], ([p, q]) => p !== q), sum = t + u, up = u > t, diff = 9 * Math.abs(u - t), first = 10 * t + u;
        const e1 = I(1, 1, sum), e2 = [ts([10, 'y'], [1, 'x']), ts([10, 'x'], [1, 'y'], [up ? diff : -diff, ''])];
        return ansV(`각 자리의 숫자의 합이 ${sum}인 두 자리 자연수가 있다. 이 수의 십의 자리 숫자와 일의 자리 숫자를 바꾼 수는 처음 수보다 ${diff}만큼 ${up ? '크다' : '작다'}. 처음 수는?`, Q(first), 'int', {
          explain: setUp(`처음 수의 십의 자리 숫자를 ${X}, 일의 자리 숫자를 ${Y}라 하면 처음 수는 ${nb(poly([[10, X], [1, Y]]))}, 바꾼 수는 ${nb(poly([[10, Y], [1, X]]))}이다.`, e1, e2, t, u, `따라서 처음 수는 ${first}이다.`),
          facts: { value: up ? `10*(${sum}-${diff}/9)/2+(${sum}+${diff}/9)/2` : `10*(${sum}+${diff}/9)/2+(${sum}-${diff}/9)/2`, unseen: [10, 9, 2], rule: 'digits-0' }
        });
      }
      // 두 자리의 숫자 사이의 관계와, 바꾼 수가 처음 수의 몇 배보다 얼마 크거나 작다는 조건
      const m = d.until(() => { const t = d.int(1, 4), mm = d.int(2, 3), c = d.int(-2, 2), u = mm * t + c, k = d.int(2, 3); return { t, mm, c, u, k, e: 10 * u + t - k * (10 * t + u) }; }, (r) => r.u >= 1 && r.u <= 9 && r.u !== r.t && r.e !== 0 && Math.abs(r.e) <= 30);
      const { t, mm, c, u, k, e } = m, first = 10 * t + u, e1 = [ts([1, 'y']), ts([mm, 'x'], [c, ''])], e2 = [ts([10, 'y'], [1, 'x']), [tg(k, ts([10, 'x'], [1, 'y'])), tm(e, '')]];
      return ansV(`두 자리 자연수가 있다. 이 수의 일의 자리 숫자는 십의 자리 숫자의 ${mm}배${c ? `보다 ${Math.abs(c)}만큼 ${c > 0 ? '크고' : '작고'}` : '이고'}, 십의 자리 숫자와 일의 자리 숫자를 바꾼 수는 처음 수의 ${k}배보다 ${Math.abs(e)}만큼 ${e > 0 ? '크다' : '작다'}. 처음 수는?`, Q(first), 'int', {
        explain: setUp(`처음 수의 십의 자리 숫자를 ${X}, 일의 자리 숫자를 ${Y}라 하면 처음 수는 ${nb(poly([[10, X], [1, Y]]))}, 바꾼 수는 ${nb(poly([[10, Y], [1, X]]))}이다.`, e1, e2, t, u, `따라서 처음 수는 ${first}이다.`),
        facts: { value: `(10+${mm})*((${e})+${k}*(${c})-10*(${c}))/(10*${mm}+1-10*${k}-${k}*${mm})+(${c})`, unseen: [10, 1, 0], rule: 'digits-1' }
      });
    }, { count: 2 }),
    T('word-count-total', '마리 수의 합과 다리 수의 합(대수의 합과 탄 사람 수)', '①55 ②48', (d) => {
      const x0 = d.int(4, 15), y0 = d.until(() => d.int(3, 14), (v) => v !== x0), n0 = x0 + y0;
      if (d.bool()) {
        const [two, four] = d.pick([['닭', '토끼'], ['오리', '돼지'], ['타조', '기린']]), legs = 2 * x0 + 4 * y0, e1 = I(1, 1, n0), e2 = I(2, 4, legs), fJ = `(${legs}-2*${n0})/(4-2)`;
        return M(`농장에 ${josa(two, '과/와')} ${josa(four, '이/가')} 모두 ${n0}마리 있고, 다리는 모두 ${legs}개이다. ${josa(two, '과/와')} ${josa(four, '은/는')} 각각 몇 마리인가?`, [{ label: two, answer: x0, unit: '마리' }, { label: four, answer: y0, unit: '마리' }], {
          explain: setUp(`${josa(two, '을/를')} ${X}마리, ${josa(four, '을/를')} ${Y}마리라 하면 ${two}의 다리는 2개, ${four}의 다리는 4개이므로`, e1, e2, x0, y0),
          facts: { calc: [[`${n0}-${fJ}`, 0], [fJ, 1]], unseen: [2, 4] }
        });
      }
      const people = x0 + 2 * y0, e1 = I(1, 1, n0), e2 = I(1, 2, people);
      return M(`학생 ${people}명이 1인용 자전거와 2인용 자전거를 합하여 ${n0}대에 빈자리 없이 나누어 탔다. 1인용 자전거와 2인용 자전거는 각각 몇 대인가?`, [{ label: '1인용', answer: x0, unit: '대' }, { label: '2인용', answer: y0, unit: '대' }], {
        explain: setUp(`1인용 자전거를 ${X}대, 2인용 자전거를 ${Y}대라 하면 자전거를 탄 학생은 ${nb(`(${poly([[1, X], [2, Y]])})`)}명이므로`, e1, e2, x0, y0),
        facts: { calc: [[`2*${n0}-${people}`, 0], [`${people}-${n0}`, 1]] }
      });
    }),
    T('word-bundles', '두 가지 묶음의 값으로 한 개의 값 구하기', '①56 ②49', (d) => {
      const [A, uA, Bn, uB] = d.pick([['사과', '개', '귤', '개'], ['연필', '자루', '공책', '권'], ['빵', '개', '우유', '개']]);
      const m = d.until(() => ({ a: d.int(2, 6), b: d.int(2, 6), c: d.int(2, 6), e: d.int(2, 6), p: 100 * d.int(3, 15), q: 100 * d.int(3, 15) }), (r) => r.a * r.e - r.b * r.c !== 0 && r.p !== r.q && r.a !== r.c && r.b !== r.e && r.a * r.p + r.b * r.q <= 15000 && r.c * r.p + r.e * r.q <= 15000);
      const { a, b, c, e, p, q } = m, P1 = a * p + b * q, P2 = c * p + e * q, e1 = I(a, b, P1), e2 = I(c, e, P2), [xj, yj] = cramerJ({ a, b, c: P1 }, { a: c, b: e, c: P2 });
      return M(`${A} ${a}${josa(uA, '과/와')} ${Bn} ${b}${uB}의 값은 ${P1}원이고, ${A} ${c}${josa(uA, '과/와')} ${Bn} ${e}${uB}의 값은 ${P2}원이다. ${A} 한 ${josa(uA, '과/와')} ${Bn} 한 ${uB}의 값은 각각 얼마인가?`, [{ label: A, answer: p, unit: '원' }, { label: Bn, answer: q, unit: '원' }], {
        explain: setUp(`${A} 한 ${uA}의 값을 ${X}원, ${Bn} 한 ${uB}의 값을 ${Y}원이라 하고`, e1, e2, p, q),
        facts: { calc: [[xj, 0], [yj, 1]] }
      });
    }),
    T('word-profit-loss', '이익이 생기는 것과 손해가 생기는 것의 개수', '①57 심43', (d) => {
      const m = d.until(() => { const p = 10 * d.pick([5, 8, 10, 12, 15, 20]), q = 10 * d.pick([10, 12, 15, 20, 25, 30]), n0 = 50 * d.int(2, 12), bad = 5 * d.int(1, 12); return { p, q, n0, bad, gain: p * (n0 - bad) - q * bad }; }, (r) => r.bad * 4 < r.n0 && r.gain > 0 && r.gain % 1000 === 0 && r.p !== r.q);
      const { p, q, n0, bad, gain } = m, good = n0 - bad, e1 = I(1, 1, n0), e2 = I(p, -q, gain), bJ = `(${p}*${n0}-${gain})/(${p}+${q})`;
      return M(`어느 공장에서 물건을 만드는데 합격품은 한 개에 ${p}원의 이익이 생기고, 불량품은 한 개에 ${q}원의 손해가 생긴다. 이 공장에서 물건 ${n0}개를 만들어 ${gain}원의 이익이 생겼을 때, 합격품과 불량품은 각각 몇 개인가?`, [{ label: '합격품', answer: good, unit: '개' }, { label: '불량품', answer: bad, unit: '개' }], {
        explain: setUp(`합격품을 ${X}개, 불량품을 ${Y}개라 하면 합격품으로 생긴 이익은 ${nb(poly([[p, X]]))}원, 불량품으로 생긴 손해는 ${nb(poly([[q, Y]]))}원이다. 손해는 이익에서 빼므로`, e1, e2, good, bad),
        facts: { calc: [[`${n0}-${bJ}`, 0], [bJ, 1]] }
      });
    }),
    T('word-rps', '가위바위보로 계단을 오르내린 결과에서 이긴 횟수 구하기', '①58 ②50 심42 심4', (d) => {
      const [p1, p2] = d.shuffle(NAMES).slice(0, 2), [u, w] = d.pick([[2, 1], [3, 1], [3, 2], [5, 2]]);
      const m = d.until(() => { const x0 = d.int(3, 12), y0 = d.int(3, 12); return { x0, y0, P: u * x0 - w * y0, Q2: u * y0 - w * x0 }; }, (r) => r.x0 !== r.y0 && r.P > 0 && r.Q2 > 0 && r.P !== r.Q2);
      const { x0, y0, P, Q2 } = m, e1 = I(u, -w, P), e2 = [ts([u, 'y'], [-w, 'x']), ts([Q2, ''])], det = `(${u}*${u}-${w}*${w})`;
      return M(`${name(p1, '과/와')} ${name(p2, '이/가')} 계단에서 가위바위보를 하여 이긴 사람은 ${u}계단 올라가고 진 사람은 ${w}계단 내려가기로 하였다. 얼마 후 ${name(p1, '은/는')} 처음 위치보다 ${P}계단, ${name(p2, '은/는')} 처음 위치보다 ${Q2}계단 올라가 있었다. ${name(p1, '과/와')} ${name(p2, '이/가')} 이긴 횟수는 각각 몇 번인가? (단, 비기는 경우는 없다.)`, [{ label: p1, answer: x0, unit: '번' }, { label: p2, answer: y0, unit: '번' }], {
        explain: setUp(`${name(p1, '이/가')} 이긴 횟수를 ${X}, ${name(p2, '이/가')} 이긴 횟수를 ${Y}라 하자. 비기는 경우가 없으므로 ${name(p1, '이/가')} 진 횟수는 ${Y}, ${name(p2, '이/가')} 진 횟수는 ${X}이다.`, e1, e2, x0, y0),
        facts: { calc: [[`(${P}*${u}+${Q2}*${w})/${det}`, 0], [`(${Q2}*${u}+${P}*${w})/${det}`, 1]] }
      });
    }),
    T('word-exchange', '서로 같은 수만큼 주고받았을 때의 개수', '②51', (d) => {
      const [p1, p2] = d.shuffle(NAMES).slice(0, 2), [thing, unit] = d.pick([['구슬', '개'], ['사탕', '개'], ['딱지', '장']]), k = d.pick([2, 3, 5]), t = d.int(1, 5), x0 = t * (3 + k) / (k - 1), y0 = x0 + 2 * t;
      const e1 = [ts([1, 'y'], [t, '']), [tg(k, ts([1, 'x'], [-t, '']))]], e2 = [ts([1, 'y'], [-t, '']), ts([1, 'x'], [t, ''])], xJ = `${t}*(3+${k})/(${k}-1)`, give = `${thing} ${t}${josa(unit, '을/를')}`;
      return M(`${name(p1, '과/와')} ${name(p2, '이/가')} ${josa(thing, '을/를')} 가지고 있다. ${name(p1, '이/가')} ${name(p2, '에게/에게')} ${give} 주면 ${name(p2, '의/의')} ${thing}의 수는 ${name(p1, '의/의')} ${thing}의 수의 ${k}배가 되고, ${name(p2, '이/가')} ${name(p1, '에게/에게')} ${give} 주면 두 사람의 ${thing}의 수가 같아진다. 두 사람이 가진 ${josa(thing, '은/는')} 각각 몇 ${unit}인가?`, [{ label: p1, answer: x0, unit }, { label: p2, answer: y0, unit }], {
        explain: setUp(`${name(p1, '이/가')} 가진 ${thing}의 수를 ${X}, ${name(p2, '이/가')} 가진 ${thing}의 수를 ${Y}라 하자. 한 사람이 ${t}${josa(unit, '을/를')} 주면 준 사람은 ${t}${unit} 줄고 받은 사람은 ${t}${unit} 늘어난다.`, e1, e2, x0, y0),
        facts: { calc: [[xJ, 0], [`${xJ}+2*${t}`, 1]], unseen: [3, 1, 2] }
      });
    }),
    T('word-fraction-parts', '두 무리에서 몇 분의 몇씩 모은 수', '①60 ②48', (d) => {
      const m = d.until(() => { const p = d.pick([2, 3, 4, 5, 6]), q = d.pick([2, 3, 4, 5, 6]), i = d.int(2, 6), j = d.int(2, 6); return { p, q, i, j, boys: p * i, girls: q * j }; }, (r) => r.p !== r.q && r.boys + r.girls >= 20 && r.boys + r.girls <= 40 && (r.boys + r.girls) % (r.i + r.j) === 0 && (r.boys + r.girls) / (r.i + r.j) <= 6 && r.boys !== r.girls);
      const { p, q, i, j, boys, girls } = m, total = boys + girls, r = total / (i + j), e1 = I(1, 1, total), e2 = [ts([Q(1, p), 'x'], [Q(1, q), 'y']), ts([i + j, ''])], bJ = `(${total}*${p}*${q}/${r}-${p}*${total})/(${q}-${p})`;
      return M(`어느 반의 학생은 모두 ${total}명이다. 이 반 남학생의 ${frac(1, p)}과 여학생의 ${frac(1, q)}이 합창반 학생이고, 합창반 학생은 반 전체 학생의 ${frac(1, r)}이다. 이 반의 남학생과 여학생은 각각 몇 명인가?`, [{ label: '남학생', answer: boys, unit: '명' }, { label: '여학생', answer: girls, unit: '명' }], {
        explain: setUp(`남학생을 ${X}명, 여학생을 ${Y}명이라 하자. 합창반 학생은 ${nb(`${total} × ${frac(1, r)} = ${i + j}`)}(명)이므로`, e1, e2, boys, girls),
        facts: { calc: [[bJ, 0], [`${total}-${bJ}`, 1]], unseen: [1] }
      });
    }),
    T('word-average', '두 무리의 평균과 전체 평균으로 인원 구하기', '심45', (d) => {
      const m = d.until(() => { const boys = d.int(8, 20), girls = d.int(8, 20), A = d.int(55, 85), Bv = d.int(55, 85); return { boys, girls, A, Bv, mean: (A * boys + Bv * girls) / (boys + girls) }; }, (r) => r.boys !== r.girls && Math.abs(r.A - r.Bv) >= 3 && Number.isInteger(r.mean) && r.boys + r.girls <= 36);
      const { boys, girls, A, Bv, mean } = m, total = boys + girls, e1 = I(1, 1, total), e2 = I(A, Bv, mean * total), bJ = `${total}*(${mean}-${Bv})/(${A}-${Bv})`;
      return M(`어느 반 학생 ${total}명이 수학 시험을 보았다. 남학생의 평균은 ${A}점, 여학생의 평균은 ${Bv}점이고, 반 전체의 평균은 ${mean}점이다. 이 반의 남학생과 여학생은 각각 몇 명인가?`, [{ label: '남학생', answer: boys, unit: '명' }, { label: '여학생', answer: girls, unit: '명' }], {
        explain: setUp(`남학생을 ${X}명, 여학생을 ${Y}명이라 하자. 점수의 합은 평균에 사람 수를 곱한 것이므로 남학생의 점수의 합은 ${nb(poly([[A, X]]))}점, 여학생의 점수의 합은 ${nb(poly([[Bv, Y]]))}점이고, 반 전체의 점수의 합은 ${nb(`${mean} × ${total} = ${mean * total}`)}(점)이다.`, e1, e2, boys, girls),
        facts: { calc: [[bJ, 0], [`${total}-${bJ}`, 1]] }
      });
    }),
    T('word-rect', '둘레의 길이와 두 변의 길이 사이의 관계를 아는 직사각형', '①61 ②52', (d) => {
      const m = d.until(() => { const k = d.int(2, 3), h = d.int(3, 9), r = d.int(1, 4), shorter = d.bool(); return { k, h, r, shorter, w: k * h + (shorter ? -r : r) }; }, (t) => t.w > t.h);
      const { k, h, r, shorter, w } = m, per = 2 * (w + h), e1 = [[tg(2, ts([1, 'x'], [1, 'y']))], ts([per, ''])], e2 = [ts([1, 'x']), ts([k, 'y'], [shorter ? -r : r, ''])], hJ = `(${per}/2${shorter ? '+' : '-'}${r})/(${k}+1)`;
      return M(`둘레의 길이가 ${per} cm인 직사각형이 있다. 이 직사각형의 가로의 길이는 세로의 길이의 ${k}배보다 ${r} cm 더 ${shorter ? '짧다' : '길다'}. 가로의 길이와 세로의 길이는 각각 ${nb('몇 cm인가?')}`, [{ label: '가로', answer: w, unit: 'cm' }, { label: '세로', answer: h, unit: 'cm' }], {
        explain: setUp(`가로의 길이를 ${nb(`${X} cm`)}, 세로의 길이를 ${nb(`${Y} cm`)}라 하자. 직사각형의 둘레의 길이는 가로의 길이와 세로의 길이의 합의 2배이므로`, e1, e2, w, h),
        facts: { calc: [[`${per}/2-${hJ}`, 0], [hJ, 1]], unseen: [2, 1] }
      });
    }),
    T('word-price', '같은 비율의 이익을 붙인 두 물건의 정가', '심52', (d) => {
      const m = d.until(() => { const r = d.pick([10, 20, 25, 50]), y0 = 1000 * d.int(2, 6), diff = 1000 * d.int(1, 3), x0 = y0 + diff; return { r, x0, y0, diff, px: x0 * (100 + r) / 100, py: y0 * (100 + r) / 100 }; }, (s) => Number.isInteger(s.px) && Number.isInteger(s.py) && s.px <= 9999);
      const { r, x0, y0, diff, px, py } = m, total = px + py, rate = r % 10 === 0 ? dc(10 + r / 10) : dc2(100 + r), e1 = [ts([rate, 'x'], [rate, 'y']), ts([total, ''])], e2 = I(1, -1, diff), costs = `${total}*100/(100+${r})`;
      return M(`두 물건 A, B에 각각 원가의 ${r} %의 이익을 붙여 정가를 정하였더니 두 물건의 정가의 합이 ${total}원이었다. A의 원가가 B의 원가보다 ${diff}원 더 비쌀 때, A와 B의 정가는 각각 얼마인가?`, [{ label: 'A', answer: px, unit: '원' }, { label: 'B', answer: py, unit: '원' }], {
        explain: setUp(`A의 원가를 ${X}원, B의 원가를 ${Y}원이라 하면 정가는 각각 ${nb(poly([[rate, X]]))}원, ${nb(poly([[rate, Y]]))}원이다.`, e1, e2, x0, y0, `구한 것은 원가이므로 정가는 A가 ${nb(`${x0} × ${tx(rate)} = ${px}`)}(원), B가 ${nb(`${y0} × ${tx(rate)} = ${py}`)}(원)이다.`),
        facts: { calc: [[`((${costs}+${diff})/2)*(100+${r})/100`, 0], [`((${costs}-${diff})/2)*(100+${r})/100`, 1]], unseen: [100, 2] }
      });
    }),
    T('word-speed-two', '두 구간을 서로 다른 속력으로 간 거리', '①63 ②54·55', (d) => {
      const kind = d.int(0, 2);
      if (kind === 2) {
        // m 와 분
        const u = d.pick([50, 60, 70, 80]), w = d.pick([150, 160, 180, 200, 240]), t1 = d.int(5, 20), t2 = d.int(2, 10), x0 = u * t1, y0 = w * t2, dist = x0 + y0, all = t1 + t2;
        const e1 = I(1, 1, dist), e2 = [ts([Q(1, u), 'x'], [Q(1, w), 'y']), ts([all, ''])], yJ = `(${all}*${u}*${w}-${w}*${dist})/(${u}-${w})`;
        return M(`집에서 ${dist} m 떨어진 학교까지 가는데, 처음에는 분속 ${u} m로 걷다가 도중에 분속 ${w} m로 달려서 모두 ${all}분이 걸렸다. 걸은 거리와 달린 거리는 각각 ${nb('몇 m인가?')}`, [{ label: '걸은 거리', answer: x0, unit: 'm' }, { label: '달린 거리', answer: y0, unit: 'm' }], {
          explain: setUp(`걸은 거리를 ${nb(`${X} m`)}, 달린 거리를 ${nb(`${Y} m`)}라 하면 걸은 시간은 ${frac(X, u)}분, 달린 시간은 ${frac(Y, w)}분이다.`, e1, e2, x0, y0),
          facts: { calc: [[`${dist}-${yJ}`, 0], [yJ, 1]] }
        });
      }
      const m = d.until(() => { const [u, w] = kind === 0 ? [d.pick([3, 4, 5]), d.pick([6, 8, 9, 10, 12])] : d.pick([[2, 3], [2, 4], [3, 4], [3, 5], [2, 5], [3, 6], [4, 6]]), x0 = d.int(1, 8), y0 = d.int(1, 9); return { u, w, x0, y0, min: 60 * x0 / u + 60 * y0 / w }; }, (r) => Number.isInteger(r.min) && r.min % 10 === 0 && r.min <= 240 && r.x0 !== r.y0);
      const { u, w, x0, y0, min } = m, dist = x0 + y0, t = span(min), e1 = I(1, 1, dist), e2 = [ts([Q(1, u), 'x'], [Q(1, w), 'y']), ts([Q(min, 60), ''])], yJ = `(${t.js}*${u}*${w}/60-${w}*${dist})/(${u}-${w})`;
      const hours = min % 60 ? `${t.text}은 ${tx(Q(min, 60))}시간이므로 ` : '';
      if (kind === 0) {
        return M(`집에서 ${dist} km 떨어진 도서관까지 가는데, 처음에는 시속 ${u} km로 걷다가 도중에 시속 ${w} km로 달려서 모두 ${t.text}이 걸렸다. 걸은 거리와 달린 거리는 각각 ${nb('몇 km인가?')}`, [{ label: '걸은 거리', answer: x0, unit: 'km' }, { label: '달린 거리', answer: y0, unit: 'km' }], {
          explain: setUp(`걸은 거리를 ${nb(`${X} km`)}, 달린 거리를 ${nb(`${Y} km`)}라 하면 걸은 시간은 ${frac(X, u)}시간, 달린 시간은 ${frac(Y, w)}시간이다. ${hours}`.trim(), e1, e2, x0, y0),
          facts: { calc: [[`${dist}-${yJ}`, 0], [yJ, 1]], unseen: [60] }
        });
      }
      return M(`등산을 하는데 올라갈 때는 시속 ${u} km로 걷고, 내려올 때는 다른 길을 시속 ${w} km로 걸어서 모두 ${t.text}이 걸렸다. 올라간 거리와 내려온 거리의 합이 ${dist} km일 때, 올라간 거리와 내려온 거리는 각각 ${nb('몇 km인가?')}`, [{ label: '올라간 거리', answer: x0, unit: 'km' }, { label: '내려온 거리', answer: y0, unit: 'km' }], {
        explain: setUp(`올라간 거리를 ${nb(`${X} km`)}, 내려온 거리를 ${nb(`${Y} km`)}라 하면 올라갈 때 걸린 시간은 ${frac(X, u)}시간, 내려올 때 걸린 시간은 ${frac(Y, w)}시간이다. ${hours}`.trim(), e1, e2, x0, y0),
        facts: { calc: [[`${dist}-${yJ}`, 0], [yJ, 1]], unseen: [60] }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
