// 미적분Ⅱ Ⅱ-1 여러 가지 함수의 미분 — 실력 문제.
// 단원 틀·싣는 기준·뺀 것과 까닭은 11-5-3a.js 머리에 적었다. 도구는 B.kit.u53x(a 파일)와 B.kit.u53b(b 파일)를 쓴다.
// ref: ①n = 기본꼴_1의 n번(이 단원은 심화 문서가 없어 대단원 평가·학기 시험·중단원 평가의 끝 문제와 교과서 발전 문제에서 골랐다).
//
// 이 단원에서 아이들이 흔히 잘못 아는 것
//  - (1 + ax)^(b/x)의 극한을 e^b 나 e^(a+b)로 적는다(지수를 1/(ax)에 맞추지 않는다). 곱이 줄어드는 꼴을 줄이지 않고 인수마다 극한을 따로 낸다.
//  - 분모가 0으로 가는 극한식에서 0이 아닌 극한값이 있으면 분자도 0으로 간다는 것(f(0) = 0, b = 1)을 쓰지 않고 바로 셈한다.
//  - 0으로 가는 항(sin² x)이 극한에 보탬이 된다고 여긴다. 극한 안의 합을 극한의 합으로 바로 나누면서 ln 의 안을 그대로 둔다.
//  - tan α 의 값만 보고 α + β 의 범위를 따지지 않아 sin(α + β)의 부호를 틀린다.
//  - 합의 삼각함수를 삼각함수의 합으로 여긴다(제곱해 더해 cos(α − β)를 만드는 길을 못 찾는다).
//  - sin x − tan x 를 x − x = 0으로 여겨 극한을 0이나 없다고 적는다.
//  - sin(kπ + θ)의 부호를 k 의 홀짝에 맞추지 않는다. (sin 2x)′ 를 cos 2x 로 적는다.
// 실력에 둔 까닭: ① 문제의 장치에 함정이 있어 배운 뜻을 정확히 대야 풀리는 것, ② 세 단계 넘게 이어 생각해야 풀리는 것만 남겼다(유형마다 주석).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines } = B.kit;
  const { MINUS, Q, qadd, qmul, qsub, fl, V, rt, sup, tag } = B.kit.mid;
  const { ms, lim, pw, ln, trig, jh, hx, signed } = B.kit.hs;
  const K = B.kit.u53x, K2 = B.kit.u53b, nb = K.nb;
  const { S1, S2, S3, HT, X, Tt, Hh, Av, Bv, Kv, Ee, sT, pp, jn, qT, cf, fIs, lf, ax, onePlus, eP, lnK, val, slots, close, near, valQ, okQ, eOpt } = K;
  const { rq, rr, rneg, rmul, rH, rOpt, sinD, cosD, piQ, range, AL, BE, sA, cA, tA, tB, LHS } = K2;

  const hard = [
    // ② 인수를 (n + k + 1)/(n + k)로 고쳐 쓰기 → 곱을 줄이기 → 1/m 을 곱해 1 + 1/(mn) 꼴 → 지수를 맞춰 e: 네 단계를 잇는다(중단원 평가의 끝 문제).
    HT('hard-telescope', '곱이 줄어드는 수열의 거듭제곱 극한', '①9', (d) => {
      const m = d.pick([2, 3]), k = d.pick([1, 2, 3, 4]);
      if (k % m === 0) return null;
      const v = Q(k, m), N = V('n');
      const an = ms('a_n'), row1 = nb(an + ' = ' + frac(1, m) + '(1 + ' + frac(1, N) + ')(1 + ' + frac(1, ms('n + 1')) + ')'), row2 = nb('× (1 + ' + frac(1, ms('n + 2')) + ') × ⋯ × (1 + ' + frac(1, ms(m + 'n')) + ')');
      const body = '(' + an + ')' + sup(k === 1 ? N : ms(k + 'n'));
      const wr = [Q(1, m), Q(k), Q(k * m), Q(k, m + 1), Q(k * (m - 1), m), Q(m, k), Q(k, 2 * m)].map(eOpt).concat([{ h: '1', v: 1 }]);
      return valQ(d, `자연수 ${N}에 대하여 ${an}이 다음과 같을 때, ${lim('n→∞', body)}의 값은?`, Math.exp(k / m), eOpt(v), wr, {
        figure: lines([hx(row1), hx(row2)]),
        explain: `${nb('1 + ' + frac(1, ms('n + j')) + ' = ' + frac(ms('n + j + 1'), ms('n + j')))}이므로 괄호 안의 곱은 ${nb(frac(ms('n + 1'), N) + ' × ' + frac(ms('n + 2'), ms('n + 1')) + ' × ⋯ × ' + frac(ms(m + 'n + 1'), ms(m + 'n')) + ' = ' + frac(ms(m + 'n + 1'), N))}이고, ${frac(1, m)}을 곱하면 ${nb(frac(ms(m + 'n + 1'), ms(m + 'n')) + ' = 1 + ' + frac(1, ms(m + 'n')))}이다. 따라서 (주어진 식) = ${nb(lim('n→∞', '{' + pw(nb('(1 + ' + frac(1, ms(m + 'n')) + ')'), ms(m + 'n')) + '}' + sup(qT(v))) + ' = ' + eP(v))}이다.`
      });
    }, { standard: S1 }),

    // ① 분모 → 0 이라 분자 → 0, 곧 f(0) = 0을 끌어내야 하고 ② f = cx² + ax → ln(1 + u)/u 꼴로 쪼개기 → a → f(p): 네 단계를 잇는다(교과서 대단원 평가).
    HT('hard-lnquad', 'ln{1 + f(x)}/x의 극한값으로 이차함수 정하기', '①17', (d) => {
      const c = d.pick([1, 2, -1]), b = d.pick([1, 2, 3]), m = d.pick([1, 2, 3, 4, 5, -2, -3]), p = d.pick([1, 2, 3, -1, -2]), useLn = d.bool();
      const a = b * m, ans = c * p * p + a * p;
      if (ans === 0) return null;
      const top = useLn ? ln(ms('{1 + f(x)}')) : ms('e^{f(x)} - 1');
      return val(`이차항의 계수가 ${sT(c)}인 이차함수 ${ms('f(x)')}가 다음을 만족시킬 때, ${ms('f(' + p + ')')}의 값은?`, ans, {
        figure: hx(lim('x→0', frac(top, ms(ax(b)))) + ' = ' + sT(m)),
        explain: `${X} → 0일 때 분모 → 0이고 극한값이 있으므로 분자 → 0이다. 따라서 ${useLn ? nb(ln(ms('{1 + f(0)}')) + ' = 0') : nb(ms('e^{f(0)} = 1'))}에서 ${nb(ms('f(0) = 0'))}이고 ${nb(ms('f(x) = ' + (c === 1 ? '' : c === -1 ? '-' : c) + 'x^2 + ax'))}로 놓을 수 있다. (좌변) = ${nb(lim('x→0', '{' + (useLn ? frac(ln(ms('{1 + f(x)}')), ms('f(x)')) : frac(ms('e^{f(x)} - 1'), ms('f(x)'))) + ' × ' + frac(ms('f(x)'), ms(ax(b))) + '}') + ' = 1 × ' + frac(Av, b))}이므로 ${nb(ms('a') + ' = ' + sT(a))}이다. 따라서 ${nb(ms('f(' + p + ')') + ' = ' + sT(ans))}이다.`,
        value: `${jn(c)}*${jn(p)}*${jn(p)}+${b}*${jn(m)}*${jn(p)}`
      });
    }, { standard: S1 }),

    // ② u = (ln 안의 식) − 1 로 놓아 ln(1 + u)/u 꼴로 바꾸고 u/x 를 기본 극한의 합으로 쪼갠다: 세 단계를 넘게 잇는다(중간고사 6점, 교과서 대단원 평가).
    //  원문 풀이는 g′(0)으로 보는 합성함수 미분(11-5-4)이지만, 이 단원의 극한만으로 푸는 길을 해설에 적었다. n = 1 은 0으로 가는 sin² 항이 보탬이 없다는 것을 대야 한다(①).
    HT('hard-lnsum', 'ln(지수식의 합)/x 꼴의 극한', '①18', (d, n) => {
      if (n === 0) {
        const k = d.pick([2, 3, 4, 5]), as = d.shuffle([1, 2, 3, 4, 5, 6]).slice(0, k).sort((x, y) => x - y), s = as.reduce((t, x) => t + x, 0);
        if (s % k !== 0) return null;
        const inner = as.map((a) => ms('e^{' + ax(a) + '}')).join(' + '), ans = s / k;
        return val('다음 극한값은?', ans, {
          figure: lf('x→0', frac(1, X) + ln(nb(frac(inner, k)))),
          explain: `${nb(ms('u') + ' = ' + frac(inner, k) + ' − 1')}로 놓으면 ${X} → 0일 때 ${ms('u')} → 0이고 (주어진 식) = ${nb(lim('x→0', frac(ln(ms('(1 + u)')), ms('u')) + ' × ' + frac(ms('u'), X)))}이다. ${nb(frac(ms('u'), X) + ' = ' + frac(1, k) + '(' + as.map((a) => frac(ms('e^{' + ax(a) + '} - 1'), X)).join(' + ') + ')')} → ${nb(frac(as.join(' + '), k) + ' = ' + ans)}이므로 극한값은 ${ans}이다.`,
          value: `(${as.join('+')})/${k}`
        });
      }
      const a = d.pick([1, 2, 3, 4, -1, -2]), q = d.pick([1, 2, 3]), b = d.pick([1, 2, 3]);
      const inner = nb(ms('e^{' + ax(a) + '} + ') + (q === 1 ? '' : q) + trig('sin', ax(b), 2));
      return val(`함수 ${fIs(ln(X))}에 대하여 다음 극한값은?`, a, {
        figure: lf('x→0', frac(ms('f') + '(' + inner + ')', X)),
        explain: `${nb(ms('u') + ' = ' + ms('e^{' + ax(a) + '} - 1 + ') + (q === 1 ? '' : q) + trig('sin', ax(b), 2))}로 놓으면 ${X} → 0일 때 ${ms('u')} → 0이고 (주어진 식) = ${nb(lim('x→0', frac(ln(ms('(1 + u)')), ms('u')) + ' × ' + frac(ms('u'), X)))}이다. ${nb(frac(ms('e^{' + ax(a) + '} - 1'), X))} → ${sT(a)}이고 ${nb(frac(trig('sin', ax(b), 2), X) + ' = ' + frac(trig('sin', ax(b)), X) + ' × ' + trig('sin', ax(b)))} → ${nb(b + ' × 0 = 0')}이므로 극한값은 ${sT(a)}이다.`,
        value: jn(a), derived: [Math.abs(a)]
      });
    }, { count: 2, standard: S1 }),

    // ② u = pˣ − 1 로 놓아 미분계수의 정의 × (pˣ − 1)/x 로 쪼갠다: 세 단계를 넘게 잇는다(중간고사 6점). 원문 풀이는 합성함수 미분(11-5-4)이다.
    HT('hard-compexp', '지수식이 안에 든 미분계수 꼴의 극한', '①28', (d) => {
      const c = d.pick([0, 1, 2, 3]), p = d.pick([2, 3, 5]), k = d.pick([2, 3, 4, -2, 5]), b = d.pick([1, 2]), L = Math.log(p);
      const arg = ms(p + '^x' + (c === 0 ? '' : ' + ' + c)), base = 1 + c, v = Q(k, b);
      const opt = (q) => ({ h: lnK(q, p), v: fl(q) * L });
      const wr = [opt(Q(k * p, b)), { h: qT(v), v: fl(v) }, { h: frac(sT(k), nb((b === 1 ? '' : b + ' ') + ln(p))), v: k / (b * L) }, { h: lnK(Q(k, b), base + p > 9 ? 7 : base + p), v: (k / b) * Math.log(base + p > 9 ? 7 : base + p) }, opt(Q(-k, b)), opt(Q(k * b)), opt(Q(k, p * b))];
      return valQ(d, `미분가능한 함수 ${ms('f(x)')}에 대하여 ${nb(ms("f'(" + base + ') = ' + k))}일 때, 다음 극한값은?`, (k / b) * L, opt(v), wr, {
        figure: lf('x→0', frac(nb(ms('f') + '(' + arg + ') − ' + ms('f(' + base + ')')), ms(ax(b)))),
        explain: `${nb(ms('u') + ' = ' + ms(p + '^x - 1'))}로 놓으면 ${X} → 0일 때 ${ms('u')} → 0이고 ${nb(arg + ' = ' + ms(base + ' + u'))}이다. (주어진 식) = ${nb(lim('x→0', '{' + frac(ms('f(' + base + ' + u) - f(' + base + ')'), ms('u')) + ' × ' + frac(ms(p + '^x - 1'), ms(ax(b))) + '}') + ' = ' + ms("f'(" + base + ')') + ' × ' + (b === 1 ? ln(p) : frac(ln(p), b)))} = ${lnK(v, p)}이다.`
      });
    }, { standard: S1 }),

    // ① 두 근의 부호로 α, β 의 자리를 정하고 tan(α + β) > 0 이면 α + β 가 제3사분면임을 대야 sin 의 부호가 정해진다 ② 근과 계수 → tan(α + β) → 범위 → sin: 네 단계(중단원 평가 끝 문제).
    HT('hard-tansin', 'tan(α + β)와 α + β의 범위로 sin(α + β)', '①34', (d) => {
      const a = d.pick([1, 2]), bq = d.pick([-7, -5, -4, -3, -2, 2, 3, 4, 5, 6]), c = d.pick([-1, -2, -3, -4]);
      if ((a - c) === 0) return null;
      const T = Q(-bq, a - c);                                  // tan(α + β) = (−b/a)/(1 − c/a)
      const disc = bq * bq - 4 * a * c, r1 = (-bq + Math.sqrt(disc)) / (2 * a), r2 = (-bq - Math.sqrt(disc)) / (2 * a), tp = Math.max(r1, r2), tn = Math.min(r1, r2);
      const al = Math.atan(tp), be = Math.PI + Math.atan(tn), wantSin = d.bool(), target = wantSin ? Math.sin(al + be) : Math.cos(al + be);
      const u = T.p, w = T.q, h2 = u * u + w * w, third = T.p > 0;    // tan > 0 이면 π < α + β < 3π/2
      const sinMag = rr(Q(Math.abs(u), h2), h2), cosMag = rr(Q(w, h2), h2);
      const sinV = third ? rneg(sinMag) : sinMag, cosV = rneg(cosMag);
      const right = wantSin ? sinV : cosV, wr = [rneg(right), wantSin ? cosV : sinV, wantSin ? rneg(cosV) : rneg(sinV), rq(T), rq(qmul(T, Q(-1)))].map(rOpt);
      const eq = ms((a === 1 ? '' : a) + 'x^2 ' + (bq < 0 ? '- ' + (bq === -1 ? '' : -bq) : '+ ' + bq) + 'x - ' + -c + ' = 0');
      const ask = wantSin ? nb(sA + trig('cos', 'β') + ' + ' + cA + trig('sin', 'β')) : nb(cA + trig('cos', 'β') + ' − ' + sA + trig('sin', 'β'));
      return valQ(d, `이차방정식 ${nb(eq)}의 두 근을 ${tA}, ${tB}라 할 때, ${ask}의 값은? (단, ${range('α', 1)}, ${range('β', 2)})`, target, rOpt(right), wr, {
        explain: `근과 계수의 관계에서 ${nb(tA + ' + ' + tB + ' = ' + qT(Q(-bq, a)))}, ${nb(tA + tB + ' = ' + qT(Q(c, a)))}이므로 ${nb(LHS.tp + ' = ' + qT(T))}이다. ${nb('π/2 &lt; ' + AL + ' + ' + BE + ' &lt; 3π/2')}이고 ${LHS.tp}${third ? ' &gt; 0이므로 ' + nb('π &lt; ' + AL + ' + ' + BE + ' &lt; 3π/2') + '이다' : ' &lt; 0이므로 ' + nb('π/2 &lt; ' + AL + ' + ' + BE + ' &lt; π') + '이다'}. 묻는 식은 ${wantSin ? LHS.sp : LHS.cp}이고, ${nb(trig('cos', '(α + β)', 2) + ' = ' + frac(1, '1 + ' + trig('tan', '(α + β)', 2)))}에서 그 값은 ${rH(right)}이다.`
      });
    }, { standard: S2 }),

    // ② 두 식을 제곱해 더하기 → sin² + cos² = 1 → 덧셈정리를 거꾸로 알아보기: 세 단계를 넘게 잇는 꾀가 필요하다(대단원 평가). 답은 늘 분수.
    HT('hard-sumsq', 'sin·cos의 합을 제곱해 cos(α − β) 구하기', '①38', (d) => {
      const VALS = [[Q(1, 4), frac(1, 2)], [Q(1), '1'], [Q(3, 4), frac(rt(3), 2)], [Q(1, 2), frac(rt(2), 2)], [Q(1, 9), frac(1, 3)], [Q(4, 9), frac(2, 3)], [Q(2), rt(2)], [Q(9, 4), frac(3, 2)]];
      const [A2, Ah] = d.pick(VALS), [B2, Bh] = d.pick(VALS), plus = d.bool(), s = qadd(A2, B2);
      if (fl(s) > 4) return null;
      const v = plus ? Q(s.p - 2 * s.q, 2 * s.q) : Q(2 * s.q - s.p, 2 * s.q);
      if (v.q === 1) return null;
      const op = plus ? ' + ' : ' − ';
      return val(`${nb(sA + op + trig('sin', 'β') + ' = ' + Ah)}, ${nb(cA + op + trig('cos', 'β') + ' = ' + Bh)}일 때, ${LHS.cm}의 값은?`, v, {
        explain: `두 식을 각각 제곱하여 더하면 ${nb('(' + trig('sin', 'α', 2) + ' + ' + trig('cos', 'α', 2) + ') + (' + trig('sin', 'β', 2) + ' + ' + trig('cos', 'β', 2) + ')' + (plus ? ' + ' : ' − ') + '2(' + cA + trig('cos', 'β') + ' + ' + sA + trig('sin', 'β') + ') = ' + qT(s))}이다. 곧 ${nb('2 ' + (plus ? '+' : '−') + ' 2' + LHS.cm + ' = ' + qT(s))}이므로 ${nb(LHS.cm + ' = ' + qT(v))}이다.`,
        value: plus ? `((${A2.p}/${A2.q})+(${B2.p}/${B2.q})-2)/2` : `(2-(${A2.p}/${A2.q})-(${B2.p}/${B2.q}))/2`, derived: [2, A2.p, A2.q, B2.p, B2.q]
      });
    }, { standard: S2 }),

    // ② 배각 공식으로 cos 2x 를 바꾸기 → t = cos x(sin x)의 범위 → 이차함수의 꼭짓점 → x 의 값: 네 단계(대단원 평가 서술형). 짝 (a, b)의 맞고 틀림은 함수를 잘게 셈해 가린다.
    HT('hard-cos2x', '배각으로 바꾼 삼각함수의 최댓값·최솟값', '①40', (d) => {
      const form = d.pick([0, 1]), q = d.pick([-3, -2, -1, 1, 2, 3]);
      let F, lo, hi, a0, b0, aq, fS, rng, word, how;
      if (form === 0) {
        const p = d.pick([2, -2]); F = (x) => Math.cos(2 * x) + p * Math.cos(x) + q; lo = 0; hi = Math.PI; aq = p > 0 ? Q(2, 3) : Q(1, 3); b0 = Q(2 * q - 3, 2); word = '최솟값';
        fS = nb(trig('cos', '2x') + (p > 0 ? ' + 2' : ' − 2') + trig('cos', 'x') + (q < 0 ? ' − ' + -q : ' + ' + q)); rng = nb(ms('0 <= x <= π'));
        how = `${nb(trig('cos', '2x') + ' = 2' + trig('cos', 'x', 2) + ' − 1')}이므로 ${nb(trig('cos', 'x') + ' = ' + Tt)}로 놓으면 ${nb(ms('-1 <= t <= 1'))}이고 ${nb(ms('f = 2t^2 ' + (p > 0 ? '+' : '-') + ' 2t ' + (q - 1 < 0 ? '- ' + (1 - q) : q - 1 === 0 ? '' : '+ ' + (q - 1))))}이다. ${nb(Tt + ' = ' + (p > 0 ? MINUS : '') + frac(1, 2))}일 때 가장 작으므로`;
      } else {
        F = (x) => Math.cos(2 * x) + 2 * Math.sin(x) + q; lo = 0; hi = Math.PI / 2; aq = Q(1, 6); b0 = Q(2 * q + 3, 2); word = '최댓값';
        fS = nb(trig('cos', '2x') + ' + 2' + trig('sin', 'x') + (q < 0 ? ' − ' + -q : ' + ' + q)); rng = nb(ms('0 <= x <= ') + frac('π', 2));
        how = `${nb(trig('cos', '2x') + ' = 1 − 2' + trig('sin', 'x', 2))}이므로 ${nb(trig('sin', 'x') + ' = ' + Tt)}로 놓으면 ${nb(ms('0 <= t <= 1'))}이고 ${nb(ms('f = -2t^2 + 2t ' + (q + 1 < 0 ? '- ' + -(q + 1) : q + 1 === 0 ? '' : '+ ' + (q + 1))))}이다. ${nb(Tt + ' = ' + frac(1, 2))}일 때 가장 크므로`;
      }
      // 잘게 셈해 최댓값·최솟값과 그 자리를 찾는다
      let best = null;
      for (let i = 0; i <= 6000; i += 1) { const x = lo + ((hi - lo) * i) / 6000, y = F(x); if (best === null || (word === '최솟값' ? y < best.y - 1e-12 : y > best.y + 1e-12)) best = { x, y }; }
      const pairs = [[aq, b0], [form === 0 ? Q(3 - aq.p, 3) : Q(1, 3), b0], [aq, qadd(b0, Q(1))], [aq, qadd(b0, Q(-1, 2))], [form === 0 ? Q(1, 2) : Q(1, 4), b0], [form === 0 ? Q(1) : Q(1, 2), qadd(b0, Q(1, 2))]];
      const seen = new Set(), list = [];
      for (const [x, y] of pairs) { const key = x.p + '/' + x.q + '|' + y.p + '/' + y.q; if (seen.has(key)) continue; seen.add(key); list.push({ h: nb(ms('a') + ' = ' + piQ(x) + ', ' + ms('b') + ' = ' + qT(y)), ok: Math.abs(fl(x) * Math.PI - best.x) < 2e-3 && Math.abs(fl(y) - best.y) < 1e-6 }); }
      return okQ(d, `${rng}에서 함수 ${jh(fIs(fS), '은/는')} ${nb(ms('x = a'))}일 때 ${word} ${jh(Bv, '을/를')} 갖는다. 상수 ${Av}, ${Bv}의 값은?`, list.slice(0, 5), {
        explain: `${how} ${nb(ms('a') + ' = ' + piQ(aq))}, ${nb(ms('b') + ' = ' + qT(b0))}이다.`
      });
    }, { standard: S2 }),

    // ② tan x = sin x/cos x 로 통분 → 1 − cos x 에 1 + cos x 곱하기 → (sin x/x)³ 로 묶기: 세 단계를 넘게 잇는다(대단원 평가). 답은 늘 분수.
    HT('hard-sintan', 'sin x − tan x가 든 극한', '①45', (d) => {
      const a = d.pick([1, 2, 3, 4, 5]), b = d.pick([1, 2, 3]), form = d.pick([0, 1]);
      let body, v, value;
      if (form === 0) { body = frac(ms(ax(a, 'x^3')), nb(trig('sin', ax(b)) + ' − ' + trig('tan', ax(b)))); v = Q(-2 * a, b * b * b); value = `0-2*${a}/(${b}*${b}*${b})`; }
      else { body = frac(nb(trig('tan', ax(b)) + ' − ' + trig('sin', ax(b))), ms(ax(a, 'x^3'))); v = Q(b * b * b, 2 * a); value = `${b}*${b}*${b}/(2*${a})`; }
      if (v.q === 1) return null;
      const bx = ax(b), s = trig('sin', bx), c = trig('cos', bx);
      return val('다음 극한값은?', v, {
        figure: lf('x→0', body),
        explain: `${nb(trig('tan', bx) + ' − ' + s + ' = ' + frac(s + '(1 − ' + c + ')', c) + ' = ' + frac(s + '(1 − ' + trig('cos', bx, 2) + ')', c + '(1 + ' + c + ')') + ' = ' + frac(trig('sin', bx, 3), c + '(1 + ' + c + ')'))}이고 ${nb(lim('x→0', frac(s, ms(bx))) + ' = 1')}이므로 ${nb(trig('tan', bx) + ' − ' + s)}는 ${nb(frac(pw('(' + ms(bx) + ')', 3), 2))}처럼 0으로 간다. 따라서 극한값은 ${qT(v)}이다.`,
        value, derived: [2]
      });
    }, { standard: S3 }),

    // ① 분자 → 0 이고 0이 아닌 극한값이므로 분모 → 0, 곧 b 가 cos 앞의 수와 같아야 하고 ② 1 + cos 를 곱해 sin² 으로 → 극한 → a: 네 단계(교과서 중단원 점검 발전 문제).
    HT('hard-tcoef', '분모 → 0을 써서 삼각함수 극한의 상수 정하기', '①47', (d) => {
      const m = d.pick([1, 2, 3]), c = d.pick([1, 2, 3]), a = d.pick([1, 2, 3, 4, 5, -1, -2]), k = Q(2 * a, m * c * c);
      if (k.q === 1 && Math.abs(k.p) === Math.abs(a)) return null;
      const den = ms('b - ') + (m === 1 ? '' : m) + trig('cos', ax(c));
      return slots(`다음 등식이 성립하도록 하는 상수 ${Av}, ${Bv}의 값은?`, `${Av} = {0}, ${Bv} = {1}`, [[a, `${k.p}*${m}*${c}*${c}/(2*${k.q})`], [m, `${m}`]], {
        shown: `${Av} = ${sT(a)}, ${Bv} = ${m}`,
        figure: hx(lim('x→0', frac(ms('ax') + trig('sin', 'x'), den)) + ' = ' + qT(k)),
        explain: `${X} → 0일 때 분자 → 0이고 0이 아닌 극한값이 있으므로 분모 → 0이어야 한다. ${nb(ms('b - ' + m) + ' = 0')}에서 ${nb(ms('b') + ' = ' + m)}이다. 분모·분자에 ${nb('1 + ' + trig('cos', ax(c)))}를 곱하면 분모는 ${nb((m === 1 ? '' : m) + trig('sin', ax(c), 2))}이 되어 (좌변) = ${nb(lim('x→0', frac(ms('ax') + trig('sin', 'x') + '(1 + ' + trig('cos', ax(c)) + ')', (m === 1 ? '' : m) + trig('sin', ax(c), 2))) + ' = ' + frac(ms('2a'), String(m * c * c)))}이다. ${nb(frac(ms('2a'), String(m * c * c)) + ' = ' + qT(k))}에서 ${nb(ms('a') + ' = ' + sT(a))}이다.`,
        derived: [2]
      });
    }, { standard: S3 }),

    // ② 도형에서 내접원의 반지름을 θ 로 나타내기(접선과 반지름이 수직) → 넓이(둘레) → sin θ/θ 꼴로 묶기: 세 단계를 넘게 잇는다(교과서 중단원 점검 발전 문제). π 가 든 값이라 고르기.
    HT('hard-sector', '부채꼴에 내접하는 원의 넓이·둘레의 극한', '①50', (d) => {
      const R = d.pick([1, 2, 3, 4]), dbl = d.bool(), area = d.bool(), half = (th) => (dbl ? th : th / 2);
      const rOf = (th) => (R * Math.sin(half(th))) / (1 + Math.sin(half(th)));
      const th0 = 1e-6, target0 = area ? (Math.PI * rOf(th0) ** 2) / (th0 * th0) : (2 * Math.PI * rOf(th0)) / th0;
      const coef = area ? Q(R * R, dbl ? 1 : 4) : Q(2 * R, dbl ? 1 : 2), target = fl(coef) * Math.PI;
      if (Math.abs(target0 - target) > 1e-4 * target) throw new Error('도형 극한이 다르다');
      const pi = (q) => ({ h: piQ(q), v: fl(q) * Math.PI });
      const wr = [pi(Q(R * R)), pi(Q(2 * R)), pi(Q(R * R, 4)), pi(Q(R, 1)), pi(Q(R * R, 2)), pi(Q(4 * R * R)), pi(Q(4 * R)), pi(Q(R, 2))];
      // 그림: 중심각 φ(그림에서는 50°)인 부채꼴과 두 반지름·호에 접하는 원
      const phi = (50 * Math.PI) / 180, Rp = 130, ox = 18, oy = 150, f1 = (v) => Math.round(v * 10) / 10;
      const Ax = ox + Rp, Ay = oy, Bx = ox + Rp * Math.cos(phi), By = oy - Rp * Math.sin(phi), rr0 = (Rp * Math.sin(phi / 2)) / (1 + Math.sin(phi / 2)), dc = Rp - rr0;
      const cx = ox + dc * Math.cos(phi / 2), cy = oy - dc * Math.sin(phi / 2), lab = dbl ? '2θ' : 'θ';
      const svg = `<svg role="img" aria-label="그림: 중심이 O, 반지름의 길이가 ${R}인 부채꼴 OAB(중심각 ${lab})와, 두 반지름 OA, OB에 접하고 호 AB와 한 점에서 만나는 원" viewBox="0 0 ${Ax + 22} 170" width="${Ax + 22}" height="170">`
        + `<path d="M${ox} ${oy} L${Ax} ${Ay} A${Rp} ${Rp} 0 0 0 ${f1(Bx)} ${f1(By)} Z" fill="none" stroke="#1f2933" stroke-width="1.5"/>`
        + `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(rr0)}" fill="#fbcfe8" stroke="#b42318" stroke-width="1.2"/>`
        + `<path d="M${ox + 26} ${oy} A26 26 0 0 0 ${f1(ox + 26 * Math.cos(phi))} ${f1(oy - 26 * Math.sin(phi))}" fill="none" stroke="#5b6770"/>`
        + `<text x="${ox + 30}" y="${oy - 6}" style="font-size:12px;font-style:italic">${lab}</text>`
        + `<text x="${ox - 2}" y="${oy + 16}" style="font-size:13px">O</text><text x="${Ax - 4}" y="${Ay + 16}" style="font-size:13px">A</text><text x="${f1(Bx - 2)}" y="${f1(By - 6)}" style="font-size:13px">B</text>`
        + `<text x="${f1(ox + Rp / 2)}" y="${oy + 16}" style="font-size:12px">${R}</text></svg>`;
      const what = area ? `넓이를 ${ms('S(θ)')}` : `둘레의 길이를 ${ms('l(θ)')}`;
      const L0 = area ? lim('θ→0+', frac(ms('S(θ)'), ms('θ^2'))) : lim('θ→0+', frac(ms('l(θ)'), ms('θ')));
      const hTh = dbl ? V('θ') : frac(V('θ'), 2);
      return valQ(d, `그림과 같이 반지름의 길이가 ${R}이고 중심각의 크기가 ${dbl ? nb('2' + V('θ')) : V('θ')}인 부채꼴 OAB에서 두 선분 OA, OB에 접하고 호 AB와 한 점에서 만나는 원의 ${what}이라 할 때, ${L0}의 값은? (단, ${nb(ms('0 < θ < ') + (dbl ? frac('π', 2) : 'π'))})`, target, pi(coef), wr, {
        figure: svg,
        explain: `원의 중심을 C, 반지름의 길이를 ${ms('r')}라 하면 C는 ∠AOB를 이등분하는 선 위에 있고 ${nb('OC = ' + R + ' − ' + ms('r'))}이다. C에서 OA에 내린 수선을 보면 ${nb(ms('r') + ' = (' + R + ' − ' + ms('r') + ')' + trig('sin', hTh))}이므로 ${nb(ms('r') + ' = ' + frac((R === 1 ? '' : R) + trig('sin', hTh), '1 + ' + trig('sin', hTh)))}이다. ${hTh} → 0일 때 ${nb(frac(trig('sin', hTh), V('θ')) + ' → ' + (dbl ? '1' : frac(1, 2)))}이므로 극한값은 ${piQ(coef)}이다.`
      });
    }, { standard: S3 }),

    // ② sin(kπ + θ) = (−1)ᵏ sin θ 로 바꾸기 → sin θ/θ × (e^(ax) − 1)/x 로 쪼개기: 네 단계(대단원 평가 서술형). 원문 풀이는 합성함수 미분(11-5-4)이다. π 가 든 값이라 고르기.
    HT('hard-sinexp', '지수가 든 사인함수의 극한', '①51', (d) => {
      const k = d.pick([1, 2, 3]), a = d.pick([1, 2, 3, -1]), b = d.pick([1, 2]), sg = k % 2 === 0 ? 1 : -1, v = Q(sg * k * a, b);
      const pi = (q) => ({ h: piQ(q), v: fl(q) * Math.PI });
      const wr = [pi(Q(-sg * k * a, b)), pi(Q(k, b)), pi(Q(sg * k, b)), pi(Q(sg * a, b)), pi(Q(k * a)), { h: String(sg * k * a === 0 ? 1 : 0), v: 0 }, pi(Q(sg * k * a * 2, b))];
      const gS = nb(trig('sin', (k === 1 ? '' : k) + 'π' + X));
      return valQ(d, `두 함수 ${fIs(ms('e^{' + ax(a) + '}'))}, ${fIs(gS, 'g')}에 대하여 다음 극한값은?`, fl(v) * Math.PI, pi(v), wr, {
        figure: lf('x→0', frac(ms('g(f(x))'), ms(ax(b)))),
        explain: `${nb(ms('g(f(x))') + ' = ' + trig('sin', (k === 1 ? '' : k) + 'π' + ms('e^{' + ax(a) + '}')))}이다. ${nb(ms('u') + ' = ' + (k === 1 ? '' : k) + 'π(' + ms('e^{' + ax(a) + '} - 1') + ')')}로 놓으면 ${nb(trig('sin', (k === 1 ? '' : k) + 'π' + ms('e^{' + ax(a) + '}')) + ' = ' + trig('sin', '(' + (k === 1 ? '' : k) + 'π + u)') + ' = ' + (sg < 0 ? MINUS : '') + trig('sin', 'u'))}이고 ${X} → 0일 때 ${ms('u')} → 0이다. (주어진 식) = ${nb((sg < 0 ? MINUS : '') + lim('x→0', '(' + frac(trig('sin', 'u'), ms('u')) + ' × ' + frac(ms('u'), ms(ax(b))) + ')'))}이고 ${nb(frac(ms('u'), X) + ' → ' + (k === 1 ? '' : k) + 'π × ' + pp(a))}이므로 극한값은 ${piQ(v)}이다.`
      });
    }, { standard: S3 }),

    // ② 극한을 p·f′(x)로 바꾸기 → sin 2x = 2 sin x cos x 로 곱의 미분 → cos 2x 의 범위로 최댓값·최솟값 → k: 네 단계(중간고사 끝 문제 7점).
    //  원문 풀이의 (sin 2x)′ = 2cos 2x 는 합성함수 미분(11-5-4)이라, 배각 공식과 곱의 미분으로 구하는 길을 해설에 적었다.
    HT('hard-sin2x', '도함수의 최댓값과 최솟값으로 상수 정하기', '①56', (d) => {
      const useSin = d.bool(), p = d.pick([2, 3, -1, 4]), k = d.pick([1, 2, 3, 4, 5, -1, -2, -3]), S = 2 * p * k;
      const fS = nb(trig(useSin ? 'sin' : 'cos', '2x') + ' + ' + Kv + X);
      const arg = p === -1 ? 'x - h' : 'x + ' + p + 'h';
      const fp = useSin ? `${nb('(' + trig('sin', '2x') + ')′ = (2' + trig('sin', 'x') + trig('cos', 'x') + ')′ = 2(' + trig('cos', 'x', 2) + ' − ' + trig('sin', 'x', 2) + ') = 2' + trig('cos', '2x'))}` : `${nb('(' + trig('cos', '2x') + ')′ = (' + trig('cos', 'x', 2) + ' − ' + trig('sin', 'x', 2) + ')′ = ' + MINUS + '4' + trig('sin', 'x') + trig('cos', 'x') + ' = ' + MINUS + '2' + trig('sin', '2x'))}`;
      return val(`함수 ${fIs(fS)}에 대하여 함수 ${nb(ms('g(x)') + ' = ' + lim('h→0', frac(ms('f(' + arg + ') - f(x)'), Hh)))}의 최댓값을 ${ms('M')}, 최솟값을 ${ms('m')}이라 하자. ${nb(ms('M + m') + ' = ' + sT(S))}일 때, 상수 ${Kv}의 값은?`, k, {
        explain: `${nb(ms('g(x)') + ' = ' + sT(p) + ' × ' + lim('h→0', frac(ms('f(' + arg + ') - f(x)'), ms(p === -1 ? '-h' : p + 'h'))) + ' = ' + cf(p, ms("f'(x)")))}이다. ${fp}이므로 ${nb(ms("f'(x)") + ' = ' + (useSin ? '2' + trig('cos', '2x') : MINUS + '2' + trig('sin', '2x')) + ' + ' + Kv)}이고, ${useSin ? trig('cos', '2x') : trig('sin', '2x')}의 값은 −1부터 1까지이므로 ${ms("f'(x)")}의 최댓값은 ${nb(Kv + ' + 2')}, 최솟값은 ${nb(Kv + ' − 2')}이다. ${nb(ms('M + m') + ' = ' + sT(p) + ' × 2' + Kv + ' = ' + sT(S))}에서 ${nb(ms('k') + ' = ' + sT(k))}이다.`,
        value: `${jn(S)}/(2*${jn(p)})`, derived: [2]
      });
    }, { standard: S3 })
  ];

  B.addGroup('11-5-3', { id: 'hard', title: '실력 문제', standard: S1, types: hard });
})(typeof window !== 'undefined' ? window : globalThis);
