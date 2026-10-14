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
//
// 2026-10-13 다시 실은 꼴(묶음의 끝, hard-vote 부터): 처음 지을 때 「꼬임·경우 따지기」「지나치게 복잡한 활용」이라는 까닭으로 뺀 꼴을 다시 보아 실었다.
//  - ① 뜻: 당선이 「확정」된다는 것(남은 표가 모두 상대에게 가도 이긴다).
//  - ② 세 단계 넘게: 정수의 조건 넷을 잇기, 방정식을 문자째 풀어 해의 조건을 대소 관계로 옮기기, x 의 계수가 두 문자의 식인 부등식, 자연수인 해가 없을 조건,
//    직사각형에서 세 삼각형을 뺀 넓이, 단위를 고쳐야 하는 속력, 도중에 바뀌는 속력, 농도, 정가와 이익(미지수가 원가·정가·이익률·개수), 일의 양.
//  - 그대로 뺀 것: 상위 학년의 내용(연립부등식, 절댓값, 변끼리 더하기, 제곱끼리·역수끼리의 대소, 0 × x > 1), 이미 실린 유형과 같은 일(가장 큰 정수가 주어질 때 a 의 범위 ①40 등),
//    이 단원의 일이 아닌 것(큰 수·작은 수를 고르는 약속 연산 심56 — 부등식을 세우지도 풀지도 않고 중1의 대소 관계만 쓴다).
//  - 수집본에 실린 문제와 같은 수의 짝이 뽑히면 다시 뽑는다.
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

  // ── 다시 실은 꼴(2026-10-13)에 쓰는 도구 ──
  // 처음 지을 때 「지나치게 복잡한 활용」「꼬임·경우 따지기」라는 까닭으로 뺀 꼴 가운데, 앞 단원과 이 단원의 내용만으로 풀리는 것을 실력 묶음 끝에 덧붙였다.
  // (농도·정가와 이익·일의 양·도중에 바뀌는 속력은 중1 「일차방정식」의 활용에서 다룬 상황이다.)
  const { josa, nick } = B.kit;
  const { GE, dc, dc2, lcm, qsub, qmul, lastOf, SG } = B.kit.mid;
  const { cmpOk, keep, xu, jsS, denL, lean } = B.kit.m813;
  const { Board, TINT, sv } = B.kit.mgeo;
  // 백분율을 소수로 적은 수: 20 % → 0.2, 25 % → 0.25, 104 % → 1.04
  const pct = (k) => (k % 10 === 0 ? dc(k / 10) : dc2(k));
  // 분수인 경계가 놓인 두 자연수 사이: 4 < 14/3 < 5
  const between = (v) => { const lo = Math.floor(v.p / v.q); return nb(`${lo} ${RH['<']} ${tx(v)} ${RH['<']} ${lo + 1}`); };
  // 시간을 적은 글과 그것을 분으로 셈하는 식: 80 → 「1시간 20분」, (1*60+20)
  const span = (min) => { const h = Math.floor(min / 60), m = min % 60; return { text: (h ? `${h}시간` : '') + (h && m ? ' ' : '') + (m ? `${m}분` : ''), js: h && m ? `(${h}*60+${m})` : h ? `(${h}*60)` : `${m}` }; };
  // 시각을 적은 글과 자정부터 센 분을 셈하는 식: 505 → 「8시 25분」, (8*60+25)
  const clock = (t) => { const h = Math.floor(t / 60), m = t % 60; return { text: `${h}시${m ? ` ${m}분` : ''}`, js: m ? `(${h}*60+${m})` : `(${h}*60)` }; };
  // 두 문자 a, b 의 일차식 pa + qb(양수인 항을 앞에 적는다)
  const AB = (p, q) => sideH(p < 0 && q > 0 ? ts([q, 'b'], [p, 'a']) : ts([p, 'a'], [q, 'b']), true);
  // 직사각형 ABCD(가로 w, 세로 h)와 변 CD 의 중점 M, 변 BC 위의 점 P, 색칠한 삼각형 APM. 점 P 는 답과 관계없이 늘 같은 자리에 찍는다(그림이 답을 흘리지 않게).
  function rectFig(w, h) {
    const k = Math.min(190 / w, 112 / h), W = w * k, Hh = h * k, pA = [0, 0], pB = [0, Hh], pC = [W, Hh], pD = [W, 0], pM = [W, Hh / 2], pP = [W * 0.6, Hh], inside = [W / 2, Hh / 2];
    const b = Board().poly([pA, pP, pM], TINT).poly([pA, pB, pC, pD]).seg(pA, pP).seg(pP, pM).seg(pM, pA).tick(pC, pM).tick(pM, pD).dot(pP, 2.2);
    b.name(pA, 'A', 135).name(pB, 'B', 225).name(pC, 'C', 315).name(pD, 'D', 45).name(pM, 'M', 0).name(pP, 'P', 270);
    b.beside(pA, pD, `${w} cm`, inside).beside(pA, pB, `${h} cm`, inside).beside(pB, pP, `${sv('x')} cm`, inside);
    return b.svg(`직사각형 ABCD: 가로 ${w} cm, 세로 ${h} cm. 점 M은 변 CD의 중점이고 점 P는 변 BC 위에 있다. 선분 BP의 길이는 x cm이고, 삼각형 APM에 색을 칠했다.`);
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
      }),
      // ── 2026-10-13 다시 실은 꼴 ── ① 뜻을 정확히 대야 풀리는 문제
      H('hard-vote', '남은 표로 당선이 확정되는 득표 수', '기본 ①47', (d) => {
        // 함정: 「당선이 확정된다」는 남은 표가 모두 상대에게 가도 이긴다는 뜻이다. 내가 x표를 더 얻으면 상대가 더 얻을 수 있는 표는 (남은 표 − x)표이다.
        //  남은 표를 상대가 모두 얻는다고 놓는 아이(8 + x > 5 + 21), 지금의 표 차만 따지는 아이가 걸린다.
        const m = d.until(() => { const all = d.int(26, 38), a = d.int(4, 11), b = d.int(3, 11); return { all, a, b, rest: all - a - b, need: Math.floor(all / 2) + 1 - a }; }, (v) => v.a !== v.b && v.rest >= 12 && v.need >= 4 && v.need <= v.rest - 3 && !(v.all === 34 && v.a === 8));
        const { all, a, b, rest, need } = m, [p, q] = d.shuffle(NAMES).slice(0, 2), L = ts([a, ''], [1, 'x']), R = [tm(b, ''), tg(1, ts([rest, ''], [-1, 'x']))], s = solve(L, '>', R, 'x');
        return N(`학생이 ${all}명인 학급에서 회장을 뽑는데 ${p}, ${q} 두 사람이 후보로 나왔다. 모든 학생이 두 후보 가운데 한 사람에게 투표하였고, 지금까지 확인한 표는 ${name(p, '이/가')} ${a}표, ${name(q, '이/가')} ${b}표이다. 표를 더 많이 얻은 후보가 당선될 때, ${name(p, '은/는')} 남은 표 가운데 적어도 몇 표를 더 얻어야 당선이 확정되는가?`, need, {
          unit: '표',
          explain: `남은 표는 ${nb(`${all} − (${a} + ${b}) = ${rest}`)}(표)이다. ${name(p, '이/가')} ${x}표를 더 얻으면 ${name(q, '이/가')} 더 얻을 수 있는 표는 많아야 ${nb(`(${rest} − ${x})`)}표이다. 당선이 확정되려면 이 표를 ${name(q, '이/가')} 모두 얻어도 ${nick(p)}의 표가 더 많아야 한다. ${told(L, '>', R)} ${s.v.q === 1 ? `${s.v.p}표를 더 얻으면 두 사람의 표가 같아질 수 있으므로` : `${between(s.v)}이므로`} 적어도 ${need}표를 더 얻어야 한다.`,
          facts: { range: { ineq: `${a}+x>${b}+(${all}-${a}-${b}-x)`, lo: 1, hi: rest, want: 'min' } }
        });
      }),
      // ── 2026-10-13 다시 실은 꼴 ── ② 세 단계 넘게 이어 생각해야 풀리는 문제
      H('hard-int-chain', '이어진 조건에서 정수의 가장 큰 값 구하기', '심58', (d) => {
        // 정수에서 「n 보다 작다」의 가장 큰 값은 n − 1, 「n 이하」의 가장 큰 값은 n 이다. 양수를 곱해도 방향은 그대로이므로 뒤의 수가 가장 클 때 앞의 수도 가장 커진다. 이것을 네 번 잇는다.
        const ns = ['a', 'b', 'c', 'd'], ks = [d.int(2, 4), d.int(2, 5), d.int(2, 4)], top = d.int(5, 12);
        const rels = d.until(() => ns.map(() => d.pick(['<', '<='])), (list) => { const k = list.filter(strict).length; return k === 2 || k === 3; });
        const vals = [0, 0, 0, strict(rels[3]) ? top - 1 : top], lims = [0, 0, 0, top]; let expr = strict(rels[3]) ? `(${top}-1)` : `${top}`;
        for (let i = 2; i >= 0; i -= 1) { lims[i] = ks[i] * vals[i + 1]; vals[i] = strict(rels[i]) ? lims[i] - 1 : lims[i]; expr = `(${ks[i]}*${expr}${strict(rels[i]) ? '-1' : ''})`; }
        const cond = (i) => nb(i === 3 ? `${V('d')} ${RH[rels[3]]} ${top}` : `${V(ns[i])} ${RH[rels[i]]} ${ks[i]}${V(ns[i + 1])}`);
        const step = (i) => `${nb(`${V(ns[i + 1])} = ${vals[i + 1]}`)}일 때 ${nb(`${V(ns[i])} ${RH[rels[i]]} ${lims[i]}`)}이므로 ${V(ns[i])}의 가장 큰 값은 ${vals[i]}이다.`;
        return N(`네 정수 ${va}, ${vb}, ${vc}, ${V('d')}가 ${[0, 1, 2, 3].map(cond).join(', ')}${tail(top, '을/를')} 모두 만족시킬 때, ${va}의 값 가운데 가장 큰 수는?`, vals[0], {
          signed: true,
          explain: `부등식의 양변에 양수를 곱해도 부등호의 방향은 바뀌지 않으므로, 뒤의 수가 클수록 앞의 수도 큰 값을 가질 수 있다. ${V('d')}는 ${top}${strict(rels[3]) ? '보다 작은' : ' 이하인'} 정수이므로 가장 큰 값은 ${vals[3]}이다. ${[2, 1, 0].map(step).join(' ')} 등호가 없는 조건에서는 끝 수가 들지 않는다.`,
          facts: { calc: [[expr, 0]], unseen: [1] }
        });
      }, { standard: STD1 }),
      H('hard-root-sign', '방정식의 해의 조건으로 두 상수의 대소 관계 알아내기', '심13', (d) => {
        // 방정식을 문자째 풀어 해를 두 상수의 차로 나타낸다 → 해의 조건을 부등식으로 옮긴다 → 곱해진 수가 양수임을 대고 나누어 대소 관계를 얻는다.
        // 보기: 바른 것 / 이항한 뒤 x 의 계수의 부호를 따지지 않아 방향을 거꾸로 댄 아이 / 「0 이상」과 「양수」를 가리지 않아 등호를 붙이거나 뗀 아이 / 둘 다 틀린 아이
        const FR = [Q(1, 2), Q(1, 3), Q(2, 3), Q(1, 4), Q(3, 4), Q(2, 5), Q(3, 5), Q(1, 6), Q(5, 6)];
        const [p, q] = d.until(() => [d.pick(FR), d.pick(FR)], ([u, w]) => u.q !== w.q && !(u.p === 3 && w.p === 3 && u.q + w.q === 9)), cond = anyRel(d), n = lcm(p.q, q.q), P = p.p * n / p.q, Qc = q.p * n / q.q, D = P - Qc;
        const word = { '>': '양수', '<': '음수', '>=': '0 이상', '<=': '0 이하' }[cond], right = D < 0 ? cond : FLIP[cond], rows = d.shuffle(['<', '<=', '>', '>=']);
        // 참·거짓은 따로 셈한다: a, b 에 수를 넣었을 때 해 (b − a) ÷ (p − q)가 조건에 맞는 때와 보기가 성립하는 때가 늘 같은가
        const PAIRS = [[-3, 2], [2, -3], [1, 1], [0, 4], [4, 0], [-2, -2], [5, 1], [1, 5]], truth = rows.map((r) => PAIRS.every(([a, b]) => cmpOk((b - a) * D, cond) === cmpOk(a - b, r)));
        const k = Q(n, Math.abs(D)), kH = k.q === 1 ? String(k.p) : tx(k), diff = D < 0 ? `${va} − ${vb}` : `${vb} − ${va}`, root = nb(`${x} = ${kH}(${diff})`);
        const L = ts([p, 'x'], [1, 'a']), R = ts([q, 'x'], [1, 'b']);
        return C(`${x}에 대한 일차방정식 ${iqB(L, '=', R)}의 해가 ${word}일 때, 두 상수 ${va}, ${vb}의 대소 관계로 옳은 것은?`, rows.map((r) => nb(`${va} ${RH[r]} ${vb}`)), rows.indexOf(right), {
          explain: `양변에 ${n}${tail(n, '을/를')} 곱하면 ${iqB(ts([P, 'x'], [n, 'a']), '=', ts([Qc, 'x'], [n, 'b']))}이다. ${x}를 포함한 항은 좌변으로, 나머지 항은 우변으로 이항하여 정리하면 ${D === 1 ? root : nb(`${termH(D, 'x')} = ${n}(${vb} − ${va})`)}이다.${D === 1 ? '' : ` 양변을 ${iq(D)}${tail(Math.abs(D), '으로/로')} 나누면 ${root}이다.`} 해가 ${word}이므로 ${nb(`${kH}(${diff}) ${RH[cond]} 0`)}이고, 양변을 양수 ${tx(k)}${tail(lastOf(k), '으로/로')} 나누면 ${nb(`${diff} ${RH[cond]} 0`)}이다. 따라서 ${nb(`${D < 0 ? va : vb} ${RH[cond]} ${D < 0 ? vb : va}`)}${D > 0 ? `, 곧 ${nb(`${va} ${RH[right]} ${vb}`)}` : ''}이다.`,
          facts: { truth, want: true }
        });
      }, { standard: STD1 }),
      H('hard-two-letters', 'x의 계수가 두 문자의 식인 부등식의 해로 다른 부등식 풀기', '심33', (d) => {
        // 해의 부등호의 방향으로 x 의 계수 (pa + qb)의 부호를 정한다 → 경계의 값에서 a = kb 를 얻는다 → 이것을 계수에 넣어 b 의 부호를 안다 → 둘째 부등식에 넣어 b 가 곱해진 계수로 나눈다.
        const m = d.until(() => {
          const k = d.pick([2, 3, 4, -2, -3]), p = nz(d, -3, 3), q = nz(d, -4, 4), v = nz(d, -4, 4), ra = nz(d, -6, 6), sa = v * q - k * (ra - v * p), mm = nz(d, -3, 3), n = nz(d, -5, 5), t = nz(d, -4, 4), u = nz(d, -9, 9);
          return { k, p, q, v, ra, sa, mm, n, t, u, c1: p * k + q, c2: mm * k + n, e2: t * k + u };
        }, (r) => r.c1 !== 0 && r.ra !== r.v * r.p && r.sa !== 0 && Math.abs(r.sa) <= 9 && r.c2 !== 0 && r.e2 !== 0 && r.e2 % r.c2 === 0 && Math.abs(r.e2 / r.c2) <= 9 && r.p * r.n !== r.q * r.mm && Math.abs(r.c1) <= 12 && Math.abs(r.c2) <= 9 && !(r.p === 2 && r.q === 3 && r.ra === 3));
        const { k, p, q, v, ra, sa, mm, n, t, u, c1, c2, e2 } = m, sb = pm(d), r1 = anyRel(d), r2 = anyRel(d), g1 = c1 * sb > 0 ? r1 : FLIP[r1], w = -e2 / c2, g2 = c2 * sb > 0 ? r2 : FLIP[r2];
        const more = (cs) => cs.map(([c, nm]) => ` ${c < 0 ? MINUS : '+'} ${Math.abs(c) === 1 ? '' : Math.abs(c)}${V(nm)}`).join('');   // 뒤에 이어 적는 항들
        const one = `(${AB(p, q)})${x}${more([[-ra, 'a'], [-sa, 'b']])} ${RH[r1]} 0`, two = `(${AB(mm, n)})${x}${more([[t, 'a'], [u, 'b']])} ${RH[r2]} 0`;
        const kb = termH(k, 'b'), signOf = (pos) => (pos ? GT : LT), J = (c) => js(Q(c)), K = `((${J(v)}*${J(q)}-${J(sa)})/(${J(ra)}-${J(v)}*${J(p)}))`;
        const cb = (c) => `${Math.abs(c) === 1 ? (c < 0 ? MINUS : '') : iq(c)}${vb}`;   // c × b
        return ineqAns(`${x}에 대한 일차부등식 ${keep(one)}의 해가 ${solH('x', g1, v)}일 때, ${x}에 대한 일차부등식 ${keep(two)}의 해를 구하시오. (단, ${va}, ${vb}는 상수)`, g2, w, x, {
          explain: `${keep(one)}에서 ${keep(`(${AB(p, q)})${x} ${RH[r1]} ${AB(ra, sa)}`)}이다. 해의 부등호가 ${RH[g1]}로 ${g1 === r1 ? '방향이 그대로이므로' : '방향이 바뀌었으므로'} ${nb(`${AB(p, q)} ${signOf(g1 === r1)} 0`)}이고, 양변을 ${nb(AB(p, q))}로 나누면 ${nb(`${x} ${RH[g1]} ${frac(AB(ra, sa), AB(p, q))}`)}이다. ${nb(`${frac(AB(ra, sa), AB(p, q))} = ${iq(v)}`)}에서 ${nb(`${AB(ra, sa)} = ${AB(v * p, v * q)}`)}이므로 ${nb(`${va} = ${kb}`)}이다. 이것을 ${nb(`${AB(p, q)} ${signOf(g1 === r1)} 0`)}에 대입하면 ${nb(`${cb(c1)} ${signOf(g1 === r1)} 0`)}이므로 ${nb(`${vb} ${signOf(sb > 0)} 0`)}이다. ${keep(two)}에 ${nb(`${va} = ${kb}`)}를 대입하여 정리하면 ${nb(`${cb(c2)}${x} ${RH[r2]} ${cb(-e2)}`)}이다. ${nb(`${vb} ${signOf(sb > 0)} 0`)}이므로 ${x}의 계수 ${nb(cb(c2))}는 ${c2 * sb > 0 ? '양수' : '음수'}이고, 양변을 ${nb(cb(c2))}로 나누면 ${c2 * sb > 0 ? '부등호의 방향은 그대로이고' : '부등호의 방향이 바뀌어'} ${solH('x', g2, w)}이다.`,
          facts: { calc: [[`-(${J(t)}*${K}+${J(u)})/(${J(mm)}*${K}+${J(n)})`, 1]], unseen: [1] }
        });
      }),
      H('hard-no-natural', '자연수인 해가 없게 하는 상수', '기본 ①41 ②45', (d) => {
        // 해가 x < (a 의 식)이면 그 값이 1 이하일 때, x ≤ (a 의 식)이면 1 미만일 때 자연수인 해가 없다(등호가 있고 없음이 반대로 옮겨 간다). 이 조건을 a 에 대하여 다시 풀어 정수를 고른다.
        const u = () => d.int(1, 9), two = (ka, kc) => (ka < 0 && kc > 0 ? ts([kc, ''], [ka, 'a']) : ts([ka, 'a'], [kc, '']));
        // (좌변 − 우변) = P x + A a + C 의 계수(정수가 되게 분모를 없앤 것)
        const parts = (L, R) => { const at = (xv, av) => qsub(evS(L, { x: Q(xv), a: Q(av) }), evS(R, { x: Q(xv), a: Q(av) })), c = at(0, 0), pq = qsub(at(1, 0), c), aq = qsub(at(0, 1), c), n = lcm(lcm(pq.q, aq.q), c.q), k = (v) => qmul(v, Q(n)).p; return { P: k(pq), A: k(aq), C: k(c), n }; };
        // 괄호가 있는 꼴과 분자가 일차식인 분수가 있는 꼴. 저마다 a 의 부호를 달리한 것이 있어 「가장 작은 정수」와 「가장 큰 정수」가 고루 나온다.
        const sg = pm(d), make = () => d.pick([
          () => { const pp = d.pick([2, 4, 5]), qq = d.int(1, pp - 1); return [[tg(-pp, ts([1, 'x'], [-u(), '']))], [tm(sg, 'a'), tg(-qq, ts([1, 'x'], [u(), '']))]]; },
          () => { const den = d.pick([3, 4]); return [[tm(u(), ''), tf(ts([1, 'x'], [sg, 'a']), den, -1)], [tf(ts([d.int(1, 3), 'x'], [-u(), '']), den, 1)]]; }
        ])();
        const m = d.until(() => { const [L, R] = make(), r = anyRel(d), k = parts(L, R), neg = k.P < 0; return { L, R, r, k, rel: neg ? FLIP[r] : r, den: Math.abs(k.P), A1: neg ? k.A : -k.A, C1: neg ? k.C : -k.C }; },
          (t) => { if (up(t.rel) || t.A1 === 0 || !lean(t.L) || !lean(t.R)) return false; const c = Q(t.den - t.C1, t.A1); return t.den <= 12 && Math.abs(t.C1) <= 40 && c.q <= 4 && Math.abs(c.p / c.q) <= 12; });
        const { L, R, r, k, rel, den, A1, C1 } = m, whole = A1 % den === 0 && C1 % den === 0, quotL = whole ? two(A1 / den, C1 / den) : [tf(two(A1, C1), den, 1)], quot = sideH(quotL, true), R1 = strict(rel) ? '<=' : '<';
        const sA = solve(quotL, R1, ts([1, '']), 'a'), least = up(sA.rel), fl = Math.floor(sA.v.p / sA.v.q), ans = sA.v.q === 1 ? (strict(sA.rel) ? sA.v.p + (least ? 1 : -1) : sA.v.p) : (least ? fl + 1 : fl);
        const S = lcm(denL(L), denL(R)), extra = new Set(), env = { x: '1', a: '(x)' }, l = jsS(L, S, env, extra), rr = jsS(R, S, env, extra), nr = NOT[r];
        return N(`다음 ${x}에 대한 일차부등식을 만족시키는 자연수 ${x}가 없을 때, 상수 ${va}의 값이 될 수 있는 가장 ${least ? '작은' : '큰'} 정수는?`, ans, {
          signed: true, figure: iqF(L, r, R),
          explain: `${k.n > 1 ? `양변에 ${k.n}${tail(k.n, '을/를')} 곱하고 ` : '괄호를 풀고 '}${x}를 포함한 항은 좌변으로, 나머지 항은 우변으로 이항하여 정리하면 ${iqB(ts([k.P, 'x']), r, two(-k.A, -k.C))}이다.${k.P === 1 ? '' : ` 양변을 ${k.P < 0 ? '음수 ' : ''}${iq(k.P)}${tail(Math.abs(k.P), '으로/로')} 나누면 ${k.P < 0 ? '부등호의 방향이 바뀌어 ' : ''}${nb(`${x} ${RH[rel]} ${quot}`)}이다.`} ${strict(rel) ? `${nb(`${quot} = 1`)}이면 해는 ${nb(`${x} ${LT} 1`)}이므로 자연수인 해가 없다.` : `${nb(`${quot} = 1`)}이면 1이 해가 된다.`} 따라서 자연수인 해가 없으려면 ${nb(`${quot} ${RH[R1]} 1`)}이어야 한다. ${sA.text} ${sA.v.q === 1 ? (strict(sA.rel) ? `${iq(sA.v.p)}${tail(Math.abs(sA.v.p), '은/는')} 들지 않으므로` : `${iq(sA.v.p)}도 들므로`) : `${nb(`${iq(fl)} ${LT} ${tx(sA.v)} ${LT} ${iq(fl + 1)}`)}이므로`} 가장 ${least ? '작은' : '큰'} 정수는 ${iq(ans)}이다.`,
          facts: { range: { ineq: nr === '<' ? `${l}<${rr}` : nr === '>' ? `${l}>${rr}` : nr === '<=' ? `${l}<${rr}+1` : `${l}>${rr}-1`, lo: ans - 6, hi: ans + 6, want: least ? 'min' : 'max' } }
        });
      }),
      H('hard-rect-triangle', '직사각형 안에 그린 삼각형의 넓이의 조건에 맞는 길이', '기본 ①56 / 심36', (d) => {
        // 삼각형의 넓이를 바로 구할 수 없으므로 직사각형의 넓이에서 세 직각삼각형의 넓이를 뺀다 → x 의 식 → 부등식 → x 의 계수가 음수여서 방향이 바뀐다.
        const m = d.until(() => { const h = d.pick([8, 12, 16]), w = 2 * d.int(6, 12), v = d.int(3, w - 3); return { h, w, v, S: h * (2 * w - v) / 4 }; }, (t) => t.w > t.h && !(t.w === 20 && t.h === 12 && t.v === 15));
        const { h, w, v, S } = m, atMost = d.bool(), r = atMost ? '<=' : '>=', half = h / 2, L = ts([w * h / 2, ''], [-h / 4, 'x']), R = ts([S, '']);
        return N(`그림과 같이 가로의 길이가 ${w} cm, 세로의 길이가 ${h} cm인 직사각형 ABCD에서 변 CD의 중점을 M이라 하고, 변 BC 위에 점 P를 잡았다. 삼각형 APM의 넓이가 ${S} cm² ${atMost ? '이하가' : '이상이'} 되게 하려면 ${SG('BP')}의 길이는 몇 cm ${atMost ? '이상' : '이하'}이어야 하는가?`, v, {
          unit: 'cm', figure: rectFig(w, h),
          explain: `${SG('BP')}의 길이를 ${xu('cm')}라 하면 ${SG('PC')}의 길이는 ${nb(`(${w} − ${x}) cm`)}이고, ${SG('CM')}과 ${SG('MD')}의 길이는 모두 ${half} cm이다. 세 삼각형 ABP, PCM, AMD의 넓이는 차례로 ${nb(`${frac(1, 2)} × ${x} × ${h} = ${termH(half, 'x')}`)}, ${nb(`${frac(1, 2)} × (${w} − ${x}) × ${half} = ${sideH(ts([w * h / 4, ''], [-h / 4, 'x']), true)}`)}, ${nb(`${frac(1, 2)} × ${w} × ${half} = ${w * h / 4}`)}이다. 삼각형 APM의 넓이는 직사각형 ABCD의 넓이 ${nb(`${w} × ${h} = ${w * h}`)}에서 이 셋을 뺀 것이므로 ${nb(`(${sideH(L, true)}) cm²`)}이다. ${told(L, r, R)} 따라서 ${SG('BP')}의 길이는 ${v} cm ${atMost ? '이상' : '이하'}이어야 한다.`,
          facts: { calc: [[`2*${w}-4*${S}/${h}`, 0]], unseen: [2, 4] }
        });
      }),
      H('hard-speed-units', '단위를 맞추어 세우는 거리·속력·시간의 부등식', '심45 / 기본 ①53 ②58', (d, n) => {
        // 첫째는 속력이 분속(m)인데 시간은 「몇 시간 몇 분」으로 주고 답은 km 로 묻는다. 둘째는 속력이 시속(km)인데 시간은 분으로 주고 답은 m 로 묻는다.
        // 단위를 속력에 맞추어 식을 세우고, 구한 값의 단위를 다시 바꾼다.
        if (n === 0) {
          const [go, back, min] = d.pick([[60, 100, 160], [100, 60, 160], [50, 75, 100], [75, 50, 100], [40, 60, 125], [60, 40, 125], [50, 100, 90], [100, 50, 90], [50, 100, 150], [45, 90, 100], [90, 45, 100], [60, 75, 90], [75, 60, 90], [60, 75, 150], [75, 60, 150]]);
          const far = min * go * back / (go + back), t = span(min), L = ts([Q(1, go), 'x'], [Q(1, back), 'x']), R = ts([min, '']);
          return N(`집에서 도서관까지 같은 길을 갈 때는 분속 ${go} m로, 올 때는 분속 ${back} m로 걸어서 ${t.text} 이내에 다녀오려고 한다. 집에서 도서관까지의 거리는 몇 km 이내이어야 하는가?`, far / 1000, {
            unit: 'km', explain: `속력이 분속으로 주어졌으므로 시간은 분, 거리는 m로 나타낸다. ${t.text}은 ${min}분이다. 집에서 도서관까지의 거리를 ${xu('m')}라 하면 갈 때 걸리는 시간은 ${frac(x, go)}분, 올 때 걸리는 시간은 ${frac(x, back)}분이다. ${told(L, '<=', R)} ${far} m는 ${far / 1000} km이므로 거리는 ${far / 1000} km 이내이어야 한다.`,
            facts: { calc: [[`${t.js}*${go}*${back}/(${go}+${back})/1000`, 0]], unseen: [60, 1000], rule: 'speed-units-0' }
          });
        }
        const [min, stay, speed] = d.pick([[40, 10, 3], [45, 15, 3], [50, 10, 3], [40, 10, 4], [45, 15, 4], [50, 20, 4], [30, 15, 4], [50, 20, 3], [40, 20, 3], [60, 30, 4], [60, 30, 3], [45, 30, 4]]);
        const far = (min - stay) * speed * 1000 / 120, t = span(min), km = Q(far, 1000), L = [tm(Q(1, speed), 'x'), tm(Q(stay, 60), ''), tm(Q(1, speed), 'x')], R = ts([Q(min, 60), '']);
        return N(`영화가 시작하기까지 ${t.text}이 남아서 그동안 영화관에서 편의점까지 걸어서 다녀오려고 한다. 편의점에서 물건을 사는 데 ${stay}분이 걸리고 시속 ${speed} km로 걷는다면, 영화관에서 몇 m 이내에 있는 편의점까지 다녀올 수 있는가?`, far, {
          unit: 'm', explain: `속력이 시속으로 주어졌으므로 시간은 시간, 거리는 km로 나타낸다. ${min === 60 ? '' : `${t.text}은 ${tx(Q(min, 60))}시간이고, `}${stay}분은 ${tx(Q(stay, 60))}시간이다. 영화관에서 편의점까지의 거리를 ${xu('km')}라 하면 가는 데 ${frac(x, speed)}시간, 물건을 사는 데 ${tx(Q(stay, 60))}시간, 돌아오는 데 ${frac(x, speed)}시간이 걸린다. ${told(L, '<=', R)} ${tx(km)} km는 ${far} m이므로 ${far} m 이내에 있는 편의점까지 다녀올 수 있다.`,
          facts: { calc: [[`(${t.js}-${stay})*${speed}*1000/60/2`, 0]], unseen: [60, 1000, 2], rule: 'speed-units-1' }
        });
      }, { count: 2 }),
      H('hard-speed-switch', '도중에 속력을 바꾸어 정해진 시각까지 가기', '심46', (d) => {
        // 두 시각 사이의 시간을 분으로, km 를 m 로 고친다 → 걸은 거리를 x 라 하면 달린 거리는 (전체 − x) → 걸은 시간과 달린 시간의 합이 남은 시간 이하.
        const m = d.until(() => { const u = d.pick([50, 60, 75, 80]), w = d.pick([150, 160, 180, 200, 240]), D = d.pick([1, 1.5, 2, 2.5, 3]), T = 5 * d.int(3, 8); return { u, w, D, T, far: (T * w - D * 1000) * u / (w - u) }; }, (t) => Number.isInteger(t.far) && t.far % 100 === 0 && t.far >= 300 && t.far <= t.D * 1000 - 300 && !(t.u === 50 && t.w === 200 && t.D === 2));
        const { u, w, D, T, far } = m, all = D * 1000, end = d.pick([500, 510, 520, 530, 540]), from = clock(end - T), to = clock(end), who = d.pick(NAMES);
        const L = [tm(Q(1, u), 'x'), tf(ts([all, ''], [-1, 'x']), w, 1)], R = ts([T, '']);
        return N(`${name(who, '은/는')} 오전 ${from.text}에 집에서 나와 분속 ${u} m로 걷다가 도중에 분속 ${w} m로 달려서 오전 ${to.text}까지 학교에 도착하였다. 집에서 학교까지의 거리가 ${D} km일 때, 분속 ${u} m로 걸은 거리는 최대 몇 m인가?`, far, {
          unit: 'm', explain: `오전 ${from.text}부터 오전 ${to.text}까지는 ${T}분이고, ${D} km는 ${all} m이다. 분속 ${u} m로 걸은 거리를 ${xu('m')}라 하면 분속 ${w} m로 달린 거리는 ${nb(`(${all} − ${x}) m`)}이다. 걸은 시간은 ${frac(x, u)}분, 달린 시간은 ${frac(`${all} − ${x}`, w)}분이고, 두 시간의 합이 ${T}분 이하이어야 한다. ${told(L, '<=', R)} 따라서 걸은 거리는 최대 ${far} m이다.`,
          facts: { calc: [[`((${to.js}-${from.js})*${w}-${D}*1000)*${u}/(${w}-${u})`, 0]], unseen: [60, 1000] }
        });
      }),
      H('hard-salt-mix', '농도가 다른 소금물을 넣어 농도 맞추기', '기본 ①57', (d) => {
        // 처음 소금물에 든 소금의 양을 센다 → 넣은 뒤의 소금의 양과 소금물의 양을 x 의 식으로 적는다 → 소금의 양이 소금물의 양의 몇 % 이상(이하)인가로 부등식을 세운다.
        const m = d.until(() => { const rise = d.bool(), p = d.int(2, 14), q = d.int(2, 16), t = d.int(3, 15), W = 100 * d.int(1, 5); return { rise, p, q, t, W, v: Math.abs(t - p) * W / Math.abs(q - t) }; },
          (t) => (t.rise ? t.p < t.t && t.t < t.q : t.q < t.t && t.t < t.p) && Number.isInteger(t.v) && t.v % 50 === 0 && t.v <= 900 && t.v !== t.W && !(t.p === 6 && t.q === 10 && t.t === 9));
        const { rise, p, q, t, W, v } = m, salt = p * W / 100, rel = rise ? '>=' : '<=', word = rise ? '이상' : '이하', L = [tm(salt, ''), tm(pct(q), 'x')], R = [tg(pct(t), ts([W, ''], [1, 'x']))];
        return N(`${p} %의 소금물 ${W} g에 ${q} %의 소금물을 넣어 농도가 ${t} % ${word}인 소금물을 만들려고 한다. ${q} %의 소금물을 몇 g 이상 넣어야 하는가?`, v, {
          unit: 'g', explain: `${p} %의 소금물 ${W} g에 들어 있는 소금의 양은 ${nb(`${frac(p, 100)} × ${W} = ${salt}`)}(g)이다. ${q} %의 소금물을 ${xu('g')} 넣으면 소금의 양은 ${nb(`(${sideH(L, true)}) g`)}, 소금물의 양은 ${nb(`(${W} + ${x}) g`)}이 된다. 농도가 ${t} % ${word}이려면 소금의 양이 소금물의 양의 ${t} % ${word}이어야 한다. ${told(L, rel, R)} 따라서 ${q} %의 소금물을 ${v} g 이상 넣어야 한다.`,
          facts: { calc: [[rise ? `(${t}-${p})*${W}/(${q}-${t})` : `(${p}-${t})*${W}/(${t}-${q})`, 0]] }
        });
      }),
      H('hard-profit', '이익을 붙인 정가에서 할인하여 팔 때의 원가·정가·이익률·개수', '기본 ①58 ②59 / 심47·48', (d, n) => {
        // 차례마다 미지수로 놓는 것이 다르다: 원가 / 정가 / 이익률(원가는 문자로 놓았다가 나누어 없앤다) / 파는 개수(한 개의 이익을 먼저 셈한다).
        // (정가) = (원가) × (1 + 이익률), (판 값) = (정가) × (1 − 할인율), (이익) = (판 값) − (원가)를 차례로 이어 식을 세운다.
        const RATES = [[50, 20], [30, 20], [50, 10], [40, 20], [50, 30], [20, 10], [60, 25], [40, 10], [60, 20], [30, 10], [40, 25], [60, 30]];   // [이익률, 할인율] — 팔면 이익이 남는 짝
        const sold = (a, b) => (100 + a) * (100 - b) / 100;   // 판 값은 원가의 몇 %인가
        if (n === 0) {
          const m = d.until(() => { const [a, b] = d.pick(RATES), cost = 100 * d.int(10, 90); return { a, b, cost, gain: cost * (sold(a, b) - 100) / 100 }; }, (t) => Number.isInteger(t.gain) && t.gain % 10 === 0 && t.gain >= 100);
          const { a, b, cost, gain } = m, f = sold(a, b), L = ts([pct(f), 'x'], [-1, 'x']), R = ts([gain, '']);
          return N(`어떤 물건의 원가에 ${a} %의 이익을 붙여 정가를 정하였다. 이 물건을 정가에서 ${b} % 할인하여 팔았더니 한 개에 ${gain}원 이상의 이익이 남았다. 이 물건의 원가는 얼마 이상인가?`, cost, {
            unit: '원', explain: `원가를 ${x}원이라 하면 정가는 ${termH(pct(100 + a), 'x')}원이고, 판 값은 정가의 ${100 - b} %이므로 ${nb(`${termH(pct(100 + a), 'x')} × ${tx(pct(100 - b))} = ${termH(pct(f), 'x')}`)}(원)이다. 이익은 판 값에서 원가를 뺀 것이므로 ${told(L, '>=', R)} 따라서 원가는 ${cost}원 이상이다.`,
            facts: { calc: [[`${gain}*100*100/((100+${a})*(100-${b})-100*100)`, 0]], unseen: [100], rule: 'profit-0' }
          });
        }
        if (n === 1) {
          const m = d.until(() => { const b = d.pick([10, 20, 25, 30, 40]), g = d.pick([5, 8, 10, 12, 20, 26, 28, 30, 35, 40, 44, 50]), cost = 100 * d.int(10, 60); return { b, g, cost, price: cost * (100 + g) / (100 - b) }; }, (t) => Number.isInteger(t.price) && t.price % 100 === 0 && t.price <= 9900);
          const { b, g, cost, price } = m, want = cost * g / 100, L = ts([pct(100 - b), 'x'], [-cost, '']), R = ts([want, '']);
          return N(`원가가 ${cost}원인 물건을 정가에서 ${b} % 할인하여 팔아도 원가의 ${g} % 이상의 이익이 남게 하려고 한다. 정가를 얼마 이상으로 정해야 하는가?`, price, {
            unit: '원', explain: `정가를 ${x}원이라 하면 판 값은 정가의 ${100 - b} %이므로 ${termH(pct(100 - b), 'x')}원이고, 이익은 ${nb(`(${sideH(L, true)})`)}원이다. 원가의 ${g} %는 ${nb(`${cost} × ${frac(g, 100)} = ${want}`)}(원)이므로 ${told(L, '>=', R)} 따라서 정가를 ${price}원 이상으로 정해야 한다.`,
            facts: { calc: [[`${cost}*(100+${g})/(100-${b})`, 0]], unseen: [100], rule: 'profit-1' }
          });
        }
        if (n === 2) {
          const [b, g] = d.pick([[50, 0], [60, 0], [20, 20], [25, 5], [25, 20], [10, 8], [10, 35], [30, 5], [30, 12], [40, 20], [20, 12], [20, 4], [40, 8]]), rate = 100 * (g + b) / (100 - b), left = pct(100 - b), goal = pct(100 + g);
          const paid = `${tx(left)}${va}(1 + ${frac(x, 100)})`, floor = g ? termH(goal, 'a') : va;
          return N(`어떤 물건의 원가에 이익을 붙여 정가를 정하려고 한다. 정가에서 ${b} % 할인하여 팔아도 ${g ? `원가의 ${g} % 이상의 이익이 남게` : '손해를 보지 않게'} 하려면 원가에 몇 % 이상의 이익을 붙여 정가를 정해야 하는가?`, rate, {
            unit: '%', explain: `원가를 ${va}원이라 하고 원가에 ${nb(`${x} %`)}의 이익을 붙인다고 하자. 정가는 ${nb(`${va}(1 + ${frac(x, 100)})`)}원이고, 판 값은 정가의 ${100 - b} %이므로 ${nb(paid)}원이다. ${g ? `원가의 ${g} % 이상의 이익이 남으려면 판 값이 ${nb(floor)}원 이상이어야 하므로` : '손해를 보지 않으려면 판 값이 원가 이상이어야 하므로'} ${nb(`${paid} ${GE} ${floor}`)}이다. ${va}는 양수이므로 양변을 ${va}로 나누면 ${nb(`${tx(left)}(1 + ${frac(x, 100)}) ${GE} ${g ? tx(goal) : 1}`)}이고, 양변에 100을 곱하면 ${nb(`${tx(left)}(100 + ${x}) ${GE} ${100 + g}`)}이다. 다시 ${solve([tg(left, ts([100, ''], [1, 'x']))], '>=', ts([100 + g, '']), 'x').text} 따라서 원가에 ${rate} % 이상의 이익을 붙여야 한다.`,
            facts: { calc: [[g ? `100*(${g}+${b})/(100-${b})` : `100*${b}/(100-${b})`, 0]], unseen: [100], rule: 'profit-2' }
          });
        }
        const m = d.until(() => { const [a, b] = d.pick(RATES), cost = 1000 * d.int(2, 20), each1 = cost * (sold(a, b) - 100) / 100, goal = 1000 * d.int(5, 60); return { a, b, cost, each1, goal, list: cost * (100 + a) / 100, paid: cost * sold(a, b) / 100 }; },
          (t) => Number.isInteger(t.each1) && Number.isInteger(t.paid) && t.goal % t.each1 !== 0 && t.goal / t.each1 > 3 && t.goal / t.each1 < 30 && Q(t.goal, t.each1).q <= 12);
        const { a, b, cost, each1, goal, list, paid } = m, ans = Math.floor(goal / each1) + 1, L = ts([each1, 'x']), R = ts([goal, '']);
        return N(`원가가 ${cost}원인 물건에 원가의 ${a} %의 이익을 붙여 정가를 정하였다. 이 물건을 정가에서 ${b} % 할인하여 팔아 ${goal}원 이상의 이익을 얻으려면 적어도 몇 개를 팔아야 하는가?`, ans, {
          unit: '개', explain: `정가는 ${nb(`${cost} × ${tx(pct(100 + a))} = ${list}`)}(원)이고, 판 값은 정가의 ${100 - b} %이므로 ${nb(`${list} × ${tx(pct(100 - b))} = ${paid}`)}(원)이다. 한 개를 팔 때의 이익은 ${nb(`${paid} − ${cost} = ${each1}`)}(원)이다. ${x}개를 판다고 하자. ${told(L, '>=', R)} ${between(Q(goal, each1))}이므로 적어도 ${ans}개를 팔아야 한다.`,
          facts: { range: { ineq: `(${cost}*(100+${a})*(100-${b})/10000-${cost})*x>${goal}-1`, lo: 1, hi: ans + 6, want: 'min' }, rule: 'profit-3' }
        });
      }, { count: 4 }),
      H('hard-work-crew', '일을 하루에 끝내는 데 필요한 사람 수', '심49', (d) => {
        // 전체 일의 양을 1로 놓는다 → 한 명이 하루에 하는 일의 양은 걸리는 날수의 역수 → 두 무리가 하루에 하는 일의 양의 합이 1 이상 → 사람 수는 자연수이므로 올린다.
        const [p, q, n] = d.pick([[6, 10, 8], [6, 12, 8], [8, 12, 10], [6, 10, 7], [8, 12, 9], [5, 10, 7], [6, 15, 8], [10, 15, 12], [10, 12, 11], [9, 12, 10], [6, 8, 7], [4, 12, 6], [5, 15, 8], [10, 15, 13], [9, 15, 12]]);
        const fast = d.pick(['어른', '선생님']), slow = '학생', ans = Math.ceil(p * (q - n) / (q - p)), L = [tm(Q(1, p), 'x'), tf(ts([n, ''], [-1, 'x']), q, 1)], R = ts([1, '']), s = solve(L, '>=', R, 'x');
        return N(`어떤 일을 혼자서 끝내는 데 ${fast} 한 명은 ${p}일, ${slow} 한 명은 ${q}일이 걸린다. ${josa(fast, '과/와')} ${slow}을 합하여 ${n}명이 이 일을 하루에 끝내려고 할 때, ${josa(fast, '은/는')} 적어도 몇 명이 있어야 하는가?`, ans, {
          unit: '명', explain: `전체 일의 양을 1이라 하면 하루에 하는 일의 양은 ${fast} 한 명이 ${frac(1, p)}, ${slow} 한 명이 ${frac(1, q)}이다. ${josa(fast, '을/를')} ${x}명이라 하면 ${slow}은 ${nb(`(${n} − ${x})`)}명이다. 일을 하루에 끝내려면 ${n}명이 하루에 하는 일의 양이 1 이상이어야 한다. ${told(L, '>=', R)} ${s.v.q === 1 ? '따라서' : `${between(s.v)}이므로`} ${josa(fast, '은/는')} 적어도 ${ans}명이 있어야 한다.`,
          facts: { range: { ineq: `${q}*x+${p}*(${n}-x)>${p}*${q}-1`, lo: 1, hi: n, want: 'min' } }
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
