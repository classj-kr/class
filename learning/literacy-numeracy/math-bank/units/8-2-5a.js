// 중학교 2학년 2학기 5단원 피타고라스 정리 — 단원 틀·그림 도구와 앞쪽 묶음
// (피타고라스 정리(한 변의 길이), 피타고라스 정리를 두 번 쓰기, 정사각형의 넓이와 피타고라스 정리).
// 수집해 둔 교과서 3종(미래엔 황선욱 2015·2022, 천재 김동재·김화경)의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1: 66꼴, 심화꼴: 48꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 뺌(까닭) / 겹침」을 가른 대조표는 references/textbooks/수학/_분석/8-2-5/싣기_대조표.md 에 있다.
// (정당화 그림·직각삼각형이 되는 조건·넓이와 닮음·반원·활용 묶음은 8-2-5b.js 에, 실력 문항은 8-2-5c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
// 영역은 도형과 측정. 성취기준은 9수03-15(피타고라스 정리를 이해하고 정당화할 수 있다)이다.
// 해설: 「피타고라스 정리는 다양한 활동을 통하여 추측하고 정당화할 수 있게 한다. 피타고라스 정리의 역은 직관적으로 이해하게 하고,
//       이를 이용하여 세 변의 길이가 주어진 삼각형이 직각삼각형인지 판별하게 한다.」
//
// 싣는 기준
//  - 제곱근은 중3에서 배운다. 길이는 자연수(피타고라스 수)이거나 닮음에서 나오는 분수이고, 자연수가 아닌 길이는 제곱한 값(x²의 값)·정사각형의 넓이·반원의 넓이로만 묻는다.
//    풀이도 「x² = 100이고 10² = 100이므로 x = 10」처럼 제곱수를 찾아 적는다(근호를 쓰지 않는다).
//  - 하는 일이 다르면 다른 문제다: 주는 것(두 변 / 넓이 / 비 / 정사각형의 넓이), 묻는 것(변 / 제곱한 값 / 넓이 / 둘레), 푸는 길(한 번 / 수선을 그어 한 번 / 두 번 / 넓이로 거꾸로)이 다르면 따로 싣는다.
//    직각삼각형의 수만 바꾼 것, 그림의 이름만 바꾼 것은 한 유형이다.
//  - 그림은 수치대로 그린다. 코드가 길이에서 좌표를 셈해 그리므로 그림과 답이 어긋나지 않는다. 그림 설명(aria-label)에는 그림에 적힌 것을 말로 적는다.
//  - 답: 길이는 「□ cm」, x의 값·제곱한 값은 수만, 넓이는 「□ cm²」, π가 드는 넓이는 「□π cm²」의 계수, 길이·넓이가 분수이면 분수 칸(크기가 같은 분수를 모두 받는다).
//    직각삼각형인 것·옳은 설명은 고르기. 부호 단추는 달지 않는다.
//  - 초등·중1에서 배운 직사각형·마름모·사다리꼴·원의 넓이, 원뿔·구의 뜻과 중2 앞 단원의 이등변삼각형·평행사변형·마름모의 성질, 닮음, 외심·무게중심은 쓴다.
//  - 꼴 목록에 적힌 원문 답지의 잘못(미래엔 2015 표준 11·21, 2022 소단원 마무리 정답줄 등)은 따르지 않는다. 답은 모두 코드가 셈한다.
//
// 뺀 것과 까닭(8-2-5b.js, 8-2-5c.js 의 것까지 여기에 모아 적는다)
//  - 교육과정 밖: 예각삼각형·둔각삼각형 판별(①41·42 심28·29 — 2022 교육과정은 「직각삼각형인지 판별」까지이다. ①42는 반원에 대한 원주각(중3)도 쓴다),
//    주어진 넓이와 답에 √3이 든 것(심21 — 제곱근은 중3),
//    각의 이등분선이 나눈 변의 비를 써야 하는데 2015 자료에만 나오는 것(①50 — 2022 교육과정에는 이 정리가 없다. 2022 자료에 나오는 심8은 합동과 닮음으로 푸는 실력 문항으로 실었다).
//  - 처음 지을 때 꼬임·요령·「한 유형만」·앞 단원의 일이라는 까닭으로 뺐다가 다시 실은 것(2026-10-13 — 문제은행은 실력을 기르는 곳이므로 여러 단계를 잇는 문제도 싣는다):
//    실력에 대각선으로 접은 종이(심39 ①65), 정삼각형 안의 점과 합동으로 옮긴 변(심30), 대각선에 수직인 선분(심34), 직각 하나를 더 준 직사각형 안의 점(심42), 엇갈려 이은 두 선분(심43),
//    빗변의 삼등분점(심44), 수직으로 만나는 두 선분과 길이의 비(심45), 정사각형 종이 접기(심40), 원기둥의 옆면을 도는 길(심48), 부채꼴로 만든 원뿔의 부피(①61), 수선의 발에서 다시 내린 수선(심33 — 세 길이 가운데 둘만 준다),
//    각의 이등분선이 있는 직각삼각형(심8). 기본에 이등변삼각형의 무게중심(심10), 두 변의 비와 합으로 구하는 반원의 넓이(심22).
//  - 수집본의 쪽 그림에서도 그림을 알 수 없는 것: 귀퉁이가 잘린 직사각형의 넓이(심7 — 어느 변에 어떤 수가 적혔는지 모른다), 세 반원 그림의 색칠한 부분의 둘레(①57 — 색칠한 곳을 모른다),
//    수선의 발이 나눈 빗변과 어두운 부분(심25 — 색칠한 곳을 모르고 원문 풀이도 어긋난다), 부러진 나무(①59 — 그림 속 수와 답을 모른다), 정사각형의 한 변을 빗변으로 하는 직각삼각형과 수선(①30 — ①44와 같은 일이기도 하다),
//    직육면체의 면 둘을 지나는 길(심46 — 모서리의 길이를 모른다), 정사각형의 대각선을 옮겨 가는 그림(①16의 변형), 초승달 둘과 삼각형을 함께 색칠한 그림(①53의 변형).
//  - 그림을 몰라 글이나 다른 상황으로 바꾸어 실은 것: 삼각형의 넓이로 빗변 위의 정사각형의 넓이 구하기(①26 — 글로만), 직각이등변삼각형의 빗변으로 한 변의 제곱 구하기(①15의 변형 — 글로만),
//    높이의 차로 만드는 직각삼각형(①58 — 자유투 그림 대신 높이가 다른 두 기둥, 답은 길이).
//  - 같은 일이어서 한 번만 실은 것: 심1(①13과), 심2(①17과), 심6(실력의 사다리꼴의 대각선과), 심15(①28이 그 넓이를 거쳐 간다), 심17(①32와), 심19(①33과), 심23(①51과), 심31(①44와),
//    심32·①46(①45와 — 빗변에서 수선의 발까지의 선분을 빼는 같은 일이다), 심35(①43·44를 좌표로 옮긴 것), 심36(①47과), 심37(①48과), 심47(①63과), ①27·29(심14와), ①37(①36과),
//    ①15의 변형(제곱한 값을 넘겨 쓰기 — 실력의 직각삼각형 사슬과), ①16(심4와), ①18의 변형(윗변이 더 긴 사다리꼴 — 실력의 사다리꼴의 대각선과 거울처럼 같은 일), ①40의 변형(세 변의 비로 삼각형의 종류 말하기 — ①36과),
//    ①63의 다른 수(면 둘을 지나는 길 — 면 셋을 지나는 길과), ①66의 변형(두 대각선이 수직인 등변사다리꼴), ①65(심39와 — 같은 닮음에서 다른 변을 구한다).
//  - 작도·서술형·활동: 정당화 전체를 쓰는 문제는 자료에 없다. 정당화 그림(네 직각삼각형과 정사각형, 합동인 두 직각삼각형, 유클리드의 그림)에서는 넓이·길이와 문장의 참·거짓만 묻는다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」 길이는 띄어 적는다(6 cm).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, N, M, C, F } = B.kit;
  const { V, sup, nb, SG, gcd } = B.kit.mid;
  const { r1, dirOf, dist, mid, XY, sv, TINT, WHITE, Board } = B.kit.mgeo;
  const UNIT = '8-2-5', STD = '9수03-15';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: (/[①②]/.test(ref) ? '수집본 기본 자료(' : '수집본 심화 자료(') + ref + ')', make }, more || {});

  // ── 수 ──
  // 피타고라스 수 [직각을 낀 두 변, 빗변]. DRAWN: 그림으로 그릴 것(너무 길쭉한 것은 뺀다)
  const TRIPLES = [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [9, 12, 15], [12, 16, 20], [7, 24, 25], [10, 24, 26], [15, 20, 25], [20, 21, 29], [18, 24, 30], [16, 30, 34], [9, 40, 41], [12, 35, 37]];
  const DRAWN = TRIPLES.filter(([a, b]) => b / a <= 2.5);
  // 직각을 낀 두 변의 차례를 섞어 고른다.
  const legsOf = (d, list) => { const [a, b, c] = d.pick(list || DRAWN); return d.bool() ? [a, b, c] : [b, a, c]; };
  // 한 변(높이 h)을 함께 가진 두 피타고라스 수: [h, u, v] — (u, h), (v, h)가 모두 직각을 낀 두 변이다(u < v).
  const SHARED = [[12, 5, 9], [12, 5, 16], [12, 9, 16], [8, 6, 15], [15, 8, 20], [24, 7, 10], [24, 10, 18], [24, 7, 18], [24, 18, 32], [20, 15, 21], [16, 12, 30]];
  const isSq = (n) => Number.isInteger(Math.sqrt(n)), rt = (n) => Math.round(Math.sqrt(n));

  // ── 글 ──
  const X = V('x'), Y = V('y'), seg = SG;
  const sq = (h) => nb(h + sup(2));             // 제곱: sq(X), sq(12), sq(seg('AB')) — 밑과 지수가 줄 끝에서 갈리지 않게 묶는다
  const cmL = (v) => v + ' cm', xL = (name) => sv(name) + ' cm';   // 그림 속 길이 글
  const HALF = frac(1, 2), PYTH = '피타고라스 정리에 의하여 ';

  // ── 답 ──
  const cmQ = (text, v, o) => N(text, v, Object.assign({ unit: 'cm' }, o));
  const areaQ = (text, v, o) => N(text, v, Object.assign({ unit: 'cm²' }, o));
  // π가 드는 넓이: 칸 뒤에 π와 단위를 붙여 계수만 받는다. 틀리면 「12π cm²」처럼 보인다.
  const piQ = (text, k, o) => Object.assign(N(text, k, Object.assign({}, o, { unit: 'π cm²' })), { shown: k + 'π cm²' });
  // 분수인 길이·넓이(p/q). 기약분수로 적어 두고 크기가 같은 분수를 모두 받는다.
  const fracQ = (text, p, q, unit, o) => { const g = gcd(p, q); if (q / g === 1) throw new Error('분수 답이 자연수가 되었다'); return F(text, p / g, q / g, Object.assign({}, o, { unit, improper: p > q, anyForm: true })); };

  // ── 그림 ──
  const cen = (pts) => [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];
  // 모형 좌표(y 는 위로 커진다)의 점들 { 이름: [x, y] }을 [가로, 세로] 안에 꼭 맞게 키워 화면 좌표로 옮긴다. extra: 크기를 잴 때만 쓰는 점들. 돌려주는 것에 배율 k 가 함께 들어 있다.
  function lay(model, size, extra) {
    const keys = Object.keys(model), all = keys.map((key) => model[key]).concat(extra || []), xs = all.map((p) => p[0]), ys = all.map((p) => p[1]);
    const k = Math.min(size[0] / (Math.max(...xs) - Math.min(...xs)), size[1] / (Math.max(...ys) - Math.min(...ys))), P = { k };
    for (const key of keys) P[key] = [model[key][0] * k, -model[key][1] * k];
    return P;
  }
  // 다각형 그림. model { 이름: [x, y] }, o.poly 다각형을 이루는 이름들(차례대로, 주지 않으면 모두), o.sides { 'AB': 글 } 변 옆(도형 바깥쪽)에 적을 글, o.at { 'AB': 변을 따라간 자리 },
  // o.right 직각 표시를 할 꼭짓점들, o.fill 칠, o.names: false 이면 이름을 적지 않는다, o.nameAt { 'A': 이름을 적을 쪽(도) }, o.size, o.extra
  function polyFig(model, o) {
    const opt = o || {}, keys = opt.poly || Object.keys(model), P = lay(model, opt.size || [170, 112], opt.extra), b = Board(), pts = keys.map((key) => P[key]), g = cen(pts), n = keys.length;
    b.poly(pts, opt.fill);
    for (const key of opt.right || []) { const i = keys.indexOf(key); b.corner(P[key], pts[(i + n - 1) % n], pts[(i + 1) % n], ''); }
    for (const pair of Object.keys(opt.sides || {})) b.beside(P[pair[0]], P[pair[1]], opt.sides[pair], g, opt.at && opt.at[pair] != null ? { t: opt.at[pair] } : undefined);
    if (opt.names !== false) keys.forEach((key) => b.name(P[key], key, opt.nameAt && opt.nameAt[key] != null ? opt.nameAt[key] : dirOf(g, P[key])));
    return { b, P, g };
  }
  // 직각삼각형: 직각을 낀 가로 변 p, 세로 변 q. o.flip 이면 직각이 왼쪽 아래(아니면 오른쪽 아래). 변 옆에 적을 글 o.base·o.vert·o.hyp
  function rightFig(p, q, o) {
    const P = lay(o.flip ? { R: [0, 0], H: [p, 0], V: [0, q] } : { H: [0, 0], R: [p, 0], V: [p, q] }, o.size || [150, 104]), b = Board(), g = cen([P.R, P.H, P.V]);
    b.poly([P.H, P.R, P.V]).corner(P.R, P.H, P.V, '');
    if (o.base) b.beside(P.H, P.R, o.base, g);
    if (o.vert) b.beside(P.R, P.V, o.vert, g);
    if (o.hyp) b.beside(P.H, P.V, o.hyp, g);
    return { b, P, g };
  }
  // 직각삼각형의 밑변 위의 점 D와 선분 TD: 직각 R, 위 꼭짓점 T, 먼 꼭짓점 F, RD = p, RT = q, DF = TD = c(같은 길이 표시). o.flip 이면 직각이 왼쪽. o.names { R, T, F, D }
  function splitFig(p, q, c, o) {
    const w = p + c, P = lay(o.flip ? { R: [0, 0], D: [p, 0], F: [w, 0], T: [0, q] } : { F: [0, 0], D: [c, 0], R: [w, 0], T: [w, q] }, o.size || [190, 104]), b = Board(), g = cen([P.F, P.R, P.T]), nm = o.names;
    b.poly([P.F, P.R, P.T]).seg(P.T, P.D).corner(P.R, P.F, P.T, '').tick(P.T, P.D).tick(P.D, P.F);
    b.name(P.R, nm.R, dirOf(g, P.R)).name(P.T, nm.T, dirOf(g, P.T)).name(P.F, nm.F, dirOf(g, P.F)).name(P.D, nm.D, 270);
    return { b, P, g };
  }
  // 선분 pq 를 한 변으로 하고 점 away 의 반대쪽에 놓이는 정사각형의 네 꼭짓점 [p, q, q 옆, p 옆](어느 좌표에서나 쓴다)
  function sqOn(p, q, away) {
    const L = dist(p, q), m = mid(p, q); let n = [-(q[1] - p[1]) / L, (q[0] - p[0]) / L];
    if ((away[0] - m[0]) * n[0] + (away[1] - m[1]) * n[1] > 0) n = [-n[0], -n[1]];
    return [p, q, [q[0] + n[0] * L, q[1] + n[1] * L], [p[0] + n[0] * L, p[1] + n[1] * L]];
  }
  // 선분 pq 를 지름으로 하고 점 away 의 반대쪽으로 볼록한 반원 위의 점들(어느 좌표에서나 쓴다 — 크기를 재는 데 쓴다)
  function semiPts(p, q, away) {
    const c = mid(p, q), r = dist(p, q) / 2, u = [(p[0] - c[0]) / r, (p[1] - c[1]) / r]; let w = [-u[1], u[0]];
    if ((away[0] - c[0]) * w[0] + (away[1] - c[1]) * w[1] > 0) w = [-w[0], -w[1]];
    return Array.from({ length: 13 }, (_, i) => { const t = Math.PI * i / 12; return [c[0] + r * (Math.cos(t) * u[0] + Math.sin(t) * w[0]), c[1] + r * (Math.cos(t) * u[1] + Math.sin(t) * w[1])]; });
  }
  // 화면 좌표에서 그 반원을 그린다(지름까지 닫힌 도형). 돌려주는 것: 가장 볼록한 점
  function semi(b, p, q, away, css) {
    const pts = semiPts(p, q, away), tip = pts[6], r = dist(p, q) / 2, turn = (q[0] - p[0]) * (tip[1] - p[1]) - (q[1] - p[1]) * (tip[0] - p[0]);
    b.shape(`M${XY(p)}A${r1(r)} ${r1(r)} 0 0 ${turn < 0 ? 1 : 0} ${XY(q)}Z`, pts, css);
    return tip;
  }
  // ∠A = 90°인 직각삼각형 ABC(A 가 위, BC 가 밑변)와 세 변 위의 정사각형. AB = c, AC = b(자연수가 아니어도 된다).
  // 정사각형의 이름: AB 위 ADEB, AC 위 ACGF, BC 위 BHIC. 돌려주는 것: 모형 좌표의 점들(lay 에 넘긴다)
  function euclidModel(c, b) {
    const a = Math.sqrt(b * b + c * c), A = [c * c / a, b * c / a], Bp = [0, 0], Cp = [a, 0];
    const s1 = sqOn(A, Bp, Cp), s2 = sqOn(A, Cp, Bp), s3 = sqOn(Bp, Cp, A);
    return { A, B: Bp, C: Cp, E: s1[2], D: s1[3], G: s2[2], F: s2[3], I: s3[2], H: s3[3], L: [A[0], 0], M: [A[0], -a] };
  }
  // 그 그림. o.show: 그릴 정사각형 'ADEB'·'ACGF'·'BHIC' 의 배열, o.fill { 정사각형: 칠 }, o.inside { 정사각형: 가운데에 적을 글 }, o.size
  function euclidFig(c, b, o) {
    const m = euclidModel(c, b), show = o.show || ['ADEB', 'ACGF', 'BHIC'], used = { A: m.A, B: m.B, C: m.C };
    for (const name of show) for (const key of name) used[key] = m[key];
    const P = lay(used, o.size || [196, 196]), board = Board(), g = cen([P.A, P.B, P.C]);
    for (const name of show) board.poly(name.split('').map((key) => P[key]), (o.fill || {})[name]);
    board.poly([P.A, P.B, P.C]).corner(P.A, P.B, P.C, '');
    for (const name of show) {
      const pts = name.split('').map((key) => P[key]), centre = cen(pts);
      for (const key of name) if (!'ABC'.includes(key)) board.name(P[key], key, dirOf(centre, P[key]), 9);
      if (o.inside && o.inside[name]) board.text(centre, o.inside[name], { blue: true });
    }
    // 삼각형의 꼭짓점 이름은 그 점에서 뻗은 선들 사이가 가장 넓게 빈 쪽에 적는다.
    const rays = { A: ['B', 'C', 'D', 'F'], B: ['A', 'C', 'E', 'H'], C: ['A', 'B', 'G', 'I'] };
    for (const key of ['B', 'C']) board.nameFree(P[key], key, rays[key].filter((other) => P[other]).map((other) => dirOf(P[key], P[other])));
    if (P.D && P.F) board.angle(P.A, dirOf(P.A, P.F), dirOf(P.A, P.D), 'A', { arc: false, ink: true }); else board.nameFree(P.A, 'A', rays.A.filter((other) => P[other]).map((other) => dirOf(P.A, P[other])));
    return { b: board, P, g, m };
  }
  // 정사각형 안에 글이 들어가는가(한 변의 길이 px 과 글)
  const fitsIn = (side, label) => side >= String(label).replace(/<[^>]+>/g, '').length * 7.4 + 8;

  B.addUnit({
    id: '8-2-5', grade: 8, semester: 2, no: 5, title: '피타고라스 정리', version: 2,
    groups: [
      {
        id: 'side', title: '피타고라스 정리(한 변의 길이)', standard: STD,
        types: [
          T('side-find', '두 변의 길이로 나머지 한 변의 길이 구하기', '①1', (d, n) => {
            const [p, q, c] = legsOf(d), flip = d.bool();
            if (n === 0) {
              const f = rightFig(p, q, { flip, base: cmL(p), vert: cmL(q), hyp: xL('x') });
              return N(`그림의 직각삼각형에서 ${X}의 값은?`, c, {
                figure: f.b.svg(`직각삼각형. 직각을 낀 두 변의 길이는 ${p} cm, ${q} cm이고 빗변의 길이는 x cm이다`),
                explain: `${PYTH}${sq(X)} = ${sq(p)} + ${sq(q)} = ${c * c}이다. ${sq(c)} = ${c * c}이고 ${X} &gt; 0이므로 ${X} = ${c}이다.`,
                facts: { calc: [[`(${p}**2+${q}**2)**0.5`, 0]], unseen: [2, 0.5], rule: 'hyp' }
              });
            }
            // 직각을 낀 한 변을 구한다.
            const askBase = d.bool(), known = askBase ? q : p, ans = askBase ? p : q;
            const f = rightFig(p, q, { flip, base: askBase ? xL('x') : cmL(p), vert: askBase ? cmL(q) : xL('x'), hyp: cmL(c) });
            return N(`그림의 직각삼각형에서 ${X}의 값은?`, ans, {
              figure: f.b.svg(`직각삼각형. 빗변의 길이는 ${c} cm이고 직각을 낀 두 변의 길이는 ${known} cm, x cm이다`),
              explain: `${PYTH}${sq(X)} + ${sq(known)} = ${sq(c)}이므로 ${sq(X)} = ${c * c} − ${known * known} = ${ans * ans}이다. ${sq(ans)} = ${ans * ans}이고 ${X} &gt; 0이므로 ${X} = ${ans}이다.`,
              facts: { calc: [[`(${c}**2-${known}**2)**0.5`, 0]], unseen: [2, 0.5], rule: 'leg' }
            });
          }, { count: 2 }),
          T('side-square', '한 변의 길이를 제곱한 값', '①2', (d, n) => {
            if (n === 0) {
              const [p, q] = d.until(() => [d.int(2, 9), d.int(2, 9)], ([a, b]) => a !== b && !isSq(a * a + b * b) && Math.max(a, b) / Math.min(a, b) <= 2.5);
              const f = rightFig(p, q, { flip: d.bool(), base: cmL(p), vert: cmL(q), hyp: xL('x') });
              return N(`그림의 직각삼각형에서 ${sq(X)}의 값은?`, p * p + q * q, {
                figure: f.b.svg(`직각삼각형. 직각을 낀 두 변의 길이는 ${p} cm, ${q} cm이고 빗변의 길이는 x cm이다`),
                explain: `${PYTH}${sq(X)} = ${sq(p)} + ${sq(q)} = ${p * p} + ${q * q} = ${p * p + q * q}이다.`,
                facts: { calc: [[`${p}**2+${q}**2`, 0]], unseen: [2], rule: 'hyp' }
              });
            }
            const [c, p] = d.until(() => [d.int(5, 13), d.int(2, 11)], ([h, a]) => a <= h - 2 && !isSq(h * h - a * a) && a * a >= 0.14 * h * h && a * a <= 0.86 * h * h);
            const q = Math.sqrt(c * c - p * p), askBase = d.bool();
            const f = askBase ? rightFig(q, p, { flip: d.bool(), base: xL('x'), vert: cmL(p), hyp: cmL(c) }) : rightFig(p, q, { flip: d.bool(), base: cmL(p), vert: xL('x'), hyp: cmL(c) });
            return N(`그림의 직각삼각형에서 ${sq(X)}의 값은?`, c * c - p * p, {
              figure: f.b.svg(`직각삼각형. 빗변의 길이는 ${c} cm이고 직각을 낀 두 변의 길이는 ${p} cm, x cm이다`),
              explain: `${PYTH}${sq(X)} + ${sq(p)} = ${sq(c)}이므로 ${sq(X)} = ${c * c} − ${p * p} = ${c * c - p * p}이다.`,
              facts: { calc: [[`${c}**2-${p}**2`, 0]], unseen: [2], rule: 'leg' }
            });
          }, { count: 2 }),
          T('side-iso-right', '직각이등변삼각형의 변의 길이를 제곱한 값', '①2·15', (d, n) => {
            if (n === 0) {
              const a = d.int(3, 12);
              return N(`∠A = 90°이고 ${seg('AB')} = ${seg('AC')} = ${a} cm인 직각이등변삼각형 ABC에서 ${sq(seg('BC'))}의 값은?`, 2 * a * a, {
                explain: `${PYTH}${sq(seg('BC'))} = ${sq(seg('AB'))} + ${sq(seg('AC'))} = ${sq(a)} + ${sq(a)} = ${2 * a * a}이다.`,
                facts: { calc: [[`${a}**2+${a}**2`, 0]], unseen: [2] }
              });
            }
            const c = 2 * d.int(2, 8);
            return N(`∠A = 90°이고 ${seg('AB')} = ${seg('AC')}인 직각이등변삼각형 ABC에서 ${seg('BC')} = ${c} cm일 때, ${sq(seg('AB'))}의 값은?`, c * c / 2, {
              explain: `${PYTH}${sq(seg('AB'))} + ${sq(seg('AC'))} = ${sq(seg('BC'))}이고 ${seg('AB')} = ${seg('AC')}이므로 2 × ${sq(seg('AB'))} = ${sq(c)} = ${c * c}이다. ${sq(seg('AB'))} = ${c * c / 2}이다.`,
              facts: { calc: [[`${c}**2/2`, 0]], unseen: [2] }
            });
          }, { count: 2 }),
          T('side-area', '한 변을 구해 직각삼각형의 넓이 구하기', '①3', (d) => {
            const [ac, bc, c] = legsOf(d), flip = d.bool();
            const f = polyFig(flip ? { A: [0, ac], C: [0, 0], B: [bc, 0] } : { A: [bc, ac], B: [0, 0], C: [bc, 0] }, { size: [160, 106], right: ['C'], sides: { AB: cmL(c), AC: cmL(ac) } });
            return areaQ(`그림과 같이 ∠C = 90°인 직각삼각형 ABC에서 ${seg('AB')} = ${c} cm, ${seg('AC')} = ${ac} cm일 때, △ABC의 넓이는?`, ac * bc / 2, {
              figure: f.b.svg(`직각삼각형 ABC. ∠C에 직각 표시가 있다. AB = ${c} cm, AC = ${ac} cm`),
              explain: `${PYTH}${sq(seg('BC'))} = ${sq(c)} − ${sq(ac)} = ${bc * bc}이므로 ${seg('BC')} = ${bc} cm이다. △ABC의 넓이는 ${HALF} × ${bc} × ${ac} = ${ac * bc / 2}(cm²)이다.`,
              facts: { calc: [[`(${c}**2-${ac}**2)**0.5*${ac}/2`, 0]], unseen: [2, 0.5] }
            });
          }),
          T('side-rect-diag', '직사각형의 대각선의 길이', '①4', (d) => {
            const [a, b, c] = d.pick(TRIPLES), p = Math.max(a, b), q = Math.min(a, b);
            return cmQ(`가로의 길이가 ${p} cm, 세로의 길이가 ${q} cm인 직사각형의 대각선의 길이는?`, c, {
              explain: `직사각형의 대각선은 가로와 세로를 직각을 낀 두 변으로 하는 직각삼각형의 빗변이다. ${sq(p)} + ${sq(q)} = ${c * c}이고 ${sq(c)} = ${c * c}이므로 대각선의 길이는 ${c} cm이다.`,
              facts: { calc: [[`(${p}**2+${q}**2)**0.5`, 0]], unseen: [2, 0.5] }
            });
          }),
          T('side-rect-ratio', '가로와 세로의 길이의 비와 대각선의 길이로 직사각형의 넓이 구하기', '①5', (d) => {
            const [a0, b0, c0] = d.pick([[3, 4, 5], [5, 12, 13], [8, 15, 17]]), [a, b] = d.bool() ? [a0, b0] : [b0, a0], t = d.int(2, 4), K = V('k');
            return areaQ(`가로의 길이와 세로의 길이의 비가 ${nb(`${a} : ${b}`)}이고 대각선의 길이가 ${c0 * t} cm인 직사각형의 넓이는?`, a * b * t * t, {
              explain: `가로의 길이를 ${a}${K} cm, 세로의 길이를 ${b}${K} cm라 하면 ${sq(`(${a}${K})`)} + ${sq(`(${b}${K})`)} = ${sq(c0 * t)}에서 ${c0 * c0}${sq(K)} = ${c0 * c0 * t * t}, ${sq(K)} = ${t * t}이다. 넓이는 ${a}${K} × ${b}${K} = ${a * b}${sq(K)} = ${a * b * t * t}(cm²)이다.`,
              facts: { calc: [[`${a}*${b}*${c0 * t}**2/(${a}**2+${b}**2)`, 0]], unseen: [2] }
            });
          }),
          T('side-iso-height', '이등변삼각형의 높이와 넓이', '①6', (d, n) => {
            const [half, h, s] = d.until(() => legsOf(d), ([a, b]) => b / (2 * a) >= 0.3 && b / (2 * a) <= 1.4), base = 2 * half;
            const f = polyFig({ A: [half, h], B: [0, 0], C: [base, 0] }, { size: [150, 112], sides: { AB: cmL(s), BC: cmL(base) }, at: { AB: 0.28 } });
            f.b.tick(f.P.A, f.P.B).tick(f.P.A, f.P.C);
            const figure = f.b.svg(`이등변삼각형 ABC. 변 AB와 변 AC에 길이가 같다는 표시가 있다. AB = ${s} cm, BC = ${base} cm`);
            const lead = `꼭짓점 A에서 변 BC에 내린 수선의 발을 H라 하면 이등변삼각형에서 이 수선은 밑변을 이등분하므로 ${seg('BH')} = ${half} cm이다. △ABH에서 ${sq(seg('AH'))} = ${sq(s)} − ${sq(half)} = ${h * h}이므로 ${seg('AH')} = ${h} cm이다.`;
            const head = `그림과 같이 ${seg('AB')} = ${seg('AC')} = ${s} cm, ${seg('BC')} = ${base} cm인 이등변삼각형 ABC`;
            if (n === 0) return cmQ(`${head}에서 변 BC를 밑변으로 할 때의 높이는?`, h, { figure, explain: lead, facts: { calc: [[`(${s}**2-(${base}/2)**2)**0.5`, 0]], unseen: [2, 0.5] } });
            return areaQ(`${head}의 넓이는?`, half * h, { figure, explain: `${lead} △ABC의 넓이는 ${HALF} × ${base} × ${h} = ${half * h}(cm²)이다.`, facts: { calc: [[`${base}*(${s}**2-(${base}/2)**2)**0.5/2`, 0]], unseen: [2, 0.5] } });
          }, { count: 2 }),
          T('side-iso-perimeter', '이등변삼각형의 밑변의 길이와 넓이로 둘레의 길이 구하기', '①7', (d) => {
            const [half, h, s] = d.until(() => legsOf(d, TRIPLES), ([a]) => a <= 20), base = 2 * half, area = half * h;
            return cmQ(`${seg('AB')} = ${seg('AC')}인 이등변삼각형 ABC에서 ${seg('BC')} = ${base} cm이고 넓이가 ${area} cm²일 때, △ABC의 둘레의 길이는?`, 2 * s + base, {
              explain: `꼭짓점 A에서 변 BC에 내린 수선의 발을 H라 하면 ${HALF} × ${base} × ${seg('AH')} = ${area}에서 ${seg('AH')} = ${h} cm이고, ${seg('BH')} = ${half} cm이다. △ABH에서 ${sq(seg('AB'))} = ${sq(half)} + ${sq(h)} = ${s * s}이므로 ${seg('AB')} = ${s} cm이다. 둘레의 길이는 ${s} + ${s} + ${base} = ${2 * s + base}(cm)이다.`,
              facts: { calc: [[`2*((2*${area}/${base})**2+(${base}/2)**2)**0.5+${base}`, 0]], unseen: [2, 0.5] }
            });
          }),
          T('side-rhombus-area', '마름모의 한 변과 한 대각선의 길이로 넓이 구하기', '①8', (d) => {
            const [a, h, s] = d.until(() => legsOf(d), ([u, v]) => u / v >= 0.55 && u / v <= 1.9);
            const P = lay({ A: [0, h], B: [-a, 0], C: [0, -h], D: [a, 0] }, [150, 124]), b = Board(), O = [0, 0];
            b.poly([P.A, P.B, P.C, P.D]).seg(P.A, P.C, 'thin').seg(P.B, P.D, 'thin').beside(P.A, P.B, cmL(s), O);
            b.name(P.A, 'A', 90).name(P.B, 'B', 180).name(P.C, 'C', 270).name(P.D, 'D', 0).nameFree(O, 'O', [0, 90, 180, 270]);
            return areaQ(`그림과 같은 마름모 ABCD에서 ${seg('AB')} = ${s} cm, ${seg('BD')} = ${2 * a} cm일 때, 마름모 ABCD의 넓이는?`, 2 * a * h, {
              figure: b.svg(`마름모 ABCD와 두 대각선 AC, BD. 두 대각선은 점 O에서 만난다. AB = ${s} cm`),
              explain: `마름모의 두 대각선은 서로를 수직이등분하므로 ${seg('BO')} = ${a} cm, ∠AOB = 90°이다. △ABO에서 ${sq(seg('AO'))} = ${sq(s)} − ${sq(a)} = ${h * h}이므로 ${seg('AO')} = ${h} cm, ${seg('AC')} = ${2 * h} cm이다. 넓이는 ${HALF} × ${2 * a} × ${2 * h} = ${2 * a * h}(cm²)이다.`,
              facts: { calc: [[`${2 * a}*2*(${s}**2-(${2 * a}/2)**2)**0.5/2`, 0]], unseen: [2, 0.5] }
            });
          }),
          T('side-rhombus-side', '마름모의 두 대각선의 길이로 한 변의 길이 구하기', '심5', (d) => {
            const [a, b, c] = d.pick(TRIPLES.filter((t) => t[2] <= 37)), p = 2 * Math.min(a, b), q = 2 * Math.max(a, b);
            return cmQ(`두 대각선의 길이가 각각 ${p} cm, ${q} cm인 마름모의 한 변의 길이는?`, c, {
              explain: `마름모의 두 대각선은 서로를 수직이등분하므로 마름모의 한 변은 직각을 낀 두 변의 길이가 ${p / 2} cm, ${q / 2} cm인 직각삼각형의 빗변이다. ${sq(p / 2)} + ${sq(q / 2)} = ${c * c}이고 ${sq(c)} = ${c * c}이므로 한 변의 길이는 ${c} cm이다.`,
              facts: { calc: [[`((${p}/2)**2+(${q}/2)**2)**0.5`, 0]], unseen: [2, 0.5] }
            });
          }),
          T('side-rect-rhombus', '직사각형 안의 마름모의 넓이', '①9', (d) => {
            // AB = h, QC = a, QD = BQ = c
            const [h, a, c] = d.pick([[8, 6, 10], [12, 5, 13], [4, 3, 5], [15, 8, 17], [12, 9, 15], [16, 12, 20], [24, 10, 26], [20, 15, 25]]), w = c + a;
            const f = polyFig({ A: [0, h], B: [0, 0], C: [w, 0], D: [w, h] }, { size: [196, 104], sides: { AB: cmL(h) } }), P = f.P, k = P.k, Pp = [a * k, -h * k], Q = [c * k, 0];
            f.b.poly([Pp, P.B, Q, P.D], TINT).beside(Q, P.C, cmL(a), f.g, { t: 0.56 }).name(Pp, 'P', 90).name(Q, 'Q', 238);
            return areaQ(`그림과 같은 직사각형 ABCD에서 □PBQD가 마름모가 되도록 두 변 AD, BC 위에 점 P, Q를 각각 잡았다. ${seg('AB')} = ${h} cm, ${seg('QC')} = ${a} cm일 때, □PBQD의 넓이는?`, c * h, {
              figure: f.b.svg(`직사각형 ABCD. 점 P는 변 AD 위에, 점 Q는 변 BC 위에 있고 사각형 PBQD가 색칠되어 있다. AB = ${h} cm, QC = ${a} cm`),
              explain: `△DQC에서 ${seg('DC')} = ${seg('AB')} = ${h} cm이므로 ${sq(seg('QD'))} = ${sq(a)} + ${sq(h)} = ${c * c}, ${seg('QD')} = ${c} cm이다. 마름모의 네 변의 길이는 같으므로 ${seg('BQ')} = ${c} cm이다. □PBQD의 넓이는 ${seg('BQ')} × ${seg('AB')} = ${c} × ${h} = ${c * h}(cm²)이다.`,
              facts: { calc: [[`(${h}**2+${a}**2)**0.5*${h}`, 0]], unseen: [2, 0.5] }
            });
          }),
          T('side-quarter-rect', '사분원 안의 직사각형의 넓이', '①10', (d) => {
            const make = () => {
              const [a, bb, R] = legsOf(d), k = 116 / R, b = Board(), O = [0, 0], A = [R * k, 0], Bp = [0, -R * k], Cp = [a * k, 0], D = [a * k, -bb * k], E = [0, -bb * k];
              b.fan(O, R * k, 0, 90).poly([O, Cp, D, E], TINT).corner(Cp, O, D, '').corner(E, D, O, '').corner(O, Cp, E, '');
              b.dim(O, Bp, cmL(R), [60, -40], 25).beside(O, Cp, cmL(a), D);
              b.name(O, 'O', 225).name(A, 'A', 300).name(Bp, 'B', 55).name(Cp, 'C', 270).name(D, 'D', 40).name(E, 'E', 180, 9);
              return { a, bb, R, b };
            };
            const v = d.until(make, (w) => !w.b.clash() && w.bb >= 0.3 * w.R && w.a >= 0.3 * w.R), { a, bb, R } = v;
            return areaQ(`그림과 같이 반지름의 길이가 ${R} cm인 사분원 안에 직사각형 OCDE가 있다. 점 C는 반지름 OA 위에, 점 E는 반지름 OB 위에, 점 D는 호 AB 위에 있고 ${seg('OC')} = ${a} cm일 때, □OCDE의 넓이는?`, a * bb, {
              figure: v.b.svg(`중심이 O이고 반지름의 길이가 ${R} cm인 사분원 OAB. 직사각형 OCDE가 색칠되어 있고, 점 C는 OA 위에, 점 E는 OB 위에, 점 D는 호 AB 위에 있다. OC = ${a} cm`),
              explain: `선분 OD를 그으면 ${seg('OD')}는 사분원의 반지름이므로 ${seg('OD')} = ${R} cm이다. △OCD에서 ${sq(seg('CD'))} = ${sq(R)} − ${sq(a)} = ${bb * bb}이므로 ${seg('CD')} = ${bb} cm이다. □OCDE의 넓이는 ${a} × ${bb} = ${a * bb}(cm²)이다.`,
              facts: { calc: [[`${a}*(${R}**2-${a}**2)**0.5`, 0]], unseen: [2, 0.5] }
            });
          }),
          T('side-area-back', '넓이로 한 변을 구한 뒤 길이가 같은 선분 구하기', '①12', (d) => {
            const [p, q, c] = d.until(() => legsOf(d), ([u, v, w]) => (u + w) / v <= 2.6), area = p * q / 2;
            const f = splitFig(p, q, c, { flip: d.bool(), names: { R: 'C', T: 'A', F: 'B', D: 'D' } });
            f.b.beside(f.P.R, f.P.T, cmL(q), f.g);
            return cmQ(`그림과 같이 ∠C = 90°인 직각삼각형 ABC의 변 BC 위에 ${seg('AD')} = ${seg('BD')}가 되도록 점 D를 잡았다. ${seg('AC')} = ${q} cm이고 △ADC의 넓이가 ${area} cm²일 때, ${seg('BD')}의 길이는?`, c, {
              figure: f.b.svg(`직각삼각형 ABC. ∠C에 직각 표시가 있고, 변 BC 위의 점 D와 꼭짓점 A를 이은 선분이 그어져 있다. 선분 AD와 선분 BD에 길이가 같다는 표시가 있다. AC = ${q} cm`),
              explain: `△ADC의 넓이가 ${area} cm²이므로 ${HALF} × ${seg('DC')} × ${q} = ${area}에서 ${seg('DC')} = ${p} cm이다. △ADC에서 ${sq(seg('AD'))} = ${sq(p)} + ${sq(q)} = ${c * c}이므로 ${seg('AD')} = ${c} cm이다. ${seg('BD')} = ${seg('AD')} = ${c} cm이다.`,
              facts: { calc: [[`((2*${area}/${q})**2+${q}**2)**0.5`, 0]], unseen: [2, 0.5] }
            });
          }),
          T('side-iso-attached', '빗변의 길이를 옮겨 변의 길이 구하기', '심3', (d) => {
            const w = d.until(() => { const [u, v, hyp] = legsOf(d), fig = splitFig(u, v, hyp, { flip: d.bool(), names: { R: 'B', T: 'A', F: 'C', D: 'D' } }); fig.b.beside(fig.P.R, fig.P.T, cmL(v), fig.g).beside(fig.P.R, fig.P.D, cmL(u), fig.g); return { p: u, q: v, c: hyp, f: fig }; }, (x) => (x.p + x.c) / x.q <= 2.6 && !x.f.b.clash());
            const { p, q, c, f } = w;
            return cmQ(`그림과 같이 ∠B = 90°인 직각삼각형 ABC의 변 BC 위에 ${seg('AD')} = ${seg('DC')}가 되도록 점 D를 잡았다. ${seg('AB')} = ${q} cm, ${seg('BD')} = ${p} cm일 때, ${seg('BC')}의 길이는?`, p + c, {
              figure: f.b.svg(`직각삼각형 ABC. ∠B에 직각 표시가 있고, 변 BC 위의 점 D와 꼭짓점 A를 이은 선분이 그어져 있다. 선분 AD와 선분 DC에 길이가 같다는 표시가 있다. AB = ${q} cm, BD = ${p} cm`),
              explain: `△ABD에서 ${sq(seg('AD'))} = ${sq(q)} + ${sq(p)} = ${c * c}이므로 ${seg('AD')} = ${c} cm이다. ${seg('DC')} = ${seg('AD')} = ${c} cm이므로 ${seg('BC')} = ${p} + ${c} = ${p + c}(cm)이다.`,
              facts: { calc: [[`${p}+(${q}**2+${p}**2)**0.5`, 0]], unseen: [2, 0.5] }
            });
          }),
          T('side-trapezoid', '사다리꼴에 수선을 그어 변의 길이 구하기', '①18', (d) => {
            const v = d.until(() => {
              const [u, h, c] = legsOf(d), a = d.int(3, 9), b = a + u;
              return { u, h, c, a, b, f: polyFig({ A: [0, h], B: [0, 0], C: [b, 0], D: [a, h] }, { size: [170, 118], right: ['A', 'B'], nameAt: { A: 140, D: 40 }, sides: { DA: cmL(a), AB: cmL(h), BC: cmL(b), CD: xL('x') } }) };
            }, (w) => w.b / w.h <= 2.2 && w.h / w.b <= 1.3 && !w.f.b.clash()), { u, h, c, a, b: bc, f } = v;
            return N(`그림과 같이 ∠A = ∠B = 90°인 사다리꼴 ABCD에서 ${X}의 값은?`, c, {
              figure: f.b.svg(`사다리꼴 ABCD. ∠A와 ∠B에 직각 표시가 있다. AD = ${a} cm, AB = ${h} cm, BC = ${bc} cm, CD = x cm`),
              explain: `꼭짓점 D에서 변 BC에 내린 수선의 발을 H라 하면 ${seg('DH')} = ${seg('AB')} = ${h} cm, ${seg('HC')} = ${bc} − ${a} = ${u}(cm)이다. △DHC에서 ${sq(X)} = ${sq(h)} + ${sq(u)} = ${c * c}이고 ${sq(c)} = ${c * c}이므로 ${X} = ${c}이다.`,
              facts: { calc: [[`((${bc}-${a})**2+${h}**2)**0.5`, 0]], unseen: [2, 0.5] }
            });
          }),
          T('side-trapezoid-area', '사다리꼴에 수선을 그어 넓이 구하기', '①19', (d, n) => {
            if (n === 0) {
              const v = d.until(() => {
                const [u, h, c] = legsOf(d), a = d.int(3, 12), b = a + u;
                return { u, h, c, a, b, f: polyFig({ A: [u, h], B: [0, 0], C: [b, 0], D: [b, h] }, { size: [170, 118], right: ['C', 'D'], fill: TINT, nameAt: { A: 140, D: 40 }, sides: { DA: cmL(a), AB: cmL(c), BC: cmL(b) } }) };
              }, (w) => w.b / w.h <= 2.2 && w.h / w.b <= 1.3 && (w.a + w.b) * w.h % 2 === 0 && !w.f.b.clash()), { u, h, c, a, b: bc, f } = v;
              return areaQ(`그림과 같이 ∠C = ∠D = 90°인 사다리꼴 ABCD의 넓이는?`, (a + bc) * h / 2, {
                figure: f.b.svg(`색칠한 사다리꼴 ABCD. ∠C와 ∠D에 직각 표시가 있다. AD = ${a} cm, AB = ${c} cm, BC = ${bc} cm`),
                explain: `꼭짓점 A에서 변 BC에 내린 수선의 발을 H라 하면 ${seg('BH')} = ${bc} − ${a} = ${u}(cm)이다. △ABH에서 ${sq(seg('AH'))} = ${sq(c)} − ${sq(u)} = ${h * h}이므로 ${seg('AH')} = ${h} cm이다. 넓이는 ${HALF} × (${a} + ${bc}) × ${h} = ${(a + bc) * h / 2}(cm²)이다.`,
                facts: { calc: [[`(${a}+${bc})*(${c}**2-(${bc}-${a})**2)**0.5/2`, 0]], unseen: [2, 0.5] }
              });
            }
            // 평행하지 않은 두 변의 길이가 같은 사다리꼴: 두 꼭짓점에서 수선을 내리면 양쪽에 합동인 직각삼각형이 생긴다.
            const v = d.until(() => {
              const [u, h, s] = legsOf(d), a = d.int(3, 12), b = a + 2 * u;
              const fig = polyFig({ A: [u, h], B: [0, 0], C: [b, 0], D: [u + a, h] }, { size: [170, 112], fill: TINT, nameAt: { A: 140, D: 40 }, sides: { DA: cmL(a), AB: cmL(s), BC: cmL(b) }, at: { AB: 0.28, DA: 0.6, BC: 0.4 } });
              return { u, h, s, a, b, f: fig, top: a * fig.P.k };
            }, (w) => w.b / w.h <= 2.4 && w.h / w.b <= 1.2 && w.top >= 64 && !w.f.b.clash()), { u, h, s, a, b: bc, f } = v;
            f.b.tick(f.P.A, f.P.B).tick(f.P.D, f.P.C).arrow(f.P.A, f.P.D, 0.82).arrow(f.P.B, f.P.C, 0.82);
            return areaQ(`그림과 같이 ${seg('AD')} ∥ ${seg('BC')}이고 ${seg('AB')} = ${seg('DC')} = ${s} cm인 사다리꼴 ABCD의 넓이는?`, (a + bc) * h / 2, {
              figure: f.b.svg(`색칠한 사다리꼴 ABCD. 변 AD와 변 BC에 평행하다는 표시가, 변 AB와 변 DC에 길이가 같다는 표시가 있다. AD = ${a} cm, AB = ${s} cm, BC = ${bc} cm`),
              explain: `두 꼭짓점 A, D에서 변 BC에 내린 수선의 발을 각각 H, K라 하면 △ABH ≡ △DCK이므로 ${seg('BH')} = (${bc} − ${a}) ÷ 2 = ${u}(cm)이다. △ABH에서 ${sq(seg('AH'))} = ${sq(s)} − ${sq(u)} = ${h * h}이므로 ${seg('AH')} = ${h} cm이다. 넓이는 ${HALF} × (${a} + ${bc}) × ${h} = ${(a + bc) * h / 2}(cm²)이다.`,
              facts: { calc: [[`(${a}+${bc})*(${s}**2-((${bc}-${a})/2)**2)**0.5/2`, 0]], unseen: [2, 0.5] }
            });
          }, { count: 2 }),
          T('side-cut-corner', '귀퉁이를 잘라 낸 정사각형 종이에서 남은 변의 길이', '①22', (d) => {
            // 정사각형의 오른쪽 위 귀퉁이를 잘랐다: 윗변에서 u, 오른쪽 변에서 v, 잘린 선 c
            const [u, v, c] = legsOf(d, [[3, 4, 5], [6, 8, 10], [5, 12, 13]]), s = Math.max(u, v) + d.int(3, 6), k = 128 / s, b = Board();
            const P = { A: [0, -s * k], B: [0, 0], C: [s * k, 0], D: [s * k, -(s - v) * k], E: [(s - u) * k, -s * k], K: [s * k, -s * k] }, inside = [s * k / 2, -s * k / 2];
            b.poly([P.A, P.B, P.C, P.D, P.E], TINT).seg(P.E, P.K, 'cut').seg(P.K, P.D, 'cut');
            b.dim(P.B, P.C, cmL(s), inside, 10).beside(P.C, P.D, cmL(s - v), inside).beside(P.A, P.E, xL('x'), inside).beside(P.D, P.E, cmL(c), P.K, { gap: 4 });
            return N(`그림과 같이 한 변의 길이가 ${s} cm인 정사각형 모양의 종이에서 한 귀퉁이를 직각삼각형 모양으로 잘라 냈다. ${X}의 값은?`, s - u, {
              figure: b.svg(`정사각형의 한 귀퉁이를 잘라 낸 오각형이 색칠되어 있고, 잘려 나간 귀퉁이는 점선으로 그려져 있다. 정사각형의 한 변의 길이는 ${s} cm, 잘린 선의 길이는 ${c} cm이다. 귀퉁이가 잘린 두 변에서 남은 부분의 길이는 각각 ${s - v} cm, x cm이다`),
              explain: `잘려 나간 직각삼각형에서 직각을 낀 한 변의 길이는 ${s} − ${s - v} = ${v}(cm)이고 빗변의 길이는 ${c} cm이다. 나머지 한 변의 길이를 제곱하면 ${sq(c)} − ${sq(v)} = ${u * u}이므로 그 길이는 ${u} cm이다. ${X} = ${s} − ${u} = ${s - u}이다.`,
              facts: { calc: [[`${s}-(${c}**2-(${s}-${s - v})**2)**0.5`, 0]], unseen: [2, 0.5] }
            });
          }),
          // 처음 지을 때 「무게중심 유형은 하나만」이라며 뺐다가 다시 실은 꼴(2026-10-13). 높이를 구한 뒤 한 번 더 잇는 것이라 기본에 둔다.
          T('side-iso-centroid', '이등변삼각형의 꼭짓점에서 무게중심까지의 거리', '심10', (d) => {
            const [half, h, s] = d.until(() => legsOf(d, TRIPLES), ([a, b]) => b % 3 === 0 && b / (2 * a) >= 0.3 && b / (2 * a) <= 1.4), base = 2 * half;
            const f = polyFig({ A: [half, h], B: [0, 0], C: [base, 0] }, { size: [150, 112], sides: { AB: cmL(s), BC: cmL(base) }, at: { AB: 0.28 } }), G = [half * f.P.k, -h / 3 * f.P.k];
            f.b.tick(f.P.A, f.P.B).tick(f.P.A, f.P.C).dot(G).name(G, 'G', 0, 10);
            return cmQ(`그림과 같이 ${seg('AB')} = ${seg('AC')} = ${s} cm, ${seg('BC')} = ${base} cm인 이등변삼각형 ABC에서 점 G가 △ABC의 무게중심일 때, ${seg('AG')}의 길이는?`, 2 * h / 3, {
              figure: f.b.svg(`이등변삼각형 ABC와 그 내부의 점 G. 변 AB와 변 AC에 길이가 같다는 표시가 있다. AB = ${s} cm, BC = ${base} cm`),
              explain: `점 G가 무게중심이므로 직선 AG는 변 BC의 중점을 지난다. 변 BC의 중점을 M이라 하면 이등변삼각형에서 꼭짓점 A와 밑변의 중점 M을 이은 선분은 밑변에 수직이므로 ∠AMB = 90°이고 ${seg('BM')} = ${half} cm이다. △ABM에서 ${sq(seg('AM'))} = ${sq(s)} − ${sq(half)} = ${h * h}이므로 ${seg('AM')} = ${h} cm이다. 무게중심은 중선을 꼭짓점으로부터 ${nb('2 : 1')}로 나누므로 ${seg('AG')} = ${frac(2, 3)} × ${h} = ${2 * h / 3}(cm)이다.`,
              facts: { calc: [[`(${s}**2-(${base}/2)**2)**0.5*2/3`, 0]], unseen: [2, 0.5, 3] }
            });
          })
        ]
      },
      {
        id: 'twice', title: '피타고라스 정리를 두 번 쓰기', standard: STD,
        types: [
          T('twice-altitude', '수선으로 나뉜 삼각형에서 두 번 쓰기', '①13 심1', (d, n) => {
            const make = () => {
              const [h, u0, v0] = d.pick(SHARED), [u, v] = d.bool() ? [u0, v0] : [v0, u0], c1 = rt(h * h + u * u), c2 = rt(h * h + v * v);
              const P = lay({ A: [u, h], B: [0, 0], C: [u + v, 0], D: [u, 0] }, [190, 112]), b = Board(), g = cen([P.A, P.B, P.C]);
              b.poly([P.B, P.C, P.A]).seg(P.A, P.D).corner(P.D, u > v ? P.B : P.C, P.A, '');
              b.name(P.A, 'A', 90).name(P.B, 'B', 200).name(P.C, 'C', 340).name(P.D, 'D', 270);
              return { h, u, v, c1, c2, P, b, g };
            };
            if (n === 0) {
              const w = d.until(() => { const x = make(); x.b.beside(x.P.A, x.P.D, cmL(x.h), x.u > x.v ? x.P.C : x.P.B, { t: 0.66 }).beside(x.P.B, x.P.D, cmL(x.u), x.g).beside(x.P.D, x.P.C, xL('x'), x.g).beside(x.P.A, x.P.B, xL('y'), x.g).beside(x.P.A, x.P.C, cmL(x.c2), x.g); return x; }, (x) => !x.b.clash() && x.h / (x.u + x.v) >= 0.36 && Math.max(x.u, x.v) * x.P.k * 0.66 >= 54);
              const { h, u, v, c1, c2 } = w;
              return M(`그림의 △ABC에서 ${seg('AD')} ⊥ ${seg('BC')}일 때, ${X}, ${Y}의 값을 차례로 구하시오.`, [{ label: X, answer: v }, { label: Y, answer: c1 }], {
                shown: `${X} = ${v}, ${Y} = ${c1}`,
                figure: w.b.svg(`삼각형 ABC. 꼭짓점 A에서 변 BC에 내린 수선의 발이 D이고 직각 표시가 있다. AD = ${h} cm, BD = ${u} cm, AC = ${c2} cm, DC = x cm, AB = y cm`),
                explain: `△ADC에서 ${sq(X)} = ${sq(c2)} − ${sq(h)} = ${v * v}이므로 ${X} = ${v}이다. △ABD에서 ${sq(Y)} = ${sq(u)} + ${sq(h)} = ${c1 * c1}이므로 ${Y} = ${c1}이다.`,
                facts: { calc: [[`(${c2}**2-${h}**2)**0.5`, 0], [`(${u}**2+${h}**2)**0.5`, 1]], unseen: [2, 0.5] }
              });
            }
            const w = d.until(() => { const x = make(); x.b.beside(x.P.A, x.P.D, cmL(x.h), x.u > x.v ? x.P.C : x.P.B, { t: 0.66 }).beside(x.P.A, x.P.C, cmL(x.c2), x.g).dim(x.P.B, x.P.C, cmL(x.u + x.v), x.g, 20); return x; }, (x) => !x.b.clash() && x.h / (x.u + x.v) >= 0.36 && Math.max(x.u, x.v) * x.P.k * 0.66 >= 54);
            const { h, u, v, c1, c2 } = w, bc = u + v;
            return cmQ(`그림의 △ABC에서 ${seg('AD')} ⊥ ${seg('BC')}이고 ${seg('AC')} = ${c2} cm, ${seg('AD')} = ${h} cm, ${seg('BC')} = ${bc} cm일 때, ${seg('AB')}의 길이는?`, c1, {
              figure: w.b.svg(`삼각형 ABC. 꼭짓점 A에서 변 BC에 내린 수선의 발이 D이고 직각 표시가 있다. AC = ${c2} cm, AD = ${h} cm, BC = ${bc} cm`),
              explain: `△ADC에서 ${sq(seg('DC'))} = ${sq(c2)} − ${sq(h)} = ${v * v}이므로 ${seg('DC')} = ${v} cm이고, ${seg('BD')} = ${bc} − ${v} = ${u}(cm)이다. △ABD에서 ${sq(seg('AB'))} = ${sq(u)} + ${sq(h)} = ${c1 * c1}이므로 ${seg('AB')} = ${c1} cm이다.`,
              facts: { calc: [[`((${bc}-(${c2}**2-${h}**2)**0.5)**2+${h}**2)**0.5`, 0]], unseen: [2, 0.5] }
            });
          }, { count: 2 }),
          T('twice-nested', '밑변 위의 점으로 겹친 두 직각삼각형', '①14', (d) => {
            const w = d.until(() => {
              const [x, u, v] = d.pick(SHARED), q = v - u, s1 = rt(x * x + u * u), y = rt(x * x + v * v), flip = d.bool();
              const P = lay(flip ? { B: [v, 0], D: [q, 0], C: [0, 0], A: [v, x] } : { B: [0, 0], D: [u, 0], C: [v, 0], A: [0, x] }, [196, 116]), b = Board(), g = cen([P.A, P.B, P.C]);
              b.poly([P.B, P.C, P.A]).seg(P.A, P.D).corner(P.B, P.C, P.A, '');
              // 선분 AD 의 길이는 두 삼각형 가운데 넓은 쪽 안에 적는다.
              b.beside(P.A, P.B, xL('x'), g).beside(P.B, P.D, cmL(u), g).beside(P.D, P.C, cmL(q), g).beside(P.A, P.C, xL('y'), g).beside(P.A, P.D, cmL(s1), u >= q ? P.C : P.B, { t: u >= q ? 0.6 : 0.76, gap: 3 });
              b.name(P.A, 'A', 90).name(P.B, 'B', flip ? 320 : 220).name(P.C, 'C', flip ? 200 : 340).name(P.D, 'D', 270);
              return { x, u, q, s1, y, b, room: Math.max(u, q) * P.k * 0.6 - (u >= q ? 0 : 12) };
            }, (v) => !v.b.clash() && v.x / (v.u + v.q) >= 0.4 && v.x / (v.u + v.q) <= 1.3 && Math.min(v.u, v.q) * 196 / (v.u + v.q) >= 44 && v.room >= 50);
            const { x, u, q, s1, y } = w;
            return M(`그림과 같이 ∠B = 90°인 직각삼각형 ABC의 변 BC 위에 점 D가 있다. ${X}, ${Y}의 값을 차례로 구하시오.`, [{ label: X, answer: x }, { label: Y, answer: y }], {
              shown: `${X} = ${x}, ${Y} = ${y}`,
              figure: w.b.svg(`직각삼각형 ABC. ∠B에 직각 표시가 있고, 변 BC 위의 점 D와 꼭짓점 A를 이은 선분이 그어져 있다. BD = ${u} cm, DC = ${q} cm, AD = ${s1} cm, AB = x cm, AC = y cm`),
              explain: `△ABD에서 ${sq(X)} = ${sq(s1)} − ${sq(u)} = ${x * x}이므로 ${X} = ${x}이다. △ABC에서 ${seg('BC')} = ${u} + ${q} = ${u + q}(cm)이므로 ${sq(Y)} = ${sq(x)} + ${sq(u + q)} = ${y * y}, ${Y} = ${y}이다.`,
              facts: { calc: [[`(${s1}**2-${u}**2)**0.5`, 0], [`(${s1}**2-${u}**2+(${u}+${q})**2)**0.5`, 1]], unseen: [2, 0.5] }
            });
          }),
          T('twice-nested-iso', '길이가 같은 선분으로 밑변을 구해 빗변의 길이를 제곱한 값 구하기', '①14', (d) => {
            const [p, q, c] = d.until(() => legsOf(d), ([u, v, w]) => (u + w) / v <= 2.6);
            const f = splitFig(p, q, c, { flip: d.bool(), names: { R: 'C', T: 'A', F: 'B', D: 'D' } });
            f.b.beside(f.P.R, f.P.T, cmL(q), f.g).beside(f.P.D, f.P.F, cmL(c), f.g, { t: 0.62 });
            return N(`그림과 같이 ∠C = 90°인 직각삼각형 ABC의 변 BC 위의 점 D에 대하여 ${seg('AC')} = ${q} cm, ${seg('AD')} = ${seg('BD')} = ${c} cm일 때, ${sq(seg('AB'))}의 값은?`, q * q + (p + c) * (p + c), {
              figure: f.b.svg(`직각삼각형 ABC. ∠C에 직각 표시가 있고, 변 BC 위의 점 D와 꼭짓점 A를 이은 선분이 그어져 있다. 선분 AD와 선분 BD에 길이가 같다는 표시가 있다. AC = ${q} cm, BD = ${c} cm`),
              explain: `△ADC에서 ${sq(seg('DC'))} = ${sq(c)} − ${sq(q)} = ${p * p}이므로 ${seg('DC')} = ${p} cm이고, ${seg('BC')} = ${c} + ${p} = ${p + c}(cm)이다. △ABC에서 ${sq(seg('AB'))} = ${sq(q)} + ${sq(p + c)} = ${q * q + (p + c) * (p + c)}이다.`,
              facts: { calc: [[`${q}**2+(${c}+(${c}**2-${q}**2)**0.5)**2`, 0]], unseen: [2, 0.5] }
            });
          }),
          T('twice-shared', '한 변을 함께 가진 두 직각삼각형', '①15', (d) => {
            const w = d.until(() => {
              const [x, u0, v0] = d.pick(SHARED), [a, y] = d.bool() ? [u0, v0] : [v0, u0], s1 = rt(x * x + a * a), s2 = rt(x * x + y * y);
              const P = lay({ T: [0, x], U: [a, x], O: [0, 0], L: [-y, 0] }, [200, 118]), b = Board(), gl = cen([P.L, P.O, P.T]), gr = cen([P.T, P.U, P.O]);
              b.poly([P.L, P.O, P.T]).poly([P.T, P.U, P.O]).corner(P.T, P.O, P.U, '').corner(P.O, P.L, P.T, '');
              // 함께 가진 변의 길이 x 는 두 삼각형 가운데 넓은 쪽 안에 적는다(왼쪽 삼각형은 아래가, 오른쪽 삼각형은 위가 넓다).
              b.beside(P.T, P.U, cmL(a), gr).beside(P.U, P.O, cmL(s1), gr).beside(P.L, P.T, cmL(s2), gl).beside(P.L, P.O, xL('y'), gl).beside(P.O, P.T, xL('x'), y >= a ? gr : gl, { t: y >= a ? 0.3 : 0.7, gap: 3 });
              return { x, a, y, s1, s2, b, room: Math.max(a, y) * P.k * 0.7 };
            }, (v) => !v.b.clash() && v.x / (v.a + v.y) >= 0.42 && v.room >= 52);
            const { x, a, y, s1, s2 } = w;
            return M(`그림과 같이 두 직각삼각형이 한 변을 함께 가지고 있다. ${X}, ${Y}의 값을 차례로 구하시오.`, [{ label: X, answer: x }, { label: Y, answer: y }], {
              shown: `${X} = ${x}, ${Y} = ${y}`,
              figure: w.b.svg(`세로로 놓인 길이 x cm인 선분을 두 직각삼각형이 함께 가진다. 오른쪽 직각삼각형은 그 선분의 위쪽 끝에서 직각을 이루고, 직각을 낀 다른 변의 길이는 ${a} cm, 빗변의 길이는 ${s1} cm이다. 왼쪽 직각삼각형은 그 선분의 아래쪽 끝에서 직각을 이루고, 직각을 낀 다른 변의 길이는 y cm, 빗변의 길이는 ${s2} cm이다`),
              explain: `오른쪽 직각삼각형에서 ${sq(X)} = ${sq(s1)} − ${sq(a)} = ${x * x}이므로 ${X} = ${x}이다. 왼쪽 직각삼각형에서 ${sq(Y)} = ${sq(s2)} − ${sq(x)} = ${y * y}이므로 ${Y} = ${y}이다.`,
              facts: { calc: [[`(${s1}**2-${a}**2)**0.5`, 0], [`(${s2}**2-(${s1}**2-${a}**2))**0.5`, 1]], unseen: [2, 0.5] }
            });
          }),
          T('twice-midpoint', '변의 중점까지의 거리를 제곱한 값', '①11', (d) => {
            // BC 가 짝수인 것만
            const [ac, bc, c] = d.pick([[5, 12, 13], [3, 4, 5], [6, 8, 10], [9, 12, 15], [12, 16, 20], [10, 24, 26]]), flip = d.bool(), m = bc / 2;
            const P = lay(flip ? { C: [0, 0], M: [m, 0], B: [bc, 0], A: [0, ac] } : { B: [0, 0], M: [m, 0], C: [bc, 0], A: [bc, ac] }, [200, 110]), b = Board(), g = cen([P.A, P.B, P.C]);
            b.poly([P.B, P.C, P.A]).seg(P.A, P.M).corner(P.C, P.B, P.A, '').tick(P.B, P.M).tick(P.M, P.C);
            b.beside(P.A, P.B, cmL(c), g).beside(P.C, P.A, cmL(ac), g).beside(P.A, P.M, xL('x'), P.B, { t: 0.5, gap: 3 });
            b.name(P.A, 'A', dirOf(g, P.A)).name(P.B, 'B', dirOf(g, P.B)).name(P.C, 'C', dirOf(g, P.C)).name(P.M, 'M', 270);
            return N(`그림과 같이 ∠C = 90°인 직각삼각형 ABC에서 점 M은 변 BC의 중점이다. ${seg('AB')} = ${c} cm, ${seg('AC')} = ${ac} cm이고 ${seg('AM')} = ${X} cm일 때, ${sq(X)}의 값은?`, ac * ac + m * m, {
              figure: b.svg(`직각삼각형 ABC. ∠C에 직각 표시가 있고, 변 BC의 중점 M과 꼭짓점 A를 이은 선분이 그어져 있다. 선분 BM과 선분 MC에 길이가 같다는 표시가 있다. AB = ${c} cm, AC = ${ac} cm, AM = x cm`),
              explain: `△ABC에서 ${sq(seg('BC'))} = ${sq(c)} − ${sq(ac)} = ${bc * bc}이므로 ${seg('BC')} = ${bc} cm이고, ${seg('MC')} = ${m} cm이다. △AMC에서 ${sq(X)} = ${sq(ac)} + ${sq(m)} = ${ac * ac + m * m}이다.`,
              facts: { calc: [[`${ac}**2+((${c}**2-${ac}**2)**0.5/2)**2`, 0]], unseen: [2, 0.5] }
            });
          }),
          T('twice-quad', '마주 보는 두 각이 직각인 사각형', '①17 심2', (d) => {
            const w = d.until(() => {
              const ad = d.int(4, 9), cd = d.int(4, 9), bc = d.int(3, 10), ac2 = ad * ad + cd * cd, ab2 = ac2 - bc * bc;
              if (ab2 < 9 || ad === cd) return null;
              const ac = Math.sqrt(ac2), ab = Math.sqrt(ab2);
              const f = polyFig({ A: [0, 0], B: [ab2 / ac, -ab * bc / ac], C: [ac, 0], D: [ad * ad / ac, ad * cd / ac] }, { size: [170, 150], right: ['B', 'D'], sides: { AB: xL('x'), BC: cmL(bc), CD: cmL(cd), DA: cmL(ad) } });
              return { ad, cd, bc, ac2, ab2, ab, f };
            }, (v) => v && !v.f.b.clash() && v.ab / v.bc >= 0.45 && v.ab / v.bc <= 2.2 && v.bc !== v.ad && v.bc !== v.cd);
            const { ad, cd, bc, ac2, ab2 } = w;
            return N(`그림의 □ABCD에서 ∠B = ∠D = 90°일 때, ${sq(X)}의 값은?`, ab2, {
              figure: w.f.b.svg(`사각형 ABCD. ∠B와 ∠D에 직각 표시가 있다. AB = x cm, BC = ${bc} cm, CD = ${cd} cm, DA = ${ad} cm`),
              explain: `대각선 AC를 그으면 △ACD에서 ${sq(seg('AC'))} = ${sq(ad)} + ${sq(cd)} = ${ac2}이다. △ABC에서 ${sq(X)} = ${sq(seg('AC'))} − ${sq(bc)} = ${ac2} − ${bc * bc} = ${ab2}이다.`,
              facts: { calc: [[`${ad}**2+${cd}**2-${bc}**2`, 0]], unseen: [2] }
            });
          })
        ]
      },
      {
        id: 'square', title: '정사각형의 넓이와 피타고라스 정리', standard: STD,
        types: [
          T('square-three', '두 정사각형의 넓이로 나머지 정사각형의 넓이 구하기', '①23', (d, n) => {
            const [p, q] = d.until(() => [d.int(9, 64), d.int(9, 64)], ([u, v]) => u !== v && Math.max(u, v) / Math.min(u, v) <= 2.6 && Math.abs(u - v) >= 5), r = p + q, c = Math.sqrt(p), bb = Math.sqrt(q);
            const ask = n === 0 ? 'BHIC' : 'ADEB', f = euclidFig(c, bb, { fill: { [ask]: TINT } }), k = f.P.k, inside = {};
            const area = { ADEB: p, ACGF: q, BHIC: r }, sideOf = { ADEB: c, ACGF: bb, BHIC: Math.sqrt(r) }, given = n === 0 ? ['ADEB', 'ACGF'] : ['BHIC', 'ACGF'];
            if (given.every((name) => fitsIn(sideOf[name] * k, area[name] + ' cm²'))) for (const name of given) f.b.text(cen(name.split('').map((key) => f.P[key])), area[name] + ' cm²', { blue: true });
            const head = '그림은 ∠A = 90°인 직각삼각형 ABC의 세 변을 각각 한 변으로 하는 정사각형을 그린 것이다. ';
            const said = `직각삼각형 ABC의 세 변 위에 정사각형 ADEB, ACGF, BHIC가 삼각형의 바깥쪽으로 그려져 있다. ∠A에 직각 표시가 있고 변 BC가 빗변이다. 정사각형 ${ask}가 색칠되어 있다. □${given[0]}의 넓이 ${area[given[0]]} cm², □${given[1]}의 넓이 ${area[given[1]]} cm²`;
            if (n === 0) return areaQ(`${head}□ADEB의 넓이가 ${p} cm², □ACGF의 넓이가 ${q} cm²일 때, □BHIC의 넓이는?`, r, {
              figure: f.b.svg(said), explain: `□ADEB = ${sq(seg('AB'))}, □ACGF = ${sq(seg('AC'))}, □BHIC = ${sq(seg('BC'))}이고 ${sq(seg('AB'))} + ${sq(seg('AC'))} = ${sq(seg('BC'))}이므로 □BHIC의 넓이는 ${p} + ${q} = ${r}(cm²)이다.`,
              facts: { calc: [[`${p}+${q}`, 0]] }
            });
            return areaQ(`${head}□BHIC의 넓이가 ${r} cm², □ACGF의 넓이가 ${q} cm²일 때, □ADEB의 넓이는?`, p, {
              figure: f.b.svg(said), explain: `□ADEB = ${sq(seg('AB'))}, □ACGF = ${sq(seg('AC'))}, □BHIC = ${sq(seg('BC'))}이고 ${sq(seg('AB'))} + ${sq(seg('AC'))} = ${sq(seg('BC'))}이므로 □ADEB의 넓이는 ${r} − ${q} = ${p}(cm²)이다.`,
              facts: { calc: [[`${r}-${q}`, 0]] }
            });
          }, { count: 2 }),
          T('square-lengths', '두 변의 길이로 빗변 위의 정사각형의 넓이 구하기', '①23 심12', (d) => {
            const [c, bb] = d.until(() => [d.int(2, 9), d.int(2, 9)], ([u, v]) => u !== v && Math.max(u, v) / Math.min(u, v) <= 2.2 && !isSq(u * u + v * v));
            const f = euclidFig(c, bb, { fill: { BHIC: TINT } });
            return areaQ(`그림은 ∠A = 90°인 직각삼각형 ABC의 세 변을 각각 한 변으로 하는 정사각형을 그린 것이다. ${seg('AB')} = ${c} cm, ${seg('AC')} = ${bb} cm일 때, □BHIC의 넓이는?`, c * c + bb * bb, {
              figure: f.b.svg('직각삼각형 ABC의 세 변 위에 정사각형 ADEB, ACGF, BHIC가 삼각형의 바깥쪽으로 그려져 있다. ∠A에 직각 표시가 있고 변 BC가 빗변이다. 정사각형 BHIC가 색칠되어 있다'),
              explain: `□BHIC의 넓이는 ${sq(seg('BC'))}이다. ${PYTH}${sq(seg('BC'))} = ${sq(seg('AB'))} + ${sq(seg('AC'))} = ${sq(c)} + ${sq(bb)} = ${c * c + bb * bb}이므로 □BHIC의 넓이는 ${c * c + bb * bb} cm²이다.`,
              facts: { calc: [[`${c}**2+${bb}**2`, 0]], unseen: [2] }
            });
          }),
          T('square-side', '정사각형의 넓이로 변의 길이 구하기', '①24', (d, n) => {
            if (n === 0) {
              // 직각을 낀 두 변 위의 정사각형의 넓이 p, q → 빗변의 길이
              const v = d.until(() => { const a = d.int(5, 15), p = d.int(9, a * a - 9); return { a, p, q: a * a - p }; }, (w) => Math.max(w.p, w.q) / Math.min(w.p, w.q) <= 3 && w.p !== w.q), { a, p, q } = v;
              const f = euclidFig(Math.sqrt(p), Math.sqrt(q), { show: ['ADEB', 'ACGF'], fill: { ADEB: TINT, ACGF: TINT }, size: [200, 150] }), k = f.P.k;
              if (fitsIn(Math.sqrt(p) * k, p + ' cm²') && fitsIn(Math.sqrt(q) * k, q + ' cm²')) f.b.text(cen('ADEB'.split('').map((key) => f.P[key])), p + ' cm²', { blue: true }).text(cen('ACGF'.split('').map((key) => f.P[key])), q + ' cm²', { blue: true });
              return cmQ(`그림은 ∠A = 90°인 직각삼각형 ABC에서 두 변 AB, AC를 각각 한 변으로 하는 정사각형을 그린 것이다. □ADEB의 넓이가 ${p} cm², □ACGF의 넓이가 ${q} cm²일 때, ${seg('BC')}의 길이는?`, a, {
                figure: f.b.svg(`직각삼각형 ABC의 두 변 AB, AC 위에 정사각형 ADEB, ACGF가 삼각형의 바깥쪽으로 그려져 있고 색칠되어 있다. ∠A에 직각 표시가 있다. □ADEB의 넓이 ${p} cm², □ACGF의 넓이 ${q} cm²`),
                explain: `${sq(seg('AB'))} = ${p}, ${sq(seg('AC'))} = ${q}이므로 ${sq(seg('BC'))} = ${p} + ${q} = ${a * a}이다. ${sq(a)} = ${a * a}이므로 ${seg('BC')} = ${a} cm이다.`,
                facts: { calc: [[`(${p}+${q})**0.5`, 0]], unseen: [0.5] }
              });
            }
            // 빗변 위의 정사각형의 넓이와 한 변 위의 정사각형의 넓이 → 나머지 변의 길이
            const v = d.until(() => { const s = d.int(3, 12), a = d.int(s + 1, 15); return { s, w: a * a, u: a * a - s * s }; }, (x) => !isSq(x.u) || d.bool()), { s, w, u } = v;
            return cmQ(`∠A = 90°인 직각삼각형 ABC에서 두 변 AB, BC를 각각 한 변으로 하는 정사각형의 넓이가 차례로 ${u} cm², ${w} cm²일 때, ${seg('AC')}의 길이는?`, s, {
              explain: `${sq(seg('AB'))} = ${u}, ${sq(seg('BC'))} = ${w}이고 빗변은 BC이므로 ${sq(seg('AC'))} = ${w} − ${u} = ${s * s}이다. ${sq(s)} = ${s * s}이므로 ${seg('AC')} = ${s} cm이다.`,
              facts: { calc: [[`(${w}-${u})**0.5`, 0]], unseen: [0.5] }
            });
          }, { count: 2 }),
          T('square-ratio', '변의 길이의 비로 정사각형의 넓이의 비 구하기', '①25', (d) => {
            const [m, k] = d.pick([[1, 2], [1, 3], [2, 3], [2, 1], [3, 1], [3, 2]]), S = (i) => `${V('S')}<sub>${i}</sub>`, pick = d.bool() ? 1 : 2, own = pick === 1 ? m : k, other = pick === 1 ? k : m;
            const f = euclidFig(m, k, { nameA: true, size: [190, 190] }), svgS = (i) => `${sv('S')}<tspan dy="3" style="font-size:10px">${i}</tspan>`;
            ['ADEB', 'ACGF', 'BHIC'].forEach((name, i) => f.b.text(cen(name.split('').map((key) => f.P[key])), svgS(i + 1), { blue: true, size: 14 }));
            const ratio = (x, y) => { const g = gcd(x, y); return nb(`${x / g} : ${y / g}`); };
            // 틀린 보기: 길이의 비를 그대로 더한 아이 / 직각을 낀 두 변 위의 정사각형끼리 견준 아이 / 길이의 비를 넓이의 비로 본 아이
            const right = ratio(own * own, m * m + k * k), options = d.shuffle([right, ratio(own, m + k), ratio(own * own, other * other), ratio(own, other)]);
            return C(`그림과 같이 ∠A = 90°인 직각삼각형 ABC의 세 변 AB, AC, BC를 각각 한 변으로 하는 정사각형의 넓이를 차례로 ${S(1)}, ${S(2)}, ${S(3)}이라 하자. ${nb(`${seg('AB')} : ${seg('AC')} = ${m} : ${k}`)}일 때, ${nb(`${S(pick)} : ${S(3)}`)}은?`, options, options.indexOf(right), {
              figure: f.b.svg('직각삼각형 ABC의 세 변 위에 정사각형이 삼각형의 바깥쪽으로 그려져 있다. ∠A에 직각 표시가 있다. 변 AB 위의 정사각형에 S1, 변 AC 위의 정사각형에 S2, 변 BC 위의 정사각형에 S3이 적혀 있다'),
              explain: `${seg('AB')} = ${m === 1 ? '' : m}${V('k')}, ${seg('AC')} = ${k === 1 ? '' : k}${V('k')}라 하면 ${S(1)} = ${m * m === 1 ? '' : m * m}${sq(V('k'))}, ${S(2)} = ${k * k === 1 ? '' : k * k}${sq(V('k'))}이고 ${S(3)} = ${S(1)} + ${S(2)} = ${m * m + k * k}${sq(V('k'))}이다. ${S(pick)} : ${S(3)} = ${right}이다.`,
              facts: { truth: options.map((o) => o === right), want: true }
            });
          }),
          T('square-from-area', '삼각형의 넓이로 빗변 위의 정사각형의 넓이 구하기', '①26', (d) => {
            const [ac, bc] = d.until(() => [d.int(2, 8), d.int(2, 9)], ([u, v]) => u !== v && u * v % 2 === 0 && !isSq(u * u + v * v)), area = ac * bc / 2;
            return areaQ(`∠C = 90°인 직각삼각형 ABC에서 ${seg('AC')} = ${ac} cm이고 △ABC의 넓이가 ${area} cm²일 때, 빗변 AB를 한 변으로 하는 정사각형의 넓이는?`, ac * ac + bc * bc, {
              explain: `${HALF} × ${ac} × ${seg('BC')} = ${area}에서 ${seg('BC')} = ${bc} cm이다. 빗변 AB를 한 변으로 하는 정사각형의 넓이는 ${sq(seg('AB'))} = ${sq(ac)} + ${sq(bc)} = ${ac * ac + bc * bc}(cm²)이다.`,
              facts: { calc: [[`${ac}**2+(2*${area}/${ac})**2`, 0]], unseen: [2] }
            });
          }),
          T('square-joined', '이어 붙인 두 정사각형의 꼭짓점 사이의 거리', '①20', (d) => {
            // 왼쪽 정사각형의 한 변 s, 오른쪽 정사각형의 한 변 t. 직각을 낀 두 변은 s + t 와 t
            const [s, t, x] = d.pick([[7, 5, 13], [3, 9, 15], [7, 8, 17], [4, 12, 20], [14, 10, 26], [17, 7, 25], [5, 15, 25], [6, 18, 30]]), k = Math.min(196 / (s + t), 128 / Math.max(s, t)), b = Board();
            const A = [0, 0], S1 = [s * k, 0], S2 = [(s + t) * k, 0], top = [(s + t) * k, -t * k];
            b.poly([A, S1, [s * k, -s * k], [0, -s * k]], WHITE).poly([S1, S2, top, [s * k, -t * k]], WHITE).seg(A, top);
            // 넓이 글은 정사각형 안에 적되, 작은 정사각형은 그 위에 적는다.
            b.text(s * k >= 62 ? [s * k / 2, -s * k * 0.72] : [Math.min(s * k / 2, s * k - 30), -s * k - 11], `${s * s} cm²`, { blue: true }).text(t * k >= 62 ? [(s + t / 2) * k, -t * k * (s > t ? 0.3 : 0.24)] : [(s + t / 2) * k + 5, -t * k - 11], `${t * t} cm²`, { blue: true }).beside(A, top, xL('x'), [300, 200], { t: s > t ? 0.42 : 0.6, gap: 3 });
            return N(`그림과 같이 넓이가 각각 ${s * s} cm², ${t * t} cm²인 두 정사각형을 한 변이 같은 직선 위에 놓이도록 이어 붙였다. ${X}의 값은?`, x, {
              figure: b.svg(`왼쪽에 넓이 ${s * s} cm²인 정사각형, 오른쪽에 넓이 ${t * t} cm²인 정사각형이 밑변을 한 직선 위에 두고 붙어 있다. 왼쪽 정사각형의 왼쪽 아래 꼭짓점과 오른쪽 정사각형의 오른쪽 위 꼭짓점을 이은 선분의 길이가 x cm이다`),
              explain: `${sq(s)} = ${s * s}, ${sq(t)} = ${t * t}이므로 두 정사각형의 한 변의 길이는 각각 ${s} cm, ${t} cm이다. 길이가 ${X} cm인 선분은 직각을 낀 두 변의 길이가 ${s} + ${t} = ${s + t}(cm), ${t} cm인 직각삼각형의 빗변이다. ${sq(X)} = ${sq(s + t)} + ${sq(t)} = ${x * x}이고 ${sq(x)} = ${x * x}이므로 ${X} = ${x}이다.`,
              facts: { calc: [[`((${s * s}**0.5+${t * t}**0.5)**2+${t * t})**0.5`, 0]], unseen: [2, 0.5] }
            });
          }),
          T('square-euclid-tri', '빗변 위의 정사각형 안의 삼각형의 넓이', '①28 심15', (d, n) => {
            // ∠A = 90°, 정사각형 BDEC 는 BC 의 아래. A 에서 내린 수선이 BC 와 F, DE 와 G 에서 만난다.
            const draw = (c, bb, shade, withG) => {
              const a = Math.sqrt(c * c + bb * bb), fx = c * c / a, P = lay({ A: [fx, c * bb / a], B: [0, 0], C: [a, 0], D: [0, -a], E: [a, -a], F: [fx, 0], G: [fx, -a] }, [150, 196]), b = Board(), g = cen([P.A, P.B, P.C]);
              b.poly([P.B, P.D, P.E, P.C]).poly(shade.map((key) => P[key]), TINT).poly([P.A, P.B, P.C]).corner(P.A, P.B, P.C, '');
              // 직각 표시는 좁은 쪽에, 점 F 의 이름은 넓은 쪽에 둔다.
              b.seg(P.A, withG ? P.G : P.F).corner(P.F, c > bb ? P.C : P.B, P.A, '');
              if (withG) b.corner(P.G, P.D, P.F, '');
              b.name(P.A, 'A', 90).name(P.B, 'B', 180).name(P.C, 'C', 0).name(P.D, 'D', 225).name(P.E, 'E', 315).name(P.F, 'F', c > bb ? 140 : 40, 12);
              if (withG) b.name(P.G, 'G', 270);
              return { b, P, g };
            };
            if (n === 0) {
              const [a, bb] = d.until(() => [d.int(6, 15), d.int(3, 12)], ([u, v]) => (u - v) % 2 === 0 && v >= 0.4 * u && v <= 0.78 * u && Math.abs(u * u - 2 * v * v) >= 0.12 * u * u), c2 = a * a - bb * bb;
              const f = draw(Math.sqrt(c2), bb, ['F', 'D', 'G'], true);
              f.b.beside(f.P.A, f.P.C, cmL(bb), f.g);
              return areaQ(`그림은 ∠A = 90°인 직각삼각형 ABC에서 변 BC를 한 변으로 하는 정사각형 BDEC를 그린 것이다. 꼭짓점 A에서 변 BC, 변 DE에 내린 수선의 발을 각각 F, G라 하자. ${seg('BC')} = ${a} cm, ${seg('AC')} = ${bb} cm일 때, △FDG의 넓이는?`, c2 / 2, {
                figure: f.b.svg(`직각삼각형 ABC와, 변 BC의 아래쪽에 그린 정사각형 BDEC. ∠A에 직각 표시가 있다. 꼭짓점 A에서 내린 수선이 변 BC와 점 F에서, 변 DE와 점 G에서 만나고 직각 표시가 있다. 삼각형 FDG가 색칠되어 있다. AC = ${bb} cm`),
                explain: `${sq(seg('AB'))} = ${sq(a)} − ${sq(bb)} = ${c2}이다. △ABC와 △FBA에서 ∠B는 공통이고 ∠BAC = ∠BFA = 90°이므로 △ABC ∽ △FBA이고, ${nb(`${seg('AB')} : ${seg('FB')} = ${seg('BC')} : ${seg('BA')}`)}에서 ${sq(seg('AB'))} = ${seg('BF')} × ${seg('BC')}이다. 직사각형 BDGF의 넓이는 ${seg('BF')} × ${seg('BD')} = ${seg('BF')} × ${seg('BC')} = ${sq(seg('AB'))} = ${c2}(cm²)이고, △FDG의 넓이는 그 ${HALF}이므로 ${c2 / 2} cm²이다.`,
                facts: { calc: [[`(${a}**2-${bb}**2)/2`, 0]], unseen: [2] }
              });
            }
            const [c, bb] = d.until(() => [d.int(3, 9), d.int(3, 9)], ([u, v]) => (u - v) % 2 === 0 && u !== v && Math.max(u, v) / Math.min(u, v) <= 2), a2 = c * c + bb * bb;
            const f = draw(c, bb, ['F', 'D', 'E'], false);
            f.b.beside(f.P.A, f.P.B, cmL(c), f.g).beside(f.P.A, f.P.C, cmL(bb), f.g);
            return areaQ(`그림은 ∠A = 90°인 직각삼각형 ABC에서 변 BC를 한 변으로 하는 정사각형 BDEC를 그린 것이다. 꼭짓점 A에서 변 BC에 내린 수선의 발을 F라 하자. ${seg('AB')} = ${c} cm, ${seg('AC')} = ${bb} cm일 때, △FDE의 넓이는?`, a2 / 2, {
              figure: f.b.svg(`직각삼각형 ABC와, 변 BC의 아래쪽에 그린 정사각형 BDEC. ∠A에 직각 표시가 있다. 꼭짓점 A에서 변 BC에 내린 수선의 발이 F이고 직각 표시가 있다. 삼각형 FDE가 색칠되어 있다. AB = ${c} cm, AC = ${bb} cm`),
              explain: `△FDE는 밑변이 DE이고 높이가 ${seg('BD')}이므로 그 넓이는 정사각형 BDEC의 넓이의 ${HALF}이다. 정사각형 BDEC의 넓이는 ${sq(seg('BC'))} = ${sq(c)} + ${sq(bb)} = ${a2}(cm²)이므로 △FDE의 넓이는 ${a2 / 2} cm²이다.`,
              facts: { calc: [[`(${c}**2+${bb}**2)/2`, 0]], unseen: [2] }
            });
          }, { count: 2 })
        ]
      },
      { id: 'proof', title: '피타고라스 정리의 정당화', standard: STD, types: [] },
      { id: 'cond', title: '직각삼각형이 되는 조건', standard: STD, types: [] },
      { id: 'height', title: '넓이·닮음과 함께 쓰기', standard: STD, types: [] },
      { id: 'semi', title: '반원의 넓이', standard: STD, types: [] },
      { id: 'use', title: '피타고라스 정리의 활용', standard: STD, types: [] }
    ]
  });

  // 같은 단원의 다른 파일(8-2-5b.js, 8-2-5c.js)이 함께 쓰는 도구
  B.kit.m825 = {
    UNIT, STD, T, TRIPLES, DRAWN, SHARED, legsOf, isSq, rt, X, Y, seg, sq, cmL, xL, HALF, PYTH, cmQ, areaQ, piQ, fracQ,
    cen, lay, polyFig, rightFig, splitFig, sqOn, semiPts, semi, euclidModel, euclidFig, fitsIn
  };
})(typeof window !== 'undefined' ? window : globalThis);
