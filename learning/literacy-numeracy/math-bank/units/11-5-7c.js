// 고등학교 미적분Ⅱ Ⅲ-2 정적분의 활용 — 실력 문항. 단원 틀·싣는 기준·뺀 것과 까닭은 11-5-7a.js 머리에 적었다. 도구는 B.kit.u57x(11-5-7a.js).
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것
//  - 급수를 정적분으로 옮길 때 Δx = (b − a)/n 을 잊어, k/n 의 계수가 1이 아닌데도 앞에 1/c 을 곱하지 않는다. 1/(n + k)·f 꼴에서는 f 옆에 1/x 이 붙는 것을 빠뜨린다.
//  - ln(1 + 2k/n)ᵏ 처럼 로그의 지수에 k 가 있으면 급수를 정적분으로 옮길 수 없다고 여긴다 — 지수를 앞으로 꺼내면 k/n 이 하나 더 생긴다.
//  - 「넓이 = 정적분」으로 외워, 위아래가 바뀌는 두 넓이가 같다는 조건을 넓이마다 따로 셈하려 한다 — 두 넓이가 같으면 처음부터 끝까지의 정적분이 0이다.
//  - 역함수 g 의 정적분이나 f 와 g 사이의 넓이를 g 의 식으로만 구하려 한다 — 두 그래프가 y = x 에 대칭이라 넓이가 같은 부분을 찾으면 f 의 정적분과 직사각형으로 바뀐다.
//  - 부피를 구할 때 단면의 모양(정사각형·정삼각형·직각삼각형)과 한 변이 무엇인지를 세우지 않고 곡선의 식을 그대로 적분한다.
//
// 실력에 둔 까닭(①은 뜻을 정확히 대야 풀리는 함정, ②는 세 단계 넘게 잇는 문제)
//  ① hard-riem-fsq(n/(n + k)² 이 1/x² 이 되어 f 옆에 붙음), hard-riem-lnpow(로그의 지수 k 를 앞으로), hard-area-geo(n 의 홀짝에 따라 부호가 바뀌어도 넓이는 같다),
//    hard-inv-area·hard-inv-int(y = x 대칭), hard-equal-ab(두 넓이가 같으면 정적분이 0), hard-vol-wedge(단면을 세우는 축과 직각삼각형의 변), hard-vbase-diff(유리수 부분과 ln 2 의 계수 가르기)
//  ② hard-riem-x2ln(옮기기 → 부분적분 → 나눗셈 → 정리), hard-riem-root-e(거듭제곱근을 지수로 → 구간과 계수 → 부분적분 → 계수 비교),
//    hard-vbase-trig(삼각함수 식을 고침 → 치환 → 남은 적분 → 합), hard-arc-rel(길이를 a 의 식으로 → 관계식 → 방정식 → 근)
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, M, C } = B.kit;
  const { MINUS, Q, qadd, qsub, qmul, qdiv, isInt, fl, nb, V, sup, rt, js, sqParts } = B.kit.mid;
  const { ms, fn, sub, sum, intg, evl, rtn, trig, jh, hx, qAns, plot } = B.kit.hs;
  const K = B.kit.u57x;
  const { S4, S5, S6, S7, H, integ, close, dnum, L, ladd, lsc, lneg, lq, lnum, eH, num, lnH, lH, pickC, X, YY, KK, NN, yEq, xEq, piH, iv } = K;
  const limN = (body) => hx(B.kit.hs.lim('n→∞') + body);
  const sumK = (body) => sum('k=1', 'n', body);
  const kn = (c) => frac((c === 1 ? '' : c) + KK, NN);

  const hard = [
    H('hard-riem-x2ln', 'xᵐ ln(1 + x) 꼴의 급수의 극한 — 부분적분', '①10', (d) => {
      const m = d.pick([1, 2, 3, 4]), N0 = m + 1;
      let alt = Q(0); for (let i = 1; i <= N0; i += 1) alt = qadd(alt, Q((N0 - i) % 2 ? -1 : 1, i));     // Σ(−1)^(N−i)/i
      const lnc = N0 % 2 ? 2 : 0, right = L([Q(lnc, m + 1), ['ln', 2]], [qdiv(qmul(alt, Q(-1)), Q(m + 1))]), chk = integ((x) => x ** m * Math.log(1 + x), 0, 1);
      const body = (m === 1 ? KK : KK + sup(m)) + ' ' + fn('ln') + frac(ms('n + k'), NN);
      return pickC(d, '다음 극한값은?', right, [L([lnc, ['ln', 2]], [qmul(alt, Q(-1))]), L([Q(1, m + 1), ['ln', 2]]), L([Q(lnc, m + 1), ['ln', 2]], [qdiv(alt, Q(m + 1))]), L([Q(lnc || 1, m + 2), ['ln', 2]], [qdiv(qmul(alt, Q(-1)), Q(m + 2))]), lq(qdiv(qmul(alt, Q(-1)), Q(m + 1)))], {
        chk, figure: limN(frac(1, NN + sup(m + 1)) + sumK(body)),
        explain: `${nb(frac(body, NN + sup(m + 1)) + ' = ' + frac(1, NN) + '(' + kn(1) + ')' + (m === 1 ? '' : sup(m)) + fn('ln') + '(1 + ' + kn(1) + ')')}이므로 극한값은 ${intg(0, 1, (m === 1 ? X : X + sup(m)) + fn('ln') + '(1 + ' + X + ')', 'x')}이다. 부분적분하면 ${nb(evl(frac(X + sup(m + 1), m + 1) + fn('ln') + '(1 + ' + X + ')', 0, 1) + ' ' + MINUS + ' ' + frac(1, m + 1))}${intg(0, 1, frac(X + sup(m + 1), '1 + ' + X), 'x')}이고, ${jh(frac(X + sup(m + 1), '1 + ' + X), '을/를')} 나누어 적분하면 ${lH(right)}이다.`, rule: 'x2ln' });
    }),
    H('hard-riem-lnpow', '로그의 지수에 k가 있는 급수의 극한', '①11', (d) => {
      const c = d.pick([2, 3, 4]), right = L([Q(c * c - 1, 2 * c * c), ['ln', 1 + c]], [qdiv(qsub(Q(c, 2), Q(c * c, 4)), Q(c * c))]), chk = integ((x) => x * Math.log(1 + x), 0, c) / (c * c);
      const terms = [`${fn('ln')}(1 + ${frac(c, NN)})`, `${fn('ln')}(1 + ${frac(2 * c, NN)})${sup(2)}`, '⋯', `${fn('ln')}(1 + ${frac(c + NN, NN)})${sup(NN)}`].map((h) => (h === '⋯' ? h : nb(h))).join(' + ');
      const raw = L([Q(c * c - 1, 2), ['ln', 1 + c]], [qsub(Q(c, 2), Q(c * c, 4))]);
      return pickC(d, '다음 극한값은?', right, [raw, lsc(raw, Q(1, c)), L([Q(c * c - 1, 2 * c * c), ['ln', 1 + c]]), L([Q(c * c - 1, 2 * c * c), ['ln', 1 + c]], [qdiv(qsub(Q(c * c, 4), Q(c, 2)), Q(c * c))]), L([Q(c * c - 1, c * c), ['ln', 1 + c]], [qdiv(qsub(Q(c, 2), Q(c * c, 4)), Q(c * c))])], {
        chk, figure: limN(frac(1, NN + sup(2)) + '{' + terms + '}'),
        explain: `${nb(fn('ln') + '(1 + ' + frac(c + KK, NN) + ')' + sup(KK) + ' = ' + KK + fn('ln') + '(1 + ' + frac(c + KK, NN) + ')')}이므로 주어진 식은 ${sumK('(' + kn(1) + ')' + fn('ln') + '(1 + ' + kn(c) + ')' + frac(1, NN))}의 극한이다. ${nb(V('x') + sub(KK) + ' = ' + kn(c))}로 놓으면 ${nb(kn(1) + ' = ' + frac(V('x') + sub(KK), c))}, ${nb(frac(1, NN) + ' = ' + frac('Δ' + X, c))}이므로 극한값은 ${frac(1, c * c)}${intg(0, c, X + fn('ln') + '(1 + ' + X + ')', 'x')}이다. 부분적분하면 ${lH(right)}이다.`, rule: 'lnpow' });
    }),
    H('hard-riem-root-e', '거듭제곱근을 지수로 고쳐 급수를 정적분으로 — p, q 구하기', '①12', (d) => {
      const [c, m, r] = d.pick([[9, 2, 3], [4, 1, 2], [8, 1, 2], [1, 2, 1], [2, 2, 1], [9, 1, 3]]), t = Q(r, m);
      const p = qmul(Q(c), qsub(Q(m, r), Q(m * m, r * r))), q = qmul(Q(c), Q(m * m, r * r));
      if (!isInt(p) || !isInt(q)) return null;
      const chk = c * integ((x) => x * Math.exp(fl(t) * x), 0, 1);
      if (!close(fl(p) * Math.exp(fl(t)) + fl(q), chk)) throw new Error('p, q 셈이 다르다');
      const idx = m === 1 ? 'n' : m + 'n', body = kn(1) + rtn(idx, V('e') + sup((r === 1 ? '' : r) + KK)), et = eH(t);
      return M(`다음 극한값이 ${nb(V('p') + et + ' + ' + V('q'))}일 때, 유리수 ${V('p')}, ${V('q')}의 값은? ${nb('(단, ' + et + '은 무리수이다.)')}`, [{ label: V('p'), answer: p.p, signed: true }, { label: V('q'), answer: q.p, signed: true }], {
        figure: limN(frac(c, NN) + sumK(body)),
        explain: `${nb(rtn(idx, V('e') + sup((r === 1 ? '' : r) + KK)) + ' = ' + V('e') + sup(frac((r === 1 ? '' : r) + KK, idx)))}이므로 주어진 식은 ${nb((c === 1 ? '' : c) + intg(0, 1, X + V('e') + sup(num(t) + X), 'x'))}이다. 부분적분하면 ${intg(0, 1, X + V('e') + sup(num(t) + X), 'x')} = ${evl('(' + (qdiv(Q(1), t).p === 1 && qdiv(Q(1), t).q === 1 ? '' : num(qdiv(Q(1), t))) + X + ' ' + MINUS + ' ' + num(qdiv(Q(1), qmul(t, t))) + ')' + V('e') + sup(num(t) + X), 0, 1)}이므로 극한값은 ${lH(L([p, ['e', t]], [q]))}이다. 따라서 ${nb(V('p') + ' = ' + num(p))}, ${nb(V('q') + ' = ' + num(q))}이다.`,
        facts: { calc: [[`${c}*(${m}/${r}-${m}**2/${r}**2)`, 0], [`${c}*${m}**2/${r}**2`, 1]], check: [chk] } });
    }),
    H('hard-riem-fsq', '함수를 준 합 Σ n/(n + ck)²·f(1 + ck/n)의 극한', '①13 변형(중11)', (d) => {
      const c = d.pick([1, 2, 3]), right = L([Q(1, 1 + c)], [Q(-1, c * (1 + c)), ['ln', 1 + c]]), chk = integ((x) => Math.log(x) / (x * x), 1, 1 + c) / c;
      const fx = nb(V('f') + '(' + X + ') = ' + fn('ln') + ' ' + X), den = '(' + NN + ' + ' + (c === 1 ? '' : c) + KK + ')' + sup(2);
      return pickC(d, `함수 ${fx}에 대하여 다음 극한값은?`, right, [L([Q(1, 1 + c)], [Q(1, c * (1 + c)), ['ln', 1 + c]]), L([Q(1, c)], [-1, ['ln', 1 + c]]), L([Q(c, 1 + c)], [Q(-1, 1 + c), ['ln', 1 + c]]), L([Q(1, c), ['ln', 1 + c]], [-1]), L([Q(1, 1 + c)], [Q(-1, 1 + c), ['ln', 1 + c]])], {
        chk, figure: limN(sumK(frac(NN, den) + V('f') + '(1 + ' + kn(c) + ')')),
        explain: `${nb(frac(NN, den) + ' = ' + frac(1, NN) + ' × ' + frac(1, '(1 + ' + kn(c) + ')' + sup(2)))}이므로 ${nb(V('x') + sub(KK) + ' = 1 + ' + kn(c))}로 보면 극한값은 ${c === 1 ? '' : frac(1, c)}${intg(1, 1 + c, frac(V('f') + '(' + X + ')', X + sup(2)), 'x')} = ${c === 1 ? '' : frac(1, c)}${intg(1, 1 + c, frac(fn('ln') + ' ' + X, X + sup(2)), 'x')}이다. 부분적분하면 ${nb(intg(null, null, frac(fn('ln') + ' ' + X, X + sup(2)), 'x') + ' = ' + MINUS + frac(fn('ln') + ' ' + X + ' + 1', X) + ' + ' + V('C'))}이므로 극한값은 ${lH(right)}이다.`, rule: 'fsq' });
    }),
    H('hard-area-geo', '넓이의 수열과 등비급수', '①20', (d) => {
      const kind = d.pick(['cos', 'sin']), r = kind === 'cos' ? d.pick([Q(1, 3), Q(1, 4), Q(2, 5), Q(3, 5)]) : d.pick([Q(1, 4), Q(2, 5), Q(1, 5)]);
      const each = kind === 'cos' ? Q(1) : Q(2), val = qdiv(qmul(each, r), qsub(Q(1), r));
      const rh = '(' + frac(r.p, r.q) + ')' + sup(NN), endH = kind === 'cos' ? ms('(n - ') + frac(1, 2) + ')π' : NN + 'π', lo = ms('(n - 1)') + 'π';
      const S1 = integ((x) => Math.abs(fl(r) * (kind === 'cos' ? Math.cos(x) : Math.sin(x))), 0, kind === 'cos' ? Math.PI / 2 : Math.PI), S2 = integ((x) => Math.abs(fl(r) ** 2 * (kind === 'cos' ? Math.cos(x) : Math.sin(x))), Math.PI, kind === 'cos' ? 1.5 * Math.PI : 2 * Math.PI);
      if (!close(S1, fl(qmul(each, r))) || !close(S2, fl(qmul(each, qmul(r, r))))) throw new Error('넓이 셈이 다르다');
      return qAns(`자연수 ${NN}에 대하여 닫힌구간 ${iv(lo, endH, '에서')} 곡선 ${jh(yEq(rh + trig(kind, X)), '과/와')} ${X}축${kind === 'cos' ? ' 및 직선 ' + jh(xEq(lo), '으로/로') : '으로'} 둘러싸인 도형의 넓이를 ${V('S') + sub(NN)}이라 할 때, ${sum('n=1', '∞', V('S') + sub(NN))}의 값은?`, val, {
        explain: `${NN}이 홀수이면 이 구간에서 ${nb(trig(kind, X) + ' ≥ 0')}, 짝수이면 ${nb(trig(kind, X) + ' ≤ 0')}이지만 넓이는 어느 쪽이든 ${nb(V('S') + sub(NN) + ' = ' + (kind === 'cos' ? '' : '2') + rh)}이다(한 구간에서 ${intg(0, kind === 'cos' ? frac('π', 2) : 'π', '|' + trig(kind, X) + '|', 'x')} = ${kind === 'cos' ? 1 : 2}이므로). 따라서 ${sum('n=1', '∞', V('S') + sub(NN))}은 첫째항 ${num(qmul(each, r))}, 공비 ${num(r)}인 등비급수의 합 ${num(val)}이다.`,
        facts: { value: `${kind === 'cos' ? 1 : 2}*${js(r)}/(1-${js(r)})`, rule: 'geo' } });
    }),
    H('hard-inv-area', '함수와 그 역함수의 그래프로 둘러싸인 넓이', '①26', (d) => {
      const kind = d.pick(['k1', 'k2', 'h1', 'h2']);
      let k, Eq, f, fh, val, valJs, cuts;
      if (kind === 'k1' || kind === 'k2') { k = d.pick([Q(1, 2), Q(1)]); Eq = kind === 'k1' ? Q(1) : Q(2); f = (x) => x + fl(k) * Math.sin(x); fh = X + ' + ' + (k.p === k.q ? '' : frac(1, 2)) + trig('sin', X); val = qmul(k, Q(kind === 'k1' ? 4 : 8)); valJs = `${kind === 'k1' ? 4 : 8}*${js(k)}`; cuts = kind === 'k1' ? [0, Math.PI] : [0, Math.PI, 2 * Math.PI]; }
      else { Eq = kind === 'h1' ? Q(1, 2) : Q(1); f = (x) => x + 0.5 * Math.sin(2 * x); fh = X + ' + ' + frac(1, 2) + trig('sin', '2' + X); val = Q(kind === 'h1' ? 1 : 2); valJs = kind === 'h1' ? '1' : '2'; cuts = kind === 'h1' ? [0, Math.PI / 2] : [0, Math.PI / 2, Math.PI]; }
      let area = 0; for (let i = 1; i < cuts.length; i += 1) area += 2 * Math.abs(integ((x) => f(x) - x, cuts[i - 1], cuts[i]));
      if (!close(area, fl(val))) throw new Error('넓이 셈이 다르다');
      const E = fl(Eq) * Math.PI, inv = (y) => { let lo = 0, hi = E; for (let i = 0; i < 60; i += 1) { const mid = (lo + hi) / 2; if (f(mid) < y) lo = mid; else hi = mid; } return (lo + hi) / 2; };
      const figure = plot({ x: [-0.3, E + 0.5], y: [-0.3, E + 0.5], u: Math.min(44, 220 / (E + 0.8)), curves: [{ f, from: 0, to: E, name: 'y=f(x)', at: E * 0.3, side: f(E * 0.3) > E * 0.3 ? 'ul' : 'dr' }, { f: inv, from: 0, to: E, name: 'y=g(x)', at: E * 0.72, side: inv(E * 0.72) < E * 0.72 ? 'dr' : 'ul' }], lines: [{ a: 1, b: 0, dash: true, name: 'y=x' }],
        xt: [{ v: E, t: plainPi(Eq) }], yt: [{ v: E, t: plainPi(Eq) }], say: `두 곡선은 직선 y = x에 대하여 대칭이고 ${cuts.length === 2 ? '원점과 x좌표가 ' + plainPi(Eq) + '인 점' : '원점과 x좌표가 ' + plainPi(qdiv(Eq, Q(2))) + ', ' + plainPi(Eq) + '인 점'}에서 만난다.` });
      return qAns(`닫힌구간 ${iv(0, piH(Eq), '에서')} 정의된 함수 ${nb(V('f') + '(' + X + ') = ' + fh)}의 역함수를 ${V('g')}(${X})라 할 때, 두 곡선 ${nb(YY + ' = ' + V('f') + '(' + X + ')')}, ${jh(nb(YY + ' = ' + V('g') + '(' + X + ')'), '으로/로')} 둘러싸인 도형의 넓이는?`, val, {
        figure,
        explain: `${V('f')}(${X})는 증가하고 두 그래프는 직선 ${nb(YY + ' = ' + X)}에 대하여 대칭이므로 교점은 ${nb(V('f') + '(' + X + ') = ' + X)}인 점, 곧 ${kind === 'k1' || kind === 'k2' ? nb(trig('sin', X) + ' = 0') : nb(trig('sin', '2' + X) + ' = 0')}인 ${cuts.length === 2 ? `${X} = 0, ${piH(Eq)}` : `${X} = 0, ${piH(qdiv(Eq, Q(2)))}, ${piH(Eq)}`}이다. 넓이는 곡선 ${jh(nb(YY + ' = ' + V('f') + '(' + X + ')'), '과/와')} 직선 ${nb(YY + ' = ' + X)} 사이 넓이의 2배이므로 ${nb('2 × ')}${intg(0, piH(Eq), '|' + (kind === 'k1' || kind === 'k2' ? (k.p === k.q ? '' : frac(1, 2)) + trig('sin', X) : frac(1, 2) + trig('sin', '2' + X)) + '|', 'x')} = ${num(val)}이다.`,
        facts: { value: valJs, rule: 'invArea' } });
    }),
    H('hard-inv-int', '역함수의 정적분을 넓이로', '①27', (d) => {
      const kind = d.pick(['cos', 'sin']);
      let beta, right, lo, fpH, f0, fH0, wr;
      if (kind === 'cos') {
        const j = d.int(0, 3); beta = Q(2 * j + 1, 2); const s = j % 2 ? -1 : 1;            // f(x) = x + cos x, f(0) = 1, sin β = s
        right = L([Q((2 * j + 1) ** 2, 8), ['pi', 2]], [-s]); lo = 1; fpH = '1 ' + MINUS + ' ' + trig('sin', X); f0 = 1; fH0 = X + ' + ' + trig('cos', X);
        wr = [L([Q((2 * j + 1) ** 2, 8), ['pi', 2]], [s]), L([Q((2 * j + 1) ** 2, 4), ['pi', 2]], [-s]), L([Q((2 * j + 1) ** 2, 8), ['pi', 2]]), L([Q((2 * j + 1) ** 2, 4), ['pi', 2]], [-1 - s]), L([Q((2 * j + 1) ** 2, 8), ['pi', 2]], [-1 - s])];
      } else {
        const kk = d.int(1, 3); beta = Q(kk); const c2 = kk % 2 ? 2 : 0;                     // f(x) = x + sin x, f(0) = 0
        right = L([Q(kk * kk, 2), ['pi', 2]], [-c2]); lo = 0; fpH = '1 + ' + trig('cos', X); f0 = 0; fH0 = X + ' + ' + trig('sin', X);
        wr = [L([Q(kk * kk, 2), ['pi', 2]], [c2 || 2]), L([kk * kk, ['pi', 2]], [-c2]), L([Q(kk * kk, 2), ['pi', 2]], [-c2 - 2]), L([kk * kk, ['pi', 2]], [-c2 - 2]), L([Q(kk * kk, 4), ['pi', 2]], [-c2])];
      }
      const bv = fl(beta) * Math.PI, fp = kind === 'cos' ? (x) => 1 - Math.sin(x) : (x) => 1 + Math.cos(x), chk = integ((x) => x * fp(x), 0, bv);   // ∫ g(y)dy = ∫ x f′(x) dx (y = f(x))
      return pickC(d, `미분가능한 함수 ${V('f')}(${X})에 대하여 ${nb(V('f') + '′(' + X + ') = ' + fpH)}이고 ${nb(V('f') + '(0) = ' + f0)}이다. 함수 ${V('f')}(${X})의 역함수를 ${V('g')}(${X})라 할 때, ${intg(lo, piH(beta), V('g') + '(' + X + ')', 'x')}의 값은?`, right, wr, {
        chk, explain: `${nb(V('f') + '(' + X + ') = ' + fH0)}이고 ${nb(V('f') + '′(' + X + ') ≥ 0')}이라 ${V('f')}는 증가한다. ${nb(V('f') + '(0) = ' + f0)}, ${nb(V('f') + '(' + piH(beta) + ') = ' + piH(beta))}이므로 ${nb(V('g') + '(' + lo + ') = 0')}, ${nb(V('g') + '(' + piH(beta) + ') = ' + piH(beta))}이다. 그래프의 대칭으로 ${intg(lo, piH(beta), V('g') + '(' + X + ')', 'x')} = ${nb('(' + piH(beta) + ')' + sup(2) + (lo ? ' ' + MINUS + ' ' + lo + ' × 0' : ''))} ${MINUS} ${intg(0, piH(beta), '(' + fH0 + ')', 'x')} = ${lH(right)}이다.`, rule: 'invInt' });
    }),
    H('hard-equal-ab', '두 넓이가 같을 때 상수 구하기', '①28', (d, n) => {
      if (n === 0) {
        const m = d.pick([3, 6, 9]), c = d.pick([1, 2]);
        const right = c === 1 ? L([1, ['e', 1]], [m / 3 - 1]) : L([Q(1, 2), ['e', 2]], [qadd(Q(-1, 2), Q(4 * m, 3))]), kv = lnum(right);
        const F = (x) => Math.exp(x) + m * x * x - kv;
        if (!(F(0) < 0 && F(c) > 0) || !close(integ(F, 0, c), 0)) throw new Error('A = B 셈이 다르다');
        const wr = c === 1 ? [L([1, ['e', 1]], [m / 3]), L([1, ['e', 1]], [m - 1]), L([1, ['e', 1]], [m / 3 - 2]), L([1, ['e', 1]], [m / 3 + 1])] : [L([1, ['e', 2]], [qadd(Q(-1), Q(8 * m, 3))]), L([Q(1, 2), ['e', 2]], [Q(4 * m, 3)]), L([Q(1, 2), ['e', 2]], [qadd(Q(-1, 2), Q(2 * m, 3))]), L([Q(1, 2), ['e', 2]], [qadd(Q(1, 2), Q(4 * m, 3))])];
        const g = MINUS + m + X + sup(2) + ' + ' + V('k');
        return pickC(d, `실수 ${V('k')}에 대하여 두 곡선 ${yEq(V('e') + sup(X))}, ${jh(yEq(g), '과/와')} ${YY}축으로 둘러싸인 도형의 넓이를 ${V('A')}, 두 곡선 ${yEq(V('e') + sup(X))}, ${jh(yEq(g), '과/와')} 직선 ${jh(xEq(c), '으로/로')} 둘러싸인 도형의 넓이를 ${V('B')}라 하자. ${nb(V('A') + ' = ' + V('B'))}일 때, ${V('k')}의 값은? ${nb('(단, ' + V('k') + ' &gt; 1)')}`.replace(V('A'), 'A').replace(V('B'), 'B').replace(nb(V('A') + ' = ' + V('B')), nb('A = B')), right, wr, {
          chk: kv, explain: `두 곡선의 교점의 ${X}좌표를 ${V('α')}라 하면 ${nb('A = ' + intg(0, 'α', '(' + g + ' ' + MINUS + ' ' + V('e') + sup(X) + ')', 'x'))}, ${nb('B = ' + intg('α', c, '(' + V('e') + sup(X) + ' + ' + m + X + sup(2) + ' ' + MINUS + ' ' + V('k') + ')', 'x'))}이다. A = B이면 ${intg(0, c, '(' + V('e') + sup(X) + ' + ' + m + X + sup(2) + ' ' + MINUS + ' ' + V('k') + ')', 'x')} = 0이므로 교점을 구하지 않아도 ${nb(V('k') + ' = ')}${lH(right)}이다.`, rule: 'eqab0' });
      }
      const c = d.pick([1, 2, 3]), ec = Math.exp(c), a = (c + 1 - Math.exp(-c)) / (ec - 1);
      if (!(a > 0 && a < 2 && a * ec > Math.exp(-c) + 1)) throw new Error('교점 조건');
      const F = (x) => a * Math.exp(x) - Math.exp(-x) - 1;
      if (!close(integ(F, 0, c), 0)) throw new Error('A = B 셈이 다르다');
      const emc = V('e') + sup(MINUS + c), ecH = eH(Q(c)), den = ecH + ' ' + MINUS + ' 1';
      const list = [{ h: frac(`${c + 1} ${MINUS} ${emc}`, den), v: a }, { h: frac(`${c + 1} + ${emc}`, den), v: (c + 1 + Math.exp(-c)) / (ec - 1) }, { h: frac(`${c + 1} ${MINUS} ${emc}`, ecH + ' + 1'), v: (c + 1 - Math.exp(-c)) / (ec + 1) }, { h: frac(`${c} ${MINUS} ${emc}`, den), v: (c - Math.exp(-c)) / (ec - 1) }, { h: frac(`${c + 2} ${MINUS} ${emc}`, den), v: (c + 2 - Math.exp(-c)) / (ec - 1) }, { h: frac(`${c + 1} ${MINUS} ${emc}`, ecH), v: (c + 1 - Math.exp(-c)) / ec }];
      // 교점(그림에 칠할 두 부분의 경계)
      let lo = 0, hi = c; for (let i = 0; i < 60; i += 1) { const mid = (lo + hi) / 2; if (F(mid) < 0) lo = mid; else hi = mid; }
      const x0 = (lo + hi) / 2, top = Math.max(a * ec, 2) + 0.6;
      const figure = plot({ x: [-0.4, c + 0.6], y: [-0.3, top], u: Math.min(44, 210 / (c + 1)), ys: Math.min(1, 170 / (top * Math.min(44, 210 / (c + 1)))), xt: [c],
        curves: [{ f: (x) => a * Math.exp(x), from: -0.3, to: Math.log(top / a) - 0.02, name: 'y=ae^x' }, { f: (x) => Math.exp(-x) + 1, from: -0.3, to: c + 0.5, name: 'y=e^{-x}+1', side: 'ur' }],
        segs: [{ p: [c, 0], q: [c, a * ec], dash: true }], fill: [{ f: (x) => Math.exp(-x) + 1, g: (x) => a * Math.exp(x), from: 0, to: x0 }, { f: (x) => a * Math.exp(x), g: (x) => Math.exp(-x) + 1, from: x0, to: c, color: 'rgba(234,88,12,0.22)' }],
        texts: [{ x: x0 * 0.35, y: (a + 2) / 2 + 0.05, t: 'A', side: 'r' }, { x: x0 + (c - x0) * 0.55, y: (a * Math.exp(x0 + (c - x0) * 0.75) + Math.exp(-(x0 + (c - x0) * 0.75)) + 1) / 2, t: 'B', side: 'r' }],
        say: `y축과 두 곡선 사이의 부분 A, 두 곡선과 직선 x = ${c} 사이의 부분 B를 칠했다.` });
      return pickRaw(d, `두 곡선 ${yEq(V('a') + V('e') + sup(X))}, ${jh(yEq(V('e') + sup(MINUS + X) + ' + 1'), '과/와')} ${YY}축으로 둘러싸인 도형의 넓이를 A, 두 곡선과 직선 ${jh(xEq(c), '으로/로')} 둘러싸인 도형의 넓이를 B라 하자. ${nb('A = B')}일 때, 상수 ${V('a')}의 값은? ${nb('(단, 0 &lt; ' + V('a') + ' &lt; 2)')}`, list, {
        chk: a, figure, explain: `A = B이면 ${intg(0, c, '(' + V('a') + V('e') + sup(X) + ' ' + MINUS + ' ' + V('e') + sup(MINUS + X) + ' ' + MINUS + ' 1)', 'x')} = 0이다. ${nb(V('a') + '(' + den + ') + ' + emc + ' ' + MINUS + ' 1 ' + MINUS + ' ' + c + ' = 0')}에서 ${nb(V('a') + ' = ')}${list[0].h}이다.`, rule: 'eqab1' });
    }, { count: 2 }),
    H('hard-vbase-trig', '단면이 정사각형인 입체 — 삼각함수 식을 고쳐 치환', '②6', (d) => {
      const c = d.pick([1, 2, 3]), Eq = d.pick([Q(1, 3), Q(1, 4)]);
      const part = Eq.q === 3 ? lq(Q(4, 3)) : L([Q(2, 3)], [Q(-1, 3), ['rt', 2]]), xpart = L([Q(c, 2 * Eq.q * Eq.q), ['pi', 2]]), right = ladd(part, xpart);
      const chk = integ((x) => Math.tan(x) ** 3 / Math.cos(x) + c * x, 0, fl(Eq) * Math.PI);
      const inner = trig('sec', X) + ' ' + trig('tan', X, 3) + ' + ' + (c === 1 ? '' : c) + X;
      const wrongPart = Eq.q === 3 ? lq(Q(7, 3)) : L([Q(2, 3), ['rt', 2]], [Q(-1, 3)]);
      return pickC(d, `곡선 ${nb(YY + ' = ' + rt(inner))} ${nb('(0 ≤ ' + X + ' ≤ ' + piH(Eq) + ')')}와 ${X}축 및 직선 ${jh(xEq(piH(Eq)), '으로/로')} 둘러싸인 도형을 밑면으로 하는 입체도형이 있다. 이 입체도형을 ${X}축에 수직인 평면으로 자른 단면이 모두 정사각형일 때, 이 입체도형의 부피는?`, right, [ladd(wrongPart, xpart), ladd(part, lsc(xpart, 2)), ladd(lneg(part), xpart), part, ladd(part, L([Q(c, Eq.q * Eq.q), ['pi', 1]]))], {
        chk, explain: `단면의 넓이는 ${inner}이다. ${nb(trig('tan', X, 2) + ' = ' + trig('sec', X, 2) + ' ' + MINUS + ' 1')}이므로 ${nb(trig('sec', X) + ' ' + trig('tan', X, 3) + ' = (' + trig('sec', X, 2) + ' ' + MINUS + ' 1)' + trig('sec', X) + ' ' + trig('tan', X))}이고, ${nb(trig('sec', X) + ' = ' + V('t'))}로 치환하면 ${intg(1, Eq.q === 3 ? 2 : rt(2), '(' + V('t') + sup(2) + ' ' + MINUS + ' 1)', 't')} = ${lH(part)}이다. ${intg(0, piH(Eq), (c === 1 ? '' : c) + X, 'x')} = ${lH(xpart)}이므로 부피는 ${lH(right)}이다.`, rule: 'vtrig' });
    }),
    H('hard-vbase-diff', '두 입체의 부피의 차로 자연수 구하기', '②7', (d) => {
      const [b, j] = d.pick([[2, 1], [4, 2], [8, 3]]), k = d.pick([3, 4, 5]), A = (b - 1) * k * (k - 2), p = 2 * k * b * j;
      const chk = integ((x) => (Math.log(x) + k) ** 2 - Math.log(x) ** 2, 1, b);
      if (!close(A + p * Math.LN2, chk)) throw new Error('부피의 차 셈이 다르다');
      const A1 = 'A' + sub(1), A2 = 'A' + sub(2);
      return M(`곡선 ${nb(YY + ' = ' + fn('ln') + ' ' + X)} ${nb('(1 ≤ ' + X + ' ≤ ' + b + ')')}와 ${X}축 및 직선 ${jh(xEq(b), '으로/로')} 둘러싸인 도형을 밑면으로 하는 입체도형 ${A1}, 곡선 ${nb(YY + ' = ' + fn('ln') + ' ' + X + ' + ' + V('k'))} ${nb('(1 ≤ ' + X + ' ≤ ' + b + ')')}와 ${X}축 및 두 직선 ${xEq(1)}, ${jh(xEq(b), '으로/로')} 둘러싸인 도형을 밑면으로 하는 입체도형 ${A2}가 있다. 두 입체도형을 ${X}축에 수직인 평면으로 자른 단면이 모두 정사각형이고 ${A2}와 ${A1}의 부피의 차가 ${nb(A + ' + ' + V('p') + ' ' + fn('ln') + ' 2')}일 때, 자연수 ${V('k')}, ${V('p')}의 값은?`, [{ label: V('k'), answer: k }, { label: V('p'), answer: p }], {
        explain: `부피의 차는 ${intg(1, b, '{(' + fn('ln') + ' ' + X + ' + ' + V('k') + ')' + sup(2) + ' ' + MINUS + ' (' + fn('ln') + ' ' + X + ')' + sup(2) + '}', 'x')} = ${intg(1, b, '(2' + V('k') + ' ' + fn('ln') + ' ' + X + ' + ' + V('k') + sup(2) + ')', 'x')} = ${nb(2 * b * j + V('k') + ' ' + fn('ln') + ' 2 + ' + (b - 1) + V('k') + sup(2) + ' ' + MINUS + ' ' + 2 * (b - 1) + V('k'))}이다. 유리수 부분에서 ${nb((b - 1) + V('k') + sup(2) + ' ' + MINUS + ' ' + 2 * (b - 1) + V('k') + ' = ' + A)}, ${nb(V('k') + ' = ' + k)}이고 ${nb(V('p') + ' = ' + 2 * b * j + ' × ' + k + ' = ' + p)}이다.`,
        facts: { calc: [[`1+(1+${A}/(${b}-1))**(1/2)`, 0], [`2*${b}*${j}*(1+(1+${A}/(${b}-1))**(1/2))`, 1]], check: [chk] } });
    }),
    H('hard-vol-wedge', '원기둥을 비스듬히 자른 입체의 부피 — 단면이 직각삼각형', '②10', (d) => {
      const r = d.pick([2, 3, 4, 6]), th = d.pick([30, 45, 60]), tanL = th === 30 ? L([Q(1, 3), ['rt', 3]]) : th === 45 ? lq(1) : L([1, ['rt', 3]]), tv = Math.tan(th * Math.PI / 180);
      const h = Math.ceil(r * tv) + d.int(1, 2), right = lsc(tanL, Q(2 * r ** 3, 3)), chk = integ((x) => 0.5 * (r * r - x * x) * tv, -r, r);
      return pickC(d, `밑면의 반지름의 길이가 ${r}이고 높이가 ${h}인 원기둥을 밑면의 지름을 지나고 밑면과 이루는 각의 크기가 ${th}°인 평면으로 자를 때 생기는 두 입체도형 중에서 부피가 작은 것을 ${V('T')}라 하자. 도형 ${V('T')}를 밑면의 그 지름에 수직인 평면으로 자를 때 생기는 단면은 한 내각의 크기가 ${th}°인 직각삼각형이다. 도형 ${V('T')}의 부피는?`, right, [lsc(tanL, Q(r ** 3, 3)), lsc(tanL, Q(4 * r ** 3, 3)), lsc(tanL, Q(r ** 3, 1)), lsc(th === 60 ? L([Q(1, 3), ['rt', 3]]) : th === 30 ? L([1, ['rt', 3]]) : lq(2), Q(2 * r ** 3, 3)), lsc(tanL, Q(2 * r * r, 3))], {
        chk, explain: `밑면의 중심을 원점, 그 지름을 ${X}축으로 잡으면 ${X}에서의 단면은 밑변이 ${nb(rt(r * r + ' ' + MINUS + ' ' + X + sup(2)))}, 높이가 ${nb(rt(r * r + ' ' + MINUS + ' ' + X + sup(2)) + ' × tan ' + th + '°')}인 직각삼각형이다. 넓이는 ${nb(frac(1, 2) + '(' + r * r + ' ' + MINUS + ' ' + X + sup(2) + ') tan ' + th + '°')}이므로 부피는 ${intg(-r, r, frac(1, 2) + '(' + r * r + ' ' + MINUS + ' ' + X + sup(2) + ') tan ' + th + '°', 'x')} = ${lH(right)}이다.`, rule: 'wedge' });
    }),
    H('hard-arc-rel', '두 구간의 곡선의 길이 사이의 관계로 끝 구하기', '②23', (d, n) => {
      if (n === 0) {
        const m = d.pick([4, 5, 6, 7]), a2 = Q(3 * (m - 2), 16 - 2 * m), [u, w] = sqParts(a2.p * a2.q), right = L([Q(u, a2.q), ['rt', w]]), av = lnum(right);
        const f = (x) => (2 / 3) * (x * x + 1) ** 1.5, len = (a) => integ((x) => Math.sqrt(1 + dnum(f, x) ** 2), 0, a);
        if (!close(m * len(av), len(2 * av))) throw new Error('길이 관계 셈이 다르다');
        const others = [4, 5, 6, 7].filter((x) => x !== m).map((x) => { const q = Q(3 * (x - 2), 16 - 2 * x), [u2, w2] = sqParts(q.p * q.q); return L([Q(u2, q.q), ['rt', w2]]); });
        return pickC(d, `양수 ${V('a')}와 곡선 ${nb(YY + ' = ' + frac(2, 3) + '(' + X + sup(2) + ' + 1)' + rt(X + sup(2) + ' + 1'))}에 대하여 ${nb('0 ≤ ' + X + ' ≤ ' + V('a'))}에서의 곡선의 길이의 ${m}배는 ${nb('0 ≤ ' + X + ' ≤ 2' + V('a'))}에서의 곡선의 길이와 같다. ${V('a')}의 값은?`, right, others.concat([lq(a2)]), {
          chk: av, explain: `${nb(V('f') + '′(' + X + ') = 2' + X + rt(X + sup(2) + ' + 1'))}이므로 ${nb('1 + {' + V('f') + '′(' + X + ')}' + sup(2) + ' = (2' + X + sup(2) + ' + 1)' + sup(2))}이고 ${nb('0 ≤ ' + X + ' ≤ ' + V('t'))}에서의 길이는 ${nb(frac(2, 3) + V('t') + sup(3) + ' + ' + V('t'))}이다. ${nb(m + '(' + frac(2, 3) + V('a') + sup(3) + ' + ' + V('a') + ') = ' + frac(16, 3) + V('a') + sup(3) + ' + 2' + V('a'))}에서 ${nb(V('a') + sup(2) + ' = ' + num(a2))}, ${nb(V('a') + ' = ')}${lH(right)}이다.`, rule: 'rel0' });
      }
      const m = d.pick([1, 2, 3, 6]), base = qadd(Q(1), Q(7, m + 1)), sq = qmul(base, base), right = L([4, ['cr', sq]], [-4]), av = lnum(right);
      const f = (x) => x ** 1.5 / 3, len = (a, b) => integ((x) => Math.sqrt(1 + dnum(f, Math.max(x, 2e-6)) ** 2), a, b);
      if (!close(m * len(0, av), len(av, 12))) throw new Error('길이 관계 셈이 다르다');
      const others = [1, 2, 3, 6].filter((x) => x !== m).map((x) => { const bq = qadd(Q(1), Q(7, x + 1)); return L([4, ['cr', qmul(bq, bq)]], [-4]); });
      return pickC(d, `곡선 ${nb(YY + ' = ' + frac(1, 3) + X + rt(X))} ${nb('(0 ≤ ' + X + ' ≤ 12)')}에 대하여 ${xEq(0)}에서 ${nb(X + ' = ' + V('a'))}까지 곡선의 길이를 ${V('l') + sub(1)}, ${nb(X + ' = ' + V('a'))}에서 ${nb(X + ' = 12')}까지 곡선의 길이를 ${V('l') + sub(2)}라 하자. ${nb((m === 1 ? '' : m) + V('l') + sub(1) + ' = ' + V('l') + sub(2))}일 때, 실수 ${V('a')}의 값은? ${nb('(단, 0 &lt; ' + V('a') + ' &lt; 12)')}`, right, others.concat([L([4, ['cr', qmul(Q(10, 3), Q(10, 1))]], [-4]), L([4, ['cr', sq]]), L([1, ['cr', sq]], [-1])]), {
        chk: av, explain: `${nb(V('f') + '′(' + X + ') = ' + frac(1, 2) + rt(X))}이므로 길이는 ${intg(0, V('t'), rt('1 + ' + frac(X, 4)), 'x')} = ${nb(frac(8, 3) + '{(1 + ' + frac(V('t'), 4) + ')' + rt('1 + ' + frac(V('t'), 4)) + ' ' + MINUS + ' 1}')}이고, 전체 길이는 ${nb(frac(8, 3) + ' × 7')}이다. ${nb((m + 1) + V('l') + sub(1) + ' = ' + V('l') + sub(1) + ' + ' + V('l') + sub(2))}에서 ${nb('(1 + ' + frac(V('a'), 4) + ')' + rt('1 + ' + frac(V('a'), 4)) + ' = ' + num(base))}이므로 ${nb('1 + ' + frac(V('a'), 4) + ' = ')}${lH(L([1, ['cr', sq]]))}, ${nb(V('a') + ' = ')}${lH(right)}이다.`, rule: 'rel1' });
    }, { count: 2 })
  ];
  // 고르기(보기의 글과 수를 따로 짓는 것): list[0]이 정답 { h, v }.
  function pickRaw(d, text, list, o) {
    if (!close(list[0].v, o.chk)) throw new Error('닫힌 꼴과 수치 셈이 다르다');
    const keep = [];
    for (const it of list) if (Number.isFinite(it.v) && !keep.some((k) => Math.abs(k.v - it.v) <= 1e-4 * Math.max(1, Math.abs(k.v)))) keep.push(it);
    const order = d.shuffle(keep.slice(0, 5)), truth = order.map((it) => close(it.v, o.chk));
    if (truth.filter(Boolean).length !== 1) throw new Error('보기 가운데 답이 하나가 아니다');
    return C(text, order.map((it) => it.h), order.indexOf(list[0]), { figure: o.figure, explain: o.explain, facts: { truth, want: true, check: [o.chk], rule: o.rule } });
  }
  function plainPi(q) { return q.p === 0 ? '0' : (q.p === 1 ? '' : q.p) + 'π' + (q.q === 1 ? '' : '/' + q.q); }
  void S4; void S6; void S7; void rt; void lnH; void ms;
  B.addGroup('11-5-7', { id: 'hard', title: '실력 문제', standard: S5, types: hard.map((t) => Object.assign(t, { standard: ({ 'hard-riem-x2ln': S4, 'hard-riem-lnpow': S4, 'hard-riem-root-e': S4, 'hard-riem-fsq': S4, 'hard-vbase-trig': S6, 'hard-vbase-diff': S6, 'hard-vol-wedge': S6, 'hard-arc-rel': S7 })[t.id] || S5 })) });
})(typeof window !== 'undefined' ? window : globalThis);
