// 고등학교 2학년 미적분Ⅰ Ⅲ-1 부정적분과 정적분 — 단원 틀·도구와 앞쪽 묶음(부정적분의 뜻, 다항함수의 부정적분, 정적분의 뜻과 미적분의 기본정리).
// 수집해 둔 천재 T셀파 미적분Ⅰ(홍진곤, 2022 개정) 한 종의 교과서·평가 자료에서 뽑은 문제 꼴 목록(기본꼴_1: 51꼴, 심화 문서 없음)을
// 꼴마다 따져서 실었다. 꼴마다 「실음(유형 이름) / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는
// references/textbooks/수학/_분석/11-2-6/싣기_대조표.md 에 있다.
// (정적분으로 정의된 함수와 정적분의 계산은 11-2-6b.js 에, 실력 문항은 11-2-6c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번.
// 성취기준: 12미적Ⅰ-03-01(부정적분의 뜻), 12미적Ⅰ-03-02(다항함수의 부정적분), 12미적Ⅰ-03-03(정적분의 개념과 성질),
//           12미적Ⅰ-03-04(부정적분과 정적분의 관계, 다항함수의 정적분).
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(식·그래프·조건), 묻는 것(함수식·함숫값·상수·고르기), 셈의 얼개(미분해서 되찾기, 적분해서 적분상수 정하기,
//    정적분을 상수로 놓기, 구간 잇기, 절댓값 나누기)가 다르면 따로 싣는다. 수만 바꾼 유형은 만들지 않는다.
//  - 교육과정 원문에 내용을 못 박은 「다루지 않는다」는 없다. 「지나치게 복잡한 계산」을 까닭으로 수집본의 꼴을 빼지 않고 어려운 것은 실력에 싣는다.
//  - 1단계 보고에 대해 정한 것: 곡선과 x축 사이의 넓이(①34~37, ①44의 넓이 변형)와 역함수의 정적분(①51)은 11-2-7 「정적분의 활용」 몫이라 뺀다.
//    넓이로 정적분 값 구하기(①17·①19)는 ①32와 같은 일이라 빼고, 그래프로만 주는 ①20은 싣는다. 분수 꼴 두 부정적분을 합치는 ①9는 실력에 싣는다.
//    ①5·①25는 F′ = f 를 쓰거나 정적분을 F(x) − F(a)로 바꿔 푸는 꼴만 싣는다. 문항 글에 「피적분함수·위끝·아래끝·미적분의 기본정리」를 쓰지 않는다.
//  - 답: 함숫값·상수·정적분의 값은 부호 단추가 붙은 수 칸(분수 답은 분자·분모 칸 — 크기가 같은 분수도 맞게 친다), 함수식·부정적분은 항마다
//    「[±][ ]x³ [±][ ]x² …」로 끼워 넣는 칸(+ C 는 칸 밖에 적어 둔다)으로 받는다. 칸의 모양이 답을 흘리지 않게, 한 유형 안에서는 늘 같은 차수의 항이
//    모두 0이 아니게 수를 고른다(계수가 분수가 되는 꼴은 계수가 정수가 되게 수를 고르거나 분자·분모 칸을 둔다). 넓이(①20)만 단추 없이 받는다.
//    원문의 「a + b의 값」「f(2) + a의 값」처럼 따로 구한 값을 뜻 없이 더한 꼴은 값을 칸마다 따로 받는다.
//  - 그림: 고2 공용 plot 으로 꺾은선 그래프(①20), 부정적분 F의 그래프(①30), 도함수의 그래프(①13·①31)를 그린다.
//  - 답은 모두 코드가 유리수로 셈한다. 검사 근거는 문제에 적힌 수로 다시 셈하는 식(facts.value·calc)이고, 차수에서 나오는 작은 수(적분할 때 나누는 수 따위)는
//    seal 이 facts.unseen 에 밝힌다. 고르기의 참·거짓은 손으로 적지 않고 다항식을 미분·적분해 견주어 가린다.
//
// 뺀 것과 까닭(11-2-6b.js, 11-2-6c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 11-2-7 「정적분의 활용」 몫(조정 결정): ①34·①35·①36·①37(곡선과 x축 사이의 넓이), ①44 안의 「|x³ − x²|의 그래프와 x축 사이의 넓이」(교점10), ①51(역함수의 정적분).
//  - ①32와 같은 일(조정 결정): ①17(f ≥ 0인 일차함수의 정적분을 넓이로), ①19(음의 값을 갖는 일차함수의 정적분).
//  - 그림을 알 수 없는 것: ①20 안의 기초력 02-4⑴(답만 남아 있다).
//  - 겹침: ①18(넓이로 준 정적분 값에서 미지수 — 정적분 등식의 미지 상수 calc-unknown 과 같은 일), ①6 안의 최소 성취 2(미분 결과가 문제 글에 그대로 있어
//    답이 보인다 — 뜻은 indef-pick·indef-diff 가 묻는다), ①40 안의 소3-3(함수가 다른 두 정적분의 끝만 뒤집기 — def-reverse 와 def-ftc 의 셈).
//  - 서술형만으로 묻는 부분: 교과서 생각 넓히기의 까닭 쓰기(126쪽 — 고르기로 바꿔 실음), 139쪽의 증명(참·거짓 고르기로 바꿔 실음), 143쪽 넓이로 설명하기,
//    135쪽 생각 열기(넓이 함수 S(x)로 정적분과 미분의 관계 알아보기 — 활동), 129쪽 적분상수 C₁, C₂, C₃을 C 하나로 묶는 과정 빈칸.
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, N, M, C, inline } = B.kit;
  const { MINUS, Q, fl, tx, nb, js, V, sup, poly, gcd, claimQ } = B.kit.mid;
  const MQ = B.kit.mid;
  const { ms, intg, evl, lim, jh, qAns, plot, hx } = B.kit.hs;
  const S1 = '12미적Ⅰ-03-01', S2 = '12미적Ⅰ-03-02', S3 = '12미적Ⅰ-03-03', S4 = '12미적Ⅰ-03-04';

  // ── 검사 근거 마무리 ──
  // 문항에서 보이는 수(검사와 같은 방법으로 읽는다): 글·그림(그림 설명 포함)·보기
  const stripH = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  function visibleNumbers(item) {
    const seen = stripH([item.text, item.figure || ''].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, ' $1 ').replace(/<table[^>]*aria-label="([^"]*)"[^>]*>/g, ' $1 | '));
    return new Set((seen.match(/\d+/g) || []).concat(seen.match(/\d+\.\d+/g) || [], seen.replace(/(\d) (?=\d)/g, '$1').match(/\d+/g) || []));
  }
  // 다시 셈하는 식의 수 가운데 글에 보이지 않는 수를 facts.unseen 에 밝힌다. 10 이하의 수(차수에서 나오는 나누는 수, 지수)와 o.derived 로 밝힌 수만 된다.
  function seal(item) {
    // 셈이 0으로 끝나는 식은 −0이 될 수 있다. 검사는 −0과 0을 가르므로 +0 을 붙여 0으로 맞춘다.
    if (item.facts && item.facts.calc) item.facts.calc = item.facts.calc.map(([t, i]) => [`(${t})+0`, i]);
    const f = item.facts || {}, derived = new Set((f.derived || []).map(Number)), shown = visibleNumbers(item), out = new Set(f.unseen || []);
    const exprs = (f.calc || []).map(([t]) => t).concat(f.value !== undefined ? [f.value] : []);
    for (const t of exprs) for (const n of String(t).match(/\d+(?:\.\d+)?/g) || []) {
      if (shown.has(n)) continue;
      if (!(Number(n) <= 10) && !derived.has(Number(n))) throw new Error('검사 식의 수 ' + n + ' 이 글에도 밝힌 수에도 없다: ' + t);
      out.add(Number(n));
    }
    delete f.derived;
    if (out.size) f.unseen = [...out]; else delete f.unseen;
    item.facts = f;
    return item;
  }
  // 만들기가 null 을 돌려주면(조건에 맞지 않는 수) 다시 만든다. 다 만든 문항은 seal 로 검사 근거를 마무리한다.
  const retry = (make) => (d, n) => { for (let i = 0; i < 3000; i += 1) { const item = make(d, n); if (item) return seal(item); } throw new Error('조건에 맞는 문항을 만들지 못했다'); };
  const sourceOf = (ref) => '수집본 기본 자료(' + ref + ')';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: sourceOf(ref), make: retry(make) }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: sourceOf(ref), make: retry(make) }, more || {});

  // ── 유리수 ──
  const q = (x) => (typeof x === 'number' ? Q(x) : x);
  // 수와 유리수를 섞어 셈한다(공용 qadd 따위는 유리수만 받는다).
  const qadd = (a, b) => MQ.qadd(q(a), q(b)), qsub = (a, b) => MQ.qsub(q(a), q(b)), qmul = (a, b) => MQ.qmul(q(a), q(b)), qdiv = (a, b) => MQ.qdiv(q(a), q(b));
  const qn = (x) => fl(q(x));
  const qeq = (a, b) => { const x = q(a), y = q(b); return x.p * y.q === y.p * x.q; };
  const qpw = (x, n) => { let r = Q(1); for (let i = 0; i < n; i += 1) r = qmul(r, q(x)); return r; };
  const isI = (x) => q(x).q === 1;
  const J = (x) => js(q(x));                                                   // 검사 식에 적는 수((-3), (1/3))
  const iq = (x) => tx(q(x));                                                  // 화면에 적는 수(음수는 −, 분수는 분수 꼴)

  // ── 다항식(오름차순 계수의 배열 — 수나 유리수) ──
  const PQ = (a) => a.map(q);
  const ptrim = (a) => { const o = PQ(a); while (o.length > 1 && o[o.length - 1].p === 0) o.pop(); return o; };
  const padd = (a, b) => ptrim(Array.from({ length: Math.max(a.length, b.length) }, (_, i) => qadd(q(a[i] || 0), q(b[i] || 0))));
  const pscale = (a, k) => ptrim(a.map((c) => qmul(q(c), q(k))));
  const psub = (a, b) => padd(a, pscale(b, -1));
  const pmul = (a, b) => { const o = Array.from({ length: a.length + b.length - 1 }, () => Q(0)); a.forEach((x, i) => b.forEach((y, j) => { o[i + j] = qadd(o[i + j], qmul(q(x), q(y))); })); return ptrim(o); };
  const pder = (a) => (a.length < 2 ? [Q(0)] : ptrim(a.slice(1).map((c, i) => qmul(q(c), Q(i + 1)))));
  const pint = (a) => ptrim([Q(0)].concat(a.map((c, i) => qdiv(q(c), Q(i + 1)))));
  const pval = (a, x) => a.reduce((s, c, i) => qadd(s, qmul(q(c), qpw(x, i))), Q(0));
  const pdef = (a, lo, hi) => { const P = pint(a); return qsub(pval(P, hi), pval(P, lo)); };
  const pequal = (a, b) => { const x = ptrim(a), y = ptrim(b); return x.length === y.length && x.every((c, i) => qeq(c, y[i])); };
  const coef = (a, i) => q(a[i] || 0);
  const deg = (a) => ptrim(a).length - 1;
  // 화면 글
  const X = V('x'), Tt = V('t'), Cc = V('C');
  const pw2 = (v, i) => (i === 0 ? '' : v + (i > 1 ? sup(i) : ''));
  const ptx = (a, v) => poly(PQ(a).map((c, i) => [c, pw2(v || X, i)]).reverse());   // 다항식(내림차순)
  const pp = (a, v) => '(' + ptx(a, v) + ')';                                         // 괄호로 묶은 다항식
  const lin = (a, b, v) => ptx([b, a], v);                                            // ax + b
  const plusC = (h) => h + ' + ' + Cc;
  const fx = (name, arg) => V(name || 'f') + '(' + (arg == null ? X : typeof arg === 'string' ? arg : iq(arg)) + ')';
  const FX = fx('f'), GX = fx('g'), FCX = fx('F');
  const fp = (name, arg) => V(name || 'f') + '′(' + (arg == null ? X : typeof arg === 'string' ? arg : iq(arg)) + ')';
  // 「왼쪽 = 오른쪽」: 짧은 식은 줄이 갈리지 않게 묶고, 긴 식(휴대폰 너비를 넘을 수 있는 것)은 묶지 않는다.
  const is = (l, r) => { const h = `${l} = ${typeof r === 'string' ? r : iq(r)}`; return stripH(h).length > 22 ? h : nb(h); };
  const DDX = frac(V('d'), V('d') + X);                                               // d/dx
  const CN = `(단, ${jh(Cc, '은/는')} 적분상수이다.)`;
  const ind = (body) => intg(null, null, body, 'x');                                   // ∫ … dx
  const dfi = (lo, hi, body, v) => intg(lo, hi, body, v || 'x');                       // ∫(lo~hi) … dx
  // 검사 식: 다항식의 값 c0 + c1*(x) + …, 정적분 Σ c·(hi^(k+1) − lo^(k+1))/(k+1)
  const pvalJ = (a, xs) => PQ(a).map((c, i) => (c.p === 0 ? null : i === 0 ? J(c) : `${J(c)}*${xs}${i > 1 ? '**' + i : ''}`)).filter(Boolean).join('+') || '0';
  const pdefJ = (a, lo, hi) => PQ(a).map((c, i) => (c.p === 0 ? null : `${J(c)}*(${J(hi)}**${i + 1}-${J(lo)}**${i + 1})/${i + 1}`)).filter(Boolean).join('+') || '0';
  // 정적분을 한 줄로 셈해 보이는 풀이 글: ∫(lo~hi) f dx = [F(x)](lo~hi) = 값
  const evlTold = (a, lo, hi, v) => `${dfi(lo, hi, pp(a, v ? V(v) : X), v)} = ${evl(ptx(pint(a), v ? V(v) : X), lo, hi)} = ${iq(pdef(a, lo, hi))}`;

  // ── 답 ──
  // 수 하나(부호 단추가 붙는다 — 정수는 수 칸, 분수는 분자·분모 칸)
  const num = (text, v, o) => qAns(text, q(v), Object.assign({ signed: true }, o));
  // 넓이처럼 늘 양수인 수(단추 없이)
  const pos = (text, v, o) => qAns(text, q(v), o);
  // 문자의 값 여럿: 「a = [±][ ]  b = [±][ ]」(정수)
  const vals = (text, pairs, o) => M(text, pairs.map(([lead, answer]) => ({ lead: lead + ' =', answer, signed: true })), Object.assign({}, o, { shown: pairs.map(([lead, answer]) => is(lead, answer)).join(', ') }));
  // 다항식 답: 차수 ks 의 항마다 「[±][ ]x^k」 칸(계수는 0이 아닌 정수). lead 는 「f(x) =」 같은 앞 글, withC 면 끝에 + C.
  function pAns(text, lead, a, ks, withC, o) {
    const cs = ks.map((k) => coef(a, k));
    if (cs.some((c) => c.p === 0 || c.q !== 1) || deg(a) !== ks[0] || PQ(a).some((c, i) => c.p !== 0 && !ks.includes(i))) throw new Error('다항식 답의 칸과 계수가 맞지 않는다');
    const tail = withC ? ' + ' + Cc : '';
    return inline(text, (lead ? lead + ' ' : '') + ks.map((k, i) => '{' + i + '}' + pw2(X, k)).join(' ') + tail, cs.map((c) => ({ answer: c.p, signed: true })),
      Object.assign({}, o, { shown: (lead ? lead + ' ' : '') + ptx(a) + tail }));
  }
  // ㄱ, ㄴ, ㄷ 가운데 옳은 것을 「있는 대로 고른 것」: 보기 다섯(정답 포함). flags 는 하나 이상 참.
  const GA = ['ㄱ', 'ㄴ', 'ㄷ'];
  const COMBOS = [[0], [1], [2], [0, 1], [0, 2], [1, 2], [0, 1, 2]];
  function comboPick(d, text, list, flags, explain, more) {
    const right = [0, 1, 2].filter((i) => flags[i]);
    if (!right.length) return null;
    const key = (c) => c.join(','), others = d.shuffle(COMBOS.filter((c) => key(c) !== key(right))).slice(0, 4);
    const rows = others.concat([right]).sort((u, v) => u.length - v.length || key(u).localeCompare(key(v)));
    return C(text, rows.map((c) => c.map((i) => GA[i]).join(', ')), rows.findIndex((c) => key(c) === key(right)), Object.assign({ figure: lines(list.map((h, i) => `<b>${GA[i]}.</b> ${h}`)), explain, facts: { truth: rows.map((c) => key(c) === key(right)), want: true } }, more || {}));
  }
  // 고르기(보기 글과 참·거짓): 참인 것이 하나뿐이어야 한다.
  function pickOne(d, text, rows, o) {
    const list = d.shuffle(rows), at = list.findIndex((r) => r[1]);
    if (list.filter((r) => r[1]).length !== 1 || new Set(list.map((r) => stripH(r[0]))).size !== list.length) return null;
    return C(text, list.map((r) => r[0]), at, Object.assign({}, o, { facts: { truth: list.map((r) => r[1]), want: true } }));
  }
  const nzi = (d, lo, hi) => d.until(() => d.int(lo, hi), (v) => v !== 0);
  const cf = (v) => { const x = q(v); return x.q === 1 && x.p === 1 ? '' : x.q === 1 && x.p === -1 ? MINUS : iq(x); };   // 문자 앞 계수(1은 적지 않는다)
  const P2 = (v) => (q(v).p < 0 ? '(' + iq(v) + ')' : iq(v));                    // 식 속의 수(음수는 괄호)
  const sg = (v) => (v < 0 ? MINUS : '+');                                       // 항 사이의 부호
  // 그림의 세로 배율: 가로 한 칸(px)과 세로 범위로 그림 높이가 h px 쯤 되게
  const fitYs = (xr, yr, h) => { const ux = Math.min(44, 224 / xr); return Math.max(0.15, Math.min(1.4, h / (yr * ux))); };

  B.kit.u26x = {
    S1, S2, S3, S4, stripH, seal, retry, T, H, q, qadd, qsub, qmul, qdiv, qn, qeq, qpw, isI, J, iq, PQ, ptrim, padd, pscale, psub, pmul, pder, pint, pval, pdef, pequal, coef, deg,
    X, Tt, Cc, pw2, ptx, pp, lin, plusC, fx, FX, GX, FCX, fp, is, DDX, CN, ind, dfi, pvalJ, pdefJ, evlTold, num, pos, vals, pAns, GA, comboPick, pickOne, nzi, sg, fitYs, cf, P2
  };

  // ════════════════════════════════════════════════════════════════
  // 부정적분의 뜻
  // ════════════════════════════════════════════════════════════════
  const indef = [
    T('indef-pick', '주어진 함수의 부정적분인 것 고르기', '①1', (d) => {
      const n = d.int(2, 4), k = d.pick([1, 2, 3]), a = (n + 1) * k, f = Array(n).fill(0).concat([a]);
      const base = (c) => Array(n + 1).fill(0).concat([k]).map((v, i) => (i === 0 ? c : v));
      const c1 = nzi(d, -9, 9), c2 = d.int(2, 7), c3 = Q(d.pick([1, 2, 4, 5]), d.pick([3, 7])), m = nzi(d, -4, 4);
      const pool = [
        base(c1), base(c3),
        base(0).map((v, i) => (i === 1 ? m : v)),                                   // 일차항이 붙은 것
        Array(n + 1).fill(0).concat([a]).map((v, i) => (i === 0 ? c2 : v)),        // 계수를 그대로 둔 것
        Array(n).fill(0).concat([k]).map((v, i) => (i === 0 ? c2 : v))              // 차수를 그대로 둔 것
      ];
      const list = d.shuffle(pool).slice(0, 3), flags = list.map((g) => pequal(pder(g), f));
      if (!flags.some(Boolean)) return null;
      const hit = flags.map((t, i) => (t ? GA[i] : '')).filter(Boolean).join(', ');
      return comboPick(d, `다음 가운데 함수 ${ptx(f)}의 부정적분인 것만을 있는 대로 고른 것은?`, list.map((g) => ptx(g)), flags,
        `미분하여 ${jh(ptx(f), '이/가')} 되는 함수만 부정적분이다. 상수항만 다른 함수는 모두 도함수가 같으므로 ${hit}이다.`);
    }),
    T('indef-diff', '부정적분을 알 때 미분하여 함수·함숫값 구하기', '①2', (d, n) => {
      if (n === 0) {
        // ∫f(x)dx = (ax + p)(x + r) + C → f(x) = 2ax + (ar + p)
        const a = d.int(1, 3), p = nzi(d, -5, 5), r = nzi(d, -5, 5), f = [a * r + p, 2 * a];
        if (f[0] === 0) return null;
        return pAns(`다항함수 ${jh(FX, '에/에')} 대하여 ${ind(FX)} = ${pp([p, a])}${pp([r, 1])} + ${Cc}일 때, ${jh(FX, '을/를')} 구하시오. ${CN}`, FX + ' =', f, [1, 0], false, {
          explain: `우변을 미분하면 ${FX}이다. ${pp([p, a])}${pp([r, 1])} = ${ptx(pmul([p, a], [r, 1]))}이므로 ${is(FX, ptx(f))}이다.`,
          facts: { calc: [[`2*${a}`, 0], [`${a}*${J(r)}+${J(p)}`, 1]] } });
      }
      if (n === 1) {
        const F = [nzi(d, -9, 9), nzi(d, -6, 6), nzi(d, -5, 5), nzi(d, -3, 3)], k = nzi(d, -3, 3), f = pder(F);
        return num(`함수 ${jh(FX, '의/의')} 부정적분 중 하나가 ${ptx(F)}일 때, ${jh(fx('f', k), '의/의')} 값은?`, pval(f, k), {
          explain: `${is(FX, `(${ptx(F)})′`)} = ${ptx(f)}이므로 ${is(fx('f', k), pval(f, k))}이다.`,
          facts: { value: `3*${J(F[3])}*${J(k)}**2+2*${J(F[2])}*${J(k)}+${J(F[1])}` } });
      }
      if (n === 2) {
        const a = nzi(d, -4, 4), b = nzi(d, -6, 6), c = d.int(1, 7), G = [c, b, a], g = pder(G);
        const wrongs = [[pint(G), true], [[0, c, b, a], true], [pscale(g, Q(1, 2)), false], [padd(g, [c]), false]];
        const rows = [[ptx(g), true]].concat(wrongs.map(([w, withC]) => [withC ? plusC(ptx(w)) : ptx(w), false]));
        return pickOne(d, `함수 ${jh(FX, '이/가')} ${ind(FX)} = ${ptx(G)} + ${jh(Cc, '을/를')} 만족시킬 때, ${jh(FX, '은/는')}? ${CN}`, rows, {
          explain: `${ind(FX)} = ${plusC(ptx(G))}의 양변을 미분하면 ${is(FX, ptx(g))}이다. 적분한 식을 고르지 않도록 한다.` });
      }
      // n === 3: f 의 한 부정적분 F 에 대하여 F′(k)
      const f = [nzi(d, -9, 9), nzi(d, -6, 6), nzi(d, -4, 4)], k = nzi(d, -3, 3);
      return num(`함수 ${is(FX, ptx(f))}의 한 부정적분을 ${jh(FCX, '이라/라')} 할 때, ${jh(fp('F', k), '의/의')} 값은?`, pval(f, k), {
        explain: `${FCX}는 ${FX}의 부정적분이므로 ${is(fp('F'), FX)}이다. 따라서 ${is(fp('F', k), fx('f', k))} = ${iq(pval(f, k))}이다.`,
        facts: { value: pvalJ(f, J(k)) } });
    }, { count: 4, standard: S1 }),
    T('indef-factor', '∫(일차식)·f(x)dx나 ∫{f(x) − k}dx를 알 때 함숫값', '①3', (d, n) => {
      if (n === 0) {
        // ∫(x − p)f(x)dx = G(x) + C, f(x) = ax + b
        const a = d.pick([3, -3, 6]), p = nzi(d, -4, 4), b = nzi(d, -7, 7);
        if ((b - a * p) % 2 !== 0 || b * p === 0) return null;
        const gp = pmul([-p, 1], [b, a]), G = pint(gp), k = d.until(() => nzi(d, -3, 3), (v) => v !== p);
        if (G.some((c) => !isI(c)) || coef(G, 2).p === 0) return null;
        return num(`다항함수 ${jh(FX, '에/에')} 대하여 ${ind(pp([-p, 1]) + FX)} = ${plusC(ptx(G))}일 때, ${jh(fx('f', k), '의/의')} 값은? ${CN}`, a * k + b, {
          explain: `양변을 미분하면 ${pp([-p, 1])}${FX} = ${ptx(gp)} = ${pp([-p, 1])}${pp([b, a])}이므로 ${is(FX, lin(a, b))}, ${is(fx('f', k), a * k + b)}이다.`,
          facts: { value: `(3*${J(G[3])}*${J(k)}**2+2*${J(G[2])}*${J(k)}+${J(G[1])})/(${J(k)}-${J(p)})` } });
      }
      const m = d.int(2, 6), G = [0, nzi(d, -6, 6), nzi(d, -4, 4), nzi(d, -2, 2)], k = nzi(d, -2, 2), g = pder(G);
      return num(`함수 ${jh(FX, '에/에')} 대하여 ${ind(`{${FX} ${MINUS} ${m}}`)} = ${plusC(ptx(G))}일 때, ${jh(fx('f', k), '의/의')} 값은? ${CN}`, qadd(pval(g, k), m), {
        explain: `양변을 미분하면 ${FX} ${MINUS} ${m} = ${ptx(g)}이므로 ${is(FX, ptx(padd(g, [m])))}, ${is(fx('f', k), qadd(pval(g, k), m))}이다.`,
        facts: { value: `3*${J(G[3])}*${J(k)}**2+2*${J(G[2])}*${J(k)}+${J(G[1])}+${m}` } });
    }, { count: 2, standard: S1 }),
    T('indef-order', '미분과 적분의 차례 — d/dx∫f(x)dx와 ∫{d/dx f(x)}dx', '①4', (d, n) => {
      if (n === 0) {
        const g = [nzi(d, -7, 7), nzi(d, -5, 5), nzi(d, -3, 3)], G = ptx(g), gp = ptx(pder(g));
        const pool = [
          [`${DDX}{${ind(pp(g))}} = ${G}`, true],
          [`${ind(`{${DDX}${pp(g)}}`)} = ${G}`, false],
          [`${ind(`{${DDX}${pp(g)}}`)} = ${plusC(G)}`, true],
          [`${DDX}{${ind(pp(g))}} = ${plusC(G)}`, false],
          [`${ind(pp(pder(g)))} = ${plusC(G)}`, true],
          [`${DDX}${pp(g)} = ${plusC(gp)}`, false]
        ];
        const list = d.shuffle(pool).slice(0, 3);
        if (!list.some((r) => r[1])) return null;
        return comboPick(d, `함수 ${is(GX, G)}에 대하여 옳은 것만을 있는 대로 고른 것은? ${CN}`, list.map((r) => r[0]), list.map((r) => r[1]),
          `적분한 다음 미분하면 처음 함수가 되지만, 미분한 다음 적분하면 적분상수 ${jh(Cc, '이/가')} 붙는다.`);
      }
      if (n === 1) {
        // d/dx∫(b x² + a x + sr)dx = (bx + s)(x + r)
        const b = d.int(2, 5), s = nzi(d, -4, 4), r = nzi(d, -4, 4), a = b * r + s;
        if (a === 0) return null;
        const lhs = `(${b}${X}${sup(2)} + ${V('a')}${X} ${sg(s * r)} ${Math.abs(s * r)})`, rhs = `(${V('b')}${X} ${sg(s)} ${Math.abs(s)})${pp([r, 1])}`;
        return vals(`모든 실수 ${X}에 대하여 ${DDX}${ind(lhs)} = ${jh(rhs, '이/가')} 성립할 때, 상수 ${V('a')}, ${V('b')}의 값은?`, [[V('a'), a], [V('b'), b]], {
            explain: `좌변은 ${b}${X}${sup(2)} + ${V('a')}${X} ${sg(s * r)} ${Math.abs(s * r)}이고 우변을 전개하면 ${V('b')}${X}${sup(2)} + (${r === 1 ? '' : r === -1 ? MINUS : iq(r)}${V('b')} ${sg(s)} ${Math.abs(s)})${X} ${sg(s * r)} ${Math.abs(s * r)}이므로 ${is(V('b'), b)}, ${is(V('a'), a)}이다.`,
            facts: { calc: [[`${b}*${J(r)}+${J(s)}`, 0], [`${b}`, 1]] } });
      }
      // n === 2: (x − p)f(x) = d/dx∫(x² + mx + a)dx
      const p = nzi(d, -4, 4), m = nzi(d, -5, 5), a = -p * p - m * p, k = d.until(() => nzi(d, -4, 4), (v) => v !== p);
      if (a === 0 || p + m === 0) return null;
      const fk = k + p + m;
      return num(`다항함수 ${jh(FX, '이/가')} 모든 실수 ${jh(X, '에/에')} 대하여 ${pp([-p, 1])}${FX} = ${DDX}${ind(`(${X}${sup(2)} ${m < 0 ? MINUS : '+'} ${Math.abs(m) === 1 ? '' : Math.abs(m)}${X} + ${V('a')})`)}를 만족시킬 때, ${jh(fx('f', k), '의/의')} 값은? (단, ${jh(V('a'), '은/는')} 상수이다.)`, fk, {
        explain: `우변은 ${X}${sup(2)} ${m < 0 ? MINUS : '+'} ${Math.abs(m) === 1 ? '' : Math.abs(m)}${X} + ${V('a')}이다. ${jh(is(X, p), '을/를')} 대입하면 ${is(V('a'), a)}이고 ${ptx([a, m, 1])} = ${pp([-p, 1])}${pp([p + m, 1])}이므로 ${is(FX, ptx([p + m, 1]))}, ${is(fx('f', k), fk)}이다.`,
        facts: { value: `${J(k)}+${J(p)}+${J(m)}` } });
    }, { count: 3, standard: S1 }),
    T('indef-limit', '부정적분 F′ = f 를 써서 미분계수 꼴의 극한 구하기', '①5', (d, n) => {
      if (n === 0) {
        const f = [nzi(d, -9, 9), nzi(d, -6, 6), nzi(d, -4, 4), nzi(d, -2, 2)], p = nzi(d, -3, 3), v = qdiv(pval(f, p), 2 * p);
        return num(`함수 ${is(FX, ptx(f))}의 한 부정적분을 ${jh(FCX, '이라/라')} 할 때, ${lim('x→' + p, frac(`${FCX} ${MINUS} ${fx('F', p)}`, `${X}${sup(2)} ${MINUS} ${p * p}`))}의 값은?`, v, {
          explain: `${frac(`${FCX} ${MINUS} ${fx('F', p)}`, ptx([-p, 1]))} × ${frac(1, ptx([p, 1]))}에서 ${is(fp('F'), FX)}이므로 극한값은 ${frac(fx('f', p), `2 × ${P2(p)}`)} = ${iq(v)}이다.`,
          facts: { value: `(${pvalJ(f, J(p))})/(2*${J(p)})` } });
      }
      const g = [nzi(d, -6, 6), nzi(d, -5, 5), nzi(d, -4, 4)], k = d.pick([2, 3]), v = k * qn(pval(g, 1));
      return num(`함수 ${jh(FX, '이/가')} ${is(FX, ind(pp(g)))}일 때, ${lim('x→1', frac(`${fx('f', X + sup(k))} ${MINUS} ${fx('f', 1)}`, `${X} ${MINUS} 1`))}의 값은?`, v, {
        explain: `${is(fp('f'), ptx(g))}이다. ${frac(`${fx('f', X + sup(k))} ${MINUS} ${fx('f', 1)}`, `${X}${sup(k)} ${MINUS} 1`)} × ${frac(`${X}${sup(k)} ${MINUS} 1`, `${X} ${MINUS} 1`)}의 극한은 ${fp('f', 1)} × ${k} = ${iq(v)}이다.`,
        facts: { value: `${k}*(${pvalJ(g, '1')})` } });
    }, { count: 2, standard: S1 })
  ];

  // ════════════════════════════════════════════════════════════════
  // 다항함수의 부정적분과 함수 구하기
  // ════════════════════════════════════════════════════════════════
  const polyint = [
    T('poly-power', 'xⁿ과 상수함수의 부정적분', '①6', (d, n) => {
      if (n === 0) {
        const e = d.int(2, 9), k = d.pick([2, 3, 4, -2, -3]), a = (e + 1) * k;
        return inline(`부정적분 ${ind(ms(a + 'x^' + e))}를 구하시오. ${CN}`, `{0}${X}<sup>{1}</sup> + ${Cc}`, [{ answer: k, signed: true }, { answer: e + 1 }], {
          shown: `${k < 0 ? MINUS : ''}${Math.abs(k)}${X}${sup(e + 1)} + ${Cc}`,
          explain: `${ind(X + sup(e))} = ${frac(1, e + 1)}${X}${sup(e + 1)} + ${Cc}이므로 ${ind(ms(a + 'x^' + e))} = ${a < 0 ? MINUS : ''}${frac(Math.abs(a), e + 1)}${X}${sup(e + 1)} + ${Cc} = ${k < 0 ? MINUS : ''}${Math.abs(k)}${X}${sup(e + 1)} + ${Cc}이다.`,
          facts: { calc: [[`${J(a)}/(${e}+1)`, 0], [`${e}+1`, 1]] } });
      }
      if (n === 1) {
        const e = d.int(3, 10), c = d.until(() => d.int(2, 9), (v) => v % (e + 1) !== 0), g = gcd(c, e + 1);
        return inline(`부정적분 ${ind(c + X + sup(e))}를 구하시오. (단, 계수는 기약분수로 나타내고, ${jh(Cc, '은/는')} 적분상수이다.)`, `${frac('{0}', '{1}')}${X}<sup>{2}</sup> + ${Cc}`, [{ answer: c / g }, { answer: (e + 1) / g }, { answer: e + 1 }], {
          shown: `${frac(c / g, (e + 1) / g)}${X}${sup(e + 1)} + ${Cc}`,
          explain: `${ind(X + sup(e))} = ${frac(1, e + 1)}${X}${sup(e + 1)} + ${Cc}이므로 ${ind(c + X + sup(e))} = ${frac(c, e + 1)}${X}${sup(e + 1)} + ${Cc}${g === 1 ? '' : ` = ${frac(c / g, (e + 1) / g)}${X}${sup(e + 1)} + ${Cc}`}이다.`,
          facts: { calc: [[`${c}/${g}`, 0], [`(${e}+1)/${g}`, 1], [`${e}+1`, 2]], derived: [g, (e + 1) / g, e + 1] } });
      }
      const k = d.pick([2, 3, 4, 5, 6, 7, 8, 9, -2, -3, -4, -5, -6, -7]);
      return inline(`부정적분 ${ind(iq(k))}를 구하시오. ${CN}`, `{0}${X} + ${Cc}`, [{ answer: k, signed: true }], {
        shown: `${iq(k)}${X} + ${Cc}`,
        explain: `(${iq(k)}${X})′ = ${iq(k)}이므로 ${ind(iq(k))} = ${iq(k)}${X} + ${Cc}이다.`,
        facts: { calc: [[J(k), 0]] } });
    }, { count: 3, standard: S2 }),
    T('poly-sum', '다항식의 부정적분(실수배·합·차, 곱은 전개)', '①7', (d, n) => {
      if (n === 0) {
        const f = [nzi(d, -9, 9), 2 * nzi(d, -4, 4), 3 * nzi(d, -3, 3)], P = pint(f);
        return pAns(`부정적분 ${ind(pp(f))}를 구하시오. ${CN}`, '', P, [3, 2, 1], true, {
          explain: `항마다 계수를 (차수 + 1)로 나누고 차수를 1 올리면 ${plusC(ptx(P))}이다.`,
          facts: { calc: [[`${J(f[2])}/3`, 0], [`${J(f[1])}/2`, 1], [J(f[0]), 2]] } });
      }
      if (n === 1) {
        // ∫(mx + s)(x + r)dx
        const m = 3 * nzi(d, -2, 2), s = nzi(d, -6, 6), r = nzi(d, -5, 5), f = pmul([s, m], [r, 1]), P = pint(f);
        if (P.some((c) => !isI(c)) || P.slice(1).some((c) => c.p === 0)) return null;
        return pAns(`부정적분 ${ind(pp([s, m]) + pp([r, 1]))}를 구하시오. ${CN}`, '', P, [3, 2, 1], true, {
          explain: `${pp([s, m])}${pp([r, 1])} = ${ptx(f)}이므로 항마다 적분하면 ${plusC(ptx(P))}이다.`,
          facts: { calc: [[`${J(m)}/3`, 0], [`(${J(m)}*${J(r)}+${J(s)})/2`, 1], [`${J(s)}*${J(r)}`, 2]] } });
      }
      const f = [nzi(d, -9, 9), 0, 3 * nzi(d, -3, 3), 4 * nzi(d, -2, 2)], P = pint(f);
      return pAns(`부정적분 ${ind(pp(f))}를 구하시오. ${CN}`, '', P, [4, 3, 1], true, {
        explain: `항마다 적분하면 ${plusC(ptx(P))}이다.`,
        facts: { calc: [[`${J(f[3])}/4`, 0], [`${J(f[2])}/3`, 1], [J(f[0]), 2]] } });
    }, { count: 3, standard: S2 }),
    T('poly-combine', '부정적분의 실수배·합·차를 한 적분으로 묶기', '①8', (d, n) => {
      if (n === 0) {
        const k = d.pick([2, 3]), h = [nzi(d, -9, 9), 2 * nzi(d, -4, 4), 3 * nzi(d, -3, 3)], P = pscale(pint(h), -1);
        return pAns(`두 다항함수 ${FX}, ${jh(GX, '이/가')} ${FX} ${MINUS} ${k}${GX} = ${jh(ptx(h), '을/를')} 만족시킬 때, ${ind(`{${FX} + ${k}${GX}}`)} ${MINUS} 2${ind(FX)}를 구하시오. ${CN}`, '', P, [3, 2, 1], true, {
          explain: `${ind(`{${FX} + ${k}${GX}}`)} ${MINUS} 2${ind(FX)} = ${ind(`{${MINUS}${FX} + ${k}${GX}}`)} = ${MINUS}${ind(`{${FX} ${MINUS} ${k}${GX}}`)} = ${MINUS}${ind(pp(h))} = ${plusC(ptx(P))}이다.`,
          facts: { calc: [[`-(${J(h[2])})/3`, 0], [`-(${J(h[1])})/2`, 1], [`-(${J(h[0])})`, 2]] } });
      }
      const m = d.int(20, 60), k = d.int(8, 19), c = d.int(2, 6), v = nzi(d, -6, 9), ans = (m % 2 ? -1 : 1) - (k % 2 ? -1 : 1) - c + (v - c);
      return num(`함수 ${is(FX, `${m}${ind(X + sup(m - 1))} ${MINUS} ${k}${ind(X + sup(k - 1))} + ${ind(String(c))}`)}에 대하여 ${is(fx('f', 1), v)}일 때, ${jh(fx('f', -1), '의/의')} 값은?`, ans, {
        explain: `${is(FX, `${X}${sup(m)} ${MINUS} ${X}${sup(k)} + ${c}${X} + ${Cc}`)}(적분상수를 하나로 묶었다)이고 ${is(fx('f', 1), `${c} + ${Cc}`)} = ${iq(v)}이므로 ${is(Cc, v - c)}, ${is(fx('f', -1), ans)}이다.`,
        facts: { value: `(-1)**${m}-(-1)**${k}-${c}+${J(v)}-${c}` } });
    }, { count: 2, standard: S2 }),
    T('poly-fprime', '도함수와 함숫값으로 함수 구하기', '①10', (d, n) => {
      if (n === 0) {
        const fpq = [nzi(d, -9, 9), 2 * nzi(d, -4, 4), 3 * nzi(d, -3, 3)], p = nzi(d, -2, 2), v = nzi(d, -9, 9), P = pint(fpq), c0 = qsub(v, pval(P, p)), f = padd(P, [c0]);
        if (c0.p === 0) return null;
        return pAns(`함수 ${jh(FX, '이/가')} 다음 조건을 만족시킬 때, ${jh(FX, '을/를')} 구하시오.<br>${is(fp('f'), ptx(fpq))}, ${is(fx('f', p), v)}`, FX + ' =', f, [3, 2, 1, 0], false, {
          explain: `${is(FX, ind(pp(fpq)))} = ${plusC(ptx(P))}이고 ${is(fx('f', p), v)}에서 ${is(Cc, c0)}이므로 ${is(FX, ptx(f))}이다.`,
          facts: { calc: [[`${J(fpq[2])}/3`, 0], [`${J(fpq[1])}/2`, 1], [J(fpq[0]), 2], [`${J(v)}-(${J(fpq[2])}/3*${J(p)}**3+${J(fpq[1])}/2*${J(p)}**2+${J(fpq[0])}*${J(p)})`, 3]] } });
      }
      if (n === 1) {
        const fpq = [nzi(d, -5, 5), nzi(d, -4, 4), nzi(d, -3, 3), d.pick([4, 8, -4])], p = nzi(d, -1, 1), r = d.until(() => nzi(d, -2, 2), (x) => x !== p), v = nzi(d, -5, 5);
        const ans = qadd(v, pdef(fpq, p, r));
        return num(`함수 ${jh(FX, '에/에')} 대하여 ${is(fp('f'), ptx(fpq))}이고 ${is(fx('f', p), v)}일 때, ${jh(fx('f', r), '의/의')} 값은?`, ans, {
          explain: `${is(FX, plusC(ptx(pint(fpq))))}에서 ${jh(is(fx('f', p), v), '으로/로')} ${jh(Cc, '을/를')} 정하면 ${is(Cc, qsub(v, pval(pint(fpq), p)))}이고, ${is(fx('f', r), ans)}이다.`,
          facts: { value: `${J(v)}+(${pdefJ(fpq, p, r)})` } });
      }
      // 기말6: f′(x) = x² + Bx − a, f(0) = c, f(p) = w → a
      const B2 = 2 * nzi(d, -3, 3), a = nzi(d, -9, 9), c = nzi(d, -6, 6), p = d.pick([3, -3]), w = qn(pval([c, -a, B2 / 2, Q(1, 3)], p));
      if (!Number.isInteger(w)) return null;
      return num(`함수 ${jh(FX, '의/의')} 도함수가 ${is(fp('f'), `${X}${sup(2)} ${B2 < 0 ? MINUS : '+'} ${Math.abs(B2)}${X} ${MINUS} ${V('a')}`)}이고 ${is(fx('f', 0), c)}, ${is(fx('f', p), w)}일 때, 상수 ${jh(V('a'), '의/의')} 값은?`, a, {
        explain: `${is(FX, `${frac(1, 3)}${X}${sup(3)} ${B2 < 0 ? MINUS : '+'} ${Math.abs(B2 / 2) === 1 ? '' : Math.abs(B2 / 2)}${X}${sup(2)} ${MINUS} ${V('a')}${X} + ${Cc}`)}이고 ${is(fx('f', 0), c)}에서 ${is(Cc, c)}이다. ${is(fx('f', p), w)}에 대입하면 ${is(V('a'), a)}이다.`,
        facts: { value: `(${J(p)}**3/3+${J(B2)}/2*${J(p)}**2+${J(c)}-${J(w)})/${J(p)}` } });
    }, { count: 3, standard: S2 }),
    T('poly-tangent', '접선의 기울기로 곡선(함수) 구하기', '①11', (d, n) => {
      const slope = `곡선 ${is(V('y'), FX)} 위의 점 (${X}, ${FX})에서의 접선의 기울기가`;
      if (n === 0) {
        const al = nzi(d, -4, 4), be = nzi(d, -7, 7), p = nzi(d, -3, 3), yq = nzi(d, -9, 9), c0 = yq - (al * p * p + be * p), f = [c0, be, al];
        if (c0 === 0) return null;
        const P0 = jh(`점 (${iq(p)}, ${iq(yq)})`, '을/를');
        return pAns(`${slope} ${ptx([be, 2 * al])}이고 이 곡선이 ${P0} 지날 때, ${jh(FX, '을/를')} 구하시오.`, FX + ' =', f, [2, 1, 0], false, {
          explain: `${is(fp('f'), ptx([be, 2 * al]))}이므로 ${is(FX, plusC(ptx([0, be, al])))}이고, ${P0} 지나므로 ${is(Cc, c0)}이다.`,
          facts: { calc: [[`${J(2 * al)}/2`, 0], [J(be), 1], [`${J(yq)}-(${J(2 * al)}/2*${J(p)}**2+${J(be)}*${J(p)})`, 2]] } });
      }
      if (n === 1) {
        // 기울기 2cx + k, 점 (0, −e), f(x) = 0의 모든 근의 합 s = −k/c
        const c = d.int(2, 9), k = nzi(d, -7, 7), e = d.int(1, 6), s = Q(-k, c);
        if (s.q === 1) return null;
        return pAns(`${slope} ${2 * c}${X} + ${V('k')}이고 이 곡선이 ${jh(`점 (0, ${MINUS}${e})`, '을/를')} 지난다. 방정식 ${is(FX, 0)}의 모든 근의 합이 ${iq(s)}일 때, ${jh(FX, '을/를')} 구하시오. (단, ${jh(V('k'), '은/는')} 상수이다.)`, FX + ' =', [-e, k, c], [2, 1, 0], false, {
          explain: `${is(FX, `${c}${X}${sup(2)} + ${V('k')}${X} + ${Cc}`)}이고 ${is(fx('f', 0), -e)}에서 ${is(Cc, -e)}이다. 근과 계수의 관계에서 두 근의 합은 ${MINUS}${frac(V('k'), c)} = ${iq(s)}이므로 ${is(V('k'), k)}이다.`,
          facts: { calc: [[`${2 * c}/2`, 0], [`-(${J(s)})*${2 * c}/2`, 1], [`-${e}`, 2]] } });
      }
      const fpq = [nzi(d, -6, 6), 2 * nzi(d, -4, 4), 3 * nzi(d, -2, 2)], b = d.pick([1, 2, 3]), f = pint(fpq), ans = pdef(f, 0, b);
      return num(`원점을 지나는 ${slope} ${ptx(fpq)}일 때, ${dfi(0, b, FX)}의 값은?`, ans, {
        explain: `${is(FX, plusC(ptx(f)))}이고 원점을 지나므로 ${is(Cc, 0)}이다. ${evlTold(f, 0, b)}이다.`,
        facts: { value: `${J(fpq[2])}/3*${b}**4/4+${J(fpq[1])}/2*${b}**3/3+${J(fpq[0])}*${b}**2/2` } });
    }, { count: 3, standard: S2 }),
    T('poly-family', '부정적분의 그래프 — y축 방향 평행이동', '①12', (d) => {
      const e = d.int(2, 3), k = d.pick([1, 2]), a = (e + 1) * k, base = `${is(V('y'), (k === 1 ? '' : k) + X + sup(e + 1))}`, fpx = (a === 1 ? '' : a) + X + sup(e);
      const yes = [`곡선 ${jh(base, '을/를')} ${V('y')}축의 방향으로 평행이동한 곡선들이다.`, `${X}좌표가 같은 점에서 그은 접선의 기울기는 모두 같다.`, `모두 ${is(V('y'), `${(k === 1 ? '' : k) + X + sup(e + 1)} + ${Cc}`)}(${jh(Cc, '은/는')} 상수) 꼴의 식으로 나타낼 수 있다.`];
      const no = [
        [`곡선 ${jh(base, '을/를')} ${X}축의 방향으로 평행이동한 곡선들이다.`, `${is(fx('F'), `${(k === 1 ? '' : k) + X + sup(e + 1)} + ${Cc}`)}이므로 ${V('y')}축의 방향으로 평행이동한 곡선들이다.`, yes[0]],
        [`모두 원점을 지난다.`, `${is(fx('F', 0), Cc)}이므로 ${Cc} ≠ 0이면 원점을 지나지 않는다.`, ''],
        [`서로 다른 두 곡선은 한 점에서 만난다.`, `상수항만 다르므로 서로 다른 두 곡선은 만나지 않는다.`, ''],
        [`${is(X, 1)}인 점에서 그은 접선의 기울기는 곡선마다 다르다.`, `${jh(is(fp('F', 1), a), '으로/로')} 모두 같다.`, yes[1]]
      ];
      return claimQ(d, `${jh(is(fp('F'), fpx), '을/를')} 만족시키는 함수 ${is(V('y'), FCX)}의 그래프들에 대한 설명으로 옳은 것은?`, yes, no, true);
    }, { standard: S1 }),
    T('poly-extreme', '부정적분으로 준 함수의 극값과 적분상수', '①13', (d, n) => {
      if (n === 0) {
        // f(x) = ∫(3x² + ax + c)dx, x = p 에서 극솟값 m (p > q, f′ = 3(x − p)(x − q))
        const p = nzi(d, -3, 3), qq = d.until(() => nzi(d, -4, 4), (v) => v < p), c = 3 * p * qq, m = nzi(d, -6, 6), a = -3 * (p + qq);
        if (a === 0) return null;
        const C0 = qadd(m, qsub(Q(p ** 3, 2), Q(c * p, 2)));
        return num(`함수 ${is(FX, ind(`(3${X}${sup(2)} + ${V('a')}${X} ${c < 0 ? MINUS : '+'} ${Math.abs(c)})`))}가 ${is(X, p)}에서 극솟값 ${jh(iq(m), '을/를')} 가질 때, ${jh(fx('f', 0), '의/의')} 값은? (단, ${jh(V('a'), '은/는')} 상수이다.)`, C0, {
          explain: `${is(fp('f', p), 0)}에서 ${is(V('a'), a)}이다. ${is(FX, plusC(ptx([0, c, Q(a, 2), 1])))}이고 ${is(fx('f', p), m)}에서 ${is(Cc, C0)}이므로 ${is(fx('f', 0), C0)}이다.`,
          facts: { value: `${J(m)}+${J(p)}**3/2-${J(c)}*${J(p)}/2` } });
      }
      if (n === 1) {
        // f′ = (x − r)(x² + ux + v), u² < 4v
        const r = nzi(d, -2, 2), u = d.int(-2, 2), v = d.int(2, 5);
        if (u * u >= 4 * v) return null;
        const fpq = pmul([-r, 1], [v, u, 1]), m = nzi(d, -4, 4), k = d.until(() => d.int(-2, 2), (x) => x !== r), ans = qadd(m, pdef(fpq, r, k));
        if (fpq.some((c) => c.p === 0)) return null;
        return num(`다항함수 ${is(FX, ind(pp(fpq)))}의 극솟값이 ${iq(m)}일 때, ${jh(fx('f', k), '의/의')} 값은?`, ans, {
          explain: `${is(fp('f'), `${pp([-r, 1])}${pp([v, u, 1])}`)}이고 ${ptx([v, u, 1])} > 0이므로 ${is(X, r)}에서만 부호가 음에서 양으로 바뀌어 극소이다. ${is(fx('f', r), m)}이므로 ${is(fx('f', k), `${iq(m)} + ${dfi(r, k, pp(fpq))}`)} = ${iq(ans)}이다.`,
          facts: { value: `${J(m)}+(${pdefJ(fpq, r, k)})` } });
      }
      // 기말22: f′(x) = ax(x − s) 의 그래프, 극댓값 M, 극솟값 m → f(x)
      const s = d.pick([1, 2]), down = d.bool(), gap = s === 2 ? 4 * d.int(1, 3) : d.int(1, 3), m = nzi(d, -4, 5), Mx = m + gap;
      const a = (down ? -1 : 1) * 6 * gap / s ** 3, f0 = down ? m : Mx, f = [f0, 0, -a * s / 2, a / 3];
      if (f0 === 0 || !Number.isInteger(f[2]) || !Number.isInteger(f[3])) return null;
      const g = (x) => a * x * (x - s), vy = Math.abs(a) * s * s / 4, yr = down ? [-0.6 * vy - 0.4, vy + 0.6] : [-vy - 0.6, 0.6 * vy + 0.4];
      const figure = plot({ x: [-1, s + 1], y: yr, ys: fitYs(s + 2, yr[1] - yr[0], 180), xt: [s],
        curves: [{ f: g, name: "y=f'(x)" }], say: `곡선 y=f′(x)는 ${down ? '위로' : '아래로'} 볼록한 포물선이고 x축과 원점, x = ${s}인 점에서 만난다.` });
      return pAns(`삼차함수 ${jh(FX, '의/의')} 도함수 ${is(V('y'), fp('f'))}의 그래프가 그림과 같다. 함수 ${jh(FX, '의/의')} 극댓값이 ${iq(Mx)}, 극솟값이 ${iq(m)}일 때, ${jh(FX, '을/를')} 구하시오.`, FX + ' =', f, [3, 2, 0], false, {
        figure,
        explain: `${is(fp('f'), `${V('a')}${X}(${X} ${MINUS} ${s})`)}로 놓으면 ${is(FX, `${V('a')}(${frac(1, 3)}${X}${sup(3)} ${MINUS} ${frac(s, 2)}${X}${sup(2)}) + ${Cc}`)}이다. ${down ? `${is(X, 0)}에서 극소, ${is(X, s)}에서 극대` : `${is(X, 0)}에서 극대, ${is(X, s)}에서 극소`}이므로 ${is(Cc, f0)}, ${is(V('a'), a)}이고 ${is(FX, ptx(f))}이다.`,
        facts: { calc: [[`${down ? '-' : ''}6*(${J(Mx)}-${J(m)})/${s}**3/3`, 0], [`${down ? '' : '-'}6*(${J(Mx)}-${J(m)})/${s}**3*${s}/2`, 1], [J(f0), 2]] } });
    }, { count: 3, standard: S2 })
  ];

  // ════════════════════════════════════════════════════════════════
  // 정적분의 뜻과 미적분의 기본정리
  // ════════════════════════════════════════════════════════════════
  // 꺾은선 그래프(점 (x, y)를 차례로 이은 선)와 그 아래를 칠한 그림
  function brokenLine(pts, o) {
    const at = (x) => { for (let i = 1; i < pts.length; i += 1) if (x <= pts[i][0] + 1e-9) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]; return y0 + (y1 - y0) * (x - x0) / (x1 - x0); } return pts[pts.length - 1][1]; };
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]), lo = Math.min(0, xs[0]), hi = Math.max(...xs), top = Math.max(...ys);
    const xt = []; for (let x = Math.ceil(lo); x <= hi; x += 1) if (x !== 0) xt.push(x);
    const yt = []; for (let y = 1; y <= top; y += 1) yt.push(y);
    return plot(Object.assign({ x: [lo - 0.6, hi + 0.8], y: [-0.6, top + 0.8], xt, yt, grid: true,
      curves: [{ f: at, from: xs[0], to: hi, name: 'y=f(x)', at: hi, side: 'ur' }], fill: [{ f: at, from: xs[0], to: hi }],
      segs: [{ p: [xs[0], 0], q: [xs[0], ys[0]], dash: true }, { p: [hi, 0], q: [hi, ys[ys.length - 1]], dash: true }],
      say: `그래프는 점 ${pts.map(([x, y]) => `(${x < 0 ? MINUS + Math.abs(x) : x}, ${y})`).join(', ')}을 차례로 이은 꺾은선이다.` }, o || {}));
  }
  const trapJ = (pts) => pts.slice(1).map((p, i) => `(${pts[i][1]}+${p[1]})*(${J(p[0])}-${J(pts[i][0])})/2`).join('+');
  const trapV = (pts) => pts.slice(1).reduce((s, p, i) => qadd(s, Q((pts[i][1] + p[1]) * (p[0] - pts[i][0]), 2)), Q(0));
  const def = [
    T('def-graph', '그래프(꺾은선)로 준 함수의 정적분', '①20', (d, n) => {
      if (n === 0) {
        const x0 = d.int(0, 1), cnt = d.int(2, 3), pts = Array.from({ length: cnt + 1 }, (_, i) => [x0 + i, d.int(1, 4)]);
        if (new Set(pts.map((p) => p[1])).size < 2) return null;
        const a = pts[0][0], b = pts[cnt][0], v = trapV(pts);
        return pos(`함수 ${is(V('y'), FX)}의 그래프가 그림과 같을 때, ${jh(dfi(a, b, FX), '의/의')} 값은?`, v, {
          figure: brokenLine(pts),
          explain: `${jh(dfi(a, b, FX), '은/는')} 그래프와 ${X}축, 두 직선 ${is(X, a)}, ${jh(is(X, b), '으로/로')} 둘러싸인 도형의 넓이이다. 사다리꼴로 나누어 더하면 ${iq(v)}이다.`,
          facts: { value: trapJ(pts) } });
      }
      // 두 구간: [x0, 0]과 [0, xN] — 값이 모두 정수가 되게 고른다
      const left = d.int(1, 2), right = d.int(2, 3), pts = Array.from({ length: left + right + 1 }, (_, i) => [i - left, d.int(1, 4)]);
      const L = pts.slice(0, left + 1), R = pts.slice(left), vl = trapV(L), vr = trapV(R);
      if (!isI(vl) || !isI(vr) || new Set(pts.map((p) => p[1])).size < 2) return null;
      return M(`함수 ${is(V('y'), FX)}의 그래프가 그림과 같을 때, 다음 정적분의 값을 각각 구하시오.`, [
        { lead: dfi(-left, 0, FX) + ' =', answer: vl.p },
        { lead: dfi(0, right, FX) + ' =', answer: vr.p }
      ], { figure: brokenLine(pts), shown: `${iq(vl)}, ${iq(vr)}`,
        explain: `두 정적분은 각각 ${jh(is(X, -left), '과/와')} ${V('y')}축 사이, ${V('y')}축과 ${is(X, right)} 사이에서 그래프 아래의 넓이이다. 사다리꼴로 나누어 더하면 ${iq(vl)}, ${iq(vr)}이다.`,
        facts: { calc: [[trapJ(L), 0], [trapJ(R), 1]] } });
    }, { count: 2, standard: S3 }),
    T('def-Fgraph', '부정적분 F의 그래프로 정적분 구하기', '①30', (d) => {
      const p = d.int(0, 1), qq = p + d.int(2, 3), u = d.int(-2, 3), w = d.until(() => d.int(-2, 4), (v) => v !== u && v !== 0), mid = (p + qq) / 2, c = d.pick([0.6, 0.8, -0.6]);
      if (u === 0 && p === 0) return null;
      const F = (x) => c * (x - p) * (x - mid) * (x - qq) + u + (w - u) * (x - p) / (qq - p);
      let lo = 0, hi = 0; for (let x = -0.6; x <= qq + 0.6; x += 0.05) { lo = Math.min(lo, F(x)); hi = Math.max(hi, F(x)); }
      const yr = [Math.max(-4.5, Math.floor(lo) - 0.5), Math.min(6, Math.ceil(hi) + 0.5)];
      const figure = plot({ x: [-0.7, qq + 0.8], y: yr, ys: fitYs(qq + 1.5, yr[1] - yr[0], 200), xt: [p, qq].filter((x) => x !== 0), yt: [u, w].filter((y) => y !== 0),
        curves: [{ f: F, name: 'y=F(x)', at: [qq + 0.55, qq + 0.35, -0.4, -0.2].find((x) => F(x) > yr[0] + 0.6 && F(x) < yr[1] - 0.6) || qq + 0.3 }], dots: [{ x: p, y: u, guide: p !== 0 }, { x: qq, y: w, guide: true }] });
      return num(`모든 실수 ${jh(X, '에서/에서')} 연속인 함수 ${jh(FX, '의/의')} 한 부정적분을 ${jh(FCX, '이라/라')} 할 때, 함수 ${is(V('y'), FCX)}의 그래프가 그림과 같다. ${jh(dfi(p, qq, FX), '의/의')} 값은?`, w - u, {
        figure,
        explain: `${is(dfi(p, qq, FX), `${fx('F', qq)} ${MINUS} ${fx('F', p)}`)} = ${iq(w)} ${MINUS} ${u < 0 ? '(' + iq(u) + ')' : iq(u)} = ${iq(w - u)}이다.`,
        facts: { value: `${J(w)}-${J(u)}` } });
    }, { standard: S4 }),
    T('def-fprime-area', '도함수의 그래프와 넓이로 f(b) − f(a) 구하기', '①31', (d) => {
      const s = d.pick([1, 2, 3]), A = d.int(2, 12), k = 3 * A / (4 * s ** 3), g = (x) => -k * x * (x - 2 * s), top = k * s * s, back = d.bool();
      const figure = plot({ x: [-0.6, 2 * s + 0.7], y: [-top * 0.35 - 0.2, top * 1.15 + 0.2], ys: fitYs(2 * s + 1.3, top * 1.5 + 0.4, 170), xt: [2 * s],
        curves: [{ f: g, name: "y=f'(x)" }], fill: [{ f: g, from: 0, to: 2 * s }], say: `곡선 y=f′(x)는 위로 볼록한 포물선이고 x축과 원점, x = ${2 * s}인 점에서 만난다. 색칠한 부분은 곡선과 x축으로 둘러싸인 도형이다.` });
      const [lo, hi] = back ? [s, 2 * s] : [0, s];
      return pos(`삼차함수 ${jh(FX, '의/의')} 도함수 ${is(V('y'), fp('f'))}의 그래프가 그림과 같다. 곡선 ${is(V('y'), fp('f'))}와 ${X}축으로 둘러싸인 도형의 넓이가 ${A}일 때, ${fx('f', hi)} ${MINUS} ${fx('f', lo)}의 값은?`, Q(A, 2), {
        figure,
        explain: `${fx('f', hi)} ${MINUS} ${is(fx('f', lo), dfi(lo, hi, fp('f')))}이다. 포물선은 직선 ${is(X, s)}에 대하여 대칭이므로 이 값은 넓이 ${A}의 절반인 ${iq(Q(A, 2))}이다.`,
        facts: { value: `${A}/2` } });
    }, { standard: S4 }),
    T('def-ftc', '미적분의 기본정리로 다항함수의 정적분 구하기', '①32', (d, n) => {
      if (n === 2) {
        // 한 부정적분을 주고 F(b) − F(a)
        const f = [nzi(d, -6, 6), 2 * nzi(d, -3, 3), 3 * d.pick([1, 2, -1])], F = pint(f), a = d.int(-1, 1), b = a + d.int(1, 2);
        return num(`함수 ${is(FX, ptx(f))}의 한 부정적분이 ${is(FCX, ptx(F))}일 때, ${jh(dfi(a, b, FX), '의/의')} 값은?`, pdef(f, a, b), {
          explain: `${is(dfi(a, b, FX), `${fx('F', b)} ${MINUS} ${fx('F', a)}`)} = ${iq(pdef(f, a, b))}이다.`,
          facts: { value: `${pvalJ(F, J(b))}-(${pvalJ(F, J(a))})` } });
      }
      const f = n === 0 ? [nzi(d, -6, 6), nzi(d, -6, 6), nzi(d, -4, 4) * 3] : [nzi(d, -5, 5), nzi(d, -4, 4), nzi(d, -3, 3), 2 * nzi(d, -2, 2)];
      const a = d.int(-2, 1), b = a + d.int(1, 3);
      return num(`${jh(dfi(a, b, pp(f)), '의/의')} 값은?`, pdef(f, a, b), {
        explain: `${evlTold(f, a, b)}이다.`,
        facts: { value: pdefJ(f, a, b) } });
    }, { count: 3, standard: S4 }),
    T('def-reverse', '위끝이 아래끝보다 작은 정적분', '①33', (d) => {
      const f = [nzi(d, -5, 5), nzi(d, -4, 4), 3 * nzi(d, -2, 2)], b = d.int(-2, 0), a = b + d.int(1, 3);
      return num(`${jh(dfi(a, b, pp(f)), '의/의')} 값은?`, pdef(f, a, b), {
        explain: `끝을 바꾸지 않고 ${jh(is(dfi(a, b, FX), `${fx('F', b)} ${MINUS} ${fx('F', a)}`), '으로/로')} 셈한다. ${evlTold(f, a, b)}이다.`,
        facts: { value: pdefJ(f, a, b) } });
    }, { standard: S4 })
  ];

  B.addUnit({ id: '11-2-6', grade: 11, semester: 2, no: 6, title: '부정적분과 정적분', version: 1, groups: [
    { id: 'indef', title: '부정적분의 뜻', standard: S1, types: indef },
    { id: 'polyint', title: '다항함수의 부정적분', standard: S2, types: polyint },
    { id: 'def', title: '정적분의 뜻과 미적분의 기본정리', standard: S4, types: def },
    { id: 'fdef', title: '정적분으로 정의된 함수', standard: S4, types: [] },
    { id: 'calc', title: '정적분의 계산', standard: S4, types: [] }
  ] });
})(typeof window !== 'undefined' ? window : globalThis);
