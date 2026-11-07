// 고등학교 미적분Ⅰ Ⅱ-2 도함수의 활용(2) — 단원 틀·도구와 앞쪽 묶음(함수의 그래프의 개형, 최댓값과 최솟값, 최댓값·최솟값의 활용).
// 수집해 둔 천재 T셀파 미적분Ⅰ(홍진곤, 2022 개정)의 교과서·평가 자료에서 뽑은 문제 꼴 목록(기본꼴_1: 48꼴, 심화 문서 없음)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/11-2-5/싣기_대조표.md 에 있다.
// (방정식의 실근, 부등식, 속도와 가속도는 11-2-5b.js 에, 실력 문항은 11-2-5c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번.
// 성취기준은 12미적Ⅰ-02-08(함수의 그래프의 개형을 그릴 수 있다), 12미적Ⅰ-02-09(방정식과 부등식에 대한 문제를 해결할 수 있다),
// 12미적Ⅰ-02-10(미분을 속도와 가속도에 대한 문제에 활용하고, 그 유용성을 인식할 수 있다 — 직선 운동에 한하여 다룬다).
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(식·도함수의 그래프·조건·상황), 묻는 것(개형·최댓값과 최솟값·계수·실근의 개수·상수의 범위·속도와 가속도),
//    함수의 꼴(삼차·사차, 극값이 없는 점이 있는가)이 다르면 따로 싣는다. 수만 바꾼 유형은 만들지 않는다.
//  - 11-2-4(도함수의 활용(1))와의 경계: 증가·감소 표의 빈칸, 도함수의 그래프로 증가 구간·극값을 찾는 일, 극값을 구하는 데서 그치는 일은 11-2-4의 몫이다.
//    표나 도함수의 그래프·조건으로 함수의 그래프의 개형을 고르거나 함수를 정하는 일, 최댓값·최솟값, 방정식과 부등식, 속도·가속도와 시간에 대한
//    변화율(넓이·길이의 변화율 포함), 한 점에서 그은 접선의 개수(실근의 개수)는 이 단원의 몫이다.
//  - 사용자가 정한 대로 「간단한 문제만 다룬다」「지나치게 복잡한 계산은 다루지 않는다」를 까닭으로 수집본의 꼴을 빼지 않는다. 꼬여 있거나
//    세 단계 넘게 이어 생각해야 하는 꼴은 실력(11-2-5c.js)에 싣는다. 학년이 다른 단원(중학교·고1)과 같은 일도 싣는다.
//  - 답: 최댓값·최솟값·계수·속도처럼 음수가 될 수 있는 값은 모두 부호 단추를 단다(개수·길이·넓이·부피·걸린 시간은 단추 없이). 분수 답은 분자·분모 칸
//    (크기가 같은 분수도 맞게 친다). 원문의 「a + b의 값」「p + q의 값」「αβ의 값」「M − m의 값」처럼 따로 구한 값을 뜻 없이 더하거나 곱한 꼴은 값을 칸마다 따로 받는다.
//    개형은 작은 그래프 넷 가운데 고르게 하고, 보기 그래프에는 눈금을 적지 않는다(극점이 y축의 어느 쪽에 있는가, x축의 위인가 아래인가로 가린다).
//  - 그림: 고등학교 공용 plot 의 좌표평면에 곡선을 그린다. 그림 설명에는 답이 든 식을 적지 않는다.
//  - 답은 모두 코드가 셈한다. 검사 근거: 수 칸은 문제에 적힌 수로 다시 셈하는 식(facts.calc·value)이고, 극점처럼 글에 없는 수는 seal 이 facts.unseen 에 밝힌다.
//    실근의 개수처럼 식으로 다시 셀 수 없는 칸은 facts.check 에 셈의 바탕(함수의 계수·극값)을 적고 _work 의 따로 지은 풀이로 맞춰 보았다.
//    고르기의 참·거짓은 손으로 적지 않고 극점·극값의 부호를 견주어 코드로 가린다.
//
// 뺀 것과 까닭(11-2-5b.js, 11-2-5c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 11-2-4 의 몫: ①1(증가·감소 표의 빈칸 채우기). 극값을 구하는 데서 그치는 대단원·학기 시험 문항은 꼴 목록에도 세지 않았다.
//  - 놀이·활동: ①31(뉴턴법으로 실근의 어림값 구하기 — 창의·연결 활동).
//  - 그리기만 묻는 것(작도): 「그래프의 개형을 그리시오」 — 개형 고르기(①2~①5)로 바꾸어 실었다.
//  - 서술형만으로 묻는 것: ①18 의 ⑴⑵(관계식 쓰기 — ⑶의 비만 실었다), ①32 의 증명(최소가 되는 x 와 최솟값의 빈칸으로 바꾸어 실었다).
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, N, M, C } = B.kit;
  const { LAB, MINUS, Q, V, sup, nb, tag } = B.kit.mid;
  const { ms, jh, df, plot, qAns, signed } = B.kit.hs;
  const { Board } = B.kit.mgeo;
  const S8 = '12미적Ⅰ-02-08', S9 = '12미적Ⅰ-02-09', S10 = '12미적Ⅰ-02-10';
  const X = V('x'), TT = V('t');

  // ── 검사 근거 마무리 ──
  // 문항에서 보이는 수(검사와 같은 방법으로 읽는다): 글·그림(그림 설명 포함)·보기
  const stripH = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  function visibleNumbers(item) {
    const seen = stripH([item.text, item.figure || ''].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, ' $1 ').replace(/<table[^>]*aria-label="([^"]*)"[^>]*>/g, ' $1 | '));
    return new Set((seen.match(/\d+/g) || []).concat(seen.match(/\d+\.\d+/g) || [], seen.replace(/(\d) (?=\d)/g, '$1').match(/\d+/g) || []));
  }
  // 다시 셈하는 식의 수 가운데 글에 보이지 않는 수를 facts.unseen 에 밝힌다. 0, 1 과 facts.derived 로 밝히기로 한 수(극점, 지수의 셈에 쓰는 2·3 따위)만 된다.
  function seal(item) {
    const f = item.facts || {};
    if (f.calc) f.calc = f.calc.map(([t, i]) => [`(${t})+0`, i]);   // −0 이 나오지 않게(검사는 −0과 0을 가를 수 있다)
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
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make: retry(make) }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 기본 자료(' + ref + ')', make: retry(make) }, more || {});

  // ── 수 ──
  const near = (u, v) => Math.abs(u - v) < 1e-9;
  const sgn = (v) => (near(v, 0) ? 0 : v > 0 ? 1 : -1);
  // 실수를 분모 12 이하의 유리수로(계수·값이 1/2, 1/3, 2/3 … 인 것)
  function toQ(v) { for (let q = 1; q <= 64; q += 1) { const p = Math.round(v * q); if (Math.abs(v * q - p) < 1e-7) return Q(p, q); } throw new Error('유리수로 적을 수 없는 값: ' + v); }
  const isIntV = (v) => Math.abs(v - Math.round(v)) < 1e-9;
  // 화면 글: −3, 5/2(세로 분수)
  const qt = (v) => { const q = toQ(v); return q.q === 1 ? signed(q.p) : nb((q.p < 0 ? MINUS : '') + frac(Math.abs(q.p), q.q)); };
  // 검사 식 글: 음수는 괄호, 분수는 (p/q)
  const js = (v) => { const q = toQ(v); const body = q.q === 1 ? String(Math.abs(q.p)) : `${Math.abs(q.p)}/${q.q}`; return q.p < 0 ? `(-${body})` : q.q === 1 ? body : `(${body})`; };
  // 수 뒤의 토씨(음수는 크기의 끝소리, 분수는 분자)
  const qj = (v, pair) => jh(qt(v), pair);
  const sgnT = (v) => (v < 0 ? MINUS : '+');

  // ── 다항식(오름차순 계수의 배열: [상수항, x의 계수, x²의 계수, …]) ──
  const pz = (a) => { const out = a.slice(); while (out.length > 1 && near(out[out.length - 1], 0)) out.pop(); return out; };
  const padd = (a, b) => pz(Array.from({ length: Math.max(a.length, b.length) }, (_, i) => (a[i] || 0) + (b[i] || 0)));
  const pscale = (a, k) => pz(a.map((c) => c * k));
  const psub = (a, b) => padd(a, pscale(b, -1));
  const pmul = (a, b) => { const out = Array(a.length + b.length - 1).fill(0); a.forEach((x, i) => b.forEach((y, j) => { out[i + j] += x * y; })); return pz(out); };
  const pval = (a, x) => a.reduce((s, c, i) => s + c * x ** i, 0);
  const pder = (a) => (a.length < 2 ? [0] : pz(a.slice(1).map((c, i) => c * (i + 1))));
  const pint = (a, c) => [c || 0].concat(a.map((v, i) => v / (i + 1)));
  const lin1 = (r) => [-r, 1];
  const fromRoots = (rs, lead) => rs.reduce((acc, r) => pmul(acc, lin1(r)), [lead == null ? 1 : lead]);
  const intCoef = (a) => a.every(isIntV);
  // 화면 글: 계수가 분수이면 세로 분수로 적는다.
  const ptext = (a, v) => { const x = v || X; return B.kit.mid.poly(a.map((c, i) => [toQ(c), i === 0 ? '' : x + (i > 1 ? sup(i) : '')]).reverse()); };
  // 검사 식 글: 값 x 를 넣은 다항식(x 는 식 글 — 음수는 괄호에 넣어 준다)
  const pjs = (a, x) => a.map((c, i) => (near(c, 0) ? '' : i === 0 ? js(c) : `${js(c)}*${x}${i > 1 ? '**' + i : ''}`)).filter(Boolean).join('+') || '0';
  // 함수 글: f(x) = …, 이름과 변수를 바꿀 수 있다.
  const fx = (name, v) => `${V(name || 'f')}(${v == null ? X : v})`;
  // 이어 쓴 풀이 마디의 끝맺음: 「…이고」→「…이다」, 「…않고」→「…않는다」, 「…시키고」→「…시킨다」
  const endClause = (s) => s.replace(/없고$/, '없다').replace(/않고$/, '않는다').replace(/시키고$/, '시킨다').replace(/이고$/, '이다');
  const fIs = (a, name, v) => nb(`${fx(name, v)} = `) + ptext(a, v);
  // 인수분해한 글: k(x + 2)(x − 1)², 근이 0이면 x
  function facText(k, roots, v) {
    const x = v || X, cnt = new Map();
    roots.forEach((r) => cnt.set(r, (cnt.get(r) || 0) + 1));
    const parts = [...cnt.entries()].sort((p, q) => p[0] - q[0]).map(([r, m]) => { const base = near(r, 0) ? x : `(${x} ${r < 0 ? '+' : MINUS} ${qt(Math.abs(r))})`; return m > 1 ? base + sup(m) : base; });
    const zero = parts.filter((s) => s.startsWith(x)), rest = parts.filter((s) => !s.startsWith(x));
    return nb((near(k, 1) ? '' : near(k, -1) ? MINUS : qt(k)) + zero.concat(rest).join(''));
  }
  // 구간 글
  const closed = (lo, hi) => nb(`[${qt(lo)}, ${qt(hi)}]`);
  const open = (lo, hi) => nb(`(${qt(lo)}, ${qt(hi)})`);

  // ── 삼차·사차함수 짓기(극점을 먼저 정한다) ──
  // f′(x) = 3a(x − p)(x − q) 인 삼차함수(상수항 c)
  const cubicOf = (a, p, q, c) => [c, 3 * a * p * q, -1.5 * a * (p + q), a];
  // f′(x) = 4a(x − p)(x − q)(x − r) 인 사차함수(상수항 c)
  const quarticOf = (a, p, q, r, c) => [c, -4 * a * p * q * r, 2 * a * (p * q + q * r + r * p), -(4 / 3) * a * (p + q + r), a];
  // 정류점(f′ = 0)의 종류: 좌우의 f′ 부호로 가른다(극대 'max', 극소 'min', 극값이 아닌 수평 'flat').
  function kindAt(a, x) {
    const dp = pder(a), e = 1e-4, l = sgn(pval(dp, x - e)), r = sgn(pval(dp, x + e));
    return l > 0 && r < 0 ? 'max' : l < 0 && r > 0 ? 'min' : 'flat';
  }
  const KIND = { max: '극대', min: '극소', flat: '극값이 아님' };

  // ── 개형 보기 그림 ──
  // 극점 crits(x 들)의 자리와 값이 잘 보이게 그림의 범위를 잡아 작은 그래프를 그린다(눈금 없이 축과 곡선만).
  function frameOf(a, crits) {
    const xs = crits.concat([0]), lo = Math.min(...xs), hi = Math.max(...xs), spx = Math.max(hi - lo, 2);
    const vals = crits.map((x) => pval(a, x)).concat([0, pval(a, 0)]), ylo = Math.min(...vals), yhi = Math.max(...vals), spy = Math.max(yhi - ylo, 1e-6);
    return { x: [lo - 0.42 * spx, hi + 0.42 * spx], y: [ylo - 0.28 * spy, yhi + 0.28 * spy], spx, spy };
  }
  function mini(a, crits, o) {
    const opt = o || {}, fr = frameOf(a, crits), w = opt.w || 122, h = opt.h || 84, ux = (w - 46) / (fr.x[1] - fr.x[0]);
    return plot({ x: fr.x, y: fr.y, w, ys: h / ((fr.y[1] - fr.y[0]) * ux), curves: [{ f: (x) => pval(a, x) }] });
  }
  // 보기 그림에서 알아볼 수 있는가: 0이 아닌 극점은 y축에서, 0이 아닌 극값과 y절편은 x축에서 넉넉히 떨어져 있다.
  function readable(a, crits) {
    const fr = frameOf(a, crits);
    if (crits.some((x) => !near(x, 0) && Math.abs(x) < 0.16 * fr.spx)) return false;
    if (crits.some((x) => { const v = pval(a, x); return !near(v, 0) && Math.abs(v) < 0.13 * fr.spy; })) return false;
    if (!crits.some((x) => near(x, 0))) { const v0 = pval(a, 0); if (near(v0, 0) || Math.abs(v0) < 0.1 * fr.spy) return false; }
    for (let i = 1; i < crits.length; i += 1) if (Math.abs(pval(a, crits[i]) - pval(a, crits[i - 1])) < 0.2 * fr.spy) return false;
    return true;
  }
  // 그래프의 생김새(보기끼리 달라야 한다): 최고차항의 부호, 극점마다 [y축의 어느 쪽, 종류, x축의 위·아래], y절편의 부호
  const shapeKey = (a, crits, values) => JSON.stringify([sgn(a[a.length - 1]), crits.map((x) => [sgn(x), kindAt(a, x), values ? sgn(pval(a, x)) : 0]), values ? sgn(pval(a, 0)) : 0]);
  // 보기 그림: 기호와 그림을 나란히
  const figOpt = (lab, fig) => `<span style="display:inline-flex;align-items:flex-start;gap:6px"><span style="font-weight:700">${lab}</span>${fig}</span>`;
  // rows: [{ fig, ok }] — ok 인 것이 하나뿐이다. explain 은 (정답의 기호) => 글.
  function figChoice(d, text, rows, o) {
    const list = d.shuffle(rows), at = list.findIndex((r) => r.ok);
    return C(text, list.map((r, i) => figOpt(LAB[i], r.fig)), at, { figure: o.figure, explain: o.explain(LAB[at]), facts: Object.assign({ truth: list.map((r) => Boolean(r.ok)), want: true }, o.facts || {}) });
  }
  // ㄱ, ㄴ, ㄷ 가운데 옳은 것을 「있는 대로 고른 것」: 보기 다섯(정답 포함). flags 는 하나 이상 참. head 는 보기 위에 놓을 그림(조건 상자 따위).
  const GA = ['ㄱ', 'ㄴ', 'ㄷ'];
  const COMBOS = [[0], [1], [2], [0, 1], [0, 2], [1, 2], [0, 1, 2]];
  function comboPick(d, text, list, flags, explain, head) {
    const right = [0, 1, 2].filter((i) => flags[i]);
    if (!right.length) return null;
    const key = (c) => c.join(','), others = d.shuffle(COMBOS.filter((c) => key(c) !== key(right))).slice(0, 4);
    const rows = others.concat([right]).sort((u, v) => u.length - v.length || key(u).localeCompare(key(v)));
    const bogi = lines(list.map((h, i) => `<b>${GA[i]}.</b> ${h}`));
    return C(text, rows.map((c) => c.map((i) => GA[i]).join(', ')), rows.findIndex((c) => key(c) === key(right)), { figure: head ? head + bogi : bogi, explain, facts: { truth: rows.map((c) => key(c) === key(right)), want: true } });
  }
  // 조건 상자(㈎ ㈏ …)
  const conds = (list) => `<div class="mb-lines" style="border:1px solid #c8ced6;border-radius:8px;padding:6px 10px;margin-bottom:6px">${list.map((h, i) => `<div>${'㈎㈏㈐㈑'[i]} ${h}</div>`).join('')}</div>`;

  B.kit.u25x = {
    endClause, S8, S9, S10, X, TT, seal, retry, T, H, stripH, near, sgn, toQ, isIntV, qt, js, qj, sgnT, pz, padd, pscale, psub, pmul, pval, pder, pint, lin1, fromRoots, intCoef,
    ptext, pjs, fx, fIs, facText, closed, open, cubicOf, quarticOf, kindAt, KIND, frameOf, mini, readable, shapeKey, figOpt, figChoice, GA, comboPick, conds
  };

  // ── 개형 고르기의 보기 짓기 ──
  // 삼차함수: 극점 p < q(정수), 최고차항의 계수 a(±1이면 p + q 가 짝수), 상수항 c
  function cubicCand(d, s) {
    const p = d.int(-3, 2), q = d.int(p + 1, 3), a = s * ((p + q) % 2 === 0 ? d.pick([1, 2]) : 2), base = cubicOf(a, p, q, 0);
    const c = d.int(-12, 12), f = padd(base, [c]);
    return intCoef(f) && readable(f, [p, q]) ? { a: f, crits: [p, q] } : null;
  }
  // 사차함수(극점 셋): 극점 p < q < r, p + q + r 은 3의 배수
  function quarticCand(d, s) {
    const p = d.int(-3, 1), q = d.int(p + 1, 2), r = d.int(q + 1, 3);
    if ((p + q + r) % 3 !== 0) return null;
    const f = padd(quarticOf(s, p, q, r, 0), [d.int(-12, 12)]);
    return intCoef(f) && readable(f, [p, q, r]) ? { a: f, crits: [p, q, r] } : null;
  }
  // 사차함수(극값이 아닌 수평점 하나와 극점 하나): f′ = 4s(x − p)²(x − q)
  function shelfCand(d, s) {
    const p = d.int(-2, 2), q = d.pick([-3, -2, -1, 0, 1, 2, 3].filter((v) => v !== p)), k = (2 * p + q) % 3 === 0 ? 1 : 3;
    const f = padd(pscale(pint(fromRoots([p, p, q], 4 * s)), k), [d.int(-12, 12)]);
    return intCoef(f) && readable(f, [p, q].sort((u, v) => u - v)) ? { a: f, crits: [p, q].sort((u, v) => u - v) } : null;
  }
  // 사차함수(극점 하나, f′ = 4s(x − p)((x − p)² + w)): 그래프가 U 모양
  function bowlCand(d, s) {
    const p = d.pick([-2, -1, 1, 2]), w = d.int(1, 3), f = padd(pint(pmul(lin1(p), padd(pmul(lin1(p), lin1(p)), [w])).map((c) => c * 4 * s)), [d.int(-12, 12)]);
    return intCoef(f) && readable(f, [p]) ? { a: f, crits: [p] } : null;
  }
  // 정답 보기 하나와 생김새가 다른 틀린 보기 셋을 모은다. makers: [(d) => 후보 | null]
  function pickShapes(d, truth, makers, values) {
    const keys = new Set([shapeKey(truth.a, truth.crits, values)]), out = [];
    for (let i = 0; i < 400 && out.length < 3; i += 1) {
      const c = makers[out.length % makers.length](d);
      if (!c) continue;
      const k = shapeKey(c.a, c.crits, values);
      if (keys.has(k)) continue;
      keys.add(k); out.push(c);
    }
    return out.length === 3 ? out : null;
  }
  // 극점과 극값을 말로 적은 풀이
  const VAL = { max: '극댓값', min: '극솟값' };
  const critWords = (a, crits) => crits.map((x) => { const k = kindAt(a, x); return k === 'flat' ? `${nb(`${X} = ${qt(x)}`)}에서는 ${df('f')}(${X})의 부호가 바뀌지 않아 극값을 갖지 않고` : `${nb(`${X} = ${qt(x)}`)}에서 ${KIND[k]}이고 ${VAL[k]}은 ${qt(pval(a, x))}이고`; }).join(', ');

  // ════════════════════════════════════════════════════════════════
  // 함수의 그래프의 개형
  // ════════════════════════════════════════════════════════════════
  const shapeAsk = (a) => `함수 ${fIs(a)}의 그래프의 개형으로 알맞은 것은?`;
  const derText = (a, crits) => { const dp = pder(a), rs = rootsOfDer(a, crits); return rs.length === dp.length - 1 ? `${ptext(dp)} = ${facText(dp[dp.length - 1], rs)}` : ptext(dp); };
  const shapeExplain = (a, crits, lead) => (lab) => `${nb(`${df('f')}(${X}) = `)}${derText(a, crits)}이다. ${endClause(critWords(a, crits))}. `
    + (crits.some((x) => near(x, 0)) ? '' : `또 그래프는 y축과 점 (0, ${qt(pval(a, 0))})에서 만난다. `) + `${lead} 따라서 알맞은 개형은 ${lab}이다.`;
  // f′ = 0 의 실근(중근은 두 번)
  function rootsOfDer(a, crits) { const dp = pder(a), out = []; for (const x of crits) { out.push(x); if (Math.abs(pval(pder(dp), x)) < 1e-7) out.push(x); } return out; }
  const leadWords = (a) => (a.length === 4 ? (a[3] > 0 ? '최고차항의 계수가 양수이므로 오른쪽 끝은 위로, 왼쪽 끝은 아래로 뻗는다.' : '최고차항의 계수가 음수이므로 오른쪽 끝은 아래로, 왼쪽 끝은 위로 뻗는다.')
    : (a[4] > 0 ? '최고차항의 계수가 양수이므로 양쪽 끝이 모두 위로 뻗는다.' : '최고차항의 계수가 음수이므로 양쪽 끝이 모두 아래로 뻗는다.'));

  const shape = [
    T('shape-cubic', '삼차함수의 그래프의 개형 고르기', '①2', (d) => {
      const s = d.pick([1, -1]), truth = cubicCand(d, s);
      if (!truth) return null;
      // 틀린 보기: 최고차항의 부호를 뒤집은 것 하나, 같은 부호이면서 극점이 y축의 다른 쪽에 있거나 극값의 부호가 다른 것 둘
      const others = pickShapes(d, truth, [(dd) => cubicCand(dd, s), (dd) => cubicCand(dd, s), (dd) => cubicCand(dd, -s)], true);
      if (!others) return null;
      return figChoice(d, shapeAsk(truth.a), [{ fig: mini(truth.a, truth.crits), ok: true }].concat(others.map((c) => ({ fig: mini(c.a, c.crits) }))), {
        explain: shapeExplain(truth.a, truth.crits, leadWords(truth.a)) });
    }),
    T('shape-quartic', '사차함수의 그래프의 개형 고르기(극값이 셋)', '①3', (d) => {
      const s = d.pick([1, 1, -1]), truth = quarticCand(d, s);
      if (!truth) return null;
      const others = pickShapes(d, truth, [(dd) => quarticCand(dd, s), (dd) => quarticCand(dd, s), (dd) => quarticCand(dd, -s)], true);
      if (!others) return null;
      return figChoice(d, shapeAsk(truth.a), [{ fig: mini(truth.a, truth.crits), ok: true }].concat(others.map((c) => ({ fig: mini(c.a, c.crits) }))), {
        explain: shapeExplain(truth.a, truth.crits, leadWords(truth.a)) });
    }),
    T('shape-flat', '극값이 하나뿐인 사차함수의 그래프의 개형 고르기', '①4', (d, n) => {
      // n = 0: f′(x) = 0 의 중근(극값이 아닌 수평점)이 있는 것, n = 1: f′(x) = 0 의 나머지 두 근이 허근이라 극점이 하나뿐인 것
      const s = d.pick([1, 1, -1]), truth = n === 0 ? shelfCand(d, s) : bowlCand(d, s);
      if (!truth) return null;
      const others = pickShapes(d, truth, n === 0 ? [(dd) => quarticCand(dd, s), (dd) => shelfCand(dd, s), (dd) => bowlCand(dd, s)] : [(dd) => quarticCand(dd, s), (dd) => shelfCand(dd, s), (dd) => bowlCand(dd, s)], true);
      if (!others) return null;
      return figChoice(d, shapeAsk(truth.a), [{ fig: mini(truth.a, truth.crits), ok: true }].concat(others.map((c) => ({ fig: mini(c.a, c.crits) }))), {
        explain: shapeExplain(truth.a, truth.crits, leadWords(truth.a) + (n === 1 ? ` ${df('f')}(${X}) = 0의 실근은 ${X} = ${qt(truth.crits[0])} 하나뿐이다.` : '')), facts: { rule: 'flat-' + n } });
    }, { count: 2 }),
    T('shape-fprime', '도함수의 그래프로 함수의 그래프의 개형 고르기', '①5', (d, n) => {
      // n = 0: 도함수가 이차함수, n = 1: 도함수가 삼차함수. 보기 그래프의 높낮이는 정해지지 않으므로(상수를 더해도 도함수가 같다) 극점의 자리와 종류로만 가린다.
      const pool = [-3, -2, -1, 1, 2, 3];
      const structs = n === 0 ? [[2, 0], [1, 1]] : [[3, 0], [2, 1], [1, 0]];   // [서로 다른 실근의 수, 중근의 수]
      const make = (dd, lead) => {
        const [k, dbl] = dd.pick(structs), xs = dd.shuffle(pool).slice(0, k).sort((u, v) => u - v);
        let roots = xs.slice();
        if (dbl) { const j = dd.int(0, k - 1); roots = roots.concat([xs[j]]); }
        let fp = fromRoots(roots, lead);
        if (n === 1 && roots.length === 1) fp = pmul(fp, [dd.int(1, 3), 0, 1]);   // (x − p)(x² + w)
        const f0 = pint(fp), crits = xs, vals = crits.map((x) => pval(f0, x)), hi = Math.max(...vals), lo = Math.min(...vals);
        // 높낮이는 정해지지 않으므로 극값의 가운데가 x축 근처에 오게 옮긴다. 이웃한 정류점의 높이가 너무 가까우면 모양이 안 보인다.
        const a = padd(f0, [crits.length > 1 ? -(hi + lo) / 2 : -vals[0] + 1]), fr = frameOf(a, crits);
        for (let i = 1; i < crits.length; i += 1) if (Math.abs(vals[i] - vals[i - 1]) < 0.22 * fr.spy) return null;
        return { fp, a, crits };
      };
      const lead = d.pick([1, -1]), truth = make(d, lead);
      if (!truth) return null;
      const others = pickShapes(d, truth, [(dd) => make(dd, lead), (dd) => make(dd, -lead), (dd) => make(dd, lead)], false);
      if (!others) return null;
      // 도함수의 그래프(눈금 없이 — 근이 y축의 어느 쪽에 있는지와 x축을 지나는지·닿는지를 읽는다)
      const xs = truth.crits.concat([0]), lo = Math.min(...xs) - 1.3, hi = Math.max(...xs) + 1.3;
      let ymin = 0, ymax = 0;
      for (let i = 0; i <= 80; i += 1) { const x = lo + (hi - lo) * i / 80, v = pval(truth.fp, x); if (x > Math.min(...truth.crits) - 0.9 && x < Math.max(...truth.crits) + 0.9) { ymin = Math.min(ymin, v); ymax = Math.max(ymax, v); } }
      const sp = Math.max(ymax - ymin, 1), ux = (230 - 46) / (hi - lo);
      const figure = plot({ x: [lo, hi], y: [ymin - 0.35 * sp, ymax + 0.35 * sp], w: 230, ys: 130 / ((1.7 * sp) * ux), curves: [{ f: (x) => pval(truth.fp, x), name: "y=f'(x)" }] });
      const words = truth.crits.map((x) => { const k = kindAt(truth.a, x); return k === 'flat' ? `y축의 ${x < 0 ? '왼쪽' : '오른쪽'}에서 x축에 닿는 곳에서는 ${df('f')}(${X})의 부호가 바뀌지 않아 극값이 없고` : `y축의 ${x < 0 ? '왼쪽' : '오른쪽'}에서 x축을 지나는 곳에서는 ${df('f')}(${X})의 부호가 ${k === 'max' ? '양에서 음으로 바뀌어 극대' : '음에서 양으로 바뀌어 극소'}이고`; }).join(', ');
      return figChoice(d, `함수 ${fx()}의 도함수 ${nb(`${V('y')} = ${df('f')}(${X})`)}의 그래프가 그림과 같다. 함수 ${nb(`${V('y')} = ${fx()}`)}의 그래프의 개형으로 알맞은 것은?`,
        [{ fig: mini(truth.a, truth.crits), ok: true }].concat(others.map((c) => ({ fig: mini(c.a, c.crits) }))), {
          figure, explain: (lab) => `도함수의 그래프가 ${endClause(words)}. 따라서 알맞은 개형은 ${lab}이다.`, facts: { rule: 'fprime-' + n } });
    }, { count: 2 }),
    T('shape-cards', '조건을 모두 만족시키는 삼차함수 고르기', '①6', (d) => {
      // 최고차항의 계수가 1인 삼차함수들(t 는 크기): 극점과 극값을 코드로 셈해 조건마다 참·거짓을 가린다.
      const t = d.pick([1, 1, 2]), M4 = 4 * t ** 3;
      const pool = [
        [4 * t ** 3, 0, -3 * t, 1],              // 극대 (0, 4t³), 극소 (2t, 0)
        [0, 0, 3 * t, 1],                        // 극대 (−2t, 4t³), 극소 (0, 0)
        [2 * t ** 3, -3 * t * t, 0, 1],          // 극대 (−t, 4t³), 극소 (t, 0)
        [0, 9 * t * t, -6 * t, 1],               // 극대 (t, 4t³), 극소 (3t, 0)
        [4 * t ** 3, 0, -t, 1],                  // 극대 (0, 4t³), 극소는 0이 아니다
        [0, 0, -3 * t, 1],                       // 극대 (0, 0), 극소 (2t, −4t³)
        [-2 * t ** 3, -3 * t * t, 0, 1]          // 극대 (−t, 0), 극소 (t, −4t³)
      ];
      const info = (a) => {
        const D = a[2] * a[2] - 3 * a[1];   // f′ = 3x² + 2bx + c 의 판별식/4
        if (D <= 0) return { two: false, crit: [] };
        const x1 = (-a[2] - Math.sqrt(D)) / 3, x2 = (-a[2] + Math.sqrt(D)) / 3;
        return { two: true, crit: [x1, x2], max: pval(a, x1), min: pval(a, x2) };
      };
      const C1 = { h: `${df('f')}(0) = 0`, ok: (a) => near(a[1], 0) };
      const C2 = { h: `극댓값이 ${M4}이다.`, ok: (a) => { const i = info(a); return i.two && near(i.max, M4); } };
      const C3 = { h: '그래프가 x축에 접한다.', ok: (a) => { const i = info(a); return i.two && (near(i.max, 0) || near(i.min, 0)); } };
      const C4 = { h: '극솟값이 0이다.', ok: (a) => { const i = info(a); return i.two && near(i.min, 0); } };
      const C5 = { h: nb(`${X} = ${t}`) + '에서 극값을 갖는다.', ok: (a) => { const i = info(a); return i.two && i.crit.some((x) => near(x, t)); } };
      const cards = d.pick([[C1, C2, C3], [C5, C2, C4], [C1, C4, C2]]);
      const flag = (a) => cards.every((c) => c.ok(a));
      const yes = pool.filter(flag), no = pool.filter((a) => !flag(a));
      if (yes.length < 1) return null;
      const k = d.pick([1, 2, 2]), pickYes = d.shuffle(yes).slice(0, Math.min(k, yes.length)), pickNo = d.shuffle(no).slice(0, 3 - pickYes.length);
      const list = d.shuffle(pickYes.concat(pickNo)), flags = list.map(flag);
      const why = list.map((a, i) => {
        const j = cards.findIndex((c) => !c.ok(a));
        return j >= 0 ? `${GA[i]}은 조건 ${'㈎㈏㈐'[j]}를 만족시키지 않고` : `${GA[i]}은 세 조건을 모두 만족시키고`;
      }).join(', ');
      return comboPick(d, '최고차항의 계수가 1인 삼차함수 ' + fx() + '에 대한 세 조건을 모두 만족시키는 함수만을 보기에서 있는 대로 고른 것은?',
        list.map((a) => fIs(a)), flags, `${endClause(why)}. 극점은 ${df('f')}(${X}) = 0에서 구하고, 그래프가 x축에 접하는 것은 극값 가운데 하나가 0일 때이다.`, conds(cards.map((c) => c.h)));
    })
  ];

  // ════════════════════════════════════════════════════════════════
  // 함수의 최댓값과 최솟값
  // ════════════════════════════════════════════════════════════════
  // 닫힌구간 [L, R] 에서 다항함수 a 의 최대·최소: 극점(구간 안)과 양 끝에서의 값을 비교한다. 값이 가장 큰(작은) 자리를 돌려준다.
  function extremaOn(a, crits, L, R) {
    const pts = [L].concat(crits.filter((x) => x > L && x < R), [R]), vals = pts.map((x) => pval(a, x));
    const hi = Math.max(...vals), lo = Math.min(...vals);
    return { pts, vals, max: hi, min: lo, at: pts[vals.indexOf(hi)], bt: pts[vals.indexOf(lo)] };
  }
  const maxmin = [
    T('maxmin-closed', '닫힌구간에서 다항함수의 최댓값과 최솟값', '①7', (d, n) => {
      // n = 0: 삼차함수, 구간이 두 극점을 모두 품는다 / n = 1: 삼차함수, 구간이 극점 하나만 품는다(끝점에서 최대 또는 최소) / n = 2: 사차함수
      let a, crits;
      if (n < 2) { const p = d.int(-3, 1), q = d.int(p + 1, 3), k = d.pick([1, -1]) * ((p + q) % 2 === 0 ? d.pick([1, 2]) : 2); a = padd(cubicOf(k, p, q, 0), [d.int(-9, 9)]); crits = [p, q]; }
      else { const p = d.int(-3, 0), q = d.int(p + 1, 2), r = d.int(q + 1, 3); if ((p + q + r) % 3) return null; a = padd(quarticOf(d.pick([1, 1, 2]), p, q, r, 0), [d.int(-9, 9)]); crits = [p, q, r]; }
      if (!intCoef(a)) return null;
      const lo = Math.min(...crits), hi = Math.max(...crits);
      let L, R;
      if (n === 0) { L = lo - d.int(1, 2); R = hi + d.int(1, 2); }
      else if (n === 1) { if (hi - lo < 2) return null; if (d.bool()) { L = lo - d.int(1, 2); R = d.int(lo + 1, hi - 1); } else { R = hi + d.int(1, 2); L = d.int(lo + 1, hi - 1); } }
      else { L = lo - d.int(0, 1); R = hi + d.int(0, 1); if (L === lo && R === hi) R += 1; }
      const e = extremaOn(a, crits, L, R);
      if (Math.abs(e.max) > 999 || Math.abs(e.min) > 999 || near(e.max, e.min)) return null;
      // 최대·최소가 한 자리에서만 나오게(같은 값의 자리가 둘이면 설명이 흐려진다)
      if (e.vals.filter((v) => near(v, e.max)).length > 1 || e.vals.filter((v) => near(v, e.min)).length > 1) return null;
      const inside = crits.filter((x) => x > L && x < R);
      return M(`닫힌구간 ${closed(L, R)}에서 함수 ${fIs(a)}의 최댓값과 최솟값은?`, [{ label: '최댓값', answer: e.max, signed: true }, { label: '최솟값', answer: e.min, signed: true }], {
        explain: `${df('f')}(${X}) = ${facText(pder(a)[pder(a).length - 1], rootsOfDer(a, crits))}이므로 구간 안의 극점은 ${inside.map((x) => nb(`${X} = ${qt(x)}`)).join(', ')}이다. `
          + `${e.pts.map((x) => nb(`${fx('f', qt(x))} = ${qt(pval(a, x))}`)).join(', ')}이므로 최댓값은 ${qt(e.max)}, 최솟값은 ${qt(e.min)}이다.`,
        facts: { calc: [[pjs(a, js(e.at)), 0], [pjs(a, js(e.bt)), 1]], derived: crits.map(Math.abs).concat([2, 3, 4]), rule: 'closed-' + n } });
    }, { count: 3 }),
    T('maxmin-coef', '최댓값과 최솟값이 주어질 때 계수 구하기', '①8', (d, n) => {
      if (n === 0) {
        // f(x) = a(x³ − 3k²x) + b (a > 0): 구간에서 g(x) = x³ − 3k²x 가 최대·최소인 자리를 a > 0 으로 가린다.
        const k = d.int(1, 3), g = [0, -3 * k * k, 0, 1], side = d.pick([-1, 1]), L = side < 0 ? -k - d.int(1, 2) : d.int(0, k - 1), R = side < 0 ? d.int(-k + 1, 0) : k + d.int(1, 2);
        if (L >= R) return null;
        const e = extremaOn(g, [-k, k], L, R), A = d.int(1, 3), Bv = d.int(-9, 12), mx = A * e.max + Bv, mn = A * e.min + Bv;
        if (mx === mn || Math.abs(mx) > 999 || Math.abs(mn) > 999) return null;
        const body = `${V('a')}${X}${sup(3)} ${MINUS} ${3 * k * k}${V('a')}${X} + ${V('b')}`;
        return M(`닫힌구간 ${closed(L, R)}에서 함수 ${nb(`${fx()} = ${body}`)}의 최댓값이 ${qt(mx)}, 최솟값이 ${qt(mn)}일 때, 상수 ${V('a')}, ${V('b')}의 값은? ${nb(`(단, ${V('a')} &gt; 0)`)}`,
          [{ label: V('a'), answer: A, signed: true }, { label: V('b'), answer: Bv, signed: true }], {
            explain: `${df('f')}(${X}) = ${3}${V('a')}(${X} + ${k})(${X} ${MINUS} ${k})이다. ${V('a')} &gt; 0이므로 구간에서 ${fx()}는 ${nb(`${X} = ${qt(e.at)}`)}에서 최대, ${nb(`${X} = ${qt(e.bt)}`)}에서 최소이다. `
              + `${nb(`${qt(e.max)}${V('a')} + ${V('b')} = ${qt(mx)}`)}, ${jh(nb(`${qt(e.min)}${V('a')} + ${V('b')} = ${qt(mn)}`), '을/를')} 풀면 ${nb(`${V('a')} = ${A}`)}, ${nb(`${V('b')} = ${qt(Bv)}`)}이다.`,
            facts: { calc: [[`(${js(mx)}-${js(mn)})/(${pjs(g, js(e.at))}-(${pjs(g, js(e.bt))}))`, 0], [`${js(mx)}-(${js(mx)}-${js(mn)})/(${pjs(g, js(e.at))}-(${pjs(g, js(e.bt))}))*(${pjs(g, js(e.at))})`, 1]], derived: [k, 2, 3], rule: 'coef-0' } });
      }
      // f(x) = x³ + (3/2)(a − 1)x² − 3ax + b (a > 0): f′ = 3(x + a)(x − 1), 구간 [0, m] 에서 최소는 x = 1, 최대는 x = m
      const m = d.pick([2, 3]), A = d.pick([1, 3, 5]), Bv = d.int(-6, 9);
      const f = [Bv, -3 * A, 1.5 * (A - 1), 1], mx = pval(f, m), mn = pval(f, 1);
      if (!isIntV(mx) || !isIntV(mn) || Math.abs(mx) > 999 || Math.abs(mn) > 999 || pval(f, 0) > mx) return null;
      const body = `${X}${sup(3)} + ${frac(3, 2)}(${V('a')} ${MINUS} 1)${X}${sup(2)} ${MINUS} 3${V('a')}${X} + ${V('b')}`;
      const g0 = m === 2 ? [2, 0] : [27 / 2, 9 / 2];   // f(m) − b = g0[0] + g0[1]·a
      return M(`닫힌구간 ${closed(0, m)}에서 함수 ${nb(`${fx()} = ${body}`)}의 최댓값이 ${qt(mx)}, 최솟값이 ${qt(mn)}일 때, 상수 ${V('a')}, ${V('b')}의 값은? ${nb(`(단, ${V('a')} &gt; 0)`)}`,
        [{ label: V('a'), answer: A, signed: true }, { label: V('b'), answer: Bv, signed: true }], {
          explain: `${df('f')}(${X}) = 3(${X} + ${V('a')})(${X} ${MINUS} 1)이고 ${V('a')} &gt; 0이므로 구간에서 ${nb(`${X} = 1`)}일 때 최소이다. ${nb(`${fx('f', 0)} = ${V('b')}`)}, ${nb(`${fx('f', m)} = ${V('b')} + ${m === 2 ? '2' : `${frac(27, 2)} + ${frac(9, 2)}${V('a')}`}`)}이므로 최댓값은 ${fx('f', m)}이다. `
            + `${nb(`${fx('f', 1)} = ${V('b')} ${MINUS} ${frac(1, 2)} ${MINUS} ${frac(3, 2)}${V('a')} = ${qt(mn)}`)}, ${jh(nb(`${fx('f', m)} = ${qt(mx)}`), '을/를')} 풀면 ${nb(`${V('a')} = ${A}`)}, ${nb(`${V('b')} = ${qt(Bv)}`)}이다.`,
          facts: { calc: m === 2 ? [[`(${js(mx)}-2-${js(mn)}-1/2)*2/3`, 0], [`${js(mx)}-2`, 1]] : [[`(${js(mx)}-${js(mn)}-14)/6`, 0], [`${js(mx)}-27/2-9/2*((${js(mx)}-${js(mn)}-14)/6)`, 1]], derived: [2, 3, 6, 9, 14, 27], rule: 'coef-1' } });
    }, { count: 2 }),
    T('maxmin-interior', '구간 안의 한 점에서 최댓값을 가질 때 함숫값 구하기', '①9', (d) => {
      // f(x) = −x³ + ax² + bx + k, f′(x) = −(3x − u)(x − p): x = p 에서 극대이자 구간 [0, m] 에서 최대
      const p = d.pick([2, 3]), u = d.int(1, 3 * p - 1), k = d.pick([-3, -2, -1, 1, 2, 3, 4, 5]), m = p + d.int(1, 2);
      if (u % 3 === 0) return null;
      const a = (u + 3 * p) / 2, b = -u * p, f = [k, b, a, -1], Mv = pval(f, p);
      if (!isIntV(Mv) || pval(f, 0) >= Mv || pval(f, m) >= Mv) return null;
      const r = d.pick([1, p + 1].filter((v) => v !== p && v <= m)), ans = pval(f, r);
      const A = `((2*${p}**3+${js(k)}-${js(Mv)})/${p}**2)`, Bx = `(3*${p}**2-2*${p}*${A})`;
      const body = nb(`${fx()} = ${MINUS}${X}${sup(3)} + ${V('a')}${X}${sup(2)} + ${V('b')}${X} ${sgnT(k)} ${Math.abs(k)}`);
      return qAns(`닫힌구간 ${closed(0, m)}에서 함수 ${jh(body, '이/가')} ${nb(`${X} = ${p}`)}에서 최댓값 ${qj(Mv, '을/를')} 가질 때, ${fx('f', r)}의 값은? ${nb(`(단, ${V('a')}, ${V('b')}는 상수)`)}`, ans, {
        signed: true,
        explain: `구간 안의 점 ${nb(`${X} = ${p}`)}에서 최대이면 그 점에서 극대이므로 ${nb(`${df('f')}(${p}) = 0`)}, ${nb(`${fx('f', p)} = ${qt(Mv)}`)}이다. 두 식을 풀면 ${nb(`${V('a')} = ${qt(a)}`)}, ${nb(`${V('b')} = ${qt(b)}`)}이므로 ${nb(`${fx('f', r)} = ${qt(ans)}`)}이다.`,
        facts: { value: `-(${r}**3)+${A}*${r}**2+${Bx}*${r}+${js(k)}`, derived: [2, 3] } });
    }),
    T('maxmin-rate', '순간변화율로 정한 양의 최솟값', '①11', (d) => {
      // 전하량 Q(t) = (a/3)t⁴ − 2a t² + c t + e, 전류 I(t) = Q′(t) = (4a/3)t³ − 4a t + c 는 t = 1 에서 최소
      const a = d.pick([1, 2, 3]), c = d.int(8, 16), e = d.int(2, 9), Qp = [e, c, -2 * a, 0, a / 3], I = pder(Qp), ans = pval(I, 1);
      return qAns(`어떤 전선의 한 단면을 시각 ${TT}초까지 지나간 전하량이 ${nb(`Q(${TT}) = `)}${ptext(Qp, TT)}이다. 전류의 세기 I는 전하량 ${nb(`Q(${TT})`)}의 시각 ${TT}에 대한 순간변화율이다. ${nb(`${TT} ≥ 0`)}에서 전류의 세기 I의 최솟값은?`, toQ(ans), {
        signed: true,
        explain: `${nb(`I(${TT}) = Q′(${TT}) = `)}${ptext(I, TT)}이고 ${nb(`I′(${TT}) = `)}${ptext(pder(I), TT)} = ${facText(4 * a, [-1, 1], TT)}이다. ${nb(`${TT} ≥ 0`)}에서 ${nb(`${TT} = 1`)}일 때 최소이고 최솟값은 ${qt(ans)}이다.`,
        facts: { value: `4*${a}/3-4*${a}+${c}`, derived: [3, 4] } });
    })
  ];

  // ════════════════════════════════════════════════════════════════
  // 최댓값·최솟값의 활용
  // ════════════════════════════════════════════════════════════════
  // 정삼각형 종이의 세 꼭짓점에서 합동인 사각형(꼭짓점, 두 변 위의 점, 안쪽의 점)을 잘라 낸 그림
  function triPaper(L) {
    const b = Board(), s = 170, h = s * Math.sqrt(3) / 2, A = [s / 2, 0], Bp = [0, h], Cp = [s, h], cut = 0.2;
    const V3 = [A, Bp, Cp], cen = [s / 2, h * 2 / 3];
    b.poly(V3, 'fill:rgba(251,191,36,0.18);stroke:none');
    V3.forEach((P, i) => {
      const P1 = V3[(i + 1) % 3], P2 = V3[(i + 2) % 3], D = [P[0] + (P1[0] - P[0]) * cut, P[1] + (P1[1] - P[1]) * cut], Fp = [P[0] + (P2[0] - P[0]) * cut, P[1] + (P2[1] - P[1]) * cut];
      const dir = [cen[0] - P[0], cen[1] - P[1]], len = Math.hypot(dir[0], dir[1]), ad = Math.hypot(D[0] - P[0], D[1] - P[1]) / Math.cos(Math.PI / 6), E = [P[0] + dir[0] / len * ad, P[1] + dir[1] / len * ad];
      b.poly([P, D, E, Fp], 'fill:#fff;stroke:none');
      b.seg(D, E, 'cut'); b.seg(E, Fp, 'cut');
      if (i === 0) { b.name(A, 'A', 90); b.name(D, 'D', 200); b.name(Fp, 'F', -20); b.name(E, 'E', 270, 13); }
    });
    b.poly(V3, 'fill:none');
    return b.svg(`정삼각형 모양의 종이. 한 변의 길이 ${L} cm. 세 꼭짓점에서 합동인 사각형을 잘라 낸다. 꼭짓점 A 쪽의 사각형은 ADEF이고 D, F는 두 변 위의 점, E는 안쪽의 점이다.`);
  }
  const apply = [
    T('apply-box', '정사각형 종이로 만든 뚜껑 없는 상자의 부피의 최댓값', '①12', (d) => {
      const k = d.int(2, 7), L = 6 * k, x0 = k, Vmax = x0 * (L - 2 * x0) ** 2;
      return N(`한 변의 길이가 ${L} cm인 정사각형 모양의 종이의 네 귀퉁이에서 크기가 같은 정사각형을 잘라 내고, 나머지 부분을 접어 뚜껑이 없는 직육면체 모양의 상자를 만들려고 한다. 만들 수 있는 상자의 부피의 최댓값은?`, Vmax, {
        unit: 'cm³',
        explain: `잘라 내는 정사각형의 한 변의 길이를 ${X} cm라 하면 ${nb(`0 &lt; ${X} &lt; ${L / 2}`)}이고 부피는 ${nb(`V(${X}) = ${X}(${L} ${MINUS} 2${X})${sup(2)}`)}이다. ${nb(`V′(${X}) = 12(${X} ${MINUS} ${x0})(${X} ${MINUS} ${L / 2})`)}이므로 ${nb(`${X} = ${x0}`)}에서 최대이고 최댓값은 ${nb(`${x0} × ${L - 2 * x0}${sup(2)} = ${Vmax}`)}이다.`,
        facts: { calc: [[`${L}/6*(${L}-2*${L}/6)**2`, 0]], derived: [2, 6] } });
    }),
    T('apply-tribox', '정삼각형 종이로 만든 삼각기둥 모양 상자의 부피의 최댓값', '①13', (d) => {
      // AD = AF = x, ∠ADE = ∠AFE = 90°: 상자의 높이 DE = x/√3, 밑면은 한 변이 L − 2x 인 정삼각형 → V = (1/4)x(L − 2x)², x = L/6 에서 최대
      const k = d.int(1, 3), L = 6 * k, x0 = k, Vmax = (x0 * (L - 2 * x0) ** 2) / 4;
      return qAns(`그림과 같이 한 변의 길이가 ${L} cm인 정삼각형 모양의 종이의 세 꼭짓점에서 사각형 ADEF와 합동인 사각형을 잘라 내고, 남은 부분을 접어 뚜껑이 없는 삼각기둥 모양의 상자를 만들려고 한다. ${nb('AD = AF')}, ${nb('∠ADE = ∠AFE = 90°')}일 때, 상자의 부피의 최댓값은?`, Vmax, {
        figure: triPaper(L), unit: 'cm³',
        explain: `${nb(`AD = ${X}`)} cm라 하면 ${nb('∠DAE = 30°')}이므로 상자의 높이는 ${nb(`DE = ${frac(X, sqrt3())}`)} cm, 밑면은 한 변의 길이가 ${nb(`(${L} ${MINUS} 2${X})`)} cm인 정삼각형이다. ${jh(nb(`V(${X}) = ${frac(sqrt3(), 4)}(${L} ${MINUS} 2${X})${sup(2)} × ${frac(X, sqrt3())} = ${frac(1, 4)}${X}(${L} ${MINUS} 2${X})${sup(2)}`), '은/는')} ${nb(`${X} = ${x0}`)}에서 최대이고 최댓값은 ${Vmax}이다.`,
        facts: { value: `${L}/6*(${L}-2*${L}/6)**2/4`, derived: [2, 4, 6] } });
    }),
    T('apply-rect', '변의 길이를 바꾼 직사각형의 넓이의 최댓값', '①14', (d) => {
      // (a + t)(b − t²): 도함수 b − 2at − 3t² 이 t = t0 에서 0
      const t0 = d.pick([1, 1, 2]), a = d.int(2, 6), b = 2 * a * t0 + 3 * t0 * t0, top = Math.floor(Math.sqrt(b) + 1e-9);
      if (top <= t0) return null;
      const ans = (a + t0) * (b - t0 * t0);
      return N(`가로의 길이가 ${a}, 세로의 길이가 ${b}인 직사각형이 있다. 가로의 길이를 ${TT}만큼 늘이고, 세로의 길이를 ${TT}${sup(2)}만큼 줄여 새로 만든 직사각형의 넓이의 최댓값은? ${nb(`(단, 0 &lt; ${TT} &lt; ${top})`)}`, ans, {
        explain: `넓이는 ${nb(`S(${TT}) = (${a} + ${TT})(${b} ${MINUS} ${TT}${sup(2)})`)}이고 ${nb(`S′(${TT}) = ${b} ${MINUS} ${2 * a}${TT} ${MINUS} 3${TT}${sup(2)} = ${MINUS}(3${TT} + ${b / t0})(${TT} ${MINUS} ${t0})`)}이다. ${nb(`${TT} = ${t0}`)}에서 최대이고 최댓값은 ${nb(`${a + t0} × ${b - t0 * t0} = ${ans}`)}이다.`,
        facts: { calc: [[`(${a}+${t0})*(${b}-${t0}**2)`, 0]], derived: [t0, 2] } });
    }),
    T('apply-trap', '포물선과 x축으로 둘러싸인 부분에 내접하는 사다리꼴의 넓이의 최댓값', '①15', (d) => {
      // y = −x² + s², A(−s, 0), B(s, 0), C(t, s² − t²), D(−t, s² − t²): 넓이 (t + s)(s² − t²) 는 t = s/3 에서 최대 32s³/27
      const s = d.int(2, 5), h = s * s, ans = 32 * s ** 3 / 27, t1 = s * 0.58, yc = h - t1 * t1;
      const figure = plot({ x: [-s - 0.9, s + 0.9], y: [-0.25 * h, h * 1.18], w: 240, ys: 150 / (h * 1.43 * (194 / (2 * s + 1.8))),
        fill: [{ f: (x) => (Math.abs(x) <= t1 ? yc : yc * (s - Math.abs(x)) / (s - t1)), from: -s, to: s, color: 'rgba(37,99,235,0.18)' }],
        curves: [{ f: (x) => h - x * x, name: `y=−x^2+${h}` }],
        segs: [{ p: [-s, 0], q: [-t1, yc] }, { p: [-t1, yc], q: [t1, yc] }, { p: [t1, yc], q: [s, 0] }],
        dots: [{ x: -s, y: 0, name: 'A', side: 'dl', said: `x좌표 ${MINUS}${s}, y좌표 0` }, { x: s, y: 0, name: 'B', side: 'dr', said: `x좌표 ${s}, y좌표 0` }, { x: t1, y: yc, name: 'C', side: 'ur', said: '곡선 위, 제1사분면' }, { x: -t1, y: yc, name: 'D', side: 'ul', said: '곡선 위, 제2사분면' }] });
      return qAns(`그림과 같이 곡선 ${jh(nb(`${V('y')} = ${MINUS}${X}${sup(2)} + ${h}`), '이/가')} x축과 만나는 두 점을 각각 A, B라 할 때, 선분 AB와 이 곡선으로 둘러싸인 부분에 내접하는 사다리꼴 ABCD의 넓이의 최댓값은? (단, 점 C는 제1사분면 위의 점이고, 변 CD는 x축에 평행하다.)`, toQ(ans), {
        figure,
        explain: `점 C의 x좌표를 ${TT}라 하면 ${nb(`0 &lt; ${TT} &lt; ${s}`)}이고 넓이는 ${nb(`S(${TT}) = ${frac(`${2 * s} + 2${TT}`, 2)} × (${h} ${MINUS} ${TT}${sup(2)}) = (${TT} + ${s})(${h} ${MINUS} ${TT}${sup(2)})`)}이다. ${nb(`S′(${TT}) = ${MINUS}(3${TT} ${MINUS} ${s})(${TT} + ${s})`)}이므로 ${nb(`${TT} = ${frac(s, 3)}`)}에서 최대이고 최댓값은 ${qt(ans)}이다.`,
        facts: { value: `(${s}/3+${s})*(${h}-(${s}/3)**2)`, derived: [s, 2, 3] } });
    }),
    T('apply-cuboid', '모서리 길이의 합이 일정한 직육면체의 부피의 최댓값', '①16', (d) => {
      const k = d.int(3, 9), S = 3 * k, ans = k ** 3;
      return N(`밑면이 정사각형인 직육면체의 밑면의 가로의 길이, 세로의 길이, 높이의 합이 ${S}일 때, 이 직육면체의 부피의 최댓값은?`, ans, {
        explain: `밑면의 한 변의 길이를 ${X}라 하면 높이는 ${nb(`${S} ${MINUS} 2${X}`)}이고 ${nb(`0 &lt; ${X} &lt; ${qt(S / 2)}`)}이다. ${nb(`V(${X}) = ${X}${sup(2)}(${S} ${MINUS} 2${X})`)}, ${nb(`V′(${X}) = ${MINUS}6${X}(${X} ${MINUS} ${k})`)}이므로 ${nb(`${X} = ${k}`)}에서 최대이고 최댓값은 ${nb(`${k}${sup(2)} × ${S - 2 * k} = ${ans}`)}이다.`,
        facts: { calc: [[`(${S}/3)**2*(${S}-2*${S}/3)`, 0]], derived: [2, 3] } });
    }),
    T('apply-cone', '원뿔에 내접하는 원기둥의 부피의 최댓값', '①17', (d) => {
      // 원뿔의 반지름 3a, 높이 3b → 원기둥의 반지름 2a, 높이 b 에서 최대 4πa²b
      const a = d.int(1, 4), b = d.int(1, 5), R = 3 * a, Hh = 3 * b, ans = 4 * a * a * b;
      if (R === Hh) return null;
      return N(`밑면의 반지름의 길이가 ${R}, 높이가 ${Hh}인 원뿔에 원기둥이 내접한다. 원기둥의 한 밑면은 원뿔의 밑면 위에 있고, 다른 밑면의 둘레는 원뿔의 옆면 위에 있다. 원기둥의 부피의 최댓값이 ${nb(`${V('k')}π`)}일 때, 상수 ${V('k')}의 값은?`, ans, {
        explain: `원기둥의 반지름을 ${jh(V('r'), '이라/라')} 하면 닮음에서 높이는 ${nb(`${Hh} ${MINUS} ${frac(Hh, R)}${V('r')}`)}이고 ${nb(`0 &lt; ${V('r')} &lt; ${R}`)}이다. ${jh(nb(`V(${V('r')}) = π${V('r')}${sup(2)}(${Hh} ${MINUS} ${frac(Hh, R)}${V('r')})`), '은/는')} ${nb(`V′(${V('r')}) = 0`)}인 ${nb(`${V('r')} = ${2 * a}`)}에서 최대이고 최댓값은 ${nb(`π × ${2 * a}${sup(2)} × ${b} = ${ans}π`)}이다.`,
        facts: { calc: [[`(2*${R}/3)**2*(${Hh}/3)`, 0]], derived: [2, 3] } });
    })
  ];
  function sqrt3() { return B.kit.mid.rt('3'); }

  B.addUnit({ id: '11-2-5', grade: 11, semester: 2, no: 5, title: '도함수의 활용(2)', version: 1, groups: [
    { id: 'shape', title: '함수의 그래프의 개형', standard: S8, types: shape },
    { id: 'maxmin', title: '함수의 최댓값과 최솟값', standard: S8, types: maxmin },
    { id: 'apply', title: '최댓값·최솟값의 활용', standard: S8, types: apply },
    { id: 'roots', title: '방정식의 실근의 개수', standard: S9, types: [] },
    { id: 'ineq', title: '부등식이 늘 성립할 조건', standard: S9, types: [] },
    { id: 'motion', title: '속도와 가속도', standard: S10, types: [] }
  ] });
})(typeof window !== 'undefined' ? window : globalThis);
