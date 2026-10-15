// 중학교 3학년 1학기 6단원 이차함수 y = ax² + bx + c의 그래프 — 뒤쪽 묶음
// (y = ax² + bx + c의 그래프, 계수에 문자가 든 이차함수, 축과 만나는 점과 넓이, 이차함수의 식 구하기, 그래프와 계수의 부호).
// 단원 틀과 도구, 싣는 기준, 뺀 것과 까닭은 9-1-6a.js 에 있다. ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
// 두 근을 답하는 칸(x축과 만나는 점)은 제곱근 없이 셈할 수 없어 검사 근거(calc)에 근을 unseen 으로 밝혔다. 근은 지을 때 정한 정수이고, 따로 지은 풀이(_work)로 맞춰 보았다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, N, M, C, F, inline } = B.kit;
  const { LAB, MINUS, GT, LT, Q, qadd, qsub, qmul, qdiv, qneg, qabs, qcmp, isInt, fl, mag, tx, nb, tail, lastOf, js, V, sup, nz, pm, ansV, claimQ, asQ, pointAns, plain, gcd } = B.kit.mid;
  const K9 = B.kit.m916;
  const { S22, T, X, Y, A, BB, CC, P, QV, K, MM, NN, X2, XA, YA, XI, YI, TAG6, num, iq, jn, sgn, nj, is, isj, pt, ptj, cmp, par, ka, jw, put, coefText, rhs, std, genR, gen, stdL, genL,
    vtxOf, expand, aOf, QN, quadsOf, quadText, stdAns, genAns, axisVtx, vals, rows1, pairPick, fig, figOk, picks, span, bowl, stdClaims } = K9;
  const GL = nb(`${Y} = ${A}${X2} + ${BB}${X} + ${CC}`);
  // 이차함수의 식 「y = ax² + bx + c」를 정수 a, p, q 로 짓는다(b, c 는 0이 아니다).
  const genOf = (a, p, q) => { const [aa, b, c] = expand(a, p, q); return { a: aa.p, b: b.p, c: c.p }; };
  const hasZero = (g) => g.b === 0 || g.c === 0;
  // 식 속의 문자 항: 수 k 와 문자 글 v(계수 1 은 생략, 0 이면 빈 글)
  const term = (k, v, first) => (k === 0 ? '' : (first ? (k < 0 ? MINUS : '') : k < 0 ? ` ${MINUS} ` : ' + ') + (Math.abs(k) === 1 && v ? '' : Math.abs(k)) + v);
  // 두 수의 비를 가장 간단한 자연수의 비로
  const ratio = (x, y) => { const g = gcd(x, y); return [x / g, y / g]; };
  const ITALIC = "font-style:italic;font-family:'MB Math','Times New Roman',serif";

  // ── y = ax² + bx + c의 그래프 ──
  B.addGroup('9-1-6', {
    id: 'general', title: 'y = ax² + bx + c의 그래프', standard: S22,
    types: [
      T('general-steps', 'y = ax² + bx + c를 y = a(x − p)² + q 꼴로 고치는 과정의 빈칸', '①48', (d, n) => {
        const a = n === 0 ? 1 : pm(d) * d.int(2, 3), p = nz(d, -5, 5), q = d.until(() => nz(d, -9, 9), (v) => v + a * p * p !== 0), g = genOf(a, p, q), half = -p, t = p * p;
        const lead = a === 1 ? '' : iq(a), inner = `${X2} ${sgn(-2 * p)}${X}`, pad = '<span style="display:inline-block;width:1.6em"></span>';
        const rows = [
          `${Y} = ${genR(g.a, g.b, g.c)}`,
          a === 1 ? `${pad}= (${inner} + ㉠) ${MINUS} ㉠ ${sgn(g.c)}` : `${pad}= ${lead}(${inner} + ㉠ ${MINUS} ㉠) ${sgn(g.c)}`,
          `${pad}= ${lead}(${X} ${p > 0 ? MINUS : '+'} ㉡)${sup(2)} + ㉢`
        ];
        return M(`다음은 이차함수 ${jw(gen(g.a, g.b, g.c), '을/를')} ${stdL}의 꼴로 고치는 과정이다. ㉠, ㉡, ㉢에 알맞은 수는?`, [
          { label: '㉠', answer: t }, { label: '㉡', answer: Math.abs(p) }, { label: '㉢', answer: q, signed: true }
        ], {
          figure: lines(rows.map((r) => `<span class="mb-expr" style="font-size:1.1rem">${r}</span>`)),
          explain: `${a === 1 ? '' : `${iq(a)}${tail(Math.abs(a), '으로/로')} 묶으면 괄호 안은 ${nb(inner)}이다. `}${X}의 계수 ${iq(-2 * p)}의 절반 ${iq(half)}의 제곱 ${t}${tail(t, '을/를')} 더하고 뺀다. 식은 ${std(a, p, q)}이므로 ㉠ = ${t}, ㉡ = ${Math.abs(p)}, ㉢ = ${iq(q)}이다.`,
          facts: { calc: [[`(${jn(g.b)}/(2*${jn(a)}))*(${jn(g.b)}/(2*${jn(a)}))`, 0], [p > 0 ? `0-${jn(g.b)}/(2*${jn(a)})` : `${jn(g.b)}/(2*${jn(a)})`, 1], [`${jn(g.c)}-${jn(g.b)}*${jn(g.b)}/(4*${jn(a)})`, 2]], unseen: [0, 1, 2, 4], rule: 'gen-steps-' + n }
        });
      }, { count: 2 }),
      T('general-axis-vertex', 'y = ax² + bx + c의 그래프의 축·꼭짓점·y절편', '①49', (d) => {
        const g = d.until(() => { const a = pm(d) * d.int(1, 3), p = nz(d, -5, 5), q = nz(d, -8, 8); return Object.assign(genOf(a, p, q), { p, q }); }, (v) => !hasZero(v) && Math.abs(v.c) <= 60);
        return inline(`이차함수 ${gen(g.a, g.b, g.c)}의 그래프의 축의 방정식, 꼭짓점의 좌표, ${YI}을 각각 구하시오.`, `축의 방정식: ${X} = {0}<br>꼭짓점의 좌표: ({1}, {2})<br>${YI}: {3}`, [{ answer: g.p, signed: true }, { answer: g.p, signed: true }, { answer: g.q, signed: true }, { answer: g.c, signed: true }], {
          shown: `${is(X, g.p)}, ${pt(g.p, g.q)}, ${YI} ${iq(g.c)}`,
          explain: `${jw(gen(g.a, g.b, g.c), '을/를')} 고치면 ${std(g.a, g.p, g.q)}이다. 축의 방정식은 ${is(X, g.p)}, 꼭짓점의 좌표는 ${pt(g.p, g.q)}이고, ${isj(X, 0, '을/를')} 대입하면 ${YI}은 ${iq(g.c)}이다.`,
          facts: { calc: [[`0-${jn(g.b)}/(2*${jn(g.a)})`, 0], [`0-${jn(g.b)}/(2*${jn(g.a)})`, 1], [`${jn(g.c)}-${jn(g.b)}*${jn(g.b)}/(4*${jn(g.a)})`, 2], [jn(g.c), 3]], unseen: [0, 1, 4] }
        });
      }),
      T('general-vertex-frac', '꼭짓점의 좌표가 분수인 y = ax² + bx + c의 그래프', '①49', (d) => {
        // 보기: 바른 꼭짓점, x좌표의 부호를 바꾼 것, q 를 셈할 때 부호를 놓친 것, 둘 다 틀린 것
        const c = d.until(() => { const a = pm(d) * d.int(1, 3), b = nz(d, -9, 9), cc = nz(d, -9, 9), v = vtxOf(a, b, cc); return { a, b, cc, v }; }, (v) => !isInt(v.v.p) && v.v.q.p !== 0 && v.v.p.q <= 6 && Math.abs(fl(v.v.q)) < 30);
        const wrongQ = qadd(asQ(c.cc), qdiv(qmul(asQ(c.b), asQ(c.b)), qmul(Q(4), asQ(c.a))));
        const rows = d.shuffle([[c.v.p, c.v.q, true], [qneg(c.v.p), c.v.q, false], [c.v.p, wrongQ, false], [qneg(c.v.p), wrongQ, false]]);
        return C(`이차함수 ${gen(c.a, c.b, c.cc)}의 그래프의 꼭짓점의 좌표는?`, rows.map((r) => pt(r[0], r[1])), rows.findIndex((r) => r[2]), {
          explain: `${jw(gen(c.a, c.b, c.cc), '을/를')} 고치면 ${std(c.a, c.v.p, c.v.q)}이므로 꼭짓점의 좌표는 ${pt(c.v.p, c.v.q)}이다.`,
          facts: { truth: rows.map((r) => r[2]), want: true }
        });
      }),
      T('general-apq', 'y = ax² + bx + c를 y = a(x − p)² + q 꼴로 나타내기', '①50', (d) => {
        const g = d.until(() => { const a = pm(d) * d.int(1, 4), p = nz(d, -5, 5), q = nz(d, -8, 8); return Object.assign(genOf(a, p, q), { p, q }); }, (v) => !hasZero(v) && Math.abs(v.c) <= 80);
        return stdAns(`이차함수 ${jw(gen(g.a, g.b, g.c), '을/를')} ${stdL}의 꼴로 나타내시오.`, g.a, g.p, g.q, {
          explain: `${nb(`${Y} = ${iq(g.a)}(${X2} ${sgn(g.b / g.a)}${X}) ${sgn(g.c)}`)}에서 ${X}의 계수의 절반의 제곱 ${(g.b / g.a / 2) ** 2}${tail((g.b / g.a / 2) ** 2, '을/를')} 더하고 빼면 ${std(g.a, g.p, g.q)}이다.`,
          facts: { calc: [[jn(g.a), 0], [`${jn(g.b)}/(2*${jn(g.a)})`, 1], [`${jn(g.c)}-${jn(g.b)}*${jn(g.b)}/(4*${jn(g.a)})`, 2]], unseen: [1, 2, 4] }
        });
      }),
      T('general-pick-cond', '다섯 식을 고쳐 조건에 맞는 그래프 고르기', '①51', (d, n) => {
        // n = 0: 꼭짓점이 어느 사분면에, 1: 꼭짓점이 x축 위에, 2: 축이 가장 오른쪽에
        const want = d.int(0, 3);
        const mk = (cond) => d.until(() => { const a = pm(d) * d.int(1, 3), p = nz(d, -5, 5), q = nz(d, -8, 8); return Object.assign(genOf(a, p, q), { p, q }); }, (v) => !hasZero(v) && Math.abs(v.c) <= 50 && cond(v));
        const quad = (v) => (v.p > 0 ? (v.q > 0 ? 0 : 3) : (v.q > 0 ? 1 : 2));
        let rows, text, why;
        const distinctRows = (make) => d.until(make, (list) => new Set(list.map((r) => [r.a, r.b, r.c].join())).size === list.length);
        if (n === 0) {
          const others = d.shuffle([0, 1, 2, 3].filter((k) => k !== want)).concat([d.pick([0, 1, 2, 3].filter((k) => k !== want))]);
          rows = distinctRows(() => d.shuffle([mk((v) => quad(v) === want)].concat(others.map((k) => mk((v) => quad(v) === k))).map((v) => Object.assign(v, { ok: quad(v) === want }))));
          text = `다음 이차함수 중 그 그래프의 꼭짓점이 ${QN[want]}에 있는 것은?`;
          why = `${QN[want]}에 있는 꼭짓점은 ${X}좌표가 ${want === 0 || want === 3 ? '양수' : '음수'}, ${Y}좌표가 ${want < 2 ? '양수' : '음수'}이다.`;
        } else if (n === 1) {
          const zero = d.until(() => { const a = pm(d) * d.int(1, 3), p = nz(d, -5, 5); return Object.assign(genOf(a, p, 0), { p, q: 0 }); }, (v) => v.b !== 0 && v.c !== 0 && Math.abs(v.c) <= 50);
          rows = distinctRows(() => d.shuffle([Object.assign({}, zero, { ok: true })].concat([0, 1, 2, 3].map(() => Object.assign(mk(() => true), { ok: false })))));
          text = `다음 이차함수 중 그 그래프의 꼭짓점이 ${XA} 위에 있는 것은?`;
          why = `꼭짓점이 ${XA} 위에 있으려면 꼭짓점의 ${Y}좌표가 0이어야 한다.`;
        } else {
          const ps = d.shuffle([-4, -3, -2, -1, 1, 2, 3, 4, 5]).slice(0, 5), top = Math.max(...ps);
          rows = distinctRows(() => d.shuffle(ps.map((p) => Object.assign(d.until(() => { const a = pm(d) * d.int(1, 3), q = nz(d, -8, 8); return Object.assign(genOf(a, p, q), { p, q }); }, (v) => !hasZero(v) && Math.abs(v.c) <= 50), { ok: p === top }))));
          text = '다음 이차함수 중 그 그래프의 축이 가장 오른쪽에 있는 것은?';
          why = `축이 가장 오른쪽에 있는 것은 축의 방정식 ${is(X, P)}에서 ${P}가 가장 큰 것이다.`;
        }
        return C(text, rows.map((r) => gen(r.a, r.b, r.c)), rows.findIndex((r) => r.ok), {
          explain: `${why} 식을 고치면 ${rows.map((r) => std(r.a, r.p, r.q)).join(', ')}이므로 알맞은 것은 ${gen(rows.find((r) => r.ok).a, rows.find((r) => r.ok).b, rows.find((r) => r.ok).c)}이다.`,
          facts: { truth: rows.map((r) => r.ok), want: true, rule: 'gen-pick-' + n }
        });
      }, { count: 3 }),
      T('general-pick-graph', '식에 맞는 그래프 고르기', '①52', (d) => {
        // 보기: 바른 그래프, 꼭짓점의 x좌표의 부호를 바꾼 것, y좌표의 부호를 바꾼 것, 둘 다 바꾼 것. y절편은 모두 같다.
        const c = d.until(() => { const a = d.pick([Q(1, 2), Q(-1, 2), Q(1), Q(-1), Q(2), Q(-2), Q(1, 4), Q(-1, 4)]), p = pm(d) * a.q * d.int(1, 2), q = nz(d, -4, 4); const [aa, b, cc] = expand(a, p, q); return { a, p, q, b, cc }; }, (v) => isInt(v.b) && isInt(v.cc) && v.b.p !== 0 && v.cc.p !== 0 && v.cc.p !== v.q && v.cc.p !== -v.q && Math.abs(v.cc.p) <= 9 && Math.abs(v.p) <= 4
          && [[v.p, v.q], [-v.p, v.q], [v.p, -v.q], [-v.p, -v.q]].every(([h, k]) => { const a = (v.cc.p - k) / (h * h); return figOk({ small: true, x: span([h], 1.2), y: span([k, v.cc.p], 1.2), parabolas: [{ a, p: h, q: k }], points: [{ x: h, y: k, guide: true }, { x: 0, y: v.cc.p }], xnums: [{ v: h }], ynums: [{ v: k }, { v: v.cc.p }] }); }));
        const yi = c.cc.p, opts = [[c.p, c.q], [-c.p, c.q], [c.p, -c.q], [-c.p, -c.q]], order = d.shuffle([0, 1, 2, 3]);
        const miniO = (h, k, i) => { const a = (yi - k) / (h * h); return { small: true, name: LAB[i], x: span([h], 1.2), y: span([k, yi], 1.2), parabolas: [{ a, p: h, q: k }], points: [{ x: h, y: k, guide: true }, { x: 0, y: yi }], xnums: [{ v: h }], ynums: [{ v: k }, { v: yi }], say: `${bowl(a)} 포물선. 꼭짓점에서 두 축으로 점선을 그었다.` }; };
        const mini = (h, k, i) => fig(miniO(h, k, i));
        return C(`다음 ㉠~㉣ 가운데 이차함수 ${gen(c.a, c.b, c.cc)}의 그래프는?`, LAB.slice(0, 4), order.indexOf(0), {
          figure: picks(order.map((j, i) => mini(opts[j][0], opts[j][1], i))),
          explain: `${jw(gen(c.a, c.b, c.cc), '을/를')} 고치면 ${std(c.a, c.p, c.q)}이므로 꼭짓점의 좌표는 ${pt(c.p, c.q)}이고 ${YI}은 ${iq(yi)}이다.`,
          facts: { truth: order.map((j) => j === 0), want: true }
        });
      }),
      T('general-claims', 'y = ax² + bx + c의 그래프에 대한 설명', '①53', (d) => {
        const c = d.until(() => { const a = pm(d) * d.int(1, 3), p = nz(d, -4, 4), q = nz(d, -6, 6); return Object.assign(genOf(a, p, q), { aa: a, p, q }); }, (v) => !hasZero(v) && Math.abs(v.c) <= 50);
        const want = d.bool(), s = stdClaims(d, c.aa, c.p, c.q);
        // 꼴을 고쳐야 보이는 말: 이차함수 y = a(x − p)² + q의 그래프와 일치한다.
        s.yes.push(`이차함수 ${std(c.aa, c.p, c.q)}의 그래프와 일치한다.`);
        s.no.push([`이차함수 ${std(c.aa, -c.p, c.q)}의 그래프와 일치한다.`, `고치면 ${std(c.aa, c.p, c.q)}이다.`, s.yes[s.yes.length - 1]]);
        return claimQ(d, `이차함수 ${gen(c.a, c.b, c.c)}의 그래프에 대한 설명으로 ${want ? '옳은' : '옳지 않은'} 것은?`, s.yes, s.no, want);
      }),
      T('general-moved-expand', 'y = ax²을 옮긴 그래프의 식을 y = ax² + bx + c 꼴로', '①54', (d) => {
        const g = d.until(() => { const a = pm(d) * d.int(1, 3), p = nz(d, -4, 4), q = nz(d, -6, 6); return Object.assign(genOf(a, p, q), { p, q }); }, (v) => !hasZero(v) && Math.abs(v.c) <= 60);
        return genAns(`이차함수 ${std(g.a, 0, 0)}의 그래프를 ${XA}의 방향으로 ${iq(g.p)}만큼, ${YA}의 방향으로 ${iq(g.q)}만큼 평행이동한 그래프를 나타내는 이차함수의 식을 ${GL}의 꼴로 나타내시오.`, g.a, g.b, g.c, {
          explain: `평행이동한 그래프는 ${std(g.a, g.p, g.q)}의 그래프이다. 전개하면 ${gen(g.a, g.b, g.c)}이다.`,
          facts: { calc: [[jn(g.a), 0], [`0-2*${jn(g.a)}*${jn(g.p)}`, 1], [`${jn(g.a)}*${jn(g.p)}*${jn(g.p)}+${jn(g.q)}`, 2]], unseen: [0, 1] }
        });
      }),
      T('general-match-shift', 'y = ax² + bx + c의 그래프와 일치하도록 옮긴 양', '①55 심3', (d, n) => {
        const g = d.until(() => { const a = pm(d) * d.int(1, 3), p = nz(d, -4, 4), q = nz(d, -6, 6); return Object.assign(genOf(a, p, q), { p, q }); }, (v) => !hasZero(v) && Math.abs(v.c) <= 60);
        if (n === 0) {
          return vals(`이차함수 ${nb(`${Y} = ${A}${X2}`)}의 그래프를 ${XA}의 방향으로 ${MM}만큼, ${YA}의 방향으로 ${NN}만큼 평행이동하였더니 이차함수 ${gen(g.a, g.b, g.c)}의 그래프와 일치하였다. 수 ${A}, ${MM}, ${NN}의 값은?`, [[A, g.a], [MM, g.p], [NN, g.q]], {
            explain: `${jw(gen(g.a, g.b, g.c), '을/를')} 고치면 ${std(g.a, g.p, g.q)}이다. ${jw(nb(`${Y} = ${A}(${X} ${MINUS} ${MM})${sup(2)} + ${NN}`), '과/와')} 견주면 ${is(A, g.a)}, ${is(MM, g.p)}, ${is(NN, g.q)}이다.`,
            facts: { calc: [[jn(g.a), 0], [`0-${jn(g.b)}/(2*${jn(g.a)})`, 1], [`${jn(g.c)}-${jn(g.b)}*${jn(g.b)}/(4*${jn(g.a)})`, 2]], unseen: [0, 1, 4], rule: 'gen-match-0' }
          });
        }
        // 두 식 모두 y = ax² + bx + c 꼴: 둘 다 고쳐 꼭짓점끼리의 차
        const h = d.until(() => ({ p: nz(d, -4, 4), q: nz(d, -6, 6) }), (v) => v.p !== g.p && v.q !== g.q && !hasZero(genOf(g.a, v.p, v.q)) && Math.abs(genOf(g.a, v.p, v.q).c) <= 60), g2 = genOf(g.a, h.p, h.q);
        const shown2 = gen(g2.a, g2.b, g2.c);
        return vals(`이차함수 ${gen(g.a, g.b, g.c)}의 그래프를 ${XA}의 방향으로 ${MM}만큼, ${YA}의 방향으로 ${NN}만큼 평행이동하였더니 이차함수 ${shown2}의 그래프와 일치하였다. ${MM}, ${NN}의 값은?`, [[MM, h.p - g.p], [NN, h.q - g.q]], {
          explain: `${gen(g.a, g.b, g.c)}의 꼭짓점은 ${pt(g.p, g.q)}, ${shown2}의 꼭짓점은 ${pt(h.p, h.q)}이다. 꼭짓점이 옮겨 간 만큼이 옮긴 양이므로 ${is(MM, h.p - g.p)}, ${is(NN, h.q - g.q)}이다.`,
          facts: { calc: [[`0-${jn(g2.b)}/(2*${jn(g2.a)})+${jn(g.b)}/(2*${jn(g.a)})`, 0], [`${jn(g2.c)}-${jn(g2.b)}*${jn(g2.b)}/(4*${jn(g2.a)})-${jn(g.c)}+${jn(g.b)}*${jn(g.b)}/(4*${jn(g.a)})`, 1]], unseen: [0, 1, 2, 4], rule: 'gen-match-1' }
        });
      }, { count: 2 }),
      T('general-coef-compare', '계수가 빈 일반형과 옮긴 식 맞추기', '①56', (d) => {
        const { a, m, C0 } = d.until(() => { const a = pm(d) * d.int(2, 4), m = nz(d, -3, 3), cq = nz(d, -8, 8); return { a, m, C0: a * m * m + cq }; }, (v) => v.C0 !== 0), b = -2 * a * m;
        return vals(`이차함수 ${nb(`${Y} = ${iq(a)}${X2} + ${BB}${X} ${sgn(C0)}`)}의 그래프는 이차함수 ${nb(`${Y} = ${A}${X2}`)}의 그래프를 ${XA}의 방향으로 ${iq(m)}만큼, ${YA}의 방향으로 ${CC}만큼 평행이동한 것이다. 수 ${A}, ${BB}, ${CC}의 값은?`, [[A, a], [BB, b], [CC, C0 - a * m * m]], {
          explain: `옮긴 그래프는 ${nb(`${Y} = ${A}(${X} ${sgn(-m)})${sup(2)} + ${CC} = ${A}${X2} ${m > 0 ? MINUS : '+'} ${2 * Math.abs(m)}${A}${X} + ${m * m}${A} + ${CC}`)}이다. 계수를 견주면 ${is(A, a)}, ${nb(`${BB} = ${iq(-2 * m)} × ${par(a)} = ${iq(b)}`)}, ${nb(`${iq(C0)} = ${iq(a * m * m)} + ${CC}`)}에서 ${is(CC, C0 - a * m * m)}이다.`,
          facts: { calc: [[jn(a), 0], [`0-2*${jn(a)}*${jn(m)}`, 1], [`${jn(C0)}-${jn(a)}*${jn(m)}*${jn(m)}`, 2]], unseen: [0] }
        });
      })
    ]
  });

  // ── 계수에 문자가 든 이차함수 ──
  B.addGroup('9-1-6', {
    id: 'coef', title: '계수에 문자가 든 이차함수', standard: S22,
    types: [
      T('coef-point-vertex', '지나는 점으로 계수를 구해 꼭짓점 구하기', '①57', (d) => {
        const c = d.until(() => { const a = pm(d) * d.int(1, 2), p = nz(d, -4, 4), q = nz(d, -8, 8), g = genOf(a, p, q), x0 = nz(d, -3, 3); return Object.assign(g, { p, q, x0, y0: g.a * x0 * x0 + g.b * x0 + g.c }); }, (v) => !hasZero(v) && Math.abs(v.c) <= 40 && Math.abs(v.y0) <= 60);
        const lead = term(c.a, X2, true);
        return pointAns(`이차함수 ${nb(`${Y} = ${lead} + ${K}${X} ${sgn(c.c)}`)}의 그래프가 점 ${ptj(c.x0, c.y0, '을/를')} 지날 때, 이 그래프의 꼭짓점의 좌표는? (단, ${K}는 수이다.)`, c.p, c.q, {
          explain: `${put(c.x0, c.y0)} ${nb(`${iq(c.y0)} = ${iq(c.a * c.x0 * c.x0)} ${c.x0 < 0 ? MINUS : '+'} ${ka(Math.abs(c.x0), K)} ${sgn(c.c)}`)}, ${is(K, c.b)}이다. ${jw(gen(c.a, c.b, c.c), '을/를')} 고치면 ${std(c.a, c.p, c.q)}이므로 꼭짓점의 좌표는 ${pt(c.p, c.q)}이다.`,
          facts: { calc: [[`0-((${jn(c.y0)}-${jn(c.a)}*${jn(c.x0)}*${jn(c.x0)}-${jn(c.c)})/${jn(c.x0)})/(2*${jn(c.a)})`, 0], [`${jn(c.c)}-((${jn(c.y0)}-${jn(c.a)}*${jn(c.x0)}*${jn(c.x0)}-${jn(c.c)})/${jn(c.x0)})*((${jn(c.y0)}-${jn(c.a)}*${jn(c.x0)}*${jn(c.x0)}-${jn(c.c)})/${jn(c.x0)})/(4*${jn(c.a)})`, 1]], unseen: [0, 1, 2, 4] }
        });
      }),
      T('coef-axis', '축의 방정식으로 계수 구하기', '①58', (d) => {
        const lead = d.pick([Q(1, 2), Q(-1, 2), Q(1), Q(2), Q(-1), Q(3)]), p = nz(d, -6, 6), cc = nz(d, -9, 9), a = -2 * fl(lead) * p;
        return N(`이차함수 ${nb(`${Y} = ${coefText(lead)}${X2} + ${A}${X} ${sgn(cc)}`)}의 그래프의 축의 방정식이 ${is(X, p)}일 때, 수 ${A}의 값은?`, a, { signed: true,
          explain: `${nb(`${Y} = ${coefText(lead)}${X2} + ${A}${X} ${sgn(cc)}`)}의 축의 방정식은 ${nb(`${X} = ${MINUS}${frac(A, `2 × ${par(lead)}`)}`)}이다. ${nb(`${MINUS}${frac(A, `2 × ${par(lead)}`)} = ${iq(p)}`)}에서 ${is(A, a)}이다.`,
          facts: { value: `0-2*${jn(lead)}*${jn(p)}`, unseen: [0, 1, 2] }
        });
      }),
      T('coef-on-xaxis', '꼭짓점이 x축 위에 있을 때 계수 구하기', '①59 심4', (d, n) => {
        if (n === 0) {
          const a = pm(d) * d.int(1, 3), p = nz(d, -5, 5), b = -2 * a * p, k = a * p * p;
          return N(`이차함수 ${nb(`${Y} = ${term(a, X2, true)}${term(b, X)} + ${K}`)}의 그래프의 꼭짓점이 ${XA} 위에 있을 때, 수 ${K}의 값은?`, k, { signed: true,
            explain: `고치면 ${nb(`${Y} = ${rhs(a, p, 0)} + ${K} ${sgn(-k)}`)}이다. 꼭짓점이 ${XA} 위에 있으면 꼭짓점의 ${Y}좌표가 0이므로 ${nb(`${K} ${sgn(-k)} = 0`)}, ${is(K, k)}이다.`,
            facts: { value: `${jn(b)}*${jn(b)}/(4*${jn(a)})`, unseen: [1, 4], rule: 'coef-x-0' }
          });
        }
        // y = x² − 2tkx + (t² + u)k² + vk: 꼭짓점 (tk, uk² + vk)
        const t = pm(d) * d.int(1, 3), u = pm(d), v = nz(d, -5, 5), k2 = -v / u;
        const text = `${X2}${term(-2 * t, K + X)}${term(t * t + u, K + sup(2))}${term(v, K)}`;
        return inline(`이차함수 ${nb(`${Y} = ${text}`)}의 그래프의 꼭짓점이 ${XA} 위에 있을 때, 수 ${K}의 값을 모두 구하시오.`, `${K} = {0} 또는 ${K} = {1}`, [{ answer: 0, signed: true }, { answer: k2, signed: true }], {
          unordered: true, shown: `${is(K, 0)} 또는 ${is(K, k2)}`,
          explain: `고치면 ${nb(`${Y} = (${X} ${t > 0 ? MINUS : '+'} ${ka(Math.abs(t), K)})${sup(2)}${term(u, K + sup(2))}${term(v, K)}`)}이므로 꼭짓점의 ${Y}좌표는 ${nb(`${term(u, K + sup(2), true)}${term(v, K)}`)}이다. ${nb(`${term(u, K + sup(2), true)}${term(v, K)} = 0`)}에서 ${is(K, 0)} 또는 ${is(K, k2)}이다.`,
          facts: { calc: [['0', 0], [`(0-${jn(v)})/(${jn(t * t + u)}-${jn(t)}*${jn(t)})`, 1]], unseen: [0, 1, Math.abs(t)], rule: 'coef-x-1' }
        });
      }, { count: 2 }),
      T('coef-on-line', '꼭짓점이 직선 위에 있을 때 계수 구하기', '①60', (d) => {
        const c = d.until(() => { const a = pm(d) * d.int(1, 2), p = nz(d, -4, 4), s = nz(d, -3, 3), t = nz(d, -8, 8); const b = -2 * a * p, q = s * p + t, m = q + a * p * p; return { a, p, s, t, b, q, m }; }, (v) => v.m !== 0 && Math.abs(v.m) <= 40);
        return N(`이차함수 ${nb(`${Y} = ${term(c.a, X2, true)}${term(c.b, X)} + ${MM}`)}의 그래프의 꼭짓점이 직선 ${nb(`${Y} = ${term(c.s, X, true)} ${sgn(c.t)}`)} 위에 있을 때, 수 ${MM}의 값은?`, c.m, { signed: true,
          explain: `고치면 ${nb(`${Y} = ${rhs(c.a, c.p, 0)} + ${MM} ${sgn(-c.a * c.p * c.p)}`)}이므로 꼭짓점의 좌표는 ${pt(c.p, nb(`${MM} ${sgn(-c.a * c.p * c.p)}`))}이다. 이 점이 직선 위에 있으므로 ${nb(`${MM} ${sgn(-c.a * c.p * c.p)} = ${iq(c.s * c.p + c.t)}`)}, ${is(MM, c.m)}이다.`,
          facts: { value: `${jn(c.s)}*(0-${jn(c.b)})/(2*${jn(c.a)})+${jn(c.t)}+${jn(c.b)}*${jn(c.b)}/(4*${jn(c.a)})`, unseen: [0, 1, 2, 4] }
        });
      }),
      T('coef-same-vertex', '두 그래프의 꼭짓점이 일치할 때 계수 구하기', '①61', (d, n) => {
        const g = d.until(() => { const a = pm(d) * d.int(1, 3), p = nz(d, -4, 4), q = nz(d, -6, 6); return Object.assign(genOf(a, p, q), { p, q }); }, (v) => !hasZero(v) && Math.abs(v.c) <= 50);
        if (n === 0) {
          // 한 식에 a, b 가 모두 있다: y = kx² + ax + b
          const k = d.until(() => pm(d) * d.int(1, 3), (v) => v !== g.a), a = -2 * k * g.p, b = k * g.p * g.p + g.q;
          return vals(`두 이차함수 ${nb(`${Y} = ${term(k, X2, true)} + ${A}${X} + ${BB}`)}, ${gen(g.a, g.b, g.c)}의 그래프의 꼭짓점이 일치할 때, 수 ${A}, ${BB}의 값은?`, [[A, a], [BB, b]], {
            explain: `${jw(gen(g.a, g.b, g.c), '을/를')} 고치면 ${std(g.a, g.p, g.q)}이므로 꼭짓점은 ${pt(g.p, g.q)}이다. 앞 그래프는 ${std(k, g.p, g.q)}의 그래프이므로 전개하면 ${gen(k, a, b)}, ${is(A, a)}, ${is(BB, b)}이다.`,
            facts: { calc: [[`0-2*${jn(k)}*(0-${jn(g.b)}/(2*${jn(g.a)}))`, 0], [`${jn(k)}*(${jn(g.b)}/(2*${jn(g.a)}))*(${jn(g.b)}/(2*${jn(g.a)}))+${jn(g.c)}-${jn(g.b)}*${jn(g.b)}/(4*${jn(g.a)})`, 1]], unseen: [0, 1, 2, 4], rule: 'coef-same-0' }
          });
        }
        // 한 식에 a(일차항), 다른 식에 b(상수항): y = kx² − 2kax + c1, y = (g) 꼴인데 상수항이 b + r
        const { k, c1 } = d.until(() => { const k = pm(d) * d.int(1, 2); return { k, c1: k * g.p * g.p + g.q }; }, (v) => v.k !== g.a && v.c1 !== 0), r = d.until(() => nz(d, -6, 6), (v) => v !== g.c), b = g.c - r;
        return vals(`두 이차함수 ${nb(`${Y} = ${term(k, X2, true)}${term(-2 * k, A + X)} ${sgn(c1)}`)}, ${nb(`${Y} = ${term(g.a, X2, true)}${term(g.b, X)} + ${BB} ${sgn(r)}`)}의 그래프의 꼭짓점이 일치할 때, 수 ${A}, ${BB}의 값은?`, [[A, g.p], [BB, b]], {
          explain: `앞 식을 고치면 ${nb(`${Y} = ${coefText(k)}(${X} ${MINUS} ${A})${sup(2)}${term(-k, A + sup(2))} ${sgn(c1)}`)}이므로 꼭짓점의 ${X}좌표는 ${A}이다. 뒤 식의 꼭짓점의 ${X}좌표는 ${iq(g.p)}이므로 ${is(A, g.p)}이고, 두 꼭짓점의 ${Y}좌표는 ${iq(g.q)}이다. 뒤 식의 꼭짓점의 ${Y}좌표 ${nb(`${BB} ${sgn(r)} ${sgn(-g.a * g.p * g.p)}`)}${tail(Math.abs(g.a * g.p * g.p), '이/가')} ${iq(g.q)}이므로 ${is(BB, b)}이다.`,
          facts: { calc: [[`0-${jn(g.b)}/(2*${jn(g.a)})`, 0], [`${jn(c1)}-${jn(k)}*(${jn(g.b)}/(2*${jn(g.a)}))*(${jn(g.b)}/(2*${jn(g.a)}))+${jn(g.b)}*${jn(g.b)}/(4*${jn(g.a)})-${jn(r)}`, 1]], unseen: [0, 1, 2, 4], rule: 'coef-same-1' }
        });
      }, { count: 2 }),
      T('coef-yint', '꼭짓점과 이차항의 계수로 y절편 구하기', '①62', (d) => {
        const a = pm(d) * d.int(1, 3), p = nz(d, -4, 4), q = nz(d, -6, 6), c = a * p * p + q;
        return N(`이차함수 ${nb(`${Y} = ${term(a, X2, true)} + ${BB}${X} + ${CC}`)}의 그래프의 꼭짓점의 좌표가 ${pt(p, q)}일 때, 이 그래프의 ${YI}은? (단, ${BB}, ${CC}는 수이다.)`, c, { signed: true,
          explain: `${X2}의 계수가 ${iq(a)}이고 꼭짓점이 ${pt(p, q)}이므로 식은 ${std(a, p, q)}이다. ${isj(X, 0, '을/를')} 대입하면 ${YI}은 ${nb(`${iq(a)} × ${par(-p)}${sup(2)} ${sgn(q)} = ${iq(c)}`)}이다.`,
          facts: { value: `${jn(a)}*${jn(p)}*${jn(p)}+${jn(q)}`, unseen: [1] }
        });
      }),
      T('coef-bc-in-a', '꼭짓점이 주어질 때 b, c를 a에 대한 식으로', '①63', (d) => {
        const p = nz(d, -5, 5), q = nz(d, -8, 8);
        return inline(`이차함수 ${GL}의 그래프의 꼭짓점의 좌표가 ${pt(p, q)}일 때, ${BB}와 ${CC}를 각각 ${A}에 대한 식으로 나타내시오.`, `${BB} = {0}${A}<br>${CC} = {1}${A} {2}`, [{ answer: -2 * p, signed: true }, { answer: p * p, signed: true }, { answer: q, signed: true }], {
          shown: `${nb(`${BB} = ${ka(-2 * p, A)}`)}, ${nb(`${CC} = ${ka(p * p, A)} ${sgn(q)}`)}`,
          explain: `꼭짓점이 ${pt(p, q)}이므로 ${nb(`${Y} = ${A}(${X} ${sgn(-p)})${sup(2)} ${sgn(q)} = ${A}${X2} ${p > 0 ? MINUS : '+'} ${ka(2 * Math.abs(p), A)}${X} + ${ka(p * p, A)} ${sgn(q)}`)}이다. 계수를 견주면 ${nb(`${BB} = ${ka(-2 * p, A)}`)}, ${nb(`${CC} = ${ka(p * p, A)} ${sgn(q)}`)}이다.`,
          facts: { calc: [[`0-2*${jn(p)}`, 0], [`${jn(p)}*${jn(p)}`, 1], [jn(q), 2]], unseen: [0, 2] }
        });
      })
    ]
  });

  // ── 축과 만나는 점과 넓이 ──
  // 두 근이 정수인 이차함수: a(x − r1)(x − r2)
  const rootsOf = (d, o) => d.until(() => { const a = pm(d) * d.int(1, (o && o.amax) || 2), r1 = nz(d, -6, 6), r2 = nz(d, -6, 6); const g = { a, b: -a * (r1 + r2), c: a * r1 * r2 }; return Object.assign(g, { r1: Math.min(r1, r2), r2: Math.max(r1, r2), v: vtxOf(g.a, g.b, g.c) }); },
    (g) => g.r1 !== g.r2 && g.b !== 0 && (!o || !o.ok || o.ok(g)));
  // 근이 든 그림: 포물선과 점 이름(이름만, 수는 적지 않는다)
  function namedFig(g, pts, more) {
    const xs = [g.r1, g.r2, fl(g.v.p)].concat(pts.map((p) => p[0])), ys = [fl(g.v.q), g.c].concat(pts.map((p) => p[1]));
    return Object.assign({ x: span(xs, 1.2), y: span(ys, 1.2), parabolas: [{ a: g.a, p: g.v.p, q: g.v.q }], points: pts.map(([x, y, name, side]) => ({ x, y, name, side })) }, more || {});
  }
  B.addGroup('9-1-6', {
    id: 'axes', title: '축과 만나는 점과 넓이', standard: S22,
    types: [
      T('axes-intercepts', 'x축·y축과 만나는 점의 좌표', '①65', (d) => {
        const g = rootsOf(d, { ok: (v) => v.c !== 0 && Math.abs(v.c) <= 40 });
        return inline(`이차함수 ${gen(g.a, g.b, g.c)}의 그래프가 ${XA}과 만나는 두 점의 좌표와 ${YA}과 만나는 점의 좌표를 구하시오.`, `${XA}: ({0}, 0), ({1}, 0)<br>${YA}: (0, {2})`, [{ answer: g.r1, signed: true }, { answer: g.r2, signed: true }, { answer: g.c, signed: true }], {
          blocks: [[0], [1]], shown: `${pt(g.r1, 0)}, ${pt(g.r2, 0)}, ${pt(0, g.c)}`,
          explain: `${isj(Y, 0, '을/를')} 대입하면 ${nb(`${genR(g.a, g.b, g.c)} = 0`)}, ${nb(`${coefText(g.a)}(${X} ${sgn(-g.r1)})(${X} ${sgn(-g.r2)}) = 0`)}에서 ${is(X, g.r1)} 또는 ${is(X, g.r2)}이다. ${isj(X, 0, '을/를')} 대입하면 ${is(Y, g.c)}이다.`,
          facts: { calc: [[jn(g.r1), 0], [jn(g.r2), 1], [jn(g.c), 2]], unseen: [Math.abs(g.r1), Math.abs(g.r2)] }
        });
      }),
      T('axes-distance', 'x축과 만나는 두 점 사이의 거리', '①66', (d) => {
        const g = rootsOf(d, { ok: (v) => v.c !== 0 && Math.abs(v.c) <= 40 }), L = g.r2 - g.r1;
        return N(`이차함수 ${gen(g.a, g.b, g.c)}의 그래프가 ${XA}과 만나는 두 점을 A, B라 할 때, 선분 AB의 길이는?`, L, {
          explain: `${isj(Y, 0, '을/를')} 대입하면 ${nb(`${coefText(g.a)}(${X} ${sgn(-g.r1)})(${X} ${sgn(-g.r2)}) = 0`)}에서 ${is(X, g.r1)} 또는 ${is(X, g.r2)}이다. 선분 AB의 길이는 ${nb(`${iq(g.r2)} − ${par(g.r1)} = ${L}`)}이다.`,
          facts: { value: `${jn(g.r2)}-${jn(g.r1)}`, unseen: [Math.abs(g.r1), Math.abs(g.r2)] }
        });
      }),
      T('axes-distance-coef', '축과 두 교점 사이의 거리로 계수 구하기', '①67 심14', (d) => {
        const { lead, p, h } = d.until(() => ({ lead: d.pick([1, 1, 2, -1]), p: nz(d, -4, 4), h: d.int(1, 4) }), (v) => v.p * v.p !== v.h * v.h), a = -lead * p, b = lead * (p * p - h * h);
        return vals(`이차함수 ${nb(`${Y} = ${term(lead, X2, true)} + 2${A}${X} + ${BB}`)}의 그래프의 축의 방정식은 ${is(X, p)}이고, 그래프가 ${XA}과 만나는 두 점 사이의 거리는 ${2 * h}이다. 수 ${A}, ${BB}의 값은?`, [[A, a], [BB, b]], {
          explain: `${XA}과 만나는 두 점은 축 ${is(X, p)}에 대칭이므로 축에서 ${h}씩 떨어진 ${pt(p - h, 0)}, ${pt(p + h, 0)}이다. 축의 방정식 ${nb(`${X} = ${MINUS}${frac(`2${A}`, `2 × ${par(lead)}`)}`)}에서 ${is(A, a)}이고, ${nb(`${Y} = ${coefText(lead)}(${X} ${sgn(-(p - h))})(${X} ${sgn(-(p + h))})`)}의 상수항에서 ${is(BB, b)}이다.`,
          facts: { calc: [[`0-${jn(lead)}*${jn(p)}`, 0], [`${jn(lead)}*(${jn(p)}*${jn(p)}-${2 * h}*${2 * h}/4)`, 1]], unseen: [0, 1, 4] }
        });
      }),
      T('axes-tri-yint', 'x축과의 두 교점과 y축과의 교점으로 만든 삼각형', '①68', (d) => {
        const g = rootsOf(d, { ok: (v) => v.c !== 0 && Math.abs(v.c) <= 24 && ((v.r2 - v.r1) * Math.abs(v.c)) % 2 === 0 && v.r1 !== 0 && v.r2 !== 0 });
        const area = (g.r2 - g.r1) * Math.abs(g.c) / 2, o = namedFig(g, [[0, g.c, 'A'], [g.r1, 0, 'B'], [g.r2, 0, 'C']], { shade: [[0, g.c], [g.r1, 0], [g.r2, 0]], segs: [[0, g.c, g.r1, 0], [0, g.c, g.r2, 0]], say: `${bowl(g.a)} 포물선. y축과 만나는 점 A, x축과 만나는 두 점 B, C를 이은 삼각형 ABC를 색칠하였다.` });
        return N(`그림과 같이 이차함수 ${gen(g.a, g.b, g.c)}의 그래프가 ${YA}과 만나는 점을 A, ${XA}과 만나는 두 점을 B, C라 할 때, 삼각형 ABC의 넓이는?`, area, {
          figure: fig(o),
          explain: `${XA}과 만나는 점은 ${pt(g.r1, 0)}, ${pt(g.r2, 0)}이고 ${YA}과 만나는 점은 ${pt(0, g.c)}이다. 밑변의 길이 ${g.r2 - g.r1}, 높이 ${Math.abs(g.c)}이므로 넓이는 ${nb(`${frac(1, 2)} × ${g.r2 - g.r1} × ${Math.abs(g.c)} = ${area}`)}이다.`,
          facts: { value: `(${jn(g.r2)}-${jn(g.r1)})*${Math.abs(g.c)}/2`, unseen: [Math.abs(g.r1), Math.abs(g.r2), 2] }
        });
      }),
      T('axes-tri-vertex', '꼭짓점과 x축과의 두 교점으로 만든 삼각형', '①69 심18', (d, n) => {
        if (n === 0) {
          // y = kx² + ax 가 x축 위의 점 A(r, 0)을 지난다 → a, 꼭짓점 P → 삼각형 OPA
          const c = d.until(() => { const k = d.pick([Q(1, 2), Q(-1, 2), Q(1), Q(-1), Q(2)]), r = pm(d) * 2 * d.int(1, 3); return { k, r, a: -fl(k) * r, area: Math.abs(fl(k)) * Math.abs(r) ** 3 / 8 }; }, (v) => Number.isInteger(v.a) && Number.isInteger(v.area) && v.area <= 200);
          const P0 = c.r / 2, Pq = -fl(c.k) * c.r * c.r / 4;
          return N(`이차함수 ${nb(`${Y} = ${coefText(c.k)}${X2} + ${A}${X}`)}의 그래프가 ${XA} 위의 점 A${jw(pt(c.r, 0), '을/를')} 지난다. 이 그래프의 꼭짓점을 P, 원점을 O라 할 때, 삼각형 OPA의 넓이는? (단, ${A}는 수이다.)`, c.area, {
            explain: `점 A의 좌표를 대입하면 ${nb(`0 = ${iq(qmul(c.k, Q(c.r * c.r)))} ${c.r < 0 ? MINUS : '+'} ${ka(Math.abs(c.r), A)}`)}, ${is(A, c.a)}이다. ${nb(`${Y} = ${rhs(c.k, P0, Pq)}`)}이므로 P${pt(P0, Pq)}이다. 넓이는 ${nb(`${frac(1, 2)} × ${Math.abs(c.r)} × ${Math.abs(Pq)} = ${c.area}`)}이다.`,
            facts: { value: `${Math.abs(c.r)}*${Math.abs(c.r)}*${Math.abs(c.r)}*${c.k.p * Math.sign(c.k.p)}/(8*${c.k.q})`, unseen: [Math.abs(c.r), 8, 1, 2], rule: 'tri-v-0' }
          });
        }
        // 그림: y = ±x² + ax + b, x축과의 교점 B, C와 y축과의 교점이 적혀 있다 → 꼭짓점 A. 두 근의 차가 짝수이면 꼭짓점이 정수이다.
        const lead = pm(d), c = d.until(() => { const r1 = d.int(-4, -2), r2 = d.int(2, 8); const g = { a: lead, b: -lead * (r1 + r2), c: lead * r1 * r2, r1, r2 }; g.v = vtxOf(g.a, g.b, g.c); return g; }, (g) => g.b !== 0 && (g.r2 - g.r1) % 2 === 0 && Math.abs(fl(g.v.q)) <= 20);
        const vp = fl(c.v.p), vq = fl(c.v.q), area = (c.r2 - c.r1) * Math.abs(vq) / 2;
        const o = namedFig(c, [[vp, vq, 'A', vq > 0 ? 'u' : 'd'], [c.r1, 0, 'B'], [c.r2, 0, 'C'], [0, c.c]], { xnums: [{ v: c.r1 }, { v: c.r2 }], ynums: [{ v: c.c }], shade: [[vp, vq], [c.r1, 0], [c.r2, 0]], segs: [[vp, vq, c.r1, 0], [vp, vq, c.r2, 0]], say: `${bowl(c.a)} 포물선. 꼭짓점 A와 x축과 만나는 두 점 B, C를 이은 삼각형 ABC를 색칠하였다. y축과 만나는 점에 점을 찍었다.` });
        return N(`그림은 이차함수 ${nb(`${Y} = ${lead < 0 ? MINUS : ''}${X2} + ${A}${X} + ${BB}`)}의 그래프이다. 점 A가 이 그래프의 꼭짓점일 때, 삼각형 ABC의 넓이는? (단, ${A}, ${BB}는 수이다.)`, area, {
          figure: fig(o),
          explain: `그래프가 점 ${jw(pt(0, c.c), '을/를')} 지나므로 ${is(BB, c.c)}이고, 점 ${jw(pt(c.r1, 0), '을/를')} 지나므로 ${is(A, c.b)}이다. ${jw(gen(c.a, c.b, c.c), '을/를')} 고치면 ${std(c.a, c.v.p, c.v.q)}이므로 A${pt(vp, vq)}이다. 넓이는 ${nb(`${frac(1, 2)} × ${c.r2 - c.r1} × ${Math.abs(vq)} = ${area}`)}이다.`,
          facts: { value: `(${jn(c.r2)}-${jn(c.r1)})*(${jn(c.r2)}-${jn(c.r1)})*(${jn(c.r2)}-${jn(c.r1)})/8`, unseen: [8], rule: 'tri-v-1' }
        });
      }, { count: 2 }),
      T('axes-tri-origin', '꼭짓점·y축과의 교점·원점으로 만든 삼각형', '①70', (d, n) => {
        const g = d.until(() => { const a = pm(d) * d.int(1, 2), p = nz(d, -4, 4), q = nz(d, -6, 6); return Object.assign(genOf(a, p, q), { p, q }); }, (v) => !hasZero(v) && (Math.abs(v.c * v.p)) % 2 === 0 && Math.abs(v.c) <= 30);
        const area = Math.abs(g.c * g.p) / 2;
        if (n === 0) {
          const o = { x: span([g.p], 1.4), y: span([g.q, g.c], 1.4), parabolas: [{ a: g.a, p: g.p, q: g.q }], points: [{ x: g.p, y: g.q, name: 'A' }, { x: 0, y: g.c, name: 'B' }], shade: [[0, 0], [g.p, g.q], [0, g.c]], segs: [[0, 0, g.p, g.q], [g.p, g.q, 0, g.c]], say: `${bowl(g.a)} 포물선. 꼭짓점 A, y축과 만나는 점 B, 원점 O를 이은 삼각형 ABO를 색칠하였다.` };
          return N(`그림과 같이 이차함수 ${gen(g.a, g.b, g.c)}의 그래프의 꼭짓점을 A, 그래프와 ${YA}의 교점을 B, 원점을 O라 할 때, 삼각형 ABO의 넓이는?`, area, {
            figure: fig(o),
            explain: `${jw(gen(g.a, g.b, g.c), '을/를')} 고치면 ${std(g.a, g.p, g.q)}이므로 A${pt(g.p, g.q)}, B${pt(0, g.c)}이다. 밑변 OB의 길이 ${Math.abs(g.c)}, 높이는 점 A에서 ${YA}까지의 거리 ${Math.abs(g.p)}이므로 넓이는 ${nb(`${frac(1, 2)} × ${Math.abs(g.c)} × ${Math.abs(g.p)} = ${area}`)}이다.`,
            facts: { value: `${Math.abs(g.c)}*${Math.abs(g.b)}/(2*${Math.abs(g.a)})/2`, unseen: [1, 2], rule: 'tri-o-0' }
          });
        }
        // 거꾸로: 넓이가 주어질 때 상수항 (y = kx² + bx + a, k < 0, a > 0)
        const c = d.until(() => { const k = -d.pick([1, 2]), p = nz(d, -3, 3), a = d.int(1, 8); return { k, p, a, b2: -2 * k * p, S: a * Math.abs(p) / 2 }; }, (v) => Number.isInteger(v.S));
        const vy = c.a - c.k * c.p * c.p;
        const o = { x: span([c.p], 1.4), y: span([c.a, vy], 1.4), parabolas: [{ a: c.k, p: c.p, q: vy }], points: [{ x: 0, y: c.a, name: 'A' }, { x: c.p, y: vy, name: 'B' }], shade: [[0, 0], [0, c.a], [c.p, vy]], segs: [[0, 0, c.p, vy], [0, c.a, c.p, vy]], say: '위로 볼록한 포물선. y축과 만나는 점 A, 꼭짓점 B, 원점 O를 이은 삼각형 OAB를 색칠하였다. 점 A는 원점보다 위에 있다.' };
        return N(`그림과 같이 이차함수 ${nb(`${Y} = ${term(c.k, X2, true)}${term(c.b2, X)} + ${A}`)}의 그래프가 ${YA}과 만나는 점을 A, 꼭짓점을 B라 하자. 삼각형 OAB의 넓이가 ${c.S}일 때, 수 ${A}의 값은? (단, O는 원점이고 ${cmp(A, GT)}이다.)`, c.a, { signed: true,
          figure: fig(o),
          explain: `A${pt(0, A)}이고, 꼭짓점 B의 ${X}좌표는 ${nb(`${MINUS}${frac(iq(c.b2), `2 × ${par(c.k)}`)} = ${iq(c.p)}`)}이다. 밑변 OA의 길이 ${A}, 높이 ${Math.abs(c.p)}이므로 ${nb(`${frac(1, 2)} × ${A} × ${Math.abs(c.p)} = ${c.S}`)}, ${is(A, c.a)}이다.`,
          facts: { value: `2*${c.S}/(${Math.abs(c.b2)}/(2*${Math.abs(c.k)}))`, unseen: [1, 2], rule: 'tri-o-1' }
        });
      }, { count: 2 }),
      T('axes-two-parabola-area', '옮긴 두 포물선 사이의 넓이', '①71 심16', (d, n) => {
        // y = a(x − p)² + q 와 그것을 x축 방향으로 m 만큼 옮긴 것. x축과 두 꼭짓점의 높이 사이, 두 포물선의 왼쪽 가지 사이의 넓이 = m × |q|
        const c = d.until(() => { const a = pm(d), p = d.int(-2, 2), q = (a < 0 ? 1 : -1) * d.pick([4, 9]), m = d.int(2, 5); const r = Math.sqrt(-q / a); return { a, p, q, m, r }; }, (v) => Number.isInteger(v.r) && v.p - v.r >= -4 && v.p + v.m + v.r <= 9);
        const g1 = genOf(c.a, c.p, c.q), g2 = genOf(c.a, c.p + c.m, c.q), L = c.p - c.r, area = c.m * Math.abs(c.q);
        const f = (x, h) => c.a * (x - h) ** 2 + c.q, arc = (h, from, to) => Array.from({ length: 25 }, (_, i) => { const x = from + (to - from) * i / 24; return [x, f(x, h)]; });
        const shade = arc(c.p, L, c.p).concat(arc(c.p + c.m, c.p + c.m, L + c.m)).concat([[L, 0]]);
        const o = { x: [Math.min(-1, Math.floor(L - 1)), Math.ceil(c.p + c.m + c.r + 1)], y: c.a < 0 ? [-2, Math.abs(c.q) + 2] : [-(Math.abs(c.q) + 2), 2], parabolas: [{ a: c.a, p: c.p, q: c.q }, { a: c.a, p: c.p + c.m, q: c.q }], shade, segs: [[c.p, c.q, c.p + c.m, c.q]], points: [{ x: c.p, y: c.q, name: 'P', side: c.a < 0 ? 'u' : 'd' }, { x: c.p + c.m, y: c.q, name: 'Q', side: c.a < 0 ? 'u' : 'd' }], say: `${bowl(c.a)} 두 포물선과 두 꼭짓점 P, Q를 이은 선분. x축, 두 포물선의 왼쪽 부분, 선분 PQ로 둘러싸인 부분을 색칠하였다.` };
        if (n === 0) {
          return N(`그림은 두 이차함수 ${gen(g1.a, g1.b, g1.c)}, ${gen(g2.a, g2.b, g2.c)}의 그래프이다. 두 점 P, Q가 각 그래프의 꼭짓점일 때, 색칠한 부분의 넓이는?`, area, {
            figure: fig(o),
            explain: `두 식을 ${std(c.a, c.p, c.q)}, ${std(c.a, c.p + c.m, c.q)}의 꼴로 고치면 P${pt(c.p, c.q)}, Q${pt(c.p + c.m, c.q)}이다. 뒤 그래프는 앞 그래프를 ${XA}의 방향으로 ${c.m}만큼 옮긴 것이므로 색칠한 부분의 넓이는 가로 ${c.m}, 세로 ${Math.abs(c.q)}인 직사각형의 넓이와 같은 ${area}이다.`,
            facts: { value: `(0-${jn(g2.b)}/(2*${jn(g2.a)})+${jn(g1.b)}/(2*${jn(g1.a)}))*${Math.abs(c.q)}`, unseen: [0, 1, 2, Math.abs(c.q)], rule: 'two-p-0' }
          });
        }
        return N(`그림은 이차함수 ${gen(g1.a, g1.b, g1.c)}의 그래프와 그것을 ${XA}의 방향으로 ${MM}만큼 평행이동한 그래프이다. 두 점 P, Q가 각 그래프의 꼭짓점이고 색칠한 부분의 넓이가 ${area}일 때, ${MM}의 값은? (단, ${cmp(MM, GT)}이다.)`, c.m, {
          figure: fig(o),
          explain: `${c.p === 0 ? `${gen(g1.a, g1.b, g1.c)}의 꼭짓점은 ${pt(0, c.q)}` : `${jw(gen(g1.a, g1.b, g1.c), '을/를')} 고치면 ${std(c.a, c.p, c.q)}이므로 꼭짓점의 ${Y}좌표는 ${iq(c.q)}`}이다. 색칠한 부분의 넓이는 가로 ${MM}, 세로 ${Math.abs(c.q)}인 직사각형의 넓이와 같으므로 ${nb(`${Math.abs(c.q)}${MM} = ${area}`)}, ${is(MM, c.m)}이다.`,
          facts: { value: `${area}/${Math.abs(c.q)}`, unseen: [Math.abs(c.q)], rule: 'two-p-1' }
        });
      }, { count: 2 }),
      T('axes-ratio', '밑변이 같은 두 삼각형의 넓이의 비', '심17', (d) => {
        const g = rootsOf(d, { ok: (v) => v.c !== 0 && isInt(v.v.q) && v.v.q.p !== v.c && Math.abs(v.c) <= 20 && Math.abs(v.v.q.p) <= 20 && Math.sign(v.v.q.p) === Math.sign(v.c) });
        const [u, w] = ratio(Math.abs(g.c), Math.abs(g.v.q.p));
        const o = namedFig(g, [[g.r1, 0, 'A'], [g.r2, 0, 'B'], [0, g.c, 'C'], [fl(g.v.p), fl(g.v.q), 'D']], { segs: [[g.r1, 0, 0, g.c], [g.r2, 0, 0, g.c], [g.r1, 0, fl(g.v.p), fl(g.v.q)], [g.r2, 0, fl(g.v.p), fl(g.v.q)]], say: `${bowl(g.a)} 포물선. x축과 만나는 두 점 A, B, y축과 만나는 점 C, 꼭짓점 D가 있고, 삼각형 ABC와 삼각형 ABD를 그렸다.` });
        return inline(`그림과 같이 이차함수 ${gen(g.a, g.b, g.c)}의 그래프가 ${XA}과 만나는 두 점을 A, B, ${YA}과 만나는 점을 C, 꼭짓점을 D라 할 때, 삼각형 ABC와 삼각형 ABD의 넓이의 비를 가장 간단한 자연수의 비로 나타내시오.`, '△ABC : △ABD = {0} : {1}', [{ answer: u }, { answer: w }], {
          shown: `${u} : ${w}`, figure: fig(o),
          explain: `C${pt(0, g.c)}, D${pt(g.v.p, g.v.q)}이다. 두 삼각형은 밑변 AB가 같으므로 넓이의 비는 높이의 비 ${Math.abs(g.c)} : ${Math.abs(g.v.q.p)}${u === Math.abs(g.c) ? '' : ` = ${u} : ${w}`}이다.`,
          facts: { calc: [[`${Math.abs(g.c)}/${gcd(Math.abs(g.c), Math.abs(g.v.q.p))}`, 0], [`${Math.abs(g.v.q.p)}/${gcd(Math.abs(g.c), Math.abs(g.v.q.p))}`, 1]], unseen: [Math.abs(g.c), Math.abs(g.v.q.p), gcd(Math.abs(g.c), Math.abs(g.v.q.p))] }
        });
      })
    ]
  });

  // ── 이차함수의 식 구하기 ──
  B.addGroup('9-1-6', {
    id: 'formula', title: '이차함수의 식 구하기', standard: S22,
    types: [
      T('formula-vertex-point', '꼭짓점과 한 점으로 y = ax² + bx + c의 식 구하기', '①72·73', (d) => {
        const c = d.until(() => { const a = pm(d) * d.int(1, 3), p = nz(d, -4, 4), q = nz(d, -8, 8), g = genOf(a, p, q), yi = d.bool(), x0 = yi ? 0 : d.until(() => p + pm(d) * d.int(1, 2), (x) => x !== 0); return Object.assign(g, { p, q, yi, x0, y0: a * (x0 - p) ** 2 + q }); }, (v) => !hasZero(v) && Math.abs(v.c) <= 50 && Math.abs(v.y0) <= 50);
        const given = c.yi ? `${YI}이 ${iq(c.c)}인` : `점 ${ptj(c.x0, c.y0, '을/를')} 지나는`;
        return genAns(`꼭짓점의 좌표가 ${pt(c.p, c.q)}이고 ${given} 이차함수의 식을 ${GL}의 꼴로 나타내시오.`, c.a, c.b, c.c, {
          explain: `식을 ${jw(nb(`${Y} = ${A}(${X} ${sgn(-c.p)})${sup(2)} ${sgn(c.q)}`), '으로/로')} 놓고 ${put(c.x0, c.y0)} ${nb(`${iq(c.y0)} = ${ka((c.x0 - c.p) ** 2, A)} ${sgn(c.q)}`)}, ${is(A, c.a)}이다. ${jw(std(c.a, c.p, c.q), '을/를')} 전개하면 ${gen(c.a, c.b, c.c)}이다.`.replace(`${std(c.a, c.p, c.q)}를`, `${jw(std(c.a, c.p, c.q), '을/를')}`),
          facts: { calc: [[`(${jn(c.y0)}-${jn(c.q)})/((${jn(c.x0)}-${jn(c.p)})*(${jn(c.x0)}-${jn(c.p)}))`, 0], [`0-2*(${jn(c.y0)}-${jn(c.q)})/((${jn(c.x0)}-${jn(c.p)})*(${jn(c.x0)}-${jn(c.p)}))*${jn(c.p)}`, 1], [`(${jn(c.y0)}-${jn(c.q)})/((${jn(c.x0)}-${jn(c.p)})*(${jn(c.x0)}-${jn(c.p)}))*${jn(c.p)}*${jn(c.p)}+${jn(c.q)}`, 2]], unseen: [0, 2] }
        });
      }),
      T('formula-graph', '그래프(그림)의 꼭짓점과 한 점으로 식 구하기', '①74', (d) => {
        const c = d.until(() => {
          const a = pm(d) * d.int(1, 3), p = nz(d, -3, 3), q = nz(d, -5, 5), g = genOf(a, p, q), onY = d.bool(), x0 = onY ? 0 : d.until(() => p + pm(d) * d.int(1, 2), (x) => x !== 0 && x !== p), y0 = a * (x0 - p) ** 2 + q;
          const o = { x: span([p, x0], 1.6), y: span([q, y0], 1.6), parabolas: [{ a, p, q }], points: [{ x: p, y: q, guide: true }, { x: x0, y: y0, guide: onY ? false : true }], xnums: [{ v: p }].concat(onY ? [] : [{ v: x0 }]), ynums: [{ v: q }, { v: y0 }], say: `${bowl(a)} 포물선. 꼭짓점과 ${onY ? 'y축과 만나는 점' : '그래프 위의 한 점'}에 점을 찍고 두 축으로 점선을 그었다.` };
          return Object.assign(g, { p, q, x0, y0, o });
        }, (v) => !hasZero(v) && v.y0 !== 0 && v.y0 !== v.q && Math.abs(v.y0) <= 12 && figOk(v.o));
        return genAns(`그림과 같이 꼭짓점이 보이는 포물선을 그래프로 하는 이차함수의 식을 ${GL}의 꼴로 나타내시오.`, c.a, c.b, c.c, {
          figure: fig(c.o),
          explain: `꼭짓점이 ${pt(c.p, c.q)}이므로 식을 ${jw(nb(`${Y} = ${A}(${X} ${sgn(-c.p)})${sup(2)} ${sgn(c.q)}`), '으로/로')} 놓는다. 점 ${ptj(c.x0, c.y0, '을/를')} 지나므로 ${nb(`${iq(c.y0)} = ${ka((c.x0 - c.p) ** 2, A)} ${sgn(c.q)}`)}, ${is(A, c.a)}이다. 전개하면 ${gen(c.a, c.b, c.c)}이다.`,
          facts: { calc: [[`(${jn(c.y0)}-${jn(c.q)})/((${jn(c.x0)}-${jn(c.p)})*(${jn(c.x0)}-${jn(c.p)}))`, 0], [`0-2*(${jn(c.y0)}-${jn(c.q)})/((${jn(c.x0)}-${jn(c.p)})*(${jn(c.x0)}-${jn(c.p)}))*${jn(c.p)}`, 1], [`(${jn(c.y0)}-${jn(c.q)})/((${jn(c.x0)}-${jn(c.p)})*(${jn(c.x0)}-${jn(c.p)}))*${jn(c.p)}*${jn(c.p)}+${jn(c.q)}`, 2]], unseen: [0, 2] }
        });
      }),
      T('formula-axis-two', '축과 두 점으로 식 구하기', '①75', (d) => {
        const c = d.until(() => { const a = pm(d) * d.int(1, 2), p = nz(d, -4, 5), q = nz(d, -6, 6), g = genOf(a, p, q), u1 = d.int(1, 3), u2 = d.int(1, 3), x1 = p - u1, x2 = p + (u2 === u1 ? u2 + 1 : u2); return Object.assign(g, { p, q, x1, x2, y1: a * (x1 - p) ** 2 + q, y2: a * (x2 - p) ** 2 + q }); }, (v) => !hasZero(v) && Math.abs(v.c) <= 50 && Math.abs(v.y1) <= 40 && Math.abs(v.y2) <= 40);
        const d1 = (c.x1 - c.p) ** 2, d2 = (c.x2 - c.p) ** 2, aE = `(${jn(c.y2)}-${jn(c.y1)})/((${jn(c.x2)}-${jn(c.p)})*(${jn(c.x2)}-${jn(c.p)})-(${jn(c.x1)}-${jn(c.p)})*(${jn(c.x1)}-${jn(c.p)}))`, qE = `${jn(c.y1)}-${aE}*(${jn(c.x1)}-${jn(c.p)})*(${jn(c.x1)}-${jn(c.p)})`;
        return genAns(`축의 방정식이 ${is(X, c.p)}이고 두 점 ${pt(c.x1, c.y1)}, ${ptj(c.x2, c.y2, '을/를')} 지나는 포물선을 그래프로 하는 이차함수의 식을 ${GL}의 꼴로 나타내시오.`, c.a, c.b, c.c, {
          explain: `식을 ${jw(nb(`${Y} = ${A}(${X} ${sgn(-c.p)})${sup(2)} + ${QV}`), '으로/로')} 놓고 두 점을 대입하면 ${nb(`${iq(c.y1)} = ${ka(d1, A)} + ${QV}`)}, ${nb(`${iq(c.y2)} = ${ka(d2, A)} + ${QV}`)}이다. 연립하면 ${is(A, c.a)}, ${is(QV, c.q)}이므로 ${std(c.a, c.p, c.q)}, 곧 ${gen(c.a, c.b, c.c)}이다.`,
          facts: { calc: [[aE, 0], [`0-2*${aE}*${jn(c.p)}`, 1], [`${aE}*${jn(c.p)}*${jn(c.p)}+${qE}`, 2]], unseen: [0, 2] }
        });
      }),
      T('formula-xaxis-vertex', '꼭짓점이 x축 위·축·y절편으로 식 구하기', '①76 심10', (d) => {
        const a = pm(d) * d.int(1, 3), p = nz(d, -4, 4), g = genOf(a, p, 0);
        return genAns(`꼭짓점이 ${XA} 위에 있고, 축의 방정식이 ${is(X, p)}이며, ${YA}과 점 ${pt(0, g.c)}에서 만나는 포물선을 그래프로 하는 이차함수의 식을 ${GL}의 꼴로 나타내시오.`, g.a, g.b, g.c, {
          explain: `꼭짓점이 ${XA} 위에 있고 축이 ${is(X, p)}이므로 꼭짓점은 ${pt(p, 0)}이다. 식을 ${jw(nb(`${Y} = ${A}(${X} ${sgn(-p)})${sup(2)}`), '으로/로')} 놓고 ${put(0, g.c)} ${nb(`${iq(g.c)} = ${ka(p * p, A)}`)}, ${is(A, a)}이다. 전개하면 ${gen(g.a, g.b, g.c)}이다.`,
          facts: { calc: [[`${jn(g.c)}/(${jn(p)}*${jn(p)})`, 0], [`0-2*${jn(g.c)}/(${jn(p)}*${jn(p)})*${jn(p)}`, 1], [jn(g.c), 2]], unseen: [0, 2] }
        });
      }),
      T('formula-xints-yint', 'x축과의 두 교점과 y절편으로 식 구하기', '①77', (d, n) => {
        const g = rootsOf(d, { amax: 3, ok: (v) => v.c !== 0 && v.r1 !== 0 && v.r2 !== 0 && Math.abs(v.c) <= 40 });
        const cE = jn(g.c), aE = `${cE}/(${jn(g.r1)}*${jn(g.r2)})`, facts = { calc: [[aE, 0], [`0-${aE}*(${jn(g.r1)}+${jn(g.r2)})`, 1], [cE, 2]], unseen: [0], rule: 'xints-' + n };
        const explain = `식을 ${jw(nb(`${Y} = ${A}(${X} ${sgn(-g.r1)})(${X} ${sgn(-g.r2)})`), '으로/로')} 놓고 ${put(0, g.c)} ${nb(`${iq(g.c)} = ${ka(g.r1 * g.r2, A)}`)}, ${is(A, g.a)}이다. 전개하면 ${gen(g.a, g.b, g.c)}이다.`;
        if (n === 0) return genAns(`${XA}과 두 점 ${pt(g.r1, 0)}, ${pt(g.r2, 0)}에서 만나고 ${YA}과 점 ${pt(0, g.c)}에서 만나는 포물선을 그래프로 하는 이차함수의 식을 ${GL}의 꼴로 나타내시오.`, g.a, g.b, g.c, { explain, facts });
        const o = { x: span([g.r1, g.r2, fl(g.v.p)], 1.2), y: span([fl(g.v.q), g.c], 1.2), parabolas: [{ a: g.a, p: g.v.p, q: g.v.q }], points: [{ x: g.r1, y: 0 }, { x: g.r2, y: 0 }, { x: 0, y: g.c }], xnums: [{ v: g.r1 }, { v: g.r2 }], ynums: [{ v: g.c }], say: `${bowl(g.a)} 포물선. x축과 만나는 두 점과 y축과 만나는 점에 점을 찍었다.` };
        return genAns(`그림과 같이 ${XA}과 두 점에서 만나는 포물선을 그래프로 하는 이차함수의 식을 ${GL}의 꼴로 나타내시오.`, g.a, g.b, g.c, { figure: fig(o), explain, facts });
      }, { count: 2 }),
      T('formula-three-points', 'y축 위의 점을 낀 세 점으로 식 구하기', '①78·79', (d) => {
        const c = d.until(() => { const a = nz(d, -3, 3), b = nz(d, -5, 5), cc = nz(d, -6, 6), [x1, x2] = d.until(() => [nz(d, -3, 3), nz(d, -3, 3)], ([u, v]) => u !== v && u !== -v); return { a, b, cc, x1, x2, y1: a * x1 * x1 + b * x1 + cc, y2: a * x2 * x2 + b * x2 + cc }; }, (v) => Math.abs(v.y1) <= 40 && Math.abs(v.y2) <= 40);
        // a·x1² + b·x1 = y1 − c, a·x2² + b·x2 = y2 − c 를 푼다.
        const s1 = `(${jn(c.y1)}-${jn(c.cc)})`, s2 = `(${jn(c.y2)}-${jn(c.cc)})`, det = `(${jn(c.x1)}*${jn(c.x1)}*${jn(c.x2)}-${jn(c.x2)}*${jn(c.x2)}*${jn(c.x1)})`;
        const pts = d.shuffle([[c.x1, c.y1], [0, c.cc], [c.x2, c.y2]]);
        return genAns(`세 점 ${pts.map(([x, y], i) => (i === 2 ? ptj(x, y, '을/를') : pt(x, y))).join(', ')} 지나는 포물선을 그래프로 하는 이차함수의 식을 ${GL}의 꼴로 나타내시오.`, c.a, c.b, c.cc, {
          explain: `점 ${jw(pt(0, c.cc), '을/를')} 지나므로 ${is(CC, c.cc)}이다. 나머지 두 점을 대입하면 ${nb(`${iq(c.y1)} = ${ka(c.x1 * c.x1, A)} ${c.x1 < 0 ? MINUS : '+'} ${ka(Math.abs(c.x1), BB)} ${sgn(c.cc)}`)}, ${nb(`${iq(c.y2)} = ${ka(c.x2 * c.x2, A)} ${c.x2 < 0 ? MINUS : '+'} ${ka(Math.abs(c.x2), BB)} ${sgn(c.cc)}`)}이다. 연립하면 ${is(A, c.a)}, ${is(BB, c.b)}이다.`,
          facts: { calc: [[`(${s1}*${jn(c.x2)}-${s2}*${jn(c.x1)})/${det}`, 0], [`(${jn(c.x1)}*${jn(c.x1)}*${s2}-${jn(c.x2)}*${jn(c.x2)}*${s1})/${det}`, 1], [jn(c.cc), 2]], unseen: [0] }
        });
      }),
      T('formula-two-points-vertex', '그래프의 두 점으로 b, c를 구해 꼭짓점 구하기', '①80', (d) => {
        const c = d.until(() => {
          const k = d.pick([1, 2, -1, -2]), p = nz(d, -3, 3), q = nz(d, -5, 5), g = genOf(k, p, q), x1 = d.until(() => nz(d, -3, 3), (x) => x !== p), y1 = k * (x1 - p) ** 2 + q;
          const o = { x: span([p, x1], 1.6), y: span([q, y1, g.c], 1.6), parabolas: [{ a: k, p, q }], points: [{ x: 0, y: g.c }, { x: x1, y: y1, guide: y1 !== 0 }], xnums: [{ v: x1 }], ynums: [{ v: g.c }].concat(y1 !== 0 ? [{ v: y1 }] : []), say: `${bowl(k)} 포물선. y축과 만나는 점과 그래프 위의 한 점에 점을 찍었다.` };
          return Object.assign(g, { k, p, q, x1, y1, o });
        }, (v) => !hasZero(v) && Math.abs(v.c) <= 12 && v.y1 !== v.c && Math.abs(v.y1) <= 12 && figOk(v.o));
        const bE = `(${jn(c.y1)}-${jn(c.k)}*${jn(c.x1)}*${jn(c.x1)}-${jn(c.c)})/${jn(c.x1)}`;
        return pointAns(`이차함수 ${nb(`${Y} = ${term(c.k, X2, true)} + ${BB}${X} + ${CC}`)}의 그래프가 그림과 같을 때, 이 그래프의 꼭짓점의 좌표는? (단, ${BB}, ${CC}는 수이다.)`, c.p, c.q, {
          figure: fig(c.o),
          explain: `${YI}이 ${iq(c.c)}이므로 ${is(CC, c.c)}이다. 점 ${ptj(c.x1, c.y1, '을/를')} 지나므로 ${nb(`${iq(c.y1)} = ${iq(c.k * c.x1 * c.x1)} ${c.x1 < 0 ? MINUS : '+'} ${ka(Math.abs(c.x1), BB)} ${sgn(c.c)}`)}, ${is(BB, c.b)}이다. ${jw(gen(c.a, c.b, c.c), '을/를')} 고치면 ${std(c.a, c.p, c.q)}이므로 꼭짓점의 좌표는 ${pt(c.p, c.q)}이다.`,
          facts: { calc: [[`0-${bE}/(2*${jn(c.k)})`, 0], [`${jn(c.c)}-${bE}*${bE}/(4*${jn(c.k)})`, 1]], unseen: [0, 1, 2, 4] }
        });
      })
    ]
  });

  // ── 그래프와 계수의 부호 ──
  // 부호만 읽는 그림: 눈금도 수도 없이 포물선 하나. (볼록한 쪽, 꼭짓점의 자리, y축과 만나는 곳이 보이게 수를 고른다.)
  const signFig = (a, p, q, more) => fig(Object.assign({ x: [Math.min(-3, Math.floor(p) - 2), Math.max(3, Math.ceil(p) + 2)], y: a > 0 ? [Math.min(-2, Math.floor(q) - 1), Math.max(3, Math.ceil(q) + 4)] : [Math.min(-3, Math.floor(q) - 4), Math.max(2, Math.ceil(q) + 1)], parabolas: [{ a, p, q }], say: `${bowl(a)} 포물선(눈금과 수는 없다). 꼭짓점은 ${['제1', '제2', '제3', '제4'][p > 0 ? (q > 0 ? 0 : 3) : (q > 0 ? 1 : 2)]}사분면에 있고, ${Math.abs(a * p * p + q) < 1e-9 ? '원점을 지난다' : `y축과 원점보다 ${a * p * p + q > 0 ? '위' : '아래'}에서 만난다`}.` }, more || {}));
  const signWord = (s) => (s > 0 ? GT : LT);
  // c 파일(실력)도 쓴다.
  Object.assign(K9, { signFig, signWord, genOf, hasZero, term });
  B.addGroup('9-1-6', {
    id: 'sign', title: '그래프와 계수의 부호', standard: S22,
    types: [
      T('sign-apq', 'y = a(x − p)² + q의 그래프에서 a, p, q의 부호', '①81', (d, n) => {
        const sa = pm(d), sp = pm(d), sq = pm(d), a = sa * d.pick([0.5, 1]), p = sp * d.int(1, 2), q = sq * d.int(1, 3);
        const fg = signFig(a, p, q);
        if (n === 0) {
          const opts = d.shuffle([[sa, sp, sq], [-sa, sp, sq], [sa, -sp, sq], [sa, sp, -sq], [-sa, -sp, -sq]]);
          return C(`이차함수 ${stdL}의 그래프가 그림과 같을 때, 수 ${A}, ${P}, ${QV}의 부호로 옳은 것은?`, opts.map(([u, v, w]) => `${cmp(A, signWord(u))}, ${cmp(P, signWord(v))}, ${cmp(QV, signWord(w))}`), opts.findIndex(([u, v, w]) => u === sa && v === sp && w === sq), {
            figure: fg,
            explain: `${bowl(a)} 포물선이므로 ${cmp(A, signWord(sa))}이다. 꼭짓점 ${jw(pt(P, QV), '이/가')} ${QN[sp > 0 ? (sq > 0 ? 0 : 3) : (sq > 0 ? 1 : 2)]}에 있으므로 ${cmp(P, signWord(sp))}, ${cmp(QV, signWord(sq))}이다.`,
            facts: { truth: opts.map(([u, v, w]) => u === sa && v === sp && w === sq), want: true, rule: 'sign-apq-0' }
          });
        }
        // 식의 부호(곱·차)에 대한 말 가운데 옳지 않은 것
        const s = { a: sa, p: sp, q: sq }, prod = (list) => list.reduce((m, k) => m * s[k], 1);
        const cand = [['ap', ['a', 'p']], ['aq', ['a', 'q']], ['pq', ['p', 'q']], ['apq', ['a', 'p', 'q']]].map(([h, ks]) => ({ h: h.split('').map((ch) => V(ch)).join(''), s: prod(ks) }));
        for (const [x, y] of [['a', 'p'], ['a', 'q'], ['p', 'q']]) { if (s[x] !== s[y]) cand.push({ h: `${V(x)} ${MINUS} ${V(y)}`, s: s[x] }); else cand.push({ h: `${V(x)} + ${V(y)}`, s: s[x] }); }
        const pick = d.shuffle(cand).slice(0, 5), bad = d.int(0, 4), rows = pick.map((c, i) => ({ h: nb(`${c.h} ${signWord(i === bad ? -c.s : c.s)} 0`), ok: i !== bad, right: nb(`${c.h} ${signWord(c.s)} 0`) }));
        return C(`이차함수 ${stdL}의 그래프가 그림과 같을 때, 다음 중 옳지 않은 것은? (단, ${A}, ${P}, ${QV}는 수이다.)`, rows.map((r) => r.h), bad, {
          figure: fg,
          explain: `${cmp(A, signWord(sa))}이고, 꼭짓점 ${jw(pt(P, QV), '이/가')} ${QN[sp > 0 ? (sq > 0 ? 0 : 3) : (sq > 0 ? 1 : 2)]}에 있으므로 ${cmp(P, signWord(sp))}, ${cmp(QV, signWord(sq))}이다. 따라서 ${rows[bad].right}이다.`,
          facts: { truth: rows.map((r) => !r.ok), want: true, rule: 'sign-apq-1' }
        });
      }, { count: 2 }),
      T('sign-abc', 'y = ax² + bx + c의 그래프에서 a, b, c의 부호', '①82', (d, n) => {
        if (n === 0) {
          const c = d.until(() => { const a = pm(d) * d.pick([0.5, 1]), p = pm(d) * d.int(1, 2), q = nz(d, -3, 3); return { a, p, q, c: a * p * p + q }; }, (v) => Math.abs(v.c) >= 1);
          const sa = Math.sign(c.a), sb = -Math.sign(c.a * c.p), sc = Math.sign(c.c), r = (s) => (s > 0 ? '>' : '<');
          return inline(`이차함수 ${GL}의 그래프가 그림과 같을 때, 수 ${A}, ${BB}, ${CC}의 부호를 각각 정하시오.`, `${A} {0} 0, ${BB} {1} 0, ${CC} {2} 0`, [{ rel: true, answer: r(sa) }, { rel: true, answer: r(sb) }, { rel: true, answer: r(sc) }], {
            figure: signFig(c.a, c.p, c.q),
            shown: `${cmp(A, signWord(sa))}, ${cmp(BB, signWord(sb))}, ${cmp(CC, signWord(sc))}`,
            explain: `${bowl(c.a)} 포물선이므로 ${cmp(A, signWord(sa))}이다. 축이 ${YA}의 ${c.p > 0 ? '오른쪽' : '왼쪽'}에 있으므로 ${A}와 ${BB}의 부호가 ${c.p > 0 ? '다르고' : '같고'}, ${cmp(BB, signWord(sb))}이다. ${YA}과 ${sc > 0 ? '원점보다 위' : '원점보다 아래'}에서 만나므로 ${cmp(CC, signWord(sc))}이다.`,
            facts: { signs: [sa, sb, sc], rule: 'sign-abc-0' }
          });
        }
        // 원점을 지나는 그래프(c = 0)
        const a = pm(d) * d.pick([0.5, 1]), p = pm(d) * d.int(1, 2), q = -a * p * p, sa = Math.sign(a), sb = -Math.sign(a * p);
        const opts = d.shuffle([[sa, sb, 0], [-sa, sb, 0], [sa, -sb, 0], [sa, sb, sa], [sa, sb, -sa]]);
        const txt = ([u, v, w]) => `${cmp(A, signWord(u))}, ${cmp(BB, signWord(v))}, ${w === 0 ? is(CC, 0) : cmp(CC, signWord(w))}`;
        return C(`이차함수 ${GL}의 그래프가 그림과 같을 때, 수 ${A}, ${BB}, ${CC}의 부호로 옳은 것은?`, opts.map(txt), opts.findIndex(([u, v, w]) => u === sa && v === sb && w === 0), {
          figure: signFig(a, p, q, { say: `${bowl(a)} 포물선(눈금과 수는 없다). 원점을 지나고, 축은 y축의 ${p > 0 ? '오른쪽' : '왼쪽'}에 있다.` }),
          explain: `${bowl(a)} 포물선이므로 ${cmp(A, signWord(sa))}, 축이 ${YA}의 ${p > 0 ? '오른쪽' : '왼쪽'}에 있으므로 ${cmp(BB, signWord(sb))}, 원점을 지나므로 ${is(CC, 0)}이다.`,
          facts: { truth: opts.map(([u, v, w]) => u === sa && v === sb && w === 0), want: true, rule: 'sign-abc-1' }
        });
      }, { count: 2 }),
      T('sign-values', '그래프에서 a + b + c, a − b + c, 4a + 2b + c 따위의 부호', '①83 심24·25', (d) => {
        // 두 근이 반정수인 그래프: x = −2, −1, 1, 2 에서의 함숫값의 부호가 그림에서 보인다.
        const c = d.until(() => { const a = pm(d), r1 = d.int(-7, 1) + 0.5, r2 = d.int(-1, 7) + 0.5; return { a, r1, r2 }; }, (v) => v.r1 < v.r2 && v.r1 * v.r2 !== 0 && v.r2 - v.r1 >= 2 && v.r2 - v.r1 <= 7 && (v.r1 + v.r2) !== 0);
        const f = (x) => c.a * (x - c.r1) * (x - c.r2), A_ = c.a, B_ = -c.a * (c.r1 + c.r2), C_ = c.a * c.r1 * c.r2, h = (c.r1 + c.r2) / 2, k = f(h);
        const xs = [-2, -1, 1, 2];
        const all = [
          { h: cmp(A, GT), v: A_ }, { h: cmp(BB, GT), v: B_ }, { h: cmp(CC, GT), v: C_ },
          { h: cmp(`${A}${BB}`, GT), v: A_ * B_ }, { h: cmp(`${A}${CC}`, GT), v: A_ * C_ }, { h: cmp(`${BB}${CC}`, GT), v: B_ * C_ }, { h: cmp(`${A}${BB}${CC}`, GT), v: A_ * B_ * C_ },
          { h: cmp(`${A} + ${BB} + ${CC}`, GT), v: f(1) }, { h: cmp(`${A} ${MINUS} ${BB} + ${CC}`, GT), v: f(-1) }, { h: cmp(`4${A} + 2${BB} + ${CC}`, GT), v: f(2) }, { h: cmp(`4${A} ${MINUS} 2${BB} + ${CC}`, GT), v: f(-2) }
        ].filter((r) => Math.abs(r.v) > 1e-9);
        // 각 말을 참이 되게(> 0 이면 그대로, < 0 이면 부등호를 바꾸어) 적고, 하나만 거짓으로 뒤집는다.
        const pick = d.shuffle(all).slice(0, 5), want = d.bool(), odd = d.int(0, 4);
        // want 이면 참인 말이 하나(odd), 아니면 거짓인 말이 하나(odd). 참인 말은 실제 부호대로, 거짓인 말은 부등호를 바꾸어 적는다.
        const rows = pick.map((r, i) => { const ok = want ? i === odd : i !== odd, holds = r.v > 0; return { h: (ok ? holds : !holds) ? r.h : r.h.replace(GT, LT), ok }; });
        const ys = xs.map(f).concat([k, 0]), o = { x: [Math.floor(Math.min(c.r1, -2)) - 1, Math.ceil(Math.max(c.r2, 2)) + 1], y: [Math.floor(Math.min(...ys)) - 1, Math.ceil(Math.max(...ys)) + 1], parabolas: [{ a: c.a, p: h, q: k }], dashes: xs.map((x) => [x, 0, x, f(x)]), points: xs.map((x) => ({ x, y: f(x) })), xnums: xs.map((v) => ({ v })), say: `${bowl(c.a)} 포물선. x축의 −2, −1, 1, 2인 곳에서 포물선까지 세로 점선을 그었다. 포물선은 x = −2에서 x축보다 ${f(-2) > 0 ? '위' : '아래'}, x = −1에서 ${f(-1) > 0 ? '위' : '아래'}, x = 1에서 ${f(1) > 0 ? '위' : '아래'}, x = 2에서 ${f(2) > 0 ? '위' : '아래'}에 있다. 축은 y축의 ${h > 0 ? '오른쪽' : '왼쪽'}에 있고 y축과 원점보다 ${C_ > 0 ? '위' : '아래'}에서 만난다.` };
        return C(`이차함수 ${GL}의 그래프가 그림과 같을 때, 다음 중 ${want ? '옳은' : '옳지 않은'} 것은? (단, ${A}, ${BB}, ${CC}는 수이다.)`, rows.map((r) => r.h), odd, {
          figure: fig(o),
          explain: `${bowl(c.a)} 포물선이므로 ${cmp(A, signWord(A_))}, 축이 ${YA}의 ${h > 0 ? '오른쪽' : '왼쪽'}에 있으므로 ${cmp(BB, signWord(B_))}, ${YA}과 원점보다 ${C_ > 0 ? '위' : '아래'}에서 만나므로 ${cmp(CC, signWord(C_))}이다. ${nb(`${A} + ${BB} + ${CC}`)}, ${nb(`${A} ${MINUS} ${BB} + ${CC}`)}, ${nb(`4${A} + 2${BB} + ${CC}`)}, ${jw(nb(`4${A} ${MINUS} 2${BB} + ${CC}`), '은/는')} 각각 ${is(X, 1)}, ${is(X, -1)}, ${is(X, 2)}, ${is(X, -2)}일 때의 ${Y}의 값이다.`,
          facts: { truth: rows.map((r) => r.ok === want), want: true }
        });
      }),
      T('sign-given-quadrant', 'a, b, c의 부호로 꼭짓점·지나지 않는 사분면', '①84', (d, n) => {
        if (n === 0) {
          const sa = pm(d), sb = pm(d), sc = -sa, px = -sb * sa, qy = sc, at = px > 0 ? (qy > 0 ? 0 : 3) : (qy > 0 ? 1 : 2);
          return C(`수 ${A}, ${BB}, ${CC}에 대하여 ${cmp(A, signWord(sa))}, ${cmp(BB, signWord(sb))}, ${cmp(CC, signWord(sc))}일 때, 이차함수 ${GL}의 그래프의 꼭짓점은 어느 사분면 위에 있는가?`, QN, at, {
            explain: `${cmp(A, signWord(sa))}이므로 ${bowl(sa)} 포물선이다. ${A}, ${BB}의 부호가 ${sa === sb ? '같으므로 축은 y축의 왼쪽' : '다르므로 축은 y축의 오른쪽'}에 있고, ${YA}과 원점보다 ${sc > 0 ? '위' : '아래'}에서 만난다. ${sa > 0 ? '아래로' : '위로'} 볼록한데 ${YA}과 만나는 점이 원점보다 ${sc > 0 ? '위' : '아래'}에 있으므로 꼭짓점도 ${XA}보다 ${sc > 0 ? '위' : '아래'}에 있다. 꼭짓점은 ${QN[at]} 위에 있다.`,
            facts: { truth: QN.map((_, i) => i === at), want: true, rule: 'sign-q-0' }
          });
        }
        // y = ax² + kx (a 의 부호만 안다): 원점을 지나고 두 번째 x절편은 −k/a
        const sa = pm(d), k = nz(d, -5, 5), hit = quadsOf(sa, -k / (2 * sa), -k * k / (4 * sa)), miss = [0, 1, 2, 3].filter((i) => !hit[i])[0];
        return C(`수 ${A}에 대하여 ${cmp(A, signWord(sa))}일 때, 이차함수 ${nb(`${Y} = ${A}${X2} ${k < 0 ? MINUS : '+'} ${ka(Math.abs(k), X)}`)}의 그래프가 지나지 않는 사분면은?`, QN, miss, {
          explain: `${isj(X, 0, '을/를')} 대입하면 ${is(Y, 0)}이므로 원점을 지난다. ${A}와 ${X}의 계수 ${iq(k)}의 부호가 ${(sa > 0) === (k > 0) ? '같으므로 축은 y축의 왼쪽' : '다르므로 축은 y축의 오른쪽'}에 있고 ${bowl(sa)} 포물선이므로 ${QN[miss]}을 지나지 않는다.`,
          facts: { truth: QN.map((_, i) => i === miss), want: true, rule: 'sign-q-1' }
        });
      }, { count: 2 }),
      T('sign-ratio', '그래프에서 b/a, c/a의 부호', '심26', (d) => {
        const c = d.until(() => { const a = pm(d) * d.pick([0.5, 1]), p = pm(d) * d.int(1, 2), q = nz(d, -3, 3); return { a, p, q, c: a * p * p + q }; }, (v) => Math.abs(v.c) >= 1);
        const sa = Math.sign(c.a), sb = -Math.sign(c.a * c.p), sc = Math.sign(c.c), r = (s) => (s > 0 ? '>' : '<');
        return inline(`이차함수 ${GL}의 그래프가 그림과 같을 때, ${frac(BB, A)}, ${frac(CC, A)}의 부호를 각각 정하시오. (단, ${A}, ${BB}, ${CC}는 수이다.)`, `${frac(BB, A)} {0} 0, ${frac(CC, A)} {1} 0`, [{ rel: true, answer: r(sa * sb) }, { rel: true, answer: r(sa * sc) }], {
          figure: signFig(c.a, c.p, c.q),
          shown: `${nb(`${frac(BB, A)} ${signWord(sa * sb)} 0`)}, ${nb(`${frac(CC, A)} ${signWord(sa * sc)} 0`)}`,
          explain: `${cmp(A, signWord(sa))}, 축이 ${YA}의 ${c.p > 0 ? '오른쪽' : '왼쪽'}에 있으므로 ${cmp(BB, signWord(sb))}, ${YA}과 원점보다 ${sc > 0 ? '위' : '아래'}에서 만나므로 ${cmp(CC, signWord(sc))}이다. 따라서 ${nb(`${frac(BB, A)} ${signWord(sa * sb)} 0`)}, ${nb(`${frac(CC, A)} ${signWord(sa * sc)} 0`)}이다.`,
          facts: { signs: [sa * sb, sa * sc] }
        });
      })
    ]
  });
  // 받는 쪽에서 덧붙임(2026-10-16): ①64는 꼭짓점의 y좌표로 푸는 꼴이라 고등학교의 「그래프와 직선의 위치 관계」로 보지 않는다.
  B.addTypes('9-1-6', 'axes', [
    T('axes-no-meet', 'x축과 만나지 않을 때 상수의 범위', '①64', (d) => {
      const p = nz(d, -4, 4), b = -2 * p, s = p * p;
      const rows = d.shuffle([[GT, s], [LT, s], ['≥', s], [GT, -s], [LT, -s]]).map(([r, v]) => [r, v, r === GT && v === s]);
      return C(`이차함수 ${nb(`${Y} = ${X2}${term(b, X)} + ${K}`)}의 그래프가 ${XA}과 만나지 않을 때, 수 ${K}의 값의 범위는?`, rows.map(([r, v]) => nb(`${K} ${r} ${iq(v)}`)), rows.findIndex((r) => r[2]), {
        explain: `고치면 ${nb(`${Y} = (${X} ${sgn(-p)})${sup(2)} + ${K} ${MINUS} ${s}`)}이므로 꼭짓점의 좌표는 ${pt(p, nb(`${K} ${MINUS} ${s}`))}이다. 그래프가 아래로 볼록하므로 ${XA}과 만나지 않으려면 꼭짓점이 ${XA}보다 위쪽에 있어야 한다. ${nb(`${K} ${MINUS} ${s} ${GT} 0`)}에서 ${nb(`${K} ${GT} ${s}`)}이다.`,
        facts: { truth: rows.map((r) => r[2]), want: true }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
