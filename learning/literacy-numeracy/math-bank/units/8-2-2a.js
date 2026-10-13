// 중학교 2학년 2학기 2단원 사각형의 성질 — 단원 틀·단원 안의 도구와 앞쪽 묶음
// (평행사변형의 성질, 평행사변형의 성질의 활용, 평행사변형이 되는 조건, 평행사변형과 넓이).
// 수집해 둔 교과서 3종(미래엔 황선욱 2015·2022, 천재 김동재·김화경)의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1·2: 75·60꼴, 심화꼴 65꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/8-2-2/싣기_대조표.md 에 있다.
// (직사각형·마름모·정사각형, 등변사다리꼴, 사각형 사이의 관계, 평행선과 넓이는 8-2-2b.js 에, 실력 문항은 8-2-2c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
// 영역은 도형과 측정. 성취기준은 9수03-11(사각형의 성질을 이해하고 정당화할 수 있다)이다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(글·수치가 적힌 그림·표시만 한 그림·기호로 쓴 조건), 묻는 것(길이·각도·넓이·조건·이름·설명의 빈칸), 푸는 길(대변·대각·대각선의 성질을 바로 대기 /
//    엇각과 이등분선으로 이등변삼각형 찾기 / 합동으로 길이 옮기기 / 어떤 사각형인지 판별하기)이 다르면 따로 싣는다. 수와 이름만 바꾼 것은 한 유형이다.
//  - 그림은 모두 수치대로 그린다. 코드가 길이와 각에서 꼭짓점의 자리를 셈해 그리므로 그림과 답이 어긋나지 않는다. 묻는 길이·각은 그림에 적지 않고, 주어진 수치와 표시(같은 길이·같은 각·직각·평행)로 답이 정해진다.
//    조건을 판정하는 그림(cond-fig)은 틀린 것도 평행사변형처럼 그린다. 적힌 수치만으로 평행사변형이라고 할 수 있는지를 묻는 문제여서, 그림의 생김새가 답을 알려 주면 안 된다(적힌 수치와는 맞게 그린다).
//  - 주어진 길이·각은 문제 글에 모두 적고, 그림에는 자리가 넉넉한 것만 한 번 더 적는다. 그림 설명(aria-label)에는 그림에 적힌 이름·수치·표시를 말로 적는다.
//  - 답: 각도(°)·길이(cm)·넓이(cm²)는 수로, 두 값은 두 칸으로, 사각형의 이름·조건·옳은 설명·설명 과정의 빈칸은 고르기로 받는다. 부호 단추는 달지 않는다.
//  - 교육과정: 「사각형의 성질은 대각선에 관한 성질을 위주로 다룬다. 여러 가지 사각형의 성질을 통해 사각형 사이의 관계를 설명하게 한다.」
//    「정확한 용어와 기호의 사용, 복잡한 형식 논리 규칙의 이용을 요구하는 연역적 정당화 문제는 다루지 않는다.」 「가정」「결론」은 쓰지 않는다.
//    증명 전체를 쓰는 꼴은 싣지 않고, 과정의 빈칸은 고르기로 바꾸어 실었다(「설명하는 과정」이라 적었다).
//  - 초등 4학년 「사각형」(4-2-2)에서 한 일(평행사변형·마름모의 변의 길이와 각의 크기를 그림에서 바로 읽기)과 「다각형」(4-2-4)에서 한 일(대각선의 길이가 같은·수직인 사각형 고르기,
//    대각선의 반쪽 길이 읽기)은 그대로 다시 싣지 않았다. 이 단원의 문항은 변이 식인 것, 대각선의 반과 전체를 함께 쓰는 것, 엇각·이등분선·합동을 이어 쓰는 것, 조건과 사각형 사이의 관계이다.
//  - 사각형 사이의 관계를 묻는 문장은 포함 관계로 참인 것을 틀렸다고 하지 않는다(「직사각형은 평행사변형이다」는 참). 이름을 묻는 문항은 「가장 알맞은 이름」을 묻는다.
//  - 꼴 목록에 적힌 원문의 어긋남(T셀파 중단원 01·14, 김동재 대단원 14, 미래엔 표준 23·31, 은4-11 등)은 따르지 않는다. 답은 모두 코드가 셈한다.
//
// 뺀 것과 까닭(8-2-2b.js, 8-2-2c.js 의 것까지 여기에 모아 적는다)
//  - 초등에서 한 일: 평행사변형의 대변의 길이·대각의 크기·이웃한 각을 그림에서 읽기(①2 ②1의 대표 ②3 — 4-2-2 pgram-side·pgram-angle-opp·pgram-angle-adj),
//    둘레 28 cm(②2의 대표), 종이를 두 번 접어 잘라 만든 마름모(①53 — 4-2-2 kinds-fold), 네 보기에서 대각선의 성질을 갖는 사각형 고르기(①69 ②57의 대표 — 4-2-4 quad-names.
//    등변사다리꼴이 낀 여섯 보기는 실력 hard-diag-equal 에, 표에 ○표 하기는 rel-table 에 실었다).
//  - 중1에서 한 일: 정사각형의 두 변 위에 같은 길이로 잡은 두 점(①48 — 7-2-2 hard-square-cross).
//  - 증명 전체를 쓰는 것: ①26(과정의 빈칸 cond-proof 로 바꿈) ①29 ①65, ①28의 까닭 쓰기(식 가리기는 cond-perp-claims, 값 구하기는 실력 hard-perp-pgram), ②30의 변형(cond-why 의 빈칸으로 바꿈).
//  - 뒤 단원(닮음·피타고라스 정리·삼각형의 두 변의 중점을 이은 선분): 각 변의 중점을 이은 사각형(①71 심43, 심42의 ⑵), 변의 길이가 그림에 없는 마름모의 둘레(심62).
//  - 이미 실은 유형이 같은 일을 묻는 것: ①75의 값 구하기(같은 그림에서 넓이가 같은 삼각형을 모두 찾는 심58 hard-par-same 이 같은 옮기기를 묻는다. 값으로 물으면 답이 준 수 그대로다),
//    심17(변의 중점으로 평행사변형을 세 번 가리는 일은 심18 hard-mid-pgram-angle 이 한다. 그림의 점 이름 자리도 모른다).
//  - 쪽 그림에서도 그림이나 묻는 자리를 알 수 없는 것: ①74(원문도 어긋남) ②32 ②50 ②42의 변형(반원) 심2(좌표), ②4·②11·②23의 그림 모르는 변형.
//  - 답이 늘 같고 수치대로 그리면 그림에서 직각이 그대로 보이는 것: ①43(마름모의 삼등분선 90°), ②18(변의 연장선에 같은 길이를 잡아 생기는 90° — 같은 그림에서 합동을 두 번 쓰는 일은 심57 hard-mid-ext-area 가 넓이로 묻는다),
//    ①16의 ∠HEF = 90°(직사각형임을 써서 대각선의 길이를 구하는 꼴로 실었다).
//  - 같은 일이어서 한 번만 실은 것: ①5(변의 식 둘을 같다고 놓기 — prop-side-expr·cond-make#3·rel-rhom-expr 과) ①24(②19와) ①35(②37·심63과 — 준 두 넓이를 더하면 답이 되어 따로 싣지 않는다)
//    심4(①10과) 심8(②14와) 심53(①49와) ②38(①73과) 심38(①56의 변형과) ②26의 둘째 그림(첫째 그림과) ②59의 여섯 화살표 그림(네 화살표 그림과).
//  - (2026-10-13) 처음에는 뺐다가 다시 실은 것 — 수학 실력에 필요한 문제는 꼬임·보조선·여러 단계라는 까닭으로 빼지 않는다(모두 8-2-2c.js 에 있다):
//    보조선을 긋거나 합동·판별·넓이 옮기기를 거듭 잇는 심12 심18 심21 심27 심36 심55 심56 심57 심60 ①57(실력), 접어서 정오각형이 생기는 ②17(실력),
//    연립방정식을 세우는 심16·넓이 셈이 낀 심49 심54 심65(실력 — 심49는 답이 자연수가 되는 세 변으로, 심65는 비 대신 넓이로 묻는다),
//    접기 ①19 ①50 심24·변을 늘이는 보조선 심11·내부의 한 점을 지나는 두 평행선 심46(두세 단계라 기본).
//  - 실력이 아니라 기본에 둔 것: 포함 관계 문장의 참·거짓(①67 ②56 심41 — 기본 문서 넷에 문장 그대로 나오고 교과서가 사실로 가르친다), 이웃한 두 내각의 이등분선 사이의 길이(①12 ②12 — 기본 문서 다섯),
//    직사각형의 대각선의 수직이등분선이 만드는 마름모(①51 ②46 — 기본 문서 넷), 겹쳐 놓은 두 정사각형(①49 — 기본 문서 넷).
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」 각도는 수에 붙여 적고(108°) 길이는 띄어 적는다(6 cm).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { N, M, C, lines, box, frac, tagged } = B.kit;
  const { V, nb, SG } = B.kit.mid;
  const { RAD, at, dirOf, dist, mid, meet, sv, TINT, WHITE, Board } = B.kit.mgeo;
  const UNIT = '8-2-2', STD = '9수03-11';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});

  // ── 글 ──
  const sg = SG, X = V('x'), Y = V('y'), HALF = frac(1, 2);
  const eq = (a, b) => `${sg(a)} = ${sg(b)}`, par = (a, b) => `${sg(a)} ∥ ${sg(b)}`, perp = (a, b) => `${sg(a)} ⊥ ${sg(b)}`;
  const cm = (v) => v + ' cm', CM2 = 'cm²';
  const O_NOTE = '(단, 점 O는 두 대각선의 교점이다.)';
  const TAGS = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ'], SYM = ['㉠', '㉡', '㉢', '㉣'];
  const SAY_PG = '평행사변형 ABCD. 점 A는 왼쪽 위, 점 B는 왼쪽 아래, 점 C는 오른쪽 아래, 점 D는 오른쪽 위에 있다.';
  const SAY_O = ' 두 대각선 AC, BD가 점 O에서 만난다.';
  // 평행사변형이 되는 조건 다섯
  const FIVE = ['두 쌍의 대변이 각각 평행하다.', '두 쌍의 대변의 길이가 각각 같다.', '두 쌍의 대각의 크기가 각각 같다.', '두 대각선이 서로 다른 것을 이등분한다.', '한 쌍의 대변이 평행하고 그 길이가 같다.'];
  const BECAUSE = ['두 쌍의 대변이 각각 평행하므로', '두 쌍의 대변의 길이가 각각 같으므로', '두 쌍의 대각의 크기가 각각 같으므로', '두 대각선이 서로 다른 것을 이등분하므로', '한 쌍의 대변이 평행하고 그 길이가 같으므로'];

  // ── 답 ──
  const degQ = (text, v, o) => N(text, v, Object.assign({ unit: '°' }, o));
  const lenQ = (text, v, o) => N(text, v, Object.assign({ unit: 'cm' }, o));
  const areaQ = (text, v, o) => N(text, v, Object.assign({ unit: CM2 }, o));
  // 고르기: 맞는 보기 하나와 틀린 보기들을 섞는다.
  function pickOne(d, text, right, wrongs, o) {
    const opt = o || {}, rows = d.shuffle([[right, true]].concat(wrongs.map((w) => [w, false]))), hit = rows.findIndex((r) => r[1]);
    return C(text, rows.map((r) => r[0]), hit, { figure: opt.figure, explain: opt.explain, facts: Object.assign({ truth: rows.map((r) => r[1]), want: true }, opt.rule ? { rule: opt.rule } : {}) });
  }
  // 「모두 고른 것」: flags 가 참인 줄의 기호가 정답이다. 틀린 보기는 정답과 한 줄, 두 줄 다른 묶음에서 고른다. o.must: 꼭 넣을 틀린 묶음(참·거짓 배열)
  const bits = (m) => { let n = 0; for (let x = m; x; x >>= 1) n += x & 1; return n; };
  function allQ(d, text, tags, flags, o) {
    const opt = o || {}, n = flags.length, key = (m) => tags.filter((_, i) => m & (1 << i)).join(', '), mask = (list) => list.reduce((m, f, i) => m | (f ? 1 << i : 0), 0), right = mask(flags), pool = [];
    for (let m = 1; m < (1 << n); m += 1) if (m !== right) pool.push(m);
    const must = (opt.must || []).map(mask).filter((m) => m && m !== right);
    const rest = d.shuffle(pool.filter((m) => bits(m ^ right) === 1 && !must.includes(m))).concat(d.shuffle(pool.filter((m) => bits(m ^ right) === 2 && !must.includes(m))));
    return pickOne(d, text, key(right), must.concat(rest).slice(0, 3).map(key), opt);
  }
  // 문장 가리기. yes: 옳은 문장들, no: [틀린 문장, 바로잡은 말, 함께 싣지 않을 옳은 문장(들)]. wantTrue: 옳은 것을 고르는가.
  function sayQ(d, text, yes, no, wantTrue, figure) {
    const bad = d.shuffle(no).slice(0, wantTrue ? 3 : 1), clash = bad.reduce((all, s) => all.concat(s[2] || []), []);
    const good = d.shuffle(yes.filter((s) => !clash.includes(s))).slice(0, wantTrue ? 1 : 3);
    const rows = d.shuffle(good.map((s) => [s, true, '']).concat(bad.map((s) => [s[0], false, s[1]]))), hit = rows.findIndex((r) => r[1] === wantTrue);
    return C(text, rows.map((r) => r[0]), hit, { figure, explain: wantTrue ? Array.from(new Set(rows.filter((r) => !r[1]).map((r) => r[2]))).join(' ') : rows[hit][2], facts: { truth: rows.map((r) => r[1]), want: wantTrue } });
  }

  // ── 좌표(수학 좌표: 오른쪽이 x, 위쪽이 y. 각은 오른쪽이 0°이고 시계 반대쪽으로 커진다) ──
  const pol = (c, r, a) => [c[0] + r * Math.cos(a * RAD), c[1] + r * Math.sin(a * RAD)];
  const add = (p, q) => [p[0] + q[0], p[1] + q[1]], sub = (p, q) => [p[0] - q[0], p[1] - q[1]];
  const lerp = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
  // 점 p 에서 직선 ab 에 내린 수선의 발
  const foot = (p, a, b) => { const u = sub(b, a), t = ((p[0] - a[0]) * u[0] + (p[1] - a[1]) * u[1]) / (u[0] * u[0] + u[1] * u[1]); return [a[0] + u[0] * t, a[1] + u[1] * t]; };
  // 평행사변형 ABCD(A 왼쪽 위, B 왼쪽 아래, C 오른쪽 아래, D 오른쪽 위): BC = w, AB = s, ∠B = ang
  const para = (w, s, ang) => { const A = pol([0, 0], s, ang); return { A, B: [0, 0], C: [w, 0], D: [A[0] + w, A[1]], O: [(A[0] + w) / 2, A[1] / 2] }; };
  // 두 대각선의 반 OA = p, OB = q 와 ∠AOB = phi 로 지은 평행사변형
  function paraDiag(p, q, phi) {
    const k = 2 * p * q * Math.cos(phi * RAD), ab = Math.sqrt(p * p + q * q - k), bc = Math.sqrt(p * p + q * q + k);
    return para(bc, ab, Math.acos((ab * ab + bc * bc - 4 * p * p) / (2 * ab * bc)) / RAD);
  }
  const rect = (w, h) => ({ A: [0, h], B: [0, 0], C: [w, 0], D: [w, h], O: [w / 2, h / 2] });
  // 마름모 ABCD(A 위, B 왼쪽, C 아래, D 오른쪽): OA = OC = p, OB = OD = q
  const rhom = (p, q) => ({ A: [0, p], B: [-q, 0], C: [0, -p], D: [q, 0], O: [0, 0] });
  // 사다리꼴 ABCD(AD ∥ BC): 윗변 top, 아랫변 base, 높이 h, 점 A 가 점 B 보다 오른쪽으로 shift 만큼
  const trap = (top, base, h, shift) => ({ A: [shift, h], B: [0, 0], C: [base, 0], D: [shift + top, h] });
  // 수학 좌표의 점들을 화면 좌표(y 가 아래로 커진다)로 옮긴다. size: [가로, 세로] 안에 꼭 맞게 키운다.
  function fit(P, size) {
    const keys = Object.keys(P), xs = keys.map((k) => P[k][0]), ys = keys.map((k) => P[k][1]), x0 = Math.min(...xs), y1 = Math.max(...ys);
    const k = Math.min(size[0] / (Math.max(...xs) - x0), size[1] / (y1 - Math.min(...ys))), out = {};
    for (const key of keys) out[key] = [(P[key][0] - x0) * k, (y1 - P[key][1]) * k];
    return out;
  }

  // ── 그림(공용 그림 판 B.kit.mgeo 의 Board 위에 짓는다. 여기부터는 화면 좌표다) ──
  const centre = (pts) => [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];
  // 꼭짓점 v 에서 p 쪽 변과 q 쪽 변 사이(180°보다 작은 쪽)의 한가운데 방향
  const midDir = (v, p, q) => { const a = dirOf(v, p), dl = ((dirOf(v, q) - a + 540) % 360) - 180; return a + dl / 2; };
  // 선분 pq 에서 점 c 의 반대쪽을 보는 방향(변 위의 점에 이름을 적을 쪽)
  const outDir = (p, q, c) => { const m = mid(p, q), a = dirOf(p, q) + 90; return dist(at(m, 1, a), c) > dist(m, c) ? a : a + 180; };
  // 점 k 의 이름을 그 점에서 두 점 쪽으로 벌어진 각 안에 적는다: nameAt(b, g, 'O', 'BC') 는 ∠BOC 안
  const nameAt = (b, g, k, pair) => b.corner(g[k], g[pair[0]], g[pair[1]], k, { arc: false, ink: true });
  // 사각형(또는 다각형)과 꼭짓점 이름. keys: 꼭짓점 이름을 차례로 이은 글('ABCD'), o.fill: 먼저 칠할 도형들(점 이름 글), o.diag: 두 대각선과 점 O, o.through: 점 O 를 지나는 다른 선의 끝점 이름('EF'), o.oIn: 점 O 의 이름을 적을 각('BC' 이면 ∠BOC 안), o.skip: 이름을 따로 적을 꼭짓점들
  function shape(g, keys, o) {
    const opt = o || {}, b = Board(), list = keys.split(''), pts = list.map((k) => g[k]), c = centre(pts);
    for (const f of opt.fill || []) b.poly(f.split('').map((k) => g[k]), TINT);
    b.poly(pts);
    if (opt.diag) b.seg(g.A, g.C, 'thin').seg(g.B, g.D, 'thin');
    list.forEach((k) => { if (!(opt.skip || '').includes(k)) b.name(g[k], k, dirOf(c, g[k])); });
    if (opt.diag && opt.oIn) nameAt(b, g, 'O', opt.oIn); else if (opt.diag) b.nameFree(g.O, 'O', ('ABCD' + (opt.through || '')).split('').map((k) => dirOf(g.O, g[k])));
    b.c = c;
    return b;
  }
  // 선분들을 긋는다: 'AE CF' (kind: 'thin' 가는 선)
  const segs = (b, g, text, kind) => { for (const s of text.split(' ')) b.seg(g[s[0]], g[s[1]], kind); return b; };
  // 변 위의 점의 이름을 도형 바깥쪽에 적는다: on = 그 점이 놓인 변의 두 끝 이름
  const nameOn = (b, g, k, on, gap) => b.name(g[k], k, outDir(g[on[0]], g[on[1]], b.c), gap);
  // 선이 여럿 지나는 점의 이름: 선이 가장 성긴 쪽에 적는다. to = 그 점에서 선이 뻗는 쪽의 점 이름들
  const nameIn = (b, g, k, to) => b.nameFree(g[k], k, to.split('').map((t) => dirOf(g[k], g[t])));
  // 크기가 같은 각의 표시: ∠pvq 의 한가운데에 점(dot)이나 가위표(x)
  const same = (b, g, name, kind, d) => b.sym(g[name[1]], midDir(g[name[1]], g[name[0]], g[name[2]]), kind, d);
  // 각의 크기(또는 표시): ∠ABC 꼴의 이름으로 준다.
  const ang = (b, g, name, label, o) => b.corner(g[name[1]], g[name[0]], g[name[2]], label, o);
  // 변 옆의 길이: 'AB' 의 바깥쪽(점 c 의 반대쪽)에 적는다. toward 를 주면 그 점 쪽에 적는다.
  const len = (b, g, name, label, toward, o) => {
    const p = g[name[0]], q = g[name[1]], m = mid(p, q);
    return b.beside(p, q, label, toward ? [2 * m[0] - g[toward][0], 2 * m[1] - g[toward][1]] : b.c, o);
  };
  // 대각선의 반(점 O 에서 꼭짓점 v 까지)에 길이를 적는다. 그 꼭짓점에서 대각선과 두 변이 이루는 각 가운데 넓은 쪽에 적는다.
  const spread = (v, p, q) => Math.abs(((dirOf(v, q) - dirOf(v, p) + 540) % 360) - 180);
  const lenHalf = (b, g, v, label) => { const i = 'ABCD'.indexOf(v), p = 'ABCD'[(i + 3) % 4], q = 'ABCD'[(i + 1) % 4]; return len(b, g, 'O' + v, label, spread(g[v], g.O, g[p]) >= spread(g[v], g.O, g[q]) ? p : q); };
  const ticks = (b, g, text, n) => { for (const s of text.split(' ')) b.tick(g[s[0]], g[s[1]], n); return b; };
  const arrows = (b, g, text, t) => { for (const s of text.split(' ')) b.arrow(g[s[0]], g[s[1]], t); return b; };
  const deg = (v) => v + '°';
  // 그림 여러 개를 이름표와 함께 늘어놓는다.
  const tiles = (cells) => '<div class="mb-tiles">' + cells.map((c) => '<figure class="mb-tile"><figcaption>' + c.tag + '</figcaption>' + c.svg + '</figure>').join('') + '</div>';

  // ── 평행사변형에 대한 식(기호로 쓴 문장) ──
  const PG_TRUE = [eq('AB', 'DC'), eq('AD', 'BC'), '∠BAD = ∠BCD', '∠ABC = ∠ADC', eq('OA', 'OC'), eq('OB', 'OD'), '∠ABO = ∠CDO', '△OAB ≡ △OCD', '△OAD ≡ △OCB', '∠ABC + ∠BCD = 180°', `${sg('OA')} = ${HALF}${sg('AC')}`];
  const PG_FALSE = [
    [eq('AC', 'BD'), '평행사변형의 두 대각선은 서로 다른 것을 이등분할 뿐, 길이가 같다고 할 수 없다.'],
    [eq('OA', 'OB'), `두 대각선은 서로 다른 것을 이등분하므로 ${eq('OA', 'OC')}, ${eq('OB', 'OD')}이다. ${sg('OA')}와 ${sg('OB')}의 길이가 같다고 할 수 없다.`],
    ['∠ABC = ∠BCD', '이웃한 두 각의 크기의 합이 180°일 뿐, 크기가 같다고 할 수 없다. 크기가 같은 것은 대각이다.'],
    ['△OAD ≡ △OCD', '△OAD와 합동인 삼각형은 △OCB이다.', ['△OAD ≡ △OCB']],
    [eq('AB', 'BC'), '길이가 같은 것은 대변이다. 이웃한 두 변의 길이가 같다고 할 수 없다.'],
    ['∠BAC = ∠DAC', '평행사변형의 대각선이 한 내각을 이등분한다고 할 수 없다.'],
    [perp('AC', 'BD'), '평행사변형의 두 대각선이 서로 수직이라고 할 수 없다.']
  ];

  // 수가 붙은 조건: 평행사변형이 되는 것(yes)과 되지 않는 것(no)
  function numConds(d) {
    const a = d.int(4, 9), b = d.until(() => d.int(5, 12), (v) => v !== a), al = 5 * d.int(21, 26), p = d.int(2, 6), q = d.until(() => d.int(3, 8), (v) => v !== p);
    return {
      yes: [
        `${sg('AB')} = ${cm(a)}, ${sg('BC')} = ${cm(b)}, ${sg('CD')} = ${cm(a)}, ${sg('DA')} = ${cm(b)}`,
        `∠A = ${al}°, ∠B = ${180 - al}°, ∠C = ${al}°`,
        `${sg('OA')} = ${cm(p)}, ${sg('OB')} = ${cm(q)}, ${sg('OC')} = ${cm(p)}, ${sg('OD')} = ${cm(q)}`,
        `${par('AB', 'DC')}, ${sg('AB')} = ${cm(a)}, ${sg('DC')} = ${cm(a)}`
      ],
      no: [
        [`${par('AD', 'BC')}, ${sg('AB')} = ${cm(a)}, ${sg('DC')} = ${cm(a)}`, `${sg('AD')}와 ${sg('BC')}가 평행하고 ${sg('AB')}와 ${sg('DC')}의 길이가 같은 것은, 평행한 대변과 길이가 같은 대변이 서로 다른 쌍이므로 평행사변형이라고 할 수 없다.`],
        [`${sg('AB')} = ${cm(a)}, ${sg('BC')} = ${cm(a)}, ${sg('CD')} = ${cm(b)}, ${sg('DA')} = ${cm(b)}`, `길이가 같은 것이 이웃한 변끼리이다. 대변 ${sg('AB')}와 ${sg('CD')}의 길이가 다르므로 평행사변형이 아니다.`],
        [`∠A = ${al}°, ∠B = ${180 - al}°, ∠D = ${al}°`, `∠C = 360° − (${al}° + ${180 - al}° + ${al}°) = ${180 - al}°이므로 ∠A와 ∠C의 크기가 다르다. 평행사변형이 아니다.`],
        [`${sg('OA')} = ${cm(p)}, ${sg('OB')} = ${cm(p)}, ${sg('OC')} = ${cm(q)}, ${sg('OD')} = ${cm(q)}`, `${sg('OA')}와 ${sg('OC')}의 길이가 다르므로 두 대각선이 서로 다른 것을 이등분하지 않는다. 평행사변형이 아니다.`]
      ]
    };
  }

  // 조건을 판정하는 작은 그림(모두 평행사변형처럼 그린다). kind 마다 적는 수치가 다르다.
  function condTile(d, kind) { return d.until(() => condTileOnce(d, kind), (t) => !t.clash); }
  function condTileOnce(d, kind) {
    const a = d.int(5, 9), bb = a + d.int(2, 4), al = 5 * d.int(21, 24), be = 180 - al, p = d.int(5, 9), q = p + d.int(1, 2);
    const diag = kind === 'diag4', g = fit(diag ? paraDiag(p, q, 74) : para(bb, a, be), diag ? [170, 104] : [128, 80]), b = shape(g, 'ABCD', { diag });
    // 꼭짓점 이름은 적지 않는다(표시와 수치만 본다).
    const pic = Board(); pic.poly([g.A, g.B, g.C, g.D]); pic.c = b.c;
    const L = (name, v) => len(pic, g, name, cm(v)), A_ = (name, v) => ang(pic, g, name, deg(v));
    if (kind === 'sides4') { L('AD', bb); L('BC', bb); L('AB', a); L('DC', a); return { ok: true, clash: pic.clash(), svg: pic.svg(`사각형. 위쪽 변과 아래쪽 변의 길이는 ${cm(bb)}, 왼쪽 변과 오른쪽 변의 길이는 ${cm(a)}`), why: '두 쌍의 대변의 길이가 각각 같으므로 평행사변형이다.' }; }
    if (kind === 'diag4') {
      pic.seg(g.A, g.C, 'thin').seg(g.B, g.D, 'thin');
      len(pic, g, 'OA', cm(p), 'B'); len(pic, g, 'OC', cm(p), 'D'); len(pic, g, 'OB', cm(q), 'C'); len(pic, g, 'OD', cm(q), 'A');
      return { ok: true, clash: pic.clash(), svg: pic.svg(`사각형과 두 대각선. 두 대각선이 만나는 점에서 왼쪽 위 꼭짓점과 오른쪽 아래 꼭짓점까지의 길이는 ${cm(p)}, 왼쪽 아래 꼭짓점과 오른쪽 위 꼭짓점까지의 길이는 ${cm(q)}`), why: '두 대각선이 서로 다른 것을 이등분하므로 평행사변형이다.' };
    }
    if (kind === 'ang3') { A_('BAD', al); A_('ABC', be); A_('BCD', al); return { ok: true, clash: pic.clash(), svg: pic.svg(`사각형. 왼쪽 위 각의 크기는 ${al}°, 왼쪽 아래 각의 크기는 ${be}°, 오른쪽 아래 각의 크기는 ${al}°`), why: `나머지 한 각의 크기가 360° − (${al}° + ${be}° + ${al}°) = ${be}°이므로 두 쌍의 대각의 크기가 각각 같다. 평행사변형이다.` }; }
    if (kind === 'pair') { L('AD', bb); L('BC', bb); A_('BAD', al); A_('ABC', be); return { ok: true, clash: pic.clash(), svg: pic.svg(`사각형. 위쪽 변과 아래쪽 변의 길이는 ${cm(bb)}, 왼쪽 위 각의 크기는 ${al}°, 왼쪽 아래 각의 크기는 ${be}°`), why: `왼쪽 변의 양 끝 각의 크기의 합이 ${al}° + ${be}° = 180°이므로 위쪽 변과 아래쪽 변이 평행하고, 그 길이가 같다. 평행사변형이다.` }; }
    if (kind === 'other') { L('AD', bb); L('BC', bb); A_('BAD', al); A_('ADC', be); return { ok: false, clash: pic.clash(), svg: pic.svg(`사각형. 위쪽 변과 아래쪽 변의 길이는 ${cm(bb)}, 왼쪽 위 각의 크기는 ${al}°, 오른쪽 위 각의 크기는 ${be}°`), why: `위쪽 변의 양 끝 각의 크기의 합이 ${al}° + ${be}° = 180°이므로 평행한 것은 왼쪽 변과 오른쪽 변이고, 길이가 같은 것은 위쪽 변과 아래쪽 변이다. 평행한 대변과 길이가 같은 대변이 서로 다른 쌍이므로 평행사변형이라고 할 수 없다.` }; }
    if (kind === 'mix') { L('AD', bb); L('BC', bb); A_('ABC', be); A_('ADC', be); return { ok: false, clash: pic.clash(), svg: pic.svg(`사각형. 위쪽 변과 아래쪽 변의 길이는 ${cm(bb)}, 왼쪽 아래 각의 크기는 ${be}°, 오른쪽 위 각의 크기는 ${be}°`), why: '한 쌍의 대변의 길이가 같고 한 쌍의 대각의 크기가 같은 것만으로는 평행사변형이라고 할 수 없다.' }; }
    if (kind === 'adj') { L('AB', a); A_('BAD', al); A_('ABC', be); return { ok: false, clash: pic.clash(), svg: pic.svg(`사각형. 왼쪽 변의 길이는 ${cm(a)}, 왼쪽 위 각의 크기는 ${al}°, 왼쪽 아래 각의 크기는 ${be}°`), why: `왼쪽 변의 양 끝 각의 크기의 합이 180°이므로 위쪽 변과 아래쪽 변이 평행하다. 한 쌍의 대변이 평행한 것만으로는 평행사변형이라고 할 수 없다.` }; }
    L('AB', a); L('DC', a); A_('BAD', al);
    return { ok: false, clash: pic.clash(), svg: pic.svg(`사각형. 왼쪽 변과 오른쪽 변의 길이는 ${cm(a)}, 왼쪽 위 각의 크기는 ${al}°`), why: '한 쌍의 대변의 길이가 같은 것만으로는 평행사변형이라고 할 수 없다.' };
  }

  B.addUnit({
    id: '8-2-2', grade: 8, semester: 2, no: 2, title: '사각형의 성질', version: 2,
    groups: [
      {
        id: 'prop', title: '평행사변형의 성질', standard: STD,
        types: [
          T('prop-word', '평행사변형의 성질을 나타낸 문장의 빈칸', '①1', (d) => {
            const [row, right, wrongs, why] = d.pick([
              [`평행사변형의 두 쌍의 ${box()}의 길이는 각각 같다.`, '대변', ['대각', '대각선', '이웃하는 변'], '사각형에서 서로 마주 보는 변을 대변이라 한다. 평행사변형의 두 쌍의 대변의 길이는 각각 같다.'],
              [`평행사변형의 두 쌍의 ${box()}의 크기는 각각 같다.`, '대각', ['대변', '이웃하는 각', '엇각'], '사각형에서 서로 마주 보는 각을 대각이라 한다. 평행사변형의 두 쌍의 대각의 크기는 각각 같다.'],
              [`평행사변형의 두 대각선은 서로 다른 것을 ${box()}한다.`, '이등분', ['수직이등분', '삼등분', '사등분'], '평행사변형의 두 대각선은 서로 다른 것을 이등분한다. 수직으로 만난다고 할 수는 없다.']
            ]);
            return pickOne(d, '다음 문장의 □ 안에 알맞은 말은?', right, wrongs, { figure: lines([row]), explain: why });
          }),
          T('prop-side-expr', '변의 길이가 식으로 주어진 평행사변형', '②1 심1', (d, n) => {
            if (n === 0) {
              const th = d.int(62, 74), draw = (w) => { const g = fit(para(w.a, w.c, th), [150, 96]), b = shape(g, 'ABCD'); len(b, g, 'AD', cm(w.a)); len(b, g, 'BC', `(${w.p}${sv('x')} − ${w.q}) cm`); len(b, g, 'AB', `${w.r}${sv('y')} cm`); len(b, g, 'DC', cm(w.c)); return b; };
              const v = d.until(() => { const x = d.int(3, 9), p = d.pick([2, 3]), q = d.int(1, 6), y = d.int(2, 6), r = d.pick([2, 3]); return { x, p, q, y, r, a: p * x - q, c: r * y }; }, (w) => w.a >= 9 && w.a <= 20 && w.c >= 5 && w.c <= 12 && w.a - w.c >= 3 && w.x !== w.y && !draw(w).clash()), b = draw(v);
              return M(`평행사변형 ABCD에서 ${sg('AD')} = ${cm(v.a)}, ${sg('BC')} = ${nb(`(${v.p}${X} − ${v.q}) cm`)}, ${sg('AB')} = ${nb(`${v.r}${Y} cm`)}, ${sg('DC')} = ${cm(v.c)}일 때, ${X}, ${Y}의 값을 차례로 구하시오.`, [{ label: X, answer: v.x }, { label: Y, answer: v.y }], {
                figure: b.svg(`${SAY_PG} 변 AD의 길이는 ${cm(v.a)}, 변 BC의 길이는 (${v.p}x − ${v.q}) cm, 변 AB의 길이는 ${v.r}y cm, 변 DC의 길이는 ${cm(v.c)}`),
                explain: `평행사변형의 두 쌍의 대변의 길이는 각각 같다. ${v.p}${X} − ${v.q} = ${v.a}에서 ${X} = ${v.x}, ${v.r}${Y} = ${v.c}에서 ${Y} = ${v.y}이다.`,
                facts: { calc: [[`(${v.a}+${v.q})/${v.p}`, 0], [`${v.c}/${v.r}`, 1]] }
              });
            }
            const v = d.until(() => {
              const x = d.int(2, 6), p = d.pick([2, 3, 4]), q = d.int(1, 5), y = d.int(2, 5), r = d.pick([2, 3]), a = p * x + q, e = 2 * r * y, th = d.int(64, 74), k = a * Math.cos(th * RAD);
              return { x, p, q, y, r, a, e, th, ab: e > a * Math.sin(th * RAD) ? -k + Math.sqrt(k * k - a * a + e * e) : 0 };
            }, (w) => w.a >= 9 && w.a <= 18 && w.e > w.a && w.ab > 0.45 * w.a && w.ab < 0.85 * w.a && w.x !== w.y);
            const g = fit(para(v.a, v.ab, v.th), [170, 100]), b = shape(g, 'ABCD', { diag: true });
            len(b, g, 'AD', cm(v.a)); len(b, g, 'BC', `(${v.p}${sv('x')} + ${v.q}) cm`);   // 선분 OB 의 길이(식)는 글에만 적는다 — 좁은 삼각형 안이라 그림에 적으면 변에 걸린다.
            return M(`평행사변형 ABCD에서 두 대각선의 교점을 O라 하자. ${sg('AD')} = ${cm(v.a)}, ${sg('BC')} = ${nb(`(${v.p}${X} + ${v.q}) cm`)}, ${sg('BD')} = ${cm(v.e)}, ${sg('OB')} = ${nb(`${v.r}${Y} cm`)}일 때, ${X}, ${Y}의 값을 차례로 구하시오.`, [{ label: X, answer: v.x }, { label: Y, answer: v.y }], {
              figure: b.svg(`${SAY_PG}${SAY_O} 변 AD의 길이는 ${cm(v.a)}, 변 BC의 길이는 (${v.p}x + ${v.q}) cm`),
              explain: `대변의 길이가 같으므로 ${v.p}${X} + ${v.q} = ${v.a}에서 ${X} = ${v.x}이다. 두 대각선은 서로 다른 것을 이등분하므로 ${sg('OB')} = ${HALF}${sg('BD')}, 곧 ${v.r}${Y} = ${v.e / 2}에서 ${Y} = ${v.y}이다.`,
              facts: { calc: [[`(${v.a}-${v.q})/${v.p}`, 0], [`${v.e}/2/${v.r}`, 1]], unseen: [2] }
            });
          }, { count: 2 }),
          T('prop-perim-ratio', '둘레의 길이와 이웃한 두 변의 길이의 비', '②2', (d) => {
            const [m, n] = d.pick([[4, 3], [2, 3], [3, 5], [2, 5], [3, 4], [1, 2], [5, 7]]), u = d.int(2, 5), P = 2 * (m + n) * u, askAD = d.bool(), k = askAD ? n : m;
            return lenQ(`평행사변형 ABCD의 둘레의 길이가 ${cm(P)}이고 ${nb(`${sg('AB')} : ${sg('BC')} = ${m} : ${n}`)}일 때, ${sg(askAD ? 'AD' : 'DC')}의 길이는 몇 cm인가?`, k * u, {
              explain: `대변의 길이가 같으므로 ${sg('AB')} + ${sg('BC')} = ${P} ÷ 2 = ${P / 2} (cm)이다. ${sg(askAD ? 'BC' : 'AB')} = ${P / 2} × ${frac(k, `${m} + ${n}`)} = ${k * u} (cm)이고, ${sg(askAD ? 'AD' : 'DC')}는 그 대변이므로 ${cm(k * u)}이다.`,
              facts: { calc: [[`${P}/2*${k}/(${m}+${n})`, 0]], unseen: [2] }
            });
          }),
          T('prop-diag-xy', '두 대각선이 서로 다른 것을 이등분함을 이용한 길이', '①3 ②5', (d) => {
            const v = d.until(() => ({ p: d.int(3, 9), q: d.int(4, 10), phi: d.int(64, 80) }), (w) => w.p !== w.q && w.p / w.q >= 0.7 && w.p / w.q <= 1.4);
            const g = fit(paraDiag(v.p, v.q, v.phi), [190, 120]), b = shape(g, 'ABCD', { diag: true });
            len(b, g, 'OA', cm(v.p), 'B');
            return M(`평행사변형 ABCD에서 두 대각선의 교점을 O라 하자. ${sg('OA')} = ${cm(v.p)}, ${sg('BD')} = ${cm(2 * v.q)}일 때, ${sg('AC')}, ${sg('OB')}의 길이를 차례로 구하시오.`, [{ label: sg('AC'), answer: 2 * v.p, unit: 'cm' }, { label: sg('OB'), answer: v.q, unit: 'cm' }], {
              figure: b.svg(`${SAY_PG}${SAY_O} 선분 OA의 길이는 ${cm(v.p)}`),
              explain: `평행사변형의 두 대각선은 서로 다른 것을 이등분한다. ${sg('AC')} = 2 × ${sg('OA')} = ${2 * v.p} (cm), ${sg('OB')} = ${HALF} × ${sg('BD')} = ${v.q} (cm)이다.`,
              facts: { calc: [[`${v.p}*2`, 0], [`${2 * v.q}/2`, 1]], unseen: [2] }
            });
          }),
          T('prop-tri-perim', '변과 대각선의 길이로 삼각형의 둘레의 길이 구하기', '①4 ②6', (d) => {
            const cosOf = (w) => (w.p * w.p + w.q * w.q - w.s * w.s) / (2 * w.p * w.q);
            const v = d.until(() => ({ s: d.int(4, 12), p: d.int(4, 9), q: d.int(4, 10) }), (w) => w.p !== w.q && w.s !== w.p && w.s !== w.q && w.p / w.q >= 0.7 && w.p / w.q <= 1.4 && cosOf(w) >= 0.1 && cosOf(w) <= 0.5);
            const phi = Math.acos(cosOf(v)) / RAD, g = fit(paraDiag(v.p, v.q, phi), [190, 120]), b = shape(g, 'ABCD', { diag: true, fill: ['OCD'] });
            len(b, g, 'AB', cm(v.s)); len(b, g, 'OB', cm(v.q), 'A', { t: 0.36 });
            return lenQ(`평행사변형 ABCD에서 두 대각선의 교점을 O라 하자. ${sg('AB')} = ${cm(v.s)}, ${sg('AC')} = ${cm(2 * v.p)}, ${sg('OB')} = ${cm(v.q)}일 때, △OCD의 둘레의 길이는 몇 cm인가?`, v.s + v.p + v.q, {
              figure: b.svg(`${SAY_PG}${SAY_O} 삼각형 OCD가 색칠되어 있다. 변 AB의 길이는 ${cm(v.s)}, 선분 OB의 길이는 ${cm(v.q)}`),
              explain: `${sg('CD')} = ${sg('AB')} = ${cm(v.s)}, ${sg('OC')} = ${HALF} × ${sg('AC')} = ${v.p} (cm), ${sg('OD')} = ${sg('OB')} = ${cm(v.q)}이다. △OCD의 둘레의 길이는 ${v.s} + ${v.p} + ${v.q} = ${v.s + v.p + v.q} (cm)이다.`,
              facts: { calc: [[`${v.s}+${2 * v.p}/2+${v.q}`, 0]], unseen: [2] }
            });
          }),
          T('prop-ratio', '이웃한 두 내각의 크기의 비', '①6', (d) => {
            const [m, n] = d.pick([[3, 2], [7, 5], [5, 4], [2, 1], [5, 1], [3, 1], [7, 2], [4, 1], [11, 7], [13, 5], [8, 7]]), askC = d.bool(), k = askC ? m : n, v = 180 * k / (m + n);
            return degQ(`평행사변형 ABCD에서 ${nb(`∠A : ∠B = ${m} : ${n}`)}일 때, ∠${askC ? 'C' : 'D'}의 크기는?`, v, {
              explain: `평행사변형에서 이웃한 두 내각의 크기의 합은 180°이므로 ∠${askC ? 'A' : 'B'} = 180° × ${frac(k, `${m} + ${n}`)} = ${v}°이다. 대각의 크기는 같으므로 ∠${askC ? 'C' : 'D'} = ∠${askC ? 'A' : 'B'} = ${v}°이다.`,
              facts: { calc: [[`180*${k}/(${m}+${n})`, 0]], unseen: [180] }
            });
          }),
          T('prop-diag-angle', '두 대각선이 변과 이루는 각', '①7 심3', (d) => {
            const draw = (w) => { const g = fit(paraDiag(1, Math.sin(w.a * RAD) / Math.sin(w.b * RAD), 180 - w.a - w.b), [190, 110]), b = shape(g, 'ABCD', { diag: true }); ang(b, g, 'BAC', deg(w.a)); ang(b, g, 'BDC', deg(w.b)); return b; };
            const v = d.until(() => ({ a: d.int(40, 62), b: d.int(28, 48) }), (w) => w.a + w.b >= 76 && w.a + w.b <= 104 && w.a - w.b >= 4 && !draw(w).clash());
            return degQ(`평행사변형 ABCD에서 두 대각선의 교점을 O라 하자. ∠BAC = ${v.a}°, ∠BDC = ${v.b}°일 때, ∠DBC와 ∠ACB의 크기의 합은?`, 180 - v.a - v.b, {
              figure: draw(v).svg(`${SAY_PG}${SAY_O} ∠BAC = ${v.a}°, ∠BDC = ${v.b}°`),
              explain: `${par('AB', 'DC')}이므로 ∠ABD = ∠BDC = ${v.b}°(엇각)이다. △ABC의 세 내각의 크기의 합은 180°이므로 ${v.a}° + ${v.b}° + ∠DBC + ∠ACB = 180°이다. 따라서 ∠DBC + ∠ACB = ${180 - v.a - v.b}°이다.`,
              facts: { calc: [[`180-${v.a}-${v.b}`, 0]], unseen: [180] }
            });
          }),
          T('prop-seg-angle', '선분 하나가 그어진 평행사변형의 각', '②4 ①8', (d, n) => {
            if (n === 0) {
              const v = d.until(() => ({ a: d.int(40, 68), c: d.int(35, 60) }), (w) => 180 - w.a - w.c >= 60 && 180 - w.a - w.c <= 80 && Math.abs(w.a - w.c) >= 5), x = 180 - v.a - v.c;
              const g = fit(para(Math.sin(v.c * RAD), Math.sin(v.a * RAD), x), [170, 118]), b = shape(g, 'ABCD');
              b.seg(g.A, g.C, 'thin'); ang(b, g, 'CAD', deg(v.a)); ang(b, g, 'ACD', deg(v.c));
              return degQ(`평행사변형 ABCD에서 ∠DAC = ${v.a}°, ∠ACD = ${v.c}°일 때, ∠B의 크기는?`, x, {
                figure: b.svg(`${SAY_PG} 대각선 AC가 그어져 있다. ∠DAC = ${v.a}°, ∠ACD = ${v.c}°`),
                explain: `△ACD에서 ∠D = 180° − (${v.a}° + ${v.c}°) = ${x}°이다. 평행사변형의 대각의 크기는 같으므로 ∠B = ∠D = ${x}°이다.`,
                facts: { calc: [[`180-(${v.a}+${v.c})`, 0]], unseen: [180] }
              });
            }
            const v = d.until(() => { const a = d.int(25, 40), c = d.int(105, 125), t = d.pick([0.5, 0.56, 0.62, 0.68]); return { a, c, t, w: t * Math.sin((c - a) * RAD) / Math.sin(a * RAD) }; }, (w) => w.w >= 1.15 && w.w <= 1.9);
            const P = para(v.w, 1, 180 - v.c); P.E = lerp(P.D, P.C, v.t);
            const g = fit(P, [180, 100]), b = shape(g, 'ABCD');
            b.seg(g.A, g.E); nameOn(b, g, 'E', 'DC'); ang(b, g, 'DAE', deg(v.a)); ang(b, g, 'BCD', deg(v.c));
            return degQ(`평행사변형 ABCD에서 변 DC 위에 점 E가 있다. ∠DAE = ${v.a}°, ∠BCD = ${v.c}°일 때, ∠AED의 크기는?`, v.c - v.a, {
              figure: b.svg(`${SAY_PG} 변 DC 위에 점 E가 있고 선분 AE가 그어져 있다. ∠DAE = ${v.a}°, ∠BCD = ${v.c}°`),
              explain: `이웃한 두 내각의 크기의 합은 180°이므로 ∠D = 180° − ${v.c}° = ${180 - v.c}°이다. △AED에서 ∠AED = 180° − (${v.a}° + ${180 - v.c}°) = ${v.c - v.a}°이다.`,
              facts: { calc: [[`180-${v.a}-(180-${v.c})`, 0]], unseen: [180] }
            });
          }, { count: 2 }),
          T('prop-claims', '두 대각선을 그은 평행사변형에 대한 식 가리기', '①9 ②7', (d) => {
            const wantTrue = d.bool(), g = fit(para(1.6, 1, d.int(60, 70)), [170, 96]);
            return sayQ(d, `평행사변형 ABCD에서 두 대각선의 교점을 O라 할 때, 다음 중 ${wantTrue ? '항상 옳은' : '옳지 않은'} 것은?`, PG_TRUE, PG_FALSE, wantTrue, shape(g, 'ABCD', { diag: true }).svg(SAY_PG + SAY_O));
          }),
          T('prop-through-o-claims', '두 대각선의 교점을 지나는 직선에 대한 식 가리기', '②8 심5', (d) => {
            const P = para(1.6, 1, d.int(62, 70)); P.E = lerp(P.B, P.A, 0.34); P.F = [2 * P.O[0] - P.E[0], 2 * P.O[1] - P.E[1]];
            const g = fit(P, [180, 104]), b = shape(g, 'ABCD', { diag: true, through: 'EF' });
            b.seg(g.E, g.F); nameOn(b, g, 'E', 'AB'); nameOn(b, g, 'F', 'DC');
            const yes = [eq('OE', 'OF'), '∠AEO = ∠CFO', '∠AOE = ∠COF', '△OAE ≡ △OCF', eq('AE', 'CF'), eq('BE', 'DF'), '△OBE ≡ △ODF'];
            const no = [
              [eq('OD', 'DF'), `△ODF가 이등변삼각형이라고 할 수 없으므로 ${sg('OD')}와 ${sg('DF')}의 길이가 같다고 할 수 없다.`],
              ['∠BOE = ∠COF', '∠BOE의 맞꼭지각은 ∠DOF이다. ∠COF와 크기가 같은 각은 ∠AOE이다.', ['∠AOE = ∠COF']],
              ['∠AEO = ∠DFO', `${par('AB', 'DC')}이므로 ∠AEO와 엇각으로 크기가 같은 각은 ∠CFO이다.`, ['∠AEO = ∠CFO']],
              [eq('OE', 'OB'), `△OAE ≡ △OCF이므로 ${sg('OE')}와 길이가 같은 선분은 ${sg('OF')}이다.`, [eq('OE', 'OF')]],
              [eq('AE', 'BE'), `점 E가 변 AB의 중점이라고 할 수 없다.`]
            ];
            const wantTrue = d.next() < 0.3;
            return sayQ(d, `평행사변형 ABCD의 두 대각선의 교점 O를 지나는 직선이 변 AB, DC와 만나는 점을 각각 E, F라 할 때, 다음 중 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, yes, no, wantTrue,
              b.svg(`${SAY_PG}${SAY_O} 점 O를 지나는 직선이 변 AB와 점 E에서, 변 DC와 점 F에서 만난다`));
          }),
          T('prop-inner-lines', '내부의 한 점을 지나고 두 변에 평행한 두 직선', '①10 심4', (d) => {
            const v = d.until(() => ({ dl: d.int(56, 72), s: d.int(6, 9), w: d.int(9, 14), h: d.int(4, 6) }), (x) => x.w - x.s >= 2 && x.w - x.h >= 4 && x.w - 2 * x.h !== 0);
            const P = para(v.w, v.s, v.dl), t = d.pick([0.4, 0.45, 0.55]);
            P.H = [v.w - v.h, 0]; P.E = lerp(P.B, P.A, t); P.P = add(P.E, P.H); P.F = add(P.E, P.C); P.G = add(P.H, P.A);
            const g = fit(P, [190, 104]), b = shape(g, 'ABCD');
            segs(b, g, 'EF GH', 'thin'); nameOn(b, g, 'E', 'AB'); nameOn(b, g, 'F', 'DC'); nameOn(b, g, 'G', 'AD'); b.name(g.H, 'H', 232, 12); nameIn(b, g, 'P', 'EFGH');
            ang(b, g, 'ADC', deg(v.dl)); len(b, g, 'HC', cm(v.h));
            return M(`평행사변형 ABCD의 내부의 한 점 P를 지나고 변 AD에 평행한 직선이 변 AB, DC와 만나는 점을 각각 E, F라 하고, 변 AB에 평행한 직선이 변 AD, BC와 만나는 점을 각각 G, H라 하자. ∠D = ${v.dl}°, ${sg('AD')} = ${cm(v.w)}, ${sg('HC')} = ${cm(v.h)}일 때, ${sg('EP')}의 길이와 ∠BEP의 크기를 차례로 구하시오.`,
              [{ label: sg('EP'), answer: v.w - v.h, unit: 'cm' }, { label: '∠BEP', answer: 180 - v.dl, unit: '°' }], {
                figure: b.svg(`${SAY_PG} 내부의 점 P를 지나고 변 AD에 평행한 선분 EF(점 E는 변 AB 위, 점 F는 변 DC 위)와 변 AB에 평행한 선분 GH(점 G는 변 AD 위, 점 H는 변 BC 위)가 그어져 있다. ∠D = ${v.dl}°, 선분 HC의 길이는 ${cm(v.h)}`),
                explain: `□EBHP는 두 쌍의 대변이 각각 평행하므로 평행사변형이다. ${sg('BC')} = ${sg('AD')} = ${cm(v.w)}이므로 ${sg('EP')} = ${sg('BH')} = ${v.w} − ${v.h} = ${v.w - v.h} (cm)이다. ∠B = ∠D = ${v.dl}°이고 이웃한 두 내각의 크기의 합은 180°이므로 ∠BEP = 180° − ${v.dl}° = ${180 - v.dl}°이다.`,
                facts: { calc: [[`${v.w}-${v.h}`, 0], [`180-${v.dl}`, 1]], unseen: [180] }
              });
          })
        ]
      },
      { id: 'use', title: '평행사변형의 성질의 활용', standard: STD, types: [] },
      { id: 'cond', title: '평행사변형이 되는 조건', standard: STD, types: [] },
      { id: 'area', title: '평행사변형과 넓이', standard: STD, types: [] },
      { id: 'kinds', title: '직사각형, 마름모, 정사각형의 성질', standard: STD, types: [] },
      { id: 'trap', title: '등변사다리꼴의 성질', standard: STD, types: [] },
      { id: 'rel', title: '여러 가지 사각형 사이의 관계', standard: STD, types: [] },
      { id: 'par', title: '평행선과 넓이', standard: STD, types: [] }
    ]
  });

  // 이등분선의 표시: 꼭짓점 v 의 내각을 이등분선이 지나는 점 e 로 나눈 두 각에 같은 표시를 한다. name = 'ADC' 꼴(가운데가 꼭짓점), e = 이등분선 위의 점 이름
  const halves = (b, g, name, e, kind, dd) => { same(b, g, name[0] + name[1] + e, kind, dd); same(b, g, e + name[1] + name[2], kind, dd); return b; };

  B.addTypes(UNIT, 'use', [
    T('use-bis-len', '한 내각의 이등분선이 대변과 만날 때 선분의 길이', '①11 ②9', (d) => {
      const v = d.until(() => ({ s: d.int(4, 9), w: d.int(7, 15) }), (x) => x.w - x.s >= 2 && x.w - x.s <= 7 && x.w <= 2 * x.s + 1 && x.w !== 2 * x.s), fromD = d.bool();
      const P = para(v.w, v.s, d.int(60, 72)); P.E = fromD ? [v.w - v.s, 0] : [v.s, 0];
      const g = fit(P, [185, 100]), b = shape(g, 'ABCD');
      b.seg(fromD ? g.D : g.A, g.E); nameOn(b, g, 'E', 'BC'); halves(b, g, fromD ? 'ADC' : 'BAD', 'E', 'dot', 24); len(b, g, 'AB', cm(v.s)); len(b, g, 'AD', cm(v.w));
      const ask = fromD ? 'BE' : 'EC', iso = fromD ? 'CDE' : 'ABE';
      return lenQ(`평행사변형 ABCD에서 ∠${fromD ? 'D' : 'A'}의 이등분선이 변 BC와 만나는 점을 E라 하자. ${sg('AB')} = ${cm(v.s)}, ${sg('AD')} = ${cm(v.w)}일 때, ${sg(ask)}의 길이는 몇 cm인가?`, v.w - v.s, {
        figure: b.svg(`${SAY_PG} 변 BC 위에 점 E가 있고 선분 ${fromD ? 'DE' : 'AE'}가 그어져 있다. ${fromD ? '∠ADE와 ∠CDE' : '∠BAE와 ∠DAE'}에 같은 표시가 있다. 변 AB의 길이는 ${cm(v.s)}, 변 AD의 길이는 ${cm(v.w)}`),
        explain: fromD
          ? `${par('AD', 'BC')}이므로 ∠ADE = ∠CED(엇각)이고, ∠ADE = ∠CDE이므로 ∠CED = ∠CDE이다. △${iso}는 이등변삼각형이므로 ${sg('CE')} = ${sg('CD')} = ${sg('AB')} = ${cm(v.s)}이다. ${sg('BC')} = ${sg('AD')} = ${cm(v.w)}이므로 ${sg('BE')} = ${v.w} − ${v.s} = ${v.w - v.s} (cm)이다.`
          : `${par('AD', 'BC')}이므로 ∠DAE = ∠BEA(엇각)이고, ∠DAE = ∠BAE이므로 ∠BEA = ∠BAE이다. △${iso}는 이등변삼각형이므로 ${sg('BE')} = ${sg('AB')} = ${cm(v.s)}이다. ${sg('BC')} = ${sg('AD')} = ${cm(v.w)}이므로 ${sg('EC')} = ${v.w} − ${v.s} = ${v.w - v.s} (cm)이다.`,
        facts: { calc: [[`${v.w}-${v.s}`, 0]] }
      });
    }),
    T('use-bis-two', '이웃한 두 내각의 이등분선이 한 변과 만나는 두 점 사이의 길이', '①12 ②12', (d) => {
      const v = d.until(() => ({ s: d.int(5, 10), w: d.int(8, 17) }), (x) => 2 * x.s - x.w >= 2 && x.w - x.s >= 2);
      const P = para(v.w, v.s, d.int(62, 72)); P.E = [v.s, 0]; P.F = [v.w - v.s, 0];
      const g = fit(P, [190, 100]), b = shape(g, 'ABCD');
      segs(b, g, 'AE DF'); nameOn(b, g, 'E', 'BC'); nameOn(b, g, 'F', 'BC'); halves(b, g, 'BAD', 'E', 'dot', 22); halves(b, g, 'ADC', 'F', 'x', 24); len(b, g, 'AD', cm(v.w)); len(b, g, 'DC', cm(v.s));
      return lenQ(`평행사변형 ABCD에서 ∠A, ∠D의 이등분선이 변 BC와 만나는 점을 각각 E, F라 하자. ${sg('AD')} = ${cm(v.w)}, ${sg('DC')} = ${cm(v.s)}일 때, ${sg('EF')}의 길이는 몇 cm인가?`, 2 * v.s - v.w, {
        figure: b.svg(`${SAY_PG} 변 BC 위에 점 B에서 가까운 쪽부터 점 F, 점 E가 있고 선분 AE, 선분 DF가 그어져 있다. ∠BAE와 ∠DAE에 같은 표시(점)가, ∠ADF와 ∠CDF에 같은 표시(가위표)가 있다. 변 AD의 길이는 ${cm(v.w)}, 변 DC의 길이는 ${cm(v.s)}`),
        explain: `${par('AD', 'BC')}이므로 ∠DAE = ∠BEA(엇각)이고, △ABE는 ${sg('BE')} = ${sg('AB')} = ${cm(v.s)}인 이등변삼각형이다. 같은 방법으로 △DCF는 ${sg('CF')} = ${sg('DC')} = ${cm(v.s)}인 이등변삼각형이다. ${sg('BC')} = ${cm(v.w)}이므로 ${sg('EF')} = ${sg('BE')} + ${sg('CF')} − ${sg('BC')} = ${v.s} + ${v.s} − ${v.w} = ${2 * v.s - v.w} (cm)이다.`,
        facts: { calc: [[`${v.s}+${v.s}-${v.w}`, 0]] }
      });
    }),
    T('use-bis-opp', '마주 보는 두 내각의 이등분선', '①12 심6', (d, n) => {
      const v = d.until(() => ({ s: d.int(5, 10), c: d.int(6, 12), w: d.int(9, 16) }), (x) => x.c > x.s && x.c <= 1.26 * x.s && x.w - x.s >= 3 && x.w - x.s <= 6), angB = 2 * Math.asin(v.c / (2 * v.s)) / RAD;
      const P = n === 0 ? para(v.w, v.s, angB) : para(1.65, 1, d.int(68, 76)), s = n === 0 ? v.s : 1; P.E = [s, 0]; P.F = [P.D[0] - s, P.D[1]];
      const g = fit(P, [185, 104]), b = shape(g, 'ABCD');
      segs(b, g, 'AE CF'); nameOn(b, g, 'E', 'BC'); nameOn(b, g, 'F', 'AD'); halves(b, g, 'BAD', 'E', 'dot', 22); halves(b, g, 'BCD', 'F', 'x', 22);
      const said = `${SAY_PG} 변 BC 위에 점 E, 변 AD 위에 점 F가 있고 선분 AE, 선분 CF가 그어져 있다. ∠BAE와 ∠DAE에 같은 표시(점)가, ∠BCF와 ∠DCF에 같은 표시(가위표)가 있다.`;
      const head = '평행사변형 ABCD에서 ∠A, ∠C의 이등분선이 변 BC, AD와 만나는 점을 각각 E, F라 하자.';
      if (n === 0) {
        len(b, g, 'AB', cm(v.s)); len(b, g, 'CF', cm(v.c), 'D');
        return lenQ(`${head} ${sg('AB')} = ${cm(v.s)}, ${sg('AD')} = ${cm(v.w)}, ${sg('CF')} = ${cm(v.c)}일 때, △ABE의 둘레의 길이는 몇 cm인가?`, 2 * v.s + v.c, {
          figure: b.svg(`${said} 변 AB의 길이는 ${cm(v.s)}, 선분 CF의 길이는 ${cm(v.c)}`),
          explain: `${par('AD', 'BC')}이므로 ∠DAE = ∠BEA(엇각)이고, △ABE는 ${sg('BE')} = ${sg('AB')} = ${cm(v.s)}인 이등변삼각형이다. ∠BEA = ${HALF}∠A = ${HALF}∠C = ∠BCF(동위각)이므로 ${par('AE', 'FC')}이고, ${par('AF', 'EC')}이므로 □AECF는 평행사변형이다. 따라서 ${sg('AE')} = ${sg('CF')} = ${cm(v.c)}이고, △ABE의 둘레의 길이는 ${v.s} + ${v.s} + ${v.c} = ${2 * v.s + v.c} (cm)이다.`,
          facts: { calc: [[`${v.s}+${v.s}+${v.c}`, 0]] }
        });
      }
      const yes = [eq('AB', 'BE'), eq('AB', 'FD'), eq('AE', 'CF'), eq('AF', 'EC'), '∠BEA = ∠DFC', '△ABE ≡ △CDF', par('AE', 'FC')];
      const no = [
        ['∠AEC = ∠BAD', `∠AEC = 180° − ${HALF}∠BAD이므로 ∠BAD와 크기가 같다고 할 수 없다.`],
        [eq('AE', 'BE'), `△ABE는 ${eq('AB', 'BE')}인 이등변삼각형이다. ${sg('AE')}와 ${sg('BE')}의 길이가 같다고 할 수 없다.`, [eq('AB', 'BE')]],
        ['∠BAE = ∠ABE', `△ABE에서 크기가 같은 두 각은 ∠BAE와 ∠BEA이다.`],
        [eq('AF', 'FD'), '점 F가 변 AD의 중점이라고 할 수 없다.']
      ];
      return sayQ(d, `${head} 다음 중 옳지 않은 것은?`, yes, no, false, b.svg(said));
    }, { count: 2 }),
    T('use-bis-equi', '한 내각의 크기가 60°인 평행사변형과 마주 보는 두 내각의 이등분선', '②14 심8', (d) => {
      const draw = (x) => {
        const P = para(x.w, x.s, 60); P.E = [x.s, 0]; P.F = [P.D[0] - x.s, P.D[1]];
        const g = fit(P, [190, 104]), b = shape(g, 'ABCD');
        segs(b, g, 'AE CF'); nameOn(b, g, 'E', 'BC'); nameOn(b, g, 'F', 'AD'); halves(b, g, 'BAD', 'E', 'dot', 22); halves(b, g, 'BCD', 'F', 'x', 22); ang(b, g, 'ADC', '60°'); len(b, g, 'DC', cm(x.s)); len(b, g, 'AD', cm(x.w));
        return b;
      };
      const v = d.until(() => ({ s: d.int(5, 11), w: d.int(9, 16) }), (x) => x.w - x.s >= 3 && x.w <= 1.7 * x.s && !draw(x).clash());
      return lenQ(`평행사변형 ABCD에서 ∠A, ∠C의 이등분선이 변 BC, AD와 만나는 점을 각각 E, F라 하자. ${sg('AD')} = ${cm(v.w)}, ${sg('DC')} = ${cm(v.s)}, ∠D = 60°일 때, □AECF의 둘레의 길이는 몇 cm인가?`, 2 * v.w, {
        figure: draw(v).svg(`${SAY_PG} 변 BC 위에 점 E, 변 AD 위에 점 F가 있고 선분 AE, 선분 CF가 그어져 있다. ∠BAE와 ∠DAE에 같은 표시(점)가, ∠BCF와 ∠DCF에 같은 표시(가위표)가 있다. ∠D = 60°, 변 AD의 길이는 ${cm(v.w)}, 변 DC의 길이는 ${cm(v.s)}`),
        explain: `∠B = ∠D = 60°이고 ∠BAD = 180° − 60° = 120°이므로 ∠BAE = 60°이다. △ABE는 두 각의 크기가 60°이므로 정삼각형이고 ${sg('AE')} = ${sg('BE')} = ${sg('AB')} = ${cm(v.s)}이다. ${sg('EC')} = ${v.w} − ${v.s} = ${v.w - v.s} (cm)이고 □AECF는 평행사변형이므로 둘레의 길이는 2 × (${v.s} + ${v.w - v.s}) = ${2 * v.w} (cm)이다.`,
        facts: { calc: [[`2*(${v.s}+${v.w}-${v.s})`, 0]], unseen: [2] }
      });
    }),
    T('use-bis-angle', '한 내각의 이등분선과 각의 크기', '①13 ②10', (d, n) => {
      if (n === 0) {
        const e = d.int(28, 40), P = para(1.62, 1, 2 * e); P.E = [P.A[0] + 1, P.A[1]];
        const g = fit(P, [185, 100]), b = shape(g, 'ABCD');
        b.seg(g.B, g.E); nameOn(b, g, 'E', 'AD'); halves(b, g, 'ABC', 'E', 'dot', 26); ang(b, g, 'AEB', deg(e));
        return degQ(`평행사변형 ABCD에서 ∠B의 이등분선이 변 AD와 만나는 점을 E라 하자. ∠AEB = ${e}°일 때, ∠BCD의 크기는?`, 180 - 2 * e, {
          figure: b.svg(`${SAY_PG} 변 AD 위에 점 E가 있고 선분 BE가 그어져 있다. ∠ABE와 ∠CBE에 같은 표시가 있다. ∠AEB = ${e}°`),
          explain: `${par('AD', 'BC')}이므로 ∠CBE = ∠AEB = ${e}°(엇각)이다. ∠ABC = 2 × ${e}° = ${2 * e}°이고 이웃한 두 내각의 크기의 합은 180°이므로 ∠BCD = 180° − ${2 * e}° = ${180 - 2 * e}°이다.`,
          facts: { calc: [[`180-2*${e}`, 0]], unseen: [180, 2] }
        });
      }
      const be = 2 * d.int(30, 40), P = para(1.62, 1, be); P.E = [P.D[0] - 1, P.D[1]];
      const g = fit(P, [185, 100]), b = shape(g, 'ABCD');
      b.seg(g.C, g.E); nameOn(b, g, 'E', 'AD'); halves(b, g, 'BCD', 'E', 'dot', 22); ang(b, g, 'ABC', deg(be));
      return degQ(`평행사변형 ABCD에서 ∠C의 이등분선이 변 AD와 만나는 점을 E라 하자. ∠B = ${be}°일 때, ∠AEC의 크기는?`, 90 + be / 2, {
        figure: b.svg(`${SAY_PG} 변 AD 위에 점 E가 있고 선분 CE가 그어져 있다. ∠BCE와 ∠DCE에 같은 표시가 있다. ∠B = ${be}°`),
        explain: `∠BCD = 180° − ${be}° = ${180 - be}°이므로 ∠BCE = ${(180 - be) / 2}°이다. ${par('AD', 'BC')}이므로 ∠DEC = ∠BCE = ${(180 - be) / 2}°(엇각)이고, ∠AEC = 180° − ${(180 - be) / 2}° = ${90 + be / 2}°이다.`,
        facts: { calc: [[`180-(180-${be})/2`, 0]], unseen: [180, 2] }
      });
    }, { count: 2 }),
    T('use-bis-adj', '이웃한 두 내각의 이등분선이 이루는 각', '①14 ②13', (d, n) => {
      if (n === 0) {
        const P = para(1.7, 1, d.int(62, 74)); P.P = mid(P.A, [1, 0]);
        const g = fit(P, [185, 104]), b = shape(g, 'ABCD');
        segs(b, g, 'AP BP'); nameIn(b, g, 'P', 'AB'); halves(b, g, 'BAD', 'P', 'dot', 20); halves(b, g, 'ABC', 'P', 'x', 22);
        return degQ('평행사변형 ABCD에서 ∠A의 이등분선과 ∠B의 이등분선이 만나는 점을 P라 할 때, ∠APB의 크기는?', 90, {
          figure: b.svg(`${SAY_PG} 내부의 점 P와 선분 AP, 선분 BP가 그어져 있다. ∠BAP와 ∠DAP에 같은 표시(점)가, ∠ABP와 ∠CBP에 같은 표시(가위표)가 있다`),
          explain: `이웃한 두 내각의 크기의 합은 180°이므로 ∠BAD + ∠ABC = 180°이다. ∠PAB + ∠PBA = ${HALF} × 180° = 90°이므로 △ABP에서 ∠APB = 180° − 90° = 90°이다.`,
          facts: { calc: [['180-180/2', 0]], unseen: [180, 2] }
        });
      }
      const f = d.int(140, 151), bb = 2 * (180 - f), P = para(1.62, 1, bb); P.E = [1, 0]; P.F = [P.A[0] + 1, P.A[1]];
      const g = fit(P, [190, 106]), b = shape(g, 'ABCD');
      segs(b, g, 'AE BF'); nameOn(b, g, 'E', 'BC'); nameOn(b, g, 'F', 'AD'); halves(b, g, 'BAD', 'E', 'dot', 20); halves(b, g, 'ABC', 'F', 'x', 24); ang(b, g, 'BFD', deg(f));
      return degQ(`평행사변형 ABCD에서 ∠A의 이등분선이 변 BC와 만나는 점을 E, ∠B의 이등분선이 변 AD와 만나는 점을 F라 하자. ∠BFD = ${f}°일 때, ∠AEC의 크기는?`, 270 - f, {
        figure: b.svg(`${SAY_PG} 변 BC 위에 점 E, 변 AD 위에 점 F가 있고 선분 AE, 선분 BF가 그어져 있다. ∠BAE와 ∠DAE에 같은 표시(점)가, ∠ABF와 ∠CBF에 같은 표시(가위표)가 있다. ∠BFD = ${f}°`),
        explain: `∠AFB = 180° − ${f}° = ${180 - f}°이고 ${par('AD', 'BC')}이므로 ∠CBF = ∠AFB = ${180 - f}°(엇각)이다. ∠ABC = 2 × ${180 - f}° = ${bb}°, ∠BAD = 180° − ${bb}° = ${180 - bb}°이므로 ∠BAE = ${(180 - bb) / 2}°이다. ∠AEC는 △ABE의 외각이므로 ∠AEC = ${bb}° + ${(180 - bb) / 2}° = ${270 - f}°이다.`,
        facts: { calc: [[`2*(180-${f})+(180-2*(180-${f}))/2`, 0]], unseen: [180, 2] }
      });
    }, { count: 2 }),
    T('use-bis-ext', '한 내각의 이등분선이 대변의 연장선과 만날 때', '②11', (d, n) => {
      const v = d.until(() => ({ s: d.int(4, 8), w: d.int(7, 13) }), (x) => x.w - x.s >= 2 && x.w - x.s <= 5), e = d.int(29, 37);
      // 각을 적는 그림은 점 E 를 점 D 에서 멀리 둔다(좁은 각 ∠BEC 에 적은 글이 변 AD 에 걸리지 않게).
      const P = n === 0 ? para(v.w, v.s, d.int(60, 70)) : para(2.25, 1, 2 * e), k = n === 0 ? v.w / v.s : 2.25; P.E = lerp(P.C, P.D, k);
      const g = fit(P, n === 0 ? [180, 150] : [205, 150]), b = shape(g, 'ABCD');
      segs(b, g, 'BE DE'); b.name(g.E, 'E', 70); halves(b, g, 'ABC', 'E', 'dot', 26);
      const head = '평행사변형 ABCD에서 ∠B의 이등분선이 변 CD의 연장선과 만나는 점을 E라 하자.', said = `${SAY_PG} 변 CD를 점 D 너머로 늘인 선 위에 점 E가 있고 선분 BE가 그어져 있다. ∠ABE와 ∠CBE에 같은 표시가 있다.`;
      if (n === 0) {
        len(b, g, 'AB', cm(v.s)); len(b, g, 'BC', cm(v.w));
        return lenQ(`${head} ${sg('AB')} = ${cm(v.s)}, ${sg('BC')} = ${cm(v.w)}일 때, ${sg('DE')}의 길이는 몇 cm인가?`, v.w - v.s, {
          figure: b.svg(`${said} 변 AB의 길이는 ${cm(v.s)}, 변 BC의 길이는 ${cm(v.w)}`),
          explain: `${par('AB', 'CE')}이므로 ∠ABE = ∠BEC(엇각)이고, ∠ABE = ∠CBE이므로 ∠BEC = ∠CBE이다. △BCE는 이등변삼각형이므로 ${sg('CE')} = ${sg('BC')} = ${cm(v.w)}이다. ${sg('CD')} = ${sg('AB')} = ${cm(v.s)}이므로 ${sg('DE')} = ${v.w} − ${v.s} = ${v.w - v.s} (cm)이다.`,
          facts: { calc: [[`${v.w}-${v.s}`, 0]] }
        });
      }
      ang(b, g, 'BEC', deg(e));
      return degQ(`${head} ∠BEC = ${e}°일 때, ∠ADC의 크기는?`, 2 * e, {
        figure: b.svg(`${said} ∠BEC = ${e}°`),
        explain: `${par('AB', 'CE')}이므로 ∠ABE = ∠BEC = ${e}°(엇각)이다. ∠ABC = 2 × ${e}° = ${2 * e}°이고 대각의 크기는 같으므로 ∠ADC = ∠ABC = ${2 * e}°이다.`,
        facts: { calc: [[`2*${e}`, 0]], unseen: [2] }
      });
    }, { count: 2 }),
    T('use-diag-bis', '대각선과 변이 이루는 각의 이등분선이 변의 연장선과 만날 때', '①15 ②15 심10', (d) => {
      const v = d.until(() => ({ be: d.int(60, 75), ga: d.int(46, 58) }), (x) => (180 - x.be - x.ga) % 2 === 0 && 180 - x.be - x.ga >= 52 && 180 - x.be - x.ga <= 76), two = 180 - v.be - v.ga, th = two / 2;
      const P = para(Math.sin(v.ga * RAD), Math.sin(two * RAD), v.be); P.E = [P.C[0] + dist(P.A, P.C), 0];
      const g = fit(P, [236, 104]), b = shape(g, 'ABCD');
      b.seg(g.A, g.C, 'thin').seg(g.A, g.E).seg(g.C, g.E); b.name(g.E, 'E', 290); halves(b, g, 'DAC', 'E', 'dot', 30); ang(b, g, 'ABC', deg(v.be)); ang(b, g, 'ACD', deg(v.ga));
      return degQ(`평행사변형 ABCD에서 ∠DAC의 이등분선이 변 BC의 연장선과 만나는 점을 E라 하자. ∠B = ${v.be}°, ∠ACD = ${v.ga}°일 때, ∠AEC의 크기는?`, th, {
        figure: b.svg(`${SAY_PG} 대각선 AC가 그어져 있다. 변 BC를 점 C 너머로 늘인 선 위에 점 E가 있고, 선분 AE는 변 DC를 가로지른다. ∠DAE와 ∠CAE에 같은 표시가 있다. ∠B = ${v.be}°, ∠ACD = ${v.ga}°`),
        explain: `대각의 크기는 같으므로 ∠D = ∠B = ${v.be}°이다. △ACD에서 ∠DAC = 180° − (${v.be}° + ${v.ga}°) = ${two}°이므로 ∠DAE = ${th}°이다. ${par('AD', 'BE')}이므로 ∠AEC = ∠DAE = ${th}°(엇각)이다.`,
        facts: { calc: [[`(180-${v.be}-${v.ga})/2`, 0]], unseen: [180, 2] }
      });
    }),
    T('use-bis-four', '네 내각의 이등분선이 만드는 사각형', '①16 심42', (d) => {
      const a = d.int(62, 72), P = para(d.pick([1.85, 1.9, 2]), 1, a), n = d.int(4, 9);
      const ray = (k, dir) => [P[k], pol(P[k], 1, dir)], rA = ray('A', (a - 180) / 2), rB = ray('B', a / 2), rC = ray('C', (180 + a) / 2), rD = ray('D', 180 + a / 2);
      P.E = meet(rA[0], rA[1], rB[0], rB[1]); P.F = meet(rA[0], rA[1], rD[0], rD[1]); P.G = meet(rC[0], rC[1], rD[0], rD[1]); P.H = meet(rB[0], rB[1], rC[0], rC[1]);
      const g = fit(P, [245, 124]), b = shape(g, 'ABCD', { fill: ['EFGH'] });
      segs(b, g, 'AF BH CH DF', 'thin'); nameAt(b, g, 'E', 'AB'); nameAt(b, g, 'G', 'CD'); nameAt(b, g, 'F', 'EG'); nameAt(b, g, 'H', 'EG');
      halves(b, g, 'BAD', 'F', 'dot', 20); halves(b, g, 'BCD', 'H', 'dot', 20); halves(b, g, 'ABC', 'H', 'x', 22); halves(b, g, 'ADC', 'F', 'x', 22);
      return lenQ(`평행사변형 ABCD에서 네 내각의 이등분선이 만나는 점을 그림과 같이 E, F, G, H라 하자. ${sg('EG')} = ${cm(n)}일 때, ${sg('HF')}의 길이는 몇 cm인가?`, n, {
        figure: b.svg(`${SAY_PG} 네 내각의 이등분선이 그어져 있고, 네 이등분선이 가운데에 만드는 사각형 EFGH가 색칠되어 있다. 점 E는 ∠A의 이등분선과 ∠B의 이등분선이, 점 F는 ∠A의 이등분선과 ∠D의 이등분선이, 점 G는 ∠C의 이등분선과 ∠D의 이등분선이, 점 H는 ∠B의 이등분선과 ∠C의 이등분선이 만나는 점이다`),
        explain: `∠BAD + ∠ABC = 180°이므로 △ABE에서 ∠EAB + ∠EBA = 90°이고 ∠AEB = 90°이다. 맞꼭지각으로 ∠HEF = 90°이고, 같은 방법으로 □EFGH의 네 내각의 크기는 모두 90°이다. □EFGH는 직사각형이고 직사각형의 두 대각선의 길이는 같으므로 ${sg('HF')} = ${sg('EG')} = ${cm(n)}이다.`,
        facts: { calc: [[String(n), 0]] }
      });
    }),
    T('use-mid-ext', '한 변의 중점을 지나는 선분의 연장선', '①17', (d) => {
      const v = d.until(() => ({ s: d.int(3, 6), w: d.int(7, 13) }), (x) => x.w - x.s >= 3 && x.w <= 2.4 * x.s);
      const P = para(v.w, v.s, d.int(58, 68)); P.E = [v.w / 2, 0]; P.F = [-P.A[0], -P.A[1]];
      const g = fit(P, [185, 150]), b = shape(g, 'ABCD');
      segs(b, g, 'DF BF'); nameIn(b, g, 'E', 'BCDF'); b.name(g.F, 'F', 235); ticks(b, g, 'BE EC', 2); len(b, g, 'AD', cm(v.w)); len(b, g, 'DC', cm(v.s));
      return lenQ(`평행사변형 ABCD에서 변 BC의 중점을 E라 하고, 선분 DE의 연장선이 변 AB의 연장선과 만나는 점을 F라 하자. ${sg('AD')} = ${cm(v.w)}, ${sg('DC')} = ${cm(v.s)}일 때, ${sg('AF')}의 길이는 몇 cm인가?`, 2 * v.s, {
        figure: b.svg(`${SAY_PG} 변 BC 위의 점 E에서 선분 BE와 선분 EC에 같은 표시가 있다. 선분 DE를 점 E 너머로 늘인 선과 변 AB를 점 B 너머로 늘인 선이 점 F에서 만난다. 변 AD의 길이는 ${cm(v.w)}, 변 DC의 길이는 ${cm(v.s)}`),
        explain: `△DEC와 △FEB에서 ${eq('EC', 'EB')}, ∠DEC = ∠FEB(맞꼭지각), ${par('AF', 'DC')}이므로 ∠DCE = ∠FBE(엇각)이다. △DEC ≡ △FEB (ASA 합동)이므로 ${sg('BF')} = ${sg('CD')} = ${cm(v.s)}이다. ${sg('AB')} = ${sg('DC')} = ${cm(v.s)}이므로 ${sg('AF')} = ${v.s} + ${v.s} = ${2 * v.s} (cm)이다.`,
        facts: { calc: [[`${v.s}+${v.s}`, 0]] }
      });
    }),
    T('use-iso-angle', '이등변삼각형이 끼어 있는 평행사변형의 각', '①18 ②16', (d, n) => {
      if (n === 0) {
        const dl = d.int(56, 71), c = Math.cos(dl * RAD), P = para(2 * c + d.pick([0.5, 0.6, 0.7]), 1, dl); P.E = [2 * c, 0]; P.F = meet(P.A, P.E, P.D, P.C);
        const g = fit(P, [180, 150]), b = shape(g, 'ABCD');
        segs(b, g, 'AF CF'); nameIn(b, g, 'E', 'ABCF'); b.name(g.F, 'F', 270); ticks(b, g, 'AB AE', 1); ang(b, g, 'ADC', deg(dl));
        return M(`평행사변형 ABCD에서 변 BC 위에 ${eq('AB', 'AE')}가 되도록 점 E를 잡고, 선분 AE의 연장선이 변 DC의 연장선과 만나는 점을 F라 하자. ∠D = ${dl}°일 때, ∠DAE와 ∠AFD의 크기를 차례로 구하시오.`, [{ label: '∠DAE', answer: dl, unit: '°' }, { label: '∠AFD', answer: 180 - 2 * dl, unit: '°' }], {
          figure: b.svg(`${SAY_PG} 변 BC 위에 점 E가 있고, 선분 AB와 선분 AE에 같은 표시가 있다. 선분 AE를 점 E 너머로 늘인 선과 변 DC를 점 C 너머로 늘인 선이 점 F에서 만난다. ∠D = ${dl}°`),
          explain: `∠B = ∠D = ${dl}°이고 ${eq('AB', 'AE')}이므로 ∠AEB = ${dl}°이다. ${par('AD', 'BC')}이므로 ∠DAE = ∠AEB = ${dl}°(엇각)이다. △ABE에서 ∠BAE = 180° − 2 × ${dl}° = ${180 - 2 * dl}°이고, ${par('AB', 'DF')}이므로 ∠AFD = ∠BAE = ${180 - 2 * dl}°(엇각)이다.`,
          facts: { calc: [[String(dl), 0], [`180-2*${dl}`, 1]], unseen: [180, 2] }
        });
      }
      const be = 2 * d.int(32, 38), c = Math.cos(be * RAD), P = para(2 * c, 1, be); P.E = [2 * c + 1, 0];
      const g = fit(P, [215, 112]), b = shape(g, 'ABCD');
      b.seg(g.A, g.C).seg(g.A, g.E).seg(g.C, g.E); b.name(g.E, 'E', 300); ticks(b, g, 'AB AC CE', 1); ang(b, g, 'ABC', deg(be));
      return degQ(`평행사변형 ABCD에서 ${eq('AB', 'AC')}이고, 변 BC의 연장선 위에 ${eq('AC', 'CE')}가 되도록 점 E를 잡았다. ∠B = ${be}°일 때, ∠DAE의 크기는?`, be / 2, {
        figure: b.svg(`${SAY_PG} 대각선 AC가 그어져 있다. 변 BC를 점 C 너머로 늘인 선 위에 점 E가 있고 선분 AE가 그어져 있다. 선분 AB, 선분 AC, 선분 CE에 같은 표시가 있다. ∠B = ${be}°`),
        explain: `${eq('AB', 'AC')}이므로 ∠ACB = ∠B = ${be}°이다. ${eq('CA', 'CE')}이므로 ∠CAE = ∠CEA이고, ∠ACB는 △ACE의 외각이므로 ∠CEA = ${HALF} × ${be}° = ${be / 2}°이다. ${par('AD', 'BE')}이므로 ∠DAE = ∠CEA = ${be / 2}°(엇각)이다.`,
        facts: { calc: [[`${be}/2`, 0]], unseen: [2] }
      });
    }, { count: 2 }),
    T('use-iso-inside', '이등변삼각형 안의 평행사변형의 둘레의 길이', '심13', (d) => {
      const L = d.int(8, 15), a = d.int(62, 70), c = Math.cos(a * RAD), t = d.pick([0.35, 0.4, 0.62]);
      const P = { A: [0, Math.sin(a * RAD)], B: [-c, 0], C: [c, 0] }; P.Q = lerp(P.B, P.C, t); P.P = lerp(P.B, P.A, t); P.R = lerp(P.C, P.A, 1 - t);
      const g = fit(P, [150, 150]), b = shape(g, 'ABC', { fill: ['APQR'] });
      segs(b, g, 'PQ QR'); nameOn(b, g, 'P', 'AB'); nameOn(b, g, 'Q', 'BC'); nameOn(b, g, 'R', 'AC'); len(b, g, 'BA', cm(L), null, { t: 0.84 }); len(b, g, 'CA', cm(L), null, { t: 0.84 });
      return lenQ(`${eq('AB', 'AC')} = ${cm(L)}인 이등변삼각형 ABC에서 변 AB, BC, CA 위에 각각 점 P, Q, R를 잡아 ${par('AB', 'RQ')}, ${par('AC', 'PQ')}가 되도록 하였다. □APQR의 둘레의 길이는 몇 cm인가?`, 2 * L, {
        figure: b.svg(`이등변삼각형 ABC. 점 A는 위, 점 B는 왼쪽 아래, 점 C는 오른쪽 아래에 있다. 변 AB 위에 점 P, 변 BC 위에 점 Q, 변 CA 위에 점 R가 있고 사각형 APQR가 색칠되어 있다. 변 AB의 길이와 변 AC의 길이는 ${cm(L)}`),
        explain: `${par('AC', 'PQ')}이므로 ∠PQB = ∠C(동위각)이고 ∠B = ∠C이므로 △PBQ는 ${eq('PB', 'PQ')}인 이등변삼각형이다. 같은 방법으로 ${eq('RQ', 'RC')}이다. □APQR의 둘레의 길이는 ${sg('AP')} + ${sg('PQ')} + ${sg('QR')} + ${sg('RA')} = ${sg('AP')} + ${sg('PB')} + ${sg('RC')} + ${sg('RA')} = ${sg('AB')} + ${sg('AC')} = ${2 * L} (cm)이다.`,
        facts: { calc: [[`${L}+${L}`, 0]] }
      });
    })
  ]);

  // ── 평행사변형이 되는 조건 ──
  const COND_YES = [`${eq('AB', 'DC')}, ${eq('AD', 'BC')}`, '∠A = ∠C, ∠B = ∠D', `${eq('OA', 'OC')}, ${eq('OB', 'OD')}`, `${par('AB', 'DC')}, ${par('AD', 'BC')}`, `${par('AD', 'BC')}, ${eq('AD', 'BC')}`, `${par('AB', 'DC')}, ${eq('AB', 'DC')}`];
  const COND_NO = [
    [`${par('AB', 'DC')}, ${eq('AD', 'BC')}`, `${sg('AB')}와 ${sg('DC')}가 평행하고 ${sg('AD')}와 ${sg('BC')}의 길이가 같은 것은, 평행한 대변과 길이가 같은 대변이 서로 다른 쌍이므로 평행사변형이 되는 조건이 아니다.`],
    [`${eq('OA', 'OB')}, ${eq('OC', 'OD')}`, `두 대각선이 서로 다른 것을 이등분하려면 ${eq('OA', 'OC')}, ${eq('OB', 'OD')}이어야 한다.`],
    [`${eq('AB', 'BC')}, ${eq('CD', 'DA')}`, '길이가 같은 것이 이웃한 변끼리이다. 두 쌍의 대변의 길이가 각각 같아야 한다.'],
    ['∠A = ∠B, ∠C = ∠D', '크기가 같은 것이 이웃한 각끼리이다. 두 쌍의 대각의 크기가 각각 같아야 한다.'],
    [eq('AC', 'BD'), '두 대각선의 길이가 같은 것만으로는 평행사변형이라고 할 수 없다.']
  ];
  const COND_WHY = '평행사변형이 되는 조건은 「두 쌍의 대변이 각각 평행하다」「두 쌍의 대변의 길이가 각각 같다」「두 쌍의 대각의 크기가 각각 같다」「두 대각선이 서로 다른 것을 이등분한다」「한 쌍의 대변이 평행하고 그 길이가 같다」의 다섯 가지이다.';
  // 사각형 ABCD(평행사변형 모양)와 표시
  const quadFig = (o) => { const g = fit(para(1.6, 1, 66), [165, 96]); return { g, b: shape(g, 'ABCD', o) }; };

  B.addTypes(UNIT, 'cond', [
    T('cond-word', '평행사변형이 되는 조건을 기호로 나타내기', '②19 ①24', (d) => {
      const i = d.int(0, 4), trap1 = [`${par('AB', 'DC')}, ${eq('AD', 'BC')}`, `${eq('AB', 'BC')}, ${eq('CD', 'DA')}`, '∠A = ∠B, ∠C = ∠D', `${eq('OA', 'OB')}, ${eq('OC', 'OD')}`, `${par('AD', 'BC')}, ${eq('AB', 'DC')}`][i];
      const mine = [COND_YES[3], COND_YES[0], COND_YES[1], COND_YES[2], COND_YES[4]], others = d.shuffle(mine.filter((_, k) => k !== i && !(i === 0 && k === 4) && !(i === 4 && k === 0))).slice(0, 2);
      return pickOne(d, `□ABCD가 평행사변형이 되는 조건 「${FIVE[i]}」를 기호로 바르게 나타낸 것은? ${O_NOTE}`, mine[i], others.concat([trap1]), {
        explain: `「${FIVE[i]}」를 기호로 나타내면 ${mine[i]}이다. ${i === 1 ? '대변은 서로 마주 보는 변이다.' : i === 2 ? '대각은 서로 마주 보는 각이다.' : i === 3 ? '두 대각선이 서로 다른 것을 이등분하면 점 O는 두 대각선 AC, BD의 중점이다.' : i === 4 ? '평행한 대변과 길이가 같은 대변이 같은 쌍이어야 한다.' : '두 쌍의 대변이 모두 평행해야 한다.'}`
      });
    }),
    T('cond-symbols', '기호로 쓴 조건 가운데 평행사변형이 되는 조건', '①20 ②20 심14', (d, n) => {
      if (n === 0) {
        const wantTrue = d.next() < 0.35;
        const q = sayQ(d, `다음 중 □ABCD가 평행사변형이 되는 조건${wantTrue ? '은' : '이 아닌 것은'}? ${O_NOTE}`, COND_YES, COND_NO, wantTrue);
        q.explain += ' ' + COND_WHY;
        return q;
      }
      const k = d.pick([2, 3]), rows = d.shuffle(d.shuffle(COND_YES).slice(0, k).map((s) => [s, true]).concat(d.shuffle(COND_NO).slice(0, 5 - k).map((r) => [r[0], false, r[1]])));
      return allQ(d, `다음 ㄱ~ㅁ 가운데 □ABCD가 평행사변형이 되는 조건을 모두 고른 것은? ${O_NOTE}`, TAGS, rows.map((r) => r[1]), {
        figure: tagged(rows.map((r) => r[0]), TAGS),
        explain: rows.map((r, i) => (r[1] ? '' : `${TAGS[i]}. ${r[2]}`)).filter(Boolean).join(' ') + ' 나머지는 평행사변형이 되는 조건이다.'
      });
    }, { count: 2 }),
    T('cond-nums', '수치로 준 조건에서 평행사변형인 것', '①21 ②20', (d, n) => {
      const c = numConds(d), wantTrue = n === 0;
      return sayQ(d, wantTrue ? `다음 중 □ABCD가 평행사변형인 것은? ${O_NOTE}` : `다음 중 □ABCD가 평행사변형이라고 할 수 없는 것은? ${O_NOTE}`, c.yes, c.no, wantTrue);
    }, { count: 2 }),
    T('cond-fig', '수치가 적힌 사각형 그림 가운데 평행사변형인 것', '①22 ②23', (d) => {
      const wantTrue = d.bool(), kinds = d.shuffle(d.shuffle(['sides4', 'diag4', 'ang3', 'pair']).slice(0, wantTrue ? 1 : 3).concat(d.shuffle(['other', 'mix', 'adj', 'eq1']).slice(0, wantTrue ? 3 : 1)));
      const cells = kinds.map((k) => condTile(d, k)), hit = cells.findIndex((c) => c.ok === wantTrue);
      return C(`다음 ㉠~㉣ 가운데 그림에 적힌 길이와 각의 크기만으로 평행사변형이라고 할 수 ${wantTrue ? '있는' : '없는'} 것은?`, SYM, hit, {
        figure: tiles(cells.map((c, i) => ({ tag: SYM[i], svg: c.svg }))),
        explain: wantTrue ? `${SYM[hit]}: ${cells[hit].why} 나머지는 평행사변형이 되는 조건에 맞지 않는다.` : `${SYM[hit]}: ${cells[hit].why}`,
        facts: { truth: cells.map((c) => c.ok), want: wantTrue }
      });
    }),
    T('cond-make', '평행사변형이 되도록 하는 미지수의 값', '①23 ②25 ②26 ②27 ②28', (d, n) => {
      const ask = `□ABCD가 평행사변형이 되도록 하는 ${X}, ${Y}의 값을 차례로 구하시오.`, said = '사각형 ABCD. 점 A는 왼쪽 위, 점 B는 왼쪽 아래, 점 C는 오른쪽 아래, 점 D는 오른쪽 위에 있다.';
      if (n === 0) {
        const bc = d.int(7, 12), al = d.int(105, 124), g = fit(para(bc, bc * d.pick([0.55, 0.6, 0.66]), 180 - al), [160, 96]), b = shape(g, 'ABCD');
        len(b, g, 'AD', `${sv('x')} cm`); len(b, g, 'BC', cm(bc)); ang(b, g, 'BAD', deg(al)); ang(b, g, 'ABC', `${sv('y')}°`);
        return M(`□ABCD에서 ${sg('AD')} = ${nb(`${X} cm`)}, ${sg('BC')} = ${cm(bc)}, ∠A = ${al}°, ∠B = ${Y}°이다. ${ask}`, [{ label: X, answer: bc }, { label: Y, answer: 180 - al }], {
          figure: b.svg(`${said} 변 AD의 길이는 x cm, 변 BC의 길이는 ${cm(bc)}, ∠A = ${al}°, ∠B = y°`),
          explain: `∠A + ∠B = 180°이면 ${par('AD', 'BC')}이므로 ${Y} = 180 − ${al} = ${180 - al}이다. 한 쌍의 대변이 평행하고 그 길이가 같아야 하므로 ${sg('AD')} = ${sg('BC')}에서 ${X} = ${bc}이다.`,
          facts: { calc: [[String(bc), 0], [`180-${al}`, 1]], unseen: [180] }
        });
      }
      if (n === 1) {
        const c = d.int(3, 8), a = d.int(45, 60), th = d.int(62, 74), g = fit(para(Math.sin(a * RAD) / Math.sin((a + th) * RAD), 1, th), [150, 110]), b = shape(g, 'ABCD');
        b.seg(g.A, g.C, 'thin'); len(b, g, 'AB', `${sv('x')} cm`); len(b, g, 'DC', cm(c)); ang(b, g, 'BAC', deg(a)); ang(b, g, 'ACD', `${sv('y')}°`);
        return M(`□ABCD에서 ${sg('AB')} = ${nb(`${X} cm`)}, ${sg('DC')} = ${cm(c)}, ∠BAC = ${a}°, ∠ACD = ${Y}°이다. ${ask}`, [{ label: X, answer: c }, { label: Y, answer: a }], {
          figure: b.svg(`${said} 대각선 AC가 그어져 있다. 변 AB의 길이는 x cm, 변 DC의 길이는 ${cm(c)}, ∠BAC = ${a}°, ∠ACD = y°`),
          explain: `엇각의 크기가 같으면 두 직선은 평행하므로 ∠ACD = ∠BAC, 곧 ${Y} = ${a}이면 ${par('AB', 'DC')}이다. 한 쌍의 대변이 평행하고 그 길이가 같아야 하므로 ${sg('AB')} = ${sg('DC')}에서 ${X} = ${c}이다.`,
          facts: { calc: [[String(c), 0], [String(a), 1]] }
        });
      }
      if (n === 2) {
        const th = d.int(64, 72), draw = (w) => { const g = fit(para(w.w, w.side, th), [112, 88]), b = shape(g, 'ABCD'); len(b, g, 'AD', cm(w.w)); len(b, g, 'BC', cm(w.w)); len(b, g, 'AB', `(${w.p}${sv('x')} − ${w.q}) cm`); len(b, g, 'DC', `(${w.r}${sv('x')} + ${w.t}) cm`); return b; };
        const v = d.until(() => { const x = d.int(3, 8), p = d.pick([3, 4, 5]), r = p - d.pick([1, 2]), q = d.int(1, 6); return { x, p, r, q, t: (p - r) * x - q, side: p * x - q, w: d.int(9, 15) }; }, (w) => w.r >= 2 && w.t >= 1 && w.t <= 9 && w.side >= 6 && w.side <= 13 && w.w - w.side >= 2 && !draw(w).clash()), b = draw(v);
        return N(`□ABCD에서 ${eq('AD', 'BC')} = ${cm(v.w)}, ${sg('AB')} = ${nb(`(${v.p}${X} − ${v.q}) cm`)}, ${sg('DC')} = ${nb(`(${v.r}${X} + ${v.t}) cm`)}이다. □ABCD가 평행사변형이 되도록 하는 ${X}의 값은?`, v.x, {
          figure: b.svg(`${said} 변 AD와 변 BC의 길이는 ${cm(v.w)}, 변 AB의 길이는 (${v.p}x − ${v.q}) cm, 변 DC의 길이는 (${v.r}x + ${v.t}) cm`),
          explain: `${eq('AD', 'BC')}이므로 두 쌍의 대변의 길이가 각각 같으려면 ${eq('AB', 'DC')}이어야 한다. ${v.p}${X} − ${v.q} = ${v.r}${X} + ${v.t}에서 ${v.p - v.r === 1 ? '' : v.p - v.r}${X} = ${v.q + v.t}, ${X} = ${v.x}이다.`,
          facts: { calc: [[`(${v.q}+${v.t})/(${v.p}-${v.r})`, 0]] }
        });
      }
      const v = d.until(() => ({ p: d.int(4, 11), q: d.int(5, 13), phi: d.int(66, 80) }), (w) => w.p !== w.q && w.p / w.q >= 0.75 && w.p / w.q <= 1.33);
      const g = fit(paraDiag(v.p, v.q, v.phi), [200, 126]), b = shape(g, 'ABCD', { diag: true });
      len(b, g, 'OA', `${sv('x')} cm`, 'B'); len(b, g, 'OC', cm(v.p), 'D'); len(b, g, 'OB', `${sv('y')} cm`, 'C');
      return M(`□ABCD에서 두 대각선의 교점을 O라 하자. ${sg('OA')} = ${nb(`${X} cm`)}, ${sg('OC')} = ${cm(v.p)}, ${sg('OB')} = ${nb(`${Y} cm`)}, ${sg('BD')} = ${cm(2 * v.q)}이다. ${ask}`, [{ label: X, answer: v.p }, { label: Y, answer: v.q }], {
        figure: b.svg(`${said}${SAY_O} 선분 OA의 길이는 x cm, 선분 OC의 길이는 ${cm(v.p)}, 선분 OB의 길이는 y cm`),
        explain: `두 대각선이 서로 다른 것을 이등분하면 평행사변형이다. ${eq('OA', 'OC')}에서 ${X} = ${v.p}, ${sg('OB')} = ${HALF}${sg('BD')}에서 ${Y} = ${v.q}이다.`,
        facts: { calc: [[String(v.p), 0], [`${2 * v.q}/2`, 1]], unseen: [2] }
      });
    }, { count: 4 }),
    T('cond-proof', '평행사변형이 되는 조건을 설명하는 과정의 빈칸', '①25 ①26 ②29', (d, n) => {
      if (n === 0) {
        const f = quadFig({ diag: true }); ticks(f.b, f.g, 'OA OC', 1); ticks(f.b, f.g, 'OB OD', 2);
        const rows = ['△ABO와 △CDO에서', `${eq('OA', 'OC')}, ${eq('OB', 'OD')}, ∠AOB = ㈎ (맞꼭지각)`, '이므로 △ABO ≡ △CDO (㈏ 합동)이다.', `따라서 ∠BAO = ∠DCO이므로 ${sg('AB')} ㈐ ${sg('DC')}이다.`, `같은 방법으로 △ADO ≡ △CBO이므로 ${par('AD', 'BC')}이다.`, '두 쌍의 대변이 각각 평행하므로 □ABCD는 평행사변형이다.'];
        return pickOne(d, '다음은 두 대각선이 서로 다른 것을 이등분하는 □ABCD가 평행사변형임을 설명하는 과정이다. ㈎, ㈏, ㈐에 알맞은 것을 차례로 나열한 것은?', '∠COD, SAS, ∥', ['∠AOD, SAS, ∥', '∠COD, ASA, ∥', '∠COD, SAS, ='], {
          figure: f.b.svg('사각형 ABCD와 두 대각선. 두 대각선이 점 O에서 만난다. 선분 OA와 선분 OC에 같은 표시(한 줄), 선분 OB와 선분 OD에 같은 표시(두 줄)가 있다') + lines(rows),
          explain: `∠AOB의 맞꼭지각은 ∠COD이다. 두 변의 길이가 각각 같고 그 끼인각의 크기가 같으므로 SAS 합동이다. ∠BAO와 ∠DCO는 엇각이고 그 크기가 같으므로 ${par('AB', 'DC')}이다.`
        });
      }
      const f = quadFig(); f.b.seg(f.g.A, f.g.C, 'thin'); arrows(f.b, f.g, 'BA CD', 0.28); ticks(f.b, f.g, 'AB DC', 1);
      const rows = ['대각선 AC를 그으면 △ABC와 △CDA에서', `${eq('AB', 'CD')}, ${sg('AC')}는 공통, ${par('AB', 'DC')}이므로 ∠BAC = ㈎ (엇각)`, '이므로 △ABC ≡ △CDA (㈏ 합동)이다.', `따라서 ∠BCA = ㈐이므로 ${par('AD', 'BC')}이다.`, '두 쌍의 대변이 각각 평행하므로 □ABCD는 평행사변형이다.'];
      return pickOne(d, `다음은 ${par('AB', 'DC')}, ${eq('AB', 'DC')}인 □ABCD가 평행사변형임을 설명하는 과정이다. ㈎, ㈏, ㈐에 알맞은 것을 차례로 나열한 것은?`, '∠DCA, SAS, ∠DAC', ['∠DAC, SAS, ∠DCA', '∠DCA, ASA, ∠DAC', '∠DCA, SSS, ∠DAC'], {
        figure: f.b.svg('사각형 ABCD와 대각선 AC. 변 AB와 변 DC에 평행 표시와 같은 길이 표시가 있다') + lines(rows),
        explain: `${par('AB', 'DC')}이므로 ∠BAC와 엇각인 ∠DCA의 크기가 같다. 두 변의 길이가 각각 같고 그 끼인각의 크기가 같으므로 SAS 합동이다. 대응각 ∠BCA와 ∠DAC는 엇각이고 그 크기가 같으므로 ${par('AD', 'BC')}이다.`
      });
    }, { count: 2 }),
    T('cond-why', '새로 만든 사각형이 평행사변형인 까닭', '①27 ②30 심15', (d, n) => {
      const blank = (quad) => `따라서 ${box('㈎')} □${quad}는 평행사변형이다.`, pick = (text, figure, rows, quad, i) => pickOne(d, text, BECAUSE[i], BECAUSE.filter((_, k) => k !== i), { figure: figure + lines(rows.concat([blank(quad)])), explain: `「${FIVE[i]}」가 성립함을 보였다. ${COND_WHY}` });
      const P = para(1.6, 1, d.int(62, 70));
      if (n === 0) {
        if (d.bool()) {
          P.E = lerp(P.B, P.D, 0.24); P.F = lerp(P.D, P.B, 0.24);
          const g = fit(P, [185, 106]), b = shape(g, 'ABCD', { diag: true, fill: ['AECF'] });
          segs(b, g, 'AE EC CF FA'); nameAt(b, g, 'E', 'AB'); nameAt(b, g, 'F', 'CD'); ticks(b, g, 'BE DF', 1);
          return pick(`평행사변형 ABCD의 대각선 BD 위에 ${eq('BE', 'DF')}가 되도록 두 점 E, F를 잡았다. 다음은 □AECF가 평행사변형임을 설명한 것이다. ㈎에 알맞은 것은? ${O_NOTE}`,
            b.svg(`${SAY_PG}${SAY_O} 대각선 BD 위에 점 B에서 가까운 쪽부터 점 E, 점 O, 점 F가 있고, 선분 BE와 선분 DF에 같은 표시가 있다. 사각형 AECF가 색칠되어 있다`),
            [`${eq('OA', 'OC')}이고 ${sg('OE')} = ${sg('OB')} − ${sg('BE')} = ${sg('OD')} − ${sg('DF')} = ${sg('OF')}이다.`], 'AECF', 3);
        }
        P.E = [2 * P.C[0], 0]; P.F = [2 * P.C[0] - P.D[0], -P.D[1]];
        const g = fit(P, [215, 150]), b = shape(g, 'ABCD', { skip: 'C' });
        segs(b, g, 'CE CF BF FE ED BD'); nameIn(b, g, 'C', 'BEDF'); b.name(g.E, 'E', 0).name(g.F, 'F', 270); ticks(b, g, 'BC CE', 1); ticks(b, g, 'DC CF', 2);
        return pick(`평행사변형 ABCD에서 변 BC, DC의 연장선 위에 ${eq('BC', 'CE')}, ${eq('DC', 'CF')}가 되도록 두 점 E, F를 잡았다. 다음은 □BFED가 평행사변형임을 설명한 것이다. ㈎에 알맞은 것은?`,
          b.svg(`${SAY_PG} 변 BC를 점 C 너머로 늘인 선 위에 점 E, 변 DC를 점 C 너머로 늘인 선 위에 점 F가 있다. 선분 BC와 선분 CE에 같은 표시(한 줄), 선분 DC와 선분 CF에 같은 표시(두 줄)가 있다. 사각형 BFED의 네 변이 그어져 있다`),
          [`□BFED의 두 대각선 BE, DF는 점 C에서 만나고 ${eq('BC', 'CE')}, ${eq('DC', 'CF')}이다.`], 'BFED', 3);
      }
      if (d.bool()) {
        P.E = lerp(P.A, P.D, 0.3); P.F = lerp(P.C, P.B, 0.3);
        const g = fit(P, [185, 104]), b = shape(g, 'ABCD', { fill: ['EBFD'] });
        segs(b, g, 'EB DF'); nameOn(b, g, 'E', 'AD'); nameOn(b, g, 'F', 'BC'); ticks(b, g, 'AE CF', 2);
        return pick(`평행사변형 ABCD의 변 AD, BC 위에 ${eq('AE', 'CF')}가 되도록 두 점 E, F를 잡았다. 다음은 □EBFD가 평행사변형임을 설명한 것이다. ㈎에 알맞은 것은?`,
          b.svg(`${SAY_PG} 변 AD 위에 점 E, 변 BC 위에 점 F가 있고, 선분 AE와 선분 CF에 같은 표시가 있다. 사각형 EBFD가 색칠되어 있다`),
          [`${sg('DE')} = ${sg('AD')} − ${sg('AE')} = ${sg('BC')} − ${sg('CF')} = ${sg('BF')}이고 ${par('DE', 'BF')}이다.`], 'EBFD', 4);
      }
      P.M = mid(P.A, P.B); P.N = mid(P.C, P.D);
      const g = fit(P, [185, 104]), b = shape(g, 'ABCD', { fill: ['MBND'] });
      segs(b, g, 'MD BN'); nameOn(b, g, 'M', 'AB'); nameOn(b, g, 'N', 'DC'); ticks(b, g, 'AM MB DN NC', 1);
      return pick('평행사변형 ABCD에서 두 변 AB, DC의 중점을 각각 M, N이라 하자. 다음은 □MBND가 평행사변형임을 설명한 것이다. ㈎에 알맞은 것은?',
        b.svg(`${SAY_PG} 변 AB의 중점 M과 변 DC의 중점 N이 있고, 선분 AM, MB, DN, NC에 같은 표시가 있다. 사각형 MBND가 색칠되어 있다`),
        [`${sg('MB')} = ${HALF}${sg('AB')} = ${HALF}${sg('DC')} = ${sg('DN')}이고 ${par('MB', 'DN')}이다.`], 'MBND', 4);
    }, { count: 2 }),
    T('cond-marks', '그림의 표시로 알 수 있는 평행사변형이 되는 조건', '②24', (d) => {
      const i = d.int(0, 4), f = quadFig({ diag: i === 3 }), b = f.b, g = f.g;
      let said;
      if (i === 0) { arrows(b, g, 'BA CD', 0.5); arrows(b, g, 'AD BC', 0.46); arrows(b, g, 'AD BC', 0.54); said = '변 AB와 변 DC에 평행 표시(화살표 하나), 변 AD와 변 BC에 평행 표시(화살표 둘)가 있다'; }
      else if (i === 1) { ticks(b, g, 'AB DC', 1); ticks(b, g, 'AD BC', 2); said = '변 AB와 변 DC에 같은 길이 표시(한 줄), 변 AD와 변 BC에 같은 길이 표시(두 줄)가 있다'; }
      else if (i === 2) { same(b, g, 'BAD', 'dot', 15); same(b, g, 'BCD', 'dot', 15); same(b, g, 'ABC', 'x', 17); same(b, g, 'ADC', 'x', 17); said = '∠A와 ∠C에 같은 각 표시(점), ∠B와 ∠D에 같은 각 표시(가위표)가 있다'; }
      else if (i === 3) { ticks(b, g, 'OA OC', 1); ticks(b, g, 'OB OD', 2); said = '두 대각선이 점 O에서 만나고, 선분 OA와 선분 OC에 같은 길이 표시(한 줄), 선분 OB와 선분 OD에 같은 길이 표시(두 줄)가 있다'; }
      else { arrows(b, g, 'AD BC', 0.68); ticks(b, g, 'AD BC', 1); said = '변 AD와 변 BC에 평행 표시와 같은 길이 표시가 있다'; }
      const rows = d.shuffle(FIVE.map((s, k) => [s, k === i])), hit = rows.findIndex((r) => r[1]);
      return C('그림의 □ABCD에 나타낸 표시만으로 □ABCD가 평행사변형임을 알 수 있다. 이때 이용한 평행사변형이 되는 조건은?', rows.map((r) => r[0]), hit, {
        figure: b.svg(`사각형 ABCD. ${said}`),
        explain: `그림의 표시는 「${FIVE[i]}」를 나타낸다.`,
        facts: { truth: rows.map((r) => r[1]), want: true }
      });
    }),
    T('cond-perp-claims', '두 꼭짓점에서 대각선에 내린 수선', '②31 ①28 심19', (d) => {
      const P = para(1.7, 1, d.int(64, 72)); P.E = foot(P.A, P.B, P.D); P.F = foot(P.C, P.B, P.D);
      const g = fit(P, [195, 108]), b = shape(g, 'ABCD');
      b.seg(g.B, g.D); segs(b, g, 'AE CF AF CE', 'thin'); ang(b, g, 'AED', ''); ang(b, g, 'CFB', ''); nameIn(b, g, 'E', 'ABCD'); nameIn(b, g, 'F', 'ABCD');
      const yes = ['△ABE ≡ △CDF', eq('AE', 'CF'), par('AE', 'CF'), par('AF', 'EC'), '∠EAF = ∠FCE', eq('BE', 'DF'), eq('AF', 'CE')];
      const no = [
        [eq('AE', 'EC'), `□AECF는 평행사변형이므로 길이가 같은 것은 대변이다. 이웃한 두 변 ${sg('AE')}와 ${sg('EC')}의 길이가 같다고 할 수 없다.`],
        [eq('BE', 'EF'), `${eq('BE', 'DF')}이지만 ${sg('BE')}와 ${sg('EF')}의 길이가 같다고 할 수 없다.`, [eq('BE', 'DF')]],
        ['∠AEF = ∠AFE', '△AEF는 ∠AEF = 90°인 직각삼각형이므로 ∠AFE의 크기는 90°보다 작다.'],
        [perp('AF', 'EC'), `□AECF는 평행사변형이므로 ${par('AF', 'EC')}이다.`, [par('AF', 'EC')]]
      ];
      return sayQ(d, '평행사변형 ABCD의 두 꼭짓점 A, C에서 대각선 BD에 내린 수선의 발을 각각 E, F라 할 때, 다음 중 옳지 않은 것은?', yes, no.map((r) => [r[0], `△ABE와 △CDF에서 ${eq('AB', 'CD')}, ∠AEB = ∠CFD = 90°, ∠ABE = ∠CDF(엇각)이므로 △ABE ≡ △CDF이고 ${eq('AE', 'CF')}, ${par('AE', 'CF')}이다. 한 쌍의 대변이 평행하고 그 길이가 같으므로 □AECF는 평행사변형이다. ${r[1]}`, r[2]]), false,
        b.svg(`${SAY_PG} 대각선 BD가 그어져 있다. 점 A에서 대각선 BD에 내린 수선의 발 E와 점 C에서 대각선 BD에 내린 수선의 발 F에 직각 표시가 있다. 선분 AE, CF, AF, CE가 그어져 있다`));
    }),
    T('cond-add', '평행사변형이 되기 위해 더 필요한 조건', '②22', (d, n) => {
      if (n === 0) {
        const a = d.int(5, 9), bb = a + d.int(2, 5), th = 5 * d.int(4, 8);
        const rows = d.shuffle([
          [`${sg('CD')} = ${cm(a)}, ${sg('AD')} = ${cm(bb)}`, true, ''],
          [`${sg('CD')} = ${cm(bb)}, ${sg('AD')} = ${cm(a)}`, false, `대변 ${sg('AB')}와 ${sg('CD')}의 길이가 다르다.`],
          [`∠CAB = ${th}°, ${sg('CD')} = ${cm(a)}`, true, ''],
          [`∠CAB = ${th}°, ${sg('AD')} = ${cm(bb)}`, false, `∠CAB = ∠ACD이므로 ${par('AB', 'DC')}이지만, 길이가 같은 것은 다른 쌍의 대변 ${sg('AD')}와 ${sg('BC')}이다.`]
        ]);
        return allQ(d, `${sg('AB')} = ${cm(a)}, ${sg('BC')} = ${cm(bb)}, ∠ACD = ${th}°인 □ABCD가 평행사변형이 되기 위해 더 필요한 조건을 모두 고른 것은?`, TAGS, rows.map((r) => r[1]), {
          figure: tagged(rows.map((r) => r[0]), TAGS),
          explain: `${sg('CD')} = ${cm(a)}, ${sg('AD')} = ${cm(bb)}이면 두 쌍의 대변의 길이가 각각 같다. ∠CAB = ${th}°이면 엇각의 크기가 같아 ${par('AB', 'DC')}이고, ${sg('CD')} = ${cm(a)}이면 그 길이도 같다. ` + rows.map((r, i) => (r[1] ? '' : `${TAGS[i]}. ${r[2]}`)).filter(Boolean).join(' ')
        });
      }
      const pool = [
        ['∠ADB = ∠CBD', true, `엇각의 크기가 같으므로 ${par('AD', 'BC')}이다. 두 쌍의 대변이 각각 평행하다.`],
        [eq('AB', 'DC'), true, '한 쌍의 대변이 평행하고 그 길이가 같다.'],
        ['∠A = ∠C', true, `${par('AB', 'DC')}이므로 ∠A + ∠D = 180°이고, ∠A = ∠C이면 ∠C + ∠D = 180°이므로 ${par('AD', 'BC')}이다.`],
        [eq('AD', 'BC'), false, '평행한 대변과 길이가 같은 대변이 서로 다른 쌍이다.'],
        [eq('AC', 'BD'), false, '두 대각선의 길이가 같은 것만으로는 평행사변형이라고 할 수 없다.'],
        ['∠ACB = ∠ADB', false, `∠ACB와 ∠ADB는 엇각이 아니므로 ${sg('AD')}와 ${sg('BC')}가 평행하다고 할 수 없다.`],
        ['∠B + ∠C = 180°', false, `${par('AB', 'DC')}이면 늘 성립하는 식이어서 새로 알게 되는 것이 없다.`]
      ];
      const rows = d.until(() => d.shuffle(pool).slice(0, 4), (list) => { const k = list.filter((r) => r[1]).length; return k >= 1 && k <= 3; });
      return allQ(d, `${par('AB', 'DC')}인 □ABCD가 평행사변형이 되기 위해 더 필요한 조건을 모두 고른 것은?`, TAGS, rows.map((r) => r[1]), {
        figure: tagged(rows.map((r) => r[0]), TAGS),
        explain: rows.map((r, i) => `${TAGS[i]}. ${r[2]}`).join(' ')
      });
    }, { count: 2 })
  ]);

  B.addTypes(UNIT, 'area', [
    T('area-diag', '두 대각선으로 나누어진 삼각형의 넓이', '①30 ②33', (d, n) => {
      const g = fit(para(1.6, 1, d.int(60, 70)), [170, 96]);
      if (n === 0) {
        const S = 4 * d.int(6, 18), up = d.bool(), pair = up ? ['OAD', 'OBC'] : ['OAB', 'OCD'];
        return areaQ(`넓이가 ${S} cm²인 평행사변형 ABCD에서 두 대각선의 교점을 O라 할 때, △${pair[0]}와 △${pair[1]}의 넓이의 합은 몇 cm²인가?`, S / 2, {
          figure: shape(g, 'ABCD', { diag: true, fill: pair }).svg(`${SAY_PG}${SAY_O} 삼각형 ${pair[0]}와 삼각형 ${pair[1]}가 색칠되어 있다`),
          explain: `두 대각선은 서로 다른 것을 이등분하므로 두 대각선으로 나누어진 네 삼각형의 넓이는 모두 같다. 삼각형 하나의 넓이는 ${S} ÷ 4 = ${S / 4} (cm²)이므로 두 삼각형의 넓이의 합은 ${S / 2} cm²이다.`,
          facts: { calc: [[`${S}/4*2`, 0]], unseen: [4, 2] }
        });
      }
      const t = d.int(6, 19), name = d.pick(['OAB', 'OBC', 'OCD', 'OAD']);
      return areaQ(`평행사변형 ABCD에서 두 대각선의 교점을 O라 하자. △${name}의 넓이가 ${t} cm²일 때, 평행사변형 ABCD의 넓이는 몇 cm²인가?`, 4 * t, {
        figure: shape(g, 'ABCD', { diag: true, fill: [name] }).svg(`${SAY_PG}${SAY_O} 삼각형 ${name}가 색칠되어 있다`),
        explain: `${eq('OA', 'OC')}이므로 △OAB와 △OBC는 밑변의 길이와 높이가 같아 넓이가 같다. 같은 방법으로 두 대각선으로 나누어진 네 삼각형의 넓이는 모두 같으므로 평행사변형 ABCD의 넓이는 4 × ${t} = ${4 * t} (cm²)이다.`,
        facts: { calc: [[`4*${t}`, 0]], unseen: [4] }
      });
    }, { count: 2 }),
    T('area-through-o', '두 대각선의 교점을 지나는 직선과 넓이', '①32 ②34', (d) => {
      const S = 4 * d.int(9, 24), side = d.bool(), P = para(1.65, 1, d.int(62, 70));
      if (side) { P.E = lerp(P.A, P.D, 0.64); P.F = [2 * P.O[0] - P.E[0], 2 * P.O[1] - P.E[1]]; } else { P.E = lerp(P.B, P.A, 0.36); P.F = [2 * P.O[0] - P.E[0], 2 * P.O[1] - P.E[1]]; }
      const pair = side ? ['OED', 'OFC'] : ['OEB', 'OFC'], g = fit(P, [185, 104]), b = shape(g, 'ABCD', { diag: true, fill: pair, through: 'EF' });
      b.seg(g.E, g.F); nameOn(b, g, 'E', side ? 'AD' : 'AB'); nameOn(b, g, 'F', side ? 'BC' : 'DC');
      return areaQ(`넓이가 ${S} cm²인 평행사변형 ABCD의 두 대각선의 교점 O를 지나는 직선이 변 ${side ? 'AD, BC' : 'AB, DC'}와 만나는 점을 각각 E, F라 할 때, △${pair[0]}와 △${pair[1]}의 넓이의 합은 몇 cm²인가?`, S / 4, {
        figure: b.svg(`${SAY_PG}${SAY_O} 점 O를 지나는 직선이 변 ${side ? 'AD' : 'AB'}와 점 E에서, 변 ${side ? 'BC' : 'DC'}와 점 F에서 만난다. 삼각형 ${pair[0]}와 삼각형 ${pair[1]}가 색칠되어 있다`),
        explain: side
          ? `△OED와 △OFB에서 ${eq('OD', 'OB')}, ∠EOD = ∠FOB(맞꼭지각), ∠ODE = ∠OBF(엇각)이므로 △OED ≡ △OFB (ASA 합동)이다. 따라서 △OED + △OFC = △OFB + △OFC = △OBC이고, △OBC의 넓이는 ${S} ÷ 4 = ${S / 4} (cm²)이다.`
          : `△OEB와 △OFD에서 ${eq('OB', 'OD')}, ∠EOB = ∠FOD(맞꼭지각), ∠OBE = ∠ODF(엇각)이므로 △OEB ≡ △OFD (ASA 합동)이다. 따라서 △OEB + △OFC = △OFD + △OFC = △OCD이고, △OCD의 넓이는 ${S} ÷ 4 = ${S / 4} (cm²)이다.`,
        facts: { calc: [[`${S}/4`, 0]], unseen: [4] }
      });
    }),
    T('area-mid', '마주 보는 두 변의 중점을 이어 생긴 사각형의 넓이', '①33 ②36', (d) => {
      const S = 4 * d.int(8, 24), P = para(1.9, 1, d.int(62, 70)); P.M = mid(P.A, P.D); P.N = mid(P.B, P.C); P.P = mid(P.A, P.N); P.Q = mid(P.M, P.C);
      const g = fit(P, [200, 104]), b = shape(g, 'ABCD', { fill: ['MPNQ'] });
      segs(b, g, 'AN BM MC ND', 'thin'); nameOn(b, g, 'M', 'AD'); nameOn(b, g, 'N', 'BC'); nameAt(b, g, 'P', 'AB'); nameAt(b, g, 'Q', 'CD'); ticks(b, g, 'AM MD BN NC', 1);
      return areaQ(`넓이가 ${S} cm²인 평행사변형 ABCD에서 두 변 AD, BC의 중점을 각각 M, N이라 하자. 선분 AN과 선분 BM의 교점을 P, 선분 MC와 선분 ND의 교점을 Q라 할 때, □MPNQ의 넓이는 몇 cm²인가?`, S / 4, {
        figure: b.svg(`${SAY_PG} 변 AD의 중점 M, 변 BC의 중점 N이 있고 선분 AN, BM, MC, ND가 그어져 있다. 선분 AN과 BM이 점 P에서, 선분 MC와 ND가 점 Q에서 만난다. 사각형 MPNQ가 색칠되어 있다`),
        explain: `${par('AM', 'BN')}, ${eq('AM', 'BN')}이므로 □ABNM은 평행사변형이고 그 넓이는 ${S} ÷ 2 = ${S / 2} (cm²)이다. 점 P는 □ABNM의 두 대각선의 교점이므로 △MPN의 넓이는 ${S / 2} ÷ 4 = ${S / 8} (cm²)이다. 같은 방법으로 △MQN의 넓이도 ${S / 8} cm²이므로 □MPNQ의 넓이는 ${S / 4} cm²이다.`,
        facts: { calc: [[`${S}/2/4*2`, 0]], unseen: [2, 4] }
      });
    }),
    T('area-foot', '두 대각선의 교점에서 마주 보는 두 변에 내린 수선', '②35', (d) => {
      const draw = (v) => {
        // 변 AB 를 가로로 놓고 지은 다음, 변 BC 가 가로가 되게 돌린다.
        const raw = { A: [0, 0], B: [v.s, 0], O: [v.a, v.h], P: [v.a, 0] }; raw.C = [2 * v.a, 2 * v.h]; raw.D = [2 * v.a - v.s, 2 * v.h]; raw.Q = [v.a, 2 * v.h];
        const th = Math.atan2(raw.C[1] - raw.B[1], raw.C[0] - raw.B[0]), turn = (p) => { const x = p[0] - raw.B[0], y = p[1] - raw.B[1]; return [x * Math.cos(th) + y * Math.sin(th), -x * Math.sin(th) + y * Math.cos(th)]; };
        const P = {}; for (const k of Object.keys(raw)) P[k] = turn(raw[k]);
        const g = fit(P, [200, 140]), b = shape(g, 'ABCD', { diag: true, fill: ['OPB'], through: 'PQ' });
        segs(b, g, 'OP OQ'); nameOn(b, g, 'P', 'AB'); nameOn(b, g, 'Q', 'DC'); ang(b, g, 'OPB', ''); ang(b, g, 'OQD', ''); len(b, g, 'AP', cm(v.a)); len(b, g, 'OQ', cm(v.h), spread(g.O, g.Q, g.D) >= spread(g.O, g.Q, g.C) ? 'D' : 'C', { gap: 3 }); len(b, g, 'DC', cm(v.s), null, { t: 0.3 });
        return b;
      };
      const v = d.until(() => ({ s: d.int(8, 12), a: d.int(2, 4), h: d.int(3, 5) }), (x) => ((x.s - x.a) * x.h) % 2 === 0 && x.s - 2 * x.a >= 3 && !draw(x).clash()), b = draw(v);
      return areaQ(`평행사변형 ABCD의 두 대각선의 교점 O에서 변 AB, DC에 내린 수선의 발을 각각 P, Q라 하자. ${sg('AP')} = ${cm(v.a)}, ${sg('OQ')} = ${cm(v.h)}, ${sg('DC')} = ${cm(v.s)}일 때, △OPB의 넓이는 몇 cm²인가?`, (v.s - v.a) * v.h / 2, {
        figure: b.svg(`${SAY_PG}${SAY_O} 점 O에서 변 AB에 내린 수선의 발 P와 변 DC에 내린 수선의 발 Q에 직각 표시가 있다. 삼각형 OPB가 색칠되어 있다. 선분 AP의 길이는 ${cm(v.a)}, 선분 OQ의 길이는 ${cm(v.h)}, 변 DC의 길이는 ${cm(v.s)}`),
        explain: `△OPB와 △OQD에서 ${eq('OB', 'OD')}, ∠OPB = ∠OQD = 90°, ∠OBP = ∠ODQ(엇각)이므로 △OPB ≡ △OQD이고 ${sg('OP')} = ${sg('OQ')} = ${cm(v.h)}이다. ${sg('AB')} = ${sg('DC')} = ${cm(v.s)}이므로 ${sg('PB')} = ${v.s} − ${v.a} = ${v.s - v.a} (cm)이다. △OPB의 넓이는 ${HALF} × ${v.s - v.a} × ${v.h} = ${(v.s - v.a) * v.h / 2} (cm²)이다.`,
        facts: { calc: [[`(${v.s}-${v.a})*${v.h}/2`, 0]], unseen: [2] }
      });
    }),
    T('area-extend', '두 변을 같은 길이만큼 늘여 만든 사각형의 넓이', '심47', (d) => {
      const t = d.int(5, 12), P = para(1.5, 1, d.int(62, 70)); P.E = [2 * P.C[0], 0]; P.F = [2 * P.C[0] - P.D[0], -P.D[1]];
      const g = fit(P, [215, 150]), b = shape(g, 'ABCD', { diag: true, fill: ['OAB'], skip: 'C' });
      segs(b, g, 'CE CF BF FE ED'); nameIn(b, g, 'C', 'BEDFA'); b.name(g.E, 'E', 0).name(g.F, 'F', 270); ticks(b, g, 'BC CE', 1); ticks(b, g, 'DC CF', 2);
      return areaQ(`평행사변형 ABCD에서 두 대각선의 교점을 O라 하고, 변 BC, DC의 연장선 위에 ${eq('BC', 'CE')}, ${eq('DC', 'CF')}가 되도록 두 점 E, F를 잡았다. △OAB의 넓이가 ${t} cm²일 때, □BFED의 넓이는 몇 cm²인가?`, 8 * t, {
        figure: b.svg(`${SAY_PG}${SAY_O} 삼각형 OAB가 색칠되어 있다. 변 BC를 점 C 너머로 늘인 선 위에 점 E, 변 DC를 점 C 너머로 늘인 선 위에 점 F가 있다. 선분 BC와 선분 CE에 같은 표시(한 줄), 선분 DC와 선분 CF에 같은 표시(두 줄)가 있다. 사각형 BFED의 네 변이 그어져 있다`),
        explain: `△BCD의 넓이는 평행사변형 ABCD의 넓이의 반이므로 2 × ${t} = ${2 * t} (cm²)이다. □BFED는 두 대각선 BE, DF가 점 C에서 서로 다른 것을 이등분하므로 평행사변형이고, 두 대각선으로 나누어진 네 삼각형의 넓이는 모두 △BCD의 넓이와 같다. □BFED의 넓이는 4 × ${2 * t} = ${8 * t} (cm²)이다.`,
        facts: { calc: [[`2*${t}*4`, 0]], unseen: [2, 4] }
      });
    })
  ]);

  // 같은 단원의 다른 파일이 함께 쓰는 것
  B.kit.m822 = {
    UNIT, STD, sg, X, Y, HALF, eq, par, perp, cm, CM2, O_NOTE, TAGS, SYM, SAY_PG, SAY_O, FIVE, BECAUSE, COND_WHY, degQ, lenQ, areaQ, pickOne, allQ, sayQ,
    pol, add, sub, lerp, foot, para, paraDiag, rect, rhom, trap, fit, centre, midDir, outDir, shape, segs, nameOn, nameIn, nameAt, same, ang, len, lenHalf, ticks, arrows, deg, tiles, halves
  };
})(typeof window !== 'undefined' ? window : globalThis);
