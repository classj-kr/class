// 중학교 3학년 1학기 2단원 근호를 포함한 식의 계산 — 실력 문항.
// 단원 틀과 도구, 싣는 기준, 뺀 것과 까닭은 9-1-2a.js 에 있다. ref: 심n = 심화꼴의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 ①의 장치는 이 잘못을 가진 아이가 걸리게 만들었다)
//  - 근호 밖으로 꺼낸 수를 수로만 본다. √450 = 15√2 에서 15 = 3 × 5 = (√3)² × (√5)² 임을 놓치고 abc 처럼 문자 하나씩으로 적는다.
//  - 근호 안에 문자가 든 항(√(60x), √(15x))을 「근호 안이 다르니 모을 수 없다」고 여긴다. √(60x) = 2√(15x) 로 고치면 모인다.
//  - 「유리수가 되는 조건」의 반대(무리수가 되는 조건)를 같은 등식(=)으로 고른다. 무리수이려면 근호 항의 계수가 0이 아니어야(≠) 한다.
//  - 음수인 문자를 근호 안으로 넣을 때 부호를 그대로 들고 들어간다. a < 0 이면 a = −√(a²) 이다.
//  - 곱이 0이 되는 꼴 a·X² = 0 을 펼쳐 풀려 한다(곱셈 공식이 있어야 한다). a > 0 이면 X = 0 이다.
//  - f(√256) 에서 √256 = 16 을 먼저 구해야 하는데 √256 자체의 정수 부분(16)을 답으로 쓴다.
//  - n − √m 의 정수 부분을 n − (√m 의 정수 부분)으로 셈한다(4 − √5 의 정수 부분은 2가 아니라 1이다).
//  - 나눗셈 기호(÷)가 바로 앞의 분수에만 걸리는데 앞의 식 전체를 나눈다.
//
// 실력에는 ① 문제의 수·기호에 함정이 있어 배운 뜻을 정확히 대야 풀리는 문제와 ② 세 단계 넘게 이어 생각해야 풀리는 문제만 실었다.
// 수집본 기본 문서에 나오는 꼴(유리수가 되는 조건, 정수 부분·소수 부분, 계수 맞추기, 세 수의 대소)은 기본 묶음에 있다.
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, N, C, inline } = B.kit;
  const { MINUS, range, gcd, Q, qmul, qdiv, qadd, qneg, isInt, fl, mag, nb, tail, V, sup, rt, sqParts, radText, linAns } = B.kit.mid;
  const K = B.kit.m912;
  const { STD, UNIT, CALC, ONE, isSq, pickSqf, xv, fv, sameV, ordV, termOf, mk, vh, htmlX, xh, xex, told, simpLine, calcOf, stripH, seal, more, isR, rA, nA, isFr, fA, isQ, qA, isS, sA, isTw, tA, pickV, pickRows, near, co, letters, lt, numV, negV, addV } = K;
  // 실력 문항. 기본 자료에서만 나온 꼴은 ref 를 '기본 ①46' 처럼 적는다.
  const H = (id, title, ref, make, more0) => Object.assign({ id, level: '실력', title, source: ref.startsWith('기본 ') ? '수집본 기본 자료(' + ref.slice(3) + ')' : '수집본 심화 자료(' + ref + ')', make }, more0 || {});
  const eqex = (left, right) => '<span class="mb-expr"' + B.kit.mid.fit(K.emX(left) + K.emX(right) + 1.62) + '>' + htmlX(left, true) + ' <i>=</i> ' + htmlX(right, true) + '</span>';
  const fx = (name, arg) => V(name) + '(' + arg + ')';

  B.addGroup(UNIT, {
    id: 'hard', title: '실력 문제', standard: STD,
    types: [
      // ── ① 문제의 수·기호에 함정이 있어 뜻을 정확히 대야 풀리는 문제 ──
      H('hard-letters', '세 제곱근을 문자로 놓고 다른 제곱근 나타내기', '심3', (d) => {
        // 함정: 근호 밖으로 나온 3, 5를 b², c² 로 적어야 한다. abc(문자 하나씩), 근호 안의 제곱을 그대로 둔 꼴을 고르는 아이가 있다.
        const [p, q, r] = d.shuffle([2, 3, 5, 7]).slice(0, 3).sort((x, y) => x - y);
        const [e1, e2, e3] = d.until(() => [d.int(1, 2), d.int(1, 2), d.int(1, 2)], (es) => es.filter((e) => e === 2).length >= 1 && es.filter((e) => e === 1).length >= 1);
        const N0 = p ** e1 * q ** e2 * r ** e3;
        // 문자식 a^i b^j c^k 의 값과 글
        const val = ([i, j, k]) => Math.sqrt(p) ** i * Math.sqrt(q) ** j * Math.sqrt(r) ** k;
        const word = ([i, j, k]) => letters('a' + (i > 1 ? i : '') + 'b' + (j > 1 ? j : '') + 'c' + (k > 1 ? k : ''));
        const right = [e1, e2, e3];
        const cands = [[1, 1, 1], [e1 === 2 ? 1 : 2, e2, e3], [e1, e2 === 2 ? 1 : 2, e3], [e1, e2, e3 === 2 ? 1 : 2], [2, 2, 2], [e1 + 1, e2, e3]];
        const pool = [right]; for (const c of d.shuffle(cands)) if (pool.length < 5 && pool.every((x) => !near(val(x), val(c)))) pool.push(c);
        const outs = [[p, e1], [q, e2], [r, e3]].filter(([, e]) => e === 2).map(([v]) => v), ins = [[p, e1], [q, e2], [r, e3]].filter(([, e]) => e === 1).map(([v]) => v);
        return pickRows(d, `${rt(p)} = ${V('a')}, ${rt(q)} = ${V('b')}, ${rt(r)} = ${V('c')}일 때, ${rt(N0)}${tail(N0, '을/를')} ${V('a')}, ${V('b')}, ${V('c')}를 사용하여 나타내면?`, pool.map((x) => [word(x), x === right]), {
          explain: `${rt(N0)} = ${rt(`${[[p, e1], [q, e2], [r, e3]].map(([v, e]) => v + (e > 1 ? sup(2) : '')).join(' × ')}`)} = ${outs.join(' × ')} × ${rt(ins.join(' × '))}이다. ${outs.map((v) => `${v} = (${rt(v)})${sup(2)}`).join(', ')}이므로 ${word(right)}이다.`
        });
      }),
      H('hard-root-x', '근호 안에 문자가 든 두 항을 모아 문자의 값 구하기', '심16', (d) => {
        // 함정: √(s²tx) = s√(tx) 로 고쳐야 같은 근호로 모인다. 근호 안끼리 빼거나(√(60x − 15x)) 모을 수 없다고 멈춘다.
        const [s, t, c, plus] = d.until(() => [d.int(2, 4), d.pick([2, 3, 5, 6, 7, 10, 15]), d.int(1, 9), d.bool()], ([s0, t0, c0, p0]) => { const k = p0 ? s0 + 1 : s0 - 1, x = Q(c0 * c0, k * k * t0); return !isInt(x) && x.q <= 200; });
        const k = plus ? s + 1 : s - 1, x = Q(c * c, k * k * t), xv0 = V('x');
        return fA(`${nb(`${rt(s * s * t + xv0)} ${plus ? '+' : MINUS} ${rt(t + xv0)} = ${c}`)}${tail(c, '을/를')} 만족시키는 유리수 ${xv0}의 값은?`, [{ q: x, m: 1, n: `${c}*${c}`, d: `((${s * s * t}/${t})**0.5${plus ? '+' : '-'}1)**2*${t}`, nv: c * c, dv: k * k * t }], {
          explain: `${rt(s * s * t + xv0)} = ${rt(`${s}<sup>2</sup> × ${t}${xv0}`)} = ${s}${rt(t + xv0)}이므로 ${s}${rt(t + xv0)} ${plus ? '+' : MINUS} ${rt(t + xv0)} = ${k === 1 ? '' : k}${rt(t + xv0)} = ${c}이다. ${rt(t + xv0)} = ${mag(Q(c, k))}, ${t}${xv0} = ${mag(Q(c * c, k * k))}이므로 ${xv0} = ${mag(x)}이다.`,
        });
      }),
      H('hard-irrational', '무리수가 되도록 하는 문자의 조건', '심14', (d) => {
        // 함정: 「유리수가 되는 조건」(=)과 반대이다. 무리수이려면 √q 의 계수가 0이 아니어야(≠) 하므로 「a = …」를 고르면 틀린다.
        const [p, q] = d.until(() => [d.pick([2, 3, 5]), d.pick([2, 3, 5, 7])], ([x, y]) => x !== y);
        const c = d.int(1, 3), k = d.int(2, 5);
        const src = `${co(2 * c, p * q)}([1|r${p}]-r${p * q})-[a|r${q}](${k}r${q}-${q})`;
        // E(a) = 2c√q − 2c·pq − a·k + a√q → √q 의 계수 2c + a
        const a0 = -2 * c, A = V('a'), cond = (op, v) => `${A} ${op} ${v < 0 ? MINUS + -v : v}`;
        const rows = [[cond('≠', a0), true], [cond('=', a0), false], [cond('=', -a0), false], [cond('≠', -a0), false], [cond('≠', 0), false]];
        const check = xv(src, { a: numV(String(-a0)) });
        if (!check.some((t) => t.m === q)) throw new Error('조건이 맞지 않다');
        return pickRows(d, `다음 식을 계산한 결과가 무리수가 되도록 하는 유리수 ${A}의 조건은?`, rows, {
          figure: xex(src),
          explain: `식을 정리하면 ${xh(`${co(2 * c, p * q)}([1|r${p}]-r${p * q})`)} = ${vh(xv(`${co(2 * c, p * q)}([1|r${p}]-r${p * q})`))}, ${frac(A, rt(q))}(${k}${rt(q)} ${MINUS} ${q}) = ${k}${A} ${MINUS} ${A}${rt(q)}이므로 전체는 (${MINUS}${2 * c * p * q} ${MINUS} ${k}${A}) + (${2 * c} + ${A})${rt(q)}이다. 무리수가 되려면 ${rt(q)}의 계수가 0이 아니어야 하므로 ${cond('≠', a0)}이다(${cond('=', a0)}이면 유리수가 된다).`
        });
      }),
      H('hard-negative', '음수인 문자를 근호 안으로 넣어 식의 값 구하기', '심20', (d) => {
        // 함정: a < 0 이면 a√(b/a) = −√(a² × b/a) = −√(ab) 이다. 부호를 그대로 들고 들어가 √(ab) 로 쓰면 부호가 틀린다.
        const [s, u, v, diff] = d.until(() => [d.int(2, 15), d.int(1, 3), d.int(1, 3), d.bool()], ([s0, u0, v0, df]) => !df || u0 !== v0);
        const A = V('a'), Bv = V('b'), inA = (u * u === 1 ? '' : u * u) + Bv, inB = (v * v === 1 ? '' : v * v) + A;
        const value = diff ? -s * u + s * v : -s * u - s * v;
        return seal(N(`${A} &lt; 0, ${Bv} &lt; 0이고 ${rt(A + Bv)} = ${s}일 때, ${nb(`${A}${rt(frac(inA, A))} ${diff ? MINUS : '+'} ${Bv}${rt(frac(inB, Bv))}`)}의 값은?`, value, {
          signed: true,
          explain: `${A} &lt; 0이므로 ${A} = ${MINUS}${rt(A + sup(2))}이고 ${A}${rt(frac(inA, A))} = ${MINUS}${rt(`${A}<sup>2</sup> × ${frac(inA, A)}`)} = ${MINUS}${rt((u * u === 1 ? '' : u * u) + A + Bv)} = ${MINUS}${u === 1 ? '' : u}${rt(A + Bv)}이다. 같은 방법으로 ${Bv}${rt(frac(inB, Bv))} = ${MINUS}${v === 1 ? '' : v}${rt(A + Bv)}이다. 따라서 ${diff ? `${MINUS}${u * s} + ${v * s}` : `${MINUS}${u * s} ${MINUS} ${v * s}`} = ${value < 0 ? MINUS + -value : value}이다.`,
          facts: { calc: [[diff ? `(0-${u === 1 ? '' : u + '*'}${s})+${v === 1 ? '' : v + '*'}${s}` : `(0-${u === 1 ? '' : u + '*'}${s})-${v === 1 ? '' : v + '*'}${s}`, 0]] }
        }));
      }),
      H('hard-compose', '합성한 함숫값이 주어질 때 계수 구하기', '심19', (d) => {
        // 함정: a·{f(√q)}² = 0 에서 a > 0 이므로 f(√q) = 0 이다. 괄호를 펼쳐 풀려 하면 곱셈 공식이 있어야 해서 막힌다.
        const [q, c] = d.until(() => [d.pick([2, 3, 5, 6, 7]), d.int(1, 3)], ([q0, c0]) => !isInt(Q(c0, q0)));
        const S = xv(`[${c}|r${q}]`), A = V('a'), X0 = V('x'), cq = co(c, q);
        return qA(`${nb(`${fx('f', X0)} = ${A}${X0}${sup(2)} ${MINUS} ${xh(cq)}`)}일 때, ${nb(`${fx('f', fx('f', rt(q)))} = ${MINUS}${xh(cq)}`)}${tail(q, '을/를')} 만족시키는 양수 ${A}의 값은?`, S, {
          explain: `${fx('f', fx('f', rt(q)))} = ${A}{${fx('f', rt(q))}}${sup(2)} ${MINUS} ${xh(cq)} = ${MINUS}${xh(cq)}이므로 ${A}{${fx('f', rt(q))}}${sup(2)} = 0이다. ${A} &gt; 0이므로 ${fx('f', rt(q))} = ${q}${A} ${MINUS} ${xh(cq)} = 0이고, ${q}${A} = ${xh(cq)}에서 ${A} = ${vh(S)}이다.`
        });
      }),
      H('hard-fg', '√a의 정수 부분과 소수 부분으로 정한 값', '심24', (d) => {
        // 함정: f(√256) 은 √(√256) = √16 의 정수 부분이다. √256 = 16 을 그대로 답으로 쓰거나, g(√225) 를 0으로 본다.
        const [n1, n2] = d.until(() => [d.int(2, 6), d.int(3, 30)], ([x, y]) => !isSq(y) && y * y <= 9999);
        const A = V('a'), lo = Math.floor(Math.sqrt(n2)), S = xv(`${n1 + lo}-r${n2}`);
        return sA(`양의 실수 ${A}에 대하여 ${rt(A)}의 정수 부분을 ${fx('f', A)}, 소수 부분을 ${fx('g', A)}라 하자. 예를 들어 1 &lt; ${rt(2)} &lt; 2이므로 ${fx('f', 2)} = 1, ${fx('g', 2)} = ${rt(2)} ${MINUS} 1이다. 이때 ${nb(`${fx('f', rt(n1 ** 4))} ${MINUS} ${fx('g', rt(n2 * n2))}`)}의 값은?`, S, {
          explain: `${rt(n1 ** 4)} = ${n1 * n1}, ${rt(n2 * n2)} = ${n2}이므로 ${fx('f', n1 * n1)} ${MINUS} ${fx('g', n2)}${tail(n2, '을/를')} 구한다. ${rt(n1 * n1)} = ${n1}이므로 ${fx('f', n1 * n1)} = ${n1}이고, ${lo} &lt; ${rt(n2)} &lt; ${lo + 1}이므로 ${fx('g', n2)} = ${rt(n2)} ${MINUS} ${lo}이다. ${n1} ${MINUS} (${rt(n2)} ${MINUS} ${lo}) = ${vh(S)}이다.`,
          facts: { calc: [[`((${n1 ** 4})**0.5)**0.5+${lo}`, 0], [calcOf(ordV(S)[1]), 1], [String(ordV(S)[1].m), 2]] }
        });
      }),

      // ── ② 세 단계 넘게 이어 생각해야 풀리는 문제 ──
      H('hard-chain-product', '잇단 제곱근의 곱', '심4', (d) => {
        const [lo, hi] = d.until(() => [d.int(2, 3), d.int(7, 12)], ([x, y]) => { let p = 1; for (let k = x; k <= y; k += 1) p *= k; const [c, m] = sqParts(p); return c <= 9999 && c >= 2 && m >= 2 && m <= 300; });
        let prod = 1; for (let k = lo; k <= hi; k += 1) prod *= k;
        const src = range(lo, hi).map((k) => 'r' + k).join('*'), S = xv(src), [c, m] = sqParts(prod);
        const shown = nb(`${rt(lo)} × ${rt(lo + 1)} × ${rt(lo + 2)} × ⋯ × ${rt(hi)}`);
        return rA(CALC, S, {
          figure: '<span class="mb-expr">' + shown + '</span>',
          explain: `${shown} = ${rt(`${lo} × ${lo + 1} × ⋯ × ${hi}`)}이다. 근호 안의 수를 소인수분해 하면 ${K.fzH(prod)}이므로 ${rt(K.fzH(prod))} = ${radText(c, m)}이다.`,
          rule: 'hard-chain-product'
        });
      }),
      H('hard-four', '근호 안이 분수인 네 수의 곱셈과 나눗셈', '심5', (d) => {
        // a√(p/q) × b√(r/s) ÷ c√(t/u) × √v 가 정수가 되게 √v 를 맞춘다.
        const srcOf = (x) => `${x.a}r[${x.p}|${x.q}]*${x.b}r[${x.r}|${x.s}]:${x.c}r[${x.t}|${x.u}]*r${x.v}`;
        const made = d.until(() => {
          const P = [2, 3, 5, 7, 11], [p, q, r, s, t, u] = [d.pick(P), d.pick(P), d.pick(P), d.pick(P), d.pick(P), d.pick(P)], a = d.int(2, 5), b = d.int(2, 5), c = d.int(2, 5);
          const Y = Q(p * r * u, q * s * t), z = d.int(1, 2), v = Y.p * Y.q * z * z;
          return { p, q, r, s, t, u, a, b, c, v };
        }, (x) => { if (x.p === x.q || x.r === x.s || x.t === x.u || x.v < 2 || x.v > 200 || isSq(x.v)) return false; const S0 = xv(srcOf(x)); return S0.length === 1 && S0[0].m === 1 && isInt(S0[0].q) && Math.abs(S0[0].q.p) <= 99; });
        const src = srcOf(made), S = xv(src);
        const x = made, Rr = qmul(qmul(Q(x.p * x.r * x.u, x.q * x.s * x.t), Q(x.v)), Q(1)), cf = Q(x.a * x.b, x.c), cfH = cf.p === cf.q ? '' : mag(cf);
        return nA(CALC, S, { figure: xex(src), explain: `나눗셈을 역수의 곱셈으로 고쳐 근호 앞의 수끼리, 근호 안의 수끼리 곱한다. ${xh(src)} = ${cfH}${rt(`${frac(x.p, x.q)} × ${frac(x.r, x.s)} × ${frac(x.u, x.t)} × ${x.v}`)} = ${cfH}${rt(mag(Rr))} = ${vh(S)}이다.`, rule: 'hard-four' });
      }),
      H('hard-decimal-roots', '소수·분수의 제곱근을 모아 A√m으로', '심10', (d) => {
        // √(소수) − √(분수) − √(약분하면 분모에 m 이 남는 분수)를 모두 √m 의 몇 배로 고친다. 셋째 항은 유리화가 든다(√(27/6) = √(9/2) = 3√2/2).
        const m = pickSqf(d, [2, 3, 5]);
        const made = d.until(() => { const k1 = d.int(1, 9), k2 = d.int(1, 6), k3 = d.int(1, 5), j = d.pick([1, 3]); return { k1, k2, k3, j, dec: String(k1 * k1 * m / 100), f2: Q(k2 * k2 * m, 25), n3: k3 * k3 * m * j, d3: 4 * j }; },
          (x) => !isInt(x.f2) && Number(x.dec) < 10 && !Number.isInteger(Number(x.dec)) && x.n3 <= 200 && !isInt(Q(x.k1 - 2 * x.k2 - 5 * x.k3, 10)) && x.k3 * x.k3 * m % 4 !== 0);
        const src = `r${made.dec}-r[${made.f2.p}|${made.f2.q}]-r[${made.n3}|${made.d3}]`, S = xv(src);
        if (!(S.length === 1 && S[0].m === m && !isInt(S[0].q))) throw new Error('A 가 분수가 아니다');
        const A = V('A'), q0 = S[0].q;
        return fA(`다음 등식을 만족시키는 유리수 ${A}의 값은?`, [Object.assign({}, S[0], { m: 1 })], {
          figure: eqex(src, `Ar${m}`),
          explain: `${rt(made.dec)} = ${vh(xv('r' + made.dec))}, ${rt(frac(made.f2.p, made.f2.q))} = ${vh(xv(`r[${made.f2.p}|${made.f2.q}]`))}, ${rt(frac(made.n3, made.d3))} = ${vh(xv(`r[${made.n3}|${made.d3}]`))}이다. 모두 ${rt(m)}의 몇 배로 고쳐 계산하면 ${vh(S)}이므로 ${A} = ${q0.p < 0 ? MINUS : ''}${mag(B.kit.mid.qabs(q0))}이다.`
        });
      }),
      H('hard-order', '나눗셈이 앞의 분수에만 걸리는 긴 혼합 계산', '심11', (d) => {
        // 함정(①)이 섞인 다섯 단계 계산: ÷ 는 바로 앞의 분수에만 걸리고, √(s²) = s 이다.
        const made = d.until(() => {
          const p = d.pick([2, 3]), q = d.pick([3, 5, 6, 7]), w = d.pick([2, 3, 5, 6]), s = d.int(2, 4), A = d.int(2, 5) ** 2 * q;
          return { p, q, w, s, A, src: `r${A}+[r${p}(r${s * s}-r${q})|r${p}]-[r${q}-r${p}|r${p}]:[r${p}|r${p * p * w}]` };
        }, (x) => x.p !== x.q && isTw(xv(x.src)) && xv(x.src).every((t) => Math.abs(t.q.p) <= 20) && x.p * x.p * x.w <= 80);
        const S = xv(made.src), { p, q, w, s } = made;
        return tA(CALC, S, {
          figure: xex(made.src),
          explain: `곱셈·나눗셈을 먼저 한다. 둘째 항은 ${xh(`[r${p}(r${s * s}-r${q})|r${p}]`)} = ${s} ${MINUS} ${rt(q)}이다. 셋째 항은 ${xh(`[r${q}-r${p}|r${p}]`)}${tail(p, '을/를')} ${xh(`[r${p}|r${p * p * w}]`)}로 나눈 것이므로 ${xh(`[r${q}-r${p}|r${p}]`)} × ${frac(rt(p * p * w), rt(p))} = ${vh(xv(`[r${q}-r${p}|r${p}]:[r${p}|r${p * p * w}]`))}이다. 모두 모으면 ${vh(S)}이다.`,
          rule: 'hard-order'
        });
      }),
      H('hard-approx', '제곱근의 값으로 근삿값 구하기', '심12', (d) => {
        // 세 항을 모두 √m 의 몇 배(k/10 꼴)로 고친 다음 주어진 값을 곱한다.
        const [m, val] = d.pick([[2, '1.414'], [3, '1.732'], [5, '2.236']]);
        const made = d.until(() => {
          const total = d.pick([10, 20]), k1 = d.int(1, 6), k2 = d.int(1, 7), k3 = total - k1 - k2, a = d.int(1, 9);
          return { total, k1, k2, k3, a, N1: (100 * a * a) / (k1 * k1 * m) };
        }, (x) => x.k3 >= 1 && x.k3 <= 9 && Number.isInteger(x.N1) && !isSq(x.N1) && x.N1 <= 9000 && x.k2 !== x.k3 && (x.k2 * x.k2 * m) % 100 !== 0 && (x.k3 * x.k3 * m) % 100 !== 0);
        const dec2 = String((made.k2 * made.k2 * m) / 100), dec3 = String((made.k3 * made.k3 * m) / 100);
        const src = `[${made.a}|r${made.N1}]+r${dec2}+r${dec3}`, S = xv(src);
        if (!(S.length === 1 && S[0].m === m)) throw new Error('값이 맞지 않다');
        const T0 = made.total / 10, ans = (Number(val) * T0).toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
        const place = (k) => { const v = Number(val) * k; return String(Number(v.toFixed(5))); };
        const opts = [...new Set([ans, place(T0 / 10), place(T0 * 10), place(T0 === 1 ? 2 : 1), place(T0 * 3), place(T0 / 2)])].filter((v) => v !== '0').slice(0, 5);
        if (opts.length < 5) throw new Error('보기가 모자란다');
        const rows = d.shuffle(opts);
        return seal(C(`${rt(m)} = ${val}일 때, 다음 식의 값은?`, rows, rows.indexOf(ans), {
          figure: xex(src), explain: `${frac(made.a, rt(made.N1))} = ${vh(xv(`[${made.a}|r${made.N1}]`))}, ${rt(dec2)} = ${vh(xv('r' + dec2))}, ${rt(dec3)} = ${vh(xv('r' + dec3))}이므로 모두 더하면 ${vh(S)}이다. 따라서 식의 값은 ${T0 === 1 ? `${rt(m)}의 값과 같은 ${ans}` : `${T0} × ${val} = ${ans}`}이다.`,
          facts: { truth: rows.map((v) => v === ans), want: true }
        }));
      }),
      H('hard-linear', '계수에 근호가 든 일차방정식', '심17', (d) => {
        // x/√p + k/√q − (c√p − √q·x)/√(pq) = R√q 를 풀면 x = (Rq − k + c)√(pq)/(2q)
        const made = d.until(() => { const [p, q] = d.shuffle([2, 3, 5]).slice(0, 2); return { p, q, k: d.int(1, 6), c: d.int(1, 9), R: d.int(1, 9) }; },
          (x) => { const top = x.R * x.q - x.k + x.c; if (top % (2 * x.q) !== 0) return false; const co0 = top / (2 * x.q); return Math.abs(co0) >= 2 && Math.abs(co0) <= 20 && x.c !== x.k; });
        const { p, q, k, c, R } = made, co0 = (R * q - k + c) / (2 * q), S = xv(`${co0}r${p * q}`);
        const left = `[x|r${p}]+[${k}|r${q}]-[${co(c, p)}-r${q}x|r${p * q}]`, X0 = V('x');
        return rA(`다음 일차방정식의 해를 ${V('a')}${rt(V('b'))} 꼴로 나타내시오. (단, ${V('b')}는 가장 작은 자연수이다.)`, S, {
          figure: eqex(left, co(R, q)),
          explain: `양변에 ${rt(p * q)}${tail(p * q, '을/를')} 곱하면 ${rt(q)}${X0} + ${xh(co(k, p))} ${MINUS} (${xh(co(c, p))} ${MINUS} ${rt(q)}${X0}) = ${R * q}${rt(p)}이다. 2${rt(q)}${X0} = ${R * q - k + c < 0 ? MINUS : ''}${Math.abs(R * q - k + c)}${rt(p)}이므로 ${X0} = ${frac(`${R * q - k + c < 0 ? MINUS : ''}${Math.abs(R * q - k + c)}${rt(p)}`, `2${rt(q)}`)} = ${vh(S)}이다.`,
          facts: { calc: [[`(${R}*${q}-${k}+${c})/(2*${q})`, 0], [`${p}*${q}`, 1]] }
        });
      }),
      H('hard-fracpart', '정수 부분·소수 부분을 넣은 분수 꼴의 값', '심22', (d) => {
        // n − √m 의 정수 부분 a, 소수 부분 b 로 (a − b)/(c − b) 를 구한다. c = (n − 정수 부분)이어서 분모는 √m 이 된다.
        const [n0, m] = d.until(() => [d.int(3, 9), d.pick([2, 3, 5, 6, 7, 10, 11])], ([x, y]) => x - Math.sqrt(y) > 1.05 && x - Math.sqrt(y) < 8 && 2 * Math.floor(x - Math.sqrt(y)) !== x);
        const f = Math.floor(n0 - Math.sqrt(m)), c = n0 - f, A = V('a'), Bv = V('b');
        const right = mk([[1, 1], [Q(2 * f - n0, m), m]]);
        const wrongs = [mk([[1, 1], [Q(n0 - 2 * f, m), m]]), mk([[-1, 1], [Q(2 * f - n0, m), m]]), mk([[1, 1], [Q(2 * f - n0 + 2, m), m]]), mk([[1, 1], [2 * f - n0, m]]), mk([[1, 1], [Q(2 * f - n0, 1), m]]), mk([[2, 1], [Q(2 * f - n0, m), m]])];
        return pickV(d, `${nb(`${n0} ${MINUS} ${rt(m)}`)}의 정수 부분을 ${A}, 소수 부분을 ${Bv}라 할 때, ${frac(`${A} ${MINUS} ${Bv}`, `${c} ${MINUS} ${Bv}`)}의 값은?`, right, wrongs, {
          explain: `${Math.floor(Math.sqrt(m))} &lt; ${rt(m)} &lt; ${Math.floor(Math.sqrt(m)) + 1}이므로 ${f} &lt; ${n0} ${MINUS} ${rt(m)} &lt; ${f + 1}이다. ${A} = ${f}, ${Bv} = ${n0 - f} ${MINUS} ${rt(m)}이다. ${A} ${MINUS} ${Bv} = ${2 * f - n0 < 0 ? MINUS : ''}${Math.abs(2 * f - n0)} + ${rt(m)}, ${c} ${MINUS} ${Bv} = ${rt(m)}이므로 ${frac(`${2 * f - n0 < 0 ? MINUS : ''}${Math.abs(2 * f - n0)} + ${rt(m)}`, rt(m))} = ${vh(right)}이다.`
        });
      }),
      H('hard-fracpart-letter', '소수 부분을 문자로 놓고 다른 식 나타내기', '심23', (d) => {
        // x = k√m 의 소수 부분 a = k√m − f 에서 √m = (a + f)/k. 식 √(s²m) − √(t²m) = j√m 이고 j 는 k 의 배수이다.
        const [k, m, r, sg, s, t] = d.until(() => [d.int(2, 4), d.pick([2, 3, 5, 6, 7]), d.int(1, 2), d.bool() ? 1 : -1, d.int(2, 9), d.int(2, 9)],
          ([k0, m0, r0, s0, x, y]) => r0 * k0 <= 6 && x - y === s0 * r0 * k0 && x * x * m0 <= 300 && y * y * m0 <= 300);
        const f = Math.floor(k * Math.sqrt(m)), j = sg * r * k;
        const coef = sg * r, cons = sg * r * f, A = V('a');
        return seal(linAns(`${radText(k, m)}의 소수 부분을 ${A}라 할 때, ${rt(s * s * m)} ${MINUS} ${rt(t * t * m)}${tail(t * t * m, '을/를')} ${A}를 사용하여 나타내시오. (${A} 앞의 수가 1이면 1을 적는다.)`, coef, cons, A, {
          explain: `${radText(k, m)} = ${rt(k * k * m)}이고 ${f} &lt; ${rt(k * k * m)} &lt; ${f + 1}이므로 ${A} = ${radText(k, m)} ${MINUS} ${f}, ${rt(m)} = ${frac(`${A} + ${f}`, k)}이다. ${rt(s * s * m)} ${MINUS} ${rt(t * t * m)} = ${radText(s, m)} ${MINUS} ${radText(t, m)} = ${radText(j, m)} = ${j < 0 ? MINUS : ''}${r === 1 ? '' : r}(${A} + ${f})이므로 ${coef < 0 ? MINUS : ''}${Math.abs(coef) === 1 ? '' : Math.abs(coef)}${A} ${cons < 0 ? MINUS : '+'} ${Math.abs(cons)}이다.`,
          facts: { calc: [[`(${s}-${t})/${k}`, 0], [`(${s}-${t})/${k}*${f}`, 1]] }
        }));
      }),
      H('hard-fg-frac', '정수 부분 f(x), 소수 부분 g(x)로 만든 분수의 값', '심25', (d) => {
        // a = √p + c, b = k√q + e 에서 분자 = √p, 분모 = k√q 가 되게 수를 맞춘다.
        const made = d.until(() => { const p = d.pick([2, 3, 5, 6, 7]), k = d.int(1, 3), q = d.pick([2, 3, 5, 7]), e = d.int(1, 3); const c = Math.floor(k * Math.sqrt(q)) - Math.floor(Math.sqrt(p)); return { p, k, q, e, c }; },
          (x) => x.c >= 1 && x.p !== x.q && !isSq(x.k * x.k * x.q) && isQ(xv(`[r${x.p}|${co(x.k, x.q)}]`)));
        const { p, k, q, e, c } = made, fa = c + Math.floor(Math.sqrt(p)), fb = e + Math.floor(k * Math.sqrt(q)), h = fa + fb - c;
        const S = xv(`[r${p}|${co(k, q)}]`), X0 = V('x'), A = V('a'), Bv = V('b');
        return qA(`양의 실수 ${X0}에 대하여 ${fx('f', X0)}는 ${X0}의 정수 부분, ${fx('g', X0)}는 ${X0}의 소수 부분을 나타낸다. ${nb(`${A} = ${rt(p)} + ${c}`)}, ${nb(`${Bv} = ${radText(k, q)} + ${e}`)}일 때, ${frac(`${fx('g', A)} ${MINUS} ${fx('f', Bv)} + ${h}`, `${fx('f', A)} + ${fx('g', Bv)}`)}의 값은?`, S, {
          explain: `${fx('f', A)} = ${fa}, ${fx('g', A)} = ${rt(p)} + ${c} ${MINUS} ${fa} = ${vh(xv(`r${p}+${c - fa}`))}, ${fx('f', Bv)} = ${fb}, ${fx('g', Bv)} = ${vh(xv(`${co(k, q)}+${e - fb}`))}이다. 분자는 ${vh(xv(`r${p}+${c - fa - fb + h}`))}, 분모는 ${vh(xv(`${co(k, q)}+${e - fb + fa}`))}이므로 ${frac(rt(p), radText(k, q))} = ${vh(S)}이다.`
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
