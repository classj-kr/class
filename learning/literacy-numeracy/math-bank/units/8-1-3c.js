// 중학교 2학년 1학기 3단원 일차부등식 — 실력 문항.
// 단원 틀과 도구, 싣는 기준, 뺀 것과 까닭은 8-1-3a.js 에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 ①의 장치는 이 잘못을 가진 아이가 걸리게 만들었다)
//  - 음수를 곱하거나 음수로 나눌 때 부등호의 방향을 그대로 둔다. 거꾸로, 음수가 보이기만 하면(−3을 더할 때, 우변이 음수일 때) 방향을 바꾼다.
//    문자를 곱할 때는 그 문자가 음수인지 따지지 않는다(a < b 이면 ac < bc). 수직선에서 0의 왼쪽에 있는 문자가 음수라는 것을 읽지 않는다.
//  - 일차부등식인지를 적힌 그대로의 x 의 계수에서 읽는다(ax 의 a 만 0이 아니면 된다고 여긴다). 모든 항을 좌변으로 옮겨 정리한 뒤의 계수를 보아야 한다.
//  - 「해가 아니다」를 부등호의 방향만 바꾸어 옮긴다. 「>」가 성립하지 않으면 「≤」이다(등호가 붙는다).
//  - 「크지 않다」를 <, 「작지 않다」를 > 로 옮긴다. 양변의 값이 같을 때 ≤·≥ 가 참임을 놓친다.
//  - 활용에서 부등식의 해를 그대로 답한다. 미지수로 놓은 것(수학 점수)과 묻는 것(두 과목의 평균)이 다를 수 있고,
//    답이 자연수여야 하면 범위에서 다시 골라야 한다(최소는 올림, 「미만·초과」는 끝 수가 들지 않는다).
//  - 범위의 끝 수가 드는지 따지지 않는다(x < a 를 만족시키는 자연수가 4개이면 4 < a ≤ 5 — a = 4 이면 3개, a = 5 이면 4개).
//
// 실력에는 ① 문제의 식·그림·상황에 장치가 있어 배운 뜻을 정확히 대야 풀리는 문제와 ② 세 단계 넘게 이어 생각해야 풀리는 문제만 실었다.
// 기본에서 하는 일을 고르기로 바꾼 것, 풀이 과정의 빈칸·틀린 줄 찾기, 부등식의 성질 문장의 참·거짓, 문장을 부등식으로 옮긴 것의 옳고 그름,
// 해를 수직선 위에 나타낸 것 고르기, 해가 주어질 때 상수 구하기, 답을 자연수로 다시 고르는 활용은 수집본 기본 문서에 여러 번 나오는 꼴이어서 기본 묶음에 있다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { name, NAMES, frac, lines, N, M, C } = B.kit;
  const { LAB, MINUS, GT, LT, Q, tx, nb, tail, js, V, tag, nz, pm, ineqAns } = B.kit.mid;
  const { STD1, STD2, x, va, vb, vc, iq, RH, FLIP, NOT, strict, up, tm, tg, tf, ts, sideH, iqB, iqF, termH, solH, evS, holds, solI, subS, solJ, rangeJ, solve, anyRel, mix } = B.kit.m813;
  // 실력 문항. 기본 자료에서만 나온 꼴은 ref 를 '기본 ①13' 처럼 적는다.
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: ref.startsWith('기본 ') ? '수집본 기본 자료(' + ref.slice(3) + ')' : '수집본 심화 자료(' + ref + ')', make }, more || {});
  const told = (L, r, R) => `부등식을 세우면 ${iqB(L, r, R)}이다. ${solve(L, r, R, 'x').text}`;

  // 눈금 없는 수직선 위에 0과 세 수 a, b, c 를 찍은 그림. order: 왼쪽부터의 차례(['a', 'b', '0', 'c']), gaps: 이웃한 점 사이의 간격(px)
  function bareLine(order, gaps) {
    const y = 26, xs = [34]; gaps.forEach((g) => xs.push(xs[xs.length - 1] + g));
    const W = xs[xs.length - 1] + 34, it = "font-style:italic;font-family:'MB Math','Times New Roman',serif;font-size:16.5px;fill:#1f2933", up0 = 'font-size:14px;font-weight:600;fill:#1f2933';
    let out = `<line class="mb-axis" x1="10" y1="${y}" x2="${W - 10}" y2="${y}"/><path d="M4 ${y}l7 -3.6v7.2z" style="fill:#1f2933"/><path d="M${W - 4} ${y}l-7 -3.6v7.2z" style="fill:#1f2933"/>`;
    order.forEach((n, i) => {
      out += n === '0' ? `<line class="mb-axis" x1="${xs[i]}" y1="${y - 6}" x2="${xs[i]}" y2="${y + 6}"/>` : `<circle class="mb-dot" cx="${xs[i]}" cy="${y}" r="3.4"/>`;
      out += `<text x="${xs[i]}" y="${y + 23}" text-anchor="middle" style="${n === '0' ? up0 : it}">${n}</text>`;
    });
    return `<svg class="mb-numberline" viewBox="0 0 ${W} 58" width="${W}" role="img" aria-label="수직선: 눈금은 없고, 왼쪽부터 ${order.join(', ')}의 차례로 점이 찍혀 있다.">${out}</svg>`;
  }

  B.addGroup('8-1-3', {
    id: 'hard', title: '실력 문제', standard: STD2,
    types: [
      // ── ① 문제의 식·그림·상황에 장치가 있어 뜻을 정확히 대야 풀리는 문제 ──
      H('hard-linear-cond', '일차부등식이 되지 않게 하는 상수', '심15', (d) => {
        // 함정: 「ax 의 계수 a 가 0이면 일차부등식이 아니다」라고 적힌 그대로의 계수에서 읽어 0을 답하는 아이.
        //  모든 항을 좌변으로 옮겨 정리하면 x 의 계수는 (p − q) − a 이다. 이것이 0이 될 때 x 의 항이 사라진다.
        const p = d.int(2, 9), q = d.until(() => pm(d) * d.int(2, 6), (v) => v !== p), b = d.int(1, 9), c = d.int(1, 9), r = anyRel(d), k = p - q, sum = b + c;
        const L = ts([p, 'x'], [-b, '']), R = ts([1, 'ax'], [q, 'x'], [c, '']);
        return N(`다음 ${x}에 대한 부등식이 일차부등식이 되지 않게 하는 상수 ${va}의 값은?`, k, {
          signed: true, figure: iqF(L, r, R),
          explain: `모든 항을 좌변으로 이항하여 정리하면 ${nb(`(${iq(k)} − ${va})${x} − ${sum} ${RH[r]} 0`)}이다. ${x}의 계수 ${nb(`${iq(k)} − ${va}`)}의 값이 0이면 ${x}의 항이 사라져 일차부등식이 아니다. 따라서 ${nb(`${va} = ${iq(k)}`)}이다. ${nb(`${va} = 0`)}일 때는 ${iqB(ts([k, 'x'], [-sum, '']), r, ts([0, '']))}으로 일차부등식이다.`,
          facts: { calc: [[`${p}-${js(Q(q))}`, 0]] }
        });
      }),
      H('hard-line-letters', '수직선 위의 세 수로 만든 부등식 가운데 옳은 것의 개수', '기본 ①13 / 심6', (d) => {
        // 함정: 그림에는 a < 0 같은 말이 없다. 0의 왼쪽에 있는 문자가 음수임을 읽어, 그 문자를 곱하거나 나눌 때 방향을 바꾸어야 한다.
        //  「음수를 곱하면 바뀐다」만 외운 아이는 −a ○ −c 를, 문자의 부호를 읽지 않는 아이는 ab ○ ac 를 틀린다.
        const lay = d.pick([{ order: ['a', 'b', '0', 'c'], sign: { a: -1, b: -1, c: 1 } }, { order: ['a', '0', 'b', 'c'], sign: { a: -1, b: 1, c: 1 } }]), gaps = d.shuffle([48, 66, 84]);
        const trio = [['a', 'b', 'c'], ['a', 'c', 'b'], ['b', 'c', 'a']], prod = (p, m) => [p, m].sort().map(V).join(''), word = (m) => `${nb(`${V(m)} ${lay.sign[m] > 0 ? GT : LT} 0`)}이므로`;
        // 문장: 두 수 p < q 에 한 일(kind)과 적어 놓은 부등호(shown). real 은 바른 부등호.
        const S = (kind, [p, q, m], slip) => {
          const real = kind === 'neg' ? '>' : kind === 'add' || kind === 'sub' ? '<' : lay.sign[m] > 0 ? '<' : '>', shown = slip ? FLIP[real] : real;
          const h = kind === 'neg' ? [`−${V(p)}`, `−${V(q)}`] : kind === 'add' ? [`${V(p)} + ${V(m)}`, `${V(q)} + ${V(m)}`] : kind === 'sub' ? [`${V(p)} − ${V(m)}`, `${V(q)} − ${V(m)}`] : kind === 'mul' ? [prod(p, m), prod(q, m)] : [frac(V(p), V(m)), frac(V(q), V(m))];
          const why = kind === 'neg' ? `${nb(`${V(p)} ${LT} ${V(q)}`)}의 양변에 음수 −1을 곱하면 부등호의 방향이 바뀌어 ${nb(`${h[0]} ${GT} ${h[1]}`)}이다`
            : kind === 'add' || kind === 'sub' ? `${nb(`${V(p)} ${LT} ${V(q)}`)}의 양변에 같은 수를 더하거나 빼도 부등호의 방향은 그대로이므로 ${nb(`${h[0]} ${LT} ${h[1]}`)}이다`
              : `${word(m)} ${nb(`${V(p)} ${LT} ${V(q)}`)}의 양변${kind === 'mul' ? `에 ${V(m)}를 곱하면` : `을 ${V(m)}로 나누면`} ${lay.sign[m] > 0 ? '부등호의 방향은 그대로이고' : '부등호의 방향이 바뀌어'} ${nb(`${h[0]} ${RH[real]} ${h[1]}`)}이다`;
          return { text: nb(`${h[0]} ${RH[shown]} ${h[1]}`), key: h.join('|'), ok: !slip, why };
        };
        const negT = trio.filter((t) => lay.sign[t[2]] < 0), posT = trio.filter((t) => lay.sign[t[2]] > 0), md = () => d.pick(['mul', 'div']);
        // 네 문장: 음수인 문자를 곱하거나 나눈 것, 양수인 문자를 곱하거나 나눈 것, −1을 곱한 것, 더하거나 뺀 것. 저마다 옳게도 틀리게도 적는다.
        const rows = d.until(() => d.shuffle([S(md(), d.pick(negT), d.bool()), S(md(), d.pick(posT), d.bool()), S('neg', d.pick(trio), d.bool()), S(d.pick(['add', 'sub']), d.pick(trio), d.bool())]),
          (list) => { const k = list.filter((s) => s.ok).length; return k >= 1 && k <= 3 && new Set(list.map((s) => s.key)).size === 4; });
        const flags = rows.map((s) => s.ok), k = flags.filter(Boolean).length;
        return N(`수직선 위에 세 수 ${va}, ${vb}, ${vc}와 0을 나타내면 그림과 같다. 다음 중 옳은 것은 모두 몇 개인가?`, k, {
          unit: '개', figure: bareLine(lay.order, gaps) + lines(rows.map((s, i) => tag(LAB[i]) + s.text)),
          explain: `그림에서 ${nb(lay.order.join(` ${LT} `).replace(/[abc]/g, (n) => V(n)))}이다. ${rows.map((s, i) => `${LAB[i]} ${s.why}.`).join(' ')} 옳은 것은 ${LAB.filter((_, i) => flags[i]).join(', ')}의 ${k}개이다.`,
          facts: { count: flags }
        });
      }, { standard: STD1 }),
      H('hard-not-satisfy', '주어진 수가 해가 아닐 때 상수의 값의 범위', '심31', (d) => {
        // 함정: 「해가 아니다」를 부등호의 방향만 바꾸어 옮기는 아이. 「>」가 성립하지 않으면 「≤」이다(등호가 붙고, 「≥」가 성립하지 않으면 등호가 떨어진다).
        const m = d.until(() => { const p = d.int(2, 5), k = nz(d, -4, 4), w = d.int(1, 3), v = nz(d, -6, 6); return { p, k, w, v, c: p * k - (w + 1) * v }; }, (t) => t.c !== 0 && Math.abs(t.c) <= 20);
        const { p, k, w, v, c } = m, r = anyRel(d), L = ts([p, 'x'], [-1, 'a']), R = ts([w, 'a'], [c, '']), Ls = subS(L, 'x', Q(k)), Rs = subS(R, 'x', Q(k)), s = solve(Ls, NOT[r], Rs, 'a'), j = solJ(L, R, 'a', { x: js(Q(k)) });
        return ineqAns(`${nb(`${x} = ${iq(k)}`)}${tail(Math.abs(k), '이/가')} 다음 ${x}에 대한 일차부등식의 해가 아닐 때, 상수 ${va}의 값의 범위를 구하시오.`, s.rel, s.v.p, va, {
          figure: iqF(L, r, R),
          explain: `${nb(`${x} = ${iq(k)}`)}${tail(Math.abs(k), '을/를')} 대입하면 ${iqB(Ls, r, Rs)}이다. ${nb(`${x} = ${iq(k)}`)}${tail(Math.abs(k), '이/가')} 해가 아니므로 이 부등식은 성립하지 않아야 한다. ${RH[r]}가 성립하지 않는 것은 ${RH[NOT[r]]}일 때이므로 ${iqB(Ls, NOT[r], Rs)}이다. ${s.text}`,
          facts: { calc: [[j.expr, 1]], unseen: j.unseen }
        });
      }, { standard: STD1 }),
      H('hard-average-two', '평균의 조건에서 다른 두 번의 평균 구하기', '심43', (d) => {
        // 함정: 부등식의 해(3회 점수)를 그대로 답하는 아이. 묻는 것은 3회 점수와 4회 점수의 평균이다.
        const m = d.until(() => { const k = 2 * d.int(30, 45), e = 2 * d.int(30, 45), g = 2 * d.int(2, 8), t = d.int(70, 85); return { k, e, g, t, math: (4 * t - k - e - g) / 2 }; }, (v) => v.k !== v.e && v.math >= 60 && v.math + v.g <= 98 && v.math !== v.t);
        const { k, e, g, t, math } = m, who = d.pick(NAMES), L = [tf([tm(k, ''), tm(e, ''), tm(1, 'x'), tg(1, ts([1, 'x'], [g, '']))], 4, 1)], R = ts([t, '']), ans = math + g / 2;
        return N(`${name(who, '은/는')} 수학 시험을 네 번 보았다. 1회에 ${k}점, 2회에 ${e}점을 받았고, 4회 점수는 3회 점수보다 ${g}점 높다. 네 번의 평균이 ${t}점 이상일 때, 3회 점수와 4회 점수의 평균은 몇 점 이상인가?`, ans, {
          unit: '점', explain: `3회 점수를 ${x}점이라 하면 4회 점수는 ${nb(`(${x} + ${g})`)}점이다. ${told(L, '>=', R)} 구하는 것은 3회 점수가 아니라 3회와 4회 점수의 평균이다. 두 점수의 평균은 ${nb(`${frac(`${x} + (${x} + ${g})`, 2)} = ${x} + ${g / 2}`)}(점)이므로 ${nb(`${math} + ${g / 2} = ${ans}`)}(점) 이상이다.`,
          facts: { calc: [[`(${t}*4-${k}-${e})/2`, 0]], unseen: [2] }
        });
      }),
      // ── ② 세 단계 넘게 이어 생각해야 풀리는 문제 ──
      H('hard-coef-sign', '해의 방향으로 계수의 부호를 정하고 다른 부등식 풀기', '기본 ①37·39 / 심27·29', (d) => {
        // 해의 부등호가 주어진 부등식과 반대 방향이면 x 의 계수 a 는 음수이다 → 경계로 a 의 값 → 그 a 로 다른 부등식을 풀 때 다시 방향이 바뀐다.
        const m = d.until(() => { const a = -d.int(2, 5), v = nz(d, -4, 4), w = nz(d, -5, 5), b = nz(d, -9, 9), e = nz(d, -9, 9); return { a, v, w, b, e, c: a * v + b, f: a * w + e }; }, (t) => t.c !== 0 && t.f !== 0 && t.v !== t.w && t.b !== t.e);
        const { a, v, w, b, e, c, f } = m, r1 = anyRel(d), r2 = anyRel(d), L1 = ts([1, 'ax'], [b, '']), R1 = ts([c, '']), L2 = ts([1, 'ax'], [e, '']), R2 = ts([f, '']), D = c - b;
        const s2 = solve(subS(L2, 'a', Q(a)), r2, R2, 'x'), quot = `${D * 1 < 0 ? MINUS : ''}${frac(Math.abs(D), va)}`;
        return ineqAns(`${x}에 대한 일차부등식 ${iqB(L1, r1, R1)}의 해가 ${solH('x', FLIP[r1], v)}일 때, ${x}에 대한 일차부등식 ${iqB(L2, r2, R2)}의 해를 구하시오. (단, ${va}는 상수)`, s2.rel, w, x, {
          explain: `${iqB(L1, r1, R1)}에서 ${iqB(ts([1, 'ax']), r1, ts([D, '']))}이다. 해의 부등호가 ${RH[FLIP[r1]]}로 방향이 바뀌었으므로 ${nb(`${va} ${LT} 0`)}이고, 양변을 ${va}로 나누면 ${nb(`${x} ${RH[FLIP[r1]]} ${quot}`)}이다. ${nb(`${quot} = ${iq(v)}`)}에서 ${nb(`${va} = ${iq(a)}`)}이다. 이것을 대입하면 ${iqB(subS(L2, 'a', Q(a)), r2, R2)}이다. ${s2.text}`,
          facts: { calc: [[`(${js(Q(f))}-${js(Q(e))})/((${js(Q(c))}-${js(Q(b))})/${js(Q(v))})`, 1]] }
        });
      }),
      H('hard-natural-n', '자연수인 해가 n개가 되게 하는 상수의 값의 범위', '기본 ①41 ②44 / 심32', (d) => {
        // 해가 x < (a 의 식)일 때 자연수 해가 n 개이려면 경계가 n 과 n + 1 사이에 놓인다. 끝 수가 드는지는 등호가 있고 없음에 따라 반대로 정해진다.
        // 보기: 바른 것 / 끝 수가 드는 쪽을 거꾸로 댄 아이(해의 부등호의 등호를 그대로 옮겼다) / 경계를 n + 1 과 n + 2 사이에 놓은 아이(해가 n + 1 까지라고 세었다) / 둘 다 틀린 아이
        const p = d.int(1, 4), q = d.int(2, 5), sft = d.pick([0, 0, nz(d, -3, 3)]), r = d.pick(['>', '>=']), n = d.int(2, 5), lo = n + sft;
        const L = ts([p, 'x'], [q, 'a']), R = ts([p + q, 'x'], [q * sft, '']), open = strict(r), s1 = open ? '<' : '<=', s2 = open ? '<=' : '<', bound = sideH(ts([1, 'a'], [-sft, '']), true);
        const show = ([l, t1, t2, h]) => nb(`${iq(l)} ${RH[t1]} ${va} ${RH[t2]} ${iq(h)}`), right = [lo, s1, s2, lo + 1], { rows, at } = mix(d, right, [[lo, s2, s1, lo + 1], [lo + 1, s1, s2, lo + 2], [lo + 1, s2, s1, lo + 2]]);
        const list = Array.from({ length: n }, (_, i) => i + 1).join(', ');
        return C(`다음 ${x}에 대한 일차부등식을 만족시키는 자연수 ${x}가 ${n}개일 때, 상수 ${va}의 값의 범위는?`, rows.map(show), at, {
          figure: iqF(L, r, R),
          explain: `${x}를 포함한 항은 좌변으로, 나머지 항은 우변으로 이항하여 정리하면 ${iqB(ts([-q, 'x']), r, ts([-q, 'a'], [q * sft, '']))}이고, 양변을 음수 ${iq(-q)}${tail(q, '으로/로')} 나누면 부등호의 방향이 바뀌어 ${nb(`${x} ${RH[FLIP[r]]} ${bound}`)}이다. 이를 만족시키는 자연수가 ${list}의 ${n}개이려면 ${nb(`${n} ${RH[s1]} ${bound} ${RH[s2]} ${n + 1}`)}이어야 한다. ${nb(`${bound} = ${n}`)}이면 자연수인 해는 ${open ? `${n - 1}개` : `${n}개`}이고, ${nb(`${bound} = ${n + 1}`)}이면 ${open ? `${n}개` : `${n + 1}개`}이다. 따라서 ${show(right)}이다.`,
          facts: { truth: rows.map((row) => row.join() === right.join()), want: true }
        });
      }),
      H('hard-range-integers', 'x의 범위에서 식의 값이 될 수 있는 가장 작은 정수와 가장 큰 정수', '기본 ②19 / 심12', (d) => {
        // 음수를 곱해 양 끝의 수와 등호의 자리가 바뀐 범위에서, 등호가 없는 쪽의 끝 수는 들지 않는다.
        const [lo, hi] = d.until(() => { const v = d.int(-4, 2); return [v, v + d.int(2, 5)]; }, ([p, q]) => p + q !== 0), m = -d.int(2, 5), c = nz(d, -9, 9), [r1, r2] = d.pick([['<', '<='], ['<=', '<'], ['<', '<']]);
        const e = sideH(d.bool() ? ts([c, ''], [m, 'x']) : ts([m, 'x'], [c, '']), true), small = m * hi + c, big = m * lo + c, least = strict(r2) ? small + 1 : small, most = strict(r1) ? big - 1 : big, jc = js(Q(c));
        return M(`${nb(`${iq(lo)} ${RH[r1]} ${x} ${RH[r2]} ${iq(hi)}`)}일 때, ${nb(e)}의 값이 될 수 있는 정수 가운데 가장 작은 수와 가장 큰 수를 구하시오.`, [{ label: '가장 작은 수', answer: least, signed: true }, { label: '가장 큰 수', answer: most, signed: true }], {
          explain: `각 변에 음수 ${iq(m)}${tail(-m, '을/를')} 곱하면 부등호의 방향이 모두 바뀌어 ${nb(`${iq(m * hi)} ${RH[r2]} ${termH(m, 'x')} ${RH[r1]} ${iq(m * lo)}`)}이고, ${c > 0 ? `각 변에 ${c}${tail(c, '을/를')} 더하면` : `각 변에서 ${-c}${tail(-c, '을/를')} 빼면`} ${nb(`${iq(small)} ${RH[r2]} ${e} ${RH[r1]} ${iq(big)}`)}이다. ${strict(r2) ? `${iq(small)}${tail(Math.abs(small), '은/는')} 들지 않으므로` : `${iq(small)}도 들므로`} 가장 작은 정수는 ${iq(least)}, ${strict(r1) ? `${iq(big)}${tail(Math.abs(big), '은/는')} 들지 않으므로` : `${iq(big)}도 들므로`} 가장 큰 정수는 ${iq(most)}이다.`,
          facts: { calc: [[`${jc}-${-m}*${js(Q(hi))}${strict(r2) ? '+1' : ''}`, 0], [`${jc}-${-m}*${js(Q(lo))}${strict(r1) ? '-1' : ''}`, 1]], unseen: [1] }
        });
      }, { standard: STD1 }),
      H('hard-a-then-x', '다른 부등식에서 상수의 범위를 얻어 일차부등식 풀기', '심24', (d) => {
        // a 의 부등식을 풀어 a 와 k 의 대소를 얻는다 → x 의 항을 모으면 계수가 (a − k) → 그 부호를 따져 나눈다.
        const k = d.int(2, 5), w = nz(d, -5, 5), more = d.bool(), g = d.int(1, 3), s0 = d.int(1, 3), q = d.int(1, 9), t = g * k - q, r2 = anyRel(d);
        const flipA = d.bool(), L1 = flipA ? ts([s0, 'a'], [t, '']) : ts([g + s0, 'a'], [-q, '']), R1 = flipA ? ts([g + s0, 'a'], [-q, '']) : ts([s0, 'a'], [t, '']), r1 = (more ? '>' : '<'), shownR1 = flipA ? FLIP[r1] : r1;
        const L2 = ts([1, 'ax'], [-w, 'a']), R2 = ts([k, 'x'], [-w * k, '']), rel = more ? r2 : FLIP[r2], sA = solve(L1, shownR1, R1, 'a'), den = `${va} − ${k}`, wTimes = w === 1 ? '' : w === -1 ? MINUS : iq(w);
        return ineqAns(`${iqB(L1, shownR1, R1)}일 때, ${x}에 대한 일차부등식 ${iqB(L2, r2, R2)}의 해를 구하시오. (단, ${va}는 상수)`, rel, w, x, {
          explain: `${iqB(L1, shownR1, R1)}에서 ${sA.text} ${iqB(L2, r2, R2)}에서 ${x}를 포함한 항은 좌변으로, 나머지 항은 우변으로 이항하면 ${nb(`${va}${x} − ${k}${x} ${RH[r2]} ${sideH(ts([w, 'a'], [-w * k, '']), true)}`)}, 곧 ${nb(`(${den})${x} ${RH[r2]} ${wTimes}(${den})`)}이다. ${nb(`${va} ${RH[r1]} ${k}`)}이므로 ${nb(`${den} ${RH[r1]} 0`)}이고, 양변을 ${more ? '양수' : '음수'} ${nb(den)}${tail(k, '으로/로')} 나누면 ${more ? '부등호의 방향은 그대로이고' : '부등호의 방향이 바뀌어'} ${solH('x', rel, w)}이다.`,
          facts: { calc: [[`${w < 0 ? '-' : ''}${Math.abs(w * k)}/${k}`, 1]] }
        });
      }),
      H('hard-per-sheet', '한 장당 값이 얼마 이하가 되는 최소 장수', '심38', (d) => {
        // 한 장당 값은 전체 값을 장수로 나눈 것이다 → 전체 값 ≤ (한 장당 값) × (장수)로 세운다 → 넘는 장수는 (x − n) → 장수는 자연수이므로 올린다.
        const m = d.until(() => { const n = d.pick([5, 10, 20, 30]), unit = 100 * d.int(6, 12), per = 100 * d.int(2, 5), goal = per + 10 * d.int(8, 30); return { n, base: n * unit, unit, per, goal, edge: (n * unit - per * n) / (goal - per) }; }, (v) => v.goal < v.unit && v.edge > v.n + 2 && v.edge <= 60 && !Number.isInteger(v.edge));
        const { n, base, per, goal } = m, ans = Math.floor(m.edge) + 1, L = [tm(base, ''), tg(per, ts([1, 'x'], [-n, '']))], R = ts([goal, 'x']);
        return N(`어느 인쇄소에서 초대장을 인쇄하는 값은 ${n}장까지는 ${base}원이고, ${n}장을 넘으면 한 장에 ${per}원씩 더 내야 한다. 초대장 한 장당 값이 ${goal}원 이하가 되게 하려면 최소 몇 장을 인쇄해야 하는가?`, ans, {
          unit: '장', explain: `${n}장까지는 한 장당 값이 ${m.unit}원 이상이므로 ${n}장보다 많이 인쇄해야 한다. ${x}장을 인쇄한다고 하면 전체 값은 ${nb(`{${base} + ${per}(${x} − ${n})}`)}원이고, 한 장당 값이 ${goal}원 이하이려면 전체 값이 ${nb(termH(goal, 'x'))}원 이하이어야 한다. ${told(L, '<=', R)} ${nb(`${ans - 1} ${RH['<']} ${tx(Q(base - per * n, goal - per))} ${RH['<']} ${ans}`)}이므로 최소 ${ans}장을 인쇄해야 한다.`,
          facts: { range: { ineq: `${base}+${per}*(x-${n})<${goal}*x+1`, lo: n + 1, hi: ans + 8, want: 'min' } }
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
