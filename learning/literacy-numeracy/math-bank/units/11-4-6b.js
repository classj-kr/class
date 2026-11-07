// 고등학교 기하 Ⅲ-1 벡터의 연산 — 뒤쪽 묶음(중점·내분점·무게중심과 벡터, 벡터의 평행, 벡터의 합의 크기와 활용).
// 단원 틀·싣는 기준·뺀 것과 까닭은 11-4-6a.js 머리에 적었다. 도구는 B.kit.u46(a 파일)을 쓴다.
// 이 파일의 원칙: 내분점·중점·무게중심은 「변을 따라 간 실수배」와 「중점은 두 벡터의 합의 절반(AM⃗ = ½(AB⃗ + AC⃗))」으로만 풀고,
// 원점을 시점으로 한 내분점의 위치벡터 공식은 쓰지 않는다(11-4-7 몫). 계수가 분수인 답은 고르기, 정수이면 식 속 칸으로 받는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, N, C, inline } = B.kit;
  const { MINUS, Q, nb, V, SG, rt, tail } = B.kit.mid;
  const { vec, jh } = B.kit.hs;
  const K = B.kit.u46;
  const { absH, T, stripH, num, vadd, vsub, vmul, vlen, same, isZero, parallel, rat, coefs, intCoefs, vecOf, segsOf, rev, vn, lcH, jsn, sn, pn, kx, ab, abc, vlist,
    lcAns, lenAns, numA, pickOne, arrowTo, vname, fig2, fig3, attr, box, BOX_EDGES, BOX_HID, TET, TET_VIEW, viaOrigin, S3 } = K;
  const { Board, at, mid } = B.kit.mgeo;

  // ── 분수 계수의 고르기 ──
  const qeq = (u, v) => u.every((q, i) => q.p === v[i].p && q.q === v[i].q);
  // 맞는 계수 c 와 헷갈리기 쉬운 계수들: 부호를 모두 바꾼 것, 차례를 바꾼 것, 한 계수의 부호만 바꾼 것, 한 계수를 1에서 뺀 것(내분의 비를 거꾸로 읽은 것)
  function nearCoefs(c) {
    const neg = (q) => Q(-q.p, q.q), one = (q) => Q(q.q - q.p, q.q), out = [];
    const push = (v) => { if (!qeq(v, c) && !out.some((w) => qeq(w, v)) && v.some((q) => q.p)) out.push(v); };
    push(c.map(neg)); push(c.slice().reverse());
    c.forEach((q, i) => {
      push(c.map((r, j) => (j === i ? neg(r) : r)));
      if (q.p > 0 && q.p < q.q) push(c.map((r, j) => (j === i ? one(r) : r)));
      if (q.p < 0 && -q.p < q.q) push(c.map((r, j) => (j === i ? neg(one(neg(r))) : r)));
      push(c.map((r, j) => (j === i ? Q(r.p * 2, r.q) : r)));
    });
    return out;
  }
  // 계수 c(유리수)를 보기 다섯 가운데에서 고르는 문항
  function coefPick(d, text, c, names, o) {
    const wrong = d.shuffle(nearCoefs(c)).filter((v, i, all) => all.findIndex((w) => stripH(lcH(w, names)) === stripH(lcH(v, names))) === i && stripH(lcH(v, names)) !== stripH(lcH(c, names))).slice(0, 4);
    if (wrong.length < 4) return null;
    return pickOne(d, text, [{ h: lcH(c, names), ok: true }].concat(wrong.map((v) => ({ h: lcH(v, names), ok: false }))), o);
  }
  const fr = (m, n) => frac(m, m + n);                                     // m:n 으로 내분할 때 앞에서 간 몫(m/(m+n))
  const ratio = (m, n) => nb(`${m} : ${n}${tail(n, '으로/로')}`);
  const onSeg = (P, X, Y, m, n) => vadd(P[X], vmul(m / (m + n), vsub(P[Y], P[X])));   // 선분 XY 를 m : n 으로 내분하는 점
  const pickRatio = (d) => d.until(() => [d.int(1, 4), d.int(1, 4)], ([m, n]) => m !== n && K.rat(m / n) && gcd2(m, n) === 1);
  const gcd2 = (x, y) => (y ? gcd2(y, x % y) : x);
  // 유리수를 화면 글로(음수는 −, 분수는 세로 분수)
  const qH = (q) => (q.p < 0 ? MINUS : '') + (q.q === 1 ? String(Math.abs(q.p)) : frac(Math.abs(q.p), q.q));
  // 덧셈 꼴로 붙이는 수: + 3, − 2
  const plusN = (x) => (x < 0 ? ` ${MINUS} ${Math.abs(x)}` : ` + ${x}`);
  const plusV = (x, nm) => (x < 0 ? ` ${MINUS} ` : ' + ') + (Math.abs(x) === 1 ? '' : Math.abs(x)) + vec(nm);

  // 일반 삼각형 ABC(A 위, B 왼쪽 아래, C 오른쪽 아래)
  const TRG = { A: [0.55, 1.75], B: [0, 0], C: [2.4, 0] };
  const triFig = (pts, extra) => fig2(Object.assign({ u: 70, pts, edges: 'AB BC CA' }, extra));

  // ══ 마. 중점·내분점·무게중심과 벡터 ══
  const div = [
    // ②1 변의 내분점을 잇는 벡터(분수 계수 — 고르기): 차례 1 AB·BC 위의 두 점, 차례 2 AB·AC 위의 두 점, 차례 3 직사각형의 한 변 위의 점(교대05)
    T('div-tri', '변의 중점·내분점을 잇는 벡터 나타내기', '②1', (d, n) => {
      if (n === 2) {
        const w = d.int(3, 5), h = d.int(2, 3), [m, k] = pickRatio(d);
        const P = { O: [0, 0], A: [w, 0], B: [w, h], C: [0, h] }; P.P = onSeg(P, 'C', 'B', m, k);
        const c = coefs(vsub(P.P, P.O), [vecOf(P, 'OA'), vecOf(P, 'OC')]);
        return coefPick(d, `직사각형 OABC에서 선분 CB를 ${ratio(m, k)} 내분하는 점을 P라고 할 때, 벡터 ${jh(vn('OP'), '을/를')} 두 벡터 ${vn('OA')}, ${jh(vn('OC'), '으로/로')} 나타낸 것은?`, c, ['OA', 'OC'], {
          figure: fig2({ u: 38, pts: P, edges: 'OA AB BC CO', arrows: [['O', 'P']], dots: ['P'], at: { P: 90 }, say: `직사각형 OABC(O 왼쪽 아래, A 오른쪽 아래, B 오른쪽 위, C 왼쪽 위)와 변 CB 위의 점 P. O에서 P로 화살표.` }),
          explain: `${vn('CP')} = ${fr(m, k)}${vn('CB')}이고 ${vn('CB')} = ${jh(vn('OA'), '이므로/이므로')} ${vn('OP')} = ${vn('OC')} + ${vn('CP')} = ${lcH(c, ['OA', 'OC'])}이다.` });
      }
      const [m1, n1] = n === 1 && d.bool() ? [1, 1] : pickRatio(d), [m2, n2] = pickRatio(d);
      const P = Object.assign({}, TRG), onQ = n === 0 ? 'BC' : 'AC';
      P.P = onSeg(P, 'A', 'B', m1, n1); P.Q = onSeg(P, onQ[0], onQ[1], m2, n2);
      const c = coefs(vsub(P.Q, P.P), [vecOf(P, 'AB'), vecOf(P, 'AC')]);
      if (!c || c.every((q) => q.q === 1)) return null;
      const pDesc = m1 === n1 ? '선분 AB의 중점을 P' : `선분 AB를 ${ratio(m1, n1)} 내분하는 점을 P`;
      const why = n === 0
        ? `${vn('PB')} = ${fr(n1, m1)}${vn('AB')}, ${vn('BQ')} = ${fr(m2, n2)}${vn('BC')}이고 ${vn('BC')} = ${vec('b')} ${MINUS} ${jh(vec('a'), '이므로/이므로')} ${vn('PQ')} = ${vn('PB')} + ${vn('BQ')} = ${fr(n1, m1)}${vec('a')} + ${fr(m2, n2)}(${vec('b')} ${MINUS} ${vec('a')}) = ${lcH(c, ['a', 'b'])}`
        : `${vn('AP')} = ${fr(m1, n1)}${vec('a')}, ${vn('AQ')} = ${fr(m2, n2)}${jh(vec('b'), '이므로/이므로')} ${vn('PQ')} = ${vn('AQ')} ${MINUS} ${vn('AP')} = ${lcH(c, ['a', 'b'])}`;
      return coefPick(d, `삼각형 ABC에서 ${pDesc}, 선분 ${jh(onQ, '을/를')} ${ratio(m2, n2)} 내분하는 점을 Q라 하고 ${vn('AB')} = ${vec('a')}, ${vn('AC')} = ${jh(vec('b'), '이라/라')}고 할 때, 벡터 ${jh(vn('PQ'), '을/를')} ${vlist(ab)}로 나타낸 것은?`, c, ['a', 'b'], {
        figure: triFig(P, { arrows: [['P', 'Q']], dots: ['P', 'Q'], say: `삼각형 ABC(A 위, B 왼쪽 아래, C 오른쪽 아래)와 변 AB 위의 점 P, 변 ${onQ} 위의 점 Q. P에서 Q로 화살표.` }),
        explain: `${why}이다.` });
    }, { count: 3 }),

    // ②2 정사면체: 두 모서리의 중점을 잇는 벡터(중점은 두 벡터의 합의 절반)
    T('div-tetra', '정사면체에서 모서리의 중점을 잇는 벡터', '②2', (d) => {
      const E = ['OA', 'OB', 'OC', 'AB', 'BC', 'CA'], [e1, e2] = d.until(() => [d.pick(E), d.pick(E)], ([x, y]) => x !== y && !(x.includes('O') && y.includes('O')));
      const mid3 = (e) => [0, 1, 2].map((i) => (TET[e[0]][i] + TET[e[1]][i]) / 2);
      const P = Object.assign({}, TET, { M: mid3(e1), N: mid3(e2) });
      const bv = ['OA', 'OB', 'OC'].map((s) => vecOf(TET, s)), c = coefs(vsub(P.N, P.M), bv);
      if (!c) return null;
      const cof = (s) => [0, 1, 2].map((i) => (s.includes('OABC'[i + 1]) ? 1 : 0));
      const mH = (s) => `${frac(1, 2)}(${lcH(cof(s), ['a', 'b', 'c'])})`;
      return coefPick(d, `정사면체 OABC에서 두 모서리 ${e1}, ${e2}의 중점을 각각 M, N이라 하고 ${vn('OA')} = ${vec('a')}, ${vn('OB')} = ${vec('b')}, ${vn('OC')} = ${jh(vec('c'), '이라/라')}고 할 때, 벡터 ${jh(vn('MN'), '을/를')} ${vlist(abc)}로 나타낸 것은?`, c, ['a', 'b', 'c'], {
        figure: fig3({ view: TET_VIEW, pts: P, edges: 'OA OB OC AB BC', dash: 'AC', arrows: [['M', 'N']], dots: ['M', 'N'], center: [0, 0, 0.6], say: `정사면체 OABC(O 위, A 왼쪽, B 앞, C 오른쪽)와 모서리 ${e1}의 중점 M, 모서리 ${e2}의 중점 N. M에서 N으로 화살표.` }),
        explain: `선분의 중점으로 가는 벡터는 두 끝으로 가는 벡터의 합의 절반이다. ${vn('OM')} = ${mH(e1)}, ${vn('ON')} = ${jh(mH(e2), '이므로/이므로')} ${vn('MN')} = ${vn('ON')} ${MINUS} ${vn('OM')} = ${lcH(c, ['a', 'b', 'c'])}이다.` });
    }),

    // ②3 무게중심: 꼭짓점과 무게중심을 잇는 벡터를 두 변 벡터로(원문 k + l → 계수를 함께 고르기)
    T('div-cent', '무게중심을 두 변 벡터로 나타내기', '②3', (d) => {
      const P = Object.assign({}, TRG); P.G = [0, 1].map((i) => (TRG.A[i] + TRG.B[i] + TRG.C[i]) / 3);
      const t = d.pick(['AG', 'BG', 'CG', 'GA', 'GB', 'GC']), base = d.pick([['AB', 'AC'], ['AB', 'BC'], ['BA', 'BC'], ['CA', 'CB'], ['AC', 'CB']]);
      const c = coefs(vecOf(P, t), base.map((s) => vecOf(P, s)));
      if (!c || c.every((q) => q.q === 1)) return null;
      const v = t.replace('G', ''), Mv = { A: 'BC', B: 'CA', C: 'AB' }[v];
      return coefPick(d, `삼각형 ABC의 무게중심을 G라고 할 때, 벡터 ${jh(vn(t), '을/를')} 두 벡터 ${vn(base[0])}, ${jh(vn(base[1]), '으로/로')} 나타낸 것은?`, c, base, {
        figure: triFig(P, { thin: 'AG BG CG', dots: ['G'], at: { G: 270 }, say: '삼각형 ABC(A 위, B 왼쪽 아래, C 오른쪽 아래)와 무게중심 G.' }),
        explain: `변 ${Mv}의 중점을 M이라 하면 무게중심 G는 중선 ${v}M을 2 : 1로 내분하므로 ${vn(v + 'G')} = ${frac(2, 3)}${vn(v + 'M')}이고, ${vn(v + 'M')} = ${frac(1, 2)}(${vn(v + Mv[0])} + ${vn(v + Mv[1])})이다. 이를 ${vn(base[0])}, ${jh(vn(base[1]), '으로/로')} 바꾸어 정리하면 ${vn(t)} = ${lcH(c, base)}이다.` });
    }),

    // ②4 무게중심과 두 변의 중점: GP⃗ = p⃗, GQ⃗ = q⃗ 로 변 벡터를(정수 계수 — 식 속 칸)
    T('div-cent2', '무게중심과 중점을 시점·종점으로 한 벡터로 나타내기', '②4', (d) => {
      const P = Object.assign({}, TRG); P.G = [0, 1].map((i) => (TRG.A[i] + TRG.B[i] + TRG.C[i]) / 3); P.P = mid(TRG.B, TRG.C); P.Q = mid(TRG.C, TRG.A);
      const bv = [vecOf(P, 'GP'), vecOf(P, 'GQ')], cof = (x) => intCoefs(vsub(P[x], P.G), bv);
      const t = d.pick(['AC', 'CA', 'AB', 'BA', 'BC', 'CB', 'GC', 'CG', 'AQ', 'QA', 'BP', 'PB']);
      const c = intCoefs(vecOf(P, t), bv);
      if (!c || c.filter(Boolean).length < 2) return null;
      return lcAns(`삼각형 ABC의 무게중심을 G, 두 변 BC, CA의 중점을 각각 P, Q라 하고 ${vn('GP')} = ${vec('p')}, ${vn('GQ')} = ${jh(vec('q'), '이라/라')}고 할 때, 벡터 ${jh(vn(t), '을/를')} ${vec('p')}, ${jh(vec('q'), '으로/로')} 나타내시오.`, vn(t), c, ['p', 'q'], {
        figure: triFig(P, { thin: 'AP BQ', arrows: [['G', 'P', 'p'], ['G', 'Q', 'q']], dots: ['G'], at: { G: 200 }, say: '삼각형 ABC(A 위, B 왼쪽 아래, C 오른쪽 아래), 변 BC의 중점 P, 변 CA의 중점 Q, 두 중선 AP, BQ의 교점인 무게중심 G. 화살표 p는 G에서 P로, q는 G에서 Q로.' }),
        explain: `무게중심은 중선을 2 : 1로 내분하므로 ${vn('GA')} = ${MINUS}2${vec('p')}, ${vn('GB')} = ${MINUS}2${jh(vec('q'), '이다/이다')}. Q는 CA의 중점이므로 ${vn('GQ')} = ${frac(1, 2)}(${vn('GC')} + ${vn('GA')})에서 ${vn('GC')} = 2${vec('q')} + 2${jh(vec('p'), '이다/이다')}. 따라서 ${viaOrigin(t, 'G', cof, ['p', 'q'])}이다.` });
    }),

    // ②5 합동인 두 정삼각형을 이어 붙인 그림에서 다른 삼각형의 무게중심·변의 중점을 두 벡터로
    T('div-twotri', '이어 붙인 정삼각형에서 무게중심·중점을 두 벡터로 나타내기', '②5', (d) => {
      const P = { B: [0, 0], C: [2, 0], D: [4, 0], A: [1, S3], E: [3, S3] };
      const kind = d.pick([['G', '정삼각형 CDE의 무게중심', [3, S3 / 3]], ['M', '선분 DE의 중점', [3.5, S3 / 2]], ['M', '선분 CE의 중점', [2.5, S3 / 2]]]);
      P[kind[0]] = kind[2];
      const base = d.pick([['AB', 'BC'], ['AB', 'AC'], ['AC', 'CD']]);
      const t = 'A' + kind[0], c = coefs(vecOf(P, t), base.map((s) => vecOf(P, s)));
      if (!c || c.every((q) => q.q === 1)) return null;
      return coefPick(d, `그림과 같이 합동인 두 정삼각형 ABC, CDE가 있고, 세 점 B, C, D는 한 직선 위에 있다. ${kind[1]}을 ${jh(kind[0], '이라/라')}고 할 때, 벡터 ${jh(vn(t), '을/를')} 두 벡터 ${vn(base[0])}, ${jh(vn(base[1]), '으로/로')} 나타낸 것은?`, c, base, {
        figure: fig2({ u: 36, pts: P, edges: 'AB BC CA CD DE EC', arrows: [['A', kind[0]]], dots: [kind[0]], at: { [kind[0]]: 270 }, say: `합동인 두 정삼각형 ABC, CDE(B, C, D가 아래쪽에 한 줄로, A, E가 위쪽 꼭짓점)와 ${kind[1]} ${kind[0]}. A에서 ${kind[0]}로 화살표.` }),
        explain: `${vn('AE')} = ${vn('BC')}, ${vn('CD')} = ${jh(vn('BC'), '이고/이고')}, 정삼각형의 꼭짓점에서 밑변의 중점으로 가는 벡터는 두 변 벡터의 합의 절반, 무게중심은 그 벡터의 ${frac(2, 3)}이다. 이를 ${vn(base[0])}, ${jh(vn(base[1]), '으로/로')} 바꾸어 정리하면 ${vn(t)} = ${lcH(c, base)}이다.` });
    }),

    // ②6 정육면체: 한 면의 두 대각선의 교점 K와 다른 꼭짓점을 잇는 벡터(고르기)
    T('div-cube', '정육면체에서 면의 대각선의 교점을 잇는 벡터', '②6', (d) => cubeK(d, false)),
    // ②6 같은 벡터가 주어진 벡터와 평행할 때의 배수(「설명하시오」→ 배수 k)
    T('div-cube-k', '정육면체에서 면의 대각선의 교점을 잇는 벡터와 평행한 벡터의 배수', '②6', (d) => cubeK(d, true))
  ];
  // 정육면체 ABCD-EFGH(한 모서리 2), AB⃗ = a⃗, AD⃗ = b⃗, AE⃗ = c⃗. 면의 두 대각선의 교점 K, 그 면에 있지 않은 꼭짓점 X.
  function cubeK(d, askK) {
    const P = box(2, 2, 2), FACES = { ABCD: 'ABCD', EFGH: 'EFGH', ABFE: 'ABFE', DCGH: 'DCGH', ADHE: 'ADHE', BCGF: 'BCGF' };
    const face = d.pick(Object.keys(FACES)), X = d.pick('ABCDEFGH'.split('').filter((x) => !face.includes(x)));
    const Kp = [0, 1, 2].map((i) => (P[face[0]][i] + P[face[2]][i]) / 2), Pk = Object.assign({}, P, { K: Kp });
    const bv = ['AB', 'AD', 'AE'].map((s) => vecOf(P, s)), c = coefs(vsub(Kp, P[X]), bv);
    if (!c) return null;
    const u = c.map((q) => q.p * (2 / q.q)), sg = u.find((x) => x) > 0 ? 1 : -1, uu = u.map((x) => x * sg), k = Q(sg, 2);
    if (!same(c.map((q) => q.p / q.q), uu.map((x) => x * sg / 2))) return null;
    const figure = fig3({ view: { u: 36, k: 0.8, ang: 220 }, pts: Pk, edges: BOX_EDGES, dash: BOX_HID, thin: `${face[0]}${face[2]} ${face[1]}${face[3]}`, arrows: [[X, 'K']], dots: ['K'], at: { K: 90 },
      say: `정육면체 ABCD-EFGH(윗면 ABCD — A 앞 왼쪽, B 앞 오른쪽, C 뒤 오른쪽, D 뒤 왼쪽, E·F·G·H는 A·B·C·D의 아래)와 면 ${face}의 두 대각선 ${face[0]}${face[2]}, ${face[1]}${face[3]}의 교점 K. ${X}에서 K로 화살표.` });
    const cof = (x) => intCoefs(vsub(P[x], P.A), bv), f0 = face[0], f2 = face[2], cofK = cof(f0).map((v, i) => Q(v + cof(f2)[i], 2)), nm3 = ['a', 'b', 'c'];
    const lead = `정육면체 ABCD-EFGH에서 면 ${face}의 두 대각선 ${f0}${f2}, ${face[1]}${face[3]}의 교점을 K라 하고 ${vn('AB')} = ${vec('a')}, ${vn('AD')} = ${vec('b')}, ${vn('AE')} = ${jh(vec('c'), '이라/라')}고 하자.`;
    const akH = f0 === 'A' ? `${frac(1, 2)}${vn('A' + f2)}` : `${frac(1, 2)}(${vn('A' + f0)} + ${vn('A' + f2)})`;
    const why = `K는 대각선 ${f0}${f2}의 중점이므로 ${vn('AK')} = ${akH} = ${lcH(cofK, nm3)}이다. ` + (X === 'A' ? `따라서 ${vn('AK')} = ${lcH(c, nm3)}` : `${vn('A' + X)} = ${jh(lcH(cof(X), nm3), '이므로/이므로')} ${vn(X + 'K')} = ${vn('AK')} ${MINUS} ${vn('A' + X)} = ${lcH(c, nm3)}`);
    if (!askK) return coefPick(d, `${lead} 벡터 ${jh(vn(X + 'K'), '을/를')} ${vlist(abc)}로 나타낸 것은?`, c, nm3, { figure, explain: `${why}이다.` });
    const uH = lcH(uu, ['a', 'b', 'c']);
    return numA(`${lead} 벡터 ${jh(vn(X + 'K'), '이/가')} 벡터 ${jh(uH, '과/와')} 평행할 때, ${vn(X + 'K')} = ${V('k')}(${uH})를 만족시키는 실수 ${V('k')}의 값은?`, k, {
      figure, explain: `${why} = ${sg < 0 ? MINUS : ''}${frac(1, 2)}(${uH})이므로 ${V('k')} = ${sg < 0 ? MINUS : ''}${frac(1, 2)}이다.`,
      facts: { value: `${sg}/2`, derived: [2] } });
  }

  // ══ 바. 벡터의 평행 ══
  const NP = '서로 평행하지 않고 영벡터가 아닌 두 벡터';
  const par = [
    // ②7 두 벡터가 평행하도록 하는 상수(차례 1 뒤 벡터의 b⃗ 계수가 미지수, 차례 2 앞 벡터의 계수가 미지수이고 뒤 벡터를 b⃗ 부터 적은 꼴 — 중06)
    T('par-k', '두 벡터가 평행하도록 하는 상수', '②7', (d, n) => {
      const p = d.pick([1, 2, -1, 3, -3]), q = d.pick([1, 2, 3, -2, 4, -1]), r = d.pick([2, 3, -3, 4, -2, 6, -1]);
      if (p === r) return null;
      if (n === 0) {
        // (p, q) ∥ (r, k)  →  k = qr/p
        if ((q * r) % p !== 0 || Math.abs((q * r) / p) > 24) return null;
        const k = (q * r) / p, t = rat(r / p);
        return numA(`${NP} ${vlist(ab)}에 대하여 두 벡터 ${lcH([p, q], ['a', 'b'])}, ${kx(r)}${vec('a')} + ${V('k')}${jh(vec('b'), '이/가')} 서로 평행하도록 하는 실수 ${V('k')}의 값은?`, k, {
          explain: `두 벡터가 평행하면 ${kx(r)}${vec('a')} + ${V('k')}${vec('b')} = ${V('t')}(${lcH([p, q], ['a', 'b'])})인 실수 ${V('t')}가 있다. ${vlist(ab)}가 평행하지 않으므로 계수를 비교하면 ${V('t')} = ${qH(t)}, ${V('k')} = ${qH(t)} × ${pn(q)} = ${sn(k)}이다.`,
          facts: { calc: [[`${jsn(q)}*${jsn(r)}/${jsn(p)}`, 0]] } });
      }
      // (p, m) ∥ (r, q)(뒤 벡터는 qb⃗ + ra⃗ 로 적는다)  →  m = pq/r
      if ((p * q) % r !== 0 || Math.abs((p * q) / r) > 24) return null;
      const m = (p * q) / r, t = rat(p / r);
      return numA(`${NP} ${vlist(ab)}에 대하여 두 벡터 ${kx(p)}${vec('a')} + ${V('m')}${vec('b')}, ${kx(q)}${vec('b')} ${r < 0 ? MINUS : '+'} ${Math.abs(r) === 1 ? '' : Math.abs(r)}${jh(vec('a'), '이/가')} 서로 평행할 때, 실수 ${V('m')}의 값은?`, m, {
        explain: `${kx(p)}${vec('a')} + ${V('m')}${vec('b')} = ${V('t')}(${lcH([r, q], ['a', 'b'])})인 실수 ${V('t')}가 있다. ${vec('a')}의 계수를 비교하면 ${V('t')} = ${qH(t)}, ${vec('b')}의 계수에서 ${V('m')} = ${qH(t)} × ${pn(q)} = ${sn(m)}이다.`,
        facts: { calc: [[`${jsn(p)}*${jsn(q)}/${jsn(r)}`, 0]] } });
    }, { count: 2 }),

    // ②8 세 벡터의 결합으로 만든 두 벡터가 평행하도록 하는 상수
    T('par-pqr', '세 벡터를 결합한 두 벡터가 평행하도록 하는 상수', '②8', (d) => {
      const pv = [d.int(-3, 3), d.int(-3, 3)], qv = [d.int(-3, 3), d.int(-3, 3)], r0 = d.pick([-2, -1, 1, 2, 3]);
      const [x1, x2] = d.pick([[1, 1], [1, -1], [2, 1], [1, 2]]), [y1, y2] = d.pick([[-1, 1], [1, 1], [2, 1], [-2, 1]]);
      const X = [x1 * pv[0] + x2 * qv[0], x1 * pv[1] + x2 * qv[1]], Ya = y1 * qv[0] + y2 * r0;
      if (X.some((v) => v === 0) || Ya === 0 || pv.every((v) => v === 0) || qv.some((v) => v === 0)) return null;
      // X ∥ Y: X_a·Y_b = X_b·Y_a, Y_b = y1·q_b + y2·k
      const Yb = (X[1] * Ya) / X[0], k = (Yb - y1 * qv[1]) / y2;
      if (!Number.isInteger(Yb) || !Number.isInteger(k) || Math.abs(k) > 20) return null;
      const comb = (c1, n1, c2, n2) => `${kx(c1)}${vec(n1)} ${c2 < 0 ? MINUS : '+'} ${Math.abs(c2) === 1 ? '' : Math.abs(c2)}${vec(n2)}`;
      const Xh = comb(x1, 'p', x2, 'q'), Yh = comb(y1, 'q', y2, 'r');
      return numA(`${NP} ${vlist(ab)}에 대하여 ${vec('p')} = ${lcH(pv, ['a', 'b'])}, ${vec('q')} = ${lcH(qv, ['a', 'b'])}, ${vec('r')} = ${kx(r0)}${vec('a')} + ${V('k')}${jh(vec('b'), '일/일')} 때, 두 벡터 ${Xh}, ${jh(Yh, '이/가')} 서로 평행하도록 하는 실수 ${V('k')}의 값은?`, k, {
        explain: `${Xh} = ${jh(lcH(X, ['a', 'b']), '이고/이고')} ${Yh} = ${kx(Ya)}${vec('a')} + (${sn(y1 * qv[1])} + ${y2 === 1 ? '' : y2}${V('k')})${jh(vec('b'), '이다/이다')}. 평행하려면 ${vec('a')}, ${vec('b')}의 계수의 비가 같아야 하므로 ${sn(X[0])} : ${sn(X[1])} = ${sn(Ya)} : (${sn(y1 * qv[1])} + ${y2 === 1 ? '' : y2}${V('k')})에서 ${V('k')} = ${sn(k)}이다.`,
        facts: { calc: [[`((${x1}*${jsn(pv[1])}+${jsn(x2)}*${jsn(qv[1])})*(${jsn(y1)}*${jsn(qv[0])}+${y2}*${jsn(r0)})/(${x1}*${jsn(pv[0])}+${jsn(x2)}*${jsn(qv[0])})-${jsn(y1)}*${jsn(qv[1])})/${y2}`, 0]] } });
    }),

    // ②8 「평행함을 보이시오」→ 두 결합 벡터의 배수 t(늘 정수가 아닌 분수)
    T('par-pqr-t', '세 벡터를 결합한 두 평행한 벡터의 배수', '②8', (d) => {
      const den = d.pick([2, 3, 5]), top = d.pick([-6, -4, -3, -2, -1, 1, 2, 3, 4, 6]);
      const t = Q(top, den);
      if (t.q === 1) return null;
      const Y = [den * d.pick([-2, -1, 1, 2]), den * d.pick([-2, -1, 1, 2])].map((v) => v / (t.q === den ? 1 : 1));
      const X = Y.map((v) => (v * t.p) / t.q), qv = [d.int(-3, 3), d.int(-3, 3)];
      const [x1, x2] = d.pick([[1, -1], [1, 1], [1, 2]]), [y1, y2] = d.pick([[-2, 1], [2, 1], [-1, 1], [1, -1]]);
      const pv = X.map((v, i) => (v - x2 * qv[i]) / x1), rv = Y.map((v, i) => (v - y1 * qv[i]) / y2);
      if ([pv, qv, rv].some((w) => w.every((v) => v === 0) || w.some((v) => Math.abs(v) > 9))) return null;
      const comb = (c1, n1, c2, n2) => `${kx(c1)}${vec(n1)} ${c2 < 0 ? MINUS : '+'} ${Math.abs(c2) === 1 ? '' : Math.abs(c2)}${vec(n2)}`;
      const Xh = comb(x1, 'p', x2, 'q'), Yh = comb(y1, 'q', y2, 'r');
      const ia = Y[0] !== 0 ? 0 : 1;
      return numA(`${NP} ${vlist(ab)}에 대하여 ${vec('p')} = ${lcH(pv, ['a', 'b'])}, ${vec('q')} = ${lcH(qv, ['a', 'b'])}, ${vec('r')} = ${jh(lcH(rv, ['a', 'b']), '일/일')} 때, 두 벡터 ${Xh}, ${jh(Yh, '은/는')} 서로 평행하다. ${Xh} = ${V('t')}(${Yh})를 만족시키는 실수 ${V('t')}의 값은?`, t, {
        explain: `${Xh} = ${jh(lcH(X, ['a', 'b']), '이고/이고')} ${Yh} = ${jh(lcH(Y, ['a', 'b']), '이다/이다')}. ${lcH(X, ['a', 'b'])} = ${V('t')}(${lcH(Y, ['a', 'b'])})에서 계수를 비교하면 ${V('t')} = ${t.p < 0 ? MINUS : ''}${frac(Math.abs(t.p), t.q)}이다. 한 벡터가 다른 벡터의 실수배이므로 두 벡터는 평행하다.`,
        facts: { value: `(${x1}*${jsn(pv[ia])}+${jsn(x2)}*${jsn(qv[ia])})/(${jsn(y1)}*${jsn(qv[ia])}+${jsn(y2)}*${jsn(rv[ia])})` } });
    }),

    // ②9 네 점 사이의 벡터가 평행하도록 하는 상수(차례 1 PQ⃗ ∥ PR⃗ — 대13, 차례 2 PQ⃗ ∥ RS⃗ — 중20)
    T('par-four', '네 점 사이의 벡터가 평행하도록 하는 상수', '②9', (d, n) => {
      const P = [d.int(-3, 4), d.int(-3, 6)], Qv = [0, d.int(-3, 6)];
      if (n === 0) {
        const R = [d.int(-3, 8), d.int(-3, 8)];
        if (R[1] === P[1] || Qv[1] === P[1] || Qv[1] === 0 || P.every((v) => v === 0) || R.every((v) => v === 0)) return null;
        const m = P[0] + ((Qv[1] - P[1]) * (R[0] - P[0])) / (R[1] - P[1]);
        if (!Number.isInteger(m) || Math.abs(m) > 12 || (m === P[0])) return null;
        return numA(`${NP} ${vlist(ab)}에 대하여 ${vn('OP')} = ${lcH(P, ['a', 'b'])}, ${vn('OQ')} = ${V('m')}${vec('a')} ${Qv[1] < 0 ? MINUS : '+'} ${Math.abs(Qv[1]) === 1 ? '' : Math.abs(Qv[1])}${vec('b')}, ${vn('OR')} = ${jh(lcH(R, ['a', 'b']), '일/일')} 때, 두 벡터 ${vn('PQ')}, ${jh(vn('PR'), '이/가')} 평행하도록 하는 실수 ${V('m')}의 값은?`, m, {
          explain: `${vn('PQ')} = ${vn('OQ')} ${MINUS} ${vn('OP')} = (${V('m')}${plusN(-P[0])})${vec('a')}${plusV(Qv[1] - P[1], 'b')}, ${vn('PR')} = ${jh(lcH([R[0] - P[0], R[1] - P[1]], ['a', 'b']), '이다/이다')}. ${vn('PQ')} = ${V('t')}${vn('PR')}이면 ${vec('b')}의 계수에서 ${V('t')} = ${qH(rat((Qv[1] - P[1]) / (R[1] - P[1])))}, ${vec('a')}의 계수에서 ${V('m')} = ${sn(m)}이다.`,
          facts: { calc: [[`${jsn(P[0])}+(${jsn(Qv[1])}-${jsn(P[1])})*(${jsn(R[0])}-${jsn(P[0])})/(${jsn(R[1])}-${jsn(P[1])})`, 0]] } });
      }
      const Qp = [d.int(-4, 4), d.int(-3, 4)], A = Qp[0] - P[0], Bc = Qp[1] - P[1], r1 = d.int(-6, 2), s1 = d.int(1, 3), s2 = d.int(-2, 3);
      if (A === 0 || Bc === 0 || A + Bc === 0 || s2 === 0 || s1 === r1 || P.every((v) => v === 0)) return null;
      const m = (A * s2 - Bc * (s1 - r1)) / (A + Bc);
      if (!Number.isInteger(m) || Math.abs(m) > 12 || m + s1 - r1 === 0) return null;
      const os = `(${V('m')} + ${s1})${vec('a')} ${s2 < 0 ? MINUS : '+'} ${Math.abs(s2) === 1 ? '' : Math.abs(s2)}${vec('b')}`;
      return numA(`${NP} ${vlist(ab)}에 대하여 다섯 개의 점 O, P, Q, R, S가 ${vn('OP')} = ${lcH(P, ['a', 'b'])}, ${vn('OQ')} = ${lcH(Qp, ['a', 'b'])}, ${vn('OR')} = ${r1 === 0 ? '' : kx(r1) + vec('a') + ' + '}${V('m')}${vec('b')}, ${vn('OS')} = ${os}를 만족시킨다. 두 벡터 ${vn('PQ')}, ${jh(vn('RS'), '이/가')} 서로 평행할 때, 실수 ${V('m')}의 값은?`, m, {
        explain: `${vn('PQ')} = ${jh(lcH([A, Bc], ['a', 'b']), '이고/이고')} ${vn('RS')} = (${V('m')}${plusN(s1 - r1)})${vec('a')} + (${sn(s2)} ${MINUS} ${V('m')})${jh(vec('b'), '이다/이다')}. ${vn('RS')} = ${V('t')}${vn('PQ')}에서 ${V('m')}${plusN(s1 - r1)} = ${kx(A)}${V('t')}, ${sn(s2)} ${MINUS} ${V('m')} = ${kx(Bc)}${V('t')}이고, 두 식을 풀면 ${V('m')} = ${sn(m)}이다.`,
        facts: { calc: [[`(${jsn(A)}*${jsn(s2)}-${jsn(Bc)}*(${s1}-${jsn(r1)}))/(${jsn(A)}+${jsn(Bc)})`, 0]], derived: [Math.abs(A), Math.abs(Bc)] } });
    }, { count: 2 }),

    // ②10 OC⃗ = sOA⃗ + tOB⃗ (s + t = 1) 에서 AC⃗ = kAB⃗ (차례 1), BC⃗ = kBA⃗ (차례 2) — 「한 직선 위에 있음을 보이시오」→ 배수
    T('par-line3', '세 점이 한 직선 위에 있음을 보이는 배수', '②10', (d, n) => {
      const s = d.pick([-3, -2, -1, 2, 3, 4]), t = 1 - s;
      const ask = n === 0 ? ['AC', 'AB', t, `1-(${jsn(s)})`] : ['BC', 'BA', s, `${jsn(s)}`];
      return numA(`평면 위의 서로 다른 네 점 O, A, B, C에 대하여 ${nb(`${vn('OC')} = ${kx(s)}${vn('OA')} ${t < 0 ? MINUS : '+'} ${Math.abs(t) === 1 ? '' : Math.abs(t)}${vn('OB')}`)}가 성립한다. ${vn(ask[0])} = ${V('k')}${jh(vn(ask[1]), '을/를')} 만족시키는 실수 ${V('k')}의 값은?`, ask[2], {
        explain: n === 0
          ? `${vn('AC')} = ${vn('OC')} ${MINUS} ${vn('OA')} = ${lcH([s - 1, t], ['OA', 'OB'])} = ${kx(t)}(${vn('OB')} ${MINUS} ${vn('OA')}) = ${kx(t)}${jh(vn('AB'), '이므로/이므로')} ${V('k')} = ${sn(t)}이다. 따라서 세 점 A, B, C는 한 직선 위에 있다.`
          : `${vn('BC')} = ${vn('OC')} ${MINUS} ${vn('OB')} = ${lcH([s, t - 1], ['OA', 'OB'])} = ${kx(s)}(${vn('OA')} ${MINUS} ${vn('OB')}) = ${kx(s)}${jh(vn('BA'), '이므로/이므로')} ${V('k')} = ${sn(s)}이다. 따라서 세 점 A, B, C는 한 직선 위에 있다.`,
        facts: { calc: [[ask[3], 0]] } });
    }, { count: 2 }),

    // ②11 세 점이 한 직선 위에 있도록 하는 상수(정수 — AC⃗ = tAB⃗ 로 푼다)
    T('par-line3k', '세 점이 한 직선 위에 있도록 하는 상수', '②11', (d) => {
      const simple = d.int(0, 3) === 0;
      const a = simple ? [1, 0] : [d.int(-2, 3), d.int(-2, 2)], b = simple ? [0, d.pick([1, 2])] : [d.int(-2, 3), d.int(-2, 2)], c2 = d.int(-4, 6);
      if (b[1] === a[1] || (a[0] === 0 && a[1] === 0) || (b[0] === 0 && b[1] === 0) || c2 === a[1] || c2 === b[1] || c2 === 0) return null;
      const k = a[0] + ((c2 - a[1]) * (b[0] - a[0])) / (b[1] - a[1]);
      if (!Number.isInteger(k) || Math.abs(k) > 12 || (a[0] * b[1] - a[1] * b[0] === 0)) return null;
      const tq = rat((c2 - a[1]) / (b[1] - a[1]));
      return numA(`평면 위의 서로 다른 네 점 O, A, B, C와 ${NP} ${vlist(ab)}에 대하여 ${vn('OA')} = ${lcH(a, ['a', 'b'])}, ${vn('OB')} = ${lcH(b, ['a', 'b'])}, ${vn('OC')} = ${V('k')}${vec('a')} ${c2 < 0 ? MINUS : '+'} ${Math.abs(c2) === 1 ? '' : Math.abs(c2)}${jh(vec('b'), '일/일')} 때, 세 점 A, B, C가 한 직선 위에 있도록 하는 실수 ${V('k')}의 값은?`, k, {
        explain: `${vn('AB')} = ${jh(lcH([b[0] - a[0], b[1] - a[1]], ['a', 'b']), '이고/이고')} ${vn('AC')} = (${V('k')}${plusN(-a[0])})${vec('a')}${jh(plusV(c2 - a[1], 'b'), '이다/이다')}. 세 점이 한 직선 위에 있으면 ${vn('AC')} = ${V('t')}${vn('AB')}인 실수 ${V('t')}가 있다. ${vec('b')}의 계수에서 ${V('t')} = ${qH(tq)}, ${vec('a')}의 계수에서 ${V('k')} = ${sn(k)}이다.`,
        facts: { calc: [[`${jsn(a[0])}+(${jsn(c2)}-${jsn(a[1])})*(${jsn(b[0])}-${jsn(a[0])})/(${jsn(b[1])}-${jsn(a[1])})`, 0]] } });
    })
  ];

  // ══ 사. 벡터의 합의 크기와 활용 ══
  const size = [
    // ②14 정삼각형(차례 1)·정사각형(차례 2)에서 합을 한 벡터의 실수배로 모아 크기 구하기
    T('size-collapse', '정삼각형·정사각형에서 합을 모아 크기 구하기', '②14', (d, n) => {
      const s = d.int(2, 6);
      if (n === 0) {
        const eq = d.pick([[1, 2], [0, 2], [0, 1]]), v = d.pick([-2, -1, 1, 2]), w = d.until(() => d.pick([-2, -1, 1, 2, 3]), (x) => x !== v);
        const c = [0, 0, 0]; c[eq[0]] = v; c[eq[1]] = v; const other = [0, 1, 2].find((i) => !eq.includes(i)); c[other] = w;
        const kk = Math.abs(w - v), ans = kk * s, nm = ['a', 'b', 'c'];
        return N(`한 변의 길이가 ${s}인 정삼각형 ABC에서 ${vn('AB')} = ${vec('a')}, ${vn('BC')} = ${vec('b')}, ${vn('CA')} = ${jh(vec('c'), '이라/라')}고 할 때, ${absH(lcH(c, nm))}의 값은?`, ans, {
          figure: K.fig2({ u: 52, pts: { A: [0, S3], B: [-1, 0], C: [1, 0] }, edges: 'AB BC CA', arrows: [['A', 'B', 'a'], ['B', 'C', 'b'], ['C', 'A', 'c']], say: `한 변의 길이가 ${s}인 정삼각형 ABC. 화살표 a는 A에서 B로, b는 B에서 C로, c는 C에서 A로.` }),
          explain: `${lcH([1, 1, 1], nm)} = ${vn('AB')} + ${vn('BC')} + ${vn('CA')} = ${jh(vn('AA'), '이므로/이므로')} ${vec(nm[eq[0]])} + ${vec(nm[eq[1]])} = ${MINUS}${vec(nm[other])}이다. 따라서 ${lcH(c, nm)} = ${lcH([w - v], [nm[other]])}이고 그 크기는 ${kk} × ${s} = ${ans}이다.`.replace(vn('AA'), K.ZV),
          facts: { calc: [[`(${jsn(w)}-(${jsn(v)}))*${s}*${w - v < 0 ? '(0-1)' : '1'}`, 0]], derived: [Math.abs(w), Math.abs(v)] } });
      }
      const which = d.pick([0, 1]), z = d.pick([-1, 1, 2, -2]), x = which === 0 ? -z : d.int(-2, 3), y = which === 1 ? -z : d.int(-2, 3);
      const ca = x + z, cb = y + z;
      if ((ca === 0) === (cb === 0)) return null;
      const kk = Math.abs(ca || cb), ans = kk * s;
      return N(`한 변의 길이가 ${s}인 정사각형 ABCD에서 ${vn('AB')} = ${vec('a')}, ${vn('AD')} = ${vec('b')}, ${vn('AC')} = ${jh(vec('c'), '이라/라')}고 할 때, ${absH(lcH([x, y, z], ['a', 'b', 'c']))}의 값은?`, ans, {
        figure: K.fig2({ u: 34, pts: { A: [0, 3], B: [0, 0], C: [3, 0], D: [3, 3] }, edges: 'AB BC CD DA', arrows: [['A', 'B', 'a'], ['A', 'D', 'b', 'in'], ['A', 'C', 'c', 'in']], say: `한 변의 길이가 ${s}인 정사각형 ABCD(A 왼쪽 위, B 왼쪽 아래, C 오른쪽 아래, D 오른쪽 위). 화살표 a는 A에서 B로, b는 A에서 D로, c는 A에서 C로.` }),
        explain: `${vec('c')} = ${vn('AB')} + ${vn('BC')} = ${vec('a')} + ${jh(vec('b'), '이므로/이므로')} ${lcH([x, y, z], ['a', 'b', 'c'])} = ${lcH([ca, cb], ['a', 'b'])}이다. 크기는 ${kk} × ${s} = ${ans}이다.`,
        facts: { calc: [[`(${jsn(ca || cb)})*${s}*${(ca || cb) < 0 ? '(0-1)' : '1'}`, 0]], derived: [kk] } });
    }, { count: 2 }),

    // ②18 세 힘의 평형: OC⃗ = −(OA⃗ + OB⃗) — 120°(크기 비 1 : 2), 90°·60°(크기가 같다). 답은 늘 k√q(k ≥ 2).
    T('size-force', '세 힘의 평형에서 힘의 크기', '②18', (d) => {
      const [th, ratioB, q] = d.pick([[120, 2, 3], [90, 1, 2], [60, 1, 3]]), p = d.int(2, 5), pb = p * ratioB;
      const why = th === 120 ? `평행사변형 OADB를 그리면 ${vn('OA')} + ${vn('OB')} = ${vn('OD')}이다. 삼각형 OBD에서 ${SG('OB')} = ${pb}, ${SG('BD')} = ${p}, ∠OBD = 60°이므로 ∠BDO = 90°인 직각삼각형이고 ${SG('OD')} = ${p}${rt(3)}이다`
        : th === 90 ? `두 힘이 수직이고 크기가 같으므로 ${vn('OA')} + ${vn('OB')}는 한 변이 ${p}인 정사각형의 대각선이고 크기는 ${p}${rt(2)}이다`
          : `두 힘의 크기가 같고 사이의 각이 60°이므로 ${vn('OA')} + ${vn('OB')}는 한 변이 ${p}이고 한 내각이 60°인 마름모의 긴 대각선이며 크기는 ${p}${rt(3)}이다`;
      return lenAns(`한 지점 O에 놓인 물체를 세 힘 ${vn('OA')}, ${vn('OB')}, ${vn('OC')}가 잡아당기고 있다. ${nb(`|${vn('OA')}| = ${p}`)}, ${nb(`|${vn('OB')}| = ${pb}`)}, ∠AOB = ${th}°이고 이 물체가 움직이지 않을 때, 벡터 ${vn('OC')}의 크기는?`, p, q, {
        figure: forceFig3(th, p, pb),
        explain: `물체가 움직이지 않으므로 세 힘의 합은 영벡터이고 ${vn('OC')} = ${MINUS}(${vn('OA')} + ${vn('OB')})이다. ${why}. 따라서 |${vn('OC')}| = ${p}${rt(q)}이다.`,
        facts: { calc: [[String(p), 0], [String(q), 1]], derived: [q] } });
    }),

    // ②19 강물과 배의 속도: 실제 속도 = 배의 속도 + 강물의 속도(차례 1 배의 속도, 차례 2 강물의 속도를 구한다)
    T('size-boat', '강물과 배의 속도', '②19', (d, n) => {
      const DIR = ['동', '북동', '북', '북서', '서', '남서', '남', '남동'], nm = (i) => DIR[((i % 8) + 8) % 8] + '쪽';
      // 두 속도는 서로 수직이고 크기가 같다(c2 = c1 ± 90°). 합 u(c1) + u(c2) 는 c1 + turn/2 쪽, 차 u(c1) − u(c2) 는 c1 − turn/2 쪽이고 크기는 √2 배이다.
      const s = d.pick([4, 6, 8, 10, 12]), c1 = 2 * d.int(0, 3), turn = d.pick([2, -2]), c2 = c1 + turn, diag = c1 + turn / 2, rdir = c1 - turn / 2;
      const r2 = `${s}${rt(2)}`;
      if (n === 0) {
        // 강물 c1 방향 s, 배 c2 방향 s → 실제 diag 방향 s√2. 강물과 실제 속도를 주고 배의 속도를 묻는다.
        const opts = [[c2, s], [c2 + 4, s], [c2, r2], [diag, s], [c1 + 4, s]].map(([x, sp], i) => ({ h: `${nm(x)}으로 시속 ${sp} km`, ok: i === 0 }));
        return pickOne(d, `강물의 속도를 ${vec('v')}<sub>r</sub>, 배의 속도를 ${vec('v')}<sub>a</sub>, 강물의 영향을 받아 배가 실제로 움직이는 속도를 ${vec('v')}<sub>b</sub>라고 하면 ${vec('v')}<sub>b</sub> = ${vec('v')}<sub>a</sub> + ${vec('v')}<sub>r</sub>이다. ${nm(c1)}으로 시속 ${s} km로 흐르는 강물 위에서 배가 실제로 ${nm(diag)}으로 시속 ${r2} km로 움직이고 있을 때, 이 배의 속도는?`, opts, {
          explain: `${vec('v')}<sub>a</sub> = ${vec('v')}<sub>b</sub> ${MINUS} ${vec('v')}<sub>r</sub>이다. ${nm(diag)}으로 ${r2} km 가는 화살표는 ${nm(c1)}으로 ${s} km와 ${nm(c2)}으로 ${s} km를 이은 것이므로, 강물의 속도를 빼면 ${nm(c2)}으로 시속 ${s} km가 남는다.` });
      }
      const opts = [[rdir, r2], [rdir + 4, r2], [rdir, s], [diag, r2], [c1 + 4, s]].map(([x, sp], i) => ({ h: `${nm(x)}으로 시속 ${sp} km`, ok: i === 0 }));
      return pickOne(d, `강물의 속도를 ${vec('v')}<sub>r</sub>, 배의 속도를 ${vec('v')}<sub>a</sub>, 강물의 영향을 받아 배가 실제로 움직이는 속도를 ${vec('v')}<sub>b</sub>라고 하면 ${vec('v')}<sub>b</sub> = ${vec('v')}<sub>a</sub> + ${vec('v')}<sub>r</sub>이다. 강물 위에서 ${nm(c2)}으로 시속 ${s} km의 속도로 출발한 배가 강물의 영향을 받아 실제로 ${nm(c1)}으로 시속 ${s} km로 움직이고 있을 때, 강물의 속도는?`, opts, {
        explain: `${vec('v')}<sub>r</sub> = ${vec('v')}<sub>b</sub> ${MINUS} ${vec('v')}<sub>a</sub>이다. ${nm(c1)}으로 ${s} km 가는 화살표에서 ${nm(c2)}으로 ${s} km 가는 화살표를 빼면(${nm(c2 + 4)}으로 ${s} km를 더하면) 크기가 ${r2}이고 ${nm(rdir)}을 향하는 화살표가 된다.` });
    }, { count: 2 })
  ];

  // 세 힘 그림: O 에서 OA⃗(오른쪽 위), OB⃗(∠AOB = θ), OC⃗ = −(OA⃗ + OB⃗)
  function forceFig3(th, pa, pb) {
    const b = Board(), u = 70 / pb, o = [0, 0], a0 = 40, A = at(o, pa * u, a0), Bp = at(o, pb * u, a0 + th);
    const sum = [A[0] + Bp[0] - 2 * o[0], A[1] + Bp[1] - 2 * o[1]], Cp = [-sum[0], -sum[1]];
    arrowTo(b, o, A); arrowTo(b, o, Bp); arrowTo(b, o, Cp);
    b.name(A, 'A', a0, 10); b.name(Bp, 'B', a0 + th, 10); b.name(Cp, 'C', (Math.atan2(-Cp[1], Cp[0]) * 180 / Math.PI + 360) % 360, 10);
    b.angle(o, a0, a0 + th, th + '°', { r: 16 });
    b.name(o, 'O', a0 + th / 2 + 180, 12);
    return b.svg(attr(`한 점 O에서 나가는 세 힘 OA, OB, OC. 크기는 OA가 ${pa}, OB가 ${pb}이고 ∠AOB = ${th}°. OC는 두 힘의 합과 반대쪽을 향한다.`));
  }

  B.addTypes('11-4-6', 'div', div);
  B.addTypes('11-4-6', 'par', par);
  B.addTypes('11-4-6', 'size', size);
})(typeof window !== 'undefined' ? window : globalThis);
