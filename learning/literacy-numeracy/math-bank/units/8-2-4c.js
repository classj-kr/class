// 중학교 2학년 2학기 4단원 평행선과 선분의 길이의 비 — 실력 문항.
// 단원 틀과 그림 도구, 싣는 기준, 뺀 것과 까닭은 8-2-4a.js 에 있다. ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 ①의 장치는 이 잘못을 가진 아이가 걸리게 만들었다)
//  - 평행한 두 선분의 길이의 비 DE : BC 를 AD : DB 로 잡는다(AD : AB 이다). 변을 늘인 꼴에서는 FC : FD 를 FC : CD 로 잡는다.
//  - 두 변에서 어떤 비든 둘이 같기만 하면 평행하다고 여긴다. AD : DB = EC : AE 처럼 자리가 엇갈린 비, AD : AB = AE : EC 처럼 전체와 부분을 섞은 비로는 평행하다고 할 수 없다.
//  - 두 변의 중점을 이은 선분의 성질은 쓰지만, 거꾸로 「한 변의 중점을 지나고 다른 변에 평행한 직선은 나머지 변의 중점을 지난다」는 것은 떠올리지 못한다.
//  - 무게중심이 중선을 나누는 비 2 : 1 을 거꾸로(꼭짓점 쪽이 짧게) 쓴다. 중선이 그려져 있지 않으면 무게중심의 성질을 쓰지 못한다.
//  - 삼각형 안에 선이 여럿 그려져 있으면 아무 조각이나 전체의 1/6 로 여긴다. 여섯 조각이 같은 것은 세 중선이 나눈 조각일 때뿐이고, 무게중심은 그 삼각형의 무게중심이어야 한다.
//  - 평행사변형의 대각선이 서로를 이등분한다는 것에서 다른 대각선이 중선이 된다는 것을 보지 못한다.
//
// 실력에는 ① 문제의 그림·수에 함정이 있어 배운 뜻을 정확히 대야 풀리는 문제와 ② 세 단계 넘게 이어 생각해야 풀리는 문제
// (평행선 두 쌍에서 이웃하지 않은 선분의 비, 평행사변형의 대각선을 나누는 비, 사다리꼴에서 두 대각선으로 두 번 구하기와 넓이, 두 변의 중점을 이은 선분을 두 번 쓰기,
//  무게중심과 외심을 함께 쓰기, 무게중심을 지나는 평행선, 평행사변형의 대각선을 두 삼각형의 무게중심으로 나누기)만 실었다.
// 한 번에 풀리는 것, 두 단계를 잇는 것(①11 엇갈린 꼴 뒤의 평행선, ①55 두 무게중심 사이의 거리, ①61 두 변의 중점과 무게중심이 만든 삼각형,
//  ①49·①63 무게중심을 두 번 쓰는 길이와 넓이), 거꾸로 한 번 구하는 것(①26 사다리꼴의 밑변, ①31 교점을 지나는 선분에서 한 선분),
// 기본 문서에 여러 번 나오는 쉬운 꼴(①34·36 중점을 이은 도형의 둘레)은 기본 묶음에 있다.
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, C } = B.kit;
  const { V, nb, SG, gcd } = B.kit.mid;
  const { dirOf, meet } = B.kit.mgeo;
  const K = B.kit.m824;
  const { UNIT, STD, src, cm, eq, par, jo, lenQ, areaQ, two, ratioQ, lerp, pol, plus, sas, fine, cen, Fig, trapOf, half, medOf, anyTri, SQ, tidy } = K;
  // 실력 문항. 기본 자료에서만 나온 꼴은 ref 를 '①11' 처럼 적는다(출처가 기본 자료로 적힌다).
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: src(ref), make: K.glued(make) }, more || {});
  // 평행사변형 ABCD(A 왼쪽 위, B 왼쪽 아래): BC = a, AB = c, ∠B
  const paraOf = (a, c, ang) => { const A = pol(c, ang); return { A, B: [0, 0], C: [a, 0], D: [A[0] + a, A[1]] }; };
  const anyPara = (d) => paraOf(d.pick([11, 12, 13]), d.pick([7, 8, 9]), d.int(12, 15) * 5);
  const PARA_LEAD = '평행사변형 ABCD에서 두 변 BC, CD의 중점을 각각 M, N이라 하고, 대각선 BD가';
  const A_ = V('a'), ka = (n) => (n === 1 ? '' : n) + A_;

  B.addGroup(UNIT, {
    id: 'hard', title: '실력 문제', standard: STD,
    types: [
      // ── ① 문제의 그림·수에 함정이 있어 배운 뜻을 정확히 대야 풀리는 문제 ──
      H('hard-pick-par', '어떤 비든 같으면 평행한가', '심1', (d) => {
        // 네 경우 모두 두 비가 같아 보이지만, 대응하는 자리끼리 비가 같은 것은 하나뿐이다. 보기마다 [AD, DB, AE, EC]와 적는 꼴.
        const v = d.until(() => {
          const [m, k] = d.pick(K.RATIOS), [p, q] = d.pick([[1, 2], [2, 3], [3, 4], [3, 5], [2, 5], [1, 3]]), [r, s] = d.pick([[1, 2], [2, 3], [3, 4], [3, 5], [2, 5], [1, 3]]), u = d.int(1, 4), w = d.int(1, 4), a = d.int(1, 4), b = d.int(1, 4), c = d.int(1, 4), e = d.int(1, 4), g = d.int(1, 4), h = d.int(1, 4);
          return { u, w, a, b, rows: [
            // 정답: 한 변은 전체와 부분으로, 다른 변은 조각끼리 적었다(조각으로 고쳐 견주어야 한다).
            { r: [m * u, k * u, m * w, k * w], html: (x) => `${eq('AB', x[0] + x[1])}, ${eq('AD', x[0])}, ${eq('AE', x[2])}, ${eq('EC', x[3])}` },
            // AD : DB = EC : AE — 두 비가 같기만 하면 평행하다고 여기는 아이(자리가 엇갈렸다)
            { r: [m * a, k * a, k * b, m * b], html: (x) => `${eq('AD', x[0])}, ${eq('DB', x[1])}, ${eq('AE', x[2])}, ${eq('EC', x[3])}` },
            // AD : AB = AE : EC — 전체와 부분을 섞어 견주는 아이
            { r: [p * c, (q - p) * c, p * e, q * e], html: (x) => `${eq('AD', x[0])}, ${eq('AB', x[0] + x[1])}, ${eq('AE', x[2])}, ${eq('EC', x[3])}` },
            // AD : DB = AE : AC — 한쪽만 전체로 견주는 아이
            { r: [r * g, s * g, r * h, (s - r) * h], html: (x) => `${eq('AD', x[0])}, ${eq('DB', x[1])}, ${eq('AE', x[2])}, ${eq('AC', x[2] + x[3])}` }
          ] };
        }, (x) => x.u !== x.w && x.a !== x.b && x.rows.every((row) => Math.max(row.r[0] + row.r[1], row.r[2] + row.r[3]) <= 24) && x.rows.filter((row) => row.r[0] * row.r[3] === row.r[1] * row.r[2]).length === 1);
        const rows = d.shuffle(v.rows), hit = rows.findIndex((row) => row.r[0] * row.r[3] === row.r[1] * row.r[2]), R = rows[hit].r;
        return C(`△ABC에서 두 점 D, E가 각각 변 AB, AC 위에 있다. 다음은 네 경우의 선분의 길이이다. 이 가운데 ${par('BC', 'DE')}인 것은?`, rows.map((row) => row.html(row.r)), hit, {
          explain: `${nb(`${SG('AD')} : ${SG('DB')} = ${SG('AE')} : ${SG('EC')}`)}일 때에만 ${par('BC', 'DE')}이다. 정답인 경우는 ${SG('DB')} = ${R[0] + R[1]} − ${R[0]} = ${R[1]}(cm)이므로 ${SG('AD')} : ${SG('DB')} = ${K.simple(R[0], R[1])}, ${SG('AE')} : ${SG('EC')} = ${K.simple(R[2], R[3])}로 두 비가 같다. 나머지는 자리가 엇갈린 비(${SG('AD')} : ${SG('DB')}와 ${SG('EC')} : ${SG('AE')})나 전체와 부분을 섞은 비가 같을 뿐이고, 조각끼리의 비 ${SG('AD')} : ${SG('DB')}와 ${SG('AE')} : ${SG('EC')}는 같지 않다.`,
          facts: { claimed: rows.map((row) => [`${row.r[0]}*${row.r[3]}`, row.r[1] * row.r[2]]), claimedWant: true }
        });
      }),
      H('hard-mid-converse', '중점을 지나고 한 변에 평행한 직선', '심25', (d) => {
        // 함정: 중점은 O 하나만 주어져 있다. OF ∥ CD 이므로 점 F 도 변 AD 의 중점임을 스스로 대야 한다.
        const v = d.until(() => {
          const ab = 2 * d.int(3, 7), bc = 2 * d.int(4, 9), P0 = paraOf(bc, ab, d.int(12, 15) * 5);
          P0.O = half(P0.A, P0.C); P0.E = [P0.O[0] + P0.D[0] - P0.C[0], P0.O[1] + P0.D[1] - P0.C[1]]; P0.F = half(P0.A, P0.D);
          const fig = Fig(P0, [170, 170], { hub: 'ABCD' }).poly('ABCD').seg('AC OE ED').name('ABC').name('D', 0).name('E', 90).free('O', 'ACE').free('F', 'ADOE').len('AB', cm(ab)).len('BC', cm(bc));
          return { ab, bc, fig };
        }, (x) => x.ab !== x.bc && x.bc >= x.ab * 0.9 && x.bc <= x.ab * 1.7 && !x.fig.clash());
        const { ab, bc } = v;
        return two(`평행사변형 ABCD에서 대각선 AC의 중점을 O라 하고, □OCDE가 평행사변형이 되도록 점 E를 잡았다. ${jo('OE', '과/와')} ${SG('AD')}가 만나는 점을 F라 하자. ${eq('AB', ab)}, ${eq('BC', bc)}일 때, ${jo('AF', '과/와')} ${SG('FE')}의 길이를 각각 구하시오.`, [[SG('AF'), bc / 2], [SG('FE'), ab / 2]], {
          figure: v.fig.svg(`평행사변형 ABCD와 대각선 AC. 점 O는 대각선 AC 위에 있다. 변 AD의 위쪽에 점 E가 있고, 선분 OE와 선분 ED가 그어져 사각형 OCDE를 이룬다. 선분 OE는 변 AD와 점 F에서 만난다. AB = ${cm(ab)}, BC = ${cm(bc)}`),
          explain: `□OCDE가 평행사변형이므로 ${par('OE', 'CD')}이고 ${SG('OE')} = ${SG('CD')} = ${SG('AB')} = ${ab} cm이다. △ACD에서 점 O는 ${SG('AC')}의 중점이고 ${par('OF', 'CD')}이므로 점 F는 ${SG('AD')}의 중점이고 ${SG('OF')} = ${frac(1, 2)}${SG('CD')} = ${ab / 2} cm이다. ${SG('AD')} = ${SG('BC')} = ${bc} cm이므로 ${SG('AF')} = ${bc / 2} cm이고, ${SG('FE')} = ${SG('OE')} − ${SG('OF')} = ${ab} − ${ab / 2} = ${ab / 2}(cm)이다.`,
          facts: { calc: [[`${bc}/2`, 0], [`${ab}-${ab}/2`, 1]], unseen: [2] }
        });
      }),
      H('hard-cent-foot', '무게중심에서 변에 내린 수선의 발', '심36', (d) => {
        // 함정: 중선이 그려져 있지 않다. BG 를 늘이면 중선이 되고 BG : GN = 2 : 1 이다. 거꾸로 1 : 2 로 잡으면 BH 가 짧은 쪽이 된다.
        const k = d.int(2, 8), ab = 3 * k, fig = tidy(d, () => {
          const th = d.int(48, 62), P0 = { A: [0, 0], B: [0, ab], C: [ab * Math.tan(th * Math.PI / 180), 0] }; P0.G = cen(P0); P0.H = [0, P0.G[1]];
          return Fig(P0, [150, 132], { hub: 'ABC' }).poly('ABC').seg('GH').dot('G').right('BAC').right('GHB').name('ABC').name('H', 180).name('G', 0).bow('AB', cm(ab), 28);
        });
        return lenQ(`∠A = 90°인 직각삼각형 ABC에서 점 G는 무게중심이고, 점 G에서 변 AB에 내린 수선의 발을 H라 하자. ${eq('AB', ab)}일 때, ${SG('BH')}의 길이는?`, 2 * k, {
          figure: fig.svg(`각 A가 직각인 직각삼각형 ABC(직각 표시). 변 AB가 세로로, 변 AC가 가로로 놓여 있다. 삼각형의 내부에 무게중심 G가 있고, 점 G에서 변 AB 위의 점 H까지 변 AB에 수직인 선분 GH가 그어져 있다(직각 표시). AB = ${cm(ab)}`),
          explain: `${SG('BG')}의 연장선이 변 AC와 만나는 점을 N이라 하면 ${SG('BN')}은 중선이고 ${SG('BG')} : ${SG('GN')} = 2 : 1이다. ${SG('GH')}와 ${SG('NA')}는 모두 ${SG('AB')}에 수직이므로 ${par('GH', 'NA')}이다. △BAN에서 ${SG('BH')} : ${SG('HA')} = ${SG('BG')} : ${SG('GN')} = 2 : 1이므로 ${SG('BH')} = ${ab} × ${frac(2, 3)} = ${2 * k}(cm)이다.`,
          facts: { calc: [[`${ab}*2/3`, 0]], unseen: [2, 3] }
        });
      }),
      H('hard-area-hidden', '삼등분점과 중점으로 생긴 무게중심과 넓이', '①65 심43', (d) => {
        // 함정: 점 G 는 △ABC 의 무게중심이 아니라 △ABE 의 무게중심이다(AD, BF 가 △ABE 의 중선). △ABC 의 1/6 로 답하면 틀린다.
        const S = 9 * d.int(2, 10), fig = tidy(d, () => {
          const t3 = anyTri(d), P0 = Object.assign({}, t3, { D: lerp(t3.B, t3.C, 1 / 3), E: lerp(t3.B, t3.C, 2 / 3) });
          P0.F = half(P0.A, P0.E); P0.G = meet(P0.A, P0.D, P0.B, P0.F);
          return Fig(P0, [184, 140], { hub: 'ABC' }).tint('BDG').poly('ABC').seg('AD AE BF').tick('BD DE EC').tick('AF FE', 2).name('ABC').name('DE', 270).name('F', 20).nameMid('G', 'A', 'B');
        });
        return areaQ(`△ABC에서 변 BC 위의 두 점 D, E에 대하여 ${nb(`${SG('BD')} = ${SG('DE')} = ${SG('EC')}`)}이고, 점 F는 ${SG('AE')}의 중점이다. ${jo('AD', '과/와')} ${SG('BF')}가 만나는 점을 G라 하자. △ABC의 넓이가 ${S} ${SQ}일 때, △BDG의 넓이는?`, S / 9, {
          figure: fig.svg('삼각형 ABC. 변 BC 위에 점 B에서 가까운 쪽부터 점 D, E가 있고 선분 BD, DE, EC에 길이가 같다는 표시가 있다. 선분 AD와 선분 AE가 그어져 있고, 점 F는 선분 AE의 중점이다(길이가 같다는 표시). 선분 BF와 선분 AD가 점 G에서 만나고 삼각형 BDG가 색칠되어 있다'),
          explain: `${SG('BE')} : ${SG('EC')} = 2 : 1이므로 △ABE의 넓이는 ${S} × ${frac(2, 3)} = ${S * 2 / 3}(${SQ})이다. △ABE에서 점 D는 ${SG('BE')}의 중점, 점 F는 ${SG('AE')}의 중점이므로 ${SG('AD')}, ${SG('BF')}는 중선이고 점 G는 △ABE의 무게중심이다. △BDG의 넓이는 ${S * 2 / 3} × ${frac(1, 6)} = ${S / 9}(${SQ})이다.`,
          facts: { calc: [[`${S}*2/3/6`, 0]], unseen: [2, 3, 6] }
        });
      }),
      H('hard-para-third', '평행사변형의 대각선을 나누는 두 선분', '①56 ①57', (d, n) => {
        // 대각선 AC 를 그으면 점 E, F 는 △ABC, △ACD 의 무게중심이다. BE = EF = FD.
        const k = d.int(2, 9), bd = 3 * k, j = d.int(1, 6), ef = 2 * j;
        const v = d.until(() => {
          const P0 = anyPara(d); Object.assign(P0, { M: half(P0.B, P0.C), N: half(P0.C, P0.D), E: lerp(P0.B, P0.D, 1 / 3), F: lerp(P0.B, P0.D, 2 / 3) });
          const fig = Fig(P0, [196, 130], { hub: 'ABCD' }).poly('ABCD').seg(n === 0 ? 'BD AM AN' : 'BD AM AN MN').tick('BM MC').tick('CN ND', 2).name('ABCDMN').free('E', 'BDAM').free('F', 'BDAN');
          if (n === 0) fig.bowOut('BD', cm(bd), 11, 'C', 'AB'); else fig.len('EF', cm(ef), 'C');
          return { fig };
        }, (x) => !x.fig.clash());
        const said = '평행사변형 ABCD. 점 M은 변 BC의 중점, 점 N은 변 CD의 중점이다(길이가 같다는 표시). 대각선 BD가 그어져 있고, 선분 AM은 대각선 BD와 점 E에서, 선분 AN은 대각선 BD와 점 F에서 만난다. 대각선 BD 위에 점 B, E, F, D가 이 차례로 놓여 있다.';
        const why = `대각선 AC를 긋고 ${SG('BD')}와 만나는 점을 O라 하면, 평행사변형의 두 대각선은 서로를 이등분하므로 ${SG('BO')}는 △ABC의 중선, ${SG('DO')}는 △ACD의 중선이다. ${SG('AM')}, ${SG('AN')}도 중선이므로 점 E는 △ABC의 무게중심, 점 F는 △ACD의 무게중심이다. ${SG('BE')} = ${frac(2, 3)}${SG('BO')} = ${frac(1, 3)}${SG('BD')}, ${SG('FD')} = ${frac(1, 3)}${SG('BD')}이므로 ${SG('BE')} = ${SG('EF')} = ${SG('FD')}이다.`;
        if (n === 0) return lenQ(`${PARA_LEAD} ${SG('AM')}, ${jo('AN', '과/와')} 만나는 점을 각각 E, F라 하자. ${eq('BD', bd)}일 때, ${SG('EF')}의 길이는?`, k, {
          figure: v.fig.svg(`${said} BD = ${cm(bd)}`),
          explain: `${why} ${SG('EF')} = ${frac(1, 3)} × ${bd} = ${k}(cm)이다.`,
          facts: { calc: [[`${bd}/3`, 0]], unseen: [3] }
        });
        return lenQ(`${PARA_LEAD} ${SG('AM')}, ${jo('AN', '과/와')} 만나는 점을 각각 E, F라 하자. ${eq('EF', ef)}일 때, 두 점 M, N을 이은 ${SG('MN')}의 길이는?`, 3 * j, {
          figure: v.fig.svg(`${said} 선분 MN이 그어져 있다. EF = ${cm(ef)}`),
          explain: `${why} ${SG('BD')} = 3 × ${ef} = ${3 * ef}(cm)이다. △BCD에서 두 점 M, N은 각각 ${SG('BC')}, ${SG('CD')}의 중점이므로 ${SG('MN')} = ${frac(1, 2)}${SG('BD')} = ${3 * j}(cm)이다.`,
          facts: { calc: [[`${ef}*3/2`, 0]], unseen: [3, 2] }
        });
      }, { count: 2 }),
      H('hard-para-area', '평행사변형 안의 무게중심과 넓이', '심44 ①66', (d, n) => {
        const v = d.until(() => {
          const P0 = anyPara(d); Object.assign(P0, { M: half(P0.B, P0.C), N: half(P0.C, P0.D), E: lerp(P0.B, P0.D, 1 / 3), F: lerp(P0.B, P0.D, 2 / 3) });
          const fig = Fig(n === 0 ? { A: P0.A, B: P0.B, C: P0.C, D: P0.D, M: P0.M, E: P0.E } : P0, [190, 126], { hub: 'ABCD' });
          if (n === 0) fig.tint('EBM').poly('ABCD').seg('BD AM').tick('BM MC').name('ABCDM').free('E', 'BDAM');
          else fig.tint('AEF').poly('ABCD').seg('BD AM AN').tick('BM MC').tick('CN ND', 2).name('ABCDMN').free('E', 'BDAM').free('F', 'BDAN');
          return { fig };
        }, (x) => !x.fig.clash());
        if (n === 0) {
          const S = 12 * d.int(2, 8);
          return areaQ(`평행사변형 ABCD에서 변 BC의 중점을 M이라 하고, ${SG('AM')}과 대각선 BD가 만나는 점을 E라 하자. □ABCD의 넓이가 ${S} ${SQ}일 때, △EBM의 넓이는?`, S / 12, {
            figure: v.fig.svg('평행사변형 ABCD. 점 M은 변 BC의 중점이다(길이가 같다는 표시). 대각선 BD와 선분 AM이 점 E에서 만나고 삼각형 EBM이 색칠되어 있다'),
            explain: `대각선 AC를 긋고 ${SG('BD')}와 만나는 점을 O라 하면 ${SG('AO')} = ${SG('OC')}이므로 ${SG('BO')}는 △ABC의 중선이다. ${SG('AM')}도 중선이므로 점 E는 △ABC의 무게중심이다. △ABC의 넓이는 ${frac(1, 2)} × ${S} = ${S / 2}(${SQ})이고, △EBM의 넓이는 ${S / 2} × ${frac(1, 6)} = ${S / 12}(${SQ})이다.`,
            facts: { calc: [[`${S}/2/6`, 0]], unseen: [2, 6] }
          });
        }
        const S = 6 * d.int(3, 15);
        return areaQ(`${PARA_LEAD} ${SG('AM')}, ${jo('AN', '과/와')} 만나는 점을 각각 E, F라 하자. □ABCD의 넓이가 ${S} ${SQ}일 때, △AEF의 넓이는?`, S / 6, {
          figure: v.fig.svg('평행사변형 ABCD. 점 M은 변 BC의 중점, 점 N은 변 CD의 중점이다(길이가 같다는 표시). 대각선 BD가 그어져 있고, 선분 AM은 대각선 BD와 점 E에서, 선분 AN은 대각선 BD와 점 F에서 만난다. 삼각형 AEF가 색칠되어 있다'),
          explain: `대각선 AC를 그으면 점 E는 △ABC의 무게중심, 점 F는 △ACD의 무게중심이므로 ${SG('BE')} = ${SG('EF')} = ${SG('FD')}이다. △ABD의 넓이는 ${frac(1, 2)} × ${S} = ${S / 2}(${SQ})이고, △ABE, △AEF, △AFD는 높이가 같고 밑변의 길이가 같으므로 넓이가 같다. △AEF의 넓이는 ${S / 2} × ${frac(1, 3)} = ${S / 6}(${SQ})이다.`,
          facts: { calc: [[`${S}/2/3`, 0]], unseen: [2, 3] }
        });
      }, { count: 2 }),

      // ── ② 세 단계 넘게 이어 생각해야 풀리는 문제 ──
      H('hard-para-diag', '평행사변형의 대각선을 나누는 선분', '심5', (d) => {
        // EA : AD = e1 : e2, BF : FC = f1 : f2. ED ∥ BF 이므로 GD : GB = ED : BF = (e1 + e2)(f1 + f2) : e2·f1
        const [e1, e2, f1, f2] = d.pick([[1, 2, 1, 2], [1, 1, 1, 1], [1, 2, 1, 1], [1, 1, 1, 2], [1, 1, 2, 1], [1, 3, 1, 1], [1, 2, 2, 1]]);
        const big = (e1 + e2) * (f1 + f2), small = e2 * f1, g = gcd(big, small), p = big / g, q = small / g, w = d.int(1, Math.max(1, Math.floor(36 / (p + q)))), bd = (p + q) * w;
        const v = d.until(() => {
          const P0 = paraOf(12, d.pick([7, 8, 9]), d.int(12, 15) * 5);
          P0.E = [P0.A[0] - 12 * e1 / e2, P0.A[1]]; P0.F = [12 * f1 / (f1 + f2), 0]; P0.G = meet(P0.E, P0.F, P0.B, P0.D);
          const fig = Fig(P0, [200, 120], { hub: 'ABCD' }).poly('ABCD').seg('EA EF BD').name('BCD').name('A', 90).name('E', 90).name('F', 270).free('G', 'BDEF').bowOut('BD', cm(bd), 11, 'A', 'CD');
          return { fig };
        }, (x) => !x.fig.clash());
        const L = (e2 * (f1 + f2)) / gcd(e2, f1 + f2);
        return lenQ(`평행사변형 ABCD에서 ${SG('DA')}의 연장선 위에 ${nb(`${SG('EA')} : ${SG('AD')} = ${e1} : ${e2}`)}인 점 E를 잡고, 변 BC 위에 ${nb(`${SG('BF')} : ${SG('FC')} = ${f1} : ${f2}`)}인 점 F를 잡았다. ${jo('EF', '과/와')} 대각선 BD가 만나는 점을 G라 하자. ${eq('BD', bd)}일 때, ${SG('GB')}의 길이는?`, q * w, {
          figure: v.fig.svg(`평행사변형 ABCD. 변 DA를 점 A 너머로 늘인 선 위에 점 E가, 변 BC 위에 점 F가 있다. 선분 EF와 대각선 BD가 점 G에서 만난다. BD = ${cm(bd)}`),
          explain: `${SG('AD')} = ${SG('BC')} = ${ka(L)}라 하면 ${SG('ED')} = ${ka(L * (e1 + e2) / e2)}, ${SG('BF')} = ${ka(L * f1 / (f1 + f2))}이다. ${par('ED', 'BF')}이므로 ${SG('GD')} : ${SG('GB')} = ${SG('ED')} : ${SG('BF')} = ${p} : ${q}이다. ${SG('GB')} = ${bd} × ${frac(q, p + q)} = ${q * w}(cm)이다.`,
          facts: { calc: [[`${bd}*(${e2}*${f1})/((${e1}+${e2})*(${f1}+${f2})+${e2}*${f1})`, 0]] }
        });
      }),
      H('hard-trap-mn', '사다리꼴의 두 대각선이 평행한 선분에서 잘라 낸 길이', '①27', (d) => {
        const v = d.until(() => {
          const [i, j] = d.pick(K.RATIOS), s = i + j, p = d.int(1, 5), q = d.int(2, 6), ad = s * p, bc = s * q, P0 = trapOf(ad, bc, bc * d.pick([0.6, 0.68, 0.76]), (bc - ad) * d.pick([0.3, 0.45, 0.6]));
          Object.assign(P0, { E: lerp(P0.A, P0.B, i / s), F: lerp(P0.D, P0.C, i / s) }); P0.M = meet(P0.B, P0.D, P0.E, P0.F); P0.N = meet(P0.A, P0.C, P0.E, P0.F);
          const fig = Fig(P0, [184, 136], { hub: 'ABCD' }).poly('ABCD').seg('EF AC BD').arrow('AD BC').arrow('EF', 1, 0.08).name('ABCDEF').free('M', 'EFBD').free('N', 'EFAC').len('AD', cm(ad)).len('BC', cm(bc));
          return { i, j, s, p, q, ad, bc, fig };
        }, (x) => x.ad < x.bc && x.bc <= 30 && (x.i * x.q - x.j * x.p) / x.bc >= 0.2 && x.ad / x.bc >= 0.3 && !x.fig.clash());
        const { i, j, s, p, q, ad, bc } = v, em = j * p, en = i * q;
        return lenQ(`${par('AD', 'EF', 'BC')}인 사다리꼴 ABCD에서 두 점 E, F는 각각 변 AB, DC 위의 점이고, ${SG('EF')}가 두 대각선 BD, AC와 만나는 점을 각각 M, N이라 하자. ${nb(`${SG('AE')} : ${SG('EB')} = ${i} : ${j}`)}이고 ${eq('AD', ad)}, ${eq('BC', bc)}일 때, ${SG('MN')}의 길이는?`, en - em, {
          figure: v.fig.svg(`사다리꼴 ABCD. 윗변 AD와 아랫변 BC가 가로로 놓여 있다. 점 E는 변 AB 위에, 점 F는 변 DC 위에 있고 변 AD, 선분 EF, 변 BC에 평행하다는 표시가 있다. 선분 EF는 대각선 BD와 점 M에서, 대각선 AC와 점 N에서 만나고, 선분 EF 위에 점 E, M, N, F가 이 차례로 놓여 있다. AD = ${cm(ad)}, BC = ${cm(bc)}`),
          explain: `△ABD에서 ${par('EM', 'AD')}이므로 ${SG('EM')} : ${SG('AD')} = ${SG('BE')} : ${SG('BA')} = ${j} : ${s}이고 ${SG('EM')} = ${em} cm이다. △ABC에서 ${par('EN', 'BC')}이므로 ${SG('EN')} : ${SG('BC')} = ${SG('AE')} : ${SG('AB')} = ${i} : ${s}이고 ${SG('EN')} = ${en} cm이다. ${SG('MN')} = ${en} − ${em} = ${en - em}(cm)이다.`,
          facts: { calc: [[`${bc}*${i}/(${i}+${j})-${ad}*${j}/(${i}+${j})`, 0]] }
        });
      }),
      H('hard-trap-area', '직각이 있는 사다리꼴에서 평행선이 잘라 낸 부분의 넓이', '심18', (d) => {
        const v = d.until(() => {
          const [i, j] = d.pick(K.RATIOS), s = i + j, u = d.int(1, 4), w = d.int(1, 4), ae = i * u, eb = j * u, bc = s * w, ep = i * w, ad = bc * d.pick([0.4, 0.5, 0.6]);
          const P0 = { A: [0, s * u], B: [0, 0], C: [bc, 0], D: [ad, s * u] }; Object.assign(P0, { E: [0, eb], F: lerp(P0.D, P0.C, i / s) }); P0.P = meet(P0.A, P0.C, P0.E, P0.F);
          const fig = Fig(P0, [170, 150], { hub: 'ABCD' }).tint('EBCP').poly('ABCD').seg('EF AC').right('ABC').arrow('AD BC').arrow('EF', 1, 0.85).name('ABCDEF').free('P', 'ACEF').len('AE', cm(ae)).len('BC', cm(bc));
          return { i, j, ae, eb, bc, ep, s, u, fig };
        }, (x) => (x.ep + x.bc) * x.eb % 2 === 0 && x.s * x.u >= 0.6 * x.bc && x.s * x.u <= 1.3 * x.bc && x.bc <= 24 && !x.fig.clash());
        const { i, j, ae, eb, bc, ep } = v, area = (ep + bc) * eb / 2;
        return areaQ(`∠B = 90°이고 ${par('AD', 'BC')}인 사다리꼴 ABCD에서 두 점 E, F는 각각 변 AB, DC 위의 점이고 ${par('AD', 'EF', 'BC')}이다. ${jo('AC', '과/와')} ${SG('EF')}가 만나는 점을 P라 하자. ${nb(`${SG('DF')} : ${SG('FC')} = ${i} : ${j}`)}이고 ${eq('AE', ae)}, ${eq('BC', bc)}일 때, □EBCP의 넓이는?`, area, {
          figure: v.fig.svg(`각 B가 직각인 사다리꼴 ABCD(직각 표시). 변 AB가 세로로, 윗변 AD와 아랫변 BC가 가로로 놓여 있다. 점 E는 변 AB 위에, 점 F는 변 DC 위에 있고 변 AD, 선분 EF, 변 BC에 평행하다는 표시가 있다. 대각선 AC와 선분 EF가 점 P에서 만나고 사각형 EBCP가 색칠되어 있다. AE = ${cm(ae)}, BC = ${cm(bc)}`),
          explain: `${SG('AE')} : ${SG('EB')} = ${SG('DF')} : ${SG('FC')} = ${i} : ${j}이므로 ${SG('EB')} = ${eb} cm이다. △ABC에서 ${par('EP', 'BC')}이므로 ${SG('EP')} : ${SG('BC')} = ${SG('AE')} : ${SG('AB')} = ${ae} : ${ae + eb}이고 ${SG('EP')} = ${ep} cm이다. □EBCP는 ${SG('EP')}와 ${SG('BC')}가 평행하고 높이가 ${SG('EB')}인 사다리꼴이므로 넓이는 ${frac(1, 2)} × (${ep} + ${bc}) × ${eb} = ${area}(${SQ})이다.`,
          facts: { calc: [[`(${bc}*${ae}/(${ae}+${ae}*${j}/${i})+${bc})*(${ae}*${j}/${i})/2`, 0]], unseen: [2] }
        });
      }),
      H('hard-poles-mid', '평행한 세 선분과 두 중점을 이은 선분', '심21', (d) => {
        // AB : CD = p : q 이면 BP : PC = p : q. PC 의 중점 M 에서 BM : BC = (2p + q) : (2p + 2q) 이고 MN ∥ CD.
        const [ab, cdv, mn] = d.pick([[3, 6, 4], [6, 12, 8], [9, 18, 12], [12, 24, 16], [12, 6, 5], [24, 12, 10], [8, 24, 15], [4, 4, 3], [8, 8, 6], [12, 12, 9]]);
        const g = gcd(ab, cdv), p = ab / g, q = cdv / g;
        const v = d.until(() => {
          const width = Math.max(ab, cdv) * d.pick([1.2, 1.35, 1.5]), P0 = { A: [0, ab], B: [0, 0], D: [width, 0], C: [width, cdv] }; P0.P = meet(P0.A, P0.D, P0.B, P0.C); P0.Q = [P0.P[0], 0]; P0.M = half(P0.P, P0.C); P0.N = half(P0.Q, P0.D);
          const fig = Fig(P0, [190, 140]).seg('AB BD DC AD BC PQ MN').arrow('BA DC', 1, 0.2).arrow('QP', 1, 0.3).tick('PM MC').tick('QN ND', 2).name('ABCD').name('QN', 270).free('P', 'ADBCQ').free('M', 'BCN').len('AB', cm(ab)).len('DC', cm(cdv));
          return { fig };
        }, (x) => !x.fig.clash());
        return lenQ(`그림에서 ${par('AB', 'PQ', 'CD')}이고, 점 P는 ${jo('AD', '과/와')} ${SG('BC')}의 교점, 점 Q는 ${SG('BD')} 위의 점이다. ${SG('PC')}의 중점을 M, ${SG('QD')}의 중점을 N이라 하자. ${eq('AB', ab)}, ${eq('CD', cdv)}일 때, ${SG('MN')}의 길이는?`, mn, {
          figure: v.fig.svg(`가로로 놓인 선분 BD의 두 끝에 선분 AB와 선분 CD가 위로 서 있다. 선분 AD와 선분 BC가 점 P에서 만나고, 점 P에서 선분 BD 위의 점 Q까지 선분 PQ가 그어져 있다. 선분 AB, 선분 PQ, 선분 CD에 평행하다는 표시가 있다. 점 M은 선분 PC의 중점, 점 N은 선분 QD의 중점이고(길이가 같다는 표시) 선분 MN이 그어져 있다. AB = ${cm(ab)}, CD = ${cm(cdv)}`),
          explain: `${par('AB', 'CD')}이므로 ${SG('BP')} : ${SG('PC')} = ${SG('AB')} : ${SG('CD')} = ${p} : ${q}이다. ${SG('BP')} = ${ka(2 * p)}, ${SG('PC')} = ${ka(2 * q)}라 하면 ${SG('PM')} = ${ka(q)}이므로 ${SG('BM')} : ${SG('BC')} = ${K.simple(2 * p + q, 2 * p + 2 * q)}이다. ${par('PQ', 'CD')}이므로 ${SG('BQ')} : ${SG('QD')} = ${p} : ${q}이고, 같은 방법으로 ${SG('BN')} : ${SG('BD')} = ${(2 * p + q) / gcd(2 * p + q, 2 * p + 2 * q)} : ${(2 * p + 2 * q) / gcd(2 * p + q, 2 * p + 2 * q)}이다. 두 비가 같으므로 ${par('MN', 'CD')}이고 ${SG('MN')} = ${cdv} × ${K.fracOrInt(2 * p + q, 2 * p + 2 * q)} = ${mn}(cm)이다.`,
          facts: { calc: [[`${cdv}*(2*${ab}+${cdv})/(2*${ab}+2*${cdv})`, 0]], unseen: [2] }
        });
      }),
      H('hard-mid-chain', '두 변의 중점을 이은 선분을 두 번 쓰는 삼각형', '①42 심23 ①43', (d, n) => {
        if (n === 0) {
          const k = d.int(2, 6);
          const v = d.until(() => {
            const t3 = sas(d.pick([12, 13, 14]), d.pick([11, 12, 13]), d.int(10, 14) * 5), P0 = Object.assign({}, t3, { E: lerp(t3.A, t3.B, 1 / 3), F: lerp(t3.A, t3.B, 2 / 3), D: half(t3.B, t3.C) }); P0.P = meet(P0.A, P0.D, P0.E, P0.C);
            const fig = Fig(P0, [176, 156], { hub: 'ABC' }).poly('ABC').seg('AD EC FD').tick('AE EF FB').tick('BD DC', 2).name('ABCEF').name('D', 270).free('P', 'ADEC').lead('EP', cm(k), 'AB', 12);
            return { t3, fig };
          }, (x) => fine(x.t3, 40, 90) && !x.fig.clash());
          return lenQ(`△ABC에서 변 AB 위의 두 점 E, F에 대하여 ${nb(`${SG('AE')} = ${SG('EF')} = ${SG('FB')}`)}이고 점 D는 변 BC의 중점이다. ${jo('AD', '과/와')} ${SG('EC')}가 만나는 점을 P라 하자. ${eq('EP', k)}일 때, ${SG('PC')}의 길이는?`, 3 * k, {
            figure: v.fig.svg(`삼각형 ABC. 변 AB 위에 점 A에서 가까운 쪽부터 점 E, F가 있고 선분 AE, EF, FB에 길이가 같다는 표시가 있다. 점 D는 변 BC의 중점이다(길이가 같다는 표시). 선분 AD, 선분 EC, 선분 FD가 그어져 있고 선분 AD와 선분 EC는 점 P에서 만난다. EP = ${cm(k)}`),
            explain: `△BCE에서 두 점 F, D는 각각 ${SG('BE')}, ${SG('BC')}의 중점이므로 ${par('FD', 'EC')}이고 ${SG('FD')} = ${frac(1, 2)}${SG('EC')}이다. △AFD에서 점 E는 ${SG('AF')}의 중점이고 ${par('EP', 'FD')}이므로 ${SG('EP')} = ${frac(1, 2)}${SG('FD')}이다. ${SG('FD')} = 2 × ${k} = ${2 * k}(cm), ${SG('EC')} = 2 × ${2 * k} = ${4 * k}(cm)이므로 ${SG('PC')} = ${4 * k} − ${k} = ${3 * k}(cm)이다.`,
            facts: { calc: [[`2*2*${k}-${k}`, 0]], unseen: [2] }
          });
        }
        const k = d.int(2, 6);
        const v = d.until(() => {
          const t3 = sas(d.pick([9, 10]), d.pick([12, 13, 14]), d.int(12, 15) * 5), P0 = Object.assign({}, t3, { G: lerp(t3.A, t3.C, 1 / 3), F: lerp(t3.A, t3.C, 2 / 3), D: half(t3.B, t3.C), E: lerp(t3.A, t3.B, 2) });
          const fig = Fig(P0, [160, 210], { hub: 'ABC' }).poly('ABC').seg('BE BG FE').tick('AG GF FC').tick('BD DC', 2).name('ACGF').name('B', 180).name('E', 250).free('D', 'BCFE').len('DF', cm(k), 'C');
          return { t3, fig };
        }, (x) => fine(x.t3, 40, 90) && !x.fig.clash());
        return two(`△ABC에서 점 D는 변 BC의 중점이고, 변 AC 위에 점 A에서 가까운 쪽부터 두 점 G, F가 있어 ${nb(`${SG('AG')} = ${SG('GF')} = ${SG('FC')}`)}이다. ${SG('FD')}의 연장선과 ${SG('AB')}의 연장선이 만나는 점을 E라 하자. ${eq('DF', k)}일 때, ${jo('BG', '과/와')} ${SG('DE')}의 길이를 각각 구하시오.`, [[SG('BG'), 2 * k], [SG('DE'), 3 * k]], {
          figure: v.fig.svg(`삼각형 ABC. 변 AC 위에 점 A에서 가까운 쪽부터 점 G, F가 있고 선분 AG, GF, FC에 길이가 같다는 표시가 있다. 점 D는 변 BC의 중점이다(길이가 같다는 표시). 선분 BG가 그어져 있다. 변 AB를 점 B 너머로 늘인 선과, 점 F에서 점 D를 지나 그은 선이 점 E에서 만난다. DF = ${cm(k)}`),
          explain: `△CBG에서 두 점 D, F는 각각 ${SG('CB')}, ${SG('CG')}의 중점이므로 ${par('DF', 'BG')}이고 ${SG('BG')} = 2 × ${SG('DF')} = ${2 * k}(cm)이다. △AEF에서 점 G는 ${SG('AF')}의 중점이고 ${par('BG', 'EF')}이므로 ${SG('EF')} = 2 × ${SG('BG')} = ${4 * k}(cm)이다. ${SG('DE')} = ${4 * k} − ${k} = ${3 * k}(cm)이다.`,
          facts: { calc: [[`2*${k}`, 0], [`2*2*${k}-${k}`, 1]], unseen: [2] }
        });
      }, { count: 2 }),
      H('hard-mid-trisect', '두 변의 삼등분점을 이은 선분이 잘린 길이', '심24', (d) => {
        const k = d.int(1, 5), fg = 4 * k;
        const v = d.until(() => {
          const t3 = sas(d.pick([12, 13]), d.pick([12, 13]), d.int(11, 15) * 5), P0 = Object.assign({}, t3, { D: lerp(t3.A, t3.B, 1 / 3), F: lerp(t3.A, t3.B, 2 / 3), E: lerp(t3.A, t3.C, 1 / 3), G: lerp(t3.A, t3.C, 2 / 3) });
          P0.P = meet(P0.F, P0.G, P0.B, P0.E); P0.Q = meet(P0.F, P0.G, P0.C, P0.D);
          const fig = Fig(P0, [184, 150], { hub: 'ABC' }).poly('ABC').seg('DE FG BE CD').tick('AD DF FB').tick('AE EG GC', 2).name('ABCDEFG').free('P', 'FGBE').free('Q', 'FGCD').bow('FG', cm(fg), 12, 'A');
          return { t3, fig };
        }, (x) => fine(x.t3, 44, 86) && !x.fig.clash());
        return lenQ(`△ABC에서 변 AB 위에 점 A에서 가까운 쪽부터 두 점 D, F가 있어 ${nb(`${SG('AD')} = ${SG('DF')} = ${SG('FB')}`)}이고, 변 AC 위에 점 A에서 가까운 쪽부터 두 점 E, G가 있어 ${nb(`${SG('AE')} = ${SG('EG')} = ${SG('GC')}`)}이다. ${SG('FG')}가 ${SG('BE')}, ${SG('CD')}와 만나는 점을 각각 P, Q라 하자. ${eq('FG', fg)}일 때, ${SG('PQ')}의 길이는?`, 2 * k, {
          figure: v.fig.svg(`삼각형 ABC. 변 AB 위에 점 A에서 가까운 쪽부터 점 D, F가, 변 AC 위에 점 A에서 가까운 쪽부터 점 E, G가 있고, 변마다 세 조각에 길이가 같다는 표시가 있다. 선분 DE, 선분 FG, 선분 BE, 선분 CD가 그어져 있다. 선분 FG는 선분 BE와 점 P에서, 선분 CD와 점 Q에서 만나고, 선분 FG 위에 점 F, P, Q, G가 이 차례로 놓여 있다. FG = ${cm(fg)}`),
          explain: `△AFG에서 두 점 D, E는 각각 ${SG('AF')}, ${SG('AG')}의 중점이므로 ${par('DE', 'FG')}이고 ${SG('DE')} = ${frac(1, 2)}${SG('FG')} = ${2 * k} cm이다. △BED에서 점 F는 ${SG('BD')}의 중점이고 ${par('FP', 'DE')}이므로 ${SG('FP')} = ${frac(1, 2)}${SG('DE')} = ${k} cm이다. 같은 방법으로 △CDE에서 ${SG('QG')} = ${k} cm이다. ${SG('PQ')} = ${fg} − ${k} − ${k} = ${2 * k}(cm)이다.`,
          facts: { calc: [[`${fg}-${fg}/2/2-${fg}/2/2`, 0]], unseen: [2] }
        });
      }),
      H('hard-trap-mid-area', '사다리꼴의 두 변의 중점을 이은 선분이 나눈 넓이', '심30', (d) => {
        const [ad, bc, h] = d.pick([[4, 10, 4], [4, 8, 4], [6, 10, 4], [4, 12, 3], [6, 14, 3], [4, 10, 6], [6, 10, 5], [4, 8, 6], [6, 12, 4], [8, 12, 4], [6, 10, 3]]), mn = (ad + bc) / 2, s1 = (ad + mn) * h / 2, s2 = (mn + bc) * h / 2;
        const v = d.until(() => {
          const P0 = trapOf(ad, bc, 2 * h, (bc - ad) * d.pick([0.25, 0.4, 0.55])); Object.assign(P0, { M: half(P0.A, P0.B), N: half(P0.D, P0.C) });
          const fig = Fig(P0, [176, 132], { hub: 'ABCD' }).tint('MBCN').poly('ABCD').seg('MN').arrow('AD BC').tick('AM MB').tick('DN NC', 2).name('ABCDMN').len('AD', cm(ad)).len('BC', cm(bc));
          return { fig };
        }, (x) => !x.fig.clash());
        return areaQ(`${par('AD', 'BC')}인 사다리꼴 ABCD에서 두 변 AB, DC의 중점을 각각 M, N이라 하자. ${eq('AD', ad)}, ${eq('BC', bc)}이고 □AMND의 넓이가 ${s1} ${SQ}일 때, □MBCN의 넓이는?`, s2, {
          figure: v.fig.svg(`사다리꼴 ABCD. 윗변 AD와 아랫변 BC에 평행하다는 표시가 있다. 점 M은 변 AB의 중점, 점 N은 변 DC의 중점이고(길이가 같다는 표시) 선분 MN이 그어져 있다. 사각형 MBCN이 색칠되어 있다. AD = ${cm(ad)}, BC = ${cm(bc)}`),
          explain: `${par('AD', 'MN', 'BC')}이고 ${SG('MN')} = ${frac(1, 2)} × (${ad} + ${bc}) = ${mn}(cm)이다. □AMND의 높이를 ${V('h')} cm라 하면 ${frac(1, 2)} × (${ad} + ${mn}) × ${V('h')} = ${s1}에서 ${V('h')} = ${h}이다. ${SG('AM')} = ${SG('MB')}이므로 □MBCN의 높이도 ${h} cm이고, 넓이는 ${frac(1, 2)} × (${mn} + ${bc}) × ${h} = ${s2}(${SQ})이다.`,
          facts: { calc: [[`${s1}*(${ad}+3*${bc})/(3*${ad}+${bc})`, 0]], unseen: [3] }
        });
      }),
      H('hard-cent-right', '무게중심에서 밑변의 두 끝을 본 각이 직각인 삼각형', '①50', (d) => {
        const k = d.int(1, 5), bc = 6 * k;
        const v = d.until(() => {
          const th = d.int(15, 21) * 5, Gp = pol(3, th), P0 = { A: [3 * Gp[0], 3 * Gp[1]], B: [-3, 0], C: [3, 0], M: [0, 0], G: Gp, Q: [Gp[0] / 3, Gp[1] / 3] };
          const fig = Fig(P0, [150, 196], { hub: 'ABC', show: { Q: 'G′' } }).poly('ABC').seg('AM GB GC').dot('GQ').right('BGC').tick('BM MC').name('ABC').name('M', 270);
          fig.free('G', 'AMBC').name('Q', th > 90 ? 180 : 0, 13).bow('BC', cm(bc), 26);
          return { fig };
        }, (x) => !x.fig.clash());
        const G2 = 'G′';
        return lenQ(`△ABC에서 점 M은 변 BC의 중점이고, 점 G는 △ABC의 무게중심, 점 ${G2}은 △GBC의 무게중심이다. ∠BGC = 90°이고 ${eq('BC', bc)}일 때, ${SG('A' + G2)}의 길이는?`, 8 * k, {
          figure: v.fig.svg(`삼각형 ABC와 중선 AM. 점 M은 변 BC의 중점이고(길이가 같다는 표시) 선분 AM 위에 점 A에서 가까운 쪽부터 점 G, ${G2}이 있다. 선분 GB와 선분 GC가 그어져 있고 각 BGC에 직각 표시가 있다. BC = ${cm(bc)}`),
          explain: `△GBC는 ∠BGC = 90°인 직각삼각형이고 점 M은 빗변 BC의 중점이므로 외심이다. ${SG('GM')} = ${SG('BM')} = ${SG('CM')} = ${3 * k} cm이다. 점 G는 △ABC의 무게중심이므로 ${SG('AG')} = 2 × ${SG('GM')} = ${6 * k}(cm)이고, 점 ${G2}은 △GBC의 무게중심이므로 ${SG('G' + G2)} = ${frac(2, 3)} × ${SG('GM')} = ${2 * k}(cm)이다. ${SG('A' + G2)} = ${6 * k} + ${2 * k} = ${8 * k}(cm)이다.`,
          facts: { calc: [[`${bc}/2*2+${bc}/2*2/3`, 0]], unseen: [2, 3] }
        });
      }),
      H('hard-cent-mid-par', '중점에서 밑변에 평행하게 그은 선분과 무게중심', '①54 심37 심38', (d) => {
        const v = d.until(() => {
          const k = d.int(1, 4), j = d.int(1, 6), ad = 6 * k, dc = 2 * j, P0 = medOf(2 * dc, ad, d.int(14, 20) * 5);
          P0.E = half(P0.A, P0.B); P0.F = half(P0.A, P0.D);
          const fig = Fig(P0, [190, 164], { hub: 'ABC' }).poly('ABC').seg('AD CE EF').dot('G').arrow('EF', 1, 0.5).arrow('BC', 1, 0.2).tick('AE EB').name('ABCE').name('D', 270);
          fig.nameMid('F', 'A', 'E').nameMid('G', 'E', 'D').bowOut('AD', cm(ad), 11, 'B', 'AC').len('DC', cm(dc), 'A');
          return { k, j, ad, dc, P0, fig };
        }, (x) => x.ad >= 0.6 * 2 * x.dc && x.ad <= 1.3 * 2 * x.dc && fine(x.P0, 40, 92) && !x.fig.clash());
        const { k, j, ad, dc } = v;
        return two(`△ABC에서 두 점 D, E는 각각 변 BC, AB의 중점이고 점 G는 두 중선 AD, CE의 교점이다. 점 E를 지나고 변 BC에 평행한 직선이 ${SG('AD')}와 만나는 점을 F라 하자. ${eq('AD', ad)}, ${eq('DC', dc)}일 때, ${jo('GF', '과/와')} ${SG('EF')}의 길이를 각각 구하시오.`, [[SG('GF'), k], [SG('EF'), j]], {
          figure: v.fig.svg(`삼각형 ABC와 두 중선 AD, CE. 점 D는 변 BC 위에, 점 E는 변 AB의 중점이고(길이가 같다는 표시) 두 중선은 점 G에서 만난다. 점 E에서 중선 AD 위의 점 F까지 선분 EF가 그어져 있고, 선분 EF와 변 BC에 평행하다는 표시가 있다. 선분 AD 위에 점 A, F, G, D가 이 차례로 놓여 있다. AD = ${cm(ad)}, DC = ${cm(dc)}`),
          explain: `${SG('GD')} = ${frac(1, 3)} × ${ad} = ${2 * k}(cm)이다. △ABD에서 점 E는 ${SG('AB')}의 중점이고 ${par('EF', 'BD')}이므로 점 F는 ${SG('AD')}의 중점이고 ${SG('EF')} = ${frac(1, 2)}${SG('BD')}이다. ${SG('FD')} = ${3 * k} cm이므로 ${SG('GF')} = ${3 * k} − ${2 * k} = ${k}(cm)이다. ${SG('BD')} = ${SG('DC')} = ${dc} cm이므로 ${SG('EF')} = ${j} cm이다.`,
          facts: { calc: [[`${ad}/2-${ad}/3`, 0], [`${dc}/2`, 1]], unseen: [2, 3] }
        });
      }),
      H('hard-cent-par-right', '직각삼각형의 무게중심을 지나는 평행선', '심34', (d) => {
        const k = d.int(1, 6), de = 4 * k;
        const v = d.until(() => {
          const th = d.pick([70, 78, 86, 94, 102, 110]), A = plus([3, 0], pol(3, th)), P0 = { A, B: [0, 0], C: [6, 0] };
          Object.assign(P0, { D: lerp(A, P0.B, 2 / 3), E: lerp(A, P0.C, 2 / 3), G: cen(P0) });
          const fig = Fig(P0, [210, 120], { hub: 'ABC' }).poly('ABC').seg('DE').dot('G').right('BAC').arrow('DE', 1, 0.12).arrow('BC', 1, 0.12).name('ABC').name('G', 270, 12);
          fig.name('D', dirOf(fig.P.B, fig.P.A) + 90).name('E', dirOf(fig.P.C, fig.P.A) - 90).bow('DE', cm(de), 11, 'B');
          return { fig };
        }, (x) => !x.fig.clash());
        return lenQ(`∠A = 90°인 직각삼각형 ABC의 무게중심 G를 지나고 변 BC에 평행한 직선이 두 변 AB, AC와 만나는 점을 각각 D, E라 하자. ${eq('DE', de)}일 때, ${SG('AG')}의 길이는?`, 2 * k, {
          figure: v.fig.svg(`각 A가 직각인 직각삼각형 ABC(직각 표시). 빗변 BC가 가로로 놓여 있다. 무게중심 G를 지나는 선분 DE가 변 AB와 점 D에서, 변 AC와 점 E에서 만나고, 선분 DE와 변 BC에 평행하다는 표시가 있다. DE = ${cm(de)}`),
          explain: `${SG('AG')}의 연장선이 변 BC와 만나는 점을 M이라 하면 ${SG('AM')}은 중선이고 ${SG('AG')} : ${SG('AM')} = 2 : 3이다. ${par('DE', 'BC')}이므로 ${SG('DE')} : ${SG('BC')} = ${SG('AD')} : ${SG('AB')} = ${SG('AG')} : ${SG('AM')} = 2 : 3이고 ${SG('BC')} = ${6 * k} cm이다. 직각삼각형의 빗변의 중점 M은 외심이므로 ${SG('AM')} = ${SG('BM')} = ${frac(1, 2)} × ${6 * k} = ${3 * k}(cm)이다. ${SG('AG')} = ${frac(2, 3)} × ${3 * k} = ${2 * k}(cm)이다.`,
          facts: { calc: [[`${de}*3/2/2*2/3`, 0]], unseen: [3, 2] }
        });
      }),
      H('hard-cent-par-area', '무게중심을 지나는 평행선이 자른 삼각형의 넓이', '심42 ①64', (d, n) => {
        const fig = tidy(d, () => {
          const t3 = anyTri(d), P0 = Object.assign({}, t3, { D: half(t3.B, t3.C), G: cen(t3), E: lerp(t3.A, t3.B, 2 / 3), F: lerp(t3.A, t3.C, 2 / 3) });
          return Fig(P0, [176, 132], { hub: 'ABC' }).tint(n === 0 ? 'AED' : 'FDC').poly('ABC').seg(n === 0 ? 'AD EF ED' : 'AD EF FD').dot('G').arrow('EF', 1, n === 0 ? 0.8 : 0.2).arrow('BC', 1, n === 0 ? 0.8 : 0.2).tick('BD DC').name('ABCEF').name('D', 270).nameMid('G', n === 0 ? 'F' : 'E', 'A');
        });
        const lead = '△ABC에서 점 D는 변 BC의 중점이고 점 G는 △ABC의 무게중심이다. 점 G를 지나고 변 BC에 평행한 직선이 두 변 AB, AC와 만나는 점을 각각 E, F라 하자.';
        const said = '삼각형 ABC와 중선 AD. 점 D는 변 BC의 중점이고(길이가 같다는 표시) 무게중심 G는 선분 AD 위에 있다. 점 G를 지나는 선분 EF가 변 AB와 점 E에서, 변 AC와 점 F에서 만나고, 선분 EF와 변 BC에 평행하다는 표시가 있다.';
        if (n === 0) {
          const S = 6 * d.int(3, 15);
          return areaQ(`${lead} △ABC의 넓이가 ${S} ${SQ}일 때, △AED의 넓이는?`, S / 3, {
            figure: fig.svg(`${said} 선분 ED가 그어져 있고 삼각형 AED가 색칠되어 있다`),
            explain: `△ABD에서 ${par('EG', 'BD')}이므로 ${SG('AE')} : ${SG('EB')} = ${SG('AG')} : ${SG('GD')} = 2 : 1이다. 중선 AD는 넓이를 이등분하므로 △ABD의 넓이는 ${S / 2} ${SQ}이다. △AED와 △EBD는 높이가 같으므로 넓이의 비는 ${SG('AE')} : ${SG('EB')} = 2 : 1이고, △AED의 넓이는 ${S / 2} × ${frac(2, 3)} = ${S / 3}(${SQ})이다.`,
            facts: { calc: [[`${S}/2*2/3`, 0]], unseen: [2, 3] }
          });
        }
        const k = d.int(3, 14);
        return areaQ(`${lead} △FDC의 넓이가 ${k} ${SQ}일 때, △ABC의 넓이는?`, 6 * k, {
          figure: fig.svg(`${said} 선분 FD가 그어져 있고 삼각형 FDC가 색칠되어 있다`),
          explain: `△ADC에서 ${par('GF', 'DC')}이므로 ${SG('AF')} : ${SG('FC')} = ${SG('AG')} : ${SG('GD')} = 2 : 1이다. △AFD와 △FDC는 높이가 같으므로 넓이의 비는 2 : 1이고, △ADC의 넓이는 ${k} × 3 = ${3 * k}(${SQ})이다. 중선 AD는 넓이를 이등분하므로 △ABC의 넓이는 ${3 * k} × 2 = ${6 * k}(${SQ})이다.`,
          facts: { calc: [[`${k}*3*2`, 0]], unseen: [3, 2] }
        });
      }, { count: 2 })
    ]
  });
  // ── 기본 묶음에 덧붙이는 꼴 ──
  // 받으면서 실력에서 기본으로 내린 꼴: 기본에서 하는 일을 다시 묻거나 한 번에 풀리는 것.
  const TB = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: src(ref), make: K.glued(make) }, more || {});
  B.addTypes('8-2-4', 'trap', [
    TB('trap-poles-area', '한 직선에 수직인 세 선분과 삼각형의 넓이', '심19 ①32', (d) => {
      // EF : DC = BE : BD = a : (a + b) (BE : ED = a : b 가 아니다). △EBC = BC × EF ÷ 2 = w·a·b ÷ (2(a + b))
      const [a, b, w] = d.pick([[4, 10, 14], [6, 12, 10], [3, 6, 8], [4, 12, 8], [6, 3, 12], [10, 15, 12], [6, 10, 16], [12, 6, 10], [6, 12, 14]]), area = w * a * b / (2 * (a + b));
      const P0 = { A: [0, a], B: [0, 0], C: [w, 0], D: [w, b] }; P0.E = meet(P0.A, P0.C, P0.B, P0.D); P0.F = [P0.E[0], 0];
      const fig = Fig(P0, [168, 130]).tint('EBC').seg('AB BC DC AC BD EF').right('ABC').right('EFC').right('DCB').name('ABCD').name('F', 270).free('E', 'ABCDF').len('AB', cm(a)).len('DC', cm(b)).bow('BC', cm(w), 26);
      // 틀린 보기: EF : DC = BE : ED 로 잡아 EF = AB 로 본 아이(w·a/2), 2 로 나누지 않은 아이(2·area), EF 를 두 선분의 길이의 평균으로 본 아이(w(a + b)/4)
      const options = d.shuffle([area, w * a / 2, 2 * area, w * (a + b) / 4]);
      return C(`그림과 같이 ${SG('AB')}, ${SG('EF')}, ${SG('DC')}가 모두 ${SG('BC')}에 수직이고, 점 E는 ${jo('AC', '과/와')} ${SG('BD')}의 교점이다. ${eq('AB', a)}, ${eq('DC', b)}, ${eq('BC', w)}일 때, △EBC의 넓이는?`, options.map((x) => `${x} ${SQ}`), options.indexOf(area), {
        figure: fig.svg(`가로로 놓인 선분 BC의 두 끝에 선분 AB와 선분 DC가 위로 서 있다. 선분 AC와 선분 BD가 점 E에서 만나고, 점 E에서 선분 BC 위의 점 F까지 선분 EF가 그어져 있다. 선분 AB, EF, DC는 모두 선분 BC에 수직이다(직각 표시). 삼각형 EBC가 색칠되어 있다. AB = ${cm(a)}, DC = ${cm(b)}, BC = ${cm(w)}`),
        explain: `세 선분이 모두 ${SG('BC')}에 수직이므로 ${par('AB', 'EF', 'DC')}이다. ${SG('BE')} : ${SG('ED')} = ${SG('AB')} : ${SG('DC')} = ${K.simple(a, b)}이므로 △BCD에서 ${SG('EF')} : ${SG('DC')} = ${SG('BE')} : ${SG('BD')} = ${a / gcd(a, b)} : ${(a + b) / gcd(a, b)}이다(${SG('BE')} : ${SG('ED')}가 아니다). ${SG('EF')} = ${b} × ${frac(a / gcd(a, b), (a + b) / gcd(a, b))} = ${K.fracOrInt(a * b, a + b)}(cm)이고, △EBC의 넓이는 ${frac(1, 2)} × ${w} × ${K.fracOrInt(a * b, a + b)} = ${area}(${SQ})이다.`,
        facts: { pick: { expr: `${w}*${a}*${b}/(${a}+${b})/2`, options }, unseen: [2] }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
