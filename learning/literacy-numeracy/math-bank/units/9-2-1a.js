// 중학교 3학년 2학기 1단원 삼각비 — 단원 틀·도구와 앞쪽 묶음(삼각비의 뜻, 한 삼각비의 값으로 다른 삼각비, 그림 속 같은 각·입체·좌표).
// 수집해 둔 미래엔 2015(황선욱) 한 종의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 46꼴, 심화꼴 21꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 뺌(까닭) / 겹침」을 가른 대조표는 references/textbooks/수학/_분석/9-2-1/싣기_대조표.md 에 있다.
// (30°·45°·60°의 삼각비, 특수각으로 변의 길이, 사분원과 0°·90°의 삼각비는 9-2-1b.js 에, 실력 문항은 9-2-1c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
// 영역은 도형과 측정. 성취기준은 9수03-16(삼각비의 뜻을 알고, 간단한 삼각비의 값을 구할 수 있다)이다.
// 고려 사항(2022): 「삼각비 사이의 관계는 다루지 않는다.」「삼각비의 값은 0°에서 90°까지의 각도에 대한 것만 다룬다.」 「삼각비의 표」라는 말은 없다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(세 변·두 변·변의 비·한 삼각비·일차식·그림의 수선·입체·직선의 방정식), 묻는 것(삼각비 셋·하나·변·넓이·고르기),
//    푸는 길(바로 / 피타고라스 정리로 나머지 변 / 닮음으로 같은 각 / 직각삼각형을 그려서)이 다르면 따로 싣는다. 수만 다른 것은 한 번만 싣는다.
//  - 한 삼각비의 값으로 다른 삼각비를 구할 때는 직각삼각형을 그려 피타고라스 정리로 푼다. sin²A + cos²A = 1, tan A = sin A ÷ cos A 같은 관계식은 풀이에도 쓰지 않는다.
//  - 답의 꼴: 정수(N)·분수(F, 크기가 같은 분수를 모두 받는다), a√b(칸 둘 — 계수는 늘 2 이상이 되게 수를 고른다), 분모를 유리화한 a√b/c(식 속 칸 [ ]√[ ]/[ ]),
//    a + b√c([±][ ] [±][ ]√[ ]), 삼각비 여럿은 줄마다 칸을 둔 식 속 칸, 그 밖의 꼴(두 항이 든 분수 따위)은 고르기로 낸다.
//    한 유형 안에서는 차례·씨앗이 바뀌어도 칸의 모양이 같다(수를 고를 때 값의 꼴을 걸러 맞춘다). 예각의 삼각비·길이·넓이는 음수가 될 수 없어 부호 단추를 달지 않고,
//    음수가 될 수 있는 식의 값에는 모두 단다.
//  - 그림은 수치대로 그린다(코드가 길이에서 좌표를 셈한다). 그림 속 글에는 근호를 쓸 수 없으므로 근호가 든 길이는 문제 글로 알린다.
//  - 답은 모두 코드가 셈한다. 꼴 목록에 적힌 원문 답지의 잘못(대단원 마무리 21번의 sin B 등)은 따르지 않는다.
//  - 검사 근거: 값의 제곱을 문제에 적힌 수로 셈한 식에서 칸마다의 수를 다시 셈한다(sqCalc). 문제에 숫자로 없는 수는 seal 이 facts.unseen 에 밝힌다.
//
// 뺀 것과 까닭(9-2-1b.js, 9-2-1c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 2022 교육과정 밖: 삼각비의 표를 읽어 값·각을 찾는 것(①44·45 — 「삼각비의 표」가 2022에 없다. 값을 문제 글로 주는 ①40은 실었다),
//    수선으로 sin A ÷ sin B 를 구하는 사인법칙 꼴(①46 심4 — 고등학교).
//  - 뜻 없는 셈: 따로 구한 삼각비를 더하거나 곱하기만 한 것(①3 — 두 예각의 삼각비는 ratio-three 의 ∠B 차례로, ①4 — 한 각의 삼각비는 ratio-legs 로,
//    ①11 — 다른 두 삼각비는 given-one 으로 실었다), 길이 둘의 합·곱·몫(①30의 변형 x + y·xy, ①31의 변형 BD ÷ AC, ①32의 변형 AB + BD),
//    눈금으로 읽은 두 값의 합(①37의 변형). 식에 넣는 일 자체가 뜻인 것(①12의 분수식, 라 묶음의 식의 값)은 실었다.
//  - 같은 일(겹침): 심3(①16과), 심5(①14와 — 두 각의 코사인을 더한 값은 뜻 없는 합이기도 하다), 심9(①18과 — 길이만 문자), 심16(①31과), ①27의 생각 톡톡(sin A = cos A 인 각 — special-inverse 와).
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」 길이는 띄어 적는다(6 cm).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, frac, lines, table, N, M, C, F, inline } = B.kit;
  const { MINUS, range, gcd, lcm, Q, qadd, qmul, qdiv, qneg, qabs, qcmp, fl, nb, tail, V, sup, rt, grp, sqParts, claimQ, SG } = B.kit.mid;
  const { RAD, r1, at, dirOf, dist, mid, meet, sv, TINT, Board } = B.kit.mgeo;
  const UNIT = '9-2-1', STD = '9수03-16';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: (/①/.test(ref) ? '수집본 기본 자료(' : '수집본 심화 자료(') + ref + ')', make }, more || {});

  // ── 근호가 든 수 ──
  // 수는 항 { q: 유리수, m: 근호 안 }의 배열이다. m 은 제곱인 인수가 없는 자연수(유리수 항은 1)이고 m 이 작은 차례로 둔다. 0은 빈 배열이다.
  function norm(list) {
    const by = new Map();
    for (const t of list) by.set(t.m, by.has(t.m) ? qadd(by.get(t.m), t.q) : t.q);
    return [...by.entries()].filter(([, q]) => q.p !== 0).sort((x, y) => x[0] - y[0]).map(([m, q]) => ({ q, m }));
  }
  const num = (p, q) => norm([{ q: Q(p, q == null ? 1 : q), m: 1 }]);
  // √x (x 는 0 이상의 유리수), √n
  const sqrtQ = (x) => { if (x.p === 0) return []; const [s, m] = sqParts(x.p * x.q); return [{ q: Q(s, x.q), m }]; };
  const sqrtN = (n) => sqrtQ(Q(n));
  // a√m/c (근호 안의 제곱인 인수는 꺼낸다)
  const rad = (a, m, c) => { const [s, r] = sqParts(m); return norm([{ q: Q(a * s, c || 1), m: r }]); };
  const vadd = (x, y) => norm(x.concat(y)), vneg = (x) => x.map((t) => ({ q: qneg(t.q), m: t.m })), vsub = (x, y) => vadd(x, vneg(y));
  const tmul = (s, t) => { const [k, m] = sqParts(s.m * t.m); return { q: qmul(qmul(s.q, t.q), Q(k)), m }; };
  const vmul = (x, y) => norm(x.flatMap((s) => y.map((t) => tmul(s, t))));
  function vinv(x) {
    if (x.length === 1) return [{ q: qdiv(Q(1), qmul(x[0].q, Q(x[0].m))), m: x[0].m }];
    // a + b√m 꼴은 켤레를 곱해 유리화한다.
    if (x.length === 2 && x[0].m === 1) { const conj = [x[0], { q: qneg(x[1].q), m: x[1].m }], den = vmul(x, conj); if (den.length === 1 && den[0].m === 1) return vmul(conj, [{ q: qdiv(Q(1), den[0].q), m: 1 }]); }
    throw new Error('나눌 수 없는 꼴이다');
  }
  const vdiv = (x, y) => vmul(x, vinv(y));
  const vfl = (x) => x.reduce((s, t) => s + fl(t.q) * Math.sqrt(t.m), 0);
  const veq = (x, y) => x.length === y.length && x.every((t, i) => t.m === y[i].m && qcmp(t.q, y[i].q) === 0);
  // 값의 꼴: int 정수, frac 정수가 아닌 유리수, rad a√m, radfrac a√m/c(c ≥ 2), sum a + b√m(a, b 정수), other
  function kindOf(x) {
    if (!x.length) return 'int';
    if (x.length === 1) { const t = x[0]; if (t.m === 1) return t.q.q === 1 ? 'int' : 'frac'; return t.q.q === 1 ? 'rad' : 'radfrac'; }
    if (x.length === 2 && x[0].m === 1 && x.every((t) => t.q.q === 1)) return 'sum';
    return 'other';
  }
  const isSq = (n) => Number.isInteger(Math.sqrt(n));

  // ── 값의 글 ──
  const termH = (t) => { const a = qabs(t.q); if (t.m === 1) return a.q === 1 ? String(a.p) : frac(a.p, a.q); const top = (a.p === 1 ? '' : a.p) + rt(t.m); return a.q === 1 ? top : frac(top, a.q); };
  // 화면 글. 항이 둘 이상이고 분모가 있으면 분모를 하나로 모은다: (−9 + 4√2)/7
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

  // ── 30°, 45°, 60°(0°, 90°)의 삼각비 ──
  const SV = {
    sin: { 0: [], 30: num(1, 2), 45: rad(1, 2, 2), 60: rad(1, 3, 2), 90: num(1) },
    cos: { 0: num(1), 30: rad(1, 3, 2), 45: rad(1, 2, 2), 60: num(1, 2), 90: [] },
    tan: { 0: [], 30: rad(1, 3, 3), 45: num(1), 60: rad(1, 3) }
  };
  // 삼각비의 글: fn('sin', 'A') → sin A, fd('cos', 30) → cos 30°, fx('tan', 'x') → tan x°
  const fn = (f, a) => nb(f + ' ' + a);
  const fd = (f, deg) => nb(f + ' ' + deg + '°');
  const fx = (f, v) => nb(f + ' ' + V(v) + '°');
  const X = V('x'), seg = SG;
  const FN3 = ['sin', 'cos', 'tan'];
  // 비례상수를 붙인 길이: kv(3) → 3k, kv(1) → k
  const kv = (c) => (c === 1 ? '' : c) + V('k');

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
  // 값의 꼴대로 칸의 수를 그대로 적는 근거(값을 문제의 수로 다시 셈할 길이 없을 때 — 특수각의 식 따위. 답은 따로 지은 풀이로 맞춰 본다)
  function plainCalc(x, at0) {
    const i = at0 || 0, k = kindOf(x), t = x[0];
    if (k === 'int') return [[String(x.length ? Math.abs(t.q.p) : 0), i]];
    if (k === 'frac') return [[String(Math.abs(t.q.p)), i], [String(t.q.q), i + 1]];
    const sgn = (n) => (n < 0 ? `0-${-n}` : String(n));
    if (k === 'rad') return [[sgn(t.q.p), i], [String(t.m), i + 1]];
    if (k === 'radfrac') return [[sgn(t.q.p), i], [String(t.m), i + 1], [String(t.q.q), i + 2]];
    if (k === 'sum') return [[String(x[0].q.p), i], [String(x[1].q.p), i + 1], [String(x[1].m), i + 2]];
    throw new Error('plainCalc: ' + k);
  }

  // ── 답 ──
  const NOTE_Q = '(기약분수로 나타낸다.)';
  const NOTE_R = '(분모를 유리화하고, 근호 앞의 수가 1이면 1을 적는다.)';
  const ONE = '(근호 앞의 수가 1이면 1을 적는다.)';
  const more = (o, facts) => ({ figure: o.figure, explain: o.explain, facts: Object.assign({}, facts || {}, o.facts || {}, o.rule ? { rule: o.rule } : {}) });
  const unitOf = (o) => (o.unit ? ' ' + o.unit : '');
  // 정수 하나. o.value: 다시 셈하는 식(없으면 sq 나 수 그대로)
  function aInt(text, x, o) {
    if (kindOf(x) !== 'int') throw new Error('정수가 아니다: ' + vt(x));
    const v = x.length ? x[0].q.p : 0;
    const facts = o.value ? { value: o.value } : o.sq ? { calc: sqCalc(x, o.sq) } : { value: v < 0 ? `0-${-v}` : String(v) };
    return seal(N(text, v, Object.assign(more(o, facts), { signed: Boolean(o.signed), unit: o.unit })));
  }
  // 정수가 아닌 분수 하나(크기가 같은 분수를 모두 받는다)
  function aFrac(text, x, o) {
    if (kindOf(x) !== 'frac') throw new Error('분수가 아니다: ' + vt(x));
    const q = x[0].q, facts = o.value ? { value: o.value } : o.sq ? { calc: sqCalc(x, o.sq) } : { value: (q.p < 0 ? `(0-${-q.p})` : q.p) + '/' + q.q };
    return seal(F(text, Math.abs(q.p), q.q, Object.assign(more(o, facts), { improper: Math.abs(q.p) > q.q, anyForm: true, signed: Boolean(o.signed) || q.p < 0, negative: q.p < 0, unit: o.unit })));
  }
  // a√m (a ≥ 2, 양수)
  function aRad(text, x, o) {
    if (kindOf(x) !== 'rad' || x[0].q.p < 2) throw new Error('a√m(a ≥ 2) 꼴이 아니다: ' + vt(x));
    const t = x[0], facts = { calc: o.sq ? sqCalc(x, o.sq) : plainCalc(x) };
    return seal(inline(text, grp('{0}' + rt('{1}') + unitOf(o)), [{ answer: t.q.p }, { answer: t.m }], Object.assign(more(o, facts), { shown: vh(x) + unitOf(o) })));
  }
  // a√m/c (분모를 유리화한 꼴). o.signed: 계수 칸에 부호 단추
  function aRadFrac(text, x, o) {
    if (kindOf(x) !== 'radfrac') throw new Error('a√m/c 꼴이 아니다: ' + vt(x));
    const t = x[0], facts = { calc: o.sq ? sqCalc(x, o.sq) : plainCalc(x) };
    if (t.q.p < 0 && !o.signed) throw new Error('음수인데 부호 칸이 없다');
    return seal(inline(text + ' ' + NOTE_R, grp(frac('{0}' + rt('{1}'), '{2}') + unitOf(o)), [{ answer: o.signed ? t.q.p : Math.abs(t.q.p), signed: Boolean(o.signed) }, { answer: t.m }, { answer: t.q.q }],
      Object.assign(more(o, facts), { shown: vh(x) + unitOf(o) })));
  }
  // a + b√m (두 칸 모두 부호 단추)
  function aSum(text, x, o) {
    if (kindOf(x) !== 'sum') throw new Error('a + b√m 꼴이 아니다: ' + vt(x));
    const [r, t] = x, calc = o.calc || [[r.q.p < 0 ? `0-${-r.q.p}` : String(r.q.p), 0], [t.q.p < 0 ? `0-${-t.q.p}` : String(t.q.p), 1], [String(t.m), 2]];
    return seal(inline(text + ' ' + ONE, grp('{0}') + ' ' + grp('{1}' + rt('{2}') + unitOf(o)), [{ answer: r.q.p, signed: true }, { answer: t.q.p, signed: true }, { answer: t.m }],
      Object.assign(more(o, { calc }), { shown: vh(x) + unitOf(o) })));
  }
  // 값 여럿을 줄마다 받는다. rows: [{ label, x, sq }] — 칸의 꼴은 값의 꼴(int·frac·rad·radfrac)대로.
  function aMulti(text, rows, o) {
    let k = 0; const inputs = [], parts = [], calc = [];
    let hasRad = false, hasFrac = false;
    for (const row of rows) {
      const x = row.x, kind = kindOf(x), t = x[0];
      if (vfl(x) <= 0) throw new Error('aMulti 는 양수만');
      let slot;
      if (kind === 'int') { slot = '{' + k + '}'; inputs.push({ answer: t.q.p }); }
      else if (kind === 'frac') { slot = frac('{' + k + '}', '{' + (k + 1) + '}'); inputs.push({ answer: t.q.p }, { answer: t.q.q }); hasFrac = true; }
      else if (kind === 'rad') { slot = '{' + k + '}' + rt('{' + (k + 1) + '}'); inputs.push({ answer: t.q.p }, { answer: t.m }); hasRad = true; }
      else if (kind === 'radfrac') { slot = frac('{' + k + '}' + rt('{' + (k + 1) + '}'), '{' + (k + 2) + '}'); inputs.push({ answer: t.q.p }, { answer: t.m }, { answer: t.q.q }); hasRad = true; hasFrac = true; }
      else throw new Error('aMulti: ' + kind);
      calc.push(...(row.sq ? sqCalc(x, row.sq, k) : plainCalc(x, k)));
      k = inputs.length;
      parts.push('<span style="display:block;white-space:nowrap">' + row.label + ' <i>=</i> ' + slot + (row.unit ? ' ' + row.unit : '') + '</span>');
    }
    const note = hasRad ? NOTE_R : hasFrac ? NOTE_Q : '';
    return seal(inline(text + (note ? ' ' + note : ''), parts.join(''), inputs, Object.assign(more(o, { calc }), { shown: rows.map((r) => r.label + ' = ' + vh(r.x) + (r.unit ? ' ' + r.unit : '')).join(', ') })));
  }
  // 고르기: 보기(값의 배열) 가운데 정답이 하나뿐인지 본다. 보기는 값이 서로 달라야 한다. o.show: 값을 보기 글로 바꾸는 함수
  function aPick(d, text, right, wrongs, o) {
    const pool = [right];
    for (const w of wrongs) if (pool.length < (o.count || 5) && w && !pool.some((p) => Math.abs(vfl(p) - vfl(w)) < 1e-9)) pool.push(w);
    if (pool.length < 4) throw new Error('보기가 모자란다');
    const rows = o.sort ? pool.slice().sort((x, y) => vfl(x) - vfl(y)) : d.shuffle(pool), at0 = rows.findIndex((r) => veq(r, right));
    const show = o.show || vh;
    return seal(C(text, rows.map(show), at0, more(o, { truth: rows.map((r) => veq(r, right)), want: true })));
  }
  // 글 보기 고르기: rows [[글, 참인가]] 에서 참인 것이 하나뿐이어야 한다.
  function pickRows(d, text, rows, o) {
    const list = o.keep ? rows : d.shuffle(rows), at0 = list.findIndex((r) => r[1]);
    if (list.filter((r) => r[1]).length !== 1 || new Set(list.map((r) => stripH(r[0]))).size !== list.length) throw new Error('보기가 맞지 않다');
    return seal(C(text, list.map((r) => r[0]), at0, more(o, { truth: list.map((r) => r[1]), want: true })));
  }
  // ㄱ~ㄹ 가운데 옳은 것을 모두 고른 것: claims [[글, 참인가]]
  const KS = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ'];
  function pickAll(d, text, claims, o) {
    const right = KS.slice(0, claims.length).filter((_, i) => claims[i][1]);
    if (!right.length || right.length === claims.length) throw new Error('옳은 것이 없거나 모두 옳다');
    const combos = [right.join(', ')], idx = claims.map((_, i) => i), subsets = [];
    for (let mask = 1; mask < 1 << claims.length; mask += 1) subsets.push(idx.filter((i) => mask & (1 << i)).map((i) => KS[i]).join(', '));
    for (const s of d.shuffle(subsets)) if (combos.length < 5 && !combos.includes(s)) combos.push(s);
    const order = combos.slice().sort((x, y) => x.length - y.length || (x < y ? -1 : 1));
    return seal(C(text, order, order.indexOf(right.join(', ')), more(Object.assign({}, o, { figure: lines(claims.map((c, i) => KS[i] + '. ' + c[0])) }), { truth: order.map((v) => v === right.join(', ')), want: true })));
  }

  // ── 그림 ──
  const cen = (pts) => [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];
  // 모형 좌표(y 는 위로 커진다)의 점들 { 이름: [x, y] }을 [가로, 세로] 안에 꼭 맞게 키워 화면 좌표로 옮긴다. 돌려주는 것에 배율 k 가 함께 들어 있다.
  function lay(model, size) {
    const keys = Object.keys(model), xs = keys.map((key) => model[key][0]), ys = keys.map((key) => model[key][1]);
    const k = Math.min(size[0] / Math.max(1e-9, Math.max(...xs) - Math.min(...xs)), size[1] / Math.max(1e-9, Math.max(...ys) - Math.min(...ys))), P = { k };
    for (const key of keys) P[key] = [model[key][0] * k, -model[key][1] * k];
    return P;
  }
  // 도형 그림. model { 이름: [x, y] }(모형 좌표)
  //  o.polys [[이름…]] 다각형(o.fill { 차례: 칠 }), o.segs [[p, q, 'thin'|'cut']] 선분, o.right [[꼭짓점, p, q]] 직각 표시, o.ticks [[p, q, 개수]] 같은 길이 표시,
  //  o.ang [[꼭짓점, p, q, 글, 선택]] 각 표시와 글, o.side [[p, q, 글, 피할 점 이름, 선택]] 변 옆 글(피할 점이 없으면 도형의 가운데를 피한다),
  //  o.dims [[p, q, 글, 피할 점 이름, 띄울 거리]] 치수선, o.dots [이름] 점, o.names 이름을 적을 점(기본: 모두), o.nameAt { 이름: 방향(도) }, o.hide [이름] 그리기만 하고 이름을 적지 않을 점, o.size [가로, 세로]
  function fig(model, o) {
    const P = lay(model, o.size || [176, 118]), b = Board(), keys = Object.keys(model), g = o.center ? P[o.center] : cen(keys.map((key) => P[key]));
    const nbr = {}; keys.forEach((key) => { nbr[key] = []; });
    const link = (p, q) => { nbr[p].push(q); nbr[q].push(p); };
    (o.polys || []).forEach((list, i) => { b.poly(list.map((key) => P[key]), (o.fill || {})[i]); list.forEach((key, j) => link(key, list[(j + 1) % list.length])); });
    (o.segs || []).forEach(([p, q, kind]) => { b.seg(P[p], P[q], kind); link(p, q); });
    (o.right || []).forEach(([v, p, q]) => b.corner(P[v], P[p], P[q], ''));
    (o.ticks || []).forEach(([p, q, n]) => b.tick(P[p], P[q], n));
    (o.ang || []).forEach(([v, p, q, label, opt]) => b.corner(P[v], P[p], P[q], label, opt));
    (o.side || []).forEach(([p, q, label, avoid, opt]) => b.beside(P[p], P[q], label, avoid ? P[avoid] : g, opt));
    (o.dims || []).forEach(([p, q, label, avoid, off]) => b.dim(P[p], P[q], label, avoid ? P[avoid] : g, off));
    (o.dots || []).forEach((key) => b.dot(P[key]));
    for (const key of o.names || keys) {
      if ((o.hide || []).includes(key)) continue;
      if (o.nameAt && o.nameAt[key] != null) b.name(P[key], key, o.nameAt[key]);
      else if (nbr[key].length) b.nameFree(P[key], key, nbr[key].map((q) => dirOf(P[key], P[q])));
      else b.name(P[key], key, dirOf(g, P[key]));
    }
    return { b, P, g };
  }
  // 직각삼각형의 모형 좌표: 직각 꼭짓점 R, 직각을 낀 두 변 R–Pn = a, R–Qn = b.
  //  pose 'right': 직각이 오른쪽 아래, 'left': 직각이 왼쪽 아래, 'top': 빗변이 밑에 가로로 놓이고 직각이 위
  function rtModel(nm, a, b, pose) {
    const m = {};
    if (pose === 'left') { m[nm.R] = [0, 0]; m[nm.P] = [a, 0]; m[nm.Q] = [0, b]; }
    else if (pose === 'top') { const c = Math.hypot(a, b); m[nm.P] = [0, 0]; m[nm.Q] = [c, 0]; m[nm.R] = [a * a / c, a * b / c]; }
    else { m[nm.P] = [0, 0]; m[nm.R] = [a, 0]; m[nm.Q] = [a, b]; }
    return m;
  }
  // 직각삼각형 그림. labels { 'PR' 같은 두 이름: 글 }, o 는 fig 에 더 넘길 것
  function rtFig(nm, a, b, pose, labels, o) {
    const model = rtModel(nm, a, b, pose), opt = Object.assign({}, o || {});
    opt.polys = [[nm.P, nm.R, nm.Q]].concat(opt.polys || []);
    opt.right = [[nm.R, nm.P, nm.Q]].concat(opt.right || []);
    opt.side = Object.keys(labels || {}).filter((key) => labels[key] !== '' && labels[key] != null).map((key) => [key[0], key[1], labels[key]]).concat(opt.side || []);
    return fig(Object.assign(model, opt.extra || {}), opt);
  }
  const POSES = ['right', 'left', 'top'];
  // 그림 속 길이 글: 수 그대로, 문자는 기울인 글자
  const lx = (name) => sv(name);
  const deg = (v) => v + '°';
  const degx = (name) => sv(name) + '°';
  // 피타고라스 수 [직각을 낀 두 변, 빗변]
  const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [9, 12, 15], [20, 21, 29], [12, 16, 20], [15, 20, 25], [12, 9, 15], [10, 24, 26]];
  const legsOf = (d, list) => { const [p, q, c] = d.pick(list || TRIPLES); return d.bool() ? [p, q, c] : [q, p, c]; };
  // 길쭉하지 않은 직각삼각형인가
  const fair = (a, b) => Math.max(a, b) / Math.min(a, b) <= 2.6;
  const PYTH = '피타고라스 정리에 의하여 ';
  // 등식을 잇는 풀이 글: 바로 앞과 같은 글은 건너뛴다.
  const eqs = (...parts) => parts.filter((h, i) => i === 0 || stripH(h) !== stripH(parts[i - 1])).join(' = ');
  // 「∠A의 삼각비」 풀이 글
  const told = (f, ang, top, bottom, x) => { const raw = frac(top, bottom); return `${fn(f, ang)} = ${raw}` + (raw === vh(x) || nb(raw) === vh(x) ? '' : ` = ${vh(x)}`); };

  // ── 단원 ──
  B.addUnit({
    id: '9-2-1', grade: 9, semester: 2, no: 1, title: '삼각비', version: 1,
    groups: [
      {
        id: 'ratio', title: '삼각비의 뜻', standard: STD,
        types: [
          T('ratio-three', '세 변의 길이를 아는 직각삼각형의 삼각비', '①1', (d, n) => {
            const w = d.until(() => {
              const [ac, bc, c] = legsOf(d), pose = d.pick(POSES);
              const f = rtFig({ R: 'C', P: 'A', Q: 'B' }, ac, bc, pose, { AC: String(ac), CB: String(bc), AB: String(c) });
              return { ac, bc, c, f };
            }, (v) => fair(v.ac, v.bc) && !v.f.b.clash());
            const { ac, bc, c } = w, ang = n === 0 ? 'A' : 'B', opp = ang === 'A' ? bc : ac, adj = ang === 'A' ? ac : bc, oppN = ang === 'A' ? 'BC' : 'AC', adjN = ang === 'A' ? 'AC' : 'BC';
            const sin = num(opp, c), cos = num(adj, c), tan = num(opp, adj);
            return aMulti(`그림과 같이 ∠C = 90°인 직각삼각형 ABC에서 ${fn('sin', ang)}, ${fn('cos', ang)}, ${fn('tan', ang)}의 값을 차례로 구하시오.`, [
              { label: fn('sin', ang), x: sin, sq: [`${opp}**2`, `${c}**2`] }, { label: fn('cos', ang), x: cos, sq: [`${adj}**2`, `${c}**2`] }, { label: fn('tan', ang), x: tan, sq: [`${opp}**2`, `${adj}**2`] }], {
              figure: w.f.b.svg(`직각삼각형 ABC. ∠C에 직각 표시가 있다. AB = ${c}, BC = ${bc}, CA = ${ac}`),
              explain: `∠${ang}의 대변은 ${seg(oppN)}, 이웃한 변은 ${seg(adjN)}, 빗변은 ${seg('AB')}이다. ${told('sin', ang, opp, c, sin)}, ${told('cos', ang, adj, c, cos)}, ${told('tan', ang, opp, adj, tan)}이다.`
            });
          }, { count: 2 }),
          T('ratio-legs', '직각을 낀 두 변의 길이로 삼각비 구하기', '①2', (d) => {
            // 빗변의 길이가 근호가 든 수가 된다. 묻는 각의 대변이 짧은 변이 되게 이름을 붙인다(tan 의 칸이 늘 분수).
            const w = d.until(() => {
              const u = d.int(1, 8), v = d.int(2, 12), ang = d.pick(['A', 'B']), pose = d.pick(POSES);
              const [ac, bc] = ang === 'A' ? [v, u] : [u, v];
              const f = rtFig({ R: 'C', P: 'A', Q: 'B' }, ac, bc, pose, { AC: String(ac), CB: String(bc) });
              return { u, v, ang, ac, bc, f };
            }, (x) => x.u < x.v && !isSq(x.u * x.u + x.v * x.v) && fair(x.u, x.v) && !x.f.b.clash());
            const { u, v, ang, ac, bc } = w, H = u * u + v * v, hyp = sqrtN(H), oppN = ang === 'A' ? 'BC' : 'AC', adjN = ang === 'A' ? 'AC' : 'BC';
            const sin = vdiv(num(u), hyp), cos = vdiv(num(v), hyp), tan = num(u, v);
            return aMulti(`그림과 같이 ∠C = 90°인 직각삼각형 ABC에서 ${fn('sin', ang)}, ${fn('cos', ang)}, ${fn('tan', ang)}의 값을 차례로 구하시오.`, [
              { label: fn('sin', ang), x: sin, sq: [`${u}**2`, `${u}**2+${v}**2`] }, { label: fn('cos', ang), x: cos, sq: [`${v}**2`, `${u}**2+${v}**2`] }, { label: fn('tan', ang), x: tan, sq: [`${u}**2`, `${v}**2`] }], {
              figure: w.f.b.svg(`직각삼각형 ABC. ∠C에 직각 표시가 있다. BC = ${bc}, CA = ${ac}이고 AB의 길이는 적혀 있지 않다`),
              explain: `${PYTH}${seg('AB')} = ${rt(`${u}${sup(2)} + ${v}${sup(2)}`)} = ${vh(hyp)}이다. ${fn('sin', ang)} = ${frac(seg(oppN), seg('AB'))} = ${frac(u, vh(hyp))} = ${vh(sin)}, ${fn('cos', ang)} = ${frac(v, vh(hyp))} = ${vh(cos)}, ${fn('tan', ang)} = ${frac(seg(oppN), seg(adjN))} = ${vh(tan)}이다.`
            });
          }),
          T('ratio-hypleg', '빗변과 한 변의 길이로 삼각비 구하기', '①2', (d) => {
            // 나머지 한 변이 근호가 든 수가 된다. 묻는 각의 대변이 주어진 변이다.
            const w = d.until(() => {
              const c = d.int(3, 13), u = d.int(1, 12), ang = d.pick(['A', 'B']), pose = d.pick(POSES), L = Math.sqrt(c * c - u * u);
              const [ac, bc] = ang === 'A' ? [L, u] : [u, L];
              const labels = ang === 'A' ? { CB: String(u), AB: String(c) } : { AC: String(u), AB: String(c) };
              const f = rtFig({ R: 'C', P: 'A', Q: 'B' }, ac, bc, pose, labels);
              return { c, u, ang, L, f };
            }, (x) => x.u < x.c && !isSq(x.c * x.c - x.u * x.u) && fair(x.u, x.L) && !x.f.b.clash() && kindOf(vdiv(num(x.u), sqrtN(x.c * x.c - x.u * x.u))) === 'radfrac');
            const { c, u, ang } = w, other = sqrtN(c * c - u * u), oppN = ang === 'A' ? 'BC' : 'AC', adjN = ang === 'A' ? 'AC' : 'BC';
            const sin = num(u, c), cos = vdiv(other, num(c)), tan = vdiv(num(u), other);
            return aMulti(`그림과 같이 ∠C = 90°인 직각삼각형 ABC에서 ${fn('sin', ang)}, ${fn('cos', ang)}, ${fn('tan', ang)}의 값을 차례로 구하시오.`, [
              { label: fn('sin', ang), x: sin, sq: [`${u}**2`, `${c}**2`] }, { label: fn('cos', ang), x: cos, sq: [`${c}**2-${u}**2`, `${c}**2`] }, { label: fn('tan', ang), x: tan, sq: [`${u}**2`, `${c}**2-${u}**2`] }], {
              figure: w.f.b.svg(`직각삼각형 ABC. ∠C에 직각 표시가 있다. AB = ${c}, ${oppN} = ${u}이고 ${adjN}의 길이는 적혀 있지 않다`),
              explain: `${PYTH}${seg(adjN)} = ${rt(`${c}${sup(2)} − ${u}${sup(2)}`)} = ${vh(other)}이다. ${fn('sin', ang)} = ${frac(seg(oppN), seg('AB'))} = ${vh(sin)}, ${fn('cos', ang)} = ${frac(seg(adjN), seg('AB'))} = ${frac(vh(other), c)} = ${vh(cos)}, ${fn('tan', ang)} = ${frac(seg(oppN), seg(adjN))} = ${frac(u, vh(other))} = ${vh(tan)}이다.`
            });
          }),
          T('ratio-wrong', '한 직각삼각형의 삼각비 가운데 옳지 않은 것', '①5', (d) => {
            // 두 변이 그림에 있고 나머지 한 변은 피타고라스 정리로 구한다. 틀린 보기는 분자와 분모를 뒤바꾼 것이거나 다른 비의 값이다.
            const w = d.until(() => {
              const legs = d.bool(), pose = d.pick(POSES);
              if (legs) { const ac = d.int(1, 9), bc = d.int(1, 9); return { ac: num(ac), bc: num(bc), ab: sqrtN(ac * ac + bc * bc), fa: ac, fb: bc, lab: { AC: String(ac), CB: String(bc) }, said: `BC = ${bc}, CA = ${ac}`, pose, missing: 'AB' }; }
              const ab = d.int(3, 10), side = d.int(1, ab - 1), ac0 = d.bool();
              const rest = sqrtN(ab * ab - side * side);
              return ac0 ? { ac: num(side), bc: rest, ab: num(ab), fa: side, fb: Math.sqrt(ab * ab - side * side), lab: { AC: String(side), AB: String(ab) }, said: `AB = ${ab}, CA = ${side}`, pose, missing: 'BC' }
                : { ac: rest, bc: num(side), ab: num(ab), fa: Math.sqrt(ab * ab - side * side), fb: side, lab: { CB: String(side), AB: String(ab) }, said: `AB = ${ab}, BC = ${side}`, pose, missing: 'AC' };
            }, (v) => v.fa !== v.fb && fair(v.fa, v.fb));
            const { ac, bc, ab } = w;
            const f = rtFig({ R: 'C', P: 'A', Q: 'B' }, w.fa, w.fb, w.pose, w.lab);
            const truth = { 'sin A': vdiv(bc, ab), 'cos A': vdiv(ac, ab), 'tan A': vdiv(bc, ac), 'sin B': vdiv(ac, ab), 'cos B': vdiv(bc, ab), 'tan B': vdiv(ac, bc) };
            const names = Object.keys(truth);
            const rows = d.until(() => {
              const pick = d.shuffle(names).slice(0, 5), badAt = d.int(0, 4), bad = pick[badAt];
              const cands = [vinv(truth[bad])].concat(names.filter((nm) => nm !== bad).map((nm) => truth[nm]));
              const wrong = d.pick(cands);
              return pick.map((nm, i) => [nm, i === badAt ? wrong : truth[nm], i !== badAt]);
            }, (list) => list.every(([nm, x, ok]) => ok || (!veq(x, truth[nm]) && (nm.startsWith('tan') || vfl(x) < 1))));
            const ordered = rows.slice().sort((x, y) => names.indexOf(x[0]) - names.indexOf(y[0]));
            const otherSide = w.missing === 'AB' ? `${seg('AB')} = ${vh(ab)}` : w.missing === 'BC' ? `${seg('BC')} = ${vh(bc)}` : `${seg('AC')} = ${vh(ac)}`;
            const bad = ordered.find((r) => !r[2]);
            return pickRows(d, '그림과 같이 ∠C = 90°인 직각삼각형 ABC에 대하여 다음 중 옳지 않은 것은?', ordered.map(([nm, x, ok]) => [fn(nm.split(' ')[0], nm.split(' ')[1]) + ' = ' + vh(x), !ok]), {
              keep: true,
              figure: f.b.svg(`직각삼각형 ABC. ∠C에 직각 표시가 있다. ${w.said}`),
              explain: `${PYTH}${otherSide}이다. ${fn(bad[0].split(' ')[0], bad[0].split(' ')[1])} = ${vh(truth[bad[0]])}이므로 옳지 않다.`
            });
          }),
          T('ratio-ratio', '두 변의 길이의 비로 삼각비 구하기', '①6', (d, n) => {
            if (n === 0) {
              // 직각을 낀 두 변의 비. 빗변은 근호가 든 수가 된다.
              const w = d.until(() => { const k = d.int(1, 6), l = d.int(1, 6), pose = d.pick(POSES); return { k, l, pose, f: rtFig({ R: 'C', P: 'A', Q: 'B' }, k, l, pose, {}) }; }, (v) => v.k !== v.l && gcd(v.k, v.l) === 1 && !isSq(v.k * v.k + v.l * v.l) && fair(v.k, v.l));
              const { k, l } = w, fname = d.pick(['sin A', 'cos A', 'sin B', 'cos B']), [f0, ang] = fname.split(' ');
              const top = (f0 === 'sin') === (ang === 'A') ? l : k, hyp = sqrtN(k * k + l * l), x = vdiv(num(top), hyp);
              return aRadFrac(`그림과 같이 ∠C = 90°인 직각삼각형 ABC에서 ${nb(`${seg('AC')} : ${seg('BC')} = ${k} : ${l}`)}일 때, ${fn(f0, ang)}의 값은?`, x, {
                figure: w.f.b.svg('직각삼각형 ABC. ∠C에 직각 표시가 있고 변의 길이는 적혀 있지 않다'), sq: [`${top}**2`, `${k}**2+${l}**2`],
                explain: `${seg('AC')} = ${kv(k)}, ${seg('BC')} = ${kv(l)}(${V('k')} &gt; 0)라 하면 ${PYTH}${seg('AB')} = ${rt(`(${kv(k)})${sup(2)} + (${kv(l)})${sup(2)}`)} = ${vh(hyp)}${V('k')}이다. ${fn(f0, ang)} = ${frac(kv(top), vh(hyp) + V('k'))} = ${vh(x)}이다.`
              });
            }
            // 직각을 낀 한 변과 빗변의 비(∠A = 90°, 빗변 BC). 나머지 변 AC 가 근호가 든 수가 된다.
            const valOf = (k, l, fname) => { const ac = sqrtN(l * l - k * k); return fname === 'tan C' ? vdiv(num(k), ac) : fname === 'tan B' ? vdiv(ac, num(k)) : vdiv(ac, num(l)); };
            const w = d.until(() => { const k = d.int(1, 7), l = d.int(2, 9), pose = d.pick(POSES), fname = d.pick(['sin B', 'cos C', 'tan B', 'tan C']); return { k, l, pose, fname, L: Math.sqrt(l * l - k * k) }; },
              (v) => v.k < v.l && gcd(v.k, v.l) === 1 && !isSq(v.l * v.l - v.k * v.k) && fair(v.k, v.L) && kindOf(valOf(v.k, v.l, v.fname)) === 'radfrac');
            const { k, l, pose, fname } = w, f = rtFig({ R: 'A', P: 'B', Q: 'C' }, k, w.L, pose, {});
            const ac = sqrtN(l * l - k * k), [f0, ang] = fname.split(' '), x = valOf(k, l, fname);
            const sq = fname === 'tan C' ? [`${k}**2`, `${l}**2-${k}**2`] : fname === 'tan B' ? [`${l}**2-${k}**2`, `${k}**2`] : [`${l}**2-${k}**2`, `${l}**2`];
            const ratioH = fname === 'tan C' ? frac(seg('AB'), seg('AC')) : fname === 'tan B' ? frac(seg('AC'), seg('AB')) : frac(seg('AC'), seg('BC'));
            return aRadFrac(`그림과 같이 ∠A = 90°인 직각삼각형 ABC에서 ${nb(`${seg('AB')} : ${seg('BC')} = ${k} : ${l}`)}일 때, ${fn(f0, ang)}의 값은?`, x, {
              figure: f.b.svg('직각삼각형 ABC. ∠A에 직각 표시가 있고 변의 길이는 적혀 있지 않다'), sq,
              explain: `${seg('AB')} = ${kv(k)}, ${seg('BC')} = ${kv(l)}(${V('k')} &gt; 0)라 하면 ${PYTH}${seg('AC')} = ${rt(`(${kv(l)})${sup(2)} − (${kv(k)})${sup(2)}`)} = ${vh(ac)}${V('k')}이다. ${fn(f0, ang)} = ${ratioH} = ${vh(x)}이다.`
            });
          }, { count: 2 }),
          T('ratio-side', '한 변의 길이와 한 삼각비로 다른 변의 길이 구하기', '①7', (d, n) => {
            if (n === 0) {
              // ∠C = 90°, 빗변 AB 와 cos A(또는 sin A) → 이웃한 변(대변) → 피타고라스 정리로 나머지 변(근호가 든 수)
              const w = d.until(() => { const q = d.int(3, 9), p = d.int(1, q - 1), t = d.int(1, 3), useCos = d.bool(); return { q, p, t, c: q * t, useCos }; },
                (v) => gcd(v.p, v.q) === 1 && !isSq(v.q * v.q - v.p * v.p) && sqParts(v.q * v.q - v.p * v.p)[0] * v.t >= 2 && fair(v.p, Math.sqrt(v.q * v.q - v.p * v.p)) && v.c <= 30);
              const { q, p, t, c, useCos } = w, known = p * t, rest = vmul(num(t), sqrtN(q * q - p * p));
              const [ac, bc] = useCos ? [known, Math.sqrt(c * c - known * known)] : [Math.sqrt(c * c - known * known), known];
              const f = rtFig({ R: 'C', P: 'A', Q: 'B' }, ac, bc, d.pick(POSES), { AB: String(c) });
              const ask = useCos ? 'BC' : 'AC', got = useCos ? 'AC' : 'BC', fname = useCos ? 'cos' : 'sin';
              return aRad(`그림과 같이 ∠C = 90°인 직각삼각형 ABC에서 ${seg('AB')} = ${c}, ${fn(fname, 'A')} = ${frac(p, q)}일 때, ${seg(ask)}의 길이는?`, rest, {
                figure: f.b.svg(`직각삼각형 ABC. ∠C에 직각 표시가 있다. AB = ${c}`), sq: [`${c}**2-(${c}*${p}/${q})**2`, '1'],
                explain: `${fn(fname, 'A')} = ${frac(seg(got), seg('AB'))} = ${frac(seg(got), c)} = ${frac(p, q)}이므로 ${seg(got)} = ${known}이다. ${PYTH}${seg(ask)} = ${rt(`${c}${sup(2)} − ${known}${sup(2)}`)} = ${vh(rest)}이다.`
              });
            }
            // ∠B = 90°, 대변(또는 이웃한 변)과 sin A(또는 cos A) → 빗변 → 나머지 변
            const w = d.until(() => { const q = d.int(3, 9), p = d.int(1, q - 1), t = d.int(1, 4), useSin = d.bool(); return { q, p, t, useSin }; },
              (v) => gcd(v.p, v.q) === 1 && !isSq(v.q * v.q - v.p * v.p) && sqParts(v.q * v.q - v.p * v.p)[0] * v.t >= 2 && fair(v.p, Math.sqrt(v.q * v.q - v.p * v.p)) && v.q * v.t <= 30);
            const { q, p, t, useSin } = w, known = p * t, hyp = q * t, rest = vmul(num(t), sqrtN(q * q - p * p));
            const [ab, bc] = useSin ? [Math.sqrt(hyp * hyp - known * known), known] : [known, Math.sqrt(hyp * hyp - known * known)];
            const gotN = useSin ? 'BC' : 'AB', askN = useSin ? 'AB' : 'BC', fname = useSin ? 'sin' : 'cos';
            const f = rtFig({ R: 'B', P: 'A', Q: 'C' }, ab, bc, d.pick(POSES), useSin ? { BC: String(known) } : { AB: String(known) });
            return aRad(`그림과 같이 ∠B = 90°인 직각삼각형 ABC에서 ${seg(gotN)} = ${known}, ${fn(fname, 'A')} = ${frac(p, q)}일 때, ${seg(askN)}의 길이는?`, rest, {
              figure: f.b.svg(`직각삼각형 ABC. ∠B에 직각 표시가 있다. ${gotN} = ${known}`), sq: [`(${known}*${q}/${p})**2-${known}**2`, '1'],
              explain: `${fn(fname, 'A')} = ${frac(seg(gotN), seg('AC'))} = ${frac(known, seg('AC'))} = ${frac(p, q)}이므로 ${seg('AC')} = ${hyp}이다. ${PYTH}${seg(askN)} = ${rt(`${hyp}${sup(2)} − ${known}${sup(2)}`)} = ${vh(rest)}이다.`
            });
          }, { count: 2 }),
          T('ratio-tan-dec', '소수로 준 탄젠트로 변의 길이와 다른 삼각비 구하기', '①7', (d) => {
            // ∠B = 90°, tan C 를 소수로 준다. AB = BC × tan C, 빗변 AC 는 근호가 든 수가 된다.
            const DEC = [['0.4', 2, 5], ['0.6', 3, 5], ['0.8', 4, 5], ['1.2', 6, 5], ['1.4', 7, 5], ['1.6', 8, 5], ['0.25', 1, 4], ['1.25', 5, 4], ['1.5', 3, 2], ['2.5', 5, 2], ['0.5', 1, 2]];
            const w = d.until(() => { const [s, p, q] = d.pick(DEC), t = d.int(2, 6); return { s, p, q, t, bc: q * t, ab: p * t }; }, (v) => !isSq(v.p * v.p + v.q * v.q) && fair(v.p, v.q) && v.bc <= 30);
            const { s, p, q, bc, ab } = w, ac = sqrtN(ab * ab + bc * bc), cosA = vdiv(num(ab), ac);
            const f = rtFig({ R: 'B', P: 'C', Q: 'A' }, bc, ab, d.pick(POSES), { CB: String(bc) });
            return aMulti(`그림과 같이 ∠B = 90°인 직각삼각형 ABC에서 ${fn('tan', 'C')} = ${s}, ${seg('BC')} = ${bc}일 때, ${seg('AB')}의 길이와 ${fn('cos', 'A')}의 값을 차례로 구하시오.`, [
              { label: seg('AB'), x: num(ab), sq: [`(${bc}*${s}*10)**2`, '100'] }, { label: fn('cos', 'A'), x: cosA, sq: [`(${bc}*${s})**2`, `(${bc}*${s})**2+${bc}**2`] }], {
              figure: f.b.svg(`직각삼각형 ABC. ∠B에 직각 표시가 있다. BC = ${bc}`),
              explain: `${fn('tan', 'C')} = ${frac(seg('AB'), seg('BC'))} = ${frac(seg('AB'), bc)} = ${s}이므로 ${seg('AB')} = ${bc} × ${s} = ${ab}이다. ${PYTH}${seg('AC')} = ${rt(`${ab}${sup(2)} + ${bc}${sup(2)}`)} = ${vh(ac)}이므로 ${fn('cos', 'A')} = ${frac(seg('AB'), seg('AC'))} = ${frac(ab, vh(ac))} = ${vh(cosA)}이다.`
            });
          }),
          T('ratio-area', '빗변의 길이와 한 삼각비로 직각삼각형의 넓이 구하기', '①8', (d) => {
            const w = d.until(() => { const q = d.int(3, 9), p = d.int(1, q - 1), t = d.int(1, 4), useCos = d.bool(); return { q, p, t, useCos }; },
              (v) => { if (gcd(v.p, v.q) !== 1 || isSq(v.q * v.q - v.p * v.p) || v.q * v.t > 24 || !fair(v.p, Math.sqrt(v.q * v.q - v.p * v.p))) return false; const [s] = sqParts(v.q * v.q - v.p * v.p); return (v.p * v.t * v.t * s) % 2 === 0 && v.p * v.t * v.t * s / 2 >= 2; });
            const { q, p, t, useCos } = w, hyp = q * t, known = p * t, rest = vmul(num(t), sqrtN(q * q - p * p)), area = vmul(vmul(num(known), rest), num(1, 2));
            const [ab, bc] = useCos ? [known, Math.sqrt(hyp * hyp - known * known)] : [Math.sqrt(hyp * hyp - known * known), known];
            const f = rtFig({ R: 'B', P: 'A', Q: 'C' }, ab, bc, d.pick(POSES), { AC: hyp + ' cm' });
            const gotN = useCos ? 'AB' : 'BC', otherN = useCos ? 'BC' : 'AB', fname = useCos ? 'cos' : 'sin';
            return aRad(`그림과 같이 ∠B = 90°인 직각삼각형 ABC에서 ${seg('AC')} = ${hyp} cm, ${fn(fname, 'A')} = ${frac(p, q)}일 때, △ABC의 넓이는?`, area, {
              unit: 'cm²', figure: f.b.svg(`직각삼각형 ABC. ∠B에 직각 표시가 있다. AC = ${hyp} cm`), sq: [`(${hyp}*${p}/${q})**2*(${hyp}**2-(${hyp}*${p}/${q})**2)`, '4'],
              explain: `${fn(fname, 'A')} = ${frac(seg(gotN), seg('AC'))} = ${frac(seg(gotN), hyp)} = ${frac(p, q)}이므로 ${seg(gotN)} = ${known} cm이다. ${PYTH}${seg(otherN)} = ${rt(`${hyp}${sup(2)} − ${known}${sup(2)}`)} = ${vh(rest)}(cm)이다. △ABC의 넓이는 ${frac(1, 2)} × ${known} × ${vh(rest)} = ${vh(area)}(cm²)이다.`
            });
          }),
          T('ratio-letters', '변의 길이와 삼각비 사이의 관계식 가리기', '①9', (d) => {
            const a = V('a'), b = V('b'), c = V('c'), sA = fn('sin', 'A'), cA = fn('cos', 'A'), tA = fn('tan', 'A'), sB = fn('sin', 'B'), cB = fn('cos', 'B'), tB = fn('tan', 'B');
            const yes = [`${a} = ${c} × ${sA}`, `${b} = ${c} × ${cA}`, `${a} = ${b} × ${tA}`, `${b} = ${c} × ${sB}`, `${a} = ${c} × ${cB}`, `${b} = ${a} × ${tB}`, `${c} = ${a} ÷ ${sA}`, `${c} = ${b} ÷ ${cA}`, `${b} = ${a} ÷ ${tA}`];
            const no = [
              [`${a} = ${c} × ${cA}`, `${c} × ${cA} = ${c} × ${frac(b, c)} = ${b}이므로 「${a} = ${c} × ${cA}」는 옳지 않다.`],
              [`${b} = ${c} × ${sA}`, `${c} × ${sA} = ${c} × ${frac(a, c)} = ${a}이므로 「${b} = ${c} × ${sA}」는 옳지 않다.`],
              [`${a} = ${b} × ${tB}`, `${b} × ${tB} = ${b} × ${frac(b, a)}이므로 「${a} = ${b} × ${tB}」는 옳지 않다.`],
              [`${b} = ${a} ÷ ${tB}`, `${a} ÷ ${tB} = ${a} × ${frac(a, b)}이므로 「${b} = ${a} ÷ ${tB}」는 옳지 않다.`],
              [`${c} = ${a} × ${sA}`, `${a} × ${sA} = ${a} × ${frac(a, c)}이므로 「${c} = ${a} × ${sA}」는 옳지 않다.`],
              [`${c} = ${b} ÷ ${sA}`, `${b} ÷ ${sA} = ${b} × ${frac(c, a)}이므로 「${c} = ${b} ÷ ${sA}」는 옳지 않다.`]
            ];
            const f = rtFig({ R: 'C', P: 'A', Q: 'B' }, 4, 3, d.pick(POSES), { AC: lx('b'), CB: lx('a'), AB: lx('c') });
            const wantTrue = d.bool();
            const item = claimQ(d, `그림과 같이 ∠C = 90°인 직각삼각형 ABC에서 ${seg('BC')} = ${a}, ${seg('CA')} = ${b}, ${seg('AB')} = ${c}일 때, 다음 중 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, yes, no, wantTrue);
            item.figure = f.b.svg('직각삼각형 ABC. ∠C에 직각 표시가 있다. 변 BC는 a, 변 CA는 b, 변 AB는 c');
            return seal(item);
          })
        ]
      },
      {
        id: 'given', title: '한 삼각비의 값으로 다른 삼각비 구하기', standard: STD,
        types: [
          T('given-one', '한 삼각비의 값으로 나머지 두 삼각비 구하기', '①10', (d, n) => {
            // 직각삼각형을 그려 피타고라스 정리로 푼다. 나머지 변이 근호가 든 수가 되게 고른다.
            const kinds = ['sin', 'cos', 'tan', d.pick(['sin', 'cos'])], g = kinds[n];
            const w = d.until(() => { const q = d.int(2, 9), p = d.int(1, g === 'tan' ? 9 : q - 1); return { p, q }; }, (v) => {
              if (gcd(v.p, v.q) !== 1 || (g !== 'tan' && v.p >= v.q)) return false;
              const other = g === 'tan' ? v.p * v.p + v.q * v.q : v.q * v.q - v.p * v.p;
              if (isSq(other) || v.p === v.q) return false;
              const o = sqrtN(other), xs = g === 'tan' ? [vdiv(num(v.p), o), vdiv(num(v.q), o)] : [vdiv(o, num(v.q)), vdiv(num(v.p), o)];
              return xs.every((x) => kindOf(x) === 'radfrac');
            });
            const { p, q } = w;
            if (g === 'tan') {
              const hyp = sqrtN(p * p + q * q), sin = vdiv(num(p), hyp), cos = vdiv(num(q), hyp);
              return aMulti(`∠A가 예각이고 ${fn('tan', 'A')} = ${frac(p, q)}일 때, ${fn('sin', 'A')}, ${fn('cos', 'A')}의 값을 차례로 구하시오.`, [
                { label: fn('sin', 'A'), x: sin, sq: [`${p}**2`, `${p}**2+${q}**2`] }, { label: fn('cos', 'A'), x: cos, sq: [`${q}**2`, `${p}**2+${q}**2`] }], {
                explain: `${fn('tan', 'A')} = ${frac(p, q)}이므로 ∠C = 90°, ${seg('BC')} = ${p}, ${seg('AC')} = ${q}인 직각삼각형 ABC를 생각할 수 있다. ${PYTH}${seg('AB')} = ${rt(`${p}${sup(2)} + ${q}${sup(2)}`)} = ${vh(hyp)}이므로 ${fn('sin', 'A')} = ${frac(p, vh(hyp))} = ${vh(sin)}, ${fn('cos', 'A')} = ${frac(q, vh(hyp))} = ${vh(cos)}이다.`,
                rule: 'given-tan'
              });
            }
            const other = sqrtN(q * q - p * p), otherF = g === 'sin' ? 'cos' : 'sin', mine = g === 'sin' ? 'BC' : 'AC', rest = g === 'sin' ? 'AC' : 'BC';
            const ox = vdiv(other, num(q)), tan = g === 'sin' ? vdiv(num(p), other) : vdiv(other, num(p));
            const head = n === 3 ? `${q} ${fn(g, 'A')} − ${p} = 0이고 ∠A가 예각일 때` : `∠A가 예각이고 ${fn(g, 'A')} = ${frac(p, q)}일 때`;
            return aMulti(`${head}, ${fn(otherF, 'A')}, ${fn('tan', 'A')}의 값을 차례로 구하시오.`, [
              { label: fn(otherF, 'A'), x: ox, sq: [`${q}**2-${p}**2`, `${q}**2`] }, { label: fn('tan', 'A'), x: tan, sq: g === 'sin' ? [`${p}**2`, `${q}**2-${p}**2`] : [`${q}**2-${p}**2`, `${p}**2`] }], {
              explain: `${n === 3 ? `${q} ${fn(g, 'A')} − ${p} = 0에서 ` : ''}${fn(g, 'A')} = ${frac(p, q)}이므로 ∠C = 90°, ${seg('AB')} = ${q}, ${seg(mine)} = ${p}인 직각삼각형 ABC를 생각할 수 있다. ${PYTH}${seg(rest)} = ${rt(`${q}${sup(2)} − ${p}${sup(2)}`)} = ${vh(other)}이므로 ${eqs(fn(otherF, 'A'), frac(vh(other), q), vh(ox))}, ${eqs(fn('tan', 'A'), g === 'sin' ? frac(p, vh(other)) : frac(vh(other), p), vh(tan))}이다.`,
              rule: 'given-' + g + (n === 3 ? '-eq' : '')
            });
          }, { count: 4 }),
          T('given-rad', '근호가 든 삼각비의 값으로 다른 삼각비 구하기', '①10', (d) => {
            // cos A = k√m/b 로 준다. sin A = √(b² − k²m)/b.
            const w = d.until(() => { const b = d.int(2, 7), k = d.int(1, 3), m = d.pick([2, 3, 5, 6, 7, 10]), g = d.pick(['sin', 'cos']); return { b, k, m, g }; },
              (v) => v.k * v.k * v.m < v.b * v.b && gcd(v.k, v.b) === 1 && !isSq(v.b * v.b - v.k * v.k * v.m) && kindOf(rad(1, v.b * v.b - v.k * v.k * v.m, v.b)) === 'radfrac');
            const { b, k, m, g } = w, given = rad(k, m, b), restSq = b * b - k * k * m, other = sqrtN(restSq), ans = rad(1, restSq, b), otherF = g === 'sin' ? 'cos' : 'sin';
            return aRadFrac(`∠A가 예각이고 ${fn(g, 'A')} = ${vh(given)}일 때, ${fn(otherF, 'A')}의 값은?`, ans, {
              sq: [`${b}**2-${k}**2*${m}`, `${b}**2`],
              explain: `${fn(g, 'A')} = ${frac((k === 1 ? '' : k) + rt(m), b)}이므로 ∠C = 90°, ${seg('AB')} = ${b}, ${seg(g === 'sin' ? 'BC' : 'AC')} = ${vh(rad(k, m))}인 직각삼각형 ABC를 생각할 수 있다. ${PYTH}${seg(g === 'sin' ? 'AC' : 'BC')} = ${rt(`${b}${sup(2)} − (${vh(rad(k, m))})${sup(2)}`)} = ${vh(other)}이므로 ${eqs(fn(otherF, 'A'), frac(vh(other), b), vh(ans))}이다.`
            });
          }),
          T('given-expr', '탄젠트의 값으로 삼각비가 든 분수식의 값 구하기', '①12 심1', (d, n) => {
            const w = d.until(() => { const p = d.int(1, 9), q = d.int(1, 9), form = d.int(0, 1); return { p, q, form }; }, (v) => {
              if (v.p === v.q || gcd(v.p, v.q) !== 1) return false;
              const val = n === 0 ? (v.form === 0 ? Q(v.p + v.q, v.p - v.q) : Q(v.p - v.q, v.p + v.q)) : Q(v.p * v.q, v.p * v.p - v.q * v.q);
              return val.q > 1 && val.q <= 60 && Math.abs(val.p) <= 240;
            });
            const { p, q, form } = w, hyp = sqrtN(p * p + q * q), sin = vdiv(num(p), hyp), cos = vdiv(num(q), hyp);
            const head = `∠A가 예각이고 ${fn('tan', 'A')} = ${frac(p, q)}일 때,`, sA = fn('sin', 'A'), cA = fn('cos', 'A');
            const lead = `${fn('tan', 'A')} = ${frac(p, q)}이므로 ∠C = 90°, ${seg('BC')} = ${p}, ${seg('AC')} = ${q}인 직각삼각형 ABC를 생각할 수 있다. ${seg('AB')} = ${vh(hyp)}이므로 ${sA} = ${vh(sin)}, ${cA} = ${vh(cos)}이다. `;
            if (n === 0) {
              const [top, bottom] = form === 0 ? [vadd(sin, cos), vsub(sin, cos)] : [vsub(sin, cos), vadd(sin, cos)], val = vdiv(top, bottom);
              const shown = form === 0 ? frac(`${sA} + ${cA}`, `${sA} − ${cA}`) : frac(`${sA} − ${cA}`, `${sA} + ${cA}`);
              return aFrac(`${head} ${nb(shown)}의 값은?`, val, { signed: true, value: form === 0 ? `(${p}+${q})/(${p}-${q})` : `(${p}-${q})/(${p}+${q})`,
                explain: `${lead}분자는 ${vh(top)}, 분모는 ${vh(bottom)}이므로 구하는 값은 ${vh(top)} ÷ (${vh(bottom)}) = ${vh(val)}이다.`, rule: 'expr-sum' });
            }
            const val = vdiv(vmul(sin, cos), vsub(vmul(sin, sin), vmul(cos, cos)));
            const shown = frac(`${sA} × ${cA}`, `(${sA})${sup(2)} − (${cA})${sup(2)}`);
            return aFrac(`${head} ${nb(shown)}의 값은?`, val, { signed: true, value: `(${p}*${q})/(${p}**2-${q}**2)`,
              explain: `${lead}${sA} × ${cA} = ${vh(vmul(sin, cos))}, (${sA})${sup(2)} − (${cA})${sup(2)} = ${vh(vsub(vmul(sin, sin), vmul(cos, cos)))}이므로 구하는 값은 ${vh(val)}이다.`, rule: 'expr-square' });
          }, { count: 2 }),
          T('given-expr-rad', '유리화가 필요한 삼각비의 분수식', '①12', (d) => {
            // cos x(또는 sin x)를 유리수로 주면 tan x 는 근호가 든 수가 된다. (1 − tan x)/(1 + tan x) 따위를 유리화한다.
            const w = d.until(() => { const q = d.int(2, 7), p = d.int(1, q - 1), g = d.pick(['sin', 'cos']), form = d.int(0, 1); return { p, q, g, form }; },
              (v) => gcd(v.p, v.q) === 1 && !isSq(v.q * v.q - v.p * v.p));
            const { p, q, g, form } = w, other = sqrtN(q * q - p * p), tan = g === 'cos' ? vdiv(other, num(p)) : vdiv(num(p), other);
            const one = num(1), make = (t) => (form === 0 ? vdiv(vsub(one, t), vadd(one, t)) : vdiv(vadd(one, t), vsub(one, t)));
            const val = make(tan), tX = fx('tan', 'x');
            const shown = form === 0 ? frac(`1 − ${tX}`, `1 + ${tX}`) : frac(`1 + ${tX}`, `1 − ${tX}`);
            // 틀린 보기: 근호 항의 부호를 바꾼 것(켤레를 잘못 곱함), 전체 부호를 바꾼 것, tan 대신 그 역수를 넣은 것, 주어진 삼각비를 그대로 넣은 것
            const flip = val.map((t) => (t.m === 1 ? t : { q: qneg(t.q), m: t.m }));
            const wrongs = [flip, vneg(val), make(vinv(tan)), make(num(p, q)), vneg(flip)];
            return aPick(d, `0° &lt; ${X}° &lt; 90°이고 ${fx(g, 'x')} = ${frac(p, q)}일 때, ${nb(shown)}의 값은?`, val, wrongs, {
              explain: `${fx(g, 'x')} = ${frac(p, q)}인 직각삼각형에서 나머지 변은 ${rt(`${q}${sup(2)} − ${p}${sup(2)}`)} = ${vh(other)}이므로 ${tX} = ${vh(tan)}이다. 식에 넣고 분모를 유리화하면 ${vh(val)}이다.`
            });
          })
        ]
      },
      {
        id: 'figure', title: '그림 속 같은 각·입체·직선에서 삼각비', standard: STD,
        types: [
          T('figure-altitude', '직각삼각형의 빗변에 내린 수선이 만든 각의 삼각비', '①14', (d, n) => {
            // △ABC(∠C = 90°)에서 CD ⊥ AB. ∠ACD = ∠B, ∠BCD = ∠A(닮음). n = 0: 큰 삼각형의 두 변을 준다. n = 1: 작은 삼각형 BCD 의 세 변을 준다.
            const w = d.until(() => {
              const which = d.pick(['ACD', 'BCD']), f0 = d.pick(FN3);
              let ac, bc, ab, bd, cd;
              if (n === 0) { [ac, bc, ab] = legsOf(d); bd = bc * bc / ab; cd = ac * bc / ab; } else { [bd, cd, bc] = legsOf(d); ab = bc * bc / bd; ac = Math.sqrt(ab * ab - bc * bc); }
              const A = [0, 0], Bp = [ab, 0], D = [ab - bd, 0], Cp = [ab - bd, cd];
              const side = n === 0 ? [['A', 'C', String(ac)], ['C', 'B', String(bc)]] : [['B', 'D', String(bd)], ['C', 'D', String(cd), 'B'], ['C', 'B', String(bc)]];
              const f = fig({ A, B: Bp, C: Cp, D }, { polys: [['A', 'B', 'C']], segs: [['C', 'D']], right: [['C', 'A', 'B'], ['D', 'B', 'C']], side,
                ang: n === 0 ? [['C', which === 'ACD' ? 'A' : 'B', 'D', degx('x'), { r: 18 }]] : [], size: [196, 108] });
              return { ac, bc, ab, bd, cd, which, f0, f };
            }, (v) => fair(v.ac, v.bc) && v.bd / v.ab >= 0.2 && v.bd / v.ab <= 0.8 && !v.f.b.clash());
            const { ac, bc, ab, bd, cd, which, f0 } = w;
            if (n === 0) {
              // x 는 ∠B(∠ACD) 또는 ∠A(∠BCD)와 같다.
              const same = which === 'ACD' ? 'B' : 'A', opp = same === 'B' ? ac : bc, adj = same === 'B' ? bc : ac;
              const x = f0 === 'sin' ? num(opp, ab) : f0 === 'cos' ? num(adj, ab) : num(opp, adj);
              const sq = f0 === 'sin' ? [`${opp}**2`, `${ac}**2+${bc}**2`] : f0 === 'cos' ? [`${adj}**2`, `${ac}**2+${bc}**2`] : [`${opp}**2`, `${adj}**2`];
              return aFrac(`그림과 같이 ∠ACB = 90°인 직각삼각형 ABC의 꼭짓점 C에서 빗변 AB에 내린 수선의 발을 D라 하자. ${seg('AC')} = ${ac}, ${seg('BC')} = ${bc}이고 ∠${which} = ${X}°일 때, ${fx(f0, 'x')}의 값은?`, x, {
                figure: w.f.b.svg(`직각삼각형 ABC. ∠C에 직각 표시가 있고, C에서 빗변 AB에 내린 수선 CD가 있다. AC = ${ac}, BC = ${bc}. ∠${which}에 x°가 적혀 있다`), sq,
                explain: `△ABC와 △${which === 'ACD' ? 'ACD' : 'CBD'}에서 ∠${which === 'ACD' ? 'A' : 'B'}는 공통이고 직각이 하나씩 있으므로 닮음이다. 따라서 ∠${which} = ∠${same}이다. ${PYTH}${seg('AB')} = ${ab}이므로 ${fx(f0, 'x')} = ${fn(f0, same)} = ${vh(x)}이다.`,
                rule: 'alt-big'
              });
            }
            // 작은 삼각형 BCD 의 세 변으로 ∠A 의 삼각비(∠BCD = ∠A)
            const x = f0 === 'sin' ? num(bd, bc) : f0 === 'cos' ? num(cd, bc) : num(bd, cd);
            const sq = f0 === 'sin' ? [`${bd}**2`, `${bc}**2`] : f0 === 'cos' ? [`${cd}**2`, `${bc}**2`] : [`${bd}**2`, `${cd}**2`];
            return aFrac(`그림과 같이 ∠ACB = 90°인 직각삼각형 ABC의 꼭짓점 C에서 빗변 AB에 내린 수선의 발을 D라 하자. ${seg('BD')} = ${bd}, ${seg('CD')} = ${cd}, ${seg('BC')} = ${bc}일 때, ${fn(f0, 'A')}의 값은?`, x, {
              figure: w.f.b.svg(`직각삼각형 ABC. ∠C에 직각 표시가 있고, C에서 빗변 AB에 내린 수선 CD가 있다. BD = ${bd}, CD = ${cd}, BC = ${bc}`), sq,
              explain: `△ABC와 △CBD에서 ∠B는 공통이고 직각이 하나씩 있으므로 닮음이고 ∠A = ∠BCD이다. △CBD에서 ${fn(f0, 'A')} = ${f0 === 'sin' ? frac(seg('BD'), seg('BC')) : f0 === 'cos' ? frac(seg('CD'), seg('BC')) : frac(seg('BD'), seg('CD'))} = ${vh(x)}이다.`,
              rule: 'alt-small'
            });
          }, { count: 2 }),
          T('figure-foot', '변 위의 점에서 내린 수선이 만든 각의 삼각비', '①14', (d, n) => {
            if (n === 0) {
              // ∠A = 90°, AB = p, AC = q, AB 위의 점 D 에서 BC 에 내린 수선의 발 E. x = ∠BDE = ∠C.
              const w = d.until(() => {
                const p = d.int(2, 8), q = d.int(2, 8), f0 = d.pick(['sin', 'cos']), t = 0.42 + d.int(0, 2) * 0.08;
                const Bp = [0, 0], Cp = [Math.hypot(p, q), 0], A = [p * p / Math.hypot(p, q), p * q / Math.hypot(p, q)], D = [A[0] * t, A[1] * t];
                const u = [Cp[0] - Bp[0], 0], E = [D[0], 0];
                const f = fig({ A, B: Bp, C: Cp, D, E }, { polys: [['A', 'B', 'C']], segs: [['D', 'E']], right: [['A', 'B', 'C'], ['E', 'C', 'D']], side: [['A', 'C', String(q)]], dims: [['A', 'B', String(p), 'C', 12]], ang: [['D', 'B', 'E', degx('x'), { r: 14 }]], size: [196, 112], nameAt: { D: 10 } });
                return { p, q, f0, f, u };
              }, (v) => v.p !== v.q && !isSq(v.p * v.p + v.q * v.q) && v.p / v.q >= 0.6 && v.p / v.q <= 1.7 && !v.f.b.clash());
              const { p, q, f0 } = w, bc = sqrtN(p * p + q * q), x = f0 === 'sin' ? vdiv(num(p), bc) : vdiv(num(q), bc);
              return aRadFrac(`그림과 같이 ∠A = 90°인 직각삼각형 ABC에서 ${seg('AB')} 위의 한 점 D에서 ${seg('BC')}에 내린 수선의 발을 E라 하자. ${seg('AB')} = ${p}, ${seg('AC')} = ${q}이고 ∠BDE = ${X}°일 때, ${fx(f0, 'x')}의 값은?`, x, {
                figure: w.f.b.svg(`직각삼각형 ABC. ∠A에 직각 표시가 있다. 변 AB 위의 점 D에서 변 BC에 내린 수선 DE가 있고 ∠E에 직각 표시가 있다. AB = ${p}, AC = ${q}. ∠BDE에 x°가 적혀 있다`),
                sq: [`${f0 === 'sin' ? p : q}**2`, `${p}**2+${q}**2`],
                explain: `△ABC와 △EBD에서 ∠B는 공통이고 ∠BAC = ∠BED = 90°이므로 닮음이고 ∠BDE = ∠C이다. ${PYTH}${seg('BC')} = ${vh(bc)}이므로 ${fx(f0, 'x')} = ${fn(f0, 'C')} = ${f0 === 'sin' ? frac(seg('AB'), seg('BC')) : frac(seg('AC'), seg('BC'))} = ${vh(x)}이다.`,
                rule: 'foot-big'
              });
            }
            // ∠C = 90°, BC 위의 점 D 에서 AB 에 내린 수선의 발 E. BD = h, DE = a 를 준다. x = ∠BAC = ∠BDE → sin x = BE/BD
            const w = d.until(() => {
              const h = d.int(3, 9), a = d.int(1, h - 1), BE = Math.sqrt(h * h - a * a), kk = 1.5 + d.int(0, 3) * 0.25;
              // 큰 삼각형: B 에서 각 β(tan β = a/BE), BC = BD * kk
              const beta = Math.atan2(a, BE), bcLen = h * kk, Bp = [0, 0], Cp = [bcLen, 0], A = [bcLen, bcLen * Math.tan(beta)], D = [h, 0], E = [BE * Math.cos(beta), BE * Math.sin(beta)];
              const f = fig({ A, B: Bp, C: Cp, D, E }, { polys: [['A', 'B', 'C']], segs: [['D', 'E']], right: [['C', 'B', 'A'], ['E', 'B', 'D']], side: [['B', 'D', String(h)], ['D', 'E', String(a), 'B']], ang: [['A', 'B', 'C', degx('x'), { r: 16 }]], size: [200, 120] });
              return { h, a, f, ratio: A[1] / bcLen };
            }, (v) => !isSq(v.h * v.h - v.a * v.a) && v.ratio >= 0.32 && v.ratio <= 1.6 && !v.f.b.clash());
            const { h, a } = w, be = sqrtN(h * h - a * a), x = vdiv(be, num(h));
            return aRadFrac(`그림과 같이 ∠C = 90°인 직각삼각형 ABC에서 ${seg('BC')} 위의 한 점 D에서 ${seg('AB')}에 내린 수선의 발을 E라 하자. ${seg('BD')} = ${h}, ${seg('DE')} = ${a}이고 ∠BAC = ${X}°일 때, ${fx('sin', 'x')}의 값은?`, x, {
              figure: w.f.b.svg(`직각삼각형 ABC. ∠C에 직각 표시가 있다. 변 BC 위의 점 D에서 변 AB에 내린 수선 DE가 있고 ∠E에 직각 표시가 있다. BD = ${h}, DE = ${a}. ∠BAC에 x°가 적혀 있다`),
              sq: [`${h}**2-${a}**2`, `${h}**2`],
              explain: `△ABC와 △DBE에서 ∠B는 공통이고 ∠ACB = ∠DEB = 90°이므로 닮음이고 ∠BAC = ∠BDE이다. ${PYTH}${seg('BE')} = ${rt(`${h}${sup(2)} − ${a}${sup(2)}`)} = ${vh(be)}이므로 ${fx('sin', 'x')} = ${fn('sin', '(∠BDE)')} = ${frac(seg('BE'), seg('BD'))} = ${vh(x)}이다.`,
              rule: 'foot-small'
            });
          }, { count: 2 }),
          T('figure-pick-ratio', '수선으로 생긴 직각삼각형에서 같은 삼각비를 나타내는 비 고르기', '①15', (d) => {
            // ∠B = 90°, BD ⊥ AC. ∠A = ∠CBD.
            const f0 = d.pick(FN3);
            const SAME = {
              sin: [['BC', 'AC'], ['BD', 'AB'], ['CD', 'BC']],
              cos: [['AB', 'AC'], ['AD', 'AB'], ['BD', 'BC']],
              tan: [['BC', 'AB'], ['BD', 'AD'], ['CD', 'BD']]
            };
            const right = d.pick(SAME[f0]), wrongs = d.shuffle(FN3.filter((g) => g !== f0).flatMap((g) => SAME[g])).slice(0, 4);
            const [ab, bc] = d.pick([[3, 4], [4, 3], [5, 12], [12, 5], [8, 6], [6, 8]]), A = [0, 0], c = Math.hypot(ab, bc), Cp = [c, 0], Bp = [ab * ab / c, ab * bc / c], D = [ab * ab / c, 0];
            const f = fig({ A, B: Bp, C: Cp, D }, { polys: [['A', 'B', 'C']], segs: [['B', 'D']], right: [['B', 'A', 'C'], ['D', 'C', 'B']], size: [190, 100] });
            const show = ([p, q]) => frac(seg(p), seg(q));
            return pickRows(d, `그림과 같이 ∠B = 90°인 직각삼각형 ABC에서 ${seg('BD')} ⊥ ${seg('AC')}일 때, 다음 중 ${fn(f0, 'A')}의 값과 같은 것은?`, [[show(right), true]].concat(wrongs.map((r) => [show(r), false])), {
              figure: f.b.svg('직각삼각형 ABC. ∠B에 직각 표시가 있고, B에서 변 AC에 내린 수선 BD가 있다'),
              explain: `△ABC, △ABD, △BCD는 모두 닮음이고 ∠A = ∠CBD이다. ${fn(f0, 'A')} = ${SAME[f0].map(show).join(' = ')}이다.`
            });
          }),
          T('figure-iso', '이등변삼각형에서 수선을 내려 밑각의 삼각비 구하기', '①16', (d) => {
            const w = d.until(() => { const [h, k, s] = d.pick(TRIPLES), ang = d.pick(['B', 'C']), f0 = d.pick(FN3);
              const f = fig({ A: [h, k], B: [0, 0], C: [2 * h, 0] }, { polys: [['A', 'B', 'C']], ticks: [['A', 'B', 1], ['A', 'C', 1]], side: [['A', 'B', String(s)], ['B', 'C', String(2 * h)]], size: [180, 112] });
              return { h, k, s, ang, f0, f }; }, (v) => v.k / (2 * v.h) >= 0.3 && v.k / (2 * v.h) <= 1.3 && !v.f.b.clash());
            const { h, k, s, ang, f0 } = w, x = f0 === 'sin' ? num(k, s) : f0 === 'cos' ? num(h, s) : num(k, h);
            const sq = f0 === 'sin' ? [`${s}**2-(${2 * h}/2)**2`, `${s}**2`] : f0 === 'cos' ? [`(${2 * h}/2)**2`, `${s}**2`] : [`${s}**2-(${2 * h}/2)**2`, `(${2 * h}/2)**2`];
            return aFrac(`그림과 같이 ${seg('AB')} = ${seg('AC')} = ${s}, ${seg('BC')} = ${2 * h}인 이등변삼각형 ABC에서 ${fn(f0, ang)}의 값은?`, x, {
              figure: w.f.b.svg(`이등변삼각형 ABC. 변 AB와 변 AC에 길이가 같다는 표시가 있다. AB = ${s}, BC = ${2 * h}`), sq,
              explain: `꼭짓점 A에서 ${seg('BC')}에 내린 수선의 발을 H라 하면 이등변삼각형의 수선은 밑변을 이등분하므로 ${seg('BH')} = ${seg('CH')} = ${h}이다. ${PYTH}${seg('AH')} = ${rt(`${s}${sup(2)} − ${h}${sup(2)}`)} = ${k}이다. 직각삼각형 ${ang === 'B' ? 'ABH' : 'ACH'}에서 ${fn(f0, ang)} = ${vh(x)}이다.`
            });
          }),
          T('figure-box', '정육면체·직육면체의 대각선이 이루는 각의 삼각비', '①18', (d, n) => {
            // 윗면의 대각선 BD 와 대각선 BH 가 이루는 각 x = ∠DBH(∠BDH = 90°)
            const w = d.until(() => {
              const s = d.int(2, 9), dims = n === 0 ? [s, s, s] : [d.int(2, 8), d.int(2, 8), d.int(2, 8)], f0 = d.pick(FN3);
              const [a, b, c] = dims, fh = sqrtN(a * a + b * b), df = sqrtN(a * a + b * b + c * c);
              const x = f0 === 'sin' ? vdiv(num(c), df) : f0 === 'cos' ? vdiv(fh, df) : vdiv(num(c), fh);
              return { dims, f0, x, fh, df, f: boxFig(a, b, c, n === 0 ? { cube: true } : {}) };
            }, (v) => kindOf(v.x) === 'radfrac' && v.x[0].m <= 99 && v.x[0].q.q <= 99 && (n === 0 || (new Set(v.dims).size === 3 && v.dims[0] >= 3 && v.dims[2] <= v.dims[0] + 1 && v.dims[2] >= Math.max(3, 0.6 * v.dims[0]) && v.dims[1] < v.dims[0])) && !v.f.clash());
            const { dims, f0, x, fh, df, f } = w, [a, b, c] = dims;
            const sq = f0 === 'sin' ? [`${c}**2`, `${a}**2+${b}**2+${c}**2`] : f0 === 'cos' ? [`${a}**2+${b}**2`, `${a}**2+${b}**2+${c}**2`] : [`${c}**2`, `${a}**2+${b}**2`];
            const head = n === 0 ? `그림과 같이 한 모서리의 길이가 ${a}인 정육면체에서` : `그림과 같이 ${seg('FG')} = ${a}, ${seg('GH')} = ${b}, ${seg('DH')} = ${c}인 직육면체에서`;
            return aRadFrac(`${head} ∠DBH = ${X}°일 때, ${fx(f0, 'x')}의 값은?`, x, {
              figure: f.svg(n === 0 ? `정육면체 ABCD-EFGH. 한 모서리의 길이는 ${a}이다. 대각선 BH와 윗면의 대각선 BD가 그어져 있고 ∠DBH에 x°가 적혀 있다` : `직육면체 ABCD-EFGH. FG = ${a}, GH = ${b}, DH = ${c}. 대각선 BH와 윗면의 대각선 BD가 그어져 있고 ∠DBH에 x°가 적혀 있다`), sq,
              explain: `윗면 ABCD에서 ${seg('BC')} = ${a}, ${seg('CD')} = ${b}이므로 ${seg('BD')} = ${rt(`${a}${sup(2)} + ${b}${sup(2)}`)} = ${vh(fh)}이다. ${seg('DH')}는 윗면에 수직이므로 ∠BDH = 90°이고 ${seg('BH')} = ${rt(`(${vh(fh)})${sup(2)} + ${c}${sup(2)}`)} = ${vh(df)}이다. ${fx(f0, 'x')} = ${f0 === 'sin' ? frac(seg('DH'), seg('BH')) : f0 === 'cos' ? frac(seg('BD'), seg('BH')) : frac(seg('DH'), seg('BD'))} = ${vh(x)}이다.`,
              rule: n === 0 ? 'cube' : 'cuboid'
            });
          }, { count: 2 }),
          T('figure-pyramid', '모서리의 길이가 모두 같은 정사각뿔에서 삼각비', '①19', (d) => {
            const s = d.int(2, 9), f0 = d.pick(['sin', 'cos']), x = rad(1, 2, 2);
            const f = pyramidFig(s);
            return aRadFrac(`그림은 모서리의 길이가 모두 ${s}이고 밑면이 정사각형인 사각뿔이다. ∠EAC = ${X}°일 때, ${fx(f0, 'x')}의 값은?`, x, {
              figure: f.svg(`밑면이 정사각형 ABCD이고 꼭짓점이 E인 사각뿔. 모서리의 길이는 모두 ${s}이다. 밑면의 대각선 AC가 점선으로 그어져 있고 ∠EAC에 x°가 적혀 있다`),
              sq: [`${s}**2`, `2*${s}**2`],
              explain: `${seg('AC')} = ${rt(`${s}${sup(2)} + ${s}${sup(2)}`)} = ${vh(rad(s, 2))}이다. △EAC에서 ${seg('EA')}${sup(2)} + ${seg('EC')}${sup(2)} = ${2 * s * s} = ${seg('AC')}${sup(2)}이므로 ∠AEC = 90°인 직각이등변삼각형이다. ${fx(f0, 'x')} = ${f0 === 'sin' ? frac(seg('EC'), seg('AC')) : frac(seg('EA'), seg('AC'))} = ${frac(s, vh(rad(s, 2)))} = ${vh(x)}이다.`
            });
          }),
          T('figure-line', '직선이 좌표축과 만나는 점으로 만든 직각삼각형의 삼각비', '①20', (d, n) => {
            const w = d.until(() => { const u = d.int(1, 6), v = d.int(1, 6), f0 = d.pick(['sin', 'cos']); return { u, v, f0 }; }, (z) => z.u !== z.v && !isSq(z.u * z.u + z.v * z.v) && fair(z.u, z.v));
            const { u, v, f0 } = w, hyp = sqrtN(u * u + v * v), yv = V('y');
            if (n === 0) {
              // 기울기가 양수: y = (v/u)x + v, A(−u, 0), B(0, v), a = ∠BAO
              const m = Q(v, u), eq = `${yv} = ${m.q === 1 ? (m.p === 1 ? '' : m.p) : frac(m.p, m.q)}${X} + ${v}`;
              const x = f0 === 'sin' ? vdiv(num(v), hyp) : vdiv(num(u), hyp);
              const f = lineFig(-u, v, 'A');
              return aRadFrac(`그림과 같이 직선 ${nb(eq + tail(v, '이/가'))} ${X}축, ${yv}축과 만나는 점을 각각 A, B라 하자. ∠BAO = ${V('a')}°일 때, ${fx(f0, 'a')}의 값은? (단, O는 원점이다.)`, x, {
                figure: f.svg(`좌표평면 위의 직선이 x축의 음의 부분과 점 A에서, y축의 양의 부분과 점 B에서 만난다. ∠BAO에 a°가 적혀 있다. 직선의 식은 y = ${m.p}/${m.q}x + ${v}`),
                sq: [`${f0 === 'sin' ? v : u}**2`, `${u}**2+${v}**2`],
                explain: `${yv} = 0이면 ${X} = ${MINUS}${u}이므로 A(${MINUS}${u}, 0), ${X} = 0이면 ${yv} = ${v}이므로 B(0, ${v})이다. ${seg('OA')} = ${u}, ${seg('OB')} = ${v}이고 ${PYTH}${seg('AB')} = ${vh(hyp)}이다. ${fx(f0, 'a')} = ${f0 === 'sin' ? frac(seg('OB'), seg('AB')) : frac(seg('OA'), seg('AB'))} = ${vh(x)}이다.`,
                rule: 'line-x'
              });
            }
            // 기울기가 음수: v x + u y − uv = 0 을 약분해 적는다. A(u, 0), B(0, v), b = ∠ABO
            const g = gcd(gcd(v, u), u * v), a1 = v / g, b1 = u / g, c1 = u * v / g, eq = `${a1 === 1 ? '' : a1}${X} + ${b1 === 1 ? '' : b1}${yv} − ${c1} = 0`;
            const x = f0 === 'sin' ? vdiv(num(u), hyp) : vdiv(num(v), hyp);
            const f = lineFig(u, v, 'B');
            return aRadFrac(`그림과 같이 일차방정식 ${nb(eq)}의 그래프가 ${X}축, ${yv}축과 만나는 점을 각각 A, B라 하자. ∠ABO = ${V('b')}°일 때, ${fx(f0, 'b')}의 값은? (단, O는 원점이다.)`, x, {
              figure: f.svg(`좌표평면 위의 직선이 x축의 양의 부분과 점 A에서, y축의 양의 부분과 점 B에서 만난다. ∠ABO에 b°가 적혀 있다. 직선의 식은 ${a1}x + ${b1}y − ${c1} = 0`),
              sq: [`${f0 === 'sin' ? u : v}**2`, `${u}**2+${v}**2`],
              explain: `${yv} = 0이면 ${X} = ${u}이므로 A(${u}, 0), ${X} = 0이면 ${yv} = ${v}이므로 B(0, ${v})이다. ${seg('OA')} = ${u}, ${seg('OB')} = ${v}이고 ${PYTH}${seg('AB')} = ${vh(hyp)}이다. ${fx(f0, 'b')} = ${f0 === 'sin' ? frac(seg('OA'), seg('AB')) : frac(seg('OB'), seg('AB'))} = ${vh(x)}이다.`,
              rule: 'line-y'
            });
          }, { count: 2 })
        ]
      },
      { id: 'special', title: '30°, 45°, 60°의 삼각비의 값', standard: STD, types: [] },
      { id: 'length', title: '특수각으로 변의 길이와 넓이 구하기', standard: STD, types: [] },
      { id: 'quarter', title: '사분원과 0°, 90°의 삼각비, 삼각비의 대소', standard: STD, types: [] }
    ]
  });

  // ── 입체 그림 ──
  // 직육면체 ABCD-EFGH: 앞면 BCGF(F 왼쪽 아래, G 오른쪽 아래), 뒷면 ADHE. FG = a(가로), GH = b(안쪽으로), DH = c(높이).
  // 윗면의 대각선 BD, 대각선 BH 와 △BDH 를 그리고 ∠DBH 에 x°, ∠BDH 에 직각 표시를 한다. 보이지 않는 모서리(E 에서 나가는 것)는 점선.
  // (보이지 않는 꼭짓점 E 가 색칠한 삼각형 밖에 놓이도록 위쪽 삼각형을 쓴다.)
  function boxFig(a, b, c, o) {
    const k = Math.min(150 / (a + b * 0.62), 130 / (c + b * 0.42)), ox = b * 0.62 * k, oy = b * 0.42 * k;
    const F0 = [0, 0], G = [a * k, 0], Cp = [a * k, -c * k], Bp = [0, -c * k], E = [ox, -oy], H = [a * k + ox, -oy], D = [a * k + ox, -oy - c * k], A = [ox, -oy - c * k];
    const bd = Board();
    bd.poly([Bp, D, H], TINT);
    bd.seg(E, F0, 'cut').seg(E, H, 'cut').seg(E, A, 'cut');
    bd.poly([F0, G, Cp, Bp]).poly([Bp, Cp, D, A]).poly([G, H, D, Cp]);
    bd.seg(Bp, D).seg(Bp, H);
    // 비스듬히 본 직각: D 에서 DB, DH 쪽으로 7씩 간 평행사변형의 두 변
    const u = (p, q) => { const L = dist(p, q); return [(q[0] - p[0]) / L, (q[1] - p[1]) / L]; }, u1 = u(D, Bp), u2 = u(D, H), m = 7;
    const p1 = [D[0] + u1[0] * m, D[1] + u1[1] * m], p3 = [D[0] + u2[0] * m, D[1] + u2[1] * m], p2 = [p1[0] + u2[0] * m, p1[1] + u2[1] * m];
    bd.shape(`M${r1(p1[0])} ${r1(p1[1])}L${r1(p2[0])} ${r1(p2[1])}L${r1(p3[0])} ${r1(p3[1])}`, [p1, p2, p3], 'fill:none;stroke:#b42318;stroke-width:1.2');
    // x° 의 글은 ∠DBH 안에서 모서리 BC 와 대각선 BH 사이(앞면 위쪽)에 적는다(BC 가 각의 가운데를 지나므로).
    const dh = dirOf(Bp, H), half = (360 - dh) / 2, far = Math.min(80, Math.max(42, 8 / Math.tan(half * RAD)));
    bd.corner(Bp, D, H, '', { r: 18 }).text(at(Bp, far, dh + half), degx('x'), { blue: true });
    const inFront = [a * k / 2, -c * k / 2];
    if (o.cube) bd.beside(F0, G, String(a), inFront);
    else bd.beside(F0, G, String(a), inFront).beside(G, H, String(b), inFront, { gap: 3 }).beside(H, D, String(c), Bp, { t: 0.5 });
    const names = { A: [A, 120], B: [Bp, 180], C: [Cp, 235], D: [D, 30], E: [E, 135], F: [F0, 210], G: [G, 330], H: [H, 345] };
    for (const key of Object.keys(names)) bd.name(names[key][0], key, names[key][1], 10);
    return bd;
  }
  // 모서리의 길이가 모두 s 인 정사각뿔 E-ABCD: 밑면은 비스듬히 본 정사각형(A 왼쪽 앞, B 오른쪽 앞, C 오른쪽 뒤, D 왼쪽 뒤), E 는 밑면의 가운데 위.
  function pyramidFig(s) {
    const L = 120, ox = L * 0.5, oy = L * 0.32, A = [0, 0], Bp = [L, 0], Cp = [L + ox, -oy], D = [ox, -oy], O = [(L + ox) / 2, -oy / 2], E = [O[0], O[1] - L * Math.SQRT1_2 * 0.92];
    const bd = Board();
    bd.seg(A, D, 'cut').seg(D, Cp, 'cut').seg(E, D, 'cut').seg(A, Cp, 'cut');
    bd.seg(A, Bp).seg(Bp, Cp).seg(E, A).seg(E, Bp).seg(E, Cp);
    bd.corner(A, Cp, E, '', { r: 20 }).text(at(A, 48, (dirOf(A, Cp) + dirOf(A, D)) / 2), degx('x'), { blue: true });
    bd.beside(A, Bp, String(s), E).beside(E, Bp, String(s), A, { t: 0.5 });
    bd.name(A, 'A', 200).name(Bp, 'B', 330).name(Cp, 'C', 10).name(D, 'D', 120).name(E, 'E', 90);
    return bd;
  }
  // 좌표평면 위의 직선과 두 절편(x 절편 xa, y 절편 yb > 0). mark: 각을 표시할 점('A' x 절편 / 'B' y 절편)
  function lineFig(xa, yb, mark) {
    const k = Math.min(150 / (Math.abs(xa) + 1.2), 110 / (yb + 0.8)), bd = Board(), O = [0, 0], A = [xa * k, 0], Bp = [0, -yb * k];
    const left = Math.min(0, xa) * k - 22, right = Math.max(0, xa) * k + 26, top = -yb * k - 22;
    bd.seg([left, 0], [right, 0], 'thin').seg([0, 14], [0, top], 'thin');
    bd.shape(`M${r1(right + 6)} 0L${r1(right - 1)} -3.4L${r1(right - 1)} 3.4Z`, [[right + 6, 0]], 'fill:#1f2933').shape(`M0 ${r1(top - 6)}L-3.4 ${r1(top + 1)}L3.4 ${r1(top + 1)}Z`, [[0, top - 6]], 'fill:#1f2933');
    bd.text([right + 4, 12], sv('x'), { plain: true }).text([12, top - 2], sv('y'), { plain: true }).text([xa > 0 ? -9 : 9, 11], 'O', { plain: true, size: 13 });
    const ext = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
    bd.seg(ext(Bp, A, -0.12), ext(Bp, A, 1.12));
    bd.dot(A).dot(Bp);
    if (mark === 'A') bd.corner(A, O, Bp, degx('a'), { r: 16 }); else bd.corner(Bp, O, A, degx('b'), { r: 16 });
    bd.name(A, 'A', xa < 0 ? 300 : 245, 12).name(Bp, 'B', xa < 0 ? 160 : 25, 12);
    return bd;
  }

  // 같은 단원의 다른 파일(9-2-1b.js, 9-2-1c.js)이 함께 쓰는 도구
  B.kit.m921 = {
    UNIT, STD, T, kv, norm, num, sqrtQ, sqrtN, rad, vadd, vneg, vsub, vmul, vinv, vdiv, vfl, veq, kindOf, isSq, termH, vh, vt, lastNum, vj, SV, fn, fd, fx, X, seg, FN3,
    stripH, seal, sqCalc, plainCalc, NOTE_Q, NOTE_R, ONE, more, aInt, aFrac, aRad, aRadFrac, aSum, aMulti, aPick, pickRows, KS, pickAll,
    cen, lay, fig, rtModel, rtFig, POSES, lx, deg, degx, TRIPLES, legsOf, fair, PYTH, boxFig, pyramidFig, lineFig
  };
})(typeof window !== 'undefined' ? window : globalThis);
