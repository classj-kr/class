// 중학교 1학년 1학기 1단원 소인수분해 — 뒤쪽 묶음(어떤 자연수의 제곱인 수 만들기, 공약수·최대공약수·서로소, 공배수·최소공배수, 최대공약수와 최소공배수를 알 때 수 구하기).
// 단원 틀과 도구, 싣는 기준, 뺀 것과 까닭은 7-1-1a.js 에 있다. ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
// 최대공약수·최소공배수는 모두 소인수분해로 구한다(공약수로 나누어 내려가는 셈과 약수·배수를 늘어놓는 방법은 5-1-2에 있다).
// 최대공약수·최소공배수의 활용 문제(①96~107, 심51~62)는 교육과정이 다루지 않는다고 하였으므로 싣지 않았다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, box, N, M, C } = B.kit;
  const K = B.kit.m711;
  const { U, LAB, range, gcd, lcm, nb, tail, V, sup, claimQ, divs, asc, fz, num, nd, sortF, gcdF, lcmF, expIn, pw, fx, fjs, fm, fmj, eqn, ndTold, UNSEEN, expJs, gExp, lExp, gcdJs, lcmJs, SQ, form, someForms, primesOf, aligned, shelf, ruled, gTold, lTold, cellsOf, composite } = K;
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});

  // ── 어떤 자연수의 제곱인 수 만들기 ──
  B.addTypes(U, 'square', [
    T('square-mul', '곱하여 어떤 자연수의 제곱이 되게 하는 가장 작은 수', '①46·47', (d, n) => {
      // 첫째는 소인수분해 한 식으로, 둘째는 자연수로 준다(소인수분해부터 한다).
      const f = form(d, { ps: [2, 3, 5, 7], k: d.pick([2, 3]), lo: 40, hi: n === 0 ? 3000 : 700, ok: (g) => g.some(([, e]) => e % 2 === 1) && g.some(([, e]) => e >= 2) && (n === 1 || g.some(([, e]) => e % 2 === 0)) }), v = num(f);
      const odd = f.filter(([, e]) => e % 2 === 1).map(([p]) => p), k = odd.reduce((s, p) => s * p, 1), done = f.map(([p, e]) => [p, e + (e % 2)]);
      return N(`${n === 0 ? fm(f) : v}에 자연수를 곱하여 어떤 자연수의 제곱이 되게 하려고 한다. 곱할 수 있는 가장 작은 자연수는?`, k, {
        explain: `${n === 0 ? '' : eqn(v) + '이다. '}어떤 자연수의 제곱인 수는 소인수분해 했을 때 모든 소인수의 지수가 짝수이다. 지수가 홀수인 소인수는 ${odd.join(', ')}이므로 ${odd.length > 1 ? odd.join(' × ') + ' = ' : ''}${josa(k, '을/를')} 곱한다. 곱한 결과는 ${fx(done)}이다.`,
        facts: { digit: { template: `((${n === 0 ? fjs(f) : v})*□)**0.5%1<${SQ}`, lo: 1, hi: 2 * k + 10, ask: 'min' }, rule: 'square-mul-' + n }
      });
    }, { count: 2 }),
    T('square-div', '나누어 어떤 자연수의 제곱이 되게 하는 가장 작은 수', '①50', (d) => {
      const f = form(d, { ps: [2, 3, 5, 7], k: d.pick([2, 3]), lo: 48, hi: 700, ok: (g) => g.some(([, e]) => e % 2 === 1) && g.some(([, e]) => e >= 2) }), v = num(f);
      const odd = f.filter(([, e]) => e % 2 === 1).map(([p]) => p), k = odd.reduce((s, p) => s * p, 1), done = f.map(([p, e]) => [p, e - (e % 2)]).filter(([, e]) => e > 0);
      return N(`${josa(v, '을/를')} 자연수로 나누어 어떤 자연수의 제곱이 되게 하려고 한다. 나눌 수 있는 가장 작은 자연수는?`, k, {
        explain: `${eqn(v)}이다. 어떤 자연수의 제곱인 수는 소인수분해 했을 때 모든 소인수의 지수가 짝수이다. 지수가 홀수인 소인수 ${odd.join(', ')}${tail(odd[odd.length - 1], '을/를')} 하나씩 덜어 내면 되므로 ${odd.length > 1 ? odd.join(' × ') + ' = ' : ''}${josa(k, '으로/로')} 나눈다. 나눈 결과는 ${fx(done)}이다.`,
        facts: { digit: { template: `(${v}/□)**0.5%1+${v}%□<${SQ}`, lo: 1, hi: 2 * k + 10, ask: 'min' } }
      });
    })
  ]);

  // ── 공약수, 최대공약수, 서로소 ──
  B.addTypes(U, 'gcd', [
    T('gcd-form', '소인수분해 한 두 수의 최대공약수', '①55·73', (d, n) => {
      // 첫째는 최대공약수를 자연수로, 둘째는 소인수끼리 세로로 맞춘 표에서 지수로 답한다.
      if (n === 0) {
        const fs = someForms(d, 2, { hi: 2500, ok: (list, gF) => composite(gF) }), vs = fs.map(num), g = gcd(vs[0], vs[1]);
        return N(`두 수 ${fm(fs[0])}, ${fm(fs[1])}의 최대공약수는?`, g, {
          explain: `${gTold(fs)} 최대공약수는 ${fx(fz(g))} = ${g}이다.`,
          facts: { calc: [[gcdJs(fs.map(fjs), primesOf(fs), Math.max(...vs)), 0]], unseen: UNSEEN, rule: 'gcd-form-value' }
        });
      }
      const fs = someForms(d, 2, { hi: 900, lo: 30, side1: true, ok: (list, gF) => primesOf(list).length === 3 && gF.length === 2 }), vs = fs.map(num), ps = primesOf(fs), gF = gcdF(fs), cps = gF.map(([p]) => p);
      return M(`${josa(vs[0], '과/와')} ${josa(vs[1], '을/를')} 소인수분해 하여 최대공약수를 구하려고 한다. ㉠, ㉡에 알맞은 수는?`, cps.map((p, i) => ({ label: LAB[i], answer: expIn(gF, p) })), {
        figure: aligned(ps, [{ head: `${vs[0]} =`, cells: cellsOf(fs[0]) }, { head: `${vs[1]} =`, cells: cellsOf(fs[1]) }, { head: '최대공약수 =', cells: cps.reduce((o, p, i) => Object.assign(o, { [p]: p + sup(LAB[i]) }), {}), rule: true }]),
        explain: `${gTold(fs)} 최대공약수는 ${fx(gF)}이다. 지수가 적혀 있지 않은 소인수의 지수는 1이다.`,
        facts: { calc: cps.map((p, i) => [gExp(vs.map(String), p, Math.max(...vs)), i]), unseen: UNSEEN, rule: 'gcd-form-exp' }
      });
    }, { count: 2 }),
    T('gcd-num', '소인수분해를 이용하여 두 자연수의 최대공약수 구하기', '①56', (d) => {
      const fs = someForms(d, 2, { hi: 600, lo: 60, gmin: 12 }).sort((x, y) => num(x) - num(y)), vs = fs.map(num), g = gcd(vs[0], vs[1]);
      return N(`소인수분해를 이용하여 ${josa(vs[0], '과/와')} ${vs[1]}의 최대공약수를 구하시오.`, g, {
        explain: `${eqn(vs[0])}, ${eqn(vs[1])}이다. ${gTold(fs)} 최대공약수는 ${fx(fz(g))} = ${g}이다.`,
        facts: { calc: [[gcdJs(vs.map(String), [2, 3, 5, 7], vs[1]), 0]], unseen: UNSEEN }
      });
    }),
    T('gcd-three', '세 수의 최대공약수', '①57', (d, n) => {
      // 첫째는 소인수분해 한 식 셋, 둘째는 자연수 둘과 식 하나가 섞여 있다(자연수는 소인수분해부터 한다).
      const fs = someForms(d, 3, { hi: n === 0 ? 2500 : 500, lo: n === 0 ? 2 : 40, ok: (list, gF) => composite(gF) }), vs = fs.map(num), g = vs.reduce((x, y) => gcd(x, y)), raw = (i) => n === 1 && i < 2;
      return N('다음 세 수의 최대공약수는?', g, {
        figure: shelf(fs.map((f, i) => (raw(i) ? String(vs[i]) : fx(f)))),
        explain: `${n === 1 ? `${eqn(vs[0])}, ${eqn(vs[1])}이다. ` : ''}${gTold(fs)} 최대공약수는 ${fx(fz(g))} = ${g}이다.`,
        facts: { calc: [[gcdJs(fs.map((f, i) => (raw(i) ? String(vs[i]) : fjs(f))), [2, 3, 5, 7], Math.max(...vs)), 0]], unseen: UNSEEN, rule: 'gcd-three-' + n }
      });
    }, { count: 2 }),
    T('gcd-common-pick', '공약수인 것·아닌 것 고르기(보기가 소인수분해 한 식)', '①58 심32', (d, n) => {
      if (n === 0) {
        // 틀린 보기: 한 수의 약수이지만 다른 수의 약수는 아닌 수(한 소인수의 지수가 최대공약수의 지수보다 1 크다)
        const fs = someForms(d, 2, { hi: 3000, ok: (list, G) => nd(G) >= 6 && nd(G) <= 12 }), vs = fs.map(num), gF = gcdF(fs), g = num(gF);
        const bad = d.until(() => { const p = d.pick(primesOf(fs)), base = d.pick(divs(g)); return fz(base / p ** expIn(fz(base), p) * p ** (expIn(gF, p) + 1)); }, (b) => vs.some((v) => v % num(b) === 0) && !vs.every((v) => v % num(b) === 0) && !vs.includes(num(b)));
        const rows = d.shuffle(d.shuffle(divs(g).filter((k) => k > 1)).slice(0, 4).map(fz).concat([bad])), [p, e] = bad.find(([q, k]) => k > expIn(gF, q));
        return C(`다음 중 두 수 ${fm(fs[0])}, ${fm(fs[1])}의 공약수가 아닌 것은?`, rows.map(fx), rows.indexOf(bad), {
          explain: `두 수의 최대공약수는 ${fx(gF)}이고, 공약수는 최대공약수의 약수이다. ${fmj(bad, '은/는')} ${e > 1 ? `소인수 ${p}의 지수가 ${e}이고, 이것은 최대공약수에서 ${p}의 지수 ${e - 1}보다 크므로` : `최대공약수에 없는 소인수 ${josa(p, '을/를')} 가지므로`} 공약수가 아니다.`,
          facts: { truth: rows.map((b) => vs.every((v) => v % num(b) === 0)), want: false, rule: 'common-pick-two' }
        });
      }
      // 세 수: 틀린 보기는 세 수 가운데 한두 수의 약수일 뿐인 수이다(어느 수에는 없는 소인수가 들었거나 지수가 크다).
      const [fs, cands] = d.until(() => {
        const list = someForms(d, 3, { hi: 3000, ok: (x, G) => nd(G) >= 4 }), vv = list.map(num), gg = vv.reduce((x, y) => gcd(x, y)), G = fz(gg), out = new Map();
        for (const p of primesOf(list)) for (const b of divs(gg)) { const c = b / p ** expIn(fz(b), p) * p ** (expIn(G, p) + 1); if (vv.some((v) => v % c === 0) && !vv.every((v) => v % c === 0)) out.set(c, fz(c)); }
        return [list, [...out.values()]];
      }, ([, list]) => list.length >= 3);
      const vs = fs.map(num), gF = gcdF(fs), g = num(gF), good = fz(d.pick(divs(g).filter((k) => k > 1 && (fz(k).length >= 2 || gF.length < 2))));
      const rows = d.shuffle([good].concat(d.shuffle(cands).slice(0, 3)));
      return C('다음 중 세 수의 공약수인 것은?', rows.map(fx), rows.indexOf(good), {
        figure: shelf(fs.map(fx)),
        explain: `${gTold(fs)} 세 수의 최대공약수는 ${fx(gF)}이다. 공약수는 최대공약수의 약수이므로 ${fmj(good, '이/가')} 공약수이다. 나머지는 세 수 가운데 약수가 되지 못하는 수가 있다.`,
        facts: { truth: rows.map((b) => vs.every((v) => v % num(b) === 0)), want: true, rule: 'common-pick-three' }
      });
    }, { count: 2 }),
    T('gcd-common-count', '최대공약수를 알 때 공약수의 개수', '①53·54', (d) => {
      // 최대공약수를 소인수분해 한 식으로 준다(약수를 늘어놓아 세는 초등 문제와 겹치지 않게).
      const f = form(d, { ps: [2, 3, 5, 7], k: d.pick([2, 3]), lo: 48, hi: 1500, ok: (h) => nd(h) >= 8 && nd(h) <= 24 }), g = num(f), a = V('A'), b = V('B');
      return N(`두 자연수 ${a}, ${b}의 최대공약수가 ${fm(f)}일 때, ${a}, ${b}의 공약수는 모두 몇 개인가?`, nd(f), {
        unit: '개', explain: `두 수의 공약수는 최대공약수 ${fx(f)}의 약수이다. 약수의 개수는 각 소인수의 지수에 1을 더한 수를 모두 곱한 것과 같으므로 ${ndTold(f)}이다.`,
        facts: { count: range(1, g).map((k) => g % k === 0) }
      });
    }),
    T('gcd-coprime-pick', '서로소인 두 수 고르기', '①65 심29', (d, n) => {
      if (n === 0) {
        const YES = [[9, 16], [14, 25], [8, 21], [15, 28], [21, 40], [16, 35], [25, 36], [27, 35], [12, 35], [20, 27]], NO = [[12, 16], [21, 35], [26, 39], [18, 27], [22, 55], [34, 51], [14, 49], [15, 39], [24, 45], [28, 63], [33, 77], [35, 49], [27, 63], [38, 57]];
        const right = d.pick(YES), rows = d.shuffle([right].concat(d.shuffle(NO).slice(0, 4))), text = ([a, b]) => `${josa(a, '과/와')} ${b}`;
        return C('다음 중 두 수가 서로소인 것은?', rows.map(text), rows.indexOf(right), {
          explain: `${eqn(right[0])}, ${eqn(right[1])}에는 공통인 소인수가 없으므로 최대공약수가 1이다. 나머지 두 수의 최대공약수는 차례로 ${rows.filter((r) => r !== right).map(([a, b]) => gcd(a, b)).join(', ')}이다.`,
          facts: { truth: rows.map(([a, b]) => divs(a).filter((k) => b % k === 0).length === 1), want: true, rule: 'coprime-pick-number' }
        });
      }
      // 소인수분해 한 식으로 준 두 수: 공통인 소인수가 있는지만 보면 된다.
      const small = (f) => num(f) <= 900 && f.every(([p, e]) => p <= 3 || e <= 2);
      const pair = (share) => d.until(() => { const ps = d.shuffle([2, 3, 5, 7, 11, 13]); return [sortF([[ps[0], d.int(1, 4)], [ps[1], d.int(1, 2)]]), sortF([[share ? ps[d.int(0, 1)] : ps[2], d.int(1, 4)], [ps[3], d.int(1, 2)]])]; }, ([a, b]) => small(a) && small(b));
      const text = ([a, b]) => `${fmj(a, '과/와')} ${fm(b)}`, right = pair(false), rows = d.until(() => d.shuffle([right, pair(true), pair(true), pair(true)]), (list) => new Set(list.map(text)).size === 4);
      const shared = rows.filter((r) => r !== right).map(([a, b]) => a.find(([p]) => expIn(b, p))[0]);
      return C('다음은 두 수를 각각 소인수분해 하여 나타낸 것이다. 두 수가 서로소인 것은?', rows.map(text), rows.indexOf(right), {
        explain: `공통인 소인수가 없는 두 수는 최대공약수가 1이므로 서로소이다. ${text(right)}에는 공통인 소인수가 없다. 나머지는 차례로 ${shared.join(', ')}${tail(shared[2], '을/를')} 공통인 소인수로 가진다.`,
        facts: { truth: rows.map(([a, b]) => gcd(num(a), num(b)) === 1), want: true, rule: 'coprime-pick-form' }
      });
    }, { count: 2 }),
    T('gcd-coprime-with', '한 수와 서로소인 수 고르기', '①66', (d) => {
      const v = d.pick([12, 18, 20, 24, 28, 30, 36, 42, 45]), ps = fz(v).map(([p]) => p), right = d.pick(range(5, 60).filter((k) => gcd(k, v) === 1));
      const wrong = d.until(() => d.shuffle(range(4, 60).filter((k) => gcd(k, v) > 1 && k !== v)).slice(0, 4), (list) => list.some((k) => k % ps[0] !== 0)), rows = d.shuffle([right].concat(wrong));
      return C(`다음 중 ${josa(v, '과/와')} 서로소인 수는?`, rows.map(String), rows.indexOf(right), {
        explain: `${eqn(v)}이다. ${v}의 소인수 ${ps.join(', ')} 가운데 어느 것으로도 나누어떨어지지 않는 ${josa(right, '이/가')} ${josa(v, '과/와')} 서로소이다.`,
        facts: { truth: rows.map((k) => divs(k).filter((x) => v % x === 0).length === 1), want: true }
      });
    }),
    T('gcd-coprime-range', '범위 안에서 한 수와 서로소인 수의 개수', '①67', (d) => {
      const v = d.pick([6, 8, 9, 10, 12, 14, 15, 18, 20]), top = d.int(12, 20), ps = fz(v).map(([p]) => p), hits = range(1, top).filter((k) => gcd(k, v) === 1);
      return N(`${top} 이하의 자연수 가운데 ${josa(v, '과/와')} 서로소인 수는 모두 몇 개인가?`, hits.length, {
        unit: '개', explain: `${eqn(v)}이므로 ${ps.join(', ')}의 배수가 아닌 수를 찾는다. 1은 모든 자연수와 서로소이다. ${josa(v, '과/와')} 서로소인 수는 ${hits.join(', ')}의 ${hits.length}개이다.`,
        facts: { count: range(1, top).map((k) => divs(k).filter((x) => v % x === 0).length === 1) }
      });
    }),
    T('gcd-mixed-claims', '소수·소인수·약수의 개수·서로소가 섞인 설명의 참·거짓', '①11', (d) => {
      const wantTrue = d.bool(), p = d.pick([3, 5, 7]), [r, s] = asc(d.shuffle([2, 3, 5, 7]).slice(0, 2)), v = d.pick([60, 84, 90, 126]);
      const [f, f2] = d.until(() => [0, 1].map(() => form(d, { ps: [2, 3, 5], k: 2, lo: 12, hi: 200, ok: (g) => nd(g) >= 6 })), ([x, y]) => num(x) !== num(y));
      const co = d.pick([[4, 9], [8, 15], [9, 14], [10, 21]]), nco = d.pick([[4, 6], [9, 15], [6, 21], [10, 15], [14, 21]]), slip = f2.reduce((t, [, e]) => t + e, 0), times = (a, k) => Array(k).fill(a).join(' × ');
      const yes = [`${times(r, 2)} × ${times(s, 3)} = ${r}${sup(2)} × ${s}${sup(3)}`, `${josa(co[0], '과/와')} ${josa(co[1], '은/는')} 서로소이다.`, `${fm(f)}의 약수는 ${nd(f)}개이다.`, `${v}의 소인수는 ${fz(v).map(([q]) => q).join(', ')}이다.`, '10 이하의 소수는 4개이다.'];
      const no = [
        [`${p * p}의 소인수는 1, ${p}, ${p}${sup(2)}이다.`, `${p * p} = ${p}${sup(2)}의 소인수는 ${p} 하나뿐이다.`], ['1은 소수이다.', '1은 소수도 합성수도 아니다.'],
        [`${josa(nco[0], '과/와')} ${josa(nco[1], '은/는')} 서로소이다.`, `${josa(nco[0], '과/와')} ${nco[1]}의 최대공약수는 ${gcd(nco[0], nco[1])}이므로 서로소가 아니다.`],
        [`${fm(f2)}의 약수는 ${slip}개이다.`, `${fx(f2)}의 약수는 ${ndTold(f2)}에서 ${nd(f2)}개이다.`],
        [`${r}${sup(3)} = ${r} × 3`, `${r}${sup(3)} = ${times(r, 3)} = ${r ** 3}이다.`]
      ];
      return ruled(claimQ(d, `소수, 소인수, 약수, 서로소에 대한 설명으로 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, yes, no, wantTrue), 'mixed-claims');
    })
  ]);

  // ── 공배수, 최소공배수 ──
  B.addTypes(U, 'lcm', [
    T('lcm-form', '소인수분해 한 두 수의 최소공배수', '①70·73', (d, n) => {
      // 첫째는 최소공배수를 자연수로, 둘째는 소인수끼리 세로로 맞춘 표에서 지수와 한 수에만 있는 소인수로 답한다.
      if (n === 0) {
        const fs = someForms(d, 2, { hi: 600, lmax: 3000 }), vs = fs.map(num), l = lcm(vs[0], vs[1]);
        return N(`두 수 ${fm(fs[0])}, ${fm(fs[1])}의 최소공배수는?`, l, {
          explain: `${lTold(fs)} 최소공배수는 ${fx(fz(l))} = ${l}이다.`,
          facts: { calc: [[lcmJs(fs.map(fjs), primesOf(fs), Math.max(...vs)), 0]], unseen: UNSEEN, rule: 'lcm-form-value' }
        });
      }
      const fs = someForms(d, 2, { hi: 900, lo: 30, side1: true, ok: (list, gF) => primesOf(list).length === 3 && gF.length === 2 }), vs = fs.map(num), ps = primesOf(fs), gF = gcdF(fs), lF = lcmF(fs);
      const result = ps.reduce((o, p, i) => Object.assign(o, { [p]: expIn(gF, p) ? p + sup(LAB[i]) : box(LAB[i]) }), {});
      return M(`${josa(vs[0], '과/와')} ${josa(vs[1], '을/를')} 소인수분해 하여 최소공배수를 구하려고 한다. ㉠, ㉡, ㉢에 알맞은 수는?`, ps.map((p, i) => ({ label: LAB[i], answer: expIn(gF, p) ? expIn(lF, p) : p })), {
        figure: aligned(ps, [{ head: `${vs[0]} =`, cells: cellsOf(fs[0]) }, { head: `${vs[1]} =`, cells: cellsOf(fs[1]) }, { head: '최소공배수 =', cells: result, rule: true }]),
        explain: `${lTold(fs)} 최소공배수는 ${fx(lF)}이다.`,
        facts: { calc: ps.map((p, i) => [expIn(gF, p) ? lExp(vs.map(String), p, Math.max(...vs)) : String(p), i]), unseen: UNSEEN, rule: 'lcm-form-exp' }
      });
    }, { count: 2 }),
    T('lcm-num', '소인수분해를 이용하여 두 자연수의 최소공배수 구하기', '①71', (d) => {
      const fs = someForms(d, 2, { hi: 200, lo: 24, gmin: 4, lmax: 2000 }).sort((x, y) => num(x) - num(y)), vs = fs.map(num), l = lcm(vs[0], vs[1]);
      return N(`소인수분해를 이용하여 ${josa(vs[0], '과/와')} ${vs[1]}의 최소공배수를 구하시오.`, l, {
        explain: `${eqn(vs[0])}, ${eqn(vs[1])}이다. ${lTold(fs)} 최소공배수는 ${fx(fz(l))} = ${l}이다.`,
        facts: { calc: [[lcmJs(vs.map(String), [2, 3, 5, 7], vs[1]), 0]], unseen: UNSEEN }
      });
    }),
    T('lcm-three', '세 수의 최소공배수', '①72', (d, n) => {
      // 첫째는 소인수분해 한 식 셋, 둘째는 자연수 셋(소인수분해부터 한다)이다.
      const fs = someForms(d, 3, n === 0 ? { hi: 400, gmin: 2, lmax: 4000 } : { hi: 120, lo: 12, gmin: 2, lmax: 2000 }), vs = fs.map(num), l = vs.reduce((x, y) => lcm(x, y));
      const facts = { calc: [[lcmJs(n === 0 ? fs.map(fjs) : vs.map(String), [2, 3, 5, 7], Math.max(...vs)), 0]], unseen: UNSEEN, rule: 'lcm-three-' + n };
      if (n === 0) return N('다음 세 수의 최소공배수는?', l, { figure: shelf(fs.map(fx)), explain: `${lTold(fs)} 최소공배수는 ${fx(fz(l))} = ${l}이다.`, facts });
      return N(`소인수분해를 이용하여 세 수 ${vs.join(', ')}의 최소공배수를 구하시오.`, l, { explain: `${vs.map(eqn).join(', ')}이다. ${lTold(fs)} 최소공배수는 ${fx(fz(l))} = ${l}이다.`, facts });
    }, { count: 2 }),
    T('gl-both', '최대공약수와 최소공배수를 함께 구하기', '①74·75', (d, n) => {
      if (n === 0) {
        const fs = someForms(d, 2, { hi: 600, lmax: 5000, ok: (list, gF) => composite(gF) }), vs = fs.map(num), g = gcd(vs[0], vs[1]), l = lcm(vs[0], vs[1]), ps = primesOf(fs), top = Math.max(...vs);
        return M(`두 수 ${fm(fs[0])}, ${fm(fs[1])}의 최대공약수와 최소공배수는?`, [{ label: '최대공약수', answer: g }, { label: '최소공배수', answer: l }], {
          explain: `최대공약수는 공통인 소인수의 거듭제곱에서 지수가 같거나 작은 것을 골라 곱한 ${fx(fz(g))} = ${g}이다. 최소공배수는 모든 소인수의 거듭제곱에서 지수가 같거나 큰 것을 골라 곱한 ${fx(fz(l))} = ${l}이다.`,
          facts: { calc: [[gcdJs(fs.map(fjs), ps, top), 0], [lcmJs(fs.map(fjs), ps, top), 1]], unseen: UNSEEN, rule: 'gl-both-two' }
        });
      }
      // 세 수: 식 두 개의 짝을 고른다. 틀린 보기: 최대공약수에 큰 지수를 고른 것, 최소공배수에서 공통이 아닌 소인수를 빠뜨린 것, 최대공약수에 공통이 아닌 소인수를 넣은 것
      const fs = someForms(d, 3, { hi: 2500, ok: (list, gF, lF) => lF.length > gF.length && gF.some(([p, e]) => expIn(lF, p) > e) }), gF = gcdF(fs), lF = lcmF(fs);
      const gMax = gF.map(([p]) => [p, expIn(lF, p)]), gAll = lF.map(([p]) => [p, expIn(gF, p) || Math.min(...fs.map((f) => expIn(f, p)).filter(Boolean))]);
      const pairText = ([a, b]) => `${fm(a)}, ${fm(b)}`, right = [gF, lF], rows = d.shuffle([right, [gMax, lF], [gF, gMax], [gAll, lF]]);
      return C('다음 세 수의 최대공약수와 최소공배수를 차례대로 구한 것은?', rows.map(pairText), rows.indexOf(right), {
        figure: shelf(fs.map(fx)),
        explain: `최대공약수는 세 수에 공통인 소인수의 거듭제곱에서 지수가 가장 작은 것을 골라 곱한 ${fx(gF)}이다. 최소공배수는 모든 소인수의 거듭제곱에서 지수가 가장 큰 것을 골라 곱한 ${fx(lF)}이다.`,
        facts: { truth: rows.map((r) => r === right), want: true, rule: 'gl-both-three' }
      });
    }, { count: 2 }),
    T('gl-claims', '두 수의 최대공약수와 최소공배수에 대한 설명의 참·거짓', '①76', (d) => {
      // 틀린 말: 최대공약수에 큰 지수를 고른 것, 최소공배수의 지수를 더한 것, 약수의 개수를 지수의 곱으로 센 것, 공약수를 최소공배수의 약수라고 한 것
      const fs = someForms(d, 2, { hi: 900, ok: (list, gF, lF) => lF.length > gF.length && gF.some(([p, e]) => expIn(lF, p) > e) && gF.reduce((t, [, e]) => t * e, 1) !== nd(gF) }), gF = gcdF(fs), lF = lcmF(fs);
      const gMax = gF.map(([p]) => [p, expIn(lF, p)]), lSum = lF.map(([p]) => [p, expIn(fs[0], p) + expIn(fs[1], p)]), slip = gF.reduce((t, [, e]) => t * e, 1), at = d.int(0, 3);
      const all = [
        [`최대공약수는 ${fm(gF)}이다.`, `최대공약수는 ${fm(gMax)}이다.`, `최대공약수는 공통인 소인수의 거듭제곱에서 지수가 같거나 작은 것을 골라 곱한 ${fx(gF)}이다.`],
        [`최소공배수는 ${fm(lF)}이다.`, `최소공배수는 ${fm(lSum)}이다.`, `최소공배수는 지수를 더하는 것이 아니라 지수가 같거나 큰 것을 골라 곱한 ${fx(lF)}이다.`],
        [`공약수는 모두 ${nd(gF)}개이다.`, `공약수는 모두 ${slip}개이다.`, `공약수는 최대공약수 ${fx(gF)}의 약수이므로 ${ndTold(gF)}에서 ${nd(gF)}개이다.`],
        [`공배수는 ${fm(lF)}의 배수와 같다.`, `공약수는 ${fm(lF)}의 약수와 같다.`, `공약수는 최대공약수 ${fx(gF)}의 약수와 같다.`]
      ];
      const rows = d.shuffle(all.map((r, i) => [i === at ? r[1] : r[0], i !== at, r[2]]));
      return C(`두 수 ${fm(fs[0])}, ${fm(fs[1])}에 대한 설명으로 옳지 않은 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => !r[1]), {
        explain: rows.find((r) => !r[1])[2],
        facts: { truth: rows.map((r) => r[1]), want: false }
      });
    }),
    T('lcm-multiple-pick', '공배수가 아닌 것 고르기(보기가 소인수분해 한 식)', '①81', (d) => {
      // 틀린 보기: 한 수의 배수이지만 다른 수의 배수는 아닌 수(한 소인수의 지수가 최소공배수의 지수보다 1 작다)
      const fs = someForms(d, 2, { hi: 600, lmax: 5000 }), vs = fs.map(num), lF = lcmF(fs), l = num(lF);
      const p = d.pick(lF.filter(([q]) => expIn(fs[0], q) !== expIn(fs[1], q)).map(([q]) => q)), bad = fz(l / p * d.pick([2, 3, 5, 7, 11].filter((q) => q !== p))), e0 = expIn(bad, p);
      const rows = d.shuffle(d.shuffle([1, 2, 3, 4, 5, 6, 7, 10]).slice(0, 4).map((m) => fz(l * m)).concat([bad]));
      return C(`다음 중 두 수 ${fm(fs[0])}, ${fm(fs[1])}의 공배수가 아닌 것은?`, rows.map(fx), rows.indexOf(bad), {
        explain: `두 수의 최소공배수는 ${fx(lF)}이고, 공배수는 최소공배수의 배수이다. ${fmj(bad, '은/는')} ${e0 ? `소인수 ${p}의 지수가 ${e0}이고, 이것은 최소공배수에서 ${p}의 지수 ${e0 + 1}보다 작으므로` : `소인수 ${josa(p, '이/가')} 없으므로`} 공배수가 아니다.`,
        facts: { truth: rows.map((b) => vs.every((v) => num(b) % v === 0)), want: false }
      });
    })
  ]);

  // ── 최대공약수와 최소공배수를 알 때 수 구하기 ──
  B.addTypes(U, 'back', [
    T('back-gcd-exp', '최대공약수를 알 때 지수 구하기', '①84 심35', (d) => {
      // ㉠은 첫째 수의 지수, ㉡은 둘째 수의 지수이다. 최대공약수의 지수는 두 지수 가운데 작은 것이므로, 맞은편 지수를 더 크게 주어야 답이 하나로 정해진다.
      const [p, q] = asc(d.shuffle([2, 3, 5]).slice(0, 2)), x = d.int(1, 2), y = d.int(1, 2), x2 = x + d.int(1, 2), y2 = y + d.int(1, 2), r = d.pick([5, 7, 11].filter((v) => v !== p && v !== q)), side = d.int(0, 2), g = p ** x * q ** y;
      const a = `${p}${sup(LAB[0])} × ${pw(q, y2)}${side === 1 ? ' × ' + r : ''}`, b = `${pw(p, x2)} × ${q}${sup(LAB[1])}${side === 2 ? ' × ' + r : ''}`;
      return M(`다음 두 수의 최대공약수가 ${g}일 때, ㉠, ㉡에 알맞은 자연수는?`, [{ label: LAB[0], answer: x }, { label: LAB[1], answer: y }], {
        figure: shelf([a, b]),
        explain: `${eqn(g)}이다. 최대공약수의 지수는 두 수의 지수 가운데 같거나 작은 것이다. ${p}의 지수는 ㉠과 ${x2} 가운데 작은 것이 ${x}이므로 ㉠은 ${x}이고, ${q}의 지수는 ${josa(y2, '과/와')} ㉡ 가운데 작은 것이 ${y}이므로 ㉡은 ${y}이다.`,
        facts: { calc: [[expJs(g, p, g), 0], [expJs(g, q, g), 1]], unseen: UNSEEN }
      });
    }),
    T('back-gl-exp', '최대공약수와 최소공배수를 알 때 지수 구하기', '①85 심37', (d) => {
      // ㉠은 최대공약수에서(작은 지수), ㉡은 최소공배수에서(큰 지수) 정해진다.
      const [p, q] = asc(d.shuffle([2, 3, 5]).slice(0, 2)), x = d.int(1, 2), x2 = x + d.int(1, 2), y2 = d.int(1, 2), y = y2 + d.int(1, 2), r = d.pick([7, 11, 13]), side = d.bool();
      const gF = [[p, x], [q, y2]], lF = sortF([[p, x2], [q, y]].concat(side ? [[r, 1]] : []));
      const a = `${p}${sup(LAB[0])} × ${pw(q, y2)}${side ? ' × ' + r : ''}`, b = `${pw(p, x2)} × ${q}${sup(LAB[1])}`;
      return M(`다음 두 수의 최대공약수가 ${fm(gF)}, 최소공배수가 ${fm(lF)}일 때, ㉠, ㉡에 알맞은 자연수는?`, [{ label: LAB[0], answer: x }, { label: LAB[1], answer: y }], {
        figure: shelf([a, b]),
        explain: `최대공약수의 지수는 두 수의 지수 가운데 같거나 작은 것이고, 최소공배수의 지수는 같거나 큰 것이다. ${p}의 지수 ㉠과 ${x2} 가운데 작은 것이 ${x}이므로 ㉠은 ${x}이다. ${q}의 지수 ${josa(y2, '과/와')} ㉡ 가운데 큰 것이 ${y}이므로 ㉡은 ${y}이다.`,
        facts: { calc: [[expJs(fjs(gF), p, num(gF)), 0], [expJs(fjs(lF), q, num(lF)), 1]], unseen: UNSEEN }
      });
    }),
    T('back-other', '한 수와 최대공약수·최소공배수를 알 때 다른 수 구하기', '①89', (d) => {
      const [g, m, k] = d.until(() => [d.pick([6, 8, 9, 12, 15, 18]), d.int(2, 7), d.int(2, 7)], ([G, s, t]) => s !== t && gcd(s, t) === 1 && G * s * t <= 999), a = g * m, b = g * k, l = g * m * k, x = V('A');
      const bF = fz(b), gF = fz(g), lF = fz(l), aF = fz(a);
      const told = lF.map(([p, el]) => (expIn(gF, p) ? `${p}의 지수는 ${b}에서 ${expIn(bF, p)}, 최대공약수에서 ${expIn(gF, p)}, 최소공배수에서 ${el}이므로 ${x}에서는 ${expIn(aF, p)}이다.` : expIn(bF, p) ? `${josa(p, '은/는')} 최대공약수의 소인수가 아니므로 ${x}의 소인수가 아니다.` : `${josa(p, '은/는')} ${b}의 소인수가 아니므로 최소공배수의 ${pw(p, el)}${el > 1 ? '은' : tail(p, '은/는')} ${x}의 것이다.`)).join(' ');
      return N(`두 자연수 ${x}, ${b}의 최대공약수가 ${g}, 최소공배수가 ${l}일 때, ${x}의 값은?`, a, {
        explain: `${eqn(b)}, ${eqn(g)}, ${eqn(l)}이다. 소인수마다 두 수의 지수 가운데 작은 것이 최대공약수의 지수, 큰 것이 최소공배수의 지수이다. ${told} ${x} = ${fx(aF)} = ${a}이다.`,
        facts: { calc: [[`${g}*${l}/${b}`, 0]] }
      });
    }),
    T('back-times', '같은 수를 곱한 세 수의 최소공배수를 알 때 그 수 구하기', '①91', (d) => {
      const cs = d.pick([[2, 4, 5], [2, 3, 4], [3, 4, 6], [2, 5, 6], [3, 5, 6], [4, 6, 9], [2, 3, 5], [3, 4, 8], [2, 3, 9]]), l0 = cs.reduce((a, b) => lcm(a, b)), k = d.int(2, 9), x = V('x');
      return N(`세 자연수 ${cs.map((c) => nb(`${c} × ${x}`)).join(', ')}의 최소공배수가 ${l0 * k}일 때, ${x}의 값은?`, k, {
        explain: `${cs.join(', ')}의 최소공배수는 ${l0}이므로 세 수의 최소공배수는 ${l0} × ${x}이다. ${l0} × ${x} = ${l0 * k}이므로 ${x} = ${l0 * k} ÷ ${l0} = ${k}이다.`,
        facts: { calc: [[`${l0 * k}/(${lcmJs(cs.map(String), [2, 3, 5], 9)})`, 0]], unseen: UNSEEN }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
