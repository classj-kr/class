// 고등학교 기하 Ⅰ-2 타원 — 뒤쪽 묶음(기울기가 주어진 접선, 타원 위의 점에서의 접선, 타원 밖의 점에서 그은 접선과 거리의 최대·최소).
// 단원 틀·싣는 기준·뺀 것과 까닭은 11-4-2a.js 머리에 적었다. 도구는 B.kit.u42x(11-4-2a.js).
// ref: ①n = 이 단원 기본꼴_1의 n번, ②n = 기본꼴_2의 n번.
// 접선은 교과서대로 판별식에서 얻은 두 공식 y = mx ± √(a²m² + b²), x₁x/a² + y₁y/b² = 1 로 푼다(교육과정 해설: 판별식을 이용하여 구한다).
// 수를 고르는 데 쓰는 격자점 묶음(POOL_…)은 파일을 읽을 때 한 번 만들어 둔다 — 조건에 맞는 수를 늘 찾게 하려고.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, N, C, inline } = B.kit;
  const { MINUS, Q, qadd, qsub, qmul, qneg, tx, nb, V, sup, poly, nz, rt, sqParts, radText, SG } = B.kit.mid;
  const { ms, jh, qAns, coordAns, plot } = B.kit.hs;
  const { S4, T, gcd, isSq, sqrtI, jn, sg, lattice, latticeC, X, Y, X2, Y2, pt, named, term, ellEq, coefOf, coefTx, normLine, lineTx, sameLine, touches, lineMC, pairAns, lineAns, pmAns, radLen, subsetChoice, ellFig } = B.kit.u42x;

  // ── 수 묶음 ──
  // 타원 x²/aa + y²/bb = 1 위의 격자점(두 좌표가 0이 아닌 것) [aa, bb, x, y]
  const POOL_PT = [];
  for (let aa = 2; aa <= 40; aa += 1) for (let bb = 2; bb <= 40; bb += 1) if (aa !== bb) for (const [x, y] of lattice(aa, bb)) if (x !== 0 && y !== 0) POOL_PT.push([aa, bb, x, y]);
  const intSlope = ([aa, bb, x, y]) => (bb * x) % (aa * y) === 0;          // 접선의 기울기 −bb·x/(aa·y)가 정수
  const intCut = ([, bb, , y]) => bb % y === 0;                             // 접선의 y절편 bb/y 가 정수
  // 계수 꼴 타원 p x² + q y² = r(p, q 는 서로소) 위의 격자점 [p, q, r, x, y](두 좌표가 0이 아닌 것)
  const POOL_C = [];
  for (let p = 1; p <= 6; p += 1) for (let q = 1; q <= 6; q += 1) if (p !== q && gcd(p, q) === 1) for (let r = 2; r <= 90; r += 1) for (const [x, y] of latticeC(p, q, r)) if (x !== 0 && y !== 0) POOL_C.push([p, q, r, x, y]);
  // 타원 밖의 점 A(ax, ay)와 그 점에서 그은 두 접선의 접점(격자점) [p, q, r, [x1, y1], [x2, y2], [ax, ay]]
  const POOL_OUT = [];
  for (let p = 1; p <= 5; p += 1) for (let q = 1; q <= 5; q += 1) if (p !== q && gcd(p, q) === 1) for (let r = 2; r <= 60; r += 1) {
    const L = latticeC(p, q, r);
    for (let i = 0; i < L.length; i += 1) for (let j = i + 1; j < L.length; j += 1) {
      const [x1, y1] = L[i], [x2, y2] = L[j], det = x1 * y2 - x2 * y1;
      if (det === 0) continue;
      const ax = r * (y2 - y1) / (p * det), ay = r * (x1 - x2) / (q * det);
      if (!Number.isInteger(ax) || !Number.isInteger(ay) || Math.abs(ax) > 12 || Math.abs(ay) > 12) continue;
      POOL_OUT.push([p, q, r, [x1, y1], [x2, y2], [ax, ay]]);
    }
  }
  // 점 A(ax, ay)에서 p x² + q y² = r 에 그은 두 접선의 접점을 검사 식으로: 접점은 직선 p·ax·x + q·ay·y = r 과 타원의 교점이다.
  //  [{ x, y, ex, ey }, …] — ex, ey 는 문제의 수(p, q, r, ax, ay)로 다시 셈하는 식(근의 공식).
  function polarPts(p, q, r, ax, ay) {
    if (ay === 0) {
      const xE = `${r}/(${p}*${jn(ax)})`, x = r / (p * ax), yy = Math.sqrt((r - p * x * x) / q);
      return [1, -1].map((s) => ({ x: x + 0, y: s * yy + 0, ex: xE + '+0', ey: `${s < 0 ? '0-' : ''}((${r}-${p}*(${xE})**2)/${q})**0.5+0` }));
    }
    const A = `(${p}*${q}*${jn(ay)}**2+${p}**2*${jn(ax)}**2)`, Bm = `(2*${r}*${p}*${jn(ax)})`, Cc = `(${r}**2-${r}*${q}*${jn(ay)}**2)`, D = `(${Bm}**2-4*${A}*${Cc})**0.5`;
    return [1, -1].map((s) => {
      const ex = `(${Bm}${s > 0 ? '+' : '-'}${D})/(2*${A})`, x = Function('return ' + ex)();
      // 0 이 −0 으로 셈해지지 않게 끝에 +0 을 붙인다(검사는 0 과 −0 을 가른다).
      return { x: x + 0, y: (r - p * ax * x) / (q * ay) + 0, ex: ex + '+0', ey: `(${r}-${p}*${jn(ax)}*(${ex}))/(${q}*${jn(ay)})+0` };
    });
  }
  const P1R = jh(nb('(' + ms('x_1') + ', ' + ms('y_1') + ')'), '이라/라');
  // 접선의 식 x₁x/A + y₁y/B = 1 의 글(부호와 계수 1을 바르게)
  const term2 = (num, den) => (den === 1 || den === '1' ? num : frac(num, den));
  const coefV = (n, v) => (Math.abs(n) === 1 ? '' : Math.abs(n)) + v;
  const tanTx = (x1, y1, A, Bd) => nb((x1 < 0 ? MINUS : '') + term2(coefV(x1, X), A) + (y1 < 0 ? ' ' + MINUS + ' ' : ' + ') + term2(coefV(y1, Y), Bd) + ' = 1');
  // 분모가 음수일 수 있는 분수 num/den 의 글
  const fracS = (num, den) => (den < 0 ? MINUS : '') + (Math.abs(den) === 1 ? num : frac(num, Math.abs(den)));
  const sqN = (n) => (n < 0 ? '(' + sg(n) + ')' : String(n)) + sup(2);
  const eqOf = (aa, bb, coef) => (coef ? coefOf(aa, bb).text : ellEq(aa, bb));
  const sq2 = (m) => (m < 0 ? '(' + sg(m) + ')' : String(m)) + sup(2);          // m² 의 글(음수는 괄호)
  const FORM_M = `타원 ${nb(frac(X2, ms('a^2')) + ' + ' + frac(Y2, ms('b^2')) + ' = 1')}에 접하고 기울기가 ${V('m')}인 직선은 ${nb(Y + ' = ' + V('m') + X + ' ± ' + rt(ms('a^2m^2 + b^2')))}이다`;
  const FORM_P = `타원 ${nb(frac(X2, ms('a^2')) + ' + ' + frac(Y2, ms('b^2')) + ' = 1')} 위의 점 ${nb('(' + ms('x_1') + ', ' + ms('y_1') + ')')}에서의 접선은 ${nb(frac(ms('x_1x'), ms('a^2')) + ' + ' + frac(ms('y_1y'), ms('b^2')) + ' = 1')}이다`;

  // ═══ 라. 기울기가 주어진 접선 ═══
  const tslope = [
    T('ts-slope', '기울기가 주어진 접선의 방정식', '②5', (d, n) => {
      const m = d.pick([1, -1, 2, -2, 3, -3]), aa = d.int(2, 30), bb = d.int(2, 30), v = aa * m * m + bb;
      if (aa === bb || (n !== 1 && !isSq(v)) || (n === 1 && (isSq(v) || sqParts(v)[0] !== 1))) return null;
      const coef = n === 2 || d.bool(), E = coefOf(aa, bb), eqT = coef ? E.text : ellEq(aa, bb), pre = coef ? `양변을 ${jh(E.r, '으로/로')} 나누면 ${ellEq(aa, bb)}이다. ` : '';
      const A = coef ? `${E.r}/${E.p}` : `${aa}`, Bq = coef ? `${E.r}/${E.q}` : `${bb}`, vE = `(${A}*${jn(m)}**2+${Bq})`, k = sqrtI(v);
      const step = nb(rt(`${aa} × ${sq2(m)} + ${bb}`) + ' = ' + (n === 1 ? rt(v) : k));
      if (n === 2) {
        return N(`타원 ${eqT}에 접하고 기울기가 ${sg(m)}인 두 직선이 ${Y}축과 만나는 점을 각각 A, B라 할 때, 선분 AB의 길이는?`, 2 * k, {
          explain: `${pre}${FORM_M}. ${step}이므로 두 직선은 ${nb(Y + ' = ' + poly([[m, X]]) + ' ± ' + k)}이고, ${Y}축과 ${pt(0, k)}, ${pt(0, -k)}에서 만난다. 따라서 ${nb(SG('AB') + ' = ' + 2 * k)}이다.`,
          facts: { value: `2*${vE}**0.5`, rule: 'yaxis' } });
      }
      return pmAns(`타원 ${eqT}에 접하고 기울기가 ${sg(m)}인 직선의 방정식을 구하시오.`, m, n === 0 ? k : v, n === 1, {
        explain: `${pre}${FORM_M}. ${step}이므로 ${nb(Y + ' = ' + poly([[m, X]]) + ' ± ' + (n === 1 ? rt(v) : k))}이다.`,
        facts: { calc: [[jn(m), 0], [n === 0 ? `${vE}**0.5` : vE, 1]], rule: n === 0 ? 'int' : 'root' } });
    }, { count: 3 }),
    T('ts-parallel', '주어진 직선에 평행한 접선의 방정식', '②6', (d, n) => {
      const m = d.pick([1, -1, 2, -2, 3, -3]), aa = d.int(2, 30), bb = d.int(2, 30), v = aa * m * m + bb, s = m > 0 ? 1 : -1, c0 = nz(d, -9, 9);
      if (aa === bb || (n === 0 && !isSq(v)) || (n === 1 && (isSq(v) || sqParts(v)[0] !== 1)) || c0 * c0 === v) return null;
      const given = nb(poly([[s * m, X], [-s, Y], [s * c0, '']]) + ' = 0'), k = sqrtI(v);
      return pmAns(`타원 ${ellEq(aa, bb)}에 접하고 직선 ${given}에 평행한 직선의 방정식을 구하시오.`, m, n === 0 ? k : v, n === 1, {
        explain: `직선 ${given}의 기울기는 ${sg(m)}이므로 접선의 기울기도 ${sg(m)}이다. ${FORM_M}. ${nb(rt(`${aa} × ${sq2(m)} + ${bb}`) + ' = ' + (n === 1 ? rt(v) : k))}이므로 ${nb(Y + ' = ' + poly([[m, X]]) + ' ± ' + (n === 1 ? rt(v) : k))}이다.`,
        facts: { calc: [[`${jn(s * m)}/${jn(s)}`, 0], [n === 0 ? `(${aa}*${jn(s * m)}**2+${bb})**0.5` : `${aa}*${jn(s * m)}**2+${bb}`, 1]], rule: n === 0 ? 'int' : 'root' } });
    }, { count: 2 }),
    T('ts-k-line', '직선이 타원에 접할 때 직선 속의 상수', '②7', (d) => {
      const p = d.int(1, 4), q = nz(d, -4, 4), aa = d.int(2, 30), bb = d.int(2, 30), v = aa * p * p + bb * q * q, [r, s] = sqParts(v), Kv = V('k');
      if (aa === bb || r < 2 || s < 2) return null;
      const line = nb(poly([[p, X], [q, Y]]) + ' = ' + Kv), m = Q(-p, q);
      return inline(`직선 ${jh(line, '이/가')} 타원 ${ellEq(aa, bb)}에 접할 때, 실수 ${Kv}의 값을 구하시오.`, `${Kv} = ± {0}${rt('{1}')}`, [{ answer: r }, { answer: s }], {
        shown: nb(`${Kv} = ±${radText(r, s)}`),
        explain: `직선은 ${nb(Y + ' = ' + poly([[m, X]]) + (q < 0 ? ' ' + MINUS + ' ' : ' + ') + term2(Kv, Math.abs(q)))}이다. 기울기가 ${tx(m)}인 접선의 ${Y}절편은 ${nb('±' + rt(`${aa} × (${tx(m)})${sup(2)} + ${bb}`))}이므로 ${nb('(' + fracS(Kv, q) + ')' + sup(2) + ` = ${aa} × (${tx(m)})${sup(2)} + ${bb}`)}, 곧 ${nb(Kv + sup(2) + ` = ${aa} × ${p * p} + ${bb} × ${q * q} = ${v}`)}이다. 따라서 ${nb(`${Kv} = ±${radText(r, s)}`)}이다.`,
        facts: { calc: [[`((${aa}*${jn(p)}**2+${bb}*${jn(q)}**2)/${s})**0.5`, 0], [`${s}`, 1]] } });
    }),
    T('ts-k-ellipse', '직선이 타원에 접할 때 타원 속의 상수', '②8', (d, n) => {
      const mq = d.pick([Q(1), Q(2), Q(3), Q(1, 2), Q(1, 3), Q(-1), Q(-2), Q(-1, 2)]), c0 = nz(d, -6, 6), bb = d.int(1, 12), top = (c0 * c0 - bb) * mq.q * mq.q;
      if (top <= 0 || top % (mq.p * mq.p) !== 0) return null;
      const a2 = top / (mq.p * mq.p);
      if (a2 === bb || (n === 1 && (a2 <= bb || isSq(a2 - bb)))) return null;
      const Av = V('a'), line = nb(Y + ' = ' + poly([[mq, X], [c0, '']])), ell = nb(frac(X2, Av + sup(2)) + ' + ' + term(Y2, bb) + ' = 1');
      const why = `${FORM_M}. 직선의 ${Y}절편이 ${sg(c0)}이므로 ${nb(`${sqN(c0)} = ${Av}${sup(2)} × (${tx(mq)})${sup(2)} + ${bb}`)}, ${nb(`${Av}${sup(2)} = ${a2}`)}이다.`;
      const aE = `(${jn(c0)}**2-${bb})*${mq.q * mq.q}/${mq.p * mq.p}`;
      if (n === 0) {
        return N(`직선 ${jh(line, '이/가')} 타원 ${ell}에 접할 때, 상수 ${Av}에 대하여 ${nb(Av + sup(2))}의 값은?`, a2, { explain: why, facts: { value: aE, rule: 'a2' } });
      }
      const [r, s] = sqParts(a2 - bb);
      return radLen(`직선 ${jh(line, '이/가')} 타원 ${ell}에 접할 때, 이 타원의 두 초점 사이의 거리는? ${nb(`(단, ${Av} &gt; 0)`)}`, 2 * r, s, '', {
        explain: `${why} ${nb(`${a2} &gt; ${bb}`)}이므로 두 초점은 ${X}축 위에 있고 초점까지의 거리는 ${nb(rt(`${a2} ${MINUS} ${bb}`) + ' = ' + radText(r, s))}이다. 따라서 두 초점 사이의 거리는 ${radText(2 * r, s)}이다.`,
        facts: { calc: [[`2*((${aE}-${bb})/${s})**0.5`, 0], [`${s}`, 1]], rule: 'focal' } });
    }, { count: 2 })
  ];

  // ═══ 마. 타원 위의 점에서의 접선 ═══
  const P_TP = POOL_PT.filter((e) => intSlope(e) && intCut(e));
  const tpoint = [
    T('tp-point', '타원 위의 점에서의 접선의 방정식', '②10', (d) => {
      const [aa, bb, x1, y1] = d.pick(P_TP), m = -bb * x1 / (aa * y1), c = bb / y1, coef = d.bool(), E = coefOf(aa, bb);
      return lineAns(`타원 ${coef ? E.text : ellEq(aa, bb)} 위의 점 ${pt(x1, y1)}에서의 접선의 방정식을 구하시오.`, m, c, {
        explain: `${coef ? `양변을 ${jh(E.r, '으로/로')} 나누면 ${ellEq(aa, bb)}이다. ` : ''}${FORM_P}. 따라서 ${tanTx(x1, y1, aa, bb)}, 곧 ${nb(Y + ' = ' + poly([[m, X], [c, '']]))}이다.`,
        facts: { calc: [[`0-${bb}*${jn(x1)}/(${aa}*${jn(y1)})`, 0], [`${bb}/${jn(y1)}`, 1]] } });
    }),
    T('tp-ab', '접점과 접선의 기울기(y절편)로 타원의 a², b² 구하기', '②11', (d, n) => {
      // 두 차례가 같은 타원·같은 점을 고르지 않게 묶음을 가른다(기울기가 정수인 것 / y절편만 정수인 것).
      const pool = n === 0 ? POOL_PT.filter(intSlope) : POOL_PT.filter((e) => intCut(e) && !intSlope(e));
      const [aa, bb, x1, y1] = d.pick(pool), m = -bb * x1 / (aa * y1), c = bb / y1, Av = V('a'), Bv = V('b');
      const ell = nb(frac(X2, Av + sup(2)) + ' + ' + frac(Y2, Bv + sup(2)) + ' = 1'), tan = tanTx(x1, y1, Av + sup(2), Bv + sup(2));
      const cond = n === 0 ? `접선의 기울기가 ${sg(m)}` : `접선의 ${Y}절편이 ${sg(c)}`;
      const tE = `(0-${jn(m)}*${jn(y1)})`;
      const calc = n === 0
        ? [[`(${jn(x1)}*${jn(x1)}*${tE}+${jn(y1)}*${jn(y1)}*${jn(x1)})/${tE}`, 0], [`${tE}*((${jn(x1)}*${jn(x1)}*${tE}+${jn(y1)}*${jn(y1)}*${jn(x1)})/${tE})/${jn(x1)}`, 1]]
        : [[`${jn(x1)}*${jn(x1)}*${jn(c)}*${jn(y1)}/(${jn(c)}*${jn(y1)}-${jn(y1)}*${jn(y1)})`, 0], [`${jn(c)}*${jn(y1)}`, 1]];
      return inline(`타원 ${ell} 위의 점 ${pt(x1, y1)}에서의 ${cond}일 때, 상수 ${nb(Av + sup(2))}, ${nb(Bv + sup(2))}의 값을 구하시오.`, `${Av}${sup(2)} = {0}, ${Bv}${sup(2)} = {1}`, [{ answer: aa }, { answer: bb }], {
        shown: `${nb(Av + sup(2) + ' = ' + aa)}, ${nb(Bv + sup(2) + ' = ' + bb)}`,
        explain: `점 ${pt(x1, y1)}에서의 접선은 ${tan}이다. ${n === 0 ? `이 직선의 기울기는 ${nb((x1 * y1 > 0 ? MINUS : '') + frac(coefV(x1, Bv + sup(2)), coefV(y1, Av + sup(2))))}이므로 ${nb(`${Bv}${sup(2)} = ${tx(Q(-m * y1, x1))}${Av}${sup(2)}`)}이다` : `이 직선의 ${Y}절편은 ${fracS(Bv + sup(2), y1)}이므로 ${nb(`${Bv}${sup(2)} = ${bb}`)}이다`}. 점이 타원 위에 있으므로 ${nb(frac(x1 * x1, Av + sup(2)) + ' + ' + frac(y1 * y1, Bv + sup(2)) + ' = 1')}이고, 연립하면 ${nb(Av + sup(2) + ' = ' + aa)}, ${nb(Bv + sup(2) + ' = ' + bb)}이다.`,
        facts: { calc, rule: n === 0 ? 'slope' : 'cut' } });
    }, { count: 2 }),
    T('tp-parallel-pt', '주어진 직선에 평행한 접선의 접점', '②12', (d) => {
      const [p, q, r, x1, y1] = d.pick(POOL_C.filter(([, , , x]) => x > 0)), g = gcd(p * x1, q * y1), u = p * x1 / g, v = q * y1 / g;
      const w = nz(d, -12, 12);
      if (w * g === r || w * g === -r) return null;
      const given = nb(poly([[u, X], [v, Y]]) + ' = ' + sg(w));
      // 검사 식: 기울기 조건 p·x/(q·y) = u/v 와 p x² + q y² = r 에서 y² = r·p·v² / (q(q·u² + p·v²)), x = u·q·y/(v·p)
      const yE = `${y1 < 0 ? '0-' : ''}(${r}*${p}*${jn(v)}**2/(${q}*(${q}*${jn(u)}**2+${p}*${jn(v)}**2)))**0.5`;
      return coordAns(`타원 ${coefTx(p, q, r)} 위의 점 P에서의 접선이 직선 ${jh(given, '과/와')} 평행할 때, 점 P의 좌표를 구하시오. (단, 점 P의 ${X}좌표는 양수이다.)`, [x1, y1], {
        explain: `점 P를 ${P1R} 하면 접선은 ${nb(poly([[p, ms('x_1x')], [q, ms('y_1y')]]) + ' = ' + r)}이다. 직선 ${jh(given, '과/와')} 평행하므로 ${nb(`${p === 1 ? '' : p}${ms('x_1')} : ${q === 1 ? '' : q}${ms('y_1')} = ${sg(u)} : ${sg(v)}`)}이고, 이를 타원의 식과 연립하면 ${nb(ms('x_1') + ' &gt; 0')}인 점은 ${pt(x1, y1)}이다.`,
        facts: { calc: [[`${jn(u)}*${q}*(${yE})/(${jn(v)}*${p})`, 0], [yE, 1]] } });
    }),
    T('tp-parallel-other', '타원 위의 점에서의 접선에 평행한 다른 접선', '②26 ➊·➋', (d) => {
      const [p, q, r, x1, y1] = d.pick(POOL_C.filter(([p, q, r, x, y]) => (p * x) % (q * y) === 0 && r % (q * y) === 0)), m = -p * x1 / (q * y1), c = -r / (q * y1), l = V('l');
      return lineAns(`타원 ${coefTx(p, q, r)} 위의 점 ${named('P', x1, y1)}에서의 접선을 ${jh(l, '이라/라')} 할 때, 이 타원에 접하고 직선 ${l}에 평행한 다른 직선의 방정식을 구하시오.`, m, c, {
        explain: `직선 ${l}은 ${nb(poly([[p * x1, X], [q * y1, Y]]) + ' = ' + r)}이다. 타원은 원점에 대하여 대칭이므로 ${l}에 평행한 다른 접선은 점 ${pt(-x1, -y1)}에서의 접선 ${nb(poly([[-p * x1, X], [-q * y1, Y]]) + ' = ' + r)}이다. 곧 ${nb(Y + ' = ' + poly([[m, X], [c, '']]))}이다.`,
        facts: { calc: [[`0-${p}*${jn(x1)}/(${q}*${jn(y1)})`, 0], [`0-${r}/(${q}*${jn(y1)})`, 1]] } });
    }),
    T('tp-xint', '접선의 x절편으로 접점 구하기', '②13', (d, n) => {
      if (n === 0) {
        const [aa, bb, x1, y1] = d.pick(POOL_PT.filter(([aa, , x, y]) => x > 0 && y > 0 && aa % x === 0 && x * x !== aa)), X0 = aa / x1;
        return coordAns(`타원 ${ellEq(aa, bb)} 위의 제1사분면의 점 P에서의 접선의 ${X}절편이 ${X0}일 때, 점 P의 좌표를 구하시오.`, [x1, y1], {
          explain: `점 P를 ${P1R} 하면 접선 ${nb(frac(ms('x_1x'), aa) + ' + ' + frac(ms('y_1y'), bb) + ' = 1')}의 ${X}절편은 ${frac(aa, ms('x_1'))}이다. ${nb(frac(aa, ms('x_1')) + ' = ' + X0)}에서 ${nb(ms('x_1') + ' = ' + x1)}이고, 타원의 식에 넣으면 ${nb(ms('y_1') + ' = ' + y1)}(양수)이다.`,
          facts: { calc: [[`${aa}/${X0}`, 0], [`(${bb}*(${aa}-(${aa}/${X0})**2)/${aa})**0.5`, 1]], rule: 'pt' } });
      }
      const [aa, bb, x1, y1, c] = d.pick(POOL_X2), area = c * y1;
      return N(`타원 ${ellEq(aa, bb)}의 두 초점 가운데 ${X}좌표가 양수인 점을 F라 하고, 타원 위의 제1사분면의 점 P에서의 접선이 ${X}축과 만나는 점을 Q라 하자. ${nb(SG('OF') + ' = ' + SG('FQ'))}일 때, 삼각형 POQ의 넓이는? (단, O는 원점이다.)`, area, {
        explain: `초점까지의 거리는 ${nb(rt(`${aa} ${MINUS} ${bb}`) + ' = ' + c)}이므로 F(${c}, 0)이고 ${nb(SG('OF') + ' = ' + SG('FQ'))}에서 Q(${2 * c}, 0)이다. 점 P를 ${P1R} 하면 접선의 ${X}절편 ${frac(aa, ms('x_1'))}이 ${2 * c}이므로 ${nb(ms('x_1') + ' = ' + x1)}, ${nb(ms('y_1') + ' = ' + y1)}이다. 넓이는 ${nb(`½ × ${2 * c} × ${y1} = ${area}`)}이다.`,
        facts: { value: `(${aa}-${bb})**0.5*(${bb}*(1-(${aa}/(2*(${aa}-${bb})**0.5))**2/${aa}))**0.5`, rule: 'area' } });
    }, { count: 2 }),
    T('tp-ohoq', '접선의 절편과 수선의 발 — OH × OQ', '②14', (d, n) => {
      const aa = d.int(2, 20), bb = d.int(2, 20);
      if (aa === bb) return null;
      const a = Math.sqrt(aa), b = Math.sqrt(bb), t = n === 0 ? 0.62 : 0.95, x1 = a * Math.cos(t), y1 = b * Math.sin(t), onX = n === 0;
      const Qp = onX ? [aa / x1, 0] : [0, bb / y1], Hp = onX ? [x1, 0] : [0, y1], slope = -bb * x1 / (aa * y1);
      const figure = ellFig({ aa, bb, x: [-a - 0.4, Math.max(a, Qp[0]) + 0.5], y: [-b - 0.4, Math.max(b, Qp[1]) + 0.5],
        lines: [{ p: [x1, y1], q: [x1 + 1, y1 + slope] }], segs: [{ p: [x1, y1], q: Hp, dash: true }],
        dots: [{ x: x1, y: y1, name: 'P', said: '타원 위의 제1사분면의 점' }, { x: Hp[0], y: Hp[1], name: 'H', side: onX ? 'd' : 'l', said: `점 P에서 ${onX ? 'x' : 'y'}축에 내린 수선의 발` }, { x: Qp[0], y: Qp[1], name: 'Q', side: 'ur', said: `접선과 ${onX ? 'x' : 'y'}축의 교점` }] });
      const ans = onX ? aa : bb, ax = onX ? X : Y;
      return N(`그림과 같이 타원 ${ellEq(aa, bb)} 위의 제1사분면의 점 P에서 ${ax}축에 내린 수선의 발을 H, 점 P에서의 접선이 ${ax}축과 만나는 점을 Q라 할 때, ${nb(SG('OH') + ' × ' + SG('OQ'))}의 값은? (단, O는 원점이다.)`, ans, {
        figure,
        explain: `점 P를 ${P1R} 하면 접선은 ${nb(frac(ms('x_1x'), aa) + ' + ' + frac(ms('y_1y'), bb) + ' = 1')}이다. ${onX ? `${nb(SG('OH') + ' = ' + ms('x_1'))}이고 접선의 ${X}절편은 ${frac(aa, ms('x_1'))}` : `${nb(SG('OH') + ' = ' + ms('y_1'))}이고 접선의 ${Y}절편은 ${frac(bb, ms('y_1'))}`}이므로 ${nb(SG('OH') + ' × ' + SG('OQ') + ' = ' + ans)}이다(점 P가 어디에 있어도 같다).`,
        facts: { value: `${ans}`, rule: onX ? 'x' : 'y' } });
    }, { count: 2 }),
    T('tp-perp', '타원 위의 점에서의 접선에 수직인 직선', '②15', (d) => {
      const [aa, bb, x1, y1] = d.pick(P_TP), m = -bb * x1 / (aa * y1), t = nz(d, -3, 3), u = m * t, v = nz(d, -6, 6), cut = v + u / m;
      if (cut === 0 || (u === x1 && v === y1)) return null;
      return qAns(`타원 ${ellEq(aa, bb)} 위의 점 ${pt(x1, y1)}에서의 접선에 수직이고 점 ${jh(pt(u, v), '을/를')} 지나는 직선의 ${Y}절편은?`, cut, {
        signed: true,
        explain: `점 ${pt(x1, y1)}에서의 접선은 ${nb(Y + ' = ' + poly([[m, X], [bb / y1, '']]))}이므로 기울기는 ${sg(m)}이다. 이에 수직인 직선의 기울기는 ${tx(Q(-1, m))}이고 점 ${jh(pt(u, v), '을/를')} 지나므로 ${nb(Y + ' = ' + poly([[Q(-1, m), X], [cut, '']]))}이다. 따라서 ${Y}절편은 ${sg(cut)}이다.`,
        facts: { value: `${jn(v)}+${jn(u)}/(0-${bb}*${jn(x1)}/(${aa}*${jn(y1)}))` } });
    })
  ];
  // 초점 F(c, 0)(c 는 정수)에서 OF = FQ 가 되는 접점 [aa, bb, x1, y1, c]
  const POOL_X2 = [];
  for (let aa = 4; aa <= 120; aa += 1) for (let bb = 1; bb < aa; bb += 1) {
    if (!isSq(aa - bb)) continue;
    const c = sqrtI(aa - bb);
    if (aa % (2 * c) !== 0) continue;
    const x1 = aa / (2 * c), top = bb * (aa - x1 * x1);
    if (x1 * x1 >= aa || top % aa !== 0 || !isSq(top / aa)) continue;
    POOL_X2.push([aa, bb, x1, sqrtI(top / aa), c]);
  }

  // ═══ 바. 타원 밖의 점에서 그은 접선 ═══
  const tout = [
    T('to-lines', '타원 밖의 점에서 그은 접선 — 좌표축에 평행한 접선까지 있는 대로 고르기', '②18', (d, n) => {
      let aa, bb, x0, y0, axisLine, oblique, wrong;
      if (n === 0) {
        const a = d.int(1, 5); aa = a * a; bb = d.int(1, 20); x0 = d.pick([1, -1]) * a; y0 = nz(d, -6, 6);
        if (aa === bb || y0 * y0 === bb) return null;
        const mq = Q(y0 * y0 - bb, 2 * x0 * y0);
        axisLine = normLine(1, 0, x0); oblique = lineMC(mq, qsub(Q(y0), qmul(mq, Q(x0))));
        wrong = d.bool() ? lineMC(qneg(mq), qadd(Q(y0), qmul(mq, Q(x0)))) : normLine(0, 1, y0);
      } else {
        const b = d.int(1, 5); bb = b * b; aa = d.int(1, 20); y0 = d.pick([1, -1]) * b; x0 = nz(d, -6, 6);
        if (aa === bb || x0 * x0 === aa) return null;
        const mq = Q(2 * x0 * y0, x0 * x0 - aa);
        axisLine = normLine(0, 1, y0); oblique = lineMC(mq, qsub(Q(y0), qmul(mq, Q(x0))));
        wrong = d.bool() ? lineMC(qneg(mq), qadd(Q(y0), qmul(mq, Q(x0)))) : normLine(1, 0, x0);
      }
      const lines = d.shuffle([axisLine, oblique, wrong]), truth = lines.map((l) => touches(l, aa, bb) && l.p * x0 + l.q * y0 === l.r);
      if (truth.filter(Boolean).length !== 2 || sameLine(wrong, oblique) || sameLine(wrong, axisLine)) return null;
      const { opts, at } = subsetChoice(d, truth);
      return C(`점 ${pt(x0, y0)}에서 타원 ${ellEq(aa, bb)}에 그은 접선인 것만을 보기에서 있는 대로 고른 것은?<br>ㄱ. ${lineTx(lines[0])}<br>ㄴ. ${lineTx(lines[1])}<br>ㄷ. ${lineTx(lines[2])}`, opts, at, {
        explain: `점 ${jh(pt(x0, y0), '은/는')} 직선 ${lineTx(axisLine)} 위에 있고, 이 직선은 타원의 꼭짓점에서의 접선이다(기울기가 없거나 0인 접선은 ${nb(Y + ' = ' + V('m') + X + ' + ' + V('n'))} 꼴의 공식으로는 잡히지 않으므로 따로 본다). 다른 접선은 접점을 ${nb('(' + ms('x_1') + ', ' + ms('y_1') + ')')}로 놓고 접선이 점 ${jh(pt(x0, y0), '을/를')} 지나는 조건과 타원의 식을 연립해 구하면 ${lineTx(oblique)}이다. 직선 ${jh(lineTx(wrong), '은/는')} 점을 지나지만 타원에 접하지 않는다. 따라서 답은 ${opts[at]}이다.`,
        facts: { truth: opts.map((o, i) => i === at), want: true, rule: n === 0 ? 'v' : 'h' } });
    }, { count: 2 }),
    T('to-contact', '타원 밖의 점에서 그은 두 접선의 접점', '②19', (d) => {
      const [p, q, r, , , [ax, ay]] = d.pick(POOL_OUT), [e1, e2] = polarPts(p, q, r, ax, ay);
      if (![e1, e2].every((e) => Number.isInteger(e.x) && Number.isInteger(e.y))) return null;
      return pairAns(`점 ${named('A', ax, ay)}에서 타원 ${coefTx(p, q, r)}에 그은 두 접선의 접점의 좌표를 구하시오.`, [e1.x, e1.y], [e2.x, e2.y], {
        explain: `접점을 ${P1R} 하면 접선은 ${nb(poly([[p, ms('x_1x')], [q, ms('y_1y')]]) + ' = ' + r)}이고, 이 직선이 점 A를 지나므로 ${nb(poly([[p * ax, ms('x_1')], [q * ay, ms('y_1')]]) + ' = ' + r)}이다. 이 식과 ${jh(nb(poly([[p, ms('x_1^2')], [q, ms('y_1^2')]]) + ' = ' + r), '을/를')} 연립하면 접점은 ${pt(e1.x, e1.y)}, ${pt(e2.x, e2.y)}이다.`,
        facts: { calc: [[e1.ex, 0], [e1.ey, 1], [e2.ex, 2], [e2.ey, 3]] } });
    }),
    T('to-slope', '타원 밖의 점에서 그은 접선의 기울기', '②20', (d, n) => {
      if (n === 0) {
        const b = d.int(1, 5), bb = b * b, aa = d.int(2, 30), x0 = nz(d, -5, 5), y0 = d.pick([1, -1]) * b;
        if (aa === bb || x0 * x0 >= aa) return null;
        const mq = Q(2 * x0 * y0, x0 * x0 - aa);
        if (mq.q === 1) return null;
        const neg = mq.p < 0;
        return qAns(`점 ${pt(x0, y0)}에서 타원 ${ellEq(aa, bb)}에 그은 두 접선 가운데 기울기가 ${neg ? '음수' : '양수'}인 접선의 기울기는?`, mq, {
          signed: true,
          explain: `${FORM_M}. 이 직선이 점 ${jh(pt(x0, y0), '을/를')} 지나므로 ${nb(`(${poly([[y0, ''], [-x0, V('m')]])})${sup(2)} = ${aa}${V('m')}${sup(2)} + ${bb}`)}, 곧 ${nb(`${V('m')}(${poly([[x0 * x0 - aa, V('m')], [-2 * x0 * y0, '']])}) = 0`)}이다. ${nb(V('m') + ' = 0')}(접선 ${nb(Y + ' = ' + sg(y0))}) 또는 ${nb(V('m') + ' = ' + tx(mq))}이므로 답은 ${tx(mq)}이다.`,
          facts: { value: `2*${jn(x0)}*${jn(y0)}/(${jn(x0)}**2-${aa})`, rule: 'zero' } });
      }
      const aa = d.int(2, 20), bb = d.int(2, 20), m = d.int(1, 4), t2 = aa * m * m + bb;
      if (aa === bb || !isSq(t2)) return null;
      const t = d.pick([1, -1]) * sqrtI(t2), Kv = V('k');
      return N(`점 ${pt(0, t)}에서 타원 ${ellEq(aa, bb)}에 그은 접선의 기울기를 ${jh(Kv, '이라/라')} 할 때, ${nb(Kv + sup(2))}의 값은?`, m * m, {
        explain: `${FORM_M}. 이 직선의 ${Y}절편이 ${sg(t)}이므로 ${nb(`${sqN(t)} = ${aa}${V('m')}${sup(2)} + ${bb}`)}, 곧 ${nb(V('m') + sup(2) + ' = ' + m * m)}이다. 따라서 ${nb(Kv + sup(2) + ' = ' + m * m)}이다.`,
        facts: { value: `(${jn(t)}**2-${bb})/${aa}`, rule: 'axis' } });
    }, { count: 2 }),
    T('to-yaxis', '타원 밖의 점에서 그은 두 접선이 y축과 만나는 두 점 사이의 거리', '②21', (d, n) => {
      if (n === 0) {
        const b = d.int(1, 5), s = d.int(1, 6), h = d.int(s + 1, s + 6), aa = h * h - s * s, bb = b * b, len = 2 * b * h / s;
        if (aa < 2 || aa === bb || !Number.isInteger(len)) return null;
        const hx = d.pick([1, -1]) * h, mq = Q(b, s);
        return N(`점 ${named('A', hx, 0)}에서 타원 ${ellEq(aa, bb)}에 그은 두 접선이 ${Y}축과 만나는 점을 각각 B, C라 할 때, 선분 BC의 길이는?`, len, {
          explain: `${FORM_M}. 이 직선이 점 A를 지나므로 ${nb(`(${poly([[-hx, V('m')]])})${sup(2)} = ${aa}${V('m')}${sup(2)} + ${bb}`)}, 곧 ${nb(`${s * s}${V('m')}${sup(2)} = ${bb}`)}, ${nb(V('m') + ' = ±' + tx(mq))}이다. 두 접선 ${nb(Y + ' = ±' + tx(mq) + '(' + poly([[1, X], [-hx, '']]) + ')')}의 ${Y}절편은 ${nb('±' + tx(qmul(mq, Q(h))))}이므로 ${nb(SG('BC') + ' = ' + len)}이다.`,
          facts: { value: `2*${bb}**0.5*${h}/(${h}**2-${aa})**0.5`, rule: 'axis' } });
      }
      const [p, q, r, , , [ax, ay]] = d.pick(POOL_OUT), [e1, e2] = polarPts(p, q, r, ax, ay);
      if (![e1, e2].every((e) => Number.isInteger(e.x) && Number.isInteger(e.y) && e.y !== 0)) return null;
      const c1 = Q(r, q * e1.y), c2 = Q(r, q * e2.y), len = qsub(c1, c2).p < 0 ? qsub(c2, c1) : qsub(c1, c2);
      if (len.q === 1) return null;
      const [hi, lo] = qsub(c1, c2).p < 0 ? [e2, e1] : [e1, e2];
      return qAns(`점 ${named('A', ax, ay)}에서 타원 ${coefTx(p, q, r)}에 그은 두 접선이 ${Y}축과 만나는 점을 각각 B, C라 할 때, 선분 BC의 길이는?`, len, {
        explain: `접점을 ${P1R} 하면 접선 ${jh(nb(poly([[p, ms('x_1x')], [q, ms('y_1y')]]) + ' = ' + r), '이/가')} 점 A를 지나므로 ${nb(poly([[p * ax, ms('x_1')], [q * ay, ms('y_1')]]) + ' = ' + r)}이다. 타원의 식과 연립하면 접점은 ${pt(e1.x, e1.y)}, ${pt(e2.x, e2.y)}이고, 두 접선 ${lineTx(normLine(p * e1.x, q * e1.y, r))}, ${lineTx(normLine(p * e2.x, q * e2.y, r))}의 ${Y}절편은 ${tx(c1)}, ${tx(c2)}이다. 따라서 ${nb(SG('BC') + ' = ' + tx(len))}이다.`,
        facts: { value: `${r}/(${q}*(${hi.ey}))-${r}/(${q}*(${lo.ey}))`, rule: 'general' } });
    }, { count: 2 }),
    T('to-perp', '두 접선이 서로 수직이 되는 점', '②22', (d, n) => {
      const Kv = V('k'), Av = V('a');
      if (n === 0) {
        const aa = d.int(2, 30), bb = d.int(2, 30), x0 = nz(d, -4, 4), k2 = aa + bb - x0 * x0;
        if (aa === bb || k2 <= 0 || !isSq(k2) || x0 * x0 === aa) return null;
        const k = sqrtI(k2), E = coefOf(aa, bb);
        return N(`점 ${nb('(' + sg(x0) + ', ' + Kv + ')')}에서 타원 ${E.text}에 그은 두 접선이 서로 수직일 때, 양수 ${Kv}의 값은?`, k, {
          explain: `양변을 ${jh(E.r, '으로/로')} 나누면 ${ellEq(aa, bb)}이다. ${FORM_M}. 이 직선이 점을 지나므로 ${nb(`(${poly([[1, Kv], [-x0, V('m')]])})${sup(2)} = ${aa}${V('m')}${sup(2)} + ${bb}`)}, 곧 ${nb(poly([[x0 * x0 - aa, V('m') + sup(2)], [-2 * x0, Kv + V('m')]]) + ' + ' + Kv + sup(2) + ' ' + MINUS + ' ' + bb + ' = 0')}이다. 두 접선이 수직이면 두 기울기의 곱이 ${MINUS}1이므로 ${nb(`${Kv}${sup(2)} ${MINUS} ${bb} = ${MINUS}(${x0 * x0} ${MINUS} ${aa})`)}, ${nb(Kv + sup(2) + ' = ' + k2)}이다. 따라서 양수 ${Kv}는 ${k}이다.`,
          facts: { value: `(${E.r}/${E.p}+${E.r}/${E.q}-${jn(x0)}**2)**0.5`, rule: 'k' } });
      }
      const u = d.int(1, 9), v = d.int(1, 9), x0 = nz(d, -4, 4), y0 = nz(d, -4, 4), a2 = Q(x0 * x0 + y0 * y0, u + v);
      if (u === v || a2.q === 1 || x0 * x0 * (u + v) === u * (x0 * x0 + y0 * y0)) return null;
      const den = (c) => (c === 1 ? '' : c) + Av + sup(2), ell = nb(frac(X2, den(u)) + ' + ' + frac(Y2, den(v)) + ' = 1');
      return qAns(`점 ${pt(x0, y0)}에서 타원 ${ell}에 그은 두 접선이 서로 수직일 때, 상수 ${Av}에 대하여 ${nb(Av + sup(2))}의 값은?`, a2, {
        explain: `기울기가 ${V('m')}인 접선 ${nb(Y + ' = ' + V('m') + X + ' ± ' + rt(`${den(u)}${V('m')}${sup(2)} + ${den(v)}`))}이 점을 지나므로 ${nb(`(${poly([[y0, ''], [-x0, V('m')]])})${sup(2)} = ${den(u)}${V('m')}${sup(2)} + ${den(v)}`)}이다. ${V('m')}에 대한 이차방정식 ${nb(`(${x0 * x0} ${MINUS} ${den(u)})${V('m')}${sup(2)} ${x0 * y0 > 0 ? MINUS : '+'} ${Math.abs(2 * x0 * y0)}${V('m')} + ${y0 * y0} ${MINUS} ${den(v)} = 0`)}의 두 근의 곱이 ${MINUS}1이므로 ${nb(`${y0 * y0} ${MINUS} ${den(v)} = ${MINUS}(${x0 * x0} ${MINUS} ${den(u)})`)}, 곧 ${nb(`${u + v}${Av}${sup(2)} = ${x0 * x0 + y0 * y0}`)}이다. 따라서 ${nb(Av + sup(2) + ' = ' + tx(a2))}이다.`,
        facts: { value: `(${jn(x0)}**2+${jn(y0)}**2)/(${u}+${v})`, rule: 'a2' } });
    }, { count: 2 }),
    T('to-dist', '타원 위의 점과 직선 사이의 거리의 최대·최소', '②25', (d, n) => {
      if (n < 2) {
        const [aa, bb, p, q, R] = d.pick(POOL_DIST), j = d.int(1, 4), sgn = d.pick([1, -1]), c0 = sgn * (R + 5 * j), coef = d.bool(), E = coefOf(aa, bb);
        const line = nb(poly([[p, X], [q, Y], [-c0, '']]) + ' = 0'), lo = (Math.abs(c0) - R) / 5, hi = (Math.abs(c0) + R) / 5;
        return N(`타원 ${coef ? E.text : ellEq(aa, bb)} 위의 점 P와 직선 ${line} 사이의 거리의 ${n === 0 ? '최솟값' : '최댓값'}은?`, n === 0 ? lo : hi, {
          explain: `${coef ? `양변을 ${jh(E.r, '으로/로')} 나누면 ${ellEq(aa, bb)}이다. ` : ''}직선 ${nb(poly([[p, X], [q, Y]]) + ' = ' + V('k'))}가 타원에 접하려면 ${nb(V('k') + sup(2) + ` = ${aa} × ${p * p} + ${bb} × ${q * q} = ${R * R}`)}, ${nb(V('k') + ' = ±' + R)}이다. 거리가 ${n === 0 ? '가장 작은 점은 주어진 직선에 가까운 쪽' : '가장 큰 점은 주어진 직선에서 먼 쪽'} 접선 ${nb(poly([[p, X], [q, Y]]) + ' = ' + sg(n === 0 ? sgn * R : -sgn * R))}의 접점이므로, 거리는 평행한 두 직선 사이의 거리 ${nb(frac(`|${sg(c0)} ${MINUS} (${sg(n === 0 ? sgn * R : -sgn * R)})|`, rt(`${p * p} + ${q * q}`)) + ' = ' + (n === 0 ? lo : hi))}이다.`,
          facts: { value: `(${Math.abs(c0)}${n === 0 ? '-' : '+'}(${aa}*${jn(p)}**2+${bb}*${jn(q)}**2)**0.5)/(${jn(p)}**2+${jn(q)}**2)**0.5`, rule: n === 0 ? 'min' : 'max' } });
      }
      const [p, q, r, x1, y1, u, v, w, k, s] = d.pick(POOL_DIST2), tan = lineTx({ p: u, q: v, r: w });
      return radLen(`타원 ${coefTx(p, q, r)} 위의 점 ${named('A', x1, y1)}에서의 접선과 이 타원 위의 점 P 사이의 거리의 최댓값은?`, k, s, '', {
        explain: `점 A에서의 접선은 ${nb(poly([[p * x1, X], [q * y1, Y]]) + ' = ' + r)}, 곧 ${tan}이다. 이 직선과 평행한 다른 접선은 원점에 대하여 대칭인 점 ${pt(-x1, -y1)}에서의 접선 ${lineTx({ p: u, q: v, r: -w })}이고, 거리가 가장 큰 점 P는 그 접점이다. 두 직선 사이의 거리는 ${nb(frac(`|${sg(w)} ${MINUS} (${sg(-w)})|`, rt(`${u * u} + ${v * v}`)) + ' = ' + radText(k, s))}이다.`,
        facts: { calc: [[`(4*${jn(w)}**2/(${jn(u)}**2+${jn(v)}**2)/${s})**0.5`, 0], [`${s}`, 1]], rule: 'tangent' } });
    }, { count: 3 })
  ];
  // 거리의 최대·최소: px + qy = ±R 이 접하고 R 이 5의 배수(√(p² + q²) = 5)인 타원 [aa, bb, p, q, R]
  const POOL_DIST = [];
  for (let aa = 2; aa <= 40; aa += 1) for (let bb = 2; bb <= 40; bb += 1) if (aa !== bb) for (const [p, q] of [[3, 4], [4, 3], [3, -4], [4, -3]]) {
    const R2 = aa * p * p + bb * q * q;
    if (isSq(R2) && sqrtI(R2) % 5 === 0) POOL_DIST.push([aa, bb, p, q, sqrtI(R2)]);
  }
  // 한 점에서의 접선과 타원 위의 점 사이 거리의 최댓값이 k√s(k ≥ 2, s ≥ 2)인 것 [p, q, r, x1, y1, u, v, w, k, s]
  const POOL_DIST2 = [];
  for (const [p, q, r, x1, y1] of POOL_C) {
    const L = normLine(p * x1, q * y1, r), num = 4 * L.r * L.r, den = L.p * L.p + L.q * L.q;
    if (num % den !== 0) continue;
    const [k, s] = sqParts(num / den);
    if (k >= 2 && s >= 2) POOL_DIST2.push([p, q, r, x1, y1, L.p, L.q, L.r, k, s]);
  }

  B.addTypes('11-4-2', 'tslope', tslope);
  B.addTypes('11-4-2', 'tpoint', tpoint);
  B.addTypes('11-4-2', 'tout', tout);
})(typeof window !== 'undefined' ? window : globalThis);
