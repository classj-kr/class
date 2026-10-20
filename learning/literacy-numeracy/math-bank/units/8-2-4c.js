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
    id: 'hard', title: '단원 종합', standard: STD,
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
          explain: `${nb(`${SG('AD')} : ${SG('DB')} = ${SG('AE')} : ${SG('EC')}`)}일 때에만 ${par('BC', 'DE')}이다. 정답인 경우는 ${SG('DB')} = ${R[0] + R[1]} − ${R[0]} = ${R[1]}(cm)이므로 ${SG('AD')} : ${SG('DB')} = ${K.simple(R[0], R[1])}, ${SG('AE')} : ${SG('EC')} = ${K.simple(R[2], R[3])}${B.kit.mid.tail(R[3] / B.kit.mid.gcd(R[2], R[3]), '으로/로')} 두 비가 같다. 나머지는 자리가 엇갈린 비(${SG('AD')} : ${SG('DB')}와 ${SG('EC')} : ${SG('AE')})나 전체와 부분을 섞은 비가 같을 뿐이고, 조각끼리의 비 ${SG('AD')} : ${SG('DB')}와 ${SG('AE')} : ${SG('EC')}는 같지 않다.`,
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
  // ── 다시 보아 덧붙인 실력 문항 ──
  // 처음 지을 때 「보조선을 스스로 그어야 한다, 닮음·중점을 세 번 넘게 잇는다, 합동을 스스로 찾아야 한다, 어려움이 단원 밖에서 온다」는 까닭으로 뺐던 꼴을 다시 따져 실었다.
  // 모두 ② 세 단계 넘게 이어 생각해야 풀리는 문제다. 꼴마다의 판정은 대조표에 있다.
  //  - 내심과 이등변삼각형(8-2-1), 삼각형의 합동과 부채꼴의 호의 길이(중1)는 앞에서 배운 내용이라 그대로 쓴다.
  //  - 삼각형의 각의 이등분선과 선분의 길이의 비는 2022 개정 교육과정에 정리로 나오지 않는다. 2022 자료(미래엔 2022 출제대비 문제은행)에 나온 심13만 실었고 문제 글에서 그 정리를 알려 주지 않는다.
  //    풀이는 평행한 보조선과 이등변삼각형으로 적었다(이 단원과 앞 단원의 내용만 쓴다). 2015 자료에만 나온 ①17·18 심14·15는 싣지 않았다.
  //  - 수는 답과 풀이의 중간 값이 자연수가 되는 것으로 골랐다. 그런 수가 드문 유형은 수의 목록에서 고른다.
  const { dist, sv } = B.kit.mgeo;
  const { sss, sab, X, LV, simple, fracOrInt } = K;
  const RATIO = '가장 간단한 자연수의 비로 나타내시오.';
  const ratio2 = (text, a, b, o) => ratioQ(text, a, b, Object.assign({ shown: `${a} : ${b}` }, o));
  // 원주율이 든 길이 「□π cm」: π의 계수를 받는다.
  const piLen = (text, k, o) => Object.assign(lenQ(text, k, Object.assign({}, o, { unit: 'π cm' })), { shown: `${k}π cm` });
  // 내심: 마주 보는 변의 길이를 무게로 한 세 꼭짓점의 평균
  const incOf = (t) => { const a = dist(t.B, t.C), b = dist(t.C, t.A), c = dist(t.A, t.B), s = a + b + c; return [(a * t.A[0] + b * t.B[0] + c * t.C[0]) / s, (a * t.A[1] + b * t.B[1] + c * t.C[1]) / s]; };
  // 화면의 점 v 에서 두 점 p, q 를 바라보는 두 방향의 가운데 방향(작은 각 쪽)
  const between = (v, p, q) => { const from = dirOf(v, p), turn = ((dirOf(v, q) - from + 540) % 360) - 180; return from + turn / 2; };
  // 크기가 같은 각의 표시: 꼭짓점 v 의 각 pvq 의 가운데에 ●(kind 'x' 이면 ×)
  const mark = (fig, v, p, q, kind, far) => fig.b.sym(fig.P[v], between(fig.P[v], fig.P[p], fig.P[q]), kind, far);
  // 내심을 지나는 평행선에 쓰는 삼각형 [BC, 나머지 두 변]: 잘린 네 조각이 모두 자연수이다.
  const INC = [[12, 9, 15], [12, 16, 20], [15, 12, 18], [18, 15, 21], [20, 28, 32], [21, 18, 24], [24, 16, 24], [24, 21, 27], [30, 20, 25], [27, 24, 30], [24, 18, 30], [14, 14, 21]];
  // 내각과 외각의 이등분선에 쓰는 수 [AB, AC, BD, DC, CE]
  const BIS = [[8, 4, 4, 2, 6], [10, 5, 6, 3, 9], [12, 6, 6, 3, 9], [12, 6, 8, 4, 12], [6, 3, 4, 2, 6], [9, 3, 6, 2, 4], [12, 4, 9, 3, 6], [15, 5, 9, 3, 6], [15, 5, 12, 4, 8], [16, 4, 12, 3, 5], [10, 6, 5, 3, 12], [21, 9, 14, 6, 15]];
  B.addTypes(UNIT, 'hard', [
    H('hard-trap-diag-pts', '사다리꼴의 두 대각선 위의 점을 이은 평행한 선분', '①28', (d) => {
      // BE : ED = CF : FA = j : i. 변 AB 위의 점이 주어지지 않는다: 선분 FE 를 늘여 변 AB 와 만나는 점을 스스로 잡아야 한다.
      const v = d.until(() => {
        const [j, i] = d.pick([[1, 3], [1, 2], [2, 3], [1, 4], [2, 5], [3, 4]]), s = i + j, p = d.int(1, 5), q = d.int(2, 6), ad = s * p, bc = s * q, P0 = trapOf(ad, bc, bc * d.pick([0.6, 0.68, 0.76]), (bc - ad) * d.pick([0.3, 0.45, 0.6]));
        Object.assign(P0, { E: lerp(P0.B, P0.D, j / s), F: lerp(P0.C, P0.A, j / s) });
        const fig = Fig(P0, [190, 140], { hub: 'ABCD' }).poly('ABCD').seg('AC BD EF').arrow('AD BC').arrow('EF').name('ABCD').free('E', 'BDF').free('F', 'ACE').len('AD', cm(ad)).len('BC', cm(bc));
        return { i, j, s, p, q, ad, bc, fig };
      }, (x) => x.ad < x.bc && x.bc <= 30 && (x.i * x.q - x.j * x.p) / x.bc >= 0.26 && x.ad / x.bc >= 0.3 && !x.fig.clash());
      const { i, j, s, p, q, ad, bc } = v, ge = j * p, gf = i * q;
      return lenQ(`${par('AD', 'BC')}인 사다리꼴 ABCD에서 점 E는 대각선 BD 위의 점, 점 F는 대각선 AC 위의 점이고 ${par('AD', 'EF', 'BC')}이다. ${nb(`${SG('BE')} : ${SG('ED')} = ${SG('CF')} : ${SG('FA')} = ${j} : ${i}`)}이고 ${eq('AD', ad)}, ${eq('BC', bc)}일 때, ${SG('EF')}의 길이는?`, gf - ge, {
        figure: v.fig.svg(`사다리꼴 ABCD와 두 대각선 AC, BD. 윗변 AD와 아랫변 BC가 가로로 놓여 있다. 점 E는 대각선 BD 위에, 점 F는 대각선 AC 위에 있고 선분 EF가 그어져 있다. 변 AD, 선분 EF, 변 BC에 평행하다는 표시가 있다. AD = ${cm(ad)}, BC = ${cm(bc)}`),
        explain: `${SG('FE')}의 연장선이 변 AB와 만나는 점을 G라 하자. △ABD에서 ${par('GE', 'AD')}이므로 ${SG('GE')} : ${SG('AD')} = ${SG('BE')} : ${SG('BD')} = ${j} : ${s}이고 ${SG('GE')} = ${ge} cm이다. △ABC에서 ${par('GF', 'BC')}이므로 ${SG('GF')} : ${SG('BC')} = ${SG('AF')} : ${SG('AC')} = ${i} : ${s}이고 ${SG('GF')} = ${gf} cm이다. ${SG('EF')} = ${SG('GF')} − ${SG('GE')} = ${gf} − ${ge} = ${gf - ge}(cm)이다.`,
        facts: { calc: [[`${bc}*${i}/(${j}+${i})-${ad}*${j}/(${j}+${i})`, 0]] }
      });
    }),
    H('hard-trap-mid-diag', '사다리꼴의 밑변의 중점과 두 대각선', '①29', (d) => {
      // AP : PM = AD : BM, DQ : QM = AD : MC 이고 BM = MC 이므로 PQ ∥ AD. PQ = AD × BM ÷ (AD + BM)
      const [ad, bc, pq] = d.pick([[15, 20, 6], [14, 21, 6], [5, 15, 3], [10, 30, 6], [3, 12, 2], [6, 24, 4]]), bm = bc / 2, g = gcd(ad, bm), x = ad / g, y = bm / g;
      const v = d.until(() => {
        const P0 = trapOf(ad, bc, bc * d.pick([0.5, 0.58, 0.66]), (bc - ad) * d.pick([0.3, 0.45, 0.6]));
        P0.M = half(P0.B, P0.C); P0.P = meet(P0.A, P0.M, P0.B, P0.D); P0.Q = meet(P0.D, P0.M, P0.A, P0.C);
        const fig = Fig(P0, [200, 140], { hub: 'ABCD' }).poly('ABCD').seg('AM BD DM AC PQ').arrow('AD', 1, 0.5).arrow('BC', 1, 0.1).tick('BM MC').name('ABCD').name('M', 270).free('P', 'AMBDQ').free('Q', 'DMACP').len('AD', cm(ad), null, { gap: 9 }).bow('BC', cm(bc), 26);
        return { fig };
      }, (z) => !z.fig.clash());
      return lenQ(`${par('AD', 'BC')}인 사다리꼴 ABCD에서 변 BC의 중점을 M이라 하고, ${jo('AM', '과/와')} ${SG('BD')}가 만나는 점을 P, ${jo('DM', '과/와')} ${SG('AC')}가 만나는 점을 Q라 하자. ${eq('AD', ad)}, ${eq('BC', bc)}일 때, ${SG('PQ')}의 길이는?`, pq, {
        figure: v.fig.svg(`사다리꼴 ABCD. 윗변 AD와 아랫변 BC에 평행하다는 표시가 있다. 점 M은 변 BC의 중점이다(길이가 같다는 표시). 선분 AM과 대각선 BD가 점 P에서, 선분 DM과 대각선 AC가 점 Q에서 만나고 선분 PQ가 그어져 있다. AD = ${cm(ad)}, BC = ${cm(bc)}`),
        explain: `${SG('BM')} = ${SG('MC')} = ${bm} cm이다. ${par('AD', 'BM')}이므로 ${SG('AP')} : ${SG('PM')} = ${SG('AD')} : ${SG('BM')} = ${simple(ad, bm)}이고, ${par('AD', 'MC')}이므로 ${SG('DQ')} : ${SG('QM')} = ${SG('AD')} : ${SG('MC')} = ${simple(ad, bm)}이다. △MAD에서 ${SG('MP')} : ${SG('PA')} = ${SG('MQ')} : ${SG('QD')}이므로 ${par('PQ', 'AD')}이고 ${SG('PQ')} : ${SG('AD')} = ${SG('MP')} : ${SG('MA')} = ${y} : ${x + y}이다. ${SG('PQ')} = ${ad} × ${frac(y, x + y)} = ${pq}(cm)이다.`,
        facts: { calc: [[`${ad}*(${bc}/2)/(${ad}+${bc}/2)`, 0]], unseen: [2] }
      });
    }),
    H('hard-median-mid', '중선의 중점을 지나는 선분', '심27 ①44', (d, n) => {
      if (n === 0) {
        const k = d.int(2, 7), ae = 3 * k;
        const v = d.until(() => {
          const t3 = sas(d.pick([11, 12, 13]), d.pick([11, 12, 13]), d.int(10, 15) * 5), P0 = Object.assign({}, t3, { D: half(t3.A, t3.B), F: lerp(t3.B, t3.C, 2 / 3) }); P0.E = half(P0.D, P0.C);
          const fig = Fig(P0, [184, 150], { hub: 'ABC' }).poly('ABC').seg('DC AF').tick('AD DB').tick('DE EC', 2).name('ABCD').name('F', 270).free('E', 'AFDC').lead('AE', cm(ae), 'AC', 12);
          return { t3, fig };
        }, (x) => fine(x.t3, 44, 88) && !x.fig.clash());
        return lenQ(`△ABC에서 변 AB의 중점을 D, ${SG('DC')}의 중점을 E라 하고, ${SG('AE')}의 연장선이 변 BC와 만나는 점을 F라 하자. ${eq('AE', ae)}일 때, ${SG('EF')}의 길이는?`, k, {
          figure: v.fig.svg(`삼각형 ABC. 점 D는 변 AB의 중점이고(길이가 같다는 표시) 선분 DC가 그어져 있다. 점 E는 선분 DC의 중점이다(길이가 같다는 표시). 점 A에서 점 E를 지나 변 BC 위의 점 F까지 선분 AF가 그어져 있다. AE = ${cm(ae)}`),
          explain: `점 D를 지나고 변 BC에 평행한 직선이 ${SG('AF')}와 만나는 점을 G라 하자. △EDG와 △ECF에서 ${nb(`${SG('ED')} = ${SG('EC')}`)}, ∠DEG = ∠CEF(맞꼭지각), ∠EDG = ∠ECF(엇각)이므로 두 삼각형은 합동이고 ${nb(`${SG('EG')} = ${SG('EF')}`)}이다. △ABF에서 점 D는 ${SG('AB')}의 중점이고 ${par('DG', 'BF')}이므로 ${nb(`${SG('AG')} = ${SG('GF')}`)}이고, ${SG('GF')} = 2 × ${SG('EF')}이다. ${SG('AE')} = ${SG('AG')} + ${SG('GE')} = 3 × ${SG('EF')}이므로 ${SG('EF')} = ${ae} ÷ 3 = ${k}(cm)이다.`,
          facts: { calc: [[`${ae}/3`, 0]], unseen: [3] }
        });
      }
      const k = d.int(2, 8), bc = 3 * k;
      const v = d.until(() => {
        const t3 = sab(d.pick([12, 13, 14]), d.pick([7, 8]), d.int(11, 14) * 5), P0 = Object.assign({}, t3, { D: lerp(t3.B, t3.A, 2), E: half(t3.A, t3.C), F: lerp(t3.B, t3.C, 2 / 3) });
        const fig = Fig(P0, [176, 206], { hub: 'ABC' }).poly('ABC').seg('AD DF').tick('AB AD').tick('AE EC', 2).name('BC').name('D', 90).name('F', 270).nameAway('A', 'CEF').free('E', 'ACDF').bow('BC', cm(bc), 26);
        return { t3, fig };
      }, (x) => fine(x.t3, 40, 92) && !x.fig.clash());
      return lenQ(`△ABC에서 변 BA의 연장선 위에 ${nb(`${SG('AB')} = ${SG('AD')}`)}인 점 D를 잡고, 변 AC의 중점을 E, ${SG('DE')}의 연장선이 변 BC와 만나는 점을 F라 하자. ${eq('BC', bc)}일 때, ${SG('CF')}의 길이는?`, k, {
        figure: v.fig.svg(`삼각형 ABC. 변 BA를 점 A 너머로 늘인 선 위에 점 D가 있고 선분 AB와 선분 AD에 길이가 같다는 표시가 있다. 점 E는 변 AC의 중점이다(길이가 같다는 표시). 점 D에서 점 E를 지나 변 BC 위의 점 F까지 선분 DF가 그어져 있다. BC = ${cm(bc)}`),
        explain: `점 A를 지나고 변 BC에 평행한 직선이 ${SG('DF')}와 만나는 점을 G라 하자. △AEG와 △CEF에서 ${nb(`${SG('AE')} = ${SG('CE')}`)}, ∠GAE = ∠FCE(엇각), ∠AEG = ∠CEF(맞꼭지각)이므로 두 삼각형은 합동이고 ${nb(`${SG('AG')} = ${SG('CF')}`)}이다. △DBF에서 점 A는 ${SG('DB')}의 중점이고 ${par('AG', 'BF')}이므로 ${SG('BF')} = 2 × ${SG('AG')} = 2 × ${SG('CF')}이다. ${SG('BC')} = ${SG('BF')} + ${SG('CF')} = 3 × ${SG('CF')}이므로 ${SG('CF')} = ${bc} ÷ 3 = ${k}(cm)이다.`,
        facts: { calc: [[`${bc}/3`, 0]], unseen: [3] }
      });
    }, { count: 2 }),
    H('hard-zigzag', '번갈아 평행한 선분이 꺾이며 이어지는 삼각형', '심8', (d) => {
      // AD : DF = AE : EG = AF : FH = AG : GC = AH : HB (평행선의 비를 네 번 잇는다)
      const v = d.until(() => {
        const [ad, df, fh, hb] = d.pick([[8, 4, 6, 9], [16, 8, 12, 18], [24, 12, 18, 27], [27, 9, 12, 16]]), af = ad + df, ah = af + fh, ab = ah + hb, t3 = sas(12, d.pick([10.5, 11.5, 12.5]), d.int(10, 13) * 5);
        const P0 = Object.assign({}, t3, { D: lerp(t3.A, t3.B, ad / ab), F: lerp(t3.A, t3.B, af / ab), H: lerp(t3.A, t3.B, ah / ab), E: lerp(t3.A, t3.C, ad / ah), G: lerp(t3.A, t3.C, af / ah) });
        const fig = Fig(P0, [190, 200], { hub: 'ABC' }).poly('ABC').seg('DE FE FG HG HC').arrow('DE FG HC', 1, 0.55).arrow('FE HG BC', 2, 0.45).name('ABCDFHEG').len('AD', cm(ad)).len('DF', cm(df));
        return { ad, df, fh, hb, af, ah, t3, fig };
      }, (x) => fine(x.t3, 44, 88) && !x.fig.clash());
      const { ad, df, fh, hb, af, ah } = v, g = gcd(ad, df), p = ad / g, q = df / g;
      return two(`△ABC에서 변 AB 위에 점 A에서 가까운 쪽부터 세 점 D, F, H가, 변 AC 위에 점 A에서 가까운 쪽부터 두 점 E, G가 있고 ${par('DE', 'FG', 'HC')}, ${par('FE', 'HG', 'BC')}이다. ${eq('AD', ad)}, ${eq('DF', df)}일 때, ${jo('FH', '과/와')} ${SG('HB')}의 길이를 각각 구하시오.`, [[SG('FH'), fh], [SG('HB'), hb]], {
        figure: v.fig.svg(`삼각형 ABC. 변 AB 위에 점 A에서 가까운 쪽부터 점 D, F, H가, 변 AC 위에 점 A에서 가까운 쪽부터 점 E, G가 있다. 선분 DE, FE, FG, HG, HC가 차례로 꺾이며 그어져 있다. 선분 DE, FG, HC에 평행하다는 표시가, 선분 FE, HG와 변 BC에 평행하다는 다른 표시가 있다. AD = ${cm(ad)}, DF = ${cm(df)}`),
        explain: `△AFG에서 ${par('DE', 'FG')}이므로 ${SG('AE')} : ${SG('EG')} = ${SG('AD')} : ${SG('DF')} = ${simple(ad, df)}이다. △AHG에서 ${par('FE', 'HG')}이므로 ${SG('AF')} : ${SG('FH')} = ${SG('AE')} : ${SG('EG')} = ${p} : ${q}이고, ${SG('AF')} = ${ad} + ${df} = ${af}(cm)이므로 ${SG('FH')} = ${fh} cm이다. △AHC에서 ${par('FG', 'HC')}이므로 ${SG('AG')} : ${SG('GC')} = ${SG('AF')} : ${SG('FH')} = ${p} : ${q}이다. △ABC에서 ${par('HG', 'BC')}이므로 ${SG('AH')} : ${SG('HB')} = ${SG('AG')} : ${SG('GC')} = ${p} : ${q}이고, ${SG('AH')} = ${af} + ${fh} = ${ah}(cm)이므로 ${SG('HB')} = ${hb} cm이다.`,
        facts: { calc: [[`(${ad}+${df})*${df}/${ad}`, 0], [`(${ad}+${df}+(${ad}+${df})*${df}/${ad})*${df}/${ad}`, 1]] }
      });
    }),
    H('hard-cevians', '두 변 위의 점과 맞은편 꼭짓점을 이은 두 선분의 교점', '심10', (d) => {
      // AD : DB = m : n, AE : EC = r : s 이면 BP : PE = n(r + s) : ms. 점 D 를 지나고 BE 에 평행한 보조선을 스스로 그어야 한다.
      const v = d.until(() => {
        const [m, n] = d.pick([[2, 3], [1, 1], [1, 2], [2, 1], [3, 2], [3, 4], [1, 3]]), [r, s] = d.pick([[4, 3], [1, 1], [2, 1], [1, 2], [3, 2], [2, 3], [3, 1], [3, 4]]), u = d.int(1, 5), w = d.int(1, 5);
        const ad = m * u, db = n * u, ae = r * w, ec = s * w, ab = ad + db, ac = ae + ec, fe = ae * db / ab, t3 = sas(ab, ac, d.int(10, 15) * 5), P0 = Object.assign({}, t3, { D: lerp(t3.A, t3.B, ad / ab), E: lerp(t3.A, t3.C, ae / ac) }); P0.P = meet(P0.B, P0.E, P0.C, P0.D);
        const fig = Fig(P0, [184, 150], { hub: 'ABC' }).poly('ABC').seg('BE CD').name('ABCDE').free('P', 'BECD').len('AD', cm(ad)).len('DB', cm(db)).len('AE', cm(ae)).len('EC', cm(ec));
        return { m, n, r, s, ad, db, ae, ec, ab, ac, fe, t3, fig };
      }, (x) => !(x.m === x.n && x.r === x.s) && Number.isInteger(x.fe) && x.ab <= 20 && x.ac <= 20 && Math.max(x.ab / x.ac, x.ac / x.ab) <= 1.5 && Math.min(x.ad, x.db, x.ae, x.ec) >= 2 && x.ad * x.ec / (x.ad * x.ec + x.db * (x.ae + x.ec)) >= 0.2 && fine(x.t3, 44, 88) && !x.fig.clash());
      const { ad, db, ae, ec, ab, fe } = v, big = db * (ae + ec), small = ad * ec, g = gcd(big, small), bp = big / g, pe = small / g, cf = ec + fe;
      return ratio2(`△ABC에서 점 D는 변 AB 위의 점, 점 E는 변 AC 위의 점이고, ${jo('BE', '과/와')} ${SG('CD')}가 만나는 점을 P라 하자. ${eq('AD', ad)}, ${eq('DB', db)}, ${eq('AE', ae)}, ${eq('EC', ec)}일 때, ${nb(`${SG('BP')} : ${SG('PE')}`)}를 ${RATIO}`, bp, pe, {
        figure: v.fig.svg(`삼각형 ABC. 점 D는 변 AB 위에, 점 E는 변 AC 위에 있고, 선분 BE와 선분 CD가 점 P에서 만난다. AD = ${cm(ad)}, DB = ${cm(db)}, AE = ${cm(ae)}, EC = ${cm(ec)}`),
        explain: `점 D를 지나고 ${SG('BE')}에 평행한 직선이 변 AC와 만나는 점을 F라 하자. △ABE에서 ${par('DF', 'BE')}이므로 ${SG('DF')} : ${SG('BE')} = ${SG('AD')} : ${SG('AB')} = ${simple(ad, ab)}이고, ${SG('AF')} : ${SG('FE')} = ${SG('AD')} : ${SG('DB')} = ${simple(ad, db)}이므로 ${SG('FE')} = ${ae} × ${fracOrInt(db, ab)} = ${fe}(cm)이다. △CDF에서 ${par('PE', 'DF')}이므로 ${SG('PE')} : ${SG('DF')} = ${SG('CE')} : ${SG('CF')} = ${simple(ec, cf)}이다. ${SG('PE')} = ${fracOrInt(ec, cf)}${SG('DF')} = ${fracOrInt(ec, cf)} × ${fracOrInt(ad, ab)}${SG('BE')} = ${fracOrInt(pe, bp + pe)}${SG('BE')}이므로 ${SG('BP')} : ${SG('PE')} = ${bp} : ${pe}이다.`,
        facts: { calc: [[`${db}*(${ae}+${ec})/${g}`, 0], [`${ad}*${ec}/${g}`, 1]], unseen: [g] }
      });
    }),
    H('hard-para-cuts', '평행사변형의 두 변 위의 점을 이은 선분이 잘린 길이', '심12', (d) => {
      // AE = EF = FD, BG : GC = g1 : g2. EH : HG = EF : BG, EI : IG = ED : BG. HI = EH × 3·g1 ÷ (2(g1 + g2) + 3·g1)
      const v = d.until(() => {
        const [g1, g2, eh0, hi0] = d.pick([[3, 1, 17, 9], [1, 1, 7, 3], [2, 1, 2, 1], [1, 2, 3, 1], [3, 2, 19, 9], [1, 3, 11, 3], [2, 3, 8, 3]]), t = d.int(Math.ceil(4 / eh0), Math.max(1, Math.floor(24 / eh0))), eh = eh0 * t, hi = hi0 * t, x = g1 + g2;
        const P0 = paraOf(13, d.pick([9, 9.6, 10.2]), d.int(13, 16) * 5);
        Object.assign(P0, { E: lerp(P0.A, P0.D, 1 / 3), F: lerp(P0.A, P0.D, 2 / 3), G: lerp(P0.B, P0.C, g1 / x) }); P0.H = meet(P0.E, P0.G, P0.B, P0.F); P0.I = meet(P0.E, P0.G, P0.B, P0.D);
        const fig = Fig(P0, [220, 150], { hub: 'ABCD' }).poly('ABCD').seg('BF EG BD').tick('AE EF FD').name('ABCD').name('EF', 90).name('G', 270).free('H', 'EGBF').free('I', 'EGBD').len('EH', cm(eh), 'F');
        return { g1, g2, eh0, hi0, eh, hi, x, fig };
      }, (z) => !z.fig.clash());
      const { g1, g2, eh0, hi0, eh, hi, x } = v, r1 = gcd(x, 3 * g1), r2 = gcd(2 * x, 3 * g1), h1 = [x / r1, 3 * g1 / r1], i1 = [2 * x / r2, 3 * g1 / r2];
      return lenQ(`평행사변형 ABCD에서 변 AD 위에 점 A에서 가까운 쪽부터 두 점 E, F가 있어 ${nb(`${SG('AE')} = ${SG('EF')} = ${SG('FD')}`)}이고, 변 BC 위의 점 G에 대하여 ${nb(`${SG('BG')} : ${SG('GC')} = ${g1} : ${g2}`)}이다. ${SG('EG')}가 ${SG('BF')}, ${SG('BD')}와 만나는 점을 각각 H, I라 하자. ${eq('EH', eh)}일 때, ${SG('HI')}의 길이는?`, hi, {
        figure: v.fig.svg(`평행사변형 ABCD. 변 AD 위에 점 A에서 가까운 쪽부터 점 E, F가 있고 선분 AE, EF, FD에 길이가 같다는 표시가 있다. 점 G는 변 BC 위에 있다. 선분 EG가 선분 BF와 점 H에서, 대각선 BD와 점 I에서 만나고, 선분 EG 위에 점 E, H, I, G가 이 차례로 놓여 있다. EH = ${cm(eh)}`),
        explain: `${SG('AD')} = ${SG('BC')} = ${ka(3 * x)}라 하면 ${SG('EF')} = ${ka(x)}, ${SG('ED')} = ${ka(2 * x)}, ${SG('BG')} = ${ka(3 * g1)}이다. ${par('EF', 'BG')}이므로 ${SG('EH')} : ${SG('HG')} = ${SG('EF')} : ${SG('BG')} = ${h1[0]} : ${h1[1]}이고 ${SG('EH')} = ${frac(h1[0], h1[0] + h1[1])}${SG('EG')}이다. ${par('ED', 'BG')}이므로 ${SG('EI')} : ${SG('IG')} = ${SG('ED')} : ${SG('BG')} = ${i1[0]} : ${i1[1]}이고 ${SG('EI')} = ${frac(i1[0], i1[0] + i1[1])}${SG('EG')}이다. ${SG('HI')} = ${SG('EI')} − ${SG('EH')}이므로 ${SG('EH')} : ${SG('HI')} = ${frac(h1[0], h1[0] + h1[1])} : (${frac(i1[0], i1[0] + i1[1])} − ${frac(h1[0], h1[0] + h1[1])}) = ${eh0} : ${hi0}이다. ${SG('HI')} = ${eh} × ${frac(hi0, eh0)} = ${hi}(cm)이다.`,
        facts: { calc: [[`${eh}*3*${g1}/(2*(${g1}+${g2})+3*${g1})`, 0]], unseen: [3, 2] }
      });
    }),
    H('hard-bisector', '삼각형의 내각과 외각의 이등분선이 밑변과 만나는 점', '심13', (d) => {
      // AB : AC = BD : DC = BE : CE. 문제 글에서 이 성질을 알려 주지 않는다(평행한 보조선을 그어 이등변삼각형을 만들면 이 단원의 내용으로 풀린다).
      const v = d.until(() => {
        const [c, b, bd, cd, ce] = d.pick(BIS), a = bd + cd, t3 = sss(a, b, c), P0 = Object.assign({}, t3, { D: [bd, 0], E: [a + ce, 0], T: lerp(t3.B, t3.A, 1 + 0.32 * Math.min(1, (a + ce) / (2 * c))) });
        const fig = Fig(P0, [250, 150], { hub: 'ABC' }).poly('ABC').seg('AD AE CE').seg('AT', 'thin').name('B', 180).name('DCE', 270).free('A', 'BDCET').len('AB', cm(c)).len('AC', cm(b), 'B', { t: 0.6 }).len('BD', cm(bd), 'A');
        mark(fig, 'A', 'B', 'D', 'dot', 30); mark(fig, 'A', 'D', 'C', 'dot', 30); mark(fig, 'A', 'C', 'E', 'x', 22); mark(fig, 'A', 'E', 'T', 'x', 22);
        return { c, b, bd, cd, ce, a, t3, fig };
      }, (x) => fine(x.t3, 24, 110) && K.angAt(x.t3.A, x.t3.B, x.t3.C) >= 40 && !x.fig.clash());
      const { c, b, bd, cd, ce, a } = v, g = gcd(c, b);
      return lenQ(`△ABC에서 ∠A의 이등분선이 변 BC와 만나는 점을 D, ∠A의 외각의 이등분선이 변 BC의 연장선과 만나는 점을 E라 하자. ${eq('AB', c)}, ${eq('AC', b)}, ${eq('BD', bd)}일 때, ${SG('CE')}의 길이는?`, ce, {
        figure: v.fig.svg(`삼각형 ABC. 변 BA를 점 A 너머로 늘인 선과 변 BC를 점 C 너머로 늘인 선이 그어져 있다. 점 D는 변 BC 위에 있고, 각 BAD와 각 DAC에 크기가 같다는 표시가 있다. 점 E는 변 BC를 점 C 너머로 늘인 선 위에 있고, 각 CAE와, 선분 AE와 변 BA를 늘인 선이 이루는 각에 크기가 같다는 다른 표시가 있다. AB = ${cm(c)}, AC = ${cm(b)}, BD = ${cm(bd)}`),
        explain: `점 C를 지나고 ${SG('AD')}에 평행한 직선이 ${SG('BA')}의 연장선과 만나는 점을 F라 하면 ∠AFC = ∠BAD(동위각), ∠ACF = ∠DAC(엇각)이므로 △ACF는 ${nb(`${SG('AF')} = ${SG('AC')}`)}인 이등변삼각형이다. △BFC에서 ${par('AD', 'FC')}이므로 ${SG('BD')} : ${SG('DC')} = ${SG('BA')} : ${SG('AF')} = ${simple(c, b)}이고 ${SG('DC')} = ${cd} cm, ${SG('BC')} = ${bd} + ${cd} = ${a}(cm)이다. 또 점 C를 지나고 ${SG('AE')}에 평행한 직선이 변 AB와 만나는 점을 P라 하면 같은 방법으로 ${nb(`${SG('AP')} = ${SG('AC')}`)}이고, △BEA에서 ${par('PC', 'AE')}이므로 ${SG('BE')} : ${SG('CE')} = ${SG('BA')} : ${SG('PA')} = ${c / g} : ${b / g}이다. (${a} + ${SG('CE')}) : ${SG('CE')} = ${c / g} : ${b / g}에서 ${SG('CE')} = ${ce} cm이다.`,
        facts: { calc: [[`(${bd}+${bd}*${b}/${c})*${b}/(${c}-${b})`, 0]] }
      });
    }),
    H('hard-two-right', '한 직선 위에 선 두 직각삼각형의 빗변의 교점', '심20', (d) => {
      // EC = DC 이므로 EG = FG. (EC − FG) : BC = FG : AB 에서 FG = AB × EC ÷ (AB + BE + EC)
      const v = d.until(() => {
        const [a, e, c, x] = d.pick([[6, 2, 8, 3], [4, 2, 6, 2], [6, 3, 9, 3], [8, 4, 12, 4], [4, 4, 8, 2], [6, 6, 12, 3], [10, 2, 8, 4], [9, 3, 6, 3], [8, 2, 6, 3], [12, 4, 8, 4], [6, 4, 10, 3], [10, 5, 15, 5], [5, 3, 12, 3], [15, 3, 12, 6], [10, 4, 6, 3], [12, 2, 10, 5], [12, 6, 6, 3], [9, 6, 12, 4]]);
        const P0 = { A: [0, a], B: [0, 0], E: [e, 0], C: [e + c, 0], D: [e + c, c] }; P0.F = meet(P0.A, P0.C, P0.E, P0.D); P0.G = [P0.F[0], 0];
        const fig = Fig(P0, [200, 136]).seg('AB BC CD AC ED FG').right('ABC').right('DCB').right('FGC').name('A', 90).name('D', 90).name('BEGC', 270).free('F', 'ACEDG').len('AB', cm(a), 'C').len('DC', cm(c), 'B');
        fig.b.dim(fig.P.B, fig.P.E, cm(e), fig.P.A, 26).dim(fig.P.E, fig.P.C, cm(c), fig.P.A, 26);
        return { a, e, c, x, fig };
      }, (z) => !z.fig.clash());
      const { a, e, c, x } = v;
      return lenQ(`그림과 같이 ∠B = 90°인 직각삼각형 ABC와 ∠C = 90°인 직각삼각형 DEC가 있고, 점 E는 변 BC 위의 점이다. ${jo('AC', '과/와')} ${SG('DE')}가 만나는 점을 F, 점 F에서 변 BC에 내린 수선의 발을 G라 하자. ${eq('AB', a)}, ${eq('DC', c)}, ${eq('BE', e)}, ${eq('EC', c)}일 때, ${SG('FG')}의 길이는?`, x, {
        figure: v.fig.svg(`가로로 놓인 선분 BC 위에 점 B에서 가까운 쪽부터 점 E, G가 있다. 점 B에서 위로 선분 AB가, 점 C에서 위로 선분 DC가 서 있고(직각 표시) 선분 AC와 선분 DE가 점 F에서 만난다. 점 F에서 점 G까지 선분 FG가 선분 BC에 수직으로 그어져 있다(직각 표시). AB = ${cm(a)}, DC = ${cm(c)}, BE = ${cm(e)}, EC = ${cm(c)}`),
        explain: `${SG('AB')}, ${SG('FG')}, ${SG('DC')}는 모두 ${SG('BC')}에 수직이므로 서로 평행하다. △DEC에서 ${par('FG', 'DC')}이므로 ${SG('EG')} : ${SG('EC')} = ${SG('FG')} : ${SG('DC')}이고, ${SG('EC')} = ${SG('DC')} = ${c} cm이므로 ${nb(`${SG('EG')} = ${SG('FG')}`)}이다. ${SG('FG')} = ${X} cm라 하면 ${SG('GC')} = (${c} − ${X}) cm이고 ${SG('BC')} = ${e} + ${c} = ${e + c}(cm)이다. △ABC에서 ${par('FG', 'AB')}이므로 ${SG('CG')} : ${SG('CB')} = ${SG('FG')} : ${SG('AB')}, 곧 (${c} − ${X}) : ${e + c} = ${X} : ${a}이다. ${a}(${c} − ${X}) = ${e + c}${X}에서 ${X} = ${x}이다.`,
        facts: { calc: [[`${a}*${c}/(${a}+${e}+${c})`, 0]] }
      });
    }),
    H('hard-bisect-perp', '각의 이등분선에 내린 수선과 밑변의 중점', '심28', (d) => {
      // △ABE ≡ △AFE 이므로 AF = AB, BE = EF. EM ∥ FC, EM = (AC − AB) ÷ 2. DM : DC = EM : AC 에서 DM : MC = (AC − AB) : (AC + AB)
      const v = d.until(() => {
        const [c, b] = d.pick([[4, 8], [6, 10], [5, 10], [4, 10], [5, 9], [6, 12], [6, 9], [8, 12], [5, 11], [9, 15], [6, 14], [8, 14], [3, 7]]), t3 = sas(c, b, d.int(13, 18) * 5);
        const P0 = Object.assign({}, t3, { D: lerp(t3.B, t3.C, c / (b + c)), M: half(t3.B, t3.C), F: lerp(t3.A, t3.C, c / b) }); P0.E = half(P0.B, P0.F);
        const fig = Fig(P0, [214, 150], { hub: 'ABC' }).poly('ABC').seg('AD BF').right('AEB').tick('BM MC').name('ABC').name('DM', 270).nameAway('F', 'B').free('E', 'ADBF').len('AB', cm(c)).bow('AC', cm(b), 26);
        mark(fig, 'A', 'B', 'D', 'dot', 26); mark(fig, 'A', 'D', 'C', 'dot', 26);
        return { c, b, t3, fig };
      }, (x) => fine(x.t3, 26, 100) && !x.fig.clash());
      const { c, b } = v, fc = b - c, g = gcd(b - c, b + c), g2 = gcd(fc, 2 * b);
      return ratio2(`△ABC에서 ∠A의 이등분선이 변 BC와 만나는 점을 D, 변 BC의 중점을 M이라 하자. 점 B에서 ${SG('AD')}에 내린 수선의 발을 E라 하고, ${SG('BE')}의 연장선이 변 AC와 만나는 점을 F라 하자. ${eq('AB', c)}, ${eq('AC', b)}일 때, ${nb(`${SG('DM')} : ${SG('MC')}`)}를 ${RATIO}`, (b - c) / g, (b + c) / g, {
        figure: v.fig.svg(`삼각형 ABC. 점 D는 변 BC 위에 있고 각 BAD와 각 DAC에 크기가 같다는 표시가 있다. 점 M은 변 BC의 중점이다(길이가 같다는 표시). 점 B에서 그은 선분 BF가 선분 AD와 점 E에서 수직으로 만나고(직각 표시) 변 AC와 점 F에서 만난다. 변 BC 위에 점 B, D, M, C가 이 차례로 놓여 있다. AB = ${cm(c)}, AC = ${cm(b)}`),
        explain: `△ABE와 △AFE에서 ∠BAE = ∠FAE, ${SG('AE')}는 공통, ∠AEB = ∠AEF = 90°이므로 두 삼각형은 합동이다. ${SG('AF')} = ${SG('AB')} = ${c} cm, ${nb(`${SG('BE')} = ${SG('EF')}`)}이고 ${SG('FC')} = ${b} − ${c} = ${fc}(cm)이다. △BCF에서 두 점 E, M은 각각 ${SG('BF')}, ${SG('BC')}의 중점이므로 ${par('EM', 'FC')}이고 ${SG('EM')} = ${frac(1, 2)}${SG('FC')} = ${fracOrInt(fc, 2)}(cm)이다. △DCA에서 ${par('EM', 'AC')}이므로 ${SG('DM')} : ${SG('DC')} = ${SG('EM')} : ${SG('AC')} = ${fc / g2} : ${2 * b / g2}이다. 따라서 ${SG('DM')} : ${SG('MC')} = ${fc / g2} : (${2 * b / g2} − ${fc / g2}) = ${(b - c) / g} : ${(b + c) / g}이다.`,
        facts: { calc: [[`(${b}-${c})/${g}`, 0], [`(${b}+${c})/${g}`, 1]], unseen: [g] }
      });
    }),
    H('hard-trap-three-mid', '사다리꼴의 두 밑변과 대각선의 중점이 만든 삼각형의 넓이', '심31', (d) => {
      // 점 E 는 BD 의 중점이라 두 밑변까지의 거리가 높이의 반이다. △GEF = □ABFG − (△ABD − △GED) − △EBF = h(b − a) ÷ 8
      const [a, b, h] = d.pick([[8, 12, 6], [8, 12, 8], [6, 10, 8], [6, 14, 8], [10, 14, 8], [8, 16, 8], [12, 16, 8], [10, 18, 8]]), area = h * (b - a) / 8;
      const v = d.until(() => {
        const P0 = trapOf(a, b, h, (b - a) * d.pick([0.2, 0.3, 0.4])); Object.assign(P0, { G: half(P0.A, P0.D), F: half(P0.B, P0.C), E: half(P0.B, P0.D) });
        const fig = Fig(P0, [190, 132], { hub: 'ABCD' }).tint('GEF').poly('ABCD').seg('BD GE EF GF').arrow('AD', 1, 0.39).arrow('BC', 1, 0.12).tick('AG GD').tick('BF FC', 2).tick('BE ED', 3).name('AB').name('DG', 90).name('CF', 270).free('E', 'BDGF');
        fig.b.dim(fig.P.A, fig.P.D, cm(a), fig.P.B, 26).dim(fig.P.B, fig.P.C, cm(b), fig.P.A, 26);
        const top = fig.P.D[1], low = fig.P.C[1], at = fig.P.C[0] + 14;
        fig.b.seg(fig.P.D, [at + 5, top], 'cut').seg(fig.P.C, [at + 5, low], 'cut').dim([at, top], [at, low], cm(h), [at - 30, (top + low) / 2], 0);
        return { fig };
      }, (z) => !z.fig.clash());
      const s1 = (a / 2 + b / 2) * h / 2, s2 = a * h / 2, s3 = a * h / 8, s4 = b * h / 8;
      return areaQ(`${par('AD', 'BC')}인 사다리꼴 ABCD에서 ${eq('AD', a)}, ${eq('BC', b)}이고 높이는 ${h} cm이다. ${SG('AD')}, ${SG('BC')}, ${SG('BD')}의 중점을 각각 G, F, E라 할 때, △GEF의 넓이는?`, area, {
        figure: v.fig.svg(`사다리꼴 ABCD와 대각선 BD. 윗변 AD와 아랫변 BC에 평행하다는 표시가 있다. 점 G는 변 AD의 중점, 점 F는 변 BC의 중점, 점 E는 대각선 BD의 중점이다(길이가 같다는 표시). 선분 GE, EF, GF가 그어져 있고 삼각형 GEF가 색칠되어 있다. AD = ${cm(a)}, BC = ${cm(b)}, 두 밑변 사이의 거리(높이)는 ${cm(h)}`),
        explain: `점 E는 ${SG('BD')}의 중점이므로 점 E에서 두 밑변 AD, BC까지의 거리는 각각 높이의 ${frac(1, 2)}인 ${h / 2} cm이다. □ABFG의 넓이는 ${frac(1, 2)} × (${a / 2} + ${b / 2}) × ${h} = ${s1}(${SQ})이다. △ABD의 넓이는 ${frac(1, 2)} × ${a} × ${h} = ${s2}(${SQ}), △GED의 넓이는 ${frac(1, 2)} × ${a / 2} × ${h / 2} = ${s3}(${SQ})이므로 □ABEG의 넓이는 ${s2} − ${s3} = ${s2 - s3}(${SQ})이다. △EBF의 넓이는 ${frac(1, 2)} × ${b / 2} × ${h / 2} = ${s4}(${SQ})이다. △GEF의 넓이는 ${s1} − ${s2 - s3} − ${s4} = ${area}(${SQ})이다.`,
        facts: { calc: [[`${h}*(${b}-${a})/8`, 0]], unseen: [8] }
      });
    }),
    H('hard-para-mids', '평행사변형의 세 변의 중점을 이은 선분이 잘라 낸 길이의 비', '심32', (d) => {
      // 점 E 는 QD 의 중점, ER = QC ÷ 2, PE = 3QC ÷ 2. EF : FQ = PE : QC = 3 : 2 이므로 EF = QD × (1/2) × (3/5)
      const v = d.until(() => {
        const P0 = paraOf(d.pick([12, 13, 14]), d.pick([8, 9, 10]), d.int(12, 15) * 5);
        Object.assign(P0, { P: half(P0.A, P0.B), Q: half(P0.B, P0.C), R: half(P0.C, P0.D) }); P0.E = half(P0.Q, P0.D); P0.F = lerp(P0.E, P0.Q, 3 / 5);
        const fig = Fig(P0, [214, 140], { hub: 'ABCD' }).poly('ABCD').seg('PR QD PC').arrow('AD BC', 1, 0.3).arrow('PR', 1, 0.14).tick('AP PB CR RD').tick('BQ QC', 2).name('ABCDPQR').free('E', 'PRQD').free('F', 'QDPC');
        return { fig };
      }, (z) => !z.fig.clash());
      return ratio2(`평행사변형 ABCD에서 세 변 AB, BC, CD의 중점을 각각 P, Q, R라 하면 ${par('AD', 'PR', 'BC')}이다. ${SG('QD')}가 ${SG('PR')}, ${SG('PC')}와 만나는 점을 각각 E, F라 할 때, ${nb(`${SG('QD')} : ${SG('EF')}`)}를 ${RATIO}`, 10, 3, {
        figure: v.fig.svg('평행사변형 ABCD. 점 P, Q, R는 각각 변 AB, BC, CD의 중점이다(길이가 같다는 표시). 선분 PR, 선분 QD, 선분 PC가 그어져 있고, 변 AD, 선분 PR, 변 BC에 평행하다는 표시가 있다. 선분 QD는 선분 PR와 점 E에서, 선분 PC와 점 F에서 만나고, 선분 QD 위에 점 Q, F, E, D가 이 차례로 놓여 있다'),
        explain: `△DQC에서 점 R는 ${SG('DC')}의 중점이고 ${par('ER', 'QC')}이므로 점 E는 ${SG('DQ')}의 중점이고 ${SG('ER')} = ${frac(1, 2)}${SG('QC')}이다. ${SG('PR')} = ${SG('BC')} = 2${SG('QC')}이므로 ${SG('PE')} = ${SG('PR')} − ${SG('ER')} = ${frac(3, 2)}${SG('QC')}이다. ${par('PE', 'QC')}이므로 ${SG('EF')} : ${SG('FQ')} = ${SG('PE')} : ${SG('QC')} = 3 : 2이다. ${SG('EF')} = ${frac(3, 5)}${SG('EQ')} = ${frac(3, 5)} × ${frac(1, 2)}${SG('QD')} = ${frac(3, 10)}${SG('QD')}이므로 ${SG('QD')} : ${SG('EF')} = 10 : 3이다.`,
        facts: { calc: [['2*5', 0], ['3', 1]], unseen: [2, 5, 3] }
      });
    }),
    H('hard-cent-incenter', '무게중심과 내심을 함께 지나는 평행선', '심35', (d) => {
      // 무게중심과 내심을 지나는 직선이 BC 에 평행한 것은 AB + AC = 2BC 일 때다(그림은 그 삼각형으로 그린다). DB = AB ÷ 3, EC = AC ÷ 3, DI = DB, IE = EC
      const v = d.until(() => {
        const [c, b] = d.pick([[18, 12], [12, 18], [15, 9], [9, 15], [21, 15], [15, 21], [24, 18], [18, 24], [15, 12], [12, 15], [12, 6], [6, 12]]), t3 = sss((b + c) / 2, b, c);
        const P0 = Object.assign({}, t3, { D: lerp(t3.A, t3.B, 2 / 3), E: lerp(t3.A, t3.C, 2 / 3), G: cen(t3), I: incOf(t3) });
        const fig = Fig(P0, [196, 160], { hub: 'ABC' }).poly('ABC').seg('DE').dot('GI').arrow('DE BC', 1, 0.1).name('ABC');
        fig.name('D', dirOf(fig.P.B, fig.P.A) + 90).name('E', dirOf(fig.P.C, fig.P.A) - 90).name('G', 90, 12).name('I', 270, 12).bow('AB', cm(c), 26).bow('AC', cm(b), 26);
        return { c, b, t3, fig };
      }, (x) => fine(x.t3, 34, 100) && !x.fig.clash());
      const { c, b } = v;
      return lenQ(`△ABC에서 점 G는 무게중심, 점 I는 내심이다. 두 점 G, I를 지나는 직선이 변 BC에 평행하고, 이 직선이 두 변 AB, AC와 만나는 점을 각각 D, E라 하자. ${eq('AB', c)}, ${eq('AC', b)}일 때, ${SG('DE')}의 길이는?`, (b + c) / 3, {
        figure: v.fig.svg(`삼각형 ABC. 삼각형의 내부에 두 점 G, I가 있고, 두 점을 지나는 선분 DE가 변 AB와 점 D에서, 변 AC와 점 E에서 만난다. 선분 DE와 변 BC에 평행하다는 표시가 있다. AB = ${cm(c)}, AC = ${cm(b)}`),
        explain: `${SG('AG')}의 연장선이 변 BC와 만나는 점을 M이라 하면 ${SG('AM')}은 중선이고 ${SG('AG')} : ${SG('GM')} = 2 : 1이다. ${par('DE', 'BC')}이므로 ${SG('AD')} : ${SG('DB')} = ${SG('AE')} : ${SG('EC')} = 2 : 1이고 ${SG('DB')} = ${c} × ${frac(1, 3)} = ${c / 3}(cm), ${SG('EC')} = ${b} × ${frac(1, 3)} = ${b / 3}(cm)이다. 점 I는 내심이므로 ∠DBI = ∠IBC이고, ${par('DE', 'BC')}이므로 ∠IBC = ∠DIB(엇각)이다. △DBI는 ${nb(`${SG('DI')} = ${SG('DB')}`)}인 이등변삼각형이고, 같은 방법으로 ${nb(`${SG('IE')} = ${SG('EC')}`)}이다. ${SG('DE')} = ${c / 3} + ${b / 3} = ${(b + c) / 3}(cm)이다.`,
        facts: { calc: [[`${c}/3+${b}/3`, 0]], unseen: [3] }
      });
    }),
    H('hard-roll', '굴러가는 정삼각형의 무게중심이 움직인 거리', '심39', (d) => {
      // 한 번 굴릴 때 무게중심은 반지름이 (중선의 2/3), 중심각이 120°인 호를 그린다. 세 번 굴리면 처음과 같은 자세가 된다.
      const k = d.int(1, 6), m = 3 * k, h = Math.sqrt(3) / 2, y = h / 3;
      const P0 = { L: [-0.34, 0], Z: [4.4, 0], B: [0, 0], C: [1, 0], A: [0.5, h], G: [0.5, y], J: [1.5, h], U: [1.5, y], K: [2, 0], M: [2.5, h], V: [2.5, y], N: [3, 0], R: [3.5, h], W: [3.5, y], S: [4, 0] };
      const fig = Fig(P0, [256, 64], { show: { J: 'B', K: 'A', M: 'C', N: 'B', R: 'A', S: 'C' } }).seg('LZ').poly('ABC').seg('CJ JK KM MN', 'cut').poly('NRS').dot('GUVW').name('AJMR', 90).name('BCKNS', 270).name('G', 90, 11);
      fig.b.text([fig.P.Z[0] + 9, fig.P.Z[1]], sv('l'), { plain: true });
      return piLen(`중선의 길이가 ${m} cm인 정삼각형 ABC의 무게중심을 G라 하자. 그림과 같이 △ABC를 직선 ${LV('l')} 위에서 미끄러지지 않게 오른쪽으로 굴려, 변 BC가 다시 직선 ${LV('l')} 위에 놓일 때까지 이동시켰다. 이때 점 G가 움직인 거리는?`, 4 * k, {
        figure: fig.svg('직선 l 위에 정삼각형 ABC가 변 BC를 직선에 붙이고 놓여 있고, 삼각형의 내부에 점 G가 있다. 그 오른쪽으로 삼각형을 한 번, 두 번 굴린 모양이 점선으로, 세 번 굴린 모양이 실선으로 그려져 있다. 한 번 굴린 삼각형은 변 CA가, 두 번 굴린 삼각형은 변 AB가, 세 번 굴린 삼각형은 다시 변 BC가 직선에 붙어 있다. 삼각형마다 무게중심의 자리에 점이 찍혀 있다'),
        explain: `삼각형이 직선 위의 한 꼭짓점을 중심으로 돌 때, 점 G는 그 꼭짓점이 중심이고 반지름이 꼭짓점에서 점 G까지의 거리인 호를 그린다. 정삼각형의 세 중선의 길이는 같으므로 꼭짓점에서 점 G까지의 거리는 ${m} × ${frac(2, 3)} = ${2 * k}(cm)이다. 한 번 굴릴 때 도는 각의 크기는 정삼각형의 한 외각의 크기인 120°이므로 호 하나의 길이는 2π × ${2 * k} × ${frac(120, 360)} = ${fracOrInt(4 * k, 3)}π(cm)이다. 변 BC가 다시 직선 위에 놓일 때까지 세 번 굴리므로 점 G가 움직인 거리는 ${fracOrInt(4 * k, 3)}π × 3 = ${4 * k}π(cm)이다.`,
        facts: { calc: [[`2*${m}*2*120*3/3/360`, 0]], unseen: [2, 120, 3, 360] }
      });
    }),
    H('hard-para-three', '평행사변형의 두 변의 중점과 대각선이 나눈 사각형의 넓이', '심45', (d) => {
      const k = d.int(1, 5), S = 24 * k;
      const v = d.until(() => {
        const P0 = anyPara(d); Object.assign(P0, { M: half(P0.B, P0.C), N: half(P0.C, P0.D), E: lerp(P0.B, P0.D, 1 / 3), F: lerp(P0.B, P0.D, 2 / 3) });
        const fig = Fig(P0, [196, 130], { hub: 'ABCD' }).tint('EMNF').poly('ABCD').seg('BD AM AN MN').tick('BM MC').tick('CN ND', 2).name('ABCDMN').free('E', 'BDAM').free('F', 'BDAN');
        return { fig };
      }, (x) => !x.fig.clash());
      return areaQ(`${PARA_LEAD} ${SG('AM')}, ${jo('AN', '과/와')} 만나는 점을 각각 E, F라 하자. □ABCD의 넓이가 ${S} ${SQ}일 때, □EMNF의 넓이는?`, 5 * k, {
        figure: v.fig.svg('평행사변형 ABCD. 점 M은 변 BC의 중점, 점 N은 변 CD의 중점이다(길이가 같다는 표시). 대각선 BD가 그어져 있고, 선분 AM은 대각선 BD와 점 E에서, 선분 AN은 대각선 BD와 점 F에서 만난다. 선분 MN이 그어져 있고 사각형 EMNF가 색칠되어 있다'),
        explain: `대각선 AC를 그으면 점 E는 △ABC의 무게중심, 점 F는 △ACD의 무게중심이므로 ${nb(`${SG('BE')} = ${SG('EF')} = ${SG('FD')}`)}이고, △AEF의 넓이는 △ABD의 넓이의 ${frac(1, 3)}인 ${S} × ${frac(1, 2)} × ${frac(1, 3)} = ${4 * k}(${SQ})이다. △ABM과 △AND의 넓이는 각각 ${S} × ${frac(1, 4)} = ${6 * k}(${SQ})이고, △MCN의 넓이는 △BCD의 넓이의 ${frac(1, 4)}인 ${S} × ${frac(1, 2)} × ${frac(1, 4)} = ${3 * k}(${SQ})이다. △AMN의 넓이는 ${S} − ${6 * k} − ${6 * k} − ${3 * k} = ${9 * k}(${SQ})이므로 □EMNF의 넓이는 ${9 * k} − ${4 * k} = ${5 * k}(${SQ})이다.`,
        facts: { calc: [[`${S}*5/24`, 0]], unseen: [5, 24] }
      });
    })
  ]);

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
