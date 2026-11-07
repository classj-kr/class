// 고등학교 확률과 통계 Ⅲ-1 「확률분포」(11-3-5) — 단원 틀·도구와 앞쪽 묶음(확률변수와 이산확률변수의 확률분포, 연속확률변수의 확률분포, 이산확률변수의 기댓값과 표준편차).
// 수집해 둔 천재 T셀파 확률과 통계(전인태, 2022 개정)의 교과서·평가 자료에서 뽑은 문제 꼴 목록(기본꼴_1: 30꼴, 기본꼴_2: 23꼴, 심화꼴: 6꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음 / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/11-3-5/싣기_대조표.md 에 있다.
// (확률변수 aX + b, 이항분포의 뜻과 확률, 이항분포의 평균·분산·표준편차는 11-3-5b.js 에, 실력 문항은 11-3-5c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
// 성취기준: [12확통03-01] 확률변수와 확률분포의 뜻을 설명할 수 있다. [12확통03-02] 이산확률변수의 기댓값(평균)과 표준편차를 구할 수 있다.
//  [12확통03-03] 이항분포의 뜻과 성질을 이해하고, 평균과 표준편차를 구할 수 있다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(확률질량함수의 식·분포표·막대그래프·뽑기 상황·주사위와 카드·두 단계 시행), 묻는 것(확률·상수·분포표의 칸·평균·분산·표준편차),
//    연속확률변수에서는 확률밀도함수의 꼴(상수·일차식·꺾은선 그래프·식으로 준 조각 함수·대칭)과 거꾸로 구하는 것(높이·구간의 끝)이 다르면 따로 싣는다.
//  - 연속확률변수의 확률은 모두 그래프 아래의 넓이(삼각형·사다리꼴·직사각형)로 구한다. 적분은 쓰지 않는다.
//  - 확률분포표를 묻는 꼴(①8·①9)은 표의 칸(㉠, ㉡)을 묻는다. 범위의 확률 하나만 묻는 것은 11-3-3(조합으로 세는 수학적 확률)과 같은 일이라 그렇게 하지 않았다.
//  - 「확률질량함수」「확률밀도함수」는 평가지·수능 문제가 문제 글에 쓰는 낱말이라 그대로 쓴다(교육과정: 교수⋅학습 상황에서 사용할 수 있다).
//  - 답: 확률·평균·분산은 분수 칸(크기가 같은 분수도 맞게 친다)이나 수 칸으로 받고, 확률처럼 늘 양수인 값에는 부호 단추를 달지 않는다. 음수가 될 수 있는 값
//    (aX + b 의 평균, 확률밀도함수 식 속의 상수)만 단추를 단다. 칸이 여럿이면 분수 칸을 「(단, 분수는 기약분수로 적는다.)」로 받는다.
//    한 유형 안에서는 씨앗이 바뀌어도 칸의 모양(정수·분수·근호)이 같게 수를 고른다. 표준편차가 무리수이면 「□√□」 칸으로 받는다.
//    소수 셋째 자리까지인 확률(0.994 따위)은 칸으로 받지 못해 고르기로 낸다. 원문의 소수 확률(0.648, 0.71)은 분수 칸으로 받는다(81/125, 71/100).
//  - 원문이 따로 구한 값을 더한 곳(E(X) + V(X), a + k, k + a, a + b, ab, E(X) + V(2X))은 칸마다 받거나 하나만 묻는다.
//  - 고르기의 참·거짓·순서는 손으로 적지 않고 코드로 셈한다(넓이, 분산).
//  - 수와 상황은 새로 썼다. 늘 같은 답이 나오는 꼴은 수(개수·확률·구간)를 바꾸었다.
//  - 원문이 어긋난 곳은 바로잡아 실었다: 전중04 풀이의 「P(X = x) = …」(확률밀도함수 f(x)), 전중19 「음의 방향으로 −1만큼」(1만큼),
//    전차5-2 「P(X = x) = ₈C₄…」(P(X = 4)), 전소2 발1 풀이의 「2/5 + 3/4 × 1/3」(×), 전교 87쪽 「커지는 값」(가지는 값), 전교 103쪽 「X/10」(X/n — 이 꼴은 뺐다).
//
// 뺀 것과 까닭(11-3-5b.js, 11-3-5c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 큰수의 법칙(②23): 교과서 본문의 설명(표로 구한 확률)과 공학 도구 탐구뿐이고 문제·확인 문제 꼴이 없다(n = 30·50의 값은 공학 도구가 있어야 구한다).
//  - 기출의 「X ~ B(80, p), E(X) = 20일 때 V(X)」(심5)는 ②17(평균에서 p를 구해 분산)과 같은 일이라 따로 싣지 않았다.
//  - 확률밀도함수 그래프 그리기, 확률분포를 표로 「나타내시오」의 표 쓰기 자체는 작도·서술이라 칸 묻기·확률 묻기로만 실었다.
//  - 옆 단원 문항(정규분포·표준화·이항분포의 정규 근사는 11-3-6, 표본평균·추정은 11-3-7)은 앞 단계만 이 단원 꼴로 셌다(대조표 머리말).
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」 문자는 값을 물으면 「상수 a」로 부른다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, frac, lines, N, M, C, inline } = B.kit;
  const { MINUS, Q, qadd, qsub, qmul, qdiv, gcd, tx, tj, nb, V, rt, sys, plain } = B.kit.mid;
  const { ms, pr, ev, vr, sd, dist, jh: jh0, qAns, plot, nC } = B.kit.hs;
  // 토씨: 「은/는」처럼 짝이 있으면 끝소리로 고르고, 「의」「에」「일」처럼 짝이 없는 말은 그대로 붙인다.
  const jh = (h, pair) => (pair.includes('/') ? jh0(h, pair) : h + pair);
  const UNIT = '11-3-5', STD1 = '12확통03-01', STD2 = '12확통03-02', STD3 = '12확통03-03';

  // ── 수와 글 ──
  const num = (n) => (n < 0 ? MINUS + Math.abs(n) : String(n));                 // 정수(음수는 −)
  const par = (n) => (n < 0 ? '(' + num(n) + ')' : num(n));                    // 식 속의 정수(음수는 괄호)
  const jn = (n) => (n < 0 ? '(' + n + ')' : String(n));                       // 검사 식에 적는 정수
  const jq = (q) => (q.q === 1 ? jn(q.p) : '(' + q.p + '/' + q.q + ')');       // 검사 식에 적는 유리수
  const R = (p, q) => Q(p, q == null ? 1 : q);
  const fq = (q) => tx(q);                                                     // 유리수를 글로(분수는 세로 분수)
  const fqj = (q, pair) => tj(q, pair);                                        // 유리수 + 토씨
  const pl = (q) => plain(q);                                                  // 그림 설명·그림 속 글에 적는 유리수(3/4)
  const sumQ = (list) => list.reduce((s, x) => qadd(s, x), R(0));
  const comb = (n, k) => { if (k < 0 || k > n) return 0; let r = 1; for (let i = 1; i <= k; i += 1) r = r * (n - k + i) / i; return Math.round(r); };
  const isIntQ = (q) => q.q === 1;
  const X = ms('X'), Xs = ms('x');
  const PX = (k) => pr(ms('X = ') + (typeof k === 'number' ? num(k) : k));     // P(X = k)
  const PR = (s) => pr(ms(s));                                                 // P(1 <= X <= 3) 따위(ms 글)
  const EX = ev('X'), VX = vr('X'), SX = sd('X'), EX2 = ev(ms('X^2'));
  const NOTEF = ' <span style="white-space:nowrap">(단, 분수는 기약분수로 적는다.)</span>';
  // 표의 범위 글: 「a ≤ X ≤ b」 확률을 글로
  const rng = (lo, hi) => PR(`${lo} <= X <= ${hi}`);
  // 조각 함수·확률질량함수를 식 줄로: cases(['1/6 (x = 0, 1)', …]) 은 행마다 HTML
  const cases = (rows) => sys(rows);
  const nbsp = '&nbsp;';
  // 분수(유리수)를 이산확률분포표의 칸에 적는 글
  const cell = (q) => (q.q === 1 ? String(q.p) : frac(q.p, q.q));
  // 확률분포표가 휴대폰 문항 칸(약 290px)에 드는가를 어림해, 넓으면 「합계」 열을 빼고 그래도 넓으면 null(수를 다시 고른다).
  //  칸의 너비는 글자 수(분수는 분자·분모 가운데 긴 쪽)로 어림한다.
  const cellLen = (h) => { const m = /<span class="mb-frac"><span>([\s\S]*?)<\/span><span class="mb-frac-bar">\/<\/span><span>([\s\S]*?)<\/span><\/span>/.exec(String(h)); const t = (s) => String(s).replace(/<[^>]+>/g, '').length; return m ? Math.max(t(m[1]), t(m[2])) : t(h); };
  function distFit(xs, ps, o) {
    // 휴대폰(360px) 화면에서 잰 값: 머리 칸 「P(X = x)」 91px, 한 자리 분수 35px·두 자리 48px·세 자리 57px, 「합계」 48px, 문항 칸 안쪽 너비 약 306px
    const w = (h) => 26 + 10.5 * cellLen(h), body = 92 + xs.reduce((s, x, i) => s + Math.max(w(String(x)), w(ps[i])), 0);
    if (body + 48 <= 300) return dist(xs, ps, o);
    if (body <= 300) return dist(xs, ps, Object.assign({}, o, { total: false }));
    return null;
  }

  // ── 검사 근거 마무리(11-1-7a.js 와 같은 방법) ──
  const stripH = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  function visibleNumbers(item) {
    const seen = stripH([item.text, item.figure || ''].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, ' $1 ').replace(/<table[^>]*aria-label="([^"]*)"[^>]*>/g, ' $1 | '));
    return new Set((seen.match(/\d+/g) || []).concat(seen.match(/\d+\.\d+/g) || [], seen.replace(/(\d) (?=\d)/g, '$1').match(/\d+/g) || []));
  }
  // 다시 셈하는 식의 수 가운데 글에 보이지 않는 수를 facts.unseen 에 밝힌다. 밝히기로 한 수(facts.derived — 조합의 수·거듭제곱처럼 셈 도중에 나오는 수)가
  // 아닌 수가 나오면 오류를 낸다. facts.auto 를 단 유형(조합의 수가 여럿 끼는 분포)은 셈 도중의 수를 모두 밝힌다.
  function seal(item) {
    const f = item.facts || {};
    if (f.calc) f.calc = f.calc.map(([t, i]) => [/\+0$/.test(t) ? t : '(' + t + ')+0', i]);
    if (f.value !== undefined && !/\+0$/.test(f.value)) f.value = '(' + f.value + ')+0';
    const derived = new Set((f.derived || []).map(Number).concat([0, 1])), shown = visibleNumbers(item), out = new Set(f.unseen || []);
    const exprs = (f.calc || []).map(([t]) => t).concat(f.value !== undefined ? [f.value] : [], f.choose ? f.choose.exprs : []);
    for (const t of exprs) for (const n of String(t).match(/\d+(?:\.\d+)?/g) || []) {
      if (shown.has(n)) continue;
      if (!f.auto && !derived.has(Number(n)) && !out.has(Number(n))) throw new Error('검사 식의 수 ' + n + ' 이 글에도 밝힌 수에도 없다: ' + t);
      out.add(Number(n));
    }
    delete f.derived; delete f.auto;
    if (out.size) f.unseen = [...out]; else delete f.unseen;
    item.facts = f;
    return item;
  }
  // 만들기가 null 을 돌려주면(조건에 맞지 않는 수) 다시 만든다.
  const retry = (make) => (d, n) => { for (let i = 0; i < 4000; i += 1) { const item = make(d, n); if (item && item.figure !== null) return seal(item); } throw new Error('조건에 맞는 문항을 만들지 못했다'); };
  const srcOf = (ref) => (/심/.test(ref) && !/[①②]/.test(ref) ? '수집본 심화 자료(' : '수집본 기본 자료(') + ref + ')';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: srcOf(ref), make: retry(make) }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: srcOf(ref), make: retry(make) }, more || {});

  // ── 답 칸 ──
  const factsOf = (o, base) => Object.assign(base, o.derived ? { derived: o.derived } : {}, o.unseen ? { unseen: o.unseen } : {}, o.rule ? { rule: o.rule } : {}, o.auto ? { auto: true } : {});
  // 정수 하나. o.value: 다시 셈하는 식, o.signed: 음수가 될 수 있는 값이면 true.
  const numQ = (text, answer, o) => N(text, answer + 0, { signed: Boolean(o.signed), unit: o.unit, figure: o.figure, explain: o.explain, facts: factsOf(o, { value: o.value }) });
  // 유리수 하나(정수면 수 칸, 아니면 분자·분모 칸 — 크기가 같은 분수도 맞게 친다)
  const ratQ = (text, q, o) => qAns(text, q, { signed: Boolean(o.signed), figure: o.figure, explain: o.explain, facts: factsOf(o, { value: o.value }) });
  // 정수 여럿: rows 는 [이름표, 답, 검사 식, 부호 단추를 붙이는가]
  const slots = (text, rows, o) => M(text, rows.map(([label, answer, , s]) => Object.assign({ label, answer: answer + 0 }, s ? { signed: true } : {})), {
    figure: o.figure, explain: o.explain, shown: o.shown, facts: factsOf(o, { calc: rows.map((r, i) => [r[2], i]) })
  });
  // 분수 여럿을 식 속 칸으로: rows 는 [이름 글, 유리수, 부호 단추를 붙이는가, [분자의 식, 분모의 식](약분하기 전 — 생략하면 값 그대로)]
  //  칸은 「이름 = [분자]/[분모]」이고 기약분수로 적는다. 정수 칸이 섞이면 rows 의 항목을 { int: true } 로 준다.
  function fracsQ(text, rows, o) {
    const inputs = [], calc = [], cells = [], shownParts = [], derived = (o.derived || []).slice();
    for (const r of rows) {
      const [label, q, s, ex] = r, at = inputs.length;
      if (r.int) {
        if (q.q !== 1) throw new Error('정수 칸에 분수가 왔다');
        inputs.push(Object.assign({ answer: q.p + 0 }, s ? { signed: true } : {}));
        calc.push([ex ? ex[0] : jn(q.p), at]); if (!ex) derived.push(Math.abs(q.p));
        cells.push(nb(label + ' = {' + at + '}'));
      } else {
        if (q.q === 1) throw new Error('분수 칸에 정수가 왔다');
        inputs.push(Object.assign({ answer: q.p + 0 }, s ? { signed: true } : {}), { answer: q.q });
        if (ex) {
          const A = Function('"use strict"; return (' + ex[0] + ');')(), Bv = Function('"use strict"; return (' + ex[1] + ');')(), g = gcd(A, Bv);
          if (A * q.q !== Bv * q.p) throw new Error('분수 칸의 식이 값과 다르다');
          calc.push(['(' + ex[0] + ')/' + g, at], ['(' + ex[1] + ')/' + g, at + 1]); derived.push(g);
        } else { calc.push([jn(q.p), at], [String(q.q), at + 1]); derived.push(Math.abs(q.p), q.q); }
        cells.push(nb(label + ' = ' + frac('{' + at + '}', '{' + (at + 1) + '}')));
      }
      shownParts.push(nb(label + ' = ' + fq(q)));
    }
    const full = /이다\.\)$/.test(text) ? text.replace(/이다\.\)$/, '이고, 분수는 기약분수로 적는다.)') : /\(단, [^()]*\)$/.test(text) ? text.replace(/\)$/, '이고, 분수는 기약분수로 적는다.)') : text + NOTEF;
    return inline(full, cells.join(', '), inputs, { figure: o.figure, explain: o.explain, shown: shownParts.join(', '), facts: factsOf(Object.assign({}, o, { derived }), { calc }) });
  }
  // 표준편차가 a√b(a ≥ 2): 「[ ]√[ ]」(부호 단추 없이)
  const sdAns = (text, a, b, o) => inline(text, '{0}' + rt('{1}'), [{ answer: a }, { answer: b }], { figure: o.figure, explain: o.explain, shown: a + rt(b), facts: factsOf(o, { calc: o.calc }) });
  // √b 하나: 「√[ ]」
  const rootAns = (text, b, o) => inline(text, rt('{0}'), [{ answer: b }], { figure: o.figure, explain: o.explain, shown: rt(b), facts: factsOf(o, { calc: o.calc }) });
  // 하나 고르기: rows 는 { h 글, ok 참인가 }. ok 가 want 인 것이 꼭 하나다(참·거짓은 코드가 셈한 값이다).
  function oneQ(d, text, rows, want, o) {
    const list = o.keep ? rows.slice() : d.shuffle(rows);
    if (list.filter((r) => r.ok === want).length !== 1) return null;
    if (new Set(list.map((r) => stripH(r.h))).size !== list.length) return null;
    const at = list.findIndex((r) => r.ok === want);
    return C(text, list.map((r) => r.h), at, { figure: o.figure, explain: o.explain, facts: Object.assign({ truth: list.map((r) => r.ok), want }, o.rule ? { rule: o.rule } : {}) });
  }
  // 「옳은 것만을 있는 대로 고른 것」(10-2-5a.js 의 setsQ 와 같은 짜임): rows 는 { h 글, ok }. 그림 속 ㄱ·ㄴ·ㄷ 을 고를 때는 o.inFigure 로 보기 줄을 그리지 않는다.
  const GA = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ'];
  const bogi = (list) => lines(list.map((h, i) => '<span class="mb-tag mb-tag-short">' + GA[i] + '.</span>' + h));
  function setsQ(d, text, rows, o) {
    const labels = GA.slice(0, rows.length), flags = rows.map((r) => Boolean(r.ok));
    if (!flags.some(Boolean) || flags.every(Boolean)) return null;
    const key = (s) => s.join('|'), right = labels.filter((_, i) => flags[i]), near = [], far = [];
    labels.forEach((_, i) => { const t = labels.filter((__, j) => (j === i ? !flags[j] : flags[j])); if (t.length) near.push(t); });
    for (let m = 1; m < (1 << labels.length); m += 1) far.push(labels.filter((_, k) => (m >> k) & 1));
    const out = [right], seen = new Set([key(right)]);
    for (const cand of d.shuffle(near).concat(d.shuffle(far))) { if (out.length === 5) break; if (!seen.has(key(cand))) { seen.add(key(cand)); out.push(cand); } }
    const sets = out.sort((a, b) => a.length - b.length || key(a).localeCompare(key(b)));
    return C(text, sets.map((s) => s.join(', ')), sets.findIndex((s) => key(s) === key(right)), {
      figure: (o.figure || '') + (o.inFigure ? '' : bogi(rows.map((r) => r.h))), explain: o.explain,
      facts: Object.assign({ sets: { labels, flags, options: sets } }, o.rule ? { rule: o.rule } : {})
    });
  }

  // ── 그림 ──
  const INK = '#1f2933', GRAY = '#5b6770', BAR = '#b42318';
  const f1 = (v) => (Math.round(v * 10) / 10).toString();
  const sesc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const ITAL = "font-style:italic;font-family:'MB Math','Times New Roman',serif", UPR = "font-style:normal;font-family:'MB Main','Times New Roman',serif";
  // 이산확률변수의 확률분포 막대그래프: xs 값(정수), ps 막대 높이(실수), labels 세로축에 적을 글('1/4' 은 세로 분수, 'a' 는 기울인 글자, '0.15' 는 그대로).
  //  o.v 확률변수 글자('X'), o.w 그림 너비. 막대 끝에서 세로축으로 점선을 긋고, 같은 높이의 글은 한 번만 적는다. 그림 설명에 값과 높이 글을 차례로 적는다.
  function barPlot(xs, ps, labels, o) {
    const opt = o || {}, v = opt.v || 'X', lv = v.toLowerCase(), w = opt.w || 260, h = opt.h || 128;
    const lo = Math.min(...xs), hi = Math.max(...xs), zeroIn = lo <= 0, top = Math.max(...ps);
    const left = 50, base = 24 + h, step = Math.min(42, (w - left - 30) / (hi - (zeroIn ? lo - 0.7 : 0) + 0.6));
    const X0 = left + (zeroIn ? 0.7 * step : 0), Xp = (x) => X0 + (x - (zeroIn ? lo : 0)) * step, Yp = (p) => base - p / top * (h - 8);
    const right = Xp(hi) + step * 0.8, out = [];
    out.push(`<line class="mb-axis" x1="${left - 4}" y1="${base}" x2="${f1(right)}" y2="${base}"/><path d="M${f1(right + 6)} ${base}l-7 -3.4v6.8z" style="fill:${INK}"/>`);
    out.push(`<line class="mb-axis" x1="${left}" y1="${base + 4}" x2="${left}" y2="11"/><path d="M${left} 5l-3.4 7h6.8z" style="fill:${INK}"/>`);
    out.push(`<text x="${f1(right + 10)}" y="${base + 4}" style="font-size:13.5px;fill:${INK};${ITAL}">${lv}</text>`);
    out.push(`<text x="${left + 7}" y="16" style="font-size:12.5px;fill:${INK};${UPR}">P(<tspan style="${ITAL}">${v}</tspan>=<tspan style="${ITAL}">${lv}</tspan>)</text>`);
    if (!zeroIn) out.push(`<text x="${left - 6}" y="${base + 13}" text-anchor="middle" style="font-size:11px;font-weight:600;fill:${INK}">O</text>`);
    const marks = [];
    xs.forEach((x, i) => {
      const px = Xp(x), py = Yp(ps[i]);
      out.push(`<path d="M${f1(px)} ${f1(py)}H${left}" style="fill:none;stroke:${GRAY};stroke-width:0.9;stroke-dasharray:3 2"/>`);
      out.push(`<line x1="${f1(px)}" y1="${base}" x2="${f1(px)}" y2="${f1(py)}" style="stroke:${BAR};stroke-width:4.5"/>`);
      out.push(`<text x="${f1(px)}" y="${base + 14}" text-anchor="middle" style="font-size:11.5px;fill:${INK}">${num(x)}</text>`);
      const t = String(labels[i]);
      if (!marks.some((mk) => mk.t === t)) marks.push({ t, y: py, at: py, tall: /^\d+\/\d+$/.test(t) });
    });
    // 세로축 글이 서로 닿지 않게 위아래로 조금씩 민다(차례는 그대로). 점선과 어긋난 글에는 짧은 끌줄을 긋는다.
    marks.sort((a, b) => b.y - a.y);
    const half = (mk) => (mk.tall ? 11 : 7);
    for (let i = 1; i < marks.length; i += 1) { const need = half(marks[i - 1]) + half(marks[i]) + 1; if (marks[i - 1].y - marks[i].y < need) marks[i].y = marks[i - 1].y - need; }
    const topMost = marks.length ? marks[marks.length - 1] : null;
    if (topMost && topMost.y - half(topMost) < 18) { const shift = 18 - (topMost.y - half(topMost)); marks.forEach((mk) => { mk.y += shift; }); for (let i = 0; i < marks.length; i += 1) if (marks[i].y > base - half(marks[i])) marks[i].y = base - half(marks[i]); }
    for (const mk of marks) {
      const m = /^(\d+)\/(\d+)$/.exec(mk.t), py = mk.y, lx = Math.abs(mk.y - mk.at) > 2 ? left - 18 : left - 9;
      if (Math.abs(mk.y - mk.at) > 2) out.push(`<path d="M${left} ${f1(mk.at)}L${left - 8} ${f1(py)}" style="fill:none;stroke:${GRAY};stroke-width:0.8"/>`);
      if (m) out.push(`<text x="${lx}" y="${f1(py - 2)}" text-anchor="middle" style="font-size:10.5px;fill:${INK}">${m[1]}</text><line x1="${lx - 6}" y1="${f1(py + 0.5)}" x2="${lx + 6}" y2="${f1(py + 0.5)}" style="stroke:${INK};stroke-width:0.9"/><text x="${lx}" y="${f1(py + 10)}" text-anchor="middle" style="font-size:10.5px;fill:${INK}">${m[2]}</text>`);
      else if (/^[a-z]$/.test(mk.t)) out.push(`<text x="${lx + 3}" y="${f1(py + 4)}" text-anchor="end" style="font-size:13px;fill:${INK};${ITAL}">${mk.t}</text>`);
      else out.push(`<text x="${lx + 4}" y="${f1(py + 4)}" text-anchor="end" style="font-size:11px;fill:${INK}">${sesc(mk.t)}</text>`);
    }
    const said = `확률분포를 나타낸 막대그래프(가로축 ${lv}, 세로축 P(${v} = ${lv})): ` + xs.map((x, i) => `${v} = ${num(x)}일 때 ${labels[i]}`).join(', ') + '.';
    const W = Math.ceil(right + 22), Ht = base + 20;
    return `<svg class="mb-geo" viewBox="0 0 ${W} ${Ht}" width="${W}" role="img" aria-label="${sesc(said)}">${out.join('')}</svg>`;
  }
  // 확률밀도함수의 그래프(꺾은선): pts [[x, y], …] (실수 — 첫 점과 끝 점에서 x축으로 내려가는 곳은 점선), o.xt / o.yt 눈금(plot 과 같다), o.say 그림 설명,
  //  o.w 너비, o.h 높이(px), o.name 곡선 이름(기본 'y=f(x)'), o.guides 점선을 긋는 꼭짓점 차례(기본 모두), o.fill [from, to] 칠할 구간.
  function pdfPlot(pts, o) {
    const opt = o || {}, xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    const x0 = Math.min(0, xs[0]), xL = xs[xs.length - 1], ymax = Math.max(...ys), span = xL - x0;
    const xr = [x0 - (x0 < 0 ? span * 0.08 : span * 0.06), xL + span * 0.14], yr = [Math.min(0, ...ys), ymax * 1.32];
    const ux = Math.min(44, ((opt.w || 270) - 46) / (xr[1] - xr[0])), ysc = (opt.h || 118) / ((yr[1] - yr[0]) * ux);
    const f = (x) => {
      for (let i = 1; i < pts.length; i += 1) {
        const [a, b] = pts[i - 1], [c, e] = pts[i];
        if (x <= c + 1e-12) return c === a ? Math.max(b, e) : b + (e - b) * (x - a) / (c - a);
      }
      return ys[ys.length - 1];
    };
    const segs = [];
    (opt.guides || pts.map((_, i) => i)).forEach((i) => {
      const [x, y] = pts[i];
      if (Math.abs(y) < 1e-12) return;
      segs.push({ p: [x, y], q: [x, 0], dash: true });
      if (Math.abs(x) > 1e-12) segs.push({ p: [x, y], q: [0, y], dash: true });
    });
    const inner = xs.slice(1, -1);
    return plot({
      x: xr, y: yr, ys: ysc, w: opt.w, xt: opt.xt, yt: opt.yt, segs,
      fill: opt.fill ? [{ f, from: opt.fill[0], to: opt.fill[1] }] : undefined,
      curves: [{ f, from: xs[0], to: xL, breaks: inner, name: opt.name === undefined ? 'y=f(x)' : opt.name || undefined }],
      say: opt.say
    });
  }
  // 꺾은선 확률밀도함수의 넓이(정확한 유리수): pts 는 [Q x, Q y] 의 배열, [lo, hi] 사이
  function areaQ(pts, lo, hi) {
    let s = R(0);
    for (let i = 1; i < pts.length; i += 1) {
      const [a, ya] = pts[i - 1], [b, yb] = pts[i];
      const L = qcmpMax(a, lo), U = qcmpMin(b, hi);
      if (qsub(U, L).p <= 0) continue;
      const at = (x) => (qsub(b, a).p === 0 ? ya : qadd(ya, qmul(qdiv(qsub(yb, ya), qsub(b, a)), qsub(x, a))));
      s = qadd(s, qmul(qmul(qadd(at(L), at(U)), qsub(U, L)), R(1, 2)));
    }
    return s;
  }
  const qcmpMax = (x, y) => (x.p * y.q - y.p * x.q >= 0 ? x : y), qcmpMin = (x, y) => (x.p * y.q - y.p * x.q <= 0 ? x : y);
  const fl = (q) => q.p / q.q;
  // 꼭짓점 글(그림 설명)
  const ptsSay = (pts, names) => pts.map((p, i) => `(${names && names[i] ? names[i] : pl(p[0])}, ${names && names[i + pts.length] ? names[i + pts.length] : pl(p[1])})`).join(', ');

  // 다른 파일(b·c)이 함께 쓰는 도구
  B.kit.u1135 = {
    UNIT, STD1, STD2, STD3, num, par, jn, jq, R, fq, fqj, pl, sumQ, comb, isIntQ, X, Xs, PX, PR, EX, VX, SX, EX2, NOTEF, rng, cases, cell,
    stripH, seal, retry, srcOf, T, H, numQ, ratQ, slots, fracsQ, distFit, sdAns, rootAns, oneQ, setsQ, GA, bogi, barPlot, pdfPlot, areaQ, fl
  };

  B.addUnit({
    id: '11-3-5', grade: 11, semester: 3, no: 5, title: '확률분포', version: 1,
    groups: [
      { id: 'rv', title: '확률변수와 이산확률변수의 확률분포', standard: STD1, types: [] },
      { id: 'cont', title: '연속확률변수의 확률분포', standard: STD1, types: [] },
      { id: 'mean', title: '이산확률변수의 기댓값과 표준편차', standard: STD2, types: [] },
      { id: 'lin', title: '확률변수 aX + b의 평균·분산·표준편차', standard: STD2, types: [] },
      { id: 'binp', title: '이항분포의 뜻과 확률', standard: STD3, types: [] },
      { id: 'binm', title: '이항분포의 평균·분산·표준편차', standard: STD3, types: [] }
    ]
  });

  // ── 뽑기 상황(조합으로 세는 분포) ──
  // 두 종류 A(a개), B(b개)에서 r개를 동시에 뽑을 때 A의 개수 X. who: 글감
  const DRAWS = [
    { a: '여학생', b: '남학생', u: '명', act: (r) => `임의로 ${r}명을 뽑을 때`, what: '뽑힌 여학생의 수', head: (a, b) => `남학생 ${b}명, 여학생 ${a}명으로 이루어진 동아리에서` },
    { a: '흰 공', b: '검은 공', u: '개', act: (r) => `임의로 ${r}개의 공을 동시에 꺼낼 때`, what: '꺼낸 흰 공의 개수', head: (a, b) => `흰 공 ${a}개와 검은 공 ${b}개가 들어 있는 주머니에서` },
    { a: '검은색 볼펜', b: '빨간색 볼펜', u: '개', act: (r) => `임의로 ${r}개의 볼펜을 꺼낼 때`, what: '꺼낸 검은색 볼펜의 수', head: (a, b) => `검은색 볼펜 ${a}개와 빨간색 볼펜 ${b}개가 들어 있는 필통에서` },
    { a: '파란 공', b: '빨간 공', u: '개', act: (r) => `임의로 ${r}개의 공을 동시에 꺼낼 때`, what: '꺼낸 파란 공의 개수', head: (a, b) => `빨간 공 ${b}개와 파란 공 ${a}개가 들어 있는 상자에서` }
  ];
  function drawOf(d, o) {
    const opt = o || {};
    const s = d.pick(DRAWS), a = d.int(opt.amin || 2, opt.amax || 5), b = d.int(opt.bmin || 2, opt.bmax || 5), r = d.int(2, Math.min(opt.rmax || 4, a + b - 1));
    const lo = Math.max(0, r - b), hi = Math.min(r, a), xs = [];
    for (let k = lo; k <= hi; k += 1) xs.push(k);
    const all = comb(a + b, r), ps = xs.map((k) => R(comb(a, k) * comb(b, r - k), all));
    return { s, a, b, r, xs, ps, all, text: `${s.head(a, b)} ${s.act(r)}, ${s.what}를 확률변수 ${jh(X, '이라/라')} 하자.` };
  }
  // P(X = k) 를 조합으로 적은 글
  const drawTold = (D, k) => `${nb(PX(k) + ' = ' + frac(nC(D.a, k) + ' × ' + nC(D.b, D.r - k), nC(D.a + D.b, D.r)))} = ${fq(D.ps[D.xs.indexOf(k)])}`;

  // ════════════════════════════════════════════════════════════════
  // ── 확률변수와 이산확률변수의 확률분포 ──
  B.addTypes(UNIT, 'rv', [
    T('rv-value', '시행의 결과에 대응하는 확률변수의 값', '①1', (d, n) => {
      if (n === 0) {
        const m = d.int(2, 4);
        const sets = [[0, m], [1, m], [0, m - 1], [1, m - 1], [0, m + 1]].map(([s, e]) => Array.from({ length: e - s + 1 }, (_, i) => s + i));
        const rows = sets.map((list, i) => ({ h: list.join(', '), ok: i === 0 }));
        return oneQ(d, `흰 공 1개와 검은 공 1개가 들어 있는 주머니가 ${m}개 있다. 각 주머니에서 공을 임의로 한 개씩 꺼낼 때, 꺼낸 흰 공의 개수를 확률변수 ${jh(X, '이라/라')} 하자. ${jh(X, '이/가')} 가질 수 있는 값을 모두 나열한 것은?`, rows, true, {
          explain: `주머니마다 흰 공(W)이나 검은 공(B)이 나오므로 표본공간의 원소는 ${'W'.repeat(m)}에서 ${'B'.repeat(m)}까지이다. 각 원소에 대응하는 흰 공의 개수는 0부터 ${m}까지이므로 ${jh(X, '이/가')} 가지는 값은 ${sets[0].join(', ')}이다.`
        });
      }
      const t = d.int(2, 4), k = d.int(1, t - 1), cnt = comb(t, k), all = 2 ** t, p = R(cnt, all);
      return ratQ(`한 개의 동전을 ${t}번 던지는 시행에서 앞면이 나오는 횟수를 확률변수 ${jh(X, '이라/라')} 할 때, ${jh(PX(k), '의')} 값은?`, p, {
        explain: `앞면을 H, 뒷면을 T라 하면 표본공간의 원소는 ${all}개이고, 그 가운데 ${X} = ${k}에 대응하는 원소(H가 ${k}개인 것)는 ${cnt}개이다. 따라서 ${PX(k)} = ${frac(cnt, all)}${p.q === all ? '' : ' = ' + fq(p)}이다.`,
        value: `${cnt}/${all}`, derived: [cnt, all]
      });
    }, { count: 2 }),

    T('rv-kind', '이산확률변수와 연속확률변수 가르기', '①2', (d) => {
      const DISC = ['한 개의 주사위를 두 번 던질 때 나오는 두 눈의 수의 합', '한 개의 동전을 열 번 던질 때 앞면이 나오는 횟수', '어느 반에서 임의로 뽑은 다섯 명 가운데 안경을 쓴 학생의 수', '어느 가게에 한 시간 동안 들어온 손님의 수', '상자에서 임의로 꺼낸 제품 세 개 가운데 불량품의 개수'];
      const CONT = ['어느 지역의 하루 강수량', '임의로 뽑은 고등학생 한 명의 키', '버스 정류장에서 버스를 기다리는 시간', '임의로 고른 수박 한 통의 무게', '호수의 임의의 지점에서 잰 수심'];
      const wantCont = d.bool(), one = d.pick(wantCont ? CONT : DISC), rest = d.shuffle(wantCont ? DISC : CONT).slice(0, 3);
      const rows = [{ h: one, ok: true }].concat(rest.map((h) => ({ h, ok: false })));
      return oneQ(d, `다음 중 확률변수 ${jh(X, '이/가')} ${wantCont ? '연속확률변수' : '이산확률변수'}인 것은? (단, 보기의 양을 ${jh(X, '이라/라')} 한다.)`, rows, true, {
        explain: wantCont ? `길이·무게·시간·양처럼 어떤 범위의 모든 실수 값을 가질 수 있는 것은 연속확률변수이다. 「${one}」만 그렇고 나머지는 셀 수 있는 값(개수·횟수·합)을 가지므로 이산확률변수이다.`
          : `가지는 값이 유한개이거나 셀 수 있으면 이산확률변수이다. 「${one}」는 셀 수 있는 값을 가지고, 나머지는 어떤 범위의 모든 실수 값을 가지므로 연속확률변수이다.`
      });
    }),

    T('rv-pmf', '확률질량함수의 식으로 확률 구하기', '①3', (d, n) => {
      if (n === 0) {
        // 0, 1 / 2, 3 / 4, 5 에 같은 확률이 짝지어진 확률질량함수
        const D = d.pick([8, 10, 12, 16, 20, 24]), half = D / 2;
        const a = d.int(1, half - 2), b = d.int(1, half - a - 1), c = half - a - b;
        if (a === b && b === c) return null;
        const ps = [a, b, c].map((t) => R(t, D)), xsOf = [[0, 1], [2, 3], [4, 5]];
        const lo = d.int(0, 4), hi = d.int(lo + 1, 5);
        if (lo === 0 && hi === 5) return null;
        const at = (x) => ps[Math.floor(x / 2)], picked = []; for (let x = lo; x <= hi; x += 1) picked.push(at(x));
        const ans = sumQ(picked);
        const fig = lines([`${pr(ms('X = x'))} = ${cases(xsOf.map((xs, i) => `${fq(ps[i])}${nbsp}${nbsp}(${Xs} = ${xs.join(', ')})`))}`]);
        return ratQ(`이산확률변수 ${X}의 확률질량함수가 다음과 같을 때, 확률 ${jh(rng(lo, hi), '의')} 값은?`, ans, {
          figure: fig,
          explain: `${rng(lo, hi)} = ${picked.map((_, i) => PX(lo + i)).join(' + ')} = ${picked.map(fq).join(' + ')} = ${fq(ans)}이다.`,
          value: picked.map(jq).join('+')
        });
      }
      const m = d.int(4, 6), c = d.pick([0, 0, 1]), S = Array.from({ length: m }, (_, i) => i + 1 + c).reduce((s, v) => s + v, 0);
      const lo = d.int(1, m - 1), hi = d.int(lo, m), kind = d.int(0, 1);
      if (hi - lo >= m - 1) return null;
      const xs = []; for (let x = lo; x <= hi; x += 1) xs.push(x);
      const ans = R(xs.reduce((s, x) => s + x + c, 0), S);
      const pmf = frac(c ? ms('x + ' + c) : Xs, S);
      const ask = lo === hi ? PX(lo) : kind === 0 || hi < m ? rng(lo, hi) : PR(`X >= ${lo}`);
      return ratQ(`이산확률변수 ${X}의 확률질량함수가 ${nb(pr(ms('X = x')) + ' = ' + pmf)} ${nb('(' + Xs + ' = ' + Array.from({ length: m }, (_, i) => i + 1).join(', ') + ')')}일 때, 확률 ${jh(ask, '의')} 값은?`, ans, {
        explain: `${ask} = ${xs.map((x) => frac(x + c, S)).join(' + ')}${xs.length === 1 && ans.q === S ? '' : ' = ' + fq(ans)}이다.`,
        value: `(${xs.map((x) => c ? `${x}+${c}` : `${x}`).join('+')})/${S}`, derived: [S]
      });
    }, { count: 2 }),

    T('rv-k', '확률질량함수 속의 상수', '①4', (d, n) => {
      if (n === 0) {
        const form = d.int(0, 3);
        let xs, g, gH;
        if (form === 0) { const m = d.int(4, 10); xs = Array.from({ length: m }, (_, i) => i + 1); g = (x) => x; gH = V('k') + Xs; }
        else if (form === 1) { const m = d.int(3, 4); xs = Array.from({ length: m }, (_, i) => i + 1); g = (x) => x * x; gH = V('k') + ms('x^2'); }
        else if (form === 2) { const c = d.int(1, 3), m = d.int(4, 5); xs = Array.from({ length: m }, (_, i) => i + c + 1); g = (x) => x - c; gH = V('k') + ms('(x - ' + c + ')'); }
        else { const c = d.int(1, 3), m = d.int(3, 4); xs = Array.from({ length: m }, (_, i) => i); g = (x) => x + c; gH = V('k') + ms('(x + ' + c + ')'); }
        const S = xs.reduce((s, x) => s + g(x), 0), k = R(1, S);
        return ratQ(`이산확률변수 ${X}의 확률질량함수가 ${nb(pr(ms('X = x')) + ' = ' + gH)} ${nb('(' + Xs + ' = ' + xs.join(', ') + ')')}일 때, 상수 ${jh(V('k'), '의')} 값은?`, k, {
          explain: `확률의 합이 1이므로 ${xs.map((x) => (g(x) === 1 ? '' : g(x)) + V('k')).join(' + ')} = ${S}${V('k')} = 1, ${V('k')} = ${fq(k)}이다.`,
          value: `1/(${xs.map((x) => g(x)).join('+')})`, auto: true
        });
      }
      if (d.bool()) {
        // x/D + k (x = 1, …, r), k (x = r + 1, …, m)
        const r = d.int(2, 3), extra = d.int(2, 3), m = r + extra, s = r * (r + 1) / 2, D = d.pick([12, 15, 18, 20, 24, 30]);
        if (D <= s) return null;
        const k = R(D - s, D * m), p = (x) => (x <= r ? qadd(R(x, D), k) : k);
        const lo = d.int(1, m - 1), hi = d.int(lo + 1, m);
        if (hi - lo === m - 1) return null;
        const list = []; for (let x = lo; x <= hi; x += 1) list.push(p(x));
        const ans = sumQ(list), pieceH = cases([`${frac(Xs, D)} + ${V('k')}${nbsp}${nbsp}(${Xs} = ${Array.from({ length: r }, (_, i) => i + 1).join(', ')})`, `${V('k')}${nbsp}${nbsp}(${Xs} = ${Array.from({ length: extra }, (_, i) => r + i + 1).join(', ')})`]);
        return ratQ(`이산확률변수 ${X}의 확률질량함수가 다음과 같을 때, 확률 ${jh(rng(lo, hi), '의')} 값은? (단, ${V('k')}는 상수이다.)`, ans, {
          figure: lines([`${pr(ms('X = x'))} = ${pieceH}`]),
          explain: `확률의 합이 1이므로 ${frac(Array.from({ length: r }, (_, i) => i + 1).join(' + '), D)} + ${m}${V('k')} = 1, ${V('k')} = ${fq(k)}이다. 따라서 ${rng(lo, hi)} = ${list.map(fq).join(' + ')} = ${fq(ans)}이다.`,
          value: list.map(jq).join('+'), auto: true
        });
      }
      // k(x − c) (x = c + 2, …, c + 2 + m − 1)
      const c = d.int(1, 3), m = 5, xs = Array.from({ length: m }, (_, i) => c + 2 + i), S = xs.reduce((s, x) => s + x - c, 0), k = R(1, S);
      const t = d.pick(xs.slice(1, -1)), list = xs.filter((x) => x >= t).map((x) => R(x - c, S)), ans = sumQ(list);
      return ratQ(`이산확률변수 ${X}의 확률질량함수가 ${nb(pr(ms('X = x')) + ' = ' + V('k') + ms('(x - ' + c + ')'))} ${nb('(' + Xs + ' = ' + xs.join(', ') + ')')}일 때, 확률 ${jh(PR(`X >= ${t}`), '의')} 값은? (단, ${V('k')}는 상수이다.)`, ans, {
        explain: `확률의 합이 1이므로 ${xs.map((x) => (x - c) + V('k')).join(' + ')} = ${S}${V('k')} = 1, ${V('k')} = ${fq(k)}이다. 따라서 ${PR(`X >= ${t}`)} = ${frac(xs.filter((x) => x >= t).map((x) => x - c).join(' + '), S)} = ${fq(ans)}이다.`,
        value: `(${xs.filter((x) => x >= t).map((x) => `${x}-${c}`).join('+')})/(${xs.map((x) => `${x}-${c}`).join('+')})`
      });
    }, { count: 2 }),

    T('rv-blank', '확률분포표의 빈칸으로 확률 구하기', '①5', (d) => {
      if (d.bool()) {
        // a, ca, p
        const cf = d.pick([2, 3]), q = d.pick([5, 7, 9, 11, 13]), pj = d.int(1, q - 2), p = R(pj, q);
        const a = qmul(qsub(R(1), p), R(1, 1 + cf));
        if (a.p <= 0) return null;
        const st = d.pick([1, 2]), x1 = d.int(1, 3), xs = [x1, x1 + st, x1 + 2 * st], ps = [a, qmul(a, R(cf)), p];
        const askHi = d.bool(), ans = askHi ? qadd(ps[1], ps[2]) : qadd(ps[0], ps[1]), ask = askHi ? PR(`X >= ${xs[1]}`) : PR(`X <= ${xs[1]}`);
        const aH = V('a');
        return ratQ(`이산확률변수 ${X}의 확률분포가 다음 표와 같을 때, 확률 ${jh(ask, '의')} 값은? (단, ${aH}는 상수이다.)`, ans, {
          figure: distFit(xs, [aH, cf + aH, cell(p)]),
          explain: `확률의 합이 1이므로 ${aH} + ${cf}${aH} + ${fq(p)} = 1, ${aH} = ${fq(a)}이다. 따라서 ${ask} = ${askHi ? `${cf}${aH} + ${fq(p)}` : `${aH} + ${cf}${aH}`} = ${fq(ans)}이다.`,
          value: askHi ? `${cf}*(1-${jq(p)})/(1+${cf})+${jq(p)}` : `(1+${cf})*(1-${jq(p)})/(1+${cf})`
        });
      }
      const D = d.pick([8, 10, 12]), parts = [d.int(1, 3), d.int(1, 3), d.int(1, 3)], last = D - parts.reduce((s, v) => s + v, 0);
      if (last < 1) return null;
      const ps = parts.concat([last]).map((t) => R(t, D)), xs = [1, 2, 3, 4], lo = d.int(2, 3);
      const ans = sumQ(ps.slice(lo - 1)), aH = V('a');
      return ratQ(`이산확률변수 ${X}의 확률분포가 다음 표와 같을 때, 확률 ${jh(rng(lo, 4), '의')} 값은? (단, ${aH}는 상수이다.)`, ans, {
        figure: distFit(xs, ps.slice(0, 3).map(cell).concat([aH])),
        explain: `확률의 합이 1이므로 ${aH} = 1 ${MINUS} (${ps.slice(0, 3).map(fq).join(' + ')}) = ${fq(ps[3])}이다. 따라서 ${rng(lo, 4)} = ${ps.slice(lo - 1).map(fq).join(' + ')} = ${fq(ans)}이다.`,
        value: ps.slice(lo - 1, 3).map(jq).concat([`1-${ps.slice(0, 3).map(jq).join('-')}`]).join('+')
      });
    }),

    T('rv-graph', '막대그래프로 나타낸 확률분포로 확률 구하기', '①6', (d) => {
      const LIST = [[[1, 4], [1, 2], [1, 4]], [[1, 6], [1, 2], [1, 3]], [[1, 3], [1, 2], [1, 6]], [[1, 8], [3, 8], [1, 2]], [[1, 8], [3, 8], [3, 8], [1, 8]], [[1, 10], [2, 5], [3, 10], [1, 5]], [[1, 6], [1, 3], [1, 3], [1, 6]], [[1, 12], [1, 4], [1, 2], [1, 6]]];
      const ps = d.pick(LIST).map(([a, b]) => R(a, b)), start = d.pick([0, 0, 1]), xs = ps.map((_, i) => start + i);
      const cut = d.pick(xs.slice(1)), up = d.bool();
      const picked = xs.map((x, i) => [x, ps[i]]).filter(([x]) => (up ? x >= cut : x < cut));
      const ans = sumQ(picked.map((t) => t[1])), ask = up ? PR(`X >= ${cut}`) : PR(`X <= ${cut - 1}`);
      return ratQ(`이산확률변수 ${X}의 확률분포를 나타낸 그래프가 다음과 같을 때, 확률 ${jh(ask, '의')} 값은?`, ans, {
        figure: barPlot(xs, ps.map(fl), ps.map(pl)),
        explain: `그래프에서 ${picked.map(([x, p]) => nb(PX(x) + ' = ' + fq(p))).join(', ')}이므로 ${ask} = ${fq(ans)}이다.`,
        value: picked.map((t) => jq(t[1])).join('+')
      });
    }),

    T('rv-graph2', '막대그래프 속 미정인 확률 두 개', '①7', (d) => {
      const pat = Array.from({ length: 5 }, () => (d.bool() ? 'a' : 'b'));
      const ka = pat.filter((t) => t === 'a').length, kb = 5 - ka;
      if (ka < 1 || kb < 1) return null;
      const bq = R(1, d.pick([6, 8, 10, 12, 16])), aq = qdiv(qsub(R(1), qmul(R(kb), bq)), R(ka));
      if (aq.p <= 0 || (aq.p === bq.p && aq.q === bq.q) || aq.q > 60) return null;
      const t = d.int(2, 4), ca = pat.slice(t - 1).filter((s) => s === 'a').length, cb = pat.slice(t - 1).filter((s) => s === 'b').length;
      if (ka * cb - kb * ca === 0) return null;
      const r = qadd(qmul(R(ca), aq), qmul(R(cb), bq));
      const xs = [1, 2, 3, 4, 5], hs = pat.map((s) => (s === 'a' ? aq : bq));
      const aH = V('a'), bH = V('b');
      return fracsQ(`이산확률변수 ${X}의 확률분포를 나타낸 그래프가 다음과 같다. ${jh(nb(PR(`X >= ${t}`) + ' = ' + fq(r)), '일')} 때, 두 상수 ${aH}, ${jh(bH, '의')} 값은?`, [[aH, aq], [bH, bq]], {
        figure: barPlot(xs, hs.map(fl), pat),
        explain: `확률의 합이 1이므로 ${ka === 1 ? '' : ka}${aH} + ${kb === 1 ? '' : kb}${bH} = 1이고, ${PR(`X >= ${t}`)} = ${[ca ? (ca === 1 ? '' : ca) + aH : '', cb ? (cb === 1 ? '' : cb) + bH : ''].filter(Boolean).join(' + ')} = ${fq(r)}이다. 두 식을 연립하면 ${aH} = ${fq(aq)}, ${bH} = ${fq(bq)}이다.`,
        auto: true
      });
    }),

    T('rv-draw', '뽑기 상황의 확률분포표의 칸', '①8', (d) => {
      const D = drawOf(d);
      if (D.xs.length < 3 || D.xs.length > 5) return null;
      const [i, j] = d.shuffle(D.xs.map((_, t) => t)).slice(0, 2).sort((u, v) => u - v);
      const shown = D.ps.map((p, t) => (t === i ? '㉠' : t === j ? '㉡' : cell(p))), fig = distFit(D.xs, shown);
      if (!fig) return null;
      return fracsQ(`${D.text} ${jh(X, '의')} 확률분포를 다음과 같이 표로 나타낼 때, ㉠, ㉡에 알맞은 수는?`, [['㉠', D.ps[i], false, [`${comb(D.a, D.xs[i])}*${comb(D.b, D.r - D.xs[i])}`, `${D.all}`]], ['㉡', D.ps[j], false, [`${comb(D.a, D.xs[j])}*${comb(D.b, D.r - D.xs[j])}`, `${D.all}`]]], {
        figure: fig,
        explain: `${jh(X, '이/가')} 가지는 값은 ${D.xs.join(', ')}이고 ${drawTold(D, D.xs[i])}, ${drawTold(D, D.xs[j])}이다.`,
        auto: true
      });
    }),

    T('rv-pair', '두 수로 정한 확률변수(눈의 수의 차, 작은 수)의 확률분포표의 칸', '①9', (d, n) => {
      let xs, ps, text, told, exprs;
      if (n === 0) {
        const f = d.pick([4, 6]), die = f === 6 ? '한 개의 주사위' : '1부터 4까지의 수가 하나씩 적힌 정사면체 모양의 주사위 한 개', all = f * f;
        xs = Array.from({ length: f }, (_, i) => i);
        if (f === 6) xs = xs.slice(0, 5);   // 표가 휴대폰 너비에 들게 다섯 칸(차가 5인 경우는 표 밖에서 1에서 뺀다)
        const cnt = (k) => (k === 0 ? f : 2 * (f - k));
        ps = xs.map((k) => R(cnt(k), all));
        text = `${die}를 두 번 던져서 나오는 눈의 수의 차를 확률변수 ${jh(X, '이라/라')} 하자.`;
        told = (k) => `눈의 수의 차가 ${k}인 경우는 ${cnt(k)}가지이므로 ${PX(k)} = ${frac(cnt(k), all)}${R(cnt(k), all).q === all ? '' : ' = ' + fq(R(cnt(k), all))}`;
        exprs = (k) => [String(cnt(k)), String(all)];
        if (f === 6) {
          const [i, j] = d.shuffle([0, 1, 2, 3, 4]).slice(0, 2).sort((u, v) => u - v);
          const shown = ps.map((p, t) => (t === i ? '㉠' : t === j ? '㉡' : cell(p)));
          return fracsQ(`${text} 다음은 ${jh(X, '의')} 확률분포를 ${X} = 0부터 ${X} = 4까지 나타낸 표이다(${PX(5)} = ${frac(1, 18)}). 표에서 ㉠, ㉡에 알맞은 수는?`, [['㉠', ps[i], false, exprs(xs[i])], ['㉡', ps[j], false, exprs(xs[j])]], {
            figure: dist(xs, shown, { total: false }), explain: `${told(xs[i])}, ${told(xs[j])}이다.`, auto: true
          });
        }
      } else {
        const Nn = d.int(5, 6), big = d.bool(), all = comb(Nn, 2);
        xs = big ? Array.from({ length: Nn - 1 }, (_, i) => i + 2) : Array.from({ length: Nn - 1 }, (_, i) => i + 1);
        const cnt = (k) => (big ? k - 1 : Nn - k);
        ps = xs.map((k) => R(cnt(k), all));
        text = `1부터 ${Nn}까지의 자연수가 하나씩 적힌 카드 ${Nn}장 중에서 2장을 동시에 꺼낼 때, 꺼낸 카드에 적힌 두 수 중 ${big ? '큰' : '작은'} 수를 확률변수 ${jh(X, '이라/라')} 하자.`;
        told = (k) => `${big ? '큰' : '작은'} 수가 ${k}인 경우는 ${big ? `나머지 한 장이 ${k}보다 작은` : `나머지 한 장이 ${k}보다 큰`} ${cnt(k)}가지이므로 ${PX(k)} = ${frac(cnt(k), nC(Nn, 2))} = ${fq(R(cnt(k), all))}`;
        exprs = (k) => [String(cnt(k)), String(all)];
      }
      const [i, j] = d.shuffle(xs.map((_, t) => t)).slice(0, 2).sort((u, v) => u - v);
      const shown = ps.map((p, t) => (t === i ? '㉠' : t === j ? '㉡' : cell(p))), fig = distFit(xs, shown);
      if (!fig) return null;
      return fracsQ(`${text} ${jh(X, '의')} 확률분포를 나타낸 다음 표에서 ㉠, ㉡에 알맞은 수는?`, [['㉠', ps[i], false, exprs(xs[i])], ['㉡', ps[j], false, exprs(xs[j])]], {
        figure: fig, explain: `${told(xs[i])}, ${told(xs[j])}이다.`, auto: true
      });
    }, { count: 2 }),

    T('rv-twostep', '두 단계 시행(주사위·카드 → 동전)의 확률', '①10', (d) => {
      const first = d.pick([
        { h: '한 개의 주사위를 던져서 나오는 눈의 수가 홀수이면', o: '짝수이면', p: R(1, 2) },
        { h: '한 개의 주사위를 던져서 나오는 눈의 수가 3의 배수이면', o: '3의 배수가 아니면', p: R(1, 3) },
        { h: '1부터 5까지의 자연수가 하나씩 적힌 카드 5장 중에서 임의로 1장을 꺼내어 짝수가 나오면', o: '홀수가 나오면', p: R(2, 5) }
      ]);
      const [mA, mB] = d.shuffle([[3, 2], [2, 1], [3, 1], [4, 2], [2, 3], [1, 2]])[0];
      const pX = (j) => qadd(qmul(first.p, R(comb(mA, j), 2 ** mA)), qmul(qsub(R(1), first.p), R(comb(mB, j), 2 ** mB)));
      const k = d.int(1, Math.max(mA, mB)), ans = qadd(pX(0), pX(k));
      const eq = k === 1 ? 'X^2 - X = 0' : `X^2 - ${k}X = 0`, coin = (m) => (m === 1 ? '동전 1개를 던지고' : `동전 ${m}개를 동시에 던지고`);
      return ratQ(`${first.h} ${coin(mA)}, ${first.o} ${coin(mB).replace('던지고', '던진다')}. 이때 앞면이 나오는 동전의 개수를 확률변수 ${jh(X, '이라/라')} 하자. 확률 ${jh(PR(eq), '의')} 값은?`, ans, {
        explain: `${ms(eq)}에서 ${X} = 0 또는 ${X} = ${k}이다. ${PX(0)} = ${fq(first.p)} × ${frac(comb(mA, 0), 2 ** mA)} + ${fq(qsub(R(1), first.p))} × ${frac(comb(mB, 0), 2 ** mB)} = ${fq(pX(0))}, ${PX(k)} = ${fq(first.p)} × ${frac(comb(mA, k), 2 ** mA)} + ${fq(qsub(R(1), first.p))} × ${frac(comb(mB, k), 2 ** mB)} = ${fq(pX(k))}이므로 구하는 확률은 ${fq(ans)}이다.`,
        value: `${jq(first.p)}*${comb(mA, 0)}/${2 ** mA}+(1-${jq(first.p)})*${comb(mB, 0)}/${2 ** mB}+${jq(first.p)}*${comb(mA, k)}/${2 ** mA}+(1-${jq(first.p)})*${comb(mB, k)}/${2 ** mB}`, auto: true
      });
    }),

    T('rv-tele', '확률질량함수 k/{x(x+1)} — 부분분수로 합 구하기', '①11', (d) => {
      const n = d.int(5, 12), k = R(n + 1, n), a = d.int(1, n - 2), b = d.int(a + 1, n);
      if (a === 1 && b === n) return null;
      const ans = qmul(k, qsub(R(1, a), R(1, b + 1)));
      return ratQ(`이산확률변수 ${X}의 확률질량함수가 ${nb(pr(ms('X = x')) + ' = ' + frac(V('k'), ms('x(x + 1)')))} ${nb('(' + Xs + ' = 1, 2, 3, …, ' + n + ')')}일 때, 확률 ${jh(rng(a, b), '의')} 값은? (단, ${V('k')}는 상수이다.)`, ans, {
        explain: `${frac(1, ms('x(x + 1)'))} = ${frac(1, Xs)} ${MINUS} ${frac(1, ms('x + 1'))}이므로 확률의 합은 ${V('k')}(1 ${MINUS} ${frac(1, n + 1)}) = ${frac(n, n + 1)}${V('k')} = 1, ${V('k')} = ${fq(k)}이다. 따라서 ${rng(a, b)} = ${V('k')}(${a === 1 ? '1' : frac(1, a)} ${MINUS} ${frac(1, b + 1)}) = ${fq(ans)}이다.`,
        value: `(${n}+1)/${n}*(1/${a}-1/(${b}+1))`
      });
    }),

    T('rv-cond', '확률질량함수 속 상수와 조건부확률', '①12', (d) => {
      const S = d.pick([{ g1: 3, g2: 3, g3: 2, ts: [10, 11, 12] }, { g1: 2, g2: 2, g3: 2, ts: [7, 8, 10] }]), t = d.pick(S.ts), s = S.g1 + 2 * S.g2;
      const m = (t * t - s * t) / S.g3;
      if (!Number.isInteger(m) || m < 2) return null;
      const c = R(1, t), Nn = S.g1 + S.g2 + S.g3;
      const p = (x) => (x < S.g1 ? c : x < S.g1 + S.g2 ? qmul(R(2), c) : qmul(R(m), qmul(c, c)));
      const v = d.int(1, S.g1 + S.g2 - 1), u = d.int(Math.max(v + 1, S.g1 + S.g2), Nn - 2);
      const PB = sumQ(Array.from({ length: Nn - v }, (_, i) => p(v + i))), PAB = sumQ(Array.from({ length: u - v + 1 }, (_, i) => p(v + i))), ans = qdiv(PAB, PB);
      const listX = (lo, hi) => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i).join(', ');
      const cH = V('c');
      const fig = lines([`${pr(ms('X = x'))} = ${cases([`${cH}${nbsp}${nbsp}(${Xs} = ${listX(0, S.g1 - 1)})`, `2${cH}${nbsp}${nbsp}(${Xs} = ${listX(S.g1, S.g1 + S.g2 - 1)})`, `${m}${cH}<sup>2</sup>${nbsp}${nbsp}(${Xs} = ${listX(S.g1 + S.g2, Nn - 1)})`])}`]);
      return ratQ(`이산확률변수 ${X}의 확률질량함수가 다음과 같다. ${jh(X, '이/가')} ${u} 이하인 사건을 A, ${v} 이상인 사건을 B라 할 때, ${jh(pr('A', 'B'), '의')} 값은? (단, ${cH} &gt; 0)`, ans, {
        figure: fig,
        explain: `확률의 합이 1이므로 ${S.g1}${cH} + ${2 * S.g2}${cH} + ${S.g3 * m}${cH}<sup>2</sup> = 1, ${cH} &gt; 0이므로 ${cH} = ${fq(c)}이다. ${pr('B')} = ${PR(`X >= ${v}`)} = ${fq(PB)}, ${pr('A∩B')} = ${rng(v, u)} = ${fq(PAB)}이므로 ${pr('A', 'B')} = ${fq(ans)}이다.`,
        value: `(${jq(PAB)})/(${jq(PB)})`, auto: true
      });
    })
  ]);

  // ════════════════════════════════════════════════════════════════
  // ── 연속확률변수의 확률분포 ──
  // 꺾은선 확률밀도함수의 그림 눈금: 꼭짓점의 x 를 가로 눈금, 높이를 세로 눈금으로(이름이 주어지면 그 글로)
  function xTicks(vals) {
    const out = [], seen = new Set();
    for (const q of vals) { const t = pl(q); if (q.p === 0 || seen.has(t)) continue; seen.add(t); out.push({ v: fl(q), t }); }
    return out;
  }
  function yTicks(list) {
    const out = [], seen = new Set();
    for (const [q, t] of list) { const key = t || pl(q); if (fl(q) === 0 || seen.has(key)) continue; seen.add(key); out.push({ v: fl(q), t: key }); }
    return out;
  }
  B.addTypes(UNIT, 'cont', [
    T('cont-can', '확률밀도함수의 그래프가 될 수 있는 것 고르기', '①13', (d) => {
      // 후보: 넓이가 1인 꺾은선(된다), 넓이가 1이 아닌 꺾은선(안 된다), 반원(넓이 π/2 — 안 된다), x축 아래로 내려가는 직선(안 된다)
      const make = (kind) => {
        if (kind === 'tri') { const p = d.int(1, 3), q = d.int(1, 3), h = R(2, p + q), ok = d.bool(), hh = ok ? h : qmul(h, R(d.pick([2, 3]))); return { pts: [[R(-p), R(0)], [R(0), hh], [R(q), R(0)]], ok, area: qmul(R(p + q, 2), hh) }; }
        if (kind === 'rect') { const a = d.int(0, 2), L = d.int(2, 4), ok = d.bool(), h = ok ? R(1, L) : R(1, L + 1); return { pts: [[R(a), R(0)], [R(a), h], [R(a + L), h], [R(a + L), R(0)]], ok, area: qmul(R(L), h) }; }
        if (kind === 'semi') return { semi: true, ok: false };
        const L = d.pick([2, 3, 4]); return { pts: [[R(0), R(1)], [R(L), R(-1, L)]], ok: false, neg: true, L };
      };
      const kinds = d.shuffle(['tri', 'rect', d.pick(['semi', 'neg'])]), rows = kinds.map(make);
      if (!rows.some((r) => r.ok) || rows.every((r) => r.ok)) return null;
      const small = (r) => {
        if (r.semi) return plot({ x: [-1.4, 1.5], y: [0, 1.35], w: 136, xt: [-1, 1], yt: [1], params: [{ x: (t) => Math.cos(t), y: (t) => Math.sin(t), from: 0, to: Math.PI }], say: '중심이 원점이고 반지름의 길이가 1인 반원(x축 위쪽).' });
        if (r.neg) return plot({ x: [-0.4, r.L + 0.7], y: [-1.2, 1.4], w: 136, xt: [r.L], yt: [1, { v: -1 / r.L, t: MINUS + '1/' + r.L }], curves: [{ f: (x) => 1 - (1 + 1 / r.L) * x / r.L, from: 0, to: r.L }], segs: [{ p: [r.L, -1 / r.L], q: [r.L, 0], dash: true }], say: `점 (0, 1)과 점 (${r.L}, ${MINUS}1/${r.L})을 잇는 선분(x축 아래로 내려간다).` });
        const pts = r.pts.map(([x, y]) => [fl(x), fl(y)]);
        return pdfPlot(pts, { w: 136, h: 70, name: null, xt: xTicks(r.pts.map((p) => p[0])), yt: yTicks(r.pts.map((p) => [p[1]])), say: '꼭짓점 ' + ptsSay(r.pts) + '을 차례로 잇는 꺾은선.' });
      };
      const fig = '<div style="display:flex;flex-wrap:wrap;gap:6px 10px">' + rows.map((r, i) => `<div><div style="font-size:0.95rem">${GA[i]}.</div>${small(r)}</div>`).join('') + '</div>';
      const why = rows.map((r, i) => GA[i] + '. ' + (r.semi ? '반원과 x축으로 둘러싸인 부분의 넓이가 π/2이므로 될 수 없다.' : r.neg ? '함숫값이 음수인 부분이 있으므로 될 수 없다.' : `함숫값이 0 이상이고 그래프와 x축으로 둘러싸인 부분의 넓이가 ${fq(r.area)}이므로 ${r.ok ? '될 수 있다' : '될 수 없다'}.`)).join(' ');
      return setsQ(d, `연속확률변수 ${X}의 확률밀도함수의 그래프가 될 수 있는 것만을 있는 대로 고른 것은?`, rows.map((r) => ({ h: '', ok: r.ok })), { figure: fig, inFigure: true, explain: why });
    }),

    T('cont-unif', '함숫값이 일정한 확률밀도함수', '①14', (d, n) => {
      if (n === 0) {
        const L = d.pick([4, 5, 6, 8, 10]), al = d.pick([0, 0, 1, 2, -2]), lo = d.int(al, al + L - 1), hi = d.int(lo + 1, al + L);
        if (hi - lo === L) return null;
        const ans = R(hi - lo, L);
        return ratQ(`연속확률변수 ${X}의 확률밀도함수가 ${nb(ms('f(x) = ') + frac(1, L))} ${nb('(' + ms(`${al} <= x <= ${al + L}`) + ')')}일 때, 확률 ${jh(rng(lo, hi), '의')} 값은?`, ans, {
          explain: `${rng(lo, hi)}는 높이가 ${frac(1, L)}이고 가로가 ${hi - lo}인 직사각형의 넓이이므로 ${hi - lo} × ${frac(1, L)} = ${fq(ans)}이다.`,
          value: `(${jn(hi)}-${jn(lo)})/${L}`
        });
      }
      const L = d.pick([4, 5, 6, 8]), al = d.pick([0, -3, -2, 1, 2]), j = d.int(0, L - 1), t = R(2 * al + 2 * j + 1, 2), r = qdiv(qsub(t, R(al)), R(L)), k = R(1, L);
      return fracsQ(`연속확률변수 ${X}의 확률밀도함수가 ${nb(ms('f(x) = k'))} ${nb('(' + ms(`${al} <= x <= ${al + L}`) + ')')}이고 ${jh(nb(PR('X <= a') + ' = ' + fq(r)), '일')} 때, 두 상수 ${V('k')}, ${jh(V('a'), '의')} 값은? (단, ${ms(`${al} < a < ${al + L}`)})`, [[V('k'), k], [V('a'), t, true]], {
        explain: `그래프와 x축으로 둘러싸인 직사각형의 넓이가 1이므로 ${L}${V('k')} = 1, ${V('k')} = ${fq(k)}이다. ${PR('X <= a')} = (${V('a')} ${MINUS} ${par(al)}) × ${fq(k)} = ${fq(r)}이므로 ${V('a')} = ${fq(t)}이다.`,
        derived: [L, 2 * Math.abs(al) + 2 * j + 1, 2]
      });
    }, { count: 2 }),

    T('cont-line', '일차식으로 준 확률밀도함수', '①15', (d, n) => {
      if (n === 0) {
        const L = d.pick([2, 3, 4, 5, 6]), dec = d.bool(), k = R(2, L * L);
        const lo = d.int(0, L - 1), hi = d.int(lo + 1, L);
        if (hi - lo === L) return null;
        const F = (x) => (dec ? qmul(k, R(L - x)) : qmul(k, R(x)));
        const ans = qmul(qmul(qadd(F(lo), F(hi)), R(hi - lo)), R(1, 2)), strict = d.bool();
        const ask = strict ? PR(`${lo} < X < ${hi}`) : rng(lo, hi);
        const fH = dec ? ms(`f(x) = k(${L} - x)`) : ms('f(x) = kx');
        return ratQ(`연속확률변수 ${X}의 확률밀도함수가 ${nb(fH)} ${nb('(' + ms(`0 <= x <= ${L}`) + ')')}일 때, 확률 ${jh(ask, '의')} 값은? (단, ${V('k')}는 상수이다.)`, ans, {
          explain: `그래프와 x축으로 둘러싸인 삼각형의 넓이가 1이므로 ${frac(1, 2)} × ${L} × ${L}${V('k')} = 1, ${V('k')} = ${fq(k)}이다. ${strict ? `연속확률변수에서는 한 점의 확률이 0이므로 ${ask} = ${rng(lo, hi)}이고, ` : ''}이 확률은 ${F(lo).p === 0 || F(hi).p === 0 ? `밑변 ${hi - lo}, 높이 ${fq(F(lo).p === 0 ? F(hi) : F(lo))}인 삼각형` : `두 평행한 변이 ${fq(F(lo))}, ${fq(F(hi))}이고 높이가 ${hi - lo}인 사다리꼴`}의 넓이이므로 ${fq(ans)}이다.`,
          value: dec ? `2/(${L}*${L})*((${L}-${lo})+(${L}-${hi}))*(${hi}-${lo})/2` : `2/(${L}*${L})*(${lo}+${hi})*(${hi}-${lo})/2`, derived: [2]
        });
      }
      if (d.bool()) {
        // f(x) = m x + k (α ≤ x ≤ β), k 를 모른다
        const m = R(1, d.pick([2, 3, 4, 6, 8])), al = d.int(0, 3), w = d.int(2, 3), be = al + w;
        const k = qdiv(qsub(R(1), qmul(m, R(be * be - al * al, 2))), R(w));
        if (k.p === 0 || k.q === 1) return null;
        const f = (x) => qadd(qmul(m, R(x)), k);
        if (f(al).p < 0) return null;
        const lo = d.int(al, be - 1);
        if (lo === al) return null;
        const ans = qmul(qmul(qadd(f(lo), f(be)), R(be - lo)), R(1, 2));
        if (ans.q === 1) return null;
        return fracsQ(`연속확률변수 ${X}의 확률밀도함수가 ${nb(ms('f(x) = ') + fq(m) + ms('x + k'))} ${nb('(' + ms(`${al} <= x <= ${be}`) + ')')}일 때, 상수 ${jh(V('k'), '의')} 값과 확률 ${jh(PR(`X >= ${lo}`), '의')} 값은?`, [[V('k'), k, true], [PR(`X >= ${lo}`), ans]], {
          explain: `그래프와 x축 및 두 직선 ${ms('x = ' + al)}, ${jh(ms('x = ' + be), '으로/로')} 둘러싸인 사다리꼴의 넓이가 1이므로 ${frac(1, 2)} × {${ms('f(' + al + ')')} + ${ms('f(' + be + ')')}} × ${w} = 1, ${V('k')} = ${fq(k)}이다. ${PR(`X >= ${lo}`)} = ${frac(1, 2)} × (${fq(f(lo))} + ${fq(f(be))}) × ${be - lo} = ${fq(ans)}이다.`,
          auto: true
        });
      }
      // f(x) = 1 − a x (α ≤ x ≤ β), a 를 모른다
      const al = d.int(0, 2), w = d.int(1, 3), be = al + w;
      const a = qdiv(qmul(R(2), R(w - 1)), R(be * be - al * al));
      if (a.p <= 0 || a.q === 1) return null;
      const f = (x) => qsub(R(1), qmul(a, R(x)));
      if (f(be).p < 0) return null;
      const lo = al, hi = d.int(al + 1, be - 1);
      if (hi <= lo) return null;
      const ans = qmul(qmul(qadd(f(lo), f(hi)), R(hi - lo)), R(1, 2));
      if (ans.q === 1) return null;
      return fracsQ(`연속확률변수 ${X}의 확률밀도함수가 ${nb(ms('f(x) = 1 - ax'))} ${nb('(' + ms(`${al} <= x <= ${be}`) + ')')}일 때, 상수 ${jh(V('a'), '의')} 값과 확률 ${jh(rng(lo, hi), '의')} 값은?`, [[V('a'), a, true], [rng(lo, hi), ans]], {
        explain: `그래프와 x축 및 두 직선 ${ms('x = ' + al)}, ${jh(ms('x = ' + be), '으로/로')} 둘러싸인 사다리꼴의 넓이가 1이므로 ${frac(1, 2)} × {(1 ${MINUS} ${al}${V('a')}) + (1 ${MINUS} ${be}${V('a')})} × ${w} = 1, ${V('a')} = ${fq(a)}이다. ${rng(lo, hi)} = ${frac(1, 2)} × (${fq(f(lo))} + ${fq(f(hi))}) × ${hi - lo} = ${fq(ans)}이다.`,
        auto: true
      });
    }, { count: 2 }),

    T('cont-graph', '그래프로 준 확률밀도함수의 높이와 확률', '①16', (d, n) => {
      const kind = d.int(0, 2);
      let pts, names = {};
      if (kind === 0) { const L = d.pick([3, 4, 5, 6]), m = d.int(1, L - 1), x0 = d.pick([0, 0, -1, -2]); pts = [[R(x0), R(0)], [R(x0 + m), R(2, L)], [R(x0 + L), R(0)]]; }
      else if (kind === 1) { const p = d.int(1, 2), fl0 = d.int(2, 5), q = p + fl0, L = q + d.int(1, 2), h = R(2, L + fl0); pts = [[R(0), R(0)], [R(p), h], [R(q), h], [R(L), R(0)]]; }
      else {
        const p = d.int(1, 2), L = p + d.pick([2, 3, 4]), c = R(1, d.pick([10, 12, 20])), a = qdiv(qsub(R(1), qmul(c, R(L - p, 2))), R(p * 2 + L - p, 2));
        if (a.p <= 0 || qsub(a, c).p <= 0) return null;
        pts = [[R(0), a], [R(p), a], [R(L), c]]; names = { c };
      }
      const hTop = pts.reduce((s, p) => (fl(p[1]) > fl(s) ? p[1] : s), R(0));
      const yt = yTicks(pts.map((p) => [p[1], p[1] === hTop || (p[1].p === hTop.p && p[1].q === hTop.q) ? 'a' : null]));
      const sayPts = pts.map((p) => `(${pl(p[0])}, ${p[1].p === hTop.p && p[1].q === hTop.q ? 'a' : pl(p[1])})`).join(', ');
      const drawPts = pts.map(([x, y]) => [fl(x), fl(y)]);
      const fig = pdfPlot(drawPts, { xt: xTicks(pts.map((p) => p[0])), yt, say: '그래프는 점 ' + sayPts + '을 차례로 잇는 꺾은선이다' + (kind === 2 ? `(${pl(pts[0][0])} ≤ x ≤ ${pl(pts[2][0])})` : '') + '.' });
      const area = areaQ(pts, pts[0][0], pts[pts.length - 1][0]);
      if (area.p !== area.q) return null;
      const aH = V('a');
      if (n === 0) {
        return ratQ(`연속확률변수 ${X}의 확률밀도함수 ${jh(ms('f(x)'), '의')} 그래프가 다음과 같을 때, 상수 ${jh(aH, '의')} 값은?`, hTop, {
          figure: fig,
          explain: `그래프와 ${kind === 2 ? `x축 및 두 직선 ${ms('x = 0')}, ${jh(ms('x = ' + pl(pts[2][0])), '으로/로')}` : 'x축으로'} 둘러싸인 부분의 넓이가 1이어야 한다. ${kind === 0 ? `삼각형이므로 ${frac(1, 2)} × ${pl(qsub(pts[2][0], pts[0][0]))} × ${aH} = 1` : kind === 1 ? `사다리꼴이므로 ${frac(1, 2)} × (${pl(qsub(pts[2][0], pts[1][0]))} + ${pl(pts[3][0])}) × ${aH} = 1` : `직사각형과 사다리꼴로 나누면 ${pl(pts[1][0])}${aH} + ${frac(1, 2)} × (${aH} + ${fq(names.c)}) × ${pl(qsub(pts[2][0], pts[1][0]))} = 1`}에서 ${aH} = ${fq(hTop)}이다.`,
          value: jq(hTop), auto: true
        });
      }
      const xsInt = [], lo0 = Math.ceil(fl(pts[0][0])), hi0 = Math.floor(fl(pts[pts.length - 1][0]));
      for (let x = lo0; x <= hi0; x += 1) xsInt.push(x);
      const lo = d.pick(xsInt.slice(0, -1)), hi = d.pick(xsInt.filter((x) => x > lo));
      if (lo === lo0 && hi === hi0) return null;
      const ans = areaQ(pts, R(lo), R(hi));
      if (ans.q === 1 || ans.p === 0) return null;
      return ratQ(`연속확률변수 ${X}의 확률밀도함수 ${jh(ms('f(x)'), '의')} 그래프가 다음과 같을 때, 확률 ${jh(rng(lo, hi), '의')} 값은? (단, ${aH}는 상수이다.)`, ans, {
        figure: fig,
        explain: `그래프 아래의 넓이가 1이므로 ${aH} = ${fq(hTop)}이다. ${jh(rng(lo, hi), '은/는')} 그래프와 x축 및 두 직선 ${ms('x = ' + lo)}, ${jh(ms('x = ' + hi), '으로/로')} 둘러싸인 부분의 넓이이므로 ${fq(ans)}이다.`,
        value: jq(ans), auto: true
      });
    }, { count: 2 }),

    T('cont-piece', '식으로 준 조각 함수 확률밀도함수의 확률', '①17', (d) => {
      const [L, m, story] = d.pick([[6, 3, 0], [4, 2, 0], [6, 2, 0], [8, 4, 0], [10, 5, 0], [5, 2, 0], [60, 30, 1], [40, 20, 1]]);
      const h = R(2, L), s1 = qdiv(h, R(m)), s2 = qdiv(h, R(L - m));
      const f = (x) => (x <= m ? qmul(s1, R(x)) : qmul(s2, R(L - x)));
      const unit = story ? L / 10 : 1, grid = []; for (let x = unit; x < L; x += unit) grid.push(x);
      const askTail = d.bool();
      let ask, ans, how;
      if (askTail) { const t = d.pick(grid.filter((x) => x > m)); ask = PR(`X >= ${t}`); ans = qmul(qmul(f(t), R(L - t)), R(1, 2)); how = `밑변 ${L - t}, 높이 ${ms('f(' + t + ')')} = ${fq(f(t))}인 삼각형의 넓이이므로 ${fq(ans)}`; }
      else {
        const lo = d.pick(grid.filter((x) => x < m)), hi = d.pick(grid.filter((x) => x > m));
        ask = rng(lo, hi); const left = qmul(qmul(f(lo), R(lo)), R(1, 2)), right = qmul(qmul(f(hi), R(L - hi)), R(1, 2)); ans = qsub(R(1), qadd(left, right));
        how = `전체 넓이 1에서 양쪽 삼각형의 넓이 ${fq(left)}, ${fqj(right, '을/를')} 뺀 것이므로 ${fq(ans)}`;
      }
      const c2 = qmul(s2, R(1)), fig = lines([`${ms('f(x)')} = ${cases([`${fq(s1)}${Xs}${nbsp}${nbsp}(${ms(`0 <= x < ${m}`)})`, `${fq(c2)}${ms(`(${L} - x)`)}${nbsp}${nbsp}(${ms(`${m} <= x <= ${L}`)})`])}`]);
      return ratQ(`${story ? `어느 역에서 기차의 도착 예정 시각과 실제 도착 시각의 차(분)를 확률변수 ${jh(X, '이라/라')} 할 때, ${X}의 확률밀도함수가 다음과 같다.` : `연속확률변수 ${X}의 확률밀도함수가 다음과 같다.`} 확률 ${jh(ask, '의')} 값은?`, ans, {
        figure: fig,
        explain: `${jh(ms('f(x)'), '의')} 그래프는 점 (0, 0), (${m}, ${pl(h)}), (${L}, 0)을 잇는 꺾은선이다. ${jh(ask, '은/는')} ${how}이다.`,
        value: jq(ans), auto: true
      });
    }),

    T('cont-back', '확률에서 거꾸로 구간의 끝 구하기', '①18', (d, n) => {
      if (n === 0) {
        const m = d.int(1, 3), j = d.int(0, m - 1), s = R(2 * j + 1, 2), b = qsub(R(2 * m), s), a = R(1, m * m);
        const tail = qmul(qmul(a, qmul(s, s)), R(1, 2)), r = qsub(R(1), tail);
        const aH = V('a'), bH = V('b');
        return ratQ(`연속확률변수 ${X}의 확률밀도함수가 다음과 같다. ${jh(nb(PR('X <= b') + ' = ' + fq(r)), '일')} 때, 상수 ${jh(bH, '의')} 값은? (단, ${aH}는 상수이고 ${ms(`${m} < b < ${2 * m}`)})`, b, {
          figure: lines([`${ms('f(x)')} = ${cases([`${aH}${Xs}${nbsp}${nbsp}(${ms(`0 <= x < ${m}`)})`, `${MINUS}${aH}${ms(`(x - ${2 * m})`)}${nbsp}${nbsp}(${ms(`${m} <= x <= ${2 * m}`)})`])}`]),
          explain: `그래프는 점 (0, 0), (${m}, ${m}${aH}), (${2 * m}, 0)을 잇는 꺾은선이고 넓이가 1이므로 ${frac(1, 2)} × ${2 * m} × ${m}${aH} = 1, ${aH} = ${fq(a)}이다. ${PR('X >= b')} = 1 ${MINUS} ${fq(r)} = ${fq(tail)}이고 이것은 밑변 ${2 * m} ${MINUS} ${bH}, 높이 ${aH}(${2 * m} ${MINUS} ${bH})인 삼각형의 넓이이므로 ${frac(1, 2)}${aH}(${2 * m} ${MINUS} ${bH})<sup>2</sup> = ${fq(tail)}, ${2 * m} ${MINUS} ${bH} = ${fq(s)}, ${bH} = ${fq(b)}이다.`,
          value: `${2 * m}-(${2 * j + 1}/2)`, derived: [2 * j + 1, 2]
        });
      }
      const p = d.int(1, 3), q = p + d.int(1, 3), a = R(2, p * (2 * q - p)), sA = qmul(qmul(a, R(p * p)), R(1, 2));
      const den = d.pick([2, 3, 4]), k = qadd(R(p), R(d.int(1, (q - p) * den - 1), den));
      if (k.q === 1) return null;
      const r = qadd(sA, qmul(qmul(a, R(p)), qsub(k, R(p))));
      if (qsub(R(1), r).p <= 0) return null;
      const aH = V('a');
      return ratQ(`연속확률변수 ${X}의 확률밀도함수가 다음과 같을 때, ${jh(nb(PR('0 <= X <= k') + ' ≥ ' + fq(r)), '을/를')} 만족시키는 양수 ${jh(V('k'), '의')} 최솟값은? (단, ${aH}는 상수이다.)`, k, {
        figure: lines([`${ms('f(x)')} = ${cases([`${aH}${Xs}${nbsp}${nbsp}(${ms(`0 <= x < ${p}`)})`, `${p === 1 ? '' : p}${aH}${nbsp}${nbsp}(${ms(`${p} <= x <= ${q}`)})`])}`]),
        explain: `넓이가 1이므로 ${frac(1, 2)} × ${p} × ${p}${aH} + ${q - p} × ${p}${aH} = 1, ${aH} = ${fq(a)}이다. ${PR(`0 <= X <= ${p}`)} = ${fq(sA)} &lt; ${fq(r)}이므로 ${V('k')} &gt; ${p}이고, ${fq(sA)} + (${V('k')} ${MINUS} ${p}) × ${fq(qmul(a, R(p)))} ≥ ${fq(r)}에서 ${V('k')} ≥ ${fq(k)}이다.`,
        value: jq(k), auto: true
      });
    }, { count: 2 }),

    T('cont-sym', '대칭인 확률밀도함수의 확률', '①19', (d) => {
      const c = d.int(4, 6), t = d.int(1, c - 1), r = R(1, d.pick([5, 6, 8, 10, 12])), kind = d.int(0, 2);
      const tt = 2 * c - t;
      let ask, ans, how;
      if (kind === 0) { ask = rng(c, tt); ans = qsub(R(1, 2), r); how = `${rng(c, 2 * c)} = ${frac(1, 2)}이고 ${rng(tt, 2 * c)} = ${rng(0, t)} = ${fq(r)}이므로 ${frac(1, 2)} ${MINUS} ${fq(r)}`; }
      else if (kind === 1) { ask = rng(t, tt); ans = qsub(R(1), qmul(R(2), r)); how = `양쪽 끝 ${rng(0, t)}, ${jh(rng(tt, 2 * c), '이/가')} 모두 ${fq(r)}이므로 1 ${MINUS} 2 × ${fq(r)}`; }
      else { ask = rng(t, c); ans = qsub(R(1, 2), r); how = `${rng(0, c)} = ${frac(1, 2)}이므로 ${frac(1, 2)} ${MINUS} ${fq(r)}`; }
      return ratQ(`${ms(`0 <= x <= ${2 * c}`)}에서 정의된 연속확률변수 ${X}의 확률밀도함수 ${jh(ms('f(x)'), '의')} 그래프는 직선 ${jh(ms('x = ' + c), '에')} 대하여 대칭이다. ${jh(nb(rng(0, t) + ' = ' + fq(r)), '일')} 때, 확률 ${jh(ask, '의')} 값은?`, ans, {
        explain: `그래프가 ${ms('x = ' + c)}에 대하여 대칭이므로 ${how} = ${fq(ans)}이다.`,
        value: kind === 1 ? `1-2*${jq(r)}` : `1/2-${jq(r)}`, derived: [2]
      });
    }),

    T('cont-twice', '확률밀도함수로 구한 확률을 두 번 쓰기(전구의 수명)', '①20', (d) => {
      const L = d.pick([3000, 4000, 5000]), m = d.pick(Array.from({ length: L / 1000 - 1 }, (_, i) => (i + 1) * 1000)), k = d.pick([2, 2, 3]);
      const pLow = R(m, L), ans = qsub(R(1), R(pLow.p ** k, pLow.q ** k));
      const fig = pdfPlot([[0, 0], [m, 2 / L], [L, 0]], { xt: [m, L], yt: [{ v: 2 / L, t: 'a' }], say: `그래프는 점 (0, 0), (${m}, a), (${L}, 0)을 차례로 잇는 꺾은선이다.` });
      return ratQ(`어느 공장에서 만드는 전구의 수명(시간)을 확률변수 ${jh(X, '이라/라')} 할 때, ${X}의 확률밀도함수 ${jh(ms('f(x)'), '의')} 그래프는 다음과 같다. 이 공장에서 만든 전구 중에서 임의로 ${k}개를 고를 때, 적어도 1개는 수명이 ${m}시간 이상일 확률은? (단, ${V('a')}는 상수이고, 전구의 수명은 서로 영향을 주지 않는다.)`, ans, {
        figure: fig,
        explain: `넓이가 1이므로 ${frac(1, 2)} × ${L} × ${V('a')} = 1, ${V('a')} = ${frac(1, L / 2)}이다. ${PR(`X < ${m}`)} = ${frac(1, 2)} × ${m} × ${V('a')} = ${fq(pLow)}이므로 ${k}개 모두 ${m}시간 미만일 확률은 (${fq(pLow)})<sup>${k}</sup>이고, 구하는 확률은 1 ${MINUS} (${fq(pLow)})<sup>${k}</sup> = ${fq(ans)}이다.`,
        value: `1-(${m}/${L})**${k}`, derived: [k]
      });
    })
  ]);

  // ════════════════════════════════════════════════════════════════
  // ── 이산확률변수의 기댓값과 표준편차 ──
  // 분포의 평균·분산(유리수)과 검사 식
  const meanOf = (xs, ps) => sumQ(xs.map((x, i) => qmul(R(x), ps[i])));
  const ex2Of = (xs, ps) => sumQ(xs.map((x, i) => qmul(R(x * x), ps[i])));
  const varOf = (xs, ps) => qsub(ex2Of(xs, ps), qmul(meanOf(xs, ps), meanOf(xs, ps)));
  const meanJ = (xs, ps) => xs.map((x, i) => `${jn(x)}*${jq(ps[i])}`).join('+');
  const ex2J = (xs, ps) => xs.map((x, i) => `${jn(x)}*${jn(x)}*${jq(ps[i])}`).join('+');
  const varJ = (xs, ps) => `${ex2J(xs, ps)}-(${meanJ(xs, ps)})*(${meanJ(xs, ps)})`;
  // 정수 셈만으로 적은 평균·분산의 식(칸마다 받는 정수 답의 근거 — 소수 셈의 오차가 없다): 확률을 공통분모 D 로 맞춘 무게 w 로 적는다.
  const weightsOf = (ps) => { const D = ps.reduce((l, p) => l / gcd(l, p.q) * p.q, 1); return { D, w: ps.map((p) => p.p * D / p.q) }; };
  const meanI = (xs, ps) => { const { D, w } = weightsOf(ps); return `(${xs.map((x, i) => `${jn(x)}*${w[i]}`).join('+')})/${D}`; };
  const varI = (xs, ps) => { const { D, w } = weightsOf(ps), s1 = xs.map((x, i) => `${jn(x)}*${w[i]}`).join('+'), s2 = xs.map((x, i) => `${jn(x)}*${jn(x)}*${w[i]}`).join('+'); return `(${D}*(${s2})-(${s1})*(${s1}))/(${D}*${D})`; };
  const sumTold = (xs, ps, sq) => xs.map((x, i) => `${sq ? par(x) + '<sup>2</sup>' : par(x)} × ${fq(ps[i])}`).join(' + ');
  // 확률이 D 를 나눈 몫들(합이 D)인 분포
  function randDist(d, k, Ds) {
    const D = d.pick(Ds), parts = [];
    let left = D;
    for (let i = 0; i < k - 1; i += 1) { const t = d.int(1, left - (k - 1 - i)); parts.push(t); left -= t; }
    parts.push(left);
    return d.shuffle(parts).map((t) => R(t, D));
  }
  B.kit.u1135.meanOf = meanOf; B.kit.u1135.ex2Of = ex2Of; B.kit.u1135.varOf = varOf; B.kit.u1135.meanJ = meanJ; B.kit.u1135.ex2J = ex2J; B.kit.u1135.varJ = varJ; B.kit.u1135.sumTold = sumTold; B.kit.u1135.meanI = meanI; B.kit.u1135.varI = varI; B.kit.u1135.randDist = randDist; B.kit.u1135.drawOf = drawOf; B.kit.u1135.DRAWS = DRAWS;

  B.addTypes(UNIT, 'mean', [
    T('mean-table', '분포표로 평균·분산 구하기', '①21', (d, n) => {
      if (n === 0) {
        const k = d.int(3, 4), ps = randDist(d, k, [6, 8, 10, 12]), x1 = d.int(0, 2), st = d.pick([1, 1, 2]), xs = ps.map((_, i) => x1 + i * st);
        const unknown = d.bool(), last = ps[k - 1], E = meanOf(xs, ps);
        if (E.q === 1) return null;
        const aH = V('a');
        return ratQ(`이산확률변수 ${X}의 확률분포가 다음 표와 같을 때, ${jh(X, '의')} 평균 ${jh(EX, '의')} 값은?${unknown ? ` (단, ${aH}는 상수이다.)` : ''}`, E, {
          figure: distFit(xs, ps.map((p, i) => (unknown && i === k - 1 ? aH : cell(p)))),
          explain: `${unknown ? `확률의 합이 1이므로 ${aH} = ${fq(last)}이고, ` : ''}${EX} = ${sumTold(xs, ps)} = ${fq(E)}이다.`,
          value: unknown ? xs.slice(0, -1).map((x, i) => `${jn(x)}*${jq(ps[i])}`).concat([`${xs[k - 1]}*(1-${ps.slice(0, -1).map(jq).join('-')})`]).join('+') : meanJ(xs, ps)
        });
      }
      if (d.bool()) {
        const xs = [1, 2, 3], ws = d.pick([[1, 2, 3], [3, 2, 1], [1, 1, 2], [2, 1, 1], [1, 3, 2]]), S = ws.reduce((s, v) => s + v, 0), ps = ws.map((w) => R(w, S)), Vv = varOf(xs, ps);
        if (Vv.q === 1) return null;
        const kH = V('k');
        return ratQ(`이산확률변수 ${X}의 확률분포가 다음 표와 같을 때, ${jh(X, '의')} 분산 ${jh(VX, '의')} 값은? (단, ${kH}는 상수이다.)`, Vv, {
          figure: dist(xs, ws.map((w) => (w === 1 ? '' : w) + kH)),
          explain: `확률의 합이 1이므로 ${S}${kH} = 1, ${kH} = ${frac(1, S)}이다. ${EX} = ${fq(meanOf(xs, ps))}, ${EX2} = ${fq(ex2Of(xs, ps))}이므로 ${VX} = ${EX2} ${MINUS} {${EX}}<sup>2</sup> = ${fq(Vv)}이다.`,
          value: xs.map((x, i) => `${x}*${x}*${ws[i]}/(${ws.join('+')})`).join('+') + `-(${xs.map((x, i) => `${x}*${ws[i]}/(${ws.join('+')})`).join('+')})*(${xs.map((x, i) => `${x}*${ws[i]}/(${ws.join('+')})`).join('+')})`, derived: [S]
        });
      }
      const k = d.int(3, 4), ps = randDist(d, k, [4, 6, 8, 10]), x1 = d.int(0, 2), xs = ps.map((_, i) => x1 + i), Vv = varOf(xs, ps);
      if (Vv.q === 1) return null;
      return ratQ(`이산확률변수 ${X}의 확률분포가 다음 표와 같을 때, ${jh(X, '의')} 분산 ${jh(VX, '의')} 값은?`, Vv, {
        figure: distFit(xs, ps.map(cell)),
        explain: `${EX} = ${sumTold(xs, ps)} = ${fq(meanOf(xs, ps))}, ${EX2} = ${sumTold(xs, ps, true)} = ${fq(ex2Of(xs, ps))}이므로 ${VX} = ${EX2} ${MINUS} {${EX}}<sup>2</sup> = ${fq(Vv)}이다.`,
        value: varJ(xs, ps)
      });
    }, { count: 2 }),

    T('mean-coupon', '도수로 준 표에서 받는 금액의 기댓값', '①21 변형(상품권)', (d) => {
      const amts = d.pick([[5000, 2000, 1000], [3000, 1000, 500], [10000, 5000, 1000], [2000, 1000, 500]]), T0 = d.pick([10, 20, 25]);
      const c1 = d.int(1, Math.floor(T0 / 4)), c2 = d.int(1, Math.floor(T0 / 3)), c3 = T0 - c1 - c2;
      if (c3 < 1) return null;
      const tot = amts[0] * c1 + amts[1] * c2 + amts[2] * c3;
      if (tot % T0 !== 0 || tot / T0 > 9999) return null;
      const E = tot / T0;
      const tb = `<table class="mb-table" aria-label="상품권 금액(원) ${amts.join(', ')} / 상품권 수(장) ${c1}, ${c2}, ${c3} / 합계 ${T0}장"><tbody><tr><th>금액(원)</th> ${amts.map((a) => `<td>${a}</td>`).join(' ')} <th>합계</th></tr> <tr><th>상품권 수(장)</th> ${[c1, c2, c3].map((c) => `<td>${c}</td>`).join(' ')} <td>${T0}</td></tr></tbody></table>`;
      return numQ(`어느 행사에서 다음 표와 같은 상품권 ${T0}장 중에서 한 장을 임의로 뽑아 받는다. 받는 상품권의 금액을 확률변수 ${jh(X, '이라/라')} 할 때, ${jh(EX, '의')} 값은?`, E, {
        figure: tb, unit: '원',
        explain: `${PX(amts[0])} = ${frac(c1, T0)}, ${PX(amts[1])} = ${frac(c2, T0)}, ${PX(amts[2])} = ${frac(c3, T0)}이므로 ${EX} = ${amts[0]} × ${frac(c1, T0)} + ${amts[1]} × ${frac(c2, T0)} + ${amts[2]} × ${frac(c3, T0)} = ${E}(원)이다.`,
        value: `(${amts[0]}*${c1}+${amts[1]}*${c2}+${amts[2]}*${c3})/${T0}`
      });
    }),

    T('mean-cards', '카드에 적힌 수의 분산', '①21 변형(카드)', (d) => {
      const vals = d.pick([[1, 2, 3], [1, 2, 4], [2, 3, 5], [1, 3, 4], [0, 1, 2]]), cs = [d.int(1, 3), d.int(1, 3), d.int(1, 3)], T0 = cs[0] + cs[1] + cs[2];
      if (T0 < 5) return null;
      const ps = cs.map((c) => R(c, T0)), Vv = varOf(vals, ps);
      if (Vv.q === 1) return null;
      const list = [].concat(...vals.map((v, i) => Array(cs[i]).fill(v)));
      return ratQ(`${list.length}개의 숫자 ${list.slice(0, -1).join(', ')}, ${josa(list[list.length - 1], '이/가')} 하나씩 적힌 카드 ${T0}장 중에서 임의로 1장을 뽑을 때, 뽑은 카드에 적힌 수를 확률변수 ${jh(X, '이라/라')} 하자. ${jh(X, '의')} 분산은?`, Vv, {
        explain: `${vals.map((v, i) => nb(PX(v) + ' = ' + fq(ps[i]))).join(', ')}이므로 ${EX} = ${fq(meanOf(vals, ps))}, ${EX2} = ${fq(ex2Of(vals, ps))}, ${VX} = ${fq(ex2Of(vals, ps))} ${MINUS} (${fq(meanOf(vals, ps))})<sup>2</sup> = ${fq(Vv)}이다.`,
        value: vals.map((v, i) => `${v}*${v}*${cs[i]}/${T0}`).join('+') + `-(${vals.map((v, i) => `${v}*${cs[i]}/${T0}`).join('+')})*(${vals.map((v, i) => `${v}*${cs[i]}/${T0}`).join('+')})`, auto: true
      });
    }),

    T('mean-graph', '막대그래프로 나타낸 분포의 분산', '①22', (d) => {
      const LIST = [[[1, 4], [1, 2], [1, 4]], [[1, 3], [1, 6], [1, 2]], [[1, 8], [3, 8], [3, 8], [1, 8]], [[1, 6], [1, 3], [1, 2]], [[2, 5], [1, 5], [2, 5]], [[1, 10], [3, 10], [2, 5], [1, 5]]];
      const ps = d.pick(LIST).map(([a, b]) => R(a, b)), start = d.pick([0, 1]), xs = ps.map((_, i) => start + i), Vv = varOf(xs, ps);
      return ratQ(`이산확률변수 ${X}의 확률분포를 나타낸 그래프가 다음과 같을 때, ${jh(VX, '의')} 값은?`, Vv, {
        figure: barPlot(xs, ps.map(fl), ps.map(pl)),
        explain: `${EX} = ${sumTold(xs, ps)} = ${fq(meanOf(xs, ps))}, ${EX2} = ${fq(ex2Of(xs, ps))}이므로 ${VX} = ${fq(ex2Of(xs, ps))} ${MINUS} (${fq(meanOf(xs, ps))})<sup>2</sup> = ${fq(Vv)}이다.`,
        value: varJ(xs, ps)
      });
    }),

    T('mean-spread', '평균이 같은 세 분포의 분산 크기 비교', '①23', (d) => {
      const SYM = [[0.3, 0.15, 0.1], [0.1, 0.2, 0.4], [0.2, 0.2, 0.2], [0.25, 0.15, 0.2], [0.05, 0.25, 0.4], [0.15, 0.25, 0.2], [0.35, 0.1, 0.1]];
      const pick3 = d.shuffle(SYM).slice(0, 3), xs = [2, 4, 6, 8, 10];
      const full = pick3.map(([a, b, c]) => [a, b, c, b, a]);
      const vars = full.map((ps) => ps.reduce((s, p, i) => s + p * (xs[i] - 6) * (xs[i] - 6), 0));
      if (new Set(vars.map((v) => v.toFixed(6))).size !== 3) return null;
      const names = ['X', 'Y', 'Z'], order = [0, 1, 2].sort((i, j) => vars[j] - vars[i]);
      const perms = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]], key = (o) => o.join();
      const opts = [order].concat(d.shuffle(perms.filter((o) => key(o) !== key(order))).slice(0, 4));
      const sorted = d.shuffle(opts), at = sorted.findIndex((o) => key(o) === key(order));
      const optH = (o) => o.map((i) => vr(names[i])).join(' &gt; ');
      const figs = full.map((ps, i) => barPlot(xs, ps, ps.map((p) => String(p)), { v: names[i], w: 250, h: 92 }));
      const exprs = full.map((ps) => ps.map((p, i) => `(${xs[i]}-6)*(${xs[i]}-6)*${p}`).join('+'));
      return C(`다음은 세 이산확률변수 ${ms('X')}, ${ms('Y')}, ${ms('Z')}의 확률분포를 각각 나타낸 그래프이다. ${vr('X')}, ${vr('Y')}, ${jh(vr('Z'), '을/를')} 큰 것부터 차례로 나열한 것은?`, sorted.map(optH), at, {
        figure: '<div style="display:grid;gap:4px">' + figs.join('') + '</div>',
        explain: `세 그래프가 모두 6에 대하여 대칭이므로 평균은 모두 6이다. 평균에서 멀리 떨어진 값의 확률이 클수록 분산이 크므로(값을 셈하면 ${names.map((nm, i) => nb(vr(nm) + ' = ' + Number(vars[i].toFixed(2)))).join(', ')}) ${optH(order)}이다.`,
        facts: { choose: { exprs, rule: 'descending', orders: sorted } }
      });
    }),

    T('mean-sigma', 'E(X)와 E(X²)로 분산·표준편차 구하기', '①24', (d, n) => {
      if (n === 0) {
        const m = d.int(2, 9), v = d.int(2, 80), e2 = m * m + v;
        return numQ(`확률변수 ${X}에 대하여 ${nb(EX + ' = ' + m)}, ${jh(nb(EX2 + ' = ' + e2), '일')} 때, ${jh(VX, '의')} 값은?`, v, {
          explain: `${VX} = ${EX2} ${MINUS} {${EX}}<sup>2</sup> = ${e2} ${MINUS} ${m}<sup>2</sup> = ${v}이다.`,
          value: `${e2}-${m}*${m}`
        });
      }
      const [a, b] = d.pick([[2, 2], [2, 3], [3, 2], [2, 5], [3, 3], [2, 6], [2, 7], [4, 2], [3, 5]]), Vv = a * a * b, m = d.int(2, 9), e2 = m * m + Vv;
      return sdAns(`확률변수 ${X}에 대하여 ${nb(EX + ' = ' + m)}, ${jh(nb(EX2 + ' = ' + e2), '일')} 때, ${X}의 표준편차 ${jh(SX, '의')} 값은?`, a, b, {
        explain: `${VX} = ${e2} ${MINUS} ${m}<sup>2</sup> = ${Vv}이므로 ${SX} = ${rt(Vv)} = ${a}${rt(b)}이다.`,
        calc: [[`${a}`, 0], [`${b}`, 1]], derived: [a, b]
      });
    }, { count: 2 }),

    T('mean-pmf', '확률질량함수의 식으로 평균·분산 구하기', '①25', (d, n) => {
      const form = d.int(0, 2);
      let xs, ws, pmfH;
      if (form === 0) { const m = d.pick([2, 3, 5, 6]); xs = Array.from({ length: m }, (_, i) => i + 1); ws = xs.slice(); pmfH = V('k') + Xs; }
      else if (form === 1) { const c = d.int(1, 2), m = d.int(3, 5); xs = Array.from({ length: m }, (_, i) => i + 1); ws = xs.map((x) => x + c); pmfH = frac(ms('x + ' + c), ws.reduce((s, v) => s + v, 0)); }
      else { const c = d.int(1, 3), m = d.int(3, 4); xs = Array.from({ length: m }, (_, i) => i); ws = xs.map((x) => x + c); pmfH = V('k') + ms('(x + ' + c + ')'); }
      const S = ws.reduce((s, v) => s + v, 0), ps = ws.map((w) => R(w, S)), E = meanOf(xs, ps), Vv = varOf(xs, ps);
      const ans = n === 0 ? E : Vv;
      if (ans.q === 1) return null;
      const kNote = form === 1 ? '' : ` (단, ${V('k')}는 상수이다.)`;
      return ratQ(`이산확률변수 ${X}의 확률질량함수가 ${nb(pr(ms('X = x')) + ' = ' + pmfH)} ${nb('(' + Xs + ' = ' + xs.join(', ') + ')')}일 때, ${n === 0 ? jh(EX, '의') : jh(VX, '의')} 값은?${kNote}`, ans, {
        explain: `${form === 1 ? '' : `확률의 합이 1이므로 ${V('k')} = ${frac(1, S)}이다. `}${xs.map((x, i) => nb(PX(x) + ' = ' + fq(ps[i]))).join(', ')}이므로 ${EX} = ${fq(E)}${n === 0 ? '' : `, ${EX2} = ${fq(ex2Of(xs, ps))}, ${VX} = ${fq(Vv)}`}이다.`,
        value: n === 0 ? xs.map((x, i) => `${x}*${ws[i]}/${S}`).join('+') : xs.map((x, i) => `${x}*${x}*${ws[i]}/${S}`).join('+') + `-(${xs.map((x, i) => `${x}*${ws[i]}/${S}`).join('+')})*(${xs.map((x, i) => `${x}*${ws[i]}/${S}`).join('+')})`, auto: true
      });
    }, { count: 2 }),

    T('mean-solve', '분포표의 상수를 평균 조건으로 구해 분산 구하기', '①26', (d, n) => {
      const aH = V('a'), bH = V('b');
      if (n === 0) {
        const D = d.pick([6, 8, 12]), p3 = R(d.int(1, 2), D), p4 = R(d.int(1, 2), D), restQ = qsub(R(1), qadd(p3, p4));
        const a = R(d.int(1, restQ.p * (D / restQ.q) - 1), D), b = qsub(restQ, a);
        if (a.p <= 0 || b.p <= 0) return null;
        const xs = [0, 1, 2, 3], ps = [a, b, p3, p4], E = meanOf(xs, ps), Vv = varOf(xs, ps);
        if (Vv.q === 1) return null;
        return ratQ(`이산확률변수 ${X}의 확률분포가 다음 표와 같다. ${jh(nb(EX + ' = ' + fq(E)), '일')} 때, ${jh(VX, '의')} 값은? (단, ${aH}, ${bH}는 상수이다.)`, Vv, {
          figure: distFit(xs, [aH, bH, cell(p3), cell(p4)]),
          explain: `${aH} + ${bH} + ${fq(p3)} + ${fq(p4)} = 1이고 ${EX} = ${bH} + 2 × ${fq(p3)} + 3 × ${fq(p4)} = ${fq(E)}이므로 ${bH} = ${fq(b)}, ${aH} = ${fq(a)}이다. ${EX2} = ${fq(ex2Of(xs, ps))}이므로 ${VX} = ${fq(ex2Of(xs, ps))} ${MINUS} (${fq(E)})<sup>2</sup> = ${fq(Vv)}이다.`,
          value: `1*1*(${jq(E)}-2*${jq(p3)}-3*${jq(p4)})+2*2*${jq(p3)}+3*3*${jq(p4)}-${jq(E)}*${jq(E)}`
        });
      }
      const x1 = d.int(1, 3), x2 = x1 + d.int(1, 3), p2 = R(1, 4), p3 = R(1, 4), b = R(1, 2), a = d.int(x2 + 1, x2 + 8);
      const xs = [x1, x2, a], ps = [b, p2, p3], E = meanOf(xs, ps), Vv = varOf(xs, ps);
      if (E.q > 4) return null;
      return ratQ(`이산확률변수 ${X}의 확률분포가 다음 표와 같다. ${jh(nb(EX + ' = ' + fq(E)), '일')} 때, ${jh(VX, '의')} 값은? (단, ${aH}, ${bH}는 상수이다.)`, Vv, {
        figure: dist([x1, x2, aH], [bH, cell(p2), cell(p3)]),
        explain: `${bH} + ${fq(p2)} + ${fq(p3)} = 1에서 ${bH} = ${fq(b)}이고, ${EX} = ${x1} × ${fq(b)} + ${x2} × ${fq(p2)} + ${aH} × ${fq(p3)} = ${fq(E)}에서 ${aH} = ${a}이다. 따라서 ${VX} = ${sumTold(xs, ps, true)} ${MINUS} (${fq(E)})<sup>2</sup> = ${fq(Vv)}이다.`,
        value: varJ(xs, ps), auto: true
      });
    }, { count: 2 }),

    T('mean-draw', '뽑기 상황의 평균·분산', '①27', (d, n) => {
      const D = drawOf(d, { rmax: 5 });
      if (D.xs.length < 3) return null;
      const E = meanOf(D.xs, D.ps), Vv = varOf(D.xs, D.ps), ans = n === 0 ? E : Vv;
      if (ans.q === 1) return null;
      return ratQ(`${D.text} ${n === 0 ? `${jh(X, '의')} 평균은?` : `${jh(X, '의')} 분산은?`}`, ans, {
        explain: `${jh(X, '이/가')} 가지는 값은 ${D.xs.join(', ')}이고 ${D.xs.map((k, i) => nb(PX(k) + ' = ' + fq(D.ps[i]))).join(', ')}이다. 따라서 ${EX} = ${fq(E)}${n === 0 ? '' : `, ${EX2} = ${fq(ex2Of(D.xs, D.ps))}, ${VX} = ${fq(Vv)}`}이다.`,
        value: n === 0 ? meanJ(D.xs, D.ps) : varJ(D.xs, D.ps), auto: true
      });
    }, { count: 2 }),

    T('mean-findn', '공의 개수를 평균 조건으로 구해 분산', '①28', (d) => {
      const c1 = d.int(1, 3), c2 = d.int(1, 4), nn = d.int(2, 9), T0 = c1 + c2 + nn, ps = [R(c1, T0), R(c2, T0), R(nn, T0)], xs = [1, 2, 3];
      const E = meanOf(xs, ps), Vv = varOf(xs, ps);
      if (E.q === 1 || Vv.q === 1) return null;
      return ratQ(`1이 적힌 공 ${c1}개, 2가 적힌 공 ${c2}개, 3이 적힌 공 ${V('n')}개가 들어 있는 주머니에서 임의로 한 개의 공을 꺼낼 때, 꺼낸 공에 적힌 수를 확률변수 ${jh(X, '이라/라')} 하자. ${jh(nb(EX + ' = ' + fq(E)), '일')} 때, ${jh(VX, '의')} 값은? (단, ${V('n')}은 자연수이다.)`, Vv, {
        explain: `${EX} = ${frac(`${c1 + 2 * c2} + 3${V('n')}`, `${c1 + c2} + ${V('n')}`)} = ${fq(E)}에서 ${V('n')} = ${nn}이다. 따라서 ${EX2} = ${fq(ex2Of(xs, ps))}이고 ${VX} = ${fq(ex2Of(xs, ps))} ${MINUS} (${fq(E)})<sup>2</sup> = ${fq(Vv)}이다.`,
        value: `1*1*${c1}/${T0}+2*2*${c2}/${T0}+3*3*${nn}/${T0}-${jq(E)}*${jq(E)}`, auto: true
      });
    }),

    T('mean-kth', '카드에서 k번째로 작은 수의 평균', '①9 변형', (d) => {
      const Nn = d.int(6, 8), r = d.int(3, Math.min(5, Nn - 2)), j = d.pick([1, 2]), all = comb(Nn, r);
      const xs = [], ps = [];
      for (let x = j; x <= Nn - r + j; x += 1) { xs.push(x); ps.push(R(comb(x - 1, j - 1) * comb(Nn - x, r - j), all)); }
      const E = meanOf(xs, ps);
      if (E.q === 1) return null;
      return ratQ(`1부터 ${Nn}까지의 자연수가 하나씩 적힌 카드 ${Nn}장 중에서 임의로 ${r}장을 동시에 뽑을 때, 뽑은 카드에 적힌 수 중에서 ${j === 1 ? '가장 작은 수' : '두 번째로 작은 수'}를 확률변수 ${jh(X, '이라/라')} 하자. ${jh(EX, '의')} 값은?`, E, {
        explain: `${X} = ${V('x')}이려면 ${j === 1 ? `${V('x')}를 뽑고 나머지 ${r - 1}장을 ${V('x')}보다 큰 수에서 뽑아야` : `${V('x')}보다 작은 수에서 1장, ${V('x')}보다 큰 수에서 ${r - 2}장을 뽑아야`} 한다. ${xs.map((x, i) => nb(PX(x) + ' = ' + fq(ps[i]))).join(', ')}이므로 ${EX} = ${fq(E)}이다.`,
        value: meanJ(xs, ps), auto: true
      });
    }),

    T('mean-twostep', '두 단계 시행(카드 → 동전)으로 정한 확률변수의 분산', '①30', (d) => {
      const first = d.pick([
        { h: (K) => `1부터 ${K}까지의 자연수가 하나씩 적힌 카드 ${K}장 중에서 임의로 1장을 꺼내어 짝수가 적힌 카드가 나오면`, o: '홀수가 적힌 카드가 나오면', p: (K) => R(Math.floor(K / 2), K) },
        { h: () => '한 개의 주사위를 던져서 4 이하의 눈이 나오면', o: '5 이상의 눈이 나오면', p: () => R(2, 3) }
      ]);
      const K = d.int(4, 7), pA = first.p(K), [mA, mB] = d.pick([[2, 3], [3, 2], [1, 2], [2, 1], [1, 3]]);
      const top = Math.max(mA, mB), xs = Array.from({ length: top + 1 }, (_, i) => i);
      const ps = xs.map((j) => qadd(qmul(pA, R(comb(mA, j), 2 ** mA)), qmul(qsub(R(1), pA), R(comb(mB, j), 2 ** mB))));
      const Vv = varOf(xs, ps);
      if (Vv.q === 1) return null;
      return ratQ(`${first.h(K)} 동전 ${mA}개를 동시에 던지고, ${first.o} 동전 ${mB}개를 동시에 던진다. 이때 앞면이 나오는 동전의 개수를 확률변수 ${jh(X, '이라/라')} 할 때, ${jh(VX, '의')} 값은?`.replace('동전 1개를 동시에', '동전 1개를'), Vv, {
        explain: `${jh(X, '의')} 확률분포는 ${xs.map((x, i) => nb(PX(x) + ' = ' + fq(ps[i]))).join(', ')}이다. ${EX} = ${fq(meanOf(xs, ps))}, ${EX2} = ${fq(ex2Of(xs, ps))}이므로 ${VX} = ${fq(Vv)}이다.`,
        value: varJ(xs, ps), auto: true
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
