// 고등학교 미적분Ⅱ Ⅰ. 수열의 극한 — 2. 급수(11-5-2) — 단원 틀·단원 안의 도구와 앞쪽 묶음
// (급수의 뜻과 부분합, 부분분수로 지우는 급수, 일반항을 먼저 구해 지우는 급수, 급수와 수열의 극한의 관계, 급수의 성질).
// 뒤쪽 묶음(등비급수의 수렴·발산과 합, 수렴할 조건, 합에서 거꾸로, 순환소수·실생활, 되풀이되는 도형과 점)은 11-5-2b.js,
// 실력 문항은 11-5-2c.js 에 있다.
// 수집해 둔 천재 T셀파 미적분Ⅱ(홍진곤, 2022 개정)의 교과서·평가 자료에서 뽑은 문제 꼴 목록(기본꼴_1: 28꼴, 기본꼴_2: 32꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음 / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/11-5-2/싣기_대조표.md 에 있다.
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번.
// 영역은 해석(수열의 극한). 성취기준은 12미적Ⅱ-01-04(급수의 수렴·발산의 뜻과 판정), 12미적Ⅱ-01-05(등비급수의 합과 활용).
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(Σ 식·나열한 급수·조건·그림), 묻는 것(합·극한값·수렴하는 것 고르기·범위·상수), 계산의 얼개(소거의 간격,
//    일반항을 먼저 구하는 길, 등비급수로 가르기)가 다르면 따로 싣는다. count 를 둔 유형은 차례마다 주는 것이나 묻는 것이 다르다.
//  - 내신 대비다. 교육과정의 「일반항이 등차수열과 등비수열의 곱으로 표현되는 경우와 같이 지나치게 복잡한 문제는 다루지 않는다」는 정도를 말하는 줄이고,
//    그런 꼴(등차×등비)은 수집본에 없다. 이것을 까닭으로 뺀 꼴은 없다.
//  - 학년·과목이 다른 단원(대수 11-1-6 수열의 합의 유한 소거, 공통수학1 나머지정리·근과 계수)과 같은 일은 이 단원에도 싣는다(과제 글).
//    같은 과목의 다른 단원 몫은 싣지 않는다: 수열의 극한(11-5-1 — 대04·교대13·중간21), 정적분의 활용(11-5-7 — 적분 중단원 점검 13).
//  - 「발산함을 증명하시오」(①20)는 lim aₙ 의 값만 묻지 않고(11-5-1 의 셈과 같아진다) 판정까지 담은 문장 고르기로 낸다.
//    근호의 유리화 꼴(①5 — 원문은 늘 발산)은 수렴하는 근호의 역수 꼴(①6)과 섞어 「수렴하는 것 고르기」로 낸다.
//  - 답: 급수의 합·극한값은 정수·분수 칸(음수가 될 수 있는 값이라 모두 부호 단추). 넓이·길이·개수·백분율은 단추 없이. 근호가 든 값은
//    a + b√c 꼴이면 칸으로, 분수와 근호가 섞이면 고르기로 낸다. x의 범위는 양 끝이 정수이면 「[±][ ] &lt; x &lt; [±][ ]」 칸으로, 분수이거나
//    「x = 0 또는」·등호가 섞이면 고르기로 낸다(칸의 모양이 답을 흘리지 않게).
//  - 원문의 「p + q」「α + β」「k²」「1/a²」「m² + n²」처럼 따로 구한 값을 묶은 꼴은 값을 바로 묻는다(대조표에 적었다).
//  - 참·거짓·수렴은 될 수 있는 대로 코드가 셈한다: 부분합의 식은 n = 1~6 에서 실제 부분합과 맞춰 보고, 등비급수가 늘 수렴하는지는 r 을 (−1, 1)에서
//    고르게 짚어 가리고, 근호 꼴의 합·보기 값은 수로 셈해 견준다. 꼴로 정해 둔 수렴·발산(def-root-pick, rel-mix, rel-flow)은 문제 글만 읽고 수로 더해 보는
//    따로 지은 풀이(작업 폴더)로 다시 맞춰 보았다. 급수의 성질에 관한 문장(①24)만 이론으로 정한 참·거짓이고(손으로 검토), 거짓인 문장에는 풀이에 반례를 단다.
//  - 검사 근거: 칸마다 글에 보이는 수로 다시 셈하는 식(facts.value·calc)을 단다. 글에 없는 수는 seal 이 facts.unseen 에 밝히고,
//    밝히기로 한 수(derived) 밖의 수가 나오면 오류를 낸다.
//  - 기1-4 풀이의 「lim(−2)ⁿ = ∞」는 「진동하며 발산」으로 바로잡아 풀이에 적었다(①26).
//
// 뺀 것과 까닭(11-5-2b.js, 11-5-2c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 같은 과목의 다른 단원 몫: 대04·교대13·중간21(11-5-1), 적분 중단원 점검 13(11-5-7) — 꼴 목록에서도 세지 않았다.
//  - 바꿈: ②5 의 「방법2 새 도형 만들기」(작도), ②29 ③ 「설명해 보자」(서술형) — 값을 묻는 꼴로만 실었다.
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, N, M, C, inline } = B.kit;
  // 분수: 분자·분모 칸을 분수 너비로 늘이고 글은 가운데 맞춤(11-1-6 과 같은 까닭 — 분모가 넓으면 공용 frac 의 가로줄이 분모 일부에만 걸린다).
  const frac = (n, d) => '<span class="mb-frac" style="align-items:stretch;text-align:center"><span>' + n + '</span><span class="mb-frac-bar">/</span><span>' + d + '</span></span>';
  const { MINUS, gcd, Q, qadd, qsub, qmul, qdiv, isInt, tx, V, sup, nb, tag, rt, poly, asQ } = B.kit.mid;
  const { ms, sum, lim, jh, hx, qAns, plot } = B.kit.hs;

  const UNIT = '11-5-2', STD4 = '12미적Ⅱ-01-04', STD5 = '12미적Ⅱ-01-05';
  const HAN = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ'];

  // ── 검사 근거 마무리(11-1-6 과 같은 방법) ──
  const stripH = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  function visibleNumbers(item) {
    const seen = stripH([item.text, item.figure || ''].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, ' $1 ').replace(/<table[^>]*aria-label="([^"]*)"[^>]*>/g, ' $1 | '));
    return new Set((seen.match(/\d+/g) || []).concat(seen.match(/\d+\.\d+/g) || [], seen.replace(/(\d) (?=\d)/g, '$1').match(/\d+/g) || []));
  }
  // 다시 셈하는 식의 수 가운데 글에 보이지 않는 수를 facts.unseen 에 밝힌다. 밝히기로 한 수(facts.derived)가 아닌 수가 나오면 오류를 낸다(식을 잘못 적은 것).
  function seal(item) {
    const f = item.facts || {};
    if (f.calc) f.calc = f.calc.map(([t, i]) => [/\+0$/.test(t) ? t : '(' + t + ')+0', i]);
    if (f.value !== undefined && !/\+0$/.test(f.value)) f.value = '(' + f.value + ')+0';
    const derived = new Set((f.derived || []).map(Number).concat([0, 1, 2])), shown = visibleNumbers(item), out = new Set(f.unseen || []);
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
  // 만들기가 null 을 돌려주면(조건에 맞지 않는 수) 다시 만든다.
  const retry = (make) => (d, n) => { for (let i = 0; i < 4000; i += 1) { const item = make(d, n); if (item) return seal(item); } throw new Error('조건에 맞는 문항을 만들지 못했다'); };
  const srcOf = (ref) => '수집본 기본 자료(' + ref + ')';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: srcOf(ref), make: retry(make) }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 기본 자료의 어려운 문항(' + ref + ')', make: retry(make) }, more || {});

  // ── 수와 글 ──
  const jn = (n) => (n < 0 ? '(' + n + ')' : String(n));                       // 검사 식에 적는 정수
  const jq = (q) => '(' + q.p + '/' + q.q + ')';                                 // 검사 식에 적는 유리수
  const tq = (x) => tx(asQ(x));                                                  // 정수·유리수의 글(음수는 −)
  const sT = (n) => (n < 0 ? MINUS + Math.abs(n) : String(n));
  const par = (h) => '(' + h + ')';
  const VN = V('n'), VK = V('k'), VX = V('x'), VR = V('r');
  const AN = ms('a_n'), BN = ms('b_n'), SN = ms('S_n');
  const A_ = (i) => ms('a_' + (String(i).length > 1 ? '{' + i + '}' : i)), B_ = (i) => ms('b_' + (String(i).length > 1 ? '{' + i + '}' : i));
  const SEQA = nb('{' + AN + '}'), SEQB = nb('{' + BN + '}');
  // n 의 일차식·다항식: pn(3, -1) → 3n − 1
  const pn = (a, b, v) => poly([[a, v || VN], [b, '']]);
  // 급수 Σ_{n=1}^{∞}: SI(몸, 아래끝) — 아래끝을 주지 않으면 n=1
  const SI = (body, lo) => sum('n=' + (lo == null ? 1 : lo), '∞', body);
  // 유한 합 Σ_{k=1}^{n}
  const SK = (hi, body) => sum('k=1', hi, body);
  const LIM = (body) => lim('n→∞', body);
  // 수 글을 + 로 이은 합(음수는 − 로)
  const joinH = (hs) => hs.map(([neg, h], i) => (i === 0 ? (neg ? MINUS : '') + h : (neg ? ' ' + MINUS + ' ' : ' + ') + h)).join('');
  const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
  // 1 + 1/2 + ⋯ + 1/g
  const harm = (g) => range(1, g).reduce((s, j) => qadd(s, Q(1, j)), Q(0));
  const harmE = (g, s) => range(1, g).map((j) => `1/(${(s || 0) + j})`).join('+');
  const harmH = (g, s) => range(1, g).map((j) => ((s || 0) + j === 1 ? '1' : frac(1, (s || 0) + j))).join(' + ');
  const close = (x, y) => Math.abs(x - y) < 1e-9;
  const fl = (q) => q.p / q.q;

  // ── 고르기 ──
  // 옳은 것 하나와 나머지를 섞는다. 보기는 [글, 옳은가]이다. 보기가 겹치거나 옳은 보기가 하나가 아니면 null(다시 만든다).
  function choose(d, text, rows, o) {
    const list = d.shuffle(rows), opt = o || {};
    if (new Set(list.map((r) => stripH(r[0]))).size !== list.length || list.filter((r) => r[1]).length !== 1) return null;
    return C(text, list.map((r) => r[0]), list.findIndex((r) => r[1]), Object.assign({}, opt, { facts: Object.assign({ truth: list.map((r) => r[1]), want: true }, opt.facts || {}) }));
  }
  // 보기의 차례를 섞지 않는 고르기(보기가 ㄱ~ㅁ 같은 이름일 때)
  function chooseFixed(text, rows, o) {
    if (rows.filter((r) => r[1]).length !== 1) return null;
    const opt = o || {};
    return C(text, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), Object.assign({}, opt, { facts: Object.assign({ truth: rows.map((r) => r[1]), want: true }, opt.facts || {}) }));
  }
  // 「옳은 것만을 있는 대로 고른 것」: 보기 ㄱ, ㄴ, ㄷ …의 참·거짓(flags)으로 고르기 보기를 만든다.
  function pickSets(d, text, rows, o) {
    const flags = rows.map((r) => r[1]), labels = HAN.slice(0, rows.length), right = labels.filter((_, i) => flags[i]);
    if (!right.length || right.length === rows.length) return null;
    if (new Set(rows.map((r) => stripH(r[0]))).size !== rows.length) return null;
    const cand = [];
    for (let i = 0; i < rows.length; i += 1) { const s = labels.filter((_, j) => (j === i ? !flags[j] : flags[j])); if (s.length) cand.push(s); }
    for (const s of [labels.slice(), [labels[0]], [labels[1]], [labels[rows.length - 1]], labels.slice(0, 2), labels.slice(1, 3)]) if (!cand.some((c) => c.join() === s.join()) && s.join() !== right.join()) cand.push(s);
    const opts = d.shuffle(d.shuffle(cand).slice(0, 4).concat([right]));
    const opt = o || {};
    return C(text, opts.map((s) => s.join(', ')), opts.indexOf(right), Object.assign({}, opt, {
      figure: opt.figure || '<div class="mb-lines">' + rows.map((r, i) => '<div style="padding:0.3em 0">' + tag(labels[i] + '.') + r[0] + '</div>').join('') + '</div>',
      facts: Object.assign({ sets: { labels, flags, options: opts.map((s) => s.slice()) } }, opt.facts || {})
    }));
  }
  // 값 하나(정수·분수): 음수가 될 수 있는 값이라 늘 부호 단추를 단다. pos: 넓이·길이처럼 늘 양수인 값(단추 없이).
  const val = (text, v, o) => qAns(text, v, Object.assign({ signed: true }, o || {}));
  const pos = (text, v, o) => qAns(text, v, Object.assign({}, o || {}, { signed: false }));
  // 조건 식들을 그림 칸에 한 줄씩(쌓은 기호가 위아래로 삐져나와 줄 사이를 띄운다)
  const given = (list, tags) => '<div class="mb-lines">' + list.map((h, i) => '<div style="padding:0.3em 0">' + (tags ? tag(tags[i]) : '') + hx(h) + '</div>').join('') + '</div>';

  // 근호의 역수 1/√k 를 유리화한 항: { q: 계수(유리수), w: 근호 안(1이면 유리수) } — 1/√k = √w/(m·w), k = m²w
  function invRoot(k) { let m = Math.floor(Math.sqrt(k)); while (k % (m * m) !== 0) m -= 1; const w = k / (m * m); return { q: Q(1, m * w), w }; }
  // 곱하는 계수의 글: 1이면 적지 않고 −1이면 −만
  const cf = (x) => { const q = asQ(x); return q.p === q.q ? '' : q.p === -q.q ? MINUS : tq(q); };
  // 항들(부호 있는 계수 × √w)의 합을 글로: [{ q, w }] — 같은 w 끼리 모은다.
  function surd(terms) {
    const by = new Map();
    for (const t of terms) by.set(t.w, by.has(t.w) ? qadd(by.get(t.w), t.q) : t.q);
    const parts = [...by.entries()].sort((a, b) => a[0] - b[0]).filter(([, q]) => q.p !== 0).map(([w, q]) => {
      const a = Math.abs(q.p);
      const h = w === 1 ? (q.q === 1 ? String(a) : frac(a, q.q)) : q.q === 1 ? (a === 1 ? '' : a) + rt(w) : frac((a === 1 ? '' : a) + rt(w), q.q);
      return [q.p < 0, h];
    });
    return parts.length ? nb(joinH(parts)) : '0';
  }
  const surdVal = (terms) => terms.reduce((s, t) => s + fl(t.q) * Math.sqrt(t.w), 0);
  // 그림(svg) 속 아래 첨자 글: svs('C', 1) → C₁, svs('a', 2) → a₂(소문자는 기울인 글자)
  const svs = (base, k) => (/^[a-z]$/.test(base) ? B.kit.mgeo.sv(base) : base) + (k == null ? '' : `<tspan style="font-size:0.72em" dy="3">${k}</tspan>`);

  B.kit.u52x = {
    UNIT, STD4, STD5, HAN, stripH, seal, retry, T, H, jn, jq, tq, sT, par, VN, VK, VX, VR, AN, BN, SN, A_, B_, SEQA, SEQB, pn, SI, SK, LIM, joinH, range,
    harm, harmE, harmH, close, fl, choose, chooseFixed, pickSets, val, pos, given, frac, invRoot, cf, surd, surdVal, svs
  };

  // ── 단원 틀 ──
  B.addUnit({
    id: '11-5-2', grade: 11, semester: 5, no: 2, title: '급수', version: 1,
    groups: [
      { id: 'def', title: '급수의 뜻과 부분합', standard: STD4, types: [] },
      { id: 'tele', title: '부분분수로 지우는 급수', standard: STD4, types: [] },
      { id: 'gen', title: '일반항을 먼저 구해 지우는 급수', standard: STD4, types: [] },
      { id: 'rel', title: '급수와 수열의 극한의 관계', standard: STD4, types: [] },
      { id: 'prop', title: '급수의 성질', standard: STD4, types: [] },
      { id: 'geo', title: '등비급수의 수렴·발산과 합', standard: STD5, types: [] },
      { id: 'cond', title: '등비급수가 수렴할 조건', standard: STD5, types: [] },
      { id: 'back', title: '등비급수의 합에서 거꾸로 구하기', standard: STD5, types: [] },
      { id: 'use', title: '등비급수의 활용 — 순환소수·실생활', standard: STD5, types: [] },
      { id: 'fig', title: '등비급수의 활용 — 되풀이되는 도형과 점', standard: STD5, types: [] }
    ]
  });

  // 한 변의 길이가 s, s/2, s/3, …인 정사각형을 왼쪽 아래 꼭짓점이 겹치게 포갠 그림(교과서 32쪽 생각 열기)
  function nestedSquares() {
    const W = 200, x0 = 8, y0 = 208, cols = ['#bfdbfe', '#fde68a', '#bbf7d0', '#fecaca', '#ddd6fe', '#e5e7eb'];
    let out = '';
    for (let k = 1; k <= 7; k += 1) { const s = W / k; out += `<rect x="${x0}" y="${(y0 - s).toFixed(1)}" width="${s.toFixed(1)}" height="${s.toFixed(1)}" style="fill:${k === 7 ? '#fff' : cols[k - 1]};stroke:#1f2933;stroke-width:1.2"/>`; }
    const lab = (k, x, y) => `<text x="${x}" y="${y}" style="font-size:15px;font-style:italic;font-family:'MB Math','Times New Roman',serif" text-anchor="middle" dominant-baseline="central">a<tspan style="font-size:11px" dy="4">${k}</tspan></text>`;
    out += lab(1, x0 + 150, y0 - 150) + lab(2, x0 + 83, y0 - 83);
    out += `<text x="${x0 + 32}" y="${y0 - 32}" style="font-size:13px" text-anchor="middle" dominant-baseline="central">⋯</text>`;
    return `<svg class="mb-geo" viewBox="0 0 ${W + 16} ${W + 16}" width="${W + 16}" role="img" aria-label="한 변의 길이가 차례로 작아지는 정사각형들을 왼쪽 아래 꼭짓점이 겹치도록 포갠 그림. 가장 큰 정사각형에서 그다음 정사각형을 뺀 ㄱ자 모양이 a1, 그다음 ㄱ자 모양이 a2이다.">${out}</svg>`;
  }

  // ── 급수의 뜻과 부분합 ──
  B.addTypes(UNIT, 'def', [
    T('def-list', '차의 꼴로 나열한 급수의 합 — 부분합의 극한', '①1', (d, n) => {
      if (n === 0) {
        const c = d.pick([1, 2, 3, 4, 5]), p = d.int(1, 6), q = p + 1;
        if (gcd(c, q) !== 1 || c === q) return null;
        const b = (k) => frac(c, k + p);
        const fig = [1, 2, 3].map((k) => nb(par(b(k) + ' ' + MINUS + ' ' + b(k + 1)))).join(' + ') + ' + ⋯ + ' + nb(par(frac(c, pn(1, p)) + ' ' + MINUS + ' ' + frac(c, pn(1, p + 1)))) + ' + ⋯';   // 괄호 하나는 한 덩이(괄호 안에서 줄이 갈리지 않게)
        const v = Q(c, q);
        return val('다음 급수의 합은?', v, {
          figure: hx(fig),
          explain: `제${VN}항까지의 부분합은 가운데 항이 지워져 ${nb(SN + ' = ' + frac(c, q) + ' ' + MINUS + ' ' + frac(c, pn(1, q)))}이다. ${nb(LIM(SN) + ' = ' + tq(v))}이므로 급수의 합은 ${tq(v)}이다.`,
          facts: { value: `${c}/(1+${p})` }
        });
      }
      // 교과서 32쪽: ㄱ자 도형의 넓이 aₙ = s²/n² − s²/(n+1)², Sₙ = s²{1 − 1/(n+1)²} → s²
      const s = d.pick([2, 3, 4, 5, 6]), s2 = s * s;
      const S = (f) => nb(SN + ' = ' + f);
      const sq1 = frac(1, ms('(n+1)^2')), sq0 = frac(1, ms('n^2'));
      const opts = [
        [S(s2 + par('1 ' + MINUS + ' ' + sq1)), s2, (t) => s2 * (1 - 1 / ((t + 1) * (t + 1)))],
        [S(s2 + par('1 ' + MINUS + ' ' + sq0)), s2, (t) => s2 * (1 - 1 / (t * t))],
        [S(frac(s2, ms('(n+1)^2'))), 0, (t) => s2 / ((t + 1) * (t + 1))],
        [S(s2 + par('1 ' + MINUS + ' ' + frac(1, pn(1, 1)))), s2, (t) => s2 * (1 - 1 / (t + 1))],
        [S(s2 + par('1 ' + MINUS + ' ' + sq1)), s2 / 2, (t) => s2 * (1 - 1 / ((t + 1) * (t + 1)))]
      ];
      const real = (t) => range(1, t).reduce((acc, k) => acc + s2 / (k * k) - s2 / ((k + 1) * (k + 1)), 0);
      const rows = opts.map(([h, total, f]) => [`${h}, ${nb(SI(AN) + ' = ' + (Number.isInteger(total) ? total : frac(s2, 2)))}`, range(1, 6).every((t) => close(f(t), real(t))) && total === s2]);
      return choose(d, `그림과 같이 한 변의 길이가 ${frac(s, VN)}(${nb(VN + ' = 1, 2, 3, …')})인 정사각형들을 한 꼭짓점이 겹치도록 포개어 놓았다. ㄱ자 모양 도형의 넓이를 큰 것부터 차례로 ${A_(1)}, ${A_(2)}, ${A_(3)}, …이라 하고 ${nb(SN + ' = ' + A_(1) + ' + ' + A_(2) + ' + ⋯ + ' + AN)}이라 할 때, ${jh(SN, '과/와')} 급수 ${SI(AN)}의 합을 바르게 짝지은 것은?`, rows, {
        figure: nestedSquares(),
        explain: `${nb(AN + ' = ' + frac(s2, ms('n^2')) + ' ' + MINUS + ' ' + frac(s2, ms('(n+1)^2')))}이므로 가운데가 지워져 ${S(s2 + ' ' + MINUS + ' ' + frac(s2, ms('(n+1)^2')))}이다. 이것은 가장 큰 정사각형에서 한 변의 길이가 ${frac(s, pn(1, 1))}인 정사각형을 뺀 넓이이고, ${nb(LIM(SN) + ' = ' + s2)}이므로 급수의 합은 가장 큰 정사각형의 넓이 ${s2}이다.`
      });
    }, { count: 2 }),
    T('def-blank', '부분합을 구하는 과정의 빈칸', '①2', (d) => {
      const a = d.pick([2, 3, 4]), b = d.pick([-1, 0, 1, 2]);
      if (a + b < 2) return null;
      const f1 = (k) => a * k + b;
      const t = (x) => frac(1, x);
      const body = par(t(pn(a, b)) + ' ' + MINUS + ' ' + t(pn(a, a + b)));
      const bodyK = par(t(pn(a, b, VK)) + ' ' + MINUS + ' ' + t(pn(a, a + b, VK)));
      const expand = [1, 2].map((k) => nb(par(t(f1(k)) + ' ' + MINUS + ' ' + t(f1(k + 1))))).join(' + ') + ' + ⋯ + ' + nb(par(t(pn(a, b)) + ' ' + MINUS + ' ' + t(pn(a, a + b))));
      const fig = given([`${SN} = ${SK(VN, bodyK)}`, `= ${expand}`, '= ㈎', `${LIM(SN)} = ${LIM('(㈎)')} = ㈏`]);
      const first = a + b, v1 = Q(1, first);
      const E = [
        [nb(t(first) + ' ' + MINUS + ' ' + t(pn(a, a + b))), (m) => 1 / first - 1 / (a * m + a + b)],
        [nb(t(first) + ' ' + MINUS + ' ' + t(pn(a, b))), (m) => 1 / first - 1 / (a * m + b)],
        [nb(t(first) + ' + ' + t(pn(a, a + b))), (m) => 1 / first + 1 / (a * m + a + b)],
        [nb(t(pn(a, b)) + ' ' + MINUS + ' ' + t(pn(a, a + b))), (m) => 1 / (a * m + b) - 1 / (a * m + a + b)]
      ];
      const V0 = [[tq(v1), 1 / first], ['0', 0], [tq(Q(1, a)), 1 / a]];
      const real = (m) => range(1, m).reduce((acc, k) => acc + 1 / f1(k) - 1 / f1(k + 1), 0);
      const pairs = [[0, 0], [0, 1], [1, 0], [2, 0], [3, 1]];
      const rows = pairs.map(([i, j]) => [`㈎ ${E[i][0]}, ㈏ ${V0[j][0]}`, range(1, 6).every((m) => close(E[i][1](m), real(m))) && close(V0[j][1], 1 / first)]);
      return choose(d, `다음은 급수 ${SI(body)}의 수렴, 발산을 조사하는 과정이다. ㈎, ㈏에 알맞은 것을 차례로 나열한 것은?`, rows, {
        figure: fig,
        explain: `풀어 쓰면 가운데 항이 모두 지워져 처음 항 ${t(first)}과 끝 항 ${t(pn(a, a + b))}만 남는다. 따라서 ㈎는 ${E[0][0]}이고, ${nb(LIM(t(pn(a, a + b))) + ' = 0')}이므로 ㈏는 ${tq(v1)}이다.`
      });
    }),
    T('def-osc', '부분합이 진동하는 급수', '①3', (d) => {
      const c = d.int(1, 6), neg = d.bool();
      const u = neg ? '(' + MINUS + c + ')' : String(c), w = neg ? String(c) : '(' + MINUS + c + ')';
      const series = [u, w, u, w].join(' + ') + ' + ⋯';
      const first = neg ? MINUS + c : String(c);
      const rows = [
        [`부분합이 ${first}, 0, ${first}, 0, …으로 수렴하지 않으므로 발산한다.`, true],
        ['두 항씩 괄호로 묶으면 0 + 0 + 0 + ⋯이므로 0에 수렴한다.', false],
        [`합을 ${V('S')}라 하면 ${nb(V('S') + ' = ' + first + ' ' + MINUS + ' ' + V('S'))}이므로 ${tq(Q(neg ? -c : c, 2))}에 수렴한다.`, false],
        [`첫째항을 떼어 놓고 두 항씩 묶으면 ${first} + 0 + 0 + ⋯이므로 ${first}에 수렴한다.`, false],
        ['일반항이 0에 한없이 가까워지므로 수렴한다.', false]
      ];
      return choose(d, '다음 급수에 대한 설명으로 옳은 것은?', rows, {
        figure: hx(series),
        explain: `부분합은 차례로 ${first}, 0, ${first}, 0, …이므로 부분합의 수열이 수렴하지 않는다. 따라서 이 급수는 발산한다. 괄호로 묶는 법에 따라 값이 달라지는 것은 수렴하지 않기 때문이다.`
      });
    }),
    T('def-tail', '차의 꼴인데 남는 끝 항이 0이 아닌 값으로 가는 급수', '①4', (d) => {
      const p = d.pick([1, 2, 3]), r = d.pick([1, 2, 3]), q = d.int(1 - p, 4);
      if (q === p * r) return null;
      const num = (k) => p * k + q, den = (k) => k + r;
      if (range(1, 4).some((k) => num(k) <= 0 || gcd(num(k), den(k)) !== 1)) return null;
      const v = Q(q - p * r, 1 + r);
      const bq = (k) => frac(num(k), den(k));
      const listed = d.bool();
      const bn = (x, y) => frac(pn(p, y), pn(1, x));
      const fig = listed
        ? hx([1, 2, 3].map((k) => nb(par(bq(k) + ' ' + MINUS + ' ' + bq(k + 1)))).join(' + ') + ' + ⋯')
        : null;
      const body = par(bn(r, q) + ' ' + MINUS + ' ' + bn(r + 1, p + q));
      const text = listed ? '다음 급수의 합은?' : `급수 ${SI(body)}의 합은?`;
      return val(text, v, {
        figure: fig || undefined,
        explain: `제${VN}항까지의 부분합은 가운데가 지워져 ${nb(SN + ' = ' + bq(1) + ' ' + MINUS + ' ' + bn(r + 1, p + q))}이다. ${nb(LIM(bn(r + 1, p + q)) + ' = ' + p)}이므로 급수의 합은 ${nb(bq(1) + ' ' + MINUS + ' ' + p + ' = ' + tq(v))}이다. 끝 항이 0으로 가지 않으므로 ${jh(bq(1), '으로/로')} 답하면 안 된다.`,
        facts: { value: `(${p}+${jn(q)})/(1+${r})-${p}`, derived: [p, r, Math.abs(q)] }
      });
    }),
    T('def-root-pick', '근호 꼴 급수 가운데 수렴하는 것 고르기', '①5 ①6', (d) => {
      const u = d.pick([1, 2, 3]), a = d.pick([2, 3]), b = d.pick([1, 2]);
      // 발산하는 근호 꼴 넷(유리화하면 부분합에 √n 꼴이 남는다)과 수렴하는 근호의 역수 꼴 하나
      const pool = [
        SI(frac(1, rt(pn(1, u)) + ' + ' + rt(VN))),
        SI(par(rt(pn(a, b)) + ' ' + MINUS + ' ' + rt(pn(a, b - a)))),
        SI(frac(1, rt(pn(2, 1)) + ' + ' + rt(pn(2, -1)))),
        SI(frac(2, rt(pn(1, 2)) + ' + ' + rt(VN)))
      ];
      const w = d.pick([1, 2]), flip = d.bool();
      const conv = flip ? par(frac(1, rt(VN)) + ' ' + MINUS + ' ' + frac(1, rt(pn(1, w)))) : par(frac(1, rt(pn(1, w))) + ' ' + MINUS + ' ' + frac(1, rt(VN)));
      const rows = pool.map((h) => [h, false]).concat([[SI(conv), true]]);
      return choose(d, '다음 급수 가운데 수렴하는 것은?', rows, {
        explain: `근호의 차 꼴은 분모를 유리화하여 풀어 쓰면 ${rt(VN)}처럼 한없이 커지는 항이 남아 모두 발산한다(일반항은 0으로 가도 발산한다). ${SI(conv)}은 풀어 쓰면 끝에 남는 ${frac(1, rt(pn(1, 1)))} 꼴의 항이 0으로 가므로 수렴한다.`
      });
    }),
    T('def-rootinv', '근호의 역수의 차로 된 급수의 합', '①6', (d) => {
      const [u, s] = d.pick([[2, 0], [2, 2], [2, 3], [2, 7], [3, 0], [1, 1], [1, 2]]);
      const sign = d.pick([1, -1]);
      const at = (k) => (k === 0 ? VN : pn(1, k));
      const body = sign < 0 ? par(frac(1, rt(at(s + u))) + ' ' + MINUS + ' ' + frac(1, rt(at(s)))) : par(frac(1, rt(at(s))) + ' ' + MINUS + ' ' + frac(1, rt(at(s + u))));
      const termsOf = (list, sg) => list.map((k) => { const t = invRoot(k); return { q: Q(sg * t.q.p, t.q.q), w: t.w }; });
      const keep = range(s + 1, s + u);
      const right = termsOf(keep, sign);
      // 틀린 보기: 끝 항 하나를 빠뜨림, 다음 항을 더 넣음, 부호를 뒤집음, 한 칸 밀림, 첫 항만
      const cands = [
        right,
        u > 1 ? termsOf(range(s + 1, s + u - 1), sign) : termsOf([s + 2], sign),
        termsOf(keep.concat([s + u + 1]), sign),
        termsOf(keep, -sign),
        termsOf(range(s + 2, s + u + 1), sign),
        termsOf([s + u], sign)
      ];
      const seen = new Set(), rows = [];
      for (const c of cands) { const vv = surdVal(c), key = vv.toFixed(9); if (seen.has(key)) continue; seen.add(key); rows.push([surd(c), close(vv, surdVal(right))]); }
      if (rows.length < 4) return null;
      const shown = keep.map((k) => (k === 1 ? '1' : frac(1, rt(k)))).join(' + ');
      return choose(d, `급수 ${SI(body)}의 합은?`, rows.slice(0, 5), {
        explain: `부분합을 풀어 쓰면 ${u === 1 ? '이웃한 항끼리' : '한 칸 건너'} 지워져 ${jh(sign < 0 ? MINUS + par(shown) : shown, '과/와')} 끝에 남는 ${frac(1, rt(pn(1, s + u)))} 꼴의 항만 남는다. 끝 항은 0으로 가므로 합은 ${surd(right)}이다.`
      });
    })
  ]);

  // ── 부분분수로 지우는 급수 ──
  // 두 일차식의 곱 (an + b)(an + c)
  const den2 = (a, b, c, v) => { const f1 = pn(a, b, v), f2 = pn(a, c, v); return (b === 0 ? f1 : par(f1)) + par(f2); };
  B.addTypes(UNIT, 'tele', [
    T('tele-adj', '간격이 1인 부분분수 꼴 급수의 합', '①7', (d, n) => {
      if (n === 0) {
        const a = d.pick([1, 2, 3]), b = d.pick(a === 1 ? [0, 1, 2] : a === 2 ? [-1, 1] : [-2, -1, 1]), c = d.int(1, 2 * a + 1);
        const body = frac(c, den2(a, b, a + b)), v = Q(c, a * (a + b));
        const lead = cf(Q(c, a));
        return val(`급수 ${SI(body)}의 합은?`, v, {
          explain: `두 인수의 차가 ${a}이므로 ${nb(body + ' = ' + lead + par(frac(1, pn(a, b)) + ' ' + MINUS + ' ' + frac(1, pn(a, a + b))))}이다. 부분합은 가운데가 지워져 ${nb(SN + ' = ' + lead + par(frac(1, a + b).replace(frac(1, 1), '1') + ' ' + MINUS + ' ' + frac(1, pn(a, a + b))))}이므로 급수의 합은 ${tq(v)}이다.`.replace(frac(1, 1), '1'),
          facts: { value: `${c}/(${a}*(${a}+${jn(b)}))`, derived: [a, Math.abs(b)], rule: 'gap1' }
        });
      }
      const a = d.pick([2, 3, 4, 5]), b = d.int(1 - a, 2), c = d.pick([1, 1, 2, 3]);
      const f = (k) => a * k + b;
      const terms = [1, 2, 3].map((k) => frac(c, `${f(k)} × ${f(k + 1)}`));
      const v = Q(c, a * (a + b));
      return val('다음 급수의 합은?', v, {
        figure: hx(terms.join(' + ') + ' + ⋯'),
        explain: `분모의 두 수는 공차가 ${a}인 등차수열을 이루므로 제${VN}항은 ${frac(c, den2(a, b, a + b))}이다. ${nb(frac(c, den2(a, b, a + b)) + ' = ' + cf(Q(c, a)) + par(frac(1, pn(a, b)) + ' ' + MINUS + ' ' + frac(1, pn(a, a + b))))}이므로 합은 ${nb(tq(Q(c, a)) + ' × ' + frac(1, a + b))} = ${tq(v)}이다.`.replace(frac(1, 1), '1'),
        facts: { value: `${c}/((${f(2)}-${f(1)})*${f(1)})`, rule: 'listed' }
      });
    }, { count: 2 }),
    T('tele-skip', '간격이 2·3인 부분분수 꼴 급수의 합(남는 항이 여럿)', '①8', (d, n) => {
      if (n === 0) {
        const g = d.pick([2, 3]), s = d.pick([0, 1]), c = d.pick([1, 2, 3, 4, 6]);
        const body = frac(c, den2(1, s, s + g)), v = qmul(Q(c, g), qsub(harm(g + s), harm(s)));
        return val(`급수 ${SI(body)}의 합은?`, v, {
          explain: `${nb(body + ' = ' + frac(c, g) + par(frac(1, pn(1, s)) + ' ' + MINUS + ' ' + frac(1, pn(1, s + g))))}이다. 풀어 쓰면 ${g === 2 ? '한 칸' : '두 칸'} 건너 지워져 앞의 ${g}개 항 ${nb(harmH(g, s))}과 끝의 ${g}개 항만 남고, 끝의 항은 0으로 가므로 합은 ${nb(frac(c, g) + par(harmH(g, s)) + ' = ' + tq(v))}이다.`,
          facts: { value: `${c}/${g}*(${harmE(g, s)})`, derived: [g, s + 1, s + 2, s + 3], rule: 'gap23' }
        });
      }
      const g = d.pick([2, 3, 4]), c = d.pick([1, 2]);
      const terms = [1, 2, 3].map((k) => frac(c, `${k}${sup(2)} + ${g * k}`));
      const v = qmul(Q(c, g), harm(g));
      return val('다음 급수의 합은?', v, {
        figure: hx(terms.join(' + ') + ' + ⋯'),
        explain: `제${VN}항은 ${nb(frac(c, ms('n^2') + ' + ' + g + VN) + ' = ' + frac(c, VN + par(pn(1, g))))}이고 ${nb(frac(c, VN + par(pn(1, g))) + ' = ' + frac(c, g) + par(frac(1, VN) + ' ' + MINUS + ' ' + frac(1, pn(1, g))))}이다. 풀어 쓰면 앞의 ${g}개 항만 남으므로 합은 ${nb(frac(c, g) + par(harmH(g)) + ' = ' + tq(v))}이다.`,
        facts: { value: `${c}/${g}*(${harmE(g)})`, derived: [3, 4], rule: 'listed' }
      });
    }, { count: 2 }),
    T('tele-tri', '분모가 1 + 2 + ⋯ + n 꼴인 급수의 합', '①9', (d) => {
      const kind = d.int(0, 2);
      if (kind < 2) {
        const c = d.pick([1, 2, 3]);
        const head = kind === 1 ? [String(c)] : [];
        const terms = head.concat([frac(c, '1 + 2'), frac(c, '1 + 2 + 3'), frac(c, '1 + 2 + 3 + 4')]);
        const v = Q(kind === 1 ? 2 * c : c);
        return val('다음 급수의 합은?', v, {
          figure: hx(terms.join(' + ') + ' + ⋯'),
          explain: `${nb('1 + 2 + ⋯ + ' + VK + ' = ' + frac(ms('k(k+1)'), 2))}이므로 ${nb(frac(c, '1 + 2 + ⋯ + ' + VK) + ' = ' + frac(2 * c, ms('k(k+1)')) + ' = ' + 2 * c + par(frac(1, VK) + ' ' + MINUS + ' ' + frac(1, pn(1, 1, VK))))}이다. 주어진 급수는 ${VK}가 ${kind === 1 ? '1' : '2'}부터인 합이므로 ${nb(2 * c + ' × ' + (kind === 1 ? '1' : frac(1, 2)) + ' = ' + tq(v))}이다.`,
          facts: { value: kind === 1 ? `2*${c}` : `2*${c}/2`, rule: 'tri' + kind }
        });
      }
      const t = d.pick([2, 3, 4, 5]);
      const terms = [frac(1, t), frac(1, `${t} + ${2 * t}`), frac(1, `${t} + ${2 * t} + ${3 * t}`)];
      const v = Q(2, t);
      return val('다음 급수의 합은?', v, {
        figure: hx(terms.join(' + ') + ' + ⋯ + ' + frac(1, `${t} + ${2 * t} + ⋯ + ${t}${VN}`) + ' + ⋯'),
        explain: `${nb(t + ' + ' + 2 * t + ' + ⋯ + ' + t + VN + ' = ' + frac(t + ms('n(n+1)'), 2))}이므로 제${VN}항은 ${nb(frac(2, t + ms('n(n+1)')) + ' = ' + frac(2, t) + par(frac(1, VN) + ' ' + MINUS + ' ' + frac(1, pn(1, 1))))}이다. 따라서 합은 ${nb(frac(2, t) + ' × 1 = ' + tq(v))}이다.`,
        facts: { value: `2/${t}`, rule: 'tri2' }
      });
    }),
    T('tele-triple', '세 인수의 곱이 분모인 급수의 합', '①10', (d) => {
      const s = d.pick([0, 1]), c = d.pick([1, 2, 4, 6, 12]);
      const v = Q(c, 2 * (s + 1) * (s + 2));
      const terms = [1, 2, 3].map((k) => frac(c, `${k + s} × ${k + s + 1} × ${k + s + 2}`));
      const g = (x, y) => frac(1, `${x}` + ' × ' + `${y}`);
      return val('다음 급수의 합은?', v, {
        figure: hx(terms.join(' + ') + ' + ⋯'),
        explain: `제${VN}항은 ${frac(c, (s === 0 ? VN : par(pn(1, s))) + par(pn(1, s + 1)) + par(pn(1, s + 2)))}이고, ${nb(frac(1, ms('A(A+1)(A+2)', 'A')) + ' = ' + frac(1, 2) + '{' + frac(1, ms('A(A+1)', 'A')) + ' ' + MINUS + ' ' + frac(1, ms('(A+1)(A+2)', 'A')) + '}')}이다. 풀어 쓰면 첫 항 ${g(s + 1, s + 2)}만 남으므로 합은 ${nb(frac(c, 2) + ' × ' + g(s + 1, s + 2) + ' = ' + tq(v))}이다.`,
        facts: { value: `${c}/(2*${s + 1}*${s + 2})`, derived: [s + 1, s + 2] }
      });
    })
  ]);

  // ── 일반항을 먼저 구해 지우는 급수 ──
  B.addTypes(UNIT, 'gen', [
    T('gen-arith', '등차수열의 합 S₂ₙ의 역수의 급수', '①13', (d) => {
      const dd = d.pick([1, 2, 3, 4]), j = d.pick([1, 2, 3]);
      const a1 = Q(dd * (2 * j + 1), 2), v = qmul(Q(1, 2 * dd * j), harm(j));
      return val(`첫째항이 ${tq(a1)}, 공차가 ${dd}인 등차수열의 첫째항부터 제${VN}항까지의 합을 ${SN}이라 할 때, 급수 ${SI(frac(1, ms('S_{2n}')))}의 합은?`, v, {
        explain: `${nb(SN + ' = ' + frac(VN + '{2 × ' + tq(a1) + ' + ' + par(pn(1, -1)) + ' × ' + dd + '}', 2) + ' = ' + (dd === 2 ? '' : frac(dd, 2)) + VN + par(pn(1, 2 * j)))}이므로 ${nb(ms('S_{2n}') + ' = ' + 2 * dd + VN + par(pn(1, j)))}이다. ${nb(frac(1, 2 * dd + VN + par(pn(1, j))) + ' = ' + frac(1, 2 * dd * j) + par(frac(1, VN) + ' ' + MINUS + ' ' + frac(1, pn(1, j))))}이므로 합은 ${nb(frac(1, 2 * dd * j) + par(harmH(j)) + ' = ' + tq(v))}이다.`,
        facts: { value: `1/(2*${dd}*${j})*(${harmE(j)})`, derived: [j, 3] }
      });
    }),
    T('gen-sn', '합 Sₙ에서 일반항을 구한 뒤 분수 꼴 급수의 합', '①14', (d) => {
      const dd = d.pick([2, 3, 4]), a1 = d.int(1, 5), t = d.pick([1, 2]);
      if (2 * a1 === dd) return null;
      const c = dd * t, e = a1 - dd;
      const Sn = poly([[Q(dd, 2), ms('n^2')], [Q(2 * a1 - dd, 2), VN]]);
      const v = Q(t, a1);
      return val(`수열 ${SEQA}의 첫째항부터 제${VN}항까지의 합 ${SN}이 ${nb(SN + ' = ' + Sn)}일 때, 급수 ${SI(frac(c, ms('a_na_{n+1}')))}의 합은?`, v, {
        explain: `${nb(VN + ' ≥ 2')}일 때 ${nb(AN + ' = ' + SN + ' ' + MINUS + ' ' + ms('S_{n-1}') + ' = ' + pn(dd, e))}이고, ${nb(A_(1) + ' = ' + ms('S_1') + ' = ' + a1)}도 이 식에 맞으므로 ${nb(AN + ' = ' + pn(dd, e))}이다. 공차가 ${dd}이므로 ${nb(frac(c, ms('a_na_{n+1}')) + ' = ' + (t === 1 ? '' : t) + par(frac(1, AN) + ' ' + MINUS + ' ' + frac(1, ms('a_{n+1}'))))}이고, 합은 ${nb((t === 1 ? '' : t + ' × ') + frac(1, a1).replace(frac(1, 1), '1') + ' = ' + tq(v))}이다.`,
        facts: { value: `${c}/${dd}/${a1}`, derived: [a1, dd] }
      });
    }),
    T('gen-rem', '나머지정리로 만든 일반항의 급수', '①15', (d) => {
      const kind = d.int(0, 2), c0 = d.int(1, 9);
      const [k2, mul, hs] = [[1, 1, 1], [2, 4, 2], [3, 18, 3]][kind];
      const R = c0 + mul * d.int(1, 3);
      const D = R - c0, v = qmul(Q(D, k2), harm(k2));
      const pol = nb(AN + VX + sup(2) + ' + ' + (k2 === 1 ? '' : k2) + AN + VX + ' + ' + c0);
      return val(`모든 자연수 ${VN}에 대하여 ${nb(AN + ' ≠ 0')}이고, ${VX}에 대한 다항식 ${jh(pol, '을/를')} ${nb(VX + ' ' + MINUS + ' ' + VN)}으로 나눈 나머지가 ${R}이다. 급수 ${SI(AN)}의 합은?`, v, {
        explain: `나머지정리에 의하여 ${nb(AN + VN + sup(2) + ' + ' + (k2 === 1 ? '' : k2) + AN + VN + ' + ' + c0 + ' = ' + R)}이므로 ${nb(AN + ' = ' + frac(D, VN + par(pn(1, k2))))}이다. ${nb(frac(D, VN + par(pn(1, k2))) + ' = ' + cf(Q(D, k2)) + par(frac(1, VN) + ' ' + MINUS + ' ' + frac(1, pn(1, k2))))}이므로 풀어 쓰면 ${k2 === 1 ? '첫 항만 남아 합은 ' + D : '앞의 ' + k2 + '개 항만 남아 합은 ' + nb(tq(Q(D, k2)) + ' × ' + par(harmH(k2)) + ' = ' + tq(v))}이다.`,
        facts: { value: `(${R}-${c0})/${k2}*(${harmE(k2)})`, derived: [k2, hs, 3] }
      });
    }),
    T('gen-div', '약수의 개수로 만든 일반항의 급수', '①16', (d) => {
      const kind = d.int(0, 3);
      let fig, an, v, ex, val0, split;
      if (kind === 0) {
        const [P, Qb] = d.pick([[2, 3], [3, 2], [5, 7], [2, 5], [3, 7]]);
        fig = nb(ms(`${P}^n`) + ' × ' + ms(`${Qb}^{n+1}`)); an = ms('(n+1)(n+2)'); v = Q(1, 2); ex = `1/2`; split = nb(frac(1, pn(1, 1)) + ' ' + MINUS + ' ' + frac(1, pn(1, 2))) + '의 합이라 첫 항 ' + frac(1, 2);
        val0 = `${P}의 지수가 ${VN}, ${Qb}의 지수가 ${pn(1, 1)}이므로 ${nb(AN + ' = ' + an)}`;
      } else if (kind === 1) {
        const [P, Qb, Pr] = d.pick([[3, 4, 2], [5, 9, 3], [3, 25, 5], [2, 9, 3]]);
        fig = nb(ms(`${P}^{2n}`) + ' × ' + ms(`${Qb}^{n+1}`)); an = ms('(2n+1)(2n+3)'); v = Q(1, 6); ex = `1/(2*3)`; split = nb(frac(1, 2) + par(frac(1, pn(2, 1)) + ' ' + MINUS + ' ' + frac(1, pn(2, 3)))) + '의 합이라 ' + nb(frac(1, 2) + ' × ' + frac(1, 3));
        val0 = `${nb(ms(`${Qb}^{n+1}`) + ' = ' + ms(`${Pr}^{2n+2}`))}이므로 ${nb(AN + ' = ' + an)}`;
      } else if (kind === 2) {
        const [P, Qb] = d.pick([[2, 3], [5, 7], [3, 5]]);
        fig = nb(ms(`${P}^n`) + ' × ' + ms(`${Qb}^{n+2}`)); an = ms('(n+1)(n+3)'); v = Q(5, 12); ex = `1/2*(1/2+1/3)`; split = nb(frac(1, 2) + par(frac(1, pn(1, 1)) + ' ' + MINUS + ' ' + frac(1, pn(1, 3)))) + '의 합이라 앞의 두 항 ' + nb(frac(1, 2) + par(frac(1, 2) + ' + ' + frac(1, 3)));
        val0 = `${P}의 지수가 ${VN}, ${Qb}의 지수가 ${pn(1, 2)}이므로 ${nb(AN + ' = ' + an)}`;
      } else {
        fig = nb(ms('8^n') + ' × ' + ms('27^{n+1}')); an = ms('(3n+1)(3n+4)'); v = Q(1, 12); ex = `1/(3*4)`; split = nb(frac(1, 3) + par(frac(1, pn(3, 1)) + ' ' + MINUS + ' ' + frac(1, pn(3, 4)))) + '의 합이라 ' + nb(frac(1, 3) + ' × ' + frac(1, 4));
        val0 = `${nb(ms('8^n') + ' × ' + ms('27^{n+1}') + ' = ' + ms('2^{3n}') + ' × ' + ms('3^{3n+3}'))}이므로 ${nb(AN + ' = ' + an)}`;
      }
      return val(`자연수 ${VN}에 대하여 ${fig}의 양의 약수의 개수를 ${AN}이라 할 때, 급수 ${SI(frac(1, AN))}의 합은?`, v, {
        explain: `${val0}이다. ${nb(frac(1, AN))}은 ${split}만 남으므로 합은 ${tq(v)}이다.`,
        facts: { value: ex, derived: [3, 4] }
      });
    }),
    T('gen-area', '도형의 넓이 Sₙ의 역수의 급수', '①18', (d) => {
      const [p, q] = d.pick([[1, 2], [1, 3], [2, 3], [1, 4], [2, 4]]), s = d.pick([1, 2]);
      const g = 2 * s, v = qmul(Q(2, q - p), qmul(Q(1, g), harm(g)));
      const X1 = s, X2 = s + 3, xmax = X2 + 0.7, ymax = q * xmax;
      const fig = plot({
        x: [0, xmax], y: [0, ymax], ys: 200 / (ymax * (224 / xmax)), xt: [{ v: X1, t: String(s) }, { v: X2, t: 'n+' + s }],
        lines: [{ a: q, b: 0, name: q === 1 ? 'y=x' : 'y=' + q + 'x' }, { a: p, b: 0, name: p === 1 ? 'y=x' : 'y=' + p + 'x' }],
        fill: [{ f: (x) => q * x, g: (x) => p * x, from: X1, to: X2 }],
        segs: [{ p: [X1, p * X1], q: [X1, q * X1] }, { p: [X2, p * X2], q: [X2, q * X2] }],
        say: `칠한 부분은 두 직선 x = ${s}, x = n + ${s} 사이에서 두 직선 y = ${p}x, y = ${q}x로 둘러싸인 사각형이다.`
      });
      const lineH = (k) => nb(V('y') + ' = ' + (k === 1 ? '' : k) + VX);
      return val(`그림과 같이 자연수 ${VN}에 대하여 네 직선 ${nb(VX + ' = ' + s)}, ${nb(VX + ' = ' + pn(1, s))}, ${lineH(p)}, ${jh(lineH(q), '으로/로')} 둘러싸인 사각형의 넓이를 ${SN}이라 할 때, 급수 ${SI(frac(1, SN))}의 합은?`, v, {
        figure: fig,
        explain: `평행한 두 변의 길이가 ${(q - p) * s}, ${nb((q - p === 1 ? '' : q - p) + par(pn(1, s)))}이고 높이가 ${VN}인 사다리꼴이므로 ${nb(SN + ' = ' + cf(Q(q - p, 2)) + VN + par(pn(1, g)))}이다. ${nb(frac(1, SN) + ' = ' + tq(Q(2, (q - p) * g)) + par(frac(1, VN) + ' ' + MINUS + ' ' + frac(1, pn(1, g))))}이므로 풀어 쓰면 앞의 ${g}개 항만 남아 합은 ${nb(tq(Q(2, (q - p) * g)) + par(harmH(g)) + ' = ' + tq(v))}이다.`,
        facts: { value: `2/((${q}-${p})*2*${s})*(${harmE(g)})`, derived: [3, 4] }
      });
    })
  ]);

  // ── 급수와 수열의 극한의 관계 ──
  // 흐름도(교과서 53쪽 창의·코딩): 끝 다섯 곳에 이름(ㄱ~ㅁ)을 붙인다. ends[i] = i번째 끝의 이름.
  function flowChart(ends) {
    const box = (h) => `<span style="display:inline-block;border:1.5px solid #64748b;border-radius:6px;padding:2px 7px;background:#f8fafc">${h}</span>`;
    const branch = (inner) => `<div style="margin-left:9px;border-left:2px solid #94a3b8;padding-left:9px">${inner}</div>`;
    const end = (i) => `<b style="color:#1d4ed8">${ends[i]}</b>`;
    const row = (h) => `<div style="padding:0.25em 0">${h}</div>`;
    return '<div class="mb-lines" style="text-align:left">' + row(box(`${SI(AN)}은 등비급수인가?`)) + branch(
      row('예 → ' + box(`첫째항이 0이거나 공비 ${jh(VR, '이/가')} ${nb(MINUS + '1 &lt; ' + VR + ' &lt; 1')}인가?`)) + branch(row('예 → ' + end(0)) + row('아니요 → ' + end(1)))
      + row('아니요 → ' + box(`${nb(LIM(AN) + ' = 0')}인가?`)) + branch(
        row('예 → ' + box(`부분합 ${SN}의 극한 ${LIM(SN)}이 존재하는가?`)) + branch(row('예 → ' + end(2)) + row('아니요 → ' + end(3)))
        + row('아니요 → ' + end(4)))
    ) + '</div>';
  }
  B.addTypes(UNIT, 'rel', [
    T('rel-div', '일반항의 극한으로 급수의 발산 판정하기', '①20', (d, n) => {
      let gen, L, wrong, listedFig = null;
      if (n === 0) {
        const kind = d.int(0, 2);
        if (kind === 0) {
          const a = d.int(1, 5), b = d.int(-4, 5), c = d.int(1, 5), e = d.int(1, 5);
          if (a * e === b * c) return null;
          gen = frac(pn(a, b), pn(c, e)); L = Q(a, c); wrong = d.pick([Q(b, e), Q(a + b, c + e), Q(c, a)]);
        } else if (kind === 1) {
          const a = d.int(1, 4), b = d.int(1, 6);
          gen = frac(b + ' ' + MINUS + ' ' + (a === 1 ? '' : a) + ms('n^2'), ms('n^2')); L = Q(-a); wrong = d.pick([Q(b), Q(a), Q(b - a)]);
        } else {
          const a = d.int(1, 3), c = d.int(2, 5), e = d.int(1, 3);
          listedFig = hx([1, 2, 3].map((k) => frac(a * k, c * k + e)).join(' + ') + ' + ⋯');
          gen = frac(a === 1 ? VN : a + VN, pn(c, e)); L = Q(a, c); wrong = d.pick([Q(a, c + e), Q(a, e), Q(c, a)]);
        }
      } else {
        const kind = d.int(0, 2);
        if (kind === 0) {
          const a = d.int(1, 6); gen = rt(ms('n^2') + ' + ' + (a === 1 ? '' : a) + VN) + ' ' + MINUS + ' ' + VN; L = Q(a, 2); wrong = d.pick([Q(a), Q(a, 4), Q(1, 2)]);
        } else if (kind === 1) {
          const b = d.int(0, 3), a = b + 2 * d.int(1, 3); gen = rt(VN) + par(rt(pn(1, a)) + ' ' + MINUS + ' ' + (b === 0 ? rt(VN) : rt(pn(1, b)))); L = Q(a - b, 2); wrong = d.pick([Q(a - b), Q(a + b, 2), Q(a - b, 4)]);
        } else {
          const a = d.int(1, 7); gen = rt('4' + ms('n^2') + ' + ' + (a === 1 ? '' : a) + VN) + ' ' + MINUS + ' 2' + VN; L = Q(a, 4); wrong = d.pick([Q(a, 2), Q(a), Q(a, 8)]);
        }
        gen = par(gen);
      }
      if (wrong.p === 0 || (wrong.p === L.p && wrong.q === L.q)) return null;
      const limA = LIM(AN), eq = (x) => nb(limA + ' = ' + tq(x));
      const opts = [
        [`${eq(L)}이고 0이 아니므로 이 급수는 발산한다.`, L, '발산'],
        [`${eq(L)}이므로 이 급수는 ${tq(L)}에 수렴한다.`, L, '수렴'],
        [`${eq(Q(0))}이므로 이 급수는 수렴한다.`, Q(0), '수렴'],
        [`${eq(wrong)}이고 0이 아니므로 이 급수는 발산한다.`, wrong, '발산']
      ];
      const rows = opts.map(([h, claim, verdict]) => [h, claim.p === L.p && claim.q === L.q && verdict === '발산' && L.p !== 0]);
      const series = listedFig ? '다음 급수' : `급수 ${SI(gen)}`;
      return choose(d, `${series}의 일반항을 ${AN}이라 할 때, 이 급수의 수렴, 발산에 대한 설명으로 옳은 것은?`, rows, {
        figure: listedFig || undefined,
        explain: `${listedFig ? `제${VN}항은 ${nb(AN + ' = ' + gen)}이고, ` : ''}${eq(L)}이다. 일반항의 극한이 0이 아니면 급수는 발산하므로 이 급수는 발산한다.`
      });
    }, { count: 2 }),
    T('rel-zero', '급수가 수렴하면 일반항이 0으로 — lim aₙ 구하기', '①21', (d, n) => {
      if (n === 0) {
        const p = d.int(2, 5), u = d.int(1, 6), vv = d.int(2, 7), w = d.int(1, 5), S = d.int(1, 5), sg = d.pick([1, -1]);
        if (gcd(u, vv) !== 1) return null;
        const v = Q(sg * u, p * vv);
        const body = par(p + AN + (sg > 0 ? ' ' + MINUS + ' ' : ' + ') + frac(u === 1 ? VN : u + VN, pn(vv, w)));
        return val(`수열 ${SEQA}에 대하여 ${nb(SI(body) + ' = ' + S)}일 때, ${LIM(AN)}의 값은?`, v, {
          explain: `급수가 수렴하므로 일반항은 0으로 간다: ${nb(LIM(body) + ' = 0')}. ${nb(LIM(frac(u === 1 ? VN : u + VN, pn(vv, w))) + ' = ' + frac(u, vv).replace(frac(1, 1), '1'))}이므로 ${nb(p + LIM(AN) + ' = ' + tq(Q(sg * u, vv)))}, ${nb(LIM(AN) + ' = ' + tq(v))}이다. 급수의 합 ${josa(S, '은/는')} 쓰이지 않는다.`,
          facts: { value: `${jn(sg)}*${u}/(${p}*${vv})` }
        });
      }
      const alpha = d.int(-3, 5), c = d.int(2, 4), k = d.int(1, 9);
      if (k === alpha) return null;
      const v = Q(k - alpha, c);
      const body = par(AN + ' + ' + c + BN + ' ' + MINUS + ' ' + k);
      return val(`두 수열 ${SEQA}, ${SEQB}에 대하여 ${nb(LIM(AN) + ' = ' + sT(alpha))}이고 급수 ${jh(SI(body), '이/가')} 수렴할 때, ${LIM(BN)}의 값은?`, v, {
        explain: `급수가 수렴하므로 ${nb(LIM(body) + ' = 0')}이다. ${nb(sT(alpha) + ' + ' + c + LIM(BN) + ' ' + MINUS + ' ' + k + ' = 0')}에서 ${nb(LIM(BN) + ' = ' + tq(v))}이다.`,
        facts: { value: `(${k}-${jn(alpha)})/${c}` }
      });
    }, { count: 2 }),
    T('rel-frac', '급수가 수렴하는 조건에서 분수식의 극한', '①22', (d, n) => {
      if (n === 0) {
        const p = d.pick([2, 3]), q = d.int(1, 5), S = d.int(1, 6);
        const al = Q(q, p);
        const A = d.int(1, 4), Bc = d.int(-3, 5), Cc = d.int(1, 3), Dc = d.int(-4, 4);
        const num = qadd(qmul(Q(A), al), Q(Bc)), dn = qadd(qmul(Q(Cc), al), Q(Dc));
        if (dn.p === 0 || num.p === 0) return null;
        const v = qdiv(num, dn);
        if (v.q > 40) return null;
        const body = par(p + AN + ' ' + MINUS + ' ' + q);
        const fe = frac(pn(A, Bc, AN), pn(Cc, Dc, AN));
        return val(`수열 ${SEQA}에 대하여 ${nb(SI(body) + ' = ' + S)}일 때, ${LIM(fe)}의 값은?`, v, {
          explain: `급수가 수렴하므로 ${nb(LIM(body) + ' = 0')}, 곧 ${nb(LIM(AN) + ' = ' + tq(al))}이다. 따라서 구하는 극한값은 ${nb(frac(A + ' × ' + tq(al) + (Bc < 0 ? ' ' + MINUS + ' ' : ' + ') + Math.abs(Bc), Cc + ' × ' + tq(al) + (Dc < 0 ? ' ' + MINUS + ' ' : ' + ') + Math.abs(Dc)) + ' = ' + tq(v))}이다.`,
          facts: { value: `(${A}*${q}/${p}+${jn(Bc)})/(${Cc}*${q}/${p}+${jn(Dc)})`, derived: [Math.abs(Bc), Math.abs(Dc), A, Cc] }
        });
      }
      const c = d.int(1, 3), S1 = d.int(1, 5), S2 = d.int(-4, 4), P = d.int(2, 9), Qc = d.int(1, 5), R = d.int(1, 4);
      if (S2 === 0) return null;
      const v = Q(-P * c, R);
      const fe = frac(P + ms('a_n^2') + ' + ' + cf(Qc) + BN, cf(R) + AN + ' ' + MINUS + ' ' + ms('b_n^2'));
      return val(`두 수열 ${SEQA}, ${SEQB}에 대하여 ${nb(SI(par(AN + ' + ' + c)) + ' = ' + S1)}, ${nb(SI(BN) + ' = ' + sT(S2))}일 때, ${LIM(fe)}의 값은?`, v, {
        explain: `두 급수가 수렴하므로 ${nb(LIM(par(AN + ' + ' + c)) + ' = 0')}, ${nb(LIM(BN) + ' = 0')}이다. ${nb(LIM(AN) + ' = ' + MINUS + c)}이므로 구하는 극한값은 ${nb(frac(P + ' × ' + par(MINUS + c) + sup(2) + ' + 0', R + ' × ' + par(MINUS + c) + ' ' + MINUS + ' 0') + ' = ' + tq(v))}이다.`,
        facts: { value: `${P}*${c}*${c}/(${R}*(0-${c}))` }
      });
    }, { count: 2 }),
    T('rel-ratio', '급수가 수렴하는 조건에서 aₙ/(un + v)의 극한 → 다른 극한', '①23', (d) => {
      const u = d.pick([1, 2]), w = d.int(1, 3), k = d.int(1, 6), p = d.int(2, 7), q = d.int(-3, 5);
      if (p === u && q === w) return null;
      const v = Q(k * u, p);
      const body = par(frac(AN, pn(u, w)) + ' ' + MINUS + ' ' + k);
      return val(`수열 ${SEQA}에 대하여 급수 ${jh(SI(body), '이/가')} 수렴할 때, ${LIM(frac(AN, pn(p, q)))}의 값은?`, v, {
        explain: `급수가 수렴하므로 ${nb(LIM(body) + ' = 0')}, 곧 ${nb(LIM(frac(AN, pn(u, w))) + ' = ' + k)}이다. ${nb(frac(AN, pn(p, q)) + ' = ' + frac(AN, pn(u, w)) + ' × ' + frac(pn(u, w), pn(p, q)))}이고 ${nb(LIM(frac(pn(u, w), pn(p, q))) + ' = ' + frac(u, p).replace(frac(1, 1), '1'))}이므로 구하는 값은 ${nb(k + ' × ' + frac(u, p).replace(frac(1, 1), '1') + ' = ' + tq(v))}이다.`,
        facts: { value: `${k}*${u}/${p}`, derived: [u] }
      });
    }),
    T('rel-tf', '급수와 수열의 극한에 관한 참·거짓', '①24', (d) => {
      const p = d.int(2, 4), q = d.int(2, 4), S = d.int(2, 7), al = d.int(1, 6), A = d.int(1, 4), Bv = A + d.int(1, 4);
      const SA = SI(AN), SB = SI(BN);
      const pool = [
        [`두 급수 ${SA}, ${SB}이 모두 수렴하면 ${nb(LIM(par(p + AN + ' ' + MINUS + ' ' + q + BN)) + ' = 0')}이다.`, true, `두 급수가 수렴하면 ${nb(LIM(AN) + ' = ' + LIM(BN) + ' = 0')}이므로 참이다.`, 'a'],
        [`두 급수 ${SI(par(AN + ' + ' + BN))}, ${SI(par(AN + ' ' + MINUS + ' ' + BN))}이 모두 수렴하면 두 수열 ${SEQA}, ${SEQB}도 모두 수렴한다.`, true, `두 급수의 일반항이 모두 0으로 가므로 ${nb(AN + ' = ' + frac(1, 2) + '{' + par(AN + ' + ' + BN) + ' + ' + par(AN + ' ' + MINUS + ' ' + BN) + '}')}도 0으로 수렴한다. 참이다.`, 'b'],
        [`두 급수 ${SI(par(AN + ' + ' + p + BN))}, ${SI(par(q + AN + ' ' + MINUS + ' ' + BN))}이 모두 수렴하면 두 급수 ${SA}, ${SB}도 모두 수렴한다.`, true, `${nb(AN + ' = ' + frac(1, 1 + p * q) + '{' + par(AN + ' + ' + p + BN) + ' + ' + p + par(q + AN + ' ' + MINUS + ' ' + BN) + '}')}처럼 두 일반항의 결합으로 나타내지므로 급수의 성질에 의하여 참이다.`, 'c'],
        [`${nb(SI(par(AN + ' + ' + p + BN)) + ' = ' + S)}이고 ${nb(LIM(AN) + ' = ' + al)}이면 ${nb(LIM(BN) + ' = ' + tq(Q(-al, p)))}이다.`, true, `일반항 ${nb(AN + ' + ' + p + BN)}이 0으로 가므로 ${nb(LIM(BN) + ' = ' + tq(Q(-al, p)))}이다. 참이다.`, 'd'],
        [`${nb(SI(par(AN + ' + ' + p + BN)) + ' = ' + S)}이고 ${nb(LIM(AN) + ' = ' + al)}이면 ${nb(LIM(BN) + ' = ' + tq(Q(S - al, p)))}이다.`, false, `급수의 합 ${josa(S, '은/는')} 일반항의 극한이 아니다. 일반항이 0으로 가므로 ${nb(LIM(BN) + ' = ' + tq(Q(-al, p)))}이다. 거짓이다.`, 'd'],
        [`${nb(SA + ' = ' + A)}, ${nb(SB + ' = ' + Bv)}이면 ${nb(LIM(AN) + ' &lt; ' + LIM(BN))}이다.`, false, `두 급수가 수렴하므로 ${nb(LIM(AN) + ' = ' + LIM(BN) + ' = 0')}이다. 거짓이다.`, 'e'],
        [`두 수열 ${SEQA}, ${SEQB}이 수렴하고 ${nb(LIM(AN) + ' = ' + LIM(BN))}이면 급수 ${SI(par(AN + ' ' + MINUS + ' ' + BN))}은 수렴한다.`, false, `[반례] ${nb(AN + ' = 1 + ' + frac(1, VN))}, ${nb(BN + ' = 1 ' + MINUS + ' ' + frac(1, VN))}이면 두 극한은 1로 같지만 ${nb(jh(SI(frac(2, VN)), '은/는'))} 발산한다. 거짓이다.`, 'f'],
        [`${nb(LIM(AN) + ' = 0')}이면 급수 ${SA}은 수렴한다.`, false, `[반례] ${nb(AN + ' = ' + frac(1, rt(pn(1, 1)) + ' + ' + rt(VN)))}이면 ${nb(LIM(AN) + ' = 0')}이지만 부분합 ${nb(rt(pn(1, 1)) + ' ' + MINUS + ' 1')}이 한없이 커져 발산한다. 거짓이다.`, 'g'],
        [`두 급수 ${SA}, ${SB}이 모두 수렴하면 ${nb(SI(ms('a_nb_n')) + ' = ' + SA + ' × ' + SB)}이다.`, false, `[반례] ${nb(AN + ' = ' + BN + ' = ' + par(frac(1, 2)) + sup(VN))}이면 ${nb(SI(ms('a_nb_n')) + ' = ' + frac(1, 3))}이지만 ${nb(SA + ' × ' + SB + ' = 1')}이다. 거짓이다.`, 'h'],
        [`두 급수 ${SA}, ${SB}이 모두 발산하면 급수 ${SI(par(AN + ' + ' + BN))}도 발산한다.`, false, `[반례] ${nb(AN + ' = 1')}, ${nb(BN + ' = ' + MINUS + '1')}이면 두 급수는 발산하지만 ${nb(SI(par(AN + ' + ' + BN)) + ' = 0')}이다. 거짓이다.`, 'i'],
        [`급수 ${SA}이 수렴하고 급수 ${SB}이 발산하면 급수 ${SI(par(AN + ' + ' + BN))}은 발산한다.`, true, `${SI(par(AN + ' + ' + BN))}이 수렴한다면 ${nb(BN + ' = ' + par(AN + ' + ' + BN) + ' ' + MINUS + ' ' + AN)}이므로 ${SB}도 수렴하여 모순이다. 참이다.`, 'j']
      ];
      const picked = [];
      for (const row of d.shuffle(pool)) { if (picked.length < 3 && !picked.some((r) => r[3] === row[3])) picked.push(row); }
      const rows = picked.map((r) => [r[0], r[1]]);
      return pickSets(d, `두 수열 ${SEQA}, ${SEQB}에 대하여 옳은 것만을 보기에서 있는 대로 고른 것은?`, rows, {
        explain: picked.map((r, i) => HAN[i] + '. ' + r[2]).join(' ')
      });
    }),
    T('rel-flow', '급수의 수렴·발산 판정 흐름도', '①25', (d, n) => {
      const perm = d.shuffle([0, 1, 2, 3, 4]), ends = perm.map((i) => HAN[i]);   // 끝 i의 이름 = HAN[perm[i]]
      const conv = [true, false, true, false, false];
      const fig = flowChart(ends);
      if (n === 0) {
        const flags = HAN.map((_, j) => conv[perm.indexOf(j)]);
        return pickSets(d, `다음은 급수 ${SI(AN)}의 수렴, 발산을 조사하는 흐름도이다. ㄱ~ㅁ 가운데 「급수가 수렴한다」에 이어지는 것만을 있는 대로 고른 것은?`, HAN.map((h, j) => [h, flags[j]]), {
          figure: fig,
          explain: `등비급수는 첫째항이 0이거나 ${nb(MINUS + '1 &lt; ' + VR + ' &lt; 1')}일 때 수렴한다(${ends[0]}). 등비급수가 아니면 ${nb(LIM(AN) + ' ≠ 0')}일 때 발산하고(${ends[4]}), ${nb(LIM(AN) + ' = 0')}이어도 부분합의 극한이 있을 때만 수렴한다(${ends[2]}). 따라서 ${[ends[0], ends[2]].sort().join(', ')}이다.`
        });
      }
      const r = d.pick([Q(2, 3), Q(-1, 2), Q(1, 3), Q(3, 4), Q(-2, 5)]), big = d.pick([Q(-2), Q(3, 2), Q(3), Q(-4, 3)]);
      const geoH = (x) => SI((x.q === 1 && x.p > 0 ? String(x.p) : par(tq(x))) + sup(VN));
      const pool = [
        [geoH(r), 0, `공비가 ${tq(r)}인 등비급수이고 ${nb(MINUS + '1 &lt; ' + tq(r) + ' &lt; 1')}이다`],
        [geoH(big), 1, `공비가 ${tq(big)}인 등비급수이고 공비의 절댓값이 1보다 작지 않다`],
        [SI(frac(d.pick([1, 2]), d.pick([ms('n(n+1)'), ms('(n+1)(n+2)')]))), 2, `등비급수가 아니고 일반항이 0으로 가며, 부분분수로 나누면 부분합의 극한이 있다`],
        [SI(frac(1, rt(pn(1, 1)) + ' + ' + rt(VN))), 3, `등비급수가 아니고 일반항은 0으로 가지만 부분합 ${nb(rt(pn(1, 1)) + ' ' + MINUS + ' 1')}이 한없이 커진다`],
        [SI(frac(d.int(1, 3) + VN, pn(d.int(2, 4), d.int(1, 3)))), 4, `등비급수가 아니고 일반항의 극한이 0이 아니다`]
      ];
      const [h, at, why] = d.pick(pool);
      const rows = HAN.map((lab) => [lab, lab === ends[at]]);
      return chooseFixed(`다음 흐름도에 따라 급수 ${h}의 수렴, 발산을 조사할 때, 도착하는 곳은?`, rows, {
        figure: fig,
        explain: `${jh(h, '은/는')} ${why}. 따라서 흐름도의 ${ends[at]}에 도착한다.`
      });
    }, { count: 2 }),
    T('rel-mix', '여러 급수 가운데 수렴하는 것 고르기', '①26', (d) => {
      const gens = [
        () => { const a = d.int(1, 3), b = d.int(1, 4), c = d.int(1, 3); return [SI(frac((a === 1 ? '' : a) + ms('n^2') + ' ' + MINUS + ' ' + b + VN, ms('n^2') + ' + ' + c + VN + ' + 1')), false, `일반항의 극한이 ${josa(a, '으로/로')} 0이 아니므로 발산한다`]; },
        () => { const c = d.pick([1, 2]); return [SI(frac(c, ms('(2n-1)(2n+1)'))), true, `${nb(frac(c, 2) + par(frac(1, pn(2, -1)) + ' ' + MINUS + ' ' + frac(1, pn(2, 1))))}의 합이므로 ${tq(Q(c, 2))}에 수렴한다`]; },
        () => { const r = d.pick([-2, -3, 2]); return [SI(par(sT(r)) + sup(VN)), false, `공비가 ${sT(r)}인 등비급수이고 ${nb('|' + sT(r) + '| ≥ 1')}이므로 발산한다${r < 0 ? '(부분합이 진동하며 발산한다)' : ''}`]; },
        () => { const r = d.pick([Q(2, 3), Q(-1, 3), Q(3, 4)]); return [SI(par(tq(r)) + sup(VN)), true, `공비가 ${tq(r)}인 등비급수이므로 수렴한다`]; },
        () => { const c = d.int(2, 3); return [SI(par(frac(pn(c, -1), pn(1, 1)) + ' ' + MINUS + ' ' + frac(pn(c, c - 1), pn(1, 2)))), true, `부분합이 ${nb(frac(c - 1, 2) + ' ' + MINUS + ' ' + frac(pn(c, c - 1), pn(1, 2)))}이므로 ${tq(qsub(Q(c - 1, 2), Q(c)))}에 수렴한다(끝 항은 ${josa(c, '으로/로')} 간다)`]; },
        () => [SI(frac(1, rt(pn(2, 1)) + ' + ' + rt(pn(2, -1)))), false, `유리화하면 부분합이 ${nb(frac(1, 2) + par(rt(pn(2, 1)) + ' ' + MINUS + ' 1'))}이 되어 발산한다(일반항은 0으로 간다)`],
        () => ['1 + ' + frac(1, '1 + 2') + ' + ' + frac(1, '1 + 2 + 3') + ' + ⋯', true, `제${VN}항이 ${nb(frac(2, ms('n(n+1)')))}이므로 2에 수렴한다`],
        () => { const c = d.int(2, 4); return [[1, 2, 3].map((k) => frac(k, c * k - 1)).join(' + ') + ' + ⋯', false, `제${VN}항 ${frac(VN, pn(c, -1))}의 극한이 ${frac(1, c)}로 0이 아니므로 발산한다`]; },
        () => { const a = d.int(4, 7), dd = d.int(2, 3); return [[a, a - dd, a - 2 * dd].map((x) => (x < 0 ? par(sT(x)) : String(x))).join(' + ') + ' + ⋯', false, `공차가 ${MINUS}${dd}인 등차수열의 합이라 일반항이 음의 무한대로 발산하므로 급수도 발산한다`]; }
      ];
      const order = d.shuffle(range(0, gens.length - 1)).slice(0, 4);
      const rows = order.map((i) => gens[i]());
      const k = rows.filter((r) => r[1]).length;
      if (k < 1 || k > 3) return null;
      return pickSets(d, '수렴하는 급수만을 보기에서 있는 대로 고른 것은?', rows.map((r) => [r[0], r[1]]), {
        explain: rows.map((r, i) => HAN[i] + '. ' + r[2] + '.').join(' ')
      });
    })
  ]);

  // ── 급수의 성질 ──
  B.addTypes(UNIT, 'prop', [
    T('prop-lin', 'Σaₙ, Σbₙ의 합으로 일차 결합의 합 구하기', '①27', (d, n) => {
      const A = d.until(() => d.int(-5, 9), (x) => x !== 0), Bv = d.until(() => d.int(-5, 9), (x) => x !== 0 && x !== A);
      const head = `두 급수 ${SI(AN)}, ${SI(BN)}에 대하여 ${nb(SI(AN) + ' = ' + sT(A))}, ${nb(SI(BN) + ' = ' + sT(Bv))}일 때,`;
      if (n === 0) {
        const p = d.until(() => d.int(-6, 6), (x) => x !== 0), q = d.until(() => d.int(-6, 6), (x) => x !== 0);
        const body = par(poly([[p, AN], [q, BN]])), v = Q(p * A + q * Bv);
        return val(`${head} 급수 ${SI(body)}의 합은?`, v, {
          explain: `급수의 성질에 의하여 ${nb(SI(body) + ' = ' + (p === 1 ? '' : p === -1 ? MINUS : sT(p)) + SI(AN) + (q < 0 ? ' ' + MINUS + ' ' : ' + ') + (Math.abs(q) === 1 ? '' : Math.abs(q)) + SI(BN))} = ${nb(sT(p) + ' × ' + (A < 0 ? par(sT(A)) : A) + (q < 0 ? ' ' + MINUS + ' ' : ' + ') + Math.abs(q) + ' × ' + (Bv < 0 ? par(sT(Bv)) : Bv) + ' = ' + sT(p * A + q * Bv))}이다.`,
          facts: { value: `${jn(p)}*${jn(A)}+${jn(q)}*${jn(Bv)}`, derived: [Math.abs(p), Math.abs(q)] }
        });
      }
      const u = d.int(2, 6), w = d.int(2, 8), sg = d.pick([1, -1]);
      if (u === w) return null;
      const v = qadd(Q(A, u), Q(sg * Bv, w));
      if (v.p === 0) return null;
      const body = par(frac(AN, u) + (sg > 0 ? ' + ' : ' ' + MINUS + ' ') + frac(BN, w));
      return val(`${head} 급수 ${SI(body)}의 합은?`, v, {
        explain: `급수의 성질에 의하여 ${nb(SI(body) + ' = ' + frac(1, u) + SI(AN) + (sg > 0 ? ' + ' : ' ' + MINUS + ' ') + frac(1, w) + SI(BN))} = ${nb(frac(sT(A), u) + (sg > 0 ? ' + ' : ' ' + MINUS + ' ') + par(frac(sT(Bv), w)) + ' = ' + tq(v))}이다.`,
        facts: { value: `${jn(A)}/${u}+${jn(sg)}*${jn(Bv)}/${w}` }
      });
    }, { count: 2 }),
    T('prop-sys', '두 결합의 합에서 다른 결합의 합 구하기', '①28', (d) => {
      const p1 = d.int(1, 4), q1 = d.until(() => d.int(-3, 3), (x) => x !== 0), p2 = d.int(1, 3), q2 = d.until(() => d.int(-3, 3), (x) => x !== 0);
      const det = p1 * q2 - p2 * q1;
      if (det === 0) return null;
      const S1 = d.int(-5, 8), S2 = d.int(-5, 8), u = d.until(() => d.int(-2, 3), (x) => x !== 0), w = d.until(() => d.int(-2, 3), (x) => x !== 0);
      if (S1 === 0 || S2 === 0 || (u === p1 && w === q1) || (u === p2 && w === q2)) return null;
      // u aₙ + w bₙ = λ(p1 a + q1 b) + μ(p2 a + q2 b)
      const lam = Q(u * q2 - w * p2, det), mu = Q(p1 * w - q1 * u, det);
      const v = qadd(qmul(lam, Q(S1)), qmul(mu, Q(S2)));
      if (lam.p === 0 || mu.p === 0 || v.p === 0 || v.q > 30 || Math.abs(v.p) > 200) return null;
      const say = d.bool();
      const e1 = par(poly([[p1, AN], [q1, BN]])), e2 = par(poly([[p2, AN], [q2, BN]])), tg = par(poly([[u, AN], [w, BN]]));
      return val(`두 수열 ${SEQA}, ${SEQB}에 대하여 ${say ? `두 급수 ${SI(AN)}, ${jh(SI(BN), '이/가')} 모두 수렴하고 ` : ''}${nb(SI(e1) + ' = ' + sT(S1))}, ${nb(SI(e2) + ' = ' + sT(S2))}일 때, 급수 ${SI(tg)}의 합은?`, v, {
        explain: `${nb(poly([[u, AN], [w, BN]]) + ' = ' + (lam.p === 0 ? '' : cf(lam) + e1) + (mu.p === 0 ? '' : (lam.p === 0 ? (mu.p < 0 ? MINUS : '') : (mu.p < 0 ? ' ' + MINUS + ' ' : ' + ')) + cf(Q(Math.abs(mu.p), mu.q)) + e2))}이므로 급수의 성질에 의하여 합은 ${nb(tq(lam) + ' × ' + (S1 < 0 ? par(sT(S1)) : S1) + (mu.p < 0 ? ' ' + MINUS + ' ' : ' + ') + tq(Q(Math.abs(mu.p), mu.q)) + ' × ' + (S2 < 0 ? par(sT(S2)) : S2) + ' = ' + tq(v))}이다.${say ? '' : ` 두 급수 ${SI(AN)}, ${SI(BN)}의 수렴을 몰라도 주어진 두 급수의 결합으로 셈할 수 있다.`}`,
        facts: { value: `((${u}*${jn(q2)}-${jn(w)}*${p2})*${jn(S1)}+(${p1}*${jn(w)}-${jn(q1)}*${jn(u)})*${jn(S2)})/(${p1}*${jn(q2)}-${p2}*${jn(q1)})`, derived: [p1, p2, Math.abs(q1), Math.abs(q2), Math.abs(u), Math.abs(w)] }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
