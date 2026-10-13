// 중학교 1학년 2학기 2단원 작도와 합동 — 실력 문항.
// 단원 틀과 그림 도구, 싣는 기준, 뺀 것과 까닭은 7-2-2a.js 에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 ①의 장치는 이 잘못을 가진 아이가 걸리게 만들었다)
//  - 변 둘과 각 하나, 변 하나와 각 둘이 적혀 있으면 자리를 보지 않고 「두 변과 끼인각」「한 변과 양 끝 각」이라 여긴다.
//    각이 두 변 사이에 끼어 있는지, 변이 두 각 사이에 놓였는지를 보지 않는다(끼인각이 아닌 각이면 삼각형이 두 가지 그려진다).
//  - 거꾸로, 한 변과 두 각이 주어졌는데 한 각이 그 변의 대각이면 「양 끝 각이 아니다」라며 버린다(나머지 한 각을 구하면 양 끝 각이 된다).
//    그 변이 어느 두 각 사이에 놓이는지 정해 주지 않으면 삼각형이 여러 가지라는 것은 놓친다.
//  - 세 변의 길이가 적혀 있으면 삼각형이 된다고 여긴다(두 변의 길이의 합이 가장 긴 변의 길이와 같으면 삼각형이 아니다). 두 각의 크기의 합이 180°인 것도 놓친다.
//  - 세 각의 크기가 각각 같으면 합동이라고 여긴다(모양만 같다).
//  - 합동 기호를 글자 차례(A–D, B–E, C–F)대로 읽는다. 기호는 대응하는 꼭짓점의 차례로 쓴 것이다.
//  - 합동임을 알고 난 뒤에 얻는 것(나머지 대응변의 길이, 대응각의 크기)을 합동임을 설명하는 데에 쓴다.
//  - 겹친 도형에서 공통인 각, 60°나 90°에 같은 각을 더하거나 뺀 각, 맞꼭지각처럼 그림에 적혀 있지 않은 「같은 각」을 찾지 못한다.
//
// 실력에는 ① 수치나 그림의 놓임에 함정이 있어 배운 뜻을 정확히 대야 풀리는 문제와 ② 두 번 넘게 생각해야 풀리는 문제
// (겹친 정삼각형·정사각형에서 합동인 삼각형을 찾아 길이나 각 구하기, 나머지 각을 구한 다음 합동 조건 대기, 합동으로 잴 수 없는 거리나 넓이 구하기)만 실었다.
// 수집본 기본 문서에 나오고 기본에서 하는 일을 다시 묻는 꼴(도구의 쓰임, 세 변이 될 수 있는 길이, 더 필요한 조건 고르기, 항상 합동인 도형)은 기본 묶음에 실었다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { N, M, C } = B.kit;
  const { V, tagged } = B.kit.mid;
  const K = B.kit.m722;
  const { UNIT, STD3, STD4, SYM, sg, cm, jo, pickOne, allQ, RAD, dist, lerp, turn, meet, scaled, triASA, triSSS, Pic, gridFig, shape, N2, ang5, ssaNums, numCond, pairName, sasSpec, asaSpec, aasSpec, ssaSpec, laidOut, specPic, eqs, bowFig, equiPts, equiTwo } = K;
  // 실력 문항. 기본 자료에서만 나온 꼴은 ref 를 '기본 ②52' 처럼 적는다.
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: ref.startsWith('기본 ') ? '수집본 기본 자료(' + ref.slice(3) + ')' : '수집본 심화 자료(' + ref + ')', make }, more || {});
  const FIXES = ['SSS', 'SAS', 'ASA', 'AAS'];
  // 정사각형 ABCD(점 A 왼쪽 위, 점 D 오른쪽 위, 점 B 왼쪽 아래, 점 C 오른쪽 아래)
  const squarePts = (u) => ({ A: [0, u], D: [u, u], B: [0, 0], C: [u, 0] });
  const SQUARE = '정사각형 ABCD. 점 A는 왼쪽 위, 점 D는 오른쪽 위, 점 B는 왼쪽 아래, 점 C는 오른쪽 아래에 있다. ';

  B.addGroup(UNIT, {
    id: 'hard', title: '실력 문제', standard: STD4,
    types: [
      // ── ① 수치나 그림의 놓임에 함정이 있어 뜻을 정확히 대야 풀리는 문제 ──
      H('hard-fixed-count', '수치로 준 조건 가운데 삼각형이 하나로 정해지는 것의 개수', '심18 / 기본 ①29 ②25', (d) => {
        // 함정: 한 변과 두 각(한 각이 대각) → 「양 끝 각이 아니다」라며 빼는 아이. 두 변과 끼인각이 아닌 각 → 「두 변과 한 각」이라며 세는 아이.
        //  두 변의 길이의 합이 가장 긴 변의 길이와 같은 세 변 → 「세 변」이라며 세는 아이. 양 끝 각의 크기의 합이 180° → 「한 변과 양 끝 각」이라며 세는 아이.
        const kinds = d.shuffle(['AAS', 'SSA', 'SSSe'].concat(d.shuffle(['SAS', 'ASA', 'AAA', 'A180', 'SSS']).slice(0, 2))), rows = kinds.map((k) => numCond(d, k)), flags = rows.map((r) => FIXES.includes(r.kind)), k = flags.filter(Boolean).length;
        return N('다음 중 △ABC가 하나로 정해지는 것은 모두 몇 개인가?', k, {
          unit: '개', figure: tagged(rows.map((r) => r.html), SYM), explain: rows.map((r, i) => `${SYM[i]}: ${r.why}`).join(' ') + ` 따라서 하나로 정해지는 것은 ${k}개이다.`, facts: { count: flags }
        });
      }, { standard: STD3 }),
      H('hard-add-nums', '한 변의 길이와 한 각의 크기에 수치로 준 조건 하나 더하기', '심17 / 기본 ②26', (d) => {
        // 함정: ∠C 가 ∠A 와 합하여 180°가 되는 줄(삼각형이 안 된다), BC 가 끼인각이 아닌 꼴(두 가지 그려지는 수치), ∠C 가 대각이어도 나머지 각을 구하면 정해지는 줄
        const x = ssaNums(d), trap = d.bool(), angB = d.until(() => ang5(d, 30, 100), (v) => v + x.th <= 150), angC = trap ? 180 - x.th : d.until(() => ang5(d, 30, 100), (v) => v + x.th <= 150 && v !== angB), ca = d.until(() => d.int(5, 14), (v) => v !== x.a);
        const rows = d.shuffle([
          [`∠B = ${angB}°`, true, `${sg('AB')}의 양 끝 각의 크기를 알게 되므로 하나로 정해진다.`],
          [`∠C = ${angC}°`, !trap, trap ? `∠A + ∠C = 180°이므로 삼각형이 그려지지 않는다.` : `∠B = 180° − (${x.th}° + ${angC}°) = ${180 - x.th - angC}°를 구할 수 있으므로 하나로 정해진다.`],
          [`${sg('BC')} = ${cm(x.a)}`, false, `∠A는 ${sg('AB')}, ${sg('BC')}의 끼인각이 아니므로 하나로 정해지지 않는다.`],
          [`${sg('CA')} = ${cm(ca)}`, true, `∠A는 ${sg('AB')}, ${sg('CA')}의 끼인각이므로 하나로 정해진다.`]
        ]);
        return allQ(d, `${sg('AB')} = ${cm(x.c)}, ∠A = ${x.th}°일 때, 다음 중 조건 하나를 더하여 △ABC가 하나로 정해지는 것을 모두 고른 것은?`, SYM, rows.map((r) => r[1]), {
          figure: tagged(rows.map((r) => r[0]), SYM), explain: rows.map((r, i) => `${SYM[i]}: ${r[2]}`).join(' ')
        });
      }, { standard: STD3 }),
      H('hard-side-two-angles', '한 변의 길이와 두 각의 크기로 그릴 수 있는 삼각형의 가짓수', '심19', (d) => {
        // 함정: 「한 변과 두 각」이면 하나로 정해진다고 여기는 아이. 그 변이 어느 각의 대변인지 정해지지 않았으므로, 서로 다른 각의 수만큼 삼각형이 그려진다.
        const [a, b] = d.pick([[50, 60], [45, 55], [35, 80], [40, 40], [40, 100], [30, 75], [50, 80]]), g = 180 - a - b, c = d.int(4, 9), kinds = [...new Set([a, b, g])].sort((x, y) => x - y), k = kinds.length;
        return N(`한 변의 길이가 ${cm(c)}이고 두 각의 크기가 ${a}°, ${b}°인 삼각형은 모두 몇 가지 그릴 수 있는가? (단, 합동인 삼각형은 한 가지로 센다.)`, k, {
          unit: '가지', explain: `나머지 한 각의 크기는 180° − (${a}° + ${b}°) = ${g}°이다. 길이가 ${cm(c)}인 변의 대각의 크기가 ${kinds.map((v) => v + '°').join(', ')}인 경우에 따라 서로 다른 삼각형이 그려지므로 모두 ${k}가지이다. 변이 어느 두 각 사이에 놓이는지 정해지지 않았으므로 하나로 정해지지 않는다.`,
          facts: { calc: [[String(k), 0]], unseen: [k] }
        });
      }, { standard: STD3 }),
      H('hard-pick', '수치가 모두 같은 삼각형 가운데 합동인 것과 아닌 것', '심22 / 기본 ①43 ②36 ②37', (d, n) => {
        if (n === 0) {
          // 함정: 네 보기에 모두 같은 두 변의 길이와 한 각의 크기가 적혀 있다. 각이 두 변 사이에 끼어 있는 것은 하나뿐이다.
          //  나머지 셋은 그 각이 한 변의 대각이다(짧은 변의 대각이면 삼각형이 두 가지 그려지므로 둘 다 싣는다).
          const made = d.until(() => { const x = ssaNums(d); return { x, third: Math.sqrt(x.a * x.a + x.c * x.c - 2 * x.a * x.c * Math.cos(x.th * RAD)), wrong: [ssaSpec(x.c, x.a, x.th, true), ssaSpec(x.c, x.a, x.th, false), ssaSpec(x.a, x.c, x.th, true)] }; },
            (m) => m.x.a >= 4 && m.x.c <= 9 && m.wrong.every((w) => Math.abs(dist(w.t[0], w.t[2]) - m.third) > 0.6 && dist(w.t[0], w.t[2]) > 2.2));
          const { x } = made, specs = [sasSpec(x.a, x.c, x.th), sasSpec(x.a, x.c, x.th)].concat(made.wrong), order = d.shuffle([1, 2, 3, 4]), out = laidOut(d, specs), hit = order.indexOf(1);
          return C('두 변의 길이와 한 각의 크기가 적힌 다음 삼각형 ㉠~㉣ 가운데 맨 위의 삼각형과 합동인 것은?', SYM.slice(0, 4), hit, {
            figure: gridFig(order.map((i, k) => ({ tag: SYM[k], pic: specPic(out.placed[i]) })), '맨 위에 주어진 삼각형: ' + specs[0].said + '. ' + order.map((i, k) => `${SYM[k]}: ${specs[i].said}`).join('. ') + '.', { k: out.k, head: specPic(out.placed[0]) }),
            explain: `맨 위의 삼각형에서 ${x.th}°인 각은 길이가 ${cm(x.a)}, ${cm(x.c)}인 두 변의 끼인각이다. ${x.th}°인 각이 두 변 사이에 끼어 있는 것은 ${SYM[hit]}뿐이므로 ${jo(SYM[hit], '이/가')} 합동이다(SAS 합동). 나머지는 ${x.th}°인 각이 한 변의 대각이므로 두 변의 길이와 한 각의 크기가 같아도 합동이라고 할 수 없다.`,
            facts: { truth: order.map((i) => i === 1), want: true }
          });
        }
        const [a, b] = d.pick([[44, 66], [40, 65], [50, 58], [48, 62], [42, 68], [38, 64]]), g = 180 - a - b;
        if (n === 1) {
          // 함정: 주어진 삼각형에는 한 끝 각(a)과 대각(g)이 적혀 있다. 같은 두 수치(a, g)를 양 끝 각으로 가진 보기를 고르는 아이.
          //  나머지 한 각 b 를 구해야 양 끝 각이 a, b 임을 안다. 길이가 같은 변의 대각이 다른 세 삼각형은 합동이 아니다.
          const c = d.int(5, 8), specs = [aasSpec(c, a, g), asaSpec(c, a, b), asaSpec(c, a, g), asaSpec(c, b, g), aasSpec(c, g, a)], order = d.shuffle([1, 2, 3, 4]), out = laidOut(d, specs), hit = order.indexOf(1);
          return C('한 변의 길이와 두 각의 크기가 적힌 다음 삼각형 ㉠~㉣ 가운데 맨 위의 삼각형과 합동인 것은?', SYM.slice(0, 4), hit, {
            figure: gridFig(order.map((i, k) => ({ tag: SYM[k], pic: specPic(out.placed[i]) })), '맨 위에 주어진 삼각형: ' + specs[0].said + '. ' + order.map((i, k) => `${SYM[k]}: ${specs[i].said}`).join('. ') + '.', { k: out.k, head: specPic(out.placed[0]) }),
            explain: `맨 위의 삼각형에서 나머지 한 각의 크기는 180° − (${a}° + ${g}°) = ${b}°이므로 길이가 ${cm(c)}인 변의 양 끝 각의 크기는 ${a}°, ${b}°이다. 길이가 ${cm(c)}인 변의 양 끝 각의 크기가 ${a}°, ${b}°인 것은 ${SYM[hit]}뿐이다(ASA 합동). 나머지는 그 변의 양 끝 각이 다르다.`,
            facts: { truth: order.map((i) => i === 1), want: true }
          });
        }
        // 함정: 세 각의 크기만 적힌 삼각형. 나머지 셋은 나머지 한 각을 구하면 서로 합동임을 알 수 있다(한 변과 양 끝 각, 두 변과 끼인각).
        const t = triASA(6, a, b), small = scaled(t, 0.84);
        const specs = [
          { t, sides: { 2: 'a', 0: 'b' }, angles: { 1: b }, said: `두 변의 길이가 a cm, b cm이고 그 끼인각의 크기가 ${b}°인 삼각형` },
          { t, sides: { 2: 'a' }, angles: { 0: a, 1: b }, said: `한 변의 길이가 a cm이고 그 양 끝 각의 크기가 ${a}°, ${b}°인 삼각형` },
          { t, sides: { 2: 'a', 0: 'b' }, angles: { 0: a, 2: g }, said: `길이가 a cm인 변의 한 끝 각의 크기가 ${a}°, 그 변의 대각의 크기가 ${g}°이고, 다른 끝에서 나간 변의 길이가 b cm인 삼각형` },
          { t: small, sides: {}, angles: { 0: a, 1: b, 2: g }, said: `세 각의 크기가 ${a}°, ${b}°, ${g}°이고 변의 길이는 적혀 있지 않은 삼각형` }
        ];
        const order = d.shuffle([0, 1, 2, 3]), out = laidOut(d, specs), tagOf = (i) => SYM[order.indexOf(i)];
        return C('다음 삼각형 ㉠~㉣ 가운데 나머지 셋과 합동이 아닌 것은?', SYM.slice(0, 4), order.indexOf(3), {
          figure: gridFig(order.map((i, k) => ({ tag: SYM[k], pic: specPic(out.placed[i]) })), order.map((i, k) => `${SYM[k]}: ${specs[i].said}`).join('. ') + '.', { k: out.k }),
          explain: `${tagOf(2)}에서 나머지 한 각의 크기는 180° − (${a}° + ${g}°) = ${b}°이다. 그러므로 ${jo(tagOf(2), '과/와')} ${jo(tagOf(1), '은/는')} 길이가 ${V('a')} cm인 변의 양 끝 각의 크기가 각각 같아 ASA 합동이고, ${jo(tagOf(2), '과/와')} ${jo(tagOf(0), '은/는')} 길이가 ${V('a')} cm, ${V('b')} cm인 두 변의 끼인각의 크기가 ${b}°로 같아 SAS 합동이다. ${jo(tagOf(3), '은/는')} 세 각의 크기만 같으므로 나머지와 합동이라고 할 수 없다.`,
          facts: { truth: order.map((i) => i === 3), want: true }
        });
      }, { count: 3 }),
      H('hard-used', '합동임을 설명할 때 이용하는 것과 합동에서 따라 나오는 것 가르기', '심25 심26 / 기본 ①49 ①52', (d, n) => {
        // 함정: 그림에서 같아 보이는 것, 합동이면 같아지는 것(나머지 대응변, 대응각)을 설명에 쓰는 아이. 설명에는 주어진 것과 맞꼭지각·정사각형의 성질에서 바로 나오는 것만 쓴다.
        if (n === 0) {
          const rows = d.shuffle([[eqs('OA', 'OC'), true], [eqs('AB', 'CD'), false], [eqs('OB', 'OD'), true], ['∠AOB = ∠COD', true], ['∠OAB = ∠OCD', false]]);
          return allQ(d, '그림에서 점 O는 선분 AC와 선분 BD의 중점이다. △OAB ≡ △OCD임을 설명할 때 이용하는 것을 모두 고른 것은?', SYM, rows.map((r) => r[1]), {
            figure: bowFig('A', 'C', 'B', 'D') + tagged(rows.map((r) => r[0]), SYM),
            explain: `점 O가 두 선분의 중점이므로 ${eqs('OA', 'OC')}, ${eqs('OB', 'OD')}이고, 맞꼭지각이므로 ∠AOB = ∠COD이다. 이 셋으로 SAS 합동임을 설명한다. ${eqs('AB', 'CD')}와 ∠OAB = ∠OCD는 두 삼각형이 합동임을 알고 난 뒤에 얻는 것이므로 설명에 이용할 수 없다.`
          });
        }
        const u = 3.5, pts = Object.assign(squarePts(u), { E: [u / 2, 0], F: [u, u / 2] }), rows = d.shuffle([[eqs('AD', 'DC'), true], [eqs('DF', 'CE'), true], [eqs('AF', 'DE'), false], ['∠ADF = ∠DCE', true], ['∠DAF = ∠CDE', false]]);
        return allQ(d, '그림의 정사각형 ABCD에서 두 점 E, F는 각각 변 BC, 변 CD의 중점이다. △ADF ≡ △DCE임을 설명할 때 이용하는 것을 모두 고른 것은?', SYM, rows.map((r) => r[1]), {
          figure: shape({ pts, segs: ['AB', 'BC', 'CD', 'AD', 'AF', 'DE'], ticks: { BE: 1, EC: 1, CF: 1, FD: 1 } }).svg(SQUARE + '변 BC의 중점 E, 변 CD의 중점 F가 있고 선분 BE, EC, CF, FD에 같은 표시가 있다. 선분 AF와 선분 DE가 그어져 있다.') + tagged(rows.map((r) => r[0]), SYM),
          explain: `정사각형의 네 변의 길이는 같으므로 ${eqs('AD', 'DC')}이고, 두 점 E, F가 변의 중점이므로 ${eqs('DF', 'CE')}이다. 정사각형의 한 각이므로 ∠ADF = ∠DCE = 90°이다. 이 셋으로 SAS 합동임을 설명한다. ${eqs('AF', 'DE')}와 ∠DAF = ∠CDE는 두 삼각형이 합동임을 알고 난 뒤에 얻는 것이다.`
        });
      }, { count: 2 }),

      // ── ② 두 번 넘게 생각해야 풀리는 문제 ──
      H('hard-two-equi', '한 꼭짓점을 함께 가진 두 정삼각형', '심35 심44 / 기본 ①62 ①64 ②51', (d, n) => {
        // 두 변이 각각 같은 두 삼각형을 찾고, 끼인각이 60°에 같은 각을 더한(뺀) 각임을 보아야 한다.
        if (n === 0) {
          const s = d.int(3, 6), t = s + d.int(2, 5), f = 6.2 / (s + t), P = equiPts(s * f);
          P.D = [(s + t) * f, 0]; P.E = turn(P.D, 60, P.A);
          return N(`그림은 한 변의 길이가 ${cm(s)}인 정삼각형 ABC의 변 BC의 연장선 위에 점 D를 잡고, 선분 AD를 한 변으로 하는 정삼각형 ADE를 그린 것이다. ${sg('CD')} = ${cm(t)}일 때, ${sg('CE')}의 길이는 몇 cm인가?`, s + t, {
            unit: 'cm', figure: shape({ pts: P, segs: ['AB', 'BD', 'AC', 'AD', 'DE', 'AE', 'CE'], lens: { BC: cm(s), CD: cm(t) }, away: { BC: P.A, CD: P.A } })
              .svg(`정삼각형 ABC. 점 A는 위, 점 B는 왼쪽 아래, 점 C는 오른쪽 아래에 있다. 변 BC를 점 C 너머로 늘인 선 위에 점 D가 있고, 선분 AD를 한 변으로 하는 정삼각형 ADE가 위쪽에 그려져 있다. 선분 CE가 그어져 있다. 선분 BC의 길이는 ${cm(s)}, 선분 CD의 길이는 ${cm(t)}.`, { maxH: 235 }),
            explain: `△ABD와 △ACE에서 ${eqs('AB', 'AC')}, ${eqs('AD', 'AE')}이고 ∠BAD = 60° + ∠CAD = ∠CAE이므로 △ABD ≡ △ACE (SAS 합동)이다. 따라서 ${sg('CE')} = ${sg('BD')} = ${s} + ${t} = ${s + t} (cm)이다.`,
            facts: { calc: [[`${s}+${t}`, 0]] }
          });
        }
        const P = equiPts(4.4), x = d.pick([0.3, 0.36, 0.42]);
        P.D = [4.4 * x, 0]; P.E = turn(P.D, 60, P.A);
        return N('그림은 정삼각형 ABC의 변 BC 위에 점 D를 잡고, 선분 AD를 한 변으로 하는 정삼각형 ADE를 그린 것이다. ∠DCE의 크기는 몇 도인가?', 120, {
          unit: '°', figure: shape({ pts: P, segs: ['AB', 'BC', 'AC', 'AD', 'DE', 'AE', 'CE'] }).svg('정삼각형 ABC. 점 A는 위, 점 B는 왼쪽 아래, 점 C는 오른쪽 아래에 있다. 변 BC 위에 점 D가 있고, 선분 AD를 한 변으로 하는 정삼각형 ADE가 변 AC의 바깥쪽에 그려져 있다. 선분 CE가 그어져 있다.'),
          explain: `△ABD와 △ACE에서 ${eqs('AB', 'AC')}, ${eqs('AD', 'AE')}이고 ∠BAD = 60° − ∠DAC = ∠CAE이므로 △ABD ≡ △ACE (SAS 합동)이다. 따라서 ∠ACE = ∠ABD = 60°이고, ∠DCE = ∠ACB + ∠ACE = 60° + 60° = 120°이다.`,
          facts: { calc: [['60+60', 0]], unseen: [60] }
        });
      }, { count: 2 }),
      H('hard-two-squares', '한 꼭짓점을 함께 가진 두 정사각형', '심33 심34 / 기본 ②52', (d) => {
        // 그림에 적힌 세 길이 가운데 구하는 선분과 길이가 같은 것은 대응변 하나뿐이다. 두 정사각형의 변과 직각에서 합동인 삼각형을 찾아야 한다.
        const [p, q, h] = d.pick([[8, 6, 10], [12, 5, 13], [12, 9, 15], [15, 8, 17]]), f = 3.7 / p, u = p * f, v = q * f;
        const pts = { A: [0, u], D: [u, u], B: [0, 0], C: [u, 0], G: [u, v], F: [u + v, v], E: [u + v, 0] };
        return N(`그림에서 사각형 ABCD와 사각형 GCEF는 모두 정사각형이다. ${sg('BC')} = ${cm(p)}, ${sg('CE')} = ${cm(q)}, ${sg('BG')} = ${cm(h)}일 때, ${sg('DE')}의 길이는 몇 cm인가?`, h, {
          unit: 'cm', figure: shape({ pts, segs: ['AB', 'BE', 'CD', 'AD', 'EF', 'FG', 'BG', 'DE'], lens: { BC: cm(p), CE: cm(q), BG: cm(h) }, away: { BC: pts.A, CE: pts.A, BG: pts.C }, dirs: { G: [-0.9, 0.7] } })
            .svg(`정사각형 ABCD와 정사각형 GCEF. 점 A는 왼쪽 위, 점 D는 오른쪽 위, 점 B는 왼쪽 아래, 점 C는 오른쪽 아래에 있다. 변 BC를 점 C 너머로 늘인 선 위에 점 E가 있고, 변 CD 위에 점 G가 있다. 선분 BG와 선분 DE가 그어져 있다. 선분 BC의 길이는 ${cm(p)}, 선분 CE의 길이는 ${cm(q)}, 선분 BG의 길이는 ${cm(h)}.`),
          explain: `△BCG와 △DCE에서 ${eqs('BC', 'DC')}, ${eqs('CG', 'CE')}이고 ∠BCG = ∠DCE = 90°이므로 △BCG ≡ △DCE (SAS 합동)이다. ${sg('DE')}의 대응변은 ${sg('BG')}이므로 ${sg('DE')} = ${cm(h)}이다.`,
          facts: { calc: [[String(h), 0]] }
        });
      }),
      H('hard-square-tri', '정사각형 안의 정삼각형이 만드는 합동', '심32 / 기본 ①63 ②46', (d) => {
        const u = 3.6, pts = Object.assign(squarePts(u), { E: [u / 2, u * Math.sqrt(3) / 2] });
        return pickOne(d, '그림의 정사각형 ABCD에서 △EBC는 정삼각형이다. △ABE ≡ △DCE임을 바르게 설명한 것은?', `${eqs('AB', 'DC')}, ${eqs('BE', 'CE')}, ∠ABE = ∠DCE = 30°이므로 SAS 합동이다.`,
          [`${eqs('AB', 'DC')}, ${eqs('BE', 'CE')}, ∠ABE = ∠DCE = 60°이므로 SAS 합동이다.`, `${eqs('AB', 'DC')}, ${eqs('BE', 'CE')}, ${eqs('AE', 'DE')}이므로 SSS 합동이다.`, `${eqs('AB', 'DC')}, ∠ABE = ∠DCE = 30°, ∠BAE = ∠CDE이므로 ASA 합동이다.`], {
            figure: shape({ pts, segs: ['AB', 'BC', 'CD', 'AD', 'BE', 'CE', 'AE', 'DE'], dirs: { E: [0, 1] } }).svg(SQUARE + '변 BC를 한 변으로 하는 정삼각형 EBC가 정사각형 안쪽에 그려져 있다. 선분 AE와 선분 DE가 그어져 있다.'),
            explain: `∠ABE = 90° − 60° = 30°, ∠DCE = 90° − 60° = 30°이다. ${eqs('AB', 'DC')}(정사각형의 변), ${eqs('BE', 'CE')}(정삼각형의 변)이고 그 끼인각의 크기가 같으므로 SAS 합동이다. ${eqs('AE', 'DE')}와 ∠BAE = ∠CDE는 두 삼각형이 합동임을 알고 난 뒤에 얻는 것이다.`
          });
      }),
      H('hard-square-cross', '정사각형의 두 변 위에 같은 길이로 잡은 두 점: 각의 크기', '심46 심47 / 기본 ①65', (d, n) => {
        // △ABE ≡ △BCF (SAS)를 찾아 대응각을 옮긴 다음, 삼각형의 세 각의 크기의 합을 쓴다.
        const u = 3.7, sq = squarePts(u);
        if (n === 0) {
          const big = d.pick([105, 110, 115]), aeb = 180 - big, cut = u / Math.tan(aeb * RAD), pts = Object.assign(sq, { E: [cut, 0], F: [u, cut] });
          return N(`그림의 정사각형 ABCD에서 ${eqs('BE', 'CF')}이고 ∠AEC = ${big}°일 때, ∠CBF의 크기는 몇 도인가?`, big - 90, {
            unit: '°', figure: shape({ pts, segs: ['AB', 'BC', 'CD', 'AD', 'AE', 'BF'], ticks: { BE: 1, CF: 1 }, angs: [['AEC', big + '°']], dirs: { E: [0, -1], F: [1, 0] } }).svg(SQUARE + `변 BC 위에 점 E, 변 CD 위에 점 F가 있고 선분 BE와 선분 CF에 같은 표시가 있다. 선분 AE와 선분 BF가 그어져 있다. ∠AEC의 크기는 ${big}°.`),
            explain: `△ABE와 △BCF에서 ${eqs('AB', 'BC')}, ${eqs('BE', 'CF')}, ∠ABE = ∠BCF = 90°이므로 △ABE ≡ △BCF (SAS 합동)이다. ∠AEB = 180° − ${big}° = ${aeb}°이므로 ∠BAE = 180° − (90° + ${aeb}°) = ${big - 90}°이다. ∠CBF의 대응각은 ∠BAE이므로 ∠CBF = ${big - 90}°이다.`,
            facts: { calc: [[`90-(180-${big})`, 0]], unseen: [90, 180] }
          });
        }
        const th = d.pick([20, 25, 30]), cut = u * Math.tan(th * RAD), pts = Object.assign(sq, { E: [cut, 0], F: [u, cut] });
        pts.G = meet(pts.A, [pts.E[0] - pts.A[0], pts.E[1] - pts.A[1]], pts.B, pts.F);
        return N(`그림의 정사각형 ABCD에서 ${eqs('BE', 'CF')}이고 ∠BAE = ${th}°이다. 선분 AE와 선분 BF의 교점을 G라 할 때, ∠AGB의 크기는 몇 도인가?`, 90, {
          unit: '°', figure: shape({ pts, segs: ['AB', 'BC', 'CD', 'AD', 'AE', 'BF'], ticks: { BE: 1, CF: 1 }, angs: [['BAE', th + '°']], dirs: { E: [0, -1], F: [1, 0], G: [1, 0.25] } }).svg(SQUARE + `변 BC 위에 점 E, 변 CD 위에 점 F가 있고 선분 BE와 선분 CF에 같은 표시가 있다. 선분 AE와 선분 BF가 점 G에서 만난다. ∠BAE의 크기는 ${th}°.`),
          explain: `△ABE와 △BCF에서 ${eqs('AB', 'BC')}, ${eqs('BE', 'CF')}, ∠ABE = ∠BCF = 90°이므로 △ABE ≡ △BCF (SAS 합동)이다. 따라서 ∠CBF = ∠BAE = ${th}°이고 ∠ABG = 90° − ${th}° = ${90 - th}°이다. △ABG에서 ∠AGB = 180° − (${th}° + ${90 - th}°) = 90°이다.`,
          facts: { calc: [[`180-${th}-(90-${th})`, 0]], unseen: [180, 90] }
        });
      }, { count: 2 }),
      H('hard-equi-cross', '정삼각형의 두 변 위에 같은 길이로 잡은 두 점: 두 선분이 이루는 각', '심43 / 기본 ①66', (d) => {
        const th = d.pick([20, 25]), P = equiTwo(Math.sin(th * RAD) / Math.sin((120 - th) * RAD));
        P.P = meet(P.A, [P.D[0] - P.A[0], P.D[1] - P.A[1]], P.B, P.E);
        return N(`그림의 정삼각형 ABC에서 ${eqs('BD', 'CE')}이고 ∠BAD = ${th}°이다. 선분 AD와 선분 BE의 교점을 P라 할 때, ∠APB의 크기는 몇 도인가?`, 120, {
          unit: '°', figure: shape({ pts: P, segs: ['AB', 'BC', 'AC', 'AD', 'BE'], ticks: { BD: 1, CE: 1 }, angs: [['BAD', th + '°']], dirs: { P: [1, 0.15] } })
            .svg(`정삼각형 ABC. 점 A는 위, 점 B는 왼쪽 아래, 점 C는 오른쪽 아래에 있다. 변 BC 위에 점 D, 변 CA 위에 점 E가 있고 선분 BD와 선분 CE에 같은 표시가 있다. 선분 AD와 선분 BE가 점 P에서 만난다. ∠BAD의 크기는 ${th}°.`, { k: 40 }),
          explain: `△ABD와 △BCE에서 ${eqs('AB', 'BC')}, ${eqs('BD', 'CE')}, ∠ABD = ∠BCE = 60°이므로 △ABD ≡ △BCE (SAS 합동)이다. 따라서 ∠CBE = ∠BAD = ${th}°이고 ∠ABP = 60° − ${th}° = ${60 - th}°이다. △ABP에서 ∠APB = 180° − (${th}° + ${60 - th}°) = 120°이다.`,
          facts: { calc: [[`180-${th}-(60-${th})`, 0]], unseen: [180, 60] }
        });
      }),
      H('hard-equi-line', '한 직선 위에 나란히 놓인 두 정삼각형', '심45', (d) => {
        // 끼인각이 180° − 60° = 120°인 두 삼각형을 찾아야 한다.
        const th = d.pick([20, 25, 35, 40]), t = 2.6, s = t * Math.sin((60 - th) * RAD) / Math.sin(th * RAD), f = 6.3 / (s + t), a = s * f, b = t * f, r3 = Math.sqrt(3) / 2;
        const pts = { A: [a / 2, a * r3], E: [a + b / 2, b * r3], B: [0, 0], C: [a, 0], D: [a + b, 0] };
        pts.F = meet(pts.A, [pts.D[0] - pts.A[0], pts.D[1] - pts.A[1]], pts.B, pts.E);
        return N(`그림은 선분 BD 위에 점 C를 잡고, 선분 BC와 선분 CD를 각각 한 변으로 하는 정삼각형 ABC와 정삼각형 ECD를 같은 쪽에 그린 것이다. ∠CBE = ${th}°일 때, ∠ADC의 크기는 몇 도인가?`, 60 - th, {
          unit: '°', figure: shape({ pts, segs: ['AB', 'BD', 'AC', 'CE', 'ED', 'AD', 'BE'], angs: [['CBE', th + '°']], hide: 'F' })
            .svg(`선분 BD 위에 점 C가 있다. 선분 BC를 한 변으로 하는 정삼각형 ABC와 선분 CD를 한 변으로 하는 정삼각형 ECD가 선분 BD의 위쪽에 나란히 그려져 있다. 선분 AD와 선분 BE가 그어져 있다. ∠CBE의 크기는 ${th}°.`, { k: 40 }),
          explain: `△ACD와 △BCE에서 ${eqs('AC', 'BC')}, ${eqs('CD', 'CE')}이고 ∠ACD = ∠BCE = 180° − 60° = 120°이므로 △ACD ≡ △BCE (SAS 합동)이다. 따라서 ∠CAD = ∠CBE = ${th}°이고, △ACD에서 ∠ADC = 180° − (120° + ${th}°) = ${60 - th}°이다.`,
          facts: { calc: [[`180-(180-60)-${th}`, 0]], unseen: [180, 60] }
        });
      }),
      H('hard-three-points', '정삼각형의 세 변 위에 같은 길이로 잡은 세 점', '심41 / 기본 ①60 ②47', (d) => {
        // 주어진 것은 AD = BE = CF 뿐이다. 변의 길이에서 이것을 빼어 BD = CE = AF 를 먼저 얻어야 세 삼각형이 SAS 합동임을 알 수 있다.
        const s = 4.4, x = d.pick([0.28, 0.32, 0.36]), P = equiPts(s);
        P.D = lerp(P.A, P.B, x); P.E = lerp(P.B, P.C, x); P.F = lerp(P.C, P.A, x);
        const yes = d.shuffle([eqs('BD', 'CE'), eqs('DE', 'EF'), '∠ADF = ∠BED', '∠DEF = 60°', eqs('AF', 'BD'), '△ADF ≡ △BED']).slice(0, 3);
        const bad = d.pick([[eqs('AF', 'EF'), `${sg('AF')}와 ${sg('EF')}의 길이는 같다고 할 수 없다.`], [eqs('AD', 'DF'), `${sg('AD')}와 ${sg('DF')}의 길이는 같다고 할 수 없다.`], ['∠ADF = ∠AFD', '∠ADF와 ∠AFD의 크기는 같다고 할 수 없다.'], [eqs('BD', 'DE'), `${sg('BD')}와 ${sg('DE')}의 길이는 같다고 할 수 없다.`]]);
        return pickOne(d, `그림의 정삼각형 ABC에서 ${eqs('AD', 'BE')} = ${sg('CF')}일 때, 다음 중 옳지 않은 것은?`, bad[0], yes, {
          figure: shape({ pts: P, segs: ['AB', 'BC', 'AC', 'DE', 'EF', 'DF'], ticks: { AD: 1, BE: 1, CF: 1 } }).svg('정삼각형 ABC. 점 A는 위, 점 B는 왼쪽 아래, 점 C는 오른쪽 아래에 있다. 변 AB 위에 점 D, 변 BC 위에 점 E, 변 CA 위에 점 F가 있고 선분 AD, BE, CF에 같은 표시가 있다. 삼각형 DEF가 그려져 있다.', { k: 40 }),
          explain: `정삼각형의 세 변의 길이가 같으므로 ${eqs('BD', 'CE')} = ${sg('AF')}이다. △ADF, △BED, △CFE에서 ${eqs('AD', 'BE')} = ${sg('CF')}, ${eqs('AF', 'BD')} = ${sg('CE')}, ∠A = ∠B = ∠C = 60°이므로 세 삼각형은 서로 합동이다(SAS 합동). 따라서 ${eqs('DF', 'ED')} = ${sg('FE')}이고 △DEF는 정삼각형이다. ${bad[1]}`
        });
      }),
      H('hard-trapezoid', '합동인 삼각형을 옮겨 사다리꼴의 넓이 구하기', '심38', (d) => {
        // △AFD ≡ △EFC (ASA: 맞꼭지각, 엇각)를 찾으면 사다리꼴의 넓이가 직각삼각형 ABE 의 넓이와 같다.
        const [hgt, be] = d.pick([[4, 7], [6, 9], [4, 9], [6, 11], [8, 9], [6, 7]]), f = 5.4 / be, top = Math.round(be * 0.36 * 10) / 10 * f, h = hgt * f, bottom = be * f - top;
        const pts = { A: [0, h], D: [top, h], B: [0, 0], C: [bottom, 0], E: [be * f, 0] };
        pts.F = lerp(pts.A, pts.E, 0.5);
        return N(`그림과 같이 ${sg('AD')} ∥ ${sg('BC')}, ∠B = 90°인 사다리꼴 ABCD가 있다. 변 BC의 연장선 위의 점 E에 대하여 선분 AE와 변 DC가 점 F에서 만나고 ${eqs('AF', 'EF')}이다. ${sg('AB')} = ${cm(hgt)}, ${sg('BE')} = ${cm(be)}일 때, 사다리꼴 ABCD의 넓이는 몇 cm²인가?`, hgt * be / 2, {
          unit: 'cm²', figure: shape({ pts, segs: ['AB', 'BE', 'AD', 'DC', 'AE'], ticks: { AF: 1, FE: 1 }, angs: [['ABC', '', 'right']], lens: { AB: cm(hgt) }, spans: { BE: cm(be) }, away: { AB: pts.C, BE: pts.A }, dirs: { F: [0.5, 1], C: [-0.2, 1] } })
            .svg(`사다리꼴 ABCD. 점 A는 왼쪽 위, 점 D는 오른쪽 위, 점 B는 왼쪽 아래, 점 C는 오른쪽 아래에 있고 ∠B에 직각 표시가 있다. 변 BC를 점 C 너머로 늘인 선 위에 점 E가 있다. 선분 AE와 변 DC가 점 F에서 만나고, 선분 AF와 선분 FE에 같은 표시가 있다. 변 AB의 길이는 ${cm(hgt)}, 선분 BE의 길이는 ${cm(be)}.`),
          explain: `△AFD와 △EFC에서 ${eqs('AF', 'EF')}, ∠AFD = ∠EFC(맞꼭지각)이고, ${sg('AD')} ∥ ${sg('BE')}이므로 ∠DAF = ∠CEF(엇각)이다. 따라서 △AFD ≡ △EFC (ASA 합동)이고 두 삼각형의 넓이는 같다. 사다리꼴 ABCD의 넓이는 △ABE의 넓이와 같으므로 ${hgt} × ${be} ÷ 2 = ${hgt * be / 2} (cm²)이다.`,
          facts: { calc: [[`${hgt}*${be}/2`, 0]], unseen: [2] }
        });
      })
    ]
  });
  // ── 기본 묶음에 덧붙이는 꼴 ──
  // 받으면서 실력에서 기본으로 내린 꼴: 기본에서 하는 일을 다시 묻거나 한 번에 풀리는 것.
  const TB = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 자료(' + ref + ')', make }, more || {});
  B.addTypes('7-2-2', 'cong', [
    TB('cong-symbol-order', '그림 없이 합동 기호의 차례로 대응변과 대응각 찾기', '심21 / 기본 ①39', (d) => {
      // 함정: 글자 차례(A–D, B–E, C–F)대로 대응시키는 아이. 묻는 각의 꼭짓점은 D 나 E 이므로, 그 아이는 주어진 ∠A 나 ∠B 의 크기를 그대로 답한다.
      const names = d.until(() => d.shuffle(N2), (x) => x[2] !== 'F' && x.join('') !== 'DEF'), c = d.int(5, 11);
      const [a, b] = d.until(() => [ang5(d, 35, 85), ang5(d, 35, 85)], ([x, y]) => x !== y && x + y <= 135 && 180 - x - y !== x && 180 - x - y !== y), g = 180 - a - b, side = pairName(names, 2);
      return M(`△ABC ≡ △${names.join('')}이고 ${sg('AB')} = ${cm(c)}, ∠A = ${a}°, ∠B = ${b}°일 때, ${sg(side)}의 길이와 ∠${names[2]}의 크기를 구하시오.`, [{ label: '선분 ' + side, answer: c, unit: 'cm' }, { label: '∠' + names[2], answer: g, unit: '°' }], {
        explain: `합동 기호는 대응하는 꼭짓점의 차례로 쓰므로 꼭짓점 A와 ${names[0]}, B와 ${names[1]}, C와 ${jo(names[2], '이/가')} 각각 대응한다. ${sg(side)}의 대응변은 ${sg('AB')}이므로 ${sg(side)} = ${cm(c)}이다. ∠${names[2]}의 대응각은 ∠C이고 ∠C = 180° − (${a}° + ${b}°) = ${g}°이므로 ∠${names[2]} = ${g}°이다.`,
        facts: { calc: [[String(c), 0], [`180-(${a}+${b})`, 1]], unseen: [180] }
      });
    })
  ]);
  B.addTypes('7-2-2', 'find', [
    TB('find-pond', '합동을 이용하여 직접 잴 수 없는 거리 구하기', '기본 ①49', (d) => {
      // 그림에 길이가 다섯 군데 적혀 있다. 구하는 거리와 같은 것은 맞꼭지각을 끼인각으로 하는 합동에서 대응변 하나뿐이다.
      const [ao, bo, w] = d.pick([[14, 18, 20], [12, 15, 18], [10, 13, 15], [16, 20, 24], [9, 12, 14]]), f = 3.5 / w, base = triSSS(ao * f, bo * f, w * f), O = base[2], Cp = [0, 0], D = [w * f, 0], A = [2 * O[0] - D[0], 2 * O[1]], Bp = [2 * O[0], 2 * O[1]];
      const pond = [], mid = lerp(A, Bp, 0.5), rx = dist(A, Bp) / 2 - 0.12;
      for (let i = 0; i < 28; i += 1) pond.push([mid[0] + rx * Math.cos(i / 28 * 2 * Math.PI), mid[1] + 0.34 * Math.sin(i / 28 * 2 * Math.PI)]);
      const pic = new Pic().fill(pond, 'fill:#bfdbfe');
      shape({ pts: { A, B: Bp, O, C: Cp, D }, segs: ['AD', 'BC', 'CD'], dash: ['AB'], dots: 'AB', lens: { AO: ao + ' m', OD: ao + ' m', BO: bo + ' m', OC: bo + ' m', CD: w + ' m' }, away: { AO: Bp, OD: Cp, BO: A, OC: D, CD: O }, dirs: { O: [1, 0], A: [-1, 0.3], B: [1, 0.3] } }, pic);
      return N(`연못의 양 끝 지점 A, B 사이의 거리를 직접 잴 수 없어, 그림과 같이 두 선분 AD, BC가 점 O에서 만나도록 두 지점 C, D를 정하였다. ${eqs('AO', 'DO')} = ${ao} m, ${eqs('BO', 'CO')} = ${bo} m, ${sg('CD')} = ${w} m일 때, 두 지점 A, B 사이의 거리는 몇 m인가?`, w, {
        unit: 'm', figure: pic.svg(`위쪽에 연못이 있고 연못의 왼쪽 끝에 지점 A, 오른쪽 끝에 지점 B가 있다. 선분 AD와 선분 BC가 점 O에서 만나고, 아래쪽에 지점 C(왼쪽)와 지점 D(오른쪽)가 있다. 선분 AO의 길이는 ${ao} m, 선분 DO의 길이는 ${ao} m, 선분 BO의 길이는 ${bo} m, 선분 CO의 길이는 ${bo} m, 선분 CD의 길이는 ${w} m.`, { k: 46, maxH: 240 }),
        explain: `△AOB와 △DOC에서 ${eqs('AO', 'DO')}, ${eqs('BO', 'CO')}이고 ∠AOB = ∠DOC(맞꼭지각)이므로 △AOB ≡ △DOC (SAS 합동)이다. ${sg('AB')}의 대응변은 ${sg('DC')}이므로 두 지점 A, B 사이의 거리는 ${w} m이다.`,
        facts: { calc: [[String(w), 0]] }
      });
    })
  ]);

  // ── 다시 실은 꼴 ──
  // 처음 지을 때 「합동을 두 번 넘게 쓴다」「보조선을 그어야 한다」「경우가 많다」「요령이 든다」는 까닭으로 뺀 꼴을 다시 보고 실었다(그대로 뺀 것과 다시 실은 것의 목록은 7-2-2a.js 머리 주석).
  //  - 직각이 둘 있는 두 삼각형(수선의 발, 접은 종이)은 나머지 한 각을 구하여 ASA 합동으로 설명한다. 직각삼각형의 합동 조건(중2)의 이름은 쓰지 않는다.
  //  - 정사각형의 대각선이 한 각을 이등분한다는 것은 △ABD ≡ △CBD (SSS 합동)로, 두 대각선의 교점에서 생기는 같은 각은 △OBC ≡ △OCD (SAS 합동)로 댄다. 이등변삼각형의 성질(중2)은 쓰지 않는다.
  //  - 설명을 고르게 하는 유형은 빈칸 꼴로 물었다. 「바르게 설명한 것」으로 물으면 합동을 알고 난 뒤에 얻는 변을 쓴 보기도 다른 길로는 설명이 되어 답이 갈린다.
  //  - ②53 은 hard-square-cross#2 와 같은 그림·같은 답이어서 싣지 않았다. 문자로 놓은 두 각의 합을 쓰는 일은 hard-square-sum 이 맡는다.
  const { polar, sub, BLK, LONGEST, T } = K, { lines } = B.kit;
  B.addTypes(UNIT, 'hard', [
    H('hard-chain-two', '첫 합동에서 얻은 것으로 둘째 합동을 설명하기: 설명의 빈칸', '기본 ①55', (d) => {
      // △ABC ≡ △DBE (ASA)에서 BC = BE, ∠BCA = ∠BED 를 얻어야 △AEF 와 △DCF 의 한 변과 그 양 끝 각이 갖추어진다.
      // 틀린 보기: 첫 합동의 조건을 SAS 로 읽은 것, 둘째 합동을 알고 난 뒤에야 얻는 변(DF)을 댄 것, 양 끝 각이 아닌 각(∠DFC)을 댄 것
      const O = [0, 0], lo = d.pick([4, 8]), hi = lo + d.pick([44, 48]), pts = { B: O, E: polar(O, 2.3, lo), A: polar(O, 4.5, lo), C: polar(O, 2.3, hi), D: polar(O, 4.5, hi) };
      pts.F = meet(pts.A, sub(pts.C, pts.A), pts.D, sub(pts.E, pts.D));
      const rows = [`△ABC와 △DBE에서 ${eqs('AB', 'DB')}, ∠BAC = ∠BDE, ∠B는 공통이므로 △ABC ≡ △DBE (${BLK[0]} 합동)`,
        `따라서 ${eqs('BC', 'BE')}이므로 ${sg('AE')} = ${BLK[1]}이고, ∠BCA = ∠BED이므로 ∠AEF = ${BLK[2]}이다.`,
        `△AEF와 △DCF에서 ${sg('AE')} = ${BLK[1]}, ∠EAF = ∠CDF, ∠AEF = ${BLK[2]}이므로 △AEF ≡ △DCF (ASA 합동)`];
      const opt = (k, side, angle) => `${k}, ${sg(side)}, ${angle}`;
      return pickOne(d, `다음은 그림에서 ${eqs('AB', 'DB')}, ∠BAC = ∠BDE이고 점 F가 선분 AC와 선분 DE의 교점일 때, △AEF ≡ △DCF임을 설명하는 과정이다. ${BLK.join(', ')}에 알맞은 것을 차례로 나열한 것은?`,
        opt('ASA', 'DC', '∠DCF'), [opt('SAS', 'DC', '∠DCF'), opt('ASA', 'DF', '∠DCF'), opt('ASA', 'DC', '∠DFC')], {
          figure: shape({ pts, segs: ['BA', 'BD', 'AC', 'DE'], angs: [['BAC', '', 'arc'], ['BDE', '', 'arc']], dots: 'EC' })
            .svg('점 B에서 나간 두 선분 BA, BD가 있다. 선분 BA 위에 점 E가, 선분 BD 위에 점 C가 있다. 선분 AC와 선분 DE가 점 F에서 만난다. ∠BAC와 ∠BDE에 같은 표시(호)가 있다.', { k: 40 }) + lines(rows),
          explain: `△ABC와 △DBE에서 ${sg('AB')}의 양 끝 각은 ∠BAC와 ∠B이고 ${sg('DB')}의 양 끝 각은 ∠BDE와 ∠B이므로 ASA 합동이다. ${eqs('BC', 'BE')}이므로 ${sg('AE')} = ${sg('AB')} − ${sg('BE')} = ${sg('DB')} − ${sg('BC')} = ${sg('DC')}이다. ∠BCA = ∠BED이므로 ∠AEF = 180° − ∠BED = 180° − ∠BCA = ∠DCF이다. ${sg('AE')}의 양 끝 각은 ∠EAF와 ∠AEF이고 ${sg('DC')}의 양 끝 각은 ∠CDF와 ∠DCF이다.`
        });
    }),
    H('hard-feet', '직각을 낀 두 변의 길이가 같은 삼각형의 두 꼭짓점에서 직선에 내린 수선', '기본 ①67 ②54', (d) => {
      // ∠ABD = 90° − ∠BAD = ∠CAE 를 각 셈으로 찾아 △ABD ≡ △CAE (ASA)를 대고, 대응변 두 쌍(AD = CE, BD = AE)을 옮겨 선분 DE 를 나눈다.
      const [p, q] = d.until(() => [d.int(3, 15), d.int(3, 15)], ([x, y]) => Math.max(x, y) >= 2.2 * Math.min(x, y) && Math.max(x, y) <= 3.2 * Math.min(x, y)), de = p + q, f = 5.3 / de;
      const ask = d.pick(['BD', 'CE']), other = ask === 'BD' ? 'CE' : 'BD', given = ask === 'BD' ? q : p, answer = ask === 'BD' ? p : q;
      const pts = { B: [-q * f, p * f], C: [p * f, q * f], D: [-q * f, 0], A: [0, 0], E: [p * f, 0] }, pic = new Pic().seg([pts.D[0] - 0.75, 0], [pts.E[0] + 0.85, 0]);
      shape({ pts, segs: ['AB', 'AC', 'BC', 'BD', 'CE'], ticks: { AB: 1, AC: 1 }, angs: [['BDA', '', 'right'], ['CEA', '', 'right'], ['BAC', '', 'right']], lens: { [other]: cm(given) }, dirs: { D: [-1, -0.85], E: [1, -0.85] } }, pic);
      // 선분 DE 의 길이: 점 A 의 이름과 겹치지 않게, 두 끝에서 내린 가는 선 아래에 점선 활을 그린다.
      const low = (name) => [pts[name][0], -0.56];
      pic.seg(pts.D, low('D'), 'thin').seg(pts.E, low('E'), 'thin').span(low('D'), low('E'), cm(de), pts.B);
      pic.name([pts.E[0] + 0.85, 0], 'l', [1, 0], { italic: true, gap: 4 });
      const near = ask === 'BD' ? `${sg('AD')} = ${sg('CE')} = ${cm(given)}이고 ${sg('BD')} = ${sg('AE')} = ${sg('DE')} − ${sg('AD')}` : `${sg('AE')} = ${sg('BD')} = ${cm(given)}이고 ${sg('CE')} = ${sg('AD')} = ${sg('DE')} − ${sg('AE')}`;
      return N(`그림과 같이 ∠BAC = 90°, ${eqs('AB', 'AC')}인 △ABC의 꼭짓점 A를 지나는 직선 ${V('l')}이 있다. 두 꼭짓점 B, C에서 직선 ${V('l')}에 내린 수선의 발을 각각 D, E라 하자. ${sg('DE')} = ${cm(de)}, ${sg(other)} = ${cm(given)}일 때, ${sg(ask)}의 길이는 몇 cm인가?`, answer, {
        unit: 'cm', figure: pic.svg(`가로로 놓인 직선 l 위에 세 점 D, A, E가 왼쪽부터 차례로 있다. 직선 l의 위쪽에 두 점 B, C가 있고, 선분 BD와 선분 CE는 직선 l과 수직으로 만난다(점 D와 점 E에 직각 표시). 삼각형 ABC에서 ∠BAC에 직각 표시가 있고, 변 AB와 변 AC에 같은 표시가 있다. 선분 DE의 길이는 ${cm(de)}, 선분 ${other}의 길이는 ${cm(given)}.`),
        explain: `△ABD에서 ∠ABD + ∠BAD = 90°이고, 평각에서 ∠BAD + ∠CAE = 180° − 90° = 90°이므로 ∠ABD = ∠CAE이다. 같은 방법으로 ∠BAD = ∠ACE이다. △ABD와 △CAE에서 ${eqs('AB', 'CA')}이고 그 양 끝 각의 크기가 각각 같으므로 △ABD ≡ △CAE (ASA 합동)이다. 따라서 ${near} = ${de} − ${given} = ${answer} (cm)이다.`,
        facts: { calc: [[`${de}-${given}`, 0]] }
      });
    }),
    H('hard-overlap-squares', '한 정사각형의 두 대각선의 교점에 꼭짓점을 둔 다른 정사각형: 겹친 부분의 넓이', '기본 ①68', (d) => {
      // 둘째 정사각형의 한 변의 길이는 답에 쓰이지 않는다. △OBH ≡ △OCI (ASA)를 찾아 겹친 사각형을 △OBC 로 옮겨야 한다.
      const s = d.pick([6, 8, 10, 12, 14, 16]), t = s >= 10 && d.bool() ? s - 2 : s, phi = d.pick([16, 20, 24]), u = 3.3, h = u / 2, len = u * t / s, sn = Math.sin(phi * RAD), cs = Math.cos(phi * RAD);
      const pts = { A: [-h, h], D: [h, h], B: [-h, -h], C: [h, -h], O: [0, 0], H: [-h * sn / cs, -h], I: [h, -h * sn / cs], E: [-len * sn, -len * cs], G: [len * cs, -len * sn] };
      pts.F = [pts.E[0] + pts.G[0], pts.E[1] + pts.G[1]];
      const two = t === s ? `한 변의 길이가 ${cm(s)}인 두 정사각형 ABCD, OEFG가 있다.` : `한 변의 길이가 각각 ${cm(s)}, ${cm(t)}인 두 정사각형 ABCD, OEFG가 있다.`;
      return N(`그림과 같이 ${two} 점 O는 정사각형 ABCD의 두 대각선의 교점이다. 변 OE와 변 BC의 교점을 H, 변 OG와 변 CD의 교점을 I라 할 때, 사각형 OHCI의 넓이는 몇 cm²인가?`, s * s / 4, {
        unit: 'cm²', figure: shape({ pts, fills: ['OHCI'], segs: ['AB', 'BC', 'CD', 'AD', 'AC', 'BD', 'OE', 'EF', 'FG', 'GO'], lens: Object.assign({ AD: cm(s) }, t === s ? {} : { EF: cm(t) }), dirs: { O: [0, 1], I: [1, 0.7], H: [0.45, -1] } })
          .svg(`정사각형 ABCD. 점 A는 왼쪽 위, 점 D는 오른쪽 위, 점 B는 왼쪽 아래, 점 C는 오른쪽 아래에 있고 두 대각선이 점 O에서 만난다. 점 O를 한 꼭짓점으로 하는 정사각형 OEFG가 비스듬히 놓여, 변 OE가 변 BC와 점 H에서, 변 OG가 변 CD와 점 I에서 만난다. 사각형 OHCI가 색칠되어 있다. 변 AD의 길이는 ${cm(s)}${t === s ? '' : `, 변 EF의 길이는 ${cm(t)}`}.`, { maxH: 240 }),
        explain: `정사각형의 두 대각선은 길이가 같고 서로를 수직이등분하므로 ${eqs('OB', 'OC')} = ${sg('OD')}, ∠BOC = ∠COD = 90°이다. 따라서 △OBC ≡ △OCD (SAS 합동)이고 ∠OBH = ∠OCI이다. 또 ∠BOH = 90° − ∠HOC = ∠COI이다. △OBH와 △OCI에서 ${eqs('OB', 'OC')}이고 그 양 끝 각의 크기가 각각 같으므로 △OBH ≡ △OCI (ASA 합동)이다. 사각형 OHCI의 넓이는 △OHC와 △OCI의 넓이의 합이고, 이것은 △OHC와 △OBH의 넓이의 합인 △OBC의 넓이와 같다. △OBC의 넓이는 정사각형 ABCD의 넓이를 4로 나눈 것이므로 ${s} × ${s} ÷ 4 = ${s * s / 4} (cm²)이다.`,
        facts: { calc: [[`${s}*${s}/4`, 0]], unseen: [4] }
      });
    }),
    H('hard-five-sticks', '막대 다섯 가운데 셋으로 만들 수 있는 삼각형의 개수', '심11', (d) => {
      // 열 가지를 빠짐없이 따져야 한다. 두 막대의 길이의 합이 가장 긴 막대의 길이와 같은 묶음이 꼭 낀다.
      const pick3 = (x) => { const out = []; for (let i = 0; i < 5; i += 1) for (let j = i + 1; j < 5; j += 1) for (let k = j + 1; k < 5; k += 1) out.push([x[i], x[j], x[k]]); return out; }, ok = ([a, b, c]) => a + b > c;
      const s = d.until(() => d.shuffle([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).slice(0, 5).sort((x, y) => x - y), (x) => { const k = pick3(x).filter(ok).length; return k >= 4 && k <= 8 && pick3(x).some(([a, b, c]) => a + b === c); });
      const sets = pick3(s), flags = sets.map(ok), k = flags.filter(Boolean).length, show = (t) => `(${t.join(', ')})`, even = sets.filter(([a, b, c]) => a + b === c);
      return N(`길이가 ${s.map(cm).join(', ')}인 막대 5개 가운데 서로 다른 3개를 골라 만들 수 있는 삼각형은 모두 몇 개인가?`, k, {
        unit: '개', explain: `${LONGEST} 가장 긴 막대를 먼저 정하고 나머지 두 막대를 고르면서 빠짐없이 따져 보면, 삼각형을 만들 수 있는 것은 ${sets.filter(ok).map(show).join(', ')}의 ${k}개이다. ${even.map((t) => `${show(t)}은 ${t[0]} + ${t[1]} = ${t[2]}`).join(', ')}이므로 삼각형이 되지 않는다.`,
        facts: { count: flags }
      });
    }, { standard: STD3 }),
    H('hard-right-thirds', '직각을 셋으로 나누는 작도에서 각의 크기', '심8', (d) => {
      // 작도에서 같은 반지름으로 그린 원 위의 점들이므로 OX = OQ = XQ 이다. 세 변의 길이가 같은 삼각형이 정삼각형임을 대야 60°가 나온다.
      const O = [0, 0], r = 2.75, len = 3.8, X = [0, r], Y = [r, 0], P = polar(O, r, 60), Q = polar(O, r, 30), s = SYM.slice(0, 4), pic = new Pic();
      pic.seg(O, [len, 0]).seg(O, [0, len]).seg(O, polar(O, len, 60)).seg(O, polar(O, len, 30)).arc(O, r, -7, 97).nick(X, Q, 0.42).nick(Y, P, 0.42).dot(O);
      pic.name(O, 'O', [-1, -1]).name([0, len], 'A', [0, 1]).name([len, 0], 'B', [1, 0]).name(X, 'X', [-1, 0.25], { gap: 5 }).name(Y, 'Y', [0.25, -1], { gap: 5 }).name(P, 'P', [-0.8, 0.75], { gap: 6 }).name(Q, 'Q', [0.75, -0.8], { gap: 6 });
      const [ask, calc, tail] = d.pick([['∠BOQ', '90-60', '∠BOQ = 90° − ∠XOQ = 90° − 60° = 30°이다.'], ['∠AOP', '90-60', '∠AOP = 90° − ∠YOP = 90° − 60° = 30°이다.'], ['∠POQ', '60+60-90', '∠POQ = ∠XOQ + ∠YOP − 90° = 60° + 60° − 90° = 30°이다.']]);
      const rows = ['점 O를 중심으로 하는 원을 그려 반직선 OA, OB와의 교점을 각각 X, Y라 한다.', `점 X를 중심으로 하고 반지름의 길이가 ${sg('OX')}인 원을 그려 ${s[0]}의 원과의 교점을 Q라 한다.`, `점 Y를 중심으로 하고 반지름의 길이가 ${sg('OY')}인 원을 그려 ${s[0]}의 원과의 교점을 P라 한다.`, '반직선 OP, OQ를 긋는다.'];
      return N(`그림은 ∠AOB = 90°일 때 다음 순서로 작도한 것이다. ${ask}의 크기는 몇 도인가?`, 30, {
        unit: '°', figure: pic.svg('직각인 ∠AOB. 반직선 OA는 위쪽으로, 반직선 OB는 오른쪽으로 나간다. 점 O를 중심으로 하는 호가 반직선 OA와 점 X에서, 반직선 OB와 점 Y에서 만난다. 이 호 위에 점 Y에서 가까운 차례로 두 점 Q, P가 있고, 점 Q와 점 P를 지나는 짧은 호가 하나씩 있다. 반직선 OP와 반직선 OQ가 그어져 있다.', { k: 36 }) + tagged(rows, s),
        explain: `점 Q는 ${s[0]}의 원 위에 있으므로 ${eqs('OX', 'OQ')}이고, ${s[1]}의 원 위에 있으므로 ${eqs('XQ', 'OX')}이다. △OXQ는 세 변의 길이가 같은 정삼각형이므로 ∠XOQ = 60°이다. 같은 방법으로 △OYP도 정삼각형이고 ∠YOP = 60°이다. 따라서 ${tail}`,
        facts: { calc: [[calc, 0]], unseen: [60] }
      });
    }, { standard: STD3 }),
    H('hard-quad-pairs', '두 대각선을 그은 사각형에서 합동인 삼각형 모두 찾기', '심30', (d, n) => {
      // 한 합동에서 얻은 변이나 각을 다음 합동의 조건으로 써야 세 쌍을 모두 찾는다. 차례 0 은 SAS → SSS, 차례 1 은 SSS → ASA 이다.
      const pts = { A: [-1.45, 2.5], D: [1.45, 2.5], B: [-2.65, 0], C: [2.65, 0] }, tri = (x, y) => `△${x} ≡ △${y}`, cant = (x, y) => `${sg(x)}와 ${sg(y)}의 길이가 같다고 할 수 없다.`;
      pts.O = meet(pts.A, sub(pts.C, pts.A), pts.B, sub(pts.D, pts.B));
      const no = d.shuffle([[tri('AOD', 'COB'), false, cant('AO', 'CO')], [tri('ABO', 'ADO'), false, cant('BO', 'DO')], [tri('ABD', 'BAC'), false, cant('AD', 'BC')]]).slice(0, 2);
      const rows = d.shuffle([[tri('AOB', 'DOC'), true], [tri('ABD', 'DCA'), true], [tri('ABC', 'DCB'), true]].concat(no)), ask = '다음 중 서로 합동인 두 삼각형을 바르게 나타낸 것을 모두 고른 것은?';
      const wrong = rows.map((r, i) => (r[1] ? '' : `${SYM[i]}: ${r[2]}`)).filter(Boolean).join(' '), base = '사각형 ABCD와 두 대각선 AC, BD. 점 A는 왼쪽 위, 점 D는 오른쪽 위, 점 B는 왼쪽 아래, 점 C는 오른쪽 아래에 있고, 변 AD는 변 BC보다 짧다. 두 대각선이 점 O에서 만난다. ';
      if (n === 0) {
        return allQ(d, `그림의 사각형 ABCD에서 두 대각선의 교점을 O라 하자. ${eqs('AO', 'DO')}, ${eqs('BO', 'CO')}일 때, ${ask}`, SYM, rows.map((r) => r[1]), {
          figure: shape({ pts, segs: ['AB', 'BC', 'CD', 'AD', 'AC', 'BD'], ticks: { AO: 1, DO: 1, BO: 2, CO: 2 } }).svg(base + '선분 AO와 선분 DO에 같은 표시(한 줄), 선분 BO와 선분 CO에 같은 표시(두 줄)가 있다.') + tagged(rows.map((r) => r[0]), SYM),
          explain: `△AOB와 △DOC에서 ${eqs('AO', 'DO')}, ${eqs('BO', 'CO')}, ∠AOB = ∠DOC(맞꼭지각)이므로 △AOB ≡ △DOC (SAS 합동)이고 ${eqs('AB', 'DC')}이다. 또 ${sg('AC')} = ${sg('AO')} + ${sg('CO')} = ${sg('DO')} + ${sg('BO')} = ${sg('DB')}이다. △ABD와 △DCA에서 ${eqs('AB', 'DC')}, ${eqs('BD', 'CA')}, ${sg('AD')}는 공통이므로 △ABD ≡ △DCA (SSS 합동)이고, △ABC와 △DCB에서 ${eqs('AB', 'DC')}, ${eqs('AC', 'DB')}, ${sg('BC')}는 공통이므로 △ABC ≡ △DCB (SSS 합동)이다. ${wrong}`
        });
      }
      return allQ(d, `그림과 같이 ${sg('AD')} ∥ ${sg('BC')}인 사다리꼴 ABCD에서 두 대각선의 교점을 O라 하자. ${eqs('AB', 'DC')}, ${eqs('AC', 'DB')}일 때, ${ask}`, SYM, rows.map((r) => r[1]), {
        figure: shape({ pts, segs: ['AB', 'BC', 'CD', 'AD', 'AC', 'BD'], ticks: { AB: 1, DC: 1 } }).svg(base + '변 AB와 변 DC에 같은 표시(한 줄)가 있다.') + tagged(rows.map((r) => r[0]), SYM),
        explain: `△ABC와 △DCB에서 ${eqs('AB', 'DC')}, ${eqs('AC', 'DB')}, ${sg('BC')}는 공통이므로 △ABC ≡ △DCB (SSS 합동)이다. △ABD와 △DCA에서 ${eqs('AB', 'DC')}, ${eqs('BD', 'CA')}, ${sg('AD')}는 공통이므로 △ABD ≡ △DCA (SSS 합동)이다. 이 두 합동에서 ∠BAC = ∠CDB, ∠ABD = ∠DCA를 얻는다. △AOB와 △DOC에서 ${eqs('AB', 'DC')}이고 그 양 끝 각의 크기가 ∠BAO = ∠CDO, ∠ABO = ∠DCO로 각각 같으므로 △AOB ≡ △DOC (ASA 합동)이다. ${wrong}`
      });
    }, { count: 2 }),
    H('hard-fold', '직사각형 모양의 종이를 대각선으로 접을 때 삼각형의 넓이', '심37', (d) => {
      // 그림에 적힌 길이는 접혀 나온 삼각형 CDE 의 세 변뿐이다. 접은 변(CD = CF = AB)과 △ABE ≡ △CDE (ASA)에서 얻은 BE = DE 로 밑변과 높이를 만들어야 한다.
      const [x, h, y] = d.pick([[3, 4, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13], [9, 12, 15], [12, 16, 20]]), w = x + y, f = 6.3 / w;
      const pts = { A: [0, h * f], F: [w * f, h * f], B: [0, 0], C: [w * f, 0], E: [x * f, 0], D: [x * w / y * f, -h * x / y * f] };
      return N(`그림과 같이 직사각형 모양의 종이 ABCF를 대각선 AC를 접는 선으로 하여 접었더니 꼭짓점 F가 점 D에 놓였다. 선분 AD와 변 BC의 교점을 E라 하자. ${sg('DE')} = ${cm(x)}, ${sg('CD')} = ${cm(h)}, ${sg('EC')} = ${cm(y)}일 때, △ABC의 넓이는 몇 cm²인가?`, h * w / 2, {
        unit: 'cm²', figure: shape({ pts, segs: ['AB', 'BC', 'AC', 'AD', 'CD'], dash: ['AF', 'FC'], lens: { DE: cm(x), CD: cm(h), EC: cm(y) }, away: { DE: pts.C, CD: pts.E, EC: pts.D }, dirs: { E: [-0.7, -1] } })
          .svg(`직사각형 ABCF. 점 A는 왼쪽 위, 점 F는 오른쪽 위, 점 B는 왼쪽 아래, 점 C는 오른쪽 아래에 있다. 대각선 AC를 접는 선으로 하여 접어, 꼭짓점 F가 변 BC의 아래쪽에 있는 점 D에 놓였다. 접기 전의 변 AF와 변 FC는 점선으로 그려져 있다. 선분 AD와 변 BC가 점 E에서 만난다. 선분 DE의 길이는 ${cm(x)}, 선분 CD의 길이는 ${cm(h)}, 선분 EC의 길이는 ${cm(y)}.`, { maxH: 240 }),
        explain: `접은 것이므로 △ADC ≡ △AFC이고 ${sg('CD')} = ${sg('CF')} = ${sg('AB')} = ${cm(h)}, ∠ADC = ∠AFC = 90°이다. △ABE와 △CDE에서 ∠ABE = ∠CDE = 90°, ∠AEB = ∠CED(맞꼭지각)이므로 나머지 한 각의 크기도 같아 ∠BAE = ∠DCE이다. ${eqs('AB', 'CD')}이고 그 양 끝 각의 크기가 각각 같으므로 △ABE ≡ △CDE (ASA 합동)이다. 따라서 ${sg('BE')} = ${sg('DE')} = ${cm(x)}, ${sg('BC')} = ${x} + ${y} = ${w} (cm)이고, △ABC의 넓이는 ${w} × ${h} ÷ 2 = ${h * w / 2} (cm²)이다.`,
        facts: { calc: [[`(${x}+${y})*${h}/2`, 0]], unseen: [2] }
      });
    }),
    H('hard-tilted-square', '한 꼭짓점을 함께 가진 기울어진 정사각형: 보조선을 그어 삼각형의 넓이 구하기', '심39', (d) => {
      // 기울어진 정사각형의 한 변의 길이는 답에 쓰이지 않는다. 선분 FB 를 그어 △FBC ≡ △GDC (SAS: 끼인각은 90°에서 같은 각을 뺀 각)를 찾아야 밑변과 높이를 아는 삼각형으로 옮길 수 있다.
      const [s, t] = d.pick([[4, 5], [8, 10], [12, 13], [12, 15], [16, 20]]), m = Math.sqrt(t * t - s * s), f = 6.1 / (2 * s);
      const raw = { A: [0, s], D: [s, s], B: [0, 0], C: [s, 0], F: [s - m, s], G: [2 * s, m], E: [2 * s - m, s + m] }, pts = {};
      Object.keys(raw).forEach((name) => { pts[name] = [raw[name][0] * f, raw[name][1] * f]; });
      return N(`그림과 같이 한 변의 길이가 각각 ${cm(s)}, ${cm(t)}인 두 정사각형 ABCD, EFCG가 있다. 정사각형 EFCG의 꼭짓점 F가 변 AD 위에 있을 때, △GDC의 넓이는 몇 cm²인가?`, s * s / 2, {
        unit: 'cm²', figure: shape({ pts, fills: ['GDC'], segs: ['AB', 'BC', 'CD', 'AD', 'FC', 'CG', 'GE', 'EF', 'GD'], lens: { BC: cm(s), GE: cm(t) }, away: { BC: pts.A, GE: pts.F } })
          .svg(`정사각형 ABCD. 점 A는 왼쪽 위, 점 D는 오른쪽 위, 점 B는 왼쪽 아래, 점 C는 오른쪽 아래에 있다. 꼭짓점 C를 함께 가진 정사각형 EFCG가 오른쪽 위로 기울어져 놓여 있고, 그 꼭짓점 F는 변 AD 위에, 꼭짓점 G는 정사각형 ABCD의 오른쪽 바깥에 있다. 삼각형 GDC가 색칠되어 있다. 변 BC의 길이는 ${cm(s)}, 변 GE의 길이는 ${cm(t)}.`, { maxH: 240 }),
        explain: `선분 FB를 긋는다. △FBC와 △GDC에서 ${eqs('FC', 'GC')}, ${eqs('BC', 'DC')}이고 ∠FCB = 90° − ∠DCF = ∠GCD이므로 △FBC ≡ △GDC (SAS 합동)이다. 점 F가 변 AD 위에 있으므로 △FBC는 밑변의 길이가 ${sg('BC')} = ${cm(s)}, 높이가 ${sg('AB')} = ${cm(s)}인 삼각형이고 넓이는 ${s} × ${s} ÷ 2 = ${s * s / 2} (cm²)이다. 따라서 △GDC의 넓이도 ${s * s / 2} cm²이다.`,
        facts: { calc: [[`${s}*${s}/2`, 0]], unseen: [2] }
      });
    }),
    H('hard-inner-tri', '정삼각형의 세 선분이 만드는 삼각형: 합동을 두 번 쓰는 설명의 빈칸', '심42', (d) => {
      const x = d.pick([0.25, 0.28]), P = equiPts(4.7);
      P.D = lerp(P.A, P.B, x); P.E = lerp(P.B, P.C, x); P.F = lerp(P.C, P.A, x);
      P.P = meet(P.A, sub(P.E, P.A), P.C, sub(P.D, P.C)); P.Q = meet(P.A, sub(P.E, P.A), P.B, sub(P.F, P.B)); P.R = meet(P.B, sub(P.F, P.B), P.C, sub(P.D, P.C));
      const rows = [`△ABE, △BCF, △CAD에서 ${eqs('AB', 'BC')} = ${sg('CA')}, ${eqs('BE', 'CF')} = ${sg('AD')}, ∠ABE = ∠BCF = ∠CAD = 60°`, `이므로 세 삼각형은 서로 합동이다(${BLK[0]} 합동). 따라서 ∠BAE = ∠CBF = ∠ACD이다.`,
        `△ABQ, △BCR, △CAP에서 ${eqs('AB', 'BC')} = ${sg('CA')}, ∠BAQ = ∠CBR = ∠ACP, ∠ABQ = ∠BCR = ∠CAP`, `이므로 세 삼각형은 서로 합동이다(${BLK[1]} 합동). 따라서 ${eqs('AQ', 'BR')} = ${sg('CP')}, ${eqs('BQ', 'CR')} = ${BLK[2]}이다.`,
        `${sg('PQ')} = ${sg('AQ')} − ${sg('AP')}, ${sg('QR')} = ${sg('BR')} − ${sg('BQ')}, ${sg('RP')} = ${sg('CP')} − ${sg('CR')}이므로 △PQR는 세 변의 길이가 같은 정삼각형이다.`];
      const opt = (a, b, c) => `${a}, ${b}, ${sg(c)}`;
      return pickOne(d, `다음은 그림의 정삼각형 ABC에서 ${eqs('AD', 'BE')} = ${sg('CF')}일 때, 세 선분 AE, BF, CD로 둘러싸인 △PQR가 정삼각형임을 설명하는 과정이다. ${BLK.join(', ')}에 알맞은 것을 차례로 나열한 것은?`, opt('SAS', 'ASA', 'AP'), [opt('SAS', 'SAS', 'AP'), opt('SAS', 'ASA', 'AQ'), opt('ASA', 'SAS', 'AP')], {
        figure: shape({ pts: P, segs: ['AB', 'BC', 'AC', 'AE', 'BF', 'CD'], ticks: { AD: 1, BE: 1, CF: 1 } })
          .svg('정삼각형 ABC. 점 A는 위, 점 B는 왼쪽 아래, 점 C는 오른쪽 아래에 있다. 변 AB 위에 점 D, 변 BC 위에 점 E, 변 CA 위에 점 F가 있고 선분 AD, BE, CF에 같은 표시가 있다. 선분 AE와 선분 CD가 점 P에서, 선분 AE와 선분 BF가 점 Q에서, 선분 BF와 선분 CD가 점 R에서 만나 가운데에 삼각형 PQR가 생긴다.', { k: 42, maxH: 240 }) + lines(rows),
        explain: `△ABE, △BCF, △CAD는 대응하는 두 변의 길이가 각각 같고 그 끼인각의 크기가 60°로 같으므로 SAS 합동이다. 이 합동에서 ∠BAE = ∠CBF = ∠ACD를 얻고, ∠ABQ, ∠BCR, ∠CAP는 60°에서 이 각을 뺀 각이므로 크기가 서로 같다. △ABQ, △BCR, △CAP는 대응하는 한 변의 길이가 같고 그 양 끝 각의 크기가 각각 같으므로 ASA 합동이다. 꼭짓점 A와 B와 C, B와 C와 A, Q와 R와 P가 각각 대응하므로 ${sg('BQ')}의 대응변은 ${sg('CR')}, ${sg('AP')}이다.`
      });
    }),
    H('hard-square-sum', '정사각형의 두 변 위에 같은 길이로 잡은 두 점: 따로 구할 수 없는 두 각의 크기의 합', '심48', (d) => {
      // ∠GAD 와 ∠GFD 는 따로 정해지지 않는다. △ABE ≡ △BCF (SAS)에서 ∠AGB = 90°를 얻은 다음, 사각형 AGFD 의 네 각의 크기의 합을 써야 한다.
      const u = 3.7, pts = squarePts(u), cut = u * Math.tan(d.pick([22, 27, 32]) * RAD);
      pts.E = [cut, 0]; pts.F = [u, cut]; pts.G = meet(pts.A, sub(pts.E, pts.A), pts.B, pts.F);
      return N(`그림의 정사각형 ABCD에서 ${eqs('BE', 'CF')}이다. 선분 AE와 선분 BF의 교점을 G라 할 때, ∠GAD + ∠GFD의 크기는 몇 도인가?`, 180, {
        unit: '°', figure: shape({ pts, segs: ['AB', 'BC', 'CD', 'AD', 'AE', 'BF'], ticks: { BE: 1, CF: 1 }, dirs: { E: [0, -1], F: [1, 0], G: [1, 0.25] } }).svg(SQUARE + '변 BC 위에 점 E, 변 CD 위에 점 F가 있고 선분 BE와 선분 CF에 같은 표시가 있다. 선분 AE와 선분 BF가 점 G에서 만난다. 각의 크기는 적혀 있지 않다.'),
        explain: `△ABE와 △BCF에서 ${eqs('AB', 'BC')}, ${eqs('BE', 'CF')}, ∠ABE = ∠BCF = 90°이므로 △ABE ≡ △BCF (SAS 합동)이고 ∠BAE = ∠CBF이다. △ABG에서 ∠BAG + ∠ABG = ∠CBF + ∠ABG = 90°이므로 ∠AGB = 90°이고 ∠AGF = 180° − 90° = 90°이다. 사각형 AGFD의 네 각의 크기의 합은 360°이고 ∠AGF = ∠ADF = 90°이므로 ∠GAD + ∠GFD = 360° − (90° + 90°) = 180°이다.`,
        facts: { calc: [['360-(90+90)', 0]], unseen: [360, 90] }
      });
    }),
    H('hard-diagonal-point', '정사각형의 대각선 위의 점: 합동을 이어 써서 각의 크기 구하기', '심49', (d) => {
      // 대각선 BD 가 ∠ABC 를 이등분한다는 것부터 △ABD ≡ △CBD (SSS)로 대야 △ABE ≡ △CBE (SAS)가 선다.
      const u = 3.3, phi = d.pick([24, 26, 27, 28, 29, 31, 32, 33]), tn = Math.tan(phi * RAD), e = u / (1 + tn), pts = Object.assign(squarePts(u), { E: [e, e], F: [u / tn, 0] });
      return N(`그림의 정사각형 ABCD에서 점 E는 대각선 BD 위의 점이고, 점 F는 선분 AE의 연장선과 변 BC의 연장선의 교점이다. ∠AFB = ${phi}°일 때, ∠BCE의 크기는 몇 도인가?`, 90 - phi, {
        unit: '°', figure: shape({ pts, segs: ['AB', 'BF', 'CD', 'AD', 'BD', 'AF', 'CE'], angs: [['AFB', phi + '°']] }).svg(SQUARE + `대각선 BD 위에 점 E가 있다. 선분 AE를 점 E 너머로 늘인 선과 변 BC를 점 C 너머로 늘인 선이 점 F에서 만난다. 선분 CE가 그어져 있다. ∠AFB의 크기는 ${phi}°.`),
        explain: `△ABD와 △CBD에서 ${eqs('AB', 'CB')}, ${eqs('AD', 'CD')}, ${sg('BD')}는 공통이므로 △ABD ≡ △CBD (SSS 합동)이고 ∠ABD = ∠CBD이다. △ABE와 △CBE에서 ${eqs('AB', 'CB')}, ${sg('BE')}는 공통, ∠ABE = ∠CBE이므로 △ABE ≡ △CBE (SAS 합동)이고 ∠BCE = ∠BAE이다. △ABF에서 ∠BAF = 180° − (90° + ${phi}°) = ${90 - phi}°이므로 ∠BCE = ${90 - phi}°이다.`,
        facts: { calc: [[`180-(90+${phi})`, 0]], unseen: [180, 90] }
      });
    }),
    H('hard-square-45', '정사각형 안의 45°: 변을 늘여 합동인 삼각형을 만들기', '심51', (d, n) => {
      // 그림 안에는 합동인 삼각형이 없다. 변 CB 의 연장선 위에 BG = DF 인 점 G 를 잡아 △ABG ≡ △ADF (SAS), 이어서 △AGE ≡ △AFE (SAS)를 만들어야 한다.
      const al = d.pick(n === 0 ? [62, 66, 70, 72] : [60, 65, 70, 75]), be = 90 - al, u = 3.9, pts = Object.assign(squarePts(u), { E: [u * Math.tan(be * RAD), 0], F: [u, u - u * Math.tan((45 - be) * RAD)] });
      const figure = shape({ pts, segs: ['AB', 'BC', 'CD', 'AD', 'AE', 'EF', 'AF'], angs: [['EAF', '45°'], ['AEF', al + '°']], dirs: { E: [0, -1], F: [1, 0] } }).svg(SQUARE + `변 BC 위에 점 E, 변 CD 위에 점 F가 있고 삼각형 AEF가 그려져 있다. ∠EAF의 크기는 45°, ∠AEF의 크기는 ${al}°.`, { k: 40 });
      const head = `변 CB의 연장선 위에 ${eqs('BG', 'DF')}인 점 G를 잡는다. △ABG와 △ADF에서 ${eqs('AB', 'AD')}, ${eqs('BG', 'DF')}, ∠ABG = ∠ADF = 90°이므로 △ABG ≡ △ADF (SAS 합동)이고 ${eqs('AG', 'AF')}, ∠BAG = ∠DAF이다. ∠GAE = ∠BAG + ∠BAE = ∠DAF + ∠BAE = 90° − 45° = 45°이므로, △AGE와 △AFE에서 ${eqs('AG', 'AF')}, ${sg('AE')}는 공통, ∠GAE = ∠FAE이다. 따라서 △AGE ≡ △AFE (SAS 합동)이다.`;
      if (n === 0) {
        return N(`그림의 정사각형 ABCD에서 변 BC 위의 점 E와 변 CD 위의 점 F에 대하여 ∠EAF = 45°, ∠AEF = ${al}°일 때, ∠FEC의 크기는 몇 도인가?`, 180 - 2 * al, {
          unit: '°', figure, explain: `${head} ∠AEG = ∠AEF = ${al}°이므로 ∠FEC = 180° − (${al}° + ${al}°) = ${180 - 2 * al}°이다.`, facts: { calc: [[`180-(${al}+${al})`, 0]], unseen: [180] }
        });
      }
      return N(`그림의 정사각형 ABCD에서 변 BC 위의 점 E와 변 CD 위의 점 F에 대하여 ∠EAF = 45°, ∠AEF = ${al}°일 때, ∠AFD의 크기는 몇 도인가?`, 135 - al, {
        unit: '°', figure, explain: `${head} △AEF에서 ∠AFE = 180° − (45° + ${al}°) = ${135 - al}°이고 ∠AGE = ∠AFE = ${135 - al}°이다. ∠AFD의 대응각은 ∠AGB이므로 ∠AFD = ${135 - al}°이다.`, facts: { calc: [[`180-(45+${al})`, 0]], unseen: [180] }
      });
    }, { count: 2 })
  ]);
  B.addTypes(UNIT, 'find', [
    T('find-bisector-feet', '각의 이등분선 위의 점에서 두 변에 내린 수선: 옳지 않은 것', '②50', (d) => {
      // 직각이 둘이므로 나머지 한 각의 크기가 같다. 공통인 변 OP 의 양 끝 각이 각각 같아 ASA 합동이다(직각삼각형의 합동 조건의 이름은 쓰지 않는다).
      const th = d.pick([19, 22, 25]), O = [0, 0], reach = 3.5 * Math.cos(th * RAD), pts = { O, X: polar(O, 4.35, 2 * th), A: polar(O, reach, 2 * th), P: polar(O, 3.5, th), B: [reach, 0], Y: [4.35, 0] };
      const pic = new Pic().seg(pts.X, polar(O, 4.8, 2 * th)).seg(pts.Y, [4.8, 0]).seg(O, polar(O, 4.6, th));
      shape({ pts, segs: ['OX', 'OY', 'PA', 'PB'], angs: [['OAP', '', 'right'], ['OBP', '', 'right'], ['AOP', '', 'dot'], ['POB', '', 'dot']], dots: 'XY', dirs: { X: [-Math.sin(2 * th * RAD), Math.cos(2 * th * RAD)] } }, pic);
      const yes = d.shuffle([eqs('OA', 'OB'), eqs('PA', 'PB'), '∠APO = ∠BPO', '△AOP ≡ △BOP']).slice(0, 3);
      const bad = d.pick([['∠APO = ∠PBO', '∠APO의 대응각은 ∠BPO이다. ∠PBO는 직각이다.'], [eqs('OA', 'OP'), `${sg('OA')}의 대응변은 ${sg('OB')}이다. ${sg('OA')}와 ${sg('OP')}의 길이는 같다고 할 수 없다.`], [eqs('PA', 'OB'), `${sg('PA')}의 대응변은 ${sg('PB')}이다. ${sg('PA')}와 ${sg('OB')}의 길이는 같다고 할 수 없다.`]]);
      return pickOne(d, '그림에서 반직선 OP는 ∠XOY의 이등분선이다. 점 P에서 두 반직선 OX, OY에 내린 수선의 발을 각각 A, B라 할 때, 다음 중 옳지 않은 것은?', bad[0], yes, {
        figure: pic.svg('점 O에서 나간 두 반직선 OX, OY가 있다. 반직선 OY는 오른쪽으로, 반직선 OX는 오른쪽 위로 나간다. 그 사이에 반직선 OP가 있고, ∠XOP와 ∠POY에 같은 표시(점)가 있다. 점 P에서 반직선 OX에 그은 선분 PA와 반직선 OY에 그은 선분 PB가 있고, 점 A와 점 B에 직각 표시가 있다.'),
        explain: `△AOP와 △BOP에서 ∠AOP = ∠BOP이고 ∠OAP = ∠OBP = 90°이므로 나머지 한 각의 크기도 같아 ∠APO = ∠BPO이다. ${sg('OP')}는 공통이고 그 양 끝 각의 크기가 각각 같으므로 △AOP ≡ △BOP (ASA 합동)이다. 따라서 ${eqs('OA', 'OB')}, ${eqs('PA', 'PB')}이다. ${bad[1]}`
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
