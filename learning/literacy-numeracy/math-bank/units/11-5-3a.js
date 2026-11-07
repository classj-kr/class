// 미적분Ⅱ Ⅱ-1 여러 가지 함수의 미분 — 단원 틀·도구와 앞쪽 묶음(지수함수와 로그함수의 극한, 무리수 e, 자연로그와 기본 극한, 지수함수와 로그함수의 도함수).
// 수집해 둔 천재 T셀파 미적분Ⅱ(홍진곤, 2022 개정)의 교과서·평가 자료에서 뽑은 문제 꼴 목록(기본꼴_1: 57꼴, 심화 문서 없음)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/11-5-3/싣기_대조표.md 에 있다.
// (삼각함수의 덧셈정리, 삼각함수의 극한, 사인함수와 코사인함수의 도함수는 11-5-3b.js 에, 실력 문항은 11-5-3c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번. 영역은 미분법. 성취기준은 12미적Ⅱ-02-01(지수함수와 로그함수의 극한과 미분), 02-02(삼각함수의 덧셈정리),
// 02-03(삼각함수의 극한, 사인함수와 코사인함수의 미분). 고2·3 선택 과목은 grade 11, semester 자리에 과목 번호(5 미적분Ⅱ)를 둔다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(식·극한식·조건·도형), 묻는 것(극한값·도함수·미분계수·상수·고르기), 극한식의 꼴(x → 0에서 e의 정의,
//    x → ∞, x → a로 옮기기, ln(1 + x)/x·(eˣ − 1)/x·sin x/x, 1 − cos x, 미분계수의 정의)이 다르면 따로 싣는다. 수만 바꾼 유형은 만들지 않는다.
//  - 사용자가 정한 대로 내신 대비이며 수학 실력에 필요한 꼴은 다 싣는다. 교육과정의 「도함수를 구하는 데 필요한 정도로 간단히 다룬다」
//    「지나치게 복잡한 계산을 포함하는 문제는 다루지 않는다」는 정도의 줄이라 빼는 까닭으로 쓰지 않았다(이 영역에 내용을 못 박은 「다루지 않는다」는 없다).
//    실력은 ① 뜻을 정확히 대야 풀리는 함정 문제 ② 세 단계 넘게 잇는 문제만 두었다. 두 단계 잇기·거꾸로 한 번 구하기는 기본이다.
//  - 원문 풀이가 합성함수의 미분(11-5-4 「여러 가지 미분법」)을 쓰는 꼴(①18·①28·①51·①56)은 이 단원의 극한과 곱의 미분만으로 푸는 풀이를 해설에 적어 실었다.
//    tan x의 도함수(몫의 미분법)와 이계도함수는 11-5-4·11-5-5 의 일이라 쓰지 않는다.
//  - 답: 정수·분수는 qAns(정수 칸, 분수는 분자·분모 칸 — 한 유형 안에서는 늘 정수이거나 늘 분수가 되게 수를 고른다), 값 둘은 식 속 칸(inline).
//    e·π·근호·ln 이 섞인 값과 도함수(식)는 고르기로 받는다(칸의 모양이 답을 흘리지 않게). 음수가 될 수 있는 수 칸에는 모두 부호 단추를 단다(길이만 뺀다).
//    원문의 「a + b」처럼 따로 구한 값을 뜻 없이 묶은 꼴은 값을 칸마다 받는다.
//  - 고르기의 참·거짓은 손으로 적지 않는다: 극한값·미분계수는 보기마다 값을 셈해 정답 값과 견주고, 도함수 고르기는 주어진 함수를 수치로 미분한 값과
//    보기의 식을 몇 점에서 견주어 가린다. 수 칸의 근거는 facts.value·calc 이고, 글에 숫자로 없는 수는 seal 이 facts.unseen 에 밝힌다.
//  - 원문의 오식은 바로잡았다: 중단원 평가 1⑴·소단원 평가 01-1⑵(문제에 x → 0으로 찍혔으나 풀이는 x → ∞) — x → ∞로 실었다.
//
// 뺀 것과 까닭(11-5-3b.js, 11-5-3c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 서술형 증명만 있는 것: ①39(배각 공식의 증명 — 수집본에 빈칸 꼴이 없다).
//  - 다른 단원의 일이라 꼴 목록에 세지 않은 것: tan x 의 도함수(대5·교대6, 11-5-4), 이계도함수 f″(0)(대11·교대13, 11-5-4·11-5-5),
//    합성함수의 미분(대6, 중간13), 몫의 미분(중간11), 접선·극값·방정식·속도(11-5-5), 기말고사 전부(Ⅱ-3~Ⅲ).
//  - 읽을거리·활동: 교 70쪽 인구 모형, 75쪽 도형으로 본 덧셈정리, 준비 학습(앞 학년 되짚기).
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, box, C, inline } = B.kit;
  const { MINUS, gcd, Q, qadd, qmul, fl, nb: nb0, V, rt, grp, sqParts } = B.kit.mid;
  const { ms, lim, pw, rtn, lg, ln, trig, jh, hx, qAns, signed, plainOf } = B.kit.hs;
  const fn0 = (name) => B.kit.hs.fn(name);
  const S1 = '12미적Ⅱ-02-01', S2 = '12미적Ⅱ-02-02', S3 = '12미적Ⅱ-02-03';

  // ── 긴 식의 줄 바꿈(11-2-3a.js 와 같은 방법) ──
  // 붙여 쓴 식이 길면 360px 화면에서 문항 밖으로 넘친다. 긴 식은 겉에 드러난 관계 기호(=, <, > …) 앞에서, 그 조각도 길면 괄호 밖의 +, − 앞에서
  // 줄이 갈릴 수 있게 조각마다 붙여 둔다. 글자와 빈칸은 그대로라 글로 읽은 식과 토씨는 바뀌지 않는다.
  const NBO = '<span style="white-space:nowrap">';
  const plainLen = (h) => String(h).replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<span class="mb-sr">[^<]*<\/span>/g, '').replace(/<[^>]*>/g, '').replace(/&[a-z]+;/g, '<').length;
  const cutAt = (h, marks) => {
    const parts = [];
    let depth = 0, last = 0;
    for (let i = 0; i < h.length;) {
      if (h[i] === '<') {
        const j = h.indexOf('>', i), t = h.slice(i, j + 1);
        if (t[1] === '/') depth -= 1; else if (!/\/>$/.test(t) && !/^<(br|img|hr|input|wbr)\b/i.test(t)) depth += 1;
        i = j + 1; continue;
      }
      if ('({['.includes(h[i])) depth += 1; else if (')}]'.includes(h[i])) depth -= 1;
      const m = depth === 0 && i > last ? marks.find((s) => h.startsWith(s, i) || h.startsWith(' ' + NBO + s.slice(1), i)) : null;
      if (m) { parts.push(h.slice(last, i)); last = i + 1; i += 1; continue; }
      i += 1;
    }
    parts.push(h.slice(last));
    return parts;
  };
  const REL_MARKS = [' = ', ' &lt; ', ' &gt; ', ' ≤ ', ' ≥ '], OP_MARKS = [' + ', ' ' + MINUS + ' '];
  const nb = (h) => {
    const s = String(h);
    if (plainLen(s) <= 20) return nb0(s);
    const pieces = cutAt(s, REL_MARKS).flatMap((p) => (plainLen(p) > 24 ? cutAt(p, OP_MARKS) : [p]));
    return pieces.length < 2 ? nb0(s) : pieces.map(nb0).join(' ');
  };

  // ── 검사 근거 마무리 ──
  const stripH = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  function visibleNumbers(item) {
    const seen = stripH([item.text, item.figure || ''].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, ' $1 ').replace(/<table[^>]*aria-label="([^"]*)"[^>]*>/g, ' $1 | '));
    return new Set((seen.match(/\d+/g) || []).concat(seen.match(/\d+\.\d+/g) || [], seen.replace(/(\d) (?=\d)/g, '$1').match(/\d+/g) || []));
  }
  // 다시 셈하는 식의 수 가운데 글에 보이지 않는 수를 facts.unseen 에 밝힌다. 0과 1과 o.derived 로 밝히기로 한 수만 된다(아니면 식을 잘못 적은 것이라 오류를 낸다).
  function seal(item) {
    const f = item.facts || {};
    if (f.calc) f.calc = f.calc.map(([t, i]) => [`(${t})+0`, i]);
    if (f.value !== undefined) f.value = `(${f.value})+0`;
    const derived = new Set((f.derived || []).map(Number).concat([0, 1])), shown = visibleNumbers(item), out = new Set(f.unseen || []);
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
  const srcOf = (ref) => '수집본 기본 자료(' + ref + ')';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: srcOf(ref), make: retry(make) }, more || {});
  const HT = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: srcOf(ref), make: retry(make) }, more || {});

  // ── 글 ──
  const X = V('x'), Tt = V('t'), Hh = V('h'), Av = V('a'), Bv = V('b'), Kv = V('k'), Ee = V('e');
  const sT = signed;                                                           // 화면에 적는 정수(음수는 −)
  const pp = (n) => (n < 0 ? '(' + sT(n) + ')' : String(n));                   // 곱하는 자리의 정수: (−3)
  const jn = (n) => (n < 0 ? '(' + n + ')' : String(n));                       // 검사 식에 적는 정수
  const qT = (q) => (q.q === 1 ? sT(q.p) : nb((q.p < 0 ? MINUS : '') + frac(Math.abs(q.p), q.q)));   // 유리수의 글
  const qJ = (q) => (q.q === 1 ? jn(q.p) : '(' + q.p + '/' + q.q + ')');      // 유리수의 검사 식
  const cf = (k, h) => (k === 1 ? h : k === -1 ? MINUS + h : sT(k) + h);       // 계수를 붙인 글: 1·−1 은 적지 않는다
  const cond = (s) => nb('(' + ms(s) + ')');                                   // 조각 함수의 조건 (x ≥ 0)
  const fIs = (h, name, v) => nb(ms((name || 'f') + '(' + (v || 'x') + ')') + ' =') + ' ' + h;   // 「f(x) = …」
  const yIs = (h) => nb(ms('y') + ' =') + ' ' + h;
  const lf = (to, body) => hx(lim(to, body));                                  // 극한식을 그림 칸에 따로 놓는다
  const ax = (a, v) => (a === 1 ? '' : a === -1 ? '-' : a) + (v || 'x');       // ms 에 넘길 「3x」「−x」
  const onePlus = (a, v) => '(1 ' + (a < 0 ? '- ' : '+ ') + ax(Math.abs(a), v) + ')';   // ms 글 「(1 + 3x)」「(1 − 4x)」
  // e 의 거듭제곱: eP(Q(3)) → e³, eP(Q(1, 2)) → e 의 1/2 제곱, eP(Q(1)) → e, eP(Q(0)) → 1
  const eP = (q) => (q.p === 0 ? '1' : q.q === 1 ? (q.p === 1 ? Ee : pw('e', q.p)) : pw('e', [q.p, q.q]));
  // k ln p(k 는 유리수): lnK(Q(1, 2), 3) → (ln 3)/2, lnK(Q(-2), 5) → −2 ln 5
  const lnK = (k, p) => {
    const L = ln(p), s = k.p < 0 ? MINUS : '', a = Math.abs(k.p), top = a === 1 ? L : a + ' ' + L;
    return nb(s + (k.q === 1 ? top : frac(top, k.q)));
  };
  // pe + q 꼴(e 가 든 값): eLin(3, 0) → 3e, eLin(1, 2) → e + 2
  const eLin = (p, q) => ms((p === 1 ? '' : p === -1 ? '-' : p) + 'e' + (q === 0 ? '' : q < 0 ? ' - ' + -q : ' + ' + q));

  // ── 답 ──
  // 수 하나: 정수는 수 칸, 분수는 분자·분모 칸. 음수가 될 수 있으면 부호 단추(o.signed === false 일 때만 뗀다).
  const val = (text, v, o) => qAns(text, v, { signed: o.signed !== false, figure: o.figure, explain: o.explain, unit: o.unit,
    facts: Object.assign({ value: o.value }, o.derived ? { derived: o.derived } : {}, o.rule ? { rule: o.rule } : {}) });
  // 식 속 칸 여럿: rows 는 [답, 검사 식, 부호 단추(false 면 뗀다)]. 틀은 「a = {0}, b = {1}」처럼 쉼표로 이어 적는다.
  const slots = (text, tpl, rows, o) => inline(text, tpl.split(', ').map((s, i, all) => grp(s + (i < all.length - 1 ? ',' : ''))).join(' '), rows.map(([a, , sg]) => Object.assign({ answer: a + 0 }, sg === false ? {} : { signed: true })),
    { shown: o.shown, figure: o.figure, explain: o.explain, facts: Object.assign({ calc: rows.map(([, e], i) => [e, i]) }, o.derived ? { derived: o.derived } : {}, o.rule ? { rule: o.rule } : {}) });

  // ── 고르기 ──
  const close = (a, b) => Math.abs(a - b) <= 1e-7 * Math.max(1, Math.abs(a), Math.abs(b));
  const near = (a, b) => Math.abs(a - b) <= 1e-6 * Math.max(1, Math.abs(a), Math.abs(b));
  const nd = (F, x) => { const h = 1e-5 * Math.max(1, Math.abs(x)); return (F(x + h) - F(x - h)) / (2 * h); };   // 수치 미분
  // 값 고르기: right = { h 글, v 값 }, wrongs = [{ h, v }, …]. target 은 정답 값을 따로 셈한 것 — 값이 target 과 같은 보기가 꼭 하나다.
  //  보기는 다섯(o.count 로 틀린 보기 수를 바꾼다). 값이 같거나 글이 같은 보기는 버린다.
  function valQ(d, text, target, right, wrongs, o) {
    const opt = o || {}, want = opt.count || 4;
    if (!close(right.v, target)) throw new Error('정답 보기의 값이 다시 셈한 값과 다르다: ' + stripH(right.h) + ' ' + right.v + ' ≠ ' + target);
    const pool = [];
    for (const w of d.shuffle(wrongs)) {
      if (!Number.isFinite(w.v) || close(w.v, target)) continue;
      if (pool.concat([right]).some((p) => close(p.v, w.v) || stripH(p.h) === stripH(w.h))) continue;
      pool.push(w); if (pool.length === want) break;
    }
    if (pool.length < want) return null;
    const list = d.shuffle([right].concat(pool)), at = list.indexOf(right);
    return C(text, list.map((x) => x.h), at, { figure: opt.figure, explain: opt.explain, facts: Object.assign({ truth: list.map((x) => close(x.v, target)), want: true }, opt.rule ? { rule: opt.rule } : {}) });
  }
  // 도함수 고르기: F 는 주어진 함수, 보기는 { h 글, f 함수 }. 보기의 식을 xs 의 점마다 F 의 수치 미분과 견주어 맞는 것이 꼭 하나다.
  function derivQ(d, text, F, right, wrongs, o) {
    const opt = o || {}, xs = opt.xs || [0.6, 1.4, 2.3], want = xs.map((x) => nd(F, x)), sig = (w) => xs.map((x) => w.f(x));
    const fits = (w) => sig(w).every((v, i) => near(v, want[i]));
    if (!fits(right)) throw new Error('정답 식이 도함수와 다르다: ' + stripH(right.h));
    const pool = [];
    for (const w of d.shuffle(wrongs)) {
      const s = sig(w);
      if (s.some((v) => !Number.isFinite(v)) || fits(w)) continue;
      if (pool.concat([right]).some((p) => stripH(p.h) === stripH(w.h) || sig(p).every((v, i) => near(v, s[i])))) continue;
      pool.push(w); if (pool.length === 4) break;
    }
    if (pool.length < 4) return null;
    const list = d.shuffle([right].concat(pool)), at = list.indexOf(right);
    return C(text, list.map((w) => w.h), at, { figure: opt.figure, explain: opt.explain, facts: Object.assign({ truth: list.map(fits), want: true }, opt.rule ? { rule: opt.rule } : {}) });
  }
  // 조건 고르기: 보기마다 ok 를 코드로 셈해 둔 것. ok 가 꼭 하나다.
  function okQ(d, text, list0, o) {
    const opt = o || {}, list = opt.keep ? list0.slice() : d.shuffle(list0);
    if (list.filter((r) => r.ok).length !== 1) return null;
    if (new Set(list.map((r) => stripH(r.h))).size !== list.length) return null;
    return C(text, list.map((r) => r.h), list.findIndex((r) => r.ok), { figure: opt.figure, explain: opt.explain, facts: Object.assign({ truth: list.map((r) => r.ok), want: true }, opt.rule ? { rule: opt.rule } : {}) });
  }
  // 세 칸을 차례로 나열한 보기(빈칸 채우기): 칸마다 [글, 맞는가] 후보를 받아, 셋 다 맞는 것 하나와 하나·둘이 틀린 묶음을 섞는다.
  function tripleQ(d, text, slotsOf, o) {
    const right = slotsOf.map((c) => c.find((x) => x[1])), out = [right], key = (s) => s.map((x) => stripH(x[0])).join('|'), seen = new Set([key(right)]);
    const cands = [];
    slotsOf.forEach((c, i) => c.filter((x) => !x[1]).forEach((w) => { const s = right.slice(); s[i] = w; cands.push(s); }));
    slotsOf[0].filter((x) => !x[1]).forEach((w0) => slotsOf[1].filter((x) => !x[1]).forEach((w1) => cands.push([w0, w1, right[2]])));
    for (const s of d.shuffle(cands)) { if (out.length === 5) break; if (!seen.has(key(s))) { seen.add(key(s)); out.push(s); } }
    if (out.length < 5) return null;
    const list = d.shuffle(out);
    return okQ(d, text, list.map((s) => ({ h: s.map((x) => x[0]).join(', &nbsp;'), ok: s.every((x) => x[1]) })), Object.assign({ keep: true }, o));
  }

  // ════════════════════════════════════════════════════════════════
  // ── 지수함수와 로그함수의 극한 ──
  const BASES = [Q(2), Q(3), Q(5), Q(6), Q(1, 2), Q(1, 3), Q(2, 3), Q(3, 4), Q(1, 5), Q(3, 2), Q(5, 4)];
  const baseH = (b) => (b.q === 1 ? String(b.p) : '(' + frac(b.p, b.q) + ')');          // 지수함수의 밑(분수는 괄호)
  const powB = (b, e) => pw(b.q === 1 ? String(b.p) : nb('(' + frac(b.p, b.q) + ')'), e);
  const logB = (b, arg) => lg(b.q === 1 ? b.p : frac(b.p, b.q), arg);
  const explim = [
    // n = 0: 지수함수의 x → ∞·x → −∞, n = 1: 로그함수의 x → 0+·x → ∞. 보기는 극한을 말로 적은 다섯 문장(차례는 그대로).
    T('explim-inf', '지수함수·로그함수의 x → ∞, x → −∞, x → 0+ 극한', '①1 ①2', (d, n) => {
      const b = d.pick(BASES), bv = fl(b), big = bv > 1;
      const to = n === 0 ? d.pick(['x→∞', 'x→-∞']) : d.pick(['x→0+', 'x→∞']);
      let key;
      if (n === 0) { const v = bv ** (to === 'x→∞' ? 400 : -400); key = v > 1e30 ? 'inf' : v < 1e-30 ? 'zero' : 'other'; }
      else { const [t1, t2] = to === 'x→∞' ? [1e10, 1e20] : [1e-10, 1e-20], v1 = Math.log(t1) / Math.log(bv), v2 = Math.log(t2) / Math.log(bv); key = v2 > v1 + 5 ? 'inf' : v2 < v1 - 5 ? 'minf' : 'other'; }
      const opts = [['inf', '양의 무한대로 발산한다.'], ['minf', '음의 무한대로 발산한다.'], ['zero', '0에 수렴한다.'], ['one', '1에 수렴한다.'], ['base', (b.q === 1 ? String(b.p) : frac(b.p, b.q)) + '에 수렴한다.']];
      const fx = n === 0 ? powB(b, 'x') : logB(b, 'x');
      const why = n === 0
        ? (big ? `밑 ${jh(baseH(b), '이/가')} 1보다 크므로` : `밑 ${jh(baseH(b), '이/가')} 0과 1 사이에 있으므로`) + (key === 'inf' ? ` ${X}의 값이 ${to === 'x→∞' ? '한없이 커지면' : '음수이면서 그 절댓값이 한없이 커지면'} ${fx}의 값은 한없이 커진다.` : ` ${X}의 값이 ${to === 'x→∞' ? '한없이 커지면' : '음수이면서 그 절댓값이 한없이 커지면'} ${fx}의 값은 0에 한없이 가까워진다.`)
        : (big ? `밑이 1보다 크므로` : `밑이 0과 1 사이에 있으므로`) + ` ${X}의 값이 ${to === 'x→∞' ? '한없이 커지면' : '0보다 크면서 0에 한없이 가까워지면'} ${fx}의 값은 ${key === 'inf' ? '한없이 커진다' : '음수이면서 그 절댓값이 한없이 커진다'}.`;
      return okQ(d, `${lim(to, fx)}에 대한 설명으로 옳은 것은?`, opts.map(([k, h]) => ({ h, ok: k === key })), { keep: true, explain: why });
    }, { count: 2, standard: S1 }),

    // n = 0: 지수함수에 대입(답은 늘 분수), n = 1: 로그함수에 대입(답은 늘 정수)
    T('explim-point', '지수함수·로그함수의 x → a 극한', '①1 ①2', (d, n) => {
      if (n === 0) {
        const b = d.pick(BASES.concat([Q(4), Q(2, 5)])), c = d.pick([-3, -2, -1, 2, 3]), v = c > 0 ? Q(b.p ** c, b.q ** c) : Q(b.q ** -c, b.p ** -c);
        if (v.q === 1 || v.p > 999 || v.q > 999) return null;
        return val(`${lim('x→' + c, powB(b, 'x'))}의 값은?`, v, {
          explain: `지수함수는 실수 전체의 집합에서 연속이므로 ${X}에 ${jh(sT(c), '을/를')} 넣은 값 ${jh(nb(powB(b, sT(c)) + ' = ' + qT(v)), '이/가')} 극한값이다.`,
          value: `(${b.p}/${b.q})**(${c})`, derived: [b.q]
        });
      }
      const b = d.pick([Q(2), Q(3), Q(5), Q(1, 2), Q(1, 3)]), k = d.pick([-3, -2, -1, 2, 3]), c = k > 0 ? Q(b.p ** k, b.q ** k) : Q(b.q ** -k, b.p ** -k);
      if (c.p > 999 || c.q > 999) return null;
      const cH = c.q === 1 ? String(c.p) : frac(c.p, c.q);
      return val(`${lim('x→' + (c.q === 1 ? c.p : c.p + '/' + c.q), logB(b, 'x'))}의 값은?`, k, {
        explain: `로그함수는 양의 실수 전체의 집합에서 연속이므로 극한값은 ${nb(logB(b, cH) + ' = ' + sT(k))}이다(${nb(powB(b, sT(k)) + ' = ' + cH)}).`,
        value: jn(k), derived: [Math.abs(k)]
      });
    }, { count: 2, standard: S1 }),

    T('explim-ratio', '지수식으로 된 분수의 x → ∞ 극한', '①3', (d) => {
      const [a, b] = d.pick([[2, 3], [3, 4], [2, 5], [3, 5], [4, 5], [5, 6]]), s = d.pick([0, 1]);
      const c1 = d.pick([1, 2, 3, -1, -2]), c2 = d.pick([1, 2, 3, -1, -2, -3]), c3 = d.pick([1, 2, -1, -2, 3]), c4 = d.pick([1, -1, 2, -2]);
      const top = c2 * b ** s;
      if (top % c4 !== 0) return null;
      const ans = top / c4, term = (c, base, e) => (c === 1 ? '' : c === -1 ? '-' : c + '*') + base + '^' + e;
      const join = (p, q) => p + (q.startsWith('-') ? ' - ' + q.slice(1) : ' + ' + q);
      const num = join(term(c1, a, 'x'), term(c2, b, s ? '{x+1}' : 'x')), den = join(term(c3, a, 'x'), term(c4, b, 'x'));
      const r = frac(a, b), dv = (c) => (c === 1 ? '' : c === -1 ? MINUS : sT(c));
      return val(`다음 극한값은?`, ans, {
        figure: lf('x→∞', frac(ms(num), ms(den))),
        explain: `분모와 분자를 ${pw(b, 'x')}으로 나누면 (주어진 식) = ${lim('x→∞', frac(nb(dv(c1) + '(' + r + ')' + '<sup>' + X + '</sup> ' + (top < 0 ? MINUS + ' ' + Math.abs(top) : '+ ' + top)), nb(dv(c3) + '(' + r + ')' + '<sup>' + X + '</sup> ' + (c4 < 0 ? MINUS + ' ' + Math.abs(c4) : '+ ' + c4))))}이고 ${nb(lim('x→∞', '(' + r + ')<sup>' + X + '</sup>') + ' = 0')}이므로 극한값은 ${nb(sT(top) + ' ÷ ' + pp(c4) + ' = ' + sT(ans))}이다.`,
        value: s ? `${jn(c2)}*${b}/${jn(c4)}` : `${jn(c2)}/${jn(c4)}`
      });
    }, { standard: S1 }),

    T('explim-logdiff', '로그의 차의 x → ∞ 극한', '①4', (d) => {
      const a = d.pick([2, 3]), k = a === 2 ? d.pick([-2, -1, 1, 2, 3]) : d.pick([-2, -1, 1, 2]);
      let p, q;
      if (k > 0) { q = d.pick([1, 2]); p = q * a ** k; } else { p = d.pick([1, 2]); q = p * a ** -k; }
      const c1 = d.pick([-5, -3, -1, 1, 2, 4]), c2 = q === 1 && d.bool() ? 0 : d.pick([-3, -1, 1, 3, 5]);
      const arg = (m, c) => (c === 0 ? ax(m) : '(' + ax(m) + (c < 0 ? ' - ' + -c : ' + ' + c) + ')');
      const e1 = lg(a, arg(p, c1)), e2 = lg(a, arg(q, c2));
      return val(`${lim('x→∞', '{' + e1 + ' − ' + e2 + '}')}의 값은?`, k, {
        explain: `${nb(e1 + ' − ' + e2 + ' = ' + lg(a, frac(ms(arg(p, c1).replace(/^\(|\)$/g, '')), ms(arg(q, c2).replace(/^\(|\)$/g, '')))))}이고, 진수의 극한은 분모·분자를 ${jh(X, '으로/로')} 나누어 ${qT(Q(p, q))}이다. 로그함수는 연속이므로 극한값은 ${nb(lg(a, qT(Q(p, q))) + ' = ' + sT(k))}이다.`,
        value: jn(k), derived: [Math.abs(k)]
      });
    }, { standard: S1 })
  ];

  // ════════════════════════════════════════════════════════════════
  // ── 무리수 e ──
  const eOpt = (q) => ({ h: eP(q), v: Math.exp(fl(q)) });
  const elim = [
    // (1 + ax)^(b/x) 또는 (1 + ax)^(1/(bx)), x → 0
    T('e-zero', '(1 + ax)^(b/x) 꼴의 극한', '①5', (d) => {
      const a = d.pick([1, 2, 3, 4, 5, 6, -1, -2, -3, -4]), b = d.pick([1, 2, 3]), inner = b !== 1 && d.bool();
      const v = inner ? Q(a, b) : Q(a * b), expo = inner ? [1, b + 'x'] : [b, 'x'];
      const body = pw(ms(onePlus(a)), expo);
      const wr = [Q(a), Q(b), Q(b, a), Q(a + b), Q(-a * b), inner ? Q(a * b) : Q(a, b), Q(1, a * b), Q(-a, b)].map(eOpt).concat([{ h: '1', v: 1 }]);
      return valQ(d, '다음 극한값은?', Math.exp(fl(v)), eOpt(v), wr, {
        figure: lf('x→0', body),
        explain: `${nb(ms(ax(a)) + ' = ' + Tt)}로 놓으면 ${X} → 0일 때 ${Tt} → 0이고, ${nb(body + ' = ' + '{' + pw(ms('(1 + t)'), [1, 't']) + '}' + '<sup>' + qT(v) + '</sup>')}이므로 극한값은 ${eP(v)}이다.`
      });
    }, { standard: S1 }),

    T('e-inf', '(1 + a/x)^(bx) 꼴의 극한', '①6', (d) => {
      const form = d.pick([0, 1]);
      let body, v, how;
      if (form === 0) {
        const a = d.pick([1, 2, 3, 4, -1, -2, -3]), b = d.pick([1, 2, 3]);
        v = Q(a * b); body = pw(nb('(1 ' + (a < 0 ? MINUS : '+') + ' ' + frac(Math.abs(a), X) + ')'), b === 1 ? 'x' : b + 'x');
        how = `${nb(frac(sT(a), X) + ' = ' + frac(1, Tt))}, 곧 ${nb(X + ' = ' + ms(ax(a, 't')))}로 놓으면 ${X} → ∞일 때 ${a > 0 ? Tt + ' → ∞' : Tt + ' → −∞'}이고 (주어진 식) = ${nb('{' + pw(nb('(1 + ' + frac(1, Tt) + ')'), 't') + '}' + '<sup>' + sT(a * b) + '</sup>')}`;
      } else {
        const a = d.pick([2, 3, 4, 5]), b = d.pick([1, 2, 3, 4]);
        if (b % a === 0) return null;
        v = Q(b, a); body = pw(nb('(1 + ' + frac(1, ms(a + 'x')) + ')'), b === 1 ? 'x' : b + 'x');
        how = `${nb(ms(a + 'x') + ' = ' + Tt)}로 놓으면 ${X} → ∞일 때 ${Tt} → ∞이고 (주어진 식) = ${nb('{' + pw(nb('(1 + ' + frac(1, Tt) + ')'), 't') + '}' + '<sup>' + qT(v) + '</sup>')}`;
      }
      const wr = [qmul(v, Q(-1)), Q(v.q, v.p), qadd(v, Q(1)), qmul(v, Q(2)), Q(v.p), Q(1, 2 * v.p), qadd(v, Q(-1))].filter((q) => q.p !== 0).map(eOpt).concat([{ h: '1', v: 1 }, { h: Ee, v: Math.E }]);
      return valQ(d, '다음 극한값은?', Math.exp(fl(v)), eOpt(v), wr, {
        figure: lf('x→∞', body),
        explain: `${how}이므로 극한값은 ${eP(v)}이다.`
      });
    }, { standard: S1 }),

    T('e-shift', 'x → a일 때 e의 정의로 바꾸는 극한', '①7', (d) => {
      const form = d.pick([0, 1, 2]), k = d.pick([1, 2, 3, -1, -2]);
      let to, base, expo, v, sub;
      if (form === 0) { to = 'x→1'; base = 'x'; expo = [k, 'x - 1']; v = Q(k); sub = `${nb(ms('x - 1') + ' = ' + Tt)}로 놓으면 ${nb(X + ' = 1 + ' + Tt)}`; }
      else if (form === 1) { to = 'x→2'; base = '(x - 1)'; expo = [k, 'x - 2']; v = Q(k); sub = `${nb(ms('x - 2') + ' = ' + Tt)}로 놓으면 ${nb(ms('x - 1') + ' = 1 + ' + Tt)}`; }
      else { to = 'x→1'; base = '(2x - 1)'; expo = [k, 'x - 1']; v = Q(2 * k); sub = `${nb(ms('x - 1') + ' = ' + Tt)}로 놓으면 ${nb(ms('2x - 1') + ' = 1 + 2' + Tt)}`; }
      const body = pw(ms(base), expo);
      const wr = [Q(-v.p), Q(1, v.p), Q(2 * v.p), Q(v.p, 2), Q(v.p + 1)].filter((q) => q.p !== 0).map(eOpt).concat([{ h: '1', v: 1 }, { h: '0', v: 0 }, { h: Ee, v: Math.E }]);
      return valQ(d, '다음 극한값은?', Math.exp(fl(v)), eOpt(v), wr, {
        figure: lf(to, body),
        explain: `${sub}이고, ${X} → ${to.slice(-1)}일 때 ${Tt} → 0이므로 (주어진 식) = ${nb(lim('t→0', '{' + pw(ms(form === 2 ? '(1 + 2t)' : '(1 + t)'), [1, form === 2 ? '2t' : 't']) + '}<sup>' + sT(v.p) + '</sup>') + ' = ' + eP(v))}이다.`
      });
    }, { standard: S1 }),

    T('e-prod', '두 인수의 곱의 거듭제곱 극한', '①8', (d) => {
      const a = d.pick([1, 2, 3, 4, 5]), b = d.pick([1, 2, 3, 4, 5, -1, -2]), c = d.pick([1, 2, 3, 4, 5, 6]);
      if (a === b || a + b === 0) return null;
      const v = Q(a + b, c);
      const body = pw(nb('{' + ms(onePlus(a)) + ms(onePlus(b)) + '}'), [1, ax(c)]);
      const wr = [Q(a * b, c), Q((a + b) * c), Q(c, a + b), Q(a + b), Q(a * b), Q(a - b, c), Q(1, c)].filter((q) => q.p !== 0).map(eOpt);
      return valQ(d, '다음 극한값은?', Math.exp(fl(v)), eOpt(v), wr, {
        figure: lf('x→0', body),
        explain: `(주어진 식) = ${nb(pw(ms(onePlus(a)), [1, ax(c)]) + ' × ' + pw(ms(onePlus(b)), [1, ax(c)]))}이고, 두 인수의 극한은 각각 ${eP(Q(a, c))}, ${eP(Q(b, c))}이므로 극한값은 ${nb(eP(Q(a, c)) + ' × ' + eP(Q(b, c)) + ' = ' + eP(v))}이다.`
      });
    }, { standard: S1 })
  ];

  // ════════════════════════════════════════════════════════════════
  // ── 자연로그, ln(1 + x)/x 와 (eˣ − 1)/x 의 극한 ──
  const lnlim = [
    // ln(ⁿ√(eᵖ)) — 답은 늘 분수
    T('ln-value', '자연로그의 값', '①10', (d) => {
      const n = d.pick([2, 3, 4, 5]), p = d.pick([1, 2, 3, 5, 7]), inv = d.bool();
      if (p % n === 0 || p > 2 * n + 1) return null;
      const inner = n === 2 ? rt(eP(Q(p))) : rtn(n, eP(Q(p))), arg = inv ? frac(1, inner) : inner, v = Q(inv ? -p : p, n);
      return val(`${ln(arg)}의 값은?`, v, {
        explain: `${nb(arg + ' = ' + eP(v))}이고 ${ln(Ee)} = 1이므로 ${nb(ln(arg) + ' = ' + qT(v))}이다.`,
        value: `${inv ? '-' : ''}${p}/${n}`, derived: [n]
      });
    }, { standard: S1 }),

    // n = 0: ln(1 + ax)/(bx), n = 1: (e^(ax) − 1)/(bx) — 답은 늘 분수 a/b
    T('ln-basic', 'ln(1 + ax)/(bx), (e^(ax) − 1)/(bx)의 극한', '①11', (d, n) => {
      const a = d.pick([1, 2, 3, 4, 5, 6, 7, -1, -2, -3, -5]), b = d.pick([2, 3, 4, 5, 6]);
      if (a % b === 0) return null;
      const top = n === 0 ? ln(ms(onePlus(a))) : ms('e^{' + ax(a) + '} - 1'), body = frac(top, ms(b + 'x'));
      const base = n === 0 ? frac(ln(ms('(1 + t)')), Tt) : frac(ms('e^t - 1'), Tt);
      return val('다음 극한값은?', Q(a, b), {
        figure: lf('x→0', body),
        explain: `${nb(ms(ax(a)) + ' = ' + Tt)}로 놓으면 ${X} → 0일 때 ${Tt} → 0이므로 (주어진 식) = ${nb(qT(Q(a, b)) + ' × ' + lim('t→0', base) + ' = ' + qT(Q(a, b)) + ' × 1 = ' + qT(Q(a, b)))}이다.`,
        value: `${jn(a)}/${b}`
      });
    }, { count: 2, standard: S1 }),

    T('ln-axlim', '(aˣ − 1)/x = ln a를 쓰는 극한', '①12', (d) => {
      const p = d.pick([2, 3, 5, 7]), form = d.pick([0, 1]);
      let body, k, how;
      if (form === 0) {
        const b = d.pick([1, 2, 3, 4]);
        k = Q(1, b); body = frac(ms(p + '^x - 1'), ms('e^{' + ax(b) + '} - 1'));
        how = `분모·분자를 ${jh(X, '으로/로')} 나누면 (주어진 식) = ${nb(frac(lim('x→0', frac(ms(p + '^x - 1'), X)), lim('x→0', frac(ms('e^{' + ax(b) + '} - 1'), X))) + ' = ' + frac(ln(p), b))}`;
      } else {
        const b = d.pick([2, 3, 4]), c = d.pick([1, 2, 3, 5]);
        if (b === c) return null;
        k = Q(b, c); body = frac(ms(p + '^{' + b + 'x} - 1'), ms(ax(c)));
        how = `${nb(ms(b + 'x') + ' = ' + Tt)}로 놓으면 (주어진 식) = ${nb(frac(b, c) + ' × ' + lim('t→0', frac(ms(p + '^t - 1'), Tt)) + ' = ' + frac(b, c) + ' × ' + ln(p))}`;
      }
      const L = Math.log(p), opt = (q) => ({ h: lnK(q, p), v: fl(q) * L });
      const wr = [opt(Q(k.q, k.p)), opt(Q(1)), opt(Q(-k.p, k.q)), { h: qT(k), v: fl(k) }, { h: qT(Q(k.q, k.p)), v: k.q / k.p }, { h: frac(1, nb(k.p === 1 ? ln(p) : k.p + ' ' + ln(p))), v: 1 / (k.p * L) }, { h: qT(Q(k.p * p, k.q)), v: (k.p * p) / k.q }];
      return valQ(d, '다음 극한값은?', fl(k) * L, opt(k), wr, { figure: lf('x→0', body), explain: `${how}이다.` });
    }, { standard: S1 }),

    // 극한 공식을 구하는 과정의 빈칸. n = 0: (eˣ − 1)/x, n = 1: (pˣ − 1)/x. 빈칸 후보의 맞고 틀림은 코드가 셈한다(칸 ㈎·㈏ 는 t 의 함수로 견주고 ㈐ 는 값으로 견준다).
    T('ln-blank', '극한 공식을 구하는 과정의 빈칸', '①13', (d, n) => {
      const ts = [0.3, -0.2, 0.75], fnOk = (g, want) => ts.every((t) => near(g(t), want(t)));
      if (n === 0) {
        const c1 = [[ms('1 + t'), (t) => 1 + t], [ms('1 - t'), (t) => 1 - t], [ms('t - 1'), (t) => t - 1]].map(([h, g]) => [h, fnOk(g, (t) => 1 + t)]);
        const c2 = [[ln(ms('(1 + t)')), (t) => Math.log(1 + t)], [ln(Tt), (t) => Math.log(t)], [ms('e^{1 + t}'), (t) => Math.exp(1 + t)], [ln(ms('(1 - t)')), (t) => Math.log(1 - t)]]
          .map(([h, g]) => [h, ts.every((t) => { const x = g(t); return Number.isFinite(x) && near(Math.exp(x) - 1, t); })]);
        const lv = 1, c3 = [['1', 1], [Ee, Math.E], ['0', 0]].map(([h, v]) => [h, close(v, lv)]);
        const proof = lines([
          `${nb(ms('e^x - 1') + ' = ' + Tt)}로 놓으면 ${nb(ms('e^x') + ' = ' + box('㈎'))}이므로 ${nb(X + ' = ' + box('㈏'))}이고, ${X} → 0일 때 ${Tt} → 0이므로`,
          hx(lim('x→0', frac(ms('e^x - 1'), X)) + ' = ' + lim('t→0', frac(Tt, box('㈏'))) + ' = ' + lim('t→0', frac(1, frac(box('㈏'), Tt))) + ' = ' + box('㈐'))
        ]);
        return tripleQ(d, `다음은 ${nb(lim('x→0', frac(ms('e^x - 1'), X)))}의 값을 구하는 과정이다. ㈎, ㈏, ㈐에 알맞은 것을 차례로 나열한 것은?`, [c1, c2, c3], {
          figure: proof,
          explain: `${nb(ms('e^x') + ' = 1 + ' + Tt)}에서 ${nb(X + ' = ' + ln(ms('(1 + t)')))}이고, ${nb(lim('t→0', frac(ln(ms('(1 + t)')), Tt)) + ' = 1')}이므로 구하는 값은 1이다.`
        });
      }
      const p = d.pick([2, 3, 5]), L = Math.log(p);
      const c1 = [[lg(p, '(1 + t)'), (t) => Math.log(1 + t) / L], [ln(ms('(1 + t)')), (t) => Math.log(1 + t)], [lg(p, Tt), (t) => Math.log(t) / L], [ms(p + '^{1 + t}'), (t) => p ** (1 + t)]]
        .map(([h, g]) => [h, ts.every((t) => { const x = g(t); return Number.isFinite(x) && near(p ** x - 1, t); })]);
      const c2 = [[lg(p, Ee), 1 / L], [ln(p), L], [lg(p, 1), 0]].map(([h, v]) => [h, close(v, 1 / L)]);
      const c3 = [[ln(p), L], [lg(p, Ee), 1 / L], [String(p), p], ['1', 1]].map(([h, v]) => [h, close(v, L)]);
      const proof = lines([
        `${nb(ms(p + '^x - 1') + ' = ' + Tt)}로 놓으면 ${nb(X + ' = ' + box('㈎'))}이고, ${X} → 0일 때 ${Tt} → 0이므로`,
        hx(lim('x→0', frac(ms(p + '^x - 1'), X)) + ' = ' + lim('t→0', frac(1, frac(box('㈎'), Tt))) + ' = ' + frac(1, box('㈏')) + ' = ' + box('㈐'))
      ]);
      return tripleQ(d, `다음은 ${nb(lim('x→0', frac(ms(p + '^x - 1'), X)))}의 값을 구하는 과정이다. ㈎, ㈏, ㈐에 알맞은 것을 차례로 나열한 것은?`, [c1, c2, c3], {
        figure: proof,
        explain: `${nb(ms(p + '^x') + ' = 1 + ' + Tt)}에서 ${nb(X + ' = ' + lg(p, '(1 + t)'))}이고, ${nb(frac(lg(p, '(1 + t)'), Tt) + ' = ' + lg(p, pw(ms('(1 + t)'), [1, 't'])))} → ${lg(p, Ee)}이므로 구하는 값은 ${nb(frac(1, lg(p, Ee)) + ' = ' + ln(p))}이다.`
      });
    }, { count: 2, standard: S1 }),

    // ln·지수식이 섞인 분수 — 답은 늘 분수
    T('ln-mixed', 'ln·지수식이 섞인 분수의 극한', '①14', (d) => {
      const form = d.pick([0, 1, 2]), a = d.pick([1, 2, 3, 4, 5, -1, -2, -3]), b = d.pick([2, 3, 4, 5, 6]);
      if (a % b === 0) return null;
      const L = ln(ms(onePlus(a))), Eb = ms('e^{' + ax(b) + '} - 1'), Ea = ms('e^{' + ax(a) + '} - 1'), Lb = ln(ms(onePlus(b)));
      const body = form === 0 ? frac(L, Eb) : form === 1 ? frac(Ea, Lb) : frac(L, ms('1 - e^{' + ax(b) + '}'));
      const v = form === 2 ? Q(-a, b) : Q(a, b);
      const parts = form === 0 ? `${frac(L, ms(ax(a)))} × ${frac(ms(ax(b)), Eb)} × ${frac(a, b)}` : form === 1 ? `${frac(Ea, ms(ax(a)))} × ${frac(ms(ax(b)), Lb)} × ${frac(a, b)}` : `${frac(L, ms(ax(a)))} × ${frac(ms(ax(b)), Eb)} × ${nb('(' + MINUS + frac(a, b) + ')')}`.replace(MINUS + frac(a, b), qT(Q(-a, b)));
      return val('다음 극한값은?', v, {
        figure: lf('x→0', body),
        explain: `(주어진 식) = ${lim('x→0', '(' + parts + ')')}이고, 두 분수의 극한은 모두 1이므로 극한값은 ${qT(v)}이다.`,
        value: form === 2 ? `0-${jn(a)}/${b}` : `${jn(a)}/${b}`
      });
    }, { standard: S1 }),

    // n = 0: 극한값으로 a(거꾸로 한 번), n = 1: 분모 → 0에서 a, 다음에 b(두 단계)
    T('ln-coef', '극한값이 주어질 때 미정계수', '①15', (d, n) => {
      if (n === 0) {
        const b = d.pick([2, 3, 4, 5]), a = d.pick([1, 2, 3, 5, 7, -1, -3, -5]), k = Q(a, b), useLn = d.bool();
        if (a % b === 0) return null;
        const top = useLn ? ln(ms('(1 + ax)')) : ms('e^{ax} - 1');
        return val(`다음 등식이 성립하도록 하는 상수 ${Av}의 값은?`, a, {
          figure: hx(lim('x→0', frac(top, ms(b + 'x'))) + ' = ' + qT(k)),
          explain: `${nb(ms('ax') + ' = ' + Tt)}로 놓으면 (좌변) = ${nb(frac(Av, b) + ' × ' + lim('t→0', useLn ? frac(ln(ms('(1 + t)')), Tt) : frac(ms('e^t - 1'), Tt)) + ' = ' + frac(Av, b))}이므로 ${nb(frac(Av, b) + ' = ' + qT(k))}에서 ${nb(ms('a') + ' = ' + sT(a))}이다. (${nb(ms('a') + ' = 0')}이면 좌변이 0이라 맞지 않는다.)`,
          value: `${k.p}*${b}/${k.q}`.replace(/^(-\d+)/, '($1)')
        });
      }
      const p = d.pick([2, 3]), m = d.pick([1, 2]), bb = d.pick([1, 2, 3, 4]), A = p ** m, c = bb * A;
      if (c > 40) return null;
      return slots(`다음 등식이 성립하도록 하는 상수 ${Av}, ${Bv}의 값은? (단, ${nb(ms('b != 0'))})`, `${Av} = {0}, ${Bv} = {1}`, [[A, `${p}**${m}`], [bb, `${c}/${p}**${m}`]], {
        shown: `${Av} = ${A}, ${Bv} = ${bb}`,
        figure: hx(lim('x→0', frac(ms(c + 'x'), ms(p + '^{x+' + m + '} - a'))) + ' = ' + frac(Bv, ln(p))),
        explain: `${X} → 0일 때 분자 → 0이고 0이 아닌 극한값이 있으므로 분모 → 0이어야 한다. ${nb(ms(p + '^' + m + ' - a') + ' = 0')}에서 ${nb(ms('a') + ' = ' + A)}이다. 이때 (좌변) = ${nb(lim('x→0', frac(ms(c + 'x'), ms(A + '(' + p + '^x - 1)'))) + ' = ' + frac(c, A) + ' × ' + frac(1, ln(p)))}이므로 ${nb(ms('b') + ' = ' + bb)}이다.`,
        derived: [p, m]
      });
    }, { count: 2, standard: S1 }),

    // lim ln(1 + ax)/f(x) = k 를 다른 극한으로 옮긴다 — 답은 늘 분수
    T('ln-transfer', '극한 조건을 다른 극한으로 옮기기', '①16', (d) => {
      const a = d.pick([1, 2, 3, 4, 6]), k = d.pick([Q(1, 2), Q(1, 3), Q(1, 6), Q(2, 3), Q(2), Q(3), Q(6), Q(3, 2)]), b = d.pick([2, 3, 4, 5]), form = d.pick([0, 1, 2]);
      const kb = form === 1 ? k : qmul(k, Q(b)), v = Q(a * kb.q, kb.p);
      if (v.q === 1) return null;
      const den = form === 0 ? ms('e^{' + b + 'x} - 1') : form === 1 ? X : ln(ms('(1 + ' + b + 'x)'));
      const pieces = form === 0 ? `${frac(ms('f(x)'), ln(ms(onePlus(a))))} × ${frac(ln(ms(onePlus(a))), ms(ax(a)))} × ${frac(ms(b + 'x'), den)} × ${frac(a, b)}`
        : form === 1 ? `${frac(ms('f(x)'), ln(ms(onePlus(a))))} × ${frac(ln(ms(onePlus(a))), ms(ax(a)))} × ${a}`
          : `${frac(ms('f(x)'), ln(ms(onePlus(a))))} × ${frac(ln(ms(onePlus(a))), ms(ax(a)))} × ${frac(ms(b + 'x'), den)} × ${frac(a, b)}`;
      return val(`연속함수 ${ms('f(x)')}가 ㉠을 만족시킬 때, ㉡의 값은?`, v, {
        figure: lines([B.kit.mid.tag('㉠') + hx(lim('x→0', frac(ln(ms(onePlus(a))), ms('f(x)'))) + ' = ' + qT(k)), B.kit.mid.tag('㉡') + hx(lim('x→0', frac(ms('f(x)'), den)))]),
        explain: `㉠에서 ${nb(lim('x→0', frac(ms('f(x)'), ln(ms(onePlus(a))))) + ' = ' + qT(Q(k.q, k.p)))}이다. (㉡의 식) = ${lim('x→0', '(' + pieces + ')')}이고 가운데 분수들의 극한은 1이므로 극한값은 ${qT(v)}이다.`,
        value: form === 1 ? `${a}/(${k.p}/${k.q})` : `${a}/((${k.p}/${k.q})*${b})`
      });
    }, { standard: S1 })
  ];

  // ════════════════════════════════════════════════════════════════
  // ── 지수함수와 로그함수의 도함수 ──
  const yp = ms("y' = ");
  const ediff = [
    // 정의로 구하는 eˣ 의 미분계수: lim (e^(c+h) − e^c)/(kh) = e^c/k
    T('ed-def', '정의로 구하는 eˣ의 미분계수', '①52', (d) => {
      const c = d.pick([1, 2, 3, -1]), k = d.pick([1, 2, 3]), F = (x) => Math.exp(x);
      const body = frac(ms('e^{' + c + '+h} - ' + (c === 1 ? 'e' : 'e^{' + c + '}')), ms(ax(k, 'h')));
      const over = (h, m) => (m === 1 ? h : frac(h, m)), o = (h, v) => ({ h, v }), eh = eP(Q(c)), target = nd(F, c) / k;
      const r = o(over(eh, k), Math.exp(c) / k);
      const wr = [o(eh, Math.exp(c)), o(over(eP(Q(c - 1)), k), Math.exp(c - 1) / k), o(over(eP(Q(c + 1)), k), Math.exp(c + 1) / k), o(over('1', k), 1 / k), o(k === 1 ? '0' : nb(k + eh), k === 1 ? 0 : k * Math.exp(c)), o(Ee, Math.E), o(over(c - 1 === 0 ? sT(c) : nb(cf(c, eP(Q(c - 1)))), k), (c * Math.exp(c - 1)) / k)];
      return valQ(d, '다음 극한값은?', target, r, wr, {
        figure: lf('h→0', body),
        explain: `분자를 ${jh(eh, '으로/로')} 묶으면 (주어진 식) = ${nb(over(eh, k) + ' × ' + lim('h→0', frac(ms('e^h - 1'), Hh)) + ' = ' + over(eh, k))}이다. 곧 ${nb(ms('y = e^x'))}의 ${nb(ms('x = ' + c))}에서의 미분계수 ${eh}${k === 1 ? '이다' : '의 ' + frac(1, k) + '배이다'}.`
      });
    }, { standard: S1 }),

    // n = 0: c·e^(x+k), n = 1: c·p^(x+k)
    T('ed-exp', 'eˣ·aˣ 꼴 함수의 도함수', '①19', (d, n) => {
      const c = d.pick([1, 2, 3, 4]), k = d.pick([1, 2, -1, -2]), cc = c === 1 ? '' : c, e1 = '{x' + (k < 0 ? '' : '+') + k + '}', em1 = '{x' + (k - 1 < 0 ? '' : k - 1 === 0 ? '' : '+') + (k - 1 === 0 ? '' : k - 1) + '}';
      const xk = 'x ' + (k < 0 ? '- ' + -k : '+ ' + k), o = (s, f) => ({ h: yp + (typeof s === 'string' ? ms(s) : s), f });
      if (n === 0) {
        const F = (x) => c * Math.exp(x + k);
        const right = o(cc + 'e^' + e1, (x) => c * Math.exp(x + k));
        const wr = [o(cc + '(' + xk + ')e^' + em1, (x) => c * (x + k) * Math.exp(x + k - 1)), o(cc + 'e^' + em1, (x) => c * Math.exp(x + k - 1)), o((c * k === 1 ? '' : c * k === -1 ? '-' : c * k) + 'e^' + e1, (x) => c * k * Math.exp(x + k)),
          o(cc + 'e^x', (x) => c * Math.exp(x)), o(cc + '(' + xk + ')e^' + e1, (x) => c * (x + k) * Math.exp(x + k)), o((c + 1) + 'e^' + e1, (x) => (c + 1) * Math.exp(x + k))];
        return derivQ(d, `함수 ${yIs(ms(cc + 'e^' + e1))}의 도함수는?`, F, right, wr, {
          xs: [-0.6, 0.4, 1.3],
          explain: `${nb(ms(cc + 'e^' + e1) + ' = ' + (c === 1 ? '' : c + ' × ') + eP(Q(k)) + ' × ' + ms('e^x'))}이고 ${jh(eP(Q(k)), '은/는')} 상수이며 ${nb('(' + ms('e^x') + ')′ = ' + ms('e^x'))}이므로 ${nb(yp + (c === 1 ? '' : c + ' × ') + eP(Q(k)) + ' × ' + ms('e^x') + ' = ' + ms(cc + 'e^' + e1))}이다.`
        });
      }
      const p = d.pick([2, 3, 5]), F = (x) => c * p ** (x + k), L = Math.log(p), cp = c === 1 ? '' : c + '*';
      const right = o(nb(ms(cp + p + '^' + e1) + ' ' + ln(p)), (x) => c * p ** (x + k) * L);
      const wr = [o(cp + p + '^' + e1, F), o(cc + '(' + xk + ')' + p + '^' + em1, (x) => c * (x + k) * p ** (x + k - 1)), o(frac(ms(cp + p + '^' + e1), ln(p)), (x) => (c * p ** (x + k)) / L),
        o(nb(ms(cp + p + '^' + em1) + ' ' + ln(p)), (x) => c * p ** (x + k - 1) * L), o(nb(ms(cp + p + '^' + e1) + ' ' + ln(ms('(x ' + (k < 0 ? '- ' + -k : '+ ' + k) + ')'))), (x) => c * p ** (x + k) * Math.log(x + k)), o(cc + 'e^' + e1, (x) => c * Math.exp(x + k))];
      return derivQ(d, `함수 ${yIs(ms(cp + p + '^' + e1))}의 도함수는?`, F, right, wr, {
        xs: [2.6, 3.4, 4.3],
        explain: `${nb(ms(cp + p + '^' + e1) + ' = ' + (c === 1 ? '' : c + ' × ') + (k === 1 ? String(p) : pw(p, k)) + ' × ' + ms(p + '^x'))}이고 ${nb('(' + ms(p + '^x') + ')′ = ' + ms(p + '^x') + ' ' + ln(p))}이므로 ${nb(yp + ms(cp + p + '^' + e1) + ' ' + ln(p))}이다.`
      });
    }, { count: 2, standard: S1 }),

    T('ed-expprod', '지수함수를 곱한 함수의 도함수', '①20', (d) => {
      const o = (s, f) => ({ h: yp + (typeof s === 'string' ? ms(s) : s), f });
      if (d.bool()) {
        const m = d.pick([1, 2, 3]), F = (x) => x ** m * Math.exp(x), xm = (e) => (e === 0 ? '' : e === 1 ? 'x' : 'x^' + e);
        const right = o(xm(m - 1) + '(x + ' + m + ')e^x', (x) => (x ** m + m * x ** (m - 1)) * Math.exp(x));
        const wr = [o((m === 1 ? '' : m) + xm(m - 1) + 'e^x', (x) => m * x ** (m - 1) * Math.exp(x)), o(xm(m) + 'e^x', F), o(xm(m - 1) + '(x - ' + m + ')e^x', (x) => (x ** m - m * x ** (m - 1)) * Math.exp(x)),
          o((m === 1 ? '' : m) + xm(m) + 'e^x', (x) => m * x ** m * Math.exp(x)), o(xm(m - 1) + '(x + ' + m + ')e^{x-1}', (x) => (x ** m + m * x ** (m - 1)) * Math.exp(x - 1)), o(xm(m - 1) + '(' + m + 'x + 1)e^x', (x) => x ** (m - 1) * (m * x + 1) * Math.exp(x))];
        return derivQ(d, `함수 ${yIs(ms(xm(m) + 'e^x'))}의 도함수는?`, F, right, wr, {
          explain: `곱의 미분법으로 ${nb(yp + '(' + ms(xm(m)) + ')′' + ms('e^x') + ' + ' + ms(xm(m)) + '(' + ms('e^x') + ')′ = ' + ms((m === 1 ? '' : m) + xm(m - 1) + 'e^x + ' + xm(m) + 'e^x') + ' = ' + ms(xm(m - 1) + '(x + ' + m + ')e^x'))}이다.`
        });
      }
      const p = d.pick([2, 3, 5]), F = (x) => p ** x * Math.exp(x), L = Math.log(p);
      const right = o(nb('(' + ln(p) + ' + 1)' + ms(p + '^x e^x')), (x) => F(x) * (L + 1));
      const wr = [o(nb(ms(p + '^x e^x') + ' ' + ln(p)), (x) => F(x) * L), o(p + '^x e^x', F), o(nb('(' + ln(p) + ' − 1)' + ms(p + '^x e^x')), (x) => F(x) * (L - 1)),
        o('x' + '×' + p + '^{x-1}e^x', (x) => x * p ** (x - 1) * Math.exp(x)), o(nb(ms(p + '^x') + ' ' + ln(p) + ' + ' + ms('e^x')), (x) => p ** x * L + Math.exp(x)), o(nb('(' + ln(p) + ' + 1)' + ms(p + '^{x-1} e^x')), (x) => p ** (x - 1) * Math.exp(x) * (L + 1))];
      return derivQ(d, `함수 ${yIs(ms(p + '^x e^x'))}의 도함수는?`, F, right, wr, {
        explain: `곱의 미분법으로 ${nb(yp + ms(p + '^x') + ' ' + ln(p) + ' × ' + ms('e^x') + ' + ' + ms(p + '^x') + ' × ' + ms('e^x') + ' = (' + ln(p) + ' + 1)' + ms(p + '^x e^x'))}이다.`
      });
    }, { standard: S1 }),

    // n = 0: c·ln kx, n = 1: log_p kx
    T('ed-log', '로그함수의 도함수', '①21', (d, n) => {
      const k = d.pick([2, 3, 4, 5, 7]), o = (s, f) => ({ h: yp + (typeof s === 'string' ? ms(s) : s), f });
      if (n === 0) {
        const c = d.pick([1, 2, 3]), F = (x) => c * Math.log(k * x), fx = (c === 1 ? '' : c) + ' ' + ln(ms(k + 'x'));
        const right = o(frac(c, X), (x) => c / x);
        const wr = [o(frac(c, ms(k + 'x')), (x) => c / (k * x)), o(frac(c * k, X), (x) => (c * k) / x), o(frac(nb((c === 1 ? '' : c + ' ') + ln(k)), X), (x) => (c * Math.log(k)) / x),
          o(frac(1, ms(c * k + 'x')), (x) => 1 / (c * k * x)), o(nb((c === 1 ? '' : c + ' ') + ln(k)), () => c * Math.log(k)), o(frac(1, X), (x) => 1 / x)];
        return derivQ(d, `함수 ${yIs(nb(fx.trim()))}의 도함수는?`, F, right, wr, {
          explain: `${nb((c === 1 ? '' : c) + ln(ms(k + 'x')) + ' = ' + (c === 1 ? '' : c + '(') + ln(k) + ' + ' + ln(X) + (c === 1 ? '' : ')'))}이고 ${jh(ln(k), '은/는')} 상수이므로 ${nb(yp + frac(c, X))}이다.`
        });
      }
      const p = d.pick([2, 3, 5, 7]), useK = d.bool(), L = Math.log(p), F = (x) => Math.log((useK ? k : 1) * x) / L, arg = useK ? ms(k + 'x') : X;
      const right = o(frac(1, nb(X + ' ' + ln(p))), (x) => 1 / (x * L));
      const wr = [o(frac(ln(p), X), (x) => L / x), o(frac(1, nb(ms(p + 'x'))), (x) => 1 / (p * x)), o(frac(1, X), (x) => 1 / x), o(frac(String(k), nb(X + ' ' + ln(p))), (x) => k / (x * L)),
        o(frac(1, nb(ms(k + 'x') + ' ' + ln(p))), (x) => 1 / (k * x * L)), o(frac(String(p), X), (x) => p / x)];
      return derivQ(d, `함수 ${yIs(lg(p, arg))}의 도함수는?`, F, right, wr, {
        explain: `${nb(lg(p, arg) + ' = ' + frac(ln(arg), ln(p)))}${useK ? `이고 ${nb(ln(arg) + ' = ' + ln(k) + ' + ' + ln(X))}이므로` : '이므로'} ${nb(yp + frac(1, ln(p)) + ' × ' + frac(1, X) + ' = ' + frac(1, nb(X + ' ' + ln(p))))}이다.`
      });
    }, { count: 2, standard: S1 }),

    T('ed-logprod', '로그함수를 곱한 함수의 도함수', '①22', (d) => {
      const o = (s, f) => ({ h: yp + (typeof s === 'string' ? ms(s) : s), f });
      if (d.bool()) {
        const m = d.pick([1, 2, 3]), F = (x) => x ** m * Math.log(x), xm = (e) => (e === 0 ? '' : e === 1 ? 'x' : 'x^' + e), mm = m === 1 ? '' : m;
        const right = o(m === 1 ? ms('ln x + 1') : ms(xm(m - 1) + '(' + mm + 'ln x + 1)'), (x) => x ** (m - 1) * (m * Math.log(x) + 1));
        const wr = [o(m === 1 ? frac(1, X) : ms(m === 2 ? '2' : m + 'x'), (x) => m * x ** (m - 2)), o(ms(mm + xm(m - 1) + 'ln x'), (x) => m * x ** (m - 1) * Math.log(x)), o(m === 1 ? '1' : ms(xm(m - 1)), (x) => x ** (m - 1)),
          o(m === 1 ? ms('ln x - 1') : ms(xm(m - 1) + '(' + mm + 'ln x - 1)'), (x) => x ** (m - 1) * (m * Math.log(x) - 1)), o(m === 1 ? ms('x ln x + 1') : ms(xm(m - 1) + '(ln x + ' + m + ')'), (x) => (m === 1 ? x * Math.log(x) + 1 : x ** (m - 1) * (Math.log(x) + m)))];
        return derivQ(d, `함수 ${yIs(ms(xm(m) + 'ln x'))}의 도함수는?`, F, right, wr, {
          explain: `곱의 미분법으로 ${nb(yp + '(' + ms(xm(m)) + ')′' + ln(X) + ' + ' + ms(xm(m)) + '(' + ln(X) + ')′ = ' + ms(mm + xm(m - 1) + 'ln x + ' + xm(m)) + ' × ' + frac(1, X))}이므로 ${nb(yp + (m === 1 ? ms('ln x + 1') : ms(xm(m - 1) + '(' + mm + 'ln x + 1)')))}이다.`
        });
      }
      const p = d.pick([2, 3, 5]), c = d.pick([0, 1, 2, -1, 3]), L = Math.log(p), F = (x) => (x + c) * Math.log(x) / L;
      const lin = c === 0 ? 'x' : '(x ' + (c < 0 ? '- ' + -c : '+ ' + c) + ')', lin0 = lin.replace(/^\(|\)$/g, '');
      const right = o(nb(lg(p, X) + ' + ' + frac(ms(lin0), nb(X + ' ' + ln(p)))), (x) => Math.log(x) / L + (x + c) / (x * L));
      const wr = [o(nb(lg(p, X) + ' + ' + frac(1, nb(X + ' ' + ln(p)))), (x) => Math.log(x) / L + 1 / (x * L)), o(frac(1, nb(X + ' ' + ln(p))), (x) => 1 / (x * L)), o(nb(lg(p, X) + ' + ' + frac(ms(lin0), X)), (x) => Math.log(x) / L + (x + c) / x),
        o(nb(ln(X) + ' + ' + frac(ms(lin0), nb(X + ' ' + ln(p)))), (x) => Math.log(x) + (x + c) / (x * L)), o(nb(lg(p, X) + ' + ' + frac(ms(lin0), ln(p))), (x) => Math.log(x) / L + (x + c) / L)];
      return derivQ(d, `함수 ${yIs(nb(ms(lin) + lg(p, X)))}의 도함수는?`, F, right, wr, {
        explain: `곱의 미분법으로 ${nb(yp + '1 × ' + lg(p, X) + ' + ' + ms(lin) + ' × ' + frac(1, nb(X + ' ' + ln(p))) + ' = ' + lg(p, X) + ' + ' + frac(ms(lin0), nb(X + ' ' + ln(p))))}이다.`
      });
    }, { standard: S1 }),

    // f′(1): 지수·로그가 섞인 곱(e 가 든 값은 고르기)
    T('ed-value', '지수·로그가 섞인 곱의 미분계수', '①23', (d) => {
      const form = d.pick([0, 1, 2]), c = d.pick([1, 2, 3, 4]);
      let F, fx, p, q, how;
      if (form === 0) { F = (x) => Math.exp(x) * (Math.log(x) + c * x); fx = ms('e^x') + '(' + ln(X) + ' + ' + ms(ax(c)) + ')'; p = 2 * c + 1; q = 0; how = `${nb(ms("f'(x)") + ' = ' + ms('e^x') + '(' + ln(X) + ' + ' + ms(ax(c)) + ') + ' + ms('e^x') + '(' + frac(1, X) + ' + ' + c + ')')}`; }
      else if (form === 1) { F = (x) => (Math.exp(x) + c) * Math.log(x); fx = nb(ms('(e^x + ' + c + ')') + ln(X)); p = 1; q = c; how = `${nb(ms("f'(x)") + ' = ' + ms('e^x') + ln(X) + ' + ' + frac(ms('e^x + ' + c), X))}`; }
      else { F = (x) => Math.exp(x) * (Math.log(x) + c * x * x); fx = ms('e^x') + '(' + ln(X) + ' + ' + ms(ax(c, 'x^2')) + ')'; p = 3 * c + 1; q = 0; how = `${nb(ms("f'(x)") + ' = ' + ms('e^x') + '(' + ln(X) + ' + ' + ms(ax(c, 'x^2')) + ') + ' + ms('e^x') + '(' + frac(1, X) + ' + ' + ms(2 * c + 'x') + ')')}`; }
      const target = nd(F, 1), r = { h: eLin(p, q), v: p * Math.E + q };
      const wr = [[p + 1, q], [p - 1, q], [c, 0], [1, c + 1], [2 * c, 0], [1, 2 * c], [p, 1], [c + 1, 0], [1, 0]].map(([a, b]) => ({ h: eLin(a, b), v: a * Math.E + b })).concat([{ h: String(p), v: p }]);
      return valQ(d, `함수 ${fIs(nb(fx))}에 대하여 ${ms("f'(1)")}의 값은?`, target, r, wr, {
        explain: `곱의 미분법으로 ${how}이고 ${nb(ln(1) + ' = 0')}이므로 ${nb(ms("f'(1)") + ' = ' + eLin(p, q))}이다.`
      });
    }, { standard: S1 }),

    T('ed-rate', '지수 모형의 순간변화율', '①24', (d) => {
      const A = d.pick([50, 100, 200, 300]), t0 = d.pick([2, 3, 4]);
      if (d.bool()) {
        const target = nd((t) => A * Math.exp(t), t0), o = (h, v) => ({ h, v });
        const r = o(ms(A + 'e^' + t0), A * Math.exp(t0));
        const wr = [o(ms(A * t0 + 'e^' + (t0 - 1)), A * t0 * Math.exp(t0 - 1)), o(ms(A + 'e^' + (t0 - 1)), A * Math.exp(t0 - 1)), o(ms(A + 'e^' + (t0 + 1)), A * Math.exp(t0 + 1)), o(ms(A * t0 + 'e^' + t0), A * t0 * Math.exp(t0)), o(ms(String(A * t0)), A * t0)];
        return valQ(d, `어느 실험실에서 박테리아 ${A}마리를 배양하기 시작한 지 ${Tt}시간 후의 개체 수를 ${ms('f(t)')}라 하면 ${fIs(ms(A + 'e^t'), 'f', 't')}인 관계가 성립한다고 한다. 배양하기 시작한 지 ${t0}시간 후 개체 수의 순간변화율은?`, target, r, wr, {
          explain: `${nb(ms("f'(t)") + ' = ' + ms(A + 'e^t'))}이므로 ${t0}시간 후의 순간변화율은 ${nb(ms("f'(" + t0 + ')') + ' = ' + ms(A + 'e^' + t0))}이다.`
        });
      }
      const target = nd((t) => A * 2 ** t, t0), o = (h, v) => ({ h, v }), m = A * 2 ** t0;
      const r = o(nb(m + ' ' + ln(2)), m * Math.LN2);
      const wr = [o(String(m), m), o(nb((A * t0 * 2 ** (t0 - 1)) + ''), A * t0 * 2 ** (t0 - 1)), o(frac(m, ln(2)), m / Math.LN2), o(nb(m / 2 + ' ' + ln(2)), (m / 2) * Math.LN2), o(nb(2 * m + ' ' + ln(2)), 2 * m * Math.LN2)];
      return valQ(d, `어느 실험실에서 박테리아 ${A}마리를 배양하기 시작한 지 ${Tt}시간 후의 개체 수를 ${ms('f(t)')}라 하면 ${fIs(ms(A + '*2^t'), 'f', 't')}인 관계가 성립한다고 한다. 배양하기 시작한 지 ${t0}시간 후 개체 수의 순간변화율은?`, target, r, wr, {
        explain: `${nb(ms("f'(t)") + ' = ' + ms(A + '*2^t') + ' ' + ln(2))}이므로 ${t0}시간 후의 순간변화율은 ${nb(ms("f'(" + t0 + ')') + ' = ' + A + ' × ' + pw(2, t0) + ' ' + ln(2) + ' = ' + m + ' ' + ln(2))}이다.`
      });
    }, { standard: S1 }),

    // f(x) = c + A·aˣ 이면 f′(x) = (ln a){f(x) − c}
    T('ed-model', '도함수를 원래 함수로 나타내기', '①25', (d) => {
      const [c, A] = d.pick([[20, 30], [20, 60], [25, 50], [18, 42], [22, 40]]), a = d.pick([Q(1, 2), Q(2, 3), Q(3, 4), Q(4, 5)]), av = fl(a);
      const F = (x) => c + A * av ** x, aH = frac(a.p, a.q), xs = [0.5, 1.5, 3];
      const ratio = xs.map((x) => nd(F, x) / (F(x) - c));
      const target = ratio[0];
      if (!ratio.every((r) => near(r, target))) throw new Error('비가 일정하지 않다');
      const lnA = nb(fn0('ln') + ' ' + aH), o = (h, v) => ({ h, v });
      const r = o(lnA, Math.log(av));
      const wr = [o(aH, av), o(nb(A + ' ' + fn0('ln') + ' ' + aH), A * Math.log(av)), o(frac(1, lnA), 1 / Math.log(av)), o(nb(fn0('ln') + ' ' + (a.p === 1 ? String(a.q) : frac(a.q, a.p))), Math.log(1 / av)), o(nb(c + ' ' + fn0('ln') + ' ' + aH), c * Math.log(av)), o(nb(MINUS + aH), -av)];
      return valQ(d, `처음 온도가 ${c + A} °C인 우유를 온도가 ${c} °C로 일정한 방 안에 놓았을 때, ${X}분 후 우유의 온도를 ${ms('f(x)')} °C라 하면 ${jh(fIs(nb(c + ' + ' + A + '(' + aH + ')<sup>' + X + '</sup>')), '이/가')} 성립한다고 한다. ${jh(nb(ms("f'(x)") + ' = ' + Kv + '{' + ms('f(x) - ' + c) + '}'), '을/를')} 만족시키는 상수 ${Kv}의 값은?`, target, r, wr, {
        explain: `${nb(ms("f'(x)") + ' = ' + A + '(' + aH + ')<sup>' + X + '</sup> ' + lnA)}이고 ${nb(A + '(' + aH + ')<sup>' + X + '</sup> = ' + ms('f(x) - ' + c))}이므로 ${nb(ms("f'(x)") + ' = ' + lnA + ' × {' + ms('f(x) - ' + c) + '}')}이다. 따라서 ${nb(ms('k') + ' = ' + lnA)}이고, 온도의 순간변화율은 우유와 방의 온도 차에 비례한다.`
      });
    }, { standard: S1 }),

    // {f(c + mh) − f(c + nh)}/h = (m − n)f′(c). n = 0: f = pˣ(ln 이 든 값 — 고르기), n = 1: f = ax² + bx + k ln x(x = 1, 정수)
    T('ed-limdef', '미분계수의 정의로 바꾸는 극한', '①26', (d, n) => {
      const [m, q] = d.pick([[1, -1], [2, -1], [3, -1], [2, 1], [3, 1], [1, -2], [3, -2]]), arg = (c, k) => (c === 0 ? '' : c) + (k < 0 ? (c === 0 ? '-' : ' - ') : (c === 0 ? '' : ' + ')) + (Math.abs(k) === 1 ? '' : Math.abs(k)) + 'h';
      if (n === 0) {
        const p = d.pick([2, 3, 5]), c = d.pick([0, 1, 2]), L = Math.log(p), k = (m - q) * p ** c;
        const body = frac(ms('f(' + arg(c, m) + ') - f(' + arg(c, q) + ')'), Hh), F = (x) => p ** x, target = (m - q) * nd(F, c);
        const opt = (kk) => ({ h: lnK(Q(kk), p), v: kk * L });
        const wr = [opt((m + q) * p ** c), opt(m * p ** c), { h: String(k), v: k }, { h: frac(k, ln(p)), v: k / L }, opt(k * p), opt((m - q) * (c === 0 ? 2 : c) * p ** Math.max(c - 1, 0)), opt(-k)];
        return valQ(d, `함수 ${fIs(ms(p + '^x'))}에 대하여 다음 극한값은?`, target, opt(k), wr, {
          figure: lf('h→0', body),
          explain: `분자에서 ${jh(ms('f(' + c + ')'), '을/를')} 빼고 더하면 (주어진 식) = ${nb(cf(m, ms("f'(" + c + ')')) + ' − ' + (q < 0 ? '(' + cf(q, ms("f'(" + c + ')')) + ')' : cf(q, ms("f'(" + c + ')'))) + ' = ' + cf(m - q, ms("f'(" + c + ')')))}이다. ${nb(ms("f'(x)") + ' = ' + ms(p + '^x') + ' ' + ln(p))}에서 ${nb(ms("f'(" + c + ')') + ' = ' + lnK(Q(p ** c), p))}이므로 극한값은 ${lnK(Q(k), p)}이다.`
        });
      }
      const a = d.pick([1, 2, -1, 3]), b = d.pick([0, 1, -2, 3, -3]), k = d.pick([1, -1, 2, -2, 3, -3]), f1 = 2 * a + b + k, ans = (m - q) * f1;
      if (f1 === 0) return null;
      const poly0 = [a === 1 ? 'x^2' : a === -1 ? '-x^2' : a + 'x^2', b === 0 ? '' : (b < 0 ? ' - ' : ' + ') + (Math.abs(b) === 1 ? '' : Math.abs(b)) + 'x'].join('');
      const fx = nb(ms(poly0) + ' ' + (k < 0 ? MINUS : '+') + ' ' + (Math.abs(k) === 1 ? '' : Math.abs(k)) + ln(X));
      return val(`함수 ${fIs(fx)}에 대하여 다음 극한값은?`, ans, {
        figure: lf('h→0', frac(ms('f(' + arg(1, m) + ') - f(' + arg(1, q) + ')'), Hh)),
        explain: `분자에서 ${jh(ms('f(1)'), '을/를')} 빼고 더하면 (주어진 식) = ${nb(sT(m - q) + ms("f'(1)"))}이다. ${nb(ms("f'(x)") + ' = ' + ms(ax(2 * a) + (b === 0 ? '' : (b < 0 ? ' - ' + -b : ' + ' + b))) + ' ' + (k < 0 ? MINUS : '+') + ' ' + frac(Math.abs(k), X))}에서 ${nb(ms("f'(1)") + ' = ' + sT(f1))}이므로 극한값은 ${sT(ans)}이다.`,
        value: `(${m}-(${jn(q)}))*(2*${jn(a)}+${jn(b)}+${jn(k)})`, derived: [2]
      });
    }, { count: 2, standard: S1 }),

    // 미분가능하도록 상수 정하기(답은 정수 둘). n = 0: (px + q)eˣ + a 와 x² + bx + c(경계 0), n = 1: ln x + a 와 b·e^(x−1) − c x²(경계 1)
    T('ed-piece', '미분가능하도록 조각 함수의 상수 정하기', '①27', (d, n) => {
      const pieces = (rows) => nb(ms('f(x)') + ' =') + ' ' + B.kit.mid.sys(rows.map(([h, c]) => h + ' ' + c));
      if (n === 0) {
        const p = d.pick([1, 2, 3, -1, -2]), q = d.pick([1, 2, -1, 3, 0]), c = d.pick([-3, -1, 1, 2, 4, 5]), a = c - q, b = p + q;
        if (a === 0 || b === 0) return null;
        const right = (q === 0 ? ms(ax(p)) : ms('(' + ax(p) + (q < 0 ? ' - ' + -q : ' + ' + q) + ')')) + ms('e^x + a');
        return slots(`함수 ${pieces([[right, cond('x >= 0')], [ms('x^2 + bx ' + (c < 0 ? '- ' + -c : '+ ' + c)), cond('x < 0')]])}가 ${nb(ms('x = 0'))}에서 미분가능할 때, 상수 ${Av}, ${Bv}의 값은?`, `${Av} = {0}, ${Bv} = {1}`, [[a, `${jn(c)}-${jn(q)}`], [b, `${jn(p)}+${jn(q)}`]], {
          shown: `${Av} = ${sT(a)}, ${Bv} = ${sT(b)}`,
          explain: `${nb(ms('x = 0'))}에서 연속이므로 ${nb((q === 0 ? '' : sT(q) + ' + ') + Av + ' = ' + sT(c))}에서 ${nb(ms('a') + ' = ' + sT(a))}이다. ${nb(ms('x > 0'))}에서 미분하면 ${nb(ms((p === 1 ? '' : p === -1 ? '-' : p) + 'e^x') + ' + ' + (q === 0 ? ms(ax(p)) : '(' + ms(ax(p) + (q < 0 ? ' - ' + -q : ' + ' + q)) + ')') + ms('e^x'))}이므로 오른쪽 미분계수는 ${sT(p + q)}이고, 왼쪽 미분계수는 ${nb(ms('2x + b'))}에 0을 넣은 ${Bv}이다. 두 값이 같아 ${nb(ms('b') + ' = ' + sT(b))}이다.`
        });
      }
      const c = d.pick([1, 2, 3, 4]), b = 1 + 2 * c, a = 1 + c;
      return slots(`${nb(ms('x > 0'))}에서 정의된 함수 ${pieces([[nb(ln(X) + ' + ' + Av), cond('0 < x < 1')], [ms('be^{x-1} - ' + ax(c, 'x^2')), cond('x >= 1')]])}가 ${nb(ms('x = 1'))}에서 미분가능할 때, 상수 ${Av}, ${Bv}의 값은?`, `${Av} = {0}, ${Bv} = {1}`, [[a, `1+${c}`], [b, `1+2*${c}`]], {
        shown: `${Av} = ${a}, ${Bv} = ${b}`,
        explain: `왼쪽 미분계수는 ${nb(frac(1, X))}에 1을 넣은 1이고, 오른쪽 미분계수는 ${nb(ms('be^{x-1} - ' + 2 * c + 'x'))}에 1을 넣은 ${nb(ms('b - ' + 2 * c))}이므로 ${nb(ms('b') + ' = ' + b)}이다. 연속이므로 ${nb(ln(1) + ' + ' + Av + ' = ' + ms('b - ' + c))}에서 ${nb(ms('a') + ' = ' + a)}이다.`,
        derived: [2]
      });
    }, { count: 2, standard: S1 })
  ];
  // 같은 단원의 b·c 파일이 쓰는 도구
  B.kit.u53x = {
    nb, S1, S2, S3, seal, retry, T, HT, stripH, X, Tt, Hh, Av, Bv, Kv, Ee, sT, pp, jn, qT, qJ, cf, cond, fIs, yIs, lf, ax, onePlus, eP, lnK, eLin, yp,
    val, slots, close, near, nd, valQ, derivQ, okQ, tripleQ, eOpt
  };

  B.addUnit({ id: '11-5-3', grade: 11, semester: 5, no: 3, title: '여러 가지 함수의 미분', version: 1, groups: [
    { id: 'explim', title: '지수함수와 로그함수의 극한', standard: S1, types: explim },
    { id: 'elim', title: '무리수 e', standard: S1, types: elim },
    { id: 'lnlim', title: '자연로그와 기본 극한', standard: S1, types: lnlim },
    { id: 'ediff', title: '지수함수와 로그함수의 도함수', standard: S1, types: ediff },
    { id: 'addf', title: '삼각함수의 덧셈정리', standard: S2, types: [] },
    { id: 'tlim', title: '삼각함수의 극한', standard: S3, types: [] },
    { id: 'tdiff', title: '사인함수와 코사인함수의 도함수', standard: S3, types: [] }
  ] });
})(typeof window !== 'undefined' ? window : globalThis);
