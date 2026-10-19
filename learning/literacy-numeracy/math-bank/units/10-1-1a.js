// 고등학교 1학년 1학기(공통수학1) Ⅰ-1 다항식의 연산 — 단원 틀·식 글 도구와 앞쪽 묶음(다항식의 덧셈과 뺄셈, 다항식의 곱셈).
// 수집해 둔 천재 T셀파 공통수학1 두 종(홍진곤, 전인태 — 2022 개정)의 교과서·평가 자료에서 뽑은 문제 꼴 목록
// (기본꼴_1: 33꼴, 기본꼴_2: 39꼴, 심화꼴: 5꼴)을 꼴마다 따져서 실었다. 꼴마다 「실음(유형 이름) / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는
// references/textbooks/수학/_분석/10-1-1/싣기_대조표.md 에 있다.
// (곱셈 공식, 곱셈 공식의 변형, 다항식의 나눗셈은 10-1-1b.js 에, 실력 문항은 10-1-1c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
// 성취기준은 10공수1-01-01(다항식의 사칙연산의 원리를 설명하고, 그 계산을 할 수 있다).
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(식·결합식·등식·그림·상황), 묻는 것(계산한 식·계수·상수·몫과 나머지·고르기), 계산 구조(문자의 수, 차수,
//    괄호의 겹, 먼저 정리할 결합식)가 다르면 따로 싣는다. 수와 문자만 바꾼 유형은 만들지 않는다. 계산 문항끼리는 facts.rule 에 구조의 이름을 단다.
//  - 교육과정: 다항식의 사칙연산. 곱셈 공식은 고등학교에서 더한 (a + b + c)², (a ± b)³, (a ± b)(a² ∓ ab + b²)과 그 변형을 다룬다.
//    중학교에서 이미 한 계산(중2 이차식의 덧셈과 뺄셈 그대로, 중3 곱셈 공식 다섯 꼴 그대로, 중3 곱셈 공식의 변형 그대로)과
//    조립제법·나머지정리·인수정리·항등식(다음 단원 10-1-2)은 싣지 않는다. 다항식의 나눗셈은 직접 나누는 세로셈으로만 푼다.
//  - 답: 계산한 다항식은 항마다 「[±][ ]문자」(polyAns — 한 유형 안에서는 항의 구성이 같다), 몫과 나머지는 몫의 항과 나머지의 항을 이어 적는 칸
//    (divAns), 계수·상수·식의 값은 부호 단추가 붙은 수 칸, 근호가 든 값은 radAns, 일차식의 계수처럼 문자가 든 답은 linAns 로 받는다.
//    칸의 모양이 답을 흘리는 꼴(항이 사라지는 곱, 차례가 답인 정리)은 고르기로 낸다. 이 단원에는 음수가 되는 답이 흔하므로 수 칸에는 모두 부호 단추를 단다.
//    원문의 「a + b + c + d + e의 값」「a + b의 값」처럼 따로 구한 값을 뜻 없이 더하는 꼴은 값을 칸마다 따로 받는다.
//  - 답은 모두 코드가 셈한다. 식을 한 줄 글(식 글)로 적고, 그 글에서 화면 글·값(다항식)·검사 식을 얻는다. 검사 식(facts.calc)은 글에 적힌 수로
//    계수를 셈하는 식이고, 글에 없는 수(계수 1, 나누는 수 2·3 따위)는 seal 이 facts.unseen 에 밝힌다(밝히기로 하지 않은 수가 나오면 오류를 낸다).
//
// 뺀 것과 까닭(10-1-1b.js, 10-1-1c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 앞 학년 그대로: ①13·①14(한 문자 이차식·두 문자 일차식의 덧셈과 뺄셈 — 중2 8-1-2), ①32(합차 공식만 잇달아 쓰는 전개 — 중3 9-1-3),
//    ①33의 999 × 1001 × 1000001·(1 + 2)(1 + 2²)…(1 + 2³²)(합차만 되풀이 — 중3), ②6의 홍대4·②9(a + 1/a, a + 3b·ab 로 a − 1/a, a² + 9b² — 중3 곱셈 공식의 변형),
//    ②15(두 정사각형의 넓이로 (a + 2b)² — 중3 변형을 넓이로 묻는 것), ②18(직육면체 여섯 면의 넓이의 곱 — 중2 지수법칙).
//  - 다음 단원(10-1-2)의 일: ②37~②39(조립제법 — 과제 글), 대단원·학기 문서 안의 나머지정리·인수정리·항등식·인수분해 문항, 심5(인수분해한 꼴의 계수 —
//    나누어도 풀리지만 원문은 인수분해 문항), ②29의 홍대7(나머지정리로 a를 구해 몫의 값 — 같은 일은 ②28·②29로 실었다).
//  - 공학 도구 활동: ②36의 적용 (A + 2B − AB) ÷ (A − B)(육차식을 공학 도구로 나누는 활동. 손셈으로 내면 ②20을 길게 되풀이할 뿐이다).
//  - 겹침: ②25(R − Q — Q와 R을 따로 물으면 ②20), ②36의 앞부분(합·차·곱·몫 — ①3·①15·②20), 심1(→ ①4), 심2(→ ①8), ①9의 홍간2(계수의 합 — 식을 물으면 ①9),
//    ②5의 전중21(x² + x³ + y² + y³ — 따로 물으면 ②5와 중3 변형), ①18의 홍중3⑵(세 일차식을 차례로 곱하기 — ①19의 첫째 차례로 실음).
//  - 서술형만으로 묻는 부분: ②30 전교의 ➊(나머지가 3x² + x + 4가 아닌 까닭 쓰기 — 뒤의 ➋➌을 실음), ①33 전교의 11³ 설명하기(계산은 실음).
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { box, frac, lines, N, M, C, inline } = B.kit;
  const { LAB, MINUS, gcd, Q, qadd, qsub, qmul, qdiv, qneg, qabs, qcmp, isInt, mag, tx, nb, tail, V, sup, tag, ex, proc, nz, asQ, poly, polyAns, linAns } = B.kit.mid;
  const STD = '10공수1-01-01', UNIT = '10-1-1';
  // 만들기가 null 을 돌려주면 다시 만든다. 다 만든 문항은 seal 로 검사 근거를 마무리한다.
  const retry = (make) => (d, n) => { for (let i = 0; i < 3000; i += 1) { const item = make(d, n); if (item) return seal(item); } throw new Error('조건에 맞는 문항을 만들지 못했다'); };
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: (ref.startsWith('심') ? '수집본 심화 자료(' : '수집본 기본 자료(') + ref + ')', make: retry(make) }, more || {});
  const NOTE1 = ' <span style="white-space:nowrap">(단, 계수가 1이면 1을 적는다.)</span>';
  const GANA = ['㈎', '㈏', '㈐', '㈑'];

  // ── 검사 근거 마무리 ──
  // 문항에서 보이는 수(검사와 같은 방법으로 읽는다): 글·그림(그림 설명 포함)·보기
  const stripH = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  function visibleNumbers(item) {
    const seen = stripH([item.text, item.figure || ''].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, ' $1 ').replace(/<table[^>]*aria-label="([^"]*)"[^>]*>/g, ' $1 | '));
    return new Set((seen.match(/\d+/g) || []).concat(seen.match(/\d+\.\d+/g) || [], seen.replace(/(\d) (?=\d)/g, '$1').match(/\d+/g) || []));
  }
  // 다시 셈하는 식의 수 가운데 글에 보이지 않는 수를 facts.unseen 에 밝힌다. 0과 1(적지 않는 계수)과 o.derived 로 밝히기로 한 수만 된다.
  function seal(item) {
    const f = item.facts || {}, derived = new Set((f.derived || []).map(Number).concat([0, 1])), shown = visibleNumbers(item), out = new Set(f.unseen || []);
    const exprs = (f.calc || []).map(([t]) => t).concat(f.value !== undefined ? [f.value] : [], (f.choose && f.choose.exprs) || [], f.pick ? [f.pick.expr] : []);
    for (const t of exprs) for (const n of String(t).match(/\d+(?:\.\d+)?/g) || []) {
      if (shown.has(n)) continue;
      if (!derived.has(Number(n)) && !out.has(Number(n))) throw new Error('검사 식의 수 ' + n + ' 이 글에도 밝힌 수에도 없다: ' + t);
      out.add(Number(n));
    }
    delete f.derived;
    if (out.size) f.unseen = [...out]; else delete f.unseen;
    item.facts = f;
    return item;
  }

  // ── 식 글 ──
  // 문자가 든 식을 한 줄 글(식 글)로 적고, 그 글 하나에서 화면 글·값(다항식)·검사 식을 얻는다(9-1-3a.js 의 식 글을 본떠 이 단원에 다시 지었다).
  //  수 12 / 문자 x·A(한 글자) / 덧셈 + 뺄셈 - / 곱셈 기호 * (×) / 기호를 생략한 곱 2x · xy · 3(A-B) · AB / 거듭제곱 x^2 / 분수 [분자|분모] /
  //  괄호 ( ) · 중괄호 { } / 빈칸 ?(빈 네모)·㉠ ㉡(이름표 네모)
  const isBoxCh = (ch) => ch === '?' || (ch >= '㉠' && ch <= '㉯');
  function parse(src) {
    const s = String(src).replace(/\s+/g, ''); let i = 0;
    const fail = (why) => { throw new Error(`식 글 「${src}」: ${why}(${i}번째)`); };
    const eat = (ch) => { if (s[i] !== ch) fail(ch + ' 가 와야 한다'); i += 1; };
    function sum() { let a = term(); while (s[i] === '+' || s[i] === '-') { const op = s[i]; i += 1; a = { t: op === '+' ? 'add' : 'sub', a, b: term() }; } return a; }
    function term() { let a = neg(); while (s[i] === '*') { i += 1; a = { t: 'mul', a, b: neg() }; } return a; }
    function neg() { if (s[i] === '-') { i += 1; return { t: 'neg', a: neg() }; } return jux(); }
    function jux() { const list = [pow()]; while (i < s.length && (/[a-zA-Z({[]/.test(s[i]) || isBoxCh(s[i]))) list.push(pow()); return list.length === 1 ? list[0] : { t: 'jux', list }; }
    function pow() { const a = atom(); if (s[i] !== '^') return a; i += 1; const m = /^\d+/.exec(s.slice(i)); if (!m) fail('지수가 없다'); i += m[0].length; return { t: 'pow', a, n: Number(m[0]) }; }
    function atom() {
      const ch = s[i] || '';
      if (/\d/.test(ch)) { const m = /^\d+(\.\d+)?/.exec(s.slice(i)); i += m[0].length; return { t: 'num', s: m[0] }; }
      if (/[a-zA-Z]/.test(ch)) { i += 1; return { t: 'var', name: ch }; }
      if (isBoxCh(ch)) { i += 1; return { t: 'box', label: ch === '?' ? '' : ch }; }
      if (ch === '(' || ch === '{') { i += 1; const a = sum(); eat(ch === '(' ? ')' : '}'); return { t: 'par', a, br: ch }; }
      if (ch === '[') { i += 1; const a = sum(); eat('|'); const b = sum(); eat(']'); return { t: 'frac', a, b }; }
      return fail('읽지 못하는 글자 ' + ch);
    }
    const out = sum(); if (i !== s.length) fail('식이 끝나지 않았다'); return out;
  }
  const X = (src) => (typeof src === 'string' ? parse(src) : src);

  // ── 다항식 ──
  // 항 { q 계수(유리수), e { 문자: 지수 }, s 계수를 식 글의 수로 셈하는 검사 식 }. 다항식은 항의 배열이다(계수가 0인 항은 없다).
  const simpleS = (s) => /^\d+(\.\d+)?$/.test(s);
  const wrapS = (s) => (simpleS(s) ? s : '(' + s + ')');
  const mulS = (a, b) => (a === '1' ? b : b === '1' ? a : wrapS(a) + '*' + wrapS(b));
  const negS = (a) => (a.startsWith('-') && simpleS(a.slice(1)) ? a.slice(1) : '-' + wrapS(a));
  const addS = (a, b) => (b.startsWith('-') ? a + b : a + '+' + b);
  const numQ = (s) => { const k = (s.split('.')[1] || '').length; return Q(Math.round(Number(s) * 10 ** k), 10 ** k); };
  const term = (q, e, s) => ({ q, e, s });
  const keyOf = (e) => Object.keys(e).filter((k) => e[k]).sort().map((k) => k + e[k]).join('');
  function tMul(a, b) { const e = Object.assign({}, a.e); for (const k of Object.keys(b.e)) e[k] = (e[k] || 0) + b.e[k]; return term(qmul(a.q, b.q), e, mulS(a.s, b.s)); }
  function pAdd(a, b) {
    const out = a.slice();
    for (const t of b) {
      const k = keyOf(t.e), at = out.findIndex((u) => keyOf(u.e) === k);
      if (at < 0) { out.push(t); continue; }
      const q = qadd(out[at].q, t.q);
      if (q.p === 0) out.splice(at, 1); else out[at] = term(q, out[at].e, addS(out[at].s, t.s));
    }
    return out;
  }
  const pNeg = (a) => a.map((t) => term(qneg(t.q), t.e, negS(t.s)));
  const pSub = (a, b) => pAdd(a, pNeg(b));
  const pMul = (a, b) => a.reduce((sum, x) => pAdd(sum, b.map((y) => tMul(x, y))), []);
  function pPow(a, n) { let r = a; for (let i = 1; i < n; i += 1) r = pMul(r, a); return r; }
  function pDivNum(a, b) {
    if (b.length !== 1 || keyOf(b[0].e)) throw new Error('수가 아닌 식으로 나눌 수 없다');
    return a.map((t) => term(qdiv(t.q, b[0].q), t.e, wrapS(t.s) + '/' + wrapS(b[0].s)));
  }
  // 수 하나(검사 식 s 를 함께 준다)
  const num = (v, s) => (asQ(v).p === 0 ? [] : [term(asQ(v), {}, s == null ? (v < 0 ? '(' + v + ')' : String(v)) : s)]);
  // 값(다항식). env: { 문자: 수 또는 다항식 } — 문자에 수나 식을 넣는다.
  function valX(node, env) {
    const n = X(node), E = env || {}, v = (m) => valX(m, E);
    switch (n.t) {
      case 'num': { const q = numQ(n.s); return q.p === 0 ? [] : [term(q, {}, n.s)]; }
      case 'var': {
        const g = E[n.name];
        if (g == null) return [term(Q(1), { [n.name]: 1 }, '1')];
        if (Array.isArray(g)) return g;
        const q = asQ(g); return q.p === 0 ? [] : [term(q, {}, q.q === 1 ? (q.p < 0 ? '(' + q.p + ')' : String(q.p)) : '(' + q.p + '/' + q.q + ')')];
      }
      case 'add': return pAdd(v(n.a), v(n.b));
      case 'sub': return pSub(v(n.a), v(n.b));
      case 'mul': return pMul(v(n.a), v(n.b));
      case 'neg': return pNeg(v(n.a));
      case 'par': return v(n.a);
      case 'pow': return pPow(v(n.a), n.n);
      case 'frac': return pDivNum(v(n.a), v(n.b));
      case 'box': throw new Error('빈칸이 있는 식이다');
      default: return n.list.reduce((acc, t) => pMul(acc, v(t)), [term(Q(1), {}, '1')]);
    }
  }
  const xv = (src, env) => valX(src, env);
  const mk = (c, e) => { const q = asQ(c); return q.p === 0 ? [] : [term(q, Object.assign({}, e || {}), '')]; };
  const same = (a, b) => a.length === b.length && a.every((t) => { const u = b.find((w) => keyOf(w.e) === keyOf(t.e)); return Boolean(u) && qcmp(u.q, t.q) === 0; });
  const coefOf = (P, e) => { const t = P.find((u) => keyOf(u.e) === keyOf(e || {})); return t ? t.q : Q(0); };
  const termOf = (P, e) => P.find((u) => keyOf(u.e) === keyOf(e || {})) || null;
  // 한 문자 v 에 대한 차수와 그 차수의 계수
  const degIn = (P, v) => (P.length ? Math.max(...P.map((t) => t.e[v] || 0)) : -1);
  // 항의 차례: 차수가 큰 것부터, 차수가 같으면 알파벳이 앞선 문자의 지수가 큰 것부터(x², xy, y², x, y, 상수항).
  const letters = (t) => Object.keys(t.e).filter((k) => t.e[k]);
  const degOf = (t) => letters(t).reduce((s, k) => s + t.e[k], 0);
  function ordered(P) {
    const names = [...new Set(P.flatMap(letters))].sort();
    return P.slice().sort((a, b) => degOf(b) - degOf(a) || names.reduce((r, k) => r || (b.e[k] || 0) - (a.e[k] || 0), 0));
  }
  // 다항식의 나눗셈(문자 v 에 대하여). 몫과 나머지의 계수도 검사 식(s)을 가진다 — 나누는 식의 최고차항의 계수로 나누고 빼는 차례를 그대로 밟는다.
  function pDiv(A, Bd, v) {
    const w = v || 'x', db = degIn(Bd, w), lb = Bd.find((t) => (t.e[w] || 0) === db);
    if (Bd.some((t) => letters(t).some((k) => k !== w)) || A.some((t) => letters(t).some((k) => k !== w))) throw new Error('한 문자 다항식만 나눈다');
    let R = A.slice(), Qt = [];
    for (let guard = 0; R.length && degIn(R, w) >= db; guard += 1) {
      if (guard > 40) throw new Error('나눗셈이 끝나지 않는다');
      const dr = degIn(R, w), lr = R.find((t) => (t.e[w] || 0) === dr), k = dr - db;
      const t = term(qdiv(lr.q, lb.q), k ? { [w]: k } : {}, lb.s === '1' ? lr.s : wrapS(lr.s) + '/' + wrapS(lb.s));
      Qt = pAdd(Qt, [t]);
      R = pSub(R, Bd.map((b) => tMul(t, b)));
    }
    return { Q: Qt, R };
  }
  const varH = (e) => Object.keys(e).filter((k) => e[k]).sort().map((k) => V(k) + (e[k] > 1 ? sup(e[k]) : '')).join('');
  function termH(t) {
    const m = qabs(t.q), v = varH(t.e);
    if (m.q === 1) return m.p === 1 && v ? v : m.p + v;
    return frac(m.p, m.q) + v;
  }
  const signed = (list, inExpr) => list.map((t, i) => (i === 0 ? (t.q.p < 0 ? MINUS : '') : inExpr ? ` <i>${t.q.p < 0 ? MINUS : '+'}</i> ` : ` ${t.q.p < 0 ? MINUS : '+'} `) + termH(t)).join('');
  const ph = (P, inExpr) => (P.length ? signed(ordered(P), inExpr) : '0');
  const pt = (P) => nb(ph(P));
  // 정해 준 차례대로 적은 다항식(정리 문항의 보기)
  const asIs = (list) => nb(signed(list));

  // ── 화면 글 ──
  function htmlX(node, inExpr) {
    const n = X(node), op = (sym) => (inExpr ? ` <i>${sym}</i> ` : ` ${sym} `), h = (m) => htmlX(m, inExpr);
    switch (n.t) {
      case 'num': return n.s;
      case 'var': return V(n.name);
      case 'box': return box(n.label);
      case 'add': return h(n.a) + op('+') + h(n.b);
      case 'sub': return h(n.a) + op(MINUS) + h(n.b);
      case 'mul': return h(n.a) + op('×') + h(n.b);
      case 'neg': return MINUS + h(n.a);
      case 'par': return (n.br === '{' ? '{' : '(') + h(n.a) + (n.br === '{' ? '}' : ')');
      case 'pow': return h(n.a) + sup(n.n);
      case 'frac': return frac(h(n.a), h(n.b));
      default: return n.list.map(h).join('');
    }
  }
  const xh = (src) => nb(htmlX(src));                       // 글줄 속의 식
  const xe = (src) => htmlX(src, true);                     // 식 글꼴 안에 적는 글
  const xex = (src) => ex(xe(src));                         // 그림 자리에 크게 적는 식
  const xtagged = (rows, tags) => lines(rows.map((r, i) => tag((tags || LAB)[i]) + ex(xe(r))));

  // 식 뒤의 토씨: 끝이 거듭제곱이면 「제곱」, 문자이면 그 문자(엘·엠·엔·알만 받침이 있다), 수이면 그 수를 읽는 소리에 맞춘다. 분수는 분자를 나중에 읽는다.
  function ej(h, pair) {
    const [w, wo] = pair.split('/'), s = String(h).replace(/(<\/span>)+$/, ''), at = s.lastIndexOf('<span class="mb-frac">');
    if (at >= 0 && !s.slice(at).includes('</span></span>')) {
      const t = s.slice(at), top = t.slice('<span class="mb-frac"><span>'.length, t.indexOf('</span><span class="mb-frac-bar">/'));
      return h + ej(top, pair).slice(top.length);
    }
    if (/<\/sup>$/.test(s)) return h + w;
    const text = s.replace(/<[^>]+>/g, '').replace(/[)}\]]+$/, ''), last = text[text.length - 1], fracEnd = /(\d+)\/\d+$/.exec(text);
    if (fracEnd) return h + tail(Number(fracEnd[1]), pair);
    if (/\d/.test(last)) return h + tail(Number(/\d+$/.exec(text)[0]), pair);
    return h + ('lmnr'.includes(String(last).toLowerCase()) ? (w === '으로' && String(last).toLowerCase() === 'l' ? '로' : w) : wo);
  }
  const xj = (src, pair) => ej(xh(src), pair), pj = (P, pair) => ej(pt(P), pair);

  // ── 식 글을 짓는 도구 ──
  const magS = (q) => (q.q === 1 ? String(Math.abs(q.p)) : `[${Math.abs(q.p)}|${q.q}]`);
  // 다항식: pn([[3, 'x^2'], [-2, 'xy'], [5, '']]) → 3x^2-2xy+5 (계수 1은 적지 않고 0인 항은 뺀다)
  function pn(terms) {
    const live = terms.map(([c, v]) => [asQ(c), v]).filter(([c]) => c.p !== 0);
    if (!live.length) return '0';
    return live.map(([c, v], i) => (c.p < 0 ? '-' : i ? '+' : '') + (v && Math.abs(c.p) === 1 && c.q === 1 ? '' : magS(c)) + v).join('');
  }
  const mon = (v, k) => (k === 0 ? '' : k === 1 ? v : v + '^' + k);
  // 한 문자 다항식: 계수 [최고차, …, 상수항]
  const pc = (cs, v) => pn(cs.map((c, i) => [c, mon(v || 'x', cs.length - 1 - i)]));
  const sg = (c, v) => (c < 0 ? '-' : '+') + (Math.abs(c) === 1 && v ? '' : Math.abs(c)) + (v || '');   // 앞에 식이 있을 때 덧붙이는 항
  const srcOf = (P) => pn(ordered(P).map((t) => [t.q, letters(t).sort().map((k) => k + (t.e[k] > 1 ? '^' + t.e[k] : '')).join('')]));
  // 다시 읽은 다항식: 셈해서 얻은 식을 글로 적은 다음 다시 읽어, 검사 식이 화면에 적힌 계수가 되게 한다.
  const fresh = (P) => xv(srcOf(P));
  // 0이 아닌 정수 여럿
  const nzs = (d, k, lo, hi) => Array.from({ length: k }, () => nz(d, lo, hi));
  // 식 글의 단항식 → 열쇠: 'x^2y' → 'x2y1'
  const K = (m) => (m ? keyOf(valX(m)[0].e) : '');
  const keysOf = (P) => ordered(P).map((t) => keyOf(t.e));
  const hasKeys = (P, ms) => { const ks = keysOf(P); return ks.length === ms.length && ms.every((m, i) => K(m) === ks[i]); };
  const intCoefs = (P, lim) => P.every((t) => isInt(t.q) && Math.abs(t.q.p) <= (lim || 9999));

  // ── 결합식(A, B, C 의 식) ──
  // 결합식을 A, B, C 의 일차식으로 정리한 계수: { A: 3, B: -2 }
  const combOf = (src, names) => { const P = xv(src), out = {}; for (const k of names) out[k] = coefOf(P, { [k]: 1 }).p; return out; };
  const combH = (cf, names) => poly(names.map((k) => [cf[k], V(k)]));
  // 다항식 A, B, … 를 밝혀 적는 글: 「A = …, B = …」
  const defsH = (names, env) => names.map((k) => nb(`${V(k)} = ${ph(env[k])}`)).join(', ');

  // ── 답 ──
  // 답이 다항식인 문항: 항마다 「[±][ ]문자」. keys 는 답의 항(식 글의 단항식)을 적는 차례대로 — 한 유형 안에서는 늘 같게 짓는다.
  function polyA(text, P, keys, o) {
    const opt = o || {}, ord = ordered(P);
    if (!hasKeys(P, keys) || !intCoefs(P)) throw new Error('답의 항이 정한 것과 다르다: ' + ph(P));
    return polyAns(text + (opt.note ? ` <span style="white-space:nowrap">(단, ${opt.note}</span> <span style="white-space:nowrap">계수가 1이면 1을 적는다.)</span>` : NOTE1), ord.map((t) => [t.q.p, varH(t.e)]), {
      figure: opt.figure, explain: opt.explain,
      facts: Object.assign({ calc: ord.map((t, i) => [t.s, i]) }, opt.rule ? { rule: opt.rule } : {}, opt.derived ? { derived: opt.derived } : {})
    });
  }
  // 몫과 나머지를 답하는 문항: 「몫 [±][ ]x² [±][ ]x [±][ ], 나머지 [±][ ]x [±][ ]」. qk·rk 는 몫·나머지의 항(식 글의 단항식) — 한 유형 안에서 늘 같다.
  function divAns(text, Qp, Rp, qk, rk, o) {
    const opt = o || {}, q = ordered(Qp), r = ordered(Rp);
    if (!hasKeys(Qp, qk) || !hasKeys(Rp, rk) || !intCoefs(Qp) || !intCoefs(Rp)) throw new Error('몫과 나머지의 항이 정한 것과 다르다: ' + ph(Qp) + ' / ' + ph(Rp));
    // 항 하나(칸과 그 뒤의 문자)가 줄 끝에서 갈리지 않게 묶는다. 칸이 많아 좁은 화면에서는 항 사이에서 줄이 바뀐다.
    const slot = (list, from) => list.map((t, i) => grp2('{' + (from + i) + '}' + varH(t.e))).join(' ');
    const template = grp2('몫:') + ' ' + slot(q, 0) + ', ' + grp2('나머지:') + ' ' + slot(r, q.length);
    return inline(text + NOTE1, template, q.concat(r).map((t) => ({ answer: t.q.p, signed: true })), {
      shown: `몫: ${ph(Qp)}, 나머지: ${ph(Rp)}`, figure: opt.figure, explain: opt.explain,
      facts: Object.assign({ calc: q.concat(r).map((t, i) => [t.s, i]) }, opt.rule ? { rule: opt.rule } : {}, opt.derived ? { derived: opt.derived } : {})
    });
  }
  const grp2 = (h) => '<span style="white-space:nowrap">' + h + '</span>';
  // 수 하나를 답하는 문항(부호 단추를 단다). calc 는 글에 적힌 수로 답을 셈하는 식이다.
  const numQ1 = (text, answer, o) => N(text, answer, { signed: o.signed !== false, figure: o.figure, unit: o.unit, explain: o.explain, facts: Object.assign({ calc: [[o.calc, 0]] }, o.rule ? { rule: o.rule } : {}, o.derived ? { derived: o.derived } : {}) });
  // 수 여러 칸(문자 이름이나 ㉠, ㉡). rows: [이름표, 답, 검사 식]
  function slots(text, rows, o) {
    return M(text, rows.map(([label, answer]) => ({ label, answer, signed: true })), {
      figure: o.figure, explain: o.explain, facts: Object.assign({ calc: rows.map(([, , expr], i) => [expr, i]) }, o.rule ? { rule: o.rule } : {}, o.derived ? { derived: o.derived } : {})
    });
  }
  // 식을 고르는 문항. right: 정답(다항식), wrongs: 틀린 것의 후보(다항식) — 저마다 아이들이 하는 잘못 하나로 만든 식이다. 참·거짓은 식을 견주어 셈한다.
  function pickQ(d, text, R, wrongs, o) {
    const opt = o || {}, kept = [];
    for (const W of d.shuffle(wrongs)) {
      if (kept.length === 3) break;
      if (!W || same(W, R) || kept.some((k) => same(k, W))) continue;
      kept.push(W);
    }
    if (kept.length < 3) return null;
    const rows = d.shuffle([{ P: R, right: true }].concat(kept.map((P) => ({ P }))));
    return C(text, rows.map((r) => pt(r.P)), rows.findIndex((r) => r.right), {
      figure: opt.figure, explain: opt.explain, facts: Object.assign({ truth: rows.map((r) => Boolean(r.right)), want: true }, opt.rule ? { rule: opt.rule } : {})
    });
  }
  // 정수 계수 검사 식: 음수는 괄호에 넣는다.
  const jn = (n) => (n < 0 ? '(' + n + ')' : String(n));
  // 화면 글의 정수: 음수는 빼기표(−)와 괄호(jd), 맨 앞이면 괄호 없이(sd)
  const jd = (n) => (n < 0 ? '(' + MINUS + Math.abs(n) + ')' : String(n)), sd = (n) => (n < 0 ? MINUS + Math.abs(n) : String(n));

  // ── 그림 ──
  const INK = '#1f2933', SVG_ITALIC = "font-style:italic;font-family:'MB Math','Times New Roman',serif;font-size:1.1em";
  // 그림 속 글(식 글): 문자는 수식 글꼴의 기울인 글자로, 지수는 위로 올린 작은 글자로 적는다.
  function svgX(node) {
    const n = X(node), up = (e) => `<tspan dy="-5" style="font-size:0.72em">${e}</tspan><tspan dy="5">​</tspan>`;
    switch (n.t) {
      case 'num': return n.s;
      case 'var': return `<tspan style="${SVG_ITALIC}">${n.name}</tspan>`;
      case 'add': return svgX(n.a) + ' + ' + svgX(n.b);
      case 'sub': return svgX(n.a) + ' ' + MINUS + ' ' + svgX(n.b);
      case 'neg': return MINUS + svgX(n.a);
      case 'par': return '(' + svgX(n.a) + ')';
      case 'pow': return svgX(n.a) + up(n.n);
      case 'jux': return n.list.map(svgX).join('');
      default: throw new Error('그림 속 글로 적을 수 없는 식이다');
    }
  }
  // 그림 설명에 적는 글: 4x^2 + 1
  function plainX(node) {
    const n = X(node);
    switch (n.t) {
      case 'num': return n.s;
      case 'var': return n.name;
      case 'add': return plainX(n.a) + ' + ' + plainX(n.b);
      case 'sub': return plainX(n.a) + ' ' + MINUS + ' ' + plainX(n.b);
      case 'neg': return MINUS + plainX(n.a);
      case 'par': return '(' + plainX(n.a) + ')';
      case 'pow': return plainX(n.a) + '^' + n.n;
      default: return n.list.map(plainX).join('');
    }
  }
  const svg = (w, h, aria, body) => `<svg class="mb-geo" viewBox="0 0 ${w} ${h}" width="${w}" role="img" aria-label="${aria}">${body}</svg>`;
  const word = (x, y, text, anchor, size) => `<text x="${x}" y="${y}" text-anchor="${anchor || 'middle'}" style="font-size:${size || 13}px;font-weight:600;fill:${INK}">${text}</text>`;
  const label = (x, y, src, anchor, size) => `<text x="${x}" y="${y}" text-anchor="${anchor || 'middle'}" style="font-size:${size || 13}px;font-weight:600;fill:${INK}">${svgX(src)}</text>`;

  // ════════════════════════════════════════════════════════════════
  // ── 다항식의 덧셈과 뺄셈(정리 포함) ──
  // 한 문자 다항식의 항: [계수, 차수]
  const oneTerm = (c, k, v) => term(Q(c), k ? { [v]: k } : {}, String(c));
  const addTypes = [
    T('order-arrange', '한 문자 다항식을 내림차순·오름차순으로 정리하기', '①1', (d, n) => {
      // 3차부터 상수항까지 네 항을 섞어 적은 다항식. 틀린 보기: 반대 차례, 계수의 크기 차례, 이웃한 두 항을 바꾼 차례.
      const cs = nzs(d, 4, -9, 9), v = 'x', terms = cs.map((c, i) => oneTerm(c, 3 - i, v));
      const mixed = d.shuffle(terms);
      if (mixed.every((t, i) => t === terms[i]) || mixed.every((t, i) => t === terms[3 - i])) return null;
      const down = terms.slice(), up = terms.slice().reverse(), want = n === 0 ? down : up, other = n === 0 ? up : down;
      const bySize = terms.slice().sort((a, b) => Math.abs(b.q.p) - Math.abs(a.q.p) || degOf(b) - degOf(a));
      const swap = want.slice(); const at = d.int(0, 2); [swap[at], swap[at + 1]] = [swap[at + 1], swap[at]];
      const rows = [want, other, bySize, swap].map((list) => asIs(list));
      if (new Set(rows).size !== 4) return null;
      const order = d.shuffle([0, 1, 2, 3]), shown = order.map((i) => rows[i]);
      const word2 = n === 0 ? '내림차순' : '오름차순';
      return C(`다항식 ${ej(asIs(mixed), '을/를')} ${V('x')}에 대하여 ${word2}으로 정리한 것은?`, shown, order.indexOf(0), {
        explain: `${word2}은 ${n === 0 ? '차수가 높은 항부터 낮은 항의 차례' : '차수가 낮은 항부터 높은 항의 차례'}로 적는 것이다. 상수항의 차수는 0이므로 ${n === 0 ? '맨 뒤' : '맨 앞'}에 온다. 따라서 ${rows[0]}이다.`,
        facts: { truth: order.map((i) => i === 0), want: true, rule: 'arrange-' + n }
      });
    }, { count: 2 }),
    T('order-letter', '두 문자가 든 다항식을 한 문자에 대하여 정리하기', '①2', (d, n) => {
      // p x² + a xy + c y² + b x + e y + f
      const [p, a, c, b, e, f] = [d.pick([1, 2, 3, -1, -2]), nz(d, -6, 6), nz(d, -5, 5), nz(d, -7, 7), nz(d, -7, 7), nz(d, -9, 9)];
      if (a === b || e === f) return null;
      const src = d.shuffle([[p, 'x^2'], [a, 'xy'], [c, 'y^2'], [b, 'x'], [e, 'y'], [f, '']]);
      const P = xv(pn(src)), mixedH = xh(pn(src));
      const yLin = (k, m) => poly([[k, V('y')], [m, '']]), xLin = (k, m) => poly([[k, V('x')], [m, '']]);
      if (n === 0) {
        // x 에 대하여 정리할 때 x 의 계수: a y + b
        const ta = termOf(P, { x: 1, y: 1 }), tb = termOf(P, { x: 1 });
        return linAns(`다항식 ${ej(mixedH, '을/를')} ${V('x')}에 대하여 내림차순으로 정리할 때, ${V('x')}의 계수는?`, a, b, V('y'), {
          explain: `${V('y')}를 수처럼 보고 ${V('x')}의 차수가 같은 항끼리 모은다. ${nb(`${mono2(p, V('x') + sup(2))} + (${yLin(a, b)})${V('x')} + (${poly([[c, V('y') + sup(2)], [e, V('y')], [f, '']])})`)}이므로 ${V('x')}의 계수는 ${nb(yLin(a, b))}이다.`,
          facts: { calc: [[ta.s, 0], [tb.s, 1]], rule: 'letter-coef' }
        });
      }
      // y 에 대하여 오름차순으로 정리한 것 고르기
      // 보기는 묶음(괄호와 그 뒤의 문자)마다 줄바꿈을 막고, 묶음 사이에서는 좁은 화면에서 줄이 바뀔 수 있게 한다.
      const g0 = poly([[p, V('x') + sup(2)], [b, V('x')], [f, '']]), g1 = xLin(a, e), y2 = nb(`${Math.abs(c) === 1 ? '' : Math.abs(c)}${V('y')}${sup(2)}`);
      const right = `${nb(`(${g0})`)} + ${nb(`(${g1})${V('y')}`)} ${c < 0 ? MINUS : '+'} ${y2}`;
      const rows = [
        right,
        `${c < 0 ? MINUS : ''}${y2} + ${nb(`(${g1})${V('y')}`)} + ${nb(`(${g0})`)}`,
        `${nb(mono2(p, V('x') + sup(2)))} + ${nb(`(${yLin(a, b)})${V('x')}`)} + ${nb(`(${poly([[c, V('y') + sup(2)], [e, V('y')], [f, '']])})`)}`,
        `${f < 0 ? MINUS : ''}${Math.abs(f)} + ${nb(`(${poly([[b, V('x')], [e, V('y')]])})`)} + ${nb(`(${poly([[p, V('x') + sup(2)], [a, V('x') + V('y')], [c, V('y') + sup(2)]])})`)}`
      ];
      const order = d.shuffle([0, 1, 2, 3]);
      return C(`다항식 ${ej(mixedH, '을/를')} ${V('y')}에 대하여 오름차순으로 정리한 것은?`, order.map((i) => rows[i]), order.indexOf(0), {
        explain: `${V('x')}를 수처럼 보고 ${V('y')}의 차수가 같은 항끼리 모아 차수가 낮은 것부터 적는다. ${V('y')}가 없는 항 ${nb(g0)}, ${V('y')}의 일차항 ${nb(`(${g1})${V('y')}`)}, ${V('y')}의 이차항의 차례이므로 ${right}이다.`,
        facts: { truth: order.map((i) => i === 0), want: true, rule: 'letter-order' }
      });
    }, { count: 2 }),
    T('add-sum', '두 다항식의 합과 차(삼차식)', '①3', (d, n) => {
      // 빠진 차수가 있는 삼차식 둘. 결과는 네 항이 모두 있다.
      const skipA = d.pick([1, 2]), skipB = skipA === 1 ? 2 : 1;
      const ca = nzs(d, 4, -7, 7), cb = nzs(d, 4, -7, 7); ca[skipA] = 0; cb[skipB] = 0;
      const env = { A: xv(pc(ca)), B: xv(pc(cb)) }, src = n === 0 ? 'A+B' : 'A-B', R = xv(src, env);
      if (!hasKeys(R, ['x^3', 'x^2', 'x', ''])) return null;
      return polyA(`두 다항식 ${defsH(['A', 'B'], env)}에 대하여 ${xj(src, '을/를')} 계산하시오.`, R, ['x^3', 'x^2', 'x', ''], {
        rule: 'sum-' + n,
        explain: (n === 0 ? '동류항끼리 모아서 계산한다. ' : '빼는 식의 각 항의 부호를 바꾸어 더한다. ') + `${xh(src)} = (${ph(env.A)}) ${n === 0 ? '+' : MINUS} (${ph(env.B)}) = ${ph(R)}이다.`
      });
    }, { count: 2 }),
    T('add-xy', '두 문자 다항식을 실수배 하여 더하고 빼기', '①4', (d, n) => {
      const keys = ['x^2', 'xy', 'y^2'];
      const env = { A: xv(pn(nzs(d, 3, -5, 5).map((c, i) => [c, keys[i]]))), B: xv(pn(nzs(d, 3, -5, 5).map((c, i) => [c, keys[i]]))) };
      const [p, q] = [d.int(1, 3), d.int(2, 3)], src = n === 0 ? `${p === 1 ? '' : p}A+${q}B` : `${d.int(2, 3)}A-${q}B`, R = xv(src, env);
      if (!hasKeys(R, keys)) return null;
      return polyA(`두 다항식 ${defsH(['A', 'B'], env)}에 대하여 ${xj(src, '을/를')} 계산하시오.`, R, keys, {
        rule: 'xy-' + n, explain: `${xh(src)} = ${subH(combOf(src, ['A', 'B']), ['A', 'B'], env)} = ${ph(R)}이다.`
      });
    }, { count: 2 }),
    T('add-simplify', '결합한 식을 먼저 정리하고 다항식을 넣기', '①5 심1', (d) => {
      const forms = [() => `(A+${d.int(2, 3)}B)-(${d.int(2, 3)}A-B)`, () => `${d.int(2, 3)}(A-B)+(A+${d.int(2, 4)}B)`, () => `${d.int(2, 3)}B-(A-B)`, () => `(${d.int(2, 3)}A+B)+(A-${d.int(2, 4)}B)`, () => `(${d.int(2, 3)}A-B)-${d.int(2, 3)}(A-B)`];
      const src = d.pick(forms)(), cf = combOf(src, ['A', 'B']);
      if (!cf.A || !cf.B) return null;
      const ca = nzs(d, 4, -6, 6), cb = nzs(d, 4, -6, 6); ca[d.pick([1, 2])] = 0;
      const env = { A: xv(pc(ca)), B: xv(pc(cb)) }, R = xv(src, env);
      if (!hasKeys(R, ['x^3', 'x^2', 'x', ''])) return null;
      return polyA(`두 다항식 ${defsH(['A', 'B'], env)}에 대하여 ${xj(src, '을/를')} 계산하시오.`, R, ['x^3', 'x^2', 'x', ''], {
        explain: `먼저 ${V('A')}, ${V('B')}에 대하여 정리하면 ${xh(src)} = ${nb(combH(cf, ['A', 'B']))}이다. 여기에 다항식을 넣으면 ${subH(cf, ['A', 'B'], env)} = ${ph(R)}이다.`
      });
    }),
    T('add-three', '세 다항식의 결합', '①6', (d, n) => {
      if (n === 0) {
        // 두 문자 이차식 셋
        const keys = ['x^2', 'xy', 'y^2'], mkP = () => xv(pn(nzs(d, 3, -5, 5).map((c, i) => [c, keys[i]])));
        const forms = [() => `A-(B-${d.int(2, 3)}C)`, () => `(${d.int(2, 3)}A+${d.int(2, 3)}B)-(${d.int(2, 4)}B-C)`, () => `${d.int(2, 3)}C-(${d.int(2, 3)}A-${d.int(2, 3)}B)-${d.int(2, 4)}B`, () => `(${d.int(2, 4)}A-B)+${d.int(2, 3)}(C-A)`];
        const src = d.pick(forms)(), cf = combOf(src, ['A', 'B', 'C']);
        if (!cf.A || !cf.B || !cf.C) return null;
        const env = { A: mkP(), B: mkP(), C: mkP() }, R = xv(src, env);
        if (!hasKeys(R, keys)) return null;
        return polyA(`세 다항식 ${defsH(['A', 'B', 'C'], env)}에 대하여 ${xj(src, '을/를')} 계산하시오.`, R, keys, {
          rule: 'three-xy', explain: `먼저 정리하면 ${xh(src)} = ${nb(combH(cf, ['A', 'B', 'C']))}이다. 다항식을 넣으면 ${subH(cf, ['A', 'B', 'C'], env)} = ${ph(R)}이다.`
        });
      }
      // 삼차식 셋 — 정리하면 한 다항식이 사라진다.
      const k = d.int(2, 3), forms = [`(${k}A-B)-${k}(A+C)`, `(A+${k}B)-(A-C)`, `${k}(B-C)+(A-${k}B)`], src = d.pick(forms), cf = combOf(src, ['A', 'B', 'C']);
      const gone = ['A', 'B', 'C'].filter((name) => !cf[name]);
      if (gone.length !== 1) return null;
      const mk3 = () => { const cs = nzs(d, 4, -6, 6); cs[d.pick([1, 2, 3])] = 0; return xv(pc(cs)); };
      const env = { A: mk3(), B: mk3(), C: mk3() }, R = xv(src, env), live = ['A', 'B', 'C'].filter((name) => cf[name]);
      if (!hasKeys(R, ['x^3', 'x^2', 'x', ''])) return null;
      return polyA(`세 다항식 ${defsH(['A', 'B', 'C'], env)}에 대하여 ${xj(src, '을/를')} 계산하시오.`, R, ['x^3', 'x^2', 'x', ''], {
        rule: 'three-cancel', explain: `먼저 정리하면 ${xh(src)} = ${nb(combH(cf, live))}이므로 다항식 ${V(gone[0])}는 넣을 필요가 없다. ${subH(cf, live, env)} = ${ph(R)}이다.`
      });
    }, { count: 2 }),
    T('add-nested', '여러 겹 괄호가 있는 세 다항식의 결합', '①7', (d) => {
      const [p, q, r, s, t, u, w] = [d.int(2, 5), d.int(2, 3), d.int(2, 3), d.int(2, 4), d.int(2, 3), d.int(2, 3), d.int(2, 4)];
      const src = `${p}A-${q}{A-${r}(B-${s}C)}-${t}(${u}B-${w}C)`, cf = combOf(src, ['A', 'B', 'C']);
      if (!cf.A || !cf.B || !cf.C || Math.abs(cf.B) > 9 || Math.abs(cf.C) > 9) return null;
      const keys = ['x^2', 'xy', 'y^2'], mkP = () => xv(pn(nzs(d, 3, -4, 4).map((c, i) => [c, keys[i]])));
      const env = { A: mkP(), B: mkP(), C: mkP() }, R = xv(src, env);
      if (!hasKeys(R, keys)) return null;
      // 식이 길어 글줄 속에 두면 좁은 화면에서 넘치므로 그림 자리에 크게 적는다(글씨 크기를 화면에 맞춘다).
      return polyA(`세 다항식 ${defsH(['A', 'B', 'C'], env)}에 대하여 다음 식을 계산하시오.`, R, keys, {
        figure: ex(xe(src), 4),
        explain: `안쪽 괄호부터 풀어 정리하면 주어진 식은 ${nb(combH(cf, ['A', 'B', 'C']))}이다. 다항식을 넣으면 ${subH(cf, ['A', 'B', 'C'], env)} = ${ph(R)}이다.`
      });
    }),
    T('add-find-x', '등식을 만족시키는 다항식 X 구하기', '①8 심2', (d, n) => {
      // n = 0: X 가 괄호 안에 있다. n = 1: X 앞에 수가 곱해져 있다.
      const forms = n === 0 ? ['A-2(X-B)=3A', 'A-2(X+B)=3A-6B', 'A+3(X-B)=4A', 'B-2(X-A)=A+B', 'A-3(X+B)=4A-9B'] : ['2X-(A+3B)=A-B', '(A+B)+2X=3(A-B)', '4A-X=2B-A', '2X-3A=B', 'A-2X=B', '3X+A=2(A+3B)'];
      const eq = d.pick(forms), [L, Rt] = eq.split('='), diff = xv(`${L}-(${Rt})`);
      // 등식을 kX + aA + bB = 0 으로 옮기면 X = αA + βB (α = −a/k, β = −b/k). 검사 식의 α, β 는 등식에 적힌 수로 셈한다(coefS).
      const k = coefOf(diff, { X: 1 }), alpha = qdiv(qneg(coefOf(diff, { A: 1 })), k), beta = qdiv(qneg(coefOf(diff, { B: 1 })), k);
      const keys = ['x^2', 'xy', 'y^2'], mkP = () => xv(pn(nzs(d, 3, -5, 5).map((c, i) => [c, keys[i]])));
      const env = { A: mkP(), B: mkP() };
      const part = (c, name) => (c.p === 0 ? [] : pMul(num(c, coefS(eq, name)), env[name]));
      const ans = pAdd(part(alpha, 'A'), part(beta, 'B'));
      if (!hasKeys(ans, keys) || !intCoefs(ans)) return null;
      const cf = { A: alpha, B: beta }, live = ['A', 'B'].filter((name) => cf[name].p !== 0);
      return polyA(`두 다항식 ${defsH(['A', 'B'], env)}에 대하여 ${ej(nb(xh(L) + ' = ' + xh(Rt)), '을/를')} 만족시키는 다항식 ${V('X')}는?`, ans, keys, {
        rule: 'find-x-' + n,
        explain: `등식을 ${V('X')}에 대하여 풀면 ${nb(`${V('X')} = ${combH(cf, live)}`)}이다. 다항식을 넣으면 ${V('X')} = ${subH(cf, live, env)} = ${ph(ans)}이다.`
      });
    }, { count: 2 }),
    T('add-from-sums', '두 결합식이 주어질 때 다른 결합식', '①9', (d, n) => {
      // [a1 A + b1 B = P, a2 A + b2 B = Q] 에서 c1 A + c2 B
      const sys = n === 0 ? [[1, 1, 1, -1]] : [[2, 3, 3, -2], [2, 1, 1, -1], [1, 2, 2, -1], [3, 1, 1, -2]];
      const [a1, b1, a2, b2] = d.pick(sys), want = d.pick(n === 0 ? [[1, 2], [2, 1], [3, 2], [2, 3]] : [[3, 2], [1, 4], [2, -1], [1, 3]].filter(([u, v]) => !(u === a1 && v === b1) && !(u === a2 && v === b2)));
      const keys = n === 0 ? ['x^2', 'xy', 'y^2'] : ['x^3', 'x^2', 'x', ''];
      const mkP = () => (n === 0 ? xv(pn(nzs(d, 3, -5, 5).map((c, i) => [c, keys[i]]))) : (() => { const cs = nzs(d, 4, -5, 5); cs[d.pick([1, 2])] = 0; return xv(pc(cs)); })());
      const A0 = mkP(), B0 = mkP(), P = fresh(pAdd(pMul(num(a1), A0), pMul(num(b1), B0))), Qp = fresh(pAdd(pMul(num(a2), A0), pMul(num(b2), B0)));
      if (!P.length || !Qp.length) return null;
      const lhs1 = combH({ A: a1, B: b1 }, ['A', 'B']), lhs2 = combH({ A: a2, B: b2 }, ['A', 'B']);
      // 크라메르: A = (b2 P − b1 Q)/det, B = (a1 Q − a2 P)/det — 검사 식의 수는 등식의 계수(글에 적힌 수)로만 적는다.
      const sA = (x) => (x === 1 ? '1' : String(Math.abs(x))), det = a1 * b2 - a2 * b1, detS = `${jn(a1)}*${jn(b2)}-${jn(a2)}*${jn(b1)}`;
      const ofs = (x) => num(x, x < 0 ? '(-' + sA(x) + ')' : sA(x));
      const Ap = pDivNum(pSub(pMul(ofs(b2), P), pMul(ofs(b1), Qp)), [term(Q(det), {}, detS)]);
      const Bp = pDivNum(pSub(pMul(ofs(a1), Qp), pMul(ofs(a2), P)), [term(Q(det), {}, detS)]);
      if (!same(Ap, A0) || !same(Bp, B0)) return null;
      const target = poly([[want[0], V('A')], [want[1], V('B')]]), R = pAdd(pMul(ofs(want[0]), Ap), pMul(ofs(want[1]), Bp));
      if (!hasKeys(R, keys) || !intCoefs(R)) return null;
      return polyA(`두 다항식 ${V('A')}, ${V('B')}에 대하여 ${nb(lhs1 + ' =')} ${pt(P)}, ${nb(lhs2 + ' =')} ${pt(Qp)}일 때, ${ej(nb(target), '을/를')} 계산하시오.`, R, keys, {
        rule: 'sums-' + n,
        explain: `두 등식을 ${V('A')}, ${V('B')}에 대한 연립방정식처럼 풀면 ${V('A')} = ${ph(A0)}, ${V('B')} = ${ph(B0)}이다. 따라서 ${nb(target)} = ${ph(R)}이다.`
      });
    }, { count: 2 }),
    T('add-box-chain', '연산 상자 그림의 빈칸(거꾸로 두 번)', '①10', (d) => {
      const k = d.pick([2, 3]);
      const cubic = (zero) => { const cs = nzs(d, 4, -6, 6); if (zero != null) cs[zero] = 0; return xv(pc(cs)); };
      const G = cubic(), P1 = cubic(d.pick([1, 2])), P2 = fresh(cubic(d.pick([0, 1, 2])).slice());
      const H = pAdd(P1, pMul(num(k), G)), P3 = fresh(pAdd(H, pMul(num(k), P2)));
      const P1f = fresh(P1);
      if (!hasKeys(G, ['x^3', 'x^2', 'x', '']) || !intCoefs(P3, 40) || P3.length < 2) return null;
      // 거꾸로: (나) = P3 − k P2, (가) = ((나) − P1)/k
      const Hb = pSub(P3, pMul(num(k), P2)), Gb = pDivNum(pSub(Hb, P1f), num(k));
      if (!same(Gb, G)) return null;
      const fig = boxChain(k, [srcOf(P1f), '㈎', '㈏'], ['㈏', srcOf(P2), srcOf(P3)]);
      return polyA(`두 다항식 ${V('A')}, ${V('B')}를 넣으면 ${nb(`${V('A')} + ${k}${V('B')}`)}가 나오는 상자가 있다. 다음 그림과 같이 상자 두 개를 이었을 때, ㈎에 알맞은 다항식은?`, Gb, ['x^3', 'x^2', 'x', ''], {
        figure: fig, explain: `뒤의 상자에서 ${nb(`㈏ + ${k} × (${ph(P2)}) = ${ph(P3)}`)}이므로 ㈏ = ${ph(Hb)}이다. 앞의 상자에서 ${nb(`(${ph(P1f)}) + ${k} × ㈎ = ㈏`)}이므로 ㈎ = ${ph(Gb)}이다.`
      });
    }),
    T('add-cube-faces', '정육면체의 마주 보는 면에 적힌 다항식', '①11', (d) => {
      const cubic = () => { const cs = nzs(d, 4, -5, 5); cs[d.pick([1, 2])] = 0; return xv(pc(cs)); };
      const S = cubic(), P1 = cubic(), P2 = cubic(), P3 = cubic(), ans0 = pSub(S, P1);
      if (!hasKeys(ans0, ['x^3', 'x^2', 'x', '']) || same(P1, P2) || same(P2, P3) || same(P1, P3)) return null;
      const H = fresh(pSub(pMul(num(3), S), pAdd(pAdd(P1, P2), P3)));
      if (H.length < 2) return null;
      const [Pa, Pb, Pc] = [fresh(P1), fresh(P2), fresh(P3)];
      // 여섯 면의 합 = (보이는 세 면) + (나머지 세 면), 한 쌍의 합 = 그 3분의 1
      const pair = pDivNum(pAdd(pAdd(pAdd(Pa, Pb), Pc), H), [term(Q(3), {}, '3')]), ans = pSub(pair, Pa);
      return polyA(`정육면체의 여섯 면에 다항식이 하나씩 적혀 있고, 마주 보는 두 면에 적힌 다항식의 합은 세 쌍 모두 같다. 한 꼭짓점에 모인 세 면에 적힌 다항식이 ${pt(Pa)}, ${pt(Pb)}, ${pt(Pc)}이고, 나머지 세 면에 적힌 다항식의 합이 ${pt(H)}일 때, ${ej(pt(Pa), '이/가')} 적힌 면과 마주 보는 면에 적힌 다항식은?`, ans, ['x^3', 'x^2', 'x', ''], {
        derived: [3],
        explain: `여섯 면에 적힌 다항식의 합은 ${pt(pAdd(pAdd(pAdd(Pa, Pb), Pc), H))}이고, 마주 보는 쌍이 셋이므로 한 쌍의 합은 그 3분의 1인 ${pt(pair)}이다. 따라서 구하는 다항식은 ${nb(`(${ph(pair)}) − (${ph(Pa)})`)} = ${ph(ans)}이다.`
      });
    }),
    T('add-laws', '덧셈의 계산 과정에 쓰인 교환법칙·결합법칙', '①12', (d) => {
      // (a x³ + x + b) + (c x − e) = a x³ + x + (b + c x) − e = a x³ + x + (c x + b) − e = a x³ + (x + c x) + (b − e)
      const [a, b, c, e] = [d.int(2, 9), d.int(2, 9), d.int(2, 9), d.int(2, 15)];
      if (b === c || b - e === 0) return null;
      const X3 = V('x') + sup(3), Xv = V('x');
      const rows = [
        { h: `(${a}${X3} + ${Xv} + ${b}) + (${c}${Xv} ${MINUS} ${e})` },
        { h: `${a}${X3} + ${Xv} + (${b} + ${c}${Xv}) ${MINUS} ${e}`, mark: '㈎' },
        { h: `${a}${X3} + ${Xv} + (${c}${Xv} + ${b}) ${MINUS} ${e}`, mark: '㈏' },
        { h: `${a}${X3} + (${Xv} + ${c}${Xv}) + (${b} ${MINUS} ${e})`, mark: '㈐' },
        { h: `${a}${X3} + ${c + 1}${Xv} ${b - e < 0 ? MINUS : '+'} ${Math.abs(b - e)}` }
      ];
      const triples = [['결합법칙', '교환법칙', '결합법칙'], ['교환법칙', '결합법칙', '교환법칙'], ['교환법칙', '교환법칙', '결합법칙'], ['결합법칙', '결합법칙', '교환법칙']];
      const order = d.shuffle([0, 1, 2, 3]);
      return C('다음은 다항식의 덧셈을 계산하는 과정이다. ㈎, ㈏, ㈐에 쓰인 덧셈에 대한 성질을 차례로 고른 것은?', order.map((i) => triples[i].join(', ')), order.indexOf(0), {
        figure: proc(rows),
        explain: '㈎는 괄호의 자리를 바꾸었으므로 결합법칙, ㈏는 괄호 안 두 항의 차례를 바꾸었으므로 교환법칙, ㈐는 동류항끼리 묶이게 괄호의 자리를 바꾸었으므로 결합법칙이다.',
        facts: { truth: order.map((i) => i === 0), want: true }
      });
    })
  ];
  // 계수의 크기를 글로(1은 적지 않는다)
  function mono2(c, v) { return (c < 0 ? MINUS : '') + (Math.abs(c) === 1 ? '' : Math.abs(c)) + v; }
  // 등식의 글에서 문자 앞의 계수를 다시 셈하는 검사 식: 등식을 X 에 대하여 푼 계수 −(A 의 계수)/(X 의 계수)를 글에 적힌 수로 적는다.
  function coefS(eq, name) {
    const [L, Rt] = eq.split('='), diff = xv(`${L}-(${Rt})`), t = termOf(diff, { [name]: 1 }), k = termOf(diff, { X: 1 });
    return `-(${t.s})/(${k.s})`;
  }
  // 정리한 결합식에 다항식을 넣은 글(계수가 분수여도 된다)
  function subH(cf, names, env) {
    const live = names.filter((k) => asQ(cf[k]).p !== 0);
    // 항(수 × 괄호)마다 묶고 항 사이에서는 줄이 바뀔 수 있게 한다.
    return live.map((k, i) => { const c = asQ(cf[k]), m = qabs(c), body = (m.p === 1 && m.q === 1 ? '' : mag(m)) + '(' + ph(env[k]) + ')'; return i === 0 ? nb((c.p < 0 ? MINUS : '') + body) : (c.p < 0 ? ` ${MINUS} ` : ' + ') + nb(body); }).join('');
  }

  // 연산 상자 그림: 위 칸·아래 칸에 넣으면 오른쪽 칸에 (위) + k(아래)가 나온다. rows: [위, 아래, 결과](식 글이나 ㈎·㈏)
  function boxChain(k, first, second) {
    // 상자 하나: 위의 왼쪽 칸과 오른쪽 칸에 넣은 두 식이 아래 칸으로 나온다(휴대폰 너비에 맞게 위아래로 쌓는다).
    const H = 26, boxAt = (x, y, w, text, faint) => `<rect x="${x}" y="${y}" width="${w}" height="${H}" rx="4" style="fill:${faint ? '#fff' : '#f8fafc'};stroke:${faint ? '#64748b' : INK};stroke-width:1.2"/>`
      + (/^[㈎㈏]$/.test(text) ? word(x + w / 2, y + 18, text) : label(x + w / 2, y + 18, text, 'middle', 12.5));
    const machine = (top, rows, faint) => {
      const ink = faint ? '#64748b' : INK, yb = top + H, yj = top + H + 11, yo = top + H + 24;
      return boxAt(4, top, 136, rows[0], faint) + boxAt(148, top, 136, rows[1], faint)
        + `<path d="M72 ${yb}V${yj}H216V${yb}M144 ${yj}V${yo - 7}" style="fill:none;stroke:${ink};stroke-width:1.1"/><path d="M144 ${yo}l-3.4 -7h6.8z" style="fill:${ink}"/>`
        + boxAt(44, yo, 200, rows[2], faint);
    };
    const step = 2 * H + 24 + 14, body = machine(4, ['A', 'B', `A+${k}B`], true) + machine(4 + step, first) + machine(4 + 2 * step, second);
    const say = (r) => r.map((s) => (/^[㈎㈏]$/.test(s) ? s : plainX(s)));
    const [a, b, c] = say(first), [e, f, g] = say(second);
    return svg(288, 4 + 3 * step - 10, `상자 그림: 상자는 왼쪽 칸의 A와 오른쪽 칸의 B를 받아 아래 칸에 A + ${k}B를 내놓는다. 첫째 상자: 왼쪽 칸 ${a}, 오른쪽 칸 ${b}, 아래 칸 ${c}. 둘째 상자: 왼쪽 칸 ${e}, 오른쪽 칸 ${f}, 아래 칸 ${g}.`, body);
  }

  // ── 다항식의 곱셈 ──
  const mulTypes = [
    T('mul-expand', '(다항식)×(다항식)의 전개', '①15', (d, n) => {
      if (n === 0) {
        const src = `(${pc([d.int(1, 4), nz(d, -6, 6)])})(${pc(nzs(d, 3, -5, 5))})`, R = xv(src);
        if (!hasKeys(R, ['x^3', 'x^2', 'x', ''])) return null;
        return polyA('다음 식을 전개하시오.', R, ['x^3', 'x^2', 'x', ''], { figure: xex(src), rule: 'expand-13', explain: `분배법칙을 이용하여 전개한 다음 동류항끼리 모은다. ${xh(src)} = ${signed(rawProd(src))} = ${ph(R)}이다.` });
      }
      const src = `(${pc([d.int(1, 3), nz(d, -5, 5), nz(d, -6, 6)])})(${pc([d.int(1, 3), nz(d, -5, 5), nz(d, -6, 6)])})`, R = xv(src);
      if (!hasKeys(R, ['x^4', 'x^3', 'x^2', 'x', ''])) return null;
      return polyA('다음 식을 전개하시오.', R, ['x^4', 'x^3', 'x^2', 'x', ''], { figure: xex(src), rule: 'expand-22', explain: `분배법칙을 이용하여 전개한 다음 동류항끼리 모은다. ${xh(src)} = ${signed(rawProd(src))} = ${ph(R)}이다.` });
    }, { count: 2 }),
    T('mul-expand-xy', '두 문자 다항식의 곱의 전개', '①16', (d) => {
      const src = `(${pn([[d.int(1, 3), 'x^2'], [nz(d, -4, 4), 'xy'], [nz(d, -4, 4), 'y^2']])})(${pn([[d.int(1, 3), 'x'], [nz(d, -4, 4), 'y']])})`, R = xv(src), keys = ['x^3', 'x^2y', 'xy^2', 'y^3'];
      if (!hasKeys(R, keys)) return null;
      return polyA('다음 식을 전개하시오.', R, keys, { figure: xex(src), explain: `분배법칙으로 전개한 다음 동류항끼리 모은다. ${xh(src)} = ${signed(rawProd(src))} = ${ph(R)}이다.` });
    }),
    T('mul-laws-first', '곱셈에 대한 성질로 식을 먼저 정리하기', '①17', (d, n) => {
      const quad2 = () => d.pick([() => pn([[d.int(1, 2), 'x^2'], [nz(d, -4, 4), 'x']]), () => pn([[d.int(1, 2), 'x^2'], [nz(d, -5, 5), '']]), () => pn([[d.int(1, 3), 'x'], [nz(d, -5, 5), '']])])();
      const names = n === 0 ? ['A', 'B'] : ['A', 'B', 'C'], env = {};
      for (const k of names) env[k] = xv(quad2());
      if (names.some((a, i) => names.some((b, j) => j > i && same(env[a], env[b])))) return null;
      const forms = n === 0 ? [['2AB-BA', 'AB'], ['AB-3BA', '-2AB'], ['3AB-2BA', 'AB'], ['BA+2AB', '3AB']] : [['A(B+C)-B(A-C)', '(A+B)C'], ['A(B-C)+C(A+B)', 'B(A+C)'], ['B(A+C)-C(B-A)', 'A(B+C)']];
      const [src, short] = d.pick(forms), R = xv(src, env);
      // 칸의 모양: 차례마다 같게 x⁴, x³, x², x 네 항이 되는 다항식만 쓴다(상수항이 없다).
      const ks = ['x^4', 'x^3', 'x^2', 'x'];
      if (!same(R, xv(short, env)) || !hasKeys(R, ks) || !intCoefs(R)) return null;
      const shortH = xh(short);
      return polyA(`${n === 0 ? '두' : '세'} 다항식 ${defsH(names, env)}에 대하여 ${xj(src, '을/를')} 계산하시오.`, R, ks, {
        rule: 'laws-' + n, explain: `${n === 0 ? '곱셈에 대한 교환법칙 AB = BA를 쓰면' : '분배법칙으로 전개해 같은 곱을 지우고 다시 묶으면'} ${xh(src)} = ${shortH}이다. 따라서 ${shortH} = ${ph(R)}이다.`
      });
    }, { count: 2 }),
    T('mul-three-pair', '세 다항식의 곱 — 곱셈 공식이 되는 짝을 골라', '①18', (d) => {
      const k = d.int(1, 3), two = d.bool(), s = d.pick([1, -1]);
      // A = x + s k, B = x³ − s k³ (또는 두 문자), C = x² − s k x + k²
      const kk = (v) => (k === 1 ? '' : k) + v, k3 = k ** 3, k2 = k * k;
      const A = two ? `x${s > 0 ? '+' : '-'}${kk('y')}` : `x${s > 0 ? '+' : '-'}${k}`;
      const Bsrc = two ? `x^3${s > 0 ? '-' : '+'}${k3 === 1 ? '' : k3}y^3` : `x^3${s > 0 ? '-' : '+'}${k3}`;
      const Csrc = two ? `x^2${s > 0 ? '-' : '+'}${k === 1 ? '' : k}xy+${k2 === 1 ? '' : k2}y^2` : `x^2${s > 0 ? '-' : '+'}${k === 1 ? '' : k}x+${k2}`;
      const env = { A: xv(A), B: xv(Bsrc), C: xv(Csrc) }, R = xv('ABC', env);
      const y = two ? 'y' : '', y3 = two ? 'y^3' : '', y6 = two ? 'y^6' : '';
      const wrongs = [xv(`x^6+${k ** 6 === 1 && two ? '' : k ** 6}${y6}`), xv(`x^6-${2 * k3}x^3${y3 === '' ? '' : 'y^3'}+${k ** 6 === 1 && two ? '' : k ** 6}${y6}`), xv(`x^6+${2 * k3}x^3${y3 === '' ? '' : 'y^3'}+${k ** 6 === 1 && two ? '' : k ** 6}${y6}`), xv(`x^6-${k3 === 1 && two ? '' : k3}${y3 || ''}`)];
      void y;
      return pickQ(d, `세 다항식 ${defsH(['A', 'B', 'C'], env)}에 대하여 ${xj('ABC', '을/를')} 계산한 것은?`, R, wrongs, {
        explain: `곱하는 차례를 바꾸어 곱셈 공식이 되는 ${V('A')}와 ${V('C')}를 먼저 곱한다. ${nb(`${V('A')}${V('C')} = ${ph(xv('AC', env))}`)}이므로 ${nb(`${V('A')}${V('B')}${V('C')} = (${ph(xv('AC', env))})(${ph(env.B)})`)} = ${ph(R)}이다.`
      });
    }),
    T('mul-coef', '전개식에서 한 항의 계수', '①19', (d, n) => {
      if (n === 0) {
        // 세 일차식의 곱에서 x² 의 계수(또는 x 의 계수)
        const src = `(${pc([1, nz(d, -6, 6)])})(${pc([d.int(1, 3), nz(d, -6, 6)])})(${pc([d.int(1, 4), nz(d, -6, 6)])})`, R = xv(src), which = d.pick([2, 1]), t = termOf(R, { x: which });
        if (!t || !intCoefs(R)) return null;
        return numQ1(`${xj(src, '을/를')} 전개한 식에서 ${which === 2 ? V('x') + sup(2) : V('x')}의 계수는?`, t.q.p, {
          calc: t.s, rule: 'coef-three', explain: `차례로 곱하면 ${xh(src)} = ${ph(R)}이므로 ${which === 2 ? V('x') + sup(2) : V('x')}의 계수는 ${tx(t.q)}이다.`
        });
      }
      const src = `(${pn([[d.int(2, 6), 'x'], [nz(d, -5, 5), 'y']])})(${pn([[d.int(1, 4), 'x^2'], [nz(d, -5, 5), 'xy'], [nz(d, -6, 6), 'y^2']])})`, R = xv(src), t = termOf(R, { x: 2, y: 1 });
      if (!t) return null;
      return numQ1(`${xh(src)}의 전개식에서 ${V('x')}${sup(2)}${V('y')}의 계수는?`, t.q.p, {
        calc: t.s, rule: 'coef-xy', explain: `${V('x')}${sup(2)}${V('y')}가 나오는 곱만 모은다. 전개하면 ${ph(R)}이므로 ${V('x')}${sup(2)}${V('y')}의 계수는 ${tx(t.q)}이다.`
      });
    }, { count: 2 }),
    T('mul-coef-find', '한 항의 계수가 주어질 때 상수 하나 구하기', '①20', (d) => {
      // (p3 x³ + p2 x² + a x + p0)(x² + q1 x + q0) 에서 x² 또는 x 의 계수
      const [p3, p2, p0, q1, q0] = [d.int(1, 3), nz(d, -5, 5), nz(d, -6, 6), nz(d, -4, 4), nz(d, -5, 5)], a = nz(d, -6, 6), which = d.pick([2, 1]);
      const coef = which === 2 ? p2 * q0 + a * q1 + p0 : a * q0 + p0 * q1;
      if (coef === 0) return null;
      const src = `(${pn([[p3, 'x^3'], [p2, 'x^2'], [1, 'ax'], [p0, '']])})(${pc([1, q1, q0])})`;
      const calc = which === 2 ? `(${coef}-(${jn(p2)})*(${jn(q0)})-(${jn(p0)}))/(${jn(q1)})` : `(${coef}-(${jn(p0)})*(${jn(q1)}))/(${jn(q0)})`;
      const W = which === 2 ? V('x') + sup(2) : V('x');
      return numQ1(`다항식 ${xh(src)}의 전개식에서 ${W}의 계수가 ${tx(Q(coef))}일 때, 상수 ${V('a')}의 값은?`, a, {
        calc, explain: `${W}의 항이 나오는 곱만 모으면 ${W}의 계수는 ${which === 2 ? nb(`${sd(p2)} × ${jd(q0)} + ${V('a')} × ${jd(q1)} + ${jd(p0)}`) : nb(`${V('a')} × ${jd(q0)} + ${sd(p0)} × ${jd(q1)}`)}이다. 이것이 ${tx(Q(coef))}이므로 ${V('a')} = ${tx(Q(a))}이다.`
      });
    }),
    T('mul-coef-two', '계수 조건으로 상수 구하기(둘, 또는 하나를 구해 다른 계수)', '①21', (d, n) => {
      if (n === 0) {
        // (x + a)(x² + p x + b): x² 의 계수 p + a, x 의 계수 b + p a
        const p = nz(d, -5, 5), a = nz(d, -6, 6), b = nz(d, -9, 9), c2 = p + a, c1 = b + p * a;
        if (c2 === 0 || c1 === 0) return null;
        const src = `(x+a)(x^2${sg(p, 'x')}+b)`;
        return slots(`다항식 ${xh(src)}의 전개식에서 ${V('x')}${sup(2)}의 계수가 ${tx(Q(c2))}이고, ${V('x')}의 계수가 ${tx(Q(c1))}일 때, 상수 ${V('a')}, ${V('b')}의 값은?`, [[V('a') + ' =', a, `${c2}-(${jn(p)})`], [V('b') + ' =', b, `${c1}-(${jn(p)})*(${c2}-(${jn(p)}))`]], {
          rule: 'two-ab', explain: `전개하면 ${nb(`${V('x')}${sup(3)} + (${sd(p)} + ${V('a')})${V('x')}${sup(2)} + (${V('b')} ${p < 0 ? MINUS : '+'} ${Math.abs(p) === 1 ? '' : Math.abs(p)}${V('a')})${V('x')} + ${V('a')}${V('b')}`)}이다. ${nb(`${sd(p)} + ${V('a')} = ${sd(c2)}`)}에서 ${V('a')} = ${tx(Q(a))}, ${nb(`${V('b')} + ${jd(p)} × ${jd(a)} = ${sd(c1)}`)}에서 ${V('b')} = ${tx(Q(b))}이다.`
        });
      }
      // (x² + r x + s)(u x² + v x + a): x² 의 계수로 a 를 구한 다음 x 의 계수
      const [r, s, u, v] = [nz(d, -5, 5), nz(d, -5, 5), d.int(1, 3), nz(d, -5, 5)], a = nz(d, -6, 6), c2 = s * u + r * v + a, c1 = r * a + s * v;
      if (c2 === 0 || c1 === 0) return null;
      const src = `(${pc([1, r, s])})(${pn([[u, 'x^2'], [v, 'x'], [1, 'a']])})`;
      return numQ1(`다항식 ${xh(src)}의 전개식에서 ${V('x')}${sup(2)}의 계수가 ${tx(Q(c2))}일 때, ${V('x')}의 계수는? (단, ${V('a')}는 상수이다.)`, c1, {
        calc: `${jn(r)}*(${c2}-(${jn(s)})*${u}-(${jn(r)})*(${jn(v)}))+(${jn(s)})*(${jn(v)})`, rule: 'two-then',
        explain: `${V('x')}${sup(2)}의 계수는 ${nb(`${sd(s)} × ${u} + ${jd(r)} × ${jd(v)} + ${V('a')}`)}이고 이것이 ${sd(c2)}이므로 ${V('a')} = ${tx(Q(a))}이다. ${V('x')}의 계수는 ${nb(`${jd(r)} × ${jd(a)} + ${jd(s)} × ${jd(v)}`)} = ${tx(Q(c1))}이다.`
      });
    }, { count: 2 }),
    T('mul-square-coef', '다항식의 제곱의 전개식에서 계수', '①22', (d) => {
      const cs = [d.int(1, 3), nz(d, -3, 3), nz(d, -3, 3), nz(d, -3, 3), nz(d, -2, 3)], src = `(${pc(cs)})^2`, k = d.int(3, 6), R = xv(src), t = termOf(R, { x: k });
      if (!t) return null;
      // 차수의 합이 k 인 짝(서로 다른 두 항은 두 번)
      const at = (deg) => cs[4 - deg], pairs = [];
      for (let i = 0; i <= 4; i += 1) { const j = k - i; if (j >= 0 && j <= 4) pairs.push(`${jn(at(i))}*${jn(at(j))}`); }
      return numQ1(`${xh(src)}의 전개식에서 ${V('x')}${sup(k)}의 계수는?`, t.q.p, {
        calc: pairs.join('+'), explain: `${V('x')}${sup(k)}은 차수의 합이 ${k}인 두 항을 곱할 때 나온다. 서로 다른 두 항의 곱은 두 번씩 나오므로 계수는 ${pairs.map((p) => p.replace(/\*/g, ' × ').replace(/\(-/g, `(${MINUS}`)).join(' + ')} = ${tx(t.q)}이다.`
      });
    }),
    T('mul-long-square', '긴 다항식의 제곱에서 낮은 차수의 계수', '①23', (d) => {
      const len = d.int(8, 12), k = d.int(2, 4), terms = [];
      for (let i = 0; i <= k; i += 1) terms.push(`${i + 1}*${k - i + 1}`);
      const value = terms.reduce((s, e) => s + e.split('*').map(Number).reduce((x, y) => x * y, 1), 0);
      const shownP = `1 + 2${V('x')} + 3${V('x')}${sup(2)} + ⋯ + ${len}${V('x')}${sup(len - 1)}`;
      return numQ1(`다항식 ${nb('(' + shownP + ')' + sup(2))}의 전개식에서 ${k === 1 ? V('x') : V('x') + sup(k)}의 계수는?`, value, {
        signed: false, calc: terms.join('+'), derived: Array.from({ length: k + 2 }, (_, i) => i),
        explain: `${V('x')}${sup(k)}이 나오는 곱은 차수의 합이 ${k}인 두 항의 곱뿐이다. 차수가 ${k}보다 높은 항은 볼 필요가 없으므로 계수는 ${terms.map((e) => e.replace('*', ' × ')).join(' + ')} = ${value}이다.`
      });
    }),
    T('mul-pizza-box', '종이를 접어 만든 상자의 부피를 전개하기', '②17', (d) => {
      const L = d.pick([60, 70, 80, 90, 100]), W = d.pick([30, 40, 50]), h = L / 2;
      if (h === W) return null;
      // 검사 식은 글에 적힌 가로의 길이를 2로 나눈 것으로 셈한다(반으로 나눈 몸통의 가로).
      const src = `x(${h}-2x)(${W}-2x)`, R = xv(`x([${L}|2]-2x)(${W}-2x)`);
      return polyA(`가로의 길이가 ${L} cm, 세로의 길이가 ${W} cm인 직사각형 모양의 종이를 가로의 길이가 같게 둘로 나누어, 왼쪽 반으로는 피자 상자의 몸통을, 오른쪽 반으로는 뚜껑을 만들려고 한다. 그림과 같이 왼쪽 반의 네 귀퉁이에서 한 변의 길이가 ${V('x')} cm인 정사각형을 잘라 내고 점선을 따라 접어 뚜껑이 없는 상자를 만들 때, 상자의 부피(cm³)를 ${V('x')}에 대한 식으로 전개하면?`, R, ['x^3', 'x^2', 'x'], {
        figure: halfNet(L, W), derived: [2], note: '종이의 두께는 생각하지 않고,',
        explain: `상자의 밑면은 가로 ${nb(`(${h} − 2${V('x')}) cm`)}, 세로 ${nb(`(${W} − 2${V('x')}) cm`)}이고 높이는 ${V('x')} cm이다. 부피는 ${xh(src)} = ${ph(R)}이다.`
      });
    })
  ];
  // 두 다항식의 곱 하나를 동류항으로 모으기 전의 줄
  function rawProd(src) {
    const n = X(src); let fs = null;
    if (n.t === 'jux' && n.list.length === 2 && n.list.every((f) => f.t === 'par')) fs = n.list;
    if (!fs) return ph(xv(src));
    const A = valX(fs[0]), Bv = valX(fs[1]), out = [];
    for (const a of A) for (const b of Bv) out.push(tMul(a, b));
    return out;
  }
  // 반으로 나눈 종이: 왼쪽 반의 네 귀퉁이에 잘라 낼 정사각형(빗금), 접는 선(점선)
  function halfNet(L, W) {
    const s = 230 / L, w = L * s, h = W * s, x0 = 12, y0 = 22, cut = 22, half = w / 2;
    let body = `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" style="fill:#e0f2fe;stroke:${INK};stroke-width:1.3"/>`
      + `<line x1="${x0 + half}" y1="${y0}" x2="${x0 + half}" y2="${y0 + h}" style="stroke:${INK};stroke-width:1.5"/>`;
    for (const [cx, cy] of [[x0, y0], [x0 + half - cut, y0], [x0, y0 + h - cut], [x0 + half - cut, y0 + h - cut]]) body += `<rect x="${cx}" y="${cy}" width="${cut}" height="${cut}" style="fill:#fff;stroke:${INK};stroke-width:1.1"/><path d="M${cx} ${cy + cut}L${cx + cut} ${cy}" style="stroke:#94a3b8;stroke-width:1"/>`;
    body += `<path d="M${x0 + cut} ${y0}V${y0 + h}M${x0 + half - cut} ${y0}V${y0 + h}M${x0} ${y0 + cut}H${x0 + half}M${x0} ${y0 + h - cut}H${x0 + half}" style="fill:none;stroke:#334155;stroke-width:1;stroke-dasharray:4 3"/>`;
    body += word(x0 + cut / 2, y0 - 6, `<tspan style="${SVG_ITALIC}">x</tspan>`, 'middle', 12) + word(x0 - 2, y0 + cut / 2 + 4, `<tspan style="${SVG_ITALIC}">x</tspan>`, 'end', 12)
      + word(x0 + w / 2, y0 + h + 17, `${L} cm`, 'middle', 12.5) + word(x0 + w + 4, y0 + h / 2 + 4, `${W} cm`, 'start', 12.5)
      + word(x0 + half / 2, y0 + h / 2 + 5, '몸통', 'middle', 12.5) + word(x0 + half + half / 2, y0 + h / 2 + 5, '뚜껑', 'middle', 12.5);
    return svg(Math.ceil(x0 + w + 48), Math.ceil(y0 + h + 26), `종이: 가로 ${L} cm, 세로 ${W} cm. 가로의 가운데에 선을 그어 왼쪽 반은 몸통, 오른쪽 반은 뚜껑이다. 왼쪽 반의 네 귀퉁이에 한 변이 x cm인 정사각형(잘라 낼 부분)이 있고, 그 안쪽에 접는 점선이 있다.`, body);
  }

  B.kit.m1011 = {
    STD, UNIT, T, retry, seal, NOTE1, GANA, parse, X, term, keyOf, tMul, pAdd, pNeg, pSub, pMul, pPow, pDivNum, num, valX, xv, mk, same, coefOf, termOf, degIn, letters, degOf, ordered, pDiv,
    varH, termH, signed, ph, pt, asIs, htmlX, xh, xe, xex, xtagged, ej, xj, pj, magS, pn, mon, pc, sg, srcOf, fresh, nzs, K, keysOf, hasKeys, intCoefs,
    combOf, combH, subH, defsH, polyA, divAns, grp2, numQ1, slots, pickQ, jn, jd, sd, INK, SVG_ITALIC, svgX, plainX, svg, word, label, rawProd, mono2
  };

  B.addUnit({
    id: '10-1-1', grade: 10, semester: 1, no: 1, title: '다항식의 연산', version: 1,
    groups: [
      { id: 'add', title: '다항식의 덧셈과 뺄셈', standard: STD, types: addTypes },
      { id: 'mul', title: '다항식의 곱셈', standard: STD, types: mulTypes },
      { id: 'formula', title: '곱셈 공식', standard: STD, types: [] },
      { id: 'value', title: '곱셈 공식의 변형', standard: STD, types: [] },
      { id: 'div', title: '다항식의 나눗셈', standard: STD, types: [] }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
