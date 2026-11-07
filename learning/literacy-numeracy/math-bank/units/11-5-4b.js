// 미적분Ⅱ Ⅱ-2 여러 가지 미분법 — 뒤쪽 묶음(매개변수로 나타낸 함수의 미분법, 음함수와 역함수의 미분법, 이계도함수).
// 단원 틀·싣는 기준·뺀 것과 까닭은 11-5-4a.js 머리에 적었다. 도구는 11-5-4a.js 가 내보낸 B.kit.u54x 를 쓴다.
// ref: ②n = 기본꼴_2의 n번.
// 매개변수·음함수의 dy/dx 고르기도 참·거짓을 코드가 가린다: 매개변수는 dy/dt ÷ dx/dt 를, 음함수는 −Fx/Fy 를 수치로 셈해 보기의 식과 여러 점에서 견준다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, frac, inline, C } = B.kit;
  const { MINUS, gcd, Q, V, sup, nz, rt, grp } = B.kit.mid;
  const { ms, fn, lim, jh, plot, rtn, dd } = B.kit.hs;
  const K = B.kit.u54x, nb = K.nb;
  const { S6, S7, T, stripH, X, Y, Tt, Av, Bv, sT, jn, mz, co, L, plus, sf, qT, qJ, yIs, fIs, YP, PI, ND, ND2, near, sec, csc, cot, E, LN, val, slots, pickQ, derivQ, valueQ, choose, R2, R3 } = K;

  // ── 이 파일에서 더 쓰는 도구 ──
  const DYDX = dd('y', 'x');
  // 매개변수 dy/dx 고르기: xt, yt 는 t 의 함수, rows 는 [{ h, g(t) }]. 표본 t 마다 dy/dt ÷ dx/dt(수치)와 견준다.
  const paramQ = (d, text, xt, yt, rows, ts, o) => pickQ(d, text, rows.map((r) => ({ h: r.h, ok: ts.every((t) => near(r.g(t), ND(yt, t) / ND(xt, t))) })), o);
  // 음함수 dy/dx 고르기: F(x, y) 의 음함수 표현에서 −Fx/Fy(수치)와 보기의 식 g(x, y) 를 표본 점마다 견준다.
  const implQ = (d, text, F, rows, pts, o) => pickQ(d, text, rows.map((r) => ({ h: r.h, ok: pts.every(([x, y]) => near(r.g(x, y), -ND((u) => F(u, y), x) / ND((w) => F(x, w), y))) })), o);
  // 「(단, …)」
  const tan = Math.tan, sin = Math.sin, cos = Math.cos;
  const note = (h) => nb('(단, ' + h + ')');
  // 항 하나를 이어 붙이는 ms 원글: tm(3, 'x') → ' + 3x', tm(-1, 'y') → ' - y', tm(0, …) → ''
  const tm = (k, s) => (k === 0 ? '' : (k < 0 ? ' - ' : ' + ') + co(Math.abs(k), s));
  const cst = (k) => (k === 0 ? '' : k < 0 ? ' - ' + -k : ' + ' + k);
  // 부호가 있는 단항 분수 k·(위 글)/(아래 글): k 는 유리수(Q). 위·아래 글은 ms 원글.
  const mf = (k, top, bot) => { const s = k.p < 0 ? MINUS : '', p = Math.abs(k.p); const t = (p === 1 && top ? '' : p) + (top || ''), b = (k.q === 1 ? '' : k.q) + (bot || ''); return s + (b === '' ? ms(t || '1') : frac(ms(t || '1'), ms(b))); };

  // ════════════════════════════════════════════════════════════════
  // ── 다. 매개변수로 나타낸 함수의 미분법 ──
  const param = [
    T('param-eliminate', '매개변수를 소거해 x, y 사이의 관계식 구하기', '②1', (d) => {
      const p = nz(d, -5, 5), q = nz(d, -4, 4), A = d.bool(), n = A ? d.pick([3, 5]) : 2;
      const xt = A ? (t) => p - t : (t) => t + p, yt = A ? (t) => t ** n : (t) => t * t + q;
      const opt = (h, F) => ({ h: nb(yIs(ms(h))), ok: [-1.3, 0.4, 1.9].every((t) => near(F(xt(t)), yt(t))) });
      const rows = A
        ? [opt('(' + L(-1, p) + ')^' + n, (x) => (p - x) ** n), opt('(' + plus('x', -p) + ')^' + n, (x) => (x - p) ** n), opt('(' + plus('x', p) + ')^' + n, (x) => (x + p) ** n), opt(plus('-x^' + n, p), (x) => p - x ** n), opt('x^' + n + cst(p), (x) => x ** n + p)]
        : [opt('(' + plus('x', -p) + ')^2' + cst(q), (x) => (x - p) ** 2 + q), opt('(' + plus('x', p) + ')^2' + cst(q), (x) => (x + p) ** 2 + q), opt('(' + plus('x', -p) + ')^2' + cst(-q), (x) => (x - p) ** 2 - q), opt('(' + plus('x', -q) + ')^2' + cst(p), (x) => (x - q) ** 2 + p), opt('x^2' + cst(q), (x) => x * x + q)];
      return pickQ(d, `매개변수 ${Tt}로 나타낸 함수 ${nb(ms('x = ' + (A ? L(-1, p, 't') : plus('t', p))))}, ${nb(ms('y = ' + (A ? 't^' + n : plus('t^2', q))))}에서 ${X}와 ${Y} 사이의 관계식은?`, rows, {
        explain: A ? `${nb(ms('x = ' + L(-1, p, 't')))}에서 ${nb(ms('t = ' + L(-1, p)))}이므로 ${nb(ms('y = t^' + n))}에 넣으면 ${rows[0].h}이다.` : `${nb(ms('x = ' + plus('t', p)))}에서 ${nb(ms('t = ' + plus('x', -p)))}이므로 ${rows[0].h}이다.` });
    }, { standard: S6 }),

    T('param-circle', '매개변수를 소거해 원의 방정식 구하기', '②2', (d) => {
      const a = nz(d, -5, 5), b = nz(d, -5, 5), r = d.int(2, 4);
      return inline(`매개변수 ${Tt}로 나타낸 함수 ${nb(ms('x = ' + r + 'cos t' + cst(a)))}, ${nb(ms('y = ' + r + 'sin t' + cst(b)))}에서 ${X}와 ${Y} 사이의 관계식을 ${nb(ms('(x - p)^2 + (y - q)^2 = k'))} 꼴로 나타내시오.`,
        grp('(' + X + ' {0})' + sup(2)) + ' + ' + grp('(' + Y + ' {1})' + sup(2)) + ' = {2}', [{ answer: -a, signed: true }, { answer: -b, signed: true }, { answer: r * r }], {
          shown: ms('(' + plus('x', -a) + ')^2 + (' + plus('y', -b) + ')^2 = ' + r * r),
          explain: `${nb(ms('cos t') + ' = ' + frac(ms(plus('x', -a)), r))}, ${nb(ms('sin t') + ' = ' + frac(ms(plus('y', -b)), r))}이고 ${nb(ms('sin^2 t + cos^2 t = 1'))}이므로 ${nb(ms('(' + plus('x', -a) + ')^2 + (' + plus('y', -b) + ')^2 = ' + r * r))}이다.`,
          facts: { calc: [[`0-${jn(a)}`, 0], [`0-${jn(b)}`, 1], [`${r}*${r}`, 2]] } });
    }, { standard: S6 }),

    T('param-formula', '매개변수로 나타낸 함수의 미분법 공식', '②3', (d) => {
      const f = (t) => t * t + 1, g = (t) => t ** 3 + 2 * t, df = (t) => 2 * t, dg = (t) => 3 * t * t + 2, ts = [0.7, 1.3];
      const opt = (h, v) => ({ h, ok: ts.every((t) => near(v(t), dg(t) / df(t))) });
      const rows = [opt(frac(dd('y', 't'), dd('x', 't')), (t) => dg(t) / df(t)), opt(frac(dd('x', 't'), dd('y', 't')), (t) => df(t) / dg(t)), opt(dd('y', 't') + ' × ' + dd('x', 't'), (t) => dg(t) * df(t)),
        opt(dd('y', 't') + ' − ' + dd('x', 't'), (t) => dg(t) - df(t)), opt(frac(ms('g(t)'), ms('f(t)')), (t) => g(t) / f(t))];
      return pickQ(d, `매개변수 ${Tt}로 나타낸 함수 ${nb(ms('x = f(t)'))}, ${nb(ms('y = g(t)'))}가 ${Tt}에 대하여 미분가능하고 ${nb(ms("f'(t) != 0"))}일 때, ${DYDX}와 같은 것은?`, rows, {
        explain: `${Tt}의 증분 Δ${Tt}에 대하여 ${nb(frac('Δ' + Y, 'Δ' + X) + ' = ' + frac('Δ' + Y + '/Δ' + Tt, 'Δ' + X + '/Δ' + Tt))}이고 ${nb('Δ' + Tt + ' → 0')}이면 ${nb(DYDX + ' = ' + frac(dd('y', 't'), dd('x', 't')) + ' = ' + frac(ms("g'(t)"), ms("f'(t)")))}이다.` });
    }, { standard: S6 }),

    // n = 0: x 가 t 의 일차식, y 가 삼차식 — 답이 t 의 다항식, n = 1: x 가 t 의 이차식, y = c/t
    T('param-poly', '매개변수로 나타낸 함수의 dy/dx — 다항식·분수식', '②4', (d, n) => {
      if (n === 0) {
        const a = d.pick([1, 2, 3, -1, -2, -3]), P = nz(d, -4, 4), R = nz(d, -6, 6), h = d.int(-3, 3);
        if ((a * P) % 3 !== 0) return null;
        const c3 = a * P / 3, e1 = a * R, b = nz(d, -5, 5);
        const xt = (t) => a * t + b, yt = (t) => c3 * t ** 3 + e1 * t + h;
        const opt = (src, g) => ({ h: ms(src), g });
        const rows = [opt(co(P, 't^2') + cst(R), (t) => P * t * t + R), opt(co(a * P, 't^2') + cst(a * R), (t) => a * (P * t * t + R)), opt(co(-P, 't^2') + cst(-R), (t) => -(P * t * t + R)),
          opt(co(P, 't^2') + tm(R, 't'), (t) => P * t * t + R * t), opt(co(3 * P, 't^2') + cst(R), (t) => 3 * P * t * t + R)];
        return paramQ(d, `매개변수 ${Tt}로 나타낸 함수 ${nb(ms('x = ' + L(a, b, 't')))}, ${nb(ms('y = ' + co(c3, 't^3') + tm(e1, 't') + cst(h)))}에서 ${DYDX}는?`, xt, yt, rows, [-1.1, 0.6, 1.7], {
          explain: `${nb(dd('x', 't') + ' = ' + sT(a))}, ${nb(dd('y', 't') + ' = ' + ms(co(3 * c3, 't^2') + cst(e1)))}이므로 ${nb(DYDX + ' = ' + frac(ms(co(3 * c3, 't^2') + cst(e1)), sT(a)) + ' = ' + ms(co(P, 't^2') + cst(R)))}이다.` });
      }
      const a = d.pick([1, 2, 3, -1, -2]), b = d.int(-3, 4), c = d.pick([1, 2, 3, -1, -2, -3]);
      const xt = (t) => a * t * t + b, yt = (t) => c / t;
      const k = Q(-c, 2 * a);
      const rows = [{ h: mf(k, '', 't^3'), g: (t) => (-c / (2 * a)) / t ** 3 }, { h: mf(Q(c, 2 * a), '', 't^3'), g: (t) => (c / (2 * a)) / t ** 3 }, { h: mf(k, '', 't^2'), g: (t) => (-c / (2 * a)) / t ** 2 },
        { h: mf(Q(-2 * a, c), 't^3', ''), g: (t) => (-2 * a / c) * t ** 3 }, { h: mf(Q(-c, a), '', 't^3'), g: (t) => (-c / a) / t ** 3 }];
      return paramQ(d, `매개변수 ${Tt}로 나타낸 함수 ${nb(ms('x = ' + co(a, 't^2') + cst(b)))}, ${nb(yIs(sf(c, 't')))}에서 ${DYDX}는? ${note(ms('t != 0'))}`, xt, yt, rows, [0.6, 1.3, 2.1], {
        explain: `${nb(dd('x', 't') + ' = ' + ms(co(2 * a, 't')))}, ${nb(dd('y', 't') + ' = ' + sf(-c, 't^2'))}이므로 ${nb(DYDX + ' = ' + rows[0].h)}이다.` });
    }, { count: 2, standard: S6 }),

    T('param-trans', '매개변수로 나타낸 함수의 dy/dx — 지수·로그·삼각함수', '②5', (d) => {
      const t = d.pick([
        () => { const a = d.int(1, 3); return { x: a === 1 ? 't - sin t' : a + '(t - sin t)', y: a === 1 ? '1 - cos t' : a + '(1 - cos t)', xt: (s) => a * (s - sin(s)), yt: (s) => a * (1 - cos(s)), ts: [0.5, 1.2, 2.3], extra: note(ms('0 < t < ') + 'π'),
          rows: [['sin t/(1 - cos t)', (s) => sin(s) / (1 - cos(s))], ['(1 - cos t)/sin t', (s) => (1 - cos(s)) / sin(s)], ['sin t/(1 + cos t)', (s) => sin(s) / (1 + cos(s))], ['-sin t/(1 - cos t)', (s) => -sin(s) / (1 - cos(s))], ['cos t/(1 - cos t)', (s) => cos(s) / (1 - cos(s))]],
          why: `${nb(dd('x', 't') + ' = ' + ms(a === 1 ? '1 - cos t' : a + '(1 - cos t)'))}, ${nb(dd('y', 't') + ' = ' + ms(co(a, 'sin t')))}` }; },
        () => { const a = d.int(1, 3); return { x: co(a, 't^2'), y: 't ln t', xt: (s) => a * s * s, yt: (s) => s * LN(s), ts: [0.6, 1.4, 2.5], extra: '',
          rows: [['(ln t + 1)/(' + co(2 * a, 't') + ')', (s) => (LN(s) + 1) / (2 * a * s)], ['(' + co(2 * a, 't') + ')/(ln t + 1)', (s) => 2 * a * s / (LN(s) + 1)], ['ln t/(' + co(2 * a, 't') + ')', (s) => LN(s) / (2 * a * s)], ['(ln t - 1)/(' + co(2 * a, 't') + ')', (s) => (LN(s) - 1) / (2 * a * s)], ['(ln t + 1)/(' + co(a, 't') + ')', (s) => (LN(s) + 1) / (a * s)]],
          why: `${nb(dd('x', 't') + ' = ' + ms(co(2 * a, 't')))}, ${nb(dd('y', 't') + ' = ' + ms('ln t + 1'))}` }; },
        () => { const a = d.int(2, 3); return { x: co(a, 't') + ' + sin t', y: 't + cos t', xt: (s) => a * s + sin(s), yt: (s) => s + cos(s), ts: [0.4, 1.1, 2.2], extra: '',
          rows: [['(1 - sin t)/(' + a + ' + cos t)', (s) => (1 - sin(s)) / (a + cos(s))], ['(' + a + ' + cos t)/(1 - sin t)', (s) => (a + cos(s)) / (1 - sin(s))], ['(1 + sin t)/(' + a + ' + cos t)', (s) => (1 + sin(s)) / (a + cos(s))], ['(1 - sin t)/(' + a + ' - cos t)', (s) => (1 - sin(s)) / (a - cos(s))], ['(1 - cos t)/(' + a + ' + sin t)', (s) => (1 - cos(s)) / (a + sin(s))]],
          why: `${nb(dd('x', 't') + ' = ' + ms(a + ' + cos t'))}, ${nb(dd('y', 't') + ' = ' + ms('1 - sin t'))}` }; },
        () => { const a = d.pick([1, 2, 3]), b = a * d.pick([2, 3]), c = d.int(1, 3), k = b / a, ex = (m) => 'e^{' + co(m, 't') + cst(c) + '}'; return { x: co(a, 'e^t'), y: ex(b), xt: (s) => a * E ** s, yt: (s) => E ** (b * s + c), ts: [-0.4, 0.2, 0.7], extra: '',
          rows: [[co(k, ex(b - 1)), (s) => k * E ** ((b - 1) * s + c)], [co(k, ex(b)), (s) => k * E ** (b * s + c)], [co(k, ex(b + 1)), (s) => k * E ** ((b + 1) * s + c)], [co(b, ex(b - 1)), (s) => b * E ** ((b - 1) * s + c)], [co(k + 1, ex(b - 1)), (s) => (k + 1) * E ** ((b - 1) * s + c)]],
          why: `${nb(dd('x', 't') + ' = ' + ms(co(a, 'e^t')))}, ${nb(dd('y', 't') + ' = ' + ms(co(b, ex(b))))}` }; }
      ])();
      const show = (s) => { const m = /^(-?)\((.*)\)\/\((.*)\)$/.exec(s) || /^(-?)(.*?)\/\((.*)\)$/.exec(s) || /^(-?)\((.*)\)\/(.*)$/.exec(s); return m ? (m[1] ? MINUS : '') + frac(ms(m[2]), ms(m[3])) : ms(s); };
      return paramQ(d, `매개변수 ${Tt}로 나타낸 함수 ${nb(ms('x = ' + t.x))}, ${nb(ms('y = ' + t.y))}에서 ${DYDX}를 구한 것은? ${t.extra}`, t.xt, t.yt, t.rows.map(([h, g]) => ({ h: show(h), g })), t.ts, {
        explain: `${t.why}이므로 ${nb(DYDX + ' = ' + show(t.rows[0][0]))}이다.` });
    }, { standard: S6 }),

    // n = 0: 대수식 매개변수, n = 1: 지수·로그 매개변수 — t 를 준 dy/dx 의 값
    T('param-value', '매개변수로 나타낸 함수에서 t를 준 dy/dx의 값', '②6', (d, n) => {
      if (n === 0) {
        if (d.bool()) {
          const p = d.int(1, 2), t0 = p + d.int(1, 2), c = d.int(1, 4), ans = Q(-1, 2 * t0 * (t0 - p) ** 2);
          return val(`매개변수 ${Tt}로 나타낸 함수 ${nb(ms('x = ' + c + ' + t^2'))}, ${nb(yIs(frac(1, ms('t - ' + p))))}에서 ${nb(ms('t = ' + t0))}일 때, ${DYDX}의 값은? ${note(ms('t > ' + p))}`, ans, {
            explain: `${nb(dd('x', 't') + ' = ' + ms('2t'))}, ${nb(dd('y', 't') + ' = ' + MINUS + frac(1, ms('(t - ' + p + ')^2')))}이므로 ${nb(DYDX + ' = ' + MINUS + frac(1, ms('2t(t - ' + p + ')^2')))}이고 ${nb(ms('t = ' + t0))}일 때 ${qT(ans)}이다.`,
            value: `-1/(2*${t0}*(${t0}-${p})*(${t0}-${p}))`, derived: [2] });
        }
        const a = d.int(1, 4), s = d.int(1, 3);
        if (2 * s === a) return null;
        const ans = Q(2 * s + a, 2 * s - a), A = co(a, '');
        return val(`매개변수 ${Tt}로 나타낸 함수 ${nb(ms('x = t - ' + A) + rt(Tt))}, ${nb(ms('y = t + ' + A) + rt(Tt))}에서 ${nb(ms('t = ' + s * s))}일 때, ${DYDX}의 값은?`, ans, {
          explain: `${nb(dd('x', 't') + ' = 1 − ' + frac(a, '2' + rt(Tt)))}, ${nb(dd('y', 't') + ' = 1 + ' + frac(a, '2' + rt(Tt)))}이므로 ${nb(DYDX + ' = ' + frac('2' + rt(Tt) + ' + ' + a, '2' + rt(Tt) + ' − ' + a))}이고 ${nb(rt(Tt) + ' = ' + s)}일 때 ${qT(ans)}이다.`,
          value: `(2*${s}+${a})/(2*${s}-${a})`, derived: [2, s] });
      }
      if (d.bool()) {
        const k = d.int(1, 6);
        return val(`매개변수 ${Tt}로 나타낸 함수 ${nb(ms('x = e^t - e^{-t}'))}, ${nb(ms('y = e^{2t}' + tm(k, 't') + ' - e^{-2t}'))}에서 ${nb(ms('t = 0'))}일 때, ${DYDX}의 값은?`, Q(4 + k, 2), {
          explain: `${nb(dd('x', 't') + ' = ' + ms('e^t + e^{-t}'))}, ${nb(dd('y', 't') + ' = ' + ms('2e^{2t} + ' + k + ' + 2e^{-2t}'))}이므로 ${nb(ms('t = 0'))}일 때 ${nb(frac(ms('2 + ' + k + ' + 2'), 2) + ' = ' + qT(Q(4 + k, 2)))}이다.`,
          value: `(2+${k}+2)/2`, derived: [2] });
      }
      const a = d.int(1, 2), t0 = d.int(2, 3), ans = Q(t0 * (1 + t0 * t0), a * (1 - t0 * t0));
      return val(`매개변수 ${Tt}로 나타낸 함수 ${nb(ms('x') + ' = ' + frac(ms(2 * a + 't'), ms('1 + t^2')))}, ${nb(ms('y = ln(1 + t^2)'))}에서 ${nb(ms('t = ' + t0))}일 때, ${DYDX}의 값은?`, ans, {
        explain: `${nb(dd('x', 't') + ' = ' + frac(ms(2 * a + '(1 - t^2)'), ms('(1 + t^2)^2')))}, ${nb(dd('y', 't') + ' = ' + frac(ms('2t'), ms('1 + t^2')))}이므로 ${nb(DYDX + ' = ' + frac(ms('t(1 + t^2)'), ms(co(a, '(1 - t^2)'))))}이고 ${nb(ms('t = ' + t0))}일 때 ${qT(ans)}이다.`,
        value: `${t0}*(1+${t0}*${t0})/(${a}*(1-${t0}*${t0}))` });
    }, { count: 2, standard: S6 }),

    // n = 0: x = (1 − t)/(1 + t), y = t²/(1 + t) — 답은 유리수, n = 1: 삼각·로그 매개변수 — 답에 π·근호
    T('param-slope', '곡선 위의 점에서 dy/dx의 값 — 점에서 t를 먼저 구하기', '②7', (d, n) => {
      if (n === 0) {
        const t0 = d.pick([Q(1, 2), Q(1, 3), Q(2, 1), Q(3, 1), Q(1, 4)]), tv = t0.p / t0.q;
        const x0 = Q(t0.q - t0.p, t0.q + t0.p), y0 = Q(t0.p * t0.p, t0.q * (t0.q + t0.p)), ans = Q(-(t0.p * t0.p + 2 * t0.p * t0.q), 2 * t0.q * t0.q);
        const tJ = `((1-${qJ(x0)})/(1+${qJ(x0)}))`;
        return val(`매개변수 ${Tt}로 나타낸 곡선 ${nb(ms('x') + ' = ' + frac(ms('1 - t'), ms('1 + t')))}, ${nb(ms('y') + ' = ' + frac(ms('t^2'), ms('1 + t')))} 위의 점 ${nb('(' + qT(x0) + ', ' + qT(y0) + ')')}에서의 접선의 기울기는?`, ans, {
          explain: `${nb(frac(ms('1 - t'), ms('1 + t')) + ' = ' + qT(x0))}에서 ${nb(ms('t') + ' = ' + qT(t0))}이다. ${nb(dd('x', 't') + ' = ' + MINUS + frac(2, ms('(1 + t)^2')))}, ${nb(dd('y', 't') + ' = ' + frac(ms('t^2 + 2t'), ms('(1 + t)^2')))}이므로 ${nb(DYDX + ' = ' + MINUS + frac(ms('t^2 + 2t'), 2))}이고 그 값은 ${qT(ans)}이다.`,
          value: `-(${tJ}*${tJ}+2*${tJ})/2`, derived: [2] });
      }
      const pick = d.int(0, 2);
      if (pick === 0) {
        const p = d.int(1, 2), k = d.int(2, 3), t1 = p + k, s = t1 % 2 ? -1 : 1, v = s * k * Math.PI;
        const P1 = (c) => ({ h: c === 0 ? '0' : PI(c, 1), v: c * Math.PI });
        const rows = choose(d, P1(s * k), [P1(-s * k), P1(s), P1(-s), P1(2 * s * k), P1(s * (k + 1))], 4);
        return valueQ(d, `매개변수 ${Tt}로 나타낸 곡선 ${nb(ms('x = ln(t - ' + p + ')'))}, ${nb(ms('y = sin ') + 'π' + Tt)} 위의 점 ${nb(ms('(ln ' + k + ', 0)'))}에서의 접선의 기울기는?`, v, rows, {
          explain: `${nb(ms('ln(t - ' + p + ') = ln ' + k))}에서 ${nb(ms('t = ' + t1))}이다. ${nb(DYDX + ' = ' + frac('π' + ms(' cos ') + 'π' + Tt, frac(1, ms('t - ' + p))) + ' = π' + ms('(t - ' + p + ')cos ') + 'π' + Tt)}이므로 ${nb(ms('t = ' + t1))}일 때 ${rows[0].h}이다.` });
      }
      if (pick === 1) {
        const c = d.int(1, 4), v = c * Math.SQRT2 / 2, R = (k) => ({ h: (k < 0 ? MINUS : '') + (Math.abs(k) % 2 === 0 ? (Math.abs(k) / 2 === 1 ? '' : Math.abs(k) / 2) + R2 : frac((Math.abs(k) === 1 ? '' : Math.abs(k)) + R2, 2)), v: k * Math.SQRT2 / 2 });
        const rows = choose(d, R(c), [R(-c), R(2 * c), { h: qT(Q(c, 2)), v: c / 2 }, { h: frac((c === 1 ? '' : c) + R3, 2), v: c * Math.sqrt(3) / 2 }, { h: String(c), v: c }], 4);
        return valueQ(d, `매개변수 ${Tt}로 나타낸 곡선 ${nb(ms('x = ') + mz('tan t'))}, ${nb(ms('y = ') + mz(co(c, 'sec t')))} 위의 점 ${nb('(1, ' + (c === 1 ? '' : c) + R2 + ')')}에서의 접선의 기울기는? ${note(MINUS + frac('π', 2) + ' &lt; ' + Tt + ' &lt; ' + frac('π', 2))}`, v, rows, {
          explain: `${nb(mz('tan t = 1'))}에서 ${nb(Tt + ' = ' + frac('π', 4))}이다. ${nb(DYDX + ' = ' + frac(mz(co(c, 'sec t tan t')), mz('sec^2 t')) + ' = ' + ms(co(c, 'sin t')))}이므로 ${nb(Tt + ' = ' + frac('π', 4))}일 때 ${rows[0].h}이다.` });
      }
      const ang = d.pick([[1, 2], [1, 3], [2, 3]]), th = ang[0] * Math.PI / ang[1], v = sin(th) / (1 - cos(th));
      const xv = { 2: frac('π', 2) + ' − 1', 3: ang[0] === 1 ? frac('π', 3) + ' − ' + frac(R3, 2) : frac('2π', 3) + ' − ' + frac(R3, 2) }[ang[1]];
      const yv = ang[1] === 2 ? '1' : ang[0] === 1 ? frac(1, 2) : frac(3, 2);
      const pool = [{ h: '1', v: 1 }, { h: MINUS + '1', v: -1 }, { h: R3, v: Math.sqrt(3) }, { h: MINUS + R3, v: -Math.sqrt(3) }, { h: frac(R3, 3), v: Math.sqrt(3) / 3 }, { h: MINUS + frac(R3, 3), v: -Math.sqrt(3) / 3 }, { h: '2', v: 2 }];
      const right = pool.find((c) => near(c.v, v, 1e-9));
      const rows = choose(d, right, pool.filter((c) => c !== right), 4);
      return valueQ(d, `매개변수 ${Tt}로 나타낸 곡선 ${nb(ms('x = t - sin t'))}, ${nb(ms('y = 1 - cos t'))} 위의 점 ${nb('(' + xv + ', ' + yv + ')')}에서의 접선의 기울기는? ${note(ms('0 < t < ') + 'π')}`, v, rows, {
        explain: `${nb(ms('y = 1 - cos t') + ' = ' + yv)}에서 ${nb(Tt + ' = ' + PI(ang[0], ang[1]))}이다. ${nb(DYDX + ' = ' + frac(ms('sin t'), ms('1 - cos t')))}이므로 ${nb(Tt + ' = ' + PI(ang[0], ang[1]))}일 때 ${right.h}이다.` });
    }, { count: 2, standard: S6 }),

    T('param-coef', 'dy/dx의 값으로 상수 구하기', '②8', (d) => {
      const p = d.pick([1, 2, 3, -1, -2, -3]), q = d.int(-4, 5), t0 = d.int(1, 2), a = nz(d, -6, 6);
      if (2 * t0 + a === 0) return null;
      const v = Q(2 * t0 + a, 2 * p * t0);
      return val(`매개변수 ${Tt}로 나타낸 함수 ${nb(ms('x = ' + co(p, 't^2') + cst(q)))}, ${nb(ms('y = t^2 + at'))}에서 ${nb(ms('t = ' + t0))}일 때 ${DYDX}의 값이 ${jh(qT(v), '이/가')} 되도록 하는 상수 ${Av}의 값은?`, a, {
        explain: `${nb(DYDX + ' = ' + frac(ms('2t + a'), ms(co(2 * p, 't'))))}이므로 ${nb(frac(ms((2 * t0) + ' + a'), sT(2 * p * t0)) + ' = ' + qT(v))}에서 ${nb(ms('a = ' + a))}이다.`,
        value: `2*${jn(p)}*${t0}*${qJ(v)}-2*${t0}`, derived: [2] });
    }, { standard: S6 }),

    T('param-abstract', '추상 함수로 준 매개변수의 dy/dx', '②9', (d) => {
      const A = nz(d, -4, 4), Bc = nz(d, -5, 5), Cc = nz(d, -5, 5), Dd = nz(d, -5, 5);
      if (Bc * Cc + A * Dd === 0 || Math.abs(Bc) === 1) return null;
      const ans = Q(Bc * Cc + A * Dd, Bc);
      return val(`미분가능한 두 함수 ${ms('f(t)')}, ${ms('g(t)')}에 대하여 ${nb(ms('f(0) = ' + A))}, ${nb(ms("f'(0) = " + Bc))}, ${nb(ms('g(0) = ' + Cc))}, ${nb(ms("g'(0) = " + Dd))}이다. 매개변수 ${Tt}로 나타낸 함수 ${nb(ms('x = f(t)'))}, ${nb(ms('y = f(t)g(t)'))}에서 ${nb(ms('t = 0'))}일 때, ${DYDX}의 값은?`, ans, {
        explain: `${nb(dd('x', 't') + ' = ' + ms("f'(t)"))}, ${nb(dd('y', 't') + ' = ' + ms("f'(t)g(t) + f(t)g'(t)"))}이므로 ${nb(ms('t = 0'))}일 때 ${nb(DYDX + ' = ' + frac(ms(`${jn(Bc)} × ${jn(Cc)} + ${jn(A)} × ${jn(Dd)}`.replace(/\(-/g, '(-')), sT(Bc)) + ' = ' + qT(ans))}이다.`,
        value: `(${jn(Bc)}*${jn(Cc)}+${jn(A)}*${jn(Dd)})/${jn(Bc)}` });
    }, { standard: S6 }),

    // n = 0: 기울기 t 를 매개변수로 한 원(유리식) — 그림, n = 1: 각 θ 를 매개변수로 한 원
    T('param-circle-slope', '원을 매개변수로 나타냈을 때 점에서의 dy/dx', '②10', (d, n) => {
      if (n === 0) {
        const t0 = d.pick([Q(1, 2), Q(2, 1), Q(1, 3), Q(3, 1), Q(2, 3), Q(3, 2)]), tv = t0.p / t0.q;
        const ans = Q(t0.p * t0.p - t0.q * t0.q, 2 * t0.p * t0.q), px = (1 - tv * tv) / (1 + tv * tv), py = 2 * tv / (1 + tv * tv);
        const figure = plot({ x: [-1.45, 1.45], y: [-1.3, 1.3], u: 82, params: [{ x: (s) => cos(s), y: (s) => sin(s), name: 'x^2+y^2=1', at: 5.6 }],
          lines: [{ a: 0.75, b: 0.75 }], dots: [{ x: -1, y: 0, said: '점 (−1, 0)' }, { x: 0.28, y: 0.96, name: 'P', side: 'ul', said: '원 위의 점 P(x, y)' }], xt: [{ v: 1, t: '1' }], yt: [{ v: 1, t: '1' }, { v: -1, t: '-1' }] });
        return val(`그림과 같이 원 ${nb(ms('x^2 + y^2 = 1'))}과 직선 ${nb(ms('y = t(x + 1)'))}의 두 교점 가운데 점 ${nb('(' + MINUS + '1, 0)')}이 아닌 점 ${nb(ms('P(x, y)'))}의 좌표를 기울기 ${Tt}를 매개변수로 하여 나타내면 ${nb(ms('x') + ' = ' + frac(ms('1 - t^2'), ms('1 + t^2')))}, ${nb(ms('y') + ' = ' + frac(ms('2t'), ms('1 + t^2')))}이다. ${nb(Tt + ' = ' + qT(t0))}일 때 점 P에서의 ${DYDX}의 값은?`, ans, {
          figure,
          explain: `${nb(dd('x', 't') + ' = ' + frac(ms('-4t'), ms('(1 + t^2)^2')))}, ${nb(dd('y', 't') + ' = ' + frac(ms('2 - 2t^2'), ms('(1 + t^2)^2')))}이므로 ${nb(DYDX + ' = ' + frac(ms('t^2 - 1'), ms('2t')))}이고 ${nb(Tt + ' = ' + qT(t0))}일 때 ${qT(ans)}이다.`,
          value: `(${qJ(t0)}*${qJ(t0)}-1)/(2*${qJ(t0)})`, derived: [2] });
      }
      const ang = d.pick([[1, 3], [1, 6], [2, 3], [3, 4], [1, 4], [5, 6]]), th = ang[0] * Math.PI / ang[1], v = -cos(th) / sin(th);
      const pool = [[1, '1'], [Math.sqrt(3), R3], [Math.sqrt(3) / 3, frac(R3, 3)], [2, '2'], [Math.SQRT2 / 2, frac(R2, 2)]].flatMap(([w, h]) => [{ h, v: w }, { h: MINUS + h, v: -w }]);
      const right = pool.find((c) => near(c.v, v, 1e-9));
      const rows = choose(d, right, pool.filter((c) => c !== right && !near(c.v, -1 / v, 1e-9)).concat(pool.filter((c) => near(c.v, -1 / v, 1e-9) && c !== right)), 4);
      return valueQ(d, `원 ${nb(ms('x^2 + y^2 = 1'))} 위의 점 P를 동경이 나타내는 각 ${V('θ')}를 매개변수로 하여 ${nb(ms('x = cos θ'))}, ${nb(ms('y = sin θ'))}로 나타낼 때, ${nb(V('θ') + ' = ' + PI(ang[0], ang[1]))}인 점 P에서의 ${DYDX}의 값은?`, v, rows, {
        explain: `${nb(DYDX + ' = ' + frac(ms('cos θ'), ms('-sin θ')) + ' = ' + MINUS + mz('cot θ'))}이므로 ${nb(V('θ') + ' = ' + PI(ang[0], ang[1]))}일 때 ${right.h}이다.` });
    }, { count: 2, standard: S6 })
  ];

  // ════════════════════════════════════════════════════════════════
  // ── 라. 음함수와 역함수의 미분법 ──
  const implicit = [
    T('imp-form', '함수를 음함수 표현으로 나타내기', '②11', (d) => {
      const a = nz(d, -4, 4), b = nz(d, -5, 5), t = d.int(0, 3);
      const spec = [
        { f: (x) => x * x + a * x + b, src: yIs(ms('x^2' + tm(a, 'x') + cst(b))), right: ['x^2' + tm(a, 'x') + ' - y' + cst(b), (x, y) => x * x + a * x - y + b],
          wrong: [['x^2' + tm(a, 'x') + ' + y' + cst(b), (x, y) => x * x + a * x + y + b], ['x^2' + tm(-a, 'x') + ' - y' + cst(b), (x, y) => x * x - a * x - y + b], ['x^2' + tm(a, 'x') + ' - y' + cst(-b), (x, y) => x * x + a * x - y - b], ['x^2' + tm(a, 'y') + ' - x' + cst(b), (x, y) => x * x + a * y - x + b]] },
        { f: (x) => x / (Math.abs(a) * x - 1), src: yIs(frac(X, ms(co(Math.abs(a), 'x') + ' - 1'))), right: [co(Math.abs(a), 'xy') + ' - x - y', (x, y) => Math.abs(a) * x * y - x - y],
          wrong: [[co(Math.abs(a), 'xy') + ' - x + y', (x, y) => Math.abs(a) * x * y - x + y], [co(Math.abs(a), 'xy') + ' + x - y', (x, y) => Math.abs(a) * x * y + x - y], [co(Math.abs(a), 'x') + ' - xy - 1', (x, y) => Math.abs(a) * x - x * y - 1], [co(Math.abs(a), 'xy') + ' - x - 1', (x, y) => Math.abs(a) * x * y - x - 1]] },
        { f: (x) => x ** 3 - x + b, src: yIs(ms('x^3 - x' + cst(b))), right: ['x^3 - x - y' + cst(b), (x, y) => x ** 3 - x - y + b],
          wrong: [['x^3 - x + y' + cst(b), (x, y) => x ** 3 - x + y + b], ['x^3 + x - y' + cst(b), (x, y) => x ** 3 + x - y + b], ['x^3 - x - y' + cst(-b), (x, y) => x ** 3 - x - y - b], ['x^3 - y' + cst(b), (x, y) => x ** 3 - y + b]] },
        { f: (x) => x * x / (2 * x + Math.abs(b)), src: yIs(frac(ms('x^2'), ms('2x + ' + Math.abs(b)))), right: ['x^2 - 2xy - ' + co(Math.abs(b), 'y'), (x, y) => x * x - 2 * x * y - Math.abs(b) * y],
          wrong: [['x^2 + 2xy - ' + co(Math.abs(b), 'y'), (x, y) => x * x + 2 * x * y - Math.abs(b) * y], ['x^2 - 2xy + ' + co(Math.abs(b), 'y'), (x, y) => x * x - 2 * x * y + Math.abs(b) * y], ['x^2 - 2x - ' + co(Math.abs(b), 'y'), (x, y) => x * x - 2 * x - Math.abs(b) * y], ['x^2 - xy - ' + co(Math.abs(b), 'y'), (x, y) => x * x - x * y - Math.abs(b) * y]] }
      ][t];
      const xs = [2.3, 3.1, 4.7], opt = ([h, F]) => ({ h: nb(ms(h + ' = 0')), ok: xs.every((x) => near(F(x, spec.f(x)), 0, 1e-9)) });
      return pickQ(d, `함수 ${jh(spec.src, '을/를')} 음함수 표현 ${nb(ms('f(x, y) = 0'))} 꼴로 나타낸 것은?`, [opt(spec.right)].concat(spec.wrong.map(opt)), {
        explain: `${Y}를 한쪽으로 옮겨 정리하면 ${nb(ms(spec.right[0] + ' = 0'))}이다.` });
    }, { standard: S7 }),

    // n = 0: axᵖ + byᵠ = c 의 dy/dx 고르기, n = 1: ay² + bx = c 를 x 로 미분한 식의 빈칸
    T('imp-separate', '음함수의 dy/dx — x항과 y항이 따로인 꼴', '②12', (d, n) => {
      if (n === 1) {
        const a = nz(d, -4, 4), b = nz(d, -6, 6), c = d.int(-5, 5);
        return inline(`다음은 음함수 표현 ${nb(ms(co(a, 'y^2') + tm(b, 'x') + ' = ' + c))}에서 ${DYDX}를 구하기 위해 각 항을 ${X}에 대하여 미분한 식이다. 빈칸에 알맞은 수를 차례로 구하시오.`, grp('{0}' + Y + DYDX) + ' ' + grp('{1}') + ' = 0', [{ answer: 2 * a, signed: true }, { answer: b, signed: true }], {
          shown: ms(co(2 * a, 'y')) + DYDX + ' ' + ms(cst(b).trim() || '0') + ' = 0',
          explain: `${nb(frac(V('d'), V('dx')) + ms('(' + co(a, 'y^2') + ')') + ' = ' + ms(co(2 * a, 'y')) + DYDX)}, ${nb(frac(V('d'), V('dx')) + ms('(' + co(b, 'x') + ') = ' + b))}, 상수의 도함수는 0이므로 ${nb(ms(co(2 * a, 'y')) + DYDX + ' ' + ms(cst(b).trim()) + ' = 0')}이다. 따라서 ${nb(DYDX + ' = ' + mf(Q(-b, 2 * a), '', 'y'))}이다.`,
          facts: { calc: [[`2*${jn(a)}`, 0], [`${jn(b)}`, 1]] }, });
      }
      const p = d.pick([2, 3]), q = d.pick([2, 3]), a = nz(d, -3, 3), b = nz(d, -3, 3), c = d.int(-6, 6);
      const F = (x, y) => a * x ** p + b * y ** q - c, k = Q(-a * p, b * q), xm = p === 2 ? 'x' : 'x^2', ym = q === 2 ? 'y' : 'y^2';
      const opt = (h, g) => ({ h, g });
      const rows = [opt(mf(k, xm, ym), (x, y) => (-a * p * x ** (p - 1)) / (b * q * y ** (q - 1))), opt(mf(Q(-k.p, k.q), xm, ym), (x, y) => (a * p * x ** (p - 1)) / (b * q * y ** (q - 1))),
        opt(mf(Q(k.q, -k.p), ym, xm), (x, y) => -(b * q * y ** (q - 1)) / (a * p * x ** (p - 1))), opt(mf(Q(-a, b), xm, ym), (x, y) => (-a * x ** (p - 1)) / (b * y ** (q - 1))), opt(mf(k, p === 2 ? 'x^2' : 'x^3', ym), (x, y) => (-a * p * x ** p) / (b * q * y ** (q - 1)))];
      return implQ(d, `음함수 표현 ${nb(ms(co(a, 'x^' + p) + tm(b, 'y^' + q) + ' = ' + c))}에서 ${DYDX}는? ${note(ms('y != 0'))}`, F, rows, [[0.7, 1.3], [1.6, -0.8], [-1.2, 2.1]], {
        explain: `각 항을 ${X}에 대하여 미분하면 ${nb(ms(co(a * p, xm) + ' ' + (b * q < 0 ? '- ' : '+ ') + co(Math.abs(b * q), ym)) + DYDX + ' = 0')}이므로 ${nb(DYDX + ' = ' + rows[0].h)}이다.` });
    }, { count: 2, standard: S7 }),

    T('imp-product', '음함수의 dy/dx — xy항이 있는 꼴', '②13', (d) => {
      const a = d.pick([1, 2, 3, -1, -2]), c = nz(d, -4, 4), A = d.bool();
      const F = A ? (x, y) => x ** 3 + a * x * y + y ** 3 : (x, y) => a * x * y - y ** 3 + c;
      const opt = (top, bot, g) => ({ h: (top[0] === '-' ? MINUS : '') + frac(ms(top.replace(/^-/, '')), ms(bot)), g });
      const rows = A
        ? [opt('-(3x^2' + tm(a, 'y') + ')', '3y^2' + tm(a, 'x'), (x, y) => -(3 * x * x + a * y) / (a * x + 3 * y * y)), opt('3x^2' + tm(a, 'y'), '3y^2' + tm(a, 'x'), (x, y) => (3 * x * x + a * y) / (a * x + 3 * y * y)),
          opt('-3x^2', '3y^2', (x, y) => -x * x / (y * y)), opt('-(3x^2' + tm(a, 'y') + ')', '3y^2', (x, y) => -(3 * x * x + a * y) / (3 * y * y)), opt('-(3y^2' + tm(a, 'x') + ')', '3x^2' + tm(a, 'y'), (x, y) => -(a * x + 3 * y * y) / (3 * x * x + a * y))]
        : [opt(co(a, 'y'), '3y^2' + tm(-a, 'x'), (x, y) => a * y / (3 * y * y - a * x)), opt(co(-a, 'y'), '3y^2' + tm(-a, 'x'), (x, y) => -a * y / (3 * y * y - a * x)), opt(co(a, 'y'), '3y^2', (x, y) => a * y / (3 * y * y)),
          opt(co(a, 'x'), '3y^2' + tm(-a, 'y'), (x, y) => a * x / (3 * y * y - a * y)), opt('3y^2' + tm(-a, 'x'), co(a, 'y'), (x, y) => (3 * y * y - a * x) / (a * y))];
      return implQ(d, `음함수 표현 ${nb(ms(A ? 'x^3' + tm(a, 'xy') + ' + y^3 = 0' : co(a, 'xy') + ' - y^3' + cst(c) + ' = 0'))}에서 ${DYDX}를 구한 것은? ${note('분모는 0이 아니다.')}`, F, rows, [[0.7, 1.3], [1.6, -0.8], [-1.2, 2.1]], {
        explain: A ? `각 항을 ${X}에 대하여 미분하면 ${nb(ms('3x^2' + tm(a, 'y') + tm(a, 'x')) + DYDX + ' + ' + ms('3y^2') + DYDX + ' = 0')}이므로 ${nb(DYDX + ' = ' + rows[0].h)}이다.`
          : `각 항을 ${X}에 대하여 미분하면 ${nb(ms(co(a, 'y') + tm(a, 'x')) + DYDX + ' − ' + ms('3y^2') + DYDX + ' = 0')}이므로 ${nb(DYDX + ' = ' + rows[0].h)}이다.` });
    }, { standard: S7 }),

    // n = 0: 삼각·로그가 든 음함수의 dy/dx 고르기, n = 1: dy/dx 의 꼴에 맞춰 상수 구하기
    T('imp-trans', '음함수의 dy/dx — 삼각·로그가 든 꼴', '②14', (d, n) => {
      if (n === 1) {
        const p = d.pick([2, 3]), k = nz(d, -4, 4), c = d.int(-5, 5);
        return slots(`음함수 표현 ${nb(ms('x^' + p + ' ln y = ' + co(k, 'y') + cst(c)))}에서 ${nb(DYDX + ' = ' + MINUS + frac(ms('ax' + (p === 2 ? '' : '^' + (p - 1)) + 'y ln y'), ms('x^' + p + ' + by')))}일 때, 상수 ${Av}, ${Bv}의 값을 구하시오.`, `${Av} = {0}, ${Bv} = {1}`, [[p, `${p}`], [-k, `-${jn(k)}`]], {
          shown: `${Av} = ${p}, ${Bv} = ${sT(-k)}`,
          explain: `각 항을 ${X}에 대하여 미분하면 ${nb(ms(p + 'x' + (p === 2 ? '' : '^' + (p - 1)) + ' ln y + x^' + p) + ' × ' + frac(1, Y) + ' × ' + DYDX + ' = ' + sT(k) + DYDX)}이다. 양변에 ${jh(Y, '을/를')} 곱해 정리하면 ${nb(DYDX + ' = ' + MINUS + frac(ms(p + 'x' + (p === 2 ? '' : '^' + (p - 1)) + 'y ln y'), ms('x^' + p + tm(-k, 'y'))))}이므로 ${nb(ms('a = ' + p))}, ${nb(ms('b = ' + (-k)))}이다.` });
      }
      const a = d.int(1, 3), c = d.int(1, 4), h = d.int(1, 3);
      const t = d.pick([
        { F: (x, y) => sin(y) + a * x * y - c, src: 'sin y' + tm(a, 'xy') + ' = ' + c, pts: [[0.4, 0.7], [1.1, 0.3], [-0.6, 1.2]],
          rows: [['-' + co(a, 'y') + '/(' + co(a, 'x') + ' + cos y)', (x, y) => -a * y / (a * x + cos(y))], [co(a, 'y') + '/(' + co(a, 'x') + ' + cos y)', (x, y) => a * y / (a * x + cos(y))], ['-' + co(a, 'y') + '/cos y', (x, y) => -a * y / cos(y)], ['-' + co(a, 'y') + '/(' + co(a, 'x') + ' - cos y)', (x, y) => -a * y / (a * x - cos(y))], ['-(' + co(a, 'x') + ' + cos y)/' + co(a, 'y'), (x, y) => -(a * x + cos(y)) / (a * y)]],
          why: ms('cos y') + DYDX + ' + ' + ms(co(a, 'y') + tm(a, 'x')) + DYDX + ' = 0' },
        { F: (x, y) => cos(y) + a * x * x * y + c, src: 'cos y' + tm(a, 'x^2y') + cst(c) + ' = 0', pts: [[0.4, 0.7], [1.1, 0.3], [-0.6, 1.2]],
          rows: [[co(2 * a, 'xy') + '/(sin y - ' + co(a, 'x^2') + ')', (x, y) => 2 * a * x * y / (sin(y) - a * x * x)], ['-' + co(2 * a, 'xy') + '/(sin y - ' + co(a, 'x^2') + ')', (x, y) => -2 * a * x * y / (sin(y) - a * x * x)], [co(2 * a, 'xy') + '/(sin y + ' + co(a, 'x^2') + ')', (x, y) => 2 * a * x * y / (sin(y) + a * x * x)], [co(2 * a, 'xy') + '/sin y', (x, y) => 2 * a * x * y / sin(y)], [co(a, 'xy') + '/(sin y - ' + co(a, 'x^2') + ')', (x, y) => a * x * y / (sin(y) - a * x * x)]],
          why: ms('-sin y') + DYDX + ' + ' + ms(co(2 * a, 'xy') + tm(a, 'x^2')) + DYDX + ' = 0' },
        { F: (x, y) => cos(y) + a * x - c, src: 'cos y' + tm(a, 'x') + ' = ' + c, pts: [[0.4, 0.7], [1.1, 0.3], [-0.6, 1.2]],
          rows: [[a + '/sin y', (x, y) => a / sin(y)], ['-' + a + '/sin y', (x, y) => -a / sin(y)], [a + '/cos y', (x, y) => a / cos(y)], ['sin y/' + a, (x, y) => sin(y) / a], [co(a, 'sin y'), (x, y) => a * sin(y)]],
          why: ms('-sin y') + DYDX + ' + ' + a + ' = 0' },
        { F: (x, y) => x + 2 * cos(y) + x * y - c, src: 'x + 2cos y + xy = ' + c, pts: [[0.4, 0.7], [1.1, 0.3], [-0.6, 1.2]],
          rows: [['(1 + y)/(2sin y - x)', (x, y) => (1 + y) / (2 * sin(y) - x)], ['-(1 + y)/(2sin y - x)', (x, y) => -(1 + y) / (2 * sin(y) - x)], ['(1 + y)/(2sin y + x)', (x, y) => (1 + y) / (2 * sin(y) + x)], ['(1 - y)/(2sin y - x)', (x, y) => (1 - y) / (2 * sin(y) - x)], ['y/(2sin y - x)', (x, y) => y / (2 * sin(y) - x)]],
          why: '1 − ' + ms('2sin y') + DYDX + ' + ' + Y + ' + ' + X + DYDX + ' = 0' },
        { F: (x, y) => x - LN(y * y - 2 * h * y + h * h + 1), src: 'x - ln(y^2 - ' + 2 * h + 'y + ' + (h * h + 1) + ') = 0', pts: [[0.4, h + 0.7], [1.1, h - 1.3], [-0.6, h + 2.1]],
          rows: [['(y^2 - ' + 2 * h + 'y + ' + (h * h + 1) + ')/(' + co(2, '(y - ' + h + ')') + ')', (x, y) => (y * y - 2 * h * y + h * h + 1) / (2 * (y - h))], ['(' + co(2, '(y - ' + h + ')') + ')/(y^2 - ' + 2 * h + 'y + ' + (h * h + 1) + ')', (x, y) => 2 * (y - h) / (y * y - 2 * h * y + h * h + 1)],
            ['-(y^2 - ' + 2 * h + 'y + ' + (h * h + 1) + ')/(' + co(2, '(y - ' + h + ')') + ')', (x, y) => -(y * y - 2 * h * y + h * h + 1) / (2 * (y - h))], ['(y^2 - ' + 2 * h + 'y + ' + (h * h + 1) + ')/(2y)', (x, y) => (y * y - 2 * h * y + h * h + 1) / (2 * y)], ['1/(' + co(2, '(y - ' + h + ')') + ')', (x, y) => 1 / (2 * (y - h))]],
          why: '1 − ' + frac(ms('2y - ' + 2 * h), ms('y^2 - ' + 2 * h + 'y + ' + (h * h + 1))) + DYDX + ' = 0' },
        { F: (x, y) => x * x + LN(x * x + 1) + c * y * y - 1, src: 'x^2 + ln(x^2 + 1) + ' + co(c, 'y^2') + ' = 1', pts: [[0.4, 0.7], [1.1, -0.5], [-0.6, 1.2]],
          rows: [['-x(x^2 + 2)/(' + co(c, 'y') + '(x^2 + 1))', (x, y) => -x * (x * x + 2) / (c * y * (x * x + 1))], ['x(x^2 + 2)/(' + co(c, 'y') + '(x^2 + 1))', (x, y) => x * (x * x + 2) / (c * y * (x * x + 1))], ['-x(x^2 + 1)/(' + co(c, 'y') + '(x^2 + 2))', (x, y) => -x * (x * x + 1) / (c * y * (x * x + 2))],
            ['-x/(' + co(c, 'y') + ')', (x, y) => -x / (c * y)], ['-x(x^2 + 2)/(' + co(2 * c, 'y') + '(x^2 + 1))', (x, y) => -x * (x * x + 2) / (2 * c * y * (x * x + 1))]],
          why: ms('2x') + ' + ' + frac(ms('2x'), ms('x^2 + 1')) + ' + ' + ms(co(2 * c, 'y')) + DYDX + ' = 0' }
      ]);
      const show = (s) => { const m = /^(-?)(?:\((.*)\)|([^()/]*))\/(?:\((.*)\)|([^()/]*))$/.exec(s); return m ? (m[1] ? MINUS : '') + frac(mz(m[2] || m[3]), mz(m[4] || m[5])) : mz(s); };
      return implQ(d, `음함수 표현 ${nb(ms(t.src))}에서 ${DYDX}를 구한 것은? ${note('분모는 0이 아니다.')}`, t.F, t.rows.map(([hh, g]) => ({ h: show(hh), g })), t.pts, {
        explain: `각 항을 ${X}에 대하여 미분하면 ${nb(t.why)}이므로 ${nb(DYDX + ' = ' + show(t.rows[0][0]))}이다.` });
    }, { count: 2, standard: S7 }),

    T('imp-slope-one', '음함수 곡선의 기울기 조건 하나로 상수 구하기', '②15', (d) => {
      const m = d.pick([2, 3]), n2 = m === 2 ? 3 : 2, a = nz(d, -6, 6), s = Q(m * a, n2);
      return val(`곡선 ${nb(ms('(ax + 1)^' + m + ' - y^' + n2 + ' = 0'))} 위의 점 ${nb('(0, 1)')}에서의 접선의 기울기가 ${qT(s)}일 때, 상수 ${Av}의 값은?`, a, {
        explain: `각 항을 ${X}에 대하여 미분하면 ${nb(ms(co(m, 'a(ax + 1)') + (m === 2 ? '' : '^2') + ' - ' + co(n2, 'y') + (n2 === 2 ? '' : '^2')) + DYDX + ' = 0')}이다. ${nb(ms('x = 0, y = 1'))}을 넣으면 ${nb(DYDX + ' = ' + frac(ms(co(m, 'a')), n2))}이므로 ${nb(frac(ms(co(m, 'a')), n2) + ' = ' + qT(s))}에서 ${nb(ms('a = ' + a))}이다.`,
        value: `${n2}*${qJ(s)}/${m}` });
    }, { standard: S7 }),

    // n = 0: x² + y³ + axy + b = 0 위 (0, y₀), n = 1: x³ + y³ = axy + b 위 (x₀, 0), n = 2: ax + b√y − cx + e = 0 위 (1, 1)
    T('imp-slope-two', '지나는 조건과 기울기 조건을 연립해 상수 둘 구하기', '②16', (d, n) => {
      if (n === 0) {
        const y0 = d.pick([-2, -1, 1, 2]), a = nz(d, -6, 6), b = -(y0 ** 3), s = Q(-a, 3 * y0);
        return slots(`곡선 ${nb(ms('x^2 + y^3 + axy + b = 0'))} 위의 점 ${nb(ms('(0, ' + y0 + ')'))}에서 ${DYDX}의 값이 ${qT(s)}일 때, 상수 ${Av}, ${Bv}의 값을 구하시오.`, `${Av} = {0}, ${Bv} = {1}`, [[a, `-3*${jn(y0)}*${jn(s.p)}/${s.q}`], [b, `-(${jn(y0)}*${jn(y0)}*${jn(y0)})`]], {
          shown: `${Av} = ${sT(a)}, ${Bv} = ${sT(b)}`,
          explain: `점 ${nb(jh(ms('(0, ' + y0 + ')'), '을/를'))} 넣으면 ${nb(ms(sT(y0 ** 3) + ' + b = 0'))}에서 ${nb(ms('b = ' + b))}이다. 각 항을 ${X}에 대하여 미분하면 ${nb(ms('2x + 3y^2') + DYDX + ms(' + ay + ax') + DYDX + ' = 0')}이고, ${nb(jh(ms('x = 0, y = ' + y0), '을/를'))} 넣으면 ${nb(DYDX + ' = ' + (y0 > 0 ? MINUS : '') + frac(Av, 3 * Math.abs(y0)))}이므로 ${nb(ms('a = ' + a))}이다.`,
          derived: [3] });
      }
      if (n === 1) {
        const x0 = d.pick([-2, -1, 1, 2]), a = d.pick([1, 2, 3, 6, -1, -2, -3, -6]), b = x0 ** 3, s = Q(3 * x0, a);
        return slots(`곡선 ${nb(ms('x^3 + y^3 = axy + b'))} 위의 점 ${nb(ms('(' + x0 + ', 0)'))}에서 ${DYDX}의 값이 ${qT(s)}일 때, 상수 ${Av}, ${Bv}의 값을 구하시오.`, `${Av} = {0}, ${Bv} = {1}`, [[a, `3*${jn(x0)}*${s.q}/${jn(s.p)}`], [b, `${jn(x0)}*${jn(x0)}*${jn(x0)}`]], {
          shown: `${Av} = ${sT(a)}, ${Bv} = ${sT(b)}`,
          explain: `점 ${nb(jh(ms('(' + x0 + ', 0)'), '을/를'))} 넣으면 ${nb(ms('b = ' + b))}이다. 각 항을 ${X}에 대하여 미분하면 ${nb(ms('3x^2 + 3y^2') + DYDX + ' = ' + ms('ay + ax') + DYDX)}이고, ${nb(ms('x = ' + x0 + ', y = 0'))}을 넣으면 ${nb(ms(String(3 * x0 * x0)) + ' = ' + ms(co(x0, 'a')) + DYDX)}이므로 ${nb(DYDX + ' = ' + (x0 < 0 ? MINUS : '') + frac(3 * Math.abs(x0), Av))}에서 ${nb(ms('a = ' + a))}이다.`,
          derived: [3] });
      }
      const c = d.int(5, 9), a = nz(d, -4, 4), b = nz(d, -4, 4), e = c - a - b;
      if (e === 0 || c === a) return null;
      const s = Q(2 * (c - a), b);
      return slots(`곡선 ${nb(ms('ax + b') + rt(Y) + ms(' - ' + c + 'x' + cst(e)) + ' = 0')} 위의 점 ${nb('(1, 1)')}에서의 접선의 기울기가 ${qT(s)}일 때, 상수 ${Av}, ${Bv}의 값을 구하시오.`, `${Av} = {0}, ${Bv} = {1}`,
        [[a, `${c}-${jn(e)}-2*${jn(e)}*${s.q}/(${jn(s.p)}-2*${s.q})`], [b, `2*${jn(e)}*${s.q}/(${jn(s.p)}-2*${s.q})`]], {
          shown: `${Av} = ${sT(a)}, ${Bv} = ${sT(b)}`,
          explain: `점 ${nb('(1, 1)')}을 넣으면 ${nb(ms('a + b' + cst(e - c)) + ' = 0')}이다. 각 항을 ${X}에 대하여 미분하면 ${nb(ms('a') + ' + ' + frac(Bv, '2' + rt(Y)) + DYDX + ' − ' + c + ' = 0')}이므로 점 ${nb('(1, 1)')}에서 ${nb(DYDX + ' = ' + frac(ms('2(' + c + ' - a)'), Bv) + ' = ' + qT(s))}이다. 두 식을 연립하면 ${nb(ms('a = ' + a + ', b = ' + b))}이다.`,
          derived: [2] });
    }, { count: 3, standard: S7 }),

    T('imp-inverse-root', '역함수의 미분법으로 거듭제곱근 함수의 도함수 구하기', '②17', (d) => {
      const n = d.int(3, 5), c = nz(d, -6, 6), flip = d.bool(), inner = flip ? L(-1, Math.abs(c)) : plus('x', c), u = flip ? (x) => Math.abs(c) - x : (x) => x + c, sg = flip ? -1 : 1;
      const p0 = flip ? Math.abs(c) : -c, pts = flip ? [p0 - 0.6, p0 - 1.7, p0 - 3.1] : [p0 + 0.6, p0 + 1.7, p0 + 3.1];
      const R = (e) => rtn(n, ms('(' + inner + ')' + (e === 1 ? '' : '^' + e)));
      const opt = (sign, num, e, g) => ({ h: (sign < 0 ? MINUS : '') + frac(1, (num === 1 ? '' : num) + R(e)), g });
      const rows = [opt(sg, n, n - 1, (x) => sg / (n * u(x) ** ((n - 1) / n))), opt(-sg, n, n - 1, (x) => -sg / (n * u(x) ** ((n - 1) / n))), opt(sg, 1, n - 1, (x) => sg / u(x) ** ((n - 1) / n)),
        opt(sg, n, n + 1, (x) => sg / (n * u(x) ** ((n + 1) / n))), opt(sg, n - 1, n - 1, (x) => sg / ((n - 1) * u(x) ** ((n - 1) / n)))];
      return derivQ(d, `역함수의 미분법을 이용하여 함수 ${nb(yIs(rtn(n, ms(inner))) + ' (' + ms('x != ' + p0) + ')')}에서 ${DYDX}를 구한 것은?`, (x) => u(x) ** (1 / n), rows, pts, {
        explain: `${nb(ms('y^' + n + ' = ' + inner))}이므로 ${nb(ms('x = ' + (flip ? Math.abs(c) + ' - y^' + n : 'y^' + n + cst(-c))))}이고 ${nb(dd('x', 'y') + ' = ' + ms(co(sg * n, 'y^' + (n - 1))))}이다. 따라서 ${nb(DYDX + ' = ' + frac(1, dd('x', 'y')) + ' = ' + rows[0].h)}이다.` });
    }, { standard: S7 }),

    T('imp-inverse-poly', '다항함수의 역함수의 미분계수', '②18', (d) => {
      const a = d.int(-3, 3), b = d.int(1, 6), c = d.int(-4, 4), k = d.int(-1, 2);
      if (a * a >= 3 * b) return null;
      const v = k ** 3 + a * k * k + b * k + c, fp = 3 * k * k + 2 * a * k + b;
      const src = 'x^3' + tm(a, 'x^2') + tm(b, 'x') + cst(c);
      return val(`함수 ${fIs(ms(src))}의 역함수 ${ms('f^{-1}(x)')}에 대하여 ${nb(ms("(f^{-1})'(" + v + ')'))}의 값은?`, Q(1, fp), {
        explain: `${nb(ms('f^{-1}(' + v + ') = k'))}라 하면 ${nb(ms('f(k) = ' + v))}에서 ${nb(ms('k = ' + k))}이다(${ms("f'(x)")}가 늘 양수라 ${ms('f')}는 증가하므로 근은 하나뿐이다). ${nb(ms("f'(x) = 3x^2" + tm(2 * a, 'x') + cst(b)))}이므로 ${nb(ms("(f^{-1})'(" + v + ')') + ' = ' + frac(1, ms("f'(" + k + ')')) + ' = ' + qT(Q(1, fp)))}이다.`,
        value: `1/(3*${jn(k)}*${jn(k)}+2*${jn(a)}*${jn(k)}+${b})`, derived: [2, 3, Math.abs(k)] });
    }, { standard: S7 }),

    // n = 0: f = 1/ln x 의 역함수, n = 1: f = px + e^(kx) 의 역함수 그래프 위 (a, 0)
    T('imp-inverse-trans', '지수·로그 함수의 역함수의 미분계수', '②19', (d, n) => {
      if (n === 0) {
        const m = d.int(2, 3), v = -m * m * E ** m;
        const opt = (h, value) => ({ h: ms(h), v: value });
        const rows = [opt('-' + m * m + 'e^' + m, v), opt(m * m + 'e^' + m, -v), opt('-' + m + 'e^' + m, -m * E ** m), opt('-' + m * m + 'e', -m * m * E), { h: MINUS + frac(ms('e^' + m), m * m), v: -(E ** m) / (m * m) }];
        return valueQ(d, `함수 ${fIs(frac(1, ms('ln x')))} ${nb('(' + ms('x > 1') + ')')}의 역함수를 ${ms('g(x)')}라 할 때, ${nb(ms("g'") + '(' + frac(1, m) + ')')}의 값은?`, v, rows, {
          explain: `${nb(frac(1, ms('ln x')) + ' = ' + frac(1, m))}에서 ${nb(ms('x = e^' + m))}이므로 ${nb(ms('g') + '(' + frac(1, m) + ') = ' + ms('e^' + m))}이다. ${nb(ms("f'(x)") + ' = ' + MINUS + frac(1, ms('x(ln x)^2')))}에서 ${nb(ms("f'(e^" + m + ')') + ' = ' + MINUS + frac(1, ms(m * m + 'e^' + m)))}이므로 ${nb(ms("g'") + '(' + frac(1, m) + ') = ' + frac(1, ms("f'(e^" + m + ')')) + ' = ' + rows[0].h)}이다.` });
      }
      const p = d.int(1, 3), k = d.int(1, 3);
      return val(`함수 ${fIs(ms(co(p, 'x') + ' + e^{' + co(k, 'x') + '}'))}의 역함수를 ${ms('g(x)')}라 하자. 함수 ${nb(ms('y = g(x)'))}의 그래프 위의 점 ${nb(ms('(a, 0)'))}에서의 접선의 기울기는?`, Q(1, p + k), {
        signed: false,
        explain: `${nb(ms('g(a) = 0'))}이므로 ${nb(ms('a = f(0) = 1'))}이다. ${nb(ms("f'(x) = " + p + ' + ' + co(k, 'e^{' + co(k, 'x') + '}')))}에서 ${nb(ms("f'(0) = " + (p + k)))}이므로 기울기는 ${nb(ms("g'(1)") + ' = ' + frac(1, ms("f'(0)")) + ' = ' + frac(1, p + k))}이다.`,
        value: `1/(${p}+${k})` });
    }, { count: 2, standard: S7 }),

    T('imp-inverse-given', '역함수의 미분계수 — 함숫값과 미분계수를 줌', '②21', (d) => {
      const a = d.int(-3, 4), b = d.int(-4, 6), c = d.pick([2, 3, 4, 5, 6, -2, -3, -4]);
      if (a === b) return null;
      return val(`미분가능한 함수 ${ms('f(x)')}의 역함수 ${ms('f^{-1}(x)')}가 미분가능하고 ${nb(ms('f(' + a + ') = ' + b))}, ${nb(ms("f'(" + a + ') = ' + c))}일 때, ${nb(ms("(f^{-1})'(" + b + ')'))}의 값은?`, Q(1, c), {
        explain: `${nb(ms('f(' + a + ') = ' + b))}이므로 ${nb(ms('f^{-1}(' + b + ') = ' + a))}이고 ${nb(ms("(f^{-1})'(" + b + ')') + ' = ' + frac(1, ms("f'(f^{-1}(" + b + '))')) + ' = ' + frac(1, ms("f'(" + a + ')')) + ' = ' + qT(Q(1, c)))}이다.`,
        value: `1/${jn(c)}` });
    }, { standard: S7 }),

    // n = 0: 극한에서 f(a), f′(a) → (f⁻¹)′(b), n = 1: 극한값이 1/m 일 때 g(p) 와 g′(p) 를 칸마다
    T('imp-inverse-limit', '극한으로 준 함수의 역함수의 미분계수', '②22', (d, n) => {
      if (n === 0) {
        const a = d.int(-2, 3), b = d.int(-3, 5), c = d.pick([2, 3, 4, 5, -2, -3]);
        if (a === b) return null;
        return val(`실수 전체의 집합에서 미분가능한 함수 ${ms('f(x)')}의 역함수 ${ms('f^{-1}(x)')}에 대하여 ${nb(lim('x→' + a, frac(ms(plus('f(x)', -b)), ms(plus('x', -a)))) + ' = ' + sT(c))}일 때, ${nb(ms("(f^{-1})'(" + b + ')'))}의 값은? ${note('역함수는 미분가능하다.')}`, Q(1, c), {
          explain: `분모가 0으로 가고 극한값이 있으므로 ${nb(ms('f(' + a + ') = ' + b))}, ${nb(ms("f'(" + a + ') = ' + c))}이다. 따라서 ${nb(ms("(f^{-1})'(" + b + ')') + ' = ' + frac(1, ms("f'(" + a + ')')) + ' = ' + qT(Q(1, c)))}이다.`,
          value: `1/${jn(c)}` });
      }
      const p = d.int(-2, 4), q = d.int(-2, 4), m = d.pick([2, 3, 4, 5, -2, -3]);
      if (p === q) return null;
      return slots(`모든 실수 ${X}에서 미분가능한 함수 ${ms('f(x)')}가 ${nb(jh(lim('x→' + q, frac(ms(plus('f(x)', -p)), ms(plus('x', -q)))) + ' = ' + qT(Q(1, m)), '을/를'))} 만족시킨다. 함수 ${ms('f(x)')}의 역함수 ${ms('g(x)')}가 미분가능할 때, ${jh(ms('g(' + p + ')'), '과/와')} ${ms("g'(" + p + ')')}의 값을 구하시오.`, `${ms('g(' + p + ')')} = {0}, ${ms("g'(" + p + ')')} = {1}`, [[q, `${jn(q)}`], [m, `${jn(m)}`]], {
        shown: `${ms('g(' + p + ')')} = ${sT(q)}, ${ms("g'(" + p + ')')} = ${sT(m)}`,
        explain: `${nb(ms('f(' + q + ') = ' + p))}, ${nb(ms("f'(" + q + ')') + ' = ' + qT(Q(1, m)))}이므로 ${nb(ms('g(' + p + ') = ' + q))}이고 ${nb(ms("g'(" + p + ')') + ' = ' + frac(1, ms("f'(" + q + ')')) + ' = ' + sT(m))}이다.` });
    }, { count: 2, standard: S7 }),

    // n = 0: g 의 차분 극한과 f(q) = p 로 f′(q), n = 1: g 의 극한(분자·분모 모두 0)으로 f′(b)
    T('imp-inverse-back', '역함수 쪽 극한에서 원래 함수의 미분계수 구하기', '②23', (d, n) => {
      if (n === 0) {
        const p = d.int(-2, 4), q = d.int(-2, 4), k = d.int(2, 5), s = d.pick([3, 4, 6, 8, 12, -4, -6]);
        if (p === q) return null;
        return val(`미분가능한 함수 ${ms('f(x)')}의 역함수 ${ms('g(x)')}가 ${nb(jh(lim('h→0', frac(ms('g(' + p + ' + ' + k + 'h) - g(' + p + ')'), V('h'))) + ' = ' + sT(s), '을/를'))} 만족시키고 ${nb(ms('f(' + q + ') = ' + p))}일 때, ${ms("f'(" + q + ')')}의 값은?`, Q(k, s), {
          explain: `(주어진 식) = ${nb(ms(k + "g'(" + p + ')') + ' = ' + sT(s))}에서 ${nb(ms("g'(" + p + ')') + ' = ' + qT(Q(s, k)))}이다. ${nb(ms('f(' + q + ') = ' + p))}이므로 ${nb(ms("f'(" + q + ')') + ' = ' + frac(1, ms("g'(" + p + ')')) + ' = ' + qT(Q(k, s)))}이다.`,
          value: `${k}/${jn(s)}` });
      }
      const a = d.int(-3, 3), b = d.int(-3, 3), s = d.pick([2, 3, 4, 5, -2, -3]);
      if (a === b) return null;
      return val(`모든 실수 ${X}에서 미분가능한 함수 ${ms('f(x)')}의 역함수를 ${ms('g(x)')}라 할 때, ${ms('g(x)')}는 모든 실수 ${X}에서 미분가능하고 ${nb(lim('x→' + a, frac(ms(plus('g(x)', -b)), ms(plus('x', -a)))) + ' = ' + sT(s))}이다. 이때 ${ms("f'(" + b + ')')}의 값은?`, Q(1, s), {
        explain: `분모가 0으로 가고 극한값이 있으므로 ${nb(ms('g(' + a + ') = ' + b))}, ${nb(ms("g'(" + a + ') = ' + s))}이다. ${nb(ms('f(' + b + ') = ' + a))}이므로 ${nb(ms("f'(" + b + ')') + ' = ' + frac(1, ms("g'(" + a + ')')) + ' = ' + qT(Q(1, s)))}이다.`,
        value: `1/${jn(s)}` });
    }, { count: 2, standard: S7 })
  ];

  // ════════════════════════════════════════════════════════════════
  // ── 마. 이계도함수 ──
  const second = [
    // n = 0: 다항함수 axⁿ, n = 1: 1/(x + c), xe^(kx), cos²x, x ln x
    T('second-deriv', '이계도함수 구하기', '②25', (d, n) => {
      if (n === 0) {
        const a = nz(d, -4, 4), m = d.int(3, 5), opt = (k, e, g) => ({ h: nb(ms("y'' = " + co(k, e === 0 ? '1' : e === 1 ? 'x' : 'x^' + e).replace(/^(-?)1$/, '$11'))), g });
        const rows = [opt(a * m * (m - 1), m - 2, (x) => a * m * (m - 1) * x ** (m - 2)), opt(a * m, m - 1, (x) => a * m * x ** (m - 1)), opt(a * m * (m - 1), m - 1, (x) => a * m * (m - 1) * x ** (m - 1)),
          opt(a * m * m, m - 2, (x) => a * m * m * x ** (m - 2)), opt(a * (m - 1) * (m - 2), m - 2, (x) => a * (m - 1) * (m - 2) * x ** (m - 2))];
        return derivQ(d, `함수 ${yIs(ms(co(a, 'x^' + m)))}의 이계도함수는?`, (x) => a * x ** m, rows, [0.6, 1.3, 2.1], { order: 2,
          explain: `${nb(YP + ' = ' + ms(co(a * m, 'x^' + (m - 1))))}이므로 ${rows[0].h}이다.` });
      }
      const c = d.int(1, 4), k = d.int(2, 3);
      const t = d.pick([
        { src: sf(1, plus('x', c)), f: (x) => 1 / (x + c), d1: sf(-1, '(' + plus('x', c) + ')^2'), pts: [0.4, 1.2, 2.3],
          rows: [[sf(2, '(' + plus('x', c) + ')^3'), (x) => 2 / (x + c) ** 3], [sf(-1, '(' + plus('x', c) + ')^2'), (x) => -1 / (x + c) ** 2], [sf(-2, '(' + plus('x', c) + ')^3'), (x) => -2 / (x + c) ** 3], [sf(2, '(' + plus('x', c) + ')^2'), (x) => 2 / (x + c) ** 2], [sf(1, '(' + plus('x', c) + ')^3'), (x) => 1 / (x + c) ** 3]] },
        { src: ms('xe^{' + k + 'x}'), f: (x) => x * E ** (k * x), d1: ms('(1 + ' + k + 'x)e^{' + k + 'x}'), pts: [-0.6, 0.2, 0.7],
          rows: [[ms(k + '(' + k + 'x + 2)e^{' + k + 'x}'), (x) => k * (k * x + 2) * E ** (k * x)], [ms('(1 + ' + k + 'x)e^{' + k + 'x}'), (x) => (1 + k * x) * E ** (k * x)], [ms(k * k + 'xe^{' + k + 'x}'), (x) => k * k * x * E ** (k * x)], [ms(k + '(' + k + 'x + 1)e^{' + k + 'x}'), (x) => k * (k * x + 1) * E ** (k * x)], [ms(2 * k + 'e^{' + k + 'x}'), (x) => 2 * k * E ** (k * x)]] },
        { src: ms('cos^2 x'), f: (x) => cos(x) ** 2, d1: ms('-2sin x cos x'), pts: [0.3, 0.9, 1.4],
          rows: [[ms('2(sin^2 x - cos^2 x)'), (x) => 2 * (sin(x) ** 2 - cos(x) ** 2)], [ms('-2sin x cos x'), (x) => -2 * sin(x) * cos(x)], [ms('2(cos^2 x - sin^2 x)'), (x) => 2 * (cos(x) ** 2 - sin(x) ** 2)], [ms('-2sin^2 x'), (x) => -2 * sin(x) ** 2], [ms('2sin x cos x'), (x) => 2 * sin(x) * cos(x)]] },
        { src: ms('x ln x'), f: (x) => x * LN(x), d1: ms('ln x + 1'), pts: [0.6, 1.4, 2.5],
          rows: [[frac(1, X), (x) => 1 / x], [ms('ln x + 1'), (x) => LN(x) + 1], [MINUS + frac(1, ms('x^2')), (x) => -1 / (x * x)], [frac(1, ms('x^2')), (x) => 1 / (x * x)], [ms('ln x'), (x) => LN(x)]] }
      ]);
      return derivQ(d, `다음 함수의 이계도함수를 구한 것은? ${yIs(t.src)}`, t.f, t.rows.map(([h, g]) => ({ h: nb(ms("y'' = ") + h), g })), t.pts, { order: 2,
        explain: `${nb(jh(YP + ' = ' + t.d1, '을/를'))} 한 번 더 미분하면 ${nb(ms("y'' = ") + t.rows[0][0])}이다.` });
    }, { count: 2, standard: S7 }),

    // n = 0: x ln(x + c) 의 f″(x₀), n = 1: eˣ(a sin x + b cos x) 의 f″(0)
    T('second-value', '이계도함수의 값 f″(a)', '②26', (d, n) => {
      if (n === 0) {
        const c = d.int(1, 3), x0 = d.int(1, 2), ans = Q(x0 + 2 * c, (x0 + c) ** 2);
        return val(`함수 ${fIs(ms('x ln(x + ' + c + ')'))}에 대하여 ${ms("f''(" + x0 + ')')}의 값은?`, ans, {
          explain: `${nb(ms("f'(x) = ln(x + " + c + ')') + ' + ' + frac(X, ms('x + ' + c)))}, ${nb(ms("f''(x)") + ' = ' + frac(1, ms('x + ' + c)) + ' + ' + frac(c, ms('(x + ' + c + ')^2')))}이므로 ${nb(ms("f''(" + x0 + ')') + ' = ' + qT(ans))}이다.`,
          value: `1/(${x0}+${c})+${c}/((${x0}+${c})*(${x0}+${c}))` });
      }
      const a = nz(d, -5, 5), b = nz(d, -5, 5);
      if (a === b) return null;
      return val(`함수 ${fIs(ms('e^x(' + co(a, 'sin x') + tm(b, 'cos x') + ')'))}에 대하여 ${ms("f''(0)")}의 값은?`, 2 * a, {
        explain: `${nb(ms("f'(x) = e^x(" + co(a - b, 'sin x') + tm(a + b, 'cos x') + ')'))}, ${nb(ms("f''(x) = e^x(" + co(-2 * b, 'sin x') + tm(2 * a, 'cos x') + ')'))}이므로 ${nb(ms("f''(0) = " + 2 * a))}이다.`,
        value: `2*${jn(a)}`, derived: [2] });
    }, { count: 2, standard: S7 })
  ];

  B.addTypes('11-5-4', 'param', param);
  B.addTypes('11-5-4', 'implicit', implicit);
  B.addTypes('11-5-4', 'second', second);
})(typeof window !== 'undefined' ? window : globalThis);
