// 중학교 1학년 2학기 3단원 평면도형의 성질 — 단원 틀·그림 도구와 다각형 쪽 묶음
// (다각형과 내각·외각, 대각선의 개수, 삼각형의 내각과 외각, 다각형의 내각과 외각의 크기의 합, 정다각형의 한 내각과 한 외각).
// 수집해 둔 교과서 3종(미래엔 황선욱 2015·2022, 천재 김동재·김화경)의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1: 94꼴, 심화꼴: 75꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/7-2-3/싣기_대조표.md 에 있다.
// (원과 부채꼴 쪽 묶음은 7-2-3b.js 에, 실력 문항은 7-2-3c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
// 영역은 도형과 측정. 성취기준은 9수03-05(다각형의 성질을 이해하고 설명할 수 있다),
// 9수03-06(부채꼴의 중심각과 호의 관계를 이해하고, 이를 이용하여 부채꼴의 호의 길이와 넓이를 구할 수 있다)이다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(글·그림·식), 묻는 것(값·개수·다각형·고르기·빈칸), 푸는 길(바로 구하기 / 거꾸로 다각형 찾기 / 빈 각 하나 / 비로 준 각)이 다르면 따로 싣는다.
//    n각형의 n만 바꾼 것, 그림의 수만 바꾼 것은 한 유형이다.
//  - 그림은 수치대로 그린다. 코드가 각과 길이에서 좌표를 셈해 그리므로 그림과 답이 어긋나지 않는다. 그림 설명(aria-label)에는 그림에 적힌 것을 모두 말로 적는다.
//  - 답: 각도는 「□°」, 개수는 「□개」, 다각형은 「□각형」「정□각형」의 □를 수로 받는다. π가 드는 길이·넓이는 칸 뒤에 π와 단위를 붙여 계수를 받고(계수가 분수이면 분수 칸),
//    π와 정수를 더한 꼴은 「(□π + □) cm」 두 칸으로, 빼는 꼴은 고르기로 받는다. 한 유형의 답은 늘 같은 꼴이다. 원주율은 π로만 적는다.
//  - 교육과정의 금: 「다각형과 다면체는 그 모양이 볼록인 경우만 다룬다」「복잡하게 변형된 평면도형의 넓이와 둘레의 길이 … 를 구하는 문제는 다루지 않는다」.
//    오목한 꼴·별 꼴의 각은 싣지 않았다. 색칠한 부분은 한두 번 셈하는 것(원에서 원, 반원에서 반원, 부채꼴에서 부채꼴)만 기본에,
//    사분원 안의 반원과 정사각형 안의 사분원 둘은 실력에 싣고, 조각을 여럿 더하고 빼거나 도형을 돌리고 굴리는 것은 싣지 않았다.
//  - 초등에서 한 일은 다시 싣지 않는다: 다각형·대각선의 뜻과 고르기, 다각형의 이름과 변·꼭짓점의 수(4-2-4), 삼각형의 나머지 한 각(4-1-2, 4-2-2), 3.14로 구하는 원주와 원의 넓이(6-2-5).
//    이 단원의 문항은 내각·외각의 성질, 대각선의 개수 공식, 중심각과 호의 정비례, π와 부채꼴을 쓴다.
//  - 초등에서 배운 「삼각형의 세 각의 크기의 합은 180°」「이등변삼각형의 두 밑각의 크기는 같다」와 앞 단원의 맞꼭지각, 평행선의 동위각·엇각은 쓴다.
//  - 꼴 목록에 적힌 원문 답지의 잘못은 따르지 않는다. 답은 모두 코드가 셈한다.
//
// 뺀 것과 까닭(7-2-3b.js, 7-2-3c.js 의 것까지 여기에 모아 적는다)
//  ※ 2026-10-13 다시 싣기: 아래는 처음 지을 때의 판정이다. 이 가운데 선분이 엇갈린 그림(①25·40·41·43 심19·21·33·34·38), 보조선·꼬임(①67·87 심7·26·31·49·51·53·54·55),
//    복잡하게 변형된 도형(①82·83·86·88·89·90·91·92·93·94 심60·62·63·65·67·68·69·71·72·73·74), 그림을 글의 조건으로 되살린 것(①68·77 심52)은 7-2-3c.js 끝의 「다시 실은 꼴」에 실었다.
//    지금의 판정은 싣기_대조표.md 의 「다시 싣기」를 따른다. 그대로 뺀 것: ①1·2·6·15·29·42 심9·20·24·32·35·36·37·39·40·59·66·70·75.
//  - 볼록이 아닌 꼴(교육과정의 금): 삼각형 안의 한 점으로 생기는 오목한 사각형(①25 심19·20), 안으로 꺾이거나 엇갈린 꼴(①40 심33·34), 별 꼴(①29·43 심21·38).
//    ①29는 심21과 같은 쪽 그림(다섯 선분이 엇갈린 별 꼴)이어서 함께 뺐다. 두 선분이 한 점에서 엇갈린 「나비 꼴」(①24)은 삼각형 둘의 문제이므로 실었다.
//  - 보조선을 긋거나 각을 여러 번 이어 좇는 것: 여섯 각·일곱 각의 합(①41 심35·37), 평행선 사이의 정오각형(심31), 정십각형의 연장선의 세 각(심32), 접은 종이(심40),
//    각의 크기 없이 호의 배 관계만 주는 것(심49, ①67의 변형), 시계 눈금 위의 세 점(심54), 정사각형의 두 호가 만나는 점(①87 심62).
//  - 뒤 학년·뒤 단원: 삼각형의 합동으로 넓이가 같음을 보이는 문장(①65의 변형), 현에 수직인 반지름(심51), 원뿔의 전개도(심75).
//  - 복잡하게 변형된 평면도형(교육과정의 금): 태극·곡옥 무늬(①82 심60), 정사각형 안의 반원과 사분원 둘(①86), 변을 늘여 이어 그린 부채꼴 셋(①89), 돌린 반원(①90 심63),
//    원이 도형의 둘레를 도는 길과 자리(①91·92 심71·72), 굴린 도형(①93 심74), 끈으로 묶은 통(①94 심69), 묶인 짐승(심73), 반원 셋·초승달(심67·68), 방정식까지 세우는 넓이(심65),
//    색칠한 두 조각의 둘레를 선분 넷과 호 셋으로 더하는 것(①83의 변형), 꼭짓점마다 원을 그린 정오각형(①88의 변형), 남은 부채꼴의 둘레가 분수와 정수로 섞이는 것(①77의 변형).
//  - 어려움이 단원 내용이 아닌 데서 오는 것: 조각의 변을 세는 요령(심7), 크고 작은 정다각형 세기(심9), 약수를 따지는 정다각형(심26), 시계 바늘이 이루는 각(심53), 트랙의 출발선(심70 — 원의 둘레만 쓰는 초등 꼴).
//  - 뜻 없는 셈(따로 구한 두 값을 더하고 빼기): 두 외각의 합(①4의 변형), 대각선의 개수의 합과 차(①8·12의 변형 — 두 값을 따로 물었다), 내각의 합과 외각의 합의 차(①30의 변형 — 따로 물었다),
//    두 정다각형의 내각과 외각의 합(심24, ①44의 변형), ∠x + ∠y·∠x − ∠y(①38·59의 변형, 심12).
//  - 초등에서 한 일(앞 학년 되짚기): 다각형인 것 고르기(①1), 다각형의 이름과 꼭짓점·변의 개수(①2), 대각선이 아닌 선분(①6), 두 내각을 주고 나머지 한 각·이등변삼각형의 밑각(①15).
//  - 수집본의 쪽 그림에서도 그림을 알 수 없는 것: 여덟 각·열 각의 합(①42 심36·39), 부채꼴의 넓이로 삼각형의 각 구하기(①68 심52), 반원과 이등변삼각형(심55), 원에서 반원 넷(심59), 옮겨 붙이는 넓이(심66),
//    반지름이 다른 두 반원의 합(①81의 한 꼴), 정팔각형의 두 변에 붙인 정삼각형과 정오각형(①52의 변형), 호의 길이만 준 반원(①63·64의 변형).
//  - 작도·서술형·활동: 외각 표시하기(①3의 작도 부분 — 기호 고르기와 외각 가려내기로 바꿈), 원 위에 나타내기(①54 — 그림 고르기로 바꿈), n − 3인 까닭 쓰기(①9의 변형), 지구의 둘레 활동지(①69 — 부분으로 전체 구하기로 바꿈).
//  - 같은 일이어서 한 번만 실은 것: ①14(심5와), ①46의 변형(실력의 「찾은 다음 구하기」와), 심3(①10과), 심13(①24와), 심28(①52와), 심46(①61과), 심58(①88과), 심1·①5(문장 가리기 하나로).
//  - 정다각형의 두 변을 늘여 만나는 각(①51)은 삼각형이 넉넉히 그려지는 정오각형·정육각형으로만 낸다(정팔각형은 직각이 눈에 보이고, 변이 더 많으면 삼각형이 너무 작다).
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」 각도는 수에 붙여 적고(108°) 길이는 띄어 적는다(6 cm).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { box, frac, lines, N, M, C, F } = B.kit;
  const { V, nb, SG } = B.kit.mid;
  const UNIT = '7-2-3', POLY = '9수03-05', FAN = '9수03-06';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const X = V('x');

  // ── 다각형의 이름과 셈 ──
  const DIG = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
  const han = (n) => (n >= 20 ? DIG[Math.floor(n / 10)] : '') + (n >= 10 ? '십' : '') + DIG[n % 10];
  const gon = (n) => han(n) + '각형', rgon = (n) => '정' + gon(n);
  const inSum = (n) => 180 * (n - 2), diagAll = (n) => n * (n - 3) / 2;
  // 한 내각과 한 외각의 크기가 자연수인 정다각형(정삼각형·정사각형은 뺀다)
  const REG = [5, 6, 8, 9, 10, 12, 15, 18, 20, 24];
  const sg = SG;   // 선분 AB: 글자 위에 줄을 얹는다(공용 도구)

  // ── 답 ──
  const degQ = (text, v, o) => N(text, v, Object.assign({ unit: '°' }, o));
  const cntQ = (text, v, o) => N(text, v, Object.assign({ unit: '개' }, o));
  // 다각형을 답하는 문항: 「□각형」「정□각형」의 □를 수로 받고, 틀리면 이름(십이각형)으로 보인다.
  const gonQ = (text, n, o) => M(text, [{ answer: n, unit: '각형' }], Object.assign({}, o, { shown: gon(n) }));
  const rgonQ = (text, n, o) => M(text, [{ answer: n, lead: '정', unit: '각형' }], Object.assign({}, o, { shown: rgon(n) }));
  // π가 드는 길이·넓이. 칸 뒤에 π와 단위를 붙여 계수만 받는다. 틀리면 「12π cm」처럼 보인다.
  const CM = 'cm', CM2 = 'cm<sup>2</sup>';
  const piN = (text, k, unit, o) => Object.assign(N(text, k, Object.assign({}, o, { unit: 'π ' + unit })), { shown: `${k}π ${unit}` });
  const piF = (text, p, q, unit, o) => Object.assign(F(text, p, q, Object.assign({}, o, { unit: 'π ' + unit, improper: p > q, anyForm: true })), { shown: `${frac(p, q)}π ${unit}` });
  // (aπ + b) 꼴: 「( □ π + □ ) cm」 두 칸
  const piPlus = (text, a, b, unit, o) => M(text, [{ answer: a, lead: '(', unit: 'π +' }, { answer: b, unit: ') ' + unit }], Object.assign({}, o, { shown: `(${a}π + ${b}) ${unit}` }));
  // 두 값(호의 길이와 넓이 따위)을 함께 받는다. parts: [이름, 계수, 단위]
  const piTwo = (text, parts, o) => M(text, parts.map(([label, answer, unit]) => ({ label, answer, unit: 'π ' + unit })), Object.assign({}, o, { shown: parts.map(([label, answer, unit]) => `${label} ${answer}π ${unit}`).join(', ') }));
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);

  // 문장 가리기. yes: 옳은 문장들, no: [틀린 문장, 바로잡은 말, 함께 싣지 않을 옳은 문장(들)]. wantTrue: 옳은 것을 고르는가.
  // (뜻이 맞서는 두 문장이 한 문항에 나오면 답이 드러나므로 함께 싣지 않는다.)
  function sayQ(d, text, yes, no, wantTrue, figure) {
    const bad = d.shuffle(no).slice(0, wantTrue ? 3 : 1), clash = bad.reduce((all, s) => all.concat(s[2] || []), []);
    const good = d.shuffle(yes.filter((s) => !clash.includes(s))).slice(0, wantTrue ? 1 : 3);
    const rows = d.shuffle(good.map((s) => [s, true, '']).concat(bad.map((s) => [s[0], false, s[1]]))), hit = rows.findIndex((r) => r[1] === wantTrue);
    return C(text, rows.map((r) => r[0]), hit, { figure, explain: wantTrue ? rows.filter((r) => !r[1]).map((r) => r[2]).join(' ') : rows[hit][2], facts: { truth: rows.map((r) => r[1]), want: wantTrue } });
  }

  // 그림 판(Board)과 다각형 짓는 도구는 공용 도구(middle.js 의 B.kit.mgeo)로 옮겼다.
  const { RAD, r1, FS, at, dirOf, dist, mid, XY, meet, awayFrom, textW, arcTo, HALO, sv, TINT, WHITE, CLEAR, Board, polyOf, RANGE, anglesOf, ALPHA, vnames, triOf, regOn, regPts } = B.kit.mgeo;
  // 각도 글: 직각은 표시(네모)만 그리므로 글을 적지 않는다.
  const dg = (v) => (v === 90 ? '' : v + '°');
  const dgSay = (v) => (v === 90 ? '90°(직각 표시)' : v + '°');
  // x에 대한 식 kx + b(도): 그림 속 글, 그림 설명, 문제 글
  const kx = (k) => (k === 1 ? '' : String(k));
  const exSvg = (k, b) => (b === 0 ? `${kx(k)}${sv('x')}°` : `(${kx(k)}${sv('x')}${b > 0 ? '+' : '−'}${Math.abs(b)})°`);
  const exSay = (k, b) => (b === 0 ? `${kx(k)}x°` : `(${kx(k)}x ${b > 0 ? '+' : '−'} ${Math.abs(b)})°`);
  const exHtml = (k, b) => nb(b === 0 ? `${kx(k)}${X}°` : `(${kx(k)}${X} ${b > 0 ? '+' : '−'} ${Math.abs(b)})°`);

  // 내각이 angles 인 다각형 그림. o.size, o.names: 꼭짓점 이름을 적는다, o.ext: 들어오는 변을 꼭짓점 너머로 늘일 꼭짓점들,
  // o.inner: { 꼭짓점: 글 } 내각에 적을 글, o.outer: { 꼭짓점: 글 } 외각(늘인 선과 다음 변 사이)에 적을 글
  function polyFig(angles, o) {
    const g = polyOf(angles, o.size || [160, 120]), b = Board(), P = g.pts, n = P.length, D = g.dirs, names = vnames(P), ext = o.ext || [];
    const din = (i) => D[(i + n - 1) % n];
    b.poly(P);
    for (const i of ext) b.seg(P[i], at(P[i], o.extLen || 36, din(i)));
    for (const i of Object.keys(o.inner || {}).map(Number)) b.angle(P[i], D[i], din(i) + 180, o.inner[i]);
    for (const i of Object.keys(o.outer || {}).map(Number)) b.angle(P[i], din(i), D[i], o.outer[i]);
    if (o.names) P.forEach((p, i) => b.name(p, names[i], ext.includes(i) ? din(i) - 90 : awayFrom(p, [P[(i + n - 1) % n], P[(i + 1) % n]])));
    return { b, P, D, names, din };
  }

  // ── 문장 ──
  const N_ = V('n');
  const POLY_TRUE = [
    '변의 개수가 가장 적은 다각형은 삼각형이다.', '다각형에서 꼭짓점의 개수와 변의 개수는 항상 같다.', '다각형의 한 꼭짓점에서 내각과 외각의 크기의 합은 180°이다.',
    '다각형의 한 내각에 대한 외각은 2개이고, 두 외각의 크기는 서로 같다.', `${N_}각형의 내각은 ${N_}개이다.`, '다각형에서 이웃하는 두 변으로 이루어진 내부의 각을 내각이라고 한다.',
    '다각형의 한 변과 그 변에 이웃한 변의 연장선으로 이루어진 각을 외각이라고 한다.'
  ];
  const POLY_FALSE = [
    ['다각형의 한 꼭짓점에서 내각과 외각의 크기의 합은 360°이다.', '한 꼭짓점에서 내각과 외각의 크기의 합은 180°이다.', '다각형의 한 꼭짓점에서 내각과 외각의 크기의 합은 180°이다.'],
    ['변의 개수가 가장 적은 다각형은 사각형이다.', '변의 개수가 가장 적은 다각형은 삼각형이다.', '변의 개수가 가장 적은 다각형은 삼각형이다.'],
    ['다각형의 한 내각에 대한 두 외각의 크기는 서로 다르다.', '한 내각에 대한 두 외각은 맞꼭지각이므로 크기가 서로 같다.', '다각형의 한 내각에 대한 외각은 2개이고, 두 외각의 크기는 서로 같다.'],
    ['다각형의 내각의 크기는 그 외각의 크기보다 항상 크다.', '내각의 크기가 90°보다 작으면 그 외각의 크기가 더 크다.'],
    ['다각형에서 변의 개수는 꼭짓점의 개수보다 1만큼 크다.', '다각형에서 변의 개수와 꼭짓점의 개수는 같다.', '다각형에서 꼭짓점의 개수와 변의 개수는 항상 같다.'],
    ['다각형에서 이웃하는 두 변으로 이루어진 내부의 각을 외각이라고 한다.', '이웃하는 두 변으로 이루어진 내부의 각은 내각이다.', ['다각형에서 이웃하는 두 변으로 이루어진 내부의 각을 내각이라고 한다.', '다각형의 한 변과 그 변에 이웃한 변의 연장선으로 이루어진 각을 외각이라고 한다.']]
  ];

  B.addUnit({
    id: '7-2-3', grade: 7, semester: 2, no: 3, title: '평면도형의 성질', version: 2,
    groups: [
      {
        id: 'poly', title: '다각형, 내각과 외각', standard: POLY,
        types: [
          T('poly-in-name', '두 변으로 이루어진 내각을 기호로 나타내기', '①3', (d) => {
            const n = d.pick([5, 5, 6]), fig = polyFig(anglesOf(d, n), { names: true, size: [150, 118] }), names = fig.names, k = d.int(0, n - 1);
            const nm = (i) => names[((k + i) % n + n) % n], right = `∠${nm(-1)}${nm(0)}${nm(1)}`;
            // 틀린 보기: 이웃한 꼭짓점의 내각 둘, 한 변과 대각선이 이루는 각
            const options = d.shuffle([right, `∠${nm(0)}${nm(1)}${nm(2)}`, `∠${nm(-2)}${nm(-1)}${nm(0)}`, `∠${nm(-1)}${nm(1)}${nm(0)}`]);
            return C(`${gon(n)} ${ALPHA.slice(0, n)}에서 변 ${nm(-1)}${nm(0)}와 변 ${nm(0)}${nm(1)}로 이루어진 내각은?`, options, options.indexOf(right), {
              figure: fig.b.svg(`${gon(n)} ${ALPHA.slice(0, n)}. 꼭짓점 ${ALPHA.slice(0, n).split('').join(', ')}가 이 차례로 놓여 있다`),
              explain: `변 ${nm(-1)}${nm(0)}와 변 ${nm(0)}${nm(1)}는 꼭짓점 ${nm(0)}에서 만난다. 두 변으로 이루어진 내각은 꼭짓점 ${nm(0)}를 가운데에 적은 ${right}이다.`,
              facts: { truth: options.map((o) => o === right), want: true }
            });
          }),
          T('poly-ext', '한 꼭짓점의 내각과 외각', '①4', (d, t) => {
            const n = d.pick([4, 5]), a = anglesOf(d, n, (list) => list.every((v) => v !== 90)), k = d.int(0, n - 1), v = a[k], names = vnames(polyOf(a, [150, 118]).pts), me = names[k], all = ALPHA.slice(0, n);
            const said = `${gon(n)} ${all}. 꼭짓점 ${all.split('').join(', ')}가 이 차례로 놓여 있다. `;
            if (t === 0) {
              const fig = polyFig(a, { names: true, size: [150, 118], inner: { [k]: v + '°' } });
              return degQ(`그림의 ${gon(n)}에서 ∠${me} = ${v}°일 때, ∠${me}의 외각의 크기는?`, 180 - v, {
                figure: fig.b.svg(`${said}∠${me} = ${v}°`),
                explain: `한 꼭짓점에서 내각과 외각의 크기의 합은 180°이다. ∠${me}의 외각의 크기는 180° − ${v}° = ${180 - v}°이다.`, facts: { calc: [[`180-${v}`, 0]], unseen: [180] }
              });
            }
            const fig = polyFig(a, { names: true, size: [150, 118], ext: [k], outer: { [k]: (180 - v) + '°' } }), prev = names[(k + n - 1) % n];
            return degQ(`그림의 ${gon(n)}에서 ∠${me}의 외각의 크기가 ${180 - v}°일 때, ∠${me}의 크기는?`, v, {
              figure: fig.b.svg(`${said}변 ${prev}${me}를 꼭짓점 ${me} 너머로 늘인 선이 그어져 있고, 그 선과 이웃한 변이 이루는 각(∠${me}의 외각)의 크기는 ${180 - v}°`),
              explain: `한 꼭짓점에서 내각과 외각의 크기의 합은 180°이다. ∠${me}의 크기는 180° − ${180 - v}° = ${v}°이다.`, facts: { calc: [[`180-${180 - v}`, 0]], unseen: [180] }
            });
          }, { count: 2 }),
          T('poly-claims', '다각형의 내각과 외각에 대한 설명 가리기', '①5 심1', (d) => {
            const wantTrue = d.bool();
            return sayQ(d, `다음 중 다각형에 대한 설명으로 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, POLY_TRUE, POLY_FALSE, wantTrue);
          })
        ]
      },
      {
        id: 'diag', title: '대각선의 개수', standard: POLY,
        types: [
          T('diag-one', '한 꼭짓점에서 그을 수 있는 대각선의 개수', '①7', (d) => {
            const n = d.int(7, 20);
            return cntQ(`${gon(n)}의 한 꼭짓점에서 그을 수 있는 대각선의 개수는?`, n - 3, {
              explain: `한 꼭짓점에서는 그 꼭짓점과 이웃하는 두 꼭짓점을 뺀 나머지 꼭짓점에 대각선을 그을 수 있다. ${n} − 3 = ${n - 3}(개)이다.`, facts: { calc: [[`${n}-3`, 0]], unseen: [n, 3] }
            });
          }),
          T('diag-tri', '한 꼭짓점에서 그은 대각선으로 나누어지는 삼각형의 개수', '①7·11·12', (d) => {
            const n = d.int(7, 20);
            return cntQ(`${gon(n)}의 한 꼭짓점에서 대각선을 모두 그으면 ${gon(n)}은 삼각형 몇 개로 나누어지는가?`, n - 2, {
              explain: `한 꼭짓점에서 그을 수 있는 대각선은 ${n} − 3 = ${n - 3}(개)이고, 이 대각선으로 삼각형은 대각선보다 1개 더 많이 생긴다. ${n} − 2 = ${n - 2}(개)이다.`, facts: { calc: [[`${n}-2`, 0]], unseen: [n, 2] }
            });
          }),
          T('diag-all', '다각형의 대각선의 개수', '①8', (d) => {
            const n = d.int(7, 20);
            return cntQ(`${gon(n)}의 대각선의 개수는?`, diagAll(n), {
              explain: `${N_}각형의 대각선의 개수는 ${frac(`${N_}(${N_} − 3)`, 2)}이다. ${frac(`${n} × (${n} − 3)`, 2)} = ${diagAll(n)}(개)이다.`, facts: { calc: [[`${n}*(${n}-3)/2`, 0]], unseen: [n, 3, 2] }
            });
          }),
          T('diag-process', '대각선의 개수를 구하는 과정의 빈칸', '①9', (d) => {
            const n = d.int(8, 16);
            return M(`다음은 ${gon(n)}의 대각선의 개수를 구하는 과정이다. ㉠, ㉡, ㉢에 알맞은 수는?`, [{ label: '㉠', answer: n - 3 }, { label: '㉡', answer: n * (n - 3) }, { label: '㉢', answer: diagAll(n) }], {
              figure: lines([
                `한 꼭짓점에서 그을 수 있는 대각선은 ${n} − 3 = ${box('㉠')}(개)이다.`,
                `꼭짓점이 ${n}개이므로 꼭짓점마다 그은 대각선을 모두 세면 ${n} × ${box('㉠')} = ${box('㉡')}(개)이다.`,
                `이때 대각선 하나를 2번씩 세었으므로 대각선의 개수는 ${box('㉡')} ÷ 2 = ${box('㉢')}이다.`
              ]),
              explain: `㉠ ${n} − 3 = ${n - 3}, ㉡ ${n} × ${n - 3} = ${n * (n - 3)}, ㉢ ${n * (n - 3)} ÷ 2 = ${diagAll(n)}이다.`,
              facts: { calc: [[`${n}-3`, 0], [`${n}*(${n}-3)`, 1], [`${n}*(${n}-3)/2`, 2]] }
            });
          }),
          T('diag-back', '한 꼭짓점의 대각선·삼각형의 개수로 다각형 찾기', '①10·11', (d, t) => {
            const n = d.int(8, 20);
            if (t === 0) return gonQ(`한 꼭짓점에서 그을 수 있는 대각선의 개수가 ${n - 3}인 다각형은 몇 각형인가?`, n, {
              explain: `${N_}각형의 한 꼭짓점에서 그을 수 있는 대각선은 (${N_} − 3)개이다. ${N_} − 3 = ${n - 3}에서 ${N_} = ${n}이므로 ${gon(n)}이다.`, facts: { calc: [[`${n - 3}+3`, 0]], unseen: [3] }
            });
            return gonQ(`한 꼭짓점에서 대각선을 모두 그었더니 삼각형 ${n - 2}개로 나누어진 다각형은 몇 각형인가?`, n, {
              explain: `${N_}각형의 한 꼭짓점에서 대각선을 모두 그으면 삼각형 (${N_} − 2)개로 나누어진다. ${N_} − 2 = ${n - 2}에서 ${N_} = ${n}이므로 ${gon(n)}이다.`, facts: { calc: [[`${n - 2}+2`, 0]], unseen: [2] }
            });
          }, { count: 2 }),
          T('diag-one-to-all', '한 꼭짓점의 대각선의 개수로 전체 대각선의 개수 구하기', '①10 심3', (d) => {
            const n = d.int(9, 20);
            return cntQ(`한 꼭짓점에서 그을 수 있는 대각선의 개수가 ${n - 3}인 다각형의 대각선의 개수는?`, diagAll(n), {
              explain: `${N_} − 3 = ${n - 3}에서 ${N_} = ${n}이므로 ${gon(n)}이다. ${gon(n)}의 대각선의 개수는 ${frac(`${n} × ${n - 3}`, 2)} = ${diagAll(n)}이다.`,
              facts: { calc: [[`(${n - 3}+3)*${n - 3}/2`, 0]], unseen: [3, 2] }
            });
          }),
          T('diag-all-back', '대각선의 개수로 다각형 찾기', '①13', (d) => {
            const n = d.int(7, 15), k = diagAll(n);
            return gonQ(`대각선의 개수가 ${k}인 다각형은 몇 각형인가?`, n, {
              explain: `${frac(`${N_}(${N_} − 3)`, 2)} = ${k}에서 ${N_}(${N_} − 3) = ${2 * k}이다. 차가 3인 두 자연수의 곱이 ${2 * k}인 것은 ${n} × ${n - 3}이므로 ${N_} = ${n}, ${gon(n)}이다.`,
              facts: { calc: [[`(3+(9+8*${k})**0.5)/2`, 0]], unseen: [3, 9, 8, 0.5, 2] }
            });
          })
        ]
      },
      {
        id: 'tri', title: '삼각형의 내각과 외각', standard: POLY,
        types: [
          T('tri-expr', '세 내각이 x에 대한 식인 삼각형', '①16', (d) => {
            const draw = (w) => {
              const r = 180 - w.p - w.q, ang = [w.p, w.q, r], lab = [exSvg(w.k1, w.b1), exSvg(w.k2, w.b2), r + '°'], t = triOf(ang[w.order[0]], ang[w.order[1]], ang[w.order[2]], [210, 145]), b = Board();
              return b.poly([t.B, t.C, t.A]).corner(t.A, t.B, t.C, lab[w.order[0]]).corner(t.B, t.C, t.A, lab[w.order[1]]).corner(t.C, t.A, t.B, lab[w.order[2]]);
            };
            const v = d.until(() => {
              const x = d.int(12, 40), k1 = d.pick([2, 3]), k2 = d.pick([1, 2]), b1 = d.int(-4, 4) * 5, b2 = d.pick([0, 0, 5, 10, 14, 15, -5, -10, 20]);
              return { x, k1, k2, b1, b2, p: k1 * x + b1, q: k2 * x + b2, order: d.shuffle([0, 1, 2]) };
            }, (w) => w.p >= 45 && w.p <= 90 && w.q >= 45 && w.q <= 90 && 180 - w.p - w.q >= 35 && (180 - w.p - w.q) % 5 === 0 && !draw(w).clash());
            const r = 180 - v.p - v.q, order = v.order, say = [exSay(v.k1, v.b1), exSay(v.k2, v.b2), r + '°'], b = draw(v);
            const rest = 180 - r - v.b1 - v.b2;
            return N(`삼각형의 세 내각의 크기가 그림과 같을 때, ${X}의 값은?`, v.x, {
              figure: b.svg(`삼각형. 세 내각의 크기는 위 꼭짓점부터 시계 반대쪽으로 ${say[order[0]]}, ${say[order[1]]}, ${say[order[2]]}`),
              explain: `삼각형의 세 내각의 크기의 합은 180°이므로 ${exHtml(v.k1, v.b1)} + ${exHtml(v.k2, v.b2)} + ${r}° = 180°이다. ${v.k1 + v.k2}${X} = ${rest}에서 ${X} = ${v.x}이다.`,
              facts: { calc: [[`(180-${r}-(${v.b1})-(${v.b2}))/(${v.k1}+${v.k2})`, 0]], unseen: [180, 1, 0] }
            });
          }),
          T('tri-ratio', '세 내각의 크기의 비', '①17', (d) => {
            const [a, bb, c] = d.pick([[2, 3, 4], [2, 3, 5], [1, 4, 5], [3, 4, 5], [1, 5, 6], [2, 3, 7], [4, 5, 6], [3, 5, 7], [5, 6, 7], [1, 2, 3], [2, 5, 8], [3, 4, 8], [2, 7, 9]]), sum = a + bb + c, small = d.bool();
            return degQ(`삼각형의 세 내각의 크기의 비가 ${nb(`${a} : ${bb} : ${c}`)}일 때, 가장 ${small ? '작은' : '큰'} 내각의 크기는?`, 180 * (small ? a : c) / sum, {
              explain: `세 내각의 크기의 합은 180°이다. 가장 ${small ? '작은' : '큰'} 내각의 크기는 180° × ${frac(small ? a : c, `${a} + ${bb} + ${c}`)} = ${180 * (small ? a : c) / sum}°이다.`,
              facts: { calc: [[`180*${small ? a : c}/(${a}+${bb}+${c})`, 0]], unseen: [180] }
            });
          }),
          T('tri-why', '평행선을 그어 삼각형의 내각과 외각의 성질 설명하기', '①18', (d, n) => {
            // 세 각이 모두 달라야 크기가 같은 각이 하나뿐이다.
            const [a, bv, c] = d.until(() => { const p = 5 * d.int(9, 15), q = 5 * d.int(8, 14); return [p, q, 180 - p - q]; }, (w) => w[2] >= 40 && w[2] <= 75 && Math.abs(w[0] - w[1]) >= 10 && Math.abs(w[1] - w[2]) >= 10 && Math.abs(w[0] - w[2]) >= 10);
            const t = triOf(a, bv, c, [150, 105]), b = Board();
            b.poly([t.B, t.C, t.A]);
            if (n === 0) {
              const D = [t.A[0] - 64, t.A[1]], E = [t.A[0] + 64, t.A[1]], ask = d.pick(['B', 'C']), right = ask === 'B' ? '∠DAB' : '∠EAC';
              b.seg(D, E).arrow(D, E, 0.88).arrow(t.B, t.C, 0.5);
              b.name(t.A, 'A', 90).name(D, 'D', 90).name(E, 'E', 90).name(t.B, 'B', awayFrom(t.B, [t.A, t.C])).name(t.C, 'C', awayFrom(t.C, [t.A, t.B]));
              const options = d.shuffle(['∠DAB', '∠EAC', '∠BAC', ask === 'B' ? '∠ACB' : '∠ABC']);
              return C(`△ABC의 꼭짓점 A를 지나고 변 BC에 평행한 직선 DE를 그었다. 다음 중 ∠${ask}와 크기가 항상 같은 각은?`, options, options.indexOf(right), {
                figure: b.svg('삼각형 ABC와, 꼭짓점 A를 지나고 변 BC에 평행한 직선 DE. 점 D는 점 A의 왼쪽(점 B 쪽), 점 E는 점 A의 오른쪽(점 C 쪽)에 있다'),
                explain: `평행선에서 엇각의 크기는 같다. 직선 DE와 변 BC가 평행하므로 ∠${ask} = ${right}(엇각)이다. 이때 ∠DAB + ∠BAC + ∠EAC = 180°이므로 삼각형의 세 내각의 크기의 합은 180°이다.`,
                facts: { truth: options.map((o) => o === right), want: true }
              });
            }
            const D = [t.C[0] + 48, t.C[1]], E = at(t.C, 60, dirOf(t.B, t.A)), ask = d.pick(['A', 'B']), right = ask === 'A' ? '∠ACE' : '∠ECD';
            b.seg(t.C, D).seg(t.C, E).arrow(t.B, t.A, 0.55).arrow(t.C, E, 0.6);
            b.name(t.A, 'A', awayFrom(t.A, [t.B, t.C])).name(t.B, 'B', awayFrom(t.B, [t.A, t.C])).name(t.C, 'C', 270).name(D, 'D', 270).name(E, 'E', dirOf(t.C, E));
            const options = d.shuffle(['∠ACE', '∠ECD', '∠ACB', '∠ACD']);
            return C(`△ABC에서 변 BC의 연장선 위에 점 D를 잡고, 꼭짓점 C를 지나고 변 AB에 평행한 반직선 CE를 그었다. 다음 중 ∠${ask}와 크기가 항상 같은 각은?`, options, options.indexOf(right), {
              figure: b.svg('삼각형 ABC. 점 D는 변 BC를 점 C 쪽으로 늘인 선 위에 있다. 반직선 CE는 변 AB에 평행하고 ∠ACD의 안쪽을 지난다'),
              explain: ask === 'A' ? '평행선에서 엇각의 크기는 같다. 변 AB와 반직선 CE가 평행하므로 ∠A = ∠ACE(엇각)이다. ∠B = ∠ECD(동위각)이므로 ∠ACD = ∠A + ∠B이다.' : '평행선에서 동위각의 크기는 같다. 변 AB와 반직선 CE가 평행하므로 ∠B = ∠ECD(동위각)이다. ∠A = ∠ACE(엇각)이므로 ∠ACD = ∠A + ∠B이다.',
              facts: { truth: options.map((o) => o === right), want: true }
            });
          }, { count: 2 }),
          T('tri-ext', '삼각형의 한 외각과 이웃하지 않는 두 내각', '①19', (d, n) => {
            const [a, bv] = d.until(() => [5 * d.int(8, 16), 5 * d.int(8, 15)], (w) => 180 - w[0] - w[1] >= 35 && 180 - w[0] - w[1] <= 95 && w[0] !== w[1]), e = a + bv;
            const t = triOf(a, bv, 180 - a - bv, [150, 108]), b = Board(), D = [t.C[0] + 46, t.C[1]];
            b.poly([t.B, t.C, t.A]).seg(t.C, D);
            b.name(t.A, 'A', awayFrom(t.A, [t.B, t.C])).name(t.B, 'B', awayFrom(t.B, [t.A, t.C])).name(t.C, 'C', 270).name(D, 'D', 270);
            const head = '삼각형 ABC. 점 D는 변 BC를 점 C 쪽으로 늘인 선 위에 있다. ';
            if (n === 0) {
              b.corner(t.A, t.B, t.C, a + '°').corner(t.B, t.C, t.A, bv + '°').corner(t.C, D, t.A, '', { square: false });
              return degQ(`△ABC에서 변 BC의 연장선 위에 점 D가 있다. ∠A = ${a}°, ∠B = ${bv}°일 때, ∠ACD의 크기는?`, e, {
                figure: b.svg(`${head}∠A = ${a}°, ∠B = ${bv}°`),
                explain: `삼각형의 한 외각의 크기는 그와 이웃하지 않는 두 내각의 크기의 합과 같다. ∠ACD = ∠A + ∠B = ${a}° + ${bv}° = ${e}°이다.`, facts: { calc: [[`${a}+${bv}`, 0]] }
              });
            }
            b.corner(t.B, t.C, t.A, bv + '°').corner(t.C, D, t.A, e + '°').corner(t.A, t.B, t.C, '', { square: false });
            return degQ(`△ABC에서 변 BC의 연장선 위에 점 D가 있다. ∠ACD = ${e}°, ∠B = ${bv}°일 때, ∠A의 크기는?`, a, {
              figure: b.svg(`${head}∠ACD = ${e}°, ∠B = ${bv}°`),
              explain: `삼각형의 한 외각의 크기는 그와 이웃하지 않는 두 내각의 크기의 합과 같다. ∠A + ${bv}° = ${e}°이므로 ∠A = ${e}° − ${bv}° = ${a}°이다.`, facts: { calc: [[`${e}-${bv}`, 0]] }
            });
          }, { count: 2 }),
          T('tri-ext-two', '외각이 두 군데 표시된 삼각형', '①20', (d) => {
            const [a, c] = d.until(() => [5 * d.int(6, 12), 5 * d.int(10, 22)], (w) => 180 - w[0] - w[1] >= 30 && w[1] !== 90), e = 180 - c, x = a + c;
            const t = triOf(a, 180 - a - c, c, [140, 105]), b = Board(), D = [t.B[0] - 44, t.B[1]], E = [t.C[0] + 44, t.C[1]];
            b.poly([t.B, t.C, t.A]).seg(t.B, D).seg(t.C, E);
            b.corner(t.A, t.B, t.C, a + '°').corner(t.C, E, t.A, e + '°').corner(t.B, t.A, D, sv('x'));
            b.name(t.A, 'A', 90).name(t.B, 'B', 270).name(t.C, 'C', 270).name(D, 'D', 270).name(E, 'E', 270);
            return degQ(`△ABC에서 변 BC의 양쪽 연장선 위에 두 점 D, E가 있다. ∠A = ${a}°, ∠ACE = ${e}°일 때, ∠ABD의 크기는?`, x, {
              figure: b.svg(`삼각형 ABC. 점 D는 변 BC를 점 B 쪽으로, 점 E는 점 C 쪽으로 늘인 선 위에 있다. ∠A = ${a}°, ∠ACE = ${e}°, ∠ABD = x`),
              explain: `∠ACB = 180° − ${e}° = ${c}°이다. ∠ABD는 △ABC의 외각이므로 이웃하지 않는 두 내각의 크기의 합과 같다. ∠ABD = ∠A + ∠ACB = ${a}° + ${c}° = ${x}°이다.`,
              facts: { calc: [[`${a}+180-${e}`, 0]], unseen: [180] }
            });
          }),
          T('tri-ext-expr', '내각과 외각이 x에 대한 식인 삼각형', '①21 심11', (d, n) => {
            if (n === 0) {
              // 두 내각 a°, k1·x° 와 나머지 꼭짓점의 외각 (k2·x + c)°
              const v = d.until(() => { const x = d.int(15, 55), [k1, k2] = d.pick([[1, 2], [1, 2], [2, 1], [1, 3], [2, 3]]), a = d.int(6, 14) * 5; return { x, k1, k2, a, c: a + k1 * x - k2 * x, q: k1 * x }; },
                (w) => w.q >= 30 && w.q <= 80 && w.a + w.q >= 75 && w.a + w.q <= 140 && w.c !== 0 && Math.abs(w.c) >= 5 && Math.abs(w.c) <= 90 && w.a !== w.q);
              const t = triOf(v.a, v.q, 180 - v.a - v.q, [165, 118]), b = Board(), D = [t.C[0] + 58, t.C[1]];
              b.poly([t.B, t.C, t.A]).seg(t.C, D).corner(t.A, t.B, t.C, v.a + '°').corner(t.B, t.C, t.A, exSvg(v.k1, 0)).corner(t.C, D, t.A, exSvg(v.k2, v.c));
              return N(`삼각형의 두 내각의 크기와 한 외각의 크기가 그림과 같을 때, ${X}의 값은?`, v.x, {
                figure: b.svg(`삼각형과, 밑변을 오른쪽으로 늘인 선. 위 꼭짓점의 내각은 ${v.a}°, 왼쪽 아래 꼭짓점의 내각은 ${exSay(v.k1, 0)}, 오른쪽 아래 꼭짓점의 외각은 ${exSay(v.k2, v.c)}`),
                explain: `삼각형의 한 외각의 크기는 그와 이웃하지 않는 두 내각의 크기의 합과 같으므로 ${v.a}° + ${exHtml(v.k1, 0)} = ${exHtml(v.k2, v.c)}이다. ${X} = ${v.x}이다.`,
                facts: { calc: [[`(${v.a}-(${v.c}))/(${v.k2}-${v.k1})`, 0]], unseen: [1], rule: 'ext-expr-out' }
              });
            }
            // 두 내각 (x + p)°, (qx + r)° 와 나머지 꼭짓점의 외각 e°
            const drawIn = (w) => { const t = triOf(w.a, w.bb, 180 - w.a - w.bb, [200, 135]), b = Board(), D = [t.C[0] + 44, t.C[1]]; return b.poly([t.B, t.C, t.A]).seg(t.C, D).corner(t.A, t.B, t.C, exSvg(1, w.p)).corner(t.B, t.C, t.A, exSvg(w.q, w.r)).corner(t.C, D, t.A, (w.a + w.bb) + '°'); };
            const v = d.until(() => { const x = d.int(20, 50), q = d.pick([2, 2, 3]), p = d.int(-3, 6) * 5, r = d.int(-9, 3) * 5; return { x, q, p, r, a: x + p, bb: q * x + r }; },
              (w) => w.a >= 40 && w.a <= 80 && w.bb >= 40 && w.bb <= 80 && w.a + w.bb >= 85 && w.a + w.bb <= 140 && w.p !== 0 && w.r !== 0 && w.a !== w.bb && !drawIn(w).clash());
            const e = v.a + v.bb, b = drawIn(v);
            return N(`삼각형의 두 내각의 크기와 한 외각의 크기가 그림과 같을 때, ${X}의 값은?`, v.x, {
              figure: b.svg(`삼각형과, 밑변을 오른쪽으로 늘인 선. 위 꼭짓점의 내각은 ${exSay(1, v.p)}, 왼쪽 아래 꼭짓점의 내각은 ${exSay(v.q, v.r)}, 오른쪽 아래 꼭짓점의 외각은 ${e}°`),
              explain: `삼각형의 한 외각의 크기는 그와 이웃하지 않는 두 내각의 크기의 합과 같으므로 ${exHtml(1, v.p)} + ${exHtml(v.q, v.r)} = ${e}°이다. ${v.q + 1}${X} = ${e - v.p - v.r}에서 ${X} = ${v.x}이다.`,
              facts: { calc: [[`(${e}-(${v.p})-(${v.r}))/(1+${v.q})`, 0]], unseen: [1], rule: 'ext-expr-in' }
            });
          }, { count: 2 }),
          T('tri-iso-ext', '이등변삼각형의 꼭지각의 외각', '①22', (d) => {
            const e = 2 * d.int(36, 64), x = e / 2, L = e < 90 ? 98 : 112, b = Board(), pB = [0, 0], pC = [L, 0], pA = at(pC, L, e), D = [L + 46, 0];
            b.poly([pB, pC, pA]).seg(pC, D).tick(pC, pA).tick(pB, pC);
            b.angle(pC, 0, e, e + '°').corner(pB, pC, pA, sv('x'));
            b.name(pA, 'A', awayFrom(pA, [pB, pC])).name(pB, 'B', awayFrom(pB, [pA, pC])).name(pC, 'C', 270).name(D, 'D', 270);
            return degQ(`△ABC에서 ${nb(`${sg('CA')} = ${sg('CB')}`)}이고 변 BC의 연장선 위에 점 D가 있다. ∠ACD = ${e}°일 때, ∠B의 크기는?`, x, {
              figure: b.svg(`삼각형 ABC. 변 CA와 변 CB에 길이가 같다는 표시가 있다. 점 D는 변 BC를 점 C 쪽으로 늘인 선 위에 있다. ∠ACD = ${e}°, ∠B = x`),
              explain: `${sg('CA')} = ${sg('CB')}이므로 ∠A = ∠B이다. ∠ACD는 △ABC의 외각이므로 ∠A + ∠B = ${e}°이다. ∠B = ${e}° ÷ 2 = ${x}°이다.`,
              facts: { calc: [[`${e}/2`, 0]], unseen: [2] }
            });
          }),
          T('tri-cevian', '한 꼭짓점에서 맞은편 변에 그은 선분', '①23 심12', (d, n) => {
            if (n === 0) {
              const draw = ([bv, c, p, x]) => {
                const t = triOf(p + x, bv, c, [200, 140]), b = Board(), D = [t.B[0] + dist(t.A, t.B) * Math.sin(p * RAD) / Math.sin((bv + p) * RAD), t.B[1]];
                b.poly([t.B, t.C, t.A]).seg(t.A, D);
                b.corner(t.B, t.C, t.A, bv + '°').corner(t.C, t.A, t.B, c + '°').corner(t.A, t.B, D, p + '°', { r: 24 }).corner(t.A, D, t.C, sv('x'), { r: 30 });
                return b.name(t.A, 'A', 90).name(t.B, 'B', awayFrom(t.B, [t.A, t.C])).name(t.C, 'C', awayFrom(t.C, [t.A, t.B])).name(D, 'D', 270);
              };
              const [bv, c, p, x] = d.until(() => { const u = 5 * d.int(9, 14), w = 5 * d.int(6, 11), q = 5 * d.int(6, 10); return [u, w, q, 180 - u - w - q]; }, (w) => w[3] >= 30 && w[3] <= 55 && w[3] !== w[2] && !draw(w).clash());
              const b = draw([bv, c, p, x]);
              return degQ(`△ABC에서 점 D는 변 BC 위의 점이다. ∠B = ${bv}°, ∠C = ${c}°, ∠BAD = ${p}°일 때, ∠DAC의 크기는?`, x, {
                figure: b.svg(`삼각형 ABC와 선분 AD. 점 D는 변 BC 위에 있다. ∠B = ${bv}°, ∠C = ${c}°, ∠BAD = ${p}°, ∠DAC = x`),
                explain: `△ABC의 세 내각의 크기의 합은 180°이므로 ∠BAC = 180° − ${bv}° − ${c}° = ${p + x}°이다. ∠DAC = ${p + x}° − ${p}° = ${x}°이다.`,
                facts: { calc: [[`180-${bv}-${c}-${p}`, 0]], unseen: [180] }
              });
            }
            const drawB = ([bv, c, a]) => {
              const h = a / 2, t = triOf(a, bv, c, [200, 140]), b = Board(), D = [t.B[0] + dist(t.A, t.B) * Math.sin(h * RAD) / Math.sin((bv + h) * RAD), t.B[1]];
              b.poly([t.B, t.C, t.A]).seg(t.A, D);
              b.corner(t.B, t.C, t.A, bv + '°').corner(t.C, t.A, t.B, c + '°').corner(D, t.C, t.A, sv('x'), { square: false });
              b.sym(t.A, (dirOf(t.A, t.B) + dirOf(t.A, D)) / 2, 'dot', 26).sym(t.A, (dirOf(t.A, D) + dirOf(t.A, t.C)) / 2, 'dot', 26);
              return b.name(t.A, 'A', 90).name(t.B, 'B', awayFrom(t.B, [t.A, t.C])).name(t.C, 'C', awayFrom(t.C, [t.A, t.B])).name(D, 'D', 270);
            };
            const [bv, c, a] = d.until(() => { const u = 5 * d.int(7, 13), w = 5 * d.int(8, 15); return [u, w, 180 - u - w]; }, (w) => w[2] >= 50 && w[2] <= 90 && w[2] % 2 === 0 && w[0] !== w[1] && !drawB(w).clash()), h = a / 2, x = bv + h, b = drawB([bv, c, a]);
            return degQ(`△ABC에서 ∠A의 이등분선이 변 BC와 만나는 점을 D라 하자. ∠B = ${bv}°, ∠C = ${c}°일 때, ∠ADC의 크기는?`, x, {
              figure: b.svg(`삼각형 ABC와 선분 AD. 점 D는 변 BC 위에 있고, ∠BAD와 ∠DAC에 크기가 같다는 표시가 있다. ∠B = ${bv}°, ∠C = ${c}°, ∠ADC = x`),
              explain: `∠BAC = 180° − ${bv}° − ${c}° = ${a}°이므로 ∠BAD = ${h}°이다. ∠ADC는 △ABD의 외각이므로 ∠ADC = ∠B + ∠BAD = ${bv}° + ${h}° = ${x}°이다.`,
              facts: { calc: [[`${bv}+(180-${bv}-${c})/2`, 0]], unseen: [180, 2] }
            });
          }, { count: 2 }),
          T('tri-bowtie', '두 선분이 만나 생긴 두 삼각형', '①24 심13', (d) => {
            const draw = ([a, bv, c, x]) => {
              const phi = 180 - a - bv, b = Board(), O = [0, 0], k1 = 100 / Math.max(Math.sin(a * RAD), Math.sin(bv * RAD)), k2 = 100 / Math.max(Math.sin(c * RAD), Math.sin(x * RAD));
              const pA = at(O, k1 * Math.sin(bv * RAD), 180 - phi / 2), pB = at(O, k1 * Math.sin(a * RAD), 180 + phi / 2), pD = at(O, k2 * Math.sin(c * RAD), -phi / 2), pC = at(O, k2 * Math.sin(x * RAD), phi / 2);
              b.seg(pA, pD).seg(pB, pC).seg(pA, pB).seg(pC, pD);
              b.corner(pA, pB, O, a + '°').corner(pB, O, pA, bv + '°').corner(pC, O, pD, c + '°').corner(pD, pC, O, sv('x'));
              return b.name(pA, 'A', awayFrom(pA, [pB, O])).name(pB, 'B', awayFrom(pB, [pA, O])).name(pC, 'C', awayFrom(pC, [pD, O])).name(pD, 'D', awayFrom(pD, [pC, O])).name(O, 'O', 90, 13);
            };
            const [a, bv, c, x] = d.until(() => { const p = 5 * d.int(6, 14), q = 5 * d.int(6, 14), r = 5 * d.int(6, 14); return [p, q, r, p + q - r]; }, (w) => w[3] >= 30 && w[3] <= 80 && w[0] + w[1] >= 80 && w[0] + w[1] <= 125 && w[3] !== w[2] && w[0] !== w[2] && w[1] !== w[2] && !draw(w).clash());
            const b = draw([a, bv, c, x]);
            return degQ(`선분 AD와 선분 BC가 점 O에서 만난다. ∠A = ${a}°, ∠B = ${bv}°, ∠C = ${c}°일 때, ∠D의 크기는?`, x, {
              figure: b.svg(`선분 AD와 선분 BC가 점 O에서 만나고, 선분 AB와 선분 CD가 그어져 삼각형 OAB와 삼각형 OCD가 점 O에서 맞닿아 있다. ∠A = ${a}°, ∠B = ${bv}°, ∠C = ${c}°, ∠D = x`),
              explain: `∠AOB와 ∠COD는 맞꼭지각이므로 크기가 같다. 두 삼각형에서 나머지 두 내각의 크기의 합이 같으므로 ${a}° + ${bv}° = ${c}° + ∠D이다. ∠D = ${x}°이다.`,
              facts: { calc: [[`${a}+${bv}-${c}`, 0]] }
            });
          })
        ]
      },
      { id: 'sum', title: '다각형의 내각과 외각의 크기의 합', standard: POLY, types: [] },
      { id: 'regular', title: '정다각형의 한 내각과 한 외각', standard: POLY, types: [] },
      { id: 'circle', title: '원과 부채꼴', standard: FAN, types: [] },
      { id: 'central', title: '부채꼴의 중심각과 호의 길이, 넓이', standard: FAN, types: [] },
      { id: 'sector', title: '원의 둘레와 넓이, 부채꼴의 호의 길이와 넓이', standard: FAN, types: [] },
      { id: 'shade', title: '색칠한 부분의 둘레와 넓이', standard: FAN, types: [] }
    ]
  });

  // ── 다각형의 내각과 외각의 크기의 합 ──
  // 정n각형을 삼각형으로 나눈 그림. way: 'inner' 안의 한 점과 꼭짓점을 모두 잇는다, 'side' 한 변 위의 점과 꼭짓점을 잇는다.
  function splitFig(n, way) {
    const P = regPts(n, n === 6 ? 62 : 54), b = Board();
    b.poly(P);
    if (way === 'inner') {
      const Q = [P.reduce((s, p) => s + p[0], 0) / n + 9, P.reduce((s, p) => s + p[1], 0) / n + 7];
      P.forEach((p) => b.seg(Q, p, 'thin')); b.dot(Q).nameFree(Q, 'P', P.map((p) => dirOf(Q, p)));
      return b.svg(`${gon(n)}의 내부의 한 점 P와 꼭짓점 ${n}개를 선분으로 모두 이어 ${gon(n)}을 삼각형 ${n}개로 나누었다`);
    }
    const Q = mid(P[0], P[1], 0.42);
    for (let i = 2; i < n; i += 1) b.seg(Q, P[i], 'thin');
    b.dot(Q).name(Q, 'P', 270);
    return b.svg(`${gon(n)}의 한 변 위의 점 P와, 그 변의 두 끝 점이 아닌 꼭짓점 ${n - 2}개를 선분으로 모두 이어 ${gon(n)}을 삼각형 ${n - 1}개로 나누었다`);
  }
  // 꼭짓점 차례로 각도를 읽은 그림 설명. kinds[i]: 'in' 내각, 'out' 외각, null 적지 않음
  const sayAngles = (vals, kinds) => vals.map((v, i) => (kinds[i] ? `${kinds[i] === 'in' ? '내각' : '외각'} ${typeof v === 'number' ? dgSay(v) : v}` : null)).filter(Boolean).join(', ');

  B.addTypes(UNIT, 'sum', [
    T('sum-in', '다각형의 내각의 크기의 합', '①30', (d) => {
      const n = d.int(6, 15);
      return degQ(`${gon(n)}의 내각의 크기의 합은?`, inSum(n), {
        explain: `${N_}각형의 내각의 크기의 합은 180° × (${N_} − 2)이다. 180° × (${n} − 2) = ${inSum(n)}°이다.`, facts: { calc: [[`180*(${n}-2)`, 0]], unseen: [180, n, 2] }
      });
    }),
    T('sum-ext', '다각형의 외각의 크기의 합', '①30·44', (d) => {
      const n = d.int(5, 20);
      return degQ(`${gon(n)}의 외각의 크기의 합은?`, 360, {
        explain: `다각형의 외각의 크기의 합은 변의 개수와 상관없이 항상 360°이다. 내각과 외각의 크기의 합 180° × ${n}에서 내각의 크기의 합 180° × (${n} − 2)를 빼면 180° × 2 = 360°이다.`,
        facts: { calc: [[`180*${n}-180*(${n}-2)`, 0]], unseen: [180, n, 2] }
      });
    }),
    T('sum-process', '대각선으로 나누어 내각의 크기의 합을 구하는 과정의 빈칸', '①7·30', (d) => {
      const n = d.int(7, 20);
      return M(`다음은 ${gon(n)}의 내각의 크기의 합을 구하는 과정이다. ㉠, ㉡에 알맞은 수는?`, [{ label: '㉠', answer: n - 2 }, { label: '㉡', answer: inSum(n) }], {
        figure: lines([`${gon(n)}의 한 꼭짓점에서 대각선을 모두 그으면 ${gon(n)}은 삼각형 ${box('㉠')}개로 나누어진다.`, `삼각형의 세 내각의 크기의 합은 180°이므로 ${gon(n)}의 내각의 크기의 합은 180° × ${box('㉠')} = ${box('㉡')}°이다.`]),
        explain: `한 꼭짓점에서 그을 수 있는 대각선은 ${n - 3}개이고 삼각형은 ${n - 2}개 생긴다. 내각의 크기의 합은 180° × ${n - 2} = ${inSum(n)}°이다.`,
        facts: { calc: [[`${n}-2`, 0], [`180*(${n}-2)`, 1]], unseen: [n, 2] }
      });
    }),
    T('sum-inner-point', '내부의 한 점과 꼭짓점을 이어 생긴 삼각형의 개수로 내각의 크기의 합 구하기', '①31', (d) => {
      const n = d.int(7, 15);
      return degQ(`어떤 다각형의 내부의 한 점과 각 꼭짓점을 선분으로 모두 이었더니 삼각형 ${n}개가 생겼다. 이 다각형의 내각의 크기의 합은?`, inSum(n), {
        explain: `삼각형이 ${n}개 생겼으므로 변이 ${n}개인 ${gon(n)}이다. 내각의 크기의 합은 180° × (${n} − 2) = ${inSum(n)}°이다. 삼각형 ${n}개의 내각의 크기의 합 180° × ${n}에서 내부의 한 점에 모인 각 360°를 뺀 것과 같다.`,
        facts: { calc: [[`180*${n}-360`, 0]], unseen: [180, 360] }
      });
    }),
    T('sum-split-expr', '삼각형으로 나눈 방법에 맞는 내각의 크기의 합의 식', '①32', (d, t) => {
      const n = d.pick([6, 7, 8]), way = t === 0 ? 'inner' : 'side';
      const right = way === 'inner' ? `180° × ${n} − 360°` : `180° × ${n - 1} − 180°`;
      // 틀린 보기: 다른 방법의 식(값은 같다), 빼야 할 각을 빼지 않은 식
      const options = d.shuffle([`180° × ${n} − 360°`, `180° × ${n - 1} − 180°`, `180° × ${n - 2}`, way === 'inner' ? `180° × ${n}` : `180° × ${n - 1}`]);
      const told = way === 'inner' ? `삼각형 ${n}개의 내각의 크기의 합 180° × ${n}에는 점 P에 모인 각 360°가 들어 있으므로 이것을 뺀다.` : `삼각형 ${n - 1}개의 내각의 크기의 합 180° × ${n - 1}에는 점 P에 모인 각 180°(평각)가 들어 있으므로 이것을 뺀다.`;
      return C(`${gon(n)}의 ${way === 'inner' ? '내부의 한 점 P와 각 꼭짓점을' : '한 변 위의 점 P와 꼭짓점을'} 그림과 같이 이어 ${gon(n)}을 삼각형으로 나누었다. 나누어진 삼각형의 내각의 크기의 합에서 ${gon(n)}의 내각이 아닌 각의 크기를 빼어 ${gon(n)}의 내각의 크기의 합을 구하는 식은?`, options, options.indexOf(right), {
        figure: splitFig(n, way), explain: `${told} ${right} = ${inSum(n)}°이다.`, facts: { truth: options.map((o) => o === right), want: true }
      });
    }, { count: 2 }),
    T('sum-in-back', '내각의 크기의 합으로 다각형 찾기', '①33', (d) => {
      const n = d.int(6, 15);
      return gonQ(`내각의 크기의 합이 ${inSum(n)}°인 다각형은 몇 각형인가?`, n, {
        explain: `180° × (${N_} − 2) = ${inSum(n)}°에서 ${N_} − 2 = ${n - 2}, ${N_} = ${n}이므로 ${gon(n)}이다.`, facts: { calc: [[`${inSum(n)}/180+2`, 0]], unseen: [180, 2] }
      });
    }),
    T('sum-total-back', '내각의 크기의 합과 외각의 크기의 합을 더한 값으로 다각형 찾기', '①34', (d) => {
      const n = d.int(6, 15);
      return gonQ(`내각의 크기의 합과 외각의 크기의 합을 더한 값이 ${180 * n}°인 다각형은 몇 각형인가?`, n, {
        explain: `한 꼭짓점에서 내각과 외각의 크기의 합은 180°이므로 ${N_}각형의 내각의 크기의 합과 외각의 크기의 합을 더하면 180° × ${N_}이다. 180° × ${N_} = ${180 * n}°에서 ${N_} = ${n}이므로 ${gon(n)}이다.`,
        facts: { calc: [[`${180 * n}/180`, 0]], unseen: [180] }
      });
    }),
    T('sum-missing-in', '다각형의 빈 내각', '①35', (d, t) => {
      if (t === 0) {
        const n = d.pick([5, 6]), k = d.int(0, n - 1), draw = (w) => polyFig(w, { size: [176, 132], inner: Object.fromEntries(w.map((v, i) => [i, i === k ? sv('x') : dg(v)])) });
        const a = anglesOf(d, n, (w) => !draw(w).b.clash()), rest = a.filter((_, i) => i !== k), fig = draw(a);
        return degQ(`그림의 ${gon(n)}에서 ∠${X}의 크기는?`, a[k], {
          figure: fig.b.svg(`${gon(n)}. 내각의 크기는 꼭짓점 차례로 ${a.map((v, i) => (i === k ? 'x' : dgSay(v))).join(', ')}`),
          explain: `${gon(n)}의 내각의 크기의 합은 180° × (${n} − 2) = ${inSum(n)}°이다. ∠${X} = ${inSum(n)}° − (${rest.map((v) => v + '°').join(' + ')}) = ${a[k]}°이다.`,
          facts: { calc: [[`${inSum(n)}-${rest.join('-')}`, 0]], unseen: [inSum(n)] }
        });
      }
      // 크기가 같은 두 내각 x, x
      const a = d.until(() => { const x = 5 * d.int(19, 26), p = 5 * d.int(16, 27), q = 5 * d.int(16, 27); return d.shuffle([x, x, p, q, 540 - 2 * x - p - q]).concat([x]); },
        (w) => { const list = w.slice(0, 5), x = w[5]; return list.every((v) => v >= 80 && v <= 140) && list.filter((v) => v === x).length === 2 && polyOf(list, [160, 120]).ok && !polyFig(list, { size: [170, 128], inner: Object.fromEntries(list.map((v, i) => [i, v === x ? sv('x') : dg(v)])) }).b.clash(); });
      const x = a[5], list = a.slice(0, 5), rest = list.filter((v) => v !== x);
      const fig = polyFig(list, { size: [170, 128], inner: Object.fromEntries(list.map((v, i) => [i, v === x ? sv('x') : dg(v)])) });
      return degQ(`그림의 오각형에서 크기가 같은 두 내각을 ∠${X}라 할 때, ∠${X}의 크기는?`, x, {
        figure: fig.b.svg(`오각형. 내각의 크기는 꼭짓점 차례로 ${list.map((v) => (v === x ? 'x' : dgSay(v))).join(', ')}`),
        explain: `오각형의 내각의 크기의 합은 180° × (5 − 2) = 540°이다. 2∠${X} = 540° − (${rest.map((v) => v + '°').join(' + ')}) = ${2 * x}°이므로 ∠${X} = ${x}°이다.`,
        facts: { calc: [[`(540-${rest.join('-')})/2`, 0]], unseen: [540, 2] }
      });
    }, { count: 2 }),
    T('sum-in-mixed', '내각 사이에 외각이 하나 섞인 다각형', '①36', (d) => {
      const n = 5, [k, j] = d.shuffle([0, 1, 2, 3, 4]);
      const draw = (w) => polyFig(w, { size: [165, 125], inner: Object.fromEntries(w.map((v, i) => [i, i === k ? sv('x') : dg(v)]).filter(([i]) => i !== j)), ext: [j], outer: { [j]: dg(180 - w[j]) } });
      const a = anglesOf(d, n, (w) => !draw(w).b.clash()), e = 180 - a[j], rest = a.filter((_, i) => i !== k && i !== j), fig = draw(a);
      return degQ(`그림의 오각형에서 한 꼭짓점의 외각의 크기가 ${e}°일 때, ∠${X}의 크기는?`, a[k], {
        figure: fig.b.svg(`오각형. 꼭짓점 차례로 ${sayAngles(a.map((v, i) => (i === k ? 'x' : i === j ? e : v)), a.map((_, i) => (i === j ? 'out' : 'in')))}. 외각을 적은 꼭짓점에는 변을 늘인 선이 그어져 있다`),
        explain: `외각의 크기가 ${e}°인 꼭짓점의 내각의 크기는 180° − ${e}° = ${a[j]}°이다. 오각형의 내각의 크기의 합은 540°이므로 ∠${X} = 540° − (${rest.map((v) => v + '°').join(' + ')} + ${a[j]}°) = ${a[k]}°이다.`,
        facts: { calc: [[`540-${rest.join('-')}-(180-${e})`, 0]], unseen: [540, 180] }
      });
    }),
    T('sum-missing-ext', '외각의 크기의 합으로 빈 외각 구하기', '①37', (d, t) => {
      if (t === 0) {
        const n = d.pick([4, 5]), k = d.int(0, n - 1), draw = (w) => polyFig(w, { size: [130, 105], ext: w.map((_, i) => i), extLen: 38, outer: Object.fromEntries(w.map((v, i) => [i, i === k ? sv('x') : dg(180 - v)])) });
        const a = anglesOf(d, n, (w) => !draw(w).b.clash()), e = a.map((v) => 180 - v), rest = e.filter((_, i) => i !== k), fig = draw(a);
        return degQ(`그림은 ${gon(n)}의 꼭짓점마다 외각을 하나씩 나타낸 것이다. ∠${X}의 크기는?`, e[k], {
          figure: fig.b.svg(`${gon(n)}의 변을 한쪽 방향으로 모두 늘인 그림. 외각의 크기는 꼭짓점 차례로 ${e.map((v, i) => (i === k ? 'x' : dgSay(v))).join(', ')}`),
          explain: `다각형의 외각의 크기의 합은 360°이다. ∠${X} = 360° − (${rest.map((v) => v + '°').join(' + ')}) = ${e[k]}°이다.`,
          facts: { calc: [[`360-${rest.join('-')}`, 0]], unseen: [360] }
        });
      }
      // 사각형의 외각 x°, p°, kx°, q°
      const v = d.until(() => { const x = d.int(30, 55), k = d.pick([2, 3]), p = d.int(60, 115); return { x, k, p, q: 360 - x - k * x - p }; },
        (w) => w.q >= 60 && w.q <= 115 && w.k * w.x <= 130 && w.p !== w.q && polyOf([w.x, w.p, w.k * w.x, w.q].map((e) => 180 - e), [130, 105]).ok);
      const e = [v.x, v.p, v.k * v.x, v.q], a = e.map((w) => 180 - w), lab = [exSvg(1, 0), v.p + '°', exSvg(v.k, 0), v.q + '°'], say = [exSay(1, 0), v.p + '°', exSay(v.k, 0), v.q + '°'];
      const fig = polyFig(a, { size: [130, 105], ext: [0, 1, 2, 3], extLen: 38, outer: Object.fromEntries(lab.map((w, i) => [i, w])) });
      return N(`그림은 사각형의 꼭짓점마다 외각을 하나씩 나타낸 것이다. ${X}의 값은?`, v.x, {
        figure: fig.b.svg(`사각형의 변을 한쪽 방향으로 모두 늘인 그림. 외각의 크기는 꼭짓점 차례로 ${say.join(', ')}`),
        explain: `다각형의 외각의 크기의 합은 360°이므로 ${exHtml(1, 0)} + ${v.p}° + ${exHtml(v.k, 0)} + ${v.q}° = 360°이다. ${v.k + 1}${X} = ${360 - v.p - v.q}에서 ${X} = ${v.x}이다.`,
        facts: { calc: [[`(360-${v.p}-${v.q})/(1+${v.k})`, 0]], unseen: [360, 1] }
      });
    }, { count: 2 }),
    T('sum-ext-mixed', '외각 사이에 내각이 섞인 다각형', '①38', (d, t) => {
      const n = 5, order = d.shuffle([0, 1, 2, 3, 4]), ins0 = [order[3], order[4]], outs0 = [order[0], order[1], order[2]], outs1 = order.slice(1);
      const draw = (w) => (t === 0
        ? polyFig(w, { size: [150, 115], ext: outs0, inner: Object.fromEntries(ins0.map((i) => [i, dg(w[i])])), outer: Object.fromEntries(outs0.map((i) => [i, i === order[0] ? sv('x') : dg(180 - w[i])])) })
        : polyFig(w, { size: [150, 115], ext: outs1, inner: { [order[0]]: sv('x') }, outer: Object.fromEntries(outs1.map((i) => [i, dg(180 - w[i])])) }));
      const a = anglesOf(d, n, (w) => !draw(w).b.clash()), e = a.map((v) => 180 - v);
      if (t === 0) {
        // 외각 셋(하나가 x)과 내각 둘
        const k = order[0], ins = [order[3], order[4]], outs = [order[0], order[1], order[2]], given = [order[1], order[2]];
        const fig = draw(a);
        return degQ(`그림의 오각형에서 세 꼭짓점에는 외각을, 두 꼭짓점에는 내각을 나타내었다. 외각 ∠${X}의 크기는?`, e[k], {
          figure: fig.b.svg(`오각형. 꼭짓점 차례로 ${sayAngles(a.map((v, i) => (i === k ? 'x' : ins.includes(i) ? v : e[i])), a.map((_, i) => (ins.includes(i) ? 'in' : 'out')))}. 외각을 적은 꼭짓점에는 변을 늘인 선이 그어져 있다`),
          explain: `내각의 크기가 ${a[ins[0]]}°, ${a[ins[1]]}°인 꼭짓점의 외각의 크기는 ${e[ins[0]]}°, ${e[ins[1]]}°이다. 외각의 크기의 합은 360°이므로 ∠${X} = 360° − (${given.map((i) => e[i] + '°').join(' + ')} + ${e[ins[0]]}° + ${e[ins[1]]}°) = ${e[k]}°이다.`,
          facts: { calc: [[`360-${e[given[0]]}-${e[given[1]]}-(180-${a[ins[0]]})-(180-${a[ins[1]]})`, 0]], unseen: [360, 180] }
        });
      }
      // 외각 넷과 내각 x 하나
      const k = order[0], outs = order.slice(1);
      const fig = draw(a);
      return degQ(`그림의 오각형에서 네 꼭짓점에는 외각을, 한 꼭짓점에는 내각을 나타내었다. 내각 ∠${X}의 크기는?`, a[k], {
        figure: fig.b.svg(`오각형. 꼭짓점 차례로 ${sayAngles(a.map((v, i) => (i === k ? 'x' : e[i])), a.map((_, i) => (i === k ? 'in' : 'out')))}. 외각을 적은 꼭짓점에는 변을 늘인 선이 그어져 있다`),
        explain: `외각의 크기의 합은 360°이므로 ∠${X}의 외각의 크기는 360° − (${outs.map((i) => e[i] + '°').join(' + ')}) = ${e[k]}°이다. ∠${X} = 180° − ${e[k]}° = ${a[k]}°이다.`,
        facts: { calc: [[`180-(360-${outs.map((i) => e[i]).join('-')})`, 0]], unseen: [360, 180] }
      });
    }, { count: 2 }),
    T('sum-quad-inner', '사각형의 내부에서 두 선분이 만나 이루는 각', '①39', (d) => {
      const quadFig = (w) => {
        const P = polyOf([w.Bv, w.Cv, w.D, w.A], [185, 135]).pts, [pB, pC, pD, pA] = P, O = meet(pB, at(pB, 10, w.ob), pC, at(pC, 10, 180 - w.oc)), b = Board();
        b.poly(P).seg(pB, O).seg(pC, O);
        b.corner(pA, pB, pD, w.A + '°').corner(pD, pA, pC, w.D + '°').corner(pB, O, pA, w.p + '°', { r: 26 }).corner(pC, pD, O, w.q + '°', { r: 26 }).corner(O, pB, pC, sv('x'), { square: false });
        return b.name(pA, 'A', awayFrom(pA, [pB, pD])).name(pB, 'B', awayFrom(pB, [pA, pC])).name(pC, 'C', awayFrom(pC, [pB, pD])).name(pD, 'D', awayFrom(pD, [pA, pC])).name(O, 'O', 90, 13);
      };
      const inside = (q, P) => P.every((p, i) => { const r = P[(i + 1) % 4]; return (r[0] - p[0]) * (q[1] - p[1]) - (r[1] - p[1]) * (q[0] - p[0]) < -16 * dist(p, r); });
      const v = d.until(() => {
        const A = 5 * d.int(17, 23), D = 5 * d.int(17, 23), Bv = 5 * d.int(13, 18), Cv = 360 - A - D - Bv, p = 5 * d.int(6, 9), q = 5 * d.int(6, 9);
        return { A, D, Bv, Cv, p, q, ob: Bv - p, oc: Cv - q };
      }, (w) => w.Cv >= 65 && w.Cv <= 90 && w.ob >= 25 && w.oc >= 25 && w.p !== w.q && (() => { const P = polyOf([w.Bv, w.Cv, w.D, w.A], [185, 135]); return P.ok && inside(meet(P.pts[0], at(P.pts[0], 10, w.ob), P.pts[1], at(P.pts[1], 10, 180 - w.oc)), P.pts); })() && !quadFig(w).clash());
      const b = quadFig(v), x = 180 - v.ob - v.oc;
      return degQ(`사각형 ABCD의 내부에 점 O가 있다. ∠A = ${v.A}°, ∠D = ${v.D}°, ∠ABO = ${v.p}°, ∠DCO = ${v.q}°일 때, ∠BOC의 크기는?`, x, {
        figure: b.svg(`사각형 ABCD와 그 내부의 점 O. 선분 OB와 선분 OC가 그어져 있다. ∠A = ${v.A}°, ∠D = ${v.D}°, ∠ABO = ${v.p}°, ∠DCO = ${v.q}°, ∠BOC = x`),
        explain: `사각형의 내각의 크기의 합은 360°이므로 ∠OBC + ∠OCB = 360° − (${v.A}° + ${v.D}° + ${v.p}° + ${v.q}°) = ${v.ob + v.oc}°이다. △OBC에서 ∠BOC = 180° − ${v.ob + v.oc}° = ${x}°이다.`,
        facts: { calc: [[`180-(360-${v.A}-${v.D}-${v.p}-${v.q})`, 0]], unseen: [180, 360] }
      });
    })
  ]);

  // ── 정다각형의 한 내각과 한 외각 ──
  const inOf = (n) => 180 * (n - 2) / n, exOf = (n) => 360 / n;
  // 한 변을 맞댄 두 정다각형(왼쪽 정n각형, 오른쪽 정m각형). 맞댄 변은 세로로 놓인다. 돌려주는 것: 판, 맞댄 변의 두 끝(아래, 위), 두 도형의 꼭짓점
  function joined(n, m, s) {
    const b = Board(), S0 = [0, 0], S1 = [0, -s], L = regOn(S0, S1, n), R = regOn(S1, S0, m);
    b.poly(L).poly(R);
    return { b, S0, S1, L, R };
  }
  // 두 정다각형을 맞댄 그림이 카드 너비에 들어가도록 한 변의 길이를 정한다. reach: 세로로 놓인 한 변에서 맞은편 끝까지의 너비(한 변이 1일 때)
  const reach = (n) => (n % 2 ? 1 / (2 * Math.tan(Math.PI / n)) + 1 / (2 * Math.sin(Math.PI / n)) : 1 / Math.tan(Math.PI / n));
  const sideFor = (n, m) => Math.min(60, 250 / (reach(n) + reach(m)));

  B.addTypes(UNIT, 'regular', [
    T('reg-in', '정다각형의 한 내각의 크기', '①44', (d) => {
      const n = d.pick(REG);
      return degQ(`${rgon(n)}의 한 내각의 크기는?`, inOf(n), {
        explain: `${rgon(n)}의 내각의 크기의 합은 180° × (${n} − 2) = ${inSum(n)}°이고 내각의 크기는 모두 같다. 한 내각의 크기는 ${inSum(n)}° ÷ ${n} = ${inOf(n)}°이다.`,
        facts: { calc: [[`180*(${n}-2)/${n}`, 0]], unseen: [180, n, 2] }
      });
    }),
    T('reg-ext', '정다각형의 한 외각의 크기', '①44', (d) => {
      const n = d.pick(REG);
      return degQ(`${rgon(n)}의 한 외각의 크기는?`, exOf(n), {
        explain: `다각형의 외각의 크기의 합은 360°이고 ${rgon(n)}의 외각의 크기는 모두 같다. 한 외각의 크기는 360° ÷ ${n} = ${exOf(n)}°이다.`, facts: { calc: [[`360/${n}`, 0]], unseen: [360, n] }
      });
    }),
    T('reg-in-back', '한 내각의 크기로 정다각형 찾기', '①45', (d) => {
      const n = d.pick(REG);
      return rgonQ(`한 내각의 크기가 ${inOf(n)}°인 정다각형은 정몇각형인가?`, n, {
        explain: `한 외각의 크기는 180° − ${inOf(n)}° = ${exOf(n)}°이다. 외각의 크기의 합은 360°이므로 360° ÷ ${exOf(n)}° = ${n}에서 ${rgon(n)}이다.`, facts: { calc: [[`360/(180-${inOf(n)})`, 0]], unseen: [360, 180] }
      });
    }),
    T('reg-ext-back', '한 외각의 크기로 정다각형 찾기', '①46', (d) => {
      const n = d.pick(REG);
      return rgonQ(`한 외각의 크기가 ${exOf(n)}°인 정다각형은 정몇각형인가?`, n, {
        explain: `정다각형의 외각의 크기는 모두 같고 그 합은 360°이다. 360° ÷ ${exOf(n)}° = ${n}이므로 ${rgon(n)}이다.`, facts: { calc: [[`360/${exOf(n)}`, 0]], unseen: [360] }
      });
    }),
    T('reg-extend', '정다각형의 두 변을 늘여 만나는 각', '①51', (d) => {
      const n = d.pick([5, 6]), P = regPts(n, 62), names = vnames(P), b = Board(), at0 = names.indexOf('A'), idx = (k) => (at0 + k) % n;
      const pA = P[idx(0)], pB = P[idx(1)], pC = P[idx(2)], pD = P[idx(3)], Q = meet(pA, pB, pD, pC), e = exOf(n), x = 180 - 2 * e;
      b.poly(P).seg(pB, Q).seg(pC, Q).corner(Q, pB, pC, sv('x'), { square: false });
      // 늘인 선 위의 꼭짓점 B, C 의 이름은 그 선에 수직인 쪽(도형과 삼각형 PBC 의 바깥)에 적는다.
      const off = (p, q, other) => { const a = dirOf(p, q) + 90, t = at(p, 10, a); return dist(t, other) > dist(p, other) ? a : a + 180; };
      P.forEach((p, i) => b.name(p, names[i], i === idx(1) ? off(pB, pA, pC) : i === idx(2) ? off(pC, pD, pB) : awayFrom(p, [P[(i + n - 1) % n], P[(i + 1) % n]])));
      b.name(Q, 'P', awayFrom(Q, [pB, pC]));
      return degQ(`${rgon(n)} ${ALPHA.slice(0, n)}에서 두 변 AB, DC의 연장선이 만나는 점을 P라 할 때, ∠BPC의 크기는?`, x, {
        figure: b.svg(`${rgon(n)} ${ALPHA.slice(0, n)}. 변 AB를 점 B 너머로, 변 DC를 점 C 너머로 늘인 두 선이 점 P에서 만난다. ∠BPC = x`),
        explain: `∠PBC와 ∠PCB는 ${rgon(n)}의 외각이므로 크기가 각각 360° ÷ ${n} = ${e}°이다. △PBC에서 ∠BPC = 180° − (${e}° + ${e}°) = ${x}°이다.`,
        facts: { calc: [[`180-2*(360/${n})`, 0]], unseen: [180, 360, 2, n] }
      });
    }),
    T('reg-joined', '한 변을 맞댄 두 정다각형 사이의 각', '①52 심28', (d) => {
      const [n, m] = d.pick([[8, 6], [5, 4], [6, 5], [8, 5], [6, 4], [8, 4], [10, 5], [10, 6], [5, 6], [4, 5], [6, 8], [5, 8]]), s = sideFor(n, m), J = joined(n, m, s), x = 360 - inOf(n) - inOf(m);
      J.b.angle(J.S1, 90 - 360 / m, 90 + 360 / n, sv('x'));
      return degQ(`한 변의 길이가 같은 ${rgon(n)}과 ${rgon(m)}을 한 변이 꼭 맞게 붙였다. 두 도형이 붙은 변의 한 끝 점에서 두 도형 사이에 벌어진 각 ∠${X}의 크기는?`, x, {
        figure: J.b.svg(`왼쪽의 ${rgon(n)}과 오른쪽의 ${rgon(m)}이 세로로 놓인 한 변을 함께 쓴다. 그 변의 위 끝 점에서 두 도형의 바깥쪽으로 벌어진 각이 x`),
        explain: `${rgon(n)}의 한 내각의 크기는 ${inOf(n)}°, ${rgon(m)}의 한 내각의 크기는 ${inOf(m)}°이다. 한 점에 모인 각의 크기의 합은 360°이므로 ∠${X} = 360° − (${inOf(n)}° + ${inOf(m)}°) = ${x}°이다.`,
        facts: { calc: [[`360-180*(${n}-2)/${n}-180*(${m}-2)/${m}`, 0]], unseen: [360, 180, 2, n, m] }
      });
    })
  ]);

  // 같은 단원의 다른 파일(7-2-3b.js, 7-2-3c.js)이 함께 쓰는 도구
  B.kit.m723 = {
    UNIT, POLY, FAN, T, X, N_, han, gon, rgon, inSum, diagAll, inOf, exOf, REG, sg, degQ, cntQ, gonQ, rgonQ, CM, CM2, piN, piF, piPlus, piTwo, gcd, sayQ,
    RAD, r1, FS, at, dirOf, dist, mid, XY, meet, awayFrom, textW, arcTo, sv, TINT, WHITE, CLEAR, Board, polyOf, anglesOf, ALPHA, vnames, triOf, regOn, regPts, dg, dgSay, kx, exSvg, exSay, exHtml, polyFig, sayAngles, joined, sideFor
  };
})(typeof window !== 'undefined' ? window : globalThis);
