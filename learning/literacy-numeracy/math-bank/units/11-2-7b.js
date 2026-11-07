// 고등학교 미적분Ⅰ Ⅲ-2 정적분의 활용 — 뒤쪽 묶음(넓이로 상수 구하기와 넓이의 관계, 위치와 위치의 변화량, 움직인 거리, 속도 그래프 읽기,
// 쏘아 올린 물체와 멈추는 운동, 두 점의 운동과 실생활). 단원 틀·싣는 기준·뺀 것과 까닭은 11-2-7a.js 머리에 적었다. 도구는 11-2-7a.js 가 내보낸 B.kit.u27x 를 쓴다.
// ref: ①n = 이 단원 기본꼴_1의 n번.
//  - 운동은 모두 수직선(직선 궤도·연직 방향) 위의 운동이다(교육과정 해설: 직선 운동에 한하여 다룬다).
//  - 시각 t에서의 위치는 (처음 위치) + ∫₀ᵗ v(t)dt, 위치의 변화량은 ∫ₐᵇ v(t)dt, 움직인 거리는 ∫ₐᵇ |v(t)|dt — 위치·변화량은 부호 단추를 달아 받고,
//    움직인 거리·높이는 단추 없이 받는다. 연직으로 쏘아 올린 물체의 속도는 원문처럼 v(t) = v₀ − 10t 로 적는다.
//  - 속도 그래프는 꺾은선(vGraph)이다. 꼭짓점에서 두 축으로 점선을 긋고 눈금에 시각·속도를 적는다. 원문 그림이 없는 평가지 문항(중9·중10)은
//    풀이의 넓이 식과 맞게 그래프를 새로 지었다(대조표에 「그림 새로 지음」).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, N, M, C, NAMES, name, lines, josa } = B.kit;
  const { MINUS, Q, qadd, qsub, qmul, qdiv, qneg, qabs, qcmp, isInt, fl, tx, nb, V, sup, poly, js, nz, sys } = B.kit.mid;
  const { ms, intg, evl, jh, qAns, plot, plainOf, sub } = B.kit.hs;
  const K = B.kit.u27x;
  const { S5, S6, T, qq, P, Z, padd, pneg, psub, pmul, pscale, fromRoots, pval, pint, dint, pdiff, deg, small, pieces, absArea, X, TT, YY, ptx, yEq, num, xEq, tEq, vEq, jsq, facText, I, intJs, absJs, kind, ansQ, polyline, vGraph } = K;
  const tv = (v) => ptx(v, TT);
  const It = (lo, hi, v) => I(lo, hi, v, TT);
  const startText = (x0) => (qq(x0).p === 0 ? '원점을' : `좌표가 ${num(x0)}인 점을`);
  const posAt = (x0, v, t) => qadd(qq(x0), dint(v, 0, t));
  const sumQ = (list) => list.reduce(qadd, Z);
  // 속도의 부호가 바뀌는 시각(정수 근)
  const tRoots = (v, lo, hi) => { const out = []; for (let t = lo; t <= hi; t += 1) if (pval(v, t).p === 0) out.push(t); return out; };

  // ═══ 넓이로 상수 구하기와 넓이의 관계 ═══
  const rel = [
    T('rel-coef', '두 곡선으로 둘러싸인 넓이가 주어질 때 상수 구하기', '①19', (d) => {
      if (d.bool()) {
        // 곡선 y = x² + bx 와 직선 y = mx: 넓이 |m − b|³/6
        const b = d.int(-3, 2), t = d.pick([2, 3, 4, 5, 6]), m = b + t;
        if (m <= 0 || b - t > 0) return null;
        const S = Q(t ** 3, 6), cur = P(0, b, 1);
        const mb = poly([[1, V('m')], [-b, '']]);
        return N(`곡선 ${jh(yEq(cur), '과/와')} 직선 ${jh(nb(`${YY} = ${V('m')}${X}`), '으로/로')} 둘러싸인 도형의 넓이가 ${num(S)}일 때, 양수 ${V('m')}의 값은?`, m, {
          explain: `${nb(`${ptx(cur)} = ${V('m')}${X}`)}에서 ${xEq(0)} 또는 ${nb(`${X} = ${mb}`)}이다. 포물선과 직선 사이의 넓이는 ${nb(`${frac(1, 6)}|${mb}|${sup(3)}`)}이므로 ${nb(`|${mb}|${sup(3)} = ${t ** 3}`)}, ${nb(`${mb} = ±${t}`)}이다. ${V('m')}의 값은 ${num(b + t)} 또는 ${num(b - t)}이고 양수인 것은 ${m}이다.`,
          facts: { value: `${b < 0 ? '(-' + (-b) + ')' : b}+(6*${S.p}/${S.q})**(1/3)`, rule: 'line' } });
      }
      const a = d.pick([2, 3, 4, 5]), p = d.int(1, 4), S = Q(a ** 3, 3);
      const c1 = P(0, p, -1), c2t = nb(`${YY} = ${X}${sup(2)} ${MINUS} (2${V('a')} ${MINUS} ${p})${X}`);
      return N(`두 곡선 ${yEq(c1)}, ${jh(c2t, '으로/로')} 둘러싸인 도형의 넓이가 ${num(S)}일 때, 양수 ${V('a')}의 값은?`, a, {
        explain: `두 식의 차는 ${nb(`(${ptx(c1)}) ${MINUS} {${X}${sup(2)} ${MINUS} (2${V('a')} ${MINUS} ${p})${X}} = ${MINUS}2${X}${sup(2)} + 2${V('a')}${X} = ${MINUS}2${X}(${X} ${MINUS} ${V('a')})`)}이므로 두 곡선은 ${xEq(0)}, ${nb(X + ' = ' + V('a'))}에서 만난다. 넓이는 ${intg(0, 'a', '(-2x^2 + 2ax)', 'x')} = ${frac(ms('a^3'), 3)}이므로 ${nb(`${ms('a^3')} = ${a ** 3}`)}, ${nb(V('a') + ' = ' + a)}이다.`,
        facts: { value: `(3*${S.p}/${S.q})**(1/3)`, rule: 'two' } });
    }),
    T('rel-window', '두 직선 x = −k, x = k 사이 곡선과 직선의 넓이로 상수 구하기', '①20', (d) => {
      const k = d.pick([1, 1, 2]), a = k + d.int(1, 5), S = a * k * k;
      return N(`곡선 ${jh(nb(`${YY} = ${X}${sup(2)}`), '과/와')} 직선 ${nb(`${YY} = ${V('a')}${X}`)} 및 두 직선 ${xEq(-k)}, ${jh(xEq(k), '으로/로')} 둘러싸인 도형의 넓이가 ${S}일 때, 상수 ${V('a')}의 값은? ${nb(`(단, ${V('a')} &gt; ${k})`)}`, a, {
        explain: `곡선과 직선의 교점의 ${X}좌표는 0, ${V('a')}이고 ${nb(`${V('a')} &gt; ${k}`)}이므로 닫힌구간 [${num(-k)}, 0]에서 ${nb(`${X}${sup(2)} ≥ ${V('a')}${X}`)}, [0, ${k}]에서 ${nb(`${V('a')}${X} ≥ ${X}${sup(2)}`)}이다. 넓이는 ${intg(-k, 0, '(x^2 - ax)', 'x')} + ${intg(0, k, '(ax - x^2)', 'x')} = ${nb(`${k === 1 ? '' : k * k}${V('a')}`)}이므로 ${nb(V('a') + ' = ' + a)}이다.`,
        facts: { value: `${S}/${k}**2` } });
    }),
    T('rel-ratio', 'x축 위·아래로 나뉜 두 부분의 넓이의 비', '①24', (d) => {
      const b = d.int(2, 3), m = d.int(1, 3), cur = P(0, -b, 1), line = P(0, m), w = b + m;
      const S2 = Q(b ** 3, 6), S1 = qsub(Q(w ** 3, 6), S2), R = qdiv(S2, S1);
      const yt = m * w, ylo = -(b * b) / 4, ux = Math.min(44, 224 / (w + 1.4)), ys = Math.min(1, 200 / ((yt + 1.2 - ylo) * ux));
      if ((b * b / 4) * ux * ys < 26) return null;                                   // 아래 부분이 너무 얇으면 S₂ 글씨가 들어가지 않는다
      const fc = (x) => x * x - b * x, figure = plot({ x: [-0.6, w + 0.8], y: [Math.min(-0.8, ylo - 0.6), yt + 1.2], u: ux, ys,
        fill: [{ f: (x) => m * x, g: (x) => Math.max(fc(x), 0), from: 0, to: w }, { f: () => 0, g: fc, from: 0, to: b, color: 'rgba(180,35,24,0.18)' }],
        curves: [{ f: fc, from: -0.4, to: w + 0.5, name: K.svgEq(cur) }],
        lines: [{ a: m, b: 0, name: `y=${m === 1 ? '' : m}x` }],
        texts: [{ x: w * 0.55, y: (m * w * 0.55 + Math.max(fc(w * 0.55), 0)) / 2 - 0.15 * m * w, t: 'S_1', side: 'u' }, { x: b / 2 - 13 / ux, y: fc(b / 2) * 0.55, t: 'S_2', side: 'r' }] });
      return ansQ(`그림과 같이 곡선 ${jh(yEq(cur), '과/와')} 직선 ${jh(yEq(line), '으로/로')} 둘러싸인 도형에서 ${X}축의 위쪽에 있는 부분의 넓이를 ${V('S')}${sub(1)}, 아래쪽에 있는 부분의 넓이를 ${V('S')}${sub(2)}라 할 때, ${frac(V('S') + sub(2), V('S') + sub(1))}의 값은?`, R, {
        figure,
        explain: `곡선과 직선의 교점의 ${X}좌표는 0, ${w}이다. ${V('S')}${sub(2)}는 곡선과 ${X}축으로 둘러싸인 부분이므로 ${MINUS}${I(0, b, cur)} = ${num(S2)}이고, ${nb(`${V('S')}${sub(1)} + ${V('S')}${sub(2)}`)} = ${I(0, w, psub(line, cur))} = ${num(Q(w ** 3, 6))}이므로 ${nb(`${V('S')}${sub(1)} = ${num(S1)}`)}이다. 따라서 구하는 값은 ${num(R)}이다.`,
        facts: { value: `(${b}**3/6)/(${w}**3/6-${b}**3/6)` } });
    })
  ];

  // ═══ 위치와 위치의 변화량 ═══
  const randV = (d, quad) => (quad ? P(d.int(-6, 6), d.int(-4, 4), nz(d, -3, 3)) : P(d.int(-6, 6), nz(d, -4, 4)));
  const pos = [
    T('pos-at', '처음 위치와 속도로 어느 시각의 위치 구하기', '①28', (d) => {
      const x0 = d.pick([0, 0, d.int(-4, 5)]), v = randV(d, d.bool()), t = d.int(1, 5), X1 = posAt(x0, v, t);
      if (!kind(X1, 'int') || Math.abs(fl(X1)) > 60) return null;
      return ansQ(`${startText(x0)} 출발하여 수직선 위를 움직이는 점 P의 시각 ${TT}에서의 속도가 ${vEq(v)}일 때, 시각 ${tEq(t)}에서의 점 P의 위치는?`, X1, {
        signed: true,
        explain: `시각 ${tEq(0)}에서의 위치가 ${num(x0)}이므로 시각 ${tEq(t)}에서의 위치는 ${nb(`${num(x0)} + `)}${It(0, t, v)} = ${nb(`${num(x0)} + ${dint(v, 0, t).p < 0 ? '(' + num(dint(v, 0, t)) + ')' : num(dint(v, 0, t))}`)} = ${num(X1)}이다.`,
        facts: { value: `${jsq(x0)}+${intJs(v, 0, t)}` } });
    }),
    T('pos-change', '시각 t = a에서 t = b까지 위치의 변화량', '①29', (d) => {
      const v = randV(d, d.bool()), a = d.int(0, 3), b = a + d.int(1, 3), D = dint(v, a, b);
      if (!kind(D, 'int') || D.p === 0) return null;
      return ansQ(`수직선 위를 움직이는 점 P의 시각 ${TT}에서의 속도가 ${vEq(v)}일 때, 시각 ${tEq(a)}에서 ${tEq(b)}까지 점 P의 위치의 변화량은?`, D, {
        signed: true,
        explain: `위치의 변화량은 ${It(a, b, v)} = ${num(D)}이다(속도의 부호가 바뀌어도 그대로 적분한다).`,
        facts: { value: intJs(v, a, b) } });
    }),
    T('pos-back', '다른 시각의 위치로 처음 위치를 거꾸로 구해 위치 구하기', '①30', (d) => {
      const v = randV(d, d.bool()), x0 = d.int(-5, 6), t1 = d.int(1, 3), t2 = t1 + d.int(1, 3), X1 = posAt(x0, v, t1), X2 = posAt(x0, v, t2);
      if (!isInt(X1) || !kind(X2, 'int') || Math.abs(fl(X2)) > 80) return null;
      return ansQ(`수직선 위를 움직이는 점 P의 시각 ${TT}에서의 속도가 ${vEq(v)}이다. 시각 ${tEq(t1)}에서의 점 P의 위치가 ${num(X1)}일 때, 시각 ${tEq(t2)}에서의 점 P의 위치는?`, X2, {
        signed: true,
        explain: `시각 ${tEq(0)}에서의 위치를 ${V('k')}라 하면 ${nb(`${V('k')} + `)}${It(0, t1, v)} = ${num(X1)}에서 ${nb(`${V('k')} = ${num(x0)}`)}이다. 따라서 시각 ${tEq(t2)}에서의 위치는 ${nb(`${num(x0)} + `)}${It(0, t2, v)} = ${num(X2)}이다.`,
        facts: { value: `${jsq(X1)}-${intJs(v, 0, t1)}+${intJs(v, 0, t2)}` } });
    }),
    T('pos-const', '위치의 변화량이 주어질 때 속도 속 상수를 구해 위치 구하기', '①31', (d) => {
      const b = d.int(-5, -1), a = d.int(-3, 8), v = P(a, b, 1), x0 = d.int(-3, 5), t1 = d.int(0, 2), t2 = t1 + d.int(2, 3), t3 = d.pick([t2, t2 + 1]);
      const D = dint(v, t1, t2), X3 = posAt(x0, v, t3);
      if (!kind(X3, 'int') || D.p === 0) return null;
      const vt = nb(`${V('v')}(${TT}) = ${ptx(P(0, b, 1), TT)} + ${V('a')}`);
      return ansQ(`${startText(x0)} 출발하여 수직선 위를 움직이는 점 P의 시각 ${TT}에서의 속도가 ${vt}이다. 시각 ${tEq(t1)}에서 ${tEq(t2)}까지 점 P의 위치의 변화량이 ${num(D)}일 때, 시각 ${tEq(t3)}에서의 점 P의 위치는? ${nb(`(단, ${V('a')}는 상수)`)}`, X3, {
        signed: true,
        explain: `${intg(t1, t2, `(t^2 ${b < 0 ? '- ' + (-b) : '+ ' + b}t + a)`, 't')} = ${num(dint(P(0, b, 1), t1, t2))} + ${t2 - t1 === 1 ? '' : t2 - t1}${V('a')} = ${num(D)}에서 ${nb(V('a') + ' = ' + num(a))}이다. 시각 ${tEq(t3)}에서의 위치는 ${nb(`${num(x0)} + `)}${It(0, t3, v)} = ${num(X3)}이다.`,
        facts: { value: `${jsq(x0)}+${intJs(P(0, b, 1), 0, t3)}+((${jsq(D)}-${intJs(P(0, b, 1), t1, t2)})/(${t2}-${t1}))*${t3}` } });
    }),
    T('pos-accel', '가속도가 주어진 값인 순간의 위치로 속도 속 상수 구하기', '①32', (d) => {
      const p = d.pick([1, 3, 3]), q = d.int(-2, 4), t0 = d.int(1, 4), k = nz(d, -12, 12), v = P(k, q, p), acc = 2 * p * t0 + q, X0 = dint(v, 0, t0);
      if (acc <= 0 || X0.p === 0) return null;
      const vt = nb(`${V('v')}(${TT}) = ${ptx(P(0, q, p), TT)} + ${V('k')}`);
      return ansQ(`원점을 출발하여 수직선 위를 움직이는 점 P의 시각 ${TT}에서의 속도가 ${vt}이다. 점 P의 가속도가 ${acc}인 순간 점 P의 위치가 ${num(X0)}일 때, 상수 ${V('k')}의 값은?`, Q(k), {
        signed: true,
        explain: `가속도는 ${nb(`${V('v')}′(${TT}) = ${ptx(P(q, 2 * p), TT)}`)}이므로 ${nb(`${ptx(P(q, 2 * p), TT)} = ${acc}`)}에서 ${tEq(t0)}이다. 시각 ${tEq(t0)}에서의 위치는 ${intg(0, t0, '(' + ptx(P(0, q, p), TT) + ' + k)', 't')} = ${num(dint(P(0, q, p), 0, t0))} + ${t0 === 1 ? '' : t0}${V('k')} = ${num(X0)}이므로 ${nb(V('k') + ' = ' + num(k))}이다.`,
        facts: { value: `(${jsq(X0)}-${intJs(P(0, q, p), 0, t0)})/${t0}` } });
    }),
    T('pos-turn', '운동 방향을 바꿀 때까지 위치의 변화량', '①33', (d) => {
      const b = d.pick([2, 4, 6]), ts = d.int(2, 6), s = d.pick([1, -1]), c = b * ts, v = s > 0 ? P(c, -b) : P(-c, b), D = dint(v, 0, ts);
      return ansQ(`원점을 출발하여 수직선 위를 움직이는 점 P의 시각 ${TT}에서의 속도가 ${vEq(v)}이다. 점 P가 시각 ${nb(`${TT} = ${V('a')}`)}에서 운동 방향을 바꿀 때, 시각 ${tEq(0)}에서 ${nb(`${TT} = ${V('a')}`)}까지 점 P의 위치의 변화량은?`, D, {
        signed: true,
        explain: `운동 방향은 속도의 부호가 바뀔 때 바뀐다. ${nb(`${tv(v)} = 0`)}에서 ${tEq(ts)}이고 이 앞뒤에서 ${V('v')}(${TT})의 부호가 바뀌므로 ${nb(V('a') + ' = ' + ts)}이다. 위치의 변화량은 ${It(0, ts, v)} = ${num(D)}이다.`,
        facts: { value: intJs(v, 0, ts) } });
    }),
    T('pos-max', '점의 좌표의 최댓값', '①34', (d) => {
      const x0 = d.int(-12, 9), c = d.pick([3, 5, 7]), v = P(c, -2), top = qadd(Q(x0), dint(v, 0, Q(c, 2)));
      return ansQ(`${startText(x0)} 출발하여 수직선 위를 움직이는 점 P의 시각 ${nb(`${TT} (${TT} ≥ 0)`)}에서의 속도가 ${vEq(v)}이다. 점 P의 좌표의 최댓값은?`, top, {
        signed: true,
        explain: `${nb(`${tv(v)} = 0`)}에서 ${nb(`${TT} = ${frac(c, 2)}`)}이다. 이때까지는 ${V('v')}(${TT}) ≥ 0이라 양의 방향으로, 그 뒤에는 음의 방향으로 움직이므로 ${nb(`${TT} = ${frac(c, 2)}`)}일 때 좌표가 가장 크다. 최댓값은 ${nb(`${num(x0)} + ${c} × ${frac(c, 2)} ${MINUS} (${frac(c, 2)})${sup(2)}`)} = ${num(top)}이다.`,
        facts: { value: `${x0 < 0 ? '(-' + (-x0) + ')' : x0}+${c}*${c}/2-(${c}/2)**2` } });
    })
  ];

  // ═══ 움직인 거리 ═══
  const dist = [
    T('dist-abs', '속도의 부호가 바뀌는 구간에서 움직인 거리', '①35', (d, n) => {
      let v, rs;
      if (n === 0) { const a = d.pick([2, 3, 4, -2, -3, -4]), r = d.int(1, 4); v = P(-a * r, a); rs = [r]; } else { const k = d.pick([1, -1, 2, -2]), r1 = d.int(0, 3), r2 = r1 + d.int(1, 4); v = fromRoots(k, [r1, r2]); rs = [r1, r2]; }
      if (!small(v, 24)) return null;
      const lo = d.int(0, rs[0] - 1 < 0 ? 0 : rs[0] - 1), hi = rs[rs.length - 1] + d.int(n === 0 ? 1 : 0, 2);
      const inside = rs.filter((r) => r > lo && r < hi);
      if (!inside.length || lo >= hi) return null;
      const L = absArea(v, lo, hi, inside);
      if (!kind(L, n === 0 ? 'int' : 'frac')) return null;
      const parts = pieces(lo, hi, inside).map(([a, b]) => (dint(v, a, b).p < 0 ? It(a, b, pneg(v)) : It(a, b, v))).join(' + ');
      const vals = pieces(lo, hi, inside).map(([a, b]) => num(qabs(dint(v, a, b))));
      return ansQ(`수직선 위를 움직이는 점 P의 시각 ${TT}에서의 속도가 ${vEq(v)}일 때, 시각 ${tEq(lo)}에서 ${tEq(hi)}까지 점 P가 움직인 거리는?`, L, {
        explain: `${nb(`${tv(v)} = 0`)}에서 ${TT} = ${inside.join(', ')}이고 그 앞뒤에서 속도의 부호가 바뀐다. 움직인 거리는 ${intg(lo, hi, '|' + tv(v) + '|', 't')} = ${parts} = ${vals.length > 1 ? vals.join(' + ') + ' = ' : ''}${num(L)}이다.`,
        facts: { value: absJs(v, lo, hi, inside), rule: n === 0 ? 'linear' : 'quad' } });
    }, { count: 2 }),
    T('dist-const', '위치가 주어질 때 속도 속 상수를 구해 움직인 거리 구하기', '①36', (d) => {
      const Tm = d.pick([3, 4, 5, 6]), k = -d.int(1, Tm - 1), v = P(0, k, 1), X1 = dint(v, 0, Tm), L = absArea(v, 0, Tm, [-k]);
      if (!kind(L, 'int')) return null;
      const vt = nb(`${V('v')}(${TT}) = ${TT}${sup(2)} + ${V('k')}${TT}`);
      return ansQ(`원점을 출발하여 수직선 위를 움직이는 점 P의 시각 ${TT}에서의 속도가 ${vt}이다. 시각 ${tEq(Tm)}에서의 점 P의 위치가 ${num(X1)}일 때, 시각 ${tEq(0)}에서 ${tEq(Tm)}까지 점 P가 움직인 거리는? ${nb(`(단, ${V('k')}는 상수)`)}`, L, {
        explain: `${intg(0, Tm, '(t^2 + kt)', 't')} = ${num(Q(Tm ** 3, 3))} + ${num(Q(Tm * Tm, 2))}${V('k')} = ${num(X1)}에서 ${nb(V('k') + ' = ' + num(k))}이므로 ${vEq(v)}이다. ${tEq(-k)}에서 속도의 부호가 바뀌므로 움직인 거리는 ${It(0, -k, pneg(v))} + ${It(-k, Tm, v)} = ${num(L)}이다.`,
        facts: { value: absJs(v, 0, Tm, [-k]) } });
    }),
    T('dist-vs-disp', '위치의 변화량과 움직인 거리 가르기', '①37', (d, n) => {
      if (n === 0) {
        const c = d.pick([2, 3, 4]), Tm = d.pick([4, 6]), k = Q(2 * c, Tm), v = P(c, qneg(k)), L = c * Tm / 2;
        const names = d.shuffle(NAMES).slice(0, 3), wrong = d.int(0, 2);
        const claims = [
          [`속도를 적분하면 ${intg(0, Tm, '(' + tv(v) + ')', 't')} = 0이므로 점 P가 움직인 거리는 0이야.`, `${intg(0, Tm, '(' + tv(v) + ')', 't')} = 0이므로 시각 ${tEq(Tm)}에서 점 P는 출발점에 있어.`],
          [`그림에서 색칠한 두 부분의 넓이를 더한 ${josa(L, '이/가')} 점 P가 움직인 거리야.`, `그림에서 색칠한 두 부분의 넓이를 뺀 0이 점 P가 움직인 거리야.`],
          [`점 P는 시각 ${tEq(Tm / 2)}에서 운동 방향을 바꿔.`, `점 P는 시각 ${tEq(Tm)}까지 운동 방향을 바꾸지 않아.`]
        ];
        // 맨 앞 주장의 틀린 꼴이 원문(움직인 거리를 0이라 한 학생)이다. 하나만 틀리게 고른다.
        const said = claims.map((pair, i) => (i === wrong ? (i === 0 ? pair[0] : pair[1]) : (i === 0 ? pair[1] : pair[0])));
        const truth = said.map((_, i) => i !== wrong);
        const figure = vGraph([[0, c], [Tm, -c]], { tt: [Tm / 2, Tm], vt: [c, -c], fill: [{ f: polyline([[0, c], [Tm, -c]]), from: 0, to: Tm }], vguide: true });
        return C(`원점을 출발하여 수직선 위를 움직이는 점 P의 시각 ${TT}에서의 속도가 ${vEq(v)}이다. 시각 ${tEq(0)}에서 ${tEq(Tm)}까지의 운동에 대한 세 학생의 말 가운데 잘못 말한 학생은?<br>${names.map((nm, i) => `${nm}: ${said[i]}`).join('<br>')}`, names, wrong, {
          figure,
          explain: `${intg(0, Tm, '(' + tv(v) + ')', 't')} = 0은 위치의 변화량이므로 시각 ${tEq(Tm)}에서 점 P는 출발점에 있다. 움직인 거리는 ${intg(0, Tm, '|' + tv(v) + '|', 't')}로 두 부분의 넓이를 더한 ${L}이고, 속도의 부호가 ${tEq(Tm / 2)}에서 바뀌므로 그때 운동 방향을 바꾼다. 따라서 ${name(names[wrong], '이/가')} 잘못 말했다.`,
          facts: { truth, want: false } });
      }
      const k = d.pick([2, 4]), r = d.int(1, 4), Tm = r + d.int(1, 3), c = k * r, v = P(c, -k), D = dint(v, 0, Tm), L = absArea(v, 0, Tm, [r]);
      if (2 * r === Tm) return null;
      return M(`원점을 출발하여 수직선 위를 움직이는 점 P의 시각 ${TT}에서의 속도가 ${vEq(v)}일 때, 시각 ${tEq(0)}에서 ${tEq(Tm)}까지 점 P의 위치의 변화량과 움직인 거리를 차례로 구하시오.`, [
        { label: '위치의 변화량', answer: D.p, signed: true }, { label: '움직인 거리', answer: L.p }], {
        explain: `위치의 변화량은 ${It(0, Tm, v)} = ${num(D)}, 움직인 거리는 ${tEq(r)}에서 나누어 ${It(0, r, v)} + ${It(r, Tm, pneg(v))} = ${num(L)}이다.`,
        facts: { calc: [[`${c}*${Tm}-${k}*${Tm}**2/2`, 0], [`${k}*${r}**2/2+${k}*(${Tm}-${r})**2/2`, 1]] } });
    }, { count: 2 }),
    T('dist-piece', '시간에 따라 식이 바뀌는 속도 — 어느 시각의 높이', '①38', (d) => {
      const a = d.pick([2, 3]), bb = d.pick([2, 3, 4]), t1 = d.pick([5, 10]), c = (a + bb) * t1, Tm = t1 + d.pick([5, 10]), t2 = Tm + 5;
      const v1 = P(0, a), v2 = P(c, -bb), Hh = qadd(dint(v1, 0, t1), dint(v2, t1, Tm)), Hend = qadd(dint(v1, 0, t1), dint(v2, t1, t2));
      if (!isInt(Hh) || Hh.p <= 0 || Hend.p < 0) return null;
      return N(`지면에 정지해 있던 열기구가 지면과 수직인 방향으로 출발한 지 ${TT}분 후의 속도 ${V('v')}(${TT}) (m/분)가 ${nb(`${V('v')}(${TT}) = ${sys([`${tv(v1)} ${nb(`(0 ≤ ${TT} ≤ ${t1})`)}`, `${tv(v2)} ${nb(`(${t1} ≤ ${TT} ≤ ${t2})`)}`])}`)}이다. 열기구가 출발한 지 ${Tm}분 후 지면으로부터의 높이는 몇 m인가?`, Hh.p, {
        unit: 'm',
        explain: `높이는 ${It(0, t1, v1)} + ${It(t1, Tm, v2)} = ${num(dint(v1, 0, t1))} + ${dint(v2, t1, Tm).p < 0 ? '(' + num(dint(v2, t1, Tm)) + ')' : num(dint(v2, t1, Tm))} = ${Hh.p} (m)이다(${t1}분 뒤의 식으로 이어서 적분한다).`,
        facts: { value: `${intJs(v1, 0, t1)}+${intJs(v2, t1, Tm)}` } });
    })
  ];

  // ═══ 속도 그래프 읽기 ═══
  // 꺾은선의 넓이: 구간 [a, b]에서 ∫v(부호 있는 값)와 ∫|v| — 꼭짓점과 영점에서 나눈 사다리꼴·삼각형의 넓이(유리수)
  function lineArea(pts, a, b, abs) {
    const cut = [];
    for (let i = 1; i < pts.length; i += 1) { const [t0, v0] = pts[i - 1], [t1, v1] = pts[i]; cut.push([t0, v0]); if (v0 * v1 < 0) cut.push([t0 + (t1 - t0) * (-v0) / (v1 - v0), 0]); }
    cut.push(pts[pts.length - 1]);
    const f = polyline(pts); let s = Z;
    for (let i = 1; i < cut.length; i += 1) {
      const lo = Math.max(a, cut[i - 1][0]), hi = Math.min(b, cut[i][0]);
      if (hi <= lo) continue;
      const va = f(lo), vb = f(hi), seg = Q(Math.round((va + vb) * (hi - lo) * 1000), 2000);
      s = qadd(s, abs ? qabs(seg) : seg);
    }
    return s;
  }
  const vtTicks = (vals) => [...new Set(vals)].filter((v) => v !== 0).sort((p, q) => p - q);
  const vgraph = [
    T('vg-area', '속도 그래프의 넓이로 위치·움직인 거리 구하기', '①40', (d, n) => {
      if (n === 0) {
        const t1 = d.int(1, 2), t2 = t1 + d.int(0, 2), t3 = t2 + d.int(1, 3), t4 = t3 + d.int(1, 2), t5 = t4 + d.int(1, 2), h = d.int(2, 4), k = d.int(1, 3);
        const pts = [[0, 0], [t1, h], [t2, h], [t3, 0], [t4, -k], [t5, 0]].filter((p, i, a) => i === 0 || p[0] !== a[i - 1][0]);
        const s = d.int(1, t2), A = lineArea(pts, 0, t3, false), Lw = lineArea(pts, s, t5, true);
        if (!isInt(A) || !isInt(Lw) || t5 > 9) return null;
        const figure = vGraph(pts, { tt: vtTicks(pts.map((p) => p[0])), vt: vtTicks([h, -k]) });
        return M(`원점을 출발하여 수직선 위를 움직이는 점 P의 시각 ${TT}에서의 속도 ${V('v')}(${TT})의 그래프가 그림과 같을 때, 다음을 구하시오. ${nb(`(단, 0 ≤ ${TT} ≤ ${t5})`)}<br>⑴ 점 P가 출발한 후 처음으로 운동 방향을 바꿀 때의 점 P의 위치<br>⑵ 시각 ${tEq(s)}에서 ${tEq(t5)}까지 점 P가 움직인 거리`, [
          { label: '⑴', answer: A.p, signed: true }, { label: '⑵', answer: Lw.p }], {
          figure,
          explain: `⑴ 처음으로 운동 방향을 바꾸는 때는 ${V('v')}(${TT})의 부호가 바뀌는 ${tEq(t3)}이고, 그때의 위치는 0부터 ${t3}까지 그래프와 ${TT}축 사이의 넓이 ${num(A)}이다. ⑵ 움직인 거리는 ${tEq(s)}부터 ${tEq(t5)}까지 ${TT}축의 위·아래 넓이를 모두 더한 ${num(Lw)}이다.`,
          facts: { calc: [[`${2 * A.p}/2`, 0], [`${2 * Lw.p}/2`, 1]] } });
      }
      // 중9: 풀이 「1/2 × 4 × 2」에 맞춰 지은 삼각형 하나의 그래프
      const Tm = d.pick([4, 6]), h = d.pick([2, 3, 4]), peak = d.int(1, Tm - 1), s = d.pick([1, -1]), pts = [[0, 0], [peak, s * h], [Tm, 0]], L = Tm * h / 2;
      const figure = vGraph(pts, { tt: vtTicks([peak, Tm]), vt: [s * h] });
      return N(`원점을 출발하여 수직선 위를 움직이는 점 P의 시각 ${TT}에서의 속도 ${V('v')}(${TT})의 그래프가 그림과 같을 때, 시각 ${tEq(0)}에서 ${tEq(Tm)}까지 점 P가 움직인 거리는?`, L, {
        figure,
        explain: `움직인 거리는 ${intg(0, Tm, '|v(t)|', 't')}로, 그래프와 ${TT}축으로 둘러싸인 삼각형의 넓이 ${nb(`${frac(1, 2)} × ${Tm} × ${h}`)} = ${L}이다.`,
        facts: { value: `${Tm}*${h}/2` } });
    }, { count: 2 }),
    T('vg-claims', '속도 그래프에서 옳은 것 고르기', '①41', (d, n) => {
      const marks = ['ㄱ', 'ㄴ', 'ㄷ'];
      let pts, x0, cl;
      if (n === 0) {
        // 대13: 속력이 가장 큰 때, 방향을 바꾼 횟수, 끝 시각의 위치
        x0 = d.int(2, 6);
        const v0 = -d.int(1, 2), v1 = -d.int(2, 3), r = d.int(2, 3), v3 = d.int(1, 2);
        if (v1 >= v0 || v3 >= -v1) return null;
        pts = [[0, v0], [1, v1], [r + 1, 0], [r + 2, v3], [r + 3, 0]];
        const tEnd = r + 3, Xend = qadd(Q(x0), lineArea(pts, 0, tEnd, false));
        const sp = pts.map(([t, v]) => [t, Math.abs(v)]), best = sp.reduce((m, p) => (p[1] > m[1] ? p : m));
        const tSay = d.bool() ? best[0] : r + 2, turns = 1, sayTurns = d.bool() ? 1 : 2, Xsay = d.bool() ? Xend : qadd(Xend, Q(d.pick([1, -1]) * d.int(1, 2)));
        cl = [[`점 P의 속력은 ${tEq(tSay)}일 때 가장 크다.`, tSay === best[0] && sp.filter((p) => p[1] === best[1]).length === 1],
          [`점 P는 출발 후 운동 방향을 ${sayTurns === 1 ? '한' : '두'} 번 바꿨다.`, sayTurns === turns],
          [`시각 ${tEq(tEnd)}에서의 점 P의 위치는 ${num(Xsay)}이다.`, qcmp(Xsay, Xend) === 0]];
        if (cl.every((c) => !c[1])) return null;
        const figure = vGraph(pts, { tt: vtTicks(pts.map((p) => p[0])), vt: vtTicks(pts.map((p) => p[1])) });
        return pickClaims(d, `좌표가 ${x0}인 점을 출발하여 수직선 위를 움직이는 점 P의 시각 ${TT}에서의 속도 ${V('v')}(${TT})의 그래프가 그림과 같을 때, 보기에서 옳은 것만을 있는 대로 고른 것은? ${nb(`(단, 0 ≤ ${TT} ≤ ${tEnd})`)}`, figure, cl, marks,
          `속력은 ${nb(`|${V('v')}(${TT})|`)}이므로 ${tEq(best[0])}일 때 가장 크다. 속도의 부호는 ${tEq(r + 1)}에서 한 번 바뀐다. 시각 ${tEq(tEnd)}에서의 위치는 ${x0} + (넓이의 부호를 붙인 합) = ${num(Xend)}이다.`);
      }
      // 중10(그림 새로 지음): 3초 동안 움직인 거리, 방향을 바꾼 횟수, 출발점으로 돌아오는 때
      const h1 = d.int(1, 3), h2 = d.int(1, 3), a1 = 2, a2 = 4, h3 = d.int(1, 3);
      pts = [[0, 0], [1, h1], [a1, 0], [3, -h2], [a2, 0], [5, h3], [6, h3], [7, 0]];
      const dist3 = lineArea(pts, 0, 3, true), disp3 = lineArea(pts, 0, 3, false), back = lineArea(pts, 0, a2, false).p === 0;
      const sayDist = d.bool() ? dist3 : disp3, sayTurns = d.pick([2, 2, 3]);
      cl = [[`점 P가 출발하고 3초 동안 움직인 거리는 ${num(sayDist)}이다.`, qcmp(sayDist, dist3) === 0],
        [`점 P의 운동 방향은 출발 후 ${tEq(7)}일 때까지 ${sayTurns === 2 ? '두' : '세'} 번 바뀐다.`, sayTurns === 2],
        [`점 P는 출발하고 나서 ${a2}초 후 출발점에 있다.`, back]];
      if (qcmp(dist3, disp3) === 0 || cl.every((c) => !c[1])) return null;
      const figure = vGraph(pts, { tt: [1, 2, 3, 4, 5, 6, 7], vt: vtTicks([h1, -h2, h3]) });
      return pickClaims(d, `원점을 출발하여 수직선 위를 움직이는 점 P의 시각 ${TT}에서의 속도 ${V('v')}(${TT})의 그래프가 그림과 같을 때, 보기에서 옳은 것만을 있는 대로 고른 것은? ${nb(`(단, 0 ≤ ${TT} ≤ 7)`)}`, figure, cl, marks,
        `3초 동안 움직인 거리는 넓이를 모두 더한 ${num(dist3)}이고 위치의 변화량은 ${num(disp3)}이다. 속도의 부호는 ${tEq(2)}, ${tEq(4)}에서 두 번 바뀐다. 4초 동안의 위치의 변화량은 ${num(lineArea(pts, 0, a2, false))}이므로 ${back ? '4초 후 출발점에 있다' : '4초 후 출발점에 있지 않다'}.`);
    }, { count: 2 }),
    T('vg-param', '상수가 든 속도 그래프 — 한 시각의 위치로 다른 시각의 위치 구하기', '①42', (d) => {
      const k1 = d.pick([2, 3]), k2 = d.pick([1, 2]), k3 = d.pick([1, 2, 3]), a = d.int(1, 3);
      const shape = (s) => [[0, 0], [1, k1 * s], [2, k1 * s], [3, 0], [4, -k2 * s], [5, -k2 * s], [6, 0], [7, k3 * s]];
      const lab = (k, neg) => (neg ? '−' : '') + (k === 1 ? '' : k) + 'a';
      const pts = shape(a), P5 = lineArea(pts, 0, 5, false), P7 = lineArea(pts, 0, 7, false), unit5 = lineArea(shape(1), 0, 5, false);
      if (!isInt(P5) || !isInt(P7) || P5.p <= 0) return null;
      const named = pts.map((p, i) => [p[0], p[1], [0, lab(k1), lab(k1), 0, lab(k2, true), lab(k2, true), 0, lab(k3)][i]]);
      const figure = vGraph(named, { tt: [1, 2, 3, 4, 5, 6, 7], vt: [{ v: k1 * a, t: lab(k1) }, { v: -k2 * a, t: lab(k2, true) }].concat(k3 === k1 ? [] : [{ v: k3 * a, t: lab(k3) }]) });
      return ansQ(`원점을 출발하여 수직선 위를 움직이는 점 P의 시각 ${TT}에서의 속도 ${V('v')}(${TT})의 그래프가 그림과 같다. 시각 ${tEq(5)}에서의 점 P의 위치가 ${P5.p}일 때, 시각 ${tEq(7)}에서의 점 P의 위치는? ${nb(`(단, 0 ≤ ${TT} ≤ 7, ${V('a')} &gt; 0)`)}`, P7, {
        signed: true, figure,
        explain: `시각 ${tEq(5)}에서의 위치는 넓이에 부호를 붙여 더한 ${num(unit5)}${V('a')}이므로 ${nb(`${num(unit5)}${V('a')} = ${P5.p}`)}, ${nb(V('a') + ' = ' + a)}이다. 시각 ${tEq(7)}에서의 위치는 ${P5.p} ${MINUS} ${num(Q(k2 * a, 2))} + ${num(Q(k3 * a, 2))} = ${num(P7)}이다.`,
        facts: { value: `${P5.p}+(${P5.p}/(2*${k1}-3*${k2}/2))*(${k3}-${k2})/2` } });
    })
  ];
  // 보기 ㄱ·ㄴ·ㄷ에서 옳은 것을 모두 고른 것: 정답 조합과 다른 조합 넷을 차례대로 늘어놓는다.
  function pickClaims(d, text, figure, cl, marks, why) {
    const flags = cl.map((c) => Boolean(c[1]));
    if (!flags.some(Boolean) || flags.every(Boolean)) return null;
    const right = marks.filter((_, i) => flags[i]), key = (list) => list.join(', ');
    const all = [['ㄱ'], ['ㄴ'], ['ㄷ'], ['ㄱ', 'ㄴ'], ['ㄱ', 'ㄷ'], ['ㄴ', 'ㄷ'], ['ㄱ', 'ㄴ', 'ㄷ']];
    const others = d.shuffle(all.filter((s) => key(s) !== key(right))).slice(0, 4).map(key), options = all.filter((s) => key(s) === key(right) || others.includes(key(s)));
    const box = lines(cl.map((c, i) => '<span class="mb-tag mb-tag-short">' + marks[i] + '.</span>' + c[0]));
    return C(text, options.map(key), options.findIndex((s) => key(s) === key(right)), { figure: figure + box, explain: why + ` 따라서 옳은 것은 ${key(right)}이다.`, facts: { sets: { labels: marks, flags, options } } });
  }

  // ═══ 쏘아 올린 물체와 멈추는 운동 ═══
  // 처음 속도 v0(10의 배수), 땅에 닿는 시각 te(정수), 처음 높이 h0 = 5te² − v0·te
  const launch = (d) => { const v0 = d.pick([20, 30, 40]), te = d.int(v0 / 5, v0 / 5 + 3), h0 = 5 * te * te - v0 * te; return { v0, te, h0, v: P(v0, -10) }; };
  const vText = (v0) => `${v0} ${MINUS} 10${TT}`;
  const fromText = (h0) => (h0 === 0 ? '지면에서' : `지면으로부터 ${h0} m 높이의 건물 옥상에서`);
  const vert = [
    T('vert-height', '쏘아 올린 물체의 몇 초 후 높이', '①43', (d) => {
      const { v0, te, h0, v } = launch(d), t = d.int(1, te - 1), Hh = h0 + v0 * t - 5 * t * t;
      return N(`${fromText(h0)} ${v0} m/s의 속도로 지면과 수직으로 쏘아 올린 물체의 ${TT}초 후의 속도가 ${nb(`${V('v')}(${TT}) = ${vText(v0)}`)} ${nb('(m/s)')} ${nb(`(0 ≤ ${TT} ≤ ${te})`)}일 때, 물체를 쏘아 올린 후 ${t}초가 지났을 때 지면으로부터의 높이는 몇 m인가?`, Hh, {
        unit: 'm',
        explain: `${h0 === 0 ? '' : `처음 높이 ${h0} m에 `}${It(0, t, v)} = ${h0 === 0 ? v0 * t - 5 * t * t : josa(v0 * t - 5 * t * t, '을/를') + ' 더해'}${h0 === 0 ? '이므로' : ''} 높이는 ${Hh} m이다.`,
        facts: { value: `${h0}+${v0}*${t}-10*${t}**2/2` } });
    }),
    T('vert-dist', '쏘아 올린 물체가 몇 초 동안 움직인 거리', '①44', (d) => {
      const { v0, te, h0, v } = launch(d), top = v0 / 10, t = d.int(top + 1, te), L = v0 * v0 / 20 + 5 * (t - top) ** 2;
      return N(`${fromText(h0)} ${v0} m/s의 속도로 지면과 수직으로 쏘아 올린 물체의 ${TT}초 후의 속도가 ${nb(`${V('v')}(${TT}) = ${vText(v0)}`)} ${nb('(m/s)')} ${nb(`(0 ≤ ${TT} ≤ ${te})`)}일 때, 물체를 쏘아 올린 후 ${t}초 동안 물체가 움직인 거리는 몇 m인가?`, L, {
        unit: 'm',
        explain: `${tEq(top)}에서 속도가 0이 되어(최고 높이) 그 뒤로는 내려온다. 움직인 거리는 ${It(0, top, v)} + ${It(top, t, pneg(v))} = ${v0 * v0 / 20} + ${5 * (t - top) ** 2} = ${L} (m)이다.`,
        facts: { value: `${v0}**2/20+5*(${t}-${v0}/10)**2` } });
    }),
    T('vert-ground', '높은 곳에서 쏘아 올린 물체가 땅에 떨어질 때까지 움직인 거리', '①45', (d) => {
      const { v0, te, h0, v } = launch(d);
      if (h0 <= 0) return null;
      const L = v0 * v0 / 10 + h0;
      return N(`지면으로부터 ${h0} m 높이에서 초속 ${v0} m로 지면과 수직으로 쏘아 올린 물체의 ${TT}초 후의 속도가 ${nb(`${V('v')}(${TT}) = ${vText(v0)}`)} ${nb('(m/s)')} ${nb(`(0 ≤ ${TT} ≤ ${te})`)}이다. 이 물체가 지면에 떨어질 때까지 움직인 거리는 몇 m인가?`, L, {
        unit: 'm',
        explain: `최고 높이에 이르는 ${tEq(v0 / 10)}까지 오른 거리는 ${It(0, v0 / 10, v)} = ${v0 * v0 / 20} (m)이다. 오른 만큼 내려와 처음 높이로 돌아온 뒤 ${h0} m를 더 내려오므로 움직인 거리는 ${nb(`2 × ${v0 * v0 / 20} + ${h0}`)} = ${L} (m)이다.`,
        facts: { value: `2*${v0}**2/20+${h0}` } });
    }),
    T('vert-min', '최고 높이의 조건으로 처음 속도의 최솟값 구하기', '①46', (d) => {
      const v0 = d.pick([20, 30, 40, 50, 60]), Hh = v0 * v0 / 20;
      return N(`지면에서 ${V('a')} m/s의 속도로 지면과 수직으로 쏘아 올린 물체의 ${TT}초 후의 속도가 ${nb(`${V('v')}(${TT}) = ${V('a')} ${MINUS} 10${TT}`)} ${nb('(m/s)')}이다. 쏘아 올린 물체가 도달하는 최고 높이가 ${Hh} m 이상이 되도록 하는 양수 ${V('a')}의 최솟값은?`, v0, {
        explain: `최고 높이에서 속도가 0이므로 ${nb(`${TT} = ${frac(V('a'), 10)}`)}이고, 그때의 높이는 ${intg(0, frac(V('a'), 10), '(a - 10t)', 't')} = ${frac(ms('a^2'), 20)} (m)이다. ${nb(`${frac(ms('a^2'), 20)} ≥ ${Hh}`)}에서 ${nb(`${V('a')} ≥ ${v0}`)}이므로 최솟값은 ${v0}이다.`,
        facts: { value: `(20*${Hh})**0.5` } });
    }),
    T('vert-brake', '제동을 건 뒤 정지할 때까지 달린 거리', '①47', (d) => {
      const Tm = d.pick([4, 5, 6, 8, 10, 20]), k = d.pick(Tm === 20 ? [0.8, 1.2, 1.5] : Tm === 10 ? [1.6, 2, 2.4, 3] : [3, 4, 6]), v0 = Math.round(k * Tm * 10) / 10;
      if (!Number.isInteger(v0) || v0 > 40 || v0 < 8 || !Number.isInteger(v0 * Tm / 2)) return null;
      return N(`직선 궤도를 ${v0} m/s의 속도로 달리던 열차가 제동을 건 지 ${TT}초 후의 속도가 ${nb(`${V('v')}(${TT}) = ${v0} ${MINUS} ${k}${TT}`)} ${nb('(m/s)')} ${nb(`(0 ≤ ${TT} ≤ ${Tm})`)}이다. 제동을 건 후 이 열차가 정지할 때까지 달린 거리는 몇 m인가?`, v0 * Tm / 2, {
        unit: 'm',
        explain: `열차가 정지할 때 속도가 0이므로 ${nb(`${v0} ${MINUS} ${k}${TT} = 0`)}에서 ${tEq(Tm)}이다. 달린 거리는 ${intg(0, Tm, `(${v0} - ${k}t)`, 't')} = ${v0 * Tm / 2} (m)이다.`,
        facts: { value: `${v0}*${Tm}/2` } });
    })
  ];

  // ═══ 두 점의 운동과 실생활 ═══
  const two = [
    T('two-meet', '두 점이 다시 만나는 시각의 위치', '①48', (d) => {
      const a2 = d.pick([0, 3]), a1 = a2 + d.pick([3, 6]), b1 = d.int(-3, 3), b2 = b1 + d.pick([2, 4, 6, 8]), Tq = Q(3 * (b2 - b1), 2 * (a1 - a2));
      if (!isInt(Tq)) return null;
      const vP = P(0, b1, a1), vQ = P(0, b2, a2), t = Tq.p, Xp = dint(vP, 0, t);
      if (!isInt(Xp) || Xp.p === 0 || deg(vQ) < 1) return null;
      const vp = nb(`${V('v')}${sub('P')}(${TT}) = ${tv(vP)}`), vq = nb(`${V('v')}${sub('Q')}(${TT}) = ${tv(vQ)}`);
      return ansQ(`원점에서 동시에 출발하여 수직선 위를 움직이는 두 점 P, Q의 시각 ${TT}에서의 속도가 각각 ${vp}, ${vq}일 때, 두 점 P, Q가 다시 만나는 시각에서의 점 P의 위치는?`, Xp, {
        signed: true,
        explain: `시각 ${TT}에서의 두 점의 위치는 ${nb(`${ptx(pint(vP), TT)}`)}, ${nb(`${ptx(pint(vQ), TT)}`)}이다. 두 위치가 같으려면 ${nb(`${ptx(psub(pint(vP), pint(vQ)), TT)} = 0`)}이고 ${TT} &gt; 0인 근은 ${tEq(t)}이다. 이때 점 P의 위치는 ${num(Xp)}이다.`,
        facts: { value: intJs(vP, 0, Q(3 * (b2 - b1), 2 * (a1 - a2))) } });
    }),
    T('two-gap', '한 시각에 두 점의 좌표의 차로 속도 속 상수 구하기', '①49', (d) => {
      const p = d.pick([2, 4, 6]), q = d.int(-7, 3), x0 = d.int(1, 4), r = d.pick([1, 2, 3]), s = d.int(-8, 2), a = d.int(-4, 12), t = d.int(2, 3);
      const vP = P(q, p), vQ = P(a, s, r), XP = dint(vP, 0, t), XQ = qadd(Q(x0), dint(vQ, 0, t)), gap = qsub(XQ, XP);
      if (!isInt(XP) || !isInt(XQ) || gap.p === 0) return null;
      const vq = nb(`${ptx(P(0, s, r), TT)} + ${V('a')}`), more = gap.p > 0;
      return ansQ(`두 점 P, Q가 동시에 출발하여 수직선 위를 움직인다. 점 P는 원점에서 출발하여 시각 ${TT}에서의 속도가 ${tv(vP)}이고, 점 Q는 좌표가 ${x0}인 점에서 출발하여 시각 ${TT}에서의 속도가 ${vq}이다. 시각 ${tEq(t)}에서의 점 P의 좌표가 점 Q의 좌표보다 ${Math.abs(gap.p)}만큼 ${more ? '작을' : '클'} 때, 상수 ${V('a')}의 값은?`, Q(a), {
        signed: true,
        explain: `시각 ${tEq(t)}에서 점 P의 좌표는 ${It(0, t, vP)} = ${num(XP)}, 점 Q의 좌표는 ${nb(`${x0} + `)}${intg(0, t, '(' + vq + ')', 't')} = ${num(qadd(Q(x0), dint(P(0, s, r), 0, t)))} + ${t}${V('a')}이다. ${more ? `${nb(`${num(XP)} = (${num(qadd(Q(x0), dint(P(0, s, r), 0, t)))} + ${t}${V('a')}) ${MINUS} ${gap.p}`)}` : `${nb(`${num(XP)} = (${num(qadd(Q(x0), dint(P(0, s, r), 0, t)))} + ${t}${V('a')}) + ${-gap.p}`)}`}에서 ${nb(V('a') + ' = ' + num(a))}이다.`,
        facts: { value: `(${jsq(XP)}${more ? '+' : '-'}${Math.abs(gap.p)}-${x0}-${intJs(P(0, s, r), 0, t)})/${t}` } });
    }),
    T('two-train', '열차가 역에 정차해 늘어나는 운행 시간', '①51', (d) => {
      const vm = d.pick([20, 25, 30, 40]), t1 = d.pick([20, 30, 40, 50]), stop = d.pick([60, 80, 100]), t3 = d.pick([40, 60, 80, 100]), tot = t1 + stop + t3;
      const went = vm * (t1 + t3) / 2, full = vm * tot, extra = (full - went) / vm;
      if (full > 9999 || !Number.isInteger(went) || !Number.isInteger(extra)) return null;
      const pts = [[0, vm], [t1, 0], [t1 + stop, 0], [tot, vm]];
      const figure = vGraph(pts, { tt: [t1, t1 + stop, tot], vt: [vm], guides: true, vguide: false, segs: [{ p: [0, vm], q: [tot, vm], dash: true }] });
      return M(`직선 철로를 달리는 열차는 역에 정차하기 위해 감속하는 구간, 정차하는 구간, 다시 가속하는 구간을 빼고는 늘 최고 속도 ${vm} m/s로 달린다. 그림은 이 열차가 최고 속도로 달리다가 감속하기 시작한 순간부터 역에 정차한 뒤 다시 출발하여 최고 속도가 되는 순간까지 ${TT}초 후의 속도 ${V('v')}(${TT}) (m/s)를 나타낸 것이다. 다음을 구하시오.<br>⑴ ${tEq(0)}에서 ${tEq(tot)}까지 열차가 움직인 거리(m)<br>⑵ 정차하지 않고 최고 속도로 계속 달린다면 같은 시간 동안 움직이는 거리(m)<br>⑶ 이 역에 정차하여 늘어나는 운행 시간(초)`, [
        { label: '⑴', answer: went, unit: 'm' }, { label: '⑵', answer: full, unit: 'm' }, { label: '⑶', answer: extra, unit: '초' }], {
        figure,
        explain: `⑴ 그래프와 ${TT}축 사이의 넓이이므로 ${nb(`${frac(1, 2)} × ${t1} × ${vm} + ${frac(1, 2)} × ${t3} × ${vm}`)} = ${went} (m)이다. ⑵ ${nb(`${vm} × ${tot}`)} = ${full} (m)이다. ⑶ 정차하면 ${full - went} m를 덜 가므로 이 거리를 최고 속도로 가는 데 걸리는 ${nb(`${full - went} ÷ ${vm}`)} = ${extra}(초)만큼 늘어난다.`,
        facts: { calc: [[`${vm}*(${t1}+${t3})/2`, 0], [`${vm}*${tot}`, 1], [`(${vm}*${tot}-${vm}*(${t1}+${t3})/2)/${vm}`, 2]] } });
    })
  ];

  B.addTypes('11-2-7', 'rel', rel);
  B.addTypes('11-2-7', 'pos', pos);
  B.addTypes('11-2-7', 'dist', dist);
  B.addTypes('11-2-7', 'vgraph', vgraph);
  B.addTypes('11-2-7', 'vert', vert);
  B.addTypes('11-2-7', 'two', two);
})(typeof window !== 'undefined' ? window : globalThis);
