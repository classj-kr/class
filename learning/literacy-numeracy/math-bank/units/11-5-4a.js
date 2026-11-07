// 미적분Ⅱ Ⅱ-2 여러 가지 미분법 — 단원 틀·도구와 앞쪽 묶음(함수의 몫의 미분법, 합성함수의 미분법).
// 수집해 둔 천재 T셀파 미적분Ⅱ(홍진곤, 2022 개정)의 교과서·평가 자료에서 뽑은 문제 꼴 목록(기본꼴_1: 35꼴, 기본꼴_2: 27꼴, 심화 문서 없음)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/11-5-4/싣기_대조표.md 에 있다.
// (매개변수로 나타낸 함수의 미분법, 음함수와 역함수의 미분법, 이계도함수는 11-5-4b.js 에, 실력 문항은 11-5-4c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번. 영역은 미분법. 성취기준은 12미적Ⅱ-02-04(몫), 02-05(합성함수), 02-06(매개변수), 02-07(음함수·역함수).
// 이계도함수는 과제 글의 배우는 내용(「음함수와 역함수의 미분법(이계도함수 포함)」)대로 이 단원에 두고 성취기준은 02-07로 적었다.
// 고2·3 선택 과목은 grade 11, semester 자리에 과목 번호(5 미적분Ⅱ)를 둔다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(식·극한식·함숫값·그림), 묻는 것(도함수·미분계수·상수·점에서의 기울기), 미분하는 꼴(1/g, f/g, 거듭제곱,
//    지수·삼각·로그가 바깥인 합성, 로그 미분법, 매개변수, 음함수, 역함수)이 다르면 따로 싣는다. 수만 바꾼 유형은 만들지 않는다.
//  - 사용자가 정한 대로 내신 대비이며 수학 실력에 필요한 꼴은 다 싣는다. 교육과정의 「매개변수로 나타낸 함수와 음함수는 간단한 것만 다룬다」
//    「지나치게 복잡한 계산을 포함하는 문제는 다루지 않는다」는 정도의 줄이라 빼는 까닭으로 쓰지 않았다.
//  - 11-5-5(도함수의 활용)와의 경계: 이계도함수를 구하는 셈(다항함수 포함)과 매개변수·음함수·역함수로 나타낸 곡선 위의 점에서의 기울기(dy/dx의 값)까지는
//    이 단원이고, 접선의 방정식으로 잇는 것, 오목·볼록·변곡점·극값·최대·최소 판정은 11-5-5에 둔다.
//  - 답: 정수·분수는 qAns(음수가 될 수 있으면 부호 단추), 계수·지수는 식 속 칸(inline), e·π·근호·ln 이 섞인 값과 도함수(식)는 고르기로 받는다.
//    도함수 고르기의 참·거짓은 손으로 적지 않는다 — 보기마다 수의 함수를 지어 두고, 원래 함수를 수치로 미분한 값과 여러 점에서 견주어 코드가 가린다
//    (정답으로 지은 보기가 셈과 어긋나면 오류를 내어 정답 식을 잘못 적은 것을 잡는다). 값 고르기도 원래 함수에서 수치로 다시 셈한 값과 견준다.
//  - 원문의 「a + b」「a − b」「g(1) + g′(1)」처럼 따로 구한 값을 뜻 없이 묶은 꼴은 값을 칸마다 받는다.
//  - 원문 답이 늘 같은 유형(①24 의 12, ②26 의 2)은 수를 바꿔 답이 달라지게 했다. 원문이 어긋난 두 곳은 풀이대로 고쳐 실었다
//    (소단원 평가 01의 1번 f(x) = −4/(3x + 1), 중단원 평가 10번의 x → −1).
//  - 검사 근거: 수 칸은 문제에 적힌 수로 다시 셈하는 식(facts.value·calc)이고, 글에 없는 수(미분해서 생기는 2, 3 …)는 seal 이 facts.unseen 에 밝힌다.
//
// 뺀 것과 까닭(11-5-4b.js, 11-5-4c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 서술형(풀이를 써야만 채점되는 증명·유도, 원문에 빈칸·고르기가 없다): ①11(tan²x + 1 = sec²x 증명), ①12(tan·sec·csc·cot 의 도함수 증명),
//    ①35(xʳ 의 도함수를 e^(r ln x)로 유도), ②24(역함수의 미분법으로 (ln x)′ 유도).
//  - 같은 과목 다른 단원의 일: ①15(두 곡선의 접선이 일치하는 조건 — 11-5-5 「접선의 방정식」).
//  - 겹침: ①1 변형(분모가 거듭제곱인 1/(ax + b)² — ①19 둘째 차례와 같은 일), ①28 의 교대8(ln(eˣ + sin²x) — 같은 일을 하는 중간20 꼴로 실었다).
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, frac, lines, N, M, C, D, inline } = B.kit;
  const { MINUS, gcd, Q, nb: nb0, V, sup, nz, rt, grp } = B.kit.mid;
  const { ms, fn, lim, jh, qAns, plot, signed, rtn, dd } = B.kit.hs;
  const { Board, sv } = B.kit.mgeo;
  const S4 = '12미적Ⅱ-02-04', S5 = '12미적Ⅱ-02-05', S6 = '12미적Ⅱ-02-06', S7 = '12미적Ⅱ-02-07';

  // ── 긴 식의 줄 바꿈(11-2-3a.js 와 같은 방법) ──
  // 붙여 쓴 식(white-space:nowrap)이 길면 360px 화면에서 문항 밖으로 넘친다. 긴 식은 겉에 드러난 관계 기호(=, <, > …) 앞에서,
  // 그 조각도 길면 괄호 밖의 +, − 앞에서 줄이 갈릴 수 있게 조각마다 붙여 둔다. 짧은 식은 통째로 붙여 둔다.
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
  const REL_MARKS = [' = ', ' &lt; ', ' &gt; ', ' ≤ ', ' ≥ '], OP_MARKS = [' + ', ' ' + MINUS + ' ', ' × '];
  const nb = (h) => {
    const s = String(h);
    if (plainLen(s) <= 20) return nb0(s);
    const pieces = cutAt(s, REL_MARKS).flatMap((p) => (plainLen(p) > 24 ? cutAt(p, OP_MARKS) : [p]));
    return pieces.length < 2 ? nb0(s) : pieces.map(nb0).join(' ');
  };

  // ── 검사 근거 마무리(11-2-3a.js 와 같은 방법) ──
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
  const retry = (make) => (d, n) => { for (let i = 0; i < 4000; i += 1) { const item = make(d, n); if (item) return seal(item); } throw new Error('조건에 맞는 문항을 만들지 못했다'); };
  const srcOf = (ref) => '수집본 기본 자료(' + ref + ')';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: srcOf(ref), make: retry(make) }, more || {});
  const HT = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: srcOf(ref), make: retry(make) }, more || {});

  // ── 글 ──
  const X = V('x'), Y = V('y'), Tt = V('t'), Av = V('a'), Bv = V('b');
  const sT = signed;                                                           // 화면에 적는 정수(음수는 −)
  const jn = (n) => (n < 0 ? '(' + n + ')' : String(n));                       // 검사 식에 적는 정수
  // sec·csc·cot 까지 세운 글자로 적는 수식 글(ms 는 sin·cos·tan·log·ln 만 안다)
  const mz = (src) => String(src).split(/(sec|csc|cot)/).map((p, i) => (i % 2 ? fn(p) : p === '' ? '' : ms(p))).join('');
  // ms 원글에 계수 붙이기: co(3, 'x') → '3x', co(1, 'x') → 'x', co(-1, 'x') → '-x'
  const co = (k, s) => (k === 1 ? s : k === -1 ? '-' + s : k + s);
  // 일차식 원글: L(3, -1) → '3x - 1', L(-1, 2) → '2 - x'(앞 계수가 음수이고 상수가 양수이면 상수를 앞에)
  const L = (a, b, v) => { const w = v || 'x'; if (a < 0 && b > 0) return b + ' - ' + co(-a, w); const s = co(a, w); return b === 0 ? s : s + (b < 0 ? ' - ' + (-b) : ' + ' + b); };
  // 「상수 + 항」의 원글: plus('x^2', 3) → 'x^2 + 3', plus('x^2', -1) → 'x^2 - 1'
  const plus = (s, c) => (c === 0 ? s : s + (c < 0 ? ' - ' + (-c) : ' + ' + c));
  // 부호를 앞에 낸 분수: sf(-3, '(2x + 1)^2') → −3/(2x + 1)², sf(2, 'x', 'e^x') → 2eˣ/x
  const sf = (k, den, top) => { const t = top ? (Math.abs(k) === 1 ? top : Math.abs(k) + top) : String(Math.abs(k)); return (k < 0 ? MINUS : '') + frac(mz(t), mz(den)); };
  const qT = (q) => (q.q === 1 ? sT(q.p) : nb((q.p < 0 ? MINUS : '') + frac(Math.abs(q.p), q.q)));   // 유리수의 글
  const qJ = (q) => (q.q === 1 ? jn(q.p) : '(' + q.p + '/' + q.q + ')');                              // 유리수의 검사 식
  const yIs = (h) => nb(ms('y') + ' =') + ' ' + h;
  const fIs = (h, name) => nb(ms((name || 'f') + '(x)') + ' =') + ' ' + h;
  const YP = ms("y'"), PI = (n, dd2) => (dd2 === 1 ? (n === 1 ? 'π' : n === -1 ? MINUS + 'π' : sT(n) + 'π') : (n < 0 ? MINUS : '') + frac((Math.abs(n) === 1 ? '' : Math.abs(n)) + 'π', dd2));
  const NOTE1 = ' <span style="white-space:nowrap">(단, 계수나 지수가 1이면 1을 적는다.)</span>';

  // ── 수치 셈(참·거짓을 코드로 가리는 데 쓴다) ──
  const ND = (f, x) => (f(x + 1e-5) - f(x - 1e-5)) / 2e-5;
  const ND2 = (f, x) => (f(x + 1e-4) - 2 * f(x) + f(x - 1e-4)) / 1e-8;
  const near = (a, b, tol) => Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= (tol || 1e-5) * Math.max(1, Math.abs(a), Math.abs(b));
  const sec = (x) => 1 / Math.cos(x), csc = (x) => 1 / Math.sin(x), cot = (x) => Math.cos(x) / Math.sin(x);
  const E = Math.E, LN = Math.log;

  // ── 답 ──
  // 수 하나: 정수는 수 칸, 분수는 분자·분모 칸. 음수가 될 수 있으면 부호 단추(o.signed === false 일 때만 뗀다).
  const val = (text, v, o) => qAns(text, v, { signed: o.signed !== false, figure: o.figure, explain: o.explain, unit: o.unit,
    facts: Object.assign({ value: o.value }, o.derived ? { derived: o.derived } : {}, o.rule ? { rule: o.rule } : {}) });
  // 식 속 칸 여럿: rows 는 [답, 검사 식, 부호 단추(false 면 뗀다)]. 틀은 「a = {0}, b = {1}」처럼 쉼표로 이어 적는다(쉼표마다 묶는다).
  const slots = (text, tpl, rows, o) => inline(text, tpl.split(', ').map((s, i, all) => grp(s + (i < all.length - 1 ? ',' : ''))).join(' '), rows.map(([a, , sg]) => Object.assign({ answer: a + 0 }, sg === false ? {} : { signed: true })),
    { shown: o.shown, figure: o.figure, explain: o.explain, facts: Object.assign({ calc: rows.map(([, e], i) => [e, i]) }, o.derived ? { derived: o.derived } : {}, o.rule ? { rule: o.rule } : {}) });
  // 고르기: rows 는 [{ h 보기 글, ok 코드가 셈한 참·거짓 }]이고 rows[0] 이 정답으로 지은 보기다(셈과 어긋나면 오류).
  function pickQ(d, text, rows, o) {
    if (!rows[0].ok) throw new Error('정답으로 지은 보기가 셈과 다르다: ' + stripH(rows[0].h) + ' — ' + stripH(text));
    if (rows.filter((r) => r.ok).length !== 1) return null;
    if (new Set(rows.map((r) => stripH(r.h))).size !== rows.length) return null;
    const order = d.shuffle(rows.map((_, i) => i)), at = order.indexOf(0);
    return C(text, order.map((i) => rows[i].h), at, { figure: o.figure, explain: o.explain, facts: Object.assign({ truth: order.map((i) => rows[i].ok), want: true }, o.rule ? { rule: o.rule } : {}) });
  }
  // 도함수 고르기: f 는 원래 함수, rows 는 [{ h, g 보기의 식을 수의 함수로 }]. 표본 점마다 g 와 f 의 수치 미분값(o.order 2 면 이계도함수)을 견준다.
  const derivQ = (d, text, f, rows, pts, o) => pickQ(d, text, rows.map((r) => ({ h: r.h, ok: pts.every((x) => near(r.g(x), o.order === 2 ? ND2(f, x) : ND(f, x), o.order === 2 ? 1e-4 : 1e-5)) })), o);
  // 값 고르기: v 는 원래 함수에서 따로 셈한 값, rows 는 [{ h, v }].
  const valueQ = (d, text, v, rows, o) => pickQ(d, text, rows.map((r) => ({ h: r.h, ok: near(r.v, v, 1e-7) })), o);
  // 틀린 보기 후보에서 값과 글이 서로 다른 것만 n 개 골라 정답 뒤에 붙인다.
  const choose = (d, right, cands, n) => {
    const out = [right];
    for (const c of d.shuffle(cands)) {
      if (out.length > (n || 4)) break;
      if (!Number.isFinite(c.v) || out.some((o) => near(o.v, c.v, 1e-9) || stripH(o.h) === stripH(c.h))) continue;
      out.push(c);
    }
    return out.length > (n || 4) ? out : null;
  };
  // 표본 점: 피해야 할 자리(분모가 0 인 곳 따위) p0 에서 조금씩 떨어진 곳
  const around = (p0) => [p0 + 0.37, p0 + 1.21, p0 + 2.53];
  const TRIG_PTS = [0.31, 0.74, 1.13];

  // ════════════════════════════════════════════════════════════════
  // ── 가. 함수의 몫의 미분법 ──
  // 몫의 미분법 n = 1 의 보기(분자·분모에 지수·삼각·로그가 든 것). 정답과 틀린 보기 넷.
  const FRAC_TEMPLATES = [
    (d) => { const c = d.int(1, 4); return { src: sf(1, plus('e^x', c), 'e^x'), f: (x) => E ** x / (E ** x + c), pts: [-0.6, 0.4, 1.3],
      rows: [[sf(c, '(' + plus('e^x', c) + ')^2', 'e^x'), (x) => c * E ** x / (E ** x + c) ** 2], [sf(-c, '(' + plus('e^x', c) + ')^2', 'e^x'), (x) => -c * E ** x / (E ** x + c) ** 2],
        [sf(c, plus('e^x', c), 'e^x'), (x) => c * E ** x / (E ** x + c)], [sf(1, '(' + plus('e^x', c) + ')^2', 'e^x'), (x) => E ** x / (E ** x + c) ** 2], [sf(1, '(' + plus('e^x', c) + ')^2', 'e^{2x}'), (x) => E ** (2 * x) / (E ** x + c) ** 2]],
      why: `분자를 미분한 ${ms('e^x')}에 분모를 곱하고 분자에 분모를 미분한 ${jh(ms('e^x'), '을/를')} 곱한 것을 빼면 ${ms('e^x(e^x + ' + c + ') - e^x × e^x = ' + c + 'e^x')}이다.` }; },
    (d) => { const c = d.int(1, 4), p0 = LN(c); return { src: sf(1, plus('e^x', -c), 'e^x'), f: (x) => E ** x / (E ** x - c), pts: around(p0),
      rows: [[sf(-c, '(' + plus('e^x', -c) + ')^2', 'e^x'), (x) => -c * E ** x / (E ** x - c) ** 2], [sf(c, '(' + plus('e^x', -c) + ')^2', 'e^x'), (x) => c * E ** x / (E ** x - c) ** 2],
        [sf(-c, plus('e^x', -c), 'e^x'), (x) => -c * E ** x / (E ** x - c)], [sf(-1, '(' + plus('e^x', -c) + ')^2', 'e^x'), (x) => -(E ** x) / (E ** x - c) ** 2], [sf(1, '(' + plus('e^x', -c) + ')^2', 'e^{2x}'), (x) => E ** (2 * x) / (E ** x - c) ** 2]],
      why: `분자는 ${ms('e^x(e^x - ' + c + ') - e^x × e^x = -' + c + 'e^x')}이다.` }; },
    () => ({ src: sf(1, 'x^2', 'sin x'), f: (x) => Math.sin(x) / x ** 2, pts: TRIG_PTS,
      rows: [[sf(1, 'x^3', 'x cos x - 2sin x'), (x) => (x * Math.cos(x) - 2 * Math.sin(x)) / x ** 3], [sf(1, 'x^3', 'x cos x + 2sin x'), (x) => (x * Math.cos(x) + 2 * Math.sin(x)) / x ** 3],
        [sf(1, 'x^3', '2sin x - x cos x'), (x) => (2 * Math.sin(x) - x * Math.cos(x)) / x ** 3], [sf(1, '2x', 'cos x'), (x) => Math.cos(x) / (2 * x)], [sf(1, 'x^4', 'x cos x - 2sin x'), (x) => (x * Math.cos(x) - 2 * Math.sin(x)) / x ** 4]],
      why: `분자는 ${ms('cos x × x^2 - sin x × 2x')}이고 분모는 ${ms('x^4')}이므로 ${ms('x')}로 약분한다.` }),
    () => ({ src: sf(1, 'x', 'cos x'), f: (x) => Math.cos(x) / x, pts: TRIG_PTS,
      rows: [[sf(-1, 'x^2', 'x sin x + cos x'), (x) => -(x * Math.sin(x) + Math.cos(x)) / x ** 2], [sf(1, 'x^2', 'x sin x + cos x'), (x) => (x * Math.sin(x) + Math.cos(x)) / x ** 2],
        [sf(1, 'x^2', 'cos x - x sin x'), (x) => (Math.cos(x) - x * Math.sin(x)) / x ** 2], [mz('-sin x'), (x) => -Math.sin(x)], [sf(-1, 'x', 'x sin x + cos x'), (x) => -(x * Math.sin(x) + Math.cos(x)) / x]],
      why: `분자는 ${ms('-sin x × x - cos x × 1')}이다.` }),
    () => ({ src: sf(1, 'e^x', 'x'), f: (x) => x / E ** x, pts: [-0.7, 0.5, 1.6],
      rows: [[sf(1, 'e^x', '1 - x'), (x) => (1 - x) / E ** x], [sf(1, 'e^x', 'x - 1'), (x) => (x - 1) / E ** x], [sf(1, 'e^x', '1 + x'), (x) => (1 + x) / E ** x],
        [sf(1, 'e^x', '1'), (x) => 1 / E ** x], [sf(1, 'e^{2x}', '1 - x'), (x) => (1 - x) / E ** (2 * x)]],
      why: `분자는 ${ms('1 × e^x - x × e^x')}, 분모는 ${ms('e^{2x}')}이므로 ${jh(ms('e^x'), '으로/로')} 약분한다.` }),
    () => ({ src: sf(1, 'e^x', 'ln x'), f: (x) => LN(x) / E ** x, pts: [0.6, 1.4, 2.7],
      rows: [[sf(1, 'xe^x', '1 - x ln x'), (x) => (1 - x * LN(x)) / (x * E ** x)], [sf(1, 'xe^x', '1 + x ln x'), (x) => (1 + x * LN(x)) / (x * E ** x)], [sf(1, 'xe^x', 'x ln x - 1'), (x) => (x * LN(x) - 1) / (x * E ** x)],
        [sf(1, 'xe^x', '1'), (x) => 1 / (x * E ** x)], [sf(1, 'xe^{2x}', '1 - x ln x'), (x) => (1 - x * LN(x)) / (x * E ** (2 * x))]],
      why: `분자는 ${ms('1/x')} × ${ms('e^x - ln x × e^x')}이고, 분모 ${jh(ms('e^{2x}'), '으로/로')} 나눈 뒤 분자·분모에 ${ms('x')}를 곱하고 ${jh(ms('e^x'), '으로/로')} 약분한다.` })
  ];
  // csc·sec·cot 의 값: 보기에 쓰는 값들(글, 수)
  const R2 = rt(2), R3 = rt(3);
  const TRIG_VALUES = [[1, '1'], [2, '2'], [Math.SQRT2, R2], [Math.sqrt(3), R3], [Math.sqrt(3) / 3, frac(R3, 3)], [2 * Math.sqrt(3) / 3, frac('2' + R3, 3)], [Math.SQRT2 / 2, frac(R2, 2)], [0.5, frac(1, 2)], [Math.sqrt(3) / 2, frac(R3, 2)]];
  const tvText = (v) => { const hit = TRIG_VALUES.find(([w]) => near(w, Math.abs(v), 1e-9)); return hit ? (v < 0 ? MINUS : '') + hit[1] : null; };

  const quot = [
    // n = 0: k/(ax + b), n = 1: k/(ln x + c)
    T('quot-recip', '1/g(x) 꼴의 도함수', '①1', (d, n) => {
      if (n === 0) {
        const a = d.int(2, 5), b = nz(d, -5, 5), k = d.pick([1, 2, 3, -1, -2, -3]), g = L(a, b), sq = '(' + g + ')^2';
        const rows = [[sf(-k * a, sq), (x) => -k * a / (a * x + b) ** 2], [sf(k * a, sq), (x) => k * a / (a * x + b) ** 2], [sf(-k, sq), (x) => -k / (a * x + b) ** 2],
          [sf(-k * a, g), (x) => -k * a / (a * x + b)], [sf(-2 * k * a, '(' + g + ')^3'), (x) => -2 * k * a / (a * x + b) ** 3]];
        return derivQ(d, `함수 ${yIs(sf(k, g))}의 도함수는?`, (x) => k / (a * x + b), rows.map(([h, g2]) => ({ h, g: g2 })), around(-b / a), {
          explain: `${nb(YP + ' = ' + (k < 0 ? '' : MINUS) + Math.abs(k) + ' × ' + frac('(' + ms(g) + ')′', ms(sq)))} = ${sf(-k * a, sq)}이다. 분모를 미분한 ${josa(a, '을/를')} 곱하는 것을 빠뜨리지 않는다.` });
      }
      const c = d.pick([0, 1, 2, -1]), k = d.pick([1, 2, 3]), g = plus('ln x', c), w = '(' + g + ')^2';
      const rows = [[sf(-k, 'x' + w), (x) => -k / (x * (LN(x) + c) ** 2)], [sf(k, 'x' + w), (x) => k / (x * (LN(x) + c) ** 2)], [sf(-k, w), (x) => -k / (LN(x) + c) ** 2],
        [sf(-k, w, 'x'), (x) => -k * x / (LN(x) + c) ** 2], [sf(-k, 'x(' + g + ')'), (x) => -k / (x * (LN(x) + c))]];
      return derivQ(d, `함수 ${yIs(sf(k, g))}의 도함수는?`, (x) => k / (LN(x) + c), rows.map(([h, g2]) => ({ h, g: g2 })), [0.8, 1.5, 2.3].map((v) => E ** (v - c)), {
        explain: `${nb(ms('(' + g + ")' = 1/x"))}이므로 ${nb(YP + ' = ' + MINUS + (k === 1 ? '' : k + ' × ') + frac(ms('1/x'), ms(w)))} = ${sf(-k, 'x' + w)}이다.` });
    }, { count: 2, standard: S4 }),

    // n = 0: 다항식끼리의 몫, n = 1: 지수·삼각·로그가 든 몫
    T('quot-frac', 'f(x)/g(x) 꼴의 도함수', '①2', (d, n) => {
      if (n === 0) {
        const k = d.int(1, 3), c = d.int(1, 6), top = k === 1 ? '-x^2 + ' + c : k + '(-x^2 + ' + c + ')', den = '(x^2 + ' + c + ')^2';
        const rows = [[sf(1, den, top), (x) => k * (c - x * x) / (x * x + c) ** 2], [sf(1, den, k === 1 ? 'x^2 - ' + c : k + '(x^2 - ' + c + ')'), (x) => k * (x * x - c) / (x * x + c) ** 2],
          [sf(1, den, k === 1 ? '-3x^2 + ' + c : k + '(-3x^2 + ' + c + ')'), (x) => k * (c - 3 * x * x) / (x * x + c) ** 2], [sf(1, 'x^2 + ' + c, top), (x) => k * (c - x * x) / (x * x + c)],
          [sf(-2 * k, den, 'x^2'), (x) => -2 * k * x * x / (x * x + c) ** 2]];
        return derivQ(d, `다음 함수를 미분한 것은? ${yIs(sf(1, 'x^2 + ' + c, co(k, 'x')))}`, (x) => k * x / (x * x + c), rows.map(([h, g]) => ({ h, g })), [-1.3, 0.4, 1.7], {
          explain: `${nb(YP + ' = ' + frac(ms((k === 1 ? '' : k) + '(x^2 + ' + c + ') - ' + co(k, 'x') + ' × 2x'), ms(den)))} = ${sf(1, den, top)}이다.` });
      }
      const t = d.pick(FRAC_TEMPLATES)(d);
      return derivQ(d, `다음 함수를 미분한 것은? ${yIs(t.src)}`, t.f, t.rows.map(([h, g]) => ({ h, g })), t.pts, {
        explain: `${nb(ms("(f/g)' = (f'g - fg')/g^2"))}에서 ${t.why} 따라서 ${YP} = ${t.rows[0][0]}이다.` });
    }, { count: 2, standard: S4 }),

    // n = 0: y = x⁻ᵐ, n = 1: y = k/xᵐ — 답은 y′ = (계수)x^(지수)
    T('quot-negpow', 'y = xⁿ(n은 음의 정수)의 도함수', '①3', (d, n) => {
      const m = d.int(2, 6), k = n === 0 ? 1 : d.pick([2, 3, 4, 5, -2, -3, -4]), src = n === 0 ? ms('x^{-' + m + '}') : sf(k, 'x^' + m);
      const c0 = -k * m, e0 = -m - 1;
      return inline(`함수 ${yIs(src)}의 도함수를 구하시오.`, YP + ' = ' + grp('{0}' + X + sup('{1}')), [{ answer: c0, signed: true }, { answer: e0, signed: true }], {
        shown: YP + ' = ' + ms(c0 + 'x^{' + e0 + '}'),
        explain: (n === 0 ? '' : `${nb(yIs(ms(k + 'x^{-' + m + '}')))}이므로 `) + `${nb(ms("(x^n)' = nx^{n-1}"))}에 따라 ${nb(YP + ' = ' + ms(c0 + 'x^{' + e0 + '}'))}이다.`,
        facts: { calc: [[n === 0 ? `-${m}` : `-${jn(k)}*${m}`, 0], [`-${m}-1`, 1]] } });
    }, { count: 2, standard: S4 }),

    // n = 0: xᵖ + k/xᵐ(칸 넷), n = 1: (ax⁴ + bx² + c)/x³ — 항별로 나눈 뒤 미분(고르기)
    T('quot-split', '분수식을 xⁿ의 합으로 고쳐 미분하기', '①4', (d, n) => {
      if (n === 0) {
        const p = d.int(2, 4), m = d.int(2, 5), k = d.pick([2, 3, 4, 5, -2, -3]);
        return inline(`함수 ${yIs(ms('x^' + p) + (k < 0 ? ' − ' : ' + ') + sf(Math.abs(k), 'x^' + m))}의 도함수를 구하시오.${NOTE1}`, YP + ' = ' + grp('{0}' + X + sup('{1}')) + ' ' + grp('{2}' + X + sup('{3}')),
          [{ answer: p, signed: true }, { answer: p - 1, signed: true }, { answer: -k * m, signed: true }, { answer: -m - 1, signed: true }], {
            shown: YP + ' = ' + ms(p + 'x^{' + (p - 1) + '} ' + (k > 0 ? '- ' : '+ ') + Math.abs(k * m) + 'x^{' + (-m - 1) + '}'),
            explain: `${nb(yIs(ms('x^' + p + (k < 0 ? ' - ' : ' + ') + Math.abs(k) + 'x^{-' + m + '}')))}이므로 ${nb(YP + ' = ' + ms(p + 'x^{' + (p - 1) + '} ' + (k > 0 ? '- ' : '+ ') + Math.abs(k * m) + 'x^{' + (-m - 1) + '}'))}이다.`,
            facts: { calc: [[`${p}`, 0], [`${p}-1`, 1], [`-${jn(k)}*${m}`, 2], [`-${m}-1`, 3]] } });
      }
      const a = d.int(1, 3), b = nz(d, -4, 4), c = nz(d, -3, 3);
      const top = co(a, 'x^4') + (b < 0 ? ' - ' : ' + ') + co(Math.abs(b), 'x^2') + (c < 0 ? ' - ' : ' + ') + Math.abs(c);
      const term = (k, e) => (k < 0 ? ' − ' : ' + ') + sf(Math.abs(k), 'x^' + e);
      const rows = [[ms(String(a)) + term(-b, 2) + term(-3 * c, 4), (x) => a - b / x ** 2 - 3 * c / x ** 4], [ms(String(a)) + term(b, 2) + term(3 * c, 4), (x) => a + b / x ** 2 + 3 * c / x ** 4],
        [ms(String(a)) + term(-b, 2) + term(-c, 4), (x) => a - b / x ** 2 - c / x ** 4], [ms(co(a, 'x')) + term(-b, 2) + term(-3 * c, 4), (x) => a * x - b / x ** 2 - 3 * c / x ** 4],
        [ms(String(a)) + term(-b, 3) + term(-3 * c, 4), (x) => a - b / x ** 3 - 3 * c / x ** 4]];
      return derivQ(d, `함수 ${yIs(sf(1, 'x^3', top))}의 도함수는?`, (x) => (a * x ** 4 + b * x * x + c) / x ** 3, rows.map(([h, g]) => ({ h, g })), [0.7, 1.3, 2.2], {
        explain: `항별로 나누면 ${nb(yIs(ms(co(a, 'x') + (b < 0 ? ' - ' : ' + ') + Math.abs(b) + 'x^{-1}' + (c < 0 ? ' - ' : ' + ') + Math.abs(c) + 'x^{-3}')))}이므로 ${YP} = ${rows[0][0]}이다.` });
    }, { count: 2, standard: S4 }),

    T('quot-sum-coef', '음의 거듭제곱 항이 여럿인 함수의 미분계수', '①5', (d) => {
      const m = d.int(4, 7), ks = Array.from({ length: m }, (_, i) => i + 1);
      const terms = ks.map((k) => frac(k, k === 1 ? X : ms('x^' + k)));
      const ans = -ks.reduce((s, k) => s + k * k, 0);
      return val(`함수 ${nb(ms('f(x)') + ' =')} ${terms.join(' + ')}에 대하여 ${ms("f'(1)")}의 값은?`, ans, {
        explain: `${nb(ms('f(x) = x^{-1} + 2x^{-2} + ⋯'))}이므로 ${nb(ms("f'(x) = -x^{-2} - 2^2x^{-3} - ⋯"))}이고 ${nb(ms("f'(1)") + ' = ' + MINUS + '(' + ks.map((k) => k + sup(2)).join(' + ') + ')')} = ${sT(ans)}이다.`,
        value: '-(' + ks.map((k) => k + '*' + k).join('+') + ')' });
    }, { standard: S4 }),

    T('quot-value', '몫인 함수의 미분계수(지수함수)', '①6', (d) => {
      const k = d.pick([1, 2]), a = d.pick([2, 3, 4]), fx = (x) => (E ** x + k * x) / (E ** x - k * x), v = ND(fx, LN(a));
      const ka = co(k, 'ln ' + a), den = '(' + a + ' - ' + ka + ')^2';
      const opt = (top, dn, value) => ({ h: frac(ms(top), ms(dn)), v: value });
      const la = LN(a), A = 2 * k * a;
      const rows = [opt(`${A}(1 - ln ${a})`, den, A * (1 - la) / (a - k * la) ** 2), opt(`${A}(1 + ln ${a})`, den, A * (1 + la) / (a - k * la) ** 2), opt(`${A}(1 - ln ${a})`, '(' + a + ' + ' + ka + ')^2', A * (1 - la) / (a + k * la) ** 2),
        opt(`${2 * k}(1 - ln ${a})`, den, 2 * k * (1 - la) / (a - k * la) ** 2), opt(`${A}(ln ${a} - 1)`, den, A * (la - 1) / (a - k * la) ** 2)];
      return valueQ(d, `함수 ${fIs(frac(ms(plus('e^x', 0) + ' + ' + co(k, 'x')), ms('e^x - ' + co(k, 'x'))))}에 대하여 ${ms("f'(ln " + a + ')')}의 값은?`, v, rows, {
        explain: `${nb(ms("f'(x)") + ' = ' + frac(ms(`(e^x + ${k})(e^x - ${co(k, 'x')}) - (e^x + ${co(k, 'x')})(e^x - ${k})`), ms(`(e^x - ${co(k, 'x')})^2`)))} = ${frac(ms(`${2 * k}e^x(1 - x)`), ms(`(e^x - ${co(k, 'x')})^2`))}이고 ${nb(ms('e^{ln ' + a + '} = ' + a))}이므로 ${ms("f'(ln " + a + ')')} = ${rows[0].h}이다.` });
    }, { standard: S4 }),

    T('quot-abstract', '추상 함수가 든 몫의 미분계수 — 함숫값과 미분계수', '①7', (d) => {
      const p = nz(d, -5, 5), q = nz(d, -5, 5);
      if (p - 2 * q === 0) return null;
      const lin = (A, Bc) => ms((A === 0 ? '' : co(A, 'e')) + (A === 0 ? String(Bc) : Bc === 0 ? '' : Bc < 0 ? ' - ' + (-Bc) : ' + ' + Bc));
      const g = (x) => (q + p * (x - 1)) / (E ** x + 1) ** 2, v = ND(g, 1);
      const opt = (A, Bc, pw) => ({ h: frac(lin(A, Bc), ms('(e + 1)^' + pw)), v: (A * E + Bc) / (E + 1) ** pw });
      const rows = [opt(p - 2 * q, p, 3), opt(p + 2 * q, p, 3), opt(p, p - 2 * q, 3), opt(p - 2 * q, p, 2), opt(p - 2 * q, -p, 3)];
      return valueQ(d, `미분가능한 함수 ${ms('f(x)')}에 대하여 ${nb(ms('f(1) = ' + q))}, ${nb(ms("f'(1) = " + p))}일 때, 함수 ${nb(ms('g(x)') + ' = ' + frac(ms('f(x)'), ms('(e^x + 1)^2')))}에 대하여 ${ms("g'(1)")}의 값은?`, v, rows, {
        explain: `${nb(ms("g'(x)") + ' = ' + frac(ms("f'(x)(e^x + 1)^2 - f(x) × 2(e^x + 1)e^x"), ms('(e^x + 1)^4')))} = ${frac(ms("f'(x)(e^x + 1) - 2e^x f(x)"), ms('(e^x + 1)^3'))}이므로 ${ms("g'(1)")} = ${frac(ms(`${p < 0 ? '(' + sT(p) + ')' : p}(e + 1) - 2e × ${q < 0 ? '(' + sT(q) + ')' : q}`), ms('(e + 1)^3'))} = ${rows[0].h}이다.` });
    }, { standard: S4 }),

    T('quot-abstract-lim', '극한으로 준 함수의 역수의 미분계수', '①8', (d) => {
      const a = d.int(1, 3), c = d.pick([-2, -1, 1, 2]), p = nz(d, -8, 8);
      const ans = Q(-p, c * c);
      return val(`미분가능한 함수 ${ms('f(x)')}가 ${nb(lim('x→' + a, frac(ms(plus('f(x)', -c)), ms('x - ' + a))) + ' = ' + sT(p))}${jh(sT(p), '을/를').slice(sT(p).length)} 만족시킨다. 함수 ${nb(ms('g(x)') + ' = ' + frac(1, ms('f(x)')))}일 때, 곡선 ${nb(ms('y = g(x)'))} 위의 점 ${nb(ms('(' + a + ', g(' + a + '))'))}에서의 접선의 기울기는?`, ans, {
        explain: `${nb(ms('x - ' + a) + ' → 0')}이고 극한값이 있으므로 ${nb(ms('f(' + a + ') = ' + c))}, ${nb(ms("f'(" + a + ') = ' + p))}이다. ${nb(ms("g'(x)") + ' = ' + MINUS + frac(ms("f'(x)"), ms('{f(x)}^2')))}이므로 기울기는 ${nb(ms("g'(" + a + ')') + ' = ' + MINUS + frac(ms(sT(p)), ms('(' + sT(c) + ')^2')))} = ${qT(ans)}이다.`,
        value: `-${jn(p)}/(${jn(c)}*${jn(c)})` });
    }, { standard: S4 }),

    // n = 0: (f(x) − f(a))/(x² − a²), n = 1: (f(a + x) − f(a − x))/x
    T('quot-limit', '극한으로 쓴 미분계수 — 몫인 함수', '①9', (d, n) => {
      if (n === 0) {
        const x0 = d.pick([1, 2]), s = d.pick([2, 3, 4]), p = d.int(1, 3), q = s - p * x0, c = d.pick([-3, -2, -1, 1, 2, 3]), k = c * s;
        if (q === 0) return null;
        const g = L(p, q), ans = Q(-k * p, s * s * 2 * x0);
        return val(`함수 ${fIs(sf(k, g))}에 대하여 ${lim('x→' + x0, frac(ms(plus('f(x)', -c)), ms('x^2 - ' + x0 * x0)))}의 값은?`, ans, {
          explain: `${nb(ms('f(' + x0 + ') = ' + c))}이므로 (주어진 식) = ${nb(lim('x→' + x0, ms('{(f(x) - f(' + x0 + '))/(x - ' + x0 + ')} × 1/(x + ' + x0 + ')')))} = ${nb(frac(ms("f'(" + x0 + ')'), 2 * x0))}이다. ${nb(ms("f'(x)") + ' = ' + sf(-k * p, '(' + g + ')^2'))}에서 ${nb(ms("f'(" + x0 + ')') + ' = ' + qT(Q(-k * p, s * s)))}이므로 답은 ${qT(ans)}이다.`,
          value: `-${jn(k)}*${p}/((${p}*${x0}+${jn(q)})*(${p}*${x0}+${jn(q)}))/(2*${x0})`, derived: [2] });
      }
      const a = d.int(1, 3), s = d.pick([-1, 1, 2, 3, -3]), k = d.pick([1, 2, 3, -1, -2]);
      if (a * a + s === 0 || s - a * a === 0) return null;
      const ans = Q(2 * k * (s - a * a), (a * a + s) ** 2);
      return val(`함수 ${fIs(sf(1, plus('x^2', s), co(k, 'x')))}에 대하여 ${lim('x→0', frac(ms('f(' + a + ' + x) - f(' + a + ' - x)'), X))}의 값은?`, ans, {
        explain: `(주어진 식) = ${nb(lim('x→0', frac(ms('f(' + a + ' + x) - f(' + a + ')'), X)) + ' + ' + lim('x→0', frac(ms('f(' + a + ' - x) - f(' + a + ')'), ms('-x'))))} = ${nb(ms("2f'(" + a + ')'))}이다. ${nb(ms("f'(x)") + ' = ' + frac(ms(k + '(' + plus('-x^2', s) + ')'), ms('(' + plus('x^2', s) + ')^2')))}이므로 답은 ${qT(ans)}이다.`,
        value: `2*${jn(k)}*(${jn(s)}-${a}*${a})/((${a}*${a}+${jn(s)})*(${a}*${a}+${jn(s)}))`, derived: [2] });
    }, { count: 2, standard: S4 }),

    T('quot-recip-trig-value', 'csc·sec·cot 의 값', '①10', (d) => {
      const name = d.pick(['csc', 'sec', 'cot']), ang = d.pick([[1, 6], [1, 4], [1, 3], [2, 3], [3, 4], [5, 6], [-1, 3], [-1, 6], [-1, 4]]);
      const th = ang[0] * Math.PI / ang[1], v = name === 'csc' ? csc(th) : name === 'sec' ? sec(th) : cot(th);
      if (!tvText(v) || (name === 'cot' && Math.abs(ang[1]) === 4 && false)) return null;
      const base = name === 'csc' ? Math.sin(th) : name === 'sec' ? Math.cos(th) : Math.tan(th), bn = { csc: 'sin', sec: 'cos', cot: 'tan' }[name];
      const cands = TRIG_VALUES.flatMap(([w, h]) => [{ h, v: w }, { h: MINUS + h, v: -w }]).filter((c) => !near(c.v, v, 1e-9));
      const recip = cands.filter((c) => near(c.v, base, 1e-9) || near(c.v, -v, 1e-9));
      const rows = choose(d, { h: tvText(v), v }, recip.concat(d.shuffle(cands).slice(0, 6)), 4);
      if (!rows) return null;
      const angH = ang[0] < 0 ? '(' + PI(ang[0], ang[1]) + ')' : PI(ang[0], ang[1]);
      return valueQ(d, `${nb(fn(name) + ' ' + angH)}의 값은?`, v, rows, {
        explain: `${nb(fn(name) + ' ' + angH + ' = ' + frac(1, fn(bn) + ' ' + angH))}이고 ${nb(fn(bn) + ' ' + angH + ' = ' + tvText(base))}이므로 값은 ${tvText(v)}이다.` });
    }, { standard: S4 }),

    // n = 0: 합(a sec x + b tan x, a csc x + b cot x), n = 1: 곱(x sec x, x csc x, x tan x, x cot x, sin x tan x, cos x cot x)
    T('quot-trig-deriv', 'tan·sec·csc·cot 가 든 함수의 도함수', '①13', (d, n) => {
      if (n === 0) {
        const a = d.int(1, 3), b = d.int(1, 3), one = d.bool();
        const rows = one
          ? [[mz(`sec x(${co(a, 'tan x')} + ${co(b, 'sec x')})`), (x) => sec(x) * (a * Math.tan(x) + b * sec(x))], [mz(`sec x(${co(b, 'tan x')} + ${co(a, 'sec x')})`), (x) => sec(x) * (b * Math.tan(x) + a * sec(x))],
            [mz(`sec x(${co(a, 'tan x')} - ${co(b, 'sec x')})`), (x) => sec(x) * (a * Math.tan(x) - b * sec(x))], [mz(`sec x(${co(a, 'tan x')} + ${b})`), (x) => sec(x) * (a * Math.tan(x) + b)],
            [mz(`-sec x(${co(a, 'tan x')} + ${co(b, 'sec x')})`), (x) => -sec(x) * (a * Math.tan(x) + b * sec(x))]]
          : [[mz(`-csc x(${co(a, 'cot x')} + ${co(b, 'csc x')})`), (x) => -csc(x) * (a * cot(x) + b * csc(x))], [mz(`csc x(${co(a, 'cot x')} + ${co(b, 'csc x')})`), (x) => csc(x) * (a * cot(x) + b * csc(x))],
            [mz(`-csc x(${co(b, 'cot x')} + ${co(a, 'csc x')})`), (x) => -csc(x) * (b * cot(x) + a * csc(x))], [mz(`-csc x(${co(a, 'cot x')} - ${co(b, 'csc x')})`), (x) => -csc(x) * (a * cot(x) - b * csc(x))],
            [mz(`-csc x(${co(a, 'cot x')} + ${b})`), (x) => -csc(x) * (a * cot(x) + b)]];
        const src = one ? `${co(a, 'sec x')} + ${co(b, 'tan x')}` : `${co(a, 'csc x')} + ${co(b, 'cot x')}`;
        const f = one ? (x) => a * sec(x) + b * Math.tan(x) : (x) => a * csc(x) + b * cot(x);
        return derivQ(d, `함수 ${yIs(mz(src))}의 도함수는?`, f, rows.map(([h, g]) => ({ h, g })), TRIG_PTS, {
          explain: one ? `${nb(mz("(sec x)' = sec x tan x"))}, ${nb(mz("(tan x)' = sec^2 x"))}이므로 ${nb(YP + ' = ' + mz(`${co(a, 'sec x tan x')} + ${co(b, 'sec^2 x')}`))} = ${rows[0][0]}이다.`
            : `${nb(mz("(csc x)' = -csc x cot x"))}, ${nb(mz("(cot x)' = -csc^2 x"))}이므로 ${nb(YP + ' = ' + mz(`-${co(a, 'csc x cot x')} - ${co(b, 'csc^2 x')}`))} = ${rows[0][0]}이다.` });
      }
      const t = d.pick([
        ['x sec x', (x) => x * sec(x), [['sec x(1 + x tan x)', (x) => sec(x) * (1 + x * Math.tan(x))], ['sec x(1 - x tan x)', (x) => sec(x) * (1 - x * Math.tan(x))], ['sec x tan x', (x) => sec(x) * Math.tan(x)], ['x sec x tan x', (x) => x * sec(x) * Math.tan(x)], ['sec x + x sec^2 x', (x) => sec(x) + x * sec(x) ** 2]], "(sec x)' = sec x tan x"],
        ['x csc x', (x) => x * csc(x), [['csc x(1 - x cot x)', (x) => csc(x) * (1 - x * cot(x))], ['csc x(1 + x cot x)', (x) => csc(x) * (1 + x * cot(x))], ['-csc x cot x', (x) => -csc(x) * cot(x)], ['-x csc x cot x', (x) => -x * csc(x) * cot(x)], ['csc x - x csc^2 x', (x) => csc(x) - x * csc(x) ** 2]], "(csc x)' = -csc x cot x"],
        ['x tan x', (x) => x * Math.tan(x), [['tan x + x sec^2 x', (x) => Math.tan(x) + x * sec(x) ** 2], ['tan x - x sec^2 x', (x) => Math.tan(x) - x * sec(x) ** 2], ['x sec^2 x', (x) => x * sec(x) ** 2], ['tan x + x sec x tan x', (x) => Math.tan(x) + x * sec(x) * Math.tan(x)], ['sec^2 x', (x) => sec(x) ** 2]], "(tan x)' = sec^2 x"],
        ['x cot x', (x) => x * cot(x), [['cot x - x csc^2 x', (x) => cot(x) - x * csc(x) ** 2], ['cot x + x csc^2 x', (x) => cot(x) + x * csc(x) ** 2], ['-x csc^2 x', (x) => -x * csc(x) ** 2], ['cot x - x csc x cot x', (x) => cot(x) - x * csc(x) * cot(x)], ['-csc^2 x', (x) => -(csc(x) ** 2)]], "(cot x)' = -csc^2 x"],
        ['sin x tan x', (x) => Math.sin(x) * Math.tan(x), [['sin x(1 + sec^2 x)', (x) => Math.sin(x) * (1 + sec(x) ** 2)], ['sin x(1 - sec^2 x)', (x) => Math.sin(x) * (1 - sec(x) ** 2)], ['cos x sec^2 x', (x) => Math.cos(x) * sec(x) ** 2], ['cos x(1 + sec^2 x)', (x) => Math.cos(x) * (1 + sec(x) ** 2)], ['sin x sec^2 x', (x) => Math.sin(x) * sec(x) ** 2]], "(tan x)' = sec^2 x"],
        ['cos x cot x', (x) => Math.cos(x) * cot(x), [['-cos x(1 + csc^2 x)', (x) => -Math.cos(x) * (1 + csc(x) ** 2)], ['cos x(1 + csc^2 x)', (x) => Math.cos(x) * (1 + csc(x) ** 2)], ['-cos x(1 - csc^2 x)', (x) => -Math.cos(x) * (1 - csc(x) ** 2)], ['sin x csc^2 x', (x) => Math.sin(x) * csc(x) ** 2], ['-cos x csc^2 x', (x) => -Math.cos(x) * csc(x) ** 2]], "(cot x)' = -csc^2 x"]
      ]);
      return derivQ(d, `다음 함수를 미분한 것은? ${yIs(mz(t[0]))}`, t[1], t[2].map(([h, g]) => ({ h: mz(h), g })), TRIG_PTS, {
        explain: `곱의 미분법과 ${nb(jh(mz(t[3]), '을/를'))} 쓰면 ${YP} = ${mz(t[2][0][0])}이다.` });
    }, { count: 2, standard: S4 }),

    T('quot-tan-coef', 'tan 이 든 함수의 미분계수로 상수 구하기', '①14', (d) => {
      const a = nz(d, -6, 6), k = d.int(1, 3), form = d.pick(['sin', 'cos']);
      const v = form === 'sin' ? Q(a + 8 * k, 2) : Q(-3 * a + 8 * k, 6);
      const at = form === 'sin' ? frac('π', 3) : frac('π', 6);
      return val(`함수 ${fIs(ms('a ' + form + ' x + ' + co(k, 'tan x')))}에 대하여 ${nb(ms("f'") + '(' + at + ') = ' + qT(v))}일 때, 상수 ${Av}의 값은?`, a, {
        explain: form === 'sin'
          ? `${nb(mz("f'(x) = a cos x + " + co(k, 'sec^2 x')))}이고 ${nb(fn('cos') + ' ' + at + ' = ' + frac(1, 2))}, ${nb(mz('sec^2') + ' ' + at + ' = 4')}이므로 ${nb(frac(Av, 2) + ' + ' + 4 * k + ' = ' + qT(v))}에서 ${nb(ms('a = ' + sT(a)))}이다.`
          : `${nb(mz("f'(x) = -a sin x + " + co(k, 'sec^2 x')))}이고 ${nb(fn('sin') + ' ' + at + ' = ' + frac(1, 2))}, ${nb(mz('sec^2') + ' ' + at + ' = ' + frac(4, 3))}이므로 ${nb(MINUS + frac(Av, 2) + ' + ' + qT(Q(4 * k, 3)) + ' = ' + qT(v))}에서 ${nb(ms('a = ' + sT(a)))}이다.`,
        value: form === 'sin' ? `(${qJ(v)}-${k}*4)*2` : `-(${qJ(v)}-${k}*4/3)*2`, derived: [2, 3, 4] });
    }, { standard: S4 }),

    T('quot-surd-coef', '몫의 미분계수가 a + b√2 꼴일 때 유리수 a, b', '①16', (d) => {
      const c = d.int(1, 4), k = d.int(1, 3);
      return slots(`함수 ${fIs(frac(mz(c + ' + ' + co(k, 'sec x')), mz('tan x')))}에 대하여 ${nb(ms("f'") + '(' + frac('π', 4) + ') = ' + ms('a + b') + R2)}일 때, 유리수 ${Av}, ${Bv}의 값을 구하시오.`, `${Av} = {0}, ${Bv} = {1}`,
        [[-2 * c, `-2*${c}`], [-k, `-${k}`]], {
          shown: `${Av} = ${sT(-2 * c)}, ${Bv} = ${sT(-k)}`,
          explain: `${nb(ms("f'(x)") + ' = ' + frac(mz(`${co(k, 'sec x tan x')} × tan x - (${c} + ${co(k, 'sec x')})sec^2 x`), mz('tan^2 x')))}이고 ${nb(fn('tan') + ' ' + frac('π', 4) + ' = 1')}, ${nb(fn('sec') + ' ' + frac('π', 4) + ' = ' + R2)}이므로 ${nb(ms("f'") + '(' + frac('π', 4) + ') = ' + (k === 1 ? '' : k) + R2 + ' − 2(' + c + ' + ' + (k === 1 ? '' : k) + R2 + ') = ' + sT(-2 * c) + ' − ' + (k === 1 ? '' : k) + R2)}이다.`,
          derived: [2] });
    }, { standard: S4 }),

    T('quot-shadow', '그림자 길이의 순간변화율(cot)', '①17', (d) => {
      const h = d.pick([6, 9, 12, 15, 18]), ang = d.pick([[6, 4], [4, 2], [3, Q(4, 3)]]), m = ang[0], c2 = ang[1];
      const ans = typeof c2 === 'number' ? -h * c2 : -h * 4 / 3;
      const b = Board(), S = [20, 118], Bt = [232, 118], Tp = [232, 30];
      b.seg(S, Bt).seg(Bt, Tp).seg(S, Tp, 'cut').corner(Bt, S, Tp).angle(S, 0, 22.5, sv('θ')).beside(S, Bt, sv('y') + ' m', false).beside(Bt, Tp, h + ' m', false);
      const figure = b.svg(`그림: 지면에 수직으로 선 높이 ${h} m인 동상과 그 그림자. 그림자 끝에서 동상 꼭대기를 올려본각이 θ, 그림자의 길이가 y m이다.`);
      return val(`그림과 같이 지면에 수직으로 서 있는 높이 ${h} m인 동상이 있다. 동상의 그림자 끝에서 동상의 꼭대기를 올려본각의 크기를 ${V('θ')}, 그림자의 길이를 ${Y} m라 할 때, ${nb(V('θ') + ' = ' + frac('π', m))}에서 ${Y}의 ${V('θ')}에 대한 순간변화율은? ${nb('(단, 0 &lt; ' + V('θ') + ' &lt; ' + frac('π', 2) + ')')}`, ans, {
        figure,
        explain: `${nb(fn('cot') + ' ' + V('θ') + ' = ' + frac(Y, h))}이므로 ${nb(ms('y = ') + h + mz('cot θ'))}이고 ${nb(frac(V('d') + Y, V('dθ')) + ' = ' + MINUS + h + mz('csc^2 θ'))}이다. ${nb(mz('csc^2') + ' ' + frac('π', m) + ' = ' + qT(Q(typeof c2 === 'number' ? c2 : 4, typeof c2 === 'number' ? 1 : 3)))}이므로 ${sT(ans)}이다.`,
        value: typeof c2 === 'number' ? `-${h}*${c2}` : `-${h}*4/3`, derived: [2, 3, 4] });
    }, { standard: S4 })
  ];

  // ════════════════════════════════════════════════════════════════
  // ── 나. 합성함수의 미분법 ──
  const chain = [
    T('chain-balloon', '일차 관계의 합성 — dy/du × du/dx', '①18', (d) => {
      const p = d.pick([2, 3, 4, 5, 6]), q = d.int(4, 9), c0 = d.int(15, 25);
      if ((p * q) % 10 === 0) return null;
      const pp = p / 10, ans = -Math.round(p * q) / 10;
      return D(`어떤 열기구가 일정한 빠르기로 올라갈 때, ${X}분 후의 고도를 ${V('u')} km, 그 고도의 기온을 ${Y} °C라 하면 ${nb(ms('u = ' + pp + 'x'))}, ${nb(ms('y = ' + c0 + ' - ' + q + 'u'))}인 관계가 성립한다. 합성함수의 미분법으로 구한 ${dd('y', 'x')}의 값은?`, ans, {
        signed: true,
        explain: `${nb(frac(V('dy'), V('du')) + ' = ' + sT(-q))}, ${nb(frac(V('du'), V('dx')) + ' = ' + pp)}이므로 ${nb(dd('y', 'x') + ' = ' + frac(V('dy'), V('du')) + ' × ' + frac(V('du'), V('dx')) + ' = ' + sT(ans))}이다. 1분에 ${Math.abs(ans)} °C씩 내려간다는 뜻이다.`,
        facts: { value: `-${pp}*${q}` } });
    }, { standard: S5 }),

    // n = 0: (ax + b)ᵐ, n = 1: 1/(ax + b)ᵐ, n = 2: 과정의 빈칸, n = 3: (ax² + b)ᵐ
    T('chain-power', '바깥이 거듭제곱인 합성함수의 도함수', '①19', (d, n) => {
      const a = d.int(2, 5), b = nz(d, -5, 5), m = d.int(3, 5), g = n === 3 ? plus(co(a, 'x^2'), b) : L(a, b), P = (e) => '(' + g + ')^' + e;
      if (a === m) return null;
      if (n === 2) {
        return inline(`다음은 합성함수의 미분법으로 함수 ${yIs(ms(P(m)))}을 미분하는 과정이다. 빈칸에 알맞은 수를 차례로 구하시오.`, `${YP} = ${m}${ms(P(m - 1))} × {0} = {1}${ms(P(m - 1))}`, [{ answer: a }, { answer: m * a }], {
          shown: `${YP} = ${m}${ms(P(m - 1))} × ${a} = ${m * a}${ms(P(m - 1))}`,
          explain: `${nb(jh(ms('u = ' + g), '으로/로'))} 놓으면 ${nb(ms('y = u^' + m))}이고 ${nb(frac(V('du'), V('dx')) + ' = ' + a)}이므로 ${nb(YP + ' = ' + m + ms('u^' + (m - 1)) + ' × ' + a + ' = ' + m * a + ms(P(m - 1)))}이다.`,
          facts: { calc: [[`${a}`, 0], [`${m}*${a}`, 1]] } });
      }
      let rows, f, why;
      if (n === 0) {
        f = (x) => (a * x + b) ** m;
        rows = [[co(m * a, P(m - 1)), (x) => m * a * (a * x + b) ** (m - 1)], [co(m, P(m - 1)), (x) => m * (a * x + b) ** (m - 1)], [co(a, P(m - 1)), (x) => a * (a * x + b) ** (m - 1)],
          [co(m * a, P(m)), (x) => m * a * (a * x + b) ** m], [co((m - 1) * a, P(m - 1)), (x) => (m - 1) * a * (a * x + b) ** (m - 1)]];
        why = `${nb(YP + ' = ' + m + ms(P(m - 1)) + ' × ' + a)}`;
      } else if (n === 1) {
        f = (x) => 1 / (a * x + b) ** m;
        rows = [[sf(-m * a, P(m + 1)), (x) => -m * a / (a * x + b) ** (m + 1)], [sf(m * a, P(m + 1)), (x) => m * a / (a * x + b) ** (m + 1)], [sf(-m, P(m + 1)), (x) => -m / (a * x + b) ** (m + 1)],
          [sf(-m * a, P(m - 1)), (x) => -m * a / (a * x + b) ** (m - 1)], [sf(-a, P(m + 1)), (x) => -a / (a * x + b) ** (m + 1)]];
        why = `${nb(yIs(ms('(' + g + ')^{-' + m + '}')))}이므로 ${nb(YP + ' = ' + ms('-' + m + '(' + g + ')^{-' + (m + 1) + '}') + ' × ' + a)}`;
      } else {
        f = (x) => (a * x * x + b) ** m;
        rows = [[co(2 * a * m, 'x' + P(m - 1)), (x) => 2 * a * m * x * (a * x * x + b) ** (m - 1)], [co(m, P(m - 1)), (x) => m * (a * x * x + b) ** (m - 1)], [co(2 * a, 'x' + P(m - 1)), (x) => 2 * a * x * (a * x * x + b) ** (m - 1)],
          [co(2 * a * m, 'x' + P(m)), (x) => 2 * a * m * x * (a * x * x + b) ** m], [co(a * m, 'x' + P(m - 1)), (x) => a * m * x * (a * x * x + b) ** (m - 1)]];
        why = `${nb(YP + ' = ' + m + ms(P(m - 1)) + ' × ' + ms(2 * a + 'x'))}`;
      }
      const pts = n === 3 ? [0.3, 0.6, 0.9] : around(-b / a).map((x) => x / 2 + (-b / a) / 2);
      return derivQ(d, `함수 ${yIs(n === 1 ? sf(1, P(m)) : ms(P(m)))}의 도함수는?`, f, rows.map(([h, g2]) => ({ h: n === 1 ? h : ms(h), g: g2 })), pts, {
        explain: `${why} = ${n === 1 ? rows[0][0] : ms(rows[0][0])}이다. 안쪽 함수 ${ms(g)}의 도함수를 곱하는 것을 빠뜨리지 않는다.` });
    }, { count: 4, standard: S5 }),

    // n = 0: e^(ax + b), n = 1: tan·sin·cos·cot(ax + b)
    T('chain-exp-trig', '바깥이 지수·삼각함수, 안이 일차식인 합성함수의 도함수', '①20', (d, n) => {
      const a = d.pick([2, 3, 4, 5, -2, -3, -1]), b = nz(d, -4, 4), u = L(a, b);
      if (n === 0) {
        if (a === -1) return null;
        const ex = 'e^{' + u + '}', f = (x) => E ** (a * x + b);
        const rows = [[co(a, ex), (x) => a * E ** (a * x + b)], [ex, (x) => E ** (a * x + b)], ['(' + u + ')e^{' + plus(co(a, 'x'), b - 1) + '}', (x) => (a * x + b) * E ** (a * x + b - 1)],
          [co(-a, ex), (x) => -a * E ** (a * x + b)], [co(a, 'xe^{' + u + '}'), (x) => a * x * E ** (a * x + b)]];
        return derivQ(d, `다음 함수를 미분하시오. ${yIs(ms(ex))}`, f, rows.map(([h, g]) => ({ h: ms(h), g })), [-0.4, 0.1, 0.5].map((v) => (v - b) / a), {
          explain: `${nb(ms('(e^u)' + "' = e^u"))}이고 ${nb(ms('(' + u + ")' = " + a))}이므로 ${nb(YP + ' = ' + ms(co(a, ex)))}이다.` });
      }
      const name = d.pick(['tan', 'sin', 'cos', 'cot']), F = { tan: Math.tan, sin: Math.sin, cos: Math.cos, cot }[name];
      const U = (x) => a * x + b, w = '(' + u + ')';
      const D0 = {
        tan: [['sec^2' + w, (x) => sec(U(x)) ** 2], ['sec' + w + 'tan' + w, (x) => sec(U(x)) * Math.tan(U(x))], ['tan^2' + w, (x) => Math.tan(U(x)) ** 2]],
        sin: [['cos' + w, (x) => Math.cos(U(x))], ['sin' + w, (x) => Math.sin(U(x))], ['-sin' + w, (x) => -Math.sin(U(x))]],
        cos: [['-sin' + w, (x) => -Math.sin(U(x))], ['sin' + w, (x) => Math.sin(U(x))], ['cos' + w, (x) => Math.cos(U(x))]],
        cot: [['-csc^2' + w, (x) => -(csc(U(x)) ** 2)], ['-csc' + w + 'cot' + w, (x) => -csc(U(x)) * cot(U(x))], ['cot^2' + w, (x) => cot(U(x)) ** 2]]
      }[name];
      const times = (k, s) => (s[0] === '-' ? co(-k, s.slice(1)) : co(k, s));
      const rows = [[times(a, D0[0][0]), (x) => a * D0[0][1](x)], [D0[0][0], D0[0][1]], [times(-a, D0[0][0]), (x) => -a * D0[0][1](x)], [times(a, D0[1][0]), (x) => a * D0[1][1](x)], [times(a, D0[2][0]), (x) => a * D0[2][1](x)]];
      return derivQ(d, `다음 함수를 미분하시오. ${yIs(mz(name + w))}`, (x) => F(U(x)), rows.map(([h, g]) => ({ h: mz(h), g })), [0.32, 0.61, 0.97].map((v) => (v - b) / a), {
        explain: `${nb(mz({ tan: "(tan u)' = sec^2 u", sin: "(sin u)' = cos u", cos: "(cos u)' = -sin u", cot: "(cot u)' = -csc^2 u" }[name]))}이고 ${nb(ms('(' + u + ")' = " + a))}이므로 ${nb(YP + ' = ' + mz(rows[0][0]))}이다.` });
    }, { count: 2, standard: S5 }),

    // n = 0: ln 이 바깥인 합성(ln|kx|, ln|sin x|, ln|cos x|, ln(ax + b), ln(ax² + b)), n = 1: logₐ 가 바깥인 합성
    T('chain-log', 'ln|f(x)|·logₐ|f(x)|의 도함수', '①21', (d, n) => {
      let t;
      if (n === 0) {
        const k = d.int(2, 9), a = d.int(2, 5), b = d.int(1, 6);
        t = d.pick([
          () => ({ src: 'ln|' + k + 'x|', f: (x) => LN(Math.abs(k * x)), pts: [0.5, 1.3, 2.1], why: `${nb(ms("(ln|" + k + "x|)' = " + k + '/(' + k + 'x)'))}이므로`,
            rows: [['1/x', (x) => 1 / x], [k + '/x', (x) => k / x], ['1/(' + k + 'x)', (x) => 1 / (k * x)], ['1/x^2', (x) => 1 / (x * x)], ['-1/x', (x) => -1 / x]] }),
          () => ({ src: 'ln|sin x|', f: (x) => LN(Math.abs(Math.sin(x))), pts: TRIG_PTS, why: `${nb(ms("(ln|sin x|)' = cos x/sin x"))}이므로`,
            rows: [['cot x', (x) => cot(x)], ['tan x', (x) => Math.tan(x)], ['-cot x', (x) => -cot(x)], ['csc x', (x) => csc(x)], ['cos x', (x) => Math.cos(x)]] }),
          () => ({ src: 'ln|cos x|', f: (x) => LN(Math.abs(Math.cos(x))), pts: TRIG_PTS, why: `${nb(ms("(ln|cos x|)' = -sin x/cos x"))}이므로`,
            rows: [['-tan x', (x) => -Math.tan(x)], ['tan x', (x) => Math.tan(x)], ['-cot x', (x) => -cot(x)], ['sec x', (x) => sec(x)], ['-sin x', (x) => -Math.sin(x)]] }),
          () => ({ src: 'ln(' + L(a, b) + ')', f: (x) => LN(a * x + b), pts: [0.4, 1.1, 2.6], why: `${nb(ms("(" + L(a, b) + ")' = " + a))}이므로`,
            rows: [[a + '/(' + L(a, b) + ')', (x) => a / (a * x + b)], ['1/(' + L(a, b) + ')', (x) => 1 / (a * x + b)], ['-' + a + '/(' + L(a, b) + ')', (x) => -a / (a * x + b)], [a + '/x', (x) => a / x], ['(' + L(a, b) + ')/' + a, (x) => (a * x + b) / a]] }),
          () => ({ src: 'ln(' + plus(co(a, 'x^2'), b) + ')', f: (x) => LN(a * x * x + b), pts: [0.4, 1.1, 2.6], why: `${nb(ms("(" + plus(co(a, 'x^2'), b) + ")' = " + 2 * a + 'x'))}이므로`,
            rows: [[2 * a + 'x/(' + plus(co(a, 'x^2'), b) + ')', (x) => 2 * a * x / (a * x * x + b)], ['1/(' + plus(co(a, 'x^2'), b) + ')', (x) => 1 / (a * x * x + b)], [co(a, 'x') + '/(' + plus(co(a, 'x^2'), b) + ')', (x) => a * x / (a * x * x + b)],
              [2 * a + '/(' + plus(co(a, 'x^2'), b) + ')', (x) => 2 * a / (a * x * x + b)], [2 * a + 'x/(' + plus(co(a, 'x^2'), b) + ')^2', (x) => 2 * a * x / (a * x * x + b) ** 2]] })
        ])();
      } else {
        const base = d.int(2, 7), c = d.int(1, 5);
        t = d.bool()
          ? { src: 'log_' + base + '|x - ' + c + '|', f: (x) => LN(Math.abs(x - c)) / LN(base), pts: around(c), why: `${nb(ms("(log_a|f(x)|)' = f'(x)/(f(x) ln a)"))}이므로`,
            rows: [['1/((x - ' + c + ') ln ' + base + ')', (x) => 1 / ((x - c) * LN(base))], ['1/(x - ' + c + ')', (x) => 1 / (x - c)], ['ln ' + base + '/(x - ' + c + ')', (x) => LN(base) / (x - c)], ['1/(x ln ' + base + ')', (x) => 1 / (x * LN(base))], ['-1/((x - ' + c + ') ln ' + base + ')', (x) => -1 / ((x - c) * LN(base))]] }
          : { src: 'log_' + base + '(x^2 + ' + c + ')', f: (x) => LN(x * x + c) / LN(base), pts: [-0.8, 0.5, 1.7], why: `${nb(ms("(log_a|f(x)|)' = f'(x)/(f(x) ln a)"))}이므로`,
            rows: [['2x/((x^2 + ' + c + ') ln ' + base + ')', (x) => 2 * x / ((x * x + c) * LN(base))], ['2x/(x^2 + ' + c + ')', (x) => 2 * x / (x * x + c)], ['2x ln ' + base + '/(x^2 + ' + c + ')', (x) => 2 * x * LN(base) / (x * x + c)],
              ['1/((x^2 + ' + c + ') ln ' + base + ')', (x) => 1 / ((x * x + c) * LN(base))], ['x/((x^2 + ' + c + ') ln ' + base + ')', (x) => x / ((x * x + c) * LN(base))]] };
      }
      const show = (s) => { const i = s.lastIndexOf('/'); return /^[^/]*\/[^/]*$/.test(s) && !/^\(.*\)$/.test(s) ? (s[0] === '-' ? MINUS : '') + frac(mz(s.slice(s[0] === '-' ? 1 : 0, i)), mz(s.slice(i + 1).replace(/^\((.*)\)$/, '$1'))) : mz(s); };
      return derivQ(d, `함수 ${yIs(mz(t.src))}의 도함수는?`, t.f, t.rows.map(([h, g]) => ({ h: show(h), g })), t.pts, {
        explain: `${t.why} ${nb(YP + ' = ' + show(t.rows[0][0]))}이다.` });
    }, { count: 2, standard: S5 }),

    // n = 0: xᵐ√x, x∛x, n = 1: x^π, x^e
    T('chain-real-power', 'y = xʳ(r은 실수)의 도함수', '①22', (d, n) => {
      if (n === 0) {
        const cube = d.bool(), m = cube ? d.int(1, 2) : d.int(1, 3), k = cube ? 3 : 2, R = cube ? rtn(3, X) : rt(X), pre = (e) => (e === 0 ? '' : e === 1 ? X : ms('x^' + e));
        const coef = (num) => (num % k === 0 ? (num / k === 1 ? '' : String(num / k)) : frac(num, k));
        const opt = (num, e, g) => ({ h: coef(num) + pre(e) + R, g });
        const r = (x) => x ** (1 / k);
        const rows = [opt(k * m + 1, m - 1, (x) => (k * m + 1) / k * x ** (m - 1) * r(x)), opt(k * m + 1, m, (x) => (k * m + 1) / k * x ** m * r(x)), opt(k * m, m - 1, (x) => m * x ** (m - 1) * r(x)),
          opt(k * m - 1, m - 1, (x) => (k * m - 1) / k * x ** (m - 1) * r(x)), { h: frac((k * m + 1) + (m - 1 === 0 ? '' : pre(m - 1)), k + R), g: (x) => (k * m + 1) / k * x ** (m - 1) / r(x) }];
        return derivQ(d, `함수 ${yIs(pre(m) + R)}의 도함수는?`, (x) => x ** m * r(x), rows, [0.6, 1.4, 2.5], {
          explain: `${nb(yIs(pre(m) + R + ' = ' + ms('x^') + sup(frac(k * m + 1, k))))}이므로 ${nb(YP + ' = ' + frac(k * m + 1, k) + ms('x^') + sup(frac(k * m + 1 - k, k)))} = ${rows[0].h}이다.` });
      }
      const pi = d.bool(), c = pi ? Math.PI : E, s = pi ? 'π' : 'e';
      const rows = [[s + 'x^{' + s + ' - 1}', (x) => c * x ** (c - 1)], ['x^{' + s + ' - 1}', (x) => x ** (c - 1)], [s + 'x^' + s, (x) => c * x ** c], ['(' + s + ' - 1)x^{' + s + ' - 1}', (x) => (c - 1) * x ** (c - 1)], [s + 'x^{' + s + ' + 1}', (x) => c * x ** (c + 1)]];
      return derivQ(d, `다음 함수를 미분하시오. ${nb(yIs(ms('x^' + s)) + ' (' + ms('x > 0') + ')')}`, (x) => x ** c, rows.map(([h, g]) => ({ h: ms(h), g })), [0.6, 1.4, 2.5], {
        explain: `${Y} = ${ms('x^r')}(${V('r')}은 실수)의 도함수는 ${ms('rx^{r-1}')}이므로 ${nb(YP + ' = ' + ms(rows[0][0]))}이다.` });
    }, { count: 2, standard: S5 }),

    T('chain-root', '근호가 분모에 있는 합성함수의 도함수', '①23', (d) => {
      const quad = d.bool(), a = d.int(2, 5), c = d.int(1, 5), g = quad ? 'x^2 + ' + c : L(a, c), G = (x) => (quad ? x * x + c : a * x + c), R = rt(ms(g)), P = ms('(' + g + ')');
      const opt = (sign, top, den, fnum) => ({ h: (sign < 0 ? MINUS : '') + frac(ms(top), den), g: (x) => sign * fnum(x) / (G(x) * Math.sqrt(G(x))) });
      const rows = quad
        ? [opt(-1, 'x', P + R, (x) => x), opt(1, 'x', P + R, (x) => x), opt(-1, '1', '2' + P + R, () => 0.5), { h: MINUS + frac(X, R), g: (x) => -x / Math.sqrt(G(x)) }, opt(-1, '2x', P + R, (x) => 2 * x)]
        : [opt(-1, String(a), '2' + P + R, () => a / 2), opt(1, String(a), '2' + P + R, () => a / 2), opt(-1, '1', '2' + P + R, () => 0.5), { h: MINUS + frac(a, '2' + R), g: (x) => -a / (2 * Math.sqrt(G(x))) }, opt(-1, String(a), P + R, () => a)];
      return derivQ(d, `함수 ${yIs(frac(1, R))}의 도함수는?`, (x) => 1 / Math.sqrt(G(x)), rows, [0.4, 1.2, 2.3], {
        explain: `${nb(yIs(ms('(' + g + ')^') + sup(MINUS + frac(1, 2))))}이므로 ${nb(YP + ' = ' + MINUS + frac(1, 2) + ms('(' + g + ')^') + sup(MINUS + frac(3, 2)) + ' × ' + (quad ? ms('2x') : a))} = ${rows[0].h}이다.` });
    }, { standard: S5 }),

    // n = 0: (f∘g)′(a), n = 1: {f(x)}ᵐ 의 미분계수
    T('chain-abstract', '추상 함수의 합성 미분계수', '①24', (d, n) => {
      if (n === 0) {
        const a = d.int(1, 3), p = d.int(-2, 4), A = nz(d, -6, 6), Bc = nz(d, -6, 6);
        if (p === a || Math.abs(A) === 1 || Math.abs(Bc) === 1) return null;
        return val(`실수 전체의 집합에서 미분가능한 두 함수 ${ms('f(x)')}, ${ms('g(x)')}가 ${nb(ms("f'(" + p + ') = ' + A))}, ${nb(ms('g(' + a + ') = ' + p))}, ${nb(jh(ms("g'(" + a + ') = ' + Bc), '을/를'))} 만족시킬 때, 합성함수 ${nb(ms('(f∘g)(x)'))}의 ${nb(ms('x = ' + a))}에서의 미분계수는?`, A * Bc, {
          explain: `${nb(ms("{f(g(x))}' = f'(g(x))g'(x)"))}이므로 ${nb(ms("f'(g(" + a + "))g'(" + a + ") = f'(" + p + ') × ') + (Bc < 0 ? '(' + sT(Bc) + ')' : Bc) + ' = ' + sT(A * Bc))}이다.`,
          value: `${jn(A)}*${jn(Bc)}` });
      }
      const a = d.int(1, 3), m = d.int(2, 4), c = d.pick([-2, -1, 2]), k = nz(d, -5, 5), ans = m * c ** (m - 1) * k;
      return val(`실수 전체의 집합에서 미분가능한 함수 ${ms('f(x)')}가 ${nb(ms('f(' + a + ') = ' + c))}, ${nb(jh(ms("f'(" + a + ') = ' + k), '을/를'))} 만족시킬 때, 함수 ${nb(yIs(ms('{f(x)}^' + m)))}의 ${nb(ms('x = ' + a))}에서의 미분계수는?`, ans, {
        explain: `${nb(YP + ' = ' + ms(m + '{f(x)}' + (m > 2 ? '^' + (m - 1) : '') + "f'(x)"))}이므로 ${nb(ms(m + '{f(' + a + ')}' + (m > 2 ? '^' + (m - 1) : '') + "f'(" + a + ')') + ' = ' + sT(ans))}이다.`,
        value: `${m}*${jn(c)}**${m - 1}*${jn(k)}`, derived: [m - 1] });
    }, { count: 2, standard: S5 }),

    // n = 0: f(f(x)), f = e^(kx), n = 1: g(sin mx), g = e^(px)/(1 − x), n = 2: g(cos x), g = x/(eˣ + c)
    T('chain-concrete', '식으로 준 두 함수의 합성 미분계수', '①25', (d, n) => {
      if (n === 0) {
        const k = d.int(2, 4), F = (x) => E ** (k * x), v = ND((x) => F(F(x)), 0);
        const opt = (h, value) => ({ h: ms(h), v: value });
        const rows = [opt(k * k + 'e^' + k, k * k * E ** k), opt(k + 'e^' + k, k * E ** k), opt(k * k + 'e', k * k * E), opt(k + 'e^{' + 2 * k + '}', k * E ** (2 * k)), opt(k * k + 'e^{' + (k + 1) + '}', k * k * E ** (k + 1))];
        return valueQ(d, `함수 ${fIs(ms('e^{' + k + 'x}'))}에 대하여 ${nb(ms('g(x) = f(f(x))'))}일 때, ${ms("g'(0)")}의 값은?`, v, rows, {
          explain: `${nb(ms("g'(x) = f'(f(x))f'(x)"))}이고 ${nb(ms('f(0) = 1'))}, ${nb(ms("f'(x) = " + k + 'e^{' + k + 'x}'))}이므로 ${nb(ms("g'(0) = f'(1)f'(0) = " + k + 'e^' + k + ' × ' + k + ' = ' + k * k + 'e^' + k))}이다.` });
      }
      if (n === 1) {
        const m = d.int(2, 4), p = d.int(2, 4);
        return val(`두 함수 ${fIs(ms('sin ' + m + 'x'))}, ${nb(ms('g(x)') + ' = ' + frac(ms('e^{' + p + 'x}'), ms('1 - x')))}에 대하여 ${nb(ms('h(x) = (g∘f)(x)'))}라 할 때, ${ms("h'(0)")}의 값은?`, m * (p + 1), {
          explain: `${nb(ms("h'(x) = g'(f(x))f'(x)"))}이고 ${nb(ms('f(0) = 0'))}, ${nb(ms("f'(0) = " + m))}이다. ${nb(ms("g'(x)") + ' = ' + frac(ms(p + 'e^{' + p + 'x}(1 - x) + e^{' + p + 'x}'), ms('(1 - x)^2')))}에서 ${nb(ms("g'(0) = " + (p + 1)))}이므로 ${nb(ms("h'(0) = " + (p + 1) + ' × ' + m + ' = ' + m * (p + 1)))}이다.`,
          value: `${m}*(${p}+1)` });
      }
      const c = d.int(1, 5), up = d.bool(), at = up ? frac('3π', 2) : frac('π', 2), s = up ? 1 : -1;
      return val(`두 함수 ${fIs(ms('cos x'))}, ${nb(ms('g(x)') + ' = ' + frac(X, ms('e^x + ' + c)))}에 대하여 ${nb(ms('h(x) = (g∘f)(x)'))}라 할 때, ${nb(ms("h'") + '(' + at + ')')}의 값은?`, Q(s, 1 + c), {
        explain: `${nb(ms("h'(x) = g'(f(x))f'(x)"))}이고 ${nb(ms('f') + '(' + at + ') = 0')}, ${nb(ms("f'") + '(' + at + ') = ' + MINUS + fn('sin') + ' ' + at + ' = ' + sT(s))}이다. ${nb(ms("g'(x)") + ' = ' + frac(ms('(e^x + ' + c + ') - xe^x'), ms('(e^x + ' + c + ')^2')))}에서 ${nb(ms("g'(0)") + ' = ' + frac(1, 1 + c))}이므로 답은 ${qT(Q(s, 1 + c))}이다.`,
        value: `${s}/(1+${c})` });
    }, { count: 3, standard: S5 }),

    T('chain-then-value', '미분계수로 구한 수를 다시 함수에 넣기', '①26', (d) => {
      const c = d.int(1, 3), k = 1 + c, a = 1 / k, v = LN(E ** a + c), root = k === 2 ? rt(ms('e')) : rtn(k, 'e');
      const L1 = (h) => nb(fn('ln') + '(' + h + ')');
      const rows = [{ h: L1(root + ' + ' + c), v }, { h: L1(ms('e + ' + c)), v: LN(E + c) }, { h: L1(ms('e^' + k + ' + ' + c)), v: LN(E ** k + c) }, { h: L1(root + ' + ' + (c + 1)), v: LN(E ** a + c + 1) }, { h: nb(fn('ln') + ' ' + k), v: LN(k) }];
      return valueQ(d, `함수 ${fIs(ms('ln(e^x + ' + c + ')'))}에 대하여 ${nb(ms("f'(0) = a"))}일 때, ${ms('f(a)')}의 값은?`, v, rows, {
        explain: `${nb(ms("f'(x)") + ' = ' + frac(ms('e^x'), ms('e^x + ' + c)))}이므로 ${nb(ms('a') + ' = ' + frac(1, k))}이고 ${nb(ms('f') + '(' + frac(1, k) + ') = ' + rows[0].h)}이다.` });
    }, { standard: S5 }),

    T('chain-coef', '합성함수의 도함수로 상수 구하기', '①27', (d) => {
      const m = d.pick([2, 4]), b = d.pick([1, 2, 3, 4, 6]), a = d.pick([-3, -2, -1, 1, 2, 3]), v = m * a ** (m - 1) * b;
      return val(`함수 ${fIs(ms('(x^2 + ' + co(b, 'x') + ' + a)^' + m))}에 대하여 ${nb(ms("f'(0) = " + v))}일 때, 상수 ${Av}의 값은?`, a, {
        explain: `${nb(ms("f'(x) = " + m + '(x^2 + ' + co(b, 'x') + ' + a)' + (m > 2 ? '^' + (m - 1) : '') + '(2x + ' + b + ')'))}이므로 ${nb(ms("f'(0) = " + co(m * b, m > 2 ? 'a^' + (m - 1) : 'a')))}이다. ${nb(ms(co(m * b, m > 2 ? 'a^' + (m - 1) : 'a') + ' = ' + v))}에서 ${nb(ms('a = ' + a))}이다.`,
        value: m === 2 ? `${jn(v)}/(2*${b})` : a > 0 ? `(${v}/(4*${b}))**(1/3)` : `-(((${-v})/(4*${b}))**(1/3))`, derived: [3] });
    }, { standard: S5 }),

    // n = 0: (f(x₀ + h) − 1)/h, n = 1: (1/x)ln{(eˣ + ⋯ + e^(mx))/m}, n = 2: g(f(x))/x — 극한을 합성함수의 미분계수로 읽는다
    T('chain-limit', '극한을 합성함수의 미분계수로 읽기', '①28', (d, n) => {
      if (n === 0) {
        const x0 = d.pick([1, 2]), a = d.int(2, 6), bq = a * x0 - 1, g = L(a, -bq), ans = Q(-3 * a, 2);
        return val(`함수 ${fIs(frac(1, ms('(' + g + ')') + rt(ms(g))))}에 대하여 ${lim('h→0', frac(ms('f(' + x0 + ' + h) - 1'), V('h')))}의 값은?`, ans, {
          explain: `${nb(ms('f(' + x0 + ') = 1'))}이므로 (주어진 식) = ${nb(ms("f'(" + x0 + ')'))}이다. ${nb(fIs(ms('(' + g + ')^') + sup(MINUS + frac(3, 2))))}에서 ${nb(ms("f'(x)") + ' = ' + MINUS + frac(3, 2) + ms('(' + g + ')^') + sup(MINUS + frac(5, 2)) + ' × ' + a)}이므로 ${nb(ms("f'(" + x0 + ')') + ' = ' + qT(ans))}이다.`,
          value: `-3*${a}/2`, derived: [2, 3] });
      }
      if (n === 1) {
        const m = d.int(3, 6), terms = m <= 4 ? Array.from({ length: m }, (_, i) => 'e^{' + co(i + 1, 'x') + '}').join(' + ') : 'e^x + e^{2x} + ⋯ + e^{' + m + 'x}';
        return val(`${lim('x→0', frac(1, X) + nb(fn('ln') + ' ' + frac(ms(terms), m)))}의 값은?`, Q(m + 1, 2), {
          explain: `${nb(fIs(ms('ln(' + terms + ')')))}이라 하면 ${nb(ms('f(0) = ln ' + m))}이므로 (주어진 식) = ${nb(lim('x→0', frac(ms('f(x) - f(0)'), X)) + ' = ' + ms("f'(0)"))}이다. ${nb(ms("f'(0)") + ' = ' + frac(ms(m <= 4 ? Array.from({ length: m }, (_, i) => i + 1).join(' + ') : '1 + 2 + ⋯ + ' + m), m))} = ${qT(Q(m + 1, 2))}이다.`,
          value: `(${m}+1)/2`, derived: [2] });
      }
      const k = d.int(1, 3), s = k % 2 ? -1 : 1, v = s * k * Math.PI;
      const P1 = (c) => ({ h: c === 0 ? '0' : PI(c, 1), v: c * Math.PI });
      const rows = choose(d, P1(s * k), [P1(-s * k), P1(s * (k + 1)), P1(-s * (k + 1)), P1(0), P1(s * 2 * k)], 4);
      return valueQ(d, `두 함수 ${fIs(ms('e^x'))}, ${nb(ms('g(x) = sin ') + (k === 1 ? '' : k) + 'π' + X)}에 대하여 ${lim('x→0', frac(ms('g(f(x))'), X))}의 값은?`, v, rows, {
        explain: `${nb(ms('h(x) = g(f(x)) = sin ') + (k === 1 ? '' : k) + 'π' + ms('e^x'))}라 하면 ${nb(ms('h(0) = sin ') + (k === 1 ? '' : k) + 'π = 0')}이므로 (주어진 식) = ${ms("h'(0)")}이다. ${nb(ms("h'(x) = ") + (k === 1 ? '' : k) + 'π' + ms('e^x cos ') + (k === 1 ? '' : k) + 'π' + ms('e^x'))}에서 ${nb(ms("h'(0) = ") + (k === 1 ? '' : k) + 'π' + ms(' cos ') + (k === 1 ? '' : k) + 'π = ' + rows[0].h)}이다.` });
    }, { count: 3, standard: S5 }),

    // n = 0: f(xᵏ + c) = e^(mx), n = 1: f(ln x + c) = eˣ + kx
    T('chain-func-eq', '합성으로 쓴 함수방정식에서 미분계수', '①30', (d, n) => {
      if (n === 0) {
        const k = d.int(2, 3), m = d.int(1, 2), c = d.int(0, 3), v = m * E ** m / k, em = m === 1 ? 'e' : 'e^' + m;
        const opt = (num0, den0, value) => { const g = gcd(num0, den0), num = num0 / g, den = den0 / g; return { h: den === 1 ? ms(co(num, em)) : frac(ms(co(num, em)), den), v: value }; };
        const rows = choose(d, opt(m, k, v), [opt(m, 1, m * E ** m), opt(m * k, 1, m * k * E ** m), { h: frac(ms(co(m, m === 1 ? 'e^2' : 'e')), k), v: m * (m === 1 ? E * E : E) / k }, opt(1, k * m, E ** m / (k * m)), opt(m, k + 1, m * E ** m / (k + 1))], 4);
        return valueQ(d, `미분가능한 함수 ${ms('f(x)')}가 모든 실수 ${X}에 대하여 ${nb(jh(ms('f(x^' + k + (c === 0 ? '' : ' + ' + c) + ') = e^{' + co(m, 'x') + '}'), '을/를'))} 만족시킬 때, ${ms("f'(" + (1 + c) + ')')}의 값은?`, v, rows, {
          explain: `양변을 ${X}에 대하여 미분하면 ${nb(ms(k + 'x^' + (k - 1) + "f'(x^" + k + (c === 0 ? '' : ' + ' + c) + ') = ' + co(m, 'e^{' + co(m, 'x') + '}')))}이다. ${nb(ms('x = 1'))}을 넣으면 ${nb(ms(k + "f'(" + (1 + c) + ') = ' + co(m, em)))}이므로 답은 ${rows[0].h}이다.` });
      }
      const c = d.int(1, 3), k = d.int(1, 3), v = E + k;
      const opt = (h, value) => ({ h: ms(h), v: value });
      const rows = choose(d, opt('e + ' + k, v), [opt('e', E), opt(k === 1 ? '2e' : k + 'e', k === 1 ? 2 * E : k * E), opt('e + ' + (k + 1), E + k + 1), opt(String(1 + k), 1 + k), opt('e - ' + k, E - k)], 4);
      return valueQ(d, `미분가능한 함수 ${ms('f(x)')}가 ${nb(ms('x > 0'))}인 모든 실수 ${X}에 대하여 ${nb(jh(ms('f(ln x + ' + c + ') = e^x + ' + co(k, 'x')), '을/를'))} 만족시킬 때, ${ms("f'(" + c + ')')}의 값은?`, v, rows, {
        explain: `양변을 ${X}에 대하여 미분하면 ${nb(frac(ms("f'(ln x + " + c + ')'), X) + ' = ' + ms('e^x + ' + k))}이다. ${nb(ms('x = 1'))}을 넣으면 ${nb(ms('ln 1 = 0'))}이므로 ${nb(ms("f'(" + c + ') = e + ' + k))}이다.` });
    }, { count: 2, standard: S5 }),

    T('chain-area', '넓이 함수의 미분계수(y = √x)', '①33', (d) => {
      const s = d.pick([1, 2]), t0 = d.pick([1, 4, 9, 16]), r = Math.sqrt(t0), ans = Q(3 * s * r, 4), tt = 4;
      const sq = (x) => s * Math.sqrt(Math.max(x, 0)), A = [tt, sq(tt)];
      const figure = plot({ x: [-0.4, 5.8], y: [-0.5, s * 2.5 + 0.3], u: 38, curves: [{ f: sq, from: 0, to: 5.6, name: s === 1 ? 'y=√x' : 'y=2√x' }],
        fill: [{ f: (x) => sq(tt) / tt * x, from: 0, to: tt }], segs: [{ p: [0, 0], q: A }, { p: [tt, 0], q: A }],
        dots: [{ x: tt, y: sq(tt), name: 'A', side: 'ul', said: '곡선 위의 점 A' }, { x: tt, y: 0, name: 'B', side: 'ur', said: '점 A에서 x축에 내린 수선의 발 B' }], xt: [{ v: tt, t: 't' }], yt: [] });
      const curve = s === 1 ? rt(X) : '2' + rt(X), at = s === 1 ? rt(Tt) : '2' + rt(Tt);
      return val(`그림과 같이 곡선 ${nb(yIs(curve))} 위의 점 ${nb('A(' + Tt + ', ' + at + ')')}에서 ${X}축에 내린 수선의 발을 B라 하자. 삼각형 AOB의 넓이를 ${ms('f(t)')}라 할 때, ${ms("f'(" + t0 + ')')}의 값은? ${nb('(단, ' + ms('t > 0') + '이고 O는 원점이다.)')}`, ans, {
        figure, signed: false,
        explain: `${nb(ms('f(t)') + ' = ' + frac(1, 2) + ' × ' + Tt + ' × ' + at + ' = ' + (s === 1 ? frac(1, 2) : '') + ms('t^') + sup(frac(3, 2)))}이므로 ${nb(ms("f'(t)") + ' = ' + qT(Q(3 * s, 4)) + rt(Tt))}이고 ${nb(ms("f'(" + t0 + ')') + ' = ' + qT(Q(3 * s, 4)) + ' × ' + r + ' = ' + qT(ans))}이다.`,
        value: `3*${s}*${r}/4`, derived: [3, 4, r] });
    }, { standard: S5 })
  ];

  // 같은 단원의 b·c 파일이 쓰는 도구
  B.kit.u54x = {
    nb, S4, S5, S6, S7, seal, retry, T, HT, stripH, X, Y, Tt, Av, Bv, sT, jn, mz, co, L, plus, sf, qT, qJ, yIs, fIs, YP, PI, NOTE1,
    ND, ND2, near, sec, csc, cot, E, LN, val, slots, pickQ, derivQ, valueQ, choose, around, TRIG_PTS, R2, R3
  };

  B.addUnit({ id: '11-5-4', grade: 11, semester: 5, no: 4, title: '여러 가지 미분법', version: 1, groups: [
    { id: 'quot', title: '함수의 몫의 미분법', standard: S4, types: quot },
    { id: 'chain', title: '합성함수의 미분법', standard: S5, types: chain },
    { id: 'param', title: '매개변수로 나타낸 함수의 미분법', standard: S6, types: [] },
    { id: 'implicit', title: '음함수와 역함수의 미분법', standard: S7, types: [] },
    { id: 'second', title: '이계도함수', standard: S7, types: [] }
  ] });
})(typeof window !== 'undefined' ? window : globalThis);
