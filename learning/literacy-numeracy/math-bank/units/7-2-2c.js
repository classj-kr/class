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
})(typeof window !== 'undefined' ? window : globalThis);
