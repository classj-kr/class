// 중학교 3학년 1학기 2단원 근호를 포함한 식의 계산 — 단원 틀·도구와 앞쪽 묶음(제곱근의 곱셈, 근호 밖으로·안으로, 제곱근의 나눗셈, 분모의 유리화, 곱셈과 나눗셈의 혼합 계산, 제곱근을 문자·값으로 나타내기).
// 수집해 둔 미래엔 2015(황선욱) 한 종의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 65꼴, 심화꼴 27꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 뺌(까닭) / 겹침」을 가른 대조표는 references/textbooks/수학/_분석/9-1-2/싣기_대조표.md 에 있다.
// (제곱근의 덧셈과 뺄셈, 혼합 계산, 계수 맞추기·유리수가 되는 조건·식의 값, 대소 관계와 정수 부분·소수 부분, 도형과 수직선은 9-1-2b.js 에, 실력 문항은 9-1-2c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
// 영역은 수와 연산. 성취기준은 9수01-10(근호를 포함한 식의 사칙계산의 원리를 이해하고, 그 계산을 할 수 있다)이다.
// 실수의 대소 관계를 뺄셈으로 가르는 두 유형(9-1-2b.js 의 cmp-steps·cmp-three)만 9수01-09(실수의 대소 관계)로 적었다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(식·분수·소수·소인수 꼴·문자·도형), 묻는 것(값·빈칸·고르기·문자의 값), 계산 구조(곱·몫·유리화·분배·동류항)가 다르면 따로 싣는다.
//    수만 다른 것은 한 번만 싣는다. 같은 글(「다음을 계산하시오.」와 식)에 구조만 다른 문항은 facts.rule 에 이름을 달았다.
//  - 교육과정(2022): 근호를 포함한 식의 사칙계산. 「제곱근의 값은 계산기 등을 이용하여 구할 수 있음을 알게 한다」 — 제곱근표를 읽는 문항은 싣지 않고,
//    주어진 제곱근의 값으로 다른 제곱근의 값을 구하는 문항만 싣는다. 「사칙계산 이외의 이항연산 문제는 다루지 않는다」 — 새 기호(∘, •)로 정한 연산은 싣지 않는다.
//    분모가 a + √b 꼴인 유리화와 (√a + √b)² 처럼 곱셈 공식이 있어야 하는 계산은 9-1-3 몫이다(수집 자료에도 없다). 이중근호·세제곱근·근호 안이 음수인 식은 쓰지 않는다.
//  - 답의 꼴: 정수(N)·분수(F, anyForm 아님 — 기약분수), a√b(radAns), 분모를 유리화한 a√b/c(식 속 칸 [±][ ]√[ ]/[ ]), a + b√c([±][ ] [±][ ]√[ ]),
//    a√b + c√d(두 칸 묶음 — 묶음째 차례를 바꾸어 적어도 맞다), 그 밖의 꼴(계수가 분수인 두 항 따위)은 고르기로 낸다. 한 유형 안에서는 칸의 모양이 늘 같다.
//    a√b 칸에서 계수가 1인 답(√5)은 칸 하나(√[ ])로 받으므로, 같은 유형 안에서 계수가 1인 답과 아닌 답을 섞지 않는다(수를 고를 때 막는다).
//    식 속 칸이 여럿인 꼴(분수 꼴, a + b√c, a√b + c√d)은 근호 앞의 수가 1일 수 있어 문제 글 끝에 「근호 앞의 수가 1이면 1을 적는다」를 늘 붙인다.
//    모든 수 칸에는 부호 단추를 단다(근호 안의 수·분모·개수 칸만 뺀다).
//  - 답은 모두 코드가 셈한다. 식을 한 줄 글(식 글)로 적고, 그 글 하나에서 화면 글·값·검사 식을 얻는다. 값은 「유리수 계수 × √(제곱인 수를 인수로 갖지 않는 자연수)」 항의 합이다.
//    검사가 다시 셈하는 식(facts.calc)은 식 글에 적힌 수로 계수를 셈하는 식이다(근호를 벗길 때만 (…)**0.5 — 늘 제곱수의 제곱근이라 셈이 정확하다).
//    근호 안의 수와 분모처럼 문제에 적히지 않는 수는 facts.unseen 에 저절로 밝힌다(seal).
//  - 꼴 목록에 적힌 원문 답지의 잘못(기본꼴 머리의 「원문이 어긋난 곳」)은 따르지 않는다.
//
// 뺀 것과 까닭(9-1-2b.js, 9-1-2c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 2022 교육과정 밖: 제곱근표를 읽는 활동(①32 — 주어진 값을 쓰는 것은 ①31로 실었다), 새 기호로 정한 연산(심7, 「사칙계산 이외의 이항연산 문제는 다루지 않는다」),
//    이중근호(심1), 수열 기호(심26, 고등학교).
//  - 중2에 있는 일: 피타고라스 정리로 길이 구하기(①64의 탐구 3), 분할 퍼즐(①65 — 피타고라스 정리와 조각 배열, 만들기 활동).
//  - 뜻 없는 셈: 따로 구한 두 문자의 값을 더하고 빼기(①9, 심9 — 하나하나는 ①5·①6·①42·①44로 실었다), 따로 구한 A배와 B의 곱(①30의 변형).
//    계수를 묻는 꼴(①47)은 계수 a, b를 칸 둘로 따로 받는다. 정수 부분·소수 부분을 섞은 값(①58의 a − b 꼴)은 소수 부분을 바로 묻는다.
//  - 같은 일(겹침): 심2·심8·심13·심15·심18·심21·심27과 꼴 안의 변형 몇(대조표의 메모)은 하는 일이 같은 유형이 있어 한 번만 실었다.
//  - 실력: 심화꼴 가운데 뜻을 정확히 대야 풀리는 것(심3·심11·심14·심16·심19·심20·심24)과 네 단계 넘게 잇는 것(심4·심5·심10·심12·심17·심22·심23·심25)을
//    9-1-2c.js 에 실었다. 심6(거꾸로 한 번 구한 뒤 간단히)은 기본(md-back-root)에 두었다.
//  - 근삿값(①31·심12)은 소수 둘째·셋째 자리 답이라 검사의 FINE_DECIMAL_UNITS 에 이 단원이 있어야 소수 칸(D)으로 받을 수 있다. 지금은 고르기로 내고,
//    그 목록에 9-1-2 를 넣으면 아래 FINE_DECIMAL 을 true 로 바꾸어 소수 칸으로 받는다(val-approx 만 바뀐다. hard-approx 는 고르기 그대로).
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, box, frac, lines, numbers, N, M, C, F, D, inline } = B.kit;
  const { LAB, MINUS, range, gcd, lcm, Q, qadd, qsub, qmul, qdiv, qneg, qabs, qcmp, isInt, fl, mag, tx, nb, tail, V, sup, fit, tag, rt, grp, sqParts, radText, radAns, claimQ } = B.kit.mid;
  const STD = '9수01-10', STD_CMP = '9수01-09', UNIT = '9-1-2';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const ruled = (item, rule) => { item.facts.rule = rule; return item; };
  const CALC = '다음을 계산하시오.';
  const ONE = '(근호 앞의 수가 1이면 1을 적는다.)';

  // ── 수 고르기 ──
  // 제곱인 수를 인수로 갖지 않는 2 이상의 자연수
  const SQF = range(2, 99).filter((n) => sqParts(n)[0] === 1);
  const SQF_SMALL = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15];
  const isSq = (n) => Number.isInteger(Math.sqrt(n));
  const pickSqf = (d, list, not) => d.until(() => d.pick(list || SQF_SMALL), (m) => !(not || []).includes(m));

  // ── 식 글 ──
  // 근호가 든 식을 한 줄 글로 적고(식 글), 그 글 하나에서 화면 글·값·검사 식을 얻는다.
  //  수 12·0.07 / 근호 r12·r0.07·r[3|4](근호 안이 분수)·r(2^2*3^3)(근호 안을 묶는 괄호는 보이지 않는다)·r(x-13) / 분수 [분자|분모] / 문자 a·b·x·y(r 은 근호)
  //  덧셈 + 뺄셈 - 곱셈 * (×) 나눗셈 : (÷) / 기호를 생략한 곱(나란히 적기) 3r2·r3r5·r3(r15+5r2) — × ÷ 보다 먼저 묶인다(2r3:4r7 은 (2√3) ÷ (4√7)) / 거듭제곱 ^2 / 괄호 ( ) { } / 빈칸 ?
  function parse(src) {
    const s = String(src).replace(/\s+/g, ''); let i = 0;
    const fail = (why) => { throw new Error(`식 글 「${src}」: ${why}(${i}번째)`); };
    const eat = (ch) => { if (s[i] !== ch) fail(ch + ' 가 와야 한다'); i += 1; };
    const number = () => { const m = /^\d+(\.\d+)?/.exec(s.slice(i)); i += m[0].length; return { t: 'num', s: m[0] }; };
    function sum() { let a = term(); while (s[i] === '+' || s[i] === '-') { const op = s[i]; i += 1; a = { t: op === '+' ? 'add' : 'sub', a, b: term() }; } return a; }
    function term() { let a = neg(); while (s[i] === '*' || s[i] === ':') { const op = s[i]; i += 1; a = { t: op === '*' ? 'mul' : 'div', a, b: neg() }; } return a; }
    function neg() { if (s[i] === '-') { i += 1; return { t: 'neg', a: neg() }; } return jux(); }
    function jux() { const list = [pow()]; while (i < s.length && /[r([{a-qs-zA-Z?]/.test(s[i])) list.push(pow()); return list.length === 1 ? list[0] : { t: 'jux', list }; }
    function pow() { const a = atom(); if (s[i] !== '^') return a; i += 1; const m = /^\d+/.exec(s.slice(i)); if (!m) fail('지수가 없다'); i += m[0].length; return { t: 'pow', a, n: Number(m[0]) }; }
    function atom() {
      const ch = s[i] || '';
      if (/\d/.test(ch)) return number();
      if (ch === 'r') { i += 1; return { t: 'rad', a: inside() }; }
      if (ch === '?') { i += 1; return { t: 'box' }; }
      if (/[a-qs-zA-Z]/.test(ch)) { i += 1; return { t: 'var', name: ch }; }
      if (ch === '(' || ch === '{') { const close = ch === '(' ? ')' : '}'; i += 1; const a = sum(); eat(close); return { t: 'par', a, br: ch }; }
      if (ch === '[') { i += 1; const a = sum(); eat('|'); const b = sum(); eat(']'); return { t: 'frac', a, b }; }
      return fail('읽지 못하는 글자');
    }
    // 근호 안: 수, 분수, 문자, 빈칸, 또는 보이지 않는 괄호로 묶은 식
    function inside() {
      const ch = s[i] || '';
      if (/\d/.test(ch)) return number();
      if (ch === '(') { i += 1; const a = sum(); eat(')'); return a; }
      if (ch === '[') { i += 1; const a = sum(); eat('|'); const b = sum(); eat(']'); return { t: 'frac', a, b }; }
      if (ch === '?') { i += 1; return { t: 'box' }; }
      if (/[a-qs-zA-Z]/.test(ch)) { i += 1; return { t: 'var', name: ch }; }
      return fail('근호 안을 읽지 못한다');
    }
    const out = sum(); if (i !== s.length) fail('식이 끝나지 않았다'); return out;
  }
  const X = (src) => (typeof src === 'string' ? parse(src) : src);

  // ── 값 ──
  // 값(근호가 든 수)은 항의 배열이다. 항 { q 계수(유리수), m 근호 안(제곱인 수를 인수로 갖지 않는 자연수 — 유리수 항은 1),
  //  n·d 계수의 분자·분모를 문제의 수로 셈하는 식 글, nv·dv 그 값(정수) }. 0은 빈 배열이다.
  // n·d 는 검사가 따로 셈하는 식(facts.calc)이 된다. 근호를 벗길 때만 (…)**0.5 가 들어간다(늘 제곱수의 제곱근이라 셈이 정확하다).
  const simple = (s) => /^\d+$/.test(s);
  const wrap = (s) => (simple(s) ? s : '(' + s + ')');
  const mulS = (a, b) => (a === '1' ? b : b === '1' ? a : wrap(a) + '*' + wrap(b));
  const ONE_T = { q: Q(1), m: 1, n: '1', d: '1', nv: 1, dv: 1 };
  function numV(text) {
    const [w, f = ''] = String(text).split('.'), den = 10 ** f.length, num = Number(w + f);
    return num === 0 ? [] : [{ q: Q(num, den), m: 1, n: String(num), d: String(den), nv: num, dv: den }];
  }
  // √(유리수 항): √(n/d) = √(n·d)/d = s√m/d
  function rootT(t) {
    if (t.m !== 1 || t.q.p < 0 || t.nv * t.dv < 0) throw new Error('근호 안이 음수이거나 무리수이다');
    const whole = t.nv * t.dv, [s, m] = sqParts(whole);
    const n = s === 1 ? '1' : m === 1 ? `(${mulS(t.n, t.d)})**0.5` : `(${mulS(t.n, t.d)}/${m})**0.5`;
    return { q: Q(s, t.dv), m, n, d: t.d, nv: s, dv: t.dv };
  }
  function mulT(a, b) {
    const [k, m] = sqParts(a.m * b.m);
    const n = k === 1 ? mulS(a.n, b.n) : mulS(mulS(a.n, b.n), `(${a.m}*${b.m}/${m})**0.5`);
    return { q: qmul(qmul(a.q, b.q), Q(k)), m, n, d: mulS(a.d, b.d), nv: a.nv * b.nv * k, dv: a.dv * b.dv };
  }
  // 1 ÷ (q√m) = √m ÷ (q × m)
  const invT = (b) => ({ q: qdiv(Q(1), qmul(b.q, Q(b.m))), m: b.m, n: b.d, d: b.m === 1 ? b.n : mulS(b.n, String(b.m)), nv: b.dv, dv: b.nv * b.m });
  const negT = (t) => ({ q: qneg(t.q), m: t.m, n: '-' + wrap(t.n), d: t.d, nv: -t.nv, dv: t.dv });
  function addV(A, Bv) {
    const out = A.slice();
    for (const t of Bv) {
      const at = out.findIndex((u) => u.m === t.m);
      if (at < 0) { out.push(t); continue; }
      const u = out[at], q = qadd(u.q, t.q);
      if (q.p === 0) { out.splice(at, 1); continue; }
      out[at] = u.d === t.d
        ? { q, m: u.m, n: `${u.n}+${wrap(t.n)}`, d: u.d, nv: u.nv + t.nv, dv: u.dv }
        : { q, m: u.m, n: `${mulS(u.n, t.d)}+${mulS(t.n, u.d)}`, d: mulS(u.d, t.d), nv: u.nv * t.dv + t.nv * u.dv, dv: u.dv * t.dv };
    }
    return out;
  }
  const negV = (A) => A.map(negT);
  const mulV = (A, Bv) => A.reduce((sum, x) => addV(sum, Bv.map((y) => mulT(x, y))), []);
  function divV(A, Bv) { if (Bv.length !== 1) throw new Error('항이 여럿인 식으로 나누지 않는다(곱셈 공식이 있어야 한다)'); return mulV(A, [invT(Bv[0])]); }
  // 값. env: { 문자: 값(항의 배열) }
  function valX(node, env) {
    const n = X(node), v = (m) => valX(m, env);
    switch (n.t) {
      case 'num': return numV(n.s);
      case 'rad': { const inner = v(n.a); if (!inner.length) return []; if (inner.length !== 1 || inner[0].m !== 1) throw new Error('근호 안이 유리수가 아니다'); return [rootT(inner[0])]; }
      case 'var': { const g = env && env[n.name]; if (!g) throw new Error('문자 ' + n.name + '의 값이 없다'); return g; }
      case 'add': return addV(v(n.a), v(n.b));
      case 'sub': return addV(v(n.a), negV(v(n.b)));
      case 'mul': return mulV(v(n.a), v(n.b));
      case 'div': case 'frac': return divV(v(n.a), v(n.b));
      case 'neg': return negV(v(n.a));
      case 'par': return v(n.a);
      case 'pow': { const base = v(n.a); let out = [ONE_T]; for (let k = 0; k < n.n; k += 1) out = mulV(out, base); return out; }
      case 'box': throw new Error('빈칸이 있는 식이다');
      default: return n.list.reduce((acc, t) => mulV(acc, v(t)), [ONE_T]);
    }
  }
  const xv = (src, env) => valX(src, env);
  // 값의 모양
  const fv = (S) => S.reduce((s, t) => s + fl(t.q) * Math.sqrt(t.m), 0);   // 어림값(실수)
  const isZero = (S) => S.length === 0;
  const isRat = (S) => S.length === 0 || (S.length === 1 && S[0].m === 1);
  const ratOf = (S) => (S.length ? S[0].q : Q(0));
  const isIntV = (S) => isRat(S) && S.length === 1 && S[0].q.q === 1;
  const isOneRad = (S) => S.length === 1 && S[0].m > 1;
  const sameV = (A, Bv) => A.length === Bv.length && A.every((t) => { const u = Bv.find((w) => w.m === t.m); return Boolean(u) && qcmp(u.q, t.q) === 0; });
  const ordV = (S) => S.slice().sort((a, b) => a.m - b.m);
  const termOf = (S, m) => S.find((t) => t.m === m);
  // 값을 바로 짓기(틀린 보기를 지을 때): mk([[계수, 근호 안], …]) — 근호 안에 제곱인 인수가 있으면 꺼낸다.
  const mk = (pairs) => pairs.reduce((acc, [c, r]) => { const q = typeof c === 'number' ? Q(c) : c; if (q.p === 0) return acc; const [s, m] = sqParts(r); return addV(acc, [{ q: qmul(q, Q(s)), m, n: '0', d: '1', nv: 0, dv: 1 }]); }, []);

  // ── 화면 글 ──
  // 값의 화면 글: 유리수 항 먼저, 그다음 근호 안의 수가 작은 차례. 계수가 분수인 항은 근호까지 분자에 적는다(√3/6).
  function termH(t) {
    const a = qabs(t.q);
    if (t.m === 1) return mag(a);
    const top = (a.p === 1 ? '' : a.p) + rt(t.m);
    return a.q === 1 ? top : frac(top, a.q);
  }
  function vh(S) {
    if (!S.length) return '0';
    return nb(ordV(S).map((t, i) => (i === 0 ? (t.q.p < 0 ? MINUS : '') : t.q.p < 0 ? ' ' + MINUS + ' ' : ' + ') + termH(t)).join(''));
  }
  // 값 뒤에 토씨: 읽을 때 끝소리는 마지막 항의 수(근호 안의 수, 분수는 분모 — 「육분의 루트 삼」이 아니라 끝에 읽는 수)
  const lastNum = (S) => { const t = ordV(S)[S.length - 1]; if (!t) return 0; if (t.m > 1) return t.q.q === 1 ? t.m : t.q.q; return t.q.q === 1 ? Math.abs(t.q.p) : Math.abs(t.q.p); };
  const vj = (S, pair) => nb(vh(S) + tail(lastNum(S), pair));
  // 식의 화면 글. inExpr: 식 글꼴(mb-expr) 안에 적을 때 연산 기호를 <i>로 감싼다.
  const SHOWN = { '(': ['(', ')'], '{': ['{', '}'] };
  function htmlX(node, inExpr) {
    const n = X(node), op = (sym) => (inExpr ? ` <i>${sym}</i> ` : ` ${sym} `), h = (m) => htmlX(m, inExpr);
    switch (n.t) {
      case 'num': return n.s;
      case 'rad': return rt(n.a.t === 'frac' ? frac(htmlX(n.a.a), htmlX(n.a.b)) : htmlX(n.a));
      case 'var': return V(n.name);
      case 'box': return box();
      case 'raw': return n.h;
      case 'add': return h(n.a) + op('+') + h(n.b);
      case 'sub': return h(n.a) + op(MINUS) + h(n.b);
      case 'mul': return h(n.a) + op('×') + h(n.b);
      case 'div': return h(n.a) + op('÷') + h(n.b);
      case 'neg': return MINUS + h(n.a);
      case 'par': return SHOWN[n.br][0] + h(n.a) + SHOWN[n.br][1];
      case 'pow': return h(n.a) + sup(n.n);
      case 'frac': return frac(htmlX(n.a), htmlX(n.b));
      default: return n.list.map(h).join('');
    }
  }
  // 식의 너비 어림(em): 식 글꼴의 글씨 크기를 휴대폰 너비에 맞추는 데 쓴다.
  function emX(node) {
    const n = X(node);
    switch (n.t) {
      case 'num': return 0.6 * n.s.replace('.', '').length + (n.s.includes('.') ? 0.3 : 0);
      case 'rad': return 0.75 + emX(n.a);
      case 'var': return 0.64;
      case 'box': return 1.4;
      case 'raw': return n.em;
      case 'add': case 'sub': case 'mul': case 'div': return emX(n.a) + emX(n.b) + 1.62;
      case 'neg': return 0.8 + emX(n.a);
      case 'par': return 0.76 + emX(n.a);
      case 'pow': return emX(n.a) + 0.48;
      case 'frac': return Math.max(emX(n.a), emX(n.b)) + 0.5;
      default: return n.list.reduce((s, t) => s + emX(t), 0);
    }
  }
  const xh = (src) => nb(htmlX(src));                                       // 글줄 속의 식
  const xex = (src, extra) => '<span class="mb-expr"' + fit(emX(src) + (extra || 0)) + '>' + htmlX(src, true) + '</span>';   // 그림 자리에 크게 적는 식
  // 이름을 붙인 식 여러 줄: a = …, b = … (글씨 크기는 가장 긴 줄에 맞춘다)
  const named = (rows) => { const style = fit(Math.max(...rows.map(([, src]) => emX(src))) + 2.4); return lines(rows.map(([name, src]) => '<span class="mb-expr"' + (style || ' style="font-size:1.2rem"') + '>' + name + ' <i>=</i> ' + htmlX(src, true) + '</span>')); };
  // 이름표(㉠㉡…)를 붙인 식 여러 줄
  const xtagged = (rows, tags) => { const style = fit(Math.max(...rows.map((r) => emX(r))) + 2.6); return lines(rows.map((r, i) => tag((tags || LAB)[i]) + '<span class="mb-expr"' + (style || ' style="font-size:1.2rem"') + '>' + htmlX(r, true) + '</span>')); };
  // 값의 너비 어림
  const emV = (S) => S.reduce((s, t) => s + 1.6 + (t.m > 1 ? 0.75 + 0.6 * String(t.m).length : 0) + 0.6 * String(Math.abs(t.q.p)).length, 0);

  // ── 근호를 간단히 한 줄(풀이) ──
  // 수와 근호만 나란히 놓인 덩이(3√12, √12)를 a√b 로 고친 식. 바뀐 것이 없으면 null.
  const radOnly = (n) => n.t === 'rad' && n.a.t === 'num' && !n.a.s.includes('.');
  function simpNode(node) {
    const n = X(node);
    const asRaw = (S) => ({ t: 'raw', h: vh(S), em: emV(S) });
    if (radOnly(n)) { const S = valX(n); return sqParts(Number(n.a.s))[0] > 1 ? asRaw(S) : n; }
    if (n.t === 'jux' && n.list.every((m) => m.t === 'num' || radOnly(m)) && n.list.some(radOnly)) { const S = valX(n); return n.list.some((m) => radOnly(m) && sqParts(Number(m.a.s))[0] > 1) ? asRaw(S) : n; }
    if (n.list) return Object.assign({}, n, { list: n.list.map(simpNode) });
    const out = Object.assign({}, n);
    if (n.a && n.t !== 'rad') out.a = simpNode(n.a);
    if (n.b) out.b = simpNode(n.b);
    return out;
  }
  const simpLine = (src) => { const before = htmlX(src), after = htmlX(simpNode(src)); return after === before ? null : after; };
  // 식 = (근호를 간단히 한 식) = (가운데 줄들) = 값
  const told = (src, mids, S, env) => [htmlX(src)].concat(simpLine(src) ? [simpLine(src)] : [], mids || [], [vh(S || valX(src, env))]).filter((h, i, all) => i === 0 || h !== all[i - 1]).join(' = ');
  // √n = a√b 를 적은 글
  const outTold = (n) => { const [a, b] = sqParts(n); return `${rt(n)} = ${rt(`${a}<sup>2</sup> × ${b}`)} = ${radText(a, b)}`; };

  // ── 검사 근거 ──
  const calcOf = (t) => (t.d === '1' ? t.n : `${wrap(t.n)}/${wrap(t.d)}`);
  // 문제(글·그림·보기)에 숫자로 적히지 않은 수를 facts.unseen 에 밝힌다(검사와 같은 길로 읽는다).
  const stripH = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  function seal(item) {
    const f = item.facts || (item.facts = {});
    const seen = stripH([item.text, item.figure || ''].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, ' $1 '));
    const shown = new Set((seen.match(/\d+/g) || []).concat(seen.match(/\d+\.\d+/g) || [], seen.replace(/(\d) (?=\d)/g, '$1').match(/\d+/g) || []));
    const exprs = (f.calc || []).map(([t]) => t).concat(f.value !== undefined ? [f.value] : [], (f.choose && f.choose.exprs) || [], f.pick ? [f.pick.expr] : []);
    const miss = new Set(f.unseen || []);
    for (const t of exprs) for (const n of t.match(/\d+(?:\.\d+)?/g) || []) if (!shown.has(n)) miss.add(Number(n));
    if (miss.size) f.unseen = [...miss];
    return item;
  }

  // ── 답 ──
  // o: { figure, explain, unit, facts(덧붙일 근거), rule }
  const more = (o, facts) => ({ figure: o.figure, explain: o.explain, facts: Object.assign(facts, o.facts || {}, o.rule ? { rule: o.rule } : {}) });
  const withUnit = (tpl, o) => (o.unit ? tpl + ' ' + o.unit : tpl);
  // 칸 묶음: 좁은 화면에서 항 하나(부호 단추·칸·근호)가 줄 가운데서 갈리지 않게 묶는다. 단위는 마지막 묶음에 붙인다.
  const unitTail = (o) => (o.unit ? ' ' + o.unit : '');
  // a√b (a 는 0, −1이 아닌 정수 — a 가 1이면 칸 하나)
  const isR = (S, one) => isOneRad(S) && S[0].q.q === 1 && (one ? S[0].q.p === 1 : Math.abs(S[0].q.p) > 1);
  function rA(text, S, o) {
    if (!isOneRad(S) || S[0].q.q !== 1 || S[0].q.p === 0 || S[0].q.p === -1) throw new Error('a√b 꼴이 아니다');
    const t = S[0], a = t.q.p, opts = more(o, { calc: a === 1 ? [[String(t.m), 0]] : [[calcOf(t), 0], [String(t.m), 1]] });
    if (!o.unit) return seal(radAns(text, a, t.m, opts));
    const tpl = a === 1 ? rt('{0}') : '{0}' + rt('{1}'), inputs = a === 1 ? [{ answer: t.m }] : [{ answer: a, signed: true }, { answer: t.m }];
    return seal(inline(text, grp(tpl + unitTail(o)), inputs, Object.assign(opts, { shown: radText(a, t.m) + ' ' + o.unit })));
  }
  // 정수
  const isN = (S) => isIntV(S);
  function nA(text, S, o) {
    if (!isIntV(S)) throw new Error('정수가 아니다');
    return seal(N(text, S[0].q.p, Object.assign(more(o, { calc: [[calcOf(S[0]), 0]] }), { signed: !o.unsigned, unit: o.unit })));
  }
  // 분수(정수가 아닌 유리수)
  const isFr = (S) => isRat(S) && S.length === 1 && S[0].q.q > 1;
  function fA(text, S, o) {
    if (!isFr(S)) throw new Error('분수가 아니다');
    const q = S[0].q;
    return seal(F(text, Math.abs(q.p), q.q, Object.assign(more(o, { value: calcOf(S[0]) }), { improper: Math.abs(q.p) > q.q, signed: true, negative: q.p < 0, unit: o.unit })));
  }
  // 분모를 유리화한 꼴 a√b/c (c ≥ 2)
  const isQ = (S) => isOneRad(S) && S[0].q.q > 1;
  function qA(text, S, o) {
    if (!isQ(S)) throw new Error('분수 꼴(a√b/c)이 아니다');
    const t = S[0], a = t.q.p, c = t.q.q;
    return seal(inline(text + ' ' + ONE, grp(frac('{0}' + rt('{1}'), '{2}') + unitTail(o)), [{ answer: a, signed: true }, { answer: t.m }, { answer: c }],
      Object.assign(more(o, { calc: [[`${wrap(t.n)}*${c}/${wrap(t.d)}`, 0], [String(t.m), 1], [String(c), 2]] }), { shown: vh(S) + (o.unit ? ' ' + o.unit : '') })));
  }
  // a + b√c (a, b 는 0이 아닌 정수)
  const isS = (S) => S.length === 2 && S.every((t) => t.q.q === 1) && S.some((t) => t.m === 1);
  function sA(text, S, o) {
    if (!isS(S)) throw new Error('a + b√c 꼴이 아니다');
    const [r, t] = ordV(S);
    return seal(inline(text + ' ' + ONE, grp('{0}') + ' ' + grp('{1}' + rt('{2}') + unitTail(o)), [{ answer: r.q.p, signed: true }, { answer: t.q.p, signed: true }, { answer: t.m }],
      Object.assign(more(o, { calc: [[calcOf(r), 0], [calcOf(t), 1], [String(t.m), 2]] }), { shown: vh(S) + (o.unit ? ' ' + o.unit : '') })));
  }
  // a√b + c√d (b < d, 계수는 0이 아닌 정수) — 두 항을 묶음째 바꾸어 적어도 맞다.
  const isTw = (S) => S.length === 2 && S.every((t) => t.q.q === 1 && t.m > 1);
  function tA(text, S, o) {
    if (!isTw(S)) throw new Error('a√b + c√d 꼴이 아니다');
    const [t, u] = ordV(S);
    return seal(inline(text + ' ' + ONE, grp('{0}' + rt('{1}')) + ' ' + grp('{2}' + rt('{3}') + unitTail(o)), [{ answer: t.q.p, signed: true }, { answer: t.m }, { answer: u.q.p, signed: true }, { answer: u.m }],
      Object.assign(more(o, { calc: [[calcOf(t), 0], [String(t.m), 1], [calcOf(u), 2], [String(u.m), 3]] }), { blocks: [[0, 1], [2, 3]], shown: vh(S) + (o.unit ? ' ' + o.unit : '') })));
  }
  // 고르기: 보기(값의 배열) 가운데 정답(값)이 하나뿐인지 본다. 보기는 화면 글이 서로 다르고 값도 서로 달라야 한다.
  function pickV(d, text, right, wrongs, o) {
    const pool = [right];
    for (const w of wrongs) if (pool.length < 5 && !pool.some((p) => sameV(p, w) || Math.abs(fv(p) - fv(w)) < 1e-9)) pool.push(w);
    if (pool.length < 4) throw new Error('보기가 모자란다');
    const rows = d.shuffle(pool), at = rows.findIndex((r) => sameV(r, right));
    return seal(C(text, rows.map((r) => (o.show ? o.show(r) : vh(r))), at, more(o, { truth: rows.map((r) => sameV(r, right)), want: true })));
  }

  // 소인수분해: fz(360) → [[2, 3], [3, 2], [5, 1]], 글: 2³ × 3² × 5
  const fz = (n) => { const out = []; let m = n; for (let p = 2; m > 1; p += 1) { let e = 0; while (m % p === 0) { e += 1; m /= p; } if (e) out.push([p, e]); } return out; };
  const fzH = (n) => fz(n).map(([p, e]) => p + (e > 1 ? sup(e) : '')).join(' × ');
  // 문자 식의 항(보기 글): lt(−2, 'ab') → −2ab, lt(1, 'a', 2) → ab² 따위는 짓는 쪽에서 글로 적는다.
  const letters = (s) => s.replace(/([a-z])(\d)?/g, (all, v, e) => V(v) + (e ? sup(e) : ''));
  const lt = (c, vars) => (c < 0 ? MINUS : '') + (Math.abs(c) === 1 && vars ? '' : Math.abs(c)) + letters(vars);
  const lsum = (terms) => { const live = terms.filter(([c]) => c !== 0); return live.length ? nb(live.map(([c, v], i) => (i === 0 ? (c < 0 ? MINUS : '') : c < 0 ? ' ' + MINUS + ' ' : ' + ') + (Math.abs(c) === 1 && v ? '' : Math.abs(c)) + letters(v)).join('')) : '0'; };
  // 고르기 문항을 짓는다: 보기 글(rows: [글, 참인가])에서 참인 것이 하나뿐이어야 한다.
  function pickRows(d, text, rows, o) {
    const list = d.shuffle(rows), at = list.findIndex((r) => r[1]);
    if (list.filter((r) => r[1]).length !== 1 || new Set(list.map((r) => stripH(r[0]))).size !== list.length) throw new Error('보기가 맞지 않다');
    return seal(C(text, list.map((r) => r[0]), at, more(o, { truth: list.map((r) => r[1]), want: true })));
  }
  const near = (x, y) => Math.abs(x - y) < 1e-9;
  // 식 글을 지을 때: 음수는 괄호에 넣어 곱셈·나눗셈 기호 뒤에 적는다.
  const pn = (s) => (String(s).startsWith('-') ? '(' + s + ')' : s);
  // 근호 앞의 수와 근호: co(3, 2) → 3r2, co(1, 5) → r5, co(-2, 7) → -2r7
  const co = (c, m) => (c < 0 ? '-' : '') + (Math.abs(c) === 1 ? '' : Math.abs(c)) + 'r' + m;
  // 주어진 제곱근의 값을 소수 셋째 자리까지 적은 글(넷째 자리에서 반올림)
  const FINE_DECIMAL = true;   // 검사의 FINE_DECIMAL_UNITS 에 9-1-2 가 들어가면 true 로 바꾼다(근삿값을 소수 칸으로 받는다).

  B.addUnit({
    id: '9-1-2', grade: 9, semester: 1, no: 2, title: '근호를 포함한 식의 계산', version: 1,
    groups: [
      {
        id: 'mul', title: '제곱근의 곱셈', standard: STD,
        types: [
          T('mul-plain', '근호끼리 곱하기', '①1', (d) => {
            const [a, b] = d.until(() => [d.pick([2, 3, 5, 6, 7, 10, 11, 13]), d.pick([2, 3, 5, 6, 7, 10, 11, 13])], ([x, y]) => x !== y && gcd(x, y) === 1 && x * y <= 95);
            const src = d.bool() ? `r${a}r${b}` : `r${a}*r${b}`, S = xv(src);
            return rA(CALC, S, { figure: xex(src), explain: `${xh(src)} = ${rt(`${a} × ${b}`)} = ${vh(S)}이다.`, rule: 'mul-plain' });
          }),
          T('mul-sign', '부호가 있는 두 제곱근의 곱', '①1', (d) => {
            // 근호 안끼리 곱한 수가 제곱수여서 답이 정수가 된다. 부호는 곱셈의 부호 규칙대로 정한다.
            const [m, k1, k2] = d.until(() => [d.pick([2, 3, 5, 6, 7]), d.int(1, 4), d.int(1, 4)], ([x, s, t]) => s !== t && x * s * s <= 99 && x * t * t <= 99);
            const A = m * k1 * k1, Bn = m * k2 * k2, kind = d.int(0, 2);
            const src = kind === 0 ? `(-r${A})(-r${Bn})` : kind === 1 ? `r${A}*(-r${Bn})` : `(-r${A})*r${Bn}`, S = xv(src), neg = kind > 0;
            return nA(CALC, S, { figure: xex(src), explain: `${xh(src)} = ${neg ? MINUS : ''}${rt(`${A} × ${Bn}`)} = ${neg ? MINUS : ''}${rt(A * Bn)} = ${vh(S)}이다.`, rule: 'mul-sign' });
          }),
          T('mul-frac', '근호 안이 분수인 두 제곱근의 곱', '①2', (d) => {
            // √(p/q) × √(r/s) = √(pr/(qs)) = √n 이 되게 수를 고른다(두 분수는 기약분수이고 정수가 아니다).
            const [p, q, r, s, n] = d.until(() => {
              const n0 = d.pick([2, 3, 5, 6, 7, 10]), q0 = d.pick([2, 3, 5, 6, 7, 10]), s0 = d.pick([2, 3, 5, 6, 7, 10]), whole = n0 * q0 * s0;
              const divs = range(2, whole - 1).filter((v) => whole % v === 0), r0 = d.pick(divs.length ? divs : [1]);
              return [whole / r0, q0, r0, s0, n0];
            }, ([p0, q0, r0, s0]) => gcd(p0, q0) === 1 && gcd(r0, s0) === 1 && p0 <= 40 && r0 <= 40 && p0 * s0 !== r0 * q0 && !isSq(p0 * q0) && !isSq(r0 * s0));
            const src = d.bool() ? `r[${p}|${q}]r[${r}|${s}]` : `r[${p}|${q}]*r[${r}|${s}]`, S = xv(src);
            return rA(CALC, S, { figure: xex(src), explain: `${xh(src)} = ${rt(frac(p, q) + ' × ' + frac(r, s))} = ${rt(n)}이다.`, rule: 'mul-frac' });
          }),
          T('mul-three', '세 제곱근의 곱을 a√b 꼴로', '①3', (d) => {
            const NICE = [2, 3, 5, 6, 7, 10, 12, 14, 15, 18, 20, 21, 24, 27, 28, 30, 35];
            const [a, b, c] = d.until(() => [d.pick(NICE), d.pick(NICE), d.pick(NICE)], ([x, y, z]) => { const [k, m] = sqParts(x * y * z); return x < y && y < z && k >= 2 && k <= 40 && m >= 2; });
            const src = d.bool() ? `r${a}*r${b}*r${c}` : `r${a}r${b}r${c}`, S = xv(src), whole = a * b * c;
            return rA(CALC, S, { figure: xex(src), explain: `${xh(src)} = ${rt(`${a} × ${b} × ${c}`)} = ${rt(fzH(whole))} = ${vh(S)}이다.`, rule: 'mul-three' });
          }),
          T('mul-pairs', '세 제곱근의 곱이 자연수가 되는 계산', '①3', (d) => {
            // 근호 안의 수를 소인수로 가르면 소인수가 모두 두 번씩 나온다.
            const [p, q, r] = d.shuffle([2, 3, 5, 7, 11, 13]).slice(0, 3), three = d.bool() && p * q * r <= 400;
            const nums = d.shuffle(three ? [p * q, q * r, r * p] : [p, q, p * q]);
            const src = nums.map((v) => 'r' + v).join('*'), S = xv(src);
            return nA(CALC, S, { figure: xex(src), explain: `${xh(src)} = ${rt(nums.join(' × '))} = ${rt(fzH(nums[0] * nums[1] * nums[2]))} = ${vh(S)}이다.`, rule: 'mul-pairs' });
          }),
          T('mul-coef', '근호 앞에 수가 있는 두 제곱근의 곱', '①4', (d) => {
            // 근호 앞의 수끼리, 근호 안의 수끼리 곱한 다음 근호 안의 제곱인 인수를 꺼낸다. 한쪽 계수가 분수(4/3)인 것도 섞는다.
            const src = d.until(() => {
              const b = d.pick([2, 3, 5, 6, 7, 10, 15]), e = d.pick([2, 3, 5, 6, 7, 10, 14]);
              if (d.int(0, 3) === 0) { const k = d.pick([2, 3, 4, 5]), u = d.until(() => d.int(1, 9), (v) => gcd(v, k) === 1 && v > 1); return `${k}r${b}*[${u}|${k}]r${e}`; }
              const a = d.pick([2, 3, 4, 5]) * (d.bool() ? 1 : -1), c = d.pick([2, 3, 4, 5]) * (d.bool() ? 1 : -1);
              return `${pn(co(a, b))}*${pn(co(c, e))}`.replace(/^\((-[^)]*)\)\*/, '($1)*');
            }, (s) => { const S = xv(s); return isR(S) && Math.abs(S[0].q.p) <= 80; });
            const S = xv(src);
            return rA(`다음을 계산하여 ${V('a')}${rt(V('b'))} 꼴로 나타내시오. (단, ${V('b')}는 가장 작은 자연수이다.)`, S, { figure: xex(src), explain: `근호 앞의 수끼리, 근호 안의 수끼리 곱한다. ${told(src, [], S)}이다.`, rule: 'mul-coef' });
          }),
          T('mul-laws', '제곱근의 곱셈·나눗셈의 성질 가리기', '①40', (d, n) => {
            const a = V('a'), b = V('b');
            if (n === 0) {
              // 문자로 적은 성질(a > 0, b > 0). 틀린 문장은 아이들이 실제로 잘못 쓰는 꼴이다.
              const yes = [`${rt(a)} × ${rt(b)} = ${rt(a + b)}`, `${rt(a)} ÷ ${rt(b)} = ${rt(frac(a, b))}`, `${rt(a + sup(2) + b)} = ${a}${rt(b)}`, `${a}${rt(b)} = ${rt(a + sup(2) + b)}`, `(${MINUS}${rt(a)})${sup(2)} = ${a}`, `${rt(a)} × ${rt(b)} = ${rt(b + ' × ' + a)}`];
              const no = [
                [`${rt(a)} + ${rt(b)} = ${rt(a + ' + ' + b)}`, `${rt(a)} + ${rt(b)}는 근호 안의 수끼리 더할 수 없다(${rt(1)} + ${rt(1)} = 2이지만 ${rt('1 + 1')} = ${rt(2)}이다).`],
                [`${rt(a)} ÷ ${rt(b)} = ${rt(frac(b, a))}`, `${rt(a)} ÷ ${rt(b)} = ${rt(frac(a, b))}이다.`, yes[1]],
                [`${rt(a + b + sup(2))} = ${a}${rt(b)}`, `${rt(a + b + sup(2))} = ${b}${rt(a)}이다.`],
                [`(${MINUS}${rt(a + b)})${sup(2)} = ${MINUS}${a}${b}`, `(${MINUS}${rt(a + b)})${sup(2)} = ${a}${b}이다.`],
                [`${a}${rt(b)} = ${rt(a + b)}`, `${a}${rt(b)} = ${rt(a + sup(2) + b)}이다.`, yes[3]]
              ];
              const wantTrue = d.bool();
              return seal(claimQ(d, `${a} &gt; 0, ${b} &gt; 0일 때, 다음 가운데 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, yes, no, wantTrue));
            }
            // 수로 적은 등식 넷(ㄱ~ㄹ)에서 옳은 것을 모두 고른다. 등식마다 옳은 꼴과 틀린 꼴 가운데 하나를 고른다.
            const [m1, m2, m4] = [pickSqf(d, [2, 3, 5, 7]), pickSqf(d, [2, 3, 5, 7]), pickSqf(d, [2, 3, 5, 7])], k = d.int(2, 4), s = d.int(2, 3), p = d.pick([2, 3, 5]), m3 = pickSqf(d, [2, 3, 5, 7], [p]);
            // 틀린 꼴(√(p·m3) ÷ √p = √(p·m3 − p))이 우연히 맞는 수(p = 2, m3 = 2)는 쓰지 않는다(m3 ≠ p 이면 p·m3 − p ≠ m3).
            const make = () => [
              d.bool() ? [`${k}${rt(m1)} = ${rt(k * m1)}`, false, `${k}${rt(m1)} = ${rt(k * k * m1)}이다.`] : [`${k}${rt(m1)} = ${rt(k * k * m1)}`, true, `${k}${rt(m1)} = ${rt(`${k}<sup>2</sup> × ${m1}`)} = ${rt(k * k * m1)}이다.`],
              d.bool() ? [`${rt(s * s)} × ${rt(m2)} = ${rt(`${s} × ${m2}`)}`, false, `${rt(s * s)} × ${rt(m2)} = ${rt(`${s * s} × ${m2}`)} = ${rt(s * s * m2)}이다.`] : [`${rt(s * s)} × ${rt(m2)} = ${rt(`${s * s} × ${m2}`)}`, true, `근호 안의 수끼리 곱한다.`],
              d.bool() ? [`${frac(rt(p * m3), rt(p))} = ${rt(m3)}`, true, `${frac(rt(p * m3), rt(p))} = ${rt(frac(p * m3, p))} = ${rt(m3)}이다.`] : [`${frac(rt(p * m3), rt(p))} = ${rt(p * m3 - p)}`, false, `근호 안의 수끼리 나누어야 한다. ${frac(rt(p * m3), rt(p))} = ${rt(m3)}이다.`],
              d.bool() ? [`(${MINUS}${rt(m4)})${sup(3)} = ${MINUS}${m4}${rt(m4)}`, true, `(${MINUS}${rt(m4)})${sup(3)} = (${MINUS}${rt(m4)})${sup(2)} × (${MINUS}${rt(m4)}) = ${MINUS}${m4}${rt(m4)}이다.`] : [`(${MINUS}${rt(m4)})${sup(3)} = ${m4}${rt(m4)}`, false, `(${MINUS}${rt(m4)})${sup(3)} = (${MINUS}${rt(m4)})${sup(2)} × (${MINUS}${rt(m4)}) = ${MINUS}${m4}${rt(m4)}이다.`]
            ];
            const rows = d.until(make, (list) => { const c = list.filter((r) => r[1]).length; return c >= 1 && c <= 3; });
            const KS = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ'], right = KS.filter((_, i) => rows[i][1]);
            const combos = [right.join(', ')];
            for (const cand of d.shuffle([[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3], [0, 1, 2], [1, 2, 3], [0, 2, 3], [0, 1, 3], [0, 1, 2, 3]])) { const txt = cand.map((i) => KS[i]).join(', '); if (combos.length < 5 && !combos.includes(txt)) combos.push(txt); }
            const order = combos.slice().sort();
            return seal(C('다음 보기 가운데 옳은 것을 모두 고른 것은?', order, order.indexOf(right.join(', ')), {
              figure: lines(rows.map((r, i) => KS[i] + '. ' + nb(r[0]))),
              explain: rows.map((r, i) => `${KS[i]}. ${r[1] ? '옳다' : '옳지 않다'} — ${r[2]}`).join(' ') + ` 옳은 것은 ${right.join(', ')}이다.`,
              facts: { truth: order.map((v) => v === right.join(', ')), want: true }
            }));
          }, { count: 2 })
        ]
      },
      {
        id: 'simp', title: '근호 밖으로, 근호 안으로', standard: STD,
        types: [
          T('simp-out', '√n을 a√b 꼴로 나타내기', '①5', (d) => {
            const [a, b] = d.until(() => [d.int(2, 10), d.pick(SQF.filter((v) => v <= 30))], ([x, y]) => x * x * y <= 1000 && x * x * y >= 12);
            const n = a * a * b, neg = d.int(0, 3) === 0, src = (neg ? '-' : '') + 'r' + n, S = xv(src);
            return rA(`다음 수를 ${V('a')}${rt(V('b'))} 꼴로 나타내시오. (단, ${V('b')}는 가장 작은 자연수이다.)`, S, { figure: xex(src), explain: `${neg ? MINUS : ''}${outTold(n).replace(/ = /g, ' = ' + (neg ? MINUS : ''))}이다.`, rule: 'simp-out' });
          }),
          T('simp-factored', '소인수의 곱으로 적은 근호 안을 a√b 꼴로', '①5', (d) => {
            const PR = [2, 3, 5, 7, 11];
            const parts = d.until(() => { const ps = d.shuffle(PR).slice(0, d.int(2, 3)).sort((x, y) => x - y); return ps.map((p) => [p, d.int(1, 4)]); },
              (list) => { const n = list.reduce((s, [p, e]) => s * p ** e, 1), [k, m] = sqParts(n); return n <= 20000 && k >= 2 && m >= 2 && list.some(([, e]) => e >= 2); });
            const n = parts.reduce((s, [p, e]) => s * p ** e, 1), [k, m] = sqParts(n);
            const src = 'r(' + parts.map(([p, e]) => p + (e > 1 ? '^' + e : '')).join('*') + ')', S = xv(src);
            return rA(`다음 수를 ${V('a')}${rt(V('b'))} 꼴로 나타내시오. (단, ${V('b')}는 가장 작은 자연수이다.)`, S, {
              figure: xex(src), explain: `근호 안에서 제곱인 인수를 모은다. ${xh(src)} = ${rt(`${k}<sup>2</sup> × ${m}`)} = ${radText(k, m)}이다.`, rule: 'simp-factored'
            });
          }),
          T('simp-in', 'a√b를 √n 꼴로 나타내기', '①6', (d) => {
            const [a, b] = d.until(() => [d.int(2, 9), d.pick(SQF_SMALL)], ([x, y]) => x * x * y <= 400);
            const n = a * a * b, src = `${a}r${b}`;
            return seal(inline(`다음 수를 ${rt(V('a'))} 꼴로 나타내시오.`, rt('{0}'), [{ answer: n }], {
              figure: xex(src), shown: rt(n), explain: `근호 밖의 양수는 제곱하여 근호 안으로 넣는다. ${a}${rt(b)} = ${rt(`${a}<sup>2</sup> × ${b}`)} = ${rt(n)}이다.`, facts: { calc: [[`${a}*${a}*${b}`, 0]], rule: 'simp-in' }
            }));
          }),
          T('simp-in-frac', '근호 안이 분수인 a√b를 √n 꼴로', '①6', (d) => {
            const [a, n, p, q] = d.until(() => { const x = d.int(2, 6), y = d.int(2, 30), g = gcd(y, x * x); return [x, y, y / g, x * x / g]; }, ([, y, , den]) => !isSq(y) && den > 1);
            const src = `${a}r[${p}|${q}]`;
            return seal(inline(`다음 수를 ${rt(V('a'))} 꼴로 나타내시오.`, rt('{0}'), [{ answer: n }], {
              figure: xex(src), shown: rt(n), explain: `${a}${rt(frac(p, q))} = ${rt(`${a}<sup>2</sup> × ${frac(p, q)}`)} = ${rt(n)}이다.`, facts: { calc: [[`${a}*${a}*${p}/${q}`, 0]], rule: 'simp-in-frac' }
            }));
          }),
          T('simp-box', '근호 안으로 넣는 과정의 빈칸', '①7', (d) => {
            const a = d.int(2, 7), b = pickSqf(d, [2, 3, 5, 6, 7]), neg = d.int(0, 2) === 0, s = neg ? MINUS : '';
            return seal(inline('다음 빈칸에 알맞은 수를 차례로 적으시오.', `${grp(s + a + rt(b))} = ${grp(s + rt('{0} × ' + b))} = ${grp(s + rt('{1}'))}`, [{ answer: a * a }, { answer: a * a * b }], {
              shown: `${a * a}, ${a * a * b}`, explain: `근호 밖의 ${a}${tail(a, '을/를')} 근호 안으로 넣으면 ${a}<sup>2</sup> = ${josa(a * a, '이/가')} 곱해진다. ${s}${a}${rt(b)} = ${s}${rt(`${a * a} × ${b}`)} = ${s}${rt(a * a * b)}이다.`,
              facts: { calc: [[`${a}*${a}`, 0], [`${a}*${a}*${b}`, 1]] }
            }));
          }),
          T('simp-box-least', '다섯 등식의 □ 가운데 가장 작은(큰) 수', '①7', (d) => {
            // ① √A = □√b ② √A/√B = √□ ③ √A × √B = □√b ④ √A/√B = √□/B ⑤ √(P/Q) × √R = k√□
            const made = d.until(() => {
              const k1 = d.int(2, 6), b1 = d.pick([2, 3, 5, 6, 7]), A1 = k1 * k1 * b1;
              const B2 = d.pick([2, 3, 5]), c2 = d.pick([2, 3, 5, 6, 7]), A2 = c2 * B2;
              const A3 = d.pick([6, 10, 12, 14, 15, 18, 20, 21, 30]), B3 = d.pick([2, 3, 5, 6, 7, 10]), [k3, b3] = sqParts(A3 * B3);
              const [A4, B4] = d.shuffle([2, 3, 5, 7]).slice(0, 2);
              const m5 = d.pick([2, 3, 5, 6]), k5 = d.int(2, 5), Q5 = d.pick([3, 7, 11]), T5 = k5 * k5 * m5, divs = range(2, T5 - 1).filter((v) => T5 % v === 0 && gcd(T5 / v, Q5) === 1), s5 = divs.length ? d.pick(divs) : 0;
              return { k1, b1, A1, B2, c2, A2, A3, B3, k3, b3, A4, B4, m5, k5, Q5, P5: s5 ? T5 / s5 : 0, R5: s5 * Q5 };
            }, (x) => x.k3 >= 2 && x.b3 >= 2 && x.P5 >= 2 && x.R5 <= 120 && new Set([x.k1, x.c2, x.k3, x.A4 * x.B4, x.m5]).size === 5);
            const x = made, bx = box();
            const rows = [
              [`${rt(x.A1)} = ${bx}${rt(x.b1)}`, x.k1, `(${x.A1}/${x.b1})**0.5`, `${rt(x.A1)} = ${radText(x.k1, x.b1)}`],
              [`${frac(rt(x.A2), rt(x.B2))} = ${rt(bx)}`, x.c2, `${x.A2}/${x.B2}`, `${frac(rt(x.A2), rt(x.B2))} = ${rt(x.c2)}`],
              [`${rt(x.A3)} × ${rt(x.B3)} = ${bx}${rt(x.b3)}`, x.k3, `(${x.A3}*${x.B3}/${x.b3})**0.5`, `${rt(x.A3)} × ${rt(x.B3)} = ${rt(x.A3 * x.B3)} = ${radText(x.k3, x.b3)}`],
              [`${frac(rt(x.A4), rt(x.B4))} = ${frac(rt(bx), x.B4)}`, x.A4 * x.B4, `${x.A4}*${x.B4}`, `${frac(rt(x.A4), rt(x.B4))} = ${frac(rt(x.A4 * x.B4), x.B4)}`],
              [`${rt(frac(x.P5, x.Q5))} × ${rt(x.R5)} = ${x.k5}${rt(bx)}`, x.m5, `${x.P5}*${x.R5}/${x.Q5}/(${x.k5}*${x.k5})`, `${rt(frac(x.P5, x.Q5))} × ${rt(x.R5)} = ${rt(x.P5 * x.R5 / x.Q5)} = ${radText(x.k5, x.m5)}`]
            ];
            const list = d.shuffle(rows), wantMin = d.bool(), vals = list.map((r) => r[1]), best = wantMin ? Math.min(...vals) : Math.max(...vals);
            return seal(C(`다음 가운데 □ 안에 알맞은 수가 가장 ${wantMin ? '작은' : '큰'} 것은?`, list.map((r) => nb(r[0])), vals.indexOf(best), {
              explain: list.map((r) => `${r[3]}이므로 □ = ${r[1]}`).join(', ') + `이다. 가장 ${wantMin ? '작은' : '큰'} 것은 ${best}이다.`,
              facts: { choose: { exprs: list.map((r) => r[2]), rule: wantMin ? 'min' : 'max' } }
            }));
          }),
          T('simp-wrong', 'a√b 꼴로 고친 것 가운데 옳지 않은 것', '①8', (d) => {
            // 틀린 등식: 근호 밖으로 꺼낸 수를 제곱한 채 둔 것(√48 = 16√3), 근호 안을 덜 나눈 것(√125 = 5√25)
            const nums = d.until(() => range(1, 5).map(() => [d.int(2, 10), d.pick([2, 3, 5, 6, 7, 10, 11])]), (list) => new Set(list.map(([a, b]) => a * a * b)).size === 5 && list.every(([a, b]) => a * a * b <= 300));
            const bad = d.int(0, 4), kind = d.int(0, 1);
            const rows = nums.map(([a, b], i) => {
              const n = a * a * b, neg = d.int(0, 4) === 0, s = neg ? MINUS : '';
              if (i !== bad) return [`${s}${rt(n)} = ${s}${radText(a, b)}`, true];
              return kind === 0 ? [`${s}${rt(n)} = ${s}${a * a}${rt(b)}`, false, `${rt(n)} = ${rt(`${a}<sup>2</sup> × ${b}`)} = ${radText(a, b)}이다(근호 밖으로 나오는 수는 ${josa(a * a, '이/가')} 아니라 ${a}이다).`] : [`${s}${rt(n)} = ${s}${a}${rt(a * b)}`, false, `${a}${rt(a * b)} = ${rt(a * a * a * b)}이므로 옳지 않다. ${rt(n)} = ${radText(a, b)}이다.`];
            });
            const at = bad;
            return seal(C(`다음 수를 ${V('a')}${rt(V('b'))} 꼴로 고친 것 가운데 옳지 않은 것은?`, rows.map((r) => nb(r[0])), at, {
              explain: rows[at][2], facts: { truth: rows.map((r) => r[1]), want: false }
            }));
          }),
          T('simp-rank', '근호 안으로 넣어 크기 비교하기', '①10', (d, n) => {
            if (n === 0) {
              // 다섯 수(a√b, √a × √b, a√b ÷ √c, √n)를 모두 √N 꼴로 바꾸면 N 의 크기로 견줄 수 있다.
              const made = d.until(() => {
                const a = d.int(2, 5), b = d.pick([2, 3, 5, 6, 7]), p = d.pick([2, 3, 5, 6]), q = d.pick([3, 5, 7, 10]), c = d.int(2, 5), e = d.pick([2, 3, 5]), f = d.pick([2, 3]), raw = d.int(11, 60);
                return [
                  { h: radText(a, b), v: a * a * b, t: `${radText(a, b)} = ${rt(a * a * b)}` },
                  { h: `${rt(p)} × ${rt(q)}`, v: p * q, t: `${rt(p)} × ${rt(q)} = ${rt(p * q)}` },
                  { h: frac(`${c}${rt(e * f)}`, rt(f)), v: c * c * e, t: `${frac(`${c}${rt(e * f)}`, rt(f))} = ${c}${rt(e)} = ${rt(c * c * e)}` },
                  { h: rt(raw), v: raw, t: rt(raw) },
                  { h: radText(d.int(2, 4), 3), v: 0, t: '' }
                ].map((r, i) => (i === 4 ? (() => { const k = d.int(2, 4), m = d.pick([2, 3, 5, 7]); return { h: `${k}${rt(m)}`, v: k * k * m, t: `${k}${rt(m)} = ${rt(k * k * m)}` }; })() : r));
              }, (rows) => new Set(rows.map((r) => r.v)).size === 5 && rows.every((r) => !isSq(r.v)) && new Set(rows.map((r) => stripH(r.h))).size === 5);
              const rows = d.shuffle(made), ask = d.pick([[1, '가장 큰'], [2, '두 번째로 큰'], [5, '가장 작은'], [4, '두 번째로 작은']]);
              const sorted = rows.slice().sort((x, y) => y.v - x.v), hit = sorted[ask[0] - 1];
              return seal(C(`다음 수 가운데 ${ask[1]} 수는?`, rows.map((r) => r.h), rows.indexOf(hit), {
                explain: `모두 근호 안으로 넣어 √N 꼴로 바꾼다. ${rows.map((r) => r.t).join(', ')}이다. 근호 안의 수가 클수록 크므로 ${ask[1]} 수는 ${hit.h}이다.`,
                facts: { rank: { values: rows.map((r) => r.v), nth: ask[0] } }
              }));
            }
            // 세 수 a√b 를 작은 것부터 차례로 놓기
            const nums = d.until(() => range(1, 3).map(() => [d.int(2, 6), d.pick([2, 3, 5, 6, 7])]), (list) => new Set(list.map(([a, b]) => a * a * b)).size === 3 && new Set(list.map(([, b]) => b)).size >= 2 && new Set(list.map(([a]) => a)).size === 3);
            const vals = nums.map(([a, b]) => a * a * b), up = [0, 1, 2].sort((x, y) => vals[x] - vals[y]);
            const perms = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]], orders = [up].concat(d.shuffle(perms.filter((p) => p.join() !== up.join())).slice(0, 4));
            const shownOrders = d.shuffle(orders);
            return seal(C(`세 수 ${nums.map(([a, b]) => radText(a, b)).join(', ')}의 대소를 바르게 나타낸 것은?`, shownOrders.map((o) => nb(o.map((i) => radText(nums[i][0], nums[i][1])).join(' &lt; '))), shownOrders.findIndex((o) => o.join() === up.join()), {
              explain: `${nums.map(([a, b]) => `${radText(a, b)} = ${rt(a * a * b)}`).join(', ')}이므로 ${up.map((i) => radText(nums[i][0], nums[i][1])).join(' &lt; ')}이다.`,
              facts: { choose: { exprs: nums.map(([a, b]) => `${a}*${a}*${b}`), rule: 'ascending', orders: shownOrders } }
            }));
          }, { count: 2 })
        ]
      },
      {
        id: 'div', title: '제곱근의 나눗셈', standard: STD,
        types: [
          T('div-plain', '근호끼리 나누기', '①11', (d) => {
            const [m, b] = d.until(() => [d.pick(SQF_SMALL), d.int(2, 12)], ([x, y]) => x * y <= 99 && !isSq(y));
            const a = m * b, src = d.bool() ? `r${a}:r${b}` : `[r${a}|r${b}]`, S = xv(src);
            return rA(CALC, S, { figure: xex(src), explain: `${xh(src)} = ${rt(frac(a, b))} = ${vh(S)}이다.`, rule: 'div-plain' });
          }),
          T('div-simp', '나눈 뒤 a√b 꼴로 나타내기', '①11', (d) => {
            const [m, k, b] = d.until(() => [d.pick([2, 3, 5, 6, 7]), d.int(2, 4), d.int(2, 8)], ([x, y, z]) => x * y * y * z <= 200 && !isSq(z));
            const a = m * k * k * b, src = d.bool() ? `r${a}:r${b}` : `[r${a}|r${b}]`, S = xv(src);
            return rA(CALC, S, { figure: xex(src), explain: `${xh(src)} = ${rt(frac(a, b))} = ${rt(a / b)} = ${vh(S)}이다.`, rule: 'div-simp' });
          }),
          T('div-frac-root', '분수·소수의 제곱근을 √b/c 꼴로', '①12', (d, n) => {
            // 답의 꼴은 √b/c(근호 앞의 수가 1)로 정했다. 분수는 기약분수가 아닌 것도 준다(√(6/8) = √(3/4)).
            const pickIt = () => {
              if (n === 0) { const p = d.pick([2, 3, 5, 6, 7, 10, 11, 13]), c = d.int(2, 6), t = d.pick([1, 1, 2]); return { src: `r[${p * t}|${c * c * t}]`, p, c, t }; }
              const p = d.pick([2, 3, 5, 6, 7, 11, 13, 15, 17, 19]), zeros = d.pick([2, 4]);
              return { src: 'r' + (p / 10 ** zeros).toFixed(zeros), p, c: 10 ** (zeros / 2), t: 1 };
            };
            const made = d.until(pickIt, (x) => { const S = xv(x.src); return isOneRad(S) && S[0].q.p === 1 && S[0].q.q > 1 && x.p * x.t <= 30; });
            const S = xv(made.src), t = S[0], { p, c } = made;
            const first = n === 0 ? (made.t > 1 ? `${xh(made.src)} = ${rt(frac(p, c * c))}` : xh(made.src)) : `${xh(made.src)} = ${rt(frac(p, c * c))}`;
            return seal(inline(`다음 수를 ${frac(rt(V('b')), V('c'))} 꼴로 나타내시오. (단, ${V('b')}, ${V('c')}는 자연수이고 ${V('b')}는 가장 작은 수이다.)`, frac(rt('{0}'), '{1}'), [{ answer: t.m }, { answer: t.q.q }], {
              figure: xex(made.src), shown: vh(S), explain: `분모의 제곱수를 근호 밖으로 꺼낸다. ${first} = ${frac(rt(p), rt(c * c))} = ${vh(S)}이다.`,
              facts: { calc: [[String(t.m), 0], [`${wrap(t.d)}/${wrap(t.n)}`, 1]], rule: 'div-frac-root-' + n }
            }));
          }, { count: 2 }),
          T('div-chain', '나눗셈을 이어 하기', '①13', (d, n) => {
            const src = d.until(() => {
              const m = d.pick([2, 3, 5, 6, 7]);
              if (n === 0) { const b = d.int(2, 7), c = d.int(2, 7); return `r${m * b * c}:r${b}:r${c}`; }
              const b = d.int(2, 7), c = d.int(2, 7), e = d.int(2, 7), a = m * b * c / e;
              return Number.isInteger(a) ? `[r${a}|r${b}]:[r${c}|r${e}]` : 'r4';
            }, (s) => { const S = xv(s); return isR(S, true) && !/r(4|9|16|25|36|49|64|81|100)(?!\d)/.test(s) && (n === 1 ? !/r(\d+)\|r\1\]/.test(s) : true) && Number(String(s).match(/\d+/)[0]) <= 150; });
            const S = xv(src);
            return rA(CALC, S, { figure: xex(src), explain: `나눗셈은 역수의 곱으로 고쳐 앞에서부터 계산한다. ${told(src, [], S)}이다.`, rule: 'div-chain-' + n });
          }, { count: 2 }),
          T('div-odd', '계산 결과가 나머지 넷과 다른 하나', '①14', (d) => {
            // 넷은 값이 √(P/Q), 하나는 √(Q/P)(뒤집힌 값)가 되게 짓는다.
            const [P, Q] = d.pick([[1, 3], [1, 2], [2, 3], [1, 5], [2, 5], [3, 5], [5, 2], [5, 3]]);
            const makers = [
              () => { const s = d.pick([2, 3, 5]), t = d.pick([2, 3, 7]); return s === t || P * s === Q * t || gcd(P * s, Q * t) > 1 ? null : { src: `r[${P * s}|${Q * t}]*r[${t}|${s}]`, js: `(${P * s}/${Q * t}*${t}/${s})**0.5` }; },
              () => { const k = d.pick([2, 3, 6, 7]); return { src: `r${P * k}:r${Q * k}`, js: `(${P * k}/${Q * k})**0.5` }; },
              () => { const c = d.pick([2, 3]), A = d.pick([2, 3, 5]), Bv = c * c * A * Q / P; return Number.isInteger(Bv) && Bv <= 120 ? { src: `${c}r${A}:r${Bv}`, js: `(${c}*${c}*${A}/${Bv})**0.5` } : null; },
              () => ({ src: P === 1 ? `1:r${Q}` : `1:r[${Q}|${P}]`, js: `(${P}/${Q})**0.5` }),
              () => ({ src: `${P}*[1|r${P * Q}]`, js: `${P}/(${P * Q})**0.5` })
            ];
            const k = d.pick([2, 3, 7].filter((v) => !isSq(P * v) && !isSq(Q * v)));
            const odd = d.pick([{ src: `${Q}*[1|r${P * Q}]`, js: `${Q}/(${P * Q})**0.5` }, { src: `r${Q * k}:r${P * k}`, js: `(${Q * k}/${P * k})**0.5` }]);
            const rows = d.until(() => d.shuffle(d.shuffle(makers).slice(0, 4).map((f) => f()).concat([odd])), (list) => list.every(Boolean) && new Set(list.map((r) => r.src)).size === 5 && list.every((r) => !/^1\*|\*1$|r1(?!\d)/.test(r.src)));
            const at = rows.indexOf(odd), vals = rows.map((r) => xv(r.src));
            return seal(C('다음 가운데 계산 결과가 나머지 넷과 다른 하나는?', rows.map((r) => xh(r.src)), at, {
              explain: rows.map((r, i) => `${xh(r.src)} = ${vh(vals[i])}`).join(', ') + `이므로 다른 하나는 ${xh(odd.src)}이다.`,
              facts: { choose: { exprs: rows.map((r) => r.js), rule: 'odd' } }
            }));
          })
        ]
      },
      {
        id: 'rat', title: '분모의 유리화', standard: STD,
        types: [
          T('rat-basic', '분모가 √b인 분수의 분모 유리화', '①15', (d) => {
            const src = d.until(() => { const m = d.pick([2, 3, 5, 6, 7, 10, 11]); if (d.bool()) { const k = d.int(1, 9) * (d.int(0, 3) === 0 ? -1 : 1); return k < 0 ? `-[${-k}|r${m}]` : `[${k}|r${m}]`; } const p = d.pick([2, 3, 5, 6, 7]); return `[r${p}|r${m}]`; },
              (s) => { const S = xv(s); return isQ(S) && !/r(\d+)\|r\1\]/.test(s); });
            const S = xv(src), m = Number(src.match(/r(\d+)\]/)[1]);
            return qA('다음 수의 분모를 유리화하시오.', S, { figure: xex(src), explain: `분모와 분자에 ${rt(m)}를 곱한다. ${xh(src)} = ${vh(S)}이다.`.replace(`${rt(m)}를`, `${rt(m)}${tail(m, '을/를')}`), rule: 'rat-basic' });
          }),
          T('rat-cancel', '유리화하면 근호 앞의 수가 자연수가 되는 분수', '①15', (d) => {
            const m = d.pick([2, 3, 5, 6, 7, 10]), t = d.int(2, 5), k = m * t, src = `[${k}|r${m}]`, S = xv(src);
            return rA('다음 수의 분모를 유리화하시오.', S, { figure: xex(src), explain: `${xh(src)} = ${frac(`${k} × ${rt(m)}`, `${rt(m)} × ${rt(m)}`)} = ${frac(k + rt(m), m)} = ${vh(S)}이다.`, rule: 'rat-cancel' });
          }),
          T('rat-coef', '분모가 a√b 꼴인 분수의 분모 유리화', '①16', (d) => {
            const src = d.until(() => { const m = d.pick([2, 3, 5, 6, 7]), c = d.int(2, 5); return d.bool() ? `[${d.int(1, 9)}|${c}r${m}]` : `[r${d.pick([2, 3, 5, 7, 15])}|${c}r${m}]`; },
              (s) => isQ(xv(s)) && !/r(\d+)\|\d+r\1\]/.test(s));
            const S = xv(src), m = Number(src.match(/r(\d+)\]$/)[1]);
            return qA('다음 수의 분모를 유리화하시오.', S, { figure: xex(src), explain: `분모와 분자에 ${rt(m)}${tail(m, '을/를')} 곱한다. ${xh(src)} = ${vh(S)}이다.`, rule: 'rat-coef' });
          }),
          T('rat-simplify', '분모를 먼저 간단히 하여 유리화', '①17', (d, n) => {
            const src = d.until(() => {
              if (n === 0) { const s = d.int(2, 4), m = d.pick([2, 3, 5, 7]), N0 = s * s * m; return d.bool() ? `[${d.int(1, 9)}|r${N0}]` : `[r${d.pick([2, 3, 5, 6, 7, 14, 15])}|r${N0}]`; }
              const [p, q] = d.shuffle([2, 3, 5, 7]).slice(0, 2); return `[r${d.pick([2, 3, 5, 6, 7, 10, 14, 15, 21])}|r${p}*r${q}]`;
            }, (s) => isQ(xv(s)));
            const S = xv(src);
            return qA('다음 수의 분모를 유리화하시오.', S, { figure: xex(src), explain: `${n === 0 ? '분모를 먼저 a√b 꼴로 고친 다음' : '분모의 곱을 먼저 계산한 다음'} 유리화한다. ${told(src, [], S)}이다.`, rule: 'rat-simplify-' + n });
          }, { count: 2 }),
          T('rat-steps', '분모를 유리화하는 과정의 빈칸', '①18', (d) => {
            const m = d.pick([2, 3, 5, 6, 7, 11]), c = d.int(1, 3), k = d.until(() => d.int(1, 9), (v) => gcd(v, c * m) === 1);
            const den = (c === 1 ? '' : c) + rt(m);
            return seal(inline('다음은 분모를 유리화하는 과정이다. 빈칸에 알맞은 수를 차례로 적으시오.', `${frac(k, den)} = ${frac(`${k} × ${rt('{0}')}`, `${den} × ${rt('{1}')}`)} = ${frac(`${k === 1 ? '' : k}${rt(m)}`, '{2}')}`, [{ answer: m }, { answer: m }, { answer: c * m }], {
              shown: `${m}, ${m}, ${c * m}`, explain: `분모와 분자에 ${rt(m)}${tail(m, '을/를')} 곱한다. 분모는 ${den} × ${rt(m)} = ${c === 1 ? '' : `${c} × `}${m}${c === 1 ? '' : ` = ${c * m}`}이다.`,
              facts: { calc: [[String(m), 0], [String(m), 1], [`${c}*${m}`, 2]] }
            }));
          }),
          T('rat-right', '분모를 바르게 유리화한 것 고르기', '①19', (d) => {
            // 틀린 것: 부호를 잃은 것, 분자에 곱하지 않은 것, 분모만 근호를 없앤 것(√m × √m 을 m 이 아니라 그대로 둔 것), 분모의 수를 곱하지 않은 것
            const m = () => d.pick([2, 3, 5, 6, 7]);
            const mk1 = () => { const k = d.int(1, 9), r = m(); return { L: frac(k, rt(r)), v: k / Math.sqrt(r), R: xv(`[${k}|r${r}]`) }; };
            const right = d.until(() => { const c = d.int(2, 4), k = d.int(1, 9), r = m(); const src = d.bool() ? `[${k}|${c}r${r}]` : `[r${d.pick([2, 3, 5])}|r${r}]`; return { L: xh(src), R: xv(src) }; }, (x) => isQ(x.R));
            const wrongs = [
              () => { const x = d.until(mk1, (y) => isQ(y.R)); return [`${MINUS}${x.L} = ${vh(x.R)}`, false]; },
              () => { const k = d.int(1, 9), r = m(); return k % r === 0 ? null : [`${frac(k, rt(r))} = ${frac(k, r)}`, false]; },
              () => { const k = d.int(1, 9), c = d.int(2, 4), r = m(), S = xv(`[${k}|${c}r${r}]`); return isQ(S) ? [`${frac(k, c + rt(r))} = ${frac((k === 1 ? '' : k) + rt(r), c)}`, false] : null; },
              () => { const a = d.int(2, 5), p = d.pick([2, 3, 5]), c = d.int(2, 5), r = m(); return p === r ? null : [`${frac(a + rt(p), c + rt(r))} = ${frac(a + rt(p), c * r)}`, false]; },
              () => { const k = d.int(1, 9), c = d.int(2, 4), r = m(), w = d.pick([2, 3]); const S = xv(`[${k}|${c}r${r}]`); return isQ(S) && r * w !== r ? [`${frac(k, c + rt(r))} = ${frac((k === 1 ? '' : k) + rt(r * w), c * r * w)}`, false] : null; }
            ];
            const rows = d.until(() => [[`${right.L} = ${vh(right.R)}`, true]].concat(d.shuffle(wrongs).slice(0, 4).map((f) => f())), (list) => list.every(Boolean) && new Set(list.map((r) => stripH(r[0]))).size === 5);
            return pickRows(d, '다음 수의 분모를 유리화한 것으로 옳은 것은?', rows.map((r) => [nb(r[0]), r[1]]), { explain: `${right.L} = ${vh(right.R)}이다. 나머지는 분모와 분자에 같은 수를 곱하지 않았거나 부호를 잃었다.` });
          }),
          T('rat-back', '유리화한 결과로 모르는 수 구하기', '①20', (d, n) => {
            const a = V('a');
            if (n === 0) {
              // a/√N 을 유리화하면 √m/q 이다.
              const [s, m, q, aa] = d.until(() => { const s0 = d.int(2, 4), m0 = d.pick([2, 3, 5, 6, 7, 10, 30]), divs = range(2, s0 * m0).filter((v) => (s0 * m0) % v === 0), q0 = d.pick(divs); return [s0, m0, q0, s0 * m0 / q0]; }, ([, , q0, a0]) => a0 >= 2 && q0 >= 2);
              const N0 = s * s * m;
              return seal(N(`${frac(a, rt(N0))}의 분모를 유리화하면 ${frac(rt(m), q)}이다. ${a}의 값은?`, aa, {
                signed: true, explain: `${frac(a, rt(N0))} = ${frac(a, s + rt(m))} = ${frac(a + rt(m), s * m)}이다. ${frac(a, s * m)} = ${frac(1, q)}이므로 ${a} = ${aa}이다.`,
                facts: { calc: [[`${s}*${m}/${q}`, 0]] }
              }));
            }
            // k√a/(c√m) 을 유리화하면 √X/Y 이다.
            const [k, c, m, aa, X, Y] = d.until(() => { const k0 = d.int(2, 5), c0 = d.int(1, 3), m0 = d.pick([2, 3, 5, 6, 7]), a0 = d.pick([2, 3, 5, 7, 11, 13]), t = gcd(k0, c0 * m0); return [k0, c0, m0, a0, (k0 / t) * (k0 / t) * a0 * m0, c0 * m0 / t]; },
              ([k0, c0, m0, a0, , Y0]) => gcd(a0, m0) === 1 && Y0 >= 2 && gcd(k0, c0 * m0) > 1);
            const top = `${k}${rt(a)}`, bottom = `${c === 1 ? '' : c}${rt(m)}`;
            return seal(N(`${frac(top, bottom)}의 분모를 유리화하면 ${frac(rt(X), Y)}이다. 자연수 ${a}의 값은?`, aa, {
              signed: true, explain: `${frac(top, bottom)} = ${frac(`${k}${rt(`${m}${a}`)}`, c * m)} = ${frac(rt(`${k * k * m / (gcd(k, c * m) ** 2)}${a}`), Y)}이다. ${k * k * m / (gcd(k, c * m) ** 2)}${a} = ${X}이므로 ${a} = ${aa}이다.`,
              facts: { calc: [[`${X}/${k * k * m / (gcd(k, c * m) ** 2)}`, 0]] }
            }));
          }, { count: 2 }),
          T('rat-binom', '분자가 두 항인 분수의 분모 유리화', '①21', (d, n) => {
            if (n === 0) {
              const [p, q] = d.until(() => [d.pick([2, 3, 5, 6, 7]), d.pick([2, 3, 5, 6, 7])], ([x, y]) => x !== y && gcd(x, y) === 1), plus = d.bool(), op = plus ? '+' : '-';
              const src = `[r${p}${op}r${q}|r${p}]`, S = xv(src), sg = plus ? 1 : -1;
              const wrongs = [mk([[Q(1, p), p], [Q(sg, p), q]]), mk([[Q(1, p), p], [Q(sg, p), p * q]]), mk([[1, 1], [Q(sg, p), q]]), mk([[1, 1], [Q(-sg, p), p * q]]), mk([[1, p], [sg, q]])];
              const show = (V0) => { const t = ordV(V0); if (sameV(V0, wrongs[4])) return nb(`${rt(p)} ${plus ? '+' : MINUS} ${rt(q)}`); const num = t.map((u, i) => { const c = qmul(u.q, Q(p)); return (i === 0 ? (c.p < 0 ? MINUS : '') : c.p < 0 ? ` ${MINUS} ` : ' + ') + (u.m === 1 ? Math.abs(c.p) : (Math.abs(c.p) === 1 ? '' : Math.abs(c.p)) + rt(u.m)); }).join(''); return frac(num, p); };
              return pickV(d, `${xh(src)}의 분모를 유리화하면?`, S, wrongs, { show, explain: `분모와 분자에 ${rt(p)}${tail(p, '을/를')} 곱한다. ${frac(`(${rt(p)} ${plus ? '+' : MINUS} ${rt(q)}) × ${rt(p)}`, `${rt(p)} × ${rt(p)}`)} = ${show(S)}이다.` });
            }
            const [p, q, c] = d.until(() => [d.pick([2, 3, 5]), d.pick([2, 3, 5, 7]), d.int(2, 4)], ([x, y]) => x < y);
            const src = `[r${q}-r${p}|${c}r${p * q}]`, S = xv(src);
            const wrongs = [mk([[Q(1, c * p), q], [Q(-1, c * p), p]]), mk([[Q(1, c * q), q], [Q(-1, c * q), p]]), mk([[p, q], [-q, p]]), mk([[-p, q], [q, p]]), mk([[Q(1, c * q), p], [Q(-1, c * p), q]])];
            // 분수 뒤 토씨는 읽을 때 끝에 오는 분자(√q − √p 의 p)에 맞춘다.
            return pickV(d, `${xh(src)}${tail(p, '을/를')} 간단히 하면?`, S, wrongs, {
              explain: `분모와 분자에 ${rt(p * q)}${tail(p * q, '을/를')} 곱하면 ${frac(`${rt(q * p * q)} ${MINUS} ${rt(p * p * q)}`, c * p * q)} = ${frac(`${q}${rt(p)} ${MINUS} ${p}${rt(q)}`, c * p * q)} = ${vh(S)}이다.`
            });
          }, { count: 2 }),
          T('rat-order', '분모에 근호가 있는 수의 크기 비교', '①10', (d) => {
            const [p, q] = d.until(() => [d.pick([2, 3, 5, 6, 7]), d.pick([2, 3, 5, 6, 7])], ([x, y]) => x !== y && gcd(x, y) === 1 && x > 1);
            const rows = d.shuffle([
              { h: frac(rt(p), q), v: Math.sqrt(p) / q, t: frac(rt(p), q) },
              { h: frac(rt(p), rt(q)), v: Math.sqrt(p / q), t: `${frac(rt(p), rt(q))} = ${frac(rt(p * q), q)}` },
              { h: rt(q), v: Math.sqrt(q), t: `${rt(q)} = ${frac(rt(q * q * q), q)}` },
              { h: frac(p, rt(q)), v: p / Math.sqrt(q), t: `${frac(p, rt(q))} = ${frac(rt(p * p * q), q)}` },
              { h: frac(p, q), v: p / q, t: `${frac(p, q)} = ${frac(rt(p * p), q)}` }
            ]);
            const nth = d.int(2, 4), sorted = rows.slice().sort((x, y) => x.v - y.v), hit = sorted[nth - 1];
            if (new Set(rows.map((r) => r.v.toFixed(9))).size !== 5) throw new Error('같은 값');
            return seal(C(`다음 수를 작은 것부터 차례로 놓을 때 ${['', '첫', '두', '세', '네'][nth]} 번째에 오는 수는?`, rows.map((r) => r.h), rows.indexOf(hit), {
              explain: `분모를 ${q}로 맞추어 ${frac(rt(V('N')), q)} 꼴로 고치면 ${rows.map((r) => r.t).join(', ')}이다. 근호 안의 수를 견주면 ${['', '첫', '두', '세', '네'][nth]} 번째는 ${hit.h}이다.`,
              facts: { rank: { values: rows.map((r) => r.v), nth: 6 - nth } }
            }));
          })
        ]
      },
      { id: 'muldiv', title: '곱셈과 나눗셈이 섞인 계산', standard: STD, types: [] },
      { id: 'value', title: '제곱근을 문자와 값으로 나타내기', standard: STD, types: [] },
      { id: 'addsub', title: '제곱근의 덧셈과 뺄셈', standard: STD, types: [] },
      { id: 'mixed', title: '근호를 포함한 식의 혼합 계산', standard: STD, types: [] },
      { id: 'apply', title: '계수 맞추기와 식의 값', standard: STD, types: [] },
      { id: 'compare', title: '대소 관계와 정수 부분·소수 부분', standard: STD, types: [] },
      { id: 'figure', title: '도형과 수직선', standard: STD, types: [] }
    ]
  });

  // ── 곱셈과 나눗셈이 섞인 계산 ──
  // 나눗셈을 역수의 곱셈으로 고친 식(풀이의 한 줄): a ÷ b → a × 1/b, a ÷ (x/y) → a × y/x
  function recipNode(node) {
    const n = X(node);
    const inv = (b) => (b.t === 'frac' ? { t: 'frac', a: b.b, b: b.a } : { t: 'frac', a: { t: 'num', s: '1' }, b });
    if (n.t === 'div') return { t: 'mul', a: recipNode(n.a), b: inv(n.b) };
    if (n.t === 'mul') return { t: 'mul', a: recipNode(n.a), b: n.b };
    if (n.t === 'neg') return { t: 'neg', a: recipNode(n.a) };
    return n;
  }
  const recipLine = (src) => htmlX(recipNode(src));
  // 등식 그림: 식 = 값
  const eqex = (left, right) => '<span class="mb-expr"' + fit(emX(left) + emX(right) + 1.62) + '>' + htmlX(left, true) + ' <i>=</i> ' + htmlX(right, true) + '</span>';
  const RADS = [2, 3, 5, 6, 7, 8, 10, 12, 14, 15, 18, 20, 21, 24, 27, 28, 30];
  const hasSquare = (s) => (String(s).match(/r(\d+)(?![\d.])/g) || []).some((t) => sqParts(Number(t.slice(1)))[0] > 1);

  B.addTypes(UNIT, 'muldiv', [
    T('md-root', '곱셈과 나눗셈이 섞인 계산', '①22', (d, n) => {
      // 근호 안에 제곱인 인수가 있는 수를 하나 이상 섞는다. 둘째 차례는 음수와 분수 꼴로 나누는 식이다.
      const r = () => d.pick(RADS), c = () => d.int(2, 5);
      const src = d.until(() => (n === 0
        ? d.pick([() => `${c()}r${r()}:r${r()}*r${r()}`, () => `${c()}r${r()}*${c()}r${r()}:r${r()}`, () => `r${r()}:r${r()}*${c()}r${r()}`, () => `${c()}r${r()}*${c()}r${r()}:${c()}r${r()}`])()
        : d.pick([() => `-${c()}r${r()}:r${r()}*${c()}r${r()}`, () => `${c()}r${r()}:(-r${r()})*r${r()}`, () => `r${r()}*(-r${r()}):[r${r()}|${c()}]`, () => `-${c()}r${r()}*r${r()}:(-${c()}r${r()})`])()),
      (s) => { const S = xv(s); return isR(S) && Math.abs(S[0].q.p) <= 60 && hasSquare(s) && new Set(s.match(/r\d+/g)).size === s.match(/r\d+/g).length; });
      const S = xv(src);
      return rA(CALC, S, { figure: xex(src), explain: `나눗셈은 역수의 곱셈으로 고쳐서 계산한다. ${xh(src)} = ${recipLine(src)} = ${vh(S)}이다.`, rule: 'md-root-' + n });
    }, { count: 2 }),
    T('md-power', '거듭제곱이 낀 곱셈과 나눗셈', '①22', (d) => {
      const src = d.until(() => `(${d.bool() ? '-' : ''}${d.int(2, 3)}r${d.pick([2, 3, 5])})^2*r${d.pick([6, 8, 12, 18, 20, 24])}:r${d.pick([2, 3, 5, 6])}:r${d.pick([12, 18, 27, 8, 20, 45])}`, (s) => isR(xv(s)) && Math.abs(xv(s)[0].q.p) <= 40);
      const S = xv(src), base = src.match(/^\((-?\d+r\d+)\)\^2/)[1], B2 = xv(`(${base})^2`);
      return rA(CALC, S, { figure: xex(src), explain: `거듭제곱을 먼저 계산한다. (${xh(base)})${sup(2)} = ${vh(B2)}이다. ${xh(src)} = ${recipLine(src.replace(/^\(-?\d+r\d+\)\^2/, vh(B2).replace(/\D/g, '')))} = ${vh(S)}이다.`, rule: 'md-power' });
    }),
    T('md-rat', '곱셈과 나눗셈 뒤 분모의 유리화', '①23', (d, n) => {
      const r = () => d.pick([2, 3, 5, 6, 7, 8, 10, 12, 15, 18]), c = () => d.int(2, 6);
      const src = d.until(() => (n === 0
        ? d.pick([() => `r${r()}*r${r()}:[r${r()}|r${r()}]`, () => `r${r()}*[${c()}r${r()}|r${r()}]:r${r()}`, () => `${c()}r${r()}:r${r()}*r${r()}`])()
        : d.pick([() => `${c()}r${r()}:(-${c()}r${r()})`, () => `-${c()}r${r()}:${c()}r${r()}*r[${d.pick([3, 5, 9])}|${d.pick([2, 7])}]`, () => `${c()}r${r()}*(-r${r()}):${c()}r${r()}`])()),
      (s) => { const S = xv(s); return isQ(S) && Math.abs(S[0].q.p) <= 30 && S[0].q.q <= 30 && new Set(s.match(/r\d+/g)).size === s.match(/r\d+/g).length && (n === 0 || S[0].q.p < 0); });
      const S = xv(src);
      return qA(CALC, S, { figure: xex(src), explain: `나눗셈은 역수의 곱셈으로 고치고, 끝에 분모를 유리화한다. ${xh(src)} = ${recipLine(src)} = ${vh(S)}이다.`, rule: 'md-rat-' + n });
    }, { count: 2 }),
    T('md-back', '곱셈과 나눗셈 식에서 근호 안의 수 구하기', '①24', (d) => {
      const [k, p, q, c] = d.until(() => [d.pick([2, 3, 4, 6]), d.pick([5, 6, 10, 15, 20, 30]), d.pick([2, 3, 8, 12, 18, 27, 48]), d.int(2, 5)], ([k0, p0, q0, c0]) => (c0 * c0 * p0 * q0) % (k0 * k0) === 0 && c0 * c0 * p0 * q0 / (k0 * k0) <= 999 && gcd(k0, p0) < k0);
      const x = c * c * p * q / (k * k), left = `[${k}|r${p}]*ra:r${q}`;
      return seal(N(`다음 등식을 만족시키는 유리수 ${V('a')}의 값은?`, x, {
        signed: true, figure: eqex(left, String(c)),
        explain: `${xh(left)} = ${frac(`${k}${rt(V('a'))}`, rt(`${p} × ${q}`))} = ${c}이므로 ${rt(V('a'))} = ${frac(`${c}${rt(p * q)}`, k)} = ${rt(x)}, ${V('a')} = ${x}이다.`,
        facts: { calc: [[`${c}*${c}*${p}*${q}/(${k}*${k})`, 0]] }
      }));
    }),
    T('md-back-root', '근호 안의 문자를 구해 다른 제곱근을 a√b 꼴로', '심6', (d) => {
      const [c, b, a0] = d.until(() => [d.int(2, 4), d.pick([2, 3, 5, 6, 7]), d.int(1, 20)], ([c0, b0, x0]) => { const [k, m] = sqParts(c0 * c0 * b0 + x0); return k >= 2 && m >= 2 && x0 !== c0 * c0 * b0; });
      const x = c * c * b + a0, S = xv(`r${x}`), xv0 = V('x');
      return rA(`${frac(rt(`${xv0} ${MINUS} ${a0}`), rt(b))} = ${c}일 때, ${rt(xv0)}를 ${V('a')}${rt(V('b'))} 꼴로 나타내시오. (단, ${V('b')}는 가장 작은 자연수이다.)`, S, {
        explain: `${rt(`${xv0} ${MINUS} ${a0}`)} = ${c}${rt(b)} = ${rt(c * c * b)}이므로 ${xv0} ${MINUS} ${a0} = ${c * c * b}, ${xv0} = ${x}이다. ${rt(x)} = ${vh(S)}이다.`,
        facts: { calc: [[calcOf(S[0]).replace(String(x), `(${c}*${c}*${b}+${a0})`), 0], [String(S[0].m), 1]] }
      });
    }, { source: '수집본 심화 자료(심6)' }),
    T('md-area', '넓이·부피에서 다른 변의 길이 구하기', '①25', (d, n) => {
      if (n === 0) {
        // 삼각형(밑변 √a, 높이 √b)과 직사각형(가로 √c, 세로 x)의 넓이가 같다: √(ab)/2 = x√c
        const [a, b, c, x] = d.until(() => { const c0 = d.pick([6, 8, 12, 15, 18, 20, 24, 27, 28]), x0 = d.int(2, 5), ab = 4 * c0 * x0 * x0, divs = range(2, 99).filter((v) => ab % v === 0 && ab / v <= 99); const a0 = divs.length ? d.pick(divs) : 1; return [a0, ab / a0, c0, x0]; },
          ([a0, b0]) => a0 > 1 && b0 > 1 && a0 !== b0 && !isSq(a0) && !isSq(b0));
        return seal(N(`밑변의 길이가 ${rt(a)} cm, 높이가 ${rt(b)} cm인 삼각형과 가로의 길이가 ${rt(c)} cm인 직사각형의 넓이가 같다. 직사각형의 세로의 길이는 몇 cm인가?`, x, {
          unit: 'cm', explain: `삼각형의 넓이는 ${frac(1, 2)} × ${rt(a)} × ${rt(b)} = ${frac(rt(a * b), 2)} = ${vh(xv(`[r${a * b}|2]`))} (cm²)이다. 직사각형의 세로의 길이를 ${V('x')} cm라 하면 ${rt(c)} × ${V('x')} = ${vh(xv(`[r${a * b}|2]`))}이므로 ${V('x')} = ${x}이다.`,
          facts: { calc: [[`(${a}*${b}/(4*${c}))**0.5`, 0]] }
        }));
      }
      // 직육면체: 부피 k√m, 밑면 √a × √b → 높이 h
      const [a, b, h] = d.until(() => [d.pick([2, 3, 5, 6, 8, 10, 12]), d.pick([3, 6, 8, 10, 15, 18, 24]), d.int(2, 9)], ([a0, b0]) => a0 !== b0 && !isSq(a0 * b0) && sqParts(a0 * b0)[0] >= 1);
      const V0 = xv(`${h}r${a * b}`), t = V0[0];
      return seal(N(`부피가 ${vh(V0)} cm³인 직육면체의 밑면의 가로, 세로의 길이가 각각 ${rt(a)} cm, ${rt(b)} cm일 때, 이 직육면체의 높이는 몇 cm인가?`, h, {
        unit: 'cm', explain: `밑넓이는 ${rt(a)} × ${rt(b)} = ${vh(xv(`r${a * b}`))} (cm²)이다. 높이는 ${vh(V0)} ÷ ${vh(xv(`r${a * b}`))} = ${h} (cm)이다.`,
        facts: { calc: [[`${t.q.p}/(${a}*${b}/${t.m})**0.5`, 0]] }
      }));
    }, { count: 2 }),
    T('md-square', '넓이가 같은 정사각형의 한 변의 길이', '①26', (d, n) => {
      const ok = (v) => { const [k, m] = sqParts(v); return k >= 2 && m >= 2 && k <= 20; };
      if (n === 0) {
        const [a, b] = d.until(() => [d.int(2, 30), d.int(2, 30)], ([x, y]) => x > y && ok(x * y));
        const S = xv(`r(${a}*${b})`);
        return rA(`가로의 길이가 ${a} cm, 세로의 길이가 ${b} cm인 직사각형과 넓이가 같은 정사각형의 한 변의 길이는?`, S, { unit: 'cm', explain: `직사각형의 넓이는 ${a} × ${b} = ${a * b} (cm²)이다. 정사각형의 한 변의 길이는 ${rt(a * b)} = ${vh(S)} (cm)이다.` });
      }
      if (n === 1) {
        const [A, t] = d.until(() => [d.int(8, 80), d.int(2, 5)], ([x, y]) => !isSq(x) && ok(x * y));
        const S = xv(`r(${A}*${t})`);
        return rA(`넓이가 ${A} cm²인 정사각형이 있다. 넓이가 이 정사각형의 ${t}배인 정사각형의 한 변의 길이는?`, S, { unit: 'cm', explain: `새 정사각형의 넓이는 ${A} × ${t} = ${A * t} (cm²)이다. 한 변의 길이는 ${rt(A * t)} = ${vh(S)} (cm)이다.` });
      }
      const [a, b] = d.until(() => [d.int(4, 90), d.int(4, 60)], ([x, y]) => (x * y) % 2 === 0 && ok(x * y / 2) && x !== y);
      const S = xv(`r(${a}*${b}:2)`);
      return rA(`밑변의 길이가 ${a} m, 높이가 ${b} m인 삼각형 모양의 땅이 있다. 이 땅과 넓이가 같은 정사각형 모양의 땅의 한 변의 길이는?`, S, { unit: 'm', explain: `삼각형 모양의 땅의 넓이는 ${frac(1, 2)} × ${a} × ${b} = ${a * b / 2} (m²)이다. 정사각형의 한 변의 길이는 ${rt(a * b / 2)} = ${vh(S)} (m)이다.` });
    }, { count: 3 })
  ]);

  // ── 제곱근을 문자와 값으로 나타내기 ──
  // 근삿값의 글: 숫자 넷(유효숫자)을 점의 자리만 옮겨 적는다. digits '2302', point(정수 부분의 자리 수) 1 → 2.302
  const placed = (digits, point) => (point <= 0 ? '0.' + '0'.repeat(-point) + digits : point >= digits.length ? digits + '0'.repeat(point - digits.length) : digits.slice(0, point) + '.' + digits.slice(point));
  const fourDigits = (v) => { const e = Math.floor(Math.log10(v)); return [String(Math.round(v / 10 ** (e - 3))), e + 1]; };

  B.addTypes(UNIT, 'value', [
    T('val-power', '제곱근을 √p, √q의 거듭제곱의 곱으로', '①27', (d) => {
      const [p, q, i, j] = d.until(() => { const [x, y] = d.shuffle([2, 3, 5, 7]).slice(0, 2); return [x, y, d.int(2, 4), d.int(2, 4)]; }, ([x, y, e, f]) => x ** e * y ** f <= 2000);
      const N0 = p ** i * q ** j, a = V('a'), b = V('b');
      return seal(inline(`${a} = ${rt(p)}, ${b} = ${rt(q)}일 때, 빈칸에 알맞은 수를 차례로 적으시오.`, `${rt(N0)} = ${a}<sup>{0}</sup>${b}<sup>{1}</sup>`, [{ answer: i }, { answer: j }], {
        shown: `${rt(N0)} = ${a}${sup(i)}${b}${sup(j)}`,
        explain: `${rt(N0)} = ${rt(`${p}${sup(i)} × ${q}${sup(j)}`)} = (${rt(p)})${sup(i)} × (${rt(q)})${sup(j)} = ${a}${sup(i)}${b}${sup(j)}이다.`,
        facts: { calc: [[String(i), 0], [String(j), 1]] }
      }));
    }),
    T('val-letters', '한 제곱근을 두 문자로 나타내기', '①28', (d, n) => {
      if (n === 0) {
        const [p, q] = d.shuffle([2, 3, 5, 7]).slice(0, 2), k = d.int(1, 3), N0 = k * k * p * q;
        const val = ([c, i, j]) => c * Math.sqrt(p) ** i * Math.sqrt(q) ** j, show = ([c, i, j]) => lt(c, 'a' + (i > 1 ? i : '') + 'b' + (j > 1 ? j : ''));
        const right = [k, 1, 1], cands = [[k * k, 1, 1], [-k, 1, 1], [k + 1, 1, 1], [k, 2, 1], [k, 1, 2], [2 * k, 1, 1], [k + 2, 1, 1]];
        const pool = [right]; for (const c of d.shuffle(cands)) if (pool.length < 5 && pool.every((x) => !near(val(x), val(c)))) pool.push(c);
        return pickRows(d, `${rt(p)} = ${V('a')}, ${rt(q)} = ${V('b')}일 때, ${rt(N0)}${tail(N0, '을/를')} ${V('a')}, ${V('b')}를 사용하여 나타내면?`, pool.map((x) => [show(x), x === right]), {
          explain: `${rt(N0)} = ${rt(`${k > 1 ? k + '<sup>2</sup> × ' : ''}${p} × ${q}`)} = ${k > 1 ? k : ''}${rt(p)} × ${rt(q)} = ${show(right)}이다.`
        });
      }
      const p = d.pick([2, 3, 5, 7]), u = d.pick([2, 3]), dec = (p / 100).toFixed(2);
      const val = ([c, e]) => c * Math.sqrt(p) / Math.sqrt(10 * u) ** e;
      const show = ([c, e]) => frac(lt(c, 'a'), letters('b' + (e > 1 ? e : '')));
      const right = [u, 2], cands = [[1, 2], [u, 1], [10, 2], [u * u, 2], [2 * u, 2], [1, 1]];
      const pool = [right]; for (const c of d.shuffle(cands)) if (pool.length < 5 && pool.every((x) => !near(val(x), val(c)))) pool.push(c);
      return pickRows(d, `${rt(p)} = ${V('a')}, ${rt(10 * u)} = ${V('b')}일 때, ${rt(dec)}${tail(p, '을/를')} ${V('a')}, ${V('b')}를 사용하여 나타내면?`, pool.map((x) => [show(x), x === right]), {
        explain: `${rt(dec)} = ${rt(frac(p, 100))} = ${frac(rt(p), 10)}이다. ${V('b')}<sup>2</sup> = ${10 * u}이므로 10 = ${frac(V('b') + sup(2), u)}이고, ${frac(rt(p), 10)} = ${show(right)}이다.`
      });
    }, { count: 2 }),
    T('val-letters-back', '두 문자의 곱을 √n 꼴로', '①28', (d) => {
      const [p, q] = d.shuffle([2, 3, 5, 7, 11]).slice(0, 2), k = d.int(2, 4), n = k * k * p * q;
      return seal(N(`${V('a')} = ${rt(p)}, ${V('b')} = ${rt(q)}일 때, ${k}${V('a')}${V('b')} = ${rt(V('n'))}이다. 자연수 ${V('n')}의 값은?`, n, {
        signed: true, explain: `${k}${V('a')}${V('b')} = ${k}${rt(p)}${rt(q)} = ${k}${rt(p * q)} = ${rt(`${k}<sup>2</sup> × ${p * q}`)} = ${rt(n)}이므로 ${V('n')} = ${n}이다.`,
        facts: { calc: [[`${k}*${k}*${p}*${q}`, 0]] }
      }));
    }),
    T('val-letters-sum', '여러 항의 식을 두 문자로 나타내기', '①29', (d) => {
      const [p, q] = d.pick([[2, 3], [3, 5], [2, 5], [2, 7], [3, 7], [2, 6], [3, 6]]), withAB = gcd(p, q) === 1;
      const bases = [[p, 'a'], [q, 'b']].concat(withAB ? [[p * q, 'ab']] : []);
      const made = d.until(() => {
        const terms = range(1, d.int(2, 4)).map(() => { const [m, name] = d.pick(bases), s = d.int(1, 6), c = d.pick([1, 1, 2, 3]), sg = d.bool() ? 1 : -1; return { m, name, s, c, sg }; });
        return terms;
      }, (terms) => { const tot = {}; terms.forEach((t) => { tot[t.name] = (tot[t.name] || 0) + t.sg * t.c * t.s; }); return Object.values(tot).filter((v) => v !== 0).length >= 2 && new Set(terms.map((t) => t.c * t.c * t.s * t.s * t.m)).size === terms.length && terms.some((t) => t.s > 1) && terms[0].sg > 0; });
      const src = made.map((t, i) => (t.sg < 0 ? '-' : i ? '+' : '') + (t.c > 1 ? t.c : '') + 'r' + t.s * t.s * t.m).join('');
      const coef = (x, y, z) => [[x, 'a'], [y, 'b'], [z, 'ab']];
      const tot = { a: 0, b: 0, ab: 0 }; made.forEach((t) => { tot[t.name] += t.sg * t.c * t.s; });
      const val = (list) => list.reduce((s, [c, v]) => s + c * (v === 'a' ? Math.sqrt(p) : v === 'b' ? Math.sqrt(q) : Math.sqrt(p * q)), 0);
      const right = coef(tot.a, tot.b, tot.ab);
      const cands = [coef(tot.b, tot.a, tot.ab), coef(-tot.a, tot.b, tot.ab), coef(tot.a, -tot.b, -tot.ab), coef(tot.a + 1, tot.b, tot.ab), coef(tot.a, tot.b - 1, tot.ab), coef(tot.a, tot.b + tot.ab, 0), coef(tot.a + tot.ab, tot.b, 0)];
      const pool = [right]; for (const c of d.shuffle(cands)) if (pool.length < 5 && pool.every((x) => !near(val(x), val(c))) && lsum(c) !== '0') pool.push(c);
      return pickRows(d, `${rt(p)} = ${V('a')}, ${rt(q)} = ${V('b')}일 때, 다음 식을 ${V('a')}, ${V('b')}를 사용하여 나타내면?`, pool.map((x) => [lsum(x), x === right]), {
        figure: xex(src), explain: `${xh(src)} = ${simpLine(src) || xh(src)}이다. ${rt(p)} = ${V('a')}, ${rt(q)} = ${V('b')}${withAB ? `, ${rt(p * q)} = ${V('a')}${V('b')}` : ''}이므로 ${lsum(right)}이다.`
      });
    }),
    T('val-times', '소수의 제곱근은 √m의 몇 배인가', '①30', (d) => {
      const [m, k, X, e] = d.until(() => { const m0 = d.pick([2, 3, 5, 6, 7]), v = d.pick([2, 4, 5, 10, 20]), u = d.int(1, 9), k0 = Q(u, v), x0 = qmul(qmul(k0, k0), Q(m0)); let e0 = 0; while (!isInt(qmul(x0, Q(100 ** e0)))) e0 += 1; return [m0, k0, x0, e0]; },
        ([, k0, x0, e0]) => k0.q > 1 && !isInt(x0) && fl(x0) < 10 && e0 <= 2 && String(fl(x0)).length <= 5);
      const Xs = String(fl(X)), S = xv('r' + Xs), N0 = Math.round(fl(X) * 100 ** e), ask = d.bool();
      const text = ask ? `${rt(Xs)}는 ${rt(m)}의 몇 배인가?`.replace(`${rt(Xs)}는`, `${rt(Xs)}${tail(Number(Xs.slice(-1)), '은/는')}`) : `${rt(Xs)} = ${V('k')}${rt(m)}일 때, 유리수 ${V('k')}의 값은?`;
      return fA(text, [S[0]].map((t) => Object.assign({}, t, { m: 1 })), {
        unit: ask ? '배' : undefined,
        explain: `${rt(Xs)} = ${rt(frac(N0, 100 ** e))} = ${frac(rt(N0), 10 ** e)} = ${frac(radText(sqParts(N0)[0], m), 10 ** e)} = ${mag(k)}${rt(m)}이므로 ${ask ? `${mag(k)}배` : `${V('k')} = ${mag(k)}`}이다.`
      });
    }),
    T('val-approx', '주어진 제곱근의 값으로 다른 제곱근의 값 구하기', '①31', (d, n) => {
      // √X(두 자리 수 X)와 √(X/10)의 값(유효숫자 넷)을 주고, 100배·1/100배 한 수의 제곱근을 묻는다.
      // 소수 칸으로 받을 때(FINE_DECIMAL)는 답이 소수 셋째 자리까지인 것만 묻는다(한 유형 안에서 칸의 모양이 늘 같게).
      const decimals = (txt) => (txt.split('.')[1] || '').replace(/0+$/, '').length;
      const made = d.until(() => {
        const X0 = d.int(11, 99), [g1, p1] = fourDigits(Math.sqrt(X0 / 10)), [g2, p2] = fourDigits(Math.sqrt(X0));
        // 묻는 수: 근호 안 X·10^e(e 는 짝수 배만큼 점이 옮겨진다)
        const asks = n === 0 ? [[X0 * 10, g1, p1 + 1], [X0 * 100, g2, p2 + 1], [X0 * 1000, g1, p1 + 2]] : [[X0 / 100, g2, p2 - 1], [X0 / 1000, g1, p1 - 1]];
        const [Y, gd, pt] = d.pick(asks);
        return { X0, g1, p1, g2, p2, Y, gd, pt, ans: placed(gd, pt) };
      }, (x) => !isSq(x.X0) && x.X0 % 10 !== 0 && (!FINE_DECIMAL || (decimals(x.ans) <= 3 && decimals(x.ans) >= 1)));
      const { X0, g1, p1, g2, p2, Y, gd, pt, ans } = made;
      const small = placed(g1, p1), big = placed(g2, p2), Xs = (X0 / 10).toFixed(1), Ys = String(Number(Y.toFixed(4)));
      const text = `${rt(Xs)} = ${small}, ${rt(X0)} = ${big}일 때, ${rt(Ys)}의 값은?`;
      const why = `${rt(Ys)} = ${Y > X0 ? (gd === g1 ? `${rt(Xs)} × ${10 ** (pt - p1)}` : `${rt(X0)} × ${10 ** (pt - p2)}`) : (gd === g1 ? `${rt(Xs)} ÷ ${10 ** (p1 - pt)}` : `${rt(X0)} ÷ ${10 ** (p2 - pt)}`)} = ${ans}이다.`;
      const expl = `근호 안의 수가 100배가 되면 제곱근은 10배가 된다. ${why}`;
      if (FINE_DECIMAL) return seal(D(text, Number(ans), { signed: true, explain: expl, facts: { calc: [[`${gd}/${10 ** (4 - pt)}`, 0]] } }));
      const opts = [];
      for (const [gg, pp] of d.shuffle([[g1, p1 - 1], [g1, p1], [g1, p1 + 1], [g1, p1 + 2], [g2, p2 - 1], [g2, p2 + 1], [g2, p2 + 2], [g2, p2 - 2], [g1, p1 - 2]])) { const v = placed(gg, pp); if (opts.length < 4 && v !== ans && v !== small && v !== big && !opts.includes(v)) opts.push(v); }
      const rows = d.shuffle(opts.concat([ans]));
      return seal(C(text, rows, rows.indexOf(ans), { explain: expl, facts: { truth: rows.map((v) => v === ans), want: true } }));
    }, { count: 2 })
  ]);

  // 내보내는 곳(같은 단원의 b·c 파일이 쓴다)
  const kit = { STD, STD_CMP, UNIT, T, ruled, CALC, ONE, SQF, SQF_SMALL, isSq, pickSqf, parse, X, wrap, mulS, numV, rootT, mulT, invT, negT, addV, negV, mulV, divV, valX, xv, fv, isZero, isRat, ratOf, isIntV, isOneRad, sameV, ordV, termOf, mk,
    termH, vh, lastNum, vj, htmlX, emX, xh, xex, named, xtagged, emV, simpNode, simpLine, told, outTold, calcOf, stripH, seal, more, isR, rA, isN, nA, isFr, fA, isQ, qA, isS, sA, isTw, tA, pickV,
    fz, fzH, letters, lt, lsum, pickRows, near, pn, co, FINE_DECIMAL };
  B.kit.m912 = kit;
})(typeof window !== 'undefined' ? window : globalThis);
