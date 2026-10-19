// 고등학교 1학년 2학기(공통수학2) Ⅲ-2 유리함수와 무리함수 — 뒤쪽 묶음(무리식과 무리함수, 무리함수의 그래프, 무리함수의 그래프의 성질과 활용).
// 단원 틀·싣는 기준·뺀 것과 까닭은 10-2-7a.js 머리에 적었다. 도구는 10-2-7a.js 가 내보낸 B.kit.m1027 을 쓴다.
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
//  - 무리함수의 식은 y = s√(ax + b) + c 로 적고, 그래프는 시작점 (p, q)에서 한쪽으로 뻗는다(a > 0 이면 오른쪽, s > 0 이면 위쪽).
//  - 정의역·치역은 부등호를 고르는 칸까지 받는다(방향이 배울 거리이다). 제곱근을 거쳐야 나오는 칸은 facts.check 에 셈의 바탕을 적었다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, N, M, C, F, inline } = B.kit;
  const { LAB, MINUS, gcd, Q, isInt, nb, V, sup, tag, ex, nz, pm, poly, plane, f1, claimQ, rt, radAns, linAns, pointAns, ineqAns } = B.kit.mid;
  const K = B.kit.m1027;
  const { S5, T, stripH, X, Y, X2, Av, Bv, Cv, Kv, Mv, Nv, Pv, Qv, iq, jn, sgnT, sTxt, L, term, den, is, pt, yIs, fIs, setX, setY, jw, pickFn, comboPick, vals, genR, rfig, span, pick2, divisorsOf, quadsRoot, quadText, QN, shiftWords, par0, HALO } = K;

  // ── 무리식·무리함수의 글 ──
  const isSq = (n) => n >= 0 && Math.round(Math.sqrt(n)) ** 2 === n, sqr = (n) => Math.round(Math.sqrt(n));
  const R1 = (a, b) => rt(L(a, b));                                                             // √(ax + b)
  const rootR = (s, a, b, c) => `${s < 0 ? MINUS : ''}${R1(a, b)}${c ? ' ' + sgnT(c) : ''}`;   // s√(ax + b) + c
  const coefIn = (a) => (a === 1 ? '' : a === -1 ? MINUS : iq(a));
  const rootStd = (s, a, p, q) => `${s < 0 ? MINUS : ''}${rt(`${coefIn(a)}${p === 0 ? X : a === 1 ? den(p) : `(${den(p)})`}`)}${q ? ' ' + sgnT(q) : ''}`;   // s√(a(x − p)) + q
  const RT = { '>=': '≥', '<=': '≤', '>': '&gt;', '<': '&lt;' };
  const fInv = `${V('f')}<sup>−1</sup>`;
  // 정의역과 치역 「{x | x [부등호] [±][ ]}, {y | y [부등호] [±][ ]}」
  const drRoot = (text, relX, p, relY, q, o) => inline(text, `정의역: ${setX(`${X} {0} {1}`)}<br>치역: ${setY(`${Y} {2} {3}`)}`,
    [{ rel: true, answer: relX }, { answer: p, signed: true }, { rel: true, answer: relY }, { answer: q, signed: true }],
    Object.assign({}, o, { shown: `정의역: ${setX(`${X} ${RT[relX]} ${iq(p)}`)}, 치역: ${setY(`${Y} ${RT[relY]} ${iq(q)}`)}` }));
  // 고르기의 값을 견줄 점: lo 보다 큰 쪽(근호 안이 0 이상인 곳)
  // 근호가 든 식은 근호 표와 덮개 줄 때문에 어림보다 넓다 — 근호 하나에 0.9em 씩 더 잡아 글씨를 줄인다(읽기 글꼴을 입힌 360px 화면에서 잼).
  const exR = (h) => ex(h, 0.9 * (String(h).match(/class="mb-rad"/g) || []).length);
  const eqs = (A, B2) => (A === B2 ? A : `${A} = ${B2}`);   // 두 꼴이 같은 글이면 한 번만 적는다
  const after = (lo) => [0.37, 1.6, 3.3, 5.9, 9.4].map((t) => [lo + t]);
  // 시작점 (p, q)에서 뻗는 쪽의 말
  const way = (a, s) => `${a > 0 ? '오른쪽' : '왼쪽'} ${s > 0 ? '위' : '아래'}`;

  // 원점에서 한쪽으로 뻗는 작은 곡선 그림(고르기 보기). dirX: 1 오른쪽 · −1 왼쪽, dirY: 1 위 · −1 아래
  function mini(dirX, dirY, name) {
    const W = 112, Hh = 92, ox = 56, oy = 46;
    const pts = []; for (let i = 0; i <= 40; i += 1) { const t = 40 * i / 40; pts.push([ox + dirX * t, oy - dirY * Math.sqrt(t) * 5.6]); }
    const axis = 'stroke:#1f2933;stroke-width:1', it = "font-style:italic;font-family:'MB Math','Times New Roman',serif";
    const out = `<line x1="8" y1="${oy}" x2="${W - 10}" y2="${oy}" style="${axis}"/><path d="M${W - 4} ${oy}l-7 -3.4v6.8z" style="fill:#1f2933"/>`
      + `<line x1="${ox}" y1="${Hh - 6}" x2="${ox}" y2="10" style="${axis}"/><path d="M${ox} 4l-3.4 7h6.8z" style="fill:#1f2933"/>`
      + `<text x="${W - 8}" y="${oy + 14}" text-anchor="middle" style="font-size:12px;fill:#1f2933;${it}">x</text><text x="${ox + 9}" y="12" text-anchor="middle" style="font-size:12px;fill:#1f2933;${it}">y</text>`
      + `<text x="${ox + (dirX > 0 ? -7 : 7)}" y="${oy + (dirY > 0 ? 13 : -5)}" text-anchor="middle" style="font-size:11px;fill:#1f2933;font-weight:600">O</text>`
      + `<path d="M${pts.map(([x, y]) => f1(x) + ' ' + f1(y)).join('L')}" style="fill:none;stroke:#1d4ed8;stroke-width:2;stroke-linecap:round"/>`;
    return `<svg class="mb-geo" viewBox="0 0 ${W} ${Hh}" width="${W}" role="img" aria-label="그래프 ${name}: 원점에서 시작하여 ${dirX > 0 ? '오른쪽' : '왼쪽'} ${jw(dirY > 0 ? '위' : '아래', '으로/로')} 뻗는 곡선">${out}</svg>`;
  }
  const picks = (figs) => '<div style="display:grid;grid-template-columns:repeat(2,max-content);gap:8px 14px">' + figs.map((h, i) => `<div style="display:grid;gap:1px;justify-items:start"><div style="font-size:0.95rem;font-weight:600">${LAB[i]}</div>${h}</div>`).join('') + '</div>';

  B.kit.m1027b = { isSq, sqr, R1, rootR, coefIn, rootStd, RT, fInv, drRoot, after, way, mini, picks };

  // ════════════════════════════════════════════════════════════════
  // 무리식과 무리함수
  // ════════════════════════════════════════════════════════════════
  const iexpr = [
    T('iexpr-real', '무리식의 값이 실수가 되는 x의 값의 범위', '②1', (d, n) => {
      const a = d.int(-4, 3), b = a + d.int(1, 5), m = d.int(1, 3), k = d.int(1, 3);
      const P1 = R1(m, -m * a), P2 = R1(-k, k * b);
      let h, lowRel, highRel, why;
      if (n === 0) {
        h = `${P1} ${d.bool() ? '+' : MINUS} ${P2}`; lowRel = '<='; highRel = '<=';
        why = `근호 안의 식의 값이 0 이상이어야 하므로 ${m === 1 && a === 0 ? nb(`${X} ≥ 0`) : `${nb(`${L(m, -m * a)} ≥ 0`)}에서 ${nb(`${X} ≥ ${iq(a)}`)}`}, ${nb(`${L(-k, k * b)} ≥ 0`)}에서 ${nb(`${X} ≤ ${iq(b)}`)}이다.`;
      } else {
        const top = d.bool(); h = top ? frac(P1, P2) : frac(P2, P1); lowRel = top ? '<=' : '<'; highRel = top ? '<' : '<=';
        why = `분자의 근호 안은 0 이상이고, 분모의 근호 안은 0이 되면 안 되므로 0보다 커야 한다. 따라서 ${top ? `${nb(`${L(m, -m * a)} ≥ 0`)}, ${nb(`${L(-k, k * b)} &gt; 0`)}` : `${nb(`${L(-k, k * b)} ≥ 0`)}, ${nb(`${L(m, -m * a)} &gt; 0`)}`}이다.`;
      }
      return inline(`다음 식의 값이 실수가 되도록 하는 실수 ${X}의 값의 범위를 구하시오.`, `{0} {1} ${X} {2} {3}`, [{ answer: a, signed: true }, { rel: true, answer: lowRel }, { rel: true, answer: highRel }, { answer: b, signed: true }], {
        figure: exR(h), shown: nb(`${iq(a)} ${RT[lowRel]} ${X} ${RT[highRel]} ${iq(b)}`), explain: `${why} 따라서 ${nb(`${iq(a)} ${RT[lowRel]} ${X} ${RT[highRel]} ${iq(b)}`)}이다.`,
        facts: { calc: [[`${jn(m * a)}/${m}`, 0], [`${jn(k * b)}/${k}`, 3]], rule: 'real-' + n } });
    }, { count: 2 }),
    T('iexpr-conj-const', '근호가 든 합과 차의 곱(수가 남는 것)', '②2', (d) => {
      const m = d.int(1, 3), [a, b] = pick2(d, [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
      const A = R1(m, a), Bq = R1(m, b);
      return N('다음 식을 간단히 한 값은?', a - b, { signed: true, figure: exR(`(${A} + ${Bq})(${A} ${MINUS} ${Bq})`),
        explain: `(${A})${sup(2)} ${MINUS} (${Bq})${sup(2)} = (${L(m, a)}) ${MINUS} (${L(m, b)}) = ${iq(a - b)}이다.`,
        facts: { value: `${jn(a)}-(${jn(b)})` } });
    }),
    T('iexpr-conj', '근호가 든 합과 차의 곱(일차식이 남는 것)', '②2', (d, n) => {
      if (n === 0) {
        const [p, q] = pick2(d, [1, 2, 3, 4]), [a, b] = pick2(d, [-5, -3, -2, -1, 1, 2, 3, 4, 5]);
        const A = R1(p, a), Bq = R1(q, b);
        return linAns('다음 식을 간단히 하시오.', p - q, a - b, X, { figure: exR(`(${A} + ${Bq})(${A} ${MINUS} ${Bq})`),
          explain: `(${A})${sup(2)} ${MINUS} (${Bq})${sup(2)} = (${L(p, a)}) ${MINUS} (${L(q, b)}) = ${L(p - q, a - b)}이다.`,
          facts: { calc: [[`${p}-${q}`, 0], [`${jn(a)}-(${jn(b)})`, 1]], rule: 'conj-2' } });
      }
      const c = d.int(1, 4), p = d.int(1, 4), a = d.int(-4, 6);
      if (c * c - a === 0) return null;
      const A = R1(p, a);
      return linAns('다음 식을 간단히 하시오.', -p, c * c - a, X, { figure: exR(`(${c} + ${A})(${c} ${MINUS} ${A})`),
        explain: `${c}${sup(2)} ${MINUS} (${A})${sup(2)} = ${c * c} ${MINUS} (${L(p, a)}) = ${L(-p, c * c - a)}이다.`,
        facts: { calc: [[`0-${p}`, 0], [`${c}*${c}-(${jn(a)})`, 1]], rule: 'conj-1' } });
    }, { count: 2 }),
    T('iexpr-rationalize', '분모의 유리화로 무리식 간단히 하기', '②3', (d, n) => {
      if (n === 0) {
        const a = d.int(-3, 6), b = a - d.int(1, 4), m = d.pick([1, 1, 2]), c = m * (a - b), plus = d.bool();
        const A = R1(1, a), Bq = R1(1, b), fA = (x) => Math.sqrt(x + a), fB = (x) => Math.sqrt(x + b), sg = plus ? -1 : 1;
        const mm = (s, k) => (k === 1 ? s : `${k}(${s})`), pair = (s) => `${A} ${s > 0 ? '+' : MINUS} ${Bq}`;
        const right = { h: mm(pair(sg), m), f: (x) => m * (fA(x) + sg * fB(x)) };
        const wrongs = [{ h: mm(pair(-sg), m), f: (x) => m * (fA(x) - sg * fB(x)) }, { h: mm(pair(sg), c === m ? 2 * m : c), f: (x) => (c === m ? 2 * m : c) * (fA(x) + sg * fB(x)) }, { h: mm(`${Bq} ${sg > 0 ? '+' : MINUS} ${A}`, m), f: (x) => m * (fB(x) + sg * fA(x)) },
          { h: frac(pair(sg), c), f: (x) => (fA(x) + sg * fB(x)) / c }, { h: mm(pair(sg), m + 1), f: (x) => (m + 1) * (fA(x) + sg * fB(x)) }];
        return pickFn(d, '다음 식을 간단히 하면?', { figure: exR(frac(c, pair(-sg))), pts: after(-b),
          explain: `분모와 분자에 ${jw(pair(sg), '을/를')} 곱하면 분모는 (${L(1, a)}) ${MINUS} (${L(1, b)}) = ${a - b}이므로 ${a - b === 1 ? '' : `${frac(`${c}(${pair(sg)})`, a - b)} = `}${right.h}이다.` }, right, wrongs);
      }
      const c = d.int(1, 3), n0 = d.int(-3, 6), m0 = n0 - c * c, plus = d.bool(), A = R1(1, n0), fA = (x) => Math.sqrt(x + n0);
      const right = { h: `${A} ${plus ? MINUS : '+'} ${c}`, f: (x) => fA(x) + (plus ? -c : c) };
      const wrongs = [{ h: `${A} ${plus ? '+' : MINUS} ${c}`, f: (x) => fA(x) + (plus ? c : -c) }, { h: `${c} ${MINUS} ${A}`, f: (x) => c - fA(x) }, { h: `${A} ${plus ? MINUS : '+'} ${c * c}`, f: (x) => fA(x) + (plus ? -1 : 1) * c * c },
        { h: `${MINUS}${A} ${plus ? '+' : MINUS} ${c}`, f: (x) => -fA(x) + (plus ? c : -c) }, { h: frac(`${A} ${plus ? MINUS : '+'} ${c}`, L(1, m0)), f: (x) => (fA(x) + (plus ? -c : c)) / (x + m0) }];
      return pickFn(d, '다음 식을 간단히 하면?', { figure: exR(frac(L(1, m0), `${A} ${plus ? '+' : MINUS} ${c}`)), pts: after(-n0),
        explain: `분모와 분자에 ${jw(`${A} ${plus ? MINUS : '+'} ${c}`, '을/를')} 곱하면 분모는 (${L(1, n0)}) ${MINUS} ${c * c} = ${L(1, m0)}이므로 약분하면 ${right.h}이다.` }, right, wrongs);
    }, { count: 2 }),
    T('iexpr-two', '무리식 두 분수의 덧셈·뺄셈', '②4', (d, n) => {
      if (n === 0) {
        const a = d.int(-3, 6), c = d.int(1, 3), m = d.int(1, 3), minus = d.bool(), A = R1(1, a), Dd = L(1, a - c * c), fA = (x) => Math.sqrt(x + a);
        const h = `${frac(m, `${A} ${MINUS} ${c}`)} ${minus ? MINUS : '+'} ${frac(m, `${A} + ${c}`)}`;
        const formC = { h: frac(2 * m * c, Dd), f: (x) => 2 * m * c / (x + a - c * c) }, formR = { h: frac(`${2 * m}${A}`, Dd), f: (x) => 2 * m * fA(x) / (x + a - c * c) };
        const right = minus ? formC : formR;
        const wrongs = [minus ? formR : formC, { h: frac(2 * m, Dd), f: (x) => 2 * m / (x + a - c * c) }, { h: frac(2 * m * c, L(1, a + c * c)), f: (x) => 2 * m * c / (x + a + c * c) }, { h: frac(m * c, Dd), f: (x) => m * c / (x + a - c * c) }, { h: frac(`${2 * m}${A}`, L(1, a + c * c)), f: (x) => 2 * m * fA(x) / (x + a + c * c) }];
        return pickFn(d, '다음 식을 간단히 하면?', { figure: exR(h), pts: after(-a + 0.01).filter(([x]) => Math.abs(x + a - c * c) > 0.05),
          explain: `통분하면 분모는 (${A} ${MINUS} ${c})(${A} + ${c}) = ${Dd}이고, 분자는 ${m === 1 ? '' : m}(${A} + ${c}) ${minus ? MINUS : '+'} ${m === 1 ? '' : m}(${A} ${MINUS} ${c})이므로 ${right.h}이다.` }, right, wrongs);
      }
      if (n === 1) {
        const h0 = d.int(-1, 3), A = R1(1, h0), Bq = R1(1, h0 - 1), Cq = R1(1, h0 - 2), f = (k) => (x) => Math.sqrt(x + k);
        const h = `${frac(1, `${A} + ${Bq}`)} + ${frac(1, `${Bq} + ${Cq}`)}`;
        const right = { h: `${A} ${MINUS} ${Cq}`, f: (x) => f(h0)(x) - f(h0 - 2)(x) };
        const wrongs = [{ h: `${A} + ${Cq}`, f: (x) => f(h0)(x) + f(h0 - 2)(x) }, { h: `${Cq} ${MINUS} ${A}`, f: (x) => f(h0 - 2)(x) - f(h0)(x) }, { h: `${A} ${MINUS} ${Bq}`, f: (x) => f(h0)(x) - f(h0 - 1)(x) },
          { h: `2(${A} ${MINUS} ${Cq})`, f: (x) => 2 * (f(h0)(x) - f(h0 - 2)(x)) }, { h: `${A} ${MINUS} 2${Bq} + ${Cq}`, f: (x) => f(h0)(x) - 2 * f(h0 - 1)(x) + f(h0 - 2)(x) }];
        return pickFn(d, '다음 식을 간단히 하면?', { figure: exR(h), pts: after(2 - h0),
          explain: `${frac(1, `${A} + ${Bq}`)} = ${A} ${MINUS} ${Bq}, ${frac(1, `${Bq} + ${Cq}`)} = ${Bq} ${MINUS} ${Cq}(분모의 근호 안의 차가 1이다)이므로 더하면 ${right.h}이다.` }, right, wrongs);
      }
      const c = d.int(1, 3), S = rt(X), c2 = c * c, fs = (x) => Math.sqrt(x);
      const h = `${frac(`${c} ${MINUS} ${S}`, `${c} + ${S}`)} + ${frac(`${c} + ${S}`, `${c} ${MINUS} ${S}`)}`;
      const right = { h: frac(`2(${c2} + ${X})`, `${c2} ${MINUS} ${X}`), f: (x) => 2 * (c2 + x) / (c2 - x) };
      const wrongs = [{ h: frac(`2(${c2} ${MINUS} ${X})`, `${c2} + ${X}`), f: (x) => 2 * (c2 - x) / (c2 + x) }, { h: frac(`${4 * c}${S}`, `${c2} ${MINUS} ${X}`), f: (x) => 4 * c * fs(x) / (c2 - x) }, { h: frac(`2(${c2} + ${X})`, `${X} ${MINUS} ${c2}`), f: (x) => 2 * (c2 + x) / (x - c2) },
        { h: frac(`${c2} + ${X}`, `${c2} ${MINUS} ${X}`), f: (x) => (c2 + x) / (c2 - x) }, { h: frac(`2(${c2} + ${X})`, `${c} ${MINUS} ${X}`), f: (x) => 2 * (c2 + x) / (c - x) }];
      return pickFn(d, '다음 식을 간단히 하면?', { figure: exR(h), pts: [[0.37], [1.6], [3.3], [5.9], [11.4], [20.3]].filter(([x]) => Math.abs(x - c2) > 0.05),
        explain: `통분하면 분모는 (${c} + ${S})(${c} ${MINUS} ${S}) = ${c2} ${MINUS} ${X}이고, 분자는 (${c} ${MINUS} ${S})${sup(2)} + (${c} + ${S})${sup(2)} = 2(${c2} + ${X})이므로 ${right.h}이다.` }, right, wrongs);
    }, { count: 3 }),
    T('iexpr-ratio', '분자와 분모가 모두 무리식인 분수', '②5', (d) => {
      const a = d.pick([-2, -1, 1, 2]), sg = pm(d), A = rt(X), Bq = R1(1, a), Rq = rt(poly([[1, X2], [a, X]]));
      // (√x + sg√(x + a))/(√x − sg√(x + a)) = (2x + a + 2sg√(x² + ax))/(−a)
      const c1 = -2 / a, c0 = -1, cr = -2 * sg / a, fs = (x) => Math.sqrt(x * x + a * x);
      const show = (u, v, w) => `${L(u, v)} ${w < 0 ? MINUS : '+'} ${Math.abs(w) === 1 ? '' : Math.abs(w)}${Rq}`;
      const right = { h: show(c1, c0, cr), f: (x) => c1 * x + c0 + cr * fs(x) };
      const wrongs = [{ h: show(c1, c0, -cr), f: (x) => c1 * x + c0 - cr * fs(x) }, { h: show(c1, -c0, cr), f: (x) => c1 * x - c0 + cr * fs(x) }, { h: show(-c1, c0, cr), f: (x) => -c1 * x + c0 + cr * fs(x) }, { h: show(-c1, -c0, -cr), f: (x) => -(c1 * x + c0 + cr * fs(x)) }];
      return pickFn(d, '다음 식을 간단히 하면?', { figure: exR(frac(`${A} ${sg > 0 ? '+' : MINUS} ${Bq}`, `${A} ${sg > 0 ? MINUS : '+'} ${Bq}`)), pts: after(Math.max(0, -a) + 0.01),
        explain: `분모와 분자에 ${jw(`${A} ${sg > 0 ? '+' : MINUS} ${Bq}`, '을/를')} 곱하면 분모는 ${X} ${MINUS} (${L(1, a)}) = ${iq(-a)}, 분자는 ${poly([[2, X], [a, '']])} ${sg > 0 ? '+' : MINUS} 2${Rq}이므로 ${right.h}이다.` }, right, wrongs, 5 - 1);
    }),
    T('iexpr-value', '대칭인 두 무리식의 합에 수 넣기', '②6', (d) => {
      const c = d.pick([1, 2, 3]), [m, n] = d.pick([[1, 2], [1, 3], [1, 5], [1, 6], [1, 7], [2, 2], [2, 3], [2, 5], [3, 2], [3, 3]]);
      if ((2 * m) % c !== 0 || 2 * m / c < 2 || m * m * n < c * c) return null;
      const A = R1(1, c), Bq = R1(1, -c), xs = `${m === 1 ? '' : m}${rt(n)}`;
      const h = `${frac(`${A} ${MINUS} ${Bq}`, `${A} + ${Bq}`)} + ${frac(`${A} + ${Bq}`, `${A} ${MINUS} ${Bq}`)}`;
      return radAns(`${nb(`${X} = ${xs}`)}일 때, 다음 식의 값은?`, 2 * m / c, n, { figure: exR(h),
        explain: `통분하면 ${frac(`(${A} ${MINUS} ${Bq})${sup(2)} + (${A} + ${Bq})${sup(2)}`, `(${L(1, c)}) ${MINUS} (${L(1, -c)})`)} = ${frac(`4${X}`, 2 * c)} = ${term(Q(2, c), X)}이므로 ${jw(is(X, xs), '을/를')} 넣으면 ${2 * m / c}${rt(n)}이다.`,
        facts: { calc: [[`2*${m}/${c}`, 0], [String(n), 1]], derived: [2] } });
    }),
    T('iexpr-domain', '무리함수의 정의역', '②8', (d, n) => {
      const a = (n === 0 ? 1 : -1) * d.int(2, 5), b = d.until(() => nz(d, -9, 9), (v) => v % a !== 0), c = d.int(-5, 5), s = pm(d), r = Q(-b, a);
      const ge = a > 0, set = (rel, v) => setX(`${X} ${rel} ${iq(v)}`);
      const right = set(ge ? '≥' : '≤', r), wrongs = [set(ge ? '≤' : '≥', r), set(ge ? '≥' : '≤', Q(b, a)), set(ge ? '≥' : '≤', Q(-a, b)), set(ge ? '≥' : '≤', Q(-b))];
      const rows = d.shuffle([right].concat(wrongs));
      if (new Set(rows.map(stripH)).size !== 5) return null;
      return C(`함수 ${yIs(rootR(s, a, b, c))}의 정의역은?`, rows, rows.indexOf(right), {
        explain: `근호 안의 식의 값이 0 이상이어야 하므로 ${nb(`${L(a, b)} ≥ 0`)}${a < 0 ? `, 양변을 음수 ${jw(iq(a), '으로/로')} 나누면 부등호의 방향이 바뀌어` : '에서'} ${nb(`${X} ${ge ? '≥' : '≤'} ${iq(r)}`)}이다.`,
        facts: { truth: rows.map((x) => x === right), want: true, rule: 'idomain-' + n } });
    }, { count: 2 }),
    T('iexpr-same-domain', '두 무리함수의 정의역이 같을 때 상수', '②9', (d) => {
      const m = d.int(2, 5), r = nz(d, -4, 4), k = d.int(2, 5), c1 = nz(d, -6, 6), c2 = nz(d, -6, 6);
      if (k === m) return null;
      return N(`두 무리함수 ${yIs(rootR(1, m, -m * r, c1))}, ${yIs(`${MINUS}${rt(`${k}${X} + ${Av}`)} ${sgnT(c2)}`)}의 정의역이 같을 때, 상수 ${Av}의 값은?`, -k * r, { signed: true,
        explain: `첫째 함수의 정의역은 ${setX(`${X} ≥ ${iq(r)}`)}이고, 둘째 함수의 정의역은 ${setX(`${X} ≥ ${MINUS}${frac(Av, k)}`)}이다. ${is(`${MINUS}${frac(Av, k)}`, r)}이므로 ${is(Av, -k * r)}이다.`,
        facts: { value: `${k}*(${jn(-m * r)})/${m}` } });
    })
  ];

  // ════════════════════════════════════════════════════════════════
  // 무리함수의 그래프
  // ════════════════════════════════════════════════════════════════
  const igraph = [
    T('igraph-match', 'y = √(ax)의 그래프 넷 가운데 식에 맞는 것 고르기', '②10', (d) => {
      const [a1, a2] = pick2(d, [1, 2, 3, 4, 6, 8]).sort((u, v) => u - v), curves = d.shuffle([a1, a2, -a1, -a2]), want = d.pick(curves);
      const roots = curves.map((a, i) => ({ a, p: 0, q: 0, s: 1, name: LAB[i], hideStart: true }));
      const rightSide = curves.filter((a) => a > 0).sort((u, v) => v - u), leftSide = curves.filter((a) => a < 0).sort((u, v) => u - v);
      const say = `오른쪽으로 뻗은 두 곡선 가운데 ${jw(LAB[curves.indexOf(rightSide[0])], '이/가')} ${LAB[curves.indexOf(rightSide[1])]}보다 위에 있고, 왼쪽으로 뻗은 두 곡선 가운데 ${jw(LAB[curves.indexOf(leftSide[0])], '이/가')} ${LAB[curves.indexOf(leftSide[1])]}보다 위에 있다.`;
      const figure = rfig({ x: [-5, 5], y: [-1, 5], roots, ticks: 'none', grid: false, lattice: false, say });
      const ans = curves.indexOf(want);
      return C(`그림은 네 함수 ${[a1, a2, -a1, -a2].map((a) => yIs(rt(term(a, X)))).join(', ')}의 그래프이다. 함수 ${yIs(rt(term(want, X)))}의 그래프는?`, LAB.slice(0, 4), ans, { figure,
        explain: `${jw(yIs(rt(term(want, X))), '은/는')} ${X}의 계수가 ${jw(want > 0 ? '양수이므로 오른쪽' : '음수이므로 왼쪽', '으로/로')} 뻗고, ${X}의 계수의 절댓값이 클수록 ${X}축에서 멀어진다. 따라서 ${LAB[ans]}이다.`,
        facts: { truth: LAB.slice(0, 4).map((_, i) => i === ans), want: true } });
    }),
    T('igraph-basic-dr', 'y = ±√(±ax)의 정의역과 치역', '②10', (d) => {
      const a = pm(d) * d.int(2, 6), s = pm(d), relX = a > 0 ? '>=' : '<=', relY = s > 0 ? '>=' : '<=';
      return inline(`함수 ${yIs(`${s < 0 ? MINUS : ''}${rt(term(a, X))}`)}의 정의역과 치역을 구하시오.`, `정의역: ${setX(`${X} {0} 0`)}<br>치역: ${setY(`${Y} {1} 0`)}`, [{ rel: true, answer: relX }, { rel: true, answer: relY }], {
        shown: `정의역: ${setX(`${X} ${RT[relX]} 0`)}, 치역: ${setY(`${Y} ${RT[relY]} 0`)}`,
        explain: `근호 안의 ${nb(`${term(a, X)} ≥ 0`)}이어야 하므로 ${nb(`${X} ${RT[relX]} 0`)}이고, 근호의 값은 0 이상이므로 ${s > 0 ? '' : `앞에 −가 붙으면 `}${nb(`${Y} ${RT[relY]} 0`)}이다.`,
        facts: { rule: 'basic-dr', sign: [a > 0 ? 1 : -1, s] } });
    }),
    T('igraph-inverse', '무리함수의 역함수(이차함수의 일부)', '②11', (d) => {
      const s = pm(d), p = d.int(-5, 5), q = nz(d, -4, 4), c = q * q + p, rel = s > 0 ? '>=' : '<=';
      if (c === 0) return null;
      return inline(`함수 ${yIs(rootR(s, 1, -p, q))}의 역함수를 구하시오.`, `${Y} = ${X2} {0}${X} {1} (${X} {2} {3})`, [{ answer: -2 * q, signed: true }, { answer: c, signed: true }, { rel: true, answer: rel }, { answer: q, signed: true }], {
        shown: `${Y} = ${poly([[1, X2], [-2 * q, X], [c, '']])} (${X} ${RT[rel]} ${iq(q)})`,
        explain: `${yIs(rootR(s, 1, -p, q))}의 치역은 ${setY(`${Y} ${RT[rel]} ${iq(q)}`)}이다. ${jw(X, '을/를')} ${Y}에 대한 식으로 나타내면 ${nb(`${X} = (${L(1, -q, Y)})${sup(2)}${p ? ' ' + sgnT(p) : ''}`)}이고, ${jw(X, '과/와')} ${jw(Y, '을/를')} 바꾸면 ${nb(`${Y} = ${poly([[1, X2], [-2 * q, X], [c, '']])}`)}이다. 역함수의 정의역은 처음 함수의 치역이므로 ${nb(`${X} ${RT[rel]} ${iq(q)}`)}이다.`,
        facts: { calc: [[`0-2*(${jn(q)})`, 0], [`${jn(q)}*${jn(q)}+(${jn(p)})`, 1], [jn(q), 3]], derived: [2] } });
    }),
    T('igraph-dr', 'y = √(ax + b) + c 의 정의역과 치역', '②12', (d, n) => {
      const s = n === 2 ? -1 : 1, a = (n === 1 ? -1 : n === 0 ? 1 : pm(d)) * d.int(1, 4), p = nz(d, -5, 5), q = nz(d, -5, 5), b = -a * p, relX = a > 0 ? '>=' : '<=', relY = s > 0 ? '>=' : '<=';
      return drRoot(`함수 ${yIs(rootR(s, a, b, q))}의 정의역과 치역을 구하시오.`, relX, p, relY, q, {
        explain: `${yIs(eqs(rootR(s, a, b, q), rootStd(s, a, p, q)))}이므로 그래프는 점 ${pt(p, q)}에서 시작하여 ${jw(way(a, s), '으로/로')} 뻗는다. 정의역은 ${setX(`${X} ${RT[relX]} ${iq(p)}`)}, 치역은 ${setY(`${Y} ${RT[relY]} ${iq(q)}`)}이다.`,
        facts: { calc: [[`0-(${jn(b)})/(${jn(a)})`, 1], [jn(q), 3]], rule: 'idr-' + n } });
    }, { count: 3 }),
    T('igraph-shift-amount', '무리함수의 그래프는 y = ±√(kx)의 그래프를 얼마만큼 옮긴 것인가', '②13', (d, n) => {
      const s = n === 0 ? 1 : -1, a = pm(d) * d.int(1, 5), p = nz(d, -5, 5), c = nz(d, -6, 6), b = -a * p, base = `${s < 0 ? MINUS : ''}${rt(Kv + X)}`;
      return vals(`함수 ${yIs(rootR(s, a, b, c))}의 그래프는 함수 ${yIs(base)}의 그래프를 ${X}축의 방향으로 ${Mv}만큼, ${Y}축의 방향으로 ${Nv}만큼 평행이동한 것이다. 상수 ${Kv}, ${Mv}, ${Nv}의 값을 구하시오.`, [[Kv, a], [Mv, p], [Nv, c]], {
        explain: rootR(s, a, b, c) === rootStd(s, a, p, c) ? `${yIs(rootR(s, a, b, c))}에서 근호 안의 ${X}의 계수가 1이므로 ${is(Kv, a)}이고, ${is(Mv, p)}, ${is(Nv, c)}이다.` : `${yIs(rootR(s, a, b, c))} = ${rootStd(s, a, p, c)}이므로 ${is(Kv, a)}, ${is(Mv, p)}, ${is(Nv, c)}이다.`,
        facts: { calc: [[jn(a), 0], [`0-(${jn(b)})/(${jn(a)})`, 1], [jn(c), 2]], rule: 'ishift-' + n } });
    }, { count: 2 }),
    T('igraph-shift-point', '평행이동한 무리함수의 그래프가 지나는 점', '②14 심5', (d, n) => {
      const m = nz(d, -4, 4), t = nz(d, -4, 4);
      if (n === 0) {
        const a = d.pick([1, 2, 3]), u = d.pick([1, 2, 3, 4].filter((v) => (v * v) % a === 0)), x0 = m + u * u / a, y0 = u + t;
        return N(`함수 ${yIs(rt(term(a, X)))}의 그래프를 ${X}축의 방향으로 ${iq(m)}만큼, ${Y}축의 방향으로 ${iq(t)}만큼 평행이동한 그래프가 점 ${jw(pt(x0, Av), '을/를')} 지날 때, 상수 ${Av}의 값은?`, y0, { signed: true,
          explain: `평행이동한 그래프의 식은 ${yIs(rootStd(1, a, m, t))}이다. ${jw(is(X, x0), '을/를')} 넣으면 ${is(Av, `${rt(a === 1 ? String(x0 - m) : `${a} × ${par0(x0 - m)}`)} ${sgnT(t)}`)} = ${iq(y0)}이다.`,
          facts: { check: `sqrt(${a}*(${x0}-(${m}))) + ${t}`, rule: 'ipoint-0' } });
      }
      const s = n === 1 ? 1 : -1, u = d.int(1, 4), dx = d.pick(divisorsOf(u * u).filter((v) => Math.abs(v) <= 8)), x0 = m + dx, y0 = t + s * u, a = u * u / dx;
      return N(`함수 ${yIs(`${s < 0 ? MINUS : ''}${rt(Av + X)}`)}의 그래프를 ${X}축의 방향으로 ${iq(m)}만큼, ${Y}축의 방향으로 ${iq(t)}만큼 평행이동하면 점 ${jw(pt(x0, y0), '을/를')} 지난다. 상수 ${Av}의 값은?`, a, { signed: true,
        explain: `평행이동한 그래프의 식은 ${yIs(`${s < 0 ? MINUS : ''}${rt(`${Av}(${den(m)})`)} ${sgnT(t)}`)}이다. 점 ${jw(pt(x0, y0), '을/를')} 넣으면 ${is(rt(term(dx, Av)), u)}이므로 ${is(Av, a)}이다.`,
        facts: { value: `(${jn(y0)}-(${jn(t)}))*(${jn(y0)}-(${jn(t)}))/(${jn(x0)}-(${jn(m)}))`, rule: 'ipoint-' + n } });
    }, { count: 3 }),
    T('igraph-shift-to', '무리함수의 그래프를 평행이동한 그래프의 식', '②15', (d) => {
      const a = pm(d) * d.int(1, 7), p0 = nz(d, -4, 4), c = nz(d, -6, 6), m = nz(d, -4, 4), t = nz(d, -4, 4), b = -a * p0;
      if (p0 + m === 0 || c + t === 0) return null;
      return vals(`함수 ${yIs(rootR(1, a, b, c))}의 그래프를 ${X}축의 방향으로 ${iq(m)}만큼, ${Y}축의 방향으로 ${iq(t)}만큼 평행이동한 그래프의 식이 ${yIs(`${rt(`${Av}(${X} ${MINUS} ${Pv})`)} + ${Qv}`)}일 때, 상수 ${Av}, ${Pv}, ${Qv}의 값을 구하시오.`, [[Av, a], [Pv, p0 + m], [Qv, c + t]], {
        explain: `${yIs(eqs(rootR(1, a, b, c), rootStd(1, a, p0, c)))}이므로 평행이동한 그래프의 식은 ${yIs(rootStd(1, a, p0 + m, c + t))}이다.`,
        facts: { calc: [[jn(a), 0], [`0-(${jn(b)})/(${jn(a)})+(${jn(m)})`, 1], [`${jn(c)}+(${jn(t)})`, 2]] } });
    }),
    T('igraph-shift-match', '평행이동한 그래프가 주어진 식과 일치할 때 상수(둘)', '②15', (d) => {
      const k = pm(d) * d.int(1, 4), m = nz(d, -4, 4), t = nz(d, -5, 5), c0 = nz(d, -6, 6), b = -k * m, a = c0 - t;
      if (a === 0) return null;
      return vals(`함수 ${yIs(`${rt(term(k, X))} + ${Av}`)}의 그래프를 ${X}축의 방향으로 ${iq(m)}만큼, ${Y}축의 방향으로 ${iq(t)}만큼 평행이동하면 함수 ${yIs(`${rt(`${term(k, X)} + ${Bv}`)} ${sgnT(c0)}`)}의 그래프와 일치한다. 상수 ${Av}, ${Bv}의 값을 구하시오.`, [[Av, a], [Bv, b]], {
        explain: `평행이동한 그래프의 식은 ${yIs(`${rt(`${coefIn(k)}(${den(m)})`)} + ${Av} ${sgnT(t)}`)} = ${rt(L(k, b))} + ${Av} ${sgnT(t)}이다. 비교하면 ${is(Bv, b)}, ${is(`${Av} ${sgnT(t)}`, c0)}에서 ${is(Av, a)}이다.`,
        facts: { calc: [[`${jn(c0)}-(${jn(t)})`, 0], [`0-(${jn(k)})*(${jn(m)})`, 1]] } });
    }),
    T('igraph-shift-match3', '평행이동한 그래프가 주어진 식과 일치할 때 상수(셋)', '②15', (d) => {
      const k = pm(d) * d.int(1, 5), r = nz(d, -5, 5), s0 = nz(d, -5, 5), t = nz(d, -5, 5);
      if (t - s0 === 0) return null;
      return vals(`함수 ${yIs(`${rt(`${Av}(${L(1, r)})`)} ${sgnT(s0)}`)}의 그래프를 ${X}축의 방향으로 ${Bv}만큼, ${Y}축의 방향으로 ${Cv}만큼 평행이동하면 함수 ${yIs(`${rt(term(k, X))} ${sgnT(t)}`)}의 그래프와 일치한다. 상수 ${Av}, ${Bv}, ${Cv}의 값을 구하시오.`, [[Av, k], [Bv, r], [Cv, t - s0]], {
        explain: `평행이동한 그래프의 식은 ${yIs(`${rt(`${Av}(${X} ${sgnT(r)} ${MINUS} ${Bv})`)} ${sgnT(s0)} + ${Cv}`)}이다. ${jw(yIs(`${rt(term(k, X))} ${sgnT(t)}`), '과/와')} 같으려면 ${is(Av, k)}, ${is(Bv, r)}, ${is(`${iq(s0)} + ${Cv}`, t)}에서 ${is(Cv, t - s0)}이다.`,
        facts: { calc: [[jn(k), 0], [jn(r), 1], [`${jn(t)}-(${jn(s0)})`, 2]] } });
    }),
    T('igraph-shift-reflect', '평행이동한 뒤 대칭이동한 그래프와 일치(근호 밖의 계수)', '②16', (d) => {
      const a = d.pick([2, 3]), m = nz(d, -3, 3), t = nz(d, -5, 5), A0 = -a * a, C0 = -a * a * m;
      return vals(`함수 ${yIs(Av + rt(X))}의 그래프를 ${X}축의 방향으로 ${Mv}만큼, ${Y}축의 방향으로 ${Nv}만큼 평행이동한 후 ${Y}축에 대하여 대칭이동한 그래프가 함수 ${yIs(`${R1(A0, C0)} ${sgnT(t)}`)}의 그래프와 일치하였다. 이때 상수 ${Av}, ${Mv}, ${Nv}의 값을 구하시오.`, [[Av, a], [Mv, m], [Nv, t]], {
        explain: `평행이동하면 ${yIs(`${Av}${rt(`${X} ${MINUS} ${Mv}`)} + ${Nv}`)}, ${Y}축에 대하여 대칭이동하면 ${yIs(`${Av}${rt(`${MINUS}${X} ${MINUS} ${Mv}`)} + ${Nv}`)}이다. ${R1(A0, C0)} = ${rt(`${a * a}(${L(-1, -m)})`)} = ${a}${rt(L(-1, -m))}이므로 ${is(Av, a)}, ${is(Mv, m)}, ${is(Nv, t)}이다.`,
        facts: { calc: [[`(${jn(C0)})/(${jn(A0)})`, 1], [jn(t), 2]], check: `a = sqrt(${-A0})` } });
    }),
    T('igraph-congruent', '평행이동(대칭이동)하여 y = √x 의 그래프와 겹치는 것', '②17', (d, n) => {
      const p = nz(d, -4, 4), q = nz(d, -4, 4), c = d.pick([2, 3]), r = nz(d, -3, 3);
      const kinds = n === 0 ? [
        () => [yIs(`${R1(1, -p)} ${sgnT(q)}`), true],
        () => [yIs(`${frac(1, c)}${R1(c * c, c * c * r)} ${sgnT(q)}`), true],
        () => [yIs(rt(`${c}(${den(p)})`)), false],
        () => [yIs(`${c}${rt(X)} ${sgnT(q)}`), false],
        () => [yIs(R1(-1, p)), false]
      ] : [
        () => [yIs(`${R1(-1, p)} ${sgnT(q)}`), true],
        () => [yIs(`${MINUS}${R1(-1, p)}`), true],
        () => [yIs(`${frac(1, c)}${R1(c * c, c * c * r)} ${sgnT(q)}`), true],
        () => [yIs(R1(c, p)), false],
        () => [yIs(`${MINUS}${c}${rt(X)} ${sgnT(q)}`), false]
      ];
      const items = d.shuffle(kinds).slice(0, 3).map((f) => f()), list = items.map((it) => it[0]), truth = items.map((it) => it[1]);
      return comboPick(d, `다음 함수 가운데 그 그래프를 ${n === 0 ? '평행이동' : '평행이동 또는 대칭이동'}하여 함수 ${yIs(rt(X))}의 그래프와 겹쳐질 수 있는 것만을 있는 대로 고른 것은?`, list, truth,
        `근호 밖의 수는 제곱하여 근호 안에 넣고 ${yIs(`${rt(`${Kv}(${X} ${MINUS} ${Pv})`)} + ${Qv}`)} 꼴로 바꾸어 ${jw(Kv, '을/를')} 본다. ${n === 0 ? `평행이동으로 겹치려면 근호 앞이 +이고 ${is(Kv, 1)}이어야 한다.` : `대칭이동하면 ${jw(Kv, '과/와')} 근호 앞의 부호만 바뀌므로 ${Kv}의 절댓값이 1이면 겹쳐질 수 있다.`}`);
    }, { count: 2 }),
    T('igraph-claims', '무리함수의 그래프에 대한 설명의 참·거짓', '②18', (d, n) => {
      const s = pm(d), a = pm(d) * d.int(1, 4), p = nz(d, -4, 4), q = nz(d, -4, 4), b = -a * p, dir = a > 0 ? 1 : -1;
      const u = d.pick([1, 2, 3].filter((v) => (v * v) % Math.abs(a) === 0)), x1 = p + dir * u * u / Math.abs(a), y1 = q + s * u;
      const qs = quadsRoot(a, p, q, s), pass = [0, 1, 2, 3].filter((i) => qs[i]), miss = [0, 1, 2, 3].filter((i) => !qs[i]);
      const relX = a > 0 ? '≥' : '≤', relY = s > 0 ? '≥' : '≤', f = rootR(s, a, b, q);
      const yes = [
        `정의역은 ${setX(`${X} ${relX} ${iq(p)}`)}이다.`,
        `치역은 ${setY(`${Y} ${relY} ${iq(q)}`)}이다.`,
        `점 ${jw(pt(x1, y1), '을/를')} 지난다.`,
        `함수 ${yIs(`${s < 0 ? MINUS : ''}${rt(term(a, X))}`)}의 그래프를 ${shiftWords(p, q)} 평행이동한 것이다.`,
        `${jw(QN[miss[0]], '을/를')} 지나지 않는다.`
      ];
      const no = [
        [`정의역은 ${setX(`${X} ${a > 0 ? '≤' : '≥'} ${iq(p)}`)}이다.`, `근호 안의 ${nb(`${L(a, b)} ≥ 0`)}에서 정의역은 ${setX(`${X} ${relX} ${iq(p)}`)}이다.`, yes[0]],
        [`치역은 ${setY(`${Y} ${s > 0 ? '≤' : '≥'} ${iq(q)}`)}이다.`, `치역은 ${setY(`${Y} ${relY} ${iq(q)}`)}이다.`, yes[1]],
        [`점 ${jw(pt(x1, y1 + (d.bool() ? 1 : -1)), '을/를')} 지난다.`, `${is(X, x1)}일 때 ${is(Y, y1)}이므로 점 ${jw(pt(x1, y1), '을/를')} 지난다.`, yes[2]],
        [`함수 ${yIs(`${s < 0 ? MINUS : ''}${rt(term(-a, X))}`)}의 그래프를 ${shiftWords(p, q)} 평행이동한 것이다.`, `${yIs(`${s < 0 ? MINUS : ''}${rt(term(a, X))}`)}의 그래프를 평행이동한 것이다.`, yes[3]],
        [`${jw(QN[d.pick(pass)], '을/를')} 지나지 않는다.`, `그래프는 점 ${pt(p, q)}에서 시작하여 ${jw(way(a, s), '으로/로')} 뻗으므로 ${jw(quadText(pass), '을/를')} 지난다.`, yes[4]]
      ];
      return claimQ(d, `함수 ${yIs(f)}의 그래프에 대한 설명으로 ${n === 0 ? '옳은' : '옳지 않은'} 것은?`, yes, no, n === 0);
    }, { count: 2 }),
    T('igraph-quadrant-cond', '그래프가 지나는 사분면의 조건으로 상수의 범위 구하기', '②20', (d, n) => {
      if (n === 0) {
        const a = d.int(1, 3), tt = d.int(1, 4), bq = tt * tt;
        return ineqAns(`함수 ${yIs(`${R1(a, bq)} + ${Qv}`)}의 그래프가 제2사분면을 지나지 않도록 하는 실수 ${Qv}의 값의 범위를 구하시오.`, '<=', -tt, Qv, {
          explain: `그래프는 점 ${pt(Q(-bq, a), Qv)}에서 시작하여 오른쪽 위로 뻗고, ${Y}축과 점 ${pt(0, `${tt} + ${Qv}`)}에서 만난다. 제2사분면을 지나지 않으려면 ${nb(`${tt} + ${Qv} ≤ 0`)}, 곧 ${nb(`${Qv} ≤ ${iq(-tt)}`)}이다.`,
          facts: { check: `q <= -sqrt(${bq})`, rule: 'iquad-0' } });
      }
      const a = d.int(1, 3), tt = d.pick([1, 2, 3, 4].filter((v) => (v * v) % a === 0)), bound = -tt * tt / a;
      return ineqAns(`함수 ${yIs(`${rt(`${coefIn(a)}(${X} ${MINUS} ${Pv})`)} ${MINUS} ${tt}`)}의 그래프가 제1사분면, 제2사분면, 제3사분면을 모두 지나도록 하는 실수 ${Pv}의 값의 범위를 구하시오.`, '<', bound, Pv, {
        explain: `그래프는 점 ${pt(Pv, -tt)}에서 시작하여 오른쪽 위로 뻗는다. 제3사분면을 지나려면 ${nb(`${Pv} &lt; 0`)}이고, 제2사분면을 지나려면 ${Y}절편 ${jw(`${rt(`${MINUS}${a === 1 ? '' : a}${Pv}`)} ${MINUS} ${tt}`, '이/가')} 양수여야 하므로 ${nb(`${MINUS}${a === 1 ? '' : a}${Pv} &gt; ${tt * tt}`)}, 곧 ${nb(`${Pv} &lt; ${iq(Q(bound))}`)}이다(이때 제1사분면도 지난다).`,
        facts: { calc: [[`0-${tt}*${tt}/${a}`, 1]], rule: 'iquad-1' } });
    }, { count: 2 }),
    T('igraph-shape-pick', '직선의 그림에서 부호를 읽어 무리함수의 그래프의 개형 고르기', '②21', (d) => {
      const slope = d.pick([0.5, 1, 2]) * pm(d), beta = pm(d) * d.int(1, 3), form = d.int(0, 2);
      // form 0: y = b√(−ax), 1: y = a√(bx), 2: y = −b√(ax)  (직선 y = ax + b)
      const A = slope, Bc = beta;
      const inner = form === 0 ? -A : form === 1 ? Bc : A, outer = form === 0 ? Bc : form === 1 ? A : -Bc;
      const dirX = inner > 0 ? 1 : -1, dirY = outer > 0 ? 1 : -1;
      const expr = form === 0 ? `${Bv}${rt(`${MINUS}${Av}${X}`)}` : form === 1 ? `${Av}${rt(`${Bv}${X}`)}` : `${MINUS}${Bv}${rt(`${Av}${X}`)}`;
      const order = d.shuffle([[1, 1], [-1, 1], [-1, -1], [1, -1]]), ans = order.findIndex(([x, y]) => x === dirX && y === dirY);
      const line = plane({ x: [-4, 4], y: [-4, 4], ticks: 'none', grid: false, lines: [{ a: Q(Math.round(A * 2), 2), b: Bc }] });
      const figure = `<div style="display:grid;gap:10px">${line}${picks(order.map(([x, y], i) => mini(x, y, LAB[i])))}</div>`;
      return C(`직선 ${jw(yIs(`${Av}${X} + ${Bv}`), '이/가')} 그림과 같을 때, 함수 ${yIs(expr)}의 그래프의 개형으로 알맞은 것은? (단, ${Av}, ${jw(Bv, '은/는')} 상수이다.)`, LAB.slice(0, 4), ans, { figure,
        explain: `그림에서 직선의 기울기가 ${A > 0 ? '양수' : '음수'}, ${Y}절편이 ${Bc > 0 ? '양수' : '음수'}이므로 ${nb(`${Av} ${A > 0 ? '&gt;' : '&lt;'} 0`)}, ${nb(`${Bv} ${Bc > 0 ? '&gt;' : '&lt;'} 0`)}이다. 근호 안 ${X}의 계수가 ${jw(inner > 0 ? '양수이므로 오른쪽' : '음수이므로 왼쪽', '으로/로')}, 근호 앞의 수가 ${jw(outer > 0 ? '양수이므로 위' : '음수이므로 아래', '으로/로')} 뻗는다. 따라서 ${LAB[ans]}이다.`,
        facts: { truth: LAB.slice(0, 4).map((_, i) => i === ans), want: true } });
    })
  ];

  // ════════════════════════════════════════════════════════════════
  // 무리함수의 그래프의 성질과 활용
  // ════════════════════════════════════════════════════════════════
  // 그래프(시작점과 지나는 한 점)를 짓는다: y = s√(a(x − p)) + q, 지나는 점 (x1, y1)
  function rootFig(d, s, aSign) {
    const A = d.int(1, 4), a = aSign * A, p = nz(d, -4, 4), q = d.int(-3, 3);
    let x1, u;
    if (-p * a > 0 && isSq(-p * a) && sqr(-p * a) <= 4) { x1 = 0; u = sqr(-p * a); }
    else { u = d.pick([1, 2, 3].filter((v) => (v * v) % A === 0)); x1 = p + aSign * u * u / A; }
    const y1 = q + s * u;
    if (Math.abs(x1) > 7 || Math.abs(y1) > 6) return null;
    const xr = span([p, x1], 1.5), yr = span([q, y1], 1.5);
    if (xr[1] - xr[0] > 13 || yr[1] - yr[0] > 11) return null;
    return { a, p, q, s, x1, y1, u, figure: rfig({ x: xr, y: yr, roots: [{ a, p, q, s }], points: [{ x: p, y: q }, { x: x1, y: y1 }] }) };
  }
  const iuse = [
    T('iuse-fig-coef', '그래프를 보고 무리함수의 계수 구하기', '②22', (d, n) => {
      const s = n === 2 ? -1 : 1, g = rootFig(d, s, n === 1 ? -1 : n === 0 ? 1 : pm(d));
      if (!g) return null;
      const { a, p, q, x1, y1, figure } = g, b = -a * p, aE = `(${jn(y1)}-(${jn(q)}))*(${jn(y1)}-(${jn(q)}))/(${jn(x1)}-(${jn(p)}))`;
      return vals(`함수 ${yIs(`${s < 0 ? MINUS : ''}${rt(`${Av}${X} + ${Bv}`)} + ${Cv}`)}의 그래프가 그림과 같을 때, 상수 ${Av}, ${Bv}, ${Cv}의 값을 구하시오.`, [[Av, a], [Bv, b], [Cv, q]], { figure,
        explain: `그래프가 점 ${pt(p, q)}에서 시작하여 ${jw(way(a, s), '으로/로')} 뻗으므로 ${jw(yIs(`${s < 0 ? MINUS : ''}${rt(`${Av}(${den(p)})`)}${q ? ' ' + sgnT(q) : ''}`), '으로/로')} 놓는다. 점 ${jw(pt(x1, y1), '을/를')} 지나므로 ${is(rt(`${Av} × ${par0(x1 - p)}`), Math.abs(y1 - q))}, ${is(Av, a)}이다. 따라서 ${yIs(rootR(s, a, b, q))}이므로 ${is(Bv, b)}, ${is(Cv, q)}이다.`,
        facts: { calc: [[aE, 0], [`0-(${aE})*(${jn(p)})`, 1], [jn(q), 2]], rule: 'ifig-' + n } });
    }, { count: 3 }),
    T('iuse-fig-sign', '그래프를 보고 무리함수의 계수의 부호 고르기', '②23', (d) => {
      const s = pm(d), a = pm(d) * d.int(1, 3), p = nz(d, -3, 3), q = nz(d, -3, 3), b = -a * p;
      const sg = (v) => (v > 0 ? '&gt;' : '&lt;'), row = (A, Bb, Cc) => `${nb(`${Av} ${sg(A)} 0`)}, ${nb(`${Bv} ${sg(Bb)} 0`)}, ${nb(`${Cv} ${sg(Cc)} 0`)}`;
      const right = row(a, b, q), all = [];
      for (const A of [1, -1]) for (const Bb of [1, -1]) for (const Cc of [1, -1]) { const r = row(A, Bb, Cc); if (r !== right) all.push(r); }
      const rows = d.shuffle([right].concat(d.shuffle(all).slice(0, 4)));
      const quad = q > 0 ? (p > 0 ? 0 : 1) : (p > 0 ? 3 : 2);
      // 시작점에서 뻗는 쪽으로 넉넉히 자리를 두어야 곡선이 짧게 끊기지 않는다.
      const x0 = a > 0 ? Math.min(-2, p - 2) : Math.max(2, p + 2) - 10, xr = [x0, x0 + 10],   // 가로 10칸이면 휴대폰 칸(290px)에 줄지 않고 들어간다
        yr = s > 0 ? [Math.min(-3, q - 2), q + 4] : [q - 4, Math.max(3, q + 2)];
      const figure = rfig({ x: xr, y: yr, roots: [{ a, p, q, s, hideStart: true }], ticks: 'none', grid: false, lattice: false, say: `시작점은 ${QN[quad]}에 있다.` });
      return C(`함수 ${yIs(`${s < 0 ? MINUS : ''}${rt(`${Av}${X} + ${Bv}`)} + ${Cv}`)}의 그래프가 그림과 같을 때, 상수 ${Av}, ${Bv}, ${Cv}의 부호를 바르게 나타낸 것은?`, rows, rows.indexOf(right), { figure,
        explain: `그래프가 ${QN[quad]}의 점 ${pt(Pv, Qv)}에서 시작하여 ${jw(way(a, s), '으로/로')} 뻗으므로 ${nb(`${Av} ${sg(a)} 0`)}, ${nb(`${Pv} ${sg(p)} 0`)}, ${nb(`${Qv} ${sg(q)} 0`)}이다. ${yIs(`${s < 0 ? MINUS : ''}${rt(`${Av}(${X} + ${frac(Bv, Av)})`)} + ${Cv}`)}에서 ${is(Pv, `${MINUS}${frac(Bv, Av)}`)}, ${is(Qv, Cv)}이므로 ${nb(`${Bv} ${sg(b)} 0`)}, ${nb(`${Cv} ${sg(q)} 0`)}이다.`,
        facts: { truth: rows.map((r) => r === right), want: true } });
    }),
    T('iuse-fig-then', '그래프에서 무리함수의 계수를 구해 다른 함수의 값 구하기', '②24', (d) => {
      const g = rootFig(d, pm(d), pm(d));
      if (!g) return null;
      const { a, p, q, s, x1, y1, figure } = g, b = -a * p;
      const tx0 = d.int(-4, 5);
      if (tx0 + a === 0 || (b * tx0 - q) % (tx0 + a) !== 0) return null;
      const k = (b * tx0 - q) / (tx0 + a), aE = `(${jn(y1)}-(${jn(q)}))*(${jn(y1)}-(${jn(q)}))/(${jn(x1)}-(${jn(p)}))`;
      return N(`함수 ${yIs(`${s < 0 ? MINUS : ''}${rt(`${Av}${X} + ${Bv}`)} + ${Cv}`)}의 그래프가 그림과 같다. 함수 ${yIs(frac(`${Bv}${X} ${MINUS} ${Cv}`, `${X} + ${Av}`))}의 그래프가 점 ${jw(pt(tx0, Kv), '을/를')} 지날 때, 상수 ${Kv}의 값은? (단, ${Av}, ${Bv}, ${jw(Cv, '은/는')} 상수이다.)`, k, { signed: true, figure,
        explain: `그림에서 시작점이 ${pt(p, q)}이고 점 ${jw(pt(x1, y1), '을/를')} 지나므로 ${yIs(eqs(rootStd(s, a, p, q), rootR(s, a, b, q)))}, 곧 ${is(Av, a)}, ${is(Bv, b)}, ${is(Cv, q)}이다. ${yIs(genR(b, -q, 1, a))}에 ${jw(is(X, tx0), '을/를')} 넣으면 ${is(Kv, k)}이다.`,
        facts: { value: `((0-(${aE})*(${jn(p)}))*${jn(tx0)}-(${jn(q)}))/(${jn(tx0)}+${aE})` } });
    }),
    T('iuse-minmax', '제한된 정의역에서 무리함수의 최댓값과 최솟값', '②25', (d, n) => {
      const A = d.int(1, 3), p = d.int(-4, 3), c = d.int(-4, 4), [u0, u1] = pick2(d, [0, 1, 2, 3, 4].filter((v) => (v * v) % A === 0)).sort((x, y) => x - y);
      let a, s, lo, hi, vlo, vhi;
      if (n === 0) { a = A; s = 1; lo = p + u0 * u0 / A; hi = p + u1 * u1 / A; vlo = c + u0; vhi = c + u1; }
      else if (d.bool()) { a = A; s = -1; lo = p + u0 * u0 / A; hi = p + u1 * u1 / A; vlo = c - u0; vhi = c - u1; }
      else { a = -A; s = 1; lo = p - u1 * u1 / A; hi = p - u0 * u0 / A; vlo = c + u1; vhi = c + u0; }
      const b = -a * p, mx = Math.max(vlo, vhi), mn = Math.min(vlo, vhi), at = (v) => (v === vlo ? lo : hi);
      return vals(`${nb(`${iq(lo)} ≤ ${X} ≤ ${iq(hi)}`)}에서 함수 ${yIs(rootR(s, a, b, c))}의 최댓값과 최솟값을 구하시오.`, [['최댓값', mx], ['최솟값', mn]], {
        explain: `${yIs(rootR(s, a, b, c))}의 그래프는 점 ${pt(p, c)}에서 시작하여 ${jw(way(a, s), '으로/로')} 뻗으므로 주어진 범위에서 ${Y}의 값은 ${vhi > vlo ? '증가' : '감소'}한다. ${is(X, at(mx))}일 때 최댓값 ${iq(mx)}, ${is(X, at(mn))}일 때 최솟값 ${iq(mn)}이다.`,
        facts: { check: `values at ends ${vlo}, ${vhi}`, rule: 'iminmax-' + n } });
    }, { count: 2 }),
    T('iuse-min-at', '최솟값을 갖는 x의 값으로 상수 구하기', '②26', (d) => {
      const k = d.int(1, 4), x0 = nz(d, -5, 5), c = nz(d, -6, 6), a = -k * x0;
      return vals(`함수 ${jw(fIs(`${rt(`${term(k, X)} + ${Av}`)} ${sgnT(c)}`), '은/는')} ${is(X, x0)}일 때 최솟값 ${jw(Mv, '을/를')} 갖는다. 상수 ${Av}, ${Mv}의 값을 구하시오.`, [[Av, a], [Mv, c]], {
        explain: `근호의 값은 0 이상이므로 근호 안이 0일 때 최솟값을 갖는다. ${is(`${k === 1 ? '' : k}${par0(x0)} + ${Av}`, 0)}에서 ${is(Av, a)}이고, 최솟값은 ${is(Mv, c)}이다.`,
        facts: { calc: [[`0-${k}*(${jn(x0)})`, 0], [jn(c), 1]] } });
    }),
    T('iuse-minmax-back', '최댓값에서 상수를 구해 최솟값 구하기', '②26', (d, n) => {
      if (n === 0) {
        const k = d.int(1, 3), [u0, u1] = pick2(d, [1, 2, 3, 4].filter((v) => true)).sort((x, y) => x - y), e = d.int(-4, 6);
        if ((u0 * u0 + e) % k !== 0 || (u1 * u1 + e) % k !== 0) return null;
        const lo = (u0 * u0 + e) / k, hi = (u1 * u1 + e) / k, M0 = d.int(-3, 9), a = M0 - u1, mn = u0 + a;
        return N(`${nb(`${iq(lo)} ≤ ${X} ≤ ${iq(hi)}`)}에서 함수 ${yIs(`${R1(k, -e)} + ${Av}`)}의 최댓값이 ${iq(M0)}일 때, 이 함수의 최솟값은? (단, ${jw(Av, '은/는')} 상수이다.)`, mn, { signed: true,
          explain: `${X}의 값이 커지면 ${Y}의 값도 커지므로 ${is(X, hi)}일 때 최댓값 ${rt(String(u1 * u1))} + ${Av} = ${u1} + ${Av} = ${iq(M0)}, ${is(Av, a)}이다. 최솟값은 ${is(X, lo)}일 때 ${rt(String(u0 * u0))}${a ? ' ' + sgnT(a) : ''} = ${iq(mn)}이다.`,
          facts: { check: `max at x=${hi}`, rule: 'iback-0' } });
      }
      const [gap, u] = d.pick([[8, 1], [5, 2], [3, 1], [7, 3], [12, 2], [16, 3], [15, 1]]), w = sqr(gap + u * u), lo = d.int(-6, 0), hi = lo + gap, c = nz(d, -3, 4), M0 = c - u, a = hi + u * u, mn = c - w;
      return N(`${nb(`${iq(lo)} ≤ ${X} ≤ ${iq(hi)}`)}에서 함수 ${fIs(`${MINUS}${rt(`${MINUS}${X} + ${Av}`)} ${sgnT(c)}`)}의 최댓값이 ${iq(M0)}일 때, 최솟값은? ${nb(`(단, ${Av} ≥ ${iq(hi)})`)}`, mn, { signed: true,
        explain: `${X}의 값이 커지면 근호 안의 값이 작아지므로 ${Y}의 값은 커진다. ${is(X, hi)}일 때 최댓값 ${MINUS}${rt(`${iq(-hi)} + ${Av}`)}${c ? ' ' + sgnT(c) : ''} = ${iq(M0)}에서 ${is(Av, a)}이다. 최솟값은 ${is(X, lo)}일 때 ${MINUS}${rt(String(a - lo))}${c ? ' ' + sgnT(c) : ''} = ${iq(mn)}이다.`,
        facts: { check: `a = ${a}`, rule: 'iback-1' } });
    }, { count: 2 }),
    T('iuse-inv-meet', '무리함수와 그 역함수의 그래프의 교점', '②27', (d) => {
      const r = d.int(2, 7), r2 = -d.int(1, 5), a = r + r2, b = -r * r2;
      if (a <= 0) return null;   // 증가하는 함수라야 두 그래프가 직선 y = x 위에서만 만난다.
      return pointAns(`함수 ${fIs(R1(a, b))}에 대하여 함수 ${yIs(`${V('f')}(${X})`)}의 그래프와 그 역함수 ${yIs(`${fInv}(${X})`)}의 그래프의 교점의 좌표를 구하시오.`, r, r, {
        explain: `두 그래프의 교점은 ${yIs(`${V('f')}(${X})`)}의 그래프와 직선 ${yIs(X)}의 교점이다. ${is(R1(a, b), X)}의 양변을 제곱하면 ${nb(`${poly([[1, X2], [-a, X], [-b, '']])} = 0`)}, ${nb(`(${den(r)})(${den(r2)}) = 0`)}이다. ${nb(`${X} ≥ 0`)}이어야 하므로 ${jw(is(X, r2), '은/는')} 버리고 교점은 ${pt(r, r)}이다.`,
        facts: { check: `x^2 - ${a}x - ${b} = 0, x >= 0` } });
    }),
    T('iuse-inv-meet-dist', '무리함수와 그 역함수의 두 교점 사이의 거리', '②27', (d) => {
      const c = d.int(-2, 3), r1 = c + d.int(0, 2), r2 = r1 + d.int(2, 4), a = r1 + r2 - 2 * c, Bb = r1 * r2 - c * c;
      if (a <= 0) return null;
      return radAns(`함수 ${fIs(rootR(1, a, -Bb, c))}의 그래프와 그 역함수의 그래프가 서로 다른 두 점에서 만날 때, 두 점 사이의 거리는?`, r2 - r1, 2, {
        explain: `교점은 직선 ${yIs(X)} 위에 있다. ${is(rootR(1, a, -Bb, c), X)}에서 ${is(R1(a, -Bb), L(1, -c))}, 양변을 제곱하여 정리하면 ${nb(`(${den(r1)})(${den(r2)}) = 0`)}이다. 두 근 모두 ${nb(`${X} ≥ ${iq(c)}`)}이므로 교점은 ${pt(r1, r1)}, ${pt(r2, r2)}이고 거리는 ${r2 - r1}${rt(2)}이다.`,
        facts: { check: `roots ${r1}, ${r2}` } });
    }),
    T('iuse-inv-point', '함수와 그 역함수의 그래프가 함께 지나는 점으로 계수 구하기', '②28', (d, n) => {
      const [u, v] = pick2(d, [0, 1, 2, 3, 4]), a = -(u + v), b = v * v + u * (u + v), ab = (k) => poly([[k, Av], [1, Bv]]);
      return vals(`함수 ${fIs(rt(`${Av}${X} + ${Bv}`))}에 대하여 함수 ${yIs(`${V('f')}(${X})`)}의 그래프와 그 역함수 ${yIs(`${fInv}(${X})`)}의 그래프가 ${n === 0 ? `모두 점 ${jw(pt(u, v), '을/를')} 지날` : `점 ${pt(u, v)}에서 만날`} 때, 상수 ${Av}, ${Bv}의 값을 구하시오.`, [[Av, a], [Bv, b]], {
        explain: `${yIs(`${V('f')}(${X})`)}의 그래프가 점 ${jw(pt(u, v), '을/를')} 지나므로 ${nb(`${V('f')}(${u}) = ${v}`)}, 역함수의 그래프가 점 ${jw(pt(u, v), '을/를')} 지나므로 ${nb(`${V('f')}(${v}) = ${u}`)}이다. ${is(rt(ab(u)), v)}, ${is(rt(ab(v)), u)}에서 ${nb(`${ab(u)} = ${v * v}`)}, ${nb(`${ab(v)} = ${u * u}`)}이므로 ${is(Av, a)}, ${is(Bv, b)}이다.`,
        facts: { calc: [[`0-${u}-${v}`, 0], [`${v}*${v}+${u}*(${u}+${v})`, 1]], rule: 'invpt-' + n } });
    }, { count: 2 }),
    T('iuse-inv-value', '무리함수의 역함수의 값', '심4', (d) => {
      const p = d.int(-5, 6), q = d.int(-4, 4), t = q + d.int(2, 6);
      return N(`함수 ${fIs(rootR(1, 1, -p, q))}에 대하여 ${nb(`${fInv}(${iq(t)})`)}의 값은?`, (t - q) ** 2 + p, { signed: true,
        explain: `${jw(nb(`${fInv}(${iq(t)}) = ${Kv}`), '이라/라')} 하면 ${nb(`${V('f')}(${Kv}) = ${iq(t)}`)}이므로 ${is(R1(1, -p).replace(X, Kv), t - q)}, ${is(Kv, (t - q) ** 2 + p)}이다.`,
        facts: { value: `(${jn(t)}-(${jn(q)}))*(${jn(t)}-(${jn(q)}))+(${jn(p)})` } });
    }),
    T('iuse-comp-inv', '유리함수와 무리함수가 섞인 합성함수의 역함수 값', '②29', (d, n) => {
      // f(x) = (αx + β)/(x − p0) (x > p0), g(x) = √(γx − δ) + η
      const p0 = d.int(-3, 2), al = nz(d, -4, 4), kk = nz(d, -8, 8), be = kk - al * p0, ga = d.int(1, 4), et = d.int(-3, 3);
      const f = (x) => al + kk / (x - p0), fI = (y) => p0 + kk / (y - al);
      const ok = (v) => Number.isInteger(v) && Math.abs(v) <= 40;
      let ask, ans, de, why, value, check;
      if (n === 0) {
        const xs = p0 + d.pick(divisorsOf(kk).filter((v) => v > 0)), u = f(xs), w = d.int(1, 4), de0 = ga * u - w * w, t = w + et;
        if (!ok(u) || !ok(de0)) return null;
        de = de0; ans = xs; ask = `(${V('g')} ∘ ${V('f')})<sup>−1</sup>(${iq(t)})`;
        why = `${nb(`(${V('g')} ∘ ${V('f')})<sup>−1</sup> = ${fInv} ∘ ${V('g')}<sup>−1</sup>`)}이다. ${jw(nb(`${V('g')}<sup>−1</sup>(${iq(t)}) = ${Kv}`), '이라/라')} 하면 ${nb(`${V('g')}(${Kv}) = ${iq(t)}`)}에서 ${is(Kv, u)}, ${jw(nb(`${fInv}(${iq(u)}) = ${Mv}`), '이라/라')} 하면 ${nb(`${V('f')}(${Mv}) = ${iq(u)}`)}에서 ${is(Mv, xs)}이다.`;
        const gI = `(((${jn(t)}-(${jn(et)}))*(${jn(t)}-(${jn(et)}))+(${jn(de)}))/${ga})`;
        value = `((${jn(be)})+(${jn(p0)})*${gI})/(${gI}-(${jn(al)}))`;
      } else if (n === 1) {
        const ys = d.int(-3, 8), w = d.int(1, 4), de0 = ga * ys - w * w, v = w + et;
        if (v === al || v <= p0 || !ok(de0)) return null;
        if (!Number.isInteger(kk / (v - p0))) return null;
        const t = f(v); if (!ok(t)) return null;
        de = de0; ans = ys; ask = `(${V('g')}<sup>−1</sup> ∘ ${fInv})(${iq(t)})`;
        why = `${jw(nb(`${fInv}(${iq(t)}) = ${Kv}`), '이라/라')} 하면 ${nb(`${V('f')}(${Kv}) = ${iq(t)}`)}에서 ${is(Kv, v)}이고, ${jw(nb(`${V('g')}<sup>−1</sup>(${iq(v)}) = ${Mv}`), '이라/라')} 하면 ${nb(`${V('g')}(${Mv}) = ${iq(v)}`)}에서 ${is(Mv, ys)}이다.`;
        const fI2 = `((${jn(be)})+(${jn(p0)})*(${jn(t)}))/(${jn(t)}-(${jn(al)}))`;
        value = `((${fI2}-(${jn(et)}))*(${fI2}-(${jn(et)}))+(${jn(de)}))/${ga}`;
      } else {
        const zs = p0 + d.pick(divisorsOf(kk).filter((v) => v > 0)), v = f(zs), w = d.int(1, 4), t = d.int(-2, 8), de0 = ga * t - w * w, et2 = v - w;
        if (!ok(v) || !ok(de0) || Math.abs(et2) > 9) return null;
        de = de0; ans = zs; ask = `(${fInv} ∘ ${V('g')})(${iq(t)})`; check = `g(${t}) = ${v}`;
        why = `${nb(`${V('g')}(${iq(t)}) = ${rt(String(w * w))}${et2 ? ' ' + sgnT(et2) : ''} = ${iq(v)}`)}이고, ${jw(nb(`${fInv}(${iq(v)}) = ${Mv}`), '이라/라')} 하면 ${nb(`${V('f')}(${Mv}) = ${iq(v)}`)}에서 ${is(Mv, zs)}이다.`;
        return N(`${nb(`${X} &gt; ${iq(p0)}`)}에서 정의된 함수 ${jw(fIs(genR(al, be, 1, -p0)), '과/와')} 함수 ${nb(`${V('g')}(${X}) = ${rootR(1, ga, -de, et2)}`)}에 대하여 ${nb(ask)}의 값은?`, ans, { signed: true, explain: why, facts: { check, rule: 'compinv-2' } });
      }
      return N(`${nb(`${X} &gt; ${iq(p0)}`)}에서 정의된 함수 ${jw(fIs(genR(al, be, 1, -p0)), '과/와')} 함수 ${nb(`${V('g')}(${X}) = ${rootR(1, ga, -de, et)}`)}에 대하여 ${nb(ask)}의 값은?`, ans, { signed: true, explain: why,
        facts: { value, rule: 'compinv-' + n } });
    }, { count: 3 }),
    T('iuse-line-end', '무리함수의 그래프와 직선이 만날 조건(끝점만 보면 되는 것)', '②33', (d, n) => {
      const m = d.int(1, 3), p = nz(d, -4, 4), q = d.int(-3, 4), bound = q - p;
      if (n === 0) {
        return ineqAns(`함수 ${yIs(rootR(1, -m, m * p, q))}의 그래프와 직선 ${jw(yIs(`${X} + ${Kv}`), '이/가')} 만나도록 하는 실수 ${Kv}의 값의 범위를 구하시오.`, '>=', bound, Kv, {
          explain: `그래프는 점 ${pt(p, q)}에서 시작하여 왼쪽 위로 뻗고, 직선은 오른쪽 위로 올라간다. 직선이 점 ${jw(pt(p, q), '을/를')} 지날 때 ${is(Kv, bound)}이고, 이보다 위로 올라가면 만나므로 ${nb(`${Kv} ≥ ${iq(bound)}`)}이다.`,
          facts: { calc: [[`${jn(q)}-(${jn(m * p)})/${m}`, 1]], rule: 'iline-0' } });
      }
      return ineqAns(`함수 ${yIs(rootR(-1, m, -m * p, q))}의 그래프와 직선 ${jw(yIs(`${X} + ${Kv}`), '이/가')} 한 점에서 만나도록 하는 실수 ${Kv}의 값의 범위를 구하시오.`, '<=', bound, Kv, {
        explain: `그래프는 점 ${pt(p, q)}에서 시작하여 오른쪽 아래로 뻗고, 직선은 오른쪽 위로 올라가므로 만나는 점은 많아야 하나이다. 직선이 점 ${jw(pt(p, q), '을/를')} 지날 때 ${is(Kv, bound)}이고, 이보다 아래에 있으면 만나므로 ${nb(`${Kv} ≤ ${iq(bound)}`)}이다.`,
        facts: { calc: [[`${jn(q)}-(${jn(-m * p)})/(0-${m})`, 1]], rule: 'iline-1' } });
    }, { count: 2 }),
    T('iuse-area-point', '그래프 위의 점과 삼각형의 넓이', '②37', (d) => {
      const c = d.pick([1, 2, 3, 4]), h = d.pick([2, 3, 4, 6].filter((v) => (v * v) % c === 0 && v * v / c <= 20)), al = d.int(0, 4), base = d.pick([2, 3, 4, 6]), be = al + base, S = base * h / 2;
      if (!Number.isInteger(S)) return null;
      return pointAns(`두 점 A${pt(al, 0)}, B${jw(pt(be, 0), '과/와')} 함수 ${yIs(rt(term(c, X)))}의 그래프 위를 움직이는 점 P가 있다. 삼각형 ABP의 넓이가 ${S}일 때, 점 P의 좌표를 구하시오.`, h * h / c, h, {
        explain: `점 P의 ${Y}좌표를 ${Kv}라 하면 ${is(`${frac(1, 2)} × ${base} × ${Kv}`, S)}에서 ${is(Kv, h)}이다. ${is(rt(term(c, X)), h)}에서 ${is(X, h * h / c)}이므로 P${pt(h * h / c, h)}이다.`,
        facts: { calc: [[`2*${S}/(${be}-${al})*(2*${S}/(${be}-${al}))/${c}`, 0], [`2*${S}/(${be}-${al})`, 1]], derived: [2] } });
    }),
    T('iuse-life', '실생활 속 무리함수의 값', '②39', (d) => {
      const m = d.pick([1, 3, 5, 7]), Lm = (4.9 * m).toFixed(1);
      return radAns(`진자가 한 번 왕복하는 데 걸리는 시간을 주기라 한다. 진자의 길이가 ${X} m일 때 주기는 ${nb(`${V('f')}(${X}) = 2π${rt(frac(X, '9.8'))}`)}초라고 한다. 진자의 길이가 ${Lm} m일 때, 주기를 ${Kv}π초라 하면 상수 ${Kv}의 값은?`, 1, 2 * m, {
        explain: `${nb(`${V('f')}(${Lm}) = 2π${rt(frac(Lm, '9.8'))}`)} ${nb(`= 2π${rt(frac(m, 2))}`)} ${nb(`= π${rt(String(2 * m))}`)}이므로 ${is(Kv, rt(String(2 * m)))}이다.`,
        facts: { check: `k = sqrt(${2 * m})` } });
    }),
    // ②39 전교 생각 틔우기: 수심과 해일의 속력 사이의 관계를 속력에 대한 무리함수로 나타낸다(양수 조건으로 근호를 고른다).
    T('iuse-model', '상황을 무리함수의 식으로 나타내기', '②39', (d) => {
      const v = V('v'), h = V('h'), right = { h: rt(`9.8${X}`), f: (x) => Math.sqrt(9.8 * x) };
      const wrongs = [{ h: `9.8${rt(X)}`, f: (x) => 9.8 * Math.sqrt(x) }, { h: rt(frac(X, '9.8')), f: (x) => Math.sqrt(x / 9.8) }, { h: frac(rt(X), '9.8'), f: (x) => Math.sqrt(x) / 9.8 },
        { h: frac(X2, '9.8'), f: (x) => x * x / 9.8 }, { h: `9.8${X2}`, f: (x) => 9.8 * x * x }, { h: `${MINUS}${rt(`9.8${X}`)}`, f: (x) => -Math.sqrt(9.8 * x) }];
      return pickFn(d, `지진 해일의 전파 속력 ${v} m/s와 수심 ${h} m 사이에는 ${jw(nb(`${h} = ${frac(v + sup(2), '9.8')}`), '이/가')} 성립한다고 한다. 수심 ${X} m에서의 전파 속력을 ${v} m/s라 할 때, ${jw(v, '을/를')} ${X}에 대한 식으로 나타낸 것은?`,
        { pts: [[0.5], [1.5], [3.7], [10.2], [40.4]], explain: `${jw(is(h, X), '을/를')} 넣으면 ${nb(`${X} = ${frac(v + sup(2), '9.8')}`)}, 곧 ${is(v + sup(2), `9.8${X}`)}이다. 속력 ${jw(v, '은/는')} 양수이므로 ${is(v, right.h)}이다.` },
        { h: is(v, right.h), f: right.f }, wrongs.map((w) => ({ h: is(v, w.h), f: w.f })));
    })
  ];

  B.addTypes('10-2-7', 'iexpr', iexpr);
  B.addTypes('10-2-7', 'igraph', igraph);
  B.addTypes('10-2-7', 'iuse', iuse);
})(typeof window !== 'undefined' ? window : globalThis);
