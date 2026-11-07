// 고등학교 대수 Ⅲ-3 「수학적 귀납법」 — 단원 틀·도구와 앞쪽 묶음(귀납적 정의로 항 구하기, 거꾸로 구하기와 미지수).
// 수집해 둔 천재 T셀파 대수(전인태, 2022 개정)의 교과서·평가 자료에서 뽑은 문제 꼴 목록(기본꼴_1: 44꼴, 심화꼴: 3꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음 / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/11-1-7/싣기_대조표.md 에 있다.
// (되풀이되는 수열, 상황을 귀납적으로 나타내기, 수학적 귀납법은 11-1-7b.js 에, 실력 문항은 11-1-7c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
// 성취기준: [12대수03-06] 수열의 귀납적 정의를 설명할 수 있다. [12대수03-07] 수학적 귀납법의 원리를 이해하고, 이를 이용하여 명제를 증명할 수 있다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 관계식의 꼴(더하는 수·곱하는 수가 일정한가, n의 식인가, 분수·제곱·근호·로그가 끼는가, 앞의 두 항을 쓰는가),
//    묻는 것(가까운 항·먼 항·제몇 항·합·첫째항·관계식 속 상수), 상황(쪼개는 도형·막대·점·직선·물·하노이 탑), 증명의 명제(합·곱·배수·부등식·수열)가 다르면 따로 싣는다.
//  - 교육과정: 「귀납적으로 정의된 수열의 일반항을 구하는 문제는 다루지 않는다」(적용 시 고려 사항)는 일반항의 식을 묻는 문항만 막는다.
//    한 항(a₁₂, a₃₀)이나 aₖ = 값인 k를 묻는 꼴(①3·4·7·16)은 실었다. 몇 항 나열이나 되풀이로 풀리면 기본, 합(Σ)을 거쳐야 하면 실력이다.
//    「수학적 귀납법을 이용한 증명은 원리를 이해할 수 있는 정도로 간단히 다룬다」는 정도를 말하는 줄이라 빼는 까닭으로 쓰지 않았다.
//  - 답: 수 칸에는 모두 부호 단추를 단다. 개수·제몇 항·자연수로 정한 지수처럼 음수일 수 없는 답만 단추 없이 받는다.
//    네 자리를 넘는 거듭제곱은 「aₖ = 2ᵐ을 만족시키는 자연수 m」처럼 지수를 묻는다. 관계식은 aₙ₊₁ = □aₙ □n □ 세 칸(0과 1도 적는다)으로 받고,
//    계수가 분수인 관계식과 증명의 빈칸에 들어갈 식은 고르기로 낸다. 고르기의 참·거짓은 손으로 적지 않고 코드로 셈한다(관계식을 따라가 본 값, 여러 k로 넣어 본 식).
//  - 원문이 따로 구한 값을 더한 곳(p + q, a₂ + a₄, a₃₄₅ + a₃₄₆ + a₃₄₇)은 칸마다 받는다. 증명의 빈칸 식을 수로 묻는 f(5)/g(5) 꼴은 원문대로 두었다.
//  - 수와 상황은 새로 썼다. 늘 같은 답이 나오는 꼴은 수(묻는 항, 첫째항, 명제의 수)를 바꾸었다.
//
// 뺀 것과 까닭(11-1-7b.js, 11-1-7c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 같은 과목의 다른 단원에 있는 일: 나열된 등차수열에서 공차 구하기(①1 — 11-1-5), 연속한 세 항의 관계식으로 등차·등비수열 알아보기(①15 — 11-1-5 등차중항·등비중항),
//    이웃한 두 항의 합으로 두 항씩 묶어 Σ 구하기(①17 — 11-1-6).
//  - 그냥 길 세기: 도로망에서 O에서 A까지 가는 경우의 수(①30 — 원문이 관계식을 세우거나 쓰게 묻지 않는다. 10-1-7 경우의 수).
//  - 활동: 악수 횟수가 늘어나는 수(①31 — 도입 활동), 보고 말하기 수열(①32 — 수행 과제).
//  - 서술형 증명: 배수(①40), 부등식(①42), 관계식으로 정한 수열의 일반항(①43), 모눈종이 덮기(①44 — 작도도 함께). 같은 일을 빈칸 꼴(①37·38·39)이 한다.
//    ①41의 등식 증명은 「항을 쪼개 앞 식 + (1 + 2 + ⋯ + k)로 고치는」 단계를 원문 풀이대로 빈칸 꼴로 지어 실었다(ind-split). 나머지 둘은 ①34와 같은 일이다.
//  - 교과서 대단원 평가 17(정육면체 탑 — 풀이가 Σk(k + 1)/2라 11-1-6 수열의 합).
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」 문자는 값을 물으면 「상수 k」, 원문이 「실수 a」라 부른 것은 그대로 둔다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, frac, lines, N, M, C, inline } = B.kit;
  const { MINUS, Q, qadd, qsub, qmul, qdiv, tx, tj, nb, V, sup, poly, rt } = B.kit.mid;
  const { ms, sum, pw, lg, jh, hx, qAns } = B.kit.hs;
  const UNIT = '11-1-7', STD6 = '12대수03-06', STD7 = '12대수03-07';

  // ── 수와 글 ──
  const num = (n) => (n < 0 ? MINUS + Math.abs(n) : String(n));                 // 정수(음수는 −)
  const par = (n) => (n < 0 ? '(' + num(n) + ')' : num(n));                    // 식 속의 정수(음수는 괄호)
  const jn = (n) => (n < 0 ? '(' + n + ')' : String(n));                       // 검사 식에 적는 정수
  const jq = (q) => (q.q === 1 ? jn(q.p) : '(' + q.p + '/' + q.q + ')');       // 검사 식에 적는 유리수
  const vh = (v) => (typeof v === 'number' ? num(v) : tx(v));                  // 수나 유리수를 글로
  const plusC = (c) => (c < 0 ? ' ' + MINUS + ' ' + Math.abs(c) : ' + ' + c); // 앞 식 뒤에 붙이는 상수항
  const A = (k) => ms(/^(\d+|[a-z])$/.test(String(k)) ? 'a_' + k : 'a_{' + k + '}');   // aₖ, aₙ₊₁
  const Nv = V('n'), Kv = V('k'), Mv = V('m'), Av = V('a');
  const SEQ = nb('{' + A('n') + '}');
  const NN = nb('(' + Nv + ' = 1, 2, 3, …)');
  const ALL = '모든 자연수 ' + Nv + '에 대하여';
  const defFig = (rows) => lines(rows.map((r) => hx(r)));                      // 귀납적 정의를 줄마다 적은 그림 칸
  const listA = (vals, from) => vals.map((v, i) => nb(A(from + i) + ' = ' + vh(v))).join(', ');
  const upto = (k) => Array.from({ length: k }, (_, i) => i + 1).join(', ');   // 1, 2, …, k 를 다 적는다
  const uptoJ = (k, pair) => upto(k - 1) + (k > 1 ? ', ' : '') + tj(Q(k), pair);
  const big = (v) => Math.abs(v) > 9999;
  const isQ = (v) => typeof v === 'object';

  // ── 검사 근거 마무리(10-1-3a.js 와 같은 방법) ──
  const stripH = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  function visibleNumbers(item) {
    const seen = stripH([item.text, item.figure || ''].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, ' $1 ').replace(/<table[^>]*aria-label="([^"]*)"[^>]*>/g, ' $1 | '));
    return new Set((seen.match(/\d+/g) || []).concat(seen.match(/\d+\.\d+/g) || [], seen.replace(/(\d) (?=\d)/g, '$1').match(/\d+/g) || []));
  }
  // 다시 셈하는 식의 수 가운데 글에 보이지 않는 수를 facts.unseen 에 밝힌다. 밝히기로 한 수(facts.derived — 그림에서 세는 수, 거듭제곱의 지수 따위)가 아닌 수가 나오면 오류를 낸다.
  function seal(item) {
    const f = item.facts || {};
    if (f.calc) f.calc = f.calc.map(([t, i]) => [/\+0$/.test(t) ? t : '(' + t + ')+0', i]);
    if (f.value !== undefined && !/\+0$/.test(f.value)) f.value = '(' + f.value + ')+0';
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
  // 만들기가 null 을 돌려주면(조건에 맞지 않는 수) 다시 만든다.
  const retry = (make) => (d, n) => { for (let i = 0; i < 4000; i += 1) { const item = make(d, n); if (item) return seal(item); } throw new Error('조건에 맞는 문항을 만들지 못했다'); };
  const srcOf = (ref) => (/①/.test(ref) ? '수집본 기본 자료(' : '수집본 심화 자료(') + ref + ')';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: srcOf(ref), make: retry(make) }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: srcOf(ref), make: retry(make) }, more || {});

  // ── 답 칸 ──
  const factsOf = (o, base) => Object.assign(base, o.derived ? { derived: o.derived } : {}, o.unseen ? { unseen: o.unseen } : {}, o.rule ? { rule: o.rule } : {});
  // 정수 하나. o.value: 다시 셈하는 식, o.signed: false 면 부호 단추를 뗀다(개수·제몇 항·자연수 지수).
  const numQ = (text, answer, o) => N(text, answer + 0, { signed: o.signed !== false, unit: o.unit, figure: o.figure, explain: o.explain, facts: factsOf(o, { value: o.value }) });
  // 유리수 하나(정수면 수 칸, 아니면 분자·분모 칸 — 크기가 같은 분수도 맞게 친다)
  const ratQ = (text, q, o) => qAns(text, q, { signed: o.signed !== false, figure: o.figure, explain: o.explain, facts: factsOf(o, { value: o.value }) });
  // 수 여럿: rows 는 [이름표, 답, 검사 식, 부호 단추를 붙이는가(기본 붙인다)]
  const slots = (text, rows, o) => M(text, rows.map(([label, answer, , s]) => Object.assign({ label, answer: answer + 0 }, s === false ? {} : { signed: true })), {
    figure: o.figure, explain: o.explain, shown: o.shown, facts: factsOf(o, { calc: rows.map((r, i) => [r[2], i]) })
  });
  // 관계식 aₙ₊₁ = paₙ + qn + r 을 세 칸으로 받는다(칸의 모양이 관계식의 꼴을 흘리지 않게 상황마다 같은 틀을 쓴다).
  const RELTEXT = `(단, 칸에는 0이나 1도 적는다.)`;
  const relQ = (text, [p, q, r], o) => inline(text + ' ' + RELTEXT, `${A('n+1')} = {0}${A('n')} {1}${Nv} {2}`, [{ answer: p, signed: true }, { answer: q, signed: true }, { answer: r, signed: true }], {
    figure: o.figure, explain: o.explain, shown: `${A('n+1')} = ${poly([[p, A('n')], [q, Nv], [r, '']])}`, facts: factsOf(o, { calc: o.calc })
  });
  // 하나 고르기: rows 는 { h 글, ok 참인가 }. ok 가 want 인 것이 꼭 하나다(참·거짓은 코드가 셈한 값이다).
  function oneQ(d, text, rows, want, o) {
    const list = o.keep ? rows.slice() : d.shuffle(rows);
    if (list.filter((r) => r.ok === want).length !== 1) return null;
    if (new Set(list.map((r) => stripH(r.h))).size !== list.length) return null;
    const at = list.findIndex((r) => r.ok === want);
    return C(text, list.map((r) => r.h), at, { figure: o.figure, explain: o.explain, facts: Object.assign({ truth: list.map((r) => r.ok), want }, o.rule ? { rule: o.rule } : {}) });
  }
  // 증명을 담는 상자와 빈칸
  const proofBox = (rows) => `<div class="mb-lines" style="padding:10px 12px;border:1.5px solid #94a3b8;border-radius:8px;font-size:1rem">${rows.map((r) => '<div>' + r + '</div>').join('')}</div>`;
  const BX = (label) => `<span class="mb-box">${label}</span>`;
  // k 에 수 여럿을 넣어 두 식(값 함수)이 같은가
  const sameK = (f, g, ks) => (ks || [1, 2, 3, 4, 5, 6, 7]).every((k) => { const a = f(k), b = g(k); return typeof a === 'object' ? a.p === b.p && a.q === b.q : Math.abs(a - b) < 1e-9; });

  // 다른 파일(b·c)이 함께 쓰는 도구
  B.kit.u1117 = {
    UNIT, STD6, STD7, num, par, jn, jq, vh, plusC, A, Nv, Kv, Mv, Av, SEQ, NN, ALL, defFig, listA, upto, uptoJ, big, isQ,
    stripH, seal, retry, srcOf, T, H, numQ, ratQ, slots, relQ, RELTEXT, oneQ, proofBox, BX, sameK
  };

  B.addUnit({
    id: '11-1-7', grade: 11, semester: 1, no: 7, title: '수학적 귀납법', version: 1,
    groups: [
      { id: 'term', title: '귀납적 정의로 항 구하기', standard: STD6, types: [] },
      { id: 'back', title: '거꾸로 구하기와 미지수', standard: STD6, types: [] },
      { id: 'cycle', title: '되풀이되는 수열과 조건에 따라 바뀌는 관계식', standard: STD6, types: [] },
      { id: 'model', title: '상황을 귀납적으로 나타내기', standard: STD6, types: [] },
      { id: 'induct', title: '수학적 귀납법', standard: STD7, types: [] }
    ]
  });

  // ════════════════════════════════════════════════════════════════
  // ── 귀납적 정의로 항 구하기 ──
  B.addTypes(UNIT, 'term', [
    T('term-const', '더하는 수·곱하는 수가 일정한 관계식으로 항 구하기', '①2', (d, n) => {
      const k = d.int(4, 7);
      if (n === 0) {
        const a1 = d.int(-15, 25), c = d.pick([-9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9]);
        const vals = Array.from({ length: k }, (_, i) => a1 + i * c);
        return numQ(`수열 ${SEQ}의 귀납적 정의가 다음과 같을 때, ${A(k)}의 값은?`, vals[k - 1], {
          figure: defFig([`${A(1)} = ${num(a1)}, ${A('n+1')} = ${A('n')}${plusC(c)}`, NN]),
          explain: `${A('n+1')} = ${A('n')}${plusC(c)}의 ${Nv}에 ${uptoJ(k - 1, '을/를')} 차례로 대입하면 ${listA(vals.slice(1), 2)}이다.`,
          value: `${jn(a1)}+(${k}-1)*${jn(c)}`
        });
      }
      // 곱하는 수가 일정: 정수이거나 1/b, −1/b
      if (d.bool()) {
        const r = d.pick([2, 3, -2, -3]), a1 = d.pick([1, 2, 3, -1, -2, -3, 4, 5, -4]);
        const vals = Array.from({ length: k }, (_, i) => a1 * r ** i);
        if (big(vals[k - 1])) return null;
        return numQ(`수열 ${SEQ}의 귀납적 정의가 다음과 같을 때, ${A(k)}의 값은?`, vals[k - 1], {
          figure: defFig([`${A(1)} = ${num(a1)}, ${A('n+1')} = ${num(r)}${A('n')}`, NN]),
          explain: `${A('n+1')} = ${num(r)}${A('n')}의 ${Nv}에 ${uptoJ(k - 1, '을/를')} 차례로 대입하면 ${listA(vals.slice(1), 2)}이다.`,
          value: `${jn(a1)}*${jn(r)}**(${k}-1)`
        });
      }
      const b = d.pick([2, 3]), s = d.pick([1, -1]), c = d.pick([1, 2, 3, -1, -2]), a1 = c * b ** (k - 1);
      if (big(a1)) return null;
      const vals = Array.from({ length: k }, (_, i) => c * b ** (k - 1 - i) * s ** i);
      const rH = (s < 0 ? MINUS : '') + frac(1, b);
      return numQ(`수열 ${SEQ}의 귀납적 정의가 다음과 같을 때, ${A(k)}의 값은?`, vals[k - 1], {
        figure: defFig([`${A(1)} = ${num(a1)}, ${A('n+1')} = ${rH}${A('n')}`, NN]),
        explain: `${A('n+1')} = ${rH}${A('n')}의 ${Nv}에 ${uptoJ(k - 1, '을/를')} 차례로 대입하면 ${listA(vals.slice(1), 2)}이다.`,
        value: `${jn(a1)}*(${s}/${b})**(${k}-1)`
      });
    }, { count: 2 }),

    T('term-far', '등차·등비 꼴 관계식으로 먼 항 구하기', '①3', (d, n) => {
      if (n === 0) {
        const a1 = d.int(-30, 40), c = d.pick([-9, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8]), k = d.int(12, 30), v = a1 + (k - 1) * c;
        const rel = nb(A('n+1') + ' = ' + A('n') + plusC(c));
        return numQ(`수열 ${jh(SEQ, '이/가')} ${A(1)} = ${num(a1)}이고 ${ALL} ${jh(rel, '을/를')} 만족시킬 때, ${A(k)}의 값은?`, v, {
          explain: `${A('n+1')} ${MINUS} ${A('n')} = ${tj(Q(c), '으로/로')} 일정하므로 수열 ${jh(SEQ, '은/는')} 첫째항이 ${num(a1)}, 공차가 ${num(c)}인 등차수열이다. 따라서 ${A(k)} = ${num(a1)} + ${k - 1} × ${par(c)} = ${num(v)}이다.`,
          value: `${jn(a1)}+(${k}-1)*${jn(c)}`
        });
      }
      // 등비 꼴: a₁ = b^s, 공비 b^t → aₖ = b^m
      const b = d.pick([2, 3]), s = d.pick([-1, 0, 1, 2]), t = d.pick([1, 2]), k = d.int(10, 20), m = s + t * (k - 1);
      const a1H = s < 0 ? frac(1, b) : String(b ** s), r = b ** t;
      const rel = nb(A('n+1') + ' = ' + r + A('n'));
      return numQ(`수열 ${jh(SEQ, '이/가')} ${A(1)} = ${a1H}이고 ${ALL} ${jh(rel, '을/를')} 만족시킨다. ${jh(nb(A(k) + ' = ' + pw(b, Mv)), '을/를')} 만족시키는 자연수 ${Mv}의 값은?`, m, {
        signed: false,
        explain: `수열 ${jh(SEQ, '은/는')} 첫째항이 ${a1H} = ${pw(b, s)}, 공비가 ${r}${r === b ? '' : ' = ' + pw(b, t)}인 등비수열이다. ${A(k)} = ${pw(b, s)} × (${pw(b, t)})${sup(k - 1)} = ${pw(b, m)}이므로 ${Mv} = ${m}이다.`,
        value: `${jn(s)}+${t}*(${k}-1)`, derived: [Math.abs(s), t]
      });
    }, { count: 2 }),

    T('term-findk', '등차 꼴 관계식에서 주어진 값이 되는 항의 번호', '①4', (d) => {
      const up = d.bool(), c = up ? d.int(2, 7) : -d.int(2, 7), k = d.int(8, 25), a1 = up ? d.int(-60, -5) : d.int(20, 90), t = a1 + (k - 1) * c;
      if (t === 0) return null;
      return numQ(`수열 ${SEQ}의 귀납적 정의가 ${A(1)} = ${num(a1)}, ${nb(A('n+1') + ' = ' + A('n') + plusC(c))} ${NN}일 때, ${jh(nb(ms('a_k') + ' = ' + num(t)), '을/를')} 만족시키는 자연수 ${Kv}의 값은?`, k, {
        signed: false,
        explain: `수열 ${jh(SEQ, '은/는')} 첫째항이 ${num(a1)}, 공차가 ${num(c)}인 등차수열이므로 ${nb(ms('a_k') + ' = ' + num(a1) + ' + (' + Kv + ' ' + MINUS + ' 1) × ' + par(c))}이다. 이것이 ${jh(num(t), '이/가')} 되는 ${Kv}는 ${k}이다.`,
        value: `(${jn(t)}-${jn(a1)})/${jn(c)}+1`
      });
    }),

    T('term-addn', '더하는 수가 n의 식인 관계식으로 항 구하기', '①5', (d, n) => {
      const k = d.int(5, 7), a1 = d.int(-5, 5);
      let f, fH, value, derived = [];
      if (n === 0) {
        if (d.bool()) {
          const p = d.int(1, 5), q = d.int(-4, 4);
          f = (i) => p * i + q; fH = poly([[p, Nv], [q, '']]);
          value = `${jn(a1)}+${p}*(${k}-1)*${k}/2+${jn(q)}*(${k}-1)`;
        } else {
          const q = d.int(-2, 2);
          f = (i) => i * i + q; fH = poly([[1, Nv + sup(2)], [q, '']]);
          value = `${jn(a1)}+(${k}-1)*${k}*(2*${k}-1)/6+${jn(q)}*(${k}-1)`; derived = [6];
        }
      } else {
        const b = d.pick([2, 3]), q = d.pick([0, 0, -1, 1, -2]);
        f = (i) => b ** i + q; fH = pw(b, Nv) + (q ? plusC(q) : '');
        value = `${jn(a1)}+(${b}**${k}-${b})/(${b}-1)+${jn(q)}*(${k}-1)`;
      }
      const vals = [a1];
      for (let i = 1; i < k; i += 1) vals.push(vals[i - 1] + f(i));
      if (big(vals[k - 1])) return null;
      return numQ(`수열 ${SEQ}의 귀납적 정의가 다음과 같을 때, ${A(k)}의 값은?`, vals[k - 1], {
        figure: defFig([`${A(1)} = ${num(a1)}, ${A('n+1')} = ${A('n')} + ${fH}`, NN]),
        explain: `${Nv}에 ${uptoJ(k - 1, '을/를')} 차례로 대입하면 ${vals.slice(1).map((v, i) => nb(`${A(i + 2)} = ${A(i + 1)} + ${par(f(i + 1))} = ${num(v)}`)).join(', ')}이다.`,
        value, derived
      });
    }, { count: 2 }),

    T('term-muln', '곱하는 수가 n의 식인 관계식으로 항 구하기', '①6', (d, n) => {
      const k = d.int(5, 6);
      if (n === 0) {
        const kind = d.int(0, 2), a1 = d.pick([1, 2, 3, -1, -2, 4, 5, -3]), c = d.pick([2, 3]);
        let rel, value, step, lead = '';
        if (kind === 0) { rel = `${A('n+1')} = ${frac(ms('n + 1'), Nv)}${A('n')}`; step = (i) => Q(i + 1, i); value = `${jn(a1)}*${k}`; }
        else if (kind === 1) { rel = `${A('n+1')} = ${frac(ms('n + 2'), Nv)}${A('n')}`; step = (i) => Q(i + 2, i); value = `${jn(a1)}*${k}*(${k}+1)/2`; }
        else {
          rel = `${Nv}${A('n+1')} = ${c}(${ms('n + 1')})${A('n')}`; step = (i) => Q(c * (i + 1), i); value = `${jn(a1)}*${k}*${c}**(${k}-1)`;
          lead = `양변을 ${jh(Nv, '으로/로')} 나누면 ${nb(A('n+1') + ' = ' + frac(c + ms('(n + 1)'), Nv) + A('n'))}이다. `;
        }
        const vals = [Q(a1)];
        for (let i = 1; i < k; i += 1) vals.push(qmul(vals[i - 1], step(i)));
        const v = vals[k - 1].p;
        if (big(v)) return null;
        return numQ(`수열 ${SEQ}의 귀납적 정의가 다음과 같을 때, ${A(k)}의 값은?`, v, {
          figure: defFig([`${A(1)} = ${num(a1)}, ${rel}`, NN]),
          explain: `${lead}${Nv}에 ${uptoJ(k - 1, '을/를')} 차례로 대입하면 ${vals.slice(1).map((x, i) => nb(`${A(i + 2)} = ${tx(step(i + 1))} × ${par(vals[i].p)} = ${num(x.p)}`)).join(', ')}이다.`,
          value
        });
      }
      // aₙ₊₁ = bⁿaₙ → aₖ = b^m
      const b = d.pick([2, 3]), s = d.int(0, 2), kk = d.int(5, 7), E = (kk * (kk - 1)) / 2, mm = s + E;
      return numQ(`수열 ${SEQ}의 귀납적 정의가 다음과 같다. ${jh(nb(A(kk) + ' = ' + pw(b, Mv)), '을/를')} 만족시키는 자연수 ${Mv}의 값은?`, mm, {
        signed: false,
        figure: defFig([`${A(1)} = ${b ** s}, ${A('n+1')} = ${pw(b, Nv)}${A('n')}`, NN]),
        explain: `${A(1)} = ${pw(b, s)}이고 ${Nv}에 ${uptoJ(kk - 1, '을/를')} 차례로 대입하면 지수에 ${uptoJ(kk - 1, '이/가')} 차례로 더해진다. ${A(kk)} = ${pw(b, s + ' + ' + upto(kk - 1).replace(/, /g, ' + '))} = ${pw(b, mm)}이므로 ${Mv} = ${mm}이다.`,
        value: `${s}+${kk}*(${kk}-1)/2`, derived: [s]
      });
    }, { count: 2 }),

    T('term-pattern', '곱하는 수가 n의 식인 관계식에서 먼 항을 규칙으로 구하기', '①7', (d) => {
      const kind = d.int(0, 1), a1 = d.pick([2, 3, 4, 5, 6, 10, -2, -3, -5]), k = d.int(12, 40);
      const rel = kind === 0 ? nb(`${A('n+1')} = ${frac(ms('n + 1'), Nv)}${A('n')}`) : nb(`${A('n+1')} = ${frac(ms('n + 2'), Nv)}${A('n')}`);
      const v = kind === 0 ? a1 * k : (a1 * k * (k + 1)) / 2;
      if (big(v)) return null;
      const show = kind === 0
        ? `${A(2)} = ${frac(2, 1)} × ${par(a1)}, ${A(3)} = ${frac(3, 2)} × ${frac(2, 1)} × ${par(a1)}, …이므로 ${nb(A('n') + ' = ' + par(a1) + ' × ' + Nv)}이다. 따라서 ${A(k)} = ${par(a1)} × ${k} = ${num(v)}이다.`
        : `${A(2)} = ${frac(3, 1)} × ${par(a1)}, ${A(3)} = ${frac(4, 2)} × ${frac(3, 1)} × ${par(a1)}, …이므로 ${nb(A('n') + ' = ' + par(a1) + ' × ' + frac(ms('n(n + 1)'), 2))}이다. 따라서 ${A(k)} = ${par(a1)} × ${frac(k + ' × ' + (k + 1), 2)} = ${num(v)}이다.`;
      return numQ(`수열 ${jh(SEQ, '이/가')} ${A(1)} = ${num(a1)}이고 ${ALL} ${jh(rel, '을/를')} 만족시킬 때, ${A(k)}의 값은?`, v, {
        explain: show,
        value: kind === 0 ? `${jn(a1)}*${k}` : `${jn(a1)}*${k}*(${k}+1)/2`
      });
    }),

    T('term-frac', '분수·제곱·근호가 낀 관계식으로 항 구하기', '①8', (d, n) => {
      if (n === 0) {
        if (d.bool()) {
          // aₙ₊₁ = c/aₙ — 두 값이 번갈아 나온다
          const qd = d.int(2, 5), pn = d.pick([1, 2, 3, 4, 5, 6, 7].filter((x) => x % qd !== 0)), sg = d.pick([1, -1]), c = d.pick([1, 2, 3, 6]), k = d.int(5, 9);
          const a1 = Q(sg * pn, qd), a2 = qdiv(Q(c), a1);
          if (a1.q === 1 || a2.q === 1) return null;
          const v = k % 2 === 1 ? a1 : a2;
          return ratQ(`수열 ${SEQ}의 귀납적 정의가 다음과 같을 때, ${A(k)}의 값은?`, v, {
            figure: defFig([`${A(1)} = ${tx(a1)}, ${A('n+1')} = ${frac(c, A('n'))}`, NN]),
            explain: `${A(2)} = ${frac(c, A(1))} = ${tx(a2)}, ${A(3)} = ${frac(c, A(2))} = ${tx(a1)}, …이므로 ${jh(tx(a1), '과/와')} ${jh(tx(a2), '이/가')} 번갈아 나온다. ${josa(k, '은/는')} ${k % 2 ? '홀수' : '짝수'}이므로 ${A(k)} = ${tx(v)}이다.`,
            value: k % 2 === 1 ? jq(a1) : `${c}/${jq(a1)}`
          });
        }
        // aₙ₊₁ = aₙ/(c·aₙ + 1), a₁ = 1/p
        const p = d.int(1, 5), c = d.pick([1, 2, 3]), k = d.int(4, 6), vals = Array.from({ length: k }, (_, i) => Q(1, p + c * i));
        const den = (c === 1 ? '' : c) + A('n') + ' + 1';
        return ratQ(`수열 ${SEQ}의 귀납적 정의가 다음과 같을 때, ${A(k)}의 값은?`, vals[k - 1], {
          figure: defFig([`${A(1)} = ${tx(Q(1, p))}, ${A('n+1')} = ${frac(A('n'), den)}`, NN]),
          explain: `${Nv}에 ${uptoJ(k - 1, '을/를')} 차례로 대입하면 ${listA(vals.slice(1), 2)}이다.`,
          value: `1/(${p}+${c}*(${k}-1))`
        });
      }
      if (n === 1) {
        // aₙ₊₁ = aₙ² + c
        const a1 = d.pick([-2, -1, 1, 2, 3]), c = d.pick([-3, -2, -1, 1, 2]), k = d.int(4, 5), vals = [a1];
        for (let i = 1; i < k; i += 1) vals.push(vals[i - 1] ** 2 + c);
        if (big(vals[k - 1]) || new Set(vals).size < k - 1) return null;
        let e = jn(a1);
        for (let i = 1; i < k; i += 1) e = `(${e})**2+${jn(c)}`;
        return numQ(`수열 ${SEQ}의 귀납적 정의가 다음과 같을 때, ${A(k)}의 값은?`, vals[k - 1], {
          figure: defFig([`${A(1)} = ${num(a1)}, ${A('n+1')} = ${A('n')}${sup(2)}${plusC(c)}`, NN]),
          explain: `${Nv}에 ${uptoJ(k - 1, '을/를')} 차례로 대입하면 ${vals.slice(1).map((v, i) => nb(`${A(i + 2)} = ${par(vals[i])}${sup(2)}${plusC(c)} = ${num(v)}`)).join(', ')}이다.`,
          value: e
        });
      }
      // aₙ₊₁ = √aₙ, (aₖ)^m = b
      const [b0, e] = d.pick([[2, 2], [2, 4], [2, 8], [3, 2], [3, 4], [5, 2], [5, 4]]), a1 = b0 ** e, lo = Math.log2(e) + 2, k = d.int(lo, Math.min(7, lo + 3)), m = 2 ** (k - 1) / e;
      return numQ(`모든 항이 양수인 수열 ${SEQ}의 귀납적 정의가 다음과 같다. ${jh(nb('(' + A(k) + ')' + sup(Mv) + ' = ' + b0), '을/를')} 만족시키는 실수 ${Mv}의 값은?`, m, {
        figure: defFig([`${A(1)} = ${a1}, ${A('n+1')} = ${rt(A('n'))}`, NN]),
        explain: `${A(1)} = ${pw(b0, e)}이고 다음 항으로 갈 때마다 지수가 반이 된다. ${Array.from({ length: k - 1 }, (_, i) => { const ex = Q(e, 2 ** (i + 1)); return nb(A(i + 2) + ' = ' + (ex.q === 1 ? pw(b0, ex.p) : pw(b0, [ex.p, ex.q]))); }).join(', ')}이므로 ${nb('(' + A(k) + ')' + sup(Mv) + ' = ' + pw(b0, [Mv, m]) + ' = ' + b0)}에서 ${Mv} = ${m}이다.`,
        value: `2**(${k}-1)/${e}`, derived: [e]
      });
    }, { count: 3 }),

    T('term-log', '로그로 준 관계식으로 항의 지수 구하기', '①9', (d) => {
      const b = d.pick([2, 3]), p = d.int(1, 3), k = d.int(5, 7), E = (p * k * (k - 1)) / 2;
      const rs = [2, 3, 4, 5, 6].filter((r) => E % r === 0 && b ** r <= 729 && E / r >= 2);
      if (!rs.length) return null;
      const r = d.pick(rs), base = b ** r, m = E / r;
      const pn = (p === 1 ? '' : p) + Nv;
      return numQ(`수열 ${SEQ}의 귀납적 정의가 다음과 같다. ${jh(nb(A(k) + ' = ' + pw(base, Mv)), '을/를')} 만족시키는 자연수 ${Mv}의 값은?`, m, {
        signed: false,
        figure: defFig([`${A(1)} = 1, ${lg(b, A('n+1'))} = ${pn} + ${lg(b, A('n'))}`, NN]),
        explain: `${lg(b, A(1))} = 0이고 ${Nv}에 ${uptoJ(k - 1, '을/를')} 차례로 대입하면 ${lg(b, A(k))} = ${Array.from({ length: k - 1 }, (_, i) => p * (i + 1)).join(' + ')} = ${E}이다. ${A(k)} = ${pw(b, E)} = (${pw(b, r)})${sup(m)} = ${pw(base, m)}이므로 ${Mv} = ${m}이다.`,
        value: `${p}*${k}*(${k}-1)/2/${r}`, derived: [r]
      });
    }),

    T('term-two', '앞의 두 항으로 다음 항을 정하는 관계식', '①10', (d) => {
      const [p, q] = d.pick([[1, 1], [1, 2], [2, 1], [1, -1], [3, -2], [2, 3]]), a1 = d.pick([1, 2, 3, -1, -2]), a2 = d.pick([1, 2, 3, 4, -1, -3]), k = d.int(6, 7);
      const vals = [a1, a2], exprs = [jn(a1), jn(a2)];
      for (let i = 2; i < k; i += 1) { vals.push(p * vals[i - 1] + q * vals[i - 2]); exprs.push(`${jn(p)}*(${exprs[i - 1]})+${jn(q)}*(${exprs[i - 2]})`); }
      if (big(vals[k - 1]) || vals[k - 1] === 0 || a1 === a2) return null;
      return numQ(`수열 ${SEQ}의 귀납적 정의가 다음과 같을 때, ${A(k)}의 값은?`, vals[k - 1], {
        figure: defFig([`${A(1)} = ${num(a1)}, ${A(2)} = ${num(a2)}`, `${A('n+2')} = ${poly([[p, A('n+1')], [q, A('n')]])}`, NN]),
        explain: `${Nv}에 ${uptoJ(k - 2, '을/를')} 차례로 대입하면 ${listA(vals.slice(2), 3)}이다.`,
        value: exprs[k - 1]
      });
    }),

    T('term-sum', '관계식으로 항을 구해 첫째항부터의 합 구하기', '①11', (d) => {
      const a1 = d.int(-4, 4), p = d.int(1, 4), q = d.int(-3, 3), N0 = d.int(4, 6), vals = [a1], exprs = [jn(a1)];
      for (let i = 1; i < N0; i += 1) { vals.push(vals[i - 1] + p * i + q); exprs.push(`(${exprs[i - 1]})+${p}*${i}+${jn(q)}`); }
      const total = vals.reduce((s, v) => s + v, 0);
      if (total === 0) return null;
      return numQ(`수열 ${SEQ}의 귀납적 정의가 다음과 같을 때, ${sum('k=1', N0, 'a_k')}의 값은?`, total, {
        figure: defFig([`${A(1)} = ${num(a1)}, ${A('n+1')} = ${A('n')} + ${poly([[p, Nv], [q, '']])}`, NN]),
        explain: `${Nv}에 ${uptoJ(N0 - 1, '을/를')} 차례로 대입하면 ${listA(vals.slice(1), 2)}이다. 따라서 구하는 합은 ${vals.map(par).join(' + ')} = ${num(total)}이다.`,
        value: exprs.map((e) => '(' + e + ')').join('+'), derived: Array.from({ length: N0 }, (_, i) => i)
      });
    })
  ]);

  // ════════════════════════════════════════════════════════════════
  // ── 거꾸로 구하기와 미지수 ──
  B.addTypes(UNIT, 'back', [
    T('back-first', '첫째항이 미지수일 때 뒤의 항으로 거꾸로 구하기', '①12', (d, n) => {
      const m = d.int(3, 6);
      if (n === 0) {
        const p = d.int(2, 5), q = d.int(-3, 3), a = d.int(-10, 10), vals = [a];
        for (let i = 1; i < m; i += 1) vals.push(vals[i - 1] + p * i + q);
        const am = vals[m - 1], fH = poly([[p, Nv], [q, '']]);
        return numQ(`수열 ${SEQ}의 귀납적 정의가 다음과 같다. ${A(m)} = ${num(am)}일 때, 실수 ${Av}의 값은?`, a, {
          figure: defFig([`${A(1)} = ${Av}, ${A('n+1')} = ${A('n')} + ${fH}`, NN]),
          explain: `${nb(A('n') + ' = ' + A('n+1') + ' ' + MINUS + ' (' + fH + ')')}이므로 ${Nv}에 ${Array.from({ length: m - 1 }, (_, i) => m - 1 - i).join(', ')}을 차례로 대입하면 ${vals.slice(0, m - 1).reverse().map((v, i) => nb(`${A(m - 1 - i)} = ${num(v)}`)).join(', ')}이다. 따라서 ${Av} = ${num(a)}이다.`,
          value: `${jn(am)}-${p}*(${m}-1)*${m}/2-${jn(q)}*(${m}-1)`
        });
      }
      // aₙ₊₁ = paₙ + q, a₁ = a 는 정수가 아닌 분수
      const p = d.pick([2, 3, -2]), q = d.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]), u = d.pick([1, -1]) * d.pick([1, 2, 4, 5, 7].filter((x) => x % Math.abs(p) !== 0));
      const a = Q(u, Math.abs(p)), vals = [a];
      for (let i = 1; i < m; i += 1) vals.push(qadd(qmul(Q(p), vals[i - 1]), Q(q)));
      const am = vals[m - 1];
      if (am.q !== 1 || big(am.p)) return null;
      const half = () => nb(A('n') + ' = ' + frac(A('n+1') + ' ' + (q < 0 ? '+ ' + Math.abs(q) : MINUS + ' ' + q), num(p)));
      return ratQ(`수열 ${SEQ}의 귀납적 정의가 다음과 같다. ${A(m)} = ${num(am.p)}일 때, 실수 ${Av}의 값은?`, a, {
        figure: defFig([`${A(1)} = ${Av}, ${A('n+1')} = ${num(p)}${A('n')}${plusC(q)}`, NN]),
        explain: `${half()}이므로 ${Nv}에 ${Array.from({ length: m - 1 }, (_, i) => m - 1 - i).join(', ')}을 차례로 대입하면 ${vals.slice(0, m - 1).reverse().map((v, i) => nb(`${A(m - 1 - i)} = ${tx(v)}`)).join(', ')}이다. 따라서 ${Av} = ${tx(a)}이다.`,
        value: `(${jn(am.p)}-${jn(q)}*(${jn(p)}**(${m}-1)-1)/(${jn(p)}-1))/${jn(p)}**(${m}-1)`
      });
    }, { count: 2 }),

    T('back-prod', '이웃한 두 항의 곱이 일정한 수열에서 첫째항 구하기', '①13', (d) => {
      const c = d.pick([12, 18, 20, 24, 30, 36, 48]), divs = [];
      for (let v = 1; v <= c; v += 1) if (c % v === 0 && v * v !== c && v !== 1 && v !== c) divs.push(v);
      const v = d.pick(divs) * d.pick([1, -1]), m = d.int(5, 9), a = m % 2 === 1 ? v : c / v;
      return numQ(`수열 ${SEQ}의 귀납적 정의가 다음과 같다. ${A(m)} = ${num(v)}일 때, 실수 ${Av}의 값은? (단, ${nb(Av + ' ≠ 0')})`, a, {
        figure: defFig([`${A(1)} = ${Av}, ${A('n')}${A('n+1')} = ${c}`, NN]),
        explain: `${nb(A('n') + A('n+1') + ' = ' + c)}, ${nb(A('n+1') + A('n+2') + ' = ' + c)}에서 ${nb(A('n+2') + ' = ' + A('n'))}이므로 홀수 번째 항끼리, 짝수 번째 항끼리 같다. ${A(1)} = ${Av}이면 짝수 번째 항은 ${frac(c, Av)}이다. ${josa(m, '은/는')} ${m % 2 ? '홀수' : '짝수'}이므로 ${m % 2 ? `${Av} = ${num(v)}` : `${nb(frac(c, Av) + ' = ' + num(v))}에서 ${Av} = ${num(a)}`}이다.`,
        value: m % 2 === 1 ? jn(v) : `${c}/${jn(v)}`
      });
    }),

    T('back-const', '관계식 속 상수를 두 항으로 정하고 다음 항 구하기', '①14', (d) => {
      const b = d.pick([2, 3]), [i, j] = d.pick([[1, 4], [2, 5], [1, 3], [2, 4]]), k = d.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]), ai = d.int(-5, 10);
      const vals = {}; vals[i] = ai;
      for (let t = i; t <= j; t += 1) vals[t + 1] = vals[t] + b ** t + k;
      const aj = vals[j], next = vals[j + 1];
      if (big(next)) return null;
      const kH = `(${jn(aj)}-${jn(ai)}-(${b}**${j}-${b}**${i})/(${b}-1))/(${j}-${i})`;
      const rel = nb(A('n+1') + ' = ' + A('n') + ' + ' + pw(b, Nv) + ' + ' + Kv);
      return slots(`수열 ${jh(SEQ, '이/가')} ${ALL} ${jh(rel, '을/를')} 만족시킨다. ${A(i)} = ${num(ai)}, ${A(j)} = ${num(aj)}일 때, 상수 ${Kv}의 값과 ${A(j + 1)}의 값은?`, [[Kv, k, kH], [A(j + 1), next, `${jn(aj)}+${b}**${j}+${kH}`]], {
        explain: `${Nv}에 ${Array.from({ length: j - i - 1 }, (_, t) => i + t + ', ').join('')}${tj(Q(j - 1), '을/를')} 차례로 대입하면 ${A(j)} = ${num(ai)} + (${Array.from({ length: j - i }, (_, t) => pw(b, i + t)).join(' + ')}) + ${j - i}${Kv} = ${Array.from({ length: j - i }, (_, t) => b ** (i + t)).reduce((s, x) => s + x, ai)} + ${j - i}${Kv}이다. 이것이 ${num(aj)}이므로 ${Kv} = ${num(k)}이고, ${A(j + 1)} = ${A(j)} + ${pw(b, j)} + ${Kv} = ${num(aj)} + ${b ** j} + ${par(k)} = ${num(next)}이다.`
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
