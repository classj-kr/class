// 고등학교 1학년 2학기 공통수학2 Ⅲ-1 「함수」 — 뒤쪽 묶음(합성함수의 함숫값, 합성함수 구하기와 활용, 역함수의 값, 역함수 구하기와 그래프).
// 단원 틀과 도구, 싣는 기준, 뺀 것과 까닭은 10-2-6a.js 에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
// 합성은 (f ∘ g)(x), 역함수는 f⁻¹(위첨자 −1)로 적는다. 일차식 답은 「[±][ ]x [±][ ]」, 이차식 답은 항마다 칸으로 받고, 계수가 분수인 식은 고르기로 낸다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, lines, frac, N, M, C, F, inline } = B.kit;
  const { LAB, MINUS, GE, LE, GT, LT, range, Q, qadd, qsub, qmul, qdiv, qneg, isInt, fl, mag, tx, nb, tail, js, V, sup, tag, f1, nz, pm,
    ansV, asQ, poly, linAns, polyAns, pointAns, plain, gcd, plane } = B.kit.mid;
  const K6 = B.kit.m1026;
  const { S2, S3, sourceOf, X, Y, FN, GN, HN, A, BB, CC, K, MM, NN, X2, SX, SY, SZ, num, iq, jn, nj, sgn, cx, is, isj, iv, at, cat, setOf, jw,
    P, pv, pComp, pTrim, pshow, fdef, pjs, lin, pw, vals, counts, pickRows, oneOf, mapFig, picks, gfig, samp, ITALIC, INK, BLUE } = K6;
  const retry = (make) => (d, n) => { for (let i = 0; i < 400; i += 1) { const v = make(d, n); if (v) return v; } throw new Error('문항을 만들지 못했다'); };
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: sourceOf(ref), make: retry(make) }, more || {});

  // ── 글과 셈 ──
  const tm = (k, v) => poly([[k, v || '']]);                           // 부호를 붙인 항 하나: 3x, −x, −2
  const cf = (k) => { const q = asQ(k); return q.p === q.q ? '' : q.p === -q.q ? MINUS : tx(q); };   // 괄호 앞의 계수: 3(…), −(…), (…)
  const pAt = (p, v) => poly(pTrim(p).map((c, i) => [c, i === 0 ? '' : i === 1 ? v : v + sup(i)]).reverse());   // 문자 v 로 적은 다항식
  const pe = (p, x) => pjs(p, '(' + (typeof x === 'string' ? x : jn(x)) + ')');   // 검사 식: p(x)
  const val = (p, x) => pv(p, x);
  const vi = (p, x) => fl(pv(p, x));                                   // 값(수)
  const isI = (p, x) => isInt(pv(p, x));
  // 일차함수 ax + b 의 역함수 (1/a)x − b/a
  const invL = (p) => P(qdiv(qneg(p[0]), p[1]), qdiv(Q(1), p[1]));
  const nzC = (p) => pTrim(p).every((c) => c.p !== 0);                 // 0인 계수가 없는가
  const coefsInt = (p) => p.every(isInt);
  // 합성의 글: (g ∘ f)(x)
  const cx2 = (fs) => cat(fs, X);
  // 검사 식 안의 절댓값: 값의 부호에 따라 미리 푼다
  const absjs = (expr, v) => (v >= 0 ? `(${expr})` : `(0-(${expr}))`);
  // 일차식 답(계수가 정수, 0이 아님)
  const linOK = (p) => coefsInt(p) && p[1].p !== 0 && p[0].p !== 0;
  const linA = (text, p, o) => linAns(text, fl(p[1]), fl(p[0]), X, o);
  const polyA = (text, p, o) => polyAns(text, [[fl(p[2]), X2], [fl(p[1]), X], [fl(p[0]), '']], o);
  // 소수의 개수
  const isPrime = (n) => n >= 2 && range(2, Math.floor(Math.sqrt(n))).every((k) => n % k !== 0);
  const primesTo = (n) => range(2, n).filter(isPrime);

  // ── 계단 그림: 곡선 y = f(x)와 직선 y = x, x축 위의 a~e ──
  // dir 'up': f(a) = b, f(b) = c, f(c) = d, f(d) = e(곡선이 y = x 위에 있다). dir 'down': f(e) = d, f(d) = c, f(c) = b, f(b) = a(곡선이 y = x 아래에 있다).
  const STEP = [0.4]; for (let i = 0; i < 4; i += 1) STEP.push(7 - 6.2 * Math.exp(-0.3 * STEP[i]));
  const fUp = (x) => 7 - 6.2 * Math.exp(-0.3 * x), fDown = (y) => -Math.log((7 - y) / 6.2) / 0.3;
  const LET = ['a', 'b', 'c', 'd', 'e'];
  function stairFig(dir) {
    const p = STEP, dashes = [];
    if (dir === 'up') {
      for (let i = 0; i < 4; i += 1) dashes.push([p[i], 0, p[i], p[i + 1]], [p[i], p[i + 1], p[i + 1], p[i + 1]]);
      dashes.push([p[4], 0, p[4], p[4]]);
    } else {
      for (let i = 4; i > 0; i -= 1) dashes.push([p[i], 0, p[i], p[i - 1]], [p[i], p[i - 1], p[i - 1], p[i - 1]]);
      dashes.push([p[0], 0, p[0], p[0]]);
    }
    const curve = dir === 'up' ? samp(fUp, 0, 7) : samp(fDown, 0.02, 6.9);
    const chain = dir === 'up' ? 'f(a)는 b, f(b)는 c, f(c)는 d, f(d)는 e와 같은 높이' : 'f(e)는 d, f(d)는 c, f(c)는 b, f(b)는 a와 같은 높이';
    return gfig({
      x: [0, 7.4], y: [0, 7.4], curves: [{ pts: [[0, 0], [7.4, 7.4]], color: '#5b6770', width: 1.3 }, { pts: curve }], dashes,
      labels: p.map((v, i) => ({ x: v, y: 0, dy: 14, t: LET[i], italic: true })).concat([{ x: 7.2, y: 7.2, dx: -4, dy: -6, t: 'y = x', anchor: 'end', size: 12.5, italic: true }, { x: dir === 'up' ? 2.1 : 5.6, y: dir === 'up' ? fUp(2.1) : fDown(5.6), dx: dir === 'up' ? -6 : 6, dy: dir === 'up' ? -6 : 14, t: 'y = f(x)', anchor: dir === 'up' ? 'end' : 'start', size: 12.5, italic: true, fill: BLUE }]),
      say: `곡선 y = f(x)와 직선 y = x. x축 위에 a, b, c, d, e가 왼쪽부터 차례로 있다. x축 위의 점에서 세로로 그은 점선이 곡선과 만나고, 거기서 가로로 그은 점선이 직선 y = x와 만나는 점 아래가 다음 문자이다: ${chain}이다.`
    });
  }

  // ── 모눈 위의 직선 둘(−5~5, 눈금 수 12px): [[일차식, 이름, 색], …] ──
  // 공용 plane 은 눈금 수가 10.5px 라 휴대폰에서 작아 이 단원에서는 gfig 로 그린다. 이름은 직선의 오른쪽 끝(상자를 나가는 곳) 옆에 적고,
  // 앞 직선의 이름과 가까우면(두 직선이 상자의 같은 곳으로 나가면) 왼쪽 끝에 적는다.
  function twoLines(list) {
    const said = ['좌표평면: x축은 −5부터 5까지, y축은 −5부터 5까지이고 모눈 한 칸은 1이다.'], curves = [], labels = [];
    for (const [p, name, color] of list) {
      const a = fl(p[1]), b = fl(p[0]), s = (-5 - b) / a, t = (5 - b) / a, lo = Math.max(-5, Math.min(s, t)), hi = Math.min(5, Math.max(s, t));
      curves.push({ pts: [[lo, a * lo + b], [hi, a * hi + b]], color });
      const right = { x: hi, y: a * hi + b, dx: a < 0 ? 4 : -4, dy: a < 0 ? 13 : -5, anchor: a < 0 ? 'start' : 'end' };
      const left = { x: lo, y: a * lo + b, dx: a < 0 ? -4 : 4, dy: a < 0 ? -5 : 13, anchor: a < 0 ? 'end' : 'start' };
      const crowded = labels.some((l) => Math.hypot(l.x - right.x, l.y - right.y) < 1.2);
      labels.push(Object.assign(crowded ? left : right, { t: name, size: 13, italic: true, fill: color }));
      const q = asQ(p[1]);
      said.push(`직선 ${name}: y축 위의 ${plain(asQ(p[0]))}인 점을 지나고, 오른쪽으로 ${q.q}칸 갈 때 ${q.p < 0 ? '아래쪽' : '위쪽'}으로 ${Math.abs(q.p)}칸 간다.`);
    }
    const ticks = range(-5, 5).filter((v) => v !== 0);
    // O 는 원점의 왼쪽 아래와 오른쪽 아래 가운데 직선에서 더 먼 쪽에 적는다.
    const clear = (sx) => Math.min(...list.map(([p]) => { const a = fl(p[1]), b = fl(p[0]); return Math.abs(a * sx * 0.3 + b + 0.4) / Math.hypot(a, 1); }));
    return gfig({ x: [-5, 5], y: [-5, 5], grid: true, oRight: clear(1) > clear(-1), curves, labels, xnums: ticks.map((v) => ({ v })), ynums: ticks.map((v) => ({ v })), say: said.join(' ') });
  }

  // ── 합성함수의 함숫값 ──
  B.addGroup('10-2-6', {
    id: 'comp', title: '합성함수의 함숫값', standard: S2,
    types: [
      T('comp-two-maps', '두 대응 그림으로 합성 함숫값', '①34', (d) => {
        const xs = [1, 2, 3], ys = d.shuffle(range(2, 9)).slice(0, 4).sort((u, v) => u - v), zs = d.shuffle(range(1, 9)).slice(0, 3).sort((u, v) => u - v);
        const fA = xs.map((_, i) => [i, d.int(0, 3)]), gA = ys.map((_, j) => [j, d.int(0, 2)]);
        const [p, q] = d.shuffle(xs).slice(0, 2), fv = (x) => ys[fA[x - 1][1]], gv = (y) => zs[gA[ys.indexOf(y)][1]];
        if (fv(p) === fv(q) || (gv(fv(p)) === gv(fv(q)) && d.bool())) return null;   // 두 값은 Y 의 다른 원소를 거쳐 가게
        return M(`두 함수 ${nb(`${FN} : ${SX} → ${SY}`)}, ${nb(`${GN} : ${SY} → ${SZ}`)}가 그림과 같을 때, ${cat([GN, FN], p)}, ${cat([GN, FN], q)}의 값은?`, [{ lead: cat([GN, FN], p) + ' =', answer: gv(fv(p)) }, { lead: cat([GN, FN], q) + ' =', answer: gv(fv(q)) }], {
          figure: mapFig({ sets: [{ name: 'X', items: xs.map(String) }, { name: 'Y', items: ys.map(String) }, { name: 'Z', items: zs.map(String) }], maps: [fA, gA], names: ['f', 'g'] }),
          shown: `${is(cat([GN, FN], p), gv(fv(p)))}, ${is(cat([GN, FN], q), gv(fv(q)))}`,
          explain: `${is(cat([GN, FN], p), at(GN, at(FN, p)))} = ${at(GN, fv(p))} = ${gv(fv(p))}, ${is(cat([GN, FN], q), at(GN, at(FN, q)))} = ${at(GN, fv(q))} = ${gv(fv(q))}이다. ${FN}의 화살표를 먼저 따라간 뒤 ${GN}의 화살표를 따라간다.`,
          facts: { calc: [[String(gv(fv(p))), 0], [String(gv(fv(q))), 1]] }
        });
      }),
      T('comp-iterate-map', '한 대응 그림으로 거듭 합성', '①35', (d) => {
        const xs = [1, 2, 3, 4], f = xs.map(() => d.int(1, 4)), a = d.pick(xs), f1_ = f[a - 1], f2 = f[f1_ - 1], f3 = f[f2 - 1];
        if (f1_ === a || new Set([f1_, f2, f3]).size < 3) return null;
        return M(`그림과 같은 함수 ${nb(`${FN} : ${SX} → ${SX}`)}에 대하여 ${at(FN, a)}, ${cat([FN, FN], a)}, ${cat([FN, FN, FN], a)}의 값은?`, [{ lead: at(FN, a) + ' =', answer: f1_ }, { lead: cat([FN, FN], a) + ' =', answer: f2 }, { lead: cat([FN, FN, FN], a) + ' =', answer: f3 }], {
          figure: mapFig({ sets: [{ name: 'X', items: xs.map(String) }, { name: 'X', items: xs.map(String) }], maps: [xs.map((x) => [x - 1, f[x - 1] - 1])], names: ['f'] }),
          shown: `${f1_}, ${f2}, ${f3}`,
          explain: `${is(at(FN, a), f1_)}, ${is(cat([FN, FN], a), at(FN, f1_))} = ${f2}, ${is(cat([FN, FN, FN], a), at(FN, f2))} = ${f3}이다. 앞에서 나온 함숫값을 다시 ${FN}에 넣는다.`,
          facts: { calc: [[String(f1_), 0], [String(f2), 1], [String(f3), 2]] }
        });
      }),
      T('comp-prime-count', '규칙으로 정한 함수의 거듭 함숫값', '①33', (d) => {
        const n0 = d.int(12, 60), p1 = primesTo(n0).length, p2 = primesTo(p1).length;
        return N(`자연수 전체의 집합에서 정의된 함수 ${FN}가 ${nb(`${FN}(${NN}) = (${NN}보다 작거나 같은 소수의 개수)`)}일 때, ${cat([FN, FN], n0)}의 값은?`, p2, {
          explain: `${n0} 이하의 소수는 ${primesTo(n0).join(', ')}의 ${p1}개이므로 ${is(at(FN, n0), p1)}이다. ${p1} 이하의 소수는 ${primesTo(p1).join(', ')}의 ${p2}개이므로 ${is(cat([FN, FN], n0), at(FN, p1))} = ${p2}이다.`,
          facts: { value: String(p2), unseen: [p2] }
        });
      }),
      T('comp-poly-value', '식으로 준 두 함수의 합성 함숫값', '①36', (d, n) => {
        if (n === 0) {
          const f = P(nz(d, -5, 5), nz(d, -3, 3)), g = P(d.int(-6, 6), d.int(-4, 4), d.pick([1, 1, -1, 2])), [s, t] = [d.int(-3, 3), d.int(-3, 3)];
          const v1 = vi(g, vi(f, s)), v2 = vi(f, vi(g, t));
          if (Math.abs(v1) > 300 || Math.abs(v2) > 300) return null;
          return M(`두 함수 ${fdef(FN, f)}, ${fdef(GN, g)}에 대하여 ${cat([GN, FN], s)}, ${cat([FN, GN], t)}의 값은?`, [{ lead: cat([GN, FN], s) + ' =', answer: v1, signed: true }, { lead: cat([FN, GN], t) + ' =', answer: v2, signed: true }], {
            shown: `${is(cat([GN, FN], s), v1)}, ${is(cat([FN, GN], t), v2)}`,
            explain: `${is(cat([GN, FN], s), at(GN, at(FN, s)))} = ${at(GN, vi(f, s))} = ${iq(v1)}, ${is(cat([FN, GN], t), at(FN, at(GN, t)))} = ${at(FN, vi(g, t))} = ${iq(v2)}이다.`,
            facts: { calc: [[pe(g, pe(f, s)), 0], [pe(f, pe(g, t)), 1]], unseen: [1] }
          });
        }
        // f(x) = |ax + b|, g 는 이차함수: (f∘f)(s), (g∘g)(t)
        const a = pm(d) * d.int(1, 3), b = nz(d, -6, 6), g = P(d.int(-4, 4), d.int(-3, 3), 1), [s, t] = [d.int(-2, 4), d.int(-2, 3)];
        const fv = (x) => Math.abs(a * x + b), inner = fv(s), v1 = fv(inner), gi = vi(g, t), v2 = vi(g, gi);
        if (Math.abs(v2) > 400 || v1 === 0) return null;
        const fx = nb(`${FN}(${X}) = |${pshow(P(b, a))}|`);
        const fj = (x, xv) => absjs(pjs(P(b, a), '(' + x + ')'), a * xv + b);
        return M(`두 함수 ${fx}, ${fdef(GN, g)}에 대하여 ${cat([FN, FN], s)}, ${cat([GN, GN], t)}의 값은?`, [{ lead: cat([FN, FN], s) + ' =', answer: v1 }, { lead: cat([GN, GN], t) + ' =', answer: v2, signed: true }], {
          shown: `${is(cat([FN, FN], s), v1)}, ${is(cat([GN, GN], t), v2)}`,
          explain: `${is(at(FN, s), inner)}이므로 ${is(cat([FN, FN], s), at(FN, inner))} = ${v1}이다. ${is(at(GN, t), gi)}이므로 ${is(cat([GN, GN], t), at(GN, gi))} = ${iq(v2)}이다.`,
          facts: { calc: [[fj(fj(jn(s), s), inner), 0], [pe(g, pe(g, t)), 1]], unseen: [0, 1] }
        });
      }, { count: 2 }),
      T('comp-piece-value', '조각 함수가 낀 합성 함숫값', '①37', (d) => {
        const t = d.pick([0, 1, 2]), a1 = nz(d, -4, 4), b1 = nz(d, -9, 9), cst = d.bool(), a2 = cst ? 0 : nz(d, -3, 3), b2 = nz(d, -6, 6);
        const fp = (x) => (x >= t ? P(b1, a1) : P(b2, a2)), f = (x) => vi(fp(x), x), g = P(d.int(-6, 4), d.int(-2, 2), 1);
        const s = d.int(-3, 3), u = d.int(-3, 3), gs = vi(g, s), fu = f(u);
        // (f∘g)(s): g(s)가 들어갈 조각, (g∘f)(u): u 가 들어갈 조각 — 두 조각이 모두 쓰이게
        if ((gs >= t) === (u >= t)) return null;
        const v1 = f(gs), v2 = vi(g, fu);
        if (Math.abs(v1) > 200 || Math.abs(v2) > 200) return null;
        const rows = [[pshow(P(b1, a1)), `${X} ${GE} ${t}`], [cst ? iq(b2) : pshow(P(b2, a2)), `${X} ${LT} ${t}`]];
        return M(`두 함수 ${FN}(${X}) = ${pw(rows)}, ${fdef(GN, g)}에 대하여 ${cat([FN, GN], s)}, ${cat([GN, FN], u)}의 값은?`, [{ lead: cat([FN, GN], s) + ' =', answer: v1, signed: true }, { lead: cat([GN, FN], u) + ' =', answer: v2, signed: true }], {
          shown: `${is(cat([FN, GN], s), v1)}, ${is(cat([GN, FN], u), v2)}`,
          explain: `${is(at(GN, s), gs)}이고 ${nb(`${iq(gs)} ${gs >= t ? GE : LT} ${t}`)}이므로 ${is(cat([FN, GN], s), at(FN, gs))} = ${iq(v1)}이다. ${nb(`${iq(u)} ${u >= t ? GE : LT} ${t}`)}이므로 ${is(at(FN, u), fu)}이고 ${is(cat([GN, FN], u), at(GN, fu))} = ${iq(v2)}이다.`,
          facts: { calc: [[pe(fp(gs), pe(g, s)), 0], [pe(g, pe(fp(u), u)), 1]], unseen: [0, 1] }
        });
      }),
      T('comp-assoc-value', '세 함수의 합성 함숫값(결합법칙)', '①38', (d, n) => {
        if (n === 0) {
          const fg = P(d.int(-6, 6), nz(d, -4, 4), 1), h = P(nz(d, -6, 6), nz(d, -3, 3)), k = d.until(() => d.int(-4, 4), (v) => Math.abs(vi(h, v)) <= 6);
          const hk = vi(h, k), v = vi(fg, hk);
          return N(`세 함수 ${FN}, ${GN}, ${HN}에 대하여 ${is(cx2([FN, GN]), pshow(fg))}, ${fdef(HN, h)}일 때, ${nb(`(${FN} ∘ (${GN} ∘ ${HN}))(${iq(k)})`)}의 값은?`, v, { signed: true,
            explain: `합성에서는 결합법칙이 성립하므로 ${nb(`(${FN} ∘ (${GN} ∘ ${HN}))(${iq(k)}) = ((${FN} ∘ ${GN}) ∘ ${HN})(${iq(k)})`)} = ${cat([FN, GN], at(HN, k))}이다. ${is(at(HN, k), hk)}이므로 ${is(cat([FN, GN], hk), v)}이다.`,
            facts: { value: pe(fg, pe(h, k)), unseen: [1], rule: 'assoc-fg' }
          });
        }
        const f = P(nz(d, -6, 6), nz(d, -4, 4)), gh = P(nz(d, -6, 6), nz(d, -3, 3)), k = d.int(-4, 5), ghk = vi(gh, k), v = vi(f, ghk);
        return N(`세 함수 ${FN}, ${GN}, ${HN}에 대하여 ${fdef(FN, f)}, ${is(cx2([GN, HN]), pshow(gh))}일 때, ${nb(`((${FN} ∘ ${GN}) ∘ ${HN})(${iq(k)})`)}의 값은?`, v, { signed: true,
          explain: `결합법칙에 의하여 ${nb(`((${FN} ∘ ${GN}) ∘ ${HN})(${iq(k)}) = (${FN} ∘ (${GN} ∘ ${HN}))(${iq(k)})`)} = ${at(FN, cat([GN, HN], k))}이다. ${is(cat([GN, HN], k), ghk)}이므로 ${is(at(FN, ghk), v)}이다.`,
          facts: { value: pe(f, pe(gh, k)), unseen: [1], rule: 'assoc-gh' }
        });
      }, { count: 2 }),
      T('comp-find-coef', '합성 함숫값이 주어질 때 계수', '①39', (d) => {
        const half = d.bool(), f = half ? P(nz(d, -5, 5), Q(1, 2)) : P(nz(d, -6, 6), nz(d, -3, 3)), p = d.until(() => nz(d, -6, 6), (v) => isI(f, v) && vi(f, v) !== 0);
        const m = vi(f, p), a = nz(d, -5, 5), c = nz(d, -6, 6), r = a * m + c;
        return N(`두 함수 ${fdef(FN, f)}, ${nb(`${GN}(${X}) = ${A}${X} ${sgn(c)}`)}에 대하여 ${is(cat([GN, FN], p), r)}일 때, 상수 ${jw(A, '의')} 값은?`, a, { signed: true,
          explain: `${is(at(FN, p), m)}이므로 ${is(cat([GN, FN], p), at(GN, m))} = ${nb(`${tm(m, A)} ${sgn(c)}`)}이다. ${nb(`${tm(m, A)} ${sgn(c)} = ${iq(r)}`)}에서 ${is(A, a)}이다.`,
          facts: { value: `(${jn(r)}-${jn(c)})/(${pe(f, p)})`, unseen: [1] }
        });
      }),
      T('comp-equal-at', '(g ∘ f)(a) = (f ∘ g)(a)를 만족시키는 a', '①40', (d) => {
        const al = d.pick([1, 2, 3, -1, -2]), be = d.pick([2, 3, -1, -2, 4]), ga = d.until(() => nz(d, -6, 6), (v) => (2 * v) % (be - 1) === 0);
        // α(β² − β)a² + 2αβγ a + αγ² − γ = 0
        const A2 = al * (be * be - be), A1 = 2 * al * be * ga, A0 = al * ga * ga - ga;
        if (A1 * A1 - 4 * A2 * A0 <= 0) return null;
        const sum = -2 * ga / (be - 1);
        return N(`두 함수 ${fdef(FN, P(0, 0, al))}, ${fdef(GN, P(ga, be))}에 대하여 ${is(cat([GN, FN], A), cat([FN, GN], A))}를 만족시키는 모든 실수 ${jw(A, '의')} 값의 합은?`, sum, { signed: true,
          explain: `${is(cat([GN, FN], A), pAt(P(ga, 0, al * be), V('a')))}, ${is(cat([FN, GN], A), nb(`${cf(al)}(${tm(be, A)} ${sgn(ga)})${sup(2)}`))}이므로 정리하면 ${nb(`${poly([[A2, A + sup(2)], [A1, A], [A0, '']])} = 0`)}이다. 이 이차방정식은 서로 다른 두 실근을 가지므로 근과 계수의 관계에서 두 근의 합은 ${iq(Q(-A1, A2))}이다.`,
          facts: { value: `${-A1}/${A2}`.replace(/^(-?\d+)\/(-?\d+)$/, (m0, u, v) => `(${u})/(${v})`), unseen: [Math.abs(A1), Math.abs(A2)] }
        });
      }),
      T('comp-graph-fixed', '그래프로 준 함수의 합성 (f ∘ f)(a) = a', '①41', (d) => {
        const c = d.until(() => { const L = d.pick([2, 3, 4]), t = d.int(1, L - 1), e = d.int(0, L - 1); return { L, t, e }; }, (v) => {
          const a = Q(v.t * (v.L * (v.L - v.t) + (v.L - v.e) * v.t), v.t * (v.L - v.t) + (v.L - v.e) * v.L); v.a = a;
          return fl(a) >= v.t * v.t / v.L - 1e-9 && fl(a) <= v.t + 1e-9 && v.e !== v.L;
        });
        const lo = Q(c.t * c.t, c.L), rows = [[c.a, true]];
        for (const w of [Q(c.t), lo, Q(c.L, 2), qdiv(qadd(lo, Q(c.t)), Q(2)), Q(c.t + 1, 2), Q(c.L - 1)]) if (rows.length < 5 && !rows.some((r) => r[0].p * w.q === w.p * r[0].q)) rows.push([w, false]);
        if (rows.length < 4) return null;
        const list = d.shuffle(rows);
        return C(`집합 ${is(SX, nb(`{${X} | 0 ${LE} ${X} ${LE} ${c.L}}`))}에 대하여 ${SX}에서 ${SX}로의 함수 ${nb(`${Y} = ${FN}(${X})`)}의 그래프가 그림과 같다. ${nb(`${tx(lo)} ${LE} ${A} ${LE} ${c.t}`)}일 때, ${is(cat([FN, FN], A), A)}를 만족시키는 ${jw(A, '의')} 값은?`, list.map((r) => tx(r[0])), list.findIndex((r) => r[1]), {
          figure: gfig({ x: [0, c.L], y: [0, c.L], u: Math.min(52, 190 / c.L), grid: true, curves: [{ pts: [[0, 0], [c.t, c.L], [c.L, c.e]] }], dots: [{ x: c.t, y: c.L }, { x: c.L, y: c.e }], dashes: [[c.t, 0, c.t, c.L], [0, c.L, c.t, c.L]].concat(c.e > 0 ? [[0, c.e, c.L, c.e]] : []),
            xnums: range(1, c.L).map((v) => ({ v })), ynums: range(1, c.L).map((v) => ({ v })), say: `그래프는 원점과 점 (${c.t}, ${c.L})${josa(c.L, '을/를').slice(String(c.L).length)} 잇는 선분과, 점 (${c.t}, ${c.L})${josa(c.L, '과/와').slice(String(c.L).length)} 점 (${c.L}, ${c.e})${josa(c.e, '을/를').slice(String(c.e).length)} 잇는 선분으로 이루어져 있다.` }),
          explain: `그래프에서 ${nb(`0 ${LE} ${X} ${LE} ${c.t}`)}일 때 ${is(at(FN, X), pshow(P(0, Q(c.L, c.t))))}, ${nb(`${c.t} ${LE} ${X} ${LE} ${c.L}`)}일 때 ${is(at(FN, X), pshow(P(qadd(Q(c.L), qmul(Q(c.L - c.e, c.L - c.t), Q(c.t))), Q(c.e - c.L, c.L - c.t))))}이다. ${nb(`${tx(lo)} ${LE} ${A} ${LE} ${c.t}`)}이면 ${is(at(FN, A), pshow(P(0, Q(c.L, c.t))).replace('<i class="mb-var">x</i>', A))}의 값은 ${c.t} 이상 ${c.L} 이하이므로 ${cat([FN, FN], A)}는 둘째 식으로 구한다. ${is(cat([FN, FN], A), A)}를 풀면 ${is(A, tx(c.a))}이다.`,
          facts: { truth: list.map((r) => r[1]), want: true }
        });
      }),
      T('comp-iterate-cycle', '거듭 합성의 되풀이', '①42', (d) => {
        const TEMPLATES = [
          { n: 4, rows: [[pshow(P(2, 1)), nb(`1 ${LE} ${X} ${LE} 2`)], [pshow(P(5, -1)), nb(`3 ${LE} ${X} ${LE} 4`)]], f: (x) => (x <= 2 ? x + 2 : 5 - x) },
          { n: 4, rows: [[pshow(P(1, 1)), nb(`1 ${LE} ${X} ${LE} 3`)], [pshow(P(-3, 1)), nb(`${X} = 4`)]], f: (x) => (x <= 3 ? x + 1 : x - 3) },
          { n: 5, rows: [[pshow(P(2, 1)), nb(`1 ${LE} ${X} ${LE} 3`)], [pshow(P(-3, 1)), nb(`4 ${LE} ${X} ${LE} 5`)]], f: (x) => (x <= 3 ? x + 2 : x - 3) },
          { n: 4, rows: [[pshow(P(3, 1)), nb(`${X} = 1`)], [pshow(P(-1, 1)), nb(`2 ${LE} ${X} ${LE} 4`)]], f: (x) => (x === 1 ? 4 : x - 1) },
          { n: 5, rows: [[pshow(P(3, 1)), nb(`1 ${LE} ${X} ${LE} 2`)], [pshow(P(-2, 1)), nb(`3 ${LE} ${X} ${LE} 5`)]], f: (x) => (x <= 2 ? x + 3 : x - 2) }
        ];
        const tp = d.pick(TEMPLATES), xs = range(1, tp.n), a = d.pick(xs), big = d.int(100, 2100);
        const orbit = [a]; while (orbit.length < 12 && tp.f(orbit[orbit.length - 1]) !== a) orbit.push(tp.f(orbit[orbit.length - 1]));
        const L = orbit.length, ans = orbit[big % L];
        if (L < 3) return null;
        return N(`집합 ${is(SX, setOf(xs))}에 대하여 함수 ${nb(`${FN} : ${SX} → ${SX}`)}가 ${FN}(${X}) = ${pw(tp.rows)}이다. ${is(FN + sup(1), FN)}, ${is(FN + sup(NN + ' + 1'), nb(`${FN} ∘ ${FN}${sup(NN)}`))}(${NN}은 자연수)으로 정의할 때, ${FN}${sup(big)}(${a})의 값은?`, ans, {
          explain: `${orbit.concat([a]).map((v, i) => (i ? `${FN}${sup(i)}(${a}) = ${v}` : '')).filter(Boolean).slice(0, L).join(', ')}이므로 ${FN}${sup(NN)}(${a})의 값은 ${jw(orbit.slice(1).concat([a]).join(', '), '이/가')} 이 차례로 되풀이된다(${L}개씩). ${nb(`${big} = ${L} × ${Math.floor(big / L)} + ${big % L}`)}이므로 ${FN}${sup(big)}(${a}) = ${big % L ? `${FN}${sup(big % L)}(${a})` : `${FN}${sup(L)}(${a})`} = ${ans}이다.`,
          facts: { value: String(ans), unseen: [ans] }
        });
      })
    ]
  });

  // ── 합성함수 구하기와 활용 ──
  B.addGroup('10-2-6', {
    id: 'compx', title: '합성함수 구하기와 활용', standard: S2,
    types: [
      T('compx-linear', '일차함수끼리의 합성 식', '②1', (d) => {
        const a = nz(d, -5, 5), b = nz(d, -7, 7), c = nz(d, -5, 5), e = nz(d, -7, 7), f = P(b, a), g = P(e, c), gf = pComp(g, f), fg = pComp(f, g);
        if (!linOK(gf) || !linOK(fg) || fl(gf[0]) === fl(fg[0]) || Math.abs(a) === 1 && Math.abs(c) === 1) return null;
        return inline(`두 함수 ${fdef(FN, f)}, ${fdef(GN, g)}에 대하여 ${cx2([GN, FN])}, ${jw(cx2([FN, GN]), '을/를')} 구하시오.`, `${cx2([GN, FN])} = {0}${X} {1}<br>${cx2([FN, GN])} = {2}${X} {3}`,
          [{ answer: fl(gf[1]), signed: true }, { answer: fl(gf[0]), signed: true }, { answer: fl(fg[1]), signed: true }, { answer: fl(fg[0]), signed: true }], {
            shown: `${is(cx2([GN, FN]), pshow(gf))}, ${is(cx2([FN, GN]), pshow(fg))}`,
            explain: `${is(cx2([GN, FN]), at(GN, at(FN, X)))} = ${at(GN, pshow(f))} = ${pshow(gf)}, ${is(cx2([FN, GN]), at(FN, at(GN, X)))} = ${at(FN, pshow(g))} = ${pshow(fg)}이다. 두 합성함수는 서로 같지 않다.`,
            facts: { calc: [[`${jn(c)}*${jn(a)}`, 0], [`${jn(c)}*${jn(b)}+${jn(e)}`, 1], [`${jn(a)}*${jn(c)}`, 2], [`${jn(a)}*${jn(e)}+${jn(b)}`, 3]], unseen: [1] }
          });
      }),
      T('compx-quad', '이차함수가 낀 합성 식', '②2', (d, n) => {
        const f = P(nz(d, -5, 5), nz(d, -3, 3)), g = P(nz(d, -6, 6), nz(d, -4, 4), d.pick([1, 1, -1, 2]));
        const r = n === 0 ? pComp(g, f) : pComp(f, g), name = n === 0 ? [GN, FN] : [FN, GN];
        if (!nzC(r) || pTrim(r).length !== 3 || r.some((c0) => Math.abs(fl(c0)) > 99)) return null;
        return polyA(`두 함수 ${fdef(FN, f)}, ${fdef(GN, g)}에 대하여 ${jw(cx2(name), '을/를')} 구하시오.`, r, {
          explain: n === 0 ? `${is(cx2(name), at(GN, at(FN, X)))} = ${at(GN, pshow(f))} = ${pshow(r)}이다.` : `${is(cx2(name), at(FN, at(GN, X)))} = ${at(FN, pshow(g))} = ${pshow(r)}이다.`,
          facts: n === 0
            ? { calc: [[`${jn(g[2])}*${jn(f[1])}*${jn(f[1])}`, 0], [`2*${jn(g[2])}*${jn(f[1])}*${jn(f[0])}+${jn(g[1])}*${jn(f[1])}`, 1], [`${jn(g[2])}*${jn(f[0])}*${jn(f[0])}+${jn(g[1])}*${jn(f[0])}+${jn(g[0])}`, 2]], unseen: [1, 2], rule: 'quad-gf' }
            : { calc: [[`${jn(f[1])}*${jn(g[2])}`, 0], [`${jn(f[1])}*${jn(g[1])}`, 1], [`${jn(f[1])}*${jn(g[0])}+${jn(f[0])}`, 2]], unseen: [1], rule: 'quad-fg' }
        });
      }, { count: 2 }),
      T('compx-three', '세 함수의 합성 식(결합법칙)', '②3', (d) => {
        const h = P(nz(d, -4, 4), nz(d, -3, 3)), g = P(d.int(-4, 4), 0, 1), f = P(nz(d, -6, 6), nz(d, -3, 3)), r = pComp(f, pComp(g, h));
        if (!nzC(r) || pTrim(r).length !== 3 || r.some((c0) => Math.abs(fl(c0)) > 99)) return null;
        const outer = d.bool();
        const name = outer ? nb(`(${FN} ∘ (${GN} ∘ ${HN}))(${X})`) : nb(`((${FN} ∘ ${GN}) ∘ ${HN})(${X})`);
        return polyA(`세 함수 ${fdef(FN, f)}, ${fdef(GN, g)}, ${fdef(HN, h)}에 대하여 ${jw(name, '을/를')} 구하시오.`, r, {
          explain: `${is(cx2([GN, HN]), at(GN, pshow(h)))} = ${pshow(pComp(g, h))}이므로 ${name} = ${at(FN, pshow(pComp(g, h)))} = ${pshow(r)}이다. 결합법칙이 성립하므로 묶는 차례를 바꾸어도 같다.`,
          facts: { calc: [[`${jn(f[1])}*${jn(h[1])}*${jn(h[1])}`, 0], [`2*${jn(f[1])}*${jn(h[1])}*${jn(h[0])}`, 1], [`${jn(f[1])}*(${jn(h[0])}*${jn(h[0])}+${jn(g[0])})+${jn(f[0])}`, 2]], unseen: [1, 2, 0] }
        });
      }),
      T('compx-block', '(g ∘ f)(x)를 덩어리로 써서 ((h ∘ g) ∘ f)(x)', '②4', (d) => {
        const gf = P(nz(d, -5, 5), nz(d, -4, 4)), h = P(d.int(-5, 5), nz(d, -5, 5), d.pick([1, 1, -1])), r = pComp(h, gf);
        if (!nzC(r) || pTrim(r).length !== 3 || r.some((c0) => Math.abs(fl(c0)) > 99)) return null;
        return polyA(`세 함수 ${FN}, ${GN}, ${HN}에 대하여 ${is(cx2([GN, FN]), pshow(gf))}, ${fdef(HN, h)}일 때, ${jw(nb(`((${HN} ∘ ${GN}) ∘ ${FN})(${X})`), '을/를')} 구하시오.`, r, {
          explain: `결합법칙에 의하여 ${is(nb(`((${HN} ∘ ${GN}) ∘ ${FN})(${X})`), nb(`(${HN} ∘ (${GN} ∘ ${FN}))(${X})`))} = ${at(HN, cx2([GN, FN]))} = ${at(HN, pshow(gf))} = ${pshow(r)}이다. ${FN}, ${GN}를 따로 몰라도 된다.`,
          facts: { calc: [[`${jn(h[2])}*${jn(gf[1])}*${jn(gf[1])}`, 0], [`2*${jn(h[2])}*${jn(gf[1])}*${jn(gf[0])}+${jn(h[1])}*${jn(gf[1])}`, 1], [`${jn(h[2])}*${jn(gf[0])}*${jn(gf[0])}+${jn(h[1])}*${jn(gf[0])}+${jn(h[0])}`, 2]], unseen: [1, 2, 0] }
        });
      }),
      T('compx-commute', 'f ∘ g = g ∘ f가 되는 상수', '②5', (d, n) => {
        if (n === 0) {
          // f = ax + k, g = cx + e → k = e(1 − a)/(1 − c)
          const a = d.until(() => nz(d, -4, 4), (v) => v !== 1), c = d.until(() => nz(d, -4, 4), (v) => v !== 1 && v !== a), e = nz(d, -6, 6);
          if ((e * (1 - a)) % (1 - c) !== 0) return null;
          const k = e * (1 - a) / (1 - c);
          if (k === 0) return null;
          return N(`두 함수 ${nb(`${FN}(${X}) = ${tm(a, X)} + ${K}`)}, ${fdef(GN, P(e, c))}에 대하여 ${nb(`${FN} ∘ ${GN} = ${GN} ∘ ${FN}`)}가 성립하도록 하는 상수 ${jw(K, '의')} 값은?`, k, { signed: true,
            explain: `${is(cx2([FN, GN]), nb(`${cf(a)}(${pshow(P(e, c))}) + ${K}`))}, ${is(cx2([GN, FN]), nb(`${cf(c)}(${tm(a, X)} + ${K}) ${sgn(e)}`))}이다. ${X}의 계수는 같으므로 상수항을 비교하면 ${nb(`${iq(a * e)} + ${K} = ${tm(c, K)} ${sgn(e)}`)}, ${is(K, k)}이다.`,
            facts: { value: `${jn(e)}*(1-${jn(a)})/(1-${jn(c)})`, unseen: [1], rule: 'commute-const' }
          });
        }
        if (n === 1) {
          // f = ax + b, g = cx + e (a 를 모른다): ae + b = cb + e → a = (cb + e − b)/e (정수가 아닌 분수)
          const b = nz(d, -6, 6), c = nz(d, -4, 4), e = nz(d, -6, 6), a = Q(c * b + e - b, e);
          if (isInt(a) || a.p === 0 || Math.abs(a.p) > 40 || c === 1) return null;
          return ansV(`두 함수 ${nb(`${FN}(${X}) = ${A}${X} ${sgn(b)}`)}, ${fdef(GN, P(e, c))}에 대하여 ${nb(`${FN} ∘ ${GN} = ${GN} ∘ ${FN}`)}가 성립하도록 하는 상수 ${jw(A, '의')} 값은?`, a, 'frac', {
            explain: `${is(cx2([FN, GN]), nb(`${A}(${pshow(P(e, c))}) ${sgn(b)}`))} = ${nb(poly([[c, A + X], [e, A], [b, '']]))}, ${is(cx2([GN, FN]), nb(`${cf(c)}(${A}${X} ${sgn(b)}) ${sgn(e)}`))} = ${nb(poly([[c, A + X], [c * b + e, '']]))}이다. 상수항을 비교하면 ${nb(`${tm(e, A)} ${sgn(b)} = ${iq(c * b + e)}`)}, ${is(A, tx(a))}이다.`,
            facts: { value: `(${jn(c)}*${jn(b)}+${jn(e)}-${jn(b)})/${jn(e)}`, unseen: [1], rule: 'commute-slope' }
          });
        }
        // f = px + a, g = ax + c, a > 0: a² − a − c(p − 1) = 0
        const r = d.int(2, 5), p = d.until(() => d.pick([2, 3, 4, -1, -2, 5, 7]), (v) => (r * (r - 1)) % (v - 1) === 0), c = r * (r - 1) / (p - 1);
        if (c === 0) return null;
        return N(`두 함수 ${nb(`${FN}(${X}) = ${tm(p, X)} + ${A}`)}, ${nb(`${GN}(${X}) = ${A}${X} ${sgn(c)}`)}에 대하여 ${nb(`${FN} ∘ ${GN} = ${GN} ∘ ${FN}`)}가 성립하도록 하는 양수 ${jw(A, '의')} 값은?`, r, {
          explain: `${is(cx2([FN, GN]), nb(`${cf(p)}(${A}${X} ${sgn(c)}) + ${A}`))}, ${is(cx2([GN, FN]), nb(`${A}(${tm(p, X)} + ${A}) ${sgn(c)}`))}이다. 상수항을 비교하면 ${nb(`${iq(p * c)} + ${A} = ${A}${sup(2)} ${sgn(c)}`)}, ${nb(`(${A} ${sgn(-r)})(${A} ${sgn(r - 1)}) = 0`)}이다. ${A}는 양수이므로 ${is(A, r)}이다.`,
          facts: { value: String(r), unseen: [r], rule: 'commute-square' }
        });
      }, { count: 3 }),
      T('compx-coef', '합성 결과의 식으로 계수 구하기', '②6', (d, n) => {
        if (n === 0) {
          const a = nz(d, -4, 4), b = nz(d, -6, 6), c = nz(d, -4, 4), e = nz(d, -6, 6), r = pComp(P(e, c), P(b, a));
          if (!linOK(r)) return null;
          return vals(`두 함수 ${nb(`${FN}(${X}) = ${A}${X} + ${BB}`)}, ${fdef(GN, P(e, c))}에 대하여 ${is(cx2([GN, FN]), pshow(r))}일 때, 상수 ${A}, ${BB}의 값은?`, [[A, a], [BB, b]], {
            explain: `${is(cx2([GN, FN]), nb(`${cf(c)}(${A}${X} + ${BB}) ${sgn(e)}`))} = ${nb(poly([[c, A + X], [c, BB], [e, '']]))}이다. ${jw(pshow(r), '과/와')} 계수를 비교하면 ${nb(`${tm(c, A)} = ${iq(r[1])}`)}, ${nb(`${tm(c, BB)} ${sgn(e)} = ${iq(r[0])}`)}이므로 ${is(A, a)}, ${is(BB, b)}이다.`,
            facts: { calc: [[`${jn(r[1])}/${jn(c)}`, 0], [`(${jn(r[0])}-${jn(e)})/${jn(c)}`, 1]], unseen: [1] }
          });
        }
        // f = x + a, g = bx + c, (f∘g)(x) = px + q, f(r) = s
        const a = nz(d, -6, 6), b = nz(d, -4, 4), c = nz(d, -6, 6), r0 = d.int(-4, 5), s0 = r0 + a, q = c + a;
        if (q === 0 || Math.abs(b) === 1) return null;
        return vals(`두 함수 ${nb(`${FN}(${X}) = ${X} + ${A}`)}, ${nb(`${GN}(${X}) = ${BB}${X} + ${CC}`)}에 대하여 ${is(cx2([FN, GN]), pshow(P(q, b)))}이고 ${is(at(FN, r0), s0)}일 때, 상수 ${A}, ${BB}, ${CC}의 값은?`, [[A, a], [BB, b], [CC, c]], {
            explain: `${is(at(FN, r0), s0)}에서 ${nb(`${iq(r0)} + ${A} = ${iq(s0)}`)}, ${is(A, a)}이다. ${is(cx2([FN, GN]), nb(`${BB}${X} + ${CC} ${sgn(a)}`))}이므로 ${jw(pshow(P(q, b)), '과/와')} 비교하면 ${is(BB, b)}, ${is(CC, c)}이다.`,
            facts: { calc: [[`${jn(s0)}-${jn(r0)}`, 0], [jn(b), 1], [`${jn(q)}-(${jn(s0)}-${jn(r0)})`, 2]] }
        });
      }, { count: 2 }),
      T('compx-self', 'f ∘ f가 주어질 때 f', '②7', (d) => {
        const a = pm(d) * d.int(2, 4), b = nz(d, -6, 6), p = a * a, q = a * b + b, sign = a > 0;
        return vals(`함수 ${nb(`${FN}(${X}) = ${A}${X} + ${BB}`)}에 대하여 ${is(cx2([FN, FN]), pshow(P(q, p)))}일 때, 상수 ${A}, ${BB}의 값은? (단, ${nb(`${A} ${sign ? GT : LT} 0`)})`, [[A, a], [BB, b]], {
          explain: `${is(cx2([FN, FN]), nb(`${A}(${A}${X} + ${BB}) + ${BB}`))} = ${nb(`${A}${sup(2)}${X} + ${A}${BB} + ${BB}`)}이다. ${nb(`${A}${sup(2)} = ${p}`)}이고 ${nb(`${A} ${sign ? GT : LT} 0`)}이므로 ${is(A, a)}이다. ${nb(`${tm(a + 1, BB)} = ${iq(q)}`)}에서 ${is(BB, b)}이다.`,
          facts: { calc: [[jn(a), 0], [`${jn(q)}/(${jn(a)}+1)`, 1]], unseen: [Math.abs(a), 1] }
        });
      }),
      T('compx-outer', 'f ∘ h = g를 만족시키는 h', '②8', (d, n) => {
        const a = pm(d) * d.int(2, 5), b = nz(d, -7, 7), f = P(b, a), h = P(nz(d, -6, 6), nz(d, -4, 4)), g = pComp(f, h);
        if (!linOK(g)) return null;
        if (n === 0) return linA(`두 함수 ${fdef(FN, f)}, ${fdef(GN, g)}에 대하여 ${is(nb(`${FN} ∘ ${HN}`), GN)}를 만족시키는 일차함수 ${jw(at(HN, X), '을/를')} 구하시오.`, h, {
          explain: `${is(at(FN, at(HN, X)), at(GN, X))}이므로 ${nb(`${cf(a)}${at(HN, X)} ${sgn(b)} = ${pshow(g)}`)}, ${is(at(HN, X), pshow(h))}이다.`,
          facts: { calc: [[`${jn(g[1])}/${jn(a)}`, 0], [`(${jn(g[0])}-${jn(b)})/${jn(a)}`, 1]], rule: 'outer-h' }
        });
        const k = d.int(-4, 6), v = vi(h, k);
        return N(`두 함수 ${fdef(FN, f)}, ${fdef(GN, g)}에 대하여 함수 ${jw(HN, '이/가')} ${is(cx2([FN, HN]), at(GN, X))}를 만족시킬 때, ${at(HN, k)}의 값은?`, v, { signed: true,
          explain: `${is(at(FN, at(HN, k)), at(GN, k))}이고 ${is(at(GN, k), vi(g, k))}이다. ${is(at(HN, k), K)}라 하면 ${nb(`${tm(a, K)} ${sgn(b)} = ${iq(vi(g, k))}`)}에서 ${is(K, v)}이다.`,
          facts: { value: `(${pe(g, k)}-${jn(b)})/${jn(a)}`, unseen: [1], rule: 'outer-hk' }
        });
      }, { count: 2 }),
      T('compx-inner', 'h ∘ f = g를 만족시키는 h', '②9', (d, n) => {
        if (n === 0) {
          const a = pm(d) * d.int(2, 4), b = nz(d, -6, 6), f = P(b, a), h = P(nz(d, -6, 6), nz(d, -4, 4)), g = pComp(h, f);
          if (!linOK(g)) return null;
          return linA(`두 함수 ${fdef(FN, f)}, ${fdef(GN, g)}에 대하여 ${is(nb(`${HN} ∘ ${FN}`), GN)}를 만족시키는 일차함수 ${jw(at(HN, X), '을/를')} 구하시오.`, h, {
            explain: `${is(at(HN, pshow(f)), pshow(g))}이다. ${is(pshow(f), V('t'))}로 놓으면 ${is(X, pAt(invL(f), V('t')))}이므로 ${is(at(HN, V('t')), pAt(h, V('t')))}, 곧 ${is(at(HN, X), pshow(h))}이다.`,
            facts: { calc: [[`${jn(g[1])}/${jn(a)}`, 0], [`${jn(g[0])}-${jn(g[1])}/${jn(a)}*${jn(b)}`, 1]], unseen: [1], rule: 'inner-h' }
          });
        }
        const third = d.bool(), f = third ? P(nz(d, -5, 5), Q(1, 3)) : P(nz(d, -6, 6), pm(d) * d.int(2, 4)), g = P(nz(d, -7, 7), nz(d, -4, 4));
        if (fl(f[0]) === fl(g[0]) && fl(f[1]) === fl(g[1])) return null;
        const x0 = d.until(() => d.int(-6, 9), (v) => isI(f, v) && vi(f, v) !== v), k = vi(f, x0), v = vi(g, x0);
        return N(`세 함수 ${FN}, ${GN}, ${HN}에 대하여 ${fdef(FN, f)}, ${fdef(GN, g)}, ${is(cx2([HN, FN]), at(GN, X))}일 때, ${at(HN, k)}의 값은?`, v, { signed: true,
          explain: `${is(at(FN, X), k)}인 ${X}를 찾으면 ${is(X, x0)}이다. ${is(at(HN, at(FN, x0)), at(GN, x0))}이므로 ${is(at(HN, k), at(GN, x0))} = ${iq(v)}이다.`,
          facts: { value: pe(g, x0), unseen: [Math.abs(x0), 1], rule: 'inner-hk' }
        });
      }, { count: 2 }),
      T('compx-subst', 'f(ax + b) = …에서 f(k), f(x)', '②10', (d, n) => {
        const p = pm(d) * d.int(2, 4), q = nz(d, -6, 6), inner = P(q, p);
        if (n === 0) {
          const r = nz(d, -5, 5), s = nz(d, -8, 8), x0 = d.int(-4, 5), k = p * x0 + q, v = r * x0 + s;
          return N(`함수 ${FN}가 모든 실수 ${X}에 대하여 ${jw(is(at(FN, pshow(inner)), pshow(P(s, r))), '을/를')} 만족시킬 때, ${at(FN, k)}의 값은?`, v, { signed: true,
            explain: `${jw(is(pshow(inner), k), '이/가')} 되는 ${X}는 ${is(X, x0)}이다. 주어진 식에 ${isj(X, x0, '을/를')} 넣으면 ${is(at(FN, k), v)}이다.`,
            facts: { value: `${jn(r)}*(${jn(k)}-${jn(q)})/${jn(p)}+${jn(s)}`, unseen: [1], rule: 'subst-k' }
          });
        }
        // f(px + q) = r x + s, r = pm → f(x) = mx + (s − mq)
        const m = nz(d, -4, 4), s = nz(d, -8, 8), r = p * m, fx = P(s - m * q, m);
        if (!linOK(fx)) return null;
        return linA(`함수 ${FN}가 모든 실수 ${X}에 대하여 ${jw(is(at(FN, pshow(inner)), pshow(P(s, r))), '을/를')} 만족시킬 때, ${jw(at(FN, X), '을/를')} 구하시오.`, fx, {
          explain: `${is(pshow(inner), V('t'))}로 놓으면 ${is(X, pAt(invL(inner), V('t')))}이다. 주어진 식에 넣으면 ${is(at(FN, V('t')), pAt(fx, V('t')))}이므로 ${is(at(FN, X), pshow(fx))}이다.`,
          facts: { calc: [[`${jn(r)}/${jn(p)}`, 0], [`${jn(s)}-${jn(r)}/${jn(p)}*${jn(q)}`, 1]], unseen: [1], rule: 'subst-f' }
        });
      }, { count: 2 }),
      T('compx-discount', '두 할인의 차례(합성의 순서)', '②13', (d) => {
        const pct = d.pick([10, 20, 30, 40, 50]), m = d.pick([500, 1000, 2000, 3000]), gap = m * pct / 100, wrong = d.pick([m, m - gap === gap ? m * 2 : m - gap]);
        const rate = `${pct} % 할인`, fixed = `${m}원 할인`;
        const rows = d.shuffle([[`${rate}을 먼저 받는 것이 ${gap}원 더 싸다.`, true], [`${fixed}을 먼저 받는 것이 ${gap}원 더 싸다.`, false], [`${rate}을 먼저 받는 것이 ${wrong}원 더 싸다.`, false], [`${fixed}을 먼저 받는 것이 ${wrong}원 더 싸다.`, false]]);
        return C(`어느 가게에서 정가가 ${X}원인 물건에 「${rate}」과 「${fixed}」을 차례로 함께 받을 수 있다. ${is(at(FN, X), nb(`${X} ${MINUS} ${m}`))}, ${is(at(GN, X), nb(`${tx(Q(100 - pct, 100))}${X}`))}라 할 때, 두 할인을 받는 차례에 따라 내는 돈을 ${cx2([FN, GN])}, ${jw(cx2([GN, FN]), '으로/로')} 나타내어 비교한 것으로 옳은 것은? (단, ${nb(`${X} ${GT} ${m * 2}`)})`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
          explain: `${is(cx2([FN, GN]), nb(`${tx(Q(100 - pct, 100))}${X} ${MINUS} ${m}`))}(${rate} 먼저), ${is(cx2([GN, FN]), nb(`${tx(Q(100 - pct, 100))}(${X} ${MINUS} ${m})`))} = ${nb(`${tx(Q(100 - pct, 100))}${X} ${MINUS} ${m - gap}`)}(${fixed} 먼저)이다. 따라서 ${rate}을 먼저 받는 것이 ${m} ${MINUS} ${m - gap} = ${gap}(원) 더 싸다.`,
          facts: { truth: rows.map((r) => r[1]), want: true }
        });
      }),
      T('compx-percent', '백분율 올리기·내리기의 합성', '②14', (d) => {
        const up = d.pick([10, 20, 25, 30, 50]), down = d.pick([10, 20, 25, 30, 40]), k = qmul(Q(100 + up, 100), Q(100 - down, 100));
        if (isInt(k) || k.q > 60 || k.p > 240) return null;
        return ansV(`어느 가게에서 판매 가격이 ${X}원인 물건의 가격을 ${up} % 올린 가격을 ${at(FN, X)}원, ${down} % 내린 가격을 ${at(GN, X)}원이라 하자. 가격을 ${up} % 올려 팔다가 할인 기간에 그 가격에서 ${down} % 내려 팔 때의 가격 ${Y}원을 ${is(Y, nb(`${GN}(${FN}(${X}))`))} = ${V('k')}${X}로 나타내면, ${jw(V('k'), '의')} 값은?`, k, 'frac', {
          explain: `${is(at(FN, X), nb(`${tx(Q(100 + up, 100))}${X}`))}, ${is(at(GN, X), nb(`${tx(Q(100 - down, 100))}${X}`))}이므로 ${is(nb(`${GN}(${FN}(${X}))`), nb(`${tx(Q(100 - down, 100))} × ${tx(Q(100 + up, 100))}${X}`))} = ${nb(`${tx(k)}${X}`)}이다.`,
          facts: { value: `(100+${up})/100*(100-${down})/100`, unseen: [100] }
        });
      }),
      T('compx-exchange', '단위 바꾸기를 잇는 합성(환율)', '②15', (d) => {
        const D = d.pick([2, 4, 5, 8, 10, 20]), per = d.int(4, 30) * 10, R = per * D, x0 = d.until(() => d.int(2, 40) * 5, (v) => v * per <= 9999 && v * per >= 1000);
        return M(`어느 날의 환율이 1달러에 ${R}원, 1달러에 ${D}디르함이었다. ${X}디르함을 달러로 바꾼 뒤 다시 원으로 바꾼 금액을 ${Y}원이라 할 때, ${X}와 ${Y} 사이의 관계식과 ${x0}디르함을 바꾼 금액은?`, [{ lead: `${Y} =`, answer: per, unit: X }, { lead: `${x0}디르함은`, answer: x0 * per, unit: '원' }], {
          shown: `${is(Y, `${per}${X}`)}, ${x0 * per}원`,
          explain: `${X}디르함은 ${nb(`${frac(1, D)}${X}`)}달러이고, ${V('z')}달러는 ${R}${V('z')}원이다. 두 함수를 합성하면 ${is(Y, nb(`${R} × ${frac(1, D)}${X}`))} = ${per}${X}이다. ${isj(X, x0, '을/를')} 넣으면 ${x0 * per}원이다.`,
          facts: { calc: [[`${R}/${D}`, 0], [`${R}/${D}*${x0}`, 1]] }
        });
      })
    ]
  });

  // ── 역함수의 값 ──
  B.addGroup('10-2-6', {
    id: 'inv', title: '역함수의 값', standard: S3,
    types: [
      T('inv-self-map', 'X에서 X로의 대응 그림에서 함숫값과 역함숫값', '심1', (d) => {
        const xs = d.pick([[1, 2, 3, 4], [1, 3, 5, 7], [2, 4, 6, 8]]), perm = d.shuffle([0, 1, 2, 3]), f = (x) => xs[perm[xs.indexOf(x)]], k = d.pick(xs), fi = xs[perm.indexOf(xs.indexOf(k))];
        if (f(k) === fi || f(k) === k) return null;
        return M(`그림은 함수 ${nb(`${FN} : ${SX} → ${SX}`)}를 나타낸 것이다. ${at(FN, k)}, ${at(iv(FN), k)}의 값은?`, [{ lead: at(FN, k) + ' =', answer: f(k) }, { lead: at(iv(FN), k) + ' =', answer: fi }], {
          figure: mapFig({ sets: [{ name: 'X', items: xs.map(String) }, { name: 'X', items: xs.map(String) }], maps: [xs.map((x, i) => [i, perm[i]])], names: ['f'] }),
          shown: `${is(at(FN, k), f(k))}, ${is(at(iv(FN), k), fi)}`,
          explain: `${k}에서 나가는 화살표는 ${f(k)}에 닿으므로 ${is(at(FN, k), f(k))}이다. ${jw(String(k), '으로/로')} 들어오는 화살표는 ${fi}에서 나가므로 ${is(at(FN, fi), k)}, 곧 ${is(at(iv(FN), k), fi)}이다.`,
          facts: { calc: [[String(f(k)), 0], [String(fi), 1]] }
        });
      }),
      T('inv-map-values', '대응 그림으로 역함숫값', '②17', (d) => {
        const xs = [1, 2, 3, 4], ys = d.shuffle(range(2, 9)).slice(0, 4).sort((u, v) => u - v), perm = d.shuffle([0, 1, 2, 3]);
        const f = (x) => ys[perm[x - 1]], finv = (y) => xs[perm.indexOf(ys.indexOf(y))];
        const p = d.pick(ys), q = d.pick(xs), r = d.pick(ys);
        if (finv(p) === p) return null;
        return M(`그림과 같은 함수 ${nb(`${FN} : ${SX} → ${SY}`)}에 대하여 ${at(iv(FN), p)}, ${cat([iv(FN), FN], q)}, ${cat([FN, iv(FN)], r)}의 값은?`, [{ lead: at(iv(FN), p) + ' =', answer: finv(p) }, { lead: cat([iv(FN), FN], q) + ' =', answer: q }, { lead: cat([FN, iv(FN)], r) + ' =', answer: r }], {
          figure: mapFig({ sets: [{ name: 'X', items: xs.map(String) }, { name: 'Y', items: ys.map(String) }], maps: [xs.map((x, i) => [i, perm[i]])], names: ['f'] }),
          shown: `${finv(p)}, ${q}, ${r}`,
          explain: `${is(at(FN, finv(p)), p)}이므로 ${is(at(iv(FN), p), finv(p))}이다. ${cat([iv(FN), FN], X)}는 ${SX}에서의 항등함수, ${cat([FN, iv(FN)], Y)}는 ${SY}에서의 항등함수이므로 ${is(cat([iv(FN), FN], q), q)}, ${is(cat([FN, iv(FN)], r), r)}이다.`,
          facts: { calc: [[String(finv(p)), 0], [String(q), 1], [String(r), 2]] }
        });
      }),
      T('inv-complete-map', '역함수가 존재하도록 대응 그림 채우기', '②18', (d) => {
        const xs = [1, 2, 3, 4], ys = d.pick([[1, 3, 5, 7], [2, 4, 6, 8], [1, 2, 5, 9]]), perm = d.shuffle([0, 1, 2, 3]), gone = d.int(1, 4);
        const arrows = xs.filter((x) => x !== gone).map((x) => [x - 1, perm[x - 1]]), m = ys[perm[gone - 1]], r = d.until(() => d.pick(xs), (v) => v !== gone), rv = ys[perm[r - 1]];
        return M(`함수 ${nb(`${FN} : ${SX} → ${SY}`)}의 역함수 ${jw(iv(FN), '이/가')} 존재하도록 그림의 빠진 화살표 하나를 채울 때, ${at(iv(FN), m)}, ${at(iv(FN), rv)}의 값은?`, [{ lead: at(iv(FN), m) + ' =', answer: gone }, { lead: at(iv(FN), rv) + ' =', answer: r }], {
          figure: mapFig({ sets: [{ name: 'X', items: xs.map(String) }, { name: 'Y', items: ys.map(String) }], maps: [arrows], names: ['f'] }),
          shown: `${gone}, ${r}`,
          explain: `역함수가 존재하려면 ${FN}가 일대일대응이어야 하므로 화살표가 없는 ${jw(String(gone), '은/는')} 아직 화살표를 받지 않은 ${jw(String(m), '에')} 대응한다. 따라서 ${is(at(iv(FN), m), gone)}, ${is(at(iv(FN), rv), r)}이다.`,
          facts: { calc: [[String(gone), 0], [String(r), 1]] }
        });
      }),
      T('inv-linear-value', '일차함수의 역함숫값', '②19', (d, n) => {
        const half = d.bool(), f = half ? P(nz(d, -6, 6), Q(pm(d), 2)) : P(nz(d, -7, 7), nz(d, -4, 4));
        if (n === 0) {
          const x0 = d.until(() => d.int(-6, 8), (v) => v !== 0 && isI(f, v) && vi(f, v) !== v), k = vi(f, x0);
          return N(`함수 ${fdef(FN, f)}에 대하여 ${at(iv(FN), k)}의 값은?`, x0, { signed: true,
            explain: `${is(at(iv(FN), k), A)}라 하면 ${is(at(FN, A), k)}이므로 ${nb(`${pAt(f, V('a'))} = ${iq(k)}`)}, ${is(A, x0)}이다.`,
            facts: { value: `(${jn(k)}-${jn(f[0])})/${jn(f[1])}`, unseen: [1], rule: 'inv-k' }
          });
        }
        const p = d.until(() => d.int(-4, 5), (v) => isI(f, v)), x0 = d.until(() => d.int(-6, 8), (v) => v !== 0 && isI(f, v) && v !== p), q = vi(f, x0);
        return M(`함수 ${fdef(FN, f)}에 대하여 ${at(FN, p)}, ${at(iv(FN), q)}의 값은?`, [{ lead: at(FN, p) + ' =', answer: vi(f, p), signed: true }, { lead: at(iv(FN), q) + ' =', answer: x0, signed: true }], {
          shown: `${is(at(FN, p), vi(f, p))}, ${is(at(iv(FN), q), x0)}`,
          explain: `${is(at(FN, p), vi(f, p))}이다. ${is(at(iv(FN), q), A)}라 하면 ${is(at(FN, A), q)}에서 ${is(A, x0)}이다.`,
          facts: { calc: [[pe(f, p), 0], [`(${jn(q)}-${jn(f[0])})/${jn(f[1])}`, 1]], unseen: [1], rule: 'inv-both' }
        });
      }, { count: 2 }),
      T('inv-mixed-value', '역함수와 합성이 섞인 값', '②20', (d) => {
        const f = P(nz(d, -6, 6), nz(d, -4, 4)), g = P(nz(d, -6, 6), pm(d) * d.int(2, 3)), p = d.int(-3, 4), fp = vi(f, p), u = qdiv(qsub(Q(fp), g[0]), g[1]);
        const w = d.until(() => d.int(-4, 5), (v) => v !== 0), q = vi(g, vi(f, w));   // (f⁻¹∘g⁻¹)(q) = w, 답 0 은 피한다
        if (!isInt(u) || fl(u) === 0 || Math.abs(q) > 60) return null;
        return M(`두 함수 ${fdef(FN, f)}, ${fdef(GN, g)}에 대하여 ${cat([iv(GN), FN], p)}, ${cat([iv(FN), iv(GN)], q)}의 값은?`, [{ lead: cat([iv(GN), FN], p) + ' =', answer: fl(u), signed: true }, { lead: cat([iv(FN), iv(GN)], q) + ' =', answer: w, signed: true }], {
          shown: `${is(cat([iv(GN), FN], p), fl(u))}, ${is(cat([iv(FN), iv(GN)], q), w)}`,
          explain: `${is(at(FN, p), fp)}이므로 ${is(cat([iv(GN), FN], p), at(iv(GN), fp))}이고, ${is(at(GN, A), fp)}인 ${is(A, fl(u))}이다. ${is(cat([iv(FN), iv(GN)], q), at(iv(FN), at(iv(GN), q)))}이고 ${is(at(iv(GN), q), vi(f, w))}, ${is(at(iv(FN), vi(f, w)), w)}이다.`,
          facts: { calc: [[`(${pe(f, p)}-${jn(g[0])})/${jn(g[1])}`, 0], [`((${jn(q)}-${jn(g[0])})/${jn(g[1])}-${jn(f[0])})/${jn(f[1])}`, 1]], unseen: [1] }
        });
      }),
      T('inv-one-condition', '역함숫값 조건 하나로 계수 구하기', '②21', (d, n) => {
        if (n === 0) {
          const a = pm(d) * d.int(2, 5), b = nz(d, -6, 6), p = nz(d, -3, 4), q = a * p + b, x0 = d.int(-5, 6), r = a * x0 + b;
          return N(`함수 ${nb(`${FN}(${X}) = ${A}${X} ${sgn(b)}`)}에 대하여 ${is(at(FN, p), q)}일 때, ${at(iv(FN), r)}의 값은?`, x0, { signed: true,
            explain: `${is(at(FN, p), q)}에서 ${nb(`${tm(p, A)} ${sgn(b)} = ${iq(q)}`)}, ${is(A, a)}이다. ${is(at(iv(FN), r), K)}라 하면 ${is(at(FN, K), r)}, ${nb(`${tm(a, K)} ${sgn(b)} = ${iq(r)}`)}에서 ${is(K, x0)}이다.`,
            facts: { value: `(${jn(r)}-${jn(b)})/((${jn(q)}-${jn(b)})/${jn(p)})`, unseen: [1], rule: 'one-cond-a' }
          });
        }
        const c = nz(d, -5, 5), k = nz(d, -9, 9), q = d.int(-4, 5), p = c * q + k, r = d.int(-4, 6);
        if (p === q) return null;
        return N(`함수 ${nb(`${FN}(${X}) = ${tm(c, X)} + ${K}`)}에 대하여 ${is(at(iv(FN), p), q)}일 때, ${at(FN, r)}의 값은? (단, ${K}는 상수이다.)`, c * r + k, { signed: true,
          explain: `${is(at(iv(FN), p), q)}이므로 ${is(at(FN, q), p)}, ${nb(`${iq(c * q)} + ${K} = ${iq(p)}`)}에서 ${is(K, k)}이다. 따라서 ${is(at(FN, r), c * r + k)}이다.`,
          facts: { value: `${jn(c)}*${jn(r)}+${jn(p)}-${jn(c)}*${jn(q)}`, unseen: [1], rule: 'one-cond-k' }
        });
      }, { count: 2 }),
      T('inv-two-conditions', 'f와 f⁻¹이 섞인 조건 둘로 일차함수 정하기', '②22', (d, n) => {
        const a = nz(d, -4, 4), b = nz(d, -7, 7), f = (x) => a * x + b;
        if (n === 0) {
          const [q1, q2] = d.until(() => [d.int(-4, 4), d.int(-4, 4)], ([u, v]) => u !== v), p1 = f(q1), p2 = f(q2);
          return vals(`함수 ${nb(`${FN}(${X}) = ${A}${X} + ${BB}`)}에 대하여 ${is(at(iv(FN), p1), q1)}, ${is(at(iv(FN), p2), q2)}일 때, 상수 ${A}, ${BB}의 값은?`, [[A, a], [BB, b]], {
            explain: `${is(at(FN, q1), p1)}, ${is(at(FN, q2), p2)}이므로 ${nb(`${poly([[q1, A], [1, BB]])} = ${iq(p1)}`)}, ${nb(`${poly([[q2, A], [1, BB]])} = ${iq(p2)}`)}이다. 연립하면 ${is(A, a)}, ${is(BB, b)}이다.`,
            facts: { calc: [[`(${jn(p1)}-${jn(p2)})/(${jn(q1)}-${jn(q2)})`, 0], [`${jn(p1)}-(${jn(p1)}-${jn(p2)})/(${jn(q1)}-${jn(q2)})*${jn(q1)}`, 1]], rule: 'two-cond-ab' }
          });
        }
        const q = d.int(-3, 4), p = f(q), s = f(p), t = d.int(-4, 5);
        if (p === q) return null;
        return N(`일차함수 ${FN}에 대하여 ${is(at(iv(FN), p), q)}, ${is(cat([FN, FN], q), s)}일 때, ${at(FN, t)}의 값은?`, f(t), { signed: true,
          explain: `${is(at(iv(FN), p), q)}에서 ${is(at(FN, q), p)}이다. ${is(cat([FN, FN], q), at(FN, p))} = ${iq(s)}이다. 직선 ${is(Y, at(FN, X))}가 두 점 ${nb(`(${iq(q)}, ${iq(p)})`)}, ${jw(nb(`(${iq(p)}, ${iq(s)})`), '을/를')} 지나므로 ${is(at(FN, X), pshow(P(b, a)))}이고 ${is(at(FN, t), f(t))}이다.`,
          facts: { value: `${jn(p)}+(${jn(s)}-${jn(p)})/(${jn(p)}-${jn(q)})*(${jn(t)}-${jn(q)})`, rule: 'two-cond-t' }
        });
      }, { count: 2 }),
      T('inv-piece-value', '조각 일차함수의 함숫값과 역함숫값', '②23', (d) => {
        const t = d.pick([0, 1, 2, -1]), a1 = d.int(1, 4), a2 = d.int(1, 4), ft = nz(d, -6, 6), b1 = ft - a1 * t, b2 = ft - a2 * t;
        if (a1 === a2) return null;
        const f = (x) => (x >= t ? a1 * x + b1 : a2 * x + b2), u = t - d.int(1, 3), x1 = t + d.int(1, 4), v = f(x1);
        return M(`실수 전체의 집합에서 정의된 함수 ${FN}(${X}) = ${pw([[pshow(P(b1, a1)), `${X} ${GE} ${iq(t)}`], [pshow(P(b2, a2)), `${X} ${LT} ${iq(t)}`]])}에 대하여 ${at(FN, u)}, ${at(iv(FN), v)}의 값은?`, [{ lead: at(FN, u) + ' =', answer: f(u), signed: true }, { lead: at(iv(FN), v) + ' =', answer: x1, signed: true }], {
          shown: `${is(at(FN, u), f(u))}, ${is(at(iv(FN), v), x1)}`,
          explain: `${nb(`${iq(u)} ${LT} ${iq(t)}`)}이므로 ${is(at(FN, u), f(u))}이다. ${is(at(FN, t), ft)}이고 ${FN}는 증가하므로 ${nb(`${iq(v)} ${GE} ${iq(ft)}`)}인 ${jw(iq(v), '은/는')} 첫째 식에서 나온다. ${nb(`${pshow(P(b1, a1))} = ${iq(v)}`)}에서 ${is(X, x1)}이므로 ${is(at(iv(FN), v), x1)}이다.`,
          facts: { calc: [[pe(P(b2, a2), u), 0], [`(${jn(v)}-${jn(b1)})/${jn(a1)}`, 1]], unseen: [0, 1] }
        });
      }),
      T('inv-piece-case', '이차 조각이 낀 역함숫값(경우 나누기)', '②24', (d) => {
        const m = d.int(2, 5), c = nz(d, -5, 8), s = d.int(1, 4), k = c - s * s, xr = Q(k - c, m);
        return N(`함수 ${FN}(${X}) = ${pw([[pshow(P(c, m)), `${X} ${GE} 0`], [pshow(P(c, 0, -1)), `${X} ${LT} 0`]])}에 대하여 ${at(iv(FN), k)}의 값은?`, -s, { signed: true,
          explain: `${is(at(iv(FN), k), A)}라 하면 ${is(at(FN, A), k)}이다. ${nb(`${A} ${GE} 0`)}이면 ${nb(`${tm(m, A)} ${sgn(c)} = ${iq(k)}`)}에서 ${is(A, tx(xr))}인데 0보다 작으므로 맞지 않는다. ${nb(`${A} ${LT} 0`)}이면 ${nb(`${MINUS}${A}${sup(2)} ${sgn(c)} = ${iq(k)}`)}에서 ${is(A, nb(`±${s}`))}이고 ${nb(`${A} ${LT} 0`)}이므로 ${is(A, -s)}이다.`,
          facts: { value: `0-${s}`, unseen: [0, s] }
        });
      }),
      T('inv-stairs-comp', 'y = x를 써서 그래프로 합성값 읽기', '②26', (d) => {
        const dir = d.pick(['up', 'down']), steps = d.pick([2, 3]), start = dir === 'up' ? d.int(0, 4 - steps) : d.int(steps, 4), end = dir === 'up' ? start + steps : start - steps;
        const fs = Array.from({ length: steps }, () => FN), opts = LET.map((t) => V(t));
        return C(`두 함수 ${nb(`${Y} = ${FN}(${X})`)}와 ${nb(`${Y} = ${X}`)}의 그래프가 그림과 같을 때, ${jw(cat(fs, V(LET[start])), '의')} 값은? (단, 모든 점선은 ${X}축 또는 ${Y}축에 평행하다.)`, opts, end, {
          figure: stairFig(dir),
          explain: `직선 ${is(Y, X)} 위의 점은 ${X}좌표와 ${Y}좌표가 같으므로, 곡선 위의 점의 높이를 ${Y} = ${X}를 따라 ${X}축으로 옮겨 읽는다. 그림에서 ${(dir === 'up' ? range(start, end - 1) : range(end + 1, start).reverse()).map((i) => is(at(FN, V(LET[i])), V(LET[dir === 'up' ? i + 1 : i - 1]))).join(', ')}이므로 ${is(cat(fs, V(LET[start])), V(LET[end]))}이다.`,
          facts: { truth: LET.map((_, i) => i === end), want: true }
        });
      }),
      T('inv-stairs-inverse', '그래프로 역함숫값 읽기', '②27', (d, n) => {
        const dir = d.pick(['up', 'down']), back = n === 0 ? 1 : 2, from = dir === 'up' ? d.int(back, 4) : d.int(0, 4 - back), to = dir === 'up' ? from - back : from + back;
        const ask = n === 0 ? at(iv(FN), V(LET[from])) : nb(`(${FN} ∘ ${FN})${sup(MINUS + '1')}(${V(LET[from])})`);
        return C(`두 함수 ${nb(`${Y} = ${FN}(${X})`)}와 ${nb(`${Y} = ${X}`)}의 그래프가 그림과 같고 ${FN}의 역함수 ${jw(iv(FN), '이/가')} 존재할 때, ${jw(ask, '의')} 값은? (단, 모든 점선은 ${X}축 또는 ${Y}축에 평행하다.)`, LET.map((t) => V(t)), to, {
          figure: stairFig(dir),
          explain: (n === 0 ? `${is(at(iv(FN), V(LET[from])), K)}라 하면 ${is(at(FN, K), V(LET[from]))}이다. 그림에서 ${is(at(FN, V(LET[to])), V(LET[from]))}이므로 ${is(K, V(LET[to]))}이다.`
            : `${is(nb(`(${FN} ∘ ${FN})${sup(MINUS + '1')}`), nb(`${iv(FN)} ∘ ${iv(FN)}`))}이다. 그림에서 ${is(at(FN, V(LET[(from + to) / 2])), V(LET[from]))}이므로 ${is(at(iv(FN), V(LET[from])), V(LET[(from + to) / 2]))}이고, ${is(at(FN, V(LET[to])), V(LET[(from + to) / 2]))}이므로 ${is(at(iv(FN), V(LET[(from + to) / 2])), V(LET[to]))}이다.`),
          facts: { truth: LET.map((_, i) => i === to), want: true }
        });
      }, { count: 2 }),
      T('inv-two-graphs', '두 함수의 그래프로 역함수·합성값', '②28', (d) => {
        const c = d.until(() => {
          const m1 = d.pick([1, 2, -1, Q(1, 2)]), m2 = d.pick([1, 2, -2, Q(1, 2), -1]), c1 = d.int(-2, 2), c2 = d.int(-3, 3);
          const f = P(c1, m1), g = P(c2, m2), k = d.int(-3, 3), v = pv(f, k), w = qdiv(qsub(v, g[0]), g[1]);
          return { f, g, k, v, w, m1, m2, c1, c2 };
        }, (o) => (o.c1 !== 0 || o.c2 !== 0) && isInt(o.v) && isInt(o.w) && Math.abs(fl(o.v)) <= 4 && Math.abs(fl(o.w)) <= 4 && fl(o.w) !== o.k && fl(o.f[1]) !== fl(o.g[1]) && fl(o.v) !== o.k);
        return N(`그림은 역함수가 존재하는 두 일차함수 ${nb(`${Y} = ${FN}(${X})`)}, ${nb(`${Y} = ${GN}(${X})`)}의 그래프이다. ${nb(`(${iv(FN)} ∘ ${GN})${sup(MINUS + '1')}(${iq(c.k)})`)}의 값은?`, fl(c.w), { signed: true,
          figure: twoLines([[c.f, 'f', BLUE], [c.g, 'g', '#b42318']]),
          explain: `${is(nb(`(${iv(FN)} ∘ ${GN})${sup(MINUS + '1')}`), nb(`${iv(GN)} ∘ (${iv(FN)})${sup(MINUS + '1')}`))} = ${nb(`${iv(GN)} ∘ ${FN}`)}이므로 구하는 값은 ${at(iv(GN), at(FN, c.k))}이다. 그래프에서 ${is(at(FN, c.k), tx(c.v))}이고, ${is(at(GN, tx(c.w)), tx(c.v))}이므로 답은 ${iq(c.w)}이다.`,
          facts: { value: `(${pe(c.f, c.k)}-${jn(c.g[0])})/${jn(c.g[1])}`, unseen: [0, 1, 2, Math.abs(c.k)] }
        });
      }),
      T('inv-intercepts', 'f(ax + b) 꼴로 준 함수의 역함수 그래프의 절편', '②10', (d) => {
        const p = pm(d) * d.int(2, 4), q = nz(d, -6, 6), m = pm(d) * d.int(2, 3), nn = m * nz(d, -4, 4), fx = P(nn, m), r = p * m, s = nn + m * q;
        return M(`함수 ${FN}가 모든 실수 ${X}에 대하여 ${jw(is(at(FN, pshow(P(q, p))), pshow(P(s, r))), '을/를')} 만족시킬 때, 함수 ${is(Y, at(iv(FN), X))}의 그래프의 ${X}절편과 ${Y}절편은?`, [{ lead: `${X}절편:`, answer: nn, signed: true }, { lead: `${Y}절편:`, answer: -nn / m, signed: true }], {
          shown: `${X}절편 ${iq(nn)}, ${Y}절편 ${iq(-nn / m)}`,
          explain: `${is(pshow(P(q, p)), V('t'))}로 놓아 정리하면 ${is(at(FN, X), pshow(fx))}이다. 역함수의 그래프는 직선 ${is(Y, X)}에 대하여 대칭이므로 ${X}절편은 ${is(Y, at(FN, X))}의 ${Y}절편 ${iq(nn)}, ${Y}절편은 ${is(Y, at(FN, X))}의 ${X}절편 ${iq(-nn / m)}이다.`,
          facts: { calc: [[`${jn(s)}-${jn(r)}/${jn(p)}*${jn(q)}`, 0], [`0-(${jn(s)}-${jn(r)}/${jn(p)}*${jn(q)})/(${jn(r)}/${jn(p)})`, 1]], unseen: [0] }
        });
      })
    ]
  });

  // ── 역함수 구하기와 그래프 ──
  B.addGroup('10-2-6', {
    id: 'invx', title: '역함수 구하기와 그래프', standard: S3,
    types: [
      T('invx-linear', '일차함수의 역함수', '②29', (d, n) => {
        if (n === 0) {
          const m = pm(d) * d.int(2, 5), c = nz(d, -6, 6), f = P(c, Q(1, m)), g = invL(f);
          if (!linOK(g)) return null;
          return linA(`함수 ${is(Y, pshow(f))}의 역함수를 ${nb(`${Y} = ${A}${X} + ${BB}`)}의 꼴로 나타내시오.`, g, {
            explain: `${is(Y, pshow(f))}에서 ${X}를 ${Y}에 대한 식으로 나타내면 ${is(X, pAt(g, V('y')))}이다. ${X}와 ${Y}를 서로 바꾸면 역함수는 ${is(Y, pshow(g))}이다.`,
            facts: { calc: [[String(m), 0], [`0-${jn(m)}*${jn(c)}`, 1]], unseen: [0, Math.abs(m)], rule: 'inv-int' }
          });
        }
        const a = pm(d) * d.int(2, 5), b = nz(d, -7, 7), f = P(b, a), g = invL(f);
        if (b % a === 0) return null;
        const cands = [[g, true], [P(qdiv(Q(b), Q(a)), Q(1, a)), false], [P(Q(-b), Q(1, a)), false], [P(qdiv(Q(-b), Q(a)), Q(-1, a)), false], [P(Q(-b, 1), Q(a)), false]];
        const seen = new Set(), rows = cands.filter(([p]) => { const k0 = pshow(p); if (seen.has(k0)) return false; seen.add(k0); return true; }).slice(0, 4).map(([p, ok]) => [nb(`${Y} = ${pshow(p)}`), ok]);
        return pickRows(d, `함수 ${is(Y, pshow(f))}의 역함수는?`, rows, {
          explain: `${is(Y, pshow(f))}에서 ${X}를 ${Y}에 대한 식으로 나타내면 ${is(X, pAt(g, V('y')))}이다. ${X}와 ${Y}를 서로 바꾸면 ${is(Y, pshow(g))}이다.`
        });
      }, { count: 2 }),
      T('invx-from-inverse', 'f⁻¹을 주고 f 구하기', '②30', (d) => {
        const m = pm(d) * d.int(2, 5), nn = nz(d, -8, 8), fi = invL(P(nn, m));
        return vals(`함수 ${nb(`${FN}(${X}) = ${MM}${X} + ${NN}`)}의 역함수가 ${is(at(iv(FN), X), pshow(fi))}일 때, 상수 ${MM}, ${NN}의 값은?`, [[MM, m], [NN, nn]], {
          explain: `${is(nb(`(${iv(FN)})${sup(MINUS + '1')}`), FN)}이므로 ${FN}는 ${iv(FN)}의 역함수이다. ${is(Y, pshow(fi))}에서 ${is(X, pAt(P(nn, m), V('y')))}이므로 ${is(at(FN, X), pshow(P(nn, m)))}, ${is(MM, m)}, ${is(NN, nn)}이다.`,
          facts: { calc: [[`${fi[1].q}/${jn(Q(fi[1].p))}`, 0], [`0-(${jn(Q(fi[0].p))}*${fi[1].q})/(${fi[0].q}*${jn(Q(fi[1].p))})`, 1]], unseen: [0, 1] }
        });
      }),
      T('invx-coef', '역함수의 식이 주어질 때 계수', '②31', (d, n) => {
        if (n === 0) {
          const p = pm(d) * d.int(2, 5), a = nz(d, -5, 5), c = -p * a;
          return vals(`함수 ${nb(`${Y} = ${frac(1, Math.abs(p)).replace(/^/, p < 0 ? MINUS : '')}${X} + ${A}`)}의 역함수가 ${nb(`${Y} = ${BB}${X} ${sgn(c)}`)}일 때, 상수 ${A}, ${BB}의 값은?`, [[A, a], [BB, p]], {
            explain: `${nb(`${Y} = ${p < 0 ? MINUS : ''}${frac(1, Math.abs(p))}${X} + ${A}`)}에서 ${X}를 ${Y}에 대한 식으로 나타내면 ${is(X, nb(`${tm(p, Y)} ${MINUS} ${cf(p) === '' ? '' : cf(p) === MINUS ? '(' + MINUS + ')' : iq(p)}${A}`))}이므로 역함수는 ${is(Y, nb(`${tm(p, X)} ${MINUS} ${p < 0 ? '(' + iq(p) + ')' : iq(p)}${A}`))}이다. 비교하면 ${is(BB, p)}이고, ${nb(`${MINUS}${p < 0 ? '(' + iq(p) + ')' : iq(p)}${A} = ${iq(c)}`)}에서 ${is(A, a)}이다.`,
            facts: { calc: [[`(0-${jn(c)})/${jn(p)}`, 0], [jn(p), 1]], unseen: [0, Math.abs(p)] }
          });
        }
        const k = nz(d, -6, 6), a = pm(d) * d.int(2, 5), nn = nz(d, -4, 4), m = a * nn + k, b = Q(1, a), c = Q(-k, a);
        if (isInt(c)) return null;
        const show = (aa, bb, cc) => `${is(A, aa)}, ${is(BB, tx(bb))}, ${is(CC, tx(cc))}`;
        const rows = [[show(a, b, c), true], [show(a, Q(a), c), false], [show(a, b, qneg(c)), false], [show(-a, qneg(b), qneg(c)), false]];
        return pickRows(d, `함수 ${nb(`${FN}(${X}) = ${A}${X} ${sgn(k)}`)}의 역함수가 ${is(at(iv(FN), X), nb(`${BB}${X} + ${CC}`))}이고 ${is(at(iv(FN), m), nn)}일 때, 상수 ${A}, ${BB}, ${CC}의 값은?`, rows, {
          explain: `${is(at(iv(FN), m), nn)}에서 ${is(at(FN, nn), m)}이므로 ${nb(`${tm(nn, A)} ${sgn(k)} = ${iq(m)}`)}, ${is(A, a)}이다. ${is(Y, pshow(P(k, a)))}의 역함수는 ${is(Y, pshow(invL(P(k, a))))}이므로 ${is(BB, tx(b))}, ${is(CC, tx(c))}이다.`
        });
      }, { count: 2 }),
      T('invx-self-inverse', 'f = f⁻¹인 일차함수', '②32', (d, n) => {
        if (n === 0) {
          const [p, q] = d.until(() => [d.int(-5, 6), d.int(-5, 6)], ([u, v]) => u !== v && u + v !== 0);
          return vals(`함수 ${nb(`${FN}(${X}) = ${A}${X} + ${BB}`)}에 대하여 ${is(FN, iv(FN))}이고 ${is(at(FN, p), q)}일 때, 상수 ${A}, ${BB}의 값은?`, [[A, -1], [BB, p + q]], {
            explain: `${is(FN, iv(FN))}이므로 ${is(at(iv(FN), p), q)}, 곧 ${is(at(FN, q), p)}이다. ${nb(`${poly([[p, A], [1, BB]])} = ${iq(q)}`)}, ${jw(nb(`${poly([[q, A], [1, BB]])} = ${iq(p)}`), '을/를')} 연립하면 ${is(A, -1)}, ${is(BB, p + q)}이다.`,
            facts: { calc: [[`(${jn(q)}-${jn(p)})/(${jn(p)}-${jn(q)})`, 0], [`${jn(p)}+${jn(q)}`, 1]] }
          });
        }
        const m = d.int(2, 9), c = nz(d, -9, 9);
        return N(`함수 ${nb(`${Y} = ${MINUS}${frac(1, m)}${A}${X} ${sgn(c)}`)}의 역함수가 자기 자신과 같을 때, 상수 ${jw(A, '의')} 값은? (단, ${nb(`${A} ≠ 0`)})`, m, {
          explain: `기울기가 ${V('k')}인 직선의 역함수는 기울기가 ${frac(1, V('k'))}인 직선이므로, 역함수가 자기 자신과 같으려면 ${nb(`${V('k')} = ${frac(1, V('k'))}`)}, 곧 ${is(V('k'), nb('±1'))}이다. ${is(V('k'), 1)}이면 ${nb(`${Y} = ${X} ${sgn(c)}`)}의 역함수는 ${jw(nb(`${Y} = ${X} ${sgn(-c)}`), '으로/로')} 자기 자신이 아니므로 ${is(V('k'), -1)}이다. ${nb(`${MINUS}${frac(1, m)}${A} = ${MINUS}1`)}에서 ${is(A, m)}이다.`,
          facts: { value: String(m), unseen: [] }
        });
      }, { count: 2 }),
      T('invx-comp-inverse', '합성함수의 역함수', '②33', (d, n) => {
        const f = P(nz(d, -6, 6), nz(d, -3, 3)), g = P(nz(d, -6, 6), nz(d, -3, 3)), gf = pComp(g, f), right = invL(gf), trap = pComp(invL(g), invL(f));
        if (n === 0) {
          const cands = [[right, true], [trap, false], [gf, false], [P(qneg(right[0]), right[1]), false]];
          const seen = new Set(), rows = cands.filter(([p]) => { const k0 = pshow(p); if (seen.has(k0)) return false; seen.add(k0); return true; });
          if (rows.length < 4) return null;
          return pickRows(d, `두 함수 ${fdef(FN, f)}, ${fdef(GN, g)}에 대하여 ${nb(`(${GN} ∘ ${FN})${sup(MINUS + '1')}(${X})`)}는?`, rows.map(([p, ok]) => [pshow(p), ok]), {
            explain: `${is(cx2([GN, FN]), pshow(gf))}이므로 그 역함수는 ${pshow(right)}이다. 곧 ${is(nb(`(${GN} ∘ ${FN})${sup(MINUS + '1')}`), nb(`${iv(FN)} ∘ ${iv(GN)}`))}이고, 차례를 바꾼 ${nb(`${iv(GN)} ∘ ${iv(FN)}`)}와는 다르다.`
          });
        }
        const fg = pComp(f, g), w = d.int(-4, 5), k = vi(fg, w);
        if (Math.abs(k) > 60) return null;
        return N(`두 함수 ${fdef(FN, f)}, ${fdef(GN, g)}에 대하여 ${nb(`(${FN} ∘ ${GN})${sup(MINUS + '1')}(${iq(k)})`)}의 값은?`, w, { signed: true,
          explain: `${is(nb(`(${FN} ∘ ${GN})${sup(MINUS + '1')}(${iq(k)})`), A)}라 하면 ${is(cat([FN, GN], A), k)}이다. ${is(cx2([FN, GN]), pshow(fg))}이므로 ${nb(`${pAt(fg, V('a'))} = ${iq(k)}`)}에서 ${is(A, w)}이다.`,
          facts: { value: `((${jn(k)}-${jn(f[0])})/${jn(f[1])}-${jn(g[0])})/${jn(g[1])}`, unseen: [1] }
        });
      }, { count: 2 }),
      T('invx-piece-inverse', '조각 일차함수의 역함수 식', '②34', (d) => {
        const t = d.pick([0, 1, 2]), a1 = d.pick([Q(1, 2), Q(2), Q(3), Q(1, 3)]), a2 = d.until(() => d.pick([Q(1, 2), Q(2), Q(3), Q(1, 3)]), (v) => v.p * a1.q !== a1.p * v.q), ft = nz(d, -4, 5);
        const p1 = P(qsub(Q(ft), qmul(a1, Q(t))), a1), p2 = P(qsub(Q(ft), qmul(a2, Q(t))), a2), i1 = invL(p1), i2 = invL(p2);
        if (![p1, p2, i1, i2].every((p) => p.every((c0) => c0.q <= 3))) return null;
        const pieces = (r1, c1, r2, c2) => `${iv(FN)}(${X}) = ` + pw([[pshow(r1), c1], [pshow(r2), c2]]);
        const C1 = (v) => `${X} ${GE} ${iq(v)}`, C2 = (v) => `${X} ${LT} ${iq(v)}`;
        const cands = [[pieces(i1, C1(ft), i2, C2(ft)), true], [pieces(i1, C1(t), i2, C2(t)), false], [pieces(i2, C1(ft), i1, C2(ft)), false], [pieces(P(qneg(p1[0]), p1[1]), C1(ft), P(qneg(p2[0]), p2[1]), C2(ft)), false]];
        if (t === ft) return null;
        const list = d.shuffle(cands);
        return oneOf(`함수 ${FN}(${X}) = ${pw([[pshow(p1), C1(t)], [pshow(p2), C2(t)]])}의 역함수를 바르게 나타낸 것은?`, lines(list.map((r, i) => tag(LAB[i]) + r[0])), list.map((r) => r[1]),
          `${is(at(FN, t), ft)}이고 ${FN}는 증가하므로 ${nb(`${X} ${GE} ${iq(t)}`)}에서 ${FN}의 값은 ${nb(`${Y} ${GE} ${iq(ft)}`)}, ${nb(`${X} ${LT} ${iq(t)}`)}에서는 ${nb(`${Y} ${LT} ${iq(ft)}`)}이다. 조각마다 역함수를 구하고 범위도 ${X}와 ${Y}를 바꾸면 ${nb(`${X} ${GE} ${iq(ft)}`)}일 때 ${pshow(i1)}, ${nb(`${X} ${LT} ${iq(ft)}`)}일 때 ${pshow(i2)}이다.`);
      }),
      T('invx-simplify', '역함수 성질로 줄여 셈하는 합성값', '②35', (d, n) => {
        const f = P(nz(d, -6, 6), pm(d) * d.int(2, 3)), g = P(nz(d, -6, 6), nz(d, -3, 3));
        if (n === 0) {
          const form = d.bool(), k = d.int(-4, 5);
          if (form) {
            // (g ∘ (f ∘ g)⁻¹ ∘ g)(k) = f⁻¹(g(k))
            const gk = vi(g, k), v = qdiv(qsub(Q(gk), f[0]), f[1]);
            if (!isInt(v)) return null;
            return N(`두 함수 ${fdef(FN, f)}, ${fdef(GN, g)}에 대하여 ${nb(`(${GN} ∘ (${FN} ∘ ${GN})${sup(MINUS + '1')} ∘ ${GN})(${iq(k)})`)}의 값은?`, fl(v), { signed: true,
              explain: `${is(nb(`(${FN} ∘ ${GN})${sup(MINUS + '1')}`), nb(`${iv(GN)} ∘ ${iv(FN)}`))}이므로 ${is(nb(`${GN} ∘ (${FN} ∘ ${GN})${sup(MINUS + '1')} ∘ ${GN}`), nb(`${GN} ∘ ${iv(GN)} ∘ ${iv(FN)} ∘ ${GN}`))} = ${nb(`${iv(FN)} ∘ ${GN}`)}이다. ${is(at(GN, k), gk)}이고 ${is(at(iv(FN), gk), fl(v))}이다.`,
              facts: { value: `(${pe(g, k)}-${jn(f[0])})/${jn(f[1])}`, unseen: [1], rule: 'simplify-1' }
            });
          }
          // (f ∘ (f ∘ g⁻¹)⁻¹ ∘ f)(k) = f(g(k))
          const v = vi(f, vi(g, k));
          return N(`두 함수 ${fdef(FN, f)}, ${fdef(GN, g)}에 대하여 ${nb(`(${FN} ∘ (${FN} ∘ ${iv(GN)})${sup(MINUS + '1')} ∘ ${FN})(${iq(k)})`)}의 값은?`, v, { signed: true,
            explain: `${is(nb(`(${FN} ∘ ${iv(GN)})${sup(MINUS + '1')}`), nb(`${GN} ∘ ${iv(FN)}`))}이므로 ${is(nb(`${FN} ∘ (${FN} ∘ ${iv(GN)})${sup(MINUS + '1')} ∘ ${FN}`), nb(`${FN} ∘ ${GN} ∘ ${iv(FN)} ∘ ${FN}`))} = ${nb(`${FN} ∘ ${GN}`)}이다. ${is(cat([FN, GN], k), at(FN, vi(g, k)))} = ${iq(v)}이다.`,
            facts: { value: pe(f, pe(g, k)), unseen: [1], rule: 'simplify-2' }
          });
        }
        // (f⁻¹ ∘ g⁻¹ ∘ f)(a) = k → f(a) = (g ∘ f)(k)
        const k = d.int(-3, 4), gfk = vi(pComp(g, f), k), a = qdiv(qsub(Q(gfk), f[0]), f[1]);
        if (!isInt(a)) return null;
        return N(`두 함수 ${fdef(FN, f)}, ${fdef(GN, g)}에 대하여 ${jw(is(nb(`(${iv(FN)} ∘ ${iv(GN)} ∘ ${FN})(${A})`), k), '을/를')} 만족시키는 상수 ${jw(A, '의')} 값은?`, fl(a), { signed: true,
          explain: `${is(nb(`${iv(FN)} ∘ ${iv(GN)}`), nb(`(${GN} ∘ ${FN})${sup(MINUS + '1')}`))}이므로 ${is(nb(`(${GN} ∘ ${FN})${sup(MINUS + '1')}(${FN}(${A}))`), k)}, 곧 ${is(at(FN, A), cat([GN, FN], k))} = ${iq(gfk)}이다. ${nb(`${pAt(f, V('a'))} = ${iq(gfk)}`)}에서 ${is(A, fl(a))}이다.`,
          facts: { value: `(${pe(g, pe(f, k))}-${jn(f[0])})/${jn(f[1])}`, unseen: [1], rule: 'simplify-3' }
        });
      }, { count: 2 }),
      T('invx-find-func', '역함수·합성의 조건으로 함수 구하기', '②36', (d, n) => {
        if (n === 0) {
          // f, (f ∘ g⁻¹)(x)를 주고 g(x)
          const m = pm(d) * d.int(2, 4), nn = nz(d, -7, 7), g = P(nn, m), kk = nz(d, -3, 3), b = nz(d, -6, 6), f = P(b, kk * m), fgi = pComp(f, invL(g));
          if (!linOK(fgi)) return null;
          return linA(`두 함수 ${fdef(FN, f)}, ${GN}에 대하여 ${is(nb(`(${FN} ∘ ${iv(GN)})(${X})`), pshow(fgi))}일 때, ${jw(at(GN, X), '을/를')} 구하시오.`, g, {
            explain: `${is(at(FN, at(iv(GN), X)), pshow(fgi))}이므로 ${nb(`${cf(kk * m)}${at(iv(GN), X)} ${sgn(b)} = ${pshow(fgi)}`)}, ${is(at(iv(GN), X), pshow(invL(g)))}이다. ${is(nb(`(${iv(GN)})${sup(MINUS + '1')}`), GN)}이므로 ${is(Y, pshow(invL(g)))}의 역함수를 구하면 ${is(at(GN, X), pshow(g))}이다.`,
            facts: { calc: [[`${jn(f[1])}/${jn(fgi[1])}`, 0], [`0-${jn(f[1])}/${jn(fgi[1])}*(${jn(fgi[0])}-${jn(b)})/${jn(f[1])}`, 1]], unseen: [0, 1], rule: 'find-g' }
          });
        }
        if (n === 1) {
          // g, (f ∘ g)(x)를 주고 f⁻¹(k) = g(x0)
          const g = P(nz(d, -6, 6), nz(d, -3, 3)), fg = P(nz(d, -7, 7), nz(d, -5, 5)), x0 = d.int(-3, 4), k = vi(fg, x0), v = vi(g, x0);
          if (Math.abs(k) > 40) return null;
          return N(`두 함수 ${FN}, ${GN}에 대하여 ${fdef(GN, g)}, ${is(cx2([FN, GN]), pshow(fg))}일 때, ${at(iv(FN), k)}의 값은? (단, ${FN}의 역함수가 존재한다.)`, v, { signed: true,
            explain: `${is(at(FN, at(GN, X)), pshow(fg))}이므로 ${is(at(GN, X), at(iv(FN), pshow(fg)))}이다. ${jw(is(pshow(fg), k), '이/가')} 되는 ${jw(is(X, x0), '을/를')} 넣으면 ${is(at(iv(FN), k), at(GN, x0))} = ${iq(v)}이다.`,
            facts: { value: pe(g, `(${jn(k)}-${jn(fg[0])})/${jn(fg[1])}`), unseen: [1], rule: 'find-finv' }
          });
        }
        // (g⁻¹ ∘ f⁻¹ ∘ h)(x) = f(x) → h = f ∘ g ∘ f
        const f = P(d.int(-4, 4), pm(d) * d.int(2, 3)), g = P(nz(d, -6, 6), nz(d, -3, 3)), h = pComp(f, pComp(g, f));
        if (!linOK(h) || Math.abs(fl(h[0])) > 99 || Math.abs(fl(h[1])) > 99) return null;
        return linA(`세 함수 ${fdef(FN, f)}, ${fdef(GN, g)}, ${HN}에 대하여 ${is(nb(`(${iv(GN)} ∘ ${iv(FN)} ∘ ${HN})(${X})`), at(FN, X))}가 성립할 때, ${jw(at(HN, X), '을/를')} 구하시오.`, h, {
          explain: `${is(nb(`${iv(GN)} ∘ ${iv(FN)}`), nb(`(${FN} ∘ ${GN})${sup(MINUS + '1')}`))}이므로 ${is(nb(`(${FN} ∘ ${GN})${sup(MINUS + '1')}(${HN}(${X}))`), at(FN, X))}, 곧 ${is(at(HN, X), nb(`(${FN} ∘ ${GN})(${FN}(${X}))`))}이다. ${is(cx2([FN, GN]), pshow(pComp(f, g)))}에 ${jw(is(X, pshow(f)), '을/를')} 넣으면 ${is(at(HN, X), pshow(h))}이다.`,
          facts: { calc: [[`${jn(f[1])}*${jn(g[1])}*${jn(f[1])}`, 0], [`${jn(f[1])}*(${jn(g[1])}*${jn(f[0])}+${jn(g[0])})+${jn(f[0])}`, 1]], unseen: [0, 1], rule: 'find-h' }
        });
      }, { count: 3 }),
      T('invx-fig-g', 'f⁻¹ ∘ g = f에서 계수', '②37', (d) => {
        const p = d.pick([2, 3, -2, -3]), a = nz(d, -5, 5), q = a * (p + 1);
        return vals(`두 함수 ${nb(`${FN}(${X}) = ${tm(p, X)} + ${A}`)}, ${nb(`${GN}(${X}) = ${BB}${X} ${sgn(q)}`)}에 대하여 ${is(nb(`${iv(FN)} ∘ ${GN}`), FN)}가 성립할 때, 상수 ${A}, ${BB}의 값은?`, [[A, a], [BB, p * p]], {
          explain: `${is(nb(`${iv(FN)} ∘ ${GN}`), FN)}의 양쪽 앞에 ${jw(FN, '을/를')} 합성하면 ${is(GN, nb(`${FN} ∘ ${FN}`))}이다. ${is(cx2([FN, FN]), nb(`${cf(p)}(${tm(p, X)} + ${A}) + ${A}`))} = ${nb(`${p * p}${X} + ${tm(p + 1, A)}`)}이므로 ${is(BB, p * p)}, ${nb(`${tm(p + 1, A)} = ${iq(q)}`)}에서 ${is(A, a)}이다.`,
          facts: { calc: [[`${jn(q)}/(${jn(p)}+1)`, 0], [`${jn(p)}*${jn(p)}`, 1]], unseen: [1, Math.abs(p)] }
        });
      }),
      T('invx-identity-g', '모든 h에 대하여 h ∘ g ∘ f = h일 때 g', '②38', (d) => {
        const p = pm(d) * d.int(2, 5), q = nz(d, -8, 8), k = nz(d, -6, 9), v = Q(k - q, p);
        if (isInt(v)) return null;
        return ansV(`함수 ${jw(fdef(FN, P(q, p)), '과/와')} 함수 ${jw(GN, '이/가')} 실수 전체의 집합에서 정의된 모든 함수 ${jw(HN, '에')} 대하여 ${is(nb(`(${HN} ∘ ${GN} ∘ ${FN})(${X})`), at(HN, X))}를 만족시킬 때, ${at(GN, k)}의 값은?`, v, 'frac', {
          explain: `${jw(is(nb(`${HN} ∘ (${GN} ∘ ${FN})`), HN), '이/가')} 모든 ${HN}에서 성립하므로 ${nb(`${GN} ∘ ${FN}`)}는 항등함수이고, ${FN}는 일대일대응이므로 ${is(GN, iv(FN))}이다. ${is(at(GN, k), A)}라 하면 ${is(at(FN, A), k)}이므로 ${is(A, tx(v))}이다.`,
          facts: { value: `(${jn(k)}-${jn(q)})/${jn(p)}` }
        });
      }),
      T('invx-identity-comp', '합성이 항등함수가 되는 조건', '②40', (d, n) => {
        if (n === 0) {
          // X = {p1, p2}, f = ±x + s, g = x² + bx + c, g∘f 가 X의 항등함수
          const sg = pm(d), s = nz(d, -4, 5), [p1, p2] = d.until(() => [d.int(-3, 4), d.int(-3, 4)], ([u, v]) => u < v), u1 = sg * p1 + s, u2 = sg * p2 + s;
          const b = (p1 - p2 - (u1 * u1 - u2 * u2)) / (u1 - u2), c = p1 - u1 * u1 - b * u1;
          if (!Number.isInteger(b) || !Number.isInteger(c) || b === 0 || c === 0) return null;
          return vals(`집합 ${jw(is(SX, setOf([p1, p2])), '을/를')} 정의역으로 하는 함수 ${jw(fdef(FN, P(s, sg)), '과/와')}, ${FN}의 치역을 정의역으로 하고 ${jw(SX, '을/를')} 공역으로 하는 함수 ${nb(`${GN}(${X}) = ${X2} + ${BB}${X} + ${CC}`)}가 있다. 함수 ${nb(`${GN} ∘ ${FN} : ${SX} → ${SX}`)}가 항등함수일 때, 상수 ${BB}, ${CC}의 값은?`, [[BB, b], [CC, c]], {
            explain: `${nb(`${GN} ∘ ${FN}`)}가 항등함수이므로 ${is(cat([GN, FN], p1), p1)}, ${is(cat([GN, FN], p2), p2)}이다. ${is(at(FN, p1), u1)}, ${is(at(FN, p2), u2)}이므로 ${is(at(GN, u1), p1)}, ${is(at(GN, u2), p2)}이다. ${nb(`${poly([[u1, BB], [1, CC]])} = ${iq(p1 - u1 * u1)}`)}, ${jw(nb(`${poly([[u2, BB], [1, CC]])} = ${iq(p2 - u2 * u2)}`), '을/를')} 연립하면 ${is(BB, b)}, ${is(CC, c)}이다.`,
            facts: { calc: [[`(${jn(p1)}-${jn(p2)}-(${jn(u1)}*${jn(u1)}-${jn(u2)}*${jn(u2)}))/(${jn(u1)}-${jn(u2)})`, 0], [`${jn(p1)}-${jn(u1)}*${jn(u1)}-(${jn(p1)}-${jn(p2)}-(${jn(u1)}*${jn(u1)}-${jn(u2)}*${jn(u2)}))/(${jn(u1)}-${jn(u2)})*${jn(u1)}`, 1]], unseen: [Math.abs(u1), Math.abs(u2)] }
          });
        }
        const TEMPLATES = [
          { rows: [[pshow(P(-2, 1)), nb(`${X} ${GE} 3`)], [pshow(P(5, -1)), nb(`${X} ${LT} 3`)]], f: (x) => (x >= 3 ? x - 2 : 5 - x) },
          { rows: [[pshow(P(-3, 1)), nb(`${X} = 4`)], [pshow(P(1, 1)), nb(`${X} ${LT} 4`)]], f: (x) => (x === 4 ? 1 : x + 1) },
          { rows: [[pshow(P(5, -1)), nb(`${X} ${GE} 2`)], [pshow(P(3, 1)), nb(`${X} = 1`)]], f: (x) => (x >= 2 ? 5 - x : 4) },
          { rows: [[pshow(P(2, 1)), nb(`${X} ${LE} 2`)], [pshow(P(-2, 1)), nb(`${X} ${GT} 2`)]], f: (x) => (x <= 2 ? x + 2 : x - 2) }
        ];
        const tp = d.pick(TEMPLATES), xs = [1, 2, 3, 4], ginv = (y) => xs.find((x) => tp.f(x) === y), [p, q] = d.shuffle(xs).slice(0, 2);
        return M(`집합 ${is(SX, setOf(xs))}에 대하여 함수 ${nb(`${FN} : ${SX} → ${SX}`)}가 ${FN}(${X}) = ${pw(tp.rows)}이다. 함수 ${nb(`${GN} : ${SX} → ${SX}`)}에 대하여 ${nb(`${GN} ∘ ${FN}`)}가 항등함수일 때, ${at(GN, p)}, ${at(GN, q)}의 값은?`, [{ lead: at(GN, p) + ' =', answer: ginv(p) }, { lead: at(GN, q) + ' =', answer: ginv(q) }], {
          shown: `${is(at(GN, p), ginv(p))}, ${is(at(GN, q), ginv(q))}`,
          explain: `${xs.map((x) => is(at(FN, x), tp.f(x))).join(', ')}이므로 ${FN}는 일대일대응이고 ${nb(`${GN} ∘ ${FN}`)}가 항등함수이므로 ${is(GN, iv(FN))}이다. ${is(at(FN, ginv(p)), p)}, ${is(at(FN, ginv(q)), q)}이므로 ${is(at(GN, p), ginv(p))}, ${is(at(GN, q), ginv(q))}이다.`,
          facts: { calc: [[String(ginv(p)), 0], [String(ginv(q)), 1]], unseen: [ginv(p), ginv(q)] }
        });
      }, { count: 2 }),
      T('invx-meet', '일차함수와 역함수 그래프의 교점', '②43', (d) => {
        const a = d.pick([Q(2), Q(3), Q(4), Q(1, 2), Q(1, 3), Q(3, 2)]), x0 = nz(d, -6, 6), b = qmul(Q(x0), qsub(Q(1), a));
        if (!isInt(b) || b.p === 0) return null;
        return pointAns(`함수 ${fdef(FN, P(b, a))}의 그래프와 그 역함수 ${is(Y, at(iv(FN), X))}의 그래프의 교점의 좌표는?`, x0, x0, {
          explain: `${FN}는 증가하는 일차함수이므로 두 그래프의 교점은 ${is(Y, at(FN, X))}의 그래프와 직선 ${is(Y, X)}의 교점과 같다. ${is(pshow(P(b, a)), X)}에서 ${is(X, x0)}이므로 교점은 ${nb(`(${iq(x0)}, ${iq(x0)})`)}이다.`,
          facts: { calc: [[`${jn(b)}*${a.q}/(${a.q}-${a.p})`, 0], [`${jn(b)}*${a.q}/(${a.q}-${a.p})`, 1]], unseen: [1] }
        });
      }),
      T('invx-both-through', '함수와 역함수 그래프가 모두 한 점을 지날 때', '②44', (d) => {
        const [p, q] = d.until(() => [nz(d, -5, 5), nz(d, -5, 5)], ([u, v]) => u !== v && u + v !== 0);
        return vals(`일차함수 ${nb(`${FN}(${X}) = ${A}${X} + ${BB}`)}에 대하여 ${is(Y, at(FN, X))}의 그래프와 그 역함수 ${is(Y, at(iv(FN), X))}의 그래프가 모두 점 ${jw(nb(`(${iq(p)}, ${iq(q)})`), '을/를')} 지날 때, 상수 ${A}, ${BB}의 값은?`, [[A, -1], [BB, p + q]], {
          explain: `${is(at(FN, p), q)}이고, 역함수의 그래프가 ${jw(nb(`(${iq(p)}, ${iq(q)})`), '을/를')} 지나므로 ${is(at(iv(FN), p), q)}, 곧 ${is(at(FN, q), p)}이다. 두 식을 연립하면 ${is(A, -1)}, ${is(BB, p + q)}이다.`,
          facts: { calc: [[`(${jn(p)}-${jn(q)})/(${jn(q)}-${jn(p)})`, 0], [`${jn(p)}+${jn(q)}`, 1]] }
        });
      }),
      T('invx-quad-meet', '정의역을 제한한 이차함수와 역함수 그래프의 교점으로 상수', '②45', (d) => {
        const h = d.int(-3, 1), t = h + d.int(1, 4), a = t - t * t + 2 * h * t, f = P(a, -2 * h, 1);   // f = x² − 2hx + a (x ≥ h)
        if (t === 0) return null;
        return N(`함수 ${nb(`${FN}(${X}) = ${poly([[1, X2], [-2 * h, X]])} + ${A}`)} (${nb(`${X} ${GE} ${iq(h)}`)})의 그래프와 그 역함수 ${is(Y, at(iv(FN), X))}의 그래프의 교점의 ${X}좌표가 ${iq(t)}일 때, 상수 ${jw(A, '의')} 값은?`, a, { signed: true,
          explain: `${nb(`${X} ${GE} ${iq(h)}`)}에서 ${FN}는 증가하므로 두 그래프의 교점은 ${is(Y, at(FN, X))}의 그래프와 직선 ${is(Y, X)}의 교점이다. 따라서 ${is(at(FN, t), t)}, ${nb(`${iq(t * t - 2 * h * t)} + ${A} = ${iq(t)}`)}에서 ${is(A, a)}이다.`,
          facts: { value: `${jn(t)}-${jn(t)}*${jn(t)}${h ? (h > 0 ? '+' : '-') + Math.abs(2 * h) + '*' + jn(t) : ''}`, unseen: [Math.abs(t), 1] }
        });
      }),
      T('invx-graph-pick', '역함수의 그래프 고르기', '②50', (d) => {
        // 절편이 모두 원점에서 2칸 넘게 떨어지게(이름표가 O 와 붙지 않게): 기울기 ±2 이면 x절편 ±2, 기울기 ±1/2 이면 x절편 ±4
        const c = d.until(() => { const a = asQ(d.pick([2, -2, Q(1, 2), Q(-1, 2)])), xi = pm(d) * (Math.abs(fl(a)) === 2 ? 2 : 4); return { a, xi, b: qmul(qneg(a), Q(xi)) }; }, () => true);
        const f = P(c.b, c.a), g = invL(f), lines4 = [[g, true], [P(qneg(f[0]), qneg(f[1])), false], [f, false], [P(f[0], qneg(f[1])), false]];
        const seen = new Set(), list = d.shuffle(lines4.filter(([p]) => { const k0 = pshow(p); if (seen.has(k0)) return false; seen.add(k0); return true; }));
        if (list.length < 4) return null;
        // O 는 직선과 y절편 이름표를 피하는 쪽에: 올라가는 직선이 y축과 −2 에서 만나면 이름표가 O 자리로 올라오므로 O 를 오른쪽에 두고 이름표는 점 옆(조금 위)에 붙인다.
        const figOf = (p, i) => {
          const xi = qdiv(qneg(p[0]), p[1]), yi = p[0];
          return gfig({ x: [-4.8, 4.8], y: [-4.8, 4.8], small: true, oRight: (fl(p[1]) > 0) === (fl(yi) > 0) || (fl(p[1]) > 0 && fl(yi) === -2), curves: [{ pts: samp((x) => fl(pv(p, x)), -4.8, 4.8, 4) }], dots: [{ x: fl(xi), y: 0 }, { x: 0, y: fl(yi) }],
            xnums: [{ v: fl(xi), t: plain(xi), dx: fl(p[1]) > 0 ? 4 : -4 }], ynums: [fl(p[1]) > 0 && fl(yi) === -2 ? { v: -2, t: plain(yi), dy: 2 } : { v: fl(yi), t: plain(yi), above: fl(p[1]) > 0, below: fl(p[1]) < 0 }],
            say: `그래프 ${LAB[i]}: x축과 ${plain(xi)}인 점, y축과 ${plain(yi)}인 점에서 만나는 직선.` });
        };
        return oneOf(`함수 ${is(Y, pshow(f))}의 역함수의 그래프는?`, picks(list.map(([p], i) => figOf(p, i))), list.map((r) => r[1]),
          `${is(Y, pshow(f))}의 그래프는 ${X}축과 ${plain(Q(c.xi))}인 점, ${Y}축과 ${plain(c.b)}인 점에서 만난다. 역함수의 그래프는 직선 ${is(Y, X)}에 대하여 대칭이므로 ${X}축과 ${plain(c.b)}인 점, ${Y}축과 ${plain(Q(c.xi))}인 점에서 만나는 직선 ${is(Y, pshow(g))}이다.`);
      }),
      T('invx-temperature', '온도 단위 바꾸기의 역함수', '②51', (d) => {
        const c0 = d.int(-6, 20) * 5, f0 = c0 * 9 / 5 + 32;
        return N(`화씨온도 ${X} °F를 섭씨온도 ${Y} °C로 바꾸는 식은 ${is(Y, nb(`${frac(5, 9)}(${X} ${MINUS} 32)`))}이다. 이 함수의 역함수를 써서 섭씨온도 ${iq(c0)} °C를 화씨온도로 나타내면 몇 °F인가?`, f0, { signed: true, unit: '°F',
          explain: `${is(Y, nb(`${frac(5, 9)}(${X} ${MINUS} 32)`))}에서 ${is(X, nb(`${frac(9, 5)}${Y} + 32`))}이므로 섭씨를 화씨로 바꾸는 식은 ${is(Y, nb(`${frac(9, 5)}${X} + 32`))}이다. ${isj(X, c0, '을/를')} 넣으면 ${iq(f0)} °F이다.`,
          facts: { value: `${jn(c0)}*9/5+32` }
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
