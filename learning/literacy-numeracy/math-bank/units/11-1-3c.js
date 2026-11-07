// 고등학교 대수 Ⅱ-1 삼각함수 — 실력 문제.
// 단원 틀·싣는 기준·뺀 것과 까닭은 11-1-3a.js 머리에 적었다. 도구는 B.kit.u13(a 파일)과 B.kit.u13b(b 파일 — 방정식·부등식의 해)를 쓴다.
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것
//  - θ가 제2사분면의 각이면 θ/3도 한 사분면에만 있다고 여긴다(일반각 360°×n 까지 3으로 나누어야 하므로 n을 3으로 나눈 나머지마다 사분면이 다르다).
//  - sin(|sin x|) = 1/2 에서 |sin x| = π/6 또는 5π/6 이라 하고, |sin x| ≤ 1 이라 5π/6 은 버려야 한다는 것을 놓친다(치환한 값의 범위).
//  - 「모든 실수 x에 대하여 (sin θ)x² + … > 0」에서 이차항의 계수가 0인 경우(sin θ = 0)를 따로 보지 않는다.
//  - 꼭짓점이 t의 범위(−1 ≤ t ≤ 1) 밖에 있는데도 최댓값을 꼭짓점의 값으로 놓는다.
//  - 그래프와 직선의 교점을 셀 때 직선이 y = ±1 을 넘어서는 곳까지만 보면 된다는 것, 원점 대칭으로 반쪽만 세면 된다는 것을 쓰지 못한다.
//  - sin nx = k 의 해의 합을 셀 때 한 주기 안의 두 해가 꼭대기의 x에 대하여 대칭이라는 것을 쓰지 못하고 해를 하나하나 구하려 한다.
//  - 위상이 낀 그래프에서 c 를 지나는 점 하나로만 구하고 c 의 범위로 하나를 고르는 것을 빠뜨린다.
// 실력에 둔 까닭: ① 문제의 장치에 함정이 있어 배운 뜻을 정확히 대야 풀리는 것, ② 세 단계 넘게 이어 생각해야 풀리는 것만 남겼다(유형마다 주석).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, N, C, inline } = B.kit;
  const { MINUS, gcd, Q, qadd, qsub, qmul, qdiv, isInt, fl, nb, V, sup, rt } = B.kit.mid;
  const { trig, jh, qAns, piAns, plot, sub } = B.kit.hs;
  const { Board, at } = B.kit.mgeo;
  const K = B.kit.u13, K2 = B.kit.u13b;
  const { S1, S2, H, TH, X, Y, Nn, AL, Av, Bv, Cv, Kv, LT, GT, rad, deg, num, jn, eq, sin, cos, tan, TF, FV, QN, quadOf, SGN, exact, pickH, pickV, pickFixed, tripleIn, qh } = K;
  const { fx, co, plusTerm, solveSet, xr, setText, keyOf, pickSet, sumOf } = K2;
  const P2 = rad(Q(1, 2)), R3 = Math.sqrt(3);
  const range4 = (k) => nb(`${rad(Q(k - 1, 2))} ${LT} ${TH} ${LT} ${rad(Q(k, 2))}`);
  const ysFor = (x, y, w) => { const ux = Math.min(44, ((w || 270) - 46) / (x[1] - x[0])); return Math.max(0.25, Math.min(1.6, 150 / ((y[1] - y[0]) * ux))); };
  const piT = (q) => { const n = Math.abs(q.p), head = (q.p < 0 ? MINUS : '') + (n === 1 ? '' : n) + 'π'; return { v: fl(q) * Math.PI, t: q.q === 1 ? head : head + '/' + q.q }; };

  const hard = [
    // ① θ 는 일반각이라 360°×n 까지 함께 나누어야 한다 — n 을 나눈 나머지마다 사분면이 갈린다.
    H('hard-angle-third', '제n사분면의 각 θ에서 θ/3, θ/2를 나타내는 동경의 자리', '①7', (d, n) => {
      const k = d.int(1, 4), m = n === 0 ? 3 : 2, quads = [];
      for (let j = 0; j < m; j += 1) quads.push(quadOf(((90 * (k - 1) + 360 * j) / m + 45 / m) * Math.PI / 180));
      const w = `${frac(TH, m)}`;
      if (n === 0) {
        const miss = [1, 2, 3, 4].find((q) => !quads.includes(q));
        return pickFixed(`각 ${TH}가 ${QN[k - 1]}의 각일 때, 각 ${w}를 나타내는 동경이 있을 수 없는 사분면은?`, QN, miss - 1, {
          explain: `${nb(`360° × ${Nn} + ${90 * (k - 1)}° ${LT} ${TH} ${LT} 360° × ${Nn} + ${90 * k}°`)}이므로 ${nb(`120° × ${Nn} + ${30 * (k - 1)}° ${LT} ${w} ${LT} 120° × ${Nn} + ${30 * k}°`)}이다. ${Nn}을 3으로 나눈 나머지가 0, 1, 2일 때 각각 ${quads.map((q) => QN[q - 1]).join(', ')}의 각이므로 동경이 있을 수 없는 사분면은 ${QN[miss - 1]}이다.` });
      }
      const pairs = [[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]], set = [...new Set(quads)].sort(), txt = (p) => `${QN[p[0] - 1]} 또는 ${QN[p[1] - 1]}`;
      const right = pairs.findIndex((p) => p[0] === set[0] && p[1] === set[1]);
      return pickH(d, `각 ${TH}가 ${QN[k - 1]}의 각일 때, 각 ${w}를 나타내는 동경이 있을 수 있는 사분면은?`, txt(pairs[right]), pairs.filter((_, i) => i !== right).map(txt), {
        explain: `${nb(`360° × ${Nn} + ${90 * (k - 1)}° ${LT} ${TH} ${LT} 360° × ${Nn} + ${90 * k}°`)}이므로 ${nb(`180° × ${Nn} + ${45 * (k - 1)}° ${LT} ${w} ${LT} 180° × ${Nn} + ${45 * k}°`)}이다. ${jh(Nn, '이/가')} 짝수일 때와 홀수일 때를 나누면 ${txt(set)}의 각이다.` });
    }, { count: 2, standard: S1 }),
    // ② 마름모의 맞은편 각 → 큰 부채꼴의 중심각 → 겹친 부분을 빼고 더하기(세 단계 넘게).
    H('hard-sector-lens', '반지름이 같은 두 원이 겹친 그림의 넓이 차', '①21', (d) => {
      const r = d.int(2, 6), th = d.pick([Q(1, 3), Q(1, 2), Q(2, 3), Q(5, 6), Q(1, 4), Q(1, 6), Q(5, 12), Q(7, 12)]), val = qmul(Q(r * r), qsub(Q(1), th));   // 3π/4 는 원 O′의 둘레가 점 O 바로 옆을 지나 이름 자리가 없어 뺐다
      if (isInt(val)) return null;
      const b = Board(), R = 62, half = 90 * fl(th), O = [0, 0], A = at(O, R, half), Bp = at(O, R, -half), O2 = [2 * R * Math.cos(half * Math.PI / 180), 0];
      b.disk(O, R).disk(O2, R).seg(O, A).seg(A, O2).seg(O2, Bp).seg(Bp, O);
      for (const p of [O, A, Bp, O2]) b.dot(p);
      // 이름은 두 원과 네 변이 지나가지 않는 자리에(두 원이 많이 겹치거나 조금 겹치면 기본 자리가 원둘레에 걸린다).
      // 선 위에 1px 간격으로 점을 찍어 두고, 글 상자(둘레 2px 여유)에 든 점이 없는 첫 자리를 고른다.
      const marks = [];
      for (const c of [O, O2]) for (let k = 0; k < 360; k += 1) marks.push(at(c, R, k));
      for (const [u, v] of [[O, A], [A, O2], [O2, Bp], [Bp, O]]) { const n = Math.ceil(Math.hypot(v[0] - u[0], v[1] - u[1])); for (let k = 0; k <= n; k += 1) marks.push([u[0] + (v[0] - u[0]) * k / n, u[1] + (v[1] - u[1]) * k / n]); }
      const place = (p, nm, dir) => {
        const w = nm.length > 1 ? 15 : 10; let best = null;
        for (const gap of [12, 15, 18, 21]) for (const off of [0, 15, -15, 30, -30, 45, -45, 60, -60, 75, -75, 90, -90]) {
          const q = at(p, gap, dir + off), n = marks.filter(([x, y]) => Math.abs(x - q[0]) < w / 2 + 2 && Math.abs(y - q[1]) < 8.5).length;
          if (!n) { b.text(q, nm); return; }
          if (!best || n < best.n) best = { q, n };
        }
        b.text(best.q, nm);
      };
      place(O, 'O', 180); place(O2, 'O′', 0); place(A, 'A', 90); place(Bp, 'B', 270);
      const figure = b.svg('반지름의 길이가 같은 두 원(중심 O, O′)이 두 점 A, B에서 만난다. 사각형 AOBO′은 마름모이다.');
      const S1h = V('S') + sub(1), S2h = V('S') + sub(2);
      return piAns(`그림과 같이 두 점 O, O′을 각각 중심으로 하고 반지름의 길이가 ${r}인 두 원이 두 점 A, B에서 만나고 ${nb(`∠AOB = ${rad(th)}`)}이다. 중심이 O인 원의 외부와 중심이 O′인 원의 내부의 공통부분의 넓이를 ${S1h}, 마름모 AOBO′의 넓이를 ${S2h}라 할 때, ${nb(`${S1h} ${MINUS} ${S2h} = □π`)}이다. □ 안에 알맞은 수는?`, val.p, val.q, { signed: false, figure,
        explain: `마름모의 맞은편 각은 같으므로 ${nb(`∠AO′B = ${rad(th)}`)}이고, 원 O′에서 마름모 바깥쪽 큰 부채꼴의 중심각은 ${nb(`2π ${MINUS} ${rad(th)}`)}이다. ${nb(`${S1h} = (큰 부채꼴) + ${S2h} ${MINUS} (부채꼴 AOB)`)}이므로 ${nb(`${S1h} ${MINUS} ${S2h} = ${frac(1, 2)} × ${r}${sup(2)} × (2π ${MINUS} ${rad(th)}) ${MINUS} ${frac(1, 2)} × ${r}${sup(2)} × ${rad(th)} = ${rad(val)}`)}이다.`,
        facts: { value: `${r}*${r}*(1-${th.p}/${th.q})` } });
    }, { standard: S1 }),
    // ② tan 으로 sin·cos → 세제곱·제곱의 차를 인수분해 → 넣기(네 단계).
    H('hard-rel-factor', 'tanθ로 sinθ, cosθ를 구해 인수분해로 줄인 식의 값', '①33', (d) => {
      const k = d.int(1, 4), { x, y, r } = tripleIn(d, k), s = Q(y, r), c = Q(x, r), minus = d.bool();
      const sc = qmul(s, c), val = minus ? qdiv(qadd(Q(1), sc), qadd(s, c)) : qdiv(qsub(Q(1), sc), qsub(s, c));
      const top = `${trig('sin', TH, 3)} ${minus ? MINUS : '+'} ${trig('cos', TH, 3)}`, bot = `${trig('sin', TH, 2)} ${MINUS} ${trig('cos', TH, 2)}`;
      return qAns(`${range4(k)}이고 ${eq(tan(TH), qh(Q(y, x)))}일 때, ${frac(top, bot)}의 값은?`, val, { signed: true,
        explain: `${QN[k - 1]}에서 ${eq(sin(TH), qh(s))}, ${eq(cos(TH), qh(c))}이다. ${nb(`${frac(top, bot)} = ${frac(minus ? `1 + ${sin(TH)}${cos(TH)}` : `1 ${MINUS} ${sin(TH)}${cos(TH)}`, minus ? `${sin(TH)} + ${cos(TH)}` : `${sin(TH)} ${MINUS} ${cos(TH)}`)}`)}이고 ${eq(`${sin(TH)}${cos(TH)}`, qh(sc))}이므로 값은 ${qh(val)}이다.`,
        facts: { value: minus ? `(1+(${jn(y)}/${r})*(${jn(x)}/${r}))/((${jn(y)}+${jn(x)})/${r})` : `(1-(${jn(y)}/${r})*(${jn(x)}/${r}))/((${jn(y)}-(${jn(x)}))/${r})` } });
    }, { standard: S2 }),
    // ② 근과 계수 → (sin θ + cos θ)² = 1 + 2 sin θ cos θ → a 의 이차방정식 → 조건으로 근 고르기(→ 세제곱의 합까지). 네 단계 넘게.
    H('hard-rel-roots', '두 근이 sinθ, cosθ이고 계수에 같은 문자가 있는 이차방정식', '①36', (d, n) => {
      const c = d.int(1, 4), m = c * c + 1;
      const eqH = nb(`${X}${sup(2)} + ${Av}${X} + ${c === 1 ? '' : c}${Av} = 0`);
      if (n === 0) {
        return inline(`${X}에 대한 이차방정식 ${eqH}의 두 근이 ${sin(TH)}, ${cos(TH)}일 때, 상수 ${Av}의 값을 구하시오. (단, ${nb(`${Av} ${LT} 0`)})`, `${Av} = {0} {1}${rt('{2}')}`, [{ answer: c, signed: true }, { answer: -1, signed: true }, { answer: m }], {
          shown: `${c} ${MINUS} ${rt(m)}`,
          explain: `근과 계수의 관계에서 ${eq(`${sin(TH)} + ${cos(TH)}`, `${MINUS}${Av}`)}, ${eq(`${sin(TH)}${cos(TH)}`, `${c === 1 ? '' : c}${Av}`)}이다. 첫 식을 제곱하면 ${nb(`1 + ${2 * c}${Av} = ${Av}${sup(2)}`)}, ${nb(`${Av}${sup(2)} ${MINUS} ${2 * c}${Av} ${MINUS} 1 = 0`)}이므로 ${nb(`${Av} = ${c} ± ${rt(m)}`)}이고, ${nb(`${Av} ${LT} 0`)}에서 ${nb(`${Av} = ${c} ${MINUS} ${rt(m)}`)}이다.`,
          facts: { calc: [[`${c}`, 0], [`0-1`, 1], [`${c}*${c}+1`, 2]] } });
      }
      return inline(`${X}에 대한 이차방정식 ${eqH}의 두 근이 ${sin(TH)}, ${cos(TH)}일 때, ${nb(`${trig('sin', TH, 3)} + ${trig('cos', TH, 3)}`)}의 값을 구하시오. (단, ${Av}는 상수이고 ${nb(`${Av} ${LT} 0`)})`, `{0} {1}${rt('{2}')}`, [{ answer: 2 * c ** 3, signed: true }, { answer: 1 - 2 * c * c, signed: true }, { answer: m }], {
        shown: `${2 * c ** 3} ${MINUS} ${2 * c * c - 1 === 1 ? '' : 2 * c * c - 1}${rt(m)}`,
        explain: `${nb(`${Av} = ${c} ${MINUS} ${rt(m)}`)}(근과 계수의 관계와 ${nb(`${trig('sin', TH, 2)} + ${trig('cos', TH, 2)} = 1`)}에서)이다. ${nb(`${trig('sin', TH, 3)} + ${trig('cos', TH, 3)} = (${sin(TH)} + ${cos(TH)})(1 ${MINUS} ${sin(TH)}${cos(TH)}) = ${MINUS}${Av}(1 ${MINUS} ${c === 1 ? '' : c}${Av})`)}에 넣어 정리하면 ${nb(`${2 * c ** 3} ${MINUS} ${2 * c * c - 1 === 1 ? '' : 2 * c * c - 1}${rt(m)}`)}이다.`,
        facts: { calc: [[`2*${c}*${c}*${c}`, 0], [`1-2*${c}*${c}`, 1], [`${c}*${c}+1`, 2]] } });
    }, { count: 2, standard: S2 }),
    // ② 주기 → b, 지나는 점 → bx + c = 0, c 의 범위로 하나 고르기(네 단계).
    H('hard-graph-phase', '그래프를 보고 위상이 낀 사인함수의 상수 c 구하기', '②5', (d) => {
      const b = d.int(1, 3), cq = d.pick([Q(-1, 6), Q(-1, 4), Q(-1, 3), Q(-1, 2), Q(-2, 3), Q(-3, 4), Q(-5, 6)]), a = d.int(1, 3), dd = d.int(-1, 3), x1 = qdiv(qmul(cq, Q(-1)), Q(b)), per = Q(2, b);
      const xs = [x1, qadd(x1, Q(1, b)), qadd(x1, per)], Mx = a + dd, mn = dd - a, xr2 = [-0.3, Math.PI * fl(xs[2]) + 0.35], yr = [Math.min(0, mn) - 0.6, Math.max(0, Mx) + 0.6];
      const figure = plot({ x: xr2, y: yr, ys: ysFor(xr2, yr), xt: xs.map(piT), yt: [Mx, mn, dd].filter((v, i, all) => v !== 0 && all.indexOf(v) === i),
        curves: [{ f: (t) => a * Math.sin(b * t + Math.PI * fl(cq)) + dd, from: 0 }],   // 곡선이 하나라 이름을 붙이지 않는다(긴 이름이 가운데 점선·곡선에 걸린다)
        lines: dd !== 0 ? [{ y: dd, dash: true, said: '가운데 높이를 나타내는 점선' }] : [],
        dots: xs.map((q, i) => ({ x: Math.PI * fl(q), y: dd, said: `곡선이 가운데 높이를 지나는 점(${i === 1 ? '내려가며' : '올라가며'}), x좌표 ${piT(q).t}` })),
        say: `곡선의 가장 높은 값은 ${Mx}, 가장 낮은 값은 ${mn}이다.` });
      return piAns(`함수 ${eq(Y, `${Av} ${trig('sin', `(${Bv}${X} + ${Cv})`)} + ${V('d')}`)}의 그래프가 그림과 같을 때, ${eq(Cv, '□π')}이다. □ 안에 알맞은 수는? (단, ${nb(`${Av} ${GT} 0`)}, ${nb(`${Bv} ${GT} 0`)}, ${nb(`${MINUS}π ${LT} ${Cv} ${LT} 0`)})`, cq.p, cq.q, { figure,
        explain: `그래프에서 주기가 ${nb(`${rad(xs[2])} ${MINUS} ${rad(xs[0])} = ${rad(per)}`)}이므로 ${eq(Bv, b)}이다. 곡선은 ${eq(X, rad(xs[0]))}에서 가운데 높이를 올라가며 지나므로 ${nb(`${b === 1 ? '' : b} × ${rad(xs[0])} + ${Cv} = 2${Nn}π`)}이고, ${nb(`${MINUS}π ${LT} ${Cv} ${LT} 0`)}에서 ${eq(Cv, rad(cq))}이다.`,
        facts: { value: `0-${b}*${x1.p}/${x1.q}` } });
    }, { standard: S2 }),
    // ① cos(π + x) = −cos x 로 짝을 지으면 지워진다는 뜻을 대야 한다(하나하나 셈할 수 없다).
    H('hard-cos-sum', '단위원을 등분하는 점이 만드는 각의 코사인 값의 합', '②10', (d) => {
      const Nd = d.pick([36, 60, 72, 100, 120, 180]), half = Nd / 2, Kk = d.pick([Nd - 1, Nd, half, half - 1]), f = d.pick(['cos', 'cos', 'sin']);
      let total = 0;
      for (let k = 1; k <= Kk; k += 1) total += FV[f](2 * Math.PI * k / Nd);
      const val = Math.round(total);
      if (Math.abs(total - val) > 1e-6) return null;
      const terms = `${nb(`${TF[f](AL)} + ${TF[f](`2${AL}`)} + ${TF[f](`3${AL}`)} +`)} ${nb(`⋯ + ${TF[f](`${Kk}${AL}`)}`)}`;   // 휴대폰에서 ⋯ 앞에서 줄이 바뀔 수 있게
      return N(`단위원의 둘레를 ${Nd}등분 하는 점을 차례로 ${jh(nb(`P${sub(1)}, P${sub(2)}, …, P${sub(Nd)}`), '이라/라')} 하고 ${nb(`∠P${sub(1)}OP${sub(2)} = ${AL}`)}라 할 때, ${terms}의 값은? (단, O는 원점이다.)`, val, { signed: true,
        explain: `${eq(AL, rad(Q(2, Nd)))}이므로 ${nb(`${half}${AL} = π`)}이다. ${f === 'cos' ? `${nb(`${trig('cos', `(${half}${AL} + ${V('k')}${AL})`)} = ${MINUS}${trig('cos', `${V('k')}${AL}`)}`)}, ${nb(`${trig('cos', `(${half}${AL} ${MINUS} ${V('k')}${AL})`)} = ${MINUS}${trig('cos', `${V('k')}${AL}`)}`)}` : `${nb(`${trig('sin', `(${Nd}${AL} ${MINUS} ${V('k')}${AL})`)} = ${MINUS}${trig('sin', `${V('k')}${AL}`)}`)}`}로 짝을 지으면 서로 지워지고, 짝이 없이 남는 항(${f === 'cos' ? `${trig('cos', `${half}${AL}`)} = ${MINUS}1, ${trig('cos', `${Nd}${AL}`)} = 1, ${trig('cos', `${half / 2}${AL}`)} = 0` : `${trig('sin', `${half}${AL}`)} = 0`} 가운데 식에 든 것)만 더하면 ${num(val)}이다.`,
        facts: { value: `${val < 0 ? '0-1' : val === 0 ? '0' : '1'}` } });
    }, { standard: S2 }),
    // ① sin(90° − x) = cos x 로 여각끼리 짝을 지어 sin² + cos² = 1 을 쓰는 뜻을 대야 한다.
    H('hard-sin2-sum', '여각끼리 짝을 지어 sin²의 합 구하기', '②11', (d) => {
      const step = d.pick([1, 3, 5, 9, 15]), f = d.pick(['sin', 'cos']), last = 90 - step, cnt = 90 / step - 1;
      const T2 = (t) => `${trig(f, `${t}°`, 2)}`, terms = `${T2(step)} + ${T2(2 * step)} + ${T2(3 * step)} + ⋯ + ${T2(last)}`;
      return qAns(`다음 식의 값은?`, Q(cnt, 2), {
        figure: B.kit.mid.ex(terms),
        explain: `${nb(`${f === 'sin' ? 'sin' : 'cos'} (90° ${MINUS} ${V('x')}°) = ${f === 'sin' ? 'cos' : 'sin'} ${V('x')}°`)}이므로 ${nb(`${T2(step)} + ${T2(last)} = 1`)}처럼 처음과 끝에서 하나씩 짝을 지으면 합이 1인 짝이 ${(cnt - 1) / 2}개이고 가운데 ${T2(45)} = ${frac(1, 2)}이 남는다. 따라서 값은 ${num(Q(cnt, 2))}이다.`,
        facts: { value: `(90/${step}-1)/2` } });
    }, { standard: S2 }),
    // ① 꼭짓점 t = a 가 범위(−1 ≤ t ≤ 1) 안인지 밖인지로 경우를 나누어야 한다.
    H('hard-maxmin-param', '최댓값이 주어진 치환 함수의 상수 — 꼭짓점의 위치로 경우 나누기', '②14', (d, n) => {
      const k = d.int(-4, 3), a = n === 0 ? d.pick([Q(3, 2), Q(5, 2), Q(7, 2), Q(9, 4), Q(7, 3)]) : d.pick([Q(1, 2), Q(1, 3), Q(2, 3), Q(3, 4), Q(1, 4)]);
      const Mx = n === 0 ? qadd(qmul(Q(2), a), Q(k)) : qadd(qadd(qmul(a, a), Q(1)), Q(k));
      const t = V('t');
      return qAns(`${nb(`0 ≤ ${X} ${LT} 2π`)}에서 함수 ${eq(Y, `${trig('sin', X, 2)} + 2${Av} ${cos(X)}${plusTerm(k)}`)}의 최댓값이 ${num(Mx)}일 때, 상수 ${Av}의 값은? (단, ${nb(`${Av} ${GT} 0`)})`, a, {
        explain: `${eq(cos(X), t)}로 놓으면 ${nb(`${MINUS}1 ≤ ${t} ≤ 1`)}이고 ${nb(`${Y} = ${MINUS}(${t} ${MINUS} ${Av})${sup(2)} + ${Av}${sup(2)}${plusTerm(k + 1)}`)}이다. ${nb(`0 ${LT} ${Av} ≤ 1`)}이면 최댓값은 ${nb(`${Av}${sup(2)}${plusTerm(k + 1)}`)}, ${nb(`${Av} ${GT} 1`)}이면 ${eq(t, 1)}에서 최댓값 ${nb(`2${Av}${plusTerm(k)}`)}이다. 두 경우를 각각 풀어 조건에 맞는 것은 ${eq(Av, num(a))}뿐이다.`,
        facts: { value: n === 0 ? `((${Mx.p}/${Mx.q})-(${k}))/2` : `${a.p}/${a.q}` } });
    }, { count: 2, standard: S2 }),
    // ① 이차항의 계수가 0인 경우(sin θ = 0)를 따로 보아야 한다.
    H('hard-eq-allx', '모든 실수 x에서 성립하는 이차부등식과 θ의 범위', '②25', (d) => {
      const f = d.pick(['sin', 'cos']), [b, c] = d.pick([[2, 2], [4, 8], [6, 18]]);
      const open = solveSet((x) => FV[f](x) * (FV[f](x) - 0.5), 0, 48, '<'), zeros = solveSet((x) => FV[f](x), 0, 48, '=');
      if (!open || !zeros) return null;
      // 0 인 점을 이웃한 구간에 넣는다
      const ivs = open.ivs.map((I) => Object.assign({}, I)), extra = [];
      for (const z of zeros.pts) { const I = ivs.find((J) => J.a === z || J.b === z); if (I) { if (I.a === z) I.ai = true; if (I.b === z) I.bi = true; } else extra.push({ single: z }); }
      const right = { ivs: ivs.concat(extra).sort((p, q) => (p.a != null ? p.a : p.single) - (q.a != null ? q.a : q.single)) };
      const alts = [open, solveSet((x) => FV[f](x) * (FV[f](x) - 0.5), 0, 48, '<='), solveSet((x) => FV[f](x) - 0.5, 0, 48, '<'), solveSet((x) => FV[f](x) * (FV[f](x) - 0.5), 0, 48, '>')];
      return pickSet(d, `모든 실수 ${X}에 대하여 부등식 ${nb(`(${TF[f](TH)})${X}${sup(2)} + (${2 * b}${TF[f](TH)})${X} + ${c} ${GT} 0`)}이 항상 성립하도록 하는 ${TH}의 값의 범위는? (단, ${nb(`0 ≤ ${TH} ${LT} 2π`)})`, right, alts, { v: TH,
        explain: `(i) ${eq(TF[f](TH), 0)}이면 ${nb(`${c} ${GT} 0`)}이므로 늘 성립한다. (ii) ${nb(`${TF[f](TH)} ≠ 0`)}이면 ${nb(`${TF[f](TH)} ${GT} 0`)}이고 판별식 ${nb(`${frac(V('D'), 4)} = ${b * b}${trig(f, TH, 2)} ${MINUS} ${c}${TF[f](TH)} ${LT} 0`)}이어야 하므로 ${nb(`0 ${LT} ${TF[f](TH)} ${LT} ${frac(1, 2)}`)}이다. (i), (ii)를 합하면 ${setText(right, TH)}이다.` });
    }, { standard: S2 }),
    // ② t = sin x 로 바꾸고, 아래로 볼록한 이차식이 −1 ≤ t ≤ 1 에서 늘 음수일 조건(양 끝) → 정수의 최댓값(네 단계).
    H('hard-eq-always', '모든 실수 x에서 성립하는 삼각부등식의 정수 상수', '②26', (d) => {
      const p = d.int(1, 4), q = d.int(2, 4), f = d.pick(['sin', 'cos']), g = f === 'sin' ? 'cos' : 'sin';
      // g² + (a + p)f − q a > 0 ⇔ t² − (a + p)t + q a − 1 < 0 (−1 ≤ t ≤ 1) ⇔ (1 + q)a + p < 0, (q − 1)a − p < 0
      let ans = null;
      for (let a = 20; a >= -40; a -= 1) if ((1 + q) * a + p < 0 && (q - 1) * a - p < 0) { ans = a; break; }
      if (ans == null) return null;
      return N(`모든 실수 ${X}에 대하여 부등식 ${nb(`${trig(g, X, 2)} + (${Av} + ${p})${TF[f](X)} ${MINUS} ${q}${Av} ${GT} 0`)}이 항상 성립하도록 하는 정수 ${Av}의 최댓값은?`, ans, { signed: true,
        explain: `${eq(TF[f](X), V('t'))}로 놓으면 ${nb(`${MINUS}1 ≤ ${V('t')} ≤ 1`)}이고 부등식은 ${nb(`${V('t')}${sup(2)} ${MINUS} (${Av} + ${p})${V('t')} + ${q}${Av} ${MINUS} 1 ${LT} 0`)}이다. 좌변을 ${V('g')}(${V('t')})라 하면 아래로 볼록하므로 ${nb(`${V('g')}(${MINUS}1) = ${1 + q}${Av} + ${p} ${LT} 0`)}, ${nb(`${V('g')}(1) = ${q - 1 === 1 ? '' : q - 1}${Av} ${MINUS} ${p} ${LT} 0`)}이면 된다. 둘을 함께 만족시키는 정수 ${Av}의 최댓값은 ${num(ans)}이다.`,
        facts: { value: ans < 0 ? `0-${-ans}` : `${ans}` } });
    }, { standard: S2 }),
    // ① 직선이 y = ±1 을 넘는 곳까지만 세고, 원점 대칭으로 반쪽만 센다(교점을 하나하나 셀 수 있게 하는 뜻).
    H('hard-eq-count', '삼각함수의 그래프와 직선의 교점의 개수', '②27', (d, n) => {
      let f, lineH, eqH, L;
      if (n === 0) {
        const kk = d.int(2, 6), fname = d.pick(['sin', 'sin', 'cos']);
        f = (x) => FV[fname](x) - x / (kk * Math.PI); L = kk * Math.PI;
        eqH = nb(`${TF[fname](X)} = ${frac(X, `${kk}π`)}`); lineH = `${Y} = ${frac(X, `${kk}π`)}`;
      } else {
        const fname = d.pick(['sin', 'cos']), m = d.pick([1, 2]), c = d.int(3, 13);
        f = (x) => FV[fname](Math.PI * x / m) - x / c; L = c;
        eqH = nb(`${TF[fname](m === 1 ? `π${X}` : `${frac('π', m)}${X}`)} = ${frac(X, c)}`); lineH = `${Y} = ${frac(X, c)}`;
      }
      // 교점 세기: 촘촘히 짚어 부호가 바뀌는 곳을 센다. 접하는 곳(부호가 안 바뀌고 0에 가까운 곳)이 있으면 버린다.
      const steps = 12000, h = (2 * L + 2) / steps;
      let cnt = 0, prev = f(-L - 1);
      for (let i = 1; i <= steps; i += 1) {
        const x = -L - 1 + i * h, v = f(x);
        if (Math.abs(v) < 1e-12) { cnt += 1; prev = f(x + h / 2); continue; }
        if (v * prev < 0) cnt += 1;
        else if (Math.abs(v) < 2e-3 && f(x - h) * v > 0 && f(x + h) * v > 0 && Math.abs(f(x - h)) > Math.abs(v) && Math.abs(f(x + h)) > Math.abs(v)) return null;   // 접하는 곳
        prev = v;
      }
      return N(`방정식 ${eqH}의 서로 다른 실근의 개수는?`, cnt, {
        explain: `실근의 개수는 곡선과 직선 ${lineH}의 교점의 개수이다. 직선은 ${nb(`|${X}| ${GT} ${n === 0 ? `${L / Math.PI}π` : L}`)}에서 ${nb(`|${Y}| ${GT} 1`)}이 되어 곡선과 만나지 않으므로 그 안쪽에서만 센다. 한 주기마다 직선과 몇 번 만나는지 세어 더하면 ${cnt}개이다.`,
        facts: { value: `${cnt}` } });
    }, { count: 2, standard: S2 }),
    // ① 바깥 함수의 해를 안쪽 값의 범위(0 ≤ |sin x| ≤ 1)로 걸러야 한다.
    H('hard-eq-nested-count', '합성된 삼각방정식의 실근의 개수(치환한 값의 범위)', '②28', (d) => {
      const outer = d.pick(['sin', 'cos']), inner = d.pick(['sin', 'cos']), abs = d.int(0, 3) > 0, kv = outer === 'sin' ? d.pick([0.5, Math.SQRT2 / 2, R3 / 2]) : d.pick([R3 / 2, Math.SQRT2 / 2, 0.5]), dom = d.pick([[0, 48], [0, 24]]);
      const g = (x) => FV[outer](abs ? Math.abs(FV[inner](x)) : FV[inner](x)) - kv;
      let cnt = 0;
      const steps = 8000, lo = dom[0] * Math.PI / 24, hi = dom[1] * Math.PI / 24, h = (hi - lo) / steps;
      let prev = g(lo);
      if (Math.abs(prev) < 1e-12) cnt += 1;
      for (let i = 1; i < steps; i += 1) { const x = lo + i * h, v = g(x); if (Math.abs(v) < 1e-12) { cnt += 1; } else if (v * prev < 0 && Math.abs(prev) > 1e-12) cnt += 1; else if (Math.abs(v) < 2e-3 && g(x - h) * v > 0 && g(x + h) * v > 0 && Math.abs(g(x - h)) > Math.abs(v) && Math.abs(g(x + h)) > Math.abs(v)) return null; prev = v; }
      const insideH = abs ? `|${TF[inner](X)}|` : TF[inner](X);
      const ts = [];
      for (let m = 0; m <= 24; m += 1) { const t = m * Math.PI / 24; if (Math.abs(FV[outer](t) - kv) < 1e-9) ts.push(m); }
      return N(`${nb(`${xr(dom[0])} ≤ ${X} ${LT} ${xr(dom[1])}`)}일 때, 방정식 ${nb(`${TF[outer](`(${insideH})`)} = ${exact(kv)}`)}의 서로 다른 실근의 개수는?`, cnt, {
        explain: `${eq(insideH, V('t'))}로 놓으면 ${nb(`${abs ? 0 : MINUS + 1} ≤ ${V('t')} ≤ 1`)}이다. ${nb(`${TF[outer](V('t'))} = ${exact(kv)}`)}의 해 가운데 ${ts.map((m) => rad(Q(m, 24))).join(', ')}를 ${V('t')}의 범위로 거르면 ${ts.filter((m) => m * Math.PI / 24 <= 1).map((m) => rad(Q(m, 24))).join(', ') || '남는 것이 없다'}${ts.some((m) => m * Math.PI / 24 <= 1) ? '만 남는다' : ''}. 이 값이 되는 ${X}를 주어진 범위에서 세면 ${cnt}개이다.`,
        facts: { value: `${cnt}` } });
    }, { standard: S2 }),
    H('hard-eq-nested-ineq', '합성된 삼각부등식(치환한 값의 범위)', '②28', (d) => {
      const outer = 'cos', inner = d.pick(['sin', 'cos']), rel = d.pick(['>=', '<=', '>', '<']), dom = inner === 'cos' ? [0, 24] : [0, 48];
      const g = (x) => Math.cos(Math.PI * FV[inner](x)), res = solveSet(g, 0, dom[1], rel, { closedR: inner === 'cos' });
      if (!res || !res.ivs.length) return null;
      const FLIP = { '<': '>=', '<=': '>', '>': '<=', '>=': '<' }, REL = { '<': LT, '<=': '≤', '>': GT, '>=': '≥' };
      const alts = [solveSet(g, 0, dom[1], FLIP[rel], { closedR: inner === 'cos' }), solveSet((x) => Math.cos(FV[inner](x)) - 0.0, 0, dom[1], rel, { closedR: inner === 'cos' }), solveSet((x) => FV[inner](x) - 0.5, 0, dom[1], rel[0] === '>' ? '<=' : '>=', { closedR: inner === 'cos' }), solveSet((x) => FV[inner](x) * FV[inner](x) - 0.25, 0, dom[1], rel[0] === '>' ? '>' : '<', { closedR: inner === 'cos' })];
      return pickSet(d, `${nb(`0 ≤ ${X} ${inner === 'cos' ? '≤ π' : `${LT} 2π`}`)}일 때, 부등식 ${nb(`${trig(outer, `(π${TF[inner](X)})`)} ${REL[rel]} 0`)}의 해는?`, res, alts.filter(Boolean), {
        explain: `${eq(`π${TF[inner](X)}`, V('t'))}로 놓으면 ${nb(`${MINUS}π ≤ ${V('t')} ≤ π`)}이고 ${nb(`${trig('cos', V('t'))} ${REL[rel]} 0`)}에서 ${V('t')}의 범위를 구하면 ${TF[inner](X)}의 범위가 ${nb(`${MINUS}${frac(1, 2)}`)}과 ${frac(1, 2)}로 갈린다. 이를 ${X}의 범위로 바꾸면 ${setText(res)}이다.` });
    }, { standard: S2 }),
    // ① 두 그래프의 대칭축(사인은 π/2, 코사인은 0·2π)으로 x좌표를 짝 짓는 뜻을 대야 한다.
    H('hard-eq-symsum', '두 그래프와 직선 y = k의 교점 — 대칭으로 x좌표의 합', '②30', (d) => {
      const [lo, hi] = d.pick([[-12, 60], [0, 48], [-12, 48], [0, 60]]), L = lo * Math.PI / 24, R = hi * Math.PI / 24;
      // 0 < k < √2/2 인 k 두 값에서 근을 모아 sin(합)을 셈하고, 후보 식과 맞춘다
      const roots = (k) => { const out = []; for (const f of ['sin', 'cos']) for (let j = -4; j <= 6; j += 1) { const base = f === 'sin' ? [Math.asin(k), Math.PI - Math.asin(k)] : [Math.acos(k), -Math.acos(k)]; for (const b0 of base) { const x = b0 + 2 * Math.PI * j; if (x > L + 1e-9 && x < R - 1e-9) out.push(x); } } return out.sort((p, q) => p - q); };
      const r1 = roots(0.3), r2 = roots(0.5);
      if (r1.length !== r2.length || r1.length < 4) return null;
      const s1 = Math.sin(r1.reduce((a, v) => a + v, 0)), s2 = Math.sin(r2.reduce((a, v) => a + v, 0));
      const cands = [['−1', () => -1], ['−k', (k) => -k], ['0', () => 0], ['k', (k) => k], ['1', () => 1], ['−√(1 − k²)', (k) => -Math.sqrt(1 - k * k)], ['√(1 − k²)', (k) => Math.sqrt(1 - k * k)]];
      const hit = cands.filter(([, fn]) => Math.abs(fn(0.3) - s1) < 1e-9 && Math.abs(fn(0.5) - s2) < 1e-9);
      if (hit.length !== 1) return null;
      const showC = (t) => (t.includes('√') ? `${t.startsWith('−') ? MINUS : ''}${rt(`1 ${MINUS} ${Kv}${sup(2)}`)}` : t.replace('−', MINUS).replace('k', Kv));
      const right = showC(hit[0][0]), wrongs = cands.filter((c0) => c0 !== hit[0]).map((c0) => showC(c0[0]));
      const n = r1.length, subs = Array.from({ length: n }, (_, i) => `${X}${sub(i + 1)}`);
      const figure = plot({ x: [L - 0.3, R + 0.3], y: [-1.5, 1.5], w: 250, ys: ysFor([L - 0.3, R + 0.3], [-1.5, 1.5], 250), xt: [L, R].filter((v) => Math.abs(v) > 1e-9).map((v) => piT(Q(Math.round(v * 24 / Math.PI), 24))), yt: [1, -1],   // 양 끝의 곡선 이름까지 휴대폰 칸(288px)에 들게
        curves: [{ f: Math.sin, from: L, to: R, name: 'y=sin x', at: R }, { f: Math.cos, from: L, to: R, name: 'y=cos x', at: R }], lines: [{ y: 0.4, name: 'y=k', said: '직선 y = k' }],
        say: `두 곡선과 직선 y = k(0 < k < √2/2)가 ${n}개의 점에서 만난다.` });
      return pickH(d, `그림과 같이 ${nb(`${xr(lo)} ${LT} ${X} ${LT} ${xr(hi)}`)}일 때, 두 함수 ${eq(Y, sin(X))}, ${eq(Y, cos(X))}의 그래프와 직선 ${eq(Y, Kv)}의 교점의 ${X}좌표를 작은 것부터 차례로 ${subs[0]}, ${subs[1]}, …, ${jh(subs[n - 1], '이라/라')} 하자. ${jh(nb(trig('sin', `(${subs[0]} + ${subs[1]} + ⋯ + ${subs[n - 1]})`)), '을/를')} 간단히 하면? (단, ${nb(`0 ${LT} ${Kv} ${LT} ${frac(rt(2), 2)}`)})`, right, wrongs, { figure,
        explain: `사인함수의 그래프는 직선 ${eq(X, P2)} 등에, 코사인함수의 그래프는 ${Y}축과 직선 ${eq(X, '2π')} 등에 대하여 대칭이므로 대칭인 두 교점의 ${X}좌표의 합은 π, 0, 4π처럼 정해진다. 짝이 없는 교점만 남겨 합을 정리하고 삼각함수의 성질을 쓰면 ${right}이다.` });
    }, { standard: S2 }),
    // ① 최댓값이 되는 x 는 한 주기의 1/4 지점과 거기에 주기를 더한 곳이라는 뜻을 대고, 넓이·기울기의 곱을 이어 푼다(네 단계).
    H('hard-sc-triangle', '사인 곡선과 y = a의 교점으로 만든 삼각형', '심4', (d) => {
      const kk = d.pick([2, 3, 4]), S = d.until(() => d.int(2, 9), (v) => v % kk !== 0), a = Q(S, kk), b = Q(1, kk), P = Q(4 * S * S, 5 * kk ** 4);
      const per = 2 * kk, A = [kk / 2, fl(a)], Bp = [5 * kk / 2, fl(a)], xr2 = [-0.4, 3 * kk + 0.4], yr = [-fl(a) - 0.5, fl(a) + 0.8];
      const figure = plot({ x: xr2, y: yr, w: 250, ys: ysFor(xr2, yr, 250), curves: [{ f: (x) => fl(a) * Math.sin(Math.PI * x / kk), from: 0, to: 3 * kk, name: 'y=a sin bπx', at: 2.8 * kk, side: 'ur' }],
        segs: [{ p: [0, 0], q: A }, { p: [0, 0], q: Bp }, { p: A, q: Bp }], dots: [{ x: A[0], y: A[1], name: 'A', side: 'u', said: '곡선이 직선 y = a와 만나는 점' }, { x: Bp[0], y: Bp[1], name: 'B', side: 'u', said: '곡선이 직선 y = a와 만나는 점' }],
        say: `곡선은 x = 0부터 x = 3/b까지 그렸고, 삼각형 OAB를 그렸다.` });
      return qAns(`그림과 같이 두 양수 ${Av}, ${Bv}에 대하여 곡선 ${nb(`${eq(Y, `${Av} ${trig('sin', `${Bv}π${X}`)}`)} ${nb(`(0 ≤ ${X} ≤ ${frac(3, Bv)})`)}`)}${jh(eq(Y, `${Av} ${trig('sin', `${Bv}π${X}`)}`), '이/가').slice(-1)} 직선 ${eq(Y, Av)}와 만나는 서로 다른 두 점을 A, B라 하자. 삼각형 OAB의 넓이가 ${S}이고 직선 OA의 기울기와 직선 OB의 기울기의 곱이 ${num(P)}일 때, ${Av}의 값은? (단, O는 원점이다.)`, a, { figure,
        explain: `주기는 ${frac(2, Bv)}이므로 ${nb(`A(${frac(1, `2${Bv}`)}, ${Av})`)}, ${nb(`B(${frac(5, `2${Bv}`)}, ${Av})`)}이다. 넓이에서 ${nb(`${frac(1, 2)} × ${frac(2, Bv)} × ${Av} = ${S}`)}, ${eq(Av, `${S}${Bv}`)}이고, 기울기의 곱에서 ${nb(`2${Av}${Bv} × ${frac(`2${Av}${Bv}`, 5)} = ${num(P)}`)}, ${eq(`${Av}${Bv}`, num(qmul(a, b)))}이다. 두 식에서 ${eq(Bv, num(b))}, ${eq(Av, num(a))}이다.`,
        facts: { value: `${S}*${b.p}/${b.q}` } });
    }, { standard: S2 }),
    // ① 한 주기 안의 두 해가 꼭대기의 x에 대하여 대칭이라는 뜻으로 짝마다 합을 구한다.
    H('hard-eq-root-sum', 'sin nx = k의 모든 해의 합 — 대칭축으로 짝 짓기', '심6', (d) => {
      const n = d.int(3, 7), kq = d.pick([Q(1, 5), Q(1, 3), Q(2, 3), Q(2, 5), Q(3, 4)]);
      let sum = Q(0);
      for (let j = 0; 2 * j < n; j += 1) sum = qadd(sum, Q(4 * j + 1, n));
      const wrongs = [qsub(sum, Q(4 * Math.floor((n - 1) / 2) + 1, n)), qmul(sum, Q(1, 2)), Q(n % 2 ? (n + 1) / 2 : n / 2), qadd(sum, Q(1)), qmul(sum, Q(2)), Q(n, 2)].filter((q) => q.p > 0).map((q) => ({ h: rad(q), v: fl(q) }));
      return pickH(d, `${nb(`0 ≤ ${X} ${LT} π`)}일 때, 방정식 ${nb(`${trig('sin', `${n}${X}`)} = ${num(kq)}`)}의 모든 해의 합은?`, { h: rad(sum), v: fl(sum) }, wrongs, {
        explain: `${nb(`${Y} = ${trig('sin', `${n}${X}`)}`)}의 주기는 ${rad(Q(2, n))}이다. ${nb(`0 ≤ ${X} ${LT} π`)}에서 곡선이 ${X}축 위로 올라간 부분은 ${Math.ceil(n / 2)}개이고, 그 각각에서 직선 ${jh(eq(Y, num(kq)), '과/와')} 두 번 만나며 두 해는 꼭대기의 ${X}좌표(${Array.from({ length: Math.ceil(n / 2) }, (_, j) => rad(Q(4 * j + 1, 2 * n))).join(', ')})에 대하여 대칭이다. 따라서 합은 ${rad(sum)}이다.` });
    }, { standard: S2 }),
    // ① sin(m/2·π/m ± πx/m) = cos(πx/m) 로 두 값이 같아 곱이 제곱이 된다는 뜻을 대고, 범위를 자연수로 거른다(네 단계).
    H('hard-ineq-natural', 'f(p + x)f(p − x) 꼴의 부등식을 만족시키는 자연수', '심8', (d) => {
      const m = d.pick([4, 6]), cq = d.pick([Q(1, 4), Q(1, 2), Q(3, 4)]), Lx = m * d.int(3, 4), less = d.bool(), c = fl(cq);
      const ok = (x) => { const v = Math.cos(Math.PI * x / m) ** 2; return less ? v < c - 1e-9 : v > c + 1e-9; };
      const xs = []; for (let x = 1; x < Lx; x += 1) if (ok(x)) xs.push(x);
      if (!xs.length) return null;
      const sumX = xs.reduce((a, v) => a + v, 0), half = m / 2;
      return N(`함수 ${eq(fx(X), trig('sin', `${frac('π', m)}${X}`))}라 할 때, ${nb(`0 ${LT} ${X} ${LT} ${Lx}`)}에서 부등식 ${nb(`${fx(`${half} + ${X}`)}${fx(`${half} ${MINUS} ${X}`)} ${less ? LT : GT} ${num(cq)}`)}을 만족시키는 모든 자연수 ${X}의 값의 합은?`, sumX, {
        explain: `${nb(`${fx(`${half} ± ${X}`)} = ${trig('sin', `(${P2} ± ${frac('π', m)}${X})`)} = ${trig('cos', `${frac('π', m)}${X}`)}`)}이므로 부등식은 ${nb(`${trig('cos', `${frac('π', m)}${X}`, 2)} ${less ? LT : GT} ${num(cq)}`)}이다. 이를 만족시키는 자연수는 ${xs.join(', ')}이므로 합은 ${sumX}이다.`,
        facts: { value: xs.join('+') } });
    }, { standard: S2 })
  ];

  B.addGroup('11-1-3', { id: 'hard', title: '실력 문제', standard: S2, types: hard });
})(typeof window !== 'undefined' ? window : globalThis);
