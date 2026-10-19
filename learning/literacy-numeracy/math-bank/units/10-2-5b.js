// 고등학교 1학년 2학기 5단원 명제 — 뒤쪽 묶음(충분조건과 필요조건, 대우를 이용한 증명법과 귀류법, 절대부등식).
// 싣는 기준과 뺀 것은 10-2-5a.js 머리에 모아 적었다. ref: ①n = 기본꼴_1, ②n = 기본꼴_2, 심n = 심화꼴.
//  - 충분·필요의 판단은 a.js 의 조건 도구로 두 진리집합의 포함을 넣어 보아 가린다(넣어 볼 수는 실수 1/8 간격, 두 실수 1/4 간격, 자연수·정수).
//    집합 A, B(, C)에 대한 조건은 벤 다이어그램의 영역 가운데 비어 있는 것을 모두 따져 가린다.
//  - 증명의 빈칸은 원문과 같은 꼴로 싣고, 빈칸에 들어갈 식은 코드가 여러 수를 넣어 맞는지 확인한다(2k² − 2k 따위).
//    증명을 다 쓰게 하는 문항은 싣지 않고, 「대우로 증명할 때 보여야 하는 명제」「귀류법에서 처음 가정하는 것」 고르기로 바꾸었다.
//  - 절대부등식은 넣어 볼 수(실수 1/8·1/4 간격, 양수 1/4 간격)에서 한 번이라도 성립하지 않으면 절대부등식이 아니다. 등호가 걸린 경우(a² + 36 > 12a)를 일부러 섞는다.
//    산술평균과 기하평균의 관계로 구하는 최솟값·최댓값은 수를 바꾸어 짓고, 그때의 값은 칸을 나누어 받는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, frac, lines, N, M, C, F, inline } = B.kit;
  const { MINUS, Q, tx, nb, V, sup, poly, gcd, range, rt, SG } = B.kit.mid;
  const K = B.kit.m1025;
  const { T, STD, X, Yv, Av, Bv, Cv, Kv, Mv, Nv, pV, qV, rV, PS, QS, RS, US, NOT, TO, IMP, IFF, EMPTY, sq, num, numH, par, jn, quo, cond, roster, polyH, linH, absH, ej, slots, numQ,
    GA, bogi, setsQ, oneQ, OPH, at, iv, pr, OR, AND, xr, vr, xpoly, xabs, cH, cF, cN, RX, NX, ZX, grid2, R2, grid3, holdsAll, nice, implies, sameSet, relOf, isPrime, divisors,
    maskOf, relHolds, always, L, lH, lS, impH, impR, negL, INK, BLUE, svg, IT, word, tv, stmt, cexOf, showE, fillProps, mixWants, varNote } = K;

  // ════════════════════════════════════════════════════════════════
  // ── 충분조건과 필요조건 ──
  const REL_SAY = { suff: '충분조건이지만 필요조건은 아니다.', nec: '필요조건이지만 충분조건은 아니다.', iff: '필요충분조건이다.', none: '충분조건도 아니고 필요조건도 아니다.' };
  const REL_SHORT = { suff: '충분조건', nec: '필요조건', iff: '필요충분조건', none: '충분조건도 필요조건도 아닌 조건' };
  const relWhy = (rel) => (rel === 'suff' ? `${PS} ⊂ ${QS}, ${QS} ⊄ ${PS}` : rel === 'nec' ? `${QS} ⊂ ${PS}, ${PS} ⊄ ${QS}` : rel === 'iff' ? `${PS} = ${QS}` : `${PS} ⊄ ${QS}, ${QS} ⊄ ${PS}`);
  // 네 가지 관계를 보기로 내는 문항
  function relQ(d, text, rel, o) {
    const order = ['suff', 'nec', 'iff', 'none'];
    return C(text, order.map((r) => REL_SAY[r]), order.indexOf(rel), {
      figure: o.figure, explain: o.explain || `두 조건 ${pV}, ${qV}의 진리집합을 각각 ${PS}, ${QS}라고 하면 ${relWhy(rel)}이므로 ${ej(pV, '은/는')} ${qV}이기 위한 ${REL_SAY[rel]}`,
      facts: Object.assign({ truth: order.map((r) => r === rel), want: true }, o.rule ? { rule: o.rule } : {})
    });
  }
  // 한 변수의 조건 짝(실수·자연수). 관계는 넣어 보아 가린다.
  function pairOne(d, kind) {
    const r = d.int(-4, 4), r2 = d.until(() => d.int(-4, 4), (v) => v !== r), a = d.int(1, 4), b = a + d.int(1, 3), k = d.int(1, 5);
    switch (kind) {
      case 'rootIn': return { p: xr('=', r), q: xpoly(1, -(r + r2), r * r2, '='), S: RX };
      case 'rootOut': return { p: xpoly(1, -(r + r2), r * r2, '='), q: xr('=', r), S: RX };
      case 'ltSq': return { p: xr('<', a), q: xpoly(1, 0, 0, '<', a * a), S: RX };
      case 'absSq': return { p: xabs(0, '=', a), q: xpoly(1, 0, 0, '=', a * a), S: RX };
      case 'absIv': return { p: xabs(0, '<=', a), q: iv('x', -b, b, true, true), S: RX };
      case 'absIn': return { p: xabs(0, '<', b), q: iv('x', -a, a - d.int(0, 1), false, true), S: RX };
      case 'sqRoot': return { p: at(sq(X), '=', 0, (e) => e.x * e.x - k * e.x), q: OR(xr('=', 0), xr('=', k)), S: RX, ph: `${sq(X)} = ${k === 1 ? '' : k}${X}` };
      case 'always': return { p: xpoly(1, 0, k, '>', 0), q: xpoly(-2, 4, -(k + 2), '<', 0), S: RX };
      case 'lin': { const c1 = d.int(1, 4), c2 = d.int(1, 4), t1 = d.int(-2, 4), t2 = d.int(-2, 4); return { p: at(linH(1, -c1), '>', t1 - c1, (e) => e.x - c1), q: at(linH(-1, c2), '<', c2 - t2, (e) => -e.x + c2), S: RX }; }
      case 'divs': { const m = d.pick([4, 6, 8, 9, 12, 18]), n = d.pick([12, 18, 24, 36, 6, 4].filter((v) => v !== m)); return { p: pr(`${X}는 ${m}의 양의 약수이다.`, '', (e) => m % e.x === 0), q: pr(`${X}는 ${n}의 양의 약수이다.`, '', (e) => n % e.x === 0), S: NX, nat: true }; }
      default: { const m = d.pick([2, 3, 4, 6]), n = d.pick([2, 3, 4, 6, 12].filter((v) => v !== m)); return { p: pr(`${X}는 ${m}의 배수이다.`, '', (e) => e.x % m === 0), q: pr(`${X}는 ${n}의 배수이다.`, '', (e) => e.x % n === 0), S: NX, nat: true }; }
    }
  }
  const ONE_PAIRS = ['rootIn', 'rootOut', 'ltSq', 'absSq', 'absIv', 'absIn', 'sqRoot', 'always', 'lin'];
  const pH = (t, which) => (which === 'p' ? t.ph || cH(t.p) : t.qh || cH(t.q));
  // 두 문자·문장의 조건 짝
  const Z2 = grid2('x', 'y', 1, 9), HALF2 = grid2('x', 'y', 2, 12);
  function pairTwo(d) {
    const a = d.int(1, 4), b = d.int(1, 4), P = (h, f) => pr(h, '', f);
    return [
      { p: P(`${X}와 ${Yv}가 모두 홀수이다.`, (e) => Math.abs(e.x % 2) === 1 && Math.abs(e.y % 2) === 1), q: P(`${X} + ${Yv}는 짝수이다.`, (e) => (e.x + e.y) % 2 === 0), S: Z2, note: `${X}, ${Yv}는 정수` },
      { p: P(`${X}${Yv}는 정수이다.`, (e) => Number.isInteger(e.x * e.y)), q: P(`${X}와 ${Yv}가 모두 정수이다.`, (e) => Number.isInteger(e.x) && Number.isInteger(e.y)), S: HALF2, note: `${X}, ${Yv}는 실수` },
      { p: P(`${X}${Yv} = 0`, (e) => e.x * e.y === 0), q: P(`${X} = 0 또는 ${Yv} = 0`, (e) => e.x === 0 || e.y === 0), S: R2.xy, note: `${X}, ${Yv}는 실수` },
      { p: P(`${X} = ${a}이고 ${Yv} = ${b}`, (e) => e.x === a && e.y === b), q: P(`${X}${Yv} = ${a * b}`, (e) => e.x * e.y === a * b), S: R2.xy, note: `${X}, ${Yv}는 실수` },
      { p: P(`${X} + ${Yv} &gt; 0이고 ${X}${Yv} &gt; 0`, (e) => e.x + e.y > 0 && e.x * e.y > 0), q: P(`${X} &gt; 0이고 ${Yv} &gt; 0`, (e) => e.x > 0 && e.y > 0), S: R2.xy, note: `${X}, ${Yv}는 실수` },
      { p: P(`${X} &gt; 0 또는 ${Yv} &gt; 0`, (e) => e.x > 0 || e.y > 0), q: P(`${X} + ${Yv} &gt; 0`, (e) => e.x + e.y > 0), S: R2.xy, note: `${X}, ${Yv}는 실수` },
      { p: P(`${sq(X)} + ${sq(Yv)} = 0`, (e) => e.x * e.x + e.y * e.y === 0), q: P(`${X}${Yv} = 0`, (e) => e.x * e.y === 0), S: R2.xy, note: `${X}, ${Yv}는 실수` }
    ];
  }
  // 집합 A, B(, C)에 관한 조건: rels 는 a.js 의 관계 꼴(0·1·2 는 A·B·C)
  const SETA = [V('A'), V('B'), V('C')];
  const pc = (c) => (c === 0 ? '' : ` ${c < 0 ? MINUS : '+'} ${Math.abs(c)}`);    // 「 + 3」「 − 3」(0이면 적지 않는다)
  function sA(e, inner) {
    if (typeof e === 'number') return SETA[e];
    if (e === 'E') return EMPTY;
    if (e.c !== undefined) return (typeof e.c === 'number' ? SETA[e.c] : '(' + sA(e.c) + ')') + sup('C');
    const body = e.u ? e.u.map((t) => sA(t, true)).join(' ∪ ') : e.i ? e.i.map((t) => sA(t, true)).join(' ∩ ') : sA(e.d[0], true) + ' − ' + sA(e.d[1], true);
    return inner ? '(' + body + ')' : body;
  }
  const rA = (r) => nb(r[0] === 'emp' ? sA(r[1]) + ' = ' + EMPTY : sA(r[1]) + (r[0] === 'sub' ? ' ⊂ ' : ' = ') + sA(r[2]));
  const condA = (rels) => ({ rels, h: rels.map(rA).join('이고 ') });
  function setImp(p, q, n) {
    const R = 1 << n; let any = false;
    for (let cfg = 1; cfg < (1 << R); cfg += 1) { if (!p.rels.every((r) => relHolds(r, cfg, n))) continue; any = true; if (!q.rels.every((r) => relHolds(r, cfg, n))) return false; }
    if (!any) throw new Error('조건을 만족하는 경우가 없다');
    return true;
  }
  const setRel = (p, q, n) => { const a = setImp(p, q, n), b = setImp(q, p, n); return a && b ? 'iff' : a ? 'suff' : b ? 'nec' : 'none'; };
  const SET_PAIRS = [
    [condA([['eq', { i: [0, 1] }, 0]]), condA([['eq', { u: [0, 1] }, 1]]), 2], [condA([['emp', { d: [0, 1] }]]), condA([['eq', 0, 1]]), 2],
    [condA([['eq', { u: [0, 1] }, 0]]), condA([['sub', 1, 0]]), 2], [condA([['eq', 0, 1]]), condA([['eq', { i: [0, 1] }, 0]]), 2],
    [condA([['emp', { i: [0, 1] }]]), condA([['eq', { d: [0, 1] }, 0]]), 2], [condA([['emp', { u: [0, 1] }]]), condA([['emp', 0]]), 2],
    [condA([['sub', 0, 1], ['sub', 0, 2]]), condA([['sub', 0, { u: [1, 2] }]]), 3], [condA([['sub', 0, { i: [1, 2] }]]), condA([['sub', 0, 1]]), 3]
  ];

    // 진리집합이 다른 까닭: 한쪽만 성립하는 쉬운 수를 든다
    const diffWhy = (c, target, S) => {
      const e = nice(S).find((v) => cF(c, v) !== cF(target, v)), [yes, no] = cF(c, e) ? [c, target] : [target, c];
      return `${showE(e)}이면 ${quo(yes.h)}이지만 ${ej(quo(no.h), '이/가')} 아니다.`;
    };
  const condTypes = [
    T('cond-judge', '한 문자 조건의 충분·필요 판단', '②1', (d, n) => {
      if (n === 1) {
        const t = d.until(() => pairOne(d, d.pick(['divs', 'mult'])), (u) => relOf(u.p, u.q, u.S) !== 'none');
        const rel = relOf(t.p, t.q, t.S);
        return relQ(d, `자연수 ${X}에 대한 두 조건 ${cond('p', cH(t.p).replace(/\.$/, ''))}, ${cond('q', cH(t.q).replace(/\.$/, ''))}에 대하여 ${ej(pV, '은/는')} ${qV}이기 위한 어떤 조건인가?`, rel, { rule: 'judge-nat' });
      }
      const t = d.until(() => pairOne(d, d.pick(ONE_PAIRS)), (u) => relOf(u.p, u.q, u.S) !== 'none');
      const rel = relOf(t.p, t.q, t.S);
      return relQ(d, `실수 ${X}에 대한 두 조건 ${cond('p', pH(t, 'p'))}, ${cond('q', pH(t, 'q'))}에 대하여 ${ej(pV, '은/는')} ${qV}이기 위한 어떤 조건인가?`, rel, { rule: 'judge-real' });
    }, { count: 2 }),
    T('cond-sentence', '문장·두 문자 조건의 충분·필요 판단', '②2', (d) => {
      const pool = pairTwo(d).concat([{ p: pr('△ABC는 정삼각형이다.', '', () => true), q: pr('△ABC는 이등변삼각형이다.', '', () => true), fixed: 'suff' }, { p: pr('△ABC는 이등변삼각형이다.', '', () => true), q: pr('△ABC는 정삼각형이다.', '', () => true), fixed: 'nec' }]);
      const t = d.until(() => d.pick(pool), (u) => (u.fixed || relOf(u.p, u.q, u.S)) !== 'none');
      const rel = t.fixed || relOf(t.p, t.q, t.S);
      return relQ(d, `두 조건 ${cond('p', cH(t.p).replace(/\.$/, ''))}, ${cond('q', cH(t.q).replace(/\.$/, ''))}에 대하여 ${ej(pV, '은/는')} ${qV}이기 위한 어떤 조건인가?${t.note ? ` (단, ${t.note}이다.)` : ''}`, rel, {
        explain: t.fixed ? '정삼각형은 이등변삼각형이지만, 이등변삼각형이 모두 정삼각형인 것은 아니다. ' + `따라서 ${ej(pV, '은/는')} ${qV}이기 위한 ${REL_SAY[rel]}` : undefined
      });
    }),
    T('cond-pick', '「충분조건이지만 필요조건은 아닌」 짝 고르기', '②3', (d, n) => {
      const want = n === 0 ? 'suff' : 'nec';
      const make = () => {
        const roll = d.int(0, 9);
        if (roll < 5) { const t = pairOne(d, d.pick(ONE_PAIRS)); return { h: `${pV}: ${pH(t, 'p')}, ${qV}: ${pH(t, 'q')}`, rel: relOf(t.p, t.q, t.S) }; }
        if (roll < 8) { const t = d.pick(pairTwo(d).filter((u) => u.note.includes('실수'))); return { h: `${pV}: ${cH(t.p).replace(/\.$/, '')}, ${qV}: ${cH(t.q).replace(/\.$/, '')}`, rel: relOf(t.p, t.q, t.S) }; }
        const [p, q, nn] = d.pick(SET_PAIRS), flip = d.bool(), [u, w] = flip ? [q, p] : [p, q];
        return { h: `${pV}: ${u.h}, ${qV}: ${w.h}`, rel: setRel(u, w, nn), set: true };
      };
      const got = d.until(() => {
        const hit = d.until(make, (t) => t.rel === want), rest = [];
        for (let i = 0; i < 200 && rest.length < 4; i += 1) { const t = make(); if (t.rel !== want && t.h !== hit.h && !rest.some((r) => r.h === t.h)) rest.push(t); }
        return { hit, rest };
      }, (g) => g.rest.length === 4);
      return oneQ(d, `다음 중 ${ej(pV, '이/가')} ${qV}이기 위한 ${want === 'suff' ? '충분조건이지만 필요조건은 아닌' : '필요조건이지만 충분조건은 아닌'} 것은? (단, 문자는 모두 실수이고, ${V('A')}, ${V('B')}, ${V('C')}는 집합이다.)`,
        [got.hit].concat(got.rest).map((t) => ({ h: t.h, ok: t.rel === want, rel: t.rel })), true, {
          explain: (list, k) => `${quo(got.hit.h)}에서 두 조건의 진리집합을 ${PS}, ${QS}라고 하면 ${relWhy(want)}이다. 나머지 보기는 나온 차례대로 ${list.filter((_, i) => i !== k).map((t) => REL_SHORT[t.rel]).join(', ')}이다.`,
          rule: n === 0 ? 'pick-suff' : 'pick-nec'
        });
    }, { count: 2 }),
    T('cond-iff', '필요충분조건인 것 모두 고르기', '②4', (d, n) => {
      if (n === 0) {
        const make = () => { if (d.bool()) { const t = pairOne(d, d.pick(ONE_PAIRS)); return { h: `${pV}: ${pH(t, 'p')}, ${qV}: ${pH(t, 'q')}`, rel: relOf(t.p, t.q, t.S) }; } const t = d.pick(pairTwo(d).filter((u) => u.note.includes('실수'))); return { h: `${pV}: ${cH(t.p).replace(/\.$/, '')}, ${qV}: ${cH(t.q).replace(/\.$/, '')}`, rel: relOf(t.p, t.q, t.S) }; };
        const wants = mixWants(d, 3), rows = [];
        for (const want of wants) { const t = d.until(make, (u) => (u.rel === 'iff') === want && !rows.some((r) => r.h === u.h)); rows.push({ h: t.h, ok: t.rel === 'iff', why: t.rel === 'iff' ? '' : `${REL_SHORT[t.rel]}이다.` }); }
        return setsQ(d, `다음 보기에서 ${ej(pV, '이/가')} ${qV}이기 위한 필요충분조건인 것만을 있는 대로 고른 것은? (단, 문자는 모두 실수이다.)`, rows, { what: '필요충분조건인 것', rule: 'iff-pairs' });
      }
      const P = (h, f) => pr(h, '', f), ab = R2.ab;
      const TARGET = [
        [P(`${Av} = ${Bv} = 0`, (e) => e.a === 0 && e.b === 0), [P(`${Av}${Bv} = 0`, (e) => e.a * e.b === 0), P(`${sq(Av)} + ${sq(Bv)} = 0`, (e) => e.a * e.a + e.b * e.b === 0), P(`|${Av}| + |${Bv}| = 0`, (e) => Math.abs(e.a) + Math.abs(e.b) === 0), P(`|${Av} − ${Bv}| = 0`, (e) => e.a === e.b), P(`${Av} + ${Bv} = 0`, (e) => e.a + e.b === 0), P(`(${Av} − ${Bv})${sup(2)} + ${sq(Bv)} = 0`, (e) => (e.a - e.b) ** 2 + e.b * e.b === 0)]],
        [P(`${Av} = ${Bv}`, (e) => e.a === e.b), [P(`|${Av} − ${Bv}| = 0`, (e) => Math.abs(e.a - e.b) === 0), P(`${sq(Av)} = ${sq(Bv)}`, (e) => e.a * e.a === e.b * e.b), P(`(${Av} − ${Bv})${sup(2)} = 0`, (e) => (e.a - e.b) ** 2 === 0), P(`${Av}${sup(3)} = ${Bv}${sup(3)}`, (e) => e.a ** 3 === e.b ** 3), P(`|${Av}| = |${Bv}|`, (e) => Math.abs(e.a) === Math.abs(e.b)), P(`${Av} − ${Bv} ≥ 0`, (e) => e.a - e.b >= 0)]],
        [P(`${Av} = 0 또는 ${Bv} = 0`, (e) => e.a === 0 || e.b === 0), [P(`${Av}${Bv} = 0`, (e) => e.a * e.b === 0), P(`${sq(Av)} + ${sq(Bv)} = 0`, (e) => e.a * e.a + e.b * e.b === 0), P(`|${Av}||${Bv}| = 0`, (e) => Math.abs(e.a) * Math.abs(e.b) === 0), P(`${Av} + ${Bv} = 0`, (e) => e.a + e.b === 0), P(`${sq(Av)}${Bv} = 0`, (e) => e.a * e.a * e.b === 0)]]
      ];
      const [target, cands] = d.pick(TARGET);
      const picked = d.until(() => d.shuffle(cands).slice(0, 4).map((c) => ({ c, ok: sameSet(c, target, ab) })), (list) => list.some((r) => r.ok) && !list.every((r) => r.ok));
      return setsQ(d, `두 실수 ${Av}, ${Bv}에 대하여 다음 보기에서 ${quo(target.h)}이기 위한 필요충분조건인 것만을 있는 대로 고른 것은?`, picked.map(({ c, ok }) => ({ h: c.h, ok, why: ok ? '' : diffWhy(c, target, ab) })), {
        what: '필요충분조건인 것', rule: 'iff-target'
      });
    }, { count: 2 }),
    T('cond-sets', '집합 조건의 충분·필요 판단', '②6', (d) => {
      const [p, q, nn] = d.pick(SET_PAIRS.filter((t) => t[2] === 2)), flip = d.bool(), [u, w] = flip ? [q, p] : [p, q], rel = setRel(u, w, nn);
      return relQ(d, `전체집합 ${US}의 두 부분집합 ${V('A')}, ${V('B')}에 대하여 두 조건 ${pV}, ${qV}가 ${quo(`${pV}: ${u.h}`)}, ${quo(`${qV}: ${w.h}`)}일 때, ${ej(pV, '은/는')} ${qV}이기 위한 어떤 조건인가?`, rel, {
        explain: `${ej(u.h, '과/와')} ${ej(w.h, '을/를')} 포함 관계로 바꾸어 따지면 ${pV} ${IMP} ${qV}${rel === 'suff' || rel === 'iff' ? '이고' : '가 아니고'}, ${qV} ${IMP} ${pV}${rel === 'nec' || rel === 'iff' ? '이다' : '가 아니다'}. 따라서 ${ej(pV, '은/는')} ${qV}이기 위한 ${REL_SAY[rel]}`
      });
    }),
    T('cond-swap', '충분·필요 관계를 바꿔 말하기', '②7', (d) => {
      const nec = d.bool(), hyp = nec ? ['sub', 1, 0] : ['sub', 0, 1];
      const say = (x, y, kind) => `${lH(x)}는 ${lH(y)}이기 위한 ${kind}조건이다.`.replace(`${lH(x)}는`, ej(lH(x), '은/는'));
      const cands = [];
      for (const [x, y] of [[L(1), L(0)], [L(0, true), L(1, true)], [L(1, true), L(0, true)], [L(0), L(1)], [L(1), L(0, true)], [L(0, true), L(1)]]) for (const kind of ['충분', '필요']) {
        const r = kind === '충분' ? ['sub', lS(x), lS(y)] : ['sub', lS(y), lS(x)];
        if (lH(x) + lH(y) === lH(L(0)) + lH(L(1)) && kind === (nec ? '필요' : '충분')) continue;
        cands.push({ h: say(x, y, kind), ok: always([hyp], r, 2) });
      }
      const picked = d.until(() => d.shuffle(cands).slice(0, 4), (list) => list.some((r) => r.ok) && !list.every((r) => r.ok));
      return setsQ(d, `두 조건 ${pV}, ${qV}에 대하여 ${ej(pV, '이/가')} ${qV}이기 위한 ${nec ? '필요' : '충분'}조건일 때, 다음 보기에서 옳은 것만을 있는 대로 고른 것은?`, picked.map((r) => ({ h: r.h, ok: r.ok })), {
        lead: `${ej(pV, '이/가')} ${qV}이기 위한 ${nec ? '필요' : '충분'}조건이면 ${nec ? `${qV} ${IMP} ${pV}` : `${pV} ${IMP} ${qV}`}이고, 그 대우 ${nec ? `${NOT}${pV} ${IMP} ${NOT}${qV}` : `${NOT}${qV} ${IMP} ${NOT}${pV}`}도 성립한다.`, what: '옳은 것', rule: 'swap'
      });
    }),
    T('cond-chain', '충분·필요조건으로 주어진 세 조건 — 참인 명제', '②8', (d) => {
      const g = d.until(() => {
        const [x, y, z] = d.shuffle([0, 1, 2]), h1 = d.pick(['충분', '필요']), h2 = d.pick(['충분', '필요']);
        // 「x 는 y 이기 위한 h1 조건」, 「z 는 y 이기 위한 h2 조건」
        const r1 = h1 === '충분' ? ['sub', x, y] : ['sub', y, x], r2 = h2 === '충분' ? ['sub', z, y] : ['sub', y, z];
        const cands = [];
        for (let i = 0; i < 3; i += 1) for (let j = 0; j < 3; j += 1) if (i !== j) for (const s of [false, true]) cands.push({ u: L(i, s), w: L(j, s), ok: always([r1, r2], impR(L(i, s), L(j, s)), 3) });
        return { x, y, z, h1, h2, cands };
      }, (t) => t.cands.filter((c) => c.ok).length >= 2);
      const picked = d.until(() => d.shuffle(g.cands).slice(0, 4), (list) => list.some((c) => c.ok) && !list.every((c) => c.ok));
      const LT = [pV, qV, rV];
      return setsQ(d, `세 조건 ${pV}, ${qV}, ${rV}에 대하여 ${ej(LT[g.x], '은/는')} ${LT[g.y]}이기 위한 ${g.h1}조건, ${ej(LT[g.z], '은/는')} ${LT[g.y]}이기 위한 ${g.h2}조건일 때, 다음 보기에서 항상 참인 명제만을 있는 대로 고른 것은?`, picked.map((c) => ({ h: impH(c.u, c.w), ok: c.ok })), {
        lead: `충분조건·필요조건을 화살표(⇒)로 나타내고 대우와 삼단논법으로 잇는다.`, what: '항상 참인 명제'
      });
    }),
    T('cond-root', '충분·필요조건이 되도록 하는 상수 — 근 대입', '②9', (d, n) => {
      if (n === 0) {
        const { r, b } = d.until(() => ({ r: d.int(-4, 4), b: d.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]) }), (t) => t.r * t.r + t.b * t.r !== 0);
        const a = -(r * r + b * r);
        return numQ(`두 조건 ${cond('p', r === 0 ? `${sq(X)} = 0` : `(${linH(1, -r)})${sup(2)} = 0`)}, ${cond('q', `${sq(X)} ${b < 0 ? MINUS : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}${X} + ${Av} = 0`)}에 대하여 ${ej(pV, '이/가')} ${qV}이기 위한 충분조건일 때, 상수 ${Av}의 값은?`, a, {
          calc: `0-${jn(r)}*${jn(r)}-${jn(b)}*${jn(r)}`, unseen: [0].concat(Math.abs(b) === 1 ? [1] : []), rule: 'root-suff',
          explain: `${pV}의 진리집합 {${num(r)}}이 ${qV}의 진리집합에 포함되어야 하므로 ${par(r)}${sup(2)} ${b < 0 ? MINUS : '+'} ${Math.abs(b)} × ${par(r)} + ${Av} = 0에서 ${Av} = ${num(a)}이다.`
        });
      }
      if (n === 1) {
        const { r, c } = d.until(() => { const r0 = d.pick([-4, -3, -2, -1, 1, 2, 3, 4]); return { r: r0, c: r0 * d.pick([-5, -4, -3, -2, 2, 3, 4, 5]) }; }, (t) => t.r * t.r + t.c !== 0);
        const a = -(r * r + c) / r, qh = `${sq(X)} + ${Av}${X} ${c < 0 ? MINUS : '+'} ${Math.abs(c)} ≠ 0`;
        return numQ(`두 조건 ${cond('p', `${X} ≠ ${num(r)}`)}, ${cond('q', qh)}에 대하여 ${ej(pV, '은/는')} ${qV}이기 위한 필요조건일 때, 상수 ${Av}의 값은?`, a, {
          calc: `0-(${jn(r)}*${jn(r)}+${jn(c)})/${jn(r)}`, unseen: [0], rule: 'root-nec',
          explain: `${qV} ${IMP} ${pV}이므로 그 대우 ${quo(`${X} = ${num(r)}이면 ${qh.replace('≠', '=')}이다.`)}도 참이다. ${par(r)}${sup(2)} + ${Av} × ${par(r)} ${c < 0 ? MINUS : '+'} ${Math.abs(c)} = 0에서 ${Av} = ${num(a)}이다.`
        });
      }
      const { a, b, r } = d.until(() => ({ a: d.pick([-3, -2, -1, 1, 2, 3]), b: d.pick([-6, -5, -4, -3, 3, 4, 5, 6]), r: d.pick([-3, -2, -1, 1, 2, 3]) }), (t) => -t.a * t.r * t.r - t.b * t.r !== 0);
      const c = -a * r * r - b * r, ph = `${Av}${sq(X)} ${b < 0 ? MINUS : '+'} ${Math.abs(b)}${X} ${c < 0 ? MINUS : '+'} ${Math.abs(c)} ≠ 0`;
      return numQ(`두 조건 ${cond('p', ph)}, ${cond('q', `${X} ≠ ${num(r)}`)}에 대하여 ${ej(qV, '은/는')} ${pV}이기 위한 필요조건일 때, 상수 ${Av}의 값은?`, a, {
        calc: `0-(${jn(b)}*${jn(r)}+${jn(c)})/(${jn(r)}*${jn(r)})`, unseen: [0], rule: 'root-nec2',
        explain: `${pV} ${IMP} ${qV}이므로 그 대우 ${quo(`${X} = ${num(r)}이면 ${ph.replace('≠', '=')}이다.`)}도 참이다. ${Av} × ${par(r)}${sup(2)} ${b < 0 ? MINUS : '+'} ${Math.abs(b)} × ${par(r)} ${c < 0 ? MINUS : '+'} ${Math.abs(c)} = 0에서 ${Av} = ${num(a)}이다.`
      });
    }, { count: 3 }),
    T('cond-converse2', '역이 참이 되도록 하는 두 상수', '②10', (d) => {
      const { k, r1, r2 } = d.until(() => ({ k: d.int(1, 3), r1: d.int(-4, 3), r2: d.int(-3, 4) }), (t) => t.r1 < t.r2 && t.r1 + t.r2 !== 0 && t.r1 * t.r2 !== 0);
      const a = -k * (r1 + r2), b = k * r1 * r2;
      return slots(`두 조건 ${cond('p', `${k === 1 ? '' : k}${sq(X)} + ${Av}${X} + ${Bv} = 0`)}, ${cond('q', `${X} = ${num(r1)} 또는 ${X} = ${num(r2)}`)}에 대하여 명제 ${pV} ${TO} ${qV}의 역이 참일 때, 상수 ${Av}, ${Bv}의 값을 각각 구하시오.`, [[`${Av} =`, a, `0-${k}*(${jn(r1)}+${jn(r2)})`], [`${Bv} =`, b, `${k}*${jn(r1)}*${jn(r2)}`]], {
        unseen: [0].concat(k === 1 ? [1] : []),
        explain: `역 ${qV} ${TO} ${pV}가 참이므로 ${num(r1)}, ${ej(num(r2), '은/는')} 방정식 ${k === 1 ? '' : k}${sq(X)} + ${Av}${X} + ${Bv} = 0의 두 근이다. ${k === 1 ? '' : k}(${linH(1, -r1)})(${linH(1, -r2)}) = ${polyH(k, a, b)}이므로 ${Av} = ${num(a)}, ${Bv} = ${num(b)}이다.`
      });
    }),
    T('cond-oneside', '필요(충분)조건이 되도록 하는 상수의 최댓값·최솟값', '②11', (d, n) => {
      if (n === 0) {
        const s = d.int(-5, 2), t = s + d.int(2, 5);
        return numQ(`두 조건 ${cond('p', `${X} − ${Av} ≥ 0`)}, ${cond('q', `${num(s)} ≤ ${X} ≤ ${num(t)}`)}에 대하여 ${ej(pV, '이/가')} ${qV}이기 위한 필요조건일 때, 실수 ${Av}의 최댓값은?`, s, {
          calc: jn(s), rule: 'one-nec-max',
          explain: `${qV} ${IMP} ${pV}이므로 ${QS} ⊂ ${PS}이다. ${PS} = {${X} | ${X} ≥ ${Av}}이므로 ${Av} ≤ ${num(s)}이고, 최댓값은 ${num(s)}이다.`
        });
      }
      if (n === 1) {
        const m = d.int(2, 3), c = d.pick([-4, -3, -2, -1, 1, 2, 3]), a0 = d.int(-2, 4), t = m * a0 + c, s = t - d.int(2, 5);
        return numQ(`두 조건 ${cond('p', `${X} ≤ ${m}${Av} ${c < 0 ? MINUS : '+'} ${Math.abs(c)}`)}, ${cond('q', `${num(s)} ≤ ${X} ≤ ${num(t)}`)}에 대하여 ${ej(pV, '이/가')} ${qV}이기 위한 필요조건일 때, 실수 ${Av}의 최솟값은?`, a0, {
          calc: `(${jn(t)}-${jn(c)})/${m}`, rule: 'one-nec-min',
          explain: `${qV} ${IMP} ${pV}이므로 ${QS} ⊂ ${PS}이다. ${m}${Av} ${c < 0 ? MINUS : '+'} ${Math.abs(c)} ≥ ${num(t)}, 즉 ${Av} ≥ ${a0}이므로 최솟값은 ${a0}이다.`
        });
      }
      const s = d.int(-5, -1), t = d.int(2, 8);
      return numQ(`두 조건 ${cond('p', `${num(s)} &lt; ${X} &lt; ${Av} + 1`)}, ${cond('q', `${X} &lt; ${num(t)}`)}에 대하여 ${ej(pV, '이/가')} ${qV}이기 위한 충분조건일 때, 정수 ${Av}의 최댓값은?`, t - 1, {
        calc: `${jn(t)}-1`, rule: 'one-suff-max',
        explain: `${pV} ${IMP} ${qV}이므로 ${PS} ⊂ ${QS}이다. ${Av} + 1 ≤ ${num(t)}, 즉 ${Av} ≤ ${num(t - 1)}이므로 정수 ${Av}의 최댓값은 ${num(t - 1)}이다.`
      });
    }, { count: 3 }),
    T('cond-ends', '두 구간의 끝 상수 — 충분일 때와 필요일 때', '②12', (d, n) => {
      const s = d.int(-4, 2), t = s + d.int(2, 5);
      if (n === 2) {
        const s2 = d.int(-5, -1), t2 = d.int(1, 5);
        return numQ(`두 조건 ${cond('p', `${num(s2)} ≤ ${X} ≤ ${num(t2)}`)}, ${cond('q', `${Av} ≤ ${X} ≤ ${Bv}`)}에 대하여 ${ej(pV, '은/는')} ${qV}이기 위한 충분조건일 때, ${Av}${Bv}의 최댓값은?`, s2 * t2, {
          calc: `${jn(s2)}*${t2}`, rule: 'ends-product',
          explain: `${PS} ⊂ ${QS}이어야 하므로 ${Av} ≤ ${num(s2)}, ${Bv} ≥ ${t2}이다. ${Av}는 음수, ${Bv}는 양수이므로 ${Av}${Bv}는 ${Av} = ${num(s2)}, ${Bv} = ${t2}일 때 가장 크고, 최댓값은 ${num(s2 * t2)}이다.`
        });
      }
      const suff = n === 0;
      return slots(`실수 ${X}에 대한 두 조건 ${cond('p', `${num(s)} ≤ ${X} ≤ ${Av}`)}, ${cond('q', `${Bv} ≤ ${X} ≤ ${num(t)}`)}에 대하여 ${ej(pV, '이/가')} ${qV}이기 위한 ${suff ? '충분' : '필요'}조건일 때, 실수 ${Av}의 ${suff ? '최댓값' : '최솟값'}과 ${Bv}의 ${suff ? '최댓값' : '최솟값'}을 차례대로 구하시오. (단, ${Av} ≥ ${num(s)}, ${Bv} ≤ ${num(t)})`,
        [[`${Av}의 ${suff ? '최댓값' : '최솟값'}`, t, jn(t)], [`${Bv}의 ${suff ? '최댓값' : '최솟값'}`, s, jn(s)]], {
          rule: suff ? 'ends-suff' : 'ends-nec',
          explain: suff ? `${PS} ⊂ ${QS}이어야 하므로 ${Bv} ≤ ${num(s)}, ${Av} ≤ ${num(t)}이다. 따라서 ${Av}의 최댓값은 ${num(t)}, ${Bv}의 최댓값은 ${num(s)}이다.` : `${QS} ⊂ ${PS}이어야 하므로 ${Av} ≥ ${num(t)}, ${Bv} ≥ ${num(s)}이다. 따라서 ${Av}의 최솟값은 ${num(t)}, ${Bv}의 최솟값은 ${num(s)}이다.`
        });
    }, { count: 3 }),
    T('cond-abs', '절댓값 부등식의 진리집합으로 상수의 범위', '②13', (d, n) => {
      const c = d.int(-2, 3), r = d.int(1, 3);
      if (n === 0) {
        const m = d.pick([-2, -1, 1, 2]), k = d.pick([-2, -1, 1, 2]), amax = c - r - m, bmin = c + r - k;
        return slots(`두 조건 ${cond('p', `${absH(c)} &lt; ${r}`)}, ${cond('q', `${Av} ${m < 0 ? MINUS : '+'} ${Math.abs(m)} &lt; ${X} &lt; ${Bv} ${k < 0 ? MINUS : '+'} ${Math.abs(k)}`)}에 대하여 ${ej(pV, '이/가')} ${qV}이기 위한 충분조건일 때, 실수 ${Av}의 최댓값과 ${Bv}의 최솟값을 차례대로 구하시오.`,
          [[`${Av}의 최댓값`, amax, `${jn(c)}-${r}-${jn(m)}`], [`${Bv}의 최솟값`, bmin, `${jn(c)}+${r}-${jn(k)}`]], {
            rule: 'abs-suff', unseen: c === 0 ? [0] : [],
            explain: `${absH(c)} &lt; ${r}에서 ${num(c - r)} &lt; ${X} &lt; ${num(c + r)}이다. ${PS} ⊂ ${QS}이어야 하므로 ${Av} ${m < 0 ? MINUS : '+'} ${Math.abs(m)} ≤ ${num(c - r)}, ${Bv} ${k < 0 ? MINUS : '+'} ${Math.abs(k)} ≥ ${num(c + r)}이다. 따라서 ${Av} ≤ ${num(amax)}, ${Bv} ≥ ${num(bmin)}이다.`
          });
      }
      const R = r + d.int(1, 3);
      return slots(`두 조건 ${cond('p', `${absH(c)} &lt; ${r}`)}, ${cond('q', `|${X} − ${Av}| ≥ ${R}`)}에 대하여 명제 ${pV} ${TO} ${NOT}${ej(qV, '이/가')} 참이 되도록 하는 실수 ${Av}의 최솟값과 최댓값을 차례대로 구하시오.`,
        [['최솟값', c + r - R, `${jn(c)}+${r}-${R}`], ['최댓값', c - r + R, `${jn(c)}-${r}+${R}`]], {
          rule: 'abs-neg', unseen: c === 0 ? [0] : [],
          explain: `${PS} = {${X} | ${num(c - r)} &lt; ${X} &lt; ${num(c + r)}}, ${NOT}${qV}의 진리집합은 {${X} | ${Av} − ${R} &lt; ${X} &lt; ${Av} + ${R}}이다. ${PS} ⊂ ${QS}${sup('C')}이어야 하므로 ${Av} − ${R} ≤ ${num(c - r)}이고 ${Av} + ${R} ≥ ${num(c + r)}, 즉 ${num(c + r - R)} ≤ ${Av} ≤ ${num(c - r + R)}이다.`
        });
    }, { count: 2 }),
    T('cond-union', '「q 또는 r」이 p 이기 위한 충분조건', '②14', (d) => {
      const s = d.int(-5, -1), t = d.int(1, 4), u = t + d.int(2, 5), closed = d.bool(), ans = closed ? u + 1 : u;
      return numQ(`세 조건 ${cond('p', `${X} &lt; ${Kv}`)}, ${cond('q', `${X} ≤ ${num(s)}`)}, ${cond('r', `${t} ≤ ${X} ${closed ? '≤' : '&lt;'} ${u}`)}에 대하여 ${ej(quo(`${qV} 또는 ${rV}`), '이/가')} ${pV}이기 위한 충분조건이 되도록 하는 정수 ${Kv}의 최솟값은?`, ans, {
        calc: closed ? `${u}+1` : `${u}`, unseen: closed ? [1] : [], rule: 'union',
        explain: `(${QS} ∪ ${RS}) ⊂ ${PS}이어야 한다. ${QS} ⊂ ${PS}에서 ${Kv} &gt; ${num(s)}, ${RS} ⊂ ${PS}에서 ${Kv} ${closed ? '&gt;' : '≥'} ${u}이므로 정수 ${Kv}의 최솟값은 ${ans}이다.`
      });
    }),
    T('cond-negated', '부정(∼p, ∼q)이 든 조건의 상수', '②15', (d, n) => {
      if (n === 0) {
        const c1 = d.int(-4, 2), k = d.int(1, 3), c2 = c1 + 3 * k, a0 = 2 * k;
        return numQ(`두 조건 ${cond('p', `${X} ≤ 2${Av}${pc(c1)}`)}, ${cond('q', `${X} ≥ ${frac(Av, 2)}${pc(c2)}`)}에 대하여 명제 ${NOT}${qV} ${TO} ${ej(pV, '이/가')} 참이 되도록 하는 실수 ${Av}의 최솟값은?`, a0, {
          calc: `2*(${jn(c2)}-${jn(c1)})/3`, unseen: [3].concat(c1 === 0 || c2 === 0 ? [0] : []), rule: 'neg-cond',
          explain: `${NOT}${qV}의 진리집합은 {${X} | ${X} &lt; ${frac(Av, 2)}${pc(c2)}}이다. 이것이 ${PS}에 포함되어야 하므로 ${frac(Av, 2)}${pc(c2)} ≤ 2${Av}${pc(c1)}, 즉 ${Av} ≥ ${a0}이다.`
        });
      }
      const A = d.int(2, 5), s = d.pick([A, A - 1]), t = s === A ? A - d.int(0, 1) : A, u = d.pick([A, A + 1]), v = u === A ? A + d.int(0, 1) : A;
      return numQ(`세 조건 ${cond('p', `${X} &lt; ${MINUS}${Av} 또는 ${X} &gt; ${Av}`)}, ${cond('q', `${X} &lt; ${num(-s)} 또는 ${X} &gt; ${t}`)}, ${cond('r', `${num(-u)} ≤ ${X} ≤ ${v}`)}에 대하여 두 명제 ${NOT}${qV} ${TO} ${NOT}${pV}, ${NOT}${pV} ${TO} ${ej(rV, '이/가')} 모두 참이 되도록 하는 상수 ${Av}의 값은? (단, ${Av} &gt; 0)`, A, {
        calc: `${A}`, rule: 'neg-three',
        explain: `${NOT}${pV}, ${NOT}${qV}의 진리집합은 각각 {${X} | ${MINUS}${Av} ≤ ${X} ≤ ${Av}}, {${X} | ${num(-s)} ≤ ${X} ≤ ${t}}이다. ${QS}${sup('C')} ⊂ ${PS}${sup('C')} ⊂ ${RS}이어야 하므로 ${Av} ≥ ${Math.max(s, t)}이고 ${Av} ≤ ${Math.min(u, v)}이다. 따라서 ${Av} = ${A}이다.`
      });
    }, { count: 2 }),
    T('cond-both', '충분조건이면서 필요조건 — 상수의 최댓값·최솟값', '②16', (d) => {
      const w = d.int(1, 3), r = w + d.int(1, 3), T0 = d.int(w, w + 6), Mx = Math.min(T0 - r, r - w), mn = w - r;
      return slots(`세 조건 ${cond('p', `|${X} − ${Av}| ≤ ${r}`)}, ${cond('q', `${X} ≤ ${T0}`)}, ${cond('r', `|${X}| &lt; ${w}`)}에 대하여 ${ej(pV, '은/는')} ${qV}이기 위한 충분조건이고, ${ej(pV, '은/는')} ${rV}이기 위한 필요조건일 때, 실수 ${Av}의 최댓값과 최솟값을 차례대로 구하시오.`,
        [['최댓값', Mx, T0 - r < r - w ? `${T0}-${r}` : `${r}-${w}`], ['최솟값', mn, `${w}-${r}`]], {
          explain: `${PS} = {${X} | ${Av} − ${r} ≤ ${X} ≤ ${Av} + ${r}}이다. ${PS} ⊂ ${QS}에서 ${Av} ≤ ${T0 - r}, ${RS} ⊂ ${PS}에서 ${Av} − ${r} ≤ ${MINUS}${w}이고 ${Av} + ${r} ≥ ${w}, 즉 ${num(w - r)} ≤ ${Av} ≤ ${r - w}이다. 따라서 최댓값은 ${num(Mx)}, 최솟값은 ${num(mn)}이다.`
        });
    }),
    T('cond-quad', '이차부등식·이차함수로 주어진 진리집합의 상수', '②17', (d, n) => {
      if (n === 0) {
        const al = d.int(-3, 3), be = al + d.int(1, 4), ans = 0 - al;
        return numQ(`이차함수 ${V('f')}(${X}) = ${ej(polyH(-1, al + be, -al * be), '과/와')} 일차함수 ${V('g')}(${X}) = ${X} + ${Kv}에 대하여 두 조건 ${cond('p', `${V('f')}(${X}) ≥ 0`)}, ${cond('q', `${V('g')}(${X}) ≥ 0`)}이 있다. ${ej(pV, '이/가')} ${qV}이기 위한 충분조건이 되도록 하는 실수 ${Kv}의 최솟값은?`, ans, {
          calc: `0-${jn(al)}`, unseen: [0, Math.abs(al)], rule: 'quad-fg',
          explain: `${V('f')}(${X}) ≥ 0에서 (${linH(1, -al)})(${linH(1, -be)}) ≤ 0, 즉 ${num(al)} ≤ ${X} ≤ ${num(be)}이고, ${V('g')}(${X}) ≥ 0에서 ${X} ≥ ${MINUS}${Kv}이다. ${PS} ⊂ ${QS}이려면 ${MINUS}${Kv} ≤ ${num(al)}, 즉 ${Kv} ≥ ${num(-al)}이다.`
        });
      }
      const s = -d.int(2, 5), t = d.int(2, 6), cnt = Math.min(-s, t);
      return numQ(`실수 ${X}에 대한 두 조건 ${cond('p', `${polyH(1, -(s + t), s * t)} &gt; 0`)}, ${cond('q', `|${X}| ≠ ${Av}`)}에 대하여 ${ej(pV, '이/가')} ${qV}이기 위한 충분조건이 되도록 하는 자연수 ${Av}의 개수는?`, cnt, {
        signed: false, calc: `${cnt}`, unseen: [cnt], rule: 'quad-abs',
        explain: `${PS} = {${X} | ${X} &lt; ${num(s)} 또는 ${X} &gt; ${t}}이다. 대우 ${NOT}${qV} ${IMP} ${NOT}${pV}로 보면 ${Av}, ${MINUS}${Av}가 모두 ${num(s)} ≤ ${X} ≤ ${t}에 들어야 하므로 ${Av} ≤ ${cnt}이다. 자연수 ${Av}는 ${cnt}개이다.`
      });
    }, { count: 2 })
  ];

  // ════════════════════════════════════════════════════════════════
  // ── 대우를 이용한 증명법과 귀류법 ──
  const proofBox = (rows) => `<div class="mb-lines" style="padding:10px 12px;border:1.5px solid #94a3b8;border-radius:8px;font-size:1rem">${rows.map((r) => '<div>' + r + '</div>').join('')}</div>`;
  const BX = (label) => `<span class="mb-box">${label}</span>`;
  // k 에 대한 식이 같은가(여러 k 에 넣어 본다)
  const sameK = (f, g) => [-3, -2, -1, 0, 1, 2, 3, 4, 5].every((k) => f(k) === g(k));
  const DEFS = ['세 변의 길이가 같은 삼각형을 정삼각형이라고 한다.', '두 쌍의 대변이 각각 평행한 사각형을 평행사변형이라고 한다.', '네 변의 길이가 모두 같은 사각형을 마름모라고 한다.',
    '참 또는 거짓을 명확하게 판별할 수 있는 문장이나 식을 명제라고 한다.', '1보다 큰 자연수 중에서 1과 자기 자신만을 약수로 가지는 수를 소수라고 한다.', '문자에 어떤 실수를 대입해도 항상 성립하는 부등식을 절대부등식이라고 한다.'];
  const THMS = ['이등변삼각형의 두 밑각의 크기는 같다.', '직각삼각형에서 빗변의 길이의 제곱은 다른 두 변의 길이의 제곱의 합과 같다.', '삼각형의 세 내각의 크기의 합은 180°이다.',
    '평행사변형의 두 대각선은 서로 다른 것을 이등분한다.', '명제와 그 대우의 참, 거짓은 일치한다.', '두 홀수의 합은 짝수이다.'];
  const TERMS = [
    ['평행사변형', '두 쌍의 대변이 각각 평행한 사각형', ['네 변의 길이가 모두 같은 사각형', '네 내각의 크기가 모두 같은 사각형', '두 대각선의 길이가 같은 사각형', '한 쌍의 대변이 평행한 사각형']],
    ['마름모', '네 변의 길이가 모두 같은 사각형', ['두 쌍의 대변이 각각 평행한 사각형', '네 내각의 크기가 모두 같은 사각형', '두 대각선의 길이가 같은 사각형']],
    ['직사각형', '네 내각의 크기가 모두 같은 사각형', ['네 변의 길이가 모두 같은 사각형', '두 쌍의 대변이 각각 평행한 사각형', '두 대각선이 서로 수직인 사각형']],
    ['정사각형', '네 변의 길이가 모두 같고 네 내각의 크기가 모두 같은 사각형', ['네 변의 길이가 모두 같은 사각형', '네 내각의 크기가 모두 같은 사각형', '두 대각선이 서로 수직인 사각형']],
    ['합성수', '1보다 큰 자연수 중에서 1과 자기 자신 이외의 수를 약수로 가지는 수', ['약수가 2개뿐인 자연수', '2의 배수인 자연수', '소수가 아닌 자연수']],
    ['유리수', `두 정수 ${Av}, ${Bv}(${Bv} ≠ 0)에 대하여 ${frac(Av, Bv)}의 꼴로 나타낼 수 있는 수`, ['순환하지 않는 무한소수로 나타내어지는 수', '정수가 아닌 수', '0이 아닌 정수']]
  ];

  const proofTypes = [
    T('prove-define', '정의와 정리 가리기', '②20', (d, n) => {
      if (n === 0) {
        const def = d.pick(DEFS), thms = d.shuffle(THMS).slice(0, 3);
        return oneQ(d, '다음 중 용어의 정의인 것은?', [{ h: def, ok: true }].concat(thms.map((h) => ({ h, ok: false }))), true, {
          explain: '용어의 뜻을 명확하게 정한 문장이 정의이고, 참임이 증명된 명제 가운데 기본이 되는 것이 정리이다. 나머지는 증명된 성질(정리)이다.', rule: 'define-pick'
        });
      }
      const [term, right, wrongs] = d.pick(TERMS);
      return oneQ(d, `다음 중 ${term}의 정의로 옳은 것은?`, [{ h: right, ok: true }].concat(d.shuffle(wrongs).slice(0, 3).map((h) => ({ h, ok: false }))), true, {
        explain: `${term}의 정의는 「${right}」이다.`, rule: 'define-term'
      });
    }, { count: 2 }),
    T('prove-contra', '대우를 이용한 증명의 빈칸', '②21', (d, n) => {
      if (n === 0) {
        const three = d.bool(), plus = d.bool();
        if (!three) {
          const rep = plus ? `2${Kv} + 1` : `2${Kv} − 1`, sign = plus ? 1 : -1, right = (k) => 2 * k * k + sign * 2 * k;
          const cands = [{ h: poly([[2, sq(Kv)], [2 * sign, Kv]]), f: right }, { h: poly([[2, sq(Kv)], [-2 * sign, Kv]]), f: (k) => 2 * k * k - sign * 2 * k }, { h: poly([[4, sq(Kv)], [4 * sign, Kv]]), f: (k) => 4 * k * k + sign * 4 * k }, { h: poly([[2, sq(Kv)], [sign, Kv]]), f: (k) => 2 * k * k + sign * k }, { h: poly([[1, sq(Kv)], [sign, Kv]]), f: (k) => k * k + sign * k }];
          const words = ['홀수', '짝수'], rows = [];
          for (const c of cands) for (const w of words) rows.push({ h: `㈎ ${w}, ㈏ ${c.h}`, ok: w === '홀수' && sameK(c.f, (k) => ((2 * k + sign) ** 2 - 1) / 2) });
          const pick = [rows.find((r) => r.ok)].concat(d.shuffle(rows.filter((r) => !r.ok)).slice(0, 4));
          const fig = proofBox([`주어진 명제의 대우는 ${quo(`자연수 ${Nv}에 대하여 ${Nv}이 ${BX('㈎')}이면 ${sq(Nv)}은 홀수이다.`)}이다.`, `${Nv}이 ${BX('㈎')}이면 ${Nv} = ${rep}(${Kv}는 ${plus ? '0 또는 자연수' : '자연수'})로 나타낼 수 있으므로`, nb(`${sq(Nv)} = (${rep})${sup(2)} = 2(${BX('㈏')}) + 1`), `이므로 ${sq(Nv)}은 홀수이다. 따라서 대우가 참이므로 주어진 명제도 참이다.`]);
          return oneQ(d, `다음은 명제 ${quo(`자연수 ${Nv}에 대하여 ${sq(Nv)}이 짝수이면 ${Nv}은 짝수이다.`)}가 참임을 대우를 이용하여 증명한 것이다. ㈎, ㈏에 알맞은 것을 차례대로 나열한 것은?`, pick, true, {
            figure: fig, rule: 'contra-even',
            explain: `「짝수이다」의 부정은 「홀수이다」이다. (${rep})${sup(2)} = ${poly([[4, sq(Kv)], [4 * sign, Kv], [1, '']])} = 2(${poly([[2, sq(Kv)], [2 * sign, Kv]])}) + 1이다.`
          });
        }
        const r = plus ? 1 : 2, rep = `3${Kv} + ${r}`, right = (k) => ((3 * k + r) ** 2 - 1) / 3;
        const cands = [{ h: poly([[3, sq(Kv)], [2 * r, Kv], [(r * r - 1) / 3, '']]), f: (k) => 3 * k * k + 2 * r * k + (r * r - 1) / 3 }, { h: poly([[3, sq(Kv)], [r, Kv], [(r * r - 1) / 3, '']]), f: (k) => 3 * k * k + r * k + (r * r - 1) / 3 }, { h: poly([[9, sq(Kv)], [6 * r, Kv]]), f: (k) => 9 * k * k + 6 * r * k }, { h: poly([[3, sq(Kv)], [2 * r, Kv], [r * r, '']]), f: (k) => 3 * k * k + 2 * r * k + r * r }];
        const words = ['3의 배수가 아니면', '3의 배수이면'], rows = [];
        for (const c of cands) for (const w of words) rows.push({ h: `㈎ ${w}, ㈏ ${c.h}`, ok: w === '3의 배수가 아니면' && sameK(c.f, right) });
        const pick = [rows.find((x) => x.ok)].concat(d.shuffle(rows.filter((x) => !x.ok)).slice(0, 4));
        const fig = proofBox([`주어진 명제의 대우는 ${quo(`자연수 ${Nv}에 대하여 ${Nv}이 ${BX('㈎')} ${sq(Nv)}도 3의 배수가 아니다.`)}이다.`, `${Nv}이 3의 배수가 아니면 ${Nv} = 3${Kv} + 1 또는 ${Nv} = 3${Kv} + 2(${Kv}는 0 또는 자연수)로 나타낼 수 있다.`, `${Nv} = ${rep}일 때 ${nb(`${sq(Nv)} = (${rep})${sup(2)} = 3(${BX('㈏')}) + 1`)}`, `이므로 ${sq(Nv)}은 3의 배수가 아니다. (다른 경우도 같다.) 따라서 주어진 명제도 참이다.`]);
        return oneQ(d, `다음은 명제 ${quo(`자연수 ${Nv}에 대하여 ${sq(Nv)}이 3의 배수이면 ${Nv}도 3의 배수이다.`)}가 참임을 대우를 이용하여 증명한 것의 일부이다. ㈎, ㈏에 알맞은 것을 차례대로 나열한 것은?`, pick, true, {
          figure: fig, rule: 'contra-three',
          explain: `대우는 결론과 가정을 각각 부정하여 바꾼 것이므로 ㈎는 「3의 배수가 아니면」이다. (${rep})${sup(2)} = ${poly([[9, sq(Kv)], [6 * r, Kv], [r * r, '']])} = 3(${cands[0].h}) + 1이다.`
        });
      }
      if (n === 1) {
        const form = d.pick([['a', 'b', 'c', `${sq(Av)} + ${sq(Bv)} ≠ ${sq(Cv)}`, `${sq(Av)} + ${sq(Bv)}`, `${sq(Cv)}`], ['a', 'b', 'c', `${sq(Av)} ≠ ${sq(Bv)} + ${sq(Cv)}`, `${sq(Bv)} + ${sq(Cv)}`, `${sq(Av)}`]]);
        const words = [['홀수', '홀수', '짝수', '홀수'], ['짝수', '짝수', '짝수', '홀수'], ['홀수', '홀수', '홀수', '짝수'], ['홀수', '짝수', '짝수', '홀수'], ['짝수', '홀수', '홀수', '짝수']];
        const ok = (w) => w.join() === ['홀수', [1, 3, 5].map((v) => (v * v) % 2 ? '홀수' : '짝수')[0], (1 + 9) % 2 ? '홀수' : '짝수', (5 * 5) % 2 ? '홀수' : '짝수'].join();
        const fig = proofBox([`주어진 명제의 대우는 ${quo(`자연수 ${Av}, ${Bv}, ${Cv}에 대하여 ${Av}, ${Bv}, ${Cv}가 모두 ${BX('㈎')}이면 ${form[3]}이다.`)}이다.`, `${Av}, ${Bv}, ${Cv}가 모두 ${BX('㈎')}이면 ${sq(Av)}, ${sq(Bv)}, ${sq(Cv)}도 모두 ${BX('㈏')}이다.`, `이때 ${form[4]}은 ${BX('㈐')}이고, ${form[5]}은 ${BX('㈑')}이므로 ${form[3]}이다.`, '따라서 대우가 참이므로 주어진 명제도 참이다.']);
        return oneQ(d, `다음은 명제 ${quo(`자연수 ${Av}, ${Bv}, ${Cv}에 대하여 ${form[3].replace('≠', '=')}이면 ${Av}, ${Bv}, ${Cv} 중 적어도 하나는 짝수이다.`)}가 참임을 대우를 이용하여 증명한 것이다. ㈎ ~ ㈑에 알맞은 것을 차례대로 나열한 것은?`, words.map((w) => ({ h: w.join(', '), ok: ok(w) })), true, {
          figure: fig, rule: 'contra-parity',
          explain: '「적어도 하나는 짝수」의 부정은 「모두 홀수」이다. 홀수의 제곱은 홀수, 홀수끼리의 합은 짝수이므로 차례대로 홀수, 홀수, 짝수, 홀수이다.'
        });
      }
      const prod = d.bool(), op = prod ? `${X}${Yv}` : `${X} + ${Yv}`, slotsW = ['대우', '유리수', '정수', '유리수', '참'], wrongW = ['역', '무리수', '자연수', '무리수', '거짓'];
      const bad = d.int(0, 4), opts = slotsW.map((w, i) => ({ h: `${['㈎', '㈏', '㈐', '㈑', '㈒'][i]}: ${i === bad ? wrongW[i] : w}`, ok: i !== bad }));
      const fig = proofBox([`주어진 명제의 ${BX('㈎')}는 ${quo(`두 실수 ${X}, ${Yv}에 대하여 ${X}, ${Yv}가 모두 ${BX('㈏')}이면 ${op}는 ${BX('㈏')}이다.`)}이다.`, `${X}, ${Yv}가 ${BX('㈏')}이면 ${X} = ${frac(V('q'), V('p'))}, ${Yv} = ${frac(V('s'), V('r'))}(${V('p')}, ${V('q')}, ${V('r')}, ${V('s')}는 정수, ${V('p')} ≠ 0, ${V('r')} ≠ 0)로 나타낼 수 있으므로`, `${op} = ${prod ? frac(V('q') + V('s'), V('p') + V('r')) : frac(V('q') + V('r') + ' + ' + V('p') + V('s'), V('p') + V('r'))}`, `이때 ${ej(V('p') + V('r'), '과/와')} ${prod ? V('q') + V('s') : V('q') + V('r') + ' + ' + V('p') + V('s')}는 ${BX('㈐')}이고 ${V('p')}${V('r')} ≠ 0이므로 ${op}는 ${BX('㈑')}이다.`, `따라서 대우가 참이므로 주어진 명제도 ${BX('㈒')}이다.`]);
      return oneQ(d, `다음은 명제 ${quo(`두 실수 ${X}, ${Yv}에 대하여 ${op}가 무리수이면 ${X} 또는 ${Yv}는 무리수이다.`)}가 참임을 증명한 것이다. ㈎ ~ ㈒에 알맞은 것으로 옳지 않은 것은?`, opts, false, {
        keep: true, figure: fig, rule: 'contra-irr',
        explain: `바르게 채우면 ㈎ 대우, ㈏ 유리수, ㈐ 정수, ㈑ 유리수, ㈒ 참이다. 따라서 옳지 않은 것은 ${opts[bad].h}이다.`
      });
    }, { count: 3 }),
    T('prove-sqrt', '귀류법 증명의 빈칸 — √k 는 유리수가 아니다', '②22', (d) => {
      const k = d.pick([2, 3, 5, 7]), mult = k === 2 ? '짝수' : `${k}의 배수`;
      const right = ['유리수', '서로소인', mult], wrongs = [['무리수', '서로소인', mult], ['유리수', '공약수가 있는', mult], ['유리수', '서로소인', k === 2 ? '홀수' : `${k * k}의 배수`], ['정수', '서로소인', mult], ['무리수', '공약수가 있는', mult]];
      const fig = proofBox([`${ej(rt(k), '이/가')} ${BX('㈎')}라고 가정하면 ${rt(k)} = ${frac(Av, Bv)}(${Av}, ${Bv}는 ${BX('㈏')} 자연수)로 나타낼 수 있다.`,
        `양변을 제곱하여 정리하면 ${sq(Av)} = ${k}${sq(Bv)}`, `이때 ${sq(Av)}이 ${BX('㈐')}이므로 ${Av}도 ${BX('㈐')}이다. ${Av} = ${k}${Kv}(${Kv}는 자연수)라고 하면 ${k * k}${sq(Kv)} = ${k}${sq(Bv)}, 즉 ${sq(Bv)} = ${k}${sq(Kv)}`,
        `이때 ${sq(Bv)}이 ${BX('㈐')}이므로 ${Bv}도 ${BX('㈐')}이다. 이것은 ${Av}, ${Bv}가 ${BX('㈏')} 자연수라는 가정에 모순이다.`, `따라서 ${ej(rt(k), '은/는')} 유리수가 아니다.`]);
      return oneQ(d, `다음은 명제 ${quo(`${ej(rt(k), '은/는')} 유리수가 아니다.`)}가 참임을 귀류법을 이용하여 증명한 것이다. ㈎, ㈏, ㈐에 알맞은 것을 차례대로 나열한 것은?`, [right].concat(d.shuffle(wrongs).slice(0, 4)).map((w, i) => ({ h: w.join(', '), ok: i === 0 })), true, {
        figure: fig, explain: `결론을 부정하여 ${ej(rt(k), '이/가')} 유리수라고 가정한다. ${frac(Av, Bv)}는 더 줄일 수 없는 분수이므로 ${Av}, ${Bv}는 서로소이고, ${Av}, ${Bv}가 모두 ${mult}가 되어 모순이다.`
      });
    }),
    T('prove-irr', '귀류법 증명의 빈칸 — 유리수와 무리수의 합, 소수와 짝수', '②23', (d, n) => {
      if (n === 0) {
        const a = d.pick([1, 2, 3, 4]), k = d.pick([2, 3, 5]);
        const rows = [['유리수', '유리수', '무리수'], ['무리수', '유리수', '무리수'], ['유리수', '무리수', '유리수'], ['유리수', '유리수', '유리수'], ['무리수', '무리수', '유리수']];
        const fig = proofBox([`${a} + ${rt(k)}${ej(rt(k), '이/가').slice(rt(k).length)} ${BX('㈎')}라고 가정하면 ${a} + ${rt(k)} = ${Av}(${Av}는 ${BX('㈎')})로 나타낼 수 있다.`, `이때 ${rt(k)} = ${Av} − ${a}이고 우변의 ${ej(`${Av} − ${a}`, '은/는')} ${BX('㈏')}이다.`, `그런데 좌변의 ${ej(rt(k), '은/는')} ${BX('㈐')}이므로 모순이다.`, `따라서 ${a} + ${ej(rt(k), '은/는')} 유리수가 아니다.`]);
        return oneQ(d, `다음은 명제 ${quo(`${a} + ${ej(rt(k), '은/는')} 유리수가 아니다.`)}가 참임을 귀류법을 이용하여 증명한 것이다. ㈎, ㈏, ㈐에 알맞은 것을 차례대로 나열한 것은?`, rows.map((w, i) => ({ h: w.join(', '), ok: i === 0 })), true, {
          figure: fig, rule: 'irr-sum', explain: `결론을 부정하여 유리수라고 가정한다. 유리수에서 유리수를 빼면 유리수인데 ${ej(rt(k), '은/는')} 무리수이므로 모순이다.`
        });
      }
      const rows = [['홀수', '짝수', '합성수'], ['짝수', '홀수', '합성수'], ['홀수', '짝수', '소수'], ['홀수', '홀수', '합성수'], ['짝수', '짝수', '소수']];
      const fig = proofBox([`${Nv} + 1이 ${BX('㈎')}라고 가정하면 ${ej(Nv, '은/는')} ${BX('㈏')}이다.`, `이때 ${ej(Nv, '은/는')} 2의 배수이고 ${Nv} ≠ 2이므로 ${ej(Nv, '은/는')} ${BX('㈐')}이다.`, `이것은 ${ej(Nv, '이/가')} 소수라는 가정에 모순이다.`, `따라서 자연수 ${Nv}에 대하여 ${ej(Nv, '이/가')} 2가 아닌 소수이면 ${Nv} + 1은 짝수이다.`]);
      return oneQ(d, `다음은 명제 ${quo(`자연수 ${Nv}에 대하여 ${ej(Nv, '이/가')} 2가 아닌 소수이면 ${Nv} + 1은 짝수이다.`)}가 참임을 귀류법을 이용하여 증명한 것이다. ㈎, ㈏, ㈐에 알맞은 것을 차례대로 나열한 것은?`, rows.map((w, i) => ({ h: w.join(', '), ok: i === 0 })), true, {
        figure: fig, rule: 'irr-prime', explain: `결론을 부정하여 ${Nv} + 1이 홀수라고 가정하면 ${ej(Nv, '은/는')} 짝수이고, 2가 아닌 짝수는 2를 약수로 가지는 합성수이므로 모순이다.`
      });
    }, { count: 2 }),
    T('prove-calc', '식을 따라가는 귀류법 빈칸', '②24', (d, n) => {
      if (n === 0) {
        const plus = d.bool(), sg = plus ? 1 : -1, a = `2${Mv} ${plus ? '+' : '−'} 1`, b = `2${Nv} ${plus ? '+' : '−'} 1`;
        // a² + b² = 4(m² ± m + ㈎) + ㈏
        const cands = [[poly([[1, sq(Nv)], [sg, Nv]]), 2, 4], [poly([[1, sq(Nv)], [-sg, Nv]]), 2, 4], [poly([[1, sq(Nv)], [sg, Nv]]), 1, 4], [poly([[1, sq(Nv)], [sg, Nv]]), 2, 16], [poly([[1, sq(Nv)], [-sg, Nv]]), 1, 16]];
        const check = ([h, t]) => { const fv = h === cands[0][0] ? (m, nn) => nn * nn + sg * nn : (m, nn) => nn * nn - sg * nn; return [1, 2, 3, 4].every((m) => [1, 2, 3, 5].every((nn) => (2 * m + sg) ** 2 + (2 * nn + sg) ** 2 === 4 * (m * m + sg * m + fv(m, nn)) + t)); };
        const rows = cands.map((c) => ({ h: `${c[0]}, ${c[1]}, ${c[2]}`, ok: check(c) && c[2] === 4 }));
        const fig = proofBox([`${Av}, ${Bv}가 모두 홀수라고 가정하면 ${Av} = ${a}, ${Bv} = ${b}(${Mv}, ${Nv}은 ${plus ? '0 또는 자연수' : '자연수'})로 나타낼 수 있으므로`, `${sq(Av)} + ${sq(Bv)} = 4(${poly([[1, sq(Mv)], [sg, Mv]])} + ${BX('㈎')}) + ${BX('㈏')}`, `이때 ${sq(Av)} + ${sq(Bv)}은 짝수이므로 ${sq(Av)} + ${sq(Bv)} = ${sq(Cv)}에서 ${ej(Cv, '은/는')} 짝수이고, ${sq(Av)} + ${sq(Bv)}은 ${BX('㈐')}의 배수이다.`, `그런데 위의 식에서 ${sq(Av)} + ${sq(Bv)}은 ${BX('㈐')}의 배수가 아니므로 모순이다. 따라서 ${Av}, ${Bv} 중 적어도 하나는 짝수이다.`]);
        return oneQ(d, `다음은 명제 ${quo(`자연수 ${Av}, ${Bv}, ${Cv}에 대하여 ${sq(Av)} + ${sq(Bv)} = ${sq(Cv)}이면 ${Av}, ${Bv} 중 적어도 하나는 짝수이다.`)}가 참임을 증명한 것이다. ㈎, ㈏, ㈐에 알맞은 것을 차례대로 나열한 것은?`, rows, true, {
          figure: fig, rule: 'calc-pyth',
          explain: `(${a})${sup(2)} + (${b})${sup(2)} = 4(${poly([[1, sq(Mv)], [sg, Mv]])} + ${cands[0][0]}) + 2이다. ${ej(Cv, '이/가')} 짝수이면 ${sq(Cv)}은 4의 배수인데, 좌변은 4로 나눈 나머지가 2이므로 모순이다.`
        });
      }
      const plus = d.bool(), lhs = plus ? `${sq(Nv)} + 1` : `${sq(Nv)} − 1`, cond0 = plus ? `자연수 ${Nv}` : `${Nv} ≥ 2인 자연수 ${Nv}`;
      const step = plus ? `${sq(V('q'))} − ${sq(Nv)}` : `${sq(Nv)} − ${sq(V('q'))}`, f1 = plus ? `(${V('q')} + ${Nv})(${V('q')} − ${Nv})` : `(${Nv} + ${V('q')})(${Nv} − ${V('q')})`;
      const rows = [[1, 1], [-1, 1], [1, -1], [-1, -1], [2, 2]].map(([u, w], i) => ({ h: `㈎ ${num(u)}, ㈏ ${num(w)}`, ok: i === 0 }));
      const fig = proofBox([`${rt(lhs)}이 유리수라고 가정하면 ${rt(lhs)} = ${frac(V('q'), V('p'))}(${V('p')}, ${V('q')}는 서로소인 자연수)로 나타낼 수 있다. 양변을 제곱하면`, `${lhs} = ${frac(sq(V('q')), sq(V('p')))} …… ①`, `①의 좌변은 자연수이고, ${V('p')}와 ${V('q')}는 서로소이므로 ${sq(V('p'))} = ${BX('㈎')} …… ②`, `②를 ①에 대입하여 정리하면 ${step} = ${BX('㈏')}, ${f1} = ${BX('㈏')}`, `이것은 ${Nv}, ${V('q')}가 자연수라는 가정에 모순이다. 따라서 ${ej(rt(lhs), '은/는')} 무리수이다.`]);
      return oneQ(d, `다음은 ${cond0}에 대하여 ${ej(rt(lhs), '이/가')} 무리수임을 귀류법을 이용하여 증명한 것이다. ㈎, ㈏에 알맞은 수를 차례대로 나열한 것은?`, rows, true, {
        figure: fig, rule: 'calc-root',
        explain: `${ej(frac(sq(V('q')), sq(V('p'))), '이/가')} 자연수이고 ${V('p')}, ${V('q')}가 서로소이므로 ${sq(V('p'))} = 1이다. 그러면 ${step} = 1, 즉 ${f1} = 1이다. 그런데 ${ej(plus ? `${V('q')} + ${Nv}` : `${Nv} + ${V('q')}`, '은/는')} 2 이상의 자연수이고 ${ej(plus ? `${V('q')} − ${Nv}` : `${Nv} − ${V('q')}`, '은/는')} 정수이므로 두 수의 곱은 1이 될 수 없어 모순이다.`
      });
    }, { count: 2 }),
    T('prove-start', '증명에서 보여야 할 것(대우)·처음 가정할 것(귀류법)', '②25', (d, n) => {
      if (n === 0) {
        const P = (h, nh, f) => pr(h, nh, f), Zp = grid2('m', 'n', 1, 7).filter((e) => e.m > 0 && e.n > 0);
        const odd = (v) => Math.abs(v % 2) === 1;
        const POOL = [
          { p: P(`${Mv}${Nv}이 짝수`, `${Mv}${Nv}이 홀수`, (e) => !odd(e.m * e.n)), q: OR(P(`${Mv}이 짝수`, `${Mv}이 홀수`, (e) => !odd(e.m)), P(`${Nv}이 짝수`, `${Nv}이 홀수`, (e) => !odd(e.n))), S: Zp, head: `자연수 ${Mv}, ${Nv}에 대하여 ` },
          { p: P(`${sq(Mv)} + ${sq(Nv)}이 홀수`, `${sq(Mv)} + ${sq(Nv)}이 짝수`, (e) => odd(e.m * e.m + e.n * e.n)), q: P(`${Mv}${Nv}은 짝수`, `${Mv}${Nv}이 홀수`, (e) => !odd(e.m * e.n)), S: Zp, head: `자연수 ${Mv}, ${Nv}에 대하여 ` },
          { p: P(`${sq(Mv)}이 3의 배수가 아니`, `${sq(Mv)}이 3의 배수`, (e) => (e.m * e.m) % 3 !== 0), q: P(`${Mv}도 3의 배수가 아니`, `${Mv}이 3의 배수`, (e) => e.m % 3 !== 0), S: Zp, head: `자연수 ${Mv}에 대하여 ` },
          { p: at(`${X}${Yv}`, '!=', 2, (e) => e.x * e.y), q: OR(xr('!=', 1), vr('y', '!=', 2)), S: R2.xy, head: `두 실수 ${X}, ${Yv}에 대하여 ` },
          { p: at(`${sq(Av)} + ${sq(Bv)}`, '=', 0, (e) => e.a * e.a + e.b * e.b), q: AND(vr('a', '=', 0), vr('b', '=', 0)), S: R2.ab, head: `두 실수 ${Av}, ${Bv}에 대하여 ` }
        ];
        const t = d.pick(POOL), sayC = (c) => (c.k === 'pr' ? c.h : cH(c)), stm = (u, w) => `${t.head}${sayC(u).replace(/^(\S+)도 /, '$1이 ')}이면 ${sayC(w)}이다.`.replace(/아니이면/, '아니면').replace(/아니이다/, '아니다');
        const cands = [[cN(t.q), cN(t.p)], [t.q, t.p], [cN(t.p), cN(t.q)], [t.p, t.q]].concat(t.q.k === 'or' || t.q.k === 'and' ? [[(t.q.k === 'or' ? OR : AND)(...t.q.list.map(cN)), cN(t.p)]] : []);
        const isRight = ([u, w]) => sameSet(u, cN(t.q), t.S) && sameSet(w, cN(t.p), t.S);
        const rows = [], seen = new Set();
        for (const cd of cands) { const h = quo(stm(cd[0], cd[1])); if (seen.has(h)) continue; seen.add(h); rows.push({ h, ok: isRight(cd) && rows.every((r) => !r.ok) }); }
        return oneQ(d, `명제 ${quo(stm(t.p, t.q))}가 참임을 대우를 이용하여 증명하려고 한다. 참임을 보여야 하는 명제는?`, rows, true, {
          rule: 'start-contra', explain: `대우는 가정과 결론을 각각 부정하여 서로 바꾼 명제이므로 ${rows.find((r) => r.ok).h}이다. 명제와 그 대우는 참, 거짓이 같다.`
        });
      }
      const k = d.pick([2, 3, 5]), a = d.int(1, 4);
      const POOL = [
        [`${ej(rt(k), '은/는')} 유리수가 아니다.`, `${ej(rt(k), '이/가')} 유리수라고 가정한다.`, [`${ej(rt(k), '이/가')} 무리수라고 가정한다.`, `${ej(rt(k), '이/가')} 정수라고 가정한다.`, `(${rt(k)})${sup(2)}이 유리수라고 가정한다.`]],
        [`${a} + ${ej(rt(k), '은/는')} 유리수가 아니다.`, `${a} + ${ej(rt(k), '이/가')} 유리수라고 가정한다.`, [`${a} + ${ej(rt(k), '이/가')} 무리수라고 가정한다.`, `${ej(rt(k), '이/가')} 무리수라고 가정한다.`, `${a} + ${ej(rt(k), '이/가')} 자연수라고 가정한다.`]],
        [`두 실수 ${X}, ${Yv}에 대하여 ${X}${Yv} ≠ 0이면 ${X} ≠ 0이고 ${Yv} ≠ 0이다.`, `${X}${Yv} ≠ 0이고, ${X} = 0 또는 ${Yv} = 0이라고 가정한다.`, [`${X}${Yv} ≠ 0이고, ${X} = 0이고 ${Yv} = 0이라고 가정한다.`, `${X}${Yv} = 0이고, ${X} ≠ 0이고 ${Yv} ≠ 0이라고 가정한다.`, `${X}${Yv} = 0이고, ${X} = 0 또는 ${Yv} = 0이라고 가정한다.`]],
        [`자연수 ${Nv}에 대하여 ${ej(Nv, '이/가')} 2가 아닌 소수이면 ${Nv} + 1은 짝수이다.`, `${ej(Nv, '이/가')} 2가 아닌 소수이고, ${Nv} + 1은 홀수라고 가정한다.`, [`${ej(Nv, '이/가')} 2가 아닌 소수이고, ${Nv} + 1은 짝수라고 가정한다.`, `${ej(Nv, '이/가')} 합성수이고, ${Nv} + 1은 홀수라고 가정한다.`, `${ej(Nv, '이/가')} 짝수이고, ${Nv} + 1은 짝수라고 가정한다.`]]
      ];
      const [s, right, wrongs] = d.pick(POOL);
      return oneQ(d, `명제 ${quo(s)}가 참임을 귀류법을 이용하여 증명할 때, 처음에 가정하는 것은?`, [{ h: right, ok: true }].concat(wrongs.map((h) => ({ h, ok: false }))), true, {
        rule: 'start-absurd', explain: `귀류법은 가정은 그대로 두고 결론을 부정한 것을 가정하여 모순을 이끌어 내는 방법이다. 따라서 ${right.replace(/가정한다\.$/, '가정한다.')}`
      });
    }, { count: 2 })
  ];

  // ════════════════════════════════════════════════════════════════
  // ── 절대부등식 ──
  const POS2 = (() => { const out = []; for (let i = 1; i <= 32; i += 1) for (let j = 1; j <= 32; j += 1) out.push({ a: i / 4, b: j / 4 }); return out; })();
  const EPS = 1e-9;
  const cmpOp = (u, v, op) => (op === '>' ? u > v + EPS : op === '>=' ? u >= v - EPS : op === '<' ? u < v - EPS : u <= v + EPS);
  const ABS4 = (() => { const out = [], vs = range(-3, 3); for (const a of vs) for (const b of vs) for (const x of vs) for (const y of vs) out.push({ a, b, x, y }); return out; })();
  // 한 문자 부등식(참·거짓은 −40 ~ 40 의 1/8 간격 수에 넣어 가린다)
  function oneIneq(d, kind) {
    const a = d.int(-4, 4), b = d.int(1, 5), m = d.int(1, 3), P = (h, f) => pr(h, '', f);
    let c;
    switch (kind) {
      case 'lin': { const k = d.pick([1, 2, 3]), t = d.int(1, 6); c = P(`${linH(k, t)} &gt; 0`, (e) => k * e.x + t > 0); break; }
      case 'absGe': c = P(`${absH(a)} ≥ 0`, (e) => Math.abs(e.x - a) >= 0); break;
      case 'absGt': c = P(`${absH(a)} &gt; 0`, (e) => Math.abs(e.x - a) > 0); break;
      case 'quadPos': { const bb = d.int(-4, 4), cc = Math.floor(bb * bb / 4) + d.int(1, 3), op = d.pick(['>', '>=']); c = P(`${polyH(1, bb, cc)} ${OPH[op]} 0`, (e) => cmpOp(e.x * e.x + bb * e.x + cc, 0, op)); break; }
      case 'quadZero': { const op = d.pick(['>', '>=']); c = P(`${polyH(1, -2 * a, a * a)} ${OPH[op]} 0`, (e) => cmpOp(e.x * e.x - 2 * a * e.x + a * a, 0, op)); break; }
      case 'quadNeg': { const r1 = d.int(-4, 2), r2 = r1 + d.int(1, 4), op = d.pick(['>', '>=']); c = P(`${polyH(1, -(r1 + r2), r1 * r2)} ${OPH[op]} 0`, (e) => cmpOp((e.x - r1) * (e.x - r2), 0, op)); break; }
      case 'moved': { const r1 = -d.int(1, 4), r2 = r1 - d.int(1, 3), bb = -(r1 + r2), cc = r1 * r2; c = P(`${polyH(1, bb, 0)} ≥ ${num(-cc)}`, (e) => e.x * e.x + bb * e.x >= -cc); break; }
      case 'twoSide': { const k = m + 1, t = b; c = P(`${k}${sq(X)} + ${t} &gt; ${m === 1 ? '' : m}${sq(X)}`, (e) => k * e.x * e.x + t > m * e.x * e.x); break; }
      case 'const': c = P(`${linH(1, -b)} &lt; ${linH(1, m)}`, (e) => e.x - b < e.x + m); break;
      case 'absX': c = P(`|${X}| ≥ ${X}`, (e) => Math.abs(e.x) >= e.x); break;
      default: c = P(`${m}${sq(X)} + 1 &lt; 0`, (e) => m * e.x * e.x + 1 < 0);
    }
    const truth = holdsAll(c, RX), bad = nice(RX).find((e) => !cF(c, e));
    return { h: c.h, truth, why: truth ? '모든 실수에서 성립한다.' : `${X} = ${numH(bad.x)}일 때 성립하지 않는다.` };
  }
  const ONE_INEQ = ['lin', 'absGe', 'absGt', 'quadPos', 'quadZero', 'quadNeg', 'moved', 'twoSide', 'const', 'absX', 'negQuad'];
  // 두 문자 부등식(−6 ~ 6 의 1/4 간격 수의 짝)
  function twoIneq(d, kind) {
    const k = d.int(2, 6), P = (h, f) => pr(h, '', f), A = Av, Bb = Bv;
    const list = {
      sqDiff: P(`${sq(A)} − ${sq(Bb)} ≥ 0`, (e) => e.a * e.a - e.b * e.b >= 0),
      absMinus: P(`|${A}| + |${Bb}| ≥ |${A} − ${Bb}|`, (e) => Math.abs(e.a) + Math.abs(e.b) >= Math.abs(e.a - e.b)),
      absPlus: P(`|${A}| + |${Bb}| ≥ |${A} + ${Bb}|`, (e) => Math.abs(e.a) + Math.abs(e.b) >= Math.abs(e.a + e.b)),
      eqStrict: P(`${sq(A)} + ${k * k} &gt; ${2 * k}${A}`, (e) => e.a * e.a + k * k > 2 * k * e.a),
      eqWeak: P(`${sq(A)} + ${k * k} ≥ ${2 * k}${A}`, (e) => e.a * e.a + k * k >= 2 * k * e.a),
      lin: P(`${k}${A} − 1 &lt; ${k}${A} + 2`, (e) => k * e.a - 1 < k * e.a + 2),
      negSq: P(`${MINUS}${sq(A)} − 2${A} − ${k} ≤ 0`, (e) => -e.a * e.a - 2 * e.a - k <= 0),
      absSum: P(`|${A} + ${Bb}| ≥ |${A} − ${Bb}|`, (e) => Math.abs(e.a + e.b) >= Math.abs(e.a - e.b)),
      threeT: P(`${sq(A)} + 3${sq(Bb)} ≥ 3${A}${Bb}`, (e) => e.a * e.a + 3 * e.b * e.b >= 3 * e.a * e.b),
      threeF: P(`${sq(A)} + ${sq(Bb)} ≥ 3${A}${Bb}`, (e) => e.a * e.a + e.b * e.b >= 3 * e.a * e.b),
      twoStrict: P(`${sq(A)} + ${sq(Bb)} &gt; 2${A}${Bb}`, (e) => e.a * e.a + e.b * e.b > 2 * e.a * e.b),
      mixed: P(`${sq(A)} + ${A}${Bb} + ${sq(Bb)} ≥ 0`, (e) => e.a * e.a + e.a * e.b + e.b * e.b >= 0)
    };
    const c = list[kind], truth = holdsAll(c, R2.ab), bad = nice(R2.ab).find((e) => !cF(c, e));
    return { h: c.h, truth, why: truth ? '모든 실수에서 성립한다.' : `${showE(bad)}일 때 성립하지 않는다.` };
  }
  const TWO_INEQ = ['sqDiff', 'absMinus', 'absPlus', 'eqStrict', 'eqWeak', 'lin', 'negSq', 'absSum', 'threeT', 'threeF', 'twoStrict', 'mixed'];
  // 두 양수의 부등식(1/4 ~ 8 의 1/4 간격)
  function posIneq(kind) {
    const A = Av, Bb = Bv, P = (h, f) => pr(h, '', f), s = Math.sqrt;
    const list = {
      rootSum: P(`${rt(A)} + ${rt(Bb)} &gt; ${rt(A + ' + ' + Bb)}`, (e) => cmpOp(s(e.a) + s(e.b), s(e.a + e.b), '>')),
      odd: P(`${rt('3' + A)} + ${rt(Bb)} ≥ 3${rt(A + Bb)}`, (e) => cmpOp(s(3 * e.a) + s(e.b), 3 * s(e.a * e.b), '>=')),
      rms: P(`${rt(frac(sq(A) + ' + ' + sq(Bb), 2))} ≥ ${frac(A + ' + ' + Bb, 2)}`, (e) => cmpOp(s((e.a * e.a + e.b * e.b) / 2), (e.a + e.b) / 2, '>=')),
      amStrict: P(`${frac(A + ' + ' + Bb, 2)} &gt; ${rt(A + Bb)}`, (e) => cmpOp((e.a + e.b) / 2, s(e.a * e.b), '>')),
      hm: P(`${frac('2' + A + Bb, A + ' + ' + Bb)} ≤ ${rt(A + Bb)}`, (e) => cmpOp(2 * e.a * e.b / (e.a + e.b), s(e.a * e.b), '<=')),
      root2: P(`${rt(A)} + ${rt(Bb)} ≤ ${rt('2(' + A + ' + ' + Bb + ')')}`, (e) => cmpOp(s(e.a) + s(e.b), s(2 * (e.a + e.b)), '<=')),
      ratioStrict: P(`${frac(A, Bb)} + ${frac(Bb, A)} &gt; 2`, (e) => cmpOp(e.a / e.b + e.b / e.a, 2, '>')),
      prod4: P(`(${A} + ${Bb})(${frac(1, A)} + ${frac(1, Bb)}) ≥ 4`, (e) => cmpOp((e.a + e.b) * (1 / e.a + 1 / e.b), 4, '>='))
    };
    const c = list[kind], truth = holdsAll(c, POS2), bad = nice(POS2).find((e) => !cF(c, e));
    return { h: c.h, truth, why: truth ? '항상 성립한다.' : `${showE(bad)}일 때 성립하지 않는다.` };
  }
  const POS_INEQ = ['rootSum', 'odd', 'rms', 'amStrict', 'hm', 'root2', 'ratioStrict', 'prod4'];
  // 증명의 빈칸에 들어갈 식이 맞는가: 여러 수를 넣어 본다.
  const sameAB = (f, g, S) => (S || R2.ab).every((e) => Math.abs(f(e) - g(e)) < 1e-9);
  const SQUARE_VIEW = (m) => (m === 1 ? Bv : m + Bv);

  // 등호가 성립하는 조건을 고르는 부등식: [부등식 글, 변수 이름 글, 넣어 볼 수, 등호 조건 함수, 보기 [글, 함수]…(첫째가 답 후보)]
  const P2 = (h, f) => ({ h, f });
  const EQ_POOL = [
    [`2(${sq(Av)} + ${sq(Bv)}) ≥ (${Av} + ${Bv})${sup(2)}`, `${Av}, ${Bv}`, R2.ab, (e) => 2 * (e.a * e.a + e.b * e.b) === (e.a + e.b) ** 2, [P2(`${Av} = ${Bv}`, (e) => e.a === e.b), P2(`${Av} = ${MINUS}${Bv}`, (e) => e.a === -e.b), P2(`${Av} = ${Bv} = 0`, (e) => e.a === 0 && e.b === 0), P2(`${Av}${Bv} = 0`, (e) => e.a * e.b === 0)]],
    [`${sq(Av)} + ${sq(Bv)} ≥ ${Av}${Bv}`, `${Av}, ${Bv}`, R2.ab, (e) => e.a * e.a + e.b * e.b === e.a * e.b, [P2(`${Av} = ${Bv} = 0`, (e) => e.a === 0 && e.b === 0), P2(`${Av} = ${Bv}`, (e) => e.a === e.b), P2(`${Av} = ${MINUS}${Bv}`, (e) => e.a === -e.b), P2(`${Av}${Bv} = 0`, (e) => e.a * e.b === 0)]],
    [`(${Av}${Bv} − 1)${sup(2)} ≥ (${sq(Av)} − 1)(${sq(Bv)} − 1)`, `${Av}, ${Bv}`, R2.ab, (e) => (e.a * e.b - 1) ** 2 === (e.a * e.a - 1) * (e.b * e.b - 1), [P2(`${Av} = ${Bv}`, (e) => e.a === e.b), P2(`${Av} = ${MINUS}${Bv}`, (e) => e.a === -e.b), P2(`${Av}${Bv} = 1`, (e) => e.a * e.b === 1), P2(`${Av} = ${Bv} = 1`, (e) => e.a === 1 && e.b === 1)]],
    [`|${Av}| + |${Bv}| ≥ |${Av} + ${Bv}|`, `${Av}, ${Bv}`, R2.ab, (e) => Math.abs(e.a) + Math.abs(e.b) === Math.abs(e.a + e.b), [P2(`${Av}${Bv} ≥ 0`, (e) => e.a * e.b >= 0), P2(`${Av}${Bv} ≤ 0`, (e) => e.a * e.b <= 0), P2(`${Av} = ${Bv}`, (e) => e.a === e.b), P2(`${Av} = ${MINUS}${Bv}`, (e) => e.a === -e.b)]],
    [`|${Av}| + |${Bv}| ≥ |${Av} − ${Bv}|`, `${Av}, ${Bv}`, R2.ab, (e) => Math.abs(e.a) + Math.abs(e.b) === Math.abs(e.a - e.b), [P2(`${Av}${Bv} ≤ 0`, (e) => e.a * e.b <= 0), P2(`${Av}${Bv} ≥ 0`, (e) => e.a * e.b >= 0), P2(`${Av} = ${Bv}`, (e) => e.a === e.b), P2(`${Av} = ${MINUS}${Bv}`, (e) => e.a === -e.b)]],
    [`(${Av} + ${Bv})${sup(2)} ≥ 4${Av}${Bv}`, `${Av}, ${Bv}`, R2.ab, (e) => (e.a + e.b) ** 2 === 4 * e.a * e.b, [P2(`${Av} = ${Bv}`, (e) => e.a === e.b), P2(`${Av} = ${MINUS}${Bv}`, (e) => e.a === -e.b), P2(`${Av}${Bv} = 0`, (e) => e.a * e.b === 0), P2(`${Av} = ${Bv} = 0`, (e) => e.a === 0 && e.b === 0)]],
    [`${sq(Av)} + 2${Av}${Bv} + 2${sq(Bv)} ≥ 0`, `${Av}, ${Bv}`, R2.ab, (e) => e.a * e.a + 2 * e.a * e.b + 2 * e.b * e.b === 0, [P2(`${Av} = ${Bv} = 0`, (e) => e.a === 0 && e.b === 0), P2(`${Av} = ${MINUS}${Bv}`, (e) => e.a === -e.b), P2(`${Bv} = 0`, (e) => e.b === 0), P2(`${Av} = ${Bv}`, (e) => e.a === e.b)]],
    [`${sq(Av)} + ${sq(Bv)} + ${sq(Cv)} ≥ ${Av}${Bv} + ${Bv}${Cv} + ${Cv}${Av}`, `${Av}, ${Bv}, ${Cv}`, grid3, (e) => e.a * e.a + e.b * e.b + e.c * e.c === e.a * e.b + e.b * e.c + e.c * e.a, [P2(`${Av} = ${Bv} = ${Cv}`, (e) => e.a === e.b && e.b === e.c), P2(`${Av} + ${Bv} + ${Cv} = 0`, (e) => e.a + e.b + e.c === 0), P2(`${Av} = ${Bv}`, (e) => e.a === e.b), P2(`${Av}${Bv}${Cv} = 0`, (e) => e.a * e.b * e.c === 0)]],
    [`(${sq(Av)} + ${sq(Bv)})(${sq(X)} + ${sq(Yv)}) ≥ (${Av}${X} + ${Bv}${Yv})${sup(2)}`, `${Av}, ${Bv}, ${X}, ${Yv}`, ABS4, (e) => (e.a * e.a + e.b * e.b) * (e.x * e.x + e.y * e.y) === (e.a * e.x + e.b * e.y) ** 2, [P2(`${Av}${Yv} = ${Bv}${X}`, (e) => e.a * e.y === e.b * e.x), P2(`${Av}${X} = ${Bv}${Yv}`, (e) => e.a * e.x === e.b * e.y), P2(`${Av} = ${X}이고 ${Bv} = ${Yv}`, (e) => e.a === e.x && e.b === e.y), P2(`${Av}${Bv} = ${X}${Yv}`, (e) => e.a * e.b === e.x * e.y)]]
  ];

  // 등호 조건의 까닭(EQ_POOL 과 같은 차례): 양변의 차를 완전제곱식(절댓값은 제곱의 차)으로 나타낸다
  const EQ_WHY = [
    `2(${sq(Av)} + ${sq(Bv)}) − (${Av} + ${Bv})${sup(2)} = (${Av} − ${Bv})${sup(2)} ≥ 0이다.`,
    `${sq(Av)} + ${sq(Bv)} − ${Av}${Bv} = (${Av} − ${frac(Bv, 2)})${sup(2)} + ${frac(3, 4)}${sq(Bv)} ≥ 0이고, 두 항이 모두 0이어야 등호가 성립한다.`,
    `(${Av}${Bv} − 1)${sup(2)} − (${sq(Av)} − 1)(${sq(Bv)} − 1) = ${sq(Av)} − 2${Av}${Bv} + ${sq(Bv)} = (${Av} − ${Bv})${sup(2)} ≥ 0이다.`,
    `(|${Av}| + |${Bv}|)${sup(2)} − |${Av} + ${Bv}|${sup(2)} = 2(|${Av}${Bv}| − ${Av}${Bv}) ≥ 0이고, |${Av}${Bv}| = ${Av}${Bv}이어야 등호가 성립한다.`,
    `(|${Av}| + |${Bv}|)${sup(2)} − |${Av} − ${Bv}|${sup(2)} = 2(|${Av}${Bv}| + ${Av}${Bv}) ≥ 0이고, |${Av}${Bv}| = ${MINUS}${Av}${Bv}이어야 등호가 성립한다.`,
    `(${Av} + ${Bv})${sup(2)} − 4${Av}${Bv} = (${Av} − ${Bv})${sup(2)} ≥ 0이다.`,
    `${sq(Av)} + 2${Av}${Bv} + 2${sq(Bv)} = (${Av} + ${Bv})${sup(2)} + ${sq(Bv)} ≥ 0이고, ${Av} + ${Bv} = 0, ${Bv} = 0이어야 등호가 성립한다.`,
    `${sq(Av)} + ${sq(Bv)} + ${sq(Cv)} − (${Av}${Bv} + ${Bv}${Cv} + ${Cv}${Av}) = ${frac(1, 2)}{(${Av} − ${Bv})${sup(2)} + (${Bv} − ${Cv})${sup(2)} + (${Cv} − ${Av})${sup(2)}} ≥ 0이다.`,
    `(${sq(Av)} + ${sq(Bv)})(${sq(X)} + ${sq(Yv)}) − (${Av}${X} + ${Bv}${Yv})${sup(2)} = (${Av}${Yv} − ${Bv}${X})${sup(2)} ≥ 0이다.`
  ];
  if (EQ_WHY.length !== EQ_POOL.length) throw new Error('EQ_WHY 수가 EQ_POOL 과 다르다');
  const ineqTypes = [
    T('ineq-one', '한 문자 부등식 가운데 절대부등식 고르기', '②26', (d) => {
      const list = fillProps(d, ONE_INEQ, mixWants(d, 4), (kind) => oneIneq(d, kind));
      return setsQ(d, `${ej(X, '이/가')} 실수일 때, 다음 보기에서 절대부등식인 것만을 있는 대로 고른 것은?`, list.map((s) => ({ h: s.h, ok: s.truth, why: s.why })), {
        lead: '문자에 어떤 실수를 넣어도 항상 성립하는 부등식이 절대부등식이다. 한 번이라도 성립하지 않으면 절대부등식이 아니다.', what: '절대부등식'
      });
    }),
    T('ineq-two', '두 문자 부등식 가운데 절대부등식 고르기', '②27', (d) => {
      const wants = mixWants(d, 4), list = fillProps(d, TWO_INEQ, wants, (kind) => twoIneq(d, kind));
      return setsQ(d, `${Av}, ${Bv}가 실수일 때, 다음 보기에서 절대부등식인 것만을 있는 대로 고른 것은?`, list.map((s) => ({ h: s.h, ok: s.truth, why: s.why })), {
        lead: '등호가 성립하는 값이 있으면 「&gt;」인 부등식은 그 값에서 성립하지 않는다.', what: '절대부등식'
      });
    }),
    T('ineq-positive', '두 양수에 대한 부등식 가운데 항상 성립하는 것', '②28', (d) => {
      const list = fillProps(d, POS_INEQ, mixWants(d, 3), (kind) => posIneq(kind));
      return setsQ(d, `두 양수 ${Av}, ${Bv}에 대하여 다음 보기에서 항상 성립하는 부등식만을 있는 대로 고른 것은?`, list.map((s) => ({ h: s.h, ok: s.truth, why: s.why })), {
        lead: '양변이 모두 양수이면 양변을 제곱하여 그 차의 부호를 본다.', what: '항상 성립하는 부등식'
      });
    }),
    T('ineq-square', '완전제곱식으로 증명하는 과정의 빈칸', '②29', (d, n) => {
      if (n === 0) {
        const m = d.int(1, 3), t = d.int(1, 3), c = m * m + t, lhs = `${sq(Av)} + ${c}${sq(Bv)} − ${2 * m}${Av}${Bv}`, sqH = `(${Av} − ${SQUARE_VIEW(m)})${sup(2)}`;
        const E = [[poly([[t, sq(Bv)]]), (e) => t * e.b * e.b], [poly([[c, sq(Bv)]]), (e) => c * e.b * e.b], [poly([[t, Bv]]), (e) => t * e.b], [poly([[t + 1, sq(Bv)]]), (e) => (t + 1) * e.b * e.b]];
        const Z = [['0', 0], ['1', 1], [String(m), m]];
        const diff = (e) => e.a * e.a + c * e.b * e.b - 2 * m * e.a * e.b - (e.a - m * e.b) ** 2;
        const all = []; for (const [eh, ef] of E) for (const [zh, zv] of Z) if (!all.some((r) => r.h === `㈎ ${eh}, ㈏ ${zh}`)) all.push({ h: `㈎ ${eh}, ㈏ ${zh}`, ok: sameAB(ef, diff) && zv === 0 });
        const rows = [all.find((r) => r.ok)].concat(d.shuffle(all.filter((r) => !r.ok)).slice(0, 4));
        const fig = proofBox([`${lhs} = ${sqH} + ${BX('㈎')}`, `이때 ${sqH} ≥ 0, ${BX('㈎')} ≥ 0이므로 ${lhs} ≥ 0, 즉 ${sq(Av)} + ${c}${sq(Bv)} ≥ ${2 * m}${Av}${Bv}`, `여기서 등호는 ${Av} − ${SQUARE_VIEW(m)} = 0이고 ${Bv} = 0, 즉 ${Av} = ${Bv} = ${BX('㈏')}일 때 성립한다.`]);
        return oneQ(d, `다음은 ${Av}, ${Bv}가 실수일 때, 부등식 ${sq(Av)} + ${c}${sq(Bv)} ≥ ${2 * m}${Av}${Bv}가 성립함을 증명한 것이다. ㈎, ㈏에 알맞은 것을 차례대로 나열한 것은?`, rows, true, {
          figure: fig, rule: 'square-coef', explain: `${sqH} = ${sq(Av)} − ${2 * m}${Av}${Bv} + ${m * m === 1 ? '' : m * m}${sq(Bv)}이므로 ㈎는 ${E[0][0]}이다. 두 제곱이 모두 0일 때 등호가 성립하므로 ${Av} = ${Bv} = 0이다.`
        });
      }
      const half = d.bool(), diffF = half ? (e) => (e.a * e.a + e.b * e.b) / 2 - ((e.a + e.b) / 2) ** 2 : (e) => 2 * (e.a * e.a + e.b * e.b) - (e.a + e.b) ** 2, scale = half ? 4 : 1;
      const E = [[`(${Av} − ${Bv})${sup(2)}`, (e) => (e.a - e.b) ** 2], [`(${Av} + ${Bv})${sup(2)}`, (e) => (e.a + e.b) ** 2]], Eq = [[`${Av} = ${Bv}`, (e) => e.a === e.b], [`${Av} = ${MINUS}${Bv}`, (e) => e.a === -e.b], [`${Av} = ${Bv} = 0`, (e) => e.a === 0 && e.b === 0]];
      const all = []; for (const [eh, ef] of E) for (const [qh, qf] of Eq) all.push({ h: `㈎ ${eh}, ㈏ ${qh}`, ok: sameAB((e) => ef(e) / scale, diffF) && R2.ab.every((e) => (Math.abs(diffF(e)) < 1e-12) === qf(e)) });
      const rows = [all.find((r) => r.ok)].concat(d.shuffle(all.filter((r) => !r.ok)).slice(0, 4));
      const ineq = half ? `${frac(sq(Av) + ' + ' + sq(Bv), 2)} ≥ (${frac(Av + ' + ' + Bv, 2)})${sup(2)}` : `2(${sq(Av)} + ${sq(Bv)}) ≥ (${Av} + ${Bv})${sup(2)}`;
      const lines0 = half ? [`${frac(sq(Av) + ' + ' + sq(Bv), 2)} − (${frac(Av + ' + ' + Bv, 2)})${sup(2)} = ${frac(`2(${sq(Av)} + ${sq(Bv)}) − (${sq(Av)} + 2${Av}${Bv} + ${sq(Bv)})`, 4)} = ${frac(BX('㈎'), 4)} ≥ 0`] : [`2(${sq(Av)} + ${sq(Bv)}) − (${Av} + ${Bv})${sup(2)} = 2${sq(Av)} + 2${sq(Bv)} − ${sq(Av)} − 2${Av}${Bv} − ${sq(Bv)} = ${BX('㈎')} ≥ 0`];
      const fig = proofBox(lines0.concat([`따라서 ${ineq}이다.`, `여기서 등호는 ${BX('㈏')}일 때 성립한다.`]));
      return oneQ(d, `다음은 ${Av}, ${Bv}가 실수일 때, 부등식 ${ej(ineq, '이/가')} 성립함을 증명한 것이다. ㈎, ㈏에 알맞은 것을 차례대로 나열한 것은?`, rows, true, {
        figure: fig, rule: 'square-mean', explain: `정리하면 ${half ? '분자가 ' : ''}${sq(Av)} − 2${Av}${Bv} + ${sq(Bv)} = (${Av} − ${Bv})${sup(2)}${half ? '' : ''}이고, 이것이 0일 때, 즉 ${Av} = ${Bv}일 때 등호가 성립한다.`
      });
    }, { count: 2 }),
    T('ineq-squarediff', '양변 제곱의 차로 증명하는 과정의 빈칸', '②30', (d, n) => {
      if (n === 0) {
        const plus = d.bool(), sg = plus ? 1 : -1, op = plus ? '+' : '−';
        const A = [[`|${Av} ${op} ${Bv}|${sup(2)}`, (e) => (e.a + sg * e.b) ** 2], [`|${Av} ${plus ? '−' : '+'} ${Bv}|${sup(2)}`, (e) => (e.a - sg * e.b) ** 2]];
        const Bx = [[`|${Av}${Bv}| ${plus ? '−' : '+'} ${Av}${Bv}`, (e) => Math.abs(e.a * e.b) - sg * e.a * e.b], [`|${Av}${Bv}| ${plus ? '+' : '−'} ${Av}${Bv}`, (e) => Math.abs(e.a * e.b) + sg * e.a * e.b]];
        const Cx = [[`${Av}${Bv} ≥ 0`, (e) => e.a * e.b >= 0], [`${Av}${Bv} ≤ 0`, (e) => e.a * e.b <= 0], [`${Av} = ${Bv}`, (e) => e.a === e.b]];
        const lhs = (e) => (Math.abs(e.a) + Math.abs(e.b)) ** 2, eq = (e) => Math.abs(e.a) + Math.abs(e.b) === Math.abs(e.a + sg * e.b);
        const all = []; for (const a of A) for (const b of Bx) for (const c of Cx) all.push({ h: `${a[0]}, ${b[0]}, ${c[0]}`, ok: sameAB((e) => lhs(e) - a[1](e), (e) => 2 * b[1](e)) && R2.ab.every((e) => eq(e) === c[1](e)) });
        const rows = [all.find((r) => r.ok)].concat(d.shuffle(all.filter((r) => !r.ok)).slice(0, 4));
        const fig = proofBox([`|${Av}| + |${Bv}| ≥ 0, |${Av} ${op} ${Bv}| ≥ 0이므로 (|${Av}| + |${Bv}|)${sup(2)} ≥ |${Av} ${op} ${Bv}|${sup(2)}임을 보이면 된다.`, `(|${Av}| + |${Bv}|)${sup(2)} − ${BX('㈎')} = (${sq(Av)} + 2|${Av}${Bv}| + ${sq(Bv)}) − (${sq(Av)} ${plus ? '+' : '−'} 2${Av}${Bv} + ${sq(Bv)}) = 2(${BX('㈏')})`, `그런데 |${Av}${Bv}| ≥ ${plus ? '' : MINUS}${Av}${Bv}이므로 2(${BX('㈏')}) ≥ 0이다. 따라서 |${Av}| + |${Bv}| ≥ |${Av} ${op} ${Bv}|이고, 등호는 ${BX('㈐')}일 때 성립한다.`]);
        return oneQ(d, `다음은 ${Av}, ${Bv}가 실수일 때, 부등식 |${Av}| + |${Bv}| ≥ |${Av} ${op} ${Bv}|가 성립함을 증명한 것이다. ㈎, ㈏, ㈐에 알맞은 것을 차례대로 나열한 것은?`, rows, true, {
          figure: fig, rule: 'diff-abs', explain: `|${Av} ${op} ${Bv}|${sup(2)} = (${Av} ${op} ${Bv})${sup(2)}이므로 차는 2(|${Av}${Bv}| ${plus ? '−' : '+'} ${Av}${Bv})이고, 이것이 0일 때(${plus ? `${Av}${Bv} ≥ 0` : `${Av}${Bv} ≤ 0`}) 등호가 성립한다.`
        });
      }
      const sqrt = Math.sqrt, POSS = POS2.slice(0, 400);
      const A = [[rt(Av + ' + ' + Bv), (e) => sqrt(e.a + e.b)], [`${rt(Av)} + ${rt(Bv)}`, (e) => sqrt(e.a) + sqrt(e.b)], [`${Av} + ${Bv}`, (e) => e.a + e.b]];
      const Bx = [[`${Av} + ${Bv}`, (e) => e.a + e.b], [`${Av} + ${Bv} + 2${rt(Av + Bv)}`, (e) => e.a + e.b + 2 * sqrt(e.a * e.b)], [rt(Av + ' + ' + Bv), (e) => sqrt(e.a + e.b)]];
      const all = []; for (const a of A) for (const b of Bx) all.push({ h: `㈎ ${a[0]}, ㈏ ${b[0]}`, ok: sameAB(a[1], (e) => sqrt(e.a + e.b), POSS) && sameAB(b[1], (e) => a[1](e) ** 2, POSS) });
      const rows = [all.find((r) => r.ok)].concat(d.shuffle(all.filter((r) => !r.ok)).slice(0, 4));
      const fig = proofBox([`${rt(Av)} + ${rt(Bv)} &gt; 0, ${rt(Av + ' + ' + Bv)} &gt; 0이므로 (${rt(Av)} + ${rt(Bv)})${sup(2)} &gt; (${BX('㈎')})${sup(2)}임을 보이면 된다.`, `(${rt(Av)} + ${rt(Bv)})${sup(2)} − (${BX('㈎')})${sup(2)} = (${Av} + 2${rt(Av + Bv)} + ${Bv}) − (${BX('㈏')}) = 2${rt(Av + Bv)} &gt; 0`, `따라서 ${rt(Av)} + ${rt(Bv)} &gt; ${rt(Av + ' + ' + Bv)}이다.`]);
      return oneQ(d, `다음은 ${Av} &gt; 0, ${Bv} &gt; 0일 때, 부등식 ${rt(Av)} + ${rt(Bv)} &gt; ${rt(Av + ' + ' + Bv)}가 성립함을 증명한 것이다. ㈎, ㈏에 알맞은 것을 차례대로 나열한 것은?`, rows, true, {
        figure: fig, rule: 'diff-root', explain: `우변 ${ej(rt(Av + ' + ' + Bv), '을/를')} 제곱하면 ${Av} + ${Bv}이므로 ㈎는 ${rt(Av + ' + ' + Bv)}, ㈏는 ${Av} + ${Bv}이다.`
      });
    }, { count: 2 }),
    T('ineq-equal', '절대부등식에서 등호가 성립하는 조건', '②31', (d) => {
      const picked = d.pick(EQ_POOL), [h, vars, S, eq, cands] = picked;
      const rows = d.shuffle(cands).map((c) => ({ h: c.h, ok: S.every((e) => eq(e) === c.f(e)) }));
      return oneQ(d, `${vars}가 실수일 때, 절대부등식 ${h}에서 등호가 성립하는 조건은?`, rows, true, {
        keep: true, explain: `${EQ_WHY[EQ_POOL.indexOf(picked)]} 따라서 등호는 ${rows.find((r) => r.ok).h}일 때 성립한다.`
      });
    }),
    T('ineq-amgm', '산술평균과 기하평균 — 곱이 일정한 두 항의 합의 최솟값', '②32', (d, n) => {
      if (n === 0) {
        const s = d.int(2, 6), form = d.int(0, 2);
        if (form === 0) return numQ(`${Av} &gt; 0일 때, ${Av} + ${frac(s * s, Av)}의 최솟값은?`, 2 * s, { signed: false, calc: `2*${s}`, unseen: [2, s], rule: 'amgm-1', explain: `${Av} &gt; 0, ${frac(s * s, Av)} &gt; 0이므로 ${Av} + ${frac(s * s, Av)} ≥ 2${rt(Av + ' × ' + frac(s * s, Av))} = ${2 * s}이다. 등호는 ${Av} = ${s}일 때 성립하므로 최솟값은 ${2 * s}이다.` });
        const [m, k] = d.pick([[1, 4], [4, 1], [2, 8], [8, 2], [9, 1], [1, 9], [3, 12], [4, 9], [9, 4], [2, 18]].filter(([u, w]) => Math.sqrt(u * w) % 1 === 0)), r = Math.sqrt(m * k);
        if (form === 1) return numQ(`${Av} &gt; 0일 때, ${m === 1 ? '' : m}${Av} + ${frac(k, Av)}의 최솟값은?`, 2 * r, { signed: false, calc: `2*${r}`, unseen: [2, r], rule: 'amgm-2', explain: `산술평균과 기하평균의 관계에 의하여 ${m === 1 ? '' : m}${Av} + ${frac(k, Av)} ≥ 2${rt(`${m === 1 ? '' : m}${Av} × ${frac(k, Av)}`)} = ${2 * r}이므로 최솟값은 ${2 * r}이다.` });
        return numQ(`${Av} &gt; 0, ${Bv} &gt; 0일 때, ${frac((m === 1 ? '' : m) + Av, Bv)} + ${frac((k === 1 ? '' : k) + Bv, Av)}의 최솟값은?`, 2 * r, { signed: false, calc: `2*${r}`, unseen: [2, r], rule: 'amgm-3', explain: `두 항의 곱이 ${josa(m * k, '으로/로')} 일정하므로 산술평균과 기하평균의 관계에 의하여 최솟값은 2${rt(m * k)} = ${2 * r}이다.` });
      }
      const u = d.pick([2, 3, 4, 5]), t = d.until(() => d.int(1, u - 1), (v) => gcd(v, u) === 1);
      return F(`${Av} &gt; 0일 때, ${u * u}${Av} + ${ej(frac(t * t, Av), '이/가')} 최솟값을 가질 때의 ${Av}의 값은?`, t, u, {
        explain: `산술평균과 기하평균의 관계에서 등호는 ${u * u}${Av} = ${frac(t * t, Av)}일 때, 즉 ${sq(Av)} = ${frac(t * t, u * u)}일 때 성립한다. ${Av} &gt; 0이므로 ${Av} = ${frac(t, u)}이다.`,
        facts: { value: `${t}/${u}`, unseen: [t, u], rule: 'amgm-eq' }
      });
    }, { count: 2 }),
    T('ineq-sum', '합이 일정할 때 곱의 최댓값', '②33', (d, n) => {
      const [p, q] = d.pick([[5, 3], [3, 2], [2, 3], [4, 3], [3, 4], [5, 2], [2, 5], [4, 1], [1, 4], [3, 1]]);
      if (n === 0) {
        const k = d.int(1, 2), S = 2 * p * q * k, ans = p * q * k * k;
        return numQ(`${X} &gt; 0, ${Yv} &gt; 0이고 ${p === 1 ? '' : p}${X} + ${q === 1 ? '' : q}${Yv} = ${S}일 때, ${X}${Yv}의 최댓값은?`, ans, {
          signed: false, calc: `${S}*${S}/(4*${p}*${q})`, unseen: [4, 1], rule: 'sum-int',
          explain: `${p === 1 ? '' : p}${X} + ${q === 1 ? '' : q}${Yv} ≥ 2${rt(`${p * q}${X}${Yv}`)}이므로 ${S} ≥ 2${rt(`${p * q}${X}${Yv}`)}, 양변을 제곱하면 ${S * S} ≥ ${4 * p * q}${X}${Yv}이다. 따라서 ${X}${Yv} ≤ ${ans}이고 최댓값은 ${ans}이다.`
        });
      }
      const den = 4 * p * q;
      return F(`${Av} &gt; 0, ${Bv} &gt; 0이고 ${p === 1 ? '' : p}${Av} + ${q === 1 ? '' : q}${Bv} = 1일 때, ${Av}${Bv}의 최댓값은?`, 1, den, {
        explain: `1 = ${p === 1 ? '' : p}${Av} + ${q === 1 ? '' : q}${Bv} ≥ 2${rt(`${p * q}${Av}${Bv}`)}이므로 양변을 제곱하면 1 ≥ ${den}${Av}${Bv}, 즉 ${Av}${Bv} ≤ ${frac(1, den)}이다.`,
        facts: { value: `1/(4*${p}*${q})`, unseen: [4, 1], rule: 'sum-frac' }
      });
    }, { count: 2 }),
    T('ineq-shift', '꼴을 맞춰 산술평균·기하평균 쓰기', '②34', (d, n) => {
      // p(x − c) 꼴의 항: c = 0 이면 px, p = 1 이면 괄호 없이
      const term = (p, c) => (c === 0 ? `${p === 1 ? '' : p}${X}` : p === 1 ? linH(1, -c) : `${p}(${linH(1, -c)})`);
      if (n === 0) {
        const [p, q] = d.pick([[2, 8], [1, 4], [1, 9], [2, 2], [3, 3], [4, 1], [1, 16], [2, 18], [3, 12]]), s = Math.sqrt(p * q), c = d.int(-3, 3), ans = 2 * s + p * c;
        const shown = `${p === 1 ? '' : p}${X} + ${frac(q, linH(1, -c))}`, t1 = term(p, c), fq = frac(q, linH(1, -c));
        return numQ(`${X} &gt; ${num(c)}일 때, ${shown}의 최솟값은?`, ans, {
          calc: `2*${s}+${p}*${jn(c)}`, unseen: [2, s, 1, 0], rule: 'shift-min',
          explain: `${c === 0 ? '' : `${shown} = ${t1} + ${fq}${pc(p * c)}이고, `}${linH(1, -c)} &gt; 0이므로 산술평균과 기하평균의 관계에 의하여 ${t1} + ${fq} ≥ 2${rt(p * q)} = ${2 * s}이다. 따라서 최솟값은 ${c === 0 ? '' : `${2 * s}${pc(p * c)} = `}${num(ans)}이다.`
        });
      }
      if (n === 1) {
        const p = d.int(1, 3), t = d.int(1, 3), q = p * t * t, c = d.int(-3, 2), r = d.int(-4, 4), min = 2 * p * t + p * c + r, x0 = c + t;
        const shown = `${p === 1 ? '' : p}${X}${pc(r)} + ${frac(q, linH(1, -c))}`, t1 = term(p, c), fq = frac(q, linH(1, -c));
        return slots(`${X} &gt; ${num(c)}일 때, ${shown}의 최솟값과 그때의 ${X}의 값을 차례대로 구하시오.`, [['최솟값', min, `2*${p}*${t}+${p}*${jn(c)}+${jn(r)}`], [`${X} =`, x0, `${jn(c)}+${t}`]], {
          unseen: [2, p, t, 1, 0], rule: 'shift-two',
          explain: `${shown} = ${t1} + ${fq}${pc(p * c + r)}이다. ${linH(1, -c)} &gt; 0이므로 산술평균과 기하평균의 관계에 의하여 ${t1} + ${fq} ≥ 2${rt(p * q)} = ${2 * p * t}이고, 등호는 ${t1} = ${fq}, 즉 ${c === 0 ? `${X} = ${t}` : `${linH(1, -c)} = ${t}`}일 때 성립한다. 따라서 최솟값은 ${2 * p * t}${pc(p * c + r)} = ${num(min)}, 그때 ${X} = ${num(x0)}이다.`
        });
      }
      const m = d.int(1, 3), k = d.int(1, 4), base = m * m, aval = base + k;
      return slots(`이차방정식 ${sq(X)} − ${2 * m}${X} + ${Av} = 0이 허근을 가질 때, ${Av} − ${base} + ${frac(k * k, `${Av} − ${base}`)}의 최솟값과 그때의 ${Av}의 값을 차례대로 구하시오. (단, ${Av}는 실수이다.)`, [['최솟값', 2 * k, `2*${k}`], [`${Av} =`, aval, `${base}+${k}`]], {
        unseen: [2, k], rule: 'shift-imag',
        explain: `허근을 가지므로 판별식 D/4 = ${base} − ${Av} &lt; 0, 즉 ${Av} − ${base} &gt; 0이다. 산술평균과 기하평균의 관계에 의하여 ${Av} − ${base} + ${frac(k * k, `${Av} − ${base}`)} ≥ 2 × ${k} = ${2 * k}이고, 등호는 ${Av} − ${base} = ${k}, 즉 ${Av} = ${aval}일 때 성립한다.`
      });
    }, { count: 3 }),
    T('ineq-expand', '전개한 뒤 산술평균·기하평균 쓰기', '②35', (d, n) => {
      if (n === 0) {
        const u = d.int(1, 4), w = d.until(() => d.int(1, 4), (v) => v !== u || u > 1), m = u * u, k = w * w, ans = (u + w) ** 2;
        return numQ(`${Av} &gt; 0, ${Bv} &gt; 0일 때, (${Av} + ${Bv})(${frac(m, Av)} + ${frac(k, Bv)})의 최솟값은?`, ans, {
          signed: false, calc: `(${u}+${w})*(${u}+${w})`, unseen: [u, w], rule: 'expand-ab',
          explain: `전개하면 ${m + k} + ${frac((k === 1 ? '' : k) + Av, Bv)} + ${frac((m === 1 ? '' : m) + Bv, Av)}이고, 산술평균과 기하평균의 관계에 의하여 뒤의 두 항의 합은 2${rt(m * k)} = ${2 * u * w} 이상이다. 따라서 최솟값은 ${m + k} + ${2 * u * w} = ${ans}이다.`
        });
      }
      const [p, q] = d.pick([[1, 4], [1, 9], [4, 9], [2, 8], [1, 16], [4, 4], [2, 2], [3, 12]]), s = Math.sqrt(p * q), ans = 2 * s + p + q;
      return numQ(`${X} &gt; 0일 때, (${X} + ${frac(p, X)})(${X} + ${frac(q, X)})의 최솟값은?`, ans, {
        signed: false, calc: `2*${s}+${p}+${q}`, unseen: [2, s], rule: 'expand-x',
        explain: `전개하면 ${sq(X)} + ${frac(p * q, sq(X))} + ${p + q}이고, ${sq(X)} + ${frac(p * q, sq(X))} ≥ 2${rt(p * q)} = ${2 * s}이므로 최솟값은 ${2 * s} + ${p + q} = ${ans}이다.`
      });
    }, { count: 2 }),
    T('ineq-figure', '도형의 길이 — 곱이 일정할 때 제곱의 합의 최솟값', '②37', (d) => {
      const [s, k, r] = d.pick([[4, 4, 2], [6, 4, 2], [8, 4, 2], [6, 9, 3], [8, 16, 4], [5, 4, 2], [9, 9, 3]]), prod = 2 * s * s / k, ans = 2 * s / r;
      const G = B.kit.mgeo, b = G.Board(), side = 150, A = [0, 0], Bp = [0, side], Cp = [side, side], D = [side, 0], Pp = [0, 66], Qp = [74, 0];
      b.poly([A, Pp, Qp], 'fill:rgba(251,191,36,0.45)').poly([A, Bp, Cp, D]).seg(Pp, Qp);
      b.dot(Pp).dot(Qp).name(A, 'A', 135).name(Bp, 'B', 225).name(Cp, 'C', 315).name(D, 'D', 45).name(Pp, 'P', 180).name(Qp, 'Q', 90);
      const fig = b.svg(`정사각형 ABCD의 변 AB 위에 점 P, 변 AD 위에 점 Q가 있고, 삼각형 APQ를 색칠했다.`);
      return numQ(`다음 그림과 같이 한 변의 길이가 ${s}인 정사각형 ABCD의 변 AB 위의 점 P와 변 AD 위의 점 Q에 대하여 사각형 ABCD의 넓이가 삼각형 APQ의 넓이의 ${k}배일 때, 선분 PQ의 길이의 최솟값은?`, ans, {
        signed: false, figure: fig, calc: `2*${s}/${r}`, unseen: [2, r], rule: 'figure-pq',
        explain: `${SG('AP')} = ${X}, ${SG('AQ')} = ${Yv}라고 하면 ${s * s} = ${k} × ${frac(1, 2)}${X}${Yv}에서 ${X}${Yv} = ${prod}이다. ${SG('PQ')}${sup(2)} = ${sq(X)} + ${sq(Yv)} ≥ 2${X}${Yv} = ${2 * prod}이고 등호는 ${X} = ${Yv}일 때 성립하므로 ${SG('PQ')}의 최솟값은 ${ans}이다.`
      });
    })
  ];
  B.addTypes('10-2-5', 'cond', condTypes);
  B.addTypes('10-2-5', 'ineq', ineqTypes);
  B.addTypes('10-2-5', 'proof', proofTypes);
  B.kit.m1025b = { relQ, REL_SAY, REL_SHORT, relWhy, pairOne, pairTwo, ONE_PAIRS, proofBox, BX, sameK };
})(typeof window !== 'undefined' ? window : globalThis);
