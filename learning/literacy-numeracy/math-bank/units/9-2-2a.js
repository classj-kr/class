// 중학교 3학년 2학기 2단원 삼각비의 활용 — 단원 틀·도구와 앞쪽 묶음(직각삼각형의 변의 길이, 일반 삼각형의 변의 길이, 높이와 거리).
// 수집해 둔 미래엔 2015(황선욱) 한 종의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 61꼴, 심화꼴 26꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 뺌(까닭) / 겹침」을 가른 대조표는 references/textbooks/수학/_분석/9-2-2/싣기_대조표.md 에 있다.
// (삼각형의 넓이·사각형의 넓이·넓이의 활용 묶음은 9-2-2b.js 에, 실력 문항은 9-2-2c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
// 영역은 도형과 측정. 성취기준은 9수03-17(삼각비를 활용하여 여러 가지 문제를 해결할 수 있다)이다.
// 해설: 「삼각비를 활용하여 직접 측정하기 어려운 거리나 높이 등을 구해 보는 활동을 통해 유용성을 인식하고 흥미를 느낄 수 있게 한다.」
// 고려 사항: 「삼각비 사이의 관계는 다루지 않는다.」「삼각비의 값은 0°에서 90°까지의 각도에 대한 것만 다룬다.」
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(빗변·한 변·두 변과 끼인각·두 각과 한 변·넓이·삼각비의 근삿값), 묻는 것(변·높이·넓이·각·식 고르기),
//    푸는 길(곱하기 / 나누기 / 수선을 그어 / 두 지점의 두 각으로 식 세우기 / 넓이를 거꾸로)이 다르면 따로 싣는다. 수만 다르거나 상황(탑·나무·연)만 다른 것은 한 유형이다.
//  - 특수각(30°, 45°, 60°)의 삼각비는 값을 쓰고, 그 밖의 각은 문제 글에 근삿값(소수 둘째 자리)을 준다. 삼각비의 표를 읽는 문항은 싣지 않는다(값을 글로 준다).
//    90°보다 큰 각은 180°에서 뺀 각의 삼각비로만 다룬다(풀이도 sin(180° − A)로 적는다). 삼각비 사이의 관계 식(sin² + cos² = 1, tan = sin/cos)은 쓰지 않는다 —
//    cos B = 4/5 처럼 값 하나를 주는 문항은 직각삼각형을 그려 다른 변을 구한다.
//  - 답의 꼴: 자연수(N), 분수(F, 크기가 같은 분수도 받는다), 소수(D — 주어진 근삿값으로 셈한 것, 소수 첫째 자리까지. 반올림하라는 문항은 반올림한 값),
//    k√m(「[ ]√[ ] 단위」 — 근호 앞의 수가 1이면 1을 적는다), a + b√c(「[±][ ] [±][ ]√[ ] 단위」 — 두 칸 모두 부호 단추), aπ + b√c(넓이),
//    그 밖의 꼴(계수가 분수인 두 항, 세 항, 삼각비가 든 식, 문자식)은 고르기로 낸다. 한 유형 안에서는 칸의 모양이 늘 같도록 수를 고른다(k√m 유형은 늘 근호가 남고, a + b√c 유형은 늘 두 항).
//  - 그림은 수치대로 그린다(코드가 길이와 각에서 좌표를 셈한다). 그림 속 근호는 글자 √ 와 그 뒤 수 위의 가는 줄로 그린다. 그림 설명(aria-label)에는 그림에 적힌 것을 말로 적는다.
//  - 답은 모두 코드가 셈한다. 근호가 든 값은 항의 배열로 셈하고, 계수마다 문제의 수로 셈하는 식 글을 함께 지어 facts.calc 에 넣는다(검사가 따로 셈한다).
//  - 꼴 목록에 적힌 원문 답지의 잘못(중03의 서로 맞지 않는 근삿값, 표15 풀이의 각 따위)은 따르지 않는다.
//
// 뺀 것과 까닭(9-2-2b.js, 9-2-2c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 활동: 경사계로 학교 건물의 높이 재기(①60 — 재어 표에 적는 활동, 잰 값으로 높이를 구하는 일은 ①6으로 실었다),
//    테셀레이션 마름모(①61 — 타일링 그림에서 각을 찾는 활동이고 넓이는 sin 72°·sin 36°의 표 값).
//  - 중2에 있는 일: 정사각뿔의 단면(심22 — 정삼각형의 높이와 피타고라스 정리로 다 풀리고 삼각비가 하는 일이 없다).
//  - 그림을 알 수 없는 것: 폭포를 높은 건너편 언덕에서 볼 때(①59의 (3) — 각을 잰 기준선을 쪽 그림에서 알 수 없다).
//  - 같은 일(겹침): ①27(높이를 구한 뒤 넓이 — tri-height 와 area-sas), 심5·6·7·13·19·20·21·24(기본 유형과 같은 일).
//    기본과 실력에 같은 일을 두지 않았다: ①25의 둔각판(지소1 01)은 심1과 함께 실력에, ①32와 심15는 실력 한 유형(hard-aas-area)에, ①48과 심13도 실력 한 유형에.
//  - 그림 때문에 좁힌 수: 둔각 끼인각 150°(①18 중04·①28 교확03(2)) — 삼각형이 너무 납작해 각의 글이 맞은편 변에 걸리므로 같은 일을 120°·135°로 묻는다.
//    입체 실력(심4)의 ∠ABH 45°·∠AHB 60° 꼴 — 그림의 각 글이 겹쳐 60°·45° 꼴로만 묻는다. 원뿔(심12)은 ∠ABH 대신 같은 일을 하는 ∠BAH 를 준다.
//  - 실력으로 보낸 기본 꼴: 기본 문서에 한 번 나오고 네 단계 넘게 잇는 ①32·①33·①46·①48.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」 길이는 띄어 적는다(6 cm). 삼각비는 sin A, cos 30°, tan x° 로 적는다(sin·cos·tan 은 세운 글자).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, N, C, F, D, inline } = B.kit;
  const { MINUS, gcd, V, sup, nb, SG, tail, rt, grp, sqParts } = B.kit.mid;
  const { RAD, at, dirOf, dist, mid, textW, sv, TINT, Board } = B.kit.mgeo;
  const STD = '9수03-17';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: (/①/.test(ref) ? '수집본 기본 자료(' : '수집본 심화 자료(') + ref + ')', make }, more || {});
  const ONE = '(근호 앞의 수가 1이면 1을 적는다.)';

  // ── 근호가 든 수 ──
  // 값은 항의 배열이다. 항 { m 근호 안(제곱인 수를 인수로 갖지 않는 자연수 — 유리수 항은 1), nv/dv 계수(기약분수, dv > 0),
  //  n·d 계수의 분자·분모를 문제의 수로 셈하는 식 글 }. 식 글은 정수끼리 더하고 곱하며, 나누기는 나누어떨어질 때만 쓴다(검사가 셈해도 값이 꼭 맞다).
  //  근호를 벗길 때만 (…)**0.5 를 쓴다(늘 제곱수의 제곱근이다).
  const w = (s) => (/^\d+$/.test(s) ? s : '(' + s + ')');
  function tm(m, nv, dv, n, d) {
    if (dv < 0) { nv = -nv; dv = -dv; n = '-' + w(n); d = '-' + w(d); }
    const g = gcd(Math.abs(nv), dv);
    if (g > 1) { nv /= g; dv /= g; n = w(n) + '/' + g; d = w(d) + '/' + g; }
    return { m, nv, dv, n, d };
  }
  // 문제에 적힌 수: 정수 k, k√m
  const K = (k) => [tm(1, k, 1, String(k), '1')];
  const KR = (k, m) => (m === 1 ? K(k) : [tm(m, k, 1, String(k), '1')]);
  const ZERO = [];
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
  const sub = (A, Bv) => add(A, neg(Bv));
  function mul(A, Bv) {
    let out = [];
    for (const a of A) for (const b of Bv) {
      const [s, m] = sqParts(a.m * b.m);
      const n = s === 1 ? `${w(a.n)}*${w(b.n)}` : `${w(a.n)}*${w(b.n)}*(${a.m}*${b.m}/${m})**0.5`;
      out = add(out, [tm(m, a.nv * b.nv * s, a.dv * b.dv, n, `${w(a.d)}*${w(b.d)}`)]);
    }
    return out;
  }
  // 1 ÷ (q√m) = √m ÷ (q × m)
  const inv1 = (t) => tm(t.m, t.dv, t.nv * t.m, t.d, t.m === 1 ? t.n : `${w(t.n)}*${t.m}`);
  function div(A, Bv) {
    if (Bv.length === 1) return mul(A, [inv1(Bv[0])]);
    // 유리수 + 근호 한 종류: 켤레를 곱한다(분모의 유리화)
    if (Bv.length !== 2 || Bv[0].m !== 1) throw new Error('이 꼴의 수로는 나누지 않는다');
    const conj = [Bv[0], neg([Bv[1]])[0]], top = mul(A, conj), bottom = mul(Bv, conj);
    if (bottom.length !== 1 || bottom[0].m !== 1) throw new Error('유리화가 안 된다');
    return mul(top, [inv1(bottom[0])]);
  }
  // 유리수 하나의 양의 제곱근
  function sqrtV(A) {
    if (A.length !== 1 || A[0].m !== 1 || A[0].nv <= 0) throw new Error('제곱근을 구할 수 없는 수');
    const t = A[0], [s, m] = sqParts(t.nv * t.dv);
    return [tm(m, s, t.dv, `(${w(t.n)}*${w(t.d)}/${m})**0.5`, t.d)];
  }
  const sq = (A) => mul(A, A);
  const fv = (A) => A.reduce((s, t) => s + t.nv / t.dv * Math.sqrt(t.m), 0);
  const same = (A, Bv) => A.length === Bv.length && A.every((t) => Bv.some((u) => u.m === t.m && u.nv === t.nv && u.dv === t.dv));
  const isK = (A) => A.length === 1 && A[0].m > 1 && A[0].dv === 1 && A[0].nv >= 1;   // k√m (k 자연수)
  const isInt = (A) => A.length === 1 && A[0].m === 1 && A[0].dv === 1;
  const isSum = (A) => A.length === 2 && A[0].m === 1 && A[1].m > 1 && A[0].dv === 1 && A[1].dv === 1;   // a + b√c (a, b 정수)
  const coef = (A, m) => { const t = A.find((u) => u.m === m); return t ? t.nv / t.dv : 0; };
  // 특수각의 삼각비
  const half = (m) => [tm(m, 1, 2, '1', '2')];
  const SIN = { 30: half(1), 45: half(2), 60: half(3), 90: K(1) };
  const COS = { 30: half(3), 45: half(2), 60: half(1), 0: K(1) };
  const TAN = { 30: [tm(3, 1, 3, '1', '3')], 45: K(1), 60: KR(1, 3) };

  // ── 값의 글 ──
  // 항 하나의 크기: 3√2, √3, 3√3/2(근호까지 분자에), 5/2
  function termH(t) {
    const a = Math.abs(t.nv), top = t.m === 1 ? String(a) : (a === 1 ? '' : a) + rt(t.m);
    return t.dv === 1 ? top : frac(top, t.dv);
  }
  // 값의 글: 앞에는 양수인 항을 둔다(5√3 − 5). 0이면 0.
  function sh(A) {
    if (!A.length) return '0';
    const list = A.slice().sort((x, y) => x.m - y.m);
    if (list[0].nv < 0) { const k = list.findIndex((t) => t.nv > 0); if (k > 0) list.unshift(list.splice(k, 1)[0]); }
    return nb(list.map((t, i) => (i === 0 ? (t.nv < 0 ? MINUS : '') : t.nv < 0 ? ' ' + MINUS + ' ' : ' + ') + termH(t)).join(''));
  }
  // 토씨: 읽을 때 끝에 오는 수(근호 안의 수, 분수는 분자)
  const lastNum = (A) => { const t = A[A.length - 1]; return t.m > 1 ? t.m : Math.abs(t.nv); };
  const sj = (A, pair) => nb(sh(A) + tail(lastNum(A), pair));
  const L = (A, unit) => nb(sh(A) + (unit ? ' ' + unit : ''));
  // 그림 설명에 적는 글(근호는 √ 글자로)
  function plainV(A) {
    const list = A.slice().sort((x, y) => x.m - y.m);
    if (list[0].nv < 0) { const k = list.findIndex((t) => t.nv > 0); if (k > 0) list.unshift(list.splice(k, 1)[0]); }
    return list.map((t, i) => { const a = Math.abs(t.nv), top = t.m === 1 ? String(a) : (a === 1 ? '' : a) + '√' + t.m; return (i === 0 ? (t.nv < 0 ? '−' : '') : t.nv < 0 ? ' − ' : ' + ') + (t.dv === 1 ? top : top + '/' + t.dv); }).join('');
  }
  const sqH = (h) => nb(h + sup(2));
  const pq = (A) => (A.length === 1 && A[0].m === 1 && A[0].dv === 1 && A[0].nv > 0 ? sh(A) : '(' + sh(A) + ')');   // 제곱할 때 괄호(자연수만 그대로)
  const fn = (f, a) => nb(f + ' ' + a + '°');   // sin 30°
  const angH = (v, a) => nb('∠' + v + ' = ' + a + '°');
  const segEq = (s, A, unit) => nb(SG(s) + ' = ' + L(A, unit));

  // ── 검사 근거 ──
  const calcOf = (t) => (t.d === '1' ? w(t.n) : `${w(t.n)}/${w(t.d)}`);
  const stripH = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  // 문제(글·그림·보기)에 숫자로 적히지 않은 수(삼각비의 2·3, 제곱근을 벗기는 0.5 따위)를 facts.unseen 에 밝힌다(검사와 같은 길로 읽는다).
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
  // 분수(자연수가 아닌 양의 유리수, 크기가 같은 분수를 모두 받는다)
  function aFr(text, A, unit, o) {
    if (A.length !== 1 || A[0].m !== 1 || A[0].dv === 1 || A[0].nv < 1) throw new Error('분수가 아니다: ' + plainV(A));
    const t = A[0];
    return seal(F(text, t.nv, t.dv, Object.assign(more(o, { value: calcOf(t) }), { unit, improper: t.nv > t.dv, anyForm: true })));
  }
  // aπ + b√c(넓이): 「[ ]π [±][ ]√[ ] 단위」. pi 는 π의 계수(값), rest 는 근호 항(값)
  function aPi(text, pi, rest, unit, o) {
    if (!isInt(pi) || pi[0].nv < 1 || rest.length !== 1 || rest[0].m < 2 || rest[0].dv !== 1) throw new Error('aπ + b√c 꼴이 아니다');
    const t = rest[0];
    return seal(inline(text + ' ' + ONE, grp('{0}π') + ' ' + grp('{1}' + rt('{2}') + un(unit)), [{ answer: pi[0].nv }, { answer: t.nv, signed: true }, { answer: t.m }],
      Object.assign(more(o, { calc: [[calcOf(pi[0]), 0], [calcOf(t), 1], [String(t.m), 2]] }), { shown: nb(sh(pi) + 'π ' + (t.nv < 0 ? MINUS : '+') + ' ' + termH(t) + un(unit)) })));
  }
  // 근삿값(소수 첫째 자리): expr 는 문제의 수로 셈하는 식 글
  function aDec(text, value, expr, unit, o) {
    const v = Math.round(value * 10) / 10;
    if (Number.isInteger(v) || v <= 0 || v >= 100 || Math.abs(v - value) > 1e-6) throw new Error('소수 첫째 자리 답이 아니다: ' + value);
    return seal(D(text, v, Object.assign(more(o, { calc: [[expr, 0]] }), { unit })));
  }
  // 반올림하여 소수 첫째 자리까지: 식 글 x 를 반올림하는 식
  const roundExpr = (x) => `((${x})*10+0.5-((${x})*10+0.5)%1)/10`;
  // 고르기: 보기(값의 배열) 가운데 정답이 하나뿐이다. 보기는 화면 글이 서로 다르고 값도 서로 다르다.
  function pickV(d, text, right, wrongs, o) {
    const pool = [right];
    for (const x of wrongs) if (pool.length < 5 && !pool.some((p) => same(p, x) || Math.abs(fv(p) - fv(x)) < 1e-9)) pool.push(x);
    if (pool.length < 4) throw new Error('보기가 모자란다');
    const rows = d.shuffle(pool), shown = rows.map((r) => (o.show ? o.show(r) : sh(r)));
    if (new Set(shown).size !== shown.length) throw new Error('보기 글이 겹친다');
    return seal(C(text, shown, rows.findIndex((r) => same(r, right)), more(o, { truth: rows.map((r) => same(r, right)), want: true })));
  }
  // 고르기: 보기마다 실제 값(수)을 셈해 참·거짓을 가른다. opts [{ h 글, v 값 }], target 맞는 값
  function pickNum(d, text, opts, target, o) {
    const truth = opts.map((x) => Math.abs(x.v - target) < 1e-9 * Math.max(1, Math.abs(target)));
    if (truth.filter(Boolean).length !== 1) throw new Error('맞는 보기가 하나가 아니다');
    for (let i = 0; i < opts.length; i += 1) for (let j = i + 1; j < opts.length; j += 1) if (Math.abs(opts[i].v - opts[j].v) < 1e-9 || opts[i].h === opts[j].h) throw new Error('보기 값이 겹친다');
    const rows = d.shuffle(opts.map((x, i) => [x, truth[i]]));
    return C(text, rows.map((r) => r[0].h), rows.findIndex((r) => r[1]), more(o, { truth: rows.map((r) => r[1]), want: true }));
  }

  // ── 주어진 근삿값 ──
  // 특수각이 아닌 각의 삼각비를 소수 둘째 자리까지(문제 글에 준다)
  const r2 = (v) => Math.round(v * 100) / 100;
  const tv = (a) => ({ s: r2(Math.sin(a * RAD)), c: r2(Math.cos(a * RAD)), t: r2(Math.tan(a * RAD)) });
  const tailOf = (x, pair) => tail(Number(String(x).slice(-1)), pair);
  // 「(단, sin 55° = 0.82, cos 55° = 0.57, tan 55° = 1.43으로 계산한다.)」 which: 'sct' 의 일부
  function given(a, which, vals) {
    const v = vals || tv(a), name = { s: 'sin', c: 'cos', t: 'tan' }, list = which.split('').map((k) => fn(name[k], a) + ' = ' + v[k]);
    const last = v[which[which.length - 1]];
    return `(단, ${list.join(', ')}${tailOf(last, '으로/로')} 계산한다.)`;
  }
  const odd = (a) => ![30, 45, 60].includes(a);

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
  // 선분 p–q 옆의 글(beside 와 같은 자리). lab: 글 또는 [k, m, 단위](k√m)
  function sideLab(b, p, q, lab, inside, opt) {
    if (!Array.isArray(lab) && opt && opt.dim) return b.dim(p, q, lab, inside, opt.dim);
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
  //  rights [[꼭짓점, p, q], …] 직각 표시, angs [[꼭짓점, p, q, 글, 선택], …] 각, sides [[p, q, 글, 안쪽(이름이나 점)], …] 변 옆 글,
  //  names 이름을 적을 점(주지 않으면 이름이 한 글자인 점 모두), nameAt { 이름: 도 }, size [가로, 세로]
  function pic(model, o) {
    const P = lay(model, o.size || [200, 130]), b = Board(), adj = {};
    const link = (p, q) => { (adj[p] = adj[p] || []).push(q); (adj[q] = adj[q] || []).push(p); };
    (o.polys || []).forEach((pl, i) => { b.poly(pl.map((n) => P[n]), (o.fills || [])[i]); pl.forEach((n, j) => link(n, pl[(j + 1) % pl.length])); });
    if (o.draw) o.draw(b, P);
    for (const [p, q] of o.segs || []) { b.seg(P[p], P[q]); link(p, q); }
    for (const [p, q] of o.cuts || []) { b.seg(P[p], P[q], 'cut'); link(p, q); }
    for (const [p, q] of o.thins || []) { b.seg(P[p], P[q], 'thin'); link(p, q); }
    for (const [p, q, n] of o.ticks || []) b.tick(P[p], P[q], n);
    for (const [v, p, q] of o.rights || []) b.corner(P[v], P[p], P[q], '');
    for (const [v, p, q, label, op] of o.angs || []) b.corner(P[v], P[p], P[q], label, op);
    const first = (o.polys || [])[0] || Object.keys(model), cen = [first.reduce((s, n) => s + P[n][0], 0) / first.length, first.reduce((s, n) => s + P[n][1], 0) / first.length];
    for (const [p, q, label, inside, op] of o.sides || []) sideLab(b, P[p], P[q], label, typeof inside === 'string' ? P[inside] : inside || cen, op);
    if (o.after) o.after(b, P);
    const names = o.names || Object.keys(model).filter((k) => /^[A-Z]$/.test(k));
    for (const n of names) {
      if (o.nameAt && o.nameAt[n] != null) b.name(P[n], n, o.nameAt[n]);
      else if (adj[n]) b.nameFree(P[n], n, adj[n].map((q) => dirOf(P[n], P[q])));
      else b.name(P[n], n, 90);
    }
    return { b, P };
  }
  const cm = (v) => v + ' cm', mt = (v) => v + ' m';
  const pt = (x, y) => [x, y];
  const polar = (p, r, a) => [p[0] + r * Math.cos(a * RAD), p[1] + r * Math.sin(a * RAD)];   // 모형 좌표(y 위로)
  // 직각삼각형 ABC(∠C = 90°, 밑변 AC 가 가로, B 가 위): ∠A = a°, 빗변 c
  const rightABC = (a, c) => ({ A: [0, 0], C: [c * Math.cos(a * RAD), 0], B: [c * Math.cos(a * RAD), c * Math.sin(a * RAD)] });
  // △ABC(B 왼쪽 아래, C 오른쪽 아래, A 위): BC = a, AB = c, ∠B = b°
  const sasABC = (a, c, bAng) => ({ B: [0, 0], C: [a, 0], A: polar([0, 0], c, bAng) });
  // 두 각과 밑변: BC = a, ∠B = b°, ∠C = c°
  // 땅 위의 점(x, y)을 rot° 돌리고 깊이를 0.6배로 줄인 화면 모형 좌표, z 는 높이
  // 땅 위의 점(x, y)을 rot° 돌리고 깊이를 0.6배로 줄여 비스듬히 본 화면 모형 좌표. 높이 z 는 zs 배로 그린다
  // (높이가 땅보다 훨씬 길면 땅의 삼각형이 보이지 않아 줄여 그릴 때가 있다 — 비스듬히 본 그림이라 원래 길이대로 재는 그림이 아니다).
  // 올려본각을 재는 선(지면 위의 선분)이 화면에서 눕도록 돌려, 그 선과 높이 쪽 선 사이의 각 글이 들어갈 자리를 만든다.
  const ground = (rot, zs) => (x, y, z) => { const c = Math.cos(rot * RAD), s = Math.sin(rot * RAD); return [x * c - y * s, 0.6 * (x * s + y * c) + (zs == null ? 1 : zs) * (z || 0)]; };
  function aaB(a, bAng, cAng) { const h = a * Math.sin(bAng * RAD) * Math.sin(cAng * RAD) / Math.sin((bAng + cAng) * RAD); return { B: [0, 0], C: [a, 0], A: [h / Math.tan(bAng * RAD), h] }; }

  // ── 묶음 1: 직각삼각형의 변의 길이 ──
  const sideTypes = [
    T('right-express', '직각삼각형의 변을 삼각비로 나타낸 식 고르기', '①1', (d, n) => {
      if (n === 2) {
        // △ABC 의 높이 AH 를 c 에 대한 식으로(∠B 는 특수각)
        const beta = d.pick([30, 45, 60]), a = d.pick([1.5, 1.7, 1.9]);
        const pool = [[1, 1, 2], [1, 2, 2], [1, 3, 2], [1, 3, 3], [1, 3, 1], [1, 2, 1], [2, 1, 1]];
        const right = { 30: [1, 1, 2], 45: [1, 2, 2], 60: [1, 3, 2] }[beta];
        const rows = [right].concat(d.shuffle(pool.filter((p) => p.join() !== right.join())).slice(0, 4));
        const coefH = (p) => (p[2] === 1 ? (p[0] === 1 && p[1] !== 1 ? '' : String(p[0])) + (p[1] === 1 ? '' : rt(p[1])) : frac(p[1] === 1 ? String(p[0]) : (p[0] === 1 ? '' : p[0]) + rt(p[1]), p[2]));
        const opts = rows.map((p) => ({ h: nb(coefH(p) + V('c')), v: p[0] * Math.sqrt(p[1]) / p[2] }));
        const mdl = sasABC(a * 1.6, 1.6, beta), H = [mdl.A[0], 0];
        const f = pic(Object.assign({ H }, mdl), { polys: [['A', 'B', 'C']], segs: [['A', 'H']], rights: [['H', 'A', 'C']], angs: [['B', 'C', 'A', beta + '°']], sides: [['A', 'B', sv('c'), 'C']], size: [190, 110] });
        return pickNum(d, `그림과 같이 △ABC의 꼭짓점 A에서 변 BC에 내린 수선의 발을 H라 하자. ${SG('AB')} = ${V('c')}, ${angH('B', beta)}일 때, 높이 ${SG('AH')}의 길이를 ${V('c')}에 대한 식으로 나타낸 것은?`, opts, Math.sin(beta * RAD), {
          figure: f.b.svg(`△ABC. 꼭짓점 A에서 변 BC에 내린 수선의 발 H, AB의 길이는 c, ∠B = ${beta}°`),
          explain: `직각삼각형 ABH에서 ${fn('sin', beta)} = ${frac(SG('AH'), SG('AB'))}이므로 ${SG('AH')} = ${V('c')} ${fn('sin', beta)} = ${opts[0].h}이다.`
        });
      }
      // 직각삼각형 ABC(∠C = 90°): 한 예각 θ 와 한 변 → 다른 변을 나타낸 식
      const th = d.until(() => d.int(25, 65), odd), at = d.pick(['A', 'B']), g = d.int(4, 15);
      const mdl = rightABC(at === 'A' ? th : 90 - th, 1), other = at === 'A' ? 'B' : 'A';
      // 꼭짓점 at 에서 본 마주 보는 변·이웃한 변
      const opp = at === 'A' ? 'BC' : 'AC', adjS = at === 'A' ? 'AC' : 'BC';
      const R = (x) => x * Math.PI / 180, s = Math.sin(R(th)), c = Math.cos(R(th)), t = Math.tan(R(th));
      let givenS, ask, set, truth;
      if (n === 0) { givenS = 'AB'; ask = d.pick([opp, adjS]); set = [['×', 'sin'], ['×', 'cos'], ['×', 'tan'], ['÷', 'sin'], ['÷', 'cos']]; truth = ask === opp ? g * s : g * c; }
      else { givenS = d.pick([opp, adjS]); ask = givenS === opp ? adjS : opp; set = [['×', 'sin'], ['×', 'cos'], ['×', 'tan'], ['÷', 'sin'], ['÷', 'tan']]; truth = givenS === adjS ? g * t : g / t; }
      const val = { sin: s, cos: c, tan: t };
      const opts = set.map(([op, f]) => ({ h: op === '×' ? nb(`${g} ${f} ${th}°`) : frac(String(g), fn(f, th)), v: op === '×' ? g * val[f] : g / val[f] }));
      const inside = 'ABC'.split('').find((v) => !givenS.includes(v));
      const f = pic(mdl, { polys: [['A', 'C', 'B']], rights: [['C', 'A', 'B']], angs: [[at, 'C', other, th + '°']], sides: [[givenS[0], givenS[1], String(g), inside]], size: [190, 115] });
      const ratio = (S) => (S === opp ? (givenS === 'AB' ? 'sin' : 'tan') : 'cos');
      const how = n === 0 ? `${fn(ratio(ask), th)} = ${frac(SG(ask), SG('AB'))}이므로 ${SG(ask)} = ${g} ${fn(ratio(ask), th)}`
        : givenS === adjS ? `${fn('tan', th)} = ${frac(SG(ask), SG(givenS))}이므로 ${SG(ask)} = ${g} ${fn('tan', th)}` : `${fn('tan', th)} = ${frac(SG(givenS), SG(ask))}이므로 ${SG(ask)} = ${frac(String(g), fn('tan', th))}`;
      return pickNum(d, `그림과 같이 ∠C = 90°인 직각삼각형 ABC에서 ${SG(givenS)} = ${g}, ${angH(at, th)}일 때, ${SG(ask)}의 길이를 나타낸 것은?`, opts, truth, {
        figure: f.b.svg(`∠C = 90°인 직각삼각형 ABC. ∠${at} = ${th}°, ${givenS}의 길이는 ${g}`),
        explain: `∠${at}에서 보면 ${SG(opp)}는 마주 보는 변, ${SG(adjS)}는 이웃한 변, ${SG('AB')}는 빗변이다. ${how}이다.`
      });
    }, { count: 3 }),
    T('right-wrong', '변을 나타낸 식 가운데 옳지 않은 것 고르기', '①2', (d) => {
      // 직각삼각형 ABC(∠C = 90°)의 세 변 a = BC, b = CA, c = AB
      const A0 = d.until(() => d.int(28, 62), (x) => x !== 45), Rr = (x) => x * Math.PI / 180, cc = 10;
      const vals = { a: cc * Math.sin(Rr(A0)), b: cc * Math.cos(Rr(A0)), c: cc };
      const f3 = { sin: Math.sin, cos: Math.cos, tan: Math.tan }, angOf = { A: A0, B: 90 - A0 };
      // [좌변, 우변 문자, 연산, 삼각비, 각]
      const ok = [['a', 'c', '×', 'sin', 'A'], ['b', 'c', '×', 'cos', 'A'], ['a', 'b', '×', 'tan', 'A'], ['b', 'c', '×', 'sin', 'B'], ['a', 'c', '×', 'cos', 'B'], ['b', 'a', '×', 'tan', 'B'], ['c', 'a', '÷', 'sin', 'A'], ['c', 'b', '÷', 'cos', 'A'], ['b', 'a', '÷', 'tan', 'A'], ['a', 'b', '÷', 'tan', 'B']];
      const bad = [['a', 'c', '×', 'cos', 'A'], ['b', 'c', '×', 'sin', 'A'], ['a', 'b', '÷', 'tan', 'A'], ['b', 'a', '÷', 'tan', 'B'], ['c', 'a', '÷', 'cos', 'A'], ['a', 'c', '×', 'tan', 'A'], ['b', 'c', '×', 'tan', 'B']];
      const rows = d.shuffle(d.shuffle(ok).slice(0, 4).concat([d.pick(bad)]));
      const value = ([, r, op, f, A]) => (op === '×' ? vals[r] * f3[f](Rr(angOf[A])) : vals[r] / f3[f](Rr(angOf[A])));
      const truth = rows.map((x) => Math.abs(value(x) - vals[x[0]]) < 1e-9);
      if (truth.filter((t) => !t).length !== 1) throw new Error('틀린 식이 하나가 아니다');
      const show = ([l, r, op, f, A]) => nb(`${V(l)} = ${V(r)} ${op} ${f} ${A}`);
      const mdl = rightABC(A0, 1);
      const fg = pic(mdl, { polys: [['A', 'C', 'B']], rights: [['C', 'A', 'B']], sides: [['B', 'C', sv('a'), 'A'], ['A', 'C', sv('b'), 'B'], ['A', 'B', sv('c'), 'C']], size: [180, 110] });
      const at = truth.indexOf(false), [l, r, op, f, A] = rows[at];
      return seal(C('그림과 같이 ∠C = 90°인 직각삼각형 ABC에서 세 변의 길이를 ' + V('a') + ', ' + V('b') + ', ' + V('c') + '라 할 때, 다음 중 옳지 않은 것은?', rows.map(show), at, {
        figure: fg.b.svg('∠C = 90°인 직각삼각형 ABC. BC의 길이는 a, CA의 길이는 b, AB의 길이는 c'),
        explain: `${nb('sin A = ' + frac(V('a'), V('c')))}, ${nb('cos A = ' + frac(V('b'), V('c')))}, ${nb('tan A = ' + frac(V('a'), V('b')))}이고 ${nb('sin B = ' + frac(V('b'), V('c')))}, ${nb('cos B = ' + frac(V('a'), V('c')))}, ${nb('tan B = ' + frac(V('b'), V('a')))}이다. 따라서 ${show([l, r, op, f, A])}는 옳지 않다.`,
        facts: { truth, want: false }
      }));
    }),
    T('right-relation', '한 높이를 두 쪽에서 나타내 두 문자 사이의 관계식 고르기', '①3', (d) => {
      const [b0, c0] = d.pick([[60, 30], [30, 60], [45, 30], [30, 45], [60, 45], [45, 60]]);
      const k = div(SIN[b0], SIN[c0]);   // y = (sin B / sin C) x
      const pool = [KR(1, 3), [tm(3, 1, 3, '1', '3')], KR(1, 2), half(2), [tm(6, 1, 2, '1', '2')], [tm(6, 1, 3, '1', '3')], K(2), half(1)];
      const show = (A) => nb(V('y') + ' = ' + (isInt(A) && A[0].nv === 1 ? '' : A.length === 1 && A[0].nv === 1 && A[0].dv === 1 ? rt(A[0].m) : sh(A)) + V('x'));
      const mdl = aaB(1.7, b0, c0), H = [mdl.A[0], 0];
      const f = pic(Object.assign({ H }, mdl), { polys: [['A', 'B', 'C']], segs: [['A', 'H']], rights: [['H', 'A', 'C']], angs: [['B', 'C', 'A', b0 + '°'], ['C', 'A', 'B', c0 + '°']], sides: [['A', 'B', sv('x'), 'C'], ['A', 'C', sv('y'), 'B']], size: [200, 110] });
      return pickV(d, `그림과 같이 △ABC의 꼭짓점 A에서 변 BC에 내린 수선의 발을 H라 하자. ${SG('AB')} = ${V('x')}, ${SG('AC')} = ${V('y')}일 때, ${V('x')}와 ${V('y')} 사이의 관계식은?`, k, d.shuffle(pool), {
        show,
        figure: f.b.svg(`△ABC. 꼭짓점 A에서 변 BC에 내린 수선의 발 H, ∠B = ${b0}°, ∠C = ${c0}°, AB의 길이는 x, AC의 길이는 y`),
        explain: `${SG('AH')} = ${V('x')} ${fn('sin', b0)} = ${sh(SIN[b0])}${V('x')}이고 ${SG('AH')} = ${V('y')} ${fn('sin', c0)} = ${sh(SIN[c0])}${V('y')}이다. 두 식이 같으므로 ${show(k)}이다.`
      });
    }),
    T('approx-side', '주어진 근삿값으로 빗변에서 다른 변 구하기', '①4', (d, n) => {
      if (n === 1) {
        // 열기구의 줄과 수직선이 이루는 각(위 꼭짓점의 각) → 높이 = 줄 × cos
        const { len, th, v } = d.until(() => { const len0 = d.pick([50, 60, 70, 80, 90]), th0 = d.until(() => d.int(18, 50), odd); return { len: len0, th: th0, v: tv(th0) }; }, (z) => { const x = z.len * z.v.c; return Math.abs(x * 10 - Math.round(x * 10)) < 1e-6 && Math.round(x * 10) % 10 !== 0; });
        const mdl = { A: [0, 0], H: [0, -len * v.c], B: [-len * v.s, -len * v.c] };
        const f = pic(mdl, { polys: [['A', 'H', 'B']], rights: [['H', 'A', 'B']], angs: [['A', 'B', 'H', th + '°']], sides: [['A', 'B', mt(len), 'H']], names: ['A', 'B', 'H'], size: [170, 140] });
        return aDec(`그림과 같이 열기구가 길이 ${len} m인 줄로 지면의 B 지점에 묶여 떠 있다. 열기구 A에서 줄과 지면에 수직인 선 AH가 이루는 각의 크기가 ${th}°일 때, 지면에서 열기구까지의 높이 ${SG('AH')}는 몇 m인가? ${given(th, 'sct')}`, len * v.c, `${len}*${v.c}`, 'm', {
          figure: f.b.svg(`직각삼각형 ABH(∠H = 90°). 줄 AB의 길이는 ${len} m, ∠BAH = ${th}°`),
          explain: `${SG('AH')}는 ∠A의 이웃한 변이므로 ${SG('AH')} = ${len} ${fn('cos', th)} = ${len} × ${v.c} = ${Math.round(len * v.c * 10) / 10} (m)이다.`
        });
      }
      // 경사로: 길이 L, 지면과 θ → 높이(sin) 또는 수평 거리(cos)
      const pick = () => { const len0 = d.pick([10, 20, 30, 40]), th0 = d.until(() => d.int(12, 40), odd), v0 = tv(th0), up0 = d.bool(); return { len: len0, th: th0, v: v0, up: up0 }; };
      const { len, th, v, up } = d.until(pick, (z) => { const x = z.len * (z.up ? z.v.s : z.v.c); return Math.round(x * 10) % 10 !== 0 && x < 100; });
      const mdl = rightABC(th, len);
      const f = pic(mdl, { polys: [['A', 'C', 'B']], rights: [['C', 'A', 'B']], angs: [['A', 'C', 'B', th + '°']], sides: [['A', 'B', mt(len), 'C']], size: [200, 100] });
      const ask = up ? 'BC' : 'AC', x = len * (up ? v.s : v.c);
      return aDec(`그림과 같이 길이가 ${len} m인 경사로 AB가 지면과 이루는 각의 크기가 ${th}°이다. ${up ? '지면에서 경사로 끝 B까지의 높이 ' + SG('BC') : '경사로가 시작되는 A 지점에서 C 지점까지의 수평 거리 ' + SG('AC')}는 몇 m인가? ${given(th, 'sct')}`, x, `${len}*${up ? v.s : v.c}`, 'm', {
        figure: f.b.svg(`∠C = 90°인 직각삼각형 ABC. 빗변 AB의 길이는 ${len} m, ∠A = ${th}°`),
        explain: `${SG(ask)}는 ∠A의 ${up ? '마주 보는 변' : '이웃한 변'}이므로 ${SG(ask)} = ${len} ${fn(up ? 'sin' : 'cos', th)} = ${len} × ${up ? v.s : v.c} = ${Math.round(x * 10) / 10} (m)이다.`
      });
    }, { count: 2 }),
    T('approx-tan', '주어진 tan 값으로 수평 거리에서 높이 구하기', '①5', (d) => {
      const { dd, th, v } = d.until(() => { const d0 = d.pick([10, 20, 30, 40, 50, 60]), th0 = d.until(() => d.int(20, 56), odd); return { dd: d0, th: th0, v: tv(th0) }; }, (z) => { const x = z.dd * z.v.t; return Math.round(x * 10) % 10 !== 0 && x < 100; });
      const mdl = { A: [0, 0], C: [dd, 0], B: [dd, dd * v.t] }, x = dd * v.t;
      const f = pic(mdl, { polys: [['A', 'C', 'B']], rights: [['C', 'A', 'B']], angs: [['A', 'C', 'B', th + '°']], sides: [['A', 'C', mt(dd), 'B']], size: [200, 130] });
      return aDec(`그림과 같이 탑의 아랫부분 C 지점에서 ${dd} m 떨어진 A 지점에서 탑의 꼭대기 B를 올려본각의 크기가 ${th}°이다. 탑의 높이 ${SG('BC')}는 몇 m인가? ${given(th, 'sct')}`, x, `${dd}*${v.t}`, 'm', {
        figure: f.b.svg(`∠C = 90°인 직각삼각형 ABC. AC의 길이는 ${dd} m, ∠A = ${th}°`),
        explain: `${fn('tan', th)} = ${frac(SG('BC'), SG('AC'))}이므로 ${SG('BC')} = ${dd} ${fn('tan', th)} = ${dd} × ${v.t} = ${Math.round(x * 10) / 10} (m)이다.`
      });
    }),
    T('approx-eye', '눈높이를 더해 높이 구하기(주어진 tan 값)', '①6', (d, n) => {
      const eye = d.pick([1.4, 1.5, 1.6]), who = d.pick(['가로등', '나무', '건물', '동상']);
      if (n === 1) {
        // 소수 넷째 자리까지의 tan 값 → 반올림
        const { th, tt } = d.until(() => { const th0 = d.until(() => d.int(35, 62), odd); return { th: th0, tt: Math.round(Math.tan(th0 * RAD) * 10000) / 10000 }; }, (z) => { const x = 10 * z.tt + eye, f10 = (x * 10) % 1; return Math.abs(f10 - 0.5) > 0.06 && Math.abs(f10) > 1e-6 && Math.round(x * 10) % 10 !== 0; });
        const x = 10 * tt + eye, ans = Math.round(x * 10) / 10;
        const mdl = { D: [0, 0], A: [0, eye * 2.4], C: [10, eye * 2.4], B: [10, eye * 2.4 + 10 * tt], E: [10, 0] };
        const f = pic(mdl, { polys: [['A', 'C', 'B']], segs: [['D', 'E'], ['C', 'E'], ['D', 'A']], rights: [['C', 'A', 'B']], angs: [['A', 'C', 'B', th + '°']], sides: [['D', 'E', mt(10), 'A'], ['D', 'A', mt(eye), 'C']], nameAt: { A: 120 }, size: [200, 150] });
        return aDec(`그림과 같이 ${who}의 아랫부분 E 지점에서 10 m 떨어진 D 지점에 선 사람이 ${who}의 꼭대기 B를 올려본각의 크기가 ${th}°이다. 이 사람의 눈높이가 ${eye} m일 때, 지면에서 ${who}의 꼭대기까지의 높이는 몇 m인지 반올림하여 소수점 아래 첫째 자리까지 구하시오. (단, ${fn('tan', th)} = ${tt}${tailOf(tt, '으로/로')} 계산한다.)`, ans, roundExpr(`10*${tt}+${eye}`), 'm', {
          figure: f.b.svg(`눈의 위치 A에서 수평으로 C, 꼭대기 B. DE의 길이는 10 m, 눈높이 DA는 ${eye} m, ∠BAC = ${th}°`),
          explain: `${SG('BC')} = 10 ${fn('tan', th)} = 10 × ${tt} = ${Number((10 * tt).toFixed(4))} (m)이고 눈높이를 더하면 ${Number((10 * tt).toFixed(4))} + ${eye} = ${Number(x.toFixed(4))} (m)이다. 반올림하면 ${ans} m이다.`,
          rule: 'round'
        });
      }
      const { dd, th, v } = d.until(() => { const d0 = d.pick([10, 20]), th0 = d.until(() => d.int(25, 60), odd); return { dd: d0, th: th0, v: tv(th0) }; }, (z) => { const x = z.dd * z.v.t + eye; return Math.round(x * 10) % 10 !== 0 && x < 100; });
      const x = dd * v.t + eye;
      const mdl = { D: [0, 0], A: [0, eye * 2.4], C: [dd, eye * 2.4], B: [dd, eye * 2.4 + dd * v.t], E: [dd, 0] };
      const f = pic(mdl, { polys: [['A', 'C', 'B']], segs: [['D', 'E'], ['C', 'E'], ['D', 'A']], rights: [['C', 'A', 'B']], angs: [['A', 'C', 'B', th + '°']], sides: [['D', 'E', mt(dd), 'A'], ['D', 'A', mt(eye), 'C']], nameAt: { A: 120 }, size: [200, 150] });
      return aDec(`그림과 같이 ${who}에서 ${dd} m 떨어진 지점에 선 사람이 ${who}의 꼭대기 B를 올려본각의 크기가 ${th}°이다. 이 사람의 눈높이가 ${eye} m일 때, 지면에서 ${who}의 꼭대기까지의 높이는 몇 m인가? ${given(th, 't')}`, x, `${dd}*${v.t}+${eye}`, 'm', {
        figure: f.b.svg(`눈의 위치 A에서 수평으로 C, 꼭대기 B. DE의 길이는 ${dd} m, 눈높이 DA는 ${eye} m, ∠BAC = ${th}°`),
        explain: `${SG('BC')} = ${dd} ${fn('tan', th)} = ${dd} × ${v.t} = ${Number((dd * v.t).toFixed(2))} (m)이고 눈높이를 더하면 ${Number((dd * v.t).toFixed(2))} + ${eye} = ${Math.round(x * 10) / 10} (m)이다.`
      });
    }, { count: 2 }),
    T('approx-kite', '눈(손)에서의 거리와 sin 값으로 높이 구하기', '①7', (d) => {
      const hand = d.pick([1.4, 1.5, 1.6]);
      const { len, th, v } = d.until(() => { const len0 = d.pick([10, 20, 30, 40, 50]), th0 = d.until(() => d.int(30, 65), odd); return { len: len0, th: th0, v: tv(th0) }; }, (z) => { const x = z.len * z.v.s + hand; return Math.round(x * 10) % 10 !== 0 && x < 100; });
      const x = len * v.s + hand;
      const mdl = { D: [0, 0], A: [0, hand * 3], C: [len * v.c, hand * 3], B: [len * v.c, hand * 3 + len * v.s], E: [len * v.c, 0] };
      const f = pic(mdl, { polys: [['A', 'C', 'B']], segs: [['D', 'E']], cuts: [['C', 'E']], thins: [['D', 'A']], rights: [['C', 'A', 'B']], angs: [['A', 'C', 'B', th + '°']], sides: [['A', 'B', mt(len), 'C'], ['D', 'A', mt(hand), 'C']], nameAt: { A: 120 }, size: [190, 150] });
      return aDec(`그림과 같이 연을 날리는 사람의 손 A에서 연 B까지의 거리는 ${len} m이고, A에서 연을 올려본각의 크기는 ${th}°이다. 지면에서 손까지의 높이가 ${hand} m일 때, 지면에서 연까지의 높이는 몇 m인가? ${given(th, 'sc')}`, x, `${len}*${v.s}+${hand}`, 'm', {
        figure: f.b.svg(`손 A에서 수평으로 C, 연 B. AB의 길이는 ${len} m, ∠BAC = ${th}°, 지면에서 손까지 ${hand} m`),
        explain: `${SG('BC')} = ${len} ${fn('sin', th)} = ${len} × ${v.s} = ${Number((len * v.s).toFixed(2))} (m)이고 손의 높이를 더하면 ${Number((len * v.s).toFixed(2))} + ${hand} = ${Math.round(x * 10) / 10} (m)이다.`
      });
    }),
    T('approx-divide', '나누어 빗변 구하기(반올림)', '①8', (d, n) => {
      if (n === 1) {
        // 직각삼각형 모양 구조물: 밑변 AB 와 ∠A, cos 값 → 빗변 AC
        const { base, th, cc } = d.until(() => { const b0 = d.pick([2, 3, 4, 5]), th0 = d.until(() => d.int(40, 65), odd); return { base: b0, th: th0, cc: r2(Math.cos(th0 * RAD)) }; }, (z) => { const x = z.base / z.cc, f10 = (x * 10) % 1; return Math.abs(f10 - 0.5) > 0.06 && f10 > 1e-6 && Math.round(x * 10) % 10 !== 0; });
        const x = base / cc, ans = Math.round(x * 10) / 10, mdl = { A: [0, 0], B: [base, 0], C: [base, base * Math.tan(th * RAD)] };
        const f = pic(mdl, { polys: [['A', 'B', 'C']], rights: [['B', 'A', 'C']], angs: [['A', 'B', 'C', th + '°']], sides: [['A', 'B', mt(base), 'C']], size: [170, 130] });
        return aDec(`그림과 같이 ∠B = 90°인 직각삼각형 모양의 구조물에서 C 지점에서 A 지점까지 구슬을 굴렸다. ${angH('A', th)}, ${SG('AB')} = ${base} m일 때, 구슬이 굴러간 거리 ${SG('AC')}는 몇 m인지 반올림하여 소수점 아래 첫째 자리까지 구하시오. (단, ${fn('cos', th)} = ${cc}${tailOf(cc, '으로/로')} 계산하고, 구슬의 크기는 생각하지 않는다.)`, ans, roundExpr(`${base}/${cc}`), 'm', {
          figure: f.b.svg(`∠B = 90°인 직각삼각형 ABC. AB의 길이는 ${base} m, ∠A = ${th}°`),
          explain: `${fn('cos', th)} = ${frac(SG('AB'), SG('AC'))}이므로 ${SG('AC')} = ${frac(String(base), fn('cos', th))} = ${base} ÷ ${cc} = ${Number(x.toFixed(4))}…이다. 반올림하면 ${ans} m이다.`,
          rule: 'round'
        });
      }
      // 수직으로 띄운 드론: 높이 H, 눈높이 e, 올려본각 θ → 눈에서 드론까지 (H − e) ÷ sin θ
      const eye = 1.5;
      const { hh, th, ss } = d.until(() => { const h0 = d.pick([40, 50, 60, 70, 80]), th0 = d.until(() => d.int(52, 75), odd); return { hh: h0, th: th0, ss: r2(Math.sin(th0 * RAD)) }; }, (z) => { const x = (z.hh - eye) / z.ss, f10 = (x * 10) % 1; return x < 99 && Math.abs(f10 - 0.5) > 0.06 && f10 > 1e-6 && Math.round(x * 10) % 10 !== 0; });
      const x = (hh - eye) / ss, ans = Math.round(x * 10) / 10, cot = 1 / Math.tan(th * RAD);
      const mdl = { D: [0, 0], B: [0, eye * 3], A: [(hh - eye) * cot, 0], H: [(hh - eye) * cot, eye * 3], C: [(hh - eye) * cot, hh] };
      const f = pic(mdl, { polys: [['B', 'H', 'C']], segs: [['D', 'A'], ['A', 'H']], thins: [['D', 'B']], rights: [['H', 'B', 'C']], angs: [['B', 'H', 'C', th + '°']], sides: [['A', 'C', mt(hh), 'B', { t: 0.5 }], ['D', 'B', mt(eye), 'H']], names: ['A', 'B', 'C', 'H'], nameAt: { B: 120 }, size: [170, 160] });
      return aDec(`그림과 같이 A 지점에 있던 드론을 수직 방향으로 ${hh} m 높이까지 띄웠더니, 눈높이가 ${eye} m인 사람이 드론 C를 올려본각의 크기가 ${th}°이었다. 이 사람의 눈 B에서 드론까지의 거리 ${SG('BC')}는 몇 m인지 반올림하여 소수점 아래 첫째 자리까지 구하시오. (단, ${fn('sin', th)} = ${ss}${tailOf(ss, '으로/로')} 계산한다.)`, ans, roundExpr(`(${hh}-${eye})/${ss}`), 'm', {
        figure: f.b.svg(`지면의 A에서 수직으로 ${hh} m 위에 드론 C. 사람의 눈 B의 높이는 ${eye} m, B에서 수평으로 H, ∠CBH = ${th}°`),
        explain: `${SG('CH')} = ${hh} − ${eye} = ${Number((hh - eye).toFixed(1))} (m)이고 ${fn('sin', th)} = ${frac(SG('CH'), SG('BC'))}이므로 ${SG('BC')} = ${Number((hh - eye).toFixed(1))} ÷ ${ss} = ${Number(x.toFixed(4))}…이다. 반올림하면 ${ans} m이다.`,
        rule: 'drone'
      });
    }, { count: 2 })
  ];

  // ── 묶음 2: 일반 삼각형의 변의 길이 ──
  // 꼭짓점 A에서 BC에 수선 AH: ∠B = beta, AB = c(값) → AH, BH
  const footOn = (c, beta) => ({ AH: mul(c, SIN[beta]), BH: mul(c, COS[beta]) });
  // 셋째 변: √(높이² + 남은 밑변²) 와 그 풀이
  function third(h, rest) { const s2 = add(sq(h), sq(rest)); return { s2, len: sqrtV(s2) }; }
  const triTypes = [
    T('tri-height', '두 변과 끼인각이 주어진 삼각형의 높이', '①17 ①27', (d) => {
      const beta = d.pick([45, 60]), c = 2 * d.int(2, 7), a = d.until(() => d.int(c - 1, c + 8), (x) => x > c * Math.cos(beta * RAD) + 1.5);
      const A = mul(K(c), SIN[beta]);
      const f = pic(Object.assign({ H: [c * Math.cos(beta * RAD), 0] }, sasABC(a, c, beta)), { polys: [['A', 'B', 'C']], segs: [['A', 'H']], rights: [['H', 'A', 'C']], angs: [['B', 'C', 'A', beta + '°']], sides: [['A', 'B', cm(c), 'C'], ['B', 'C', cm(a), 'A', { t: (c * Math.cos(beta * RAD) / a + 1) / 2 }]], size: [200, 120] });
      return aRad(`그림과 같이 ${segEq('AB', K(c), 'cm')}, ${segEq('BC', K(a), 'cm')}, ${angH('B', beta)}인 △ABC의 꼭짓점 A에서 변 BC에 내린 수선의 발을 H라 할 때, ${SG('AH')}의 길이는?`, A, 'cm', {
        figure: f.b.svg(`△ABC. AB의 길이는 ${c} cm, BC의 길이는 ${a} cm, ∠B = ${beta}°, A에서 BC에 내린 수선의 발 H`),
        explain: `직각삼각형 ABH에서 ${SG('AH')} = ${SG('AB')} ${fn('sin', beta)} = ${c} × ${sh(SIN[beta])} = ${L(A, 'cm')}이다.`
      });
    }),
    T('tri-sas', '두 변과 그 끼인각(예각)으로 나머지 한 변 구하기', '①17', (d) => {
      // ∠B = beta, AB = c(값), BC = a(값). 수선의 발 H 가 B 와 C 사이에 오게 한다.
      const make = () => {
        const beta = d.pick([30, 45, 60]);
        if (beta === 60) { const c = 2 * d.int(2, 7), a = d.int(c / 2 + 2, c + 8); return { beta, c: K(c), a: K(a) }; }
        if (beta === 45) { const p = d.int(2, 7), a = d.int(p + 2, p + 9); return { beta, c: KR(p, 2), a: K(a) }; }
        const p = 2 * d.int(1, 4), a = d.int(3 * p / 2 + 2, 3 * p / 2 + 9); return { beta, c: KR(p, 3), a: K(a) };
      };
      const z = d.until(make, (y) => { const { AH, BH } = footOn(y.c, y.beta), r = third(AH, sub(y.a, BH)); return fv(BH) < fv(y.a) - 0.9 && isK(r.len); });
      const { AH, BH } = footOn(z.c, z.beta), CH = sub(z.a, BH), r = third(AH, CH), cv = fv(z.c), av = fv(z.a);
      const f = pic(sasABC(av, cv, z.beta), { polys: [['A', 'B', 'C']], angs: [['B', 'C', 'A', z.beta + '°']], sides: [['A', 'B', lab(z.c, 'cm'), 'C'], ['B', 'C', lab(z.a, 'cm'), 'A']], size: [210, 120] });
      return aRad(`그림과 같이 ${segEq('AB', z.c, 'cm')}, ${segEq('BC', z.a, 'cm')}, ${angH('B', z.beta)}인 △ABC에서 ${SG('AC')}의 길이는?`, r.len, 'cm', {
        figure: f.b.svg(`△ABC. AB의 길이는 ${plainV(z.c)} cm, BC의 길이는 ${plainV(z.a)} cm, ∠B = ${z.beta}°`),
        explain: `꼭짓점 A에서 변 BC에 수선 AH를 그으면 ${SG('AH')} = ${sh(z.c)} ${fn('sin', z.beta)} = ${sh(AH)}, ${SG('BH')} = ${sh(z.c)} ${fn('cos', z.beta)} = ${sh(BH)}이므로 ${SG('CH')} = ${sh(z.a)} − ${sh(BH)} = ${sh(CH)}이다. 따라서 ${sqH(SG('AC'))} = ${sqH(pq(AH))} + ${sqH(pq(CH))} = ${sh(r.s2)}이고 ${SG('AC')} = ${L(r.len, 'cm')}이다.`
      });
    }),
    T('tri-sas-obtuse', '두 변과 그 끼인각(둔각)으로 나머지 한 변 구하기', '①18', (d) => {
      // ∠C = g(둔각), CA = b(값), CB = a(값). A에서 BC의 연장선에 수선 AD
      const make = () => {
        // 150° 는 삼각형이 너무 납작해 각의 글이 맞은편 변에 걸린다(같은 일을 120°·135° 로 묻는다).
        const g = d.pick([120, 135]);
        if (g === 120) { const b = 2 * d.int(1, 5), a = d.int(2, 10); return { g, b: K(b), a: K(a) }; }
        const p = d.int(1, 6), a = d.int(2, 10); return { g, b: KR(p, 2), a: K(a) };
      };
      const z = d.until(make, (y) => { const e = 180 - y.g, AD = mul(y.b, SIN[e]), CD = mul(y.b, COS[e]), r = third(AD, add(y.a, CD)); return isK(r.len) && fv(y.a) / fv(y.b) < (y.g === 135 ? 1.4 : 2.2) && fv(y.b) / fv(y.a) < 3.2; });
      const e = 180 - z.g, AD = mul(z.b, SIN[e]), CD = mul(z.b, COS[e]), BD = add(z.a, CD), r = third(AD, BD), av = fv(z.a), bv = fv(z.b);
      const mdl = { B: [0, 0], C: [av, 0], A: polar([av, 0], bv, e) };
      const f = pic(mdl, { polys: [['A', 'B', 'C']], angs: [['C', 'A', 'B', z.g + '°']], sides: [['A', 'C', lab(z.b, 'cm'), 'B'], ['B', 'C', lab(z.a, 'cm'), 'A']], size: [230, 120] });
      return aRad(`그림과 같이 ${angH('C', z.g)}, ${segEq('AC', z.b, 'cm')}, ${segEq('BC', z.a, 'cm')}인 △ABC에서 ${SG('AB')}의 길이는?`, r.len, 'cm', {
        figure: f.b.svg(`△ABC. ∠C = ${z.g}°, AC의 길이는 ${plainV(z.b)} cm, BC의 길이는 ${plainV(z.a)} cm`),
        explain: `꼭짓점 A에서 변 BC의 연장선에 수선 AD를 그으면 ∠ACD = 180° − ${z.g}° = ${e}°이므로 ${SG('AD')} = ${sh(z.b)} ${fn('sin', e)} = ${sh(AD)}, ${SG('CD')} = ${sh(z.b)} ${fn('cos', e)} = ${sh(CD)}이다. ${SG('BD')} = ${sh(z.a)} + ${sh(CD)} = ${sh(BD)}이므로 ${sqH(SG('AB'))} = ${sqH(pq(AD))} + ${sqH(pq(BD))} = ${sh(r.s2)}이고 ${SG('AB')} = ${L(r.len, 'cm')}이다.`
      });
    }),
    T('tri-foot-rest', '수선의 발까지 남은 길이 구하기', '①19', (d) => {
      const gam = d.pick([45, 30]), p = d.int(2, 6), b = KR(2 * p, 1), a = d.until(() => d.int(2 * p, 2 * p + 8), (x) => x > p * Math.sqrt(gam === 45 ? 2 : 3) + 1 && x <= 4.4 * p);
      const CD = mul(b, COS[gam]), BD = sub(K(a), CD), bv = 2 * p;
      const mdl = { B: [0, 0], C: [a, 0], A: polar([a, 0], bv, 180 - gam), D: [a - bv * Math.cos(gam * RAD), 0] };
      const f = pic(mdl, { polys: [['A', 'B', 'C']], segs: [['A', 'D']], rights: [['D', 'A', 'B']], angs: [['C', 'A', 'B', gam + '°']], sides: [['A', 'C', cm(2 * p), 'B'], ['B', 'C', cm(a), 'A', { gap: 18 }]], size: [210, 120] });
      return aSum(`그림과 같이 △ABC의 꼭짓점 A에서 변 BC에 내린 수선의 발을 D라 하자. ${segEq('AC', b, 'cm')}, ${segEq('BC', K(a), 'cm')}, ${angH('C', gam)}일 때, ${SG('BD')}의 길이는?`, BD, 'cm', {
        figure: f.b.svg(`△ABC. A에서 BC에 내린 수선의 발 D, AC의 길이는 ${2 * p} cm, BC의 길이는 ${a} cm, ∠C = ${gam}°`),
        explain: `직각삼각형 ADC에서 ${SG('CD')} = ${2 * p} ${fn('cos', gam)} = ${sh(CD)} (cm)이므로 ${SG('BD')} = ${SG('BC')} − ${SG('CD')} = ${L(BD, 'cm')}이다.`
      });
    }),
    T('tri-cos-given', '끼인각의 cos 값으로 나머지 한 변 구하기', '①20', (d) => {
      const z = d.until(() => { const [p, q, h] = d.pick([[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [8, 15, 17]]), t = d.int(1, 3), c = h * t, a = d.int(q * t + 2, q * t + 10); return { p, q, h, t, c, a }; }, (y) => { const AH = y.p * y.t, CH = y.a - y.q * y.t, s2 = AH * AH + CH * CH; return sqParts(s2)[0] !== Math.sqrt(s2) && s2 <= 160 && y.c <= 26 && y.a <= 26; });
      // cos B = q/h, AB = c → BH = q·t, AH = p·t(직각삼각형의 세 변 p : q : h)
      const BH = mul(K(z.c), [tm(1, z.q, z.h, String(z.q), String(z.h))]), AH = sqrtV(sub(sq(K(z.c)), sq(BH))), CH = sub(K(z.a), BH), r = third(AH, CH);
      const beta = Math.acos(z.q / z.h) / RAD;
      const f = pic(sasABC(z.a, z.c, beta), { polys: [['A', 'B', 'C']], sides: [['A', 'B', cm(z.c), 'C'], ['B', 'C', cm(z.a), 'A']], size: [210, 120] });
      const cosH = nb('cos B = ' + frac(z.q, z.h));
      return aRad(`그림과 같이 ${segEq('AB', K(z.c), 'cm')}, ${segEq('BC', K(z.a), 'cm')}이고 ${cosH}인 △ABC에서 ${SG('AC')}의 길이는?`, r.len, 'cm', {
        figure: f.b.svg(`△ABC. AB의 길이는 ${z.c} cm, BC의 길이는 ${z.a} cm`),
        explain: `꼭짓점 A에서 변 BC에 수선 AH를 그으면 ${SG('BH')} = ${z.c} × ${frac(z.q, z.h)} = ${sh(BH)}이고, 직각삼각형 ABH에서 ${SG('AH')} = ${rt(sqH(z.c) + ' − ' + sqH(sh(BH)))} = ${sh(AH)}이다. ${SG('CH')} = ${z.a} − ${sh(BH)} = ${sh(CH)}이므로 ${SG('AC')} = ${rt(sqH(sh(AH)) + ' + ' + sqH(sh(CH)))} = ${L(r.len, 'cm')}이다.`
      });
    }),
    T('tri-aas', '두 각과 한 변으로 다른 변 구하기(수선 하나)', '①21', (d, n) => {
      if (n === 1) {
        // 강 건너 A: BC = a, ∠B, ∠C → ∠A, B 에서 AC 에 수선 → AB
        const [cA, aA] = d.pick([[45, 60], [60, 45], [30, 45], [45, 30]]), bA = 180 - cA - aA;
        const a = { '45,60': 3, '60,45': 2, '30,45': 2, '45,30': 1 }[cA + ',' + aA] * d.int(15, 60) * 2;
        const BH = mul(K(a), SIN[cA]), AB = div(BH, SIN[aA]);
        const f = pic(aaB(a, bA, cA), { polys: [['A', 'B', 'C']], angs: [['B', 'C', 'A', bA + '°'], ['C', 'A', 'B', cA + '°']], sides: [['B', 'C', mt(a), 'A']], size: [200, 150] });
        return aRad(`그림은 강 건너편의 A 지점까지의 거리를 구하려고 강가의 두 지점 B, C에서 잰 것이다. ${segEq('BC', K(a), 'm')}, ${angH('ABC', bA)}, ${angH('ACB', cA)}일 때, 두 지점 A, B 사이의 거리는?`, AB, 'm', {
          figure: f.b.svg(`△ABC. BC의 길이는 ${a} m, ∠B = ${bA}°, ∠C = ${cA}°`),
          explain: `∠A = 180° − (${bA}° + ${cA}°) = ${aA}°이다. 꼭짓점 B에서 변 AC에 수선 BH를 그으면 ${SG('BH')} = ${a} ${fn('sin', cA)} = ${sh(BH)} (m)이고, 직각삼각형 ABH에서 ${SG('AB')} = ${frac(SG('BH'), fn('sin', aA))} = ${L(AB, 'm')}이다.`
        });
      }
      const [bA, cA] = d.pick([[30, 45], [60, 45], [45, 60], [30, 60], [45, 30], [60, 30]]);
      const c = { '30,45': 2, '60,45': 2, '45,60': 3, '30,60': 3, '45,30': 1, '60,30': 1 }[bA + ',' + cA] * d.int(2, 6);
      const AH = mul(K(c), SIN[bA]), AC = div(AH, SIN[cA]);
      const mdl = sasABC(1, c, bA); mdl.C = [mdl.A[0] + mdl.A[1] / Math.tan(cA * RAD), 0];
      const f = pic(mdl, { polys: [['A', 'B', 'C']], angs: [['B', 'C', 'A', bA + '°'], ['C', 'A', 'B', cA + '°']], sides: [['A', 'B', cm(c), 'C']], size: [210, 120] });
      return aRad(`그림과 같이 ${segEq('AB', K(c), 'cm')}, ${angH('B', bA)}, ${angH('C', cA)}인 △ABC에서 ${SG('AC')}의 길이는?`, AC, 'cm', {
        figure: f.b.svg(`△ABC. AB의 길이는 ${c} cm, ∠B = ${bA}°, ∠C = ${cA}°`),
        explain: `꼭짓점 A에서 변 BC에 수선 AH를 그으면 ${SG('AH')} = ${c} ${fn('sin', bA)} = ${sh(AH)} (cm)이고, 직각삼각형 AHC에서 ${SG('AC')} = ${frac(SG('AH'), fn('sin', cA))} = ${L(AC, 'cm')}이다.`
      });
    }, { count: 2 }),
    T('tri-asa-sum', '두 각과 그 사이 변으로 맞은편 변·둘레 구하기', '①22', (d, n) => {
      if (n === 1) {
        // 둘레: AC = p√2, ∠B = bA, ∠C = 45° → AH = HC = p
        const bA = d.pick([60, 30]), p = bA === 60 ? 3 * d.int(1, 3) : d.int(2, 6), AC = KR(p, 2);
        const AH = mul(AC, SIN[45]), HC = AH, BH = div(AH, TAN[bA]), AB = div(AH, SIN[bA]), per = add(add(AB, add(BH, HC)), AC);
        const wrong = [add(add(K(2 * p), KR(p, 2)), KR(p, 3)), add(add(K(p), KR(2 * p, 2)), KR(p, 3)), add(add(K(p), KR(p, 2)), KR(2 * p, 3)), add(add(K(3 * p), KR(p, 2)), KR(p, 3)), add(add(K(p), KR(p, 2)), KR(3 * p, 3)), add(K(2 * p), KR(2 * p, 3))];
        const f = pic(aaB(1, bA, 45), { polys: [['A', 'B', 'C']], angs: [['B', 'C', 'A', bA + '°'], ['C', 'A', 'B', '45°']], sides: [['A', 'C', lab(AC, 'cm'), 'B']], size: [210, 120] });
        return pickV(d, `그림과 같이 ${angH('B', bA)}, ${angH('C', 45)}, ${segEq('AC', AC, 'cm')}인 △ABC의 둘레의 길이는?`, per, wrong, {
          show: (A) => L(A, 'cm'),
          figure: f.b.svg(`△ABC. ∠B = ${bA}°, ∠C = 45°, AC의 길이는 ${plainV(AC)} cm`),
          explain: `꼭짓점 A에서 변 BC에 수선 AH를 그으면 ${SG('AH')} = ${SG('CH')} = ${sh(AC)} ${fn('sin', 45)} = ${sh(AH)}이다. 직각삼각형 ABH에서 ${SG('BH')} = ${frac(SG('AH'), fn('tan', bA))} = ${sh(BH)}, ${SG('AB')} = ${frac(SG('AH'), fn('sin', bA))} = ${sh(AB)}이므로 둘레의 길이는 ${sh(AB)} + ${sh(add(BH, HC))} + ${sh(AC)} = ${L(per, 'cm')}이다.`
        });
      }
      // AB = c, ∠A = aA, ∠B = 135 − aA, ∠C = 45 → AC = AH + HC
      const aA = d.pick([60, 30]), c = 2 * d.int(2, 8), bA = 135 - aA;
      const AH = mul(K(c), COS[aA]), BH = mul(K(c), SIN[aA]), HC = BH, AC = add(AH, HC);
      const mdl = { A: [0, 0], C: [fv(AC), 0], B: polar([0, 0], c, aA) };
      const f = pic(mdl, { polys: [['A', 'B', 'C']], angs: [['A', 'C', 'B', aA + '°'], ['B', 'A', 'C', bA + '°']], sides: [['A', 'B', cm(c), 'C']], size: [210, 120] });
      return aSum(`그림과 같이 ${segEq('AB', K(c), 'cm')}, ${angH('A', aA)}, ${angH('B', bA)}인 △ABC에서 ${SG('AC')}의 길이는?`, AC, 'cm', {
        figure: f.b.svg(`△ABC. AB의 길이는 ${c} cm, ∠A = ${aA}°, ∠B = ${bA}°`),
        explain: `∠C = 180° − (${aA}° + ${bA}°) = 45°이다. 꼭짓점 B에서 변 AC에 수선 BH를 그으면 ${SG('AH')} = ${c} ${fn('cos', aA)} = ${sh(AH)}, ${SG('BH')} = ${c} ${fn('sin', aA)} = ${sh(BH)}이고, 직각이등변삼각형 BHC에서 ${SG('CH')} = ${SG('BH')} = ${sh(HC)}이다. 따라서 ${SG('AC')} = ${L(AC, 'cm')}이다.`
      });
    }, { count: 2 }),
    T('tri-sin-expr', '삼각비가 든 식으로 나타낸 변의 길이 고르기', '①23', (d) => {
      const bA = d.until(() => d.int(31, 50), odd), a = 2 * d.int(3, 8), cA = 60, aA = 180 - bA - cA, h = a / 2;
      const R = (x) => x * RAD, truth = a * Math.sin(R(cA)) / Math.sin(R(aA));   // 사인 법칙으로 따로 셈한 AB
      const top = (k, m) => (k === 1 ? '' : k) + (m === 1 ? '' : rt(m)) || '1';
      const cand = [[h, 3, aA], [a, 1, aA], [h, 3, bA], [a, 1, bA], [a, 3, aA], [h, 1, aA], [a, 3, bA]];
      const rows = [cand[0]].concat(d.shuffle(cand.slice(1)).slice(0, 4));
      const opts = rows.map(([k, m, an]) => ({ h: frac(top(k, m), fn('sin', an)), v: k * Math.sqrt(m) / Math.sin(R(an)) }));
      const f = pic(aaB(a, bA, cA), { polys: [['A', 'B', 'C']], angs: [['B', 'C', 'A', bA + '°'], ['C', 'A', 'B', cA + '°']], sides: [['B', 'C', cm(a), 'A']], size: [210, 120] });
      return pickNum(d, `그림과 같이 ${segEq('BC', K(a), 'cm')}, ${angH('B', bA)}, ${angH('C', cA)}인 △ABC에서 ${SG('AB')}의 길이를 나타낸 것은?`, opts, truth, {
        figure: f.b.svg(`△ABC. BC의 길이는 ${a} cm, ∠B = ${bA}°, ∠C = ${cA}°`),
        explain: `꼭짓점 B에서 변 AC에 수선 BH를 그으면 ${SG('BH')} = ${a} ${fn('sin', 60)} = ${h}${rt(3)}이다. ∠A = 180° − (${bA}° + 60°) = ${aA}°이므로 직각삼각형 ABH에서 ${SG('AB')} = ${opts[0].h}이다.`
      });
    })
  ];

  // ── 묶음 3: 높이와 거리 ──
  const CTX2 = [['열기구', 'C'], ['연', 'C'], ['탑의 꼭대기', 'C'], ['전봇대의 꼭대기', 'C']];
  const heightTypes = [
    T('height-elev', '수평 거리와 올려본각(특수각)으로 높이 구하기', '①9', (d) => {
      const th = d.pick([30, 60]), dd = th === 30 ? 3 * d.int(4, 20) : d.int(5, 30), h = mul(K(dd), TAN[th]);
      const f = pic({ A: [0, 0], C: [dd, 0], B: [dd, fv(h)] }, { polys: [['A', 'C', 'B']], rights: [['C', 'A', 'B']], angs: [['A', 'C', 'B', th + '°']], sides: [['A', 'C', mt(dd), 'B']], size: [200, 130] });
      return aRad(`그림과 같이 해수면 위의 한 지점 A에서 수평 거리로 ${dd} m 떨어진 절벽의 꼭대기 B를 올려본각의 크기가 ${th}°이다. 해수면에서 절벽의 꼭대기까지의 높이 ${SG('BC')}는?`, h, 'm', {
        figure: f.b.svg(`∠C = 90°인 직각삼각형 ABC. AC의 길이는 ${dd} m, ∠A = ${th}°`),
        explain: `${SG('BC')} = ${dd} ${fn('tan', th)} = ${dd} × ${sh(TAN[th])} = ${L(h, 'm')}이다.`
      });
    }),
    T('height-broken', '부러진 나무의 처음 높이 구하기', '①10', (d, n) => {
      if (n === 1) {
        const { dd, th, v } = d.until(() => { const d0 = d.pick([4, 5, 6, 8, 10]), th0 = d.until(() => d.int(25, 50), odd); return { dd: d0, th: th0, v: tv(th0) }; }, (z) => { const x = z.dd * z.v.t + z.dd / z.v.c, f10 = (x * 10) % 1; return Math.abs(f10 - 0.5) > 0.06 && f10 > 1e-6 && Math.round(x * 10) % 10 !== 0; });
        const x = dd * v.t + dd / v.c, ans = Math.round(x * 10) / 10;
        const f = pic({ A: [0, dd * Math.tan(th * RAD)], B: [0, 0], C: [dd, 0] }, { polys: [['A', 'B', 'C']], rights: [['B', 'A', 'C']], angs: [['C', 'A', 'B', th + '°']], sides: [['B', 'C', mt(dd), 'A']], size: [200, 120] });
        return aDec(`지면에 수직으로 서 있던 나무가 그림과 같이 A 지점에서 부러져 꼭대기가 지면의 C 지점에 닿았다. ${segEq('BC', K(dd), 'm')}, ∠ACB = ${th}°일 때, 부러지기 전의 나무의 높이는 몇 m인지 반올림하여 소수점 아래 첫째 자리까지 구하시오. ${given(th, 'ct')}`, ans, roundExpr(`${dd}*${v.t}+${dd}/${v.c}`), 'm', {
          figure: f.b.svg(`∠B = 90°인 직각삼각형 ABC. BC의 길이는 ${dd} m, ∠C = ${th}°`),
          explain: `${SG('AB')} = ${dd} ${fn('tan', th)} = ${Number((dd * v.t).toFixed(3))} (m), ${SG('AC')} = ${frac(String(dd), fn('cos', th))} = ${dd} ÷ ${v.c} = ${Number((dd / v.c).toFixed(4))}… (m)이다. 처음 높이는 ${SG('AB')} + ${SG('AC')} = ${Number(x.toFixed(4))}…이므로 반올림하면 ${ans} m이다.`,
          rule: 'round'
        });
      }
      const dd = 3 * d.int(2, 9), AB = mul(K(dd), TAN[30]), AC = div(K(dd), COS[30]), tot = add(AB, AC);
      const f = pic({ A: [0, fv(AB)], B: [0, 0], C: [dd, 0] }, { polys: [['A', 'B', 'C']], rights: [['B', 'A', 'C']], angs: [['C', 'A', 'B', '30°']], sides: [['B', 'C', mt(dd), 'A']], size: [200, 120] });
      return aRad(`지면에 수직으로 서 있던 나무가 그림과 같이 A 지점에서 부러져 꼭대기가 지면의 C 지점에 닿았다. ${segEq('BC', K(dd), 'm')}, ∠ACB = 30°일 때, 부러지기 전의 나무의 높이는?`, tot, 'm', {
        figure: f.b.svg(`∠B = 90°인 직각삼각형 ABC. BC의 길이는 ${dd} m, ∠C = 30°`),
        explain: `${SG('AB')} = ${dd} ${fn('tan', 30)} = ${sh(AB)} (m), ${SG('AC')} = ${frac(String(dd), fn('cos', 30))} = ${sh(AC)} (m)이므로 처음 높이는 ${sh(AB)} + ${sh(AC)} = ${L(tot, 'm')}이다.`
      });
    }, { count: 2 }),
    T('height-ladder', '벽에 기댄 사다리의 그림자 길이 구하기', '①11', (d) => {
      const th = d.pick([60, 30]), len = 2 * d.int(2, 6), floor = mul(K(len), COS[th]), wall = mul(K(len), SIN[th]), tot = add(floor, wall);
      const mdl = { A: [0, 0], C: [fv(floor), 0], B: [fv(floor), fv(wall)], E: [fv(floor), fv(wall) * 1.18], G: [-fv(floor) * 0.25, 0] };
      const f = pic(mdl, { polys: [['A', 'C', 'B']], thins: [['C', 'E'], ['G', 'A']], rights: [['C', 'A', 'B']], angs: [['A', 'C', 'B', th + '°']], sides: [['A', 'B', mt(len), 'C']], names: ['A', 'B', 'C'], nameAt: { B: 0 }, size: [180, 140] });
      return aSum(`길이가 ${len} m인 사다리 AB를 그림과 같이 지면과 이루는 각의 크기가 ${th}°가 되도록 벽에 기대어 놓았다. 빛이 사다리의 바로 위쪽에서 비출 때 지면에 생기는 그림자 ${SG('AC')}와 빛이 바로 옆에서 비출 때 벽에 생기는 그림자 ${SG('BC')}의 길이의 합은?`, tot, 'm', {
        figure: f.b.svg(`벽 아래 C에서 지면 위 A까지, 벽 위의 B. 사다리 AB의 길이는 ${len} m, ∠BAC = ${th}°, ∠C = 90°`),
        explain: `${SG('AC')} = ${len} ${fn('cos', th)} = ${sh(floor)} (m), ${SG('BC')} = ${len} ${fn('sin', th)} = ${sh(wall)} (m)이므로 합은 ${L(tot, 'm')}이다.`
      });
    }),
    T('height-updown', '한 지점에서 올려본각과 내려본각으로 높이 구하기', '①12', (d) => {
      const [up, dn] = d.pick([[45, 30], [30, 45], [60, 45], [45, 60]]), dd = (up === 30 || dn === 30) ? 3 * d.int(2, 8) : d.int(4, 20);
      const hu = mul(K(dd), TAN[up]), hd = mul(K(dd), TAN[dn]), tot = add(hu, hd);
      const mdl = { A: [0, fv(hd)], P: [0, 0], C: [dd, 0], B: [dd, fv(tot)], H: [dd, fv(hd)] };
      const f = pic(mdl, { segs: [['A', 'B'], ['A', 'C'], ['P', 'C'], ['C', 'B']], cuts: [['A', 'H']], thins: [['P', 'A']], angs: [['A', 'H', 'B', up + '°'], ['A', 'C', 'H', dn + '°']], sides: [['P', 'C', mt(dd), 'B']], names: ['A', 'B', 'C', 'H'], size: [190, 150] });
      return aSum(`그림과 같이 건물에서 ${dd} m 떨어진 곳에 나무가 서 있다. 건물의 A 지점에서 나무의 꼭대기 B를 올려본각의 크기는 ${up}°이고, 나무의 밑 C를 내려본각의 크기는 ${dn}°일 때, 나무의 높이 ${SG('BC')}는?`, tot, 'm', {
        figure: f.b.svg(`건물의 A에서 수평으로 나무 위의 점 H. 건물과 나무 사이의 거리는 ${dd} m, ∠BAH = ${up}°, ∠HAC = ${dn}°`),
        explain: `A에서 나무에 수평선 AH를 그으면 ${SG('AH')} = ${dd} m이다. ${SG('BH')} = ${dd} ${fn('tan', up)} = ${sh(hu)}, ${SG('CH')} = ${dd} ${fn('tan', dn)} = ${sh(hd)}이므로 나무의 높이는 ${L(tot, 'm')}이다.`
      });
    }),
    T('height-diff', '한 지점에서 잰 두 각으로 두 높이의 차 구하기', '①13', (d) => {
      const [hi, lo] = d.pick([[60, 45], [45, 30]]), dd = lo === 30 ? 3 * d.int(2, 6) : d.int(3, 12);
      const top = mul(K(dd), TAN[hi]), nest = mul(K(dd), TAN[lo]), gap = sub(top, nest);
      const mdl = { A: [0, 0], D: [dd, 0], B: [dd, fv(top)], C: [dd, fv(nest)] };
      const f = pic(mdl, { segs: [['A', 'D'], ['D', 'B'], ['A', 'B'], ['A', 'C']], rights: [['D', 'A', 'B']], angs: [['A', 'D', 'C', lo + '°', { r: 22 }]], sides: [['A', 'D', mt(dd), 'B']], size: [180, 150],
        after: (b, P) => { const aB = dirOf(P.A, P.B); b.angle(P.A, 0, aB, '', { r: 40 }); b.text(at(P.A, 50, aB + 14), hi + '°', { blue: true }); } });
      return aSum(`그림과 같이 나무의 아랫부분 D 지점에서 ${dd} m 떨어진 A 지점에서 나무의 꼭대기 B와 새둥지 C를 올려본각의 크기가 각각 ${hi}°와 ${lo}°일 때, 두 지점 B, C 사이의 거리는?`, gap, 'm', {
        figure: f.b.svg(`직각삼각형 ABD(∠D = 90°), 나무 DB 위의 점 C. AD의 길이는 ${dd} m, ∠BAD = ${hi}°, ∠CAD = ${lo}°`),
        explain: `${SG('BD')} = ${dd} ${fn('tan', hi)} = ${sh(top)}, ${SG('CD')} = ${dd} ${fn('tan', lo)} = ${sh(nest)}이므로 ${SG('BC')} = ${L(gap, 'm')}이다.`
      });
    }),
    T('height-pendulum', '추·그네가 움직인 높이 구하기', '①14', (d, n) => {
      if (n === 1) {
        const { r, h0 } = d.until(() => ({ r: d.pick([2, 2.4, 2.6, 3, 3.2]), h0: d.pick([0.3, 0.4, 0.5, 0.6]) }), (z) => Math.round((z.r / 2 + z.h0) * 10) % 10 !== 0);
        const x = r + h0 - r / 2, mdl = { O: [0, r + h0], A: [0, h0], F: [r * Math.sin(60 * RAD), r + h0 - r * Math.cos(60 * RAD)], G: [0, r + h0 - r * Math.cos(60 * RAD)], P: [0, 0] };
        const f = pic(mdl, { segs: [['O', 'A'], ['O', 'F']], cuts: [['F', 'G']], thins: [['A', 'P']], angs: [['O', 'A', 'F', '60°']], sides: [['O', 'F', mt(r), 'A'], ['A', 'P', mt(h0), 'F']], names: ['O', 'A', 'F'], nameAt: { A: 0 }, size: [150, 150] });
        return aDec(`그네의 줄의 길이는 ${r} m이고, 그네가 가만히 있을 때 앉는 자리 A는 지면에서 ${h0} m 높이에 있다. 그림과 같이 줄이 처음 자리와 60°를 이루도록 그네를 밀었을 때, 앉는 자리 F는 지면에서 몇 m 높이에 있는가?`, x, `${r}+${h0}-${r}/2`, 'm', {
          figure: f.b.svg(`줄을 매단 점 O, 가만히 있을 때 자리 A, 민 뒤 자리 F. 줄 OF의 길이는 ${r} m, ∠AOF = 60°, A의 높이는 ${h0} m`),
          explain: `O의 높이는 ${r} + ${h0} = ${Number((r + h0).toFixed(1))} (m)이다. F에서 OA에 수선 FG를 그으면 ${SG('OG')} = ${r} ${fn('cos', 60)} = ${Number((r / 2).toFixed(2))} (m)이므로 F의 높이는 ${Number((r + h0).toFixed(1))} − ${Number((r / 2).toFixed(2))} = ${Math.round(x * 10) / 10} (m)이다.`
        });
      }
      const th = d.pick([30, 45]), r = 2 * d.int(5, 25), OH = mul(K(r), COS[th]), up = sub(K(r), OH);
      const mdl = { O: [0, 0], A: [0, -r], B: [r * Math.sin(th * RAD), -fv(OH)], H: [0, -fv(OH)] };
      const f = pic(mdl, { segs: [['O', 'A'], ['O', 'B']], cuts: [['B', 'H']], angs: [['O', 'A', 'B', th + '°']], sides: [['O', 'B', cm(r), 'A']], size: [130, 150] });
      return aSum(`그림과 같이 길이가 ${r} cm인 실에 매달린 추가 가장 낮은 A 지점에서 ${th}°만큼 흔들려 B 지점에 왔다. B 지점은 A 지점보다 몇 cm 위에 있는가? (단, 추의 크기는 생각하지 않는다.)`, up, 'cm', {
        figure: f.b.svg(`실을 매단 점 O, 가장 낮은 자리 A, 흔들린 자리 B. OB의 길이는 ${r} cm, ∠AOB = ${th}°`),
        explain: `B에서 OA에 수선 BH를 그으면 ${SG('OH')} = ${r} ${fn('cos', th)} = ${sh(OH)}이므로 ${SG('AH')} = ${SG('OA')} − ${SG('OH')} = ${L(up, 'cm')}이다.`
      });
    }, { count: 2 }),
    T('height-bent', '두 직각삼각형이 밑변을 나눈 꺾인 길의 길이', '①15', (d) => {
      const hq = d.int(4, 15), ac = d.int(3, 9), dd = hq + ac;
      const PC = div(K(ac), COS[60]), CQ = div(K(hq), COS[45]), tot = add(PC, CQ);
      const mdl = { A: [0, 0], P: [0, ac * Math.tan(60 * RAD)], C: [ac, 0], B: [dd, 0], Q: [dd, hq] };
      const f = pic(mdl, { segs: [['A', 'B'], ['A', 'P'], ['B', 'Q'], ['P', 'C'], ['C', 'Q']], rights: [['A', 'P', 'C'], ['B', 'C', 'Q']], angs: [['C', 'P', 'A', '60°'], ['C', 'B', 'Q', '45°']], sides: [['B', 'Q', mt(hq), 'C']], after: (b, P) => b.dim(P.A, P.B, mt(dd), [P.A[0], P.A[1] - 20], 26), size: [210, 140] });
      return aSum(`그림은 A 나무의 꼭대기 P에 있던 새가 지면의 C 지점에 있는 먹이를 잡아 B 나무의 꼭대기 Q로 날아간 것을 나타낸 것이다. B 나무의 높이는 ${hq} m, 두 나무 사이의 거리는 ${dd} m이고 ∠PCA = 60°, ∠QCB = 45°일 때, 새가 날아간 거리 ${SG('PC')} + ${SG('CQ')}는? (단, 새는 곧게 날아간다.)`, tot, 'm', {
        figure: f.b.svg(`지면의 A, C, B. A 나무 AP, B 나무 BQ. BQ의 길이는 ${hq} m, AB의 길이는 ${dd} m, ∠PCA = 60°, ∠QCB = 45°`),
        explain: `직각이등변삼각형 QCB에서 ${SG('CB')} = ${hq} m, ${SG('CQ')} = ${hq} ÷ ${fn('cos', 45)} = ${sh(CQ)} (m)이다. ${SG('AC')} = ${dd} − ${hq} = ${ac} (m)이므로 ${SG('PC')} = ${ac} ÷ ${fn('cos', 60)} = ${sh(PC)} (m)이다. 따라서 날아간 거리는 ${L(tot, 'm')}이다.`
      });
    }),
    T('height-two-dist', '높이와 두 올려본각으로 두 지점 사이의 거리', '①16', (d) => {
      const h = 3 * d.int(1, 5), AH = div(K(h), TAN[60]), BH = div(K(h), TAN[30]), gap = sub(BH, AH);
      const mdl = { H: [0, 0], C: [0, h], A: [fv(AH), 0], B: [fv(BH), 0] };
      const f = pic(mdl, { segs: [['H', 'B'], ['H', 'C'], ['C', 'A'], ['C', 'B']], rights: [['H', 'B', 'C']], angs: [['A', 'H', 'C', '60°'], ['B', 'A', 'C', '30°', { r: 30 }]], sides: [['H', 'C', mt(h), 'B']], size: [210, 110] });
      return aRad(`그림과 같이 지면으로부터 ${h} m 높이에 있는 조명 C를 A 지점에서 올려본각의 크기는 60°이고, B 지점에서 올려본각의 크기는 30°이다. 두 지점 A, B 사이의 거리는?`, gap, 'm', {
        figure: f.b.svg(`조명 C에서 지면에 내린 수선의 발 H, H에서 같은 쪽으로 A, B. CH의 길이는 ${h} m, ∠CAH = 60°, ∠CBH = 30°`),
        explain: `${SG('AH')} = ${frac(String(h), fn('tan', 60))} = ${sh(AH)}, ${SG('BH')} = ${frac(String(h), fn('tan', 30))} = ${sh(BH)}이므로 ${SG('AB')} = ${sh(BH)} − ${sh(AH)} = ${L(gap, 'm')}이다.`
      });
    }),
    T('two-opposite', '양쪽 두 지점에서 잰 두 각으로 높이 구하기', '①24', (d) => {
      const [p, q] = d.pick([[45, 60], [60, 45], [45, 30], [30, 45]]), dd = 2 * d.int(5, 60), [what] = d.pick(CTX2);
      // h(1/tan p + 1/tan q) = dd
      const s = add(div(K(1), TAN[p]), div(K(1), TAN[q])), h = div(K(dd), s);
      const mdl = { A: [0, 0], B: [dd, 0], C: [fv(h) / Math.tan(p * RAD), fv(h)], H: [fv(h) / Math.tan(p * RAD), 0] };
      const f = pic(mdl, { polys: [['A', 'B', 'C']], cuts: [['C', 'H']], rights: [['H', 'B', 'C']], angs: [['A', 'B', 'C', p + '°'], ['B', 'C', 'A', q + '°']], sides: [['A', 'B', mt(dd), 'C', { t: mdl.H[0] / dd < 0.5 ? (mdl.H[0] / dd + 1) / 2 : mdl.H[0] / dd / 2 }]], size: [210, 120] });
      return aSum(`그림과 같이 ${dd} m 떨어진 두 지점 A, B에서 ${what} C를 올려본각의 크기가 각각 ${p}°, ${q}°이다. 지면에서 C까지의 높이 ${SG('CH')}는?`, h, 'm', {
        figure: f.b.svg(`△ABC와 C에서 AB에 내린 수선의 발 H(H는 A와 B 사이). AB의 길이는 ${dd} m, ∠A = ${p}°, ∠B = ${q}°`),
        explain: `${SG('CH')} = ${V('h')}라 하면 ${SG('AH')} = ${frac(V('h'), fn('tan', p))}, ${SG('BH')} = ${frac(V('h'), fn('tan', q))}이고 ${SG('AH')} + ${SG('BH')} = ${dd}이다. ${V('h')}(${sh(div(K(1), TAN[p]))} + ${sh(div(K(1), TAN[q]))}) = ${dd}이므로 ${V('h')} = ${L(h, 'm')}이다(분모를 유리화).`
      });
    }),
    T('two-same', '같은 쪽 두 지점에서 잰 두 각으로 높이 구하기', '①25', (d) => {
      const [p, q] = d.pick([[30, 45], [45, 60]]), dd = 2 * d.int(3, 40), what = d.pick(['탑', '건물', '산', '성벽']);
      const s = sub(div(K(1), TAN[p]), div(K(1), TAN[q])), h = div(K(dd), s);
      const xq = fv(h) / Math.tan(q * RAD), mdl = { A: [0, 0], B: [dd, 0], H: [dd + xq, 0], C: [dd + xq, fv(h)] };
      const f = pic(mdl, { segs: [['A', 'H'], ['H', 'C'], ['A', 'C'], ['B', 'C']], rights: [['H', 'A', 'C']], angs: [['A', 'H', 'C', p + '°', { r: 30 }], ['B', 'H', 'C', q + '°']], sides: [['A', 'B', mt(dd), 'C', { dim: 24 }]], size: [210, 120] });
      return aSum(`그림과 같이 ${what}의 꼭대기 C를 A 지점에서 올려본각의 크기는 ${p}°이고, ${what} 쪽으로 ${dd} m 다가간 B 지점에서 올려본각의 크기는 ${q}°이다. ${what}의 높이 ${SG('CH')}는?`, h, 'm', {
        figure: f.b.svg(`지면의 A, B, H(차례로 한 직선 위), H 위의 꼭대기 C, ∠H = 90°. AB의 길이는 ${dd} m, ∠CAH = ${p}°, ∠CBH = ${q}°`),
        explain: `${SG('CH')} = ${V('h')}라 하면 ${SG('AH')} = ${frac(V('h'), fn('tan', p))}, ${SG('BH')} = ${frac(V('h'), fn('tan', q))}이고 ${SG('AH')} − ${SG('BH')} = ${dd}이다. ${V('h')}(${sh(div(K(1), TAN[p]))} − ${sh(div(K(1), TAN[q]))}) = ${dd}이므로 ${V('h')} = ${L(h, 'm')}이다(분모를 유리화).`
      });
    }),
    T('height-3d', '지면 위의 세 점으로 높이 구하기(입체)', '①58', (d) => {
      const [bA, el] = d.pick([[60, 45], [45, 45], [30, 60], [45, 30]]), dd = (bA === 45 && el === 30 ? 6 : 2) * d.int(10, 50);
      const AH = mul(K(dd), SIN[bA]), CH = mul(AH, TAN[el]);
      // 비스듬히 본 땅(가로 x, 깊이 y → 화면 (x + 0.45y, 0.45y)) 위의 A, B, H 와 H 위의 C
      const bh = dd * Math.cos(bA * RAD), ah = fv(AH), sk = ground(-45, 1);
      const mdl = { B: sk(0, 0), H: sk(bh, 0), A: sk(bh, -ah), C: sk(bh, 0, fv(CH)) };
      const f = pic(mdl, { polys: [['A', 'B', 'H']], segs: [['H', 'C'], ['A', 'C']], angs: [['B', 'H', 'A', bA + '°', { r: 12 }], ['A', 'H', 'C', el + '°', { r: 16 }]], sides: [['A', 'B', mt(dd), 'H']], size: [210, 180] });
      return aRad(`그림에서 세 점 A, B, H는 지면 위에 있고 ${SG('CH')}는 지면에 수직이다. ${segEq('AB', K(dd), 'm')}, ∠ABH = ${bA}°, ∠AHB = 90°이고, A 지점에서 C를 올려본각의 크기가 ${el}°일 때, ${SG('CH')}의 길이는?`, CH, 'm', {
        figure: f.b.svg(`지면 위의 △ABH와 H에서 수직으로 선 CH. AB의 길이는 ${dd} m, ∠ABH = ${bA}°, ∠AHB = 90°, ∠CAH = ${el}°`),
        explain: `지면 위의 직각삼각형 ABH에서 ${SG('AH')} = ${dd} ${fn('sin', bA)} = ${sh(AH)} (m)이다. ${SG('CH')}는 지면에 수직이므로 ∠AHC = 90°이고, ${SG('CH')} = ${sh(AH)} ${fn('tan', el)} = ${L(CH, 'm')}이다.`
      });
    }),
    T('height-letters', '높이를 문자와 삼각비로 나타낸 식 고르기', '①59', (d, n) => {
      const a0 = d.pick([1.5, 1.6]), b0 = d.int(20, 40), x0 = d.until(() => d.int(25, 55), odd), y0 = d.until(() => d.int(20, 50), (y) => odd(y) && y !== x0), c0 = d.int(20, 40);
      const R = (v) => v * RAD, s = Math.sin, c = Math.cos, t = Math.tan;
      const a = V('a'), b = V('b'), cc = V('c'), x = V('x') + '°', y = V('y') + '°', sx = sv('x') + '°', sy = sv('y') + '°';
      if (n === 1) {
        // 폭포보다 낮은 건너편 언덕: 꼭대기를 올려본각 x, 밑을 내려본각 y, 눈에서 꼭대기까지 b, 밑까지 c
        const truth = b0 * s(R(x0)) + c0 * s(R(y0));
        const opts = [[`${b} sin ${x} + ${cc} sin ${y}`, b0 * s(R(x0)) + c0 * s(R(y0))], [`${b} cos ${x} + ${cc} cos ${y}`, b0 * c(R(x0)) + c0 * c(R(y0))], [`${b} sin ${x} + ${cc} cos ${y}`, b0 * s(R(x0)) + c0 * c(R(y0))], [`${b} sin ${x} − ${cc} sin ${y}`, b0 * s(R(x0)) - c0 * s(R(y0))], [`${b} tan ${x} + ${cc} tan ${y}`, b0 * t(R(x0)) + c0 * t(R(y0))]].map(([h, v]) => ({ h: nb(h), v }));
        const mdl = { E: [0, 0], T: [b0 * c(R(x0)), b0 * s(R(x0))], W: [b0 * c(R(x0)), 0], U: [c0 * c(R(y0)), -c0 * s(R(y0))] };
        const f = pic(mdl, { segs: [['E', 'T'], ['E', 'U'], ['T', 'U']], cuts: [['E', 'W']], angs: [['E', 'W', 'T', sx], ['E', 'U', 'W', sy]], sides: [['E', 'T', sv('b') + ' m', 'W'], ['E', 'U', sv('c') + ' m', 'W']], names: [], size: [200, 150] });
        return pickNum(d, `폭포보다 낮은 건너편 언덕에 선 사람의 눈에서 폭포의 시작점까지의 거리는 ${b} m, 폭포의 끝점까지의 거리는 ${cc} m이고, 시작점을 올려본각의 크기는 ${x}, 끝점을 내려본각의 크기는 ${y}이다. 폭포의 높이 ${V('h')} m를 나타낸 식은?`, opts, truth, {
          figure: f.b.svg(`눈의 위치에서 수평선(점선) 위로 ${'x'}°만큼 올려본 거리 b m, 아래로 ${'y'}°만큼 내려본 거리 c m인 두 선분과 폭포(세로선)`),
          explain: `눈높이의 수평선에서 폭포의 시작점까지의 높이는 ${b} sin ${x}, 끝점까지의 깊이는 ${cc} sin ${y}이므로 ${V('h')} = ${opts[0].h}이다.`
        });
      }
      // 폭포 위쪽에서 내려볼 때: 눈높이 a, 눈에서 수직선과 x°를 이루며 b 떨어진 건너편 아래 지점
      const truth = b0 * c(R(x0)) - a0;
      const opts = [[`${b} cos ${x} − ${a}`, b0 * c(R(x0)) - a0], [`${b} sin ${x} − ${a}`, b0 * s(R(x0)) - a0], [`${b} cos ${x} + ${a}`, b0 * c(R(x0)) + a0], [`${b} sin ${x} + ${a}`, b0 * s(R(x0)) + a0], [`${b} tan ${x} − ${a}`, b0 * t(R(x0)) - a0]].map(([h, v]) => ({ h: nb(h), v }));
      const top = b0 * c(R(x0)), mdl = { E: [0, top], G: [0, top - a0 * 2], F: [0, 0], U: [b0 * s(R(x0)), 0] };
      const f = pic(mdl, { segs: [['E', 'U'], ['F', 'U']], thins: [['E', 'G']], cuts: [['G', 'F']], rights: [['F', 'G', 'U']], angs: [['E', 'F', 'U', sx]], sides: [['E', 'U', sv('b') + ' m', 'F'], ['E', 'G', sv('a') + ' m', 'U'], ['G', 'F', sv('h') + ' m', 'U']], names: [], size: [170, 160] });
      return pickNum(d, `폭포 위쪽 끝에 선 사람의 눈높이는 ${a} m이다. 이 사람의 눈에서 폭포 아래 건너편 지점까지의 거리는 ${b} m이고, 그 선분이 수직선과 이루는 각의 크기는 ${x}이다. 폭포의 높이 ${V('h')} m를 나타낸 식은?`, opts, truth, {
        figure: f.b.svg(`폭포 위의 눈의 위치에서 아래 건너편 지점까지 b m인 선분이 수직선과 x°를 이룬다. 눈높이 a m, 폭포의 높이 h m`),
        explain: `눈에서 수직으로 지면까지의 높이는 ${b} cos ${x}이고 그 가운데 눈높이 ${a} m를 빼면 폭포의 높이이므로 ${V('h')} = ${opts[0].h}이다.`
      });
    }, { count: 2 })
  ];

  B.addUnit({
    id: '9-2-2', grade: 9, semester: 2, no: 2, title: '삼각비의 활용', version: 1,
    groups: [
      { id: 'side', title: '직각삼각형의 변의 길이', standard: STD, types: sideTypes },
      { id: 'tri', title: '일반 삼각형의 변의 길이', standard: STD, types: triTypes },
      { id: 'height', title: '높이와 거리', standard: STD, types: heightTypes },
      { id: 'area', title: '삼각형의 넓이', standard: STD, types: [] },
      { id: 'quad', title: '사각형의 넓이', standard: STD, types: [] },
      { id: 'figure', title: '여러 가지 도형의 넓이와 길이', standard: STD, types: [] }
    ]
  });

  B.kit.m922 = {
    STD, T, ONE, w, tm, K, KR, ZERO, add, neg, sub, mul, inv1, div, sqrtV, sq, fv, same, isK, isInt, isSum, coef, half, SIN, COS, TAN,
    termH, sh, lastNum, sj, L, plainV, sqH, pq, fn, angH, segEq, calcOf, seal, un, more, aRad, aSum, aInt, aFr, aPi, aDec, roundExpr, pickV, pickNum,
    r2, tv, tailOf, given, odd, lay, radAt, sideLab, lab, pic, cm, mt, pt, polar, rightABC, sasABC, aaB, footOn, third, ground
  };
})(typeof window !== 'undefined' ? window : globalThis);
