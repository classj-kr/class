// 고등학교 미적분Ⅰ Ⅰ-2 함수의 연속 — 단원 틀·도구와 앞쪽 묶음(함수의 연속, 구간과 연속함수, 연속이 되는 조건).
// 수집해 둔 천재 T셀파 미적분Ⅰ(홍진곤, 2022 개정)의 교과서·평가 자료에서 뽑은 문제 꼴 목록(기본꼴_1: 43꼴, 심화 문서 없음)을
// 꼴마다 따져서 실었다. 꼴마다 「실음(유형 이름) / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/11-2-2/싣기_대조표.md 에 있다.
// (연속함수의 성질·최대·최소 정리·사잇값 정리는 11-2-2b.js 에, 실력 문항은 11-2-2c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번.
// 성취기준은 12미적Ⅰ-01-03(함수의 연속을 극한으로 탐구하고 이해한다)과 12미적Ⅰ-01-04(연속함수의 성질을 이해하고, 이를 활용하여 문제를 해결할 수 있다).
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(식·조각 함수·그래프·표·극한 조건), 묻는 것(연속·불연속, 불연속인 까닭, 개수, 구간, 상수, 함숫값, 최댓값·최솟값,
//    실근의 개수, 범위), 식의 꼴(분수식, 근호가 분자에 있는가 분모에 있는가, |x| 로 가른 조각, 경계가 미지수인가)이 다르면 따로 싣는다.
//    수만 바꾼 유형은 만들지 않는다.
//  - 교육과정: 「복잡한 합성함수나 절댓값이 여러 개 포함된 함수와 같이 지나치게 복잡한 함수를 포함하는 문제는 다루지 않는다」는 정도의 말이라
//    빼는 까닭으로 쓰지 않았다(합성 한 번·절댓값 하나뿐인 꼴은 실력에 실었다). 학년이 다른 단원(고1)과 같은 셈이 섞인 꼴(정의역, 판별식, 범위가 정해진
//    함수의 최대·최소)도 이 단원의 판단(연속, 최대·최소 정리)으로 묻는 대표 꼴이라 실었다(사용자 결정). 정의역 셈만 묻는 차례는 두지 않았다.
//  - 답: 상수·함숫값·최댓값·최솟값·범위의 경계는 부호 단추가 붙은 수 칸(분수 답은 분자·분모 칸)으로 받는다. 한 유형 안에서는 차례·씨앗이 바뀌어도
//    답이 늘 정수이거나 늘 정수가 아닌 분수가 되게 수를 골라 칸의 모양이 답을 흘리지 않게 했다. 연속·불연속, 구간, 「또는」으로 갈리는 범위,
//    여럿인 답을 모두 고르는 것은 고르기로, 개수·세금만 단추 없이 받는다. 범위의 끝이 들어가는지가 씨앗마다 달라지는 것(꼭짓점이 구간 안에 드는
//    이차방정식)은 부등호까지 고르는 칸으로 받는다. 원문의 「a + b」「ab」「모든 a의 값의 합」처럼 따로 구한 값을 뜻 없이 더하거나 곱한 꼴은
//    값을 칸마다 따로 받는다(여럿인 a 를 모두 찾는 것이 함정인 꼴만 「모두 고른 것」 고르기로).
//  - 「보이시오」 증명은 끝값 빈칸·「적어도 몇 개의 실근」·고르기로 바꿨다(사용자 결정).
//  - 그림: 고2 공용 plot 으로 그린다. 끊긴 곳의 끝점은 속이 빈 점(○)과 찬 점(●)으로 가르고, 그림 설명(aria-label)에 선분의 두 끝과 점의 좌표를 적는다.
//    원문 그림을 알 수 없는 평가지 문항(①6의 중간6·소1-2, ①24 중8)은 풀이에 남은 단서에 맞게 그래프를 새로 지었다(대조표에 「그림 새로 지음」).
//  - 답은 모두 코드가 셈한다. 고르기의 참·거짓도 손으로 적지 않고 함수의 값·한쪽 극한으로 가린다(연속함수의 성질에 대한 일반 문장만
//    교과서의 성질과 반례로 적었다).
//  - 검사 근거: 수 칸은 문제에 적힌 수로 다시 셈하는 식(facts.value·calc)이고, 글에 없는 수는 seal 이 facts.unseen 에 밝힌다.
//
// 뺀 것과 까닭(11-2-2b.js, 11-2-2c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 그림도 풀이도 없는 것: ①7(대8 — 그래프를 보고 극한·연속에 대한 설명 가운데 옳지 않은 것. 하는 일은 ①6과 같다).
//  - 겹침: ①1 소1-1(세 함수를 섞어 「연속인 것 모두」 — ①1·①2·①3의 일을 함께 묻는 것뿐), ①36 교과서 생각 열기(속력이 80 km/h인 순간이
//    있는가 — ①33의 일), ①9 의 교과서 개념 확인 빈칸(정의역을 구간으로 — 같은 유형), ①20 최1(불연속인 x 하나 — 같은 일),
//    ①25 수행 과제 1의 빈칸(g 가 연속일 때 g(0) = 0 — 수행 과제 2와 같은 일).
//  - 실력에 둔 것: ①16(주기 조건)·①39·①41 은 세 단계 넘게 잇는 것, ①25 교대12·①26·①27·①28·①36·①40 은 뜻을 정확히 대야 풀리는 함정(11-2-2c.js).
//  - 그리기만 묻는 부분(작도): ①4 생각 넓히기의 그래프 그리기(경우를 고르는 일만 실었다), ①17 의 g(x) 그래프 그리기.
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, N, M, C, inline, josa } = B.kit;
  const { LAB, MINUS, LE, GE, gcd, Q, qadd, qsub, qmul, qdiv, fl, tx, mag, nb, tail, js, V, sup, tag, nz, pm, asQ, poly, sys, rt, grp, ex } = B.kit.mid;
  const { ms, lim, qAns, plot, signed, jh } = B.kit.hs;
  const S3 = '12미적Ⅰ-01-03', S4 = '12미적Ⅰ-01-04';

  // ── 검사 근거 마무리 ──
  // 문항에서 보이는 수(검사와 같은 방법으로 읽는다): 글·그림(그림 설명 포함)·보기
  const stripH = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  function visibleNumbers(item) {
    const seen = stripH([item.text, item.figure || ''].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, ' $1 ').replace(/<table[^>]*aria-label="([^"]*)"[^>]*>/g, ' $1 | '));
    return new Set((seen.match(/\d+/g) || []).concat(seen.match(/\d+\.\d+/g) || [], seen.replace(/(\d) (?=\d)/g, '$1').match(/\d+/g) || []));
  }
  // 다시 셈하는 식의 수 가운데 글에 보이지 않는 수를 facts.unseen 에 밝힌다. 0과 1과 o.derived 로 밝히기로 한 수만 된다.
  function seal(item) {
    // 셈이 0으로 끝나는 식은 −0이 될 수 있다. 검사는 −0과 0을 가르므로 +0 을 붙여 0으로 맞춘다(붙인 0은 아래에서 unseen 에 들어간다).
    if (item.facts && item.facts.calc) item.facts.calc = item.facts.calc.map(([t, i]) => [`(${t})+0`, i]);
    const f = item.facts || {}, derived = new Set((f.derived || []).map(Number).concat([0, 1])), shown = visibleNumbers(item), out = new Set(f.unseen || []);
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
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 기본 자료의 어려운 문항(' + ref + ')', make: retry(make) }, more || {});

  // ── 글 ──
  const X = V('x'), Y = V('y'), Av = V('a'), Bv = V('b'), Cv = V('c'), Kv = V('k'), X2 = X + sup(2);
  const iq = (n) => tx(asQ(n));                                             // 화면에 적는 수(음수는 −, 분수는 분수 꼴)
  const jn = (n) => js(asQ(n));                                             // 검사 식에 적는 수((-3), (3/4))
  const jq = (n, pair) => { const q = asQ(n); return iq(q) + tail(Math.abs(q.p), pair); };   // 수 뒤 토씨(분수는 분자의 끝소리)
  const sT = (v) => signed(Number(Number(v).toFixed(4)));                    // 그림 설명에 적는 수
  const FX = ms('f(x)'), GX = ms('g(x)');
  const fAt = (v, name) => nb(`${V(name || 'f')}(${typeof v === 'string' ? v : iq(v)})`);   // f(2)
  const fIs = (r, name) => `${nb(`${V(name || 'f')}(${X}) =`)} ${r}`;       // f(x) = …
  // 극한: LIM(2) → lim(x→2) f(x), LIM(2, 'g(x)', '+') → 우극한
  const LIM = (a, body, side) => lim(`x→${a < 0 ? '-' + Math.abs(a) : a}${side || ''}`, body == null ? 'f(x)' : body);
  // 조건 글: x ≥ 2, x < 2, x ≠ 2, x = 2 (v 가 글이면 그대로)
  const relX = (op, v) => nb(`${X} ${op} ${typeof v === 'string' ? v : iq(v)}`);
  const ge = (v) => relX(GE, v), gt = (v) => relX('&gt;', v), le = (v) => relX(LE, v), lt = (v) => relX('&lt;', v), ne = (v) => relX('≠', v), eq = (v) => relX('=', v);
  const absX = (op, s) => nb(`|${X}| ${op} ${s}`);
  // 조각 함수: cases([[식, 조건], …]) — 왼쪽 중괄호, 식 오른쪽에 조건
  const cases = (rows) => sys(rows.map(([e, c]) => `${e}<span style="padding-left:0.6em">(${c})</span>`));
  // 구간 글: iv('[', 2, 5, ')') → [2, 5)
  const NINF = MINUS + '∞', INF = '∞';
  const iv = (lb, a, b, rb) => nb(`${lb}${typeof a === 'string' ? a : iq(a)}, ${typeof b === 'string' ? b : iq(b)}${rb}`);
  const sgnT = (n) => { const q = asQ(n); return `${q.p < 0 ? MINUS : '+'} ${mag(q)}`; };   // 「+ 3」「− 3」

  // ── 다항식(오름차순 계수의 배열: [상수항, x의 계수, x²의 계수, …]) ──
  const pz = (a) => { const out = a.slice(); while (out.length > 1 && out[out.length - 1] === 0) out.pop(); return out; };
  const padd = (a, b) => pz(Array.from({ length: Math.max(a.length, b.length) }, (_, i) => (a[i] || 0) + (b[i] || 0)));
  const pscale = (a, k) => pz(a.map((c) => c * k));
  const pmul = (a, b) => { const out = Array(a.length + b.length - 1).fill(0); a.forEach((x, i) => b.forEach((y, j) => { out[i + j] += x * y; })); return pz(out); };
  const pval = (a, x) => a.reduce((s, c, i) => s + c * x ** i, 0);
  const fromRoots = (rs, lead) => rs.reduce((acc, r) => pmul(acc, [-r, 1]), [lead == null ? 1 : lead]);
  const ptext = (a, v) => poly(a.map((c, i) => [c, i === 0 ? '' : (v || X) + (i > 1 ? sup(i) : '')]).reverse());
  const den = (p) => ptext([-p, 1]);                                         // x − p
  const par = (h) => `(${h})`;

  // ── 고르기 ──
  const GA = ['ㄱ', 'ㄴ', 'ㄷ'];
  const COMBOS = [[0], [1], [2], [0, 1], [0, 2], [1, 2], [0, 1, 2]];
  // ㄱ, ㄴ, ㄷ 가운데 옳은(조건에 맞는) 것을 「있는 대로 고른 것」: 보기 다섯(정답 포함). flags 는 하나 이상 참. list 는 보기 글(또는 그림).
  function comboPick(d, text, list, flags, explain, more) {
    const right = [0, 1, 2].filter((i) => flags[i]);
    if (!right.length) return null;
    const key = (c) => c.join(','), others = d.shuffle(COMBOS.filter((c) => key(c) !== key(right))).slice(0, 4);
    const rows = others.concat([right]).sort((u, v) => u.length - v.length || key(u).localeCompare(key(v)));
    const figure = more && more.figure != null ? more.figure : lines(list.map((h, i) => `<b>${GA[i]}.</b> ${h}`));
    return C(text, rows.map((c) => c.map((i) => GA[i]).join(', ')), rows.findIndex((c) => key(c) === key(right)), Object.assign({}, more || {}, { figure, explain, facts: { truth: rows.map((c) => key(c) === key(right)), want: true } }));
  }
  // 보기 글 여럿(정답 하나)을 섞어 고르기로. 보기가 서로 같으면 null(다시 만든다).
  function pickOne(d, text, right, wrongs, o, size) {
    const want = size || 5, pool = [];
    for (const w of d.shuffle(wrongs)) if (pool.length < want - 1 && stripH(w) !== stripH(right) && pool.every((p) => stripH(p) !== stripH(w))) pool.push(w);
    if (pool.length < want - 1) return null;
    const rows = d.shuffle([right].concat(pool));
    return C(text, rows, rows.indexOf(right), Object.assign({}, o, { facts: Object.assign({ truth: rows.map((r) => r === right), want: true }, (o && o.facts) || {}) }));
  }
  // 문자의 값 여럿: 「a = [±][ ]  b = [±][ ]」(셋째 원소가 참이면 부호 단추 없이)
  const vals = (text, pairs, o) => M(text, pairs.map(([lead, answer, bare]) => ({ lead: lead + ' =', answer, signed: !bare })), Object.assign({}, o, { shown: pairs.map(([lead, answer]) => nb(`${lead} = ${iq(answer)}`)).join(', ') }));
  const yesNo = ['연속이다', '불연속이다'];
  const judge = (text, ok, o) => C(text, yesNo, ok ? 0 : 1, Object.assign({}, o, { facts: { truth: [ok, !ok], want: true } }));

  // ── 그래프 ──
  const BLUE = '#1d4ed8';
  const ints = (lo, hi) => { const out = []; for (let v = Math.ceil(lo); v <= Math.floor(hi); v += 1) if (v !== 0) out.push(v); return out; };
  // 선분으로 이은 그래프: segs [[x1, y1, x2, y2], …], dots(plot 의 점), curves(plot 의 곡선 — 색은 하나로)
  function segGraph(o) {
    const segs = o.segs || [], said = segs.length ? '선분: ' + segs.map(([a, b, c, e]) => `(${sT(a)}, ${sT(b)})에서 (${sT(c)}, ${sT(e)})까지`).join(', ') + '.' : '';
    return plot({ x: o.x, y: o.y, w: o.w, grid: o.grid === false ? false : true, xt: o.xt || ints(o.x[0], o.x[1]), yt: o.yt || ints(o.y[0], o.y[1]),
      curves: (o.curves || []).map((c) => Object.assign({ color: BLUE }, c)), segs: segs.map(([a, b, c, e]) => ({ p: [a, b], q: [c, e], color: BLUE })), dots: o.dots,
      say: [o.say, said].filter(Boolean).join(' ') });
  }
  // 작은 그래프 여럿을 이름표와 함께 늘어놓는다(좁은 화면에서는 두 줄로)
  const gridOf = (figs, names) => '<div style="display:flex;flex-wrap:wrap;gap:8px 14px;justify-content:center">' + figs.map((f, i) => `<div style="text-align:center"><div style="font-weight:700">${names[i]}</div>${f}</div>`).join('') + '</div>';

  B.kit.u22 = {
    S3, S4, seal, retry, T, H, stripH, X, Y, Av, Bv, Cv, Kv, X2, iq, jn, jq, sT, FX, GX, fAt, fIs, LIM, relX, ge, gt, le, lt, ne, eq, absX, cases, NINF, INF, iv, sgnT,
    pz, padd, pscale, pmul, pval, fromRoots, ptext, den, par, GA, comboPick, pickOne, vals, yesNo, judge, BLUE, ints, segGraph, gridOf
  };

  // ════════════════════════════════════════════════════════════════
  // 가. 함수의 연속 — x = a 에서의 연속과 불연속
  // ════════════════════════════════════════════════════════════════
  // 한 식으로 준 함수(다항식, 분모가 x = a 에서 0이 되는 분수식, 0이 되지 않는 분수식): { h, ok, why }
  function oneFormula(d, a) {
    const kind = d.pick(['poly', 'pole', 'far', 'pole']);
    if (kind === 'poly') {
      const c = [nz(d, -6, 6), nz(d, -5, 5), d.pick([1, -1, 2, -2])], v = pval(c, a);
      return { h: ptext(c), ok: true, why: `${fAt(a)} = ${iq(v)}이고 ${LIM(a)} = ${iq(v)}이므로 ${LIM(a)} = ${fAt(a)}이다.` };
    }
    const b = kind === 'pole' ? a : d.until(() => nz(d, -5, 5), (v) => v !== a), num = [nz(d, -6, 6), d.int(1, 3)];
    if (pval(num, b) === 0) return null;
    const h = frac(ptext(num), den(b));
    if (kind === 'pole') return { h, ok: false, why: `${X} = ${jq(a, '이/가')} 분모를 0으로 하므로 ${jh(FX, '은/는')} ${X} = ${iq(a)}에서 정의되지 않는다.` };
    const v = Q(pval(num, a), a - b);
    return { h, ok: true, why: `${fAt(a)} = ${iq(v)}이고 분모가 0이 아니므로 ${LIM(a)} = ${iq(v)}이다. 즉 ${LIM(a)} = ${fAt(a)}이다.` };
  }
  // x ≠ a 의 식과 x = a 의 값을 따로 준 함수
  function splitValue(d, a) {
    if (d.bool()) {
      const r = d.until(() => nz(d, -6, 6), (v) => v !== a), L = a - r, K = d.bool() ? L : L + nz(d, -3, 3), P = fromRoots([a, r]);
      return { h: cases([[frac(ptext(P), den(a)), ne(a)], [iq(K), eq(a)]]), ok: K === L,
        why: `${fAt(a)} = ${iq(K)}이고 ${LIM(a)} = ${LIM(a, frac(`(${den(a)})(${den(r)})`, den(a)))} = ${LIM(a, par(den(r)))} = ${iq(L)}이다.` };
    }
    const m = nz(d, -4, 4), e = nz(d, -6, 6), L = m * a + e, K = d.bool() ? L : L + nz(d, -3, 3);
    return { h: cases([[ptext([e, m]), ne(a)], [iq(K), eq(a)]]), ok: K === L, why: `${fAt(a)} = ${iq(K)}이고 ${LIM(a)} = ${LIM(a, par(ptext([e, m])))} = ${iq(L)}이다.` };
  }
  // 좌우 다른 식으로 준 함수(오른쪽 x ≥ a, 왼쪽 x < a)
  function twoSides(d, a) {
    let right, R;
    if (d.bool()) { const s = d.int(1, 3), c = d.int(-3, 3); right = rt(ptext([s * s - a, 1])) + (c ? ` ${sgnT(c)}` : ''); R = s + c; }
    else { const m = nz(d, -3, 3), e = nz(d, -6, 6); right = ptext([e, m]); R = m * a + e; }
    const m2 = nz(d, -4, 4), Lv = d.bool() ? R : R + nz(d, -3, 3), e2 = Lv - m2 * a;
    if (e2 === 0) return null;
    return { h: cases([[right, ge(a)], [ptext([e2, m2]), lt(a)]]), ok: Lv === R,
      why: `${fAt(a)} = ${iq(R)}, ${LIM(a, null, '+')} = ${iq(R)}, ${LIM(a, null, '-')} = ${iq(Lv)}이다.` };
  }

  const cont = [
    // ①1·①2·①3 x = a 에서 연속인가: 차례 1은 한 식, 차례 2는 x ≠ a 의 식과 x = a 의 값을 따로, 차례 3은 좌우 다른 식
    T('cont-judge', 'x = a에서 연속인지 불연속인지 가리기', '①1·①2·①3', (d, n) => {
      const a = nz(d, -4, 4), f = [oneFormula, splitValue, twoSides][n](d, a);
      if (!f) return null;
      const tail2 = f.ok ? `따라서 ${jh(FX, '은/는')} ${X} = ${iq(a)}에서 연속이다.` : n === 0 ? '따라서 불연속이다.' : n === 1 ? '극한값과 함숫값이 다르므로 불연속이다.' : '좌극한과 우극한이 달라 극한값이 없으므로 불연속이다.';
      return judge(`함수 ${fIs(f.h)}에 대하여 ${jh(FX, '은/는')} ${X} = ${iq(a)}에서 연속인가, 불연속인가?`, f.ok, { explain: `${f.why} ${tail2}` });
    }, { count: 3 }),

    // ①4 불연속인 까닭: 교과서 생각 넓히기의 네 경우(정의되는가 × 극한값이 있는가, 극한값과 함숫값이 다른가) 가운데 어느 것인가
    T('cont-reason', '불연속인 까닭 가리기(정의되는가, 극한값이 있는가, 함숫값과 같은가)', '①4', (d) => {
      const a = nz(d, -4, 4), kind = d.pick(['A', 'B', 'C', 'D']);
      let h, why;
      if (kind === 'A') { const k = nz(d, -5, 5), c = d.int(-4, 4); h = (k < 0 ? MINUS : '') + frac(Math.abs(k), den(a)) + (c ? ` ${sgnT(c)}` : ''); why = `${X} = ${jq(a, '은/는')} 분모를 0으로 하므로 ${fAt(a)}의 값이 없다. ${X}가 ${iq(a)}에 가까워질 때 ${jh(FX, '은/는')} 양의 무한대나 음의 무한대로 발산하므로 극한값도 없다.`; }
      else if (kind === 'B') { const r = d.until(() => nz(d, -5, 5), (v) => v !== a); h = frac(ptext(fromRoots([a, r])), den(a)); why = `${X} = ${jq(a, '은/는')} 분모를 0으로 하므로 ${fAt(a)}의 값이 없다. 그러나 ${LIM(a)} = ${LIM(a, par(den(r)))} = ${jq(a - r, '으로/로')} 극한값은 있다.`; }
      else if (kind === 'C') {
        const m = nz(d, -3, 3), e = d.int(-4, 4), R = m * a + e, Lv = R + nz(d, -3, 3), e2 = Lv - a;
        h = cases([[ptext([e, m]), ge(a)], [ptext([e2, 1]), lt(a)]]);
        why = `${fAt(a)} = ${jq(R, '으로/로')} 정의되어 있다. 그러나 ${LIM(a, null, '+')} = ${iq(R)}, ${LIM(a, null, '-')} = ${jq(Lv, '으로/로')} 좌극한과 우극한이 달라 극한값이 없다.`;
      } else {
        const r = d.until(() => nz(d, -5, 5), (v) => v !== a), L = a - r, K = L + nz(d, -3, 3);
        h = cases([[frac(ptext(fromRoots([a, r])), den(a)), ne(a)], [iq(K), eq(a)]]);
        why = `${fAt(a)} = ${jq(K, '으로/로')} 정의되어 있고 ${LIM(a)} = ${LIM(a, par(den(r)))} = ${jq(L, '으로/로')} 극한값도 있다. 그러나 극한값과 함숫값이 다르다.`;
      }
      const at = `${X} = ${iq(a)}에서`;
      const say = {
        A: `${at} 정의되어 있지 않고, 극한값도 존재하지 않는다.`,
        B: `${at} 정의되어 있지 않지만, 극한값은 존재한다.`,
        C: `${at} 정의되어 있지만, 극한값이 존재하지 않는다.`,
        D: `${at} 정의되어 있고 극한값도 존재하지만, 극한값과 함숫값이 다르다.`
      };
      return pickOne(d, `다음 함수 ${jh(FX, '은/는')} ${X} = ${iq(a)}에서 불연속이다. 불연속인 까닭을 바르게 말한 것은?`, say[kind], ['A', 'B', 'C', 'D'].filter((k) => k !== kind).map((k) => say[k]), { figure: ex(fIs(h)), explain: why }, 4);
    }),

    // ①5 그래프 셋을 보고 x = 1 에서 연속인 것(불연속인 것) 고르기: 이어진 것, 뛴 것, 구멍 자리에 점이 따로 찍힌 것, 구멍만 있는 것
    T('cont-graph3', '그래프를 보고 x = 1에서 연속인 함수 고르기', '①5', (d) => {
      const kinds = [0, 1, 2].map(() => d.pick(['ok', 'jump', 'hole', 'gap', 'ok']));
      const askOk = d.bool(), flags = kinds.map((k) => (k === 'ok') === askOk);
      if (!flags.some(Boolean)) return null;
      const figs = kinds.map((k) => {
        const c = d.pick([1, 2]), m = d.pick([0.5, 1, -0.5]), s = d.pick([0.4, -0.4, 0.3]), f0 = (x) => c + m * (x - 1) + s * (x - 1) ** 3;
        const j = c === 1 ? 1 : d.pick([1, -1]);
        const box = { x: [-0.5, 2.5], y: [-1, 4], w: 124, xt: [1], yt: [1, 2, 3], grid: false };
        if (k === 'ok') return segGraph(Object.assign(box, { curves: [{ f: f0, from: -0.5, to: 2.5 }], say: `그래프가 x = 1에서 끊어지지 않고 이어져 있다.` }));
        if (k === 'jump') {
          const leftOwn = d.bool();
          return segGraph(Object.assign(box, { curves: [{ f: f0, from: -0.5, to: 1 }, { f: (x) => f0(x) + j, from: 1, to: 2.5 }],
            dots: [{ x: 1, y: c, open: !leftOwn }, { x: 1, y: c + j, open: leftOwn }], say: `그래프가 x = 1에서 끊어져 위아래로 어긋나 있다.` }));
        }
        if (k === 'hole') { const K = d.until(() => d.pick([1, 2, 3]), (v) => v !== c); return segGraph(Object.assign(box, { curves: [{ f: f0, from: -0.5, to: 2.5 }], dots: [{ x: 1, y: c, open: true }, { x: 1, y: K }], say: `곡선의 x = 1인 곳이 비어 있고 함숫값은 찬 점으로 따로 찍혀 있다.` })); }
        return segGraph(Object.assign(box, { curves: [{ f: f0, from: -0.5, to: 2.5 }], dots: [{ x: 1, y: c, open: true }], say: `곡선의 x = 1인 곳이 비어 있고 다른 점은 없다.` }));
      });
      const word = { ok: '끊어지지 않고 이어져 있어 연속이다', jump: '좌극한과 우극한이 달라 극한값이 없으므로 불연속이다', hole: '극한값은 있지만 함숫값(찬 점)과 달라 불연속이다', gap: `${fAt(1)}의 값이 없어(정의되지 않아) 불연속이다` };
      return comboPick(d, `다음은 세 함수의 그래프이다. ${X} = 1에서 ${askOk ? '연속인' : '불연속인'} 함수만을 있는 대로 고른 것은?`, [], flags,
        kinds.map((k, i) => `${GA[i]}은 ${word[k]}.`).join(' '), { figure: gridOf(figs, GA.map((g) => g + '.')) });
    }),

    // ①6 그래프에서 극한값이 없는 x 의 개수와 불연속인 x 의 개수(교점5 그림의 꼴 — 중간6·소1-2는 그림 새로 지음)
    T('cont-count', '그래프에서 극한값이 없는 점과 불연속인 점의 개수', '①6', (d) => {
      const lo = d.pick([-2, -1]), hi = lo + 5, nodes = [];
      for (let c = lo + 1; c < hi; c += 1) nodes.push(c);
      const kinds = d.shuffle(['cont', 'rem', 'jump', d.pick(['jump', 'rem', 'cont'])]), Ys = [0, 1, 2, 3];
      const y0 = d.pick(Ys), segs = [], dots = [{ x: lo, y: y0, open: true }];
      let px = lo, py = y0;
      for (let i = 0; i < nodes.length; i += 1) {
        const c = nodes[i], Lc = d.pick(Ys);
        if (Lc === py && i > 0 && kinds[i - 1] === 'cont') return null;   // 이어진 점의 양쪽이 한 직선이 되어 점이 안 보이는 것은 피한다
        segs.push([px, py, c, Lc]);
        let Rc = Lc;
        if (kinds[i] === 'rem') { const Vc = d.until(() => d.pick(Ys), (v) => v !== Lc); dots.push({ x: c, y: Lc, open: true }, { x: c, y: Vc }); }
        else if (kinds[i] === 'jump') { Rc = d.until(() => d.pick(Ys), (v) => v !== Lc); const Vc = d.pick([Lc, Rc]); dots.push({ x: c, y: Vc === Lc ? Rc : Lc, open: true }, { x: c, y: Vc }); }
        px = c; py = Rc;
      }
      const yEnd = d.pick(Ys); segs.push([px, py, hi, yEnd]); dots.push({ x: hi, y: yEnd, open: true });
      // 이어진 점은 꺾여 보여야 한다(양쪽 선분의 기울기가 다르게)
      for (let i = 0; i < nodes.length; i += 1) if (kinds[i] === 'cont') { const s1 = segs[i], s2 = segs[i + 1]; if (s1[3] - s1[1] === s2[3] - s2[1]) return null; }
      const a = kinds.filter((k) => k === 'jump').length, b = a + kinds.filter((k) => k === 'rem').length;
      const figure = segGraph({ x: [lo - 0.5, hi + 0.5], y: [-1, 4], segs, dots, say: `열린구간 (${sT(lo)}, ${sT(hi)})에서 정의된 함수의 그래프이고 두 끝은 속이 빈 점이다.` });
      const no = nodes.filter((_, i) => kinds[i] === 'jump'), rem = nodes.filter((_, i) => kinds[i] === 'rem');
      return vals(`열린구간 ${iv('(', lo, hi, ')')}에서 정의된 함수 ${Y} = ${FX}의 그래프가 그림과 같다. 이 구간에서 함수 ${FX}의 극한값이 존재하지 않는 ${X}의 값의 개수를 ${Av}, 함수 ${FX}가 불연속인 ${X}의 값의 개수를 ${jh(Bv, '이라/라')} 할 때, ${Av}, ${Bv}의 값은?`,
        [[Av, a, true], [Bv, b, true]], { figure,
          explain: `좌극한과 우극한이 다른 곳은 ${X} = ${no.map(iq).join(', ')}이므로 ${Av} = ${a}이다. 극한값은 있지만 함숫값과 다른 곳 ${X} = ${rem.map(iq).join(', ')}까지 더하면 불연속인 곳은 ${b}개이므로 ${Bv} = ${b}이다.`,
          facts: { calc: [[String(a), 0], [String(b), 1]], derived: [a, b] } });
    })
  ];

  // ════════════════════════════════════════════════════════════════
  // 나. 구간과 연속함수
  // ════════════════════════════════════════════════════════════════
  const interval = [
    // ①8 부등식으로 쓴 집합을 구간의 기호로
    T('int-set', '부등식으로 쓴 집합을 구간의 기호로 나타내기', '①8', (d) => {
      const a = d.int(-6, 4), b = a + d.int(2, 9), kind = d.int(0, 7);
      let cond, right, wrongs;
      if (kind < 4) {
        const [op, ans] = [[LE, iv('(', NINF, a, ']')], ['&lt;', iv('(', NINF, a, ')')], [GE, iv('[', a, INF, ')')], ['&gt;', iv('(', a, INF, ')')]][kind];
        cond = `${X} ${op} ${iq(a)}`; right = ans;
        wrongs = [iv('(', NINF, a, ']'), iv('(', NINF, a, ')'), iv('[', a, INF, ')'), iv('(', a, INF, ')'), kind < 2 ? iv('[', NINF, a, ']') : iv('[', a, INF, ']')];
      } else {
        const [l, r] = [['[', ']'], ['(', ')'], ['[', ')'], ['(', ']']][kind - 4];
        cond = `${iq(a)} ${l === '[' ? LE : '&lt;'} ${X} ${r === ']' ? LE : '&lt;'} ${iq(b)}`; right = iv(l, a, b, r);
        wrongs = [iv('[', a, b, ']'), iv('(', a, b, ')'), iv('[', a, b, ')'), iv('(', a, b, ']')];
      }
      return pickOne(d, '다음 집합을 구간의 기호로 나타낸 것은?', right, wrongs.filter((w) => w !== right), {
        figure: `<div class="mb-expr">${nb(`{${X} | ${cond}}`)}</div>`,
        explain: `등호가 있는 쪽 끝은 대괄호 [ ], 없는 쪽 끝은 소괄호 ( )로 적는다. ${INF}나 ${NINF} 쪽은 늘 소괄호이다. 따라서 ${right}이다.` }, kind < 4 ? 5 : 4);
    }),

    // ①9 함수의 정의역을 구간의 기호로(차례 1), 근호가 든 함수가 연속인 구간(차례 2 — 끝점에서는 한쪽 극한으로 연속)
    T('int-domain', '함수의 정의역·연속인 구간을 구간의 기호로 나타내기', '①9', (d, n) => {
      if (n === 0) {
        const kind = d.pick(['L', 'R', 'rat']), c = d.int(-4, 4);
        if (kind === 'rat') {
          const t = nz(d, -6, 6), s = d.until(() => nz(d, -6, 6), (v) => v !== -t);
          const h = frac(ptext([s, 1]), den(t)), right = `${iv('(', NINF, t, ')')} ∪ ${iv('(', t, INF, ')')}`;
          return pickOne(d, `함수 ${fIs(h)}의 정의역을 구간의 기호로 나타낸 것은?`, right,
            [`${iv('(', NINF, -s, ')')} ∪ ${iv('(', -s, INF, ')')}`, `${iv('(', NINF, t, ']')} ∪ ${iv('[', t, INF, ')')}`, iv('(', t, INF, ')'), iv('(', NINF, INF, ')'), `${iv('(', NINF, -t, ')')} ∪ ${iv('(', -t, INF, ')')}`],
            { explain: `분모 ${jh(den(t), '이/가')} 0이 되는 ${X} = ${iq(t)}만 빼면 되므로 정의역은 ${nb(`{${X} | ${X} ≠ ${iq(t)}인 실수}`)}이고, 구간의 기호로 ${right}이다.` });
        }
        const m = d.pick([1, 2, 3]), p = nz(d, -8, 8), e = Q(p, m);
        const inner = kind === 'L' ? `${iq(p)} ${MINUS} ${m === 1 ? '' : m}${X}` : ptext([-p, m]);
        const h = rt(inner) + (c ? ` ${sgnT(c)}` : '');
        const right = kind === 'L' ? iv('(', NINF, e, ']') : iv('[', e, INF, ')');
        const wrongs = kind === 'L' ? [iv('(', NINF, e, ')'), iv('[', e, INF, ')'), iv('(', e, INF, ')'), iv('(', NINF, Q(-p, m), ']'), iv('[', NINF, e, ']')]
          : [iv('(', e, INF, ')'), iv('(', NINF, e, ']'), iv('(', NINF, e, ')'), iv('[', Q(-p, m), INF, ')'), iv('[', e, INF, ']')];
        return pickOne(d, `함수 ${fIs(h)}의 정의역을 구간의 기호로 나타낸 것은?`, right, wrongs, {
          explain: `근호 안이 0 이상이어야 하므로 ${inner} ${GE} 0, 즉 ${X} ${kind === 'L' ? LE : GE} ${iq(e)}이다. 등호가 있으므로 ${iq(e)} 쪽 끝은 대괄호로 적어 ${right}이다.` });
      }
      const m = d.pick([1, 2, 3, -1, -2]), p = nz(d, -6, 6), e = Q(-p, m), inner = ptext([p, m]), c = d.int(-3, 3);
      if (Math.abs(fl(e)) > 6) return null;
      const h = rt(inner) + (c ? ` ${sgnT(c)}` : ''), right = m > 0 ? iv('[', e, INF, ')') : iv('(', NINF, e, ']');
      const wrongs = m > 0 ? [iv('(', e, INF, ')'), iv('(', NINF, e, ']'), iv('(', NINF, INF, ')'), iv('[', qmul(e, Q(-1)), INF, ')')] : [iv('(', NINF, e, ')'), iv('[', e, INF, ')'), iv('(', NINF, INF, ')'), iv('(', NINF, qmul(e, Q(-1)), ']')];
      return pickOne(d, `함수 ${fIs(h)}에 대하여 ${jh(FX, '이/가')} 연속인 구간을 구간의 기호로 나타낸 것은?`, right, wrongs, {
        explain: `${jh(FX, '은/는')} 근호 안이 0 이상인 ${X} ${m > 0 ? GE : LE} ${iq(e)}에서만 정의된다. 열린구간 ${m > 0 ? iv('(', e, INF, ')') : iv('(', NINF, e, ')')}에서 연속이고, 끝점 ${X} = ${iq(e)}에서는 ${m > 0 ? '오른쪽' : '왼쪽'}에서 다가갈 때의 극한값이 함숫값 ${jh(fAt(e), '과/와')} 같으므로 끝점을 넣은 ${right}에서 연속이다.` }, 5);
    }, { count: 2 }),

    // ①10 닫힌구간에서 연속인 함수 고르기(구간 안에 정의되지 않는 점이 있는가, 근호 안이 구간 전체에서 0 이상인가)
    T('int-closed', '닫힌구간에서 연속인 함수 고르기', '①10', (d) => {
      const a = d.int(-2, 2), b = a + d.int(2, 3), k = d.int(1, 6), inside = () => d.int(a, b), outside = () => d.pick([a - d.int(1, 3), b + d.int(1, 3)]);
      const good = [
        () => ({ h: rt(ptext([-a, 1])), why: `근호 안 ${jh(ptext([-a, 1]), '은/는')} ${X} ${GE} ${iq(a)}에서 0 이상이고 끝점에서는 한쪽 극한으로 이어지므로 연속이다` }),
        () => ({ h: rt(ptext([b, -1])), why: `근호 안 ${jh(ptext([b, -1]), '은/는')} ${X} ${LE} ${iq(b)}에서 0 이상이므로 연속이다` }),
        () => { const c = outside(); return { h: frac(k, den(c)), why: `분모가 0이 되는 ${X} = ${jq(c, '이/가')} 구간 밖이므로 연속이다` }; }
      ];
      const bad = [
        () => { const c = d.int(a + 1, b); return { h: rt(ptext([-c, 1])), why: `${X} &lt; ${iq(c)}에서 근호 안이 음수라 정의되지 않는다` }; },
        () => { const c = d.int(a, b - 1); return { h: rt(ptext([c, -1])), why: `${X} &gt; ${iq(c)}에서 근호 안이 음수라 정의되지 않는다` }; },
        () => { const c = inside(); return { h: frac(k, den(c)), why: `${X} = ${iq(c)}에서 정의되지 않는다` }; },
        () => { const c = inside(); return { h: frac(k, par(den(c)) + sup(2)), why: `${X} = ${iq(c)}에서 정의되지 않는다` }; },
        () => { const c = inside(); return { h: frac(k === 1 ? X : k + X, `|${den(c)}|`), why: `${X} = ${iq(c)}에서 정의되지 않는다` }; }
      ];
      const g = d.pick(good)(), bads = d.shuffle(bad).slice(0, 4).map((f) => f());
      const rows = d.shuffle([g].concat(bads));
      if (new Set(rows.map((r) => stripH(r.h))).size < rows.length) return null;
      return C(`다음 중 닫힌구간 ${iv('[', a, b, ']')}에서 연속인 함수는?`, rows.map((r) => nb(`${Y} = `) + r.h), rows.indexOf(g), {
        explain: rows.map((r) => `${nb(`${Y} = `)}${r.h}: ${r.why}.`).join(' '), facts: { truth: rows.map((r) => r === g), want: true } });
    })
  ];

  // ════════════════════════════════════════════════════════════════
  // 다. 연속이 되는 조건 — 상수와 함숫값 정하기
  // ════════════════════════════════════════════════════════════════
  const cond = [
    // ①11 x ≠ q 에서 분수식, x = q 에서 b 인 함수가 연속: 분자 → 0 으로 a, 약분으로 b (원문 a + b 는 칸마다)
    T('cond-frac', '분수식 조각 함수가 연속이 되는 상수 구하기', '①11', (d) => {
      const q = nz(d, -5, 5), r = d.until(() => nz(d, -6, 6), (v) => v !== q), P = fromRoots([q, r]), linUnknown = d.bool();
      if (linUnknown && P[0] === 0) return null;
      const num = linUnknown ? poly([[1, X2], [1, Av + X], [P[0], '']]) : poly([[1, X2], [P[1], X], [1, Av]]);
      const a = linUnknown ? P[1] : P[0], b = q - r;
      const f = cases([[frac(num, den(q)), ne(q)], [Bv, eq(q)]]);
      const zero = linUnknown ? `${poly([[q, Av], [q * q + P[0], '']])} = 0` : `${poly([[1, Av], [q * q + P[1] * q, '']])} = 0`;
      return vals(`함수 ${fIs(f)}가 모든 실수 ${X}에서 연속일 때, 상수 ${Av}, ${Bv}의 값은?`, [[Av, a], [Bv, b]], {
        explain: `${X} = ${iq(q)}에서 연속이어야 하므로 ${LIM(q, frac(num, den(q)))} = ${Bv}이다. 분모가 0으로 가므로 분자도 0으로 가야 한다: ${zero}, ${Av} = ${iq(a)}. 그러면 분자는 (${den(q)})(${den(r)})이므로 ${Bv} = ${LIM(q, par(den(r)))} = ${iq(b)}이다.`,
        facts: { calc: linUnknown ? [[`(0-(${jn(q)}*${jn(q)}+${jn(P[0])}))/${jn(q)}`, 0], [`${jn(q)}-${jn(P[0])}/${jn(q)}`, 1]] : [[`0-${jn(q)}*${jn(q)}-${jn(P[1])}*${jn(q)}`, 0], [`2*${jn(q)}+${jn(P[1])}`, 1]], derived: [2] } });
    }),

    // ①12 근호가 든 분수식 조각: 차례 1은 분자에 근호(a 와 b — b 는 분수), 차례 2는 분모에 근호이고 함숫값이 식(a 하나)
    T('cond-root', '근호가 든 분수식 조각 함수가 연속이 되는 상수 구하기', '①12', (d, n) => {
      if (n === 0) {
        const m = d.int(2, 4), c = d.pick([1, 1, 2, 3]), q = nz(d, -5, 5), p = m * m - c * q, inUnknown = d.bool();
        const bq = Q(c, 2 * m), g = gcd(c, 2 * m);
        const top = inUnknown ? `${rt(poly([[c, X], [1, Av]]))} ${MINUS} ${m}` : `${rt(ptext([p, c]))} + ${Av}`;
        const a = inUnknown ? p : -m;
        const f = cases([[frac(top, den(q)), ne(q)], [Bv, eq(q)]]);
        const conj = inUnknown ? `${rt(ptext([p, c]))} + ${m}` : `${rt(ptext([p, c]))} + ${m}`;
        return inline(`함수 ${fIs(f)}가 ${X} = ${iq(q)}에서 연속일 때, 상수 ${Av}, ${Bv}의 값은? (단, ${jh(Bv, '은/는')} 기약분수로 나타낸다.)`, `${grp(`${Av} = {0}`)}, ${grp(`${Bv} = ${frac('{1}', '{2}')}`)}`,
          [{ answer: a, signed: true }, { answer: bq.p }, { answer: bq.q }], {
            shown: `${nb(`${Av} = ${iq(a)}`)}, ${nb(`${Bv} = ${iq(bq)}`)}`,
            explain: `${X} = ${iq(q)}에서 연속이므로 ${LIM(q, frac(top, den(q)))} = ${Bv}이다. 분모가 0으로 가므로 분자도 0으로 가야 한다: ` + (inUnknown ? `${rt(`${iq(c * q)} + ${Av}`)} = ${m}, ${Av} = ${iq(a)}.` : `${rt(iq(c * q + p))} + ${Av} = 0, ${Av} = ${iq(a)}.`)
              + ` 분자를 유리화하면 ${LIM(q, frac(c === 1 ? '1' : String(c), conj))} = ${frac(c, 2 * m)}${bq.q === 2 * m ? '' : ' = ' + iq(bq)}이므로 ${Bv} = ${iq(bq)}이다.`,
            facts: { calc: [[inUnknown ? `${m}*${m}-${c}*${jn(q)}` : `0-${m}`, 0], [`${c}/${g}`, 1], [`2*${m}/${g}`, 2]], derived: [m, 2, g] } });
      }
      const m = d.int(1, 3), q = nz(d, -4, 5), p = m * m - q, r = d.until(() => nz(d, -6, 6), (v) => v !== -q && v !== q), L = (q + r) * 2 * m;
      if (L === 0 || p === 0) return null;
      const a = nz(d, -6, 6), s = L - a * q;
      if (s === 0) return null;
      const num = fromRoots([q, -r]);
      const f = cases([[frac(ptext(num), `${rt(ptext([p, 1]))} ${MINUS} ${m}`), ne(q)], [poly([[1, Av + X], [s, '']]), eq(q)]]);
      return qAns(`함수 ${fIs(f)}가 ${X} = ${iq(q)}에서 연속일 때, 상수 ${Av}의 값은?`, a, { signed: true,
        explain: `분모를 유리화하면 ${X} ≠ ${iq(q)}일 때 ${FX} = ${frac(`(${den(q)})(${den(-r)})(${rt(ptext([p, 1]))} + ${m})`, den(q))} = (${den(-r)})(${rt(ptext([p, 1]))} + ${m})이므로 ${LIM(q)} = ${iq(q + r)} × ${2 * m} = ${iq(L)}이다. 연속이므로 ${fAt(q)} = ${iq(L)}: ${iq(q)}${Av} ${sgnT(s)} = ${iq(L)}, ${Av} = ${iq(a)}이다.`,
        facts: { value: `((${jn(q)}+${jn(r)})*2*${m}-${jn(s)})/${jn(q)}`, derived: [Math.abs(r), 2, m] } });
    }, { count: 2 }),

    // ①13 좌우 두 식이 주어진 경계에서 이어지도록 상수 하나
    T('cond-join', '좌우 두 식이 경계에서 이어지도록 상수 구하기', '①13', (d) => {
      const c = nz(d, -3, 3);
      let right, R, rExpr;
      if (d.bool()) { const u = d.int(-6, 6); right = ptext([u, 0, 1]); R = c * c + u; rExpr = `${jn(c)}*${jn(c)}+${jn(u)}`; }
      else { const t = d.int(1, 3), mm = d.pick([1, 2, 3, 4]), p = t * t - mm * c, v = d.int(-3, 3); if (p === 0) return null; right = rt(ptext([p, mm])) + (v ? ` ${sgnT(v)}` : ''); R = t + v; rExpr = `${t}+${jn(v)}`; }
      let left, k, kExpr, why;
      if (d.bool()) { const m2 = nz(d, -3, 3); left = poly([[m2, X], [1, Kv]]); k = R - m2 * c; kExpr = `${rExpr}-${jn(m2)}*${jn(c)}`; why = `${iq(m2 * c)} + ${Kv} = ${iq(R)}`; }
      else { const p0 = c + d.int(1, 3), w = d.int(-3, 3); if (R === w) return null; left = frac(Kv, den(p0)) + (w ? ` ${sgnT(w)}` : ''); k = (R - w) * (c - p0); kExpr = `(${rExpr}-${jn(w)})*(${jn(c)}-${jn(p0)})`; why = `${c - p0 < 0 ? MINUS : ''}${frac(Kv, Math.abs(c - p0))}${w ? ' ' + sgnT(w) : ''} = ${iq(R)}`; }
      if (k === 0) return null;
      const f = cases([[right, ge(c)], [left, lt(c)]]);
      return qAns(`함수 ${fIs(f)}가 ${X} = ${iq(c)}에서 연속이 되도록 하는 상수 ${Kv}의 값은?`, k, { signed: true,
        explain: `${fAt(c)} = ${LIM(c, null, '+')} = ${iq(R)}이므로 ${LIM(c, null, '-')}도 ${iq(R)}이어야 한다: ${why}, ${Kv} = ${iq(k)}이다.`,
        facts: { value: kExpr, derived: [2, 3] } });
    }),

    // ①14 경계 두 곳에서 연속 → 연립: 차례 1은 |x| 로 가른 두 식의 a, b, 차례 2는 a, b 를 구해 함숫값 둘(원문 합은 칸마다), 차례 3은 세 조각
    T('cond-two', '경계 두 곳에서 연속이 되는 상수 구하기', '①14', (d, n) => {
      if (n < 2) {
        const s = n === 1 ? 2 : d.pick([1, 2]), form = d.int(0, 2);
        let outer, inner, a, b, eqs, aE, bE;
        if (form === 0) { const e = nz(d, -6, 6), g = nz(d, -4, 4); outer = poly([[1, Av + X], [e, '']]); inner = poly([[1, X2], [g, X], [1, Bv]]); a = g; b = e - s * s; aE = jn(g); bE = `${jn(e)}-${s}*${s}`; }
        else if (form === 1) { const e = nz(d, -6, 6), h = nz(d, -4, 4); outer = poly([[1, X2], [h, X], [1, Av]]); inner = poly([[1, Bv + X], [e, '']]); b = h; a = e - s * s; aE = `${jn(e)}-${s}*${s}`; bE = jn(h); }
        else { const mm = nz(d, -4, 4), e = nz(d, -6, 6); outer = poly([[mm, X], [-1, Av]]); inner = poly([[1, X2], [-1, Bv + X], [e, '']]); b = -mm; a = -s * s - e; aE = `0-${s}*${s}-${jn(e)}`; bE = `0-${jn(mm)}`; }
        if (a === 0 || b === 0) return null;
        const f = cases([[outer, absX(GE, s)], [inner, absX('&lt;', s)]]);
        const atO = (t) => (form === 0 ? poly([[t, Av], [b + s * s, '']]) : form === 1 ? poly([[1, Av], [t * t + b * t, '']]) : poly([[-1, Av], [-b * t, '']]));
        const atI = (t) => (form === 0 ? poly([[1, Bv], [t * t + a * t, '']]) : form === 1 ? poly([[t, Bv], [a + s * s, '']]) : poly([[-t, Bv], [t * t - s * s - a, '']]));
        eqs = `${X} = ${iq(s)}에서 연속이므로 ${atO(s)} = ${atI(s)}, ${X} = ${iq(-s)}에서 연속이므로 ${atO(-s)} = ${atI(-s)}이다. 두 식을 연립하면`;
        if (n === 0) return vals(`함수 ${fIs(f)}가 모든 실수 ${X}에서 연속일 때, 상수 ${Av}, ${Bv}의 값은?`, [[Av, a], [Bv, b]], { explain: `${eqs} ${Av} = ${iq(a)}, ${Bv} = ${iq(b)}이다.`, facts: { calc: [[aE, 0], [bE, 1]], derived: [s] } });
        // 차례 2: 안쪽 한 점과 바깥쪽 한 점의 함숫값
        const pin = d.pick([...Array(2 * s - 1)].map((_, i) => i - s + 1).filter((v) => v !== 0)), pout = pm(d) * (s + d.int(1, 2));
        if (pin == null) return null;
        let vin, vout, inE, outE;
        if (form === 0) { const e = b + s * s, g = a; vin = pin * pin + g * pin + b; vout = a * pout + e; inE = `${jn(pin)}*${jn(pin)}+${jn(g)}*${jn(pin)}+${jn(e)}-${s}*${s}`; outE = `${jn(g)}*${jn(pout)}+${jn(e)}`; }
        else if (form === 1) { const e = a + s * s, h = b; vin = b * pin + e; vout = pout * pout + h * pout + a; inE = `${jn(h)}*${jn(pin)}+${jn(e)}`; outE = `${jn(pout)}*${jn(pout)}+${jn(h)}*${jn(pout)}+${jn(e)}-${s}*${s}`; }
        else { const mm = -b, e = -s * s - a; vin = pin * pin - b * pin + e; vout = mm * pout - a; inE = `${jn(pin)}*${jn(pin)}+${jn(mm)}*${jn(pin)}+${jn(e)}`; outE = `${jn(mm)}*${jn(pout)}+${s}*${s}+${jn(e)}`; }
        return M(`함수 ${fIs(f)}가 모든 실수 ${X}에서 연속일 때, ${jh(fAt(pin), '과/와')} ${fAt(pout)}의 값은? (단, ${Av}, ${jh(Bv, '은/는')} 상수이다.)`,
          [{ lead: fAt(pin) + ' =', answer: vin, signed: true }, { lead: fAt(pout) + ' =', answer: vout, signed: true }], {
            shown: `${nb(`${fAt(pin)} = ${iq(vin)}`)}, ${nb(`${fAt(pout)} = ${iq(vout)}`)}`,
            explain: `${eqs} ${Av} = ${iq(a)}, ${Bv} = ${iq(b)}이다. |${iq(pin)}| &lt; ${s}이므로 ${fAt(pin)} = ${iq(vin)}, |${iq(pout)}| ${GE} ${s}이므로 ${fAt(pout)} = ${iq(vout)}이다.`,
            facts: { calc: [[inE, 0], [outE, 1]], derived: [s] } });
      }
      // 세 조각: k/x (x ≥ t2), mx − a (−1 ≤ x < t2), x² + bx (x < −1)
      const t2 = d.pick([1, 2]), k = t2 * nz(d, -4, 4), mm = nz(d, -3, 3), a = mm * t2 - k / t2, b = mm + a + 1;
      if (a === 0 || b === 0) return null;
      const f = cases([[(k < 0 ? MINUS : '') + frac(Math.abs(k), X), ge(t2)], [poly([[mm, X], [-1, Av]]), nb(`${MINUS}1 ${LE} ${X} &lt; ${t2}`)], [poly([[1, X2], [1, Bv + X]]), lt(-1)]]);
      return vals(`함수 ${fIs(f)}가 모든 실수 ${X}에서 연속일 때, 상수 ${Av}, ${Bv}의 값은?`, [[Av, a], [Bv, b]], {
        explain: `${X} = ${t2}에서 연속이므로 ${iq(k / t2)} = ${iq(mm * t2)} ${MINUS} ${Av}, ${Av} = ${iq(a)}이다. ${X} = ${MINUS}1에서 연속이므로 ${iq(-mm)} ${MINUS} ${Av} = 1 ${MINUS} ${Bv}, 즉 ${iq(-mm - a)} = 1 ${MINUS} ${Bv}이고 ${Bv} = ${iq(b)}이다.`,
        facts: { calc: [[`${jn(mm)}*${t2}-${jn(k)}/${t2}`, 0], [`${jn(mm)}+${jn(mm)}*${t2}-${jn(k)}/${t2}+1`, 1]] } });
    }, { count: 3 }),

    // ①15 경계 x = a 가 미지수: 두 식의 x = a 에서의 값이 같게 하는 a(둘)
    T('cond-edge', '경계가 미지수일 때 연속이 되는 경계의 값 구하기', '①15', (d) => {
      const al = d.int(-4, 3), be = d.until(() => d.int(-3, 5), (v) => v > al), p = al + be, q0 = nz(d, -6, 6), r = al * be + q0;
      if (p === 0) return null;
      const f = cases([[ptext([q0, p]), ge(Av)], [ptext([r, 0, 1]), lt(Av)]]);
      return M(`함수 ${fIs(f)}가 ${X} = ${Av}에서 연속이 되도록 하는 실수 ${Av}의 값을 모두 구할 때, 그 가운데 작은 값과 큰 값은?`,
        [{ lead: '작은 값:', answer: al, signed: true }, { lead: '큰 값:', answer: be, signed: true }], {
          shown: `${iq(al)}, ${iq(be)}`,
          explain: `${X} = ${Av}에서 연속이려면 ${Av}에서의 두 식의 값이 같아야 한다: ${ptext([q0, p], Av)} = ${ptext([r, 0, 1], Av)}, ${ptext([r - q0, -p, 1], Av)} = 0, ${[al, be].map((v) => (v === 0 ? Av : `(${ptext([-v, 1], Av)})`)).join('')} = 0이므로 ${Av} = ${iq(al)} 또는 ${Av} = ${iq(be)}이다.`,
          facts: { calc: [[jn(al), 0], [jn(be), 1]], derived: [Math.abs(al), Math.abs(be)] } });
    }),

    // ①17 구간마다 세율이 다른 세금 함수가 연속이 되도록 누진 공제 금액 정하기(교과서 창의·연결)
    T('cond-tax', '세금 함수가 연속이 되도록 누진 공제 금액 정하기', '①17', (d) => {
      const t1 = d.int(10, 25) * 100, t2 = t1 + d.int(20, 40) * 100, t3 = t2 + d.int(20, 40) * 100;
      const r0 = d.pick([5, 6, 8, 10]), r = [r0]; for (let i = 0; i < 3; i += 1) r.push(r[i] + d.int(2, 10));
      const a = t1 * (r[1] - r[0]) / 100, b = a + t2 * (r[2] - r[1]) / 100, c = b + t3 * (r[3] - r[2]) / 100;
      if (![a, b, c].every(Number.isInteger) || c > 9999) return null;
      const rows = [`${X} ${LE} ${t1}: 세율 ${r[0]} %, 누진 공제 0`, `${t1} &lt; ${X} ${LE} ${t2}: 세율 ${r[1]} %, 누진 공제 ${Av}`, `${t2} &lt; ${X} ${LE} ${t3}: 세율 ${r[2]} %, 누진 공제 ${Bv}`, `${X} &gt; ${t3}: 세율 ${r[3]} %, 누진 공제 ${Cv}`];
      return M(`어느 나라에서는 과세 표준 금액이 ${X}만 원인 사람의 세금을 아래와 같이 정한다. ${FX} = ${X} × (${X}에 해당하는 세율)이라 하고 실제 세금 ${GX}만 원은 ${GX} = ${FX} ${MINUS} (${X}에 해당하는 누진 공제 금액)으로 계산한다. 함수 ${GX}가 ${X} ${GE} 0에서 연속이 되도록 하는 ${Av}, ${Bv}, ${Cv}의 값은? (금액의 단위는 만 원이다.)`,
        [{ lead: `${Av} =`, answer: a }, { lead: `${Bv} =`, answer: b }, { lead: `${Cv} =`, answer: c }], {
          figure: lines(rows), shown: `${Av} = ${a}, ${Bv} = ${b}, ${Cv} = ${c}`,
          explain: `${X} = ${t1}에서 ${GX}가 이어지려면 ${t1} × ${r[0]} % = ${t1} × ${r[1]} % ${MINUS} ${Av}, ${Av} = ${a}이다. 같은 방법으로 ${X} = ${t2}에서 ${t2} × ${r[1]} % ${MINUS} ${a} = ${t2} × ${r[2]} % ${MINUS} ${Bv}, ${Bv} = ${b}이고, ${X} = ${t3}에서 ${Cv} = ${c}이다. 공제 금액은 경계에서 생기는 세금의 차이(우극한 ${MINUS} 함숫값)를 앞의 공제 금액에 더한 것이다.`,
          facts: { calc: [[`${t1}*(${r[1]}-${r[0]})/100`, 0], [`${t1}*(${r[1]}-${r[0]})/100+${t2}*(${r[2]}-${r[1]})/100`, 1], [`${t1}*(${r[1]}-${r[0]})/100+${t2}*(${r[2]}-${r[1]})/100+${t3}*(${r[3]}-${r[2]})/100`, 2]], derived: [100] } });
    }),

    // ①18 (x − a)f(x) = 식인 연속함수의 f(a): 차례 1 일차식으로 나누어떨어지는 이차식, 차례 2 (x² − s²)f(x) = 삼차식(함숫값 둘), 차례 3 근호가 든 식(유리화)
    T('cond-val', '곱의 꼴로 준 연속함수의 함숫값 구하기', '①18', (d, n) => {
      if (n === 0) {
        const a = nz(d, -5, 5), m = d.pick([1, 1, 2, -1]), e = nz(d, -6, 6), P = pmul([-a, 1], [e, m]), v = m * a + e;
        if (P[0] === 0 || P[1] === 0) return null;
        return qAns(`모든 실수 ${X}에서 연속인 함수 ${FX}가 ${jh(nb(`(${den(a)})${FX} = ${ptext(P)}`), '을/를')} 만족시킬 때, ${fAt(a)}의 값은?`, v, { signed: true,
          explain: `${X} ≠ ${iq(a)}일 때 ${FX} = ${frac(`(${den(a)})(${ptext([e, m])})`, den(a))} = ${ptext([e, m])}이다. ${jh(FX, '이/가')} ${X} = ${iq(a)}에서 연속이므로 ${fAt(a)} = ${LIM(a, par(ptext([e, m])))} = ${iq(v)}이다.`,
          facts: { value: `2*${jn(P[2])}*${jn(a)}+${jn(P[1])}`, derived: [2] } });
      }
      if (n === 1) {
        const s = d.int(1, 3), r = d.until(() => nz(d, -5, 5), (v) => Math.abs(v) !== s), P = pmul([-s * s, 0, 1], [-r, 1]);
        return M(`모든 실수 ${X}에서 연속인 함수 ${FX}가 ${jh(nb(`(${ptext([-s * s, 0, 1])})${FX} = ${ptext(P)}`), '을/를')} 만족시킬 때, ${jh(fAt(-s), '과/와')} ${fAt(s)}의 값은?`,
          [{ lead: fAt(-s) + ' =', answer: -s - r, signed: true }, { lead: fAt(s) + ' =', answer: s - r, signed: true }], {
            shown: `${nb(`${fAt(-s)} = ${iq(-s - r)}`)}, ${nb(`${fAt(s)} = ${iq(s - r)}`)}`,
            explain: `오른쪽 식을 인수분해하면 (${ptext([-s * s, 0, 1])})(${den(r)})이므로 ${X} ≠ ±${s}일 때 ${FX} = ${den(r)}이다. 연속이므로 ${fAt(-s)} = ${LIM(-s, par(den(r)))} = ${iq(-s - r)}, ${fAt(s)} = ${LIM(s, par(den(r)))} = ${iq(s - r)}이다.`,
            facts: { calc: [[`0-${s}+${jn(P[2])}`, 0], [`${s}+${jn(P[2])}`, 1]] } });
      }
      const m = d.int(2, 3), q = nz(d, -3, 4), p = m * m - q, r2 = d.until(() => nz(d, -6, 6), (v) => v !== q), P = fromRoots([q, r2]), v = (q - r2) * 2 * m;
      if (p === 0) return null;
      return qAns(`${X} ${GE} ${iq(-p)}인 모든 실수 ${X}에서 연속인 함수 ${FX}가 ${jh(nb(`(${rt(ptext([p, 1]))} ${MINUS} ${m})${FX} = ${ptext(P)}`), '을/를')} 만족시킬 때, ${fAt(q)}의 값은?`, v, { signed: true,
        explain: `${X} ≠ ${iq(q)}일 때 ${FX} = ${frac(ptext(P), `${rt(ptext([p, 1]))} ${MINUS} ${m}`)} = (${den(r2)})(${rt(ptext([p, 1]))} + ${m})이다(분모를 유리화하면 ${jh(den(q), '이/가')} 약분된다). 연속이므로 ${fAt(q)} = ${iq(q - r2)} × ${2 * m} = ${iq(v)}이다.`,
        facts: { value: `(2*${jn(q)}+${jn(P[1])})*2*${m}`, derived: [2] } });
    }, { count: 3 }),

    // ①19 극한식 lim (x − a)(x − p)f(x)/(x − a) = L 에서 연속함수의 f(a)
    T('cond-limval', '극한식에서 연속함수의 함숫값 구하기', '①19', (d) => {
      const a = nz(d, -4, 4), p = d.until(() => nz(d, -5, 5), (v) => v !== a), v = nz(d, -6, 6), L = (a - p) * v, P = fromRoots([a, p]);
      if (P[1] === 0) return null;
      return qAns(`모든 실수 ${X}에서 연속인 함수 ${FX}가 ${LIM(a, frac(`(${ptext(P)})${FX}`, den(a)))} = ${jq(L, '을/를')} 만족시킬 때, ${fAt(a)}의 값은?`, v, { signed: true,
        explain: `${ptext(P)} = (${den(a)})(${den(p)})이므로 극한은 ${LIM(a, `(${den(p)})${FX}`)} = ${iq(a - p)}${fAt(a)}이다(${jh(FX, '이/가')} 연속이라 ${LIM(a)} = ${fAt(a)}). ${iq(a - p)}${fAt(a)} = ${iq(L)}에서 ${fAt(a)} = ${iq(v)}이다.`,
        facts: { value: `${jn(L)}/(2*${jn(a)}+${jn(P[1])})`, derived: [2] } });
    })
  ];

  B.addUnit({ id: '11-2-2', grade: 11, semester: 2, no: 2, title: '함수의 연속', version: 1, groups: [
    { id: 'cont', title: '함수의 연속과 불연속', standard: S3, types: cont },
    { id: 'interval', title: '구간과 연속함수', standard: S3, types: interval },
    { id: 'cond', title: '연속이 되는 조건', standard: S3, types: cond },
    { id: 'prop', title: '연속함수의 성질', standard: S4, types: [] },
    { id: 'maxmin', title: '최대·최소 정리', standard: S4, types: [] },
    { id: 'ivt', title: '사잇값 정리', standard: S4, types: [] }
  ] });
})(typeof window !== 'undefined' ? window : globalThis);
