// 고등학교 1학년 1학기 3단원 복소수와 이차방정식 — 뒤쪽 묶음
// (이차방정식의 근의 판별, 판별식으로 미정계수 정하기, 근과 계수의 관계와 식의 값, 근과 계수의 관계로 계수와 근 구하기,
//  두 수를 근으로 하는 이차방정식, 켤레근과 잘못 보고 푼 이차방정식).
// 싣는 기준과 뺀 것은 10-1-3a.js 머리에 모아 적었다. ref: ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
//  - 이차방정식은 계수가 실수인 것만 다룬다. 「앞으로 특별한 말이 없으면 해는 복소수의 범위에서 생각한다」(교과서)를 따른다.
//  - 답: 허근은 「x = [±][ ] ± √[ ] i」, 「x = ([±][ ] ± √[ ] i)/[ ]」, 정수 두 근은 「x = [±][ ] 또는 x = [±][ ]」(차례는 따지지 않는다),
//    이차방정식은 「x² [±][ ]x [±][ ] = 0」, 범위는 「k [부등호] [±][ ]」(경계가 분수이면 분수 칸), 판별은 세 가지(서로 다른 두 실근 / 중근 / 서로 다른 두 허근) 가운데 고르기.
//    한 유형의 칸 모양은 씨앗·차례가 바뀌어도 같다. 계수가 분수인 이차방정식·인수분해는 고르기로 낸다.
//  - 판별식 조건이 k에 대한 이차부등식으로 남는 꼴은 k² < c 처럼 제곱만 견주면 되는 것만 싣는다(인수분해해 푸는 이차부등식은 뒤 단원).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, N, M, C, inline, NAMES, name } = B.kit;
  const { MINUS, gcd, Q, qadd, qsub, qmul, qdiv, qneg, qabs, qcmp, isInt, mag, tx, tail, V, sup, nz, ansV, asQ, rt, grp, sqParts, claimQ } = B.kit.mid;
  const K = B.kit.m1013, nb = K.nb;  // 긴 식은 기호 앞에서 줄이 갈릴 수 있게 나눠 붙인다(10-1-3a.js)
  const { UNIT, T, iq, sT, jn, jq, I, X, X2, va, vb, vc, vk, vm, AL, BE, moreH, sumH, endJ, ej, exq, cz, cadd, csub, cmul, cconj, cdiv, cint, cxH, cxP, NOTE01, NOTEF, valsQ, choose, pickSets, P, polyH } = K;

  // ── 이차방정식 ──
  const isSq = (n) => n >= 0 && Number.isInteger(Math.sqrt(n));
  const sqFree = (n) => n >= 2 && sqParts(n)[0] === 1;
  const SQFREE = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15, 17, 19, 21, 22, 23];
  const eqH = (L, R) => nb(L + ' = ' + R);
  const sqN = (n) => (n < 0 ? '(' + iq(n) + ')' : String(n)) + sup(2);   // (−2)², 3²
  const pN = (n) => (n < 0 ? '(' + iq(n) + ')' : String(n));             // 곱하는 자리의 음수는 괄호
  const quadH = (a, b, c, v) => polyH(P(c, b, a), v);                         // ax² + bx + c
  const KINDS = ['서로 다른 두 실근', '중근(서로 같은 두 실근)', '서로 다른 두 허근'];
  const kindOf = (D) => (D > 0 ? 0 : D === 0 ? 1 : 2);
  // 판별 고르기: 보기는 늘 같은 차례(서로 다른 두 실근 / 중근 / 서로 다른 두 허근)
  const judgeQ = (text, D, o) => C(text, KINDS.slice(), kindOf(D), Object.assign({}, o, { facts: Object.assign({ truth: KINDS.map((_, i) => i === kindOf(D)), want: true }, (o && o.facts) || {}) }));
  // 근이 p ± √t i(p 는 0이 아닌 정수, t 는 제곱인 수를 인수로 갖지 않는 2 이상의 수)
  const rootPT = (text, p, t, o) => inline(text, `${X} = {0} ± ` + rt('{1}') + I, [{ answer: p, signed: true }, { answer: t }], Object.assign({}, o, { shown: nb(`${X} = ${iq(p)} ± ${rt(t)}${I}`) }));
  // 근이 (p ± √t i)/r
  const rootPTR = (text, p, t, r, o) => inline(text, `${X} = ` + frac('{0} ± ' + rt('{1}') + I, '{2}'), [{ answer: p, signed: true }, { answer: t }, { answer: r }], Object.assign({}, o, { shown: nb(X + ' = ' + frac(`${iq(p)} ± ${rt(t)}${I}`, r)) }));
  // 정수 두 근: 「x = [±][ ] 또는 x = [±][ ]」(차례는 따지지 않는다)
  function rootsAns(text, r1, r2, o) {
    if (!Number.isInteger(r1) || !Number.isInteger(r2) || r1 === r2 || r1 === -r2) throw new Error('두 근 칸: 서로 다르고 부호만 다르지 않은 정수');
    return inline(text, grp(`${X} = {0}`) + ' 또는 ' + grp(`${X} = {1}`), [{ answer: r1, signed: true }, { answer: r2, signed: true }], Object.assign({}, o, { unordered: true, shown: `${nb(X + ' = ' + iq(r1))} 또는 ${nb(X + ' = ' + iq(r2))}` }));
  }
  // x² + bx + c = 0 꼴의 이차방정식을 답하는 칸
  const eqAns = (text, b, c, o) => inline(text + NOTE01, `${X2} {0}${X} {1} = 0`, [{ answer: b, signed: true }, { answer: c, signed: true }], Object.assign({}, o, { shown: nb(quadH(1, b, c) + ' = 0') }));
  // 범위 「k [부등호] [±][ ]」 — 경계가 정수가 아니면 「k [부등호] [±][ ]/[ ]」
  const REL = { '<': '&lt;', '<=': '≤', '>': '&gt;', '>=': '≥' };
  function rangeAns(text, nameH, rel, q, o) {
    const opt = o || {};
    if (isInt(q)) return inline(text, `${nameH} {0} {1}`, [{ rel: true, answer: rel }, { answer: q.p, signed: true }], Object.assign({}, opt, { shown: nb(`${nameH} ${REL[rel]} ${iq(q.p)}`) }));
    return inline(text + NOTEF, `${nameH} {0} ` + frac('{1}', '{2}'), [{ rel: true, answer: rel }, { answer: q.p, signed: true }, { answer: q.q }], Object.assign({}, opt, { shown: nb(`${nameH} ${REL[rel]} ${tx(q)}`) }));
  }
  // 판별식의 부호 조건: [말, 부등호(D 쪽)]
  const CONDS = [['실근을 갖도록', '>='], ['서로 다른 두 실근을 갖도록', '>'], ['서로 다른 두 허근을 갖도록', '<']];
  // D = A·k + C0 (A ≠ 0)가 조건 rel 을 만족시키는 k 의 범위: [부등호, 경계]
  function kRange(A, C0, rel) {
    const bound = Q(-C0, A), flip = A < 0, r = { '>': flip ? '<' : '>', '>=': flip ? '<=' : '>=', '<': flip ? '>' : '<' }[rel];
    return [r, bound];
  }
  const DD = V('D');
  const relWord = { '>': nb(DD + ' &gt; 0'), '>=': nb(DD + ' ≥ 0'), '<': nb(DD + ' &lt; 0') };

  // ── 이차방정식의 근의 판별 ──
  B.addTypes(UNIT, 'disc', [
    T('disc-solve', '복소수의 범위에서 이차방정식 풀기', '②1', (d, n) => {
      if (n === 0) {
        const p = nz(d, -5, 5), t = d.pick(SQFREE.slice(0, 10)), b = -2 * p, c = p * p + t, form = d.int(0, 2);
        const eq = form === 0 ? eqH(quadH(1, b, c), '0') : form === 1 ? eqH(nb(X2 + moreH([[c, '']])), sumH([[-b, X]])) : eqH(nb(X + '(' + X + moreH([[b, '']]) + ')'), iq(-c));
        return rootPT(`이차방정식 ${ej(eq, '을/를')} 푸시오.`, p, t, {
          explain: `${form === 0 ? '' : `이항하여 정리하면 ${nb(quadH(1, b, c) + ' = 0')}이다. `}근의 공식에서 ${nb(X + ' = ' + iq(p) + ' ± ' + rt(`${iq(p * p)} ${MINUS} ${c}`))} = ${nb(iq(p) + ' ± ' + rt(MINUS + t))} = ${nb(iq(p) + ' ± ' + rt(t) + I)}이다.`,
          facts: { calc: [[`0-(${jn(b)})/2`, 0], [`(4*${c}-(${jn(b)})*(${jn(b)}))/4`, 1]], derived: [2, 4], rule: 'solve-pt' }
        });
      }
      const r = d.int(2, 5), p = nz(d, -7, 7), t = d.pick(SQFREE.slice(0, 8));
      let a = r * r, b = -2 * p * r, c = p * p + t;
      const g = gcd(gcd(a, Math.abs(b)), c); a /= g; b /= g; c /= g;
      if (a > 12 || Math.abs(b) > 30 || c > 60) return null;
      // 근의 공식으로 다시 셈한 꼴: (−b ± s√t i)/(2a) 를 G = gcd(b, s, 2a) 로 약분
      const s2 = 4 * a * c - b * b, s = Math.sqrt(s2 / t), G = gcd(gcd(Math.abs(b), s), 2 * a);
      if (!Number.isInteger(s) || -b / G !== p || s / G !== 1 || 2 * a / G !== r) return null;
      const form = d.int(0, 1), c1 = form ? nz(d, -5, 5) : 0;
      if (form && c + c1 === 0) return null;
      const eq = form === 0 ? eqH(quadH(a, b, c), '0') : eqH(polyH(P(c + c1, b, a)), iq(c1)), cE = form ? `(${jn(c + c1)}-${jn(c1)})` : jn(c);
      return rootPTR(`이차방정식 ${ej(eq, '을/를')} 푸시오.`, p, t, r, {
        explain: `${form === 0 ? '' : `이항하여 정리하면 ${nb(quadH(a, b, c) + ' = 0')}이다. `}근의 공식에서 ${X} = ${frac(nb(iq(-b) + ' ± ' + rt(`${iq(b * b)} ${MINUS} ${4 * a * c}`)), String(2 * a))} = ${frac(nb(iq(-b) + ' ± ' + (s === 1 ? '' : s) + rt(t) + I), String(2 * a))}${G > 1 ? ' = ' + frac(nb(iq(p) + ' ± ' + rt(t) + I), r) : ''}이다.`,
        facts: { calc: [[`0-(${jn(b)})/${G}`, 0], [`(4*${a}*${cE}-(${jn(b)})*(${jn(b)}))/(${s}*${s})`, 1], [`2*${a}/${G}`, 2]], derived: [G, s, 2, 4], rule: 'solve-ptr' }
      });
    }, { count: 2 }),
    T('disc-pick', '주어진 수 가운데 이차방정식의 근 고르기', '②2', (d) => {
      const p = nz(d, -5, 5), q = d.int(1, 5) * (d.bool() ? 1 : -1), b = -2 * p, c = p * p + q * q;
      const f = (u) => cadd(cadd(cmul(u, u), cmul(cz(b), u)), cz(c));
      const cand = [cz(p, q), cz(-p, q), cz(-p, -q), cz(q, p), cz(p + q, 0), cz(p, 2 * q), cz(q, -p)];
      const rows = [];
      for (const u of cand) { const ok = f(u).r.p === 0 && f(u).m.p === 0; if (!rows.some((r) => r[0] === cxH(u))) rows.push([cxH(u), ok]); }
      const right = rows.filter((r) => r[1]), wrong = d.shuffle(rows.filter((r) => !r[1])).slice(0, 4);
      if (right.length !== 1 || wrong.length < 4) return null;
      return choose(d, `다음 가운데 이차방정식 ${nb(quadH(1, b, c) + ' = 0')}의 근인 것은?`, right.concat(wrong), {
        explain: `근의 공식에서 ${nb(X + ' = ' + iq(p) + ' ± ' + rt(`${iq(p * p)} ${MINUS} ${c}`) + ' = ' + iq(p) + ' ± ' + (Math.abs(q) === 1 ? '' : Math.abs(q)) + I)}이므로 보기 가운데 근은 ${right[0][0]}이다. 이 수를 넣으면 좌변이 0이 되고, 나머지는 넣어도 0이 되지 않는다.`
      });
    }),
    T('disc-judge', '판별식으로 이차방정식의 근 판별하기', '②3', (d, n) => {
      const kind = d.int(0, 2);
      let a, b, c;
      if (kind === 1) { const m = d.int(1, 4), k = nz(d, -6, 6), e = d.pick([1, 1, 2]); a = e * m * m; b = 2 * e * m * k; c = e * k * k; }
      else { a = d.int(1, 5); b = nz(d, -9, 9); c = nz(d, -9, 9); if (kind === 0 ? b * b - 4 * a * c <= 0 : b * b - 4 * a * c >= 0) return null; }
      const D = b * b - 4 * a * c;
      if (n === 0) {
        return judgeQ(`이차방정식 ${nb(quadH(a, b, c) + ' = 0')}의 근을 판별한 것은?`, D, {
          explain: `판별식 ${nb(DD + ' = ' + (b < 0 ? '(' + iq(b) + ')' : b) + sup(2) + ' ' + MINUS + ' 4 × ' + a + ' × ' + (c < 0 ? '(' + iq(c) + ')' : c) + ' = ' + iq(D) + (D > 0 ? ' &gt; 0' : D === 0 ? '' : ' &lt; 0'))}이므로 ${KINDS[kindOf(D)]}을 갖는다.`,
          facts: { rule: 'judge' }
        });
      }
      // 정리해야 보이는 꼴: (x + u)² = vx + w, ux(x + v) = x(x + w) + z, a′x² + b′x = c′x² + d′x + e′
      const form = d.int(0, 2);
      let eq;
      if (form === 0 && a === 1 && b % 2 === 0) { const u = nz(d, -5, 5), v = 2 * u - b, w = u * u - c; if (v === 0 || w === 0) return null; eq = eqH(nb('(' + X + moreH([[u, '']]) + ')' + sup(2)), sumH([[v, X], [w, '']])); }
      else { const e = d.int(1, 3), g = nz(d, -5, 5); eq = eqH(polyH(P(0, b + g, a + e)), polyH(P(-c, g, e))); if (b + g === 0 || g === 0) return null; }
      return judgeQ(`이차방정식 ${eq}의 근을 판별한 것은?`, D, {
        explain: `우변의 항을 이항하여 정리하면 ${nb(quadH(a, b, c) + ' = 0')}이다. 판별식 ${nb(DD + ' = ' + iq(D) + (D > 0 ? ' &gt; 0' : D === 0 ? '' : ' &lt; 0'))}이므로 ${KINDS[kindOf(D)]}을 갖는다.`,
        facts: { rule: 'judge-arrange' }
      });
    }, { count: 2 }),
    T('disc-claim', '판별식과 근에 대한 설명의 참·거짓', '②4 ②33', (d, n) => {
      if (n === 0) {
        const yes = [
          `${nb(va + vc + ' &lt; 0')}이면 서로 다른 두 실근을 갖는다.`,
          `복소수의 범위에서 항상 근을 갖는다.`,
          `${nb(DD + ' = 0')}이면 중근을 갖는다.`,
          `${nb(vb + ' = 0')}이고 ${nb(va + vc + ' &gt; 0')}이면 서로 다른 두 허근을 갖는다.`,
          `한 근이 ${nb(V('p') + ' + ' + V('q') + I)}(${V('p')}, ${V('q')}는 실수, ${nb(V('q') + ' ≠ 0')})이면 다른 한 근은 ${nb(V('p') + ' ' + MINUS + ' ' + V('q') + I)}이다.`
        ];
        const no = [
          [`${nb(va + vc + ' &gt; 0')}이면 서로 다른 두 허근을 갖는다.`, `${nb(X2 + ' + 3' + X + ' + 1 = 0')}은 ${nb(va + vc + ' &gt; 0')}이지만 ${nb(DD + ' = 5 &gt; 0')}이다.`],
          [`${nb(DD + ' &lt; 0')}이면 근이 없다.`, `${nb(DD + ' &lt; 0')}이면 복소수의 범위에서 서로 다른 두 허근을 갖는다.`, '복소수의 범위에서 항상 근을 갖는다.'],
          [`${nb(DD + ' ≥ 0')}이면 서로 다른 두 실근을 갖는다.`, `${nb(DD + ' = 0')}이면 중근을 갖는다.`, `${nb(DD + ' = 0')}이면 중근을 갖는다.`],
          [`실근을 가지려면 ${nb(DD + ' &gt; 0')}이어야 한다.`, `중근도 실근이므로 실근을 가질 조건은 ${nb(DD + ' ≥ 0')}이다.`],
          [`${nb(vc + ' = 0')}이면 중근을 갖는다.`, `${nb(vc + ' = 0')}이면 ${nb(DD + ' = ' + vb + sup(2))}이므로 ${nb(vb + ' ≠ 0')}일 때 서로 다른 두 실근을 갖는다.`]
        ];
        const want = d.bool();
        return claimQ(d, `계수가 실수인 이차방정식 ${nb(va + X2 + ' + ' + vb + X + ' + ' + vc + ' = 0')}의 판별식을 ${DD}라 할 때, 다음 설명 가운데 ${want ? '옳은' : '옳지 않은'} 것은?`, yes, no, want);
      }
      // k의 값에 관계없이 항상 서로 다른 두 실근을 갖는 것: D(k) = Ak² + Bk + C 가 늘 양수인가
      const opt = (a, b1, b0, c2, c1, c0) => ({ a, b1, b0, c2, c1, c0, A: b1 * b1 - 4 * a * c2, B: 2 * b1 * b0 - 4 * a * c1, C: b0 * b0 - 4 * a * c0 });
      const always = (o) => (o.A > 0 && o.B * o.B - 4 * o.A * o.C < 0) || (o.A === 0 && o.B === 0 && o.C > 0);
      const hH = (o) => {
        const xt = o.b1 !== 0 && o.b0 !== 0 ? ' + (' + sumH([[o.b1, vk], [o.b0, '']]) + ')' + X : o.b1 !== 0 ? moreH([[o.b1, vk + X]]) : moreH([[o.b0, X]]);
        return nb((o.a === 1 ? '' : o.a) + X2 + xt + moreH([[o.c2, vk + sup(2)], [o.c1, vk], [o.c0, '']]) + ' = 0');
      };
      const a = d.int(1, 3), c = d.int(1, 6), e = d.int(1, 5);
      const goods = [opt(a, 1, 0, 0, 0, -c), opt(1, -2, 0, 1, 0, -e)];
      const bads = [opt(1, 1, 0, 0, 0, c), opt(1, -2, 0, 1, 0, 0), opt(1, 2, 0, 1, 0, e), opt(a, 0, d.int(1, 5), 0, 1, 0), opt(1, -1, 0, 0, 0, e)];
      const good = d.pick(goods), rows = [[hH(good), always(good)]].concat(d.shuffle(bads).slice(0, 4).map((o) => [hH(o), always(o)]));
      return choose(d, `다음 ${X}에 대한 이차방정식 가운데 실수 ${vk}의 값에 관계없이 항상 서로 다른 두 실근을 갖는 것은?`, rows, {
        explain: `${rows[0][0]}의 판별식은 ${good.c1 === 0 && good.c2 === 0 ? `${nb(DD + ' = ' + vk + sup(2) + ' + ' + 4 * good.a * Math.abs(good.c0))}` : `${nb(DD + '/4 = ' + vk + sup(2) + ' ' + MINUS + ' (' + vk + sup(2) + ' ' + MINUS + ' ' + Math.abs(good.c0) + ') = ' + Math.abs(good.c0))}`}이므로 ${vk}의 값에 관계없이 ${DD} &gt; 0이다. 나머지는 ${vk}의 값에 따라 ${DD}가 0 이하가 되거나, ${vk}의 값에 관계없이 ${DD} ≤ 0이다.`,
        facts: { rule: 'always-real' }
      });
    }, { count: 2 }),
    T('disc-letter', '문자 계수의 이차방정식의 근 판별하기', '②5', (d) => {
      const m = d.int(1, 3), nn = d.int(-3, 3), k = nz(d, -5, 5) * (d.int(0, 4) === 0 ? 0 : 1);
      // x² − 2(ma + n)x + (ma + n)² + k = 0 → D/4 = −k
      const lin = sumH([[m, va], [nn, '']]), cst = sumH([[m * m, va + sup(2)], [2 * m * nn, va], [nn * nn + k, '']]);
      const D = -k;
      return judgeQ(`${va}가 실수일 때, ${X}에 대한 이차방정식 ${nb(X2 + ' ' + MINUS + ' 2(' + lin + ')' + X + moreH([[m * m, va + sup(2)], [2 * m * nn, va], [nn * nn + k, '']]) + ' = 0')}의 근을 판별한 것은?`, D, {
        explain: `${nb(DD + '/4 = (' + lin + ')' + sup(2) + ' ' + MINUS + ' (' + cst + ') = ' + iq(-k) + (D > 0 ? ' &gt; 0' : D === 0 ? '' : ' &lt; 0'))}이므로 ${va}의 값에 관계없이 ${KINDS[kindOf(D)]}을 갖는다.`,
        facts: { rule: 'judge-letter' }
      });
    })
  ]);

  // ── 판별식으로 미정계수 정하기 ──
  B.addTypes(UNIT, 'kval', [
    T('kval-range', '판별식으로 k의 값 또는 범위 구하기', '②7', (d, n) => {
      if (n === 0) {
        // x² + Bx + s·k + c = 0 (B 짝수): D/4 = B²/4 − s·k − c
        const h = nz(d, -5, 5), B2 = 2 * h, s = d.pick([1, -1]), c = nz(d, -9, 9), [word, rel] = d.pick(CONDS);
        const [r, bound] = kRange(-s, h * h - c, rel);
        const eq = nb(X2 + moreH([[B2, X], [s, vk], [c, '']]) + ' = 0');
        return rangeAns(`이차방정식 ${eq}이 ${word} 하는 실수 ${vk}의 값의 범위는?`, vk, r, bound, {
          explain: `판별식 ${nb(DD + '/4 = ' + sqN(h) + ' ' + MINUS + ' (' + sumH([[s, vk], [c, '']]) + ') = ' + sumH([[-s, vk], [h * h - c, '']]))}이고 ${relWord[rel]}이어야 하므로 ${nb(vk + ' ' + REL[r] + ' ' + iq(bound.p))}이다.`,
          facts: { calc: [[`${jn(s)}*(${jn(h)}*${jn(h)}-${jn(c)})`, 1]], derived: [h * h, Math.abs(h)], rule: 'range-int' }
        });
      }
      if (n === 1) {
        // x² + 2kx + k² + uk = vx + w → x² + (2k − v)x + (k² + uk − w) = 0, D = −4(u + v)k + v² + 4w
        const u = nz(d, -4, 4), v = nz(d, -5, 5), w = nz(d, -6, 6), A = -4 * (u + v), C0 = v * v + 4 * w, [word, rel] = d.pick(CONDS);
        if (A === 0) return null;
        const [r, bound] = kRange(A, C0, rel);
        if (isInt(bound)) return null;
        const L = nb(X2 + ' + 2' + vk + X + ' + ' + vk + sup(2) + moreH([[u, vk]])), R = sumH([[v, X], [w, '']]);
        return rangeAns(`이차방정식 ${ej(eqH(L, R), '이/가')} ${word} 하는 실수 ${vk}의 값의 범위는?`, vk, r, bound, {
          explain: `우변을 이항하면 ${nb(X2 + ' + (2' + vk + moreH([[-v, '']]) + ')' + X + ' + ' + vk + sup(2) + moreH([[u, vk], [-w, '']]) + ' = 0')}이다. 판별식 ${nb(DD + ' = (2' + vk + moreH([[-v, '']]) + ')' + sup(2) + ' ' + MINUS + ' 4(' + vk + sup(2) + moreH([[u, vk], [-w, '']]) + ') = ' + sumH([[A, vk], [C0, '']]))}이고 ${relWord[rel]}이어야 하므로 ${nb(vk + ' ' + REL[r] + ' ' + tx(bound))}이다.`,
          facts: { calc: [[`(${jn(v)}*${jn(v)}+4*${jn(w)})*${bound.q}/(4*(${jn(u)}+${jn(v)}))`, 1], [`4*(${jn(u)}+${jn(v)})*${bound.p}/(${jn(v)}*${jn(v)}+4*${jn(w)})`, 2]], derived: [bound.q, Math.abs(bound.p), 4], rule: 'range-frac' }
        });
      }
      // 중근: x² − 2(k + p)x + k² + q = 0 → D/4 = 2pk + p² − q = 0
      const p = nz(d, -4, 4), q = nz(d, -9, 9), kv = Q(q - p * p, 2 * p);
      if (isInt(kv)) return null;
      const eq = nb(X2 + ' ' + MINUS + ' 2(' + vk + moreH([[p, '']]) + ')' + X + ' + ' + vk + sup(2) + moreH([[q, '']]) + ' = 0');
      return ansV(`이차방정식 ${eq}이 중근을 갖도록 하는 실수 ${vk}의 값은?`, kv, 'frac', {
        explain: `판별식 ${nb(DD + '/4 = (' + vk + moreH([[p, '']]) + ')' + sup(2) + ' ' + MINUS + ' (' + vk + sup(2) + moreH([[q, '']]) + ') = ' + sumH([[2 * p, vk], [p * p - q, '']]))}이고 중근을 가지려면 ${nb(DD + ' = 0')}이어야 하므로 ${nb(vk + ' = ' + tx(kv))}이다.`,
        facts: { value: `(${jn(q)}-${jn(p)}*${jn(p)})/(2*${jn(p)})`, derived: [2] }
      });
    }, { count: 3 }),
    T('kval-dsum', '중근을 갖도록 하는 모든 k의 값의 합', '②8', (d) => {
      // x² + (k + p)x + (qk + r) = 0: D = k² + (2p − 4q)k + p² − 4r = 0
      const p = nz(d, -5, 5), q = nz(d, -3, 3), r = nz(d, -6, 6), B1 = 2 * p - 4 * q, C1 = p * p - 4 * r;
      if (B1 * B1 - 4 * C1 <= 0 || B1 === 0) return null;
      const eq = nb(X2 + ' + (' + vk + moreH([[p, '']]) + ')' + X + moreH([[q, vk], [r, '']]) + ' = 0');
      return ansV(`이차방정식 ${eq}이 중근을 갖도록 하는 모든 실수 ${vk}의 값의 합은?`, Q(-B1), 'int', {
        explain: `판별식 ${nb(DD + ' = (' + vk + moreH([[p, '']]) + ')' + sup(2) + ' ' + MINUS + ' 4(' + sumH([[q, vk], [r, '']]) + ') = ' + sumH([[1, vk + sup(2)], [B1, vk], [C1, '']]))} = 0이다. 이 ${vk}에 대한 이차방정식은 판별식이 ${nb(sqN(B1) + ' ' + MINUS + ' 4 × ' + pN(C1) + ' &gt; 0')}이므로 서로 다른 두 실근을 갖고, 근과 계수의 관계에서 두 근의 합은 ${iq(-B1)}이다.`,
        facts: { value: `4*${jn(q)}-2*${jn(p)}`, derived: [2, 4] }
      });
    }),
    T('kval-int', '판별식 조건을 만족시키는 정수 k', '②9', (d, n) => {
      if (n === 0) {
        // x² + 2hx + (mk + c) = 0 이 서로 다른 두 허근(D/4 = h² − mk − c < 0) / 실근(≥ 0)
        const h = nz(d, -5, 5), m = nz(d, -3, 3), c = nz(d, -9, 9), imag = d.bool(), [r, bound] = kRange(-m, h * h - c, imag ? '<' : '>=');
        const want = r === '>' || r === '>=' ? 'min' : 'max';
        const v = want === 'min' ? (r === '>' ? Math.floor(bound.p / bound.q) + 1 : Math.ceil(bound.p / bound.q)) : (r === '<' ? Math.ceil(bound.p / bound.q) - 1 : Math.floor(bound.p / bound.q));
        const eq = nb(X2 + moreH([[2 * h, X], [m, vk], [c, '']]) + ' = 0');
        return ansV(`이차방정식 ${eq}이 ${imag ? '서로 다른 두 허근' : '실근'}을 갖도록 하는 정수 ${vk}의 ${want === 'min' ? '최솟값' : '최댓값'}은?`, Q(v), 'int', {
          explain: `판별식 ${nb(DD + '/4 = ' + sqN(h) + ' ' + MINUS + ' (' + sumH([[m, vk], [c, '']]) + ') = ' + sumH([[-m, vk], [h * h - c, '']]))}이고 ${imag ? relWord['<'] : relWord['>=']}이어야 하므로 ${nb(vk + ' ' + REL[r] + ' ' + tx(bound))}이다. 이를 만족시키는 정수 ${vk}의 ${want === 'min' ? '최솟값' : '최댓값'}은 ${iq(v)}이다.`,
          facts: { rule: 'int-' + want, value: jn(v), derived: [Math.abs(v)] }
        });
      }
      if (d.bool()) {
        // x² + Bx + mk + c = 0 이 실근(서로 다른 두 실근)을 갖는 자연수 k 의 개수 (m > 0)
        const Bc = nz(d, -9, 9), m = d.int(1, 3), c = nz(d, -6, 6), two = d.bool(), [r, bound] = kRange(-4 * m, Bc * Bc - 4 * c, two ? '>' : '>=');
        const flags = Array.from({ length: Math.max(3, Math.ceil(bound.p / bound.q) + 3) }, (_, i) => i + 1).map((k) => (two ? Bc * Bc - 4 * (m * k + c) > 0 : Bc * Bc - 4 * (m * k + c) >= 0));
        const cnt = flags.filter(Boolean).length;
        if (cnt < 1 || cnt > 12) return null;
        const eq = nb(X2 + moreH([[Bc, X], [m, vk], [c, '']]) + ' = 0');
        return N(`이차방정식 ${eq}이 ${two ? '서로 다른 두 실근' : '실근'}을 갖도록 하는 자연수 ${vk}의 개수는?`, cnt, {
          unit: '개',
          explain: `판별식 ${nb(DD + ' = ' + sqN(Bc) + ' ' + MINUS + ' 4(' + sumH([[m, vk], [c, '']]) + ') = ' + sumH([[-4 * m, vk], [Bc * Bc - 4 * c, '']]))}이고 ${two ? relWord['>'] : relWord['>=']}이어야 하므로 ${nb(vk + ' ' + REL[r] + ' ' + tx(bound))}이다. 이를 만족시키는 자연수 ${vk}는 ${cnt}개이다.`,
          facts: { count: flags }
        });
      }
      // x² + 2(k + p)x + k² + q = 0 (p < 0): D/4 = 2pk + p² − q > 0 → k < (p² − q)/(−2p) 인 자연수 k 의 개수
      const p = -d.int(1, 4), q = nz(d, -9, 9), flags = Array.from({ length: 14 }, (_, i) => i + 1).map((k) => 2 * p * k + p * p - q > 0), cnt = flags.filter(Boolean).length;
      if (cnt < 1 || cnt > 12) return null;
      const eq = nb(X2 + ' + 2(' + vk + moreH([[p, '']]) + ')' + X + ' + ' + vk + sup(2) + moreH([[q, '']]) + ' = 0');
      return N(`이차방정식 ${eq}이 서로 다른 두 실근을 갖도록 하는 자연수 ${vk}의 개수는?`, cnt, {
        unit: '개',
        explain: `판별식 ${nb(DD + '/4 = (' + vk + moreH([[p, '']]) + ')' + sup(2) + ' ' + MINUS + ' (' + vk + sup(2) + moreH([[q, '']]) + ') = ' + sumH([[2 * p, vk], [p * p - q, '']]))} &gt; 0에서 ${nb(vk + ' &lt; ' + tx(Q(p * p - q, -2 * p)))}이다. 이를 만족시키는 자연수 ${vk}는 ${cnt}개이다.`,
        facts: { count: flags }
      });
    }, { count: 2 }),
    T('kval-square', '판별식이 k² − c 꼴일 때의 정수 k', '②10 심2', (d, n) => {
      if (n === 0) {
        // x² − (k + 2m)x + mk + c = 0: D = k² − 4(c − m²)
        const m = nz(d, -3, 3), c = m * m + d.int(2, 12), NN = 4 * (c - m * m);
        const ks = Array.from({ length: 25 }, (_, i) => i - 12), flags = ks.map((k) => k * k < NN), cnt = flags.filter(Boolean).length;
        const eq = nb(X2 + ' ' + MINUS + ' (' + vk + moreH([[2 * m, '']]) + ')' + X + moreH([[m, vk], [c, '']]) + ' = 0');
        return N(`${X}에 대한 이차방정식 ${eq}이 서로 다른 두 허근을 갖도록 하는 정수 ${vk}의 개수는?`, cnt, {
          unit: '개',
          explain: `판별식 ${nb(DD + ' = (' + vk + moreH([[2 * m, '']]) + ')' + sup(2) + ' ' + MINUS + ' 4(' + sumH([[m, vk], [c, '']]) + ') = ' + vk + sup(2) + ' ' + MINUS + ' ' + NN + ' &lt; 0')}이므로 ${nb(vk + sup(2) + ' &lt; ' + NN)}이다. 이를 만족시키는 정수 ${vk}는 ${ks.filter((k) => k * k < NN).map(iq).join(', ')}의 ${cnt}개이다.`,
          facts: { count: flags }
        });
      }
      // x² + kx + c = 0 이 실근을 갖지 않는 자연수 k 의 합: k² < 4c
      const c = d.int(2, 15), list = Array.from({ length: 10 }, (_, i) => i + 1).filter((k) => k * k < 4 * c);
      return N(`이차방정식 ${nb(X2 + ' + ' + vk + X + ' + ' + c + ' = 0')}이 실근을 갖지 않도록 하는 모든 자연수 ${vk}의 값의 합은?`, list.reduce((s, v) => s + v, 0), {
        explain: `판별식 ${nb(DD + ' = ' + vk + sup(2) + ' ' + MINUS + ' ' + 4 * c + ' &lt; 0')}이어야 하므로 ${nb(vk + sup(2) + ' &lt; ' + 4 * c)}이다. 이를 만족시키는 자연수 ${vk}는 ${list.join(', ')}이므로 합은 ${list.reduce((s, v) => s + v, 0)}이다.`,
        facts: { calc: [[list.join('+'), 0]], derived: list }
      });
    }, { count: 2 }),
    T('kval-twoeq', '두 이차방정식의 판별식 조건을 함께 쓰기', '②11', (d) => {
      // ① x² + 2hx + (mk + c) = 0 이 서로 다른 두 실근, ② x² + (k + u)x + v² = 0 이 중근
      const h = nz(d, -4, 4), m = d.int(1, 3), c = nz(d, -6, 6), u = nz(d, -5, 5), v = d.int(1, 4);
      const ks = [-u + 2 * v, -u - 2 * v], ok = ks.map((k) => h * h - m * k - c > 0);
      if (ok.filter(Boolean).length !== 1) return null;
      const k = ks[ok.indexOf(true)], bound = Q(h * h - c, m);
      const e1 = nb(X2 + moreH([[2 * h, X], [m, vk], [c, '']]) + ' = 0'), e2 = nb(X2 + ' + (' + vk + moreH([[u, '']]) + ')' + X + ' + ' + v * v + ' = 0');
      return ansV(`이차방정식 ${ej(e1, '은/는')} 서로 다른 두 실근을 갖고, 이차방정식 ${ej(e2, '은/는')} 중근을 갖는다. 실수 ${vk}의 값은?`, Q(k), 'int', {
        explain: `첫째 방정식에서 ${nb(DD + '/4 = ' + sqN(h) + ' ' + MINUS + ' (' + sumH([[m, vk], [c, '']]) + ') &gt; 0')}이므로 ${nb(vk + ' &lt; ' + tx(bound))}이다. 둘째 방정식에서 ${nb(DD + ' = (' + vk + moreH([[u, '']]) + ')' + sup(2) + ' ' + MINUS + ' ' + 4 * v * v + ' = 0')}이므로 ${nb(vk + ' = ' + iq(ks[0]))} 또는 ${nb(vk + ' = ' + iq(ks[1]))}이다. 두 조건을 모두 만족시키는 것은 ${nb(vk + ' = ' + iq(k))}이다.`,
        facts: { value: jn(k), derived: [Math.abs(k)], rule: 'twoeq' }
      });
    }),
    T('kval-always-dbl', 'k의 값에 관계없이 항상 중근을 가질 조건', '②13', (d) => {
      // x² + 2(mk + p)x + m²k² + ak + b = 0: D/4 = (2mp − a)k + p² − b ≡ 0
      const m = d.int(1, 2), p = nz(d, -4, 4), a = 2 * m * p, b = p * p;
      const eq = nb(X2 + ' + 2(' + sumH([[m, vk], [p, '']]) + ')' + X + ' + ' + (m * m === 1 ? '' : m * m) + vk + sup(2) + ' + ' + va + vk + ' + ' + vb + ' = 0');
      return valsQ(`${X}에 대한 이차방정식 ${eq}이 실수 ${vk}의 값에 관계없이 항상 중근을 가질 때, 실수 ${va}, ${vb}의 값은?`, [['a', a], ['b', b]], {
        explain: `${nb(DD + '/4 = (' + sumH([[m, vk], [p, '']]) + ')' + sup(2) + ' ' + MINUS + ' (' + (m * m === 1 ? '' : m * m) + vk + sup(2) + ' + ' + va + vk + ' + ' + vb + ') = (' + sumH([[2 * m * p, '']]) + ' ' + MINUS + ' ' + va + ')' + vk + ' + ' + iq(p * p) + ' ' + MINUS + ' ' + vb)}이다. ${vk}의 값에 관계없이 ${nb(DD + ' = 0')}이려면 ${vk}에 대한 항등식이어야 하므로 ${nb(iq(2 * m * p) + ' ' + MINUS + ' ' + va + ' = 0')}, ${nb(iq(p * p) + ' ' + MINUS + ' ' + vb + ' = 0')}에서 ${nb(va + ' = ' + iq(a))}, ${nb(vb + ' = ' + iq(b))}이다.`,
        facts: { calc: [[`2*${m}*${jn(p)}`, 0], [`${jn(p)}*${jn(p)}`, 1]], derived: [2, m] }
      });
    })
  ]);

  // ── 근과 계수의 관계와 식의 값 ──
  // 두 근의 합 s, 곱 t(유리수)로 셈하는 식들
  B.addTypes(UNIT, 'vieta', [
    T('vieta-sp', '두 근의 합과 곱', '②15', (d, n) => {
      if (n === 0) {
        const a = d.int(2, 6), b = nz(d, -9, 9), c = nz(d, -9, 9), s = Q(-b, a), t = Q(c, a);
        if (isInt(s) || isInt(t) || gcd(gcd(a, Math.abs(b)), Math.abs(c)) !== 1) return null;
        return inline(`이차방정식 ${nb(quadH(a, b, c) + ' = 0')}의 두 근의 합과 곱을 구하시오.` + NOTEF, '두 근의 합 ' + frac('{0}', '{1}') + ', 두 근의 곱 ' + frac('{2}', '{3}'), [{ answer: s.p, signed: true }, { answer: s.q }, { answer: t.p, signed: true }, { answer: t.q }], {
          shown: `두 근의 합 ${tx(s)}, 두 근의 곱 ${tx(t)}`,
          explain: `근과 계수의 관계에서 두 근의 합은 ${nb(MINUS + frac(iq(b), a) + ' = ' + tx(s))}, 두 근의 곱은 ${nb(frac(iq(c), a) + ' = ' + tx(t))}이다.`,
          facts: { calc: [[`0-${jn(b)}/${gcd(Math.abs(b), a)}`, 0], [`${a}/${gcd(Math.abs(b), a)}`, 1], [`${jn(c)}/${gcd(Math.abs(c), a)}`, 2], [`${a}/${gcd(Math.abs(c), a)}`, 3]], derived: [gcd(Math.abs(b), a), gcd(Math.abs(c), a)] }
        });
      }
      // x² + px + q = rx + w → x² + (p − r)x + (q − w) = 0
      const p = nz(d, -9, 9), q = nz(d, -9, 9), r = nz(d, -6, 6), w = nz(d, -6, 6);
      if (p === r || q === w) return null;
      return M(`이차방정식 ${eqH(quadH(1, p, q), sumH([[r, X], [w, '']]))}의 두 근의 합과 곱을 구하시오.`, [{ label: '두 근의 합', answer: r - p, signed: true }, { label: '두 근의 곱', answer: q - w, signed: true }], {
        shown: `두 근의 합 ${iq(r - p)}, 두 근의 곱 ${iq(q - w)}`,
        explain: `우변을 이항하면 ${nb(quadH(1, p - r, q - w) + ' = 0')}이므로 두 근의 합은 ${iq(r - p)}, 두 근의 곱은 ${iq(q - w)}이다.`,
        facts: { calc: [[`${jn(r)}-${jn(p)}`, 0], [`${jn(q)}-${jn(w)}`, 1]] }
      });
    }, { count: 2 }),
    T('vieta-val', '두 근의 합과 곱으로 식의 값 구하기', '②16', (d, n) => {
      if (n === 1) {
        // ax² + bx + c = 0: 1/α + 1/β = −b/c
        const a = d.int(1, 4), b = nz(d, -9, 9), c = nz(d, -9, 9), v = Q(-b, c);
        if (isInt(v) || gcd(gcd(a, Math.abs(b)), Math.abs(c)) !== 1) return null;
        return ansV(`이차방정식 ${nb(quadH(a, b, c) + ' = 0')}의 두 근을 ${AL}, ${BE}라 할 때, ${nb(frac(1, AL) + ' + ' + frac(1, BE))}의 값은?`, v, 'frac', {
          explain: `근과 계수의 관계에서 ${nb(AL + ' + ' + BE + ' = ' + tx(Q(-b, a)))}, ${nb(AL + BE + ' = ' + tx(Q(c, a)))}이므로 ${frac(1, AL)} + ${frac(1, BE)} = ${frac(nb(AL + ' + ' + BE), AL + BE)} = ${tx(v)}이다.`,
          facts: { value: `(0-${jn(b)})/${jn(c)}` }
        });
      }
      const p = nz(d, -7, 7), q = nz(d, -9, 9), s = -p, t = q, m = nz(d, -4, 4);
      const eq = nb(quadH(1, p, q) + ' = 0');
      const kinds = [
        [nb(AL + sup(2) + ' + ' + BE + sup(2)), s * s - 2 * t, `${nb(AL + sup(2) + ' + ' + BE + sup(2) + ' = (' + AL + ' + ' + BE + ')' + sup(2) + ' ' + MINUS + ' 2' + AL + BE)}`, `(${jn(p)})*(${jn(p)})-2*${jn(q)}`],
        null,
        [nb('(' + AL + moreH([[m, '']]) + ')(' + BE + moreH([[m, '']]) + ')'), t + m * s + m * m, `${nb('(' + AL + moreH([[m, '']]) + ')(' + BE + moreH([[m, '']]) + ') = ' + AL + BE + moreH([[m, '(' + AL + ' + ' + BE + ')'], [m * m, '']]))}`, `${jn(q)}+${jn(m)}*(0-${jn(p)})+${jn(m)}*${jn(m)}`],
        [nb('(' + AL + ' ' + MINUS + ' ' + BE + ')' + sup(2)), s * s - 4 * t, `${nb('(' + AL + ' ' + MINUS + ' ' + BE + ')' + sup(2) + ' = (' + AL + ' + ' + BE + ')' + sup(2) + ' ' + MINUS + ' 4' + AL + BE)}`, `(${jn(p)})*(${jn(p)})-4*${jn(q)}`],
        [nb(AL + sup(3) + ' + ' + BE + sup(3)), s * s * s - 3 * t * s, `${nb(AL + sup(3) + ' + ' + BE + sup(3) + ' = (' + AL + ' + ' + BE + ')' + sup(3) + ' ' + MINUS + ' 3' + AL + BE + '(' + AL + ' + ' + BE + ')')}`, `(0-${jn(p)})*(0-${jn(p)})*(0-${jn(p)})-3*${jn(q)}*(0-${jn(p)})`]
      ][n];
      if (Math.abs(kinds[1]) > 999) return null;
      return ansV(`이차방정식 ${eq}의 두 근을 ${AL}, ${BE}라 할 때, ${kinds[0]}의 값은?`, Q(kinds[1]), 'int', {
        explain: `근과 계수의 관계에서 ${nb(AL + ' + ' + BE + ' = ' + iq(s))}, ${nb(AL + BE + ' = ' + iq(t))}이다. ${kinds[2]} = ${iq(kinds[1])}이다.${kinds[1] < 0 && (n === 0 || n === 3) ? ` 두 근이 허근이므로 제곱한 값의 합이 음수일 수 있다.` : ''}`,
        facts: { value: kinds[3], derived: [2, 3, 4], rule: 'val' + n }
      });
    }, { count: 5 }),
    T('vieta-multi', '여러 단계를 거치는 대칭식의 값', '②17', (d, n) => {
      if (n === 0 || n === 1) {
        const p = nz(d, -6, 6), q = nz(d, -6, 6), s = -p, t = q;
        if (n === 0) {
          const k = nz(d, -3, 3), v = t * t + k * (s * s - 2 * t) + k * k;
          return ansV(`이차방정식 ${nb(quadH(1, p, q) + ' = 0')}의 두 근을 ${AL}, ${BE}라 할 때, ${nb('(' + AL + sup(2) + moreH([[k, '']]) + ')(' + BE + sup(2) + moreH([[k, '']]) + ')')}의 값은?`, Q(v), 'int', {
            explain: `${nb(AL + ' + ' + BE + ' = ' + iq(s))}, ${nb(AL + BE + ' = ' + iq(t))}이다. 주어진 식은 ${nb('(' + AL + BE + ')' + sup(2) + moreH([[k, '(' + AL + sup(2) + ' + ' + BE + sup(2) + ')'], [k * k, '']]))}이고 ${nb(AL + sup(2) + ' + ' + BE + sup(2) + ' = ' + iq(s * s - 2 * t))}이므로 ${iq(v)}이다.`,
            facts: { value: `${jn(q)}*${jn(q)}+${jn(k)}*(${jn(p)}*${jn(p)}-2*${jn(q)})+${jn(k)}*${jn(k)}`, derived: [2], rule: 'multi0' }
          });
        }
        const num = s * s * s - 3 * t * s;
        if (num % t !== 0) return null;
        return ansV(`이차방정식 ${nb(quadH(1, p, q) + ' = 0')}의 두 근을 ${AL}, ${BE}라 할 때, ${nb(frac(AL + sup(2), BE) + ' + ' + frac(BE + sup(2), AL))}의 값은?`, Q(num / t), 'int', {
          explain: `${frac(AL + sup(2), BE)} + ${frac(BE + sup(2), AL)} = ${frac(nb(AL + sup(3) + ' + ' + BE + sup(3)), AL + BE)}이다. ${nb(AL + ' + ' + BE + ' = ' + iq(s))}, ${nb(AL + BE + ' = ' + iq(t))}이므로 ${nb(AL + sup(3) + ' + ' + BE + sup(3) + ' = ' + iq(num))}이고, 구하는 값은 ${iq(num / t)}이다.`,
          facts: { value: `((0-${jn(p)})*(0-${jn(p)})*(0-${jn(p)})-3*${jn(q)}*(0-${jn(p)}))/${jn(q)}`, derived: [3], rule: 'multi1' }
        });
      }
      const a = d.int(1, 4), b = nz(d, -8, 8), c = nz(d, -6, 6), s = Q(-b, a), t = Q(c, a);
      if (gcd(gcd(a, Math.abs(b)), Math.abs(c)) !== 1) return null;
      if (n === 2) {
        // (α + 1/β²)(β + 1/α²) = t + s/t + 1/t²
        const v = qadd(qadd(t, qdiv(s, t)), qdiv(Q(1), qmul(t, t)));
        if (isInt(v) || v.q > 60 || Math.abs(v.p) > 240) return null;
        return ansV(`이차방정식 ${nb(quadH(a, b, c) + ' = 0')}의 두 근을 ${AL}, ${BE}라 할 때, ${nb('(' + AL + ' + ' + frac(1, BE + sup(2)) + ')(' + BE + ' + ' + frac(1, AL + sup(2)) + ')')}의 값은?`, v, 'frac', {
          explain: `전개하면 ${nb(AL + BE + ' + ' + frac(1, AL) + ' + ' + frac(1, BE) + ' + ' + frac(1, '(' + AL + BE + ')' + sup(2)))} = ${nb(AL + BE + ' + ' + frac(nb(AL + ' + ' + BE), AL + BE) + ' + ' + frac(1, '(' + AL + BE + ')' + sup(2)))}이다. ${nb(AL + ' + ' + BE + ' = ' + tx(s))}, ${nb(AL + BE + ' = ' + tx(t))}이므로 구하는 값은 ${tx(v)}이다.`,
          facts: { value: `${jn(c)}/${a}+(0-${jn(b)})/${jn(c)}+${a}*${a}/(${jn(c)}*${jn(c)})`, rule: 'multi2' }
        });
      }
      // β/(α + k) + α/(β + k) = (s² − 2t + ks)/(t + ks + k²)
      const k = nz(d, -3, 3), den = qadd(qadd(t, qmul(Q(k), s)), Q(k * k)), numr = qadd(qsub(qmul(s, s), qmul(Q(2), t)), qmul(Q(k), s));
      if (den.p === 0) return null;
      const v = qdiv(numr, den);
      if (isInt(v) || v.q > 60 || Math.abs(v.p) > 240 || v.p === 0) return null;
      return ansV(`이차방정식 ${nb(quadH(a, b, c) + ' = 0')}의 두 근을 ${AL}, ${BE}라 할 때, ${nb(frac(BE, AL + moreH([[k, '']])) + ' + ' + frac(AL, BE + moreH([[k, '']])))}의 값은?`, v, 'frac', {
        explain: `통분하면 ${frac(nb(AL + sup(2) + ' + ' + BE + sup(2) + moreH([[k, '(' + AL + ' + ' + BE + ')']])), nb(AL + BE + moreH([[k, '(' + AL + ' + ' + BE + ')'], [k * k, '']])))}이다. ${nb(AL + ' + ' + BE + ' = ' + tx(s))}, ${nb(AL + BE + ' = ' + tx(t))}이므로 분자는 ${tx(numr)}, 분모는 ${tx(den)}이고 구하는 값은 ${tx(v)}이다.`,
        facts: { value: `((0-${jn(b)})*(0-${jn(b)})/(${a}*${a})-2*${jn(c)}/${a}+${jn(k)}*(0-${jn(b)})/${a})/(${jn(c)}/${a}+${jn(k)}*(0-${jn(b)})/${a}+${jn(k)}*${jn(k)})`, derived: [2], rule: 'multi3' }
      });
    }, { count: 4 }),
    T('vieta-claim', '대칭식의 값에 대한 보기의 참·거짓', '②18', (d) => {
      const a = d.int(1, 4), b = nz(d, -8, 8), c = nz(d, -6, 6), s = Q(-b, a), t = Q(c, a);
      if (gcd(gcd(a, Math.abs(b)), Math.abs(c)) !== 1) return null;
      const v1 = qsub(qmul(s, s), qmul(Q(2), t)), v2 = qsub(qmul(qmul(s, s), s), qmul(Q(3), qmul(t, s))), den = qadd(qadd(t, s), Q(1));
      if (den.p === 0) return null;
      const v3 = qdiv(qadd(s, Q(2)), den);
      const w1 = qadd(qmul(s, s), qmul(Q(2), t)), w2 = qadd(qmul(qmul(s, s), s), qmul(Q(3), qmul(t, s))), w3 = qdiv(qadd(s, Q(2)), qadd(t, Q(1)));
      const pick = (right, wrong) => (d.bool() || qcmp(right, wrong) === 0 ? [right, true] : [wrong, false]);
      const [x1, f1] = pick(v1, w1), [x2, f2] = pick(v2, w2), [x3, f3] = pick(v3, w3);
      const rows = [[nb(AL + sup(2) + ' + ' + BE + sup(2) + ' = ' + tx(x1)), f1], [nb(AL + sup(3) + ' + ' + BE + sup(3) + ' = ' + tx(x2)), f2], [nb(frac(1, nb('1 + ' + AL)) + ' + ' + frac(1, nb('1 + ' + BE)) + ' = ' + tx(x3)), f3]];
      return pickSets(d, `이차방정식 ${nb(quadH(a, b, c) + ' = 0')}의 두 근을 ${AL}, ${BE}라 할 때, 다음 보기 가운데 옳은 것만을 있는 대로 고른 것은?`, rows, {
        explain: `${nb(AL + ' + ' + BE + ' = ' + tx(s))}, ${nb(AL + BE + ' = ' + tx(t))}이다. ${nb(AL + sup(2) + ' + ' + BE + sup(2) + ' = ' + tx(v1))}, ${nb(AL + sup(3) + ' + ' + BE + sup(3) + ' = (' + AL + ' + ' + BE + ')' + sup(3) + ' ' + MINUS + ' 3' + AL + BE + '(' + AL + ' + ' + BE + ') = ' + tx(v2))}, ${frac(1, nb('1 + ' + AL))} + ${frac(1, nb('1 + ' + BE))} = ${frac(nb(AL + ' + ' + BE + ' + 2'), nb(AL + BE + ' + ' + AL + ' + ' + BE + ' + 1'))} = ${tx(v3)}이다.`
      });
    }),
    T('vieta-recip', '한 근 α에 대하여 α + 1/α를 이용한 식의 값', '②20', (d, n) => {
      const p = nz(d, n === 0 ? -6 : -3, n === 0 ? 6 : 3), eq = nb(X2 + ' ' + (p > 0 ? MINUS + ' ' : '+ ') + (Math.abs(p) === 1 ? '' : Math.abs(p)) + X + ' + 1 = 0');
      const r2 = p * p - 2, r3 = p * p * p - 3 * p;
      if (n === 0) {
        return ansV(`이차방정식 ${eq}의 한 근을 ${AL}라 할 때, ${nb(AL + sup(2) + ' + ' + frac(1, AL + sup(2)))}의 값은?`, Q(r2), 'int', {
          explain: `${AL}는 근이므로 ${nb(AL + sup(2) + ' ' + (p > 0 ? MINUS + ' ' : '+ ') + (Math.abs(p) === 1 ? '' : Math.abs(p)) + AL + ' + 1 = 0')}이고 ${nb(AL + ' ≠ 0')}이다. 양변을 ${AL}로 나누면 ${nb(AL + ' + ' + frac(1, AL) + ' = ' + iq(p))}이다. ${nb(AL + sup(2) + ' + ' + frac(1, AL + sup(2)) + ' = (' + AL + ' + ' + frac(1, AL) + ')' + sup(2) + ' ' + MINUS + ' 2 = ' + iq(r2))}이다.`,
          facts: { value: `${jn(p)}*${jn(p)}-2`, derived: [2], rule: 'recip2' }
        });
      }
      return ansV(`이차방정식 ${eq}의 한 근을 ${AL}라 할 때, ${nb('(' + AL + ' + ' + frac(1, AL) + ') + (' + AL + sup(2) + ' + ' + frac(1, AL + sup(2)) + ') + (' + AL + sup(3) + ' + ' + frac(1, AL + sup(3)) + ')')}의 값은?`, Q(p + r2 + r3), 'int', {
        explain: `양변을 ${AL}로 나누면 ${nb(AL + ' + ' + frac(1, AL) + ' = ' + iq(p))}이다. ${nb(AL + sup(2) + ' + ' + frac(1, AL + sup(2)) + ' = ' + sqN(p) + ' ' + MINUS + ' 2 = ' + iq(r2))}, ${nb(AL + sup(3) + ' + ' + frac(1, AL + sup(3)) + ' = (' + AL + ' + ' + frac(1, AL) + ')' + sup(3) + ' ' + MINUS + ' 3(' + AL + ' + ' + frac(1, AL) + ') = ' + iq(r3))}이므로 모두 더하면 ${iq(p + r2 + r3)}이다.`,
        facts: { value: `${jn(p)}+${jn(p)}*${jn(p)}-2+${jn(p)}*${jn(p)}*${jn(p)}-3*${jn(p)}`, derived: [2, 3], rule: 'recip3' }
      });
    }, { count: 2 })
  ]);

  // ── 근과 계수의 관계로 계수와 근 구하기 ──
  B.addTypes(UNIT, 'coef', [
    T('coef-back', '식의 값 조건으로 계수를 정한 뒤 다른 식의 값', '②21', (d) => {
      const q = nz(d, -6, 6), m = nz(d, -8, 8), v = Q(-m, q);
      return ansV(`이차방정식 ${nb(X2 + ' + ' + vm + X + moreH([[q, '']]) + ' = 0')}의 두 근을 ${AL}, ${BE}라 하자. ${nb(frac(1, AL) + ' + ' + frac(1, BE) + ' = ' + tx(v))}일 때, ${nb(AL + sup(2) + ' + ' + BE + sup(2))}의 값은? (단, ${vm}은 실수이다.)`, Q(m * m - 2 * q), 'int', {
        explain: `${nb(AL + ' + ' + BE + ' = ' + MINUS + vm)}, ${nb(AL + BE + ' = ' + iq(q))}이므로 ${frac(1, AL)} + ${frac(1, BE)} = ${frac(nb(MINUS + vm), iq(q))} = ${tx(v)}에서 ${nb(vm + ' = ' + iq(m))}이다. ${nb(AL + sup(2) + ' + ' + BE + sup(2) + ' = (' + AL + ' + ' + BE + ')' + sup(2) + ' ' + MINUS + ' 2' + AL + BE + ' = ' + iq(m * m - 2 * q))}이다.`,
        facts: { value: `(${jq(v)}*${jn(q)})*(${jq(v)}*${jn(q)})-2*${jn(q)}`, derived: [2] }
      });
    }),
    T('coef-ratio', '두 근의 비가 주어질 때 계수 구하기', '②23', (d) => {
      const r = d.int(2, 4), al = nz(d, -4, 4), s = al * (1 + r), k = r * al * al;
      return ansV(`이차방정식 ${nb(X2 + moreH([[-s, X]]) + ' + ' + vk + ' = 0')}의 두 근의 비가 1 : ${r}일 때, 실수 ${vk}의 값은?`, Q(k), 'int', {
        explain: `두 근을 ${AL}, ${r}${AL}라 하면 근과 계수의 관계에서 ${nb(AL + ' + ' + r + AL + ' = ' + iq(s))}이므로 ${nb(AL + ' = ' + iq(al))}이다. 두 근은 ${iq(al)}, ${iq(r * al)}이고 ${nb(vk + ' = ' + AL + ' × ' + r + AL + ' = ' + iq(k))}이다.`,
        facts: { value: `${r}*(${jn(s)}/(1+${r}))*(${jn(s)}/(1+${r}))` }
      });
    }),
    T('coef-roots', '두 근을 주고 계수 구하기', '②25', (d) => {
      const p = nz(d, -2, 2), r = nz(d, -5, 5), b = -p - r, a = nz(d, -4, 4);
      if (b === 0 || b === r || b === -r) return null;
      const c = a * r * b;
      const eq = nb(va + X2 + (p < 0 ? ' ' + MINUS + ' ' : ' + ') + (Math.abs(p) === 1 ? '' : Math.abs(p)) + va + X + moreH([[c, '']]) + ' = 0');
      return valsQ(`이차방정식 ${eq}의 두 근이 ${iq(r)}, ${vb}일 때, 실수 ${va}, ${vb}의 값은? (단, ${nb(va + ' ≠ 0')})`, [['a', a], ['b', b]], {
        explain: `근과 계수의 관계에서 두 근의 합은 ${nb(MINUS + frac(sumH([[p, va]]), va) + ' = ' + iq(-p))}이므로 ${nb(iq(r) + ' + ' + vb + ' = ' + iq(-p))}에서 ${nb(vb + ' = ' + iq(b))}이다. 두 근의 곱은 ${frac(iq(c), va)}이므로 ${nb(iq(r) + ' × ' + pN(b) + ' = ' + frac(iq(c), va))}에서 ${nb(va + ' = ' + iq(a))}이다.`,
        facts: { calc: [[`${jn(c)}/(${jn(r)}*(0-${jn(p)}-${jn(r)}))`, 0], [`0-${jn(p)}-${jn(r)}`, 1]] }
      });
    }),
    T('coef-sub', '한 근을 대입하여 얻은 식으로 모든 실수 a의 합', '②26', (d) => {
      // x² + p·a·x + a² + q = 0 의 한 근이 r → a² + (pr)a + (r² + q) = 0
      const p = d.pick([1, -1, 2, -2]), r = nz(d, -4, 4), q = nz(d, -9, 9), Da = p * p * r * r - 4 * (r * r + q);
      if (Da <= 0) return null;
      const eq = nb(X2 + (p < 0 ? ' ' + MINUS + ' ' : ' + ') + (Math.abs(p) === 1 ? '' : Math.abs(p)) + va + X + ' + ' + va + sup(2) + moreH([[q, '']]) + ' = 0');
      return ansV(`${X}에 대한 이차방정식 ${eq}의 한 근이 ${iq(r)}일 때, 모든 실수 ${va}의 값의 합은?`, Q(-p * r), 'int', {
        explain: `${nb(X + ' = ' + iq(r))}${endJ(iq(r), '을/를')} 대입하면 ${nb(va + sup(2) + moreH([[p * r, va], [r * r + q, '']]) + ' = 0')}이다. 이 ${va}에 대한 이차방정식의 판별식은 ${iq(Da)} &gt; 0이므로 서로 다른 두 실근을 갖고, 두 근의 합은 ${iq(-p * r)}이다.`,
        facts: { value: `0-${jn(p)}*${jn(r)}` }
      });
    }),
    T('coef-flip', '계수를 뒤바꾼 이차방정식의 두 근의 합', '②28', (d) => {
      const r1 = nz(d, -6, 6), r2 = nz(d, -6, 6), v = Q(r1 + r2, r1 * r2);
      if (r1 === r2 || isInt(v) || r1 + r2 === 0) return null;
      return ansV(`이차방정식 ${nb(va + X2 + ' + ' + vb + X + ' + ' + vc + ' = 0')}의 두 근이 ${iq(r1)}, ${iq(r2)}일 때, 이차방정식 ${nb(vc + X2 + ' + ' + vb + X + ' + ' + va + ' = 0')}의 두 근의 합은? (단, ${va}, ${vb}, ${vc}는 실수이고 ${nb(va + vc + ' ≠ 0')}이다.)`, v, 'frac', {
        explain: `근과 계수의 관계에서 ${nb(MINUS + frac(vb, va) + ' = ' + iq(r1 + r2))}, ${nb(frac(vc, va) + ' = ' + iq(r1 * r2))}이므로 ${nb(vb + ' = ' + sumH([[-(r1 + r2), va]]))}, ${nb(vc + ' = ' + sumH([[r1 * r2, va]]))}이다. 구하는 합은 ${nb(MINUS + frac(vb, vc) + ' = ' + frac(iq(r1 + r2), iq(r1 * r2)) + ' = ' + tx(v))}이다.`,
        facts: { value: `(${jn(r1)}+${jn(r2)})/(${jn(r1)}*${jn(r2)})` }
      });
    })
  ]);

  // ── 두 수를 근으로 하는 이차방정식 ──
  B.addTypes(UNIT, 'make', [
    T('make-eq', '두 수를 근으로 하는 이차방정식', '②29', (d, n) => {
      let r1H, r2H, s, t, calc;
      if (n === 0) {
        const r1 = nz(d, -7, 7), r2 = nz(d, -7, 7);
        if (r1 === r2 || r1 === -r2) return null;
        r1H = iq(r1); r2H = iq(r2); s = r1 + r2; t = r1 * r2; calc = [`0-(${jn(r1)}+${jn(r2)})`, `${jn(r1)}*${jn(r2)}`];
      } else if (n === 1) {
        const p = nz(d, -5, 5), k = d.int(1, 3), q = d.pick([2, 3, 5, 6, 7]);
        r1H = nb(iq(p) + ' + ' + (k === 1 ? '' : k) + rt(q)); r2H = nb(iq(p) + ' ' + MINUS + ' ' + (k === 1 ? '' : k) + rt(q)); s = 2 * p; t = p * p - k * k * q; calc = [`0-2*${jn(p)}`, `${jn(p)}*${jn(p)}-${k}*${k}*${q}`];
      } else {
        const p = nz(d, -5, 5), k = d.int(1, 4), q = d.pick([1, 1, 2, 3, 5]);
        r1H = nb(iq(p) + ' + ' + (k === 1 && q > 1 ? '' : k === 1 ? '' : k) + (q > 1 ? rt(q) : '') + I); r2H = nb(iq(p) + ' ' + MINUS + ' ' + (k === 1 ? '' : k) + (q > 1 ? rt(q) : '') + I); s = 2 * p; t = p * p + k * k * q; calc = [`0-2*${jn(p)}`, `${jn(p)}*${jn(p)}+${k}*${k}*${q}`];
      }
      if (s === 0 || t === 0) return null;
      return eqAns(`두 수 ${r1H}, ${ej(r2H, '을/를')} 근으로 하고 ${X2}의 계수가 1인 이차방정식을 구하시오.`, -s, t, {
        explain: `두 근의 합은 ${iq(s)}, 두 근의 곱은 ${iq(t)}이다. 구하는 이차방정식은 ${nb(X2 + ' ' + MINUS + ' (두 근의 합)' + X + ' + (두 근의 곱) = 0')}이므로 ${nb(quadH(1, -s, t) + ' = 0')}이다.`,
        facts: { calc: calc.map((e, i) => [e, i]), derived: [2, 1], rule: 'make' + n }
      });
    }, { count: 3 }),
    T('make-new', 'α, β로 만든 두 수를 근으로 하는 이차방정식', '②30', (d, n) => {
      const p = nz(d, -6, 6), q = nz(d, -6, 6), s = -p, t = q, eq = nb(quadH(1, p, q) + ' = 0');
      if (n === 2) {
        // 1/α, 1/β: x² − (s/t)x + 1/t = 0 (계수가 분수 — 고르기)
        const S = Q(s, t), Pp = Q(1, t);
        if (isInt(S) || isInt(Pp)) return null;
        const eqF = (u, w) => nb(X2 + (u.p === 0 ? '' : (u.p > 0 ? ' + ' : ' ' + MINUS + ' ') + mag(qabs(u)) + X) + (w.p > 0 ? ' + ' : ' ' + MINUS + ' ') + mag(qabs(w)) + ' = 0');
        const right = eqF(qneg(S), Pp);
        const rows = [[right, true], [eqF(S, Pp), false], [eqF(qneg(S), Q(t)), false], [eqF(qneg(Q(t, s)), Pp), false], [eqF(qneg(S), qneg(Pp)), false]];
        return choose(d, `이차방정식 ${eq}의 두 근을 ${AL}, ${BE}라 할 때, ${frac(1, AL)}, ${ej(frac(1, BE), '을/를')} 두 근으로 하고 ${X2}의 계수가 1인 이차방정식은?`, rows, {
          explain: `${nb(AL + ' + ' + BE + ' = ' + iq(s))}, ${nb(AL + BE + ' = ' + iq(t))}이다. ${frac(1, AL)} + ${frac(1, BE)} = ${frac(nb(AL + ' + ' + BE), AL + BE)} = ${tx(S)}, ${frac(1, AL)} × ${frac(1, BE)} = ${frac(1, AL + BE)} = ${tx(Pp)}이므로 ${right}이다.`,
          facts: { rule: 'new-recip' }
        });
      }
      const k = nz(d, -3, 3);
      const sets = [
        [`${AL} + ${BE}, ${AL}${BE}`, s + t, s * t, `${nb('(' + AL + ' + ' + BE + ') + ' + AL + BE + ' = ' + iq(s + t))}, ${nb('(' + AL + ' + ' + BE + ') × ' + AL + BE + ' = ' + iq(s * t))}`, [`0-(0-${jn(p)}+${jn(q)})`, `(0-${jn(p)})*${jn(q)}`]],
        [`${nb(AL + moreH([[k, '']]))}, ${nb(BE + moreH([[k, '']]))}`, s + 2 * k, t + k * s + k * k, `두 수의 합은 ${nb(AL + ' + ' + BE + moreH([[2 * k, '']]) + ' = ' + iq(s + 2 * k))}, 곱은 ${nb(AL + BE + moreH([[k, '(' + AL + ' + ' + BE + ')'], [k * k, '']]) + ' = ' + iq(t + k * s + k * k))}`, [`0-(0-${jn(p)}+2*${jn(k)})`, `${jn(q)}+${jn(k)}*(0-${jn(p)})+${jn(k)}*${jn(k)}`]],
        null,
        [`${nb(AL + sup(2))}, ${nb(BE + sup(2))}`, s * s - 2 * t, t * t, `두 수의 합은 ${nb(AL + sup(2) + ' + ' + BE + sup(2) + ' = (' + AL + ' + ' + BE + ')' + sup(2) + ' ' + MINUS + ' 2' + AL + BE + ' = ' + iq(s * s - 2 * t))}, 곱은 ${nb('(' + AL + BE + ')' + sup(2) + ' = ' + iq(t * t))}`, [`0-(${jn(p)}*${jn(p)}-2*${jn(q)})`, `${jn(q)}*${jn(q)}`]]
      ][n];
      const [label, S, Pp, why, calc] = sets;
      if (S === 0 || Pp === 0 || Math.abs(S) > 999 || Math.abs(Pp) > 999) return null;
      return eqAns(`이차방정식 ${eq}의 두 근을 ${AL}, ${BE}라 할 때, ${label}${endJ(label, '을/를')} 두 근으로 하고 ${X2}의 계수가 1인 이차방정식을 구하시오.`, -S, Pp, {
        explain: `${nb(AL + ' + ' + BE + ' = ' + iq(s))}, ${nb(AL + BE + ' = ' + iq(t))}이다. ${why}이므로 구하는 이차방정식은 ${nb(quadH(1, -S, Pp) + ' = 0')}이다.`,
        facts: { calc: calc.map((e, i) => [e, i]), derived: [2], rule: 'new' + n }
      });
    }, { count: 4 }),
    T('make-factor', '복소수의 범위에서 이차식 인수분해', '②31', (d, n) => {
      if (n === 0) {
        const p = nz(d, -5, 5), q = d.int(1, 5), b = -2 * p, c = p * p + q * q;
        const tpl = grp('(' + X + ' {0} {1}' + I + ')') + grp('(' + X + ' {2} {3}' + I + ')');
        const f1 = sumH([[1, X], [-p, ''], [-q, I]]), f2 = sumH([[1, X], [-p, ''], [q, I]]);
        return inline(`이차식 ${ej(quadH(1, b, c), '을/를')} 복소수의 범위에서 인수분해하시오.` + NOTE01, tpl, [{ answer: -p, signed: true }, { answer: -q, signed: true }, { answer: -p, signed: true }, { answer: q, signed: true }], {
          shown: nb('(' + f1 + ')(' + f2 + ')'), blocks: [[0, 1], [2, 3]],
          explain: `이차방정식 ${nb(quadH(1, b, c) + ' = 0')}의 근은 ${nb(X + ' = ' + iq(p) + ' ± ' + (q === 1 ? '' : q) + I)}이므로 ${nb(quadH(1, b, c) + ' = {' + X + ' ' + MINUS + ' (' + cxH(cz(p, q)) + ')}{' + X + ' ' + MINUS + ' (' + cxH(cz(p, -q)) + ')} = (' + f1 + ')(' + f2 + ')')}이다.`,
          facts: { calc: [[`(${jn(b)})/2`, 0], [`0-((4*${c}-(${jn(b)})*(${jn(b)}))/4)**0.5`, 1], [`(${jn(b)})/2`, 2], [`((4*${c}-(${jn(b)})*(${jn(b)}))/4)**0.5`, 3]], derived: [2, 4, 0.5], rule: 'factor' }
        });
      }
      // ax² + bx + c (a ≥ 2): a(x − α)(x − ᾱ), α = (u + vi)/a 꼴
      const a = d.int(2, 4), u = nz(d, -6, 6), v = d.int(1, 4), b = -2 * u, c = Q(u * u + v * v, a);
      if (!isInt(c) || gcd(gcd(a, Math.abs(b)), c.p) !== 1) return null;
      const al = cz(Q(u, a), Q(v, a)), alb = cconj(al);
      if (isInt(al.r) || isInt(al.m)) return null;
      const fac = (z) => '(' + nb(X + (z.r.p < 0 ? ' + ' : ' ' + MINUS + ' ') + mag(qabs(z.r)) + (z.m.p < 0 ? ' + ' : ' ' + MINUS + ' ') + mag(qabs(z.m)) + I) + ')';
      const right = nb(a + fac(al) + fac(alb));
      const rows = [[right, true], [nb(fac(al) + fac(alb)), false], [nb(a + fac(cz(qneg(al.r), al.m)) + fac(cz(qneg(al.r), qneg(al.m)))), false], [nb(a + fac(al) + fac(al)), false], [nb(a + fac(cz(al.m, al.r)) + fac(cz(al.m, qneg(al.r)))), false]];
      return choose(d, `이차식 ${ej(quadH(a, b, c.p), '을/를')} 복소수의 범위에서 인수분해한 것은?`, rows, {
        explain: `이차방정식 ${nb(quadH(a, b, c.p) + ' = 0')}의 근은 ${X} = ${frac(nb(iq(u) + ' ± ' + (v === 1 ? '' : v) + I), a)}이므로 ${nb(quadH(a, b, c.p))} = ${right}이다. ${X2}의 계수 ${a}${endJ(String(a), '을/를')} 빠뜨리지 않는다.`,
        facts: { rule: 'factor-a' }
      });
    }, { count: 2 })
  ]);

  // ── 켤레근과 잘못 보고 푼 이차방정식 ──
  B.addTypes(UNIT, 'conj', [
    T('conj-root', '한 허근이 주어질 때 계수 구하기', '②32', (d, n) => {
      if (n === 0) {
        const p = nz(d, -5, 5), q = nz(d, -5, 5), a = -2 * p, b = p * p + q * q;
        return valsQ(`이차방정식 ${nb(X2 + ' + ' + va + X + ' + ' + vb + ' = 0')}의 한 근이 ${cxH(cz(p, q))}일 때, 실수 ${va}, ${vb}의 값은?`, [['a', a], ['b', b]], {
          explain: `계수가 실수이므로 다른 한 근은 켤레복소수 ${cxH(cz(p, -q))}이다. 근과 계수의 관계에서 ${nb(MINUS + va + ' = (' + cxH(cz(p, q)) + ') + (' + cxH(cz(p, -q)) + ') = ' + iq(2 * p))}, ${nb(vb + ' = (' + cxH(cz(p, q)) + ')(' + cxH(cz(p, -q)) + ') = ' + b)}이므로 ${nb(va + ' = ' + iq(a))}, ${nb(vb + ' = ' + b)}이다.`,
          facts: { calc: [[`0-2*${jn(p)}`, 0], [`${jn(p)}*${jn(p)}+${jn(q)}*${jn(q)}`, 1]], derived: [2] }
        });
      }
      const b = nz(d, -5, 5), q = d.int(1, 5), p = -2 * b, a = b * b + q * q;
      return valsQ(`이차방정식 ${nb(X2 + moreH([[p, X]]) + ' + ' + va + ' = 0')}의 한 근이 ${nb(vb + ' + ' + (q === 1 ? '' : q) + I)}일 때, 실수 ${va}, ${vb}의 값은?`, [['a', a], ['b', b]], {
        explain: `계수가 실수이므로 다른 한 근은 ${nb(vb + ' ' + MINUS + ' ' + (q === 1 ? '' : q) + I)}이다. 두 근의 합은 ${nb('2' + vb + ' = ' + iq(-p))}이므로 ${nb(vb + ' = ' + iq(b))}이고, 두 근의 곱은 ${nb(va + ' = ' + vb + sup(2) + ' + ' + q * q + ' = ' + a)}이다.`,
        facts: { calc: [[`(0-${jn(p)})/2*(0-${jn(p)})/2+${q}*${q}`, 0], [`(0-${jn(p)})/2`, 1]], derived: [2] }
      });
    }, { count: 2 }),
    T('conj-wrong', '잘못 보고 푼 근으로 원래 이차방정식 구하기', '②35', (d, n) => {
      const [w1, w2] = d.shuffle(NAMES).slice(0, 2);
      // 두 근을 적은 글
      const pairH = (z1, z2) => `${z1}, ${z2}`;
      if (n === 0) {
        // x² + ax + b = 0: 바른 두 근 u, v. w1 은 a 를 잘못 보아 곱 uv 를, w2 는 b 를 잘못 보아 합 u + v 를 얻었다.
        const u = nz(d, -6, 6), v = nz(d, -6, 6);
        if (u === v || u === -v) return null;
        const prod = u * v, sum = u + v;
        let A;
        if (prod > 0 && d.bool()) { const cands = []; for (let c = -4; c <= 4; c += 1) for (let e = 1; e <= 6; e += 1) if (c * c + e * e === prod && c !== 0) cands.push([c, e]); if (!cands.length) return null; const [c, e] = d.pick(cands); A = pairH(cxH(cz(c, e)), cxH(cz(c, -e))); }
        else { const c = nz(d, -4, 4), e = c * c - prod; if (e < 2 || !sqFree(e)) return null; A = pairH(nb(iq(c) + ' + ' + rt(e)), nb(iq(c) + ' ' + MINUS + ' ' + rt(e))); }
        let Bp;
        if (sum % 2 === 0 && d.bool()) { const c = sum / 2, e = d.int(1, 5); Bp = pairH(cxH(cz(c, e)), cxH(cz(c, -e))); }
        else { const m = d.until(() => nz(d, -8, 8), (x) => x !== u && x !== v && sum - x !== 0 && x !== sum - x); Bp = pairH(iq(m), iq(sum - m)); }
        return rootsAns(`이차방정식 ${nb(X2 + ' + ' + va + X + ' + ' + vb + ' = 0')}을 푸는데 ${name(w1, '은/는')} ${va}를 잘못 보고 풀어 두 근 ${ej(A, '을/를')} 얻었고, ${name(w2, '은/는')} ${vb}를 잘못 보고 풀어 두 근 ${ej(Bp, '을/를')} 얻었다. 바른 이차방정식의 두 근을 구하시오. (단, ${va}, ${vb}는 실수이다.)`, Math.min(u, v), Math.max(u, v), {
          explain: `${name(w1, '은/는')} ${vb}를 바르게 보았으므로 ${nb(vb + ' = ')}(두 근의 곱) = ${iq(prod)}, ${name(w2, '은/는')} ${va}를 바르게 보았으므로 ${nb(MINUS + va + ' = ')}(두 근의 합) = ${iq(sum)}이다. 바른 이차방정식은 ${nb(quadH(1, -sum, prod) + ' = 0')}이고 그 근은 ${nb(X + ' = ' + iq(Math.min(u, v)))} 또는 ${nb(X + ' = ' + iq(Math.max(u, v)))}이다.`,
          facts: { calc: [[`(${jn(sum)}-(${jn(sum)}*${jn(sum)}-4*${jn(prod)})**0.5)/2`, 0], [`(${jn(sum)}+(${jn(sum)}*${jn(sum)}-4*${jn(prod)})**0.5)/2`, 1]], derived: [2, 4, 0.5, Math.abs(sum), Math.abs(prod)] }
        });
      }
      // ax² + bx + c = 0: w1 은 b 를 잘못 보아 r1, r2 (곱 c/a), w2 는 c 를 잘못 보아 s1, s2 (합 −b/a)
      const r1 = nz(d, -5, 5), r2 = nz(d, -5, 5), s1 = nz(d, -5, 5), s2 = nz(d, -5, 5);
      if (r1 === r2 || s1 === s2 || r1 + r2 === s1 + s2 || r1 * r2 === s1 * s2) return null;
      const S = s1 + s2, Pp = r1 * r2, v = S * S - 2 * Pp;
      return ansV(`이차방정식 ${nb(va + X2 + ' + ' + vb + X + ' + ' + vc + ' = 0')}을 푸는데 ${name(w1, '은/는')} ${vb}를 잘못 보고 풀어 두 근 ${iq(r1)}, ${ej(iq(r2), '을/를')} 얻었고, ${name(w2, '은/는')} ${vc}를 잘못 보고 풀어 두 근 ${iq(s1)}, ${ej(iq(s2), '을/를')} 얻었다. 바른 이차방정식의 두 근을 ${AL}, ${BE}라 할 때, ${nb(AL + sup(2) + ' + ' + BE + sup(2))}의 값은? (단, ${va}, ${vb}, ${vc}는 실수이고 ${nb(va + ' ≠ 0')})`, Q(v), 'int', {
        explain: `${name(w1, '은/는')} ${va}, ${vc}를 바르게 보았으므로 ${nb(frac(vc, va) + ' = ' + iq(Pp))}, ${name(w2, '은/는')} ${va}, ${vb}를 바르게 보았으므로 ${nb(MINUS + frac(vb, va) + ' = ' + iq(S))}이다. 따라서 ${nb(AL + ' + ' + BE + ' = ' + iq(S))}, ${nb(AL + BE + ' = ' + iq(Pp))}이고 ${nb(AL + sup(2) + ' + ' + BE + sup(2) + ' = ' + sqN(S) + ' ' + MINUS + ' 2 × ' + pN(Pp) + ' = ' + iq(v))}이다.`,
        facts: { value: `(${jn(s1)}+${jn(s2)})*(${jn(s1)}+${jn(s2)})-2*${jn(r1)}*${jn(r2)}`, derived: [2] }
      });
    }, { count: 2 })
  ]);

  B.kit.m1013.quad = { isSq, sqFree, SQFREE, eqH, quadH, KINDS, kindOf, judgeQ, rootPT, rootPTR, rootsAns, eqAns, REL, rangeAns, CONDS, kRange, relWord, DD };
})(typeof window !== 'undefined' ? window : globalThis);
