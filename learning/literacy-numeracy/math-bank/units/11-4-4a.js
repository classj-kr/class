// 고등학교 기하 Ⅱ-1 공간도형(11-4-4) — 단원 틀·단원 안의 도구와 앞쪽 묶음
// (평면의 결정 조건과 두 직선의 위치 관계, 직선과 평면의 위치 관계, 두 평면의 위치 관계와 위치 관계의 증명).
// 수집해 둔 천재 T셀파 기하(전인태, 2022 개정)의 교과서·평가 자료에서 뽑은 문제 꼴 목록(기본꼴_1 29꼴, 기본꼴_2 28꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음 / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/11-4-4/싣기_대조표.md 에 있다.
// (삼수선 정리·이면각·정사영은 11-4-4b.js 에, 실력 문항은 11-4-4c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번.
// 영역은 기하 Ⅱ 「공간도형과 공간좌표」. 성취기준은 12기하02-01(직선과 직선, 직선과 평면, 평면과 평면의 위치 관계에 대한 간단한 증명),
// 12기하02-02(삼수선 정리), 12기하02-03(도형의 정사영). 교육과정 원문(4999~5026줄)에 「다루지 않는다」는 줄은 없다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(입체 그림·길이·각·기호로 쓴 문장), 묻는 것(개수·각·값·고르기·빈칸·차례), 푸는 길
//    (바로 / 평행이동해 만나게 하기 / 삼수선으로 직각 찾기 / 정사영의 넓이로)이 다르면 따로 싣는다. 수만 다른 것은 한 번만 싣는다.
//  - 중학교 1학년 「기본 도형」과 같은 일(직육면체·각기둥의 모서리·면의 위치 관계, ①4·①9·①14)도 싣는다(조율 결정). 같은 과목의 다른 단원과 같은 일
//    (②11 좌표로 직선과 좌표평면이 이루는 각 — 11-4-5 공간좌표)은 그쪽에 둔다.
//  - 입체는 좌표로 짓고(x 앞쪽, y 오른쪽, z 위) 그 좌표로 위치 관계·각·길이를 셈해 답을 낸다. 그림도 같은 좌표로 그리므로 길이·직각 표시가 셈과 맞는다.
//    보이지 않는 모서리(보는 쪽에서 가려진 면끼리 만나는 모서리)는 점선이다. 꼭짓점 이름은 교과서와 같다(직육면체 윗면 ABCD·아랫면 EFGH, A 앞 왼쪽 위).
//  - 답: 개수·각(도)·정수는 수 칸, 분수는 분자·분모 칸(크기가 같은 분수도 맞게 친다), 근호가 든 값은 「[ ]√[ ]」(근호 앞의 수가 1이면 1을 적는다),
//    분모를 유리화한 값은 「[ ]√[ ]/[ ]」, a + b√c 는 칸 셋. 한 유형(한 차례)의 칸 모양은 씨앗이 바뀌어도 같다(수를 고를 때 값의 꼴을 걸러 맞춘다).
//    값의 꼴이 수마다 달라지는 꼴(세 코사인의 곱, 30°·45°·60°가 섞이는 그림자 따위)은 고르기로 낸다. 길이·넓이·각·코사인은 음수가 될 수 없어 부호 단추를 달지 않는다.
//  - 원문이 a + b, p + q, k², m + n, 3l 로 묶어 물은 곳은 값을 그대로(칸마다) 묻는다. 원문이 어긋난 다섯 곳(꼴 목록 머리)은 바로잡아 지었다.
//  - 검사 근거: 개수는 facts.count(모서리마다 참·거짓을 좌표로 셈한 것), 고르기는 facts.truth(코드가 셈한 참·거짓), 근호가 든 값은 값의 제곱을
//    문제의 수로 적은 식에서 칸의 수를 다시 셈한다(sqCalc). 문제에 숫자로 없는 수(지수의 2 따위)는 seal 이 facts.unseen 에 밝힌다.
//
// 뺀 것과 까닭(11-4-4b.js, 11-4-4c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 같은 과목의 다른 단원 몫: ②11(대단원 평가 22 — 좌표공간의 두 점을 지나는 직선과 xy평면이 이루는 각, 11-4-5 공간좌표).
//  - 고르기로도 바꿀 수 없는 그리기: 없음(②8 변형·②27은 알맞은 모양 고르기로 바꾸었다).
//  - 공간좌표 중단원 평가 16·21(11-4-5 가 맡기로 한 것)은 이 단원에 다시 싣지 않았다.
// 바꾸어 실은 것(조율 결정): 서술 ①3·①13 변형(자유 증명)·②1 → 고르기, ①8·①23·②3·②15 → 늘 같은 답이 나오지 않게 수를 바꿈,
//  ①5·①21·②6·②10·②18·②19 의 묶어 묻는 원문(a + b, p + q, m + n, 3l) → 값 그대로(칸마다), ②24 → 문제 글을 원문 답(밑면 자리를 뺀 넓이)에 맞게.
//  실력에 둔 것: ①2 ①27 ①28 ①29 ②4 ②6 ②17(전교대08) ②18 ②19 ②23 ②24 ②28 — 실력 파일(11-4-4c.js) 머리에 까닭이 있다.
// 묻는 말: 수나 값은 「~은?/~는?」, 개수는 「몇 개인가?」, 시키는 말은 「~하시오.」 길이는 띄어 적는다(6 cm).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, frac, lines, N, C, F, inline } = B.kit;
  const { MINUS, Q, qadd, qmul, qdiv, qneg, qabs, qcmp, fl, nb, tail, V, rt, grp, sqParts, SG, lcm } = B.kit.mid;
  const { RAD, awayFrom, Board } = B.kit.mgeo;
  const { proj, jh, esc } = B.kit.hs;
  const UNIT = '11-4-4', S1 = '12기하02-01', S2 = '12기하02-02', S3 = '12기하02-03';

  // ── 근호가 든 수(9-2-1a.js 와 같은 방법) ──
  // 수는 항 { q: 유리수, m: 근호 안 }의 배열이다. m 은 제곱인 인수가 없는 자연수(유리수 항은 1)이고 m 이 작은 차례로 둔다. 0은 빈 배열이다.
  function norm(list) {
    const by = new Map();
    for (const t of list) by.set(t.m, by.has(t.m) ? qadd(by.get(t.m), t.q) : t.q);
    return [...by.entries()].filter(([, q]) => q.p !== 0).sort((x, y) => x[0] - y[0]).map(([m, q]) => ({ q, m }));
  }
  const num = (p, q) => norm([{ q: Q(p, q == null ? 1 : q), m: 1 }]);
  const sqrtQ = (x) => { if (x.p === 0) return []; const [s, m] = sqParts(x.p * x.q); return [{ q: Q(s, x.q), m }]; };   // √x (x 는 0 이상의 유리수)
  const rad = (a, m, c) => { const [s, r] = sqParts(m); return norm([{ q: Q(a * s, c || 1), m: r }]); };              // a√m/c
  const vadd = (x, y) => norm(x.concat(y)), vneg = (x) => x.map((t) => ({ q: qneg(t.q), m: t.m })), vsub = (x, y) => vadd(x, vneg(y));
  const tmul = (s, t) => { const [k, m] = sqParts(s.m * t.m); return { q: qmul(qmul(s.q, t.q), Q(k)), m }; };
  const vmul = (x, y) => norm(x.flatMap((s) => y.map((t) => tmul(s, t))));
  function vinv(x) {
    if (x.length === 1) return [{ q: qdiv(Q(1), qmul(x[0].q, Q(x[0].m))), m: x[0].m }];
    throw new Error('나눌 수 없는 꼴이다');
  }
  const vdiv = (x, y) => vmul(x, vinv(y));
  const vfl = (x) => x.reduce((s, t) => s + fl(t.q) * Math.sqrt(t.m), 0);
  const veq = (x, y) => x.length === y.length && x.every((t, i) => t.m === y[i].m && qcmp(t.q, y[i].q) === 0);
  // √(분자/분모) — 분자·분모는 0 이상의 정수
  const sqrtFrac = (n, dd) => sqrtQ(Q(n, dd));
  // 값의 꼴: int 정수, frac 정수가 아닌 유리수, rad a√m, radfrac a√m/c(c ≥ 2), sum a + b√m(a, b 정수), other
  function kindOf(x) {
    if (!x.length) return 'int';
    if (x.length === 1) { const t = x[0]; if (t.m === 1) return t.q.q === 1 ? 'int' : 'frac'; return t.q.q === 1 ? 'rad' : 'radfrac'; }
    if (x.length === 2 && x[0].m === 1 && x.every((t) => t.q.q === 1)) return 'sum';
    return 'other';
  }
  const termH = (t) => { const a = qabs(t.q); if (t.m === 1) return a.q === 1 ? String(a.p) : frac(a.p, a.q); const top = (a.p === 1 ? '' : a.p) + rt(t.m); return a.q === 1 ? top : frac(top, a.q); };
  // 화면 글
  function vh(x) {
    if (!x.length) return '0';
    if (x.length === 1) return nb((x[0].q.p < 0 ? MINUS : '') + termH(x[0]));
    const L = x.reduce((l, t) => lcm(l, t.q.q), 1);
    const body = x.map((t, i) => { const c = qmul(t.q, Q(L)).p, s = Math.abs(c), h = t.m === 1 ? String(s) : (s === 1 ? '' : s) + rt(t.m); return (i === 0 ? (c < 0 ? MINUS : '') : c < 0 ? ' ' + MINUS + ' ' : ' + ') + h; }).join('');
    return nb(L === 1 ? body : frac(body, L));
  }
  // 그림 설명(aria-label)·풀이에 적는 글: 2√3/3
  function vt(x) {
    if (!x.length) return '0';
    const L = x.reduce((l, t) => lcm(l, t.q.q), 1);
    const body = x.map((t, i) => { const c = qmul(t.q, Q(L)).p, s = Math.abs(c), h = t.m === 1 ? String(s) : (s === 1 ? '' : s) + '√' + t.m; return (i === 0 ? (c < 0 ? MINUS : '') : c < 0 ? ' ' + MINUS + ' ' : ' + ') + h; }).join('');
    return L === 1 ? body : (x.length > 1 ? '(' + body + ')' : body) + '/' + L;
  }
  // 값 뒤의 토씨: 읽을 때 끝에 오는 수(근호 안의 수, 분수는 분자)
  const lastNum = (x) => { if (!x.length) return 0; const t = x[x.length - 1]; return t.m > 1 ? t.m : Math.abs(t.q.p); };
  const vj = (x, pair) => nb(vh(x) + tail(lastNum(x), pair));

  // ── 검사 근거 ──
  const stripH = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  // 문제(글·그림·보기)에 숫자로 적히지 않은 수를 facts.unseen 에 밝힌다(검사와 같은 길로 읽는다).
  function seal(item) {
    const f = item.facts || (item.facts = {});
    const seen = stripH([item.text, item.figure || ''].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, ' $1 '));
    const shown = new Set((seen.match(/\d+/g) || []).concat(seen.match(/\d+\.\d+/g) || [], seen.replace(/(\d) (?=\d)/g, '$1').match(/\d+/g) || []));
    const exprs = (f.calc || []).map(([t]) => t).concat(f.value !== undefined ? [f.value] : []);
    const miss = new Set(f.unseen || []);
    for (const t of exprs) for (const n of t.match(/\d+(?:\.\d+)?/g) || []) if (!shown.has(n)) miss.add(Number(n));
    if (miss.size) f.unseen = [...miss];
    return item;
  }
  // 값의 제곱을 문제에 적힌 수로 적은 식 sq = [분자 식, 분모 식](둘 다 정수가 되는 식)에서 칸마다의 수를 다시 셈하는 식을 짓는다.
  // 칸 차례 at 부터: frac 은 분자·분모, rad 는 계수·근호 안, radfrac 은 계수·근호 안·분모. 셈은 나누어떨어지는 정수와 제곱수의 제곱근뿐이라 정확하다.
  function sqCalc(x, sq, at0) {
    const [n, dd] = sq, i = at0 || 0, t = x[0], k = kindOf(x);
    if (k === 'int') return [[`((${n})/(${dd}))**0.5`, i]];
    const a = Math.abs(t.q.p), c = t.q.q;
    if (k === 'frac') return [[`((${n})*${c}**2/(${dd}))**0.5`, i], [`((${dd})*${a}**2/(${n}))**0.5`, i + 1]];
    if (k === 'rad') return [[`((${n})/((${dd})*${t.m}))**0.5`, i], [`(${n})/((${dd})*${a}**2)`, i + 1]];
    if (k === 'radfrac') return [[`((${n})*${c}**2/((${dd})*${t.m}))**0.5`, i], [`(${n})*${c}**2/((${dd})*${a}**2)`, i + 1], [`((${dd})*${a}**2*${t.m}/(${n}))**0.5`, i + 2]];
    throw new Error('sqCalc: ' + k);
  }
  // 값의 꼴대로 칸의 수를 그대로 적는 근거(값을 문제의 수로 다시 셈할 길이 없을 때 — 정육면체처럼 수가 없는 그림. 답은 따로 지은 풀이로 맞춰 본다)
  function plainCalc(x, at0) {
    const i = at0 || 0, k = kindOf(x), t = x[0];
    if (k === 'int') return [[String(x.length ? Math.abs(t.q.p) : 0), i]];
    if (k === 'frac') return [[String(Math.abs(t.q.p)), i], [String(t.q.q), i + 1]];
    if (k === 'rad') return [[String(t.q.p), i], [String(t.m), i + 1]];
    if (k === 'radfrac') return [[String(t.q.p), i], [String(t.m), i + 1], [String(t.q.q), i + 2]];
    if (k === 'sum') return [[String(x[0].q.p), i], [String(x[1].q.p), i + 1], [String(x[1].m), i + 2]];
    throw new Error('plainCalc: ' + k);
  }

  // ── 답 ──
  const NOTE_R = '(분모를 유리화하고, 근호 앞의 수가 1이면 1을 적는다.)';
  const ONE = '(근호 앞의 수가 1이면 1을 적는다.)';
  const more = (o, facts) => ({ figure: o.figure, explain: o.explain, facts: Object.assign({}, facts || {}, o.facts || {}, o.rule ? { rule: o.rule } : {}) });
  const unitOf = (o) => (o.unit ? ' ' + o.unit : '');
  // 정수 하나. o.value: 다시 셈하는 식(없으면 sq 나 수 그대로)
  function aInt(text, x, o) {
    if (kindOf(x) !== 'int') throw new Error('정수가 아니다: ' + vt(x));
    const v = x.length ? x[0].q.p : 0;
    const facts = o.value ? { value: o.value } : o.sq ? { calc: sqCalc(x, o.sq) } : { value: String(v) };
    return seal(N(text, v, Object.assign(more(o, facts), { unit: o.unit })));
  }
  // 각의 크기(도)
  const aDeg = (text, deg, o) => seal(N(text, deg, Object.assign(more(o, { value: o.value || String(deg) }), { unit: '°' })));
  // 개수: flags 는 센 것마다 참·거짓(검사가 참의 개수로 답을 다시 센다)
  const aCount = (text, flags, o) => seal(N(text, flags.filter(Boolean).length, Object.assign(more(o, { count: flags.map(Boolean) }), { unit: '개' })));
  // 정수가 아닌 분수 하나(크기가 같은 분수를 모두 받는다)
  function aFrac(text, x, o) {
    if (kindOf(x) !== 'frac') throw new Error('분수가 아니다: ' + vt(x));
    const q = x[0].q, facts = o.value ? { value: o.value } : o.sq ? { calc: sqCalc(x, o.sq) } : { value: q.p + '/' + q.q };
    return seal(F(text, Math.abs(q.p), q.q, Object.assign(more(o, facts), { improper: Math.abs(q.p) > q.q, anyForm: true, unit: o.unit })));
  }
  // a√m (a ≥ 1, 양수) — 근호 앞의 수가 1이어도 칸 둘
  function aRad(text, x, o) {
    if (kindOf(x) !== 'rad' || x[0].q.p < 1) throw new Error('a√m 꼴이 아니다: ' + vt(x));
    const t = x[0], facts = { calc: o.sq ? sqCalc(x, o.sq) : plainCalc(x) };
    return seal(inline(text + ' ' + ONE, grp('{0}' + rt('{1}') + unitOf(o)), [{ answer: t.q.p }, { answer: t.m }], Object.assign(more(o, facts), { shown: vh(x) + unitOf(o) })));
  }
  // a√m/c (분모를 유리화한 꼴)
  function aRadFrac(text, x, o) {
    if (kindOf(x) !== 'radfrac' || x[0].q.p < 1) throw new Error('a√m/c 꼴이 아니다: ' + vt(x));
    const t = x[0], facts = { calc: o.sq ? sqCalc(x, o.sq) : plainCalc(x) };
    return seal(inline(text + ' ' + NOTE_R, grp(frac('{0}' + rt('{1}'), '{2}') + unitOf(o)), [{ answer: t.q.p }, { answer: t.m }, { answer: t.q.q }],
      Object.assign(more(o, facts), { shown: vh(x) + unitOf(o) })));
  }
  // a + b√m (a, b 는 자연수)
  function aSum(text, x, o) {
    if (kindOf(x) !== 'sum' || x[0].q.p < 1 || x[1].q.p < 1) throw new Error('a + b√m 꼴이 아니다: ' + vt(x));
    const [r, t] = x, calc = o.calc || plainCalc(x);
    return seal(inline(text + ' ' + ONE, grp('{0}') + ' + ' + grp('{1}' + rt('{2}') + unitOf(o)), [{ answer: r.q.p }, { answer: t.q.p }, { answer: t.m }],
      Object.assign(more(o, { calc }), { shown: vh(x) + unitOf(o) })));
  }
  // 값의 꼴에 맞는 칸으로 낸다(한 유형 안에서 꼴이 하나로 정해지게 수를 고른 뒤에만 쓴다).
  function aVal(text, x, o) {
    const k = kindOf(x);
    if (k === 'int') return aInt(text, x, o);
    if (k === 'frac') return aFrac(text, x, o);
    if (k === 'rad') return aRad(text, x, o);
    if (k === 'radfrac') return aRadFrac(text, x, o);
    if (k === 'sum') return aSum(text, x, o);
    throw new Error('aVal: ' + k);
  }
  // 고르기: 보기(값의 배열) 가운데 정답이 하나뿐인지 본다. o.sort: 작은 값부터 늘어놓는다. o.show: 값을 보기 글로 바꾸는 함수
  function aPick(d, text, right, wrongs, o) {
    const pool = [right];
    for (const w of wrongs) if (pool.length < (o.count || 5) && w && !pool.some((p) => Math.abs(vfl(p) - vfl(w)) < 1e-9)) pool.push(w);
    if (pool.length < 4) return null;
    const rows = o.sort === false ? d.shuffle(pool) : pool.slice().sort((x, y) => vfl(x) - vfl(y)), at0 = rows.findIndex((r) => veq(r, right));
    const show = o.show || vh;
    return seal(C(text, rows.map(show), at0, more(o, { truth: rows.map((r) => veq(r, right)), want: true })));
  }
  // 글 보기 고르기: rows [[글, 참인가]] 에서 참인 것이 하나뿐이어야 한다. o.keep: 차례를 섞지 않는다.
  function pickRows(d, text, rows, o) {
    const list = o.keep ? rows : d.shuffle(rows), at0 = list.findIndex((r) => r[1]);
    if (list.filter((r) => r[1]).length !== 1 || new Set(list.map((r) => stripH(r[0]))).size !== list.length) throw new Error('보기가 맞지 않다');
    return seal(C(text, list.map((r) => r[0]), at0, more(o, { truth: list.map((r) => r[1]), want: true })));
  }
  // ㄱ~ㄹ 가운데 옳은 것을 모두 고른 것: claims [[글, 참인가]]. o.figure 가 있으면 그 밑에 〈보기〉를 붙인다.
  const KS = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ'];
  function pickAll(d, text, claims, o) {
    const right = KS.slice(0, claims.length).filter((_, i) => claims[i][1]);
    if (!right.length || right.length === claims.length) return null;
    const combos = [right.join(', ')], idx = claims.map((_, i) => i), subsets = [];
    for (let mask = 1; mask < 1 << claims.length; mask += 1) subsets.push(idx.filter((i) => mask & (1 << i)).map((i) => KS[i]).join(', '));
    for (const s of d.shuffle(subsets)) if (combos.length < 5 && !combos.includes(s)) combos.push(s);
    const order = combos.slice().sort((x, y) => x.length - y.length || (x < y ? -1 : 1));
    const box = lines(claims.map((c, i) => KS[i] + '. ' + c[0]));
    return seal(C(text, order, order.indexOf(right.join(', ')), more(Object.assign({}, o, { figure: (o.figure || '') + box }), { truth: order.map((v) => v === right.join(', ')), want: true })));
  }

  // ── 공간의 점과 셈(좌표 [x 앞쪽, y 오른쪽, z 위]) ──
  const sub3 = (p, q) => [p[0] - q[0], p[1] - q[1], p[2] - q[2]];
  const add3 = (p, q) => [p[0] + q[0], p[1] + q[1], p[2] + q[2]];
  const mul3 = (p, k) => [p[0] * k, p[1] * k, p[2] * k];
  const dot3 = (p, q) => p[0] * q[0] + p[1] * q[1] + p[2] * q[2];
  const cross3 = (p, q) => [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]];
  const len3 = (p) => Math.hypot(p[0], p[1], p[2]);
  const lerp3 = (p, q, t) => add3(p, mul3(sub3(q, p), t));
  const avg3 = (list) => [0, 1, 2].map((i) => list.reduce((s, p) => s + p[i], 0) / list.length);
  const EPS = 1e-7;
  const parallel = (u, w) => len3(cross3(u, w)) <= EPS * Math.max(1, len3(u) * len3(w));
  const perpTo = (u, w) => Math.abs(dot3(u, w)) <= EPS * Math.max(1, len3(u) * len3(w));
  // 두 직선(p1p2, q1q2)의 위치 관계: same(같은 직선) · par(평행) · meet(한 점에서 만남) · skew(꼬인 위치)
  function lineRel(p1, p2, q1, q2) {
    const u = sub3(p2, p1), w = sub3(q2, q1), r = sub3(q1, p1);
    if (parallel(u, w)) return len3(r) < EPS || parallel(u, r) ? 'same' : 'par';
    return Math.abs(dot3(r, cross3(u, w))) <= EPS * Math.max(1, len3(r) * len3(u) * len3(w)) ? 'meet' : 'skew';
  }
  // 세 점이 정하는 평면 { n 단위 법선, d } (한 직선 위면 null)
  function planeOf(a, b, c) {
    const n = cross3(sub3(b, a), sub3(c, a)), L = len3(n);
    if (L < EPS) return null;
    let nn = mul3(n, 1 / L);
    const lead = nn.find((x) => Math.abs(x) > 1e-9);
    if (lead < 0) nn = mul3(nn, -1);
    return { n: nn, d: dot3(nn, a) };
  }
  const onPlane = (pl, p) => Math.abs(dot3(pl.n, p) - pl.d) <= 1e-6;
  // 직선 pq 와 평면: in(포함) · par(평행) · perp(수직) · meet(한 점에서 만남, 수직이 아닌)
  function linePlane(p, q, pl) {
    const u = sub3(q, p);
    if (perpTo(u, pl.n)) return onPlane(pl, p) ? 'in' : 'par';
    return parallel(u, pl.n) ? 'perp' : 'meet';
  }
  // 두 평면: same · par · perp · meet
  function planeRel(a, b) {
    if (parallel(a.n, b.n)) return Math.abs(a.d - b.d) < 1e-6 ? 'same' : 'par';
    return perpTo(a.n, b.n) ? 'perp' : 'meet';
  }
  // 두 직선이 이루는 각(도, 0~90)
  const angleOf = (u, w) => Math.acos(Math.min(1, Math.abs(dot3(u, w)) / (len3(u) * len3(w)))) / RAD;

  // ── 입체 ──
  // 입체 { v: { 이름: 좌표 }, faces: ['ABCD', …], edges: ['AB', …] }. 면은 꼭짓점을 둘레 차례로 적는다.
  const edgesOf = (faces) => { const set = new Set(); for (const f of faces) for (let i = 0; i < f.length; i += 1) { const a = f[i], b = f[(i + 1) % f.length]; set.add(a < b ? a + b : b + a); } return [...set].sort(); };
  const solidOf = (v, faces, more2) => Object.assign({ v, faces, edges: edgesOf(faces) }, more2 || {});
  // 직육면체: AD = X(앞뒤), AB = Y(왼쪽 오른쪽), AE = Z(높이). A 는 앞 왼쪽 위, H 는 뒤 왼쪽 아래(보이지 않는 꼭짓점).
  const cuboid = (X, Y, Z) => solidOf({ A: [X, 0, Z], B: [X, Y, Z], C: [0, Y, Z], D: [0, 0, Z], E: [X, 0, 0], F: [X, Y, 0], G: [0, Y, 0], H: [0, 0, 0] },
    ['ABCD', 'EFGH', 'ABFE', 'DCGH', 'ADHE', 'BCGF'], { kind: 'cuboid', top: 'ABCD', bot: 'EFGH' });
  // 정n각기둥(n = 3, 5, 6): 밑면의 꼭짓점 차례는 교과서 그림과 같다(삼각기둥 A 뒤 왼쪽·B 앞·C 뒤 오른쪽, 오각기둥 A 뒤, 육각기둥 A 뒤 왼쪽).
  const RING = { 3: [200, 320, 80], 4: [225, 315, 45, 135], 5: [180, 252, 324, 36, 108], 6: [235, 295, 355, 55, 115, 175] };
  const LET = 'ABCDEFGHIJKL';
  const onRing = (R, deg, z) => [R * Math.cos(deg * RAD), R * Math.sin(deg * RAD), z];
  function prismOf(n, R, h, R2) {
    const top = LET.slice(0, n), bot = LET.slice(n, 2 * n), v = {};
    RING[n].forEach((deg, i) => { v[top[i]] = onRing(R2 || R, deg, h); v[bot[i]] = onRing(R, deg, 0); });
    const faces = [top, bot].concat(top.split('').map((c, i) => c + top[(i + 1) % n] + bot[(i + 1) % n] + bot[i]));
    return solidOf(v, faces, { kind: R2 ? 'frustum' : 'prism', n, top, bot });
  }
  // 한 변이 s 인 정n각형의 외접원의 반지름
  const circR = (n, s) => s / (2 * Math.sin(Math.PI / n));
  // 평행육면체(세 쌍의 면이 평행한 육면체): 윗면을 앞뒤로 sx, 옆으로 sy 만큼 밀었다.
  const slantBox = (X, Y, Z, sx, sy) => { const s = cuboid(X, Y, Z); for (const c of 'ABCD') s.v[c] = add3(s.v[c], [sx, sy, 0]); s.kind = 'slant'; return s; };
  // 정사각뿔 A-BCDE(밑면의 한 변 a, 높이 h): B 왼쪽, C 앞, D 오른쪽, E 뒤
  function pyr4(a, h) {
    const R = a / Math.SQRT2, v = { A: [0, 0, h] };
    ['B', 'C', 'D', 'E'].forEach((c, i) => { v[c] = onRing(R, 280 + 90 * i, 0); });
    return solidOf(v, ['BCDE', 'ABC', 'ACD', 'ADE', 'AEB'], { kind: 'pyr4', apex: 'A', base: 'BCDE' });
  }
  // 정삼각뿔 A-BCD(밑면 한 변 a, 높이 h — 정사면체는 h = a√(2/3)): B 왼쪽, C 앞, D 오른쪽
  function tri3(a, h, names) {
    const nm = names || 'ABCD', R = circR(3, a), v = {};
    v[nm[0]] = [0, 0, h];
    [200, 320, 80].forEach((deg, i) => { v[nm[i + 1]] = onRing(R, deg, 0); });
    const [A, B0, C0, D0] = nm;
    return solidOf(v, [B0 + C0 + D0, A + B0 + C0, A + C0 + D0, A + D0 + B0], { kind: 'tri3', apex: A, base: B0 + C0 + D0 });
  }
  const tetra = (a, names) => tri3(a, a * Math.sqrt(2 / 3), names);
  // 정팔면체 ABCDEF(한 모서리 a): A 위, F 아래, B 왼쪽, C 앞, D 오른쪽, E 뒤
  function octa(a) {
    const r = a / Math.SQRT2, v = { A: [0, 0, r], F: [0, 0, -r] };
    ['B', 'C', 'D', 'E'].forEach((c, i) => { v[c] = onRing(r, 280 + 90 * i, 0); });
    return solidOf(v, ['ABC', 'ACD', 'ADE', 'AEB', 'FBC', 'FCD', 'FDE', 'FEB'], { kind: 'octa' });
  }

  // ── 공간 그림(공용 proj 와 Board 로 그린다) ──
  // 공용 space() 에 없는 것(볼록한 입체의 숨은 모서리 가리기, 공간의 직각 표시, 평면 α, 선분 옆 길이, 각 표시)을 덧붙였다.
  // sp(o): o.u 한 칸(px), o.k 앞쪽(x) 비율, o.ang 앞쪽 방향(도). 모든 점은 [x, y, z] 또는 이미 놓은 점의 이름.
  const HIL = 'stroke:#1d4ed8;stroke-width:2.6';
  const att = (t) => esc(t).replace(/"/g, '&quot;');
  function sp(o) {
    const opt = Object.assign({ u: 26, k: 0.5, ang: 215 }, o || {});
    const b = Board(), P = (p) => proj(p, opt), at3 = {};
    const view = [1, -opt.k * Math.cos(opt.ang * RAD), -opt.k * Math.sin(opt.ang * RAD)];      // 보는 쪽(앞 위 오른쪽)
    const pt = (p) => (typeof p === 'string' ? at3[p] : p);
    const path = (list) => 'M' + list.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L');
    const S = {
      b, P, at3, view,
      put(map) { Object.assign(at3, map); return S; },
      // kind: 'dash' 점선, 'thin' 가는 선, 'hl' 굵은 파란 선(묻는 선분), 'hld' 파란 점선
      seg(p, q, kind) {
        const a = P(pt(p)), c = P(pt(q));
        if (kind === 'hl') b.seg(a, c, undefined, HIL); else if (kind === 'hld') b.seg(a, c, 'cut', 'stroke:#1d4ed8;stroke-width:1.8');
        else b.seg(a, c, kind === 'dash' ? 'cut' : kind === 'thin' ? 'thin' : undefined);
        return S;
      },
      // 볼록한 입체: 보이는 면에 닿은 모서리는 실선, 나머지는 점선. o2.names: false 이면 이름을 적지 않는다, o2.hide: 이름을 적지 않을 꼭짓점들,
      // o2.skip: 긋지 않을 모서리(따로 굵게 그을 것), o2.fill: 보이는 면을 옅게 칠한다.
      solid(sol, o2) {
        const op = o2 || {}; Object.assign(at3, sol.v);
        const heart = avg3(Object.values(sol.v));
        const seen = sol.faces.map((f) => {
          const q = f.split('').map((c) => sol.v[c]);
          let n = cross3(sub3(q[1], q[0]), sub3(q[2], q[0]));
          if (dot3(n, sub3(avg3(q), heart)) < 0) n = mul3(n, -1);
          return dot3(n, view) > 1e-9;
        });
        const vis = new Map();
        sol.faces.forEach((f, i) => { for (let j = 0; j < f.length; j += 1) { const a = f[j], c = f[(j + 1) % f.length], key = a < c ? a + c : c + a; vis.set(key, Boolean(vis.get(key) || seen[i])); } });
        if (op.fill) sol.faces.forEach((f, i) => { if (seen[i]) b.poly(f.split('').map((c) => P(sol.v[c])), 'fill:' + op.fill + ';stroke:none'); });
        const skip = new Set((op.skip || []).flatMap((e) => [e, e[1] + e[0]]));
        for (const pass of [false, true]) vis.forEach((shown, key) => { if (shown === pass && !skip.has(key)) b.seg(P(sol.v[key[0]]), P(sol.v[key[1]]), shown ? undefined : 'cut'); });
        S.hidden = (e) => vis.get(e[0] < e[1] ? e : e[1] + e[0]) === false;
        // 두 꼭짓점을 잇는 선분이 보이는 면 위에 있는가(모서리·면의 대각선). 입체 속을 지나는 선분은 보이지 않는다.
        S.shown = (p, q) => sol.faces.some((f, i) => seen[i] && f.includes(p) && f.includes(q));
        if (op.names !== false) { const c2 = P(heart); for (const [nm, p] of Object.entries(sol.v)) if (!(op.hide || '').includes(nm)) b.name(P(p), nm, awayFrom(P(p), [c2])); }
        return S;
      },
      // 두 꼭짓점을 잇는 선분을 굵게(보이는 면 위에 있으면 굵은 파란 선, 아니면 파란 점선) — solid 다음에 쓴다
      edge(e) { return S.seg(e[0], e[1], S.shown && S.shown(e[0], e[1]) ? 'hl' : 'hld'); },
      // 평면(평행사변형): 가운데 c, 두 변 벡터 u·w 의 절반. label: 평면 이름(α), corner: 이름을 적을 귀(0~3)
      plane(c, u, w, label, corner) {
        const cs = [add3(add3(c, u), w), add3(sub3(c, u), w), sub3(sub3(c, u), w), sub3(add3(c, u), w)].map(P);
        b.poly(cs, 'fill:rgba(37,99,235,0.07);stroke:#94a3b8;stroke-width:1.1');
        if (label) { const k = corner == null ? 2 : corner, m = [(cs[0][0] + cs[1][0] + cs[2][0] + cs[3][0]) / 4, (cs[0][1] + cs[1][1] + cs[2][1] + cs[3][1]) / 4], p = cs[k];
          b.text([p[0] + (m[0] - p[0]) * 0.16, p[1] + (m[1] - p[1]) * 0.16], label); }
        return S;
      },
      // 공간의 직각 표시: 꼭짓점 v 에서 p 쪽과 q 쪽(셋 다 공간의 점)
      right(v, p, q) {
        const V0 = pt(v), e1 = sub3(pt(p), V0), e2 = sub3(pt(q), V0), u1 = mul3(e1, 1 / len3(e1)), u2 = mul3(e2, 1 / len3(e2));
        const l1 = Math.hypot(...sub3([...P(add3(V0, u1)), 0], [...P(V0), 0])), l2 = Math.hypot(...sub3([...P(add3(V0, u2)), 0], [...P(V0), 0]));
        const s = 7.5 / Math.max(l1, l2, 1e-6), a1 = P(add3(V0, mul3(u1, s))), a2 = P(add3(add3(V0, mul3(u1, s)), mul3(u2, s))), a3 = P(add3(V0, mul3(u2, s)));
        b.shape(path([a1, a2, a3]), [a1, a2, a3], 'fill:none;stroke:#b42318;stroke-width:1.2');
        return S;
      },
      // 각 표시(그림에서 보이는 두 변 사이의 호)와 글
      angle(v, p, q, label) { b.corner(P(pt(v)), P(pt(p)), P(pt(q)), label, { square: false }); return S; },
      // 선분 옆의 길이 글(inside 쪽의 반대편에 적는다)
      len(p, q, label, inside) { b.beside(P(pt(p)), P(pt(q)), label, P(pt(inside))); return S; },
      dot(p) { b.dot(P(pt(p))); return S; },
      // 점의 이름: ang(도, 화면에서 오른쪽이 0)을 주지 않으면 others(점 이름이나 좌표) 반대쪽에 적는다
      name(p, label, ang, others) { const q = P(pt(p)); b.name(q, label, ang != null ? ang : awayFrom(q, (others || []).map((x) => P(pt(x))))); return S; },
      text(p, html, o2) { b.text(P(pt(p)), html, o2); return S; },
      // 공간 곡선 f(t)(t0 → t1)를 꺾은선으로. kind: 'dash' 점선, 'thin' 가는 선
      curve(f, t0, t1, kind, n) {
        const k = n || 48, list = [];
        for (let i = 0; i <= k; i += 1) list.push(P(f(t0 + (t1 - t0) * i / k)));
        b.shape(path(list), list, 'fill:none;' + (kind === 'dash' ? 'stroke:#5b6770;stroke-width:1.2;stroke-dasharray:4 3' : kind === 'thin' ? 'stroke-width:1.1' : ''));
        return S;
      },
      // 공간 다각형을 옅게 칠한다
      face(list, color) { b.poly(list.map((p) => P(pt(p))), 'fill:' + (color || 'rgba(251,191,36,0.35)') + ';stroke:none'); return S; },
      svg(label) { return b.svg(att(label)); }
    };
    return S;
  }
  // 그림이 너비 w(px), 높이 h 안에 들게 한 칸의 크기를 고른다
  function fitU(pts, w, h, o) {
    const opt = Object.assign({ u: 1, k: 0.5, ang: 215 }, o || {}), P = pts.map((p) => proj(p, opt));
    const xs = P.map((p) => p[0]), ys = P.map((p) => p[1]);
    return Math.min((w || 200) / Math.max(1e-6, Math.max(...xs) - Math.min(...xs)), (h || 170) / Math.max(1e-6, Math.max(...ys) - Math.min(...ys)));
  }
  // 입체 그림 하나: 크기를 맞추고 입체를 그린 뒤 draw(S)로 덧그린다.
  function solidFig(sol, label, draw, o) {
    // 오각기둥·육각기둥은 윗면이 좁게 눌려 이름이 겹치므로 앞쪽을 조금 더 펼쳐 본다.
    const wide = sol.kind === 'prism' && sol.n >= 5, op = o || {}, view = { k: op.k || (wide ? (sol.n === 6 ? 0.7 : 0.85) : 0.6), ang: op.ang || (wide ? (sol.n === 6 ? 215 : 228) : 215) };
    const S = sp(Object.assign({ u: fitU(Object.values(sol.v), op.w || 190, op.h || 160, view) }, view));
    S.solid(sol, op);
    if (draw) draw(S);
    return S.svg(label);
  }

  // ── 글 ──
  const SOLID_WORD = { cuboid: '직육면체', cube: '정육면체', slant: '평행육면체', pyr4: '정사각뿔', tri3: '삼각뿔', tetra: '정사면체', octa: '정팔면체' };
  const PRISM_WORD = { 3: '삼각기둥', 5: '오각기둥', 6: '육각기둥' };
  const nameOf = (sol) => (sol.kind === 'prism' ? '정' + PRISM_WORD[sol.n] + ' ' + sol.top + '-' + sol.bot : sol.kind === 'frustum' ? '삼각뿔대 ' + sol.top + '-' + sol.bot
    : sol.kind === 'pyr4' ? '정사각뿔 A-BCDE' : sol.kind === 'octa' ? '정팔면체 ABCDEF' : (SOLID_WORD[sol.word || sol.kind] || '') + (sol.kind === 'cuboid' || sol.kind === 'slant' ? ' ABCD-EFGH' : ''));
  const saidOf = (sol) => nameOf(sol) + '의 겨냥도. 보이지 않는 모서리는 점선이다.';
  const sg = (name, v) => nb(SG(name) + ' = ' + v);                          // 「AB = 3」
  const vg = (name, v) => nb(SG(name) + ' = ' + v);                          // 근호가 든 값도 같은 꼴
  const al = V('α'), be = V('β'), ga = V('γ'), th = V('θ'), vl = V('l'), vm = V('m'), vn = V('n');
  const ALPHA = '<tspan style="font-style:italic;font-family:\'MB Math\',\'Times New Roman\',serif">α</tspan>';
  const cosT = nb('cos ' + th), sinT = nb('sin ' + th), tanT = nb('tan ' + th);
  const COS3 = { 30: rad(1, 3, 2), 45: rad(1, 2, 2), 60: num(1, 2), 90: [] };
  const SIN3 = { 30: num(1, 2), 45: rad(1, 2, 2), 60: rad(1, 3, 2), 90: num(1) };
  const TAN3 = { 30: rad(1, 3, 3), 45: num(1), 60: rad(1, 3) };
  const pick = (d, list) => list[d.int(0, list.length - 1)];
  const srcOf = (ref) => '수집본 기본 자료(' + ref + ')';
  const retry = (make) => (d, n) => { for (let i = 0; i < 3000; i += 1) { const item = make(d, n); if (item) return item; } throw new Error('조건에 맞는 문항을 만들지 못했다'); };
  const T = (id, title, ref, make, more2) => Object.assign({ id, level: '기본', title, source: srcOf(ref), make: retry(make) }, more2 || {});
  const H = (id, title, ref, make, more2) => Object.assign({ id, level: '실력', title, source: srcOf(ref), make: retry(make) }, more2 || {});
  // 값(√ 가 든 수)을 코사인·사인으로: cos = |u·w|/(|u||w|) 의 제곱을 정수 둘로
  const cosSq = (u, w) => [Math.round(dot3(u, w) ** 2), Math.round(dot3(u, u) * dot3(w, w))];
  const valOfSq = (n, dd) => sqrtFrac(n, dd);

  B.kit.u1144 = {
    UNIT, S1, S2, S3, norm, num, sqrtQ, rad, vadd, vsub, vmul, vdiv, vfl, veq, sqrtFrac, kindOf, vh, vt, vj, lastNum, stripH, seal, sqCalc, plainCalc,
    NOTE_R, ONE, more, aInt, aDeg, aCount, aFrac, aRad, aRadFrac, aSum, aVal, aPick, pickRows, pickAll, KS,
    sub3, add3, mul3, dot3, cross3, len3, lerp3, avg3, parallel, perpTo, lineRel, planeOf, onPlane, linePlane, planeRel, angleOf,
    edgesOf, solidOf, cuboid, prismOf, circR, slantBox, pyr4, tri3, tetra, octa, onRing, RING,
    HIL, sp, fitU, solidFig, nameOf, saidOf, sg, vg, al, be, ga, th, vl, vm, vn, ALPHA, cosT, sinT, tanT, COS3, SIN3, TAN3, pick, retry, T, H, cosSq, valOfSq
  };

  // ── 단원 틀 ──
  B.addUnit({
    id: '11-4-4', grade: 11, semester: 4, no: 4, title: '공간도형', version: 1,
    groups: [
      { id: 'lines', title: '평면의 결정 조건과 두 직선', standard: S1, types: [] },
      { id: 'lineplane', title: '직선과 평면의 위치 관계', standard: S1, types: [] },
      { id: 'planes', title: '두 평면의 위치 관계와 증명', standard: S1, types: [] },
      { id: 'three', title: '삼수선 정리', standard: S2, types: [] },
      { id: 'dihedral', title: '이면각', standard: S2, types: [] },
      { id: 'proj', title: '정사영과 그 길이', standard: S3, types: [] },
      { id: 'area', title: '정사영의 넓이와 그림자', standard: S3, types: [] }
    ]
  });

  // 입체 하나를 고른다(위치 관계 세기에 쓰는 것들).
  function pickSolid(d, kinds) {
    const kind = pick(d, kinds);
    if (kind === 'cuboid') return cuboid(d.int(3, 4), d.int(4, 6), d.int(3, 4));
    if (kind === 'cube') { const s = cuboid(3, 3, 3); s.word = 'cube'; return s; }
    if (kind === 'slant') return slantBox(3, 4, 3, -1, 1.2);
    if (kind === 'p3') return prismOf(3, circR(3, 4), 4);
    if (kind === 'p5') return prismOf(5, circR(5, 2.6), 4);
    if (kind === 'p6') return prismOf(6, 2, 4);
    if (kind === 'f3') return prismOf(3, circR(3, 4.4), 3.4, circR(3, 2));
    throw new Error(kind);
  }
  const REL_WORD = { par: '평행한', meet: '한 점에서 만나는', skew: '꼬인 위치에 있는' };

  // ── 평면의 결정 조건과 두 직선 ──
  B.addTypes(UNIT, 'lines', [
    T('lines-decide', '한 평면을 결정하는 것 고르기', '①1', (d) => {
      const s = prismOf(3, circR(3, 4), 4), v = s.v;
      // 후보: 세 점(언제나 결정), 점과 그 점을 지나지 않는 모서리(결정), 두 직선(만나거나 평행하면 결정, 꼬이면 결정하지 못함)
      const pts = Object.keys(v), lineList = s.edges.concat(['AE', 'BD', 'BF', 'CE', 'AF', 'CD']);
      const make = () => {
        const kind = d.int(0, 3);
        if (kind === 0) { const three = d.shuffle(pts.slice()).slice(0, 3).sort(); return [`세 점 ${three.join(', ')}`, true]; }
        if (kind === 1) { const e = pick(d, s.edges), p = pick(d, pts.filter((c) => !e.includes(c))); return [`점 ${jh(p, '과/와')} 직선 ${e}`, true]; }
        const e1 = pick(d, lineList), e2 = pick(d, lineList.filter((e) => e !== e1 && !(e[0] === e1[1] && e[1] === e1[0])));
        const rel = lineRel(v[e1[0]], v[e1[1]], v[e2[0]], v[e2[1]]);
        if (rel === 'same') return null;
        return [`직선 ${jh(e1, '과/와')} 직선 ${e2}`, rel !== 'skew'];
      };
      const claims = [];
      for (let i = 0; i < 40 && claims.length < 4; i += 1) { const c = make(); if (c && !claims.some((x) => x[0] === c[0])) claims.push(c); }
      if (claims.length < 4) return null;
      const skew = claims.filter((c) => !c[1]).length;
      if (skew < 1 || skew > 2 || claims.filter((c) => /^직선/.test(c[0])).length < 2) return null;
      const figure = solidFig(s, saidOf(s));
      return pickAll(d, `그림과 같은 ${nameOf(s)}에서 한 평면을 결정하는 것만을 〈보기〉에서 있는 대로 고른 것은?`, claims, {
        figure, explain: '한 직선 위에 있지 않은 세 점, 한 직선과 그 위에 있지 않은 한 점, 만나는 두 직선, 평행한 두 직선은 평면을 하나로 정한다. 꼬인 위치에 있는 두 직선은 한 평면 위에 있지 않으므로 평면을 정하지 못한다.'
      });
    }),
    T('lines-chair', '평면의 결정 조건으로 까닭 고르기', '①3', (d, n) => {
      if (n === 0) {
        return pickRows(d, '다리가 3개인 의자는 다리의 길이가 서로 달라도 평평한 바닥에서 흔들리지 않는다. 그 까닭이 되는 평면의 결정 조건은?', [
          ['한 직선 위에 있지 않은 세 점은 한 평면을 결정한다.', true],
          ['한 직선과 그 직선 위에 있지 않은 한 점은 한 평면을 결정한다.', false],
          ['한 점에서 만나는 두 직선은 한 평면을 결정한다.', false],
          ['평행한 두 직선은 한 평면을 결정한다.', false],
          ['꼬인 위치에 있는 두 직선은 한 평면을 결정한다.', false]
        ], { explain: '바닥에 닿는 세 다리 끝은 한 직선 위에 있지 않은 세 점이므로 그 세 점을 지나는 평면이 하나로 정해진다. 그래서 다리의 길이가 달라도 의자가 그 평면 위에 안정되게 놓인다.' });
      }
      return pickRows(d, '다리가 4개인 의자는 다리의 길이가 모두 같지 않으면 흔들리는 경우가 있다. 그 까닭으로 알맞은 것은?', [
        ['네 다리 끝이 한 평면 위에 있지 않으면, 그 가운데 세 점씩이 서로 다른 평면을 정하므로 의자가 이 평면들 사이에서 기울어진다.', true],
        ['네 점은 언제나 한 평면 위에 있으므로 의자가 흔들리지 않는다.', false],
        ['서로 다른 두 점은 한 평면을 결정하므로 의자가 두 다리로 선다.', false],
        ['한 직선 위에 있지 않은 세 점은 평면을 결정하지 못한다.', false]
      ], { explain: '한 평면 위에 있지 않은 네 점에서는 세 점씩 골라 정해지는 평면이 서로 다르다. 바닥은 한 평면이므로 세 다리만 닿고 나머지 하나가 뜨는 경우가 생긴다.' });
    }, { count: 2 }),
    T('lines-edge-rel', '각기둥·직육면체에서 모서리끼리의 위치 관계 세기', '①4', (d, n) => {
      const rel = ['skew', 'par', 'meet'][n], s = pickSolid(d, ['cuboid', 'slant', 'p3', 'p5', 'p6']), v = s.v;
      const e = pick(d, s.edges), others = s.edges.filter((x) => x !== e);
      const flags = others.map((x) => lineRel(v[e[0]], v[e[1]], v[x[0]], v[x[1]]) === rel);
      if (!flags.some(Boolean)) return null;
      const right = others.filter((_, i) => flags[i]);
      return aCount(`그림과 같은 ${nameOf(s)}에서 모서리 ${jh(e, '과/와')} ${REL_WORD[rel]} 모서리는 모두 몇 개인가?`, flags, {
        figure: solidFig(s, saidOf(s)),
        explain: `모서리 ${jh(e, '과/와')} ${REL_WORD[rel]} 모서리는 ${right.join(', ')}로 ${right.length}개이다.` + (rel === 'skew' ? ' 꼬인 위치는 만나지도 않고 평행하지도 않은 것이다.' : '')
      });
    }, { count: 3 }),
    T('lines-edge-rel2', '정팔면체·정사각뿔에서 모서리를 늘린 직선의 위치 관계', '①5', (d, n) => {
      const rel = n === 0 ? 'par' : 'skew', s = d.bool() ? octa(4) : pyr4(4, 3.6), v = s.v;
      const e = pick(d, s.edges), others = s.edges.filter((x) => x !== e);
      const flags = others.map((x) => lineRel(v[e[0]], v[e[1]], v[x[0]], v[x[1]]) === rel);
      if (!flags.some(Boolean)) return null;
      const right = others.filter((_, i) => flags[i]);
      return aCount(`그림과 같은 ${nameOf(s)}의 모서리를 늘린 직선 가운데 직선 ${jh(e, '과/와')} ${REL_WORD[rel]} 직선은 모두 몇 개인가?`, flags, {
        figure: solidFig(s, saidOf(s)),
        explain: `직선 ${jh(e, '과/와')} ${REL_WORD[rel]} 직선은 ${right.map((x) => '직선 ' + x).join(', ')}로 ${right.length}개이다.` + (s.kind === 'octa' && rel === 'par' ? ' 정팔면체에서 마주 보는 모서리는 떨어져 보여도 평행하다.' : '')
      });
    }, { count: 2 }),
    T('lines-angle-special', '두 직선이 이루는 각 — 평행이동해 만나게 하기', '①6', (d, n) => {
      const cube = n === 0, s = cube ? cuboid(3, 3, 3) : octa(4), v = s.v;
      if (cube) s.word = 'cube';
      const cand = cube ? s.edges.concat(['AC', 'BD', 'EG', 'FH', 'AF', 'BE', 'CH', 'DG', 'AH', 'DE', 'BG', 'CF']) : s.edges;
      const p = pick(d, cand), q = pick(d, cand.filter((x) => x !== p));
      const rel = lineRel(v[p[0]], v[p[1]], v[q[0]], v[q[1]]);
      if (rel !== 'skew') return null;
      const ang = Math.round(angleOf(sub3(v[p[1]], v[p[0]]), sub3(v[q[1]], v[q[0]])));
      if (![45, 60, 90].includes(ang)) return null;
      const figure = solidFig(s, saidOf(s) + ` 직선 ${p}와 직선 ${q}를 굵게 나타내었다.`, (S) => { S.edge(p); S.edge(q); });
      const why = ang === 90 ? '수직으로 만나는 두 선분이 보인다' : ang === 60 ? '정삼각형의 두 변이 된다' : '직각이등변삼각형의 빗변과 한 변이 된다';
      return aDeg(`그림과 같은 ${nameOf(s)}에서 두 직선 ${p}, ${jh(q, '이/가')} 이루는 각의 크기는?`, ang, {
        figure, explain: `두 직선은 꼬인 위치에 있으므로 한 직선을 평행이동하여 다른 직선과 만나게 한 뒤 그 각을 잰다. 옮긴 두 직선은 ${why}. 따라서 이루는 각의 크기는 ${ang}°이다.`
      });
    }, { count: 2 }),
    T('lines-angle-len', '두 직선이 이루는 각 — 길이로 코사인·사인', '①7', (d, n) => {
      if (n === 0) {
        // 직육면체에서 이웃한 두 면의 대각선(꼬인 위치) — 한쪽을 평행이동하면 이등변이 아닌 삼각형도 생긴다. cos θ = |u·w|/(|u||w|)
        const X = d.int(1, 4), Y = d.int(1, 4), Z = d.int(1, 4);
        if (new Set([X, Y, Z]).size < 2) return null;
        const s = cuboid(X, Y, Z), v = s.v, pairs = [['AC', 'DG'], ['AC', 'BG'], ['AF', 'CH'], ['BD', 'CF'], ['AH', 'BG'], ['DE', 'BG']], [p, q] = pick(d, pairs);
        if (lineRel(v[p[0]], v[p[1]], v[q[0]], v[q[1]]) !== 'skew') return null;
        const u = sub3(v[p[1]], v[p[0]]), w = sub3(v[q[1]], v[q[0]]), [nn, dd] = cosSq(u, w), x = valOfSq(nn, dd);
        if (kindOf(x) !== 'radfrac' || !nn || x[0].m > 60 || x[0].q.q > 30) return null;
        // 검사 식: 벡터의 성분은 X, Y, Z 이다(AD = X, AB = Y, AE = Z).
        const comp = (P0, Q0) => { const c = sub3(v[Q0], v[P0]); return c.map((t) => Math.abs(t)); };
        const sq2 = (c) => c.map((t, i) => (t ? `${[X, Y, Z][i]}**2` : '')).filter(Boolean).join('+');
        const uu = sq2(comp(p[0], p[1])), ww = sq2(comp(q[0], q[1]));
        const figure = solidFig(s, saidOf(s) + ` AD = ${X}, AB = ${Y}, AE = ${Z}. 직선 ${p}와 직선 ${q}를 굵게 나타내었다.`, (S) => { S.edge(p); S.edge(q); });
        return aRadFrac(`그림과 같이 ${sg('AD', X)}, ${sg('AB', Y)}, ${sg('AE', Z)}인 직육면체 ABCD-EFGH에서 두 직선 ${p}, ${jh(q, '이/가')} 이루는 각의 크기를 ${th}라 할 때, ${cosT}의 값은?`, x, {
          figure, sq: [String(nn), `(${uu})*(${ww})`],
          explain: `한 직선을 평행이동해 두 직선이 만나게 하면 이루는 각은 그대로이다. 두 선분의 길이와 평행이동으로 생긴 삼각형의 세 변을 구해 셈하면 ${cosT} = ${vh(x)}이다.`
        });
      }
      // 정사면체 ABCD 에서 E 는 AB 의 중점, CD 와 DE 가 이루는 각: cos = 1/√3, sin = √2/√3
      const a = d.pick([2, 4, 6]), want = d.pick(['cos', 'sin']), x = want === 'cos' ? rad(1, 3, 3) : rad(1, 6, 3);
      const s = tetra(3.2), v = s.v; v.E = lerp3(v.A, v.B, 0.5);
      const figure = (() => { const S = sp({ u: fitU(Object.values(v), 180, 160), k: 0.5, ang: 215 }); S.solid(tetra(3.2)); S.put({ E: v.E }); S.seg('E', 'C', 'dash').seg('E', 'D', 'hl').seg('C', 'D', 'hl').dot('E').name('E', 'E', 160); return S.svg(`한 모서리의 길이가 ${a}인 정사면체 ABCD. E는 모서리 AB의 중점이고 선분 EC, ED를 그었다.`); })();
      return aRadFrac(`그림과 같이 한 모서리의 길이가 ${a}인 정사면체 ABCD에서 모서리 AB의 중점을 E라 하자. 두 직선 CD, ${jh('DE', '이/가')} 이루는 각의 크기를 ${th}라 할 때, ${want === 'cos' ? cosT : sinT}의 값은?`, x, {
        figure, sq: want === 'cos' ? ['1', '3'] : ['2', '3'],
        explain: `정삼각형 ABC, ABD의 높이이므로 EC = ED = ${vh(rad(a, 3, 2))}이고, 삼각형 ECD는 이등변삼각형이다. CD의 중점을 F라 하면 EF ⊥ CD, ${sg('DF', a / 2)}, EF = ${vh(rad(a, 2, 2))}이므로 ${want === 'cos' ? cosT + ' = DF ÷ DE = ' + vh(x) : sinT + ' = EF ÷ DE = ' + vh(x)}이다.`
      });
    }, { count: 2 }),
    T('lines-diag-perp', '직육면체의 대각선과 면의 대각선이 이루는 각', '①8', (d) => {
      // 밑면이 X × Y, 높이 Z 인 직육면체에서 AG 와 FH: AG 의 정사영은 EG 이고, cos θ = |X² − Y²| / (√(X² + Y² + Z²) √(X² + Y²))
      const X = d.int(2, 5), Y = d.bool() ? X : d.int(2, 5), Z = d.int(2, 5), s = cuboid(X, Y, Z), v = s.v;
      const cosOf = (p, q) => { const [nn, dd] = cosSq(sub3(v[p[1]], v[p[0]]), sub3(v[q[1]], v[q[0]])); return valOfSq(nn, dd); };
      const right = cosOf('AG', 'FH');
      const wrongs = [cosOf('AG', 'EG'), cosOf('AG', 'AE'), cosOf('EG', 'FH'), num(1, 2), [], cosOf('AG', 'EF'), rad(1, 2, 2), rad(1, 3, 3)];
      const figure = solidFig(s, saidOf(s) + ` AD = ${X}, AB = ${Y}, AE = ${Z}. 대각선 AG와 FH를 굵게 나타내었다.`, (S) => { S.seg('A', 'G', 'hld'); S.seg('F', 'H', 'hld'); });
      return aPick(d, `그림과 같이 ${sg('AD', X)}, ${sg('AB', Y)}, ${sg('AE', Z)}인 직육면체 ABCD-EFGH에서 두 직선 AG, ${jh('FH', '이/가')} 이루는 각의 크기를 ${th}라 할 때, ${cosT}의 값은?`, right, wrongs, {
        figure, explain: X === Y
          ? '밑면이 정사각형이므로 밑면의 두 대각선 EG와 FH는 수직이다. 직선 AE는 밑면에 수직이므로 직선 FH는 평면 AEG에 수직이고, 그 평면에 있는 직선 AG와도 수직이다. 따라서 θ = 90°, cos θ = 0이다.'
          : `같은 직육면체를 옆에 붙이거나 성분으로 셈하면, 직선 FH를 평행이동한 직선과 AG가 만드는 삼각형에서 ${cosT} = ${vh(right)}이다.`
      });
    })
  ]);

  // ── 직선과 평면의 위치 관계 ──
  const faceName = (f) => '면 ' + f;
  B.addTypes(UNIT, 'lineplane', [
    T('lp-count', '입체에서 평면과 어떤 위치 관계에 있는 모서리·면 세기', '①9', (d, n) => {
      const s = pickSolid(d, ['cuboid', 'p3', 'p5', 'p6', 'f3']), v = s.v;
      if (n <= 1) {
        const f = pick(d, s.faces), pl = planeOf(v[f[0]], v[f[1]], v[f[2]]), rel = n === 0 ? 'par' : 'meet';
        const flags = s.edges.map((e) => { const r = linePlane(v[e[0]], v[e[1]], pl); return rel === 'meet' ? r === 'meet' || r === 'perp' : r === 'par'; });
        if (!flags.some(Boolean) || flags.every(Boolean)) return null;
        const right = s.edges.filter((_, i) => flags[i]);
        return aCount(`그림과 같은 ${nameOf(s)}에서 ${jh(faceName(f), '과/와')} ${rel === 'par' ? '평행한' : '한 점에서 만나는'} 모서리는 모두 몇 개인가?`, flags, {
          figure: solidFig(s, saidOf(s)), explain: `${jh(faceName(f), '과/와')} ${rel === 'par' ? '평행한' : '한 점에서 만나는'} 모서리는 ${right.join(', ')}로 ${right.length}개이다.`
        });
      }
      const e = pick(d, s.edges), rel = pick(d, ['par', 'in', 'perp']);
      const flags = s.faces.map((f) => { const r = linePlane(v[e[0]], v[e[1]], planeOf(v[f[0]], v[f[1]], v[f[2]])); return r === rel; });
      if (!flags.some(Boolean) || flags.every(Boolean)) return null;
      const right = s.faces.filter((_, i) => flags[i]), word = { par: '평행한', in: '포함하는', perp: '수직인' }[rel];
      return aCount(rel === 'in' ? `그림과 같은 ${nameOf(s)}에서 모서리 ${jh(e, '을/를')} 포함하는 면은 모두 몇 개인가?` : `그림과 같은 ${nameOf(s)}에서 모서리 ${jh(e, '과/와')} ${word} 면은 모두 몇 개인가?`, flags, {
        figure: solidFig(s, saidOf(s)), explain: `${rel === 'in' ? '모서리 ' + jh(e, '을/를') + ' 포함하는' : '모서리 ' + jh(e, '과/와') + ' ' + word} 면은 ${right.map(faceName).join(', ')}로 ${right.length}개이다.`
      });
    }, { count: 3 }),
    T('lp-perp-edges', '평면의 수선과 수직인 모서리 세기', '①10', (d) => {
      const kind = pick(d, ['tetra', 'pyr', 'prism', 'cuboid']);
      let s, line, said, word;
      if (kind === 'tetra') { s = tetra(4); s.v.H = avg3([s.v.B, s.v.C, s.v.D]); line = 'AH'; word = `사면체 ABCD의 꼭짓점 A에서 면 BCD에 내린 수선의 발을 H라 할 때, 선분 ${jh('AH', '과/와')}`; said = '사면체 ABCD와 꼭짓점 A에서 면 BCD에 내린 수선 AH(점선).'; }
      else if (kind === 'pyr') { s = pyr4(4, 3.6); s.v.H = [0, 0, 0]; line = 'AH'; word = `정사각뿔 A-BCDE의 꼭짓점 A에서 밑면에 내린 수선의 발을 H라 할 때, 선분 ${jh('AH', '과/와')}`; said = '정사각뿔 A-BCDE와 꼭짓점 A에서 밑면에 내린 수선 AH(점선).'; }
      else if (kind === 'prism') { s = prismOf(d.pick([3, 5, 6]), 2.2, 4); line = s.top[0] + s.bot[0]; word = `${nameOf(s)}에서 모서리 ${jh(line, '과/와')}`; said = saidOf(s); }
      else { s = cuboid(3, 5, 3); line = pick(d, ['AE', 'AB', 'AD']); word = `직육면체 ABCD-EFGH에서 모서리 ${jh(line, '과/와')}`; said = saidOf(s); }
      const v = s.v, edges = s.edges.filter((e) => e !== line && e !== line[1] + line[0]);
      const u = sub3(v[line[1]], v[line[0]]), flags = edges.map((e) => perpTo(u, sub3(v[e[1]], v[e[0]])));
      const right = edges.filter((_, i) => flags[i]);
      const foot = kind === 'tetra' || kind === 'pyr';
      const solidOnly = foot ? Object.assign({}, s, { v: Object.fromEntries(Object.entries(v).filter(([k]) => k !== 'H')) }) : s;
      const figure = solidFig(solidOnly, said, (S) => { if (foot) { S.put({ H: v.H }); S.seg('A', 'H', 'dash').dot('H').name('H', 'H', 300); S.right('H', 'A', 'D'); } });
      return aCount(`그림과 같은 ${word} 수직인 모서리는 모두 몇 개인가? (꼬인 위치에 있으면서 수직인 것도 센다.)`, flags, {
        figure, explain: `직선이 평면에 수직이면 그 평면 위의 모든 직선과 수직이다. ${line}에 수직인 평면 위에 있는 모서리 ${right.join(', ')}가 모두 수직이므로 ${right.length}개이다.`
      });
    }),
    T('lp-angle', '직선과 평면이 이루는 각의 코사인', '①11', (d, n) => {
      if (n === 0) {
        // 대각선의 길이가 자연수인 직육면체(1, 2, 2 / 2, 3, 6 / 1, 4, 8 / 4, 4, 7 / 2, 6, 9 / 6, 6, 7 / 3, 4, 12)에서 고른다.
        const [X, Y, Z] = d.shuffle(pick(d, [[1, 2, 2], [2, 3, 6], [1, 4, 8], [4, 4, 7], [2, 6, 9], [6, 6, 7], [3, 4, 12]]).slice()), s = cuboid(X, Y, Z), x = valOfSq(X * X + Y * Y, X * X + Y * Y + Z * Z);
        if (kindOf(x) !== 'radfrac') return null;
        const figure = solidFig(s, saidOf(s) + ` AD = ${X}, AB = ${Y}, AE = ${Z}. 대각선 AG와 EG를 그었다.`, (S) => { S.seg('A', 'G', 'hld'); S.seg('E', 'G', 'dash'); S.right('E', 'A', 'G'); });
        return aRadFrac(`그림과 같이 ${sg('AD', X)}, ${sg('AB', Y)}, ${sg('AE', Z)}인 직육면체 ABCD-EFGH에서 직선 AG와 평면 EFGH가 이루는 각의 크기를 ${th}라 할 때, ${cosT}의 값은?`, x, {
          figure, sq: [`${X}**2+${Y}**2`, `${X}**2+${Y}**2+${Z}**2`],
          explain: `점 A에서 평면 EFGH에 내린 수선의 발이 E이므로 θ = ∠AGE이다. EG = ${vh(sqrtFrac(X * X + Y * Y, 1))}, AG = ${vh(sqrtFrac(X * X + Y * Y + Z * Z, 1))}이므로 ${cosT} = EG ÷ AG = ${vh(x)}이다.`
        });
      }
      if (n === 1) {
        // 정사각뿔: 밑면 한 변 a, 옆모서리 l → cos = (a/√2)/l
        const a = d.pick([2, 4, 6]), l = d.int(a - 1, a + 4);
        if (2 * l * l <= a * a) return null;
        const x = valOfSq(a * a, 2 * l * l), s = pyr4(3.6, 3.4);
        if (kindOf(x) !== 'radfrac') return null;
        const figure = solidFig(s, `정사각뿔 A-BCDE의 겨냥도. 밑면의 한 변의 길이는 ${a}, 옆모서리의 길이는 ${l}이다. 꼭짓점 A에서 밑면에 내린 수선의 발 H(밑면의 두 대각선의 교점)를 나타내었다.`, (S) => { S.put({ H: [0, 0, 0] }); S.seg('A', 'H', 'dash').seg('B', 'H', 'dash').dot('H').name('H', 'H', 330); S.right('H', 'A', 'B'); S.edge('AB'); });
        return aRadFrac(`그림과 같이 밑면의 한 변의 길이가 ${a}, 옆모서리의 길이가 ${l}인 정사각뿔 A-BCDE에서 직선 AB와 밑면 BCDE가 이루는 각의 크기를 ${th}라 할 때, ${cosT}의 값은?`, x, {
          figure, sq: [`${a}**2`, `2*${l}**2`],
          explain: `꼭짓점 A의 정사영은 밑면의 두 대각선의 교점 H이므로 θ = ∠ABH이다. BH는 대각선의 절반이라 ${vh(rad(a, 2, 2))}, AB = ${l}이므로 ${cosT} = BH ÷ AB = ${vh(x)}이다.`
        });
      }
      // 정삼각기둥: 밑면 한 변 s0, 높이 h, M 은 EF 의 중점 — AM 과 밑면 DEF: cos = DM/AM, DM = (√3/2)s0
      const s0 = d.pick([2, 4, 6]), h = d.int(1, 6), x = valOfSq(3 * s0 * s0, 3 * s0 * s0 + 4 * h * h);
      if (kindOf(x) !== 'radfrac') return null;
      const s = prismOf(3, circR(3, 4), 4), v = s.v; v.M = lerp3(v.E, v.F, 0.5);
      const vv = Object.fromEntries(Object.entries(v).filter(([k]) => k !== 'M'));
      const figure = solidFig(Object.assign({}, s, { v: vv }), `밑면이 한 변의 길이가 ${s0}인 정삼각형이고 높이가 ${h}인 삼각기둥 ABC-DEF의 겨냥도. M은 모서리 EF의 중점이고 선분 AM, DM을 그었다.`, (S) => { S.put({ M: v.M }); S.seg('A', 'M', 'hl').seg('D', 'M', 'dash').dot('M').name('M', 'M', 300); S.right('D', 'A', 'M'); });
      return aRadFrac(`그림과 같이 밑면이 한 변의 길이가 ${s0}인 정삼각형이고 높이가 ${h}인 삼각기둥 ABC-DEF에서 모서리 EF의 중점을 M이라 하자. 직선 AM과 밑면 DEF가 이루는 각의 크기를 ${th}라 할 때, ${cosT}의 값은?`, x, {
        figure, sq: [`3*${s0}**2`, `3*${s0}**2+4*${h}**2`],
        explain: `점 A의 정사영이 D이므로 θ = ∠AMD이다. DM은 정삼각형의 높이 ${vh(rad(s0, 3, 2))}, AM = ${vh(sqrtFrac(3 * s0 * s0 + 4 * h * h, 4))}이므로 ${cosT} = DM ÷ AM = ${vh(x)}이다.`
      });
    }, { count: 3 }),
    T('lp-diag-plane', '정육면체의 대각선과 대각 단면이 이루는 각', '①12', (d) => {
      const want = d.pick(['cos', 'sin']), x = want === 'cos' ? rad(1, 3, 3) : rad(1, 6, 3), s = cuboid(3, 3, 3); s.word = 'cube';
      const figure = solidFig(s, '정육면체 ABCD-EFGH의 겨냥도. 삼각형 EGD와 대각선 DB를 나타내었다.', (S) => { S.face(['E', 'G', 'D']); S.seg('E', 'G', 'dash').seg('G', 'D').seg('D', 'E').seg('D', 'B', 'hl'); });
      return aRadFrac(`그림과 같은 정육면체 ABCD-EFGH에서 직선 DB와 평면 EGD가 이루는 각의 크기를 ${th}라 할 때, ${want === 'cos' ? cosT : sinT}의 값은?`, x, {
        figure, explain: `한 모서리를 a라 하면 B, D, E, G는 모두 서로 면의 대각선 √2a만큼 떨어져 있어 한 모서리가 √2a인 정사면체의 꼭짓점이다. 그러므로 B의 정사영은 정삼각형 EGD의 무게중심 I이고 DI = (2/3) × (√6/2)a = (√6/3)a이다. ${want === 'cos' ? cosT + ' = DI ÷ DB = ' + vh(x) : sinT + ' = BI ÷ DB = ' + vh(x)}이다.`
      });
    }),
    T('lp-proof', '직선이 평면에 수직임을 보이는 과정의 빈칸', '①13', (d, n) => {
      const s = cuboid(3, 3, 3); s.word = 'cube';
      if (n === 0) {
        const figure = solidFig(s, '정육면체 ABCD-EFGH의 겨냥도. 대각선 AC와 직사각형 BDHF를 나타내었다.', (S) => { S.face(['B', 'D', 'H', 'F']); S.seg('A', 'C', 'hl').seg('B', 'D').seg('D', 'H', 'dash').seg('H', 'F', 'dash'); });
        const box = lines(['정사각형 ABCD에서 AC ⊥ (㉠) …… ①', 'BF ∥ AE이고 AC ⊥ AE이므로 AC ⊥ (㉡) …… ②', '①, ②에서 직선 AC는 평면 (㉢)의 평행하지 않은 두 직선에 수직이므로 직선 AC와 평면 (㉢)은 서로 수직이다.']);
        return pickRows(d, '다음은 그림과 같은 정육면체 ABCD-EFGH에서 직선 AC와 평면 BDHF가 서로 수직임을 보이는 과정이다. ㉠, ㉡, ㉢에 알맞은 것을 차례로 나열한 것은?', [
          ['BD, BF, BDHF', true], ['BD, AE, ABCD', false], ['CG, BF, BDHF', false], ['BD, CG, AEGC', false], ['EG, BF, BDHF', false]
        ], { figure: figure + box, explain: '정사각형의 두 대각선은 수직이므로 AC ⊥ BD이다. BF ∥ AE이고 AE는 윗면에 수직이므로 AC ⊥ BF이다. BD와 BF는 평면 BDHF 위의 평행하지 않은 두 직선이므로 AC ⊥ 평면 BDHF이다.' });
      }
      const figure = solidFig(s, '정육면체 ABCD-EFGH의 겨냥도. 대각선 AG와 삼각형 DEB를 나타내었다.', (S) => { S.face(['D', 'E', 'B']); S.seg('A', 'G', 'hld').seg('D', 'B').seg('B', 'E').seg('E', 'D'); });
      const box = lines(['DB ⊥ AC이고 DB ⊥ (㉠)이므로 직선 DB는 평면 AEGC에 수직이다. 따라서 DB ⊥ AG …… ①', 'DE ⊥ AH이고 DE ⊥ (㉡)이므로 직선 DE는 평면 AHGB에 수직이다. 따라서 DE ⊥ AG …… ②', '①, ②에서 AG는 평면 DEB의 평행하지 않은 두 직선 DB, (㉢)에 수직이므로 AG ⊥ 평면 DEB이다.']);
      return pickRows(d, '다음은 그림과 같은 정육면체 ABCD-EFGH에서 대각선 AG가 평면 DEB와 수직임을 보이는 과정이다. ㉠, ㉡, ㉢에 알맞은 것을 차례로 나열한 것은?', [
        ['CG, GH, DE', true], ['CG, AB, EB', false], ['AE, GH, EB', false], ['CG, EF, DE', false], ['BF, GH, BD', false]
      ], { figure: figure + box, explain: '모서리 CG는 윗면에 수직이므로 DB ⊥ CG이고, DB ⊥ AC이므로 DB는 평면 AEGC에 수직이다. 모서리 GH는 면 AEHD에 수직이므로 DE ⊥ GH이고, DE ⊥ AH이므로 DE는 평면 AHGB에 수직이다. 따라서 AG는 DB, DE와 모두 수직이다.' });
    }, { count: 2 })
  ]);

  // ── 두 평면의 위치 관계와 증명 ──
  // 기호로 쓴 위치 관계의 문장(서로 다른 직선 l, m, n 과 서로 다른 평면 α, β, γ)과 참·거짓(교과서가 사실로 가르치는 것)
  const sym = (h) => h;   // 긴 문장은 줄이 갈려야 한다(기호 앞뒤는 화면이 묶는다)
  const CLAIMS = [
    [`${vl} ⊥ ${vn}, ${vm} ⊥ ${vn}이면 ${vl} ∥ ${vm}이다.`, false, '두 직선 l, m이 꼬인 위치에 있으면서 모두 n에 수직일 수 있다.'],
    [`${al} ∥ ${be}, ${be} ∥ ${ga}이면 ${al} ∥ ${ga}이다.`, true, ''],
    [`${vl} ∥ ${al}, ${vl} ∥ ${be}이면 ${al} ∥ ${be}이다.`, false, '두 평면 α, β의 교선에 평행한 직선 l은 두 평면에 모두 평행하다.'],
    [`${vl} ⊥ ${al}, ${vm} ∥ ${al}이면 ${vl} ⊥ ${vm}이다.`, true, ''],
    [`${vl} ⊥ ${vm}, ${vl} ∥ ${al}이면 ${vm} ∥ ${al}이다.`, false, '직선 m이 평면 α에 수직일 수도 있다.'],
    [`${vl} ⊥ ${al}, ${vm} ⊥ ${al}이면 ${vl} ⊥ ${vm}이다.`, false, '한 평면에 수직인 두 직선은 평행하다.'],
    [`${vl} ⊥ ${al}, ${vm} ⊥ ${al}이면 ${vl} ∥ ${vm}이다.`, true, ''],
    [`${vl} ∥ ${al}, ${vm} ∥ ${al}이면 ${vl} ∥ ${vm}이다.`, false, '한 평면에 평행한 두 직선은 만나거나 꼬인 위치에 있을 수 있다.'],
    [`${vl} ⊥ ${al}, ${vl} ⊥ ${be}이면 ${al} ∥ ${be}이다.`, true, ''],
    [`${vl} ∥ ${al}, ${al} ⊥ ${be}이면 ${vl} ⊥ ${be}이다.`, false, '직선 l이 평면 β에 평행할 수도 있다.'],
    [`${al} ⊥ ${ga}, ${be} ⊥ ${ga}이면 ${al} ∥ ${be}이다.`, false, '한 평면에 수직인 두 평면은 만날 수 있다(직육면체의 이웃한 두 옆면).'],
    [`${vl} ∥ ${vm}, ${vm} ∥ ${vn}이면 ${vl} ∥ ${vn}이다.`, true, ''],
    [`${al} ∥ ${be}이고 직선 ${vl}이 평면 ${al}에 포함되면 ${vl} ∥ ${be}이다.`, true, ''],
    ['두 직선은 한 평면을 결정한다.', false, '꼬인 위치에 있는 두 직선은 한 평면 위에 있지 않다.'],
    [`평면 ${al} 위의 두 직선 ${vm}, ${vn}에 수직인 직선 ${vl}은 평면 ${al}에 수직이다.`, false, '두 직선 m, n이 평행하면 l이 α에 수직이라고 할 수 없다.'],
    [`평면 ${al} 위의 평행하지 않은 두 직선 ${vm}, ${vn}에 수직인 직선 ${vl}은 평면 ${al}에 수직이다.`, true, ''],
    [`직선 ${vl}이 평면 ${al}에 평행할 때, ${vl}을 포함하고 ${al}와 만나는 평면 ${be}와 ${al}의 교선 ${vm}은 ${vl}과 평행하다.`, true, '']
  ];
  B.addTypes(UNIT, 'planes', [
    T('pl-face-rel', '입체에서 면끼리의 위치 관계와 교선', '①14', (d, n) => {
      const s = pickSolid(d, ['cuboid', 'p3', 'p5', 'p6']), v = s.v, f = pick(d, s.faces), pl = planeOf(v[f[0]], v[f[1]], v[f[2]]);
      const others = s.faces.filter((g) => g !== f), rels = others.map((g) => planeRel(pl, planeOf(v[g[0]], v[g[1]], v[g[2]])));
      if (n === 0) {
        const want = d.bool() ? 'par' : 'meet', flags = rels.map((r) => (want === 'par' ? r === 'par' : r === 'meet' || r === 'perp'));
        if (!flags.some(Boolean) || flags.every(Boolean)) return null;
        const right = others.filter((_, i) => flags[i]);
        return aCount(`그림과 같은 ${nameOf(s)}에서 ${jh(faceName(f), '과/와')} ${want === 'par' ? '평행한' : '만나는'} 면은 모두 몇 개인가?`, flags, {
          figure: solidFig(s, saidOf(s)), explain: `${jh(faceName(f), '과/와')} ${want === 'par' ? '평행한' : '만나는'} 면은 ${right.map(faceName).join(', ')}로 ${right.length}개이다.`
        });
      }
      const meets = others.filter((g, i) => rels[i] === 'meet' || rels[i] === 'perp'), g = pick(d, meets);
      const common = s.edges.filter((e) => f.includes(e[0]) && f.includes(e[1]) && g.includes(e[0]) && g.includes(e[1]));
      if (common.length !== 1) return null;
      const right = common[0], wrongs = d.shuffle(s.edges.filter((e) => e !== right)).slice(0, 4);
      return pickRows(d, `그림과 같은 ${nameOf(s)}에서 평면 ${jh(f, '과/와')} 평면 ${g}의 교선은?`, [['직선 ' + right, true]].concat(wrongs.map((e) => ['직선 ' + e, false])), {
        figure: solidFig(s, saidOf(s)), explain: `두 평면이 함께 가진 점은 ${right[0]}, ${right[1]}이므로 교선은 직선 ${right}이다.`
      });
    }, { count: 2 }),
    T('pl-claims', '기호로 쓴 위치 관계의 참·거짓', '①15', (d, n) => {
      if (n === 0) {
        const pool = d.shuffle(CLAIMS.slice()).slice(0, 4);
        const t = pool.filter((c) => c[1]).length;
        if (t < 1 || t > 3) return null;
        const item = pickAll(d, `서로 다른 세 직선 ${vl}, ${vm}, ${vn}과 서로 다른 세 평면 ${al}, ${be}, ${ga}에 대하여 옳은 것만을 〈보기〉에서 있는 대로 고른 것은?`, pool.map((c) => [sym(c[0]), c[1]]), {
          explain: pool.map((c, i) => KS[i] + '. ' + (c[1] ? '참' : '거짓 — ' + c[2])).join(' ')
        });
        return item;
      }
      const pool = d.shuffle(CLAIMS.slice()), right = pool.find((c) => c[1]), wrongs = pool.filter((c) => !c[1]).slice(0, 4);
      return pickRows(d, `서로 다른 직선 ${vl}, ${vm}, ${vn}과 서로 다른 평면 ${al}, ${be}, ${ga}에 대하여 옳은 것은?`, [[sym(right[0]), true]].concat(wrongs.map((c) => [sym(c[0]), false])), {
        explain: '옳은 것은 「' + right[0] + '」이다. ' + wrongs.map((c) => c[2]).join(' ')
      });
    }, { count: 2 }),
    T('pl-mixed', '입체 그림 속 위치 관계·각을 섞은 ㄱㄴㄷ', '①16', (d, n) => {
      const s = n === 0 ? prismOf(6, 2, 4) : cuboid(3, 3, 3), v = s.v;
      if (n === 1) s.word = 'cube';
      const edgeLines = s.edges, faces = s.faces;
      const make = () => {
        const kind = d.int(0, 3);
        const LW = { par: '평행하다', meet: '한 점에서 만난다', skew: '꼬인 위치에 있다', perp: '수직이다' };
        if (kind === 0) { const e = pick(d, edgeLines), f = pick(d, faces), r = linePlane(v[e[0]], v[e[1]], planeOf(v[f[0]], v[f[1]], v[f[2]])); if (r === 'in') return null; return [`직선 ${jh(e, '은/는')} 평면 ${jh(f, '과/와')} 평행하다.`, r === 'par', r === 'par' ? '' : `직선 ${jh(e, '은/는')} 평면 ${jh(f, '과/와')} 한 점에서 만난다.`]; }
        if (kind === 1) { const p = pick(d, edgeLines), q = pick(d, edgeLines.filter((x) => x !== p)), r = lineRel(v[p[0]], v[p[1]], v[q[0]], v[q[1]]); const say = pick(d, ['par', 'skew', 'perp']), isPerp = perpTo(sub3(v[p[1]], v[p[0]]), sub3(v[q[1]], v[q[0]])); const truth = say === 'perp' ? isPerp : r === say;
          return [`두 직선 ${p}, ${jh(q, '은/는')} ${LW[say]}.`, truth, truth ? '' : `두 직선 ${p}, ${jh(q, '은/는')} ${say === 'perp' ? '수직이 아니다' : LW[r]}.`]; }
        if (kind === 2) { const f = pick(d, faces), g = pick(d, faces.filter((x) => x !== f)), r = planeRel(planeOf(v[f[0]], v[f[1]], v[f[2]]), planeOf(v[g[0]], v[g[1]], v[g[2]])); return [`두 평면 ${f}, ${jh(g, '은/는')} 평행하다.`, r === 'par', r === 'par' ? '' : `두 평면 ${f}, ${jh(g, '은/는')} 만난다.`]; }
        if (n === 1) { const L8 = ['AC', 'BD', 'EG', 'FH', 'AF', 'BE', 'CH', 'DG'], p = pick(d, L8), q = pick(d, L8.filter((x) => x !== p)); const a = Math.round(angleOf(sub3(v[p[1]], v[p[0]]), sub3(v[q[1]], v[q[0]]))); if (a === 0) return null; const say = pick(d, [60, 90]); return [`두 직선 ${p}, ${jh(q, '이/가')} 이루는 각의 크기는 ${say}°이다.`, a === say, a === say ? '' : `이루는 각의 크기는 ${a}°이다.`]; }
        return null;
      };
      const claims = [];
      for (let i = 0; i < 60 && claims.length < 4; i += 1) { const c = make(); if (c && !claims.some((x) => stripH(x[0]) === stripH(c[0]))) claims.push(c); }
      if (claims.length < 4) return null;
      const t = claims.filter((c) => c[1]).length;
      if (t < 1 || t > 3) return null;
      return pickAll(d, `그림과 같은 ${nameOf(s)}에 대하여 옳은 것만을 〈보기〉에서 있는 대로 고른 것은?`, claims, {
        figure: solidFig(s, saidOf(s)), explain: claims.map((c, i) => KS[i] + '. ' + (c[1] ? '참.' : '거짓 — ' + c[2])).join(' ')
      });
    }, { count: 2 }),
    T('pl-proof-par', '평면의 평행 — 귀류법 증명의 빈칸', '①17', (d) => {
      const box = lines([`평면 ${al} 밖의 점 P를 지나고 ${al}에 평행한 두 직선 ${vl}, ${vm}을 포함하는 평면을 ${be}라 하자.`, `두 평면 ${al}, ${be}가 (㉠)하지 않다고 가정하고 두 평면의 교선을 ${vn}이라 하자.`,
        `직선 ${vn}은 평면 ${al}에 포함되고 ${vl} ∥ ${al}, ${vm} ∥ ${al}이므로 ${vn}은 ${vl}, ${vm}과 만나지 않는다.`, `또, 세 직선 ${vl}, ${vm}, ${vn}은 모두 평면 (㉡)에 포함되므로 ${vl} ∥ ${vn}, ${vm} ∥ ${vn}이고, 따라서 ${vl} (㉢) ${vm}이다.`,
        `이것은 두 직선 ${vl}, ${vm}이 점 P에서 만난다는 것에 모순이므로 ${al} ∥ ${be}이다.`]);
      return pickRows(d, `다음은 한 점에서 만나는 두 직선이 평면 ${al}에 평행하면 두 직선을 포함하는 평면은 ${al}와 평행함을 귀류법으로 증명한 것이다. ㉠, ㉡, ㉢에 알맞은 것을 차례로 나열한 것은?`, [
        [`평행, ${be}, ∥`, true], [`수직, ${be}, ∥`, false], [`평행, ${al}, ⊥`, false], [`평행, ${al}, ∥`, false], [`수직, ${be}, ⊥`, false]
      ], { figure: box, explain: '평행하지 않다고 가정하면 교선 n이 생긴다. l, m, n은 모두 평면 β 위에 있고 n은 l, m과 만나지 않으므로 l ∥ n, m ∥ n이 되어 l ∥ m이 된다. 이것은 l, m이 점 P에서 만난다는 것에 모순이다.' });
    }),
    T('pl-proof-meet', '교선에 평행한 평면이 만드는 교선 — 증명의 빈칸', '①18', (d) => {
      const box = lines([`두 평면 ${al}, ${be}의 교선 ${vl}에 평행한 평면 ${ga}가 ${al}, ${be}와 만나서 생기는 교선을 각각 ${vm}, ${vn}이라 하자.`, `두 직선 ${vm}, ${vn}이 만난다고 가정하고 만나는 점을 P라 하면, P는 두 평면 ${al}, ${be} 위의 점이므로 교선 (㉠) 위의 점이다.`,
        `따라서 직선 ${vl}과 평면 ${ga}는 점 P에서 만난다. 이것은 ${vl} (㉡) ${ga}라는 조건에 모순이므로 ${vm}, ${vn}은 만나지 않는다.`, `이때 두 직선 ${vm}, ${vn}은 한 평면 (㉢) 위에 있으므로 ${vm} ∥ ${vn}이다.`]);
      return pickRows(d, `다음은 두 평면 ${al}, ${be}의 교선에 평행한 평면 ${ga}와 ${al}, ${be}의 교선 ${vm}, ${vn}이 평행함을 증명한 것이다. ㉠, ㉡, ㉢에 알맞은 것을 차례로 나열한 것은?`, [
        [`${vl}, ∥, ${ga}`, true], [`${vm}, ∥, ${al}`, false], [`${vl}, ⊥, ${ga}`, false], [`${vn}, ∥, ${be}`, false], [`${vl}, ∥, ${al}`, false]
      ], { figure: box, explain: '두 평면에 모두 있는 점은 두 평면의 교선 l 위에 있다. l과 γ가 만나면 l ∥ γ에 모순이다. m, n은 모두 평면 γ 위에 있고 만나지 않으므로 평행하다.' });
    }),
    T('pl-proof-order', '평행한 평면의 성질 — 증명의 차례', '①19', (d) => {
      const steps = [`(가) ${vl} ∥ ${ga}, ${vm} ∥ ${ga}이므로 두 직선 ${vl}, ${vm}을 포함하는 평면 ${al}는 평면 ${ga}와 평행하다.`, `(나) ${al} ∥ ${be}이므로 ${vl} ∥ ${be}, ${vm} ∥ ${be}이다.`,
        `(다) ${be} ∥ ${ga}이므로 ${vl} 또는 ${vm}이 ${ga}와 한 점에서 만나면 ${be}와도 한 점에서 만나서 ${vl} ∥ ${be}, ${vm} ∥ ${be}에 모순이다.`, `(라) 따라서 ${vl} ∥ ${ga}, ${vm} ∥ ${ga}이다.`];
      return pickRows(d, `서로 다른 세 평면 ${al}, ${be}, ${ga}에 대하여 ${al} ∥ ${be}, ${be} ∥ ${ga}이면 ${al} ∥ ${ga}임을 증명하려고 한다. 「평면 ${al} 위에 한 점에서 만나는 두 직선 ${vl}, ${vm}을 긋는다.」 다음에 이어질 (가)~(라)를 증명의 차례대로 나열한 것은?`, [
        ['(나) − (다) − (라) − (가)', true], ['(가) − (나) − (다) − (라)', false], ['(나) − (라) − (다) − (가)', false], ['(다) − (나) − (가) − (라)', false], ['(가) − (다) − (나) − (라)', false]
      ], { figure: lines(steps), keep: false, explain: '먼저 l, m이 β에 평행함을 보이고(나), β ∥ γ를 써서 l, m이 γ와 만나지 않음을 보인 뒤(다, 라), 평행하지 않은 두 직선 l, m이 γ에 평행하므로 α ∥ γ라고 맺는다(가).' });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
