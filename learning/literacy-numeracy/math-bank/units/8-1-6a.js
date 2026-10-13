// 중학교 2학년 1학기 6단원 일차함수와 일차방정식의 관계 — 단원 틀·도구와 앞쪽 묶음(일차방정식과 일차함수, 일차방정식의 그래프, 방정식 x = p, y = q의 그래프).
// 수집해 둔 교과서 3종(미래엔 황선욱 2015·2022, 천재 김동재·김화경)의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1: 69꼴, 심화꼴: 58꼴)을 꼴마다 따져서 실었다.
// 8-1-4 「연립방정식」 꼴 목록의 「해가 무수히 많거나 없는 연립방정식」(기본꼴 1의 34~37, 심화꼴의 34~36)도 이 단원에서 싣는다(8-1-6b.js 의 「위치 관계」 묶음).
// 꼴마다 「실음(유형 이름) / 바꿈 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/8-1-6/싣기_대조표.md 에 있다.
// (직선의 방정식, 두 직선의 교점, 위치 관계와 해의 개수, 넓이는 8-1-6b.js 에, 실력 문항은 8-1-6c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번, 「8-1-4 ①n·심n」 = 8-1-4 꼴 목록의 번호.
// 영역은 변화와 관계. 성취기준은 9수02-17(일차함수와 미지수가 2개인 일차방정식의 관계를 설명할 수 있다), 9수02-18(두 일차함수의 그래프와 연립일차방정식의 관계를 설명할 수 있다)이다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(식·점·절편·기울기·그림), 묻는 것(식·수·좌표·고르기·참거짓)이 다르면 따로 싣는다. 수와 이름만 다른 것은 한 번만 싣는다.
//  - 앞 단원(8-1-5 일차함수와 그 그래프)의 일만으로 끝나는 꼴은 싣지 않는다: y = ax + b 의 기울기·절편·식 구하기·평행이동·활용.
//    일차방정식 ax + by + c = 0 의 그래프, x = p·y = q 의 그래프, 두 직선의 교점·위치 관계가 걸린 꼴만 싣는다.
//  - 답: 직선의 방정식 y = ax + b 는 식 속의 칸(lineAns — 「y = [±][ ]x [±][ ]」)으로 받는다. 칸의 모양이 답을 흘리지 않게 a 는 ±1이 아닌 정수, b 는 0이 아닌 정수로만 짓고,
//    기울기가 분수인 답은 고르기로 낸다. x = p, y = q 꼴의 답은 「x = 」「y = 」 가운데 어느 것인지가 곧 물음이므로 넷 가운데 고르게 한다(x = p, x = q, y = p, y = q).
//    교점의 좌표는 pointAns, 수 a·b 의 값은 부호 단추가 붙은 칸, 해의 개수·위치 관계는 고르기. 넓이·길이·시간은 음수일 수 없으므로 부호 단추 없이 받는다.
//    「a + b의 값」처럼 따로 구한 수를 다시 더하는 꼴은 수를 하나하나 답하게 바꾸었다. 한 유형(차례)의 답은 늘 같은 꼴(정수 / 분수)이다.
//  - 그림: 좌표평면은 공용 도구 plane 으로 그린다(이 파일의 pl 이 눈금 수·원점의 이름을 12px 로 다시 적고, 축 위의 수·문자와 그림 설명을 덧댄다).
//    교점을 그래프에서 읽는 문항은 교점이 모눈 점에 오고 점을 찍었다. 식을 세워야 하는 문항(절편·한 점의 좌표를 축에 적은 그림)은 모눈 없이 그린다.
//    그래프 넷을 보기로 늘어놓는 문항은 이 파일의 작은 좌표평면 mini 로 그린다.
//  - 참·거짓은 손으로 적지 않고 코드로 가린다(기울기·절편·지나는 사분면·평행·일치).
//  - 기본과 실력: 수집본 기본 문서에 여러 번 나오고 두 단계를 잇는 꼴(교점으로 수 구하기 ①43·44·45, 세 직선이 한 점에서 만날 때 ①48, 기울기를 수로 준 교점을 지나는 직선 ①46,
//    그림의 두 직선의 식을 세워 교점 구하기 ①42, 해가 없을·무수히 많을 조건 ①53·54·55)은 기본에 두었다. 뜻을 정확히 대야 풀리는 것과 세 단계 넘게 잇는 것만 실력(8-1-6c.js)에 두었다.
//  - 꼴 목록에 적힌 원문 답의 잘못(미래엔 2015 표준 05, 2022 소단원 마무리 Ⅴ-7 04·05, 발16 등)은 따르지 않는다. 답은 모두 코드가 셈한다.
//
// 뺀 것과 까닭(8-1-6b.js, 8-1-6c.js 의 것까지 여기에 모아 적는다)
//  - 앞 단원의 일만으로 끝나는 것: 그림의 직선에서 기울기를 읽어 평행한 직선의 식 구하기(①34 심17 — 2022 자료에서는 앞 단원 문제로만 나온다), 모눈 위의 비스듬한 선분의 식(①37의 한 꼴),
//    y = ax + b 와 평행하고 한 점을 지나는 직선(심15), 두 점을 지나는 직선 위의 점·평행이동(심18·19), 평행이동한 두 직선과 두 축 사이의 넓이(심45),
//    교점과 다른 한 점을 지나는 직선(①47의 변형), 축에 평행한 두 직선의 교점 둘을 지나는 직선(①29의 변형), 기울기를 증가량으로만 준 직선의 식(①32의 변형).
//  - 과제 글이 싣지 않기로 한 것: 네 직선이 한 점에서 만날 때(①49), 세 직선이 삼각형을 이루지 않게 하는 수(①59 심41), 선분·도형과 만나게 하는 수의 범위(①67 심53·54),
//    대칭점으로 최단 거리 찾기(심56).
//  - 꼬인 것(경우 따지기·요령): 사분면에서 만나게 하는 수의 범위(①68 — 그림도 답도 없다), 한 사분면을 지나지 않게 하는 기울기의 범위(심55), 직선 x = k 가 삼각형을 자르는 길이(심14),
//    곱이 12인 순서쌍 세기(심39 — 원문도 어긋난다), 원점을 지날 때까지 따지는 부호 묶음 둘(심24), 평행사변형이 되는 경우 가리기(심48), 사다리꼴·직사각형의 넓이를 나누는 직선(심51·52),
//    문자가 든 좌표의 교점 넷(심57), 넓이의 비를 밑변의 비로 바꾸는 요령(심47), 넓이에서 거꾸로 점을 찾아 직선의 식 구하기(심21), 넓이 식을 문자로 세우는 사다리꼴(심44),
//    답이 둘인데 하나만 적힌 넓이와 기울기(심46 — 분모에 문자가 든 식), 조건 셋으로 수 셋 찾기(심36), 조건 둘을 연립하는 일을 다시 묻는 것(심33 — 심28과 같은 일).
//  - 작도·서술형: 그래프 그리기(①11·20·40·50 — 그래프 고르기·읽기로 바꿈), 두 수의 관계를 그래프로 나타내기(심40 — a의 값과 c가 될 수 없는 값으로 바꿈).
//  - 뜻 없는 셈: 따로 구한 수의 합·곱·차(①1·3·8·9·16·43·45·55 심5·6·8·28·36·38 의 a + b, ab — 하나하나 구하는 일은 실었다).
//  - 같은 일이어서 한 번만 실은 것: 평행한 직선의 기울기만 묻기(①4의 변형 — ①3과 같다), 절편 하나로 수 하나 구하기(①8의 변형), ax + by = 1 꼴의 절편(①16의 변형),
//    그림 없이 식만 다른 교점 구하기(①41·45의 변형), 두 직선과 x축의 넓이를 그림으로(심42 — ①61과 같다), 그래프와 축의 넓이에 절편을 분모로 적은 식(심7 — 그림도 모른다),
//    교점을 지나고 평행한 직선의 식을 다른 꼴로(심32의 변형), 점을 대입으로 구해 평행한 직선(심15의 변형), 해가 무수히 많은 것과 없는 것을 한 문제에 나란히(8-1-4 심36 — ①53·55를 묶은 것),
//    x축·y축에 평행한 두 경우를 모두(심9 — ①28을 두 번), 그래프 그림에서 계수의 곱의 부호(심25 — ①18과 같다), 사분면과 축 평행 조건을 이은 것(①15의 변형 — ①24와 ①15를 따로 실었다),
//    넓이를 사등분하는 직선(심50의 변형 — 이등분과 같은 일).
//  - 그림을 끝내 알 수 없어 뺀 것: 양초 두 개의 그래프(①69의 변형 — 그림도 답도 없다). ①12·19·21 심27의 보기 그림은 모르므로 쪽 그림에서 확인한 다른 꼴의 그림이나 말로 된 보기로 바꾸어 실었다.
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, N, M, C, inline } = B.kit;
  const { LAB, MINUS, GT, LT, gcd, Q, qneg, qabs, qcmp, fl, tx, nb, tail, lastOf, tj, V, tag, f1, nz, pm, ansV, claimQ, asQ, mono, pointAns, plane } = B.kit.mid;
  const STD1 = '9수02-17', STD2 = '9수02-18';
  // 「a = 3」「x = −2」처럼 문자와 수를 이은 짧은 식이 줄 끝에서 갈라지지 않게 한 덩이로 묶는다(문항의 글·풀이·보기에 한꺼번에 입힌다).
  const FRACT = '<span class="mb-frac"><span>[^<]*</span><span class="mb-frac-bar">/</span><span>[^<]*</span></span>', NUMB = `${MINUS}?(?:${FRACT}|[0-9]+(?:[.][0-9]+)?)`, VARS = '(?:<i class="mb-var">[A-Za-z]</i>){1,2}';
  const SHORT = new RegExp(`${VARS} (?:=|&gt;|&lt;|≠) ${NUMB}(?![0-9<(])`, 'g');
  const tight = (h) => (typeof h === 'string' ? h.replace(SHORT, (m) => nb(m)) : h);
  const keep = (item) => { item.text = tight(item.text); item.explain = tight(item.explain); if (item.choice) item.choice.options = item.choice.options.map(tight); return item; };
  // 기본 문항. 심화 문서에만 나오지만 기본에서 하는 일을 묻는 꼴(ref 에 ①이 없는 것)은 출처를 심화 자료로 적는다.
  const src = (ref) => (ref.includes('①') ? '수집본 기본 자료(' : '수집본 심화 자료(') + ref + ')';
  // SPIN: 유형마다 난수를 그만큼 먼저 흘려보낸다(수나, 차례마다의 수의 배열). 은행에 실리는 문항은 유형마다 하나로 정해져 있어서,
  // 손대지 않으면 고르기 문항 35개 가운데 15개의 정답이 첫째 보기였다. 회차 안에서 정답 자리가 겹치지 않고 단원 전체로 고르게(1~4번이 8·10·9·8개) 나오도록 맞춘 수이다.
  // 유형의 난수 쓰는 차례를 고치면 정답 자리가 달라지므로 다시 맞춘다(자리마다의 수를 세어 보고 고른다).
  const SPIN = {
    'eq-same-func': [7, 4], 'eq-parallel-pick': [1, 2], 'eq-point-on': [3, 0], 'graph-pick-line': 1, 'graph-claims': 2, 'graph-quadrant': 5, 'graph-signs-from-graph': 4,
    'axis-line-through-point': [0, 0, 2, 0], 'axis-two-points': 5, 'axis-pick-all': 7, 'axis-through-intercept': 3, 'axis-eq-from-graph': 1, 'axis-claims': 4,
    'line-not-parallel': 2, 'meet-axis-line': 7, 'count-from-graph': 1, 'count-classify': 5, 'count-pick-system': [1, 5], 'count-many-then-quadrant': 1
  };
  const spun = (id, make) => (d, n) => { const spin = SPIN[id], k = Array.isArray(spin) ? spin[n] || 0 : spin || 0; for (let i = 0; i < k; i += 1) d.next(); return keep(make(d, n)); };
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: src(ref), make: spun(id, make) }, more || {});

  // ── 글 ──
  const X = V('x'), Y = V('y'), A = V('a'), Bv = V('b'), Cv = V('c'), K = V('k');
  const TAG6 = ['㉠', '㉡', '㉢', '㉣', '㉤', '㉥'];
  const QUAD = ['제1사분면', '제2사분면', '제3사분면', '제4사분면'];
  const num = (v) => (typeof v === 'number' ? v : fl(v));
  const jn = (n) => (n < 0 ? '(-' + -n + ')' : String(n));   // 검사 식에 적는 정수
  const iq = (n) => tx(Q(n));                                 // 화면에 적는 정수(음수는 −)
  const sgn = (v) => (v < 0 ? MINUS + Math.abs(v) : String(v)); // 그림 속·그림 설명에 적는 정수
  const tl = (n, pair) => tail(Math.abs(n), pair);            // 수 뒤의 토씨만
  // 식에 숫자 1이 드러나지 않는 계수(x, −y)를 검사에 밝힌다.
  const un = (...vals) => (vals.some((v) => Math.abs(v) === 1) ? [1] : []);
  // 항을 이어 적은 글. 항은 [계수(수·유리수), 문자 글](계수가 0이면 적지 않는다)이거나 문자가 계수인 항 Lt(글, 부호)이다 — ax, (a + 2)x, 상수항 b.
  const Lt = (h, s) => ({ s: s || 1, h });
  const sum = (list) => {
    const live = list.map((t) => { if (!Array.isArray(t)) return t; const q = asQ(t[0]); return q.p === 0 ? null : { s: q.p < 0 ? -1 : 1, h: mono(qabs(q), t[1]) }; }).filter(Boolean);
    return live.length ? live.map((t, i) => (i === 0 ? (t.s < 0 ? MINUS : '') : t.s < 0 ? ` ${MINUS} ` : ' + ') + t.h).join('') : '0';
  };
  const side = (v) => (typeof v === 'string' ? v : Array.isArray(v) ? sum(v) : tx(asQ(v)));
  const eq0 = (...list) => nb(sum(list) + ' = 0');                   // … = 0
  const eqR = (list, right) => nb(sum(list) + ' = ' + side(right));  // … = (수·식)
  // 직선은 { a, b, c }: ax + by + c = 0 으로 적어 둔다.
  const gen = (l) => eq0([l.a, X], [l.b, Y], [l.c, '']);             // ax + by + c = 0
  const std = (l) => eqR([[l.a, X], [l.b, Y]], -l.c);                // ax + by = −c
  const fn = (m, k) => nb(`${Y} = ${sum([[m, X], [k, '']])}`);       // y = mx + k
  const xEq = (p) => nb(`${X} = ${tx(asQ(p))}`), yEq = (q) => nb(`${Y} = ${tx(asQ(q))}`);
  const slope = (l) => Q(-l.a, l.b), yint = (l) => Q(-l.c, l.b), xint = (l) => Q(-l.c, l.a);
  const norm = (a, b, c) => { const g = gcd(gcd(a, b), c) || 1, s = a < 0 || (a === 0 && b < 0) ? -1 : 1; return { a: s * a / g, b: s * b / g, c: s * c / g }; };
  // 기울기가 p/q 이고 y절편이 k 인 직선, 두 절편이 p, q 인 직선, 점 (x0, y0)을 지나고 기울기가 p/q 인 직선
  const byFn = (m, k) => { const s = asQ(m), t = asQ(k); return norm(s.p * t.q, -s.q * t.q, s.q * t.p); };
  const byCuts = (p, q) => norm(q, p, -p * q);
  const through = (x0, y0, p, q) => norm(p, -q, q * y0 - p * x0);
  const onLine = (l, x, y) => l.a * x + l.b * y + l.c === 0;
  // 두 직선의 교점(유리수 짝). 평행하거나 일치하면 null.
  const cross = (l, k) => { const det = l.a * k.b - k.a * l.b; return det === 0 ? null : [Q(l.b * k.c - k.b * l.c, det), Q(k.a * l.c - l.a * k.c, det)]; };
  // 교점의 좌표를 검사가 다시 셈하는 식(식에 적힌 수만 쓴다)
  const X0 = (l, k) => `(${jn(l.b)}*${jn(k.c)}-${jn(k.b)}*${jn(l.c)})/(${jn(l.a)}*${jn(k.b)}-${jn(k.a)}*${jn(l.b)})`;
  const Y0 = (l, k) => `(${jn(k.a)}*${jn(l.c)}-${jn(l.a)}*${jn(k.c)})/(${jn(l.a)}*${jn(k.b)}-${jn(k.a)}*${jn(l.b)})`;
  // 기울기 m, y절편 k(둘 다 0이 아님)인 직선이 지나지 않는 사분면
  const missing = (m, k) => (m > 0 ? (k > 0 ? 4 : 2) : (k > 0 ? 3 : 1));
  // 점의 좌표. 좌표는 수·유리수이거나 이미 그린 글(문자)이다.
  const cx = (v) => (typeof v === 'string' ? v : tx(asQ(v)));
  const pt = (x, y) => nb(`(${cx(x)}, ${cx(y)})`);
  const ptj = (x, y, pair) => nb(`(${cx(x)}, ${cx(y)})${tail(lastOf(asQ(y)), pair)}`);
  // 이름표를 붙인 식을 한 줄에 하나씩 늘어놓는다(여섯 개까지. 두 줄로 나란히 놓으면 긴 식이 휴대폰 너비에서 이름표 아래로 밀린다).
  const tagRows = (list, tags) => '<div class="mb-lines">' + list.map((h, i) => '<div>' + tag((tags || TAG6)[i]) + h + '</div>').join('') + '</div>';
  // 작은 그림 넷을 두 줄로 놓고 이름(㉠~㉣)을 단다.
  const picks = (figs) => '<div style="display:grid;grid-template-columns:repeat(2,max-content);gap:8px 12px">' + figs.map((h, i) => `<div style="display:grid;gap:1px;justify-items:start"><div style="font-size:0.95rem;font-weight:600">${LAB[i]}</div>${h}</div>`).join('') + '</div>';

  // ── 문항 도구 ──
  // 답이 직선의 방정식 y = ax + b 인 문항: 「y = [±][ ]x [±][ ]」로 받고, 틀리면 식 그대로(y = 2x − 3) 보인다.
  // a, b 는 0이 아닌 정수여야 한다. a 가 ±1이면 1을 적어야 하는지 헷갈리므로 유형을 지을 때 ±1을 피한다. 기울기가 분수인 답은 고르기로 낸다.
  // facts 에는 calc: [[기울기를 셈하는 식, 0], [y절편을 셈하는 식, 1]] 을 적는다.
  function lineAns(text, a, b, o) {
    if (!Number.isInteger(a) || !Number.isInteger(b) || a === 0 || b === 0) throw new Error('직선의 방정식 답의 기울기와 y절편은 0이 아닌 정수여야 한다');
    return inline(text, `${Y} = {0}${X} {1}`, [{ answer: a, signed: true }, { answer: b, signed: true }], Object.assign({}, o, { shown: fn(a, b) }));
  }
  // 보기 가운데 하나 고르기. rows: [[보기 글, 맞는가], …] — 찾는 보기(want, 기본은 맞는 것)는 하나뿐이어야 한다. o.fixed 이면 차례를 섞지 않는다.
  function pick1(d, text, rows, o, want) {
    const w = want === undefined ? true : want, list = o.fixed ? rows : d.shuffle(rows);
    if (list.filter((r) => r[1] === w).length !== 1) throw new Error('찾는 보기가 하나가 아니다');
    if (new Set(list.map((r) => r[0])).size !== list.length) throw new Error('보기가 겹친다');
    return C(text, list.map((r) => r[0]), list.findIndex((r) => r[1] === w), { figure: o.figure, explain: o.explain, facts: Object.assign({ truth: list.map((r) => r[1]), want: w }, o.facts || {}) });
  }
  // x = p, y = q 꼴의 직선의 방정식 고르기: 맞는 식 하나와, 문자나 수를 바꾼 식 셋. right: ['x' | 'y', 값], other: 헷갈릴 다른 값(절댓값이 달라야 한다).
  function axisPick(d, text, right, other, o) {
    const [letter, v] = right, mk = (L, w) => (L === 'x' ? xEq(w) : yEq(w)), flip = letter === 'x' ? 'y' : 'x';
    return pick1(d, text, [[mk(letter, v), true], [mk(flip, v), false], [mk(letter, other), false], [mk(flip, other), false]], o);
  }

  // ── 좌표평면 ──
  const ITALIC = "font-style:italic;font-family:'MB Math','Times New Roman',serif";
  const HALO = 'paint-order:stroke;stroke:#fff;stroke-width:2.6px;stroke-linejoin:round';
  const OLD_O = /<text x="[^"]*" y="[^"]*" text-anchor="middle" style="font-size:11px;fill:#1f2933;font-weight:600">O<\/text>/;
  // pl(o): 공용 plane 에 이 단원에 필요한 것을 덧댄 좌표평면. plane 의 것(x, y, lines, points, poly, segs, grid, say)을 그대로 받고 아래를 더 받는다.
  //  o.xt, o.yt  수를 적을 눈금(정수의 배열). plane 의 눈금 수(10.5px) 대신 12px 로 적고 흰 테를 둘러 모눈·직선이 글자를 긋지 않게 한다.
  //              적을 자리(x축 아래 / y축 왼쪽)에 직선이 지나가면 축의 반대쪽에 적는다.
  //  o.marks     축 위의 한 자리에 적는 글 [{ ax: 'x' | 'y', at, text, side, shift, italic }] — 절편의 수나 문자, 점선이 닿는 자리의 수.
  //              side: x축이면 'd'(아래)·'u'(위), y축이면 'l'(왼쪽)·'r'(오른쪽). shift: 축을 따라 민 거리(px. x축은 오른쪽이 +, y축은 아래쪽이 +). italic: 문자.
  //  o.tags      그림 속의 이름 [{ x, y, text, at: 'e'·'w'·'n'·'s'·'ne'·'nw'·'se'·'sw', italic }] — 점의 좌표나 이름을 점 둘레에 적는다.
  //  o.label     그림 설명을 통째로 바꾼다(모눈 없이 뜻으로 읽는 그림 — plane 이 지은 설명은 그림에 없는 기울기·절편의 수까지 말한다).
  //  o.oAt       원점의 이름 자리 'l'·'r'(주지 않으면 직선에서 먼 쪽). 원점의 이름도 12px 로 다시 적는다.
  //  직선의 이름(lines 의 name)은 plane 이 적은 것을 지우고 겹치지 않는 자리를 찾아 다시 적는다(아래).
  // cuts(p, q): 두 절편이 p, q 인 직선의 절편 자리에 적을 marks 둘(직선에 걸리지 않게 직선의 반대쪽, 원점 쪽으로 조금 민다). 글은 text: [x쪽, y쪽] 으로 바꿀 수 있다.
  const cuts = (p, q, text) => [
    { ax: 'x', at: p, text: text ? text[0] : sgn(p), side: q > 0 ? 'd' : 'u', shift: p > 0 ? -7 : 7, italic: Boolean(text && /[a-z]/.test(text[0])) },
    { ax: 'y', at: q, text: text ? text[1] : sgn(q), side: p > 0 ? 'l' : 'r', shift: q > 0 ? 4 : -4, italic: Boolean(text && /[a-z]/.test(text[1])) }
  ];
  // foot(x, y): 점 (x, y)에서 두 축에 내린 점선이 닿는 자리에 적을 marks 둘(점의 반대쪽에 적는다)
  const foot = (x, y, text) => [
    { ax: 'x', at: x, text: text ? text[0] : sgn(x), side: y > 0 ? 'd' : 'u', italic: Boolean(text && /[a-z]/.test(text[0])) },
    { ax: 'y', at: y, text: text ? text[1] : sgn(y), side: x > 0 ? 'l' : 'r', italic: Boolean(text && /[a-z]/.test(text[1])) }
  ];
  const COLORS = ['#1d4ed8', '#b42318', '#15803d', '#7c3aed'];   // plane 이 직선에 차례로 입히는 색
  const OLD_NAME = /<text x="[^"]*" y="[^"]*" text-anchor="(?:start|end)" style="font-size:12px;font-weight:700;fill:#[0-9a-f]{6}">[^<]*<\/text>/g;
  function pl(o) {
    const [xlo, xhi] = o.x || [-5, 5], [ylo, yhi] = o.y || [-5, 5], u = Math.min(24, 260 / (xhi - xlo)), W = 42 + (xhi - xlo) * u, HT = 40 + (yhi - ylo) * u;
    const PX = (v) => 16 + (v - xlo) * u, PY = (v) => 24 + (yhi - v) * u;
    const strokes = (o.lines || []).map((l) => (l.x != null ? { v: num(l.x) } : { a: num(l.a), b: l.b == null ? 0 : num(l.b) }));
    // 화면의 한 점(px)에서 가장 가까운 직선까지의 거리(px). skip: 세지 않을 직선의 번호
    const gap = (px, py, skip) => { const x = (px - 16) / u + xlo, y = yhi - (py - 24) / u; let best = 99; strokes.forEach((s, k) => { if (k !== skip) best = Math.min(best, (s.v != null ? Math.abs(x - s.v) : Math.abs(s.a * x - y + s.b) / Math.hypot(s.a, 1)) * u); }); return best; };
    const wide = (s) => String(s).replace(/<[^>]+>/g, '').length * 6.6;
    const placed = [];   // 적은 글의 자리 [가운데 x, 가운데 y, 반너비] — 직선의 이름을 놓을 때 피한다.
    const txt = (x, y, anchor, s, css) => { const half = wide(s) / 2; placed.push([anchor === 'middle' ? x : anchor === 'end' ? x - half : x + half, y - 4.2, half]); return `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${anchor}" style="font-size:12px;font-weight:600;fill:#1f2933;${HALO}${css ? ';' + css : ''}">${s}</text>`; };
    let extra = '';
    // 자리를 정해 주지 않은 글(눈금 수)은 직선에서 먼 쪽에 적고, 두 쪽이 모두 직선에 걸리면(skip) 적지 않는다.
    const onX = (v, s, where, shift, css, skip) => { const x = PX(v) + (shift || 0), dn = gap(x, PY(0) + 9.5) >= 8, up = gap(x, PY(0) - 9.5) >= 8; if (skip && !dn && !up) return; extra += txt(x, PY(0) + ((where ? where === 'd' : dn || !up) ? 14 : -5), 'middle', s, css); };
    const onY = (v, s, where, shift, css, skip) => { const y = PY(v) + (shift || 0), w = wide(s), lf = gap(PX(0) - 5 - w / 2, y) >= 8, rt = gap(PX(0) + 5 + w / 2, y) >= 8; if (skip && !lf && !rt) return; const left = where ? where === 'l' : lf || !rt; extra += txt(PX(0) + (left ? -5 : 5), y + 4.2, left ? 'end' : 'start', s, css); };
    for (const v of o.xt || []) onX(v, sgn(v), '', 0, '', true);
    for (const v of o.yt || []) onY(v, sgn(v), '', 0, '', true);
    for (const m of o.marks || []) (m.ax === 'x' ? onX : onY)(num(m.at), m.text, m.side, m.shift, m.italic ? ITALIC + ';font-size:13.5px' : '');
    const AT = { e: [8, 4.5, 'start'], w: [-8, 4.5, 'end'], n: [0, -8, 'middle'], s: [0, 17, 'middle'], ne: [6, -6, 'start'], nw: [-6, -6, 'end'], se: [6, 15, 'start'], sw: [-6, 15, 'end'] };
    for (const t of o.tags || []) { const [dx, dy, anchor] = AT[t.at || 'ne']; extra += txt(PX(num(t.x)) + dx, PY(num(t.y)) + dy, anchor, t.text, (t.italic ? ITALIC + ';' : '') + 'font-size:13px'); }
    const oAt = o.oAt || (gap(PX(0) - 8, PY(0) + 9) >= gap(PX(0) + 8, PY(0) + 9) ? 'l' : 'r');
    extra += txt(PX(0) + (oAt === 'l' ? -8 : 8), PY(0) + 13.5, 'middle', 'O');
    // 직선의 이름: plane 은 직선의 끝에 적어서 축의 이름이나 다른 직선에 걸리기도 한다. 그 글은 지우고,
    // 그려진 선분의 두 끝 가까이(끝에서 12px·28px 들어온 곳의 양옆) 가운데 다른 직선·축·축의 이름·이미 적은 글·점에서 가장 먼 자리에 다시 적는다.
    (o.lines || []).forEach((line, k) => {
      if (!line.name) return;
      const s = strokes[k], half = wide(line.name) / 2 + 1; let e1, e2;
      if (s.v != null) { e1 = [PX(s.v), PY(yhi)]; e2 = [PX(s.v), PY(ylo)]; } else {
        let lo = xlo, hi = xhi;
        if (s.a !== 0) { const p = (ylo - s.b) / s.a, q = (yhi - s.b) / s.a; lo = Math.max(lo, Math.min(p, q)); hi = Math.min(hi, Math.max(p, q)); }
        e1 = [PX(lo), PY(s.a * lo + s.b)]; e2 = [PX(hi), PY(s.a * hi + s.b)];
      }
      const len = Math.hypot(e2[0] - e1[0], e2[1] - e1[1]), dx = (e2[0] - e1[0]) / len, dy = (e2[1] - e1[1]) / len, off = half * Math.abs(dy) + 6.5 * Math.abs(dx) + 4;
      let best = null;
      for (const [e, dir] of [[e2, -1], [e1, 1]]) for (const along of [12, 28]) for (const sd of [1, -1]) {
        const cx = e[0] + dir * dx * along - dy * sd * off, cy = e[1] + dir * dy * along + dx * sd * off;
        if (cx - half < 3 || cx + half > W - 3 || cy < 9 || cy > HT - 6) continue;
        let room = Math.min(gap(cx, cy, k) - 8, Math.abs(cy - PY(0)) - 9, Math.abs(cx - PX(0)) - half - 4, Math.hypot(cx - PX(xhi) - 21, cy - PY(0)) - 16, Math.hypot(cx - PX(0) - 9, cy - PY(yhi) + 13) - 16);
        for (const [tx0, ty0, th] of placed) room = Math.min(room, Math.max(Math.abs(cx - tx0) - half - th, Math.abs(cy - ty0) - 13));
        for (const pnt of o.points || []) room = Math.min(room, Math.hypot(cx - PX(num(pnt.x)), cy - PY(num(pnt.y))) - 12);
        if (!best || room > best.room + 0.5) best = { room, cx, cy };
      }
      if (best) extra += txt(best.cx, best.cy + 4.2, 'middle', line.name, `fill:${COLORS[k % COLORS.length]};font-weight:700`);
    });
    let svg = plane(Object.assign({}, o, { ticks: 'none' })).replace(OLD_O, '').replace(OLD_NAME, '');
    if (o.label) svg = svg.replace(/aria-label="[^"]*"/, `aria-label="${o.label}"`);
    return svg.replace('</svg>', extra + '</svg>');
  }
  const GRID = [-4, -2, 2, 4];
  // 모눈 좌표평면(−5~5)에 직선들을 그린다.
  const board = (o) => pl(Object.assign({ x: [-5, 5], y: [-5, 5], xt: GRID, yt: GRID }, o));
  // 모눈 없는 좌표평면: 그릴 점들이 넉넉히 들어가게 범위를 잡는다(pts: 꼭 보여야 하는 점들).
  function bare(pts, o) {
    const xs = pts.map((p) => num(p[0])).concat([0]), ys = pts.map((p) => num(p[1])).concat([0]);
    // 가로가 10칸을 넘으면 그림이 휴대폰 문항 칸보다 넓어져 줄어든다(글씨가 12px 아래로 내려간다). 넓은 그림은 여백을 1칸으로 줄인다.
    const span = (list) => { const lo = Math.floor(Math.min(...list)), hi = Math.ceil(Math.max(...list)), pad = hi - lo + 4 <= 10 ? 2 : 1; return [lo - pad, hi + pad]; };
    const x = span(xs), y = span(ys);
    return pl(Object.assign({ x, y, grid: false }, o));
  }
  // mini(o): 보기로 늘어놓는 작은 좌표평면 — 직선 하나와, 두 축과 만나는 곳의 수. o: { p x절편, q y절편, name 그림 설명 앞에 붙는 이름(㉠ …) }
  function mini(o) {
    const R = 5, u = 11, padL = 8, padR = 14, padT = 16, padB = 8, W = padL + padR + 2 * R * u, H = padT + padB + 2 * R * u;
    const PX = (v) => f1(padL + (v + R) * u), PY = (v) => f1(padT + (R - v) * u), { p, q } = o, m = -q / p, sp = Math.sign(p), sq = Math.sign(q);
    const ends = [(R - q) / m, (-R - q) / m].sort((s, t) => s - t), lo = Math.max(-R, ends[0]), hi = Math.min(R, ends[1]);
    const txt = (x, y, anchor, s) => `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${anchor}" style="font-size:12px;font-weight:600;fill:#1f2933;${HALO}">${s}</text>`;
    // y축의 이름은 직선이 위쪽 끝으로 빠져나가는 쪽의 반대쪽에 적는다.
    const ySide = (R - q) / m > 0 ? -1 : 1;
    const out = `<line class="mb-axis" x1="${PX(-R) - 4}" y1="${PY(0)}" x2="${PX(R) + 5}" y2="${PY(0)}"/><path d="M${PX(R) + 10} ${PY(0)}l-6 -3v6z" style="fill:#1f2933"/>`
      + `<line class="mb-axis" x1="${PX(0)}" y1="${PY(-R) + 4}" x2="${PX(0)}" y2="${PY(R) - 5}"/><path d="M${PX(0)} ${PY(R) - 10}l-3 6h6z" style="fill:#1f2933"/>`
      + `<text x="${PX(R) + 11}" y="${PY(0) + 13}" text-anchor="middle" style="font-size:12.5px;fill:#1f2933;${ITALIC}">x</text><text x="${PX(0) + ySide * 8}" y="${PY(R) - 4}" text-anchor="middle" style="font-size:12.5px;fill:#1f2933;${ITALIC}">y</text>`
      + `<line x1="${PX(lo)}" y1="${PY(m * lo + q)}" x2="${PX(hi)}" y2="${PY(m * hi + q)}" style="stroke:#1d4ed8;stroke-width:1.8"/>`
      + txt(PX(p) - sp * 7, PY(0) + (sq > 0 ? 12.5 : -4.5), 'middle', sgn(p)) + txt(PX(0) - sp * 6, PY(q) + sq * 2 + 4.2, sp > 0 ? 'end' : 'start', sgn(q)) + txt(PX(0) - sp * 6.5, PY(0) + 11.5, 'middle', 'O');
    return `<svg class="mb-geo" viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="좌표평면${o.name ? ' ' + o.name : ''}: 직선이 x축과 ${sgn(p)}인 점에서, y축과 ${sgn(q)}인 점에서 만난다.">${out}</svg>`;
  }

  // ── 수 고르기 ──
  // 기울기가 분수인 직선에 쓰는 기약분수(분자, 분모)
  const FRS = [[1, 2], [3, 2], [1, 3], [2, 3], [4, 3], [1, 4], [3, 4], [2, 5], [3, 5]];
  // 일차방정식을 y 에 대하여 푸는 풀이 글(y의 계수가 1이면 나누는 말을 적지 않는다)
  const solved = (l, m, k) => (l.b === 1 ? `${gen(l)}에서 ${fn(m, k)}이다.` : `${gen(l)}에서 ${nb(sum([[l.b, Y]]) + ' = ' + sum([[-l.a, X], [-l.c, '']]))}이다. 양변을 ${iq(l.b)}${tl(l.b, '으로/로')} 나누면 ${fn(m, k)}이다.`);
  // 기울기가 정수 m, y절편이 k 인 직선을 계수가 정수인 일차방정식으로(x의 계수는 양수, y의 계수의 크기는 t)
  const intLine = (m, k, t) => { const b = m > 0 ? -t : t; return { a: -m * b, b, c: -k * b }; };

  B.addUnit({
    id: '8-1-6', grade: 8, semester: 1, no: 6, title: '일차함수와 일차방정식의 관계', version: 1,
    groups: [
      {
        id: 'eq', title: '일차방정식과 일차함수', standard: STD1,
        types: [
          T('eq-to-func', '일차방정식을 y = ax + b 꼴로 나타내기', '①1', (d) => {
            const m = pm(d) * d.int(2, 5), k = nz(d, -7, 7), l = intLine(m, k, d.pick([1, 2, 2, 3]));
            return lineAns(`일차방정식 ${gen(l)}에서 ${Y}를 ${X}의 식으로 나타내시오.`, m, k, {
              explain: solved(l, m, k),
              facts: { calc: [[`-${jn(l.a)}/${jn(l.b)}`, 0], [`-${jn(l.c)}/${jn(l.b)}`, 1]], unseen: un(l.a, l.b, l.c) }
            });
          }),
          T('eq-same-func', '그래프가 같은 일차방정식과 일차함수 찾기', '①1·2', (d, n) => {
            // 기울기가 분수인 식. 틀린 보기: 기울기의 부호를 놓침, 상수항의 부호를 놓침, 상수항만 나누지 않음(첫째) / y의 계수의 부호, 상수항의 부호, x와 y의 계수를 바꿈(둘째)
            const [p, q] = d.pick(FRS), s = pm(d), k = nz(d, -5, 5), m = Q(s * p, q), l = { a: p, b: -s * q, c: s * q * k };
            if (n === 0) {
              return pick1(d, `다음 일차함수 중 그 그래프가 일차방정식 ${gen(l)}의 그래프와 같은 것은?`, [[fn(m, k), true], [fn(qneg(m), k), false], [fn(m, -k), false], [fn(m, q * k), false]], {
                explain: solved(l, m, k),
                facts: { rule: 'same-func' }
              });
            }
            const same = (v) => qcmp(slope(v), m) === 0 && qcmp(yint(v), Q(k)) === 0;
            const cands = [l, { a: l.a, b: -l.b, c: l.c }, { a: l.a, b: l.b, c: -l.c }, { a: q, b: -s * p, c: l.c }];
            return pick1(d, `다음 일차방정식 중 그 그래프가 일차함수 ${fn(m, k)}의 그래프와 같은 것은?`, cands.map((v) => [gen(v), same(v)]), {
              explain: `${fn(m, k)}의 양변에 ${q}${tl(q, '을/를')} 곱하면 ${nb(sum([[q, Y]]) + ' = ' + sum([[s * p, X], [q * k, '']]))}이다. 모든 항을 한 변으로 옮겨 정리하면 ${gen(l)}이다.`,
              facts: { rule: 'same-eq' }
            });
          }, { count: 2 }),
          T('eq-slope-intercepts', '일차방정식의 그래프의 기울기와 두 절편', '①3', (d) => {
            const m = pm(d) * d.int(2, 3), p = nz(d, -4, 4), k = -m * p, l = intLine(m, k, d.pick([1, 1, 2]));
            return M(`일차방정식 ${gen(l)}의 그래프의 기울기, ${X}절편, ${Y}절편을 각각 구하시오.`, [{ label: '기울기', answer: m, signed: true }, { label: `${X}절편`, answer: p, signed: true }, { label: `${Y}절편`, answer: k, signed: true }], {
              explain: `${gen(l)}에서 ${fn(m, k)}이므로 기울기는 ${iq(m)}, ${Y}절편은 ${iq(k)}이다. ${nb(Y + ' = 0')}을 대입하면 ${X} = ${iq(p)}이므로 ${X}절편은 ${iq(p)}이다.`,
              facts: { calc: [[`-${jn(l.a)}/${jn(l.b)}`, 0], [`-${jn(l.c)}/${jn(l.a)}`, 1], [`-${jn(l.c)}/${jn(l.b)}`, 2]], unseen: un(l.a, l.b, l.c) }
            });
          }),
          T('eq-parallel-pick', '기울기로 평행한 직선 가리기', '①4', (d, n) => {
            if (n === 0) {
              // 틀린 보기: 기울기의 부호가 다름, x와 y의 계수를 바꿈, y의 계수만 다름. 맞는 보기는 y절편이 달라 일치하지 않는다.
              const [p, q] = d.pick(FRS), s = pm(d), k = nz(d, -5, 5), m = Q(s * p, q), q2 = q === 2 ? 4 : q + 1;
              const cs = d.until(() => [nz(d, -7, 7), nz(d, -7, 7), nz(d, -7, 7), nz(d, -7, 7)], (v) => v[0] !== s * q * k);
              const cands = [{ a: p, b: -s * q, c: cs[0] }, { a: p, b: s * q, c: cs[1] }, { a: q, b: -s * p, c: cs[2] }, { a: p, b: -s * q2, c: cs[3] }];
              return pick1(d, `다음 일차방정식 중 그 그래프가 일차함수 ${fn(m, k)}의 그래프와 평행한 것은?`, cands.map((v) => [gen(v), qcmp(slope(v), m) === 0 && qcmp(yint(v), Q(k)) !== 0]), {
                explain: `기울기가 같고 ${Y}절편이 다른 두 직선은 서로 평행하다. ${gen(cands[0])}에서 ${fn(m, yint(cands[0]))}이므로 기울기가 ${tj(m, '으로/로')} 같고 ${Y}절편은 다르다.`,
                facts: { rule: 'parallel-pick' }
              });
            }
            // 정리되지 않은 식 넷 가운데 기울기가 다른 하나. 다른 하나는 기울기의 부호만 다르다.
            const m = pm(d) * d.int(2, 4), t = d.pick([2, 3]), ks = d.until(() => [nz(d, -6, 6), nz(d, -6, 6), nz(d, -6, 6), nz(d, -6, 6)], (v) => new Set(v).size === 4);
            const forms = [
              (mm, kk) => (mm > 0 ? eq0([mm, X], [-1, Y], [kk, '']) : eq0([-mm, X], [1, Y], [-kk, ''])),
              (mm, kk) => eqR([[t * mm, X]], [[t, Y], [-t * kk, '']]),
              (mm, kk) => eqR([[t, Y]], [[t * mm, X], [t * kk, '']]),
              (mm, kk) => (mm > 0 ? eqR([[mm, X], [-1, Y]], -kk) : eqR([[-mm, X], [1, Y]], kk))
            ];
            const order = d.shuffle([0, 1, 2, 3]), odd = d.int(0, 3), slopes = order.map((f, i) => (i === odd ? -m : m));
            return pick1(d, '다음 일차방정식 중 그 그래프의 기울기가 나머지 셋과 다른 것은?', order.map((f, i) => [forms[f](slopes[i], ks[i]), i === odd]), {
              fixed: true,
              explain: `${Y}를 ${X}의 식으로 나타내면 차례로 ${slopes.map((s, i) => fn(s, ks[i])).join(', ')}이다. 기울기가 ${iq(-m)}인 것 하나만 나머지와 다르다.`,
              facts: { rule: 'slope-odd' }
            });
          }, { count: 2 }),
          T('eq-point-on', '일차방정식의 그래프 위의 점 가리기', '①5', (d, n) => {
            if (n === 0) {
              const want = d.bool();
              const made = d.until(() => {
                const l = { a: d.int(1, 4), b: nz(d, -4, 4), c: nz(d, -6, 6) }, on = [];
                for (let x = -6; x <= 6; x += 1) { const top = -(l.a * x + l.c); if (top % l.b === 0 && Math.abs(top / l.b) <= 6) on.push([x, top / l.b]); }
                // 그래프 위에 없는 점: 부호를 놓친 점, x와 y의 자리를 바꾼 점, 하나 어긋난 점
                const off = [];
                for (const [x, y] of on) for (const c of [[x, -y], [y, x], [-x, y], [x, y + 1]]) if (!onLine(l, c[0], c[1]) && Math.abs(c[1]) <= 7 && !off.some((v) => v[0] === c[0] && v[1] === c[1])) off.push(c);
                return { l, on, off };
              }, (v) => gcd(v.l.a, v.l.b) === 1 && v.on.length >= 3 && v.off.length >= 3);
              const l = made.l, on = d.shuffle(made.on), off = d.shuffle(made.off), rows = d.shuffle(want ? [on[0]].concat(off.slice(0, 3)) : on.slice(0, 3).concat([off[0]])), hit = rows.find((r) => onLine(l, r[0], r[1]) === want);
              return C(`다음 중 일차방정식 ${gen(l)}의 그래프 위의 점${want ? '은' : '이 아닌 것은'}?`, rows.map((r) => pt(r[0], r[1])), rows.indexOf(hit), {
                explain: `${X}좌표와 ${Y}좌표를 대입하여 등식이 성립하면 그래프 위의 점이다. ${X} = ${iq(hit[0])}, ${Y} = ${iq(hit[1])}${tl(hit[1], '을/를')} 대입하면 좌변의 값이 ${iq(l.a * hit[0] + l.b * hit[1] + l.c)}이므로 점 ${ptj(hit[0], hit[1], '은/는')} 그래프 위의 점${want ? '이다' : '이 아니다'}.`,
                facts: { claimed: rows.map((r) => [`${jn(l.a)}*${jn(r[0])}+${jn(l.b)}*${jn(r[1])}+${jn(l.c)}`, 0]), claimedWant: want, unseen: un(l.a, l.b), rule: 'point-on' }
              });
            }
            // 지나는 점으로 수 a 를 먼저 구한 뒤, 그 그래프 위의 점을 찾는다.
            const made = d.until(() => {
              const a = nz(d, -4, 4), b = nz(d, -4, 4), x0 = nz(d, -4, 4), y0 = nz(d, -5, 5), l = { a, b, c: -(a * x0 + b * y0) }, on = [], off = [];
              for (let x = -6; x <= 6; x += 1) { const top = -(l.a * x + l.c); if (x !== x0 && top % l.b === 0 && Math.abs(top / l.b) <= 6) on.push([x, top / l.b]); }
              for (const [x, y] of on.concat([[x0, y0]])) for (const c of [[x, -y], [y, x], [-x, y]]) if (!onLine(l, c[0], c[1]) && !off.some((v) => v[0] === c[0] && v[1] === c[1])) off.push(c);
              return { l, x0, y0, on, off };
            }, (v) => gcd(v.l.a, v.l.b) === 1 && v.l.c !== 0 && Math.abs(v.l.c) <= 12 && v.on.length >= 1 && v.off.length >= 3);
            const { l, x0, y0 } = made, good = d.pick(made.on), rows = d.shuffle([good].concat(d.shuffle(made.off).slice(0, 3)));
            return C(`일차방정식 ${eq0(Lt(A + X), [l.b, Y], [l.c, ''])}의 그래프가 점 ${ptj(x0, y0, '을/를')} 지날 때, 다음 중 이 그래프 위의 점은?`, rows.map((r) => pt(r[0], r[1])), rows.indexOf(good), {
              explain: `${X} = ${iq(x0)}, ${Y} = ${iq(y0)}${tl(y0, '을/를')} 대입하면 ${A} = ${iq(l.a)}이므로 일차방정식은 ${gen(l)}이다. ${X} = ${iq(good[0])}, ${Y} = ${iq(good[1])}${tl(good[1], '을/를')} 대입하면 등식이 성립하므로 점 ${ptj(good[0], good[1], '이/가')} 이 그래프 위의 점이다.`,
              facts: { claimed: rows.map((r) => [`(-(${jn(l.b)}*${jn(y0)}+${jn(l.c)})/${jn(x0)})*${jn(r[0])}+${jn(l.b)}*${jn(r[1])}+${jn(l.c)}`, 0]), claimedWant: true, unseen: un(l.b), rule: 'point-on-after' }
            });
          }, { count: 2 }),
          T('eq-coef-from-point', '그래프가 지나는 점으로 일차방정식의 수 구하기', '①6', (d) => {
            // 구하는 수 a 는 x의 계수이거나 y의 계수이다.
            const [onX, al, o, x0, y0] = d.until(() => [d.bool(), nz(d, -5, 5), nz(d, -4, 4), nz(d, -4, 4), nz(d, -5, 5)], ([w, a, k, x, y]) => { const c = w ? -(a * x + k * y) : -(k * x + a * y); return c !== 0 && Math.abs(c) <= 15; });
            const c = onX ? -(al * x0 + o * y0) : -(o * x0 + al * y0), eq = onX ? eq0(Lt(A + X), [o, Y], [c, '']) : eq0([o, X], Lt(A + Y), [c, '']);
            const at = onX ? x0 : y0, rest = (onX ? o * y0 : o * x0) + c;
            return ansV(`일차방정식 ${eq}의 그래프가 점 ${ptj(x0, y0, '을/를')} 지날 때, 수 ${A}의 값은?`, Q(al), 'int', {
              explain: `${eq}에 ${X} = ${iq(x0)}, ${Y} = ${iq(y0)}${tl(y0, '을/를')} 대입하면 ${nb(sum([Lt((Math.abs(at) === 1 ? '' : Math.abs(at)) + A, Math.sign(at)), [rest, '']]) + ' = 0')}이므로 ${A} = ${iq(al)}이다.`,
              facts: { value: onX ? `-(${jn(o)}*${jn(y0)}+${jn(c)})/${jn(x0)}` : `-(${jn(o)}*${jn(x0)}+${jn(c)})/${jn(y0)}`, unseen: un(o) }
            });
          }),
          T('eq-letter-point', '좌표가 문자로 된 식인 점이 그래프 위에 있을 때 문자의 값', '①6', (d) => {
            // 점 (ek, pk + r)가 ax + by + c = 0 위에 있다: (ae + bp)k = −(br + c)
            const v = d.until(() => { const a = d.int(1, 4), b = nz(d, -3, 3), e = pm(d), p = nz(d, -3, 3), r = nz(d, -6, 6), k = nz(d, -5, 5); return { a, b, e, p, r, k, c: -k * (a * e + b * p) - b * r }; }, (w) => w.a * w.e + w.b * w.p !== 0 && w.c !== 0 && Math.abs(w.c) <= 12);
            const l = { a: v.a, b: v.b, c: v.c }, second = sum([Lt((Math.abs(v.p) === 1 ? '' : Math.abs(v.p)) + K, Math.sign(v.p)), [v.r, '']]), first = (v.e < 0 ? MINUS : '') + K, den = v.a * v.e + v.b * v.p;
            return ansV(`일차방정식 ${gen(l)}의 그래프가 점 ${nb(`(${first}, ${second})`)}${tl(v.r, '을/를')} 지날 때, ${K}의 값은?`, Q(v.k), 'int', {
              explain: `${gen(l)}에 ${X} = ${first}, ${Y} = ${nb(second)}${tl(v.r, '을/를')} 대입하여 정리하면 ${nb(sum([Lt((Math.abs(den) === 1 ? '' : Math.abs(den)) + K, Math.sign(den)), [v.b * v.r + v.c, '']]) + ' = 0')}이므로 ${K} = ${iq(v.k)}이다.`,
              facts: { value: `-(${jn(v.b)}*${jn(v.r)}+${jn(v.c)})/(${jn(v.a)}*${jn(v.e)}+${jn(v.b)}*${jn(v.p)})`, unseen: [1] }
            });
          }),
          T('eq-two-points-coef', '두 점을 지나는 그래프에서 계수와 좌표를 차례로 구하기', '①6', (d) => {
            // kx + by = c 가 (x1, k), (a, y2)를 지난다: k(x1 + b) = c 에서 k 를, ka + b·y2 = c 에서 a 를 구한다.
            const [k, b, x1, a, y2] = d.until(() => [nz(d, -4, 4), nz(d, -4, 4), nz(d, -4, 4), nz(d, -7, 7), nz(d, -6, 6)], ([kk, bb, xx, aa, yy]) => xx + bb !== 0 && kk * aa + bb * yy === kk * (xx + bb) && aa !== xx);
            const c = k * (x1 + b), eq = eqR([Lt(K + X), [b, Y]], c);
            return M(`일차방정식 ${eq}의 그래프가 두 점 ${pt(x1, K)}, ${ptj(A, y2, '을/를')} 지날 때, ${K}, ${A}의 값을 각각 구하시오.`, [{ label: `${K} =`, answer: k, signed: true }, { label: `${A} =`, answer: a, signed: true }], {
              explain: `${X} = ${iq(x1)}, ${Y} = ${K}를 대입하면 ${nb(sum([Lt((Math.abs(x1 + b) === 1 ? '' : Math.abs(x1 + b)) + K, Math.sign(x1 + b))]) + ' = ' + iq(c))}이므로 ${K} = ${iq(k)}이다. ${eqR([[k, X], [b, Y]], c)}에 ${X} = ${A}, ${Y} = ${iq(y2)}${tl(y2, '을/를')} 대입하면 ${A} = ${iq(a)}이다.`,
              facts: { calc: [[`${jn(c)}/(${jn(x1)}+${jn(b)})`, 0], [`(${jn(c)}-${jn(b)}*${jn(y2)})/(${jn(c)}/(${jn(x1)}+${jn(b)}))`, 1]], unseen: un(b) }
            });
          }),
          T('eq-missing-coords', '그래프 위의 두 점에서 빠진 좌표 구하기', '심3', (d) => {
            const [p, q, a, y1, t] = d.until(() => [d.int(1, 5), nz(d, -5, 5), nz(d, -5, 5), nz(d, -5, 5), nz(d, -2, 2)], ([pp, qq, aa, yy, tt]) => pp !== Math.abs(qq) && Math.abs(aa + qq * tt) <= 9 && Math.abs(yy - pp * tt) <= 9 && aa + qq * tt !== 0 && yy - pp * tt !== 0 && Math.abs(pp * aa + qq * yy) <= 20);
            const r = p * a + q * y1, x2 = a + q * t, b = y1 - p * t, eq = eqR([[p, X], [q, Y]], r);
            return M(`두 점 ${pt(A, y1)}, ${pt(x2, Bv)}가 일차방정식 ${eq}의 그래프 위에 있을 때, ${A}, ${Bv}의 값을 각각 구하시오.`, [{ label: `${A} =`, answer: a, signed: true }, { label: `${Bv} =`, answer: b, signed: true }], {
              explain: `${eq}에 ${X} = ${A}, ${Y} = ${iq(y1)}${tl(y1, '을/를')} 대입하면 ${A} = ${iq(a)}이다. ${X} = ${iq(x2)}, ${Y} = ${Bv}를 대입하면 ${Bv} = ${iq(b)}이다.`,
              facts: { calc: [[`(${jn(r)}-${jn(q)}*${jn(y1)})/${jn(p)}`, 0], [`(${jn(r)}-${jn(p)}*${jn(x2)})/${jn(q)}`, 1]], unseen: un(p, q) }
            });
          }),
          T('eq-coef-then', '지나는 점으로 수를 구한 뒤 기울기·y절편 구하기', '①7 심4', (d, n) => {
            if (n === 0) {
              // ax + by + c = 0 (a 를 모른다). 기울기 −a/b 가 정수 m 이 되게 짓는다.
              const [m, b, x0, y0] = d.until(() => [pm(d) * d.int(2, 4), pm(d) * d.int(2, 3), nz(d, -4, 4), nz(d, -5, 5)], ([mm, bb, xx, yy]) => { const c = -(-mm * bb * xx + bb * yy); return c !== 0 && Math.abs(c) <= 16; });
              const a = -m * b, c = -(a * x0 + b * y0), eq = eq0(Lt(A + X), [b, Y], [c, '']);
              return ansV(`일차방정식 ${eq}의 그래프가 점 ${ptj(x0, y0, '을/를')} 지날 때, 이 그래프의 기울기는?`, Q(m), 'int', {
                explain: `${X} = ${iq(x0)}, ${Y} = ${iq(y0)}${tl(y0, '을/를')} 대입하면 ${A} = ${iq(a)}이다. ${gen({ a, b, c })}에서 ${fn(m, yint({ a, b, c }))}이므로 기울기는 ${iq(m)}이다.`,
                facts: { value: `-(-(${jn(b)}*${jn(y0)}+${jn(c)})/${jn(x0)})/${jn(b)}` }
              });
            }
            // ax − ky + c = 0 (k 를 모른다). y절편 c/k 가 정수 w 가 되게 짓는다: c = kw, y0 = w + x0·t, a = kt.
            const [k, w, x0, t] = d.until(() => [nz(d, -4, 4), nz(d, -5, 5), nz(d, -4, 4), nz(d, -3, 3)], ([kk, ww, xx, tt]) => ww + xx * tt !== 0 && Math.abs(ww + xx * tt) <= 9 && Math.abs(kk * tt) <= 9 && Math.abs(kk * ww) <= 16 && Math.abs(kk) > 1);
            const y0 = w + x0 * t, a = k * t, c = k * w, eq = eq0([a, X], Lt(K + Y, -1), [c, '']);
            return ansV(`일차방정식 ${eq}의 그래프가 점 ${ptj(x0, y0, '을/를')} 지날 때, 이 그래프의 ${Y}절편은?`, Q(w), 'int', {
              explain: `${X} = ${iq(x0)}, ${Y} = ${iq(y0)}${tl(y0, '을/를')} 대입하면 ${K} = ${iq(k)}이다. ${eq0([a, X], [-k, Y], [c, ''])}에 ${nb(X + ' = 0')}을 대입하면 ${Y} = ${iq(w)}이므로 ${Y}절편은 ${iq(w)}이다.`,
              facts: { value: `${jn(c)}/((${jn(a)}*${jn(x0)}+${jn(c)})/${jn(y0)})`, unseen: un(a) }
            });
          }, { count: 2 }),
          T('eq-coef-from-intercepts', '두 절편으로 일차방정식의 수 구하기', '①8', (d) => {
            const [a, q] = d.until(() => [nz(d, -3, 3), nz(d, -4, 4)], ([u, v]) => Math.abs(u * v) <= 9), p = a * q, eq = eq0([1, X], Lt(A + Y), Lt(Bv));
            return M(`일차방정식 ${eq}의 그래프의 ${X}절편이 ${iq(p)}, ${Y}절편이 ${iq(q)}일 때, 수 ${A}, ${Bv}의 값을 각각 구하시오.`, [{ label: `${A} =`, answer: a, signed: true }, { label: `${Bv} =`, answer: -p, signed: true }], {
              explain: `${X}절편이 ${iq(p)}이므로 ${X} = ${iq(p)}, ${nb(Y + ' = 0')}을 대입하면 ${Bv} = ${iq(-p)}이다. ${Y}절편이 ${iq(q)}이므로 ${nb(X + ' = 0')}, ${Y} = ${iq(q)}${tl(q, '을/를')} 대입하면 ${nb(sum([Lt((Math.abs(q) === 1 ? '' : Math.abs(q)) + A, Math.sign(q)), [-p, '']]) + ' = 0')}에서 ${A} = ${iq(a)}이다.`,
              facts: { calc: [[`${jn(p)}/${jn(q)}`, 0], [`-${jn(p)}`, 1]] }
            });
          }),
          T('eq-coef-from-slope', '기울기와 절편으로 일차방정식의 수 구하기', '①9', (d, n) => {
            if (n === 0) {
              const bc = d.pick([2, 3, 4, 5]), a = d.until(() => nz(d, -7, 7), (v) => gcd(v, bc) === 1), p = nz(d, -4, 4), m = Q(-a, bc), eq = eq0(Lt(A + X), [bc, Y], Lt(Bv));
              return M(`일차방정식 ${eq}의 그래프의 기울기가 ${tx(m)}이고 ${X}절편이 ${iq(p)}일 때, 수 ${A}, ${Bv}의 값을 각각 구하시오.`, [{ label: `${A} =`, answer: a, signed: true }, { label: `${Bv} =`, answer: -a * p, signed: true }], {
                explain: `${eq}에서 ${nb(`${Y} = ${MINUS}${frac(A, bc)}${X} ${MINUS} ${frac(Bv, bc)}`)}이므로 ${nb(`${MINUS}${frac(A, bc)} = ${tx(m)}`)}에서 ${A} = ${iq(a)}이다. ${X}절편이 ${iq(p)}이므로 ${X} = ${iq(p)}, ${nb(Y + ' = 0')}을 대입하면 ${Bv} = ${iq(-a * p)}이다.`,
                facts: { calc: [[`-(${jn(m.p)}*${bc})/${m.q}`, 0], [`${jn(m.p)}*${bc}*${jn(p)}/${m.q}`, 1]] }
              });
            }
            // 기울기를 「x의 값이 dx만큼 증가할 때 y의 값의 변화」로 준다.
            const a = pm(d) * d.int(2, 4), dx = d.pick([1, 2, 3]), dy = Math.abs(a) * dx, w = nz(d, -4, 4), c = -a * w, eq = eq0(Lt(A + X), [-1, Y], [c, '']);
            return ansV(`일차방정식 ${eq}의 그래프에서 ${X}의 값이 ${dx}만큼 증가할 때 ${Y}의 값은 ${dy}만큼 ${a > 0 ? '증가' : '감소'}한다. 이 그래프의 ${X}절편은?`, Q(w), 'int', {
              explain: `${eq}에서 ${nb(`${Y} = ${A}${X} ${c < 0 ? MINUS : '+'} ${Math.abs(c)}`)}이므로 기울기는 ${A}이다. ${X}의 값이 ${dx}만큼 증가할 때 ${Y}의 값이 ${dy}만큼 ${a > 0 ? '증가' : '감소'}하므로 ${dx === 1 ? `${A} = ${iq(a)}` : `${A} = ${a > 0 ? '' : MINUS}${frac(dy, dx)} = ${iq(a)}`}이다. ${fn(a, c)}에 ${nb(Y + ' = 0')}을 대입하면 ${X} = ${iq(w)}이므로 ${X}절편은 ${iq(w)}이다.`,
              facts: { value: `-${jn(c)}/(${a > 0 ? '' : '-'}${dy}/${dx})` }
            });
          }, { count: 2 }),
          T('eq-pick-by-intercepts', '두 절편이 주어진 일차방정식 고르기', '①10', (d) => {
            // 틀린 보기: x와 y의 계수를 바꿈, 상수항의 부호를 놓침, y의 계수의 부호를 놓침
            const [p, q] = d.until(() => [nz(d, -6, 6), nz(d, -5, 5)], ([u, v]) => Math.abs(u) !== Math.abs(v) && Math.abs(u) > 1);
            const cands = [norm(q, p, -p * q), norm(p, q, -p * q), norm(q, p, p * q), norm(q, -p, -p * q)], ok = (l) => qcmp(xint(l), Q(p)) === 0 && qcmp(yint(l), Q(q)) === 0;
            return pick1(d, `다음 일차방정식 중 그래프의 ${X}절편이 ${iq(p)}이고 ${Y}절편이 ${iq(q)}인 것은?`, cands.map((l) => [gen(l), ok(l)]), {
              explain: `${nb(Y + ' = 0')}을 대입하여 ${X}절편을, ${nb(X + ' = 0')}을 대입하여 ${Y}절편을 구한다. ${gen(cands[0])}에 ${nb(Y + ' = 0')}을 대입하면 ${X} = ${iq(p)}, ${nb(X + ' = 0')}을 대입하면 ${Y} = ${iq(q)}이다.`
            });
          }),
          T('eq-same-as-func', '일차방정식의 그래프와 일차함수의 그래프가 일치할 때 수 구하기', '①1 심6', (d) => {
            const m = pm(d) * d.int(2, 4), k = nz(d, -5, 5), bc = pm(d) * d.pick([2, 3]), eq = eqR([Lt(A + X), [bc, Y]], Bv), w = Math.abs(bc);
            return M(`일차방정식 ${eq}의 그래프와 일차함수 ${fn(m, k)}의 그래프가 일치할 때, 수 ${A}, ${Bv}의 값을 각각 구하시오.`, [{ label: `${A} =`, answer: -m * bc, signed: true }, { label: `${Bv} =`, answer: k * bc, signed: true }], {
              explain: `${eq}에서 ${nb(`${Y} = ${bc > 0 ? MINUS : ''}${frac(A, w)}${X} ${bc > 0 ? '+' : MINUS} ${frac(Bv, w)}`)}이다. 두 그래프가 일치하려면 기울기와 ${Y}절편이 각각 같아야 하므로 ${nb(`${bc > 0 ? MINUS : ''}${frac(A, w)} = ${iq(m)}`)}, ${nb(`${bc > 0 ? '' : MINUS}${frac(Bv, w)} = ${iq(k)}`)}에서 ${A} = ${iq(-m * bc)}, ${Bv} = ${iq(k * bc)}이다.`,
              facts: { calc: [[`-${jn(m)}*${jn(bc)}`, 0], [`${jn(k)}*${jn(bc)}`, 1]] }
            });
          })
        ]
      },
      {
        id: 'graph', title: '일차방정식의 그래프', standard: STD1,
        types: [
          T('graph-pick-graph', '일차방정식의 그래프 고르기', '①11·12', (d) => {
            // 보기: 바른 그래프, 두 절편을 바꾼 것, y절편의 부호를 놓친 것, x절편의 부호를 놓친 것. 그래프마다 두 축과 만나는 곳에 수를 적었다.
            const [p, q] = d.until(() => [pm(d) * d.int(2, 4), pm(d) * d.int(2, 4)], ([u, v]) => Math.abs(u) !== Math.abs(v));
            const l = byCuts(p, q), cands = [[p, q], [q, p], [p, -q], [-p, q]], order = d.shuffle([0, 1, 2, 3]);
            return C(`다음 ㉠~㉣ 가운데 일차방정식 ${std(l)}의 그래프는?`, LAB.slice(0, 4), order.indexOf(0), {
              figure: picks(order.map((j, i) => mini({ p: cands[j][0], q: cands[j][1], name: LAB[i] }))),
              explain: `${std(l)}에 ${nb(Y + ' = 0')}을 대입하면 ${X} = ${iq(p)}, ${nb(X + ' = 0')}을 대입하면 ${Y} = ${iq(q)}이다. 그래프는 두 점 ${pt(p, 0)}, ${ptj(0, q, '을/를')} 지나는 직선이다.`,
              facts: { truth: order.map((j) => j === 0), want: true }
            });
          }),
          T('graph-pick-line', '한 좌표평면의 여러 직선에서 일차방정식의 그래프 찾기', '①13', (d) => {
            // 기울기의 부호나 y절편의 부호만 다른 직선 셋. [기울기, y절편]
            const set = d.pick([
              [[Q(2), -2], [Q(-2), -2], [Q(-2), 2]],
              [[Q(1, 2), 1], [Q(-1, 2), 1], [Q(1, 2), -1]],
              [[Q(1), 2], [Q(-1), 2], [Q(1), -2]],
              [[Q(3), 3], [Q(-3), 3], [Q(-3), -3]],
              [[Q(-1), 3], [Q(4), -2], [Q(1, 2), 1]]
            ]);
            const order = d.shuffle([0, 1, 2]), at = d.int(0, 2), [m, k] = set[order[at]], l = byFn(m, k);
            return C(`그림의 직선 ㉠~㉢ 가운데 일차방정식 ${gen(l)}의 그래프는?`, LAB.slice(0, 3), at, {
              figure: board({ lines: order.map((j, i) => ({ a: set[j][0], b: set[j][1], name: LAB[i] })) }),
              explain: `${gen(l)}에서 ${fn(m, k)}이다. 기울기가 ${tx(m)}이고 ${Y}절편이 ${iq(k)}인 직선은 ${LAB[at]}이다.`,
              facts: { truth: order.map((j, i) => i === at), want: true }
            });
          }),
          T('graph-claims', '일차방정식의 그래프에 대한 설명의 참·거짓', '①14 심2', (d) => {
            const m = pm(d) * d.int(2, 3), p = nz(d, -3, 3), k = -m * p, l = intLine(m, k, d.pick([1, 2])), up = m > 0, miss = missing(m, k), other = missing(-m, k);
            const dx = d.pick([2, 3]), x1 = d.until(() => nz(d, -3, 3), (v) => v !== p), y1 = m * x1 + k, k2 = d.until(() => nz(d, -6, 6), (v) => v !== k), bad = l.a !== m ? l.a : -m;
            const yes = [
              `${X}절편은 ${iq(p)}이다.`,
              `${Y}절편은 ${iq(k)}이다.`,
              `점 ${ptj(x1, y1, '을/를')} 지난다.`,
              `${QUAD[miss - 1]}을 지나지 않는다.`,
              `오른쪽 ${up ? '위' : '아래'}로 향하는 직선이다.`,
              `${X}의 값이 ${dx}만큼 증가할 때 ${Y}의 값은 ${Math.abs(m) * dx}만큼 ${up ? '증가' : '감소'}한다.`,
              `일차함수 ${fn(m, k2)}의 그래프와 평행하다.`,
              `일차함수 ${fn(m, 0)}의 그래프를 ${Y}축의 방향으로 ${iq(k)}만큼 평행이동한 것이다.`
            ];
            const no = [
              [`${X}절편은 ${iq(k)}이다.`, `${nb(Y + ' = 0')}을 대입하면 ${X} = ${iq(p)}이므로 ${X}절편은 ${iq(p)}이다.`, yes[0]],
              [`${Y}절편은 ${iq(-k)}이다.`, `${nb(X + ' = 0')}을 대입하면 ${Y} = ${iq(k)}이므로 ${Y}절편은 ${iq(k)}이다.`, yes[1]],
              [`점 ${ptj(x1, -y1, '을/를')} 지난다.`, `${X} = ${iq(x1)}일 때 ${Y} = ${iq(y1)}이므로 점 ${ptj(x1, y1, '을/를')} 지난다.`, yes[2]],
              [`${QUAD[other - 1]}을 지나지 않는다.`, `${fn(m, k)}의 그래프는 ${QUAD[miss - 1]}을 지나지 않는다.`, yes[3]],
              [`오른쪽 ${up ? '아래' : '위'}로 향하는 직선이다.`, `기울기가 ${iq(m)}이므로 오른쪽 ${up ? '위' : '아래'}로 향하는 직선이다.`, yes[4]],
              [`${X}의 값이 ${dx}만큼 증가할 때 ${Y}의 값은 ${Math.abs(m) * dx}만큼 ${up ? '감소' : '증가'}한다.`, `기울기가 ${iq(m)}이므로 ${X}의 값이 ${dx}만큼 증가할 때 ${Y}의 값은 ${Math.abs(m) * dx}만큼 ${up ? '증가' : '감소'}한다.`, yes[5]],
              [`일차함수 ${fn(bad, k2)}의 그래프와 평행하다.`, `${fn(m, k)}이므로 기울기는 ${iq(m)}이다. 기울기가 ${iq(bad)}인 직선과는 평행하지 않다.`, yes[6]],
              [`일차함수 ${fn(m, 0)}의 그래프를 ${Y}축의 방향으로 ${iq(-k)}만큼 평행이동한 것이다.`, `${fn(m, k)}이므로 ${fn(m, 0)}의 그래프를 ${Y}축의 방향으로 ${iq(k)}만큼 평행이동한 것이다.`, yes[7]]
            ];
            const want = d.bool();
            return claimQ(d, `일차방정식 ${gen(l)}의 그래프에 대한 설명으로 ${want ? '옳은' : '옳지 않은'} 것은?`, yes, no, want);
          }),
          T('graph-quadrant', '일차방정식의 그래프가 지나지 않는 사분면', '①15 심1', (d) => {
            const l = d.until(() => ({ a: d.int(1, 5), b: nz(d, -5, 5), c: nz(d, -6, 6) }), (v) => gcd(gcd(v.a, v.b), v.c) === 1), m = slope(l), k = yint(l), up = m.p > 0, miss = missing(m.p, k.p);
            return pick1(d, `일차방정식 ${gen(l)}의 그래프가 지나지 않는 사분면은?`, QUAD.map((name, i) => [name, i === miss - 1]), {
              fixed: true,
              explain: `${gen(l)}에서 ${fn(m, k)}이다. 기울기가 ${up ? '양수' : '음수'}이고 ${Y}절편이 ${k.p > 0 ? '양수' : '음수'}이므로 그래프는 오른쪽 ${up ? '위' : '아래'}로 향하고 ${Y}축과 원점의 ${k.p > 0 ? '위' : '아래'}쪽에서 만난다. 따라서 ${QUAD[miss - 1]}을 지나지 않는다.`
            });
          }),
          T('graph-intercepts-coef', '그래프의 두 절편에서 일차방정식의 수 구하기', '①16', (d) => {
            // kx − ay + c = 0 (k, c 는 주어진 수). y절편 q 는 그림에 수로, x절편은 문자 b 로 적혀 있다: a = c/q, b = −c/k.
            const [a, q, bb] = d.until(() => [nz(d, -4, 4), pm(d) * d.int(2, 5), pm(d) * d.int(2, 5)], ([u, v, w]) => (u * v) % w === 0 && Math.abs(u * v / w) <= 6 && Math.abs(u * v) <= 18);
            const c = a * q, k = -c / bb, eq = eq0([k, X], Lt(A + Y, -1), [c, '']);
            return M(`일차방정식 ${eq}의 그래프가 그림과 같을 때, 수 ${A}, ${Bv}의 값을 각각 구하시오.`, [{ label: `${A} =`, answer: a, signed: true }, { label: `${Bv} =`, answer: bb, signed: true }], {
              figure: bare([[bb, 0], [0, q]], { lines: [{ a: Q(-q, bb), b: q }], marks: cuts(bb, q, ['b', sgn(q)]), label: `좌표평면: 직선이 y축과 ${sgn(q)}인 점에서 만나고, x축과는 원점의 ${bb > 0 ? '오른쪽' : '왼쪽'}에 있는 b인 점에서 만난다.` }),
              explain: `${Y}절편이 ${iq(q)}이므로 ${nb(X + ' = 0')}, ${Y} = ${iq(q)}${tl(q, '을/를')} 대입하면 ${A} = ${iq(a)}이다. ${eq0([k, X], [-a, Y], [c, ''])}에 ${nb(Y + ' = 0')}을 대입하면 ${X} = ${iq(bb)}이므로 ${Bv} = ${iq(bb)}이다.`,
              facts: { calc: [[`${jn(c)}/${jn(q)}`, 0], [`-${jn(c)}/${jn(k)}`, 1]], unseen: un(k) }
            });
          }),
          T('graph-point-coef', '그래프 위의 점의 좌표에서 일차방정식의 수 구하기', '①17 심5', (d, n) => {
            // kx + ay + b = 0 (k 는 주어진 수). 기울기 −k/a.
            if (n === 0) {
              // y절편 w 와 한 점 (x1, y1)이 그림에 적혀 있다.
              const v = d.until(() => { const k = d.pick([1, 2, 3]), a = nz(d, -3, 3), m = Q(-k, a), w = nz(d, -3, 3), t = nz(d, -3, 3); return { k, a, m, w, x1: m.q * t, y1: w + m.p * t }; }, (s) => Math.abs(s.x1) >= 2 && Math.abs(s.x1) <= 6 && Math.abs(s.y1) <= 5 && Math.abs(s.y1) >= 2 && Math.abs(s.w) >= 2 && Math.abs(s.m.p) <= 3 && s.w * s.y1 < 0);
              const { k, a, m, w, x1, y1 } = v, b = -a * w, eq = eq0([k, X], Lt(A + Y), Lt(Bv)), p = -w / fl(m);
              return M(`일차방정식 ${eq}의 그래프가 그림과 같을 때, 수 ${A}, ${Bv}의 값을 각각 구하시오.`, [{ label: `${A} =`, answer: a, signed: true }, { label: `${Bv} =`, answer: b, signed: true }], {
                figure: bare([[x1, y1], [0, w]], { lines: [{ a: m, b: w }], points: [{ x: x1, y: y1, guide: true }], marks: foot(x1, y1).concat([{ ax: 'y', at: w, text: sgn(w), side: p > 0 ? 'l' : 'r', shift: w > 0 ? 4 : -4 }]), label: `좌표평면: 직선이 y축과 ${sgn(w)}인 점에서 만난다. 직선 위의 한 점에서 두 축에 내린 점선이 x축의 ${sgn(x1)}, y축의 ${sgn(y1)}에 닿는다.` }),
                explain: `그래프가 두 점 ${pt(0, w)}, ${ptj(x1, y1, '을/를')} 지난다. ${nb(X + ' = 0')}, ${Y} = ${iq(w)}${tl(w, '을/를')} 대입하면 ${nb(sum([Lt((Math.abs(w) === 1 ? '' : Math.abs(w)) + A, Math.sign(w)), Lt(Bv)]) + ' = 0')}이고, ${X} = ${iq(x1)}, ${Y} = ${iq(y1)}${tl(y1, '을/를')} 대입하면 ${nb(sum([[k * x1, ''], Lt((Math.abs(y1) === 1 ? '' : Math.abs(y1)) + A, Math.sign(y1)), Lt(Bv)]) + ' = 0')}이다. 두 식을 연립하여 풀면 ${A} = ${iq(a)}, ${Bv} = ${iq(b)}이다.`,
                facts: { calc: [[`-${jn(k)}*${jn(x1)}/(${jn(y1)}-${jn(w)})`, 0], [`${jn(k)}*${jn(x1)}/(${jn(y1)}-${jn(w)})*${jn(w)}`, 1]], unseen: un(k), rule: 'point-coef-cut' }
              });
            }
            // 두 점 (x1, y1), (x2, y2)가 그림에 적혀 있다(y축의 양쪽).
            const v = d.until(() => { const k = d.pick([1, 2, 3]), a = nz(d, -3, 3), m = Q(-k, a), x1 = -d.int(2, 4), y1 = nz(d, -4, 5), t = d.int(1, 5); return { k, a, m, x1, y1, x2: x1 + m.q * t, y2: y1 + m.p * t }; },
              (s) => s.x2 >= 2 && s.x2 <= 5 && s.x2 - s.x1 <= 8 && Math.abs(s.y1) >= 2 && Math.abs(s.y2) >= 2 && Math.abs(s.y2) <= 5 && Math.abs(s.y1 - s.y2) >= 2 && s.y1 * s.x2 !== s.y2 * s.x1 && s.k * s.x1 + s.a * s.y1 !== 0 && Math.abs(s.k * s.x1 + s.a * s.y1) <= 15 && Math.abs(s.y1 + fl(s.m) * -s.x1) >= 0.8);
            const { k, a, m, x1, y1, x2, y2 } = v, b = -(k * x1 + a * y1), eq = eq0([k, X], Lt(A + Y), Lt(Bv));
            return M(`일차방정식 ${eq}의 그래프가 그림과 같이 두 점을 지날 때, 수 ${A}, ${Bv}의 값을 각각 구하시오.`, [{ label: `${A} =`, answer: a, signed: true }, { label: `${Bv} =`, answer: b, signed: true }], {
              figure: bare([[x1, y1], [x2, y2]], { lines: [{ a: m, b: Q(y1 * m.q - m.p * x1, m.q) }], points: [{ x: x1, y: y1, guide: true }, { x: x2, y: y2, guide: true }], marks: foot(x1, y1).concat(foot(x2, y2)), label: `좌표평면: 직선 위의 두 점에서 두 축에 점선을 내렸다. 한 점의 점선은 x축의 ${sgn(x1)}, y축의 ${sgn(y1)}에 닿고, 다른 점의 점선은 x축의 ${sgn(x2)}, y축의 ${sgn(y2)}에 닿는다.` }),
              explain: `그래프가 두 점 ${pt(x1, y1)}, ${ptj(x2, y2, '을/를')} 지난다. 두 점의 좌표를 각각 대입하면 ${nb(sum([[k * x1, ''], Lt((Math.abs(y1) === 1 ? '' : Math.abs(y1)) + A, Math.sign(y1)), Lt(Bv)]) + ' = 0')}, ${nb(sum([[k * x2, ''], Lt((Math.abs(y2) === 1 ? '' : Math.abs(y2)) + A, Math.sign(y2)), Lt(Bv)]) + ' = 0')}이다. 두 식을 연립하여 풀면 ${A} = ${iq(a)}, ${Bv} = ${iq(b)}이다.`,
              facts: { calc: [[`-${jn(k)}*(${jn(x1)}-${jn(x2)})/(${jn(y1)}-${jn(y2)})`, 0], [`-${jn(k)}*${jn(x1)}+${jn(k)}*(${jn(x1)}-${jn(x2)})/(${jn(y1)}-${jn(y2)})*${jn(y1)}`, 1]], unseen: un(k), rule: 'point-coef-two' }
            });
          }, { count: 2 }),
          T('graph-signs-from-graph', '그래프를 보고 일차방정식의 계수의 부호 알기', '①18', (d) => {
            // 눈금 없는 그림: 직선이 향하는 쪽(기울기의 부호)과 y축과 만나는 자리(y절편의 부호)만 읽는다. a > 0 이므로 기울기 −a/b 에서 b, y절편 −c/b 에서 c 의 부호가 정해진다.
            const up = d.bool(), high = d.bool(), m = (up ? 1 : -1) * d.pick([1, Q(3, 4), Q(4, 3)].map(num)), k = (high ? 1 : -1) * 2, sb = up ? -1 : 1, sc = high ? -sb : sb;
            const row = (b, c) => [`${Bv} ${b > 0 ? GT : LT} 0, ${Cv} ${c > 0 ? GT : LT} 0`, b === sb && c === sc];
            return pick1(d, `일차방정식 ${eq0(Lt(A + X), Lt(Bv + Y), Lt(Cv))}의 그래프가 그림과 같을 때, 다음 중 옳은 것은? (단, ${A} ${GT} 0)`, [row(1, 1), row(1, -1), row(-1, 1), row(-1, -1)], {
              fixed: true,
              figure: pl({ x: [-4, 4], y: [-4, 4], grid: false, lines: [{ a: m, b: k }], label: `좌표평면: 눈금 없는 그림. 직선이 오른쪽 ${up ? '위' : '아래'}로 향하고, y축과 원점의 ${high ? '위' : '아래'}쪽에서 만난다.` }),
              explain: `${eq0(Lt(A + X), Lt(Bv + Y), Lt(Cv))}에서 ${nb(`${Y} = ${MINUS}${frac(A, Bv)}${X} ${MINUS} ${frac(Cv, Bv)}`)}이다. 그래프가 오른쪽 ${up ? '위' : '아래'}로 향하므로 기울기 ${nb(MINUS + frac(A, Bv))}는 ${up ? '양수' : '음수'}이고, ${A} ${GT} 0이므로 ${Bv} ${sb > 0 ? GT : LT} 0이다. ${Y}축과 원점의 ${high ? '위' : '아래'}쪽에서 만나므로 ${Y}절편 ${nb(MINUS + frac(Cv, Bv))}는 ${high ? '양수' : '음수'}이고, ${Cv} ${sc > 0 ? GT : LT} 0이다.`
            });
          })
        ]
      },
      {
        id: 'axis', title: '방정식 x = p, y = q의 그래프', standard: STD1,
        types: [
          T('axis-pick-line', '축에 평행한 직선들 가운데 방정식의 그래프 찾기', '①20·21', (d) => {
            // 직선 넷: x = p, x = −p, y = p, y = −p (부호와 축을 함께 가려야 한다). 식은 정리되지 않은 꼴로 준다.
            const p = d.pick([1, 3]), all = d.shuffle([['x', p], ['x', -p], ['y', p], ['y', -p]]), at = d.int(0, 3), [L, v] = all[at], k = d.pick([2, 3, 4]);
            const eq = d.bool() ? eq0([k, L === 'x' ? X : Y], [-k * v, '']) : eqR([[k, L === 'x' ? X : Y]], k * v);
            return C(`그림의 직선 ㉠~㉣ 가운데 일차방정식 ${eq}의 그래프는?`, LAB.slice(0, 4), at, {
              figure: board({ lines: all.map(([name, w], i) => (name === 'x' ? { x: w, name: LAB[i] } : { a: 0, b: w, name: LAB[i] })) }),
              explain: `${eq}에서 ${L === 'x' ? xEq(v) : yEq(v)}이다. 그래프는 점 ${L === 'x' ? ptj(v, 0, '을/를') : ptj(0, v, '을/를')} 지나고 ${L === 'x' ? Y : X}축에 평행한 직선 ${LAB[at]}이다.`,
              facts: { truth: all.map((line, i) => i === at), want: true }
            });
          }),
          T('axis-eq-from-graph', '축에 평행한 직선의 방정식 읽기', '①37', (d) => {
            const L = d.pick(['x', 'y']), v = pm(d) * d.pick([1, 3]);
            return axisPick(d, '그림의 직선의 방정식은?', [L, v], -v, {
              figure: board({ lines: [L === 'x' ? { x: v } : { a: 0, b: v }] }),
              explain: `직선 위의 모든 점의 ${L === 'x' ? X : Y}좌표가 ${iq(v)}이므로 직선의 방정식은 ${L === 'x' ? xEq(v) : yEq(v)}이다.`
            });
          }),
          T('axis-line-through-point', '한 점을 지나고 축에 평행한(수직인) 직선의 방정식', '①22', (d, n) => {
            const [x0, y0] = d.until(() => [nz(d, -6, 6), nz(d, -6, 6)], ([u, v]) => Math.abs(u) !== Math.abs(v)), ax = d.pick(['x', 'y']);
            // 「ax축에 평행」이면 답은 다른 문자의 식(y = y0), 「ax축에 수직」이면 그 문자의 식(x = x0)이다.
            const ans = (letter) => (letter === 'x' ? ['x', x0] : ['y', y0]), flip = ax === 'x' ? 'y' : 'x', told = (r) => (r[0] === 'x' ? xEq(r[1]) : yEq(r[1]));
            if (n === 0) {
              const r = ans(flip);
              return axisPick(d, `점 ${ptj(x0, y0, '을/를')} 지나고 ${ax === 'x' ? X : Y}축에 평행한 직선의 방정식은?`, r, r[0] === 'x' ? y0 : x0, {
                explain: `${ax === 'x' ? X : Y}축에 평행한 직선 위의 점은 ${r[0] === 'x' ? X : Y}좌표가 모두 같다. 점 ${ptj(x0, y0, '을/를')} 지나므로 직선의 방정식은 ${told(r)}이다.`, facts: { rule: 'through-parallel' }
              });
            }
            if (n === 1) {
              const r = ans(ax);
              return axisPick(d, `점 ${ptj(x0, y0, '을/를')} 지나고 ${ax === 'x' ? X : Y}축에 수직인 직선의 방정식은?`, r, r[0] === 'x' ? y0 : x0, {
                explain: `${ax === 'x' ? X : Y}축에 수직인 직선은 ${ax === 'x' ? Y : X}축에 평행하므로, 직선 위의 점은 ${r[0] === 'x' ? X : Y}좌표가 모두 같다. 점 ${ptj(x0, y0, '을/를')} 지나므로 직선의 방정식은 ${told(r)}이다.`, facts: { rule: 'through-perp' }
              });
            }
            if (n === 2) {
              // 보기가 정리되지 않은 식이다: kx = k·x0, jy − j·y0 = 0
              const r = ans(ax), k = d.pick([2, 3, 5]), j = d.pick([2, 3, 4]), xf = (w) => eqR([[k, X]], k * w), yf = (w) => eq0([j, Y], [-j * w, '']), mk = (letter, w) => (letter === 'x' ? xf(w) : yf(w)), other = r[0] === 'x' ? y0 : x0;
              return pick1(d, `다음 일차방정식 중 그 그래프가 점 ${ptj(x0, y0, '을/를')} 지나고 ${ax === 'x' ? X : Y}축에 수직인 직선인 것은?`, [[mk(r[0], r[1]), true], [mk(flip, r[1]), false], [mk(r[0], other), false], [mk(flip, other), false]], {
                explain: `${ax === 'x' ? X : Y}축에 수직이고 점 ${ptj(x0, y0, '을/를')} 지나는 직선의 방정식은 ${told(r)}이다. ${mk(r[0], r[1])}을 정리하면 ${told(r)}이다.`, facts: { rule: 'through-forms' }
              });
            }
            // 축 대신 축에 평행한 직선을 기준으로 준다.
            const base = d.pick(['x', 'y']), par = d.bool(), c = d.until(() => nz(d, -5, 5), (v) => v !== x0 && v !== y0), r = ans(par ? base : (base === 'x' ? 'y' : 'x')), given = base === 'x' ? xEq(c) : yEq(c);
            return axisPick(d, `점 ${ptj(x0, y0, '을/를')} 지나고 직선 ${given}에 ${par ? '평행한' : '수직인'} 직선의 방정식은?`, r, r[0] === 'x' ? y0 : x0, {
              explain: `직선 ${given}${tl(c, '은/는')} ${base === 'x' ? Y : X}축에 평행하다. 이 직선에 ${par ? '평행한' : '수직인'} 직선은 ${r[0] === 'x' ? Y : X}축에 평행하고, 점 ${ptj(x0, y0, '을/를')} 지나므로 직선의 방정식은 ${told(r)}이다.`, facts: { rule: 'through-line' }
            });
          }, { count: 4 }),
          T('axis-two-points', '두 점을 지나는 축에 평행한 직선의 방정식', '①23', (d) => {
            const [s, u, v] = d.until(() => [nz(d, -6, 6), nz(d, -6, 6), nz(d, -6, 6)], (w) => new Set(w.map(Math.abs)).size === 3), L = d.pick(['x', 'y']);
            const p1 = L === 'x' ? pt(s, u) : pt(u, s), p2 = L === 'x' ? ptj(s, v, '을/를') : ptj(v, s, '을/를');
            return axisPick(d, `두 점 ${p1}, ${p2} 지나는 직선의 방정식은?`, [L, s], u, {
              explain: `두 점의 ${L === 'x' ? X : Y}좌표가 ${iq(s)}${tl(s, '으로/로')} 같으므로 직선 위의 모든 점의 ${L === 'x' ? X : Y}좌표가 ${iq(s)}이다. 직선의 방정식은 ${L === 'x' ? xEq(s) : yEq(s)}이다.`
            });
          }),
          T('axis-parallel-coef', '두 점을 지나는 직선이 축에 평행할 때 수 구하기', '①24', (d, n) => {
            const ex = (p, r, v) => sum([Lt((Math.abs(p) === 1 ? '' : Math.abs(p)) + v, Math.sign(p)), [r, '']]);
            // 문자가 든 식 뒤의 토씨: 상수항이 없으면 문자(a, b)로 끝난다.
            const exTail = (r, pair) => (r === 0 ? pair.split('/')[1] : tl(r, pair));
            // 같아지는 두 좌표 p1·v + r1 = p2·v + r2 의 해가 정수가 되게 고른다.
            const pair = () => d.until(() => { const p1 = nz(d, -3, 3), p2 = nz(d, -3, 3), r1 = d.int(-6, 6), v = nz(d, -5, 5); return { p1, p2, r1, r2: (p1 - p2) * v + r1, v }; }, (w) => w.p1 !== w.p2 && Math.abs(w.r2) <= 9 && (w.r1 !== 0 || w.r2 !== 0));
            if (n === 0) {
              const ax = d.pick(['x', 'y']), e = pair(), [f1v, f2v] = d.until(() => [nz(d, -6, 6), nz(d, -6, 6)], ([u, v]) => u !== v);
              const c1 = ex(e.p1, e.r1, A), c2 = ex(e.p2, e.r2, A), P = ax === 'x' ? [pt(f1v, c1), pt(f2v, c2)] : [pt(c1, f1v), pt(c2, f2v)];
              return ansV(`두 점 ${P[0]}, ${P[1]}${ax === 'x' ? exTail(e.r2, '을/를') : tl(f2v, '을/를')} 지나는 직선이 ${ax === 'x' ? X : Y}축에 평행할 때, ${A}의 값은?`, Q(e.v), 'int', {
                explain: `${ax === 'x' ? X : Y}축에 평행한 직선 위의 점은 ${ax === 'x' ? Y : X}좌표가 모두 같다. ${nb(c1 + ' = ' + c2)}에서 ${A} = ${iq(e.v)}이다.`,
                facts: { value: `(${jn(e.r2)}-${jn(e.r1)})/(${jn(e.p1)}-${jn(e.p2)})`, unseen: un(e.p1, e.p2).concat(e.r1 === 0 || e.r2 === 0 ? [0] : []) }
              });
            }
            // 문자 둘: x좌표는 a 의 식, y좌표는 b 의 식. x축에 평행할 조건(b)과 y축에 평행할 조건(a)을 따로 구한다.
            const e = pair(), g = pair(), x1 = ex(e.p1, e.r1, A), x2 = ex(e.p2, e.r2, A), y1 = ex(g.p1, g.r1, Bv), y2 = ex(g.p2, g.r2, Bv);
            return M(`서로 다른 두 점 ${pt(x1, y1)}, ${pt(x2, y2)}${exTail(g.r2, '을/를')} 지나는 직선에 대하여 ㉠, ㉡에 알맞은 수를 구하시오.`, [{ label: '㉠', answer: g.v, signed: true }, { label: '㉡', answer: e.v, signed: true }], {
              figure: `<div class="mb-lines"><div>${X}축에 평행하려면 ${Bv} = ㉠</div><div>${Y}축에 평행하려면 ${A} = ㉡</div></div>`,
              explain: `${X}축에 평행하려면 두 점의 ${Y}좌표가 같아야 하므로 ${nb(y1 + ' = ' + y2)}에서 ${Bv} = ${iq(g.v)}이다. ${Y}축에 평행하려면 두 점의 ${X}좌표가 같아야 하므로 ${nb(x1 + ' = ' + x2)}에서 ${A} = ${iq(e.v)}이다.`,
              facts: { calc: [[`(${jn(g.r2)}-${jn(g.r1)})/(${jn(g.p1)}-${jn(g.p2)})`, 0], [`(${jn(e.r2)}-${jn(e.r1)})/(${jn(e.p1)}-${jn(e.p2)})`, 1]], unseen: [0, 1] }
            });
          }, { count: 2 }),
          T('axis-parallel-meet', 'y축에 평행한 직선이 x축과 만나는 점 구하기', '심8', (d) => {
            const ex = (p, r) => sum([Lt((Math.abs(p) === 1 ? '' : Math.abs(p)) + A, Math.sign(p)), [r, '']]);
            // x좌표가 같아지는 a 를 구하고, 그때의 x좌표가 x축과 만나는 점의 x좌표 b 이다. y좌표는 서로 달라야 한다.
            const v = d.until(() => { const p1 = nz(d, -3, 3), p2 = nz(d, -3, 3), r1 = nz(d, -5, 5), a = nz(d, -4, 4), q1 = nz(d, -2, 2), q2 = nz(d, -2, 2), s1 = d.int(-5, 5), s2 = d.int(-5, 5); return { p1, p2, r1, r2: (p1 - p2) * a + r1, a, q1, q2, s1, s2 }; },
              (w) => w.p1 !== w.p2 && w.r2 !== 0 && Math.abs(w.r2) <= 9 && w.q1 * w.a + w.s1 !== w.q2 * w.a + w.s2 && w.p1 * w.a + w.r1 !== 0 && Math.abs(w.p1 * w.a + w.r1) <= 9 && (w.s1 !== 0 || w.s2 !== 0));
            const b = v.p1 * v.a + v.r1, x1 = ex(v.p1, v.r1), x2 = ex(v.p2, v.r2), y1 = ex(v.q1, v.s1), y2 = ex(v.q2, v.s2);
            return M(`두 점 ${pt(x1, y1)}, ${pt(x2, y2)}${v.s2 === 0 ? '를' : tl(v.s2, '을/를')} 지나는 직선이 ${Y}축에 평행하고 ${X}축과 점 ${pt(Bv, 0)}에서 만날 때, ${A}, ${Bv}의 값을 각각 구하시오.`, [{ label: `${A} =`, answer: v.a, signed: true }, { label: `${Bv} =`, answer: b, signed: true }], {
              explain: `${Y}축에 평행한 직선 위의 점은 ${X}좌표가 모두 같으므로 ${nb(x1 + ' = ' + x2)}에서 ${A} = ${iq(v.a)}이다. 이때 두 점의 ${X}좌표는 ${iq(b)}이므로 직선의 방정식은 ${xEq(b)}이고, ${X}축과 점 ${pt(b, 0)}에서 만난다. 따라서 ${Bv} = ${iq(b)}이다.`,
              facts: { calc: [[`(${jn(v.r2)}-${jn(v.r1)})/(${jn(v.p1)}-${jn(v.p2)})`, 0], [`${jn(v.p1)}*((${jn(v.r2)}-${jn(v.r1)})/(${jn(v.p1)}-${jn(v.p2)}))+${jn(v.r1)}`, 1]], unseen: un(v.p1, v.p2) }
            });
          }),
          T('axis-pick-all', '여러 꼴의 식에서 축에 평행한 직선의 방정식 모두 고르기', '①25', (d) => {
            // 정리해야 꼴이 드러나는 식을 섞는다: x가 지워지는 식(→ y = q), y가 지워지는 식(→ x = p).
            const k = () => d.pick([2, 3, 4, 5]), v = () => nz(d, -5, 5);
            const H = d.shuffle([
              () => { const j = k(), q = v(); return { h: eq0([j, Y], [-j * q, '']), as: yEq(q), kind: 'y' }; },
              () => { const j = k(), q = v(); return { h: eqR([[j, Y]], j * q), as: yEq(q), kind: 'y' }; },
              () => { const e = d.int(1, 6), f = d.int(1, 6) * pm(d); return { h: eqR([[1, X], [2, Y], [e, '']], [[1, X], [1, Y], [f, '']]), as: yEq(f - e), kind: 'y' }; }
            ]).slice(0, 2).map((f) => f());
            const W = d.shuffle([
              () => { const c = d.int(2, 8), p = v(); return { h: eqR([[-1, X], [c, '']], c - p), as: xEq(p), kind: 'x' }; },
              () => { const j = k(), p = v(); return { h: eq0([j, X], [-j * p, '']), as: xEq(p), kind: 'x' }; },
              () => { const e = d.int(1, 9), f = d.int(0, 5), j = d.pick([2, 3]); return { h: eqR([[1, X], [j, Y], [e, '']], [[j, Y], [f, '']]), as: xEq(f - e), kind: 'x' }; }
            ]).slice(0, 2).map((f) => f());
            const S = d.shuffle([
              () => { const a = d.int(2, 5), b = d.until(() => d.int(2, 5), (w) => w !== a); return { h: eqR([[a, X], [-b, Y]], 0), kind: 's' }; },
              () => { const a = d.int(2, 4), c = v(); return { h: eqR([[a, X], [-1, Y]], c), kind: 's' }; },
              () => { const c = v(); return { h: eqR([[1, X], [1, Y]], c), kind: 's' }; }
            ]).slice(0, 2).map((f) => f());
            const rows = d.shuffle(H.concat(W, S)), ax = d.pick(['x', 'y']), target = ax === 'x' ? 'y' : 'x', idx = (kind) => rows.map((r, i) => (r.kind === kind ? i : -1)).filter((i) => i >= 0);
            const yes = idx(target), opp = idx(ax), sl = idx('s'), pairs = d.shuffle([yes, opp, [yes[0], opp[0]], [yes[1], sl[0]]].map((pair) => pair.slice().sort((s, t) => s - t)));
            const right = (pair) => pair.every((i) => rows[i].kind === target);
            return C(`다음 일차방정식 중 그 그래프가 ${ax === 'x' ? X : Y}축에 평행한 것을 모두 고른 것은?`, pairs.map((pair) => pair.map((i) => TAG6[i]).join(', ')), pairs.findIndex(right), {
              figure: tagRows(rows.map((r) => r.h)),
              explain: `정리하면 ${rows.map((r, i) => (r.as ? `${TAG6[i]}은 ${r.as}` : '')).filter(Boolean).join(', ')}이다. ${ax === 'x' ? X : Y}축에 평행한 직선의 방정식은 ${ax === 'x' ? nb(Y + ' = ' + V('q')) : nb(X + ' = ' + V('p'))} 꼴이므로 ${yes.map((i) => TAG6[i]).join(', ')}이다.`,
              facts: { truth: pairs.map(right), want: true }
            });
          }),
          T('axis-claims', '방정식 x = p, y = q의 그래프에 대한 설명의 참·거짓', '①26', (d) => {
            const hz = d.bool(), [v, r, s] = d.until(() => [nz(d, -4, 4), nz(d, -4, 4), nz(d, -4, 4)], ([a, b]) => Math.abs(a) !== Math.abs(b)), t = d.until(() => nz(d, -5, 5), (w) => w !== v), k = d.pick([2, 3, 4, 5]);
            const eq = eq0([k, hz ? Y : X], [-k * v, '']), own = hz ? Y : X, oth = hz ? X : Y, solved = hz ? yEq(v) : xEq(v);
            const quads = hz ? (v > 0 ? [1, 2] : [3, 4]) : (v > 0 ? [1, 4] : [2, 3]), wrong = hz ? (v > 0 ? [3, 4] : [1, 2]) : (v > 0 ? [2, 3] : [1, 4]), qs = (list) => `제${list[0]}사분면과 제${list[1]}사분면`;
            const onP = hz ? ptj(r, v, '을/를') : ptj(v, r, '을/를'), offP = hz ? ptj(v, r, '을/를') : ptj(r, v, '을/를'), crossing = hz ? xEq(s) : yEq(s), along = hz ? yEq(t) : xEq(t);
            // 축과의 관계를 말한 문장은 한 문항에 하나만 낸다(「y축에 평행하다」와 「y축에 수직이다」가 함께 나오면 둘 가운데 하나가 답이라는 것이 드러난다).
            const dirYes = d.pick([`${oth}축에 평행한 직선이다.`, `${own}축에 수직인 직선이다.`]), dirNo = d.pick([[`${own}축에 평행한 직선이다.`, `${solved}이므로 ${oth}축에 평행한 직선이다.`], [`${oth}축에 수직인 직선이다.`, `${solved}이므로 ${own}축에 수직인 직선이다.`]]);
            const yes = [`점 ${onP} 지난다.`, dirYes, `직선 ${crossing}${tl(s, '과/와')} 한 점에서 만난다.`, `${qs(quads)}을 지난다.`];
            const no = [
              [dirNo[0], dirNo[1], dirYes],
              [`점 ${offP} 지난다.`, `${solved}이므로 그래프 위의 점은 ${own}좌표가 모두 ${iq(v)}이다.`, yes[0]],
              [`${qs(wrong)}을 지난다.`, `${solved}이므로 ${qs(quads)}을 지난다.`, yes[3]],
              [`직선 ${along}${tl(t, '과/와')} 한 점에서 만난다.`, `두 직선 ${solved}, ${along}${tl(t, '은/는')} 서로 평행하므로 만나지 않는다.`, yes[2]]
            ];
            const want = d.bool();
            return claimQ(d, `일차방정식 ${eq}의 그래프에 대한 설명으로 ${want ? '옳은' : '옳지 않은'} 것은?`, yes, no, want);
          }),
          T('axis-through-intercept', '다른 그래프가 축과 만나는 점을 지나고 축에 평행한 직선', '①27', (d) => {
            // 그래프가 y축(x축)과 만나는 점을 지나고 x축(y축)에 평행한 직선. 두 절편은 서로 다른 정수이다.
            const [p, q] = d.until(() => [nz(d, -6, 6), nz(d, -6, 6)], ([u, v]) => Math.abs(u) !== Math.abs(v)), l = byCuts(p, q), onY = d.bool();
            return axisPick(d, `일차방정식 ${gen(l)}의 그래프가 ${onY ? Y : X}축과 만나는 점을 지나고 ${onY ? X : Y}축에 평행한 직선의 방정식은?`, onY ? ['y', q] : ['x', p], onY ? p : q, {
              explain: `${gen(l)}에 ${nb((onY ? X : Y) + ' = 0')}을 대입하면 ${onY ? Y : X} = ${iq(onY ? q : p)}이므로 그래프는 ${onY ? Y : X}축과 점 ${onY ? pt(0, q) : pt(p, 0)}에서 만난다. 이 점을 지나고 ${onY ? X : Y}축에 평행한 직선의 방정식은 ${onY ? yEq(q) : xEq(p)}이다.`
            });
          }),
          T('axis-general-coef', '축에 평행한 그래프가 되는 ax + by + c = 0의 수', '①28 심9', (d) => {
            // 한 점을 지나고 y축(x축)에 평행하다: y(x)의 계수가 0이어야 한다.
            const [x0, y0, t] = d.until(() => [nz(d, -4, 4), nz(d, -4, 4), pm(d) * d.int(2, 3)], ([u, v]) => Math.abs(u) !== Math.abs(v)), toY = d.bool(), c = toY ? -t * x0 : -t * y0, eq = eq0(Lt(A + X), Lt(Bv + Y), [c, '']);
            return M(`일차방정식 ${eq}의 그래프가 점 ${ptj(x0, y0, '을/를')} 지나고 ${toY ? Y : X}축에 평행할 때, 수 ${A}, ${Bv}의 값을 각각 구하시오.`, [{ label: `${A} =`, answer: toY ? t : 0, signed: true }, { label: `${Bv} =`, answer: toY ? 0 : t, signed: true }], {
              explain: `점 ${ptj(x0, y0, '을/를')} 지나고 ${toY ? Y : X}축에 평행한 직선의 방정식은 ${toY ? xEq(x0) : yEq(y0)}, 곧 ${toY ? eq0([1, X], [-x0, '']) : eq0([1, Y], [-y0, ''])}이다. 양변에 ${iq(t)}${tl(t, '을/를')} 곱하면 ${toY ? eq0([t, X], [c, '']) : eq0([t, Y], [c, ''])}이므로 ${A} = ${iq(toY ? t : 0)}, ${Bv} = ${iq(toY ? 0 : t)}이다.`,
              facts: { calc: toY ? [[`-${jn(c)}/${jn(x0)}`, 0], ['0', 1]] : [['0', 0], [`-${jn(c)}/${jn(y0)}`, 1]] }
            });
          }),
          T('axis-coef-from-graph', '축에 평행한 직선의 그림에서 일차방정식의 수 구하기', '①28 심11', (d) => {
            // 세로선 x = v: ax + (b − t)y + c = 0 에서 b = t, a = −c/v. 가로선 y = v: (a − t)x + by + c = 0 에서 a = t, b = −c/v.
            const vert = d.bool(), v = pm(d) * d.int(2, 4), w = nz(d, -3, 3), t = d.int(1, 5), s = pm(d), c = -w * v, inner = `(${sum([Lt(vert ? Bv : A), [s * t, '']])})`;
            const eq = vert ? eq0(Lt(A + X), Lt(inner + Y), [c, '']) : eq0(Lt(inner + X), Lt(Bv + Y), [c, '']), zero = -s * t;
            return M(`일차방정식 ${eq}의 그래프가 그림과 같을 때, 수 ${A}, ${Bv}의 값을 각각 구하시오.`, [{ label: `${A} =`, answer: vert ? w : zero, signed: true }, { label: `${Bv} =`, answer: vert ? zero : w, signed: true }], {
              figure: pl({ x: vert ? [Math.min(v, 0) - 2, Math.max(v, 0) + 2] : [-3, 3], y: vert ? [-3, 3] : [Math.min(v, 0) - 2, Math.max(v, 0) + 2], grid: false, lines: [vert ? { x: v } : { a: 0, b: v }], marks: [vert ? { ax: 'x', at: v, text: sgn(v), side: 'd', shift: v > 0 ? -9 : 9 } : { ax: 'y', at: v, text: sgn(v), side: 'l', shift: v > 0 ? 10 : -10 }], label: `좌표평면: 직선이 ${vert ? 'x' : 'y'}축 위의 ${sgn(v)}인 점을 지나고 ${vert ? 'y' : 'x'}축에 평행하다.` }),
              explain: `그래프는 ${vert ? Y : X}축에 평행한 직선 ${vert ? xEq(v) : yEq(v)}이다. ${vert ? Y : X}의 계수가 0이어야 하므로 ${nb(sum([Lt(vert ? Bv : A), [s * t, '']]) + ' = 0')}에서 ${vert ? Bv : A} = ${iq(zero)}이다. ${vert ? eq0(Lt(A + X), [c, '']) : eq0(Lt(Bv + Y), [c, ''])}에 ${vert ? X : Y} = ${iq(v)}${tl(v, '을/를')} 대입하면 ${vert ? A : Bv} = ${iq(w)}이다.`,
              facts: { calc: vert ? [[`-${jn(c)}/${jn(v)}`, 0], [`${s > 0 ? '-' : ''}${t}`, 1]] : [[`${s > 0 ? '-' : ''}${t}`, 0], [`-${jn(c)}/${jn(v)}`, 1]] }
            });
          }),
          T('axis-cross-point', '축에 평행한 두 직선의 교점의 좌표', '①29', (d) => {
            const [x1, y1, x2, y2] = d.until(() => [nz(d, -6, 6), nz(d, -6, 6), nz(d, -6, 6), nz(d, -6, 6)], (w) => new Set(w.map(Math.abs)).size === 4);
            // 첫째 직선은 세로선(x = x1), 둘째 직선은 가로선(y = y2). 「평행」과 「수직」을 섞어 말한다.
            const w1 = d.bool() ? `${X}축에 수직인` : `${Y}축에 평행한`, w2 = d.bool() ? `${Y}축에 수직인` : `${X}축에 평행한`;
            return pointAns(`점 ${ptj(x1, y1, '을/를')} 지나고 ${w1} 직선과 점 ${ptj(x2, y2, '을/를')} 지나고 ${w2} 직선의 교점의 좌표는?`, x1, y2, {
              explain: `점 ${ptj(x1, y1, '을/를')} 지나고 ${w1} 직선의 방정식은 ${xEq(x1)}이고, 점 ${ptj(x2, y2, '을/를')} 지나고 ${w2} 직선의 방정식은 ${yEq(y2)}이다. 두 직선의 교점의 좌표는 ${pt(x1, y2)}이다.`,
              facts: { calc: [[jn(x1), 0], [jn(y2), 1]] }
            });
          }),
          T('axis-rect-area', '축에 평행한 네 직선으로 둘러싸인 도형의 넓이', '①30', (d) => {
            const [x1, x2, y3, y4] = d.until(() => [d.int(-5, 3), d.int(-3, 6), d.int(-6, 3), d.int(-3, 6)], ([a, b, c, e]) => b - a >= 2 && e - c >= 2 && a !== 0 && b !== 0 && c !== 0 && e !== 0), k = d.pick([2, 3]), j = d.pick([2, 3, 4]);
            return N(`네 직선 ${xEq(x1)}, ${eqR([[k, X]], k * x2)}, ${eq0([1, Y], [-y3, ''])}, ${eq0([j, Y], [-j * y4, ''])}${tl(0, '으로/로')} 둘러싸인 도형의 넓이는?`, (x2 - x1) * (y4 - y3), {
              explain: `네 직선은 ${xEq(x1)}, ${xEq(x2)}, ${yEq(y3)}, ${yEq(y4)}이다. 둘러싸인 도형은 가로의 길이가 ${nb(`${iq(x2)} − ${x1 < 0 ? '(' + iq(x1) + ')' : x1} = ${x2 - x1}`)}, 세로의 길이가 ${nb(`${iq(y4)} − ${y3 < 0 ? '(' + iq(y3) + ')' : y3} = ${y4 - y3}`)}인 직사각형이므로 넓이는 ${x2 - x1} × ${y4 - y3} = ${(x2 - x1) * (y4 - y3)}이다.`,
              facts: { value: `(${jn(k * x2)}/${k}-${jn(x1)})*(${jn(j * y4)}/${j}-${jn(y3)})`, unseen: [] }
            });
          }),
          T('axis-rect-coef', '네 직선으로 둘러싸인 도형의 넓이로 수 구하기', '①30 심12·13', (d, n) => {
            if (n === 0) {
              const k = d.int(2, 4), a = d.int(1, 3), [y1, y2] = d.until(() => [d.int(-5, 2), d.int(1, 6)], ([u, v]) => v - u >= 2 && u !== 0), area = (k - 1) * a * (y2 - y1);
              return N(`네 직선 ${nb(X + ' = ' + A)}, ${nb(`${X} = ${k}${A}`)}, ${yEq(y1)}, ${yEq(y2)}${tl(y2, '으로/로')} 둘러싸인 도형의 넓이가 ${area}일 때, 양수 ${A}의 값은?`, a, {
                explain: `둘러싸인 도형은 가로의 길이가 ${nb(`${k}${A} − ${A} = ${k - 1 === 1 ? '' : k - 1}${A}`)}, 세로의 길이가 ${nb(`${iq(y2)} − ${y1 < 0 ? '(' + iq(y1) + ')' : y1} = ${y2 - y1}`)}인 직사각형이다. ${nb(`${k - 1 === 1 ? '' : k - 1}${A} × ${y2 - y1} = ${area}`)}에서 ${A} = ${a}이다.`,
                facts: { value: `${area}/((${k}-1)*(${jn(y2)}-${jn(y1)}))`, unseen: [1], rule: 'rect-coef-one' }
              });
            }
            // 넓이로 정해지는 직선 y = k 는 주어진 가로선의 위쪽과 아래쪽에 하나씩 있다.
            const [x1, x2, y0, h] = d.until(() => [d.int(-5, 2), d.int(1, 6), nz(d, -3, 3), d.int(2, 6)], ([u, v, w, e]) => v - u >= 2 && u !== 0 && w - e !== 0 && w + e !== 0), area = (x2 - x1) * h;
            return M(`네 직선 ${xEq(x1)}, ${xEq(x2)}, ${yEq(y0)}, ${nb(Y + ' = ' + K)}로 둘러싸인 도형의 넓이가 ${area}일 때, ${K}의 값을 모두 구하시오.`, [{ answer: y0 - h, signed: true }, { answer: y0 + h, signed: true }], {
              unordered: true, shown: `${iq(y0 - h)}, ${iq(y0 + h)}`,
              explain: `둘러싸인 도형은 가로의 길이가 ${nb(`${iq(x2)} − ${x1 < 0 ? '(' + iq(x1) + ')' : x1} = ${x2 - x1}`)}인 직사각형이므로 세로의 길이는 ${area} ÷ ${x2 - x1} = ${h}이다. 직선 ${nb(Y + ' = ' + K)}는 직선 ${yEq(y0)}에서 위쪽이나 아래쪽으로 ${h}만큼 떨어져 있으므로 ${K} = ${iq(y0 + h)} 또는 ${K} = ${iq(y0 - h)}이다.`,
              facts: { calc: [[`${jn(y0)}-${area}/(${jn(x2)}-${jn(x1)})`, 0], [`${jn(y0)}+${area}/(${jn(x2)}-${jn(x1)})`, 1]], rule: 'rect-coef-both' }
            });
          }, { count: 2 }),
          T('axis-segment-on-vertical', '두 그래프가 직선 x = p와 만나는 두 점 사이의 길이', '①31', (d) => {
            // 두 일차방정식의 y의 계수는 ±1 이어서 만나는 점의 y좌표가 정수이다.
            const v = d.until(() => { const l1 = { a: nz(d, -3, 3), b: pm(d), c: nz(d, -7, 7) }, l2 = { a: nz(d, -3, 3), b: pm(d), c: nz(d, -7, 7) }, p = nz(d, -3, 3); return { l1, l2, p, yA: -(l1.a * p + l1.c) / l1.b, yB: -(l2.a * p + l2.c) / l2.b }; }, (w) => w.yA - w.yB >= 2 && w.yA - w.yB <= 20 && qcmp(slope(w.l1), slope(w.l2)) !== 0);
            const { l1, l2, p, yA, yB } = v;
            return N(`두 일차방정식 ${gen(l1)}, ${gen(l2)}의 그래프가 직선 ${xEq(p)}${tl(p, '과/와')} 만나는 점을 각각 A, B라 할 때, 선분 AB의 길이는?`, yA - yB, {
              explain: `${gen(l1)}에 ${X} = ${iq(p)}${tl(p, '을/를')} 대입하면 ${Y} = ${iq(yA)}이므로 A${pt(p, yA)}이다. ${gen(l2)}에 ${X} = ${iq(p)}${tl(p, '을/를')} 대입하면 ${Y} = ${iq(yB)}이므로 B${pt(p, yB)}이다. 두 점의 ${X}좌표가 같으므로 선분 AB의 길이는 ${nb(`${iq(yA)} − ${yB < 0 ? '(' + iq(yB) + ')' : yB} = ${yA - yB}`)}이다.`,
              facts: { value: `(-(${jn(l1.a)}*${jn(p)}+${jn(l1.c)})/${jn(l1.b)})-(-(${jn(l2.a)}*${jn(p)}+${jn(l2.c)})/${jn(l2.b)})`, unseen: [1] }
            });
          })
        ]
      },
      { id: 'line', title: '직선의 방정식', standard: STD1, types: [] },
      { id: 'meet', title: '두 직선의 교점과 연립방정식의 해', standard: STD2, types: [] },
      { id: 'count', title: '두 직선의 위치 관계와 연립방정식의 해의 개수', standard: STD2, types: [] },
      { id: 'area', title: '직선으로 둘러싸인 도형의 넓이', standard: STD2, types: [] }
    ]
  });

  // 같은 단원의 다른 파일(8-1-6b.js, 8-1-6c.js)이 함께 쓰는 도구
  B.kit.m816 = {
    STD1, STD2, keep, src, spun, T, X, Y, A, Bv, Cv, K, TAG6, QUAD, num, jn, iq, sgn, tl, un, Lt, sum, side, eq0, eqR, gen, std, fn, xEq, yEq, slope, yint, xint, norm, byFn, byCuts, through, onLine, cross, X0, Y0, missing,
    cx, pt, ptj, tagRows, picks, lineAns, pick1, axisPick, ITALIC, HALO, cuts, foot, pl, GRID, board, bare, mini, FRS, intLine
  };
})(typeof window !== 'undefined' ? window : globalThis);
