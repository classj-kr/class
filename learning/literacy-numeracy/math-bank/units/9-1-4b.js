// 중학교 3학년 1학기 4단원 이차방정식 — 뒤쪽 묶음(완전제곱식을 이용한 풀이, 근의 공식, 여러 가지 이차방정식, 두 근과 이차방정식, 이차방정식의 활용).
// 싣는 기준과 뺀 것은 9-1-4a.js 머리에 모아 적었다. 도구는 9-1-4a.js 가 내보낸 B.kit.m914 를 쓴다.
// ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
// 활용 문항의 답(길이·사람 수·시간·날짜)은 음수일 수 없으므로 부호 단추 없이 받는다. 활용의 그림(길·상자·물받이·넓이 그림)은 이 파일 안의 작은 그림 함수로 그린다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, N, M, C, inline } = B.kit;
  const { MINUS, gcd, lcm, Q, dc, qadd, qsub, qmul, qdiv, qneg, qabs, qcmp, isInt, fl, mag, tx, nb, tail, V, sup, nz, ansV, asQ, mono, poly, rt, grp, sqParts, ineqAns, radAns, radText, plane, SG } = B.kit.mid;
  const { Board, TINT, CLEAR, WHITE, textW, sv } = B.kit.mgeo;
  // 그림(svg) 속 글의 문자는 기울인 tspan 으로 적는다(svg 안에는 html 태그를 쓸 수 없다).
  const SX = sv('x'), SX2 = sv('x') + '²';
  const K = B.kit.m914;
  const { STD, HAN, GANA, X, X2, va, vb, vc, vk, vm, vp, vq, iq, sT, gcd3, isSq, squarefree, stripH, retry, P, padd, psub, pmul, pk, deg, pval, L1, polyH, linH, kH, moreH, endJ, ej, twoValsAns,
    prodH, prodP, sqH, sqP, eqH, emW, exq, tagEq, procQ, keep, abc, solve2, formOf, radH, solH, radRootAns, rootsAns, intRootsQ, oneRootQ, valsQ, choose, setH, sameSet, ratRoots, twoInts, monic, dress } = K;
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: (/[①②]/.test(ref) ? '수집본 기본 자료(' : '수집본 심화 자료(') + ref + ')', make: retry(make) }, more || {});
  const box = B.kit.box;
  const FORMULA = '근의 공식을 이용하여 다음 이차방정식을 푸시오.', SOLVE = '다음 이차방정식을 푸시오.';
  // p = …, q = … 를 적은 보기 글
  const pairH = (n1, v1, n2, v2) => nb(`${n1} = ${tx(asQ(v1))}, ${n2} = ${tx(asQ(v2))}`);
  // 근호가 든 수 (p ± k√q)/r 의 값(보기를 셈으로 가릴 때)
  const solVals = (s) => [(s.p - s.k * Math.sqrt(s.q)) / s.r, (s.p + s.k * Math.sqrt(s.q)) / s.r];
  const near = (x, y) => Math.abs(x - y) < 1e-9;
  // 계수가 정수인 이차방정식 Ax² + Bx + C = 0 을 근호가 든 해의 꼴(want)이 나오게 고른다.
  function pickEq(d, ranges, want, ok) {
    return d.until(() => { const A = d.int(ranges.A[0], ranges.A[1]), Bc = nz(d, ranges.B[0], ranges.B[1]), Cc = nz(d, ranges.C[0], ranges.C[1]); return P(Cc, Bc, A); },
      (f) => { const S = solve2(f); return S.kind === 'irr' && formOf(S.sol) === want && S.a === f[2].p && (!ok || ok(f, S)); });
  }

  // ── 완전제곱식을 이용한 풀이 ──
  B.addTypes('9-1-4', 'square', [
    T('cs-form1', '(x + p)² = q 꼴로 고치기 — x²의 계수가 1', '①32', (d, n) => {
      if (n === 0) {
        const h = nz(d, -6, 6), c = nz(d, -9, 9), q = h * h - c;
        if (q <= 0) return null;
        const f = P(c, 2 * h, 1);
        let shown = eqH(polyH(f), '0'), lead = '';
        if (d.bool()) {
          // 2(x + u)(x + w) = x² + ex + g 꼴(정리하면 f)
          const u = nz(d, -5, 5), w = nz(d, -5, 5), e = 2 * (u + w) - 2 * h, g = 2 * u * w - c;
          if (u === w) return null;
          shown = eqH(prodH(2, [[1, u], [1, w]]), polyH(P(g, e, 1)));
          lead = `괄호를 풀고 이항하여 정리하면 ${nb(polyH(f) + ' = 0')}이다. `;
        }
        return valsQ(`이차방정식 ${keep(ej(shown, '을/를'))} ${nb('(' + X + ' + ' + vp + ')' + sup(2) + ' = ' + vq)}의 꼴로 나타낼 때, 수 ${vp}, ${vq}의 값은?`, [['p', h], ['q', q]], {
          explain: `${lead}상수항을 이항하면 ${nb(polyH(P(0, 2 * h, 1)) + ' = ' + iq(-c))}, 양변에 (${X}의 계수의 ${frac(1, 2)})² = ${h * h}${tail(h * h, '을/를')} 더하면 ${nb(polyH(P(h * h, 2 * h, 1)) + ' = ' + iq(-c) + ' + ' + h * h)}, ${nb(sqH(1, 1, h) + ' = ' + q)}이다. 따라서 ${nb(vp + ' = ' + iq(h))}, ${nb(vq + ' = ' + q)}이다.`,
          facts: { calc: [[`${2 * h}/2`, 0], [`(${2 * h})*(${2 * h})/4-(${c})`, 1]], derived: [2 * Math.abs(h), Math.abs(c), 2, 4], rule: 'form1-int' }
        });
      }
      const b = d.until(() => nz(d, -7, 7), (t) => t % 2 !== 0), c = nz(d, -6, 6), p = Q(b, 2), q = qsub(Q(b * b, 4), Q(c));
      if (q.p <= 0) return null;
      const f = P(c, b, 1), ok = (pp, qq) => { for (const x of [0, 1, -1, 2]) if (qcmp(qsub(qmul(qadd(Q(x), pp), qadd(Q(x), pp)), qq), pval(f, x)) !== 0) return false; return true; };
      const cands = [[p, q], [qneg(p), q], [p, qadd(Q(b * b, 4), Q(c))], [Q(b), Q(b * b - c)], [qneg(p), qadd(Q(b * b, 4), Q(c))], [p, qsub(Q(b * b, 2), Q(c))]];
      const rows = [];
      for (const [pp, qq] of cands) if (rows.length < 5 && !rows.some((r) => r[0] === pairH(vp, pp, vq, qq))) rows.push([pairH(vp, pp, vq, qq), ok(pp, qq)]);
      if (rows.length < 4) return null;
      return choose(d, `이차방정식 ${nb(ej(polyH(f) + ' = 0', '을/를'))} ${nb('(' + X + ' + ' + vp + ')' + sup(2) + ' = ' + vq)}의 꼴로 나타낼 때, 두 수 ${vp}, ${vq}의 값은?`, rows, {
        explain: `${nb(polyH(P(0, b, 1)) + ' = ' + iq(-c))}의 양변에 (${frac(Math.abs(b), 2)})² = ${frac(b * b, 4)}${tail(b * b, '을/를')} 더하면 ${nb('(' + X + ' ' + (b < 0 ? MINUS : '+') + ' ')}${frac(Math.abs(b), 2)})${sup(2)} = ${tx(q)}이다. 따라서 ${pairH(vp, p, vq, q)}이다.`,
        facts: { rule: 'form1-frac' }
      });
    }, { count: 2 }),
    T('cs-form2', '(x + p)² = q 꼴로 고치기 — x²의 계수가 1이 아님', '①33', (d, n) => {
      if (n === 0) {
        // −x² + 2hx + c = 0 → (x − h)² = h² + c
        const h = nz(d, -6, 6), c = nz(d, -9, 9), q = h * h + c;
        if (q <= 0) return null;
        const f = P(c, 2 * h, -1);
        return valsQ(`이차방정식 ${nb(ej(polyH(f) + ' = 0', '을/를'))} ${nb('(' + X + ' + ' + va + ')' + sup(2) + ' = ' + vb)}의 꼴로 나타낼 때, 수 ${va}, ${vb}의 값은?`, [['a', -h], ['b', q]], {
          explain: `양변에 ${MINUS}1을 곱하면 ${nb(polyH(pk(f, -1)) + ' = 0')}, 상수항을 이항하면 ${nb(polyH(P(0, -2 * h, 1)) + ' = ' + iq(c))}이다. 양변에 ${h * h}${tail(h * h, '을/를')} 더하면 ${nb(sqH(1, 1, -h) + ' = ' + q)}이므로 ${nb(va + ' = ' + iq(-h))}, ${nb(vb + ' = ' + q)}이다.`,
          facts: { calc: [[`-(${2 * h})/2`, 0], [`(${2 * h})*(${2 * h})/4+(${c})`, 1]], derived: [2, 4] }
        });
      }
      const A = d.int(2, 5), Bc = nz(d, -9, 9), Cc = nz(d, -9, 9), p = Q(Bc, 2 * A), q = qsub(Q(Bc * Bc, 4 * A * A), Q(Cc, A));
      if (q.p <= 0 || p.q === 1 || gcd3(A, Bc, Cc) !== 1) return null;
      const f = P(Cc, Bc, A), ok = (pp, qq) => qcmp(qmul(pp, Q(2 * A)), Q(Bc)) === 0 && qcmp(qq, qsub(qmul(pp, pp), Q(Cc, A))) === 0;
      const cands = [[p, q], [qneg(p), q], [p, qsub(Q(Bc * Bc, 4 * A * A), Q(Cc))], [Q(Bc, A), qsub(Q(Bc * Bc, A * A), Q(Cc, A))], [p, qadd(Q(Bc * Bc, 4 * A * A), Q(Cc, A))], [qneg(p), qadd(Q(Bc * Bc, 4 * A * A), Q(Cc, A))]];
      const rows = [];
      for (const [pp, qq] of cands) if (rows.length < 5 && !rows.some((r) => r[0] === pairH(va, pp, vb, qq))) rows.push([pairH(va, pp, vb, qq), ok(pp, qq)]);
      if (rows.length < 4) return null;
      return choose(d, `이차방정식 ${nb(ej(polyH(f) + ' = 0', '을/를'))} ${nb('(' + X + ' + ' + va + ')' + sup(2) + ' = ' + vb)}의 꼴로 나타낼 때, 두 수 ${va}, ${vb}의 값은?`, rows, {
        explain: `양변을 ${A}${tail(A, '으로/로')} 나누면 ${nb(polyH(P(Q(Cc, A), Q(Bc, A), 1)) + ' = 0')}이다. 상수항을 이항하고 양변에 ${qabs(p).q === 1 ? tx(qabs(p)) : '(' + tx(qabs(p)) + ')'}²을 더하면 ${nb('(' + X + ' ' + (p.p < 0 ? MINUS : '+') + ' ')}${tx(qabs(p))})${sup(2)} = ${tx(q)}이다. 따라서 ${pairH(va, p, vb, q)}이다.`,
        facts: { rule: 'form2-frac' }
      });
    }, { count: 2 }),
    T('cs-steps', '완전제곱식을 이용한 풀이 과정의 빈칸', '①34', (d, n) => {
      if (n === 0) {
        const h = nz(d, -6, 6), c = nz(d, -9, 9), q = h * h - c;
        if (q <= 1 || isSq(q)) return null;
        const f = P(c, -2 * h, 1), sgn = h > 0 ? MINUS : '+';
        const rows = [eqH(polyH(f), '0'), eqH(polyH(P(0, -2 * h, 1)), iq(-c)), eqH(nb(polyH(P(0, -2 * h, 1)) + ' + ' + box(GANA[0])), nb(iq(-c) + ' + ' + box(GANA[0]))), eqH(nb('(' + X + ' ' + sgn + ' ' + box(GANA[1]) + ')' + sup(2)), box(GANA[2]))];
        return M(`다음은 완전제곱식을 이용하여 이차방정식 ${nb(ej(polyH(f) + ' = 0', '을/를'))} 푸는 과정이다. ㈎, ㈏, ㈐에 알맞은 수를 차례로 구하시오.`, [
          { answer: h * h, signed: true, label: '㈎' }, { answer: Math.abs(h), signed: true, label: '㈏' }, { answer: q, signed: true, label: '㈐' }
        ], {
          figure: procQ(rows),
          explain: `${X}의 계수의 ${frac(1, 2)}의 제곱인 (${iq(-h)})² = ${h * h}${tail(h * h, '을/를')} 양변에 더하므로 ㈎는 ${h * h}이다. 좌변을 완전제곱식으로 고치면 ${nb(sqH(1, 1, -h) + ' = ' + q)}이므로 ㈏는 ${Math.abs(h)}, ㈐는 ${q}이다.`,
          facts: { calc: [[`(${2 * h})*(${2 * h})/4`, 0], [`${2 * Math.abs(h)}/2`, 1], [`(${2 * h})*(${2 * h})/4-(${c})`, 2]], derived: [2 * Math.abs(h), 2, 4] }
        });
      }
      if (n === 1) {
        // 과정의 □ 다섯 가운데 잘못 적은 것
        const h = nz(d, -6, 6), c = nz(d, -9, 9), q = h * h - c, S = solve2(P(c, -2 * h, 1));
        if (q <= 1 || isSq(q) || S.kind !== 'irr') return null;
        const f = P(c, -2 * h, 1), CIR = ['①', '②', '③', '④', '⑤'], sgn = h > 0 ? MINUS : '+';
        const right = [iq(-c), String(h * h), String(Math.abs(h)), String(q), radH(S.sol)];
        const wrongAt = d.int(0, 4), wrongs = [iq(c), String(4 * h * h), String(2 * Math.abs(h)), String(h * h + c), radH({ p: -S.sol.p, k: S.sol.k, q: S.sol.q, r: S.sol.r })];
        if (wrongs[wrongAt] === right[wrongAt]) return null;
        const shownVals = right.map((v, i) => (i === wrongAt ? wrongs[i] : v));
        const rows = [eqH(polyH(f), '0'), eqH(polyH(P(0, -2 * h, 1)), box(CIR[0])), eqH(nb(polyH(P(0, -2 * h, 1)) + ' + ' + box(CIR[1])), nb(box(CIR[0]) + ' + ' + box(CIR[1]))), eqH(nb('(' + X + ' ' + sgn + ' ' + box(CIR[2]) + ')' + sup(2)), box(CIR[3])), nb('∴ ' + X + ' = ' + box(CIR[4]))];
        return C(`다음은 이차방정식 ${nb(ej(polyH(f) + ' = 0', '을/를'))} ${nb('(' + X + ' + ' + va + ')' + sup(2) + ' = ' + vb)}의 꼴로 고쳐 푸는 과정이다. □ 안에 들어갈 수로 옳지 않은 것은?`, CIR.map((m, i) => nb(m + ' ' + shownVals[i])), wrongAt, {
          figure: procQ(rows),
          explain: `상수항을 이항하면 ${nb(polyH(P(0, -2 * h, 1)) + ' = ' + iq(-c))}, 양변에 ${h * h}${tail(h * h, '을/를')} 더하면 ${nb(sqH(1, 1, -h) + ' = ' + q)}, ${solH(S.sol)}이다. 따라서 ${CIR[wrongAt]}에 들어갈 수는 ${right[wrongAt]}이다.`,
          facts: { truth: shownVals.map((v, i) => v !== right[i]), want: true, rule: 'steps-wrong' }
        });
      }
      // 근의 공식을 끌어내는 과정의 빈칸(문자로 된 식): 고른 짝을 수로 대어 보아 맞는 것만 옳다.
      const opts = [['b', '2a', '4ac'], ['b', 'a', '4ac'], ['b', '2a', '2ac'], ['b', '2', '4ac'], ['b', '2a', 'ac']];
      const fv = { a: 3, b: -7, c: 2 };
      const holds = ([num, den, tail4]) => {
        const val = (t) => t.split('').reduce((s, ch) => s * (/\d/.test(ch) ? Number(ch) : fv[ch]), 1);
        const A = val(num) / val(den), Bv = val(tail4);
        for (const x of [0, 1, -2, 5]) { const left = (x + A) ** 2 - (fv.b * fv.b - Bv) / (4 * fv.a * fv.a), right = x * x + (fv.b / fv.a) * x + fv.c / fv.a; if (!near(left, right)) return false; }
        return true;
      };
      const show = ([num, den, t4]) => nb('㈎ ' + frac(V(num), den.split('').map((ch) => (/\d/.test(ch) ? ch : V(ch))).join('')) + ', ㈏ ' + t4.split('').map((ch) => (/\d/.test(ch) ? ch : V(ch))).join(''));
      const rows = [eqH(X2 + ' + ' + frac(vb, va) + X, MINUS + frac(vc, va)), eqH(X2 + ' + ' + frac(vb, va) + X + ' + (' + box(GANA[0]) + ')' + sup(2), MINUS + frac(vc, va) + ' + (' + box(GANA[0]) + ')' + sup(2)), eqH('(' + X + ' + ' + box(GANA[0]) + ')' + sup(2), frac(vb + sup(2) + ' ' + MINUS + ' ' + box(GANA[1]), '4' + va + sup(2)))];
      return choose(d, `다음은 이차방정식 ${nb(va + X2 + ' + ' + vb + X + ' + ' + vc + ' = 0')}(${nb(va + ' ≠ 0')})의 양변을 ${va}로 나누고 상수항을 이항한 뒤 완전제곱식으로 고치는 과정이다. ㈎, ㈏에 알맞은 것은?`, opts.map((o) => [show(o), holds(o)]), {
        figure: procQ(rows),
        explain: `양변에 (${X}의 계수의 ${frac(1, 2)})², 곧 (${frac(vb, '2' + va)})²을 더하므로 ㈎는 ${frac(vb, '2' + va)}이다. 우변은 ${nb(MINUS + frac(vc, va) + ' + ' + frac(vb + sup(2), '4' + va + sup(2)) + ' = ' + frac(vb + sup(2) + ' ' + MINUS + ' 4' + va + vc, '4' + va + sup(2)))}이므로 ㈏는 4${va}${vc}이다.`,
        facts: { rule: 'steps-formula' }
      });
    }, { count: 3 }),
    T('cs-solve', '완전제곱식을 이용하여 풀기', '①35', (d, n) => {
      const TEXT = '완전제곱식을 이용하여 다음 이차방정식을 푸시오.';
      if (n === 0) {
        const h = nz(d, -6, 6), q = d.until(() => d.int(2, 30), squarefree), c = h * h - q, f = P(c, 2 * h, 1), S = solve2(f);
        if (c === 0) return null;
        const shown = d.bool() ? eqH(polyH(f), '0') : eqH(polyH(P(0, 2 * h, 1)), iq(-c));
        return radRootAns(TEXT, S, 'P1', {
          figure: exq(shown),
          explain: `${nb(polyH(P(0, 2 * h, 1)) + ' = ' + iq(-c))}의 양변에 ${h * h}${tail(h * h, '을/를')} 더하면 ${nb(sqH(1, 1, h) + ' = ' + q)}, ${nb(linH(1, h) + ' = ±' + rt(q))}이므로 ${solH(S.sol)}이다.`,
          facts: { rule: 'square-P1' }
        });
      }
      const A = d.int(2, 5), h = nz(d, -5, 5), k = d.int(2, 4), t = d.until(() => d.int(2, 7), squarefree), c = h * h - k * k * t, f = P(A * c, -2 * A * h, A), S = solve2(f);
      if (c === 0 || formOf(S.sol) !== 'PK') return null;
      return radRootAns(TEXT, S, 'PK', {
        figure: exq(eqH(polyH(f), '0')),
        explain: `양변을 ${A}${tail(A, '으로/로')} 나누면 ${nb(polyH(P(c, -2 * h, 1)) + ' = 0')}, 상수항을 이항하여 양변에 ${h * h}${tail(h * h, '을/를')} 더하면 ${nb(sqH(1, 1, -h) + ' = ' + k * k * t)}이다. ${nb(linH(1, -h) + ' = ±' + k + rt(t))}이므로 ${solH(S.sol)}이다.`,
        facts: { rule: 'square-PK' }
      });
    }, { count: 2 }),
    T('cs-area', '넓이 그림으로 완전제곱식 만들기', '①36', (d) => {
      const h = d.int(2, 8), s = d.until(() => d.int(h + 1, h + 9), (v) => v * v - h * h > 0), c = s * s - h * h, root = s - h;
      // 그림: 한 변이 x 인 정사각형, 가로 h·세로 x 인 직사각형 둘, 빈 자리의 작은 정사각형 ㈎
      const g = Board(), U = 92, W = 46, x0 = 0, y0 = 0;
      g.poly([[x0, y0], [x0 + U, y0], [x0 + U, y0 + U], [x0, y0 + U]], 'fill:rgba(251,191,36,0.32)');
      g.poly([[x0 + U, y0], [x0 + U + W, y0], [x0 + U + W, y0 + U], [x0 + U, y0 + U]], 'fill:rgba(37,99,235,0.14)');
      g.poly([[x0, y0 + U], [x0 + U, y0 + U], [x0 + U, y0 + U + W], [x0, y0 + U + W]], 'fill:rgba(37,99,235,0.14)');
      g.poly([[x0 + U, y0 + U], [x0 + U + W, y0 + U], [x0 + U + W, y0 + U + W], [x0 + U, y0 + U + W]], 'fill:rgba(16,185,129,0.22);stroke-dasharray:4 3');
      g.text([x0 + U / 2, y0 + U / 2], SX2); g.text([x0 + U + W / 2, y0 + U / 2], h + SX); g.text([x0 + U / 2, y0 + U + W / 2], h + SX); g.text([x0 + U + W / 2, y0 + U + W / 2], GANA[0]);
      g.dim([x0, y0], [x0 + U, y0], SX, [x0 + U / 2, y0 + 30], 9); g.dim([x0 + U, y0], [x0 + U + W, y0], String(h), [x0 + U + W / 2, y0 + 30], 9);
      g.dim([x0, y0], [x0, y0 + U], SX, [x0 + 30, y0 + U / 2], 9); g.dim([x0, y0 + U], [x0, y0 + U + W], String(h), [x0 + 30, y0 + U + W / 2], 9);
      const fig = g.svg(`넓이 그림: 한 변이 x인 정사각형(넓이 x²)의 오른쪽과 아래에 가로·세로가 x와 ${h}인 직사각형(넓이 ${h}x)을 하나씩 붙이고, 오른쪽 아래 빈 자리에 한 변이 ${h}인 정사각형 ㈎를 채웠다.`);
      return M(`다음은 ${nb(polyH(P(0, 2 * h, 1)) + ' = ' + c)}의 양수인 해를 도형을 이용하여 구하는 과정이다. 넓이가 ${X2}인 정사각형과 넓이가 ${h}${X}인 직사각형 두 개를 그림과 같이 놓고 빈 자리에 정사각형 ㈎를 채워 큰 정사각형을 만들었다. ㈎의 넓이, 큰 정사각형의 넓이, 양수인 해를 차례로 구하시오.`, [
        { answer: h * h, label: '㈎의 넓이' }, { answer: s * s, label: '큰 정사각형' }, { answer: root, label: '양수인 해' }
      ], {
        figure: fig,
        explain: `㈎는 한 변이 ${h}인 정사각형이므로 넓이는 ${h * h}이다. 큰 정사각형의 넓이는 ${nb(X2 + ' + ' + 2 * h + X + ' + ' + h * h + ' = ' + c + ' + ' + h * h + ' = ' + s * s)}이므로 한 변은 ${s}, 곧 ${nb(X + ' + ' + h + ' = ' + s)}이고 양수인 해는 ${nb(X + ' = ' + root)}이다.`,
        facts: { calc: [[`${2 * h}/2*${2 * h}/2`, 0], [`${c}+${2 * h}/2*${2 * h}/2`, 1], [`${s}-${2 * h}/2`, 2]], derived: [s, 2] }
      });
    })
  ]);

  // ── 근의 공식 ──
  B.addTypes('9-1-4', 'formula', [
    T('qf-plain', '근의 공식으로 풀기', '①37', (d) => {
      const f = pickEq(d, { A: [1, 5], B: [-9, 9], C: [-9, 9] }, 'P1R', (g) => g[1].p % 2 !== 0), S = solve2(f), [Cc, Bc, A] = f.map((v) => v.p);
      return radRootAns(FORMULA, S, 'P1R', {
        figure: exq(eqH(polyH(f), '0')),
        explain: `근의 공식에 ${nb(va + ' = ' + A)}, ${nb(vb + ' = ' + iq(Bc))}, ${nb(vc + ' = ' + iq(Cc))}${tail(Math.abs(Cc), '을/를')} 대입하면 ${nb(X + ' = ')}${frac(iq(-Bc) + ' ± ' + rt(`${Bc * Bc} ${-4 * A * Cc < 0 ? MINUS : '+'} ${Math.abs(4 * A * Cc)}`), 2 * A)} = ${radH(S.sol)}이다.`,
        facts: { rule: 'formula-plain' }
      });
    }),
    T('qf-reduce', '근의 공식 — 근호를 간단히 하고 약분하기', '①38', (d) => {
      const f = pickEq(d, { A: [2, 5], B: [-10, 10], C: [-9, 9] }, 'P1R', (g, S) => g[1].p % 2 === 0 && S.sol.r === g[2].p), S = solve2(f), [Cc, Bc, A] = f.map((v) => v.p);
      const D = Bc * Bc - 4 * A * Cc, [s, t] = sqParts(D), moved = d.bool() && Cc !== 0;
      return radRootAns(FORMULA, S, 'P1R', {
        figure: exq(moved ? eqH(polyH(P(0, Bc, A)), iq(-Cc)) : eqH(polyH(f), '0')),
        explain: `${moved ? `상수항을 이항하면 ${nb(polyH(f) + ' = 0')}이다. ` : ''}근의 공식에 대입하면 ${nb(X + ' = ')}${frac(iq(-Bc) + ' ± ' + rt(D), 2 * A)} = ${frac(iq(-Bc) + ' ± ' + s + rt(t), 2 * A)} = ${radH(S.sol)}이다.`,
        facts: { rule: 'formula-reduce' }
      });
    }),
    T('qf-form', '해를 (a ± √b)/c 꼴로 주고 a, b 구하기', '①40', (d, n) => {
      if (n === 0) {
        // 해가 (p ± k√q)/r 꼴(k ≥ 2): 꼴을 알려 주고 a, b 를 묻는다.
        const f = pickEq(d, { A: [2, 5], B: [-12, 12], C: [-9, 9] }, 'PKR'), S = solve2(f), sol = S.sol;
        return valsQ(`이차방정식 ${nb(polyH(f) + ' = 0')}의 근이 ${nb(X + ' = ')}${frac(va + ' ± ' + sol.k + rt(vb), sol.r)}일 때, 유리수 ${va}, ${vb}의 값은?`, [['a', sol.p], ['b', sol.q]], {
          explain: `근의 공식으로 풀면 ${solH(sol)}이므로 ${nb(va + ' = ' + iq(sol.p))}, ${nb(vb + ' = ' + sol.q)}이다.`,
          facts: { calc: [[K.solCalc(S).p, 0], [K.solCalc(S).q, 1]], derived: [S.s, S.g, S.a, Math.abs(S.b), Math.abs(S.c), 2, 4] }
        });
      }
      // 괄호를 풀고 정리해야 하는 방정식
      const make = () => {
        const A = d.int(2, 5), u = nz(d, -4, 4), w = nz(d, -4, 4), m = d.int(1, 3), e = nz(d, -4, 4), L = pmul(P(u, 1), P(w, m)), Rp = P(nz(d, -9, 9), nz(d, -6, 6), A + m);
        return { L, Rp, u, w, m, f: psub(Rp, L) };
      };
      const it = d.until(make, (o) => { const S = solve2(o.f); return S.kind === 'irr' && formOf(S.sol) === 'P1R' && S.sol.r >= 2; });
      const S = solve2(it.f), sol = S.sol;
      return valsQ(`이차방정식 ${nb(eqH(polyH(it.Rp), prodH(1, [[1, it.u], [it.m, it.w]])))}의 해가 ${nb(X + ' = ')}${frac(va + ' ± ' + rt(vb), sol.r)}일 때, 유리수 ${va}, ${vb}의 값은?`, [['a', sol.p], ['b', sol.q]], {
        explain: `괄호를 풀고 이항하여 정리하면 ${nb(polyH(P(S.c, S.b, S.a)) + ' = 0')}이다. 근의 공식으로 풀면 ${solH(sol)}이므로 ${nb(va + ' = ' + iq(sol.p))}, ${nb(vb + ' = ' + sol.q)}이다.`,
        facts: { calc: [[K.solCalc(S).p, 0], [K.solCalc(S).q, 1]], derived: [S.s, S.g, S.a, Math.abs(S.b), Math.abs(S.c), 2, 4] }
      });
    }, { count: 2 }),
    T('qf-const', '해가 주어질 때 상수항의 미지수 구하기', '①41', (d, n) => {
      if (n === 0) {
        // Ax² + Bx + k = 0 의 해가 (−B ± √D)/2A(공식 그대로)
        const A = d.int(1, 4), Bc = d.until(() => nz(d, -9, 9), (t) => t % 2 !== 0), k = nz(d, -9, 9), D = Bc * Bc - 4 * A * k;
        if (D <= 1 || isSq(D) || !squarefree(D)) return null;
        return N(`이차방정식 ${nb(polyH(P(0, Bc, A)) + ' + ' + vk + ' = 0')}의 해가 ${nb(X + ' = ')}${frac(iq(-Bc) + ' ± ' + rt(D), 2 * A)}일 때, 수 ${vk}의 값은?`, k, {
          signed: true,
          explain: `근의 공식에 대입하면 ${nb(X + ' = ')}${frac(iq(-Bc) + ' ± ' + rt(`${Bc * Bc} ${MINUS} ${4 * A}${vk}`), 2 * A)}이다. 근호 안을 견주면 ${nb(`${Bc * Bc} ${MINUS} ${4 * A}${vk} = ${D}`)}이므로 ${nb(vk + ' = ' + iq(k))}이다.`,
          facts: { value: `((${Bc})*(${Bc})-${D})/(4*${A})`, derived: [4] }
        });
      }
      if (n === 1) {
        // x² + 2hx + m = 0 의 해가 −h ± √t
        const h = nz(d, -6, 6), t = d.until(() => d.int(2, 15), squarefree), m = h * h - t;
        if (m === 0) return null;
        return N(`이차방정식 ${nb(polyH(P(0, 2 * h, 1)) + ' + ' + vm + ' = 0')}의 해가 ${solH({ p: -h, k: 1, q: t, r: 1 })}일 때, 수 ${vm}의 값은?`, m, {
          signed: true,
          explain: `근의 공식으로 풀면 ${nb(X + ' = ' + iq(-h) + ' ± ' + rt(`${h * h} ${MINUS} ${vm}`))}이다. 근호 안을 견주면 ${nb(`${h * h} ${MINUS} ${vm} = ${t}`)}이므로 ${nb(vm + ' = ' + iq(m))}이다.`,
          facts: { value: `(${2 * h})*(${2 * h})/4-${t}`, derived: [2 * Math.abs(h), 4] }
        });
      }
      // Ax² + Bx + p = 0 의 해가 (q ± √t)/r(약분한 꼴) — p 와 q 를 함께 구한다.
      const f = pickEq(d, { A: [1, 5], B: [-9, 9], C: [-9, 9] }, 'P1R'), S = solve2(f), [Cc, Bc, A] = f.map((v) => v.p), sol = S.sol;
      return valsQ(`이차방정식 ${nb(polyH(P(0, Bc, A)) + ' + ' + vp + ' = 0')}의 해가 ${nb(X + ' = ')}${frac(vq + ' ± ' + rt(sol.q), sol.r)}일 때, 유리수 ${vp}, ${vq}의 값은?`, [['p', Cc], ['q', sol.p]], {
        explain: `근의 공식으로 풀면 ${nb(X + ' = ')}${frac(iq(-Bc) + ' ± ' + rt(`${Bc * Bc} ${MINUS} ${4 * A}${vp}`), 2 * A)}이다. 주어진 해를 같은 분모로 고쳐 견주면 ${nb(vq + ' = ' + iq(sol.p))}이고, 근호 안의 수에서 ${nb(vp + ' = ' + iq(Cc))}이다.`,
        facts: { calc: [[`((${Bc})*(${Bc})-${2 * A / sol.r}*${2 * A / sol.r}*${sol.q})/(4*${A})`, 0], [`(-(${Bc}))/${2 * A / sol.r}`, 1]], derived: [2 * A / sol.r, 4] }
      });
    }, { count: 3 }),
    T('qf-both', '해가 주어질 때 x의 계수와 근호 안의 수까지 구하기', '①42', (d) => {
      const p = nz(d, -6, 6), c = nz(d, -9, 9), b = p * p - c;
      if (b <= 1 || !squarefree(b)) return null;
      return valsQ(`이차방정식 ${nb(X2 + ' + ' + va + X + moreH([[c, '']]) + ' = 0')}의 해가 ${nb(X + ' = ' + iq(p) + ' ± ' + rt(vb))}일 때, 유리수 ${va}, ${vb}의 값은?`, [['a', -2 * p], ['b', b]], {
        explain: `근의 공식으로 풀면 ${nb(X + ' = ')}${frac(MINUS + va + ' ± ' + rt(va + sup(2) + moreH([[-4 * c, '']])), 2)}이다. ${nb(frac(MINUS + va, 2) + ' = ' + iq(p))}에서 ${nb(va + ' = ' + iq(-2 * p))}이고, ${nb(vb + ' = ' + frac((4 * p * p) + moreH([[-4 * c, '']]), 4) + ' = ' + b)}이다.`,
        facts: { calc: [[`-2*(${p})`, 0], [`(${p})*(${p})-(${c})`, 1]], derived: [2] }
      });
    }),
    T('qf-diff', '두 근의 차·음수인 근을 넣은 식의 값', '①44', (d, n) => {
      if (n === 0) {
        const h = nz(d, -6, 6), c = nz(d, -12, 12), q = h * h - c;
        if (q <= 1 || isSq(q)) return null;
        const [k, t] = sqParts(q), f = P(c, -2 * h, 1);
        return radAns(`이차방정식 ${nb(polyH(f) + ' = 0')}의 두 근을 α, β라 할 때, ${nb('α ' + MINUS + ' β')}의 값은? (단, ${nb('α &gt; β')})`, 2 * k, t, {
          explain: `근의 공식으로 풀면 ${nb(X + ' = ' + iq(h) + ' ± ' + (k === 1 ? '' : k) + rt(t))}이므로 ${nb('α = ' + iq(h) + ' + ' + (k === 1 ? '' : k) + rt(t))}, ${nb('β = ' + iq(h) + ' ' + MINUS + ' ' + (k === 1 ? '' : k) + rt(t))}이다. 따라서 ${nb('α ' + MINUS + ' β = ' + 2 * k + rt(t))}이다.`,
          facts: { calc: [[`2*${k}`, 0], [`((${2 * h})*(${2 * h})/4-(${c}))/(${k}*${k})`, 1]], derived: [2 * Math.abs(h), k, 2, 4] }
        });
      }
      // Ax² + Bx + C = 0 의 음수인 근 k 에 대하여 2Ak + B = −√D
      const f = pickEq(d, { A: [1, 4], B: [-7, 7], C: [-9, -1] }, 'P1R', (g, S) => S.sol.k === 1 && S.s === 1), S = solve2(f), [Cc, Bc, A] = f.map((v) => v.p), D = S.D;
      const root = (-Bc - Math.sqrt(D)) / (2 * A), want = 2 * A * root + Bc;
      const items = [[MINUS + rt(D), -Math.sqrt(D)], [rt(D), Math.sqrt(D)], [nb(MINUS + '2' + rt(D)), -2 * Math.sqrt(D)], [nb(iq(Bc) + ' ' + MINUS + ' ' + rt(D)), Bc - Math.sqrt(D)], [nb(iq(-Bc) + ' ' + MINUS + ' ' + rt(D)), -Bc - Math.sqrt(D)]];
      return choose(d, `이차방정식 ${nb(polyH(f) + ' = 0')}의 두 근 가운데 음수인 근을 ${vk}라 할 때, ${nb(2 * A + vk + moreH([[Bc, '']]))}의 값은?`, items.map(([h, v]) => [h, near(v, want)]), {
        explain: `근의 공식으로 풀면 ${solH(S.sol)}이고 음수인 근은 ${nb(vk + ' = ')}${frac(iq(-Bc) + ' ' + MINUS + ' ' + rt(D), 2 * A)}이다. 따라서 ${nb(2 * A + vk + moreH([[Bc, '']]) + ' = ' + iq(-Bc) + ' ' + MINUS + ' ' + rt(D) + moreH([[Bc, '']]) + ' = ' + MINUS + rt(D))}이다.`,
        facts: { rule: 'neg-root' }
      });
    }, { count: 2 }),
    T('qf-diffk', '두 근의 차가 주어질 때 상수 구하기', '①45', (d) => {
      const A = d.int(1, 4), dd = d.int(1, 6), Bc = nz(d, -12, 12), num = Bc * Bc - A * A * dd * dd;
      if (num % (4 * A) !== 0 || num === 0) return null;
      const k = num / (4 * A);
      return N(`이차방정식 ${nb(polyH(P(0, Bc, A)) + ' + ' + vk + ' = 0')}의 두 근의 차가 ${dd}일 때, 수 ${vk}의 값은?`, k, {
        signed: true,
        explain: `근의 공식으로 풀면 ${nb(X + ' = ')}${frac(iq(-Bc) + ' ± ' + rt(`${Bc * Bc} ${MINUS} ${4 * A}${vk}`), 2 * A)}이므로 두 근의 차는 ${frac(rt(`${Bc * Bc} ${MINUS} ${4 * A}${vk}`), A)}이다. 이것이 ${dd}이므로 ${nb(`${Bc * Bc} ${MINUS} ${4 * A}${vk} = ${A * A * dd * dd}`)}, ${nb(vk + ' = ' + iq(k))}이다.`,
        facts: { value: `((${Bc})*(${Bc})-${A}*${A}*${dd}*${dd})/(4*${A})`, derived: [4] }
      });
    }),
    T('qf-ratcond', '해가 모두 유리수(정수)가 되게 하는 자연수', '①46', (d, n) => {
      // x² + Bx + a + e = 0: 근호 안 B² − 4(a + e)가 0 또는 (정수 해이면 근이 정수가 되는) 제곱수
      const Bc = nz(d, -8, 8), e = nz(d, -6, 6), word = n === 0 ? '유리수' : '정수', name = n === 0 ? va : vk;
      const good = (a) => { const D = Bc * Bc - 4 * (a + e); if (D < 0 || !isSq(D)) return false; return n === 0 || (-Bc + Math.sqrt(D)) % 2 === 0; };
      const all = []; for (let a = 1; a <= 80; a += 1) if (good(a)) all.push(a);
      if (all.length < 2 || all.length > 4) return null;
      const setT = (s) => s.map((v) => nb(name + ' = ' + v)).join(', ');
      const cands = [all, all.slice(0, -1), all.slice(1), all.concat([all[all.length - 1] + 1]), all.map((v) => v + 1), [all[0]]].filter((s) => s.length);
      const rows = [];
      for (const s of cands) if (rows.length < 5 && !rows.some((r) => r[0] === setT(s))) rows.push([setT(s), s.length === all.length && s.every((v, i) => v === all[i])]);
      if (rows.length < 4) return null;
      const shown = nb(X2 + moreH([[Bc, X]]) + ' + ' + name + moreH([[e, '']]) + ' = 0');
      return choose(d, `이차방정식 ${shown}의 해가 모두 ${word}가 되도록 하는 자연수 ${name}의 값을 모두 고른 것은?`, rows, {
        explain: `근의 공식으로 풀면 ${nb(X + ' = ')}${frac(iq(-Bc) + ' ± ' + rt(`${Bc * Bc} ${MINUS} 4(${name}${moreH([[e, '']])})`), 2)}이다. 해가 모두 ${word}이려면 근호 안의 수가 0 또는 제곱수${n === 0 ? '' : '이고 분자가 짝수'}여야 한다. 자연수 ${name}를 차례로 넣어 보면 ${setT(all)}이다.`,
        facts: { rule: 'ratcond-' + n }
      });
    }, { count: 2 }),
    T('qf-count', '근의 개수 가리기', '①47', (d) => {
      // 근의 공식의 근호 안의 수(b² − 4ac)의 부호로 근의 개수를 센다.
      const kind = d.pick([0, 2]), odd = d.pick([0, 1, 2].filter((v) => v !== kind));
      const make = (want) => d.until(() => P(nz(d, -9, 9), nz(d, -8, 8), d.int(1, 5)), (f) => { const D = f[1].p * f[1].p - 4 * f[2].p * f[0].p; return want === 0 ? D < 0 : want === 1 ? D === 0 : D > 0; });
      const list = [make(odd)].concat([0, 1, 2, 3].map(() => make(kind)));
      const cnt = (f) => { const D = f[1].p * f[1].p - 4 * f[2].p * f[0].p; return D < 0 ? 0 : D === 0 ? 1 : 2; };
      const rows = list.map((f) => [nb(polyH(f) + ' = 0'), cnt(f) !== kind]);
      const word = ['해가 없다', '중근을 갖는다', '서로 다른 두 근을 갖는다'], wordGo = ['해가 없고', '중근을 갖고', '서로 다른 두 근을 갖고'];
      return choose(d, '다음 이차방정식 가운데 근의 개수가 나머지 넷과 다른 것은?', rows, {
        explain: `근의 공식의 근호 안의 수 ${nb(vb + sup(2) + ' ' + MINUS + ' 4' + va + vc)}가 양수이면 서로 다른 두 근, 0이면 중근, 음수이면 해가 없다. ${rows.find((r) => r[1])[0]}${endJ(rows.find((r) => r[1])[0], '은/는')} ${wordGo[odd]}, 나머지는 모두 ${word[kind]}.`,
        facts: { rule: 'count-odd' }
      });
    }),
    T('qf-countk', '근의 개수 조건으로 상수의 값의 범위 구하기', '①48', (d, n) => {
      if (n === 0) {
        // x² + 2hx + c + s·k = 0: 근호 안의 수의 1/4 은 h² − c − sk
        const h = nz(d, -5, 5), c = nz(d, -9, 9), s = d.pick([1, -1]), two = d.bool(), edge = s * (h * h - c);
        if (edge === 0) return null;
        // two: 서로 다른 두 근(h² − c − sk > 0), 아니면 해가 없다(h² − c − sk < 0)
        const rel = (two ? s > 0 : s < 0) ? '<' : '>';
        return ineqAns(`이차방정식 ${nb(polyH(P(c, 2 * h, 1)) + (s > 0 ? ' + ' : ' ' + MINUS + ' ') + vk + ' = 0')}이 ${two ? '서로 다른 두 근을 갖도록' : '해를 갖지 않도록'} 하는 수 ${vk}의 값의 범위는?`, rel, edge, vk, {
          explain: `근의 공식의 근호 안의 수가 ${nb(4 * h * h + ' ' + MINUS + ' 4(' + (c === 0 ? '' : iq(c)) + (s > 0 ? ' + ' : ' ' + MINUS + ' ') + vk + ')')}이다. ${two ? '서로 다른 두 근을 가지려면 이 수가 양수' : '해를 갖지 않으려면 이 수가 음수'}이어야 하므로 ${nb(vk + ' ' + (rel === '<' ? '&lt;' : '&gt;') + ' ' + iq(edge))}이다.`,
          facts: { calc: [[`${s > 0 ? '' : '-'}((${2 * h})*(${2 * h})/4-(${c}))`, 1]], derived: [4, 2 * Math.abs(h)] }
        });
      }
      // x² − 2(k − u)x + k² + v = 0: 근호 안의 수의 1/4 은 −2uk + u² − v(k² 이 지워진다)
      const u = d.until(() => nz(d, -4, 4), (t) => Math.abs(t) >= 1), v = nz(d, -6, 6), edge = Q(u * u - v, 2 * u);
      if (edge.q === 1) return null;
      const two = d.bool(), rel = (two ? u > 0 : u < 0) ? '<' : '>';
      const opts = [['<', edge], ['>', edge], ['<', qneg(edge)], ['>', qneg(edge)], [rel === '<' ? '<=' : '>=', edge]];
      const mark = { '<': '&lt;', '>': '&gt;', '<=': '≤', '>=': '≥' };
      // 고른 범위가 맞는지: 경계 둘레의 수를 넣어 근의 개수를 센다.
      const fits = ([r, e]) => [-3, -1, -0.5, 0, 0.5, 1, 3].map((dk) => fl(e) + dk).concat([fl(e)]).every((kv) => { const D4 = (kv - u) * (kv - u) - (kv * kv + v), want = two ? D4 > 1e-9 : D4 < -1e-9; const inR = r === '<' ? kv < fl(e) - 1e-12 : r === '>' ? kv > fl(e) + 1e-12 : r === '<=' ? kv <= fl(e) + 1e-12 : kv >= fl(e) - 1e-12; return want === inR; });
      return choose(d, `이차방정식 ${nb(X2 + ' ' + MINUS + ' 2(' + vk + moreH([[-u, '']]) + ')' + X + ' + ' + vk + sup(2) + moreH([[v, '']]) + ' = 0')}이 ${two ? '서로 다른 두 근을 갖도록' : '해를 갖지 않도록'} 하는 수 ${vk}의 값의 범위는?`, opts.map(([r, e]) => [nb(vk + ' ' + mark[r] + ' ' + tx(e)), fits([r, e])]), {
        explain: `근의 공식(${X}의 계수가 짝수인 꼴)의 근호 안의 수는 ${nb('(' + vk + moreH([[-u, '']]) + ')' + sup(2) + ' ' + MINUS + ' (' + vk + sup(2) + moreH([[v, '']]) + ') = ' + poly([[-2 * u, vk], [u * u - v, '']]))}이다. 이 수가 ${two ? '양수' : '음수'}이어야 하므로 ${nb(vk + ' ' + mark[rel] + ' ' + tx(edge))}이다.`,
        facts: { rule: 'countk-frac' }
      });
    }, { count: 2 })
  ]);

  // ── 여러 가지 이차방정식 ──
  // 정수 계수 식 f 를 L 로 나눈 꼴(계수가 분수) / 10으로 나눈 꼴(계수가 소수)
  const fracPoly = (f, L) => f.map((c) => Q(c.p, L));
  const decPoly = (f, m) => f.map((c) => dc(c.p * m));
  B.addTypes('9-1-4', 'various', [
    T('var-frac', '계수가 분수인 이차방정식', '①49', (d, n) => {
      const L = d.pick([2, 3, 4, 6]);
      if (n === 0) {
        const f = pickEq(d, { A: [1, 6], B: [-9, 9], C: [-9, 9] }, 'P1R'), g = fracPoly(f, L);
        if (g.filter((c) => c.q !== 1).length < 2) return null;
        const S = solve2(g);
        return radRootAns(SOLVE, S, 'P1R', {
          figure: exq(eqH(polyH(g), '0')),
          explain: `양변에 ${L}${tail(L, '을/를')} 곱하면 ${nb(polyH(f) + ' = 0')}이다. 근의 공식으로 풀면 ${solH(S.sol)}이다.`,
          facts: { rule: 'frac-irr' }
        });
      }
      const [u, w] = twoInts(d, -9, 9), f = monic(u, w), g = fracPoly(f, L);
      if (g.filter((c) => c.q !== 1).length < 2) return null;
      return intRootsQ(SOLVE, g, {
        figure: exq(eqH(polyH(g), '0')),
        explain: `양변에 ${L}${tail(L, '을/를')} 곱하면 ${nb(polyH(f) + ' = 0')}, 인수분해하면 ${nb(prodH(1, [[1, -u], [1, -w]]) + ' = 0')}이므로 ${setH([u, w])}이다.`,
        facts: { rule: 'frac-int' }
      });
    }, { count: 2 }),
    T('var-polyfrac', '분자가 다항식인 분수 꼴의 이차방정식', '①50', (d) => {
      const a = d.pick([2, 3, 4]), b = d.until(() => d.pick([2, 3, 4, 6]), (v) => v !== a), c = d.until(() => d.pick([2, 3, 6]), (v) => v !== a && v !== b), Lc = lcm(lcm(a, b), c);
      const P1 = P(nz(d, -5, 5), 0, 1), P2 = P(nz(d, -6, 6), 1), P3 = P(0, d.int(1, 3));
      const f = psub(padd(pk(P1, Lc / a), pk(P2, Lc / b)), pk(P3, Lc / c)), S = solve2(f);
      if (S.kind !== 'irr' || formOf(S.sol) !== 'P1R') return null;
      return radRootAns(SOLVE, S, 'P1R', {
        figure: exq(eqH(frac(polyH(P1), a) + ' + ' + frac(polyH(P2), b), frac(polyH(P3), c))),
        explain: `양변에 ${Lc}${tail(Lc, '을/를')} 곱하면 ${nb(kH(Lc / a) + '(' + polyH(P1) + ') + ' + kH(Lc / b) + '(' + polyH(P2) + ') = ' + polyH(pk(P3, Lc / c)))}, 정리하면 ${nb(polyH(P(S.c, S.b, S.a)) + ' = 0')}이다. 근의 공식으로 풀면 ${solH(S.sol)}이다.`,
        facts: { rule: 'polyfrac' }
      });
    }),
    T('var-dec', '계수가 소수인 이차방정식', '①51', (d, n) => {
      if (n === 0) {
        const [u, w] = twoInts(d, -8, 8), m = d.int(1, 9), f = monic(u, w), g = decPoly(f, m);
        if (f.some((c) => (c.p * m) % 10 === 0 && c.p !== 0)) return null;
        const moved = d.bool();
        return intRootsQ(SOLVE, g, {
          figure: exq(moved ? eqH(polyH(P(0, 0, g[2])), polyH(P(qneg(g[0]), qneg(g[1])))) : eqH(polyH(g), '0')),
          explain: `양변에 10을 곱하여 정리하면 ${nb(polyH(pk(f, m)) + ' = 0')}${m === 1 ? '' : `, 양변을 ${m}${tail(m, '으로/로')} 나누면 ${nb(polyH(f) + ' = 0')}`}이다. 인수분해하면 ${nb(prodH(1, [[1, -u], [1, -w]]) + ' = 0')}이므로 ${setH([u, w])}이다.`,
          facts: { rule: 'dec-int' }
        });
      }
      const f = pickEq(d, { A: [1, 9], B: [-9, 9], C: [-9, 9] }, 'P1R', (g) => g.every((c) => c.p % 10 !== 0)), g = decPoly(f, 1), S = solve2(g);
      return radRootAns(SOLVE, S, 'P1R', {
        figure: exq(eqH(polyH(g), '0')),
        explain: `양변에 10을 곱하면 ${nb(polyH(f) + ' = 0')}이다. 근의 공식으로 풀면 ${solH(S.sol)}이다.`,
        facts: { rule: 'dec-irr' }
      });
    }, { count: 2 }),
    T('var-mixed', '분수와 소수가 섞인 이차방정식', '①52', (d) => {
      // x²의 계수와 상수항은 분수, x의 계수는 소수 한 자리
      const L = d.pick([6, 12, 15, 20]), step = L / gcd(10, L), A = d.until(() => d.int(1, L - 1), (v) => Q(v, L).q !== 1 && 10 % Q(v, L).q !== 0), Bc = step * nz(d, -3, 3), Cc = d.until(() => nz(d, -L, L), (v) => Q(v, L).q !== 1 && 10 % Q(v, L).q !== 0);
      const f = P(Cc, Bc, A), S = solve2(f);
      if (S.kind !== 'irr' || formOf(S.sol) !== 'P1R' || Bc * 10 % L !== 0 || Q(Bc, L).q === 1) return null;
      const g = [Q(Cc, L), Object.assign(Q(Bc, L), { d: 1 }), Q(A, L)];
      return radRootAns(SOLVE, S, 'P1R', {
        figure: exq(eqH(polyH(g), '0')),
        explain: `소수를 분수로 고치면 ${X}의 계수는 ${tx(Q(Bc, L))}이다. 양변에 ${L}${tail(L, '을/를')} 곱하면 ${nb(polyH(f) + ' = 0')}이고, 근의 공식으로 풀면 ${solH(S.sol)}이다.`,
        facts: { rule: 'mixed' }
      });
    }),
    T('var-bracket', '괄호를 풀고 정리한 뒤 근의 공식으로 풀기', '①53', (d, n) => {
      const want = n === 0 ? 'P1' : 'P1R';
      const make = () => {
        const k = d.int(1, 3), u = nz(d, -5, 5), w = nz(d, -5, 5), a2 = d.int(1, 3), v = nz(d, -5, 5), z = nz(d, -5, 5);
        if (u === w || (a2 === 1 && v === z)) return { f: P(0) };
        const L = k === 1 ? prodH(1, [[1, u], [1, w]]) : prodH(k, [[1, u], [1, w]]), Lp = prodP(k, [[1, u], [1, w]]), R = prodH(1, [[a2, v], [1, z]]), Rp = prodP(1, [[a2, v], [1, z]]);
        return { L, R, f: psub(Lp, Rp) };
      };
      const it = d.until(make, (o) => { if (deg(o.f) !== 2) return false; const S = solve2(o.f); return S.kind === 'irr' && formOf(S.sol) === want; });
      const S = solve2(it.f);
      return radRootAns(SOLVE, S, want, {
        figure: exq(eqH(it.L, it.R)),
        explain: `괄호를 풀고 이항하여 정리하면 ${nb(polyH(P(S.c, S.b, S.a)) + ' = 0')}이다. 근의 공식으로 풀면 ${solH(S.sol)}이다.`,
        facts: { rule: 'bracket-' + want }
      });
    }, { count: 2 }),
    T('var-sub', '공통부분이 있는 이차방정식', '①54', (d) => {
      const u = d.int(2, 3), v = nz(d, -4, 4), w = nz(d, -4, 4), z = nz(d, -6, 6), inner = L1(u, v), f = padd(padd(pmul(inner, inner), pk(inner, w)), P(-z)), S = solve2(f);
      if (S.kind !== 'irr' || formOf(S.sol) !== 'P1R') return null;
      const XX = '(' + linH(u, v) + ')';
      return radRootAns(SOLVE, S, 'P1R', {
        figure: exq(eqH(nb(XX + sup(2) + ' ' + (w < 0 ? MINUS : '+') + ' ' + (Math.abs(w) === 1 ? '' : Math.abs(w)) + XX), iq(z))),
        explain: `${nb(linH(u, v) + ' = ' + V('A'))}로 놓으면 ${nb(V('A') + sup(2) + moreH([[w, V('A')], [-z, '']]) + ' = 0')}이다. 괄호를 풀어 ${X}에 대한 식으로 정리하여도 ${nb(polyH(P(S.c, S.b, S.a)) + ' = 0')}이고, 근의 공식으로 풀면 ${solH(S.sol)}이다.`,
        facts: { rule: 'sub' }
      });
    }),
    T('var-ab', '두 식의 조건으로 이차방정식을 세워 풀기', '심10', (d) => {
      // A 는 정수 계수, B 는 소수 계수. mA − nB = 0 을 정리하면 정수 해 둘
      const m = d.pick([2, 3]), k = d.until(() => d.int(1, 3), (t) => gcd(t, m) === 1), n10 = 10 * k, [r1, r2] = twoInts(d, -8, 9), f = monic(r1, r2);
      // B = 0.1 × bv, A = (f + k·bv)/m 가 정수가 되게 bv 를 고른다.
      const bv = [0, 1, 2].map((i) => { const fi = f[i].p; let r = 0; while ((fi + k * r) % m !== 0) r += 1; return r + m * nz(d, -4, 4); });
      if (bv.some((b) => b % 10 === 0) || bv[2] === 0) return null;
      const Av = [0, 1, 2].map((i) => (f[i].p + k * bv[i]) / m);
      if (Av[2] === 0 || Av.some((v) => Math.abs(v) > 30)) return null;
      const Ap = P(...Av), Bp = bv.map((b) => dc(b));
      return intRootsQ(`두 식 ${nb(V('A') + ' = ' + polyH(Ap))}, ${nb(V('B') + ' = ' + polyH(Bp))}에 대하여 ${nb(m + V('A') + ' ' + MINUS + ' ' + n10 + V('B') + ' = 0')}을 만족시키는 ${X}의 값을 모두 구하시오.`, f, {
        explain: `${nb(m + V('A') + ' = ' + polyH(pk(Ap, m)))}, ${nb(n10 + V('B') + ' = ' + polyH(P(...bv.map((b) => b * k))))}이므로 ${nb(m + V('A') + ' ' + MINUS + ' ' + n10 + V('B') + ' = ' + polyH(f) + ' = 0')}이다. 인수분해하면 ${nb(prodH(1, [[1, -r1], [1, -r2]]) + ' = 0')}이므로 ${setH([r1, r2])}이다.`,
        facts: { rule: 'ab' }
      });
    })
  ]);

  // ── 두 근과 이차방정식 ──
  B.addTypes('9-1-4', 'roots', [
    T('rt-coef1', '두 근이 주어질 때 x² + ax + b = 0의 계수', '①55', (d) => {
      const [u, w] = twoInts(d, -9, 9), a = -(u + w), b = u * w;
      if (a === 0) return null;
      return valsQ(`이차방정식 ${nb(X2 + ' + ' + va + X + ' + ' + vb + ' = 0')}의 해가 ${nb(X + ' = ' + iq(u))} 또는 ${nb(X + ' = ' + iq(w))}일 때, 수 ${va}, ${vb}의 값은?`, [['a', a], ['b', b]], {
        explain: `두 근이 ${iq(u)}, ${iq(w)}이고 ${X2}의 계수가 1인 이차방정식은 ${nb(prodH(1, [[1, -u], [1, -w]]) + ' = 0')}, 곧 ${nb(polyH(monic(u, w)) + ' = 0')}이므로 ${nb(va + ' = ' + iq(a))}, ${nb(vb + ' = ' + iq(b))}이다.`,
        facts: { calc: [[`-((${u})+(${w}))`, 0], [`(${u})*(${w})`, 1]] }
      });
    }),
    T('rt-coefk', '두 근과 x²의 계수가 주어진 이차방정식의 계수', '①56', (d) => {
      const A = d.int(2, 5), up = d.until(() => nz(d, -9, 9), (t) => gcd(Math.abs(t), A) === 1), w = nz(d, -6, 6), f = pmul(P(-up, A), P(-w, 1)), a = f[1].p, b = f[0].p;
      if (a === 0) return null;
      return valsQ(`이차방정식 ${nb(A + X2 + ' + ' + va + X + ' + ' + vb + ' = 0')}의 해가 ${nb(X + ' = ' + tx(Q(up, A)))} 또는 ${nb(X + ' = ' + iq(w))}일 때, 수 ${va}, ${vb}의 값은?`, [['a', a], ['b', b]], {
        explain: `두 근이 ${tx(Q(up, A))}, ${iq(w)}이고 ${X2}의 계수가 ${A}인 이차방정식은 ${nb(A + '(' + linH(1, Q(-up, A)) + ')(' + linH(1, -w) + ') = 0')}, 곧 ${nb(polyH(f) + ' = 0')}이므로 ${nb(va + ' = ' + iq(a))}, ${nb(vb + ' = ' + iq(b))}이다.`,
        facts: { calc: [[`-(${A}*(${w})+(${up}))`, 0], [`(${up})*(${w})`, 1]] }
      });
    }),
    T('rt-graph', '그래프에서 읽은 두 수를 근으로 하는 이차방정식', '①57', (d) => {
      const a = nz(d, -3, 3), b = nz(d, -4, 4);
      if (a === b || a === -b || Math.abs(a + b) > 4) return null;
      const fig = plane({ x: [-4, 4], y: [-5, 5], lines: [{ a, b }], ticks: 'all' });
      return valsQ(`일차함수 ${nb(V('y') + ' = ' + va + X + ' + ' + vb)}의 그래프가 다음 그림과 같다. ${va}, ${vb}를 두 근으로 하고 ${X2}의 계수가 1인 이차방정식을 ${nb(X2 + ' + ' + vp + X + ' + ' + vq + ' = 0')}이라 할 때, 수 ${vp}, ${vq}의 값은?`, [['p', -(a + b)], ['q', a * b]], {
        figure: fig,
        explain: `그래프가 점 (0, ${iq(b)})${tail(Math.abs(b), '을/를')} 지나므로 ${nb(vb + ' = ' + iq(b))}이고, ${X}의 값이 1만큼 늘 때 ${V('y')}의 값이 ${iq(a)}만큼 변하므로 기울기 ${nb(va + ' = ' + iq(a))}이다. 두 근이 ${iq(a)}, ${iq(b)}인 이차방정식은 ${nb(prodH(1, [[1, -a], [1, -b]]) + ' = 0')}, 곧 ${nb(polyH(monic(a, b)) + ' = 0')}이므로 ${nb(vp + ' = ' + iq(-(a + b)))}, ${nb(vq + ' = ' + iq(a * b))}이다.`,
        facts: { calc: [[`-((${a})+(${b}))`, 0], [`(${a})*(${b})`, 1]] }
      });
    }),
    T('rt-next', '두 근으로 계수를 구해 다른 방정식 풀기', '①58', (d) => {
      const m = d.int(2, 6), n2 = d.until(() => d.int(2, 7), (t) => t !== m), s1 = d.pick([1, -1]), s2 = d.pick([1, -1]), Lc = m * n2, a = -(s1 * n2 + s2 * m), b = s1 * s2;
      const g = P(1, a, b), S = solve2(g);
      if (a === 0 || S.kind !== 'irr' || formOf(S.sol) !== 'P1R') return null;
      return radRootAns(`이차방정식 ${nb(Lc + X2 + ' + ' + va + X + ' + ' + vb + ' = 0')}의 두 근이 ${tx(Q(s1, m))}, ${tx(Q(s2, n2))}일 때, 이차방정식 ${nb(vb + X2 + ' + ' + va + X + ' + 1 = 0')}을 푸시오.`, S, 'P1R', {
        explain: `${X2}의 계수가 ${Lc}이고 두 근이 ${tx(Q(s1, m))}, ${tx(Q(s2, n2))}인 이차방정식은 ${nb(Lc + '(' + linH(1, Q(-s1, m)) + ')(' + linH(1, Q(-s2, n2)) + ') = 0')}, 곧 ${nb(polyH(P(b, a, Lc)) + ' = 0')}이므로 ${nb(va + ' = ' + iq(a))}, ${nb(vb + ' = ' + iq(b))}이다. ${nb(polyH(g) + ' = 0')}을 근의 공식으로 풀면 ${solH(S.sol)}이다.`,
        facts: { rule: 'next' }
      });
    }),
    T('rt-solved', '방정식을 풀어 나온 해를 계수로 하는 다른 방정식 풀기', '①59', (d) => {
      const [r1, r2] = twoInts(d, -8, 8), a = Math.max(r1, r2), b = Math.min(r1, r2), e = dress(d, -(r1 + r2), r1 * r2), g = P(b, a, 1), S = solve2(g);
      if (S.kind !== 'irr' || formOf(S.sol) !== 'P1R') return null;
      return radRootAns(`이차방정식 ${nb(eqH(e.L, e.R))}의 해가 ${nb(X + ' = ' + va)} 또는 ${nb(X + ' = ' + vb)}일 때, 이차방정식 ${nb(X2 + ' + ' + va + X + ' + ' + vb + ' = 0')}을 푸시오. (단, ${nb(va + ' &gt; ' + vb)})`, S, 'P1R', {
        explain: `${ej(nb(eqH(e.L, e.R)), '을/를')} 정리하면 ${nb(polyH(monic(r1, r2)) + ' = 0')}, ${nb(prodH(1, [[1, -a], [1, -b]]) + ' = 0')}이므로 ${nb(va + ' = ' + iq(a))}, ${nb(vb + ' = ' + iq(b))}이다. ${nb(polyH(g) + ' = 0')}을 근의 공식으로 풀면 ${solH(S.sol)}이다.`,
        facts: { rule: 'solved' }
      });
    }),
    T('rt-link', '한 방정식의 근이 다른 방정식의 한 근', '①60', (d, n) => {
      if (n === 0) {
        // 작은 근(또는 큰 근) r 이 x² + 2kx + k + c = 0 의 근
        const [u, w] = twoInts(d, -6, 6), small = d.bool(), r = small ? Math.min(u, w) : Math.max(u, w), c = nz(d, -9, 9), den = 2 * r + 1, num = -(r * r + c);
        if (num % den !== 0 || num === 0) return null;
        const k = num / den, e = dress(d, -(u + w), u * w, ['pq', 'xp', 'move']);
        return N(`이차방정식 ${nb(eqH(e.L, e.R))}의 두 근 가운데 ${small ? '작은' : '큰'} 근이 이차방정식 ${nb(X2 + ' + 2' + vk + X + ' + ' + vk + moreH([[c, '']]) + ' = 0')}의 한 근일 때, 수 ${vk}의 값은?`, k, {
          signed: true,
          explain: `${ej(nb(eqH(e.L, e.R)), '을/를')} 풀면 ${setH([u, w])}이므로 ${small ? '작은' : '큰'} 근은 ${iq(r)}이다. ${nb(X + ' = ' + iq(r))}${tail(Math.abs(r), '을/를')} 대입하면 ${nb(`${r * r}` + moreH([[2 * r, vk], [1, vk], [c, '']]) + ' = 0')}이므로 ${nb(vk + ' = ' + iq(k))}이다.`,
          facts: { value: `-((${r})*(${r})+(${c}))/(2*(${r})+1)`, derived: [Math.abs(r), 2] }
        });
      }
      // x² − 2hx + c = 0 의 두 근(h ± √t)의 합 2h 가 Ax² + Bx + k = 0 의 한 근
      const h = nz(d, -4, 4), t = d.until(() => d.int(2, 15), squarefree), c = h * h - t, A = d.int(1, 3), Bc = nz(d, -9, 9), k = -(A * 4 * h * h + Bc * 2 * h);
      if (c === 0 || k === 0) return null;
      return N(`이차방정식 ${nb(polyH(P(c, -2 * h, 1)) + ' = 0')}의 두 근의 합이 이차방정식 ${nb(polyH(P(0, Bc, A)) + ' + ' + vk + ' = 0')}의 한 근일 때, 수 ${vk}의 값은?`, k, {
        signed: true,
        explain: `근의 공식으로 풀면 ${nb(X + ' = ' + iq(h) + ' ± ' + rt(t))}이므로 두 근의 합은 ${nb('(' + iq(h) + ' + ' + rt(t) + ') + (' + iq(h) + ' ' + MINUS + ' ' + rt(t) + ') = ' + iq(2 * h))}이다. ${nb(X + ' = ' + iq(2 * h))}${tail(Math.abs(2 * h), '을/를')} 대입하면 ${nb(vk + ' = ' + iq(k))}이다.`,
        facts: { value: `-(${A}*(${2 * h})*(${2 * h})+(${Bc})*(${2 * h}))`, derived: [2 * Math.abs(h)] }
      });
    }, { count: 2 })
  ]);

  // ── 이차방정식의 활용 ──
  // 활용 그림: 화면 좌표의 직사각형
  const rect = (b, x, y, w, h, css) => b.poly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], css);
  B.addTypes('9-1-4', 'use', [
    T('use-pair', '차가 주어진 두 수의 곱', '①64', (d) => {
      const small = d.int(3, 18), dd = d.int(2, 9), big = small + dd, prod = small * big, R = small + big;
      if (d.bool()) {
        return M(`차가 ${dd}인 두 자연수의 곱이 ${prod}일 때, 두 자연수를 구하시오.`, [{ answer: small, lead: '작은 수' }, { answer: big, lead: '큰 수' }], {
          explain: `작은 수를 ${X}라 하면 큰 수는 ${nb(X + ' + ' + dd)}이므로 ${nb(X + '(' + X + ' + ' + dd + ') = ' + prod)}, ${nb(polyH(P(-prod, dd, 1)) + ' = 0')}, ${nb(prodH(1, [[1, R], [1, -small]]) + ' = 0')}이다. ${X}는 자연수이므로 ${nb(X + ' = ' + small)}, 두 수는 ${small}, ${big}이다.`,
          facts: { calc: [[`(-${dd}+${R})/2`, 0], [`(${dd}+${R})/2`, 1]], derived: [R, 2] }
        });
      }
      return N(`${dd}살 차이가 나는 두 자매의 나이의 곱이 ${prod}일 때, 동생의 나이는 몇 살인가?`, small, {
        unit: '살',
        explain: `동생의 나이를 ${X}살이라 하면 언니의 나이는 (${nb(X + ' + ' + dd)})살이므로 ${nb(X + '(' + X + ' + ' + dd + ') = ' + prod)}, ${nb(prodH(1, [[1, R], [1, -small]]) + ' = 0')}이다. 나이는 양수이므로 ${small}살이다.`,
        facts: { value: `(-${dd}+${R})/2`, derived: [R, 2] }
      });
    }),
    T('use-consec', '연속하는 수', '①65', (d, n) => {
      if (n === 0) {
        const a = d.int(3, 20), s = a * a + (a + 1) * (a + 1);
        return M(`연속하는 두 자연수의 제곱의 합이 ${s}일 때, 두 자연수를 구하시오.`, [{ answer: a, lead: '작은 수' }, { answer: a + 1, lead: '큰 수' }], {
          explain: `두 수를 ${X}, ${nb(X + ' + 1')}이라 하면 ${nb(X2 + ' + (' + X + ' + 1)' + sup(2) + ' = ' + s)}, ${nb(polyH(P(1 - s, 2, 2)) + ' = 0')}, ${nb(polyH(P((1 - s) / 2, 1, 1)) + ' = 0')}, ${nb(prodH(1, [[1, a + 1], [1, -a]]) + ' = 0')}이다. ${X}는 자연수이므로 두 수는 ${a}, ${a + 1}이다.`,
          facts: { calc: [[`(-1+${2 * a + 1})/2`, 0], [`(1+${2 * a + 1})/2`, 1]], derived: [2 * a + 1, 2] }
        });
      }
      if (n === 1) {
        const a = d.int(4, 20), s = (a - 1) * (a - 1) + a * a + (a + 1) * (a + 1);
        return N(`연속하는 세 자연수의 제곱의 합이 ${s}일 때, 가장 큰 수는?`, a + 1, {
          explain: `세 수를 ${nb(X + ' ' + MINUS + ' 1')}, ${X}, ${nb(X + ' + 1')}이라 하면 ${nb('3' + X2 + ' + 2 = ' + s)}, ${nb(X2 + ' = ' + a * a)}이다. ${X}는 자연수이므로 ${nb(X + ' = ' + a)}이고 가장 큰 수는 ${a + 1}이다.`,
          facts: { value: `${a}+1`, derived: [a] }
        });
      }
      if (n === 2) {
        const odd = d.bool(), a = 2 * d.int(3, 15) + (odd ? 1 : 0), p = a * (a + 2);
        return M(`연속하는 두 ${odd ? '홀수' : '짝수'}의 곱이 ${p}일 때, 두 수를 구하시오. (단, 두 수는 자연수이다.)`, [{ answer: a, lead: '작은 수' }, { answer: a + 2, lead: '큰 수' }], {
          explain: `작은 수를 ${X}라 하면 큰 수는 ${nb(X + ' + 2')}이므로 ${nb(X + '(' + X + ' + 2) = ' + p)}, ${nb(prodH(1, [[1, a + 2], [1, -a]]) + ' = 0')}이다. ${X}는 자연수이므로 두 수는 ${a}, ${a + 2}이다.`,
          facts: { calc: [[`(-2+${2 * a + 2})/2`, 0], [`(2+${2 * a + 2})/2`, 1]], derived: [2 * a + 2, 2] }
        });
      }
      // 연속하는 세 정수(짝수): 가장 큰 수의 제곱 = 나머지 두 수의 제곱의 합 → 답이 두 벌
      const step = d.pick([1, 2]), word = step === 1 ? '정수' : '짝수', m = 4 * step;   // (x + s)² = (x − s)² + x² → x = 0 또는 4s
      const sets = [[0, m], [m], [0], [-m, m], [m, 2 * m]];
      const valsT = (s) => s.map((v) => nb(X + ' = ' + iq(v))).join(' 또는 ');
      return choose(d, `연속하는 세 ${word}가 있다. 가장 큰 수의 제곱이 나머지 두 수의 제곱의 합과 같을 때, 가운데 수를 ${X}라 하자. ${X}의 값을 모두 구한 것은?`, sets.map((s) => [valsT(s), sameSet(s, [0, m])]), {
        explain: `세 수를 ${nb(X + ' ' + MINUS + ' ' + step)}, ${X}, ${nb(X + ' + ' + step)}라 하면 ${nb('(' + X + ' + ' + step + ')' + sup(2) + ' = (' + X + ' ' + MINUS + ' ' + step + ')' + sup(2) + ' + ' + X2)}, ${nb(polyH(P(0, -m, 1)) + ' = 0')}, ${nb(X + '(' + X + ' ' + MINUS + ' ' + m + ') = 0')}이다. ${word}이므로 두 값 모두 맞고 세 수는 ${iq(-step)}, 0, ${step} 또는 ${m - step}, ${m}, ${m + step}이다.`,
        facts: { rule: 'consec-pyth' }
      });
    }, { count: 4 }),
    T('use-wrong', '잘못 계산한 수', '①66', (d, n) => {
      if (n === 0) {
        const k = d.int(2, 4), x = d.int(k + 2, 15), gap = x * x - k * x;
        return N(`어떤 자연수를 제곱해야 할 것을 잘못하여 ${k}배 하였더니 제곱한 것보다 ${gap}만큼 작았다. 어떤 자연수는?`, x, {
          explain: `어떤 자연수를 ${X}라 하면 ${nb(k + X + ' = ' + X2 + ' ' + MINUS + ' ' + gap)}, ${nb(polyH(P(-gap, -k, 1)) + ' = 0')}, ${nb(prodH(1, [[1, x - k], [1, -x]]) + ' = 0')}이다. ${X}는 자연수이므로 ${x}이다.`,
          facts: { value: `(${k}+${2 * x - k})/2`, derived: [2 * x - k, 2] }
        });
      }
      const x = d.int(6, 25), wrongV = x * (x - 1);
      return N(`어떤 자연수에 그 수보다 1이 큰 수를 곱해야 할 것을 잘못하여 1이 작은 수를 곱하였더니 ${wrongV}${tail(wrongV, '이/가')} 되었다. 바르게 계산한 값은?`, x * (x + 1), {
        explain: `어떤 자연수를 ${X}라 하면 ${nb(X + '(' + X + ' ' + MINUS + ' 1) = ' + wrongV)}, ${nb(prodH(1, [[1, x - 1], [1, -x]]) + ' = 0')}이므로 ${nb(X + ' = ' + x)}이다. 바르게 계산하면 ${nb(x + ' × ' + (x + 1) + ' = ' + x * (x + 1))}이다.`,
        facts: { value: `${x}*(${x}+1)`, derived: [x] }
      });
    }, { count: 2 }),
    T('use-int', '정수라는 조건으로 근 고르기', '①67', (d) => {
      const a = d.int(2, 3), b = nz(d, -5, 5), c = nz(d, -4, 4), r = nz(d, -5, 5), e = (a * r + b) * (r + c), f = psub(prodP(1, [[a, b], [1, c]]), P(e)), roots = ratRoots(f);
      if (e === 0 || roots.length !== 2 || roots.filter(isInt).length !== 1) return null;
      const S2 = solve2(f), sq = Math.sqrt(S2.D), sgn = (-S2.b + sq) / (2 * S2.a) === r ? '+' : '-';
      return N(`어떤 정수 ${X}에 대하여 ${ej(nb(prodH(1, [[a, b], [1, c]]) + ' = ' + iq(e)), '이/가')} 성립한다. ${X}의 값은?`, r, {
        signed: true,
        explain: `${nb(prodH(1, [[a, b], [1, c]]) + ' = ' + iq(e))}, ${nb(polyH(f) + ' = 0')}을 풀면 ${setH(roots)}이다. ${X}는 정수이므로 ${nb(X + ' = ' + iq(r))}이다.`,
        facts: { value: `(-(${S2.b})${sgn}${sq})/(2*${S2.a})`, derived: [sq, 2, S2.a, Math.abs(S2.b)] }
      });
    }),
    T('use-digits', '두 자리 자연수', '①68', (d) => {
      const t = d.int(1, 9), u = d.int(0, 9), s = t + u, gap = (10 * t + u) - t * u;
      // 십의 자리 숫자 x: x(s − x) = 10x + (s − x) − gap → x² + (9 − s)x + s − gap = 0
      const g = P(s - gap, 9 - s, 1), roots = ratRoots(g).filter((v) => isInt(v) && v.p >= 1 && v.p <= 9 && s - v.p >= 0 && s - v.p <= 9);
      if (roots.length !== 1 || gap <= 0) return null;
      return N(`두 자리 자연수가 있다. 십의 자리의 숫자와 일의 자리의 숫자의 합은 ${s}이고, 두 숫자의 곱은 처음 수보다 ${gap}만큼 작다. 이 두 자리 자연수는?`, 10 * t + u, {
        explain: `십의 자리의 숫자를 ${X}라 하면 일의 자리의 숫자는 ${nb(s + ' ' + MINUS + ' ' + X)}, 처음 수는 ${nb('9' + X + ' + ' + s)}이다. ${ej(nb(X + '(' + s + ' ' + MINUS + ' ' + X + ') = 9' + X + ' + ' + s + ' ' + MINUS + ' ' + gap), '을/를')} 정리하면 ${nb(polyH(g) + ' = 0')}이고, ${X}는 1부터 9까지의 자연수이므로 ${nb(X + ' = ' + t)}, 두 자리 자연수는 ${10 * t + u}이다.`,
        facts: { value: `10*${t}+(${s}-${t})`, derived: [10, t] }
      });
    }),
    T('use-calendar', '달력에서 위아래로 이웃한 두 날짜', '①69', (d) => {
      const x = d.int(1, 24), p = x * (x + 7), R = 2 * x + 7;
      return M(`어느 달의 달력에서 위아래로 이웃한 두 날짜를 곱한 값이 ${p}일 때, 두 날짜를 구하시오.`, [{ answer: x, lead: '위 날짜', unit: '일' }, { answer: x + 7, lead: '아래 날짜', unit: '일' }], {
        explain: `달력에서 위아래로 이웃한 두 날짜는 7만큼 차이가 난다. 위 날짜를 ${X}일이라 하면 ${nb(X + '(' + X + ' + 7) = ' + p)}, ${nb(prodH(1, [[1, x + 7], [1, -x]]) + ' = 0')}이므로 ${nb(X + ' = ' + x)}이다. 두 날짜는 ${x}일, ${x + 7}일이다.`,
        facts: { calc: [[`(-7+${R})/2`, 0], [`(7+${R})/2`, 1]], derived: [7, R, 2] }
      });
    }),
    T('use-formula', '주어진 식에 넣는 활용', '①70', (d, n) => {
      if (n === 0) {
        const m = d.int(6, 20), total = m * (m - 3) / 2;
        return N(`${V('n')}각형의 대각선의 개수는 ${frac(V('n') + '(' + V('n') + ' ' + MINUS + ' 3)', 2)}이다. 대각선의 개수가 ${total}인 다각형은 몇 각형인가?`, m, {
          unit: '각형',
          explain: `${nb(frac(V('n') + '(' + V('n') + ' ' + MINUS + ' 3)', 2) + ' = ' + total)}에서 ${nb(poly([[1, V('n') + sup(2)], [-3, V('n')], [-2 * total, '']]) + ' = 0')}, ${nb('(' + V('n') + ' ' + MINUS + ' ' + m + ')(' + V('n') + ' + ' + (m - 3) + ') = 0')}이다. ${V('n')}은 3 이상의 자연수이므로 ${m}각형이다.`,
          facts: { value: `(3+${2 * m - 3})/2`, derived: [2 * m - 3, 2] }
        });
      }
      const m = d.int(8, 30), total = m * (m + 1) / 2;
      return N(`1부터 ${V('n')}까지의 자연수의 합은 ${frac(V('n') + '(' + V('n') + ' + 1)', 2)}이다. 합이 ${total}${tail(total, '이/가')} 되려면 1부터 얼마까지의 자연수를 더해야 하는가?`, m, {
        explain: `${nb(frac(V('n') + '(' + V('n') + ' + 1)', 2) + ' = ' + total)}에서 ${nb(poly([[1, V('n') + sup(2)], [1, V('n')], [-2 * total, '']]) + ' = 0')}, ${nb('(' + V('n') + ' ' + MINUS + ' ' + m + ')(' + V('n') + ' + ' + (m + 1) + ') = 0')}이다. ${V('n')}은 자연수이므로 ${m}까지 더해야 한다.`,
        facts: { value: `(-1+${2 * m + 1})/2`, derived: [2 * m + 1, 2] }
      });
    }, { count: 2 }),
    T('use-height', '쏘아 올린 물체의 높이', '①71', (d) => {
      const v = 10 * d.int(2, 6), H = v * v / 20, t = v / 10, vt = V('t');
      return N(`지면에서 초속 ${v} m로 똑바로 위로 쏘아 올린 공의 ${vt}초 후의 높이는 ${nb('(' + v + vt + ' ' + MINUS + ' 5' + vt + sup(2) + ')')} m이다. 이 공의 높이가 ${H} m가 되는 것은 쏘아 올린 지 몇 초 후인가?`, t, {
        unit: '초 후',
        explain: `${nb(v + vt + ' ' + MINUS + ' 5' + vt + sup(2) + ' = ' + H)}에서 양변을 ${MINUS}5로 나누어 정리하면 ${nb(poly([[1, vt + sup(2)], [-2 * t, vt], [t * t, '']]) + ' = 0')}, ${nb('(' + vt + ' ' + MINUS + ' ' + t + ')' + sup(2) + ' = 0')}이므로 ${t}초 후이다.`,
        facts: { value: `${v}/(2*5)`, derived: [2] }
      });
    }),
    T('use-share', '사람 수에 따라 한 사람이 받는 양이 정해진 나누기', '①72', (d) => {
      const nn = 2 * d.int(3, 10), c = d.int(1, 6), total = nn * (nn / 2 + c), R = 2 * nn + 2 * c;
      return N(`쿠키 ${total}개를 학생들에게 남김없이 똑같이 나누어 주었다. 학생 한 명이 받은 쿠키의 개수가 학생 수의 ${frac(1, 2)}보다 ${c}만큼 많을 때, 학생은 몇 명인가?`, nn, {
        unit: '명',
        explain: `학생 수를 ${X}명이라 하면 한 명이 받은 쿠키는 ${nb('(' + frac(1, 2) + X + ' + ' + c + ')')}개이므로 ${nb(X + '(' + frac(1, 2) + X + ' + ' + c + ') = ' + total)}, ${nb(polyH(P(-2 * total, 2 * c, 1)) + ' = 0')}, ${nb(prodH(1, [[1, nn + 2 * c], [1, -nn]]) + ' = 0')}이다. ${X}는 자연수이므로 ${nn}명이다.`,
        facts: { value: `(-2*${c}+${R})/2`, derived: [R, 2] }
      });
    }),
    T('use-rect', '변의 길이를 늘이고 줄인 직사각형의 넓이', '①73', (d) => {
      const a = d.int(1, 5), b = d.int(1, 4), x = d.int(b + 3, 20), S = (x + a) * (x - b), R = 2 * x + a - b;
      return N(`정사각형 모양의 밭이 있다. 가로의 길이를 ${a} m 늘이고 세로의 길이를 ${b} m 줄였더니 넓이가 ${S} m²가 되었다. 처음 밭의 한 변의 길이는 몇 m인가?`, x, {
        unit: 'm',
        explain: `처음 한 변의 길이를 ${X} m라 하면 ${nb('(' + X + ' + ' + a + ')(' + X + ' ' + MINUS + ' ' + b + ') = ' + S)}, ${nb(polyH(P(-a * b - S, a - b, 1)) + ' = 0')}이다. 풀면 ${nb(X + ' = ' + x)} 또는 ${nb(X + ' = ' + iq(-(x + a - b)))}이고 ${nb(X + ' &gt; ' + b)}이므로 ${x} m이다.`,
        facts: { value: `(-(${a}-${b})+${R})/2`, derived: [R, 2] }
      });
    }),
    T('use-setup', '넓이 문제의 이차방정식 세우기', '①74', (d) => {
      let said, right, wrongs;
      if (d.bool()) {
        const w = d.int(3, 9), h = d.until(() => d.int(3, 9), (v) => v !== w), p = w + h, S = w * h;
        said = `둘레의 길이가 ${2 * p} cm, 넓이가 ${S} cm²인 직사각형의 가로의 길이를 ${X} cm라 할 때, ${X}의 값을 구하는 이차방정식은?`;
        right = P(S, -p, 1); wrongs = [P(S, -2 * p, 1), P(-S, p, 1), P(S, p, 1), P(-S, 2 * p, 1)];
      } else {
        const a = d.int(5, 12), b = d.until(() => d.int(5, 14), (v) => v !== a), x = d.int(1, 6), S = (a + x) * (b + x);
        said = `가로, 세로의 길이가 각각 ${a} m, ${b} m인 직사각형 모양의 밭의 가로, 세로의 길이를 똑같이 ${X} m씩 늘였더니 넓이가 ${S} m²가 되었다. ${X}의 값을 구하는 이차방정식은?`;
        right = P(a * b - S, a + b, 1); wrongs = [P(a * b + S, a + b, 1), P(a * b - S, -(a + b), 1), P(-a * b - S, a + b, 1), P(-S, a + b, 1)];
      }
      const same = (f) => f.every((c, i) => qcmp(c, right[i]) === 0);
      return choose(d, said, [right].concat(wrongs).map((f) => [nb(polyH(f) + ' = 0'), same(f)]), {
        explain: `문제의 뜻에 맞게 식을 세우고 정리하면 ${nb(polyH(right) + ' = 0')}이다.`,
        facts: { rule: 'setup' }
      });
    }),
    T('use-change', '매초 변하는 직사각형이 처음 넓이와 같아질 때', '①75', (d) => {
      // 가로 W 가 매초 a 씩 줄고 세로 H 가 매초 b 씩 늘면 (W − at)(H + bt) = WH → t = (bW − aH)/(ab)
      const a = d.int(1, 3), b = d.until(() => d.int(1, 3), (v) => v !== a), t = d.int(2, 12), H = d.int(4, 20), W = (a * H + a * b * t) / b;
      if (!Number.isInteger(W) || W - a * t <= 0 || W > 40) return null;
      const grow = d.bool(), vt = V('t');
      const text = grow ? `가로의 길이가 ${H} cm, 세로의 길이가 ${W} cm인 직사각형이 있다. 가로의 길이는 매초 ${b} cm씩 늘어나고 세로의 길이는 매초 ${a} cm씩 줄어들 때, 몇 초 후에 처음 직사각형과 넓이가 같아지는가?`
        : `가로의 길이가 ${W} cm, 세로의 길이가 ${H} cm인 직사각형이 있다. 가로의 길이는 매초 ${a} cm씩 줄어들고 세로의 길이는 매초 ${b} cm씩 늘어날 때, 몇 초 후에 처음 직사각형과 넓이가 같아지는가?`;
      return N(text, t, {
        unit: '초 후',
        explain: `${vt}초 후의 넓이는 ${nb('(' + W + ' ' + MINUS + ' ' + (a === 1 ? '' : a) + vt + ')(' + H + ' + ' + (b === 1 ? '' : b) + vt + ')')}이고 처음 넓이는 ${W * H}이므로 정리하면 ${nb(poly([[a * b, vt + sup(2)], [-(b * W - a * H), vt]]) + ' = 0')}, ${nb((a * b === 1 ? '' : a * b) + vt + '(' + vt + ' ' + MINUS + ' ' + t + ') = 0')}이다. ${nb(vt + ' = 0')}은 처음이므로 ${t}초 후이다.`,
        facts: { value: `(${b}*${W}-${a}*${H})/(${a}*${b})` }
      });
    }),
    T('use-squares', '두 정사각형의 넓이의 합', '①76', (d, n) => {
      if (n === 0) {
        const s = d.int(2, 12), l = d.until(() => d.int(3, 15), (v) => v > s), L = s + l, S = s * s + l * l;
        return N(`길이가 ${L} cm인 선분을 두 부분으로 나누어 각각을 한 변으로 하는 정사각형 두 개를 만들었더니 두 정사각형의 넓이의 합이 ${S} cm²였다. 작은 정사각형의 한 변의 길이는 몇 cm인가?`, s, {
          unit: 'cm',
          explain: `작은 정사각형의 한 변을 ${X} cm라 하면 큰 정사각형의 한 변은 ${nb('(' + L + ' ' + MINUS + ' ' + X + ')')} cm이므로 ${nb(X2 + ' + (' + L + ' ' + MINUS + ' ' + X + ')' + sup(2) + ' = ' + S)}, ${nb(polyH(P(s * l, -L, 1)) + ' = 0')}이다. 풀면 ${nb(X + ' = ' + s)} 또는 ${nb(X + ' = ' + l)}이고, 작은 정사각형이므로 ${s} cm이다.`,
          facts: { value: `(${L}-${l - s})/2`, derived: [l - s, 2] }
        });
      }
      const s = d.int(4, 15), dd = d.int(2, 8), l = s + dd, S = s * s + l * l;
      return M(`크고 작은 두 정사각형이 있다. 넓이의 합은 ${S}이고, 큰 정사각형의 한 변은 작은 정사각형의 한 변보다 ${dd}만큼 길다. 두 정사각형의 한 변의 길이를 구하시오.`, [{ answer: s, lead: '작은 정사각형' }, { answer: l, lead: '큰 정사각형' }], {
        explain: `작은 정사각형의 한 변을 ${X}라 하면 ${nb(X2 + ' + (' + X + ' + ' + dd + ')' + sup(2) + ' = ' + S)}, ${nb(polyH(P((dd * dd - S) / 2, dd, 1)) + ' = 0')}, ${nb(prodH(1, [[1, l], [1, -s]]) + ' = 0')}이다. ${X}는 양수이므로 ${s}, 큰 정사각형의 한 변은 ${l}이다.`,
        facts: { calc: [[`(-${dd}+${s + l})/2`, 0], [`(${dd}+${s + l})/2`, 1]], derived: [s + l, 2] }
      });
    }, { count: 2 }),
    T('use-path-out', '둘레 밖에 폭이 일정한 길', '①77', (d) => {
      const W = d.int(5, 12), H = d.until(() => d.int(3, 9), (v) => v < W), x = d.int(1, 3), S = (W + 2 * x) * (H + 2 * x) - W * H;
      const g = Board(), u = 150 / (W + 2 * x), ox = x * u;
      rect(g, 0, 0, (W + 2 * x) * u, (H + 2 * x) * u, 'fill:rgba(148,163,184,0.35)'); rect(g, ox, ox, W * u, H * u, 'fill:rgba(74,222,128,0.35)');
      g.text([ox + W * u / 2, ox + H * u / 2], '화단', { plain: true }); if (ox >= 18) g.text([(W + 2 * x) * u / 2, ox / 2], '길', { plain: true, size: 12.5 });
      return N(`가로, 세로의 길이가 각각 ${W} m, ${H} m인 직사각형 모양의 화단의 둘레 밖으로 폭이 일정한 길을 만들었더니 길의 넓이가 ${S} m²가 되었다. 길의 폭은 몇 m인가?`, x, {
        unit: 'm', figure: g.svg(`가로 ${W} m, 세로 ${H} m인 화단 둘레 밖에 폭이 일정한 길(회색)이 있다.`),
        explain: `길의 폭을 ${X} m라 하면 ${nb('(' + W + ' + 2' + X + ')(' + H + ' + 2' + X + ') ' + MINUS + ' ' + W * H + ' = ' + S)}, ${nb(polyH(P(-S, 2 * (W + H), 4)) + ' = 0')}, ${nb(polyH(P(abc(P(-S, 2 * (W + H), 4)).c, abc(P(-S, 2 * (W + H), 4)).b, abc(P(-S, 2 * (W + H), 4)).a)) + ' = 0')}이다. ${X}는 양수이므로 ${x} m이다.`,
        facts: { value: `(-2*(${W}+${H})+${Math.sqrt(4 * (W + H) * (W + H) + 16 * S)})/8`, derived: [Math.sqrt(4 * (W + H) * (W + H) + 16 * S), 2, 8] }
      });
    }),
    T('use-path-cross', '폭이 일정한 십자형 길과 남은 넓이', '①78', (d) => {
      const W = d.int(12, 40), H = d.until(() => d.int(10, 30), (v) => v < W), x = d.int(1, 4), S = (W - x) * (H - x);
      const g = Board(), u = 170 / W, ax = (W * 0.38) * u, ay = (H * 0.55) * u, xw = Math.max(x * u, 7);
      rect(g, 0, 0, W * u, H * u, 'fill:rgba(74,222,128,0.35)'); rect(g, ax, 0, xw, H * u, 'fill:#e2e8f0'); rect(g, 0, ay, W * u, xw, 'fill:#e2e8f0'); rect(g, 0, 0, W * u, H * u, CLEAR);
      g.dim([0, H * u], [W * u, H * u], W + ' m', [W * u / 2, 0], 9); g.dim([W * u, 0], [W * u, H * u], H + ' m', [0, H * u / 2], 9);
      return N(`가로, 세로의 길이가 각각 ${W} m, ${H} m인 직사각형 모양의 땅에 그림과 같이 폭이 일정한 십자형의 길을 만들었더니 길을 뺀 나머지 땅의 넓이가 ${S} m²가 되었다. 길의 폭은 몇 m인가?`, x, {
        unit: 'm', figure: g.svg(`가로 ${W} m, 세로 ${H} m인 직사각형 땅에 가로와 세로로 폭이 일정한 길이 하나씩 십자 모양으로 나 있다.`),
        explain: `길을 한쪽으로 모으면 남은 땅은 가로 ${nb('(' + W + ' ' + MINUS + ' ' + X + ')')} m, 세로 ${nb('(' + H + ' ' + MINUS + ' ' + X + ')')} m인 직사각형이므로 ${nb('(' + W + ' ' + MINUS + ' ' + X + ')(' + H + ' ' + MINUS + ' ' + X + ') = ' + S)}, ${nb(polyH(P(W * H - S, -(W + H), 1)) + ' = 0')}이다. 풀면 ${nb(X + ' = ' + x)} 또는 ${nb(X + ' = ' + (W + H - x))}이고 폭은 ${H}보다 작으므로 ${x} m이다.`,
        facts: { value: `(${W}+${H}-${W + H - 2 * x})/2`, derived: [W + H - 2 * x, 2] }
      });
    }),
    T('use-path-side', '두 변을 따라 붙여 넓힌 잔디밭', '①79', (d) => {
      const W = d.int(10, 25), H = d.until(() => d.int(6, 20), (v) => v < W), x = d.int(2, 6), S = (W + x) * (H + x);
      const g = Board(), u = 150 / (W + x);
      rect(g, 0, 0, (W + x) * u, (H + x) * u, 'fill:rgba(74,222,128,0.4)'); rect(g, 0, 0, W * u, H * u, 'fill:rgba(251,191,36,0.4)');
      g.text([W * u / 2, H * u / 2], '꽃밭', { plain: true });
      g.dim([0, 0], [W * u, 0], W + ' m', [W * u / 2, H * u], 8); g.dim([0, 0], [0, H * u], H + ' m', [W * u, H * u / 2], 8);
      return N(`가로, 세로의 길이가 각각 ${W} m, ${H} m인 직사각형 모양의 꽃밭의 두 변을 따라 그림과 같이 폭이 일정한 잔디밭을 만들었더니 꽃밭과 잔디밭을 합한 전체의 넓이가 ${S} m²가 되었다. 잔디밭의 폭은 몇 m인가?`, x, {
        unit: 'm', figure: g.svg(`가로 ${W} m, 세로 ${H} m인 꽃밭의 오른쪽 변과 아래쪽 변을 따라 폭이 일정한 잔디밭이 붙어 있어 전체가 직사각형이다.`),
        explain: `잔디밭의 폭을 ${X} m라 하면 ${nb('(' + W + ' + ' + X + ')(' + H + ' + ' + X + ') = ' + S)}, ${nb(polyH(P(W * H - S, W + H, 1)) + ' = 0')}이다. ${X}는 양수이므로 ${x} m이다.`,
        facts: { value: `(-(${W}+${H})+${W + H + 2 * x})/2`, derived: [W + H + 2 * x, 2] }
      });
    }),
    T('use-box', '네 귀퉁이를 잘라 만든 상자', '①80', (d) => {
      const c = d.int(2, 4), dd = d.int(2, 6), H = d.int(2 * c + 2, 2 * c + 12), Wd = H + dd, V0 = (H - 2 * c) * (Wd - 2 * c) * c, askW = d.bool();
      const g = Board(), u = 150 / Wd, cu = c * u, w = Wd * u, h = H * u;
      g.poly([[cu, 0], [w - cu, 0], [w - cu, cu], [w, cu], [w, h - cu], [w - cu, h - cu], [w - cu, h], [cu, h], [cu, h - cu], [0, h - cu], [0, cu], [cu, cu]], 'fill:rgba(251,191,36,0.3)');
      for (const [x0, y0] of [[0, 0], [w - cu, 0], [0, h - cu], [w - cu, h - cu]]) rect(g, x0, y0, cu, cu, 'fill:none;stroke-dasharray:3 2');
      g.dim([0, 0], [cu, 0], c + ' cm', [cu / 2, 20], 8);
      return N(`가로의 길이가 세로의 길이보다 ${dd} cm 더 긴 직사각형 모양의 종이가 있다. 그림과 같이 네 귀퉁이에서 한 변의 길이가 ${c} cm인 정사각형을 잘라 내고 접어서 뚜껑이 없는 직육면체 모양의 상자를 만들었더니 부피가 ${V0} cm³였다. 처음 종이의 ${askW ? '가로' : '세로'}의 길이는 몇 cm인가?`, askW ? Wd : H, {
        unit: 'cm', figure: g.svg(`직사각형 종이의 네 귀퉁이에서 한 변이 ${c} cm인 정사각형(점선)을 잘라 낸다.`),
        explain: `처음 세로의 길이를 ${X} cm라 하면 상자의 밑면은 가로 ${nb('(' + linH(1, dd - 2 * c) + ')')} cm, 세로 ${nb('(' + X + ' ' + MINUS + ' ' + 2 * c + ')')} cm이고 높이는 ${c} cm이므로 ${nb(c + '(' + linH(1, dd - 2 * c) + ')(' + X + ' ' + MINUS + ' ' + 2 * c + ') = ' + V0)}이다. ${nb(X + ' &gt; ' + 2 * c)}인 해는 ${nb(X + ' = ' + H)}이므로 ${askW ? `가로의 길이는 ${H} + ${dd} = ${Wd}` : `세로의 길이는 ${H}`} cm이다.`,
        facts: askW ? { value: `${H}+${dd}`, derived: [H] } : { value: `${H}`, derived: [H] }
      });
    }),
    T('use-circle', '원의 반지름을 늘이고 줄인 넓이', '①81', (d, n) => {
      if (n === 0) {
        const k = d.pick([2, 3]), r = k * d.int(1, 4) * (k === 2 ? 2 : 1) + 0, cut = r - r / k;
        if (!Number.isInteger(cut) || cut <= 0) return null;
        return N(`어떤 원의 반지름의 길이를 ${cut} cm만큼 줄였더니 그 넓이가 처음 원의 넓이의 ${frac(1, k * k)}이 되었다. 처음 원의 반지름의 길이는 몇 cm인가?`, r, {
          unit: 'cm',
          explain: `처음 반지름을 ${X} cm라 하면 ${nb('π(' + X + ' ' + MINUS + ' ' + cut + ')' + sup(2) + ' = ') + frac(1, k * k) + nb('π' + X2)}이다. ${X} &gt; ${cut}이므로 ${nb(X + ' ' + MINUS + ' ' + cut + ' = ') + frac(X, k)}, ${nb(X + ' = ' + r)}이다.`,
          facts: { value: `${k}*${cut}/(${k}-1)`, derived: [k] }
        });
      }
      const dd = d.int(2, 6);
      return inline(`어떤 원의 반지름의 길이를 ${dd} cm만큼 늘였더니 그 넓이가 처음 원의 넓이의 2배가 되었다. 처음 원의 반지름의 길이는 몇 cm인가?`, grp('({0} +') + ' ' + grp(`{1}${rt('{2}')}) cm`), [{ answer: dd }, { answer: dd }, { answer: 2 }], {
        shown: nb(`(${dd} + ${dd === 1 ? '' : dd}${rt(2)}) cm`),
        explain: `처음 반지름을 ${X} cm라 하면 ${nb('π(' + X + ' + ' + dd + ')' + sup(2) + ' = 2π' + X2)}, ${nb(polyH(P(-dd * dd, -2 * dd, 1)) + ' = 0')}이다. 근의 공식으로 풀면 ${nb(X + ' = ' + dd + ' ± ' + (dd === 1 ? '' : dd) + rt(2))}이고 ${X} &gt; 0이므로 ${nb('(' + dd + ' + ' + (dd === 1 ? '' : dd) + rt(2) + ') cm')}이다.`,
        facts: { calc: [[`${dd}`, 0], [`${dd}`, 1], [`2`, 2]], derived: [] }
      });
    }, { count: 2 }),
    T('use-gutter', '철판을 접어 올린 물받이', '①82', (d) => {
      const W = 2 * d.int(15, 35), [x1, x2] = d.until(() => [d.int(2, W / 2 - 2), d.int(2, W / 2 - 2)], ([p, q]) => p < q && p + q === W / 2), S = x1 * (W - 2 * x1);
      const g = Board(), u = 170 / W, base = (W - 2 * x1) * u, hh = Math.max(x1 * u * 1.6, 44); // 낮으면 「단면」 글씨가 선에 걸린다
      rect(g, 0, 0, base, hh, 'fill:rgba(37,99,235,0.14);stroke:none'); g.seg([0, 0], [0, hh]); g.seg([0, hh], [base, hh]); g.seg([base, hh], [base, 0]);
      g.text([base / 2, hh / 2], '단면', { plain: true }); g.beside([base, 0], [base, hh], SX + ' cm', [0, hh / 2]);
      const sets = [[x1, x2], [x1], [x2], [x1, x2, W / 2], [x1, W / 2]];
      const rows = [];
      for (const s of sets) { const h = s.map((v) => nb(X + ' = ' + v)).join(' 또는 '); if (rows.length < 5 && !rows.some((r) => r[0] === h)) rows.push([h, sameSet(s, [x1, x2])]); }
      return choose(d, `폭이 ${W} cm인 철판의 양쪽을 같은 길이만큼 직각으로 접어 올려 물받이를 만들었다. 접어 올린 한쪽의 길이를 ${X} cm라 할 때, 그림과 같은 직사각형 모양의 단면의 넓이가 ${S} cm²가 되도록 하는 ${X}의 값을 모두 구한 것은?`, rows, {
        figure: g.svg(`물받이의 단면: 밑변은 철판의 폭에서 접어 올린 두 쪽을 뺀 길이이고, 높이는 접어 올린 길이 x cm이다.`),
        explain: `단면의 가로는 ${nb('(' + W + ' ' + MINUS + ' 2' + X + ')')} cm, 세로는 ${X} cm이므로 ${nb(X + '(' + W + ' ' + MINUS + ' 2' + X + ') = ' + S)}, ${nb(polyH(P(S / 2, -W / 2, 1)) + ' = 0')}, ${nb(prodH(1, [[1, -x1], [1, -x2]]) + ' = 0')}이다. 두 값 모두 ${ej(nb('0 &lt; ' + X + ' &lt; ' + W / 2), '을/를')} 만족시키므로 ${nb(X + ' = ' + x1)} 또는 ${nb(X + ' = ' + x2)}이다.`,
        facts: { rule: 'gutter' }
      });
    }),
    T('use-golden', '황금비', '①83', (d) => {
      // 선분 AB 위의 점 C: AB : AC = AC : CB, CB = 2k → AC = k + k√5
      const k = d.int(2, 6), cb = 2 * k;
      const g = Board(), A = [0, 0], Cc = [160, 0], Bp = [160 + 98, 0];
      g.seg(A, Bp); for (const p of [A, Cc, Bp]) g.dot(p);
      g.name(A, 'A', 90, 12); g.name(Cc, 'C', 90, 12); g.name(Bp, 'B', 90, 12); g.dim(Cc, Bp, String(cb), [209, -20], 10);
      return inline(`그림과 같이 선분 AB 위의 점 C에 대하여 ${nb(SG('AB') + ' : ' + SG('AC') + ' = ' + SG('AC') + ' : ' + SG('CB'))}가 성립한다. ${nb(SG('CB') + ' = ' + cb)}일 때, 선분 AC의 길이는?`, grp('{0} +') + ' ' + grp(`{1}${rt('{2}')}`), [{ answer: k }, { answer: k }, { answer: 5 }], {
        figure: g.svg(`선분 AB 위에 점 C가 있다. 선분 CB의 길이는 ${cb}이다.`),
        shown: nb(`${k} + ${k === 1 ? '' : k}${rt(5)}`),
        explain: `${nb(SG('AC') + ' = ' + X)}라 하면 ${nb('(' + X + ' + ' + cb + ') : ' + X + ' = ' + X + ' : ' + cb)}이므로 ${nb(X2 + ' = ' + cb + '(' + X + ' + ' + cb + ')')}, ${nb(polyH(P(-cb * cb, -cb, 1)) + ' = 0')}이다. 근의 공식으로 풀면 ${nb(X + ' = ' + k + ' ± ' + (k === 1 ? '' : k) + rt(5))}이고 ${X} &gt; 0이므로 ${nb(k + ' + ' + (k === 1 ? '' : k) + rt(5))}이다.`,
        facts: { calc: [[`${cb}/2`, 0], [`${cb}/2`, 1], [`(${cb}*${cb}+4*${cb}*${cb})/(${cb}*${cb})`, 2]], derived: [2, 4] }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
