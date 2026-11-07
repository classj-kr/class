// 미적분Ⅰ Ⅱ-1 미분계수와 도함수 — 단원 틀·도구와 앞쪽 묶음(평균변화율, 미분계수, 미분계수의 기하적 의미).
// 수집해 둔 천재 T셀파 미적분Ⅰ(홍진곤, 2022 개정)의 교과서·평가 자료에서 뽑은 문제 꼴 목록(기본꼴_1: 44꼴, 심화 문서 없음)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/11-2-3/싣기_대조표.md 에 있다.
// (미분가능성과 연속성, 도함수와 미분법, 미분법의 활용은 11-2-3b.js 에, 실력 문항은 11-2-3c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번. 영역은 미분. 성취기준은 12미적Ⅰ-02-01(미분계수), 02-02(미분가능성과 연속성), 02-03(y = xⁿ의 도함수), 02-04(실수배·합·차·곱의 미분법).
// 고2·3 선택 과목은 grade 11, semester 자리에 과목 번호(2 미적분Ⅰ)를 둔다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(식·극한식·표·그래프·조건), 묻는 것(값·식·고르기·옳은 것 모두), 극한식의 꼴(h 앞의 계수, 분모 x² − a²,
//    앞뒤가 함께 움직이는 꼴, x·f(a)가 섞인 꼴)이 다르면 따로 싣는다. 수만 바꾼 유형은 만들지 않는다.
//  - 사용자가 정한 대로 내신 대비이며 수학 실력에 필요한 꼴은 다 싣는다. 교육과정의 「지나치게 복잡한 계산을 포함하는 문제는 다루지 않는다」는
//    정도의 줄이라 빼는 까닭으로 쓰지 않았다. 실력은 ① 뜻을 정확히 대야 풀리는 함정 문제 ② 세 단계 넘게 잇는 문제만 두었다.
//  - 답: 수는 qAns(정수 칸, 분수는 분자·분모 칸 — 한 유형 안에서는 늘 정수이거나 늘 분수가 되게 수를 고른다), 식(평균변화율의 식·도함수)은 polyQ
//    (polyAns 와 같은 항마다 계수 칸 — 칸과 문자를 한 덩어리로 묶었다. 0인 항이 생기지 않게 수를 고른다), 나머지 일차식은 linAns, 값 둘은 식 속 칸(inline), 참·거짓은 고르기로 받는다.
//    음수가 될 수 있는 수 칸에는 모두 부호 단추를 단다(자연수 n, 지수, 정의로 구하는 과정의 계수만 뺀다).
//    원문의 「t + a」「a − b」「f(1) + f′(1)」「f′(3)/f(3)」처럼 따로 구한 값을 뜻 없이 묶은 꼴은 값을 칸마다 받는다.
//  - 그림: 그래프는 공용 plot(B.kit.hs)으로 그린다. 교점8(①17)의 그래프는 원문 그림이 작아 답 f′(d), f′(e)에 맞게 새로 지었다.
//  - 답은 모두 코드가 셈하고, 참·거짓은 손으로 적지 않고 함수의 값·차분몫을 셈해 가린다.
//  - 검사 근거: 수 칸은 문제에 적힌 수로 다시 셈하는 식(facts.calc·value)이고, 글에 없는 수(미분해서 생기는 2, 3 …)는 seal 이 facts.unseen 에 밝힌다.
//
// 뺀 것과 까닭(11-2-3b.js, 11-2-3c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 같은 과목 다른 단원의 일: ①5(평균변화율과 미분계수가 같아지는 상수 — 11-2-4 「평균값 정리」의 c 구하기와 같은 셈이라 그 단원에 둔다).
//  - 겹침(같은 일): ①6(정의로 x = a에서의 미분계수 — 원문에 과정 빈칸 꼴이 없어 deriv-value 와 합침), ①24(정의로 도함수 — deriv-sum 과 합침),
//    ①42 교수2(나누는 식 (2x − 1)²의 나머지 계수가 분수 — 같은 일을 use-rem 둘째 차례에 실었다).
//  - 활동만인 것: 교 63쪽 생각 열기(공학 도구로 할선의 기울기 추측), 교 73쪽 읽을거리(한계 비용·전류).
//  - 범위의 경계: 중간21(함수의 극한 11-2-1 몫), 접선의 방정식·평균값 정리·증가와 감소(11-2-4·11-2-5)는 꼴 목록에 세지 않았다.
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, frac, lines, box, N, M, C, D, inline } = B.kit;
  const { MINUS, gcd, Q, nb: nb0, tail, V, sup, tag, nz, mono, poly, linAns, claimQ, rt, grp } = B.kit.mid;
  const { ms, lim, jh, hx, qAns, plot, signed } = B.kit.hs;
  const S1 = '12미적Ⅰ-02-01', S2 = '12미적Ⅰ-02-02', S3 = '12미적Ⅰ-02-03', S4 = '12미적Ⅰ-02-04';

  // ── 긴 식의 줄 바꿈(10-1-3a.js 와 같은 방법) ──
  // 붙여 쓴 식(white-space:nowrap)이 길면 360px 화면에서 문항 밖으로 넘친다(풀이의 등식 사슬). 긴 식은 겉에 드러난 관계 기호(=, <, > …) 앞에서,
  // 그 조각도 길면 괄호 밖의 +, − 앞에서 줄이 갈릴 수 있게 조각마다 붙여 둔다. 짧은 식은 통째로 붙여 둔다. 글자와 빈칸은 그대로라 글로 읽은 식과 토씨는 바뀌지 않는다.
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
  // 문항에서 보이는 수(검사와 같은 방법으로 읽는다): 글·그림(그림 설명 포함)·보기
  const stripH = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  function visibleNumbers(item) {
    const seen = stripH([item.text, item.figure || ''].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, ' $1 ').replace(/<table[^>]*aria-label="([^"]*)"[^>]*>/g, ' $1 | '));
    return new Set((seen.match(/\d+/g) || []).concat(seen.match(/\d+\.\d+/g) || [], seen.replace(/(\d) (?=\d)/g, '$1').match(/\d+/g) || []));
  }
  // 다시 셈하는 식의 수 가운데 글에 보이지 않는 수를 facts.unseen 에 밝힌다. 0과 1과 o.derived 로 밝히기로 한 수만 된다(아니면 식을 잘못 적은 것이라 오류를 낸다).
  function seal(item) {
    const f = item.facts || {};
    // 셈이 0으로 끝나는 식은 −0이 될 수 있다. 검사는 −0과 0을 가르므로 +0 을 붙여 0으로 맞춘다.
    if (f.calc) f.calc = f.calc.map(([t, i]) => [`(${t})+0`, i]);
    if (f.value !== undefined) f.value = `(${f.value})+0`;
    const derived = new Set((f.derived || []).map(Number).concat([0, 1])), shown = visibleNumbers(item), out = new Set(f.unseen || []);
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
  // 만들기가 null 을 돌려주면(조건에 맞지 않는 수) 다시 만든다. 다 만든 문항은 seal 로 검사 근거를 마무리한다.
  const retry = (make) => (d, n) => { for (let i = 0; i < 4000; i += 1) { const item = make(d, n); if (item) return seal(item); } throw new Error('조건에 맞는 문항을 만들지 못했다'); };
  const srcOf = (ref) => '수집본 기본 자료(' + ref + ')';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: srcOf(ref), make: retry(make) }, more || {});
  const HT = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: srcOf(ref), make: retry(make) }, more || {});

  // ── 글 ──
  const X = V('x'), Hh = V('h'), Tt = V('t'), Av = V('a'), Bv = V('b'), Kv = V('k'), DX = 'Δ' + V('x');
  const sT = signed;                                                          // 화면에 적는 정수(음수는 −)
  const pp = (n) => (n < 0 ? '(' + sT(n) + ')' : String(n));                  // 빼거나 곱하는 자리의 정수: (−3)
  const jn = (n) => (n < 0 ? '(' + n + ')' : String(n));                      // 검사 식에 적는 정수
  const pt = (x, y) => nb(`(${sT(x)}, ${sT(y)})`);
  const NOTE1 = ' <span style="white-space:nowrap">(단, 계수가 1이면 1을 적는다.)</span>';
  // ms 에 넘길 일차식 글: lin2(2, -3, 'h') → '2 - 3h', lin2(0, 1, 'h') → 'h'
  const lin2 = (p, m, v) => { const mv = (Math.abs(m) === 1 ? '' : Math.abs(m)) + v; return p === 0 ? (m < 0 ? '-' : '') + mv : p + (m < 0 ? ' - ' : ' + ') + mv; };
  // 「f(x) − 3」「f(x) + 2」처럼 상수를 빼는 글(ms 글). c 가 0이면 그대로.
  const minus = (h, c) => (c === 0 ? h : h + (c < 0 ? ' + ' + (-c) : ' - ' + c));
  const fa = (arg, name) => ms((name || 'f') + '(' + arg + ')');            // f(2), f(−1)
  const dfa = (arg, name) => ms((name || 'f') + "'(" + arg + ')');          // f′(2)
  const xm = (p) => ms(p === 0 ? 'x' : p < 0 ? 'x + ' + (-p) : 'x - ' + p);  // x − p(p 가 음수면 x + |p|)
  const cf = (k, h) => (k === 1 ? h : k === -1 ? MINUS + h : sT(k) + h);      // 계수를 붙인 글: 1·−1 은 적지 않는다
  const qT = (q) => (q.q === 1 ? sT(q.p) : nb((q.p < 0 ? MINUS : '') + frac(Math.abs(q.p), q.q)));   // 유리수의 글

  // ── 다항식(오름차순 계수의 배열: cs[k] = x^k 의 계수) ──
  const term = (k, v) => (k === 0 ? '' : k === 1 ? v : v + sup(k));
  const pH = (cs, v) => poly(cs.map((c, k) => [c, term(k, v || X)]).reverse());
  const fval = (cs, x) => cs.reduce((s, c, k) => s + c * x ** k, 0);
  const dcs = (cs) => cs.slice(1).map((c, k) => c * (k + 1));
  const mul = (p, q) => { const out = Array(p.length + q.length - 1).fill(0); p.forEach((a, i) => q.forEach((b, j) => { out[i + j] += a * b; })); return out; };
  const add = (p, q) => Array.from({ length: Math.max(p.length, q.length) }, (_, i) => (p[i] || 0) + (q[i] || 0));
  // 검사 식: f(x0) = Σ c·x0·x0…, f′(x0) = Σ k·c·x0…(거듭제곱은 곱으로 풀어 적어 지수의 수를 쓰지 않는다)
  const fJ = (cs, x0) => cs.map((c, k) => (c === 0 ? null : [jn(c)].concat(Array(k).fill(jn(x0))).join('*'))).filter(Boolean).join('+') || '0';
  const dJ = (cs, x0) => cs.map((c, k) => (k === 0 || c === 0 ? null : [String(k), jn(c)].concat(Array(k - 1).fill(jn(x0))).join('*'))).filter(Boolean).join('+') || '0';
  // 「f(x) = 2x² − 3x + 1」(f(x) = 이 앞 줄에 홀로 남지 않게 묶는다)
  const fIs = (cs, name, v) => nb(ms((name || 'f') + '(' + (v || 'x') + ')') + ' =') + ' ' + pH(cs, v ? V(v) : X);
  const yIs = (h) => nb(ms('y') + ' =') + ' ' + h;
  const hasZero = (list) => list.some((c) => c === 0);

  // ── 답 ──
  // 수 하나: 정수는 수 칸, 분수는 분자·분모 칸. 음수가 될 수 있으면 부호 단추(o.signed === false 일 때만 뗀다).
  const val = (text, v, o) => qAns(text, v, { signed: o.signed !== false, figure: o.figure, explain: o.explain, unit: o.unit,
    facts: Object.assign({ value: o.value }, o.derived ? { derived: o.derived } : {}, o.rule ? { rule: o.rule } : {}) });
  // 식 속 칸 여럿: rows 는 [답, 검사 식, 부호 단추(false 면 뗀다)]
  //  틀은 「f(2) = {0}, f′(2) = {1}」처럼 쉼표로 이어 적는다. 쉼표마다 끊어 「이름 = 칸」을 한 덩어리로 묶는다(좁은 화면에서 칸만 다음 줄로 떨어지지 않게).
  const slots = (text, tpl, rows, o) => inline(text, tpl.split(', ').map((s, i, all) => grp(s + (i < all.length - 1 ? ',' : ''))).join(' '), rows.map(([a, , sg]) => Object.assign({ answer: a + 0 }, sg === false ? {} : { signed: true })),
    { shown: o.shown, figure: o.figure, explain: o.explain, facts: Object.assign({ calc: rows.map(([, e], i) => [e, i]) }, o.derived ? { derived: o.derived } : {}, o.rule ? { rule: o.rule } : {}) });
  // 다항식 답: 항마다 「[±][ ] 문자」 칸(계수는 0이 아닌 정수 — 1이어도 1을 적는다). rows 는 [계수, 문자 글, 검사 식].
  //  lead 를 주면 앞에 붙인다(「y′ =」). 칸과 그 뒤의 문자는 한 덩어리로 묶어 좁은 화면에서 문자만 다음 줄로 떨어지지 않게 한다.
  const polyQ = (text, rows, o, lead) => inline(text + NOTE1, (lead ? lead + ' ' : '') + rows.map(([, v], i) => grp('{' + i + '}' + v)).join(' '), rows.map(([k]) => ({ answer: k + 0, signed: true })), {
    shown: (lead ? lead + ' ' : '') + poly(rows.map(([k, v]) => [k, v])), figure: o.figure, explain: o.explain,
    facts: Object.assign({ calc: rows.map(([, , e], i) => [e, i]) }, o.derived ? { derived: o.derived } : {}, o.rule ? { rule: o.rule } : {}) });

  // ── 보기 짜기 ──
  const GA = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ'];
  const bogi = (list) => lines(list.map((h, i) => '<span class="mb-tag mb-tag-short">' + GA[i] + '.</span>' + h));
  // 「옳은 것만을 있는 대로 고른 것」: rows 는 { h 글, ok 옳은가, why 까닭 }. 옳은 묶음 하나와, 하나를 빼거나 더하거나 바꾼 틀린 묶음을 섞어 다섯(보기 셋 이상) 또는 셋.
  //  o.labels 를 주면 그 이름표(글)로 묶음을 적고 보기 상자는 그리지 않는다(그래프의 f′(a)… 고르기).
  function setsQ(d, text, rows, o) {
    const opt = o || {}, labels = opt.labels || GA.slice(0, rows.length), flags = rows.map((r) => Boolean(r.ok));
    if (!flags.some(Boolean) || flags.every(Boolean)) return null;
    const key = (s) => s.join('|'), right = labels.filter((_, i) => flags[i]), near = [], far = [];
    labels.forEach((_, i) => { const t = labels.filter((__, j) => (j === i ? !flags[j] : flags[j])); if (t.length) near.push(t); });
    labels.forEach((_, i) => labels.forEach((__, j) => { if (flags[i] && !flags[j]) near.push(labels.filter((___, k) => (k === i ? false : k === j ? true : flags[k]))); }));
    for (let m = 1; m < (1 << labels.length); m += 1) far.push(labels.filter((_, k) => (m >> k) & 1));
    const want = opt.count || (labels.length >= 3 ? 5 : 3), out = [right], seen = new Set([key(right)]);
    for (const cand of d.shuffle(near).concat(d.shuffle(far))) { if (out.length === want) break; if (!seen.has(key(cand))) { seen.add(key(cand)); out.push(cand); } }
    const order = (s) => s.map((l) => labels.indexOf(l)).join(',');
    const sets = d.shuffle(out).sort((a, b) => a.length - b.length || order(a).localeCompare(order(b)));
    const why = rows.map((r, i) => (r.why ? (opt.labels ? '' : labels[i] + '. ') + r.why : '')).filter(Boolean).join(' ');
    const shown = (s) => (opt.join ? opt.join(s) : s.join(', '));
    return C(text, sets.map(shown), sets.findIndex((s) => key(s) === key(right)), {
      figure: (opt.figure || '') + (opt.labels ? '' : bogi(rows.map((r) => r.h))),
      explain: (opt.lead ? opt.lead + ' ' : '') + why + ` 따라서 ${opt.what || '옳은 것'}은 ${shown(right)}이다.`,
      facts: Object.assign({ sets: { labels, flags, options: sets } }, opt.rule ? { rule: opt.rule } : {})
    });
  }
  // 하나 고르기: rows 가운데 ok 가 want 인 것이 꼭 하나다.
  function oneQ(d, text, rows, want, o) {
    const opt = o || {}, list = opt.keep ? rows.slice() : d.shuffle(rows);
    if (list.filter((r) => r.ok === want).length !== 1) return null;
    if (new Set(list.map((r) => stripH(r.h))).size !== list.length) return null;
    const at = list.findIndex((r) => r.ok === want);
    return C(text, list.map((r) => r.h), at, { figure: opt.figure, explain: opt.explain || list[at].why || '', facts: Object.assign({ truth: list.map((r) => r.ok), want }, opt.rule ? { rule: opt.rule } : {}) });
  }

  // ════════════════════════════════════════════════════════════════
  // ── 평균변화율 ──
  const rate = [
    T('rate-interval', '두 수 사이의 평균변화율', '①1', (d) => {
      const deg = d.pick([2, 3]);
      const cs = deg === 2 ? [d.int(-6, 6), d.int(-6, 6), nz(d, -3, 3)] : [d.int(-5, 5), nz(d, -4, 4), d.int(-3, 3), d.pick([1, -1, 2])];
      const p = d.int(-3, 2), q = p + d.int(1, 3), fp = fval(cs, p), fq = fval(cs, q);
      if ((fq - fp) % (q - p) !== 0) return null;
      const ans = (fq - fp) / (q - p);
      return val(`함수 ${fIs(cs)}에서 ${X}의 값이 ${sT(p)}에서 ${sT(q)}까지 변할 때의 평균변화율은?`, ans, {
        explain: `평균변화율은 ${frac(fa(q) + ' − ' + fa(p), q + ' − ' + pp(p))} = ${frac(sT(fq) + ' − ' + pp(fp), q - p)} = ${sT(ans)}이다.`,
        value: `((${fJ(cs, q)})-(${fJ(cs, p)}))/(${jn(q)}-${jn(p)})`
      });
    }, { standard: S1 }),

    // n = 0: 수 p 에서 p + h 까지(h 의 식), n = 1: a 에서 a + Δx 까지(a 와 Δx 의 식)
    T('rate-delta', '증분을 문자로 둔 평균변화율의 식', '①2', (d, n) => {
      const A = nz(d, -3, 3), Bc = nz(d, -6, 6), Cc = d.int(-5, 5), cs = [Cc, Bc, A];
      if (n === 0) {
        const p = d.int(-3, 3), c0 = 2 * A * p + Bc;
        if (c0 === 0) return null;
        return polyQ(`함수 ${fIs(cs)}에서 ${X}의 값이 ${sT(p)}에서 ${ms(lin2(p, 1, 'h'))}까지 변할 때의 평균변화율을 ${Hh}에 대한 식으로 나타내면?`, [[A, Hh, jn(A)], [c0, '', `2*${jn(A)}*${jn(p)}+${jn(Bc)}`]], {
          explain: `평균변화율은 ${frac(fa(lin2(p, 1, 'h')) + ' − ' + fa(p), Hh)} = ${frac(pH([0, c0, A], Hh), Hh)} = ${pH([c0, A], Hh)}이다.`, derived: [2]
        });
      }
      return polyQ(`함수 ${fIs(cs)}에서 ${X}의 값이 ${Av}에서 ${ms('a + Δx')}까지 변할 때의 평균변화율을 ${Av}, ${DX}에 대한 식으로 나타내면?`, [[2 * A, Av, `2*${jn(A)}`], [A, DX, jn(A)], [Bc, '', jn(Bc)]], {
        explain: `평균변화율은 ${frac(fa('a + Δx') + ' − ' + fa('a'), DX)}이고, 분자를 정리하면 ${poly([[2 * A, Av + DX], [A, '(' + DX + ')' + sup(2)], [Bc, DX]])}이므로 ${DX}로 나누면 ${poly([[2 * A, Av], [A, DX], [Bc, '']])}이다.`, derived: [2]
      });
    }, { count: 2, standard: S1 }),

    T('rate-table', '표로 주어진 양의 평균변화율', '①3', (d) => {
      const gaps = [d.pick([5, 10]), d.pick([5, 10]), d.pick([5, 10])], days = [1];
      gaps.forEach((g) => days.push(days[days.length - 1] + g));
      const hs = [d.int(8, 20)];
      gaps.forEach((g) => hs.push(hs[hs.length - 1] + d.int(Math.ceil(g * 0.6), g * 3)));
      const i = d.int(0, 2), j = d.int(i + 1, 3), dh = hs[j] - hs[i], dd = days[j] - days[i];
      if (dh % dd === 0 || (dh * 10) % dd !== 0) return null;
      const ans = dh / dd;
      const table = '<table class="mb-table" aria-label="표: 날짜와 키(cm) — ' + days.map((x, k) => x + '일 ' + hs[k]).join(', ') + '"><thead><tr><th>날짜</th><th>키(cm)</th></tr></thead><tbody>'
        + days.map((x, k) => '<tr><td>' + x + '일</td><td>' + hs[k] + '</td></tr>').join('') + '</tbody></table>';
      return D(`다음은 어느 식물의 키를 날짜별로 잰 것이다. ${X}일에 잰 키를 ${ms('f(x)')} cm라 할 때, ${X}의 값이 ${days[i]}에서 ${days[j]}까지 변할 때 ${ms('f(x)')}의 평균변화율은?`, ans, {
        figure: table, explain: `평균변화율은 ${frac(fa(days[j]) + ' − ' + fa(days[i]), days[j] + ' − ' + days[i])} = ${frac(hs[j] + ' − ' + hs[i], dd)} = ${ans}이다. 이 기간에 키가 하루에 평균 ${ans} cm씩 자랐다는 뜻이다.`,
        facts: { value: `(${hs[j]}-${hs[i]})/(${days[j]}-${days[i]})` }
      });
    }, { standard: S1 }),

    T('rate-life', '생활 상황에서 식으로 주어진 양의 평균변화율', '①3', (d) => {
      const A = d.pick([1, 2, 3]), Bc = d.int(4, 20), Cc = d.int(10, 90), cs = [Cc, Bc, A];
      const p = d.int(0, 6), q = p + d.int(2, 4), ans = A * (p + q) + Bc;
      return val(`어느 수조에 물을 넣기 시작한 지 ${Tt}분 후 수조에 든 물의 양을 ${ms('f(t)')} L라 하면 ${fIs(cs, 'f', 't')} ${nb('(' + ms('0 <= t <= 10') + ')')}이다. ${Tt}의 값이 ${p}에서 ${q}까지 변할 때 ${ms('f(t)')}의 평균변화율은?`, ans, {
        signed: false,
        explain: `평균변화율은 ${frac(fa(q) + ' − ' + fa(p), q + ' − ' + p)} = ${frac(fval(cs, q) + ' − ' + fval(cs, p), q - p)} = ${ans}이다. 이 동안 물이 1분에 평균 ${ans} L씩 늘었다는 뜻이다.`,
        value: `((${fJ(cs, q)})-(${fJ(cs, p)}))/(${q}-${p})`
      });
    }, { standard: S1 }),

    T('rate-find', '평균변화율이 주어질 때 구간 끝의 값', '①4', (d) => {
      const A = nz(d, -3, 3), Bc = d.int(-6, 6), Cc = d.int(-5, 5), k = d.int(1, 4), a = d.int(-4, 4), cs = [Cc, Bc, A];
      const m = A * (2 * a + k) + Bc;
      return val(`함수 ${fIs(cs)}에서 ${X}의 값이 ${Av}에서 ${ms('a + ' + k)}까지 변할 때의 평균변화율이 ${sT(m)}일 때, 상수 ${Av}의 값은?`, a, {
        explain: `평균변화율은 ${frac(fa('a + ' + k) + ' − ' + fa('a'), k)} = ${poly([[2 * A, Av], [A * k + Bc, '']])}이므로 ${nb(poly([[2 * A, Av], [A * k + Bc, '']]) + ' = ' + sT(m))}에서 ${nb(ms('a') + ' = ' + sT(a))}이다.`,
        value: `((${jn(m)}-(${jn(Bc)}))/${jn(A)}-${k})/2`, derived: [2]
      });
    }, { standard: S1 })
  ];

  // ════════════════════════════════════════════════════════════════
  // ── 미분계수(정의와 극한식) ──
  const coef = [
    // 순간변화율 그 자체(속도·높이처럼 운동을 나타내는 변화율은 11-2-5 몫이라 운동이 아닌 상황으로 쓴다)
    T('coef-rate', '생활 상황에서의 순간변화율', '①7', (d) => {
      const A = d.pick([1, 2]), T0 = d.pick([10, 12, 14, 16]), Bc = A * T0, cs = [0, Bc, -A], p = d.int(1, T0 - 1), ans = Bc - 2 * A * p;
      return val(`어느 물에 약품을 넣은 지 ${Tt}분 후 물속에 있는 약품의 양을 ${nb(ms('f(t)'))} mg이라 하면 ${fIs(cs, 'f', 't')} ${nb('(' + ms('0 <= t <= ' + T0) + ')')}이다. ${nb(ms('t = ' + p))}에서 ${ms('f(t)')}의 순간변화율은?`, ans, {
        explain: `${nb(ms('t = ' + p))}에서의 순간변화율은 미분계수 ${dfa(p)}이다. ${nb(ms("f'(t)") + ' = ' + pH(dcs(cs), Tt))}이므로 ${nb(dfa(p) + ' = ' + sT(ans))}이다.${ans < 0 ? ' 이때 약품의 양은 1분에 ' + Math.abs(ans) + ' mg씩 줄어드는 빠르기이다.' : ' 이때 약품의 양은 1분에 ' + ans + ' mg씩 늘어나는 빠르기이다.'}`,
        value: dJ(cs, p)
      });
    }, { standard: S1 }),

    // n = 0: f′(p) 를 주고 (f(p + mh) − f(p))/(nh) — 답은 늘 분수, n = 1: 곡선 위의 점과 접선의 기울기로 주고 (f(p + mh) − s)/h — 답은 늘 정수
    T('coef-limit', '미분계수로 극한값 구하기', '①8', (d, n) => {
      const p = d.int(-3, 4), k = nz(d, -6, 6), m = d.pick([2, 3, -1, -2, -3]);
      if (n === 0) {
        const den = d.pick([2, 3, 4]);
        if ((k * m) % den === 0 || gcd(Math.abs(m), den) !== 1) return null;
        const body = frac(ms('f(' + lin2(p, m, 'h') + ') - f(' + p + ')'), ms(den + 'h'));
        return val(`다항함수 ${ms('f(x)')}에 대하여 ${nb(ms("f'(" + p + ') = ' + k))}일 때, 다음 극한값은?`, Q(k * m, den), {
          figure: hx(lim('h→0', body)),
          explain: `분모를 ${Hh} 앞의 수에 맞추면 (주어진 식) = ${qT(Q(m, den))} × ${lim('h→0', frac(ms('f(' + lin2(p, m, 'h') + ') - f(' + p + ')'), ms((m === -1 ? '-' : m) + 'h')))} = ${qT(Q(m, den))} × ${dfa(p)} = ${qT(Q(m, den))} × ${pp(k)} = ${qT(Q(k * m, den))}이다.`,
          value: `${jn(k)}*${jn(m)}/${den}`
        });
      }
      const s = nz(d, -6, 6);
      const body = frac(ms(minus('f(' + lin2(p, m, 'h') + ')', s)), Hh);
      return val(`곡선 ${nb(ms('y = f(x)'))} 위의 점 ${pt(p, s)}에서의 접선의 기울기가 ${sT(k)}일 때, 다음 극한값은?`, k * m, {
        figure: hx(lim('h→0', body)),
        explain: `점 ${jh(pt(p, s), '이/가')} 곡선 위에 있으므로 ${nb(fa(p) + ' = ' + sT(s))}이고, 접선의 기울기가 ${sT(k)}이므로 ${nb(dfa(p) + ' = ' + sT(k))}이다. (주어진 식) = ${sT(m)} × ${lim('h→0', frac(ms('f(' + lin2(p, m, 'h') + ') - f(' + p + ')'), ms((m === -1 ? '-' : m) + 'h')))} = ${sT(m)} × ${dfa(p)} = ${sT(k * m)}이다.`,
        value: `${jn(k)}*${jn(m)}`
      });
    }, { count: 2, standard: S1 }),

    T('coef-limit-back', '극한값으로 미분계수 구하기', '①8', (d) => {
      const p = d.int(-3, 4), m = d.pick([2, 3, 4, -2, -3]), k = nz(d, -6, 6), s = m * k;
      return val(`다항함수 ${ms('f(x)')}가 다음을 만족시킬 때, ${dfa(p)}의 값은?`, k, {
        figure: hx(lim('Δx→0', frac(ms('f(' + lin2(p, m, 'Δx') + ') - f(' + p + ')'), ms('Δx'))) + ' = ' + sT(s)),
        explain: `(주어진 식) = ${sT(m)} × ${lim('Δx→0', frac(ms('f(' + lin2(p, m, 'Δx') + ') - f(' + p + ')'), ms(m + 'Δx')))} = ${nb(sT(m) + dfa(p))}이므로 ${nb(sT(m) + dfa(p) + ' = ' + sT(s))}에서 ${nb(dfa(p) + ' = ' + sT(k))}이다.`,
        value: `${jn(s)}/${jn(m)}`
      });
    }, { standard: S1 }),

    T('coef-from-diff', 'f(a + x) − f(a)가 x의 식일 때 미분계수', '①9', (d) => {
      const p = nz(d, -3, 3), c1 = nz(d, -8, 8), c2 = d.int(-4, 4), c3 = d.pick([1, 1, 2, -1]), rhs = pH([0, c1, c2, c3]);
      return val(`함수 ${ms('f(x)')}가 모든 실수 ${X}에 대하여 ${nb(ms('f(' + lin2(p, 1, 'x') + ') - f(' + p + ')') + ' =')} ${jh(rhs, '을/를')} 만족시킬 때, ${dfa(p)}의 값은?`, c1, {
        explain: `${dfa(p)} = ${lim('x→0', frac(ms('f(' + lin2(p, 1, 'x') + ') - f(' + p + ')'), X))} = ${lim('x→0', '(' + pH([c1, c2, c3]) + ')')} = ${sT(c1)}이다.`,
        value: jn(c1)
      });
    }, { standard: S1 }),

    T('coef-limit-sq', '분모가 x² − a² 꼴인 극한값', '①10', (d) => {
      const p = nz(d, -4, 4), k = nz(d, -9, 9);
      if (k % (2 * p) === 0) return null;
      return val(`다항함수 ${ms('f(x)')}에 대하여 ${nb(ms("f'(" + p + ') = ' + k))}일 때, 다음 극한값은?`, Q(k, 2 * p), {
        figure: hx(lim('x→' + p, frac(ms('f(x) - f(' + p + ')'), ms('x^2 - ' + p * p)))),
        explain: `${nb(ms('x^2 - ' + p * p) + ' = (' + xm(p) + ')(' + xm(-p) + ')')}이므로 (주어진 식) = ${lim('x→' + p, frac(ms('f(x) - f(' + p + ')'), xm(p)))} × ${frac(1, xm(-p))} = ${frac(dfa(p), sT(2 * p))} = ${qT(Q(k, 2 * p))}이다.`,
        value: `${jn(k)}/(2*${jn(p)})`, derived: [2]
      });
    }, { standard: S1 }),

    T('coef-two-sided', '앞뒤가 함께 움직이는 극한의 조건', '①11', (d) => {
      const A = nz(d, -3, 3), Bc = d.int(-6, 6), Cc = d.int(-5, 5), r = d.pick([-5, -3, -1, 1, 3, 5]), cs = [Cc, Bc, A];
      const s = 2 * (A * r + Bc);                       // 2f′(r/2) = 2(2A·r/2 + B)
      return val(`함수 ${fIs(cs)}에 대하여 다음을 만족시키는 상수 ${Av}의 값은?`, Q(r, 2), {
        figure: hx(lim('h→0', frac(ms('f(a + h) - f(a - h)'), Hh)) + ' = ' + sT(s)),
        explain: `분자에서 ${fa('a')}를 빼고 더하면 (주어진 식) = ${lim('h→0', frac(ms('f(a + h) - f(a)'), Hh))} + ${lim('h→0', frac(ms('f(a - h) - f(a)'), ms('-h')))} = ${nb('2' + dfa('a'))}이다. ${nb(ms("f'(x)") + ' = ' + pH([Bc, 2 * A]))}이므로 ${nb('2(' + pH([Bc, 2 * A], Av) + ') = ' + sT(s))}에서 ${nb(ms('a') + ' = ' + frac(sT(r), 2))}이다.`,
        value: `(${jn(s)}/2-(${jn(Bc)}))/(2*${jn(A)})`, derived: [2]
      });
    }, { standard: S1 }),

    T('coef-inf', 'x → ∞일 때의 극한을 미분계수로', '①11', (d) => {
      const deg = d.pick([3, 4]), cs = deg === 3 ? [d.int(-5, 5), nz(d, -5, 5), 0, d.pick([1, 2, -1])] : [d.int(-5, 5), nz(d, -5, 5), 0, 0, 1];
      const p = d.pick([1, 2, -1]), m = d.int(1, 3), n2 = d.int(1, 3), fd = dJ(cs, p), f1 = fval(dcs(cs), p);
      if (f1 === 0) return null;
      const arg = (s, k) => sT(p) + ' ' + s + ' ' + frac(k, Tt);
      const body = Tt + '{' + ms('f(') + arg('+', m) + ') − ' + ms('f(') + arg('−', n2) + ')}';
      return val(`함수 ${fIs(cs)}에 대하여 다음 극한값은?`, (m + n2) * f1, {
        figure: hx(lim('t→∞', body)),
        explain: `${nb(frac(1, Tt) + ' = ' + Hh)}로 놓으면 ${Tt} → ∞일 때 ${Hh} → 0+이므로 (주어진 식) = ${lim('h→0+', frac(ms('f(' + lin2(p, m, 'h') + ') - f(' + lin2(p, -n2, 'h') + ')'), Hh))}이다. 분자에서 ${jh(fa(p), '을/를')} 빼고 더하면 ${nb(m + dfa(p) + ' + ' + n2 + dfa(p) + ' = ' + (m + n2) + dfa(p))}이고, ${nb(ms("f'(x)") + ' = ' + pH(dcs(cs)))}에서 ${nb(dfa(p) + ' = ' + sT(f1))}이므로 답은 ${sT((m + n2) * f1)}이다.`,
        value: `(${m}+${n2})*(${fd})`
      });
    }, { standard: S1 }),

    // n = 0: (f(x) − s)/(x² − p²) = k, n = 1: (f(x²) − s)/(x − p) = k
    T('coef-cond', '극한값 조건에서 함숫값과 미분계수', '①12', (d, n) => {
      const p = nz(d, -3, 3);
      if (n === 0) {
        const s = nz(d, -6, 6), k = nz(d, -5, 5);
        return slots(`다항함수 ${ms('f(x)')}가 다음을 만족시킬 때, ${jh(fa(p), '과/와')} ${dfa(p)}의 값은?`, `${fa(p)} = {0}, ${dfa(p)} = {1}`, [[s, jn(s)], [2 * p * k, `2*${jn(p)}*${jn(k)}`]], {
          shown: `${fa(p)} = ${sT(s)}, ${dfa(p)} = ${sT(2 * p * k)}`,
          figure: hx(lim('x→' + p, frac(ms(minus('f(x)', s)), ms('x^2 - ' + p * p))) + ' = ' + sT(k)),
          explain: `분모가 0으로 가므로 분자도 0으로 가야 하고, ${ms('f(x)')}는 연속이므로 ${nb(fa(p) + ' = ' + sT(s))}이다. (주어진 식) = ${lim('x→' + p, frac(ms('f(x) - f(' + p + ')'), xm(p)))} × ${frac(1, xm(-p))} = ${frac(dfa(p), sT(2 * p))} = ${sT(k)}이므로 ${nb(dfa(p) + ' = ' + sT(2 * p * k))}이다.`,
          derived: [2]
        });
      }
      const q = p * p, s = d.int(-5, 5), t = nz(d, -5, 5), k = 2 * p * t;
      return slots(`미분가능한 함수 ${ms('f(x)')}가 다음을 만족시킬 때, ${jh(fa(q), '과/와')} ${dfa(q)}의 값은?`, `${fa(q)} = {0}, ${dfa(q)} = {1}`, [[s, jn(s)], [t, `${jn(k)}/(2*${jn(p)})`]], {
        shown: `${fa(q)} = ${sT(s)}, ${dfa(q)} = ${sT(t)}`,
        figure: hx(lim('x→' + p, frac(ms(minus('f(x^2)', s)), xm(p))) + ' = ' + sT(k)),
        explain: `분모가 0으로 가므로 분자도 0으로 가야 하고, ${ms('f(x)')}는 연속이므로 ${nb(fa(q) + ' = ' + sT(s))}이다. (주어진 식) = ${lim('x→' + p, frac(ms('f(x^2) - f(' + q + ')'), ms('x^2 - ' + q)))} × ${nb('(' + xm(-p) + ')')} = ${nb(sT(2 * p) + dfa(q))} = ${sT(k)}이므로 ${nb(dfa(q) + ' = ' + sT(t))}이다.`,
        derived: [2]
      });
    }, { count: 2, standard: S1 }),

    // n = 0: (p·f(x) − x·f(p))/(x − p) 를 f 의 식으로, n = 1: (q·f(x²) − x²·f(q))/(x − p) 를 f(q), f′(q) 로(q = p²)
    T('coef-mix', 'x·f(a)가 섞인 극한을 미분계수로', '①13', (d, n) => {
      const p = d.pick([2, 3]);
      if (n === 0) {
        const cs = [0, nz(d, -6, 6), nz(d, -5, 5), 1], ans = p * fval(dcs(cs), p) - fval(cs, p);
        return val(`함수 ${fIs(cs)}에 대하여 다음 극한값은?`, ans, {
          figure: hx(lim('x→' + p, frac(ms(p + 'f(x) - xf(' + p + ')'), ms('x - ' + p)))),
          explain: `분자에서 ${jh(p + fa(p), '을/를')} 빼고 더하면 ${nb(p + '{' + ms('f(x) - f(' + p + ')') + '} − ' + fa(p) + '(' + ms('x - ' + p) + ')')}이므로 (주어진 식) = ${nb(p + dfa(p) + ' − ' + fa(p))}이다. ${nb(fa(p) + ' = ' + sT(fval(cs, p)))}, ${nb(ms("f'(x)") + ' = ' + pH(dcs(cs)))}에서 ${nb(dfa(p) + ' = ' + sT(fval(dcs(cs), p)))}이므로 답은 ${sT(ans)}이다.`,
          value: `${p}*(${dJ(cs, p)})-(${fJ(cs, p)})`
        });
      }
      const q = p * p, s = nz(d, -5, 5), k = nz(d, -4, 4), ans = 2 * p * (q * k - s);
      return val(`다항함수 ${ms('f(x)')}가 ${nb(ms('f(' + q + ') = ' + s))}, ${nb(ms("f'(" + q + ') = ' + k) + tail(Math.abs(k), '을/를'))} 만족시킬 때, 다음 극한값은?`, ans, {
        figure: hx(lim('x→' + p, frac(ms(q + 'f(x^2) - x^2 f(' + q + ')'), ms('x - ' + p)))),
        explain: `분자에서 ${jh(q + fa(q), '을/를')} 빼고 더하면 ${nb(q + '{' + ms('f(x^2) - f(' + q + ')') + '} − ' + fa(q) + '(' + ms('x^2 - ' + q) + ')')}이다. ${nb(ms('x^2 - ' + q) + ' = (' + ms('x - ' + p) + ')(' + ms('x + ' + p) + ')')}이므로 (주어진 식) = ${nb(q + ' × ' + dfa(q) + ' × ' + 2 * p + ' − ' + fa(q) + ' × ' + 2 * p)} = ${nb(q + ' × ' + pp(k) + ' × ' + 2 * p + ' − ' + pp(s) + ' × ' + 2 * p)} = ${sT(ans)}이다.`,
        value: `2*${p}*(${q}*${jn(k)}-(${jn(s)}))`, derived: [2]
      });
    }, { count: 2, standard: S1 })
  ];

  // ════════════════════════════════════════════════════════════════
  // ── 미분계수의 기하적 의미 ──
  // 교점8(①17) 꼴의 그래프: f′(x) = K(x − A)(x − Mx)(x − Cx), A < Mx < 0 < Cx — x = a, c 에서 극소, a 와 c 사이에서 극대.
  function bumpy(d) {
    const A = -2.4 + d.int(-2, 2) / 10, Mx = -1.2 + d.int(-1, 1) / 10, Cx = 1.0 + d.int(0, 2) / 10, K = 0.5;
    const s1 = A + Mx + Cx, s2 = A * Mx + A * Cx + Mx * Cx, s3 = A * Mx * Cx;
    const F = (x) => K * (x ** 4 / 4 - s1 * x ** 3 / 3 + s2 * x ** 2 / 2 - s3 * x), dF = (x) => K * (x - A) * (x - Mx) * (x - Cx);
    const e = Cx + 0.75 + d.int(0, 1) / 10, dd = Cx + 0.38, b = Mx / 2;
    const fe = 0.3 + d.int(0, 2) / 10, Dc = fe - F(e), f = (x) => F(x) + Dc;
    return { A, Mx, Cx, e, dd, b, f, dF, R: fe / e };
  }
  const tangent = [
    T('tan-slope', '곡선 위의 점에서 접선의 기울기', '①16', (d) => {
      const deg = d.pick([2, 3]), cs = deg === 2 ? [d.int(-5, 5), d.int(-6, 6), nz(d, -3, 3)] : [d.int(-4, 4), d.int(-5, 5), d.int(-3, 3), d.pick([1, -1, 2])];
      const p = d.int(-2, 3), ans = fval(dcs(cs), p);
      return val(`곡선 ${yIs(pH(cs))} 위의 점 ${pt(p, fval(cs, p))}에서의 접선의 기울기는?`, ans, {
        explain: `${jh(nb(ms('f(x)') + ' = ' + pH(cs)), '이라/라')} 하면 접선의 기울기는 ${nb(ms('x = ' + p))}에서의 미분계수 ${dfa(p)}와 같다. ${nb(ms("f'(x)") + ' = ' + pH(dcs(cs)))}이므로 ${nb(dfa(p) + ' = ' + sT(ans))}이다.`,
        value: dJ(cs, p)
      });
    }, { standard: S1 }),

    // 교점8: 그래프만 보고 f′(a)…f′(e) 를 원점과 (e, f(e)) 를 잇는 직선의 기울기 f(e)/e 와 견준다. 「큰 것」「작은 것」을 번갈아 묻는다.
    T('tan-compare-pick', '그래프에서 접선의 기울기와 원점을 지나는 직선의 기울기 비교', '①17', (d) => {
      const g = bumpy(d), big = d.bool(), pts = [['a', g.A], ['b', g.b], ['c', g.Cx], ['d', g.dd], ['e', g.e]];
      const slopes = pts.map(([, x]) => g.dF(x));
      // 눈으로 가릴 수 있게 간격을 둔다: 극점의 기울기 0, b 는 뚜렷한 음수, d·e 는 R 보다 한참 크다.
      if (!(g.R >= 0.12 && slopes[1] <= -0.4 && slopes[3] >= g.R + 0.8 && g.f(g.Cx) <= -0.4 && g.f(g.Mx) > 0.3)) return null;
      const xs = [-3.1, g.e + 0.45], ys = [Math.min(-1, Math.floor(g.f(g.Cx) * 2) / 2 - 0.3), 2.4];
      const figure = plot({
        x: xs, y: ys, u: 41,
        xt: pts.map(([t, x]) => ({ v: x, t })),
        curves: [{ f: g.f, name: 'y=f(x)', at: g.e + 0.32, said: '왼쪽 위에서 내려와 x = a에서 접선이 x축에 평행하고, 올라갔다가 다시 내려와 x = c에서 접선이 x축에 평행하며, 그 뒤 가파르게 올라간다. f(e)는 0보다 크다' }],
        segs: pts.map(([, x]) => ({ p: [x, 0], q: [x, g.f(x)], dash: true })),
        dots: pts.map(([t, x]) => ({ x, y: g.f(x), said: '곡선 위의 점 (' + t + ', f(' + t + '))' }))
      });
      const rows = pts.map(([t], i) => ({ ok: big ? slopes[i] > g.R : slopes[i] < g.R }));
      const labels = pts.map(([t]) => t), name = (t) => ms("f'(" + t + ')');
      return setsQ(d, `미분가능한 함수 ${nb(ms('y = f(x)'))}의 그래프가 그림과 같을 때, ${pts.map(([t]) => name(t)).join(', ')} 가운데 ${frac(ms('f(e)'), ms('e'))}의 값보다 ${big ? '큰' : '작은'} 것만을 있는 대로 고른 것은?`, rows, {
        labels, join: (s) => s.map(name).join(', '), figure, what: big ? '큰 것' : '작은 것',
        lead: `${frac(ms('f(e)'), ms('e'))}는 원점과 점 ${nb('(' + ms('e, f(e)') + ')')}를 지나는 직선의 기울기로 0보다 조금 크다. ${nb(name('a') + ' = ' + name('c') + ' = 0')}(접선이 ${X}축에 평행), ${nb(name('b') + ' &lt; 0')}(곡선이 내려가는 곳)이고, ${jh(name('d'), '과/와')} ${name('e')}는 곡선이 가파르게 올라가는 곳의 접선의 기울기라 그 직선의 기울기보다 크다.`
      });
    }, { standard: S1 }),

    // 교대5: y = f(x) 가 원점과 (1, 1) 에서 y = x 와 만나는 아래로 볼록한 곡선. 보기마다 주제(기울기의 뜻)가 다르고 참·거짓은 함수로 셈해 가린다.
    T('tan-compare-claims', '그래프에서 평균변화율과 미분계수의 크기 비교', '①17', (d) => {
      const kinds = [
        { f: (x) => x * x, df: (x) => 2 * x },
        { f: (x) => (x * x + x) / 2, df: (x) => x + 0.5 },
        { f: (x) => x ** 3, df: (x) => 3 * x * x },
        { f: (x) => (x ** 3 + x * x) / 2, df: (x) => (3 * x * x + 2 * x) / 2 }
      ];
      const { f, df } = d.pick(kinds), a = d.int(4, 6) / 10, b = d.int(13, 15) / 10;
      if (f(b) > 2.6 || f(a) < 0.15) return null;          // f(a) 가 너무 작으면 눈금 글 f(a) 가 원점 O 에 붙는다
      const fa0 = f(a), fb0 = f(b);
      const fr = (n, m) => frac(ms(n), ms(m));
      const YX = nb(ms('y = x')), PA = ms('(a, f(a))'), PB = ms('(b, f(b))');
      const topics = [
        [{ h: nb(fr('f(a)', 'a') + ' &lt; ' + fr('f(b)', 'b')), ok: fa0 / a < fb0 / b }, { h: nb(fr('f(a)', 'a') + ' &gt; ' + fr('f(b)', 'b')), ok: fa0 / a > fb0 / b },
          `${fr('f(a)', 'a')}는 원점과 점 ${PA}를 지나는 직선의 기울기로 1보다 작고, ${fr('f(b)', 'b')}는 원점과 점 ${PB}를 지나는 직선의 기울기로 1보다 크다.`],
        [{ h: nb(ms('f(b) - f(a) > b - a')), ok: fb0 - fa0 > b - a }, { h: nb(ms('f(b) - f(a) < b - a')), ok: fb0 - fa0 < b - a },
          `두 점 ${PA}, ${PB}를 지나는 직선의 기울기 ${fr('f(b) - f(a)', 'b - a')}는 1보다 크다(점 ${PA}는 직선 ${YX}의 아래, 점 ${PB}는 위에 있다).`],
        [{ h: nb(ms("f'(b) > 1")), ok: df(b) > 1 }, { h: nb(ms("f'(b) < 1")), ok: df(b) < 1 },
          `${ms("f'(b)")}는 ${nb(ms('x = b'))}에서의 접선의 기울기로, 곡선이 직선 ${YX}보다 가파르게 올라가는 곳이라 1보다 크다.`],
        [{ h: nb(ms('f(a) < a')), ok: fa0 < a }, { h: nb(ms('f(a) > a')), ok: fa0 > a },
          `${nb(ms('0 < x < 1'))}에서 곡선은 직선 ${YX}의 아래에 있으므로 ${nb(ms('f(a) < a'))}이다.`],
        [{ h: nb(ms("f'(1) > 1")), ok: df(1) > 1 }, { h: nb(ms("f'(1) < 1")), ok: df(1) < 1 },
          `${nb(ms('x = 1'))}에서 곡선이 직선 ${YX}를 아래에서 위로 가로지르므로 그 점에서의 접선의 기울기 ${ms("f'(1)")}은 1보다 크다.`]
      ];
      const pickT = d.shuffle(topics).slice(0, 3), rows = pickT.map((t) => { const r = t[d.int(0, 1)]; return { h: r.h, ok: r.ok, why: t[2] }; });
      const figure = plot({
        x: [-0.45, b + 0.5], y: [-0.35, Math.ceil(fb0 * 2) / 2 + 0.3], u: 92, ys: 0.62,
        curves: [{ f, from: -0.45, name: 'y=f(x)', said: '아래로 볼록한 곡선이 원점과 점 (1, 1)을 지난다' }],
        lines: [{ a: 1, b: 0, name: 'y=x' }],
        dots: [{ x: a, y: fa0, guide: true, xl: 'a', yl: 'f(a)', said: '점 (a, f(a))' }, { x: 1, y: 1, guide: true, xl: '1', yl: '1', said: '점 (1, 1)' }, { x: b, y: fb0, guide: true, xl: 'b', yl: 'f(b)', said: '점 (b, f(b))' }]
      });
      return setsQ(d, `그림은 미분가능한 함수 ${nb(ms('y = f(x)'))}의 그래프와 직선 ${nb(ms('y = x'))}이다. ${nb(ms('0 < a < 1 < b'))}일 때, 보기에서 옳은 것만을 있는 대로 고른 것은?`, rows, { figure });
    }, { standard: S1 })
  ];

  // 같은 단원의 b·c 파일이 쓰는 도구
  B.kit.u23x = {
    nb, S1, S2, S3, S4, seal, retry, T, HT, stripH, X, Hh, Tt, Av, Bv, Kv, DX, sT, pp, jn, pt, NOTE1, lin2, minus, fa, dfa, xm, qT, cf,
    term, pH, fval, dcs, mul, add, fJ, dJ, fIs, yIs, hasZero, val, slots, polyQ, GA, bogi, setsQ, oneQ
  };

  B.addUnit({ id: '11-2-3', grade: 11, semester: 2, no: 3, title: '미분계수와 도함수', version: 1, groups: [
    { id: 'rate', title: '평균변화율', standard: S1, types: rate },
    { id: 'coef', title: '미분계수', standard: S1, types: coef },
    { id: 'tangent', title: '미분계수의 기하적 의미', standard: S1, types: tangent },
    { id: 'diff', title: '미분가능성과 연속성', standard: S2, types: [] },
    { id: 'deriv', title: '도함수와 미분법', standard: S4, types: [] },
    { id: 'use', title: '미분법의 활용', standard: S4, types: [] }
  ] });
})(typeof window !== 'undefined' ? window : globalThis);
