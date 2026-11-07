// 고등학교 대수(2022 개정) Ⅱ-2 사인법칙과 코사인법칙 — 단원 틀·도구와 앞쪽 묶음(사인법칙, 사인법칙의 활용, 코사인법칙, 코사인법칙의 활용).
// 수집해 둔 천재 T셀파 대수(전인태) 한 종의 교과서·평가 자료에서 뽑은 문제 꼴 목록(기본꼴_1: 32꼴, 기본꼴_2: 26꼴, 심화꼴: 2꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음 / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/11-1-4/싣기_대조표.md 에 있다.
// (삼각형의 모양, 삼각형의 넓이, 사각형의 넓이와 넓이의 활용은 11-1-4b.js 에, 실력 문항은 11-1-4c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
// 영역은 대수의 삼각함수. 성취기준은 12대수02-03(사인법칙과 코사인법칙을 이해하고, 실생활 문제를 해결할 수 있다)이다.
// 해설: 「사인법칙과 코사인법칙을 이용하여 삼각형의 각의 크기와 변의 길이 사이의 관계를 이해하고 삼각형의 넓이를 다양한 방법으로 구할 수 있게 한다.」
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(두 각과 한 변·두 변과 끼인각·세 변·변의 비·사인의 비·외접원의 반지름·넓이·관계식), 묻는 것(변·각·외접원·cos 값·넓이·모양),
//    푸는 길(사인법칙 한 번 / 나머지 각을 먼저 / 코사인법칙과 이어서 / 넓이를 두 가지로)이 다르면 따로 싣는다. 수만 다르거나 상황만 다른 것은 한 유형이다.
//  - 중학교 3학년 「삼각비의 활용」(9-2-2)과 하는 일이 같은 꼴(두 변과 끼인각으로 변, 두 각과 한 변으로 변, 넓이 ½ab sin C 등)도 실었다 — 학년이 다른 단원끼리 같은 일은 둘 다 두는 것이 은행의 규칙이다.
//    여기서는 사인법칙·코사인법칙과 삼각함수의 값(sin 120° 따위)을 바로 쓴다.
//  - 특수각(30°, 45°, 60°, 90°, 120°, 135°, 150°)의 sin·cos 값은 쓰고, 그 밖의 각은 문제 글에 값을 준다(계산기가 있어야만 풀리는 값은 내지 않는다).
//  - 답: 근호가 든 길이는 「[ ]√[ ]」(근호 앞의 수가 1이면 1을 적는다), 「[ ]√[ ]/[ ]」, a + b√c 는 「[±][ ] [±][ ]√[ ]」, cos 값은 부호 단추를 단 분수 칸.
//    한 유형 안에서는 차례·씨앗이 바뀌어도 칸의 모양이 같도록 수를 고른다. 코사인법칙으로 얻은 각의 크기는 고르기로 낸다(각을 다시 셈할 길이 검사에 없다).
//    둘 이상의 값을 묶어 물은 원문(cos A cos C, p + q)은 값을 칸마다 따로 묻는다.
//  - 답은 모두 코드가 셈한다(근호가 든 수는 항의 배열로 정확히 셈하고, 계수마다 문제의 수로 셈하는 식 글을 함께 짓는다 — 9-2-2a.js 의 셈을 옮겨 왔다).
//    고르기의 참·거짓도 코드로 가린다(삼각형의 모양은 그 모양의 삼각형 여럿에 식을 대어 본다).
//
// 뺀 것과 까닭(11-1-4b.js, 11-1-4c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 놀이·활동: 직각삼각형에서 (변) ÷ sin(대각)을 셈해 지름과 견주기(①1 — 사인법칙 도입 활동).
// 바꾸어 실은 것
//  - 서술형 전용인 설명(①14 의 변형 — 두 지점 거리와 두 각으로 거리를 구하는 방법 설명)은 식 고르기로(sineuse-formula), 넓이 공식을 끌어내는 빈칸(②13)은 ㈎·㈏ 고르기로.
//  - 계산기로만 구하는 값(①26 의 √47500)은 계산기 없이 셈되는 속력·각(시속 p km, q km, 60°·120°)으로 바꾸었다.
//  - 원문이 묶어 물은 값: cos A cos C(①23 전대07)는 cos A, cos C 를 칸마다, 외접원의 넓이의 p + q(②25 기말22)는 kπ 의 k 로 물었다.
// 그림 때문에 좁힌 수
//  - 원주각이 둔각(120°·135°)인 현(①4): 삼각형이 납작해 각의 글이 현에 걸리므로 원주각은 45°·60° 만 쓴다.
//  - 탑의 높이(①13): 지면의 ∠AQB 가 직각인 짝(45°·45°, 30°·60°)은 그림에서 B 가 Q 바로 아래에 겹쳐 빼고, 75°·45° / 75°·60° / 60°·60° 만 쓴다.
//  - 등변사다리꼴의 대각선(②19): ∠APB 가 30°·150° 이면 사다리꼴이 너무 납작하거나 길어 45°·60°·120°·135° 만 쓴다(원문 중12 는 30°).
//  - 삼각 측량(①14): ∠CAB = 60° 꼴은 A, B 의 각 글이 겹치고 답이 100 이상이 되어(소수 답 칸은 100 미만) ∠CAB = 45°, ∠ABC = 75° 꼴만 쓴다.
// 1단계 꼴 목록에서 대표에 빠졌던 중07(바깥각으로 두 각을 구해 사인법칙)은 ①2 의 셋째 차례(sine-side#3)로 실었다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」 길이는 띄어 적는다(30 m).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, frac, lines, N, M, C, F, D, inline } = B.kit;
  const { MINUS, gcd, nb, tail, V, sup, rt, grp, sqParts, SG } = B.kit.mid;
  const { RAD, at, dirOf, dist, mid, textW, sv, TINT, Board } = B.kit.mgeo;
  const { trig, jh, qAns, space, svgm } = B.kit.hs;
  const UNIT = '11-1-4', STD = '12대수02-03';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: (/①|②/.test(ref) ? '수집본 기본 자료(' : '수집본 심화 자료(') + ref + ')', make }, more || {});
  const ONE = '(근호 앞의 수가 1이면 1을 적는다.)';
  const ONE_FR = '(근호 앞의 수가 1이면 1을 적고, 더 약분할 수 없게 적는다.)';

  // ── 근호가 든 수(9-2-2a.js 의 셈을 옮겼다) ──
  // 값은 항의 배열이다. 항 { m 근호 안(제곱인 수를 인수로 갖지 않는 자연수 — 유리수 항은 1), nv/dv 계수(기약분수, dv > 0),
  //  n·d 계수의 분자·분모를 문제의 수로 셈하는 식 글 }. 근호를 벗길 때만 (…)**0.5 를 쓴다(늘 제곱수의 제곱근이다).
  const w = (s) => (/^\d+$/.test(s) ? s : '(' + s + ')');
  function tm(m, nv, dv, n, d) {
    if (dv < 0) { nv = -nv; dv = -dv; n = '-' + w(n); d = '-' + w(d); }
    const g = gcd(Math.abs(nv), dv);
    if (g > 1) { nv /= g; dv /= g; n = w(n) + '/' + g; d = w(d) + '/' + g; }
    return { m, nv, dv, n, d };
  }
  const K = (k) => [tm(1, k, 1, String(k), '1')];
  const KR = (k, m) => (m === 1 ? K(k) : [tm(m, k, 1, String(k), '1')]);
  const KF = (p, q) => [tm(1, p, q, String(p), String(q))];
  function add(A, Bv) {
    const out = A.slice();
    for (const t of Bv) {
      const i = out.findIndex((u) => u.m === t.m);
      if (i < 0) { out.push(t); continue; }
      const u = out[i], nv = u.nv * t.dv + t.nv * u.dv;
      if (nv === 0) { out.splice(i, 1); continue; }
      out[i] = u.dv === t.dv ? tm(u.m, u.nv + t.nv, u.dv, `${w(u.n)}+${w(t.n)}`, u.d) : tm(u.m, nv, u.dv * t.dv, `${w(u.n)}*${w(t.d)}+${w(t.n)}*${w(u.d)}`, `${w(u.d)}*${w(t.d)}`);
    }
    return out.sort((x, y) => x.m - y.m);
  }
  const neg = (A) => A.map((t) => tm(t.m, -t.nv, t.dv, '-' + w(t.n), t.d));
  const sbt = (A, Bv) => add(A, neg(Bv));
  function mul(A, Bv) {
    let out = [];
    for (const a of A) for (const b of Bv) {
      const [s, m] = sqParts(a.m * b.m);
      const n = s === 1 ? `${w(a.n)}*${w(b.n)}` : `${w(a.n)}*${w(b.n)}*(${a.m}*${b.m}/${m})**0.5`;
      out = add(out, [tm(m, a.nv * b.nv * s, a.dv * b.dv, n, `${w(a.d)}*${w(b.d)}`)]);
    }
    return out;
  }
  const inv1 = (t) => tm(t.m, t.dv, t.nv * t.m, t.d, t.m === 1 ? t.n : `${w(t.n)}*${t.m}`);
  function div(A, Bv) {
    if (Bv.length === 1) return mul(A, [inv1(Bv[0])]);
    if (Bv.length !== 2 || Bv[0].m !== 1) throw new Error('이 꼴의 수로는 나누지 않는다');
    const conj = [Bv[0], neg([Bv[1]])[0]], top = mul(A, conj), bottom = mul(Bv, conj);
    if (bottom.length !== 1 || bottom[0].m !== 1) throw new Error('유리화가 안 된다');
    return mul(top, [inv1(bottom[0])]);
  }
  function sqrtV(A) {
    if (A.length !== 1 || A[0].m !== 1 || A[0].nv <= 0) throw new Error('제곱근을 구할 수 없는 수');
    const t = A[0], [s, m] = sqParts(t.nv * t.dv);
    return [tm(m, s, t.dv, `(${w(t.n)}*${w(t.d)}/${m})**0.5`, t.d)];
  }
  const sq = (A) => mul(A, A);
  const fv = (A) => A.reduce((s, t) => s + t.nv / t.dv * Math.sqrt(t.m), 0);
  const same = (A, Bv) => A.length === Bv.length && A.every((t) => Bv.some((u) => u.m === t.m && u.nv === t.nv && u.dv === t.dv));
  const isK = (A) => A.length === 1 && A[0].m > 1 && A[0].dv === 1 && A[0].nv >= 1;   // k√m (k 자연수)
  const isRF = (A) => A.length === 1 && A[0].m > 1 && A[0].dv > 1 && A[0].nv >= 1;    // k√m/n (n ≥ 2)
  const isInt = (A) => A.length === 1 && A[0].m === 1 && A[0].dv === 1;
  const isRat = (A) => A.length === 1 && A[0].m === 1;
  const isSum = (A) => A.length === 2 && A[0].m === 1 && A[1].m > 1 && A[0].dv === 1 && A[1].dv === 1;   // a + b√c (a, b 정수)
  // 특수각의 sin·cos 값
  const half = (m) => [tm(m, 1, 2, '1', '2')];
  const SIN = { 30: half(1), 45: half(2), 60: half(3), 90: K(1), 120: half(3), 135: half(2), 150: half(1) };
  const COS = { 30: half(3), 45: half(2), 60: half(1), 90: [], 120: neg(half(1)), 135: neg(half(2)), 150: neg(half(3)) };
  const SPECIAL = [30, 45, 60, 90, 120, 135, 150];

  // ── 값의 글 ──
  function termH(t) {
    const a = Math.abs(t.nv), top = t.m === 1 ? String(a) : (a === 1 ? '' : a) + rt(t.m);
    return t.dv === 1 ? top : frac(top, t.dv);
  }
  function sh(A) {
    if (!A.length) return '0';
    const list = A.slice().sort((x, y) => x.m - y.m);
    if (list[0].nv < 0) { const k = list.findIndex((t) => t.nv > 0); if (k > 0) list.unshift(list.splice(k, 1)[0]); }
    return nb(list.map((t, i) => (i === 0 ? (t.nv < 0 ? MINUS : '') : t.nv < 0 ? ' ' + MINUS + ' ' : ' + ') + termH(t)).join(''));
  }
  // 토씨: 읽을 때 끝에 오는 수(근호 안의 수, 분수는 분자)
  const lastNum = (A) => { const list = A.slice().sort((x, y) => x.m - y.m); if (list[0].nv < 0) { const k = list.findIndex((t) => t.nv > 0); if (k > 0) list.unshift(list.splice(k, 1)[0]); } const t = list[list.length - 1]; return t.m > 1 ? t.m : Math.abs(t.nv); };
  const sj = (A, pair) => nb(sh(A) + tail(lastNum(A), pair));
  const L = (A, unit) => nb(sh(A) + (unit ? ' ' + unit : ''));
  // 그림 설명에 적는 글(근호는 √ 글자로)
  function plainV(A) {
    if (!A.length) return '0';
    const list = A.slice().sort((x, y) => x.m - y.m);
    if (list[0].nv < 0) { const k = list.findIndex((t) => t.nv > 0); if (k > 0) list.unshift(list.splice(k, 1)[0]); }
    return list.map((t, i) => { const a = Math.abs(t.nv), top = t.m === 1 ? String(a) : (a === 1 ? '' : a) + '√' + t.m; return (i === 0 ? (t.nv < 0 ? '−' : '') : t.nv < 0 ? ' − ' : ' + ') + (t.dv === 1 ? top : top + '/' + t.dv); }).join('');
  }
  const sqH = (h) => nb(h + sup(2));
  const pq = (A) => (A.length === 1 && A[0].m === 1 && A[0].dv === 1 && A[0].nv > 0 ? sh(A) : '(' + sh(A) + ')');   // 제곱·곱할 때 괄호(자연수만 그대로)
  const pm = (A) => (A.length === 1 && A[0].nv > 0 ? sh(A) : '(' + sh(A) + ')');   // 곱할 때 괄호(항이 둘이거나 음수일 때만)

  // ── 문자와 기호 ──
  const vA = V('A'), vB = V('B'), vC = V('C'), va = V('a'), vb = V('b'), vc = V('c'), vR = V('R'), vS = V('S');
  const AV = { a: vA, b: vB, c: vC }, SVv = { a: va, b: vb, c: vc };   // 변 이름 → 대각의 크기, 변 이름 → 변
  const eqh = (l, r) => nb(l + ' = ' + r);
  const dg = (x) => x + '°';
  const sinH = (x) => trig('sin', x), cosH = (x) => trig('cos', x);
  const sinD = (x) => sinH(dg(x)), cosD = (x) => cosH(dg(x));
  const TRI = '삼각형 ABC';
  const others = (l) => ['a', 'b', 'c'].filter((x) => x !== l);

  // ── 검사 근거 ──
  const calcOf = (t) => (t.d === '1' ? w(t.n) : `${w(t.n)}/${w(t.d)}`);
  const stripH = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  // 문제(글·그림·보기)에 숫자로 적히지 않은 수(sin 값의 2·3, 제곱근을 벗기는 0.5 따위)를 facts.unseen 에 밝힌다(검사와 같은 길로 읽는다).
  function seal(item) {
    const f = item.facts || (item.facts = {});
    const seen = stripH([item.text, item.figure || ''].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, ' $1 ').replace(/<table[^>]*aria-label="([^"]*)"[^>]*>/g, ' $1 | '));
    const shown = new Set((seen.match(/\d+/g) || []).concat(seen.match(/\d+\.\d+/g) || [], seen.replace(/(\d) (?=\d)/g, '$1').match(/\d+/g) || []));
    const exprs = (f.calc || []).map(([t]) => t).concat(f.value !== undefined ? [f.value] : [], f.pick ? [f.pick.expr] : []);
    const miss = new Set(f.unseen || []);
    for (const t of exprs) for (const n of t.match(/\d+(?:\.\d+)?/g) || []) if (!shown.has(n)) miss.add(Number(n));
    if (miss.size) f.unseen = [...miss];
    return item;
  }

  // ── 답 ──
  // o: { figure, explain, facts(덧붙일 근거), rule }
  const un = (unit) => (unit ? ' ' + unit : '');
  const more = (o, facts) => ({ figure: o.figure, explain: o.explain, facts: Object.assign(facts, o.facts || {}, o.rule ? { rule: o.rule } : {}) });
  // k√m: 「[ ]√[ ] 단위」(근호 앞의 수가 1이면 1을 적는다)
  function aRad(text, A, unit, o) {
    if (!isK(A)) throw new Error('k√m 꼴이 아니다: ' + plainV(A));
    const t = A[0];
    return seal(inline(text + ' ' + ONE, grp('{0}' + rt('{1}') + un(unit)), [{ answer: t.nv }, { answer: t.m }], Object.assign(more(o, { calc: [[calcOf(t), 0], [String(t.m), 1]] }), { shown: L(A, unit) })));
  }
  // k√m/n: 「[ ]√[ ]/[ ] 단위」
  function aRadFr(text, A, unit, o) {
    if (!isRF(A)) throw new Error('k√m/n 꼴이 아니다: ' + plainV(A));
    const t = A[0];
    return seal(inline(text + ' ' + ONE_FR, grp(frac('{0}' + rt('{1}'), '{2}') + un(unit)), [{ answer: t.nv }, { answer: t.m }, { answer: t.dv }],
      Object.assign(more(o, { calc: [[w(t.n), 0], [String(t.m), 1], [w(t.d), 2]] }), { shown: L(A, unit) })));
  }
  // a + b√c: 「[±][ ] [±][ ]√[ ] 단위」
  function aSum(text, A, unit, o) {
    if (!isSum(A)) throw new Error('a + b√c 꼴이 아니다: ' + plainV(A));
    const [r, t] = A;
    return seal(inline(text + ' ' + ONE, grp('{0}') + ' ' + grp('{1}' + rt('{2}') + un(unit)), [{ answer: r.nv, signed: true }, { answer: t.nv, signed: true }, { answer: t.m }],
      Object.assign(more(o, { calc: [[calcOf(r), 0], [calcOf(t), 1], [String(t.m), 2]] }), { shown: L(A, unit) })));
  }
  // 자연수
  function aInt(text, A, unit, o) {
    if (!isInt(A) || A[0].nv < 1) throw new Error('자연수가 아니다: ' + plainV(A));
    return seal(N(text, A[0].nv, Object.assign(more(o, { calc: [[calcOf(A[0]), 0]] }), { unit })));
  }
  // 유리수(분수 칸, 크기가 같은 분수도 받는다). o.signed: 부호 단추(cos 값처럼 음수가 될 수 있는 값에는 늘 단다)
  function aQ(text, A, o) {
    if (!isRat(A) || A[0].dv === 1) throw new Error('분수가 아니다: ' + plainV(A));
    const t = A[0];
    return seal(qAns(text, [t.nv, t.dv], Object.assign(more(o, { value: calcOf(t) }), { signed: Boolean(o.signed), unit: o.unit })));
  }
  // 각의 크기(도): expr 는 문제의 수로 셈하는 식 글
  const aDeg = (text, value, expr, o) => seal(N(text, value, Object.assign(more(o, { calc: [[expr, 0]] }), { unit: '°' })));
  // 비: 「[ ] : [ ] : [ ]」(가장 간단한 자연수의 비). values 는 수, exprs 는 칸마다 셈하는 식 글
  const aRatio = (text, values, exprs, o) => seal(inline(text, values.map((_, i) => '{' + i + '}').join(' : '), values.map((v) => ({ answer: v })), Object.assign(more(o, { calc: exprs.map((e, i) => [e, i]) }), { shown: values.join(' : ') })));
  // 고르기: 보기마다 실제 값(수)을 셈해 참·거짓을 가른다. opts [{ h 글, v 값 }], target 맞는 값. o.keep 이면 보기 차례를 섞지 않는다.
  function pickNum(d, text, opts, target, o) {
    const truth = opts.map((x) => Math.abs(x.v - target) < 1e-9 * Math.max(1, Math.abs(target)));
    if (truth.filter(Boolean).length !== 1) throw new Error('맞는 보기가 하나가 아니다');
    for (let i = 0; i < opts.length; i += 1) for (let j = i + 1; j < opts.length; j += 1) if (Math.abs(opts[i].v - opts[j].v) < 1e-9 || opts[i].h === opts[j].h) throw new Error('보기 값이 겹친다');
    const rows = o.keep ? opts.map((x, i) => [x, truth[i]]) : d.shuffle(opts.map((x, i) => [x, truth[i]]));
    return seal(C(text, rows.map((r) => r[0].h), rows.findIndex((r) => r[1]), more(o, { truth: rows.map((r) => r[1]), want: true })));
  }
  // 각의 크기 고르기: 특수각 다섯(답과 180°에서 뺀 각을 꼭 넣는다), 작은 것부터
  function angleQ(d, text, target, o) {
    const pool = [target].concat(SPECIAL.includes(180 - target) && target !== 90 ? [180 - target] : []);
    for (const x of d.shuffle(SPECIAL)) if (pool.length < 5 && !pool.includes(x)) pool.push(x);
    pool.sort((x, y) => x - y);
    return pickNum(d, text, pool.map((x) => ({ h: dg(x), v: x })), target, Object.assign({ keep: true }, o));
  }
  // 코사인 값으로 각(도)을 찾는다(특수각만)
  const angOfCos = (c) => { const x = Math.acos(Math.max(-1, Math.min(1, c))) / RAD, r = Math.round(x); if (Math.abs(x - r) > 1e-6 || !SPECIAL.includes(r)) throw new Error('특수각이 아니다: ' + x); return r; };

  // 보기(ㄱ, ㄴ, ㄷ) 짜기 — 10-2-5a.js 의 setsQ 꼴: rows 는 { h 글, ok 옳은가, why 까닭 }
  const GA = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ'];
  const bogi = (list) => lines(list.map((h, i) => '<span class="mb-tag mb-tag-short">' + GA[i] + '.</span>' + h));
  function setsQ(d, text, rows, o) {
    const opt = o || {}, labels = GA.slice(0, rows.length), flags = rows.map((r) => Boolean(r.ok));
    if (!flags.some(Boolean)) throw new Error('옳은 것이 없다');
    const key = (s) => s.join('|'), right = labels.filter((_, i) => flags[i]), near = [], far = [];
    labels.forEach((_, i) => { const t = labels.filter((__, j) => (j === i ? !flags[j] : flags[j])); if (t.length) near.push(t); });
    for (let m = 1; m < (1 << labels.length); m += 1) far.push(labels.filter((_, k) => (m >> k) & 1));
    const out = [right], seen = new Set([key(right)]);
    for (const cand of d.shuffle(near).concat(d.shuffle(far))) { if (out.length === 5) break; if (!seen.has(key(cand))) { seen.add(key(cand)); out.push(cand); } }
    const sets = out.sort((a, b) => a.length - b.length || key(a).localeCompare(key(b)));
    const why = rows.map((r, i) => labels[i] + '. ' + r.why).join(' ');
    return seal(C(text, sets.map((s) => s.join(', ')), sets.findIndex((s) => key(s) === key(right)), {
      figure: (opt.figure || '') + bogi(rows.map((r) => r.h)),
      explain: why + ` 따라서 옳은 것은 ${right.join(', ')}이다.`,
      facts: Object.assign({ sets: { labels, flags, options: sets } }, opt.facts || {})
    }));
  }

  // ── 그림 ──
  // 모형 좌표(y 는 위로)의 점들 { 이름: [x, y] }을 [가로, 세로] 안에 꼭 맞게 키워 화면 좌표로 옮긴다.
  function lay(model, size) {
    const keys = Object.keys(model), xs = keys.map((k) => model[k][0]), ys = keys.map((k) => model[k][1]);
    const sx = Math.max(...xs) - Math.min(...xs) || 1e-6, sy = Math.max(...ys) - Math.min(...ys) || 1e-6, k = Math.min(size[0] / sx, size[1] / sy), P = { k };
    for (const key of keys) P[key] = [model[key][0] * k, -model[key][1] * k];
    return P;
  }
  // 그림 속 근호 글 「5√3 cm」: 글자 √ 뒤의 수 위에 가는 줄을 긋는다(c 는 글의 가운데).
  function radAt(b, c, k, m, unit) {
    const pre = (k === 1 ? '' : String(k)) + '√', s = pre + m + (unit ? ' ' + unit : ''), x0 = c[0] - textW(s) / 2;
    b.text(c, s, { blue: true });
    const xa = x0 + textW(pre) - 0.6, xb = xa + textW(String(m)) + 1.2, y = c[1] - 7.6;
    b.seg([xa, y], [xb, y], 'thin', 'stroke:#1d4ed8;stroke-width:0.9');
    return b;
  }
  // 선분 p–q 옆의 글. lab: 글 또는 [k, m, 단위](k√m)
  function sideLab(b, p, q, lab, inside, opt) {
    if (!Array.isArray(lab)) return b.beside(p, q, lab, inside, opt);
    const [k, m, unit] = lab, o = opt || {}, s = (k === 1 ? '' : String(k)) + '√' + m + (unit ? ' ' + unit : ''), mm = mid(p, q, o.t), len = dist(p, q);
    let n = [-(q[1] - p[1]) / len, (q[0] - p[0]) / len];
    if ((inside[0] - mm[0]) * n[0] + (inside[1] - mm[1]) * n[1] > 0) n = [-n[0], -n[1]];
    const off = (textW(s) / 2) * Math.abs(n[0]) + 8 * Math.abs(n[1]) + (o.gap == null ? 5 : o.gap);
    return radAt(b, [mm[0] + n[0] * off, mm[1] + n[1] * off], k, m, unit);
  }
  // 값을 그림 글로: 자연수·소수는 글, k√m 은 [k, m, 단위]
  const lab = (A, unit) => (isK(A) ? [A[0].nv, A[0].m, unit] : plainV(A) + un(unit));
  // 그림. model { 이름: [x, y] }(y 는 위로), o:
  //  polys [[이름들], …] 도형(fills 칠), segs·cuts·thins [[p, q], …] 선분·점선·가는 선, ticks [[p, q, 금 수], …] 같은 길이 표시,
  //  rights [[꼭짓점, p, q], …] 직각 표시, angs [[꼭짓점, p, q, 글, 선택], …] 각, sides [[p, q, 글, 안쪽(이름이나 점), 선택], …] 변 옆 글,
  //  circle [중심 이름, 반지름(모형)] 원, names 이름을 적을 점(주지 않으면 이름이 한 글자인 점 모두), nameAt { 이름: 도 }, size [가로, 세로]
  function pic(model, o) {
    const P = lay(model, o.size || [200, 130]), b = Board(), adj = {};
    const link = (p, q) => { (adj[p] = adj[p] || []).push(q); (adj[q] = adj[q] || []).push(p); };
    if (o.circle) b.disk(P[o.circle[0]], o.circle[1] * P.k);
    (o.polys || []).forEach((pl, i) => { b.poly(pl.map((n) => P[n]), (o.fills || [])[i]); pl.forEach((n, j) => link(n, pl[(j + 1) % pl.length])); });
    if (o.draw) o.draw(b, P);
    for (const [p, q] of o.segs || []) { b.seg(P[p], P[q]); link(p, q); }
    for (const [p, q] of o.cuts || []) { b.seg(P[p], P[q], 'cut'); link(p, q); }
    for (const [p, q] of o.thins || []) { b.seg(P[p], P[q], 'thin'); link(p, q); }
    for (const [p, q, n] of o.ticks || []) b.tick(P[p], P[q], n);
    for (const [v, p, q] of o.rights || []) b.corner(P[v], P[p], P[q], '');
    for (const [v, p, q, label, op] of o.angs || []) b.corner(P[v], P[p], P[q], label, op);
    // 각 안에 대각선이 지나갈 때: 호는 각 전체에 긋고, 글은 대각선으로 나뉜 두 쪽 가운데 넓은 쪽에 적는다. [꼭짓점, p, q, 대각선의 끝, 글]
    for (const [v, p, q, e, label] of o.angsBy || []) {
      b.corner(P[v], P[p], P[q], '', { square: false });
      let a0 = dirOf(P[v], P[p]), a1 = dirOf(P[v], P[q]); if ((a1 - a0 + 360) % 360 > 180) [a0, a1] = [a1, a0];
      const ad = dirOf(P[v], P[e]), s1 = (ad - a0 + 360) % 360, s2 = (a1 - ad + 360) % 360;
      if (s1 >= s2) b.angle(P[v], a0, ad, label, { arc: false }); else b.angle(P[v], ad, a1, label, { arc: false });
    }
    const first = (o.polys || [])[0] || Object.keys(model), cen = [first.reduce((s, n) => s + P[n][0], 0) / first.length, first.reduce((s, n) => s + P[n][1], 0) / first.length];
    // 변 옆 글의 「안쪽」: 점 이름, 점, 'in'(글을 도형 안쪽에 적는다)
    const insideOf = (p, q, inside) => (inside === 'in' ? [P[p][0] + P[q][0] - cen[0], P[p][1] + P[q][1] - cen[1]] : typeof inside === 'string' ? P[inside] : inside || cen);
    for (const [p, q, label, inside, op] of o.sides || []) sideLab(b, P[p], P[q], label, insideOf(p, q, inside), op);
    if (o.after) o.after(b, P);
    const names = o.names || Object.keys(model).filter((k) => /^[A-Z]$/.test(k));
    for (const n of names) {
      if (o.nameAt && o.nameAt[n] != null) b.name(P[n], n, o.nameAt[n]);
      else if (adj[n]) b.nameFree(P[n], n, adj[n].map((q) => dirOf(P[n], P[q])));
      else b.name(P[n], n, 90);
    }
    return { b, P };
  }
  const polar = (p, r, a) => [p[0] + r * Math.cos(a * RAD), p[1] + r * Math.sin(a * RAD)];   // 모형 좌표(y 위로)
  const onC = (a) => polar([0, 0], 1, a);   // 중심이 원점이고 반지름이 1인 원 위의 점
  // 원 위의 점 이름은 중심에서 바깥쪽으로 적는다.
  const outward = (model, names) => Object.fromEntries(names.map((n) => [n, (Math.atan2(model[n][1], model[n][0]) / RAD + 360) % 360]));
  // 세 변의 길이로 삼각형(B 왼쪽 아래, C 오른쪽 아래, A 위): BC = a, CA = b, AB = c
  const sssABC = (a, b, c) => { const x = (a * a + c * c - b * b) / (2 * a); return { B: [0, 0], C: [a, 0], A: [x, Math.sqrt(Math.max(0, c * c - x * x))] }; };
  // 세 각으로 삼각형(외접원의 반지름 1): BC = 2 sin A …
  const angABC = (A, Bn, Cn) => sssABC(2 * Math.sin(A * RAD), 2 * Math.sin(Bn * RAD), 2 * Math.sin(Cn * RAD));

  // 변 이름(a, b, c)에서 그 변의 두 끝점(점 이름)
  const ENDS = { a: ['B', 'C'], b: ['C', 'A'], c: ['A', 'B'] };
  // 수의 글: 정수나 k√m
  const valH = (A) => sh(A);
  // 삼각형의 세 값 { a, b, c } 가운데 주어진 것을 「a = 6, A = 45°」로 적는다.
  const givenSides = (list) => list.map(([l, A]) => eqh(SVv[l], sh(A))).join(', ');
  const givenAngles = (list) => list.map(([l, x]) => eqh(AV[l], dg(x))).join(', ');

  // ════════════════════════════════════════════════════════════════
  // ── 묶음 1: 사인법칙 ──
  // 주어진 변으로 쓸 값: 자연수, k√2, k√3
  const sideVal = (d) => { const kind = d.pick([1, 1, 2, 3]), k = d.int(2, 9); return KR(k, kind); };
  const sineTypes = [
    T('sine-side', '두 각과 한 변으로 다른 한 변 구하기', '①2', (d, n) => {
      // n = 0: 주어진 변의 대각과 구하는 변의 대각이 주어진다. n = 1: 주어진 변의 대각을 나머지 각에서 먼저 구한다.
      // n = 2: 그림의 바깥각으로 두 각을 구한다(∠B 의 바깥각 e, ∠C = γ → ∠B = 180° − e, ∠A = e − γ).
      if (n === 2) {
        const w2 = d.until(() => ({ e: d.pick([120, 135, 150]), gm: 15 * d.int(2, 7), a: d.int(2, 12) }), (y) => {
          const Bn = 180 - y.e, A = y.e - y.gm; if (A < 15 || !SIN[A] || !SIN[Bn] || A === Bn) return false;
          try { const v = div(mul(K(y.a), SIN[Bn]), SIN[A]); return isK(v) && fv(v) < 60; } catch (er) { return false; }
        });
        const { e, gm, a } = w2, Bn = 180 - e, A = e - gm, AC = div(mul(K(a), SIN[Bn]), SIN[A]);
        const mdl = angABC(A, Bn, gm), k = mdl.C[0]; mdl.D = [-0.38 * k, 0];
        const f = pic(mdl, { polys: [['A', 'B', 'C']], segs: [['B', 'D']], angs: [['B', 'A', 'D', dg(e)], ['C', 'A', 'B', dg(gm)]], sides: [['B', 'C', String(a), 'A']], nameAt: { D: 270 }, size: [220, 120] });
        return aRad(`그림과 같은 ${TRI}에서 변 CB의 연장선 위의 점 D에 대하여 ${eqh('∠ABD', dg(e))}, ${eqh('∠ACB', dg(gm))}, ${eqh(SG('BC'), a)}일 때, 선분 AC의 길이는?`, AC, '', {
          rule: 'exterior',
          figure: f.b.svg(`삼각형 ABC와 변 CB의 연장선 위의 점 D. ∠ABD = ${e}°, ∠ACB = ${gm}°, BC의 길이는 ${a}`),
          explain: `${eqh('∠ABC', '180° − ' + dg(e))} = ${dg(Bn)}이고, 삼각형의 한 바깥각의 크기는 그와 이웃하지 않는 두 내각의 크기의 합과 같으므로 ${eqh('∠BAC', dg(e) + ' − ' + dg(gm))} = ${dg(A)}이다. 사인법칙에 의하여 ${frac(SG('AC'), sinD(Bn))} = ${frac(a, sinD(A))}이므로 ${eqh(SG('AC'), frac(a + ' ' + sinD(Bn), sinD(A)))} = ${sh(AC)}이다.`
        });
      }
      const z = d.until(() => {
        const [g, q] = d.shuffle(['a', 'b', 'c']).slice(0, 2), r = ['a', 'b', 'c'].find((x) => x !== g && x !== q);
        const Ag = d.pick([30, 45, 60, 120, 135]), Aq = d.pick([30, 45, 60, 90, 120, 135]), Ar = 180 - Ag - Aq;
        return { g, q, r, Ag, Aq, Ar, side: sideVal(d) };
      }, (y) => y.Ar >= 15 && y.Ar % 15 === 0 && y.Ag !== y.Aq && (n === 1 || y.Ar !== y.Ag) && (() => { try { const v = div(mul(y.side, SIN[y.Aq]), SIN[y.Ag]); return isK(v) && fv(v) < 60; } catch (e) { return false; } })());
      const { g, q, r, Ag, Aq, Ar, side } = z, ans = div(mul(side, SIN[Aq]), SIN[Ag]);
      const angs = n === 0 ? [[g, Ag], [q, Aq]] : [[q, Aq], [r, Ar]];
      angs.sort((x, y) => x[0].localeCompare(y[0]));
      const first = n === 1 ? `${eqh(AV[g], '180° − (' + dg(Aq) + ' + ' + dg(Ar) + ')')} = ${dg(Ag)}이므로 ` : '';
      return aRad(`${TRI}에서 ${givenSides([[g, side]])}, ${givenAngles(angs)}일 때, ${SVv[q]}의 값은?`, ans, '', {
        rule: n === 0 ? 'opposite-given' : 'third-angle',
        explain: `${first}사인법칙에 의하여 ${frac(SVv[q], sinD(Aq))} = ${frac(sh(side), sinD(Ag))}이다. 따라서 ${SVv[q]} = ${frac(sh(side) + ' × ' + sinD(Aq), sinD(Ag))} = ${sh(ans)}이다.`
      });
    }, { count: 3 }),
    T('sine-radius', '한 변과 그 대각으로 외접원의 반지름 구하기', '①3', (d, n) => {
      // n = 0: 한 변과 그 대각. n = 1: 한 변과 다른 두 각(대각을 먼저 구한다).
      const g = d.pick(['a', 'b', 'c']), Ag = d.pick([45, 60, 120, 135]), t = d.int(2, 8), side = K(Ag === 45 || Ag === 135 ? 2 * t : 3 * t);
      const R = div(side, mul(K(2), SIN[Ag]));
      const [p, q] = others(g);
      const Ap = d.until(() => 15 * d.int(1, 8), (x) => x !== Ag && 180 - Ag - x >= 15 && 180 - Ag - x !== x), Aq = 180 - Ag - Ap;
      const given = n === 0 ? givenAngles([[g, Ag]]) : givenAngles([[p, Ap], [q, Aq]].sort((x, y) => x[0].localeCompare(y[0])));
      const first = n === 1 ? `${eqh(AV[g], '180° − (' + dg(Ap) + ' + ' + dg(Aq) + ')')} = ${dg(Ag)}이고, ` : '';
      return aRad(`${TRI}에서 ${givenSides([[g, side]])}, ${given}일 때, ${TRI}의 외접원의 반지름의 길이 ${vR}의 값은?`, R, '', {
        explain: `${first}사인법칙에 의하여 ${frac(sh(side), sinD(Ag))} = 2${vR}이므로 ${vR} = ${frac(sh(side), '2 × ' + sinD(Ag))} = ${sh(R)}이다.`
      });
    }, { count: 2 }),
    T('sine-chord', '외접원의 반지름과 원주각·중심각으로 현의 길이 구하기', '①4', (d, n) => {
      // n = 0: 원주각 ∠ACB. n = 1: 원에 내접하는 정삼각형. n = 2: 중심각 ∠AOB(원주각은 그 절반).
      const r = d.int(2, 9);
      if (n === 1) {
        const s = mul(mul(K(2), K(r)), SIN[60]);
        return aRad(`반지름의 길이가 ${r}인 원에 내접하는 정삼각형의 한 변의 길이는?`, s, '', {
          explain: `정삼각형의 한 내각의 크기는 60°이므로 한 변의 길이를 ${va}라 하면 사인법칙에 의하여 ${frac(va, sinD(60))} = 2 × ${r}이다. 따라서 ${va} = ${2 * r} ${sinD(60)} = ${sh(s)}이다.`
        });
      }
      const th = d.pick([45, 60]);
      const AB = mul(mul(K(2), K(r)), SIN[th]);
      // 원 위의 점: 호 AB(점 C 가 없는 쪽)의 중심각이 2θ
      let mdl;
      if (2 * th <= 180) { const c = 90 + d.pick([-25, 25]); mdl = { O: [0, 0], A: onC(-90 - th), B: onC(-90 + th), C: onC(c) }; }
      else { const half2 = (360 - 2 * th) / 2; mdl = { O: [0, 0], A: onC(90 + half2), B: onC(90 - half2), C: onC(90 + d.pick([-0.45, 0.45]) * half2) }; }
      const f = pic(mdl, { circle: ['O', 1], polys: [['A', 'B', 'C']], segs: n === 2 ? [['O', 'A'], ['O', 'B']] : [], angs: n === 2 ? [['O', 'A', 'B', dg(2 * th)]] : [['C', 'A', 'B', dg(th)]], names: n === 2 ? ['O', 'A', 'B', 'C'] : ['A', 'B', 'C'], nameAt: Object.assign(outward(mdl, ['A', 'B', 'C']), { O: 90 }), size: [150, 150] });
      if (n === 2) f.b.dot(f.P.O);
      if (n === 0) {
        return aRad(`그림과 같이 반지름의 길이가 ${r}인 원에 내접하는 ${TRI}에서 ${eqh('∠ACB', dg(th))}일 때, ${SG('AB')}의 길이는?`, AB, '', {
          figure: f.b.svg(`원에 내접하는 삼각형 ABC. 원의 반지름의 길이는 ${r}, ∠ACB = ${th}°`),
          explain: `사인법칙에 의하여 ${frac(SG('AB'), sinD(th))} = 2 × ${r}이므로 ${eqh(SG('AB'), 2 * r + ' ' + sinD(th))} = ${sh(AB)}이다.`
        });
      }
      return aRad(`그림과 같이 중심이 O이고 반지름의 길이가 ${r}인 원에 내접하는 ${TRI}에서 ${eqh('∠AOB', dg(2 * th))}일 때, 선분 AB의 길이는? (단, 점 C는 호 AB 가운데 긴 쪽 위에 있다.)`, AB, '', {
        figure: f.b.svg(`중심이 O인 원에 내접하는 삼각형 ABC와 반지름 OA, OB. 원의 반지름의 길이는 ${r}, ∠AOB = ${2 * th}°`),
        explain: `∠ACB는 호 AB에 대한 원주각이므로 ${eqh('∠ACB', frac(1, 2) + ' × ' + dg(2 * th))} = ${dg(th)}이다. 사인법칙에 의하여 ${frac(SG('AB'), sinD(th))} = 2 × ${r}이므로 ${eqh(SG('AB'), 2 * r + ' ' + sinD(th))} = ${sh(AB)}이다.`
      });
    }, { count: 3 }),
    T('sine-ssa', '외접원의 반지름(또는 두 변)과 한 각으로 다른 각 구하기(예각이라는 단서)', '①5', (d) => {
      // sin B 를 구해 B 를 정한다(단서: B 는 예각) → C = 180° − (A + B)
      const z = d.until(() => ({ A: d.pick([30, 45, 60, 75, 105]), Bv: d.pick([30, 45, 60]), R: d.int(2, 8), byR: d.bool() }), (y) => y.A !== y.Bv && 180 - y.A - y.Bv >= 15 && (y.byR || [30, 45, 60, 120, 135].includes(y.A)));
      const { A, Bv, R, byR } = z, Cn = 180 - A - Bv, b = mul(mul(K(2), K(R)), SIN[Bv]);
      if (byR) {
        return aDeg(`외접원의 반지름의 길이가 ${R}인 ${TRI}에서 ${eqh(vb, sh(b))}, ${eqh(vA, dg(A))}일 때, ${vC}의 크기는? (단, 0° &lt; ${vB} &lt; 90°)`, Cn, `180-${A}-${Bv}`, {
          explain: `사인법칙에 의하여 ${frac(sh(b), sinH(vB))} = 2 × ${R}이므로 ${eqh(sinH(vB), sh(SIN[Bv]))}이다. ${vB}는 예각이므로 ${eqh(vB, dg(Bv))}이고, ${eqh(vC, '180° − (' + dg(A) + ' + ' + dg(Bv) + ')')} = ${dg(Cn)}이다.`
        });
      }
      const a = mul(mul(K(2), K(R)), SIN[A]);
      return aDeg(`${TRI}에서 ${eqh(va, sh(a))}, ${eqh(vb, sh(b))}, ${eqh(vA, dg(A))}일 때, ${vC}의 크기는? (단, 0° &lt; ${vB} &lt; 90°)`, Cn, `180-${A}-${Bv}`, {
        explain: `사인법칙에 의하여 ${frac(sh(a), sinD(A))} = ${frac(sh(b), sinH(vB))}이므로 ${eqh(sinH(vB), frac(sh(b) + ' × ' + sinD(A), sh(a)))} = ${sh(SIN[Bv])}이다. ${vB}는 예각이므로 ${eqh(vB, dg(Bv))}이고, ${eqh(vC, '180° − (' + dg(A) + ' + ' + dg(Bv) + ')')} = ${dg(Cn)}이다.`
      });
    }),
    T('sine-angle-ratio', '세 내각의 크기의 비로 세 변의 길이의 비 구하기', '①6', (d, n) => {
      // 세 내각: 30°, 60°, 90° / 30°, 30°, 120° / 45°, 45°, 90° 를 A, B, C 에 나누어 놓는다.
      const fam = n === 1 ? [30, 60, 90] : d.pick([[30, 60, 90], [30, 30, 120], [45, 45, 90]]);
      const angs = d.shuffle(fam);
      const g = angs.reduce((s, v) => gcd(s, v), 0), ratio = angs.map((v) => v / g);
      // 세 변의 비: 가장 작은 항으로 나누어 가장 간단히 적는다(1 : √3 : 2, 1 : 1 : √2, 1 : 1 : √3).
      const simplest = (list) => { const lo = list.reduce((m, v) => (fv(v) < fv(m) ? v : m), list[0]); return list.map((v) => div(v, lo)); };
      const sides = simplest(angs.map((x) => mul(SIN[x], K(2))));
      const ratioH = nb(ratio.join(' : '));
      const kOf = (A) => (isInt(A) && A[0].nv === 1 ? '' : sh(A));   // 1k 는 k 로
      if (n === 0) {
        // 보기: 변의 비(가장 작은 항으로 나눈 값으로 견준다). 틀린 보기는 각의 비를 그대로 쓴 것, 제곱의 비, 차례를 바꾼 것, 다른 삼각형의 비
        const norm = (list) => list.map((v) => fv(v) / Math.min(...list.map(fv)));
        const [s0, s1, s2] = sides, other = { 90: [K(1), K(1), KR(1, 3)], 120: [K(1), K(1), KR(1, 2)] }[Math.max(...angs)];
        const famOther = angs.includes(60) ? [K(1), KR(1, 2), KR(1, 3)] : other;
        const cands = [sides, angs.map((x) => K(x / g)), sides.map(sq), [s2, s1, s0], [s1, s0, s2], [s0, s2, s1], [s2, s0, s1], [s1, s2, s0], famOther];
        const seen = [], opts = [];
        for (const c of cands) { const v = norm(c), key = v.map((x) => x.toFixed(6)).join(','); if (seen.includes(key) || opts.length >= 5) continue; seen.push(key); opts.push({ h: nb(simplest(c).map(sh).join(' : ')), key }); }
        if (opts.length < 5) throw new Error('보기가 모자란다');
        const want = seen[0];
        const rows = d.shuffle(opts);
        return seal(C(`${TRI}에서 ${nb(vA + ' : ' + vB + ' : ' + vC + ' = ' + ratioH)}일 때, ${nb(va + ' : ' + vb + ' : ' + vc)}는?`, rows.map((r) => r.h), rows.findIndex((r) => r.key === want), {
          explain: `${vA} + ${vB} + ${vC} = 180°이므로 ${eqh(vA, dg(angs[0]))}, ${eqh(vB, dg(angs[1]))}, ${eqh(vC, dg(angs[2]))}이다. 사인법칙에 의하여 ${nb(va + ' : ' + vb + ' : ' + vc)} = ${nb(sinH(vA) + ' : ' + sinH(vB) + ' : ' + sinH(vC))} = ${nb(angs.map((x) => sh(SIN[x])).join(' : '))} = ${nb(sides.map(sh).join(' : '))}이다.`,
          facts: { truth: rows.map((r) => r.key === want), want: true }
        }));
      }
      // n = 1: 식의 값(ac/b² 꼴) — 답이 k√m/n 이 되는 식을 고른다.
      const L3 = ['a', 'b', 'c'];
      const z = d.until(() => { const [p, q, s] = d.shuffle([0, 1, 2]); return { p, q, s }; }, (y) => { try { return isRF(div(mul(sides[y.p], sides[y.q]), sq(sides[y.s]))); } catch (e) { return false; } });
      const [x1, x2] = [z.p, z.q].sort(), val = div(mul(sides[x1], sides[x2]), sq(sides[z.s]));
      const expr = frac(SVv[L3[x1]] + SVv[L3[x2]], SVv[L3[z.s]] + sup(2));
      return aRadFr(`${TRI}에서 ${nb(vA + ' : ' + vB + ' : ' + vC + ' = ' + ratioH)}일 때, ${expr}의 값은?`, val, '', {
        explain: `${eqh(vA, dg(angs[0]))}, ${eqh(vB, dg(angs[1]))}, ${eqh(vC, dg(angs[2]))}이므로 사인법칙에 의하여 ${nb(va + ' : ' + vb + ' : ' + vc)} = ${nb(sides.map(sh).join(' : '))}이다. ${nb(va + ' = ' + kOf(sides[0]) + V('k'))}, ${nb(vb + ' = ' + kOf(sides[1]) + V('k'))}, ${nb(vc + ' = ' + kOf(sides[2]) + V('k'))}로 놓으면 ${expr} = ${sh(val)}이다.`
      });
    }, { count: 2 }),
    T('sine-ratio-eq', '변 사이의 관계식으로 sin A : sin B : sin C 구하기', '①7', (d, n) => {
      // 두 일차식: 계수가 0이 아닌 정수(−4~4)이고 (p, q, r)를 해로 갖는다.
      const vecsOf = ([p0, q0, r0]) => { const out = []; for (let x = 1; x <= 4; x += 1) for (let y = -4; y <= 4; y += 1) for (let s = -4; s <= 4; s += 1) if (y && s && x * p0 + y * q0 + s * r0 === 0 && gcd(gcd(x, Math.abs(y)), Math.abs(s)) === 1) out.push([x, y, s]); return out; };
      const z = d.until(() => { const t = [d.int(2, 9), d.int(2, 9), d.int(2, 9)]; return t; }, (t) => new Set(t).size === 3 && gcd(gcd(t[0], t[1]), t[2]) === 1 && t[0] < t[1] + t[2] && t[1] < t[0] + t[2] && t[2] < t[0] + t[1] && (n === 1 || vecsOf(t).length >= 2));
      const [p, q, r] = z;
      const ask = `${nb(sinH(vA) + ' : ' + sinH(vB) + ' : ' + sinH(vC))}를 가장 간단한 자연수의 비로 나타내면?`;
      const tell = `사인법칙에 의하여 ${nb(sinH(vA) + ' : ' + sinH(vB) + ' : ' + sinH(vC))} = ${nb(va + ' : ' + vb + ' : ' + vc)} = ${nb(p + ' : ' + q + ' : ' + r)}이다.`;
      if (n === 0) {
        const vecs = vecsOf(z);
        const pair = d.until(() => d.shuffle(vecs).slice(0, 2), (two) => two.length === 2 && (two[0][0] * two[1][1] - two[0][1] * two[1][0] !== 0 || two[0][1] * two[1][2] - two[0][2] * two[1][1] !== 0));
        const [u, v] = pair;
        const lin = (k) => { const terms = [[k[0], va], [k[1], vb], [k[2], vc]]; return nb(terms.map(([c, h], i) => (i === 0 ? '' : c < 0 ? ' ' + MINUS + ' ' : ' + ') + (Math.abs(c) === 1 ? '' : Math.abs(c)) + h).join('') + ' = 0'); };
        // 두 식의 계수로 셈한 비(벡터곱) — 부호는 양수로
        const cx = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]], sgn = Math.sign(cx[0]) || 1, g = Math.abs(gcd(gcd(Math.abs(cx[0]), Math.abs(cx[1])), Math.abs(cx[2])));
        const E = (i, j, k, l) => `(${u[i]})*(${v[j]})-(${u[k]})*(${v[l]})`;
        const exprs = [E(1, 2, 2, 1), E(2, 0, 0, 2), E(0, 1, 1, 0)].map((e) => `(${e})*(${sgn})/${g}`);
        if (cx.map((x) => x * sgn / g).join() !== [p, q, r].join()) throw new Error('비가 맞지 않는다');
        return aRatio(`${TRI}에서 ${lin(u)}, ${lin(v)}일 때, ${ask}`, [p, q, r], exprs, {
          explain: `두 식을 연립하여 ${va}, ${vb}를 ${vc}로 나타내면 ${nb(va + ' : ' + vb + ' : ' + vc + ' = ' + p + ' : ' + q + ' : ' + r)}이다. ${tell}`
        });
      }
      // n = 1: (a + b) : (b + c) : (c + a)
      const s = [p + q, q + r, r + p], gs = gcd(gcd(s[0], s[1]), s[2]), sr = s.map((x) => x / gs), half2 = sr[0] + sr[1] + sr[2];
      // a = (s1 + s3 − s2)/2 … 를 문제의 수로 셈하고 최대공약수로 나눈다.
      const raw = [sr[0] + sr[2] - sr[1], sr[0] + sr[1] - sr[2], sr[1] + sr[2] - sr[0]], g = gcd(gcd(raw[0], raw[1]), raw[2]);
      if (raw.map((x) => x / g).join() !== [p, q, r].join()) throw new Error('비가 맞지 않는다');
      const exprs = [`(${sr[0]}+${sr[2]}-${sr[1]})/${g}`, `(${sr[0]}+${sr[1]}-${sr[2]})/${g}`, `(${sr[1]}+${sr[2]}-${sr[0]})/${g}`];
      return aRatio(`${TRI}에서 ${nb('(' + va + ' + ' + vb + ') : (' + vb + ' + ' + vc + ') : (' + vc + ' + ' + va + ') = ' + sr.join(' : '))}일 때, ${ask}`, [p, q, r], exprs, {
        explain: `${nb(va + ' + ' + vb + ' = ' + sr[0] + V('k'))}, ${nb(vb + ' + ' + vc + ' = ' + sr[1] + V('k'))}, ${nb(vc + ' + ' + va + ' = ' + sr[2] + V('k'))}로 놓고 세 식을 더하면 ${nb(va + ' + ' + vb + ' + ' + vc + ' = ' + (half2 / 2) + V('k'))}이므로 ${nb(va + ' = ' + raw[0] / 2 + V('k'))}, ${nb(vb + ' = ' + raw[1] / 2 + V('k'))}, ${nb(vc + ' = ' + raw[2] / 2 + V('k'))}이다. ${tell}`
      });
    }, { count: 2 }),
    T('sine-sum', '외접원의 반지름과 둘레의 길이로 sin A + sin B + sin C 구하기', '①8', (d) => {
      const z = d.until(() => ({ R: d.int(3, 9), P: d.int(8, 45) }), (y) => y.P > 2.2 * y.R && y.P < 5 * y.R && y.P % (2 * y.R) !== 0);
      const v = KF(z.P, 2 * z.R);
      return aQ(`반지름의 길이가 ${z.R}인 원에 내접하는 ${TRI}의 둘레의 길이가 ${z.P}일 때, ${nb(sinH(vA) + ' + ' + sinH(vB) + ' + ' + sinH(vC))}의 값은?`, v, {
        explain: `사인법칙에 의하여 ${eqh(sinH(vA), frac(va, '2 × ' + z.R))}, ${eqh(sinH(vB), frac(vb, '2 × ' + z.R))}, ${eqh(sinH(vC), frac(vc, '2 × ' + z.R))}이므로 ${nb(sinH(vA) + ' + ' + sinH(vB) + ' + ' + sinH(vC))} = ${frac(va + ' + ' + vb + ' + ' + vc, 2 * z.R)} = ${frac(z.P, 2 * z.R)}${v[0].dv === 2 * z.R ? '' : ' = ' + sh(v)}이다.`,
        facts: { value: `${z.P}/(2*${z.R})` }
      });
    }),
    T('sine-supp', 'sin(A + B)를 sin C로 바꾸어 변의 길이 구하기', '①9', (d) => {
      // sin C = √s / t, k sin C sin(A + B) = m (k sin²C = m)
      const z = d.until(() => { const [s, t] = d.pick([[6, 4], [5, 3], [8, 3], [7, 4], [15, 4], [10, 4], [14, 4], [3, 3], [7, 3]]); return { s, t, R: d.int(1, 6) }; }, (y) => {
        const g = gcd(y.s, y.t * y.t); if (y.s >= y.t * y.t) return false;
        try { return isK(mul(K(2 * y.R), div(KR(1, y.s), K(y.t)))); } catch (e) { return false; }
      });
      const { s, t, R } = z, g = gcd(s, t * t), m = s / g, k = t * t / g;
      const sinC = div(sqrtV(KF(s, 1)), K(t)), AB = mul(K(2 * R), sinC);
      const body = sinH(vC) + ' ' + sinH('(' + vA + ' + ' + vB + ')');
      return aRad(`반지름의 길이가 ${R}인 원에 내접하는 ${TRI}에서 ${nb(k + body + ' = ' + m)}일 때, 선분 AB의 길이는?`, AB, '', {
        explain: `${nb(vA + ' + ' + vB + ' = 180° − ' + vC)}이므로 ${nb(sinH('(' + vA + ' + ' + vB + ')') + ' = ' + sinH('(180° − ' + vC + ')') + ' = ' + sinH(vC))}이다. 따라서 ${nb(k + trig('sin', vC, 2) + ' = ' + m)}이고 ${sinH(vC)} &gt; 0이므로 ${eqh(sinH(vC), sh(sinC))}이다. 사인법칙에 의하여 ${eqh(SG('AB'), '2 × ' + R + ' × ' + sinH(vC))} = ${sh(AB)}이다.`
      });
    }),
    T('sine-para', '평행사변형의 이웃한 두 각의 사인의 합으로 외접원의 반지름 구하기', '①10', (d) => {
      const z = d.until(() => ({ al: d.pick([45, 60, 120, 135]), k: d.int(2, 6) }), () => true);
      const { al, k } = z, m = al === 45 || al === 135 ? 2 : 3, BD = K(m * k), v = mul(K(2), SIN[al]);   // sin α + sin β = 2 sin α
      const R = div(BD, v);
      const be = 180 - al, Bm = [0, 0], Cm = [1.6, 0], Am = polar(Bm, 1, be), Dm = [Am[0] + 1.6, Am[1]];
      const f = pic({ A: Am, B: Bm, C: Cm, D: Dm }, { polys: [['A', 'B', 'C', 'D']], segs: [['B', 'D']], angs: [['A', 'D', 'B', sv('α')]], angsBy: [['B', 'A', 'C', 'D', sv('β')]], size: [190, 100] });
      const alH = V('α'), beH = V('β');
      return aRad(`그림과 같이 ${eqh(SG('BD'), m * k)}인 평행사변형 ABCD에서 ${eqh('∠DAB', alH)}, ${eqh('∠ABC', beH)}라 하자. ${nb(sinH(alH) + ' + ' + sinH(beH) + ' = ' + sh(v))}일 때, 세 점 A, B, D를 지나는 원의 반지름의 길이는?`, R, '', {
        figure: f.b.svg('평행사변형 ABCD와 대각선 BD. ∠DAB = α, ∠ABC = β'),
        explain: `평행사변형에서 ${nb(alH + ' + ' + beH + ' = 180°')}이므로 ${eqh(sinH(beH), sinH('(180° − ' + alH + ')'))} = ${sinH(alH)}이고, ${nb('2' + sinH(alH) + ' = ' + sh(v))}에서 ${eqh(sinH(alH), sh(SIN[al]))}이다. 세 점 A, B, D를 지나는 원은 삼각형 ABD의 외접원이므로 사인법칙에 의하여 ${frac(SG('BD'), sinH(alH))} = 2${vR}, ${vR} = ${frac(m * k, '2 × ' + sh(SIN[al]))} = ${sh(R)}이다.`
      });
    }),
    T('sine-claims', '두 각과 한 변에서 변·변의 범위·외접원의 넓이 — 옳은 것 고르기', '①11', (d) => {
      // ㄱ: a 의 값(틀린 값은 sin 을 거꾸로 놓은 것), ㄴ: c 의 범위(틀린 것은 2R 대신 R 를 쓴 것), ㄷ: 외접원의 넓이(틀린 것은 지름을 반지름으로 쓴 것)
      const z = d.until(() => ({ A: d.pick([30, 45, 60, 120]), Bv: d.pick([30, 45, 60, 120]), b: d.int(2, 9), set: d.pick([[1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 1, 0], [1, 0, 1], [0, 1, 1]]) }), (y) => {
        if (y.A === y.Bv || y.A + y.Bv >= 165 || y.A + y.Bv === 90) return false;
        const R2v = y.b / Math.sin(y.Bv * RAD), cN = R2v * Math.sin((180 - y.A - y.Bv) * RAD);
        return Math.abs(Math.sin(y.A * RAD) - Math.sin(y.Bv * RAD)) > 1e-9 && cN > R2v / 2 + 0.05;
      });
      const { A, Bv, b, set } = z, Cn = 180 - A - Bv, bV = K(b), aV = div(mul(bV, SIN[A]), SIN[Bv]), R2 = div(bV, SIN[Bv]), Rr = mul(R2, half(1)), area = sq(Rr);
      const cNum = fv(R2) * Math.sin(Cn * RAD);
      const aWrong = div(mul(bV, SIN[Bv]), SIN[A]);
      const rows = [
        set[0] ? { h: `${eqh(va, sh(aV))}이다.`, ok: true, why: `사인법칙에 의하여 ${eqh(va, frac(b + ' ' + sinD(A), sinD(Bv)))} = ${sh(aV)}이다.` }
          : { h: `${eqh(va, sh(aWrong))}이다.`, ok: false, why: `${eqh(va, frac(b + ' ' + sinD(A), sinD(Bv)))} = ${sh(aV)}이다.` },
        set[1] ? { h: `${nb('0 &lt; ' + vc + ' &lt; ' + sh(R2))}이다.`, ok: true, why: `${eqh(vC, dg(Cn))}이고 ${eqh(vc, sh(R2) + ' ' + sinD(Cn))}인데 ${nb('0 &lt; ' + sinD(Cn) + ' &lt; 1')}이다.` }
          : { h: `${nb('0 &lt; ' + vc + ' &lt; ' + sh(Rr))}이다.`, ok: false, why: `${eqh(vC, dg(Cn))}이고 ${eqh(vc, sh(R2) + ' ' + sinD(Cn))}인데 ${nb(sinD(Cn) + ' &gt; ' + frac(1, 2))}이므로 ${nb(vc + ' &gt; ' + sh(Rr))}이다.` },
        set[2] ? { h: `${TRI}의 외접원의 넓이는 ${nb(sh(area) + 'π')}이다.`, ok: true, why: `외접원의 반지름의 길이는 ${frac(b, '2 ' + sinD(Bv))} = ${sh(Rr)}이므로 넓이는 ${nb(sh(area) + 'π')}이다.` }
          : { h: `${TRI}의 외접원의 넓이는 ${nb(sh(sq(R2)) + 'π')}이다.`, ok: false, why: `외접원의 반지름의 길이는 ${frac(b, '2 ' + sinD(Bv))} = ${sh(Rr)}이므로 넓이는 ${nb(sh(area) + 'π')}이다.` }
      ];
      // 참·거짓을 수로 다시 가린다.
      const truth = [Math.abs(fv(set[0] ? aV : aWrong) - b * Math.sin(A * RAD) / Math.sin(Bv * RAD)) < 1e-9, cNum < fv(set[1] ? R2 : Rr), Math.abs(fv(set[2] ? area : sq(R2)) - (b / (2 * Math.sin(Bv * RAD))) ** 2) < 1e-9];
      if (truth.some((t, i) => t !== rows[i].ok)) throw new Error('보기의 참·거짓이 셈과 다르다');
      return setsQ(d, `${TRI}에서 ${eqh(vb, b)}, ${eqh(vA, dg(A))}, ${eqh(vB, dg(Bv))}일 때, 다음 보기에서 옳은 것만을 있는 대로 고른 것은?`, rows);
    })
  ];

  // ── 묶음 2: 사인법칙의 활용 ──
  // 근삿값: 소수 둘째 자리
  const r2 = (v) => Math.round(v * 100) / 100;
  const roundInt = (x) => `((${x})+0.5-((${x})+0.5)%1)`;
  // 소수 뒤 토씨(끝 숫자의 소리로): 0.6으로, 0.72로
  const tailDec = (x, pair) => tail(Number(String(x).slice(-1)), pair);
  const sineUseTypes = [
    T('sineuse-river', '두 각과 그 사이 변으로 강 건너 두 지점 사이의 거리 구하기', '①12', (d, n) => {
      if (n === 0) {
        // BC = d m, ∠ABC, ∠ACB(특수각 또는 75°) → ∠A, AB 또는 AC
        const z = d.until(() => ({ Bv: d.pick([30, 45, 60, 75]), Cv: d.pick([30, 45, 60, 75]), dd: 10 * d.int(2, 9), askAB: d.bool() }), (y) => {
          const A = 180 - y.Bv - y.Cv, opp = y.askAB ? y.Cv : y.Bv; if (!SIN[A] || !SIN[opp] || y.Bv === y.Cv) return false;
          try { return isK(div(mul(K(y.dd), SIN[opp]), SIN[A])); } catch (e) { return false; }
        });
        const { Bv, Cv, dd, askAB } = z, A = 180 - Bv - Cv, opp = askAB ? Cv : Bv, x = div(mul(K(dd), SIN[opp]), SIN[A]);
        const mdl = angABC(A, Bv, Cv);
        const f = pic(mdl, { polys: [['A', 'B', 'C']], angs: [['B', 'C', 'A', dg(Bv)], ['C', 'A', 'B', dg(Cv)]], sides: [['B', 'C', dd + ' m', 'A']], size: [200, 120] });
        const far = askAB ? 'A, B' : 'A, C', seg = askAB ? 'AB' : 'AC';
        return aRad(`그림은 강 건너편의 A 지점까지의 거리를 구하려고 강가의 두 지점 B, C에서 잰 것이다. ${eqh(SG('BC'), dd + ' m')}, ${eqh('∠ABC', dg(Bv))}, ${eqh('∠ACB', dg(Cv))}일 때, 두 지점 ${far} 사이의 거리는 몇 m인가?`, x, 'm', {
          figure: f.b.svg(`삼각형 ABC. BC의 길이는 ${dd} m, ∠B = ${Bv}°, ∠C = ${Cv}°`),
          explain: `${eqh('∠BAC', '180° − (' + dg(Bv) + ' + ' + dg(Cv) + ')')} = ${dg(A)}이므로 사인법칙에 의하여 ${frac(SG(seg), sinD(opp))} = ${frac(dd, sinD(A))}이다. 따라서 ${eqh(SG(seg), frac(dd + ' ' + sinD(opp), sinD(A)))} = ${L(x, 'm')}이다.`
        });
      }
      // n = 1: 특수각이 아닌 각 — sin 값을 글로 주고 반올림한다.
      const z = d.until(() => ({ Bv: d.int(40, 75), Cv: d.int(40, 80), dd: 10 * d.int(2, 8) }), (y) => {
        const A = 180 - y.Bv - y.Cv; if (A < 35 || [30, 45, 60, 90].includes(A) || [30, 45, 60].includes(y.Cv) || y.Bv === y.Cv) return false;
        const x = y.dd * r2(Math.sin(y.Cv * RAD)) / r2(Math.sin(A * RAD)), fr = x - Math.floor(x); return Math.abs(fr - 0.5) > 0.08 && r2(Math.sin(y.Cv * RAD)) !== r2(Math.sin(A * RAD));
      });
      const { Bv, Cv, dd } = z, A = 180 - Bv - Cv, sC = r2(Math.sin(Cv * RAD)), sA = r2(Math.sin(A * RAD)), x = dd * sC / sA, ans = Math.round(x);
      const mdl = angABC(A, Bv, Cv);
      const f = pic(mdl, { polys: [['A', 'B', 'C']], angs: [['B', 'C', 'A', dg(Bv)], ['C', 'A', 'B', dg(Cv)]], sides: [['B', 'C', dd + ' m', 'A']], size: [200, 120] });
      return seal(N(`그림은 강 건너편의 A 지점까지의 거리를 구하려고 강가의 두 지점 B, C에서 잰 것이다. ${eqh(SG('BC'), dd + ' m')}, ${eqh('∠ABC', dg(Bv))}, ${eqh('∠ACB', dg(Cv))}일 때, 두 지점 A, B 사이의 거리는 몇 m인가? (단, ${eqh(sinD(Cv), sC)}, ${nb(sinD(A) + ' = ' + sA + tailDec(sA, '으로/로'))} 계산하고, 소수점 아래 첫째 자리에서 반올림한다.)`, ans, {
        unit: 'm', figure: f.b.svg(`삼각형 ABC. BC의 길이는 ${dd} m, ∠B = ${Bv}°, ∠C = ${Cv}°`),
        explain: `${eqh('∠BAC', '180° − (' + dg(Bv) + ' + ' + dg(Cv) + ')')} = ${dg(A)}이므로 사인법칙에 의하여 ${eqh(SG('AB'), frac(dd + ' ' + sinD(Cv), sinD(A)))} = ${frac(dd + ' × ' + sC, sA)} = ${x.toFixed(3)}…이다. 따라서 약 ${ans} m이다.`,
        facts: { calc: [[roundInt(`${dd}*${sC}/${sA}`), 0]] }
      }));
    }, { count: 2 }),
    T('sineuse-tower', '바닥의 삼각형에 사인법칙을 써서 탑의 높이 구하기', '①13', (d) => {
      // ∠AQB 가 직각인 짝(45°·45°, 30°·60°)은 그림에서 B 가 Q 바로 아래에 겹쳐 쓰지 않는다.
      // 지면 위의 A, B, Q 와 Q 에 수직으로 선 탑 PQ. ∠QAB, ∠QBA → ∠AQB, AQ(사인법칙) → PQ = AQ tan(∠PAQ)
      const z = d.until(() => { const [qa, qb] = d.pick([[75, 45], [75, 60], [60, 60]]); return { qa, qb, el: d.pick([30, 45, 60]), dd: 50 * d.int(2, 8) }; }, (y) => {
        const q = 180 - y.qa - y.qb; if (!SIN[q] || !SIN[y.qb]) return false;
        try { const AQ = div(mul(K(y.dd), SIN[y.qb]), SIN[q]); const PQ = y.el === 45 ? AQ : y.el === 60 ? mul(AQ, KR(1, 3)) : div(AQ, KR(1, 3)); return isK(PQ); } catch (e) { return false; }
      });
      const { qa, qb, el, dd } = z, q = 180 - qa - qb, AQ = div(mul(K(dd), SIN[qb]), SIN[q]), PQ = el === 45 ? AQ : el === 60 ? mul(AQ, KR(1, 3)) : div(AQ, KR(1, 3));
      const tanH = el === 45 ? '1' : el === 60 ? rt(3) : frac(rt(3), 3);
      // 지면의 삼각형을 비스듬히 본 그림: AQ 를 가로로 두고 B 는 앞쪽(아래)에 둔다. 높이는 보기 좋게 줄여 그린다(길이를 재는 그림이 아니다).
      const AQv = Math.sin(qb * RAD) / Math.sin(q * RAD), gB = [Math.cos(qa * RAD), -Math.sin(qa * RAD)];
      const view = ([x, y], z) => [x - 0.3 * y, 0.9 * y + (z || 0)];
      const mdl = { A: view([0, 0]), B: view(gB), Q: view([AQv, 0]), P: view([AQv, 0], AQv * Math.min(0.8, 0.5 * Math.tan(el * RAD))) };
      const f = pic(mdl, { polys: [['A', 'B', 'Q']], segs: [['P', 'Q'], ['A', 'P']], rights: [['Q', 'P', 'A']], angs: [['A', 'B', 'Q', dg(qa)], ['A', 'Q', 'P', dg(el), { r: 30 }], ['B', 'Q', 'A', dg(qb)]], sides: [['A', 'B', dd + ' m', 'Q']], nameAt: { A: 180, B: 270, Q: 0, P: 90 }, size: [210, 150] });
      return aRad(`탑의 높이 PQ를 구하기 위하여 그림과 같이 지면 위의 ${dd} m 떨어진 두 지점 A, B에서 재었더니 ${eqh('∠QAB', dg(qa))}, ${eqh('∠QBA', dg(qb))}, ${eqh('∠PAQ', dg(el))}이었다. 탑의 높이 PQ는 몇 m인가? (단, 세 점 A, B, Q는 지면 위에 있고, 탑은 지면에 수직이다.)`, PQ, 'm', {
        figure: f.b.svg(`지면 위의 삼각형 ABQ와 Q에서 지면에 수직으로 선 탑 PQ. AB의 길이는 ${dd} m, ∠QAB = ${qa}°, ∠QBA = ${qb}°, ∠PAQ = ${el}°`),
        explain: `삼각형 ABQ에서 ${eqh('∠AQB', '180° − (' + dg(qa) + ' + ' + dg(qb) + ')')} = ${dg(q)}이므로 사인법칙에 의하여 ${eqh(SG('AQ'), frac(dd + ' ' + sinD(qb), sinD(q)))} = ${sh(AQ)}이다. 직각삼각형 APQ에서 ${eqh(SG('PQ'), SG('AQ') + ' ' + trig('tan', dg(el)))} = ${sh(AQ)} × ${tanH} = ${L(PQ, 'm')}이다.`
      });
    }),
    T('sineuse-formula', '두 지점 사이의 거리와 두 각으로 다른 거리를 나타낸 식 고르기', '①14', (d) => {
      // 교과서의 「필요한 조건을 말하고 구하는 방법을 설명하기」를 식 고르기로 바꾸었다.
      const askBC = d.bool(), al = V('α'), be = V('β'), dd = V('d');
      const s = (x) => sinH(x), sAB = sinH('(' + al + ' + ' + be + ')');
      const opts = [
        { h: frac(dd + ' ' + s(al), sAB), f: (a, b) => Math.sin(a) / Math.sin(a + b) },
        { h: frac(dd + ' ' + s(be), sAB), f: (a, b) => Math.sin(b) / Math.sin(a + b) },
        { h: frac(dd + ' ' + sAB, s(al)), f: (a, b) => Math.sin(a + b) / Math.sin(a) },
        { h: frac(dd + ' ' + s(al), s(be)), f: (a, b) => Math.sin(a) / Math.sin(b) },
        { h: frac(dd + ' ' + s(be), s(al)), f: (a, b) => Math.sin(b) / Math.sin(a) }
      ];
      // 참값: 각을 몇 쌍 넣어 사인법칙으로 셈한 거리와 견준다(d = 1).
      const trials = [[50, 70], [35, 80], [62, 41]].map(([x, y]) => [x * RAD, y * RAD]);
      const real = (a, b) => (askBC ? Math.sin(a) : Math.sin(b)) / Math.sin(Math.PI - a - b);
      const truth = opts.map((o) => trials.every(([a, b]) => Math.abs(o.f(a, b) - real(a, b)) < 1e-9));
      const rows = d.shuffle(opts.map((o, i) => [o, truth[i]]));
      const mdl = angABC(180 - 62 - 55, 62, 55);
      const f = pic({ A: mdl.B, B: mdl.C, C: mdl.A }, { polys: [['A', 'B', 'C']], angs: [['A', 'B', 'C', sv('α')], ['B', 'C', 'A', sv('β')]], sides: [['A', 'B', sv('d'), 'C']], size: [190, 110] });
      return seal(C(`그림과 같이 두 지점 A, B 사이의 거리는 ${dd}이고 ${eqh('∠CAB', al)}, ${eqh('∠ABC', be)}이다. 두 지점 ${askBC ? 'B, C' : 'A, C'} 사이의 거리를 ${al}, ${be}, ${dd}로 나타낸 것은?`, rows.map((r) => r[0].h), rows.findIndex((r) => r[1]), {
        figure: f.b.svg('삼각형 ABC. AB의 길이는 d, ∠CAB = α, ∠ABC = β'),
        explain: `${nb('∠ACB = 180° − (' + al + ' + ' + be + ')')}이고 ${nb(sinH('{180° − (' + al + ' + ' + be + ')}') + ' = ' + sAB)}이다. 사인법칙에 의하여 ${askBC ? frac(SG('BC'), s(al)) : frac(SG('AC'), s(be))} = ${frac(dd, sAB)}이므로 ${askBC ? SG('BC') : SG('AC')} = ${frac(dd + ' ' + s(askBC ? al : be), sAB)}이다.`,
        facts: { truth: rows.map((r) => r[1]), want: true }
      }));
    }),
    T('sineuse-square', '정사각형의 대각선과 한 변 위의 점이 만드는 각의 sin 값', '①16', (d) => {
      // 정사각형 ABCD, 변 CD 위의 점 P(DP : PC = p : q), ∠DBP = θ → 1/sin θ = √2 × BP/DP (한 변 p + q)
      const [p, q] = d.pick([[1, 1], [1, 2], [1, 3], [2, 1], [1, 4]]);
      const s = p + q, BP2 = s * s + q * q, ans = div(mul(KR(1, 2), sqrtV(K(BP2))), K(p));
      const mdl = { A: [0, s], B: [0, 0], C: [s, 0], D: [s, s], P: [s, q] };
      const f = pic(mdl, { polys: [['A', 'B', 'C', 'D']], segs: [['B', 'D'], ['B', 'P']], angs: [['B', 'P', 'D', sv('θ'), { r: 30 }]], names: ['A', 'B', 'C', 'D', 'P'], nameAt: { A: 135, B: 225, C: 315, D: 45, P: 0 }, size: [130, 130] });
      const where = p === q ? '변 CD의 중점 P' : `변 CD 위의 점 P에 대하여 ${nb(SG('DP') + ' : ' + SG('PC') + ' = ' + p + ' : ' + q)}이고`;
      const th = V('θ');
      return aRad(`그림과 같은 정사각형 ABCD에서 ${where}${p === q ? '에 대하여' : ''} ${eqh('∠DBP', th)}일 때, ${frac(1, sinH(th))}의 값은?`, ans, '', {
        figure: f.b.svg(`정사각형 ABCD와 대각선 BD, 선분 BP. 점 P는 변 CD 위에 있다${p === q ? '(중점)' : ''}. ∠DBP = θ`),
        explain: `정사각형의 한 변의 길이를 ${s}${V('k')}로 놓으면 ${eqh(SG('DP'), (p === 1 ? '' : p) + V('k'))}, ${eqh(SG('PC'), (q === 1 ? '' : q) + V('k'))}, ${eqh(SG('BP'), rt(s * s + ' + ' + q * q) + V('k'))}이다. 삼각형 DBP에서 ${eqh('∠BDP', '45°')}이므로 사인법칙에 의하여 ${frac(SG('DP'), sinH(th))} = ${frac(SG('BP'), sinD(45))}이고 ${frac(1, sinH(th))} = ${frac(SG('BP'), SG('DP') + ' ' + sinD(45))} = ${sh(ans)}이다.`
      });
    })
  ];

  // ── 묶음 3: 코사인법칙 ──
  // 세 값의 이름: 구하는 변 x 의 대각 X, 두 변 y, z
  const cosineTypes = [
    T('cos-side', '두 변과 그 끼인각으로 나머지 한 변 구하기', '①18', (d, n) => {
      // n = 0: 끼인각이 예각(30°·45°·60°), n = 1: 둔각(120°·135°·150°)
      const z = d.until(() => {
        const x = d.pick(['a', 'b', 'c']), [y, w2] = others(x), th = n === 0 ? d.pick([30, 45, 60]) : d.pick([120, 135, 150]), m = th === 45 || th === 135 ? 2 : th === 30 || th === 150 ? 3 : 1;
        const sy = m === 1 ? K(d.int(2, 9)) : KR(d.int(1, 5), m), sz = K(d.int(2, 9));
        return { x, y, w2, th, sides: d.bool() ? [sy, sz] : [sz, sy] };
      }, (q) => { try { const c2 = sbt(add(sq(q.sides[0]), sq(q.sides[1])), mul(mul(K(2), mul(q.sides[0], q.sides[1])), COS[q.th])); return isRat(c2) && c2[0].nv > 0 && isK(sqrtV(c2)) && fv(sqrtV(c2)) < 40; } catch (e) { return false; } });
      const { x, y, w2, th, sides } = z, X2 = sbt(add(sq(sides[0]), sq(sides[1])), mul(mul(K(2), mul(sides[0], sides[1])), COS[th])), Xv = sqrtV(X2);
      return aRad(`${TRI}에서 ${givenSides([[y, sides[0]], [w2, sides[1]]])}, ${givenAngles([[x, th]])}일 때, ${SVv[x]}의 값은?`, Xv, '', {
        rule: n === 0 ? 'acute' : 'obtuse',
        explain: `코사인법칙에 의하여 ${sqH(SVv[x])} = ${sqH(pq(sides[0]))} + ${sqH(pq(sides[1]))} − 2 × ${sh(sides[0])} × ${sh(sides[1])} × ${cosD(th)} = ${sh(X2)}이다. ${SVv[x]} &gt; 0이므로 ${eqh(SVv[x], sh(Xv))}이다.`
      });
    }, { count: 2 }),
    T('cos-side-given', '끼인각의 cos 값으로 나머지 한 변 구하기', '①19', (d) => {
      const z = d.until(() => {
        const q = d.int(3, 9), p = d.int(1, q - 1) * (d.bool() ? 1 : -1), b = d.int(2, 12), c = d.int(2, 12);
        return { q, p, b, c, x: d.pick(['a', 'b', 'c']) };
      }, (y) => { if (gcd(Math.abs(y.p), y.q) !== 1 || 2 * Math.abs(y.p) === y.q || y.b === y.c) return false; const a2 = y.b * y.b + y.c * y.c - 2 * y.b * y.c * y.p / y.q; const a = Math.round(Math.sqrt(a2)); return Number.isInteger(a2) && a * a === a2 && a > 1 && a !== y.b && a !== y.c; });
      const { q, p, b, c, x } = z, [y, w2] = others(x), a2 = b * b + c * c - 2 * b * c * p / q, a = Math.sqrt(a2), cosV = KF(p, q);
      return aInt(`${TRI}에서 ${givenSides([[y, K(b)], [w2, K(c)]])}이고 ${eqh(cosH(AV[x]), sh(cosV))}일 때, ${SVv[x]}의 값은?`, K(a), '', {
        explain: `코사인법칙에 의하여 ${sqH(SVv[x])} = ${b}${sup(2)} + ${c}${sup(2)} − 2 × ${b} × ${c} × ${p < 0 ? '(' + sh(cosV) + ')' : sh(cosV)} = ${a2}이다. ${SVv[x]} &gt; 0이므로 ${eqh(SVv[x], a)}이다.`,
        facts: { calc: [[`(${b}*${b}+${c}*${c}-2*${b}*${c}*(${p})/${q})**0.5`, 0]] }
      });
    }),
    T('cos-value', '세 변의 길이로 cos 값 구하기', '①20', (d) => {
      const z = d.until(() => ({ s: [d.int(2, 12), d.int(2, 12), d.int(2, 12)], x: d.pick(['a', 'b', 'c']) }), (y) => {
        const [a, b, c] = y.s; if (a >= b + c || b >= a + c || c >= a + b || new Set(y.s).size < 3) return false;
        const i = 'abc'.indexOf(y.x), o = y.s.filter((_, j) => j !== i), num = o[0] * o[0] + o[1] * o[1] - y.s[i] * y.s[i], den = 2 * o[0] * o[1];
        return num !== 0 && num % den !== 0 && 2 * Math.abs(num) !== den;
      });
      const { s, x } = z, i = 'abc'.indexOf(x), o = s.filter((_, j) => j !== i), num = o[0] * o[0] + o[1] * o[1] - s[i] * s[i], den = 2 * o[0] * o[1], v = KF(num, den);
      const [y, w2] = others(x);
      return aQ(`${TRI}에서 ${eqh(va, s[0])}, ${eqh(vb, s[1])}, ${eqh(vc, s[2])}일 때, ${cosH(AV[x])}의 값은?`, v, {
        signed: true,
        explain: `코사인법칙에 의하여 ${cosH(AV[x])} = ${frac(sqH(SVv[y]) + ' + ' + sqH(SVv[w2]) + ' − ' + sqH(SVv[x]), '2' + SVv[y] + SVv[w2])} = ${frac(o[0] + sup(2) + ' + ' + o[1] + sup(2) + ' − ' + s[i] + sup(2), '2 × ' + o[0] + ' × ' + o[1])} = ${sh(v)}이다.`,
        facts: { value: `(${o[0]}*${o[0]}+${o[1]}*${o[1]}-${s[i]}*${s[i]})/(2*${o[0]}*${o[1]})` }
      });
    }),
    T('cos-angle', '세 변의 길이로 각의 크기 구하기', '①21', (d, n) => {
      if (n === 0) {
        // 정수인 세 변, 한 각이 60° 또는 120°
        const z = d.until(() => ({ p: d.int(2, 12), q: d.int(2, 12), th: d.pick([60, 120]), x: d.pick(['a', 'b', 'c']) }), (y) => { const r2v = y.p * y.p + y.q * y.q + (y.th === 120 ? 1 : -1) * y.p * y.q, r = Math.round(Math.sqrt(r2v)); return r * r === r2v && y.p !== y.q && r !== y.p && r !== y.q; });
        const { p, q, th, x } = z, r = Math.round(Math.sqrt(p * p + q * q + (th === 120 ? 1 : -1) * p * q)), [y, w2] = others(x), sv3 = { [x]: r, [y]: p, [w2]: q };
        const cv = (p * p + q * q - r * r) / (2 * p * q), ang = angOfCos(cv);
        return angleQ(d, `${TRI}에서 ${eqh(va, sv3.a)}, ${eqh(vb, sv3.b)}, ${eqh(vc, sv3.c)}일 때, ${AV[x]}의 크기는?`, ang, {
          explain: `코사인법칙에 의하여 ${cosH(AV[x])} = ${frac(p + sup(2) + ' + ' + q + sup(2) + ' − ' + r + sup(2), '2 × ' + p + ' × ' + q)} = ${sh(KF(p * p + q * q - r * r, 2 * p * q))}이다. 0° &lt; ${AV[x]} &lt; 180°이므로 ${eqh(AV[x], dg(ang))}이다.`
        });
      }
      // n = 1: 근호가 든 세 변 — 세 각이 (45°, 60°, 75°) 또는 (30°, 45°, 105°)인 삼각형. 가장 작은 내각을 묻는다.
      const fam = d.pick([[45, 60, 75], [30, 45, 105]]), k = d.int(1, 3);
      // 2√2 sin 으로 키운 변: 45° → 2, 60° → √6, 75° → √3 + 1 / 30° → √2, 45° → 2, 105° → √3 + 1
      const SIDE = { 30: KR(1, 2), 45: K(2), 60: KR(1, 6), 75: add(K(1), KR(1, 3)), 105: add(K(1), KR(1, 3)) };
      const letters = d.shuffle(['a', 'b', 'c']), vals = {}; fam.forEach((ang, i) => { vals[letters[i]] = mul(SIDE[ang], K(k)); });
      const small = letters[0], target = fam[0];
      const nums = { a: fv(vals.a), b: fv(vals.b), c: fv(vals.c) }, oo = others(small), cv = (nums[oo[0]] ** 2 + nums[oo[1]] ** 2 - nums[small] ** 2) / (2 * nums[oo[0]] * nums[oo[1]]);
      if (angOfCos(cv) !== target) throw new Error('각이 맞지 않는다');
      const c2 = sq(vals[small]), s2 = add(sq(vals[oo[0]]), sq(vals[oo[1]]));
      return angleQ(d, `${TRI}에서 ${eqh(va, sh(vals.a))}, ${eqh(vb, sh(vals.b))}, ${eqh(vc, sh(vals.c))}일 때, ${TRI}의 가장 작은 내각의 크기는?`, target, {
        explain: `가장 짧은 변은 ${SVv[small]}이므로 가장 작은 내각은 ${AV[small]}이다. 코사인법칙에 의하여 ${cosH(AV[small])} = ${frac(sqH(SVv[oo[0]]) + ' + ' + sqH(SVv[oo[1]]) + ' − ' + sqH(SVv[small]), '2' + SVv[oo[0]] + SVv[oo[1]])} = ${frac(sh(sbt(s2, c2)), '2 × ' + pm(vals[oo[0]]) + ' × ' + pm(vals[oo[1]]))} = ${sh(COS[target])}이므로 ${eqh(AV[small], dg(target))}이다.`
      });
    }, { count: 2 }),
    T('cos-ratio', '세 변의 길이의 비로 각의 크기·cos 값 구하기', '①22', (d, n) => {
      if (n === 0) {
        const z = d.until(() => ({ p: d.int(2, 9), q: d.int(2, 9), th: d.pick([60, 120]), x: d.pick(['a', 'b', 'c']) }), (y) => { const r2v = y.p * y.p + y.q * y.q + (y.th === 120 ? 1 : -1) * y.p * y.q, r = Math.round(Math.sqrt(r2v)); return r * r === r2v && y.p !== y.q && r !== y.p && r !== y.q && gcd(gcd(y.p, y.q), r) === 1; });
        const { p, q, th, x } = z, r = Math.round(Math.sqrt(p * p + q * q + (th === 120 ? 1 : -1) * p * q)), [y, w2] = others(x), rt3 = { [x]: r, [y]: p, [w2]: q };
        const ang = angOfCos((p * p + q * q - r * r) / (2 * p * q)), kk = V('k');
        return angleQ(d, `${TRI}에서 ${nb(va + ' : ' + vb + ' : ' + vc + ' = ' + rt3.a + ' : ' + rt3.b + ' : ' + rt3.c)}일 때, ${AV[x]}의 크기는?`, ang, {
          explain: `${nb(va + ' = ' + rt3.a + kk)}, ${nb(vb + ' = ' + rt3.b + kk)}, ${nb(vc + ' = ' + rt3.c + kk)}(${kk} &gt; 0)로 놓으면 코사인법칙에 의하여 ${cosH(AV[x])} = ${frac('(' + p + kk + ')' + sup(2) + ' + (' + q + kk + ')' + sup(2) + ' − (' + r + kk + ')' + sup(2), '2 × ' + p + kk + ' × ' + q + kk)} = ${sh(KF(p * p + q * q - r * r, 2 * p * q))}이므로 ${eqh(AV[x], dg(ang))}이다.`
        });
      }
      const z = d.until(() => ({ s: [d.int(2, 9), d.int(2, 9), d.int(2, 9)], x: d.pick(['a', 'b', 'c']) }), (y) => {
        const [a, b, c] = y.s; if (a >= b + c || b >= a + c || c >= a + b || new Set(y.s).size < 3 || gcd(gcd(a, b), c) !== 1) return false;
        const i = 'abc'.indexOf(y.x), o = y.s.filter((_, j) => j !== i), num = o[0] * o[0] + o[1] * o[1] - y.s[i] * y.s[i], den = 2 * o[0] * o[1];
        return num !== 0 && num % den !== 0 && 2 * Math.abs(num) !== den;
      });
      const { s, x } = z, i = 'abc'.indexOf(x), o = s.filter((_, j) => j !== i), num = o[0] * o[0] + o[1] * o[1] - s[i] * s[i], den = 2 * o[0] * o[1], v = KF(num, den), kk = V('k');
      return aQ(`${TRI}에서 ${nb(va + ' : ' + vb + ' : ' + vc + ' = ' + s.join(' : '))}일 때, ${cosH(AV[x])}의 값은?`, v, {
        signed: true,
        explain: `${nb(va + ' = ' + s[0] + kk)}, ${nb(vb + ' = ' + s[1] + kk)}, ${nb(vc + ' = ' + s[2] + kk)}(${kk} &gt; 0)로 놓으면 코사인법칙에 의하여 ${cosH(AV[x])} = ${frac(o[0] + sup(2) + ' + ' + o[1] + sup(2) + ' − ' + s[i] + sup(2), '2 × ' + o[0] + ' × ' + o[1])} = ${sh(v)}이다.`,
        facts: { value: `(${o[0]}*${o[0]}+${o[1]}*${o[1]}-${s[i]}*${s[i]})/(2*${o[0]}*${o[1]})` }
      });
    }, { count: 2 }),
    T('cos-sinratio', '세 각의 사인의 비로 가장 큰 각·cos 값 구하기', '①23', (d, n) => {
      if (n === 0) {
        // 가장 큰 각이 90° 또는 120°인 정수 비
        const z = d.until(() => ({ p: d.int(2, 9), q: d.int(2, 12), th: d.pick([90, 120]), form: d.bool() }), (y) => { const r2v = y.p * y.p + y.q * y.q + (y.th === 120 ? y.p * y.q : 0), r = Math.round(Math.sqrt(r2v)); return r * r === r2v && y.p !== y.q && gcd(gcd(y.p, y.q), r) === 1; });
        const { p, q, th, form } = z, r = Math.round(Math.sqrt(p * p + q * q + (th === 120 ? p * q : 0)));
        const order = d.shuffle([p, q, r]), big = 'abc'[order.indexOf(r)];
        const o = order.filter((x) => x !== r), cv = (o[0] * o[0] + o[1] * o[1] - r * r) / (2 * o[0] * o[1]), ang = angOfCos(cv), kk = V('k');
        const given = form ? nb(frac(sinH(vA), order[0]) + ' = ' + frac(sinH(vB), order[1]) + ' = ' + frac(sinH(vC), order[2])) : nb(sinH(vA) + ' : ' + sinH(vB) + ' : ' + sinH(vC) + ' = ' + order.join(' : '));
        return angleQ(d, `${TRI}에서 ${given}일 때, ${TRI}의 가장 큰 내각의 크기는?`, ang, {
          explain: `사인법칙에 의하여 ${nb(va + ' : ' + vb + ' : ' + vc + ' = ' + order.join(' : '))}이므로 가장 큰 내각은 가장 긴 변의 대각 ${AV[big]}이다. ${nb(va + ' = ' + order[0] + kk)}, ${nb(vb + ' = ' + order[1] + kk)}, ${nb(vc + ' = ' + order[2] + kk)}로 놓으면 ${cosH(AV[big])} = ${frac(o[0] + sup(2) + ' + ' + o[1] + sup(2) + ' − ' + r + sup(2), '2 × ' + o[0] + ' × ' + o[1])} = ${sh(KF(o[0] * o[0] + o[1] * o[1] - r * r, 2 * o[0] * o[1]))}이므로 ${eqh(AV[big], dg(ang))}이다.`
        });
      }
      // n = 1: cos A 와 cos C 를 칸마다(원문은 둘의 곱을 물었다)
      const z = d.until(() => [d.int(2, 9), d.int(2, 9), d.int(2, 9)], (s) => {
        const [a, b, c] = s; if (a >= b + c || b >= a + c || c >= a + b || new Set(s).size < 3 || gcd(gcd(a, b), c) !== 1) return false;
        const nA = b * b + c * c - a * a, nC = a * a + b * b - c * c; return nA !== 0 && nC !== 0 && nA % (2 * b * c) !== 0 && nC % (2 * a * b) !== 0;
      });
      const [a, b, c] = z, cA = KF(b * b + c * c - a * a, 2 * b * c), cC = KF(a * a + b * b - c * c, 2 * a * b);
      const tA = cA[0], tC = cC[0], kk = V('k');
      return seal(inline(`${TRI}에서 ${nb(sinH(vA) + ' : ' + sinH(vB) + ' : ' + sinH(vC) + ' = ' + z.join(' : '))}일 때, ${cosH(vA)}와 ${cosH(vC)}의 값을 각각 구하시오. (단, 분수는 기약분수로 나타낸다.)`,
        `${cosH(vA)} = ${grp(frac('{0}', '{1}'))}, ${cosH(vC)} = ${grp(frac('{2}', '{3}'))}`, [{ answer: tA.nv, signed: true }, { answer: tA.dv }, { answer: tC.nv, signed: true }, { answer: tC.dv }], {
          shown: `${cosH(vA)} = ${sh(cA)}, ${cosH(vC)} = ${sh(cC)}`,
          explain: `사인법칙에 의하여 ${nb(va + ' : ' + vb + ' : ' + vc + ' = ' + z.join(' : '))}이므로 ${nb(va + ' = ' + a + kk)}, ${nb(vb + ' = ' + b + kk)}, ${nb(vc + ' = ' + c + kk)}로 놓으면 코사인법칙에 의하여 ${cosH(vA)} = ${frac(b + sup(2) + ' + ' + c + sup(2) + ' − ' + a + sup(2), '2 × ' + b + ' × ' + c)} = ${sh(cA)}, ${cosH(vC)} = ${frac(a + sup(2) + ' + ' + b + sup(2) + ' − ' + c + sup(2), '2 × ' + a + ' × ' + b)} = ${sh(cC)}이다.`,
          facts: { calc: [[`(${b}*${b}+${c}*${c}-${a}*${a})/${gcd(Math.abs(b * b + c * c - a * a), 2 * b * c)}`, 0], [`(2*${b}*${c})/${gcd(Math.abs(b * b + c * c - a * a), 2 * b * c)}`, 1],
            [`(${a}*${a}+${b}*${b}-${c}*${c})/${gcd(Math.abs(a * a + b * b - c * c), 2 * a * b)}`, 2], [`(2*${a}*${b})/${gcd(Math.abs(a * a + b * b - c * c), 2 * a * b)}`, 3]] }
        }));
    }, { count: 2 }),
    T('cos-relation', '변 사이의 관계식으로 각의 크기 구하기', '①24', (d) => {
      // a² = s b², c² = (s − 1)b² + k bc → cos A = k/2
      const z = d.until(() => ({ s: d.int(2, 5), k: d.pick([[1, 1], [1, 2], [1, 3], [-1, 1], [-1, 2], [-1, 3]]) }), () => true);
      const { s, k } = z, kv = KR(k[0], k[1]), cosA = mul(kv, half(1)), ang = angOfCos(fv(cosA));
      const kH = k[1] === 1 ? (k[0] < 0 ? ' ' + MINUS + ' ' : ' + ') : (k[0] < 0 ? ' ' + MINUS + ' ' : ' + ') + rt(k[1]);
      const rel = nb(sqH(vc) + ' = ' + (s - 1 === 1 ? '' : s - 1) + sqH(vb) + kH + vb + vc);
      return angleQ(d, `${TRI}에서 ${nb(va + ' : ' + vb + ' = ' + (s === 4 ? '2' : sh(KR(1, s))) + ' : 1')}이고 ${rel}일 때, ${vA}의 크기는?`, ang, {
        explain: `${nb(sqH(va) + ' = ' + s + sqH(vb))}이므로 코사인법칙에 의하여 ${cosH(vA)} = ${frac(sqH(vb) + ' + ' + sqH(vc) + ' − ' + sqH(va), '2' + vb + vc)} = ${frac(sqH(vb) + ' + ' + (s - 1 === 1 ? '' : s - 1) + sqH(vb) + kH + vb + vc + ' − ' + s + sqH(vb), '2' + vb + vc)} = ${sh(cosA)}이다. 따라서 ${eqh(vA, dg(ang))}이다.`
      });
    }),
    T('cos-cyclic', '원에 내접하는 사각형의 변의 길이 구하기(코사인법칙에서 이차방정식)', '①25', (d) => {
      const z = d.until(() => ({ ab: d.int(2, 9), bc: d.int(2, 9), cd: d.int(1, 8), Bv: d.pick([60, 120]) }), (y) => {
        const ac2 = y.ab * y.ab + y.bc * y.bc - (y.Bv === 60 ? 1 : -1) * y.ab * y.bc, cD = y.Bv === 60 ? -0.5 : 0.5;   // ∠D = 180° − B
        // x² − 2·cd·cos D·x + cd² − ac² = 0
        const bq = -2 * y.cd * cD, cq = y.cd * y.cd - ac2, disc = bq * bq - 4 * cq; if (disc <= 0) return false;
        const x = (-bq + Math.sqrt(disc)) / 2, all = [y.ab, y.bc, y.cd, x];
        // 그림에서 변의 글과 각의 글이 겹치지 않게 네 변의 길이가 너무 차이 나지 않게 한다.
        return Math.abs(x - Math.round(x)) < 1e-9 && x >= 1 && Math.round(x) !== y.cd && y.ab !== y.bc && Math.min(...all) >= 3 && Math.max(...all) <= 2.6 * Math.min(...all);
      });
      const { ab, bc, cd, Bv } = z, Dv = 180 - Bv, ac2 = ab * ab + bc * bc - (Bv === 60 ? 1 : -1) * ab * bc, cDs = Bv === 60 ? 1 : -1;   // cos D = −cos B
      const bq = cDs * cd, cq = cd * cd - ac2, x = Math.round((-bq + Math.sqrt(bq * bq - 4 * cq)) / 2);
      // 그림: B 원점, C (bc, 0), A 는 ∠B 쪽. D 는 외접원 위에서 B 의 반대쪽
      const Bm = [0, 0], Cm = [bc, 0], Am = polar(Bm, ab, Bv);
      const ox = bc / 2, oy = (Am[0] * Am[0] + Am[1] * Am[1] - bc * Am[0]) / (2 * Am[1]), R0 = Math.hypot(ox, oy);
      const phi = 2 * Math.asin(Math.min(1, cd / (2 * R0))) / RAD, aC = Math.atan2(-oy, bc - ox) / RAD;
      const cand = [aC + phi, aC - phi].map((a) => [ox + R0 * Math.cos(a * RAD), oy + R0 * Math.sin(a * RAD)]);
      const side = (p) => (Cm[0] - Am[0]) * (p[1] - Am[1]) - (Cm[1] - Am[1]) * (p[0] - Am[0]);
      const Dm = cand.find((p) => side(p) * side(Bm) < 0);
      const mdl = { A: Am, B: Bm, C: Cm, D: Dm, O: [ox, oy] };
      const f = pic(mdl, { circle: ['O', R0], polys: [['A', 'B', 'C', 'D']], angs: [['B', 'C', 'A', dg(Bv)]], sides: [['A', 'B', String(ab), 'C'], ['B', 'C', String(bc), 'in'], ['C', 'D', String(cd), 'in']], names: ['A', 'B', 'C', 'D'], nameAt: Object.fromEntries(['A', 'B', 'C', 'D'].map((nm) => [nm, (Math.atan2(mdl[nm][1] - oy, mdl[nm][0] - ox) / RAD + 360) % 360])), size: [170, 150] });
      return seal(N(`그림과 같이 원에 내접하는 사각형 ABCD에서 ${eqh(SG('AB'), ab)}, ${eqh(SG('BC'), bc)}, ${eqh(SG('CD'), cd)}이고 ${eqh('∠ABC', dg(Bv))}일 때, 선분 AD의 길이는?`, x, {
        figure: f.b.svg(`원에 내접하는 사각형 ABCD. AB의 길이는 ${ab}, BC의 길이는 ${bc}, CD의 길이는 ${cd}, ∠B = ${Bv}°`),
        explain: `삼각형 ABC에서 코사인법칙에 의하여 ${sqH(SG('AC'))} = ${ab}${sup(2)} + ${bc}${sup(2)} − 2 × ${ab} × ${bc} × ${cosD(Bv)} = ${ac2}이다. 원에 내접하는 사각형의 마주 보는 두 각의 크기의 합은 180°이므로 ${eqh('∠ADC', dg(Dv))}이다. ${eqh(SG('AD'), V('x'))}라 하면 삼각형 ACD에서 ${nb(ac2 + ' = ' + V('x') + sup(2) + ' + ' + cd + sup(2) + ' − 2 × ' + V('x') + ' × ' + cd + ' × ' + cosD(Dv))}이고, 이 이차방정식의 양수인 근은 ${x}이다.`,
        facts: { calc: [[`(-(${cDs})*${cd}+(${cd}*${cd}-4*(${cd}*${cd}-(${ab}*${ab}+${bc}*${bc}-(${Bv === 60 ? 1 : -1})*${ab}*${bc})))**0.5)/2`, 0]] }
      }));
    })
  ];

  // ── 묶음 4: 코사인법칙의 활용 ──
  // 두 지점 사이 거리(cos 값을 소수 둘째 자리까지 줄 때 답이 소수 첫째 자리로 떨어지는 것)
  const DIST = [];
  for (let b = 3; b <= 12; b += 1) for (let c = b + 1; c <= 14; c += 1) for (let t = 32; t <= 88; t += 1) {
    if ([45, 60].includes(t)) continue;
    const cr = Math.round(Math.cos(t * RAD) * 100), X100 = b * b * 100 + c * c * 100 - 2 * b * c * cr, r = Math.round(Math.sqrt(X100));
    if (X100 > 0 && r * r === X100 && r % 10 !== 0) DIST.push([b, c, t, cr, r]);
  }
  // 속력의 비와 끼인각(60°·120°)으로 거리가 자연수인 짝
  const SPEED = [];
  for (let p = 8; p <= 24; p += 1) for (let q = p + 1; q <= 24; q += 1) for (const th of [60, 120]) {
    const v = p * p + q * q + (th === 120 ? 1 : -1) * p * q, r = Math.round(Math.sqrt(v));
    if (r * r === v) SPEED.push([p, q, th, r]);
  }
  const cosUseTypes = [
    T('cosuse-distance', '두 거리와 그 끼인각으로 두 지점 사이의 거리 구하기(실생활)', '①26', (d, n) => {
      if (n === 0) {
        const [b, c, t, cr, r] = d.pick(DIST), cv = cr / 100, ans = r / 10;
        const mdl = { A: [0, 0], B: [c, 0], C: polar([0, 0], b, t) };
        const f = pic(mdl, { polys: [['A', 'B', 'C']], angs: [['A', 'B', 'C', dg(t)]], sides: [['A', 'B', c + ' km', 'C'], ['A', 'C', b + ' km', 'B']], size: [190, 120] });
        return seal(D(`그림과 같이 A 지점에서 두 등대 B, C까지의 거리와 두 등대를 바라본 각의 크기를 재었더니 ${eqh(SG('AB'), c + ' km')}, ${eqh(SG('AC'), b + ' km')}, ${eqh('∠CAB', dg(t))}이었다. 두 등대 B, C 사이의 거리는 몇 km인가? (단, ${nb(cosD(t) + ' = ' + cv + tailDec(cv, '으로/로'))} 계산한다.)`, ans, {
          unit: 'km', figure: f.b.svg(`삼각형 ABC. AB의 길이는 ${c} km, AC의 길이는 ${b} km, ∠A = ${t}°`),
          explain: `코사인법칙에 의하여 ${sqH(SG('BC'))} = ${b}${sup(2)} + ${c}${sup(2)} − 2 × ${b} × ${c} × ${cv} = ${Number((r * r / 100).toFixed(2))}이다. ${SG('BC')} &gt; 0이므로 BC의 길이는 ${ans} km이다.`,
          facts: { calc: [[`(${b}*${b}+${c}*${c}-2*${b}*${c}*${cv})**0.5`, 0]] }
        }));
      }
      const [p, q, th, r] = d.pick(SPEED), h = d.int(1, 3), ans = r * h;
      // 두 길이 O 에서 각 th 로 벌어진다
      const mA = polar([0, 0], p, 90 + th / 2), mB = polar([0, 0], q, 90 - th / 2);
      const f = pic({ O: [0, 0], A: mA, B: mB }, { segs: [['O', 'A'], ['O', 'B']], cuts: [['A', 'B']], angs: [['O', 'B', 'A', dg(th)]], names: ['O', 'A', 'B'], size: [190, 110] });
      return seal(N(`두 사람이 O 지점에서 동시에 출발하여 서로 다른 두 직선 도로를 따라 각각 시속 ${p} km, 시속 ${q} km로 일정하게 자전거를 타고 간다. 두 도로가 이루는 각의 크기가 ${dg(th)}일 때, 출발한 지 ${h}시간 후 두 사람 사이의 거리는 몇 km인가?`, ans, {
        unit: 'km', figure: f.b.svg(`O에서 ${th}°를 이루며 뻗은 두 직선 도로와 두 사람의 위치 A, B`),
        explain: `${h}시간 동안 두 사람은 각각 ${p * h} km, ${q * h} km를 가므로 두 사람 사이의 거리를 ${V('x')} km라 하면 코사인법칙에 의하여 ${nb(V('x') + sup(2))} = ${p * h}${sup(2)} + ${q * h}${sup(2)} − 2 × ${p * h} × ${q * h} × ${cosD(th)} = ${ans * ans}이다. 따라서 ${ans} km이다.`,
        facts: { calc: [[`((${p}*${h})*(${p}*${h})+(${q}*${h})*(${q}*${h})-(${th === 120 ? -1 : 1})*(${p}*${h})*(${q}*${h}))**0.5`, 0]] }
      }));
    }, { count: 2 }),
    T('cosuse-cevian', '삼각형 안의 선분 — 큰 삼각형의 cos 값으로 작은 삼각형의 변 구하기', '①27', (d, n) => {
      if (n === 0) {
        // D 는 BC 위. AB, AC, BD, DC → cos C → AD(자연수)
        const z = d.until(() => ({ ab: d.int(3, 12), ac: d.int(3, 12), bd: d.int(1, 8), dc: d.int(1, 8) }), (y) => {
          const bc = y.bd + y.dc; if (y.ab >= y.ac + bc || y.ac >= y.ab + bc || bc >= y.ab + y.ac || y.ab === y.ac) return false;
          const ad2 = (y.ab * y.ab * y.dc + y.ac * y.ac * y.bd) / bc - y.bd * y.dc, ad = Math.round(Math.sqrt(ad2)); return Number.isInteger(ad2) && ad * ad === ad2 && ad > 1 && ![y.ab, y.ac].includes(ad) && y.bd !== y.dc;
        });
        const { ab, ac, bd, dc } = z, bc = bd + dc, cosC = KF(ac * ac + bc * bc - ab * ab, 2 * ac * bc), ad2 = dc * dc + ac * ac - 2 * dc * ac * fv(cosC), ad = Math.round(Math.sqrt(ad2));
        const mdl = sssABC(bc, ac, ab); mdl.D = [bd, 0];
        const f = pic(mdl, { polys: [['A', 'B', 'C']], segs: [['A', 'D']], sides: [['A', 'B', String(ab), 'C'], ['A', 'C', String(ac), 'B'], ['B', 'D', String(bd), 'A'], ['D', 'C', String(dc), 'A']], nameAt: { D: 270 }, size: [200, 120] });
        return seal(N(`그림과 같이 ${eqh(SG('AB'), ab)}, ${eqh(SG('AC'), ac)}인 ${TRI}에서 변 BC 위의 한 점 D에 대하여 ${eqh(SG('BD'), bd)}, ${eqh(SG('DC'), dc)}일 때, 선분 AD의 길이는?`, ad, {
          figure: f.b.svg(`삼각형 ABC와 변 BC 위의 점 D. AB의 길이는 ${ab}, AC의 길이는 ${ac}, BD의 길이는 ${bd}, DC의 길이는 ${dc}`),
          explain: `삼각형 ABC에서 코사인법칙에 의하여 ${cosH(vC)} = ${frac(ac + sup(2) + ' + ' + bc + sup(2) + ' − ' + ab + sup(2), '2 × ' + ac + ' × ' + bc)} = ${sh(cosC)}이다. 삼각형 ADC에서 ${sqH(SG('AD'))} = ${dc}${sup(2)} + ${ac}${sup(2)} − 2 × ${dc} × ${ac} × ${cosC[0].nv < 0 ? '(' + sh(cosC) + ')' : sh(cosC)} = ${ad2}이므로 AD의 길이는 ${ad}이다.`,
          facts: { calc: [[`(${dc}*${dc}+${ac}*${ac}-2*${dc}*${ac}*(${ac}*${ac}+(${bd}+${dc})*(${bd}+${dc})-${ab}*${ab})/(2*${ac}*(${bd}+${dc})))**0.5`, 0]] }
        }));
      }
      // n = 1: ∠A 의 이등분선 AD. AB, BC, AC → BD : DC = AB : AC → cos B → AD(k√m)
      const z = d.until(() => ({ ab: d.int(3, 12), bc: d.int(3, 12), ac: d.int(3, 12) }), (y) => {
        if (y.ab >= y.ac + y.bc || y.ac >= y.ab + y.bc || y.bc >= y.ab + y.ac || y.ab === y.ac) return false;
        if ((y.bc * y.ab) % (y.ab + y.ac) !== 0) return false;
        try { const bd = y.bc * y.ab / (y.ab + y.ac), ad2 = KF(y.ab * y.ac * (y.ab + y.ac) * (y.ab + y.ac) - y.ab * y.ac * y.bc * y.bc, (y.ab + y.ac) * (y.ab + y.ac)); return Number.isInteger(bd) && isK(sqrtV(ad2)); } catch (e) { return false; }
      });
      const { ab, bc, ac } = z, bd = bc * ab / (ab + ac), cosB = KF(ab * ab + bc * bc - ac * ac, 2 * ab * bc), ad2 = sbt(K(ab * ab + bd * bd), mul(K(2 * ab * bd), cosB)), AD = sqrtV(ad2);
      const mdl = sssABC(bc, ac, ab); mdl.D = [bd, 0];
      const f = pic(mdl, { polys: [['A', 'B', 'C']], segs: [['A', 'D']], sides: [['A', 'B', String(ab), 'C'], ['A', 'C', String(ac), 'B'], ['B', 'C', String(bc), 'A', { gap: 18 }]], after: (b, P) => { const a1 = dirOf(P.A, P.B), a2 = dirOf(P.A, P.D), a3 = dirOf(P.A, P.C); b.sym(P.A, (a1 + a2) / 2 + (Math.abs(a1 - a2) > 180 ? 180 : 0), 'dot', 26); b.sym(P.A, (a2 + a3) / 2 + (Math.abs(a2 - a3) > 180 ? 180 : 0), 'dot', 26); }, nameAt: { D: 270 }, size: [200, 120] });
      return aRad(`그림과 같이 ${eqh(SG('AB'), ab)}, ${eqh(SG('BC'), bc)}, ${eqh(SG('AC'), ac)}인 ${TRI}에서 ∠A의 이등분선이 변 BC와 만나는 점을 D라 할 때, 선분 AD의 길이는?`, AD, '', {
        figure: f.b.svg(`삼각형 ABC와 ∠A의 이등분선 AD. AB의 길이는 ${ab}, BC의 길이는 ${bc}, AC의 길이는 ${ac}. ∠BAD와 ∠DAC에 같은 각 표시`),
        explain: `각의 이등분선의 성질에 의하여 ${nb(SG('BD') + ' : ' + SG('DC') + ' = ' + ab + ' : ' + ac)}이므로 ${eqh(SG('BD'), bd)}이다. 삼각형 ABC에서 코사인법칙에 의하여 ${cosH(vB)} = ${frac(ab + sup(2) + ' + ' + bc + sup(2) + ' − ' + ac + sup(2), '2 × ' + ab + ' × ' + bc)} = ${sh(cosB)}이다. 삼각형 ABD에서 ${sqH(SG('AD'))} = ${ab}${sup(2)} + ${bd}${sup(2)} − 2 × ${ab} × ${bd} × ${cosB[0].nv < 0 ? '(' + sh(cosB) + ')' : sh(cosB)} = ${sh(ad2)}이므로 AD의 길이는 ${sh(AD)}이다.`
      });
    }, { count: 2 }),
    T('cosuse-para-diag', '평행사변형의 두 대각선의 길이의 제곱의 합 구하기', '①28', (d) => {
      const z = d.until(() => ({ p: d.int(2, 9), q: d.int(2, 9) }), (y) => y.p !== y.q);
      const { p, q } = z, ans = 2 * (p * p + q * q);
      const Bm = [0, 0], Cm = [q, 0], Am = polar(Bm, p, 68), Dm = [Am[0] + q, Am[1]];
      const f = pic({ A: Am, B: Bm, C: Cm, D: Dm }, { polys: [['A', 'B', 'C', 'D']], segs: [['A', 'C'], ['B', 'D']], sides: [['A', 'B', String(p), 'C'], ['B', 'C', String(q), 'A']], size: [190, 100] });
      const x = V('x'), y = V('y');
      return seal(N(`그림과 같이 이웃한 두 변의 길이가 각각 ${p}, ${q}인 평행사변형 ABCD에서 두 대각선의 길이를 각각 ${x}, ${y}라 할 때, ${nb(x + sup(2) + ' + ' + y + sup(2))}의 값은?`, ans, {
        figure: f.b.svg(`평행사변형 ABCD와 두 대각선 AC, BD. AB의 길이는 ${p}, BC의 길이는 ${q}`),
        explain: `${eqh('∠ABC', V('θ'))}라 하면 삼각형 ABC에서 ${nb(x + sup(2) + ' = ' + p + sup(2) + ' + ' + q + sup(2) + ' − 2 × ' + p + ' × ' + q + ' × ' + cosH(V('θ')))}이고, ${nb('∠BCD = 180° − ' + V('θ'))}이므로 삼각형 BCD에서 ${nb(y + sup(2) + ' = ' + q + sup(2) + ' + ' + p + sup(2) + ' − 2 × ' + q + ' × ' + p + ' × ' + cosH('(180° − ' + V('θ') + ')'))} = ${nb(q + sup(2) + ' + ' + p + sup(2) + ' + 2 × ' + q + ' × ' + p + ' × ' + cosH(V('θ')))}이다. 두 식을 더하면 ${nb(x + sup(2) + ' + ' + y + sup(2))} = 2(${p}${sup(2)} + ${q}${sup(2)}) = ${ans}이다.`,
        facts: { calc: [[`2*(${p}*${p}+${q}*${q})`, 0]] }
      }));
    }),
    T('cosuse-diameter', '원의 지름과 원 위의 점으로 중심각의 cos 값 구하기', '①29', (d, n) => {
      // AB 는 지름(길이² = A2), AP = p → BP² = A2 − p², 반지름² = A2/4, cos(∠POB) = 1 − BP²/(2r²) = (2p² − A2)/A2
      const z = d.until(() => { const kind = d.pick([1, 1, 2, 3, 5]), k = d.int(1, 6), A2 = k * k * kind; return { A2, kind, k, p: d.int(1, 9) }; }, (y) => {
        const v = 2 * y.p * y.p - y.A2; return y.p * y.p < y.A2 && v !== 0 && v % y.A2 !== 0 && Math.abs(v) / y.A2 < 0.93 && y.A2 >= 8;
      });
      const { A2, kind, k, p } = z, ABv = KR(k, kind), v = KF(2 * p * p - A2, A2), BP2 = A2 - p * p;
      const th0 = Math.acos(p / Math.sqrt(A2)) / RAD;   // ∠PAB(∠POB 는 그 두 배)
      const mdl = { O: [0, 0], A: [-1, 0], B: [1, 0], P: onC(2 * th0) };
      const f = pic(mdl, { circle: ['O', 1], polys: [['A', 'B', 'P']], segs: [['O', 'P']], angs: n === 1 ? [['A', 'B', 'P', sv('θ'), { r: 24 }]] : [], names: ['O', 'A', 'B', 'P'], nameAt: { A: 180, B: 0, P: 2 * th0, O: 270 }, size: [150, 150] });
      f.b.dot(f.P.O);
      const head = `그림과 같이 중심이 O이고 ${eqh(SG('AB'), sh(ABv))}인 선분 AB를 지름으로 하는 원 위에 점 P가 있다. ${eqh(SG('AP'), p)}`;
      const tell = `선분 AB는 지름이므로 ${eqh('∠APB', '90°')}이고 ${sqH(SG('BP'))} = ${sqH(pq(ABv))} − ${p}${sup(2)} = ${BP2}이다. 삼각형 POB에서 ${sqH(SG('OP'))} = ${sqH(SG('OB'))} = ${sh(KF(A2, 4))}이므로 코사인법칙에 의하여`;
      if (n === 0) {
        return aQ(`${head}일 때, ${cosH('(∠POB)')}의 값은?`, v, {
          signed: true, figure: f.b.svg(`중심이 O인 원과 지름 AB, 원 위의 점 P, 선분 AP, PB, OP. AB의 길이는 ${plainV(ABv)}, AP의 길이는 ${p}`),
          explain: `${tell} ${cosH('(∠POB)')} = ${frac(sh(KF(A2, 4)) + ' + ' + sh(KF(A2, 4)) + ' − ' + BP2, '2 × ' + sh(KF(A2, 4)))} = ${sh(v)}이다.`,
          facts: { value: `(2*${p}*${p}-${A2})/${A2}` }
        });
      }
      const th = V('θ');
      return aQ(`${head}이고 ${eqh('∠PAB', th)}일 때, ${cosH('2' + th)}의 값은?`, v, {
        signed: true, figure: f.b.svg(`중심이 O인 원과 지름 AB, 원 위의 점 P, 선분 AP, PB, OP. AB의 길이는 ${plainV(ABv)}, AP의 길이는 ${p}, ∠PAB = θ`),
        explain: `∠POB는 호 PB에 대한 중심각이므로 ${nb('∠POB = 2∠PAB = 2' + th)}이다. ${tell} ${cosH('2' + th)} = ${frac(sh(KF(A2, 4)) + ' + ' + sh(KF(A2, 4)) + ' − ' + BP2, '2 × ' + sh(KF(A2, 4)))} = ${sh(v)}이다.`,
        facts: { value: `(2*${p}*${p}-${A2})/${A2}` }
      });
    }, { count: 2 }),
    T('cosuse-box', '직육면체 속 삼각형의 cos 값 구하기', '①30', (d) => {
      // 윗면 ABCD, 아랫면 EFGH. AB = x(앞뒤), AD = y(좌우), BF = z(높이). I 는 BC 위(BI : IC = m : n). cos(∠IGD) = z²/(IG·GD)
      const z = d.until(() => { const [m, n] = d.pick([[1, 3], [1, 2], [2, 1], [1, 1], [3, 1]]); return { m, n, x: d.int(3, 20), y: (m + n) * d.int(1, 8), h: d.int(3, 16) }; }, (q) => {
        const ic = q.y * q.n / (q.m + q.n), ig = Math.sqrt(ic * ic + q.h * q.h), gd = Math.sqrt(q.h * q.h + q.x * q.x);
        return Number.isInteger(ic) && Number.isInteger(ig) && Number.isInteger(gd) && q.y <= 24 && q.x <= 20 && q.h * q.h % (ig * gd) !== 0 && q.x >= 0.5 * q.y && q.x <= 1.3 * q.y && q.h >= 0.45 * q.y && q.h <= 1.3 * q.y;
      });
      const { m, n, x, y, h } = z, ic = y * n / (m + n), ig = Math.sqrt(ic * ic + h * h), gd = Math.sqrt(h * h + x * x), id2 = ic * ic + x * x, v = KF(h * h, ig * gd);
      const u = Math.min(30, 230 / (y + 0.55 * x)), S = space({ u });
      S.box([0, 0, 0], [x, y, h], ['E', 'F', 'G', 'H', 'A', 'B', 'C', 'D']);
      const I = [x, y * m / (m + n), h];
      S.seg(I, [x, y, 0]).seg([x, y, 0], [0, y, h]).seg(I, [0, y, h]).dot(I, 'I', 100);
      // ∠IGD 의 글: G 에서 I 쪽과 D 쪽으로 같은 길이만큼 간 곳의 가운데
      const toward = (p, k) => { const L0 = Math.hypot(p[0] - x, p[1] - y, p[2]); return [(p[0] - x) / L0 * k, (p[1] - y) / L0 * k, p[2] / L0 * k]; };
      const tI = toward(I, 1), tD = toward([0, y, h], 1), mk = Math.min(h, x) * 0.42;
      S.text([x + (tI[0] + tD[0]) * mk, y + (tI[1] + tD[1]) * mk, (tI[2] + tD[2]) * mk], sv('θ'), { blue: true });
      const figure = S.svg(`직육면체 ABCD-EFGH(윗면 ABCD, 아랫면 EFGH, 모서리 AE, BF, CG, DH). AB의 길이는 ${x}, AD의 길이는 ${y}, BF의 길이는 ${h}. 점 I는 모서리 BC 위에 있고 선분 IG, GD, DI가 그어져 있다. ∠IGD = θ`);
      const th = V('θ');
      return aQ(`그림과 같은 직육면체 ABCD-EFGH에서 ${eqh(SG('AB'), x)}, ${eqh(SG('AD'), y)}, ${eqh(SG('BF'), h)}이고, 점 I는 모서리 BC를 ${nb(m + ' : ' + n + tail(n, '으로/로'))} 내분하는 점이다. ${eqh('∠IGD', th)}일 때, ${cosH(th)}의 값은?`, v, {
        signed: true, figure,
        explain: `${eqh(SG('IC'), y + ' × ' + frac(n, m + n))} = ${ic}이므로 ${eqh(SG('IG'), rt(ic + sup(2) + ' + ' + h + sup(2)))} = ${ig}, ${eqh(SG('GD'), rt(h + sup(2) + ' + ' + x + sup(2)))} = ${gd}, ${sqH(SG('ID'))} = ${ic}${sup(2)} + ${x}${sup(2)} = ${id2}이다. 삼각형 IGD에서 코사인법칙에 의하여 ${cosH(th)} = ${frac(ig + sup(2) + ' + ' + gd + sup(2) + ' − ' + id2, '2 × ' + ig + ' × ' + gd)} = ${sh(v)}이다.`,
        facts: { value: `${h}*${h}/(((${y}*${n}/(${m}+${n}))**2+${h}*${h})**0.5*(${h}*${h}+${x}*${x})**0.5)` }
      });
    }),
    T('cosuse-cone', '원뿔의 옆면을 따라 감은 실의 최소 길이 구하기', '①31', (d) => {
      // 밑면의 반지름 r, 모선 l(l = 3r 또는 6r) → 전개도의 중심각 θ = 360° × r/l, A 에서 모선 OA 위의 점 P(OP = q)까지
      const z = d.until(() => { const k = d.pick([3, 6]), r = d.int(1, 4), l = k * r, part = d.pick([2, 3]); return { k, r, l, part, q: l / part }; }, (y) => {
        if (!Number.isInteger(y.q)) return false; const th = 360 / y.k, c2 = y.l * y.l + y.q * y.q - 2 * y.l * y.q * Math.cos(th * RAD); const v = Math.round(c2); if (Math.abs(c2 - v) > 1e-9) return false;
        try { return isK(sqrtV(K(v))); } catch (e) { return false; }
      });
      const { k, r, l, part, q } = z, th = 360 / k, c2 = Math.round(l * l + q * q - 2 * l * q * Math.cos(th * RAD)), ans = sqrtV(K(c2));
      // 원뿔 그림
      const b = Board(), O = [100, 10], Ap = [52, 150], Bp = [148, 150], rx = 48, ry = 13, Pp = mid(O, Ap, 1 / part);
      b.shape(`M${Ap[0]} ${Ap[1]}A${rx} ${ry} 0 0 0 ${Bp[0]} ${Bp[1]}`, [Ap, Bp, [100, 163]], 'fill:none');
      b.shape(`M${Ap[0]} ${Ap[1]}A${rx} ${ry} 0 0 1 ${Bp[0]} ${Bp[1]}`, [Ap, Bp, [100, 137]], 'fill:none;stroke-dasharray:4 3');
      b.seg(O, Ap).seg(O, Bp).seg(Ap, Bp, 'cut').dot(Pp).dot([100, 150], 1.8);
      b.text(at(O, 11, 90), 'O').text(at(Ap, 11, 200), 'A').text(at(Bp, 11, 340), 'B').text(at(Pp, 11, 180), 'P');
      const figure = b.svg(`원뿔. 꼭짓점 O, 밑면의 지름 AB, 모선 OA 위의 점 P. 밑면의 지름의 길이는 ${2 * r} cm, 모선의 길이는 ${l} cm`);
      const where = part === 2 ? '모선 OA의 중점 P' : `모선 OA 위의 점 P(${nb(SG('OP') + ' : ' + SG('PA') + ' = 1 : 2')})`;
      return aRad(`그림과 같이 밑면의 지름의 길이가 ${2 * r} cm이고 모선의 길이가 ${l} cm인 원뿔이 있다. 밑면의 둘레 위의 점 A에서 ${where}까지 원뿔의 옆면을 따라 한 바퀴 실을 감을 때, 필요한 실의 최소 길이는 몇 cm인가?`, ans, 'cm', {
        figure,
        explain: `원뿔의 옆면을 펼친 부채꼴의 반지름의 길이는 ${l} cm이고 호의 길이는 밑면의 둘레 ${2 * r}π cm이므로 중심각의 크기는 ${frac(2 * r + 'π', l)} = ${frac(2 + 'π', k)}, 곧 ${dg(th)}이다. 실의 최소 길이는 전개도에서 선분 AP의 길이이고 ${eqh(SG('OP'), q + ' cm')}이므로 코사인법칙에 의하여 ${sqH(SG('AP'))} = ${l}${sup(2)} + ${q}${sup(2)} − 2 × ${l} × ${q} × ${cosD(th)} = ${c2}이다. 따라서 ${L(ans, 'cm')}이다.`
      });
    }),
    T('cosuse-equi', '두 정삼각형의 꼭짓점 사이의 거리 구하기', '①32', (d) => {
      const z = d.until(() => ({ bc: d.int(4, 12), p: d.int(1, 6), q: d.int(1, 6) }), (y) => y.p !== y.q && (y.bc * y.p) % (y.p + y.q) === 0 && gcd(y.p, y.q) === 1);
      const { bc, p, q } = z, bd = bc * p / (p + q), dc = bc - bd, ans = bd * bd + dc * dc - bd * dc;
      const Bm = [0, 0], Cm = [bc, 0], Dm = [bd, 0], Am = [bc * 0.62, bc * 0.42], Em = polar(Bm, bd, -60), Fm = polar(Dm, dc, -60);
      const f = pic({ A: Am, B: Bm, C: Cm, D: Dm, E: Em, F: Fm }, { polys: [['A', 'B', 'C'], ['B', 'E', 'D'], ['D', 'F', 'C']], segs: [['A', 'D'], ['E', 'F']], nameAt: { A: 90, B: 180, C: 0, E: 270, F: 300 }, size: [200, 170] });
      return seal(N(`그림과 같이 ${eqh(SG('BC'), bc)}인 ${TRI}에서 삼각형 ABD와 삼각형 ADC의 넓이의 비가 ${nb(p + ' : ' + q + tail(q, '이/가'))} 되도록 변 BC 위에 점 D를 잡고, 선분 BD와 선분 DC를 각각 한 변으로 하는 두 정삼각형 BED와 DFC를 그렸다. ${nb(SG('EF') + sup(2))}의 값은?`, ans, {
        figure: f.b.svg(`삼각형 ABC와 변 BC 위의 점 D, BC 아래쪽에 그린 정삼각형 BED, DFC와 선분 EF. BC의 길이는 ${bc}`),
        explain: `두 삼각형 ABD, ADC는 높이가 같으므로 넓이의 비는 밑변의 길이의 비이다. 따라서 ${nb(SG('BD') + ' : ' + SG('DC') + ' = ' + p + ' : ' + q)}이고 ${eqh(SG('BD'), bd)}, ${eqh(SG('DC'), dc)}이다. ${nb('∠EDF = 180° − 60° − 60° = 60°')}이므로 삼각형 DEF에서 코사인법칙에 의하여 ${nb(SG('EF') + sup(2))} = ${bd}${sup(2)} + ${dc}${sup(2)} − 2 × ${bd} × ${dc} × ${cosD(60)} = ${ans}이다.`,
        facts: { calc: [[`(${bc}*${p}/(${p}+${q}))**2+(${bc}*${q}/(${p}+${q}))**2-(${bc}*${p}/(${p}+${q}))*(${bc}*${q}/(${p}+${q}))`, 0]] }
      }));
    })
  ];

  B.addUnit({
    id: '11-1-4', grade: 11, semester: 1, no: 4, title: '사인법칙과 코사인법칙', version: 1,
    groups: [
      { id: 'sine', title: '사인법칙', standard: STD, types: sineTypes },
      { id: 'sineuse', title: '사인법칙의 활용', standard: STD, types: sineUseTypes },
      { id: 'cosine', title: '코사인법칙', standard: STD, types: cosineTypes },
      { id: 'cosuse', title: '코사인법칙의 활용', standard: STD, types: cosUseTypes },
      { id: 'shape', title: '삼각형의 모양', standard: STD, types: [] },
      { id: 'area', title: '삼각형의 넓이', standard: STD, types: [] },
      { id: 'quad', title: '사각형의 넓이와 넓이의 활용', standard: STD, types: [] }
    ]
  });

  B.kit.u14x = {
    UNIT, STD, T, ONE, ONE_FR, w, tm, K, KR, KF, add, neg, sbt, mul, inv1, div, sqrtV, sq, fv, same, isK, isRF, isInt, isRat, isSum, half, SIN, COS, SPECIAL,
    termH, sh, lastNum, sj, L, plainV, sqH, pq, pm, vA, vB, vC, va, vb, vc, vR, vS, AV, SVv, eqh, dg, sinH, cosH, sinD, cosD, TRI, others,
    calcOf, seal, un, more, aRad, aRadFr, aSum, aInt, aQ, aDeg, aRatio, pickNum, angleQ, angOfCos, GA, bogi, setsQ,
    lay, radAt, sideLab, lab, pic, polar, onC, outward, sssABC, angABC, ENDS, givenSides, givenAngles, r2, roundInt, tailDec
  };
})(typeof window !== 'undefined' ? window : globalThis);
