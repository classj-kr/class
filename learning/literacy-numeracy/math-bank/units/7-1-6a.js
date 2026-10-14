// 중학교 1학년 1학기 6단원 정비례와 반비례 — 단원 틀·도구와 앞쪽 묶음(정비례 관계, 정비례 관계의 그래프).
// 수집해 둔 교과서 3종(미래엔 황선욱 2015·2022, 천재 김동재·김화경)의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1: 80꼴, 심화꼴: 59꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/7-1-6/싣기_대조표.md 에 있다.
// (반비례 관계와 그 그래프, 두 그래프를 함께 보는 문항, 넓이, 활용은 7-1-6b.js 에, 실력 문항은 7-1-6c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
// 영역은 변화와 관계. 성취기준은 9수02-07(정비례, 반비례 관계를 이해하고, 그 관계를 표, 식, 그래프로 나타낼 수 있다) 하나이다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(식·표·문장·그래프·점의 좌표), 묻는 것(관계식의 수·값·좌표·고르기·개수)이 다르면 따로 싣는다.
//    같은 일을 정비례와 반비례에서 한 번씩 묻는 것은 따로 싣는다(관계가 다르면 하는 일이 다르다). 수만 다른 것은 한 번만 싣는다.
//  - 답: 관계식은 「y = □x」「y = □/x」의 □를 적거나 식 넷 가운데 고른다. 고르는 문항의 틀린 식은 저마다 잘못 하나로 만든다
//    (정비례와 반비례를 바꿈, 부호를 놓침, a와 1/a를 바꿈, 곱을 합으로 봄). 좌표와 관계식의 수는 부호 단추가 붙은 칸으로 받고,
//    넓이·시간·개수처럼 음수일 수 없는 값은 부호 단추 없이 받는다. 한 유형(차례)의 답은 늘 같은 꼴(정수 / 분수)이다.
//    「a + b의 값」처럼 따로 구한 값을 다시 더하는 꼴은 값을 하나하나 답하게 바꾸었다.
//  - 용어는 교과서의 것만 쓴다: 정비례, 반비례, 관계식, 그래프, 좌표, 원점, 제1사분면~제4사분면. 「함수」「기울기」「절편」은 쓰지 않는다.
//    관계식에 든 정해진 수는 교과서대로 「수 a」라고 적는다.
//  - 그림: 좌표평면은 공용 도구 plane 으로 그린다(이 파일의 planeT 가 원점의 이름 자리와 점의 이름 자리만 덧댄다). 그래프 넷을 보기로 늘어놓는 문항은 이 파일의 작은 좌표평면 mini 로 그린다.
//    그래프에서 점을 읽어야 하는 문항은 그 점이 모눈 점 위에 있다. 뜻으로 풀어야 하는 문항(넓이, 축에 가까운 정도, 만나는 점)은 모눈과 눈금 없이 그린다.
//  - 넷 가운데 하나만 부호가 다른 보기는 쓰지 않는다(다른 하나가 곧 답이 된다). 사분면으로 가리는 문항은 둘씩 섞어 「모두 고른 것」을 묻는다(pairPick).
//  - 기본과 실력: 수집본 기본 문서에 여러 번 나오고 대입을 한두 번 하는 꼴(글로 준 한 쌍의 값에서 다른 값 구하기 ①9·24·37·52, 한 쌍의 값으로 관계식을 구해 쓰는 활용 ①71)은 기본에 두었다.
//    같은 얼개에 한 겹이 더 있는 것(그림에서 점을 읽어 그림 밖의 점을 구함 ①25·53, 두 그래프를 이음 ①59·60, 그래프 밖의 시각 ①76)과 뜻을 정확히 대야 하는 것만 실력(7-1-6c.js)에 두었다.
//  - 꼴 목록에 적힌 원문 답의 잘못은 따르지 않는다. 답은 모두 코드가 셈한다.
//
// 뺀 것과 까닭(7-1-6b.js, 7-1-6c.js 의 것까지 여기에 모아 적는다)
//  - 앞 단원(좌표평면과 그래프)의 일이 덧붙은 것: 대칭인 점을 먼저 구하기(심17), 직사각형의 넷째 꼭짓점을 먼저 찾기(심21), 그래프에서 값을 그대로 읽기만 하는 거리의 차(①76의 한 꼴).
//  - 약수를 세는 일이 전부인 것(소인수분해 단원): 좌표가 모두 정수(자연수)인 점의 개수(①55 심29·30).
//  - 조건을 풀거나 경우를 따지는 데서 어려움이 오는 것: 선분과 만나는 직선의 자연수 a의 개수(심35), 넓이에서 거꾸로 가며 위치를 그림으로만 정하는 것(심41),
//    정사각형·직사각형의 꼭짓점을 따라가 수 둘을 찾는 것(심42·43·44·45), 넓이를 이등분하는 직선(심46), 넓이와 만나는 점으로 수 둘 찾기(①68), 선분 길이의 비(①69),
//    좌표를 문자로 놓고 제곱이 9인 수를 찾기(①65 — 중3), 가로선이 두 그래프와 만나는 점을 거꾸로 구해 넓이까지(①67 심39 — 세로선으로 좌표가 바로 나오는 꼴만 실력에 실었다).
//  - 지나치게 복잡한 활용(교육과정의 금): 움직이는 점을 식으로 옮기고 범위를 따지는 것(①74 심52), 그래프 읽기부터 다섯 겹인 도착 시각의 차(심54), 소금물의 농도(심3의 보기 하나).
//  - 원점 대칭으로만 풀리는 것(심34), 그래프끼리의 대칭(심10의 보기 하나).
//  - 뜻 없는 셈·요령: 따로 구한 수의 합·곱(①7·21·24·34·52 심5·6·15·20·25의 a + b, ab — 하나하나 구하는 일은 실었다), 문자 둘이 정해지지 않는 식의 값(심19).
//  - 작도·서술형: 그래프 그리기(①11·40 — 그래프 고르기로 바꿈), 뜻 쓰기(①1·28 — 배수를 묻는 문항으로 바꿈), 넓이 조건으로 정한 그래프 그리기(①66 — a의 값을 묻게 바꿈), 변화를 글로 쓰기(①75의 둘째 물음).
//  - 같은 일이어서 한 번만 실은 것: 직선·곡선의 모눈 점을 읽어 식 넷을 구하기(①57의 한 꼴 — ①27·54와 같다. 모눈 없이 모양과 사분면으로 고르는 꼴을 실었다), 직사각형 둘의 넓이의 합(심36의 변형 — ①61을 두 번),
//    y축에 내린 수선으로 만든 삼각형의 넓이에서 a 구하기(심40 — ①66을 바꾼 유형과 같다), 직선 둘을 읽어 두 수의 곱(심20 — ①27을 두 번), 움직이는 점이라는 말만 붙은 삼각형의 넓이(심50 — ①73과 같다).
//  - 그림을 끝내 알 수 없어 뺀 것: ①68·69(그림과 답이 모두 없다), 심45(꼭짓점 둘의 자리), 심54(눈금). 모두 위의 다른 까닭으로도 빠진다.
//    ①63은 원문 그림(곡선이 어느 사분면에 있는가)을 알 수 없어 그대로 옮기지 않고, 같은 얼개인 심37에 ①63의 물음을 붙여 사분면을 그림에서 읽게 지었다(실력).
//  - (다시 봄) 위에서 꼬임·경우 따지기·여러 단계·복잡한 활용·한 번만 싣기라는 까닭으로 뺀 것 가운데 ①55·65·67·68·69, 심17·19·21·29·30·35·39·41·42·43·44·45·46·52·54와 심36의 변형은
//    수집 원본의 그림을 확인하고 다시 실었다(7-1-6c.js 끝의 「다시 실은 꼴」). 그대로 뺀 것은 심34, 심10의 보기 하나, 심20, ①74, ①57·76의 한 꼴, 심40, 소금물의 농도 보기, 합·곱을 묻는 물음이다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { box, frac, lines, numbers, NAMES, name, N, M, C, F } = B.kit;
  const { LAB, MINUS, GT, LT, range, gcd, lcm, Q, qadd, qsub, qmul, qdiv, qneg, qabs, qcmp, isInt, fl, mag, tx, nb, tail, lastOf, tj, js, V, sup, tag, f1, nz, pm, co, fr, distinct, ansV, claimQ, asQ, mono, poly, pointAns, plane, graph } = B.kit.mid;
  const STD = '9수02-07';
  // 「x = 3」「a < 0」「10 = 5a」처럼 문자와 수를 이은 짧은 식이 줄 끝에서 갈라지지 않게 한 덩이로 묶는다(문항의 글·풀이·보기에 한꺼번에 입힌다).
  const FRACT = '<span class="mb-frac"><span>[^<]*</span><span class="mb-frac-bar">/</span><span>[^<]*</span></span>', NUMB = `${MINUS}?(?:${FRACT}|[0-9]+(?:[.][0-9]+)?)`, VARS = '(?:<i class="mb-var">[A-Za-z]</i>){1,2}';
  const SHORT = new RegExp(`${VARS} (?:=|&gt;|&lt;|≠) ${NUMB}(?![0-9<(])|${NUMB} = ${MINUS}?[0-9]*${VARS}(?![<A-Za-z0-9])`, 'g');
  const tight = (h) => (typeof h === 'string' ? h.replace(SHORT, (m) => nb(m)) : h);
  const keep = (item) => { item.text = tight(item.text); item.explain = tight(item.explain); if (item.choice) item.choice.options = item.choice.options.map(tight); return item; };
  // 기본 문항. 심화 문서에만 나오지만 기본에서 하는 일을 묻는 꼴(ref 가 심n 뿐인 것)은 출처를 심화 자료로 적는다.
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: (ref.includes('①') ? '수집본 기본 자료(' : '수집본 심화 자료(') + ref + ')', make: (d, n) => keep(make(d, n)) }, more || {});

  // ── 글 ──
  const X = V('x'), Y = V('y'), A = V('a'), XY = X + Y;
  const TAG6 = ['㉠', '㉡', '㉢', '㉣', '㉤', '㉥'];
  const num = (v) => (typeof v === 'number' ? v : fl(v));
  const jn = (n) => (n < 0 ? '(-' + -n + ')' : String(n));   // 검사 식에 적는 정수
  const iq = (n) => tx(Q(n));                                 // 화면에 적는 정수(음수는 −)
  const sg = (q) => (q.p < 0 ? MINUS : '');
  const signed = (s, x) => (s < 0 ? qneg(x) : x);
  // 정비례 관계식 y = ax, 반비례 관계식 y = a/x (a 는 수나 유리수. 반비례에서 a 가 분수 p/q 이면 y = p/(qx) 로 적는다)
  const eqD = (a) => { const q = asQ(a); return nb(`${Y} = ${sg(q)}${mono(q, X)}`); };
  const eqI = (a) => { const q = asQ(a); return nb(`${Y} = ${sg(q)}${frac(Math.abs(q.p), (q.q === 1 ? '' : q.q) + X)}`); };
  const eqDa = nb(`${Y} = ${A}${X}`), eqIa = nb(`${Y} = ${frac(A, X)}`);
  // 답할 수를 빈칸으로 둔 관계식
  const boxD = (label) => nb(`${Y} = ${box(label)}${X}`), boxI = (label) => nb(`${Y} = ${frac(box(label), X)}`);
  const yPlus = (b) => nb(`${Y} = ${poly([[1, X], [b, '']])}`);     // y = x + b
  const yLin = (a, b) => nb(`${Y} = ${poly([[a, X], [b, '']])}`);   // y = ax + b
  const yMinus = (c) => nb(`${Y} = ${poly([[c, ''], [-1, X]])}`);   // y = c − x
  // 점의 좌표. 좌표는 수·유리수이거나 이미 그린 글(문자, 빈칸의 이름)이다.
  const cx = (v) => (typeof v === 'string' ? v : tx(asQ(v)));
  const pt = (x, y) => nb(`(${cx(x)}, ${cx(y)})`);
  const ptj = (x, y, pair) => nb(`(${cx(x)}, ${cx(y)})${tail(lastOf(asQ(y)), pair)}`);
  const quads = (pos) => (pos ? '제1사분면과 제3사분면' : '제2사분면과 제4사분면');
  // 이름표를 붙인 식을 두 줄로 늘어놓는다(여섯 개까지).
  const grid2 = (list, tags) => '<div class="mb-lines" style="grid-template-columns:repeat(2,minmax(0,1fr));gap:12px 10px">' + list.map((h, i) => '<div>' + tag((tags || TAG6)[i]) + h + '</div>').join('') + '</div>';
  // 가로로 놓은 표: 첫 칸은 x, y, 나머지 칸은 값(글).
  const cell = (v) => (typeof v === 'number' ? iq(v) : v);
  const xyTable = (xs, ys) => '<div class="mb-table-wrap"><table class="mb-table"><tbody>' + [[X].concat(xs.map(cell)), [Y].concat(ys.map(cell))].map((row) => '<tr>' + row.map((c) => '<td style="padding:5px 9px">' + c + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>';

  // ── 관계식의 갈래 ──
  // kind: 'D' 정비례, 'I' 반비례, 'N' 어느 것도 아님. as: 고쳐 쓴 꼴, end: 고쳐 쓴 꼴을 읽을 때 끝에 오는 수(토씨를 맞춘다. 없으면 x로 끝난다).
  const REL = {
    d: (a) => ({ h: eqD(a), kind: 'D' }),
    dOver: (k, s) => ({ h: nb(`${Y} = ${s < 0 ? MINUS : ''}${frac(X, k)}`), kind: 'D', as: eqD(Q(s, k)) }),
    dRatio: (k) => ({ h: nb(`${frac(Y, X)} = ${iq(k)}`), kind: 'D', as: eqD(k) }),
    dXY: (k) => ({ h: nb(`${frac(X, Y)} = ${iq(k)}`), kind: 'D', as: eqD(Q(1, k)) }),
    i: (a) => ({ h: eqI(a), kind: 'I' }),
    iProd: (a) => ({ h: nb(`${XY} = ${iq(a)}`), kind: 'I', as: eqI(a), end: Math.abs(a) }),
    iX: (a) => ({ h: nb(`${X} = ${a < 0 ? MINUS : ''}${frac(Math.abs(a), Y)}`), kind: 'I', as: eqI(a), end: Math.abs(a) }),
    iKx: (p, q) => ({ h: eqI(Q(p, q)), kind: 'I' }),
    plus: (b) => ({ h: yPlus(b), kind: 'N' }),
    lin: (a, b) => ({ h: yLin(a, b), kind: 'N' }),
    minus: (c) => ({ h: yMinus(c), kind: 'N' }),
    sum: (c) => ({ h: nb(`${X} + ${Y} = ${c}`), kind: 'N', as: yMinus(c) }),
    iPlus: (a, b) => ({ h: nb(`${Y} = ${frac(a, X)} ${b < 0 ? MINUS : '+'} ${Math.abs(b)}`), kind: 'N' })
  };
  const KIND = { D: '정비례한다', I: '반비례한다' };
  const why = (r) => (r.kind === 'N' ? `${r.h}에서 ${Y}는 ${X}에 정비례하지도 반비례하지도 않는다.` : r.as ? `${r.h}에서 ${r.as}이므로 ${Y}는 ${X}에 ${KIND[r.kind]}.` : `${r.h}에서 ${Y}는 ${X}에 ${KIND[r.kind]}.`);

  // ── 두 양 사이의 관계가 드러난 상황 ──
  // say: 보기로 쓰는 말, full: 문장, eq: 관계식, miss: 흔히 잘못 세우는 식, kind: 관계의 갈래
  const POLYGON = { 3: '정삼각형', 4: '정사각형', 5: '정오각형', 6: '정육각형' };
  const CM2 = 'cm<sup>2</sup>';
  const SIT = {
    // 정비례
    price: (d) => { const p = d.int(3, 9) * 100; return { say: `한 개에 ${p}원인 지우개 ${X}개의 값 ${Y}원`, full: `한 개에 ${p}원인 지우개 ${X}개의 값은 ${Y}원이다.`, eq: eqD(p), miss: yPlus(p), kind: 'D' }; },
    drive: (d) => { const v = d.int(4, 9) * 10; return { say: `시속 ${v} km로 달리는 자동차가 ${X}시간 동안 달린 거리 ${Y} km`, full: `시속 ${v} km로 달리는 자동차가 ${X}시간 동안 달린 거리는 ${Y} km이다.`, eq: eqD(v), miss: eqI(v), kind: 'D' }; },
    polygon: (d) => { const n = d.pick([3, 4, 5, 6]); return { say: `한 변의 길이가 ${X} cm인 ${POLYGON[n]}의 둘레의 길이 ${Y} cm`, full: `한 변의 길이가 ${X} cm인 ${POLYGON[n]}의 둘레의 길이는 ${Y} cm이다.`, eq: eqD(n), miss: yPlus(n), kind: 'D' }; },
    rect: (d) => { const k = d.int(3, 9); return { say: `가로의 길이가 ${k} cm, 세로의 길이가 ${X} cm인 직사각형의 넓이 ${Y} ${CM2}`, full: `가로의 길이가 ${k} cm, 세로의 길이가 ${X} cm인 직사각형의 넓이는 ${Y} ${CM2}이다.`, eq: eqD(k), miss: eqI(k), kind: 'D' }; },
    wire: (d) => { const k = d.int(3, 9); return { say: `1 m의 무게가 ${k} g인 철사 ${X} m의 무게 ${Y} g`, full: `1 m의 무게가 ${k} g인 철사 ${X} m의 무게는 ${Y} g이다.`, eq: eqD(k), miss: eqI(k), kind: 'D' }; },
    half: (d) => { const k = 2 * d.int(3, 8); return { say: `밑변의 길이가 ${k} cm, 높이가 ${X} cm인 삼각형의 넓이 ${Y} ${CM2}`, full: `밑변의 길이가 ${k} cm, 높이가 ${X} cm인 삼각형의 넓이는 ${Y} ${CM2}이다.`, eq: eqD(k / 2), miss: eqI(k), kind: 'D' }; },
    daily: (d) => { const k = d.int(2, 5); return { say: `하루에 ${k}시간씩 ${X}일 동안 운동한 시간 ${Y}시간`, full: `하루에 ${k}시간씩 ${X}일 동안 운동한 시간은 ${Y}시간이다.`, eq: eqD(k), miss: eqI(k), kind: 'D' }; },
    // 정비례도 반비례도 아닌 것
    left: (d) => { const n = d.pick([100, 120, 150, 200]); return { say: `전체 ${n}쪽인 책을 ${X}쪽 읽었을 때 남은 쪽수 ${Y}쪽`, full: `전체 ${n}쪽인 책을 ${X}쪽 읽었을 때 남은 쪽수는 ${Y}쪽이다.`, eq: yMinus(n), miss: eqD(n), missI: eqI(n), kind: 'N' }; },
    change: (d) => { const m = d.pick([1000, 2000, 5000]); return { say: `${m}원을 내고 ${X}원짜리 물건을 살 때 받는 거스름돈 ${Y}원`, full: `${m}원을 내고 ${X}원짜리 물건을 살 때 받는 거스름돈은 ${Y}원이다.`, eq: yMinus(m), miss: eqD(m), missI: eqI(m), kind: 'N' }; },
    bigger: (d) => { const k = d.int(2, 9); return { say: `${X}보다 ${k}만큼 큰 수 ${Y}`, full: `${Y}는 ${X}보다 ${k}만큼 큰 수이다.`, eq: yPlus(k), miss: eqD(k), kind: 'N' }; },
    age: (d) => { const k = d.int(2, 6); return { say: `${X}살인 동생보다 ${k}살 많은 형의 나이 ${Y}살`, full: `${X}살인 동생보다 ${k}살 많은 형의 나이는 ${Y}살이다.`, eq: yPlus(k), miss: eqD(k), kind: 'N' }; },
    tank: (d) => { const L = d.pick([20, 30, 50]), k = d.int(2, 5); return { say: `물이 ${L} L 들어 있는 물통에 1분에 ${k} L씩 물을 더 넣을 때, ${X}분 후 물통에 들어 있는 물의 양 ${Y} L`, full: `물이 ${L} L 들어 있는 물통에 1분에 ${k} L씩 물을 더 넣으면 ${X}분 후 물통에 들어 있는 물의 양은 ${Y} L이다.`, eq: yLin(k, L), miss: eqD(k), kind: 'N' }; },
    klass: (d) => { const n = d.pick([26, 28, 30, 32]); return { say: `전체 ${n}명인 반의 여학생 ${X}명과 남학생 ${Y}명`, full: `전체 ${n}명인 반의 여학생은 ${X}명, 남학생은 ${Y}명이다.`, eq: yMinus(n), miss: eqD(n), missI: eqI(n), kind: 'N' }; },
    peri: (d) => { const p = d.pick([20, 30, 40]); return { say: `둘레의 길이가 ${p} cm인 직사각형의 가로의 길이 ${X} cm와 세로의 길이 ${Y} cm`, full: `둘레의 길이가 ${p} cm인 직사각형의 가로의 길이는 ${X} cm, 세로의 길이는 ${Y} cm이다.`, eq: yMinus(p / 2), miss: eqD(p), missI: eqI(p), kind: 'N' }; },
    // 반비례
    area: (d) => { const s = d.pick([12, 18, 20, 24, 30, 36, 40]); return { say: `넓이가 ${s} ${CM2}인 직사각형의 가로의 길이 ${X} cm와 세로의 길이 ${Y} cm`, full: `넓이가 ${s} ${CM2}인 직사각형의 가로의 길이는 ${X} cm, 세로의 길이는 ${Y} cm이다.`, eq: eqI(s), miss: yMinus(s), kind: 'I' }; },
    trip: (d) => { const D = d.pick([60, 90, 120, 180, 240]); return { say: `${D} km 떨어진 곳까지 시속 ${X} km로 갈 때 걸리는 시간 ${Y}시간`, full: `${D} km 떨어진 곳까지 시속 ${X} km로 갈 때 걸리는 시간은 ${Y}시간이다.`, eq: eqI(D), miss: eqD(D), kind: 'I' }; },
    rope: (d) => { const L = d.pick([120, 180, 240, 300]); return { say: `길이가 ${L} cm인 끈을 ${X}도막으로 똑같이 나눌 때 한 도막의 길이 ${Y} cm`, full: `길이가 ${L} cm인 끈을 ${X}도막으로 똑같이 나누면 한 도막의 길이는 ${Y} cm이다.`, eq: eqI(L), miss: eqD(L), kind: 'I' }; },
    chairs: (d) => { const n = d.pick([120, 240, 360]); return { say: `의자 ${n}개를 한 줄에 ${X}개씩 놓을 때 줄의 수 ${Y}줄`, full: `의자 ${n}개를 한 줄에 ${X}개씩 놓으면 모두 ${Y}줄이 된다.`, eq: eqI(n), miss: yMinus(n), kind: 'I' }; },
    juice: (d) => { const w = d.pick([12, 18, 24]); return { say: `주스 ${w} L를 ${X}명이 똑같이 나누어 마실 때 한 명이 마시는 양 ${Y} L`, full: `주스 ${w} L를 ${X}명이 똑같이 나누어 마시면 한 명이 마시는 양은 ${Y} L이다.`, eq: eqI(w), miss: eqD(w), kind: 'I' }; }
  };
  // 보기 넷: 찾는 갈래의 상황 하나와, 갈래가 다른 상황 셋(같은 얼개가 겹치지 않게 묶음마다 하나씩 고른다).
  function storyRows(d, good, packs) {
    const others = d.shuffle(packs).slice(0, 3).map((pack) => d.pick(pack)(d));
    return d.shuffle([d.pick(good)(d)].concat(others));
  }

  // ── 작은 좌표평면(보기 그림) ──
  // 한 칸은 1, 범위는 −R~R(o.R, 기본 4 — 그림의 크기는 같고 칸이 작아진다). o.line: 정비례 관계 y = ax 의 a, o.curve: 반비례 관계 y = a/x 의 a(수나 유리수).
  // o.half: true 이면 x > 0 인 쪽만 그린다(양수만 되는 두 양 사이의 관계). o.point: [x, y] 그래프 위의 한 점 — 두 축에 점선을 내리고 닿는 자리에 수를 적는다.
  // o.grid: false 이면 모눈 없이 모양만 그린다. o.name: 그림 설명 앞에 붙는 이름(㉠ …).
  // 그림 설명에는 그래프의 모양과 지나는 사분면, 점선이 닿는 눈금을 적는다(검사와 화면 읽기가 이 글로 그림을 읽는다).
  const ITALIC = "font-style:italic;font-family:'MB Math','Times New Roman',serif";
  function mini(o) {
    const R = o.R || 4, u = 50 / R, padL = 8, padR = 15, padT = 15, padB = 8, W = padL + padR + 2 * R * u, H = padT + padB + 2 * R * u;
    const PX = (v) => f1(padL + (v + R) * u), PY = (v) => f1(padT + (R - v) * u), isLine = o.line != null, a = num(isLine ? o.line : o.curve), INK = '#1d4ed8';
    // y축의 이름은 점선이 닿는 자리의 수(점의 반대쪽에 적는다)와 그래프의 위쪽 끝을 피해 적는다.
    const ySide = o.point ? (num(o.point[0]) > 0 ? 1 : -1) : a > 0 ? -1 : 1;
    let out = '';
    if (o.grid !== false) for (let v = -R; v <= R; v += 1) out += `<line class="mb-gridline" x1="${PX(v)}" y1="${PY(-R)}" x2="${PX(v)}" y2="${PY(R)}"/><line class="mb-gridline" x1="${PX(-R)}" y1="${PY(v)}" x2="${PX(R)}" y2="${PY(v)}"/>`;
    out += `<line class="mb-axis" x1="${PX(-R) - 4}" y1="${PY(0)}" x2="${PX(R) + 5}" y2="${PY(0)}"/><path d="M${PX(R) + 10} ${PY(0)}l-6 -3v6z" style="fill:#1f2933"/>`
      + `<line class="mb-axis" x1="${PX(0)}" y1="${PY(-R) + 4}" x2="${PX(0)}" y2="${PY(R) - 5}"/><path d="M${PX(0)} ${PY(R) - 10}l-3 6h6z" style="fill:#1f2933"/>`
      + `<text x="${PX(R) + 11}" y="${PY(0) + 12}" text-anchor="middle" style="font-size:11.5px;fill:#1f2933;${ITALIC}">x</text><text x="${PX(0) + ySide * 8}" y="${PY(R) - 4}" text-anchor="middle" style="font-size:11.5px;fill:#1f2933;${ITALIC}">y</text>`;
    // 원점의 이름은 그래프가 지나지 않는 쪽 아래에 적는다.
    const oSide = isLine && a > 0 ? 1 : -1;
    out += `<text x="${PX(0) + oSide * 6}" y="${PY(0) + 10}" text-anchor="middle" style="font-size:9.5px;fill:#1f2933;font-weight:600">O</text>`;
    const said = [];
    if (isLine) {
      const far = Math.min(R, R / Math.abs(a)), from = o.half ? 0 : -far;
      out += `<line x1="${PX(from)}" y1="${PY(a * from)}" x2="${PX(far)}" y2="${PY(a * far)}" style="stroke:${INK};stroke-width:1.8"/>`;
      said.push(o.half ? `원점에서 시작하여 ${a > 0 ? '제1사분면' : '제4사분면'}으로 곧게 뻗은 선` : `원점을 지나는 직선이 ${quads(a > 0)}을 지난다`);
    } else {
      for (const side of o.half ? [1] : [1, -1]) {
        const pts = [];
        for (let i = 1; i <= 160; i += 1) { const x = side * i * R / 160, y = a / x; if (Math.abs(y) <= R - 0.15) pts.push(PX(x) + ' ' + PY(y)); }
        out += `<path d="M${pts.join('L')}" style="fill:none;stroke:${INK};stroke-width:1.8"/>`;
      }
      said.push(o.half ? `${a > 0 ? '제1사분면' : '제4사분면'}에만 있는 매끄러운 곡선 한 가닥이고 두 축과 만나지 않는다` : `한 쌍의 매끄러운 곡선이 ${quads(a > 0)}에 있고 두 축과 만나지 않는다`);
    }
    if (o.point) {
      const [x, y] = o.point.map(num), word = (v) => (v < 0 ? MINUS + -v : String(v));
      out += `<line x1="${PX(x)}" y1="${PY(y)}" x2="${PX(x)}" y2="${PY(0)}" style="stroke:#5b6770;stroke-width:0.9;stroke-dasharray:3 2"/><line x1="${PX(x)}" y1="${PY(y)}" x2="${PX(0)}" y2="${PY(y)}" style="stroke:#5b6770;stroke-width:0.9;stroke-dasharray:3 2"/>`
        + `<circle class="mb-dot" cx="${PX(x)}" cy="${PY(y)}" r="2.4"/>`
        + `<text class="mb-axis-label" style="font-size:10px" x="${PX(x)}" y="${PY(0) + (y > 0 ? 10.5 : -3.5)}" text-anchor="middle">${word(x)}</text>`
        + `<text class="mb-axis-label" style="font-size:10px" x="${PX(0) + (x > 0 ? -3 : 3)}" y="${PY(y) + 3.5}" text-anchor="${x > 0 ? 'end' : 'start'}">${word(y)}</text>`;
      said.push(`그래프 위의 한 점에서 내린 점선이 x축의 눈금 ${word(x)}, y축의 눈금 ${word(y)}에 닿는다`);
    }
    return `<svg class="mb-geo" viewBox="0 0 ${f1(W)} ${f1(H)}" width="${Math.round(W)}" role="img" aria-label="좌표평면${o.name ? ' ' + o.name : ''}: ${said.join('. ')}.">${out}</svg>`;
  }
  // ── 좌표평면(공용 도구 plane 에 두 가지를 덧댄 것) ──
  // ① 원점의 이름 O 를 그래프와 겹치지 않는 자리로 옮긴다: 직선·곡선이 원점 둘레를 여러 방향으로 지나면 plane 이 정한 자리(축 아래 왼쪽이나 오른쪽)에 선이 걸린다.
  //    축 아래 왼쪽·오른쪽의 자리들 가운데 그래프에서 가장 먼 곳을 고르고, 흰 테를 둘러 맨 위에 다시 적는다.
  // ② o.tags [{ x, y, text, at: 'e' | 'w' | 'n' | 's' }]: 점의 이름을 동·서·남·북 쪽에 적는다. 직선과 곡선이 만나는 점은 대각선 네 쪽이 모두 선에 걸려서
  //    plane 의 이름 자리(대각선 네 쪽)를 쓸 수 없다. 이름을 이렇게 적은 점은 o.points 에 이름 없이 넣고, 그림 설명에는 o.say 로 밝힌다.
  function planeT(o) {
    const svg = plane(o), [xlo, xhi] = o.x || [-5, 5], yhi = (o.y || [-5, 5])[1], u = Math.min(24, 260 / (xhi - xlo)), ox = 16 - xlo * u, oy = 24 + yhi * u;
    const slopes = (o.lines || []).map((l) => num(l.a)), bends = (o.curves || []).map((c) => num(c.a));
    // 원점에서 (cx, cy)px 떨어진 곳(화면 좌표: 아래쪽이 +)에서 가장 가까운 그래프까지의 거리
    const gap = (cx, cy) => {
      let best = 99;
      for (const a of slopes) best = Math.min(best, Math.abs(a * cx + cy) / Math.sqrt(a * a + 1));
      for (const a of bends) for (let i = 1; i <= 80; i += 1) for (const side of [1, -1]) { const x = side * i * 0.05; best = Math.min(best, Math.hypot(x * u - cx, -a / x * u - cy)); }
      return best;
    };
    let spot = null;
    for (const side of [-1, 1]) for (let cx = 7; cx <= 13; cx += 1) for (let cy = 8; cy <= 13; cy += 1) {
      const score = Math.min(gap(side * cx, cy), 8) - 0.02 * (cx + cy) - (side > 0 ? 0.01 : 0);
      if (!spot || score > spot.score) spot = { score, x: side * cx, y: cy };
    }
    const was = /<text x="[^"]*" y="[^"]*" text-anchor="middle" style="font-size:11px;fill:#1f2933;font-weight:600">O<\/text>/;
    let extra = '';
    for (const t of o.tags || []) {
      const px = ox + num(t.x) * u, py = oy - num(t.y) * u, at = t.at || 'e';
      extra += `<text class="mb-km-label" style="font-size:13px" x="${f1(px + (at === 'e' ? 8 : at === 'w' ? -8 : 0))}" y="${f1(py + (at === 'n' ? -8 : at === 's' ? 17 : 4.5))}" text-anchor="${at === 'e' ? 'start' : at === 'w' ? 'end' : 'middle'}">${t.text}</text>`;
    }
    if (!was.test(svg)) return svg.replace('</svg>', extra + '</svg>');
    return svg.replace(was, '').replace('</svg>', `${extra}<text x="${f1(ox + spot.x)}" y="${f1(oy + spot.y + 4)}" text-anchor="middle" style="font-size:11px;fill:#1f2933;font-weight:600;paint-order:stroke;stroke:#fff;stroke-width:2.5px;stroke-linejoin:round">O</text></svg>`);
  }
  // 눈금 수를 적은 좌표평면에서 점 (x, y)의 점선이 눈금 수를 가로지르지 않는가: 눈금 수는 x축 아래와 y축 왼쪽에 적히므로,
  // 점이 x축 아래에 있으면 세로 점선이 x의 눈금 수를, 점이 y축 왼쪽에 있으면 가로 점선이 y의 눈금 수를 지난다. 그런 점에는 점선을 내리지 않는다(모눈으로 읽는다).
  const TICKS = [-4, -2, 2, 4];
  const clearGuide = (x, y) => !(y < 0 && TICKS.includes(x)) && !(x < 0 && TICKS.includes(y));
  // 넷 가운데 조건에 맞는 둘을 「모두 고른 것」으로 묻는다(하나만 다른 것을 찾는 문항이 되지 않게). flags 는 참이 꼭 둘이어야 한다.
  // 보기: 맞는 둘, 나머지 둘, 맞는 것과 틀린 것을 하나씩 섞은 두 짝.
  function pairPick(d, text, list, flags, explain) {
    const yes = [0, 1, 2, 3].filter((i) => flags[i]), no = [0, 1, 2, 3].filter((i) => !flags[i]), [p, q] = d.shuffle(no);
    const pairs = d.shuffle([yes, no, [yes[0], p], [yes[1], q]].map((pair) => pair.slice().sort((u, v) => u - v))), right = (pair) => pair.every((i) => flags[i]);
    return C(text, pairs.map((pair) => pair.map((i) => LAB[i]).join(', ')), pairs.findIndex(right), { figure: grid2(list, LAB), explain, facts: { truth: pairs.map(right), want: true } });
  }
  // 작은 그림 넷을 두 줄로 놓고 이름(㉠~㉣)을 단다.
  const picks = (figs) => '<div style="display:grid;grid-template-columns:repeat(2,max-content);gap:8px 14px">' + figs.map((h, i) => `<div style="display:grid;gap:1px;justify-items:start"><div style="font-size:0.95rem;font-weight:600">${LAB[i]}</div>${h}</div>`).join('') + '</div>';

  // ── 수 고르기 ──
  // 정비례 관계식에 쓰는 수: 0이 아닌 정수(±2~±6)나 분수
  const slope = (d, kind) => (kind === 'int' ? Q(pm(d) * d.int(2, 6)) : signed(pm(d), d.pick([Q(1, 2), Q(3, 2), Q(5, 2), Q(1, 3), Q(2, 3), Q(4, 3), Q(1, 4), Q(3, 4)])));
  // 식에 숫자가 드러나게 ±1은 쓰지 않는다(y = x, y = −x 에는 검사가 읽을 수가 없다).

  B.addUnit({
    id: '7-1-6', grade: 7, semester: 1, no: 6, title: '정비례와 반비례', version: 2,
    groups: [
      {
        id: 'direct', title: '정비례 관계', standard: STD,
        types: [
          T('direct-meaning', '정비례의 뜻: x의 값이 몇 배가 될 때 y의 값', '①1·2', (d) => {
            const x1 = d.int(2, 6), k = d.int(2, 5), x2 = x1 * k;
            return N(`${Y}가 ${X}에 정비례할 때, ${X}의 값이 ${x1}에서 ${x2}${tail(x2, '으로/로')} 변하면 ${Y}의 값은 몇 배가 되는가?`, k, {
              unit: '배',
              explain: `${Y}가 ${X}에 정비례하면 ${X}의 값이 2배, 3배, 4배, …가 될 때 ${Y}의 값도 2배, 3배, 4배, …가 된다. ${X}의 값이 ${x2} ÷ ${x1} = ${k}(배)가 되었으므로 ${Y}의 값도 ${k}배가 된다.`,
              facts: { value: `${x2}/${x1}` }
            });
          }),
          T('direct-pick-eq', '식을 보고 정비례 관계 찾기', '①2', (d) => {
            const k = () => d.int(2, 9), s = () => pm(d);
            const good = d.pick([REL.d(Q(s() * k())), REL.d(signed(s(), fr(d, [2, 3, 5], 2))), REL.dOver(d.int(2, 7), s())]);
            const bad = d.shuffle([REL.i(s() * k()), REL.iProd(s() * k()), REL.plus(s() * k()), REL.lin(d.int(2, 5), s() * d.int(1, 9)), REL.minus(k())]).slice(0, 3);
            const rows = d.shuffle([good].concat(bad));
            return C(`다음 관계식 중 ${Y}가 ${X}에 정비례하는 것은?`, rows.map((r) => r.h), rows.indexOf(good), {
              explain: `${Y}가 ${X}에 정비례하면 관계식은 ${eqDa}(${A} ≠ 0) 꼴로 나타낼 수 있다. ${why(good)} 나머지는 이 꼴로 나타낼 수 없다.`,
              facts: { truth: rows.map((r) => r.kind === 'D'), want: true }
            });
          }),
          T('direct-count-eq', '여러 꼴의 식에서 정비례 관계의 개수 세기', '①2 심1', (d) => {
            // y/x = 2, y = x/4 처럼 고쳐 써야 y = ax 꼴이 보이는 식과, x가 커질 때 y도 커지지만 정비례가 아닌 식(y = x + 2)을 섞는다.
            const k = () => d.int(2, 9), s = () => pm(d);
            const goods = d.shuffle([REL.d(Q(s() * k())), REL.d(signed(s(), fr(d, [2, 3, 5], 2))), REL.dOver(d.int(2, 7), s()), REL.dRatio(s() * k())]).slice(0, d.int(2, 3));
            const bads = d.shuffle([REL.i(s() * k()), REL.iProd(s() * k()), REL.plus(s() * k()), REL.lin(d.int(2, 5), s() * d.int(1, 9)), REL.minus(k())]).slice(0, 6 - goods.length);
            const rows = d.shuffle(goods.concat(bads)), flags = rows.map((r) => r.kind === 'D');
            const fixed = rows.map((r, i) => (r.kind === 'D' && r.as ? `${TAG6[i]}은 ${r.as}로 고쳐 쓸 수 있다.` : '')).filter(Boolean).join(' ');
            return N(`다음 중 ${Y}가 ${X}에 정비례하는 것은 모두 몇 개인가?`, goods.length, {
              unit: '개', figure: grid2(rows.map((r) => r.h)),
              explain: `${Y}가 ${X}에 정비례하면 관계식은 ${eqDa}(${A} ≠ 0) 꼴로 나타낼 수 있다. ${fixed} 정비례하는 것은 ${rows.map((r, i) => (flags[i] ? TAG6[i] : '')).filter(Boolean).join(', ')}의 ${goods.length}개이다.`,
              facts: { count: flags }
            });
          }),
          T('direct-pick-story', '문장을 보고 정비례 관계 찾기', '①3 심3', (d) => {
            const rows = storyRows(d, [SIT.price, SIT.drive, SIT.polygon, SIT.rect, SIT.wire], [[SIT.left, SIT.change], [SIT.bigger, SIT.age], [SIT.tank], [SIT.area, SIT.trip]]);
            const good = rows.find((r) => r.kind === 'D');
            return C(`다음 중 ${Y}가 ${X}에 정비례하는 것은?`, rows.map((r) => r.say), rows.indexOf(good), {
              explain: `관계식은 차례로 ${rows.map((r) => r.eq).join(', ')}이다. 이 가운데 ${eqDa} 꼴인 것은 ${good.eq}뿐이다. ${X}의 값이 커질 때 ${Y}의 값이 커진다고 모두 정비례하는 것은 아니다.`,
              facts: { truth: rows.map((r) => r.kind === 'D'), want: true }
            });
          }),
          T('direct-story-eq', '상황을 식으로 나타내고 정비례하는지 판단하기', '①4', (d, n) => {
            // 첫째는 정비례하는 상황, 둘째는 정비례하지 않는 상황(남은 양, 얼마만큼 큰 수)이다. 보기는 식 둘과 판단 둘을 짝지은 넷이다.
            const s = n === 0 ? d.pick([SIT.price, SIT.drive, SIT.polygon, SIT.rect, SIT.wire])(d) : d.pick([SIT.left, SIT.change, SIT.bigger, SIT.age])(d);
            const rows = d.shuffle([[s.eq, true], [s.eq, false], [s.miss, true], [s.miss, false]]).map(([eq, says]) => ({ h: `${eq}이고, ${Y}는 ${X}에 ${says ? '정비례한다' : '정비례하지 않는다'}.`, ok: eq === s.eq && says === (s.kind === 'D') }));
            return C(`${s.full} ${X}와 ${Y} 사이의 관계를 바르게 설명한 것은?`, rows.map((r) => r.h), rows.findIndex((r) => r.ok), {
              explain: n === 0 ? `관계식은 ${s.eq}이다. ${eqDa}(${A} ≠ 0) 꼴이므로 ${Y}는 ${X}에 정비례한다.` : `관계식은 ${s.eq}이다. ${X}의 값이 2배가 되어도 ${Y}의 값은 2배가 되지 않으므로 ${Y}는 ${X}에 정비례하지 않는다.`,
              facts: { truth: rows.map((r) => r.ok), want: true, rule: 'direct-story-' + n }
            });
          }, { count: 2 }),
          T('direct-table-story', '상황을 표와 관계식으로 나타내기', '①5', (d) => {
            const s = d.pick([
              () => { const k = d.pick([60, 70, 80, 90]); return { k, full: `맥박이 1분에 ${k}회씩 뛰는 사람의 맥박은 ${X}분 동안 ${Y}회 뛴다.`, told: `1분에 ${k}회씩 뛰므로` }; },
              () => { const k = d.pick([3, 4, 5, 6]); return { k, full: `한 변의 길이가 ${X} cm인 ${POLYGON[k]}의 둘레의 길이는 ${Y} cm이다.`, told: `${POLYGON[k]}의 둘레의 길이는 한 변의 길이의 ${k}배이므로` }; },
              () => { const k = d.int(3, 9); return { k, full: `1분에 ${k} L씩 물이 나오는 수도꼭지에서 ${X}분 동안 나온 물의 양은 ${Y} L이다.`, told: `1분에 ${k} L씩 나오므로` }; }
            ])();
            const k = s.k, xs = [1, 2, 3, 4, 5], [p, q] = d.shuffle([1, 2, 3, 4]).slice(0, 2).sort((u, v) => u - v);
            const ys = xs.map((x, i) => (i === p ? box(LAB[0]) : i === q ? box(LAB[1]) : k * x));
            return M(`${s.full} 다음 표와 관계식 ${boxD(LAB[2])}에서 ㉠, ㉡, ㉢에 알맞은 수를 구하시오.`, [{ label: LAB[0], answer: k * xs[p] }, { label: LAB[1], answer: k * xs[q] }, { label: LAB[2], answer: k }], {
              figure: xyTable(xs, ys),
              explain: `${s.told} ${Y}의 값은 ${X}의 값의 ${k}배이다. ㉠은 ${k} × ${xs[p]} = ${k * xs[p]}, ㉡은 ${k} × ${xs[q]} = ${k * xs[q]}이고, 관계식은 ${eqD(k)}이다.`,
              facts: { calc: [[`${k}*${xs[p]}`, 0], [`${k}*${xs[q]}`, 1], [`${k}`, 2]] }
            });
          }),
          T('direct-table-fill', '정비례한다는 것만으로 표 완성하기', '①6', (d) => {
            const a = pm(d) * d.int(2, 6), xs = d.pick([[1, 2, 3, 4], [-2, -1, 1, 2], [-3, -1, 2, 4], [-4, -2, 1, 3]]), at = d.int(0, 3), ys = xs.map((x) => a * x);
            const blanks = [0, 1, 2, 3].filter((i) => i !== at);
            return M(`${Y}가 ${X}에 정비례할 때, 표의 ㉠, ㉡, ㉢에 알맞은 수는?`, blanks.map((i, j) => ({ label: LAB[j], answer: ys[i], signed: true })), {
              figure: xyTable(xs, ys.map((y, i) => (i === at ? y : box(LAB[blanks.indexOf(i)])))),
              explain: `${X} = ${iq(xs[at])}일 때 ${Y} = ${iq(ys[at])}이므로 ${Y}의 값은 ${X}의 값의 ${iq(a)}배이고, 관계식은 ${eqD(a)}이다. ${blanks.map((i, j) => `${LAB[j]}은 ${iq(ys[i])}`).join(', ')}이다.`,
              facts: { calc: blanks.map((i, j) => [`${jn(ys[at])}/${jn(xs[at])}*${jn(xs[i])}`, j]) }
            });
          }),
          T('direct-table-back', '정비례 관계의 표에서 x의 값과 y의 값 거꾸로 구하기', '①7 심5', (d) => {
            // 관계식의 수가 분수이고, 빈칸 하나는 y의 값에서 x의 값을 거꾸로 구한다.
            const q = d.pick([2, 3]), p = pm(d) * co(d, q, 1, 5), ts = d.until(() => d.shuffle([-3, -2, -1, 1, 2, 3, 4]).slice(0, 3), (list) => list.every((t) => Math.abs(p * t) <= 16));
            const xs = ts.map((t) => q * t), ys = ts.map((t) => p * t), a = Q(p, q);
            return M(`${Y}가 ${X}에 정비례할 때, 표의 ㉠, ㉡에 알맞은 수는?`, [{ label: LAB[0], answer: ys[0], signed: true }, { label: LAB[1], answer: xs[2], signed: true }], {
              figure: xyTable([xs[0], xs[1], box(LAB[1])], [box(LAB[0]), ys[1], ys[2]]),
              explain: `${X} = ${iq(xs[1])}일 때 ${Y} = ${iq(ys[1])}이므로 관계식은 ${eqD(a)}이다. ${X} = ${iq(xs[0])}일 때 ${Y} = ${iq(ys[0])}이므로 ㉠은 ${iq(ys[0])}이고, ${Y} = ${iq(ys[2])}일 때 ${X} = ${iq(xs[2])}이므로 ㉡은 ${iq(xs[2])}이다.`,
              facts: { calc: [[`${jn(ys[1])}*${jn(xs[0])}/${jn(xs[1])}`, 0], [`${jn(ys[2])}*${jn(xs[1])}/${jn(ys[1])}`, 1]] }
            });
          }),
          T('direct-eq-from-pair', '한 쌍의 값으로 정비례 관계식 구하기', '①8', (d, n) => {
            if (n === 0) {
              const a = pm(d) * d.int(2, 7), x0 = pm(d) * d.int(2, 5), y0 = a * x0;
              return ansV(`${Y}가 ${X}에 정비례하고, ${X} = ${iq(x0)}일 때 ${Y} = ${iq(y0)}이다. ${X}와 ${Y} 사이의 관계식을 ${boxD()}로 나타낼 때, ${box()} 안에 알맞은 수는?`, Q(a), 'int', {
                explain: `${eqDa}에 ${X} = ${iq(x0)}, ${Y} = ${iq(y0)}${tail(Math.abs(y0), '을/를')} 대입하면 ${iq(y0)} = ${iq(x0)}${A}이므로 ${A} = ${iq(a)}이다. 관계식은 ${eqD(a)}이다.`,
                facts: { value: `${jn(y0)}/${jn(x0)}`, rule: 'pair-box' }
              });
            }
            // 식 넷 가운데 고르기. 틀린 식: a와 1/a를 바꿈, 부호를 놓침, 정비례를 반비례로 봄.
            const [p, q] = d.until(() => [d.int(2, 5), d.int(2, 5)], ([u, v]) => u !== v && gcd(u, v) === 1), t = pm(d) * d.int(1, 2), x0 = q * t, y0 = -p * t, a = Q(-p, q);
            const rows = d.shuffle([[eqD(a), true], [eqD(Q(-q, p)), false], [eqD(Q(p, q)), false], [eqI(x0 * y0), false]]);
            return C(`${Y}가 ${X}에 정비례하고, ${X} = ${iq(x0)}일 때 ${Y} = ${iq(y0)}이다. ${X}와 ${Y} 사이의 관계식은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              explain: `${eqDa}에 ${X} = ${iq(x0)}, ${Y} = ${iq(y0)}${tail(Math.abs(y0), '을/를')} 대입하면 ${iq(y0)} = ${iq(x0)}${A}이므로 ${A} = ${tx(a)}이다. 관계식은 ${eqD(a)}이다.`,
              facts: { truth: rows.map((r) => r[1]), want: true, rule: 'pair-pick' }
            });
          }, { count: 2 }),
          T('direct-value-from-pair', '한 쌍의 값을 알 때 다른 x의 값에 대한 y의 값', '①9 심4', (d) => {
            const a = slope(d, d.bool() ? 'int' : 'frac'), [t0, t1] = d.until(() => [nz(d, -4, 4), nz(d, -4, 4)], ([u, v]) => u !== v && Math.abs(a.p * u) <= 20 && Math.abs(a.p * v) <= 20 && Math.abs(a.q * u) <= 9 && Math.abs(a.q * v) <= 9), x0 = a.q * t0, x1 = a.q * t1, y0 = a.p * t0, y1 = a.p * t1;
            return ansV(`${Y}가 ${X}에 정비례하고, ${X} = ${iq(x0)}일 때 ${Y} = ${iq(y0)}이다. ${X} = ${iq(x1)}일 때 ${Y}의 값은?`, Q(y1), 'int', {
              explain: `${eqDa}에 ${X} = ${iq(x0)}, ${Y} = ${iq(y0)}${tail(Math.abs(y0), '을/를')} 대입하면 ${A} = ${tx(a)}이므로 관계식은 ${eqD(a)}이다. ${X} = ${iq(x1)}일 때 ${Y} = ${iq(y1)}이다.`,
              facts: { value: `${jn(y0)}*${jn(x1)}/${jn(x0)}` }
            });
          }),
          T('direct-claims', '정비례 관계식에 대한 설명의 참·거짓', '①10', (d) => {
            const a = d.pick([Q(1, 2), Q(1, 3), Q(-1, 2), Q(2, 3), Q(-3), Q(-2), Q(4), Q(3)]), k = d.pick([2, 3]);
            const [t1, t2, t3] = d.shuffle([2, 3, 4, 5, 6]), x1 = a.q * t1, y1 = a.p * t1, x2 = a.q * t2, y2 = a.p * t2, x3 = a.q * t3, y3 = a.p * t3;
            const inv = qdiv(Q(x3), a);   // 곱할 것을 나눈 값
            const yes = [`${Y}는 ${X}에 정비례한다.`, `${X}의 값이 ${k}배가 되면 ${Y}의 값도 ${k}배가 된다.`, `${X} = ${iq(x1)}일 때 ${Y} = ${iq(y1)}이다.`, `${Y} = ${iq(y2)}일 때 ${X} = ${iq(x2)}이다.`, `${X} ≠ 0일 때 ${frac(Y, X)}의 값은 항상 일정하다.`];
            const no = [
              [`${X}의 값이 ${k}배가 되면 ${Y}의 값은 ${frac(1, k)}배가 된다.`, `${X}의 값이 ${k}배가 되면 ${Y}의 값도 ${k}배가 된다.`, yes[1]],
              [`${X} ≠ 0일 때 ${XY}의 값은 항상 일정하다.`, `일정한 것은 ${frac(Y, X)}의 값이다. ${XY}의 값이 일정한 것은 반비례 관계이다.`, yes[4]],
              [`${Y}는 ${X}에 반비례한다.`, `${eqDa} 꼴이므로 ${Y}는 ${X}에 정비례한다.`, yes[0]],
              [`${X} = ${iq(x3)}일 때 ${Y} = ${tx(inv)}이다.`, `${X} = ${iq(x3)}일 때 ${Y} = ${iq(y3)}이다.`]
            ].concat(a.p < 0 ? [[`${X}의 값이 ${k}배가 되면 ${Y}의 값은 ${MINUS}${k}배가 된다.`, `${X}의 값이 ${k}배가 되면 ${Y}의 값도 ${k}배가 된다.`, yes[1]]] : []);
            const want = d.bool();
            return claimQ(d, `정비례 관계 ${eqD(a)}에 대한 설명으로 ${want ? '옳은' : '옳지 않은'} 것은?`, yes, no, want);
          })
        ]
      },
      {
        id: 'dgraph', title: '정비례 관계의 그래프', standard: STD,
        types: [
          T('dgraph-pick-graph', '식을 보고 정비례 관계의 그래프 고르기', '①11·12 심11', (d) => {
            // 보기: 바른 그래프, x와 y의 자리를 바꾼 것(a와 1/a), 부호를 놓친 것, 둘 다 틀린 것. 그래프마다 지나는 점 하나에 점선을 내렸다.
            const base = d.pick([Q(2), Q(1, 2), Q(2, 3), Q(3, 2), Q(3, 4), Q(4, 3)]), a = signed(pm(d), base), cands = [a, qdiv(Q(1), a), qneg(a), qneg(qdiv(Q(1), a))];
            const mark = (s) => { const k = s.q === 1 || Math.abs(s.p) === 1 ? 2 : 1, x = s.q * k, y = s.p * k; return y > 0 ? [x, y] : [-x, -y]; };
            const order = d.shuffle([0, 1, 2, 3]), [x0, y0] = mark(a), R = Math.max(...cands.map((s) => Math.max(...mark(s).map(Math.abs)))) + 1;
            return C(`다음 ㉠~㉣ 가운데 정비례 관계 ${eqD(a)}의 그래프는?`, LAB.slice(0, 4), order.indexOf(0), {
              figure: picks(order.map((j, i) => mini({ line: cands[j], point: mark(cands[j]), name: LAB[i], R }))),
              explain: `${eqD(a)}에서 ${X} = ${iq(x0)}일 때 ${Y} = ${iq(y0)}이므로 그래프는 원점과 점 ${ptj(x0, y0, '을/를')} 지나는 직선이다.`,
              facts: { truth: order.map((j) => j === 0), want: true }
            });
          }),
          T('dgraph-pick-line', '한 좌표평면에 그린 직선들 가운데 식에 맞는 것 고르기', '①13', (d) => {
            // 오른쪽 위로 가파른 직선은 2배까지만 쓴다(더 가파르면 직선의 이름이 y축의 이름 바로 옆에 놓인다).
            const slopes = d.shuffle([Q(2), Q(1, d.pick([2, 3])), Q(-1, d.pick([2, 3])), Q(-d.pick([2, 3]))]), at = d.int(0, 3), a = slopes[at];
            return C(`그림의 직선 ㉠~㉣ 가운데 정비례 관계 ${eqD(a)}의 그래프는?`, LAB.slice(0, 4), at, {
              figure: planeT({ x: [-4, 4], y: [-4, 4], ticks: 'none', lines: slopes.map((s, i) => ({ a: s, name: LAB[i] })) }),
              explain: `${eqD(a)}의 그래프는 원점과 점 ${ptj(a.q, a.p, '을/를')} 지나는 직선이다. ${quads(a.p > 0)}을 지나는 두 직선 가운데 ${Math.abs(fl(a)) > 1 ? Y : X}축에 가까운 직선이다.`,
              facts: { truth: slopes.map((s, i) => i === at), want: true }
            });
          }),
          T('dgraph-claims', '식이 주어진 정비례 관계의 그래프에 대한 설명의 참·거짓', '①14', (d) => {
            const a = d.pick([Q(2), Q(3), Q(4), Q(1, 2), Q(3, 2), Q(-2), Q(-3), Q(-4), Q(-1, 2), Q(-3, 2)]), pos = a.p > 0, [t1, t2] = d.shuffle([-3, -2, -1, 1, 2, 3]), x1 = a.q * t1, y1 = a.p * t1, x2 = a.q * t2, y2 = a.p * t2;
            const yes = ['원점을 지나는 직선이다.', `점 ${ptj(x1, y1, '을/를')} 지난다.`, `${quads(pos)}을 지난다.`, `${X}의 값이 증가하면 ${Y}의 값${pos ? '도 증가' : '은 감소'}한다.`, `오른쪽 ${pos ? '위' : '아래'}로 향하는 직선이다.`];
            const no = [
              [`${quads(!pos)}을 지난다.`, `${quads(pos)}을 지난다.`, yes[2]],
              [`${X}의 값이 증가하면 ${Y}의 값${pos ? '은 감소' : '도 증가'}한다.`, `${X}의 값이 증가하면 ${Y}의 값${pos ? '도 증가' : '은 감소'}한다.`, yes[3]],
              [`오른쪽 ${pos ? '아래' : '위'}로 향하는 직선이다.`, `오른쪽 ${pos ? '위' : '아래'}로 향하는 직선이다.`, yes[4]],
              [`점 ${ptj(x2, -y2, '을/를')} 지난다.`, `${X} = ${iq(x2)}일 때 ${Y} = ${iq(y2)}이므로 점 ${ptj(x2, y2, '을/를')} 지난다.`],
              ['한 쌍의 매끄러운 곡선이다.', '정비례 관계의 그래프는 원점을 지나는 직선이다.', yes[0]],
              [`${X} ${LT} 0일 때 ${Y} ${pos ? GT : LT} 0이다.`, `${X} ${LT} 0일 때 ${Y} ${pos ? LT : GT} 0이다.`]
            ];
            const want = d.bool();
            return claimQ(d, `정비례 관계 ${eqD(a)}의 그래프에 대한 설명으로 ${want ? '옳은' : '옳지 않은'} 것은?`, yes, no, want);
          }),
          T('dgraph-general', '정비례 관계 y = ax의 그래프의 성질', '①15 심9·10', (d) => {
            const yes = ['원점을 지나는 직선이다.', `점 ${pt(1, A)}를 지난다.`, `${A} ${GT} 0일 때 제1사분면과 제3사분면을 지난다.`, `${A} ${LT} 0일 때 제2사분면과 제4사분면을 지난다.`, `${A} ${GT} 0일 때 ${X}의 값이 증가하면 ${Y}의 값도 증가한다.`, `${A} ${LT} 0일 때 ${X}의 값이 증가하면 ${Y}의 값은 감소한다.`, `${A}의 절댓값이 클수록 ${Y}축에 가깝다.`, `${A} ${LT} 0일 때 오른쪽 아래로 향하는 직선이다.`];
            const no = [
              [`${A}의 절댓값이 작을수록 ${Y}축에 가깝다.`, `${A}의 절댓값이 클수록 ${Y}축에 가깝다.`, yes[6]],
              [`${A} ${GT} 0일 때 제2사분면과 제4사분면을 지난다.`, `${A} ${GT} 0일 때 제1사분면과 제3사분면을 지난다.`, yes[2]],
              [`${A} ${GT} 0일 때 ${X}의 값이 증가하면 ${Y}의 값은 감소한다.`, `${A} ${GT} 0일 때 ${X}의 값이 증가하면 ${Y}의 값도 증가한다.`, yes[4]],
              [`${A} ${LT} 0일 때 ${X}의 값이 증가하면 ${Y}의 값도 증가한다.`, `${A} ${LT} 0일 때 ${X}의 값이 증가하면 ${Y}의 값은 감소한다.`, yes[5]],
              [`${A}의 값에 관계없이 제1사분면과 제3사분면을 지난다.`, `${A} ${LT} 0일 때에는 제2사분면과 제4사분면을 지난다.`, yes[3]],
              [`${A}의 절댓값이 작을수록 ${X}축에서 멀어진다.`, `${A}의 절댓값이 작을수록 ${X}축에 가깝다.`, yes[6]],
              ['한 쌍의 매끄러운 곡선이다.', '정비례 관계의 그래프는 원점을 지나는 직선이다.', yes[0]],
              [`점 ${pt(0, A)}를 지난다.`, `${X} = 0일 때 ${Y} = 0이므로 원점을 지난다.`, yes[0]]
            ];
            const want = d.bool();
            return claimQ(d, `정비례 관계 ${eqDa}의 그래프에 대한 설명으로 ${want ? '옳은' : '옳지 않은'} 것은? (단, ${A}는 0이 아닌 수이다.)`, yes, no, want);
          }),
          T('dgraph-quadrant', '지나는 사분면으로 정비례 관계 고르기', '①16', (d) => {
            const pos = d.bool(), mags = d.until(() => [Q(d.int(2, 7)), fr(d, [2, 3, 5], 2), Q(d.int(2, 7)), fr(d, [2, 3, 4], 2)], distinct), up = d.shuffle([0, 1, 2, 3]).slice(0, 2);
            const list = mags.map((m, i) => signed(up.includes(i) ? 1 : -1, m)), flags = list.map((v) => (v.p > 0) === pos);
            return pairPick(d, `다음 정비례 관계 중 그래프가 ${quads(pos)}을 지나는 것을 모두 고른 것은?`, list.map(eqD), flags,
              `정비례 관계 ${eqDa}의 그래프는 ${A} ${GT} 0일 때 제1사분면과 제3사분면을, ${A} ${LT} 0일 때 제2사분면과 제4사분면을 지난다. ${A}의 값이 ${pos ? '양수' : '음수'}인 것은 ${flags.map((f, i) => (f ? LAB[i] : '')).filter(Boolean).join(', ')}이다.`);
          }),
          T('dgraph-nearest-axis', '그래프가 축에 가장 가까운 정비례 관계 고르기', '①17 심12', (d) => {
            // 절댓값이 가장 큰 수가 음수이고, 가장 큰 수는 따로 있다(부호를 버리고 절댓값을 견주어야 한다).
            const toY = d.bool();
            const list = d.until(() => d.shuffle([Q(d.int(1, 6)), Q(-d.int(2, 7)), signed(-1, fr(d, [2, 3, 5], 2)), fr(d, [2, 3, 4, 5], 2)]), (rows) => {
              const sizes = rows.map((v) => Math.abs(fl(v))), top = rows[sizes.indexOf(Math.max(...sizes))], low = rows[sizes.indexOf(Math.min(...sizes))];
              return new Set(sizes).size === 4 && top.p < 0 && low.p < 0;
            });
            const sizes = list.map((v) => Math.abs(fl(v))), at = sizes.indexOf(toY ? Math.max(...sizes) : Math.min(...sizes));
            return C(`다음 정비례 관계 중 그래프가 ${toY ? Y : X}축에 가장 가까운 것은?`, list.map(eqD), at, {
              explain: `정비례 관계 ${eqDa}의 그래프는 ${A}의 절댓값이 클수록 ${Y}축에 가깝고, 작을수록 ${X}축에 가깝다. ${A}의 절댓값은 차례로 ${list.map((v) => mag(v)).join(', ')}이므로 절댓값이 가장 ${toY ? '큰' : '작은'} ${eqD(list[at])}의 그래프가 ${toY ? Y : X}축에 가장 가깝다.`,
              facts: { rank: { values: sizes, nth: toY ? 1 : 4 } }
            });
          }),
          T('dgraph-between', '기준이 되는 직선과 견주어 그림의 직선이 될 수 있는 식 고르기', '①19 심14', (d) => {
            // 모눈 없이 그린다: 지나는 사분면에서 부호를, 기준 직선(y = x 또는 y = −x)보다 어느 축에 가까운지에서 절댓값이 1보다 큰지 작은지를 읽는다.
            const b = pm(d), big = 2, small = Q(1, d.pick([2, 3])), cands = d.shuffle([Q(big), small, Q(-big), qneg(small)]), at = d.int(0, 3), t = cands[at], steep = Math.abs(fl(t)) > 1;
            return C(`그림에서 직선 ㉠은 정비례 관계 ${eqD(b)}의 그래프이다. 다음 중 직선 ㉡이 나타내는 정비례 관계의 식이 될 수 있는 것은?`, cands.map(eqD), at, {
              figure: planeT({ x: [-4, 4], y: [-4, 4], grid: false, ticks: 'none', lines: [{ a: b, name: LAB[0] }, { a: t, name: LAB[1] }] }),
              explain: `직선 ㉡은 ${quads(t.p > 0)}을 지나므로 ${eqDa}에서 ${A} ${t.p > 0 ? GT : LT} 0이다. 또 ${eqD(b)}의 그래프보다 ${steep ? Y : X}축에 가까우므로 ${A}의 절댓값은 1보다 ${steep ? '크다' : '작다'}. 알맞은 것은 ${eqD(t)}이다.`,
              facts: { truth: cands.map((v, i) => i === at), want: true }
            });
          }),
          T('dgraph-point-on', '점이 정비례 관계의 그래프 위에 있는지 가리기', '①20', (d) => {
            const a = slope(d, 'frac'), want = d.bool(), on = (t) => [Q(a.q * t), Q(a.p * t)];
            // 그래프 위의 점: 정수 좌표, 분수 좌표. 그래프 위에 없는 점: x와 y의 자리를 바꾼 것, 부호를 놓친 것, y축 위의 점.
            const one = Q(pm(d)), good = d.shuffle([on(1), on(-1), on(2 * pm(d)), [one, qmul(one, a)]]);
            const bad = d.shuffle([[Q(a.p), Q(a.q)], [Q(a.q), Q(-a.p)], [Q(0), Q(d.int(1, 3))], [Q(-a.q * 2), Q(a.p * 2)]]);
            const rows = d.shuffle(want ? [good[0]].concat(bad.slice(0, 3)) : good.slice(0, 3).concat([bad[0]])), hit = (r) => qcmp(qmul(a, r[0]), r[1]) === 0, at = rows.findIndex((r) => hit(r) === want);
            return C(`다음 중 정비례 관계 ${eqD(a)}의 그래프 위의 점${want ? '은' : '이 아닌 것은'}?`, rows.map((r) => pt(r[0], r[1])), at, {
              explain: `${eqD(a)}에 ${X}좌표를 대입하여 얻은 ${Y}의 값이 ${Y}좌표와 같으면 그래프 위의 점이다. ${X} = ${tx(rows[at][0])}일 때 ${Y} = ${tx(qmul(a, rows[at][0]))}이므로 점 ${ptj(rows[at][0], rows[at][1], '은/는')} 그래프 위의 점${want ? '이다' : '이 아니다'}.`,
              facts: { claimed: rows.map((r) => [`${jn(a.p)}*${jn(r[0].p)}*${r[1].q}`, a.q * r[0].q * r[1].p]), claimedWant: want }
            });
          }),
          T('dgraph-point-fill', '정비례 관계의 그래프가 지나는 점의 빈 좌표 구하기', '①21', (d) => {
            const a = slope(d, d.bool() ? 'int' : 'frac'), [t1, t2] = d.until(() => [nz(d, -4, 4), nz(d, -4, 4)], ([u, v]) => u !== v && Math.abs(a.p * u) <= 20 && Math.abs(a.p * v) <= 20 && Math.abs(a.q * u) <= 9 && Math.abs(a.q * v) <= 9), x1 = a.q * t1, y1 = a.p * t1, x2 = a.q * t2, y2 = a.p * t2;
            return M(`정비례 관계 ${eqD(a)}의 그래프가 두 점 ${pt(x1, LAB[0])}, ${ptj(LAB[1], y2, '을/를')} 지날 때, ㉠, ㉡에 알맞은 수는?`, [{ label: LAB[0], answer: y1, signed: true }, { label: LAB[1], answer: x2, signed: true }], {
              explain: `${eqD(a)}에 ${X} = ${iq(x1)}${tail(Math.abs(x1), '을/를')} 대입하면 ${Y} = ${iq(y1)}이므로 ㉠은 ${iq(y1)}이다. ${Y} = ${iq(y2)}${tail(Math.abs(y2), '을/를')} 대입하면 ${X} = ${iq(x2)}이므로 ㉡은 ${iq(x2)}이다.`,
              facts: { calc: [[`${jn(a.p)}*${jn(x1)}/${a.q}`, 0], [`${jn(y2)}*${a.q}/${jn(a.p)}`, 1]], unseen: a.q === 1 ? [1] : [] }
            });
          }),
          T('dgraph-a-from-point', '그래프가 지나는 한 점으로 y = ax의 a 구하기', '①22', (d) => {
            const [x0, y0] = d.until(() => [nz(d, -6, 6), nz(d, -9, 9)], ([u, v]) => v % u !== 0 && Math.abs(u) > 1), a = Q(y0, x0);
            return ansV(`정비례 관계 ${eqDa}의 그래프가 점 ${ptj(x0, y0, '을/를')} 지날 때, 수 ${A}의 값은?`, a, 'frac', {
              explain: `${eqDa}에 ${X} = ${iq(x0)}, ${Y} = ${iq(y0)}${tail(Math.abs(y0), '을/를')} 대입하면 ${iq(y0)} = ${iq(x0)}${A}이므로 ${A} = ${tx(a)}이다.`,
              facts: { value: `${jn(y0)}/${jn(x0)}` }
            });
          }),
          T('dgraph-point-on-after', '한 점으로 a를 구한 뒤 그래프 위의 점 찾기', '①23', (d) => {
            const a = pm(d) * d.int(2, 5), x0 = nz(d, -3, 3), y0 = a * x0, t = d.until(() => nz(d, -4, 4), (v) => v !== x0 && v !== -x0);
            // 그래프 위의 점 하나(분수 좌표일 수 있다)와, 부호를 놓친 점, x와 y의 자리를 바꾼 점, a를 더한 점
            const good = d.bool() ? [Q(t), Q(a * t)] : [Q(pm(d) * d.pick([1, 2, 3]), Math.abs(a)), null];
            if (!good[1]) good[1] = qmul(Q(a), good[0]);
            const bad = [[Q(t), Q(-a * t)], [Q(a * 2), Q(2)], [Q(-x0), Q(y0)]];
            const rows = d.shuffle([good].concat(bad)), at = rows.indexOf(good);
            return C(`정비례 관계 ${eqDa}의 그래프가 점 ${ptj(x0, y0, '을/를')} 지날 때, 다음 중 이 그래프 위의 점은?`, rows.map((r) => pt(r[0], r[1])), at, {
              explain: `${eqDa}에 ${X} = ${iq(x0)}, ${Y} = ${iq(y0)}${tail(Math.abs(y0), '을/를')} 대입하면 ${A} = ${iq(a)}이므로 관계식은 ${eqD(a)}이다. ${X} = ${tx(good[0])}일 때 ${Y} = ${tx(good[1])}이므로 점 ${ptj(good[0], good[1], '이/가')} 이 그래프 위의 점이다.`,
              facts: { claimed: rows.map((r) => [`${jn(y0)}*${jn(r[0].p)}*${r[1].q}`, x0 * r[0].q * r[1].p]), claimedWant: true }
            });
          }),
          T('dgraph-two-points', '그래프가 지나는 두 점에서 한 점의 좌표 구하기', '①24 심15', (d) => {
            const a = slope(d, 'frac'), [t0, t1] = d.until(() => [nz(d, -4, 4), nz(d, -4, 4)], ([u, v]) => u !== v && Math.abs(a.p * u) <= 12 && Math.abs(a.p * v) <= 12 && Math.abs(a.q * u) <= 9 && Math.abs(a.q * v) <= 9), x0 = a.q * t0, y0 = a.p * t0, x1 = a.q * t1, y1 = a.p * t1, b = V('b');
            return ansV(`정비례 관계 ${eqDa}의 그래프가 두 점 ${pt(x0, y0)}, ${pt(x1, b)}를 지날 때, ${b}의 값은?`, Q(y1), 'int', {
              explain: `${eqDa}에 ${X} = ${iq(x0)}, ${Y} = ${iq(y0)}${tail(Math.abs(y0), '을/를')} 대입하면 ${A} = ${tx(a)}이므로 관계식은 ${eqD(a)}이다. ${X} = ${iq(x1)}${tail(Math.abs(x1), '을/를')} 대입하면 ${b} = ${iq(y1)}이다.`,
              facts: { value: `${jn(y0)}*${jn(x1)}/${jn(x0)}` }
            });
          }),
          T('dgraph-letter-point', '좌표가 문자로 된 식인 점이 그래프 위에 있을 때 문자의 값', '①26 심16', (d) => {
            // 점 (k, k + c)가 y = (p/q)x 위에 있다: k + c = (p/q)k. k가 정수가 되도록 k = qt, c = (p − q)t 로 잡는다.
            const [p, q] = d.until(() => [nz(d, -4, 5), d.int(1, 4)], ([u, v]) => u !== v && gcd(u, v) === 1 && !(Math.abs(u) === 1 && v === 1)), t = nz(d, -3, 3), k = q * t, c = (p - q) * t, s = Q(p, q), K = V('k');
            const second = nb(`${K} ${c < 0 ? MINUS : '+'} ${Math.abs(c)}`), rest = qsub(Q(1), s);
            return ansV(`정비례 관계 ${eqD(s)}의 그래프가 점 ${nb(`(${K}, ${second})`)}${tail(Math.abs(c), '을/를')} 지날 때, ${K}의 값은?`, Q(k), 'int', {
              explain: `${eqD(s)}에 ${X} = ${K}, ${Y} = ${second}${tail(Math.abs(c), '을/를')} 대입하면 ${second} = ${sg(s)}${mono(s, K)}이다. ${sg(rest)}${mono(rest, K)} = ${iq(-c)}이므로 ${K} = ${iq(k)}이다.`,
              facts: { value: `${jn(c)}*${q}/(${jn(p)}-${q})`, unseen: q === 1 ? [1] : [] }
            });
          }),
          T('dgraph-eq-from-graph', '그래프를 보고 정비례 관계식 구하기', '①27', (d, n) => {
            // 눈금 수가 직선에 가리지 않도록 a의 절댓값은 2까지로 한다. 첫째는 a가 정수, 둘째는 분수이다.
            const a = signed(pm(d), n === 0 ? Q(d.pick([1, 2])) : d.pick([Q(1, 2), Q(1, 3), Q(2, 3), Q(3, 2), Q(3, 4), Q(4, 3)]));
            return ansV(`그림은 정비례 관계 ${eqDa}의 그래프이다. 수 ${A}의 값은?`, a, n === 0 ? 'int' : 'frac', {
              figure: planeT({ x: [-4, 4], y: [-4, 4], ticks: TICKS, lines: [{ a }] }),
              explain: `그래프가 점 ${ptj(a.q, a.p, '을/를')} 지나므로 ${eqDa}에 ${X} = ${a.q}, ${Y} = ${iq(a.p)}${tail(Math.abs(a.p), '을/를')} 대입하면 ${A} = ${tx(a)}이다.`,
              facts: { value: `${jn(a.p)}/${a.q}`, rule: n === 0 ? 'graph-int' : 'graph-frac' }
            });
          }, { count: 2 })
        ]
      },
      { id: 'inverse', title: '반비례 관계', standard: STD, types: [] },
      { id: 'igraph', title: '반비례 관계의 그래프', standard: STD, types: [] },
      { id: 'both', title: '정비례와 반비례의 그래프', standard: STD, types: [] },
      { id: 'area', title: '그래프와 도형의 넓이', standard: STD, types: [] },
      { id: 'use', title: '실생활 활용', standard: STD, types: [] }
    ]
  });

  // 같은 단원의 다른 파일(7-1-6b.js, 7-1-6c.js)이 함께 쓰는 도구
  B.kit.m716 = {
    STD, keep, X, Y, A, XY, TAG6, CM2, POLYGON, num, jn, iq, sg, signed, eqD, eqI, eqDa, eqIa, boxD, boxI, yPlus, yLin, yMinus, cx, pt, ptj, quads, grid2, cell, xyTable, REL, KIND, why, SIT, storyRows, mini, picks, pairPick, planeT, TICKS, clearGuide, slope
  };
})(typeof window !== 'undefined' ? window : globalThis);
