// 중학교 3학년 1학기 3단원 다항식의 곱셈과 인수분해 — 단원 틀·도구와 앞쪽 묶음(다항식의 곱셈, 곱셈 공식, 여러 곱셈을 섞은 계산과 넓이,
// 곱셈 공식을 이용한 수의 계산, 분모의 유리화와 곱셈 공식의 변형).
// 수집해 둔 미래엔 2015(황선욱) 한 종의 교과서·지도서·수준별 문제은행에서 뽑은 문제 꼴 목록(기본꼴 1: 88꼴, 심화꼴: 30꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 뺌(까닭) / 겹침」을 가른 대조표는 references/textbooks/수학/_분석/9-1-3/싣기_대조표.md 에 있다.
// (인수와 공통인수, 인수분해 공식, 완전제곱식, 여러 가지 인수분해, 계수와 인수의 관계, 인수분해를 이용한 수의 계산과 식의 값은 9-1-3b.js 에, 실력 문항은 9-1-3c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
// 영역은 변화와 관계, 성취기준은 9수02-19(다항식의 곱셈과 인수분해를 할 수 있다). 분모의 유리화는 곱셈 공식 (a + b)(a − b)를 쓰는 자리라 이 단원에 둔다(2022 수와 연산의 용어).
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(식·등식·그림·상황), 묻는 것(전개한 식·계수·□·고르기), 계산 구조(공식의 꼴, 문자의 수, 섞인 곱)가 다르면 따로 싣는다.
//    계산 문항은 구조가 다를 때만 따로 싣고 facts.rule 에 이름을 단다. 수와 문자만 바꾼 유형은 만들지 않는다.
//  - 교육과정: 다항식의 곱셈과 인수분해는 다섯 꼴 ma + mb = m(a + b), a² ± 2ab + b² = (a ± b)², a² − b² = (a + b)(a − b),
//    x² + (a + b)x + ab = (x + a)(x + b), acx² + (ad + bc)x + bd = (ax + b)(cx + d)를 다룬다. 공통부분을 한 문자로 놓거나 항을 묶으면 이 꼴로 줄어드는 것은 싣는다.
//    (a + b + c)², (a ± b)³, a³ ± b³, 인수정리, 복이차식, 다섯 꼴로 줄어들지 않는 인수분해, 다항식 ÷ 다항식, 이차방정식의 풀이(9-1-4)는 싣지 않는다.
//  - 답: 전개한 식은 항마다 「[±][ ]문자」(polyAns — 한 유형 안에서는 항의 구성이 같다), 계수·□ 안의 수·식의 값은 부호 단추가 붙은 수 칸,
//    근호가 든 수는 「[±][ ] [±][ ]√[ ]」, 인수분해한 식은 괄호째 끼워 넣는 칸(B.kit.m913.facX·facAC)으로 받는다. 계수가 분수이거나 칸의 모양이 답을 흘리는 꼴은 고르기로 낸다.
//    이 단원에는 음수가 되는 답이 흔하므로 수 칸에는 모두 부호 단추를 단다(개수와 「자연수」라고 정한 칸만 뺀다).
//    틀린 보기는 저마다 아이들이 실제로 하는 잘못 하나로 만든 식이다(가운데 항을 빠뜨린다, 계수를 제곱하지 않는다, 괄호 앞의 −를 첫 항에만 쓴다, 공통인수를 덜 묶는다 …).
//  - 원문의 「a + b − c의 값」「a ÷ b의 값」처럼 따로 구한 값을 뜻 없이 더하는 꼴은 값을 칸마다 따로 받는다.
//  - 답은 모두 코드가 셈한다. 식을 한 줄 글(식 글)로 적고, 그 글 하나에서 화면 글·값(다항식)·풀이의 계산 줄·검사 식을 얻는다.
//    검사가 다시 셈하는 식(facts.calc)은 식 글에 적힌 수로 계수를 셈하는 식이다. 근(제곱근)을 거쳐야 나오는 칸(인수분해한 식의 수, a² = 25 의 a)은
//    엔진 검사가 셈할 수 없으므로 facts.factor·facts.check 에 셈의 바탕을 적어 두고, 제 작업 폴더의 따로 지은 풀이로 맞춰 보았다.
//
// 뺀 것과 까닭(9-1-3b.js, 9-1-3c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 범위 밖: (x + 1/x)² 의 전개(①18 — 1/x 이 든 식은 다항식이 아니다), (x + 2y − 3)²(①22의 변형 — (a + b + c)²), 문자 셋을 둘씩 묶는 x² + ax − bx − ab(①66의 한 문항 — 긴가민가하여 뺌),
//    이차식 ÷ 일차식(심22), 계수가 문자인 일차부등식과 유리식의 약분(심23), 복이차식 n⁴ + n² + 1(심24), 가우스 기호와 수열(심12), 단원 앞 준비 문제(①88 — 중1·중2).
//  - 서술형: 잘못된 풀이를 찾아 고치기·그림으로 공식 설명하기·역관계의 예 찾기(①19 ①55 — 바르게 고친 답은 ①11·①49·①50 과 같은 일).
//  - 겹침(같은 일): 인수분해한 식을 다시 전개하기(①38 — ①11~①14), □ 안의 수로 곱셈 공식 채우기(①8 — ①6 과 한 유형), 합차를 넷 잇는 곱(심5 — ①10),
//    잘못 보고 인수분해(심16, ①70 의 x² 계수 4 꼴 — ①70), 완전제곱식이 되는 양수(심17 — ①58), B(x − C)² 꼴(①61의 표18 — ①61), 범위가 주어진 근호 두 개(심30 의 발13 — ①87),
//    분모를 간단히 하면 근호 하나인 유리화 3√2/(√12 − √3)(①33의 변형 — 근호를 포함한 식의 계산의 일), (a − b)² 꼴 대칭식(①84의 변형), 1/(−√3 − 1) 꼴의 a² − b²(①85의 중14), 연결하기(①53의 확2 03).
//  - 뜻 없는 셈은 값을 칸마다 따로 받도록 바꾸었다(①5 ①6 ①21 ①25 ①59 ①63 ①64 ①69 심6 심11 심28).
//  - 그림을 알 수 없는 것: 문제은행 그림의 어두운 부분(①24 의 기1-17·표14 — 지도서의 그림으로 같은 일을 실었다).
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, box, frac, lines, N, M, C, inline } = B.kit;
  const { LAB, MINUS, gcd, Q, qadd, qsub, qmul, qdiv, qneg, qabs, qcmp, isInt, fl, mag, tx, nb, tail, V, sup, tag, ex, nz, asQ, poly, polyAns, radAns, rt, grp, sqParts, radText } = B.kit.mid;
  const STD = '9수02-19', UNIT = '9-1-3';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: (ref.startsWith('심') ? '수집본 심화 자료(' : '수집본 기본 자료(') + ref + ')', make }, more || {});
  const NOTE1 = ' <span style="white-space:nowrap">(단, 계수가 1이면 1을 적는다.)</span>';

  // ── 검사 식에 적는 수 ──
  const jn = (n) => (n < 0 ? '(' + n + ')' : String(n));
  const jq = (q) => (q.q === 1 ? jn(q.p) : '(' + q.p + '/' + q.q + ')');

  // ── 식 글 ──
  // 문자가 든 식을 한 줄 글(식 글)로 적고, 그 글 하나에서 화면 글·값(다항식)·풀이의 계산 줄·검사 식을 얻는다.
  //  수 12·6.4 / 문자 x / 덧셈 + 뺄셈 - / 곱셈 기호 * (×) / 기호를 생략한 곱 2x · xy · 3(x+1) / 거듭제곱 x^2 / 분수 [분자|분모] / 괄호 ( ) · 중괄호 { } / 빈칸 ?(빈 네모)·㉠ ㉡(이름표 네모)
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
  // 값(다항식). env: { 문자: 수·유리수 또는 다항식 } — 문자에 수나 식을 넣는다.
  function valX(node, env) {
    const n = X(node), E = env || {}, v = (m) => valX(m, E);
    switch (n.t) {
      case 'num': { const q = numQ(n.s); return q.p === 0 ? [] : [term(q, {}, n.s)]; }
      case 'var': {
        const g = E[n.name];
        if (g == null) return [term(Q(1), { [n.name]: 1 }, '1')];
        if (Array.isArray(g)) return g;
        const q = asQ(g); return q.p === 0 ? [] : [term(q, {}, jq(q))];
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
  // 항의 차례: 차수가 큰 것부터, 차수가 같으면 알파벳이 앞선 문자의 지수가 큰 것부터(x², xy, y², x, y, 상수항).
  const letters = (t) => Object.keys(t.e).filter((k) => t.e[k]);
  const degOf = (t) => letters(t).reduce((s, k) => s + t.e[k], 0);
  function ordered(P) {
    const names = [...new Set(P.flatMap(letters))].sort();
    return P.slice().sort((a, b) => degOf(b) - degOf(a) || names.reduce((r, k) => r || (b.e[k] || 0) - (a.e[k] || 0), 0));
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
  const eqx = (...srcs) => ex(srcs.map((s) => (Array.isArray(s) ? ph(s, true) : xe(s))).join(' <i>=</i> '));
  const xtagged = (rows, tags) => lines(rows.map((r, i) => tag((tags || LAB)[i]) + ex(Array.isArray(r) ? r.map(xe).join(' <i>=</i> ') : xe(r))));

  // 식 뒤의 토씨: 끝이 거듭제곱이면 「제곱」, 근호면 안의 수, 문자이면 그 문자(엘·엠·엔·알만 받침이 있다), 수이면 그 수를 읽는 소리에 맞춘다. 분수는 분자를 나중에 읽는다.
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
    return h + ('lmnr'.includes(last) ? (w === '으로' && last === 'l' ? '로' : w) : wo);
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
  const lin = (a, b, v) => pn([[a, v || 'x'], [b, '']]);                     // ax + b
  const lin2 = (a, b, u, w) => pn([[a, u], [b, w]]);                         // au + bw
  const quad = (a, b, c, v) => pn([[a, (v || 'x') + '^2'], [b, v || 'x'], [c, '']]);
  const sg = (c, v) => (c < 0 ? '-' : '+') + (Math.abs(c) === 1 && v ? '' : Math.abs(c)) + (v || '');   // 앞에 식이 있을 때 덧붙이는 항
  const kp = (k, inner) => (k === 1 ? '' : k === -1 ? '-' : String(k)) + '(' + inner + ')';
  const PAIRS = [['x', 'y'], ['a', 'b']];
  const pairOf = (d) => d.pick(PAIRS);
  const srcOf = (P) => pn(ordered(P).map((t) => [t.q, letters(t).sort().map((k) => k + (t.e[k] > 1 ? '^' + t.e[k] : '')).join('')]));

  // ── 풀이의 계산 줄 ──
  // 덧셈·뺄셈으로 이은 덩어리마다 전개한 줄, 두 다항식의 곱 하나이면 동류항으로 모으기 전의 줄을 적고 마지막에 답을 적는다.
  function flatSum(n, sign, out) {
    if (n.t === 'add') { flatSum(n.a, sign, out); flatSum(n.b, sign, out); } else if (n.t === 'sub') { flatSum(n.a, sign, out); flatSum(n.b, -sign, out); } else out.push([n, sign]);
    return out;
  }
  function rawProd(n, env) {
    let fs = null;
    if (n.t === 'pow' && n.n === 2 && n.a.t === 'par') fs = [n.a, n.a];
    else if (n.t === 'jux' && n.list.length === 2 && n.list.every((f) => f.t === 'par')) fs = n.list;
    if (!fs) return null;
    const A = valX(fs[0], env), Bv = valX(fs[1], env), out = [];
    for (const a of A) for (const b of Bv) out.push(tMul(a, b));
    return out;
  }
  function told(src, env) {
    const n = X(src), rows = [htmlX(n)], parts = flatSum(n, 1, []);
    if (parts.length === 1) { const raw = rawProd(n, env); if (raw) rows.push(signed(raw)); }
    else {
      rows.push(parts.map(([m, s], i) => {
        const P = valX(m, env), body = ph(P), wrap = (i > 0 || s < 0) && (P.length > 1 || (P.length === 1 && P[0].q.p < 0));
        return (i === 0 ? (s < 0 ? MINUS : '') : s < 0 ? ` ${MINUS} ` : ' + ') + (wrap ? '(' + body + ')' : body);
      }).join(''));
    }
    rows.push(ph(valX(n, env)));
    return rows.filter((r, i) => i === 0 || r !== rows[i - 1]).join(' = ');
  }

  // ── 문항 도구 ──
  const EXPAND = '다음 식을 전개하시오.', CALC = '다음을 계산하시오.', FACTOR = '다음 식을 인수분해하시오.';
  // 답이 다항식인 문항: 항마다 「[±][ ]문자」. keys 는 답의 항의 문자 부분(식 글: 'x^2', 'xy', 상수항은 '')을 적는 차례대로.
  const keyOfSrc = (k) => (k ? keyOf(valX(k)[0].e) : '');
  function polyOK(src, keys, env) {
    try { const ord = ordered(Array.isArray(src) ? src : valX(src, env)); return ord.length === keys.length && ord.every((t, i) => keyOf(t.e) === keyOfSrc(keys[i]) && isInt(t.q) && Math.abs(t.q.p) <= 9999); } catch (_) { return false; }
  }
  function polyQ(text, src, keys, o) {
    const opt = o || {}, P = Array.isArray(src) ? src : valX(src, opt.env), ord = ordered(P);
    if (!polyOK(P, keys)) throw new Error('답의 항이 정한 것과 다르다: ' + ph(P));
    return polyAns(text + NOTE1, ord.map((t) => [t.q.p, varH(t.e)]), {
      figure: opt.figure === undefined ? xex(src) : opt.figure, explain: opt.explain || told(src, opt.env) + '이다.',
      facts: Object.assign({ calc: ord.map((t, i) => [t.s, i]), unseen: [1].concat(opt.unseen || []) }, opt.rule ? { rule: opt.rule } : {})
    });
  }
  // 식을 고르는 문항. right: 정답(식 글이나 다항식), wrongs: 틀린 것의 후보(식 글·다항식·{ h 화면 글 }) — 저마다 아이들이 하는 잘못 하나로 만든 식이다.
  const asP = (x, env) => (Array.isArray(x) ? x : valX(x, env));
  function pickQ(d, text, right, wrongs, o) {
    const opt = o || {}, R = asP(right, opt.env), kept = [], want = opt.count || 3;
    for (const w of d.shuffle(wrongs)) {
      if (kept.length === want) break;
      if (w && w.h) { if (!kept.some((k) => k.h === w.h)) kept.push(w); continue; }
      let W; try { W = asP(w, opt.env); } catch (_) { continue; }
      if (same(W, R) || kept.some((k) => k.P && same(k.P, W))) continue;
      kept.push({ P: W });
    }
    if (kept.length < want) throw new Error('틀린 보기가 모자라다');
    const rows = d.shuffle([{ P: R, right: true, h: opt.rightH }].concat(kept));
    return C(text, rows.map((r) => (r.h ? r.h : pt(r.P))), rows.findIndex((r) => r.right), {
      figure: opt.figure, explain: opt.explain, facts: Object.assign({ truth: rows.map((r) => Boolean(r.right)), want: true }, opt.rule ? { rule: opt.rule } : {})
    });
  }
  // 등식 「왼쪽 = 오른쪽」에서 옳은 것(옳지 않은 것) 하나 고르기. pool 의 줄은 [왼쪽 식 글, 잘못 쓴 오른쪽(다항식), 까닭].
  //  옳은 것을 물으면 하나만 바르게, 옳지 않은 것을 물으면 하나만 잘못 적는다. 바른 오른쪽과 참·거짓은 코드가 셈한다.
  function eqQ(d, text, pool, wantTrue, o) {
    const opt = o || {}, picked = d.shuffle(pool).slice(0, opt.n || 5), at = d.int(0, picked.length - 1);
    const rows = picked.map((e, i) => { const good = valX(e[0]), bad = e[1], wrong = (i === at) !== wantTrue; if (same(good, bad)) throw new Error('잘못 쓴 식이 바른 식과 같다: ' + e[0]); return { l: e[0], good, shown: wrong ? bad : good, ok: !wrong, why: e[2] || '' }; });
    const line = (r, P) => xh(r.l) + ' = ' + pt(P);
    return C(text, rows.map((r) => line(r, r.shown)), at, {
      explain: wantTrue ? '나머지를 바르게 고치면 ' + rows.filter((r, i) => i !== at).map((r) => line(r, r.good)).join(', ') + '이다.' : `${rows[at].why ? rows[at].why + ' ' : ''}바르게 고치면 ${line(rows[at], rows[at].good)}이다.`,
      facts: Object.assign({ truth: rows.map((r) => r.ok), want: wantTrue }, opt.rule ? { rule: opt.rule } : {})
    });
  }
  // 수 답 여러 칸(문자 이름이나 ㉠, ㉡). rows: [이름표, 답, 검사 식(없으면 null), 부호 단추를 붙이는가]
  function slots(text, rows, o) {
    const calc = rows.map(([, , expr], i) => [expr, i]).filter(([expr]) => expr);
    return M(text, rows.map(([label, answer, , signedOn]) => Object.assign({ label, answer }, signedOn === false ? {} : { signed: true })), {
      figure: o.figure, explain: o.explain, unordered: o.unordered, facts: Object.assign(calc.length ? { calc } : {}, o.unseen ? { unseen: o.unseen } : {}, o.rule ? { rule: o.rule } : {}, o.check ? { check: o.check } : {})
    });
  }
  const eqLabel = (v) => V(v) + ' =';
  // 수 하나를 답하는 문항(부호 단추를 단다). calc 가 없으면 check 에 셈의 바탕을 적는다.
  const numQ1 = (text, answer, o) => N(text, answer, { signed: o.signed !== false, figure: o.figure, unit: o.unit, explain: o.explain, facts: Object.assign(o.calc ? { calc: [[o.calc, 0]] } : {}, o.unseen ? { unseen: o.unseen } : {}, o.rule ? { rule: o.rule } : {}, o.check ? { check: o.check } : {}) });

  // ── 인수분해한 식의 답 칸 ──
  // (x + p)(x + q): 두 칸 모두 부호 단추, 차례는 바뀌어도 맞다. facts.factor 에 처음 식과 답의 꼴을 적는다(검사 파일에 넣을 근거).
  const facH = (rows, lead) => nb((lead == null || lead === 1 ? '' : lead === -1 ? MINUS : tx(Q(lead))) + rows.map(([a, b, v]) => '(' + ph(pAdd(mk(a, { [v || 'x']: 1 }), mk(b, {}))) + ')').join(''));
  function facX(text, p, q, o) {
    const v = o.v || 'x', Xv = V(v);
    return inline(text, grp(`(${Xv} {0})`) + grp(`(${Xv} {1})`), [{ answer: p, signed: true }, { answer: q, signed: true }], {
      unordered: true, shown: facH([[1, p, v], [1, q, v]]), figure: o.figure, explain: o.explain,
      facts: Object.assign({ factor: { poly: o.poly, form: '(x+p)(x+q)', answer: [p, q] } }, o.rule ? { rule: o.rule } : {})
    });
  }
  // (ax + b)(cx + d): x 의 계수는 자연수(부호 단추 없음), 괄호째 차례를 바꾸어도 맞다.
  const NOTE_AC = ' <span style="white-space:nowrap">(단, 일차식의 <i class="mb-var">x</i>의 계수는 자연수이고,</span> <span style="white-space:nowrap">1이면 1을 적는다.)</span>';
  function facAC(text, a, b, c, d2, o) {
    const v = o.v || 'x', Xv = V(v);
    return inline(text + NOTE_AC, grp(`({0}${Xv} {1})`) + grp(`({2}${Xv} {3})`), [{ answer: a }, { answer: b, signed: true }, { answer: c }, { answer: d2, signed: true }], {
      blocks: [[0, 1], [2, 3]], shown: facH([[a, b, v], [c, d2, v]]), figure: o.figure, explain: o.explain,
      facts: Object.assign({ factor: { poly: o.poly, form: '(ax+b)(cx+d)', answer: [a, b, c, d2] } }, o.rule ? { rule: o.rule } : {})
    });
  }

  // ── 근호가 든 수 ──
  // 항 [{ q 유리수, r 근호 안(1이면 유리수) }]. 근호 안은 제곱인 수를 인수로 갖지 않게 줄인다.
  function sNorm(list) {
    const out = [];
    for (const t of list) { const [k, m] = sqParts(t.r), q = qmul(t.q, Q(k)), at = out.findIndex((u) => u.r === m); if (at < 0) out.push({ q, r: m }); else out[at] = { q: qadd(out[at].q, q), r: m }; }
    return out.filter((t) => t.q.p !== 0).sort((a, b) => a.r - b.r);
  }
  const sOf = (...pairs) => sNorm(pairs.map(([c, r]) => ({ q: asQ(c), r: r || 1 })));
  const sAdd = (a, b) => sNorm(a.concat(b));
  const sNeg = (a) => a.map((t) => ({ q: qneg(t.q), r: t.r }));
  const sSub = (a, b) => sAdd(a, sNeg(b));
  const sMul = (a, b) => sNorm(a.flatMap((x) => b.map((y) => ({ q: qmul(x.q, y.q), r: x.r * y.r }))));
  function sInv(a) {
    if (a.length === 1) return sNorm([{ q: qdiv(Q(1), qmul(a[0].q, Q(a[0].r))), r: a[0].r }]);
    if (a.length !== 2) throw new Error('항이 둘 넘는 분모');
    const conj = [a[0], { q: qneg(a[1].q), r: a[1].r }], den = sMul(a, conj);
    if (den.length !== 1 || den[0].r !== 1) throw new Error('유리화되지 않는 분모');
    return sMul(conj, [{ q: qdiv(Q(1), den[0].q), r: 1 }]);
  }
  const sDiv = (a, b) => sMul(a, sInv(b));
  const sInt = (a) => a.every((t) => isInt(t.q));
  const sPart = (a, r) => { const t = a.find((u) => u.r === r); return t ? t.q : Q(0); };
  function sH(a) {
    if (!a.length) return '0';
    return nb(a.map((t, i) => { const m = qabs(t.q), body = t.r === 1 ? mag(m) : (m.p === 1 && m.q === 1 ? '' : mag(m)) + rt(t.r); return (i === 0 ? (t.q.p < 0 ? MINUS : '') : t.q.p < 0 ? ` ${MINUS} ` : ' + ') + body; }).join(''));
  }
  // √a 또는 b√a 의 글(그림 밖 글)
  const rh = (coef, r) => (coef === 1 ? '' : coef === -1 ? MINUS : tx(Q(coef))) + rt(r);
  // 답이 a + b√c: 「[±][ ] [±][ ]√[ ]」(둘째 칸의 부호 단추가 더하기·빼기 기호 노릇을 한다)
  function surdAns(text, a, b, c, o) {
    return inline(text + NOTE1, '{0} ' + grp('{1}' + rt('{2}')), [{ answer: a, signed: true }, { answer: b, signed: true }, { answer: c }], {
      shown: sH(sOf([a, 1], [b, c])), figure: o.figure, explain: o.explain, facts: Object.assign({ calc: o.calc || [], unseen: o.unseen || [] }, o.rule ? { rule: o.rule } : {}, o.check ? { check: o.check } : {})
    });
  }
  const SQF = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15, 17, 19, 21, 22, 23, 26, 29, 30, 31, 33, 34, 35, 37];
  const isSqf = (n) => n >= 2 && sqParts(n)[0] === 1;

  // ── 그림 ──
  const INK = '#1f2933', TINT = 'rgba(37,99,235,0.14)', SVG_ITALIC = "font-style:italic;font-family:'MB Math','Times New Roman',serif;font-size:1.1em";
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
  // 그림 설명에 적는 글: 4x + 1, 2b
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
  const word = (x, y, text, anchor, size) => `<text x="${x}" y="${y}" text-anchor="${anchor || 'middle'}" style="font-size:${size || 13}px;font-weight:600;fill:${INK}">${text}</text>`;
  const shapeD = (dd, fill) => `<path d="${dd}" style="fill:${fill || '#fff'};stroke:${INK};stroke-width:1.4;stroke-linejoin:round"/>`;
  const thin = (dd) => `<path d="${dd}" style="fill:none;stroke:${INK};stroke-width:1"/>`;
  // 직육면체: 앞 아래 모서리(가로) L, 오른쪽 아래 모서리(세로) W, 오른쪽 세로 모서리(높이) H
  const boxFig = (L, W, H) => svg(290, 152, `직육면체: 가로의 길이 ${plainX(L)}, 세로의 길이 ${plainX(W)}, 높이 ${plainX(H)}`,
    shapeD('M14 50h130v76h-130z', TINT) + shapeD('M14 50l42 -34h130l-42 34z', 'rgba(37,99,235,0.07)') + shapeD('M144 50l42 -34v76l-42 34z', 'rgba(37,99,235,0.22)')
    + label(79, 145, L) + label(174, 122, W, 'start') + label(194, 60, H, 'start'));
  // 가로 W, 세로 H 인 직사각형 땅에 가로·세로로 폭이 w 인 길을 하나씩 낸 그림(땅은 색칠, 길은 흰색)
  function roadFig(W, H, w) {
    const x0 = 62, y0 = 24, ww = 180, hh = 118, rx = x0 + 96, ry = y0 + 62, rw = 16;
    const land = [[x0, y0, rx - x0, ry - y0], [rx + rw, y0, x0 + ww - rx - rw, ry - y0], [x0, ry + rw, rx - x0, y0 + hh - ry - rw], [rx + rw, ry + rw, x0 + ww - rx - rw, y0 + hh - ry - rw]];
    const body = shapeD(`M${x0} ${y0}h${ww}v${hh}h${-ww}z`) + land.map(([x, y, a, b]) => `<rect x="${x}" y="${y}" width="${a}" height="${b}" style="fill:rgba(37,99,235,0.2);stroke:${INK};stroke-width:1"/>`).join('')
      + label(x0 + ww / 2, y0 - 8, W) + label(x0 - 6, y0 + hh / 2 + 5, H, 'end') + word(rx + rw / 2, y0 + hh + 17, w) + word(x0 + ww + 8, ry + rw / 2 + 5, w, 'start')
      + thin(`M${rx} ${y0 + hh + 4}v4M${rx + rw} ${y0 + hh + 4}v4M${x0 + ww + 3} ${ry}h4M${x0 + ww + 3} ${ry + rw}h4`);
    return svg(272, 170, `직사각형 모양의 땅: 가로의 길이 ${plainX(W)}, 세로의 길이 ${plainX(H)}. 가로와 세로로 폭이 ${w}인 길이 하나씩 나 있고, 길을 뺀 네 부분을 색칠했다.`, body);
  }
  // 가로 PA, 세로 QA 인 직사각형을 오른쪽 폭 RB 의 세로 띠와 아래쪽 폭 SB 의 가로 띠로 나누고, 왼쪽 위와 오른쪽 아래를 색칠한 그림
  function shadeFig(PA, QA, RB, SB) {
    const x0 = 40, y0 = 26, ww = 190, hh = 128, cx = x0 + ww - 58, cy = y0 + hh - 32;
    const body = `<rect x="${x0}" y="${y0}" width="${cx - x0}" height="${cy - y0}" style="fill:rgba(37,99,235,0.24)"/><rect x="${cx}" y="${cy}" width="${x0 + ww - cx}" height="${y0 + hh - cy}" style="fill:rgba(37,99,235,0.24)"/>`
      + shapeD(`M${x0} ${y0}h${ww}v${hh}h${-ww}z`, 'none') + thin(`M${cx} ${y0}V${y0 + hh}M${x0} ${cy}H${x0 + ww}`)
      + label(x0 + ww / 2, y0 - 9, PA) + label(x0 - 6, (y0 + cy) / 2 + 5, QA, 'end') + label((cx + x0 + ww) / 2, y0 + hh + 18, RB) + label(x0 + ww + 8, (cy + y0 + hh) / 2 + 5, SB, 'start');
    return svg(280, 176, `직사각형: 가로의 길이 ${plainX(PA)}, 세로의 길이 ${plainX(QA)}. 오른쪽에 폭이 ${plainX(RB)}인 세로 띠, 아래쪽에 폭이 ${plainX(SB)}인 가로 띠를 그어 네 부분으로 나누었고, 왼쪽 위 부분과 오른쪽 아래 부분을 색칠했다.`, body);
  }

  // ════════════════════════════════════════════════════════════════
  // ── 다항식의 곱셈 ──
  const expandTypes = [
    T('expand-two', '문자가 다른 두 일차식의 곱', '①1', (d) => {
      const [u, w] = pairOf(d), [p, r] = [d.int(1, 6), d.int(1, 6)], [q, s] = [nz(d, -9, 9), nz(d, -9, 9)];
      const src = `(${lin(p, q, u)})(${lin(r, s, w)})`;
      return polyQ(EXPAND, src, [u + w, u, w, ''], { explain: `분배법칙을 이용하여 전개한다. ${told(src)}이다.` });
    }),
    T('expand-like', '동류항을 모으는 두 일차식의 곱', '①2 ①14의 변형', (d) => {
      const [u, w] = pairOf(d);
      const src = d.until(() => `(${lin2(d.int(2, 5), nz(d, -7, 7), u, w)})(${lin2(d.int(1, 4), nz(d, -7, 7), u, w)})`, (s) => polyOK(s, [u + '^2', u + w, w + '^2']));
      return polyQ(EXPAND, src, [u + '^2', u + w, w + '^2'], { explain: `분배법칙으로 전개한 다음 동류항끼리 모은다. ${told(src)}이다.` });
    }),
    T('expand-coef', '전개식에서 계수 구하기', '①3', (d, n) => {
      if (n === 0) {
        const src = `(${lin(d.int(2, 6), nz(d, -9, 9))})^2`, t = termOf(xv(src), { x: 1 });
        return numQ1(`${xj(src, '을/를')} 전개한 식에서 ${V('x')}의 계수는?`, t.q.p, { calc: t.s, unseen: [1], rule: 'coef-square', explain: `${told(src)}이므로 ${V('x')}의 계수는 ${tx(t.q)}이다.` });
      }
      if (n === 1) {
        const src = d.until(() => `(${lin2(d.int(1, 5), nz(d, -6, 6), 'x', 'y')})(${lin2(d.int(2, 6), nz(d, -6, 6), 'x', 'y')})`, (s) => coefOf(xv(s), { x: 1, y: 1 }).p !== 0);
        const t = termOf(xv(src), { x: 1, y: 1 });
        return numQ1(`${xj(src, '을/를')} 전개할 때, ${V('x')}${V('y')}의 계수는?`, t.q.p, { calc: t.s, unseen: [1], rule: 'coef-xy', explain: `${V('x')}${V('y')}가 나오는 곱만 모은다. ${told(src)}이므로 ${V('x')}${V('y')}의 계수는 ${tx(t.q)}이다.` });
      }
      if (n === 2) {
        // (px + qy)(rx + sy + t): xy 의 계수와 y² 의 계수
        const src = d.until(() => `(${lin2(d.int(1, 3), nz(d, -4, 4), 'x', 'y')})(${pn([[d.int(2, 5), 'x'], [nz(d, -5, 5), 'y'], [nz(d, -6, 6), '']])})`, (s) => coefOf(xv(s), { x: 1, y: 1 }).p !== 0);
        const P = xv(src), a = termOf(P, { x: 1, y: 1 }), b = termOf(P, { y: 2 });
        return slots(`${xj(src, '을/를')} 전개한 식에서 ${V('x')}${V('y')}의 계수와 ${V('y')}${sup(2)}의 계수는?`, [[`${V('x')}${V('y')}의 계수`, a.q.p, a.s], [`${V('y')}${sup(2)}의 계수`, b.q.p, b.s]], {
          unseen: [1], rule: 'coef-two', explain: `${told(src)}이므로 ${V('x')}${V('y')}의 계수는 ${tx(a.q)}, ${V('y')}${sup(2)}의 계수는 ${tx(b.q)}이다.`
        });
      }
      // (ax + b)(ax − b): x 의 계수가 0 이다.
      const [a, b] = [d.int(2, 7), d.int(1, 9)], src = `(${lin(a, b)})(${lin(a, -b)})`, P = xv(src), t2 = termOf(P, { x: 2 }), t0 = termOf(P, {});
      return slots(`${xj(src, '을/를')} 전개했을 때, ${V('x')}${sup(2)}의 계수, ${V('x')}의 계수, 상수항은?`, [[`${V('x')}${sup(2)}의 계수`, t2.q.p, t2.s], [`${V('x')}의 계수`, 0, `${a}*(-${b})+${b}*${a}`], ['상수항', t0.q.p, t0.s]], {
        unseen: [1], rule: 'coef-zero', explain: `${told(src)}이다. ${V('x')}의 항이 없으므로 ${V('x')}의 계수는 0이다.`
      });
    }, { count: 4 }),
    T('expand-pick', '전개식의 계수를 견주어 고르기', '①4', (d, n) => {
      if (n === 0) {
        // 다섯 가운데 넷은 x 의 계수가 k 로 같고 하나만 다르다.
        const k = nz(d, -10, 10);
        const make = (want) => d.pick([
          () => { const p = nz(d, -9, 9), q = want - p; return q !== 0 && Math.abs(q) <= 9 ? `(${lin(1, p)})(${lin(1, q)})` : null; },
          () => (want % 2 === 0 && want !== 0 && Math.abs(want) <= 18 ? `(${lin(1, want / 2)})^2` : null),
          () => { const [a, c] = [d.int(1, 3), d.int(2, 3)], b = nz(d, -6, 6), r = want - b * c; return r % a === 0 && r !== 0 && Math.abs(r / a) <= 9 ? `(${lin(a, b)})(${lin(c, r / a)})` : null; }
        ])();
        const rows = d.until(() => { const odd = k + d.pick([-2, -1, 1, 2]), list = [make(k), make(k), make(k), make(k), make(odd)]; return list; },
          (list) => list.every(Boolean) && list.every((s, i) => coefOf(xv(s), { x: 1 }).p !== 0 && list.every((t, j) => j <= i || !same(xv(s), xv(t)))));
        const shown = d.shuffle(rows), coefs = shown.map((s) => coefOf(xv(s), { x: 1 }).p), lone = coefs.findIndex((c) => coefs.filter((e) => e === c).length === 1);
        return C(`다음 식을 전개할 때, ${V('x')}의 계수가 나머지 넷과 다른 하나는?`, shown.map(xh), lone, {
          explain: shown.map((s, i) => `${xh(s)} = ${pt(xv(s))}`).join(', ') + `이므로 ${V('x')}의 계수가 다른 하나는 ${xh(shown[lone])}이다.`,
          facts: { truth: coefs.map((c, i) => i === lone), want: true, rule: 'pick-odd' }
        });
      }
      // xy 의 계수가 k 인 것 하나: 세 항이 든 인수가 섞여 있다.
      const forms = [
        () => `(${lin2(1, 1, 'x', 'y')}${sg(nz(d, -5, 5))})(${lin2(1, 1, 'x', 'y')})`,
        () => `(${lin2(d.int(1, 3), nz(d, -5, 5), 'x', 'y')})(${lin2(d.int(1, 3), nz(d, -5, 5), 'x', 'y')})`,
        () => `(${lin(1, nz(d, -5, 5))})(${lin2(1, 1, 'x', 'y')}${sg(nz(d, -5, 5))})`,
        () => `(${pn([[d.int(2, 3), 'x'], [nz(d, -2, 2), 'y'], [1, '']])})(${pn([[d.int(1, 2), 'x'], [nz(d, -2, 2), 'y'], [-1, '']])})`,
        () => `(${lin2(1, nz(d, -4, 4), 'x', 'y')})(${lin2(d.int(1, 3), nz(d, -4, 4), 'x', 'y')})`
      ];
      const rows = d.until(() => d.shuffle(forms).map((f) => f()), (list) => {
        const cs = list.map((s) => coefOf(xv(s), { x: 1, y: 1 }).p);
        return new Set(list).size === 5 && cs.filter((c) => c === cs[0]).length === 1 && cs[0] !== 0;
      });
      const k = coefOf(xv(rows[0]), { x: 1, y: 1 }).p, shown = d.shuffle(rows), at = shown.indexOf(rows[0]);
      return C(`다음 식을 전개할 때, ${V('x')}${V('y')}의 계수가 ${tx(Q(k))}인 것은?`, shown.map(xh), at, {
        explain: `${V('x')}${V('y')}가 나오는 곱만 모은다. ` + shown.map((s) => `${xh(s)}의 ${V('x')}${V('y')}의 계수는 ${tx(coefOf(xv(s), { x: 1, y: 1 }))}`).join(', ') + '이다.',
        facts: { truth: shown.map((s, i) => i === at), want: true, rule: 'pick-xy' }
      });
    }, { count: 2 }),
    T('expand-frac', '계수가 분수인 일차식의 곱', '①5 ①12의 변형', (d) => {
      // (p x + q)(r x + s): p, s 는 분수, q, r 는 자연수. 틀린 보기: 가운데 항을 빠뜨림 / 가운데 항 하나의 부호를 바꿈 / 상수항의 부호 / 바깥쪽 곱만 셈
      const [p, s] = d.until(() => [Q(d.int(1, 5), d.pick([2, 3, 4, 5])), Q(-d.int(1, 5), d.pick([2, 3, 5]))], ([x, y]) => x.q !== 1 && y.q !== 1 && x.q !== y.q);
      const [q, r] = [d.int(2, 7), d.pick([2, 3, 4, 5])];
      const src = `(${pn([[p, 'x'], [q, '']])})(${pn([[r, 'x'], [s, '']])})`, R = xv(src);
      const P = (a, b, c) => pAdd(pAdd(mk(a, { x: 2 }), mk(b, { x: 1 })), mk(c, {}));
      const pr = qmul(p, Q(r)), ps = qmul(p, s), qr = Q(q * r), qs = qmul(Q(q), s);
      return pickQ(d, `${xj(src, '을/를')} 전개한 것은?`, R, [P(pr, Q(0), qs), P(pr, qsub(qr, ps), qs), P(pr, qadd(ps, qr), qneg(qs)), P(pr, ps, qs), P(pr, qr, qs)], {
        explain: `${told(src)}이다.`, rule: 'frac-coef'
      });
    }),
    T('expand-find', '전개식과 견주어 괄호 안의 수 구하기', '①6 ①8', (d, n) => {
      if (n === 0) {
        // (px + a)(bx + q) = R x² + c x + S
        const [p, q] = [d.int(2, 5), nz(d, -9, 9)], [a, b] = d.until(() => [nz(d, -6, 6), nz(d, -5, 5)], ([x, y]) => p * q + x * y !== 0 && Math.abs(x * q) <= 60);
        const R = p * b, S = a * q, c = p * q + a * b;
        return slots(`다음 등식을 만족시키는 수 ${V('a')}, ${V('b')}, ${V('c')}의 값은?`, [[eqLabel('a'), a, `${jn(S)}/${jn(q)}`], [eqLabel('b'), b, `${jn(R)}/${p}`], [eqLabel('c'), c, `${p}*${jn(q)}+${jn(S)}/${jn(q)}*${jn(R)}/${p}`]], {
          figure: eqx(`(${p}x+a)(bx${sg(q)})`, `${pn([[R, 'x^2']])}+cx${sg(S)}`), rule: 'find-abc',
          explain: `좌변을 전개하면 ${nb(`${p}${V('b')}${V('x')}${sup(2)} + (${tx(Q(p * q))} + ${V('a')}${V('b')})${V('x')} ${q < 0 ? MINUS : '+'} ${Math.abs(q)}${V('a')}`)}이다. ${p}${V('b')} = ${tx(Q(R))}에서 ${V('b')} = ${tx(Q(b))}, ${tx(Q(q))}${V('a')} = ${tx(Q(S))}에서 ${V('a')} = ${tx(Q(a))}, ${V('c')} = ${tx(Q(p * q))} + (${tx(Q(a))}) × (${tx(Q(b))}) = ${tx(Q(c))}이다.`
        });
      }
      if (n === 1) {
        // (x + a)(y + k) = xy + bx + ay + m
        const [a, k] = [nz(d, -7, 7), nz(d, -7, 7)], m = a * k;
        return slots(`다음 등식을 만족시키는 수 ${V('a')}, ${V('b')}의 값은?`, [[eqLabel('a'), a, `${jn(m)}/${jn(k)}`], [eqLabel('b'), k, jn(k)]], {
          figure: eqx(`(x+a)(y${sg(k)})`, `xy+bx+ay${sg(m)}`), rule: 'find-xy',
          explain: `좌변을 전개하면 ${nb(`${V('x')}${V('y')} ${k < 0 ? MINUS : '+'} ${Math.abs(k)}${V('x')} + ${V('a')}${V('y')} ${k < 0 ? MINUS : '+'} ${Math.abs(k)}${V('a')}`)}이다. ${V('x')}의 계수에서 ${V('b')} = ${tx(Q(k))}, 상수항에서 ${tx(Q(k))}${V('a')} = ${tx(Q(m))}이므로 ${V('a')} = ${tx(Q(a))}이다.`
        });
      }
      if (n === 2) {
        // (x − a)(x − p) = x² − b: x 의 계수가 0 이다.
        const p = d.int(2, 9);
        return slots(`다음 등식을 만족시키는 수 ${V('a')}, ${V('b')}의 값은?`, [[eqLabel('a'), -p, `-${p}`], [eqLabel('b'), p * p, `${p}*${p}`]], {
          figure: eqx(`(x-a)(x-${p})`, 'x^2-b'), rule: 'find-zero',
          explain: `좌변을 전개하면 ${nb(`${V('x')}${sup(2)} − (${V('a')} + ${p})${V('x')} + ${p}${V('a')}`)}이다. 우변에 ${V('x')}의 항이 없으므로 ${V('a')} + ${p} = 0, ${V('a')} = −${p}이고, ${p}${V('a')} = −${V('b')}에서 ${V('b')} = ${p * p}이다.`
        });
      }
      // (ax − q)² = R x² + bx + c, a > 0
      const [a, q] = [d.int(2, 7), d.int(1, 9)], R = a * a;
      return slots(`다음 등식을 만족시키는 수 ${V('a')}, ${V('b')}, ${V('c')}의 값은? (단, ${V('a')} &gt; 0)`, [[eqLabel('a'), a, null], [eqLabel('b'), -2 * a * q, null], [eqLabel('c'), q * q, `${q}*${q}`]], {
        figure: eqx(`(ax-${q})^2`, `${R}x^2+bx+c`), rule: 'find-square', check: { kind: 'square-coef', R, q },
        explain: `좌변을 전개하면 ${nb(`${V('a')}${sup(2)}${V('x')}${sup(2)} − ${2 * q}${V('a')}${V('x')} + ${q * q}`)}이다. ${V('a')}${sup(2)} = ${R}이고 ${V('a')} &gt; 0이므로 ${V('a')} = ${a}, ${V('b')} = −${2 * q} × ${a} = −${2 * a * q}, ${V('c')} = ${q * q}이다.`
      });
    }, { count: 4 }),
    T('expand-cond', '계수가 주어진 값이 되게 하는 수', '①7', (d, n) => {
      if (n === 0) {
        // (px + q)(x² + ax + r) 의 x 의 계수가 k
        const [p, q, r, a] = d.until(() => [d.int(2, 4), nz(d, -5, 5), nz(d, -6, 6), nz(d, -6, 6)], ([pp, qq, rr, aa]) => pp * rr + qq * aa !== 0 && aa !== rr);
        const k = p * r + q * a, src = `(${lin(p, q)})(x^2+ax${sg(r)})`;
        return numQ1(`${xh(src)}의 전개식에서 ${V('x')}의 계수가 ${tx(Q(k))}일 때, 수 ${V('a')}의 값은?`, a, {
          calc: `(${jn(k)}-${p}*${jn(r)})/${jn(q)}`, rule: 'cond-cubic',
          explain: `${V('x')}의 항은 ${p}${V('x')} × (${tx(Q(r))}) + (${tx(Q(q))}) × ${V('a')}${V('x')} = (${tx(Q(p * r))} ${q < 0 ? MINUS : '+'} ${Math.abs(q)}${V('a')})${V('x')}이다. ${tx(Q(p * r))} ${q < 0 ? MINUS : '+'} ${Math.abs(q)}${V('a')} = ${tx(Q(k))}에서 ${V('a')} = ${tx(Q(a))}이다.`
        });
      }
      // (px − ay)² 의 xy 의 계수가 k 일 때 y² 의 계수
      const [p, a] = [d.int(2, 5), nz(d, -6, 6)], k = -2 * p * a;
      return numQ1(`${xh(`(${p}x-ay)^2`)}의 전개식에서 ${V('x')}${V('y')}의 계수가 ${tx(Q(k))}일 때, ${V('y')}${sup(2)}의 계수는? (단, ${V('a')}는 수이다.)`, a * a, {
        calc: `(${jn(k)}/(-2*${p}))*(${jn(k)}/(-2*${p}))`, unseen: [2], rule: 'cond-square',
        explain: `${nb(`(${p}${V('x')} − ${V('a')}${V('y')})${sup(2)} = ${p * p}${V('x')}${sup(2)} − ${2 * p}${V('a')}${V('x')}${V('y')} + ${V('a')}${sup(2)}${V('y')}${sup(2)}`)}이다. −${2 * p}${V('a')} = ${tx(Q(k))}에서 ${V('a')} = ${tx(Q(a))}이므로 ${V('y')}${sup(2)}의 계수는 ${V('a')}${sup(2)} = ${a * a}이다.`
      });
    }, { count: 2 }),
    T('expand-ratio', '두 계수 사이의 관계로 수 구하기', '심3', (d) => {
      // (px + a)(x + r): x 의 계수가 상수항의 m 배 → pr + a = m a r
      const [p, r, m, a] = d.until(() => { const pp = d.int(1, 6), rr = nz(d, -5, 5), mm = d.int(2, 4), den = mm * rr - 1; return [pp, rr, mm, (pp * rr) % den === 0 ? (pp * rr) / den : 0]; }, ([, , , aa]) => aa !== 0 && Math.abs(aa) <= 12);
      const src = `(${p === 1 ? '' : p}x+a)(${lin(1, r)})`, cH = `${r < 0 ? MINUS : ''}${Math.abs(r) === 1 ? '' : Math.abs(r)}${V('a')}`;
      return numQ1(`${xj(src, '을/를')} 전개한 식에서 ${V('x')}의 계수가 상수항의 ${m}배일 때, 수 ${V('a')}의 값은?`, a, {
        calc: `${p}*${jn(r)}/(${m}*${jn(r)}-1)`, unseen: [1], rule: 'ratio',
        explain: `전개하면 ${nb(`${p === 1 ? '' : p}${V('x')}${sup(2)} + (${tx(Q(p * r))} + ${V('a')})${V('x')} ${r < 0 ? MINUS : '+'} ${Math.abs(r) === 1 ? '' : Math.abs(r)}${V('a')}`)}이므로 상수항은 ${nb(cH)}이다. ${nb(`${tx(Q(p * r))} + ${V('a')} = ${m} × ${r < 0 ? '(' + cH + ')' : cH}`)}에서 ${V('a')} = ${tx(Q(a))}이다.`
      });
    }),
    T('expand-pick-min', '□ 안의 수가 가장 작은 것 고르기', '①9', (d) => {
      const rows = d.until(() => {
        const [p, q, r, s, t, a, b, c] = [d.int(1, 6), d.int(2, 8), d.int(2, 6), d.int(1, 6), d.int(1, 6), d.int(2, 3), d.int(2, 4), d.int(1, 5)];
        return d.shuffle([
          [`(-x-${p})^2`, `x^2+?x+${p * p}`, 2 * p],
          [`(x-${q}y)^2`, `x^2+?xy+${q * q}y^2`, -2 * q],
          [`(-x+${r})(x+${r})`, `-x^2+?`, r * r],
          [`(x+${s}y)(x-${t}y)`, `x^2+?xy-${s * t}y^2`, s - t],
          [`(${a}x+1)(-${b}x+${c})`, `?x^2${sg(a * c - b, 'x')}+${c}`, -a * b]
        ]);
      }, (list) => { const vs = list.map((r) => r[2]), lo = Math.min(...vs); return vs.filter((v) => v === lo).length === 1 && !list.some((r) => r[1].includes('+0x')) && vs.every((v) => v !== 0); });
      const vs = rows.map((r) => r[2]), at = vs.indexOf(Math.min(...vs));
      return C('다음 중 □ 안에 알맞은 수가 가장 작은 것은?', rows.map((r) => xh(r[0]) + ' = ' + xh(r[1])), at, {
        explain: rows.map((r) => `${xh(r[0])}에서 □ = ${tx(Q(r[2]))}`).join(', ') + `이므로 가장 작은 것은 ${tx(Q(vs[at]))}이다.`,
        facts: { truth: vs.map((v, i) => i === at), want: true }
      });
    }),
    T('expand-chain', '세 식을 잇달아 곱하기', '①10', (d) => {
      const a = d.int(2, 5), back = d.bool(), src = back ? `(${a}-x)(${a}+x)(${a * a}+x^2)` : `(x-${a})(x+${a})(x^2+${a * a})`;
      const mid = back ? `(${a * a} − ${V('x')}${sup(2)})(${a * a} + ${V('x')}${sup(2)})` : `(${V('x')}${sup(2)} − ${a * a})(${V('x')}${sup(2)} + ${a * a})`;
      return polyQ(EXPAND, src, ['x^4', ''], { explain: `앞의 두 식을 먼저 곱하면 다시 합과 차의 곱이 된다. ${xh(src)} = ${nb(mid)} = ${pt(xv(src))}이다.` });
    })
  ];

  // ── 곱셈 공식 ──
  // (a ± b)² = a² ± 2ab + b² 을 한 줄로 푼 글: sqLine(2, 'x', -5, '') → (2x)² − 2 × 2x × 5 + 5²
  const mono1 = (c, v) => (Math.abs(c) === 1 && v ? '' : Math.abs(c)) + (v ? V(v) : '');
  const sqLine = (a, u, b, w) => nb(`(${a < 0 ? MINUS : ''}${mono1(a, u)})${sup(2)} ${a * b < 0 ? MINUS : '+'} 2 × ${mono1(a, u)} × ${mono1(b, w)} + (${mono1(b, w)})${sup(2)}`);
  const formulaTypes = [
    T('formula-square', '(a ± b)²의 전개', '①11', (d, n) => {
      if (n === 0) {
        const [a, b] = [d.int(1, 6), nz(d, -9, 9)], src = `(${lin(a, b)})^2`;
        return polyQ(EXPAND, src, ['x^2', 'x', ''], { rule: 'sq-one', explain: `곱셈 공식 ${nb(`(${V('a')} ${b < 0 ? MINUS : '+'} ${V('b')})${sup(2)} = ${V('a')}${sup(2)} ${b < 0 ? MINUS : '+'} 2${V('a')}${V('b')} + ${V('b')}${sup(2)}`)}을 이용한다. ${xh(src)} = ${sqLine(a, 'x', b, '')} = ${pt(xv(src))}이다.` });
      }
      const [u, w] = pairOf(d), [a, b] = [d.int(1, 5), nz(d, -7, 7)], src = `(${lin2(-a, b, u, w)})^2`;
      return polyQ(EXPAND, src, [u + '^2', u + w, w + '^2'], { rule: 'sq-neg', explain: `${xh(src)} = ${sqLine(-a, u, b, w)} = ${pt(xv(src))}이다.` });
    }, { count: 2 }),
    T('formula-diff', '(a + b)(a − b)의 전개', '①12', (d, n) => {
      const [u, w] = pairOf(d), [a, b] = [d.int(1, 7), d.int(1, 9)];
      if (n === 0) {
        const src = d.bool() ? `(${lin2(a, b, u, w)})(${lin2(a, -b, u, w)})` : `(${lin2(a, -b, u, w)})(${lin2(a, b, u, w)})`;
        return polyQ(EXPAND, src, [u + '^2', w + '^2'], { rule: 'diff-plain', explain: `곱셈 공식 ${nb(`(${V('a')} + ${V('b')})(${V('a')} − ${V('b')}) = ${V('a')}${sup(2)} − ${V('b')}${sup(2)}`)}을 이용한다. ${xh(src)} = ${pt(xv(src))}이다.` });
      }
      // 같은 항이 음수인 꼴: (−ax + by)(−ax − by), (ax − by)(−ax − by)
      const first = d.bool(), src = first ? `(${lin2(-a, b, u, w)})(${lin2(-a, -b, u, w)})` : `(${lin2(a, -b, u, w)})(${lin2(-a, -b, u, w)})`;
      const sameH = first ? `(${MINUS}${mono1(a, u)})${sup(2)} − (${mono1(b, w)})${sup(2)}` : `(${MINUS}${mono1(b, w)})${sup(2)} − (${mono1(a, u)})${sup(2)}`;
      return polyQ(EXPAND, src, [u + '^2', w + '^2'], { rule: 'diff-neg', explain: `두 괄호에서 부호가 같은 항이 ${first ? MINUS + mono1(a, u) : MINUS + mono1(b, w)}이므로 ${xh(src)} = ${nb(sameH)} = ${pt(xv(src))}이다.` });
    }, { count: 2 }),
    T('formula-xab', '(x + a)(x + b)의 전개', '①13', (d, n) => {
      const [p, q] = d.until(() => [nz(d, -9, 9), nz(d, -9, 9)], ([x, y]) => x + y !== 0 && x !== y);
      if (n === 0) {
        const src = `(${lin(1, p)})(${lin(1, q)})`;
        return polyQ(EXPAND, src, ['x^2', 'x', ''], { rule: 'xab-one', explain: `곱셈 공식 ${nb(`(${V('x')} + ${V('a')})(${V('x')} + ${V('b')}) = ${V('x')}${sup(2)} + (${V('a')} + ${V('b')})${V('x')} + ${V('a')}${V('b')}`)}를 이용한다. ${xh(src)} = ${nb(`${V('x')}${sup(2)} + {${tx(Q(p))} + (${tx(Q(q))})}${V('x')} + (${tx(Q(p))}) × (${tx(Q(q))})`)} = ${pt(xv(src))}이다.` });
      }
      const [u, w] = pairOf(d), src = `(${lin2(1, p, u, w)})(${lin2(1, q, u, w)})`;
      return polyQ(EXPAND, src, [u + '^2', u + w, w + '^2'], { rule: 'xab-two', explain: `${V(u)}에 대한 곱셈 공식으로 본다. ${xh(src)} = ${pt(xv(src))}이다.` });
    }, { count: 2 }),
    T('formula-axb', '(ax + b)(cx + d)의 전개', '①14', (d) => {
      const src = d.until(() => `(${lin(d.int(1, 6), nz(d, -9, 9))})(${lin(d.int(2, 6), nz(d, -9, 9))})`, (s) => polyOK(s, ['x^2', 'x', '']));
      return polyQ(EXPAND, src, ['x^2', 'x', ''], { explain: `곱셈 공식 ${nb(`(${V('a')}${V('x')} + ${V('b')})(${V('c')}${V('x')} + ${V('d')}) = ${V('a')}${V('c')}${V('x')}${sup(2)} + (${V('a')}${V('d')} + ${V('b')}${V('c')})${V('x')} + ${V('b')}${V('d')}`)}를 이용한다. ${told(src)}이다.` });
    }),
    T('formula-same', '부호를 바꾼 식과 전개식이 같은 것 고르기', '①15', (d, n) => {
      const [u, w] = pairOf(d), [p, q] = [d.int(1, 4), d.int(1, 5)], Bm = (q === 1 ? '' : q) + w, Am = (p === 1 ? '' : p) + u;
      const target = n === 0 ? `(${Am}-${Bm})^2` : `(${Am}+${Bm})(${Am}-${Bm})`;
      const goods = n === 0 ? [`(${Bm}-${Am})^2`, `(-${Am}+${Bm})^2`] : [`(-${Am}+${Bm})(-${Am}-${Bm})`, `(${Bm}+${Am})(${Am}-${Bm})`];
      const bads = n === 0 ? [`(${Am}+${Bm})^2`, `(-${Am}-${Bm})^2`, `-(${Bm}-${Am})^2`, `-(${Am}+${Bm})^2`] : [`(${Am}+${Bm})(${Bm}-${Am})`, `(${Am}+${Bm})(-${Am}-${Bm})`, `(-${Am}+${Bm})(${Am}+${Bm})`, `(${Am}-${Bm})(-${Am}-${Bm})`];
      const good = d.pick(goods), rows = d.shuffle([good].concat(bads)), T0 = xv(target);
      const truth = rows.map((s) => same(xv(s), T0)), at = truth.indexOf(true);
      return C(`다음 중 ${xj(target, '과/와')} 전개식이 같은 것은?`, rows.map(xh), at, {
        explain: `${xh(target)} = ${pt(T0)}이다. ` + rows.map((s) => `${xh(s)} = ${pt(xv(s))}`).join(', ') + '이다.',
        facts: { truth, want: true, rule: n === 0 ? 'same-square' : 'same-diff' }
      });
    }, { count: 2 }),
    T('formula-opposite', '두 괄호가 서로 −1배인 곱의 전개', '①16', (d) => {
      const [p, q] = [d.int(1, 9), d.int(2, 6)], src = d.bool() ? `(${p}-${q}x)(${q}x-${p})` : `(${q}x-${p})(${p}-${q}x)`;
      return polyQ(EXPAND, src, ['x^2', 'x', ''], { explain: `${nb(`${p} − ${q}${V('x')} = −(${q}${V('x')} − ${p})`)}이므로 ${xh(src)} = ${nb(`−(${q}${V('x')} − ${p})${sup(2)}`)} = ${nb(`−(${pt(xv(`(${q}x-${p})^2`))})`)} = ${pt(xv(src))}이다.` });
    }),
    T('formula-claims', '바르게 전개한 것 고르기', '①17', (d, n) => {
      const [a, b, c, e, f, g, h, k, m, r] = [d.int(2, 9), d.int(2, 5), d.int(2, 6), d.int(2, 5), d.int(1, 9), d.int(2, 9), d.int(2, 7), d.int(2, 7), d.int(2, 4), d.int(1, 5)];
      const pool = [
        [`(x-${a})^2`, xv(`x^2-${a * a}`), '가운데 항을 빠뜨렸다.'],
        [`(${b}x+1)^2`, xv(`${b}x^2+${2 * b}x+1`), `${b}${V('x')}의 계수 ${b}도 제곱해야 한다.`],
        [`(x-${c}y)^2`, xv(`x^2-${2 * c}xy+${c}y^2`), `${V('y')}${sup(2)}의 계수는 ${c}${sup(2)} = ${c * c}이다.`],
        [`(${e}x-${f})^2`, xv(`${e * e}x^2+${f * f}`), '가운데 항을 빠뜨렸다.'],
        [`(-x+${g})(x+${g})`, xv(`x^2-${g * g}`), `${nb(`(−${V('x')} + ${g})(${V('x')} + ${g}) = ${g}${sup(2)} − ${V('x')}${sup(2)}`)}이다.`],
        [`(x+${h})(x-${k})`, xv(`x^2${sg(h + k, 'x')}-${h * k}`), `${V('x')}의 계수는 ${h} + (−${k})이다.`],
        [`(${m}x+1)(x-${r})`, xv(`${m}x^2${sg(m * r + 1, 'x')}-${r}`), `${V('x')}의 계수는 ${m} × (−${r}) + 1 × 1이다.`]
      ].filter((row) => !same(xv(row[0]), row[1]));
      return eqQ(d, n === 0 ? '다음 중 바르게 전개한 것은?' : '다음 중 전개한 것이 옳지 않은 것은?', pool, n === 0, { rule: n === 0 ? 'claims-true' : 'claims-false' });
    }, { count: 2 })
  ];

  // ── 여러 곱셈을 섞은 계산과 넓이 ──
  const mixedTypes = [
    T('mixed-two', '두 곱의 합과 차', '①20', (d, n) => {
      if (n === 0) {
        const src = d.until(() => {
          const first = `(${lin(d.int(1, 3), nz(d, -6, 6))})(${lin(d.int(1, 3), nz(d, -6, 6))})`, e = d.int(1, 6);
          const second = d.pick([`(${lin(1, nz(d, -6, 6))})^2`, `(x+${e})(x-${e})`, `(x-${e})(-x-${e})`, `(${lin(2, nz(d, -5, 5))})^2`]);
          return first + d.pick(['+', '-']) + d.pick(['', '2', '3']) + second;
        }, (s) => polyOK(s, ['x^2', 'x', '']) && /\)\^2|\)\(/.test(s));
        return polyQ(CALC, src, ['x^2', 'x', ''], { rule: 'mixed-one', explain: `곱셈 공식으로 각각 전개한 다음 동류항끼리 모은다. ${told(src)}이다.` });
      }
      const src = d.until(() => `${d.int(2, 3)}(${lin2(1, -d.int(1, 4), 'x', 'y')})(${lin2(d.int(2, 4), 1, 'x', 'y')})-(${lin2(d.int(2, 4), -d.int(1, 4), 'x', 'y')})(${lin2(1, d.int(1, 4), 'x', 'y')})`, (s) => polyOK(s, ['x^2', 'xy', 'y^2']));
      return polyQ(CALC, src, ['x^2', 'xy', 'y^2'], { rule: 'mixed-two', explain: `각각 전개한 다음 빼는 식의 각 항의 부호를 바꾸어 동류항끼리 모은다. ${told(src)}이다.` });
    }, { count: 2 }),
    T('mixed-three', '세 곱을 더하고 뺀 식의 계수', '①21', (d) => {
      // (2x + a)(x + b) + (c − x)(c + x) − (−x + e)²: x² 의 항은 모두 지워진다.
      const src = d.until(() => `(${lin(2, nz(d, -5, 5))})(${lin(1, nz(d, -5, 5))})+(${d.int(1, 5)}-x)(${d.int(1, 5)}+x)-(-x+${d.int(1, 5)})^2`, (s) => { const P = xv(s); return P.length === 2 && coefOf(P, { x: 1 }).p !== 0 && coefOf(P, {}).p !== 0 && /\((\d)-x\)\(\1\+x\)/.test(s); });
      const P = xv(src), t1 = termOf(P, { x: 1 }), t0 = termOf(P, {});
      return slots(`다음 식을 계산했을 때, ${V('x')}의 계수와 상수항은?`, [[`${V('x')}의 계수`, t1.q.p, t1.s], ['상수항', t0.q.p, t0.s]], {
        figure: xex(src), unseen: [1], rule: 'three', explain: `${told(src)}이므로 ${V('x')}의 계수는 ${tx(t1.q)}, 상수항은 ${tx(t0.q)}이다.`
      });
    }),
    T('mixed-box', '직육면체의 겉넓이', '①22', (d) => {
      const [L, W, H] = d.until(() => [lin(d.int(1, 3), d.int(1, 5)), lin(d.int(2, 4), -d.int(1, 3)), lin(d.int(1, 4), d.int(1, 4))], ([l, w, h]) => new Set([l, w, h]).size === 3 && polyOK(`2((${l})(${w})+(${w})(${h})+(${h})(${l}))`, ['x^2', 'x', '']));
      const src = `2((${L})(${W})+(${W})(${H})+(${H})(${L}))`;
      return polyQ('다음 그림과 같은 직육면체의 겉넓이를 구하시오.', src, ['x^2', 'x', ''], {
        figure: boxFig(L, W, H), unseen: [2],
        explain: `겉넓이는 2 × {(가로) × (세로) + (세로) × (높이) + (높이) × (가로)}이다. 2{${pt(xv(`(${L})(${W})`))} + ${pt(xv(`(${W})(${H})`))} + ${pt(xv(`(${H})(${L})`))}} = ${pt(xv(src))}이다.`
      });
    }),
    T('mixed-road', '길을 낸 땅의 넓이', '①23', (d) => {
      const w = d.int(1, 4), [Wd, Ht] = d.until(() => [lin(d.int(2, 7), d.int(1, 9)), lin(d.int(2, 6), d.int(1, 9))], ([a, b]) => a !== b && polyOK(`(${a}-${w})(${b}-${w})`, ['x^2', 'x', '']));
      const src = `(${Wd}-${w})(${Ht}-${w})`, P = xv(src);
      return polyQ(`다음 그림과 같이 가로의 길이가 ${xh(Wd)}, 세로의 길이가 ${xh(Ht)}인 직사각형 모양의 땅에 폭이 ${josa(w, '으로/로')} 일정한 길을 만들었다. 길을 제외한 땅의 넓이를 구하시오.`, src, ['x^2', 'x', ''], {
        figure: roadFig(Wd, Ht, w),
        explain: `길을 땅의 한쪽 끝으로 모으면 남은 땅은 가로의 길이가 ${pt(xv(`${Wd}-${w}`))}, 세로의 길이가 ${pt(xv(`${Ht}-${w}`))}인 직사각형이다. ${nb(`(${ph(xv(`${Wd}-${w}`))})(${ph(xv(`${Ht}-${w}`))})`)} = ${pt(P)}이다.`
      });
    }),
    T('mixed-shade', '나눈 직사각형의 색칠한 부분의 넓이', '①24', (d) => {
      const [p, q, r, s] = d.until(() => [d.int(3, 6), d.int(2, 5), d.int(1, 3), d.int(1, 3)], ([pp, qq, rr, ss]) => pp !== qq && pp * ss + qq * rr !== 0);
      const PA = p + 'a', QA = q + 'a', RB = (r === 1 ? '' : r) + 'b', SB = (s === 1 ? '' : s) + 'b';
      const src = `(${PA}-${RB})(${QA}-${SB})+(${RB})(${SB})`;
      return polyQ(`다음 그림과 같이 가로와 세로의 길이가 각각 ${xh(PA)}, ${xh(QA)}인 직사각형을 네 개의 작은 직사각형으로 나누었을 때, 색칠한 부분의 넓이를 구하시오.`, src, ['a^2', 'ab', 'b^2'], {
        figure: shadeFig(PA, QA, RB, SB),
        explain: `왼쪽 위 직사각형은 가로 ${xh(`${PA}-${RB}`)}, 세로 ${xh(`${QA}-${SB}`)}이고, 오른쪽 아래 직사각형은 가로 ${xh(RB)}, 세로 ${xh(SB)}이다. ${told(src)}이다.`
      });
    }),
    T('mixed-resize', '변을 늘이고 줄인 직사각형의 넓이로 수 구하기', '①25', (d) => {
      const [m, k, a] = [d.int(2, 4), d.int(2, 4), d.int(1, 6)], c = k * a * a, b = m * a - k * m * a, mx = m + 'x';
      return slots(`한 변의 길이가 ${xh(mx)}인 정사각형에서 가로의 길이를 ${V('a')}만큼 늘이고 세로의 길이를 ${k}${V('a')}만큼 줄여서 만든 직사각형의 넓이가 ${xh(`${m * m}x^2+bx-${c}`)}일 때, 수 ${V('a')}, ${V('b')}의 값은? (단, ${V('a')} &gt; 0)`, [[eqLabel('a'), a, null], [eqLabel('b'), b, null]], {
        rule: 'resize', check: { kind: 'resize', m, k, c },
        explain: `넓이는 ${nb(`(${m}${V('x')} + ${V('a')})(${m}${V('x')} − ${k}${V('a')}) = ${m * m}${V('x')}${sup(2)} − ${m * k - m}${V('a')}${V('x')} − ${k}${V('a')}${sup(2)}`)}이다. ${k}${V('a')}${sup(2)} = ${c}에서 ${V('a')}${sup(2)} = ${a * a}이고 ${V('a')} &gt; 0이므로 ${V('a')} = ${a}, ${V('b')} = −${m * k - m} × ${a} = ${tx(Q(b))}이다.`
      });
    })
  ];

  // ── 곱셈 공식을 이용한 수의 계산 ──
  const BASES = [20, 30, 40, 50, 60, 70, 80, 90, 100];
  const FORMULA_NAMES = [
    `(${V('a')} + ${V('b')})${sup(2)} = ${V('a')}${sup(2)} + 2${V('a')}${V('b')} + ${V('b')}${sup(2)}`,
    `(${V('a')} − ${V('b')})${sup(2)} = ${V('a')}${sup(2)} − 2${V('a')}${V('b')} + ${V('b')}${sup(2)}`,
    `(${V('a')} + ${V('b')})(${V('a')} − ${V('b')}) = ${V('a')}${sup(2)} − ${V('b')}${sup(2)}`,
    `(${V('x')} + ${V('a')})(${V('x')} + ${V('b')}) = ${V('x')}${sup(2)} + (${V('a')} + ${V('b')})${V('x')} + ${V('a')}${V('b')}`,
    `(${V('a')}${V('x')} + ${V('b')})(${V('c')}${V('x')} + ${V('d')}) = ${V('a')}${V('c')}${V('x')}${sup(2)} + (${V('a')}${V('d')} + ${V('b')}${V('c')})${V('x')} + ${V('b')}${V('d')}`
  ].map((h) => h.split(' = ').map(nb).join(' = '));   // 등호에서만 줄이 갈리게(긴 공식이 한 덩이면 좁은 화면에서 넘친다)
  const numTypes = [
    T('num-square', '큰 수의 제곱을 곱셈 공식으로', '①26', (d) => {
      const base = d.pick(BASES), k = d.int(1, base === 100 ? 9 : 4), plus = base === 100 ? false : d.bool(), n = plus ? base + k : base - k;
      return numQ1(`곱셈 공식을 이용하여 ${n}${sup(2)}을 계산하면?`, n * n, {
        calc: `${n}*${n}`, explain: `${n}${sup(2)} = (${base} ${plus ? '+' : MINUS} ${k})${sup(2)} = ${base}${sup(2)} ${plus ? '+' : MINUS} 2 × ${base} × ${k} + ${k}${sup(2)} = ${base * base} ${plus ? '+' : MINUS} ${2 * base * k} + ${k * k} = ${n * n}이다.`
      });
    }),
    T('num-product', '두 수의 곱을 합과 차의 곱으로', '①27', (d) => {
      const base = d.pick(BASES), k = d.int(1, 9), [m, n] = d.shuffle([base - k, base + k]);
      return numQ1(`곱셈 공식을 이용하여 ${m} × ${josa(n, '을/를')} 계산하면?`, m * n, {
        calc: `${m}*${n}`, explain: `${m} × ${n} = (${base} ${m < n ? MINUS : '+'} ${k})(${base} ${m < n ? '+' : MINUS} ${k}) = ${base}${sup(2)} − ${k}${sup(2)} = ${base * base} − ${k * k} = ${m * n}이다.`
      });
    }),
    T('num-formula-pick', '수의 계산에 알맞은 곱셈 공식 고르기', '①28', (d, n) => {
      const base = d.pick([100, 200, 50, 60]), [a, b] = d.until(() => [d.int(1, 4), d.int(1, 4)], ([x, y]) => x !== y);   // 가장 가까운 몇십이 base 가 되게(94 = 90 + 4 = 100 − 6 처럼 갈리지 않게)
      const kinds = [
        [`${base + a}${sup(2)}`, 0, `${base + a}${sup(2)} = (${base} + ${a})${sup(2)}`],
        [`${base - a}${sup(2)}`, 1, `${base - a}${sup(2)} = (${base} − ${a})${sup(2)}`],
        [`${base - a} × ${base + a}`, 2, `${base - a} × ${base + a} = (${base} − ${a})(${base} + ${a})`],
        [`${base + a} × ${base + b}`, 3, `${base + a} × ${base + b} = (${base} + ${a})(${base} + ${b})`]
      ];
      if (n === 0) {
        const [shown, at, why] = d.pick(kinds);
        return C(`다음 중 ${ej(shown, '을/를')} 계산할 때 이용하면 가장 편리한 곱셈 공식은?`, FORMULA_NAMES, at, {
          explain: `${nb(why)}${/<\/sup>$/.test(why) ? '으로' : josa(Number(why.match(/(\d+)\)$/)[1]), '으로/로').slice(why.match(/(\d+)\)$/)[1].length)} 볼 수 있으므로 ${ej(FORMULA_NAMES[at], '을/를')} 이용한다.`, facts: { truth: FORMULA_NAMES.map((_, i) => i === at), want: true, rule: 'formula-for-number' }
        });
      }
      // 주어진 공식 (x + a)(x + b) 를 쓰면 편리한 것 하나
      const e = (d.int(1, 4) + 1) / 10, sym = [`${(6 + e).toFixed(1)} × ${(6 - e).toFixed(1)}`, 2, `(6 + ${e})(6 − ${e})`];
      const rows = d.shuffle([kinds[3], kinds[0], kinds[1], kinds[2], sym]), at = rows.findIndex((r) => r[1] === 3);
      return C(`다음 중 곱셈 공식 ${FORMULA_NAMES[3]}를 이용하여 계산하면 가장 편리한 것은?`, rows.map((r) => r[0]), at, {
        explain: rows.map((r) => nb(r[2])).join(', ') + `이므로 (${V('x')} + ${V('a')})(${V('x')} + ${V('b')}) 꼴은 ${rows[at][0]}이다.`,
        facts: { truth: rows.map((r, i) => i === at), want: true, rule: 'number-for-formula' }
      });
    }, { count: 2 }),
    T('num-rad-square', '근호가 든 식의 제곱', '①29', (d) => {
      if (d.bool()) {
        const [p, q] = d.until(() => [d.pick(SQF.slice(0, 8)), d.pick(SQF.slice(0, 8))], ([x, y]) => x !== y && isSqf(x * y) && x * y <= 40);
        const s = d.pick([1, -1]), a = p + q, b = 2 * s, c = p * q;
        return surdAns(`${nb(`(${rt(p)} ${s < 0 ? MINUS : '+'} ${rt(q)})${sup(2)}`)}을 계산하면?`, a, b, c, {
          calc: [[`${p}+${q}`, 0], [s < 0 ? '-2' : '2', 1], [`${p}*${q}`, 2]], unseen: [2], rule: 'rad-sq-two',
          explain: `${nb(`(${rt(p)})${sup(2)} ${s < 0 ? MINUS : '+'} 2 × ${rt(p)} × ${rt(q)} + (${rt(q)})${sup(2)}`)} = ${nb(`${p} ${s < 0 ? MINUS : '+'} 2${rt(c)} + ${q}`)} = ${sH(sOf([a, 1], [b, c]))}이다.`
        });
      }
      const [p, q, s] = [d.pick(SQF.slice(0, 10)), d.int(1, 5), d.pick([1, -1])], a = p + q * q, b = 2 * q * s;
      return surdAns(`${nb(`(${rt(p)} ${s < 0 ? MINUS : '+'} ${q})${sup(2)}`)}을 계산하면?`, a, b, p, {
        calc: [[`${p}+${q}*${q}`, 0], [`${s < 0 ? '-' : ''}2*${q}`, 1], [`${p}`, 2]], unseen: [2], rule: 'rad-sq-one',
        explain: `${nb(`(${rt(p)})${sup(2)} ${s < 0 ? MINUS : '+'} 2 × ${rt(p)} × ${q} + ${q}${sup(2)}`)} = ${sH(sOf([a, 1], [b, p]))}이다.`
      });
    }),
    T('num-rad-conj', '근호가 든 식의 합과 차의 곱', '①30', (d) => {
      const [a, b, c] = d.until(() => [d.int(1, 9), d.int(1, 4), d.pick(SQF.slice(0, 8))], ([x, y, z]) => x * x !== y * y * z);
      const r = `${b === 1 ? '' : b}${rt(c)}`;
      return numQ1(`${ej(nb(`(${a} − ${r})(${a} + ${r})`), '을/를')} 계산하면?`, a * a - b * b * c, {
        calc: `${a}*${a}-${b}*${b}*${c}`, unseen: [1],
        explain: `${nb(`${a}${sup(2)} − (${r})${sup(2)} = ${a * a} − ${b * b * c}`)} = ${tx(Q(a * a - b * b * c))}이다.`
      });
    }),
    T('num-rad-mixed', '근호가 든 두 곱의 차', '①31', (d) => {
      // (m√a + n√b)² − (u√ab + v)(w + √ab)
      const [a, b, m, n, u, v, w] = d.until(() => { const pr = d.shuffle([2, 3, 5, 7]); return [pr[0], pr[1], d.int(1, 3), d.int(1, 3), nz(d, -5, 5), nz(d, -3, 3), d.int(1, 3)]; },
        ([aa, bb, mm, nn, uu, vv, ww]) => { const r0 = mm * mm * aa + nn * nn * bb - uu * aa * bb - vv * ww, r1 = 2 * mm * nn - uu * ww - vv; return r0 !== 0 && r1 !== 0 && Math.abs(r1) <= 40 && Math.abs(r0) <= 200; });
      const ab = a * b, r0 = m * m * a + n * n * b - u * a * b - v * w, r1 = 2 * m * n - u * w - v;
      const one = `(${m === 1 ? '' : m}${rt(a)} + ${n === 1 ? '' : n}${rt(b)})${sup(2)}`, two = `(${u < 0 ? MINUS : ''}${Math.abs(u) === 1 ? '' : Math.abs(u)}${rt(ab)} ${v < 0 ? MINUS : '+'} ${Math.abs(v)})(${w} + ${rt(ab)})`;
      return surdAns(`${nb(one)} − ${ej(nb(two), '을/를')} 계산하면?`, r0, r1, ab, {
        calc: [[`${m}*${m}*${a}+${n}*${n}*${b}-(${jn(u)}*${a}*${b}+${jn(v)}*${w})`, 0], [`2*${m}*${n}-(${jn(u)}*${w}+${jn(v)})`, 1], [`${a}*${b}`, 2]], unseen: [1, 2], rule: 'rad-mixed',
        explain: `${nb(one)} = ${sH(sOf([m * m * a + n * n * b, 1], [2 * m * n, ab]))}, ${nb(two)} = ${sH(sOf([u * ab + v * w, 1], [u * w + v, ab]))}이므로 두 식의 차는 ${sH(sOf([r0, 1], [r1, ab]))}이다.`
      });
    })
  ];

  // ── 분모의 유리화와 곱셈 공식의 변형 ──
  const fr1 = (top, bottom) => frac(top, bottom);
  const ratTypes = [
    T('rat-one', '분모가 √a ± b 인 수의 유리화', '①32', (d) => {
      const [a, b, s, t] = d.until(() => [d.pick(SQF), d.int(1, 6), d.pick([1, -1]), nz(d, -6, 6)], ([aa, bb, , tt]) => aa !== bb * bb && Math.abs(tt) >= 2 && tt * (aa - bb * bb) > 0 && tt * (aa - bb * bb) <= 60);
      const D2 = a - b * b, k = t * D2, den = `${rt(a)} ${s < 0 ? MINUS : '+'} ${b}`, conj = `${rt(a)} ${s < 0 ? '+' : MINUS} ${b}`;
      return surdAns(`${nb(fr1(k, den))}의 분모를 유리화하면?`, -s * b * t, t, a, {
        calc: [[`${s < 0 ? '' : '-'}${b}*${k}/(${a}-${b}*${b})`, 0], [`${k}/(${a}-${b}*${b})`, 1], [`${a}`, 2]], unseen: [], rule: 'rat-one',
        explain: `분모와 분자에 ${ej(nb(conj), '을/를')} 곱하면 분모는 ${nb(`(${rt(a)})${sup(2)} − ${b}${sup(2)} = ${tx(Q(D2))}`)}이므로 ${nb(fr1(`${k}(${conj})`, tx(Q(D2))))} = ${sH(sOf([-s * b * t, 1], [t, a]))}이다.`
      });
    }),
    T('rat-two', '분모가 √a ± √b 인 수의 유리화', '①32', (d) => {
      const [a, b, s, t] = d.until(() => [d.pick(SQF.slice(0, 12)), d.pick(SQF.slice(0, 12)), d.pick([1, -1]), d.int(2, 6)], ([aa, bb, , tt]) => aa > bb && tt * (aa - bb) <= 60);
      const k = t * (a - b), den = `${rt(a)} ${s < 0 ? MINUS : '+'} ${rt(b)}`, conj = `${rt(a)} ${s < 0 ? '+' : MINUS} ${rt(b)}`;
      return inline(`${nb(fr1(k, den))}의 분모를 유리화하면?` + NOTE1, grp('{0}' + rt('{1}')) + ' ' + grp('{2}' + rt('{3}')), [{ answer: t, signed: true }, { answer: a }, { answer: -s * t, signed: true }, { answer: b }], {
        blocks: [[0, 1], [2, 3]], shown: sH(sOf([t, a], [-s * t, b])),
        explain: `분모와 분자에 ${ej(nb(conj), '을/를')} 곱하면 분모는 ${nb(`${a} − ${b} = ${a - b}`)}이므로 ${nb(fr1(`${k}(${conj})`, a - b))} = ${sH(sOf([t, a], [-s * t, b]))}이다.`,
        facts: { calc: [[`${k}/(${a}-${b})`, 0], [`${a}`, 1], [`${s < 0 ? '' : '-'}${k}/(${a}-${b})`, 2], [`${b}`, 3]] }
      });
    }),
    T('rat-both', '분자에도 근호가 있는 수의 유리화', '①33 ①34', (d, n) => {
      if (n === 0) {
        // (√a + s√b)/(√a − s√b) = (a + b + 2s√ab)/(a − b)
        const [a, b, s] = d.until(() => [d.pick(SQF.slice(0, 12)), d.pick([2, 3, 5, 6, 7, 10, 11]), d.pick([1, -1])], ([aa, bb, ss]) => {
          if (aa === bb) return false; const R = sDiv(sOf([1, aa], [ss, bb]), sOf([1, aa], [-ss, bb]));
          return sInt(R) && R.length === 2 && R[0].r === 1 && Math.abs(R[1].q.p) >= 2 && R[1].r >= 2;
        });
        const R = sDiv(sOf([1, a], [s, b]), sOf([1, a], [-s, b])), r0 = R[0].q.p, r1 = R[1].q.p, c = R[1].r, kk = sqParts(a * b)[0];
        const top = `${rt(a)} ${s < 0 ? MINUS : '+'} ${rt(b)}`, bottom = `${rt(a)} ${s < 0 ? '+' : MINUS} ${rt(b)}`;
        return surdAns(`${nb(fr1(top, bottom))}의 분모를 유리화하면?`, r0, r1, c, {
          calc: [[`(${a}+${b})/(${a}-${b})`, 0], [`${s < 0 ? '-' : ''}2*${kk}/(${a}-${b})`, 1], [`${a}*${b}/${kk * kk}`, 2]], unseen: [2, kk, kk * kk], rule: 'rat-both-roots',
          explain: `분모와 분자에 ${ej(nb(top), '을/를')} 곱하면 ${nb(fr1(`(${top})${sup(2)}`, `${a} − ${b}`))} = ${nb(fr1(`${a + b} ${s < 0 ? MINUS : '+'} 2${rt(a * b)}`, a - b))} = ${sH(R)}이다.`
        });
      }
      // (p + √c)/(q − r√c) = A + B√c
      const [p, c, q, r] = d.until(() => [d.int(1, 6), d.pick([2, 3, 5, 6, 7]), d.int(2, 7), d.int(1, 3)], ([pp, cc, qq, rr]) => {
        const den = qq * qq - rr * rr * cc; if (den === 0 || Math.abs(den) > 3) return false;
        const R = sDiv(sOf([pp, 1], [1, cc]), sOf([qq, 1], [-rr, cc])); return sInt(R) && R.length === 2 && Math.abs(R[1].q.p) >= 2;
      });
      const R = sDiv(sOf([p, 1], [1, c]), sOf([q, 1], [-r, c])), den = q * q - r * r * c, top = `${p} + ${rt(c)}`, bottom = `${q} − ${r === 1 ? '' : r}${rt(c)}`, conj = `${q} + ${r === 1 ? '' : r}${rt(c)}`;
      return surdAns(`${nb(fr1(top, bottom))}의 분모를 유리화하면?`, R[0].q.p, R[1].q.p, c, {
        calc: [[`(${p}*${q}+${r}*${c})/(${q}*${q}-${r}*${r}*${c})`, 0], [`(${q}+${p}*${r})/(${q}*${q}-${r}*${r}*${c})`, 1], [`${c}`, 2]], unseen: [1], rule: 'rat-both-mixed',
        explain: `분모와 분자에 ${ej(nb(conj), '을/를')} 곱하면 분모는 ${nb(`${q}${sup(2)} − (${r === 1 ? '' : r}${rt(c)})${sup(2)} = ${tx(Q(den))}`)}, 분자는 ${nb(`(${top})(${conj})`)} = ${sH(sOf([p * q + r * c, 1], [q + p * r, c]))}이므로 ${sH(R)}이다.`
      });
    }, { count: 2 }),
    T('rat-sum', '유리화한 두 수의 합', '①35', (d) => {
      const [b, a] = d.until(() => { const bb = d.int(1, 6); return [bb, bb * bb + d.pick([1, -1])]; }, ([, aa]) => isSqf(aa));
      const D2 = a - b * b, coef = 2 / D2;
      return radAns(`${V('x')} = ${nb(fr1(1, `${rt(a)} + ${b}`))}, ${V('y')} = ${nb(fr1(1, `${rt(a)} − ${b}`))}일 때, ${nb(`${V('x')} + ${V('y')}`)}의 값은?`, coef, a, {
        explain: `두 수의 분모를 유리화하면 ${V('x')} = ${sH(sDiv(sOf([1, 1]), sOf([1, a], [b, 1])))}, ${V('y')} = ${sH(sDiv(sOf([1, 1]), sOf([1, a], [-b, 1])))}이므로 ${V('x')} + ${V('y')} = ${radText(coef, a)}이다.`,
        facts: { calc: [[`2/(${a}-${b}*${b})`, 0], [`${a}`, 1]], unseen: [2] }
      });
    }),
    T('rat-diff-frac', '두 분수의 차를 a√c 꼴로', '①35의 변형', (d) => {
      const [p, q] = d.until(() => [d.pick([2, 3, 5, 6, 7, 11]), d.pick([2, 3, 5, 6, 7, 11])], ([x, y]) => x !== y && [1, 2, 4].includes(Math.abs(x - y)) && isSqf(x * y));
      const a = -4 / (p - q), A = `${rt(p)} − ${rt(q)}`, Bq = `${rt(p)} + ${rt(q)}`;
      return numQ1(`${nb(fr1(A, Bq))} − ${nb(fr1(Bq, A))} = ${V('a')}${rt(p * q)}일 때, 유리수 ${V('a')}의 값은?`, a, {
        calc: `-4/(${p}-${q})`, unseen: [4],
        explain: `통분하면 분모는 ${nb(`(${Bq})(${A}) = ${p} − ${q}`)}, 분자는 ${nb(`(${A})${sup(2)} − (${Bq})${sup(2)} = −4${rt(p * q)}`)}이므로 ${V('a')} = ${tx(Q(-4, p - q))}이다.`
      });
    }),
    T('rat-sq-sum', '유리화한 두 수의 제곱의 합', '①36', (d) => {
      const [b, a] = d.until(() => { const bb = d.int(1, 6); return [bb, bb * bb + d.pick([1, -1])]; }, ([, aa]) => isSqf(aa));
      const x = sDiv(sOf([1, 1]), sOf([b, 1], [1, a])), y = sDiv(sOf([1, 1]), sOf([b, 1], [-1, a])), v = 2 * (b * b + a);
      return numQ1(`${V('x')} = ${nb(fr1(1, `${b} + ${rt(a)}`))}, ${V('y')} = ${nb(fr1(1, `${b} − ${rt(a)}`))}일 때, ${V('x')}${sup(2)} + ${V('y')}${sup(2)}의 값은?`, v, {
        calc: `2*(${b}*${b}+${a})`, unseen: [2],
        explain: `분모를 유리화하면 ${V('x')} = ${sH(x)}, ${V('y')} = ${sH(y)}이다(분모 ${nb(`${b}${sup(2)} − ${a} = ${tx(Q(b * b - a))}`)}). ${V('x')}${sup(2)} + ${V('y')}${sup(2)} = ${sH(sMul(x, x))} + ${sH(sMul(y, y))} = ${v}이다.`
      });
    }),
    T('rat-ident', '두 수의 합과 곱으로 다른 식의 값', '심8', (d, n) => {
      const [p, q] = d.until(() => [nz(d, -6, 6), nz(d, -6, 6)], ([x, y]) => x + y !== 0 && x !== y), s = p + q, m = p * q;
      const ask = [`${V('x')}${sup(2)} + ${V('y')}${sup(2)}`, `${V('x')}${sup(2)} − ${V('x')}${V('y')} + ${V('y')}${sup(2)}`, `(${V('x')} − ${V('y')})${sup(2)}`][n];
      const k = [2, 3, 4][n], v = s * s - k * m;
      const how = [`(${V('x')} + ${V('y')})${sup(2)} − 2${V('x')}${V('y')}`, `(${V('x')} + ${V('y')})${sup(2)} − 3${V('x')}${V('y')}`, `(${V('x')} + ${V('y')})${sup(2)} − 4${V('x')}${V('y')}`][n];
      return numQ1(`${nb(`${V('x')} + ${V('y')} = ${tx(Q(s))}`)}, ${nb(`${V('x')}${V('y')} = ${tx(Q(m))}`)}일 때, ${nb(ask)}의 값은?`, v, {
        calc: `${jn(s)}*${jn(s)}-${k}*${jn(m)}`, unseen: [k], rule: 'ident-' + n,
        explain: `${nb(ask)} = ${nb(how)} = ${nb(`(${tx(Q(s))})${sup(2)} − ${k} × (${tx(Q(m))})`)} = ${tx(Q(v))}이다.`
      });
    }, { count: 3 })
  ];

  B.kit.m913 = {
    STD, UNIT, T, NOTE1, jn, jq, parse, X, keyOf, term, tMul, pAdd, pNeg, pSub, pMul, pPow, valX, xv, mk, same, coefOf, termOf, letters, degOf, ordered, varH, termH, signed, ph, pt,
    htmlX, xh, xe, xex, eqx, xtagged, ej, xj, pj, magS, pn, lin, lin2, quad, sg, kp, PAIRS, pairOf, srcOf, told, EXPAND, CALC, FACTOR, polyOK, polyQ, asP, pickQ, eqQ, slots, eqLabel, numQ1,
    facH, facX, NOTE_AC, facAC, sNorm, sOf, sAdd, sNeg, sSub, sMul, sInv, sDiv, sInt, sPart, sH, rh, surdAns, SQF, isSqf, fr1,
    INK, TINT, SVG_ITALIC, svgX, plainX, svg, label, word, shapeD, thin, mono1
  };

  B.addUnit({
    id: '9-1-3', grade: 9, semester: 1, no: 3, title: '다항식의 곱셈과 인수분해', version: 2,
    groups: [
      { id: 'expand', title: '다항식의 곱셈', standard: STD, types: expandTypes },
      { id: 'formula', title: '곱셈 공식', standard: STD, types: formulaTypes },
      { id: 'mixed', title: '여러 곱셈을 섞은 계산과 넓이', standard: STD, types: mixedTypes },
      { id: 'numcalc', title: '곱셈 공식을 이용한 수의 계산', standard: STD, types: numTypes },
      { id: 'rational', title: '분모의 유리화와 곱셈 공식의 변형', standard: STD, types: ratTypes }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
