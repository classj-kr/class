// 고등학교 기하 Ⅰ-1 포물선 — 뒤쪽 묶음(기울기가 주어진 접선, 포물선 위의 점에서의 접선, 포물선 밖의 점에서 그은 접선, 접선과 도형).
// 단원 틀·싣는 기준·뺀 것과 까닭은 11-4-1a.js 머리에 적었다. 도구는 B.kit.u1141(a 파일)을 쓴다.
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번.
// 접선은 교과서의 두 공식(기울기가 m일 때 y = mx + p/m, 접점 (x₁, y₁)에서 y₁y = 2p(x + x₁)·x₁x = 2p(y + y₁))과 판별식으로 푼다.
// 평행이동한 포물선의 접선은 교육과정이 다루지 않으므로 접선 문항의 포물선은 모두 꼭짓점이 원점이다(직선을 평행이동하는 ②7은 된다).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, inline, M } = B.kit;
  const { MINUS, Q, qneg, nb, V, sup, nz, poly, rt, sqParts, radText, linAns, radAns, SG } = B.kit.mid;
  const { coordAns, plot, jh, sub } = B.kit.hs;
  const K = B.kit.u1141;
  const { S4, T, X, Y, Av, Bv, Kv, Pv, Mv, iq, jn, pn, is, cpt, npt, parH, parV, eqx, eqy, yline, NOTEF, jq, numA, posA, vals, BLUE, RED, vpar } = K;

  // 직선의 방정식이 답: y = [±][ ]x [±][ ] (기울기·y절편이 0이 아닌 정수)
  const lineA = (text, m, b, o) => (Number.isInteger(m) && Number.isInteger(b) && m !== 0 && b !== 0 ? linAns(text, m, b, X, o) : null);
  // 기울기가 분수인 직선: y = [±][ ]/[ ] x [±][ ](기울기는 정수가 아닌 분수, y절편은 0이 아닌 정수)
  const fracLineA = (text, m, b, o) => { const q = typeof m === 'number' ? Q(m) : m; if (q.q === 1 || !Number.isInteger(b) || b === 0) return null; return inline(text + NOTEF, `${Y} = ${frac('{0}', '{1}')}${X} {2}`, [{ answer: q.p, signed: true }, { answer: q.q }, { answer: b, signed: true }], Object.assign({}, o, { shown: yline(q, b) })); };
  // 수식 글: 일반형 직선 ax + by + c = 0
  const gline = (a, b, c) => nb(`${poly([[a, X], [b, Y], [c, '']])} = 0`);
  const y1 = V('y') + sub(1), y2 = V('y') + sub(2), x1 = V('x') + sub(1), x2 = V('x') + sub(2);

  // ══ 라. 기울기가 주어진 접선 ══
  const slope = [
    // ②2 기울기가 주어진 접선 y = mx + p/m(차례 1). ②6(y = mx + k가 접할 때 k)은 하는 일이 같아 차례 2로 — 계수가 4의 배수가 아닌 포물선이라 답이 분수.
    T('slope-given', '기울기가 주어진 접선의 방정식', '②2 ②6', (d, n) => {
      if (n === 0) {
        const m = nz(d, -3, 3), b = nz(d, -4, 4), p = m * b, k = 4 * p;
        if (Math.abs(k) > 36) return null;
        return lineA(`포물선 ${parH(k)}에 접하고 기울기가 ${iq(m)}인 직선의 방정식을 구하시오.`, m, b, {
          explain: `${parH(k)}에서 ${is(Pv, p)}이다. 기울기가 ${Mv}인 접선 ${nb(`${Y} = ${Mv}${X} + ${frac(Pv, Mv)}`)}에 ${is(Mv, m)}, ${jh(is(Pv, p), '을/를')} 넣으면 ${yline(m, b)}이다.`,
          facts: { calc: [[jn(m), 0], [`${jn(k)}/(4*${jn(m)})`, 1]], derived: [4] } });
      }
      const m = d.pick([1, -1, 2, -2]), c = d.pick([1, 2, 3, 5, 6, 7]) * d.pick([1, -1]), ans = Q(c, 4 * m);
      if (ans.q === 1) return null;
      return numA(`직선 ${nb(`${Y} = ${poly([[m, X]])} + ${Kv}`)}가 포물선 ${parH(c)}에 접할 때, 상수 ${Kv}의 값은?`, ans, {
        explain: `${nb(`${Y} = ${poly([[m, X]])} + ${Kv}`)}를 ${parH(c)}에 넣으면 ${nb(`(${poly([[m, X], [1, Kv]])})${sup(2)} = ${poly([[c, X]])}`)}이고, 이 ${X}의 이차방정식의 판별식이 0이어야 한다. 정리하면 ${nb(`${Kv} = ${frac(pn(c), `4 × ${pn(m)}`)}`)}, 곧 ${is(Kv, ans)}이다(공식 ${nb(`${Y} = ${Mv}${X} + ${frac(Pv, Mv)}`)}로 구해도 같다).`,
        facts: { value: `${jn(c)}/(4*${jn(m)})`, derived: [4] } });
    }, { count: 2 }),

    // ②3 x² = 4py 꼴에 접하고 기울기가 주어진 직선 — 판별식(공식이 y² = 4px 꼴뿐이다)
    T('slope-xpar', 'x² = 4py 꼴에 접하고 기울기가 주어진 직선', '②3', (d) => {
      const p = nz(d, -4, 4), m = nz(d, -3, 3), k = 4 * p, b = -p * m * m;
      return lineA(`포물선 ${parV(k)}에 접하고 기울기가 ${iq(m)}인 직선의 방정식을 구하시오.`, m, b, {
        explain: `구하는 직선을 ${nb(`${Y} = ${poly([[m, X]])} + ${Kv}`)}라 하고 ${parV(k)}에 넣어 정리한 ${X}의 이차방정식 ${nb(`${X}${sup(2)} = ${iq(k)}(${poly([[m, X]])} + ${Kv})`)}의 판별식이 0이어야 한다. ${nb(`(${iq(k * m)})${sup(2)} + 4 × ${pn(k)} × ${Kv} = 0`)}에서 ${is(Kv, b)}이므로 접선은 ${yline(m, b)}이다.`,
        facts: { calc: [[jn(m), 0], [`-(${jn(k)})/4*${jn(m)}*${jn(m)}`, 1]], derived: [4] } });
    }),

    // ②4 주어진 직선에 평행한 접선
    T('slope-par', '주어진 직선에 평행한 접선의 방정식', '②4', (d) => {
      const m = nz(d, -3, 3), b = nz(d, -4, 4), p = m * b, k = 4 * p, g = d.pick([1, 2]), c0 = nz(d, -9, 9);
      if (Math.abs(k) > 36 || c0 === b * g || (c0 / g) === b) return null;
      const sgn = m > 0 ? 1 : -1, given = gline(sgn * g * m, -sgn * g, sgn * c0);
      return lineA(`포물선 ${parH(k)}에 접하고 직선 ${given}에 평행한 직선의 방정식을 구하시오.`, m, b, {
        explain: `직선 ${given}의 기울기는 ${iq(m)}이고 ${parH(k)}에서 ${is(Pv, p)}이다. 기울기가 ${Mv}인 접선 ${nb(`${Y} = ${Mv}${X} + ${frac(Pv, Mv)}`)}에 ${is(Mv, m)}, ${jh(is(Pv, p), '을/를')} 넣으면 ${yline(m, b)}이다.`,
        facts: { calc: [[`${jn(sgn * g * m)}/(${jn(sgn * g)})`, 0], [`${jn(k)}*${g}/(4*${jn(g * m)})`, 1]], derived: [4, g] } });
    }),

    // ②5 주어진 직선에 수직인 접선(기울기가 분수)
    T('slope-perp', '주어진 직선에 수직인 접선의 방정식', '②5', (d) => {
      const u = d.pick([2, 3, 4, 5]), v = nz(d, -4, 4), w = nz(d, -3, 3), c1 = nz(d, -6, 6);
      if (Q(v, u).q !== u) return null;
      const p = v * w, k = 4 * p, mq = Q(v, u), b = u * w;
      if (Math.abs(k) > 40) return null;
      const given = nb(`${poly([[u, X], [v, Y]])} = ${iq(c1)}`);
      return fracLineA(`포물선 ${parH(k)}에 접하고 직선 ${given}에 수직인 직선의 방정식을 구하시오.`, mq, b, {
        explain: `직선 ${given}의 기울기는 ${iq(Q(-u, v))}이므로 이에 수직인 직선의 기울기는 ${iq(mq)}이다. ${parH(k)}에서 ${is(Pv, p)}이므로 접선은 ${nb(`${Y} = ${iq(mq)}${X} + ${pn(p)} ÷ ${pn(mq)}`)}, 곧 ${yline(mq, b)}이다.`,
        facts: { calc: [[jn(v), 0], [String(u), 1], [`${jn(k)}/4*${u}/${jn(v)}`, 2]], derived: [4] } });
    }),

    // ②7 평행이동한 직선이 포물선에 접할 때 이동한 거리
    T('slope-shift', '평행이동한 직선이 접할 때 이동한 거리', '②7', (d) => {
      const m = nz(d, -3, 3), t = nz(d, -3, 3), kk = nz(d, -4, 4), p = m * t, k = 4 * p, c = t + m * kk;
      if (Math.abs(k) > 36 || c === 0) return null;
      return numA(`직선 ${jh(yline(m, c), '을/를')} x축의 방향으로 ${Kv}만큼 평행이동한 직선이 포물선 ${parH(k)}에 접할 때, 상수 ${Kv}의 값은?`, kk, {
        explain: `평행이동한 직선은 ${nb(`${Y} = ${iq(m)}(${X} ${MINUS} ${Kv}) ${c < 0 ? MINUS : '+'} ${Math.abs(c)}`)}이다. ${parH(k)}에 접하고 기울기가 ${iq(m)}인 직선은 ${yline(m, t)}이므로 ${nb(`${poly([[-m, Kv]])} ${c < 0 ? MINUS : '+'} ${Math.abs(c)} = ${iq(t)}`)}에서 ${is(Kv, kk)}이다.`,
        facts: { value: `(${jn(c)}-${jn(k)}/(4*${jn(m)}))/${jn(m)}`, derived: [4] } });
    }),

    // ②9 포물선 위의 점과 직선 사이의 거리의 최솟값(차례 1: 최솟값, 차례 2: 그때의 점)
    T('slope-mindist', '포물선 위의 점과 직선 사이의 거리의 최솟값', '②9', (d, n) => {
      const p = nz(d, -4, 4), m = d.pick([1, -1]), k = 4 * p, gap = d.pick([4, 6, 8, 10]) * (p * m > 0 ? 1 : -1), c = p * m + gap;
      // y = mx + c 와 y² = 4px 가 만나지 않는가: m y² − 4p y + 4pc = 0 의 판별식 < 0
      if (16 * p * p - 16 * p * c * m >= 0 || c === 0) return null;
      const L = yline(m, c), tan = yline(m, p * m), coef = Math.abs(gap) / 2, touch = [p, 2 * p * m];
      if (n === 0) {
        return radAns(`포물선 ${parH(k)} 위의 점과 직선 ${L} 사이의 거리의 최솟값은?`, coef, 2, {
          explain: `직선 ${jh(L, '과/와')} 기울기가 같은 접선 ${tan}의 접점이 직선에 가장 가깝다. 평행한 두 직선 사이의 거리는 접점 ${jh(cpt(touch[0], touch[1]), '과/와')} 직선 사이의 거리 ${nb(`${frac(`|${iq(gap)}|`, rt(2))} = ${radText(coef, 2)}`)}이다.`,
          facts: { calc: [[`${gap > 0 ? '' : '-'}(${jn(c)}-${jn(m)}*${jn(k)}/4)/2`, 0], ['2', 1]], derived: [2, 4] } });
      }
      return coordAns(`포물선 ${parH(k)} 위의 점 P와 직선 ${L} 사이의 거리가 최소가 되는 점 P의 좌표를 구하시오.`, touch, {
        explain: `점 P에서의 접선이 직선 ${jh(L, '과/와')} 평행할 때 거리가 가장 작다. 기울기가 ${iq(m)}인 접선은 ${tan}이고 ${jh(parH(k), '과/와')} 연립하면 접점은 ${cpt(touch[0], touch[1])}이다.`,
        facts: { calc: [[`${jn(k)}/4`, 0], [`2*${jn(k)}/4*${jn(m)}`, 1]], derived: [2, 4] } });
    }, { count: 2 })
  ];

  // ══ 마. 포물선 위의 점에서의 접선 ══
  const point = [
    // ②11 포물선 위의 점에서의 접선(차례 1: y² = 4px, 차례 2: x² = 4py)
    T('point-tan', '포물선 위의 점에서의 접선의 방정식', '②11', (d, n) => {
      if (n === 0) {
        const m = nz(d, -3, 3), j = nz(d, -3, 3), xx = j, yy = 2 * m * j, p = m * m * j, k = 4 * p, b = m * j;
        if (Math.abs(k) > 40) return null;
        return lineA(`포물선 ${parH(k)} 위의 점 ${cpt(xx, yy)}에서의 접선의 방정식을 구하시오.`, m, b, {
          explain: `${is(Pv, p)}이므로 접선은 ${nb(`${poly([[yy, Y]])} = 2 × ${pn(p)}(${poly([[1, X], [xx, '']])})`)}, 곧 ${yline(m, b)}이다.`,
          facts: { calc: [[`${jn(k)}/(2*${jn(yy)})`, 0], [`${jn(k)}*${jn(xx)}/(2*${jn(yy)})`, 1]], derived: [2] } });
      }
      const p = nz(d, -3, 3), m = nz(d, -3, 3), xx = 2 * p * m, yy = p * m * m, k = 4 * p;
      return lineA(`포물선 ${parV(k)} 위의 점 ${cpt(xx, yy)}에서의 접선의 방정식을 구하시오.`, m, -yy, {
        explain: `${is(Pv, p)}이므로 접선은 ${nb(`${poly([[xx, X]])} = 2 × ${pn(p)}(${poly([[1, Y], [yy, '']])})`)}, 곧 ${yline(m, -yy)}이다.`,
        facts: { calc: [[`2*${jn(xx)}/${jn(k)}`, 0], [`-(${jn(yy)})`, 1]], derived: [2] } });
    }, { count: 2 }),

    // ②12 접점의 한 좌표만 주고 접선의 기울기
    T('point-slope1', '접점의 한 좌표로 접선의 기울기 구하기', '②12', (d) => {
      const p = nz(d, -4, 4), k = 4 * p, divs = [];
      for (let t = 1; t <= Math.abs(2 * p); t += 1) if ((2 * p) % t === 0) divs.push(t, -t);
      const yy = d.pick(divs), s = (2 * p) / yy;
      return numA(`포물선 ${parH(k)} 위의 점 ${npt('A', Av, yy)}에서의 접선의 기울기는?`, s, {
        explain: `점 A가 포물선 위에 있으므로 ${nb(`${pn(yy)}${sup(2)} = ${iq(k)}${Av}`)}이다. ${is(Pv, p)}이므로 접선은 ${nb(`${poly([[yy, Y]])} = 2 × ${pn(p)}(${X} + ${Av})`)}이고 기울기는 ${Math.abs(yy) === 1 ? iq(s) : nb(`${frac(iq(2 * p), pn(yy))} = ${iq(s)}`)}이다.`,
        facts: { value: `${jn(k)}/(2*${jn(yy)})`, derived: [2] } });
    }),

    // ②13 접선에 평행·수직인 직선(차례 1: 접선에 평행하고 한 점을 지나는 직선, 차례 2: 접선에 수직이고 초점을 지나는 직선의 x절편)
    T('point-parperp', '접선에 평행하거나 수직인 직선', '②13', (d, n) => {
      if (n === 0) {
        const s = nz(d, -3, 3), j = d.int(1, 3), yy = 2 * s * j, xx = j, p = s * s * j, k = 4 * p;
        const x0 = nz(d, -5, 5), y0 = nz(d, -5, 5), b = y0 - s * x0;
        if (Math.abs(k) > 40 || b === s * j) return null;
        return vals(`포물선 ${parH(k)} 위의 점 ${cpt(xx, yy)}에서의 접선과 평행하고 점 ${jh(cpt(x0, y0), '을/를')} 지나는 직선의 방정식이 ${nb(`${Y} = ${Av}${X} + ${Bv}`)}일 때, 상수 ${Av}, ${Bv}의 값을 구하시오.`, [[Av, s], [Bv, b]], {
          explain: `점 ${cpt(xx, yy)}에서의 접선은 ${nb(`${poly([[yy, Y]])} = 2 × ${pn(p)}(${X} + ${xx})`)}, 곧 ${yline(s, s * j)}이다. 기울기가 ${iq(s)}이고 점 ${jh(cpt(x0, y0), '을/를')} 지나는 직선은 ${yline(s, b)}이므로 ${is(Av, s)}, ${is(Bv, b)}이다.`,
          facts: { calc: [[`${jn(k)}/(2*${jn(yy)})`, 0], [`${jn(y0)}-${jn(k)}/(2*${jn(yy)})*${jn(x0)}`, 1]], derived: [2] } });
      }
      const p = nz(d, -3, 3), m = nz(d, -3, 3), xx = 2 * p * m, yy = p * m * m, k = 4 * p, ans = p * m;
      return numA(`포물선 ${parV(k)} 위의 점 ${cpt(xx, yy)}에서의 접선에 수직이고 포물선의 초점을 지나는 직선의 x절편은?`, ans, {
        explain: `접선은 ${nb(`${poly([[xx, X]])} = 2 × ${pn(p)}(${poly([[1, Y], [yy, '']])})`)}, 곧 ${yline(m, -yy)}이다. 이에 수직인 직선의 기울기는 ${iq(Q(-1, m))}이고 초점은 ${cpt(0, p)}이므로 직선은 ${yline(Q(-1, m), p)}이다. ${is(Y, 0)}을 넣으면 x절편은 ${iq(ans)}이다.`,
        facts: { value: `${jn(xx)}/2`, derived: [2] } });
    }, { count: 2 }),

    // ②14 접선이 다른 포물선의 초점을 지날 때 상수(접선의 x절편이 −x₁)
    T('point-focus', '접선이 다른 포물선의 초점을 지날 때 상수', '②14', (d) => {
      const p1 = nz(d, -3, 3), xx = (p1 > 0 ? 1 : -1) * d.int(1, 8), [s, r] = sqParts(p1 * xx), sg = d.pick([1, -1]), k1 = 4 * p1;
      const yyH = (sg < 0 ? MINUS : '') + radText(2 * s, r).replace(new RegExp('^' + MINUS), '');
      const ans = -4 * xx;
      return numA(`포물선 ${parH(k1)} 위의 점 ${npt('P', xx, yyH)}에서의 접선이 포물선 ${nb(`${Y}${sup(2)} = ${Kv}${X}`)}의 초점을 지날 때, 상수 ${Kv}의 값은?`, ans, {
        explain: `점 P에서의 접선 ${nb(`${yyH}${Y} = 2 × ${pn(p1)}(${poly([[1, X], [xx, '']])})`)}에 ${is(Y, 0)}을 넣으면 ${is(X, -xx)}이므로 접선은 x축과 점 ${cpt(-xx, 0)}에서 만난다. 포물선 ${nb(`${Y}${sup(2)} = ${Kv}${X}`)}의 초점 ${cpt(frac(Kv, 4), 0)}이 이 점이므로 ${nb(`${frac(Kv, 4)} = ${iq(-xx)}`)}, ${is(Kv, ans)}이다.`,
        facts: { value: `-4*${jn(xx)}`, derived: [4] } });
    }),

    // ②15 초점까지의 거리로 접점을 찾아 접선(기울기가 분수)
    T('point-fromdist', '초점까지의 거리로 접점을 찾아 접선 구하기', '②15', (d) => {
      const p = d.int(1, 3), t = d.pick([2, 3, 4]), sg = d.pick([1, -1]), k = 4 * p, L = p * (t * t + 1), xx = p * t * t, yy = 2 * p * t * sg;
      if (L > 40) return null;
      return fracLineA(`포물선 ${parH(k)} 위의 점 P와 초점 F에 대하여 ${nb(`${SG('PF')} = ${L}`)}이다. 점 P가 제${sg > 0 ? 1 : 4}사분면 위에 있을 때, 점 P에서의 접선의 방정식을 구하시오.`, Q(sg, t), sg * p * t, {
        explain: `${SG('PF')}는 점 P에서 준선 ${eqx(-p)}까지의 거리와 같으므로 점 P의 x좌표는 ${nb(`${L} ${MINUS} ${p} = ${xx}`)}이고, ${nb(`${Y}${sup(2)} = ${k} × ${xx} = ${yy * yy}`)}에서 점 P는 ${cpt(xx, yy)}이다. 접선은 ${nb(`${poly([[yy, Y]])} = 2 × ${p}(${X} + ${xx})`)}, 곧 ${yline(Q(sg, t), sg * p * t)}이다.`,
        facts: { calc: [[sg > 0 ? '1' : '(-1)', 0], [String(t), 1], [String(sg * p * t), 2]], derived: [t, p * t] } });
    }),

    // ②16 두 점에서의 접선이 수직일 때 y₁y₂
    T('point-perp', '두 접선이 수직일 때 접점의 y좌표의 곱', '②16', (d) => {
      const c = d.pick([1, 3, 5, 7]), ans = Q(-c * c, 4);
      return numA(`포물선 ${parH(c)} 위의 서로 다른 두 점 ${nb(`(${x1}, ${y1})`)}, ${nb(`(${x2}, ${y2})`)}에서의 접선이 서로 수직일 때, ${nb(y1 + y2)}의 값은?`, ans, {
        explain: `${is(Pv, Q(c, 4))}이므로 점 ${nb(`(${x1}, ${y1})`)}에서의 접선은 ${nb(`${y1}${Y} = ${frac(c, 2)}(${X} + ${x1})`)}이고 기울기는 ${frac(c, '2' + y1)}이다. 두 접선의 기울기의 곱이 −1이므로 ${nb(`${frac(c * c, '4' + y1 + y2)} = ${MINUS}1`)}, ${nb(`${y1}${y2} = ${iq(ans)}`)}이다.`,
        facts: { value: `-${c}*${c}/4`, derived: [4] } });
    }),

    // ②17 접선과 x축의 교점 T의 x좌표와 선분 FT의 길이(설명 부분은 빼고 값만)
    T('point-T', '접선과 x축의 교점과 선분 FT의 길이', '②17', (d) => {
      const p = d.int(1, 4), k = 4 * p, xx = d.int(1, 9), [s, r] = sqParts(p * xx), sg = d.pick([1, -1]);
      const yyH = (sg < 0 ? MINUS : '') + radText(2 * s, r);
      return M(`포물선 ${parH(k)}의 초점을 F라 하자. 포물선 위의 점 ${npt('P', xx, yyH)}에서의 접선이 x축과 만나는 점을 T라 할 때, 점 T의 x좌표와 선분 FT의 길이를 차례로 구하시오.`,
        [{ lead: '점 T의 x좌표:', answer: -xx, signed: true }, { lead: `${SG('FT')}:`, answer: xx + p }], {
          shown: `점 T의 x좌표 ${iq(-xx)}, ${nb(`${SG('FT')} = ${xx + p}`)}`,
          explain: `접선 ${nb(`${yyH}${Y} = 2 × ${p}(${X} + ${xx})`)}에 ${is(Y, 0)}을 넣으면 ${is(X, -xx)}이므로 ${npt('T', -xx, 0)}이다. 초점은 ${npt('F', p, 0)}이므로 ${nb(`${SG('FT')} = ${p} + ${xx} = ${xx + p}`)}이고, 이것은 점 P에서 준선까지의 거리, 곧 ${jh(SG('FP'), '과/와')} 같다.`,
          facts: { calc: [[`-${jn(xx)}`, 0], [`${jn(xx)}+${k}/4`, 1]], derived: [4] } });
    })
  ];

  // ══ 바. 포물선 밖의 점에서 그은 접선 ══
  // 기울기가 m₁, m₂(정수)인 두 접선이 지나는 점: 점 (k, k(m₁ + m₂)), 포물선 y² = 4px 에서 p = k m₁ m₂. 두 접선은 y = m₁x + k m₂, y = m₂x + k m₁.
  const outerOf = (d) => {
    const m1 = nz(d, -3, 3), m2 = d.until(() => nz(d, -3, 3), (t) => t !== m1), kk = nz(d, -3, 3), p = kk * m1 * m2;
    // m₁ + m₂ = 0 이면 두 접선의 부호를 모두 바꾼 답도 같은 두 직선이 되어 채점이 부호를 가리지 못한다.
    if (Math.abs(p) > 9 || m1 + m2 === 0) return null;
    return { m1, m2, kk, p, x0: kk, y0: kk * (m1 + m2), k: 4 * p };
  };
  const outer = [
    // ②20 밖의 점에서 그은 접선의 방정식(둘)
    T('outer-tan', '포물선 밖의 점에서 그은 접선의 방정식', '②20', (d) => {
      const o = outerOf(d);
      if (!o) return null;
      const { m1, m2, kk, p, x0, y0, k } = o;
      return inline(`점 ${cpt(x0, y0)}에서 포물선 ${parH(k)}에 그은 접선의 방정식을 모두 구하시오.`,
        `${Y} = {0}${X} {1}, ${Y} = {2}${X} {3}`, [{ answer: m1, signed: true }, { answer: kk * m2, signed: true }, { answer: m2, signed: true }, { answer: kk * m1, signed: true }], {
          blocks: [[0, 1], [2, 3]], shown: `${yline(m1, kk * m2)}, ${yline(m2, kk * m1)}`,
          explain: `${is(Pv, p)}이므로 기울기가 ${Mv}인 접선은 ${nb(`${Y} = ${Mv}${X} + ${frac(pn(p), Mv)}`)}이다. 점 ${jh(cpt(x0, y0), '을/를')} 지나므로 ${nb(`${iq(y0)} = ${poly([[x0, Mv]])} + ${frac(pn(p), Mv)}`)}, 곧 ${nb(`${poly([[x0, Mv + sup(2)], [-y0, Mv], [p, '']])} = 0`)}에서 ${is(Mv, m1)} 또는 ${is(Mv, m2)}이다. 접선은 ${jh(yline(m1, kk * m2), '과/와')} ${yline(m2, kk * m1)}이다.`,
          facts: { calc: [[jn(m1), 0], [`${jn(k)}/4/${jn(m1)}`, 1], [jn(m2), 2], [`${jn(k)}/4/${jn(m2)}`, 3]], derived: [4, Math.abs(m1), Math.abs(m2)] } });
    }),

    // ②21 밖의 점에서 그은 두 접선의 기울기의 곱(점은 준선 밖 — 답이 늘 −1이 되지 않게)
    T('outer-prod', '포물선 밖의 점에서 그은 두 접선의 기울기의 곱', '②21', (d) => {
      const x0 = nz(d, -4, 4), q = d.until(() => nz(d, -4, 4), (t) => t !== -1), p = q * x0, k = 4 * p;
      if (Math.abs(p) > 9) return null;
      const y0 = q < 0 ? d.int(-5, 5) : d.pick([1, -1]) * d.int(Math.floor(2 * Math.sqrt(q) * Math.abs(x0)) + 1, Math.floor(2 * Math.sqrt(q) * Math.abs(x0)) + 3);
      if (y0 * y0 - 4 * x0 * p <= 0) return null;
      return numA(`점 ${cpt(x0, y0)}에서 포물선 ${parH(k)}에 그은 두 접선의 기울기의 곱은?`, q, {
        explain: `${is(Pv, p)}이므로 기울기가 ${Mv}인 접선은 ${nb(`${Y} = ${Mv}${X} + ${frac(pn(p), Mv)}`)}이다. 점 ${jh(cpt(x0, y0), '을/를')} 지나므로 ${nb(`${poly([[x0, Mv + sup(2)], [-y0, Mv], [p, '']])} = 0`)}이고, 두 근의 곱은 ${nb(`${frac(pn(p), pn(x0))} = ${iq(q)}`)}이다.`,
        facts: { value: `${jn(k)}/4/${jn(x0)}`, derived: [4] } });
    }),

    // ②22 두 접선이 수직이 되는 점(준선 위의 점) — 값을 묻는 부분
    T('outer-perp', '두 접선이 수직이 되는 점', '②22', (d) => {
      const p = nz(d, -4, 4), k = 4 * p, y0 = d.int(-5, 5);
      return numA(`점 ${cpt(Av, y0)}에서 포물선 ${parH(k)}에 그은 두 접선이 서로 수직일 때, 상수 ${Av}의 값은?`, -p, {
        explain: `기울기가 ${Mv}인 접선 ${jh(nb(`${Y} = ${Mv}${X} + ${frac(pn(p), Mv)}`), '이/가')} 점 ${jh(cpt(Av, y0), '을/를')} 지나므로 ${nb(`${Av}${Mv}${sup(2)}${y0 === 0 ? '' : ` ${y0 > 0 ? MINUS : '+'} ${Math.abs(y0) === 1 ? '' : Math.abs(y0)}${Mv}`} ${p > 0 ? '+' : MINUS} ${Math.abs(p)} = 0`)}이다. 두 접선이 수직이면 두 근의 곱이 −1이므로 ${nb(`${frac(pn(p), Av)} = ${MINUS}1`)}, ${is(Av, -p)}이다. 이 점은 준선 ${eqx(-p)} 위에 있다.`,
        facts: { value: `-${jn(k)}/4`, derived: [4] } });
    }),

    // ②23 두 접선과 y축의 교점 — 삼각형의 넓이(답이 분수)
    T('outer-areay', '두 접선과 y축이 만든 삼각형의 넓이', '②23', (d) => {
      const o = outerOf(d);
      if (!o) return null;
      const { m1, m2, kk, p, x0, y0, k } = o, gap = Math.abs(m1 - m2), area = Q(kk * kk * gap, 2);
      if (area.q === 1) return null;
      return posA(`점 ${npt('P', x0, y0)}에서 포물선 ${parH(k)}에 그은 두 접선이 y축과 만나는 점을 각각 A, B라 할 때, 삼각형 PAB의 넓이는?`, area, {
        explain: `두 접선은 ${jh(yline(m1, kk * m2), '과/와')} ${yline(m2, kk * m1)}이므로 y절편은 ${iq(kk * m2)}, ${iq(kk * m1)}이고 ${nb(`${SG('AB')} = ${kk * kk * gap / Math.abs(kk)}`)}이다. 점 P와 y축 사이의 거리는 ${iq(Math.abs(x0))}이므로 넓이는 ${nb(`${frac(1, 2)} × ${Math.abs(kk) * gap} × ${Math.abs(x0)} = ${iq(area)}`)}이다.`,
        facts: { value: `${Math.abs(x0)}*${Math.abs(x0)}*${gap}/2`, derived: [gap, 2] } });
    })
  ];

  // ══ 사. 접선과 도형 ══
  const figure = [
    // ②25 접선이 x축과 만나는 점과 초점 — 삼각형의 넓이(차례 1: x² = 4py 그림, 차례 2: y² = 4px)
    T('fig-xaxis', '접선이 x축과 만나는 점과 초점으로 삼각형의 넓이', '②25', (d, n) => {
      if (n === 0) {
        const p = d.int(1, 3), t = d.pick([1, 2, -1, -2]), xx = 2 * p * t, yy = p * t * t, k = 4 * p, area = p * p * Math.abs(t) * (1 + t * t) / 2;
        if (!Number.isInteger(area)) return null;
        const lo = Math.min(-1.5, xx - 1.5), hi = Math.max(1.5, xx + 1.5), top = Math.max(yy, p) + 1.2;
        const fig = plot({ x: [lo, hi], y: [-0.8, top], w: 250, curves: [vpar(k, 0, 0, lo, hi)],
          lines: [{ p: [xx, yy], q: [xx / 2, 0], color: '#1f2933' }],
          segs: [{ p: [0, p], q: [xx, yy], color: RED }, { p: [0, p], q: [xx / 2, 0], color: RED }],
          dots: [{ x: 0, y: p, name: 'F', side: t > 0 ? 'ul' : 'ur' }, { x: xx, y: yy, name: `P(${xx}, ${yy})` }, { x: xx / 2, y: 0, name: 'Q', side: t > 0 ? 'dr' : 'dl' }],
          say: `점 Q는 점 P에서의 접선이 x축과 만나는 점이다.` });
        return posA(`그림과 같이 포물선 ${parV(k)}의 초점을 F라 하고, 포물선 위의 점 ${npt('P', xx, yy)}에서의 접선이 x축과 만나는 점을 Q라 할 때, 삼각형 PFQ의 넓이는?`, area, {
          figure: fig, explain: `초점은 ${npt('F', 0, p)}, 접선은 ${nb(`${poly([[xx, X]])} = 2 × ${p}(${Y} + ${yy})`)}이므로 ${npt('Q', xx / 2, 0)}이다. 세 꼭짓점의 좌표로 넓이를 구하면 ${area}이다.`,
          facts: { value: `${Math.abs(xx)}*(${k}/4+${yy})/4`, derived: [4] } });
      }
      const p = nz(d, -3, 3), t = nz(d, -2, 2), xx = p * t * t, yy = 2 * p * t, k = 4 * p, area = Math.abs(p + xx) * Math.abs(yy) / 2;
      return posA(`포물선 ${parH(k)}의 초점을 F라 하고, 포물선 위의 점 ${npt('P', xx, yy)}에서의 접선이 x축과 만나는 점을 Q라 할 때, 삼각형 PQF의 넓이는?`, area, {
        explain: `초점은 ${npt('F', p, 0)}이고 접선 ${nb(`${poly([[yy, Y]])} = 2 × ${pn(p)}(${poly([[1, X], [xx, '']])})`)}에 ${is(Y, 0)}을 넣으면 ${npt('Q', -xx, 0)}이다. ${nb(`${SG('FQ')} = ${Math.abs(p + xx)}`)}이고 높이는 ${Math.abs(yy)}이므로 넓이는 ${nb(`${frac(1, 2)} × ${Math.abs(p + xx)} × ${Math.abs(yy)} = ${area}`)}이다.`,
        facts: { value: `(${Math.abs(k)}/4+${Math.abs(xx)})*${Math.abs(yy)}/2`, derived: [4, 2] } });
    }, { count: 2 }),

    // ②26 미지수가 든 포물선, 초점까지 거리가 주어질 때 — 삼각형 ABF의 넓이
    T('fig-unknown', '초점까지의 거리와 접선으로 삼각형의 넓이', '②26', (d) => {
      const L = d.int(5, 14), h = d.int(2, L - 1) * d.pick([1, -1]);
      if ((L * Math.abs(h)) % 2 !== 0) return null;
      const area = L * Math.abs(h) / 2;
      return posA(`포물선 ${nb(`${Y}${sup(2)} = 4${Pv}${X}`)} ${nb(`(${Pv} &gt; 0)`)}의 초점을 F라 하자. 포물선 위의 점 ${npt('A', Av, h)}에 대하여 ${nb(`${SG('FA')} = ${L}`)}이고, 점 A에서의 접선이 x축과 만나는 점을 B라 할 때, 삼각형 ABF의 넓이는? ${nb(`(단, ${Av}는 상수이다.)`)}`, area, {
        explain: `포물선의 정의에서 ${nb(`${Av} + ${Pv} = ${L}`)}이다. 점 A에서의 접선 ${nb(`${poly([[h, Y]])} = 2${Pv}(${X} + ${Av})`)}에 ${is(Y, 0)}을 넣으면 ${npt('B', MINUS + Av, 0)}이므로 ${nb(`${SG('BF')} = ${Pv} + ${Av} = ${L}`)}이다. 넓이는 ${nb(`${frac(1, 2)} × ${L} × ${Math.abs(h)} = ${area}`)}이다(${Av}, ${jh(Pv, '을/를')} 따로 구하지 않아도 된다).`,
        facts: { value: `${L}*${Math.abs(h)}/2`, derived: [2] } });
    }),

    // ②27 접선·준선·x축 — 삼각형의 넓이(답이 분수)
    T('fig-dir', '접선과 준선과 x축이 만든 삼각형의 넓이', '②27', (d) => {
      const p = d.int(1, 3), t = d.pick([2, 3, -2, -3]), xx = p * t * t, yy = 2 * p * t, k = 4 * p;
      const area = Q(p * (xx - p) * (xx - p), Math.abs(yy)), yB = Q(2 * p * (xx - p), yy);
      if (area.q === 1) return null;
      return posA(`포물선 ${parH(k)} 위의 점 ${npt('A', xx, yy)}에서의 접선을 l이라 하자. 직선 l과 포물선의 준선이 만나는 점을 B, 직선 l과 x축이 만나는 점을 C, 포물선의 준선과 x축이 만나는 점을 D라 할 때, 삼각형 BCD의 넓이는?`, area, {
        explain: `준선은 ${eqx(-p)}이고 접선 l은 ${nb(`${poly([[yy, Y]])} = 2 × ${p}(${X} + ${xx})`)}이다. ${npt('B', -p, yB)}, ${npt('C', -xx, 0)}, ${npt('D', -p, 0)}이므로 넓이는 ${nb(`${frac(1, 2)} × ${xx - p} × ${iq(Q(Math.abs(yB.p), yB.q))} = ${iq(area)}`)}이다.`,
        facts: { value: `(${k}/4)*(${xx}-${k}/4)*(${xx}-${k}/4)/${Math.abs(yy)}`, derived: [4] } });
    })
  ];

  B.addTypes('11-4-1', 'slope', slope);
  B.addTypes('11-4-1', 'point', point);
  B.addTypes('11-4-1', 'outer', outer);
  B.addTypes('11-4-1', 'figure', figure);
})(typeof window !== 'undefined' ? window : globalThis);
