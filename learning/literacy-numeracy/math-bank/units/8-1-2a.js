// 중학교 2학년 1학기 2단원 식의 계산 — 단원 틀·도구와 앞쪽 묶음(지수법칙, 지수법칙으로 수 구하기, 단항식의 곱셈과 나눗셈).
// 수집해 둔 교과서 3종(미래엔 황선욱 2015·2022, 천재 김동재·김화경)의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1: 93꼴, 기본꼴 2: 87꼴, 심화꼴: 76꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 뺌(까닭) / 겹침」을 가른 대조표는 references/textbooks/수학/_분석/8-1-2/싣기_대조표.md 에 있다.
// (다항식의 덧셈과 뺄셈, 단항식과 다항식의 곱셈, 다항식과 단항식의 나눗셈·섞인 계산, 식의 값과 식의 대입은 8-1-2b.js 에, 실력 문항은 8-1-2c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
// 영역은 변화와 관계. 성취기준은 9수02-08(지수법칙을 이해하고 식을 간단히 하기), 9수02-09(다항식의 덧셈과 뺄셈), 9수02-10((단항식)×(다항식), (다항식)÷(단항식))이다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(식·등식·계산 과정·그림·상황), 묻는 것(식·지수·계수·고르기·빈칸), 계산 구조가 다르면 따로 싣는다.
//    계산 문항은 구조가 다를 때만 따로 싣고 facts.rule 에 이름을 단다. 수와 문자만 바꾼 유형은 만들지 않는다.
//  - 교육과정: 「지수법칙은 지수가 자연수인 범위에서 단항식의 곱셈과 나눗셈을 하는 데 필요한 정도로 다룬다.」
//    「다항식의 나눗셈에서는 다항식을 단항식으로 나누어 그 몫이 다항식이 되는 경우만 다룬다.」
//    지수를 0이나 음수로 적지 않는다. aᵐ ÷ aⁿ 에서 m = n 이면 1, m < n 이면 1/aⁿ⁻ᵐ 이 되는 것은 두 교과서가 지수법칙의 한 경우로 가르치므로 싣는다
//    (단항식 ÷ 단항식의 몫에 분모의 문자가 남는 것도 이 경우이다). 분모에 문자가 있는 식으로 나누는 것, (다항식) ÷ (단항식)의 몫이 다항식이 아닌 것,
//    (다항식) × (다항식), 등식을 한 문자에 대하여 풀기, 분모가 문자인 식의 통분은 싣지 않는다. 계수만 분수인 단항식 (2/3)x²y 로 나누는 것은 싣는다.
//  - 답: 지수와 □ 안의 수는 수 칸(지수는 자연수이므로 부호 단추가 없다), 계수는 부호 단추가 붙은 수 칸으로 받는다.
//    답이 단항식이면 「[±][ ]x^[ ]y^[ ]」(monoAns), 계수가 1인 거듭제곱의 곱이면 지수 칸만(powQ), 답이 다항식이면 항마다 「[±][ ]문자」(polyAns)로 받는다.
//    문자가 약분되어 사라지는 꼴, 계수가 분수인 꼴, 답이 분수 꼴(1/a³)인 꼴은 칸의 모양이 답을 흘리므로 고르기로 낸다.
//    틀린 보기는 저마다 아이들이 실제로 하는 잘못 하나로 만든 식이다(지수를 곱할 것을 더한다, 계수는 거듭제곱하지 않는다, 분자만 거듭제곱한다,
//    같은 것끼리 나누어 0이라 한다, 뒤의 나눗셈부터 계산한다, 역수를 계수만 뒤집는다, 괄호 앞의 −를 첫 항에만 쓴다 …).
//    원문의 「axᵐyⁿ 꼴일 때 a + m + n」처럼 뜻 없이 합을 묻는 꼴은 값을 따로 받는다(그러면 식을 답하는 유형과 같은 일이 되어 한 번만 실었다).
//  - 답은 모두 코드가 셈한다. 식을 한 줄 글(식 글)로 적고, 그 글 하나에서 화면 글·값·풀이의 계산 줄·검사 식을 얻는다.
//    검사가 다시 셈하는 식(facts.calc)은 식 글에 적힌 수로 계수와 지수를 셈하는 식이다(계수는 수끼리, 지수는 지수끼리 따로 셈한다).
//  - 용어는 교육과정의 것만 쓴다(전개). 「이차식」「식의 값」「전개식」은 자료가 쓰는 자리에서만 쓴다.
//  - 꼴 목록에 적힌 원문 답지의 잘못(①36의 보기, 심65의 최상위 15번 등)은 따르지 않는다.
//
// 뺀 것과 까닭(8-1-2b.js, 8-1-2c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 처음에는 지수법칙을 수의 성질 문제로 끌고 가는 것(가장 큰 바깥 지수, 이어진 등식, 지수가 식인 거듭제곱과 그 등식, 일의 자리의 숫자, 거듭제곱의 크기 비교, 역수 꼴을 문자로 나타내기,
//    자릿수와 「a = 2ˣ일 때 8ˣ을 a로」의 다른 꼴), 요령이 드는 것(심2·10·11·24·26·34·37·70), 뿔·구·회전체가 나오는 것, 계수가 순환소수인 것(심31)을 뺐으나,
//    2026-10-13에 다시 따져 8-1-2c.js 끝의 「다시 실은 꼴」에 실었다(상위 학년 내용이 있어야 풀리는 것만 뺀다).
//    그 가운데 그대로 뺀 것: 거듭제곱 마방진(②29 — 그림을 알 수 없다), 공통인수로 묶어 분모가 다항식인 식이 되는 것(심14), 지수가 0이 될 수 있는 꼴(지수 x − 1 — 지수 x + 1 꼴로 바꾸어 실었다).
//  - 중1의 일: 잇단 수의 곱을 소인수분해 하기(①22 ②21·심9의 그런 변형 — 7-1-1), a ÷ b ÷ c 와 a ÷ (b ÷ c)(①38 심32 — 7-1-3), 지수가 문자인 −1의 거듭제곱(심25 — 7-1-2·7-1-3),
//    모퉁이를 잘라 접은 상자(심76 — 7-1-3), 분모에 문자가 있는 식의 값(①93 — 7-1-3).
//  - 범위 밖: 분모에 문자가 있는 식으로 나누거나 곱하기(①34·36·43의 그런 변형 ①44 ②36·70 ②76·심5·심64의 그런 변형), 몫이 다항식이 아닌 나눗셈(①84 ②71 ①81의 변형 심66·69),
//    괄호 안에 1/x 이 있는 분배(①74), (다항식) ÷ (다항식)과 등식의 변형(①85 ②84 심56·57·58), 길을 낸 땅((다항식) × (다항식)이 되는 꼴, ①90 ②80의 변형 심74).
//  - 도형: 조건이 글로 다 주어지는 도형을 실었다(평행사변형은 ②46 의 넓이 하나. 뿔·구·회전체·삼각기둥은 8-1-2c.js 끝에 다시 실었다 — 부피의 공식은 중1에서 배웠다).
//    마름모·사다리꼴(②81 심71)은 직사각형·삼각형·원기둥으로 바꾸어 실었다. 그림을 알 수 없는 꼴(①53 ①70·89의 한 문항씩 ②62·63 심53·55·75)과 전개도에서 마주 보는 면 찾기(②62)는 뺐다.
//  - 뜻 없는 셈·같은 일: 계수와 지수를 더하고 곱하기(①16·33·72·76 ②78 심29·43·45·60·61의 꼬리 — 값을 따로 받으면 식을 답하는 유형과 같은 일), 식과 결과 잇기(②37),
//    계산기로 하는 활동(②30), 한 번 더 꼬거나 수만 키운 것(①14·19·57·58·65·73 ②15·53·68·69·82 심38·40·51의 그런 변형).
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, NAMES, box, frac, lines, table, N, M, C, inline } = B.kit;
  const { LAB, MINUS, range, gcd, lcm, Q, qadd, qsub, qmul, qdiv, qneg, qabs, qpow, qcmp, isInt, fl, mag, tx, nb, tail, lastOf, tj, js, V, sup, fit, tag, proc, flow, nz, pm, co, okKind, ansV, asQ, poly, monoAns, polyAns } = B.kit.mid;
  const STD1 = '9수02-08', STD2 = '9수02-09', STD3 = '9수02-10', UNIT = '8-1-2';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});

  // ── 식 글 ──
  // 문자가 든 식을 한 줄 글로 적고(식 글), 그 글 하나에서 화면 글·값(다항식)·풀이의 계산 줄·검사 식을 얻는다.
  //  수 12 / 문자 a(π 도 문자로 친다) / 덧셈 + 뺄셈 - / 곱셈 기호 * (×) / 나눗셈 기호 : (÷) / 기호를 생략한 곱 2a · ab · 3(x+1) / 거듭제곱 a^2 / 분수 [분자|분모]
  //  괄호 ( ) · 중괄호 { } · 대괄호 < >. 빈칸은 ?(빈 네모)이거나 ㉠ ㉡ ㉢(이름표 네모)이고, 지수 자리에는 수·문자(x^a)·빈칸(x^?)이 온다.
  //  기호를 생략한 곱은 × ÷ 보다 먼저 묶인다: 6a^2:[2|3]ab 는 6a² ÷ ((2/3)ab).
  const OPEN = { '(': ')', '{': '}', '<': '>' }, SHOWN = { '(': ['(', ')'], '{': ['{', '}'], '<': ['[', ']'] };
  const isBoxCh = (ch) => ch === '?' || (ch >= '㉠' && ch <= '㉯');
  function parse(src) {
    const s = String(src).replace(/\s+/g, ''); let i = 0;
    const fail = (why) => { throw new Error(`식 글 「${src}」: ${why}(${i}번째)`); };
    const eat = (ch) => { if (s[i] !== ch) fail(ch + ' 가 와야 한다'); i += 1; };
    function sum() { let a = term(); while (s[i] === '+' || s[i] === '-') { const op = s[i]; i += 1; a = { t: op === '+' ? 'add' : 'sub', a, b: term() }; } return a; }
    function term() { let a = neg(); while (s[i] === '*' || s[i] === ':') { const op = s[i]; i += 1; a = { t: op === '*' ? 'mul' : 'div', a, b: neg() }; } return a; }
    function neg() { if (s[i] === '-') { i += 1; return { t: 'neg', a: neg() }; } return jux(); }
    function jux() { const list = [pow()]; while (i < s.length && (/[a-zA-Zπ({<[]/.test(s[i]) || isBoxCh(s[i]))) list.push(pow()); return list.length === 1 ? list[0] : { t: 'jux', list }; }
    function pow() {
      const a = atom(); if (s[i] !== '^') return a; i += 1;
      const m = /^\d+/.exec(s.slice(i)); if (m) { i += m[0].length; return { t: 'pow', a, n: Number(m[0]) }; }
      if (/[a-zA-Z]/.test(s[i] || '') || isBoxCh(s[i])) { i += 1; return { t: 'pow', a, n: null, mark: s[i - 1] }; }
      return fail('지수가 없다');
    }
    function atom() {
      const ch = s[i] || '';
      if (/\d/.test(ch)) { const m = /^\d+/.exec(s.slice(i)); i += m[0].length; return { t: 'num', s: m[0] }; }
      if (/[a-zA-Zπ]/.test(ch)) { i += 1; return { t: 'var', name: ch }; }
      if (isBoxCh(ch)) { i += 1; return { t: 'box', label: ch === '?' ? '' : ch }; }
      if (OPEN[ch]) { i += 1; const a = sum(); eat(OPEN[ch]); return { t: 'par', a, br: ch }; }
      if (ch === '[') { i += 1; const a = sum(); eat('|'); const b = sum(); eat(']'); return { t: 'frac', a, b }; }
      return fail('읽지 못하는 글자');
    }
    const out = sum(); if (i !== s.length) fail('식이 끝나지 않았다'); return out;
  }
  const X = (src) => (typeof src === 'string' ? parse(src) : src);

  // ── 다항식(문자의 지수가 음수인 항까지) ──
  // 다항식은 항의 배열이고, 항은 { q 계수(유리수), e { 문자: 지수 }, cn·cd 계수를 문제의 수로 셈하는 식(분자·분모), es { 문자: 지수를 셈하는 식 } }이다.
  // cn·cd·es 는 검사가 따로 셈하는 식(facts.calc)이 된다: 수는 식 글에 적힌 수 그대로이고(생략된 1만 덧붙는다), 나눗셈은 맨 끝에 한 번만 한다.
  const keyOf = (e) => Object.keys(e).filter((k) => e[k] !== 0).sort().map((k) => k + ':' + e[k]).join(',');
  const wrapS = (s) => (/^\d+$/.test(s) ? s : '(' + s + ')');
  const mulS = (a, b) => (a === '1' ? b : b === '1' ? a : wrapS(a) + '*' + wrapS(b));
  const joinS = (a, b) => (b.startsWith('-') ? a + b : a + '+' + b);
  const term1 = (q, e, es, cn, cd) => ({ q, e, es, cn, cd });
  const numT = (q) => term1(q, {}, {}, q.p < 0 ? '-' + -q.p : String(q.p), String(q.q));
  // 계수와 지수만으로 만든 항(틀린 보기를 지을 때 쓴다)
  const mk = (c, e) => { const q = asQ(c); return q.p === 0 ? [] : [term1(q, Object.assign({}, e), {}, '', '')]; };
  function tMul(a, b) {
    const e = {}, es = {};
    for (const k of new Set(Object.keys(a.e).concat(Object.keys(b.e)))) { e[k] = (a.e[k] || 0) + (b.e[k] || 0); es[k] = a.es[k] && b.es[k] ? joinS(a.es[k], b.es[k]) : a.es[k] || b.es[k]; }
    return term1(qmul(a.q, b.q), e, es, mulS(a.cn, b.cn), mulS(a.cd, b.cd));
  }
  function tDiv(a, b) {
    const e = {}, es = {};
    for (const k of new Set(Object.keys(a.e).concat(Object.keys(b.e)))) { e[k] = (a.e[k] || 0) - (b.e[k] || 0); es[k] = b.es[k] ? (a.es[k] || '') + '-' + wrapS(b.es[k]) : a.es[k]; }
    return term1(qdiv(a.q, b.q), e, es, mulS(a.cn, b.cd), mulS(a.cd, b.cn));
  }
  function tPow(a, n) {
    const e = {}, es = {};
    for (const k of Object.keys(a.e)) { e[k] = a.e[k] * n; es[k] = a.es[k] === '1' ? String(n) : wrapS(a.es[k]) + '*' + n; }
    return term1(qpow(a.q, n), e, es, a.cn === '1' ? '1' : wrapS(a.cn) + '**' + n, a.cd === '1' ? '1' : wrapS(a.cd) + '**' + n);
  }
  const tNeg = (a) => term1(qneg(a.q), a.e, a.es, '-' + wrapS(a.cn), a.cd);
  function pAdd(a, b) {
    const out = a.slice();
    for (const t of b) {
      const k = keyOf(t.e), at = out.findIndex((u) => keyOf(u.e) === k);
      if (at < 0) { out.push(t); continue; }
      const u = out[at], q = qadd(u.q, t.q);
      if (q.p === 0) out.splice(at, 1);
      else out[at] = u.cd === t.cd ? term1(q, u.e, u.es, joinS(u.cn, t.cn), u.cd) : term1(q, u.e, u.es, joinS(mulS(u.cn, t.cd), mulS(t.cn, u.cd)), mulS(u.cd, t.cd));
    }
    return out;
  }
  const pNeg = (a) => a.map(tNeg);
  const pMul = (a, b) => a.reduce((sum, x) => pAdd(sum, b.map((y) => tMul(x, y))), []);
  function pDiv(a, b) { if (b.length !== 1) throw new Error('단항식이 아닌 식으로 나눌 수 없다'); return a.reduce((sum, x) => pAdd(sum, [tDiv(x, b[0])]), []); }
  function pPow(a, n) { if (a.length === 0) return []; if (a.length !== 1) throw new Error('항이 여럿인 식의 거듭제곱은 다루지 않는다'); return [tPow(a[0], n)]; }
  const same = (a, b) => a.length === b.length && a.every((t) => { const u = b.find((v) => keyOf(v.e) === keyOf(t.e)); return Boolean(u) && qcmp(u.q, t.q) === 0; });
  // 값(다항식). env: { 문자: 수·유리수(대입할 값) 또는 다항식(대입할 식) }. env.sym 이면 수 2, 3, … 을 문자처럼 다루어 수의 거듭제곱 2⁴ × 2⁷ 의 지수를 셈한다.
  function valX(node, env) {
    const E = env || {}, n = X(node), v = (m) => valX(m, E);
    switch (n.t) {
      case 'num': { if (E.sym && Number(n.s) > 1) { const name = '#' + n.s; return [term1(Q(1), { [name]: 1 }, { [name]: '1' }, '1', '1')]; } const q = Q(Number(n.s)); return q.p === 0 ? [] : [numT(q)]; }
      case 'var': { const given = E[n.name]; if (given == null) return [term1(Q(1), { [n.name]: 1 }, { [n.name]: '1' }, '1', '1')]; if (Array.isArray(given)) return given; const q = asQ(given); return q.p === 0 ? [] : [numT(q)]; }
      case 'add': return pAdd(v(n.a), v(n.b));
      case 'sub': return pAdd(v(n.a), pNeg(v(n.b)));
      case 'mul': return pMul(v(n.a), v(n.b));
      case 'div': case 'frac': return pDiv(v(n.a), v(n.b));
      case 'neg': return pNeg(v(n.a));
      case 'par': return v(n.a);
      case 'pow': if (n.n == null) throw new Error('지수가 정해지지 않은 식이다'); return pPow(v(n.a), n.n);
      case 'val': return n.p;
      case 'box': throw new Error('빈칸이 있는 식이다');
      default: return n.list.reduce((acc, t) => pMul(acc, v(t)), [numT(Q(1))]);
    }
  }
  // 계수를 셈하는 식 글(검사용)
  const coefS = (t) => (t.cd === '1' ? t.cn : '(' + t.cn + ')/(' + t.cd + ')');
  // 항의 차례: 차수가 큰 것부터, 차수가 같으면 알파벳이 앞선 문자의 지수가 큰 것부터(x², xy, y², x, y, 상수항). π 는 계수처럼 다룬다.
  const letters = (t) => Object.keys(t.e).filter((k) => t.e[k] !== 0 && k !== 'π');
  const degOf = (t) => letters(t).reduce((s, k) => s + t.e[k], 0);
  function ordered(P) {
    const names = [...new Set(P.flatMap(letters))].sort();
    return P.slice().sort((a, b) => degOf(b) - degOf(a) || names.reduce((r, k) => r || (b.e[k] || 0) - (a.e[k] || 0), 0));
  }
  // 화면 글. 분수의 분자·분모가 여러 글자이면 보이지 않는 괄호를 넣는다(글로 옮기면 (3x)/(16y^3) 이 되어 (3/16)xy³ 과 가려진다).
  const hidden = (ch) => '<span class="mb-frac-bar">' + ch + '</span>';
  const fpart = (h) => (/^(\d+|<i class="mb-var">[a-zA-Z]<\/i>|π)$/.test(h) ? h : hidden('(') + h + hidden(')'));
  const vh = (name, k) => (name === 'π' ? 'π' : name[0] === '#' ? name.slice(1) : V(name)) + (k > 1 ? sup(k) : '');
  const byName = (a, b) => (a === 'π' ? -1 : b === 'π' ? 1 : a < b ? -1 : a > b ? 1 : 0);
  // 항의 크기 부분(부호를 뺀 글)
  function termH(t) {
    const names = Object.keys(t.e).filter((k) => t.e[k] !== 0).sort(byName);
    const up = names.filter((k) => t.e[k] > 0).map((k) => vh(k, t.e[k])).join(''), down = names.filter((k) => t.e[k] < 0).map((k) => vh(k, -t.e[k])).join('');
    const p = Math.abs(t.q.p), q = t.q.q;
    if (!down) return q === 1 ? (p === 1 && up ? up : p + up) : frac(p, q) + up;
    return frac(fpart((p === 1 && up ? '' : p) + up), fpart((q === 1 ? '' : q) + down));
  }
  // 다항식의 화면 글. inExpr: 식 글꼴(mb-expr) 안에 적을 때 연산 기호를 <i>로 감싼다.
  function ph(P, inExpr) {
    if (!P.length) return '0';
    const op = (sym) => (inExpr ? ` <i>${sym}</i> ` : ` ${sym} `);
    return ordered(P).map((t, i) => (i === 0 ? (t.q.p < 0 ? MINUS : '') : op(t.q.p < 0 ? MINUS : '+')) + termH(t)).join('');
  }
  const pt = (P) => nb(ph(P));
  function htmlX(node, inExpr) {
    const n = X(node), op = (sym) => (inExpr ? ` <i>${sym}</i> ` : ` ${sym} `), h = (m) => htmlX(m, inExpr);
    switch (n.t) {
      case 'num': return n.s;
      case 'var': return n.name === 'π' ? 'π' : V(n.name);
      case 'box': return box(n.label);
      case 'add': return h(n.a) + op('+') + h(n.b);
      case 'sub': return h(n.a) + op(MINUS) + h(n.b);
      case 'mul': return h(n.a) + op('×') + h(n.b);
      case 'div': return h(n.a) + op('÷') + h(n.b);
      case 'neg': return MINUS + h(n.a);
      case 'par': return SHOWN[n.br][0] + h(n.a) + SHOWN[n.br][1];
      case 'pow': return h(n.a) + sup(n.n != null ? n.n : isBoxCh(n.mark) ? box(n.mark === '?' ? '' : n.mark) : V(n.mark));
      case 'frac': return frac(fpart(htmlX(n.a)), fpart(htmlX(n.b)));
      case 'val': return n.wrap ? '(' + ph(n.p, inExpr) + ')' : ph(n.p, inExpr);
      default: return n.list.map(h).join('');
    }
  }
  // 식의 너비 어림(em): 식 글꼴의 글씨 크기를 휴대폰 너비에 맞추는 데 쓴다.
  function emX(node) {
    const n = X(node);
    switch (n.t) {
      case 'num': return 0.6 * n.s.length;
      case 'var': return 0.64;
      case 'box': return 1.4;
      case 'add': case 'sub': case 'mul': case 'div': return emX(n.a) + emX(n.b) + 1.62;
      case 'neg': return 0.8 + emX(n.a);
      case 'par': return 0.76 + emX(n.a);
      case 'pow': return emX(n.a) + (n.n != null ? 0.48 * String(n.n).length : isBoxCh(n.mark) ? 1.1 : 0.5);
      case 'frac': return Math.max(emX(n.a), emX(n.b)) + 0.7;
      case 'val': return 0.62 * ph(n.p).replace(/<span class="mb-frac-bar">.<\/span>/g, '').replace(/<[^>]+>/g, '').length + (n.wrap ? 0.76 : 0);
      default: return n.list.reduce((s, t) => s + emX(t), 0);
    }
  }
  const xh = (src) => nb(htmlX(src));                                       // 글줄 속의 식
  const xe = (src) => htmlX(src, true);                                     // 식 글꼴 안에 적는 글
  const xex = (src, extra) => '<span class="mb-expr"' + fit(emX(src) + (extra || 0)) + '>' + xe(src) + '</span>';   // 그림 자리에 크게 적는 식
  // 등호로 이은 식(그림 자리): eqx('a^?*a^4', 'a^12')
  const eqx = (...srcs) => '<span class="mb-expr"' + fit(srcs.reduce((s, x) => s + emX(x), 0) + 1.62 * (srcs.length - 1)) + '>' + srcs.map(xe).join(' <i>=</i> ') + '</span>';
  // 이름표(㉠㉡…)를 붙인 식 여러 줄. 줄은 식 글이거나 [왼쪽 식 글, 오른쪽 식 글](등식)이다.
  const rowEm = (r) => (Array.isArray(r) ? r.reduce((s, x) => s + emX(x), 0) + 1.62 * (r.length - 1) : emX(r));
  const rowH = (r) => (Array.isArray(r) ? r.map(xe).join(' <i>=</i> ') : xe(r));
  const xtagged = (rows, tags) => { const style = fit(Math.max(...rows.map(rowEm)) + 2.6); return lines(rows.map((r, i) => tag((tags || LAB)[i]) + '<span class="mb-expr"' + (style || ' style="font-size:1.2rem"') + '>' + rowH(r) + '</span>')); };
  // 이름을 붙인 식 여러 줄: A = …, B = … (글씨 크기는 가장 긴 줄에 맞춘다)
  const named = (rows) => { const style = fit(Math.max(...rows.map(([, src]) => emX(src))) + 2.4); return lines(rows.map(([name, src]) => '<span class="mb-expr"' + (style || ' style="font-size:1.2rem"') + '>' + V(name) + ' <i>=</i> ' + xe(src) + '</span>')); };
  const xv = (src, env) => valX(src, env);
  const xsame = (a, b, env) => same(valX(a, env), valX(b, env));

  // ── 식 글을 짓는 도구 ──
  const magS = (q) => (q.q === 1 ? String(Math.abs(q.p)) : `[${Math.abs(q.p)}|${q.q}]`);
  // 문자 부분: vs([['x', 2], ['y', 1]]) → x^2y
  const vs = (vars) => vars.filter(([, e]) => e > 0).map(([v, e]) => v + (e > 1 ? '^' + e : '')).join('');
  // 단항식: ms(-3, [['a', 2], ['b', 3]]) → -3a^2b^3, ms(Q(2, 3), [['x', 1]]) → [2|3]x, ms(1, …) → 문자만
  const ms = (c, vars) => { const q = asQ(c), v = vs(vars || []); return (q.p < 0 ? '-' : '') + (v && Math.abs(q.p) === 1 && q.q === 1 ? '' : magS(q)) + v; };
  // 곱셈·나눗셈 기호 옆에 적는 식: 음수이면 괄호에 넣는다
  const pa = (src) => (src.startsWith('-') ? '(' + src + ')' : src);
  // 다항식: pn([[3, 'x^2'], [-2, 'xy'], [5, '']]) → 3x^2-2xy+5 (계수 1은 적지 않고 0인 항은 뺀다)
  function pn(terms) {
    const live = terms.map(([c, v]) => [asQ(c), v]).filter(([c]) => c.p !== 0);
    if (!live.length) return '0';
    return live.map(([c, v], i) => (c.p < 0 ? '-' : i ? '+' : '') + (v && Math.abs(c.p) === 1 && c.q === 1 ? '' : magS(c)) + v).join('');
  }
  // 수를 곱한 괄호: kp(3, '2x-7y') → 3(2x-7y), kp(-1, …) → -(…), kp(1, …) → (…)
  const kp = (k, inner) => { const q = asQ(k); return (q.p < 0 ? '-' : '') + (Math.abs(q.p) === 1 && q.q === 1 ? '' : magS(q)) + '(' + inner + ')'; };
  // 다항식의 식 글(셈한 다항식을 다시 식 글로)
  const srcOf = (P) => pn(ordered(P).map((t) => [t.q, vs(Object.keys(t.e).filter((k) => t.e[k] !== 0).sort(byName).map((k) => [k, t.e[k]]))]));

  // ── 풀이의 계산 줄 ──
  // 식 글을 교과서의 차례로 줄여 가며 등호로 잇는다: 괄호·분수의 거듭제곱 → 안쪽 괄호 → (덧셈·뺄셈이면 괄호를 푼 줄) → 답.
  const asVal = (P) => ({ t: 'val', p: P, wrap: P.length > 1 || (P.length === 1 && P[0].q.p < 0) });
  function mapNode(n, f) {
    const hit = f(n); if (hit) return hit;
    if (n.list) return Object.assign({}, n, { list: n.list.map((m) => mapNode(m, f)) });
    const out = Object.assign({}, n);
    if (n.a) out.a = mapNode(n.a, f);
    if (n.b) out.b = mapNode(n.b, f);
    return out;
  }
  const some = (n, f) => f(n) || (n.list ? n.list.some((m) => some(m, f)) : Boolean((n.a && some(n.a, f)) || (n.b && some(n.b, f))));
  const hasPar = (n) => some(n, (m) => m.t === 'par');
  const isSum = (n) => n.t === 'add' || n.t === 'sub';
  // 맨 앞에 놓인 값은 음수여도 괄호에 넣지 않는다.
  function bare(n) {
    if (n.t === 'val') return n.p.length === 1 ? Object.assign({}, n, { wrap: false }) : n;
    if (['add', 'sub', 'mul', 'div'].includes(n.t)) return Object.assign({}, n, { a: bare(n.a) });
    if (n.t === 'jux') return Object.assign({}, n, { list: [bare(n.list[0])].concat(n.list.slice(1)) });
    return n;
  }
  // 덧셈·뺄셈으로 이어진 항마다 따로 셈하여 동류항을 모으기 전의 줄을 적는다.
  function spread(n, env) {
    const flat = (m, sign) => (m.t === 'add' ? flat(m.a, sign).concat(flat(m.b, sign)) : m.t === 'sub' ? flat(m.a, sign).concat(flat(m.b, -sign)) : [[m, sign]]);
    const terms = flat(n, 1).flatMap(([m, sign]) => ordered(valX(m, env)).map((t) => (sign < 0 ? tNeg(t) : t)));
    return terms.length ? terms.map((t, i) => (i === 0 ? (t.q.p < 0 ? MINUS : '') : t.q.p < 0 ? ` ${MINUS} ` : ' + ') + termH(t)).join('') : '0';
  }
  function steps(src, env) {
    let cur = X(src); const rows = [htmlX(cur)];
    const push = (n) => { const h = htmlX(bare(n)); if (h !== rows[rows.length - 1]) rows.push(h); cur = n; };
    // 괄호·분수의 거듭제곱
    push(mapNode(cur, (n) => (n.t === 'pow' && n.n != null && (n.a.t === 'par' || n.a.t === 'frac') ? asVal(valX(n, env)) : null)));
    // 안쪽 괄호부터: 곱셈·나눗셈만 든 괄호는 값으로, 괄호를 품은 괄호는 안을 정리한 괄호로
    for (let turn = 0; turn < 6; turn += 1) {
      if (!some(cur, (n) => n.t === 'par' && (hasPar(n.a) || !isSum(n.a)))) break;
      const next = mapNode(cur, (n) => {
        if (n.t !== 'par') return null;
        if (some(n.a, (m) => m.t === 'par' && (hasPar(m.a) || !isSum(m.a)))) return null;   // 더 안쪽에 줄일 괄호가 있다
        if (hasPar(n.a)) { const P = valX(n.a, env); return P.length > 1 ? { t: 'par', br: '(', a: { t: 'val', p: P, wrap: false } } : asVal(P); }
        if (!isSum(n.a)) return asVal(valX(n.a, env));
        return null;
      });
      push(next);
    }
    if (isSum(cur) || some(cur, (n) => n.t === 'par')) { const h = spread(cur, env); if (h !== rows[rows.length - 1]) rows.push(h); }
    const last = ph(valX(src, env)); if (last !== rows[rows.length - 1]) rows.push(last);
    return rows;
  }
  const told = (src, env) => steps(src, env).join(' = ');

  // ── 문항 도구 ──
  const SIMP = '다음 식을 간단히 하시오.', CALC = '다음을 계산하시오.', SIMP_PICK = '다음 식을 간단히 한 것은?', CALC_PICK = '다음을 계산한 것은?';
  const UNSEEN = [1];
  const single = (P, vars) => P.length === 1 && isInt(P[0].q) && keyOf(P[0].e) === keyOf(Object.fromEntries(vars.map((v) => [v, P[0].e[v] || 0]))) && vars.every((v) => P[0].e[v] >= 1);
  // 식 글의 값이 주어진 문자를 모두 가진 단항식(정수 계수)인가
  const monoOK = (src, vars, env) => { try { return single(valX(src, env), vars); } catch (_) { return false; } };
  const nameH = (v) => (v[0] === '#' ? v.slice(1) : V(v));
  // 답이 단항식인 문항: 「[±][ ]x^[ ]y^[ ]」. o: { figure, explain, rule, env }. 주지 않으면 그림 자리에 식을, 풀이에 계산 줄을 적는다.
  function monoQ(text, src, vars, o) {
    const opt = o || {}, P = valX(src, opt.env);
    if (!single(P, vars)) throw new Error('답이 주어진 문자를 모두 가진 단항식이 아니다: ' + src);
    const t = P[0];
    // 공용 도구 monoAns 가 적는 답 글(shown)은 음수 계수의 −를 잃으므로 여기서 다시 적는다.
    return Object.assign(monoAns(text, t.q.p, vars.map((v) => [v, t.e[v]]), {
      figure: opt.figure === undefined ? xex(src) : opt.figure, explain: opt.explain || told(src, opt.env) + '이다.',
      facts: Object.assign({ calc: [[coefS(t), 0]].concat(vars.map((v, i) => [t.es[v], i + 1])), unseen: UNSEEN.concat(opt.unseen || []) }, opt.rule ? { rule: opt.rule } : {})
    }), { shown: pt(P) });
  }
  // 답이 계수가 1인 거듭제곱(의 곱)인 문항: 지수 칸만 둔다 — 「x^[ ]y^[ ]」. vars 의 '#2' 는 수 2(수의 거듭제곱).
  const powOK = (src, vars, env) => { try { const P = valX(src, env); return single(P, vars) && P[0].q.p === 1 && vars.every((v) => P[0].e[v] >= 2); } catch (_) { return false; } };
  function powQ(text, src, vars, o) {
    const opt = o || {}, env = Object.assign({ sym: vars.some((v) => v[0] === '#') }, opt.env), P = valX(src, env);
    if (!single(P, vars) || P[0].q.p !== 1) throw new Error('답이 거듭제곱의 곱이 아니다: ' + src);
    const t = P[0];
    return inline(text, vars.map((v, i) => nameH(v) + '<sup>{' + i + '}</sup>').join(''), vars.map((v) => ({ answer: t.e[v] })), {
      shown: vars.map((v) => vh(v, t.e[v])).join(''), figure: opt.figure === undefined ? xex(src) : opt.figure, explain: opt.explain || told(src, env) + '이다.',
      facts: Object.assign({ calc: vars.map((v, i) => [t.es[v], i]), unseen: UNSEEN }, opt.rule ? { rule: opt.rule } : {})
    });
  }
  // 답이 다항식인 문항: 항마다 「[±][ ]문자」. parts 는 답의 항의 문자 부분(식 글: 'x^2', 'xy', 상수항은 '')을 적는 차례대로.
  const partKey = (part) => (part ? keyOf(valX(part)[0].e) : '');
  const polyOK = (src, parts, env) => { try { const P = valX(src, env); return P.length === parts.length && parts.every((part) => P.some((t) => keyOf(t.e) === partKey(part) && isInt(t.q))); } catch (_) { return false; } };
  function polyQ(text, src, parts, o) {
    const opt = o || {}, P = valX(src, opt.env);
    if (!polyOK(src, parts, opt.env)) throw new Error('답의 항이 정한 것과 다르다: ' + src);
    // 칸의 차례는 풀이에 적히는 차례(차수가 큰 항부터)와 같아야 한다.
    if (ordered(P).map((t) => keyOf(t.e)).join('|') !== parts.map(partKey).join('|')) throw new Error('답의 항을 적는 차례가 풀이와 다르다: ' + src);
    const terms = parts.map((part) => P.find((t) => keyOf(t.e) === partKey(part))), list = terms.map((t, i) => [t.q.p, parts[i] ? htmlX(parts[i]) : '']);
    const more = {
      figure: opt.figure === undefined ? xex(src) : opt.figure, explain: opt.explain || told(src, opt.env) + '이다.',
      facts: Object.assign({ calc: terms.map((t, i) => [coefS(t), i]), unseen: UNSEEN.concat(opt.unseen || []) }, opt.rule ? { rule: opt.rule } : {})
    };
    if (!opt.unit) return polyAns(text, list, more);
    // 단위가 있는 답: 식 뒤에 단위를 괄호에 넣어 적는다 — 「[±][ ]x [±][ ]y (원)」
    return inline(text, list.map(([, name], i) => '{' + i + '}' + name).join(' ') + ' (' + opt.unit + ')', list.map(([k]) => ({ answer: k, signed: true })), Object.assign(more, { shown: poly(list) + ' (' + opt.unit + ')' }));
  }
  // 식을 고르는 문항. right: 정답(식 글이나 다항식), wrongs: 틀린 것의 후보(식 글·다항식·{ h 화면 글 }) — 저마다 아이들이 하는 잘못 하나로 만든 식이다.
  //  값이 정답과 같아지거나 서로 같아진 후보는 버리고 셋을 뽑는다. o: { figure, explain, rule, env, keep(정답 식 글을 셈하지 않고 그대로 보인다) }
  const asP = (x, env) => (Array.isArray(x) ? x : valX(x, env));
  function pickQ(d, text, right, wrongs, o) {
    const opt = o || {}, R = asP(right, opt.env), kept = [];
    for (const w of d.shuffle(wrongs)) {
      if (kept.length === 3) break;
      if (w && w.h) { if (!kept.some((k) => k.h === w.h)) kept.push(w); continue; }
      let W; try { W = asP(w, opt.env); } catch (_) { continue; }
      if (same(W, R) || kept.some((k) => k.P && same(k.P, W))) continue;
      kept.push({ P: W });
    }
    if (kept.length < 3) throw new Error('틀린 보기가 모자라다');
    const rows = d.shuffle([{ P: R, right: true }].concat(kept));
    return C(text, rows.map((r) => (r.h ? r.h : pt(r.P))), rows.findIndex((r) => r.right), {
      figure: opt.figure, explain: opt.explain, facts: Object.assign({ truth: rows.map((r) => Boolean(r.right)), want: true }, opt.rule ? { rule: opt.rule } : {})
    });
  }
  // 등식 「왼쪽 = 오른쪽」 넷에서 옳은 것(옳지 않은 것) 하나 고르기. pool 의 줄은 [왼쪽 식 글, 잘못 쓴 오른쪽(식 글이나 다항식), 까닭].
  //  옳은 것을 물으면 하나만 바르게, 옳지 않은 것을 물으면 하나만 잘못 적는다. 바른 오른쪽과 참·거짓은 코드가 셈한다.
  function eqQ(d, text, pool, wantTrue, o) {
    const opt = o || {}, picked = d.shuffle(pool).slice(0, 4), at = d.int(0, 3);
    const rows = picked.map((e, i) => { const good = valX(e[0], opt.env), bad = asP(e[1], opt.env), wrong = (i === at) !== wantTrue; if (same(good, bad)) throw new Error('잘못 쓴 식이 바른 식과 같다: ' + e[0]); return { l: e[0], good, shown: wrong ? bad : good, ok: !wrong, why: e[2] || '' }; });
    const line = (r, P) => htmlX(r.l) + ' = ' + ph(P);
    return C(text, rows.map((r) => line(r, r.shown)), at, {
      explain: wantTrue ? '나머지를 바르게 고치면 ' + rows.filter((r, i) => i !== at).map((r) => line(r, r.good)).join(', ') + '이다.' : `${rows[at].why ? rows[at].why + ' ' : ''}바르게 고치면 ${line(rows[at], rows[at].good)}이다.`,
      facts: Object.assign({ truth: rows.map((r) => r.ok), want: wantTrue }, opt.rule ? { rule: opt.rule } : {})
    });
  }
  // 식 뒤의 토씨: 끝이 거듭제곱이면 「제곱」, 문자이면 그 문자(엘·엠·엔·알만 받침이 있다), 수이면 그 수를 읽는 소리에 맞춘다. 분수 꼴은 분자를 나중에 읽는다.
  function ej(h, pair) {
    const [w, wo] = pair.split('/'), s = String(h).replace(/(<\/span>)+$/, ''), at = s.lastIndexOf('<span class="mb-frac">');
    if (at >= 0) {
      const t = s.slice(at).replace(/<span class="mb-frac-bar">[()]<\/span>/g, ''), cut = t.indexOf('</span><span class="mb-frac-bar">/');
      if (!t.includes('</span></span>')) { const top = t.slice('<span class="mb-frac"><span>'.length, cut); return h + ej(top, pair).slice(top.length); }
    }
    if (/<\/sup>$/.test(s)) return h + w;
    const text = s.replace(/<[^>]+>/g, '').replace(/[)}\]]+$/, ''), last = text[text.length - 1];
    if (/\d/.test(last)) return h + tail(Number(/\d+$/.exec(text)[0]), pair);
    return h + ('lmnr'.includes(last) ? (w === '으로' && last === 'l' ? '로' : w) : wo);
  }
  const xj = (src, pair) => ej(xh(src), pair), pj = (P, pair) => ej(pt(P), pair);
  // 다항식의 문자에 수를 넣은 글(풀이): 2xy 에 x = 3, y = −2 → 2 × 3 × (−2). 음수와 분수는 괄호에 넣는다.
  function plugH(P, env) {
    const valH = (q, k) => (q.p < 0 || q.q !== 1 ? '(' + tx(q) + ')' : tx(q)) + (k > 1 ? sup(k) : '');
    return ordered(P).map((t, i) => {
      const fs = letters(t).sort().map((k) => valH(asQ(env[k]), t.e[k])), c = qabs(t.q), head = c.p === 1 && c.q === 1 && fs.length ? [] : [tx(c)];
      return (i === 0 ? (t.q.p < 0 ? MINUS : '') : t.q.p < 0 ? ` ${MINUS} ` : ' + ') + head.concat(fs).join(' × ');
    }).join('');
  }
  // 문자의 값을 적은 글: x = 3, y = −2
  const given = (env) => Object.keys(env).map((k) => nb(`${V(k)} = ${tx(asQ(env[k]))}`)).join(', ');
  // 수 답 여러 칸(㉠, ㉡, …이나 문자 이름). rows: [이름표, 답, 검사 식, 부호 단추를 붙이는가]
  const slots = (text, rows, o) => M(text, rows.map(([label, answer, , signed]) => Object.assign({ label, answer }, signed ? { signed: true } : {})), {
    figure: o.figure, explain: o.explain, facts: Object.assign({ calc: rows.map(([, , expr], i) => [expr, i]) }, o.unseen ? { unseen: o.unseen } : {}, o.rule ? { rule: o.rule } : {})
  });
  // 문자 이름표: 「a =」
  const eqLabel = (v) => V(v) + ' =';
  // 0이 아닌 정수 여럿, 문자 짝
  const coefs = (d, n, lo, hi) => Array.from({ length: n }, () => nz(d, lo, hi));
  const PAIRS = [['x', 'y'], ['a', 'b']];
  const pair = (d) => d.pick(PAIRS);
  const one = (d) => d.pick(['a', 'x', 'b', 'y']);
  const sjs = (k) => js(asQ(k));


  // ── 그림 ──
  const INK = '#1f2933', TINT = 'rgba(37,99,235,0.14)', SVG_ITALIC = "font-style:italic;font-family:'MB Math','Times New Roman',serif;font-size:1.1em";
  // 그림 속 글(식 글): 문자는 수식 글꼴의 기울인 글자로, 지수는 위로 올린 작은 글자로 적는다(뒤의 글자는 제자리로 내린다).
  function svgX(node) {
    const n = X(node), up = (e) => `<tspan dy="-5" style="font-size:0.72em">${e}</tspan><tspan dy="5">​</tspan>`;
    switch (n.t) {
      case 'num': return n.s;
      case 'var': return n.name === 'π' ? 'π' : `<tspan style="${SVG_ITALIC}">${n.name}</tspan>`;
      case 'add': return svgX(n.a) + ' + ' + svgX(n.b);
      case 'sub': return svgX(n.a) + ' ' + MINUS + ' ' + svgX(n.b);
      case 'neg': return MINUS + svgX(n.a);
      case 'par': return '(' + svgX(n.a) + ')';
      case 'pow': return svgX(n.a) + up(n.n);
      case 'jux': return n.list.map(svgX).join('');
      default: throw new Error('그림 속 글로 적을 수 없는 식이다');
    }
  }
  // 그림 설명에 적는 글: 4xy^2, 3a − 2b
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
  const label = (x, y, src, anchor) => `<text x="${x}" y="${y}" text-anchor="${anchor || 'middle'}" style="font-size:13.5px;font-weight:600;fill:${INK}">${svgX(src)}</text>`;
  const word = (x, y, text, anchor) => `<text x="${x}" y="${y}" text-anchor="${anchor || 'middle'}" style="font-size:13px;font-weight:600;fill:${INK}">${text}</text>`;
  const shapeD = (dd, fill) => `<path d="${dd}" style="fill:${fill || '#fff'};stroke:${INK};stroke-width:1.4;stroke-linejoin:round"/>`;
  const dash = (dd) => `<path d="${dd}" style="fill:none;stroke:${INK};stroke-width:1;stroke-dasharray:4 3"/>`;
  const thin = (dd) => `<path d="${dd}" style="fill:none;stroke:${INK};stroke-width:1"/>`;
  // 직사각형: 가로의 길이는 아래에, 세로의 길이는 오른쪽에 적는다(세로를 주지 않으면 적지 않는다). area: 안에 적는 넓이
  const rectFig = (W, L, area) => svg(L ? 266 : 166, 114, `직사각형: 가로의 길이 ${plainX(W)}${L ? `, 세로의 길이 ${plainX(L)}` : ''}${area ? `, 넓이 ${plainX(area)}` : ''}`,
    shapeD('M12 8h140v78h-140z', TINT) + label(82, 105, W) + (L ? label(160, 52, L, 'start') : '') + (area ? `<text x="82" y="52" text-anchor="middle" style="font-size:12.5px;font-weight:600;fill:${INK}">넓이 ${svgX(area)}</text>` : ''));
  // 삼각형: 밑변의 길이는 아래에, 높이(점선)는 점선 오른쪽에 적는다(높이를 주지 않으면 점선만 긋는다).
  const triFig = (base, height) => svg(214, 124, `삼각형: 밑변의 길이 ${plainX(base)}${height ? `, 높이 ${plainX(height)}` : ', 꼭짓점에서 밑변에 그은 높이를 점선으로 나타냈다'}`,
    shapeD('M14 98L200 98L66 12z', TINT) + dash('M66 12v86') + thin('M66 90h8v8') + label(107, 117, base) + (height ? label(73, 64, height, 'start') : ''));
  // 평행사변형: 밑변의 길이는 아래에, 높이(점선)는 점선 오른쪽에 적는다.
  const paraFig = (base, height) => svg(246, 124, `평행사변형: 밑변의 길이 ${plainX(base)}, 높이 ${plainX(height)}`,
    shapeD('M14 98h160l58 -84h-160z', TINT) + dash('M72 14v84') + thin('M72 90h8v8') + label(94, 117, base) + label(79, 62, height, 'start'));
  // 이등변삼각형: 밑변의 길이는 아래에, 길이가 같은 두 변의 길이는 양옆에 적는다.
  const isoFig = (base, side) => svg(284, 130, `이등변삼각형: 밑변의 길이 ${plainX(base)}, 나머지 두 변의 길이는 모두 ${plainX(side)}`,
    shapeD('M72 104h140l-70 -92z', TINT) + label(142, 123, base) + label(98, 56, side, 'end') + label(186, 56, side, 'start'));
  // 직육면체: 밑면의 가로(앞 아래 모서리)·세로(오른쪽 아래 모서리)와 높이(오른쪽 모서리, 주지 않으면 적지 않는다)
  const boxFig = (W, L, H) => svg(280, 140, `직육면체: 밑면의 가로의 길이 ${plainX(W)}, 세로의 길이 ${plainX(L)}${H ? `, 높이 ${plainX(H)}` : ''}`,
    shapeD('M14 44h124v70h-124z', TINT) + shapeD('M14 44l40 -30h124l-40 30z', 'rgba(37,99,235,0.07)') + shapeD('M138 44l40 -30v70l-40 30z', 'rgba(37,99,235,0.22)')
    + label(76, 132, W) + label(166, 108, L, 'start') + (H ? label(184, 54, H, 'start') : ''));
  // 원기둥: 밑면의 반지름(윗면에 긋는다)과 높이(주지 않으면 적지 않는다)
  const cylFig = (R, H) => svg(250, 162, `원기둥: 밑면의 반지름의 길이 ${plainX(R)}${H ? `, 높이 ${plainX(H)}` : ''}`,
    shapeD('M20 46v84a58 16 0 0 0 116 0v-84', TINT) + `<ellipse cx="78" cy="46" rx="58" ry="16" style="fill:rgba(37,99,235,0.07);stroke:${INK};stroke-width:1.4"/>` + thin('M78 46h58') + `<circle cx="78" cy="46" r="2.2" style="fill:${INK}"/>`
    + thin('M107 44v-17') + label(107, 21, R) + (H ? label(144, 94, H, 'start') : ''));
  // 큰 직사각형의 왼쪽 아래 모퉁이에서 작은 직사각형을 잘라 낸 그림. big·small: [가로 식 글, 세로 식 글]
  const cornerFig = (big, small) => svg(288, 150, `큰 직사각형의 왼쪽 아래 모퉁이에서 작은 직사각형을 잘라 내고 남은 부분을 색칠한 그림: 큰 직사각형은 가로 ${plainX(big[0])}, 세로 ${plainX(big[1])}이고, 잘라 낸 직사각형은 가로 ${plainX(small[0])}, 세로 ${plainX(small[1])}`,
    shapeD('M70 24h150v96h-66v-50h-84z', TINT) + dash('M70 70v50h84') + label(145, 16, big[0]) + label(227, 76, big[1], 'start') + label(112, 137, small[0]) + label(64, 100, small[1], 'end'));

  // ── 지수법칙 ──
  // 지수의 셈을 드러낸 거듭제곱: pe('x', '4 + 7') → x^(4 + 7)
  const pe = (v, expr) => nb(nameH(v) + sup(expr));
  const RULE_MUL = '밑이 같은 거듭제곱의 곱은 지수끼리 더한다.', RULE_POW = '거듭제곱의 거듭제곱은 지수끼리 곱한다.', RULE_DIV = '밑이 같은 거듭제곱의 나눗셈은 지수끼리 뺀다.';
  const nth = (k) => (k === 2 ? '제곱' : k === 3 ? '세제곱' : k + '제곱');
  const lawTypes = [
    T('law-mul', '밑이 같은 거듭제곱의 곱', '①1 ②1', (d, n) => {
      const v = one(d);
      if (n === 0) {
        const [p, q] = d.until(() => [d.int(2, 8), d.int(2, 8)], ([a, b]) => a !== b), src = `${v}^${p}*${v}^${q}`;
        return powQ(SIMP, src, [v], { rule: 'law-mul-two', explain: `${RULE_MUL} ${xh(src)} = ${pe(v, `${p} + ${q}`)} = ${pe(v, p + q)}이다.` });
      }
      // 지수가 적히지 않은 문자가 낀 곱: x = x¹
      const es = d.shuffle([d.int(2, 4), d.int(5, 7), d.int(2, 6)]), at = d.int(1, 3); es.splice(at, 0, 1);
      const src = es.map((e) => v + (e > 1 ? '^' + e : '')).join('*'), sum = es.reduce((s, e) => s + e, 0);
      return powQ(SIMP, src, [v], { rule: 'law-mul-bare', explain: `${V(v)} = ${pe(v, 1)}이다. ${RULE_MUL} ${xh(src)} = ${pe(v, es.join(' + '))} = ${pe(v, sum)}이다.` });
    }, { count: 2 }),
    T('law-mul-two', '밑이 둘 섞인 거듭제곱의 곱', '①1 ②2', (d) => {
      const [a, b] = pair(d), ea = [d.int(2, 5), d.int(1, 4)], eb = [d.int(2, 6), d.int(1, 3)];
      if (ea[1] > 1 && eb[1] > 1) eb[1] = 1;
      const pw = (v, e) => v + (e > 1 ? '^' + e : ''), src = [pw(a, ea[0]), pw(b, eb[0]), pw(a, ea[1]), pw(b, eb[1])].join('*');
      return powQ(SIMP, src, [a, b], { rule: 'law-mul-mixed', explain: `밑이 같은 것끼리 모아 지수를 더한다. ${xh(src)} = ${pe(a, ea.join(' + '))} × ${pe(b, eb.join(' + '))} = ${pt(xv(src))}이다.` });
    }),
    T('law-pow', '거듭제곱의 거듭제곱', '①2 ②3', (d) => {
      const base = d.bool() ? one(d) : String(d.pick([2, 3, 5, 7])), [p, q] = d.until(() => [d.int(2, 6), d.int(2, 6)], ([x, y]) => x + y !== x * y), src = `(${base}^${p})^${q}`, v = /\d/.test(base) ? '#' + base : base;
      return powQ(SIMP, src, [v], { rule: 'law-pow', explain: `${RULE_POW} ${xh(src)} = ${pe(v, `${p} × ${q}`)} = ${pe(v, p * q)}이다.` });
    }),
    T('law-pow-mul', '거듭제곱의 거듭제곱과 곱이 섞인 식', '①2 ②4 심6', (d, n) => {
      if (n === 0) {
        const v = one(d), [p, q, r, s] = [d.int(2, 4), d.int(2, 5), d.int(2, 4), d.int(2, 5)], form = d.bool();
        const src = form ? `${v}^${p}*(${v}^${q})^${r}` : `(${v}^${p})^${q}*(${v}^${r})^${s}`;
        return powQ(SIMP, src, [v], { rule: 'law-pow-mul-one', explain: `거듭제곱의 거듭제곱을 먼저 계산한 다음 지수끼리 더한다. ${told(src)}이다.` });
      }
      const [a, b] = pair(d), [p, q, r, s, t] = [d.int(2, 5), d.int(2, 4), d.int(2, 4), d.int(2, 4), d.int(2, 4)], src = `${a}^${p}*(${b}^${q})^${r}*(${a}^${s})^${t}`;
      return powQ(SIMP, src, [a, b], { rule: 'law-pow-mul-two', explain: `${RULE_POW} ${xh(src)} = ${xh(`${a}^${p}*${b}^${q * r}*${a}^${s * t}`)}이고, 밑이 같은 것끼리 지수를 더하면 ${pt(xv(src))}이다.` });
    }, { count: 2 }),
    T('law-div-big', '거듭제곱의 나눗셈: 나누어지는 식의 지수가 클 때', '①3 ②5', (d) => {
      const v = one(d), q = d.int(2, 6), p = q + d.int(2, 6), src = `${v}^${p}:${v}^${q}`;
      return powQ(SIMP, src, [v], { rule: 'law-div-big', explain: `${RULE_DIV} ${xh(src)} = ${pe(v, `${p} − ${q}`)} = ${pe(v, p - q)}이다.` });
    }),
    T('law-div-same', '거듭제곱의 나눗셈: 지수가 같을 때', '①3 ②6·12', (d) => {
      const v = one(d), p = d.int(3, 9), src = `${v}^${p}:${v}^${p}`;
      // 틀린 보기: 지수를 빼어 나온 0을 그대로 답한다 / 지수가 0이 되니 문자만 남긴다 / 지수를 더한다
      return pickQ(d, SIMP_PICK, src, [[], mk(1, { [v]: 1 }), mk(1, { [v]: 2 * p })], { figure: xex(src), rule: 'law-div-same', explain: `같은 식으로 나누면 몫은 1이다. ${xh(src)} = 1이다. 지수끼리 뺀 0을 답으로 적지 않는다.` });
    }),
    T('law-div-small', '거듭제곱의 나눗셈: 나누는 식의 지수가 클 때', '①3 ②7', (d) => {
      const v = one(d), p = d.int(2, 6), k = d.int(2, 5), q = p + k, src = `${v}^${p}:${v}^${q}`;
      // 틀린 보기: 큰 지수에서 작은 지수를 뺀 거듭제곱을 그대로 / 지수의 차 −k를 부호로 / 지수를 더한 것을 분모에 / 지수를 더한다
      return pickQ(d, SIMP_PICK, src, [mk(1, { [v]: k }), mk(-1, { [v]: k }), mk(1, { [v]: -(p + q) }), mk(1, { [v]: p + q })], {
        figure: xex(src), rule: 'law-div-small',
        explain: `나누는 식의 지수가 더 크면 분수 꼴이 된다. ${xh(src)} = ${frac(1, pe(v, `${q} − ${p}`))} = ${pt(xv(src))}이다.`
      });
    }),
    T('law-div-chain', '나눗셈을 연달아 하는 거듭제곱의 계산', '①3 ②8', (d, n) => {
      const v = one(d);
      if (n === 0) {
        // a^p ÷ a^q ÷ a^r: 앞에서부터 차례로. 틀린 보기: 뒤의 나눗셈부터 계산한 것, 분자·분모를 뒤집은 것, 1
        const [p, q, r] = d.until(() => [d.int(4, 12), d.int(2, 6), d.int(2, 5)], ([x, y, z]) => ![0, 1, -1].includes(x - y - z) && Math.abs(x - y - z) <= 5 && y !== z && x > y);
        const src = `${v}^${p}:${v}^${q}:${v}^${r}`, k = p - q - r;
        return pickQ(d, SIMP_PICK, src, [mk(1, { [v]: p - q + r }), mk(1, { [v]: -k }), mk(1, {}), mk(1, { [v]: -(p - q + r) })], {
          figure: xex(src), rule: 'law-div-chain',
          explain: `앞에서부터 차례로 계산한다. ${xh(src)} = ${pt(xv(`${v}^${p}:${v}^${q}`))} ÷ ${xh(`${v}^${r}`)} = ${pt(xv(src))}이다.`
        });
      }
      // b^p × b^q ÷ b^(p+q) = 1
      const [p, q] = [d.int(2, 6), d.int(2, 5)], src = `${v}^${p}*${v}^${q}:${v}^${p + q}`;
      return pickQ(d, SIMP_PICK, src, [[], mk(1, { [v]: 1 }), mk(1, { [v]: 2 * (p + q) })], {
        figure: xex(src), rule: 'law-div-chain-one',
        explain: `앞에서부터 차례로 계산한다. ${xh(src)} = ${xh(`${v}^${p + q}:${v}^${p + q}`)} = 1이다. 같은 식으로 나누면 몫은 1이다.`
      });
    }, { count: 2 }),
    T('law-div-pow', '거듭제곱의 거듭제곱을 한 다음 나누기', '①3 ②9', (d) => {
      // (x^p)^q ÷ (x^r)^s: 몫이 분수 꼴. 틀린 보기: 괄호 밖의 지수를 더한 것, 분자·분모를 뒤집은 것, 지수의 차를 부호로 적은 것, 지수를 모두 더해 분모에 둔 것
      const v = one(d), [p, q, r, s] = d.until(() => [d.int(2, 5), d.int(2, 4), d.int(2, 5), d.int(2, 4)], ([a, b, c, e]) => a * b - c * e < 0 && a * b - c * e >= -6 && a + b !== c + e && a !== c);
      const src = `(${v}^${p})^${q}:(${v}^${r})^${s}`, k = r * s - p * q, add = p + q - (r + s);
      return pickQ(d, SIMP_PICK, src, [mk(1, { [v]: add }), mk(1, { [v]: k }), mk(-1, { [v]: k }), mk(1, { [v]: -(p * q + r * s) })], {
        figure: xex(src), rule: 'law-div-pow', explain: `${RULE_POW} ${told(src)}이다. 나누는 식의 지수가 더 크므로 분수 꼴이 된다.`
      });
    }),
    T('law-pow-muldiv', '거듭제곱의 거듭제곱이 낀 곱셈과 나눗셈', '②9', (d) => {
      const v = one(d), [p, q, r, s, t] = d.until(() => [d.int(2, 4), d.int(3, 5), d.int(2, 5), d.int(2, 4), d.int(2, 4)], ([a, b, c, e, f]) => a * b + c - e * f >= 2 && a * b + c - e * f <= 9 && a * b !== e * f && a * b + c - e * f !== c);
      const src = `(${v}^${p})^${q}*${v}^${r}:(${v}^${s})^${t}`;
      return powQ(SIMP, src, [v], { rule: 'law-pow-muldiv', explain: `${RULE_POW} ${xh(src)} = ${xh(`${v}^${p * q}*${v}^${r}:${v}^${s * t}`)} = ${pe(v, `${p * q} + ${r} − ${s * t}`)} = ${pt(xv(src))}이다.` });
    }),
    T('law-prod-pow', '곱의 거듭제곱', '①4 ②10', (d) => {
      const [a, b] = pair(d), [p, q] = d.until(() => [d.int(1, 5), d.int(1, 5)], ([x, y]) => x !== y), k = d.int(2, 4), src = `(${vs([[a, p], [b, q]])})^${k}`;
      return powQ(SIMP, src, [a, b], { rule: 'law-prod-pow', explain: `괄호 안의 문자마다 지수에 ${k}${tail(k, '을/를')} 곱한다. ${xh(src)} = ${pe(a, `${p} × ${k}`)}${pe(b, `${q} × ${k}`)} = ${pt(xv(src))}이다.` });
    }),
    T('law-prod-coef', '계수가 있는 단항식의 거듭제곱', '①4 ②10', (d) => {
      const [a, b] = pair(d), k = d.pick([2, 3]), c = -d.int(2, k === 2 ? 6 : 4), [p, q] = [d.int(2, 5), d.int(1, 4)], src = `(${ms(c, [[a, p], [b, q]])})^${k}`;
      return monoQ(SIMP, src, [a, b], { rule: 'law-prod-coef', explain: `계수 ${tx(Q(c))}도 ${nth(k)}한다. ${xh(src)} = ${nb(`(${tx(Q(c))})${sup(k)}`)} × ${pe(a, `${p} × ${k}`)}${pe(b, `${q} × ${k}`)} = ${pt(xv(src))}이다.` });
    }),
    T('law-prod-sign', '부호가 있는 단항식의 거듭제곱', '①4 ②10', (d) => {
      // (−a^p b^q c^r)^k: 음수를 짝수 번 곱하면 양수, 홀수 번 곱하면 음수. 틀린 보기: 부호를 뒤집은 것, 지수를 더한 것(부호는 바른 것·뒤집은 것)
      const k = d.pick([3, 4, 5]), [p, q, r] = [d.int(2, 4), d.int(2, 5), d.int(1, 3)], src = `(-a^${p}b^${q}${r > 1 ? 'c^' + r : 'c'})^${k}`, R = xv(src), sg = R[0].q.p;
      const e = { a: p * k, b: q * k, c: r * k }, e2 = { a: p + k, b: q + k, c: r + k };
      return pickQ(d, SIMP_PICK, src, [mk(-sg, e), mk(sg, e2), mk(-sg, e2)], {
        figure: xex(src), rule: 'law-prod-sign',
        explain: `−1을 ${k}번 곱하면 ${sg > 0 ? '1' : '−1'}이다(음수를 짝수 번 곱하면 양수, 홀수 번 곱하면 음수). 문자마다 지수에 ${k}${tail(k, '을/를')} 곱하면 ${xh(src)} = ${pt(R)}이다.`
      });
    }),
    T('law-frac-pow', '분수 꼴의 거듭제곱', '①5 ②11', (d, n) => {
      const [a, b] = pair(d);
      if (n === 0) {
        // 계수가 없는 분수 꼴(부호가 붙기도 한다). 틀린 보기: 분자만 거듭제곱 / 지수를 더함 / 부호를 놓침 / 분모만 거듭제곱
        const [p, q] = d.until(() => [d.int(1, 4), d.int(1, 4)], ([x, y]) => x !== y), k = d.pick([2, 3, 4, 5]), neg = d.bool(), src = `(${neg ? '-' : ''}[${vs([[a, p]])}|${vs([[b, q]])}])^${k}`, R = xv(src), sg = R[0].q.p;
        return pickQ(d, SIMP_PICK, src, [mk(sg, { [a]: p * k, [b]: -q }), mk(sg, { [a]: p + k, [b]: -(q + k) }), mk(-sg, { [a]: p * k, [b]: -q * k }), mk(sg, { [a]: p, [b]: -q * k })], {
          figure: xex(src), rule: 'law-frac-pow',
          explain: `분자와 분모를 각각 ${nth(k)}한다. ${xh(src)} = ${pt(R)}이다.${neg ? ` −1을 ${k}번 곱하면 ${sg > 0 ? '1' : '−1'}이다.` : ''}`
        });
      }
      // 계수가 있는 분수 꼴. 틀린 보기: 계수에 지수를 곱함 / 분모의 계수를 거듭제곱하지 않음 / 부호를 놓침 / 문자의 지수를 더함 / 계수를 그대로 둠
      const k = d.pick([2, 3]), [c1, c2] = d.until(() => [d.int(1, k === 2 ? 5 : 3), d.int(1, k === 2 ? 5 : 3)], ([x, y]) => x !== y && gcd(x, y) === 1 && x * y > 1), [p, q] = [d.int(1, 4), d.int(1, 4)], neg = d.bool();
      const top = ms(c1, [[a, p]]), bot = ms(c2, [[b, q]]), src = `(${neg ? '-' : ''}[${top}|${bot}])^${k}`, R = xv(src), sg = R[0].q.p, e = { [a]: p * k, [b]: -q * k };
      return pickQ(d, SIMP_PICK, src, [mk(Q(sg * c1 * k, c2 * k), e), mk(Q(sg * c1 ** k, c2), e), mk(Q(-sg * c1 ** k, c2 ** k), e), mk(Q(sg * c1 ** k, c2 ** k), { [a]: p + k, [b]: -(q + k) }), mk(Q(sg * c1, c2), e), mk(Q(sg * c1 ** k, c2 ** k), { [a]: p * k, [b]: -q }), mk(Q(sg * c1 ** k, c2 ** k), { [a]: p, [b]: -q * k })], {
        figure: xex(src), rule: 'law-frac-pow-coef',
        explain: `분자와 분모를 각각 ${nth(k)}하고, 계수도 ${nth(k)}한다. ${xh(src)} = ${pt(R)}이다.`
      });
    }, { count: 2 }),
    T('law-mixed-brace', '괄호가 겹친 거듭제곱의 계산', '①6', (d) => {
      // (−a^p)² ÷ {a^q × (a^r)^s} 또는 (a^p b^q)² ÷ {(a^r b^s)² ÷ a^t b^u}: 중괄호 안을 먼저 계산한다.
      if (d.bool()) {
        const v = one(d), [p, q, r, s] = d.until(() => [d.int(3, 7), d.int(2, 4), d.int(2, 4), d.int(2, 4)], ([a, b, c, e]) => 2 * a - (b + c * e) <= -1 && 2 * a - (b + c * e) >= -5 && 2 * a - b + c * e !== 0);
        const src = `(-${v}^${p})^2:{${v}^${q}*(${v}^${r})^${s}}`, k = q + r * s - 2 * p;
        // 틀린 보기: 분자·분모를 뒤집음 / (−a^p)²을 −a^(2p)로 / 중괄호를 무시하고 앞에서부터 / 부호만 틀림
        return pickQ(d, SIMP_PICK, src, [mk(1, { [v]: k }), mk(-1, { [v]: -k }), mk(1, { [v]: 2 * p - q + r * s }), mk(-1, { [v]: k })], {
          figure: xex(src), rule: 'law-mixed-brace', explain: `거듭제곱을 먼저 계산하고, 중괄호 안을 계산한 다음 나눈다. ${told(src)}이다.`
        });
      }
      const [a, b] = pair(d), [p, q, r, s, t, u] = d.until(() => [d.int(2, 4), d.int(2, 4), d.int(2, 4), d.int(1, 3), d.int(1, 4), d.int(1, 4)], ([p1, q1, r1, s1, t1, u1]) => 2 * p1 - (2 * r1 - t1) === 0 && 2 * q1 - (2 * s1 - u1) >= 2 && 2 * r1 - t1 > 0 && 2 * s1 - u1 > 0);
      const src = `(${vs([[a, p], [b, q]])})^2:{(${vs([[a, r], [b, s]])})^2:${vs([[a, t], [b, u]])}}`, R = xv(src), k = R[0].e[b];
      // 문자 하나가 약분되어 사라진다. 틀린 보기: 사라진 문자를 남김 / 중괄호를 무시하고 앞에서부터 / 분수 꼴로 뒤집음 / 약분하지 않음
      return pickQ(d, SIMP_PICK, src, [mk(1, { [a]: 1, [b]: k }), xv(src.replace('{', '').replace('}', '')), mk(1, { [b]: -k }), mk(1, { [a]: 2 * p, [b]: k })], {
        figure: xex(src), rule: 'law-mixed-brace', explain: `거듭제곱을 먼저 계산하고, 중괄호 안을 계산한 다음 나눈다. ${told(src)}이다.`
      });
    }),
    T('law-mixed-frac', '곱의 거듭제곱과 분수 꼴의 거듭제곱의 곱', '①6 ②32', (d) => {
      // (a^p b^q)² × (−kb/a^r)²: 분수 꼴을 제곱한 다음 약분한다.
      const [a, b] = pair(d), [p, q, k, r] = d.until(() => [d.int(2, 4), d.int(1, 3), d.int(2, 4), d.int(1, 2)], ([p1, , , r1]) => 2 * p1 - 2 * r1 >= 1), neg = d.bool();
      const src = `(${vs([[a, p], [b, q]])})^2*(${neg ? '-' : ''}[${ms(k, [[b, 1]])}|${vs([[a, r]])}])^2`;
      return monoQ(SIMP, src, [a, b], { rule: 'law-mixed-frac', explain: `거듭제곱을 먼저 계산한다. 분수 꼴은 분자와 분모를 각각 제곱한다. ${told(src)}이다.` });
    }),
    T('law-frac-prod', '분수 꼴의 거듭제곱끼리의 곱', '심28', (d) => {
      // (±a^p / c1 b)^k1 × (±c2 b^q / a)^k2: 분자·분모·부호를 모두 거듭제곱한 다음 약분한다.
      // 틀린 보기: 부호를 놓침 / 분모의 계수를 거듭제곱하지 않음 / 통째로 뒤집음 / 분모의 문자를 거듭제곱하지 않음
      const [a, b] = pair(d);
      const [f1, f2, c1, k1, p, q, k2] = d.until(() => {
        const [x1, x2] = [d.int(2, 4), d.int(2, 4)], [u1, u2] = [d.pick([2, 3]), d.pick([2, 3])], [p1, q1] = [d.int(1, 3), d.int(1, 3)], [s1, s2] = [d.bool() ? '-' : '', d.bool() ? '-' : ''];
        return [`(${s1}[${vs([[a, p1]])}|${x1}${b}])^${u1}`, `(${s2}[${x2}${vs([[b, q1]])}|${a}])^${u2}`, x1, u1, p1, q1, u2];
      }, ([x, y]) => { const t = xv(`${x}*${y}`)[0]; return (x.includes('-') || y.includes('-')) && Math.abs(t.q.p) <= 99 && t.q.q <= 99 && (t.q.q > 1 || Object.values(t.e).some((e) => e < 0)) && Object.values(t.e).every((e) => e !== 0); });
      const src = `${f1}*${f2}`, R = xv(src), t = R[0], F2 = xv(f2);
      const loose = pMul(mk(Q(f1.includes('-') && k1 % 2 ? -1 : 1, c1), { [a]: p * k1, [b]: -k1 }), F2), bare = pMul(mk(Q(f1.includes('-') && k1 % 2 ? -1 : 1, c1 ** k1), { [a]: p * k1, [b]: -1 }), F2);
      return pickQ(d, SIMP_PICK, R, [flip(R), loose, inv(R), bare, mk(t.q, Object.fromEntries(Object.keys(t.e).map((key) => [key, -t.e[key]])))], {
        figure: xex(src), rule: 'law-frac-prod', explain: `분수 꼴은 분자와 분모를 각각 거듭제곱하고, 부호도 거듭제곱한다. ${told(src)}이다.`
      });
    }),
    T('law-blank', '지수법칙으로 계산하는 과정의 빈칸', '①7 ②1·3·5·7·10', (d, n) => {
      const v = one(d), W = V(v), ASK = '다음 계산 과정의 ㉠, ㉡에 알맞은 수는?';
      if (n === 0) {
        const [p, q] = [d.int(2, 7), d.int(2, 6)];
        return slots(ASK, [[LAB[0], q, String(q)], [LAB[1], p + q + 1, `${p}+${q}+1`]], {
          figure: proc([{ h: xe(`${v}^${p}*${v}^${q}*${v}`) }, { h: W + sup(`${p} + ${box(LAB[0])} + 1`) }, { h: W + sup(box(LAB[1])) }]), rule: 'law-blank-mul',
          explain: `${RULE_MUL} ${W} = ${pe(v, 1)}이므로 지수는 ${p} + ${q} + 1 = ${p + q + 1}이다.`
        });
      }
      if (n === 1) {
        const [p, q, r, s] = d.until(() => [d.int(3, 6), d.int(2, 4), d.int(2, 4), d.int(2, 3)], ([a, b, c, e]) => a * b - c * e >= 2);
        return slots(ASK, [[LAB[0], p * q, `${p}*${q}`], [LAB[1], p * q - r * s, `${p}*${q}-${r * s}`]], {
          figure: proc([{ h: xe(`(${v}^${p})^${q}:(${v}^${r})^${s}`) }, { h: W + sup(box(LAB[0])) + ' <i>÷</i> ' + W + sup(r * s) }, { h: W + sup(box(LAB[1])) }]), rule: 'law-blank-pow',
          explain: `${RULE_POW} ${xh(`(${v}^${p})^${q}`)} = ${pe(v, `${p} × ${q}`)} = ${pe(v, p * q)}이다. ${RULE_DIV} ${p * q} − ${r * s} = ${p * q - r * s}이다.`
        });
      }
      const [p, q] = d.until(() => { const x = d.int(2, 6); return [x, x + d.int(2, 6)]; }, ([x, y]) => y - x !== x);
      return slots(ASK, [[LAB[0], p, String(p)], [LAB[1], q - p, `${q}-${p}`]], {
        figure: proc([{ h: xe(`${v}^${p}:${v}^${q}`) }, { h: frac('1', W + sup(`${q} − ${box(LAB[0])}`)) }, { h: frac('1', W + sup(box(LAB[1]))) }]), rule: 'law-blank-div',
        explain: `나누는 식의 지수가 더 크므로 ${xh(`${v}^${p}:${v}^${q}`)} = ${frac(1, pe(v, `${q} − ${p}`))} = ${frac(1, pe(v, q - p))}이다.`
      });
    }, { count: 3 }),
    T('law-arrow', '화살표의 식을 차례로 곱하고 나눈 결과', '①9', (d) => {
      const v = one(d), W = V(v), [p, q, r] = d.until(() => [d.int(3, 8), d.int(2, 6), d.int(2, 5)], ([a, b, c]) => a + b - c >= 2 && c !== b);
      const pw = (e) => W + sup(e);
      return inline('다음 그림에서 화살표 위의 식을 곱하거나 나눈 결과를 오른쪽 칸에 적는다. ㉠, ㉡에 알맞은 식을 구하시오.', `㉠ ${W}<sup>{0}</sup>, ㉡ ${W}<sup>{1}</sup>`, [{ answer: p + q }, { answer: p + q - r }], {
        figure: flow([pw(p), { step: '× ' + pw(q) }, LAB[0], { step: '÷ ' + pw(r) }, LAB[1]]), shown: `㉠ ${pw(p + q)}, ㉡ ${pw(p + q - r)}`,
        explain: `㉠ ${xh(`${v}^${p}*${v}^${q}`)} = ${pe(v, `${p} + ${q}`)} = ${pe(v, p + q)}, ㉡ ${xh(`${v}^${p + q}:${v}^${r}`)} = ${pe(v, `${p + q} − ${r}`)} = ${pe(v, p + q - r)}이다.`,
        facts: { calc: [[`${p}+${q}`, 0], [`${p}+${q}-${r}`, 1]] }
      });
    }),
    T('law-claims', '지수법칙으로 계산한 식의 옳고 그름', '①10 ②12·13 심3·4', (d, n) => {
      const [a, b] = pair(d);
      if (n === 0) {
        // 지수법칙을 골고루 섞은 식에서 옳은 것 하나
        const [p, q] = d.until(() => [d.int(2, 5), d.int(2, 5)], ([x, y]) => x + y !== x * y), r = d.int(2, 4);
        return eqQ(d, '다음 중 옳은 것은?', [
          [`${a}^${p}+${a}^${p}`, mk(1, { [a]: 2 * p })], [`${a}^${p}*${a}^${q}`, mk(1, { [a]: p * q })], [`${a}^${q}:${a}^${q}`, d.bool() ? [] : mk(1, { [a]: 1 })],
          [`(2${a}^${r})^3`, mk(2, { [a]: 3 * r })], [`([${a}^${r}|${b}])^3`, mk(1, { [a]: 3 * r, [b]: -1 })], [`(${a}^${p})^${q}`, mk(1, { [a]: p + q })], [`${a}^${r}:${a}^${r + 1}`, mk(1, { [a]: 1 })]
        ], true, { rule: 'law-claims-all' });
      }
      if (n === 1) {
        // 곱·분수 꼴의 거듭제곱에서 옳지 않은 것 하나
        const [p, q] = [d.int(2, 4), d.int(2, 4)], k = d.int(2, 3);
        return eqQ(d, '다음 중 옳지 않은 것은?', [
          [`(-2${a}^${p}${b})^2`, mk(-4, { [a]: 2 * p, [b]: 2 }), '음수를 짝수 번 곱하면 양수이다.'],
          [`(-[${a}|2${b}^${q}])^2`, mk(Q(1, 2), { [a]: 2, [b]: -2 * q }), '분모의 2도 제곱한다.'],
          [`(3${a}${b}^${q})^3`, mk(9, { [a]: 3, [b]: 3 * q }), '계수 3도 세제곱하여 27이 된다.'],
          [`(2${a}${b})^5`, mk(10, { [a]: 5, [b]: 5 }), '계수 2를 다섯 번 곱하면 32이다.'],
          [`(-[${a}^${p}|${b}])^3`, mk(1, { [a]: 3 * p, [b]: -3 }), '음수를 홀수 번 곱하면 음수이다.'],
          [`(${a}^${p}${b}^${q})^${k + 1}`, mk(1, { [a]: p + k + 1, [b]: q + k + 1 }), '괄호 안의 지수에 괄호 밖의 지수를 곱한다.']
        ], false, { rule: 'law-claims-prod' });
      }
      // 나눗셈에서 옳은 것 하나
      const [p, q] = d.until(() => [d.int(5, 9), d.int(2, 4)], ([x, y]) => x - y !== y && x - 2 * y !== 0), r = d.int(2, 6), [s, t] = [d.int(2, 5), d.int(6, 9)], u = d.int(3, 5);
      return eqQ(d, '다음 중 옳은 것은?', [
        [`${a}^${s}:${a}^${t}`, mk(1, { [a]: t - s })], [`${b}^${r}:${b}^${r}`, []], [`${b}^${t}:${b}^${s}`, mk(1, { [b]: -(t - s) })],
        [`${a}^${2 * u}:${a}^2`, mk(1, { [a]: u })], [`${a}^${p}:${a}^${q}:${a}^${p - q}`, []], [`${b}^${p}:${b}^${q}*${b}^${q}`, mk(1, { [b]: p - 2 * q })]
      ], true, { rule: 'law-claims-div' });
    }, { count: 3 }),
    T('law-odd', '계산 결과가 나머지와 다른 식 찾기', '①11', (d) => {
      // 셋은 결과가 문자 하나(a)이고 하나만 다르다(−a, 1/a, a²).
      const v = one(d), p = d.int(3, 6), q = p + d.int(1, 3);
      const sameOnes = d.shuffle([`${v}^${p + 1}:${v}^${p}`, `${v}^${p}:${v}^${q}*${v}^${q - p + 1}`, `${v}^${p}*${v}^${q - p + 1}:${v}^${q}`, `${v}^${q}:${v}:${v}^${q - 2}`]).slice(0, 3);
      const odd = d.pick([`(-${v})^3:(-${v})^2`, `${v}^${p}:${v}^${p + 1}`, `${v}^${p}*${v}:${v}^${p - 1}`]), rows = d.shuffle(sameOnes.concat([odd]));
      return C('다음 중 계산 결과가 나머지 셋과 다른 하나는?', rows.map(xh), rows.indexOf(odd), {
        explain: `계산 결과는 차례로 ${rows.map((s) => pt(xv(s))).join(', ')}이다.`, facts: { truth: rows.map((s) => !xsame(s, v)), want: true, rule: 'odd-chain' }
      });
    })
  ];

  // ── 지수법칙으로 수 구하기 ──
  const BOX_ASK = '다음 식의 □ 안에 알맞은 수는?';
  // 등식 여러 줄(이름표 없이): 줄은 [왼쪽 식 글, 오른쪽 식 글]
  const xlines = (rows) => { const style = fit(Math.max(...rows.map(rowEm))); return lines(rows.map((r) => '<span class="mb-expr"' + (style || ' style="font-size:1.2rem"') + '>' + rowH(r) + '</span>')); };
  const eqh = (l, r) => xh(l) + ' = ' + xh(r);
  // 수만 있는 식 글을 검사가 셈하는 글로: 2^4*2^4:2^2 → 2**4*2**4/2**2
  const numJs = (src) => src.replace(/\^/g, '**').replace(/:/g, '/').replace(/[{<]/g, '(').replace(/[}>]/g, ')');
  const boxN = (text, answer, figure, calc, explain, more) => N(text, answer, { figure, explain, facts: Object.assign({ calc: [[calc, 0]] }, more || {}) });
  const expoTypes = [
    T('expo-box-one', '지수법칙을 한 번 쓰는 식의 □ 안의 지수', '①14 ②14', (d, n) => {
      const v = one(d);
      if (n === 0) {
        const q = d.int(2, 6), k = d.int(2, 7), r = q + k, lhs = d.bool() ? `${v}^?*${v}^${q}` : `${v}^${q}*${v}^?`;
        return boxN(BOX_ASK, k, eqx(lhs, `${v}^${r}`), `${r}-${q}`, `${RULE_MUL} □ + ${q} = ${r}이므로 □ = ${k}이다.`, { rule: 'expo-box-mul' });
      }
      if (n === 1) {
        const k = d.int(2, 6), m = d.until(() => d.int(2, 7), (x) => x !== k);
        return boxN(BOX_ASK, m, eqx(`(${v}^?)^${k}`, `${v}^${k * m}`), `${k * m}/${k}`, `${RULE_POW} □ × ${k} = ${k * m}이므로 □ = ${m}이다.`, { rule: 'expo-box-pow' });
      }
      const q = d.int(3, 8);
      return boxN(BOX_ASK, q + 1, eqx(`${v}^?:${v}^${q}`, v), `${q}+1`, `${V(v)} = ${pe(v, 1)}이다. ${RULE_DIV} □ − ${q} = 1이므로 □ = ${q + 1}이다.`, { rule: 'expo-box-div', unseen: [1] });
    }, { count: 3 }),
    T('expo-box-multi', '지수법칙을 여러 번 쓰는 식의 □ 안의 지수', '①14 ②15 심7', (d, n) => {
      const v = one(d);
      if (n === 0) {
        const [p, k, q] = d.until(() => [d.int(2, 5), d.int(2, 5), d.int(2, 6)], ([x, y]) => x !== y), r = p * k + q;
        return boxN(BOX_ASK, k, eqx(`(${v}^${p})^?*${v}^${q}`, `${v}^${r}`), `(${r}-${q})/${p}`, `${xh(`(${v}^${p})^?`)}의 지수는 ${p} × □이다. ${p} × □ + ${q} = ${r}에서 ${p} × □ = ${r - q}이므로 □ = ${k}이다.`, { rule: 'expo-multi-pow' });
      }
      if (n === 1) {
        const [q, r, k] = [d.int(2, 4), d.int(2, 4), d.int(2, 7)], p = q * r + k;
        return boxN(BOX_ASK, k, eqx(`${v}^${p}:(${v}^${q})^${r}:${v}^?`, '1'), `${p}-${q}*${r}`, `${xh(`${v}^${p}:(${v}^${q})^${r}`)} = ${xh(`${v}^${p}:${v}^${q * r}`)} = ${xh(`${v}^${k}`)}이다. 같은 식으로 나누어야 몫이 1이므로 □ = ${k}이다.`, { rule: 'expo-multi-one' });
      }
      const [p, q, r] = d.until(() => [d.int(3, 7), d.int(2, 5), d.int(2, 6)], ([x, y, z]) => y + z - x >= 2 && x > y), k = q + r - p;
      return boxN(BOX_ASK, k, eqx(`${v}^${p}:${v}^${q}:${v}^${r}`, `[1|${v}^?]`), `${q}+${r}-${p}`, `${xh(`${v}^${p}:${v}^${q}:${v}^${r}`)} = ${pt(xv(`${v}^${p}:${v}^${q}`))} ÷ ${xh(`${v}^${r}`)} = ${pt(xv(`${v}^${p}:${v}^${q}:${v}^${r}`))}이므로 □ = ${k}이다.`, { rule: 'expo-multi-frac', unseen: [1] });
    }, { count: 3 }),
    T('expo-box-prod', '곱의 거듭제곱에서 지수와 계수의 빈칸', '①14 ②16', (d) => {
      // (−k x^㉠ y)^n = ㉡ x^(mn) y^㉢
      const [a, b] = pair(d), n = d.pick([2, 3, 4]), k = d.int(2, n === 4 ? 3 : n === 3 ? 4 : 6), m = d.until(() => d.int(2, 6), (x) => x !== n), c = (-k) ** n;
      return slots('다음 식의 ㉠, ㉡, ㉢에 알맞은 수는?', [[LAB[0], m, `${m * n}/${n}`], [LAB[1], c, `(-${k})**${n}`, true], [LAB[2], n, String(n)]], {
        figure: eqx(`(-${k}${a}^㉠${b})^${n}`, `㉡${a}^${m * n}${b}^㉢`),
        explain: `괄호 안의 계수와 문자를 각각 ${nth(n)}한다. ${V(a)}의 지수는 ㉠ × ${n} = ${m * n}에서 ㉠ = ${m}, 계수는 ㉡ = ${nb(`(${tx(Q(-k))})${sup(n)}`)} = ${tx(Q(c))}, ${V(b)}의 지수는 ㉢ = 1 × ${n} = ${n}이다.`
      });
    }),
    T('expo-box-quot', '분수 꼴의 거듭제곱과 나눗셈에서 빈칸 둘', '①14 ②16 심8', (d, n) => {
      const [a, b] = pair(d);
      if (n === 0) {
        // (x^p / k y)^㉠ = x^(pn) / ㉡ y^n: 지수를 견주어 바깥 지수를 먼저 구한다.
        const k = d.int(2, 4), nn = d.pick(k === 4 ? [2, 3] : [2, 3, 4]), p = d.until(() => d.int(2, 5), (x) => x !== nn);
        return slots('다음 식의 ㉠, ㉡에 알맞은 수는?', [[LAB[0], nn, `${p * nn}/${p}`], [LAB[1], k ** nn, `${k}**(${p * nn}/${p})`]], {
          figure: eqx(`([${a}^${p}|${k}${b}])^㉠`, `[${a}^${p * nn}|㉡${b}^${nn}]`), rule: 'expo-quot-pow',
          explain: `${V(a)}의 지수에서 ${p} × ㉠ = ${p * nn}이므로 ㉠ = ${nn}이다. 분모의 계수도 ${nth(nn)}하므로 ㉡ = ${nb(k + sup(nn))} = ${k ** nn}이다.`
        });
      }
      // a^p b^q ÷ a^㉠ b^r = a / b^㉡
      const [p, q, r] = d.until(() => [d.int(4, 9), d.int(2, 5), d.int(4, 9)], ([, y, z]) => z - y >= 2);
      return slots('다음 식의 ㉠, ㉡에 알맞은 수는?', [[LAB[0], p - 1, `${p}-1`], [LAB[1], r - q, `${r}-${q}`]], {
        figure: eqx(`${a}^${p}${b}^${q}:${a}^㉠${b}^${r}`, `[${a}|${b}^㉡]`), rule: 'expo-quot-div', unseen: [1],
        explain: `${V(a)}의 지수에서 ${p} − ㉠ = 1이므로 ㉠ = ${p - 1}이다. ${V(b)}는 나누는 식의 지수가 더 크므로 분모에 남고 ㉡ = ${r} − ${q} = ${r - q}이다.`
      });
    }, { count: 2 }),
    T('expo-rank', '□ 안의 수를 구하여 견주기', '①15 ②17', (d, n) => {
      // 식마다 □ 안의 수를 구한 다음 견준다. kinds: 곱 / 거듭제곱 / 나눗셈 / 분수 꼴이 되는 나눗셈 / 곱의 거듭제곱
      const v = 'x', w = 'y';
      const row = (kind, t) => {
        const p = d.int(2, 5), k = d.int(2, 4);
        if (kind === 0) return { l: `${v}^${p}*${v}^?`, r: `${v}^${p + t}`, js: `${p + t}-${p}` };
        if (kind === 1) return { l: `(${v}^?)^${k}`, r: `${v}^${k * t}`, js: `${k * t}/${k}` };
        if (kind === 2) return { l: `${v}^${t + p}:${v}^?`, r: `${v}^${p}`, js: `${t + p}-${p}` };
        if (kind === 3) return { l: `${v}^${p}:${v}^${p + t}`, r: `[1|${v}^?]`, js: `${p + t}-${p}` };
        return { l: `(${v}^${p}${w}^?)^${k}`, r: `${v}^${p * k}${w}^${t * k}`, js: `${t * k}/${k}` };
      };
      const kinds = d.shuffle([0, 1, 2, 3, 4]).slice(0, 4);
      if (n === 0) {
        const ts = d.shuffle([2, 3, 4, 5, 6, 7]).slice(0, 4), rows = kinds.map((kind, i) => row(kind, ts[i])), best = Math.max(...ts);
        return C('다음 중 □ 안에 알맞은 수가 가장 큰 것은?', rows.map((r) => eqh(r.l, r.r)), ts.indexOf(best), {
          explain: `□ 안에 알맞은 수는 차례로 ${ts.join(', ')}이다.`, facts: { choose: { exprs: rows.map((r) => r.js), rule: 'max' } }
        });
      }
      const [t, u] = d.until(() => [d.int(2, 6), d.int(2, 6)], ([x, y]) => x !== y), at = d.int(0, 3), ts = kinds.map((_, i) => (i === at ? u : t)), rows = kinds.map((kind, i) => row(kind, ts[i]));
      return C('다음 중 □ 안에 알맞은 수가 나머지 셋과 다른 하나는?', rows.map((r) => eqh(r.l, r.r)), at, {
        explain: `□ 안에 알맞은 수는 차례로 ${ts.join(', ')}이다.`, facts: { choose: { exprs: rows.map((r) => r.js), rule: 'odd' } }
      });
    }, { count: 2 }),
    T('expo-outer', '계수와 지수를 견주어 지수 자리의 문자의 값 구하기', '①17 심8', (d) => {
      // (k x^a)^b = k^b x^(ab): 계수에서 b를 먼저 구하고, 지수에서 a를 구한다.
      const v = d.pick(['x', 'y']), k = d.pick([2, 3]), b = d.pick(k === 2 ? [3, 4, 5] : [2, 3, 4]), a = d.until(() => d.int(2, 6), (x) => x !== b);
      return slots(`다음 식을 만족시키는 자연수 ${V('a')}, ${V('b')}의 값은?`, [[eqLabel('a'), a, `${a * b}/${b}`], [eqLabel('b'), b, String(b)]], {
        figure: eqx(`(${k}${v}^a)^b`, `${k ** b}${v}^${a * b}`), unseen: [b],
        explain: `${xh(`(${k}${v}^a)^b`)} = ${nb(k + sup(V('b')) + V(v) + sup(V('a') + V('b')))}이다. 계수에서 ${nb(k + sup(V('b')))} = ${k ** b}이므로 ${V('b')} = ${b}이고, 지수에서 ${V('a')} × ${b} = ${a * b}이므로 ${V('a')} = ${a}이다.`
      });
    }),
    T('expo-chain', '곱셈과 나눗셈이 섞인 식에서 지수 자리의 문자의 값 구하기', '①17', (d) => {
      // (a^p)^x × (b^q)^y × a ÷ b^r = a^(px+1) b^(qy−r)
      const [p, q] = [d.int(2, 4), d.int(2, 4)], [x, y, r] = d.until(() => [d.int(2, 5), d.int(2, 5), d.int(2, 6)], ([, y1, r1]) => q * y1 - r1 >= 2), A = p * x + 1, Bx = q * y - r;
      return slots(`다음 식을 만족시키는 자연수 ${V('x')}, ${V('y')}의 값은?`, [[eqLabel('x'), x, `(${A}-1)/${p}`], [eqLabel('y'), y, `(${Bx}+${r})/${q}`]], {
        figure: eqx(`(a^${p})^x*(b^${q})^y*a:b^${r}`, `a^${A}b^${Bx}`), unseen: [1],
        explain: `${V('a')}의 지수는 ${p} × ${V('x')} + 1 = ${A}이므로 ${V('x')} = ${x}이다. ${V('b')}의 지수는 ${q} × ${V('y')} − ${r} = ${Bx}이므로 ${V('y')} = ${y}이다.`
      });
    }),
    T('expo-base', '밑을 같게 고쳐 지수 구하기', '①19 ②20 심7', (d, n) => {
      const b = d.pick([2, 3]), es = b === 2 ? [2, 3, 4, 5] : [2, 3, 4], pw = (e) => b ** e, B0 = String(b);
      if (n === 0) {
        // 밑이 다른 거듭제곱을 모두 b의 거듭제곱으로 고친다.
        const [e1, e2, e3] = d.shuffle(es).slice(0, 3), [p, q, r] = d.until(() => [d.int(2, 4), d.int(2, 5), d.int(2, 3)], ([x, y, z]) => e1 * x + e2 * y - e3 * z >= 2), k = e1 * p + e2 * q - e3 * r, src = `${pw(e1)}^${p}*${pw(e2)}^${q}:${pw(e3)}^${r}`;
        return boxN(BOX_ASK, k, eqx(src, `${B0}^?`), `${e1}*${p}+${e2}*${q}-${e3}*${r}`,
          `${pw(e1)} = ${nb(B0 + sup(e1))}, ${pw(e2)} = ${nb(B0 + sup(e2))}, ${pw(e3)} = ${nb(B0 + sup(e3))}이므로 ${xh(src)} = ${xh(`${B0}^${e1 * p}*${B0}^${e2 * q}:${B0}^${e3 * r}`)} = ${nb(B0 + sup(`${e1 * p} + ${e2 * q} − ${e3 * r}`))} = ${nb(B0 + sup(k))}이다.`, { rule: 'expo-base-all', unseen: [e1, e2, e3] });
      }
      if (n === 1) {
        // b^x × B^q = C^r 에서 x
        const [e2, e3] = d.until(() => d.shuffle(es).slice(0, 2), ([x, y]) => x < y), [q, r] = d.until(() => [d.int(2, 4), d.int(2, 5)], ([y, z]) => e3 * z - e2 * y >= 1), x = e3 * r - e2 * q;
        return boxN(`다음 식을 만족시키는 자연수 ${V('x')}의 값은?`, x, eqx(`${B0}^x*${pw(e2)}^${q}`, `${pw(e3)}^${r}`), `${e3}*${r}-${e2}*${q}`,
          `${pw(e2)} = ${nb(B0 + sup(e2))}, ${pw(e3)} = ${nb(B0 + sup(e3))}이므로 ${nb(B0 + sup(V('x')))} × ${nb(B0 + sup(e2 * q))} = ${nb(B0 + sup(e3 * r))}이다. ${V('x')} + ${e2 * q} = ${e3 * r}에서 ${V('x')} = ${x}이다.`, { rule: 'expo-base-x', unseen: [e2, e3] });
      }
      // b^x ÷ b^q = (수)에서 x
      const e = d.pick(es.slice(1)), q = d.int(2, 6), x = q + e;
      return boxN(`다음 식을 만족시키는 자연수 ${V('x')}의 값은?`, x, eqx(`${B0}^x:${B0}^${q}`, String(pw(e))), `${q}+${e}`,
        `${pw(e)} = ${nb(B0 + sup(e))}이므로 ${V('x')} − ${q} = ${e}에서 ${V('x')} = ${x}이다.`, { rule: 'expo-base-num', unseen: [e] });
    }, { count: 3 }),
    T('expo-factor', '거듭제곱을 소인수의 거듭제곱으로 나타내기', '②21 심9', (d, n) => {
      if (n === 0) {
        // 8^p × 27^q = 2^㉠ × 3^㉡
        const [e1, e2] = [d.pick([2, 3, 4]), d.pick([2, 3])], [p, q] = d.until(() => [d.int(2, 5), d.int(2, 5)], ([x, y]) => x !== y), src = `${2 ** e1}^${p}*${3 ** e2}^${q}`;
        return slots('다음 식의 ㉠, ㉡에 알맞은 수는?', [[LAB[0], e1 * p, `${e1}*${p}`], [LAB[1], e2 * q, `${e2}*${q}`]], {
          figure: eqx(src, '2^㉠*3^㉡'), rule: 'expo-factor-two', unseen: [e1, e2],
          explain: `${2 ** e1} = ${nb('2' + sup(e1))}, ${3 ** e2} = ${nb('3' + sup(e2))}이므로 ${xh(src)} = ${xh(`(2^${e1})^${p}*(3^${e2})^${q}`)} = ${xh(`2^${e1 * p}*3^${e2 * q}`)}이다.`
        });
      }
      // (2^i × 3^j)^p = 2^㉠ × 3^㉡
      const [i, j] = d.pick([[1, 2], [2, 1], [3, 1], [1, 3], [2, 2], [3, 2]]), p = d.int(2, 5), m = 2 ** i * 3 ** j;
      return slots('다음 식의 ㉠, ㉡에 알맞은 수는?', [[LAB[0], i * p, `${i}*${p}`], [LAB[1], j * p, `${j}*${p}`]], {
        figure: eqx(`${m}^${p}`, '2^㉠*3^㉡'), rule: 'expo-factor-one', unseen: [i, j],
        explain: `${m} = ${xh(`2${i > 1 ? '^' + i : ''}*3${j > 1 ? '^' + j : ''}`)}이므로 ${xh(`${m}^${p}`)} = ${xh(`(2${i > 1 ? '^' + i : ''}*3${j > 1 ? '^' + j : ''})^${p}`)} = ${xh(`2^${i * p}*3^${j * p}`)}이다.`
      });
    }, { count: 2 }),
    T('expo-add-same', '같은 거듭제곱을 여러 번 더한 것을 거듭제곱 하나로 나타내기', '①24 ②19 심1', (d) => {
      // b^k 을 m번 더한 것 = m × b^k. 틀리기 쉬운 것: 지수끼리 더한다.
      const [b, m, up] = d.pick([[2, 2, 1], [2, 4, 2], [3, 3, 1], [4, 4, 1], [2, 8, 3]]), k = d.int(2, 6), src = Array.from({ length: m }, () => `${b}^${k}`).join('+');
      return boxN(BOX_ASK, k + up, eqx(src, `${b}^?`), `${k}+${up}`,
        `${nb(b + sup(k))}을 ${m}번 더한 것이므로 ${xh(src)} = ${m} × ${nb(b + sup(k))}${m === b ? '' : ` = ${nb(b + sup(up))} × ${nb(b + sup(k))}`} = ${nb(b + sup(k + up))}이다. 덧셈에서는 지수끼리 더하지 않는다.`, { unseen: [up] });
    }),
    T('expo-three', '거듭제곱의 덧셈·곱셈·거듭제곱을 견주어 지수 구하기', '①25', (d, n) => {
      if (n === 0) {
        const [b, m, up] = d.pick([[2, 4, 2], [3, 3, 1], [2, 2, 1]]), [k, p, q] = d.until(() => [d.int(2, 5), d.int(2, 3), d.int(2, 3)], ([k1, p1, q1]) => new Set([k1 + up, k1 * m, k1 * p1 * q1]).size === 3), rep = (op) => Array.from({ length: m }, () => `${b}^${k}`).join(op);
        return slots('다음 세 식의 ㉠, ㉡, ㉢에 알맞은 수는?', [[LAB[0], k + up, `${k}+${up}`], [LAB[1], k * m, Array.from({ length: m }, () => k).join('+')], [LAB[2], k * p * q, `${k}*${p}*${q}`]], {
          figure: xlines([[rep('+'), `${b}^㉠`], [rep('*'), `${b}^㉡`], [`{(${b}^${k})^${p}}^${q}`, `${b}^㉢`]]), rule: 'expo-three-same', unseen: [up],
          explain: `첫째 식은 ${m} × ${nb(b + sup(k))} = ${nb(b + sup(k + up))}, 둘째 식은 지수를 ${m}번 더하여 ${nb(b + sup(k * m))}, 셋째 식은 지수끼리 곱하여 ${nb(b + sup(`${k} × ${p} × ${q}`))} = ${nb(b + sup(k * p * q))}이다.`
        });
      }
      // 밑 4를 2로 고친다.
      const [k, p, q] = d.until(() => [d.int(2, 4), d.int(2, 3), d.int(2, 3)], ([, p1, q1]) => p1 * q1 !== 4), rep = (op) => Array.from({ length: 4 }, () => `4^${k}`).join(op);
      return slots('다음 세 식의 ㉠, ㉡, ㉢에 알맞은 수는?', [[LAB[0], 2 * (k + 1), `2*(${k}+1)`], [LAB[1], 8 * k, `2*${k}*4`], [LAB[2], 2 * k * p * q, `2*${k}*${p}*${q}`]], {
        figure: xlines([[rep('+'), '2^㉠'], [rep('*'), '2^㉡'], [`{(4^${k})^${p}}^${q}`, '2^㉢']]), rule: 'expo-three-base', unseen: [1],
        explain: `4 = ${nb('2' + sup(2))}이다. 첫째 식은 4 × ${nb('4' + sup(k))} = ${nb('4' + sup(k + 1))} = ${nb('2' + sup(2 * (k + 1)))}, 둘째 식은 ${nb('4' + sup(4 * k))} = ${nb('2' + sup(8 * k))}, 셋째 식은 ${nb('4' + sup(k * p * q))} = ${nb('2' + sup(2 * k * p * q))}이다.`
      });
    }, { count: 2 }),
    T('expo-num-odd', '수의 거듭제곱의 계산 결과가 나머지와 다른 것 찾기', '①13 ②18', (d) => {
      // 셋은 값이 b^t 이고 하나만 다르다. 다른 하나는 덧셈·곱셈·거듭제곱에서 지수를 잘못 다룬 아이가 같다고 여기는 식이다.
      const b = d.pick([2, 3]), t = b === 2 ? d.pick([6, 8]) : 6, half = t / 2;
      const sameOnes = d.shuffle([
        `(${b}^${half})^2`, `${b}^${half}*${b}^${half}`, `${b}^${t + 3}:${b}^3`, `${b}^2*${b}^${t - 2}`,
        b === 2 ? Array.from({ length: 4 }, () => `2^${t - 2}`).join('+') : Array.from({ length: 3 }, () => `3^${t - 1}`).join('+'), `${b}^${t / 2 + 1}*${b}^${t / 2 + 1}:${b}^2`
      ]).slice(0, 3);
      const odd = d.pick([`(${b}^${half})^${half}`, `${b}^${half}+${b}^${half}`, `${b}^${2 * t}:${b}^2`, `${b}^2*${b}^${half}`]), rows = d.shuffle(sameOnes.concat([odd]));
      return C('다음 중 계산 결과가 나머지 셋과 다른 하나는?', rows.map(xh), rows.indexOf(odd), {
        explain: `${xh(odd)}만 ${nb(b + sup(t))}과 다르다. 나머지 셋은 모두 ${nb(b + sup(t))}이다. 덧셈은 지수를 더하지 않고, 곱셈은 지수를 더하며, 거듭제곱의 거듭제곱은 지수를 곱한다.`,
        facts: { choose: { exprs: rows.map(numJs), rule: 'odd' }, rule: 'odd-num' }
      });
    }),
    T('expo-sum-given', '지수의 합이 주어진 두 거듭제곱의 곱', '②23', (d) => {
      const b = d.pick([2, 3, 5]), s = d.int(3, b === 2 ? 6 : b === 3 ? 5 : 4);
      return N(`${nb(`${V('x')} + ${V('y')} = ${s}`)}이고 ${nb(`${V('a')} = ${b}${sup(V('x'))}`)}, ${nb(`${V('b')} = ${b}${sup(V('y'))}`)}일 때, ${nb(V('a') + V('b'))}의 값은?`, b ** s, {
        signed: true, explain: `${nb(V('a') + V('b'))} = ${nb(b + sup(V('x')))} × ${nb(b + sup(V('y')))} = ${nb(b + sup(`${V('x')} + ${V('y')}`))} = ${nb(b + sup(s))} = ${b ** s}이다.`,
        facts: { calc: [[`${b}**${s}`, 0]] }
      });
    }),
    T('expo-growth', '일정한 시간마다 몇 배가 되는 수를 거듭제곱으로 나타내기', '②27', (d) => {
      const b = d.pick([2, 3, 4]), m = d.pick([10, 15, 20, 30]), h = d.int(2, 5), per = 60 / m, k = per * h + 1;
      return boxN(`어떤 세균은 ${m}분마다 그 수가 ${b}배가 된다. 이 세균 ${b}마리가 ${h}시간 후에 ${nb(b + sup(V('k')))}마리가 된다고 할 때, 자연수 ${V('k')}의 값은?`, k, undefined, `60/${m}*${h}+1`,
        `1시간은 ${m}분의 ${per}배이므로 1시간마다 ${nb(b + sup(per))}배가 되고, ${h}시간 후에는 ${nb(`(${b}${sup(per)})${sup(h)}`)} = ${nb(b + sup(per * h))}배가 된다. 처음에 ${b}마리였으므로 ${b} × ${nb(b + sup(per * h))} = ${nb(b + sup(k))}마리이다.`, { unseen: [60, 1] });
    }),
    T('expo-units', '2의 거듭제곱으로 나타낸 단위의 환산', '②28', (d) => {
      const e = d.int(4, 7), amount = 2 ** e, big = d.bool();
      // 1 B = 2³ bit, 1 KiB = 2¹⁰ B, 1 MiB = 2¹⁰ KiB
      if (big) {
        return boxN(`컴퓨터의 저장 용량을 나타내는 단위에 바이트(B), 키비바이트(KiB), 메비바이트(MiB)가 있다. 1 KiB는 ${nb('2' + sup(10))} B이고 1 MiB는 ${nb('2' + sup(10))} KiB이다. ${amount} MiB가 ${nb('2' + sup(V('k')))} B일 때, 자연수 ${V('k')}의 값은?`, e + 20, undefined, `${e}+10+10`,
          `${amount} = ${nb('2' + sup(e))}이므로 ${amount} MiB = ${nb('2' + sup(e))} × ${nb('2' + sup(10))} KiB = ${nb('2' + sup(e))} × ${nb('2' + sup(10))} × ${nb('2' + sup(10))} B = ${nb('2' + sup(e + 20))} B이다.`, { rule: 'expo-units-mib', unseen: [e] });
      }
      return boxN(`컴퓨터의 저장 용량을 나타내는 단위에 비트(bit), 바이트(B), 키비바이트(KiB)가 있다. 1 B는 ${nb('2' + sup(3))} bit이고 1 KiB는 ${nb('2' + sup(10))} B이다. ${amount} KiB가 ${nb('2' + sup(V('k')))} bit일 때, 자연수 ${V('k')}의 값은?`, e + 13, undefined, `${e}+10+3`,
        `${amount} = ${nb('2' + sup(e))}이므로 ${amount} KiB = ${nb('2' + sup(e))} × ${nb('2' + sup(10))} B = ${nb('2' + sup(e))} × ${nb('2' + sup(10))} × ${nb('2' + sup(3))} bit = ${nb('2' + sup(e + 13))} bit이다.`, { rule: 'expo-units-kib', unseen: [e] });
    })
  ];

  // ── 단항식의 곱셈과 나눗셈 ──
  const RULE_MONO = '계수는 계수끼리, 문자는 문자끼리 계산한다.', RULE_RECIP = '나눗셈은 나누는 식의 역수를 곱하여 계산한다.';
  const BOX_EXPR = '다음 식의 □ 안에 알맞은 식을 구하시오.';
  // 값이 하나의 항인 식 글인가(계수의 분모가 작고 0이 아니다)
  const oneTerm = (src) => { try { const P = xv(src); return P.length === 1 && P[0].q.q <= 12 && Math.abs(P[0].q.p) <= 300; } catch (_) { return false; } };
  const inv = (P) => mk(qdiv(Q(1), P[0].q), Object.fromEntries(Object.keys(P[0].e).map((k) => [k, -P[0].e[k]])));
  const flip = (P) => mk(qneg(P[0].q), P[0].e);
  // 이웃한 두 칸의 식을 곱하여 그 아래 칸에 적는 그림(윗줄 3칸, 가운뎃줄 2칸, 아랫줄 1칸). 칸에는 화면 글을 적는다.
  const pyrCell = (h) => `<span style="display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;width:86px;height:42px;margin:0 3px;border:1.5px solid #1f2933;border-radius:6px;background:#fff;font-size:1.02rem;font-weight:600">${h}</span>`;
  const pyrFig = (rows) => '<div style="display:inline-grid;gap:7px">' + rows.map((row) => '<div style="display:flex;justify-content:center">' + row.map(pyrCell).join('') + '</div>').join('') + '</div>';
  const monoTypes = [
    T('mono-mul', '단항식의 곱셈', '①31 ②31', (d, n) => {
      const [a, b] = pair(d);
      if (n === 0) {
        const [c1, c2] = d.until(() => [nz(d, -9, 9), nz(d, -9, 9)], ([x, y]) => (x < 0 || y < 0) && Math.abs(x) > 1 && Math.abs(y) > 1), [p, q, r, s] = d.until(() => [d.int(1, 4), d.int(0, 3), d.int(0, 3), d.int(1, 4)], ([, q1, r1]) => q1 + r1 > 0);
        const src = `${ms(c1, [[a, p], [b, q]])}*${pa(ms(c2, [[a, r], [b, s]]))}`;
        return monoQ(CALC, src, [a, b], { rule: 'mono-mul-int', explain: `${RULE_MONO} ${xh(src)} = ${nb(`${tx(Q(c1))} × ${c2 < 0 ? '(' + tx(Q(c2)) + ')' : c2}`)} × ${pt(mk(1, { [a]: p + r, [b]: q + s }))} = ${pt(xv(src))}이다.` });
      }
      // 계수가 분수인 단항식을 곱한다.
      const m = d.pick([2, 3, 4, 5]), k = co(d, m, 1, 4), t = nz(d, -4, 4), [p, q, r, s] = [d.int(1, 3), d.int(0, 2), d.int(1, 3), d.int(1, 3)], neg = d.bool();
      const src = `${ms(m * t, [[a, p], [b, q]])}*${pa(ms(Q(neg ? -k : k, m), [[a, r], [b, s]]))}`;
      return monoQ(CALC, src, [a, b], { rule: 'mono-mul-frac', explain: `${RULE_MONO} ${told(src)}이다.` });
    }, { count: 2 }),
    T('mono-mul-pow', '거듭제곱이 있는 단항식의 곱셈', '①32·33 ②32 심29', (d, n) => {
      const [a, b] = pair(d);
      if (n === 0) {
        // (c1 a^p b^q)² × (c2 a^r b^s)³
        const c1 = d.int(2, 4) * pm(d), c2 = d.pick([-1, -2, -1, 2]), [p, q, r, s] = d.until(() => [d.int(1, 3), d.int(1, 3), d.int(1, 2), d.int(1, 2)], ([p1, q1, r1, s1]) => p1 !== r1 || q1 !== s1), src = `(${ms(c1, [[a, p], [b, q]])})^2*(${ms(c2, [[a, r], [b, s]])})^3`;
        return monoQ(CALC, src, [a, b], { rule: 'mono-mul-pow', explain: `거듭제곱을 먼저 계산한 다음 곱한다. ${told(src)}이다.` });
      }
      // 계수가 분수인 단항식의 제곱이 낀 곱
      const m = d.pick([2, 3]), k = d.until(() => d.int(1, 5), (x) => gcd(x, m) === 1), t = nz(d, -3, 3), [p, q, r, s] = [d.int(1, 3), d.int(1, 3), d.int(0, 3), d.int(1, 3)];
      const src = `(-${ms(Q(k, m), [[a, p], [b, q]])})^2*${pa(ms(m * m * t, [[a, r], [b, s]]))}`;
      return monoQ(CALC, src, [a, b], { rule: 'mono-mul-pow-frac', explain: `거듭제곱을 먼저 계산한 다음 곱한다. 계수 ${tx(Q(-k, m))}도 제곱한다. ${told(src)}이다.` });
    }, { count: 2 }),
    T('mono-mul-three', '세 단항식의 곱셈', '①32', (d) => {
      const a = one(d), [c1, c2, c3] = [nz(d, -3, 3), d.pick([2, 3]) * pm(d), d.pick([2, 3]) * pm(d)], [p, q] = [d.int(1, 4), d.int(1, 3)], src = `${ms(c1, [[a, p]])}*(${ms(c2, [[a, q]])})^3*(${ms(c3, [[a, 1]])})^2`;
      return monoQ(CALC, src, [a], { rule: 'mono-mul-three', explain: `거듭제곱을 먼저 계산한 다음 곱한다. ${told(src)}이다.` });
    }),
    T('mono-div', '단항식의 나눗셈', '①34 ②33', (d, n) => {
      const [a, b] = pair(d);
      if (n === 0) {
        const [cq, cd] = d.until(() => [nz(d, -9, 9), nz(d, -9, 9)], ([x, y]) => Math.abs(y) > 1 && (x < 0 || y < 0)), [e1, e2, f1, f2] = [d.int(1, 3), d.int(1, 3), d.int(1, 3), d.int(1, 3)];
        const src = `${ms(cq * cd, [[a, e1 + f1], [b, e2 + f2]])}:${pa(ms(cd, [[a, f1], [b, f2]]))}`;
        return monoQ(CALC, src, [a, b], { rule: 'mono-div-int', explain: `${RULE_MONO} ${xh(src)} = ${frac(fpart(htmlX(ms(cq * cd, [[a, e1 + f1], [b, e2 + f2]]))), fpart(htmlX(ms(cd, [[a, f1], [b, f2]]))))} = ${pt(xv(src))}이다.` });
      }
      // 나누어지는 식에 거듭제곱이 있다.
      const [c, k, cd, p, q, r, s] = d.until(() => [d.int(2, 4), d.pick([2, 3]), nz(d, -16, 16), d.int(1, 3), d.int(1, 2), d.int(1, 4), d.int(1, 3)], (t) => Math.abs(t[2]) > 1 && (t[0] ** t[1]) % t[2] === 0 && Math.abs(t[2]) !== t[0] ** t[1] && t[3] * t[1] > t[5] && t[4] * t[1] > t[6]);
      const src = `(${ms(c, [[a, p], [b, q]])})^${k}:${pa(ms(cd, [[a, r], [b, s]]))}`;
      return monoQ(CALC, src, [a, b], { rule: 'mono-div-pow', explain: `거듭제곱을 먼저 계산한 다음 나눈다. ${told(src)}이다.` });
    }, { count: 2 }),
    T('mono-div-fraccoef', '계수가 분수인 단항식으로 나누기', '①34 ②34', (d) => {
      const [a, b] = pair(d), n = d.pick([2, 3, 4, 5]), m = co(d, n, 1, 5), t = nz(d, -4, 4), [p, q, r, s] = [d.int(1, 3), d.int(1, 3), d.int(1, 3), d.int(1, 3)], neg = d.bool();
      const top = ms(m * t, [[a, p + r], [b, q + s]]), bot = ms(Q(neg ? -m : m, n), [[a, r], [b, s]]), src = `${top}:${pa(bot)}`, R = xv(bot);
      return monoQ(CALC, src, [a, b], { rule: 'mono-div-fraccoef', explain: `${RULE_RECIP} ${xh(bot)} = ${neg ? MINUS : ''}${frac(fpart(htmlX(ms(m, [[a, r], [b, s]]))), n)}의 역수는 ${pt(inv(R))}이다. ${xh(src)} = ${xh(top)} × ${neg ? '(' + pt(inv(R)) + ')' : pt(inv(R))} = ${pt(xv(src))}이다.` });
    }),
    T('mono-div-fracres', '몫이 분수 꼴이 되는 단항식의 나눗셈', '①34 ②35', (d, n) => {
      const [a, b] = pair(d);
      if (n === 0) {
        // 계수는 나누어떨어지고 한 문자가 분모에 남는다. 틀린 보기: 분모로 보내지 않음 / 통째로 뒤집음 / 지수를 더해 분모에 / 다른 문자를 분모로
        const cd = d.int(2, 6), k = d.int(2, 6), [p, r, q, s] = d.until(() => [d.int(2, 5), d.int(1, 4), d.int(1, 3), d.int(2, 6)], ([p1, r1, q1, s1]) => p1 > r1 && s1 > q1), sg = pm(d);
        const src = `${ms(sg * cd * k, [[a, p], [b, q]])}:${ms(cd, [[a, r], [b, s]])}`, R = xv(src);
        return pickQ(d, CALC_PICK, R, [mk(sg * k, { [a]: p - r, [b]: s - q }), mk(Q(sg, k), { [a]: r - p, [b]: s - q }), mk(sg * k, { [a]: p - r, [b]: -(s + q) }), mk(sg * k, { [a]: r - p, [b]: s - q })], {
          figure: xex(src), rule: 'mono-div-fracres', explain: `${RULE_MONO} ${V(b)}는 나누는 식의 지수가 더 크므로 분모에 남는다. ${xh(src)} = ${pt(R)}이다.`
        });
      }
      // 계수도 분수가 된다. 틀린 보기: 부호를 놓침 / 계수를 뒤집음 / 문자를 뒤집음 / 계수를 약분하지 않고 뺌
      const [c1, c2] = d.until(() => [d.int(2, 9), d.int(2, 9)], ([x, y]) => x % y !== 0 && y % x !== 0 && gcd(x, y) > 1), [p, r, q, s] = d.until(() => [d.int(1, 4), d.int(2, 6), d.int(2, 6), d.int(1, 4)], ([p1, r1, q1, s1]) => r1 > p1 && q1 > s1);
      const src = `${ms(c1, [[a, p], [b, q]])}:(${ms(-c2, [[a, r], [b, s]])})`, R = xv(src), t = R[0];
      return pickQ(d, CALC_PICK, R, [flip(R), mk(qdiv(Q(1), t.q), t.e), mk(t.q, { [a]: -t.e[a], [b]: -t.e[b] }), mk(Q(-(c1 - c2 || 1)), t.e), mk(qneg(t.q), { [a]: -t.e[a], [b]: -t.e[b] })], {
        figure: xex(src), rule: 'mono-div-fracres-coef', explain: `${RULE_MONO} 계수는 ${c1} ÷ (−${c2}) = ${tx(t.q)}이고, ${V(a)}는 나누는 식의 지수가 더 크므로 분모에 남는다. ${xh(src)} = ${pt(R)}이다.`
      });
    }, { count: 2 }),
    T('mono-div-chain', '나눗셈을 연달아 하는 단항식의 계산', '①35 ②38', (d) => {
      // A² ÷ B ÷ C: 앞에서부터 차례로 나눈다. 틀린 보기: 뒤의 나눗셈부터 계산 / 부호를 놓침 / 통째로 뒤집음 / 마지막 식을 곱함
      const [a, b] = pair(d);
      const [A, Bm, Cm] = d.until(() => {
        const [c1, c2, c3] = [d.int(2, 6), d.pick([2, 3, 4, 6, 9]), d.pick([2, 3, 4]) * pm(d)], [p, q, r, s, t, u] = [d.int(1, 3), d.int(1, 2), d.int(1, 3), d.int(1, 3), d.int(1, 3), d.int(1, 3)];
        return [`(${ms(c1, [[a, p], [b, q]])})^2`, ms(c2, [[a, r], [b, s]]), pa(ms(c3, [[a, t], [b, u]]))];
      }, ([x, y, z]) => oneTerm(`${x}:${y}:${z}`) && !same(xv(`${x}:${y}:${z}`), xv(`${x}:(${y}:${z})`)) && letters(xv(`${x}:${y}:${z}`)[0]).length >= 1 && xv(`${x}:${y}:${z}`)[0].q.q <= 9 && Object.values(xv(`${x}:${y}:${z}`)[0].e).some((e) => e < 0));
      const src = `${A}:${Bm}:${Cm}`, R = xv(src);
      return pickQ(d, CALC_PICK, R, [xv(`${A}:(${Bm}:${Cm})`), flip(R), inv(R), xv(`${A}:${Bm}*${Cm}`), flip(inv(R)), mk(R[0].q, Object.fromEntries(Object.keys(R[0].e).map((k) => [k, -R[0].e[k]])))], {
        figure: xex(src), rule: 'mono-div-chain', explain: `거듭제곱을 먼저 계산하고, 앞에서부터 차례로 나눈다. ${told(src)}이다.`
      });
    }),
    T('mono-muldiv', '단항식의 곱셈과 나눗셈이 섞인 계산', '①36 ②38', (d, n) => {
      const [a, b] = pair(d);
      if (n === 0) {
        // A × B^k ÷ C
        const src = d.until(() => {
          const [c1, c2, c3] = [nz(d, -4, 4), d.pick([-3, -2, 2, 3]), d.pick([2, 3, 4, 6, 8])], k = d.pick([2, 3]), [p, q, r, s, t, u] = [d.int(1, 3), d.int(0, 2), d.int(1, 3), d.int(1, 3), d.int(1, 4), d.int(1, 6)];
          return `${ms(c1, [[a, p], [b, q]])}*(${ms(c2, [[a, r], [b, s]])})^${k}:${ms(c3, [[a, t], [b, u]])}`;
        }, (x) => monoOK(x, [a, b]) && Math.abs(xv(x)[0].q.p) <= 99 && Math.abs(xv(x)[0].q.p) > 1);
        return monoQ(CALC, src, [a, b], { rule: 'mono-muldiv-pow', explain: `거듭제곱을 먼저 계산하고, 앞에서부터 차례로 계산한다. ${told(src)}이다.` });
      }
      // A ÷ B × C²: 나눗셈이 앞에 있다(뒤의 곱셈부터 계산하지 않는다).
      const src = d.until(() => {
        const [c1, c2, c3] = [d.pick([4, 6, 8, 9, 12]) * pm(d), d.pick([2, 3, 4, 6]), d.pick([-3, -2, 2, 3])], [p, q, r, s, t, u] = [d.int(2, 4), d.int(2, 4), d.int(1, 4), d.int(1, 4), d.int(1, 2), d.int(1, 2)];
        return `${ms(c1, [[a, p], [b, q]])}:${ms(c2, [[a, r], [b, s]])}*(${ms(c3, [[a, t], [b, u]])})^2`;
      }, (x) => monoOK(x, [a, b]) && Math.abs(xv(x)[0].q.p) <= 99);
      return monoQ(CALC, src, [a, b], { rule: 'mono-muldiv-order', explain: `거듭제곱을 먼저 계산하고, 곱셈과 나눗셈은 앞에서부터 차례로 계산한다. ${told(src)}이다.` });
    }, { count: 2 }),
    T('mono-muldiv-vanish', '문자가 약분되거나 분모에 남는 곱셈과 나눗셈의 혼합 계산', '①36 ②38', (d, n) => {
      const [a, b] = pair(d);
      const gen = (ok) => d.until(() => {
        const [c1, c2, c3] = [d.pick([2, 3, 4, 5, 6, 12]) * pm(d), d.pick([2, 3, 4, 5, 6]), d.pick([2, 3, 5, 9]) * pm(d)], [p, q, r, s, t, u] = [d.int(1, 3), d.int(0, 2), d.int(1, 3), d.int(1, 3), d.int(1, 2), d.int(1, 3)];
        return [ms(c1, [[a, p], [b, q]]), ms(c2, [[a, r], [b, s]]), pa(ms(c3, [[a, t], [b, u]]))];
      }, ([x, y, z]) => { const s = `${x}:${y}*${z}`; if (!oneTerm(s)) return false; const t = xv(s)[0]; return isInt(t.q) && Math.abs(t.q.p) > 1 && ok(t) && !same(xv(s), xv(`${x}:(${y}*${z})`)); });
      if (n === 0) {
        // 한 문자가 약분되어 사라진다. 틀린 보기: 사라진 문자를 남김 / 뒤의 곱셈부터 계산 / 부호를 놓침 / 남은 문자를 분모로
        const [A, Bm, Cm] = gen((t) => t.e[a] === 0 && t.e[b] >= 1), src = `${A}:${Bm}*${Cm}`, R = xv(src), t = R[0];
        return pickQ(d, CALC_PICK, R, [mk(t.q, { [a]: 1, [b]: t.e[b] }), xv(`${A}:(${Bm}*${Cm})`), flip(R), mk(t.q, { [b]: -t.e[b] })], {
          figure: xex(src), rule: 'mono-muldiv-vanish', explain: `앞에서부터 차례로 계산한다. ${told(src)}이다. ${V(a)}는 약분되어 사라진다.`
        });
      }
      // 한 문자가 분모에 남는다. 틀린 보기: 뒤의 곱셈부터 계산 / 분모의 문자를 분자로 / 부호를 놓침 / 통째로 뒤집음
      const [A, Bm, Cm] = gen((t) => t.e[a] >= 1 && t.e[b] < 0), src = `${A}:${Bm}*${Cm}`, R = xv(src), t = R[0];
      return pickQ(d, CALC_PICK, R, [xv(`${A}:(${Bm}*${Cm})`), mk(t.q, { [a]: t.e[a], [b]: -t.e[b] }), flip(R), inv(R)], {
        figure: xex(src), rule: 'mono-muldiv-fracres', explain: `앞에서부터 차례로 계산한다. ${told(src)}이다. ${V(b)}는 분모에 남는다.`
      });
    }, { count: 2 }),
    T('mono-muldiv-frac', '계수가 분수인 단항식이 있는 곱셈과 나눗셈의 혼합 계산', '①36 ②38', (d) => {
      // A × B² ÷ (−(1/n)ab)²
      const [a, b] = pair(d), src = d.until(() => {
        const [c1, c2] = [nz(d, -4, 4), d.pick([-3, -2, 2, 3])], m = d.pick([2, 3]), [p, q, r, s, t] = [d.int(1, 3), d.int(1, 2), d.int(1, 3), d.int(1, 2), d.int(1, 2)];
        return `${ms(c1, [[a, p], [b, q]])}*(${ms(c2, [[a, r], [b, s]])})^2:(-${ms(Q(1, m), [[a, t], [b, 1]])})^2`;
      }, (x) => monoOK(x, [a, b]) && Math.abs(xv(x)[0].q.p) <= 300);
      return monoQ(CALC, src, [a, b], { rule: 'mono-muldiv-frac', explain: `거듭제곱을 먼저 계산한다. ${RULE_RECIP} ${told(src)}이다.` });
    }),
    T('mono-paren-div', '괄호 안의 나눗셈을 먼저 하는 단항식의 계산', '①37', (d) => {
      // A ÷ (B ÷ C): 괄호 안의 몫은 계수가 분수이어도 되지만 분모에 문자가 남지 않게 한다.
      const [a, b] = pair(d), brace = d.bool();
      const [A, inner] = d.until(() => {
        const [c1, c2, c3] = [d.pick([12, 18, 24, 36]), d.pick([4, 6, 9, 12, 18]) * pm(d), d.pick([2, 3, 4])], [p, q, r, s, t, u] = [d.int(2, 4), d.int(2, 4), d.int(2, 4), d.int(1, 3), d.int(1, 3), d.int(1, 3)];
        return [ms(c1, [[a, p], [b, q]]), `${ms(c2, [[a, r], [b, s]])}:${ms(c3, [[a, t], [b, u]])}`];
      }, ([x, y]) => { const I = xv(y)[0]; return [a, b].every((k) => (I.e[k] || 0) >= 0) && letters(I).length >= 1 && I.q.q <= 4 && monoOK(`${x}:(${y})`, [a, b]) && Math.abs(xv(`${x}:(${y})`)[0].q.p) > 1 && Math.abs(xv(`${x}:(${y})`)[0].q.p) <= 99 && !same(xv(x), xv(y.split(':')[0])); });
      const src = `${A}:${brace ? '{' : '('}${inner}${brace ? '}' : ')'}`;
      return monoQ(CALC, src, [a, b], { rule: 'mono-paren-div', explain: `괄호 안의 나눗셈을 먼저 계산한다. ${told(src)}이다.` });
    }),
    T('mono-claims', '단항식의 곱셈과 나눗셈이 옳은 것과 옳지 않은 것', '①39 ②39 심27', (d, n) => {
      const [a, b] = pair(d);
      if (n === 0) {
        const [p, q] = d.until(() => [d.int(2, 4), d.int(2, 3)], ([x, y]) => x + y !== x * y);
        return eqQ(d, '다음 중 옳지 않은 것은?', [
          [`3${a}^${p}*(-2${a}^${q})`, mk(-6, { [a]: p * q }), '곱셈에서 지수는 더한다.'],
          [`(-4${a}^2)^2:2${a}^4`, mk(-8, {}), `${nb('(−4)' + sup(2))} = 16이다.`],
          [`(-2${a}^2${b}^5):(${a}${b})^2`, mk(-2, { [a]: 1, [b]: 3 }), `${V(a)}는 약분되어 사라진다.`],
          [`(6${a}^2${b}^3)^2:(-3${a}${b}^2)^3`, mk(-4, { [a]: 1 }), `계수는 36 ÷ (−27) = ${tx(Q(-4, 3))}이다.`],
          [`2${a}^2${b}*(-3${a}${b}^2)`, mk(-6, { [a]: 2, [b]: 2 }), '곱셈에서 지수는 더한다.'],
          [`12${a}^${p + 2}${b}:4${a}${b}`, mk(3, { [a]: p + 2 }), '나눗셈에서 지수는 뺀다.']
        ], false, { rule: 'mono-claims-false' });
      }
      const p = d.int(2, 3);
      return eqQ(d, '다음 중 옳은 것은?', [
        [`-${a}${b}*(4${a}${b})^2`, mk(-8, { [a]: 3, [b]: 3 })], [`-4${a}${b}^3:2${a}${b}^4`, mk(-2, { [b]: 1 })], [`(2${a}^2${b})^3:(-${a}${b}^2)^2:(-5${a}^3)`, mk(Q(8, 5), { [a]: 1, [b]: -1 })],
        [`${a}^${p}${b}:[1|2]${a}${b}`, mk(Q(1, 2), { [a]: p - 1 })], [`3${a}*(-2${b})^3`, mk(-18, { [a]: 1, [b]: 3 })], [`(-3${a}^2)^2*2${a}`, mk(-18, { [a]: 5 })]
      ], true, { rule: 'mono-claims-true' });
    }, { count: 2 }),
    T('mono-find-abc', '곱셈과 나눗셈이 섞인 식에서 지수와 계수 구하기', '①40 ②40 심30', (d) => {
      // x^p y^q × (−k x^r y^A)^n ÷ m x^B y = C x^u y^w: y의 지수에서 A, x의 지수에서 B, 계수에서 C를 구한다.
      const [a, b] = ['x', 'y'], n = d.pick([2, 3]), k = n === 2 ? d.pick([2, 3, 4, 6]) : 2, m = d.pick(n === 2 ? (k === 3 ? [3, 9] : k === 6 ? [2, 3, 4, 9, 12] : [2, 4]) : [2, 4]);
      const [p, q, r, A, Bv] = d.until(() => [d.int(1, 4), d.int(1, 4), d.int(1, 3), d.int(2, 4), d.int(2, 6)], ([p1, , r1, , B1]) => p1 + n * r1 - B1 >= 1), u = p + n * r - Bv, w = q + n * A - 1, Cv = (-k) ** n / m;
      return slots(`다음 식을 만족시키는 자연수 ${V('A')}, ${V('B')}와 수 ${V('C')}의 값은?`, [[eqLabel('A'), A, `(${w}-${q}+1)/${n}`], [eqLabel('B'), Bv, `${p}+${n}*${r}-${u}`], [eqLabel('C'), Cv, `(-${k})**${n}/${m}`, true]], {
        figure: eqx(`${vs([[a, p], [b, q]])}*(-${k}${vs([[a, r]])}${b}^A)^${n}:${m}${a}^B${b}`, `C${vs([[a, u], [b, w]])}`), unseen: [1],
        explain: `${V(b)}의 지수에서 ${q} + ${n} × ${V('A')} − 1 = ${w}이므로 ${V('A')} = ${A}이다. ${V(a)}의 지수에서 ${p} + ${n * r} − ${V('B')} = ${u}이므로 ${V('B')} = ${Bv}이다. 계수에서 ${V('C')} = ${nb(`(−${k})${sup(n)}`)} ÷ ${m} = ${tx(Q(Cv))}이다.`
      });
    }),
    T('mono-two-div', '두 식을 각각 계산한 다음 나누기', '①41 ②43 심38', (d) => {
      // A는 곱셈, B는 나눗셈으로 주어진다. 틀린 보기: B ÷ A / A × B / 부호를 놓침 / 문자를 약분하지 않음
      const [a, b] = pair(d);
      const [sa, sb] = d.until(() => {
        const [c1, c2, c3, c4] = [d.pick([2, 3, 4, 6]), d.pick([2, 3, 4]) * pm(d), d.pick([4, 6, 8, 9, 12]) * pm(d), d.pick([2, 3, 4])], [p, q, r, s, t, u, v, w] = [d.int(1, 3), d.int(1, 3), d.int(1, 2), d.int(1, 2), d.int(2, 5), d.int(2, 5), d.int(1, 3), d.int(1, 3)];
        return [`${ms(c1, [[a, p], [b, q]])}*${pa(ms(c2, [[a, r], [b, s]]))}`, `${ms(c3, [[a, t], [b, u]])}:${ms(c4, [[a, v], [b, w]])}`];
      }, ([x, y]) => { if (!oneTerm(x) || !oneTerm(y) || !isInt(xv(y)[0].q) || !oneTerm(`(${x}):(${y})`)) return false; const t = xv(`(${x}):(${y})`)[0]; return t.q.q <= 9 && Math.abs(t.q.p) <= 30 && letters(t).length >= 1 && (t.q.q > 1 || [a, b].some((k) => (t.e[k] || 0) <= 0)); });
      const A = xv(sa), Bp = xv(sb), R = pDiv(A, Bp);
      return pickQ(d, `다음 두 식 ${V('A')}, ${V('B')}에 대하여 ${nb(`${V('A')} ÷ ${V('B')}`)}를 계산한 것은?`, R, [pDiv(Bp, A), pMul(A, Bp), flip(R), mk(R[0].q, Object.fromEntries([a, b].map((k) => [k, -(R[0].e[k] || 0)])))], {
        figure: named([['A', sa], ['B', sb]]),
        explain: `${V('A')} = ${pt(A)}, ${V('B')} = ${pt(Bp)}이므로 ${nb(`${V('A')} ÷ ${V('B')}`)} = ${pt(A)} ÷ ${Bp[0].q.p < 0 ? '(' + pt(Bp) + ')' : pt(Bp)} = ${pt(R)}이다.`
      });
    }),
    T('mono-box-one', '□ 안에 알맞은 단항식(계산 한 번)', '①42·45 ②41 심35', (d, n) => {
      const [a, b] = pair(d);
      // 두 단항식 P, Qm 과 그 곱 P × Qm
      const [cP, cQ] = d.until(() => [nz(d, -6, 6), nz(d, -6, 6)], ([x, y]) => Math.abs(x) > 1 && Math.abs(y) > 1 && (x < 0 || y < 0) && Math.abs(x) !== Math.abs(y)), [p, q, r, s] = d.until(() => [d.int(1, 3), d.int(0, 3), d.int(0, 3), d.int(1, 3)], ([p1, q1, r1, s1]) => q1 + r1 >= 1 && (p1 !== r1 || q1 !== s1));
      const P = ms(cP, [[a, p], [b, q + (n === 0 ? 0 : 1)]]), Qm = ms(cQ, [[a, r + (n === 0 ? 0 : 1)], [b, s]]), PQ = srcOf(xv(`${pa(P)}*${pa(Qm)}`));
      if (n === 0) {
        // 어떤 식 ÷ P = Qm → 어떤 식 = P × Qm
        return monoQ(`어떤 식을 ${xj(P, '으로/로')} 나누었더니 ${xj(Qm, '이/가')} 되었다. 어떤 식을 구하시오.`, `${pa(Qm)}*${pa(P)}`, [a, b], {
          figure: null, rule: 'mono-box-origin', explain: `(어떤 식) ÷ ${cP < 0 ? '(' + xh(P) + ')' : xh(P)} = ${xh(Qm)}이므로 어떤 식은 ${xh(`${pa(Qm)}*${pa(P)}`)} = ${xh(PQ)}이다.`
        });
      }
      if (n === 1) {
        // P × □ = PQ → □ = PQ ÷ P
        return monoQ(BOX_EXPR, `${PQ}:${pa(P)}`, [a, b], { figure: eqx(`${pa(P)}*?`, PQ), rule: 'mono-box-mul', explain: `□ = ${xh(`${pa(PQ)}:${pa(P)}`)} = ${xh(Qm)}이다.` });
      }
      // PQ ÷ □ = P → □ = PQ ÷ P (나누는 자리)
      return monoQ(BOX_EXPR, `${PQ}:${pa(P)}`, [a, b], { figure: eqx(`${PQ}:?`, P), rule: 'mono-box-div', explain: `나누어지는 식을 몫으로 나누면 나누는 식이 된다. □ = ${xh(`${pa(PQ)}:${pa(P)}`)} = ${xh(Qm)}이다.` });
    }, { count: 3 }),
    T('mono-box-chain', '세 단항식의 곱에서 □ 안에 알맞은 단항식', '②42', (d) => {
      // A × B × □ = C → □ = C ÷ (A × B)
      const [a, b] = pair(d), [c1, c2, c3] = d.until(() => [nz(d, -5, 5), d.int(2, 4), nz(d, -4, 4)], ([x, , z]) => Math.abs(x) > 1 && Math.abs(z) > 1), [p, q, r, s, t] = [d.int(1, 2), d.int(1, 2), d.int(1, 3), d.int(1, 2), d.int(1, 3)];
      const A = ms(c1, [[a, p], [b, q]]), Bm = ms(c2, [[a, r]]), Xs = ms(c3, [[a, s], [b, t]]), Cs = srcOf(xv(`${pa(A)}*${Bm}*${pa(Xs)}`)), AB = srcOf(xv(`${pa(A)}*${Bm}`));
      return monoQ(BOX_EXPR, `${pa(Cs)}:(${pa(A)}*${Bm})`, [a, b], { figure: eqx(`${A}*${Bm}*?`, Cs), explain: `${xh(`${A}*${Bm}`)} = ${xh(AB)}이므로 ${xh(AB)} × □ = ${xh(Cs)}이다. □ = ${xh(`${pa(Cs)}:${pa(AB)}`)} = ${xh(Xs)}이다.` });
    }),
    T('mono-area', '도형의 넓이를 단항식으로 나타내기', '①47 ②46', (d, n) => {
      const [a, b] = pair(d), [c1, c2] = [2 * d.int(1, 4), d.int(2, 5)], [p, q, r, s] = [d.int(1, 3), d.int(1, 3), d.int(1, 3), d.int(1, 4)], A = ms(c1, [[a, p], [b, q]]), Bm = ms(c2, [[a, r], [b, s]]);
      if (n === 0) return monoQ(`밑변의 길이가 ${xh(A)}, 높이가 ${xh(Bm)}인 삼각형의 넓이를 구하시오.`, `[1|2]*${A}*${Bm}`, [a, b], { figure: triFig(A, Bm), rule: 'mono-area-tri', unseen: [2], explain: `(삼각형의 넓이) = ${frac(1, 2)} × (밑변의 길이) × (높이)이므로 ${frac(1, 2)} × ${xh(A)} × ${xh(Bm)} = ${pt(xv(`[1|2]*${A}*${Bm}`))}이다.` });
      return monoQ(`밑변의 길이가 ${xh(A)}, 높이가 ${xh(Bm)}인 평행사변형의 넓이를 구하시오.`, `${A}*${Bm}`, [a, b], { figure: paraFig(A, Bm), rule: 'mono-area-para', explain: `(평행사변형의 넓이) = (밑변의 길이) × (높이)이므로 ${xh(`${A}*${Bm}`)} = ${pt(xv(`${A}*${Bm}`))}이다.` });
    }, { count: 2 }),
    T('mono-side', '넓이·부피가 단항식인 도형의 변의 길이와 높이', '①48 ②47 심40', (d, n) => {
      const [a, b] = pair(d);
      if (n === 0) {
        const [c1, c2] = [d.int(2, 6), d.int(2, 9)], [p, q, r, s] = [d.int(1, 3), d.int(1, 3), d.int(1, 3), d.int(1, 3)], W = ms(c1, [[a, p], [b, q]]), S = ms(c1 * c2, [[a, p + r], [b, q + s]]);
        return monoQ(`가로의 길이가 ${xh(W)}이고 넓이가 ${xh(S)}인 직사각형의 세로의 길이를 구하시오.`, `${S}:${W}`, [a, b], { figure: rectFig(W, null, S), rule: 'mono-side-rect', explain: `(세로의 길이) = (넓이) ÷ (가로의 길이)이므로 ${xh(`${S}:${W}`)} = ${pt(xv(`${S}:${W}`))}이다.` });
      }
      // 직육면체: 밑면의 가로와 세로를 곱한 밑넓이로 부피를 나눈다.
      const [c1, c2, c3] = [d.int(2, 4), d.int(2, 4), d.int(2, 6)], [p, q, r, s, t] = [d.int(1, 3), d.int(0, 2), d.int(1, 2), d.int(1, 3), d.int(1, 3)], W = ms(c1, [[a, p], [b, q]]), L = ms(c2, [[a, r]]), Hs = ms(c3, [[a, s], [b, t]]), Vs = srcOf(xv(`${W}*${L}*${Hs}`)), base = srcOf(xv(`${W}*${L}`));
      return monoQ(`밑면의 가로의 길이가 ${xh(W)}, 세로의 길이가 ${xh(L)}인 직육면체의 부피가 ${xh(Vs)}일 때, 이 직육면체의 높이를 구하시오.`, `${Vs}:(${W}*${L})`, [a, b], { figure: boxFig(W, L), rule: 'mono-side-box', explain: `밑넓이는 ${xh(`${W}*${L}`)} = ${xh(base)}이다. (높이) = (부피) ÷ (밑넓이)이므로 ${xh(`${Vs}:${base}`)} = ${xh(Hs)}이다.` });
    }, { count: 2 }),
    T('mono-cyl', '부피가 단항식인 원기둥의 높이', '①49', (d) => {
      const [a, b] = pair(d), r = d.int(2, 5), p = d.int(1, 2), [c, s, t] = [d.int(2, 6), d.int(1, 3), d.int(1, 3)], R = ms(r, [[a, p]]), Hs = ms(c, [[a, s], [b, t]]), Vs = `${r * r * c}π${vs([[a, 2 * p + s], [b, t]])}`, base = `${r * r}π${vs([[a, 2 * p]])}`;
      return monoQ(`밑면의 반지름의 길이가 ${xh(R)}이고 부피가 ${xh(Vs)}인 원기둥의 높이를 구하시오.`, `${Vs}:(π*(${R})^2)`, [a, b], { figure: cylFig(R), unseen: [2], explain: `밑넓이는 π × ${xh(`(${R})^2`)} = ${xh(base)}이다. (높이) = (부피) ÷ (밑넓이)이므로 ${xh(`${Vs}:${base}`)} = ${xh(Hs)}이다.` });
    }),
    T('mono-same-area', '넓이가 같은 직사각형과 삼각형에서 삼각형의 높이', '②47 심40', (d) => {
      const [a, b] = pair(d);
      const [W, L, Bs] = d.until(() => {
        const [c1, c2, c3] = [d.int(2, 6), d.int(2, 6), d.pick([2, 3, 4, 6])], [p, q, r, s, t, u] = [d.int(1, 3), d.int(1, 3), d.int(1, 3), d.int(1, 3), d.int(1, 3), d.int(1, 3)];
        return [ms(c1, [[a, p], [b, q]]), ms(c2, [[a, r], [b, s]]), ms(c3, [[a, t], [b, u]])];
      }, ([x, y, z]) => monoOK(`2*${x}*${y}:${z}`, [a, b]) && Math.abs(xv(`2*${x}*${y}:${z}`)[0].q.p) > 1);
      const S = srcOf(xv(`${W}*${L}`)), src = `2*${W}*${L}:${Bs}`;
      return monoQ(`가로의 길이가 ${xh(W)}, 세로의 길이가 ${xh(L)}인 직사각형과 밑변의 길이가 ${xh(Bs)}인 삼각형의 넓이가 서로 같다. 이 삼각형의 높이를 구하시오.`, src, [a, b], {
        figure: null, unseen: [2], explain: `직사각형의 넓이는 ${xh(`${W}*${L}`)} = ${xh(S)}이다. ${frac(1, 2)} × ${xh(Bs)} × (높이) = ${xh(S)}이므로 (높이) = ${xh(`2*${S}:${Bs}`)} = ${pt(xv(src))}이다.`
      });
    }),
    T('mono-two-cyl', '부피가 같은 두 원기둥에서 높이 구하기', '심41', (d) => {
      const k = d.pick([2, 3, 4]), h = d.int(2, 9), r = V('r');
      return N(`밑면의 반지름의 길이가 ${nb(k + r)}, 높이가 ${h}인 원기둥 A와 밑면의 반지름의 길이가 ${r}인 원기둥 B의 부피가 서로 같다. 원기둥 B의 높이는?`, k * k * h, {
        explain: `원기둥 A의 부피는 π × ${nb(`(${k}${r})${sup(2)}`)} × ${h} = ${nb(`${k * k * h}π${r}${sup(2)}`)}이다. 원기둥 B의 높이를 ${V('h')}라 하면 부피는 ${nb(`π${r}${sup(2)}${V('h')}`)}이므로 ${V('h')} = ${k * k * h}이다.`,
        facts: { calc: [[`${k}**2*${h}`, 0]], unseen: [2] }
      });
    }),
    T('mono-pyramid', '이웃한 두 칸의 식을 곱하여 아래 칸에 적는 그림', '②45 심39', (d, n) => {
      const [a, b] = pair(d), RULE = '다음 그림에서 이웃한 두 칸의 식을 곱한 것을 바로 아래 칸에 적는다.';
      const [t1, t2, t3] = d.until(() => [0, 1, 2].map(() => ms(d.pick([1, 2, 3, -2]), [[a, d.int(0, 3)], [b, d.int(0, 3)]])), (ts) => ts.every((s) => /[a-z]/.test(s)) && new Set(ts).size === 3 && monoOK(`${pa(ts[0])}*${pa(ts[1])}*${pa(ts[1])}*${pa(ts[2])}`, [a, b]) && ts.filter((s) => s.startsWith('-')).length <= 1 && (n === 0 || monoOK(ts[2], [a, b])));
      const m1 = srcOf(xv(`${pa(t1)}*${pa(t2)}`)), m2 = srcOf(xv(`${pa(t2)}*${pa(t3)}`)), bottom = srcOf(xv(`${pa(m1)}*${pa(m2)}`));
      if (n === 0) {
        // 위에서 아래로: 맨 아래 칸의 식
        return monoQ(`${RULE} ㉠에 알맞은 식을 구하시오.`, `(${pa(t1)}*${pa(t2)})*(${pa(t2)}*${pa(t3)})`, [a, b], {
          figure: pyrFig([[xh(t1), xh(t2), xh(t3)], ['', ''], [LAB[0]]]), rule: 'mono-pyramid-down',
          explain: `가운뎃줄의 두 칸은 ${xh(`${pa(t1)}*${pa(t2)}`)} = ${xh(m1)}, ${xh(`${pa(t2)}*${pa(t3)}`)} = ${xh(m2)}이다. ㉠ = ${xh(`${pa(m1)}*${pa(m2)}`)} = ${xh(bottom)}이다.`
        });
      }
      // 아래에서 위로: 가운뎃줄 왼쪽 칸과 맨 아래 칸, 윗줄 가운데 칸을 알 때 윗줄 오른쪽 칸의 식
      return monoQ(`${RULE} ㉠에 알맞은 식을 구하시오.`, `(${pa(bottom)}:${pa(m1)}):${pa(t2)}`, [a, b], {
        figure: pyrFig([['', xh(t2), LAB[0]], [xh(m1), ''], [xh(bottom)]]), rule: 'mono-pyramid-up',
        explain: `가운뎃줄의 오른쪽 칸은 ${xh(`${pa(bottom)}:${pa(m1)}`)} = ${xh(m2)}이다. ${xh(t2)} × ㉠ = ${xh(m2)}이므로 ㉠ = ${xh(`${pa(m2)}:${pa(t2)}`)} = ${xh(t3)}이다.`
      });
    }, { count: 2 })
  ];

  B.kit.m812 = {
    STD1, STD2, STD3, UNIT, T, parse, X, keyOf, term1, numT, mk, pAdd, pNeg, pMul, pDiv, pPow, same, valX, coefS, letters, degOf, ordered, hidden, fpart, vh, termH, ph, pt, htmlX, emX,
    xh, xe, xex, eqx, xtagged, xv, xsame, magS, vs, ms, pa, pn, kp, srcOf, steps, told, SIMP, CALC, SIMP_PICK, CALC_PICK, UNSEEN, single, monoOK, powOK, polyOK, monoQ, powQ, polyQ, pickQ, eqQ,
    slots, eqLabel, coefs, PAIRS, pair, one, sjs, nameH, ej, xj, pj, pe, nth, RULE_MUL, RULE_POW, RULE_DIV, BOX_ASK, xlines, eqh, numJs, boxN, rowEm, rowH,
    plugH, given, tMul, tDiv, tNeg, RULE_MONO, RULE_RECIP, BOX_EXPR, oneTerm, inv, flip, pyrCell, pyrFig, asP, isBoxCh,
    named, INK, TINT, svgX, plainX, svg, label, word, shapeD, dash, thin, rectFig, triFig, paraFig, isoFig, boxFig, cylFig, cornerFig
  };

  B.addUnit({
    id: '8-1-2', grade: 8, semester: 1, no: 2, title: '식의 계산', version: 2,
    groups: [
      { id: 'law', title: '지수법칙', standard: STD1, types: lawTypes },
      { id: 'expo', title: '지수법칙으로 수 구하기', standard: STD1, types: expoTypes },
      { id: 'mono', title: '단항식의 곱셈과 나눗셈', standard: STD1, types: monoTypes }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
