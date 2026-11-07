// 고등학교 대수 3단원 수열 — 2. 수열의 합(11-1-6) — 단원 틀·단원 안의 도구와 앞쪽 묶음
// (합의 기호 Σ의 뜻, Σ의 성질, 첨자와 범위). 뒤쪽 묶음(자연수의 거듭제곱의 합, 묶어 더하기, 분수 꼴·근호 꼴·로그 꼴의 합, 활용)은 11-1-6b.js,
// 실력 문항은 11-1-6c.js 에 있다.
// 수집해 둔 천재 T셀파 대수(전인태, 2022 개정)의 교과서·평가 자료에서 뽑은 문제 꼴 목록(기본꼴_1: 54꼴, 심화꼴: 4꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음 / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/11-1-6/싣기_대조표.md 에 있다.
// ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
// 영역은 변화와 관계(수열). 성취기준은 12대수03-04(Σ의 뜻과 성질), 12대수03-05(여러 가지 수열의 합).
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(Σ 식·나열한 합·조건 식·관계식), 묻는 것(값·항의 개수·Σ 꼴의 상수·고르기·n), 계산의 얼개(성질로 가르기, 전개, 지우기)가
//    다르면 따로 싣는다. 같은 꼴에서 수만 바꾼 유형은 만들지 않았다. count 를 둔 유형은 차례마다 주는 것이나 묻는 것이 다르다.
//  - 내신 대비다. 교육과정 해설의 「자연수의 거듭제곱의 합 Σk, Σk², Σk³과 수열의 합이 간단한 것만 다룬다」는 정도를 말하는 줄이라 이것을 까닭으로 꼴을 빼지 않았다.
//    k⁴의 합 공식은 쓰지 않는다(Σk⁴는 풀어 쓰기에만 나온다 — 꼴 목록 ①1).
//  - 답: 값은 정수·분수 칸(음수가 될 수 있는 값에는 모두 부호 단추), 항의 개수·n·m 같은 자연수는 단추 없이 받는다. Σ 꼴로 나타내기는 상수(p, q, m)를 칸마다 받고,
//    공비가 분수인 등비수열처럼 칸으로 받으면 모양이 답을 흘리는 것은 고르기로 낸다. 근호가 든 값은 「[±][ ]√[ ] [±][ ]」처럼 한 유형 안에서 늘 같은 칸으로 받는다.
//  - 원문의 「a + b의 값」처럼 따로 구한 값을 뜻 없이 더한 꼴은 값을 칸마다 묻는다(①38 의 p + q 는 a₁₀ 을 분수 칸으로).
//  - 참·거짓은 손으로 적지 않는다: Σ의 성질을 가리는 문장은 수열 몇 개로 양쪽을 셈해 견주어 가린다. 답은 모두 코드가 셈한다.
//  - 검사 근거: 칸마다 글에 보이는 수로 다시 셈하는 식(facts.calc·value)을 단다. 공식의 2·6, 정사각형의 변 4 처럼 글에 없는 수는 seal 이 facts.unseen 에 밝히고,
//    밝히기로 한 수(derived) 밖의 수가 나오면 오류를 낸다.
//
// 뺀 것과 까닭(11-1-6b.js, 11-1-6c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 같은 과목의 다른 단원 몫: 심4(심08 — 귀납적 정의로 준 수열의 합에서 거꾸로 m)은 11-1-7 이 같은 원문을 꼴로 세웠다. 꼴 목록 머리에 적은 3-1·3-3 문항
//    (교대13 부호 가리기, 기말17·교과서 3-3 마무리09 귀납적 정의의 되풀이 합), 대단원 진단 평가 4번(앞 과목 되짚기)은 처음부터 세지 않았다.
//  - 겹침: 심1(2024학년도 수능 18번 — 두 Σ 조건 연립)은 ①8 과 하는 일이 같아 ①8 의 둘째 차례로 실었다.
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, lines, N, M, C, inline } = B.kit;
  // 분수: 공용 .mb-frac 은 가로줄을 분자 너비로만 그어(align-items:center) 분모가 넓으면(√k + √(k+1), k(k+1)) 줄이 분모 일부에만 걸린다.
  // 이 단원은 분자·분모 칸을 분수 너비로 늘이고 글은 가운데 맞춤으로 둔다(글로 옮긴 모양·토씨 읽기는 공용 frac 과 같다).
  const frac = (n, d) => '<span class="mb-frac" style="align-items:stretch;text-align:center"><span>' + n + '</span><span class="mb-frac-bar">/</span><span>' + d + '</span></span>';
  const { MINUS, gcd, Q, qadd, qsub, qmul, qdiv, isInt, tx, V, sup, nb, tag, nz, rt, sqParts, poly, asQ, tail } = B.kit.mid;
  const { ms, sum, pw, jh, hx, qAns, signed } = B.kit.hs;

  const UNIT = '11-1-6', STD4 = '12대수03-04', STD5 = '12대수03-05';
  const HAN = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ'];

  // ── 검사 근거 마무리 ──
  const stripH = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  // 문항에서 보이는 수(검사와 같은 방법으로 읽는다): 글·그림(그림 설명 포함)·보기. 쌓은 기호의 숨은 글(Σ(k=1~10))도 글로 읽힌다.
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
  const srcOf = (ref) => (/심/.test(ref) && !/①/.test(ref) ? '수집본 심화 자료(' : '수집본 기본 자료(') + ref + ')';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: srcOf(ref), make: retry(make) }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: srcOf(ref), make: retry(make) }, more || {});

  // ── 수와 글 ──
  const jn = (n) => (n < 0 ? '(' + n + ')' : String(n));                       // 검사 식에 적는 정수
  const tq = (x) => tx(asQ(x));                                                  // 정수·유리수의 글(음수는 −)
  const sT = (n) => (n < 0 ? MINUS + Math.abs(n) : String(n));
  const par = (h) => '(' + h + ')';
  const K = V('k'), VN = V('n'), VM = V('m'), VP = V('p'), VQ = V('q'), VC = V('c');
  const kp = (e) => (e === 0 ? '' : e === 1 ? K : K + sup(e));
  // k의 다항식: pk([[계수, 차수], …]) — 적은 차례대로 잇는다(계수 0인 항은 적지 않는다).
  const pk = (cs) => poly(cs.map(([c, e]) => [c, kp(e)]));
  const nk = (cs, v) => poly(cs.map(([c, e]) => [c, e === 0 ? '' : e === 1 ? v : v + sup(e)]));
  const A_ = (i) => ms('a_' + (String(i).length > 1 ? '{' + i + '}' : i));       // aᵢ
  const B_ = (i) => ms('b_' + (String(i).length > 1 ? '{' + i + '}' : i));
  const AK = A_('k'), BK = B_('k'), AN = A_('n'), SEQ = (x) => '{' + x + '}';
  const SEQA = nb('{' + AN + '}');
  // Σ: SK(위끝, 몸, 아래끝) — 아래끝을 주지 않으면 k=1
  const SK = (hi, body, lo) => sum('k=' + (lo == null ? 1 : lo), hi, body);
  // 합의 공식(값과 검사 식)
  const s1 = (n) => n * (n + 1) / 2, s2 = (n) => n * (n + 1) * (2 * n + 1) / 6, s3 = (n) => s1(n) * s1(n);
  const e1 = (n) => `${n}*(${n}+1)/2`, e2 = (n) => `${n}*(${n}+1)*(2*${n}+1)/6`, e3 = (n) => `(${n}*(${n}+1)/2)**2`;
  // Σ_{k=1}^{n} (c0 + c1 k + c2 k² + c3 k³)
  const powSum = (c, n) => (c[0] || 0) * n + (c[1] || 0) * s1(n) + (c[2] || 0) * s2(n) + (c[3] || 0) * s3(n);
  const powExpr = (c, n) => [c[0] ? `${jn(c[0])}*${n}` : '', c[1] ? `${jn(c[1])}*${e1(n)}` : '', c[2] ? `${jn(c[2])}*${e2(n)}` : '', c[3] ? `${jn(c[3])}*${e3(n)}` : ''].filter(Boolean).join('+') || '0';
  // 풀이 글: Σ(c0 + c1 k + c2 k² + c3 k³)을 공식으로 셈한 줄(높은 차수부터)
  function powTold(c, n) {
    const parts = [], vals = [];
    const F1 = frac(`${n} × ${n + 1}`, 2), F2 = frac(`${n} × ${n + 1} × ${2 * n + 1}`, 6);
    const put = (coef, h, v) => { if (!coef) return; const a = Math.abs(coef); parts.push([coef < 0, (a === 1 ? '' : a + ' × ') + h]); vals.push(coef * v); };
    put(c[3] || 0, '(' + F1 + ')' + sup(2), s3(n)); put(c[2] || 0, F2, s2(n)); put(c[1] || 0, F1, s1(n)); put(c[0] || 0, String(n), n);
    if (c[0] && Math.abs(c[0]) === 1) parts[parts.length - 1][1] = String(n);
    const joinS = (list) => list.map(([neg, h], i) => (i === 0 ? (neg ? MINUS : '') + h : (neg ? ' ' + MINUS + ' ' : ' + ') + h)).join('');
    const total = vals.reduce((s, v) => s + v, 0);
    return nb(joinS(parts)) + (vals.length > 1 ? ' = ' + nb(joinS(vals.map((v) => [v < 0, String(Math.abs(v))]))) : '') + ' = ' + sT(total);
  }
  // Σ(다항식)을 성질로 가른 글: c2Σk² + c1Σk + Σc0
  function splitTold(c, n) {
    const parts = [];
    const put = (coef, h) => { if (!coef) return; const a = Math.abs(coef); parts.push([coef < 0, (a === 1 ? '' : a) + h]); };
    put(c[3] || 0, SK(n, kp(3))); put(c[2] || 0, SK(n, kp(2))); put(c[1] || 0, SK(n, K));
    if (c[0]) parts.push([c[0] < 0, SK(n, Math.abs(c[0]))]);
    return parts.map(([neg, h], i) => (i === 0 ? (neg ? MINUS : '') + h : (neg ? ' ' + MINUS + ' ' : ' + ') + h)).join('');
  }
  // 수 글을 + 로 이은 합(음수는 − 로): joinT([1, 5, 9]) → 1 + 5 + 9
  const joinT = (vals) => vals.map((v, i) => (i === 0 ? sT(v) : (v < 0 ? ' ' + MINUS + ' ' : ' + ') + Math.abs(v))).join('');
  // 나열한 합의 줄임 꼴: 앞 세 항 + ⋯ + 끝 항
  const shortSum = (hs) => (hs.length <= 4 ? hs.join(' + ') : hs.slice(0, 3).join(' + ') + ' + ⋯ + ' + hs[hs.length - 1]);
  const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

  // ── 고르기 ──
  // 옳은 것 하나와 나머지를 섞는다. 보기는 [글, 옳은가]이다. 보기가 겹치거나 옳은 보기가 하나가 아니면 null(다시 만든다).
  function choose(d, text, rows, o) {
    const list = d.shuffle(rows), opt = o || {};
    if (new Set(list.map((r) => stripH(r[0]))).size !== list.length || list.filter((r) => r[1]).length !== 1) return null;
    return C(text, list.map((r) => r[0]), list.findIndex((r) => r[1]), Object.assign({}, opt, { facts: Object.assign({ truth: list.map((r) => r[1]), want: true }, opt.facts || {}) }));
  }
  // 「옳은 것만을 있는 대로 고른 것」: 보기 ㄱ, ㄴ, ㄷ …의 참·거짓(flags)으로 고르기 보기를 만든다.
  function pickSets(d, text, rows, o) {
    const flags = rows.map((r) => r[1]), labels = HAN.slice(0, rows.length), right = labels.filter((_, i) => flags[i]);
    if (!right.length || right.length === rows.length) return null;
    const cand = [];
    for (let i = 0; i < rows.length; i += 1) { const s = labels.filter((_, j) => (j === i ? !flags[j] : flags[j])); if (s.length) cand.push(s); }
    for (const s of [labels.slice(), [labels[0]], [labels[1]], [labels[rows.length - 1]]]) if (!cand.some((c) => c.join() === s.join()) && s.join() !== right.join()) cand.push(s);
    const opts = d.shuffle(d.shuffle(cand).slice(0, 4).concat([right]));
    const opt = o || {};
    return C(text, opts.map((s) => s.join(', ')), opts.indexOf(right), Object.assign({}, opt, {
      figure: opt.figure || '<div class="mb-lines">' + rows.map((r, i) => '<div style="padding:0.3em 0">' + tag(labels[i] + '.') + r[0] + '</div>').join('') + '</div>',   // 줄마다 Σ가 있어 위아래 여백을 둔다
      facts: Object.assign({ sets: { labels, flags, options: opts.map((s) => s.slice()) } }, opt.facts || {})
    }));
  }
  // 값 하나(정수·분수): 음수가 될 수 있는 값이라 늘 부호 단추를 단다.
  const val = (text, v, o) => qAns(text, v, Object.assign({ signed: true }, o || {}));
  // 상수 여럿: 칸 앞에 「p =」를 적는다. sign: 부호 단추, dec: 소수 칸
  const consts = (text, rows, o) => M(text, rows.map(([name, v, sign, dec]) => Object.assign({ answer: v, signed: sign !== false, lead: (name.startsWith('<') ? name : V(name)) + ' =' }, dec ? { decimal: true } : {})),
    Object.assign({}, o, { shown: rows.map(([name, v]) => nb(`${name.startsWith('<') ? name : V(name)} = ${typeof v === 'number' ? sT(v) : v}`)).join(', ') }));

  // 조건 식들을 그림 칸에 한 줄씩 놓는다. 쌓은 기호(Σ)는 글줄 위아래로 삐져나오므로(styles.css 의 .mb-op 음수 여백) 두 줄에 걸친 Σ가 서로 겹친다 —
  // 문제 글에는 Σ 덩이를 하나만 두고, 조건은 여기에 줄마다 위아래 여백을 두어 적는다. tags 를 주면 줄 앞에 이름표(㉠ …)를 붙인다.
  const given = (list, tags) => '<div class="mb-lines">' + list.map((h, i) => '<div style="padding:0.3em 0">' + (tags ? tag(tags[i]) : '') + hx(h) + '</div>').join('') + '</div>';

  B.kit.u116 = {
    UNIT, STD4, STD5, HAN, stripH, seal, retry, T, H, jn, tq, sT, par, K, VN, VM, VP, VQ, VC, kp, pk, nk, A_, B_, AK, BK, AN, SEQ, SEQA, SK,
    s1, s2, s3, e1, e2, e3, powSum, powExpr, powTold, splitTold, joinT, shortSum, range, choose, pickSets, val, consts, given, frac
  };

  // ── 단원 틀 ──
  B.addUnit({
    id: '11-1-6', grade: 11, semester: 1, no: 6, title: '수열의 합', version: 1,
    groups: [
      { id: 'sig', title: '합의 기호 Σ의 뜻', standard: STD4, types: [] },
      { id: 'prop', title: 'Σ의 성질', standard: STD4, types: [] },
      { id: 'idx', title: 'Σ의 첨자와 범위 읽기', standard: STD4, types: [] },
      { id: 'pow', title: '자연수의 거듭제곱의 합', standard: STD5, types: [] },
      { id: 'grp', title: '항을 묶어 더하는 합', standard: STD5, types: [] },
      { id: 'frac', title: '분수 꼴의 합', standard: STD5, types: [] },
      { id: 'root', title: '근호 꼴·로그 꼴의 합', standard: STD5, types: [] },
      { id: 'use', title: '여러 가지 수열의 합의 활용', standard: STD5, types: [] }
    ]
  });

  // ── 합의 기호 Σ의 뜻 ──
  B.addTypes(UNIT, 'sig', [
    T('sig-expand', 'Σ를 풀어 나열한 합으로 나타내기', '①1', (d, n) => {
      if (n === 0) {
        // 보기: 맞는 나열, k=0부터 넣은 것, 한 항 모자란 것, 한 항 많은 것, k=2부터 넣은 것
        const kind = d.int(0, 1);
        let g, body;
        if (kind === 0) { const p = d.int(2, 5), q = d.until(() => d.int(-4, 4), (v) => v !== 0 && p + v >= 1); g = (k) => p * k + q; body = par(pk([[p, 1], [q, 0]])); }
        else { const c = d.int(1, 3); g = (k) => k * (k + c); body = K + par(pk([[1, 1], [c, 0]])); }
        const m = d.int(4, 6), good = range(1, m).map(g);
        const rows = [[good, true], [range(0, m - 1).map(g), false], [range(1, m - 1).map(g), false], [range(1, m + 1).map(g), false], [range(2, m + 1).map(g), false]];
        const pickRows = [rows[0]].concat(d.shuffle(rows.slice(1)).slice(0, 3));
        return choose(d, `${jh(SK(m, body), '을/를')} 기호 Σ를 사용하지 않은 합의 꼴로 나타낸 것은?`, pickRows.map(([vals, ok]) => [nb(joinT(vals)), ok]), {
          explain: `${jh(SK(m, body), '은/는')} ${K}에 1, 2, …, ${josa(m, '을/를')} 차례로 넣은 ${m}개의 항의 합이므로 ${nb(joinT(good))}이다.`
        });
      }
      const a = d.int(2, 5), b = a + d.int(5, 12), p = d.int(2, 5), q = d.until(() => d.int(-6, 6), (v) => v !== 0 && p * a + v > 0);
      const body = par(pk([[p, 1], [q, 0]])), cnt = b - a + 1, last = p * b + q;
      return M(`${jh(SK(b, body, a), '을/를')} 기호 Σ를 사용하지 않은 합의 꼴로 나타낼 때, 항의 개수와 마지막 항은?`, [{ label: '항의 개수', answer: cnt, unit: '개' }, { label: '마지막 항', answer: last, signed: true }], {
        shown: `항의 개수 ${cnt}개, 마지막 항 ${sT(last)}`,
        explain: `${K}에 ${a}부터 ${b}까지 넣으므로 항의 개수는 ${nb(`${b} ${MINUS} ${a} + 1 = ${cnt}`)}이고, 마지막 항은 ${nb(`${K} = ${b}`)}일 때의 ${nb(`${p} × ${b} ${q < 0 ? MINUS : '+'} ${Math.abs(q)} = ${sT(last)}`)}이다.`,
        facts: { calc: [[`${b}-${a}+1`, 0], [`${p}*${b}+${jn(q)}`, 1]] }
      });
    }, { count: 2 }),
    T('sig-write', '나열한 합을 Σ로 나타내기', '①2', (d, n) => {
      if (n === 0) {
        // 보기마다 [위끝, 일반항 글, 일반항 값]을 두고, k=1부터 위끝까지 넣은 값의 줄이 주어진 합과 같은 것만 옳다.
        const kind = d.int(0, 3), m = d.int(6, 10);
        let terms, opts, explainBody;
        const str = (f, hi) => range(1, hi).map((k) => { const v = f(k); return typeof v === 'number' ? String(v) : v.p + '/' + v.q; }).join(',');
        if (kind === 0) {
          const a = d.int(1, 3), dd = d.int(2, 4), f = (k) => dd * k + a - dd, L = f(m);
          terms = range(1, m).map((k) => String(f(k)));
          const bodyOf = (u, v) => par(pk([[u, 1], [v, 0]]));
          opts = [[m, bodyOf(dd, a - dd), f], [L, bodyOf(dd, a - dd), f], [m, bodyOf(dd, a), (k) => dd * k + a], [m - 1, bodyOf(dd, a - dd), f]];
          explainBody = `제${K}항은 ${pk([[dd, 1], [a - dd, 0]])}이고 마지막 항 ${josa(L, '은/는')} 제${m}항이다`;
        } else if (kind === 1) {
          terms = range(1, m).map((k) => (k === 1 ? '1' : k + sup(2)));
          opts = [[m, kp(2), (k) => k * k], [m * m, kp(2), (k) => k * k], [m - 1, par(K + ' + 1') + sup(2), (k) => (k + 1) * (k + 1)], [m, '2' + K + ' ' + MINUS + ' 1', (k) => 2 * k - 1]];
          explainBody = `제${K}항은 ${kp(2)}이고 마지막 항 ${m}${sup(2)}은 제${m}항이다`;
        } else if (kind === 2) {
          const b = d.pick([2, 3, 5]);
          terms = range(1, m).map((k) => (k === 1 ? String(b) : b + sup(k)));
          opts = [[m, b + sup(K), (k) => b ** k], [m, b + sup(ms('k-1')), (k) => b ** (k - 1)], [m - 1, b + sup(K), (k) => b ** k], [m + 1, b + sup(ms('k-1')), (k) => b ** (k - 1)]];
          explainBody = `제${K}항은 ${b}${sup(K)}이고 마지막 항 ${b}${sup(m)}은 제${m}항이다`;
        } else {
          terms = range(1, m).map((k) => frac(1, `${k} × ${k + 1}`));
          const fr = (k) => Q(1, k * (k + 1));
          opts = [[m, frac(1, ms('k(k+1)')), fr], [m + 1, frac(1, ms('k(k+1)')), fr], [m, frac(1, ms('k+1')), (k) => Q(1, k + 1)], [m - 1, frac(1, ms('k(k+1)')), fr]];
          explainBody = `제${K}항은 ${frac(1, ms('k(k+1)'))}이고 마지막 항의 분모 ${m} × ${m + 1}에서 이 항은 제${m}항이다`;
        }
        const target = str(opts[0][2], m);
        const rows = opts.map(([hi, body, f]) => [SK(hi, body), str(f, hi) === target]);
        return choose(d, '다음 합을 기호 Σ를 사용하여 나타낸 것은?', rows, {
          figure: hx(shortSum(terms)),
          explain: `${explainBody}. 따라서 ${SK(m, opts[0][1])}이다.`
        });
      }
      const a = d.int(-5, 9), dd = d.int(2, 6), m = d.int(8, 20), L = a + (m - 1) * dd;
      const shown = [a, a + dd, a + 2 * dd].map(sT).concat([sT(L)]);
      return consts(`다음 합은 일반항이 ${nb(AN + ' = ' + VP + VN + ' + ' + VQ)}인 수열 ${SEQA}의 첫째항부터 제${VM}항까지의 합이다. 상수 ${VM}, ${VP}, ${VQ}의 값은?`, [['m', m, false], ['p', dd], ['q', a - dd]], {
        figure: hx(shown.slice(0, 3).join(' + ') + ' + ⋯ + ' + shown[3]),
        explain: `첫째항이 ${sT(a)}, 공차가 ${dd}인 등차수열이므로 ${nb(AN + ' = ' + tq(a) + ' + (' + VN + ' ' + MINUS + ' 1) × ' + dd + ' = ' + nk([[dd, 1], [a - dd, 0]], VN))}이다. ${nb(nk([[dd, 1], [a - dd, 0]], VM) + ' = ' + sT(L))}에서 ${nb(VM + ' = ' + m)}이다.`,
        facts: { calc: [[`(${jn(L)}-${jn(a)})/(${jn(a + dd)}-${jn(a)})+1`, 0], [`${jn(a + dd)}-${jn(a)}`, 1], [`${jn(a)}-(${jn(a + dd)}-${jn(a)})`, 2]] }
      });
    }, { count: 2 }),
    T('sig-seq', '등차수열·등비수열의 합을 Σ로 나타내기', '①3', (d, n) => {
      if (n === 0) {
        const a = nz(d, -12, 20), dd = nz(d, -6, 6), m = d.pick([10, 12, 15, 20]);
        if (a - dd === 0) return null;
        const seq = [a, a + dd, a + 2 * dd, a + 3 * dd].map(sT).join(', ') + ', …';
        return consts(`등차수열 ${seq}의 첫째항부터 제${m}항까지의 합을 ${SK(m, ms('(pk + q)'))} 꼴로 나타낼 때, 상수 ${VP}, ${VQ}의 값은?`, [['p', dd], ['q', a - dd]], {
          explain: `첫째항이 ${sT(a)}, 공차가 ${sT(dd)}이므로 일반항은 ${nb(AN + ' = ' + tq(a) + ' + (' + VN + ' ' + MINUS + ' 1) × ' + (dd < 0 ? '(' + sT(dd) + ')' : dd) + ' = ' + nk([[dd, 1], [a - dd, 0]], VN))}이다. 따라서 합은 ${SK(m, par(pk([[dd, 1], [a - dd, 0]])))}이다.`,
          facts: { calc: [[`${jn(a + dd)}-${jn(a)}`, 0], [`${jn(a)}-(${jn(a + dd)}-${jn(a)})`, 1]] }
        });
      }
      // 등비수열: 보기마다 [위끝, 첫째항의 계수, 공비, 지수가 k − 1 인가]
      const r = d.pick([Q(2), Q(3), Q(-2), Q(1, 2), Q(1, 3), Q(2, 3), Q(3, 2), Q(-1, 2)]), aBase = d.pick([1, 2, 3]), m = d.pick([8, 10, 12]);
      const a = aBase * (r.q === 1 ? 1 : r.q ** 3);
      const term = (k) => qmul(Q(a), qpowQ(r, k - 1));
      const shown = [1, 2, 3, 4].map((k) => tq(term(k))).join(', ') + ', …';
      const rT = r.q === 1 && r.p > 0 ? String(r.p) : '(' + tq(r) + ')';
      const bodyOf = (coef, base, e1st) => (coef === 1 ? '' : coef + ' × ') + base + sup(e1st ? ms('k-1') : K);
      const opts = [[m, a, rT, true], [m, a, rT, false], [m - 1, a, rT, true], [m, a, '(' + tq(qdiv(Q(1), r)) + ')', true]];
      if (a !== 1) opts.push([m, 1, rT, true]);
      const vals = (hi, coef, base, e1st) => { const rr = base === rT ? r : qdiv(Q(1), r); return range(1, hi).map((k) => { const v = qmul(Q(coef), qpowQ(rr, e1st ? k - 1 : k)); return v.p + '/' + v.q; }).join(','); };
      const target = vals(m, a, rT, true);
      const rows = opts.map(([hi, coef, base, e1st]) => [SK(hi, bodyOf(coef, base, e1st)), vals(hi, coef, base, e1st) === target]);
      return choose(d, `등비수열 ${shown}의 첫째항부터 제${m}항까지의 합을 기호 Σ를 사용하여 나타낸 것은?`, d.shuffle(rows).slice(0, 4).concat(rows.filter((x) => x[1])).filter((x, i, all) => all.indexOf(x) === i), {
        explain: `첫째항이 ${tq(Q(a))}, 공비가 ${tq(r)}이므로 일반항은 ${nb(AN + ' = ' + bodyOf(a, rT, true).replace(K, VN))}이다. 따라서 합은 ${SK(m, bodyOf(a, rT, true))}이다.`
      });
    }, { count: 2 }),
    T('sig-cond', '조건에 맞는 수의 합을 Σ로 나타내기', '①4', (d) => {
      const L = d.pick([50, 60, 80, 100, 120, 150, 200]), dd = d.int(3, 9), kind = d.int(0, 1), r = kind ? d.int(1, dd - 1) : 0;
      const m = Math.floor((L - r) / dd) + (kind ? 1 : 0), last = kind ? r + (m - 1) * dd : m * dd;
      const what = kind ? `${josa(dd, '으로/로')} 나눈 나머지가 ${r}인 수` : `${dd}의 배수`;
      const first = kind ? r : dd;
      return consts(`${L} 이하의 자연수 중에서 ${what}의 합을 ${SK('m', ms('(pk + q)'))} 꼴로 나타낼 때, 상수 ${VM}, ${VP}, ${VQ}의 값은?`, [['m', m, false], ['p', dd], ['q', kind ? r - dd : 0]], {
        explain: `${what}를 작은 것부터 늘어놓으면 ${first}, ${first + dd}, ${first + 2 * dd}, …, ${last}이다. 첫째항이 ${first}, 공차가 ${dd}이므로 제${K}항은 ${pk([[dd, 1], [kind ? r - dd : 0, 0]])}이고, 마지막 항 ${josa(last, '은/는')} 제${m}항이다. 따라서 ${SK(m, par(pk([[dd, 1], [kind ? r - dd : 0, 0]])))}이다.`,
        facts: { calc: kind ? [[`(${L}-${r}-(${L}-${r})%${dd})/${dd}+1`, 0], [`${dd}`, 1], [`${r}-${dd}`, 2]] : [[`(${L}-${L}%${dd})/${dd}`, 0], [`${dd}`, 1], ['0', 2]], derived: [r, dd] }
      });
    }),
    T('sig-real', '상황을 일반항으로 세워 Σ로 나타내기', '①5', (d) => {
      const m = d.int(6, 9), D = d.pick([11, 12, 13, 14, 16, 17, 18, 19]);
      const A = d.until(() => d.int(120, 230), (x) => (4 * (x + D)) % 10 !== 0 && x + D < 250 && x - (m - 1) * D >= 20);
      const a = A / 10, dd = D / 10, p = -(4 * D) / 10, q = (4 * (A + D)) / 10;
      return consts(`돌을 쌓아 만든 ${m}층 탑 모형이 있다. 각 층의 바닥 면은 정사각형이고, 1층 바닥 면의 한 변의 길이는 ${a} cm이며 한 층 올라갈 때마다 한 변의 길이가 ${dd} cm씩 줄어든다. 1층부터 ${m}층까지 바닥 면의 둘레의 길이의 합을 ${SK(m, ms('(pk + q)'))} cm 꼴로 나타낼 때, 상수 ${VP}, ${VQ}의 값은?`,
        [['p', p, true, true], ['q', q, true, true]], {
          explain: `${K}층 바닥 면의 한 변의 길이는 ${nb(`${a} ${MINUS} (${K} ${MINUS} 1) × ${dd} = ${String(-dd).replace('-', MINUS)}${K} + ${(A + D) / 10}`)} (cm)이므로 둘레의 길이는 ${nb(`4 × (${String(-dd).replace('-', MINUS)}${K} + ${(A + D) / 10}) = ${String(p).replace('-', MINUS)}${K} + ${q}`)} (cm)이다. 따라서 ${nb(VP + ' = ' + String(p).replace('-', MINUS))}, ${nb(VQ + ' = ' + q)}이다.`,
          facts: { calc: [[`0-4*${dd}`, 0], [`4*(${a}+${dd})`, 1]], derived: [4] }
        });
    })
  ]);

  // 유리수의 거듭제곱(지수는 0 이상의 정수)
  function qpowQ(x, e) { let out = Q(1); for (let i = 0; i < e; i += 1) out = qmul(out, x); return out; }

  // ── Σ의 성질 ──
  B.addTypes(UNIT, 'prop', [
    T('prop-lin', 'Σa_k, Σb_k의 값으로 일차식의 Σ 구하기', '①6', (d, n) => {
      const m = d.int(6, 15), A = nz(d, -20, 30), Bv = nz(d, -20, 30);
      if (n === 0) {
        const p = nz(d, -4, 5), q = nz(d, -4, 5), c = nz(d, -6, 6), v = p * A + q * Bv + c * m;
        const body = par(poly([[p, AK], [q, BK], [c, '']]));
        return val(`두 수열 ${SEQA}, ${nb('{' + ms('b_n') + '}')}이 다음을 만족시킬 때, ${SK(m, body)}의 값은?`, v, {
          figure: given([`${SK(m, AK)} = ${sT(A)}`, `${SK(m, BK)} = ${sT(Bv)}`]),
          explain: `${SK(m, body)} = ${nb(poly([[p, SK(m, AK)], [q, SK(m, BK)]]))} ${c < 0 ? MINUS : '+'} ${SK(m, Math.abs(c))}이다. 상수 ${Math.abs(c)}의 합은 ${Math.abs(c)} × ${m}이므로 ${nb(`${sT(p)} × ${A < 0 ? '(' + sT(A) + ')' : A} + ${q < 0 ? '(' + sT(q) + ')' : q} × ${Bv < 0 ? '(' + sT(Bv) + ')' : Bv} + ${c < 0 ? '(' + sT(c) + ')' : c} × ${m} = ${sT(v)}`)}이다.`,
          facts: { value: `${jn(p)}*${jn(A)}+${jn(q)}*${jn(Bv)}+${jn(c)}*${m}` }
        });
      }
      if (d.bool()) {
        // Σ(p a_k + b_k) − Σ(q b_k + c)
        const p = d.int(2, 5), q = d.int(2, 4), c = d.int(2, 7), v = p * A + Bv - q * Bv - c * m;
        const b1 = par(poly([[p, AK], [1, BK]])), b2 = par(poly([[q, BK], [c, '']]));
        return val(`두 수열 ${SEQA}, ${nb('{' + ms('b_n') + '}')}이 다음을 만족시킬 때, ${nb(SK(m, b1) + ' ' + MINUS + ' ' + SK(m, b2))}의 값은?`, v, {
          figure: given([`${SK(m, AK)} = ${sT(A)}`, `${SK(m, BK)} = ${sT(Bv)}`]),
          explain: `두 식을 하나로 모으면 ${SK(m, par(poly([[p, AK], [1 - q, BK], [-c, '']])))}이므로 ${nb(`${p} × ${A < 0 ? '(' + sT(A) + ')' : A} ${MINUS} ${q - 1} × ${Bv < 0 ? '(' + sT(Bv) + ')' : Bv} ${MINUS} ${c} × ${m} = ${sT(v)}`)}이다.`,
          facts: { value: `${p}*${jn(A)}+${jn(Bv)}-${q}*${jn(Bv)}-${c}*${m}` }
        });
      }
      // Σ(p a_k + c1) + Σ(q a_k + c2) — Σa_k 하나만 준다
      const p = d.int(2, 6), q = d.int(-5, -1), c1 = d.int(1, 7), c2 = nz(d, -5, 5), v = (p + q) * A + (c1 + c2) * m;
      if (p + q === 0) return null;
      const b1 = par(poly([[p, AK], [c1, '']])), b2 = par(poly([[q, AK], [c2, '']]));
      return val(`수열 ${SEQA}이 다음을 만족시킬 때, ${nb(SK(m, b1) + ' + ' + SK(m, b2))}의 값은?`, v, {
        figure: given([`${SK(m, AK)} = ${sT(A)}`]),
        explain: `두 식을 하나로 모으면 ${SK(m, par(poly([[p + q, AK], [c1 + c2, '']])))}이므로 ${nb(`${sT(p + q)} × ${A < 0 ? '(' + sT(A) + ')' : A} + ${c1 + c2 < 0 ? '(' + sT(c1 + c2) + ')' : c1 + c2} × ${m} = ${sT(v)}`)}이다.`,
        facts: { value: `(${p}+${jn(q)})*${jn(A)}+(${c1}+${jn(c2)})*${m}` }
      });
    }, { count: 2 }),
    T('prop-back', 'Σ의 값에서 거꾸로 Σa_k나 상수 구하기', '①7', (d, n) => {
      if (n === 0) {
        const m = d.int(6, 14), A = nz(d, -20, 40), p = d.pick([-1, 2, 3]), c = d.int(2, 9), V0 = p * A + c * m, Bv = nz(d, -20, 40), s = d.int(2, 3), v = s * Bv - A;
        const b1 = p === -1 ? par(c + ' ' + MINUS + ' ' + AK) : par(poly([[p, AK], [c, '']]));
        const b2 = par(poly([[s, BK], [-1, AK]]));
        return val(`두 수열 ${SEQA}, ${nb('{' + ms('b_n') + '}')}이 다음을 만족시킬 때, ${SK(m, b2)}의 값은?`, v, {
          figure: given([`${SK(m, b1)} = ${sT(V0)}`, `${SK(m, BK)} = ${sT(Bv)}`]),
          explain: `${SK(m, b1)} = ${p === -1 ? `${c} × ${m} ${MINUS} ${SK(m, AK)}` : `${p}${SK(m, AK)} + ${c} × ${m}`} = ${sT(V0)}에서 ${nb(SK(m, AK) + ' = ' + sT(A))}이다. 따라서 ${nb(`${s} × ${Bv < 0 ? '(' + sT(Bv) + ')' : Bv} ${MINUS} ${A < 0 ? '(' + sT(A) + ')' : A} = ${sT(v)}`)}이다.`,
          facts: { value: `${s}*${jn(Bv)}-(${jn(V0)}-${c}*${m})/${jn(p)}` }
        });
      }
      const m = d.int(8, 20), c = nz(d, -6, 9), t = d.int(2, 30), A = m + t, V0 = c * t;
      return val(`수열 ${SEQA}과 상수 ${VC}가 다음을 만족시킬 때, ${VC}의 값은?`, c, {
        figure: given([`${SK(m, AK)} = ${A}`, `${SK(m, ms('ca_k'))} = ${sT(V0)} + ${SK(m, VC)}`]),
        explain: `${nb(SK(m, ms('ca_k')) + ' = ' + VC + SK(m, AK) + ' = ' + A + VC)}, ${nb(SK(m, VC) + ' = ' + m + VC)}이므로 ${nb(A + VC + ' = ' + sT(V0) + ' + ' + m + VC)}에서 ${nb(t + VC + ' = ' + sT(V0))}, ${nb(VC + ' = ' + sT(c))}이다.`,
        facts: { value: `${jn(V0)}/(${A}-${m})` }
      });
    }, { count: 2 }),
    T('prop-sys', '두 Σ 조건을 연립하기', '①8 심1', (d, n) => {
      if (n === 0) {
        const m = d.int(6, 12), A = d.int(-12, 25), Bv = d.int(-12, 25), p = d.int(2, 4), U = A + p * Bv, W = Bv - A;
        if (W === 0 || U === 0 || A + Bv === 0) return null;
        return val(`두 수열 ${SEQA}, ${nb('{' + ms('b_n') + '}')}이 다음을 만족시킬 때, ${SK(m, par(AK + ' + ' + BK))}의 값은?`, A + Bv, {
          figure: given([`${SK(m, par(poly([[1, AK], [p, BK]])))} = ${sT(U)}`, `${SK(m, par(poly([[1, BK], [-1, AK]])))} = ${sT(W)}`]),
          explain: `${nb(SK(m, AK) + ' = ' + V('x'))}, ${nb(SK(m, BK) + ' = ' + V('y'))}라 하면 ${nb(poly([[1, V('x')], [p, V('y')]]) + ' = ' + sT(U))}, ${nb(V('y') + ' ' + MINUS + ' ' + V('x') + ' = ' + sT(W))}이다. 연립하여 풀면 ${nb(V('x') + ' = ' + sT(A))}, ${nb(V('y') + ' = ' + sT(Bv))}이므로 구하는 값은 ${sT(A + Bv)}이다.`,
          facts: { value: `2*(${jn(U)}+${jn(W)})/(1+${p})-${jn(W)}` }
        });
      }
      // 2024학년도 수능 18번 꼴: Σa_k = Σ(p b_k − q), Σ(r a_k + b_k) = U
      const m = d.pick([8, 10, 12]), Bv = d.int(-6, 20), p = d.int(2, 3), q = d.int(1, 3), r = d.int(2, 4), A = p * Bv - q * m, U = r * A + Bv;
      if (U === 0) return null;
      return val(`두 수열 ${SEQA}, ${nb('{' + ms('b_n') + '}')}이 다음을 만족시킬 때, ${SK(m, BK)}의 값은?`, Bv, {
        figure: given([`${SK(m, AK)} = ${SK(m, par(poly([[p, BK], [-q, '']])))}`, `${SK(m, par(poly([[r, AK], [1, BK]])))} = ${sT(U)}`]),
        explain: `${nb(SK(m, AK) + ' = ' + V('x'))}, ${nb(SK(m, BK) + ' = ' + V('y'))}라 하면 상수 ${q}의 합은 ${q} × ${m}이므로 ${nb(V('x') + ' = ' + p + V('y') + ' ' + MINUS + ' ' + q * m)}, ${nb(r + V('x') + ' + ' + V('y') + ' = ' + sT(U))}이다. 연립하여 풀면 ${nb(V('y') + ' = ' + sT(Bv))}이다.`,
        facts: { value: `(${jn(U)}+${r}*${q}*${m})/(${r}*${p}+1)` }
      });
    }, { count: 2 }),
    T('prop-sq', 'Σa_k, Σa_k²으로 제곱식의 Σ 구하기', '①9', (d, n) => {
      const m = d.int(7, 12);
      if (n === 0) {
        const A = d.int(-8, 15), A2 = d.int(Math.ceil((A * A) / m) + 2, Math.ceil((A * A) / m) + 40), p = d.int(2, 3), q = nz(d, -3, 3), v = p * p * A2 + 2 * p * q * A + q * q * m;
        const body = par(poly([[p, AK], [q, '']])) + sup(2);
        return val(`수열 ${SEQA}이 다음을 만족시킬 때, ${SK(m, body)}의 값은?`, v, {
          figure: given([`${SK(m, AK)} = ${sT(A)}`, `${SK(m, ms('a_k^2'))} = ${A2}`]),
          explain: `${nb(body + ' = ' + poly([[p * p, ms('a_k^2')], [2 * p * q, AK], [q * q, '']]))}이므로 ${nb(`${p * p} × ${A2} ${2 * p * q < 0 ? MINUS : '+'} ${Math.abs(2 * p * q)} × ${A < 0 ? '(' + sT(A) + ')' : A} + ${q * q} × ${m} = ${sT(v)}`)}이다. 상수 ${q * q}의 합은 ${q * q} × ${m}이다.`,
          facts: { value: `${p}*${p}*${A2}+2*${p}*${jn(q)}*${jn(A)}+${jn(q)}*${jn(q)}*${m}` }
        });
      }
      if (n === 1) {
        const P = d.int(20, 120), R = d.int(10, 120);
        if (P === R) return null;
        return val(`두 수열 ${SEQA}, ${nb('{' + ms('b_n') + '}')}이 다음을 만족시킬 때, ${SK(m, ms('(a_k + b_k)(a_k - b_k)'))}의 값은?`, P - R, {
          figure: given([`${SK(m, ms('a_k^2'))} = ${P}`, `${SK(m, ms('b_k^2'))} = ${R}`]),
          explain: `${nb(ms('(a_k + b_k)(a_k - b_k) = a_k^2 - b_k^2'))}이므로 ${nb(`${P} ${MINUS} ${R} = ${sT(P - R)}`)}이다.`,
          facts: { value: `${P}-${R}` }
        });
      }
      const R = d.int(5, 40), P = 4 * R + d.int(4, 80);
      return val(`두 수열 ${SEQA}, ${nb('{' + ms('b_n') + '}')}이 다음을 만족시킬 때, ${SK(m, ms('(a_k - b_k)^2'))}의 값은?`, P - 4 * R, {
        figure: given([`${SK(m, ms('(a_k + b_k)^2'))} = ${P}`, `${SK(m, ms('a_kb_k'))} = ${R}`]),
        explain: `${nb(ms('(a_k - b_k)^2 = (a_k + b_k)^2 - 4a_kb_k'))}이므로 ${nb(`${P} ${MINUS} 4 × ${R} = ${P - 4 * R}`)}이다.`,
        facts: { value: `${P}-4*${R}`, derived: [4] }
      });
    }, { count: 3 }),
    T('prop-solve', '이차식의 Σ 두 개로 Σa_k, Σa_k² 구하기', '①10', (d, n) => {
      const m = d.int(5, 9), S1 = d.int(-6, 12), S2 = d.int(Math.ceil((S1 * S1) / m) + 2, Math.ceil((S1 * S1) / m) + 30);
      if (n === 0) {
        const p = d.int(2, 3), q = d.int(2, 5), U = p * p * S2 - 2 * p * S1 + m, W = S2 - q * S1;
        return val(`수열 ${SEQA}이 다음을 만족시킬 때, ${SK(m, AK)}의 값은?`, S1, {
          figure: given([`${SK(m, par(poly([[p, AK], [-1, '']])) + sup(2))} = ${U}`, `${SK(m, AK + par(poly([[1, AK], [-q, '']])))} = ${sT(W)}`]),
          explain: `${nb(SK(m, ms('a_k^2')) + ' = ' + V('x'))}, ${nb(SK(m, AK) + ' = ' + V('y'))}라 하면 첫째 식에서 ${nb(`${p * p}${V('x')} ${MINUS} ${2 * p}${V('y')} + ${m} = ${U}`)}, 둘째 식에서 ${nb(`${V('x')} ${MINUS} ${q}${V('y')} = ${sT(W)}`)}이다. 연립하여 풀면 ${nb(V('x') + ' = ' + S2)}, ${nb(V('y') + ' = ' + sT(S1))}이다.`,
          facts: { value: `(${U}-${m}-${p}*${p}*${jn(W)})/(${p}*${p}*${q}-2*${p})` }
        });
      }
      const U = S2 + S1, W = S2 + 2 * S1 + m, v = S2 - S1;
      return val(`수열 ${SEQA}이 다음을 만족시킬 때, ${SK(m, ms('a_k(a_k - 1)'))}의 값은?`, v, {
        figure: given([`${SK(m, ms('a_k(a_k + 1)'))} = ${U}`, `${SK(m, ms('(a_k + 1)^2'))} = ${W}`]),
        explain: `${nb(SK(m, ms('a_k^2')) + ' = ' + V('x'))}, ${nb(SK(m, AK) + ' = ' + V('y'))}라 하면 ${nb(`${V('x')} + ${V('y')} = ${U}`)}, ${nb(`${V('x')} + 2${V('y')} + ${m} = ${W}`)}이므로 ${nb(V('y') + ' = ' + sT(S1))}, ${nb(V('x') + ' = ' + S2)}이다. 따라서 ${nb(`${V('x')} ${MINUS} ${V('y')} = ${sT(v)}`)}이다.`,
        facts: { value: `3*${U}-2*${W}+2*${m}`, derived: [3] }
      });
    }, { count: 2 }),
    T('prop-not', 'Σa_kb_k와 (Σa_k)(Σb_k) — Σ의 성질이 아닌 것', '①11', (d, n) => {
      if (n === 0) {
        const m = d.int(4, 6), kind = d.int(0, 1), c = d.int(2, 5);
        const a = (k) => (kind === 0 ? c : k), b = (k) => k;
        const X = range(1, m).reduce((s, k) => s + a(k) * b(k), 0), Y = range(1, m).reduce((s, k) => s + a(k), 0) * range(1, m).reduce((s, k) => s + b(k), 0);
        const aT = kind === 0 ? String(c) : VN;
        return M(`두 수열 ${SEQA}, ${nb('{' + ms('b_n') + '}')}의 일반항이 ${nb(AN + ' = ' + aT)}, ${nb(ms('b_n = n'))}일 때, 다음 ㉠, ㉡의 값은?`, [{ label: '㉠', answer: X }, { label: '㉡', answer: Y }], {
          figure: given([SK(m, ms('a_kb_k')), par(SK(m, AK)) + par(SK(m, BK))], ['㉠', '㉡']),
          shown: `${X}, ${Y}`,
          explain: `${nb(SK(m, ms('a_kb_k')) + ' = ' + SK(m, kind === 0 ? c + K : kp(2)) + ' = ' + X)}이고 ${nb(SK(m, AK) + ' = ' + range(1, m).reduce((s, k) => s + a(k), 0))}, ${nb(SK(m, BK) + ' = ' + s1(m))}이므로 곱은 ${Y}이다. 두 값이 다르므로 ${nb(SK('n', ms('a_kb_k')) + ' = ' + par(SK('n', AK)) + par(SK('n', BK)))}는 항상 성립하지는 않는다.`,
          facts: { calc: kind === 0 ? [[`${c}*${e1(m)}`, 0], [`${c}*${m}*${e1(m)}`, 1]] : [[e2(m), 0], [`(${e1(m)})*(${e1(m)})`, 1]], derived: [6] }
        });
      }
      // 등식마다 수열 몇 개로 양쪽을 셈해 견준다(모두 같으면 옳다).
      const tests = [[3, 1, 4, 1, 5], [2, 7, 1, 8, 2], [5, -2, 0, 3, 1]], other = [[1, 2, 3, 4, 5], [2, 2, 1, 3, 4], [1, 4, 2, 2, 3]];
      const S = (xs) => xs.reduce((s, x) => s + x, 0), cst = 3, nn = 5;
      const pool = [
        [`${SK('n', ms('(a_k + b_k)'))} = ${SK('n', AK)} + ${SK('n', BK)}`, (x, y) => S(x.map((v, i) => v + y[i])) === S(x) + S(y)],
        [`${SK('n', ms('ca_k'))} = ${VC}${SK('n', AK)} (단, ${VC}는 상수)`, (x) => S(x.map((v) => cst * v)) === cst * S(x)],
        [`${SK('n', VC)} = ${VC}${VN} (단, ${VC}는 상수)`, () => cst * nn === cst * nn],
        [`${SK('n', ms('(a_k - b_k)'))} = ${SK('n', AK)} ${MINUS} ${SK('n', BK)}`, (x, y) => S(x.map((v, i) => v - y[i])) === S(x) - S(y)],
        [`${SK('n', ms('a_kb_k'))} = ${par(SK('n', AK))}${par(SK('n', BK))}`, (x, y) => S(x.map((v, i) => v * y[i])) === S(x) * S(y)],
        [`${SK('n', ms('a_k^2'))} = ${par(SK('n', AK))}${sup(2)}`, (x) => S(x.map((v) => v * v)) === S(x) * S(x)],
        [`${SK('n', VC)} = ${VC} (단, ${VC}는 상수)`, () => cst * nn === cst],
        [`${SK('n', ms('(a_k + c)'))} = ${SK('n', AK)} + ${VC} (단, ${VC}는 상수)`, (x) => S(x.map((v) => v + cst)) === S(x) + cst]
      ].map(([h, f]) => [h, tests.every((x, i) => f(x, other[i]))]);
      const goods = pool.filter((r) => r[1]), bads = pool.filter((r) => !r[1]), g = d.int(1, 2);
      const rows = d.shuffle(d.shuffle(goods).slice(0, g).concat(d.shuffle(bads).slice(0, 3 - g)));
      return pickSets(d, `두 수열 ${SEQA}, ${nb('{' + ms('b_n') + '}')}에 대하여 다음 가운데 항상 옳은 것만을 있는 대로 고른 것은?`, rows, {
        explain: rows.map((r, i) => `${HAN[i]}. ${r[1] ? '옳다' : '옳지 않다'}`).join(', ') + `. 합의 기호 Σ는 합과 차, 상수배에서만 나누어 쓸 수 있고, 곱·제곱·몫은 나누어 쓸 수 없다. 상수 ${VC}의 합 ${SK('n', VC)}는 ${VC}를 ${VN}번 더한 ${VC}${VN}이다.`
      });
    }, { count: 2 }),
    T('prop-recip', '분수식을 주어진 Σ로 바꾸어 구하기', '①12', (d) => {
      const p = d.int(1, 4), c = d.int(1, 3), m = d.int(6, 12), v = (c + 1) * (m * m + p * m) - m;
      const rhs = nb(VN + sup(2) + ' + ' + (p === 1 ? '' : p) + VN);
      return val(`수열 ${SEQA}이 모든 자연수 ${VN}에 대하여 다음을 만족시킬 때, ${SK(m, frac(c + ' ' + MINUS + ' ' + AK, ms('1 + a_k')))}의 값은?`, v, {
        figure: given([`${SK('n', frac(1, ms('1 + a_k')))} = ${rhs}`]),
        explain: `${nb(frac(c + ' ' + MINUS + ' ' + AK, ms('1 + a_k')) + ' = ' + frac(c + 1 + ' ' + MINUS + ' (1 + ' + AK + ')', ms('1 + a_k')) + ' = ' + frac(c + 1, ms('1 + a_k')) + ' ' + MINUS + ' 1')}이므로 ${nb(`${c + 1} × (${m}${sup(2)} + ${p === 1 ? '' : p + ' × '}${m}) ${MINUS} ${m} = ${v}`)}이다.`,
        facts: { value: `(${c}+1)*(${m}*${m}+${p}*${m})-${m}` }
      });
    }),
    T('prop-count', '각 항이 몇 가지 값일 때 개수를 미지수로 풀기', '①13', (d, n) => {
      if (n === 0) {
        const u = d.pick([1, 2]), v = d.pick([3, 4, 5]), x = d.int(2, 9), y = d.int(2, 12), S = u * y + v * x, Tt = u * u * y + v * v * x, m = x + y;
        return N(`수열 ${SEQA}의 각 항은 ${u} 또는 ${v}이고, 자연수 ${VM}에 대하여 다음이 성립할 때, ${VM}의 값은?`, m, {
          figure: given([`${SK('m', AK)} = ${S}`, `${SK('m', ms('a_k^2'))} = ${Tt}`]),
          explain: `${v}인 항이 ${V('x')}개라 하면 ${u}인 항은 ${nb(VM + ' ' + MINUS + ' ' + V('x'))}개이다. ${nb(`${u === 1 ? '' : u}(${VM} ${MINUS} ${V('x')}) + ${v}${V('x')} = ${S}`)}, ${nb(`${u === 1 ? '' : u * u}(${VM} ${MINUS} ${V('x')}) + ${v * v}${V('x')} = ${Tt}`)}${tail(Tt, '을/를')} 연립하여 풀면 ${nb(V('x') + ' = ' + x)}, ${nb(VM + ' = ' + m)}이다.`,
          facts: { value: `(${Tt}-${u}*${S})/(${v}*${v}-${u}*${v})+(${S}-${v}*(${Tt}-${u}*${S})/(${v}*${v}-${u}*${v}))/${u}` }
        });
      }
      const c = d.pick([2, 3]), x = d.int(2, 9), y = d.int(2, 8), S = x + c * y, Tt = x + c * c * y, v = x + c ** 3 * y;
      return N(`수열 ${SEQA}의 각 항은 0, 1, ${c} 가운데 하나이고, 어떤 자연수 ${VM}에 대하여 다음이 성립할 때, ${SK('m', ms('a_k^3'))}의 값은?`, v, {
        figure: given([`${SK('m', AK)} = ${S}`, `${SK('m', ms('a_k^2'))} = ${Tt}`]),
        explain: `1인 항이 ${V('x')}개, ${c}인 항이 ${V('y')}개라 하면 0인 항은 어느 합에도 보태지지 않으므로 ${nb(`${V('x')} + ${c}${V('y')} = ${S}`)}, ${nb(`${V('x')} + ${c * c}${V('y')} = ${Tt}`)}이다. 연립하면 ${nb(V('x') + ' = ' + x)}, ${nb(V('y') + ' = ' + y)}이므로 ${nb(`${x} × 1 + ${y} × ${c}${sup(3)} = ${v}`)}이다.`,
        facts: { value: `${S}-${c}*(${Tt}-${S})/(${c}*${c}-${c})+${c}*${c}*${c}*(${Tt}-${S})/(${c}*${c}-${c})` }
      });
    }, { count: 2 }),
    T('prop-nested', '아래끝이 다른 Σ 여럿을 하나로 모으기', '①14', (d) => {
      const m = d.int(5, 7), V0 = d.int(40, 200), c = nz(d, -6, 8), v = V0 + c * m;
      const eq = SK(m, AK) + ' + ' + SK(m, AK, 2) + ' + ⋯ + ' + SK(m, AK, m) + ' = ' + V0;   // 휴대폰 너비에서 한 줄에 들도록 앞의 두 합과 끝의 합만 적는다
      return val(`수열 ${SEQA}에 대하여 다음 등식이 성립할 때, ${SK(m, par(poly([[1, ms('ka_k')], [c, '']])))}의 값은?`, v, {
        figure: hx(eq),
        explain: `좌변을 풀어 쓰면 ${AK}는 ${K}번 더해지므로 좌변은 ${nb(`${A_(1)} + 2${A_(2)} + 3${A_(3)} + ⋯ + ${m}${A_(m)} = ${SK(m, ms('ka_k'))}`)}이다. 따라서 ${nb(`${V0} ${c < 0 ? MINUS : '+'} ${Math.abs(c)} × ${m} = ${sT(v)}`)}이다.`,
        facts: { value: `${V0}+${jn(c)}*${m}` }
      });
    })
  ]);

  // ── Σ의 첨자와 범위 읽기 ──
  B.addTypes(UNIT, 'idx', [
    T('idx-oddeven', '홀수째 항·짝수째 항의 Σ를 모으기', '①15', (d, n) => {
      if (n === 0) {
        const L = d.int(5, 10), P = nz(d, -20, 60), R = nz(d, -20, 60);
        return val(`수열 ${SEQA}이 다음을 만족시킬 때, ${SK(2 * L, AK)}의 값은?`, P + R, {
          figure: given([`${SK(L, A_('2k-1'))} = ${sT(P)}`, `${SK(L, A_('2k'))} = ${sT(R)}`]),
          explain: `${SK(L, A_('2k-1'))}은 ${nb(`${A_(1)} + ${A_(3)} + ⋯ + ${A_(2 * L - 1)}`)}, ${SK(L, A_('2k'))}는 ${nb(`${A_(2)} + ${A_(4)} + ⋯ + ${A_(2 * L)}`)}이므로 두 합을 더하면 ${SK(2 * L, AK)}이다. 따라서 ${nb(`${sT(P)} + ${R < 0 ? '(' + sT(R) + ')' : R} = ${sT(P + R)}`)}이다.`,
          facts: { value: `${jn(P)}+${jn(R)}` }
        });
      }
      if (n === 1) {
        const L = d.int(6, 12), P = nz(d, -20, 60), p = d.int(2, 5), c = nz(d, -6, 6), v = p * P + c * 2 * L;
        return val(`수열 ${SEQA}이 다음을 만족시킬 때, ${SK(2 * L, par(poly([[p, AK], [c, '']])))}의 값은?`, v, {
          figure: given([`${SK(L, par(A_('2k-1') + ' + ' + A_('2k')))} = ${sT(P)}`]),
          explain: `${nb(SK(L, par(A_('2k-1') + ' + ' + A_('2k'))) + ' = (' + A_(1) + ' + ' + A_(2) + ') + ⋯ + (' + A_(2 * L - 1) + ' + ' + A_(2 * L) + ') = ' + SK(2 * L, AK))}이므로 ${nb(SK(2 * L, AK) + ' = ' + sT(P))}이다. 따라서 ${nb(`${p} × ${P < 0 ? '(' + sT(P) + ')' : P} ${c < 0 ? MINUS : '+'} ${Math.abs(c)} × ${2 * L} = ${sT(v)}`)}이다.`,
          facts: { value: `${p}*${jn(P)}+${jn(c)}*${2 * L}` }
        });
      }
      const p = d.int(1, 3), q = nz(d, -3, 4), i = d.int(2, 6), j = d.int(i + 4, Math.min(i + 12, 20)), f = (t) => p * t * t + q * t, v = f(j) - f(i);
      const rhs = nk([[p, 2], [q, 1]], VN);
      return val(`수열 ${SEQA}이 모든 자연수 ${VN}에 대하여 다음을 만족시킬 때, ${SK(2 * j, AK, 2 * i + 1)}의 값은?`, v, {
        figure: given([`${SK('n', par(A_('2k-1') + ' + ' + A_('2k')))} = ${rhs}`]),
        explain: `좌변은 ${SK('2n', AK)}이므로 ${nb(SK('2n', AK) + ' = ' + rhs)}이다. ${nb(SK(2 * j, AK, 2 * i + 1) + ' = ' + SK(2 * j, AK) + ' ' + MINUS + ' ' + SK(2 * i, AK))}이고, 앞의 것은 ${nb(VN + ' = ' + j)}, 뒤의 것은 ${nb(VN + ' = ' + i)}일 때이므로 ${nb(`${f(j)} ${MINUS} ${f(i) < 0 ? '(' + sT(f(i)) + ')' : f(i)} = ${sT(v)}`)}이다.`,
        facts: { value: `${p}*(${2 * j}/2)**2+${jn(q)}*${2 * j}/2-(${p}*((${2 * i + 1}-1)/2)**2+${jn(q)}*(${2 * i + 1}-1)/2)` }
      });
    }, { count: 3 }),
    T('idx-tele', '차의 Σ — 가운데가 지워져 끝항만 남는 것', '①16', (d, n) => {
      if (n === 0) {
        const p = d.int(1, 3), L = d.int(10, 20), u = d.int(-20, 40), w = d.int(-20, 90);
        if (u === w) return null;
        const hi = A_(p === 1 ? 'k+1' : 'k+' + p), lo = A_(p === 1 ? 'k' : 'k+' + (p - 1));
        return val(`수열 ${SEQA}에서 ${nb(A_(p) + ' = ' + sT(u))}, ${nb(A_(L + p) + ' = ' + sT(w))}일 때, 다음 식의 값은?`, w - u, {
          figure: given([SK(L, hi) + ' ' + MINUS + ' ' + SK(L, lo)]),
          explain: `${nb(SK(L, hi) + ' = ' + A_(p + 1) + ' + ' + A_(p + 2) + ' + ⋯ + ' + A_(L + p))}, ${nb(SK(L, lo) + ' = ' + A_(p) + ' + ' + A_(p + 1) + ' + ⋯ + ' + A_(L + p - 1))}이므로 차는 ${nb(A_(L + p) + ' ' + MINUS + ' ' + A_(p) + ' = ' + sT(w) + ' ' + MINUS + ' ' + (u < 0 ? '(' + sT(u) + ')' : u) + ' = ' + sT(w - u))}이다.`,
          facts: { value: `${jn(w)}-${jn(u)}` }
        });
      }
      const c = d.int(1, 5), r = d.int(1, 3), Nn = d.int(10, 30), v = qadd(Q(c), Q(Nn - 1, Nn - 1 + r));
      return val(`수열 ${SEQA}에서 ${nb(A_(1) + ' = ' + c)}이고, 모든 자연수 ${VN}에 대하여 다음이 성립할 때, ${A_(Nn)}의 값은?`, v, {
        figure: given([SK('n', par(A_('k+1') + ' ' + MINUS + ' ' + AK)) + ' = ' + frac(VN, VN + ' + ' + r)]),
        explain: `좌변을 풀어 쓰면 ${nb('(' + A_(2) + ' ' + MINUS + ' ' + A_(1) + ') + (' + A_(3) + ' ' + MINUS + ' ' + A_(2) + ') + ⋯ + (' + ms('a_{n+1}') + ' ' + MINUS + ' ' + AN + ') = ' + ms('a_{n+1}') + ' ' + MINUS + ' ' + A_(1))}이다. ${nb(VN + ' = ' + (Nn - 1))}${tail(Nn - 1, '을/를')} 넣으면 ${nb(A_(Nn) + ' = ' + c + ' + ' + frac(Nn - 1, Nn - 1 + r) + ' = ' + tq(v))}이다.`,
        facts: { value: `${c}+(${Nn}-1)/(${Nn}-1+${r})` }
      });
    }, { count: 2 }),
    T('idx-range', '범위가 다른 두 Σ의 차로 n 구하기', '①17', (d) => {
      const c = d.pick([2, 4, 6, 8, 10]), nn = d.int(5, 12), F = (t) => 2 * t * t + (6 - c) * t + 14 + 3 * c, V0 = F(nn);
      const hits = range(4, 200).filter((t) => F(t) === V0);
      if (hits.length !== 1) return null;
      return N(`다음 등식을 만족시키는 자연수 ${VN}의 값은? (단, ${nb(VN + ' ≥ 4')})`, nn, {
        figure: given([SK('n', ms('(k + 2)^2')) + ' ' + MINUS + ' ' + SK('n', par(kp(2) + ' + ' + c), 4) + ' = ' + V0]),
        explain: `앞의 합은 ${nb(`3${sup(2)} + 4${sup(2)} + ⋯ + ${ms('(n+2)^2')}`)}, 뒤의 합은 ${nb(`(4${sup(2)} + ⋯ + ${VN}${sup(2)}) + ${c} × (${VN} ${MINUS} 3)`)}이므로 차는 ${nb(`9 + ${ms('(n+1)^2')} + ${ms('(n+2)^2')} ${MINUS} ${c}(${VN} ${MINUS} 3)`)} = ${nb(nk([[2, 2], [6 - c, 1], [14 + 3 * c, 0]], VN))}이다. 이것이 ${josa(V0, '이/가')} 되는 자연수는 ${nb(VN + ' = ' + nn)}이다.`,
        facts: { value: `((${c}-6)+((6-${c})**2-8*(14+3*${c}-${V0}))**0.5)/4`, derived: [3, 4, 6, 8, 14, 0.5] }
      });
    }),
    T('idx-arith', '등차수열의 Σ 조건으로 항 구하기', '①18', (d) => {
      const r = d.int(6, 10), t0 = d.int(3, r - 2), a = d.int(-15, 15), dd = nz(d, -4, 5), L = d.int(9, 19), tt = d.int(10, 20);
      if (L + 1 === 2 * (r - 1) || tt === r) return null;
      const e = a + (r - 1) * dd, V0 = 2 * a * L + dd * L * (L + 1), v = a + (tt - 1) * dd;
      if (e === 0 || V0 === 0) return null;
      return val(`등차수열 ${SEQA}이 ${nb(A_(r - t0) + ' + ' + A_(r + t0) + ' = ' + A_(r) + (e < 0 ? ' ' + MINUS + ' ' + Math.abs(e) : ' + ' + e))}, ${jh(SK(L, par(AK + ' + ' + A_('k+2'))) + ' = ' + sT(V0), '을/를')} 만족시킬 때, ${A_(tt)}의 값은?`, v, {
        explain: `${nb(A_(r - t0) + ' + ' + A_(r + t0) + ' = 2' + A_(r))}이므로 ${nb(A_(r) + ' = ' + sT(e))}이다. 첫째항을 ${V('a')}, 공차를 ${V('d')}라 하면 ${nb(AK + ' + ' + A_('k+2') + ' = 2' + V('a') + ' + 2' + V('d') + K)}이므로 ${nb(`2${V('a')} × ${L} + 2${V('d')} × ${frac(`${L} × ${L + 1}`, 2)} = ${sT(V0)}`)}이다. ${nb(V('a') + ' + ' + (r - 1) + V('d') + ' = ' + sT(e))}${tail(Math.abs(e), '과/와')} 연립하면 ${nb(V('a') + ' = ' + sT(a))}, ${nb(V('d') + ' = ' + sT(dd))}이므로 ${nb(A_(tt) + ' = ' + sT(v))}이다.`,
        facts: { value: `${jn(e)}+(${tt}-${r})*(${jn(V0)}-2*${L}*${jn(e)})/(${L}*(${L}+1)-2*${L}*(${r}-1))` }
      });
    }),
    T('idx-arsum', '등차수열의 합을 Σ로 적은 것 읽기', '①19', (d, n) => {
      const a = nz(d, -20, 40), dd = nz(d, -5, 5);
      if (n === 0) {
        const m = d.int(10, 20), v = m * (2 * a + (m - 1) * dd) / 2;
        return val(`첫째항이 ${sT(a)}, 공차가 ${sT(dd)}인 등차수열 ${SEQA}에 대하여 ${SK(m, AK)}의 값은?`, v, {
          explain: `${SK(m, AK)}는 첫째항부터 제${m}항까지의 합이므로 ${nb(frac(`${m}{2 × ${a < 0 ? '(' + sT(a) + ')' : a} + ${m - 1} × ${dd < 0 ? '(' + sT(dd) + ')' : dd}}`, 2) + ' = ' + sT(v))}이다.`,
          facts: { value: `${m}*(2*${jn(a)}+(${m}-1)*${jn(dd)})/2` }
        });
      }
      // 두 항을 주고 제s항부터 제t항까지의 합
      const s = d.int(3, 8), t = d.int(s + 5, 20), p = d.int(2, 6), q = d.int(p + 3, p + 9), as = a + (s - 1) * dd, at = a + (t - 1) * dd, v = (t - s + 1) * (as + at) / 2;
      if (!Number.isInteger(v) || p === s || q === t) return null;
      const ap = a + (p - 1) * dd, aq = a + (q - 1) * dd;
      return val(`등차수열 ${SEQA}에서 ${nb(A_(p) + ' = ' + sT(ap))}, ${nb(A_(q) + ' = ' + sT(aq))}일 때, ${SK(t, AK, s)}의 값은?`, v, {
        explain: `공차는 ${nb(frac(`${sT(aq)} ${MINUS} ${ap < 0 ? '(' + sT(ap) + ')' : ap}`, `${q} ${MINUS} ${p}`) + ' = ' + sT(dd))}이다. ${SK(t, AK, s)}는 제${s}항부터 제${t}항까지 ${t - s + 1}개 항의 합이고 ${nb(A_(s) + ' = ' + sT(as))}, ${nb(A_(t) + ' = ' + sT(at))}이므로 ${nb(frac(`${t - s + 1} × (${sT(as)} + ${at < 0 ? '(' + sT(at) + ')' : at})`, 2) + ' = ' + sT(v))}이다.`,
        facts: { value: `(${t}-${s}+1)*(2*${jn(ap)}+(${s}-${p}+${t}-${p})*(${jn(aq)}-${jn(ap)})/(${q}-${p}))/2` }
      });
    }, { count: 2 }),
    T('idx-geo-odd', '등비수열의 홀수째 항의 Σ', '①20', (d, n) => {
      if (n === 0) {
        const q = d.pick([2, 3]), Mv = d.int(2, 12), j = d.int(3, 5), L = d.int(4, q === 2 ? 7 : 5), v = Mv * (q ** L - 1) / (q - 1);
        if (v > 9999) return null;
        const P = Mv * Mv, R = Mv * (1 + q), lo = j + 1, hi = j + L;
        return N(`모든 항이 양수인 등비수열 ${SEQA}에 대하여 ${nb(A_(2 * j) + A_(2 * j + 2) + ' = ' + P)}, ${nb(A_(2 * j + 1) + ' + ' + A_(2 * j + 3) + ' = ' + R)}일 때, ${SK(hi, A_('2k-1'), lo)}의 값은?`, v, {
          explain: `${nb(A_(2 * j) + A_(2 * j + 2) + ' = ' + A_(2 * j + 1) + sup(2))}이고 모든 항이 양수이므로 ${nb(A_(2 * j + 1) + ' = ' + Mv)}이다. 공비를 ${V('r')}이라 하면 ${nb(`${Mv} + ${Mv}${V('r')}${sup(2)} = ${R}`)}에서 ${nb(V('r') + sup(2) + ' = ' + q)}이다. ${jh(SK(hi, A_('2k-1'), lo), '은/는')} ${A_(2 * j + 1)}부터 공비가 ${V('r')}${sup(2)}인 ${L}개 항의 합이므로 ${nb(frac(`${Mv}(${q}${sup(L)} ${MINUS} 1)`, `${q} ${MINUS} 1`) + ' = ' + v)}이다.`,
          facts: { value: `(${P})**0.5*((${R}/(${P})**0.5-1)**(${hi}-${lo}+1)-1)/(${R}/(${P})**0.5-2)`, derived: [0.5] }
        });
      }
      if (n === 1) {
        const r = d.pick([2, 3, -2]), L = d.int(3, 5), t = nz(d, -40, 60) * 1, V0 = (r + 1) * t, odd = d.bool(), v = odd ? t : r * t;
        if (Math.abs(V0) > 9999 || Math.abs(v) > 9999) return null;
        return val(`공비가 ${sT(r)}인 등비수열 ${SEQA}이 다음을 만족시킬 때, ${SK(L, odd ? A_('2k-1') : A_('2k'))}의 값은?`, v, {
          figure: given([`${SK(2 * L, AK)} = ${sT(V0)}`]),
          explain: `${nb(A_('2k') + ' = ' + sT(r) + A_('2k-1'))}이므로 ${nb(SK(2 * L, AK) + ' = ' + SK(L, par(A_('2k-1') + ' + ' + A_('2k'))) + ' = (1 + ' + (r < 0 ? '(' + sT(r) + ')' : r) + ')' + SK(L, A_('2k-1')))}이다. 따라서 ${nb(SK(L, A_('2k-1')) + ' = ' + sT(t))}${odd ? '' : `이고 ${nb(SK(L, A_('2k')) + ' = ' + sT(r) + ' × ' + (t < 0 ? '(' + sT(t) + ')' : t) + ' = ' + sT(v))}`}이다.`,
          facts: { value: odd ? `${jn(V0)}/(${jn(r)}+1)` : `${jn(r)}*${jn(V0)}/(${jn(r)}+1)` }
        });
      }
      const q = d.pick([2, 3]), t1 = d.int(1, 6), i = d.pick([3, 5]), j = i + 4, L = d.int(5, q === 2 ? 9 : 6), v = t1 * (q ** L - 1) / (q - 1);
      if (v > 9999) return null;
      const Aa = t1 * q ** ((i - 1) / 2), Bb = t1 * q ** ((j - 1) / 2);
      return N(`모든 항이 양수인 등비수열 ${SEQA}에 대하여 ${nb(A_(i) + ' = ' + Aa)}, ${nb(A_(j) + ' = ' + Bb)}일 때, ${SK(L, A_('2k-1'))}의 값은?`, v, {
        explain: `공비를 ${V('r')}이라 하면 ${nb(A_(j) + ' = ' + A_(i) + V('r') + sup(4))}이므로 ${nb(V('r') + sup(4) + ' = ' + q * q)}, ${nb(V('r') + sup(2) + ' = ' + q)}이다. ${nb(A_(1) + ' = ' + t1)}이고 ${A_('2k-1')}은 공비가 ${q}인 등비수열이므로 ${nb(frac(`${t1 === 1 ? '' : t1}(${q}${sup(L)} ${MINUS} 1)`, `${q} ${MINUS} 1`) + ' = ' + v)}이다.`,
        facts: { value: `${Aa}/((${Bb}/${Aa})**0.5)**((${i}-1)/2)*((${Bb}/${Aa})**(${L}/2)-1)/((${Bb}/${Aa})**0.5-1)`, derived: [0.5, 4] }
      });
    }, { count: 3 })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
