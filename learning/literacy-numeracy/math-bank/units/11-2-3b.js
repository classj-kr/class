// 미적분Ⅰ Ⅱ-1 미분계수와 도함수 — 뒤쪽 묶음(미분가능성과 연속성, 도함수와 미분법, 미분법의 활용).
// 단원 틀·싣는 기준·뺀 것과 까닭은 11-2-3a.js 머리에 적었다. 도구는 11-2-3a.js 가 내보낸 B.kit.u23x 를 쓴다.
// ref: ①n = 기본꼴_1의 n번.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, box, N, M, C, inline } = B.kit;
  const { MINUS, Q, tail, V, sup, tag, nz, mono, poly, claimQ, rt, sys, linAns, grp } = B.kit.mid;
  const { ms, lim, jh, hx } = B.kit.hs;
  const K = B.kit.u23x, nb = K.nb;   // 긴 식은 기호 앞에서 줄이 갈릴 수 있게 나눠 붙인다(11-2-3a.js)
  const { S1, S2, S3, S4, T, X, Hh, Av, Bv, Kv, sT, pp, jn, pt, NOTE1, minus, fa, dfa, xm, qT, cf, pH, fval, dcs, mul, add, fJ, dJ, fIs, yIs, hasZero, val, slots, setsQ, oneQ } = K;

  // ── 이 파일에서 더 쓰는 도구 ──
  const xs = (p) => (p === 0 ? 'x' : p < 0 ? 'x + ' + (-p) : 'x - ' + p);     // ms 에 넘길 「x − p」
  const ge = (p) => nb('(' + ms('x >= ' + p) + ')'), lt = (p) => nb('(' + ms('x < ' + p) + ')'), ne = (p) => nb('(' + ms('x != ' + p) + ')'), eq = (p) => nb('(' + ms('x = ' + p) + ')');
  // 조각 함수 「f(x) = { 위 (조건), 아래 (조건) }」
  const pieces = (rows, name) => nb(ms((name || 'f') + '(x)') + ' =') + ' ' + sys(rows.map(([h, c]) => h + ' ' + c));
  // 다항식 답을 「y′ = [ ]x³ [ ]x² …」처럼 앞 글을 붙여 받는다. rows 는 [계수, 문자 글, 검사 식]
  const polyL = (text, lead, rows, o) => K.polyQ(text, rows, o, lead);
  const termsOf = (cs) => cs.map((c, k) => [c, K.term(k, X), k]).reverse();   // 높은 차수부터 [계수, 문자 글, 차수]
  // 곱 A·B 의 x^j 의 계수를 다시 셈하는 식(0인 항은 뺀다)
  const prodJ = (A, Bq, j) => { const out = []; A.forEach((a, i) => { const b = Bq[j - i]; if (a && b) out.push(jn(a) + '*' + jn(b)); }); return out.join('+') || '0'; };
  const prod3J = (A, Bq, Cq, j) => { const out = []; A.forEach((a, i) => Bq.forEach((b, k) => { const c = Cq[j - i - k]; if (a && b && c) out.push(jn(a) + '*' + jn(b) + '*' + jn(c)); })); return out.join('+') || '0'; };
  const DP = ms("y'"), FX = ms('f(x)');
  // 앞 항 뒤에 이어 적는 항들: 「 + 3x² − 2x + 5」(0인 항은 뺀다)
  const more = (terms) => terms.filter(([c]) => c !== 0).map(([c, v]) => (c < 0 ? ' ' + MINUS + ' ' : ' + ') + mono(Math.abs(c), v)).join('');
  // 연속성·미분가능성을 수로 따진다(차분몫을 양쪽에서 셈한다).
  const EPS = 1e-6;
  function probe(f, p) {
    const fp = f(p), r = f(p + EPS), l = f(p - EPS), cont = Math.abs(r - fp) < 1e-4 && Math.abs(l - fp) < 1e-4;
    const dr = (r - fp) / EPS, dl = (fp - l) / EPS;
    return { cont, diff: cont && Math.abs(dr - dl) < 1e-3, dr: Math.round(dr), dl: Math.round(dl) };
  }
  const STATE = ['연속이고 미분가능하다.', '연속이지만 미분가능하지 않다.', '불연속이고 미분가능하지 않다.'];
  const stateOf = (pr) => (pr.diff ? 0 : pr.cont ? 1 : 2);
  const rightQ = (p) => lim('x→' + p + '+', frac(ms('f(x) - f(' + p + ')'), xm(p))), leftQ = (p) => lim('x→' + p + '-', frac(ms('f(x) - f(' + p + ')'), xm(p)));

  // ════════════════════════════════════════════════════════════════
  // ── 미분가능성과 연속성 ──
  const diff = [
    // 절댓값 함수, 다항함수, 한 점의 값만 다른 함수 — 연속인가, 미분가능한가를 셈으로 가린다.
    T('diff-point', '한 점에서 연속성과 미분가능성 — 식 하나', '①18', (d) => {
      const kind = d.pick(['abs1', 'abs2', 'absq', 'absok', 'poly', 'jump', 'fill']);
      let h, f, p, why;
      if (kind === 'abs1') { p = d.int(-3, 3); f = (x) => Math.abs(x - p); h = ms('|' + xs(p) + '|'); }
      else if (kind === 'abs2') { const r = d.int(1, 3); p = d.pick([r, -r]); f = (x) => Math.abs(x * x - r * r); h = ms('|x^2 - ' + r * r + '|'); }
      else if (kind === 'absq') { const q = nz(d, -4, 4); p = d.pick([0, q]); f = (x) => Math.abs(x * x - q * x); h = ms('|' + 'x^2 ' + (q < 0 ? '+ ' + (-q) : '- ' + (q === 1 ? '' : q)) + 'x|'); }
      else if (kind === 'absok') { const q = nz(d, -4, 4); p = d.int(-3, 3); if (p === 0 || p === q) return null; f = (x) => Math.abs(x * x - q * x); h = ms('|' + 'x^2 ' + (q < 0 ? '+ ' + (-q) : '- ' + (q === 1 ? '' : q)) + 'x|'); }
      else if (kind === 'poly') { const b = nz(d, -4, 4); p = d.int(-2, 2); f = (x) => x * x + b * x; h = pH([0, b, 1]); }
      else {
        const c = d.int(-4, 4), base = p0 => p0 * p0 + c; p = nz(d, -2, 2);
        const v = kind === 'fill' ? base(p) : base(p) + nz(d, -3, 3);
        f = (x) => (Math.abs(x - p) < 1e-12 ? v : x * x + c);
        h = sys([pH([c, 0, 1]) + ' ' + ne(p), sT(v) + ' ' + eq(p)]);
        const pr = probe(f, p);
        why = pr.cont ? `${lim('x→' + p, FX)} = ${sT(base(p))} = ${fa(p)}이므로 연속이고, ${lim('x→' + p, frac(ms('f(x) - f(' + p + ')'), xm(p)))} = ${lim('x→' + p, '(' + ms(xs(-p)) + ')')} = ${sT(2 * p)}이므로 미분가능하다.`
          : `${lim('x→' + p, FX)} = ${sT(base(p))}이지만 ${nb(fa(p) + ' = ' + sT(v))}이므로 불연속이다. 불연속이면 미분가능하지 않다.`;
      }
      const pr = probe(f, p), st = stateOf(pr);
      if (!why) why = st === 0 ? `${lim('x→' + p, FX)} = ${fa(p)}이므로 연속이고, ${X} = ${sT(p)}의 양쪽에서 구한 ${frac(ms('f(x) - f(' + p + ')'), xm(p))}의 극한이 모두 ${sT(pr.dr) + tail(Math.abs(pr.dr), '으로/로')} 같아 미분가능하다.`
        : `${lim('x→' + p, FX)} = ${fa(p)} = ${sT(f(p))}이므로 연속이지만, ${rightQ(p)} = ${sT(pr.dr)}, ${leftQ(p)} = ${sT(pr.dl) + tail(Math.abs(pr.dl), '으로/로')} 서로 달라 미분가능하지 않다.`;
      const fh = nb(FX + ' =') + ' ' + h;
      return oneQ(d, `함수 ${fh}의 ${nb(ms('x = ' + p))}에서의 연속성과 미분가능성에 대한 설명으로 옳은 것은?`, STATE.map((s, i) => ({ h: s, ok: i === st })), true, { explain: why });
    }, { standard: S2 }),

    // 경계에서 이어 붙인 두 식 — 이어지는가(연속), 기울기가 같은가(미분가능)를 셈으로 가린다.
    T('diff-piece', '조각 함수의 경계에서 연속성과 미분가능성', '①19', (d) => {
      const p = d.int(-2, 2), kind = d.pick(['corner', 'corner', 'smooth', 'jump']);
      const gcs = d.bool() ? [d.int(-4, 4), d.int(-4, 4), nz(d, -2, 2)] : [d.int(-4, 4), d.int(-3, 3), 0, d.pick([1, -1])];
      const gp = fval(gcs, p), gd = fval(dcs(gcs), p), m = kind === 'smooth' ? gd : gd + nz(d, -3, 3), jump = kind === 'jump' ? nz(d, -3, 3) : 0;
      const u = d.bool() ? 0 : nz(d, -1, 1);
      const hcs = [u * p * p - m * p + gp + jump, m - 2 * u * p, u];                      // h(x) = u(x − p)² + m(x − p) + g(p) + jump
      while (hcs.length > 1 && hcs[hcs.length - 1] === 0) hcs.pop();
      if (hcs.length < 2) return null;
      const right = d.bool(), up = right ? gcs : hcs, down = right ? hcs : gcs;
      const f = (x) => (x >= p ? fval(up, x) : fval(down, x)), pr = probe(f, p), st = stateOf(pr);
      const up0 = fval(up, p), down0 = fval(down, p);
      const why = st === 2 ? `${lim('x→' + p + '+', FX)} = ${sT(up0)}, ${lim('x→' + p + '-', FX)} = ${sT(down0) + tail(Math.abs(down0), '으로/로')} 서로 달라 불연속이다. 불연속이면 미분가능하지 않다.`
        : `${lim('x→' + p + '+', FX)} = ${lim('x→' + p + '-', FX)} = ${fa(p)} = ${sT(up0)}이므로 연속이고, ${rightQ(p)} = ${sT(pr.dr)}, ${leftQ(p)} = ${sT(pr.dl) + tail(Math.abs(pr.dl), '으로/로')}${st === 0 ? ' 같아 미분가능하다.' : ' 서로 달라 미분가능하지 않다.'}`;
      return oneQ(d, `함수 ${pieces([[pH(up), ge(p)], [pH(down), lt(p)]])}의 ${nb(ms('x = ' + p))}에서의 연속성과 미분가능성에 대한 설명으로 옳은 것은?`, STATE.map((s, i) => ({ h: s, ok: i === st })), true, { explain: why });
    }, { standard: S2 }),

    // 경계의 양쪽에서 구한 차분몫의 극한 두 값(조각 함수 또는 절댓값 함수)
    T('diff-onesided', '경계의 양쪽에서 구한 차분몫의 극한', '①18 ①19', (d) => {
      const p = d.int(-2, 2);
      let fh, R, L, calc, derived = [];
      if (d.bool()) {
        const gcs = [d.int(-4, 4), d.int(-4, 4), nz(d, -2, 2)], gp = fval(gcs, p);
        R = fval(dcs(gcs), p); L = R + nz(d, -4, 4);
        const hcs = [gp - L * p, L];
        if (L === 0) return null;
        fh = pieces([[pH(gcs), ge(p)], [pH(hcs), lt(p)]]);
        calc = [[dJ(gcs, p), 0], [jn(L), 1]];
      } else {
        if (p === 0) return null;
        const r = Math.abs(p);
        fh = nb(FX + ' =') + ' ' + ms('|x^2 - ' + r * r + '|');
        R = 2 * r; L = -2 * r; calc = [[`2*${r}`, 0], [`-2*${r}`, 1]]; derived = [2];
      }
      return M(`함수 ${fh}에 대하여 다음 두 극한값 ㉠, ㉡은?`, [{ label: '㉠', answer: R, signed: true }, { label: '㉡', answer: L, signed: true }], {
        figure: lines([tag('㉠') + hx(rightQ(p)), tag('㉡') + hx(leftQ(p))]),
        explain: `${X} &gt; ${sT(p)}일 때와 ${X} &lt; ${sT(p)}일 때의 식으로 각각 셈하면 ㉠ = ${sT(R)}, ㉡ = ${sT(L)}이다. 두 값이 다르므로 ${FX}는 ${nb(ms('x = ' + p))}에서 미분가능하지 않다.`,
        facts: Object.assign({ calc }, derived.length ? { derived } : {})
      });
    }, { standard: S2 }),

    T('diff-pick', 'x = 0에서 미분가능한 함수 고르기', '①20', (d) => {
      const k = d.pick([1, 2, 3, -2, -3]);
      const absK = k === 1 ? ms('x + |x|') : ms('|x| ' + (k < 0 ? '- ' + (-k) : '+ ' + k) + 'x');
      const pool = [
        { h: absK, ok: false, why: `${nb(ms('x > 0'))}이면 ${pH([0, k + 1])}, ${nb(ms('x < 0'))}이면 ${pH([0, k - 1])}이므로 ${lim('h→0+', frac(ms('f(h) - f(0)'), Hh))} = ${sT(k + 1)}, ${lim('h→0-', frac(ms('f(h) - f(0)'), Hh))} = ${sT(k - 1) + tail(Math.abs(k - 1), '으로/로')} 달라 미분가능하지 않다.` },
        { h: frac(ms('|x|'), X), ok: false, why: `${nb(ms('x = 0'))}에서 함숫값이 정의되지 않으므로(${nb(ms('x > 0'))}이면 1, ${nb(ms('x < 0'))}이면 ${sT(-1)}) 미분가능하지 않다.` },
        { h: ms('|x^3|'), ok: true, why: `${lim('h→0+', frac(ms('h^3'), Hh))} = 0, ${lim('h→0-', frac(ms('-h^3'), Hh))} = 0으로 같으므로 미분가능하다.` },
        { h: ms('x|x|'), ok: true, why: `${lim('h→0', frac(ms('h|h|'), Hh))} = ${lim('h→0', ms('|h|'))} = 0이므로 미분가능하다.` },
        { h: X + rt(ms('|x|')), ok: true, why: `${lim('h→0', frac(Hh + rt(ms('|h|')), Hh))} = ${lim('h→0', rt(ms('|h|')))} = 0이므로 미분가능하다.` }
      ];
      const rows = d.shuffle(pool).slice(0, 3);
      const names = ['f', 'g', 'h'];
      return setsQ(d, `${nb(ms('x = 0'))}에서 미분가능한 함수인 것만을 보기에서 있는 대로 고른 것은?`, rows.map((r, i) => ({ h: nb(ms(names[i] + '(x)') + ' =') + ' ' + r.h, ok: r.ok, why: r.why })), {});
    }, { standard: S2 }),

    T('diff-claims', '미분가능성과 연속성의 관계', '①21', (d) => {
      const p = nz(d, -3, 3), b = nz(d, -5, 5), A = nb(ms('x = a')), FA = ms('f(x)');
      const absP = nb(ms('y = |' + xs(p) + '|'));
      const yes = [
        `함수 ${FA}가 ${A}에서 미분가능하면 ${FA}는 ${A}에서 연속이다.`,
        `함수 ${FA}가 ${A}에서 불연속이면 ${FA}는 ${A}에서 미분가능하지 않다.`,
        `함수 ${yIs(pH([0, b, 1]))}은 실수 전체의 집합에서 미분가능하므로 모든 실수 ${X}에서 연속이다.`,
        `함수 ${jh(absP, '은/는')} ${nb(ms('x = ' + p))}에서 연속이지만 미분가능하지 않다.`
      ];
      const no = [
        [`함수 ${FA}가 ${A}에서 연속이면 ${FA}는 ${A}에서 미분가능하다.`, `연속이어도 미분가능하지 않을 수 있다(${nb(ms('y = |x|'))}는 ${nb(ms('x = 0'))}에서 연속이지만 미분가능하지 않다).`],
        [`함수 ${jh(absP, '은/는')} 모든 실수 ${X}에서 연속이므로 실수 전체의 집합에서 미분가능하다.`, `${jh(absP, '은/는')} ${nb(ms('x = ' + p))}에서 미분가능하지 않다.`, yes[3]],
        [`함수 ${FA}가 ${A}에서 미분가능하지 않으면 ${FA}는 ${A}에서 불연속이다.`, `${nb(ms('y = |x|'))}는 ${nb(ms('x = 0'))}에서 미분가능하지 않지만 연속이다.`]
      ];
      const want = d.bool();
      return claimQ(d, `미분가능성과 연속성에 대한 설명으로 ${want ? '옳은' : '옳지 않은'} 것은?`, yes, no, want);
    }, { standard: S2 }),

    // n = 0: 미정계수 a, b(어느 쪽 식에 문자가 있는지는 씨앗마다), n = 1: a(x − r)² + b 꼴로 이어 붙이고 f(q) 를 묻는다.
    T('diff-const', '조각 함수가 미분가능하도록 상수 정하기', '①23', (d, n) => {
      const p = d.int(-2, 2);
      if (n === 0) {
        if (d.bool()) {
          const m = nz(d, -5, 5), c = d.int(-5, 5), a = m - 2 * p, b = m * p + c - p * p - a * p;
          if (a === 0 || b === 0) return null;
          const aE = `${jn(m)}-2*${jn(p)}`;
          return slots(`함수 ${pieces([[ms('x^2 + ax + b'), ge(p)], [pH([c, m]), lt(p)]])}에 대하여 ${FX}가 실수 전체의 집합에서 미분가능할 때, 상수 ${Av}, ${Bv}의 값은?`, `${Av} = {0}, ${Bv} = {1}`, [[a, aE], [b, `${jn(m)}*${jn(p)}+${jn(c)}-${jn(p)}*${jn(p)}-(${aE})*${jn(p)}`]], {
            shown: `${Av} = ${sT(a)}, ${Bv} = ${sT(b)}`,
            explain: `${nb(ms('x = ' + p))}에서 연속이므로 ${nb(poly([[p * p, ''], [p, Av], [1, Bv]]) + ' = ' + sT(m * p + c))}이고, 미분가능하므로 양쪽의 미분계수가 같아 ${nb(poly([[2 * p, ''], [1, Av]]) + ' = ' + sT(m))}이다. 따라서 ${nb(ms('a') + ' = ' + sT(a))}, ${nb(ms('b') + ' = ' + sT(b))}이다.`,
            derived: [2]
          });
        }
        const u = d.pick([1, -1]), q = d.int(-4, 4), r = d.int(-4, 4), hp = u * p * p + q * p + r, a = 2 * u * p + q, b = hp - a * p;
        if (a === 0 || b === 0) return null;
        const aE = `2*${jn(u)}*${jn(p)}+${jn(q)}`;
        return slots(`함수 ${pieces([[ms('ax + b'), ge(p)], [pH([r, q, u]), lt(p)]])}에 대하여 ${FX}가 실수 전체의 집합에서 미분가능할 때, 상수 ${Av}, ${Bv}의 값은?`, `${Av} = {0}, ${Bv} = {1}`, [[a, aE], [b, `${jn(u)}*${jn(p)}*${jn(p)}+${jn(q)}*${jn(p)}+${jn(r)}-(${aE})*${jn(p)}`]], {
          shown: `${Av} = ${sT(a)}, ${Bv} = ${sT(b)}`,
          explain: `미분가능하므로 ${nb(ms('x = ' + p))}의 양쪽의 미분계수가 같아 ${nb(ms('a') + ' = ' + sT(a))}이고, 연속이므로 ${nb(poly([[p, Av], [1, Bv]]) + ' = ' + sT(hp))}에서 ${nb(ms('b') + ' = ' + sT(b))}이다.`,
          derived: [2]
        });
      }
      const uu = d.pick([1, -1, 2, -2]), r = p - uu, a = nz(d, -3, 3), m = 2 * a * uu, c = d.int(-5, 5), b = m * p + c - a * uu * uu, q = p + d.int(1, 3);
      const ans = a * (q - r) ** 2 + b, aE = `(${jn(m)})/(2*(${jn(p)}-(${jn(r)})))`;
      return val(`함수 ${pieces([[ms(r === 0 ? 'ax^2 + b' : 'a(' + xs(r) + ')^2 + b'), ge(p)], [pH([c, m]), lt(p)]])}에 대하여 ${FX}가 모든 실수 ${X}에서 미분가능할 때, ${fa(q)}의 값은? (단, ${Av}, ${Bv}는 상수)`, ans, {
        explain: `${nb(ms('x = ' + p))}의 양쪽의 미분계수가 같으므로 ${nb('2' + Av + ' × (' + sT(p) + ' − ' + pp(r) + ') = ' + sT(m))}에서 ${nb(ms('a') + ' = ' + sT(a))}이고, 연속이므로 ${nb(poly([[uu * uu, Av], [1, Bv]]) + ' = ' + sT(m * p + c))}에서 ${nb(ms('b') + ' = ' + sT(b))}이다. 따라서 ${nb(fa(q) + ' = ' + sT(a) + ' × ' + pp(q - r) + sup(2) + ' + ' + pp(b) + ' = ' + sT(ans))}이다.`,
        value: `${aE}*(${jn(q)}-(${jn(r)}))*(${jn(q)}-(${jn(r)}))+${jn(m)}*${jn(p)}+${jn(c)}-${aE}*(${jn(p)}-(${jn(r)}))*(${jn(p)}-(${jn(r)}))`, derived: [2]
      });
    }, { count: 2, standard: S2 })
  ];

  // ════════════════════════════════════════════════════════════════
  // ── 도함수와 미분법 ──
  const deriv = [
    T('deriv-def-blank', '정의로 도함수를 구하는 과정의 빈칸', '①25', (d) => {
      const n = d.pick([3, 4]), c = d.int(1, 4), cv = (k) => (k === 1 ? '' : String(k));
      const fH = (c === 1 ? '' : c) + X + sup(n);
      const rest1 = n === 3 ? `${cv(3 * c)}${X}${Hh}${sup(2)} + ${cv(c)}${Hh}${sup(3)}` : `${cv(6 * c)}${X}${sup(2)}${Hh}${sup(2)} + ${cv(4 * c)}${X}${Hh}${sup(3)} + ${cv(c)}${Hh}${sup(4)}`;
      const rest2 = n === 3 ? `${cv(3 * c)}${X}${Hh} + ${cv(c)}${Hh}${sup(2)}` : `${cv(6 * c)}${X}${sup(2)}${Hh} + ${cv(4 * c)}${X}${Hh}${sup(2)} + ${cv(c)}${Hh}${sup(3)}`;
      const BA = box('㈎'), BB = box('㈏');
      const figure = lines([
        hx(`${ms("f'(x)")} = ${lim('h→0', frac(ms('f(x + h) - f(x)'), Hh))}`),
        hx(`= ${lim('h→0', frac(cv(c) + '(' + ms('x + h') + ')' + sup(n) + ' − ' + fH, Hh))}`),
        hx(`= ${lim('h→0', frac(BA + ' + ' + rest1, Hh))}`),
        hx(`= ${lim('h→0', '(' + BB + ' + ' + rest2 + ')')}`),
        hx(`= ${BB}`)
      ]);
      return inline(`다음은 함수 ${nb(FX + ' = ' + fH)}의 도함수를 정의를 이용하여 구하는 과정이다. ㈎, ㈏에 알맞은 식은?`, grp(`㈎ {0}${X}<sup>{1}</sup>${Hh},`) + ' ' + grp(`㈏ {2}${X}<sup>{3}</sup>`),
        [{ answer: n * c }, { answer: n - 1 }, { answer: n * c }, { answer: n - 1 }], {
          shown: `㈎ ${n * c}${X}${sup(n - 1)}${Hh}, ㈏ ${n * c}${X}${sup(n - 1)}`, figure,
          explain: `${nb('(' + ms('x + h') + ')' + sup(n))}을 전개하면 ${Hh}에 대한 일차항은 ${n}${X}${sup(n - 1)}${Hh}이므로 ㈎는 ${n * c}${X}${sup(n - 1)}${Hh}이다. ${Hh}로 나누고 ${Hh} → 0으로 보내면 ㈏ = ${n * c}${X}${sup(n - 1)}이다.`,
          facts: { calc: [[`${n}*${c}`, 0], [`${n}-1`, 1], [`${n}*${c}`, 2], [`${n}-1`, 3]] }
        });
    }, { standard: S3 }),

    T('deriv-power', 'y = xⁿ의 도함수', '①26', (d) => {
      const n = d.int(11, 120), c = d.pick([1, 1, 2, 3, -1, -2, 5]);
      return inline(`함수 ${yIs(poly([[c, X + sup(n)]]))}의 도함수는?`, `${DP} = {0}${X}<sup>{1}</sup>`, [{ answer: c * n, signed: true }, { answer: n - 1 }], {
        shown: `${DP} = ${poly([[c * n, X + sup(n - 1)]])}`,
        explain: `${nb(ms("(x^n)'") + ' = ' + ms('nx^{n-1}'))}이므로 ${nb(DP + ' = ' + (c === 1 ? '' : sT(c) + ' × ' + n + X + sup(n - 1) + ' = ') + poly([[c * n, X + sup(n - 1)]]))}이다.`,
        facts: { calc: [[`${jn(c)}*${n}`, 0], [`${n}-1`, 1]] }
      });
    }, { standard: S3 }),

    T('deriv-power-const', '상수함수의 도함수', '①26', (d) => {
      const k = d.pick([2, 3, 5, 7]), m = d.int(4, 12), P = (b, e) => b + sup(e);
      const rows = [
        { h: `${DP} = 0`, ok: true },
        { h: `${DP} = ${m} × ${P(k, m - 1)}`, ok: false },
        { h: `${DP} = ${P(k, m)}`, ok: false },
        { h: `${DP} = ${m} × ${P(k, m)}`, ok: false }
      ];
      return oneQ(d, `함수 ${yIs(P(k, m))}의 도함수는?`, rows, true, { explain: `${jh(P(k, m), '은/는')} ${X}의 값에 따라 바뀌지 않는 상수이다. 상수함수의 도함수는 0이므로 ${nb(DP + ' = 0')}이다.` });
    }, { standard: S3 }),

    // n = 0: 사차식(항 다섯), n = 1: 계수가 분수인 삼차식(도함수는 정수 계수), n = 2: 곱을 전개해야 하는 합(3(x² + 2x) + x(x² − 1) 꼴)
    T('deriv-sum', '실수배·합·차의 미분법', '①27 ①24', (d, n) => {
      if (n === 0) {
        const cs = [nz(d, -9, 9), nz(d, -6, 6), nz(d, -5, 5), nz(d, -4, 4), d.pick([1, -1, 2, 3, -2])], dv = dcs(cs);
        return polyL(`함수 ${yIs(pH(cs))}의 도함수는?`, `${DP} =`, termsOf(dv).map(([k, v, e]) => [k, v, `${e + 1}*${jn(cs[e + 1])}`]), {
          explain: `${nb(DP + ' = ' + cs.map((c, e) => [c, e]).slice(1).reverse().map(([c, e]) => '(' + poly([[c, K.term(e, X)]]) + ')′').join(' + '))} = ${pH(dv)}이다.`
        });
      }
      if (n === 1) {
        const p = d.pick([1, 2, 4, 5, -1, -2, -4]), q = d.pick([1, 3, 5, -1, -3]), r = nz(d, -6, 6), s = d.int(-5, 5);
        const cs = [Q(s), Q(r), Q(q, 2), Q(p, 3)];
        const expr = poly(cs.map((c, e) => [c, K.term(e, X)]).reverse());
        return polyL(`함수 ${yIs(expr)}의 도함수는?`, `${DP} =`, [[p, X + sup(2), `3*${jn(p)}/3`], [q, X, `2*${jn(q)}/2`], [r, '', jn(r)]], {
          explain: `항마다 미분하면 ${nb(DP + ' = ' + pH([r, q, p]))}이다(${X}${sup(3)}의 계수 ${qT(Q(p, 3))}에 3을, ${X}${sup(2)}의 계수 ${qT(Q(q, 2))}에 2를 곱한다).`
        });
      }
      const p = d.pick([2, 3, 4, -2, -3]), q = nz(d, -4, 4), r = nz(d, -5, 5), c0 = p * q + r;
      if (c0 === 0) return null;
      const expr = `${sT(p)}(${pH([0, q, 1])}) + ${X}(${pH([r, 0, 1])})`;
      return polyL(`함수 ${yIs(expr)}의 도함수는?`, `${DP} =`, [[3, X + sup(2), '3'], [2 * p, X, `2*${jn(p)}`], [c0, '', `${jn(p)}*${jn(q)}+${jn(r)}`]], {
        explain: `전개하면 ${nb(ms('y') + ' = ' + pH([0, c0, p, 1]))}이므로 ${nb(DP + ' = ' + pH([c0, 2 * p, 3]))}이다.`, derived: [2, 3]
      });
    }, { count: 3, standard: S4 }),

    // n = 0: (이차식)(일차식), n = 1: (이차식)(이차식), n = 2: (ax² + bx)²(같은 식 둘의 곱)
    T('deriv-prod', '곱의 미분법', '①28', (d, n) => {
      let A, Bq, show;
      if (n === 0) { A = [d.int(-5, 5), d.int(-5, 5), nz(d, -3, 3)]; Bq = [nz(d, -5, 5), nz(d, -4, 4)]; }
      else if (n === 1) { A = [d.int(-5, 5), nz(d, -4, 4), 1]; Bq = [nz(d, -5, 5), 0, nz(d, -3, 3)]; }
      else { A = [0, nz(d, -4, 4), nz(d, -3, 3)]; Bq = A; }
      const P = mul(A, Bq), dv = dcs(P), keep = n === 2 ? (e) => e >= 1 : () => true;   // (ax² + bx)² 의 도함수는 상수항이 늘 0이다
      if (hasZero(dv.filter((_, e) => keep(e)))) return null;
      show = n === 2 ? '(' + pH(A) + ')' + sup(2) : '(' + pH(A) + ')(' + pH(Bq) + ')';
      const dB = dcs(Bq), tailB = dB.length === 1 ? ' × ' + pp(dB[0]) : '(' + pH(dB) + ')';
      const rule = n === 2 ? `${nb(DP + ' = (' + pH(dcs(A)) + ')(' + pH(A) + ') + (' + pH(A) + ')(' + pH(dcs(A)) + ')')}` : `${nb(DP + ' = (' + pH(dcs(A)) + ')(' + pH(Bq) + ') + (' + pH(A) + ')' + tailB)}`;
      return polyL(`함수 ${yIs(show)}의 도함수는?`, `${DP} =`, termsOf(dv).filter(([, , e]) => keep(e)).map(([k, v, e]) => [k, v, `${e + 1}*(${prodJ(A, Bq, e + 1)})`]), {
        explain: `곱의 미분법으로 ${rule} = ${pH(dv)}이다.`, derived: [2, 3, 4]
      });
    }, { count: 3, standard: S4 }),

    T('deriv-prod3', '세 함수의 곱의 미분', '①29', (d) => {
      const A = [nz(d, -4, 4), 0, 1], Bq = [nz(d, -4, 4), 1], Cq = [nz(d, -5, 5), nz(d, -3, 3)];
      const P = mul(mul(A, Bq), Cq), dv = dcs(P);
      if (hasZero(dv)) return null;
      return polyL(`함수 ${yIs('(' + pH(A) + ')(' + pH(Bq) + ')(' + pH(Cq) + ')')}의 도함수는?`, `${DP} =`, termsOf(dv).map(([k, v, e]) => [k, v, `${e + 1}*(${prod3J(A, Bq, Cq, e + 1)})`]), {
        explain: `${nb('{' + ms('f(x)g(x)h(x)') + '}′ = ' + ms("f'(x)g(x)h(x) + f(x)g'(x)h(x) + f(x)g(x)h'(x)"))}이므로 ${DP} = ${nb('2' + X + '(' + pH(Bq) + ')(' + pH(Cq) + ')')} + ${nb('(' + pH(A) + ')(' + pH(Cq) + ')')} + ${nb('(' + pH(A) + ')(' + pH(Bq) + ') × ' + pp(Cq[1]))} = ${pH(dv)}이다.`,
        derived: [2, 3, 4]
      });
    }, { standard: S4 }),

    // 세 함수의 곱의 미분법을 두 함수의 곱으로 보아 끌어내는 과정의 빈칸(서술형 「설명해 보자」를 빈칸 고르기로)
    T('deriv-prod3-rule', '세 함수의 곱의 미분법', '①29', (d) => {
      const F = (s) => ms(s);
      const at = d.bool() ? 0 : 1, BA = box('㈎');
      const L2 = `${DP} = {${F('f(x)g(x)')}}′${F('h(x)')} + ${F("f(x)g(x)h'(x)")}`;
      const L3 = at === 0 ? `= {${BA}}${F('h(x)')} + ${F("f(x)g(x)h'(x)")}` : `= {${F("f'(x)g(x) + f(x)g'(x)")}}${F('h(x)')} + ${F("f(x)g(x)h'(x)")}`;
      const L4 = at === 0 ? `= ${F("f'(x)g(x)h(x) + f(x)g'(x)h(x) + f(x)g(x)h'(x)")}` : `= ${F("f'(x)g(x)h(x)")} + ${BA} + ${F("f(x)g(x)h'(x)")}`;
      const rows = at === 0
        ? [{ h: F("f'(x)g(x) + f(x)g'(x)"), ok: true }, { h: F("f'(x)g'(x)"), ok: false }, { h: F("f'(x)g(x)"), ok: false }, { h: F("f'(x) + g'(x)"), ok: false }]
        : [{ h: F("f(x)g'(x)h(x)"), ok: true }, { h: F("f'(x)g'(x)h(x)"), ok: false }, { h: F("f'(x)g(x)h'(x)"), ok: false }, { h: F("f(x)g'(x)h'(x)"), ok: false }];
      return oneQ(d, `다음은 미분가능한 세 함수 ${F('f(x)')}, ${F('g(x)')}, ${F('h(x)')}에 대하여 함수 ${F('y = f(x)g(x)h(x)')}의 도함수를 구하는 과정이다. ㈎에 알맞은 것은?`, rows, true, {
        figure: lines([`${F('f(x)g(x)h(x)')}를 두 함수 ${F('f(x)g(x)')}와 ${F('h(x)')}의 곱으로 보면`, nb(L2), nb(L3), nb(L4)]),
        explain: at === 0 ? `곱의 미분법으로 ${nb('{' + F('f(x)g(x)') + '}′ = ' + F("f'(x)g(x) + f(x)g'(x)"))}이다.` : `${F("{f'(x)g(x) + f(x)g'(x)}h(x)")}를 전개하면 ${F("f'(x)g(x)h(x) + f(x)g'(x)h(x)")}이므로 ㈎는 ${F("f(x)g'(x)h(x)")}이다.`
      });
    }, { standard: S4 }),

    // n = 0: f′(p) 하나(①6 의 정의로 구하는 미분계수도 같은 일), n = 1: 두 함수(하나는 곱) 의 미분계수를 칸마다
    T('deriv-value', '도함수에 수를 넣어 미분계수 구하기', '①30 ①6', (d, n) => {
      const p = d.int(-2, 3);
      if (n === 0) {
        const cs = d.bool() ? [d.int(-5, 5), d.int(-6, 6), d.int(-4, 4), nz(d, -3, 3)] : [d.int(-5, 5), d.int(-6, 6), d.int(-3, 3), d.int(-3, 3), d.pick([1, -1, 2])];
        const ans = fval(dcs(cs), p);
        return val(`함수 ${fIs(cs)}에 대하여 ${dfa(p)}의 값은?`, ans, {
          explain: `${nb(ms("f'(x)") + ' = ' + pH(dcs(cs)))}이므로 ${nb(dfa(p) + ' = ' + sT(ans))}이다.`, value: dJ(cs, p)
        });
      }
      const fcs = [d.int(-5, 5), d.int(-5, 5), nz(d, -4, 4), nz(d, -2, 2)], a = nz(d, -5, 5), b = nz(d, -3, 3), c = nz(d, -5, 5);
      const fd = fval(dcs(fcs), p), gd = (2 * p + a) * (b * p + c) + (p * p + a * p) * b;
      return slots(`두 함수의 식이 다음과 같을 때, ${jh(dfa(p), '과/와')} ${dfa(p, 'g')}의 값은?`, `${dfa(p)} = {0}, ${dfa(p, 'g')} = {1}`, [[fd, dJ(fcs, p)], [gd, `(2*${jn(p)}+${jn(a)})*(${jn(b)}*${jn(p)}+${jn(c)})+(${jn(p)}*${jn(p)}+${jn(a)}*${jn(p)})*${jn(b)}`]], {
        shown: `${dfa(p)} = ${sT(fd)}, ${dfa(p, 'g')} = ${sT(gd)}`,
        figure: lines([fIs(fcs), nb(ms('g(x)') + ' =') + ' (' + pH([0, a, 1]) + ')(' + pH([c, b]) + ')']),
        explain: `${nb(ms("f'(x)") + ' = ' + pH(dcs(fcs)))}에서 ${nb(dfa(p) + ' = ' + sT(fd))}이고, 곱의 미분법으로 ${nb(ms("g'(x)") + ' = (' + pH([a, 2]) + ')(' + pH([c, b]) + ') + (' + pH([0, a, 1]) + ') × ' + pp(b))}에서 ${nb(dfa(p, 'g') + ' = ' + sT(gd))}이다.`,
        derived: [2]
      });
    }, { count: 2, standard: S4 }),

    T('deriv-limit-n', '극한을 미분계수로 보아 지수 구하기', '①31', (d) => {
      const n = d.int(2, 9), a = nz(d, -4, 4), b = d.int(-5, 5), c0 = -(1 + a + b), k = n + 2 * a + b;
      const top = ms('x^n') + more([[a, X + sup(2)], [b, X], [c0, '']]);
      return val(`다음을 만족시키는 자연수 ${V('n')}의 값은?`, n, {
        signed: false,
        figure: hx(lim('x→1', frac(top, ms('x - 1'))) + ' = ' + sT(k)),
        explain: `${jh(nb(FX + ' = ' + ms('x^n') + more([[a, X + sup(2)], [b, X]])), '이라/라')} 하면 ${nb(fa(1) + ' = ' + sT(-c0))}이므로 (주어진 식) = ${lim('x→1', frac(ms('f(x) - f(1)'), ms('x - 1')))} = ${dfa(1)}이다. ${nb(ms("f'(x)") + ' = ' + ms('nx^{n-1}') + more([[2 * a, X], [b, '']]))}에서 ${nb(dfa(1) + ' = ' + ms('n') + more([[2 * a + b, '']]))}이므로 ${nb(ms('n') + ' = ' + n)}이다.`,
        value: `${jn(k)}-2*${jn(a)}-(${jn(b)})`, derived: [2]
      });
    }, { standard: S3 })
  ];

  // ════════════════════════════════════════════════════════════════
  // ── 미분법의 활용 ──
  const use = [
    // n = 0: f(p), f′(p) 의 값으로, n = 1: 곡선 위의 점과 접선의 기울기로
    T('use-coef', '함숫값과 미분계수로 미정계수 구하기', '①32', (d, n) => {
      const p = nz(d, -3, 3);
      if (n === 0) {
        const c = d.pick([1, 2, -1]), a = nz(d, -5, 5), b = nz(d, -6, 6), cs = [b, 0, a, c], s = fval(cs, p), k = fval(dcs(cs), p);
        const aE = `(${jn(k)}-3*${jn(c)}*${jn(p)}*${jn(p)})/(2*${jn(p)})`;
        return slots(`함수 ${nb(FX + ' =')} ${poly([[c, X + sup(3)]])} + ${Av}${X}${sup(2)} + ${Bv}에 대하여 ${nb(fa(p) + ' = ' + sT(s))}, ${nb(dfa(p) + ' = ' + sT(k))}일 때, 상수 ${Av}, ${Bv}의 값은?`, `${Av} = {0}, ${Bv} = {1}`,
          [[a, aE], [b, `${jn(s)}-${jn(c)}*${jn(p)}*${jn(p)}*${jn(p)}-(${aE})*${jn(p)}*${jn(p)}`]], {
            shown: `${Av} = ${sT(a)}, ${Bv} = ${sT(b)}`,
            explain: `${nb(ms("f'(x)") + ' = ' + poly([[3 * c, X + sup(2)], [2, Av + X]]))}이므로 ${nb(dfa(p) + ' = ' + poly([[3 * c * p * p, ''], [2 * p, Av]]) + ' = ' + sT(k))}에서 ${nb(ms('a') + ' = ' + sT(a))}이고, ${nb(fa(p) + ' = ' + sT(s))}에서 ${nb(ms('b') + ' = ' + sT(b))}이다.`,
            derived: [2, 3]
          });
      }
      const a = d.int(-5, 5), b = d.int(-6, 6), s = p * p + a * p + b, k = 2 * p + a;
      return slots(`곡선 ${yIs(ms('x^2 + ax + b'))} 위의 점 ${pt(p, s)}에서의 접선의 기울기가 ${sT(k)}일 때, 상수 ${Av}, ${Bv}의 값은?`, `${Av} = {0}, ${Bv} = {1}`,
        [[a, `${jn(k)}-2*${jn(p)}`], [b, `${jn(s)}-${jn(p)}*${jn(p)}-(${jn(k)}-2*${jn(p)})*${jn(p)}`]], {
          shown: `${Av} = ${sT(a)}, ${Bv} = ${sT(b)}`,
          explain: `${nb(ms('f(x) = x^2 + ax + b'))}라 하면 접선의 기울기는 ${nb(dfa(p) + ' = ' + poly([[2 * p, ''], [1, Av]]) + ' = ' + sT(k))}이므로 ${nb(ms('a') + ' = ' + sT(a))}이다. 점 ${jh(pt(p, s), '이/가')} 곡선 위에 있으므로 ${nb(sT(p * p) + ' + ' + pp(a) + ' × ' + pp(p) + ' + ' + Bv + ' = ' + sT(s))}에서 ${nb(ms('b') + ' = ' + sT(b))}이다.`,
          derived: [2]
        });
    }, { count: 2, standard: S4 }),

    T('use-self', '식 안에 미분계수가 든 함수', '①33', (d) => {
      const A = nz(d, -4, 4), Bc = nz(d, -4, 4), c = d.pick([1, 2]), top = 3 * A + 2 * Bc;
      if (top % (1 + c) !== 0) return null;
      const f1 = top / (1 + c), r = d.pick([-2, -1, 2, 3]), ans = 3 * A * r * r + 2 * Bc * r - c * f1;
      const f1E = `(3*${jn(A)}+2*${jn(Bc)})/(1+${c})`;
      const expr = pH([0, 0, Bc, A]) + ' − ' + (c === 1 ? '' : c) + X + dfa(1);
      return val(`다항함수 ${FX}가 ${jh(nb(FX + ' = ' + expr), '을/를')} 만족시킬 때, ${dfa(r)}의 값은?`, ans, {
        explain: `${dfa(1)}은 상수이므로 양변을 미분하면 ${nb(ms("f'(x)") + ' = ' + pH([0, 2 * Bc, 3 * A]) + ' − ' + (c === 1 ? '' : c) + dfa(1))}이다. ${nb(ms('x = 1'))}을 넣으면 ${nb(dfa(1) + ' = ' + sT(3 * A + 2 * Bc) + ' − ' + (c === 1 ? '' : c) + dfa(1))}에서 ${nb(dfa(1) + ' = ' + sT(f1))}이므로 ${nb(dfa(r) + ' = ' + sT(ans))}이다.`,
        value: `3*${jn(A)}*${jn(r)}*${jn(r)}+2*${jn(Bc)}*${jn(r)}-${c}*${f1E}`, derived: [2, 3]
      });
    }, { standard: S4 }),

    // n = 0: g(x) = (곱하는 식)·f(x) 에서 g′(p), n = 1: 거꾸로 g′(p) 로 f′(p)
    T('use-prod', '곱으로 정해진 함수의 미분계수', '①34', (d, n) => {
      const p = nz(d, -2, 2), a = nz(d, -4, 4), s = nz(d, -4, 4);
      if (n === 0) {
        const k = nz(d, -4, 4), ans = (2 * p + a) * s + (p * p + a * p) * k;
        return val(`미분가능한 함수 ${FX}에 대하여 함수 ${ms('g(x)')}를 ${nb(ms('g(x)') + ' = (' + pH([0, a, 1]) + ')' + FX)}라 하자. ${nb(fa(p) + ' = ' + sT(s))}, ${nb(dfa(p) + ' = ' + sT(k))}일 때, ${dfa(p, 'g')}의 값은?`, ans, {
          explain: `${nb(ms("g'(x)") + ' = (' + pH([a, 2]) + ')' + FX + ' + (' + pH([0, a, 1]) + ')' + ms("f'(x)"))}이므로 ${nb(dfa(p, 'g') + ' = ' + sT(2 * p + a) + ' × ' + pp(s) + ' + ' + pp(p * p + a * p) + ' × ' + pp(k) + ' = ' + sT(ans))}이다.`,
          value: `(2*${jn(p)}+${jn(a)})*${jn(s)}+(${jn(p)}*${jn(p)}+${jn(a)}*${jn(p)})*${jn(k)}`, derived: [2]
        });
      }
      const fd = nz(d, -4, 4), base = p ** 3 + a;
      if (base === 0) return null;
      const t = 3 * p * p * s + base * fd;
      return val(`미분가능한 함수 ${FX}에 대하여 함수 ${ms('g(x)')}를 ${nb(ms('g(x)') + ' = (' + pH([a, 0, 0, 1]) + ')' + FX)}라 하자. ${nb(fa(p) + ' = ' + sT(s))}, ${nb(dfa(p, 'g') + ' = ' + sT(t))}일 때, ${dfa(p)}의 값은?`, fd, {
        explain: `${nb(ms("g'(x)") + ' = 3' + X + sup(2) + FX + ' + (' + pH([a, 0, 0, 1]) + ')' + ms("f'(x)"))}이므로 ${nb(dfa(p, 'g') + ' = ' + 3 * p * p + ' × ' + pp(s) + ' + ' + pp(base) + dfa(p) + ' = ' + sT(t))}에서 ${nb(dfa(p) + ' = ' + sT(fd))}이다.`,
        value: `(${jn(t)}-3*${jn(p)}*${jn(p)}*${jn(s)})/(${jn(p)}*${jn(p)}*${jn(p)}+${jn(a)})`, derived: [3]
      });
    }, { count: 2, standard: S4 }),

    T('use-prod-limit', '극한 조건으로 곱의 미분계수 구하기', '①35', (d) => {
      const p = nz(d, -3, 3), s = nz(d, -5, 5), k = nz(d, -4, 4), t = nz(d, -5, 5), m = nz(d, -4, 4), ans = k * t + s * m;
      return val(`두 다항함수 ${ms('f(x)')}, ${ms('g(x)')}가 다음을 만족시킬 때, 함수 ${nb(ms('y = f(x)g(x)'))}의 ${nb(ms('x = ' + p))}에서의 미분계수는?`, ans, {
        figure: lines([hx(lim('x→' + p, frac(ms(minus('f(x)', s)), xm(p))) + ' = ' + sT(k)), hx(lim('x→' + p, frac(ms(minus('g(x)', t)), xm(p))) + ' = ' + sT(m))]),
        explain: `분모가 0으로 가므로 분자도 0으로 가야 하고, 두 함수는 연속이므로 ${nb(fa(p) + ' = ' + sT(s))}, ${nb(fa(p, 'g') + ' = ' + sT(t))}이다. 그러면 두 극한은 ${nb(dfa(p) + ' = ' + sT(k))}, ${nb(dfa(p, 'g') + ' = ' + sT(m))}이고, 곱의 미분법으로 ${nb(dfa(p) + fa(p, 'g') + ' + ' + fa(p) + dfa(p, 'g') + ' = ' + pp(k) + ' × ' + pp(t) + ' + ' + pp(s) + ' × ' + pp(m) + ' = ' + sT(ans))}이다.`,
        value: `${jn(k)}*${jn(t)}+${jn(s)}*${jn(m)}`
      });
    }, { standard: S4 }),

    T('use-zero', '계수가 든 곱 함수의 극한 조건', '①36', (d) => {
      const a = nz(d, -4, 4), q = nz(d, -3, 3), pc = nz(d, -4, 4), c = a * q, k = a * pc;
      return slots(`함수 ${nb(FX + ' =')} ${nb('(' + X + sup(2) + ' + ' + Av + ')(' + pH([q, pc]) + ')')}에 대하여 다음이 성립할 때, 상수 ${Av}, ${Kv}의 값은?`, `${Av} = {0}, ${Kv} = {1}`, [[a, `${jn(c)}/${jn(q)}`], [k, `${jn(c)}/${jn(q)}*${jn(pc)}`]], {
        shown: `${Av} = ${sT(a)}, ${Kv} = ${sT(k)}`,
        figure: hx(lim('h→0', frac(ms(minus('f(h)', c)), Hh)) + ' = ' + Kv),
        explain: `분모가 0으로 가므로 분자도 0으로 가야 하고 ${nb(fa(0) + ' = ' + poly([[q, Av]]) + ' = ' + sT(c))}에서 ${nb(ms('a') + ' = ' + sT(a))}이다. 그러면 ${nb(Kv + ' = ' + lim('h→0', frac(ms('f(h) - f(0)'), Hh)) + ' = ' + dfa(0))}이고, ${nb(ms("f'(x)") + ' = 2' + X + '(' + pH([q, pc]) + ') + (' + X + sup(2) + ' + ' + Av + ') × ' + pp(pc))}에서 ${nb(dfa(0) + ' = ' + poly([[pc, Av]]) + ' = ' + sT(k))}이다.`
      });
    }, { standard: S4 }),

    T('use-identity', '항등식의 양변을 미분해 미분계수 구하기', '①37', (d) => {
      const p = d.int(-4, 4), q = d.int(-5, 5), r = d.int(-3, 4), s = nz(d, -5, 5), t = nz(d, -5, 5), e1 = 1 + p + q;
      if (r === -1 || e1 === 0 || (e1 * s) % (1 + r) !== 0) return null;
      const g1 = (e1 * s) / (1 + r), top = (2 + p) * s + e1 * t - g1;
      if (top % (1 + r) !== 0) return null;
      const g1d = top / (1 + r), g1E = `(1+${jn(p)}+${jn(q)})*${jn(s)}/(1+${jn(r)})`;
      return slots(`두 다항함수 ${ms('f(x)')}, ${ms('g(x)')}가 모든 실수 ${X}에 대하여 ${nb('(' + pH([q, p, 1]) + ')' + FX + ' = (' + pH([r, 1]) + ')' + ms('g(x)'))}를 만족시킨다. ${nb(fa(1) + ' = ' + sT(s))}, ${nb(dfa(1) + ' = ' + sT(t))}일 때, ${jh(fa(1, 'g'), '과/와')} ${dfa(1, 'g')}의 값은?`,
        `${fa(1, 'g')} = {0}, ${dfa(1, 'g')} = {1}`, [[g1, g1E], [g1d, `((2+${jn(p)})*${jn(s)}+(1+${jn(p)}+${jn(q)})*${jn(t)}-${g1E})/(1+${jn(r)})`]], {
          shown: `${fa(1, 'g')} = ${sT(g1)}, ${dfa(1, 'g')} = ${sT(g1d)}`,
          explain: `${nb(ms('x = 1'))}을 넣으면 ${nb(cf(e1, fa(1)) + ' = ' + cf(1 + r, fa(1, 'g')))}에서 ${nb(fa(1, 'g') + ' = ' + sT(g1))}이다. 양변을 미분하면 ${nb('(' + pH([p, 2]) + ')' + FX + ' + (' + pH([q, p, 1]) + ')' + ms("f'(x)") + ' = ' + ms('g(x)') + ' + (' + pH([r, 1]) + ')' + ms("g'(x)"))}이고, ${nb(ms('x = 1'))}을 넣으면 ${nb(sT(2 + p) + ' × ' + pp(s) + ' + ' + pp(e1) + ' × ' + pp(t) + ' = ' + pp(g1) + (1 + r < 0 ? ' − ' : ' + ') + cf(Math.abs(1 + r), dfa(1, 'g')))}에서 ${nb(dfa(1, 'g') + ' = ' + sT(g1d))}이다.`,
          derived: [2]
        });
    }, { standard: S4 }),

    // n = 0: f(p), f′(p) 를 주고, n = 1: 다항식 xᵐ + cxʲ + e 를 (x ∓ 1)² 으로, n = 2: 나머지 두 개로 f′(p)
    T('use-rem', '미분으로 (x − a)²으로 나눈 나머지 구하기', '①42', (d, n) => {
      if (n === 0) {
        const p = nz(d, -3, 3), s = nz(d, -6, 6), k = nz(d, -5, 5), b = s - k * p;
        if (b === 0) return null;
        return linAns(`다항식 ${FX}에 대하여 ${nb(fa(p) + ' = ' + sT(s))}, ${nb(dfa(p) + ' = ' + sT(k))}일 때, ${FX}를 ${nb('(' + ms(xs(p)) + ')' + sup(2) + '으로')} 나누었을 때의 나머지는?`, k, b, X, {
          explain: `몫을 ${ms('Q(x)')}, 나머지를 ${ms('ax + b')}라 하면 ${nb(FX + ' = (' + ms(xs(p)) + ')' + sup(2) + ms('Q(x) + ax + b'))}이다. ${nb(ms('x = ' + p) + tail(Math.abs(p), '을/를'))} 넣으면 ${nb(sT(s) + ' = ' + poly([[p, Av], [1, Bv]]))}이고, 양변을 미분해 ${nb(ms('x = ' + p) + tail(Math.abs(p), '을/를'))} 넣으면 ${nb(sT(k) + ' = ' + Av)}이다. 따라서 ${nb(ms('a') + ' = ' + sT(k))}, ${nb(ms('b') + ' = ' + sT(b))}이다.`,
          facts: { calc: [[`(${jn(k)})+0`, 0], [`(${jn(s)}-${jn(k)}*${jn(p)})+0`, 1]] }
        });
      }
      if (n === 1) {
        const r = d.pick([1, -1]), m = d.int(5, 9), j = d.int(3, m - 2), c = nz(d, -4, 4), e = nz(d, -5, 5);
        const sg = (k) => (r === 1 || k % 2 === 0 ? 1 : -1), pr = sg(m) + c * sg(j) + e, dr = m * sg(m - 1) + c * j * sg(j - 1), b = pr - r * dr;
        if (dr === 0 || b === 0) return null;
        const S = (k) => (sg(k) === 1 ? '1' : '(-1)');
        const prE = `${S(m)}+${jn(c)}*${S(j)}+${jn(e)}`, drE = `${m}*${S(m - 1)}+${jn(c)}*${j}*${S(j - 1)}`;
        const P = poly([[1, X + sup(m)], [c, X + sup(j)], [e, '']]);
        return linAns(`다항식 ${jh(P, '을/를')} ${nb('(' + ms(xs(r)) + ')' + sup(2) + '으로')} 나누었을 때의 나머지는?`, dr, b, X, {
          explain: `${nb(FX + ' = ' + P)}라 하고 몫을 ${ms('Q(x)')}, 나머지를 ${ms('ax + b')}라 하면 ${nb(FX + ' = (' + ms(xs(r)) + ')' + sup(2) + ms('Q(x) + ax + b'))}이다. ${nb(ms('x = ' + r) + tail(Math.abs(r), '을/를'))} 넣으면 ${nb(fa(r) + ' = ' + poly([[r, Av], [1, Bv]]) + ' = ' + sT(pr))}이고, 양변을 미분해 ${nb(ms('x = ' + r) + tail(Math.abs(r), '을/를'))} 넣으면 ${nb(dfa(r) + ' = ' + Av + ' = ' + sT(dr))}이다. 따라서 나머지는 ${poly([[dr, X], [b, '']])}이다.`,
          facts: { calc: [[`(${drE})+0`, 0], [`(${prE}-(${jn(r)})*(${drE}))+0`, 1]] }
        });
      }
      const p = nz(d, -3, 3), a = nz(d, -5, 5), t = d.int(-6, 6), s = a * p + t;
      return val(`다항식 ${FX}를 ${nb(ms(xs(p)) + tail(Math.abs(p), '으로/로'))} 나누었을 때의 나머지가 ${sT(s)}이고, ${nb('(' + ms(xs(p)) + ')' + sup(2) + '으로')} 나누었을 때의 나머지가 ${nb(ms('ax ' + (t < 0 ? '- ' + (-t) : '+ ' + t)))}일 때, ${dfa(p)}의 값은? (단, ${Av}는 상수)`, a, {
        explain: `몫을 ${ms('Q(x)')}라 하면 ${nb(FX + ' = (' + ms(xs(p)) + ')' + sup(2) + ms('Q(x) + ax ' + (t < 0 ? '- ' + (-t) : '+ ' + t)))}이다. ${nb(fa(p) + ' = ' + sT(s))}이므로 ${nb(poly([[p, Av], [t, '']]) + ' = ' + sT(s))}에서 ${nb(ms('a') + ' = ' + sT(a))}이다. 양변을 미분해 ${nb(ms('x = ' + p) + tail(Math.abs(p), '을/를'))} 넣으면 ${nb(dfa(p) + ' = ' + Av + ' = ' + sT(a))}이다.`,
        value: `(${jn(s)}-(${jn(t)}))/${jn(p)}`
      });
    }, { count: 3, standard: S4 }),

    T('use-rem-div', '(x − a)²으로 나누어떨어질 때 미정계수', '①43', (d) => {
      const r = d.pick([1, -1]), m = d.int(6, 10), j = d.int(3, 5), c = nz(d, -4, 4);
      const sg = (k) => (r === 1 || k % 2 === 0 ? 1 : -1), S = (k) => (sg(k) === 1 ? '1' : '(-1)');
      const top = m * sg(m - 1) + c * j * sg(j - 1);                 // f′(r) = top + 2a·r = 0
      if (top % 2 !== 0) return null;
      const a = -top / (2 * r), b = -(sg(m) + c * sg(j) + a);
      if (a === 0 || b === 0) return null;
      const aE = r === 1 ? `-(${m}*${S(m - 1)}+${jn(c)}*${j}*${S(j - 1)})/2` : `(${m}*${S(m - 1)}+${jn(c)}*${j}*${S(j - 1)})/2`;
      const P = poly([[1, X + sup(m)], [c, X + sup(j)]]) + ' + ' + Av + X + sup(2) + ' + ' + Bv;
      return slots(`다항식 ${P}가 ${nb('(' + ms(xs(r)) + ')' + sup(2) + '으로')} 나누어떨어질 때, 상수 ${Av}, ${Bv}의 값은?`, `${Av} = {0}, ${Bv} = {1}`, [[a, aE], [b, `-(${S(m)}+${jn(c)}*${S(j)}+${aE})`]], {
        shown: `${Av} = ${sT(a)}, ${Bv} = ${sT(b)}`,
        explain: `${nb(FX + ' = ' + P)}라 하면 ${nb(FX + ' = (' + ms(xs(r)) + ')' + sup(2) + ms('Q(x)'))}이므로 ${nb(fa(r) + ' = 0')}이고, 양변을 미분해 ${nb(ms('x = ' + r) + tail(Math.abs(r), '을/를'))} 넣으면 ${nb(dfa(r) + ' = 0')}이다. ${nb(dfa(r) + ' = ' + poly([[top, ''], [2 * r, Av]]) + ' = 0')}에서 ${nb(ms('a') + ' = ' + sT(a))}이고, ${nb(fa(r) + ' = ' + poly([[sg(m) + c * sg(j), ''], [1, Av], [1, Bv]]) + ' = 0')}에서 ${nb(ms('b') + ' = ' + sT(b))}이다.`,
        derived: [2]
      });
    }, { standard: S4 })
  ];

  B.addTypes('11-2-3', 'diff', diff);
  B.addTypes('11-2-3', 'deriv', deriv);
  B.addTypes('11-2-3', 'use', use);
  B.kit.u23b = { xs, ge, lt, pieces, polyL, termsOf, prodJ, DP, FX, probe };
})(typeof window !== 'undefined' ? window : globalThis);
