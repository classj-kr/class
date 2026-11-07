// 고등학교 대수 Ⅰ-2 지수함수와 로그함수 — 뒤쪽 묶음(로그함수의 뜻과 그래프, 그래프의 이동, 대소 관계와 최대·최소, 로그방정식과 로그부등식,
// 지수함수와 로그함수의 그래프와 도형, 실생활 활용). 틀·도구·싣는 기준·뺀 것은 11-1-2a.js 머리에 있다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, N, C, D, inline } = B.kit;
  const { MINUS, Q, asQ, nb, V, sup, nz, pm, poly, rt, radAns, SG } = B.kit.mid;
  const { lg, sfrac, rtn, qAns, coordAns } = B.kit.hs;
  const { S6, S7, S8, stripH, T, X, Y, Av, Bv, Cv, Kv, Mv, Nv, Pv, Qv, Tv, al, be, REL, FLIP, iq, jn, sTxt, is, yIs, fx, fAt, pt, jj, L, sgnT, plusC,
    E, LG, shiftWords, setX, setY, frx, vals, num, ray, betw, choose, GA, comboPick, orderPick, gfig, pick2, fv } = B.kit.u112;

  const arg = (p) => (p === 0 ? X : `(${L(1, -p)})`);                         // x − p (로그의 진수)
  const lgx = (b, p) => LG(b, arg(p));                                          // log_b (x − p)
  const sq = (h) => `(${h})${sup(2)}`;
  const mm = (lo, hi, o) => inline(o.text, '최댓값: {0}, 최솟값: {1}', [{ answer: hi, signed: true }, { answer: lo, signed: true }],
    Object.assign({}, o, { shown: `최댓값: ${iq(hi)}, 최솟값: ${iq(lo)}` }));
  const ln = (b) => (x) => Math.log(x) / Math.log(fv(b));

  // ════════════════════════════════════════════════════════════════
  // 로그함수의 뜻과 그래프
  // ════════════════════════════════════════════════════════════════
  const logg = [
    T('logg-inverse', '지수함수의 역함수 구하기', '②1', (d, n) => {
      if (n === 1) {
        const b = d.pick([2, 3, 5]), s = d.int(1, b === 2 ? 4 : 2);
        return coordAns(`함수 ${yIs(E(b, X))}의 그래프 위의 점 ${jj(pt(s, b ** s), '을/를')} 직선 ${yIs(X)}에 대하여 대칭이동한 점은 함수 ${yIs(LG(b, X))}의 그래프 위에 있다. 대칭이동한 점의 좌표를 구하시오.`, [b ** s, s], {
          explain: `직선 ${yIs(X)}에 대하여 대칭이동하면 ${X}좌표와 ${Y}좌표가 바뀌므로 ${pt(b ** s, s)}이다. 실제로 ${is(LG(b, b ** s), s)}이다.`,
          facts: { calc: [[`${b ** s}`, 0], [`${s}`, 1]] } });
      }
      const b = d.pick([2, 3, 5, Q(1, 2), Q(1, 3)]), inv = asQ(b).q === 1 ? Q(1, asQ(b).p) : asQ(b).q;
      const right = yIs(LG(b, X)), wrongs = [yIs(lg(X, frx(b))), yIs(E(inv, X)), yIs(LG(inv, X)), yIs(MINUS + LG(b, X)), yIs(E(b, MINUS + X))];
      return choose(d, `지수함수 ${yIs(E(b, X))}의 역함수는?`, right, wrongs, {
        explain: `${yIs(E(b, X))}에서 로그의 정의에 의하여 ${is(X, LG(b, Y))}이다. ${X}와 ${jj(Y, '을/를')} 서로 바꾸면 역함수는 ${right}(${X} &gt; 0)이다.`, facts: { rule: 'logg-inverse' } });
    }, { count: 2, standard: S6 }),
    T('logg-claims', '로그함수의 성질 참·거짓', '②3', (d, n) => {
      if (n === 0) {
        const b = d.pick([2, 3, 5, Q(1, 2), Q(1, 3)]), up = fv(b) > 1;
        const pool = [
          [`정의역은 ${setX(`${X} &gt; 0`)}이다.`, true], ['치역은 실수 전체의 집합이다.', true], [`치역은 ${setY(`${Y} &gt; 0`)}이다.`, false],
          [`그래프는 점 ${jj(pt(1, 0), '을/를')} 지난다.`, true], [`그래프는 점 ${jj(pt(0, 1), '을/를')} 지난다.`, false], [`그래프는 점 ${jj(pt(b, 1), '을/를')} 지난다.`, true],
          [`그래프의 점근선은 ${Y}축이다.`, true], [`그래프의 점근선은 ${X}축이다.`, false],
          [`${X}의 값이 증가하면 ${Y}의 값도 증가한다.`, up], [`${X}의 값이 증가하면 ${Y}의 값은 감소한다.`, !up]
        ];
        const three = d.shuffle(pool).slice(0, 3);
        return comboPick(d, `로그함수 ${yIs(LG(b, X))}에 대한 설명으로 옳은 것만을 있는 대로 고른 것은?`, three.map((r) => r[0]), three.map((r) => r[1]),
          `${yIs(LG(b, X))}의 정의역은 양의 실수 전체, 치역은 실수 전체이고, 그래프는 점 ${jj(pt(1, 0), '을/를')} 지나며 ${Y}축을 점근선으로 갖는다. 밑이 1보다 ${up ? '크므로 증가' : '작으므로 감소'}한다.`);
      }
      const b = d.pick([2, 3, 5, 7]), f = fx(), s = V('s'), t = V('t'), x1 = nb(`${X}${B.kit.hs.sub(1)}`), x2 = nb(`${X}${B.kit.hs.sub(2)}`);
      const trues = [
        `정의역은 ${setX(`${X} &gt; 0`)}이다.`,
        `두 양수 ${s}, ${t}에 대하여 ${is(`${fAt(s)} + ${fAt(t)}`, fAt(`${s}${t}`))}이다.`,
        `0 &lt; ${x1} &lt; ${x2}이면 ${fAt(x1)} &lt; ${fAt(x2)}이다.`,
        `함수 ${is(Y, f)}의 그래프는 함수 ${yIs(LG(Q(1, b), X))}의 그래프와 ${X}축에 대하여 대칭이다.`,
        `함수 ${is(Y, f)}의 그래프는 함수 ${yIs(E(b, X))}의 그래프와 직선 ${yIs(X)}에 대하여 대칭이다.`,
        `함수 ${is(Y, f)}의 그래프는 점 ${jj(pt(b, 1), '을/를')} 지난다.`
      ];
      const falses = [
        [`함수 ${is(Y, f)}의 그래프의 점근선은 직선 ${yIs(0)}이다.`, `점근선은 직선 ${is(X, 0)}(${Y}축)이다`],
        [`두 양수 ${s}, ${t}에 대하여 ${is(fAt(`${s}${t}`), `${fAt(s)} × ${fAt(t)}`)}이다.`, `${is(fAt(`${s}${t}`), `${fAt(s)} + ${fAt(t)}`)}이다`],
        [`함수 ${is(Y, f)}의 그래프는 함수 ${yIs(LG(Q(1, b), X))}의 그래프와 ${Y}축에 대하여 대칭이다.`, `${LG(Q(1, b), X)} = ${MINUS}${LG(b, X)}이므로 ${X}축에 대하여 대칭이다`],
        [`치역은 ${setY(`${Y} &gt; 0`)}이다.`, '치역은 실수 전체의 집합이다']
      ];
      const [wrong, why] = d.pick(falses);
      return choose(d, `함수 ${is(f, LG(b, X))}에 대한 설명으로 옳지 않은 것은?`, wrong, d.shuffle(trues).slice(0, 4), {
        explain: `${why}. 나머지는 모두 옳다.`, facts: { rule: 'logg-claims-wrong' } });
    }, { count: 2 }),
    T('logg-point', '로그함수의 그래프 위의 점의 좌표', '②4', (d) => {
      const b = d.pick([2, 3]), [i, j] = pick2(d, b === 2 ? [1, 2, 3, 4] : [1, 2]);
      const xs = [b ** i, b ** j], xm = Math.max(...xs) + 1.6, ym = Math.max(i, j) + 1.3;
      const figure = gfig({ x: [-0.6, xm], y: [-1.8, ym], h: 190, curves: [{ f: ln(b), from: 0.02, name: `y=log_${b} x` }],
        dots: [{ x: b ** i, y: i, guide: true, xl: String(b ** i), yl: 'a' }, { x: b ** j, y: j, guide: true, xl: 'b', yl: String(j) }] });
      return vals(`그림과 같이 함수 ${yIs(LG(b, X))}의 그래프가 두 점 ${pt(b ** i, Av)}, ${jj(pt(Bv, j), '을/를')} 지날 때, 실수 ${Av}, ${Bv}의 값을 구하시오.`, [[Av, i], [Bv, b ** j, true]], {
        figure, explain: `${is(Av, LG(b, b ** i))} = ${i}이고, ${is(j, LG(b, Bv))}에서 ${is(Bv, E(b, j))} = ${b ** j}이다.`,
        facts: { calc: [[`${i}`, 0], [`${b}**${j}`, 1]], derived: [i] } });
    }),
    T('logg-three', '로그함수의 그래프 위 세 점의 좌표 사이의 관계', '②5', (d) => {
      const r = d.pick([2, 3, Q(1, 2), Q(1, 3)]), kind = d.pick(['bac', 'cab', 'abc1', 'ca2b']);
      const yc = { bac: `${MINUS}${Pv} ${MINUS} ${Qv}`, cab: `${Pv} ${MINUS} ${Qv}`, abc1: `${Qv} ${MINUS} ${Pv}`, ca2b: `2${Pv} ${MINUS} ${Qv}` }[kind];
      const rel = { bac: is(Bv, `${Av}${Cv}`), cab: is(Cv, `${Av}${Bv}`), abc1: is(`${Av}${Bv}${Cv}`, 1), ca2b: is(Cv, `${Av}${sup(2)}${Bv}`) };
      const why = { bac: `${yc} = ${MINUS}${LG(r, Av)} + ${LG(r, Bv)} = ${LG(r, frac(Bv, Av))}이므로 ${is(Cv, frac(Bv, Av))}`, cab: `${yc} = ${LG(r, Av)} + ${LG(r, Bv)} = ${LG(r, `${Av}${Bv}`)}이므로 ${is(Cv, `${Av}${Bv}`)}`, abc1: `${yc} = ${MINUS}${LG(r, Bv)} ${MINUS} ${LG(r, Av)} = ${LG(r, frac(1, `${Av}${Bv}`))}이므로 ${is(Cv, frac(1, `${Av}${Bv}`))}`, ca2b: `${yc} = 2${LG(r, Av)} + ${LG(r, Bv)} = ${LG(r, `${Av}${sup(2)}${Bv}`)}이므로 ${is(Cv, `${Av}${sup(2)}${Bv}`)}` }[kind];
      return choose(d, `함수 ${yIs(LG(r, X))}의 그래프 위에 서로 다른 세 점 ${nb(`A(${Av}, ${Pv})`)}, ${nb(`B(${Bv}, ${MINUS}${Qv})`)}, ${nb(`C(${Cv}, ${yc})`)}가 있을 때, ${Av}, ${Bv}, ${Cv} 사이의 관계식으로 옳은 것은?`, rel[kind],
        [rel.bac, rel.cab, rel.abc1, rel.ca2b, is(Av, `${Bv}${Cv}`), is(`${Bv}${sup(2)}`, `${Av}${Cv}`)], {
          explain: `세 점이 그래프 위에 있으므로 ${is(Pv, LG(r, Av))}, ${is(`${MINUS}${Qv}`, LG(r, Bv))}이다. ${why}, 곧 ${rel[kind]}이다.`, facts: { rule: 'logg-three-' + kind } });
    }),
    T('logg-order', '밑의 크기와 로그함수의 그래프', '②6', (d) => {
      const bases = d.shuffle([Q(1, 4), Q(1, 2), Q(1, 3), 2, 3, 4]).slice(0, 3), vs = bases.map(fv), nm = ['a', 'b', 'c'];
      const figure = gfig({ x: [-0.4, 4.6], y: [-2.4, 2.4], h: 190, curves: vs.map((v, i) => ({ f: (x) => Math.log(x) / Math.log(v), from: 0.02, name: `y=log_${nm[i]} x` })), xt: [1], yt: [1, -1] });
      return orderPick(d, `그림은 세 로그함수 ${yIs(lg(Av, X))}, ${yIs(lg(Bv, X))}, ${yIs(lg(Cv, X))}의 그래프이다. 세 수 ${Av}, ${Bv}, ${Cv}의 대소 관계로 옳은 것은?`, [Av, Bv, Cv], vs, {
        figure, explain: `직선 ${is(Y, 1)}과 만나는 점의 ${X}좌표가 밑이다. 증가하는 그래프는 밑이 1보다 크고, 감소하는 그래프는 밑이 1보다 작다. 밑이 1보다 클 때는 ${X} &gt; 1에서 ${X}축에 가까운 그래프일수록 밑이 크다.`, facts: { rule: 'logg-order' } });
    }),
    T('logg-dec', '밑에 미지수가 있는 로그함수가 감소할 조건', '②7', (d) => {
      const p = d.pick([3, 5]), q = d.int(-4, 4);
      if (q % p === 0 || (1 - q) % p === 0) return null;
      const lo = Q(-q, p), hi = Q(1 - q, p);
      return inline(`함수 ${yIs(lg(`(${L(p, q, Av)})`, X))}가 ${X}의 값이 증가할 때 ${Y}의 값은 감소하도록 하는 실수 ${Av}의 값의 범위를 구하시오.`, `${frac('{0}', '{1}')} &lt; ${Av} &lt; ${frac('{2}', '{3}')}`,
        [{ answer: lo.p, signed: true }, { answer: lo.q }, { answer: hi.p, signed: true }, { answer: hi.q }], {
          shown: nb(`${iq(lo)} &lt; ${Av} &lt; ${iq(hi)}`),
          explain: `${Y}의 값이 감소하려면 밑이 0보다 크고 1보다 작아야 하므로 0 &lt; ${L(p, q, Av)} &lt; 1이다. 풀면 ${iq(lo)} &lt; ${Av} &lt; ${iq(hi)}이다.`,
          facts: { calc: [[`0-(${jn(q)})`, 0], [`${p}`, 1], [`1-(${jn(q)})`, 2], [`${p}`, 3]] } });
    }, { standard: S6 })
  ];

  // ════════════════════════════════════════════════════════════════
  // 로그함수의 그래프의 이동
  // ════════════════════════════════════════════════════════════════
  const logs = [
    T('logs-asym', '평행이동한 로그함수의 정의역·점근선·이동량', '②8', (d, n) => {
      const b = d.pick([2, 3, Q(1, 2), Q(1, 3)]), p = nz(d, -4, 4), q = d.int(-4, 4), f = yIs(plusC(lgx(b, p), q));
      const why = `${f}의 그래프는 ${yIs(LG(b, X))}의 그래프를 ${shiftWords(p, q)} 평행이동한 것이다.`;
      if (n === 0) return inline(`함수 ${f}의 그래프의 점근선의 방정식을 구하시오.`, `${X} = {0}`, [{ answer: p, signed: true }], {
        shown: is(X, p), explain: `${why} ${yIs(LG(b, X))}의 점근선이 ${Y}축(${is(X, 0)})이므로 점근선은 직선 ${is(X, p)}이다.`, facts: { calc: [[jn(p), 0]], rule: 'logs-asym' } });
      if (n === 1) return inline(`함수 ${f}의 정의역을 구하시오.`, `{${X} | ${X} &gt; {0}}`, [{ answer: p, signed: true }], {
        shown: setX(`${X} &gt; ${iq(p)}`), explain: `진수는 양수이어야 하므로 ${L(1, -p)} &gt; 0, ${X} &gt; ${iq(p)}이다.`, facts: { calc: [[jn(p), 0]], rule: 'logs-domain' } });
      if (q === 0) return null;
      return vals(`함수 ${f}의 그래프는 함수 ${yIs(LG(b, X))}의 그래프를 ${X}축의 방향으로 ${Mv}만큼, ${Y}축의 방향으로 ${Nv}만큼 평행이동한 것이다. 상수 ${Mv}, ${Nv}의 값을 구하시오.`, [[Mv, p], [Nv, q]], {
        explain: `${jj(X, '을/를')} ${jj(`${X} ${MINUS} ${Mv}`, '으로/로')}, ${jj(Y, '을/를')} ${jj(`${Y} ${MINUS} ${Nv}`, '으로/로')} 바꾸면 ${yIs(`${LG(b, `(${X} − ${Mv})`)} + ${Nv}`)}이다. 비교하면 ${is(Mv, p)}, ${is(Nv, q)}이다.`,
        facts: { calc: [[jn(p), 0], [jn(q), 1]], rule: 'logs-shift' } });
    }, { count: 3 }),
    T('logs-const', '점근선·지나는 점으로 로그함수의 상수', '②9', (d) => {
      const b = d.pick([2, 3, 4]), a0 = nz(d, -4, 4), e = d.int(0, 2), c0 = nz(d, -4, 4), x1 = -a0 + b ** e, y1 = e + c0;
      if (b ** e > 9) return null;
      return vals(`함수 ${yIs(`${LG(b, `(${X} + ${Av})`)} + ${Cv}`)}의 그래프의 점근선이 직선 ${is(X, -a0)}이고, 그래프가 점 ${jj(pt(x1, y1), '을/를')} 지날 때, 상수 ${Av}, ${Cv}의 값을 구하시오.`, [[Av, a0], [Cv, c0]], {
        explain: `점근선은 직선 ${is(X, `${MINUS}${Av}`)}이므로 ${is(Av, a0)}이다. 점 ${jj(pt(x1, y1), '을/를')} 넣으면 ${is(iq(y1), `${LG(b, x1 + a0)} + ${Cv}`)} = ${e} + ${Cv}이므로 ${is(Cv, c0)}이다.`,
        facts: { calc: [[`0-(${jn(-a0)})`, 0], [`${jn(y1)}-${e}`, 1]], derived: [e] } });
    }),
    T('logs-mult', '진수의 곱을 y축 방향 이동으로', '②10', (d, n) => {
      const b = d.pick([2, 3]), e = d.int(1, 2), m = b ** e;
      if (n === 0) {
        const s = d.int(1, 3), k = m * s;
        return vals(`함수 ${yIs(LG(b, `(${m}${X} + ${Kv})`))}의 그래프는 함수 ${yIs(LG(b, X))}의 그래프를 ${X}축의 방향으로 ${MINUS}${s}만큼, ${Y}축의 방향으로 ${Nv}만큼 평행이동한 것이다. 상수 ${Kv}, ${Nv}의 값을 구하시오.`, [[Kv, k], [Nv, e]], {
          explain: `${LG(b, `(${m}${X} + ${Kv})`)} = ${LG(b, `${m}(${X} + ${frac(Kv, m)})`)} = ${LG(b, `(${X} + ${frac(Kv, m)})`)} + ${e}이다. ${is(frac(Kv, m), s)}에서 ${is(Kv, k)}이고 ${is(Nv, e)}이다.`,
          facts: { calc: [[`${m}*${s}`, 0], [`${e}`, 1]], derived: [e] } });
      }
      const c = d.int(1, 4);
      return num(`함수 ${yIs(LG(b, `${m}${X}`))}의 그래프는 함수 ${yIs(`${LG(b, X)} ${MINUS} ${c}`)}의 그래프를 ${Y}축의 방향으로 ${Mv}만큼 평행이동한 것이다. 상수 ${Mv}의 값은?`, e + c, {
        explain: `${LG(b, `${m}${X}`)} = ${LG(b, X)} + ${LG(b, m)} = ${LG(b, X)} + ${e}이다. ${LG(b, X)} ${MINUS} ${String(c)}에서 ${Y}축의 방향으로 ${e} + ${c} = ${e + c}만큼 옮긴 것이다.`.replace(`${String(c)}에서`, `${c}에서`),
        facts: { calc: [[`${e}+${c}`, 0]], derived: [e] } });
    }, { count: 2 }),
    T('logs-inv-shift', '지수함수의 그래프를 직선 y = x에 대칭한 뒤 평행이동', '②11', (d) => {
      const b = d.pick([2, 3, 5]), m = nz(d, -3, 3), c = nz(d, -4, 4);
      return vals(`함수 ${yIs(E(b, X))}의 그래프를 직선 ${yIs(X)}에 대하여 대칭이동한 후 ${X}축의 방향으로 ${iq(m)}만큼, ${Y}축의 방향으로 ${Pv}만큼 평행이동하였더니 함수 ${yIs(plusC(lg(Av, arg(m)), c))}의 그래프와 일치하였다. 상수 ${Av}, ${Pv}의 값을 구하시오.`, [[Av, b, true], [Pv, c]], {
        explain: `직선 ${yIs(X)}에 대하여 대칭이동하면 ${yIs(LG(b, X))}, 평행이동하면 ${yIs(`${lgx(b, m)} + ${Pv}`)}이다. 비교하면 ${is(Av, b)}, ${is(Pv, c)}이다.`,
        facts: { calc: [[`${b}`, 0], [jn(c), 1]] } });
    })
  ];

  // ════════════════════════════════════════════════════════════════
  // 로그함수의 대소 관계와 최대·최소
  // ════════════════════════════════════════════════════════════════
  const notPow = (b, c) => { let v = c; while (v % b === 0) v /= b; return v !== 1; };
  function logForm(d, b) {
    const kind = d.int(0, 5), c = d.int(2, 12);
    if (kind !== 3 && !notPow(b, c)) return null;
    if (kind === 0) return { h: LG(b, c), v: Math.log(c) / Math.log(b), why: LG(b, c) };
    if (kind === 1) { if (c > 6) return null; return { h: LG(b * b, c * c), v: Math.log(c) / Math.log(b), why: LG(b, c) }; }
    if (kind === 2) { const k = d.int(2, 3); if (c ** k > 200) return null; return { h: `${k}${LG(b, c)}`, v: k * Math.log(c) / Math.log(b), why: LG(b, c ** k) }; }
    if (kind === 3) { const m = d.int(1, 3); return { h: String(m), v: m, why: LG(b, b ** m) }; }
    if (kind === 4) return { h: LG(Q(1, b), c), v: -Math.log(c) / Math.log(b), why: LG(b, frac(1, c)) };
    const k = d.int(2, 3); if (c ** k > 200) return null; return { h: `${k}${LG(Q(1, b), c)}`, v: -k * Math.log(c) / Math.log(b), why: LG(b, frac(1, c ** k)) };
  }
  const logm = [
    T('logm-compare', '로그로 나타낸 수의 대소', '②13', (d, n) => {
      const b = d.pick([2, 3]);
      if (n === 0) {
        const A = logForm(d, b), Bq = logForm(d, b);
        if (!A || !Bq || Math.abs(A.v - Bq.v) < 1e-9 || stripH(A.h) === stripH(Bq.h)) return null;
        const right = A.v > Bq.v ? 'A &gt; B' : 'A &lt; B';
        return choose(d, `두 수 ${is('A', A.h)}, ${is('B', Bq.h)}의 대소 관계로 옳은 것은?`, right, ['A &gt; B', 'A = B', 'A &lt; B'], {
          size: 3, explain: `밑을 ${jj(String(b), '으로/로')} 같게 하면 A = ${A.why}, B = ${Bq.why}이다. 밑 ${jj(String(b), '이/가')} 1보다 크므로 진수가 큰 쪽이 크다. 따라서 ${right}이다.`, facts: { rule: 'logm-compare2' } });
      }
      const list = [logForm(d, b), logForm(d, b), logForm(d, b)];
      if (list.some((x) => !x) || new Set(list.map((x) => stripH(x.h))).size < 3) return null;
      return orderPick(d, `세 수 ${is('A', list[0].h)}, ${is('B', list[1].h)}, ${is('C', list[2].h)}의 대소 관계로 옳은 것은?`, ['A', 'B', 'C'], list.map((x) => x.v), {
        explain: `밑을 ${jj(String(b), '으로/로')} 같게 하면 A = ${list[0].why}, B = ${list[1].why}, C = ${list[2].why}이다. 밑 ${jj(String(b), '이/가')} 1보다 크므로 진수가 클수록 크다.`, facts: { rule: 'logm-compare3' } });
    }, { count: 2 }),
    T('logm-minmax', '정의역이 주어진 로그함수의 최댓값·최솟값', '②16', (d, n) => {
      const b = d.pick([2, 3]), p = d.int(-4, 3), q = d.int(-3, 3), e1 = d.int(-1, 1), e2 = e1 + d.int(1, 3);
      if (b ** e2 > 27) return null;
      const lo = Q(p * b ** Math.max(0, -e1) + (e1 < 0 ? 1 : b ** e1), b ** Math.max(0, -e1)), hi = p + b ** e2, up = n === 0, base = up ? b : Q(1, b);
      const Mx = (up ? e2 : -e1) + q, mn = (up ? e1 : -e2) + q, f = yIs(plusC(lgx(base, p), q));
      return mm(mn, Mx, { text: `정의역이 ${setX(`${iq(lo)} ≤ ${X} ≤ ${iq(hi)}`)}인 함수 ${f}의 최댓값과 최솟값을 구하시오.`,
        explain: `밑 ${jj(frx(base), '이/가')} 1보다 ${up ? '크므로 증가' : '작으므로 감소'}한다. ${is(X, up ? hi : lo)}일 때 최댓값 ${iq(Mx)}, ${is(X, up ? lo : hi)}일 때 최솟값 ${iq(mn)}이다.`,
        facts: { calc: [[`${up ? e2 : -e1}+(${jn(q)})`, 0], [`${up ? e1 : -e2}+(${jn(q)})`, 1]].map(([t, i]) => [t.replace(/^(-?\d+)\+/, (m0, v) => `(${v})+`), i]), derived: [Math.abs(e1), Math.abs(e2)] } });
    }, { count: 2 }),
    T('logm-quad', '진수가 이차식인 로그함수의 최댓값·최솟값', '②17', (d, n) => {
      const [v0, dd, e0, e1] = d.pick([[1, 1, 0, 1], [4, 2, 2, 3], [16, 4, 4, 5]]), h = d.pick([-2, -1, 1, 2, 3]), c = h * h + v0;
      const ex = poly([[1, X + sup(2)], [-2 * h, X], [c, '']]);
      if (n === 0) {
        const near = d.int(0, dd - 1), left = d.bool(), l = left ? h - dd : h - near, r = left ? h + near : h + dd;
        return mm(e0, e1, { text: `정의역이 ${setX(`${iq(l)} ≤ ${X} ≤ ${iq(r)}`)}인 함수 ${yIs(LG(2, `(${ex})`))}의 최댓값과 최솟값을 구하시오.`,
          explain: `${ex} = ${plusC(sq(L(1, -h)), v0)}이므로 ${iq(l)} ≤ ${X} ≤ ${iq(r)}에서 ${v0} ≤ ${ex} ≤ ${v0 + dd * dd}이다. 밑 2가 1보다 크므로 최댓값은 ${LG(2, v0 + dd * dd)} = ${e1}, 최솟값은 ${LG(2, v0)} = ${e0}이다.`,
          facts: { calc: [[`${e1}`, 0], [`${e0}`, 1]], derived: [e0, e1] } });
      }
      const c0 = d.int(-4, 8);
      return vals(`함수 ${jj(yIs(plusC(LG(2, `(${ex})`), c0)), '은/는')} ${is(X, Av)}일 때 최솟값 ${jj(Bv, '을/를')} 갖는다. 두 실수 ${Av}, ${Bv}의 값을 구하시오.`, [[Av, h], [Bv, c0 + e0]], {
        explain: `${ex} = ${plusC(sq(L(1, -h)), v0)} ≥ ${v0}이고 밑 2가 1보다 크므로 ${is(X, h)}일 때 최솟값 ${plusC(LG(2, v0), c0)} = ${jj(iq(c0 + e0), '을/를')} 갖는다. 따라서 ${is(Av, h)}, ${is(Bv, c0 + e0)}이다.`,
        facts: { calc: [[`${2 * h}/2`, 0], [`${jn(c0)}+${e0}`, 1]], derived: [2, e0, Math.abs(2 * h)] } });
    }, { count: 2 })
  ];

  // ════════════════════════════════════════════════════════════════
  // 로그방정식과 로그부등식
  // ════════════════════════════════════════════════════════════════
  const loge = [
    T('loge-basic', '로그 하나를 수와 같게 / 같은 밑의 로그끼리 같게', '②18', (d, n) => {
      if (n === 0) {
        const b = d.pick([2, 3, 5]), k = d.int(1, b === 5 ? 2 : 3), al0 = d.pick([1, 2, 3, -1]), x0 = nz(d, -6, 9), be0 = b ** k - al0 * x0;
        if (be0 === 0 || Math.abs(be0) > 30) return null;
        return num(`방정식 ${is(LG(b, `(${L(al0, be0)})`), k)}의 해는?`, x0, {
          explain: `${is(L(al0, be0), E(b, k))} = ${b ** k}에서 ${is(X, x0)}이다. 이때 진수 ${L(al0, be0)} = ${b ** k} &gt; 0이므로 해는 ${is(X, x0)}이다.`,
          facts: { calc: [[`(${b}**${k}-(${jn(be0)}))/(${jn(al0)})`, 0]] } });
      }
      const b = d.pick([null, 2, 3, 4]), x0 = nz(d, -5, 6), V0 = d.int(1, 9), [p, r] = pick2(d, [1, 2, 3, -1, -2]), q = V0 - p * x0, s = V0 - r * x0;
      if (Math.abs(q) > 20 || Math.abs(s) > 20 || q === 0 || s === 0) return null;
      return num(`방정식 ${is(lg(b, `(${L(p, q)})`), lg(b, `(${L(r, s)})`))}의 해는?`, x0, {
        explain: `${is(L(p, q), L(r, s))}에서 ${is(X, x0)}이다. 이때 두 진수가 모두 ${V0}로 양수이므로 해는 ${is(X, x0)}이다.`.replace(`${V0}로`, `${jj(String(V0), '으로/로')}`),
        facts: { calc: [[`((${jn(s)})-(${jn(q)}))/((${jn(p)})-(${jn(r)}))`, 0]] } });
    }, { count: 2 }),
    T('loge-merge', '로그를 합쳐 이차방정식이 되는 로그방정식', '②19', (d, n) => {
      if (n === 1) {
        const ten = d.bool(), c = ten ? d.int(1, 4) : d.int(1, 3), k = ten ? 1 : d.int(1, 2), N0 = ten ? c * c + 10 : c * c + 2 ** k, b = ten ? null : 2;
        if (N0 % 4 === 0 || N0 % 9 === 0) return null;
        return radAns(`방정식 ${is(`${lg(b, `(${L(1, c)})`)} + ${lg(b, `(${L(1, -c)})`)}`, k)}의 해는?`, 1, N0, {
          explain: `${is(lg(b, `(${L(1, c)})(${L(1, -c)})`), k)}이므로 ${is(`${X}${sup(2)} ${MINUS} ${c * c}`, ten ? 10 : 2 ** k)}, ${is(`${X}${sup(2)}`, N0)}이다. 진수 조건에서 ${X} &gt; ${c}이므로 ${is(X, rt(N0))}이다.`,
          facts: { calc: [[ten ? `${c}*${c}+10` : `${c}*${c}+2**${k}`, 0]], derived: ten ? [10] : [] } });
      }
      const b = d.pick([2, 3]), k = d.int(1, b === 2 ? 3 : 2), Nn = b ** k, divs = [];
      for (let u = 1; u <= Nn; u += 1) if (Nn % u === 0 && u !== Nn / u) divs.push(u);
      if (!divs.length) return null;
      const u = d.pick(divs), v = Nn / u, x0 = d.int(-2, 8), p = x0 - u, q = x0 - v;
      if (p === 0 || q === 0) return null;
      return num(`방정식 ${is(`${lgx(b, p)} + ${lgx(b, q)}`, k)}의 해는?`, x0, {
        explain: `${is(`${arg(p)}${arg(q)}`, Nn)}이므로 ${poly([[1, X + sup(2)], [-(p + q), X], [p * q - Nn, '']])} = 0, ${is(X, x0)} 또는 ${is(X, p + q - x0)}이다. 진수 조건에서 ${X} &gt; ${iq(Math.max(p, q))}이므로 해는 ${is(X, x0)}이다.`,
        facts: { calc: [[`((${jn(p)})+(${jn(q)})+(((${jn(p)})-(${jn(q)}))**2+4*${b}**${k})**0.5)/2`, 0]], derived: [4, 2, 0.5] } });
    }, { count: 2 }),
    T('loge-base', '밑이 다른 로그방정식', '②20', (d, n) => {
      if (n === 1) {
        const [b, r1, r2] = d.pick([[3, 3, 6], [4, 4, 12], [5, 5, 20], [5, 10, 15]]), c = r1 * r2 / (b * b);
        return inline(`방정식 ${is(LG(b, X), `1 + ${LG(b * b, `(${L(1, -c)})`)}`)}의 해를 구하시오.`, `${X} = {0} 또는 ${X} = {1}`, [{ answer: r1, signed: true }, { answer: r2, signed: true }], {
          unordered: true, shown: `${is(X, r1)} 또는 ${is(X, r2)}`,
          explain: `${LG(b * b, `(${L(1, -c)})`)} = ${frac(1, 2)}${LG(b, `(${L(1, -c)})`)}이므로 양변에 2를 곱하면 ${is(LG(b, `${X}${sup(2)}`), LG(b, `${b * b}(${L(1, -c)})`))}, ${poly([[1, X + sup(2)], [-b * b, X], [b * b * c, '']])} = 0이다. ${is(X, r1)} 또는 ${is(X, r2)}이고 둘 다 ${X} &gt; ${jj(String(c), '을/를')} 만족시키므로 모두 해이다.`,
          facts: { calc: [[`${r1}`, 0], [`${r2}`, 1]], derived: [r1, r2] } });
      }
      const b = d.pick([2, 3]), p = d.int(-3, 3), t = d.int(1, 4), s = d.int(1, 4), x0 = p + t, x1 = p - s, u = x0 + x1 - 2 * p, v = p * p - x0 * x1;
      if (u === 0 || Math.abs(v) > 40 || v === 0) return null;
      return num(`방정식 ${is(lgx(b, p), LG(b * b, `(${L(u, v)})`))}의 해는?`, x0, {
        explain: `${LG(b * b, `(${L(u, v)})`)} = ${frac(1, 2)}${LG(b, `(${L(u, v)})`)}이므로 ${is(sq(L(1, -p)), L(u, v))}, ${poly([[1, X + sup(2)], [-(2 * p + u), X], [p * p - v, '']])} = 0이다. ${is(X, x0)} 또는 ${is(X, x1)}인데 진수 조건 ${X} &gt; ${iq(p)}에서 해는 ${is(X, x0)}이다.`,
        facts: { calc: [[`${x0}`, 0]], derived: [Math.abs(x0)] } });
    }, { count: 2 }),
    T('loge-sub', 'log x = t로 치환하는 로그방정식', '②21', (d) => {
      const b = d.pick([2, 3]), m = d.int(1, 2), nn = d.int(1, b === 2 ? 3 : 2), s = nn - m, lgX = LG(b, X);
      return inline(`방정식 ${poly([[1, sq(lgX)], [-s, lgX], [-m * nn, '']])} = 0의 두 근을 ${al}, ${be}(${al} &lt; ${be})라 할 때, ${al}, ${be}의 값을 구하시오.`, `${al} = ${frac('{0}', '{1}')}, ${be} = {2}`,
        [{ answer: 1 }, { answer: b ** m }, { answer: b ** nn }], {
          shown: `${is(al, Q(1, b ** m))}, ${is(be, b ** nn)}`,
          explain: `${is(lgX, Tv)}로 놓으면 ${poly([[1, Tv + sup(2)], [-s, Tv], [-m * nn, '']])} = 0, (${Tv} + ${m})(${Tv} ${MINUS} ${nn}) = 0이다. ${is(lgX, -m)}에서 ${is(X, Q(1, b ** m))}, ${is(lgX, nn)}에서 ${is(X, b ** nn)}이다.`,
          facts: { calc: [['1', 0], [`${b}**${m}`, 1], [`${b}**${nn}`, 2]], derived: [m, nn] } });
    }),
    T('loge-ineq', '같은 밑으로 고쳐 푸는 로그부등식', '②22', (d, n) => {
      const b = d.pick([2, 3, 5]), k = d.int(1, b === 5 ? 1 : 2), K = b ** k;
      if (n === 2) {
        const c = d.int(0, 4), up = d.bool();
        if (up) return N(`부등식 ${LG(b, arg(c))} ≤ ${jj(String(k), '을/를')} 만족시키는 자연수 ${X}의 개수는?`, K, {
          explain: `${arg(c)} ≤ ${E(b, k)} = ${K}이고 진수 조건 ${X} &gt; ${String(c)}에서 ${c} &lt; ${X} ≤ ${c + K}이다. 자연수 ${X}는 ${K}개이다.`.replace(`${String(c)}에서`, `${c}에서`),
          facts: { calc: [[`${b}**${k}`, 0]] } });
        return N(`부등식 ${LG(Q(1, b), arg(c))} &gt; ${MINUS}${jj(String(k), '을/를')} 만족시키는 정수 ${X}의 개수는?`, K - 1, {
          explain: `${MINUS}${k} = ${LG(Q(1, b), K)}이고 밑이 1보다 작으므로 ${arg(c)} &lt; ${K}이다. 진수 조건 ${X} &gt; ${jj(String(c), '과/와')} 함께 ${c} &lt; ${X} &lt; ${c + K}이므로 정수 ${X}는 ${K - 1}개이다.`,
          facts: { calc: [[`${b}**${k}-1`, 0]] } });
      }
      const be0 = nz(d, -5, 5), flip = d.bool(), rel = d.pick(['<', '<=']);
      if (n === 0) {
        // log_b(x + β) rel k, 또는 log_b(β − x) rel k
        const lo = flip ? be0 - K : -be0, hi = flip ? be0 : K - be0, r1 = flip ? rel : '<', r2 = flip ? '<' : rel, a = flip ? `(${L(-1, be0)})` : `(${L(1, be0)})`;
        return betw(`부등식 ${LG(b, a)} ${REL[rel]} ${jj(String(k), '을/를')} 푸시오.`, lo, r1, r2, hi, {
          explain: `${k} = ${LG(b, K)}이고 밑 ${jj(String(b), '이/가')} 1보다 크므로 ${a.slice(1, -1)} ${REL[rel]} ${K}이다. 진수 조건 ${a.slice(1, -1)} &gt; 0과 함께 풀면 ${iq(lo)} ${REL[r1]} ${X} ${REL[r2]} ${iq(hi)}이다.`,
          facts: { calc: flip ? [[`${jn(be0)}-${K}`, 0], [jn(be0), 3]] : [[`0-(${jn(be0)})`, 0], [`${K}-(${jn(be0)})`, 3]], derived: [K] } });
      }
      // 밑이 1보다 작다: log_(1/b)(x + β) rel' −k → 0 &lt; x + β (FLIP rel') K
      const relL = rel === '<' ? '>' : '>=';
      return betw(`부등식 ${LG(Q(1, b), `(${L(1, be0)})`)} ${REL[relL]} ${MINUS}${jj(String(k), '을/를')} 푸시오.`, -be0, '<', rel, K - be0, {
        explain: `${MINUS}${k} = ${LG(Q(1, b), K)}이고 밑이 1보다 작으므로 부등호 방향이 바뀌어 ${L(1, be0)} ${REL[rel]} ${K}이다. 진수 조건 ${L(1, be0)} &gt; 0과 함께 풀면 ${iq(-be0)} &lt; ${X} ${REL[rel]} ${iq(K - be0)}이다.`,
        facts: { calc: [[`0-(${jn(be0)})`, 0], [`${b}**${k}-(${jn(be0)})`, 3]] } });
    }, { count: 3 }),
    T('loge-ineq-quad', '합치거나 밑을 바꿔 이차부등식이 되는 로그부등식', '②23', (d, n) => {
      if (n === 0) {
        const [b, k, r2, w] = d.pick([[2, 1, 2, 1], [2, 2, 4, 1], [2, 3, 8, 1], [2, 3, 4, 2], [3, 1, 3, 1], [3, 2, 9, 1], [5, 1, 5, 1]]), c = r2 - w, rel = d.pick(['<', '<=']);
        return betw(`부등식 ${LG(b, X)} + ${lgx(b, c)} ${REL[rel]} ${jj(String(k), '을/를')} 푸시오.`, c, '<', rel, r2, {
          explain: `${LG(b, `${X}(${L(1, -c)})`)} ${REL[rel]} ${LG(b, b ** k)}이므로 ${poly([[1, X + sup(2)], [-c, X], [-(b ** k), '']])} ${REL[rel]} 0, ${iq(c - r2)} ${REL[rel]} ${X} ${REL[rel]} ${r2}이다. 진수 조건 ${X} &gt; ${jj(String(c), '과/와')} 함께 ${c} &lt; ${X} ${REL[rel]} ${r2}이다.`,
          facts: { calc: [[`${c}`, 0], [`(${c}+(${c}*${c}+4*${b}**${k})**0.5)/2`, 3]], derived: [4, 2, 0.5] } });
      }
      if (n === 1) {
        const b = d.pick([2, 3]), p = d.int(-2, 3), t = d.int(1, 2), r = p + t, q = r + t * t;
        return betw(`부등식 2${lgx(Q(1, b), p)} &lt; ${jj(LG(Q(1, b), `(${L(-1, q)})`), '을/를')} 푸시오.`, r, '<', '<', q, {
          explain: `${LG(Q(1, b), sq(L(1, -p)))} &lt; ${LG(Q(1, b), `(${L(-1, q)})`)}이고 밑이 1보다 작으므로 ${sq(L(1, -p))} &gt; ${L(-1, q)}, ${poly([[1, X + sup(2)], [-(2 * p - 1), X], [p * p - q, '']])} &gt; 0이다. 진수 조건 ${iq(p)} &lt; ${X} &lt; ${jj(iq(q), '과/와')} 함께 ${iq(r)} &lt; ${X} &lt; ${iq(q)}이다.`,
          facts: { calc: [[`(2*(${jn(p)})-1+((2*(${jn(p)})-1)**2-4*((${jn(p)})**2-(${jn(q)})))**0.5)/2`, 0], [jn(q), 3]], derived: [4, 2, 0.5] } });
      }
      const p = d.int(-3, 3), m = d.int(2, 5), rel = d.pick(['<=', '<']), out = rel === '<=' ? '>=' : '>';
      return ray(`0 &lt; ${Av} &lt; 1일 때, 부등식 ${lg(Av, arg(p))} ${REL[rel]} ${lg(`${Av}${sup(2)}`, `${m}${arg(p)}`)}을 푸시오.`, out, p + m, {
        explain: `${lg(`${Av}${sup(2)}`, `${m}${arg(p)}`)} = ${frac(1, 2)}${lg(Av, `${m}${arg(p)}`)}이므로 ${lg(Av, sq(L(1, -p)))} ${REL[rel]} ${lg(Av, `${m}${arg(p)}`)}이다. 밑이 1보다 작으므로 ${sq(L(1, -p))} ${REL[out]} ${m}${arg(p)}이고, 진수 조건 ${X} &gt; ${iq(p)}에서 양변을 ${L(1, -p)}로 나누면 ${L(1, -p)} ${REL[out]} ${m}, ${X} ${REL[out]} ${iq(p + m)}이다.`.replace(`${L(1, -p)}로 나누면`, `${jj(L(1, -p), '으로/로')} 나누면`),
        facts: { calc: [[`${jn(p)}+${m}`, 1]] } });
    }, { count: 3 }),
    T('loge-sub-ineq', '로그를 t로 치환하는 로그부등식', '②25', (d, n) => {
      if (n === 0) {
        const [b, r] = d.pick([[2, 1], [2, 2], [2, 3], [3, 1], [3, 2]]), c = r * (r + 1), cnt = b ** (r + 1) - 1;
        return N(`부등식 ${sq(LG(b, X))} &lt; ${LG(b * b, `${X}${sup(2)}`)} + ${c}를 만족시키는 정수 ${X}의 개수는?`.replace(`${c}를`, jj(String(c), '을/를')), cnt, {
          explain: `${LG(b * b, `${X}${sup(2)}`)} = ${LG(b, X)}이므로 ${is(LG(b, X), Tv)}로 놓으면 ${Tv}${sup(2)} ${MINUS} ${Tv} ${MINUS} ${c} &lt; 0, ${MINUS}${r} &lt; ${Tv} &lt; ${r + 1}이다. ${frac(1, b ** r)} &lt; ${X} &lt; ${b ** (r + 1)}이므로 정수 ${X}는 1부터 ${b ** (r + 1) - 1}까지 ${cnt}개이다.`,
          facts: { calc: [[`${b}**(${r}+1)-1`, 0]], derived: [r] } });
      }
      const b = d.pick([2, 3]), m = d.int(1, 2), strict = d.bool(), lgX = LG(Q(1, b), X), rel = strict ? '>' : '>=';
      return inline(`부등식 ${poly([[1, sq(lgX)], [-m, lgX]])} ${REL[rel]} 0을 푸시오.`, `0 &lt; ${X} {0} ${frac('1', '{1}')} 또는 ${X} {2} {3}`,
        [{ rel: true, answer: strict ? '<' : '<=' }, { answer: b ** m }, { rel: true, answer: rel }, { answer: 1, signed: true }], {
          shown: nb(`0 &lt; ${X} ${REL[strict ? '<' : '<=']} ${frac(1, b ** m)} 또는 ${X} ${REL[rel]} 1`),
          explain: `${is(lgX, Tv)}로 놓으면 ${Tv}(${Tv} ${MINUS} ${m}) ${REL[rel]} 0이므로 ${Tv} ${REL[FLIP[rel]]} 0 또는 ${Tv} ${REL[rel]} ${m}이다. 밑이 1보다 작으므로 ${X} ${REL[rel]} 1 또는 ${X} ${REL[strict ? '<' : '<=']} ${frac(1, b ** m)}이고, 진수 조건 ${X} &gt; 0과 함께 답을 얻는다.`,
          facts: { calc: [[`${b}**${m}`, 1], ['1', 3]] } });
    }, { count: 2 }),
    T('loge-disc', '모든 실수 x에서 성립하는 이차부등식 — 로그로 된 계수', '②26', (d, n) => {
      const strict = d.bool();
      if (n === 0) {
        const r1 = -d.int(1, 2), r2 = d.int(1, 3), s = r1 + r2, c = -r1 * r2, L0 = lg(null, Av), rel = strict ? '<' : '<=';
        const lin = poly([[s, L0], [c, '']]);
        return inline(`모든 실수 ${X}에 대하여 이차부등식 ${X}${sup(2)} ${MINUS} 2${X}${L0} + ${lin} ${strict ? '&gt;' : '≥'} 0이 항상 성립하도록 하는 실수 ${Av}의 값의 범위를 구하시오.`, `${frac('1', '{0}')} {1} ${Av} {2} {3}`,
          [{ answer: 10 ** -r1 }, { rel: true, answer: rel }, { rel: true, answer: rel }, { answer: 10 ** r2 }], {
            shown: nb(`${frac(1, 10 ** -r1)} ${REL[rel]} ${Av} ${REL[rel]} ${10 ** r2}`),
            explain: `판별식을 ${V('D')}라 하면 ${frac(V('D'), 4)} = ${sq(L0)} ${MINUS} (${lin}) ${REL[rel]} 0이다. ${is(L0, Tv)}로 놓으면 (${Tv} + ${-r1})(${Tv} ${MINUS} ${r2}) ${REL[rel]} 0, ${MINUS}${-r1} ${REL[rel]} ${L0} ${REL[rel]} ${r2}이므로 ${frac(1, 10 ** -r1)} ${REL[rel]} ${Av} ${REL[rel]} ${10 ** r2}이다.`,
            facts: { calc: [[`10**(${-r1})`, 0], [`10**${r2}`, 3]], derived: [10, -r1, r2] } });
      }
      const [r1, r2] = d.pick([[1, 2], [1, 3], [2, 3], [1, 4], [2, 4]]), s = r1 + r2, c = r1 * r2, L0 = LG(2, Av), rel = strict ? '<' : '<=';
      return betw(`모든 실수 ${X}에 대하여 이차부등식 ${X}${sup(2)} + 2${X}${L0} + ${s}${L0} ${MINUS} ${c} ${strict ? '≥' : '&gt;'} 0이 항상 성립하도록 하는 실수 ${Av}의 값의 범위를 구하시오.`, 2 ** r1, strict ? '<=' : '<', strict ? '<=' : '<', 2 ** r2, {
        name: Av,
        explain: `판별식을 ${V('D')}라 하면 ${frac(V('D'), 4)} = ${sq(L0)} ${MINUS} ${s}${L0} + ${c} ${strict ? '≤' : '&lt;'} 0이다. (${L0} ${MINUS} ${r1})(${L0} ${MINUS} ${r2}) ${strict ? '≤' : '&lt;'} 0에서 ${r1} ${strict ? '≤' : '&lt;'} ${L0} ${strict ? '≤' : '&lt;'} ${r2}이므로 ${2 ** r1} ${strict ? '≤' : '&lt;'} ${Av} ${strict ? '≤' : '&lt;'} ${2 ** r2}이다.`,
        facts: { calc: [[`2**${r1}`, 0], [`2**${r2}`, 3]], derived: [r1, r2] } });
    }, { count: 2 })
  ];

  // ════════════════════════════════════════════════════════════════
  // 지수함수와 로그함수의 그래프와 도형
  // ════════════════════════════════════════════════════════════════
  const both = [
    T('both-inv-point', '역함수의 그래프가 지나는 점', '②27 심2', (d, n) => {
      if (n === 0) {
        const p = d.int(1, 6), m = d.pick([2, 3, 5, 6, 7]), x1 = p + m, s = d.pick([2, 4]), b0 = p + m ** (s / 2);
        return vals(`함수 ${is(fx(), lg(Av, arg(p)))}의 그래프는 점 ${nb(`A(${x1}, 2)`)}를 지나고, 그 역함수의 그래프는 점 ${nb(`B(${s}, ${Bv})`)}를 지날 때, ${Av}${sup(2)}의 값과 ${Bv}의 값을 구하시오. (단, ${Av} &gt; 0, ${Av} ≠ 1)`, [[`${Av}${sup(2)}`, m, true], [Bv, b0, true]], {
          explain: `${is(fAt(x1), lg(Av, m))} = 2에서 ${is(`${Av}${sup(2)}`, m)}이다. 역함수의 그래프가 점 ${nb(`(${s}, ${Bv})`)}를 지나면 ${fx()}의 그래프는 점 ${nb(`(${Bv}, ${s})`)}를 지나므로 ${is(lg(Av, `(${Bv} − ${p})`), s)}, ${is(`${Bv} ${MINUS} ${p}`, E(Av, s))} = ${m ** (s / 2)}, ${is(Bv, b0)}이다.`,
          facts: { calc: [[`${x1}-${p}`, 0], [`${p}+(${x1}-${p})**(${s}/2)`, 1]] } });
      }
      const b = d.pick([2, 3]), c = d.int(1, 3), u = d.pick([5, 6, 7, 10].filter((v) => notPow(b, v)));
      return N(`함수 ${is(fx(), `${E(b, L(1, -c))} + ${Av}`)}의 역함수의 그래프가 점 ${jj(nb(`(${Av} + ${u}, ${Av} + ${c})`), '을/를')} 지날 때, ${E(b, Av)}의 값은? (단, ${jj(Av, '은/는')} 상수이다.)`, u, {
        explain: `역함수의 그래프가 점 ${nb(`(${Av} + ${u}, ${Av} + ${c})`)}를 지나면 ${fx()}의 그래프는 점 ${nb(`(${Av} + ${c}, ${Av} + ${u})`)}를 지난다. ${is(fAt(`${Av} + ${c}`), `${E(b, Av)} + ${Av}`)} = ${Av} + ${u}이므로 ${is(E(b, Av), u)}이다.`,
        facts: { calc: [[`${u}`, 0]] } });
    }, { count: 2 }),
    T('both-area', '평행이동으로 옮겨 붙여 넓이 구하기', '②29', (d, n) => {
      if (n === 0) {
        const b = d.pick([2, 3]), s = d.int(1, 4), e1 = d.int(0, 1), e2 = e1 + d.int(1, b === 2 ? 3 : 2), c1 = b ** e1, c2 = b ** e2;
        const f = (x) => b ** x, g = (x) => b ** (x + s), lo = e1 - s, hi = e2;
        const figure = gfig({ x: [Math.min(-0.6, lo - 0.6), Math.max(0.6, hi + 0.6)], y: [-0.4 * c2 / 8, c2 * 1.15], h: 200,
          fill: [{ f: (x) => Math.min(c2, g(x)), g: (x) => Math.max(c1, f(x)), from: lo, to: hi }],
          curves: [{ f, name: `y=${b}^x` }, { f: g, name: `y=${b}^{x+${s}}` }], lines: [{ y: c1, dash: true }, { y: c2, dash: true }], yt: [c1, c2] });
        return N(`그림과 같이 두 함수 ${yIs(E(b, X))}, ${yIs(E(b, L(1, s)))}의 그래프와 두 직선 ${yIs(c1)}, ${jj(yIs(c2), '으로/로')} 둘러싸인 부분의 넓이는?`, s * (c2 - c1), {
          figure, explain: `${yIs(E(b, L(1, s)))}의 그래프는 ${yIs(E(b, X))}의 그래프를 ${X}축의 방향으로 ${MINUS}${s}만큼 평행이동한 것이다. 가로로 자른 선분의 길이가 늘 ${String(s)}이므로 넓이는 가로 ${s}, 세로 ${c2} ${MINUS} ${c1} = ${c2 - c1}인 직사각형의 넓이 ${jj(String(s * (c2 - c1)), '과/와')} 같다.`.replace(`${String(s)}이므로`, `${s}이므로`),
          facts: { calc: [[`${s}*(${c2}-${c1})`, 0]] } });
      }
      const b = d.pick([2, 3]), e = d.int(1, 2), m = b ** e, c = d.int(1, 3), l = d.int(1, 3), h = l + d.int(2, 6);
      if (m > 9) return null;
      const figure = gfig({ x: [-0.5, h + 2.6], y: [-c - 1.4, Math.log(m * h) / Math.log(b) + 1], h: 200, fill: [{ f: (x) => Math.log(m * x) / Math.log(b), g: (x) => Math.log(x) / Math.log(b) - c, from: l, to: h }],
        curves: [{ f: (x) => Math.log(m * x) / Math.log(b), from: 0.02, name: `y=log_${b} ${m}x` }, { f: (x) => Math.log(x) / Math.log(b) - c, from: 0.02, name: `y=log_${b} x-${c}` }], lines: [{ x: l, dash: true }, { x: h, dash: true }], xt: [l, h] });
      return N(`그림과 같이 두 함수 ${yIs(LG(b, `${m}${X}`))}, ${yIs(`${LG(b, X)} ${MINUS} ${c}`)}의 그래프와 두 직선 ${is(X, l)}, ${jj(is(X, h), '으로/로')} 둘러싸인 부분의 넓이는?`, (h - l) * (e + c), {
        figure, explain: `${LG(b, `${m}${X}`)} = ${LG(b, X)} + ${e}이므로 두 그래프의 세로 간격은 늘 ${e} + ${c} = ${e + c}이다. 넓이는 가로 ${h - l}, 세로 ${e + c}인 직사각형의 넓이 ${(h - l) * (e + c)}와 같다.`.replace(`${(h - l) * (e + c)}와 같다`, `${jj(String((h - l) * (e + c)), '과/와')} 같다`),
        facts: { calc: [[`(${h}-${l})*(${e}+${c})`, 0]], derived: [e] } });
    }, { count: 2 }),
    T('both-vertical', '직선 x = a 위 두 교점 사이의 거리', '②30', (d, n) => {
      if (n === 0) {
        const b = d.pick([2, 3]), a0 = d.int(1, 2), Lh = b ** (2 * a0) - b ** a0;
        return N(`두 함수 ${yIs(E(b, X))}, ${yIs(E(b * b, X))}의 그래프가 직선 ${is(X, Av)}와 만나는 점을 각각 A, B라 하자. ${is(SG('AB'), Lh)}일 때, 양수 ${Av}의 값은?`, a0, {
          explain: `${is(SG('AB'), `${E(b * b, Av)} ${MINUS} ${E(b, Av)}`)} = ${Lh}이다. ${is(E(b, Av), Tv)}(${Tv} &gt; 0)로 놓으면 ${Tv}${sup(2)} ${MINUS} ${Tv} ${MINUS} ${Lh} = 0이고 양수인 근은 ${is(Tv, b ** a0)}이다. 따라서 ${is(Av, a0)}이다.`,
          facts: { calc: [[`${a0}`, 0]], derived: [a0] } });
      }
      const [b, Lh] = d.pick([[2, 1], [2, 2], [2, 3], [3, 1], [3, 2], [5, 1]]), a0 = b ** (2 * Lh);
      return N(`두 함수 ${yIs(LG(b, X))}, ${yIs(LG(b * b, X))}의 그래프가 직선 ${is(X, Av)}(${Av} &gt; 1)와 만나는 점을 각각 A, B라 하자. ${is(SG('AB'), Lh)}일 때, ${Av}의 값은?`, a0, {
        explain: `${is(SG('AB'), `${LG(b, Av)} ${MINUS} ${LG(b * b, Av)}`)} = ${frac(1, 2)}${LG(b, Av)} = ${Lh}이므로 ${is(LG(b, Av), 2 * Lh)}, ${is(Av, E(b, 2 * Lh))} = ${a0}이다.`,
        facts: { calc: [[`${b}**(2*${Lh})`, 0]], derived: [2] } });
    }, { count: 2 }),
    T('both-square', '정사각형의 꼭짓점이 그래프 위에 있을 때', '②32', (d, n) => {
      if (n === 0) {
        const b = d.pick([2, 3]), s = d.int(1, 2), ax = b ** s;
        const figure = gfig({ x: [-0.6, ax + s + 1], y: [-1.6, s + 1.3], h: 170, curves: [{ f: ln(b), from: 0.02, name: `y=log_${b} x` }],
          segs: [{ p: [ax, 0], q: [ax, s] }, { p: [ax, s], q: [ax + s, s] }, { p: [ax + s, s], q: [ax + s, 0] }], dots: [{ x: ax, y: s, name: 'A', side: 'ul' }, { x: ax, y: 0, name: 'B', side: 'dl' }, { x: ax + s, y: 0, name: 'C', side: 'dr' }, { x: ax + s, y: s, name: 'D', side: 'dr' }] });
        return coordAns(`그림에서 사각형 ABCD는 한 변의 길이가 ${s}인 정사각형이고, 점 A는 함수 ${yIs(LG(b, X))}의 그래프 위에 있다. 두 점 B, C가 ${X}축 위에 있을 때, 점 D의 좌표를 구하시오.`, [ax + s, s], {
          figure, explain: `점 A의 ${Y}좌표는 ${String(s)}이므로 ${is(LG(b, X), s)}에서 ${is(X, ax)}, 곧 ${nb(`A(${ax}, ${s})`)}이다. 점 D는 점 A에서 오른쪽으로 ${s}만큼 간 점이므로 ${nb(`D(${ax + s}, ${s})`)}이다.`.replace(`${String(s)}이므로`, `${s}이므로`).replace(`${nb(`A(${ax}, ${s})`)}이다`, `${nb(`A(${ax}, ${s})`)}이다`),
          facts: { calc: [[`${b}**${s}+${s}`, 0], [`${s}`, 1]] } });
      }
      const b = d.pick([2, 3]), s = d.int(b === 2 ? 3 : 2, b === 2 ? 6 : 4);
      return qAns(`두 함수 ${yIs(E(b, X))}, ${yIs(`${Kv} × ${E(b, X)}`)}의 그래프 위의 점을 각각 A, B라 하고, 두 점 A, B에서 ${X}축에 내린 수선의 발을 각각 C, D라 하자. 사각형 ACDB가 넓이가 ${s * s}인 정사각형일 때, 상수 ${Kv}의 값은? (단, 두 점 A, B는 제1사분면 위의 점이고, 점 B는 점 A의 오른쪽에 있다.)`, [1, b ** s], {
        explain: `한 변의 길이는 ${s}이다. ${nb(`A(${Pv}, ${E(b, Pv)})`)}라 하면 ${is(E(b, Pv), s)}이고 ${nb(`B(${Pv} + ${s}, ${s})`)}이다. ${is(s, `${Kv} × ${E(b, `${Pv} + ${s}`)}`)} = ${Kv} × ${s} × ${b ** s}이므로 ${is(Kv, Q(1, b ** s))}이다.`,
        facts: { value: `1/${b}**${s}`, derived: [s] } });
    }, { count: 2 }),
    T('both-tri', '두 로그함수 그래프와 x축이 만드는 삼각형의 넓이', '②33', (d) => {
      const [b, j] = d.pick([[2, 2], [2, 4], [3, 1], [3, 2]]), m = (b + 1) * b ** j, x0 = b ** j, area = (m - b - 1) * j / 2;
      return N(`두 함수 ${is(fx(), LG(b, X))}, ${is(fx('g'), `${LG(b, `(${L(-1, m)})`)} ${MINUS} 1`)}에 대하여 ${is(Y, fx())}, ${is(Y, fx('g'))}의 그래프와 ${X}축의 교점을 각각 A, B라 하고, 두 그래프의 교점을 C라 할 때, 삼각형 ABC의 넓이는?`, area, {
        explain: `${is(LG(b, X), 0)}에서 ${nb('A(1, 0)')}, ${is(LG(b, `(${L(-1, m)})`), 1)}에서 ${nb(`B(${m - b}, 0)`)}이다. ${is(LG(b, X), LG(b, frac(L(-1, m), b)))}에서 ${is(X, x0)}이므로 ${nb(`C(${x0}, ${j})`)}이다. 넓이는 ${frac(1, 2)} × ${m - b - 1} × ${j} = ${area}이다.`,
        facts: { calc: [[`(${m}-${b}-1)*${j}/2`, 0]], derived: [2, j] } });
    }),
    T('both-abs', '|log x|의 그래프와 가로선의 교점 사이의 거리', '②34', (d) => {
      const [b, m] = d.pick([[2, 1], [3, 1], [2, 2]]), k = Q(b ** (2 * m) + 1, b ** m);
      return qAns(`곡선 ${yIs(`|${LG(b, X)}|`)}가 직선 ${is(Y, m)}과 만나는 두 점을 각각 A, B, 직선 ${is(Y, 2 * m)}와 만나는 두 점을 각각 C, D라 하자. ${is(SG('CD'), `${Kv}${SG('AB')}`)}일 때, 실수 ${Kv}의 값은?`.replace(`${is(Y, m)}과`, jj(is(Y, m), '과/와')).replace(`${is(Y, 2 * m)}와`, jj(is(Y, 2 * m), '과/와')), k, {
        explain: `${is(`|${LG(b, X)}|`, m)}에서 ${is(LG(b, X), `±${m}`)}이므로 ${is(SG('AB'), `${b ** m} ${MINUS} ${frac(1, b ** m)}`)}, 같은 방법으로 ${is(SG('CD'), `${b ** (2 * m)} ${MINUS} ${frac(1, b ** (2 * m))}`)}이다. ${is(Kv, frac(SG('CD'), SG('AB')))} = ${b ** m} + ${frac(1, b ** m)} = ${frx(k)}이다.`,
        facts: { value: `(${b}**(2*${m})+1)/${b}**${m}`, derived: [2] } });
    })
  ];

  // ════════════════════════════════════════════════════════════════
  // 지수함수와 로그함수의 활용
  // ════════════════════════════════════════════════════════════════
  const RATIOS = [[3, 2], [4, 3], [5, 4], [6, 5]];
  const life = [
    T('life-eq', '지수 모형 — 방정식으로 시간 구하기', '②35', (d, n) => {
      if (n === 0) {
        const H0 = d.pick([5, 8, 12, 30, 1600]), k = d.int(2, 5), r = d.pick([3, 5]), A0 = r * 2 ** k;
        if (k * H0 > 9999) return null;
        return N(`어느 방사성 물질은 ${H0}년마다 그 양이 반으로 줄어든다. 처음 양이 ${A0} mg일 때, ${X}년 후에 남아 있는 양은 ${A0} × ${E(Q(1, 2), [X, H0])} mg이다. 남아 있는 양이 ${r} mg이 되는 것은 몇 년 후인가?`, k * H0, {
          unit: '년', explain: `${is(`${A0} × ${E(Q(1, 2), [X, H0])}`, r)}에서 ${is(E(Q(1, 2), [X, H0]), frac(r, A0))} = ${E(Q(1, 2), k)}이므로 ${is(frac(X, H0), k)}, ${is(X, k * H0)}이다.`,
          facts: { calc: [[`${H0}*${k}`, 0]], derived: [k] } });
      }
      const [p, q] = d.pick(RATIOS), c = d.int(2, 4), k = d.int(2, 4), u = d.pick([1, 2, 5, 10]), S = q ** k * u, Ev = p ** k * u;
      if (Ev > 9999 || S < 30) return null;
      return N(`어느 회사에 ${V('A')}원을 투자하면 ${Tv}년 후의 이익금은 ${V('A')} × ${E(Q(p, q), [Tv, c])}원이 된다고 한다. 처음 투자 금액이 ${S}만 원이고 ${Tv}년 후의 이익금이 ${Ev}만 원일 때, ${Tv}의 값은?`, k * c, {
        explain: `${is(`${S} × ${E(Q(p, q), [Tv, c])}`, Ev)}에서 ${is(E(Q(p, q), [Tv, c]), frac(Ev, S))} = ${E(Q(p, q), k)}이므로 ${is(frac(Tv, c), k)}, ${is(Tv, k * c)}이다.`,
        facts: { calc: [[`${c}*${k}`, 0]], derived: [k] } });
    }, { count: 2 }),
    T('life-ineq', '지수 모형 — 부등식으로 처음 넘는 때·최대 시간', '②36', (d, n) => {
      if (n === 0) {
        const [p, q] = d.pick(RATIOS), c = d.int(2, 4), k = d.int(2, 4), u = d.pick([1, 2, 5, 10]), S = q ** k * u, Ev = p ** k * u;
        if (Ev > 9999 || S < 30) return null;
        return N(`어느 은행에 ${V('A')}원을 예금하면 ${Tv}년 후의 원금과 이자의 합계가 ${V('A')} × ${E(Q(p, q), [Tv, c])}원이 된다고 한다. 이 은행에 ${S}만 원을 예금하면 원금과 이자의 합계가 처음으로 ${Ev}만 원 이상이 되는 것은 몇 년 후인가?`, k * c, {
          unit: '년', explain: `${S} × ${E(Q(p, q), [Tv, c])} ≥ ${Ev}에서 ${E(Q(p, q), [Tv, c])} ≥ ${E(Q(p, q), k)}이고 밑이 1보다 크므로 ${frac(Tv, c)} ≥ ${k}, ${Tv} ≥ ${k * c}이다. 처음으로 ${Ev}만 원 이상이 되는 것은 ${k * c}년 후이다.`,
          facts: { calc: [[`${c}*${k}`, 0]], derived: [k] } });
      }
      const b = d.pick([2, 3]), nr = d.int(2, 4), k = d.int(2, b === 2 ? 6 : 4), base = `(${frac(1, nr === 2 ? rt(b) : rtn(nr, b))})`;
      return N(`어느 약은 몸에 넣은 지 ${Tv}시간 후에 처음 넣은 양의 ${E(base, Tv)}만큼 혈액 속에 남는다고 한다. 혈액 속에 남은 양이 처음 넣은 양의 ${frac(1, b ** k)}보다 적으면 약효가 없다고 할 때, 이 약의 약효가 지속되는 최대 시간은 몇 시간인가?`, nr * k, {
        unit: '시간', explain: `약효가 있으려면 ${E(base, Tv)} ≥ ${frac(1, b ** k)}, ${E(Q(1, b), [Tv, nr])} ≥ ${E(Q(1, b), k)}이다. 밑이 1보다 작으므로 ${frac(Tv, nr)} ≤ ${k}, ${Tv} ≤ ${nr * k}이다.`,
        facts: { calc: [[`${nr}*${k}`, 0]], derived: [nr, k] } });
    }, { count: 2 }),
    T('life-log', '상용로그 값을 주고 푸는 지수부등식 — 최소 횟수·두께', '②37', (d, n) => {
      if (n === 0) {
        const c = d.pick([0.75, 0.45]), m = d.pick([1, 3]), ans = Math.round(c * m / 0.3 * 10) / 10;
        if (Number.isInteger(ans)) return null;
        return D(`방사선이 두께가 ${V('l')} mm인 판을 통과하면 그 양이 통과하기 전의 ${E(Q(1, 2), [V('l'), c])}배가 된다고 한다. 통과한 후의 양이 통과하기 전의 ${frac(1, 10 ** m)} 이하가 되려면 판의 두께를 최소 몇 mm로 해야 하는가? (단, ${is(lg(null, 2), '0.3')}으로 계산한다.)`, ans, {
          unit: 'mm', explain: `${E(Q(1, 2), [V('l'), c])} ≤ ${frac(1, 10 ** m)}의 양변에 상용로그를 취하면 ${frac(V('l'), c)} × (${MINUS}0.3) ≤ ${MINUS}${m}이다. 음수로 나누면 부등호 방향이 바뀌어 ${V('l')} ≥ ${frac(`${m} × ${c}`, '0.3')} = ${ans}이다.`,
          facts: { calc: [[`${m}*${c}/0.3`, 0]] } });
      }
      if (n === 1) {
        // 한 번 거칠 때마다 r배: [r의 글, 0.01 단위 log r, 주는 로그 값 글]
        const F = d.pick([['0.8', -10, `${is(lg(null, 2), '0.3')}`], ['0.9', -4, `${is(lg(null, 3), '0.48')}`], [frac(1, 4), -60, `${is(lg(null, 2), '0.3')}`], [frac(1, 2), -30, `${is(lg(null, 2), '0.3')}`]]);
        const Tg = d.pick(F[2].includes('0.48') ? [[frac(1, 3), -48], [frac(1, 10), -100]] : [[frac(1, 10), -100], [frac(1, 100), -200], [frac(1, 1000), -300]]), strict = d.bool();
        const ratio = Tg[1] / F[1], ans = strict ? Math.floor(ratio + 1e-9) + 1 : Math.ceil(ratio - 1e-9);
        if (ans > 60) return null;
        return N(`어떤 거름 장치를 한 번 통과할 때마다 물속에 남은 불순물의 양이 통과하기 전의 ${F[0]}배가 된다. 물속에 남은 불순물의 양이 처음 양의 ${Tg[0]} ${strict ? '미만' : '이하'}가 되려면 이 장치를 최소 몇 번 통과해야 하는가? (단, ${F[2]}으로 계산한다.)`.replace(`${F[2]}으로`, jj(F[2], '으로/로')), ans, {
          unit: '번', explain: `${V('n')}번 통과하면 남은 양은 처음 양의 (${F[0]})${sup(V('n'))}배이다. 양변에 상용로그를 취하면 ${V('n')} × (${MINUS}${Math.abs(F[1]) / 100}) ${strict ? '&lt;' : '≤'} ${MINUS}${Math.abs(Tg[1]) / 100}이고, 음수로 나누면 ${V('n')} ${strict ? '&gt;' : '≥'} ${Number((Tg[1] / F[1]).toFixed(2))}이다. 따라서 최소 ${ans}번 통과해야 한다.`,
          facts: { calc: [[`${ans}`, 0]], derived: [ans] } });
      }
      const [r, lr] = d.pick([['1.05', '0.0212'], ['1.1', '0.0414'], ['1.2', '0.0792']]), [tv, lt] = d.pick([[2, '0.3010'], [3, '0.4771']]), ans = Math.ceil(Number(lt) / Number(lr) - 1e-9);
      return N(`어느 물건의 가격이 해마다 ${Math.round((Number(r) - 1) * 100)} %씩 오른다고 한다. 이 물건의 가격이 처음으로 지금 가격의 ${tv}배 이상이 되는 것은 몇 년 후인가? (단, ${is(lg(null, tv), lt)}, ${jj(is(lg(null, r), lr), '으로/로')} 계산한다.)`, ans, {
        unit: '년', explain: `${V('n')}년 후의 가격은 지금의 ${r}${sup(V('n'))}배이다. ${r}${sup(V('n'))} ≥ ${tv}의 양변에 상용로그를 취하면 ${V('n')} × ${lr} ≥ ${lt}, ${V('n')} ≥ ${Number((Number(lt) / Number(lr)).toFixed(2))}이다. 따라서 처음으로 ${tv}배 이상이 되는 것은 ${ans}년 후이다.`,
        facts: { calc: [[`${ans}`, 0]], derived: [ans] } });
    }, { count: 3 }),
    T('life-model-log', '로그 모형에 대입해 값 구하기', '②38', (d) => {
      const c = d.pick([10, 20]), b = d.pick([2, 3]), x0 = d.pick([50, 100, 200]), e = d.int(2, 5), xv = x0 * b ** e;
      if (xv > 9999) return null;
      return N(`실험실에서 어떤 미생물 ${x0}마리를 기르기 시작하여 ${Tv}시간 후의 미생물의 수를 ${X}마리라 하면 ${is(Tv, `${c}${LG(b, frac(X, x0))}`)}인 관계가 성립한다고 한다. 기르기 시작한 지 ${c * e}시간 후 이 미생물은 몇 마리인가?`, xv, {
        unit: '마리', explain: `${is(c * e, `${c}${LG(b, frac(X, x0))}`)}에서 ${is(LG(b, frac(X, x0)), e)}, ${is(frac(X, x0), b ** e)}이므로 ${is(X, xv)}이다.`,
        facts: { calc: [[`${x0}*${b}**(${c * e}/${c})`, 0]] } });
    }),
    T('life-const', '지수 모형의 상수를 거쳐 다른 때의 값 구하기', '②39', (d) => {
      const [R, rv, root, cc, A] = d.pick([[20, 5, '2.24', 2, 50], [8, 2, '1.41', 2, 25], [12, 3, '1.73', 2, 25], [18, 2, '1.41', 3, 50]]), t1 = d.pick([4, 6, 10]), t2 = t1 * 3 / 2;
      const V1 = A * R, ans = Math.round(A * R * cc * Number(root));
      return N(`어느 도시에 자전거 대여소가 처음 생기고 ${Tv}년이 지난 후 대여 자전거의 수를 ${V('T')}라 하면 ${is(V('T'), `${A}${Kv}${sup(Tv)}`)}(${jj(Kv, '은/는')} 상수)인 관계가 성립한다고 한다. ${t1}년이 지난 후 대여 자전거의 수가 ${V1}일 때, ${t2}년이 지난 후 대여 자전거의 수는? (단, ${jj(is(rt(rv), root), '으로/로')} 계산한다.)`, ans, {
        explain: `${is(`${A}${Kv}${sup(t1)}`, V1)}에서 ${is(`${Kv}${sup(t1)}`, R)}이다. ${Kv}${sup(t2)} = (${Kv}${sup(t1)})${sup(frac(3, 2))} = ${R}${rt(R)} = ${R} × ${cc}${rt(rv)}이므로 구하는 수는 ${A} × ${R} × ${cc} × ${root} = ${ans}이다.`,
        facts: { calc: [[`${V1}*${cc}*${Math.round(Number(root) * 100)}/100`, 0]], derived: [cc, Math.round(Number(root) * 100), 100] } });
    })
  ];

  B.addGroup('11-1-2', { id: 'logg', title: '로그함수의 뜻과 그래프', standard: S7, types: logg });
  B.addGroup('11-1-2', { id: 'logs', title: '로그함수의 그래프의 이동', standard: S7, types: logs });
  B.addGroup('11-1-2', { id: 'logm', title: '로그함수의 대소 관계와 최대·최소', standard: S7, types: logm });
  B.addGroup('11-1-2', { id: 'loge', title: '로그방정식과 로그부등식', standard: S8, types: loge });
  B.addGroup('11-1-2', { id: 'both', title: '지수함수와 로그함수의 그래프와 도형', standard: S7, types: both });
  B.addGroup('11-1-2', { id: 'life', title: '지수함수와 로그함수의 활용', standard: S8, types: life });
})(typeof window !== 'undefined' ? window : globalThis);
