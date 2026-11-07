// 미적분Ⅰ Ⅱ-2 도함수의 활용(1) — 단원 틀·도구와 앞쪽 묶음(접선의 방정식, 평균값 정리).
// 수집해 둔 천재 T셀파 미적분Ⅰ(홍진곤, 2022 개정)의 교과서·평가 자료에서 뽑은 문제 꼴 목록(기본꼴_1: 41꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/11-2-4/싣기_대조표.md 에 있다.
// (함수의 증가와 감소, 극대와 극소는 11-2-4b.js 에, 실력 문항은 11-2-4c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번.
// 성취기준: [12미적Ⅰ-02-05] 접선의 방정식 / [12미적Ⅰ-02-06] 평균값 정리 / [12미적Ⅰ-02-07] 함수의 증가와 감소, 극대와 극소.
// 은행에서 고2·3 선택 과목은 grade 11, semester 자리에 과목 번호(2 = 미적분Ⅰ)를 둔다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(곡선 위의 점·곡선 밖의 점·기울기·평행한 직선·그래프·조건), 묻는 것(접선·상수·c의 값·개수·고르기),
//    곡선의 차수(이차는 접선이 하나, 삼차는 둘이 될 수 있다), 근을 고르는 일이 끼는가가 다르면 따로 싣는다. 수만 바꾼 유형은 만들지 않는다.
//  - 사용자가 정한 대로 내신 대비이고 「수학 실력에 필요해 보이는 문제는 다 넣는다」. 교육과정의 「지나치게 복잡한 계산을 포함하는 문제는 다루지 않는다」는
//    정도를 말하는 줄이라 빼는 까닭으로 쓰지 않았다. 고1·중3 단원과 같은 일(판별식으로 구하는 이차곡선의 접선, 이차함수의 증가·감소)도 싣는다.
//  - 답: 접선은 「y = [±][ ]x [±][ ]」(두 직선이면 묶음째 차례를 바꾸어 적어도 맞다), 상수·좌표·c의 값은 부호 단추가 붙은 칸(분수는 분자·분모 칸),
//    근호가 든 값은 radAns, 근호가 든 값 가운데 꼴이 여럿인 것(정리를 만족시키는 c가 (p + q√r)/s 꼴)은 원문처럼 다섯 보기로 낸다.
//    개수·길이만 단추 없이 받는다. 원문의 「t + a」「ab/c」「m + n」처럼 따로 구한 값을 뜻 없이 더하거나 곱한 꼴은 값을 칸마다 따로 받는다.
//    늘 같은 답이 나오는 원문(이차함수에서 평균값 정리의 c = 구간의 가운데)도 구간의 끝 수를 바꾸어 답이 달라지게 지었고, 그 사실은 풀이에 적었다.
//  - 답은 모두 코드가 셈한다. 고르기의 참·거짓도 함수의 값·도함수의 근을 셈해서 가린다.
//  - 검사 근거: 수 칸은 문제에 적힌 수로 다시 셈하는 식(facts.calc·value)이고, 글에 없는 수(접점의 x좌표처럼 풀이 도중에 나오는 수)는 seal 이
//    facts.unseen 에 밝힌다(derived). 제곱근을 거쳐야 나오는 칸은 facts.check 에 셈의 바탕을 적고 따로 지은 풀이로 맞춰 보았다.
//
// 뺀 것과 까닭(11-2-4b.js, 11-2-4c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 같은 과목의 다른 단원 몫: ①1의 변형(접선의 기울기만 묻기 — 11-2-3 미분계수의 기하적 의미), ①12(한 점에서 그은 세 접선 — 11-2-5 꼴 30과 같은 일).
//  - 서술형만으로 묻는 것: ①22(평균값 정리로 상수함수, f = g + C 증명 — 빈칸·고르기로 낸 원문이 없다).
//  - 활동·생각 열기: 교과서 87쪽 미세먼지 그래프·90쪽 롤러코스터(그래프 읽기 — ①24·①30의 생각 열기 부분), 116쪽 거리-시간 그래프에서 순간 찾기(①23의 활동 부분).
//  - 옆 단원(11-2-5) 몫인 부분: ①31 교점4의 「개형을 그리시오」, ①41 수행 과제의 「x ≥ 2일 때 f(x) ≥ 2」「그래프가 x축에 접한다」 카드.
//  - 겹침(같은 일): ①4 교대8(직선 y = x + k가 삼차곡선에 접할 때 양수 k — tan-parallel 의 둘째 꼴과 같은 일), ①7 대7·소1-4의 x절편(접선을 구한 뒤
//    대입만 한다), ①17 교과서 84쪽 생각 열기(두 점을 지나는 직선에 평행한 접선 — 평균값 정리의 c와 같은 셈), ①18 소2-3·기말1(이차함수의 c는
//    구간의 가운데라 mvt-back 의 첫째 꼴과 같은 일), ①28 교대11(정수 a의 합 — 정수의 개수와 같은 일), ①30 개념 확인, ①37 기3-4⑴(경계만 근호).
// 바꾼 것(원문의 묻는 꼴을 바꾸어 실음): ①14 용어 빈칸 → 차례로 나열한 것 고르기, ①19 이차함수라 늘 1/2인 k → 삼차함수의 θ, ①20 생각 넓히기의 설명 →
//  까닭 고르기, ①23 창의·연결 → 반드시 옳은 것 고르기, ①27 증가·감소 구간 → 옳은 것 고르기, ①34 기말22 → 부정적분 대신 삼차식 계수 비교(실력),
//  ①41 수행 과제 → 조건을 모두 만족시키는 것 고르기.
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」
// 문자를 부르는 말: 값 하나를 물으면 「상수 a」, 범위·최댓값·최솟값을 물으면 「실수 a」.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, box, N, M, C, inline } = B.kit;
  const { LAB, MINUS, gcd, Q, tx, mag, js, asQ, nb, V, sup, nz, poly, grp, rt, radAns, sqParts } = B.kit.mid;
  const { ms, df, plot, jh, qAns } = B.kit.hs;
  const S5 = '12미적Ⅰ-02-05', S6 = '12미적Ⅰ-02-06', S7 = '12미적Ⅰ-02-07';

  // ── 검사 근거 마무리 ──
  // 문항에서 보이는 수(검사와 같은 방법으로 읽는다): 글·그림(그림 설명 포함)·보기
  const stripH = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  function visibleNumbers(item) {
    const seen = stripH([item.text, item.figure || ''].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, ' $1 ').replace(/<table[^>]*aria-label="([^"]*)"[^>]*>/g, ' $1 | '));
    return new Set((seen.match(/\d+/g) || []).concat(seen.match(/\d+\.\d+/g) || [], seen.replace(/(\d) (?=\d)/g, '$1').match(/\d+/g) || []));
  }
  // 다시 셈하는 식의 수 가운데 글에 보이지 않는 수를 facts.unseen 에 밝힌다. 0과 1과 facts.derived 로 밝히기로 한 수(풀이 도중에 나오는 수)만 된다.
  function seal(item) {
    // 셈이 0으로 끝나는 식은 −0이 될 수 있다. 검사는 −0과 0을 가르므로 +0 을 붙여 0으로 맞춘다.
    if (item.facts && item.facts.calc) item.facts.calc = item.facts.calc.map(([t, i]) => [`(${t})+0`, i]);
    const f = item.facts || {}, derived = new Set((f.derived || []).map((v) => Math.abs(Number(v))).concat([0, 1])), shown = visibleNumbers(item), out = new Set(f.unseen || []);
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
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make: retry(make) }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 기본 자료(' + ref + ')', make: retry(make) }, more || {});

  // ── 글 ──
  const X = V('x'), Y = V('y'), Av = V('a'), Bv = V('b'), Cv = V('c'), Kv = V('k'), Tv = V('t'), TH = V('θ'), Fv = V('f');
  const FP = df('f');                                                       // f′
  const iq = (n) => tx(asQ(n));                                             // 화면에 적는 수(음수는 −, 분수는 분수 꼴)
  const jn = (n) => js(asQ(n));                                             // 검사 식에 적는 수((-3), (3/4))
  const sgnT = (n) => { const q = asQ(n); return `${q.p < 0 ? MINUS : '+'} ${mag(q)}`; };   // 「+ 3」「− 3」
  const is = (l, r) => nb(`${l} = ${typeof r === 'string' ? r : iq(r)}`);
  const pt = (x, y) => nb(`(${typeof x === 'string' ? x : iq(x)}, ${typeof y === 'string' ? y : iq(y)})`);
  const iv = (a, b, open) => nb(`${open ? '(' : '['}${typeof a === 'string' ? a : iq(a)}, ${typeof b === 'string' ? b : iq(b)}${open ? ')' : ']'}`);   // 구간 [a, b], (a, b)
  const yIs = (h) => nb(`${Y} = ${h}`);
  const lineT = (m, k) => yIs(poly([[m, X], [k, '']]));
  const coefT = (m) => (m === 1 ? '' : m === -1 ? MINUS : iq(m));          // 곱하는 수(1은 적지 않는다)
  // 점 (p, q)를 지나고 기울기가 m인 직선: y = m(x − p) + q
  const psT = (m, p, q) => yIs(`${coefT(m)}${p === 0 ? X : `${facT(p)}`}${q === 0 ? '' : ' ' + sgnT(q)}`);

  // ── 다항식(오름차순 계수의 배열: [상수항, x의 계수, x²의 계수, …]) ──
  const pz = (a) => { const out = a.slice(); while (out.length > 1 && out[out.length - 1] === 0) out.pop(); return out.length ? out : [0]; };
  const padd = (a, b) => pz(Array.from({ length: Math.max(a.length, b.length) }, (_, i) => (a[i] || 0) + (b[i] || 0)));
  const pscale = (a, k) => pz(a.map((c) => c * k));
  const psub = (a, b) => padd(a, pscale(b, -1));
  const pmul = (a, b) => { const out = Array(a.length + b.length - 1).fill(0); a.forEach((x, i) => b.forEach((y, j) => { out[i + j] += x * y; })); return pz(out); };
  const pval = (a, x) => a.reduce((s, c, i) => s + c * x ** i, 0);
  const pder = (a) => pz(a.slice(1).map((c, i) => c * (i + 1)));
  const fromRoots = (rs, lead) => rs.reduce((acc, r) => pmul(acc, [-r, 1]), [lead == null ? 1 : lead]);
  const ptext = (a, v) => poly(a.map((c, i) => [c, i === 0 ? '' : (v || X) + (i > 1 ? sup(i) : '')]).reverse());
  const fIs = (a, name) => nb(`${V(name || 'f')}(${X}) = ${ptext(a)}`);
  const yP = (a) => yIs(ptext(a));
  const big = (a) => Math.max(...a.map(Math.abs));
  // 검사 식: f(p)의 값, f′(p)의 값(문제에 적힌 계수와 p 로)
  //  (e 는 x 자리에 넣을 식 글 — 괄호로 묶어 넘긴다)
  //  거듭제곱은 곱으로 풀어 적는다(지수의 수가 글에 없을 수 있다).
  const times = (e, k) => Array(k).fill(e).join('*');
  const valExprE = (a, e) => a.map((c, i) => (c === 0 ? '' : i === 0 ? jn(c) : `${jn(c)}*${times(e, i)}`)).filter(Boolean).join('+') || '0';
  const derExprE = (a, e) => a.map((c, i) => (c === 0 || i === 0 ? '' : i === 1 ? jn(c) : `${i}*${jn(c)}*${times(e, i - 1)}`)).filter(Boolean).join('+') || '0';
  const valExpr = (a, p) => valExprE(a, jn(p)), derExpr = (a, p) => derExprE(a, jn(p));
  const par = (n) => (n < 0 ? `(${iq(n)})` : iq(n));                     // 음수는 괄호에
  const facT = (r, v) => (r === 0 ? (v || X) : `(${poly([[1, v || X], [-r, '']])})`);   // 인수 (x − r) — r = 0 이면 x

  // ── 근호가 든 수 (a + b√m)/den ──
  function surd(a, b, m, den) {
    const [s, r] = m > 0 ? sqParts(m) : [0, 1];
    if (r === 1 || b === 0) { const q = Q(a + b * s, den); return { v: (a + b * s) / den, h: iq(q), rat: true }; }
    let A = a, Bc = b * s, Dn = den;
    if (Dn < 0) { A = -A; Bc = -Bc; Dn = -Dn; }
    const g = gcd(gcd(Math.abs(A), Math.abs(Bc)), Dn) || 1; A /= g; Bc /= g; Dn /= g;
    const rad = (Math.abs(Bc) === 1 ? '' : Math.abs(Bc)) + rt(r);
    const num = A === 0 ? (Bc < 0 ? MINUS : '') + rad : `${iq(A)} ${Bc < 0 ? MINUS : '+'} ${rad}`;
    const h = Dn === 1 ? num : A === 0 && Bc < 0 ? MINUS + frac(rad, Dn) : frac(num, Dn);
    return { v: (A + Bc * Math.sqrt(r)) / Dn, h: nb(h), rat: false };
  }
  // 이차방정식 A x² + Bx + C = 0 의 두 근(작은 것, 큰 것)
  const quadRoots = (A, Bq, Cq) => { const D = Bq * Bq - 4 * A * Cq; const u = surd(-Bq, -1, D, 2 * A), w = surd(-Bq, 1, D, 2 * A); return u.v < w.v ? [u, w] : [w, u]; };

  // ── 답 ──
  // 접선 「y = [±][ ]x [±][ ]」 — 기울기와 y절편은 0이 아닌 정수
  const lineAns = (text, m, k, o) => inline(text, grp(`${Y} = {0}${X} {1}`), [{ answer: m, signed: true }, { answer: k, signed: true }], Object.assign({}, o, { shown: lineT(m, k) }));
  // 두 접선(묶음째 차례를 바꾸어 적어도 맞다)
  const twoLines = (text, l1, l2, o) => inline(text, `${grp(`${Y} = {0}${X} {1}`)} ${nb('또는')}<br>${grp(`${Y} = {2}${X} {3}`)}`,
    [l1[0], l1[1], l2[0], l2[1]].map((v) => ({ answer: v, signed: true })), Object.assign({}, o, { blocks: [[0, 1], [2, 3]], shown: `${lineT(l1[0], l1[1])} 또는 ${lineT(l2[0], l2[1])}` }));
  // 문자의 값 여럿: 「a = [±][ ]  b = [±][ ]」(셋째 원소가 참이면 부호 단추 없이)
  const vals = (text, pairs, o) => M(text, pairs.map(([lead, answer, bare]) => ({ lead: lead + ' =', answer, signed: !bare })), Object.assign({}, o, { shown: pairs.map(([lead, answer]) => is(lead, answer)).join(', ') }));
  const numAns = (text, v, o) => qAns(text, v, Object.assign({ signed: true }, o));

  // ── 고르기 ──
  // 보기 다섯(글)을 받아 고르기로: 정답 하나, 보기는 서로 다르다.
  function pick5(d, text, right, wrongs, o) {
    const pool = d.shuffle(wrongs.filter((w, i, all) => stripH(w) !== stripH(right) && all.findIndex((v) => stripH(v) === stripH(w)) === i)).slice(0, 4);
    if (pool.length < 4) return null;
    const rows = d.shuffle([right].concat(pool));
    return C(text, rows, rows.indexOf(right), Object.assign({}, o, { facts: Object.assign({ truth: rows.map((r) => r === right), want: true }, (o && o.facts) || {}) }));
  }
  // 수 보기 다섯({ h, v }): 값이 서로 다른 것만 남긴다. 정답은 right.
  function pickNum(d, text, right, wrongs, o) {
    const keep = [right];
    for (const w of d.shuffle(wrongs)) if (keep.length < 5 && keep.every((k) => Math.abs(k.v - w.v) > 1e-9 && stripH(k.h) !== stripH(w.h))) keep.push(w);
    if (keep.length < 5) return null;
    const rows = d.shuffle(keep);
    return C(text, rows.map((r) => r.h), rows.indexOf(right), Object.assign({}, o, { facts: Object.assign({ truth: rows.map((r) => r === right), want: true }, (o && o.facts) || {}) }));
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

  // ── 수 고르기 ──
  const span = (lo, hi) => { const a = []; for (let i = lo; i <= hi; i += 1) a.push(i); return a; };
  // 그래프: 원점 왼쪽에 눈금 글(−1 따위)이 있으면 원점의 이름 O 를 오른쪽 아래에 둔다(「−1」과 「O」가 붙어 「−10」으로 읽히지 않게).
  const plotO = (o) => { const xs = (o.xt || []).map((t) => (typeof t === 'number' ? t : t.v)).concat((o.dots || []).filter((p) => p.xl).map((p) => p.x)); return plot(Object.assign(xs.some((v) => v < 0) ? { oSide: 'r' } : {}, o)); };

  B.kit.u24x = {
    S5, S6, S7, stripH, seal, retry, T, H, X, Y, Av, Bv, Cv, Kv, Tv, TH, Fv, FP, iq, jn, sgnT, is, pt, iv, yIs, lineT, coefT, psT,
    pz, padd, pscale, psub, pmul, pval, pder, fromRoots, ptext, fIs, yP, big, valExprE, derExprE, valExpr, derExpr, par, facT, surd, quadRoots,
    lineAns, twoLines, vals, numAns, pick5, pickNum, GA, comboPick, span, plotO
  };

  // ════════════════════════════════════════════════════════════════
  // 접선의 방정식
  // ════════════════════════════════════════════════════════════════
  // 곡선 y = f(x) 위의 점 (p, f(p))에서의 접선을 구하는 풀이 줄
  const tanTold = (a, p) => { const da = pder(a), m = pval(da, p), fp = pval(a, p); return `${jh(fIs(a), '이라/라')} 하면 ${FP}(${X}) = ${ptext(da)}이므로 점 ${pt(p, fp)}에서의 접선의 기울기는 ${FP}(${iq(p)}) = ${iq(m)}이다. 따라서 접선의 방정식은 ${psT(m, p, fp)}, 곧 ${lineT(m, fp - m * p)}이다.`; };

  const tan = [
    T('tan-point', '곡선 위의 한 점에서의 접선의 방정식', '①1', (d, n) => {
      const p = nz(d, -3, 3);
      const a = n === 0 ? [d.int(-6, 6), d.int(-6, 6), d.pick([-2, -1, 1, 2])] : [d.int(-6, 6), d.int(-5, 5), d.int(-4, 4), d.pick([-1, 1])];
      const fp = pval(a, p), m = pval(pder(a), p), k = fp - m * p;
      if (!m || !k || Math.abs(fp) > 60 || Math.abs(m) > 40 || Math.abs(k) > 60 || (n === 1 && !a[2])) return null;
      const mE = derExpr(a, p);
      return lineAns(`곡선 ${yP(a)} 위의 점 ${pt(p, fp)}에서의 접선의 방정식은?`, m, k, {
        explain: tanTold(a, p), facts: { calc: [[mE, 0], [`${jn(fp)}-(${mE})*${jn(p)}`, 1]] } });
    }, { count: 2, standard: S5 }),
    T('tan-coef', '접점과 접선의 조건으로 곡선의 계수 구하기', '①2', (d, n) => {
      if (n === 0) {
        // 곡선 y = x² + ax + k0 위의 점 (p, q)에서의 접선이 y = bx + c
        const p = nz(d, -3, 3), a = nz(d, -6, 6), k0 = nz(d, -6, 6), q = p * p + a * p + k0, b = 2 * p + a, c = q - b * p;
        if (!b || !c || Math.abs(q) > 40) return null;
        const aE = `(${jn(q)}-${jn(p)}*${jn(p)}-${jn(k0)})/${jn(p)}`, bE = `2*${jn(p)}+${aE}`;
        return vals(`곡선 ${yIs(`${X}${sup(2)} + ${Av}${X} ${sgnT(k0)}`)} 위의 점 ${pt(p, q)}에서의 접선의 방정식이 ${yIs(`${Bv}${X} + ${Cv}`)}일 때, 상수 ${Av}, ${Bv}, ${Cv}의 값은?`, [[Av, a], [Bv, b], [Cv, c]], {
          explain: `점 ${jh(pt(p, q), '이/가')} 곡선 위에 있으므로 ${is(iq(q), `${par(p)}${sup(2)} + ${par(p)}${Av} ${sgnT(k0)}`)}에서 ${is(Av, a)}이다. ${is(`${Y}′`, poly([[2, X], [a, '']]))}이므로 접선의 기울기는 ${is(Bv, `2 × ${par(p)} ${sgnT(a)}`)} = ${iq(b)}이고, 접선은 ${psT(b, p, q)}, 곧 ${lineT(b, c)}이므로 ${is(Cv, c)}이다.`,
          facts: { calc: [[aE, 0], [bE, 1], [`${jn(q)}-(${bE})*${jn(p)}`, 2]] } });
      }
      // 곡선 y = −x² + ax + b 위의 점 (p, q)에서의 접선이 점 (r, s)를 지난다
      const a = nz(d, -6, 6), b = nz(d, -6, 6), p = nz(d, -3, 3), q = -p * p + a * p + b, m = -2 * p + a, t = nz(d, -3, 3), r = p + t, s = q + m * t;
      if (!m || Math.abs(q) > 30 || Math.abs(s) > 40) return null;
      const mE = `(${jn(s)}-${jn(q)})/(${jn(r)}-${jn(p)})`, aE = `${mE}+2*${jn(p)}`;
      return vals(`곡선 ${yIs(`${MINUS}${X}${sup(2)} + ${Av}${X} + ${Bv}`)} 위의 점 ${pt(p, q)}에서의 접선이 점 ${jh(pt(r, s), '을/를')} 지날 때, 상수 ${Av}, ${Bv}의 값은?`, [[Av, a], [Bv, b]], {
        explain: `접선은 두 점 ${pt(p, q)}, ${jh(pt(r, s), '을/를')} 지나므로 기울기는 ${frac(`${iq(s)} ${MINUS} ${par(q)}`, `${iq(r)} ${MINUS} ${par(p)}`)} = ${iq(m)}이다. ${is(`${Y}′`, poly([[-2, X], [1, Av]]))}이므로 ${is(`${iq(-2 * p)} + ${Av}`, m)}에서 ${is(Av, a)}이고, 점 ${jh(pt(p, q), '이/가')} 곡선 위에 있으므로 ${is(Bv, b)}이다.`,
        facts: { calc: [[aE, 0], [`${jn(q)}+${jn(p)}*${jn(p)}-(${aE})*${jn(p)}`, 1]] } });
    }, { count: 2, standard: S5 }),
    T('tan-given', '접선이 주어진 직선일 때 접점과 상수 구하기', '①3', (d) => {
      // f(x) = x³ + Px² + Qx + a, 곡선 위의 점 (t, f(t))에서의 접선이 y = mx + Ka. f′(x) − m = 3(x − t0)² 이 되게 짓는다.
      const t0 = d.pick([-2, -1, 1, 2]), K = d.pick([2, 3]);
      if (K === 3 && t0 % 2) return null;
      const a = t0 ** 3 / (K - 1), m = nz(d, -6, 6), P = -3 * t0, Qc = m + 3 * t0 * t0;
      if (!Qc) return null;
      const tE = `(0-${jn(P)})/3`;
      const ft = t0 ** 3 + P * t0 * t0 + Qc * t0;   // f(t0) − a
      return vals(`함수 ${nb(`${Fv}(${X}) = ${ptext([0, Qc, P, 1])} + ${Av}`)}에 대하여 곡선 ${is(Y, `${Fv}(${X})`)} 위의 점 ${pt(Tv, `${Fv}(${Tv})`)}에서의 접선의 방정식이 ${yIs(`${poly([[m, X]])} + ${K}${Av}`)}일 때, ${Tv}와 상수 ${Av}의 값은?`, [[Tv, t0], [Av, a]], {
        explain: `${FP}(${X}) = ${ptext([Qc, 2 * P, 3])}이고 접선의 기울기가 ${iq(m)}이므로 ${is(`${FP}(${Tv})`, m)}에서 ${is(`3${facT(t0, Tv)}${sup(2)}`, 0)}, 곧 ${is(Tv, t0)}이다. 접점은 ${pt(t0, ft === 0 ? Av : `${iq(ft)} + ${Av}`)}이므로 접선은 ${yIs(`${poly([[m, X]])} ${sgnT(t0 ** 3)} + ${Av}`)}이다. 이것이 ${yIs(`${poly([[m, X]])} + ${K}${Av}`)}와 같으므로 ${is(`${iq(t0 ** 3)} + ${Av}`, `${K}${Av}`)}에서 ${is(Av, a)}이다.`,
        facts: { calc: [[tE, 0], [`(${tE})*(${tE})*(${tE})/(${K}-1)`, 1]] } });
    }, { standard: S5 }),
    T('tan-slope', '기울기가 주어진 접선의 방정식', '①4', (d, n) => {
      if (n === 0) {
        const A = d.pick([-2, -1, 1, 2]), x0 = nz(d, -3, 3), b = d.int(-6, 6), c = d.int(-6, 6), m = 2 * A * x0 + b, k = c - A * x0 * x0, a = [c, b, A];
        if (!m || !k) return null;
        const xE = `(${jn(m)}-${jn(b)})/(2*${jn(A)})`;
        return lineAns(`곡선 ${yP(a)}에 접하고 기울기가 ${iq(m)}인 직선의 방정식은?`, m, k, {
          explain: `접점의 ${X}좌표를 ${Tv}라 하면 ${is(`${Y}′`, ptext(pder(a)))}이므로 ${is(ptext(pder(a), Tv), m)}에서 ${is(Tv, x0)}이다. 접점은 ${pt(x0, pval(a, x0))}이므로 접선은 ${psT(m, x0, pval(a, x0))}, 곧 ${lineT(m, k)}이다.`,
          facts: { calc: [[jn(m), 0], [`${jn(c)}-${jn(A)}*(${xE})*(${xE})`, 1]] } });
      }
      // 삼차곡선: f′(x) − m = 3(x − r1)(x − r2) — 접선이 둘
      const r1 = d.int(-3, 2), r2 = d.int(r1 + 1, 3), m = nz(d, -6, 6);
      if ((r1 + r2) % 2) return null;
      const a = [d.int(-6, 6), m + 3 * r1 * r2, -3 * (r1 + r2) / 2, 1], k1 = pval(a, r1) - m * r1, k2 = pval(a, r2) - m * r2;
      if (!k1 || !k2 || k1 === k2 || Math.abs(k1) > 60 || Math.abs(k2) > 60) return null;
      return inline(`곡선 ${yP(a)}에 접하고 기울기가 ${iq(m)}인 직선은 두 개이다. 두 직선의 방정식은?`, `${grp(`${Y} = ${poly([[m, X]])} {0}`)} ${nb('또는')} ${grp(`${Y} = ${poly([[m, X]])} {1}`)}`,
        [{ answer: k1, signed: true }, { answer: k2, signed: true }], { unordered: true, shown: `${lineT(m, k1)} 또는 ${lineT(m, k2)}`,
          explain: `접점의 ${X}좌표를 ${Tv}라 하면 ${is(ptext(pder(a), Tv), m)}에서 ${is(ptext(psub(pder(a), [m]), Tv), 0)}, 곧 ${is(Tv, r1)} 또는 ${is(Tv, r2)}이다. 접점 ${pt(r1, pval(a, r1))}, ${jh(pt(r2, pval(a, r2)), '에서/에서')}의 접선은 ${lineT(m, k1)}, ${lineT(m, k2)}이다.`,
          facts: { calc: [[`${valExpr(a, r1)}-${jn(m)}*${jn(r1)}`, 0], [`${valExpr(a, r2)}-${jn(m)}*${jn(r2)}`, 1]], derived: [r1, r2] } });
    }, { count: 2, standard: S5 }),
    T('tan-parallel', '주어진 직선에 평행한 접선의 방정식', '①4', (d, n) => {
      const m = nz(d, -6, 6), k0 = nz(d, -8, 8);
      if (n === 0) {
        const A = d.pick([-3, -1, 1, 2, 3]), x0 = nz(d, -3, 3), b = m - 2 * A * x0, c = d.int(-6, 6), a = [c, b, A], k = c - A * x0 * x0;
        if (!k || k === k0 || Math.abs(b) > 12) return null;
        return lineAns(`곡선 ${yP(a)}에 접하고 직선 ${lineT(m, k0)}에 평행한 직선의 방정식은?`, m, k, {
          explain: `평행한 두 직선은 기울기가 같으므로 접선의 기울기는 ${iq(m)}이다. 접점의 ${X}좌표를 ${Tv}라 하면 ${is(ptext(pder(a), Tv), m)}에서 ${is(Tv, x0)}이고 접점은 ${pt(x0, pval(a, x0))}이므로 ${psT(m, x0, pval(a, x0))}, 곧 ${lineT(m, k)}이다.`,
          facts: { calc: [[jn(m), 0], [`${jn(c)}-${jn(A)}*((${jn(m)}-${jn(b)})/(2*${jn(A)}))**2`, 1]] } });
      }
      // 삼차곡선에 평행한 접선은 둘 — 「y절편이 양수」로 하나를 고른다
      const r1 = d.int(-3, 2), r2 = d.int(r1 + 1, 3);
      if ((r1 + r2) % 2) return null;
      const a = [d.int(-6, 6), m + 3 * r1 * r2, -3 * (r1 + r2) / 2, 1], ks = [r1, r2].map((r) => pval(a, r) - m * r);
      if (ks.some((k) => !k || k === k0 || Math.abs(k) > 60) || ks.filter((k) => k > 0).length !== 1) return null;
      const at = ks[0] > 0 ? 0 : 1, r = [r1, r2][at], k = ks[at];
      return vals(`곡선 ${yP(a)}에 접하고 직선 ${lineT(m, k0)}에 평행한 직선의 방정식을 ${yIs(`${Av}${X} + ${Bv}`)}라 할 때, 상수 ${Av}, ${Bv}의 값은? (단, ${Bv} &gt; 0)`, [[Av, m], [Bv, k]], {
        explain: `접점의 ${X}좌표를 ${Tv}라 하면 ${is(ptext(pder(a), Tv), m)}에서 ${is(Tv, r1)} 또는 ${is(Tv, r2)}이다. 두 접선은 ${lineT(m, ks[0])}, ${jh(lineT(m, ks[1]), '이고/이고')} ${Bv} &gt; 0이므로 ${is(Av, m)}, ${is(Bv, k)}이다.`,
        facts: { calc: [[jn(m), 0], [`${valExpr(a, r)}-${jn(m)}*${jn(r)}`, 1]], derived: [r] } });
    }, { count: 2, standard: S5 }),
    T('tan-minslope', '접선 가운데 기울기가 가장 작은(큰) 직선의 방정식', '①5', (d) => {
      const s = d.pick([1, -1]), x0 = d.int(-2, 2), b = -3 * s * x0, c = d.int(-6, 9), dd = d.int(-6, 6), a = [dd, c, b, s];
      const m = pval(pder(a), x0), k = pval(a, x0) - m * x0;
      if (!m || !k || !x0) return null;
      const xE = `((0-${jn(b)})/(3*${jn(s)}))`, mE = derExprE(a, xE);
      const word = s > 0 ? '작은' : '큰';
      return lineAns(`곡선 ${yP(a)}에 접하는 직선 가운데 기울기가 가장 ${word} 직선의 방정식은?`, m, k, {
        explain: `접점의 ${X}좌표가 ${Tv}일 때 접선의 기울기는 ${is(`${FP}(${Tv})`, ptext(pder(a), Tv))} = ${nb(`${coefT(3 * s)}${facT(x0, Tv)}${sup(2)} ${sgnT(m)}`)}이므로 ${is(Tv, x0)}일 때 기울기가 가장 ${s > 0 ? '작고' : '크고'} 그 값은 ${iq(m)}이다. 접점은 ${pt(x0, pval(a, x0))}이므로 ${psT(m, x0, pval(a, x0))}, 곧 ${lineT(m, k)}이다.`,
        facts: { calc: [[mE, 0], [`${valExprE(a, xE)}-(${mE})*${xE}`, 1]] } });
    }, { standard: S5 }),
    T('tan-from', '곡선 밖의 한 점에서 곡선에 그은 접선', '①7', (d, n) => {
      if (n === 0) {
        // 이차곡선: 접점 t1, t2 의 가운데가 p
        const A = d.pick([-2, -1, 1, 2]), b = d.int(-5, 5), c = d.int(-6, 6), t1 = d.int(-4, 2), t2 = d.int(t1 + 1, 4);
        if ((t1 + t2) % 2) return null;
        const p = (t1 + t2) / 2, q = A * t1 * t2 + b * p + c, a = [c, b, A];
        const ls = [t1, t2].map((t) => [2 * A * t + b, c - A * t * t]);
        if (ls.some(([m, k]) => !m || !k) || Math.abs(q) > 40 || (ls[0][0] === -ls[1][0] && ls[0][1] === -ls[1][1])) return null;   // 부호를 모두 뒤집은 답이 맞게 되는 짝은 버린다
        const E = (t) => [`2*${jn(A)}*${jn(t)}+${jn(b)}`, `${jn(c)}-${jn(A)}*${jn(t)}*${jn(t)}`];
        return twoLines(`점 ${jh(pt(p, q), '에서/에서')} 곡선 ${yP(a)}에 그은 두 접선의 방정식은?`, ls[0], ls[1], {
          explain: `접점을 ${pt(Tv, ptext(a, Tv))}이라 하면 접선은 ${yIs(`(${ptext(pder(a), Tv)})(${X} ${MINUS} ${Tv}) + ${A < 0 ? `(${ptext(a, Tv)})` : ptext(a, Tv)}`)}이다. 이 접선이 점 ${jh(pt(p, q), '을/를')} 지나므로 ${is(ptext(pmul([-t1, 1], [-t2, 1]), Tv), 0)}에서 ${is(Tv, t1)} 또는 ${is(Tv, t2)}이다. 따라서 접선은 ${lineT(...ls[0])} 또는 ${lineT(...ls[1])}이다.`,
          facts: { calc: [[E(t1)[0], 0], [E(t1)[1], 1], [E(t2)[0], 2], [E(t2)[1], 3]], derived: [t1, t2] } });
      }
      if (n === 1) {
        // 삼차곡선: 접점의 x좌표 t 에 대한 삼차방정식이 실근 하나(나머지 둘은 허근)
        const p = d.int(-2, 2), t0 = d.int(-3, 3), u = d.int(-6, 6);
        if (t0 === p) return null;
        const b = 3 * p + 2 * (u - t0), v = u * t0 - b * p;
        if (u * u >= 4 * v || Math.abs(b) > 9) return null;
        const c = d.int(-6, 6), dd = d.int(-6, 6), q = c * p + dd - 2 * v * t0, a = [dd, c, b, 1];
        const m = pval(pder(a), t0), k = pval(a, t0) - m * t0;
        if (!m || !k || Math.abs(q) > 60 || Math.abs(k) > 80) return null;
        // 접선이 (p, q)를 지나는 조건: −2t³ + (3p − b)t² + 2bp t + (cp + d − q) = 0, 곧 2(t − t0)(t² + ut + v) = 0
        const gq = pscale([c * p + dd - q, 2 * b * p, 3 * p - b, -2], -1);
        if (gq.join() !== pscale(pmul([-t0, 1], [v, u, 1]), 2).join()) return null;
        const mE = derExpr(a, t0);
        return lineAns(`점 ${jh(pt(p, q), '에서/에서')} 곡선 ${yP(a)}에 그은 접선의 방정식은?`, m, k, {
          explain: `접점을 ${pt(Tv, `${Fv}(${Tv})`)}라 하면 접선은 ${yIs(`${FP}(${Tv})(${X} ${MINUS} ${Tv}) + ${Fv}(${Tv})`)}이다. 점 ${jh(pt(p, q), '을/를')} 지나므로 ${is(ptext(gq, Tv), 0)}, 곧 ${is(nb(`2${facT(t0, Tv)}(${ptext([v, u, 1], Tv)})`), 0)}이다. ${ptext([v, u, 1], Tv)} = 0은 실근이 없으므로 ${is(Tv, t0)}이고, 접선은 ${psT(m, t0, pval(a, t0))}, 곧 ${lineT(m, k)}이다.`,
          facts: { calc: [[mE, 0], [`${valExpr(a, t0)}-(${mE})*${jn(t0)}`, 1]], derived: [t0] } });
      }
      // 삼차곡선: t 에 대한 삼차방정식이 중근(변곡점의 x좌표)과 한 근 — 접선이 둘
      const t1 = d.int(-2, 2), p = d.int(-3, 3);
      if (p === t1 || (3 * p - t1) % 2) return null;
      const t2 = (3 * p - t1) / 2, b = -3 * t1, c = d.int(-6, 6), dd = d.int(-6, 6), a = [dd, c, b, 1];
      const tq = (t) => pval(a, t) + pval(pder(a), t) * (p - t), q = tq(t1);
      const ks = [t1, t2].map((t) => pval(a, t) - pval(pder(a), t) * t);
      if (ks.some((k) => !k) || ks[0] === ks[1] || Math.abs(q) > 60 || Math.abs(ks[1]) > 99 || Math.abs(t2) > 5) return null;
      const kE = (t) => `${valExpr(a, t)}-(${derExpr(a, t)})*${jn(t)}`;
      return M(`점 ${jh(pt(p, q), '에서/에서')} 곡선 ${yP(a)}에 그은 접선은 두 개이다. 두 접선의 ${Y}절편은?`, [{ answer: ks[0], signed: true }, { answer: ks[1], signed: true }], {
        unordered: true, shown: `${iq(ks[0])}, ${iq(ks[1])}`,
        explain: `접점을 ${pt(Tv, `${Fv}(${Tv})`)}라 하면 접선 ${yIs(`${FP}(${Tv})(${X} ${MINUS} ${Tv}) + ${Fv}(${Tv})`)}가 점 ${jh(pt(p, q), '을/를')} 지나므로 ${is(nb(`${MINUS}2${facT(t1, Tv)}${sup(2)}${facT(t2, Tv)}`), 0)}, 곧 ${is(Tv, t1)} 또는 ${is(Tv, t2)}이다. 두 접선은 ${lineT(pval(pder(a), t1), ks[0])}, ${jh(lineT(pval(pder(a), t2), ks[1]), '이므로/이므로')} ${Y}절편은 ${iq(ks[0])}, ${iq(ks[1])}이다.`,
        facts: { calc: [[kE(t1), 0], [kE(t2), 1]], derived: [t1, t2] } });
    }, { count: 3, standard: S5 }),
    T('tan-meet', '접선이 곡선과 다시 만나는 점까지의 거리', '①10', (d) => {
      const p = d.int(-2, 2), b = d.int(-6, 6), c = d.int(-8, 8), dd = d.int(-6, 6), a = [dd, c, b, 1], r = -b - 2 * p;
      if (r === p) return null;
      const m = pval(pder(a), p), k = pval(a, p) - m * p;
      if (!m || Math.abs(m) > 9 || Math.abs(pval(a, p)) > 40 || Math.abs(pval(a, r)) > 99) return null;
      const [s, inner] = sqParts(1 + m * m), coef = Math.abs(p - r) * s;
      if (inner < 2) return null;
      const A = pt(p, pval(a, p)), Bp = pt(r, pval(a, r));
      return radAns(`곡선 ${yP(a)} 위의 점 A${A}에서의 접선이 이 곡선과 만나는 점 가운데 A가 아닌 점을 B라 할 때, 선분 AB의 길이는?`, coef, inner, {
        explain: `점 A에서의 접선은 ${lineT(m, k)}이다. ${is(ptext(a), poly([[m, X], [k, '']]))}에서 ${is(nb(`${p === 0 ? X : `${facT(p)}`}${sup(2)}${facT(r)}`), 0)}이므로(접점의 ${X}좌표 ${jh(iq(p), "은/는")} 중근) 점 B는 ${jh(Bp, '이다/이다')}. 따라서 AB = ${rt(`${par(r - p)}${sup(2)} + ${par(pval(a, r) - pval(a, p))}${sup(2)}`)} = ${coef === 1 ? '' : coef}${rt(inner)}이다.`,
        facts: { calc: coef === 1 ? [[String(inner), 0]] : [[`(${Math.max(p, r)}-(${Math.min(p, r)}))*${s}`, 0], [String(inner), 1]],
          derived: [Math.max(p, r), Math.min(p, r), s, inner], check: `AB = |p − r|√(1 + m²), r = −b − 2p, m = ${m}` } });
    }, { standard: S5 })
  ];

  // ════════════════════════════════════════════════════════════════
  // 평균값 정리(롤의 정리 포함)
  // ════════════════════════════════════════════════════════════════
  const fa = ms('f(a)'), fb = ms('f(b)');
  const AB = iv(Av, Bv), ABo = iv(Av, Bv, true);
  const ROLLE = (b1, b2, b3) => `함수 ${ms('f(x)')}가 닫힌구간 ${AB}에서 ${b1}이고 열린구간 ${ABo}에서 ${b2}할 때, ${is(fa, fb)}이면 ${b3} = 0인 ${Cv}가 열린구간 ${ABo}에 적어도 하나 존재한다.`;
  const MEAN = (b1, b2, b3) => `함수 ${ms('f(x)')}가 닫힌구간 ${AB}에서 ${b1}이고 열린구간 ${ABo}에서 ${b2}하면 ${b3} = ${ms("f'(c)")}인 ${Cv}가 열린구간 ${ABo}에 적어도 하나 존재한다.`;
  const SLOPE = frac(ms('f(b) - f(a)'), ms('b - a'));
  // 롤의 정리를 만족시키는 함수: (x − p)(x − q)(x − r) + K
  const mvt = [
    T('mvt-cond', '롤의 정리·평균값 정리의 조건과 식 고르기', '①14', (d, n) => {
      const blanks = lines([n === 0 ? ROLLE(box('㉠'), box('㉡'), box('㉢')) : MEAN(box('㉠'), box('㉡'), box('㉢'))]);
      const fc = ms("f'(c)");
      const row = (a, b, c) => `㉠ ${a}, ㉡ ${b}, ㉢ ${c}`;
      if (n === 0) {
        const right = row('연속', '미분가능', fc);
        const wrongs = [row('미분가능', '연속', fc), row('연속', '미분가능', ms('f(c)')), row('연속', '연속', fc), row('미분가능', '미분가능', fc), row('미분가능', '연속', ms('f(c)')), row('연속', '미분가능', ms("f'(a)"))];
        return pick5(d, `다음은 롤의 정리이다. ㉠, ㉡, ㉢에 알맞은 것을 차례로 나열한 것은?`, right, wrongs, { figure: blanks,
          explain: `닫힌구간에서 연속이고 열린구간에서 미분가능한 함수에서 양 끝의 함숫값이 같으면, 열린구간 안에 접선의 기울기가 0인 점, 곧 ${is(fc, 0)}인 ${Cv}가 있다.` });
      }
      const right = row('연속', '미분가능', SLOPE);
      const wrongs = [row('미분가능', '연속', SLOPE), row('연속', '미분가능', frac(ms('f(b) + f(a)'), ms('b - a'))), row('연속', '미분가능', frac(ms('b - a'), ms('f(b) - f(a)'))),
        row('연속', '연속', SLOPE), row('미분가능', '미분가능', SLOPE), row('연속', '미분가능', frac(ms('f(b) - f(a)'), ms('b + a')))];
      return pick5(d, `다음은 평균값 정리이다. ㉠, ㉡, ㉢에 알맞은 것을 차례로 나열한 것은?`, right, wrongs, { figure: blanks,
        explain: `평균값 정리는 닫힌구간에서 연속이고 열린구간에서 미분가능한 함수에서 두 점 ${pt(Av, fa)}, ${jh(pt(Bv, fb), '을/를')} 잇는 직선의 기울기 ${SLOPE}와 같은 접선의 기울기 ${jh(fc, '을/를')} 갖는 ${Cv}가 열린구간 안에 있다는 정리이다.` });
    }, { count: 2, standard: S6 }),
    T('mvt-rolle', '롤의 정리를 만족시키는 실수 c', '①15', (d, n) => {
      if (n === 0) {
        // 이차함수: 양 끝의 함숫값이 같은 구간의 가운데가 꼭짓점
        const A = d.pick([-3, -2, -1, 1, 2, 3]), h = nz(d, -4, 4), s = d.int(1, 4), k = d.int(-6, 6), a = [A * h * h + k, -2 * A * h, A];
        const lo = h - s, hi = h + s;
        return numAns(`함수 ${fIs(a)}에 대하여 닫힌구간 ${iv(lo, hi)}에서 롤의 정리를 만족시키는 실수 ${Cv}의 값은?`, h, {
          explain: `${jh(fIs(a), '은/는')} 닫힌구간 ${iv(lo, hi)}에서 연속이고 열린구간 ${iv(lo, hi, true)}에서 미분가능하며 ${is(`${Fv}(${iq(lo)})`, `${Fv}(${iq(hi)}) = ${iq(pval(a, lo))}`)}이다. ${is(`${FP}(${Cv})`, poly([[2 * A, Cv], [-2 * A * h, '']]))} = 0에서 ${is(Cv, h)}이다.`,
          facts: { value: `(0-${jn(-2 * A * h)})/(2*${jn(A)})` } });
      }
      // 삼차함수 (x − p)(x − q)(x − r) + K: f′(c) = 0의 두 근 가운데 열린구간 (p, q)에 드는 것은 하나
      const p = d.int(-4, 1), q = d.int(p + 2, 4), r = d.pick([d.int(-6, p), d.int(q, 7)]), K = d.int(-6, 6);
      const a = padd(fromRoots([p, q, r]), [K]);
      if (big(a) > 60) return null;
      const da = pder(a), [u, w] = quadRoots(da[2], da[1], da[0]), inside = [u, w].filter((z) => z.v > p + 1e-9 && z.v < q - 1e-9);
      if (inside.length !== 1) return null;
      const right = inside[0], other = right === u ? w : u, S = p + q + r, P = p * q + q * r + r * p, D = S * S - 3 * P;
      const wrongs = [other, surd(S, 1, D, 6), surd(S, -1, D, 6), surd(-S, 1, D, 3), surd(-S, -1, D, 3), surd(S, 1, D, 1), surd(2 * S, 1, D, 3), surd(S + 1, 1, D, 3)];
      return pickNum(d, `함수 ${fIs(a)}에 대하여 닫힌구간 ${iv(p, q)}에서 롤의 정리를 만족시키는 실수 ${Cv}의 값은?`, right, wrongs, {
        explain: `${is(`${Fv}(${iq(p)})`, `${Fv}(${iq(q)}) = ${iq(K)}`)}이므로 롤의 정리에 의하여 ${is(`${FP}(${Cv})`, 0)}인 ${Cv}가 열린구간 ${iv(p, q, true)}에 있다. ${is(ptext(da, Cv), 0)}에서 ${is(Cv, u.h)} 또는 ${is(Cv, w.h)}이고, 이 가운데 ${iq(p)} &lt; ${Cv} &lt; ${jh(iq(q), '인/인')} 것은 ${jh(right.h, '이다/이다')}.` });
    }, { count: 2, standard: S6 }),
    T('mvt-steps', '롤의 정리·평균값 정리로 c를 구하는 과정의 빈칸', '①16', (d, n) => {
      if (n === 0) {
        // f = (x − p)(x − q)(x − r) + K, f′의 두 근이 정수이고 하나만 열린구간 (p, q)에 든다
        const p = d.int(-4, 1), q = d.int(p + 2, 5), r = d.pick([d.int(-6, p), d.int(q, 7)]), K = nz(d, -6, 6);
        const a = padd(fromRoots([p, q, r]), [K]), da = pder(a), [u, w] = quadRoots(da[2], da[1], da[0]);
        if (!u.rat || !w.rat || !Number.isInteger(u.v) || !Number.isInteger(w.v) || big(a) > 60) return null;
        const inside = [u, w].filter((z) => z.v > p && z.v < q);
        if (inside.length !== 1) return null;
        const c = inside[0].v, out = (inside[0] === u ? w : u).v;
        const proc = `함수 ${jh(fIs(a), '은/는')} 닫힌구간 ${iv(p, q)}에서 연속이고 열린구간 ${iv(p, q, true)}에서 미분가능하며 ${is(`${Fv}(${iq(p)})`, `${Fv}(${iq(q)}) = ${box('㉠')}`)}이므로 롤의 정리에 의하여 ${is(`${FP}(${Cv})`, 0)}인 ${Cv}가 열린구간 ${iv(p, q, true)}에 적어도 하나 존재한다.<br>이때 ${is(`${FP}(${X})`, ptext(da))}이므로 ${is(`${FP}(${Cv})`, 0)}에서 ${is(Cv, box('㉡'))} 또는 ${is(Cv, box('㉢'))}이다. 그런데 ${iq(p)} &lt; ${Cv} &lt; ${jh(iq(q), '이므로/이므로')} ${is(Cv, box('㉢'))}이다.`;
        return M('다음은 롤의 정리를 만족시키는 실수 c의 값을 구하는 과정이다. ㉠, ㉡, ㉢에 알맞은 수는?', [{ label: '㉠', answer: K, signed: true }, { label: '㉡', answer: out, signed: true }, { label: '㉢', answer: c, signed: true }], {
          figure: lines([proc]), shown: `㉠ ${iq(K)}, ㉡ ${iq(out)}, ㉢ ${iq(c)}`,
          explain: `${is(`${Fv}(${iq(p)})`, iq(K))}이고 ${is(ptext(da, Cv), 0)}의 두 근은 ${iq(Math.min(c, out))}, ${jh(iq(Math.max(c, out)), '이다/이다')}. 이 가운데 열린구간 ${iv(p, q, true)}에 드는 것이 ${jh(iq(c), '이다/이다')}.`,
          facts: { calc: [[valExpr(a, p), 0], [jn(out), 1], [jn(c), 2]], derived: [out, c] } });
      }
      // 이차함수에서 평균값 정리
      const A = d.pick([-2, -1, 1, 2, 3]), b = nz(d, -6, 6), cc = d.int(-6, 6), p = d.int(-3, 2), len = 2 * d.int(1, 3), q = p + len, a = [cc, b, A];
      const slope = A * (p + q) + b, c = (p + q) / 2;
      const proc = `함수 ${jh(fIs(a), '은/는')} 닫힌구간 ${iv(p, q)}에서 연속이고 열린구간 ${iv(p, q, true)}에서 미분가능하므로 평균값 정리에 의하여 ${is(frac(`${Fv}(${iq(q)}) ${MINUS} ${Fv}(${iq(p)})`, `${iq(q)} ${MINUS} ${p < 0 ? '(' + iq(p) + ')' : iq(p)}`), `${FP}(${Cv})`)}인 ${Cv}가 열린구간 ${iv(p, q, true)}에 적어도 하나 존재한다.<br>이때 ${is(frac(`${Fv}(${iq(q)}) ${MINUS} ${Fv}(${iq(p)})`, `${iq(q)} ${MINUS} ${p < 0 ? '(' + iq(p) + ')' : iq(p)}`), box('㉠'))}이고 ${is(`${FP}(${Cv})`, `${box('㉡')}${Cv} + ${box('㉢')}`)}이므로 평균값 정리를 만족시키는 실수 ${Cv}의 값은 ${box('㉣')}이다.`;
      return M('다음은 평균값 정리를 만족시키는 실수 c의 값을 구하는 과정이다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?', [slope, 2 * A, b, c].map((v, i) => ({ label: LAB[i], answer: v, signed: true })), {
        figure: lines([proc]), shown: [slope, 2 * A, b, c].map((v, i) => `${LAB[i]} ${iq(v)}`).join(', '),
        explain: `${is(`${Fv}(${iq(q)})`, pval(a, q))}, ${is(`${Fv}(${iq(p)})`, pval(a, p))}이므로 ${frac(`${iq(pval(a, q))} ${MINUS} ${par(pval(a, p))}`, len)} = ${iq(slope)}이다. ${is(`${FP}(${Cv})`, poly([[2 * A, Cv], [b, '']]))}이므로 ${is(poly([[2 * A, Cv], [b, '']]), slope)}에서 ${is(Cv, c)}이다(이차함수에서는 ${Cv}가 늘 구간의 가운데이다).`,
        facts: { calc: [[`(${valExpr(a, q)}-(${valExpr(a, p)}))/(${jn(q)}-${jn(p)})`, 0], [`2*${jn(A)}`, 1], [jn(b), 2], [`(${jn(p)}+${jn(q)})/2`, 3]] } });
    }, { count: 2, standard: S6 }),
    T('mvt-c', '평균값 정리를 만족시키는 실수 c', '①17', (d, n) => {
      if (n === 0) {
        // 이차함수: c = 구간의 가운데(구간의 끝 수를 바꾸어 c가 달라지게)
        const A = d.pick([-3, -2, -1, 1, 2, 3]), b = d.int(-6, 6), cc = d.int(-6, 6), p = d.int(-4, 2), q = d.int(p + 1, 5), a = [cc, b, A];
        if ((p + q) % 2 === 0) return null;
        const slope = A * (p + q) + b;
        return numAns(`함수 ${fIs(a)}에 대하여 닫힌구간 ${iv(p, q)}에서 평균값 정리를 만족시키는 실수 ${Cv}의 값은?`, [p + q, 2], {
          explain: `${frac(`${Fv}(${iq(q)}) ${MINUS} ${Fv}(${iq(p)})`, `${iq(q)} ${MINUS} ${p < 0 ? '(' + iq(p) + ')' : iq(p)}`)} = ${frac(`${iq(pval(a, q))} ${MINUS} ${par(pval(a, p))}`, q - p)} = ${iq(slope)}이고 ${is(`${FP}(${Cv})`, poly([[2 * A, Cv], [b, '']]))}이므로 ${is(poly([[2 * A, Cv], [b, '']]), slope)}에서 ${is(Cv, Q(p + q, 2))}이다. 이차함수에서는 평균값 정리의 ${Cv}가 늘 구간의 가운데 ${frac(`${iq(p)} + ${par(q)}`, 2)}이다.`,
          facts: { value: `(${jn(p)}+${jn(q)})/2` } });
      }
      if (n === 1) {
        // Ax³ + kx + d, 0 ≤ p < q: c² = (p² + pq + q²)/3
        const A = d.pick([-1, 1, 2]), k = d.int(-6, 6), dd = d.int(-5, 5), p = d.int(0, 3), q = d.int(p + 1, 7), a = [dd, k, 0, A];
        const s3 = p * p + p * q + q * q;
        if (s3 % 3) return null;
        const s = s3 / 3, [o, inner] = sqParts(s);
        if (o !== 1 || inner < 2) return null;
        const slope = (pval(a, q) - pval(a, p)) / (q - p);
        return radAns(`함수 ${fIs(a)}에 대하여 닫힌구간 ${iv(p, q)}에서 평균값 정리를 만족시키는 실수 ${Cv}의 값은?`, 1, s, {
          explain: `${frac(`${Fv}(${q}) ${MINUS} ${Fv}(${p})`, `${q} ${MINUS} ${p}`)} = ${frac(`${iq(pval(a, q))} ${MINUS} ${par(pval(a, p))}`, q - p)} = ${iq(slope)}이고 ${is(`${FP}(${Cv})`, ptext(pder(a), Cv))}이므로 ${is(ptext(pder(a), Cv), slope)}에서 ${is(Cv + sup(2), s)}이다. ${p} &lt; ${Cv} &lt; ${jh(String(q), '이므로/이므로')} ${is(Cv, rt(s))}이다.`,
          facts: { calc: [[`(${p}*${p}+${p}*${q}+${q}*${q})/3`, 0]] } });
      }
      // 삼차함수(이차항이 있다): f′(c) = 기울기의 두 근 가운데 열린구간에 드는 것 — 다섯 보기
      const A = d.pick([1, 1, 2, -1]), b = nz(d, -6, 6), cc = d.int(-6, 6), dd = d.int(-5, 5), p = d.int(-3, 1), q = d.int(p + 2, 4), a = [dd, cc, b, A];
      const slope = (pval(a, q) - pval(a, p)) / (q - p);
      if (!Number.isInteger(slope) || big(a) > 40) return null;
      const [u, w] = quadRoots(3 * A, 2 * b, cc - slope), inside = [u, w].filter((z) => z.v > p + 1e-9 && z.v < q - 1e-9);
      if (inside.length !== 1 || u.rat) return null;
      const right = inside[0], other = right === u ? w : u, Dq = 4 * b * b - 12 * A * (cc - slope);
      const wrongs = [other, surd(2 * b, 1, Dq, 6 * A), surd(-2 * b, 1, Dq, 3 * A), surd(-2 * b, -1, Dq, 3 * A), surd(-2 * b, 1, Dq, 2 * A), surd(-2 * b, 1, Dq, 12 * A), surd(2 * b, -1, Dq, 6 * A)];
      return pickNum(d, `함수 ${fIs(a)}에 대하여 닫힌구간 ${iv(p, q)}에서 평균값 정리를 만족시키는 실수 ${Cv}의 값은?`, right, wrongs, {
        explain: `${frac(`${Fv}(${iq(q)}) ${MINUS} ${Fv}(${iq(p)})`, `${iq(q)} ${MINUS} ${p < 0 ? '(' + iq(p) + ')' : iq(p)}`)} = ${iq(slope)}이므로 ${is(ptext(pder(a), Cv), slope)}, 곧 ${is(ptext(psub(pder(a), [slope]), Cv), 0)}에서 ${is(Cv, u.h)} 또는 ${is(Cv, w.h)}이다. 이 가운데 ${iq(p)} &lt; ${Cv} &lt; ${jh(iq(q), '인/인')} 것은 ${jh(right.h, '이다/이다')}.` });
    }, { count: 3, standard: S6 }),
    T('mvt-back', '평균값 정리를 만족시키는 c가 주어질 때 구간의 끝', '①18', (d, n) => {
      if (n === 0) {
        // 이차함수: c는 구간의 가운데이므로 k = 2c − p
        const A = d.pick([-2, -1, 1, 2, 3]), b = d.int(-6, 6), cc = d.int(-6, 6), p = d.int(-4, 2), k = d.int(p + 1, 6), a = [cc, b, A], c = Q(p + k, 2);
        const left = d.bool();
        const lo = left ? Kv : iq(p), hi = left ? iq(k) : Kv, known = left ? k : p, ans = left ? p : k;
        return numAns(`함수 ${fIs(a)}에 대하여 닫힌구간 ${iv(lo, hi)}에서 평균값 정리를 만족시키는 실수가 ${jh(iq(c), '일/일')} 때, 상수 ${Kv}의 값은? ${nb(`(단, ${left ? `${Kv} &lt; ${iq(k)}` : `${Kv} &gt; ${iq(p)}`})`)}`, ans, {
          explain: `이차함수에서는 평균값 정리를 만족시키는 실수가 구간의 가운데이다(${frac(`${Fv}(${Bv}) ${MINUS} ${Fv}(${Av})`, `${Bv} ${MINUS} ${Av}`)} = ${coefT(A)}(${Av} + ${Bv})${b ? ' ' + sgnT(b) : ''}, ${is(`${FP}(${Cv})`, poly([[2 * A, Cv], [b, '']]))}). 따라서 ${is(frac(`${left ? Kv : iq(p)} + ${left ? iq(k) : Kv}`, 2), iq(c))}에서 ${is(Kv, ans)}이다.`,
          facts: { value: `2*${js(c)}-${jn(known)}` } });
      }
      // sx³ + t, 닫힌구간 [a, 0] 또는 [0, b]: 기울기 s·(끝)² = 3s·c² 이므로 끝 = ±√3·c
      const s = d.pick([-2, -1, 1, 2]), t = d.int(-6, 6), m = d.int(1, 4), neg = d.bool(), a = [t, 0, 0, s];
      const cT = (neg ? MINUS : '') + (m === 1 ? frac(rt(3), 3) : frac(`${m}${rt(3)}`, 3));
      const ans = neg ? -m : m, name = neg ? Av : Bv;
      return numAns(`함수 ${fIs(a)}에 대하여 닫힌구간 ${neg ? iv(Av, 0) : iv(0, Bv)}에서 평균값 정리를 만족시키는 실수가 ${jh(nb(cT), '일/일')} 때, 상수 ${name}의 값은? ${nb(`(단, ${name} ${neg ? '&lt;' : '&gt;'} 0)`)}`, ans, {
        explain: neg ? `${frac(`${Fv}(0) ${MINUS} ${Fv}(${Av})`, `0 ${MINUS} ${Av}`)} = ${frac(`${iq(-s)}${Av}${sup(3)}`, `${MINUS}${Av}`)} = ${coefT(s)}${Av}${sup(2)}이고 ${is(`${FP}(${Cv})`, `${coefT(3 * s)}${Cv}${sup(2)}`)}이므로 ${is(`${coefT(s)}${Av}${sup(2)}`, `${iq(3 * s)} × (${nb(cT)})${sup(2)}`)} = ${iq(s * m * m)}이다. ${is(Av + sup(2), m * m)}이고 ${Av} &lt; 0이므로 ${is(Av, ans)}이다.`
          : `${frac(`${Fv}(${Bv}) ${MINUS} ${Fv}(0)`, `${Bv} ${MINUS} 0`)} = ${coefT(s)}${Bv}${sup(2)}이고 ${is(`${FP}(${Cv})`, `${coefT(3 * s)}${Cv}${sup(2)}`)}이므로 ${is(`${coefT(s)}${Bv}${sup(2)}`, `${iq(3 * s)} × (${nb(cT)})${sup(2)}`)} = ${iq(s * m * m)}이다. ${is(Bv + sup(2), m * m)}이고 ${Bv} &gt; 0이므로 ${is(Bv, ans)}이다.`,
        facts: { value: neg ? `0-${m}` : String(m) } });
    }, { count: 2, standard: S6 }),
    T('mvt-theta', '평균값 정리의 다른 꼴 f(p + h) = f(p) + hf′(p + θh)의 θ', '①19', (d) => {
      // f′(x) − (기울기) = 3(x − c0)(x − c1) 이 되게 이차항의 계수 b 를 고른다. θ = (c0 − p)/h.
      const p = d.int(-2, 2), h = d.int(2, 6), j = d.int(1, h - 1), c0 = p + j, den = 2 * c0 - 2 * p - h;
      if (!den) return null;
      const num = 3 * p * p + 3 * p * h + h * h - 3 * c0 * c0;
      if (num % den) return null;
      const b = num / den, c = d.int(-6, 6), dd = d.int(-5, 5), a = [dd, c, b, 1];
      if (Math.abs(b) > 9) return null;
      const slope = (pval(a, p + h) - pval(a, p)) / h, c1 = Q(-2 * b - 3 * c0, 3), c1v = c1.p / c1.q;
      if (Math.abs(pval(pder(a), c0) - slope) > 1e-9) return null;
      if (c1v > p && c1v < p + h && Math.abs(c1v - c0) > 1e-9) return null;
      const arg = p === 0 ? `${h}${TH}` : `${iq(p)} + ${h}${TH}`;
      const th = Q(j, h);
      return qAns(`함수 ${fIs(a)}에 대하여 ${nb(`${Fv}(${iq(p + h)}) = ${Fv}(${iq(p)}) + ${h}${FP}(${arg})`)}를 만족시키는 실수 ${TH}의 값은? ${nb(`(단, 0 &lt; ${TH} &lt; 1)`)}`, th, {
        explain: `주어진 식은 ${is(frac(`${Fv}(${iq(p + h)}) ${MINUS} ${Fv}(${iq(p)})`, h), `${FP}(${arg})`)}로, 평균값 정리의 ${Cv}를 ${is(Cv, arg)}로 나타낸 것이다. 기울기는 ${frac(`${iq(pval(a, p + h))} ${MINUS} ${par(pval(a, p))}`, h)} = ${iq(slope)}이고 ${is(ptext(pder(a), Cv), slope)}의 근 가운데 열린구간 ${iv(p, p + h, true)}에 드는 것은 ${is(Cv, c0)}이다. 따라서 ${is(`${iq(p)} + ${h}${TH}`, c0)}에서 ${is(TH, th)}이다.`,
        facts: { value: `(${c0}-(${jn(p)}))/${h}`, derived: [c0], check: `c0 = ${c0}, 다른 근 ${c1v}` } });
    }, { standard: S6 }),
    T('mvt-which', '롤의 정리·평균값 정리가 성립하는가 가리기', '①20', (d, n) => {
      if (n === 0) {
        const s = d.int(1, 3), lo = -s, hi = s, mid = 0;
        // 참: 양 끝의 함숫값이 같은 다항함수 둘 / 거짓: 양 끝의 함숫값이 다른 다항함수, 꺾인 점이 있는 |x| 꼴
        const k1 = d.int(-5, 5), k2 = d.int(-5, 5), u = nz(d, -3, 3);
        const t1 = padd(pscale(fromRoots([lo, hi]), d.pick([-2, -1, 1, 2])), [k1]);                 // A(x − lo)(x − hi) + k
        const t2 = padd(fromRoots([lo, hi, u]), [k2]);                                              // (x − lo)(x − hi)(x − u) + k
        const f1 = [k1, nz(d, -4, 4), d.pick([-1, 1])];                                              // 일차항이 있는 이차함수
        if (pval(f1, lo) === pval(f1, hi) || big(t2) > 30) return null;
        const k3 = d.int(-5, 5), absT = k3 ? `|${X}| ${sgnT(k3)}` : `|${X}|`;
        const fn = (nm) => V(nm), ends = (nm, a) => `${fn(nm)}(${iq(lo)}) = ${iq(pval(a, lo))}, ${fn(nm)}(${iq(hi)}) = ${iq(pval(a, hi))}`;
        const pool = [
          { h: (nm) => fIs(t1, nm), ok: true, why: (nm) => `${jh(ends(nm, t1), "으로/로")} 같고 다항함수이므로 롤의 정리가 성립한다.` },
          { h: (nm) => fIs(t2, nm), ok: true, why: (nm) => `${jh(ends(nm, t2), "으로/로")} 같고 다항함수이므로 롤의 정리가 성립한다.` },
          { h: (nm) => fIs(f1, nm), ok: false, why: (nm) => `${jh(ends(nm, f1), "으로/로")} 양 끝의 함숫값이 다르다.` },
          { h: (nm) => nb(`${fn(nm)}(${X}) = ${absT}`), ok: false, why: (nm) => `${fn(nm)}(${X})는 닫힌구간에서 연속이지만 ${is(X, mid)}에서 꺾여 미분가능하지 않다.` }
        ];
        const pickd = d.shuffle(pool).slice(0, 3), NM = ['f', 'g', 'h'];
        return comboPick(d, `닫힌구간 ${iv(lo, hi)}에서 롤의 정리가 성립하는 함수만을 있는 대로 고른 것은?`, pickd.map((r, i) => r.h(NM[i])), pickd.map((r) => r.ok),
          pickd.map((r, i) => `${GA[i]}. ${r.why(NM[i])}`).join(' '));
      }
      // 평균값 정리가 성립하지 않는 까닭 고르기
      const p = d.int(-3, 0), q = d.int(p + 2, 4), useAbs = d.bool();
      const m = useAbs ? d.int(p + 1, q - 1) : 0, k = useAbs ? 0 : d.int(q + 1, q + 4);
      const fh = useAbs ? nb(`${Fv}(${X}) = |${poly([[1, X], [-m, '']])}| ${nb(`(${iq(p)} ≤ ${X} ≤ ${iq(q)})`)}`)
        : `${Fv}(${X}) = ${X} (${iq(p)} ≤ ${X} &lt; ${iq(q)}), ${Fv}(${iq(q)}) = ${iq(k)}`;
      const reasons = [
        [`${Fv}(${X})는 닫힌구간 ${iv(p, q)}에서 연속이 아니다.`, !useAbs],
        [`${Fv}(${X})는 열린구간 ${iv(p, q, true)}에서 미분가능하지 않은 ${X}가 있다.`, useAbs],
        [`${Fv}(${X})는 닫힌구간 ${iv(p, q)}에서 최솟값을 갖지 않는다.`, false],
        [`${Fv}(${X})는 닫힌구간 ${iv(p, q)}에서 최댓값을 갖지 않는다.`, false]
      ];
      const rows = d.shuffle(reasons.slice());
      return C(`함수 ${fh}에 대하여 닫힌구간 ${iv(p, q)}에서 평균값 정리를 만족시키는 실수 ${Cv}가 존재하지 않는다. 그 까닭으로 옳은 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
        explain: useAbs ? `${Fv}(${X})는 닫힌구간에서 연속이지만 ${is(X, m)}에서 꺾여 미분가능하지 않다. 그래서 두 끝점을 잇는 직선의 기울기 ${jh(frac(`${iq(Math.abs(q - m))} ${MINUS} ${iq(Math.abs(p - m))}`, q - p), '과/와')} 같은 기울기의 접선이 없다. 접선의 기울기는 1 또는 −1뿐이다.`
          : `${Fv}(${X})는 ${is(X, q)}에서 끊겨 닫힌구간에서 연속이 아니다. 열린구간에서 ${is(`${FP}(${X})`, 1)}인데 두 끝점을 잇는 직선의 기울기는 ${jh(frac(`${iq(k)} ${MINUS} ${par(p)}`, q - p), '으로/로')} 1이 아니다.`,
        facts: { truth: rows.map((r) => r[1]), want: true } });
    }, { count: 2, standard: S6 }),
    T('mvt-graph', '그래프에서 롤의 정리·평균값 정리를 만족시키는 x의 개수', '①21', (d) => {
      // f(x) = k(x − a)(x − b)(x − c)², a < 0 < b < c < e. 이름은 차례로 a, b, c, d(d 는 c 오른쪽).
      // 가운데 볼록한 부분이 눈에 보이게 a 는 원점 가까이, c 는 b 에서 멀리 둔다.
      const a0 = d.int(-2, -1), b0 = 1, c0 = b0 + d.int(3, 4), e0 = c0 + 1;
      const base = fromRoots([a0, b0, c0, c0]), f = (x) => pval(base, x), lo = a0 - 0.6, hi = e0 + 0.3;
      let ymin = 0, ymax = 0;
      for (let i = 0; i <= 200; i += 1) { const y = f(lo + (hi - lo) * i / 200); ymin = Math.min(ymin, y); ymax = Math.max(ymax, y); }
      const sc = 5 / Math.max(-ymin, Math.min(ymax, f(e0) * 1.2));
      const g = (x) => f(x) * sc;
      const names = ['a', 'b', 'c', 'd'], at = [a0, b0, c0, e0];
      const pairs = [[0, 1], [1, 2], [0, 2]], [i1, i2] = d.pick(pairs), u0 = d.pick([0, 1]);
      // f′(x) = 0 의 근(열린구간 안): 수로 찾는다
      const df1 = pder(base), sol = (target, lo1, hi1) => {
        const h = (x) => pval(df1, x) - target, out = [], n = 3000;
        let x0 = lo1, y0 = h(lo1);
        for (let i = 1; i <= n; i += 1) { const x1 = lo1 + (hi1 - lo1) * i / n, y1 = h(x1); if (y0 * y1 < 0) out.push((x0 + x1) / 2); x0 = x1; y0 = y1; }
        return out;
      };
      const crit = [a0, b0, c0];   // f 의 근(롤 구간의 끝)
      const mm = sol(0, at[i1] + 1e-6, at[i2] - 1e-6).length;
      const slope = (f(e0) - f(at[u0])) / (e0 - at[u0]), roots = sol(slope, at[u0] + 1e-6, e0 - 1e-6), nn = roots.length;
      // 접점이 끝점에 너무 붙거나 거의 접하는(겹근에 가까운) 경우는 버린다
      const d2 = pder(df1);
      if (roots.some((x) => x - at[u0] < 0.15 || e0 - x < 0.15 || Math.abs(pval(d2, x)) * sc < 0.6)) return null;
      const fig = plotO({ x: [lo, hi], y: [Math.min(-0.8, ymin * sc - 0.4), Math.max(5.6, g(e0) + 0.6)], w: 270, ys: 0.62,
        curves: [{ f: g, name: 'y=f(x)' }],
        dots: at.map((x, i) => ({ x, y: i === 3 ? g(x) : 0, xl: names[i], guide: i === 3, said: `${names[i]}${i === 3 ? '(그래프 위의 점에서 x축으로 점선)' : ''}` })),
        say: `곡선 y = f(x)는 왼쪽 위에서 내려와 a에서 x축을 지나 아래로 볼록하게 내려갔다가, b에서 다시 x축을 지나 위로 볼록하게 올라간 뒤 c에서 x축에 접하고 d를 향해 다시 올라간다.` });
      return vals(`미분가능한 함수 ${is(Y, `${Fv}(${X})`)}의 그래프가 그림과 같다. 닫힌구간 ${iv(V(names[i1]), V(names[i2]))}에서 롤의 정리를 만족시키는 실수 ${X}의 개수를 ${V('m')}, 닫힌구간 ${iv(V(names[u0]), V('d'))}에서 평균값 정리를 만족시키는 실수 ${X}의 개수를 ${V('n')}이라 할 때, ${V('m')}, ${V('n')}의 값은?`,
        [[V('m'), mm, true], [V('n'), nn, true]], { figure: fig,
          explain: `롤의 정리를 만족시키는 ${X}는 열린구간 ${iv(V(names[i1]), V(names[i2]), true)}에서 접선이 ${X}축에 평행한 점의 ${X}좌표이므로 ${mm}개이다(끝점 ${V(names[i2])}는 세지 않는다). 평균값 정리를 만족시키는 ${X}는 두 점 ${pt(V(names[u0]), `${Fv}(${V(names[u0])})`)}, ${jh(pt(V('d'), `${Fv}(${V('d')})`), '을/를')} 잇는 직선에 평행한 접선의 접점의 ${X}좌표이므로 ${nn}개이다.`,
          facts: { calc: [[String(mm), 0], [String(nn), 1]], derived: [mm, nn], check: `롤 ${names[i1]}~${names[i2]} ${mm}, 평균값 ${names[u0]}~d ${nn}` } });
    }, { standard: S6 }),
    T('mvt-speed', '평균 속도와 같은 순간 속도(평균값 정리의 활용)', '①23', (d) => {
      const T0 = d.pick([5, 6, 8, 10, 12, 15]), v = d.pick([80, 90, 96, 100, 108, 110, 120].filter((x) => (x * T0) % 60 === 0)), D = v * T0 / 60, L = d.pick([60, 70, 80, 90, 100, 110].filter((x) => x !== v));
      if (!v || !Number.isInteger(D)) return null;
      const yes = v > L ? [`시속 ${v} km로 달린 순간이 적어도 한 번 있다.`, `시속 ${L} km보다 빠르게 달린 순간이 적어도 한 번 있다.`] : [`시속 ${v} km로 달린 순간이 적어도 한 번 있다.`];
      const right = d.pick(yes);
      const wrongs = [`늘 시속 ${v} km로 달렸다.`, `시속 ${v + 10} km로 달린 순간이 적어도 한 번 있다.`, `가장 빠를 때의 속력이 시속 ${v} km이다.`,
        `시속 ${v - 10} km보다 느리게 달린 순간이 적어도 한 번 있다.`, `시속 ${v} km보다 빠르게 달린 순간이 적어도 한 번 있다.`];
      return pick5(d, `제한 속도가 시속 ${L} km인 직선 도로의 A 지점과 B 지점 사이의 거리는 ${D} km이다. 어떤 자동차가 A 지점을 지나 B 지점까지 ${T0}분 동안 달렸다. 다음 가운데 반드시 옳은 것은?`, right, wrongs, {
        explain: `${T0}분은 ${frac(T0, 60)}시간이고 ${D} ÷ ${frac(T0, 60)} = ${jh(String(v), '이므로/이므로')} 평균 속도는 시속 ${v} km이다. 시각에 따른 자동차의 위치는 연속이고 미분가능하므로 평균값 정리에 의하여 순간 속도가 평균 속도 시속 ${v} km와 같은 순간이 적어도 한 번 있다.${v > L ? ` 따라서 제한 속도 시속 ${L} km보다 빠르게 달린 순간도 있다.` : ''} 늘 같은 속도로 달렸을 수도 있으므로 나머지는 반드시 옳다고 할 수 없다.` });
    }, { standard: S6 })
  ];

  B.addUnit({ id: '11-2-4', grade: 11, semester: 2, no: 4, title: '도함수의 활용(1)', version: 1, groups: [
    { id: 'tan', title: '접선의 방정식', standard: S5, types: tan },
    { id: 'mvt', title: '평균값 정리', standard: S6, types: mvt },
    { id: 'incr', title: '함수의 증가와 감소', standard: S7, types: [] },
    { id: 'ext', title: '함수의 극대와 극소', standard: S7, types: [] }
  ] });
})(typeof window !== 'undefined' ? window : globalThis);
