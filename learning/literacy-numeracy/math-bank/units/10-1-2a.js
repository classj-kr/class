// 고등학교 1학년 1학기 공통수학1 Ⅰ-2 「나머지정리와 인수분해」 — 단원 틀·도구와 앞쪽 묶음(항등식과 미정계수법, 나머지정리, 인수정리, 조립제법).
// 수집해 둔 천재 T셀파 공통수학1 두 종(홍진곤·전인태, 2022 개정)의 교과서·평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1: 61꼴, 기본꼴 2: 34꼴, 심화꼴: 8꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 뺌(까닭) / 겹침」을 가른 대조표는 references/textbooks/수학/_분석/10-1-2/싣기_대조표.md 에 있다.
// (인수분해 공식, 공통부분을 묶는 인수분해, 인수정리를 이용한 인수분해, 여러 문자가 섞인 식, 인수분해로 수 계산하기는 10-1-2b.js 에, 실력 문항은 10-1-2c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
// 성취기준: 10공수1-01-02(항등식의 성질과 나머지정리를 이해하고, 이를 활용하여 문제를 해결할 수 있다), 10공수1-01-03(다항식의 인수분해를 할 수 있다).
// 조립제법은 두 교과서 모두 Ⅰ-1(다항식의 나눗셈)에 싣지만 이 단원에서 다룬다(과제 글). 몫과 나머지를 구하는 긴 나눗셈 자체는 10-1-1 의 일이라 싣지 않는다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(정리된 식·곱의 꼴·나머지·몫·조립제법 표), 묻는 것(계수·나머지·몫·다른 값·고르기), 셈의 얼개(계수 비교·수 대입·
//    나누는 식을 인수분해·바꾼 식에 넣을 수·연립)가 다르면 따로 싣는다. 수만 바꾼 유형은 만들지 않는다.
//  - 「수학 실력에 필요해 보이는 문제는 다 넣는다」(사용자): 교육과정의 「항등식의 성질, 나머지정리와 인수정리를 활용하는 복잡한 문제는 다루지 않는다」를
//    까닭으로 빼지 않고, 세 단계 넘게 잇는 것과 뜻을 정확히 대야 풀리는 것은 실력(10-1-2c.js)에 둔다. 두 단계를 잇는 것, 거꾸로 한 번 구하는 것,
//    교과서가 사실로 가르치는 것, 수집본 기본 문서에 여러 번 나오는 꼴은 기본에 둔다.
//  - 답: 수는 부호 단추가 붙은 칸(음수가 될 수 없는 나머지·개수만 단추 없이), 분수는 분수 칸, 계수 여럿은 a, b, c 칸, 나머지 ax + b 는 「[±][ ]x [±][ ]」,
//    몫과 나머지는 「몫: [±][ ]x² [±][ ]x [±][ ], 나머지: [±][ ]」, 인수분해한 식은 괄호째 끼워 넣는 칸으로 받는다. 한 유형 안에서는 칸의 모양이 같다
//    (몫의 항이 빠지는 수, 나머지의 계수가 0인 수는 고르지 않는다). 칸의 모양이 답을 흘리는 꼴은 고르기로 낸다.
//  - 원문의 「a + b + c의 값」「abc의 값」처럼 따로 구한 값을 묶기만 한 물음은 값을 칸마다 따로 받는다.
//  - 답은 모두 코드가 셈한다(원문 답이 틀린 전인태 대단원 평가 23번 꼴은 바른 답으로). 검사 근거(facts.calc·value)는 글에 보이는 수로 다시 셈하는 식이고,
//    글에 없는 수(근, 나누는 식의 상수)는 facts.unseen 에 밝힌다(seal 이 밝히기로 한 수 밖의 수가 나오면 오류를 낸다).
//    인수분해한 식의 칸은 엔진 검사가 셈할 수 없으므로 facts.factor 에 처음 식과 답을 적고, 제 작업 폴더의 따로 지은 풀이로 맞춰 보았다.
//
// 뺀 것과 까닭(10-1-2b.js, 10-1-2c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 중학교 단원에 이미 있는 일: 등식이 성립하는 x 를 구하는 이차방정식(①1의 변형 — 9-1-4), 중3 인수분해 다섯 꼴만 쓰는 문제(기본꼴_2 머리의 건너뛴 것).
//  - 10-1-1(다항식의 연산)의 일: 「x + 2로 나눈 몫과 나머지」만 묻는 나눗셈(조립제법이라 하지 않은 것), A = BQ + R 에서 A 구하기.
//  - 활동·설명 쓰기: 나무 블록으로 공식 설명하기(기본꼴_2 머리), 나머지정리 유도의 빈칸(①21의 앞 — 같은 뜻을 고르기로 실었다).
//  - 겹침(하는 일이 이미 실은 유형과 같다): ①18의 x⁶ + ax³ + b = (x² − 1)P(x) + x − 3(→ rem-quadcoef), ①29의 xP(x)를 3x − 1로(→ rem-compose 첫째),
//    ②13의 과정 빈칸과 고르기(→ sub-ab2-two), ②14의 계수 a, b(→ sub-ab2), ②15의 일차식으로 끝까지 갈라지는 꼴(→ sub-common-split 의 마지막 걸음),
//    ②17의 결과 수 묻기(→ fz-cubic-three), ②29의 몫 고르기(→ num-sumcube), ②34의 x⁴ − 3x² + 1 꼴(→ num-composite),
//    심3(→ rem-axb), 심6(→ sub-common-split), 심7(→ fz-quartic).
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { box, frac, lines, N, M, C, inline } = B.kit;
  const { MINUS, gcd, Q, qadd, qsub, qmul, qdiv, qneg, qabs, qcmp, isInt, mag, tx, nb, tail, js, V, sup, ex, nz, asQ, poly, polyAns, linAns, ansV, grp } = B.kit.mid;
  const UNIT = '10-1-2', S1 = '10공수1-01-02', S2 = '10공수1-01-03';
  const NOTE1 = ' <span style="white-space:nowrap">(단, 계수가 1이면 1을 적는다.)</span>';

  // ── 검사 근거 마무리 ──
  // 문항에서 보이는 수(검사와 같은 방법으로 읽는다): 글·그림(그림 설명 포함)·보기
  const stripH = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  function visibleNumbers(item) {
    const seen = stripH([item.text, item.figure || ''].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, ' $1 ').replace(/<table[^>]*aria-label="([^"]*)"[^>]*>/g, ' $1 | '));
    return new Set((seen.match(/\d+/g) || []).concat(seen.match(/\d+\.\d+/g) || [], seen.replace(/(\d) (?=\d)/g, '$1').match(/\d+/g) || []));
  }
  // 다시 셈하는 식의 수 가운데 글에 보이지 않는 수를 facts.unseen 에 밝힌다. 밝히기로 한 수(facts.derived — 근, 나누는 식의 상수)가 아닌 수가 나오면 오류를 낸다.
  function seal(item) {
    const f = item.facts || {}, derived = new Set((f.derived || []).map(Number).concat([0, 1])), shown = visibleNumbers(item), out = new Set(f.unseen || []);
    const exprs = (f.calc || []).map(([t]) => t).concat(f.value !== undefined ? [f.value] : []);
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
  // 만들기가 null 을 돌려주면(조건에 맞지 않는 수) 다시 만든다. 다 만든 문항은 seal 로 검사 근거를 마무리한다.
  const retry = (make) => (d, n) => { for (let i = 0; i < 4000; i += 1) { const item = make(d, n); if (item) return seal(item); } throw new Error('조건에 맞는 문항을 만들지 못했다'); };
  const src = (ref) => (/^심/.test(ref) ? '수집본 심화 자료(' : '수집본 기본 자료(') + ref + ')';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: src(ref), make: retry(make) }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: src(ref), make: retry(make) }, more || {});

  // ── 수를 적는 글 ──
  const sn = (v) => tx(asQ(v));                                    // −3, 3, −1/2
  const jn = (v) => { const q = asQ(v); if (q.q !== 1) return js(q); return q.p < 0 ? '(' + q.p + ')' : String(q.p); };   // 검사 식: (-3), (-1/2)
  const sh = (n) => (n < 0 ? '-' + -n : '+' + n);                  // 식 글 끝에 붙이는 상수
  const xm = (r) => (r === 0 ? 'x' : `(x${sh(-r)})`);              // 일차 인수 x − r 의 식 글(r = 0 이면 x)
  const sgv = (c, v) => (c < 0 ? '-' : '+') + (Math.abs(c) === 1 && v ? '' : Math.abs(c)) + v;   // 식 글 끝에 붙이는 항
  const pv = (v) => { const q = asQ(v); return q.p < 0 ? '(' + sn(q) + ')' : sn(q); };                // 곱하는 음수는 괄호에
  const cv = (k, h) => (k === 1 ? h : k === -1 ? MINUS + h : sn(k) + h);                          // 계수 × 문자(1, −1 은 적지 않는다)
  const plusN = (n) => (n < 0 ? ` ${MINUS} ${-n}` : ` + ${n}`);                                       // 뒤에 붙이는 수
  const nj = (v, pair) => { const q = asQ(v); return sn(q) + tail(Math.abs(q.p), pair); };       // 수 뒤 토씨: −3을, 1/2을(분수는 분자의 끝소리)
  const X = V('x'), PX = V('P') + '(' + X + ')', QX = V('Q') + '(' + X + ')', RX = V('R') + '(' + X + ')';
  const at = (name, v) => V(name) + '(' + sn(v) + ')';             // P(−2)
  const va = V('a'), vb = V('b'), vc = V('c'), vk = V('k');
  const eqL = (name) => V(name) + ' =';
  const HAN = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ'];
  const range = (lo, hi) => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);

  // ── 식 글 ── (9-1-3a 의 식 글 도구를 옮겨 다듬었다)
  // 문자가 든 식을 한 줄 글로 적고, 그 글 하나에서 화면 글·값(다항식)·검사 식을 얻는다.
  //  수 12 / 문자 x / + - / 곱 * (×) / 기호를 생략한 곱 2x · xy · 3(x+1) / 거듭제곱 x^2 / 분수 [분자|분모] / 괄호 ( ) { } / 빈칸 ?·㉠ ㉡
  const isBoxCh = (ch) => ch === '?' || (ch >= '㉠' && ch <= '㉯');
  function parse(s0) {
    const s = String(s0).replace(/\s+/g, ''); let i = 0;
    const fail = (why) => { throw new Error(`식 글 「${s0}」: ${why}(${i}번째)`); };
    const eat = (ch) => { if (s[i] !== ch) fail(ch + ' 가 와야 한다'); i += 1; };
    function sum() { let a = term(); while (s[i] === '+' || s[i] === '-') { const op = s[i]; i += 1; a = { t: op === '+' ? 'add' : 'sub', a, b: term() }; } return a; }
    function term() { let a = neg(); while (s[i] === '*') { i += 1; a = { t: 'mul', a, b: neg() }; } return a; }
    function neg() { if (s[i] === '-') { i += 1; return { t: 'neg', a: neg() }; } return jux(); }
    function jux() { const list = [pow()]; while (i < s.length && (/[a-zA-Z({[]/.test(s[i]) || isBoxCh(s[i]))) list.push(pow()); return list.length === 1 ? list[0] : { t: 'jux', list }; }
    function pow() { const a = atom(); if (s[i] !== '^') return a; i += 1; const m = /^\d+/.exec(s.slice(i)); if (!m) fail('지수가 없다'); i += m[0].length; return { t: 'pow', a, n: Number(m[0]) }; }
    function atom() {
      const ch = s[i] || '';
      if (/\d/.test(ch)) { const m = /^\d+/.exec(s.slice(i)); i += m[0].length; return { t: 'num', s: m[0] }; }
      if (/[a-zA-Z]/.test(ch)) { i += 1; return { t: 'var', name: ch }; }
      if (isBoxCh(ch)) { i += 1; return { t: 'box', label: ch === '?' ? '' : ch }; }
      if (ch === '(' || ch === '{') { i += 1; const a = sum(); eat(ch === '(' ? ')' : '}'); return { t: 'par', a, br: ch }; }
      if (ch === '[') { i += 1; const a = sum(); eat('|'); const b = sum(); eat(']'); return { t: 'frac', a, b }; }
      return fail('읽지 못하는 글자 ' + ch);
    }
    const out = sum(); if (i !== s.length) fail('식이 끝나지 않았다'); return out;
  }
  const Xp = (s0) => (typeof s0 === 'string' ? parse(s0) : s0);
  // 다항식: 항 { q 계수(유리수), e { 문자: 지수 } }의 배열(계수가 0인 항은 없다)
  const term = (q, e) => ({ q, e });
  const keyOf = (e) => Object.keys(e).filter((k) => e[k]).sort().map((k) => k + e[k]).join('');
  function tMul(a, b) { const e = Object.assign({}, a.e); for (const k of Object.keys(b.e)) e[k] = (e[k] || 0) + b.e[k]; return term(qmul(a.q, b.q), e); }
  function pAdd(a, b) {
    const out = a.slice();
    for (const t of b) {
      const k = keyOf(t.e), w = out.findIndex((u) => keyOf(u.e) === k);
      if (w < 0) { out.push(t); continue; }
      const q = qadd(out[w].q, t.q);
      if (q.p === 0) out.splice(w, 1); else out[w] = term(q, out[w].e);
    }
    return out;
  }
  const pNeg = (a) => a.map((t) => term(qneg(t.q), t.e));
  const pSub = (a, b) => pAdd(a, pNeg(b));
  const pMul = (a, b) => a.reduce((s, x) => pAdd(s, b.map((y) => tMul(x, y))), []);
  function pPow(a, n) { let r = [term(Q(1), {})]; for (let i = 0; i < n; i += 1) r = pMul(r, a); return r; }
  function valX(node, env) {
    const n = Xp(node), E = env || {}, v = (m) => valX(m, E);
    switch (n.t) {
      case 'num': { const q = Q(Number(n.s)); return q.p === 0 ? [] : [term(q, {})]; }
      case 'var': {
        const g = E[n.name];
        if (g == null) return [term(Q(1), { [n.name]: 1 })];
        if (Array.isArray(g)) return g;
        const q = asQ(g); return q.p === 0 ? [] : [term(q, {})];
      }
      case 'add': return pAdd(v(n.a), v(n.b));
      case 'sub': return pSub(v(n.a), v(n.b));
      case 'mul': return pMul(v(n.a), v(n.b));
      case 'neg': return pNeg(v(n.a));
      case 'par': return v(n.a);
      case 'pow': return pPow(v(n.a), n.n);
      case 'frac': { const b = v(n.b); if (b.length !== 1 || keyOf(b[0].e)) throw new Error('수가 아닌 식으로 나눌 수 없다'); return v(n.a).map((t) => term(qdiv(t.q, b[0].q), t.e)); }
      case 'box': throw new Error('빈칸이 있는 식이다');
      default: return n.list.reduce((acc, t) => pMul(acc, v(t)), [term(Q(1), {})]);
    }
  }
  const xv = (s0, env) => valX(s0, env);
  const same = (a, b) => a.length === b.length && a.every((t) => { const u = b.find((w) => keyOf(w.e) === keyOf(t.e)); return Boolean(u) && qcmp(u.q, t.q) === 0; });
  const letters = (t) => Object.keys(t.e).filter((k) => t.e[k]);
  const degOf = (t) => letters(t).reduce((s, k) => s + t.e[k], 0);
  // 항의 차례: 차수가 큰 것부터, 차수가 같으면 알파벳이 앞선 문자의 지수가 큰 것부터
  function ordered(P) {
    const names = [...new Set(P.flatMap(letters))].sort();
    return P.slice().sort((a, b) => degOf(b) - degOf(a) || names.reduce((r, k) => r || (b.e[k] || 0) - (a.e[k] || 0), 0));
  }
  const varH = (e) => Object.keys(e).filter((k) => e[k]).sort().map((k) => V(k) + (e[k] > 1 ? sup(e[k]) : '')).join('');
  function termH(t) { const m = qabs(t.q), v = varH(t.e); if (m.q === 1) return m.p === 1 && v ? v : m.p + v; return frac(m.p, m.q) + v; }
  const signed = (list, inExpr) => list.map((t, i) => (i === 0 ? (t.q.p < 0 ? MINUS : '') : inExpr ? ` <i>${t.q.p < 0 ? MINUS : '+'}</i> ` : ` ${t.q.p < 0 ? MINUS : '+'} `) + termH(t)).join('');
  const ph = (P, inExpr) => (P.length ? signed(ordered(P), inExpr) : '0');
  const pt = (P) => nb(ph(P));
  const srcOf = (P) => pn(ordered(P).map((t) => [t.q, letters(t).sort().map((k) => k + (t.e[k] > 1 ? '^' + t.e[k] : '')).join('')]));
  // 화면 글
  function htmlX(node, inExpr) {
    const n = Xp(node), op = (sym) => (inExpr ? ` <i>${sym}</i> ` : ` ${sym} `), h = (m) => htmlX(m, inExpr);
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
  const xh = (s0) => nb(htmlX(s0));                         // 글줄 속의 식
  const xe = (s0) => htmlX(s0, true);                       // 식 글꼴 안에 적는 글
  const xex = (s0) => ex(xe(s0));                           // 그림 자리에 크게 적는 식
  const eqx = (...ss) => ex(ss.map((s0) => (Array.isArray(s0) ? ph(s0, true) : xe(s0))).join(' <i>=</i> '));
  // 식 뒤의 토씨: 끝이 거듭제곱이면 「제곱」, 문자이면 그 문자(엘·엠·엔·알만 받침이 있다), 수이면 그 수를 읽는 소리에 맞춘다.
  function ej(h, pair) {
    const [w, wo] = pair.split('/');
    let s = String(h).replace(/(<\/span>)+$/, '');
    for (;;) { const t = s.replace(/[)}\]]+$/, '').replace(/(<\/span>|<\/i>)+$/, ''); if (t === s) break; s = t; }   // 닫는 괄호 안쪽 끝까지 본다: g(x²)을
    if (/<\/sup>$/.test(s)) return h + w;
    const text = s.replace(/<[^>]+>/g, ''), last = text[text.length - 1];
    if (/\d/.test(last)) return h + tail(Number(/\d+$/.exec(text)[0]), pair);
    return h + ('lmnr'.includes(last) ? (w === '으로' && last === 'l' ? '로' : w) : wo);
  }
  const xj = (s0, pair) => ej(xh(s0), pair);
  const magS = (q) => (q.q === 1 ? String(Math.abs(q.p)) : `[${Math.abs(q.p)}|${q.q}]`);
  // 다항식 식 글: pn([[3, 'x^2'], [-2, 'xy'], [5, '']]) → 3x^2-2xy+5 (계수 1은 적지 않고 0인 항은 뺀다)
  function pn(terms) {
    const live = terms.map(([c, v]) => [asQ(c), v]).filter(([c]) => c.p !== 0);
    if (!live.length) return '0';
    return live.map(([c, v], i) => (c.p < 0 ? '-' : i ? '+' : '') + (v && Math.abs(c.p) === 1 && c.q === 1 ? '' : magS(c)) + v).join('');
  }
  const lin = (a, b, v) => pn([[a, v || 'x'], [b, '']]);     // ax + b

  // ── 한 문자 다항식(계수의 배열) ── [상수항, x 의 계수, x² 의 계수, …]. 계수는 정수나 유리수(Q).
  const Dsc = (...cs) => cs.slice().reverse().map(asQ);         // 차수가 큰 것부터 적은 계수 → 배열
  const trimA = (p) => { const o = p.map(asQ); while (o.length > 1 && o[o.length - 1].p === 0) o.pop(); return o; };
  const aAdd = (p, q) => trimA(Array.from({ length: Math.max(p.length, q.length) }, (_, i) => qadd(asQ(p[i] || 0), asQ(q[i] || 0))));
  const aScale = (p, k) => trimA(p.map((c) => qmul(asQ(c), asQ(k))));
  const aSub = (p, q) => aAdd(p, aScale(q, -1));
  const aMul = (p, q) => { const o = Array.from({ length: p.length + q.length - 1 }, () => Q(0)); p.forEach((a, i) => q.forEach((b, j) => { o[i + j] = qadd(o[i + j], qmul(asQ(a), asQ(b))); })); return trimA(o); };
  const aProd = (...ps) => ps.reduce((s, p) => aMul(s, p), [Q(1)]);
  const aVal = (p, x) => p.reduceRight((s, c) => qadd(qmul(s, asQ(x)), asQ(c)), Q(0));
  const aDeg = (p) => trimA(p).length - 1;
  const L = (a, b) => [asQ(b), asQ(a)];                         // ax + b
  // 나눗셈: { q 몫, r 나머지 }
  function aDiv(p, d) {
    const a = trimA(p).slice(), b = trimA(d), out = Array.from({ length: Math.max(1, a.length - b.length + 1) }, () => Q(0));
    while (a.length >= b.length && !(a.length === 1 && a[0].p === 0)) {
      const k = qdiv(a[a.length - 1], b[b.length - 1]), s = a.length - b.length;
      out[s] = k; b.forEach((c, i) => { a[i + s] = qsub(a[i + s], qmul(k, c)); });
      a.pop();
      if (!a.length) a.push(Q(0));
    }
    return { q: trimA(out), r: trimA(a) };
  }
  // 식 글(차수가 큰 항부터, 0인 항은 뺀다)
  const aSrc = (p, v) => { const w = v || 'x', o = trimA(p); return pn(o.map((c, i) => [c, i === 0 ? '' : i === 1 ? w : w + '^' + i]).reverse()); };
  const aH = (p, v) => xh(aSrc(p, v));
  const aJ = (p, pair, v) => xj(aSrc(p, v), pair);
  const intsA = (p) => p.every((c) => isInt(asQ(c)));
  const nz0 = (p) => trimA(p).every((c) => asQ(c).p !== 0);          // 계수가 모두 0이 아니다(빠진 항이 없다)
  const small = (p, m) => p.every((c) => Math.abs(asQ(c).p) <= (m || 60));
  const ival = (p, x) => { const v = aVal(p, x); return v.p / v.q; };
  // 수를 넣은 식(풀이 글): 2 × 2³ − 4 × 2² + 3 × 2 + 2
  function plugH(p, x) {
    const o = trimA(p), xs = asQ(x), xw = xs.p < 0 || xs.q !== 1 ? '(' + sn(xs) + ')' : sn(xs), parts = [];
    for (let i = o.length - 1; i >= 0; i -= 1) {
      const c = o[i]; if (c.p === 0) continue;
      const body = i === 0 ? mag(c) : (Math.abs(c.p) === 1 && c.q === 1 ? '' : mag(c) + ' × ') + xw + (i > 1 ? sup(i) : '');
      parts.push((parts.length ? (c.p < 0 ? ` ${MINUS} ` : ' + ') : c.p < 0 ? MINUS : '') + body);
    }
    return nb(parts.join('') || '0');
  }
  // 뒤에 붙이는 식(식 글): + 2x + 3, + (−4x − 6) 대신 − 4x − 6
  const plusS = (s0) => (String(s0).startsWith('-') ? ` ${MINUS} ` + xh(String(s0).slice(1)) : ' + ' + xh(s0));
  // 검사 식: 계수의 글과 넣는 수로 c3*x**3+…
  const plugJ = (p, x) => { const o = trimA(p), parts = []; o.forEach((c, i) => { if (c.p !== 0) parts.push(i === 0 ? jn(c) : i === 1 ? `${jn(c)}*${jn(x)}` : `${jn(c)}*${jn(x)}**${i}`); }); return parts.reverse().join('+') || '0'; };
  // 조립제법의 몫과 나머지(한 단계씩): 나누는 식 x − r
  function synth(p, r) { const o = trimA(p).slice().reverse(), rows = [o[0]], mids = []; for (let i = 1; i < o.length; i += 1) { const m = qmul(rows[i - 1], asQ(r)); mids.push(m); rows.push(qadd(o[i], m)); } return { top: o, mid: mids, bot: rows.slice(0, -1), rem: rows[rows.length - 1] }; }

  // ── 그림: 조립제법 표 ──
  // r: 나누는 수의 글, top: 나뉘는 식의 계수 글, mid: 둘째 줄(top 의 둘째 칸부터), bot: 셋째 줄(몫의 계수), rem: 나머지 — 모두 화면 글(수나 빈칸 이름표)
  function synthTab(r, top, mid, bot, rem, say) {
    const line = '1.6px solid #1f2933', cell = (h, css) => `<td style="padding:4px 10px;text-align:center;white-space:nowrap;${css || ''}">${h}</td>`;
    const row1 = cell(r, 'border-right:' + line) + top.map((h) => cell(h)).join('');
    const row2 = cell('', 'border-right:' + line) + cell('') + mid.map((h) => cell(h)).join('');
    const row3 = cell('') + bot.map((h) => cell(h, 'border-top:' + line)).join('') + cell(rem, 'border-top:' + line + ';border-left:' + line);
    return `<div class="mb-table-wrap"><table style="border-collapse:collapse;font-size:1.05rem;font-variant-numeric:tabular-nums" aria-label="${say}"><tbody><tr>${row1}</tr><tr>${row2}</tr><tr>${row3}</tr></tbody></table></div>`;
  }
  const plainN = (v) => { const q = asQ(v); return (q.p < 0 ? MINUS : '') + (q.q === 1 ? Math.abs(q.p) : Math.abs(q.p) + '/' + q.q); };
  // 나뉘는 식 p 를 x − r 로 나누는 조립제법 표. hide: { 자리: 이름표 } — 자리는 't0'(첫째 줄 첫 칸)…, 'm0'…, 'b0'…, 'r'
  function synthFig(p, r, hide) {
    const s = synth(p, r), H = hide || {}, show = (key, v) => H[key] || sn(v), plainOf = (key, v) => H[key] || plainN(v);
    const top = s.top.map((v, i) => show('t' + i, v)), mid = s.mid.map((v, i) => show('m' + i, v)), bot = s.bot.map((v, i) => show('b' + i, v)), rem = show('r', s.rem);
    const say = `조립제법: 나누는 수 ${plainN(r)}. 첫째 줄 ${s.top.map((v, i) => plainOf('t' + i, v)).join(', ')}. 둘째 줄 ${s.mid.map((v, i) => plainOf('m' + i, v)).join(', ')}. 셋째 줄 ${s.bot.map((v, i) => plainOf('b' + i, v)).join(', ')}, 나머지 ${plainOf('r', s.rem)}.`;
    return synthTab(sn(r), top, mid, bot, rem, say);
  }

  // ── 답 칸 ──
  // 수 하나(부호 단추). 분수이면 분수 칸. 검사 근거는 value(답 하나의 값을 셈하는 식).
  const num = (text, v, o) => ansV(text, asQ(v), isInt(asQ(v)) ? 'int' : 'frac', { figure: o.figure, explain: o.explain, facts: Object.assign({ value: o.value }, o.derived ? { derived: o.derived } : {}, o.rule ? { rule: o.rule } : {}) });
  // 음수일 수 없는 수(나머지·자연수) 하나
  const numU = (text, v, o) => N(text, v, { figure: o.figure, explain: o.explain, facts: Object.assign({ value: o.value }, o.derived ? { derived: o.derived } : {}, o.rule ? { rule: o.rule } : {}) });
  // 수 여럿: rows [이름표, 답, 검사 식, 부호 단추를 다는가(기본 단다)]
  function slots(text, rows, o) {
    return M(text, rows.map(([label, answer, , signedOn]) => Object.assign({ label, answer }, signedOn === false ? {} : { signed: true })), {
      figure: o.figure, explain: o.explain, facts: Object.assign({ calc: rows.map(([, , e], i) => [e, i]) }, o.derived ? { derived: o.derived } : {}, o.rule ? { rule: o.rule } : {})
    });
  }
  // 나머지 ax + b(a, b 는 0이 아닌 정수)
  const linQ = (text, a, b, o) => linAns(text, a, b, X, { figure: o.figure, explain: o.explain, facts: Object.assign({ calc: [[o.ea, 0], [o.eb, 1]] }, o.derived ? { derived: o.derived } : {}, o.rule ? { rule: o.rule } : {}) });
  // 다항식 하나(계수는 0이 아닌 정수): p 는 계수 배열, exprs 는 차수가 큰 항부터 계수를 셈하는 식
  function polyQ(text, p, exprs, o) {
    const o2 = trimA(p), terms = [];
    for (let i = o2.length - 1; i >= 0; i -= 1) terms.push([o2[i], i > 1 ? X + sup(i) : i === 1 ? X : '']);
    if (terms.some(([k]) => !isInt(k) || k.p === 0)) throw new Error('다항식 답의 계수는 0이 아닌 정수여야 한다');
    return polyAns(text + NOTE1, terms.map(([k, n]) => [k.p, n]), { figure: o.figure, explain: o.explain, facts: Object.assign({ calc: exprs.map((e, i) => [e, i]) }, o.derived ? { derived: o.derived } : {}, o.rule ? { rule: o.rule } : {}) });
  }
  // 몫과 나머지: 「몫: [±][ ]x² [±][ ]x [±][ ], 나머지: [±][ ]」. 몫의 계수는 0이 아닌 정수.
  function quotRem(text, q, r, exprs, o) {
    const o2 = trimA(q), terms = [];
    for (let i = o2.length - 1; i >= 0; i -= 1) terms.push([o2[i], i > 1 ? X + sup(i) : i === 1 ? X : '']);
    if (terms.some(([k]) => !isInt(k) || k.p === 0) || !isInt(asQ(r))) throw new Error('몫의 계수는 0이 아닌 정수, 나머지는 정수여야 한다');
    const tpl = '몫: ' + terms.map(([, name], i) => nb('{' + i + '}' + name)).join(' ') + ', ' + nb('나머지: {' + terms.length + '}');
    return inline(text + NOTE1, tpl, terms.map(([k]) => ({ answer: k.p, signed: true })).concat([{ answer: asQ(r).p, signed: true }]), {
      shown: '몫: ' + poly(terms.map(([k, n]) => [k.p, n])) + ', 나머지: ' + sn(r), figure: o.figure, explain: o.explain,
      facts: Object.assign({ calc: exprs.map((e, i) => [e, i]) }, o.derived ? { derived: o.derived } : {}, o.rule ? { rule: o.rule } : {})
    });
  }
  // 인수분해한 식의 칸. factors: [{ t: [[값, 문자 글(HTML), 꼴]], p: 거듭제곱, raw: 괄호 없는 수 }]
  //  꼴 'f' 정해진 항(값 ±1, 칸 없이 문자만), 'n' 자연수 칸, 'm' 「− [ ]」(값은 음수, 칸에는 크기), 's' 부호 단추 칸.
  //  o.blocks: 서로 차례를 바꿀 수 있는 인수의 번호 묶음([[0], [1]]) → 칸 묶음으로 바꾼다. o.unordered: 칸 하나짜리 인수끼리 차례 무관.
  function facAns(text, factors, o) {
    const inputs = [], parts = [], slotsOf = [], shownParts = [];
    let wantNote = false;
    factors.forEach((f) => {
      const mine = [], hs = [];
      let s = f.raw ? '' : '(';
      f.t.forEach(([v, name, mode], j) => {
        if (mode === 'f') { hs.push((j ? (v < 0 ? ` ${MINUS} ` : ' + ') : v < 0 ? MINUS : '') + (name || '1')); }
        else if (mode === 'n') { hs.push((j ? ' + ' : '') + '{' + inputs.length + '}' + name); mine.push(inputs.length); inputs.push({ answer: v }); if (name) wantNote = true; }
        else if (mode === 'm') { hs.push(` ${MINUS} ` + '{' + inputs.length + '}' + name); mine.push(inputs.length); inputs.push({ answer: -v }); if (name) wantNote = true; }
        else { hs.push((j ? ' ' : '') + '{' + inputs.length + '}' + name); mine.push(inputs.length); inputs.push({ answer: v, signed: true }); if (name) wantNote = true; }
        const m = Math.abs(v), body = name ? (m === 1 ? name : m + name) : String(m);
        s += (j ? (v < 0 ? ` ${MINUS} ` : ' + ') : v < 0 ? MINUS : '') + body;
      });
      const open = f.raw ? '' : '(', close = (f.raw ? '' : ')') + (f.p > 1 ? sup(f.p) : '') + (f.after || '');
      s += close;
      // 칸이 셋 이상인 괄호는 360px 화면에 한 덩어리로 들어가지 않는다: 항마다 묶어 괄호 안에서도 줄이 갈리게 한다.
      if (mine.length >= 3) { const ps = hs.map((p) => p.replace(/^ /, '')); ps[0] = open + ps[0]; ps[ps.length - 1] += close; parts.push(ps.map(grp).join(' ')); }
      else parts.push(grp(open + hs.join('') + close));
      shownParts.push(s); slotsOf.push(mine);
    });
    const blocks = o.blocks ? o.blocks.map((grpF) => grpF.flatMap((k) => slotsOf[k])) : null;
    return inline(text + (o.note != null ? o.note : wantNote ? NOTE1 : ''), (o.pre || '') + parts.join(''), inputs, Object.assign({
      shown: nb((o.preShown || '') + shownParts.join('')), figure: o.figure, explain: o.explain,
      facts: Object.assign({ factor: { poly: o.poly, answer: inputs.map((x) => x.answer) } }, o.rule ? { rule: o.rule } : {})
    }, blocks ? { blocks } : {}, o.unordered ? { unordered: true } : {}));
  }
  // 인수분해한 식(factors)을 전개한 다항식: 검사에 쓴다(답이 처음 식과 같은지)
  function facPoly(factors) {
    return factors.reduce((acc, f) => {
      const one = pn(f.t.map(([v, name]) => [v, name.replace(/<sup>(\d+)<\/sup>/g, '^$1').replace(/<[^>]+>/g, '')]));
      return pMul(acc, pPow(xv(one), f.p || 1));
    }, [term(Q(1), {})]);
  }
  const XF = (c) => [c, X, c === 1 || c === -1 ? 'f' : 's'];   // x 항(계수 ±1 이면 칸 없이)
  // 고르기: rows 의 보기 가운데 참인 것(want)이 하나뿐이다. 참·거짓은 코드가 셈해 넘긴다.
  function pickQ(d, text, rows, o) {
    const list = d.shuffle(rows), at2 = list.findIndex((r) => r.ok === (o.want !== false));
    if (list.filter((r) => r.ok === (o.want !== false)).length !== 1) return null;
    if (new Set(list.map((r) => stripH(r.h))).size !== list.length) return null;
    return C(text, list.map((r) => r.h), at2, { figure: o.figure, explain: o.explain, facts: Object.assign({ truth: list.map((r) => r.ok), want: o.want !== false }, o.rule ? { rule: o.rule } : {}) });
  }
  // 보기 ㄱ~ 가운데 참인 것만을 모두 고른 것(보기 다섯 개)
  function comboQ(d, text, rows, truths, o) {
    const n = rows.length, right = truths.map((t, i) => (t ? i : -1)).filter((i) => i >= 0);
    if (!right.length) return null;
    const key = (s) => s.map((i) => HAN[i]).join(', '), all = [];
    for (let m = 1; m < (1 << n); m += 1) { const s = []; for (let i = 0; i < n; i += 1) if (m & (1 << i)) s.push(i); all.push(s); }
    const wrong = d.shuffle(all.filter((s) => key(s) !== key(right))).slice(0, 4);
    const opts = [right].concat(wrong).sort((a, b) => a.length - b.length || key(a).localeCompare(key(b))), options = opts.map(key), ans = options.indexOf(key(right));
    return C(text, options, ans, { figure: lines(rows.map((r, i) => HAN[i] + '. ' + r)), explain: o.explain, facts: Object.assign({ truth: options.map((s, i) => i === ans), want: true }, o.rule ? { rule: o.rule } : {}) });
  }

  // ════════════════════════════════════════════════════════════════
  // ── 가. 항등식과 미정계수법 ──
  // 항등식인 등식과 아닌 등식을 짓는 틀: 참이면 오른쪽이 바르게 전개한 식, 거짓이면 아이들이 하는 잘못 하나로 적은 식(또는 방정식)
  const IDENT = [
    (d, ok) => { const a = d.int(1, 3), b = nz(d, -5, 5), c = d.int(1, 3), e = nz(d, -5, 5), l = `(${lin(a, b)})(${lin(c, e)})`, P = xv(l); return { l, r: srcOf(ok ? P : pAdd(P, xv(`${2 * b * c}x`))) }; },
    (d, ok) => { const p = nz(d, -6, 6), l = `(x${sh(p)})^2`; return { l, r: ok ? srcOf(xv(l)) : `x^2${sh(p * p)}` }; },
    (d, ok) => { const k = d.int(2, 5), p = nz(d, -6, 6), m = nz(d, -5, 5), l = `${k}(x${sh(p)})${sgv(m, 'x')}`; return { l, r: ok ? srcOf(xv(l)) : pn([[k + m, 'x'], [p, '']]) }; },
    (d, ok) => { if (ok) { const k = d.int(2, 4), p = nz(d, -4, 4), l = `${k}(x^2${sh(p)})-(x${sh(p)})`; return { l, r: srcOf(xv(l)) }; } const p = d.int(2, 9), q = nz(d, -6, 6); return { l: `x^2${sh(-p)}`, r: pn([[q, 'x']]) }; }
  ];
  const ABC = `상수 ${va}, ${vb}, ${vc}의 값은?`;
  const identTypes = [
    T('ident-which', '항등식 가려 고르기', '①1', (d) => {
      const want = d.int(1, 3), order = d.shuffle([0, 1, 2, 3]), oks = d.shuffle([0, 1, 2, 3].map((i) => i < want));
      const eqs = order.map((g, i) => IDENT[g](d, oks[i])), truths = eqs.map((e) => same(xv(e.l), xv(e.r)));
      if (truths.some((t, i) => t !== oks[i])) return null;
      const why = eqs.map((e, i) => `${HAN[i]}은 좌변을 정리하면 ${pt(xv(e.l))}이므로 ${truths[i] ? '항등식이다' : '항등식이 아니다'}.`);
      return comboQ(d, `${X}에 대한 항등식인 것만을 보기에서 있는 대로 고른 것은?`, eqs.map((e) => xh(e.l) + ' = ' + xh(e.r)), truths, { explain: '양변을 정리하여 같은 식이 되면 항등식이다. ' + why.join(' ') });
    }),
    T('ident-blank', '항등식이 되게 빈칸 채우기', '①2', (d) => {
      const a = nz(d, -6, 6), p = nz(d, -5, 5), b = nz(d, -12, 12), c2 = b - a * p;
      if (Math.abs(a) === 1 || c2 === 0) return null;
      return slots(`다음 등식이 ${X}에 대한 항등식이 되도록 할 때, ㉠, ㉡에 알맞은 수는?`, [['㉠', a, jn(a)], ['㉡', c2, `${jn(b)}-${jn(a)}*${jn(p)}`]], {
        figure: ex(xe(lin(a, b)) + ' <i>=</i> ' + xe(`㉠(x${sh(p)})+㉡`)),
        explain: `우변을 전개하면 ㉠${X}${plusN(p)} × ㉠ + ㉡이다. ${X}의 계수를 비교하면 ㉠ = ${sn(a)}, 상수항을 비교하면 ${sn(a * p)} + ㉡ = ${sn(b)}이므로 ㉡ = ${sn(c2)}이다.`
      });
    }),
    T('ident-compare', '정리된 두 식의 계수 비교', '①3', (d, n) => {
      const ask = `다음 등식이 ${X}에 대한 항등식일 때, ${ABC}`;
      if (n === 0) {
        const p = nz(d, -6, 6), q = nz(d, -6, 6), r = nz(d, -6, 6);
        return slots(ask, [[eqL('a'), p, jn(p)], [eqL('b'), -q, `-${jn(q)}`], [eqL('c'), r, jn(r)]], {
          figure: eqx(`(a${sh(-p)})x^2+(b${sh(q)})x+c${sh(-r)}`, '0'), rule: 'zero',
          explain: `${X}에 대한 항등식이므로 모든 계수가 0이다. ${xh(`a${sh(-p)}`)} = 0, ${xh(`b${sh(q)}`)} = 0, ${xh(`c${sh(-r)}`)} = 0에서 ${va} = ${sn(p)}, ${vb} = ${sn(-q)}, ${vc} = ${sn(r)}이다.`
        });
      }
      if (n === 1) {
        const u = nz(d, -6, 6), v = nz(d, -6, 6), s = nz(d, -6, 6);
        if (v - s === 0) return null;
        return slots(ask, [[eqL('a'), u, jn(u)], [eqL('b'), v - s, `${jn(v)}-${jn(s)}`], [eqL('c'), 0, '0']], {
          figure: eqx(`ax^2+(b${sh(s)})x+c`, pn([[u, 'x^2'], [v, 'x']])), rule: 'missing',
          explain: `양변의 동류항의 계수를 비교한다. ${X}${sup(2)}의 계수에서 ${va} = ${sn(u)}, ${X}의 계수에서 ${xh(`b${sh(s)}`)} = ${sn(v)}이므로 ${vb} = ${sn(v - s)}이다. 우변의 상수항은 0이므로 ${vc} = 0이다.`
        });
      }
      const p = nz(d, -6, 6), k = d.pick([2, 3]), c = nz(d, -4, 4), q = (k + 1) * c, b = k * c;
      return slots(ask, [[eqL('a'), -p, `-${jn(p)}`], [eqL('b'), b, `${k}*${jn(q)}/(${k}+1)`], [eqL('c'), c, `${jn(q)}/(${k}+1)`]], {
        figure: eqx(`(a${sh(p)})x^2+(b-${k}c)x+b+c${sh(-q)}`, '0'), rule: 'system',
        explain: `모든 계수가 0이므로 ${xh(`a${sh(p)}`)} = 0, ${xh(`b-${k}c`)} = 0, ${xh(`b+c${sh(-q)}`)} = 0이다. ${vb} = ${k}${vc}를 셋째 식에 넣으면 ${k + 1}${vc} = ${sn(q)}이므로 ${vc} = ${sn(c)}, ${vb} = ${sn(b)}이고 ${va} = ${sn(-p)}이다.`
      });
    }, { count: 3 }),
    T('ident-expand', '한쪽을 전개해 계수 비교', '①4', (d, n) => {
      const ask = `다음 등식이 ${X}에 대한 항등식일 때, ${ABC}`;
      if (n === 0) {
        const k = d.int(2, 4), p = nz(d, -5, 5), b = nz(d, -5, 5), c = nz(d, -9, 9), m = k * (p + b), nn = k * p * b + c;
        if (m === 0 || nn === 0 || b === p) return null;
        const bE = `${jn(m)}/${k}-${jn(p)}`;
        return slots(ask, [[eqL('a'), k, String(k)], [eqL('b'), b, bE], [eqL('c'), c, `${jn(nn)}-${k}*${jn(p)}*(${bE})`]], {
          figure: eqx(`ax^2${sgv(m, 'x')}${sh(nn)}`, `${k}(x${sh(p)})(x+b)+c`), rule: 'expand-right',
          explain: `우변을 전개하면 ${xh(`${k}x^2+${k}(b${sh(p)})x${sgv(k * p, 'b')}+c`)}이다. 계수를 비교하면 ${va} = ${k}이고, ${k}(${xh(`b${sh(p)}`)}) = ${sn(m)}에서 ${vb} = ${sn(b)}, ${sn(k * p * b)} + ${vc} = ${sn(nn)}에서 ${vc} = ${sn(c)}이다.`
        });
      }
      const s = nz(d, -3, 3), c = nz(d, -4, 4), p = c + s, q = nz(d, -5, 5), r = nz(d, -5, 5), a = c * q + r, b = q * r;
      if (p === 0 || a === 0 || c === 1) return null;
      return slots(ask, [[eqL('a'), a, `(${jn(p)}-${jn(s)})*${jn(q)}+${jn(r)}`], [eqL('b'), b, `${jn(q)}*${jn(r)}`], [eqL('c'), c, `${jn(p)}-${jn(s)}`]], {
        figure: eqx(`${pn([[p, 'x^2']])}+ax+b`, `(x${sh(q)})(cx${sh(r)})${sgv(s, 'x^2')}`), rule: 'expand-mixed',
        explain: `우변을 전개하면 ${xh(`(c${sh(s)})x^2+(${pn([[q, 'c'], [r, '']])})x${sh(q * r)}`)}이다. ${X}${sup(2)}의 계수에서 ${xh(`c${sh(s)}`)} = ${sn(p)}이므로 ${vc} = ${sn(c)}이고, ${va} = ${pv(q)} × ${pv(c)}${plusN(r)} = ${sn(a)}, ${vb} = ${sn(b)}이다.`
      });
    }, { count: 2 }),
    T('ident-plug', '수를 넣어 계수 구하기', '①5', (d, n) => {
      const ask = `다음 등식이 ${X}에 대한 항등식일 때, ${ABC}`;
      if (n === 0) {
        const [p, q] = d.shuffle(range(-3, 3).filter((v) => v !== 0)).slice(0, 2), a = nz(d, -4, 4), b = nz(d, -4, 4), c = nz(d, -4, 4);
        const Lp = aAdd(aAdd(aScale(aProd(L(1, -p), L(1, -q)), a), aScale(aProd(L(1, 0), L(1, -q)), b)), aScale(aProd(L(1, 0), L(1, -p)), c));
        if (Lp.length < 3 || Lp[2].p === 0 || Lp[0].p === 0) return null;
        const [l0, l1, l2] = Lp.map((t) => t.p), Lat = (x) => `(${jn(l2)}*${jn(x)}**2+${jn(l1)}*${jn(x)}+${jn(l0)})`;
        return slots(ask, [[eqL('a'), a, `${jn(l0)}/(${jn(p)}*${jn(q)})`], [eqL('b'), b, `${Lat(p)}/(${jn(p)}*(${jn(p)}-${jn(q)}))`], [eqL('c'), c, `${Lat(q)}/(${jn(q)}*(${jn(q)}-${jn(p)}))`]], {
          figure: eqx(aSrc(Lp), `a(x${sh(-p)})(x${sh(-q)})+bx(x${sh(-q)})+cx(x${sh(-p)})`), rule: 'plug-three',
          explain: `양변에 ${X} = 0을 넣으면 ${sn(l0)} = ${cv(p * q, va)}, ${X} = ${nj(p, '을/를')} 넣으면 ${sn(ival(Lp, p))} = ${cv(p * (p - q), vb)}, ${X} = ${nj(q, '을/를')} 넣으면 ${sn(ival(Lp, q))} = ${cv(q * (q - p), vc)}이다. 따라서 ${va} = ${sn(a)}, ${vb} = ${sn(b)}, ${vc} = ${sn(c)}이다.`
        });
      }
      const t = nz(d, -2, 2), [u1, u2, u3] = d.shuffle(range(-3, 3).filter((v) => v !== t)).slice(0, 3), Lc = aProd(L(1, -t), L(1, -t), L(1, -t));
      const c = ival(Lc, u3), b = (ival(Lc, u2) - c) / (u2 - u3), a = (ival(Lc, u1) - b * (u1 - u3) - c) / ((u1 - u2) * (u1 - u3));
      if ([a, b, c].some((v) => !Number.isInteger(v) || v === 0)) return null;
      const cube = (x) => `(${jn(x)}-${jn(t)})**3`, cE = cube(u3), bE = `(${cube(u2)}-${cE})/(${jn(u2)}-${jn(u3)})`;
      return slots(ask, [[eqL('a'), a, `(${cube(u1)}-(${bE})*(${jn(u1)}-${jn(u3)})-${cE})/((${jn(u1)}-${jn(u2)})*(${jn(u1)}-${jn(u3)}))`], [eqL('b'), b, bE], [eqL('c'), c, cE]], {
        figure: eqx(`(x${sh(-t)})^3`, `${xm(u1)}${xm(u2)}${xm(u3)}+a${xm(u2)}${xm(u3)}+b${xm(u3)}+c`), rule: 'plug-chain',
        explain: `${X} = ${nj(u3, '을/를')} 넣으면 ${vc} = ${sn(c)}, ${X} = ${nj(u2, '을/를')} 넣으면 ${sn(ival(Lc, u2))} = ${cv(u2 - u3, vb)}${plusN(c)}에서 ${vb} = ${sn(b)}, ${X} = ${nj(u1, '을/를')} 넣으면 ${sn(ival(Lc, u1))} = ${cv((u1 - u2) * (u1 - u3), va)}${plusN((u1 - u3) * b + c)}에서 ${va} = ${sn(a)}이다.`
      });
    }, { count: 2 }),
    T('ident-shift', '(x−p)의 거듭제곱 꼴로 나타내기', '①6 ①60', (d, n) => {
      const p = nz(d, -3, 3), ask = `다음 등식이 ${X}에 대한 항등식일 때, ${ABC}`;
      if (n === 0) {
        const l2 = d.int(2, 4), l1 = nz(d, -6, 6), l0 = nz(d, -8, 8), Lp = Dsc(l2, l1, l0), b = 2 * l2 * p + l1, c = ival(Lp, p);
        if (b === 0 || c === 0) return null;
        return slots(ask, [[eqL('a'), l2, jn(l2)], [eqL('b'), b, `2*${jn(l2)}*${jn(p)}+${jn(l1)}`], [eqL('c'), c, `${jn(l2)}*${jn(p)}**2+${jn(l1)}*${jn(p)}+${jn(l0)}`]], {
          figure: eqx(aSrc(Lp), `a(x${sh(-p)})^2+b(x${sh(-p)})+c`), rule: 'shift-2',
          explain: `${X} = ${nj(p, '을/를')} 넣으면 ${vc} = ${sn(c)}이다. 우변을 전개하면 ${X}${sup(2)}의 계수는 ${va}이므로 ${va} = ${l2}이고, ${X}의 계수를 비교하면 ${cv(-2 * p, va)} + ${vb} = ${sn(l1)}에서 ${vb} = ${sn(b)}이다.`
        });
      }
      const l2 = nz(d, -6, 6), l1 = nz(d, -6, 6), l0 = nz(d, -9, 9), Lp = Dsc(1, l2, l1, l0), a = 3 * p + l2, b = 3 * p * p + 2 * l2 * p + l1, c = ival(Lp, p);
      if ([a, b, c].some((v) => v === 0)) return null;
      return slots(ask, [[eqL('a'), a, `3*${jn(p)}+${jn(l2)}`], [eqL('b'), b, `3*${jn(p)}**2+2*${jn(l2)}*${jn(p)}+${jn(l1)}`], [eqL('c'), c, plugJ(Lp, p)]], {
        figure: eqx(aSrc(Lp), `(x${sh(-p)})^3+a(x${sh(-p)})^2+b(x${sh(-p)})+c`), rule: 'shift-3',
        explain: `${X} = ${nj(p, '을/를')} 넣으면 ${vc} = ${sn(c)}이다. 우변을 전개하여 ${X}${sup(2)}의 계수를 비교하면 ${sn(-3 * p)} + ${va} = ${sn(l2)}에서 ${va} = ${sn(a)}이고, ${X}의 계수를 비교하면 ${3 * p * p} ${p > 0 ? MINUS : '+'} ${2 * Math.abs(p)}${va} + ${vb} = ${sn(l1)}에서 ${vb} = ${sn(b)}이다. 조립제법을 세 번 거듭해도 같은 값을 얻는다.`
      });
    }, { count: 2 }),
    T('ident-factored', '인수분해한 꼴의 미정계수', '①7 심2', (d, n) => {
      if (n === 0) {
        const [p, q] = d.shuffle(range(-4, 4).filter((v) => v !== 0)).slice(0, 2), c = nz(d, -4, 4), k = p * q * c, a = c - p - q, b = p * q - c * (p + q);
        if (a === 0 || b === 0 || Math.abs(c) === Math.abs(p) || Math.abs(c) === Math.abs(q)) return null;
        const cE = `${jn(k)}/(${jn(p)}*${jn(q)})`;
        return slots(`다항식 ${xj(`x^3+ax^2+bx${sh(k)}`, '이/가')} ${xj(`(x${sh(-p)})(x${sh(-q)})(x+c)`, '으로/로')} 인수분해될 때, ${ABC}`, [[eqL('a'), a, `${cE}-${jn(p)}-${jn(q)}`], [eqL('b'), b, `${jn(p)}*${jn(q)}-(${cE})*(${jn(p)}+${jn(q)})`], [eqL('c'), c, cE]], {
          rule: 'three-linear',
          explain: `상수항을 비교하면 ${cv(p * q, vc)} = ${sn(k)}이므로 ${vc} = ${sn(c)}이다. 우변을 전개하면 ${aH(aProd(L(1, -p), L(1, -q), L(1, c)))}이므로 ${va} = ${sn(a)}, ${vb} = ${sn(b)}이다.`
        });
      }
      const p = nz(d, -3, 3), qa2 = nz(d, -4, 4), qb = nz(d, -5, 5), P3 = aMul(L(1, -p), Dsc(1, qa2, qb));
      if (P3.some((c) => Math.abs(c.p) > 30) || P3[0].p === 0) return null;
      const l0 = P3[0].p, l2 = P3[2].p;
      return slots(`다항식 ${aJ(P3, '이/가')} ${xj(`(x${sh(-p)})(x^2+ax+b)`, '으로/로')} 인수분해될 때, 상수 ${va}, ${vb}의 값은?`, [[eqL('a'), qa2, `${jn(l2)}+${jn(p)}`], [eqL('b'), qb, `-${jn(l0)}/${jn(p)}`]], {
        rule: 'linear-quad',
        explain: `우변을 전개하면 ${xh(`x^3+(a${sh(-p)})x^2+(b${sgv(-p, 'a')})x${sgv(-p, 'b')}`)}이다. 상수항을 비교하면 ${-p === 1 ? `${vb} = ${sn(qb)}` : `${cv(-p, vb)} = ${sn(l0)}에서 ${vb} = ${sn(qb)}`}, ${X}${sup(2)}의 계수를 비교하면 ${xh(`a${sh(-p)}`)} = ${sn(l2)}에서 ${va} = ${sn(qa2)}이다.`
      });
    }, { count: 2 }),
    T('ident-zero-sym', '계수가 0이 되는 조건으로 식의 값', '①8', (d) => {
      const a = nz(d, -5, 6), b = nz(d, -5, 6), s = a + b, m = a * b;
      if (s === 0 || a === b) return null;
      return numU(`등식 ${xh(`(a+b${sh(-s)})x^2+ab${sh(-m)}`)} = 0이 ${X}에 대한 항등식일 때, 상수 ${va}, ${vb}에 대하여 ${xh('a^2+b^2')}의 값은?`, a * a + b * b, {
        value: `${jn(s)}**2-2*${jn(m)}`,
        explain: `${X}에 대한 항등식이므로 ${xh(`a+b${sh(-s)}`)} = 0, ${xh(`ab${sh(-m)}`)} = 0이다. ${va} + ${vb} = ${sn(s)}, ${va}${vb} = ${sn(m)}이므로 ${xh('a^2+b^2')} = (${va} + ${vb})${sup(2)} ${MINUS} 2${va}${vb} = ${s * s} ${m < 0 ? '+' : MINUS} ${Math.abs(2 * m)} = ${a * a + b * b}이다.`
      });
    }),
    T('ident-anyk', 'k의 값에 관계없이 성립하는 등식', '①9', (d) => {
      const m = nz(d, -4, 4), nn = nz(d, -5, 5), r = nz(d, -4, 4);
      if ((nn * r) % m !== 0) return null;
      const y = -nn * r / m, x = nn + y;
      if (x === 0 || y === 0) return null;
      const yE = `-${jn(nn)}*${jn(r)}/${jn(m)}`;
      return slots(`등식 ${xh(`kx-(k${sh(m)})y${nn > 0 ? '-' : '+'}${Math.abs(nn) === 1 ? '' : Math.abs(nn)}(k${sh(r)})`)} = 0이 실수 ${vk}의 값에 관계없이 항상 성립할 때, 상수 ${X}, ${V('y')}의 값은?`, [[eqL('x'), x, `${jn(nn)}+(${yE})`], [eqL('y'), y, yE]], {
        explain: `좌변을 ${vk}에 대하여 정리하면 ${xh(`k(x-y${sh(-nn)})-(${pn([[m, 'y'], [nn * r, '']])})`)} = 0이다. ${vk}에 대한 항등식이므로 ${xh(`x-y${sh(-nn)}`)} = 0, ${xh(pn([[m, 'y'], [nn * r, '']]))} = 0이다. 따라서 ${V('y')} = ${sn(y)}, ${X} = ${sn(x)}이다.`
      });
    }),
    T('ident-k-root', 'x에 대한 항등식이 되는 k', '①10', (d) => {
      const k0 = nz(d, -4, 4), r1 = nz(d, -4, 4), r2 = nz(d, -4, 4);
      if (r1 === r2 || r1 === k0 || r2 === k0) return null;
      const u = k0 + r1, v = k0 + r2, w = k0 * r1, z = k0 * r2;
      if (u === 0 || v === 0) return null;
      const tail3 = pn([[w, 'x^2'], [-z, 'x']]);
      return num(`등식 ${xh(`k^2(x^2-x)-k(${pn([[u, 'x^2'], [-v, 'x']])})${tail3.startsWith('-') ? tail3 : '+' + tail3}`)} = 0이 모든 실수 ${X}에 대하여 성립할 때, 상수 ${vk}의 값은?`, k0, {
        value: `(${jn(w)}-${jn(z)})/(${jn(u)}-${jn(v)})`,
        explain: `좌변을 ${X}에 대하여 정리하면 ${xh(`(k^2${sgv(-u, 'k')}${sh(w)})x^2+(-k^2${sgv(v, 'k')}${sh(-z)})x`)} = 0이다. ${X}에 대한 항등식이므로 ${xh(`k^2${sgv(-u, 'k')}${sh(w)}`)} = 0이고 ${xh(`k^2${sgv(-v, 'k')}${sh(z)}`)} = 0이다. 앞의 식의 해는 ${sn(k0)}, ${sn(r1)}이고 뒤의 식의 해는 ${sn(k0)}, ${sn(r2)}이므로 두 식을 함께 만족하는 ${vk}는 ${sn(k0)}이다.`
      });
    }),
    T('ident-coefsum', '모든 계수의 합', '①13', (d) => {
      const c3 = d.int(1, 3), c2 = nz(d, -4, 4), c1 = nz(d, -5, 5), c0 = nz(d, -5, 5), e = d.int(2, 5), f = nz(d, -4, 4), m = d.pick([2, 3]), nn = d.pick([2, 3]);
      const s1 = c3 + c2 + c1 + c0, s2 = e + f, v = s1 ** m * s2 ** nn;
      if (s1 === 0 || s2 === 0 || (Math.abs(s1) === 1 && Math.abs(s2) === 1) || Math.abs(v) > 3000 || Math.abs(s1) > 4) return null;
      return num('다음 다항식을 전개한 식에서 상수항을 포함한 모든 계수의 합은?', v, {
        figure: xex(`(${aSrc(Dsc(c3, c2, c1, c0))})^${m}(${lin(e, f)})^${nn}`),
        value: `(${jn(c3)}+${jn(c2)}+${jn(c1)}+${jn(c0)})**${m}*(${e}+${jn(f)})**${nn}`,
        explain: `전개한 식에 ${X} = 1을 넣은 값이 모든 계수의 합이다. ${X} = 1을 넣으면 (${sn(s1)})${sup(m)} × (${sn(s2)})${sup(nn)} = ${sn(v)}이다.`
      });
    }),
    T('ident-evensum', '짝수(홀수) 차수 계수의 합', '①14', (d, n) => {
      const sub = (k) => V('a') + '<sub>' + k + '</sub>';
      if (n === 0) {
        const p = nz(d, -4, 4), q = nz(d, -5, 5), r = nz(d, -5, 5), f1 = 1 + p + q + r, fm = -1 + p - q + r, v = (f1 * f1 + fm * fm) / 2;
        if (f1 === fm || Math.abs(f1) + Math.abs(fm) < 3) return null;
        const rhs = `${sub(6)}${X}${sup(6)} + ${sub(5)}${X}${sup(5)} + ⋯ + ${sub(1)}${X} + ${sub(0)}`;
        return numU(`다음 등식이 ${X}에 대한 항등식일 때, ${nb(`${sub(6)} + ${sub(4)} + ${sub(2)} + ${sub(0)}`)}의 값은? (단, ${sub(0)}, ${sub(1)}, ⋯, ${sub(6)}은 상수이다.)`, v, {
          figure: ex(xe(`(${aSrc(Dsc(1, p, q, r))})^2`) + ' <i>=</i> ' + rhs),
          value: `((1+${jn(p)}+${jn(q)}+${jn(r)})**2+(-1+${jn(p)}-${jn(q)}+${jn(r)})**2)/2`, rule: 'even',
          explain: `${X} = 1을 넣으면 ${sub(6)} + ${sub(5)} + ⋯ + ${sub(0)} = (${sn(f1)})${sup(2)} = ${f1 * f1}, ${X} = ${MINUS}1을 넣으면 ${sub(6)} ${MINUS} ${sub(5)} + ⋯ + ${sub(0)} = (${sn(fm)})${sup(2)} = ${fm * fm}이다. 두 식을 더하면 2(${sub(6)} + ${sub(4)} + ${sub(2)} + ${sub(0)}) = ${f1 * f1 + fm * fm}이므로 구하는 값은 ${v}이다.`
        });
      }
      const m = d.int(5, 8), k = d.int(2, m - 2), p = nz(d, -3, 3), q = nz(d, -4, 4), f2 = 2 ** m + p * 2 ** k + q, v = (2 ** m + p * 2 ** k) / 2;
      const odds = range(1, m).filter((i) => i % 2 === 1);
      if (v === 0 || Math.abs(v) > 9999) return null;
      const rhs = `${sub(0)} + ${sub(1)}(${X} ${MINUS} 1) + ${sub(2)}(${X} ${MINUS} 1)${sup(2)} + ⋯ + ${sub(m)}(${X} ${MINUS} 1)${sup(m)}`;
      return num(`다음 등식이 모든 실수 ${X}에 대하여 성립할 때, ${nb(odds.map(sub).join(' + '))}의 값은? (단, ${sub(0)}, ${sub(1)}, ⋯, ${sub(m)}${tail(m, '은/는')} 상수이다.)`, v, {
        figure: ex(xe(pn([[1, 'x^' + m], [p, 'x^' + k], [q, '']])) + ' <i>=</i> ' + rhs),
        value: `(2**${m}+${jn(p)}*2**${k})/2`, rule: 'odd-shift',
        explain: `${X} = 2를 넣으면 ${sub(0)} + ${sub(1)} + ⋯ + ${sub(m)} = ${sn(f2)}, ${X} = 0을 넣으면 ${sub(0)} ${MINUS} ${sub(1)} + ${sub(2)} ${MINUS} ⋯ = ${sn(q)}이다. 앞의 식에서 뒤의 식을 빼면 2(${odds.map(sub).join(' + ')}) = ${sn(f2 - q)}이므로 구하는 값은 ${sn(v)}이다.`
      });
    }, { count: 2 }),
    T('ident-divsub', '나눗셈 등식에 대입해 값 구하기', '①16', (d, n) => {
      if (n === 0) {
        const p = nz(d, -4, 4), q2 = d.int(1, 3), q1 = nz(d, -5, 5), q0 = nz(d, -6, 6), r = nz(d, -9, 9), t = d.pick(range(-3, 3).filter((v) => v !== p && v !== 0)), qq = Dsc(q2, q1, q0), v = (t - p) * ival(qq, t) + r;
        return num(`다항식 ${PX}를 ${xj(lin(1, -p), '으로/로')} 나누었을 때의 몫이 ${aH(qq)}이고 나머지가 ${sn(r)}이다. ${at('P', t)}의 값은?`, v, {
          value: `(${jn(t)}-${jn(p)})*(${q2}*${jn(t)}**2+${jn(q1)}*${jn(t)}+${jn(q0)})+${jn(r)}`, rule: 'linear',
          explain: `${PX} = (${xh(lin(1, -p))})(${aH(qq)}) + ${sn(r)}에 ${X} = ${nj(t, '을/를')} 넣으면 ${at('P', t)} = ${pv(t - p)} × ${pv(ival(qq, t))}${plusN(r)} = ${sn(v)}이다.`
        });
      }
      const s = nz(d, -4, 4), u = nz(d, -4, 4), w = nz(d, -6, 6), m = nz(d, -5, 5), nn = nz(d, -8, 8), v = nn - m * s;
      return num(`다항식 ${PX}를 ${aJ(Dsc(1, u, w), '으로/로')} 나누었을 때의 몫이 ${xh(lin(1, s))}이고 나머지가 ${xh(lin(m, nn))}이다. ${PX}를 ${xj(lin(1, s), '으로/로')} 나누었을 때의 나머지는?`, v, {
        value: `${jn(nn)}-${jn(m)}*${jn(s)}`, rule: 'quadratic',
        explain: `${PX} = (${aH(Dsc(1, u, w))})(${xh(lin(1, s))})${plusS(lin(m, nn))}이다. 구하는 나머지는 ${at('P', -s)}이고, ${X} = ${sn(-s)}이면 몫 ${xj(lin(1, s), '이/가')} 0이므로 ${at('P', -s)} = ${pv(m)} × ${pv(-s)}${plusN(nn)} = ${sn(v)}이다.`
      });
    }, { count: 2 }),
    T('ident-divcoef', '나눗셈 등식으로 미정계수와 몫의 값', '①17', (d, n) => {
      if (n === 0) {
        const p = nz(d, -3, 3), a = nz(d, -8, 8), r = nz(d, -9, 9), b0 = r - p ** 3 + a * p, t = d.pick([10, 5, 4, -2, 3].filter((v) => v !== p));
        if (b0 === 0) return null;
        const Pp = Dsc(1, 0, -a, b0), v = (ival(Pp, t) - r) / (t - p), aE = `(${jn(p)}**3+${jn(b0)}-${jn(r)})/${jn(p)}`;
        return num(`다항식 ${xj(`x^3-ax${sh(b0)}`, '을/를')} ${xj(lin(1, -p), '으로/로')} 나누었을 때의 몫이 ${QX}, 나머지가 ${sn(r)}일 때, ${at('Q', t)}의 값은? (단, ${va}는 상수이다.)`, v, {
          value: `(${jn(t)}**3-(${aE})*${jn(t)}+${jn(b0)}-${jn(r)})/(${jn(t)}-${jn(p)})`, rule: 'q-value',
          explain: `${xh(`x^3-ax${sh(b0)}`)} = (${xh(lin(1, -p))})${QX} + ${sn(r)}에 ${X} = ${nj(p, '을/를')} 넣으면 ${xh(pn([[-p, 'a'], [p ** 3 + b0, '']]))} = ${sn(r)}이므로 ${va} = ${sn(a)}이다. 다시 ${X} = ${nj(t, '을/를')} 넣으면 ${sn(ival(Pp, t))} = ${cv(t - p, at('Q', t))}${plusN(r)}이므로 ${at('Q', t)} = ${sn(v)}이다.`
        });
      }
      if (n === 1) {
        const u = nz(d, -4, 4), w = nz(d, -5, 5), m = nz(d, -5, 5), nn = nz(d, -8, 8), a = w - u * u + m, b = nn - w * u;
        if (a === 0 || b === 0) return null;
        return slots(`다항식 ${xj('x^3+ax+b', '을/를')} ${aJ(Dsc(1, u, w), '으로/로')} 나누었을 때의 나머지가 ${xh(lin(m, nn))}일 때, 상수 ${va}, ${vb}의 값은?`, [[eqL('a'), a, `${jn(w)}-${jn(u)}**2+${jn(m)}`], [eqL('b'), b, `${jn(nn)}-${jn(w)}*${jn(u)}`]], {
          rule: 'divisor-known',
          explain: `몫은 ${X}의 계수가 1인 일차식이므로 ${xj('x+c', '으로/로')} 놓으면 ${xh('x^3+ax+b')} = (${aH(Dsc(1, u, w))})(${xh('x+c')})${plusS(lin(m, nn))}이다. ${X}${sup(2)}의 계수에서 ${sn(u)} + ${vc} = 0이므로 ${vc} = ${sn(-u)}이고, ${X}의 계수에서 ${va} = ${pv(w)} + ${pv(u)} × ${pv(-u)} + ${pv(m)} = ${sn(a)}, 상수항에서 ${vb} = ${pv(w)} × ${pv(-u)}${plusN(nn)} = ${sn(b)}이다.`
        });
      }
      const a = nz(d, -4, 4), c = nz(d, -4, 4), w = nz(d, -4, 4), m = nz(d, -5, 5), nn = nz(d, -6, 6), l2 = a + c, l1 = w + a * c + m, l0 = w * c + nn;
      if (l2 === 0 || l1 === 0 || l0 === 0) return null;
      return num(`다항식 ${aJ(Dsc(1, l2, l1, l0), '을/를')} ${xj(`x^2+ax${sh(w)}`, '으로/로')} 나누었을 때의 나머지가 ${xh(lin(m, nn))}일 때, 상수 ${va}의 값은?`, a, {
        value: `${jn(l2)}-(${jn(l0)}-${jn(nn)})/${jn(w)}`, rule: 'divisor-unknown',
        explain: `몫을 ${xj('x+c', '으로/로')} 놓으면 ${aH(Dsc(1, l2, l1, l0))} = (${xh(`x^2+ax${sh(w)}`)})(${xh('x+c')})${plusS(lin(m, nn))}이다. 상수항에서 ${cv(w, vc)}${plusN(nn)} = ${sn(l0)}이므로 ${vc} = ${sn(c)}, ${X}${sup(2)}의 계수에서 ${va} + ${vc} = ${sn(l2)}이므로 ${va} = ${sn(a)}이다.`
      });
    }, { count: 3 })
  ];

  // ── 나. 나머지정리 ──
  const remTypes = [
    T('rem-lin', '일차식 x−a로 나눈 나머지', '①19', (d) => {
      const p = nz(d, -3, 3), Pp = Dsc(d.int(1, 3), d.int(-5, 5), nz(d, -6, 6), nz(d, -8, 8)), v = ival(Pp, p);
      return num(`다항식 ${PX} = ${aJ(Pp, '을/를')} ${xj(lin(1, -p), '으로/로')} 나누었을 때의 나머지는?`, v, {
        value: plugJ(Pp, p),
        explain: `나머지정리에 의하여 나머지는 ${at('P', p)} = ${plugH(Pp, p)} = ${sn(v)}이다.`
      });
    }),
    T('rem-axb', '일차식 ax+b로 나눈 나머지', '①20 심3', (d) => {
      const a = d.pick([2, 3]), b = nz(d, -2, 2), r = Q(-b, a), Pp = Dsc(d.int(1, 4), d.int(-4, 4), nz(d, -5, 5), nz(d, -6, 6)), v = aVal(Pp, r);
      if (gcd(a, Math.abs(b)) !== 1 || isInt(v) || v.q > 27 || Math.abs(v.p) > 240) return null;
      return num(`다항식 ${PX} = ${aJ(Pp, '을/를')} ${xj(lin(a, b), '으로/로')} 나누었을 때의 나머지는?`, v, {
        value: plugJ(Pp, r),
        explain: `${xh(lin(a, b))} = 0이 되는 ${X}의 값은 ${sn(r)}이므로 나머지는 ${V('P')}(${sn(r)}) = ${plugH(Pp, r)} = ${sn(v)}이다.`
      });
    }),
    T('rem-meaning', '나머지정리의 뜻', '①21', (d) => {
      const a = d.pick([2, 3, 4]), b = nz(d, -3, 3), Pp = Dsc(d.int(1, 4), nz(d, -5, 5), nz(d, -5, 5));
      if (gcd(a, Math.abs(b)) !== 1) return null;
      const cand = [Q(-b, a), Q(b, a), Q(-a, b), Q(a, b), Q(-b)], keys = cand.map((q) => q.p + '/' + q.q);
      if (new Set(keys).size !== 5) return null;
      return pickQ(d, `다항식 ${PX} = ${aJ(Pp, '을/를')} ${xj(lin(a, b), '으로/로')} 나누었을 때의 나머지는 ${V('P')}(α)와 같다. 상수 α의 값은?`, cand.map((q, i) => ({ h: sn(q), ok: i === 0 })), {
        explain: `몫을 ${QX}, 나머지를 ${V('R')}이라 하면 ${PX} = (${xh(lin(a, b))})${QX} + ${V('R')}이다. ${xh(lin(a, b))} = 0이 되는 ${X} = ${nj(Q(-b, a), '을/를')} 넣으면 ${V('R')} = ${V('P')}(${sn(Q(-b, a))})이므로 α = ${sn(Q(-b, a))}이다.`
      });
    }),
    T('rem-findcoef', '나머지를 주고 계수 구하기', '①22', (d, n) => {
      const p = nz(d, -3, 3);
      if (n === 0) {
        const c2 = d.int(1, 4), a = nz(d, -7, 7), c0 = nz(d, -6, 6), r = c2 * p * p + a * p + c0;
        return num(`다항식 ${PX} = ${xj(`${c2 === 1 ? '' : c2}x^2+ax${sh(c0)}`, '을/를')} ${xj(lin(1, -p), '으로/로')} 나누었을 때의 나머지가 ${sn(r)}일 때, 상수 ${va}의 값은?`, a, {
          value: `(${jn(r)}-${jn(c2)}*${jn(p)}**2-${jn(c0)})/${jn(p)}`, rule: 'one',
          explain: `나머지정리에 의하여 ${at('P', p)} = ${xh(pn([[p, 'a'], [c2 * p * p + c0, '']]))} = ${sn(r)}이므로 ${va} = ${sn(a)}이다.`
        });
      }
      const a = nz(d, -5, 5), c0 = nz(d, -9, 9), r = p ** 3 + a * p + c0, Pa = Dsc(1, 0, a, c0), v = ival(Pa, a);
      if (a === p || r === 0 || Math.abs(v) > 999) return null;
      const aE = `(${jn(r)}-${jn(p)}**3-${jn(c0)})/${jn(p)}`;
      return num(`다항식 ${PX} = ${xj(`x^3+ax${sh(c0)}`, '을/를')} ${xj(lin(1, -p), '으로/로')} 나누었을 때의 나머지가 ${sn(r)}일 때, ${V('P')}(${va})의 값은? (단, ${va}는 상수이다.)`, v, {
        value: `(${aE})**3+(${aE})*(${aE})+${jn(c0)}`, rule: 'then-value',
        explain: `${at('P', p)} = ${xh(pn([[p, 'a'], [p ** 3 + c0, '']]))} = ${sn(r)}이므로 ${va} = ${sn(a)}이다. 따라서 ${PX} = ${aH(Pa)}이고 ${V('P')}(${va}) = ${at('P', a)} = ${sn(v)}이다.`
      });
    }, { count: 2 }),
    T('rem-equal', '두 일차식으로 나눈 나머지가 같다', '①23', (d, n) => {
      const [p, q] = d.shuffle(range(-3, 3).filter((v) => v !== 0)).slice(0, 2), c2 = nz(d, -4, 4), c0 = nz(d, -6, 6);
      const k = -(p * p + p * q + q * q + c2 * (p + q));
      if (k === 0) return null;
      const kE = `-((${jn(p)}**3-${jn(q)}**3+${jn(c2)}*(${jn(p)}**2-${jn(q)}**2))/(${jn(p)}-${jn(q)}))`, Pk = Dsc(1, c2, k, c0), rp = ival(Pk, p);
      const head = `다항식 ${PX} = ${xj(`x^3${sgv(c2, 'x^2')}+kx${sh(c0)}`, '을/를')} ${xh(lin(1, -p))}, ${xj(lin(1, -q), '으로/로')} 각각 나누었을 때의 나머지가 서로 같을 때,`;
      const why = `${at('P', p)} = ${at('P', q)}에서 ${xh(pn([[p, 'k'], [p ** 3 + c2 * p * p + c0, '']]))} = ${xh(pn([[q, 'k'], [q ** 3 + c2 * q * q + c0, '']]))}이므로 ${vk} = ${sn(k)}이다.`;
      if (n === 0) return num(`${head} 상수 ${vk}의 값은?`, k, { value: kE, rule: 'k', explain: `나머지정리에 의하여 ${why}` });
      const t = d.pick(range(-3, 3).filter((v) => v !== p && v !== q)), v = ival(Pk, t);
      return num(`${head} ${PX}를 ${xj(lin(1, -t), '으로/로')} 나누었을 때의 나머지는? (단, ${vk}는 상수이다.)`, v, {
        value: `${jn(t)}**3+${jn(c2)}*${jn(t)}**2+(${kE})*${jn(t)}+${jn(c0)}`, rule: 'then-rem',
        explain: `나머지정리에 의하여 ${why} 두 나머지는 모두 ${sn(rp)}이다. 따라서 ${PX} = ${aH(Pk)}이고 구하는 나머지는 ${at('P', t)} = ${sn(v)}이다.`
      });
    }, { count: 2 }),
    T('rem-two', '나머지 두 조건으로 계수 둘', '①24', (d) => {
      const [p, q] = d.shuffle(range(-3, 3).filter((v) => v !== 0)).slice(0, 2), k = d.pick([1, 2]), a = nz(d, -6, 6), b = nz(d, -8, 8), c0 = -(k * p ** 3 + a * p * p + b * p), r = k * q ** 3 + a * q * q + b * q + c0;
      if (c0 === 0 || r === 0 || Math.abs(c0) > 30) return null;
      const A1 = `(-${jn(k)}*${jn(p)}**3-${jn(c0)})`, A2 = `(${jn(r)}-${jn(k)}*${jn(q)}**3-${jn(c0)})`, Dt = `(${jn(p)}**2*${jn(q)}-${jn(q)}**2*${jn(p)})`;
      return slots(`다항식 ${xj(`${k === 1 ? '' : k}x^3+ax^2+bx${sh(c0)}`, '은/는')} ${xj(lin(1, -p), '으로/로')} 나누어떨어지고, ${xj(lin(1, -q), '으로/로')} 나누었을 때의 나머지는 ${sn(r)}이다. 상수 ${va}, ${vb}의 값은?`, [[eqL('a'), a, `(${A1}*${jn(q)}-${A2}*${jn(p)})/${Dt}`], [eqL('b'), b, `(${jn(p)}**2*${A2}-${jn(q)}**2*${A1})/${Dt}`]], {
        explain: `주어진 다항식을 ${PX}라 하면 인수정리와 나머지정리에 의하여 ${at('P', p)} = 0, ${at('P', q)} = ${sn(r)}이다. 곧 ${xh(pn([[p * p, 'a'], [p, 'b']]))} = ${sn(-(k * p ** 3) - c0)}, ${xh(pn([[q * q, 'a'], [q, 'b']]))} = ${sn(r - k * q ** 3 - c0)}이고, 이를 연립하여 풀면 ${va} = ${sn(a)}, ${vb} = ${sn(b)}이다.`
      });
    }),
    T('rem-two-next', '계수 둘을 구해 다른 나머지', '①25', (d) => {
      const [p, q, t] = d.shuffle(range(-3, 3).filter((v) => v !== 0)).slice(0, 3), c2 = nz(d, -3, 3), a = nz(d, -9, 9), b = nz(d, -9, 9), Pp = Dsc(1, c2, a, b);
      const r1 = ival(Pp, p), r2 = ival(Pp, q), v = ival(Pp, t);
      const R1 = `(${jn(r1)}-${jn(p)}**3-${jn(c2)}*${jn(p)}**2)`, R2 = `(${jn(r2)}-${jn(q)}**3-${jn(c2)}*${jn(q)}**2)`, aE = `(${R1}-${R2})/(${jn(p)}-${jn(q)})`, bE = `${R1}-(${aE})*${jn(p)}`;
      return num(`다항식 ${PX} = ${xj(`x^3${sgv(c2, 'x^2')}+ax+b`, '을/를')} ${xj(lin(1, -p), '으로/로')} 나누었을 때의 나머지는 ${sn(r1)}이고, ${xj(lin(1, -q), '으로/로')} 나누었을 때의 나머지는 ${sn(r2)}이다. ${PX}를 ${xj(lin(1, -t), '으로/로')} 나누었을 때의 나머지는? (단, ${va}, ${vb}는 상수이다.)`, v, {
        value: `${jn(t)}**3+${jn(c2)}*${jn(t)}**2+(${aE})*${jn(t)}+${bE}`,
        explain: `${at('P', p)} = ${sn(r1)}, ${at('P', q)} = ${sn(r2)}에서 ${xh(pn([[p, 'a'], [1, 'b']]))} = ${sn(r1 - p ** 3 - c2 * p * p)}, ${xh(pn([[q, 'a'], [1, 'b']]))} = ${sn(r2 - q ** 3 - c2 * q * q)}이므로 ${va} = ${sn(a)}, ${vb} = ${sn(b)}이다. 구하는 나머지는 ${at('P', t)} = ${sn(v)}이다.`
      });
    }),
    T('rem-quadcoef', '이차식으로 나눈 나머지를 주고 계수 구하기', '①18', (d) => {
      const [p, q] = d.shuffle(range(-3, 3).filter((v) => v !== 0)).slice(0, 2), u = -(p + q), w = p * q, a = nz(d, -8, 8), b = nz(d, -12, 12);
      if (u === 0) return null;
      const R = aDiv(Dsc(1, 0, a, 0, b), Dsc(1, u, w)).r, m = (R[1] || Q(0)).p, nn = R[0].p;
      if (m === 0 || nn === 0 || Math.abs(m) > 40 || Math.abs(nn) > 60) return null;
      const aE = `2*${jn(w)}-${jn(u)}**2-${jn(m)}/${jn(u)}`;
      return slots(`다항식 ${xj('x^4+ax^2+b', '을/를')} ${aJ(Dsc(1, u, w), '으로/로')} 나누었을 때의 나머지가 ${xh(lin(m, nn))}일 때, 상수 ${va}, ${vb}의 값은?`, [[eqL('a'), a, aE], [eqL('b'), b, `${jn(w)}*(${aE}-${jn(w)}+${jn(u)}**2)+${jn(nn)}`]], {
        explain: `${aH(Dsc(1, u, w))} = ${xh(`(x${sh(-p)})(x${sh(-q)})`)}이므로 몫을 ${QX}라 하면 ${xh('x^4+ax^2+b')} = ${xh(`(x${sh(-p)})(x${sh(-q)})`)}${QX}${plusS(lin(m, nn))}이다. ${X} = ${sn(p)}, ${X} = ${nj(q, '을/를')} 넣으면 ${xh(pn([[p * p, 'a'], [1, 'b']]))} = ${sn(m * p + nn - p ** 4)}, ${xh(pn([[q * q, 'a'], [1, 'b']]))} = ${sn(m * q + nn - q ** 4)}이므로 ${va} = ${sn(a)}, ${vb} = ${sn(b)}이다.`
      });
    }),
    T('rem-quad', '이차식으로 나눈 나머지', '①26', (d, n) => {
      const [p, q] = d.shuffle(range(-4, 4).filter((v) => v !== 0)).slice(0, 2), a = nz(d, -6, 6), b = n === 1 ? -a * q : nz(d, -9, 9), r1 = a * p + b, r2 = a * q + b;
      if (b === 0 || r1 === 0 || (n === 0 && r2 === 0) || p + q === 0) return null;
      const aE = `(${jn(r1)}-${jn(r2)})/(${jn(p)}-${jn(q)})`, bE = `${jn(r1)}-(${aE})*${jn(p)}`;
      const solve = `몫을 ${QX}, 나머지를 ${xh('ax+b')}라 하면 ${PX} = ${xh(`(x${sh(-p)})(x${sh(-q)})`)}${QX} + ${xh('ax+b')}이다. ${at('P', p)} = ${sn(r1)}, ${at('P', q)} = ${sn(r2)}에서 ${xh(pn([[p, 'a'], [1, 'b']]))} = ${sn(r1)}, ${xh(pn([[q, 'a'], [1, 'b']]))} = ${sn(r2)}이므로 ${va} = ${sn(a)}, ${vb} = ${sn(b)}이고 나머지는 ${xh(lin(a, b))}이다.`;
      if (n === 0) return linQ(`다항식 ${PX}를 ${xj(lin(1, -p), '으로/로')} 나누었을 때의 나머지는 ${sn(r1)}이고, ${xj(lin(1, -q), '으로/로')} 나누었을 때의 나머지는 ${sn(r2)}이다. ${PX}를 ${xj(`(x${sh(-p)})(x${sh(-q)})`, '으로/로')} 나누었을 때의 나머지는?`, a, b, { ea: aE, eb: bE, rule: 'factored', explain: solve });
      return linQ(`다항식 ${PX}는 ${xj(lin(1, -q), '으로/로')} 나누어떨어지고, ${xj(lin(1, -p), '으로/로')} 나누었을 때의 나머지는 ${sn(r1)}이다. ${PX}를 ${aJ(aMul(L(1, -p), L(1, -q)), '으로/로')} 나누었을 때의 나머지는?`, a, b, { ea: aE, eb: bE, rule: 'expanded', explain: `${aH(aMul(L(1, -p), L(1, -q)))} = ${xh(`(x${sh(-p)})(x${sh(-q)})`)}이고, 나누어떨어지므로 ${at('P', q)} = 0이다. ` + solve });
    }, { count: 2 }),
    T('rem-fromquad', '이차식으로 나눈 나머지에서 일차식으로 나눈 나머지', '①27', (d) => {
      const [p, q] = d.shuffle(range(-4, 4).filter((v) => v !== 0)).slice(0, 2), m = nz(d, -6, 6), nn = nz(d, -8, 8), v = m * p + nn;
      if (p + q === 0) return null;
      return num(`다항식 ${PX}를 ${aJ(aMul(L(1, -p), L(1, -q)), '으로/로')} 나누었을 때의 나머지가 ${xh(lin(m, nn))}이다. ${PX}를 ${xj(lin(1, -p), '으로/로')} 나누었을 때의 나머지는?`, v, {
        value: `${jn(m)}*${jn(p)}+${jn(nn)}`,
        explain: `${aH(aMul(L(1, -p), L(1, -q)))} = ${xh(`(x${sh(-p)})(x${sh(-q)})`)}이므로 ${PX} = ${xh(`(x${sh(-p)})(x${sh(-q)})`)}${QX}${plusS(lin(m, nn))}이다. 구하는 나머지는 ${at('P', p)} = ${pv(m)} × ${pv(p)}${plusN(nn)} = ${sn(v)}이다.`
      });
    }),
    T('rem-highdeg', '차수가 높은 식을 x²−1로 나눈 나머지', '①28', (d) => {
      const m = d.int(8, 12), k = d.int(3, 7), c = nz(d, -3, 3), g = d.int(-3, 3), e = nz(d, -5, 5), Pp = aAdd(aAdd(Dsc(1, ...Array(m).fill(0)), aScale(Dsc(1, ...Array(k).fill(0)), c)), Dsc(g, e));
      const f1 = ival(Pp, 1), fm = ival(Pp, -1), a = (f1 - fm) / 2, b = (f1 + fm) / 2;
      if (a === 0 || b === 0) return null;
      const F1 = `(1+${jn(c)}+${jn(g)}+${jn(e)})`, Fm = `((-1)**${m}+${jn(c)}*(-1)**${k}-${jn(g)}+${jn(e)})`;
      return linQ(`다항식 ${aJ(Pp, '을/를')} ${xj('x^2-1', '으로/로')} 나누었을 때의 나머지는?`, a, b, {
        ea: `(${F1}-${Fm})/2`, eb: `(${F1}+${Fm})/2`,
        explain: `몫을 ${QX}, 나머지를 ${xh('ax+b')}라 하면 ${aH(Pp)} = ${xh('(x+1)(x-1)')}${QX} + ${xh('ax+b')}이다. ${X} = 1을 넣으면 ${va} + ${vb} = ${sn(f1)}, ${X} = ${MINUS}1을 넣으면 ${MINUS}${va} + ${vb} = ${sn(fm)}이므로 ${va} = ${sn(a)}, ${vb} = ${sn(b)}이고 나머지는 ${xh(lin(a, b))}이다.`
      });
    }),
    T('rem-compose', '바꾼 식 P(ax+b)의 나머지', '①29', (d, n) => {
      if (n === 0) {
        const t = nz(d, -3, 3), s = nz(d, -6, 6), p = t + s, j = d.pick([2, 3]), r = nz(d, -6, 6), v = t ** j * r;
        if (p === 0) return null;
        return num(`다항식 ${PX}를 ${xj(lin(1, -p), '으로/로')} 나누었을 때의 나머지가 ${sn(r)}일 때, ${ej(nb(`${X}${sup(j)}${V('P')}(${xh(lin(1, s))})`), '을/를')} ${xj(lin(1, -t), '으로/로')} 나누었을 때의 나머지는?`, v, {
          value: `${jn(t)}**${j}*${jn(r)}`, rule: 'product',
          explain: `나머지정리에 의하여 구하는 나머지는 ${X} = ${nj(t, '을/를')} 넣은 값 (${sn(t)})${sup(j)} × ${at('P', p)}이다. ${at('P', p)} = ${sn(r)}이므로 ${sn(t ** j)} × ${pv(r)} = ${sn(v)}이다.`
        });
      }
      const [p, q] = d.shuffle(range(-4, 4).filter((v) => v !== 0)).slice(0, 2), g = d.pick([1, 2, 3]), h = nz(d, -3, 3), e = p + h, m = nz(d, -5, 5), nn = nz(d, -8, 8), v = m * p + nn;
      if (e === 0 || p + q === 0 || (g > 1 && gcd(g, Math.abs(h)) !== 1) || h === e) return null;
      return num(`다항식 ${PX}를 ${aJ(aMul(L(1, -p), L(1, -q)), '으로/로')} 나누었을 때의 나머지가 ${xh(lin(m, nn))}일 때, ${ej(nb(`${V('P')}(${xh(lin(g, e))})`), '을/를')} ${xj(lin(g, h), '으로/로')} 나누었을 때의 나머지는?`, v, {
        value: `${jn(m)}*(-${jn(h)}+${jn(e)})+${jn(nn)}`, rule: 'shifted',
        explain: `${xh(lin(g, h))} = 0인 ${X} = ${nj(Q(-h, g), '을/를')} 넣으면 ${xh(lin(g, e))} = ${sn(p)}이므로 구하는 나머지는 ${at('P', p)}이다. ${aH(aMul(L(1, -p), L(1, -q)))} = ${xh(`(x${sh(-p)})(x${sh(-q)})`)}이므로 ${at('P', p)} = ${pv(m)} × ${pv(p)}${plusN(nn)} = ${sn(v)}이다.`
      });
    }, { count: 2 }),
    T('rem-fg', '두 다항식을 섞은 식의 나머지', '①30', (d) => {
      const c = nz(d, -3, 3), s = nz(d, -4, 4), t = nz(d, -4, 4), p = c + s, q = c + t, r1 = nz(d, -6, 6), r2 = nz(d, -6, 6), al = d.int(2, 4), be = nz(d, -4, 4), v = al * r1 + be * r2;
      if (p === 0 || q === 0 || s === t || Math.abs(be) === 1) return null;
      const F = V('f'), G = V('g');
      return num(`다항식 ${F}(${X})를 ${xj(lin(1, -p), '으로/로')} 나누었을 때의 나머지는 ${sn(r1)}이고, 다항식 ${G}(${X})를 ${xj(lin(1, -q), '으로/로')} 나누었을 때의 나머지는 ${sn(r2)}이다. ${ej(nb(`${al}${F}(${xh(lin(1, s))}) ${be < 0 ? MINUS : '+'} ${Math.abs(be)}${G}(${xh(lin(1, t))})`), '을/를')} ${xj(lin(1, -c), '으로/로')} 나누었을 때의 나머지는?`, v, {
        value: `${al}*${jn(r1)}+${jn(be)}*${jn(r2)}`,
        explain: `${X} = ${nj(c, '을/를')} 넣으면 구하는 나머지는 ${al}${F}(${sn(p)}) ${be < 0 ? MINUS : '+'} ${Math.abs(be)}${G}(${sn(q)}) = ${al} × ${r1 < 0 ? '(' + sn(r1) + ')' : sn(r1)} ${be < 0 ? MINUS : '+'} ${Math.abs(be)} × ${r2 < 0 ? '(' + sn(r2) + ')' : sn(r2)} = ${sn(v)}이다.`
      });
    }),
    T('rem-product', '곱한 다항식의 나머지', '①31', (d, n) => {
      if (n === 0) {
        const [p, q] = d.shuffle(range(-3, 3).filter((v) => v !== 0)).slice(0, 2), k = nz(d, -4, 4), r1 = nz(d, -5, 5), r2 = nz(d, -5, 5), v1 = (p + k) * r1, v2 = (q + k) * r2;
        const a = (v1 - v2) / (p - q), b = v1 - a * p;
        if (p + k === 0 || q + k === 0 || p + q === 0 || !Number.isInteger(a) || a === 0 || b === 0) return null;
        const aE = `((${jn(p)}+${jn(k)})*${jn(r1)}-(${jn(q)}+${jn(k)})*${jn(r2)})/(${jn(p)}-${jn(q)})`;
        return linQ(`다항식 ${PX}를 ${xh(lin(1, -p))}, ${xj(lin(1, -q), '으로/로')} 나누었을 때의 나머지가 각각 ${sn(r1)}, ${sn(r2)}일 때, ${ej(nb(`(${xh(lin(1, k))})${PX}`), '을/를')} ${aJ(aMul(L(1, -p), L(1, -q)), '으로/로')} 나누었을 때의 나머지는?`, a, b, {
          ea: aE, eb: `(${jn(p)}+${jn(k)})*${jn(r1)}-(${aE})*${jn(p)}`, rule: 'times',
          explain: `${nb(`(${xh(lin(1, k))})${PX}`)} = (${aH(aMul(L(1, -p), L(1, -q)))})${QX} + ${xh('ax+b')}라 하자. ${X} = ${nj(p, '을/를')} 넣으면 ${pv(p + k)} × ${pv(r1)} = ${xh(pn([[p, 'a'], [1, 'b']]))}, ${X} = ${nj(q, '을/를')} 넣으면 ${pv(q + k)} × ${pv(r2)} = ${xh(pn([[q, 'a'], [1, 'b']]))}이므로 ${va} = ${sn(a)}, ${vb} = ${sn(b)}이고 나머지는 ${xh(lin(a, b))}이다.`
        });
      }
      const p = nz(d, -3, 3), k = nz(d, -3, 3), g = d.pick([2, 3]), t = nz(d, -2, 3), h = nz(d, -4, 4), q = d.pick(range(-4, 4).filter((v) => v !== 0 && v !== p && v !== -p)), e = q - g * t, r1 = nz(d, -6, 6), r2 = nz(d, -6, 6);
      const a = (r1 - r2) / (p - q), b = r1 - a * p, v1 = (p + k) * r1, v2 = (g * t + h) * r2;
      if (p + k === 0 || g * t + h === 0 || e === 0 || !Number.isInteger(a) || a === 0 || b === 0 || gcd(g, Math.abs(h)) !== 1) return null;
      const R1 = `${jn(v1)}/(${jn(p)}+${jn(k)})`, R2 = `${jn(v2)}/(${jn(g)}*${jn(t)}+${jn(h)})`, aE = `(${R1}-${R2})/(${jn(p)}-${jn(q)})`;
      return linQ(`다항식 ${PX}에 대하여 ${ej(nb(`(${xh(lin(1, k))})${PX}`), '을/를')} ${xj(lin(1, -p), '으로/로')} 나누었을 때의 나머지는 ${sn(v1)}이고, ${ej(nb(`(${xh(lin(g, h))})${V('P')}(${xh(lin(g, e))})`), '을/를')} ${xj(lin(1, -t), '으로/로')} 나누었을 때의 나머지는 ${sn(v2)}이다. ${PX}를 ${xj(`(x${sh(-p)})(x${sh(-q)})`, '으로/로')} 나누었을 때의 나머지는?`, a, b, {
        ea: aE, eb: `${R1}-(${aE})*${jn(p)}`, rule: 'two-shapes',
        explain: `${X} = ${nj(p, '을/를')} 넣으면 ${cv(p + k, at('P', p))} = ${sn(v1)}에서 ${at('P', p)} = ${sn(r1)}, ${X} = ${nj(t, '을/를')} 넣으면 ${cv(g * t + h, at('P', q))} = ${sn(v2)}에서 ${at('P', q)} = ${sn(r2)}이다. 나머지를 ${xh('ax+b')}라 하면 ${xh(pn([[p, 'a'], [1, 'b']]))} = ${sn(r1)}, ${xh(pn([[q, 'a'], [1, 'b']]))} = ${sn(r2)}이므로 나머지는 ${xh(lin(a, b))}이다.`
      });
    }, { count: 2 }),
    T('rem-backward', '곱한 식의 나머지에서 인수의 나머지', '심4', (d) => {
      const p = nz(d, -3, 3), k = nz(d, -4, 4), m = nz(d, -4, 4), F = nz(d, -7, 7), r = (p + k) * (F - m), f = V('f');
      if (p + k === 0 || r === 0) return null;
      return num(`다항식 ${f}(${X})에 대하여 ${ej(nb(`(${xh(lin(1, k))}){${f}(${X}) ${m < 0 ? '+' : MINUS} ${Math.abs(m)}}`), '을/를')} ${xj(lin(1, -p), '으로/로')} 나누었을 때의 나머지가 ${sn(r)}일 때, ${f}(${X})를 ${xj(lin(1, -p), '으로/로')} 나누었을 때의 나머지는?`, F, {
        value: `${jn(r)}/(${jn(p)}+${jn(k)})+${jn(m)}`,
        explain: `나머지정리에 의하여 ${sn(p + k)} × {${f}(${sn(p)}) ${m < 0 ? '+' : MINUS} ${Math.abs(m)}} = ${sn(r)}이므로 ${f}(${sn(p)}) = ${sn(F)}이다. ${f}(${X})를 ${xj(lin(1, -p), '으로/로')} 나누었을 때의 나머지는 ${f}(${sn(p)}) = ${sn(F)}이다.`
      });
    }),
    T('rem-shift', 'P(x)±k가 나누어떨어진다', '①32', (d) => {
      const [p, q] = d.shuffle(range(-3, 3).filter((v) => v !== 0)).slice(0, 2), a = nz(d, -5, 5), b = nz(d, -6, 6), c0 = nz(d, -6, 6), m = a * p * p + b * p + c0, nn = -(a * q * q + b * q + c0);
      if (m === 0 || nn === 0 || p + q === 0) return null;
      const A1 = `(${jn(m)}-${jn(c0)})`, A2 = `(-${jn(nn)}-${jn(c0)})`, Dt = `(${jn(p)}**2*${jn(q)}-${jn(q)}**2*${jn(p)})`;
      const e1 = `${PX} ${m > 0 ? MINUS : '+'} ${Math.abs(m)}`, e2 = `${PX} ${nn > 0 ? '+' : MINUS} ${Math.abs(nn)}`;
      return slots(`다항식 ${PX} = ${xh(`ax^2+bx${sh(c0)}`)}에 대하여 ${nb(e1 + tail(Math.abs(m), '은/는'))} ${xj(lin(1, -p), '으로/로')} 나누어떨어지고, ${nb(e2 + tail(Math.abs(nn), '은/는'))} ${xj(lin(1, -q), '으로/로')} 나누어떨어진다. 상수 ${va}, ${vb}의 값은?`, [[eqL('a'), a, `(${A1}*${jn(q)}-${A2}*${jn(p)})/${Dt}`], [eqL('b'), b, `(${jn(p)}**2*${A2}-${jn(q)}**2*${A1})/${Dt}`]], {
        explain: `인수정리에 의하여 ${at('P', p)} = ${sn(m)}, ${at('P', q)} = ${sn(-nn)}이다. 곧 ${xh(pn([[p * p, 'a'], [p, 'b']]))} = ${sn(m - c0)}, ${xh(pn([[q * q, 'a'], [q, 'b']]))} = ${sn(-nn - c0)}이고, 연립하여 풀면 ${va} = ${sn(a)}, ${vb} = ${sn(b)}이다.`
      });
    }),
    T('rem-common-root', '두 식이 같은 일차식으로 나누어떨어질 때 그 수', '①33', (d) => {
      const a = nz(d, -4, 4), m = nz(d, -6, 6), c = nz(d, -6, 6), e = -a * (c - m);
      if (c === m || e === 0) return null;
      const e1 = `${PX} ${m < 0 ? MINUS : '+'} ${Math.abs(m)}`, e2 = `${X}${PX} ${c < 0 ? MINUS : '+'} ${Math.abs(c) === 1 ? '' : Math.abs(c)}${X} ${e < 0 ? MINUS : '+'} ${Math.abs(e)}`;
      return num(`다항식 ${PX}에 대하여 두 다항식 ${nb(e1)}, ${ej(nb(e2), '이/가')} 모두 ${xj('x-a', '으로/로')} 나누어떨어질 때, 상수 ${va}의 값은?`, a, {
        value: `-${jn(e)}/(${jn(c)}-${jn(m)})`,
        explain: `인수정리에 의하여 ${V('P')}(${va}) ${m < 0 ? MINUS : '+'} ${Math.abs(m)} = 0, ${va}${V('P')}(${va}) + ${xh(pn([[c, 'a'], [e, '']]))} = 0이다. ${V('P')}(${va}) = ${nj(-m, '을/를')} 뒤의 식에 넣으면 ${xh(pn([[c - m, 'a'], [e, '']]))} = 0이므로 ${va} = ${sn(a)}이다.`
      });
    }),
    T('rem-bignum', '큰 수의 나머지', '①34', (d) => {
      const k = d.pick([2, 3]), nn = d.int(3, 7), D = d.int(1000, 3000), Nn = D + k, v = k ** nn;
      if (v >= D) return null;
      return numU(`${ej(nb(`${Nn}${sup(nn)}`), '을/를')} ${D}${tail(D, '으로/로')} 나누었을 때의 나머지는?`, v, {
        value: `(${Nn}-${D})**${nn}`, rule: 'positive',
        explain: `${X}${sup(nn)}을 ${xj(lin(1, -k), '으로/로')} 나누었을 때의 몫을 ${QX}라 하면 나머지는 ${k}${sup(nn)} = ${v}이므로 ${X}${sup(nn)} = (${xh(lin(1, -k))})${QX} + ${v}이다. ${X} = ${nj(Nn, '을/를')} 넣으면 ${Nn}${sup(nn)} = ${D} × ${V('Q')}(${Nn}) + ${v}이고 ${v} &lt; ${D}이므로 구하는 나머지는 ${v}이다.`
      });
    }),
    T('rem-magic', '모든 계수의 합과 나머지로 곱한 일차식 찾기', '①41', (d) => {
      const Fp = Dsc(1, nz(d, -5, 5), nz(d, -7, 7), nz(d, -5, 5)), a = nz(d, -5, 5), b = nz(d, -6, 6), t = d.pick([2, 3, -1, -2]), F1 = ival(Fp, 1), Ft = ival(Fp, t);
      if (F1 === 0 || Ft === 0 || a + b === 0 || Math.abs(F1) > 6 || Math.abs(Ft) > 9) return null;
      const S = (a + b) * F1, R = (a * t + b) * Ft;
      if (R === 0) return null;
      const fx = (x) => `(${trimA(Fp).map((c, i) => `${jn(c)}*${jn(x)}**${i}`).reverse().join('+')})`, aE = `(${jn(R)}/${fx(t)}-${jn(S)}/${fx(1)})/(${jn(t)}-1)`;
      return linQ(`어떤 일차식과 다항식 ${aJ(Fp, '을/를')} 곱한 다항식을 ${PX}라 하자. ${PX}의 상수항을 포함한 모든 계수의 합이 ${sn(S)}이고, ${PX}를 ${xj(lin(1, -t), '으로/로')} 나누었을 때의 나머지가 ${sn(R)}일 때, 그 일차식은?`, a, b, {
        ea: aE, eb: `${jn(S)}/${fx(1)}-(${aE})`,
        explain: `일차식을 ${xh('ax+b')}라 하면 ${PX} = (${xh('ax+b')})(${aH(Fp)})이다. 모든 계수의 합은 ${at('P', 1)} = (${va} + ${vb}) × ${pv(F1)} = ${sn(S)}이고, 나머지정리에 의하여 ${at('P', t)} = (${xh(pn([[t, 'a'], [1, 'b']]))}) × ${pv(Ft)} = ${sn(R)}이다. ${va} + ${vb} = ${sn(a + b)}, ${xh(pn([[t, 'a'], [1, 'b']]))} = ${sn(a * t + b)}에서 ${va} = ${sn(a)}, ${vb} = ${sn(b)}이므로 일차식은 ${xh(lin(a, b))}이다.`
      });
    }),
    T('rem-const-formula', '나머지 일차식의 계수를 나타낸 식', '①40', (d) => {
      const p = d.pick([1, 2, 3]), askConst = d.bool(), f = V('f'), fp = `${f}(${p})`, fm = `${f}(${MINUS}${p})`;
      const right = askConst ? [Q(1, 2), Q(1, 2)] : [Q(1, 2 * p), Q(-1, 2 * p)];
      const pool = [[Q(1, 2), Q(1, 2)], [Q(1, 2), Q(-1, 2)], [Q(1), Q(1)], [Q(1), Q(-1)], [Q(2), Q(-2)], [Q(1, 2 * p), Q(-1, 2 * p)], [Q(1, 2 * p), Q(1, 2 * p)], [Q(1, p), Q(-1, p)]];
      const key = ([s, t]) => s.p + '/' + s.q + ',' + t.p + '/' + t.q, uniq = [];
      for (const c of pool) if (!uniq.some((u) => key(u) === key(c))) uniq.push(c);
      const wrong = d.shuffle(uniq.filter((c) => key(c) !== key(right))).slice(0, 4);
      const show = ([s, t]) => { const plus = s.p * t.p > 0, inner = `${fp} ${plus ? '+' : MINUS} ${fm}`, k = qabs(s); return k.p === 1 && k.q === 1 ? nb(inner) : k.q === 1 ? nb(`${k.p}{${inner}}`) : nb(frac(inner, k.q)); };
      return pickQ(d, `다항식 ${f}(${X})를 ${xj(`(x-${p})(x+${p})`, '으로/로')} 나누었을 때의 나머지의 ${askConst ? '상수항을' : `${X}의 계수를`} 나타낸 것은?`, [right].concat(wrong).map((c) => ({ h: show(c), ok: key(c) === key(right) })), {
        explain: `나머지를 ${xh('ax+b')}라 하면 ${f}(${X}) = ${xh(`(x-${p})(x+${p})`)}${QX} + ${xh('ax+b')}이므로 ${fp} = ${p === 1 ? '' : p}${va} + ${vb}, ${fm} = ${MINUS}${p === 1 ? '' : p}${va} + ${vb}이다. 두 식을 더하면 ${vb} = ${show([Q(1, 2), Q(1, 2)])}이고, 빼면 ${va} = ${show([Q(1, 2 * p), Q(-1, 2 * p)])}이다.`
      });
    })
  ];

  // ── 다. 인수정리 ──
  const fthmTypes = [
    T('fthm-coef', '나누어떨어질 때 계수 하나', '①44', (d) => {
      const p = nz(d, -3, 3), c3 = d.int(1, 4), c2 = nz(d, -5, 5), k = nz(d, -12, 12), c0 = k * p - c3 * p ** 3 - c2 * p * p;
      if (c0 === 0 || Math.abs(c0) > 40) return null;
      return num(`다항식 ${PX} = ${xj(`${c3 === 1 ? '' : c3}x^3${sgv(c2, 'x^2')}-kx${sh(c0)}`, '이/가')} ${xj(lin(1, -p), '으로/로')} 나누어떨어질 때, 상수 ${vk}의 값은?`, k, {
        value: `(${jn(c3)}*${jn(p)}**3+${jn(c2)}*${jn(p)}**2+${jn(c0)})/${jn(p)}`,
        explain: `인수정리에 의하여 ${at('P', p)} = 0이다. ${xh(pn([[-p, 'k'], [c3 * p ** 3 + c2 * p * p + c0, '']]))} = 0이므로 ${vk} = ${sn(k)}이다.`
      });
    }),
    T('fthm-coef-axb', 'ax+b로 나누어떨어질 때 계수(분수)', '①44', (d) => {
      const a = d.pick([2, 3]), b = nz(d, -2, 2), r = Q(-b, a), c3 = d.int(1, 4), c2 = nz(d, -4, 4), c0 = nz(d, -8, 8);
      if (gcd(a, Math.abs(b)) !== 1) return null;
      const A = qadd(qadd(qmul(Q(c3), qmul(r, qmul(r, r))), qmul(Q(c2), qmul(r, r))), Q(c0)), k = qdiv(A, r);
      if (isInt(k) || k.q > 24 || Math.abs(k.p) > 240) return null;
      return num(`다항식 ${PX} = ${xj(`${c3 === 1 ? '' : c3}x^3${sgv(c2, 'x^2')}-kx${sh(c0)}`, '이/가')} ${xj(lin(a, b), '으로/로')} 나누어떨어질 때, 상수 ${vk}의 값은?`, k, {
        value: `(${jn(c3)}*${jn(r)}**3+${jn(c2)}*${jn(r)}**2+${jn(c0)})/${jn(r)}`,
        explain: `${xh(lin(a, b))} = 0인 ${X} = ${sn(r)}에서 ${V('P')}(${sn(r)}) = 0이다. ${V('P')}(${sn(r)}) = ${sn(A)} ${r.p > 0 ? MINUS : '+'} ${frac(Math.abs(r.p), r.q)}${vk} = 0이므로 ${vk} = ${sn(k)}이다.`
      });
    }),
    T('fthm-coef-quot', '계수를 구하고 몫까지', '①45', (d) => {
      const p = nz(d, -3, 3), q2 = nz(d, -3, 3), q1 = nz(d, -5, 5), q0 = nz(d, -6, 6), Pp = aMul(L(1, -p), Dsc(q2, q1, q0));
      const [c0, a, c2, k] = Pp.map((t) => t.p);
      if (!c0 || !a || !c2 || Math.abs(a) > 30 || Math.abs(c0) > 40) return null;
      const aE = `-(${jn(k)}*${jn(p)}**3+${jn(c2)}*${jn(p)}**2+${jn(c0)})/${jn(p)}`, q1E = `${jn(c2)}+${jn(p)}*${jn(k)}`;
      return inline(`다항식 ${PX} = ${xj(`${k === 1 ? '' : k === -1 ? '-' : k}x^3${sgv(c2, 'x^2')}+ax${sh(c0)}`, '이/가')} ${xj(lin(1, -p), '으로/로')} 나누어떨어질 때, 상수 ${va}의 값과 ${PX}를 ${xj(lin(1, -p), '으로/로')} 나누었을 때의 몫을 구하시오.` + NOTE1,
        nb(`${va} = {0}`) + ', 몫: ' + nb(`{1}${X}${sup(2)}`) + ' ' + nb(`{2}${X}`) + ' ' + nb('{3}'),
        [{ answer: a, signed: true }, { answer: q2, signed: true }, { answer: q1, signed: true }, { answer: q0, signed: true }], {
          shown: `${va} = ${sn(a)}, 몫: ${poly([[q2, X + sup(2)], [q1, X], [q0, '']])}`,
          facts: { calc: [[aE, 0], [jn(k), 1], [q1E, 2], [`${aE}+${jn(p)}*(${q1E})`, 3]] },
          explain: `인수정리에 의하여 ${at('P', p)} = ${xh(pn([[p, 'a'], [k * p ** 3 + c2 * p * p + c0, '']]))} = 0이므로 ${va} = ${sn(a)}이다. 조립제법으로 ${aJ(Pp, '을/를')} ${xj(lin(1, -p), '으로/로')} 나누면 몫은 ${aH(Dsc(q2, q1, q0))}이고 나머지는 0이다.`
        });
    }),
    T('fthm-two', '두 일차식의 곱으로 나누어떨어질 때 계수 둘', '①46', (d, n) => {
      const [p, q] = d.shuffle(range(-3, 3).filter((v) => v !== 0)).slice(0, 2), k = d.int(1, 3), m = nz(d, -5, 5), Pp = aProd(L(1, -p), L(1, -q), L(k, m));
      const [c0, b, a] = Pp.map((t) => t.p);
      if (!a || !b || !c0 || p + q === 0 || Math.abs(c0) > 40) return null;
      const head = `다항식 ${xj(`${k === 1 ? '' : k}x^3+ax^2+bx${sh(c0)}`, '이/가')}`;
      if (n === 0) {
        const A1 = `(-${jn(k)}*${jn(p)}**3-${jn(c0)})`, A2 = `(-${jn(k)}*${jn(q)}**3-${jn(c0)})`, Dt = `(${jn(p)}**2*${jn(q)}-${jn(q)}**2*${jn(p)})`;
        return slots(`${head} ${xj(`(x${sh(-p)})(x${sh(-q)})`, '으로/로')} 나누어떨어질 때, 상수 ${va}, ${vb}의 값은?`, [[eqL('a'), a, `(${A1}*${jn(q)}-${A2}*${jn(p)})/${Dt}`], [eqL('b'), b, `(${jn(p)}**2*${A2}-${jn(q)}**2*${A1})/${Dt}`]], {
          rule: 'factored',
          explain: `주어진 다항식을 ${PX}라 하면 인수정리에 의하여 ${at('P', p)} = 0, ${at('P', q)} = 0이다. 곧 ${xh(pn([[p * p, 'a'], [p, 'b']]))} = ${sn(-k * p ** 3 - c0)}, ${xh(pn([[q * q, 'a'], [q, 'b']]))} = ${sn(-k * q ** 3 - c0)}이므로 ${va} = ${sn(a)}, ${vb} = ${sn(b)}이다.`
        });
      }
      const u = -(p + q), w = p * q;
      return slots(`${head} ${aJ(Dsc(1, u, w), '으로/로')} 나누어떨어질 때, 상수 ${va}, ${vb}의 값은?`, [[eqL('a'), a, `${jn(c0)}/${jn(w)}+${jn(k)}*${jn(u)}`], [eqL('b'), b, `${jn(u)}*${jn(c0)}/${jn(w)}+${jn(k)}*${jn(w)}`]], {
        rule: 'expanded',
        explain: `몫을 ${xh(`${k === 1 ? '' : k}x+m`)}이라 하면 주어진 식은 (${aH(Dsc(1, u, w))})(${xh(`${k === 1 ? '' : k}x+m`)})이다. 상수항을 비교하면 ${cv(w, V('m'))} = ${sn(c0)}에서 ${V('m')} = ${sn(m)}이고, ${X}${sup(2)}의 계수에서 ${va} = ${sn(m)}${plusN(k * u)} = ${sn(a)}, ${X}의 계수에서 ${vb} = ${sn(u * m)}${plusN(k * w)} = ${sn(b)}이다.`
      });
    }, { count: 2 }),
    T('fthm-two-next', '계수 둘을 구해 다른 나머지', '①47', (d) => {
      const [p, q] = d.shuffle(range(-3, 3).filter((v) => v !== 0)).slice(0, 2), k = d.int(2, 3), m = nz(d, -5, 5), u = -(p + q), w = p * q, Pp = aMul(Dsc(1, u, w), L(k, m));
      const c1 = Pp[1].p, a = Pp[2].p, b = Pp[0].p, t = d.pick(range(-3, 3).filter((v) => v !== p && v !== q)), v = ival(Pp, t);
      if (u === 0 || !c1 || !a || !b) return null;
      return num(`다항식 ${PX} = ${xj(`${k}x^3+ax^2${sgv(c1, 'x')}+b`, '이/가')} ${aJ(Dsc(1, u, w), '으로/로')} 나누어떨어질 때, ${PX}를 ${xj(lin(1, -t), '으로/로')} 나누었을 때의 나머지는? (단, ${va}, ${vb}는 상수이다.)`, v, {
        value: `(${jn(t)}**2+${jn(u)}*${jn(t)}+${jn(w)})*(${jn(k)}*${jn(t)}+(${jn(c1)}-${jn(k)}*${jn(w)})/${jn(u)})`,
        explain: `${aH(Dsc(1, u, w))} = ${xh(`(x${sh(-p)})(x${sh(-q)})`)}이므로 ${at('P', p)} = 0, ${at('P', q)} = 0에서 ${va} = ${sn(a)}, ${vb} = ${sn(b)}이다. 곧 ${PX} = ${aH(Pp)}이고 구하는 나머지는 ${at('P', t)} = ${sn(v)}이다.`
      });
    }),
    T('fthm-irred', '인수분해되지 않는 이차식으로 나누어떨어짐', '①49', (d) => {
      const u = nz(d, -3, 3), w = d.int(1, 5), m = nz(d, -5, 5), c2 = u + m, c1 = w + u * m, a = w * m;
      if (u * u - 4 * w >= 0 || c2 === 0 || c1 === 0) return null;
      return num(`다항식 ${xj(`x^3${sgv(c2, 'x^2')}${sgv(c1, 'x')}+a`, '이/가')} ${aJ(Dsc(1, u, w), '으로/로')} 나누어떨어질 때, 상수 ${va}의 값은?`, a, {
        value: `${jn(w)}*(${jn(c2)}-${jn(u)})`,
        explain: `몫을 ${xh('x+m')}이라 하면 주어진 식은 (${aH(Dsc(1, u, w))})(${xh('x+m')})이다. ${X}${sup(2)}의 계수를 비교하면 ${sn(u)} + ${V('m')} = ${sn(c2)}이므로 ${V('m')} = ${sn(m)}이고, 상수항에서 ${va} = ${w} × ${pv(m)} = ${sn(a)}이다.`
      });
    }),
    T('fthm-square', '(x−a)²으로 나누어떨어짐', '①50', (d, n) => {
      const p = nz(d, -3, 3);
      if (n === 0) {
        const a = -2 * p * p, b = p ** 4;
        return slots(`다항식 ${xj('x^4+ax^2+b', '이/가')} ${xj(`(x${sh(-p)})^2`, '으로/로')} 나누어떨어질 때, 상수 ${va}, ${vb}의 값은?`, [[eqL('a'), a, `-2*${jn(p)}**2`], [eqL('b'), b, `${jn(p)}**4`]], {
          rule: 'quartic',
          explain: `${X} = ${nj(p, '을/를')} 넣으면 ${xh(pn([[p * p, 'a'], [1, 'b'], [p ** 4, '']]))} = 0이다. 조립제법으로 ${xj(lin(1, -p), '으로/로')} 나눈 몫 ${xh(`x^3${sgv(p, 'x^2')}+(a${sh(p * p)})x${sgv(p, 'a')}${sh(p ** 3)}`)}도 ${xj(lin(1, -p), '으로/로')} 나누어떨어지므로 ${X} = ${nj(p, '을/를')} 넣으면 ${xh(pn([[2 * p, 'a'], [4 * p ** 3, '']]))} = 0, ${va} = ${sn(a)}이고 ${vb} = ${sn(b)}이다.`
        });
      }
      const c2 = nz(d, -4, 4), m = c2 + 2 * p, a = p * p - 2 * p * m, b = p * p * m;
      if (m === 0 || a === 0 || m === -p || m === p) return null;
      return slots(`다항식 ${xj(`x^3${sgv(c2, 'x^2')}+ax+b`, '이/가')} ${xj(`(x${sh(-p)})^2`, '으로/로')} 나누어떨어질 때, 상수 ${va}, ${vb}의 값은?`, [[eqL('a'), a, `${jn(p)}**2-2*${jn(p)}*(${jn(c2)}+2*${jn(p)})`], [eqL('b'), b, `${jn(p)}**2*(${jn(c2)}+2*${jn(p)})`]], {
        rule: 'cubic',
        explain: `몫을 ${xh('x+m')}이라 하면 주어진 식은 ${xh(`(x${sh(-p)})^2(x+m)`)}이다. ${X}${sup(2)}의 계수를 비교하면 ${sn(-2 * p)} + ${V('m')} = ${sn(c2)}이므로 ${V('m')} = ${sn(m)}이고, ${xh(`(x${sh(-p)})^2(x${sh(m)})`)} = ${aH(aProd(L(1, -p), L(1, -p), L(1, m)))}에서 ${va} = ${sn(a)}, ${vb} = ${sn(b)}이다.`
      });
    }, { count: 2 }),
    T('fthm-pick', '인수인 일차식 고르기', '①52', (d, n) => {
      if (n === 0) {
        const roots = d.shuffle(range(-4, 4).filter((v) => v !== 0)).slice(0, 3), Pp = aProd(...roots.map((r) => L(1, -r)));
        if (Pp.some((c) => c.p === 0)) return null;
        const fake = d.shuffle(range(-4, 4).filter((v) => !roots.includes(v))).slice(0, 2), useT = d.int(2, 3), cand = d.shuffle(roots.slice(0, useT).concat(fake.slice(0, 4 - useT)));
        const rows = cand.map((r) => xh(r === 0 ? 'x' : lin(1, -r)));
        return comboQ(d, `다항식 ${PX} = ${aH(Pp)}의 인수인 것만을 보기에서 있는 대로 고른 것은?`, rows, cand.map((r) => ival(Pp, r) === 0), {
          rule: 'all', explain: `인수정리에 의하여 ${X} ${MINUS} α가 인수인 것은 ${V('P')}(α) = 0일 때이다. ${cand.map((r) => `${at('P', r)} = ${sn(ival(Pp, r))}`).join(', ')}이다.`
        });
      }
      const [p, s, t] = d.shuffle(range(-3, 3).filter((v) => v !== 0)).slice(0, 3), Pp = aProd(L(1, -p), L(1, -s), L(1, -t));
      const [c0, c1, a] = Pp.map((x) => x.p);
      if (!a || !c1 || !c0) return null;
      const opts = [s].concat([...new Set(d.shuffle([-s, -t, s + 1, s - 1, t + 2, -p].filter((r) => ival(Pp, r) !== 0)))].slice(0, 4));
      if (opts.length < 5) return null;
      return pickQ(d, `다항식 ${PX} = ${xj(`x^3+ax^2${sgv(c1, 'x')}${sh(c0)}`, '이/가')} ${xj(lin(1, -p), '으로/로')} 나누어떨어질 때, 다음 중 ${PX}의 인수인 것은? (단, ${va}는 상수이다.)`, opts.map((r, i) => ({ h: xh(lin(1, -r)), ok: i === 0 })), {
        rule: 'one', explain: `${at('P', p)} = 0에서 ${va} = ${sn(a)}이다. 조립제법으로 나누면 ${PX} = (${xh(lin(1, -p))})(${aH(aMul(L(1, -s), L(1, -t)))}) = ${xh(`(x${sh(-p)})(x${sh(-s)})(x${sh(-t)})`)}이므로 보기 가운데 인수는 ${xh(lin(1, -s))}이다.`
      });
    }, { count: 2 }),
    T('fthm-common', '두 다항식의 공통인수', '①53', (d) => {
      const r = nz(d, -3, 3), u = nz(d, -3, 3), w = d.int(1, 5), F = aMul(L(1, -r), Dsc(1, u, w)), c2 = nz(d, -4, 4), c0 = nz(d, -12, 12), a = -(r ** 3 + c2 * r * r + c0) / r;
      if (u * u - 4 * w >= 0 || !Number.isInteger(a) || a === 0 || F.some((c) => c.p === 0)) return null;
      return slots(`두 다항식 ${aH(F)}, ${xj(`x^3${sgv(c2, 'x^2')}+ax${sh(c0)}`, '이/가')} 모두 ${xj('x+b', '을/를')} 인수로 가질 때, 상수 ${va}, ${vb}의 값은?`, [[eqL('a'), a, `-(${jn(r)}**3+${jn(c2)}*${jn(r)}**2+${jn(c0)})/${jn(r)}`], [eqL('b'), -r, `-${jn(r)}`]], {
        derived: [Math.abs(r)],
        explain: `앞의 식은 ${X} = ${nj(r, '을/를')} 넣으면 0이므로 ${aH(F)} = (${xh(lin(1, -r))})(${aH(Dsc(1, u, w))})이고, ${aJ(Dsc(1, u, w), '은/는')} 더 인수분해되지 않으므로 ${vb} = ${sn(-r)}이다. 뒤의 식도 ${xj(lin(1, -r), '을/를')} 인수로 가지므로 ${X} = ${nj(r, '을/를')} 넣은 값이 0이고 ${va} = ${sn(a)}이다.`
      });
    }),
    T('fthm-pattern', 'P(k)가 k의 몇 배로 주어진 세 값', '①54', (d) => {
      const c = d.int(1, 5), m = d.int(1, 4), t = d.pick([4, 5, 0, -1]), v = c * (t - 1) * (t - 2) * (t - 3) + m * t;
      return num(`최고차항의 계수가 ${c}인 삼차식 ${PX}에 대하여 ${at('P', 1)} = ${m}, ${at('P', 2)} = ${2 * m}, ${at('P', 3)} = ${3 * m}일 때, ${PX}를 ${xj(lin(1, -t), '으로/로')} 나누었을 때의 나머지는?`, v, {
        value: `${c}*(${jn(t)}-1)*(${jn(t)}-2)*(${jn(t)}-3)+${m}*${jn(t)}`,
        explain: `${PX} ${MINUS} ${m === 1 ? '' : m}${X}는 ${X} = 1, 2, 3에서 0이므로 인수정리에 의하여 ${xj('(x-1)(x-2)(x-3)', '을/를')} 인수로 갖는다. 최고차항의 계수가 ${c}이므로 ${PX} = ${c === 1 ? '' : c}${xh('(x-1)(x-2)(x-3)')} + ${m === 1 ? '' : m}${X}이고, 구하는 나머지는 ${at('P', t)} = ${sn(v)}이다.`
      });
    })
  ];

  // ── 라. 조립제법 ──
  const SYN = '조립제법을 이용하여 다음 나눗셈의 몫과 나머지를 구하시오.';
  // 조립제법의 몫과 나머지를 나뉘는 식의 계수로 셈하는 검사 식(차수가 큰 몫부터, 마지막이 나머지)
  function synthE(p, r) { const o = trimA(p).slice().reverse(), out = [jn(o[0])]; for (let i = 1; i < o.length; i += 1) out.push(`${jn(o[i])}+${jn(r)}*(${out[i - 1]})`); return out; }
  const synthTypes = [
    T('synth-basic', 'x−a로 나눈 몫과 나머지', '①56', (d) => {
      const p = nz(d, -3, 3), qq = Dsc(d.int(1, 4), nz(d, -5, 5), nz(d, -6, 6)), r = d.int(-9, 9), Pp = aAdd(aMul(L(1, -p), qq), [Q(r)]);
      if (!nz0(Pp) || !small(Pp, 40)) return null;
      return quotRem(SYN, qq, r, synthE(Pp, p), {
        figure: ex(`(${xe(aSrc(Pp))}) <i>÷</i> (${xe(lin(1, -p))})`),
        explain: `${xh(lin(1, -p))} = 0인 ${X} = ${nj(p, '으로/로')} 조립제법을 하면 셋째 줄이 ${synth(Pp, p).bot.map(sn).join(', ')}이고 나머지가 ${sn(r)}이다. 따라서 몫은 ${aH(qq)}, 나머지는 ${sn(r)}이다.`
      });
    }),
    T('synth-zero', '빠진 차수가 있는 조립제법', '①57', (d) => {
      const p = nz(d, -3, 3), holes = d.shuffle([1, 2, 3]).slice(0, d.int(1, 2)), cs = [nz(d, -3, 3), nz(d, -4, 4), nz(d, -5, 5), nz(d, -5, 5), nz(d, -8, 8)];
      holes.forEach((h) => { cs[h] = 0; });
      const Pp = Dsc(...cs), s = synth(Pp, p), qq = s.bot.slice().reverse();
      if (qq.some((c) => c.p === 0) || !small(qq, 40) || Math.abs(s.rem.p) > 99) return null;
      return quotRem(SYN, qq, s.rem, synthE(Pp, p), {
        figure: ex(`(${xe(aSrc(Pp))}) <i>÷</i> (${xe(lin(1, -p))})`),
        explain: `빠진 차수의 계수는 0으로 적고 조립제법을 한다. 첫째 줄 ${s.top.slice(0, -1).map(sn).concat([nj(s.top[s.top.length - 1], '을/를')]).join(', ')} ${X} = ${nj(p, '으로/로')} 계산하면 셋째 줄이 ${s.bot.map(sn).join(', ')}이고 나머지가 ${sn(s.rem)}이므로 몫은 ${aH(qq)}, 나머지는 ${sn(s.rem)}이다.`
      });
    }),
    T('synth-axb', 'ax+b로 나눈 몫과 나머지', '①58', (d) => {
      const a = d.pick([2, 3]), b = nz(d, -3, 3), qq = Dsc(nz(d, -3, 3), nz(d, -4, 4), nz(d, -5, 5)), r = d.int(-7, 7), Pp = aAdd(aMul(L(a, b), qq), [Q(r)]);
      if (gcd(a, Math.abs(b)) !== 1 || !nz0(Pp) || !small(Pp, 40)) return null;
      const [c0, c1, c2, c3] = Pp.map((t) => t.p), q2E = `${jn(c3)}/${a}`, q1E = `(${jn(c2)}-${jn(b)}*${q2E})/${a}`, q0E = `(${jn(c1)}-${jn(b)}*${q1E})/${a}`;
      const r0 = Q(-b, a), s = synth(Pp, r0), xb = `${X} ${b < 0 ? MINUS : '+'} ${frac(Math.abs(b), a)}`;
      return quotRem(SYN, qq, r, [q2E, q1E, q0E, `${jn(c0)}-${jn(b)}*${q0E}`], {
        figure: ex(`(${xe(aSrc(Pp))}) <i>÷</i> (${xe(lin(a, b))})`),
        explain: `${xh(lin(a, b))} = ${a}(${nb(xb)})이다. ${X} = ${nj(r0, '으로/로')} 조립제법을 하면 셋째 줄이 ${s.bot.map(sn).join(', ')}이고 나머지가 ${sn(s.rem)}이므로 ${aH(Pp)} = (${nb(xb)})(${aH(aScale(qq, a))}) ${r < 0 ? MINUS : '+'} ${Math.abs(r)} = (${xh(lin(a, b))})(${aH(qq)}) ${r < 0 ? MINUS : '+'} ${Math.abs(r)}이다. 몫은 ${aH(qq)}, 나머지는 ${sn(r)}이다.`
      });
    }),
    T('synth-table', '조립제법 표의 빈칸', '①59', (d) => {
      const p = nz(d, -3, 3), k = d.int(1, 2), c2 = nz(d, -6, 6), c1 = nz(d, -6, 6), c0 = nz(d, -6, 6), Pp = Dsc(k, c2, c1, c0), s = synth(Pp, p);
      if (s.mid.some((v) => v.p === 0) || s.bot.some((v) => v.p === 0) || s.rem.p === 0 || !small(s.mid.concat(s.bot, [s.rem]), 40)) return null;
      const q1E = `${jn(c2)}+${jn(p)}*${jn(k)}`, q0E = `${jn(c1)}+${jn(p)}*(${q1E})`;
      return slots(`다음은 조립제법을 이용하여 ${aJ(Pp, '을/를')} ${xj(lin(1, -p), '으로/로')} 나누었을 때의 몫과 나머지를 구하는 과정이다. ㉠~㉤에 알맞은 수는?`, [['㉠', c2, jn(c2)], ['㉡', c0, jn(c0)], ['㉢', s.mid[1].p, `${jn(p)}*(${q1E})`], ['㉣', k, jn(k)], ['㉤', s.rem.p, `${jn(c0)}+${jn(p)}*(${q0E})`]], {
        figure: synthFig(Pp, p, { t1: '㉠', t3: '㉡', m1: '㉢', b0: '㉣', r: '㉤' }),
        explain: `첫째 줄은 나뉘는 식의 계수 ${s.top.map(sn).join(', ')}이므로 ㉠ = ${sn(c2)}, ㉡ = ${sn(c0)}이다. 셋째 줄의 첫 수는 최고차항의 계수를 그대로 내려 ㉣ = ${k}이고, ㉢ = ${sn(p)} × ${pv(s.bot[1])} = ${sn(s.mid[1])}, ㉤ = ${sn(c0)}${plusN(s.mid[2].p)} = ${sn(s.rem)}이다.`
      });
    }),
    T('synth-repeat', '조립제법을 거듭해 (x−p)의 거듭제곱 꼴로', '①60', (d) => {
      const p = nz(d, -2, 2), k = d.int(1, 3), Pp = Dsc(k, nz(d, -5, 5), nz(d, -5, 5), nz(d, -6, 6)), s1 = synth(Pp, p), Q1 = s1.bot.slice().reverse(), s2 = synth(Q1, p), Q2 = s2.bot.slice().reverse(), s3 = synth(Q2, p);
      const dd = s1.rem.p, cc = s2.rem.p, bb = s3.rem.p;
      if ([bb, cc, dd].some((v) => v === 0) || !small(s1.mid.concat(s2.mid, s3.mid, s1.bot, s2.bot), 60)) return null;
      const c1 = Pp[1].p, c2 = Pp[2].p;
      const tab = (s) => synthTab(sn(p), s.top.map(sn), s.mid.map(sn), s.bot.map(sn), sn(s.rem), `조립제법: 나누는 수 ${plainN(p)}. 첫째 줄 ${s.top.map(plainN).join(', ')}. 둘째 줄 ${s.mid.map(plainN).join(', ')}. 셋째 줄 ${s.bot.map(plainN).join(', ')}, 나머지 ${plainN(s.rem)}.`);
      const xp = xh(lin(1, -p));
      return slots(`다음은 다항식 ${V('A')} = ${aH(Pp)}에 조립제법을 세 번 거듭 쓴 것이다. ${V('A')}를 ${nb(`${va}(${xp})${sup(3)} + ${vb}(${xp})${sup(2)} + ${vc}(${xp}) + ${V('d')}`)}의 꼴로 나타낼 때, 상수 ${va}, ${vb}, ${vc}, ${V('d')}의 값은?`, [[eqL('a'), k, jn(k)], [eqL('b'), bb, `3*${jn(k)}*${jn(p)}+${jn(c2)}`], [eqL('c'), cc, `3*${jn(k)}*${jn(p)}**2+2*${jn(c2)}*${jn(p)}+${jn(c1)}`], [eqL('d'), dd, plugJ(Pp, p)]], {
        figure: lines([tab(s1), tab(s2), tab(s3)]),
        explain: `첫째 조립제법에서 ${V('A')} = (${xp})(${aH(Q1)})${plusN(dd)}, 둘째에서 ${aH(Q1)} = (${xp})(${aH(Q2)})${plusN(cc)}, 셋째에서 ${aH(Q2)} = ${k === 1 ? '' : k}(${xp})${plusN(bb)}이다. 차례로 넣으면 ${va} = ${k}, ${vb} = ${sn(bb)}, ${vc} = ${sn(cc)}, ${V('d')} = ${sn(dd)}이다(마지막 몫과 나머지를 거꾸로 읽는다).`
      });
    }),
    T('synth-twice', '몫을 다시 나눈 나머지', '①61', (d) => {
      const [p, q] = d.shuffle(range(-3, 3).filter((v) => v !== 0)).slice(0, 2), Pp = Dsc(1, nz(d, -4, 4), nz(d, -5, 5), nz(d, -6, 6)), s = synth(Pp, p), qq = s.bot.slice().reverse(), v = aVal(qq, q).p, E = synthE(Pp, p);
      return num(`다항식 ${aJ(Pp, '을/를')} ${xj(lin(1, -p), '으로/로')} 나누었을 때의 몫을 ${QX}라 할 때, ${QX}를 ${xj(lin(1, -q), '으로/로')} 나누었을 때의 나머지는?`, v, {
        value: `(${E[0]})*${jn(q)}**2+(${E[1]})*${jn(q)}+(${E[2]})`,
        explain: `조립제법으로 나누면 몫은 ${QX} = ${aH(qq)}이다. 나머지정리에 의하여 구하는 나머지는 ${at('Q', q)} = ${plugH(qq, q)} = ${sn(v)}이다.`
      });
    })
  ];
  B.kit.m1012 = {
    UNIT, S1, S2, NOTE1, T, H, seal, retry, sn, jn, sh, xm, sgv, nj, pv, cv, plusN, plusS, X, PX, QX, RX, at, va, vb, vc, vk, eqL, HAN, range,
    parse, Xp, term, keyOf, pAdd, pNeg, pSub, pMul, pPow, valX, xv, same, letters, ordered, varH, ph, pt, srcOf, htmlX, xh, xe, xex, eqx, ej, xj, pn, lin,
    Dsc, trimA, aAdd, aScale, aSub, aMul, aProd, aVal, aDeg, L, aDiv, aSrc, aH, aJ, intsA, nz0, small, ival, plugH, plugJ, synth, synthTab, synthFig, synthE, plainN,
    num, numU, slots, linQ, polyQ, quotRem, facAns, facPoly, XF, pickQ, comboQ, stripH
  };

  B.addUnit({
    id: '10-1-2', grade: 10, semester: 1, no: 2, title: '나머지정리와 인수분해', version: 1,
    groups: [
      { id: 'ident', title: '항등식과 미정계수법', standard: S1, types: identTypes },
      { id: 'remain', title: '나머지정리', standard: S1, types: remTypes },
      { id: 'factorthm', title: '인수정리', standard: S1, types: fthmTypes },
      { id: 'synth', title: '조립제법', standard: S1, types: synthTypes }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
