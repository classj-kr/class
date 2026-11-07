// 고등학교 대수 수열의 합(11-1-6) — 뒤쪽 묶음: 자연수의 거듭제곱의 합, 항을 묶어 더하는 합, 분수 꼴의 합, 근호 꼴·로그 꼴의 합, 활용.
// 단원 틀과 도구는 11-1-6a.js(B.kit.u116), 실력 문항은 11-1-6c.js 에 있다. 싣는 기준과 뺀 것은 11-1-6a.js 머리에 모아 적었다.
// ref: ①n = 기본꼴_1의 n번.
// 새로 그린 그림: 직선 x = k 와 두 직선이 만드는 사다리꼴(plot), y = √x 와 y = k 의 교점(plot), 삼각수의 점 배열(dotsTri — 단원 안의 작은 함수).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, N, M, C, inline } = B.kit;
  const { MINUS, Q, qadd, qsub, qmul, isInt, tx, V, sup, nb, nz, rt, radAns, sys, tail, poly, ex } = B.kit.mid;
  const { ms, sum, pw, lg, jh, hx, qAns, plot, svgm } = B.kit.hs;
  const U = B.kit.u116;
  const { UNIT, T, jn, tq, sT, par, K, VN, VM, kp, pk, nk, A_, AK, AN, SEQA, SK, s1, s2, s3, e1, e2, e3, powSum, powExpr, powTold, splitTold, joinT, shortSum, range, choose, val, given, frac } = U;
  const VX = V('x');
  const lead = (q) => (q.p === q.q ? '' : tq(q));   // 앞에 곱하는 계수: 1이면 적지 않는다
  const AL = (i) => ms('α_' + i), BE = (i) => ms('β_' + i);
  // 근호 덩이 a√b + c 의 칸: 「[±][ ]√[ ] [±][ ]」(근호 앞의 수가 1이어도 1을 적는다)
  const RNOTE = ' <span style="white-space:nowrap">(단, 근호 앞의 수가 1이어도 1을 적는다.)</span>';
  const radPlus = (text, b, c, a, o) => inline(text + RNOTE, '{0}' + rt('{1}') + ' {2}', [{ answer: b, signed: true }, { answer: c }, { answer: a, signed: true }],
    Object.assign({}, o, { shown: nb((b < 0 ? MINUS : '') + (Math.abs(b) === 1 ? '' : Math.abs(b)) + rt(c) + (a < 0 ? ' ' + MINUS + ' ' : ' + ') + Math.abs(a)) }));
  const constPlusRad = (text, a, b, c, o) => inline(text + RNOTE, '{0} {1}' + rt('{2}'), [{ answer: a, signed: true }, { answer: b, signed: true }, { answer: c }],
    Object.assign({}, o, { shown: nb(sT(a) + (b < 0 ? ' ' + MINUS + ' ' : ' + ') + (Math.abs(b) === 1 ? '' : Math.abs(b)) + rt(c)) }));

  // ── 자연수의 거듭제곱의 합 ──
  B.addTypes(UNIT, 'pow', [
    T('pow-poly', '다항식 일반항의 Σ — 전개해 공식으로', '①21', (d, n) => {
      let body, c, m, told = '';
      if (n === 0) {
        if (d.bool()) { const p = d.int(2, 3), q = nz(d, -3, 3); m = d.int(5, 9); body = par(pk([[p, 1], [q, 0]])) + sup(2); c = [q * q, 2 * p * q, p * p, 0]; }
        else { const p = d.int(1, 4); m = d.int(6, 12); body = par(pk([[1, 1], [p, 0]])) + par(pk([[1, 1], [-p, 0]])); c = [-p * p, 0, 1, 0]; }
      } else if (n === 1) {
        const kind = d.int(0, 2), p = d.int(1, 3); m = d.int(5, 9);
        if (kind === 0) { body = kp(2) + par(pk([[1, 1], [p, 0]])); c = [0, 0, p, 1]; }
        else if (kind === 1) { body = par(pk([[1, 1], [-1, 0]])) + par(pk([[1, 2], [1, 1], [1, 0]])); c = [-1, 0, 0, 1]; }
        else { body = K + par(pk([[1, 1], [p, 0]])) + par(pk([[1, 1], [-p, 0]])); c = [0, -p * p, 0, 1]; }
      } else if (d.bool()) { const p = d.int(1, 3), q = nz(d, -6, 6), r = nz(d, -9, 9); m = d.int(6, 12); body = par(pk([[p, 2], [q, 1], [r, 0]])); c = [r, q, p, 0]; }
      else { const q = d.int(1, 5); m = d.int(4, 8); body = par(pk([[1, 3], [q, 1]])); c = [0, q, 0, 1]; }
      const v = powSum(c, m), expand = pk([[c[3], 3], [c[2], 2], [c[1], 1], [c[0], 0]]);
      if (Math.abs(v) > 9999 || v === 0) return null;
      if (n !== 2) told = nb(body + ' = ' + expand) + '이므로 ';
      return val('다음 식의 값은?', v, {
        figure: hx(SK(m, body)),
        explain: `${told}${nb(SK(m, body) + ' = ' + splitTold(c, m))} = ${powTold(c, m)}이다.`,
        facts: { value: powExpr(c, m), derived: [3, 6].concat(c.map(Math.abs)) }
      });
    }, { count: 3 }),
    T('pow-merge', '같은 범위의 두 Σ를 하나로 모아 셈하기', '①22', (d, n) => {
      const m = d.int(8, 15);
      let fig, c, joined;
      if (n === 0) {
        const p = d.int(1, 4), q = d.int(1, 3);
        fig = SK(m, K + par(pk([[1, 1], [p, 0]]))) + ' ' + MINUS + ' ' + SK(m, par(pk([[1, 1], [-q, 0]])) + par(pk([[1, 1], [p, 0]])));
        c = [q * p, q, 0, 0]; joined = SK(m, par(pk([[q, 1], [q * p, 0]])));
      } else if (d.bool()) {
        const u = d.int(1, 6), w = d.int(1, 6), a = d.int(2, 3);
        fig = SK(m, par(u + ' ' + MINUS + ' ' + kp(2))) + ' + ' + SK(m, par(pk([[w, 0], [a, 2]])));
        c = [u + w, 0, a - 1, 0]; joined = SK(m, par(pk([[a - 1, 2], [u + w, 0]])));
      } else {
        const p = d.int(2, 6), q = nz(d, -5, 6), r = d.int(1, 4), s = nz(d, -6, 5);
        if (q + s === 0) return null;
        fig = SK(m, par(pk([[p, 1], [q, 0]]))) + ' + ' + SK(m, par(pk([[r, 1], [s, 0]])));
        c = [q + s, p + r, 0, 0]; joined = SK(m, par(pk([[p + r, 1], [q + s, 0]])));
      }
      const v = powSum(c, m);
      return val('다음 식의 값은?', v, {
        figure: hx(fig),
        explain: `범위가 같은 두 합을 하나로 모으면 ${joined}이므로 ${powTold(c, m)}이다.`,
        facts: { value: powExpr(c, m), derived: [6].concat(c.map(Math.abs)) }
      });
    }, { count: 2 }),
    T('pow-cancel', '합치면 약분되는 분수식 두 Σ', '①23', (d, n) => {
      if (n === 0) {
        const p = d.int(1, 3), m = d.int(6, 12), cube = d.bool(), den = ms('k+' + p);
        const fig = cube ? SK(m, frac(ms('k^3'), den)) + ' + ' + SK(m, frac(p ** 3, den)) : SK(m, frac(ms('k^2'), den)) + ' ' + MINUS + ' ' + SK(m, frac(p * p, den));
        const c = cube ? [p * p, -p, 1, 0] : [-p, 1, 0, 0];
        const merged = cube ? nb(frac(ms('k^3') + ' + ' + p ** 3, den) + ' = ' + frac(par(den) + par(pk([[1, 2], [-p, 1], [p * p, 0]])), den) + ' = ' + pk([[1, 2], [-p, 1], [p * p, 0]]))
          : nb(frac(ms('k^2') + ' ' + MINUS + ' ' + p * p, den) + ' = ' + frac(par(den) + par(pk([[1, 1], [-p, 0]])), den) + ' = ' + pk([[1, 1], [-p, 0]]));
        const v = powSum(c, m);
        return val('다음 식의 값은?', v, {
          figure: hx(fig),
          explain: `두 합을 하나로 모으면 ${merged}이므로 ${powTold(c, m)}이다.`,
          facts: { value: powExpr(c, m), derived: [6, p, p * p, p ** 3] }
        });
      }
      const m = d.int(6, 12), V0 = m + d.int(4, 80), cube = d.bool(), v = V0 - m;
      if (cube) {
        return val(`모든 항이 양수인 수열 ${SEQA}이 다음을 만족시킬 때, ${SK(m, ms('(a_k^2 - a_k)'))}의 값은?`, v, {
          figure: given([`${SK(m, frac(ms('a_k^3'), ms('a_k + 1')))} + ${SK(m, frac(1, ms('a_k + 1')))} = ${V0}`]),
          explain: `두 합을 하나로 모으면 ${nb(frac(ms('a_k^3 + 1'), ms('a_k + 1')) + ' = ' + ms('a_k^2 - a_k + 1'))}이므로 ${nb(SK(m, ms('(a_k^2 - a_k)')) + ' + ' + m + ' = ' + V0)}이다. 따라서 ${v}이다.`,
          facts: { value: `${V0}-${m}` }
        });
      }
      return val(`모든 항이 1이 아닌 수열 ${SEQA}이 다음을 만족시킬 때, ${SK(m, AK)}의 값은?`, v, {
        figure: given([`${SK(m, frac(ms('a_k^2'), ms('a_k - 1')))} ${MINUS} ${SK(m, frac(1, ms('a_k - 1')))} = ${V0}`]),
        explain: `두 합을 하나로 모으면 ${nb(frac(ms('a_k^2 - 1'), ms('a_k - 1')) + ' = ' + ms('a_k + 1'))}이므로 ${nb(SK(m, AK) + ' + ' + m + ' = ' + V0)}이다. 따라서 ${v}이다.`,
        facts: { value: `${V0}-${m}` }
      });
    }, { count: 2 }),
    T('pow-sub', '일반항에 2k, k + 1을 넣은 Σ', '①24', (d, n) => {
      const m = d.int(n === 0 ? 6 : 5, n === 0 ? 10 : 8);
      if (n === 0) {
        const p = d.int(1, 2), q = nz(d, -3, 4), even = d.bool();
        const c = even ? [0, 2 * q, 4 * p, 0] : [p - q, 2 * q - 4 * p, 4 * p, 0], idx = even ? '2k' : '2k-1', v = powSum(c, m);
        const inner = even ? '2' + K : '2' + K + ' ' + MINUS + ' 1';
        return val(`일반항이 ${nb(AN + ' = ' + nk([[p, 2], [q, 1]], VN))}인 수열 ${SEQA}에 대하여 ${SK(m, A_(idx))}의 값은?`, v, {
          explain: `${nb(A_(idx) + ' = ' + (p === 1 ? '' : p) + '(' + inner + ')' + sup(2) + (q < 0 ? ' ' + MINUS + ' ' : ' + ') + (Math.abs(q) === 1 ? '' : Math.abs(q)) + '(' + inner + ') = ' + pk([[c[2], 2], [c[1], 1], [c[0], 0]]))}이므로 ${powTold(c, m)}이다.`,
          facts: { value: powExpr(c, m), derived: [4, 6].concat(c.map(Math.abs)) }
        });
      }
      const p = d.int(1, 3), q = nz(d, -4, 5), c = [q * (p + q), p * (p + 2 * q), p * p, 0], v = powSum(c, m);
      if (p + q === 0) return null;
      return val(`일반항이 ${nb(AN + ' = ' + nk([[p, 1], [q, 0]], VN))}인 수열 ${SEQA}에 대하여 ${SK(m, ms('a_ka_{k+1}'))}의 값은?`, v, {
        explain: `${nb(ms('a_{k+1}') + ' = ' + pk([[p, 1], [p + q, 0]]))}이므로 ${nb(ms('a_ka_{k+1}') + ' = ' + par(pk([[p, 1], [q, 0]])) + par(pk([[p, 1], [p + q, 0]])) + ' = ' + pk([[c[2], 2], [c[1], 1], [c[0], 0]]))}이다. 따라서 ${powTold(c, m)}이다.`,
        facts: { value: powExpr(c, m), derived: [6].concat(c.map(Math.abs)) }
      });
    }, { count: 2 }),
    T('pow-list', '나열한 곱의 합 — 제k항을 찾아 값 구하기', '①25', (d, n) => {
      let terms, c, m, kth;
      if (n === 0) {
        const cc = d.int(1, 4); m = d.int(6, 12); c = [0, cc, 1, 0];
        terms = range(1, m).map((k) => `${k} × ${k + cc}`); kth = K + par(pk([[1, 1], [cc, 0]]));
      } else if (n === 1) {
        const b = d.int(2, 5), dd = d.int(2, 4); m = d.int(6, 10); c = [0, b - dd, dd, 0];
        terms = range(1, m).map((k) => `${k} × ${b + (k - 1) * dd}`); kth = K + par(pk([[dd, 1], [b - dd, 0]]));
      } else {
        const even = d.bool(); m = d.int(6, 12); c = even ? [0, 0, 4, 0] : [1, -4, 4, 0];
        terms = range(1, m).map((k) => (even ? 2 * k : 2 * k - 1) + sup(2)); kth = par(even ? '2' + K : '2' + K + ' ' + MINUS + ' 1') + sup(2);
      }
      const v = powSum(c, m);
      if (v > 9999) return null;
      return N('다음 식의 값은?', v, {
        figure: ex(shortSum(terms), 4),   // 곱을 나열한 합은 너비 어림보다 넓게 그려져 360px 화면에서 넘친다 — 글씨를 한 단계 줄인다
        explain: `제${K}항은 ${kth}이고 항은 ${m}개이므로 주어진 식은 ${SK(m, kth)}이다. ${nb(SK(m, kth) + ' = ' + splitTold(c, m))} = ${powTold(c, m)}이다.`,
        facts: { value: powExpr(c, m), derived: [4, 6].concat(c.map(Math.abs), [m]), rule: ['list-plus', 'list-arith', 'list-square'][n] }
      });
    }, { count: 3 }),
    T('pow-closed', '나열한 합을 n의 식으로 간단히 하기', '①26', (d) => {
      // Σ_{k=1}^{n} k(ak + c) = n(n + 1)(2an + a + 3c)/6
      const [a, c] = d.pick([[1, 1], [1, 2], [2, -1], [2, 1], [1, 3]]);
      const show = range(1, 3).map((k) => `${k} × ${a * k + c}`).concat([VN + par(nk([[a, 1], [c, 0]], VN))]);
      const g3 = (x, y, z) => { const g = (p, q) => (q ? g(q, p % q) : Math.abs(p)); return g(g(x, y), z); };
      const form = (u, w, den) => { const g = g3(u, w, den), U2 = u / g, W2 = w / g, D2 = den / g; const top = VN + '(' + VN + ' + 1)(' + nk([[U2, 1], [W2, 0]], VN) + ')'; return { h: D2 === 1 ? nb(top) : frac(top, D2), f: (t) => t * (t + 1) * (U2 * t + W2) / D2 }; };
      const opts = [form(2 * a, a + 3 * c, 6), form(2 * a, a + c, 6), form(2 * a, a + 3 * c, 3), form(2 * a, a, 6), form(a, a + c, 2), form(2 * a, a + 3 * c, 2)];
      const direct = (t) => range(1, t).reduce((s, k) => s + k * (a * k + c), 0);
      const rows = opts.map((o) => [o.h, range(1, 6).every((t) => Math.abs(o.f(t) - direct(t)) < 1e-9)]);
      const pickRows = [rows[0]].concat(d.shuffle(rows.slice(1)).slice(0, 4));
      return choose(d, '다음 식을 간단히 한 것은?', pickRows, {
        figure: ex(show.slice(0, 3).join(' + ') + ' + ⋯ + ' + show[3], 4),   // 곱을 나열한 합: 360px 화면에서 넘치지 않게 글씨를 한 단계 줄인다
        explain: `제${K}항은 ${K}${par(pk([[a, 1], [c, 0]]))}이므로 ${nb(SK('n', K + par(pk([[a, 1], [c, 0]]))) + ' = ' + (a === 1 ? '' : a) + frac(ms('n(n+1)(2n+1)'), 6) + (c < 0 ? ' ' + MINUS + ' ' : ' + ') + (Math.abs(c) === 1 ? '' : Math.abs(c)) + frac(ms('n(n+1)'), 2))} = ${opts[0].h}이다.`
      });
    }),
    T('pow-shift', '1이 아닌 수부터의 거듭제곱의 합', '①27', (d) => {
      const e = d.pick([2, 3]), p = e === 2 ? d.int(4, 15) : d.int(3, 6), q = e === 2 ? d.int(p + 5, Math.min(30, p + 15)) : d.int(p + 5, 13);
      const S = e === 2 ? s2 : s3, v = S(q) - S(p - 1);
      if (v > 9999) return null;
      const ex = e === 2 ? (x) => `(${x})*((${x})+1)*(2*(${x})+1)/6` : (x) => `((${x})*((${x})+1)/2)**2`;
      const fig = [p, p + 1, p + 2].map((k) => k + sup(e)).join(' + ') + ' + ⋯ + ' + q + sup(e);
      return N('다음 식의 값은?', v, {
        figure: hx(fig),
        explain: `주어진 식은 ${nb(SK(q, kp(e)) + ' ' + MINUS + ' ' + SK(p - 1, kp(e)))}이다. ${nb(`${S(q)} ${MINUS} ${S(p - 1)} = ${v}`)}이다. 빼는 합의 위끝은 ${josa(p, '이/가')} 아니라 ${p - 1}이다.`,
        facts: { value: `${ex(q)}-${ex(p + '-1')}`, derived: [3, 6], rule: 'shift-power' }
      });
    }),
    T('pow-findn', 'Σ의 값으로 n 구하기', '①28', (d, n) => {
      if (n === 0) {
        const nn = d.int(4, 18), V0 = nn * (nn + 1) * (nn + 2) / 3;
        return N(`${jh(SK('n', K + par(pk([[1, 1], [1, 0]]))) + ' = ' + V0, '을/를')} 만족시키는 자연수 ${VN}의 값은?`, nn, {
          explain: `${nb(SK('n', K + '(' + K + ' + 1)') + ' = ' + SK('n', kp(2)) + ' + ' + SK('n', K) + ' = ' + frac(ms('n(n+1)(2n+1)'), 6) + ' + ' + frac(ms('n(n+1)'), 2) + ' = ' + frac(ms('n(n+1)(n+2)'), 3))}이다. ${nb(ms('n(n+1)(n+2)') + ' = ' + 3 * V0 + ' = ' + nn + ' × ' + (nn + 1) + ' × ' + (nn + 2))}이므로 ${nb(VN + ' = ' + nn)}이다.`,
          facts: { value: `(3*${V0})**(1/3)-((3*${V0})**(1/3))%1`, derived: [3] }
        });
      }
      const c = d.pick([-1, 1, 3, 5]), nn = d.int(6, 40), V0 = nn * nn + (1 + c) * nn;
      const right = c === -1 ? VN + sup(2) : nk([[1, 2], [1 + c, 1]], VN);
      return N(`${jh(SK('n', par(pk([[2, 1], [c, 0]]))) + ' = ' + V0, '을/를')} 만족시키는 자연수 ${VN}의 값은?`, nn, {
        explain: `${nb(SK('n', par(pk([[2, 1], [c, 0]]))) + ' = 2 × ' + frac(ms('n(n+1)'), 2) + (c < 0 ? ' ' + MINUS + ' ' : ' + ') + (Math.abs(c) === 1 ? '' : Math.abs(c)) + VN + ' = ' + right)}이다. ${nb(right + ' = ' + V0)}에서 ${nb(VN + ' = ' + nn)}이다.`,
        facts: { value: `(0-(1+${jn(c)})+((1+${jn(c)})**2+4*${V0})**0.5)/2`, derived: [4, 0.5] }
      });
    }, { count: 2 }),
    T('pow-min', 'Σ 안에 실수 a가 든 식의 최솟값', '①29', (d) => {
      const m = d.pick([4, 5, 7, 8, 9, 11, 12, 13]), v = m * (m * m - 1) / 12, va = V('a'), mid = Q(m + 1, 2);
      return val(`실수 ${va}에 대하여 ${SK(m, par(kp(2) + ' ' + MINUS + ' 2' + va + K + ' + ' + va + sup(2)))}의 최솟값은?`, v, {
        explain: `${va}는 ${K}에 관계없는 수이므로 주어진 식은 ${nb(SK(m, kp(2)) + ' ' + MINUS + ' 2' + va + SK(m, K) + ' + ' + m + va + sup(2) + ' = ' + m + va + sup(2) + ' ' + MINUS + ' ' + 2 * s1(m) + va + ' + ' + s2(m))}이다. 이 식은 ${nb(va + ' = ' + tq(mid))}일 때 가장 작고, 그 값은 ${nb(`${s2(m)} ${MINUS} ${m} × (${tq(mid)})${sup(2)} = ${v}`)}이다.`,
        facts: { value: `${m}*(${m}*${m}-1)/12`, derived: [12] }
      });
    }),
    T('pow-choose', '서로 다른 수를 골라 만든 Σ의 최댓값과 최솟값', '①30', (d) => {
      const Nn = d.int(16, 30), L = d.int(5, Math.floor(Nn / 2)), p = d.pick([1, 2]);
      const top = L * (2 * Nn - L + 1) / 2, low = s1(L), mx = top - p * s1(L), mn = low - p * s1(L);
      const body = par(AK + ' ' + MINUS + ' ' + (p === 1 ? '' : p) + K);
      return M(`1부터 ${Nn}까지의 자연수 중에서 서로 다른 ${L}개를 뽑아 차례로 ${nb(A_(1) + ', ' + A_(2) + ', …, ' + A_(L))}이라 할 때, ${SK(L, body)}의 최댓값과 최솟값은?`, [{ label: '최댓값', answer: mx, signed: true }, { label: '최솟값', answer: mn, signed: true }], {
        shown: `최댓값 ${sT(mx)}, 최솟값 ${sT(mn)}`,
        explain: `${nb(SK(L, body) + ' = ' + SK(L, AK) + ' ' + MINUS + ' ' + (p === 1 ? '' : p) + SK(L, K) + ' = ' + SK(L, AK) + ' ' + MINUS + ' ' + p * s1(L))}이고, ${SK(L, AK)}는 가장 큰 ${L}개를 뽑을 때 ${nb(`${Nn - L + 1} + ⋯ + ${Nn} = ${top}`)}, 가장 작은 ${L}개를 뽑을 때 ${nb(`1 + ⋯ + ${L} = ${low}`)}이다. 따라서 최댓값은 ${sT(mx)}, 최솟값은 ${sT(mn)}이다.`,
        facts: { calc: [[`${L}*(2*${Nn}-${L}+1)/2-${p}*${e1(L)}`, 0], [`${e1(L)}-${p}*${e1(L)}`, 1]] }
      });
    })
  ]);

  // ── 항을 묶어 더하는 합 ──
  B.addTypes(UNIT, 'grp', [
    T('grp-parity', 'n의 홀짝으로 다른 일반항의 Σ', '①31', (d, n) => {
      const L = d.int(n === 0 ? 8 : 4, n === 0 ? 15 : 8), L2 = 2 * L, Lx = `(${L2}/2)`;
      if (n === 0) {
        const al = nz(d, -3, 3), be = d.int(-5, 9), ga = nz(d, -3, 4), de = d.int(-5, 9);
        if (al === ga && be === de) return null;
        const odd = 2 * al * s1(L) + (be - al) * L, even = 2 * ga * s1(L) + de * L, v = odd + even;
        return val(`수열 ${SEQA}의 일반항이 다음과 같을 때, ${SK(L2, AK)}의 값은?`, v, {
          figure: hx(AN + ' = ' + sys([`${nk([[al, 1], [be, 0]], VN)} (${VN}이 홀수)`, `${nk([[ga, 1], [de, 0]], VN)} (${VN}이 짝수)`])),
          explain: `${nb(A_('2k-1') + ' = ' + pk([[2 * al, 1], [be - al, 0]]))}, ${nb(A_('2k') + ' = ' + pk([[2 * ga, 1], [de, 0]]))}이므로 ${nb(SK(L2, AK) + ' = ' + SK(L, A_('2k-1')) + ' + ' + SK(L, A_('2k')))} = ${nb(sT(odd) + ' + ' + (even < 0 ? '(' + sT(even) + ')' : even) + ' = ' + sT(v))}이다.`,
          facts: { value: `2*${jn(al)}*${e1(Lx)}+(${jn(be)}-${jn(al)})*${Lx}+2*${jn(ga)}*${e1(Lx)}+${jn(de)}*${Lx}` }
        });
      }
      const p = d.int(1, 3), q = d.int(-3, 5), c = [q, 2 * p, 4, 0], v = powSum(c, L);
      return val(`수열 ${SEQA}의 일반항이 다음과 같을 때, ${SK(L2, AK)}의 값은?`, v, {
        figure: hx(AN + ' = ' + sys([`${frac(ms('(n+1)^2'), 2)} (${VN}이 홀수)`, `${frac(ms('n^2'), 2)} + ${nk([[p, 1], [q, 0]], VN)} (${VN}이 짝수)`])),
        explain: `${nb(VN + ' = 2' + K + ' ' + MINUS + ' 1')}이면 ${nb(A_('2k-1') + ' = ' + frac(par('2' + K) + sup(2), 2) + ' = 2' + kp(2))}, ${nb(VN + ' = 2' + K)}이면 ${nb(A_('2k') + ' = 2' + kp(2) + ' + ' + pk([[2 * p, 1], [q, 0]]))}이다. 따라서 ${nb(SK(L2, AK) + ' = ' + SK(L, par(pk([[4, 2], [2 * p, 1], [q, 0]]))))} = ${powTold(c, L)}이다.`,
        facts: { value: `4*${e2(Lx)}+2*${p}*${e1(Lx)}+${jn(q)}*${Lx}`, derived: [4, 6] }
      });
    }, { count: 2 }),
    T('grp-pair', '이웃한 두 항의 합이 주어진 수열의 Σ', '①32', (d, n) => {
      const L = d.int(n === 0 ? 8 : 4, n === 0 ? 20 : 8), L2 = 2 * L, Lx = `(${L2}/2)`;
      if (n === 0) {
        const p = d.int(1, 4), q = d.int(-3, 6), v = 2 * p * s1(L) + (q - p) * L;
        const rhs = nk([[p, 1], [q, 0]], VN);
        return val(`수열 ${SEQA}이 모든 자연수 ${VN}에 대하여 ${jh(AN + ' + ' + ms('a_{n+1}') + ' = ' + rhs, '을/를')} 만족시킬 때, ${SK(L2, AK)}의 값은?`, v, {
          explain: `${nb(SK(L2, AK) + ' = (' + A_(1) + ' + ' + A_(2) + ') + (' + A_(3) + ' + ' + A_(4) + ') + ⋯ + (' + A_(L2 - 1) + ' + ' + A_(L2) + ')')}이고, 짝마다 ${VN}에 1, 3, …, ${josa(L2 - 1, '을/를')} 넣은 값이므로 ${nb(SK(L, par(pk([[2 * p, 1], [q - p, 0]]))) + ' = ' + sT(v))}이다.`,
          facts: { value: `2*${p}*${e1(Lx)}+(${jn(q)}-${p})*${Lx}` }
        });
      }
      const p = d.int(1, 4), c = [1 - p, 2 * p - 4, 4, 0], v = powSum(c, L);
      return val(`수열 ${SEQA}이 모든 자연수 ${VN}에 대하여 ${jh(AN + ' + ' + ms('a_{n+1}') + ' = ' + nk([[1, 2], [p, 1]], VN), '을/를')} 만족시킬 때, ${SK(L2, AK)}의 값은?`, v, {
        explain: `${SK(L2, AK)}를 두 항씩 묶으면 ${nb(A_('2k-1') + ' + ' + A_('2k') + ' = ' + ms('(2k-1)^2') + ' + ' + (p === 1 ? '' : p) + '(2' + K + ' ' + MINUS + ' 1) = ' + pk([[4, 2], [2 * p - 4, 1], [1 - p, 0]]))}이므로 ${nb(SK(L, par(pk([[4, 2], [2 * p - 4, 1], [1 - p, 0]]))))} = ${powTold(c, L)}이다.`,
        facts: { value: `4*${e2(Lx)}+(2*${p}-4)*${e1(Lx)}+(1-${p})*${Lx}`, derived: [4, 6] }
      });
    }, { count: 2 }),
    T('grp-cycle', '일의 자리 숫자처럼 되풀이되는 수열의 Σ', '①33', (d, n) => {
      const unitDigits = (b) => { const out = []; let x = b % 10; do { out.push(x); x = (x * b) % 10; } while (x !== out[0]); return out; };
      const exprOf = (b, m) => { const cyc = unitDigits(b), P = cyc.length, r = m % P; return `(${cyc.map((_, i) => `(${b}**${i + 1})%10`).join('+')})*((${m}-${m}%${P})/${P})` + (r ? '+' + range(1, r).map((i) => `(${b}**${i})%10`).join('+') : ''); };
      const sumOf = (b, m) => range(1, m).reduce((s, k) => s + unitDigits(b)[(k - 1) % unitDigits(b).length], 0);
      const m = d.int(10, 40);
      if (n === 0) {
        const b = d.pick([2, 3, 7, 8, 4, 9]), cyc = unitDigits(b), P = cyc.length, v = sumOf(b, m);
        return N(`자연수 ${VN}에 대하여 ${pw(b, VN)}의 일의 자리의 숫자를 ${AN}이라 할 때, ${SK(m, AK)}의 값은?`, v, {
          explain: `${b}${sup(VN)}의 일의 자리의 숫자는 ${cyc.join(', ')}이 이 차례로 되풀이된다. ${m} = ${P} × ${Math.floor(m / P)} + ${m % P}이므로 ${nb(`(${cyc.join(' + ')}) × ${Math.floor(m / P)}${m % P ? ' + ' + cyc.slice(0, m % P).join(' + ') : ''} = ${v}`)}이다.`,
          facts: { value: exprOf(b, m), derived: [10, P, 3, 4] }
        });
      }
      const [b1, b2] = d.pick([[7, 3], [3, 7], [2, 8], [8, 2], [3, 9], [7, 9]]), v = sumOf(b1, m) - sumOf(b2, m), c1 = unitDigits(b1), c2 = unitDigits(b2);
      if (v === 0) return null;
      return val(`자연수 ${VN}에 대하여 ${b1}${sup(VN)}의 일의 자리의 숫자를 ${AN}, ${b2}${sup(VN)}의 일의 자리의 숫자를 ${ms('b_n')}이라 할 때, ${SK(m, ms('(a_k - b_k)'))}의 값은?`, v, {
        explain: `${AN}은 ${c1.join(', ')}, ${ms('b_n')}은 ${c2.join(', ')}이 되풀이된다. 첫째항부터 ${m}개를 각각 더하면 ${sumOf(b1, m)}, ${sumOf(b2, m)}이므로 ${nb(`${sumOf(b1, m)} ${MINUS} ${sumOf(b2, m)} = ${sT(v)}`)}이다.`,
        facts: { value: `${exprOf(b1, m)}-(${exprOf(b2, m)})`, derived: [10, 1, 2, 3, 4] }
      });
    }, { count: 2 })
  ]);

  // ── 분수 꼴의 합 ──
  const den2 = (s) => (s === 0 ? ms('k(k+1)') : ms(`(k+${s})(k+${s + 1})`));
  B.addTypes(UNIT, 'frac', [
    T('frac-adj', '이웃한 두 수의 곱이 분모인 분수의 합', '①34', (d, n) => {
      if (n === 0) {
        const s = d.int(0, 2), c = d.int(1, 3), m = d.int(6, 60), v = qmul(Q(c), qsub(Q(1, s + 1), Q(1, m + s + 1)));
        const body = frac(c, den2(s));
        return val(`${SK(m, body)}의 값은?`, v, {
          explain: `${nb(body + ' = ' + (c === 1 ? '' : c) + par(frac(1, ms('k+' + s).replace(/\+0$/, '')) + ' ' + MINUS + ' ' + frac(1, ms('k+' + (s + 1)))))}이다. 풀어 쓰면 가운데 항이 지워져 ${nb((c === 1 ? '' : c) + par(frac(1, s + 1) + ' ' + MINUS + ' ' + frac(1, m + s + 1)) + ' = ' + tq(v))}이다.`.replace(frac(1, ms('k+0')), frac(1, K)).replace(frac(1, 1), '1'),
          facts: { value: s === 0 ? `${c}*(1-1/(${m}+1))` : `${c}*(1/${s + 1}-1/(${m}+${s + 1}))` }
        });
      }
      const s = d.int(0, 1), c = d.int(1, 3), body = frac(c, den2(s)), cn = (c === 1 ? '' : c) + VN;
      const right = (t) => c * (1 / (s + 1) - 1 / (t + s + 1));
      const opts = s === 0
        ? [[frac(cn, ms('n+1')), (t) => c * t / (t + 1)], [frac(c, ms('n+1')), (t) => c / (t + 1)], [frac(c + '(' + VN + ' + 1)', VN), (t) => c * (t + 1) / t], [frac(cn, ms('n+2')), (t) => c * t / (t + 2)], [frac(c + '(' + VN + ' + 1)', ms('n+2')), (t) => c * (t + 1) / (t + 2)]]
        : [[frac(cn, ms('2(n+2)')), (t) => c * t / (2 * (t + 2))], [frac(c, ms('2(n+2)')), (t) => c / (2 * (t + 2))], [frac(cn, ms('n+2')), (t) => c * t / (t + 2)], [frac(c + '(' + VN + ' + 1)', ms('2(n+2)')), (t) => c * (t + 1) / (2 * (t + 2))], [frac(cn, ms('2(n+1)')), (t) => c * t / (2 * (t + 1))]];
      const rows = opts.map(([h, f]) => [h.replace(/>1\(/, '>('), range(1, 6).every((t) => Math.abs(f(t) - right(t)) < 1e-9)]);
      return choose(d, `${jh(SK('n', body), '을/를')} 간단히 한 것은?`, rows, {
        explain: `${nb(body + ' = ' + (c === 1 ? '' : c) + par(frac(1, s === 0 ? K : ms('k+1')) + ' ' + MINUS + ' ' + frac(1, ms('k+' + (s + 1)))))}이므로 풀어 쓰면 ${nb((c === 1 ? '' : c) + par(frac(1, s + 1) + ' ' + MINUS + ' ' + frac(1, ms('n+' + (s + 1)))))} = ${rows.find((r) => r[1])[0]}이다.`.replace(frac(1, 1), '1')
      });
    }, { count: 2 }),
    T('frac-odd', '차가 2(3)인 두 수의 곱이 분모인 분수의 합', '①35', (d, n) => {
      if (n === 0) {
        const dd = d.pick([2, 3]), e = dd === 2 ? d.pick([-1, 1]) : d.pick([-2, -1, 1, 2]), m = d.int(5, 30);
        const f1 = pk([[dd, 1], [e, 0]]), f2 = pk([[dd, 1], [dd + e, 0]]), body = frac(1, par(f1) + par(f2)), v = qmul(Q(1, dd), qsub(Q(1, dd + e), Q(1, dd * m + dd + e)));
        return val(`${SK(m, body)}의 값은?`, v, {
          explain: `두 인수의 차가 ${dd}이므로 ${nb(body + ' = ' + frac(1, dd) + par(frac(1, f1) + ' ' + MINUS + ' ' + frac(1, f2)))}이다. 풀어 쓰면 가운데가 지워져 ${nb(frac(1, dd) + par(frac(1, dd + e) + ' ' + MINUS + ' ' + frac(1, dd * m + dd + e)) + ' = ' + tq(v))}이다.`.replace(frac(1, 1), '1'),
          facts: { value: `(1/${dd})*(1/(${dd}+${jn(e)})-1/(${dd}*${m}+${dd}+${jn(e)}))` }
        });
      }
      const m = d.int(5, 15), even = d.bool();
      if (even) {
        const terms = range(1, m).map((k) => frac(1, `${2 * k}${sup(2)} ${MINUS} 1`)), v = Q(m, 2 * m + 1);
        return val('다음 식의 값은?', v, {
          figure: hx(shortSum(terms)),
          explain: `${nb(frac(1, ms('(2k)^2 - 1')) + ' = ' + frac(1, ms('(2k-1)(2k+1)')) + ' = ' + frac(1, 2) + par(frac(1, ms('2k-1')) + ' ' + MINUS + ' ' + frac(1, ms('2k+1'))))}이므로 ${nb(SK(m, frac(1, ms('(2k)^2 - 1'))) + ' = ' + frac(1, 2) + par('1 ' + MINUS + ' ' + frac(1, 2 * m + 1)) + ' = ' + tq(v))}이다.`,
          facts: { value: `(${2 * m}/2)/(${2 * m}+1)`, rule: 'odd-pair' }
        });
      }
      const terms = range(1, m).map((k) => frac(1, `${2 * k + 1}${sup(2)} ${MINUS} 1`)), v = Q(m, 4 * (m + 1));
      return val('다음 식의 값은?', v, {
        figure: hx(shortSum(terms)),
        explain: `${nb(frac(1, ms('(2k+1)^2 - 1')) + ' = ' + frac(1, ms('2k(2k+2)')) + ' = ' + frac(1, 4) + par(frac(1, K) + ' ' + MINUS + ' ' + frac(1, ms('k+1'))))}이므로 ${nb(SK(m, frac(1, ms('(2k+1)^2 - 1'))) + ' = ' + frac(1, 4) + par('1 ' + MINUS + ' ' + frac(1, m + 1)) + ' = ' + tq(v))}이다.`,
        facts: { value: `((${2 * m + 1}-1)/2)/(4*((${2 * m + 1}-1)/2+1))`, derived: [4], rule: 'odd-pair' }
      });
    }, { count: 2 }),
    T('frac-skip', '분모가 k(k + 2) 꼴인 분수의 합(앞뒤 두 항씩 남음)', '①36', (d, n) => {
      if (n === 0) {
        const c = d.pick([1, 2, 4]), m = d.int(6, 25), v = qmul(Q(c, 2), qsub(Q(3, 2), qadd(Q(1, m + 1), Q(1, m + 2))));
        const body = frac(c, ms('k(k+2)'));
        return val(`${SK(m, body)}의 값은?`, v, {
          explain: `${nb(body + ' = ' + lead(Q(c, 2)) + par(frac(1, K) + ' ' + MINUS + ' ' + frac(1, ms('k+2'))))}이다. 풀어 쓰면 한 칸 건너 지워져 앞의 두 항 ${nb('1, ' + frac(1, 2))}과 뒤의 두 항 ${nb(frac(1, m + 1) + ', ' + frac(1, m + 2))}만 남으므로 ${nb(lead(Q(c, 2)) + par('1 + ' + frac(1, 2) + ' ' + MINUS + ' ' + frac(1, m + 1) + ' ' + MINUS + ' ' + frac(1, m + 2)) + ' = ' + tq(v))}이다.`,
          facts: { value: `(${c}/2)*(1+1/2-1/(${m}+1)-1/(${m}+2))` }
        });
      }
      const L = d.int(6, 25), v = qmul(Q(1, 2), qsub(Q(3, 2), qadd(Q(1, L), Q(1, L + 1))));
      const terms = range(2, L).map((k) => frac(1, `${k}${sup(2)} ${MINUS} 1`));
      return val('다음 식의 값은?', v, {
        figure: hx(shortSum(terms)),
        explain: `${nb(frac(1, ms('(k+1)^2 - 1')) + ' = ' + frac(1, ms('k(k+2)')))}이므로 주어진 식은 ${nb(SK(L - 1, frac(1, ms('k(k+2)'))) + ' = ' + frac(1, 2) + par('1 + ' + frac(1, 2) + ' ' + MINUS + ' ' + frac(1, L) + ' ' + MINUS + ' ' + frac(1, L + 1)) + ' = ' + tq(v))}이다.`,
        facts: { value: `(1/2)*(1+1/2-1/${L}-1/(${L}+1))`, rule: 'skip-pair' }
      });
    }, { count: 2 }),
    T('frac-tri', '분모가 1 + 2 + ⋯ + k인 분수의 합', '①37', (d) => {
      const s = d.pick([1, 2]), m = d.int(10, 100), v = qmul(Q(2), qsub(Q(1, s), Q(1, m + 1)));
      const terms = (s === 1 ? ['1'] : []).concat([frac(1, '1 + 2'), frac(1, '1 + 2 + 3')], s === 2 ? [frac(1, '1 + 2 + 3 + 4')] : []);
      const fig = terms.join(' + ') + ' + ⋯ + ' + frac(1, `1 + 2 + ⋯ + ${m}`);
      return val('다음 식의 값은?', v, {
        figure: hx(fig),
        explain: `${nb(frac(1, '1 + 2 + ⋯ + ' + K) + ' = ' + frac(1, frac(ms('k(k+1)'), 2)) + ' = ' + frac(2, ms('k(k+1)')) + ' = 2' + par(frac(1, K) + ' ' + MINUS + ' ' + frac(1, ms('k+1'))))}이므로 주어진 식은 ${nb(SK(m, frac(2, ms('k(k+1)')), s) + ' = 2' + par((s === 1 ? '1' : frac(1, 2)) + ' ' + MINUS + ' ' + frac(1, m + 1)) + ' = ' + tq(v))}이다.`,
        facts: { value: s === 1 ? `2*(1-1/(${m}+1))` : `2*(1/2-1/(${m}+1))` }
      });
    }),
    T('frac-roots', '이차방정식의 두 근의 역수의 합을 Σ로 더하기', '①41', (d) => {
      const kind = d.int(0, 1), p = d.int(2, 6), sg = d.pick([1, -1]), m = d.int(5, 20);
      const cterm = kind === 0 ? ms('(2n-1)(2n+1)') : ms('n(n+1)');
      const eq = nb(VX + sup(2) + (sg > 0 ? ' + ' : ' ' + MINUS + ' ') + p + VX + ' ' + MINUS + ' ' + cterm + ' = 0');
      const v = kind === 0 ? Q(sg * p * m, 2 * m + 1) : Q(sg * p * m, m + 1);
      const each = frac((sg < 0 ? MINUS : '') + p, cterm);
      return val(`${VX}에 대한 이차방정식 ${eq}의 두 근을 ${AL('n')}, ${BE('n')}이라 할 때, ${SK(m, par(frac(1, AL('k')) + ' + ' + frac(1, BE('k'))))}의 값은?`, v, {
        explain: `근과 계수의 관계에서 ${nb(AL('n') + ' + ' + BE('n') + ' = ' + sT(-sg * p))}, ${nb(AL('n') + BE('n') + ' = ' + MINUS + cterm)}이므로 ${nb(frac(1, AL('n')) + ' + ' + frac(1, BE('n')) + ' = ' + frac(AL('n') + ' + ' + BE('n'), AL('n') + BE('n')) + ' = ' + each)}이다. ${kind === 0 ? nb(frac(1, ms('(2k-1)(2k+1)')) + ' = ' + frac(1, 2) + par(frac(1, ms('2k-1')) + ' ' + MINUS + ' ' + frac(1, ms('2k+1')))) : nb(frac(1, ms('k(k+1)')) + ' = ' + frac(1, K) + ' ' + MINUS + ' ' + frac(1, ms('k+1')))}이므로 구하는 값은 ${tq(v)}이다.`,
        facts: { value: kind === 0 ? `${jn(sg * p)}*${m}/(2*${m}+1)` : `${jn(sg * p)}*${m}/(${m}+1)` }
      });
    })
  ]);

  // ── 근호 꼴·로그 꼴의 합 ──
  B.addTypes(UNIT, 'root', [
    T('root-diff', '√(k + 1) − √k 의 Σ', '①43', (d, n) => {
      if (n === 0) {
        const c = d.pick([2, 3, 5, 6, 7]), b = d.int(1, 4), s = d.pick([1, 4, 9]), m = b * b * c - 1, t = Math.sqrt(s);
        if (m < s + 4) return null;
        const body = par(rt(K + ' + 1') + ' ' + MINUS + ' ' + rt(K));
        return radPlus(`${SK(m, body, s)}의 값은?`, b, c, -t, {
          explain: `풀어 쓰면 ${nb('(' + rt(s + 1) + ' ' + MINUS + ' ' + rt(s) + ') + (' + rt(s + 2) + ' ' + MINUS + ' ' + rt(s + 1) + ') + ⋯ + (' + rt(m + 1) + ' ' + MINUS + ' ' + rt(m) + ')')}에서 가운데가 지워지므로 ${nb(rt(m + 1) + ' ' + MINUS + ' ' + rt(s) + ' = ' + (b === 1 ? '' : b) + rt(c) + ' ' + MINUS + ' ' + t)}이다.`,
          facts: { calc: [[`((${m}+1)/${c})**0.5`, 0], [`${c}`, 1], [`0-(${s})**0.5`, 2]], derived: [c, 0.5] }
        });
      }
      const two = d.bool();
      const body = two ? par(rt(K + ' + 2') + ' ' + MINUS + ' ' + rt(K)) : par(rt(K + ' + 1') + ' ' + MINUS + ' ' + rt(K));
      const right = (t) => (two ? Math.sqrt(t + 2) + Math.sqrt(t + 1) - 1 - Math.SQRT2 : Math.sqrt(t + 1) - 1);
      const opts = two
        ? [[nb(rt(ms('n+2')) + ' + ' + rt(ms('n+1')) + ' ' + MINUS + ' ' + rt(2) + ' ' + MINUS + ' 1'), (t) => Math.sqrt(t + 2) + Math.sqrt(t + 1) - Math.SQRT2 - 1], [nb(rt(ms('n+2')) + ' ' + MINUS + ' ' + rt(2)), (t) => Math.sqrt(t + 2) - Math.SQRT2], [nb(rt(ms('n+2')) + ' ' + MINUS + ' 1'), (t) => Math.sqrt(t + 2) - 1], [nb(rt(ms('n+2')) + ' + ' + rt(ms('n+1')) + ' ' + MINUS + ' 1'), (t) => Math.sqrt(t + 2) + Math.sqrt(t + 1) - 1], [nb(rt(ms('n+1')) + ' ' + MINUS + ' 1'), (t) => Math.sqrt(t + 1) - 1]]
        : [[nb(rt(ms('n+1')) + ' ' + MINUS + ' 1'), (t) => Math.sqrt(t + 1) - 1], [rt(ms('n+1')), (t) => Math.sqrt(t + 1)], [nb(rt(VN) + ' ' + MINUS + ' 1'), (t) => Math.sqrt(t) - 1], [nb(rt(ms('n+1')) + ' + 1'), (t) => Math.sqrt(t + 1) + 1], [nb(rt(ms('n+1')) + ' ' + MINUS + ' ' + rt(VN)), (t) => Math.sqrt(t + 1) - Math.sqrt(t)]];
      const rows = opts.map(([h, f]) => [h, range(1, 6).every((t) => Math.abs(f(t) - right(t)) < 1e-9)]);
      return choose(d, `${jh(SK('n', body), '을/를')} 간단히 한 것은?`, rows, {
        explain: two ? `풀어 쓰면 한 칸 건너 지워져 앞의 ${nb(MINUS + rt(1) + ', ' + MINUS + rt(2))}와 뒤의 ${nb(rt(ms('n+1')) + ', ' + rt(ms('n+2')))}만 남는다.` : `풀어 쓰면 ${nb('(' + rt(2) + ' ' + MINUS + ' ' + rt(1) + ') + (' + rt(3) + ' ' + MINUS + ' ' + rt(2) + ') + ⋯ + (' + rt(ms('n+1')) + ' ' + MINUS + ' ' + rt(VN) + ')')}에서 가운데가 지워져 ${nb(rt(ms('n+1')) + ' ' + MINUS + ' 1')}이다.`
      });
    }, { count: 2 }),
    T('root-rat', '분모를 유리화한 뒤 지우는 근호 꼴의 합', '①44', (d, n) => {
      if (n === 0) {
        const s = d.pick([1, 4, 9]), u = Math.sqrt(s), t = d.int(u + 3, u + 10), m = t * t - 1, c = d.int(1, 5), v = c * (t - u);
        const body = frac(c, rt(K) + ' + ' + rt(K + ' + 1'));
        return val(`${SK(m, body, s)}의 값은?`, v, {
          explain: `분모를 유리화하면 ${nb(body + ' = ' + (c === 1 ? '' : c) + '(' + rt(K + ' + 1') + ' ' + MINUS + ' ' + rt(K) + ')')}이다. 풀어 쓰면 가운데가 지워져 ${nb((c === 1 ? '' : c) + '(' + rt(m + 1) + ' ' + MINUS + ' ' + rt(s) + ') = ' + (c === 1 ? '' : c + '(' + t + ' ' + MINUS + ' ' + u + ') = ') + v)}이다.`,
          facts: { value: `${c}*((${m}+1)**0.5-(${s})**0.5)`, derived: [0.5] }
        });
      }
      if (n === 1) {
        const c = d.pick([2, 4]), j = d.int(3, 8), L = j * j - 1, coef = c * (j - 1) / 2, top = 2 * j * j;
        const t = (a, b) => frac(c, rt(a) + ' + ' + rt(b));
        const fig = [t(4, 2), t(6, 4), t(8, 6)].join(' + ') + ' + ⋯ + ' + t(top, top - 2);
        return radAns('다음 식의 값은?', coef, 2, {
          figure: hx(fig),
          explain: `${nb(frac(c, rt(ms('2k+2')) + ' + ' + rt(ms('2k'))) + ' = ' + lead(Q(c, 2)) + '(' + rt(ms('2k+2')) + ' ' + MINUS + ' ' + rt(ms('2k')) + ')')}이므로 주어진 식은 ${nb(SK(L, frac(c, rt(ms('2k+2')) + ' + ' + rt(ms('2k')))) + ' = ' + lead(Q(c, 2)) + '(' + rt(top) + ' ' + MINUS + ' ' + rt(2) + ') = ' + lead(Q(c, 2)) + '(' + j + rt(2) + ' ' + MINUS + ' ' + rt(2) + ') = ' + coef + rt(2))}이다.`,
          facts: { calc: [[`${c}*((${top}/2)**0.5-1)/2`, 0], ['2', 1]], derived: [0.5] }
        });
      }
      const s = d.int(1, 3), dd = d.pick([2, 3, 4, 5, 8]), cands = range(s + 2, 9).filter((x) => (x * x - s * s) % dd === 0 && (x * x - s * s) / dd >= 5);
      if (!cands.length) return null;
      const tt = d.pick(cands);
      const m = (tt * tt - s * s) / dd, a1 = s * s, v = Q(tt - s, dd);
      return val(`첫째항이 ${a1}, 공차가 ${dd}인 등차수열 ${SEQA}에 대하여 ${SK(m, frac(1, rt(AK) + ' + ' + rt(ms('a_{k+1}'))))}의 값은?`, v, {
        explain: `${nb(ms('a_{k+1}') + ' ' + MINUS + ' ' + AK + ' = ' + dd)}이므로 ${nb(frac(1, rt(AK) + ' + ' + rt(ms('a_{k+1}'))) + ' = ' + frac(1, dd) + '(' + rt(ms('a_{k+1}')) + ' ' + MINUS + ' ' + rt(AK) + ')')}이다. 풀어 쓰면 ${nb(frac(1, dd) + '(' + rt(A_(m + 1)) + ' ' + MINUS + ' ' + rt(A_(1)) + ')')}이고 ${nb(A_(m + 1) + ' = ' + a1 + ' + ' + m + ' × ' + dd + ' = ' + tt * tt)}이므로 ${nb(frac(1, dd) + '(' + tt + ' ' + MINUS + ' ' + s + ') = ' + tq(v))}이다.`,
        facts: { value: `((${a1}+${m}*${dd})**0.5-(${a1})**0.5)/${dd}`, derived: [0.5] }
      });
    }, { count: 3 }),
    T('root-skip', '분모가 √k + √(k + 2) 꼴인 합(앞뒤 두 항씩 남음)', '①45', (d) => {
      const [m, c, a, b, sqAt] = d.pick([[7, 2, 2, 1, 2], [7, 4, 4, 2, 2], [48, 1, 3, 2, 1], [48, 2, 6, 4, 1], [287, 2, 16, 11, 2]]);
      const body = frac(c, rt(K) + ' + ' + rt(K + ' + 2'));
      const sqTerm = sqAt === 1 ? `(${m}+1)` : `(${m}+2)`, twoTerm = sqAt === 1 ? `((${m}+2)/2)` : `((${m}+1)/2)`;
      return constPlusRad(`${SK(m, body)}의 값은?`, a, b, 2, {
        explain: `${nb(body + ' = ' + lead(Q(c, 2)) + '(' + rt(K + ' + 2') + ' ' + MINUS + ' ' + rt(K) + ')')}이다. 풀어 쓰면 한 칸 건너 지워져 ${nb(lead(Q(c, 2)) + '(' + rt(m + 1) + ' + ' + rt(m + 2) + ' ' + MINUS + ' 1 ' + MINUS + ' ' + rt(2) + ')')}만 남는다. ${nb(rt(m + 1) + ' + ' + rt(m + 2) + ' = ' + (sqAt === 1 ? Math.sqrt(m + 1) + ' + ' + Math.sqrt((m + 2) / 2) + rt(2) : Math.sqrt((m + 1) / 2) + rt(2) + ' + ' + Math.sqrt(m + 2)))}이므로 ${nb(sT(a) + ' + ' + b + rt(2))}이다.`,
        facts: { calc: [[`${c}/2*(${sqTerm}**0.5-1)`, 0], [`${c}/2*(${twoTerm}**0.5-1)`, 1], ['2', 2]], derived: [0.5] }
      });
    }),
    T('root-findn', '근호 꼴 Σ의 값으로 n 구하기', '①46', (d) => {
      const s = d.pick([1, 4, 9]), u = Math.sqrt(s), c = d.int(2, 10), t = d.int(u + 2, u + 12), V0 = c * (t - u), nn = t * t - 1;
      const body = frac(c, rt(K + ' + 1') + ' + ' + rt(K));
      return N(`${jh(SK('n', body, s) + ' = ' + V0, '을/를')} 만족시키는 자연수 ${VN}의 값은? (단, ${nb(VN + ' &gt; ' + s)})`, nn, {
        explain: `${nb(body + ' = ' + c + '(' + rt(K + ' + 1') + ' ' + MINUS + ' ' + rt(K) + ')')}이므로 좌변은 ${nb(c + '(' + rt(ms('n+1')) + ' ' + MINUS + ' ' + rt(s) + ') = ' + c + '(' + rt(ms('n+1')) + ' ' + MINUS + ' ' + u + ')')}이다. ${nb(c + '(' + rt(ms('n+1')) + ' ' + MINUS + ' ' + u + ') = ' + V0)}에서 ${nb(rt(ms('n+1')) + ' = ' + t)}, ${nb(VN + ' = ' + nn)}이다.`,
        facts: { value: `(${V0}/${c}+(${s})**0.5)**2-1`, derived: [0.5] }
      });
    }),
    T('root-log', 'log(1 + 1/k)의 Σ로 n 구하기', '①48', (d) => {
      const b = d.pick([2, 3, 5]), s = d.pick([1, 1, 2, 3]), e = d.until(() => d.int(2, 7), (x) => s * b ** x - 1 <= 2000 && s * b ** x - 1 > s + 3), nn = s * b ** e - 1;
      const body = lg(b, par('1 + ' + frac(1, K)));
      return N(`${jh(SK('n', body, s) + ' = ' + e, '을/를')} 만족시키는 자연수 ${VN}의 값은?`, nn, {
        explain: `${nb(lg(b, par('1 + ' + frac(1, K))) + ' = ' + lg(b, frac(ms('k+1'), K)) + ' = ' + lg(b, ms('(k+1)')) + ' ' + MINUS + ' ' + lg(b, K))}이므로 풀어 쓰면 가운데가 지워져 좌변은 ${nb(lg(b, ms('(n+1)')) + (s === 1 ? '' : ' ' + MINUS + ' ' + lg(b, s)) + ' = ' + lg(b, s === 1 ? ms('(n+1)') : frac(ms('n+1'), s)))}이다. ${nb((s === 1 ? ms('n+1') : frac(ms('n+1'), s)) + ' = ' + b + sup(e))}에서 ${nb(VN + ' = ' + nn)}이다.`,
        facts: { value: `${s}*${b}**${e}-1` }
      });
    }),
    T('root-loglog', '로그의 로그의 Σ — 밑 변환으로 곱을 약분하기', '①49', (d) => {
      // [아래끝 s, log_{s+1}(t+2) = j 의 j, 바깥 밑 c, 값 p/q] — c^{p/q} = j
      const [s, j, c, p, q] = d.pick([[1, 4, 8, 2, 3], [1, 4, 16, 1, 2], [1, 8, 16, 3, 4], [1, 8, 4, 3, 2], [1, 3, 9, 1, 2], [1, 3, 27, 1, 3], [2, 2, 4, 1, 2], [2, 2, 8, 1, 3], [2, 3, 9, 1, 2], [2, 4, 8, 2, 3], [1, 2, 8, 1, 3], [1, 5, 25, 1, 2]]);
      if (Math.abs(c ** (p / q) - j) > 1e-9) throw new Error('로그 값이 맞지 않는다');
      const t = (s + 1) ** j - 2, body = lg(c, '{' + lg(ms('k+1'), ms('(k+2)')) + '}');
      return val(`${SK(t, body, s)}의 값은?`, Q(p, q), {
        explain: `로그의 합은 곱의 로그이므로 ${nb(lg(c, '(' + lg(s + 1, s + 2) + ' × ' + lg(s + 2, s + 3) + ' × ⋯ × ' + lg(t + 1, t + 2) + ')'))}이다. 밑을 바꾸면 괄호 안은 ${nb(frac(lg(null, s + 2), lg(null, s + 1)) + ' × ' + frac(lg(null, s + 3), lg(null, s + 2)) + ' × ⋯ × ' + frac(lg(null, t + 2), lg(null, t + 1)) + ' = ' + lg(s + 1, t + 2) + ' = ' + j)}이므로 ${nb(lg(c, j) + ' = ' + tq(Q(p, q)))}이다.`,
        facts: { value: `${p}/${q}`, derived: [p, q] }
      });
    })
  ]);

  // ── 그림 ──
  // 삼각수의 점 배열: 1, 3, 6, 10 개(위에서부터 1, 2, 3, … 개씩)를 정삼각형 모양으로 늘어놓고 밑에 a₁ … a₄ 를 적는다.
  function dotsTri(count) {
    const gap = 11, r = 3.2, pad = 14;
    let x0 = 8, out = '';
    const said = [];
    for (let n = 1; n <= count; n += 1) {
      const w = (n - 1) * gap, top = 10 + (count - n) * gap * 0.866;
      for (let row = 0; row < n; row += 1) for (let i = 0; i <= row; i += 1) {
        const cx = x0 + w / 2 - row * gap / 2 + i * gap, cy = top + row * gap * 0.866;
        out += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r}" style="fill:#1d4ed8"/>`;
      }
      const base = 10 + (count - 1) * gap * 0.866 + 24;
      out += `<text x="${(x0 + w / 2).toFixed(1)}" y="${base.toFixed(1)}" text-anchor="middle" style="font-size:13px;fill:#1f2933">${svgm('a_' + n)}</text>`;
      said.push(`${n}번째 ${n * (n + 1) / 2}개`);
      x0 += w + pad + 2 * r;
    }
    const H = 10 + (count - 1) * gap * 0.866 + 32;
    return `<svg class="mb-numberline" viewBox="0 0 ${Math.ceil(x0)} ${Math.ceil(H)}" width="${Math.ceil(x0)}" role="img" aria-label="점을 정삼각형 모양으로 늘어놓은 그림: ${said.join(', ')}">${out}</svg>`;
  }

  // ── 여러 가지 수열의 합의 활용 ──
  B.addTypes(UNIT, 'use', [
    T('use-vieta', '이차방정식의 두 근으로 만든 일반항의 Σ', '①50', (d) => {
      const p = d.int(1, 3), r = d.int(1, 3), m = d.int(6, 12), kind = d.int(0, 1);
      const eq = nb(VX + sup(2) + ' ' + MINUS + ' ' + 2 * p + VN + VX + ' + ' + (p === 1 ? '' : p * p) + VN + sup(2) + ' ' + MINUS + ' ' + r * r + ' = 0');
      const c = kind === 0 ? [-r * r, 2 * p, p * p, 0] : [2 * r * r, 0, 2 * p * p, 0], v = powSum(c, m);
      const ask = kind === 0 ? par(AL('k') + ' + ' + BE('k') + ' + ' + AL('k') + BE('k')) : par(AL('k') + sup(2) + ' + ' + BE('k') + sup(2));
      return val(`${VX}에 대한 이차방정식 ${eq}의 두 근을 ${AL('n')}, ${BE('n')}이라 할 때, ${SK(m, ask)}의 값은?`, v, {
        explain: `근과 계수의 관계에서 ${nb(AL('n') + ' + ' + BE('n') + ' = ' + 2 * p + VN)}, ${nb(AL('n') + BE('n') + ' = ' + (p === 1 ? '' : p * p) + VN + sup(2) + ' ' + MINUS + ' ' + r * r)}이다. ${kind === 0 ? '' : nb(AL('k') + sup(2) + ' + ' + BE('k') + sup(2) + ' = (' + AL('k') + ' + ' + BE('k') + ')' + sup(2) + ' ' + MINUS + ' 2' + AL('k') + BE('k')) + '이므로 '}${nb(SK(m, ask) + ' = ' + SK(m, par(pk([[c[2], 2], [c[1], 1], [c[0], 0]]))))} = ${powTold(c, m)}이다.`,
        facts: { value: powExpr(c, m), derived: [6].concat(c.map(Math.abs)) }
      });
    }),
    T('use-rem', '나머지정리로 만든 일반항의 Σ', '①51', (d) => {
      const c = d.pick([2, 3]), u = d.int(1, 3), w = d.int(1, 6), m = d.int(6, 12), a2 = c * c - c, a1 = w - c * u;
      if (a1 === 0) return null;
      const cf = [0, a1, a2, 0], v = powSum(cf, m);
      const P = nb(ms('P(x)') + ' = ' + VX + sup(2) + ' ' + MINUS + ' (' + VN + ' + ' + u + ')' + VX + ' + ' + (w === 1 ? '' : w) + VN);
      const div = nb(VX + ' ' + MINUS + ' ' + c + VN);
      return val(`자연수 ${VN}에 대하여 다항식 ${jh(P, '을/를')} ${jh(div, '으로/로')} 나누었을 때의 나머지를 ${AN}이라 할 때, ${SK(m, AK)}의 값은?`, v, {
        explain: `나머지정리에 의하여 ${nb(AN + ' = ' + ms('P') + '(' + c + VN + ') = ' + c * c + VN + sup(2) + ' ' + MINUS + ' (' + VN + ' + ' + u + ') × ' + c + VN + ' + ' + (w === 1 ? '' : w) + VN + ' = ' + nk([[a2, 2], [a1, 1]], VN))}이다. 따라서 ${powTold(cf, m)}이다.`,
        facts: { value: powExpr(cf, m), derived: [6, a2, Math.abs(a1)] }
      });
    }),
    T('use-coord', '좌표평면의 도형으로 만든 일반항의 Σ', '①52', (d, n) => {
      if (n === 0) {
        // 직선 x = k 가 y = ax, y = bx 와 만나는 점 A_k, B_k — 사다리꼴 A_k B_k B_{k+1} A_{k+1} 의 넓이 T_k = (a − b)(2k + 1)/2
        const [a, bq, bName, bText] = d.pick([[2, Q(1, 2), 'y=x/2', frac(1, 2) + VX], [3, Q(1), 'y=x', VX], [4, Q(1), 'y=x', VX], [3, Q(1, 2), 'y=x/2', frac(1, 2) + VX]]);
        const m = d.pick([10, 12, 14, 16, 18, 20]), diff = qsub(Q(a), bq), v = qmul(diff, Q(m * (m + 2), 2));
        if (!isInt(v)) return null;
        const bv = bq.p / bq.q, figure = plot({
          x: [0, 3.7], y: [0, a * 3.5], ys: 240 / (a * 3.5 * ((270 - 46) / 3.7)), xt: [1, 2, 3],
          lines: [{ a, b: 0, name: 'y=' + a + 'x' }, { a: bv, b: 0, name: bName }],
          fill: [{ f: (x) => a * x, g: (x) => bv * x, from: 1, to: 2 }],
          segs: [1, 2, 3].map((k) => ({ p: [k, bv * k], q: [k, a * k], dash: true })),
          dots: [{ x: 1, y: a, name: 'A_1', side: 'ul' }, { x: 2, y: 2 * a, name: 'A_2', side: 'ul' }, { x: 1, y: bv, name: 'B_1', side: 'ul' }, { x: 2, y: 2 * bv, name: 'B_2', side: 'r' }],
          say: `칠한 부분은 사각형 A_1B_1B_2A_2이다.`
        });
        return val(`그림과 같이 자연수 ${K}에 대하여 직선 ${nb(VX + ' = ' + K)}가 두 직선 ${nb(V('y') + ' = ' + a + VX)}, ${nb(V('y') + ' = ' + bText)}와 만나는 점을 각각 ${ms('A_k')}, ${ms('B_k')}라 하자. 사각형 ${ms('A_kB_kB_{k+1}A_{k+1}')}의 넓이를 ${ms('T_k')}라 할 때, ${SK(m, ms('T_k'))}의 값은?`, v, {
          figure,
          explain: `${nb(ms('A_kB_k') + ' = ' + a + K + ' ' + MINUS + ' ' + bText.replace(VX, K) + ' = ' + tq(diff) + K)}이므로 사다리꼴의 넓이는 ${nb(ms('T_k') + ' = ' + frac(1, 2) + ' × {' + tq(diff) + K + ' + ' + tq(diff) + '(' + K + ' + 1)} × 1 = ' + tq(qmul(diff, Q(1, 2))) + '(2' + K + ' + 1)')}이다. 따라서 ${nb(SK(m, ms('T_k')) + ' = ' + tq(qmul(diff, Q(1, 2))) + ' × (2 × ' + s1(m) + ' + ' + m + ') = ' + tq(v))}이다.`,
          facts: { value: `(${a}-${bq.p}/${bq.q})/2*(2*${e1(m)}+${m})` }
        });
      }
      const m = d.int(6, 14), c = [2, 4, 4, 0], v = powSum(c, m);
      const figure = plot({
        x: [0, 10.2], y: [0, 3.6], ys: 2.2, xt: [1, 4, 9], yt: [1, 2, 3],
        curves: [{ f: (x) => Math.sqrt(Math.max(x, 0)), from: 0, to: 10.2, name: 'y=√x' }],
        lines: [{ y: 1, dash: true }, { y: 2, dash: true }, { y: 3, dash: true }],
        segs: [{ p: [1, 1], q: [4, 2] }, { p: [4, 2], q: [9, 3] }],
        dots: [{ x: 1, y: 1, name: 'A_1', side: 'ul' }, { x: 4, y: 2, name: 'A_2', side: 'ul' }, { x: 9, y: 3, name: 'A_3', side: 'ul' }]
      });
      return val(`그림과 같이 자연수 ${K}에 대하여 직선 ${nb(V('y') + ' = ' + K)}가 곡선 ${nb(V('y') + ' = ' + rt(VX))}와 만나는 점을 ${ms('A_k')}라 하자. 두 점 ${ms('A_k')}, ${ms('A_{k+1}')} 사이의 거리를 ${ms('l_k')}라 할 때, ${SK(m, ms('l_k^2'))}의 값은?`, v, {
        figure,
        explain: `${nb(ms('A_k') + '(' + kp(2) + ', ' + K + ')')}이므로 ${nb(ms('l_k^2') + ' = {' + ms('(k+1)^2') + ' ' + MINUS + ' ' + kp(2) + '}' + sup(2) + ' + 1' + sup(2) + ' = ' + pk([[4, 2], [4, 1], [2, 0]]))}이다. 따라서 ${powTold(c, m)}이다.`,
        facts: { value: powExpr(c, m), derived: [4, 6] }
      });
    }, { count: 2 }),
    T('use-count', '쌓기와 점 배열의 개수를 Σ로 구하기', '①53', (d, n) => {
      if (n === 0) {
        const tri = d.bool(), m = d.int(6, tri ? 20 : 18), v = tri ? m * (m + 1) * (m + 2) / 6 : s2(m);
        const each = tri ? `위에서 ${K}번째 층에는 정육면체를 ${nb('1 + 2 + ⋯ + ' + K)}개 놓는다` : `위에서 ${K}번째 층에는 정육면체를 가로, 세로로 ${K}개씩 정사각형 모양으로 ${nb(K + ' × ' + K)}개 놓는다`;
        const [x1, x2, x3] = tri ? [1, 4, 10] : [1, 5, 14];
        if (v > 9999) return null;
        return N(`크기가 같은 정육면체를 쌓아 ${VN}층의 탑을 만든다. ${each}. ${VN}층의 탑을 만드는 데 쓴 정육면체의 개수를 ${AN}이라 하면 ${nb(A_(1) + ' = ' + x1)}, ${nb(A_(2) + ' = ' + x2)}, ${nb(A_(3) + ' = ' + x3)}이다. ${A_(m)}의 값은?`, v, {
          explain: tri
            ? `${K}번째 층의 개수는 ${frac(ms('k(k+1)'), 2)}이므로 ${nb(A_(m) + ' = ' + SK(m, frac(ms('k(k+1)'), 2)) + ' = ' + frac(1, 2) + '(' + s2(m) + ' + ' + s1(m) + ') = ' + v)}이다.`
            : `${K}번째 층의 개수는 ${kp(2)}이므로 ${nb(A_(m) + ' = ' + SK(m, kp(2)) + ' = ' + frac(`${m} × ${m + 1} × ${2 * m + 1}`, 6) + ' = ' + v)}이다.`,
          facts: { value: tri ? `${m}*(${m}+1)*(${m}+2)/6` : e2(m), derived: [6] }
        });
      }
      const m = d.int(6, 20), x = m * (m + 1) / 2, y = (m + 1) * (m + 1);
      return M(`그림과 같이 점을 정삼각형 모양으로 늘어놓을 때, ${VN}번째 모양의 점의 개수를 ${AN}이라 하자. ${jh(A_(m), '과/와')} ${nb(A_(m) + ' + ' + A_(m + 1))}의 값은?`, [{ label: A_(m), answer: x }, { label: nb(A_(m) + ' + ' + A_(m + 1)), answer: y }], {
        figure: dotsTri(4),
        shown: `${x}, ${y}`,
        explain: `${VN}번째 모양은 점이 위에서부터 1개, 2개, …, ${VN}개 있으므로 ${nb(AN + ' = ' + SK('n', K) + ' = ' + frac(ms('n(n+1)'), 2))}이다. ${nb(A_(m) + ' = ' + x)}, ${nb(A_(m + 1) + ' = ' + (m + 1) * (m + 2) / 2)}이므로 합은 ${y}이다. 이웃한 두 삼각수의 합은 제곱수 ${(m + 1)}${sup(2)}이다.`,
        facts: { calc: [[`${m}*(${m}+1)/2`, 0], [`(${m}+1)*(${m}+1)`, 1]] }
      });
    }, { count: 2 })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
