// 고등학교 미적분Ⅰ Ⅱ-2 도함수의 활용(2) — 실력 문항. 틀·도구와 싣는 기준, 뺀 것과 까닭은 11-2-5a.js 머리에 있다. ref: ①n = 기본꼴_1의 n번.
//
// 이 단원에서 흔히 잘못 아는 것
//  - 극댓값이 곧 최댓값이라고 여긴다(닫힌구간에서는 끝값이 더 클 수 있다).
//  - 속도의 최댓값과 속력(|속도|)의 최댓값을 같게 본다. 속도가 줄곧 음수인 구간에서는 속도의 최솟값이 속력의 최댓값이 된다.
//  - 두 점 사이의 거리를 위치의 차 그대로 두고 최대를 찾는다(거리는 |f − g|이고, 가장 멀 때는 두 점의 속도가 같다).
//  - y = |f(x)| 의 그래프를 그릴 때 x축 아래의 극솟값이 위로 올라가 봉우리가 된다는 것을 놓친다.
//  - 한 점에서 그은 접선의 개수를 접점이 아닌 곡선과 직선의 교점으로 센다.
//
// 실력에 둔 기준: ① 문제의 상황·조건에 함정이 있어 배운 뜻을 정확히 대야 풀리는 것, ② 세 단계 넘게 이어 생각해야 풀리는 것.
//  - ①27(|f(x)|와 y = n의 교점의 개수)·①28(기함수와 |f(x)| = c의 실근의 개수)는 사용자가 실력으로 정했다.
//  - ①10(조건으로 삼차함수를 정한 뒤 구간의 최댓값), ①18(겉넓이가 일정한 원기둥의 r : h), ①29(도함수의 그래프와 근의 부호 조건),
//    ①30(한 점에서 그은 세 접선), ①45(두 점 사이의 거리가 가장 큰 순간)는 셈·판단을 세 번 넘게 잇는다.
//  - ①44(속력의 최댓값)는 속도와 속력의 뜻을 갈라야 풀리는 함정 문항이다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, N, M, C } = B.kit;
  const { MINUS, V, sup, nb } = B.kit.mid;
  const { jh, df, plot, qAns } = B.kit.hs;
  const { S8, S9, S10, X, TT, H, near, toQ, qt, js, qj, sgnT, padd, pval, pder, pint, fromRoots, intCoef, ptext, pjs, fx, fIs, facText, closed, cubicOf, kindAt, endClause, conds } = B.kit.u25x;
  // k 번 미분한 다항식에 t 를 넣는 검사 식(곱하는 수 i, i(i − 1) 은 글에 없는 수)
  const dvjs = (a, t, k) => a.map((c, i) => { if (near(c, 0) || i < k) return ''; const mul = k === 1 ? i : i * (i - 1), pow = i - k; return `${mul === 1 ? '' : mul + '*'}${js(c)}${pow === 0 ? '' : '*' + t + (pow > 1 ? '**' + pow : '')}`; }).filter(Boolean).join('+') || '0';
  const xIs = (a) => nb(`${X} = `) + ptext(a, TT);

  const hard = [
    H('hard-cubic-max', '조건으로 정한 삼차함수의 닫힌구간에서의 최댓값', '①10', (d) => {
      // f(x) = (x − p)²(x − r): ㈎ 점 (p, 0)에서 x축에 접한다, ㈏ f(s) = v
      const p = d.int(-2, 2), r = d.pick([-4, -3, -2, -1, 0, 1, 2, 3, 4].filter((v) => v !== p && (p + 2 * v) % 3 === 0)), s = d.pick([-3, -2, -1, 0, 1, 2, 3].filter((v) => v !== p && v !== r));
      if (r == null || s == null) return null;
      const f = fromRoots([p, p, r]), v = pval(f, s), c2 = (p + 2 * r) / 3, crits = [p, c2].sort((u, w) => u - w);
      const L = Math.min(p, c2) - d.int(1, 2), R = Math.max(p, c2) + d.int(1, 2), pts = [L].concat(crits, [R]), vals = pts.map((x) => pval(f, x)), mx = Math.max(...vals), at = pts[vals.indexOf(mx)];
      if (near(v, 0) || Math.abs(mx) > 200 || vals.filter((u) => near(u, mx)).length > 1) return null;
      const rx = `(${s}-${js(v)}/(${s}-${js(p)})**2)`;
      return N(`최고차항의 계수가 1인 삼차함수 ${fx()}가 다음 조건을 만족시킬 때, 닫힌구간 ${closed(L, R)}에서 함수 ${fx()}의 최댓값은?`, mx, {
        signed: true,
        figure: conds([`곡선 ${nb(`${V('y')} = ${fx()}`)}는 점 ${nb(`(${qt(p)}, 0)`)}에서 x축에 접한다.`, nb(`${fx('f', qt(s))} = ${qt(v)}`)]),
        explain: `㈎에서 ${nb(`${fx('f', qt(p))} = 0`)}, ${nb(`${df('f')}(${qt(p)}) = 0`)}이므로 ${nb(`${fx()} = ${facText(1, [p, p])}(${X} ${MINUS} ${V('r')})`)}로 놓을 수 있다. ㈏에서 ${jh(V('r'), '을/를')} 구하면 ${nb(`${V('r')} = ${qt(r)}`)}이다. `
          + `${nb(`${df('f')}(${X}) = ${facText(3, [p, c2])}`)}이므로 ${jh(pts.map((x) => nb(`${fx('f', qt(x))} = ${qt(pval(f, x))}`)).join(', '), '을/를')} 비교하면 최댓값은 ${qt(mx)}이다.`,
        facts: { calc: [[`(${js(at)}-${js(p)})**2*(${js(at)}-${rx})`, 0]], derived: [Math.abs(c2), 2] } });
    }, { standard: S8 }),
    H('hard-cyl-ratio', '겉넓이가 일정한 원기둥의 부피가 최대일 때 반지름과 높이의 비', '①18', (d) => {
      const opts = ['1 : 2', '1 : 1', '2 : 1', '1 : 3', '2 : 3'], rows = d.shuffle(opts.map((t) => ({ t, ok: t === '1 : 2' })));
      const r = V('r'), h = V('h'), a = V('a');
      return C(`겉넓이가 ${jh(a, '으로/로')} 일정한 원기둥의 밑면의 반지름의 길이를 ${r}, 높이를 ${jh(h, '이라/라')} 하자. 원기둥의 부피가 최대일 때, ${nb(`${r} : ${h}`)}는?`, rows.map((x) => x.t), rows.findIndex((x) => x.ok), {
        explain: `${nb(`${a} = 2π${r}${sup(2)} + 2π${r}${h}`)}에서 ${nb(`${h} = ${frac(a, `2π${r}`)} ${MINUS} ${r}`)}이므로 ${nb(`V(${r}) = π${r}${sup(2)}${h} = ${frac(a, 2)}${r} ${MINUS} π${r}${sup(3)}`)}이다. ${nb(`V′(${r}) = ${frac(a, 2)} ${MINUS} 3π${r}${sup(2)} = 0`)}에서 ${nb(`${a} = 6π${r}${sup(2)}`)}일 때 최대이고, 이때 ${nb(`${h} = ${frac(`6π${r}${sup(2)}`, `2π${r}`)} ${MINUS} ${r} = 2${r}`)}이므로 ${nb(`${r} : ${h} = 1 : 2`)}이다.`,
        facts: { truth: rows.map((x) => x.ok), want: true } });
    }, { standard: S8 }),
    H('hard-abs-n', '함수 y = |f(x)|의 그래프와 직선 y = n의 교점의 개수', '①27', (d) => {
      const k = d.pick([1, 2]), p = d.int(-3, 1), q = d.int(p + 1, 3);
      if ((3 * k * (p + q)) % 2) return null;
      const f = padd(cubicOf(k, p, q, 0), [d.int(-9, 9)]), Mx = pval(f, p), mn = pval(f, q);
      if (!intCoef(f) || !(Mx > 0 && mn < 0) || Mx === -mn || Mx > 60 || -mn > 60 || near(f[0], 0)) return null;
      const lo = Math.min(Mx, -mn), hi = Math.max(Mx, -mn);
      if (lo < 3 || hi - lo < 3) return null;
      const g = (n) => (n < lo ? 6 : n === lo ? 5 : n < hi ? 4 : n === hi ? 3 : 2);
      const cand = [d.int(1, lo - 1), lo, d.int(lo + 1, hi - 1), hi, hi + d.int(1, 9)];
      const pick = d.shuffle([0, 1, 2, 3, 4]).slice(0, 3).sort((u, w) => u - w).map((i) => cand[i]);
      return M(`함수 ${fIs(f)}에 대하여 함수 ${nb(`${V('y')} = |${fx()}|`)}의 그래프와 직선 ${nb(`${V('y')} = ${V('n')}`)}의 교점의 개수를 ${jh(nb(`${fx('g', V('n'))}`), '이라/라')} 할 때, ${pick.map((n) => fx('g', n)).join(', ')}의 값은? ${nb(`(단, ${V('n')}은 자연수)`)}`,
        pick.map((n) => ({ label: fx('g', n), answer: g(n) })), {
          explain: `${nb(`${df('f')}(${X}) = ${facText(3 * k, [p, q])}`)}이므로 ${fx()}는 극댓값 ${qt(Mx)}, 극솟값 ${qj(mn, '을/를')} 갖는다. ${nb(`${V('y')} = |${fx()}|`)}의 그래프는 x축 아래 부분을 접어 올리므로 높이가 ${lo}, ${hi}인 두 봉우리가 생긴다. `
            + `직선 ${nb(`${V('y')} = ${V('n')}`)}과의 교점은 ${nb(`${V('n')} &lt; ${lo}`)}이면 6개, ${nb(`${V('n')} = ${lo}`)}이면 5개, ${nb(`${lo} &lt; ${V('n')} &lt; ${hi}`)}이면 4개, ${nb(`${V('n')} = ${hi}`)}이면 3개, ${nb(`${V('n')} &gt; ${hi}`)}이면 2개이다.`,
          facts: { check: { poly: f, crits: [p, q], n: pick, g: pick.map(g) } } });
    }, { standard: S9 }),
    H('hard-odd-abs', '기함수 조건과 |f(x)| = c의 실근의 개수로 삼차함수 정하기', '①28', (d) => {
      // f(x) = x³ − kx, |f(x)| = c 가 서로 다른 4개의 실근 ⇔ 극댓값이 c: k = 3t², c = 2t³
      const t = d.pick([1, 2]), c = 2 * t ** 3, k = 3 * t * t, s = d.pick([-3, -1, 1, 3, 4].filter((v) => v ** 3 - k * v !== 0 && Math.abs(v) !== t)), ans = s ** 3 - k * s;
      return N(`최고차항의 계수가 1인 삼차함수 ${fx()}가 다음 조건을 만족시킬 때, ${fx('f', qt(s))}의 값은?`, ans, {
        signed: true,
        figure: conds([`모든 실수 ${X}에 대하여 ${nb(`${fx('f', MINUS + X)} = ${MINUS}${fx()}`)}이다.`, `방정식 ${nb(`|${fx()}| = ${c}`)}${B.kit.josa(c, '이/가').slice(String(c).length)} 서로 다른 4개의 실근을 갖는다.`]),
        explain: `㈎에서 ${fx()}는 짝수 차수의 항이 없으므로 ${nb(`${fx()} = ${X}${sup(3)} ${MINUS} ${V('k')}${X}`)}로 놓을 수 있다. ${nb(`${V('k')} ≤ 0`)}이면 ${fx()}가 증가하여 실근이 2개뿐이므로 ${nb(`${V('k')} &gt; 0`)}이다. `
          + `${nb(`${V('y')} = |${fx()}|`)}의 그래프와 직선 ${nb(`${V('y')} = ${c}`)}의 교점이 4개이려면 극댓값이 ${c}이어야 하므로 ${nb(`${V('k')} = ${k}`)}이다. 따라서 ${nb(`${fx('f', qt(s))} = ${qt(ans)}`)}이다.`,
        facts: { calc: [[`${js(s)}**3-${k}*${js(s)}`, 0]], derived: [k, 3] } });
    }, { standard: S9 }),
    H('hard-fprime-sign', '도함수의 그래프와 근의 부호 조건으로 상수 구하기', '①29', (d) => {
      // f′(x) = 4x(x − α)(x − γ), α < 0 < γ, f(0) = k: 극소 x = α, γ, 극대 x = 0
      const al = -d.int(1, 2), ga = d.int(2, 3), neg = d.bool();
      const base = pint(fromRoots([al, 0, ga], 4)), fa = pval(base, al), fg = pval(base, ga);
      // neg: 양의 근 둘, 음의 근 하나 → x = α 에서 x축에 접한다(k = −f₀(α)), f(γ) < 0
      const k = neg ? -fa : -fg, f = padd(base, [k]);
      if (!(k > 0) || !(neg ? pval(f, ga) < 0 : pval(f, al) < 0)) return null;
      const xs = [al, 0, ga], lo = al - 1, hi = ga + 0.9;
      let ymin = 0, ymax = 0;
      for (let i = 0; i <= 100; i += 1) { const x = al - 0.5 + (ga - al + 1) * i / 100, v = pval(pder(f), x); ymin = Math.min(ymin, v); ymax = Math.max(ymax, v); }
      const sp = ymax - ymin, ux = (230 - 46) / (hi - lo);
      const figure = plot({ x: [lo, hi], y: [ymin - 0.25 * sp, ymax + 0.25 * sp], w: 230, ys: 140 / (1.5 * sp * ux), xt: [al, ga], curves: [{ f: (x) => pval(pder(f), x), name: "y=f'(x)" }] });
      return qAns(`최고차항의 계수가 1인 사차함수 ${fx()}의 도함수 ${nb(`${V('y')} = ${df('f')}(${X})`)}의 그래프가 그림과 같다. ${nb(`${fx('f', 0)} = ${V('k')}`)}일 때, 방정식 ${nb(`${fx()} = 0`)}이 ${neg ? '서로 다른 두 개의 양의 근과 한 개의 음의 근' : '서로 다른 두 개의 음의 근과 한 개의 양의 근'}을 갖도록 하는 실수 ${V('k')}의 값은?`, toQ(k), {
        signed: true, figure,
        explain: `${nb(`${df('f')}(${X}) = ${facText(4, xs)}`)}이므로 ${nb(`${fx()} = `)}${ptext(base)} + ${V('k')}이고 ${fx()}는 ${nb(`${X} = ${qt(al)}`)}, ${nb(`${X} = ${qt(ga)}`)}에서 극소, ${nb(`${X} = 0`)}에서 극대이다. `
          + `${neg ? '음의 근이 하나뿐이려면 그래프가 y축의 왼쪽에서 x축에 접해야' : '양의 근이 하나뿐이려면 그래프가 y축의 오른쪽에서 x축에 접해야'} 하므로 ${nb(`${fx('f', qt(neg ? al : ga))} = ${qt(neg ? fa : fg)} + ${V('k')} = 0`)}, 곧 ${nb(`${V('k')} = ${qt(k)}`)}이다. 이때 다른 극솟값은 음수이고 극댓값 ${V('k')}는 양수라 조건을 만족시킨다.`,
        facts: { value: neg ? `-(${js(al)}**4-4/3*(${js(al)}+${ga})*${js(al)}**3+2*${js(al)}*${ga}*${js(al)}**2)` : `-(${ga}**4-4/3*(${js(al)}+${ga})*${ga}**3+2*${js(al)}*${ga}*${ga}**2)`, derived: [2, 3, 4] } });
    }, { standard: S9 }),
    H('hard-tangents', '한 점에서 곡선에 서로 다른 세 접선을 그을 조건', '①30', (d) => {
      // f(x) = x³ + bx² + cx (b = −3m), 점 (s, k): 접점 t 에 대하여 k = G(t) = −2t³ + (3s − b)t² + 2bst + cs, G 의 극점은 t = s, t = m
      const m = d.int(-2, 2), b = -3 * m, c = d.int(-9, 9), s = d.pick([-2, -1, 0, 1, 2, 3].filter((v) => v !== m));
      const f = [0, c, b, 1], G = [c * s, 2 * b * s, 3 * s - b, -2], g1 = pval(f, s), g2 = pval(G, m), lo = Math.min(g1, g2), hi = Math.max(g1, g2);
      if (near(f[1], 0) && near(f[2], 0)) return null;
      if (Math.abs(lo) > 99 || Math.abs(hi) > 99) return null;
      const Gm = `(-2)*(${js(-b)}/3)**3+(3*${js(s)}-(${js(b)}))*(${js(-b)}/3)**2+2*${js(b)}*${js(s)}*(${js(-b)}/3)+${js(c)}*${js(s)}`;
      const exprs = g1 < g2 ? [pjs(f, js(s)), Gm] : [Gm, pjs(f, js(s))];
      return M(`점 ${nb(`(${qt(s)}, ${V('k')})`)}에서 곡선 ${nb(`${V('y')} = ${ptext(f)}`)}에 서로 다른 세 개의 접선을 그을 수 있도록 하는 실수 ${V('k')}의 값의 범위가 ${nb(`${V('α')} &lt; ${V('k')} &lt; ${V('β')}`)}일 때, ${V('α')}, ${V('β')}의 값은?`,
        [{ label: V('α'), answer: lo, signed: true }, { label: V('β'), answer: hi, signed: true }], {
          explain: `접점을 ${nb(`(${TT}, ${fx('f', TT)})`)}라 하면 접선 ${jh(nb(`${V('y')} = ${df('f')}(${TT})(${X} ${MINUS} ${TT}) + ${fx('f', TT)}`), '이/가')} 점 ${nb(`(${qt(s)}, ${V('k')})`)}를 지나므로 ${nb(`${V('k')} = `)}${ptext(G, TT)}이다. `
            + `이 ${TT}에 대한 방정식이 서로 다른 세 실근을 가져야 하고, 우변을 ${fx('G', TT)}라 하면 ${nb(`G′(${TT}) = ${facText(-6, [s, m], TT)}`)}이다. 극값 ${nb(`G(${qt(s)}) = ${qt(g1)}`)}, ${nb(`G(${qt(m)}) = ${qt(g2)}`)}의 사이에 ${V('k')}가 있어야 하므로 ${nb(`${qt(lo)} &lt; ${V('k')} &lt; ${qt(hi)}`)}이다.`,
          facts: { calc: [[exprs[0], 0], [exprs[1], 1]], derived: [2, 3, Math.abs(m)] } });
    }, { standard: S9 }),
    H('hard-speed-max', '주어진 구간에서 속력의 최댓값', '①44', (d) => {
      // v = 3(t − p)² − D: 구간 [L, R] 에서 줄곧 음수이고, 속력 |v| 는 t = p 에서 가장 크다.
      const p = d.int(2, 5), w = d.int(1, 2), Dd = 3 * w * w + d.int(1, 12), L = p - d.int(1, w), R = p + d.int(1, w);
      if (L < 0 || 3 * (p - L) ** 2 >= Dd || 3 * (R - p) ** 2 >= Dd) return null;
      const a = [0, 3 * p * p - Dd, -3 * p, 1];
      if (near(a[1], 0)) return null;
      return N(`수직선 위를 움직이는 점 P의 시각 ${TT}에서의 위치 ${X}가 ${xIs(a)}일 때, ${nb(`${L} ≤ ${TT} ≤ ${R}`)}에서 점 P의 속력의 최댓값은?`, Dd, {
        explain: `${nb(`${V('v')} = `)}${ptext(pder(a), TT)} = ${nb(`3(${TT} ${MINUS} ${p})${sup(2)} ${MINUS} ${Dd}`)}이다. ${nb(`${L} ≤ ${TT} ≤ ${R}`)}에서 ${jh(nb(`${MINUS}${Dd} ≤ ${V('v')} ≤ ${qt(Math.max(pval(pder(a), L), pval(pder(a), R)))}`), '으로/로')} 속도가 줄곧 음수이다. 속력은 ${nb(`|${V('v')}|`)}이므로 ${nb(`${TT} = ${p}`)}일 때 가장 크고 최댓값은 ${Dd}이다.`,
        facts: { calc: [[`-(${dvjs(a, p, 1)})`, 0]], derived: [p, 2, 3] } });
    }, { standard: S10 }),
    H('hard-gap-max', '두 점 사이의 거리가 가장 큰 순간의 두 점의 속도', '①45', (d) => {
      // d(t) = f − g = t³ − (3T/2)t² + (c1 − c2): t = T 에서 거리 |d| 가 가장 크고, 그때 f′ = g′
      const [ts, Tm] = d.pick([[1, 2], [1, 4], [2, 4], [2, 5]]), ab = 1.5 * ts, a = d.pick(ts === 1 ? [1, 0.5] : [1, 2, 1.5]), b = ab - a, diff = ab * Tm * Tm - Tm ** 3, c2 = d.int(1, 6), c1 = c2 + diff;
      const f = [c1, 0, -a, 1], g = [c2, 0, b], vp = 3 * ts * ts - 2 * a * ts, vq = 2 * b * ts;
      return M(`수직선 위를 움직이는 두 점 P, Q의 시각 ${TT}에서의 위치가 각각 ${fIs(f, 'f', TT)}, ${fIs(g, 'g', TT)}이다. 두 점 P, Q가 동시에 출발한 후 만나기 전까지 두 점 사이의 거리가 가장 큰 순간의 두 점 P, Q의 속도는?`, [{ label: 'P', answer: vp, signed: true }, { label: 'Q', answer: vq, signed: true }], {
        explain: `${nb(`${fx('h', TT)} = ${fx('f', TT)} ${MINUS} ${fx('g', TT)} = `)}${jh(ptext([c1 - c2, 0, -ab, 1], TT), '이라/라')} 하면 ${nb(`${fx('h', 0)} &lt; 0`)}이고 ${nb(`${TT} = ${Tm}`)}에서 처음 0이 되므로 두 점은 ${nb(`${TT} = ${Tm}`)}에 만난다. 그 전의 거리 ${nb(`|${fx('h', TT)}|`)}는 ${nb(`h′(${TT}) = ${facText(3, [0, ts], TT)} = 0`)}인 ${nb(`${TT} = ${ts}`)}에서 가장 크다. 이때 두 점의 속도는 ${nb(`${df('f')}(${ts}) = ${qt(vp)}`)}, ${jh(nb(`${df('g')}(${ts}) = ${qt(vq)}`), '으로/로')} 같다.`,
        facts: { calc: [[`3*${ts}**2-2*${js(a)}*${ts}`, 0], [`2*${js(b)}*${ts}`, 1]], derived: [ts, 2, 3] } });
    }, { standard: S10 })
  ];

  B.addGroup('11-2-5', { id: 'hard', title: '실력 문제', standard: S9, types: hard });
})(typeof window !== 'undefined' ? window : globalThis);
