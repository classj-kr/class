// 고등학교 기하 Ⅲ-1 벡터의 연산 — 실력 문항(수집본의 중단원 평가·대단원 평가 끝 문제, 교과서 역량 키우기의 전개도).
// 단원 틀·싣는 기준·뺀 것과 까닭은 11-4-6a.js 머리에 적었다. 도구는 B.kit.u46(a 파일)을 쓴다.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것
//  - 시점과 종점만 바꾼 벡터를 떠올리고, 평행이동해 겹치는 다른 선분(같은 벡터·반대 벡터)을 놓친다.
//  - 음의 실수배를 같은 쪽으로 그린다: AB⃗ = −3AQ⃗ 인 점 Q 를 선분 AB 위에 찍는다(Q 는 BA 의 A 쪽 연장선 위에 있다).
//  - ½(AB⃗ + AC⃗)이 선분 BC 의 중점으로 가는 벡터라는 것을 떠올리지 못한다.
//  - |AC⃗ + BD⃗| 를 |AC⃗| + |BD⃗| 로 여긴다(대각선 벡터의 합은 변 벡터의 두 배이다).
//  - 전개도를 접었을 때 겹치는 꼭짓점을 놓친다.
//
// 실력에 둔 것(사용자가 정한 잣대 — ① 뜻을 정확히 대야 풀리는 함정, ② 세 단계 넘게 잇는 것)
//  ① hard-area(음의 실수배는 반대쪽, 합의 절반은 중점 — 넓이를 묻는 삼각형을 QCP 로 바꾸면 중점이라 넓이가 같다는 것까지 대야 한다),
//     hard-para(대각선 벡터의 합·차는 변 벡터의 두 배), hard-hyper(OA⃗ 를 BO⃗ 로 바꿔 한 벡터 BP⃗ 로 만들고, 원과 쌍곡선의 교점이 셋인 경우를 따진다)
//  ② hard-net(전개도 접기 → 같은 벡터 → 잇기), hard-mid(네 벡터를 같은 벡터로 바꿔 한 벡터로 → 크기), hard-trisq(잇기 → 수선 → 피타고라스),
//     hard-semi(삼등분 → 정삼각형·마름모 → 같은 벡터로 모으기 → 반지름 → 넓이), hard-pb(차 → 평행한 두 직선 → 넓이의 비 → 한 변),
//     hard-rect(차로 바꿔 지우기 → 중점의 합 → 점의 자리 → 넓이의 비)
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, N, inline } = B.kit;
  const { MINUS, nb, V, SG, rt, tail } = B.kit.mid;
  const { vec, jh, plot, ms } = B.kit.hs;
  const { Board, at, mid, dist } = B.kit.mgeo;
  const K = B.kit.u46;
  const { absH, H, same, vecOf, segsOf, rev, vn, lcH, vlist, abc, attr, lcAns, lenAns, intCoefs, viaOrigin, arrowTo, vname, fig2, TRI, S3, vadd, vsub, vlen, sn, jsn } = K;
  const S1 = K.S1;

  // ── 정육면체의 전개도(교과서 그림의 이름 자리) ──
  // 전개도 위의 자리(한 칸 = 정육면체의 한 모서리): 가운데 줄 정사각형 넷(아랫줄 A, B, F, E, 윗줄 둘째 C, 오른쪽 끝 D), 첫째 칸 위에 H, G, 둘째 칸 아래에 한 칸.
  const NET = { A: [0, 0], B: [1, 0], F: [2, 0], E: [3, 0], C: [1, 1], D: [4, 1], H: [0, 2], G: [1, 2] };
  // 접은 정육면체(아랫면 ABFE, 윗면 DCGH — D·C·G·H 는 A·B·F·E 바로 위)
  const CUBE = { A: [0, 0, 0], B: [1, 0, 0], F: [1, 1, 0], E: [0, 1, 0], D: [0, 0, 1], C: [1, 0, 1], G: [1, 1, 1], H: [0, 1, 1] };
  function netFig() {
    const b = Board(), u = 36, P = (p) => [p[0] * u, -p[1] * u];
    const outline = [[0, 0], [1, 0], [1, -1], [2, -1], [2, 0], [4, 0], [4, 1], [1, 1], [1, 2], [0, 2]];
    outline.forEach((p, i) => b.seg(P(p), P(outline[(i + 1) % outline.length])));
    for (const [p, q] of [[[0, 1], [1, 1]], [[1, 0], [1, 1]], [[2, 0], [2, 1]], [[3, 0], [3, 1]], [[1, 0], [2, 0]]]) b.seg(P(p), P(q), 'cut');
    const AT = { A: 210, B: 235, F: 305, E: 270, C: 45, D: 45, H: 135, G: 45 };
    for (const [nm, p] of Object.entries(NET)) b.name(P(p), nm, AT[nm], 11);
    return b.svg(attr('정육면체의 전개도. 가운데 줄에 정사각형 네 개가 가로로 이어져 있고, 아랫변의 꼭짓점은 왼쪽부터 A, B, F, E(오른쪽 끝은 이름 없음), 윗변의 꼭짓점은 왼쪽에서 둘째가 C, 오른쪽 끝이 D이다. 첫째 정사각형 위에 정사각형 하나(위의 두 꼭짓점이 왼쪽 H, 오른쪽 G)가, 둘째 정사각형 아래에 정사각형 하나가 붙어 있다. 점선은 접는 선이다.'));
  }

  const hard = [
    // ①24 정육면체의 전개도: 접은 뒤의 벡터를 세 벡터로(밑 벡터 셋은 정수 계수로 모두를 나타낼 수 있는 것만 고른다)
    H('hard-net', '정육면체의 전개도로 만든 정육면체에서 벡터 나타내기', '①24', (d) => {
      const names = Object.keys(CUBE), segs = segsOf(names);
      const base = d.int(0, 2) === 0 ? ['AC', 'FB', 'HG'] : [d.pick(segs), d.pick(segs), d.pick(segs)];
      const bv = base.map((s) => vecOf(CUBE, s)), det = bv[0][0] * (bv[1][1] * bv[2][2] - bv[1][2] * bv[2][1]) - bv[0][1] * (bv[1][0] * bv[2][2] - bv[1][2] * bv[2][0]) + bv[0][2] * (bv[1][0] * bv[2][1] - bv[1][1] * bv[2][0]);
      if (Math.abs(det) !== 1 || new Set(base.map((s) => s.split('').sort().join(''))).size < 3) return null;
      const t = d.pick(segs.filter((s) => !base.includes(s) && !base.includes(rev(s))));
      const c = intCoefs(vecOf(CUBE, t), bv);
      if (!c || c.filter(Boolean).length < 2 || c.some((x) => Math.abs(x) > 2)) return null;
      const cof = (x) => intCoefs(vsub(CUBE[x], CUBE.A), bv), nm3 = ['a', 'b', 'c'];
      return lcAns(`그림은 정육면체의 전개도이다. 이 전개도로 만든 정육면체에서 ${vn(base[0])} = ${vec('a')}, ${vn(base[1])} = ${vec('b')}, ${vn(base[2])} = ${jh(vec('c'), '이라/라')}고 할 때, 벡터 ${jh(vn(t), '을/를')} ${vlist(abc)}로 나타내시오.`, vn(t), c, nm3, {
        figure: netFig(),
        explain: `전개도를 접으면 아랫면이 ABFE, 윗면이 DCGH이고 D, C, G, H는 각각 A, B, F, E의 바로 위에 온다. A에서 이웃한 세 꼭짓점으로 가는 벡터는 ${['B', 'E', 'D'].map((x) => `${vn('A' + x)} = ${lcH(cof(x), nm3)}`).join(', ')}이므로 ${viaOrigin(t, 'A', cof, nm3)}이다.` });
    }),

    // ②14(대12) 중점으로 나눈 정삼각형: a⃗ = U⃗ + V⃗, b⃗ = W⃗ − X⃗ 의 합을 같은 벡터로 바꿔 한 벡터로 → 크기
    H('hard-mid', '중점으로 나눈 정삼각형에서 벡터의 합의 크기', '②14', (d) => {
      const s = 2 * d.int(1, 4), pts = Object.keys(TRI), segs = segsOf(pts), unit = segs.filter((x) => Math.abs(vlen(vecOf(TRI, x)) - 1) < 1e-9);
      const [U, Vv, W, X] = [0, 1, 2, 3].map(() => d.pick(unit));
      if (U[1] === Vv[0] || Vv[1] === U[0] || W[0] === X[0] || W[1] === X[1] || new Set([U, Vv, W, X].map((x) => x.split('').sort().join(''))).size < 4) return null;
      const vs = [vecOf(TRI, U), vecOf(TRI, Vv), vecOf(TRI, W), vecOf(TRI, rev(X))];
      // 같은 벡터로 바꿔 이어 붙인 길(시작점과 차례를 바꿔 가며 찾는다)
      const perms = [[0, 1, 2, 3], [0, 2, 1, 3], [0, 3, 1, 2], [1, 0, 2, 3], [2, 0, 1, 3], [3, 0, 1, 2], [0, 1, 3, 2], [0, 2, 3, 1], [0, 3, 2, 1], [1, 2, 0, 3], [2, 1, 0, 3], [1, 3, 0, 2]];
      let chain = null;
      for (const st of pts) { for (const pm of perms) { let cur = st; const steps = []; for (const i of pm) { const g = segs.find((x) => x[0] === cur && same(vecOf(TRI, x), vs[i])); if (!g) break; steps.push(g); cur = g[1]; } if (steps.length === 4 && cur !== st) { chain = { st, steps, end: cur }; break; } } if (chain) break; }
      if (!chain) return null;
      const L = Math.round(vlen(vecOf(TRI, chain.st + chain.end)) * 1e6) / 1e6;
      if (L !== 1 && L !== 2) return null;
      const ans = (s / 2) * L;
      return N(`한 변의 길이가 ${s}인 정삼각형 ABC에서 세 변 AB, BC, CA의 중점을 각각 D, E, F라 하자. ${vn(U)} + ${vn(Vv)} = ${vec('a')}, ${vn(W)} ${MINUS} ${vn(X)} = ${jh(vec('b'), '이라/라')}고 할 때, ${absH(`${vec('a')} + ${vec('b')}`)}의 값은?`, ans, {
        figure: fig2({ u: 62, pts: TRI, edges: 'AB BC CA', thin: 'DE EF FD', say: `한 변의 길이가 ${s}인 정삼각형 ABC와 세 변 AB, BC, CA의 중점 D, E, F를 이은 선분.` }),
        explain: `작은 정삼각형 네 개의 변은 모두 길이가 ${s / 2}이고, 평행한 선분끼리는 같은 벡터로 바꿀 수 있다. ${MINUS}${vn(X)} = ${jh(vn(rev(X)), '이므로/이므로')} ${vec('a')} + ${vec('b')} = ${vn(U)} + ${vn(Vv)} + ${vn(W)} + ${vn(rev(X))}이고, 앞 벡터의 종점과 뒤 벡터의 시점이 이어지게 바꾸면 ${chain.steps.map(vn).join(' + ')} = ${jh(vn(chain.st + chain.end), '이다/이다')}. 따라서 |${vec('a')} + ${vec('b')}| = ${SG(chain.st + chain.end)} = ${ans}이다.`,
        facts: { calc: [[`${s}*${L}/2`, 0]], derived: [L, 2] } });
    }),

    // ②15(중10) 정삼각형 ABC 아래에 정사각형 BDEC: 세 벡터를 이어 한 벡터로 → |…|² = p + q√3 (원문 p + q → p, q 를 칸마다)
    H('hard-trisq', '정삼각형과 정사각형을 붙인 도형에서 합의 크기의 제곱', '②15', (d) => {
      const s = d.int(2, 4), FORMS = [[['AB', 'DE', 'EC'], 'E', `${vn('AB')} + ${vn('DE')} ${MINUS} ${vn('EC')} = ${vn('AB')} + ${vn('BC')} + ${vn('CE')}`], [['AC', 'ED', 'DB'], 'D', `${vn('AC')} + ${vn('ED')} ${MINUS} ${vn('DB')} = ${vn('AC')} + ${vn('CB')} + ${vn('BD')}`], [['AC', 'BD', 'BC'], 'D', `${vn('AC')} + ${vn('BD')} ${MINUS} ${vn('BC')} = ${vn('AC')} + ${vn('CB')} + ${vn('BD')}`]];
      const [names, end, why] = d.pick(FORMS);
      const P = { A: [0, S3], B: [-1, 0], C: [1, 0], D: [-1, -2], E: [1, -2] };
      const tot = vadd(vsub(vecOf(P, names[0]), vecOf(P, names[2])), vecOf(P, names[1]));
      if (!same(tot, vecOf(P, 'A' + end))) return null;
      const p = 2 * s * s, q = s * s, foot = end === 'E' ? 'E' : 'D';
      return inline(`그림과 같이 한 변의 길이가 ${s}인 정삼각형 ABC와 정사각형 BDEC가 있다. ${vn(names[0])} = ${vec('a')}, ${vn(names[1])} = ${vec('b')}, ${vn(names[2])} = ${jh(vec('c'), '이라/라')}고 할 때, ${nb(`|${vec('a')} + ${vec('b')} ${MINUS} ${vec('c')}|<sup>2</sup> = ${V('p')} + ${V('q')}${rt(3)}`)}이다. 두 유리수 ${V('p')}, ${V('q')}의 값을 구하시오.`, nb(`${V('p')} = {0}`) + ', ' + nb(`${V('q')} = {1}`), [{ answer: p }, { answer: q }], {
        figure: fig2({ u: 34, pts: P, edges: 'AB BC CA BD DE EC', arrows: [[names[0][0], names[0][1], 'a'], [names[1][0], names[1][1], 'b'], [names[2][0], names[2][1], 'c']], say: `한 변의 길이가 ${s}인 정삼각형 ABC(A 위)와 그 아래에 붙인 정사각형 BDEC(D는 B의 아래, E는 C의 아래). 화살표 a는 ${names[0][0]}에서 ${names[0][1]}로, b는 ${names[1][0]}에서 ${names[1][1]}로, c는 ${names[2][0]}에서 ${names[2][1]}로.` }),
        shown: `${V('p')} = ${p}, ${V('q')} = ${q}`,
        explain: `정사각형의 마주 보는 변은 같은 벡터이므로 ${why} = ${jh(vn('A' + end), '이다/이다')}. A에서 변 DE에 내린 수선의 발을 H라 하면 ${SG('AH')} = ${frac(s + rt(3), 2)} + ${s}, ${SG('H' + foot)} = ${frac(s, 2)}이므로 |${vn('A' + end)}|<sup>2</sup> = (${frac(s + rt(3), 2)} + ${s})<sup>2</sup> + (${frac(s, 2)})<sup>2</sup> = ${p} + ${q}${rt(3)}이다.`,
        facts: { calc: [[`2*${s}*${s}`, 0], [`${s}*${s}`, 1]], derived: [2] } });
    }),

    // ②16(중13) 평행사변형: 대각선 벡터의 합·차의 크기로 둘레(합·차는 변 벡터의 두 배)
    H('hard-para', '평행사변형에서 대각선 벡터의 합·차의 크기로 둘레 구하기', '②16', (d) => {
      const x = d.int(2, 9), y = d.int(2, 9);
      if (x === y) return null;
      const AD = d.pick([[`${vn('AC')} + ${vn('BD')}`, `${vn('AD')} + ${vn('BC')} = 2${vn('AD')}`], [`${vn('AC')} ${MINUS} ${vn('DB')}`, `${vn('AD')} + ${vn('BC')} = 2${vn('AD')}`], [`${vn('BD')} + ${vn('AC')}`, `${vn('BC')} + ${vn('AD')} = 2${vn('AD')}`]]);
      const AB = d.pick([[`${vn('AC')} ${MINUS} ${vn('BD')}`, `${vn('DC')} ${MINUS} ${vn('CD')} = 2${vn('DC')}`], [`${vn('AC')} + ${vn('DB')}`, `${vn('AB')} + ${vn('AB')} = 2${vn('AB')}`], [`${vn('BD')} ${MINUS} ${vn('AC')}`, `${vn('CD')} ${MINUS} ${vn('DC')} = 2${vn('CD')}`]]);
      const rows = d.shuffle([[AD[0], 2 * x], [AB[0], 2 * y]]);
      const P = { A: [0.7, 1.4], B: [0, 0], C: [2.6, 0], D: [3.3, 1.4] };
      return N(`평행사변형 ABCD에서 ${rows.map(([h, v]) => nb(`|${h}| = ${v}`)).join(', ')}일 때, 평행사변형 ABCD의 둘레의 길이는?`, 2 * x + 2 * y, {
        figure: fig2({ u: 52, pts: P, edges: 'AB BC CD DA', thin: 'AC BD', say: '평행사변형 ABCD(A 왼쪽 위, B 왼쪽 아래, C 오른쪽 아래, D 오른쪽 위)와 두 대각선 AC, BD.' }),
        explain: `${vn('AC')} = ${vn('AD')} + ${vn('DC')}, ${vn('BD')} = ${vn('BC')} + ${jh(vn('CD'), '이고/이고')} ${vn('DC')} = ${MINUS}${vn('CD')}, ${vn('BC')} = ${jh(vn('AD'), '이다/이다')}. ${AD[0]} = ${jh(AD[1], '이므로/이므로')} |${vn('AD')}| = ${x}, ${AB[0]} = ${jh(AB[1], '이므로/이므로')} |${vn('AB')}| = ${y}이다. 따라서 둘레의 길이는 2 × (${x} + ${y}) = ${2 * x + 2 * y}이다.`,
        facts: { calc: [[`${2 * x}+${2 * y}`, 0]] } });
    }),

    // ②17(중14) 반원의 호를 삼등분한 두 점: 합의 크기에서 반지름을 구해 넓이(답은 늘 k√3, k ≥ 4)
    H('hard-semi', '반원의 삼등분점에서 벡터의 합의 크기로 넓이 구하기', '②17', (d) => {
      const r = d.pick([4, 6, 8]), [expr, to] = d.pick([[`${vn('AD')} + ${vn('OC')}`, 'OD'], [`${vn('AC')} + ${vn('OD')}`, 'OD'], [`${vn('BC')} + ${vn('OD')}`, 'OC'], [`${vn('BD')} + ${vn('OC')}`, 'OC']]);
      const [shape, kq, den] = d.pick([['삼각형 AOD', r * r / 4, 16], ['삼각형 BOC', r * r / 4, 16], ['사각형 ACDO', r * r / 2, 8], ['사각형 OCDB', r * r / 2, 8]]);
      // 좌표로 확인: 식의 값이 2 × (to 벡터)인가
      const pos = { A: [-1, 0], B: [1, 0], O: [0, 0], C: [-0.5, S3 / 2], D: [0.5, S3 / 2] };
      const sum2 = (expr.match(/[A-Z]{2}/g) || []).map((s) => vecOf(pos, s)).reduce((u, v) => vadd(u, v), [0, 0]);
      if (!same(sum2, vecOf(pos, to).map((v) => 2 * v))) return null;
      return lenAns(`선분 AB를 지름으로 하는 반원이 있다. 선분 AB의 중점을 O라 하고, 반원의 호 AB를 삼등분한 점을 점 A에서 가까운 점부터 차례로 C, D라고 하자. ${nb(`|${expr}| = ${2 * r}`)}일 때, ${shape}의 넓이는?`, kq, 3, {
        figure: semiFig(),
        explain: `호를 삼등분하므로 ∠AOC = ∠COD = ∠DOB = 60°이고 삼각형 AOC, COD, DOB는 정삼각형이다. 그래서 사각형 ACDO와 OCDB는 마름모이고 ${vn('AC')} = ${vn('OD')}, ${vn('CD')} = ${vn('AO')} = ${vn('OB')}, ${vn('BD')} = ${jh(vn('OC'), '이다/이다')}. 같은 벡터로 바꾸면 ${expr} = 2${jh(vn(to), '이므로/이므로')} |${vn(to)}| = ${r}, 곧 반지름이 ${r}이다. ${jh(shape, '은/는')} ${shape.startsWith('삼각형') ? `한 변이 ${r}인 정삼각형과 넓이가 같으므로 ${frac(rt(3), 4)} × ${r}<sup>2</sup>` : `한 변이 ${r}인 정삼각형 두 개로 이루어지므로 2 × ${frac(rt(3), 4)} × ${r}<sup>2</sup>`} = ${kq}${rt(3)}이다.`,
        facts: { calc: [[`${2 * r}*${2 * r}/${den}`, 0], ['3', 1]], derived: [den, 3] } });
    }),

    // ②20(중15) 정삼각형: AP⃗ = ½(AB⃗ + AC⃗) 와 AB⃗ = −kAQ⃗(또는 AQ⃗ = kAB⃗)로 두 점의 자리를 찾아 넓이(답은 늘 K√3)
    H('hard-area', '벡터의 실수배 조건으로 점의 자리를 찾아 넓이 구하기', '②20', (d) => {
      const s = d.pick([4, 6, 8, 12]), ext = d.bool(), k = d.pick(ext ? [2, 3] : [2, 3, 4]), viaC = d.bool();
      const top = ext ? (k - 1) * s * s : s * (s * k + s), bot = ext ? 8 : 8 * k;
      if (top % bot !== 0 || top / bot < 2) return null;
      const area = top / bot, BQ = ext ? `(${k} ${MINUS} 1) × ${s} = ${(k - 1) * s}` : `${s} + ${frac(s, k)}`;
      const cond = ext ? `${vn('AQ')} = ${k}${vn('AB')}` : `${vn('AB')} = ${MINUS}${k}${vn('AQ')}`;
      const tri = viaC ? '삼각형 QCP' : '삼각형 QBP';
      return lenAns(`평면 위에 한 변의 길이가 ${s}인 정삼각형 ABC와 ${nb(`${vn('AP')} = ${frac(1, 2)}(${vn('AB')} + ${vn('AC')})`)}, ${nb(cond)}를 만족시키는 두 점 P, Q가 있다. ${tri}의 넓이는?`, area, 3, {
        figure: fig2({ u: 40, pts: { A: [1.5, 1.5 * S3], B: [0, 0], C: [3, 0] }, edges: 'AB BC CA', lens: [['B', 'C', String(s)]], say: `한 변의 길이가 ${s}인 정삼각형 ABC(A 위, B 왼쪽 아래, C 오른쪽 아래).` }),
        explain: `${vn('AB')} + ${vn('AC')}는 선분 BC의 중점으로 가는 벡터의 두 배이므로 P는 선분 BC의 중점이다. ${ext ? `${vn('AQ')} = ${k}${jh(vn('AB'), '이므로/이므로')} Q는 반직선 AB 위에서 B를 지나 ${SG('AQ')} = ${k * s}인 점이고, ∠QBP = 120°이다` : `${vn('AQ')} = ${MINUS}${frac(1, k)}${jh(vn('AB'), '이므로/이므로')} Q는 선분 BA의 A 쪽 연장선 위에서 ${SG('AQ')} = ${frac(s, k)}인 점이고, ∠QBP = 60°이다`}. ${SG('BQ')} = ${BQ}, ${SG('BP')} = ${s / 2}이므로 삼각형 QBP의 넓이는 ${frac(1, 2)} × ${SG('BQ')} × ${SG('BP')} × ${frac(rt(3), 2)} = ${area}${rt(3)}이다.${viaC ? ' 삼각형 QCP는 밑변 PC가 BP와 같고 높이가 같으므로 넓이가 같다.' : ''}`,
        facts: { calc: [[ext ? `(${k}-1)*${s}*${s}/8` : `${s}*(${s}*${k}+${s})/(8*${k})`, 0], ['3', 1]], derived: [8, 3] } });
    }),

    // ②21(중19) 정삼각형 ABC 와 PY⃗ = PX⃗ + kPZ⃗ 인 점 P: XY⃗ = kPZ⃗(PZ ∥ XY) → 넓이의 비 → 한 변(답은 늘 2√n)
    H('hard-pb', '벡터 등식과 넓이로 정삼각형의 한 변 구하기', '②21', (d) => {
      const [X, Y, Z] = d.shuffle(['A', 'B', 'C']), k = d.pick([2, 3, 5]), m = d.int(1, 5), n = k * m;
      if (!K.sqf(n)) return null;
      const other = d.pick([X, Y]), tri = `P${Z}${other}`;
      const area = m === 1 ? rt(3) : `${m}${rt(3)}`;
      return lenAns(`정삼각형 ABC를 포함하는 평면 위의 점 P가 다음 조건을 만족시킬 때, 정삼각형 ABC의 한 변의 길이는?`, 2, n, {
        figure: lines([`㈎ ${vn('P' + Y)} = ${vn('P' + X)} + ${k}${vn('P' + Z)}`, `㈏ 삼각형 ${tri}의 넓이는 ${jh(area, '이다/이다')}.`]),
        explain: `㈎에서 ${vn('P' + Y)} ${MINUS} ${vn('P' + X)} = ${vn(X + Y)}이므로 ${vn(X + Y)} = ${k}${jh(vn('P' + Z), '이다/이다')}. 곧 선분 P${Z}는 변 ${X}${Y}와 평행하고 길이는 ${frac(1, k)}이다. 삼각형 ${tri}와 삼각형 ${X}${Y}${Z}는 밑변 P${Z}, ${X}${Y}가 평행한 두 직선 위에 있어 높이가 같으므로 넓이의 비가 1 : ${k}이고, 정삼각형 ABC의 넓이는 ${k} × ${area} = ${n}${rt(3)}이다. 한 변을 ${V('a')}라 하면 ${frac(rt(3), 4)}${V('a')}<sup>2</sup> = ${n}${rt(3)}, ${V('a')}<sup>2</sup> = ${4 * n}이므로 ${V('a')} = 2${rt(n)}이다.`,
        facts: { calc: [['2', 0], [`${k}*${m}`, 1]], derived: [2] } });
    }),

    // ②22(중21) 직사각형 안의 점 P: PA⃗ + PB⃗ + PC⃗ + PD⃗ = (대각선 벡터) → P 의 자리 → 넓이의 비
    H('hard-rect', '네 벡터의 합 조건으로 점의 자리를 찾아 직사각형의 넓이 구하기', '②22', (d) => {
      const R = { A: [0, 1], B: [0, 0], C: [1, 0], D: [1, 1] }, Ec = [0.5, 0.5];
      const rhs = d.pick(['CA', 'AC', 'DB', 'BD']), Pp = vsub(Ec, vecOf(R, rhs).map((v) => v / 4));
      const U = rhs[0], others = ['A', 'B', 'C', 'D'].filter((x) => x !== U && x !== rhs[1]);
      const side = d.pick([['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A']]), [S, T2] = d.bool() ? side : [side[1], side[0]];
      const area2 = Math.abs((R[S][0] - Pp[0]) * (R[T2][1] - Pp[1]) - (R[T2][0] - Pp[0]) * (R[S][1] - Pp[1])) / 2;
      const ratio = K.rat(area2);
      if (!ratio || (ratio.q !== 8)) return null;
      const mlt = d.int(1, 6), t = ratio.p * mlt, ans = 8 * mlt;
      const tri = `${T2}${S}P`.split('').join('');
      return N(`직사각형 ABCD의 내부의 점 P가 ${nb(`${vn('PA')} + ${vn('PB')} + ${vn('PC')} + ${vn('PD')} = ${vn(rhs)}`)}를 만족시킨다. 삼각형 ${tri}의 넓이가 ${t}일 때, 직사각형 ABCD의 넓이는?`, ans, {
        figure: fig2({ u: 1, pts: { A: [0, 80], B: [0, 0], C: [130, 0], D: [130, 80] }, edges: 'AB BC CD DA', say: '직사각형 ABCD(A 왼쪽 위, B 왼쪽 아래, C 오른쪽 아래, D 오른쪽 위).' }),
        explain: `${vn(rhs)} = ${vn('P' + rhs[1])} ${MINUS} ${jh(vn('P' + U), '이므로/이므로')} 주어진 식은 2${vn('P' + U)} + ${vn('P' + others[0])} + ${vn('P' + others[1])} = ${jh(K.ZV, '이다/이다')}. 두 대각선의 교점을 E라 하면 E는 선분 ${others.join('')}의 중점이므로 ${vn('P' + others[0])} + ${vn('P' + others[1])} = 2${jh(vn('PE'), '이고/이고')} ${vn('PE')} = ${MINUS}${jh(vn('P' + U), '이다/이다')}. 곧 P는 선분 E${U}의 중점이고, P에서 각 변까지의 거리는 가로·세로 길이의 ${frac(1, 4)} 또는 ${frac(3, 4)}이다. 삼각형 ${tri}의 넓이는 직사각형의 넓이의 ${frac(ratio.p, 8)}이므로 직사각형의 넓이는 ${t} × ${frac(8, ratio.p)} = ${ans}이다.`.replace(frac(8, 1), '8'),
        facts: { calc: [[`${t}*8/${ratio.p}`, 0]], derived: [8, ratio.p] } });
    }),

    // ②24(중17) 쌍곡선 위의 점 P: |OA⃗ ± OP⃗| = k 인 P 가 셋일 때 k(답은 늘 2√m)
    H('hard-hyper', '쌍곡선 위의 점과 벡터의 합의 크기', '②24', (d) => {
      const m = d.pick([2, 3, 5, 6, 7]), n = d.int(1, 5), pos = d.bool(), plus = d.bool();
      const a = Math.sqrt(m), bq = Math.sqrt(n), xA = pos ? a : -a;
      const eqH = `${frac(V('x') + '<sup>2</sup>', m)} ${MINUS} ${n === 1 ? V('y') + '<sup>2</sup>' : frac(V('y') + '<sup>2</sup>', n)} = 1`;
      const figure = plot({ x: [-4.6, 4.6], y: [-3.2, 3.2], xt: [], yt: [], params: [{ x: (t) => a / Math.cos(t), y: (t) => bq * Math.tan(t), from: 0, to: 2 * Math.PI }], dots: [{ x: xA, y: 0, name: 'A', side: pos ? 'l' : 'r' }],
        say: `쌍곡선 x²/${m} − ${n === 1 ? 'y²' : 'y²/' + n} = 1의 그래프(두 꼭짓점이 x축 위에 있다)와 x좌표가 ${pos ? '양수' : '음수'}인 꼭짓점 A.` });
      const vexpr = plus ? `${vn('OA')} + ${vn('OP')}` : `${vn('OP')} ${MINUS} ${vn('OA')}`;
      return lenAns(`쌍곡선 ${nb(eqH)}의 두 꼭짓점 가운데 ${V('x')}좌표가 ${pos ? '양수' : '음수'}인 점을 A라고 하자. 이 쌍곡선 위의 점 P에 대하여 ${nb(`|${vexpr}| = ${V('k')}`)}를 만족시키는 점 P의 개수가 3일 때, 양수 ${V('k')}의 값은? (단, O는 원점이다.)`, 2, m, {
        figure,
        explain: plus
          ? `다른 꼭짓점을 B라 하면 O는 선분 AB의 중점이므로 ${vn('OA')} = ${vn('BO')}이고 ${vexpr} = ${vn('BO')} + ${vn('OP')} = ${jh(vn('BP'), '이다/이다')}. 곧 P는 B를 중심으로 하고 반지름이 ${V('k')}인 원 위의 점이다. 이 원은 B를 지나는 가지와는 늘 두 점에서 만나고, 다른 가지와는 반지름이 B에서 그 가지까지의 가장 짧은 거리 ${SG('AB')}일 때 A 한 점에서만 만난다. 따라서 ${V('k')} = ${SG('AB')} = 2${rt(m)}이다.`
          : `${vexpr} = ${jh(vn('AP'), '이므로/이므로')} P는 A를 중심으로 하고 반지름이 ${V('k')}인 원 위의 점이다. 이 원은 A를 지나는 가지와는 늘 두 점에서 만나고, 다른 꼭짓점을 B라 할 때 다른 가지와는 반지름이 ${SG('AB')}일 때 B 한 점에서만 만난다. 따라서 ${V('k')} = ${SG('AB')} = 2${rt(m)}이다.`,
        facts: { calc: [['2', 0], [String(m), 1]], derived: [2] } });
    })
  ];

  // 반원 그림: 지름 AB, 중점 O, 호의 삼등분점 C, D
  function semiFig() {
    const b = Board(), R = 80, O = [0, 0], A = [-R, 0], Bp = [R, 0], Cc = at(O, R, 120), Dd = at(O, R, 60);
    b.seg(A, Bp); b.arc(O, R, 0, 180);
    b.seg(O, Cc, 'thin'); b.seg(O, Dd, 'thin');
    for (const p of [O, Cc, Dd]) b.dot(p);
    b.name(A, 'A', 200, 11); b.name(Bp, 'B', 340, 11); b.name(O, 'O', 270, 11); b.name(Cc, 'C', 120, 11); b.name(Dd, 'D', 60, 11);
    return b.svg(attr('선분 AB를 지름으로 하는 반원과 AB의 중점 O, 호 AB를 삼등분한 두 점 C(A에 가까운 쪽), D. O와 C, O와 D를 이은 선분.'));
  }

  B.addGroup('11-4-6', { id: 'hard', title: '실력 문제', standard: S1, types: hard });
})(typeof window !== 'undefined' ? window : globalThis);
