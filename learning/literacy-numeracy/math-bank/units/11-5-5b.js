// 고등학교 미적분Ⅱ Ⅱ-3 도함수의 활용 — 뒤쪽 묶음(그래프의 개형과 극값, 최댓값과 최솟값, 방정식·부등식에의 활용, 평면 위를 움직이는 점의 속도와 가속도).
// 단원 틀·싣는 기준·뺀 것과 까닭은 11-5-5a.js 머리에 적었다. 도구는 B.kit.u55x(a 파일)를 쓴다.
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, N, M, C, inline } = B.kit;
  const { LAB, MINUS, Q, nb, V, sup, nz, grp, rt, radAns, sqParts, gcd } = B.kit.mid;
  const { jh, ln, trig, pw, coordAns, signed, lim } = B.kit.hs;
  const K = B.kit.u55x;
  const { S9, S10, S11, X, Y, Tv, Av, Bv, Kv, Fv, E, PI, INF, FP, FPP, T, near, toQ, qt, jq, qj, par, R, one, neg, scl, add, sub, numH, ptH, ptS, is, yIs, fIs, ePow, piOver, lin, ptext, pval,
    vals, numAns, pickBy, numChoice, textChoice, figOpt, udTable, mini, stripH } = K;
  const X2 = X + sup(2);
  const dt = (v) => frac(`${V('d')}${v}`, `${V('d')}${Tv}`), dt2 = (v) => frac(`${V('d')}${sup(2)}${v}`, `${V('d')}${Tv}${sup(2)}`);
  const cf = (c) => (c === 1 ? '' : c === -1 ? MINUS : String(c));          // 문자 앞 계수(1, −1 은 생략)
  const tl = (c) => (c ? ` ${c < 0 ? MINUS : '+'} ${Math.abs(c)}` : '');    // 뒤에 잇는 상수항
  const tlx = (c, v) => (c ? ` ${c < 0 ? MINUS : '+'} ${Math.abs(c) === 1 ? '' : Math.abs(c)}${v}` : '');   // 뒤에 잇는 문자항

  // ════════════════════════════════════════════════════════════════
  // 그래프의 개형과 극값
  // ════════════════════════════════════════════════════════════════
  // 개형 보기의 곡선: [식 글, 함수, x 범위, y 범위, 풀이]
  const SHAPES = [
    [[frac(X, `${X2} + 1`), (x) => x / (x * x + 1), [-4.5, 4.5], [-0.8, 0.8], `원점에 대하여 대칭이고 ${is(X, MINUS + '1')}에서 극소, ${is(X, 1)}에서 극대이며 ${X} → ±${INF}일 때 0에 가까워진다`],
      [`${X}${ePow(MINUS + X)}`, (x) => x * Math.exp(-x), [-1.2, 5.5], [-1.2, 0.6], `${is(X, 1)}에서 극대이고 ${X} → ${INF}일 때 0에 가까워지며 ${X} → ${MINUS}${INF}일 때 ${MINUS}${INF}로 내려간다`],
      [`${X}${ePow(X)}`, (x) => x * Math.exp(x), [-5.5, 1.2], [-0.6, 1.2], `${is(X, MINUS + '1')}에서 극소이고 ${X} → ${MINUS}${INF}일 때 0에 가까워지며 ${X} → ${INF}일 때 한없이 커진다`],
      [ePow(`${MINUS}${X2}`), (x) => Math.exp(-x * x), [-2.6, 2.6], [-0.3, 1.3], `${Y}축에 대하여 대칭이고 ${is(X, 0)}에서 극대이며 ${X} → ±${INF}일 때 0에 가까워진다`],
      [frac(ln(X), X), (x) => (x > 0 ? Math.log(x) / x : NaN), [-0.6, 9], [-1.2, 0.6], `${X} &gt; 0에서만 정의되고 ${is(X, E)}에서 극대이며 ${X} → 0+일 때 ${MINUS}${INF}, ${X} → ${INF}일 때 0에 가까워진다`]],
    [[`${X} ${ln(X)}`, (x) => (x > 0 ? x * Math.log(x) : NaN), [-0.4, 2.2], [-0.6, 1.5], `${X} &gt; 0에서만 정의되고 ${is(X, frac(1, E))}에서 극소이며 ${X} → 0+일 때 0에 가까워진다`],
      [ln(`(${X2} + 1)`), (x) => Math.log(x * x + 1), [-3.2, 3.2], [-0.4, 2.4], `원점을 지나고 ${Y}축에 대하여 대칭이며 ${is(X, '±1')}에서 볼록이 바뀐다`],
      [`${X2}${ePow(X)}`, (x) => x * x * Math.exp(x), [-5.5, 1], [-0.25, 1], `${is(X, MINUS + '2')}에서 극대, ${is(X, 0)}에서 극소이고 ${X} → ${MINUS}${INF}일 때 0에 가까워진다`],
      [ePow(X2), (x) => Math.exp(x * x), [-1.6, 1.6], [-0.4, 3.2], `${Y}축에 대하여 대칭이고 ${is(X, 0)}에서 극소 1이며 늘 아래로 볼록하다`],
      [`${X2}${ePow(MINUS + X)}`, (x) => x * x * Math.exp(-x), [-1, 5.5], [-0.25, 1], `${is(X, 0)}에서 극소, ${is(X, 2)}에서 극대이고 ${X} → ${INF}일 때 0에 가까워진다`]]
  ];

  const graph = [
    T('graph-shape', '함수의 그래프의 개형 고르기', '①25', (d, n) => {
      const pool = SHAPES[n], right = d.pick(pool), others = d.shuffle(pool.filter((s) => s !== right)).slice(0, 3);
      const rows = d.shuffle([right].concat(others)), at = rows.indexOf(right);
      return C(`함수 ${yIs(right[0])}의 그래프의 개형으로 알맞은 것은?`, rows.map((s, i) => figOpt(LAB[i], mini(s[1], s[2], s[3]))), at, {
        explain: `도함수와 이계도함수로 증가·감소, 극값, 볼록을 조사하고 ${X} → ±${INF}일 때의 극한을 보면 곡선 ${jh(yIs(right[0]), '은/는')} ${right[4]}. 이것과 맞는 그래프는 ${LAB[at]}이다.`,
        facts: { truth: rows.map((s) => s === right), want: true } });
    }, { count: 2, standard: S9 }),

    T('graph-compare', '그래프의 개형으로 두 수의 대소 비교', '①26', (d) => {
      // [밑 글, 값] — e 이상인 두 수 a < b 이면 aᵇ > bᵃ (ln x / x 가 x > e 에서 감소), x ≠ e 이면 eˣ > xᵉ
      const NUMS = { e: [E, Math.E], pi: [PI, Math.PI], 3: ['3', 3], 4: ['4', 4], 2: ['2', 2], 5: ['5', 5] };
      const [ka, kb] = d.pick([['e', 'pi'], ['e', '3'], ['2', 'e'], ['e', '4'], ['3', 'pi'], ['pi', '4'], ['pi', '5']]);
      const [ha, va] = NUMS[ka], [hb, vb] = NUMS[kb], P1 = pw(ha, hb), P2 = pw(hb, ha), v1 = va ** vb, v2 = vb ** va;
      const swap = d.bool(), A = swap ? P2 : P1, Bq = swap ? P1 : P2, vA = swap ? v2 : v1, vB = swap ? v1 : v2;
      const opts = [`${A} &gt; ${Bq}`, `${A} = ${Bq}`, `${A} &lt; ${Bq}`], truth = [vA > vB, false, vA < vB];
      const viaE = ka === 'e' || kb === 'e';
      return C(`두 수 ${A}, ${jh(Bq, '의/의')} 대소 관계로 옳은 것은?`, opts, truth.indexOf(true), {
        explain: viaE
          ? `${X} &gt; 0에서 ${jh(fIs(`${X} ${MINUS} ${E} ${ln(X)}`, 'f'), '이라/라')} 하면 ${is(`${FP}(${X})`, frac(`${X} ${MINUS} ${E}`, X))}이므로 ${Fv}(${X})는 ${is(X, E)}에서 최솟값 0을 갖는다. ${ka === 'e' ? hb : ha} ≠ ${E}이므로 ${Fv}(${ka === 'e' ? hb : ha}) &gt; 0, 곧 ${ka === 'e' ? hb : ha} &gt; ${E} ${ln(ka === 'e' ? hb : ha)}이므로 ${pw(E, ka === 'e' ? hb : ha)} &gt; ${jh(pw(ka === 'e' ? hb : ha, E), '이다/이다')}.`
          : `${jh(fIs(frac(ln(X), X), 'g'), '이라/라')} 하면 ${is(`${V('g')}′(${X})`, frac(`1 ${MINUS} ${ln(X)}`, X2))}이므로 ${X} &gt; ${E}에서 ${V('g')}(${X})는 감소한다. ${E} &lt; ${ha} &lt; ${hb}이므로 ${frac(ln(ha), ha)} &gt; ${frac(ln(hb), hb)}, 곧 ${hb} ${ln(ha)} &gt; ${ha} ${ln(hb)}이고 ${pw(ha, hb)} &gt; ${pw(hb, ha)}이다.`,
        facts: { truth, want: true } });
    }, { standard: S9 }),

    T('graph-extconst', '극값을 갖는 점으로 상수를 정한 뒤 다른 극값', '①28', (d) => {
      // f(x) = (mx + k)/(x² + c): f′ 의 분자 −m x² − 2k x + mc, 두 근의 곱 −c, 합 −2k/m. 작은 근에서 극소, 큰 근에서 극대(m > 0).
      const m = d.pick([1, 2, 3, 4]), c = d.pick([2, 3, 4, 6, 8, 12]), g = d.pick([-1, -2, -3, -4, 1, 2, 3, 4, 6]), o = -c / g;
      if (!Number.isInteger(o) || o === g) return null;
      const k = -m * (g + o) / 2;
      if (!Number.isInteger(k) || !k) return null;
      const lo = Math.min(g, o), hi = Math.max(g, o), givenMin = g === lo, other = givenMin ? hi : lo;
      const v = toQ((m * other + k) / (other * other + c));
      const oE = `(0-${c}/${jq(g)})`, kE = `(0-${m}*(${jq(g)}+${oE})/2)`;
      return numAns(`함수 ${fIs(frac(`${cf(m)}${X} + ${Kv}`, `${X2} + ${c}`))}가 ${is(X, g)}에서 ${givenMin ? '극솟값' : '극댓값'}을 가질 때, 함수 ${Fv}(${X})의 ${givenMin ? '극댓값' : '극솟값'}은? (단, ${Kv}는 상수이다.)`, v, {
        explain: `${is(`${FP}(${X})`, frac(`${MINUS}${cf(m)}${X2} ${MINUS} 2${Kv}${X} + ${m * c}`, `(${X2} + ${c})${sup(2)}`))}이고 ${is(`${FP}(${qt(g)})`, 0)}에서 ${is(Kv, k)}이다. 분자 ${MINUS}${cf(m)}${X2}${tlx(-2 * k, X)}${tl(m * c)} = 0의 근은 ${X} = ${qt(lo)}, ${jh(qt(hi), '이고/이고')} 분자의 최고차항의 계수가 음수이므로 ${is(X, lo)}에서 극소, ${is(X, hi)}에서 극대이다. 구하는 값은 ${Fv}(${qt(other)}) = ${qt(v)}이다.`,
        facts: { value: `(${m}*${oE}+${kE})/(${oE}*${oE}+${c})`, derived: [2] } });
    }, { standard: S9 }),

    T('graph-incr', '실수 전체에서 증가할 조건', '①30', (d) => {
      if (d.bool()) {
        // f(x) = mx − ln(x² + k): f′ ≥ 0 ⇔ m x² − 2x + mk ≥ 0 ⇔ 1 − m²k ≤ 0
        const mq = d.pick([Q(1, 1), Q(2, 1), Q(3, 1), Q(1, 2)]), mv = mq.p / mq.q, v = toQ(1 / (mv * mv));
        const mH = mq.q === 1 ? `${cf(mq.p)}${X}` : frac(X, mq.q);
        return numAns(`함수 ${jh(fIs(`${mH} ${MINUS} ${ln(`(${X2} + ${Kv})`)}`), '이/가')} 실수 전체의 집합에서 증가하도록 하는 양수 ${Kv}의 최솟값은?`, v, {
          explain: `${is(`${FP}(${X})`, `${mq.q === 1 ? mq.p : frac(1, mq.q)} ${MINUS} ${frac(`2${X}`, `${X2} + ${Kv}`)}`)} ≥ 0이 모든 실수 ${X}에서 성립해야 한다. 분모가 양수이므로 ${nb(`${mq.q === 1 ? cf(mq.p) : frac(1, mq.q)}${X2} ${MINUS} 2${X} + ${mq.q === 1 ? cf(mq.p) : frac(1, mq.q)}${Kv} ≥ 0`)}이고, 판별식 ≤ 0에서 ${Kv} ≥ ${jh(qt(v), '이다/이다')}. 최솟값은 ${jh(qt(v), '이다/이다')}.`,
          facts: { value: `1/(${jq(mv)}*${jq(mv)})` } });
      }
      // f(x) = x − a ln(x² + s²) (a > 0): f′ ≥ 0 ⇔ x² − 2ax + s² ≥ 0 ⇔ a ≤ s
      const s = d.pick([1, 2, 3, 4]);
      return numAns(`함수 ${jh(fIs(`${X} ${MINUS} ${Av} ${ln(`(${X2} + ${s * s})`)}`), '이/가')} 실수 전체의 집합에서 증가하도록 하는 양수 ${Av}의 최댓값은?`, s, {
        explain: `${is(`${FP}(${X})`, `1 ${MINUS} ${frac(`2${Av}${X}`, `${X2} + ${s * s}`)}`)} ≥ 0에서 ${nb(`${X2} ${MINUS} 2${Av}${X} + ${s * s} ≥ 0`)}이 모든 실수 ${X}에서 성립해야 하므로 판별식 ≤ 0, 곧 ${nb(`${Av}${sup(2)} ≤ ${s * s}`)}이다. 양수 ${Av}의 최댓값은 ${jh(String(s), '이다/이다')}.`,
        facts: { value: String(s), derived: [s] } });
    }, { standard: S9 })
  ];

  // ════════════════════════════════════════════════════════════════
  // 최댓값과 최솟값
  // ════════════════════════════════════════════════════════════════
  const mmPair = (mx, mn) => `최댓값 ${numH(mx)}, 최솟값 ${numH(mn)}`;
  const pairChoice = (d, text, right, wrongs, o) => pickBy(d, text, right, wrongs.filter((w) => w && w[0] && w[1]), (p) => [p[0].v, p[1].v], (p) => mmPair(p[0], p[1]), o);
  const ivC = (a, b) => nb(`[${a}, ${b}]`);

  const maxmin = [
    T('mm-closed', '닫힌구간에서 최댓값과 최솟값', '②1', (d, n) => {
      const ask = (text, mx, mn, o) => M(text, [{ lead: '최댓값', answer: mx, signed: true }, { lead: '최솟값', answer: mn, signed: true }], Object.assign({ shown: `최댓값 ${signed(mx)}, 최솟값 ${signed(mn)}` }, o));
      if (n === 0) {
        const fam = d.int(0, 2);
        if (fam === 0) {
          // f(x) = ax/(x² + bx + s²): x = s 에서 최대 a/(2s + b), x = −s 에서 최소 −a/(2s − b)
          const s = d.pick([1, 2, 3]), b = d.int(-2, 2), u1 = 2 * s + b, u2 = 2 * s - b;
          if (u1 <= 0 || u2 <= 0 || b * b >= 4 * s * s) return null;
          const a = (u1 * u2 / gcd(u1, u2)) * d.pick([1, 2]), p = -s - d.pick([1, 2]), q = s + d.pick([1, 2]);
          if (a > 40) return null;
          const fx = (x) => `${a}*${x}/(${x}*${x}+${jq(b)}*${x}+${s * s})`;
          const den = `${X2}${tlx(b, X)} + ${s * s}`;
          return ask(`닫힌구간 ${ivC(qt(p), qt(q))}에서 함수 ${fIs(frac(`${a}${X}`, den))}의 최댓값과 최솟값은?`, a / u1, -a / u2, {
            explain: `${is(`${FP}(${X})`, frac(`${MINUS}${a}(${X2} ${MINUS} ${s * s})`, `(${den})${sup(2)}`))}이므로 ${FP}(${X}) = 0에서 ${is(X, MINUS + s)} 또는 ${is(X, s)}이다. 증감표를 그리면 ${is(X, s)}에서 극대이자 최대 ${Fv}(${s}) = ${signed(a / u1)}, ${is(X, MINUS + s)}에서 극소이자 최소 ${Fv}(${MINUS}${s}) = ${signed(-a / u2)}이고 끝값 ${Fv}(${qt(p)}), ${Fv}(${qt(q)})는 그 사이에 있다.`,
            facts: { calc: [[fx(s), 0], [fx(`(-${s})`), 1]], derived: [s] } });
        }
        if (fam === 1) {
          // f(x) = ax + b/x², b = a·x0³/2: [x0/2, 2x0] 에서 최솟값 f(x0) = 3a·x0/2, 최댓값 f(x0/2) = 5a·x0/2
          const a = d.pick([2, 4, 6]), x0 = d.pick([1, 2]), b = a * x0 ** 3 / 2, lo = x0 / 2, hi = 2 * x0;
          if (b > 30) return null;
          const fE = (x) => `${a}*${x}+${b}/(${x}*${x})`;
          return ask(`닫힌구간 ${ivC(qt(lo), qt(hi))}에서 함수 ${fIs(`${a}${X} + ${frac(b, X2)}`)}의 최댓값과 최솟값은?`, 5 * a * x0 / 2, 3 * a * x0 / 2, {
            explain: `${is(`${FP}(${X})`, `${a} ${MINUS} ${frac(2 * b, X + sup(3))}`)} = 0에서 ${is(X, x0)}이고, 이 점에서 극소이자 최소 ${Fv}(${x0}) = ${3 * a * x0 / 2}이다. 끝값은 ${Fv}(${qt(lo)}) = ${5 * a * x0 / 2}, ${Fv}(${hi}) = ${qt(toQ(2 * a * x0 + b / (4 * x0 * x0)))}이므로 최댓값은 ${5 * a * x0 / 2}이다.`,
            facts: { calc: [[fE(jq(lo)), 0], [fE(jq(x0)), 1]], derived: [x0] } });
        }
        // f(x) = x² − c/x (x > 0 에서 늘 증가): 끝값이 최대·최소
        const p = d.pick([1, 2]), q = p === 1 ? 2 : 4, c = d.pick([2, 4, 6, 8, 12]) * (p === 2 ? 2 : 1);
        if (c % q || c % p) return null;
        const fE = (x) => `${x}*${x}-${c}/${x}`;
        return ask(`닫힌구간 ${ivC(p, q)}에서 함수 ${fIs(`${X2} ${MINUS} ${frac(c, X)}`)}의 최댓값과 최솟값은?`, q * q - c / q, p * p - c / p, {
          explain: `${is(`${FP}(${X})`, `2${X} + ${frac(c, X2)}`)} &gt; 0이므로 ${Fv}(${X})는 이 구간에서 증가한다(극값이 없다). 최댓값은 ${Fv}(${q}) = ${signed(q * q - c / q)}, 최솟값은 ${Fv}(${p}) = ${signed(p * p - c / p)}이다.`,
          facts: { calc: [[fE(q), 0], [fE(p), 1]] } });
      }
      // 초월함수: 최댓값과 최솟값을 함께 고른다
      const fam = d.int(0, 3);
      let fH, ivH2, mx, mn, told, wr;
      if (fam === 0) {
        const [c, j] = d.pick([[2, 1], [3, 2], [4, 2], [5, 2]]), fe = add(one(1, 'e^' + j), R(-c * j)), cl = c === 4 ? one(-8, 'ln2') : one(-c, 'ln' + c);
        mn = add(R(c), cl); mx = fe.v > 1 ? fe : R(1);
        fH = `${X} ${MINUS} ${c}${ln(X)}`; ivH2 = ivC(1, j === 1 ? E : pw(E, j));
        told = `${is(`${FP}(${X})`, `1 ${MINUS} ${frac(c, X)}`)} = 0에서 ${is(X, c)}이고 이 점에서 극소이자 최소 ${jh(numH(mn), '이다/이다')}. 끝값은 ${Fv}(1) = 1, ${Fv}(${j === 1 ? E : pw(E, j)}) = ${numH(fe)}이므로 최댓값은 ${jh(numH(mx), '이다/이다')}`;
        wr = [[mx, add(R(c), one(c, 'ln' + c))], [fe.v > 1 ? R(1) : fe, mn], [mn, mx], [mx, R(1 - c)], [add(R(c), one(c, 'ln' + c)), mn]];
      } else if (fam === 1) {
        const k = d.pick([1, 2]), q = 3; mx = one(Q(1, k), 'e^-1'); mn = R(0);
        fH = `${X}${ePow(k === 1 ? MINUS + X : MINUS + k + X)}`; ivH2 = ivC(0, q);
        told = `${is(`${FP}(${X})`, `(1 ${MINUS} ${k === 1 ? '' : k}${X})${ePow(k === 1 ? MINUS + X : MINUS + k + X)}`)} = 0에서 ${is(X, qt(1 / k))}이고 이 점에서 최대 ${jh(numH(mx), '이다/이다')}. 끝값 ${Fv}(0) = 0, ${Fv}(${q}) = ${numH(one(q, 'e^-' + 3 * k))}이므로 최솟값은 0이다`;
        wr = [[mx, one(q, 'e^-' + 3 * k)], [one(1, 'e^-1').v === mx.v ? one(Q(1, 2), 'e^-1') : one(1, 'e^-1'), R(0)], [R(1 / k), R(0)], [mx, one(-1, 'e^-1')], [one(k, 'e^-1'), R(0)]];
      } else if (fam === 2) {
        const sinTop = d.bool();
        if (sinTop) { fH = frac(trig('sin', X), `${trig('cos', X)} + 2`); ivH2 = ivC(0, PI); mx = one(Q(1, 3), 'r3'); mn = R(0); told = `${is(`${FP}(${X})`, frac(`1 + 2${trig('cos', X)}`, `(${trig('cos', X)} + 2)${sup(2)}`))} = 0에서 ${is(X, piOver(2, 3))}이고 이 점에서 최대 ${frac(rt(3), 3)}이다. 끝값 ${Fv}(0) = ${Fv}(${PI}) = 0이므로 최솟값은 0이다`; }
        else { fH = frac(trig('cos', X), `${trig('sin', X)} + 2`); ivH2 = ivC(0, `2${PI}`); mx = one(Q(1, 3), 'r3'); mn = one(Q(-1, 3), 'r3'); told = `${is(`${FP}(${X})`, `${MINUS}${frac(`2${trig('sin', X)} + 1`, `(${trig('sin', X)} + 2)${sup(2)}`)}`)} = 0에서 ${is(X, piOver(7, 6))} 또는 ${is(X, piOver(11, 6))}이고 ${Fv}(${piOver(7, 6)}) = ${MINUS}${frac(rt(3), 3)}, ${Fv}(${piOver(11, 6)}) = ${frac(rt(3), 3)}, 끝값은 ${frac(1, 2)}이므로 최댓값 ${frac(rt(3), 3)}, 최솟값 ${MINUS}${frac(rt(3), 3)}이다`; }
        wr = [[R(0.5), mn], [mx, R(sinTop ? -0.5 : 0)], [one(Q(1, 2), 'r3'), mn], [mx, sinTop ? one(Q(-1, 3), 'r3') : R(-0.5)], [R(1), R(sinTop ? 0 : -1)]];
      } else {
        const j = d.pick([2, 3]); fH = `${X} ${trig('cos', X)} ${MINUS} ${trig('sin', X)}`; ivH2 = ivC(0, `${j}${PI}`);
        mx = one(2, 'pi'); mn = one(j === 2 ? -1 : -3, 'pi');
        told = `${is(`${FP}(${X})`, `${MINUS}${X} ${trig('sin', X)}`)}이므로 0 &lt; ${X} &lt; ${j}${PI}에서 ${is(X, PI)}${j === 3 ? `, 2${PI}` : ''}일 때 ${FP}(${X}) = 0이다. ${Fv}(0) = 0, ${Fv}(${PI}) = ${MINUS}${PI}, ${Fv}(2${PI}) = 2${PI}${j === 3 ? `, ${Fv}(3${PI}) = ${MINUS}3${PI}` : ''}이므로 최댓값 2${PI}, 최솟값 ${jh(numH(mn), '이다/이다')}`;
        wr = [[mx, one(-1, 'pi').v === mn.v ? one(-3, 'pi') : one(-1, 'pi')], [R(0), mn], [one(j, 'pi'), mn], [one(2, 'pi'), R(0)], [one(1, 'pi'), mn], [one(-1, 'pi'), one(-2, 'pi')]];
      }
      return pairChoice(d, `닫힌구간 ${ivH2}에서 함수 ${fIs(fH)}의 최댓값과 최솟값은?`, [mx, mn], wr, { explain: `${told}.` });
    }, { count: 2, standard: S9 }),

    T('mm-subst', '치환하여 이차함수로 바꾸는 최솟값', '②2', (d) => {
      // f(x) = cos 2x + a cos x + b (0 ≤ x ≤ π): cos x = t 로 2t² + at + b − 1 (−1 ≤ t ≤ 1)
      const a = d.pick([2, -2, 4, -4]), b = d.int(-2, 2), tv = Math.max(-1, Math.min(1, -a / 4)), mv = 2 * tv * tv + a * tv + b - 1;
      const xAt = { '-0.5': [2, 3], '0.5': [1, 3], '-1': [1, 1], '1': [0, 1] }[String(tv)], xN = one(Q(xAt[0], xAt[1]), 'pi'), mN = R(mv);
      const xs = [one(Q(1, 3), 'pi'), one(Q(2, 3), 'pi'), one(1, 'pi'), R(0), one(Q(1, 2), 'pi')];
      const show = (p) => `${Av} = ${numH(p[0])}, ${Bv} = ${numH(p[1])}`;
      const cands = [];
      for (const x of xs) for (const mvv of [mv, mv + 1, b - 1, mv - 1, -mv]) cands.push([x, R(mvv)]);
      const fH = `${trig('cos', `2${X}`)}${tlx(a, trig('cos', X))}${tl(b)}`;
      return pickBy(d, `0 ≤ ${X} ≤ ${PI}에서 함수 ${jh(fIs(fH), '은/는')} ${is(X, Av)}일 때 최솟값 ${jh(Bv, '을/를')} 갖는다. 실수 ${Av}, ${Bv}의 값은?`, [xN, mN], cands.filter((p) => !(near(p[0].v, xN.v) && near(p[1].v, mN.v))), (p) => [p[0].v, p[1].v], show, {
        explain: `${is(trig('cos', `2${X}`), `2${trig('cos', X, 2)} ${MINUS} 1`)}이므로 ${is(trig('cos', X), Tv)}로 놓으면 ${MINUS}1 ≤ ${Tv} ≤ 1이고 ${is(`${Fv}(${X})`, ptext([b - 1, a, 2], Tv))}이다. 이 이차함수는 ${is(Tv, qt(tv))}에서 최솟값 ${jh(qt(mv), '을/를')} 가지므로 ${is(Av, numH(xN))}, ${is(Bv, qt(mv))}이다. (도함수로 풀어도 ${is(`${FP}(${X})`, `${MINUS}${trig('sin', X)}(4${trig('cos', X)}${tl(a)})`)}의 부호로 같은 답을 얻는다.)` });
    }, { standard: S9 }),

    T('mm-gap', '두 그래프 사이 세로 길이의 최솟값', '②3', (d) => {
      if (d.bool()) {
        // y = eˣ + c 와 y = 2x: PQ = eᵏ + c − 2k, k = ln 2 에서 최소 2 − 2ln 2 + c
        const c = d.pick([0, 1, 2]), right = add(R(2 + c), one(-2, 'ln2'));
        const wr = [add(R(2 + c), one(2, 'ln2')), add(R(1 + c), one(-1, 'ln2')), R(1 + c), add(R(c), one(2, 'ln2')), add(R(2 + c), one(-1, 'ln2'))];
        return numChoice(d, `곡선 ${jh(yIs(`${ePow(X)}${tl(c)}`), '과/와')} 직선 ${yIs(`2${X}`)}가 직선 ${is(X, Kv)}와 만나는 점을 각각 P, Q라 할 때, 선분 PQ의 길이의 최솟값은?`, right, wr, {
          explain: `${is('PQ', `${ePow(Kv)}${tl(c)} ${MINUS} 2${Kv}`)}이다. ${jh(fIs(`${ePow(X)}${tl(c)} ${MINUS} 2${X}`, 'g'), '이라/라')} 하면 ${is(`${V('g')}′(${X})`, `${ePow(X)} ${MINUS} 2`)} = 0에서 ${is(X, ln(2))}이고, 이 점에서 최소이므로 최솟값은 ${jh(numH(right), '이다/이다')}.` });
      }
      // y = mx 와 y = ln x: PQ = mk − ln k, k = 1/m 에서 최소 1 + ln m
      const m = d.pick([2, 3, 5]), right = add(R(1), one(1, 'ln' + m));
      const wr = [add(R(1), one(-1, 'ln' + m)), one(1, 'ln' + m), add(R(m), one(-1, 'ln' + m)), add(R(2), one(1, 'ln' + m)), R(1)];
      return numChoice(d, `직선 ${jh(yIs(`${m}${X}`), '과/와')} 곡선 ${yIs(ln(X))}가 직선 ${is(X, Kv)} (${Kv} &gt; 0)와 만나는 점을 각각 P, Q라 할 때, 선분 PQ의 길이의 최솟값은?`, right, wr, {
        explain: `${is('PQ', `${m}${Kv} ${MINUS} ${ln(Kv)}`)}이다. ${jh(fIs(`${m}${X} ${MINUS} ${ln(X)}`, 'g'), '이라/라')} 하면 ${is(`${V('g')}′(${X})`, `${m} ${MINUS} ${frac(1, X)}`)} = 0에서 ${is(X, frac(1, m))}이고, 이 점에서 최소이므로 최솟값은 ${jh(numH(right), '이다/이다')}.` });
    }, { standard: S9 })
  ];

  // ════════════════════════════════════════════════════════════════
  // 방정식에의 활용
  // ════════════════════════════════════════════════════════════════
  const kRange = (lo, hi, loIn, hiIn) => {
    // 범위 글: lo < k < hi (끝은 수·값·±∞)
    const L = lo == null ? '' : `${typeof lo === 'number' ? qt(lo) : numH(lo)} ${loIn ? '≤' : '&lt;'} `, H2 = hi == null ? '' : ` ${hiIn ? '≤' : '&lt;'} ${typeof hi === 'number' ? qt(hi) : numH(hi)}`;
    return nb(`${L}${Kv}${H2}`);
  };
  const eq = [
    T('eq-count', '방정식의 서로 다른 실근의 개수', '②5', (d, n) => {
      if (n === 0) {
        const fam = d.int(0, 4);
        let text, cnt, told, chk;
        if (fam === 0) {
          // eˣ = ex + r: h = eˣ − ex − r, x = 1 에서 최소 −r
          const r = d.int(-3, 3); cnt = r > 0 ? 2 : r === 0 ? 1 : 0;
          text = `${ePow(X)} = ${E}${X}${tl(r)}`;
          told = `${jh(fIs(`${ePow(X)} ${MINUS} ${E}${X}${tl(-r)}`, 'h'), '이라/라')} 하면 ${is(`${V('h')}′(${X})`, `${ePow(X)} ${MINUS} ${E}`)} = 0에서 ${is(X, 1)}이고, ${V('h')}(${X})는 ${is(X, 1)}에서 최솟값 ${jh(signed(-r), '을/를')} 가지며 ${X} → ±${INF}일 때 ${INF}로 커진다`;
          chk = { min: -r };
        } else if (fam === 1) {
          // ln x − mx + c = 0: x = 1/m 에서 최대 c − 1 − ln m
          const [mq, mH, lnm] = d.pick([[1, X, 0], [2, `2${X}`, Math.log(2)], [0.5, frac(X, 2), -Math.log(2)]]), c = d.int(0, 3), mx = c - 1 - lnm;
          if (near(mx, 0) && mq !== 1) return null;
          cnt = near(mx, 0) ? 1 : mx > 0 ? 2 : 0;
          text = `${ln(X)} ${MINUS} ${mH}${tl(c)} = 0`;
          const mxH = mq === 1 ? signed(c - 1) : numH(add(R(c - 1), one(mq === 2 ? -1 : 1, 'ln2')));
          told = `${X} &gt; 0에서 ${jh(fIs(`${ln(X)} ${MINUS} ${mH}${tl(c)}`, 'h'), '이라/라')} 하면 ${is(`${V('h')}′(${X})`, `${frac(1, X)} ${MINUS} ${mq === 1 ? 1 : mq === 2 ? 2 : frac(1, 2)}`)} = 0에서 ${is(X, mq === 1 ? '1' : mq === 2 ? frac(1, 2) : '2')}이고, 이 점에서 최댓값 ${jh(mxH, '을/를')} 가지며 ${X} → 0+, ${X} → ${INF}일 때 ${MINUS}${INF}로 내려간다`;
          chk = { max: mx };
        } else if (fam === 2) {
          // 늘 증가하는 함수: ax − b sin x, ax + b sin x, ax − cos x (a ≥ b)
          const a = d.pick([1, 2, 3]), b = d.pick([1, 2]).valueOf(), kind = d.pick(['sin', 'cos']), sgn = d.pick([1, -1]);
          if (b > a) return null;
          cnt = 1;
          text = `${cf(a)}${X} ${sgn > 0 ? '+' : MINUS} ${cf(b)}${trig(kind, X)} = 0`;
          told = `${jh(fIs(`${cf(a)}${X} ${sgn > 0 ? '+' : MINUS} ${cf(b)}${trig(kind, X)}`, 'h'), '이라/라')} 하면 ${is(`${V('h')}′(${X})`, `${a} ${(kind === 'sin') === (sgn > 0) ? '+' : MINUS} ${cf(b)}${trig(kind === 'sin' ? 'cos' : 'sin', X)}`)} ≥ 0이므로 ${V('h')}(${X})는 늘 증가하고 ${X} → ±${INF}일 때 ±${INF}이다. 그래프는 ${X}축과 한 점에서만 만난다`;
          chk = { monotone: true };
        } else if (fam === 3) {
          // 2√x + 1/x = a: h = 2√x + 1/x − a, x = 1 에서 최소 3 − a
          const a = d.pick([2, 3, 4, 5]); cnt = a > 3 ? 2 : a === 3 ? 1 : 0;
          text = `2${rt(X)} = ${a} ${MINUS} ${frac(1, X)}`;
          told = `${X} &gt; 0에서 ${jh(fIs(`2${rt(X)} + ${frac(1, X)} ${MINUS} ${a}`, 'h'), '이라/라')} 하면 ${is(`${V('h')}′(${X})`, `${frac(1, rt(X))} ${MINUS} ${frac(1, X2)}`)} = 0에서 ${is(X, 1)}이고, 최솟값은 ${V('h')}(1) = ${jh(signed(3 - a), '이다/이다')}. ${X} → 0+, ${X} → ${INF}일 때 ${INF}로 커진다`;
          chk = { min: 3 - a };
        } else {
          // 2√(x − c) = x − d: h = x − d − 2√(x − c) (x ≥ c), x = c + 1 에서 최소 c − 1 − d, h(c) = c − d
          const c = d.int(-2, 3), m0 = d.pick([1, 0, -1, -2]), dd = c - 1 - m0;
          cnt = m0 > 0 ? 0 : m0 === 0 ? 1 : m0 === -1 ? 2 : 1;
          text = `2${rt(lin(1, -c))} = ${lin(1, -dd)}`;
          told = `${fIs(`${lin(1, -dd)} ${MINUS} 2${rt(lin(1, -c))}`, 'h')} (${X} ≥ ${qt(c)})라 하면 ${is(`${V('h')}′(${X})`, `1 ${MINUS} ${frac(1, rt(lin(1, -c)))}`)} = 0에서 ${is(X, c + 1)}이고 최솟값은 ${V('h')}(${qt(c + 1)}) = ${jh(signed(m0), '이다/이다')}. 왼쪽 끝 ${V('h')}(${qt(c)}) = ${jh(signed(m0 + 1), '이고/이고')} ${X} → ${INF}일 때 ${INF}로 커진다`;
          chk = { min: m0, left: m0 + 1 };
        }
        return N(`방정식 ${nb(text)}의 서로 다른 실근의 개수는?`, cnt, { explain: `${told}. 따라서 서로 다른 실근의 개수는 ${jh(String(cnt), '이다/이다')}.`, facts: { check: chk } });
      }
      // 증감표를 주고 개수만
      const kind = d.bool(), c = d.int(-1, 3), mx = c - 1, cnt = mx > 0 ? 2 : mx === 0 ? 1 : 0;
      const fH = kind ? `${X} ${MINUS} ${ePow(X)}${tl(c)}` : `${ln(X)} ${MINUS} ${X}${tl(c)}`;
      const table = kind ? udTable([['⋯', '+', '↗'], ['0', '0', signed(mx)], ['⋯', MINUS, '↘']], `증감표: x가 0일 때 f′(x) = 0, f(x) = ${mx}. 0보다 작은 쪽에서 증가, 큰 쪽에서 감소`)
        : udTable([['(0)', '', ''], ['⋯', '+', '↗'], ['1', '0', signed(mx)], ['⋯', MINUS, '↘']], `증감표: x가 1일 때 f′(x) = 0, f(x) = ${mx}. 0과 1 사이에서 증가, 1보다 큰 쪽에서 감소`);
      return N(`다음은 함수 ${fIs(fH)}의 증가와 감소를 나타낸 표이다. 방정식 ${nb(`${fH} = 0`)}의 서로 다른 실근의 개수는? (단, ${kind ? `${lim('x→∞', 'f(x)')} = ${lim('x→-∞', 'f(x)')} = ${MINUS}${INF}` : `${lim('x→0+', 'f(x)')} = ${lim('x→∞', 'f(x)')} = ${MINUS}${INF}`})`, cnt, {
        figure: table,
        explain: `${Fv}(${X})는 ${is(X, kind ? 0 : 1)}에서 최댓값 ${jh(signed(mx), '을/를')} 갖고 양쪽 끝에서 ${MINUS}${INF}로 내려간다. 최댓값이 ${mx > 0 ? '양수이므로 그래프가 x축과 두 점에서' : mx === 0 ? '0이므로 그래프가 x축과 한 점에서 접하듯' : '음수이므로 그래프가 x축과'} ${mx < 0 ? '만나지 않는다' : '만난다'}. 따라서 실근의 개수는 ${jh(String(cnt), '이다/이다')}.`,
        facts: { check: { max: mx } } });
    }, { count: 2, standard: S10 }),

    T('eq-kall', '실수 k의 값에 따른 실근의 개수', '②6', (d) => {
      // h(x) = x − a ln x (x > 0) 또는 eˣ − ax: 최솟값 a − a ln a
      const a = d.pick([1, 2, 3]), expo = d.bool(), mN = a === 1 ? R(1) : add(R(a), one(-a, 'ln' + a)), fH = expo ? `${ePow(X)} ${MINUS} ${cf(a)}${X}` : `${X} ${MINUS} ${cf(a)}${ln(X)}`;
      const st = (v, c0, c1, c2) => `${kRange(null, v)}이면 ${c0}개, ${is(Kv, typeof v === 'number' ? qt(v) : numH(v))}이면 ${c1}개, ${nb(`${Kv} &gt; ${typeof v === 'number' ? qt(v) : numH(v)}`)}이면 ${c2}개`;
      const right = st(mN, 0, 1, 2);
      const alt = a === 1 ? [R(0), R(2), one(1, 'e^1')] : [add(R(-a), one(a, 'ln' + a)), add(R(a), one(a, 'ln' + a)), R(a)];
      const wr = [st(mN, 2, 1, 0), st(mN, 0, 2, 1), ...alt.map((v) => st(v, 0, 1, 2)), st(mN, 1, 0, 2)];
      return textChoice(d, `방정식 ${nb(`${fH} = ${Kv}`)}의 서로 다른 실근의 개수를 실수 ${Kv}의 값에 따라 바르게 나타낸 것은?`, right, wr, {
        explain: `${expo ? '' : `${X} &gt; 0에서 `}${jh(fIs(fH, 'h'), '이라/라')} 하면 ${is(`${V('h')}′(${X})`, expo ? `${ePow(X)} ${MINUS} ${a}` : `1 ${MINUS} ${frac(a, X)}`)} = 0에서 ${is(X, expo ? (a === 1 ? '0' : ln(a)) : String(a))}이고 이 점에서 최솟값 ${jh(numH(mN), '을/를')} 갖는다. ${expo ? `${X} → ±${INF}` : `${X} → 0+, ${X} → ${INF}`}일 때 ${INF}로 커지므로 직선 ${is(Y, Kv)}와의 교점의 개수로 ${jh(right, '이다/이다')}.` });
    }, { standard: S10 }),

    T('eq-none', '방정식이 실근을 갖지 않을 조건', '②7', (d, n) => {
      if (n === 0) {
        const fam = d.int(0, 2);
        let fH, v, below, told;
        if (fam === 0) {
          const a = d.pick([1, 2, 3]); v = a === 1 ? R(1) : add(R(a), one(-a, 'ln' + a)); fH = `${X} ${MINUS} ${cf(a)}${ln(X)}`; below = true;
          told = `${X} &gt; 0에서 ${jh(fIs(fH, 'h'), '은/는')} ${is(X, a)}에서 최솟값 ${jh(numH(v), '을/를')} 갖고 양쪽 끝에서 ${INF}로 커진다`;
        } else if (fam === 1) {
          const m = d.pick([1, 2, 3]); v = m === 1 ? R(-1) : add(R(-1), one(-1, 'ln' + m)); fH = `${ln(X)} ${MINUS} ${cf(m)}${X}`; below = false;
          told = `${X} &gt; 0에서 ${jh(fIs(fH, 'h'), '은/는')} ${is(X, frac(1, m))}에서 최댓값 ${jh(numH(v), '을/를')} 갖고 양쪽 끝에서 ${MINUS}${INF}로 내려간다`;
        } else {
          const a = d.pick([2, 3]); v = add(R(a), one(-a, 'ln' + a)); fH = `${ePow(X)} ${MINUS} ${a}${X}`; below = true;
          told = `${fIs(fH, 'h')}는 ${is(X, ln(a))}에서 최솟값 ${jh(numH(v), '을/를')} 갖고 ${X} → ±${INF}일 때 ${INF}로 커진다`;
        }
        const vH = numH(v), mk = (op) => nb(`${Kv} ${op} ${vH}`);
        const right = below ? mk('&lt;') : mk('&gt;');
        const wr = [mk('&lt;'), mk('&gt;'), mk('≤'), mk('≥'), nb(`${Kv} ${below ? '&lt;' : '&gt;'} ${numH(neg(v))}`), nb(`${Kv} ${below ? '&lt;' : '&gt;'} ${numH(add(v, R(1)))}`)].filter((s) => s !== right);
        return textChoice(d, `방정식 ${nb(`${fH} = ${Kv}`)}가 실근을 갖지 않도록 하는 실수 ${Kv}의 값의 범위는?`, right, wr, { explain: `${told}. 직선 ${is(Y, Kv)}가 그래프와 만나지 않아야 하므로 ${jh(right, '이다/이다')}.` });
      }
      if (n === 1) {
        // eˣ − x = n − c 또는 x − ln x = n − c (최솟값 1): n − c < 1 인 자연수 n 은 c 개
        const c = d.int(3, 9), expo = d.bool(), fH = expo ? `${ePow(X)} ${MINUS} ${X}` : `${X} ${MINUS} ${ln(X)}`;
        return N(`${X}에 대한 방정식 ${jh(nb(`${fH} = ${V('n')} ${MINUS} ${c}`), '이/가')} 실근을 갖지 않도록 하는 자연수 ${V('n')}의 개수는?`, c, {
          explain: `${expo ? '' : `${X} &gt; 0에서 `}${jh(fIs(fH, 'h'), '은/는')} ${is(X, expo ? 0 : 1)}에서 최솟값 1을 갖고 양쪽 끝에서 ${INF}로 커진다. 실근이 없으려면 ${nb(`${V('n')} ${MINUS} ${c} &lt; 1`)}, 곧 ${nb(`${V('n')} &lt; ${c + 1}`)}이므로 자연수 ${V('n')}은 1부터 ${c}까지 ${c}개이다.`,
          facts: { value: `${c}+1-1`, check: { min: 1 } } });
      }
      // e^{ax} = kx: x = 0 은 근이 아니다. k = e^{ax}/x 의 치역은 (−∞, 0) ∪ [ae, ∞) → 0 ≤ k < ae
      const aq = d.pick([Q(1, 1), Q(2, 1), Q(3, 1), Q(1, 2)]), av = aq.p / aq.q, ae = one(aq, 'e^1'), aeH = numH(ae);
      const exH = ePow(aq.q === 1 ? `${cf(aq.p)}${X}` : frac(X, aq.q));
      const right = nb(`0 ≤ ${Kv} &lt; ${aeH}`);
      const wr = [nb(`0 &lt; ${Kv} &lt; ${aeH}`), nb(`${Kv} &lt; ${aeH}`), nb(`0 ≤ ${Kv} ≤ ${aeH}`), nb(`${Kv} &lt; 0 또는 ${Kv} &gt; ${aeH}`), nb(`0 ≤ ${Kv} &lt; ${numH(one(Q(aq.q, aq.p), 'e^1'))}`), nb(`0 ≤ ${Kv} &lt; ${E}`)].filter((s) => stripH(s) !== stripH(right));
      return textChoice(d, `방정식 ${nb(`${exH} = ${Kv}${X}`)}가 실근을 갖지 않도록 하는 실수 ${Kv}의 값의 범위는?`, right, wr, {
        explain: `${is(X, 0)}은 근이 아니므로 ${jh(is(Kv, frac(exH, X)), '으로/로')} 놓는다. ${jh(fIs(frac(exH, X), 'g'), '은/는')} ${X} &lt; 0에서 음수 전체의 값을 갖고, ${X} &gt; 0에서는 ${is(X, qt(toQ(1 / av)))}에서 최솟값 ${jh(aeH, '을/를')} 갖는다. 따라서 실근이 없는 것은 ${jh(right, '일/일')} 때이다(${is(Kv, 0)}이면 ${exH} = 0이 되어 근이 없으므로 0도 든다).` });
    }, { count: 3, standard: S10 }),

    T('eq-one', '방정식이 오직 하나의 실근을 가질 조건', '②8', (d, n) => {
      if (n === 0) {
        // e^{x+a} − k = e^a x: h = e^{x+a} − e^a x 의 최솟값 e^a (x = 0) — 접할 때 하나
        const a = d.pick([-1, 1, 2, 3]), right = one(1, 'e^' + a), keys = [a + 1, a - 1, 2 * a].filter((v) => v !== a && v !== 0);
        const wr = keys.map((k) => one(1, 'e^' + k)).concat([one(a, 'e^' + a), R(1), one(2, 'e^' + a)]).filter((w) => !near(w.v, right.v));
        const eaH = a === 1 ? E : numH(one(1, 'e^' + a));
        return numChoice(d, `방정식 ${nb(`${ePow(lin(1, a))} ${MINUS} ${Kv} = ${eaH}${X}`)}가 오직 하나의 실근을 갖도록 하는 실수 ${Kv}의 값은?`, right, wr, {
          explain: `${jh(fIs(`${ePow(lin(1, a))} ${MINUS} ${eaH}${X}`, 'h'), '이라/라')} 하면 ${is(`${V('h')}′(${X})`, `${ePow(lin(1, a))} ${MINUS} ${eaH}`)} = 0에서 ${is(X, 0)}이고, ${V('h')}(${X})는 최솟값 ${V('h')}(0) = ${jh(eaH, '을/를')} 가지며 ${X} → ±${INF}일 때 ${INF}로 커진다. 직선 ${is(Y, Kv)}와 한 점에서만 만나려면 ${is(Kv, eaH)}이다.` });
      }
      // (x − 1)eˣ − (e^c/2)x² = k: 극값 f(0) = −1, f(c) = e^c(c − 1 − c²/2)
      const c = d.pick([1, 2, -1]), fc = c === 1 ? one(Q(-1, 2), 'e^1') : c === 2 ? one(-1, 'e^2') : one(Q(-5, 2), 'e^-1');
      const mx = c > 0 ? R(-1) : fc, mn = c > 0 ? fc : R(-1);
      const coef = c === 1 ? frac(E, 2) : c === 2 ? frac(pw(E, 2), 2) : frac(1, `2${E}`);
      const or = (lo, hi) => nb(`${Kv} &lt; ${numH(lo)} 또는 ${Kv} &gt; ${numH(hi)}`);
      const right = or(mn, mx);
      const wr = [or(mx, mn), nb(`${numH(mn)} &lt; ${Kv} &lt; ${numH(mx)}`), nb(`${is(Kv, numH(mn))} 또는 ${is(Kv, numH(mx))}`), nb(`${Kv} &gt; ${numH(mx)}`), nb(`${Kv} &lt; ${numH(mn)}`)];
      return textChoice(d, `방정식 ${nb(`(${lin(1, -1)})${ePow(X)} ${MINUS} ${coef}${X2} = ${Kv}`)}가 오직 하나의 실근을 갖도록 하는 실수 ${Kv}의 값의 범위는?`, right, wr, {
        explain: `${jh(fIs(`(${lin(1, -1)})${ePow(X)} ${MINUS} ${coef}${X2}`, 'f'), '이라/라')} 하면 ${is(`${FP}(${X})`, `${X}(${ePow(X)} ${MINUS} ${c === 1 ? E : c === 2 ? pw(E, 2) : frac(1, E)})`)} = 0에서 ${is(X, 0)} 또는 ${is(X, c)}이다. 극댓값은 ${jh(numH(mx), '이고/이고')} 극솟값은 ${jh(numH(mn), '이며/이며')} ${X} → ${MINUS}${INF}일 때 ${MINUS}${INF}, ${X} → ${INF}일 때 ${INF}이다. 직선 ${is(Y, Kv)}와 한 점에서만 만나려면 ${jh(right, '이다/이다')}.` });
    }, { count: 2, standard: S10 }),

    T('eq-three', '방정식이 서로 다른 세 실근을 가질 조건', '②9', (d, n) => {
      // f(x) = eˣ(x² + bx + c): f′ = eˣ(x² + (b + 2)x + b + c) 의 근 r1 < r2 (정수)
      const r1 = d.int(-5, -1), r2 = d.int(r1 + 1, 2), b = -(r1 + r2) - 2, c = r1 * r2 - b, P = (r) => r * r + b * r + c;
      if (P(r1) <= 0 || P(r2) >= 0 || Math.abs(c) > 12) return null;
      const M1 = r1 === 0 ? R(P(r1)) : one(P(r1), 'e^' + r1), m2 = r2 === 0 ? R(P(r2)) : one(P(r2), 'e^' + r2);
      const inner = `${X2}${tlx(b, X)}${tl(c)}`;
      const between = (lo, hi, a, z) => nb(`${typeof lo === 'number' ? qt(lo) : numH(lo)} ${a ? '≤' : '&lt;'} ${Kv} ${z ? '≤' : '&lt;'} ${typeof hi === 'number' ? qt(hi) : numH(hi)}`);
      const right = between(0, M1);
      const wr = [between(m2, M1), between(m2, 0), between(0, M1, false, true), nb(`${Kv} &gt; ${numH(M1)}`), between(0, one(P(r1), 'e^' + (-r1)))];
      const lead = n === 0 ? `방정식 ${nb(`${ePow(X)}(${inner}) = ${Kv}`)}` : `방정식 ${nb(`${Kv}${ePow(MINUS + X)} = ${inner}`)}`;
      return textChoice(d, `${jh(lead, '이/가')} 서로 다른 세 실근을 갖도록 하는 실수 ${Kv}의 값의 범위는? (단, ${nb(`${lim('x→-∞', `(${inner})${ePow(X)}`)} = 0`)})`, right, wr, {
        explain: `${n === 0 ? '' : `양변에 ${jh(ePow(X), '을/를')} 곱하면 ${nb(`(${inner})${ePow(X)} = ${Kv}`)}이다. `}${jh(fIs(`(${inner})${ePow(X)}`, 'f'), '이라/라')} 하면 ${is(`${FP}(${X})`, `(${X2}${tlx(b + 2, X)}${tl(b + c)})${ePow(X)}`)} = 0에서 ${is(X, r1)} 또는 ${is(X, r2)}이다. 극댓값은 ${jh(numH(M1), '이고/이고')} 극솟값은 ${jh(numH(m2), '이며/이며')} ${X} → ${MINUS}${INF}일 때 0에 가까워지고 ${X} → ${INF}일 때 ${INF}로 커진다. 직선 ${is(Y, Kv)}와 세 점에서 만나려면 ${jh(right, '이다/이다')}(아래 끝은 극솟값이 아니라 점근선 ${is(Y, 0)}이다).` });
    }, { count: 2, standard: S10 })
  ];

  // ════════════════════════════════════════════════════════════════
  // 부등식에의 활용
  // ════════════════════════════════════════════════════════════════
  const ineq = [
    T('ineq-k', '부등식이 늘 성립할 실수 k의 조건', '②13', (d, n) => {
      if (n === 0) {
        if (d.bool()) {
          // x ≥ 0, 2x√x ≥ 3cx + k: 2x√x − 3cx 의 최솟값 −c³ (x = c²)
          const c = d.pick([1, 2, 3]);
          return numAns(`${X} ≥ 0일 때, 부등식 ${jh(nb(`2${X}${rt(X)} ≥ ${cf(3 * c)}${X} + ${Kv}`), '이/가')} 성립하도록 하는 실수 ${Kv}의 최댓값은?`, -c * c * c, {
            explain: `${jh(fIs(`2${X}${rt(X)} ${MINUS} ${3 * c}${X}`), '이라/라')} 하면 ${is(`${FP}(${X})`, `3${rt(X)} ${MINUS} ${3 * c}`)} = 0에서 ${is(X, c * c)}이고 이 점에서 최솟값 ${Fv}(${c * c}) = ${jh(signed(-c * c * c), '을/를')} 갖는다. ${Fv}(${X}) ≥ ${Kv}가 늘 성립하려면 ${Kv} ≤ ${jh(signed(-c * c * c), '이므로/이므로')} 최댓값은 ${signed(-c * c * c)}이다.`,
            facts: { value: `0-(${3 * c}/3)*(${3 * c}/3)*(${3 * c}/3)`, derived: [3] } });
        }
        // x > 0, x + c²/x ≥ k: 최솟값 2c (x = c)
        const c = d.pick([2, 3, 4, 5]);
        return numAns(`${X} &gt; 0일 때, 부등식 ${jh(nb(`${X} + ${frac(c * c, X)} ≥ ${Kv}`), '이/가')} 성립하도록 하는 실수 ${Kv}의 최댓값은?`, 2 * c, {
          explain: `${jh(fIs(`${X} + ${frac(c * c, X)}`), '이라/라')} 하면 ${is(`${FP}(${X})`, `1 ${MINUS} ${frac(c * c, X2)}`)} = 0에서 ${is(X, c)}이고 이 점에서 최솟값 ${jh(String(2 * c), '을/를')} 갖는다. 따라서 ${Kv} ≤ ${jh(String(2 * c), '이고/이고')} 최댓값은 ${2 * c}이다.`,
          facts: { value: `2*${c}`, derived: [c, 2] } });
      }
      if (d.bool()) {
        // x > −1, ln(x + 1) − x/m ≤ k: x = m − 1 에서 최대 ln m − 1 + 1/m
        const m = d.pick([2, 3, 4]), right = add(one(1, 'ln' + m), R(-1 + 1 / m));
        const wr = [add(one(1, 'ln' + m), R(1 - 1 / m)), add(one(1, 'ln' + m), R(-1 / m)), one(1, 'ln' + m), add(one(1, 'ln' + (m - 1)), R(-1 + 1 / m)), add(one(-1, 'ln' + m), R(1 - 1 / m)), R(1 - 1 / m)].filter((w) => w.t.length);
        return numChoice(d, `${X} &gt; ${MINUS}1일 때, 부등식 ${jh(nb(`${ln(`(${lin(1, 1)})`)} ${MINUS} ${frac(X, m)} ≤ ${Kv}`), '이/가')} 성립하도록 하는 실수 ${Kv}의 최솟값은?`, right, wr, {
          explain: `${jh(fIs(`${ln(`(${lin(1, 1)})`)} ${MINUS} ${frac(X, m)}`), '이라/라')} 하면 ${is(`${FP}(${X})`, `${frac(1, lin(1, 1))} ${MINUS} ${frac(1, m)}`)} = 0에서 ${is(X, m - 1)}이고 이 점에서 최댓값 ${jh(numH(right), '을/를')} 갖는다. 따라서 ${Kv} ≥ ${jh(numH(right), '이고/이고')} 최솟값은 ${jh(numH(right), '이다/이다')}.` });
      }
      // x > 0, ln x + c/x ≥ k: x = c 에서 최소 1 + ln c
      const c = d.pick([2, 3, 5]), right = add(R(1), one(1, 'ln' + c));
      const wr = [add(R(1), one(-1, 'ln' + c)), one(1, 'ln' + c), R(1), add(R(c), one(1, 'ln' + c)), add(R(2), one(1, 'ln' + c))];
      return numChoice(d, `${X} &gt; 0일 때, 부등식 ${jh(nb(`${ln(X)} + ${frac(c, X)} ≥ ${Kv}`), '이/가')} 성립하도록 하는 실수 ${Kv}의 최댓값은?`, right, wr, {
        explain: `${jh(fIs(`${ln(X)} + ${frac(c, X)}`), '이라/라')} 하면 ${is(`${FP}(${X})`, frac(`${X} ${MINUS} ${c}`, X2))} = 0에서 ${is(X, c)}이고 이 점에서 최솟값 ${jh(numH(right), '을/를')} 갖는다. 따라서 ${Kv} ≤ ${jh(numH(right), '이고/이고')} 최댓값은 ${jh(numH(right), '이다/이다')}.` });
    }, { count: 2, standard: S10 }),

    T('ineq-exp', '지수함수를 곱해 k를 떼어 낸 부등식', '②14', (d, n) => {
      if (n === 0) {
        // 모든 실수 x: x² + px ≥ k e^{−x} + p ⇔ (x² + px − p)eˣ ≥ k, 최솟값 −p (x = 0)
        const p = d.pick([1, 2, 3, 4]), inner = `${X2} + ${cf(p)}${X} ${MINUS} ${p}`;
        return numAns(`모든 실수 ${X}에 대하여 부등식 ${jh(nb(`${X2} + ${cf(p)}${X} ≥ ${Kv}${ePow(MINUS + X)} + ${p}`), '이/가')} 성립하도록 하는 실수 ${Kv}의 최댓값은? (단, ${nb(`${lim('x→-∞', `(${inner})${ePow(X)}`)} = 0`)})`, -p, {
          explain: `${ePow(X)} &gt; 0이므로 양변에 곱하면 ${nb(`(${inner})${ePow(X)} ≥ ${Kv}`)}이다. ${jh(fIs(`(${inner})${ePow(X)}`), '이라/라')} 하면 ${is(`${FP}(${X})`, `${X}(${lin(1, p + 2)})${ePow(X)}`)} = 0에서 ${is(X, -(p + 2))} 또는 ${is(X, 0)}이다. 극솟값 ${Fv}(0) = ${jh(signed(-p), '은/는')} 음수이고 ${X} → ${MINUS}${INF}일 때 ${Fv}(${X}) → 0이므로 최솟값은 ${jh(signed(-p), '이다/이다')}. 따라서 ${Kv}의 최댓값은 ${signed(-p)}이다.`,
          facts: { value: `0-${p}` } });
      }
      // x ≥ 0: c − x² ≤ k e^{−x/2} ⇔ (c − x²)e^{x/2} ≤ k, x0 에서 최대 4x0·e^{x0/2} (c = x0² + 4x0)
      const x0 = d.pick([1, 2, 3]), c = x0 * x0 + 4 * x0, right = x0 === 1 ? one(4, 'sqe') : x0 === 2 ? one(8, 'e^1') : one(12, 'esqe');
      const wr = [R(c), x0 === 1 ? one(4, 'e^1') : x0 === 2 ? one(8, 'e^2') : one(12, 'e^3'), x0 === 1 ? one(2, 'sqe') : x0 === 2 ? one(4, 'e^1') : one(6, 'esqe'), x0 === 1 ? one(5, 'sqe') : x0 === 2 ? one(12, 'e^1') : one(21, 'esqe'), x0 === 1 ? one(4, 'e^-1') : x0 === 2 ? one(8, 'e^-1') : one(12, 'e^-2')];
      const exH = ePow(`${MINUS}${frac(X, 2)}`), exP = ePow(frac(X, 2));
      return numChoice(d, `${X} ≥ 0일 때, 부등식 ${jh(nb(`${c} ${MINUS} ${X2} ≤ ${Kv}${exH}`), '이/가')} 성립하도록 하는 실수 ${Kv}의 최솟값은?`, right, wr, {
        explain: `양변에 ${jh(exP, '을/를')} 곱하면 ${nb(`(${c} ${MINUS} ${X2})${exP} ≤ ${Kv}`)}이다. ${jh(fIs(`(${c} ${MINUS} ${X2})${exP}`), '이라/라')} 하면 ${is(`${FP}(${X})`, `${MINUS}${frac(1, 2)}(${lin(1, -x0)})(${lin(1, x0 + 4)})${exP}`)}이므로 ${X} ≥ 0에서 ${is(X, x0)}일 때 최댓값 ${jh(numH(right), '을/를')} 갖는다(${Fv}(0) = ${c}보다 크다). 따라서 ${Kv}의 최솟값은 ${jh(numH(right), '이다/이다')}.` });
    }, { count: 2, standard: S10 })
  ];

  // ════════════════════════════════════════════════════════════════
  // 평면 위를 움직이는 점의 속도와 가속도
  // ════════════════════════════════════════════════════════════════
  const posText = (xH, yH) => `좌표평면 위를 움직이는 점 P의 시각 ${Tv}에서의 위치 ${nb(`(${X}, ${Y})`)}가 ${nb(`${X} = ${xH}`)}, ${nb(`${Y} = ${yH}`)}`;
  const tpoly = (a) => ptext(a, Tv);
  const pderA = (a) => (a.length < 2 ? [0] : a.slice(1).map((c, i) => c * (i + 1)));
  const pairV = (v, a) => `속도: (${v[0]}, ${v[1]}), 가속도: (${a[0]}, ${a[1]})`;
  const pairS = (s, a) => `속력: ${s}, 가속도의 크기: ${a}`;
  const sqf = (n) => { const [a, b] = sqParts(n); return { a, b }; };
  const radH = (coef, n) => { const { a, b } = sqf(n); const c = coef * a; return b === 1 ? String(c) : `${c === 1 ? '' : c}${rt(b)}`; };

  const motion = [
    T('mo-va', '시각 t에서의 속도와 가속도', '②16', (d, n) => {
      if (n === 0) {
        // 다항식 성분
        const xa = [d.int(-4, 4), nz(d, -5, 5), d.pick([1, -1, 2]), d.pick([0, 0, 1, -1])], ya = [d.int(-4, 4), d.int(-5, 5), nz(d, -3, 3)];
        const vx = pderA(xa), vy = pderA(ya), ax = pderA(vx), ay = pderA(vy);
        const H = (a) => tpoly(a);
        const right = pairV([H(vx), H(vy)], [H(ax), H(ay)]);
        const wr = [pairV([H(vx), H(vy)], [H(vx), H(vy)]), pairV([H(vy), H(vx)], [H(ay), H(ax)]), pairV([H(vx), H(vy.map((c) => -c))], [H(ax), H(ay.map((c) => -c))]), pairV([H(vx), H(vy)], [H(ax.map((c) => c * 2)), H(ay)]), pairV([H(xa.slice(1)), H(ya.slice(1))], [H(ax), H(ay)])].filter((s) => stripH(s) !== stripH(right));
        return textChoice(d, `${posText(H(xa), H(ya))}일 때, 시각 ${Tv}에서의 점 P의 속도와 가속도는?`, right, wr, {
          explain: `${is(dt(X), H(vx))}, ${is(dt(Y), H(vy))}이므로 속도는 ${nb(`(${H(vx)}, ${H(vy)})`)}이다. ${is(dt2(X), H(ax))}, ${is(dt2(Y), H(ay))}이므로 가속도는 ${nb(`(${H(ax)}, ${H(ay)})`)}이다.` });
      }
      // 지수함수 성분: x = e^{αt}, y = βe^{−t}
      const al = d.pick([1, 2, 3, -2]), be = d.pick([1, -1, 2, -2]), exA = ePow(al === 1 ? Tv : al === -1 ? MINUS + Tv : signed(al) + Tv), exB = ePow(MINUS + Tv);
      const cH = (c, ex) => `${c === 1 ? '' : c === -1 ? MINUS : signed(c)}${ex}`;
      const right = pairV([cH(al, exA), cH(-be, exB)], [cH(al * al, exA), cH(be, exB)]);
      const wr = [pairV([cH(al, exA), cH(be, exB)], [cH(al * al, exA), cH(-be, exB)]), pairV([cH(al, exA), cH(-be, exB)], [cH(al, exA), cH(-be, exB)]), pairV([cH(1, exA), cH(-be, exB)], [cH(1, exA), cH(be, exB)]), pairV([cH(al, exA), cH(-be, exB)], [cH(2 * al, exA), cH(be, exB)]), pairV([cH(al * al, exA), cH(be, exB)], [cH(al, exA), cH(-be, exB)])].filter((s) => stripH(s) !== stripH(right));
      return textChoice(d, `${posText(exA, cH(be, exB))}일 때, 시각 ${Tv}에서의 점 P의 속도와 가속도는?`, right, wr, {
        explain: `${is(dt(X), cH(al, exA))}, ${is(dt(Y), cH(-be, exB))}이므로 속도는 ${nb(`(${cH(al, exA)}, ${cH(-be, exB)})`)}이고, 한 번 더 미분하면 가속도는 ${nb(`(${cH(al * al, exA)}, ${cH(be, exB)})`)}이다.` });
    }, { count: 2, standard: S11 }),

    T('mo-speed', '시각 t에서의 속력과 가속도의 크기', '②17', (d) => {
      const fam = d.int(0, 3);
      let xH, yH, right, wr, told;
      if (fam === 0) {
        // x = t² + 2at, y = 2bt + c: 속력 2√(t² + 2at + a² + b²), 가속도의 크기 2
        const a = nz(d, -3, 3), b = d.pick([1, 2, 3, -1]), c = d.int(-3, 3), inner = (k) => tpoly([a * a + b * b + k, 2 * a, 1]);
        xH = tpoly([0, 2 * a, 1]); yH = tpoly([c, 2 * b]);
        right = pairS(`2${rt(inner(0))}`, '2');
        wr = [pairS(rt(inner(0)), '2'), pairS(`2${rt(inner(1))}`, '2'), pairS(`2${rt(inner(0))}`, '0'), pairS(`2${rt(tpoly([a * a, 2 * a, 1]))}`, '2'), pairS(`2${rt(inner(0))}`, '4')];
        told = `속도는 ${nb(`(${tpoly([2 * a, 2])}, ${signed(2 * b)})`)}이므로 속력은 ${rt(`(${tpoly([2 * a, 2])})${sup(2)} + ${4 * b * b}`)} = 2${rt(inner(0))}이고, 가속도는 (2, 0)이므로 크기는 2이다`;
      } else if (fam === 1) {
        // x = −t³ + pt, y = qt²: 속력 √(9t⁴ + (4q² − 6p)t² + p²), 가속도의 크기 2√(9t² + q²)
        const p = d.pick([1, 2, 3]), q = d.pick([1, 2, 3]), s4 = (k) => rt(tpoly([p * p, 0, 4 * q * q - 6 * p + k, 0, 9]));
        xH = tpoly([0, p, 0, -1]); yH = tpoly([0, 0, q]);
        if (4 * q * q - 6 * p === 0) return null;
        right = pairS(s4(0), `2${rt(tpoly([q * q, 0, 9]))}`);
        wr = [pairS(s4(12 * p), `2${rt(tpoly([q * q, 0, 9]))}`), pairS(s4(0), rt(tpoly([q * q, 0, 9]))), pairS(s4(0), `2${rt(tpoly([q * q, 0, 3]))}`), pairS(s4(-4 * q * q), `2${rt(tpoly([q * q, 0, 9]))}`), pairS(s4(12 * p), rt(tpoly([q * q, 0, 9])))];
        told = `속도는 ${nb(`(${tpoly([p, 0, -3])}, ${tpoly([0, 2 * q])})`)}이므로 속력은 ${s4(0)}이고, 가속도는 ${nb(`(${tpoly([0, -6])}, ${2 * q})`)}이므로 크기는 2${jh(rt(tpoly([q * q, 0, 9])), '이다/이다')}`;
      } else if (fam === 2) {
        // x = eᵗ − 1, y = ct − eᵗ: 속력 √(2e^{2t} − 2ceᵗ + c²), 가속도의 크기 √2 eᵗ
        const c = d.pick([1, 2, 3, 4]), e2 = ePow(`2${Tv}`), e1 = ePow(Tv), inner = (u, w) => `2${e2} ${MINUS} ${cf(u)}${e1} + ${w}`;
        xH = `${e1} ${MINUS} 1`; yH = `${cf(c)}${Tv} ${MINUS} ${e1}`;
        right = pairS(rt(inner(2 * c, c * c)), `${rt(2)}${e1}`);
        wr = [pairS(rt(inner(c, c * c)), `${rt(2)}${e1}`), pairS(rt(inner(2 * c, c * c)), `2${e1}`), pairS(rt(`2${e2} + ${c * c}`), `${rt(2)}${e1}`), pairS(rt(inner(2 * c, c * c)), e1), pairS(rt(inner(4 * c, c * c)), `${rt(2)}${e1}`)];
        told = `속도는 ${nb(`(${e1}, ${c} ${MINUS} ${e1})`)}이므로 속력은 ${jh(rt(inner(2 * c, c * c)), '이고/이고')}, 가속도는 ${nb(`(${e1}, ${MINUS}${e1})`)}이므로 크기는 ${rt(2)}${jh(e1, '이다/이다')}`;
      } else {
        // 사이클로이드 x = r(t − sin t), y = r(1 − cos t): 속력 r√(2 − 2cos t), 가속도의 크기 r
        const r = d.pick([1, 2, 3]), rr = r === 1 ? '' : String(r), in1 = `2 ${MINUS} 2${trig('cos', Tv)}`;
        xH = `${rr}${r === 1 ? `${Tv} ${MINUS} ${trig('sin', Tv)}` : `(${Tv} ${MINUS} ${trig('sin', Tv)})`}`; yH = `${rr}${r === 1 ? `1 ${MINUS} ${trig('cos', Tv)}` : `(1 ${MINUS} ${trig('cos', Tv)})`}`;
        right = pairS(`${rr}${rt(in1)}`, String(r));
        wr = [pairS(`${rr}${rt(`2 + 2${trig('cos', Tv)}`)}`, String(r)), pairS(`${rr}${rt(in1)}`, String(2 * r)), pairS(`${rr}${rt(`1 ${MINUS} ${trig('cos', Tv)}`)}`, String(r)), pairS(`${rr}${rt(in1)}`, r === 1 ? '2' : '1'), pairS(String(r), String(r))];
        told = `속도는 ${nb(`(${rr}${r === 1 ? '' : '('}1 ${MINUS} ${trig('cos', Tv)}${r === 1 ? '' : ')'}, ${rr}${trig('sin', Tv)})`)}이므로 속력은 ${rr}${rt(`(1 ${MINUS} ${trig('cos', Tv)})${sup(2)} + ${trig('sin', Tv, 2)}`)} = ${rr}${rt(in1)}이고, 가속도는 ${nb(`(${rr}${trig('sin', Tv)}, ${rr}${trig('cos', Tv)})`)}이므로 크기는 ${jh(String(r), '이다/이다')}`;
      }
      return textChoice(d, `${posText(xH, yH)}일 때, 시각 ${Tv}에서의 점 P의 속력과 가속도의 크기는?`, right, wr.filter((s) => stripH(s) !== stripH(right)), { explain: `${told}.` });
    }, { standard: S11 }),

    T('mo-at', '정한 시각의 속도·가속도·속력', '②18', (d, n) => {
      if (n < 2) {
        // x = at² + bt + c, y = pt³ + qt + r
        const a = nz(d, -3, 3), b = d.int(-5, 5), c = d.int(-4, 4), p = d.pick([1, -1, 2]), q = d.int(-6, 6), r = d.int(-4, 4), t0 = d.pick([1, 2, 3, -1]);
        const vx = 2 * a * t0 + b, vy = 3 * p * t0 * t0 + q, ax = 2 * a, ay = 6 * p * t0;
        if (n === 0) {
          if (Math.abs(vy) > 60) return null;
          return inline(`${posText(tpoly([c, b, a]), tpoly([r, q, 0, p]))}일 때, 시각 ${is(Tv, t0)}에서의 점 P의 속도와 가속도는?`, `속도 ${grp('({0}, {1})')}<br>가속도 ${grp('({2}, {3})')}`, [vx, vy, ax, ay].map((v) => ({ answer: v, signed: true })), {
            shown: `속도 ${ptH(vx, vy)}, 가속도 ${ptH(ax, ay)}`,
            explain: `${is(dt(X), tpoly([b, 2 * a]))}, ${is(dt(Y), tpoly([q, 0, 3 * p]))}, ${is(dt2(X), 2 * a)}, ${is(dt2(Y), tpoly([0, 6 * p]))}이므로 ${is(Tv, t0)}일 때 속도는 ${ptH(vx, vy)}, 가속도는 ${jh(ptH(ax, ay), '이다/이다')}.`,
            facts: { calc: [[`2*${jq(a)}*${jq(t0)}+${jq(b)}`, 0], [`3*${jq(p)}*${jq(t0)}*${jq(t0)}+${jq(q)}`, 1], [`2*${jq(a)}`, 2], [`6*${jq(p)}*${jq(t0)}`, 3]], derived: [2, 3, 6] } });
        }
        // 속력 a√b
        const S = vx * vx + vy * vy, { a: ra, b: rb } = sqf(S);
        if (rb < 2 || ra < 2 || S > 800 || ra * ra * rb !== S) return null;   // 계수 1 이면 칸 모양이 바뀌어 답을 흘린다
        return radAns(`${posText(tpoly([c, b, a]), tpoly([r, q, 0, p]))}일 때, 시각 ${is(Tv, t0)}에서의 점 P의 속력은?`, ra, rb, {
          explain: `시각 ${is(Tv, t0)}에서 속도는 ${jh(ptH(vx, vy), '이므로/이므로')} 속력은 ${rt(`${par(vx)}${sup(2)} + ${par(vy)}${sup(2)}`)} = ${rt(S)} = ${radH(1, S)}이다.`,
          facts: { calc: [[String(ra), 0], [`((2*${jq(a)}*${jq(t0)}+${jq(b)})*(2*${jq(a)}*${jq(t0)}+${jq(b)})+(3*${jq(p)}*${jq(t0)}*${jq(t0)}+${jq(q)})*(3*${jq(p)}*${jq(t0)}*${jq(t0)}+${jq(q)}))/(${ra}*${ra})`, 1]], derived: [2, 3, ra] } });
      }
      // x = ln(1 + t), y = t² + qt: 속력 √(1 + (2t0 + q)²(1 + t0)²)/(1 + t0)
      const t0 = d.pick([1, 2, 3]), q = d.pick([-8, -6, -4, -2, 2, 4]), vy = 2 * t0 + q, Nn = 1 + vy * vy * (1 + t0) ** 2;
      if (!vy) return null;
      const { a: sa, b: sb } = sqf(Nn);
      if (sb === 1) return null;
      const right = one(Q(sa, 1 + t0), 'r' + sb), mk = (n2, den) => { const { a, b } = sqf(n2); return b === 1 ? R(a / den) : one(Q(a, den), 'r' + b); };
      const wr = [mk(1 + vy * vy, 1 + t0), mk(Nn, 1), mk(1 + vy * vy * (1 + t0) ** 2 + 2, 1 + t0), mk(vy * vy * (1 + t0) ** 2 - 1, 1 + t0), mk(1 + (vy + 2) * (vy + 2) * (1 + t0) ** 2, 1 + t0)];
      return numChoice(d, `${posText(ln(`(1 + ${Tv})`), tpoly([0, q, 1]))}일 때, 시각 ${is(Tv, t0)}에서의 점 P의 속력은?`, right, wr, {
        explain: `${is(dt(X), frac(1, `1 + ${Tv}`))}, ${is(dt(Y), tpoly([q, 2]))}이므로 ${is(Tv, t0)}에서 속도는 ${nb(`(${frac(1, 1 + t0)}, ${signed(vy)})`)}이고 속력은 ${rt(`${frac(1, (1 + t0) ** 2)} + ${vy * vy}`)} = ${jh(numH(right), '이다/이다')}.` });
    }, { count: 3, standard: S11 }),

    T('mo-axis', '위치의 조건으로 시각을 구한 뒤 속력', '②19', (d) => {
      // x = eᵗ − e^c, y = (t + dd)eᵗ: y축 위(x = 0)는 t = c, 속력 e^c √(1 + (c + dd + 1)²)
      const c = d.pick([1, 2, 3]), dd = d.pick([0, 0, 1, -1]), w = c + dd + 1, Nn = 1 + w * w;
      if (!w || sqParts(Nn)[1] === 1) return null;
      const eR = (ce, n2) => { const [a, b] = sqParts(n2); return one(a, { key: `e${ce}r${b}`, h: `${ce === 1 ? E : pw(E, ce)}${b === 1 ? '' : rt(b)}`, v: Math.E ** ce * Math.sqrt(b) }); };
      const right = eR(c, Nn), wr = [eR(c, w * w + 2), eR(2 * c, Nn), eR(c + 1, Nn), eR(c, 1 + (w - 1) * (w - 1)), eR(c, 2 * Nn)].filter((x) => !near(x.v, right.v));
      const eC = c === 1 ? E : pw(E, c);
      return numChoice(d, `${posText(`${ePow(Tv)} ${MINUS} ${eC}`, `${dd ? `(${lin(1, dd, Tv)})` : Tv}${ePow(Tv)}`)}일 때, 점 P가 ${Y}축 위에 있을 때의 속력은?`, right, wr, {
        explain: `${Y}축 위에서는 ${X}좌표가 0이므로 ${is(`${ePow(Tv)} ${MINUS} ${eC}`, 0)}에서 ${is(Tv, c)}이다. ${is(dt(X), ePow(Tv))}, ${is(dt(Y), `${dd + 1 ? `(${lin(1, dd + 1, Tv)})` : Tv}${ePow(Tv)}`)}이므로 이때 속도는 ${nb(`(${eC}, ${w === 1 ? '' : w}${eC})`)}이고 속력은 ${jh(numH(right), '이다/이다')}.` });
    }, { standard: S11 }),

    T('mo-speedtime', '속력이 주어진 값이 되는 시각', '②20', (d, n) => {
      if (n === 0) {
        // x = ln(t + 1), y = at (t > 0): 속력² = 1/(t + 1)² + a²
        const t0 = d.pick([1, 2, 3]), a = d.pick([1, 2]), Nn = 1 + a * a * (t0 + 1) ** 2, { a: sa, b: sb } = sqf(Nn), spd = one(Q(sa, t0 + 1), 'r' + sb);
        return N(`${posText(ln(`(${lin(1, 1, Tv)})`), `${cf(a)}${Tv}`)} (${Tv} &gt; 0)일 때, 점 P의 속력이 ${jh(numH(spd), '이/가')} 되는 시각 ${Tv}의 값은?`, t0, {
          explain: `속도는 ${nb(`(${frac(1, lin(1, 1, Tv))}, ${a})`)}이므로 ${is(rt(`${frac(1, `(${lin(1, 1, Tv)})${sup(2)}`)} + ${a * a}`), numH(spd))}에서 ${is(`(${lin(1, 1, Tv)})${sup(2)}`, (t0 + 1) ** 2)}이고 ${Tv} &gt; 0이므로 ${is(Tv, t0)}이다.`,
          facts: { value: String(t0), derived: [t0], check: { speed2: Nn / (t0 + 1) ** 2 } } });
      }
      // x = p√t, y = q t√t (p = 3qs): 속력은 t = 1 과 t = s² 에서 같고, 두 번째는 t = s² — 그때 속도 (3q/2, 3qs/2)
      const q = d.pick([2, 4]), s = d.pick([2, 3]), p = 3 * q * s, vx = 3 * q / 2, vy = 3 * q * s / 2, spd = one(3 * q / 2, 'r' + (s * s + 1));
      return coordAns(`${posText(`${p}${rt(Tv)}`, `${q}${Tv}${rt(Tv)}`)} (${Tv} &gt; 0)이다. 출발 후 점 P의 속력이 두 번째로 ${jh(numH(spd), '이/가')} 될 때의 속도는?`, [vx, vy], {
        explain: `${is(dt(X), frac(p, `2${rt(Tv)}`))}, ${is(dt(Y), `${3 * q / 2}${rt(Tv)}`)}이므로 속력의 제곱은 ${nb(`${frac(p * p, `4${Tv}`)} + ${9 * q * q / 4}${Tv}`)}이다. 이것이 ${jh(String(9 * q * q / 4 * (s * s + 1)), '이/가')} 되는 시각은 ${is(Tv, 1)}, ${is(Tv, s * s)}이고 두 번째는 ${is(Tv, s * s)}이므로 속도는 ${jh(ptH(vx, vy), '이다/이다')}.`,
        facts: { calc: [[`${p}/(2*${s})`, 0], [`3*${q}*${s}/2`, 1]], derived: [s, 2, 3] } });
    }, { count: 2, standard: S11 }),

    T('mo-accconst', '가속도의 크기로 상수 정하기', '②21', (d, n) => {
      if (n === 0) {
        // x = t, y = a/t: 가속도 (0, 2a/t³)
        const t0 = d.pick([1, 2]), a = t0 === 1 ? d.int(1, 5) : d.pick([4, 8, 12]), g = 2 * a / t0 ** 3;
        return N(`${posText(Tv, frac(Av, Tv))}이다. 시각 ${is(Tv, t0)}에서의 점 P의 가속도의 크기가 ${jh(String(g), '일/일')} 때, 양수 ${Av}의 값은?`, a, {
          explain: `${is(dt(X), 1)}, ${is(dt(Y), `${MINUS}${frac(Av, Tv + sup(2))}`)}이고 ${is(dt2(X), 0)}, ${is(dt2(Y), frac(`2${Av}`, Tv + sup(3)))}이다. ${is(Tv, t0)}에서 가속도의 크기는 ${t0 === 1 ? `2${Av}` : frac(`2${Av}`, t0 ** 3)}이므로 ${is(t0 === 1 ? `2${Av}` : frac(`2${Av}`, t0 ** 3), g)}에서 ${is(Av, a)}이다.`,
          facts: { value: `${g}*${t0}*${t0}*${t0}/2`, derived: [2] } });
      }
      // x = at², y = eᵗ − e^{−t}: t = 1 에서 가속도의 크기² = 4a² + (e − e⁻¹)², 속력² = 4a² + (e + e⁻¹)²
      const a = d.pick([1, 2, 3]), sq = (k) => rt(`${pw(E, 2)} + ${pw(E, -2)}${tl(k)}`);
      const accH = a === 1 ? `${E} + ${frac(1, E)}` : sq(4 * a * a - 2), right = sq(4 * a * a + 2);
      const wr = [sq(4 * a * a - 2), sq(4 * a * a + 6), sq(2 * a * a + 2), sq(a * a + 2), sq(4 * a * a)].filter((s) => stripH(s) !== stripH(right));
      return textChoice(d, `${posText(`${Av}${Tv}${sup(2)}`, `${ePow(Tv)} ${MINUS} ${ePow(MINUS + Tv)}`)} (${Av} &gt; 0)이다. 시각 ${is(Tv, 1)}에서의 점 P의 가속도의 크기가 ${jh(accH, '일/일')} 때, 시각 ${is(Tv, 1)}에서의 점 P의 속력은?`, right, wr, {
        explain: `가속도는 ${nb(`(2${Av}, ${ePow(Tv)} ${MINUS} ${ePow(MINUS + Tv)})`)}이므로 ${is(Tv, 1)}에서 크기의 제곱은 ${nb(`4${Av}${sup(2)} + ${pw(E, 2)} + ${pw(E, -2)} ${MINUS} 2`)}이고, 주어진 값과 견주면 ${is(Av, a)}이다. 속도는 ${nb(`(2${Av}${Tv}, ${ePow(Tv)} + ${ePow(MINUS + Tv)})`)}이므로 ${is(Tv, 1)}에서 속력은 ${rt(`${4 * a * a} + (${E} + ${pw(E, -1)})${sup(2)}`)} = ${jh(right, '이다/이다')}.` });
    }, { count: 2, standard: S11 }),

    T('mo-speedext', '속력의 최댓값·최솟값(이차식·사인값의 범위)', '②22', (d, n) => {
      if (n === 0) {
        // x = pt + c0, y = −rt² + st (t > 0, s = 2r t0): 속력² = p² + (s − 2rt)² → t = t0 에서 최소 |p|
        const p = d.pick([2, 3, 4, 5]), r = d.pick([1, 2, 3]), t0 = d.pick([1, 2]), s = 2 * r * t0, c0 = d.int(-3, 3);
        return M(`${posText(`${p}${Tv}${tl(c0)}`, tpoly([0, s, -r]))} (${Tv} &gt; 0)이다. 점 P의 속력이 시각 ${is(Tv, Av)}일 때 최솟값 ${V('m')}을 가질 때, ${Av}, ${V('m')}의 값은?`, [{ lead: `${Av} =`, answer: t0 }, { lead: `${V('m')} =`, answer: p }], {
          shown: `${is(Av, t0)}, ${is(V('m'), p)}`,
          explain: `속도는 ${nb(`(${p}, ${tpoly([s, -2 * r])})`)}이므로 속력은 ${rt(`${p * p} + (${tpoly([s, -2 * r])})${sup(2)}`)}이고, ${is(Tv, t0)}일 때 최솟값 ${rt(p * p)} = ${jh(String(p), '을/를')} 갖는다.`,
          facts: { calc: [[`${s}/(2*${r})`, 0], [String(p), 1]], derived: [2] } });
      }
      // x = a sin t, y = a cos t + bt: 속력² = a² + b² − 2ab sin t → 최댓값 a + b
      const a = d.pick([1, 2, 3]), b = d.pick([1, 2, 3]);
      return N(`${posText(`${cf(a)}${trig('sin', Tv)}`, `${cf(a)}${trig('cos', Tv)} + ${cf(b)}${Tv}`)}일 때, 점 P의 속력의 최댓값은?`, a + b, {
        explain: `속도는 ${nb(`(${cf(a)}${trig('cos', Tv)}, ${MINUS}${cf(a)}${trig('sin', Tv)} + ${b})`)}이므로 속력의 제곱은 ${nb(`${a * a + b * b} ${MINUS} ${2 * a * b}${trig('sin', Tv)}`)}이다. ${is(trig('sin', Tv), MINUS + '1')}일 때 최대이고 그 값은 ${rt((a + b) ** 2)} = ${a + b}이다.`,
        facts: { value: `${a}+${b}` } });
    }, { count: 2, standard: S11 }),

    T('mo-speedmin', '속력의 최솟값(속력의 제곱을 미분)', '②23', (d) => {
      // x = mt² + c0, y = b√t: 속력² = 4m²t² + b²/(4t), t0 = 1/2 (b = 2m) → 최솟값 √3 m, t0 = 2 (b = 16m) → 4√3 m
      const half = d.bool(), m = half ? d.pick([2, 3, 4]) : d.pick([1, 2, 3]), b = half ? 2 * m : 16 * m, A = half ? m : 4 * m, c0 = d.int(1, 4), t0 = half ? 0.5 : 2;
      return radAns(`${posText(`${cf(m)}${Tv}${sup(2)} + ${c0}`, `${b}${rt(Tv)}`)} (${Tv} &gt; 0)일 때, 점 P의 속력의 최솟값은?`, A, 3, {
        explain: `속도는 ${nb(`(${2 * m}${Tv}, ${frac(b, `2${rt(Tv)}`)})`)}이므로 속력의 제곱은 ${nb(`${fIs(`${4 * m * m}${Tv}${sup(2)} + ${frac(b * b, `4${Tv}`)}`, 'g', Tv)}`)}이다. ${is(`${V('g')}′(${Tv})`, `${8 * m * m}${Tv} ${MINUS} ${frac(b * b, `4${Tv}${sup(2)}`)}`)} = 0에서 ${is(Tv, qt(t0))}이고 이 점에서 최소이므로 ${V('g')}(${qt(t0)}) = ${3 * A * A}, 속력의 최솟값은 ${radH(1, 3 * A * A)}이다.`,
        facts: { calc: [[half ? String(m) : `4*${m}`, 0], ['3', 1]], derived: [3, 4] } });
    }, { standard: S11 }),

    T('mo-accmin', '속력이 최소일 때의 가속도의 크기', '②24', (d) => {
      // x = eᵗ − 2ct, y = −eᵗ: 속력² = 2(eᵗ − c)² + 2c² → eᵗ = c 에서 최소, 가속도의 크기 √2 eᵗ = c√2
      const c = d.pick([2, 3, 4, 5]);
      return radAns(`${posText(`${ePow(Tv)} ${MINUS} ${2 * c}${Tv}`, `${MINUS}${ePow(Tv)}`)}이다. 점 P의 속력이 최소일 때, 점 P의 가속도의 크기는?`, c, 2, {
        explain: `속도는 ${nb(`(${ePow(Tv)} ${MINUS} ${2 * c}, ${MINUS}${ePow(Tv)})`)}이므로 속력의 제곱은 ${nb(`2(${ePow(Tv)} ${MINUS} ${c})${sup(2)} + ${2 * c * c}`)}이고 ${is(ePow(Tv), c)}, 곧 ${is(Tv, ln(c))}일 때 최소이다. 가속도는 ${nb(`(${ePow(Tv)}, ${MINUS}${ePow(Tv)})`)}이므로 크기는 ${rt(2)}${ePow(Tv)}이고, 이때 ${c}${jh(rt(2), '이다/이다')}.`,
        facts: { calc: [[`${2 * c}/2`, 0], ['2', 1]], derived: [2] } });
    }, { standard: S11 })
  ];

  B.addTypes('11-5-5', 'graph', graph);
  B.addTypes('11-5-5', 'maxmin', maxmin);
  B.addTypes('11-5-5', 'eq', eq);
  B.addTypes('11-5-5', 'ineq', ineq);
  B.addTypes('11-5-5', 'motion', motion);
})(typeof window !== 'undefined' ? window : globalThis);
