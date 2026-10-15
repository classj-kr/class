// 중학교 1학년 1학기 3단원 문자의 사용과 식 — 단원 틀·도구와 앞쪽 묶음(상황을 문자를 사용한 식으로, 곱셈 기호와 나눗셈 기호의 생략, 식의 값).
// 수집해 둔 교과서 3종(미래엔 황선욱 2015·2022, 천재 김동재·김화경)의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1: 106꼴, 심화꼴: 70꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/7-1-3/싣기_대조표.md 에 있다.
// (다항식의 용어와 일차식, 일차식과 수의 곱셈·나눗셈, 동류항과 일차식의 덧셈·뺄셈, 어떤 식 구하기와 식의 대입은 7-1-3b.js 에, 실력 문항은 7-1-3c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
// 영역은 변화와 관계. 성취기준은 9수02-01(다양한 상황을 문자를 사용한 식으로 나타내고 식의 값 구하기), 9수02-02(일차식의 덧셈과 뺄셈)이다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(상황·식·표·그림·계산 과정), 묻는 것(식·값·개수·고르기·빈칸), 식의 구조가 다르면 따로 싣는다.
//    계산 문항은 식의 구조가 다를 때만 따로 싣고 facts.rule 에 이름을 단다(단항식 × 수 / 일차식 × 수 / 일차식 ÷ 수 / 분수 꼴 일차식 × 수 /
//    동류항 모으기 / 괄호 한 겹 / 여러 겹 / 수를 곱한 일차식끼리 / 분수 꼴 일차식끼리). 수만 바꾼 유형은 만들지 않는다.
//    상황을 식으로 나타내는 문항은 상황(값, 거스름돈, 한 몫, 자릿수, 단위, 할인, 비율, 농도, 거리·속력·시간, 둘레, 넓이·부피, 평균, 수의 관계)마다 한 유형이다.
//  - 첫 묶음 「상황을 문자를 사용한 식으로」는 곱셈 기호와 나눗셈 기호를 생략하는 법을 배우기 전이므로 교과서 첫 차시처럼 (500 × x)원, (x ÷ 4)원으로 적는다.
//    기호를 생략한 표기(2a, ab, a²b, (x + y)/3)는 둘째 묶음에서 배우고, 그 뒤로는 그대로 쓴다. 상황을 기호를 생략한 식으로 나타내는 일은 둘째 묶음 끝과 뒤 묶음에 실었다.
//  - 이 단원의 식의 계산은 문자가 하나인 일차식이다(일차식 × 수, 일차식 ÷ 수, 일차식의 덧셈·뺄셈). 문자가 둘인 다항식의 덧셈·뺄셈은 중2(9수02-09)이므로
//    문자가 하나인 꼴로 바꾸어 싣거나 뺐다. 문자가 둘인 식을 세우기, 식의 값 구하기, 계수 읽기, 동류항 가리기는 이 단원 내용이라 실었다.
//  - 답: 식의 값·계수·차수·상수항은 부호 단추가 붙은 수 칸으로 받는다. 개수와, 음수가 될 수 없는 양(넓이, 값, 거리)만 단추 없이 받는다.
//    답이 일차식(문자 하나, 계수와 상수항이 0이 아닌 정수)이면 「[±][ ]x [±][ ]」 두 칸(linAns), 답이 단항식이면 계수 한 칸으로 받는다.
//    답이 분수 꼴 식·문자가 둘인 식·계수가 분수인 식이면 고르기로 바꾸었다. 틀린 보기는 저마다 아이들이 실제로 하는 잘못 하나로 만든 식이다
//    (값과 개수를 더한다, 빼는 차례를 바꾼다, 괄호를 빠뜨린다, 퍼센트를 그대로 뺀다, a ÷ b × c를 a/(bc)로 쓴다, 0.1 × a를 0.a로 쓴다, 괄호 앞의 −를 첫 항에만 쓴다 …).
//    계수 1을 적은 1x는 틀린 표기가 아니므로 틀린 보기로 쓰지 않는다.
//  - 고르기 문항의 참·거짓은 손으로 적지 않는다. 식을 한 줄 글(식 글)로 적고, 그 글 하나에서 화면 글과 값을 함께 얻어 문자에 수를 넣어 본 값으로 정한다.
//    값이 정답과 같아진 보기(2(x + 8)과 2x + 16)는 버린다.
//  - 용어는 교육과정의 것(대입, 다항식, 항, 단항식, 상수항, 계수, 차수, 일차식, 동류항, 식의 값)만 쓴다. 앞 단원(정수와 유리수)의 계산은 그대로 쓴다.
//  - 꼴 목록에 적힌 원문 답지의 잘못은 따르지 않는다. 답은 모두 코드가 셈한다.
//
// 뺀 것과 까닭(7-1-3b.js, 7-1-3c.js 의 것까지 여기에 모아 적는다)
//  ※ 2026-10-13 다시 싣기: 아래에 적힌 것 가운데 심21·24·28·29·32·37·49·52·69, ①94·100·104, ①41의 불쾌지수, 심44의 분수 곱 변형, 심62의 원래 꼴(n²),
//    ①96·심51의 변형, ①101의 그림을 알게 된 꼴은 다시 실었다(7-1-3c.js 끝의 「다시 실은 꼴」). 지금의 판정은 대조표에 있다.
//  - 다음 단원·뒤 학년: 방정식을 세워 푸는 것(심65의 뒤 물음·69·70), 다항식의 전개(심68), 분모에 문자가 있는 분수의 통분(심16 — 평균 속력은 통분이 없는 꼴로 바꾸어 실력에 실었다),
//    문자가 둘 넘는 다항식의 덧셈·뺄셈(①44·104, ①91·98의 문자 둘 변형, 심6의 변형·심7의 펼친 꼴, 심44·56의 문자 둘 변형).
//    ①92·102, 심13·14는 문자가 하나인 꼴로 바꾸어 실었다(대조표의 「문자가 둘인 꼴의 판정」).
//    일차식이 아닌 규칙(심62의 n² — 둘레에 놓은 바둑돌 4n − 4로 바꾸어 실었다).
//  - 분수 안의 분수가 겹치는 대입(심24·25·30·31), 요령이 전부인 것(심21 범위만 준 문자의 식 일곱 줄 세우기, 심32 분수 꼴 식의 값을 통째로 뒤집어 넣기),
//    조건 셋으로 계수 찾기(심49), 상수항을 문자로 두어야 풀리는 것(①100 심37), 새로 약속한 기호(심66·67), 앞 단원의 거듭제곱 부호가 일의 대부분인 것(심28·29).
//  - 뜻 없는 셈: 따로 구한 차수·계수·상수항을 다시 더하고 곱하기(①47·69·88·103의 a + b 부분, 심34·45·46의 꼬리, ①94의 13x − 4 − 10A). 하나하나 구하는 일과 계산 자체는 실었다.
//  - 서술형·활동: 상황을 스스로 지어 쓰기(①17), 계산과 결과를 맞붙이는 퍼즐(①90). 까닭·과정을 쓰는 꼴은 고르기와 빈칸으로 바꾸어 실었다.
//  - 그림을 알 수 없거나 그림 읽기가 일의 대부분인 것: 정사각형을 이어 붙인 그림(①106), 여러 도형으로 나누는 넓이(심59), 전개도에서 마주 보는 면 찾기(심52),
//    대각선으로 나눈 사각형(①104), 규칙을 보기 그림에서 찾아 거꾸로 채우는 칸(①99의 변형).
//  - 수만 키운 것·같은 일이어서 한 번만 실은 것: 잘못 계산한 식 바로잡기의 분수 꼴(①94), 어떤 식을 구해 다시 계산(①92 — 잘못 계산한 식 바로잡기와 같은 일),
//    거듭 곱해 이어지는 세 식(심39 — 잘못 곱한 식 바로잡기와 같은 일), 불쾌지수 공식(①41의 변형), 기호를 생략한 식의 참·거짓(심4 — 기본의 같은 유형에 보기를 보탰다),
//    지금 쓰지 않는 말 「5할」(①6의 변형).
//  - 그림이 필요해 미룬 것은 없다. 직사각형·사다리꼴은 이 파일의 그림 함수로, 나머지 그림은 7-1-3b.js·7-1-3c.js 의 그림 함수로 그렸다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, NAMES, box, frac, lines, numbers, table, N, M, C } = B.kit;
  const STD1 = '9수02-01', STD2 = '9수02-02';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  // 유리수·수를 적는 글·문항 도구는 공용 파일(middle.js 의 B.kit.mid)에 있다.
  const { LAB, MINUS, range, gcd, lcm, Q, qadd, qsub, qmul, qdiv, qneg, qabs, qpow, qcmp, isInt, fl, mag, tx, sx, px, digits, nb, tail, lastOf, tj, js, V, sup, emOf, fit, ex, tag, taggedEx, proc, flow, nz, pm, co, fr, distinct, okKind, ansV, claimQ, asQ, mono, poly, lin, linAns } = B.kit.mid;

  // ── 식 글 ──
  // 문자가 든 식을 한 줄 글로 적고(식 글), 그 글 하나에서 화면 글·값·검사 식을 얻는다. 보기의 참·거짓과 답을 손으로 적지 않으려는 것이다.
  //  수 12 · 0.1 / 문자 a / 덧셈 + 뺄셈 - / 곱셈 기호 * (×) / 나눗셈 기호 : (÷) / 기호를 생략한 곱 2a · ab · 3(x+1) / 거듭제곱 a^2 / 분수 [분자|분모]
  //  괄호 ( ) · 중괄호 { } · 대괄호 < >.  기호를 생략한 곱은 × ÷ 보다 먼저 묶인다: a:[2|3]b 는 a ÷ ((2/3) × b).
  const OPEN = { '(': ')', '{': '}', '<': '>' }, SHOWN = { '(': ['(', ')'], '{': ['{', '}'], '<': ['[', ']'] };
  function parse(src) {
    const s = String(src).replace(/\s+/g, ''); let i = 0;
    const fail = (why) => { throw new Error(`식 글 「${src}」: ${why}(${i}번째)`); };
    const eat = (ch) => { if (s[i] !== ch) fail(ch + ' 가 와야 한다'); i += 1; };
    function sum() { let a = term(); while (s[i] === '+' || s[i] === '-') { const op = s[i]; i += 1; a = { t: op === '+' ? 'add' : 'sub', a, b: term() }; } return a; }
    function term() { let a = neg(); while (s[i] === '*' || s[i] === ':') { const op = s[i]; i += 1; a = { t: op === '*' ? 'mul' : 'div', a, b: neg() }; } return a; }
    function neg() { if (s[i] === '-') { i += 1; return { t: 'neg', a: neg() }; } return jux(); }
    function jux() { const list = [pow()]; while (i < s.length && /[a-zA-Z({<[]/.test(s[i])) list.push(pow()); return list.length === 1 ? list[0] : { t: 'jux', list }; }
    function pow() { const a = atom(); if (s[i] !== '^') return a; i += 1; const m = /^\d+/.exec(s.slice(i)); if (!m) fail('지수가 없다'); i += m[0].length; return { t: 'pow', a, n: Number(m[0]) }; }
    function atom() {
      const ch = s[i];
      if (/\d/.test(ch || '')) { const m = /^\d+(\.\d+)?/.exec(s.slice(i)); i += m[0].length; return { t: 'num', s: m[0] }; }
      if (/[a-zA-Z]/.test(ch || '')) { i += 1; return { t: 'var', name: ch }; }
      if (OPEN[ch]) { i += 1; const a = sum(); eat(OPEN[ch]); return { t: 'par', a, br: ch }; }
      if (ch === '[') { i += 1; const a = sum(); eat('|'); const b = sum(); eat(']'); return { t: 'frac', a, b }; }
      return fail('읽지 못하는 글자');
    }
    const out = sum(); if (i !== s.length) fail('식이 끝나지 않았다'); return out;
  }
  const parsed = new Map();
  const X = (src) => { if (!parsed.has(src)) parsed.set(src, parse(src)); return parsed.get(src); };
  const numQ = (text) => { const [w, f] = text.split('.'); return f ? Q(Number(w + f), 10 ** f.length) : Q(Number(w)); };
  // 값(유리수). env: { 문자: 유리수 }. 0으로 나누게 되면 null.
  function valX(n, env) {
    const two = (f) => { const a = valX(n.a, env), b = valX(n.b, env); return a && b ? f(a, b) : null; };
    switch (n.t) {
      case 'num': return numQ(n.s);
      case 'var': if (!env[n.name]) throw new Error('값을 주지 않은 문자 ' + n.name); return Q(env[n.name].p, env[n.name].q);
      case 'add': return two(qadd);
      case 'sub': return two(qsub);
      case 'mul': return two(qmul);
      case 'div': case 'frac': return two((a, b) => (b.p === 0 ? null : qdiv(a, b)));
      case 'neg': { const a = valX(n.a, env); return a && qneg(a); }
      case 'par': return valX(n.a, env);
      case 'pow': { const a = valX(n.a, env); return a && qpow(a, n.n); }
      default: return n.list.reduce((acc, t) => { const v = acc && valX(t, env); return v ? qmul(acc, v) : null; }, Q(1));
    }
  }
  // 화면 글. inExpr: 식 글꼴(mb-expr) 안에 적을 때 연산 기호를 <i>로 감싼다(분수 안은 그대로 적는다).
  function htmlX(n, inExpr) {
    const op = (sym) => (inExpr ? ` <i>${sym}</i> ` : ` ${sym} `), h = (m) => htmlX(m, inExpr);
    switch (n.t) {
      case 'num': return n.s;
      case 'var': return V(n.name);
      case 'add': return h(n.a) + op('+') + h(n.b);
      case 'sub': return h(n.a) + op(MINUS) + h(n.b);
      case 'mul': return h(n.a) + op('×') + h(n.b);
      case 'div': return h(n.a) + op('÷') + h(n.b);
      case 'neg': return MINUS + h(n.a);
      case 'par': return SHOWN[n.br][0] + h(n.a) + SHOWN[n.br][1];
      case 'pow': return h(n.a) + sup(n.n);
      case 'frac': return frac(fracPart(n.a), fracPart(n.b));
      default: return n.list.map(h).join('');
    }
  }
  // 분수의 분자·분모: 여러 항이거나 곱이면 보이지 않는 괄호를 넣는다. 화면에는 가로줄만 보이지만 글로 옮기면 (a + b)/(2c)가 되어
  // a/(b + 5)와 a/b + 5가 같은 글이 되지 않는다(기록에 남는 답, 화면 읽기, 보기가 겹치는지 보는 검사가 이 글을 읽는다).
  const hidden = (ch) => '<span class="mb-frac-bar">' + ch + '</span>';
  const single = (n) => n.t === 'num' || n.t === 'var' || (n.t === 'pow' && single(n.a));
  function fracPart(n) { return single(n) ? htmlX(n) : hidden('(') + htmlX(n) + hidden(')'); }
  // 검사가 다시 셈하는 식(문자에 수를 넣은 자바스크립트 셈 글)
  function jsX(n, env) {
    const j = (m) => jsX(m, env);
    switch (n.t) {
      case 'num': return n.s;
      case 'var': return js(Q(env[n.name].p, env[n.name].q));
      case 'add': return `(${j(n.a)}+${j(n.b)})`;
      case 'sub': return `(${j(n.a)}-${j(n.b)})`;
      case 'mul': return `(${j(n.a)}*${j(n.b)})`;
      case 'div': case 'frac': return `(${j(n.a)}/${j(n.b)})`;
      case 'neg': return `(-${j(n.a)})`;
      case 'par': return j(n.a);
      case 'pow': return `(${j(n.a)}**${n.n})`;
      default: return '(' + n.list.map(j).join('*') + ')';
    }
  }
  // 문자에 수를 넣은 식의 화면 글(풀이): 생략한 곱셈 기호를 되살리고 음수는 괄호에 넣는다. 분수를 넣은 분수 꼴은 나눗셈으로 적는다.
  const hasFracVar = (n, env) => (n.t === 'var' ? env[n.name].q !== 1 : n.t === 'num' ? false : n.list ? n.list.some((t) => hasFracVar(t, env)) : hasFracVar(n.a, env) || Boolean(n.b && hasFracVar(n.b, env)));
  function subX(n, env) {
    const h = (m) => subX(m, env), valH = (q, tight) => (q.p < 0 || (tight && q.q !== 1) ? '(' + tx(q) + ')' : tx(q));
    const wrap = (m) => (['add', 'sub', 'neg'].includes(m.t) || (m.t === 'var' && env[m.name].q !== 1) ? '(' + h(m).replace(/^\((.*)\)$/, '$1') + ')' : h(m));
    switch (n.t) {
      case 'num': return n.s;
      case 'var': return valH(env[n.name]);
      case 'add': return h(n.a) + ' + ' + h(n.b);
      case 'sub': return h(n.a) + ' ' + MINUS + ' ' + h(n.b);
      case 'mul': return h(n.a) + ' × ' + h(n.b);
      case 'div': return h(n.a) + ' ÷ ' + h(n.b);
      case 'neg': return MINUS + h(n.a);
      case 'par': return SHOWN[n.br][0] + h(n.a) + SHOWN[n.br][1];
      case 'pow': return (n.a.t === 'var' ? valH(env[n.a.name], true) : h(n.a)) + sup(n.n);
      case 'frac': return hasFracVar(n, env) ? wrap(n.a) + ' ÷ ' + wrap(n.b) : frac(h(n.a), h(n.b));
      default: return n.list.map(h).join(' × ');
    }
  }
  // 식의 너비 어림(em): 식 글꼴의 글씨 크기를 휴대폰 너비에 맞추는 데 쓴다.
  function emX(n) {
    switch (n.t) {
      case 'num': return 0.6 * n.s.length;
      case 'var': return 0.64;
      case 'add': case 'sub': case 'mul': case 'div': return emX(n.a) + emX(n.b) + 1.62;
      case 'neg': return 0.8 + emX(n.a);
      case 'par': return 0.76 + emX(n.a);
      case 'pow': return emX(n.a) + 0.48 * String(n.n).length;
      case 'frac': return Math.max(emX(n.a), emX(n.b)) + 0.7;
      default: return n.list.reduce((s, t) => s + emX(t), 0);
    }
  }
  // 두 식이 같은 식인가: 문자에 수를 네 벌 넣어 값을 견준다(문자마다 서로 다른 수).
  const SMALL = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101];
  const ENVS = [0, 1, 2, 3].map((k) => { const env = {}; for (let i = 0; i < 26; i += 1) { const p = SMALL[(i * (2 * k + 1) + 5 * k) % 26], q = k === 0 ? Q(p) : k === 1 ? Q(-(p + 4), 3) : k === 2 ? Q(p + 1, 5) : Q(-p, 2); env[String.fromCharCode(97 + i)] = q; env[String.fromCharCode(65 + i)] = qadd(q, Q(1, 7)); } return env; });
  function sameX(a, b) {
    let seen = 0;
    for (const env of ENVS) { const x = valX(a, env), y = valX(b, env); if (!x || !y) continue; if (qcmp(x, y) !== 0) return false; seen += 1; }
    if (seen < 2) throw new Error('값을 견줄 수 없는 식이다');
    return true;
  }
  const xh = (src) => nb(htmlX(X(src)));                                   // 글줄 속의 식
  const xe = (src) => htmlX(X(src), true);                                 // 식 글꼴 안에 적는 글
  const xex = (src, extra) => '<span class="mb-expr"' + fit(emX(X(src)) + (extra || 0)) + '>' + xe(src) + '</span>';   // 그림 자리에 크게 적는 식
  const xv = (src, env) => valX(X(src), env);
  const xjs = (src, env) => jsX(X(src), env);
  const xsame = (a, b) => sameX(X(a), X(b));
  const xsub = (src, env) => nb(subX(X(src), env));
  // 식 여러 개를 늘어놓기: 식마다 테두리를 둘러 이웃한 식과 이어져 보이지 않게 한다(4 와 0 × x + 3 이 나란히 놓이면 한 식처럼 읽힌다).
  const chips = (srcs) => '<div class="mb-numbers" style="gap:8px 10px;padding:10px 12px">' + srcs.map((s) => '<span style="padding:3px 11px;border:1.5px solid #8a96a3;border-radius:9px;background:#fff;font-size:1.15rem">' + xh(s) + '</span>').join('') + '</div>';
  // 이름표(㉠㉡…)를 붙인 식 여러 줄
  const xtagged = (srcs, tags) => { const style = fit(Math.max(...srcs.map((s) => emX(X(s)))) + 2.6); return lines(srcs.map((s, i) => tag((tags || LAB)[i]) + '<span class="mb-expr"' + style + '>' + xe(s) + '</span>')); };
  // 식에 단위를 붙인다. 연산 기호가 드러난 식은 괄호로 묶는다(교과서 표기): (5000 − 190 × x)원, {2 × (x + 8)} cm, 2(x + 8) cm, 100a km
  const spaced = (unit) => (/^[A-Za-z%°]/.test(unit) ? ' ' + unit : unit);
  function withUnit(src, unit, lead) {
    const n = X(src), h = htmlX(n), open = ['add', 'sub', 'mul', 'div'].includes(n.t);
    return nb((lead || '') + (!unit ? h : (open ? (h.includes('(') ? '{' + h + '}' : '(' + h + ')') : h) + spaced(unit)));
  }
  // 문자 뒤의 토씨(읽는 소리로는 엘·엠·엔·알만 받침이 있다)
  const vj = (v, pair) => { const [w, wo] = pair.split('/'); return V(v) + ('lmnr'.includes(v) ? (w === '으로' && v === 'l' ? '로' : w) : wo); };

  // ── 다항식의 식 글 ──
  // 항 [계수(수나 유리수), 문자 부분의 식 글('x', 'x^2', 'ab', 상수항은 '')]을 이어 적는다. 계수 1은 적지 않고 0인 항은 뺀다.
  const magS = (q) => (q.d ? digits(q) : q.q === 1 ? String(Math.abs(q.p)) : `[${Math.abs(q.p)}|${q.q}]`);
  function pn(terms) {
    const live = terms.map(([c, v]) => [asQ(c), v]).filter(([c]) => c.p !== 0);
    if (!live.length) return '0';
    return live.map(([c, v], i) => (c.p < 0 ? '-' : i ? '+' : '') + (v && Math.abs(c.p) === 1 && c.q === 1 ? '' : magS(c)) + v).join('');
  }
  const ln = (a, b, v) => pn([[a, v || 'x'], [b, '']]);     // ax + b
  const lj = (a, b, v, pair) => xh(ln(a, b, v)) + tail(lastOf(qabs(asQ(b))), pair);     // 일차식 ax + b 의 화면 글과 토씨(상수항을 읽는 소리에 맞춘다)
  const nl = (b, a, v) => pn([[b, ''], [a, v || 'x']]);     // b + ax (상수항을 앞에)
  // 수를 곱한 괄호: 3(2x − 7), −(5x + 7), (2/3)(6x − 9)
  const kp = (k, inner) => { const q = asQ(k); return (q.p < 0 ? '-' : '') + (Math.abs(q.p) === 1 && q.q === 1 ? '' : magS(q)) + '(' + inner + ')'; };
  // 식 글이 나타내는 일차식의 계수와 상수항(문자 하나). 일차식이 아니면 멈춘다.
  function linOf(src, v) {
    const n = X(src), name = v || 'x', f = (k) => valX(n, { [name]: Q(k) }), b = f(0), a = qsub(f(1), b);
    if (qcmp(f(4), qadd(qmul(a, Q(4)), b)) !== 0 || qcmp(f(-3), qadd(qmul(a, Q(-3)), b)) !== 0) throw new Error('일차식이 아니다: ' + src);
    return { a, b };
  }
  // 등호로 이은 계산 과정(풀이)
  const chain = (srcs) => srcs.map((s) => nb(htmlX(X(s)))).filter((h, i, all) => i === 0 || h !== all[i - 1]).join(' = ');

  // ── 문항 도구 ──
  // 식을 고르는 문항. right: 정답 식 글. wrongs: 틀린 식 글의 후보(식이 아닌 표기는 { h: 화면 글 }) — 저마다 아이들이 하는 잘못 하나로 만든 식이다.
  //  값이 정답과 같아지거나 서로 같아진 후보는 버리고 셋을 뽑는다. 참·거짓은 문자에 수를 넣어 본 값으로 정한다.
  //  o.target: 값을 맞춰 볼 식 글(물음에 적힌 식. 주지 않으면 right), o.unit·o.lead: 식에 붙이는 단위와 앞말, o.figure, o.explain, o.rule
  function pickX(d, text, right, wrongs, o) {
    const opt = o || {}, target = X(opt.target || right), kept = [];
    if (!sameX(X(right), target)) throw new Error('정답 식이 물음의 식과 다르다: ' + right);
    for (const w of d.shuffle(wrongs)) {
      if (kept.length === 3) break;
      if (typeof w === 'string') { const n = X(w); if (sameX(n, target) || kept.some((k) => typeof k === 'string' && sameX(X(k), n))) continue; }
      kept.push(w);
    }
    if (kept.length < 3) throw new Error('틀린 보기가 모자라다: ' + right);
    const rows = d.shuffle([right].concat(kept)), show = (r) => (typeof r === 'string' ? withUnit(r, opt.unit, opt.lead) : nb((opt.lead || '') + r.h + (opt.unit ? spaced(opt.unit) : '')));
    return C(text, rows.map(show), rows.indexOf(right), { figure: opt.figure, explain: opt.explain, facts: Object.assign({ truth: rows.map((r) => typeof r === 'string' && sameX(X(r), target)), want: true }, opt.rule ? { rule: opt.rule } : {}) });
  }
  // 등식 「왼쪽 = 오른쪽」 넷에서 옳은 것(옳지 않은 것) 하나 고르기. pool 의 줄은 [왼쪽 식 글, 바른 오른쪽, 잘못 쓴 오른쪽(식 글이나 { h })].
  //  옳은 것을 물으면 하나만 바르게, 옳지 않은 것을 물으면 하나만 잘못 적는다. 참·거짓은 값으로 정한다.
  function eqQ(d, text, pool, wantTrue, o) {
    const opt = o || {}, picked = d.shuffle(pool).slice(0, 4), at = d.int(0, 3);
    const rows = picked.map((e, i) => ({ l: e[0], r: (i === at) === wantTrue ? e[1] : e[2], good: e[1] })), side = (r) => (typeof r === 'string' ? htmlX(X(r)) : r.h);
    const truth = rows.map((row) => typeof row.r === 'string' && xsame(row.l, row.r));
    if (truth.filter((t) => t === wantTrue).length !== 1 || truth[at] !== wantTrue) throw new Error('답이 하나가 아니다: ' + rows.map((r) => r.l).join(' | '));
    const fixed = (row) => nb(htmlX(X(row.l)) + ' = ' + htmlX(X(row.good)));
    return C(text, rows.map((row) => nb(htmlX(X(row.l)) + ' = ' + side(row.r))), at, {
      explain: (opt.lead || '') + (wantTrue ? '나머지를 바르게 고치면 ' + rows.filter((r, i) => i !== at).map(fixed).join(', ') + '이다.' : '바르게 고치면 ' + fixed(rows[at]) + '이다.'),
      facts: Object.assign({ truth, want: wantTrue }, opt.rule ? { rule: opt.rule } : {})
    });
  }
  // 답이 단항식인 문항: 계수 한 칸 뒤에 문자를 적어 둔다(정수 계수). 틀리면 식 그대로(−5x) 보인다.
  function monoAns(text, c, v, o) {
    if (!Number.isInteger(c) || c === 0) throw new Error('단항식 답의 계수는 0이 아닌 정수여야 한다');
    return M(text, [{ answer: c, signed: true, unit: V(v) }], Object.assign({}, o, { shown: xh(pn([[c, v]])) }));
  }
  // 답이 일차식인 문항: 식 글이 나타내는 계수와 상수항을 셈하여 두 칸으로 받는다(공용 도구 linAns).
  //  o.unit 을 주면 둘째 칸 뒤에 단위를 괄호에 넣어 적는다 — 「[±][ ]x [±][ ] (cm)」
  function linQ(text, src, v, o) {
    const { a, b } = linOf(src, v), name = V(v || 'x');
    if (!isInt(a) || !isInt(b) || a.p === 0 || b.p === 0) throw new Error('답의 계수와 상수항이 0이 아닌 정수가 아니다: ' + src);
    if (!o.unit) return linAns(text, a.p, b.p, name, o);
    return M(text, [{ answer: a.p, signed: true, unit: name }, { answer: b.p, signed: true, unit: '(' + o.unit + ')' }], Object.assign({}, o, { shown: lin(a.p, b.p, name) + ' (' + o.unit + ')' }));
  }
  // 식의 값: 식 글의 문자에 수를 넣는다. kind: 'int' | 'frac'
  const given = (env) => Object.keys(env).map((k) => nb(`${V(k)} = ${tx(env[k])}`)).join(', ');
  const givenJ = (env, pair) => { const keys = Object.keys(env), last = env[keys[keys.length - 1]]; return given(env) + tail(lastOf(last), pair); };
  // 대입한 식을 항마다 계산한 줄(−6 + 2)
  function termLine(n, env) {
    const flat = (m, sign) => (m.t === 'add' ? flat(m.a, sign).concat(flat(m.b, sign)) : m.t === 'sub' ? flat(m.a, sign).concat(flat(m.b, -sign)) : [[m, sign]]);
    const vals = flat(n, 1).map(([m, sign]) => { const v = valX(m, env); return sign < 0 ? qneg(v) : v; });
    return vals.length < 2 ? '' : nb(vals.map((v, i) => (i === 0 ? tx(v) : (v.p < 0 ? ' ' + MINUS + ' ' : ' + ') + mag(v))).join(''));
  }
  const worked = (src, env) => { const v = xv(src, env), parts = [xsub(src, env), termLine(X(src), env), nb(tx(v))].filter(Boolean); return parts.filter((h, i) => i === 0 || h !== parts[i - 1]).join(' = '); };
  function valueQ(src, env, kind, o) {
    const opt = o || {}, v = xv(src, env);
    return ansV(opt.text || `${given(env)}일 때, ${xh(src)}의 값은?`, v, kind, {
      figure: opt.figure, unit: opt.unit,
      explain: (opt.lead || '') + `${givenJ(env, '을/를')} 대입하면 ${worked(src, env)}이다.`,
      facts: Object.assign({ value: xjs(src, env) }, opt.rule ? { rule: opt.rule } : {}, opt.unseen ? { unseen: opt.unseen } : {})
    });
  }
  const valueOK = (src, env, kind) => { const v = xv(src, env); return Boolean(v) && v.p !== 0 && okKind(v, kind); };

  // ── 그림 ──
  const INK = '#1f2933', EDGE = '#1d4ed8', TINT = 'rgba(37,99,235,0.14)', ITALIC = "font-style:italic;font-family:'MB Math','Times New Roman',serif";
  // 그림 속 글(식 글): 문자는 수식 글꼴의 기울인 글자로 적는다. 그림 설명에는 글자 그대로 적는다.
  function svgX(n) {
    switch (n.t) {
      case 'num': return n.s;
      case 'var': return `<tspan style="${ITALIC};font-size:1.1em">${n.name}</tspan>`;
      case 'add': return svgX(n.a) + ' + ' + svgX(n.b);
      case 'sub': return svgX(n.a) + ' ' + MINUS + ' ' + svgX(n.b);
      case 'mul': return svgX(n.a) + ' × ' + svgX(n.b);
      case 'div': return svgX(n.a) + ' ÷ ' + svgX(n.b);
      case 'neg': return MINUS + svgX(n.a);
      case 'par': return '(' + svgX(n.a) + ')';
      case 'jux': return n.list.map(svgX).join('');
      default: throw new Error('그림 속 글로 적을 수 없는 식이다');
    }
  }
  function plainX(n) {
    switch (n.t) {
      case 'num': return n.s;
      case 'var': return n.name;
      case 'add': return plainX(n.a) + ' + ' + plainX(n.b);
      case 'sub': return plainX(n.a) + ' ' + MINUS + ' ' + plainX(n.b);
      case 'mul': return plainX(n.a) + ' × ' + plainX(n.b);
      case 'div': return plainX(n.a) + ' ÷ ' + plainX(n.b);
      case 'neg': return MINUS + plainX(n.a);
      case 'par': return '(' + plainX(n.a) + ')';
      case 'pow': return plainX(n.a) + '의 ' + n.n + '제곱';
      case 'frac': return '(' + plainX(n.a) + ')/(' + plainX(n.b) + ')';
      default: return n.list.map(plainX).join('');
    }
  }
  // 길이 이름표: 식에 단위가 붙으면 여러 항인 식은 괄호로 묶는다 — (x + 4) cm
  const lenText = (src, unit, toText) => { const n = X(src), open = ['add', 'sub'].includes(n.t) && unit; return (open ? '(' : '') + toText(n) + (open ? ')' : '') + (unit ? ' ' + unit : ''); };
  const said = (src, unit) => lenText(src, unit, plainX);
  const label = (x, y, src, unit, anchor, size) => `<text x="${x}" y="${y}" text-anchor="${anchor || 'middle'}" style="font-size:${size || 13.5}px;font-weight:600;fill:${INK}">${lenText(src, unit, svgX)}</text>`;
  const svg = (w, h, aria, body) => `<svg class="mb-geo" viewBox="0 0 ${w} ${h}" width="${w}" role="img" aria-label="${aria}">${body}</svg>`;
  const shape = (d, fill) => `<path d="${d}" style="fill:${fill || '#fff'};stroke:${INK};stroke-width:1.4;stroke-linejoin:round"/>`;
  // 직사각형: 가로의 길이는 아래에, 세로의 길이는 오른쪽에 적는다(hl 이 null 이면 세로의 길이를 적지 않는다). o.inside: 안에 적는 글 [글, 그림 설명], o.w·o.h: 그림에서의 크기
  function rectFig(wl, hl, o) {
    const opt = o || {}, w = opt.w || 132, h = opt.h || 76, x0 = 12, y0 = 8;
    return svg(x0 + w + (hl ? 104 : 12), y0 + h + 26, `직사각형: 가로의 길이 ${said(wl[0], wl[1])}${hl ? `, 세로의 길이 ${said(hl[0], hl[1])}` : ''}${opt.inside ? ', ' + opt.inside[1] : ''}`,
      shape(`M${x0} ${y0}h${w}v${h}h${-w}z`, TINT) + label(x0 + w / 2, y0 + h + 18, wl[0], wl[1]) + (hl ? label(x0 + w + 8, y0 + h / 2 + 5, hl[0], hl[1], 'start') : '')
      + (opt.inside ? `<text x="${x0 + w / 2}" y="${y0 + h / 2 + 5}" text-anchor="middle" style="font-size:13px;font-weight:600;fill:${INK}">${opt.inside[0]}</text>` : ''));
  }
  // 사다리꼴: 윗변·아랫변·높이(점선)의 길이를 적는다.
  function trapFig(top, bottom, height, unit) {
    const u = unit === undefined ? 'cm' : unit;
    return svg(250, 122, `사다리꼴: 윗변의 길이 ${said(top, u)}, 아랫변의 길이 ${said(bottom, u)}, 높이 ${said(height, u)}`,
      shape('M62 24h78l58 74h-178z', TINT) + `<path d="M62 24v74" style="fill:none;stroke:${INK};stroke-width:1;stroke-dasharray:4 3"/><path d="M62 90h8v8" style="fill:none;stroke:${INK};stroke-width:1"/>`
      + label(101, 17, top, u) + label(109, 116, bottom, u) + label(70, 64, height, u, 'start'));
  }

  // ── 상황 ──
  const THINGS = [['지우개', '개'], ['공책', '권'], ['색연필', '자루'], ['사탕', '개'], ['붙임딱지', '장'], ['구슬', '개']];
  const SAY = '문자를 사용한 식으로 나타낸 것은?';
  // 식으로 나타낸 문장(참·거짓을 가리는 보기): 상황, 단위, 기호를 쓴 식 [바른 식, 잘못 나타낸 식], 기호를 생략한 식 [바른 식, 잘못 나타낸 식]
  function situations(d) {
    const who = d.pick(NAMES), age = d.int(11, 15), k = d.int(5, 20), v = 10 * d.int(4, 9), L = d.int(1, 3), p = 100 * d.int(5, 15), P = 1000 * d.int(5, 9), n = d.int(3, 6), c = d.int(2, 9);
    return [
      { s: `${age}살인 ${who}의 ${V('y')}년 후의 나이는`, u: '살', x: [`${age}+y`, `${age}*y`], o: [`${age}+y`, `${age}y`], why: '나이는 해마다 한 살씩 늘어나므로 더한다.' },
      { s: `전체가 ${V('x')}쪽인 책을 하루에 ${k}쪽씩 ${V('a')}일 동안 읽었을 때 남은 쪽수는`, u: '쪽', x: [`x-${k}*a`, `${k}*a-x`], o: [`x-${k}a`, `${k}a-x`], why: '전체 쪽수에서 읽은 쪽수를 뺀다.' },
      { s: `${V('x')} km의 거리를 시속 ${v} km로 갈 때 걸리는 시간은`, u: '시간', x: [`x:${v}`, `${v}*x`], o: [`[x|${v}]`, `${v}x`], why: '(시간) = (거리) ÷ (속력)이다.' },
      { s: `주스 ${L} L 가운데 ${V('x')} mL를 마셨을 때 남은 주스의 양은`, u: 'mL', x: [`${1000 * L}-x`, `${L}-x`], o: [`${1000 * L}-x`, `${L}-x`], why: `${L} L를 ${1000 * L} mL로 고쳐 단위를 맞춘 다음 뺀다.` },
      { s: `한 개에 ${p}원인 빵 ${V('x')}개를 사고 ${P}원을 냈을 때의 거스름돈은`, u: '원', x: [`${P}-${p}*x`, `${p}*x-${P}`], o: [`${P}-${p}x`, `${p}x-${P}`], why: '낸 돈에서 빵의 값을 뺀다.' },
      { s: `한 변의 길이가 ${V('a')} cm인 정사각형의 둘레의 길이는`, u: 'cm', x: ['4*a', 'a*a'], o: ['4a', 'a^2'], why: '둘레의 길이는 한 변의 길이의 4배이다.' },
      { s: `${n}개에 ${V('x')}원인 귤 한 개의 값은`, u: '원', x: [`x:${n}`, `${n}*x`], o: [`[x|${n}]`, `${n}x`], why: `한 개의 값은 전체 값을 ${n}으로 나눈 것이다.`.replace(`${n}으로`, josa(n, '으로/로')) },
      { s: `가로의 길이가 ${V('a')} cm, 세로의 길이가 ${V('b')} cm인 직사각형의 넓이는`, u: `cm${sup(2)}`, x: ['a*b', '2*(a+b)'], o: ['ab', '2(a+b)'], why: '(직사각형의 넓이) = (가로의 길이) × (세로의 길이)이다.' },
      { s: `십의 자리의 숫자가 ${V('x')}, 일의 자리의 숫자가 ${V('y')}인 두 자리 자연수는`, u: '', x: ['10*x+y', 'x+y'], o: ['10x+y', 'xy'], why: '십의 자리의 숫자 x는 10 × x를 나타낸다.'.replace(/x/g, V('x')) }
    ];
  }
  // form: 'x'(곱셈 기호와 나눗셈 기호를 쓴 식) | 'o'(기호를 생략한 식)
  function situClaims(d, form, wantTrue, text) {
    const picked = d.shuffle(situations(d)).slice(0, 4), at = d.int(0, 3);
    const rows = picked.map((e, i) => ({ e, shown: e[form][(i === at) === wantTrue ? 0 : 1] })), truth = rows.map((r) => xsame(r.shown, r.e[form][0]));
    if (truth.filter((t) => t === wantTrue).length !== 1) throw new Error('답이 하나가 아니다');
    const line = (r, src) => `${r.e.s} ${withUnit(src, r.e.u)}이다.`;
    return C(text, rows.map((r) => line(r, r.shown)), at, {
      explain: wantTrue ? '나머지를 바르게 나타내면 차례로 ' + rows.filter((r, i) => i !== at).map((r) => withUnit(r.e[form][0], r.e.u)).join(', ') + '이다.' : `${rows[at].e.why} 바르게 나타내면 ${withUnit(rows[at].e[form][0], rows[at].e.u)}이다.`,
      facts: { truth, want: wantTrue }
    });
  }

  B.addUnit({
    id: '7-1-3', grade: 7, semester: 1, no: 3, title: '문자의 사용과 식', version: 3,
    groups: [
      {
        // 곱셈 기호와 나눗셈 기호를 생략하는 법을 배우기 전이므로 식은 ×, ÷를 써서 적는다.
        id: 'situ', title: '상황을 문자를 사용한 식으로', standard: STD1,
        types: [
          T('situ-price', '낱개의 값과 개수로 전체 값을 식으로 나타내기', '①1', (d) => {
            const [thing, u] = d.pick(THINGS), p = 100 * d.int(2, 9), v = d.pick(['a', 'x', 'n']), right = `${p}*${v}`;
            return pickX(d, `한 ${u}에 ${p}원인 ${thing} ${V(v)}${u}의 값을 ${SAY}`, right, [`${p}+${v}`, `${p}:${v}`, `${v}:${p}`, `${p}-${v}`], {
              unit: '원', explain: `(${thing}의 값) = (한 ${u}의 값) × (${thing}의 수)이므로 ${withUnit(right, '원')}이다.`
            });
          }),
          T('situ-price-two', '두 가지 값의 합을 식으로 나타내기', '①1', (d) => {
            if (d.bool()) {
              const [p, q] = d.until(() => [100 * d.int(3, 9), 100 * d.int(10, 25)], ([a, b]) => a !== b), right = `${p}*x+${q}*y`;
              return pickX(d, `한 개에 ${p}원인 사탕 ${V('x')}개와 한 개에 ${q}원인 과자 ${V('y')}개를 살 때, 내야 하는 돈을 ${SAY}`, right, [`${p}*y+${q}*x`, `${p + q}*(x+y)`, `${p}+x+${q}+y`, `${p + q}*x*y`], {
                unit: '원', explain: `사탕의 값은 ${withUnit(`${p}*x`, '원')}, 과자의 값은 ${withUnit(`${q}*y`, '원')}이므로 내야 하는 돈은 ${withUnit(right, '원')}이다.`
              });
            }
            const right = '2*a+3*b';
            return pickX(d, `농구 경기에서 2점 슛 ${V('a')}개와 3점 슛 ${V('b')}개를 넣었을 때, 얻은 점수를 ${SAY}`, right, ['2*b+3*a', '5*(a+b)', '2+a+3+b', '6*a*b'], {
              unit: '점', explain: `2점 슛으로 얻은 점수는 ${withUnit('2*a', '점')}, 3점 슛으로 얻은 점수는 ${withUnit('3*b', '점')}이므로 얻은 점수는 ${withUnit(right, '점')}이다.`
            });
          }),
          T('situ-change', '거스름돈·남은 양을 식으로 나타내기', '①2', (d) => {
            if (d.bool()) {
              const c = 10 * d.int(12, 45), P = 1000 * d.int(3, 9), right = `${P}-${c}*x`;
              return pickX(d, `한 장에 ${c}원인 우표 ${V('x')}장을 사고 ${P}원을 냈을 때, 거스름돈을 ${SAY}`, right, [`${c}*x-${P}`, `(${P}-${c})*x`, `${P}+${c}*x`, `${P}-${c}+x`], {
                unit: '원', explain: `우표의 값은 ${withUnit(`${c}*x`, '원')}이다. 거스름돈은 낸 돈에서 우표의 값을 뺀 것이므로 ${withUnit(right, '원')}이다.`
              });
            }
            const c = d.int(4, 9), P = 10 * d.int(12, 30), right = `${P}-${c}*x`;
            return pickX(d, `전체가 ${P}쪽인 책을 하루에 ${c}쪽씩 ${V('x')}일 동안 읽었을 때, 남은 쪽수를 ${SAY}`, right, [`${c}*x-${P}`, `(${P}-${c})*x`, `${P}+${c}*x`, `${P}-${c}+x`], {
              unit: '쪽', explain: `${V('x')}일 동안 읽은 쪽수는 ${withUnit(`${c}*x`, '쪽')}이다. 남은 쪽수는 전체 쪽수에서 읽은 쪽수를 뺀 것이므로 ${withUnit(right, '쪽')}이다.`
            });
          }),
          T('situ-left-xy', '나누어 주고 남은 수를 식으로 나타내기(문자 둘의 곱)', '①2', (d) => {
            const [thing, u] = d.pick([['연필', '자루'], ['공책', '권'], ['사탕', '개']]), n = 10 * d.int(2, 6), right = `${n}-x*y`;
            return pickX(d, `${thing} ${josa(n + u, '을/를')} ${V('x')}명에게 ${V('y')}${u}씩 나누어 주었을 때, 남은 ${thing}의 수를 ${SAY}`, right, [`${n}-x-y`, `x*y-${n}`, `${n}:x-y`, `(${n}-x)*y`], {
              unit: u, explain: `나누어 준 ${thing}의 수는 ${withUnit('x*y', u)}이다. 남은 ${thing}의 수는 ${withUnit(right, u)}이다.`
            });
          }),
          T('situ-total-back', '나누어 주고 남은 수로 처음의 수를 식으로 나타내기', '①2', (d) => {
            const k = d.int(3, 9), r = d.int(1, k - 1), each = d.bool(), right = `${k}*a+${r}`;
            const text = each ? `사탕을 ${k}명에게 ${V('a')}개씩 나누어 주었더니 ${r}개가 남았다. 처음에 있던 사탕의 수를 ${SAY}` : `사탕을 ${V('a')}명에게 ${k}개씩 나누어 주었더니 ${r}개가 남았다. 처음에 있던 사탕의 수를 ${SAY}`;
            return pickX(d, text, right, [`${k}*a-${r}`, `${k}*(a+${r})`, `${k}+a+${r}`, `a:${k}+${r}`], {
              unit: '개', explain: `나누어 준 사탕의 수는 ${withUnit(`${k}*a`, '개')}이다. 처음에 있던 사탕의 수는 나누어 준 수에 남은 수를 더한 ${withUnit(right, '개')}이다.`
            });
          }),
          T('situ-share', '똑같이 나눈 한 몫을 식으로 나타내기', '①3', (d) => {
            if (d.bool()) {
              const k = d.int(3, 8), right = `x:${k}`;
              return pickX(d, `${k}송이에 ${V('x')}원인 꽃 한 송이의 값을 ${SAY}`, right, [`${k}:x`, `${k}*x`, `x-${k}`], { unit: '원', explain: `한 송이의 값은 전체 값을 송이 수로 나눈 것이므로 ${withUnit(right, '원')}이다.` });
            }
            const [name, k] = d.pick([['정삼각형', 3], ['정사각형', 4], ['정오각형', 5], ['정육각형', 6]]), right = `a:${k}`;
            return pickX(d, `둘레의 길이가 ${V('a')} cm인 ${name}의 한 변의 길이를 ${SAY}`, right, [`${k}:a`, `${k}*a`, `a-${k}`], { unit: 'cm', explain: `${name}은 ${k}개의 변의 길이가 모두 같으므로 한 변의 길이는 ${withUnit(right, 'cm')}이다.` });
          }),
          T('situ-cut-share', '덜어 낸 나머지를 똑같이 나눈 한 몫을 식으로 나타내기', '①3', (d) => {
            const k = d.int(3, 6), c = d.until(() => d.int(2, 9), (v) => v !== k), right = `(a-${c}):${k}`;
            return pickX(d, `길이가 ${V('a')} cm인 끈에서 ${c} cm를 잘라 내고, 남은 끈을 똑같이 ${k}도막으로 나눌 때, 한 도막의 길이를 ${SAY}`, right, [`a-${c}:${k}`, `a:${k}-${c}`, `(a-${c})*${k}`, `(a+${c}):${k}`], {
              unit: 'cm', explain: `잘라 내고 남은 끈의 길이는 ${withUnit(`a-${c}`, 'cm')}이다. 이것을 ${k}도막으로 나누므로 남은 길이 전체를 괄호로 묶어 ${withUnit(right, 'cm')}로 나타낸다.`
            });
          }),
          T('situ-digits', '자리의 숫자로 수를 식으로 나타내기', '①4', (d, n) => {
            const k = d.int(2, 9);
            if (n === 0) {
              const tens = d.bool(), right = tens ? `10*a+${k}` : `${10 * k}+a`, wrongs = tens ? [`a+${k}`, `a*${k}`, `10*(a+${k})`, `10+a+${k}`] : [`${k}+a`, `${k}*a`, `10*a+${k}`, `${10 * k}*a`];
              return pickX(d, `십의 자리의 숫자가 ${tens ? V('a') : k}, 일의 자리의 숫자가 ${tens ? k : V('a')}인 두 자리 자연수를 ${SAY}`, right, wrongs, {
                explain: `십의 자리의 숫자는 10이 몇 개인지를 나타낸다. ${tens ? `십의 자리의 숫자가 ${V('a')}이면 10 × ${V('a')}를 나타내므로` : `십의 자리의 숫자 ${k}${tail(k, '은/는')} ${10 * k}${tail(10 * k, '을/를')} 나타내므로`} 이 수는 ${xh(right)}이다.`
              });
            }
            if (n === 1) {
              const right = `100*a+${10 * k}+b`;
              return pickX(d, `백의 자리의 숫자가 ${V('a')}, 십의 자리의 숫자가 ${k}, 일의 자리의 숫자가 ${V('b')}인 세 자리 자연수를 ${SAY}`, right, [`100*a+${k}+b`, `a+${k}+b`, `100*a+10*b+${k}`, `a*${k}*b`], {
                explain: `백의 자리의 숫자 ${V('a')}는 100 × ${V('a')}를, 십의 자리의 숫자 ${k}${tail(k, '은/는')} ${10 * k}${tail(10 * k, '을/를')} 나타내므로 이 수는 ${xh(right)}이다.`
              });
            }
            const right = '10*a+b+0.1*c';
            return pickX(d, `십의 자리의 숫자가 ${V('a')}, 일의 자리의 숫자가 ${V('b')}, 소수 첫째 자리의 숫자가 ${V('c')}인 수를 ${SAY}`, right, ['a+b+0.1*c', '10*a+b+c', '100*a+10*b+c', '10*a+b+10*c'], {
              explain: `십의 자리의 숫자 ${V('a')}는 10 × ${V('a')}를, 소수 첫째 자리의 숫자 ${V('c')}는 0.1 × ${V('c')}를 나타내므로 이 수는 ${xh(right)}이다.`
            });
          }, { count: 3 }),
          T('situ-units', '두 단위로 나타낸 양을 한 단위의 식으로 나타내기', '①5', (d, n) => {
            // [큰 단위, 작은 단위, 몇 배, 큰 단위 뒤 '(으)로', 작은 단위 뒤 '(으)로', 작은 단위 뒤 '을/를', 큰 단위 뒤 '은/는', 작은 단위 뒤 '은/는', 헷갈리는 배수]
            const [big, small, k, bigAs, smallAs, obj, bigIs, smallIs, slip] = d.pick([['시간', '분', 60, '으로', '으로', '을', '은', '은', 100], ['m', 'cm', 100, '로', '로', '를', '는', '는', 10], ['kg', 'g', 1000, '으로', '으로', '을', '은', '은', 100], ['분', '초', 60, '으로', '로', '를', '은', '는', 100]]);
            const sp = (u) => (/^[a-z]/i.test(u) ? ' ' + u : u), amount = `${V('a')}${sp(big)} ${V('b')}${sp(small)}${obj}`;
            if (n === 0) {
              const right = `${k}*a+b`;
              return pickX(d, `${amount} ${small}${smallAs} 나타낸 것은?`, right, ['a+b', `a+${k}*b`, `${k}*(a+b)`, `${slip}*a+b`], {
                unit: small, explain: `1${sp(big)} = ${k}${sp(small)}이므로 ${V('a')}${sp(big)}${bigIs} ${withUnit(`${k}*a`, small)}이다. 여기에 ${V('b')}${sp(small)}${obj} 더하면 ${withUnit(right, small)}이다.`
              });
            }
            const right = `a+b:${k}`;
            return pickX(d, `${amount} ${big}${bigAs} 나타낸 것은?`, right, [`a+b*${k}`, `a:${k}+b`, `(a+b):${k}`, 'a+b'], {
              unit: big, explain: `${k}${sp(small)} = 1${sp(big)}이므로 ${V('b')}${sp(small)}${smallIs} ${withUnit(`b:${k}`, big)}이다. 여기에 ${V('a')}${sp(big)}${bigIs === '은' ? '을' : '를'} 더하면 ${withUnit(right, big)}이다.`
            });
          }, { count: 2 }),
          T('situ-discount', '할인되는 금액과 할인한 값을 식으로 나타내기', '①6', (d, n) => {
            const r = d.pick([10, 15, 20, 25, 30, 40]);
            if (n === 0) {
              const right = `a*[${r}|100]`;
              return pickX(d, `정가가 ${V('a')}원인 물건을 ${r} % 할인하여 팔 때, 할인되는 금액을 ${SAY}`, right, [`a*${r}`, `a:${r}`, `a-[${r}|100]`, `a+[${r}|100]`], {
                unit: '원', explain: `${r} %는 ${frac(r, 100)}이다. 할인되는 금액은 정가의 ${frac(r, 100)}이므로 ${withUnit(right, '원')}이다.`
              });
            }
            const right = `a-a*[${r}|100]`;
            return pickX(d, `정가가 ${V('a')}원인 물건을 ${r} % 할인하여 팔 때, 판매 가격을 ${SAY}`, right, [`a-${r}`, `a*[${r}|100]`, `a-[${r}|100]`, `a-a*${r}`], {
              unit: '원', explain: `할인되는 금액은 정가의 ${frac(r, 100)}인 ${withUnit(`a*[${r}|100]`, '원')}이다. 판매 가격은 정가에서 할인되는 금액을 뺀 ${withUnit(right, '원')}이다.`
            });
          }, { count: 2 }),
          T('situ-rate-letter', '비율이 문자로 주어진 양을 식으로 나타내기', '①7', (d, n) => {
            if (n === 0) {
              const P = 1000 * d.int(2, 9), right = `${P}+${P}*[a|100]`;
              return pickX(d, `원가가 ${P}원인 물건에 원가의 ${V('a')} %만큼 이익을 붙여 정가를 정할 때, 정가를 ${SAY}`, right, [`${P}+a`, `${P}*[a|100]`, `${P}+${P}*a`, `${P}+[a|100]`], {
                unit: '원', explain: `${V('a')} %는 ${frac(V('a'), 100)}이므로 이익은 ${withUnit(`${P}*[a|100]`, '원')}이다. 정가는 원가에 이익을 더한 ${withUnit(right, '원')}이다.`
              });
            }
            const right = 'a*[b|100]';
            return pickX(d, `전체 학생 ${V('a')}명 가운데 ${V('b')} %가 안경을 썼을 때, 안경을 쓴 학생 수를 ${SAY}`, right, ['a*b', 'a:b', 'a+[b|100]', '[a|100]+b', 'a*[100|b]'], {
              unit: '명', explain: `${V('b')} %는 ${frac(V('b'), 100)}이다. 안경을 쓴 학생 수는 전체 학생 수의 ${frac(V('b'), 100)}이므로 ${withUnit(right, '명')}이다.`
            });
          }, { count: 2 }),
          T('situ-salt', '소금물의 농도를 식으로 나타내기', '①8', (d) => {
            const W = 10 * d.int(4, 30), right = `[x|${W}]*100`;
            return pickX(d, `소금 ${V('x')} g이 녹아 있는 소금물 ${W} g의 농도를 ${SAY}`, right, [`[${W}|x]*100`, `[x|${W}]`, `x*${W}:100`, `[x|${W}+x]*100`], {
              unit: '%', explain: `(소금물의 농도) = (소금의 양) ÷ (소금물의 양) × 100 (%)이다. 소금물 ${W} g에 소금 ${V('x')} g이 녹아 있으므로 농도는 ${withUnit(right, '%')}이다.`
            });
          }),
          T('situ-dst', '거리·속력·시간을 식으로 나타내기', '①9', (d, n) => {
            const v = 10 * d.int(3, 9), t = d.int(2, 5);
            if (n === 0) {
              const right = `${v}*x`;
              return pickX(d, `시속 ${v} km로 ${V('x')}시간 동안 달린 거리를 ${SAY}`, right, [`${v}:x`, `x:${v}`, `${v}+x`], { unit: 'km', explain: `(거리) = (속력) × (시간)이므로 ${withUnit(right, 'km')}이다.` });
            }
            if (n === 1) {
              const right = `x:${v}`;
              return pickX(d, `${V('x')} km의 거리를 시속 ${v} km로 갈 때, 걸리는 시간을 ${SAY}`, right, [`${v}:x`, `${v}*x`, `x-${v}`], { unit: '시간', explain: `(시간) = (거리) ÷ (속력)이므로 ${withUnit(right, '시간')}이다.` });
            }
            const right = `x:${t}`;
            return pickX(d, `${V('x')} km의 거리를 일정한 속력으로 ${t}시간 만에 갔을 때의 속력을 ${SAY}`, right, [`${t}:x`, `x*${t}`, `x-${t}`], { unit: 'km', lead: '시속 ', explain: `(속력) = (거리) ÷ (시간)이므로 ${withUnit(right, 'km', '시속 ')}이다.` });
          }, { count: 3 }),
          T('situ-dst-left', '간 거리를 뺀 남은 거리를 식으로 나타내기', '①9 심9', (d) => {
            const v = d.int(2, 6), D = v * d.int(4, 9), right = `${D}-${v}*x`;
            return pickX(d, `${D} km 떨어진 곳을 향해 시속 ${v} km로 ${V('x')}시간 동안 걸었을 때, 남은 거리를 ${SAY}`, right, [`${v}*x-${D}`, `${D}-${v}:x`, `${D}-x:${v}`, `(${D}-${v})*x`], {
              unit: 'km', explain: `${V('x')}시간 동안 걸은 거리는 ${withUnit(`${v}*x`, 'km')}이다. 남은 거리는 전체 거리에서 걸은 거리를 뺀 ${withUnit(right, 'km')}이다.`
            });
          }),
          T('situ-tunnel', '기차가 터널을 완전히 통과하는 시간을 식으로 나타내기', '①10', (d) => {
            const v = 100 * d.int(4, 12), right = `(x+y):${v}`;
            return pickX(d, `길이가 ${V('x')} m인 기차가 분속 ${v} m로 달려 길이가 ${V('y')} m인 터널을 완전히 통과하는 데 걸리는 시간을 ${SAY}`, right, [`y:${v}`, `(y-x):${v}`, `x+y:${v}`, `${v}:(x+y)`], {
              unit: '분', explain: `기차의 맨 앞이 터널에 들어갈 때부터 맨 뒤가 터널을 빠져나올 때까지 기차는 (터널의 길이) + (기차의 길이)만큼 달린다. 달린 거리가 ${withUnit('x+y', 'm')}이므로 걸리는 시간은 ${withUnit(right, '분')}이다.`
            });
          }),
          T('situ-perimeter', '도형의 둘레의 길이를 식으로 나타내기', '①11', (d, n) => {
            if (n === 0) {
              const k = d.int(3, 12), two = d.bool(), hs = two ? 'y' : String(k), right = `2*(x+${hs})`;
              return pickX(d, `가로의 길이가 ${V('x')} cm, 세로의 길이가 ${two ? V('y') : k} cm인 직사각형의 둘레의 길이를 ${SAY}`, right, [`x+${hs}`, `2*x+${hs}`, `x*${hs}`, `4*(x+${hs})`], {
                unit: 'cm', figure: rectFig(['x', 'cm'], [hs, 'cm']),
                explain: `직사각형의 둘레의 길이는 가로의 길이와 세로의 길이의 합의 2배이므로 ${withUnit(right, 'cm')}이다.`
              });
            }
            const [name, k] = d.pick([['정삼각형', 3], ['정사각형', 4], ['정오각형', 5], ['정육각형', 6]]), right = `${k}*a`;
            return pickX(d, `한 변의 길이가 ${V('a')} cm인 ${name}의 둘레의 길이를 ${SAY}`, right, [`a+${k}`, 'a*a', `a:${k}`, `${k}+a*a`], {
              unit: 'cm', explain: `${name}은 ${k}개의 변의 길이가 모두 같으므로 둘레의 길이는 ${withUnit(right, 'cm')}이다.`
            });
          }, { count: 2 }),
          T('situ-area', '도형의 넓이와 부피를 식으로 나타내기', '①12', (d, n) => {
            const sq = `cm${sup(2)}`;
            if (n === 0) {
              const right = 'a*h:2';
              return pickX(d, `밑변의 길이가 ${V('a')} cm, 높이가 ${V('h')} cm인 삼각형의 넓이를 ${SAY}`, right, ['a*h', '(a+h):2', 'a*h*2', 'a+h:2'], {
                unit: sq, explain: `(삼각형의 넓이) = (밑변의 길이) × (높이) ÷ 2이므로 ${withUnit(right, sq)}이다.`
              });
            }
            if (n === 1) {
              const right = '(a+b)*h:2';
              return pickX(d, `그림과 같은 사다리꼴의 넓이를 ${SAY}`, right, ['(a+b)*h', 'a+b*h:2', 'a*b*h:2', '(a+b+h):2'], {
                unit: sq, figure: trapFig('a', 'b', 'h'),
                explain: `(사다리꼴의 넓이) = {(윗변의 길이) + (아랫변의 길이)} × (높이) ÷ 2이므로 ${withUnit(right, sq)}이다.`
              });
            }
            const [p, q] = d.until(() => [d.int(2, 6), d.int(2, 6)], ([x, y]) => x !== y), right = `a*${p}*${q}`;
            return pickX(d, `가로의 길이가 ${V('a')} cm, 세로의 길이가 ${p} cm, 높이가 ${q} cm인 직육면체의 부피를 ${SAY}`, right, [`a+${p}+${q}`, `2*(a*${p}+${p}*${q}+a*${q})`, `4*(a+${p}+${q})`, `a*${p}+${q}`], {
              unit: `cm${sup(3)}`, explain: `(직육면체의 부피) = (가로의 길이) × (세로의 길이) × (높이)이므로 ${withUnit(right, `cm${sup(3)}`)}이다.`
            });
          }, { count: 3 }),
          T('situ-mean', '평균을 식으로 나타내기', '①13', (d) => {
            if (d.bool()) {
              const right = '(x+y):2';
              return pickX(d, `두 번의 수학 시험에서 받은 점수가 각각 ${V('x')}점, ${V('y')}점일 때, 두 점수의 평균을 ${SAY}`, right, ['x+y:2', 'x+y', 'x*y:2', '(x+y)*2'], {
                unit: '점', explain: `평균은 점수의 합을 시험 횟수로 나눈 것이다. 두 점수의 합 전체를 2로 나누어야 하므로 괄호로 묶어 ${withUnit(right, '점')}으로 나타낸다.`
              });
            }
            const s = 5 * d.int(14, 19), right = `(${s}+x+y):3`;
            return pickX(d, `세 번의 수학 시험에서 받은 점수가 각각 ${s}점, ${V('x')}점, ${V('y')}점일 때, 세 점수의 평균을 ${SAY}`, right, [`${s}+x+y:3`, `${s}+x+y`, `(${s}+x+y):2`, `(x+y):2+${s}`], {
              unit: '점', explain: `평균은 점수의 합을 시험 횟수로 나눈 것이다. 세 점수의 합 전체를 3으로 나누어야 하므로 괄호로 묶어 ${withUnit(right, '점')}으로 나타낸다.`
            });
          }),
          T('situ-number', '수와 개수 사이의 관계를 식으로 나타내기', '①14', (d, n) => {
            const k = d.int(2, 5), c = d.int(2, 9);
            if (n === 0) {
              const form = d.int(0, 2), right = [`${k}*x+${c}`, `${k}*(x+${c})`, `${k}*x-${c}`][form];
              const text = [`어떤 수 ${V('x')}의 ${k}배보다 ${c}만큼 큰 수`, `어떤 수 ${V('x')}보다 ${c}만큼 큰 수의 ${k}배`, `어떤 수 ${V('x')}의 ${k}배보다 ${c}만큼 작은 수`][form];
              return pickX(d, `${text}를 ${SAY}`, right, [`${k}*x+${c}`, `${k}*(x+${c})`, `${k}*x-${c}`, `x+${k}+${c}`, `${k}*(x-${c})`], {
                explain: form === 1 ? `${V('x')}보다 ${c}만큼 큰 수는 ${xh(`x+${c}`)}이다. 이 수 전체를 ${k}배 하므로 괄호로 묶어 ${xh(right)}로 나타낸다.` : `${V('x')}의 ${k}배는 ${xh(`${k}*x`)}이다. 이 수보다 ${c}만큼 ${form === 0 ? '큰' : '작은'} 수는 ${xh(right)}이다.`
              });
            }
            const right = `x:2-${c}`;
            return pickX(d, `구슬 ${V('x')}개 가운데 절반을 동생에게 주고, 남은 구슬에서 ${c}개를 친구에게 주었을 때, 마지막에 남은 구슬의 수를 ${SAY}`, right, [`x:2+${c}`, `(x-${c}):2`, `x-2-${c}`, `2*x-${c}`], {
              unit: '개', explain: `절반을 주면 ${withUnit('x:2', '개')}가 남는다. 여기에서 ${c}개를 더 주었으므로 남은 구슬은 ${withUnit(right, '개')}이다.`
            });
          }, { count: 2 }),
          T('situ-claims', '상황을 식으로 나타낸 것의 옳고 그름', '①15', (d, n) => situClaims(d, 'x', n === 1, `다음 중 문자를 사용한 식으로 ${n === 1 ? '바르게 나타낸' : '잘못 나타낸'} 것은?`), { count: 2 }),
          T('situ-blanks', '식을 세우는 과정의 빈칸', '①16', (d) => {
            const p = 100 * d.int(4, 12), P = 1000 * d.int(5, 9);
            return M(`한 개에 ${p}원인 빵 ${V('x')}개를 사고 ${P}원을 냈을 때의 거스름돈을 식으로 나타내려고 한다. ㉠, ㉡에 알맞은 수는?`, [{ label: LAB[0], answer: P, signed: true }, { label: LAB[1], answer: p, signed: true }], {
              figure: ex(`(거스름돈) <i>=</i> ${box(LAB[0])} <i>${MINUS}</i> ${box(LAB[1])} <i>×</i> ${V('x')} (원)`, 3),
              explain: `(거스름돈) = (낸 돈) − (빵 한 개의 값) × (빵의 수)이므로 ㉠은 ${P}, ㉡은 ${p}이다.`,
              facts: { calc: [[String(P), 0], [String(p), 1]] }
            });
          })
        ]
      },
      {
        id: 'omit', title: '곱셈 기호와 나눗셈 기호의 생략', standard: STD1,
        types: [
          T('omit-mul', '수와 문자의 곱에서 곱셈 기호 생략하기', '①18', (d, n) => {
            const k = d.int(2, 9), TEXT = '다음 식을 곱셈 기호 ×를 생략하여 나타낸 것은?';
            if (n === 0) {
              // 수는 문자 앞에, 문자는 알파벳 차례로 쓴다.
              const src = d.pick([`b*(-${k})*a`, `a*(-${k})*b`, `y*x*(-${k})`]), [p, q] = src.includes('y') ? ['x', 'y'] : ['a', 'b'], right = `-${k}${p}${q}`;
              return pickX(d, TEXT, right, [`${p}-${k}${q}`, `${k}${p}${q}`, `${p}${q}-${k}`, `-${k}+${p}${q}`], {
                target: src, figure: xex(src), rule: 'omit-mul-number',
                explain: `수와 문자의 곱에서는 곱셈 기호를 생략하고 수를 문자 앞에 쓴다. 문자는 알파벳 차례로 쓰므로 ${xh(right)}이다.`
              });
            }
            if (n === 1) {
              // 1과 −1의 곱, 같은 문자의 곱
              const src = d.pick(['b*(-1)*a*b', '(-1)*a*b*b', 'y*x*(-1)*y']), [p, q] = src.includes('y') ? ['x', 'y'] : ['a', 'b'], right = `-${p}${q}^2`;
              return pickX(d, TEXT, right, [`-2${p}${q}`, `${p}${q}^2`, `-${p}^2${q}`, `-(${p}${q})^2`], {
                target: src, figure: xex(src), rule: 'omit-mul-one',
                explain: `(−1) × ${V(p)}는 −${V(p)}로 쓰고, 같은 문자의 곱 ${V(q)} × ${V(q)}는 거듭제곱 ${V(q)}${sup(2)}으로 나타낸다. 따라서 ${xh(right)}이다.`
              });
            }
            if (n === 2) {
              const src = d.pick([`x*${k}*y*x*x`, `x*x*y*${k}*x`, `y*x*x*${k}*x`]), right = `${k}x^3y`;
              return pickX(d, TEXT, right, [`${3 * k}xy`, `${k}xy^3`, `${k}x^2y`, `${k}+x^3y`], {
                target: src, figure: xex(src), rule: 'omit-mul-power',
                explain: `${V('x')}를 세 번 곱한 것은 ${V('x')}${sup(3)}으로 나타낸다(3${V('x')}가 아니다). 수를 문자 앞에 쓰면 ${xh(right)}이다.`
              });
            }
            const t = d.pick([1, 3, 7]), src = d.pick([`a*0.${t}*b`, `b*a*0.${t}`, `0.${t}*b*a`]), right = `0.${t}ab`;
            return pickX(d, TEXT, right, [{ h: `0.${V('a')}${V('b')}` }, `0.${t}+ab`, `0.${t}a+b`], {
              target: src, figure: xex(src), rule: 'omit-mul-decimal',
              explain: `0.${t}${tail(t, '과/와')} 문자의 곱에서는 곱셈 기호만 생략하고 0.${t}${tail(t, '은/는')} 그대로 쓴다. 따라서 ${xh(right)}이다.`
            });
          }, { count: 4 }),
          T('omit-paren', '괄호가 있는 곱에서 곱셈 기호 생략하기', '①19', (d, n) => {
            const k = d.int(2, 9), TEXT = '다음 식을 곱셈 기호 ×를 생략하여 나타낸 것은?';
            if (n === 0) {
              const src = `(x+y)*(-${k})`, right = `-${k}(x+y)`;
              return pickX(d, TEXT, right, [`x+y-${k}`, `-${k}x+y`, `${k}(x+y)`, `x-${k}y`], {
                target: src, figure: xex(src), rule: 'omit-paren-number',
                explain: `괄호가 있는 식과 수의 곱에서는 곱셈 기호를 생략하고 수를 괄호 앞에 쓴다. 괄호는 그대로 두므로 ${xh(right)}이다.`
              });
            }
            const src = d.pick([`(x+y)*(-${k})*x`, `x*(x+y)*(-${k})`]), right = `-${k}x(x+y)`;
            return pickX(d, TEXT, right, [`-${k}x^2+y`, `-${k}(x+y)+x`, `${k}x(x+y)`, `-${k}(x+y+x)`], {
              target: src, figure: xex(src), rule: 'omit-paren-letter',
              explain: `수와 문자를 괄호 앞에 쓰고 곱셈 기호를 생략한다. 괄호는 그대로 두므로 ${xh(right)}이다.`
            });
          }, { count: 2 }),
          T('omit-div', '나눗셈 기호를 생략하여 분수 꼴로 나타내기', '①20', (d, n) => {
            const k = d.int(2, 9), TEXT = '다음 식을 나눗셈 기호 ÷를 생략하여 나타낸 것은?';
            if (n === 0) {
              const top = d.bool(), src = top ? `a:${k}` : `${k}:a`, right = top ? `[a|${k}]` : `[${k}|a]`;
              return pickX(d, TEXT, right, [top ? `[${k}|a]` : `[a|${k}]`, `${k}a`, top ? `a-${k}` : `${k}-a`], {
                target: src, figure: xex(src), rule: 'omit-div-plain',
                explain: `나눗셈 기호를 생략할 때는 나누는 수나 문자를 분모로 하는 분수 꼴로 나타낸다. 나누는 것이 ${top ? k : V('a')}이므로 ${xh(right)}이다.`
              });
            }
            const letter = d.bool(), src = letter ? 'x:(-y)' : `x:(-${k})`, den = letter ? 'y' : String(k), right = `-[x|${den}]`;
            return pickX(d, TEXT, right, [`[x|${den}]`, `-[${den}|x]`, letter ? '-xy' : `-${den}x`, `x-${den}`], {
              target: src, figure: xex(src), rule: 'omit-div-negative',
              explain: `나누는 것을 분모로 하는 분수 꼴로 나타내고, 음의 부호는 분수 앞에 쓴다. 따라서 ${xh(right)}이다.`
            });
          }, { count: 2 }),
          T('omit-div-paren', '괄호가 있는 나눗셈을 분수 꼴로 나타내기', '①21', (d, n) => {
            const k = d.int(2, 9), c = d.int(1, 9), TEXT = '다음 식을 나눗셈 기호 ÷를 생략하여 나타낸 것은?';
            if (n === 0) {
              if (d.bool()) {
                const src = `(x+${c}):${k}`, right = `[x+${c}|${k}]`;
                return pickX(d, TEXT, right, [`x+[${c}|${k}]`, `[${k}|x+${c}]`, `${k}(x+${c})`, `[x|${k}]+${c}`], {
                  target: src, figure: xex(src), rule: 'omit-div-paren-top', explain: `괄호 안의 식 전체를 ${josa(k, '으로/로')} 나누므로 ${xh(`x+${c}`)} 전체가 분자가 된다. 따라서 ${xh(right)}이다.`
                });
              }
              const src = `(a-b):(-${k})`, right = `-[a-b|${k}]`;
              return pickX(d, TEXT, right, [`[a-b|${k}]`, `a-[b|${k}]`, `-${k}(a-b)`, `-[${k}|a-b]`], {
                target: src, figure: xex(src), rule: 'omit-div-paren-top', explain: `괄호 안의 식 전체가 분자가 되고, 음의 부호는 분수 앞에 쓴다. 따라서 ${xh(right)}이다.`
              });
            }
            const src = `a:(b+${c})`, right = `[a|b+${c}]`;
            return pickX(d, TEXT, right, [`[a|b]+${c}`, `[b+${c}|a]`, `a(b+${c})`, `[a+${c}|b]`], {
              target: src, figure: xex(src), rule: 'omit-div-paren-bottom', explain: `${V('a')}를 괄호 안의 식 전체로 나누므로 ${xh(`b+${c}`)} 전체가 분모가 된다. 따라서 ${xh(right)}이다.`
            });
          }, { count: 2 }),
          T('omit-div-twice', '나눗셈이 두 번 있거나 괄호 안에 곱셈·나눗셈이 있는 식', '①22', (d, n) => {
            const k = d.int(2, 9), TEXT = '다음 식을 곱셈 기호 ×와 나눗셈 기호 ÷를 생략하여 나타낸 것은?';
            if (n === 0) {
              const num = d.bool(), src = num ? `x:${k}:y` : 'a:b:c', right = num ? `[x|${k}y]` : '[a|bc]';
              return pickX(d, TEXT, right, num ? [`[xy|${k}]`, `[${k}x|y]`, `[${k}y|x]`] : ['[ac|b]', '[ab|c]', '[bc|a]'], {
                target: src, figure: xex(src), rule: 'omit-div-twice',
                explain: `나눗셈은 앞에서부터 차례로 계산한다. ${num ? `${xh(`x:${k}`)} = ${xh(`[x|${k}]`)}이고, 이것을 다시 ${V('y')}로 나누면` : `${xh('a:b')} = ${xh('[a|b]')}이고, 이것을 다시 ${V('c')}로 나누면`} ${xh(right)}이다.`
              });
            }
            if (n === 1) {
              const src = 'x:(y:z)', right = '[xz|y]';
              return pickX(d, TEXT, right, ['[x|yz]', '[xy|z]', '[y|xz]'], {
                target: src, figure: xex(src), rule: 'omit-div-inner-div',
                explain: `괄호 안을 먼저 나타내면 ${xh('y:z')} = ${xh('[y|z]')}이다. ${V('x')}를 ${xh('[y|z]')}로 나누는 것은 그 역수 ${xh('[z|y]')}를 곱하는 것과 같으므로 ${xh(right)}이다.`
              });
            }
            const num = d.bool(), src = num ? `a:(${k}*b)` : 'x:(y*z)', right = num ? `[a|${k}b]` : '[x|yz]';
            return pickX(d, TEXT, right, num ? [`[ab|${k}]`, `[${k}b|a]`, `${k}ab`] : ['[xz|y]', '[yz|x]', 'xyz'], {
              target: src, figure: xex(src), rule: 'omit-div-inner-mul',
              explain: `괄호 안을 먼저 나타내면 ${num ? `${xh(`${k}*b`)} = ${xh(`${k}b`)}` : `${xh('y*z')} = ${xh('yz')}`}이다. 이것 전체로 나누므로 ${xh(right)}이다.`
            });
          }, { count: 3 }),
          T('omit-muldiv', '곱셈과 나눗셈이 섞인 식에서 기호 생략하기', '①23', (d, n) => {
            const k = d.int(2, 9), c = d.until(() => d.int(1, 9), (v) => v !== k), TEXT = '다음 식을 곱셈 기호 ×와 나눗셈 기호 ÷를 생략하여 나타낸 것은?';
            if (n === 0) {
              const num = d.bool(), src = num ? `x:y*${k}` : 'a:b*c', right = num ? `[${k}x|y]` : '[ac|b]';
              return pickX(d, TEXT, right, num ? [`[x|${k}y]`, `[xy|${k}]`, `[${k}y|x]`] : ['[a|bc]', '[ab|c]', '[bc|a]'], {
                target: src, figure: xex(src), rule: 'omit-muldiv-order',
                explain: `곱셈과 나눗셈이 섞인 식은 앞에서부터 차례로 나타낸다. ${num ? `${xh('x:y')} = ${xh('[x|y]')}이고, 여기에 ${k}${tail(k, '을/를')} 곱하면` : `${xh('a:b')} = ${xh('[a|b]')}이고, 여기에 ${V('c')}를 곱하면`} ${xh(right)}이다. 뒤의 곱셈을 먼저 계산하지 않는다.`
              });
            }
            if (n === 1) {
              if (d.bool()) {
                const src = `x*${k}*x:y`, right = `[${k}x^2|y]`;
                return pickX(d, TEXT, right, [`[${2 * k}x|y]`, `${k}x^2y`, `[x^2|${k}y]`, `[${k}x|y^2]`], {
                  target: src, figure: xex(src), rule: 'omit-muldiv-power', explain: `${xh(`x*${k}*x`)} = ${xh(`${k}x^2`)}이고, 이것을 ${V('y')}로 나누면 ${xh(right)}이다.`
                });
              }
              const src = 'y*y*(-1):x', right = '-[y^2|x]';
              return pickX(d, TEXT, right, ['-[2y|x]', '[y^2|x]', '-[x|y^2]', '-xy^2'], {
                target: src, figure: xex(src), rule: 'omit-muldiv-power', explain: `${xh('y*y*(-1)')} = ${xh('-y^2')}이고, 이것을 ${V('x')}로 나누면 ${xh(right)}이다.`
              });
            }
            const src = `(x+${c}):y*${k}`, right = `[${k}(x+${c})|y]`;
            return pickX(d, TEXT, right, [`[x+${c}|${k}y]`, `[${k}x+${c}|y]`, `x+[${k * c}|y]`, `[y|${k}(x+${c})]`], {
              target: src, figure: xex(src), rule: 'omit-muldiv-paren',
              explain: `${xh(`(x+${c}):y`)} = ${xh(`[x+${c}|y]`)}이고, 여기에 ${k}${tail(k, '을/를')} 곱하면 ${xh(right)}이다. 괄호는 그대로 둔다.`
            });
          }, { count: 3 }),
          T('omit-sum', '덧셈·뺄셈으로 이어진 식에서 기호 생략하기', '①24', (d, n) => {
            const [p, q] = d.until(() => [d.int(2, 9), d.int(2, 9)], ([x, y]) => x !== y), c = d.int(1, 9), e = d.until(() => d.int(1, 9), (v) => v !== c);
            const TEXT = '다음 식을 곱셈 기호 ×와 나눗셈 기호 ÷를 생략하여 나타낸 것은?';
            if (n === 0) {
              const src = `${p}*a-${q}*(-b)`, right = `${p}a+${q}b`;
              return pickX(d, TEXT, right, [`${p}a-${q}b`, `${p}a-${q}-b`, `${p}a+${q}-b`, `${p * q}ab`], {
                target: src, figure: xex(src), rule: 'omit-sum-mul',
                explain: `곱셈을 먼저 나타낸다. ${xh(`${p}*a`)} = ${xh(`${p}a`)}, ${xh(`${q}*(-b)`)} = ${xh(`-${q}b`)}이므로 ${xh(`${p}a-(-${q}b)`)} = ${xh(right)}이다.`
              });
            }
            if (n === 1) {
              const src = `a:${p}+b:(-${q})`, right = `[a|${p}]-[b|${q}]`;
              return pickX(d, TEXT, right, [`[a|${p}]+[b|${q}]`, `[a-b|${p + q}]`, `${p}a-${q}b`, `[a+b|${p * q}]`], {
                target: src, figure: xex(src), rule: 'omit-sum-div',
                explain: `나눗셈을 먼저 나타낸다. ${xh(`a:${p}`)} = ${xh(`[a|${p}]`)}, ${xh(`b:(-${q})`)} = ${xh(`-[b|${q}]`)}이므로 ${xh(right)}이다.`
              });
            }
            if (n === 2) {
              const src = `x-y:${p}`, right = `x-[y|${p}]`;
              return pickX(d, TEXT, right, [`[x-y|${p}]`, `[x|${p}]-y`, `x-${p}y`], {
                target: src, figure: xex(src), rule: 'omit-sum-one-div',
                explain: `나눗셈을 뺄셈보다 먼저 계산하므로 ${p}로 나누는 것은 ${V('y')}뿐이다. 따라서 ${xh(right)}이다. ${xh(`[x-y|${p}]`)}는 ${xh(`(x-y):${p}`)}${tail(p, '을/를')} 나타낸다.`.replace(`${p}로`, josa(p, '으로/로'))
              });
            }
            const src = `(a-${c}):${p}+(a-${e})*${q}`, right = `[a-${c}|${p}]+${q}(a-${e})`;
            return pickX(d, TEXT, right, [`[a-${c}|${p}]+${q}a-${e}`, `a-[${c}|${p}]+${q}(a-${e})`, `[a-${c}+${q}(a-${e})|${p}]`], {
              target: src, figure: xex(src), rule: 'omit-sum-paren',
              explain: `${xh(`(a-${c}):${p}`)} = ${xh(`[a-${c}|${p}]`)}, ${xh(`(a-${e})*${q}`)} = ${xh(`${q}(a-${e})`)}이므로 ${xh(right)}이다. 괄호 안의 식은 한 덩어리로 다룬다.`
            });
          }, { count: 4 }),
          T('omit-claims', '기호를 생략하여 나타낸 것의 옳고 그름', '①25 심4', (d, n) => {
            const k = d.int(2, 9), p = d.int(2, 4), q = d.int(2, 4), t = d.pick([1, 3, 7]);
            const pool = [
              ['x*(-1)*y', '-xy', 'x-y'], [`0.${t}*x`, `0.${t}x`, { h: `0.${V('x')}` }], [`${p}*x*(-${q})*x`, `-${p * q}x^2`, `-${p * q}x`], [`x-y:${k}`, `x-[y|${k}]`, `[x-y|${k}]`],
              ['x:(y*z)', '[x|yz]', '[xz|y]'], [`x:y*${k}`, `[${k}x|y]`, `[x|${k}y]`], ['a*a*a', 'a^3', '3a'], [`(a+b):${k}`, `[a+b|${k}]`, `a+[b|${k}]`],
              [`a*b:(-${k})*b`, `-[ab^2|${k}]`, `-${k}ab^2`], ['a:b:c', '[a|bc]', '[ac|b]'], [`(a+b)*${k}`, `${k}(a+b)`, `${k}a+b`], [`x:y-${k}`, `[x|y]-${k}`, `[x|y-${k}]`]
            ];
            return eqQ(d, `곱셈 기호와 나눗셈 기호를 생략하여 나타낸 것으로 ${n === 0 ? '옳은' : '옳지 않은'} 것은?`, pool, n === 0, { lead: '곱셈과 나눗셈은 앞에서부터 차례로 나타내고, 덧셈과 뺄셈의 기호는 생략하지 않는다. ' });
          }, { count: 2 }),
          T('omit-restore', '분수 꼴로 나타낸 식을 곱셈 기호와 나눗셈 기호를 사용하여 나타내기', '①26', (d) => {
            const k = d.int(2, 9), top = d.bool(), src = top ? `[${k}a|b]` : `[a|${k}b]`, right = top ? `${k}*a:b` : `a:${k}:b`;
            return pickX(d, '다음 식을 곱셈 기호 ×와 나눗셈 기호 ÷를 사용하여 나타낸 것은?', right, top ? [`${k}:a*b`, `${k}*b:a`, `${k}:a:b`, `a:${k}*b`] : [`a:${k}*b`, `a*${k}:b`, `${k}*b:a`, `a*${k}*b`], {
              target: src, figure: xex(src),
              explain: top ? `분자 ${xh(`${k}a`)}는 ${xh(`${k}*a`)}이고, 분모 ${V('b')}로 나누므로 ${xh(right)}이다.` : `분모 ${xh(`${k}b`)}는 ${xh(`${k}*b`)}이다. 분모 전체로 나누어야 하므로 ${k}${tail(k, '과/와')} ${V('b')}로 차례로 나누어 ${xh(right)}로 나타낸다. ${xh(`a:${k}*b`)}는 ${xh(`[ab|${k}]`)}이다.`
            });
          }),
          T('omit-same', '같은 식과 같지 않은 식 가리기', '①27', (d) => {
            const k = d.pick([2, 3]), v = d.pick(['x', 'a']), target = X(`${k}${v}`);
            const rows = d.shuffle([`${k}*${v}`, `${v}*${k}`, k === 2 ? `${v}+${v}` : `${v}+${v}+${v}`, k === 2 ? `${v}*${v}` : `${v}*${v}*${v}`]), truth = rows.map((r) => sameX(X(r), target));
            return C(`다음 중 ${xh(`${k}${v}`)}와 같은 식이 아닌 것은?`, rows.map(xh), truth.indexOf(false), {
              explain: `${xh(`${k}${v}`)}는 ${xh(`${k}*${v}`)}, 곧 ${V(v)}를 ${k}번 더한 것이다. ${V(v)}를 ${k}번 곱한 것은 ${xh(`${v}^${k}`)}이다.`,
              facts: { truth, want: false }
            });
          }),
          T('omit-situ-claims', '상황을 기호를 생략한 식으로 나타낸 것의 옳고 그름', '①15', (d) => {
            const wantTrue = d.bool();
            return situClaims(d, 'o', wantTrue, `다음 중 곱셈 기호와 나눗셈 기호를 생략한 식으로 ${wantTrue ? '바르게 나타낸' : '잘못 나타낸'} 것은?`);
          })
        ]
      },
      {
        id: 'value', title: '식의 값', standard: STD1,
        types: [
          T('value-linear', '문자가 하나인 식에 수를 대입하여 식의 값 구하기', '①28·29·30', (d, n) => {
            // 차례마다 넣는 수가 다르다: 양의 정수, 음의 정수, 분수(값은 정수), 분수(값도 분수).
            const v = d.pick(['a', 'x']);
            const [src, env] = d.until(() => {
              const p = d.int(2, 6), c = d.int(1, 9), q = d.pick([2, 3, 4, 5]), m = co(d, q, 1, q - 1), s = pm(d);
              if (n === 0) return [d.bool() ? `${p}${v}-${c}` : `${c}-${p}${v}`, { [v]: Q(d.int(2, 6)) }];
              if (n === 1) return [d.pick([`${p}${v}+${c}`, `-${v}+${c}`, `-${p}${v}-${c}`, `${c}-${p}${v}`]), { [v]: Q(-d.int(1, 5)) }];
              if (n === 2) return d.bool() ? [`${q * d.int(1, 3)}${v}-${c}`, { [v]: Q(s * m, q) }] : [`[${m}|${q}]${v}-${c}`, { [v]: Q(s * q * d.int(1, 3)) }];
              return [d.bool() ? `${co(d, q, 2, 7)}${v}+${c}` : `${co(d, q, 2, 7)}${v}-${c}`, { [v]: Q(s * m, q) }];
            }, ([e, env0]) => valueOK(e, env0, n === 3 ? 'frac' : 'int'));
            return valueQ(src, env, n === 3 ? 'frac' : 'int', { rule: 'value-linear-' + n, lead: n === 1 ? '음수를 대입할 때는 괄호를 사용한다. ' : '' });
          }, { count: 4 }),
          T('value-pow-neg', '거듭제곱이 있는 식에 음수 대입하기', '①31', (d, n) => {
            const v = d.pick(['a', 'x']), k = d.int(2, n === 0 ? 5 : 3), c = d.int(2, 4), env = { [v]: Q(-k) };
            const srcs = d.shuffle(n === 0 ? [`${v}^2`, `-${v}^2`, `(-${v})^2`] : [`${v}^3`, `(-${v})^3`, `-${c}${v}^2`]);
            return M(`${given(env)}일 때, ㉠, ㉡, ㉢의 값은?`, srcs.map((s, i) => ({ label: LAB[i], answer: xv(s, env).p, signed: true })), {
              figure: xtagged(srcs),
              explain: `음수를 대입할 때는 괄호를 사용한다. ${srcs.map((s, i) => `${LAB[i]} ${worked(s, env)}`).join(', ')}이다.`,
              facts: { calc: srcs.map((s, i) => [xjs(s, env), i]), rule: 'value-pow-neg-' + n }
            });
          }, { count: 2 }),
          T('value-pow-poly', '거듭제곱이 있는 다항식에 음수 대입하기', '①31', (d) => {
            const [src, env] = d.until(() => { const p = d.int(2, 5), c = d.int(1, 9); return [d.pick([`-x^2-${p}x`, 'x^3-x^2', `x^2+${p}x-${c}`, `-x^2+${p}x+${c}`]), { x: Q(-d.int(1, 4)) }]; }, ([e, env0]) => valueOK(e, env0, 'int'));
            return valueQ(src, env, 'int', { rule: 'value-pow-poly', lead: '음수를 대입할 때는 괄호를 사용한다. ' });
          }),
          T('value-pow-frac', '거듭제곱이 있는 식에 음의 분수 대입하기', '①32', (d, n) => {
            const q = d.pick(n === 0 ? [2, 3, 4, 5] : [2, 3]), m = n === 0 ? 1 : co(d, q, 1, 2), env = { x: Q(-m, q) };
            const src = d.pick(n === 0 ? ['x^2', '-x^2', '(-x)^2'] : ['x^3', '-x^3', '(-x)^3']);
            return valueQ(src, env, 'frac', { rule: 'value-pow-frac-' + n, lead: '분수를 대입할 때는 괄호를 사용하고, 분자와 분모를 각각 거듭제곱한다. ' });
          }, { count: 2 }),
          T('value-fracform', '분자에 문자가 있는 분수 꼴 식의 값 구하기', '①33', (d, n) => {
            const kind = n === 0 ? 'int' : 'frac';
            const [src, env] = d.until(() => {
              const k = d.int(2, 6), c = d.int(1, 9);
              if (d.bool()) return [n === 0 ? `[x+${c}|${k}]` : `-[x|${k}]-${c}`, { x: Q(-d.int(1, 9)) }];
              return [`[a-b|${k}]`, { a: Q(-d.int(1, 6)), b: Q(d.int(1, 6)) }];
            }, ([e, env0]) => valueOK(e, env0, kind));
            return valueQ(src, env, kind, { rule: 'value-fracform-' + n });
          }, { count: 2 }),
          T('value-denom', '분모에 문자가 있는 식의 값 구하기', '①34 심22', (d, n) => {
            if (n === 0) {
              const [src, env] = d.until(() => { const x = nz(d, -6, 6), c = d.int(1, 6), k = d.int(2, 24); return d.bool() ? [`-[${k}|x]`, { x: Q(x) }, x] : [`[${k}|a+${c}]`, { a: Q(x) }, x + c]; }, ([e, env0, den]) => Math.abs(den) > 1 && valueOK(e, env0, 'int') && Math.abs(xv(e, env0).p) > 1);
              return valueQ(src, env, 'int', { rule: 'value-denom-one' });
            }
            if (n === 1) {
              const env = d.until(() => ({ a: Q(-d.int(1, 5)), b: Q(d.int(2, 6)) }), (e) => valueOK('[a|b]+[b|a]', e, 'frac') && gcd(e.a.p, e.b.p) <= 2);
              return valueQ('[a|b]+[b|a]', env, 'frac', { rule: 'value-denom-two' });
            }
            // 분모가 식이고, 대입하면 분모가 음수가 된다.
            const [src, env] = d.until(() => { const x = d.int(2, 3), y = -d.int(2, 5), c = d.int(2, 3), den = x * x + c * y; return [`xy-[${Math.abs(den) * d.int(1, 3)}|x^2+${c}y]`, { x: Q(x), y: Q(y) }, den]; }, ([e, env0, den]) => den < -1 && valueOK(e, env0, 'int'));
            return valueQ(src, env, 'int', { rule: 'value-denom-expr' });
          }, { count: 3 }),
          T('value-two', '문자가 둘인 식에 수를 대입하여 식의 값 구하기', '①35', (d, n) => {
            const [src, env] = d.until(() => {
              const p = d.int(2, 4), q = d.int(2, 4), s = pm(d);
              return [n === 0 ? d.pick([`${p}a-b`, `${p}a+${q}b`, `-a+${q}b`]) : d.pick([`a^2-${p}ab`, `${p}a^2+${q}b`, 'a^2-ab-b^2']), { a: Q(s * d.int(1, 4)), b: Q(-s * d.int(1, 5)) }];
            }, ([e, env0]) => valueOK(e, env0, 'int') && Math.abs(env0.a.p) !== Math.abs(env0.b.p));
            return valueQ(src, env, 'int', { rule: 'value-two-' + n, lead: n === 1 ? '음수를 대입할 때는 괄호를 사용한다. ' : '' });
          }, { count: 2 }),
          T('value-denom-frac', '분모에 있는 문자에 분수 대입하기', '①36 심23', (d, n) => {
            const RECIP = '분모에 분수를 대입할 때는 나눗셈으로 고쳐 역수를 곱한다. ';
            if (n === 0) {
              const [src, env] = d.until(() => { const q = d.int(2, 6), m = co(d, q, 1, q - 1); return [`[${m * d.int(1, 6)}|a]`, { a: Q(pm(d) * m, q) }]; }, ([e, env0]) => valueOK(e, env0, 'int'));
              return valueQ(src, env, 'int', { rule: 'value-denom-frac-one', lead: RECIP });
            }
            const [src, env] = d.until(() => { const p = d.int(2, 6), q = d.int(2, 6); return [`[${p}|a]-[${q}|b]`, { a: Q(pm(d), d.int(2, 5)), b: Q(pm(d), d.int(2, 5)) }]; }, ([e, env0]) => valueOK(e, env0, 'int') && (env0.a.p < 0 || env0.b.p < 0) && env0.a.q !== env0.b.q);
            return valueQ(src, env, 'int', { rule: 'value-denom-frac-two', lead: RECIP });
          }, { count: 2 }),
          T('value-frac-sq', '곱과 제곱이 있는 식에 분수 대입하기', '①37', (d, n) => {
            const kind = n === 0 ? 'int' : 'frac';
            const [src, env] = d.until(() => {
              const q = d.pick([2, 3]), k = d.int(2, 6), c = d.int(1, 6), s = pm(d);
              if (n === 0) return d.bool() ? [`${q * q * d.int(1, 2)}a^2b^2`, { a: Q(-1, q), b: Q(s * d.int(2, 3)) }] : [`a^2+ab-${c}`, { a: Q(-2 * q), b: Q(s, q) }];
              return d.bool() ? [`-${k}x(x+y)`, { x: Q(1, q), y: Q(-d.int(1, 2)) }] : ['b^2-[b|a]', { a: Q(-2 * d.int(1, 2)), b: Q(1, q) }];
            }, ([e, env0]) => valueOK(e, env0, kind));
            return valueQ(src, env, kind, { rule: 'value-frac-sq-' + n });
          }, { count: 2 }),
          T('value-odd', '식의 값이 나머지와 다른 것 찾기', '①38 심19', (d) => {
            const v = d.pick(['a', 'x']), k = d.int(2, 3), env = { [v]: Q(-k) }, cube = k * k * k;
            // 값이 k³ 인 식 셋과, 부호를 잘못 다루면 같아 보이는 식 하나(값은 −k³)
            const same = d.shuffle([`-${v}^3`, `(-${v})^3`, `${k}${v}^2`, `-${k * k}${v}`]).slice(0, 3), odd = d.pick([`${v}^3`, `-${k}${v}^2`, `${k * k}${v}`]), rows = d.shuffle(same.concat([odd]));
            return C(`${given(env)}일 때, 다음 중 식의 값이 나머지 셋과 다른 것은?`, rows.map(xh), rows.indexOf(odd), {
              explain: `음수를 대입할 때는 괄호를 사용한다. ${rows.map((r) => worked(r, env)).join(', ')}이다.`,
              facts: { claimed: rows.map((r) => [xjs(r, env), cube]), claimedWant: false }
            });
          }),
          T('value-max', '식의 값이 가장 큰 것·가장 작은 것 고르기', '①39', (d) => {
            const big = d.bool();
            const [rows, env] = d.until(() => {
              const p = d.int(2, 4), q = d.int(2, 3), a = -d.int(2, 3), b = d.until(() => d.int(2, 5), (v) => v !== -a);
              return [d.shuffle([`-${p}a+${q}b`, `b^2-${p}a`, `[${6 * q}|a]-[b|${q}]`, '[a+b|ab]', `a^2-${p}b`, `ab+${p}`]).slice(0, 4), { a: Q(a), b: Q(b) }];
            }, ([list, env0]) => list.every((r) => xv(r, env0)) && distinct(list.map((r) => xv(r, env0))));
            const values = rows.map((r) => fl(xv(r, env))), at = values.indexOf(big ? Math.max(...values) : Math.min(...values));
            return C(`${given(env)}일 때, 다음 중 식의 값이 가장 ${big ? '큰' : '작은'} 것은?`, rows.map(xh), at, {
              explain: `${rows.map((r) => `${xh(r)} = ${worked(r, env)}`).join(', ')}이다.`,
              facts: { rank: { values, nth: big ? 1 : 4 } }
            });
          }),
          T('value-sign', '문자의 부호만 알 때 식의 값의 부호', '①40', (d) => {
            const p = d.int(2, 5), k = d.int(2, 9), pos = d.bool();
            const POS = [`-${p}a`, 'a^2', '-a^3', '(-a)^2', `-[a|${k}]`, `${p}a^2`], NEG = [`${p}a`, `[a|${k}]`, `-${p}a^2`, `-[a^2|${k}]`, 'a^3', '-(-a)^2'];
            const rows = d.shuffle(d.shuffle(pos ? POS : NEG).slice(0, 1).concat(d.shuffle(pos ? NEG : POS).slice(0, 3)));
            // 음수 셋을 넣어 본 값의 부호가 모두 같으면 그 부호로 정한다.
            const signOf = (r) => { const s = [Q(-1), Q(-3), Q(-2, 5)].map((x) => Math.sign(xv(r, { a: x }).p)); if (new Set(s).size !== 1) throw new Error('부호가 정해지지 않는 식'); return s[0]; };
            const signs = rows.map(signOf), truth = signs.map((s) => (s > 0) === pos);
            return C(`${V('a')}가 음수일 때, 다음 중 식의 값이 항상 ${pos ? '양수' : '음수'}인 것은?`, rows.map(xh), truth.indexOf(true), {
              explain: `${V('a')}가 음수이면 ${xh('a^2')}은 양수, ${xh('a^3')}은 음수이고, 음수에 음수를 곱하면 양수가 된다. 차례로 ${signs.map((s) => (s > 0 ? '양수' : '음수')).join(', ')}이다.`,
              facts: { truth, want: true }
            });
          }),
          T('value-formula', '생활 속 공식에 수를 대입하기', '①41 심17', (d, n) => {
            if (n === 1) {
              const f = 32 + 9 * d.pick([-2, -1, 1, 2, 3, 4, 5, 6, 7]), v = Q(5 * (f - 32), 9);
              return N(`화씨온도 ${V('x')} °F를 섭씨온도로 나타내면 ${nb(frac(5, 9) + `(${V('x')} − 32)`)} °C이다. 화씨온도 ${f} °F를 섭씨온도로 나타내면 몇 °C인가?`, v.p, {
                unit: '°C', signed: true,
                explain: `${V('x')} = ${f}${tail(f, '을/를')} 대입하면 ${frac(5, 9)} × (${f} − 32) = ${frac(5, 9)} × ${px(Q(f - 32)).replace(/^\(\+(.*)\)$/, '$1')} = ${tx(v)}이므로 ${tx(v)} °C이다.`,
                facts: { value: `(5/9)*(${f}-32)`, rule: 'value-formula-1' }
              });
            }
            const t = 5 * d.pick([-2, -1, 1, 2, 3, 4, 5, 6]), speed = 331 + 0.6 * t, s = d.int(2, 5), told = `기온이 ${V('x')} °C일 때, 공기 중에서 소리의 속력은 초속 ${nb(`(331 + 0.6${V('x')})`)} m이다.`;
            const put = `${V('x')} = ${tx(Q(t))}${tail(Math.abs(t), '을/를')} 대입하면 331 + 0.6 × ${px(Q(t)).replace(/^\(\+(.*)\)$/, '$1')} = ${Math.round(speed)}`;
            if (n === 0) {
              return N(`${told} 기온이 ${tx(Q(t))} °C일 때, 소리의 속력은 초속 몇 m인가?`, Math.round(speed), {
                unit: 'm', explain: `${put}이므로 초속 ${Math.round(speed)} m이다.`, facts: { value: `331+0.6*${js(Q(t))}`, rule: 'value-formula-0' }
              });
            }
            return N(`${told} 기온이 ${tx(Q(t))} °C일 때, 소리가 ${s}초 동안 가는 거리는 몇 m인가?`, Math.round(speed) * s, {
              unit: 'm', explain: `${put}이므로 소리의 속력은 초속 ${Math.round(speed)} m이다. ${s}초 동안 가는 거리는 ${Math.round(speed)} × ${s} = ${Math.round(speed) * s} (m)이다.`,
              facts: { value: `(331+0.6*${js(Q(t))})*${s}`, rule: 'value-formula-2' }
            });
          }, { count: 3 }),
          T('value-shape', '도형의 넓이를 식으로 나타내고 식의 값 구하기', '①42 심15', (d, n) => {
            const sq = `cm${sup(2)}`;
            if (n === 0) {
              const [a, b, h] = d.until(() => [d.int(2, 7), d.int(4, 12), d.int(2, 9)], ([x, y, z]) => x < y && ((x + y) * z) % 2 === 0), env = { a: Q(a), b: Q(b), h: Q(h) };
              return N(`그림과 같은 사다리꼴에서 ${given(env)}일 때, 넓이는 몇 ${sq}인가?`, (a + b) * h / 2, {
                unit: sq, figure: trapFig('a', 'b', 'h'),
                explain: `사다리꼴의 넓이는 ${withUnit('[(a+b)h|2]', sq)}이다. ${givenJ(env, '을/를')} 대입하면 ${frac(`(${a} + ${b}) × ${h}`, 2)} = ${(a + b) * h / 2}이다.`,
                facts: { value: `(${a}+${b})*${h}/2`, unseen: [2] }
              });
            }
            if (n === 1) {
              const [a, b] = d.until(() => [d.int(3, 12), d.int(3, 12)], ([x, y]) => x !== y && (x * y) % 2 === 0), env = { a: Q(a), b: Q(b) };
              return N(`두 대각선의 길이가 각각 ${V('a')} cm, ${V('b')} cm인 마름모에서 ${given(env)}일 때, 넓이는 몇 ${sq}인가?`, a * b / 2, {
                unit: sq, explain: `마름모의 넓이는 두 대각선의 길이의 곱의 반이므로 ${withUnit('[ab|2]', sq)}이다. ${givenJ(env, '을/를')} 대입하면 ${frac(`${a} × ${b}`, 2)} = ${a * b / 2}이다.`,
                facts: { value: `${a}*${b}/2`, unseen: [2] }
              });
            }
            const [a, b, c] = d.until(() => [d.int(2, 6), d.int(2, 6), d.int(2, 6)], (v) => new Set(v).size === 3), env = { a: Q(a), b: Q(b), c: Q(c) }, S = 2 * (a * b + b * c + c * a);
            return N(`가로의 길이가 ${V('a')} cm, 세로의 길이가 ${V('b')} cm, 높이가 ${V('c')} cm인 직육면체에서 ${given(env)}일 때, 겉넓이는 몇 ${sq}인가?`, S, {
              unit: sq, explain: `직육면체에는 넓이가 ${xh('ab')}, ${xh('bc')}, ${xh('ca')}인 면이 2개씩 있으므로 겉넓이는 ${withUnit('2(ab+bc+ca)', sq)}이다. ${givenJ(env, '을/를')} 대입하면 2 × (${a * b} + ${b * c} + ${c * a}) = ${S}이다.`,
              facts: { value: `2*(${a}*${b}+${b}*${c}+${c}*${a})`, unseen: [2] }
            });
          }, { count: 3 }),
          T('value-situ', '상황을 식으로 나타내고 식의 값 구하기', '①43', (d, n) => {
            if (n === 0) {
              const [p, q, a, b, P] = d.until(() => [100 * d.int(5, 9), 100 * d.int(10, 15), d.int(2, 4), d.int(1, 3), 1000 * d.int(5, 9)], ([x, y, k, m, z]) => z - x * k - y * m >= 100), rest = P - p * a - q * b;
              return N(`한 자루에 ${p}원인 볼펜 ${V('a')}자루와 한 권에 ${q}원인 공책 ${V('b')}권을 사고 ${P}원을 냈다. ${nb(`${V('a')} = ${a}`)}, ${nb(`${V('b')} = ${b}`)}일 때, 거스름돈은 얼마인가?`, rest, {
                unit: '원', explain: `거스름돈은 ${withUnit(`${P}-${p}a-${q}b`, '원')}이다. ${nb(`${V('a')} = ${a}`)}, ${nb(`${V('b')} = ${b}`)}${tail(b, '을/를')} 대입하면 ${P} − ${p} × ${a} − ${q} × ${b} = ${rest}이다.`,
                facts: { value: `${P}-${p}*${a}-${q}*${b}` }
              });
            }
            const r = d.pick([10, 15, 20, 25, 30]), A = 100 * d.int(6, 40), price = A - A * r / 100;
            return N(`정가가 ${V('a')}원인 물건을 ${r} % 할인하여 판다. ${nb(`${V('a')} = ${A}`)}일 때, 판매 가격은 얼마인가?`, price, {
              unit: '원', explain: `할인되는 금액은 ${withUnit(`[${r}|100]a`, '원')}이므로 판매 가격은 ${withUnit(`a-[${r}|100]a`, '원')}이다. ${nb(`${V('a')} = ${A}`)}${tail(A, '을/를')} 대입하면 ${A} − ${frac(r, 100)} × ${A} = ${A} − ${A * r / 100} = ${price}이다.`,
              facts: { value: `${A}-${A}*${r}/100`, unseen: [100] }
            });
          }, { count: 2 })
        ]
      },
      { id: 'terms', title: '다항식의 용어와 일차식', standard: STD2, types: [] },
      { id: 'scale', title: '일차식과 수의 곱셈·나눗셈', standard: STD2, types: [] },
      { id: 'like', title: '동류항과 일차식의 덧셈·뺄셈', standard: STD2, types: [] },
      { id: 'find', title: '어떤 식 구하기와 식의 대입', standard: STD2, types: [] }
    ]
  });

  // 같은 단원의 다른 파일(7-1-3b.js, 7-1-3c.js)이 함께 쓰는 도구
  B.kit.m713 = {
    STD1, STD2, T, X, valX, htmlX, jsX, subX, emX, sameX, xh, xe, xex, xv, xjs, xsame, xsub, xtagged, chips, spaced, withUnit, vj, magS, pn, ln, nl, kp, linOf, chain,
    lj, pickX, eqQ, monoAns, linQ, given, givenJ, worked, valueQ, valueOK, INK, EDGE, TINT, ITALIC, svgX, plainX, lenText, said, label, svg, shape, rectFig, trapFig, situations, situClaims
  };
})(typeof window !== 'undefined' ? window : globalThis);
