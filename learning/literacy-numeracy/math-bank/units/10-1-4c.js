// 고등학교 1학년 1학기(공통수학1) 4단원 이차방정식과 이차함수 — 실력 문항.
// 이 단원에서 아이들이 흔히 잘못 아는 것
//  - 「적어도 한 점에서 만난다」「x축과 만나도록」에서 접할 때(D = 0)를 빼고, 「만나지 않는다」에서 접할 때를 넣는다.
//  - y축과 만나는 점의 y좌표를 이차방정식의 근으로 여긴다. 두 교점 「사이」에 있다는 것을 함숫값의 크기로 바꾸지 못한다.
//  - 제한된 범위에서 꼭짓점이 범위 안에 있는지 따지지 않고 꼭짓점의 y좌표를 바로 최댓값(최솟값)으로 적는다. 범위의 끝이나 꼭짓점이 문자이면 경우를 나누지 않는다.
//  - 범위가 문제에 드러나 있지 않을 때(xy ≥ 0, 그래프를 따라 움직이는 점, 실근을 가질 조건, 치환한 식) 그 범위를 찾지 않고 실수 전체에서 셈한다.
//  - 자연수만 될 수 있는 양에서 꼭짓점이 자연수가 아니면 내림이나 올림으로 아무 쪽이나 고른다(축에 가까운 쪽이 크다).
//  - 매출과 이익을 섞는다(이익은 (가격 − 원가) × 판매량).
// 실력에 둔 잣대(과제 글·new-unit-guide-m): ① 그림·상황의 장치 때문에 배운 뜻을 정확히 대야 풀리는 것, ② 세 단계 넘게 이어 생각해야 풀리는 것.
// 각 유형 머리의 주석에 ①·②를 적었다. 판별식이 k의 이차식이 되는 꼴(hard-disc-quadratic)은 이차부등식(10-1-6 여러 가지 부등식)을 배우기 전이므로 풀이를
// 「두 일차식의 곱이 음수(양수)이면 두 식의 부호가 다르다(같다)」로 적었다.
// ref: ①n = 기본꼴_1, ②n = 기본꼴_2, 심n = 심화꼴.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, tagged, N, M, C, inline } = B.kit;
  const { MINUS, GT, LT, GE, LE, Q, tail, sup, nz, pm, asQ, poly, plane, ineqAns } = B.kit.mid;
  const { S4, S5, S6, H, X, Y, K, Av, Bv, Mv, Pv, Tv, Fv, X2, XA, YA, iq, jn, sgn, par, is, pt, coefT, more, quadR, fy, linR, ly, eq0, dq, Dv, jw, RM, vals, maxMin, coord, sT, nb } = B.kit.m1014;
  // 실력 묶음의 성취기준은 최대·최소(S6)이지만, 그래프와 x축·직선을 다루는 유형은 그 성취기준을 문항에 적는다(한 유형 안에서 차례마다 다르면 stdBy).
  const stdBy = (pick, make) => (d, n) => { const item = make(d, n); return item && Object.assign(item, { standard: pick(n) }); };
  const range = (lo, hi, v) => nb(`${typeof lo === 'string' ? lo : iq(lo)} ${LE} ${v || X} ${LE} ${typeof hi === 'string' ? hi : iq(hi)}`);
  const stdR = (a, p, q, v) => `${coefT(a)}${p === 0 ? (v || X) + sup(2) : `(${v || X} ${sgn(-p)})${sup(2)}`}${q ? ' ' + sgn(q) : ''}`;
  const signedMM = (text, mx, mn, signed, o) => M(text, [{ lead: '최댓값:', answer: mx, signed }, { lead: '최솟값:', answer: mn, signed }], Object.assign({}, o, { shown: `최댓값: ${iq(mx)}, 최솟값: ${iq(mn)}` }));
  // 꼭짓점과 범위 안의 점들에서의 값으로 최댓값·최솟값(점 목록은 [x, y])
  const ends = (pts) => ({ max: pts.reduce((s, t) => (t[1] > s[1] ? t : s)), min: pts.reduce((s, t) => (t[1] < s[1] ? t : s)) });

  B.addGroup('10-1-4', {
    id: 'hard', title: '단원 종합', standard: S6,
    types: [
      // ② 판별식이 k의 이차식: 판별식 → 인수분해 → 두 일차식의 부호(세 단계 넘게). 심1(학력평가 기출).
      // x축과 만나지 않을 k의 범위(①6)는 10-1-6 quadk-all-* 와 같은 일이라 그쪽에만 둔다.
      H('hard-disc-quadratic', '판별식이 문자의 이차식일 때 위치 관계의 범위', '심1', stdBy(() => S5, (d) => {
        // 직선 y = kx + n 과 만나지 않는 자연수 k 의 개수: (k − b)² < 4(c − n)
        const b = d.int(-2, 8), s = d.int(1, 4), n0 = nz(d, -6, 4), c = n0 + s * s, lo = b - 2 * s, hi = b + 2 * s, count = hi - 1 - Math.max(lo, 0);
        if (count < 2 || b === 0 || c === 0) return null;
        return N(`이차함수 ${fy(1, b, c)}의 그래프와 직선 ${jw(nb(`${Y} = ${K}${X} ${sgn(n0)}`), '이/가')} 만나지 않도록 하는 자연수 ${K}의 개수는?`, count, {
          explain: `${nb(`${quadR(1, b, c)} = ${K}${X} ${sgn(n0)}`)}, 곧 ${eq0(`${X2} + (${iq(b)} ${MINUS} ${K})${X} ${sgn(c - n0)}`)}의 판별식이 음수여야 한다. ${nb(`${Dv} = (${K} ${sgn(-b)})${sup(2)} ${MINUS} ${4 * s * s}`)} = ${nb(`${lo === 0 ? K : `(${K} ${sgn(-lo)})`}(${K} ${sgn(-hi)})`)} ${LT} 0이고, `
            + `두 일차식의 부호가 달라야 하므로 ${nb(`${iq(lo)} ${LT} ${K} ${LT} ${iq(hi)}`)}이다. 이 범위의 자연수 ${K}는 ${count}개이다.`,
          facts: { value: `(${jn(b)})+2*((${jn(c)})-(${jn(n0)}))**0.5-1-${Math.max(lo, 0)}`, derived: [2, 0.5, Math.max(lo, 0)] }
        });
      })),
      // ① 문자에 관계없이 지나는 점(항등식) + 접점 → 두 계수(세 단계)
      H('hard-fixed-point-tangent', '문자의 값에 관계없이 지나는 점에서 직선과 접할 때', '①18', (d) => {
        const p = nz(d, -3, 3), q = d.int(-5, 5), m = nz(d, -4, 4), a = m - 2 * p, b = p * p + q - m * p;
        if (b === 0 || a === 0) return null;
        const g = `${X2} + ${Av}${X} ${more(-p, Av)}${q ? ' ' + sgn(q) : ''}`;
        return vals(`이차함수 ${nb(`${Y} = ${g}`)}의 그래프는 ${Av}의 값에 관계없이 항상 점 P를 지난다. 이 그래프가 직선 ${nb(`${Y} = ${linR(m, 0)} + ${Bv}`)}와 점 P에서 접할 때, 상수 ${Av}, ${Bv}의 값은?`, [[Av, a], [Bv, b]], {
          explain: `${Av}에 대하여 정리하면 ${nb(`${Y} = ${Av}(${X} ${sgn(-p)}) + ${poly([[1, X2], [q, '']])}`)}이므로 ${is(X, p)}이면 ${Av}에 관계없이 ${is(Y, p * p + q)}이다. 곧 ${nb(`P${pt(p, p * p + q)}`)}이다. `
            + `직선이 P를 지나므로 ${nb(`${iq(p * p + q)} = ${par(m)} × ${par(p)} + ${Bv}`)}, ${is(Bv, b)}이다. 또 ${eq0(`${X2} + (${Av} ${sgn(-m)})${X} ${more(-p, Av)}${q - b ? ' ' + sgn(q - b) : ''}`)}이 ${is(X, p)}${tail(Math.abs(p), '을/를')} 중근으로 가지므로 `
            + `${nb(`${Av} ${sgn(-m)} = ${iq(-2 * p)}`)}, ${is(Av, a)}이다.`,
          facts: { calc: [[`(${jn(m)})-2*(${jn(p)})`, 0], [`(${jn(p)})*(${jn(p)})+(${jn(q)})-(${jn(m)})*(${jn(p)})`, 1]], derived: [2, Math.abs(p)] }
        });
      }, { standard: S5 }),
      // ① 「두 교점 사이에 있다」를 함숫값의 부호로 바꾼다.
      H('hard-between', '직선 위의 점이 두 교점 사이에 있을 조건', '①22', (d) => {
        const s = d.pick([2, 4, -2, -4]), c = nz(d, -4, 6), m = nz(d, -3, 3), n0 = d.int(-5, 5), u = nz(d, -3, 3), top = -u * u + m * u - c + n0;
        if (top % (s * u) !== 0) return null;
        const a0 = top / (s * u), rel = s * u > 0 ? '<' : '>', yu = m * u + n0;
        if (a0 === 0 || Math.abs(a0) > 9) return null;
        const g = `${X2} ${more(s, Av)}${X} ${sgn(c)}`;
        return ineqAns(`직선 ${ly(m, n0)} 위의 점 ${jw(pt(u, yu), '이/가')} 이차함수 ${nb(`${Y} = ${g}`)}의 그래프와 직선 ${ly(m, n0)}의 두 교점 사이에 있도록 하는 실수 ${Av}의 값의 범위를 구하시오.`, rel, a0, Av, {
          explain: `${nb(`${Fv}(${X}) = (${g}) ${MINUS} (${linR(m, n0)})`)}라 하면 두 교점의 ${X}좌표는 ${eq0(`${Fv}(${X})`)}의 두 근 α, β(α ${LT} β)이다. ${nb(`${Y} = ${Fv}(${X})`)}의 그래프는 아래로 볼록하므로 `
            + `${nb(`α ${LT} ${iq(u)} ${LT} β`)}이려면 ${nb(`${Fv}(${iq(u)}) ${LT} 0`)}, 곧 ${is(X, u)}에서 포물선이 직선보다 아래에 있어야 한다. ${nb(`${Fv}(${iq(u)}) = ${poly([[s * u, Av], [-top, '']])} ${LT} 0`)}에서 ${nb(`${Av} ${RM[rel]} ${iq(a0)}`)}이다.`,
          facts: { calc: [[`(0-(${jn(u)})*(${jn(u)})+(${jn(m)})*(${jn(u)})-(${jn(c)})+(${jn(n0)}))/((${jn(s)})*(${jn(u)}))`, 1]] }
        });
      }, { standard: S5 }),
      // ① 꼭짓점이 범위에 드는가(경우 둘)
      H('hard-k-range-min', '0 ≤ x ≤ k에서 최솟값이 주어질 때 k 구하기', '②8', (d, n) => {
        const p = d.int(3, 7), q = d.int(-6, 4), g = fy(1, -2 * p, p * p + q);
        if (n === 0) {
          const dd = d.int(1, p - 1), k = p - dd, m0 = q + dd * dd;
          return N(`${range(0, K)}일 때, 이차함수 ${g}의 최솟값이 ${iq(m0)}이다. 상수 ${K}의 값은?`, k, {
            explain: `${nb(`${Y} = ${stdR(1, p, q)}`)}이다. ${nb(`${K} ${GE} ${p}`)}이면 꼭짓점이 범위 안에 있어 최솟값이 ${iq(q)}이므로 맞지 않는다. 따라서 ${nb(`${K} ${LT} ${p}`)}이고 범위에서 ${X}의 값이 커질수록 ${Y}의 값이 작아지므로 `
              + `${is(X, K)}일 때 최솟값 ${jw(nb(stdR(1, p, q, K)), '을/를')} 갖는다. ${nb(`(${K} ${MINUS} ${p})${sup(2)} = ${dd * dd}`)}에서 ${nb(`${K} = ${p} ± ${dd}`)}이고 ${nb(`${K} ${LT} ${p}`)}이므로 ${is(K, k)}이다.`,
            facts: { value: `${p}-((${jn(m0)})-(${jn(q)}))**0.5`, derived: [p, 0.5, Math.abs(q)] }
          });
        }
        const top = p + d.int(1, 5), count = top - p + 1;
        return N(`${range(0, K)}일 때, 이차함수 ${g}의 최솟값이 ${jw(iq(q), '이/가')} 되도록 하는 ${top} 이하의 자연수 ${K}의 개수는?`, count, {
          explain: `${nb(`${Y} = ${stdR(1, p, q)}`)}이다. ${nb(`${K} ${LT} ${p}`)}이면 최솟값은 ${is(X, K)}일 때의 값 ${jw(nb(stdR(1, p, q, K)), '으로/로')} ${iq(q)}보다 크다. ${nb(`${K} ${GE} ${p}`)}이면 꼭짓점이 범위 안에 있어 최솟값이 ${iq(q)}이다. `
            + `따라서 ${nb(`${p} ${LE} ${K} ${LE} ${top}`)}인 자연수 ${K}는 ${count}개이다.`,
          facts: { value: `${top}-${p}+1`, derived: [p] }
        });
      }, { count: 2 }),
      // ① 최댓값이 꼭짓점의 y좌표와 같다 ⇔ 꼭짓점이 범위 안
      H('hard-vertex-in-range', '최댓값이 꼭짓점의 y좌표가 되도록 하는 자연수 k', '②9', (d) => {
        const c = d.pick([2, 3]), lo = d.int(2, 6), hi = lo + d.int(4, 9), E = nz(d, -4, 9);
        const ks = []; for (let k = 1; k <= 20; k += 1) if (c * k >= lo && c * k <= hi) ks.push(k);
        if (ks.length < 2 || ks.length > 4) return null;
        const g = `${MINUS}${X2} + ${2 * c}${K}${X} ${sgn(E)} ${MINUS} ${c * c}${K}${sup(2)}`;
        return N(`${range(lo, hi)}일 때, 이차함수 ${nb(`${Y} = ${g}`)}의 최댓값이 ${jw(iq(E), '이/가')} 되도록 하는 자연수 ${K}의 개수는?`, ks.length, {
          explain: `${nb(`${Y} = ${MINUS}(${X} ${MINUS} ${c}${K})${sup(2)} ${sgn(E)}`)}이다. 위로 볼록하므로 꼭짓점의 ${X}좌표 ${nb(`${c}${K}`)}가 범위 안에 있으면 최댓값은 ${iq(E)}이고, 범위 밖에 있으면 최댓값은 끝에서의 값으로 ${iq(E)}보다 작다. `
            + `${nb(`${lo} ${LE} ${c}${K} ${LE} ${hi}`)}인 자연수 ${K}는 ${ks.join(', ')}의 ${ks.length}개이다.`,
          facts: { value: String(ks.length), derived: [ks.length] }
        });
      }),
      // ② 꼭짓점의 자리로 경우 셋(범위의 왼쪽 밖·안·오른쪽 밖)을 따진다.
      H('hard-min-three-cases', '꼭짓점의 자리로 경우를 나누어 최솟값으로 문자 구하기', '②9', (d) => {
        const w = d.int(1, 3), s = d.int(1, 4), c = d.int(-5, 5), m0 = c + s * s, a1 = -s, a2 = w + s;
        const g = `${X2} ${MINUS} 2${Av}${X} + ${Av}${sup(2)} ${sgn(c)}`;
        if (c === 0) return null;
        return inline(`${range(0, w)}일 때, 이차함수 ${nb(`${Y} = ${g}`)}의 최솟값이 ${jw(iq(m0), '이/가')} 되도록 하는 실수 ${Av}의 값을 모두 구하시오.`, `${Av} = {0} 또는 ${Av} = {1}`,
          [{ answer: a1, signed: true }, { answer: a2, signed: true }], {
            unordered: true, shown: `${is(Av, a1)} 또는 ${is(Av, a2)}`,
            explain: `${nb(`${Y} = (${X} ${MINUS} ${Av})${sup(2)} ${sgn(c)}`)}이고 꼭짓점의 ${X}좌표는 ${Av}이다. (i) ${nb(`${Av} ${LT} 0`)}이면 최솟값은 ${is(X, 0)}일 때 ${nb(`${Av}${sup(2)} ${sgn(c)}`)}이므로 ${nb(`${Av}${sup(2)} = ${s * s}`)}, ${is(Av, a1)}이다. `
              + `(ii) ${nb(`0 ${LE} ${Av} ${LE} ${w}`)}이면 최솟값은 ${jw(iq(c), '이/가')} 되어 맞지 않는다. (iii) ${nb(`${Av} ${GT} ${w}`)}이면 최솟값은 ${is(X, w)}일 때 ${nb(`(${w} ${MINUS} ${Av})${sup(2)} ${sgn(c)}`)}이므로 ${nb(`${Av} ${MINUS} ${w} = ${s}`)}, ${is(Av, a2)}이다.`,
            facts: { calc: [[`0-((${jn(m0)})-(${jn(c)}))**0.5`, 0], [`${w}+((${jn(m0)})-(${jn(c)}))**0.5`, 1]], derived: [0.5] }
          });
      }),
      // ② 두 근으로 식의 꼴 → a 의 부호 가르기 → a → 함숫값(네 단계)
      H('hard-roots-max', '방정식의 두 근과 최댓값으로 이차함수를 정하고 함숫값 구하기', '②10', (d) => {
        const h = d.int(-2, 3), dd = d.int(1, 3), r1 = h - dd, r2 = h + dd, a = -d.int(1, 3), mx = -a * dd * dd, lo = d.int(r1, h - 1), hi = d.int(h + 1, r2), t0 = d.pick([r1 - 1, r1 - 2, r2 + 1, r2 + 2, h + 1]);
        const v = a * (t0 - r1) * (t0 - r2);
        if (v === 0 || r1 === 0 || r2 === 0 || Math.abs(v) > 60 || t0 === lo || t0 === hi) return null;
        return N(`이차함수 ${Fv}(${X})가 다음 조건을 만족시킬 때, ${Fv}(${iq(t0)})의 값은?`, v, {
          signed: true,
          figure: tagged([`방정식 ${eq0(`${Fv}(${X})`)}의 두 근은 ${iq(r1)}${tail(Math.abs(r1), '과/와')} ${iq(r2)}이다.`, `${range(lo, hi)}에서 ${Fv}(${X})의 최댓값은 ${iq(mx)}이다.`], ['㈎', '㈏']),
          explain: `㈎에서 ${nb(`${Fv}(${X}) = ${Av}(${X} ${sgn(-r1)})(${X} ${sgn(-r2)})`)}(${nb(`${Av} ≠ 0`)})이고 꼭짓점의 ${X}좌표는 ${iq(h)}이고 범위 안에 있다. 범위는 두 근 사이에 있으므로 `
            + `${nb(`${Av} ${GT} 0`)}이면 범위에서 ${nb(`${Fv}(${X}) ${LE} 0`)}이 되어 ㈏와 맞지 않는다. 따라서 ${nb(`${Av} ${LT} 0`)}이고 최댓값은 ${nb(`${Fv}(${iq(h)}) = ${coefT(-dd * dd)}${Av} = ${mx}`)}이므로 ${is(Av, a)}이다. `
            + `${nb(`${Fv}(${iq(t0)}) = ${par(a)} × ${par(t0 - r1)} × ${par(t0 - r2)} = ${iq(v)}`)}이다.`,
          facts: { value: `(0-(${jn(mx)})*4/(((${jn(r2)})-(${jn(r1)}))*((${jn(r2)})-(${jn(r1)}))))*((${jn(t0)})-(${jn(r1)}))*((${jn(t0)})-(${jn(r2)}))`, derived: [4] }
        });
      }),
      // ① 숨은 범위: xy ≥ 0 이고 x + y = s 이면 x, y 는 0과 s 사이
      H('hard-hidden-sum', 'xy ≥ 0과 x + y = s에서 범위를 찾아 최댓값과 최솟값 구하기', '②12', (d) => {
        const [al, be] = d.pick([[1, 1], [2, 1], [1, 2]]), sg = pm(d), base = d.int(2, 5) * (al + be === 2 ? 2 : 3), s = sg * base;
        const xs = be * s / (al + be), F = (x) => al * x * x + be * (s - x) * (s - x), pts = [[0, F(0)], [s, F(s)], [xs, F(xs)]], e = ends(pts);
        if (e.max[1] > 9999) return null;
        const expr = nb(`${al === 1 ? '' : al}${X2} + ${be === 1 ? '' : be}${Y}${sup(2)}`), lo = Math.min(0, s), hi = Math.max(0, s);
        return signedMM(`두 실수 ${X}, ${Y}에 대하여 ${nb(`${X}${Y} ${GE} 0`)}이고 ${nb(`${X} + ${Y} = ${iq(s)}`)}일 때, ${expr}의 최댓값과 최솟값을 구하시오.`, e.max[1], e.min[1], false, {
          explain: `${nb(`${X}${Y} ${GE} 0`)}이고 두 수의 합이 ${iq(s)}이므로 ${X}, ${Y}는 모두 ${s > 0 ? '0 이상' : '0 이하'}이다. ${is(Y, linR(-1, s))}이므로 ${nb(`${linR(-1, s)} ${s > 0 ? GE : LE} 0`)}에서 ${range(lo, hi)}이다. `
            + `${nb(`${expr} = ${quadR(al + be, -2 * be * s, be * s * s)} = ${stdR(al + be, xs, F(xs))}`)}이고 꼭짓점의 ${X}좌표 ${jw(iq(xs), '은/는')} 범위 안에 있다. `
            + `${is(X, 0)}일 때 ${iq(F(0))}, ${is(X, s)}일 때 ${iq(F(s))}, ${is(X, xs)}일 때 ${iq(F(xs))}이므로 최댓값은 ${iq(e.max[1])}, 최솟값은 ${iq(e.min[1])}이다.`,
          facts: { calc: [[`${Math.max(al, be)}*(${jn(s)})*(${jn(s)})`, 0], [`${al}*${be}*(${jn(s)})*(${jn(s)})/(${al}+${be})`, 1]], derived: [al, be] }
        });
      }),
      // ① 숨은 범위: 그래프를 따라 움직이는 점의 x좌표의 범위
      H('hard-path-point', '그래프를 따라 움직이는 점의 좌표로 만든 식의 최댓값과 최솟값', '②12', (d) => {
        const [r1, r2, k] = d.pick([[1, 2, 1], [1, 3, 2], [1, 4, 1], [2, 3, 1], [2, 4, 2], [1, 5, 2]]), v = (r1 + r2 - k) / 2;
        const S = (a) => a * a - (r1 + r2 - k) * a + r1 * r2, pts = [[0, S(0)], [r2, S(r2)], [v, S(v)]], e = ends(pts), h = (r1 + r2) / 2, dd = ((r2 - r1) / 2) ** 2;
        const fig = plane({ x: [-1, r2 + 1], y: [-Math.ceil(dd) - 1, r1 * r2 + 1], parabolas: [{ a: 1, p: h, q: -dd }],
          points: [{ x: 0, y: r1 * r2, name: 'A', side: 'ur' }, { x: r1, y: 0, name: 'B', side: 'dl' }, { x: r2, y: 0, name: 'C', side: 'dr' }], ticks: 'none', grid: false });
        const g = fy(1, -(r1 + r2), r1 * r2), want = nb(`${k === 1 ? '' : k}${Av} + ${Bv}`);
        return signedMM(`그림과 같이 이차함수 ${g}의 그래프가 ${YA}과 만나는 점을 A, ${XA}과 만나는 두 점을 각각 ${nb(`B(α, 0)`)}, ${nb(`C(β, 0)`)}이라 하자. 점 ${nb(`P(${Av}, ${Bv})`)}가 점 A에서 그래프를 따라 점 B를 거쳐 점 C까지 움직일 때, ${want}의 최댓값과 최솟값을 구하시오. (단, α ${LT} β)`, e.max[1], e.min[1], true, {
          figure: fig,
          explain: `${eq0(quadR(1, -(r1 + r2), r1 * r2))}에서 ${is(X, r1)} 또는 ${is(X, r2)}이므로 A${pt(0, r1 * r2)}, B${pt(r1, 0)}, C${pt(r2, 0)}이고 ${range(0, r2, Av)}이다. 점 P가 그래프 위에 있으므로 ${is(Bv, quadR(1, -(r1 + r2), r1 * r2, Av))}이고 `
            + `${nb(`${want} = ${quadR(1, -(r1 + r2 - k), r1 * r2, Av)} = ${stdR(1, v, S(v), Av)}`)}이다. 꼭짓점의 ${Av}좌표 ${jw(iq(v), '은/는')} 범위 안에 있다. ${is(Av, 0)}일 때 ${iq(S(0))}, ${is(Av, r2)}일 때 ${iq(S(r2))}, ${is(Av, v)}일 때 ${iq(S(v))}이므로 `
            + `최댓값은 ${iq(e.max[1])}, 최솟값은 ${iq(e.min[1])}이다.`,
          facts: { calc: [[`(${jn(e.max[0])})*(${jn(e.max[0])})-(${r1 + r2}-${k})*(${jn(e.max[0])})+${r1 * r2}`, 0], [`(${jn(e.min[0])})*(${jn(e.min[0])})-(${r1 + r2}-${k})*(${jn(e.min[0])})+${r1 * r2}+0`, 1]], derived: [Math.abs(e.max[0]), Math.abs(e.min[0]), r1 + r2] }
        });
      }),
      // ① 숨은 범위: 실근을 가질 조건(판별식) → 범위 → 최솟값
      H('hard-disc-range-min', '실근을 가질 조건으로 범위를 찾아 최솟값 구하기', '②12', (d) => {
        const u = nz(d, -4, 4), v = u + d.int(1, 4), A0 = d.int(2, 6), w = (u * u - 4 * (v - u) * A0) / 4;
        if (!Number.isInteger(w) || w === 0 || v === 0) return null;
        const h = d.int(-1, A0 + 2), e = d.int(-4, 8), G = (t) => t * t - 2 * h * t + e, pts = [[0, G(0)], [A0, G(A0)]].concat(h > 0 && h < A0 ? [[h, G(h)]] : []), mn = ends(pts).min;
        const eq = `${X2} ${MINUS} (2${Av} ${sgn(u)})${X} + ${Av}${sup(2)} ${more(v, Av)} ${sgn(w)}`, gq = poly([[1, Av + sup(2)], [-2 * h, Av], [e, '']]);
        if (h === 0 || e === 0) return null;
        return N(`${X}에 대한 이차방정식 ${eq0(eq)}이 실근을 가질 때, ${gq}의 최솟값은? (단, ${nb(`${Av} ${GE} 0`)})`, mn[1], {
          signed: true,
          explain: `실근을 가지려면 ${nb(`${Dv} = (2${Av} ${sgn(u)})${sup(2)} ${MINUS} 4(${Av}${sup(2)} ${more(v, Av)} ${sgn(w)})`)} = ${poly([[4 * (u - v), Av], [u * u - 4 * w, '']])} ${GE} 0이어야 하므로 ${nb(`${Av} ${LE} ${A0}`)}이다. ${nb(`${Av} ${GE} 0`)}이므로 ${range(0, A0, Av)}이다. `
            + `${nb(`${gq} = ${stdR(1, h, e - h * h, Av)}`)}이고, 꼭짓점의 ${Av}좌표 ${jw(iq(h), '은/는')} 범위 ${h >= 0 && h <= A0 ? '안' : '밖'}에 있으므로 최솟값은 ${is(Av, mn[0])}일 때 ${iq(mn[1])}이다.`,
          facts: { value: `(${jn(mn[0])})*(${jn(mn[0])})-2*(${jn(h)})*(${jn(mn[0])})+(${jn(e)})+0`, derived: [2, Math.abs(mn[0]), A0, Math.abs(h)] }
        });
      }),
      // ② 치환: t 의 범위 → t 의 이차함수의 최대·최소(세 단계 넘게)
      H('hard-substitute', '치환한 이차함수의 최댓값과 최솟값', '②13', (d) => {
        const p = nz(d, -2, 2), lo = p - d.int(1, 3), hi = p + d.int(1, 3), t = (x) => x * x - 2 * p * x;
        const tmin = -p * p, tmax = Math.max(t(lo), t(hi)), q = d.int(tmin, tmax), r = d.int(-6, 6);
        if (tmax - tmin < 2 || q === 0) return null;
        const Yf = (s) => s * s - 2 * q * s + r, e = ends([[tmin, Yf(tmin)], [tmax, Yf(tmax)], [q, Yf(q)]]);
        if (Math.abs(e.max[1]) > 99) return null;
        const u = Tv;
        const innerT = poly([[1, X2], [-2 * p, X]]);
        return signedMM(`${range(lo, hi)}일 때, 함수 ${nb(`${Y} = (${innerT})${sup(2)} ${more(-2 * q, `(${innerT})`)}${r ? ' ' + sgn(r) : ''}`)}의 최댓값과 최솟값을 구하시오.`, e.max[1], e.min[1], true, {
          explain: `${nb(`${innerT} = ${u}`)}로 놓으면 ${nb(`${u} = (${X} ${sgn(-p)})${sup(2)} ${MINUS} ${p * p}`)}이고 ${range(lo, hi)}에서 ${range(tmin, tmax, u)}이다. ${nb(`${Y} = ${quadR(1, -2 * q, r, u)} = ${stdR(1, q, r - q * q, u)}`)}이고 꼭짓점의 ${u}좌표 ${jw(iq(q), '은/는')} 범위 안에 있다. `
            + `${is(u, tmin)}일 때 ${iq(Yf(tmin))}, ${is(u, q)}일 때 ${iq(Yf(q))}, ${is(u, tmax)}일 때 ${iq(Yf(tmax))}이므로 최댓값은 ${iq(e.max[1])}, 최솟값은 ${iq(e.min[1])}이다.`,
          facts: { calc: [[`(${jn(e.max[0])})*(${jn(e.max[0])})-2*(${jn(q)})*(${jn(e.max[0])})+(${jn(r)})+0`, 0], [`(${jn(e.min[0])})*(${jn(e.min[0])})-2*(${jn(q)})*(${jn(e.min[0])})+(${jn(r)})+0`, 1]], derived: [2, Math.abs(e.max[0]), Math.abs(e.min[0]), Math.abs(q)] }
        });
      }),
      // ② 절댓값: x 의 부호로 나누어 두 이차함수의 최대·최소를 모은다.
      H('hard-abs', '절댓값이 든 함수의 최댓값과 최솟값', '②14', (d) => {
        const s = d.pick([1, 1, 2]), c = d.int(-4, 6), lo = -d.int(1, 3), hi = d.int(1, 4);
        if (-lo === hi) return null;
        const f = (x) => x * x - 2 * s * Math.abs(x) + c, cand = [...new Set([lo, hi, 0].concat(s <= hi ? [s] : [], -s >= lo ? [-s] : []))], e = ends(cand.map((x) => [x, f(x)]));
        const g = `${X2} ${MINUS} ${2 * s}|${X}| ${sgn(c)}`;
        if (c === 0) return null;
        return signedMM(`${range(lo, hi)}에서 함수 ${nb(`${Y} = ${g}`)}의 최댓값과 최솟값을 구하시오.`, e.max[1], e.min[1], true, {
          explain: `(i) ${nb(`${iq(lo)} ${LE} ${X} ${LT} 0`)}일 때 ${nb(`${Y} = ${quadR(1, 2 * s, c)} = ${stdR(1, -s, c - s * s)}`)}, (ii) ${nb(`0 ${LE} ${X} ${LE} ${hi}`)}일 때 ${nb(`${Y} = ${quadR(1, -2 * s, c)} = ${stdR(1, s, c - s * s)}`)}이다. `
            + `${cand.sort((x, y) => x - y).map((x) => `${is(X, x)}일 때 ${iq(f(x))}`).join(', ')}이므로 최댓값은 ${iq(e.max[1])}, 최솟값은 ${iq(e.min[1])}이다.`,
          facts: { calc: [[`(${jn(e.max[0])})*(${jn(e.max[0])})-2*${s}*${Math.abs(e.max[0])}+(${jn(c)})`, 0], [`(${jn(e.min[0])})*(${jn(e.min[0])})-2*${s}*${Math.abs(e.min[0])}+(${jn(c)})`, 1]], derived: [2, s, Math.abs(e.max[0]), Math.abs(e.min[0])] }
        });
      }),
      // ① 자연수만 되는 양: 꼭짓점이 자연수가 아니면 축에 가까운 자연수에서 최대
      H('hard-integer-price', '꼭짓점이 자연수가 아닐 때 매출이 최대가 되는 판매가', '②27', (d) => {
        const P0 = 100 * d.int(8, 30), S0 = d.pick([60, 80, 100, 120, 150, 200]), dd = d.pick([10, 20, 50]), e = d.pick([2, 3, 4, 6, 7]);
        const xs = (e * P0 - dd * S0) / (2 * dd * e), nInt = Math.round(xs), frac_ = Math.abs(xs - Math.floor(xs) - 0.5);
        if (xs < 2 || xs > 40 || Number.isInteger(xs) || frac_ < 0.12 || P0 - dd * nInt <= 0) return null;
        const price = P0 - dd * nInt, R = (x) => (P0 - dd * x) * (S0 + e * x);
        if (R(nInt) <= R(nInt + 1) || R(nInt) <= R(nInt - 1)) return null;
        return N(`어느 문구점에서는 ${P0}원짜리 볼펜을 하루에 ${S0}개 팔고 있는데, 판매가를 ${dd}원 낮출 때마다 하루 판매량이 ${e}개씩 늘어난다고 한다. 하루 매출액이 최대가 되는 볼펜의 판매가는 몇 원인가? (단, 판매가는 ${dd}원씩 낮추고, 하루 매출액은 판매가와 하루 판매량의 곱이다.)`, price, {
          unit: '원',
          explain: `판매가를 ${dd}원씩 ${X}번 낮추면(${X}는 0 이상의 정수) 하루 매출액은 ${nb(`(${P0} ${MINUS} ${dd}${X})(${S0} + ${e}${X})`)}원이고, 그래프는 위로 볼록하며 축은 ${nb(`${X} = ${frac(`${e} × ${P0} ${MINUS} ${dd} × ${S0}`, `2 × ${dd} × ${e}`)} = ${iq(Q(e * P0 - dd * S0, 2 * dd * e))}`)}이다. `
            + `${X}는 정수이므로 축에 가장 가까운 정수 ${is(X, nInt)}에서 매출액이 가장 크다(축에서 멀어질수록 작아진다). 따라서 판매가는 ${nb(`${P0} ${MINUS} ${dd} × ${nInt} = ${price}`)}원이다.`,
          facts: { value: `${P0}-${dd}*${nInt}`, derived: [nInt] }
        });
      }),
      // ② 인수분해로 교점 → 범위로 변의 길이 → 넓이의 이차함수 → 최대(심2, 학력평가 기출)
      H('hard-triangle-area', '두 교점과 y축 위의 점으로 만든 삼각형의 넓이의 최댓값', '심2', (d) => {
        const r = d.pick([4, 6, 8]), s = d.int(1, r / 2 - 1), best = r * r * r / 8, aShow = Math.max(0.6, r / 2 - s - 0.7);
        const g = `${X2} ${MINUS} (${Av} + ${s + r})${X} + ${r}${Av} + ${r * s}`;
        const L = aShow + s, yC = r * L;
        const fig = coord({ x: [-0.8, r + 0.8], y: [-(((r - L) / 2) ** 2) - 0.8, yC + 1], tall: 190, noO: false,
          parabolas: [{ a: 1, p: (r + L) / 2, q: -(((r - L) / 2) ** 2) }], poly: [[L, 0], [r, 0], [0, yC]],
          points: [{ x: L, y: 0, name: 'A', side: 'dl' }, { x: r, y: 0, name: 'B', side: 'dr' }, { x: 0, y: yC, name: 'C', side: 'ul' }],
          say: `좌표평면: 아래로 볼록한 포물선이 x축과 두 점 A, B에서 만나고 y축과 점 C에서 만난다. 삼각형 ABC를 색칠하였다.` });
        return N(`그림과 같이 이차함수 ${nb(`${Y} = ${g}`)}의 그래프가 ${XA}과 만나는 서로 다른 두 점을 각각 A, B라 하고, ${YA}과 만나는 점을 C라 하자. 삼각형 ABC의 넓이의 최댓값은? (단, ${nb(`0 ${LT} ${Av} ${LT} ${r - s}`)})`, best, {
          figure: fig,
          explain: `${nb(`${g} = (${X} ${MINUS} ${r}){${X} ${MINUS} (${Av} + ${s})}`)}이므로 두 점의 ${X}좌표는 ${r}, ${nb(`${Av} + ${s}`)}이고, ${nb(`0 ${LT} ${Av} ${LT} ${r - s}`)}에서 ${nb(`${Av} + ${s} ${LT} ${r}`)}이다. `
            + `${nb(`${SGt('AB')} = ${r - s} ${MINUS} ${Av}`)}, C의 ${Y}좌표는 ${nb(`${r}(${Av} + ${s})`)}이므로 넓이는 ${nb(`${frac(1, 2)}(${r - s} ${MINUS} ${Av}) × ${r}(${Av} + ${s}) = ${MINUS}${r / 2}(${Av} ${MINUS} ${r / 2 - s})${sup(2)} + ${best}`)}이다. `
            + `${jw(is(Av, r / 2 - s), '은/는')} 범위 안에 있으므로 넓이의 최댓값은 ${best}이다.`,
          facts: { value: `${r}*${r}*${r}/8`, derived: [8] }
        });
      })
    ]
  });
  const SGt = (t) => B.kit.mid.SG(t);
})(typeof window !== 'undefined' ? window : globalThis);
