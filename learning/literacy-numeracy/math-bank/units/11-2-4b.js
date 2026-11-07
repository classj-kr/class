// 미적분Ⅰ Ⅱ-2 도함수의 활용(1) — 뒤쪽 묶음(함수의 증가와 감소, 함수의 극대와 극소).
// 단원 틀·싣는 기준·뺀 것과 까닭은 11-2-4a.js 머리에 적었다. 도구는 B.kit.u24x(a 파일)를 쓴다.
// ref: ①n = 기본꼴_1의 n번.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, box, N, M, C, inline } = B.kit;
  const { MINUS, Q, nb, V, sup, nz, poly, grp, ineqAns, sys } = B.kit.mid;
  const { ms, plot, jh, qAns, lim } = B.kit.hs;
  const K = B.kit.u24x, { plotO } = K;
  const { S7, T, facT, stripH, X, Y, Av, Bv, Kv, Tv, Fv, FP, iq, jn, sgnT, is, pt, iv, coefT, pz, padd, pscale, psub, pmul, pval, pder, fromRoots, ptext, fIs, big, valExpr, par, vals, numAns, pick5, comboPick, GA } = K;
  const X2 = X + sup(2), X3 = X + sup(3), INF = '∞';
  const lInf = (v) => nb(`(${MINUS}${INF}, ${iq(v)}]`), rInf = (v) => nb(`[${iq(v)}, ${INF})`);   // 구간 (−∞, v], [v, ∞)
  // 계수가 c 인 항을 앞 항 뒤에 잇는 글: 「 + 3ax」「 − ax」(c 는 0이 아닌 정수, body 는 문자 글)
  const tailT = (c, body) => ` ${c < 0 ? MINUS : '+'} ${Math.abs(c) === 1 ? '' : Math.abs(c)}${body}`;
  // x 의 계수가 (e k + g) 꼴인 항을 잇는 글(e, g 가운데 0인 것은 적지 않는다)
  const linTerm = (e, g, k) => (e && g ? ` + (${poly([[e, k], [g, '']])})${X}` : e ? tailT(e, k + X) : tailT(g, X));
  const linPlus = (e, g, k) => (e && g ? ` + (${poly([[e, k], [g, '']])})` : e ? tailT(e, k) : ` ${sgnT(g)}`);   // 「 + (ek + g)」「 − 3k」「 + 9」
  const linIn = (e, g, k) => poly([[e, k], [g, '']]);

  // ── 짓기 ──
  // 극점이 α, β 인 삼차함수 s x³ + … : f′(x) = 3s(x − α)(x − β). s(α + β)가 짝수여야 계수가 정수다.
  const cubicCrit = (s, al, be, d0) => [d0, 3 * s * al * be, -3 * s * (al + be) / 2, s];
  // 극점이 α, β, γ 인 최고차항의 계수가 1인 사차함수: f′(x) = 4(x − α)(x − β)(x − γ). α + β + γ 가 3의 배수여야 한다.
  const quartCrit = (al, be, ga, d0) => { const s1 = al + be + ga, s2 = al * be + be * ga + ga * al, s3 = al * be * ga; return [d0, -4 * s3, 2 * s2, -4 * s1 / 3, 1]; };
  // 문자가 든 항을 섞은 식: terms [[계수, 글]]
  const mix = (terms) => poly(terms);
  // 부호표(증감표): xs 는 x 의 자리, signs 는 구간마다 f′ 의 부호(+1, −1), vals 는 자리마다 f 의 값 글. 칸 글을 그대로 받는다.
  const TD = 'style="padding:5px 9px"';
  function signTable(xs, signs, vals, said) {
    const cells = (list) => list.map((h) => `<td ${TD}>${h}</td>`).join('');
    const xr = [], dr = [], fr = [];
    signs.forEach((sg, i) => { xr.push('⋯'); dr.push(sg > 0 ? '+' : MINUS); fr.push(sg > 0 ? '↗' : '↘'); if (i < xs.length) { xr.push(xs[i]); dr.push('0'); fr.push(vals[i]); } });
    return `<div class="mb-table-wrap"><table class="mb-table" aria-label="${said}"><tbody><tr><th ${TD}>${X}</th>${cells(xr)}</tr><tr><th ${TD}>${FP}(${X})</th>${cells(dr)}</tr><tr><th ${TD}>${Fv}(${X})</th>${cells(fr)}</tr></tbody></table></div>`;
  }
  // 그래프 상자: 곡선 g 를 [lo, hi] 에서 훑어 y 의 범위를 잡는다(0을 넣고 여유를 둔다).
  const yRange = (g, lo, hi, pad) => { let a = 0, b = 0; for (let i = 0; i <= 240; i += 1) { const y = g(lo + (hi - lo) * i / 240); if (Number.isFinite(y)) { a = Math.min(a, y); b = Math.max(b, y); } } const m = pad == null ? 0.6 : pad; return [a - m, b + m]; };

  // ════════════════════════════════════════════════════════════════
  // 함수의 증가와 감소
  // ════════════════════════════════════════════════════════════════
  const incr = [
    T('incr-def', '이차함수의 증가·감소를 닫힌구간에서 나타내기', '①24', (d) => {
      const A = d.pick([-1, 1]), h = d.int(-2, 3), k = d.int(-4, 6), lo = d.int(h - 3, h - 1), hi = d.int(h + 1, h + 3), a = [A * h * h + k, -2 * A * h, A];
      const up = A < 0 ? '증가' : '감소', dn = A < 0 ? '감소' : '증가';
      const S = (u, v, w) => `닫힌구간 ${iv(u, v)}에서 ${w}`;
      const right = `${S(lo, h, up)}하고, ${S(h, hi, dn)}한다.`;
      const wrongs = [`${S(lo, h, dn)}하고, ${S(h, hi, up)}한다.`, `${S(lo, hi, up)}한다.`, `${S(lo, hi, dn)}한다.`];
      if (h + 1 < hi) wrongs.push(`${S(lo, h + 1, up)}하고, ${S(h + 1, hi, dn)}한다.`);
      if (h - 1 > lo) wrongs.push(`${S(lo, h - 1, up)}하고, ${S(h - 1, hi, dn)}한다.`);
      const sq = `${h === 0 ? X : `${facT(h)}`}${sup(2)}`;
      return pick5(d, `닫힌구간 ${iv(lo, hi)}에서 함수 ${fIs(a)}의 증가와 감소를 바르게 나타낸 것은?`, right, wrongs, {
        explain: `${is(`${Fv}(${X})`, `${A < 0 ? MINUS : ''}${sq}${k ? ' ' + sgnT(k) : ''}`)}이므로 ${iq(lo)} ≤ ${X} ≤ ${jh(iq(h), '에서/에서')}는 ${X}의 값이 커지면 ${Fv}(${X})의 값이 ${A < 0 ? '커지고' : '작아지고'}, ${iq(h)} ≤ ${X} ≤ ${jh(iq(hi), '에서/에서')}는 ${A < 0 ? '작아진다' : '커진다'}. 꼭짓점의 ${X}좌표 ${jh(iq(h), '은/는')} 두 구간에 모두 넣는다.` });
    }, { standard: S7 }),
    T('incr-interval', '도함수의 부호로 증가·감소 구간 구하기', '①25', (d, n) => {
      if (n === 0) {
        const s = d.pick([-2, -1, 1, 2]), al = d.int(-4, 2), be = d.int(al + 1, 5), d0 = d.int(-6, 6);
        if ((s * (al + be)) % 2) return null;
        const a = cubicCrit(s, al, be, d0), word = s > 0 ? '감소' : '증가';
        if (big(a) > 60) return null;
        return inline(`함수 ${jh(fIs(a), '이/가')} ${word}하는 구간은?`, `닫힌구간 ${grp('[{0}, {1}]')}`, [{ answer: al, signed: true }, { answer: be, signed: true }], {
          shown: `닫힌구간 ${iv(al, be)}`,
          explain: `${is(`${FP}(${X})`, ptext(pder(a)))} = ${nb(`${coefT(3 * s)}${facT(al)}${facT(be)}`)}이므로 ${iq(al)} &lt; ${X} &lt; ${jh(iq(be), '에서/에서')} ${FP}(${X}) ${s > 0 ? '&lt;' : '&gt;'} 0이다. 따라서 ${Fv}(${X})는 닫힌구간 ${jh(iv(al, be), '에서/에서')} ${word}하고, 구간 ${lInf(al)}, ${jh(rInf(be), '에서/에서')} ${s > 0 ? '증가' : '감소'}한다.`,
          facts: { calc: [[jn(al), 0], [jn(be), 1]], derived: [al, be] } });
      }
      if (n === 1) {
        const al = d.int(-4, 1), be = d.int(al + 1, 3), ga = d.int(be + 1, 5), d0 = d.int(-6, 6);
        if ((al + be + ga) % 3) return null;
        const a = quartCrit(al, be, ga, d0);
        if (big(a) > 99) return null;
        return inline(`함수 ${jh(fIs(a), '이/가')} 감소하는 구간은?`, `구간 ${grp(`(${MINUS}${INF}, {0}]`)}, 닫힌구간 ${grp('[{1}, {2}]')}`, [al, be, ga].map((v) => ({ answer: v, signed: true })), {
          shown: `구간 (${MINUS}${INF}, ${iq(al)}], 닫힌구간 ${iv(be, ga)}`,
          explain: `${is(`${FP}(${X})`, ptext(pder(a)))} = ${nb(`4${[al, be, ga].map((r) => (r === 0 ? X : `${facT(r)}`)).join('')}`)}이므로 ${FP}(${X})의 부호는 ${X} &lt; ${jh(iq(al), '에서/에서')} −, ${iq(al)} &lt; ${X} &lt; ${jh(iq(be), '에서/에서')} +, ${iq(be)} &lt; ${X} &lt; ${jh(iq(ga), '에서/에서')} −, ${X} &gt; ${jh(iq(ga), '에서/에서')} +이다. 따라서 감소하는 구간은 (${MINUS}${INF}, ${iq(al)}], ${jh(iv(be, ga), '이다/이다')}.`,
          facts: { calc: [[jn(al), 0], [jn(be), 1], [jn(ga), 2]], derived: [al, be, ga] } });
      }
      // 실수 전체에서 증가(감소)하는가: f′ = 3s[(x − h)² + e]
      const s = d.pick([-1, 1]), h = d.int(-3, 3), e = d.pick([1, 2, 3, 0, 0, -1, -4]), d0 = d.int(-6, 6);
      const a = [d0, 3 * s * (h * h + e), -3 * s * h, s], r = e < 0 ? Math.round(Math.sqrt(-e)) : 0;
      if (big(a) > 40 || (e < 0 && r * r !== -e)) return null;
      const all = (w) => `실수 전체의 집합에서 ${w}한다.`;
      const split = (w1, w2, u, v) => `닫힌구간 ${iv(u, v)}에서 ${w1}하고, 구간 (${MINUS}${INF}, ${iq(u)}], [${iq(v)}, ${INF})에서 ${w2}한다.`;
      const half = (w1, w2) => `구간 (${MINUS}${INF}, ${iq(h)}]에서 ${w1}하고, 구간 [${iq(h)}, ${INF})에서 ${w2}한다.`;
      let right; const pool = [all('증가'), all('감소'), half('증가', '감소'), half('감소', '증가'), split('감소', '증가', h - 1, h + 1), split('증가', '감소', h - 1, h + 1), split('감소', '증가', h - 2, h + 2), split('증가', '감소', h - 2, h + 2)];
      if (e >= 0) right = all(s > 0 ? '증가' : '감소');
      else right = s > 0 ? split('감소', '증가', h - r, h + r) : split('증가', '감소', h - r, h + r);
      const fd = `${coefT(3 * s)}${e === 0 ? `(${h === 0 ? X : poly([[1, X], [-h, '']])})${sup(2)}` : `{${facT(h)}${sup(2)} ${sgnT(e)}}`}`;
      return pick5(d, `함수 ${fIs(a)}의 증가와 감소를 바르게 나타낸 것은?`, right, pool.filter((p) => p !== right), {
        explain: `${is(`${FP}(${X})`, ptext(pder(a)))} = ${nb(fd)}이다. ${e > 0 ? `모든 실수 ${X}에서 ${FP}(${X}) ${s > 0 ? '&gt;' : '&lt;'} 0이므로 실수 전체의 집합에서 ${s > 0 ? '증가' : '감소'}한다.` : e === 0 ? `${FP}(${X}) ${s > 0 ? '≥' : '≤'} 0이고 ${is(FP + '(' + X + ')', 0)}인 것은 ${is(X, h)}일 때뿐이므로 실수 전체의 집합에서 ${s > 0 ? '증가' : '감소'}한다(${is(X, h)}의 좌우에서 부호가 바뀌지 않는다).` : `${is(`${FP}(${X})`, 0)}에서 ${is(X, h - r)} 또는 ${is(X, h + r)}이고, 그 사이에서 ${FP}(${X}) ${s > 0 ? '&lt;' : '&gt;'} 0이다.`}` });
    }, { count: 3, standard: S7 }),
    T('incr-table', '증가·감소를 나타낸 표의 빈칸', '①26', (d) => {
      const s = d.pick([1, 1, -1, 2]), al = d.int(-4, 2), be = d.int(al + 1, 5), d0 = d.int(-9, 9);
      if ((s * (al + be)) % 2) return null;
      const a = cubicCrit(s, al, be, d0), va = pval(a, al), vb = pval(a, be);
      if (big(a) > 60 || Math.abs(va) > 99 || Math.abs(vb) > 99) return null;
      const said = `증감표: x의 값 ${iq(al)}, ㉠ / f′(x)의 부호 ${s > 0 ? '+, 0, −, 0, +' : '−, 0, +, 0, −'} / f(x) ㉡, ㉢`;
      const fig = signTable([iq(al), box('㉠')], s > 0 ? [1, -1, 1] : [-1, 1, -1], [box('㉡'), box('㉢')], said.replace(/−/g, '−'));
      return M(`다음은 함수 ${fIs(a)}의 증가와 감소를 조사하여 나타낸 표이다. ㉠, ㉡, ㉢에 알맞은 수는?`, [['㉠', be], ['㉡', va], ['㉢', vb]].map(([label, answer]) => ({ label, answer, signed: true })), {
        figure: fig, shown: `㉠ ${iq(be)}, ㉡ ${iq(va)}, ㉢ ${iq(vb)}`,
        explain: `${is(`${FP}(${X})`, ptext(pder(a)))} = ${nb(`${coefT(3 * s)}${facT(al)}${facT(be)}`)}이므로 ${is(`${FP}(${X})`, 0)}에서 ${is(X, al)} 또는 ${is(X, be)}이다. ${is(`${Fv}(${iq(al)})`, va)}, ${is(`${Fv}(${iq(be)})`, vb)}이다.`,
        facts: { calc: [[jn(be), 0], [valExpr(a, al), 1], [valExpr(a, be), 2]], derived: [be] } });
    }, { standard: S7 }),
    T('incr-fpgraph', '도함수의 그래프로 증가·감소 구간 고르기', '①27', (d) => {
      const al = d.int(-3, 1), be = d.int(al + 2, 4), s = d.pick([1, -1]), half = (be - al) / 2, kk = s * 3 / (half * half);
      const g = (x) => kk * (x - al) * (x - be), lo = Math.min(al - 1.4, -0.6), hi = Math.max(be + 1.4, 0.6), [ylo, yhi] = yRange(g, lo, hi, 0.5);
      const fig = plotO({ x: [lo, hi], y: [Math.max(ylo, -5), Math.min(yhi, 5)], w: 260, xt: [al, be].filter((v) => v !== 0), curves: [{ f: g, name: "y=f'(x)" }],
        say: `곡선 y = f′(x)는 x축과 x = ${al}, x = ${be}에서 만나고, 그 사이에서는 x축 ${s > 0 ? '아래' : '위'}에, 그 밖에서는 x축 ${s > 0 ? '위' : '아래'}에 있다.`.replace(/-/g, '−') });
      const up = s < 0, ST = [
        [`닫힌구간 ${iv(al, be)}에서 증가한다.`, up], [`닫힌구간 ${iv(al, be)}에서 감소한다.`, !up],
        [`구간 (${MINUS}${INF}, ${iq(al)}]에서 증가한다.`, !up], [`구간 (${MINUS}${INF}, ${iq(al)}]에서 감소한다.`, up],
        [`구간 [${iq(be)}, ${INF})에서 증가한다.`, !up], [`구간 [${iq(be)}, ${INF})에서 감소한다.`, up],
        [`구간 (${MINUS}${INF}, ${iq(be)}]에서 증가한다.`, false], [`구간 (${MINUS}${INF}, ${iq(be)}]에서 감소한다.`, false],
        [`실수 전체의 집합에서 증가한다.`, false]
      ];
      const right = d.pick(ST.filter((r) => r[1]))[0];
      return pick5(d, `삼차함수 ${Fv}(${X})의 도함수 ${is(Y, `${FP}(${X})`)}의 그래프가 그림과 같을 때, 함수 ${Fv}(${X})에 대한 설명으로 옳은 것은?`, right, ST.filter((r) => !r[1]).map((r) => r[0]), {
        figure: fig, explain: `${FP}(${X})의 그래프가 ${X}축 위에 있는 구간에서 ${Fv}(${X})는 증가하고, 아래에 있는 구간에서 감소한다. ${iq(al)} &lt; ${X} &lt; ${jh(iq(be), '에서/에서')} ${FP}(${X}) ${up ? '&gt;' : '&lt;'} 0이므로 닫힌구간 ${jh(iv(al, be), '에서/에서')} ${up ? '증가' : '감소'}하고, ${X} &lt; ${iq(al)}, ${X} &gt; ${jh(iq(be), '에서/에서')} ${FP}(${X}) ${up ? '&lt;' : '&gt;'} 0이다.` });
    }, { standard: S7 }),
    T('incr-all', '실수 전체에서 증가(감소)하도록 하는 계수', '①28', (d, n) => {
      if (n === 0) {
        const s = d.pick([1, -1]), p = d.pick([-9, -6, -3, 3, 6, 9]), q0 = d.int(-6, 6), bound = s > 0 ? p * p / 3 : -p * p / 3, word = s > 0 ? '증가' : '감소';
        const fh = nb(`${Fv}(${X}) = ${poly([[s, X3], [p, X2]])} + ${Av}${X}${q0 ? ' ' + sgnT(q0) : ''}`);
        return ineqAns(`함수 ${jh(fh, '이/가')} 실수 전체의 집합에서 ${word}하도록 하는 실수 ${Av}의 값의 범위는?`, s > 0 ? '>=' : '<=', bound, Av, {
          explain: `${is(`${FP}(${X})`, `${poly([[3 * s, X2], [2 * p, X]])} + ${Av}`)}이다. 모든 실수 ${X}에 대하여 ${FP}(${X}) ${s > 0 ? '≥' : '≤'} 0이어야 하므로 이차방정식 ${is(`${FP}(${X})`, 0)}의 판별식 ${V('D')}에서 ${is(frac(V('D'), 4), `${iq(p * p)} ${s > 0 ? MINUS : '+'} 3${Av}`)} ≤ 0, 곧 ${Av} ${s > 0 ? '≥' : '≤'} ${jh(iq(bound), '이다/이다')}. 등호일 때도 ${FP}(${X})의 부호가 바뀌지 않으므로 ${word}한다.`,
          facts: { calc: [[s > 0 ? `${jn(p)}*${jn(p)}/3` : `0-${jn(p)}*${jn(p)}/3`, 1]] } });
      }
      if (n === 1) {
        const c3 = d.int(1, 4), c1 = d.int(1, 6), d0 = d.int(-6, 9), lim3 = 3 * c3 * c1, r = Math.floor(Math.sqrt(lim3));
        if (r < 2) return null;
        const fh = nb(`${Fv}(${X}) = ${coefT(c3)}${X3} + ${Kv}${X2} + ${coefT(c1)}${X}${d0 ? ' ' + sgnT(d0) : ''}`);
        return N(`함수 ${jh(fh, '이/가')} 실수 전체의 집합에서 증가하도록 하는 정수 ${Kv}의 개수는?`, 2 * r + 1, {
          explain: `${is(`${FP}(${X})`, `${coefT(3 * c3)}${X2} + 2${Kv}${X} + ${c1}`)}이고 모든 실수 ${X}에서 ${FP}(${X}) ≥ 0이어야 하므로 ${is(frac(V('D'), 4), `${Kv}${sup(2)} ${MINUS} ${lim3}`)} ≤ 0, 곧 ${Kv}${sup(2)} ≤ ${jh(String(lim3), '이다/이다')}. 이를 만족시키는 정수 ${jh(Kv, '은/는')} ${iq(-r)}부터 ${r}까지 ${2 * r + 1}개이다.`,
          facts: { calc: [[`2*${r}+1`, 0]], derived: [r] } });
      }
      // 실수 전체에서 감소: f′ = −3x² + 2ax + (b1 a + c1), D/4 = (a − r)(a − s) ≤ 0
      const r = d.int(-9, 3), s2 = d.int(r + 2, 9);
      if ((r + s2) % 3 || (r * s2) % 3) return null;
      const b1 = -(r + s2) / 3, c1 = r * s2 / 3, d0 = d.int(-6, 6);
      if (!b1 && !c1) return null;
      const fh = nb(`${Fv}(${X}) = ${MINUS}${X3} + ${Av}${X2}${linTerm(b1, c1, Av)}${d0 ? ' ' + sgnT(d0) : ''}`);
      return vals(`함수 ${jh(fh, '이/가')} 실수 전체의 집합에서 감소하도록 하는 실수 ${Av}의 최댓값과 최솟값은?`, [['최댓값', s2], ['최솟값', r]], {
        explain: `${is(`${FP}(${X})`, `${MINUS}3${X2} + 2${Av}${X}${linPlus(b1, c1, Av)}`)}이다. 모든 실수 ${X}에서 ${FP}(${X}) ≤ 0이어야 하므로 이차방정식 ${is(`${FP}(${X})`, 0)}의 판별식 ${V('D')}에서 ${is(frac(V('D'), 4), `${Av}${sup(2)} + 3(${linIn(b1, c1, Av)})`)} = ${nb(`${facT(r, Av)}${facT(s2, Av)}`)} ≤ 0, 곧 ${iq(r)} ≤ ${Av} ≤ ${jh(iq(s2), '이다/이다')}.`,
        facts: { calc: [[jn(s2), 0], [jn(r), 1]], derived: [r, s2] } });
    }, { count: 3, standard: S7 }),
    T('incr-range', '주어진 구간에서 증가(감소)하도록 하는 계수', '①29', (d, n) => {
      if (n === 0) {
        // 도함수의 꼭짓점이 구간 안: 꼭짓점의 값만 보면 된다
        const dec = d.bool(), h = nz(d, -3, 3), lo = d.int(h - 3, h - 1), hi = d.int(h + 1, h + 3), d0 = d.int(-6, 6), B2 = dec ? 3 * h : -3 * h;
        const fh = nb(`${Fv}(${X}) = ${dec ? MINUS : ''}${X3} ${sgnT(B2)}${X2} + ${Av}${X}${d0 ? ' ' + sgnT(d0) : ''}`);
        const ans = dec ? -3 * h * h : 3 * h * h;
        return numAns(`함수 ${jh(fh, '이/가')} ${dec ? `닫힌구간 ${iv(lo, hi)}` : `열린구간 ${iv(lo, hi, true)}`}에서 ${dec ? '감소' : '증가'}하도록 하는 실수 ${Av}의 ${dec ? '최댓값' : '최솟값'}은?`, ans, {
          explain: `${is(`${FP}(${X})`, `${dec ? MINUS : ''}3${X2} ${sgnT(2 * B2)}${X} + ${Av}`)} = ${nb(`${dec ? MINUS : ''}3${facT(h)}${sup(2)} + ${Av} ${dec ? '+' : MINUS} ${3 * h * h}`)}이다. 이 구간에서 늘 ${FP}(${X}) ${dec ? '≤' : '≥'} 0이어야 하고, ${FP}(${X})는 구간 안의 ${is(X, h)}에서 가장 ${dec ? '크므로' : '작으므로'} ${is(`${FP}(${iq(h)})`, `${Av} ${dec ? '+' : MINUS} ${3 * h * h}`)} ${dec ? '≤' : '≥'} 0, 곧 ${Av} ${dec ? '≤' : '≥'} ${jh(iq(ans), '이다/이다')}.`,
          facts: { value: dec ? `0-${jn(B2)}*${jn(B2)}/3` : `${jn(B2)}*${jn(B2)}/3` } });
      }
      // 도함수가 아래로 볼록: 두 끝점에서 f′ ≤ 0
      const p = d.int(1, 2), q = d.int(p + 1, p + 3), k = d.int(1, 12), d0 = d.int(-6, 6);
      const b1 = Q(3 * p * p + k, 6 * p), b2 = Q(3 * q * q + k, 6 * q), big2 = b1.p * b2.q > b2.p * b1.q ? b1 : b2, at = big2 === b1 ? p : q;
      if (big2.q === 1 || b1.p * b2.q === b2.p * b1.q) return null;
      const fh = nb(`${Fv}(${X}) = ${X3} ${MINUS} 3${Av}${X2} + ${coefT(k)}${X}${d0 ? ' ' + sgnT(d0) : ''}`);
      return qAns(`함수 ${jh(fh, '이/가')} 닫힌구간 ${jh(iv(p, q), '에서/에서')} 감소하도록 하는 실수 ${Av}의 최솟값은?`, big2, {
        explain: `${is(`${FP}(${X})`, `3${X2} ${MINUS} 6${Av}${X} + ${k}`)}의 그래프는 아래로 볼록하므로 닫힌구간 ${jh(iv(p, q), '에서/에서')} ${FP}(${X}) ≤ 0이려면 ${FP}(${p}) ≤ 0, ${FP}(${q}) ≤ 0이면 된다. ${FP}(${p}) = ${3 * p * p + k} ${MINUS} ${6 * p}${Av} ≤ 0에서 ${Av} ≥ ${iq(b1)}, ${FP}(${q}) = ${3 * q * q + k} ${MINUS} ${6 * q}${Av} ≤ 0에서 ${Av} ≥ ${jh(iq(b2), '이므로/이므로')} ${Av} ≥ ${jh(iq(big2), '이다/이다')}.`,
        facts: { value: `(3*${at}*${at}+${k})/(6*${at})`, derived: [6] } });
    }, { count: 2, standard: S7 })
  ];

  // ════════════════════════════════════════════════════════════════
  // 함수의 극대와 극소
  // ════════════════════════════════════════════════════════════════
  const ext = [
    T('ext-piece', '그래프에서 극대·극소 찾기(미분가능하지 않은 점 포함)', '①30', (d) => {
      const p = d.int(0, 1), r = p - d.int(1, 2), s0 = d.int(-1, 1), t = d.pick([1, 2]), q0 = (p - r) * (p - r) + s0;
      const f = (x) => (x >= p ? -t * (x - p) + q0 : (x - r) * (x - r) + s0);
      const left = `${r === 0 ? X : `${facT(r)}`}${sup(2)}${s0 ? ' ' + sgnT(s0) : ''}`, right = poly([[-t, X], [t * p + q0, '']]);
      const fh = `${Fv}(${X}) = ${sys([`${right} ${nb(`(${X} ≥ ${iq(p)})`)}`, `${left} ${nb(`(${X} &lt; ${iq(p)})`)}`])}`;
      const lo = Math.min(r - 1.5, -0.8), hi = p + Math.max(2, (q0 + 1.2) / t), [ylo, yhi] = yRange(f, lo, hi, 0.5);
      const fig = plotO({ x: [lo, hi], y: [Math.max(ylo, -3.5), Math.min(Math.max(yhi, q0 + 1), 6)], w: 250, xt: [r, p, p + 1].filter((v) => v !== 0), yt: [q0, s0].filter((v) => v !== 0),
        curves: [{ f, breaks: [p], name: 'y=f(x)' }], say: `x = ${p}에서 그래프가 꺾인다.`.replace(/-/g, '−') });
      return M(`함수 ${fh}의 그래프가 그림과 같을 때, 함수 ${Fv}(${X})가 극대가 되는 ${X}의 값과 극댓값, 극소가 되는 ${X}의 값과 극솟값은?`,
        [[`극대인 ${X}`, p], ['극댓값', q0], [`극소인 ${X}`, r], ['극솟값', s0]].map(([label, answer]) => ({ label, answer, signed: true })), {
          figure: fig, shown: `극대인 ${X} ${iq(p)}, 극댓값 ${iq(q0)}, 극소인 ${X} ${iq(r)}, 극솟값 ${iq(s0)}`,
          explain: `${is(X, p)}의 좌우에서 ${Fv}(${X})는 증가하다가 감소하므로 ${is(X, p)}에서 극대이고 극댓값은 ${is(`${Fv}(${iq(p)})`, q0)}이다(${is(X, p)}에서 미분가능하지 않아도 극대이다). ${is(X, r)}의 좌우에서 감소하다가 증가하므로 극소이고 극솟값은 ${is(`${Fv}(${iq(r)})`, s0)}이다.`,
          facts: { calc: [[jn(p), 0], [jn(q0), 1], [jn(r), 2], [jn(s0), 3]], derived: [p, q0, r, s0] } });
    }, { standard: S7 }),
    T('ext-values', '도함수의 부호로 극값 구하기', '①31', (d, n) => {
      if (n === 0) {
        const s = d.pick([-2, -1, 1, 2]), al = d.int(-4, 2), be = d.int(al + 1, 4), d0 = d.int(-9, 9);
        if ((s * (al + be)) % 2) return null;
        const a = cubicCrit(s, al, be, d0), xmax = s > 0 ? al : be, xmin = s > 0 ? be : al, vM = pval(a, xmax), vm = pval(a, xmin);
        if (big(a) > 60 || Math.abs(vM) > 99 || Math.abs(vm) > 99) return null;
        return M(`함수 ${fIs(a)}의 극댓값과 극솟값은?`, [['극댓값', vM], ['극솟값', vm]].map(([label, answer]) => ({ label, answer, signed: true })), {
          shown: `극댓값 ${iq(vM)}, 극솟값 ${iq(vm)}`,
          explain: `${is(`${FP}(${X})`, ptext(pder(a)))} = ${nb(`${coefT(3 * s)}${facT(al)}${facT(be)}`)}이다. ${FP}(${X})의 부호가 ${is(X, xmax)}의 좌우에서 +에서 −로, ${is(X, xmin)}의 좌우에서 −에서 +로 바뀌므로 극댓값은 ${is(`${Fv}(${iq(xmax)})`, vM)}, 극솟값은 ${is(`${Fv}(${iq(xmin)})`, vm)}이다.`,
          facts: { calc: [[valExpr(a, xmax), 0], [valExpr(a, xmin), 1]], derived: [xmax, xmin] } });
      }
      if (n === 1) {
        const al = d.int(-4, 0), be = d.int(al + 1, 2), ga = d.int(be + 1, 4), d0 = d.int(-6, 9);
        if ((al + be + ga) % 3) return null;
        const a = quartCrit(al, be, ga, d0), vM = pval(a, be), m1 = pval(a, al), m2 = pval(a, ga);
        if (big(a) > 99 || [vM, m1, m2].some((v) => Math.abs(v) > 199)) return null;
        return M(`함수 ${fIs(a)}의 극댓값과 두 극솟값은?`, [['극댓값', vM], ['극솟값', m1], ['극솟값', m2]].map(([label, answer]) => ({ label, answer, signed: true })), {
          blocks: [[1], [2]], shown: `극댓값 ${iq(vM)}, 극솟값 ${iq(m1)}, ${iq(m2)}`,
          explain: `${is(`${FP}(${X})`, ptext(pder(a)))} = ${nb(`4${[al, be, ga].map((r) => (r === 0 ? X : `${facT(r)}`)).join('')}`)}이다. 부호가 ${is(X, al)}, ${is(X, ga)}의 좌우에서 −에서 +로, ${is(X, be)}의 좌우에서 +에서 −로 바뀌므로 극댓값은 ${is(`${Fv}(${iq(be)})`, vM)}, 극솟값은 ${is(`${Fv}(${iq(al)})`, m1)}, ${is(`${Fv}(${iq(ga)})`, m2)}이다.`,
          facts: { calc: [[valExpr(a, be), 0], [valExpr(a, al), 1], [valExpr(a, ga), 2]], derived: [al, be, ga] } });
      }
      // 극값이 하나뿐인 사차함수
      const s = d.pick([1, -1]), useSq = d.bool(), q0 = d.int(-6, 9);
      let a, x0, v;
      if (useSq) { const pp = s * d.int(1, 6); a = [q0, 0, pp, 0, s]; x0 = 0; v = q0; }
      else { const t = nz(d, -2, 2); a = [q0, -4 * s * t ** 3, 0, 0, s]; x0 = t; v = pval(a, t); }
      if (big(a) > 40) return null;
      const kind = s > 0 ? '극솟값' : '극댓값', other = s > 0 ? '극댓값' : '극솟값';
      const right = `${kind} ${iq(v)}만 갖고 ${jh(other, '은/는')} 없다.`;
      const w0 = pval(a, x0 + 1), wrongs = [`${other} ${iq(v)}만 갖고 ${jh(kind, '은/는')} 없다.`, `${kind} ${iq(v + 1)}만 갖고 ${jh(other, '은/는')} 없다.`, `${kind} ${iq(v - 2)}만 갖고 ${jh(other, '은/는')} 없다.`,
        `${jh(s > 0 ? `극댓값 ${iq(w0)}, 극솟값 ${iq(v)}` : `극댓값 ${iq(v)}, 극솟값 ${iq(w0)}`, '을/를')} 갖는다.`, '극값을 갖지 않는다.'];
      return pick5(d, `함수 ${fIs(a)}의 극값에 대한 설명으로 옳은 것은?`, right, wrongs, {
        explain: `${is(`${FP}(${X})`, ptext(pder(a)))}${useSq ? ` = ${nb(`2${X}(${poly([[2 * s, X2], [a[2], '']])})`)}` : ` = ${nb(`${coefT(4 * s)}${facT(x0)}(${ptext([x0 * x0, x0, 1])})`)}`}이고 ${is(`${FP}(${X})`, 0)}인 실수는 ${is(X, x0)}뿐이다. 그 좌우에서 부호가 ${s > 0 ? '−에서 +로' : '+에서 −로'} 바뀌므로 ${kind} ${is(`${Fv}(${iq(x0)})`, v)}만 갖는다.` });
    }, { count: 3, standard: S7 }),
    T('ext-two', '극값을 갖는 두 x로 계수와 극값 구하기', '①32', (d, n) => {
      const s = n === 0 ? d.pick([1, -1]) : 1, al = d.int(-4, 2), be = d.int(al + 1, 5), c0 = nz(d, -9, 9);
      if ((al + be) % 2) return null;
      const a = cubicCrit(s, al, be, c0), A2 = a[2], B1 = a[1], xmax = s > 0 ? al : be, xmin = s > 0 ? be : al, vM = pval(a, xmax), vm = pval(a, xmin);
      if (!A2 || !B1 || Math.abs(vM) > 99 || Math.abs(vm) > 99 || big(a) > 60) return null;
      if (n === 0) {
        const fh = nb(`${Fv}(${X}) = ${poly([[s, X3]])} + ${Av}${X2} + ${Bv}${X} ${sgnT(c0)}`);
        return M(`함수 ${jh(fh, '이/가')} ${is(X, xmax)}에서 극댓값을 갖고 ${is(X, xmin)}에서 극솟값을 갖는다. 상수 ${Av}, ${Bv}의 값과 극댓값, 극솟값은?`,
          [[Av + ' =', A2], [Bv + ' =', B1], ['극댓값', vM], ['극솟값', vm]].map(([label, answer]) => ({ label, answer, signed: true })), {
            shown: `${is(Av, A2)}, ${is(Bv, B1)}, 극댓값 ${iq(vM)}, 극솟값 ${iq(vm)}`,
            explain: `${is(`${FP}(${X})`, `${coefT(3 * s)}${X2} + 2${Av}${X} + ${Bv}`)}이고 ${FP}(${iq(al)}) = ${FP}(${iq(be)}) = 0이므로 ${FP}(${X}) = ${nb(`${coefT(3 * s)}${facT(al)}${facT(be)}`)} = ${jh(ptext([B1, 2 * A2, 3 * s]), '이다/이다')}. 따라서 ${is(Av, A2)}, ${is(Bv, B1)}이고 극댓값은 ${is(`${Fv}(${iq(xmax)})`, vM)}, 극솟값은 ${is(`${Fv}(${iq(xmin)})`, vm)}이다.`,
            facts: { calc: [[`0-3*${jn(s)}*(${jn(al)}+${jn(be)})/2`, 0], [`3*${jn(s)}*${jn(al)}*${jn(be)}`, 1], [valExpr(a, xmax), 2], [valExpr(a, xmin), 3]], derived: [A2, B1] } });
      }
      // 극솟값을 주고 상수항까지 정해 극댓값을 구한다
      const fh = nb(`${Fv}(${X}) = ${X3} + ${Av}${X2} + ${Bv}${X} + ${V('c')}`);
      return numAns(`함수 ${jh(fh, '은/는')} ${is(X, be)}에서 극솟값 ${jh(iq(vm), '을/를')} 갖고, ${is(X, al)}에서 극댓값 ${jh(Kv, '을/를')} 갖는다. 실수 ${Kv}의 값은? ${nb(`(단, ${Av}, ${Bv}, ${V('c')}는 상수)`)}`, vM, {
        explain: `${FP}(${iq(al)}) = ${FP}(${iq(be)}) = 0이므로 ${is(`${FP}(${X})`, `3${facT(al)}${facT(be)}`)}, 곧 ${is(Av, A2)}, ${is(Bv, B1)}이다. ${is(`${Fv}(${iq(be)})`, vm)}에서 ${is(V('c'), c0)}이므로 ${is(Kv, `${Fv}(${iq(al)})`)} = ${jh(iq(vM), '이다/이다')}.`,
        facts: { value: `${jn(vm)}+(${jn(be)}-${jn(al)})*(${jn(be)}-${jn(al)})*(${jn(be)}-${jn(al)})/2` } });
    }, { count: 2, standard: S7 }),
    T('ext-one', '한 점의 극값으로 계수와 다른 극값 구하기', '①33', (d) => {
      const s = d.pick([1, 2]), p = nz(d, -3, 2), q = d.int(p + 1, 4), c0 = nz(d, -6, 9);
      if ((s * (p + q)) % 2) return null;
      const a = cubicCrit(s, p, q, c0), A2 = a[2], B1 = a[1], v = pval(a, p), vm = pval(a, q);
      if (!A2 || !B1 || Math.abs(v) > 99 || Math.abs(vm) > 99 || big(a) > 60) return null;
      const fh = nb(`${Fv}(${X}) = ${poly([[s, X3]])} + ${Av}${X2} + ${Bv}${X} ${sgnT(c0)}`);
      return M(`함수 ${jh(fh, '이/가')} ${is(X, p)}에서 극댓값 ${jh(iq(v), '을/를')} 가질 때, 상수 ${Av}, ${Bv}의 값과 극솟값은?`,
        [[Av + ' =', A2], [Bv + ' =', B1], ['극솟값', vm]].map(([label, answer]) => ({ label, answer, signed: true })), {
          shown: `${is(Av, A2)}, ${is(Bv, B1)}, 극솟값 ${iq(vm)}`,
          explain: `${is(`${FP}(${iq(p)})`, 0)}에서 ${is(`${iq(3 * s * p * p)} ${p < 0 ? MINUS : '+'} ${Math.abs(2 * p)}${Av} + ${Bv}`, 0)}, ${is(`${Fv}(${iq(p)})`, v)}에서 ${is(`${iq(s * p ** 3 + c0)} + ${iq(p * p)}${Av} ${p < 0 ? MINUS : '+'} ${Math.abs(p) === 1 ? '' : Math.abs(p)}${Bv}`, v)}이다. 두 식을 연립하면 ${is(Av, A2)}, ${is(Bv, B1)}이다. ${is(`${FP}(${X})`, `${coefT(3 * s)}${facT(p)}${facT(q)}`)}이므로 ${is(X, q)}에서 극소이고 극솟값은 ${is(`${Fv}(${iq(q)})`, vm)}이다.`,
          facts: { calc: [[`0-3*${s}*(${jn(p)}+${jn(q)})/2`, 0], [`3*${s}*${jn(p)}*${jn(q)}`, 1], [valExpr(a, q), 2]], derived: [q, A2, B1] } });
    }, { standard: S7 }),
    T('ext-graph', '그래프에서 극점을 읽어 극값 구하기', '①34', (d, n) => {
      if (n === 0) {
        const al = d.int(-3, 1), be = d.int(al + 1, 4), c0 = d.int(-5, 5);
        if ((al + be) % 2 || al === 0 || be === 0) return null;
        const a = cubicCrit(1, al, be, c0), vM = pval(a, al), vm = pval(a, be), g = (x) => pval(a, x);
        if (big(a) > 40 || Math.abs(vM) > 60 || Math.abs(vm) > 60) return null;
        const lo = Math.min(al - 1.3, -0.6), hi = Math.max(be + 1.3, 0.6), [ylo, yhi] = [Math.min(vm, 0) - 1.2, Math.max(vM, 0) + 1.2];
        const fig = plotO({ x: [lo, hi], y: [ylo, yhi], w: 250, ys: Math.min(1, 7 / (yhi - ylo)) * 1.1, curves: [{ f: g, name: 'y=f(x)' }],
          dots: [{ x: al, y: vM, guide: true, xl: String(al), said: `x좌표 ${al}(극대)`.replace(/-/g, '−') }, { x: be, y: vm, guide: true, xl: String(be), said: `x좌표 ${be}(극소)`.replace(/-/g, '−') }] });
        const fh = nb(`${Fv}(${X}) = ${X3} + ${Av}${X2} + ${Bv}${X}${c0 ? ' ' + sgnT(c0) : ''}`);
        return M(`함수 ${fh}의 그래프가 그림과 같을 때, 함수 ${Fv}(${X})의 극댓값과 극솟값은? ${nb(`(단, ${Av}, ${Bv}는 상수)`)}`, [['극댓값', vM], ['극솟값', vm]].map(([label, answer]) => ({ label, answer, signed: true })), {
          figure: fig, shown: `극댓값 ${iq(vM)}, 극솟값 ${iq(vm)}`,
          explain: `그래프에서 ${is(X, al)}에서 극대, ${is(X, be)}에서 극소이므로 ${FP}(${X}) = 3${X2} + 2${Av}${X} + ${Bv} = ${nb(`3${facT(al)}${facT(be)}`)}이다. 곧 ${is(Av, a[2])}, ${is(Bv, a[1])}이므로 극댓값은 ${is(`${Fv}(${iq(al)})`, vM)}, 극솟값은 ${is(`${Fv}(${iq(be)})`, vm)}이다.`,
          facts: { calc: [[valExpr(a, al), 0], [valExpr(a, be), 1]], derived: [a[2], a[1]] } });
      }
      // 도함수의 그래프와 극댓값으로 극솟값: f(x) = x³/3 + ax² + bx + c
      const al = d.int(-3, 1), w = d.int(1, 4), be = al + w, v = d.int(-5, 8);
      if (al === 0 || be === 0) return null;
      const g = (x) => (x - al) * (x - be), lo = Math.min(al - 1.3, -0.6), hi = Math.max(be + 1.3, 0.6), [ylo, yhi] = yRange(g, lo, hi, 0.4);
      const fig = plotO({ x: [lo, hi], y: [ylo, Math.min(yhi, Math.max(3, -ylo + 1))], w: 250, xt: [al, be], curves: [{ f: g, name: "y=f'(x)" }] });
      const ans = Q(6 * v - w ** 3, 6);
      const fh = nb(`${Fv}(${X}) = ${frac(1, 3)}${X3} + ${Av}${X2} + ${Bv}${X} + ${V('c')}`);
      return qAns(`그림은 함수 ${fh}의 도함수 ${is(Y, `${FP}(${X})`)}의 그래프이다. 함수 ${Fv}(${X})의 극댓값이 ${jh(iq(v), '일/일')} 때, 함수 ${Fv}(${X})의 극솟값은? ${nb(`(단, ${Av}, ${Bv}, ${V('c')}는 상수)`)}`, ans, {
        signed: true, figure: fig,
        explain: `${FP}(${X})의 부호가 ${is(X, al)}에서 +에서 −로, ${is(X, be)}에서 −에서 +로 바뀌므로 ${is(X, al)}에서 극대, ${is(X, be)}에서 극소이다. ${is(`${FP}(${X})`, `${facT(al)}${facT(be)}`)} = ${jh(ptext([al * be, -(al + be), 1]), '이므로/이므로')} ${is(Av, Q(-(al + be), 2))}, ${is(Bv, al * be)}이다. ${is(`${Fv}(${iq(al)})`, v)}에서 ${V('c')}를 구하면 극솟값은 ${is(`${Fv}(${iq(be)})`, ans)}이다.`,
        facts: { value: `${jn(v)}-(${jn(be)}-${jn(al)})*(${jn(be)}-${jn(al)})*(${jn(be)}-${jn(al)})/6`, derived: [6] } });
    }, { count: 2, standard: S7 }),
    T('ext-limit', '극한 조건과 극값을 갖는 x로 도함수의 값 구하기', '①35', (d) => {
      const k = d.pick([-2, -1, 1, 2, 3]), p = d.int(-3, 1), q = d.int(p + 1, 3), r = d.int(-3, 4);
      if (r === p || r === q) return null;
      const ans = 3 * k * (r - p) * (r - q);
      const conds = lines([`(가) ${lim('x→∞', frac(ms('f(x)'), ms('x^3')))} = ${iq(k)}`, `(나) 함수 ${Fv}(${X})는 ${jh(is(X, p), "과/와")} ${is(X, q)}에서 극값을 갖는다.`]);
      return numAns(`다항함수 ${Fv}(${X})가 다음 조건을 만족시킬 때, ${FP}(${iq(r)})의 값은?`, ans, {
        figure: conds,
        explain: `(가)에서 ${Fv}(${X})는 최고차항의 계수가 ${jh(iq(k), '인/인')} 삼차함수이고, ${FP}(${X})는 최고차항의 계수가 ${jh(iq(3 * k), '인/인')} 이차함수이다. (나)에서 ${FP}(${iq(p)}) = ${FP}(${iq(q)}) = 0이므로 ${is(`${FP}(${X})`, `${iq(3 * k)}${facT(p)}${facT(q)}`)}이고 ${is(`${FP}(${iq(r)})`, ans)}이다.`,
        facts: { value: `3*${jn(k)}*(${jn(r)}-${jn(p)})*(${jn(r)}-${jn(q)})` } });
    }, { standard: S7 }),
    T('ext-param', '극점의 x좌표가 문자인 함수의 극값', '①36', (d, n) => {
      if (n === 0) {
        // f′(x) = 6(x − Pa)(x − Qa), a > 0: 극댓값 + 극솟값 = K a³ + 2c
        const [P, Qq] = d.pick([[-1, 2], [-2, 1], [1, 2], [1, 3], [-1, 3], [2, 3]]), a = d.int(1, 3), c = d.int(-9, 9);
        const Kc = (P + Qq) * (-P * P - Qq * Qq + 4 * P * Qq), S = Kc * a ** 3 + 2 * c;
        if (Math.abs(S) > 999 || !Kc) return null;
        const A2 = -3 * (P + Qq), B1 = 6 * P * Qq;
        const fh = nb(`${Fv}(${X}) = 2${X3} ${A2 < 0 ? MINUS : '+'} ${Math.abs(A2) === 1 ? '' : Math.abs(A2)}${Av}${X2} ${B1 < 0 ? MINUS : '+'} ${Math.abs(B1)}${Av}${sup(2)}${X}${c ? ' ' + sgnT(c) : ''}`);
        const lo = P * a, hi = Qq * a;
        return N(`함수 ${fh}의 극댓값과 극솟값의 합이 ${jh(iq(S), '일/일')} 때, 양수 ${Av}의 값은?`, a, {
          explain: `${is(`${FP}(${X})`, `6${X2} ${A2 < 0 ? MINUS : '+'} ${Math.abs(2 * A2)}${Av}${X} ${B1 < 0 ? MINUS : '+'} ${Math.abs(B1)}${Av}${sup(2)}`)} = ${nb(`6(${poly([[1, X], [-P, Av]])})(${poly([[1, X], [-Qq, Av]])})`)}이고 ${Av} &gt; 0이므로 ${is(X, `${coefT(P)}${Av}`)}에서 극대, ${is(X, `${coefT(Qq)}${Av}`)}에서 극소이다. ${Fv}(${coefT(P)}${Av}) + ${Fv}(${coefT(Qq)}${Av}) = ${nb(`${iq(Kc)}${Av}${sup(3)} ${sgnT(2 * c)}`)} = ${iq(S)}에서 ${is(Av + sup(3), a ** 3)}, 곧 ${is(Av, a)}이다.`,
          facts: { calc: [[String(a), 0]], derived: [a, lo, hi], check: `K = ${Kc}` } });
      }
      // f′(x) = 6(x − r)(x − a), a > r: 극솟값 f(a) = −a³ + 3ra² + c 로 a, 그 다음 극댓값 f(r)
      const r = d.pick([-1, 1, 2]), a = d.int(r + 1, r + 5), c = d.int(-9, 9), m = -(a ** 3) + 3 * r * a * a + c;
      // a > r 인 근이 하나뿐인가: g(t) = −t³ + 3rt² 는 (r, 2r)에서 증가, 2r 넘어 감소
      const sols = []; for (let t = r + 1; t <= r + 12; t += 1) if (-(t ** 3) + 3 * r * t * t + c === m) sols.push(t);
      const gR = 2 * r ** 3;
      if (sols.length !== 1 || (r > 0 && !(m - c < gR)) || Math.abs(m) > 99) return null;
      const vM = -(r ** 3) + 3 * a * r * r + c;
      if (Math.abs(vM) > 99) return null;
      const fh = nb(`${Fv}(${X}) = 2${X3} ${MINUS} 3(${Av} ${sgnT(r)})${X2} ${6 * r < 0 ? MINUS : '+'} ${Math.abs(6 * r)}${Av}${X}${c ? ' ' + sgnT(c) : ''}`);
      return numAns(`${Av} &gt; ${jh(iq(r), '인/인')} 상수 ${Av}에 대하여 함수 ${fh}의 극솟값이 ${jh(iq(m), '일/일')} 때, 함수 ${Fv}(${X})의 극댓값은?`, vM, {
        explain: `${is(`${FP}(${X})`, `6${X2} ${MINUS} 6(${Av} ${sgnT(r)})${X} ${6 * r < 0 ? MINUS : '+'} ${Math.abs(6 * r)}${Av}`)} = ${nb(`6${facT(r)}(${X} ${MINUS} ${Av})`)}이고 ${Av} &gt; ${jh(iq(r), '이므로/이므로')} ${is(X, r)}에서 극대, ${is(X, Av)}에서 극소이다. ${is(`${Fv}(${Av})`, `${MINUS}${Av}${sup(3)} ${r < 0 ? MINUS : '+'} ${Math.abs(3 * r)}${Av}${sup(2)}${c ? ' ' + sgnT(c) : ''}`)} = ${jh(iq(m), '에서/에서')} ${is(Av, a)}이다. 따라서 극댓값은 ${is(`${Fv}(${iq(r)})`, vM)}이다.`,
        facts: { calc: [[`0-${jn(r)}*${jn(r)}*${jn(r)}+3*${a}*${jn(r)}*${jn(r)}+${jn(c)}`, 0]], derived: [a] } });
    }, { count: 2, standard: S7 }),
    T('ext-none', '삼차함수가 극값을 갖지 않을(가질) 조건', '①37', (d, n) => {
      const c3 = d.pick([-2, -1, 1, 2]), r = d.int(-9, n === 0 ? 6 : 0), s2 = d.int(Math.max(r + 1, n === 0 ? r + 1 : 1), 9), h = d.int(-6, 6);
      if ((r + s2) % (3 * c3) || (r * s2) % (3 * c3)) return null;
      const e = (r + s2) / (3 * c3), g = -r * s2 / (3 * c3);
      if (!e && !g) return null;
      const fh = nb(`${Fv}(${X}) = ${coefT(c3)}${X3} + ${Kv}${X2}${linTerm(e, g, Kv)}${h ? ' ' + sgnT(h) : ''}`);
      const disc = `${Kv}${sup(2)} ${MINUS} ${3 * c3 < 0 ? `(${iq(3 * c3)})` : 3 * c3}(${linIn(e, g, Kv)})`;
      if (n === 0) {
        return vals(`함수 ${jh(fh, '이/가')} 극값을 갖지 않도록 하는 실수 ${Kv}의 최댓값과 최솟값은?`, [['최댓값', s2], ['최솟값', r]], {
          explain: `${is(`${FP}(${X})`, `${coefT(3 * c3)}${X2} + 2${Kv}${X}${linPlus(e, g, Kv)}`)}이다. 삼차함수가 극값을 갖지 않으려면 ${FP}(${X})의 부호가 바뀌지 않아야 하므로 이차방정식 ${is(`${FP}(${X})`, 0)}이 중근이나 허근을 가져야 한다. ${is(frac(V('D'), 4), disc)} = ${nb(`${facT(r, Kv)}${facT(s2, Kv)}`)} ≤ 0에서 ${iq(r)} ≤ ${Kv} ≤ ${jh(iq(s2), '이다/이다')}.`,
          facts: { calc: [[jn(s2), 0], [jn(r), 1]], derived: [r, s2] } });
      }
      return N(`함수 ${jh(fh, '이/가')} 극값을 갖도록 하는 자연수 ${Kv}의 최솟값은?`, s2 + 1, {
        explain: `${is(`${FP}(${X})`, `${coefT(3 * c3)}${X2} + 2${Kv}${X}${linPlus(e, g, Kv)}`)}이다. 삼차함수가 극값을 가지려면 이차방정식 ${is(`${FP}(${X})`, 0)}이 서로 다른 두 실근을 가져야 하므로 ${is(frac(V('D'), 4), disc)} = ${nb(`${facT(r, Kv)}${facT(s2, Kv)}`)} &gt; 0, 곧 ${Kv} &lt; ${iq(r)} 또는 ${Kv} &gt; ${jh(iq(s2), '이다/이다')}. 이를 만족시키는 가장 작은 자연수는 ${jh(String(s2 + 1), '이다/이다')}.`,
        facts: { calc: [[`${s2}+1`, 0]], derived: [s2] } });
    }, { count: 2, standard: S7 }),
    T('ext-fpgraph', '도함수의 그래프로 극대·극소와 증감 판단하기', '①39', (d, n) => {
      // f′(x) = k·Π(x − rᵢ)^mᵢ (n = 0: 겹근 하나가 있어 x축에 닿는 곳이 있다, n = 1: 서로 다른 세 근)
      const r1 = d.int(-3, 0), r2 = d.int(r1 + 1, r1 + 3), r3 = d.int(r2 + 1, r2 + 3), sg = d.pick([1, -1]);
      const R = [r1, r2, r3], mult = n === 0 ? d.shuffle([2, 1, 1]) : [1, 1, 1];
      if (n === 0 && mult[0] === 2 && mult[1] === 1) { /* 겹근이 맨 왼쪽이어도 된다 */ }
      const base = (x) => sg * R.reduce((p, r, i) => p * (x - r) ** mult[i], 1), lo = r1 - 0.9, hi = r3 + 0.9;
      // 세로 배율은 근 사이(가장 왼쪽 근 ~ 가장 오른쪽 근)의 높이에 맞춘다 — 바깥으로 뻗는 부분은 상자 밖에서 끊긴다.
      let mx = 0; for (let i = 0; i <= 200; i += 1) mx = Math.max(mx, Math.abs(base(r1 + (r3 - r1) * i / 200)));
      const sc = 2.4 / mx, g = (x) => base(x) * sc;
      const sign = (x) => Math.sign(base(x)), eps = 1e-3;
      const turn = R.map((r) => [sign(r - eps), sign(r + eps)]);
      const isMax = (i) => turn[i][0] > 0 && turn[i][1] < 0, isMin = (i) => turn[i][0] < 0 && turn[i][1] > 0;
      const nExt = R.filter((_, i) => isMax(i) || isMin(i)).length;
      // 구간 [u, v]에서 늘 f′ ≥ 0(≤ 0)인가
      const holds = (u, v, w) => { for (let i = 1; i < 60; i += 1) { const x = u + (v - u) * i / 60, s = sign(x); if (s && s !== w) return false; } return true; };
      const pool = [];
      R.forEach((r, i) => { pool.push([`함수 ${Fv}(${X})는 ${is(X, r)}에서 극대이다.`, isMax(i)]); pool.push([`함수 ${Fv}(${X})는 ${is(X, r)}에서 극소이다.`, isMin(i)]); });
      for (const k of [nExt, nExt + 1, nExt - 1]) if (k >= 1) pool.push([`함수 ${Fv}(${X})가 극값을 갖는 ${X}의 개수는 ${jh(String(k), '이다/이다')}.`, k === nExt]);
      for (const [u, v] of [[r1, r2], [r2, r3], [r1, r3]]) { pool.push([`함수 ${Fv}(${X})는 닫힌구간 ${jh(iv(u, v), '에서/에서')} 감소한다.`, holds(u, v, -1)]); pool.push([`함수 ${Fv}(${X})는 닫힌구간 ${jh(iv(u, v), '에서/에서')} 증가한다.`, holds(u, v, 1)]); }
      pool.push([`함수 ${Fv}(${X})는 구간 (${MINUS}${INF}, ${iq(r1)}]에서 감소한다.`, holds(r1 - 50, r1, -1)]);
      for (const [u, v] of [[r1, r2], [r2, r3]]) if (holds(u, v, 1) || holds(u, v, -1)) pool.push([`${nb(`${Fv}(${iq(u)}) &lt; ${Fv}(${iq(v)})`)}이다.`, holds(u, v, 1)]);
      const pickd = d.shuffle(pool).slice(0, 3);
      if (!pickd.some((r) => r[1]) || pickd.every((r) => r[1])) return null;
      const fig = plotO({ x: [Math.min(lo, -0.6), Math.max(hi, 0.6)], y: [-3.6, 3.6], w: 260, ys: 0.7, xt: R.filter((v) => v !== 0), curves: [{ f: g, name: "y=f'(x)" }],
        say: `곡선 y = f′(x)가 x축과 만나는 점의 x좌표는 ${R.join(', ')}이다. ${R.map((r, i) => `x = ${r}의 ${mult[i] === 2 ? '좌우에서 곡선은 x축에 닿았다가 같은 쪽으로 돌아간다' : '좌우에서 곡선은 x축을 지나간다'}`).join(', ')}. x > ${r3}에서 곡선은 x축 ${sg > 0 ? '위' : '아래'}에 있다.`.replace(/-(\d)/g, '−$1') });
      return comboPick(d, `함수 ${Fv}(${X})의 도함수 ${is(Y, `${FP}(${X})`)}의 그래프가 그림과 같을 때, 옳은 것만을 있는 대로 고른 것은?`, pickd.map((r) => r[0]), pickd.map((r) => r[1]),
        `${FP}(${X})의 부호가 +에서 −로 바뀌는 곳에서 극대, −에서 +로 바뀌는 곳에서 극소이다. ${R.map((r, i) => `${is(X, r)}의 좌우에서는 ${turn[i][0] > 0 ? '+' : '−'}에서 ${turn[i][1] > 0 ? '+' : '−'}${isMax(i) ? '(극대)' : isMin(i) ? '(극소)' : '(부호가 바뀌지 않아 극값이 아니다)'}`).join(', ')}이다. ` + pickd.map((r, i) => `${GA[i]}은 ${r[1] ? '옳다' : '옳지 않다'}.`).join(' '), { figure: fig + lines(pickd.map((r, i) => `<b>${GA[i]}.</b> ${r[0]}`)) });
    }, { count: 2, standard: S7 }),
    T('ext-hprime', '두 도함수의 그래프로 h = f − g의 증감과 극값', '①40', (d) => {
      const al = d.int(-2, 1), be = d.int(al + 2, 4), A = d.pick([0.5, 1, -0.5, -1]), m = d.pick([-1, -0.5, 0.5, 1]), c = d.int(-1, 2);
      const gp = (x) => m * x + c, fp = (x) => gp(x) + A * (x - al) * (x - be), lo = Math.min(al - 1.3, -0.6), hi = Math.max(be + 1.3, 0.6);
      const [ya, yb] = yRange((x) => fp(x), lo, hi, 0.5), [yc, yd] = yRange((x) => gp(x), lo, hi, 0.5), vy = fp((al + be) / 2 + (m / (2 * A)) * 0);
      const fig = plotO({ x: [lo, hi], y: [Math.max(Math.min(ya, yc), -5.5), Math.min(Math.max(yb, yd), 5.5)], w: 260, ys: 0.8, xt: [al, be].filter((v) => v !== 0), curves: [{ f: fp, name: "y=f'(x)" }], lines: [{ a: m, b: c, name: "y=g'(x)" }],
        dots: [{ x: al, y: gp(al), said: `두 그래프가 만나는 점(x좌표 ${al})`.replace(/-/g, '−') }, { x: be, y: gp(be), said: `두 그래프가 만나는 점(x좌표 ${be})` }],
        say: `포물선 y = f′(x)는 ${A > 0 ? '아래로' : '위로'} 볼록하고, x < ${al}, x > ${be}에서 직선 y = g′(x)보다 ${A > 0 ? '위' : '아래'}에, 그 사이에서는 ${A > 0 ? '아래' : '위'}에 있다.`.replace(/-(\d)/g, '−$1') });
      const H = (x) => A * (x - al) * (x - be), sumT = d.bool(), mid = (al + be) / 2;
      const sumV = sumT ? al + be : al + be + d.pick([-1, 1]);
      const [u, v] = d.pick([[al, mid], [mid, be], [be, be + 1], [al - 1, al]].filter(([s, t]) => Number.isInteger(s) && Number.isInteger(t)).concat([[al, be]]));
      const decr = H((u + v) / 2) < 0;
      const w = d.pick([al, be]), minAt = A > 0 ? be : al;
      const rows = [[`방정식 ${is(`${V('h')}′(${X})`, 0)}의 모든 실근의 합은 ${jh(iq(sumV), '이다/이다')}.`, sumV === al + be],
        [`열린구간 ${jh(iv(u, v, true), '에서/에서')} 함수 ${V('h')}(${X})는 감소한다.`, decr],
        [`함수 ${V('h')}(${X})는 ${is(X, w)}에서 극소이다.`, w === minAt]];
      return comboPick(d, `삼차함수 ${Fv}(${X})와 이차함수 ${V('g')}(${X})의 도함수 ${is(Y, `${FP}(${X})`)}, ${is(Y, `${V('g')}′(${X})`)}의 그래프가 그림과 같다. ${is(`${V('h')}(${X})`, `${Fv}(${X}) ${MINUS} ${V('g')}(${X})`)}라 할 때, 옳은 것만을 있는 대로 고른 것은?`, rows.map((r) => r[0]), rows.map((r) => r[1]),
        `${is(`${V('h')}′(${X})`, `${FP}(${X}) ${MINUS} ${V('g')}′(${X})`)}이므로 두 그래프가 만나는 ${is(X, al)}, ${is(X, be)}에서 ${is(`${V('h')}′(${X})`, 0)}이고, ${FP}(${X})의 그래프가 ${V('g')}′(${X})의 그래프보다 위에 있는 곳에서 ${V('h')}′(${X}) &gt; 0이다. ${V('h')}′(${X})의 부호는 ${is(X, al)}의 좌우에서 ${A > 0 ? '+에서 −로' : '−에서 +로'}, ${is(X, be)}의 좌우에서 ${A > 0 ? '−에서 +로' : '+에서 −로'} 바뀌므로 극소인 곳은 ${is(X, minAt)}이다.`,
        { figure: fig + lines(rows.map((r, i) => `<b>${GA[i]}.</b> ${r[0]}`)) });
    }, { standard: S7 }),
    T('ext-cards', '조건을 모두 만족시키는 삼차함수 고르기', '①41', (d) => {
      const al = d.int(-3, 1), be = d.int(al + 1, 3), dd = d.int(-6, 6);
      if ((al + be) % 2) return null;
      const target = cubicCrit(1, al, be, dd), vM = pval(target, al), vm = pval(target, be);
      // 조건: [글, 검사 함수]
      const crit = (a) => { const D = a[2] * a[2] - 3 * a[1]; if (D <= 0) return null; const r = Math.sqrt(D); return [(-a[2] - r) / 3, (-a[2] + r) / 3]; };
      const near = (x, y) => Math.abs(x - y) < 1e-9;
      const C1 = [`${FP}(${iq(al)}) = 0`, (a) => near(pval(pder(a), al), 0)];
      const C2 = [`${is(X, be)}에서 극값을 갖는다.`, (a) => { const c = crit(a); return Boolean(c) && (near(c[0], be) || near(c[1], be)); }];
      const C3 = [`극댓값이 ${jh(iq(vM), '이다/이다')}.`, (a) => { const c = crit(a); return Boolean(c) && near(pval(a, c[0]), vM); }];
      const C4 = [`극솟값이 ${jh(iq(vm), '이다/이다')}.`, (a) => { const c = crit(a); return Boolean(c) && near(pval(a, c[1]), vm); }];
      const conds = d.pick([[C1, C4], [C2, C3], [C1, C2, C3], [C3, C4], [C2, C4]]);
      // 틀린 보기: 상수항을 바꾼 것, 극점을 옮긴 것, 극값이 없는 것, 부호를 바꾼 것
      const cands = [padd(target, [d.pick([-2, -1, 1, 2])]), cubicCrit(1, al, be + 2, dd), cubicCrit(1, al - 2, be, dd), cubicCrit(1, be, be + 2, dd), cubicCrit(1, al - 2, al, dd),
        [dd, 3 * al * al, -3 * al, 1], [dd + vM - pval(cubicCrit(1, al, be + 2, 0), al), ...cubicCrit(1, al, be + 2, 0).slice(1)], [vm - pval(cubicCrit(1, be - 2, be, 0), be), ...cubicCrit(1, be - 2, be, 0).slice(1)]]
        .filter((a) => a.every(Number.isInteger) && big(a) <= 60);
      const ok = (a) => conds.every(([, test]) => test(a));
      if (!ok(target)) return null;
      const wrongs = cands.filter((a) => !ok(a)).map((a) => fIs(a));
      if (big(target) > 60) return null;
      return pick5(d, `최고차항의 계수가 1인 삼차함수 ${Fv}(${X})가 다음 조건을 모두 만족시킬 때, ${Fv}(${X})로 알맞은 것은?`, fIs(target), wrongs, {
        figure: lines(conds.map(([t], i) => `(${['가', '나', '다'][i]}) ${t}`)),
        explain: `${is(`${FP}(${X})`, ptext(pder(target)))} = ${nb(`3${facT(al)}${facT(be)}`)}이므로 ${Fv}(${X})는 ${is(X, al)}에서 극대, ${is(X, be)}에서 극소이고 극댓값은 ${iq(vM)}, 극솟값은 ${jh(iq(vm), '이다/이다')}. 다른 함수는 극값을 갖는 ${X}의 값이나 극값이 조건과 다르다.` });
    }, { standard: S7 })
  ];

  B.addTypes('11-2-4', 'incr', incr);
  B.addTypes('11-2-4', 'ext', ext);
})(typeof window !== 'undefined' ? window : globalThis);
