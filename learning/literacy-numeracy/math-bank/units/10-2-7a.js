// 고등학교 1학년 2학기(공통수학2) Ⅲ-2 유리함수와 무리함수 — 단원 틀·도구와 앞쪽 묶음(유리식과 유리함수, 유리함수의 그래프, 유리함수의 그래프의 성질과 활용).
// 수집해 둔 천재 T셀파 공통수학2 두 종(홍진곤, 전인태 — 2022 개정)의 교과서·평가 자료에서 뽑은 문제 꼴 목록
// (기본꼴_1: 42꼴, 기본꼴_2: 39꼴, 심화꼴: 6꼴)을 꼴마다 따져서 실었다. 꼴마다 「실음(유형 이름) / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는
// references/textbooks/수학/_분석/10-2-7/싣기_대조표.md 에 있다.
// (무리식과 무리함수, 무리함수의 그래프, 무리함수의 그래프의 성질과 활용은 10-2-7b.js 에, 실력 문항은 10-2-7c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
// 성취기준은 10공수2-03-04(유리함수의 그래프를 그릴 수 있고, 그 그래프의 성질을 탐구할 수 있다)와 10공수2-03-05(무리함수의 그래프를 그릴 수 있고, 그 그래프의 성질을 탐구할 수 있다).
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(식·그림·조건·상황), 묻는 것(점근선·정의역과 치역·계수·옮긴 양·함숫값·고르기), 식의 꼴(분모의 x의 계수가 1인가,
//    분모가 p − x 인가, 근호 앞의 부호, 근호 안 x의 계수의 부호)이 다르면 따로 싣는다. 수만 바꾼 유형은 만들지 않는다.
//  - 교육과정: 유리함수는 y = (ax + b)/(cx + d), 무리함수는 y = √(ax + b) + c 를 중심으로 다룬다. 사용자가 정한 대로 「간단한 문제만 다룬다」를 까닭으로
//    수집본의 꼴을 빼지 않고, 꼬여 있거나 경우를 따져야 하는 꼴은 실력에 싣는다. 미분으로 그리는 그래프는 수집본에 없다(접할 조건은 모두 판별식으로 푼다).
//  - 답: 점근선은 「x = [±][ ], y = [±][ ]」, 정의역·치역은 집합 기호 안에 끼워 넣는 칸(무리함수는 부등호를 고르는 칸까지), 계수·옮긴 양·함숫값은
//    부호 단추가 붙은 수 칸(분수 답은 분자·분모 칸), 근호가 든 값은 radAns, 일차식은 linAns 로 받는다. 계산한 유리식·무리식처럼 약분 여부와
//    항의 꼴이 답마다 달라 칸의 모양이 답을 흘리는 것은 고르기로 낸다. 길이·넓이·개수·도수(D)만 단추 없이 받는다.
//    원문의 「a + b + c의 값」「abc의 값」「M + m의 값」처럼 따로 구한 값을 뜻 없이 더하거나 곱한 꼴은 값을 칸마다 따로 받는다.
//  - 그림: 공용 plane 의 좌표평면(모눈·눈금 수) 위에, 평행이동한 유리함수의 곡선·점근선(점선)과 무리함수의 곡선을 이 파일의 rfig 가 덧그린다
//    (좌표 셈은 plane 과 같다). 그림 설명(aria-label)에는 점선의 자리와 곡선이 지나는 모눈 점을 적는다.
//  - 답은 모두 코드가 셈한다. 원문 답지의 잘못(무리함수의 역함수 x² − 2x + 3, 무리식 값에 x = √2를 넣는 문항)은 따르지 않는다.
//  - 검사 근거: 수 칸은 문제에 적힌 수로 다시 셈하는 식(facts.calc·value)이고, 글에 없는 수(0, 1, 2, 4 …)는 seal 이 facts.unseen 에 밝힌다.
//    고르기의 참·거짓은 손으로 적지 않고 함수의 값을 여러 점에서 견주어 코드로 가린다. 제곱근을 거쳐야 나오는 칸은 엔진 검사가 셈할 수 없어
//    facts.check 에 셈의 바탕을 적어 두고 따로 지은 풀이로 맞춰 보았다.
//
// 뺀 것과 까닭(10-2-7b.js, 10-2-7c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 중학교 단원에 이미 있는 일: ①13(y = k/x 의 그래프 넷을 식과 짝 짓기 — 중1 7-1-6 igraph-pick-graph), ①14(y = 6/x 가 지나는 점 — 7-1-6 igraph-point-on).
//  - 앞 단원(10-2-6 함수)의 일: ②31(f(x) = 2x² − 1, g(x) = √(x + 2) + 1 의 합성함수의 값 — 무리함수는 값을 넣을 뿐이다).
//    대단원 문서의 함수의 뜻·합성함수·역함수만 묻는 문항과 일차·이차함수의 역함수(전대18, 전교 대12, 심10)는 꼴 목록에도 세지 않았다.
//  - 그리기만 묻는 것(작도): 「그래프를 그리시오」만 있는 문항(①13·①16·①17·②10·②12의 그리기 부분) — 함께 묻는 점근선·정의역·치역은 실었다.
//  - 겹침(같은 일): ①21 홍대9의 보기 ④(x축과 만나는 점 — 「점을 지난다」 보기와 같은 일), ②2 홍기2의 근호 안이 이차식인 것(합·차의 곱 → 근호 안끼리 빼기 — iexpr-conj),
//    ②12 홍중4(정의역·치역의 경계를 곱한 ab — 경계를 칸마다 받는 igraph-dr), ②22 전교 실생활(y = √(ax) + b, a = 9/4 — 시작점과 한 점으로 계수를 정하는 iuse-fig-coef),
//    ②28 전소2 심화2(교점 (3, 3)이 직선 y = x 위라 f(3) = 3 하나만 넣는다 — ②14), 심5(②14와 같은 일 — igraph-shift-point 의 첫째 꼴로 실음).
//    심1(①26과 같은 일)·심4(②29의 한 걸음)는 묻는 것이 함숫값·역함수의 값이라 ruse-asym-value·iuse-inv-value 로 따로 실었다.
//    ②6 전대14 원문은 x = √2를 넣으면 근호 안이 음수라 넣는 수만 2 이상으로 고쳐 실었다(뺀 것이 아니다).
//  - 서술형만으로 묻는 부분: 전교 공학 도구 활동의 「설명해 보자」, 수행 과제의 시나리오 쓰기.
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, N, M, C, F, inline } = B.kit;
  const { LAB, MINUS, gcd, Q, qadd, qsub, qmul, qdiv, qneg, qabs, qcmp, isInt, fl, mag, tx, nb, tail, lastOf, tj, js, V, sup, tag, ex, nz, pm, asQ, mono, poly, plane, f1, claimQ, grp, rt } = B.kit.mid;
  const S4 = '10공수2-03-04', S5 = '10공수2-03-05';

  // ── 검사 근거 마무리 ──
  // 문항에서 보이는 수(검사와 같은 방법으로 읽는다): 글·그림(그림 설명 포함)·보기
  const stripH = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  function visibleNumbers(item) {
    const seen = stripH([item.text, item.figure || ''].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, ' $1 ').replace(/<table[^>]*aria-label="([^"]*)"[^>]*>/g, ' $1 | '));
    return new Set((seen.match(/\d+/g) || []).concat(seen.match(/\d+\.\d+/g) || [], seen.replace(/(\d) (?=\d)/g, '$1').match(/\d+/g) || []));
  }
  // 다시 셈하는 식의 수 가운데 글에 보이지 않는 수를 facts.unseen 에 밝힌다. 0과 1과 o.derived 로 밝히기로 한 수만 된다.
  function seal(item) {
    // 셈이 0으로 끝나는 식은 −0이 될 수 있다(0 ÷ 음수). 검사는 −0과 0을 가르므로 +0 을 붙여 0으로 맞춘다(붙인 0은 아래에서 unseen 에 들어간다).
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
  const retry = (make) => (d, n) => { for (let i = 0; i < 3000; i += 1) { const item = make(d, n); if (item) return seal(item); } throw new Error('조건에 맞는 문항을 만들지 못했다'); };
  const sourceOf = (ref) => '수집본 ' + (/[①②]/.test(ref) ? (/심/.test(ref) ? '기본·심화' : '기본') : '심화') + ' 자료(' + ref + ')';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: sourceOf(ref), make: retry(make) }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: sourceOf(ref), make: retry(make) }, more || {});

  // 토씨: 검사(tests/math-bank-units.test.cjs 의 tight)와 같은 방법으로 글을 읽어 끝소리로 고른다.
  //  분수는 분자만 읽고, 거듭제곱(위첨자)은 「제곱」, 근호는 안의 글, 문자 m·n·l 은 받침이 있고 나머지 문자는 없다, 숫자는 읽는 소리.
  const spanEnd = (h, from) => { const re = /<span\b[^>]*>|<\/span>/g; re.lastIndex = from; let depth = 0, m; while ((m = re.exec(h))) { if (m[0][1] === '/') { depth -= 1; if (depth === 0) return m.index + m[0].length; } else depth += 1; } return -1; };
  function cutSpans(h, start, word, keepStart) { let out = h, at; while ((at = out.indexOf(start)) >= 0) { const end = spanEnd(out, keepStart ? at + start.length : at); if (end < 0) break; out = out.slice(0, at) + word + out.slice(end); } return out; }
  const sayOf = (h) => cutSpans(String(h || ''), '<span class="mb-frac-bar">/</span>', '', true).replace(/<svg\b[^>]*class="mb-inline"[\s\S]*?<\/svg>/g, '').replace(/<svg[\s\S]*?<\/svg>/g, ' ')
    .replace(/<sup\b[^>]*>[\s\S]*?<\/sup>/g, '제곱').replace(/<[^>]+>/g, '').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  function jw(h, pair) {
    const [withB, without] = pair.split('/');
    const flat = sayOf(h).replace(/[\s)\]}]+$/, ''), last = flat.slice(-1);
    if (/\d/.test(last)) return h + tail(Number(/\d+$/.exec(flat)[0]), pair);
    let bat, rieul = false;
    if (/[A-Za-z]/.test(last)) { bat = /[LMNlmn]/.test(last); rieul = /[Ll]/.test(last); } else if (/[ㄱ-ㅎ㉠-㉭]/.test(last)) { bat = true; rieul = /[ㄹ㉣]/.test(last); } else {   // ㉠(기역)·ㄱ(기역)은 받침으로 끝난다
    const code = last.charCodeAt(0) - 0xAC00, t = code >= 0 && code <= 11171 ? code % 28 : 0; bat = t !== 0; rieul = t === 8; }
    if (withB === '으로') return h + (bat && !rieul ? '으로' : '로');
    return h + (bat ? withB : without);
  }
  const lj = (letter, pair) => pair.split('/')[/[mnl]/.test(letter) ? 0 : 1];   // 문자 뒤 토씨(a는, m은)

  // ── 글 ──
  const X = V('x'), Y = V('y'), Av = V('a'), Bv = V('b'), Cv = V('c'), Dv = V('d'), Kv = V('k'), Mv = V('m'), Nv = V('n'), Pv = V('p'), Qv = V('q'), Tv = V('t');
  const X2 = X + sup(2), Y2 = Y + sup(2);
  const num = (v) => (typeof v === 'number' ? v : fl(v));
  const iq = (n) => tx(asQ(n));                                             // 화면에 적는 수(음수는 −, 분수는 분수 꼴)
  const jn = (n) => js(asQ(n));                                             // 검사 식에 적는 수((-3), (3/4))
  const sgnT = (n) => { const q = asQ(n); return `${q.p < 0 ? MINUS : '+'} ${mag(q)}`; };   // 「+ 3」「− 3」
  const sTxt = (v) => (v < 0 ? MINUS + Math.abs(v) : String(v));          // 그림 설명에 적는 정수
  const L = (a, b, v) => poly([[a, v || X], [b, '']]);                      // ax + b
  const term = (c, v) => poly([[c, v || X]]);                                // 부호까지 적는 한 항(−x, 3x)
  const den = (p) => L(1, -p);                                               // x − p (p 는 정수)
  // 일차식의 곱 (x − a)(x − b)…: 근 0 은 x, 같은 근이 둘이면 제곱, 하나뿐이면 괄호 없이
  const facText = (rs) => {
    if (rs.length === 1) return den(rs[0]);
    const seen = [];
    for (const r of rs) { const s = seen.find((u) => u.r === r); if (s) s.n += 1; else seen.push({ r, n: 1 }); }
    return seen.map(({ r, n }) => (r === 0 ? X : `(${den(r)})`) + (n > 1 ? sup(n) : '')).join('');
  };
  const is = (l, r) => nb(`${l} = ${typeof r === 'string' ? r : iq(r)}`);
  const pt = (x, y) => nb(`(${typeof x === 'string' ? x : iq(x)}, ${typeof y === 'string' ? y : iq(y)})`);
  const yIs = (r) => nb(`${Y} = ${r}`);
  // 평행이동한 양의 말(0인 쪽은 적지 않는다)
  const shiftWords = (p, q) => [p ? `${X}축의 방향으로 ${iq(p)}만큼` : '', q ? `${Y}축의 방향으로 ${iq(q)}만큼` : ''].filter(Boolean).join(', ');
  const fIs = (r, name) => nb(`${V(name || 'f')}(${X}) = ${r}`);
  const setX = (cond) => nb(`{${X} | ${cond}}`), setY = (cond) => nb(`{${Y} | ${cond}}`);
  const notX = (v) => setX(`${X} ≠ ${iq(v)}인 실수`), notY = (v) => setY(`${Y} ≠ ${iq(v)}인 실수`), allX = setX(`${jw(X, '은/는')} 실수`);
  const QN = ['제1사분면', '제2사분면', '제3사분면', '제4사분면'];


  // ── 다항식(오름차순 계수의 배열: [상수항, x의 계수, x²의 계수, …]) ──
  const pz = (a) => { const out = a.slice(); while (out.length > 1 && out[out.length - 1] === 0) out.pop(); return out; };
  const padd = (a, b) => pz(Array.from({ length: Math.max(a.length, b.length) }, (_, i) => (a[i] || 0) + (b[i] || 0)));
  const pscale = (a, k) => pz(a.map((c) => c * k));
  const psub = (a, b) => padd(a, pscale(b, -1));
  const pmul = (a, b) => { const out = Array(a.length + b.length - 1).fill(0); a.forEach((x, i) => b.forEach((y, j) => { out[i + j] += x * y; })); return pz(out); };
  const pval = (a, x) => a.reduce((s, c, i) => s + c * x ** i, 0);
  const lin1 = (r) => [-r, 1];                                               // x − r
  const fromRoots = (rs, lead) => rs.reduce((acc, r) => pmul(acc, lin1(r)), [lead == null ? 1 : lead]);
  const ptext = (a, v) => poly(a.map((c, i) => [c, i === 0 ? '' : (v || X) + (i > 1 ? sup(i) : '')]).reverse());
  // 분수식 { n, d }(다항식 둘): 화면 글과 값
  const rh = (n, d) => (d.length === 1 && d[0] === 1 ? ptext(n) : frac(ptext(n), ptext(d)));
  const rf = (n, d) => (x) => pval(n, x) / pval(d, x);
  const ro = (n, d) => ({ h: rh(n, d), f: rf(n, d) });

  // ── 고르기: 함수로 견주어 참·거짓을 가린다 ──
  const PTS = [[-3.71], [-1.37], [0.53], [1.29], [2.61], [4.43], [6.17], [9.31]];
  function sameFn(f, g, pts) {
    return (pts || PTS).every((args) => {
      const a = f(...args), b = g(...args);
      if (!Number.isFinite(a) || !Number.isFinite(b)) return !Number.isFinite(a) && !Number.isFinite(b);
      return Math.abs(a - b) < 1e-7 * Math.max(1, Math.abs(a));
    });
  }
  // right = { h, f }, wrongs = [{ h, f }, …]: 값이 다른 보기만 남겨 size 개를 고른다(모자라면 null — 다시 만든다).
  function pickFn(d, text, o, right, wrongs, size) {
    const want = size || 5, keep = [right];
    for (const w of d.shuffle(wrongs)) if (keep.length < want && keep.every((k) => !sameFn(k.f, w.f, o.pts) && stripH(k.h) !== stripH(w.h))) keep.push(w);
    if (keep.length < want) return null;
    const rows = d.shuffle(keep);
    return C(text, rows.map((r) => r.h), rows.indexOf(right), { figure: o.figure, explain: o.explain, facts: Object.assign({ truth: rows.map((r) => r === right), want: true }, o.facts || {}) });
  }
  // 넷 가운데 조건에 맞는 둘을 「모두 고른 것」으로 묻는다. flags 는 참이 꼭 둘이어야 한다.
  function pairPick(d, text, list, flags, explain) {
    const yes = [0, 1, 2, 3].filter((i) => flags[i]), no = [0, 1, 2, 3].filter((i) => !flags[i]), [p, q] = d.shuffle(no);
    const pairs = d.shuffle([yes, no, [yes[0], p], [yes[1], q]].map((pair) => pair.slice().sort((u, v) => u - v))), right = (pair) => pair.every((i) => flags[i]);
    return C(text, pairs.map((pair) => pair.map((i) => LAB[i]).join(', ')), pairs.findIndex(right), { figure: lines(list.map((h, i) => tag(LAB[i]) + h)), explain, facts: { truth: pairs.map(right), want: true } });
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

  // ── 답 ──
  // 점근선 「x = [±][ ], y = [±][ ]」
  const asymAns = (text, p, q, o) => inline(text, `${grp(`${X} = {0}`)}, ${grp(`${Y} = {1}`)}`, [{ answer: p, signed: true }, { answer: q, signed: true }], Object.assign({}, o, { shown: `${is(X, p)}, ${is(Y, q)}` }));
  // 유리함수의 정의역과 치역 「{x | x ≠ [±][ ]인 실수}, {y | y ≠ [±][ ]인 실수}」
  const drRat = (text, p, q, o) => inline(text, `정의역: ${setX(`${X} ≠ {0}인 실수`)}<br>치역: ${setY(`${Y} ≠ {1}인 실수`)}`, [{ answer: p, signed: true }, { answer: q, signed: true }], Object.assign({}, o, { shown: `정의역: ${notX(p)}, 치역: ${notY(q)}` }));
  // 문자의 값 여럿: 「a = [±][ ]  b = [±][ ]」(셋째 원소가 참이면 부호 단추 없이)
  const vals = (text, pairs, o) => M(text, pairs.map(([lead, answer, bare]) => ({ lead: lead + ' =', answer, signed: !bare })), Object.assign({}, o, { shown: pairs.map(([lead, answer]) => is(lead, answer)).join(', ') }));
  // 수 하나(정수는 부호 단추가 붙은 칸, 분수는 분자·분모 칸에 부호 단추). 한 유형에서는 늘 같은 꼴(정수만 또는 분수만)이 되게 수를 고른다.
  const numAns = (text, v, o) => { const q = asQ(v); return q.q === 1 ? N(text, q.p, Object.assign({ signed: true }, o)) : F(text, Math.abs(q.p), q.q, Object.assign({ improper: Math.abs(q.p) > q.q, anyForm: true, signed: true, negative: q.p < 0 }, o)); };

  // ── 유리함수 ──
  // y = k/(x − p) + q 의 오른쪽. k ≠ 0 인 정수, p·q 는 정수(0이면 적지 않는다).
  const stdR = (k, p, q) => (k < 0 ? MINUS : '') + frac(Math.abs(k), p === 0 ? X : den(p)) + (q === 0 ? '' : ' ' + sgnT(q));
  // (ax + b)/(cx + d)
  const genR = (a, b, c, d) => frac(L(a, b), L(c, d));
  // y = k/(x − p) + q 를 (qx + (k − qp))/(x − p)로
  const hypGen = (k, p, q) => genR(q, k - q * p, 1, -p);
  const hval = (k, p, q) => (x) => q + k / (x - p);
  // 표준형으로 바꾸는 줄: (ax + b)/(x − p) = (a(x − p) + k)/(x − p) = k/(x − p) + a
  const toStd = (k, p, q) => `${hypGen(k, p, q)} = ${frac(`${q === 1 ? '' : q === -1 ? MINUS : iq(q)}(${den(p)}) ${sgnT(k)}`, den(p))} = ${stdR(k, p, q)}`;
  // y = q + k/(x − p) 의 그래프가 지나는 사분면 [제1, 제2, 제3, 제4](축 위의 점은 세지 않는다).
  // 가지(x < p, x > p)마다 y축의 왼쪽·오른쪽으로 나눈 구간에서 함수는 한쪽으로만 변하므로 구간 끝의 값(극한)으로 y의 범위를 안다.
  function quadsHyp(k, p, q) {
    const f = (x) => q + k / (x - p), out = [false, false, false, false];
    const lim = (x, side) => (x === p ? (side * k > 0 ? Infinity : -Infinity) : Math.abs(x) === Infinity ? q : f(x));
    for (const [lo, hi] of [[-Infinity, p], [p, Infinity]]) for (const [hlo, hhi, right] of [[0, Infinity, true], [-Infinity, 0, false]]) {
      const a = Math.max(lo, hlo), b = Math.min(hi, hhi);
      if (!(a < b)) continue;
      const va = lim(a, 1), vb = lim(b, -1), sup2 = Math.max(va, vb), inf = Math.min(va, vb);
      if (sup2 > 0) out[right ? 0 : 1] = true;
      if (inf < 0) out[right ? 3 : 2] = true;
    }
    return out;
  }
  // y = q + s√(a(x − p)) 의 그래프가 지나는 사분면(시작점에서 한쪽으로만 뻗는다).
  function quadsRoot(a, p, q, s) {
    const out = [false, false, false, false], dir = a > 0 ? 1 : -1, A = Math.abs(a);
    // w > 0 에서 x = p + dir·w, y = q + s√(A w). 사분면마다 조건을 만족하는 w 가 있는가: x 의 부호와 y 의 부호가 각각 w 의 구간이다.
    const xpos = (w) => p + dir * w > 0, ypos = (w) => q + s * Math.sqrt(A * w) > 0, xneg = (w) => p + dir * w < 0, yneg = (w) => q + s * Math.sqrt(A * w) < 0;
    const ws = [1e-9, 1e9]; for (const c of [Math.abs(p), q * q / A]) ws.push(c * 0.999999, c * 1.000001, c / 2, c * 2 + 1e-6);
    for (let i = -6; i <= 8; i += 1) ws.push(10 ** i);
    for (const w of ws) if (w > 0) {
      if (xpos(w) && ypos(w)) out[0] = true;
      if (xneg(w) && ypos(w)) out[1] = true;
      if (xneg(w) && yneg(w)) out[2] = true;
      if (xpos(w) && yneg(w)) out[3] = true;
    }
    return out;
  }
  const quadText = (list) => (list.length === 1 ? QN[list[0]] : '제' + list.map((i) => i + 1).join(', ') + '사분면');

  // ── 그림 ──
  // rfig(o): 공용 plane 의 좌표평면에 곡선을 덧그린다(plane 과 같은 좌표 셈: 한 칸 u = min(24, 260/(가로 칸 수)), 왼쪽 여백 16, 위쪽 여백 24).
  //  o.x, o.y [작은 끝, 큰 끝], o.hyps [{ k, p, q, name }] 유리함수 y = k/(x − p) + q(두 점근선을 점선으로), o.roots [{ a, p, q, s, name }] 무리함수 y = s√(a(x − p)) + q,
  //  o.points(plane 의 점), o.ticks, o.grid, o.lines(plane 의 직선), o.say(설명 앞머리), o.lattice: false 이면 곡선이 지나는 모눈 점을 설명에 적지 않는다.
  // 곡선과 점선은 원점의 이름 O 다음(눈금 수·점보다 아래)에 넣는다.
  const INK = ['#1d4ed8', '#b42318', '#15803d', '#7c3aed'], DASH = 'stroke:#5b6770;stroke-width:1.1;stroke-dasharray:4 3';
  const HALO = 'paint-order:stroke;stroke:#fff;stroke-width:3px;stroke-linejoin:round';
  function rfig(o) {
    const [xlo, xhi] = o.x, [ylo, yhi] = o.y, u = Math.min(24, 260 / (xhi - xlo)), padL = 16, padT = 24;
    const PX = (v) => f1(padL + (v - xlo) * u), PY = (v) => f1(padT + (yhi - v) * u);
    const path = (pts, color) => `<path d="M${pts.map(([x, y]) => PX(x) + ' ' + PY(y)).join('L')}" style="fill:none;stroke:${color};stroke-width:1.9;stroke-linejoin:round;stroke-linecap:round"/>`;
    const label = (x, y, t, color, anchor) => `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${anchor || 'middle'}" style="font-size:12.5px;font-weight:700;fill:${color};${HALO}">${t}</text>`;
    let over = '';
    const say = o.say ? [o.say] : [], k0 = 0;
    (o.hyps || []).forEach((h, idx) => {
      const { k, p, q } = h, color = INK[(idx + k0) % INK.length];
      if (p > xlo && p < xhi) over += `<line x1="${PX(p)}" y1="${PY(ylo)}" x2="${PX(p)}" y2="${PY(yhi)}" style="${DASH}"/>`;
      if (q > ylo && q < yhi) over += `<line x1="${PX(xlo)}" y1="${PY(q)}" x2="${PX(xhi)}" y2="${PY(q)}" style="${DASH}"/>`;
      const ends = [];
      for (const side of [1, -1]) {
        const tmaxX = side > 0 ? xhi - p : p - xlo, ks = k * side, room = ks > 0 ? yhi - q : q - ylo;
        if (tmaxX <= 0 || room <= 0) continue;
        const tmin = Math.abs(k) / room; if (tmin >= tmaxX) continue;
        const pts = [];
        for (let i = 0; i <= 96; i += 1) { const t = tmin * Math.pow(tmaxX / tmin, i / 96); pts.push([p + side * t, q + ks / t]); }
        over += path(pts, color); ends.push(pts[pts.length - 1]);
      }
      if (h.name && ends.length) { const [ex0, ey0] = ends[0]; over += label(Number(PX(ex0)) - 4, Number(PY(ey0)) + (ey0 > q ? -6 : 14), h.name, color, 'end'); }
      const lat = [];
      if (o.lattice !== false) for (let x = Math.ceil(xlo); x <= xhi; x += 1) { if (x === p) continue; const y = q + k / (x - p); if (Number.isInteger(y) && y >= ylo && y <= yhi) lat.push(`(${sTxt(x)}, ${sTxt(y)})`); }
      say.push(`점선: 직선 x = ${jw(sTxt(p), '과/와')} 직선 y = ${sTxt(q)}.${h.name ? ' 곡선 ' + h.name : ' 곡선'}: 두 점선에 한없이 가까워지는 한 쌍의 매끄러운 곡선이다.` + (lat.length ? ` 지나는 모눈 점은 ${lat.slice(0, 6).join(', ')}이다.` : ''));
    });
    (o.roots || []).forEach((r, idx) => {
      const { a, p, q, s } = r, color = INK[(idx + (o.hyps || []).length) % INK.length], dir = a > 0 ? 1 : -1, A = Math.abs(a);
      const wx = dir > 0 ? xhi - p : p - xlo, wy = s > 0 ? yhi - q : q - ylo;
      if (wx > 0 && wy > 0) {
        const vmax = Math.min(Math.sqrt(wx), wy / Math.sqrt(A)), pts = [];
        for (let i = 0; i <= 80; i += 1) { const v = vmax * i / 80; pts.push([p + dir * v * v, q + s * Math.sqrt(A) * v]); }
        over += path(pts, color);
        if (r.name) { const [ex0, ey0] = pts[pts.length - 1]; over += label(Number(PX(ex0)) + (dir > 0 ? -2 : 2), Number(PY(ey0)) + (s > 0 ? 14 : -6), r.name, color, dir > 0 ? 'end' : 'start'); }
      }
      const lat = [];
      if (o.lattice !== false) for (let x = Math.ceil(xlo); x <= xhi; x += 1) { const w = a * (x - p); if (w < 0) continue; const sq = Math.round(Math.sqrt(w)); if (sq * sq !== w) continue; const y = q + s * sq; if (y >= ylo && y <= yhi) lat.push(`(${sTxt(x)}, ${sTxt(y)})`); }
      const where = `${dir > 0 ? '오른쪽' : '왼쪽'} ${s > 0 ? '위' : '아래'}`;
      say.push(`곡선${r.name ? ' ' + r.name : ''}: ${r.hideStart ? '한 점' : `점 (${sTxt(p)}, ${sTxt(q)})`}에서 시작하여 ${jw(where, '으로/로')} 뻗는 매끄러운 곡선이다.` + (lat.length ? ` 지나는 모눈 점은 ${lat.slice(0, 6).join(', ')}이다.` : ''));
    });
    // 곡선·점선이 눈금 수를 지나가도 읽히도록 눈금 수에 흰 테를 두른다(겹쳐 그린 선은 눈금 수보다 먼저 그린다).
    const base = plane({ x: o.x, y: o.y, points: o.points, ticks: o.ticks, grid: o.grid, lines: o.lines, say: say.join(' ') }).replace(/class="mb-axis-label" style="font-size:10.5px"/g, `class="mb-axis-label" style="font-size:10.5px;${HALO}"`);
    const at = base.indexOf('>O</text>');
    return at >= 0 ? base.slice(0, at + 9) + over + base.slice(at + 9) : base.replace('</svg>', over + '</svg>');
  }
  // 그림의 범위: 들어가야 할 값(0을 넣는다)에 여유를 두어 정수로 잡는다.
  const span = (vs, pad) => { const list = vs.concat([0]), m = pad == null ? 2 : pad; return [Math.floor(Math.min(...list) - m), Math.ceil(Math.max(...list) + m)]; };

  // ── 수 고르기 ──
  const pick2 = (d, list) => { const a = d.shuffle(list); return [a[0], a[1]]; };
  const divisorsOf = (n) => { const out = []; for (let i = 1; i <= Math.abs(n); i += 1) if (n % i === 0) out.push(i, -i); return out; };

  B.kit.m1027 = {
    S4, S5, seal, retry, T, H, stripH, X, Y, X2, Y2, Av, Bv, Cv, Dv, Kv, Mv, Nv, Pv, Qv, Tv, num, iq, jn, sgnT, sTxt, L, term, den, facText, shiftWords, par0, is, pt, yIs, fIs, setX, setY, notX, notY, allX, QN,
    sayOf, jw, lj, pz, padd, pscale, psub, pmul, pval, lin1, fromRoots, ptext, rh, rf, ro, PTS, sameFn, pickFn, pairPick, GA, comboPick,
    asymAns, drRat, vals, numAns, stdR, genR, hypGen, hval, toStd, quadsHyp, quadsRoot, quadText, rfig, span, pick2, divisorsOf, HALO, INK
  };

  // ════════════════════════════════════════════════════════════════
  // 유리식과 유리함수
  // ════════════════════════════════════════════════════════════════
  const rexpr = [
    T('rexpr-pick', '다항식이 아닌 유리식(다항함수가 아닌 유리함수) 고르기', '①1', (d, n) => {
      // 분모에 문자가 있는 식만 다항식이 아니다. (x − 3)/3 처럼 분모가 상수인 식, x(4x − 3) 처럼 곱으로 적은 식은 다항식이다.
      const a = d.int(2, 9), b = nz(d, -6, 6), c = d.int(2, 5), e = d.int(2, 7), g = d.int(3, 9), f = d.until(() => d.int(1, g - 1), (v) => gcd(v, g) === 1), h = nz(d, -5, 5);
      const no = [frac(a, L(1, b)), `${frac(1, c)} ${MINUS} ${frac(a, X)}`, frac(L(e, h), X), frac(X, L(1, b)), `${X} ${sgnT(h)} + ${frac(c, X)}`];
      const yes = [frac(L(1, -e), c), `${mono(e, X)} ${MINUS} ${frac(f, g)}`, frac(poly([[1, X2], [h, '']]), c), `${X}(${L(e, -c)})`];
      const pickNo = d.shuffle(no).slice(0, 2), pickYes = d.shuffle(yes).slice(0, 2), rows = d.shuffle(pickNo.map((s) => [s, true]).concat(pickYes.map((s) => [s, false])));
      const list = rows.map(([s]) => (n === 0 ? s : yIs(s)));
      const hit = rows.map(([, flag], i) => (flag ? LAB[i] : '')).filter(Boolean).join(', ');
      return pairPick(d, n === 0 ? '다음 식 가운데 다항식이 아닌 유리식을 모두 고른 것은?' : '다음 함수 가운데 다항함수가 아닌 유리함수를 모두 고른 것은?', list, rows.map(([, flag]) => flag),
        `분모에 문자 ${jw(X, '이/가')} 있어 다항식으로 나타낼 수 없는 것은 ${hit}이다. 분모가 0이 아닌 상수인 식과 다항식의 곱은 다항식이다.`);
    }, { count: 2 }),
    T('rexpr-same', '분모가 같은 두 유리식의 덧셈·뺄셈(약분하면 수)', '①2', (d) => {
      const p = nz(d, -6, 6), k = nz(d, -4, 4), a1 = d.int(-4, 4), op = d.pick(['+', '-']), s = op === '+' ? 1 : -1;
      const b1 = d.int(-9, 9), a2 = s * (k - a1), b2 = s * (-k * p - b1);
      if (Math.abs(b2) > 20 || (a1 === 0 && b1 === 0) || (a2 === 0 && b2 === 0) || a1 * p + b1 === 0 || a2 * p + b2 === 0) return null;
      const flip = (a2 !== 0 ? a2 : b2) < 0, sop = flip ? (op === '+' ? '-' : '+') : op;   // 둘째 분자가 −로 시작하면 부호를 밖으로 뺀다
      const h = `${frac(L(a1, b1), den(p))} ${sop === '+' ? '+' : MINUS} ${frac(flip ? L(-a2, -b2) : L(a2, b2), den(p))}`, kx = `${k === 1 ? '' : k === -1 ? MINUS : iq(k)}(${den(p)})`;
      return N('다음 식을 계산한 값은?', k, { signed: true, figure: ex(h),
        explain: `분모가 같으므로 분자끼리 ${sop === '+' ? '더하면' : '빼면'} ${frac(L(k, -k * p), den(p))} = ${frac(kx, den(p))} = ${iq(k)}이다.`,
        facts: { value: `${jn(a1)}${op}${jn(a2)}` } });
    }),
    T('rexpr-mix', '다항식과 유리식의 덧셈·뺄셈을 한 분수로 나타내기', '①3', (d) => {
      const c = pm(d) * d.int(2, 5), p = nz(d, -6, 6), k = nz(d, -9, 9), b = k - c * p;
      if (b === 0 || Math.abs(b) > 40) return null;
      const fk = frac(Math.abs(k), den(p)), h = d.bool() ? `${iq(c)} ${k < 0 ? MINUS : '+'} ${fk}` : `${k < 0 ? MINUS : ''}${fk} ${sgnT(c)}`;
      return inline('다음 식을 계산하시오.', frac(`{0}${X} {1}`, den(p)), [{ answer: c, signed: true }, { answer: b, signed: true }], {
        figure: ex(h), shown: frac(L(c, b), den(p)),
        explain: `${iq(c)} = ${frac(`${iq(c)}(${den(p)})`, den(p))}이므로 통분하면 ${frac(`${iq(c)}(${den(p)}) ${sgnT(k)}`, den(p))} = ${frac(L(c, b), den(p))}이다.`,
        facts: { calc: [[jn(c), 0], [`${jn(k)}-${jn(c)}*${jn(p)}`, 1]] } });
    }),
    T('rexpr-addsub', '분모를 인수분해하여 통분하는 유리식의 덧셈·뺄셈', '①4·5', (d, n) => {
      const [p, q] = pick2(d, n === 2 ? [-3, -2, -1, 0, 1, 2, 3] : [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]), D = fromRoots([p, q]), fac = facText([p, q]);
      const flipC = (P) => P.map((v, i) => (i === 0 ? -v : v)), lead = (P) => { for (let i = P.length - 1; i >= 0; i -= 1) if (P[i] !== 0) return P[i]; return 0; };
      let left, right, wrongs, mid;
      if (n === 0) {
        // 약분되는 꼴: 결과 R = β/(x − q) 또는 (x + β)/(x − q). 첫 분수 A/(x − p), 둘째 분수 N2/((x − p)(x − q))이고 N2 = R의 분자 × (x − p) − A × (x − q)
        const bt = nz(d, -6, 6), shape = d.bool(), A = shape ? [d.bool() ? bt : nz(d, -6, 6)] : [d.int(-5, 5), 1], R = shape ? [bt] : [bt, 1];
        const N2 = psub(pmul(R, lin1(p)), pmul(A, lin1(q)));
        if (N2.every((c) => c === 0) || pval(N2, p) === 0 || pval(N2, q) === 0 || pval(R, q) === 0 || pval(R, p) === 0) return null;
        const op = lead(N2) < 0 ? MINUS : '+', shown = op === MINUS ? pscale(N2, -1) : N2;
        left = `${frac(ptext(A), den(p))} ${op} ${frac(ptext(shown), ptext(D))}`;
        right = ro(R, lin1(q)); mid = rh(pmul(R, lin1(p)), D);
        wrongs = [ro(flipC(R), lin1(q)), ro(R, lin1(-q)), ro(R, lin1(p)), ro(R, D), ro(flipC(R), lin1(-q)), ro(padd(pmul(A, lin1(q)), pscale(N2, -1)), D)];
      } else if (n === 1) {
        // 약분되지 않는 꼴: 분모가 이차식으로 남는다.
        const A = d.bool() ? [nz(d, -5, 5)] : [d.int(-5, 5), 1], N2 = [nz(d, -8, 8), d.int(-3, 3)], S = padd(pmul(A, lin1(q)), N2);
        if (pval(S, p) === 0 || pval(S, q) === 0 || pval(N2, p) === 0 || pval(N2, q) === 0 || S.every((c) => c === 0) || S.some((c) => Math.abs(c) > 30)) return null;
        const op = lead(N2) < 0 ? MINUS : '+', shown = op === MINUS ? pscale(N2, -1) : N2;
        left = `${frac(ptext(A), den(p))} ${op} ${frac(ptext(shown), ptext(D))}`;
        right = ro(S, D); mid = right.h;
        wrongs = [ro(padd(A, N2), D), ro(psub(pmul(A, lin1(q)), N2), D), ro(padd(pmul(A, lin1(-q)), N2), D), ro(S, lin1(q)), ro(pscale(S, -1), D), ro(flipC(S), D)];
      } else {
        // 세 항: a/(x − p) + b/(x − q) ± c/((x − p)(x − q))
        const a = nz(d, -4, 4), b = nz(d, -4, 4), c = nz(d, -6, 6), S = padd(padd(pmul([a], lin1(q)), pmul([b], lin1(p))), [c]);
        if (pval(S, p) === 0 || pval(S, q) === 0 || S.length < 2 || S[0] === 0) return null;
        left = `${a < 0 ? MINUS : ''}${frac(Math.abs(a), den(p))} ${b < 0 ? MINUS : '+'} ${frac(Math.abs(b), den(q))} ${c < 0 ? MINUS : '+'} ${frac(Math.abs(c), ptext(D))}`;
        right = ro(S, D); mid = right.h;
        wrongs = [ro([a + b + c], D), ro(padd(padd(pmul([a], lin1(p)), pmul([b], lin1(q))), [c]), D), ro(padd(padd(pmul([a], lin1(q)), pmul([b], lin1(p))), [-c]), D), ro(S, lin1(q)), ro(pscale(S, -1), D)];
      }
      wrongs = wrongs.filter((w) => [2.37, 5.11].some((x) => Math.abs(w.f(x)) > 1e-9));   // 분자가 0인 식(값이 늘 0)은 보기로 쓰지 않는다
      return pickFn(d, '다음 식을 계산하면?', {
        figure: ex(left),
        explain: `${ptext(D)} = ${fac}이므로 분모를 ${jw(fac, '으로/로')} 통분하여 분자를 정리하면 ${mid}${n === 0 ? `이고, 분자와 분모를 ${jw(den(p), '으로/로')} 약분하면 ${right.h}` : ''}이다.`,
        facts: { rule: 'addsub-' + n }
      }, right, wrongs);
    }, { count: 3 }),
    T('rexpr-two', '두 문자가 든 유리식의 덧셈·뺄셈', '①6', (d, n) => {
      const m = d.int(1, 3), plus = d.bool(), P2 = [[2.3, 0.7], [-1.4, 3.1], [4.6, -2.2], [0.9, 5.3], [-3.3, -1.1]];
      const mm = (h) => (m === 1 ? h : `${m}(${h})`), mt = m === 1 ? '' : String(m);
      const xmy = `${X} ${MINUS} ${Y}`, xpy = `${X} + ${Y}`;
      if (n === 0) {
        const h = `${frac(term(m, X), `${X2} ${MINUS} ${Y2}`)} ${plus ? '+' : MINUS} ${frac(mono(m, Y), `${Y2} ${MINUS} ${X2}`)}`;
        const right = plus ? { h: frac(m, xpy), f: (x, y) => m / (x + y) } : { h: frac(m, xmy), f: (x, y) => m / (x - y) };
        const wrongs = [{ h: frac(m, plus ? xmy : xpy), f: (x, y) => m / (plus ? x - y : x + y) }, { h: MINUS + frac(m, xmy), f: (x, y) => -m / (x - y) }, { h: MINUS + frac(m, xpy), f: (x, y) => -m / (x + y) },
          { h: frac(m, `${X2} ${MINUS} ${Y2}`), f: (x, y) => m / (x * x - y * y) }, { h: frac(mm(xmy), `${X2} + ${Y2}`), f: (x, y) => m * (x - y) / (x * x + y * y) }];
        return pickFn(d, '다음 식을 계산하면?', { figure: ex(h), pts: P2,
          explain: `${Y2} ${MINUS} ${X2} = ${MINUS}(${X2} ${MINUS} ${Y2})이므로 ${frac(mono(m, Y), `${Y2} ${MINUS} ${X2}`)} = ${MINUS}${frac(mono(m, Y), `${X2} ${MINUS} ${Y2}`)}이다. 분자를 정리하면 ${frac(mm(plus ? xmy : xpy), `${X2} ${MINUS} ${Y2}`)} = ${right.h}이다.` }, right, wrongs);
      }
      const cube = plus ? `${X}${sup(3)} + ${Y}${sup(3)}` : `${X}${sup(3)} ${MINUS} ${Y}${sup(3)}`, cf = (x, y) => (plus ? x ** 3 + y ** 3 : x ** 3 - y ** 3);
      const h = `${frac(m, plus ? xpy : xmy)} ${plus ? '+' : MINUS} ${frac(`${mt}${X}${Y}`, cube)}`;
      const right = { h: frac(mm(`${X2} + ${Y2}`), cube), f: (x, y) => m * (x * x + y * y) / cf(x, y) };
      const wrongs = [{ h: frac(mm(`${X2} ${MINUS} ${Y2}`), cube), f: (x, y) => m * (x * x - y * y) / cf(x, y) }, { h: frac(mm(`${X2} + 2${X}${Y} + ${Y2}`), cube), f: (x, y) => m * (x + y) ** 2 / cf(x, y) },
        { h: frac(m, `${X2} ${plus ? MINUS : '+'} ${X}${Y} + ${Y2}`), f: (x, y) => m / (x * x + (plus ? -1 : 1) * x * y + y * y) }, { h: frac(mm(`${X2} ${plus ? '+' : MINUS} ${X}${Y} + ${Y2}`), cube), f: (x, y) => m * (x * x + (plus ? 1 : -1) * x * y + y * y) / cf(x, y) },
        { h: frac(mm(`${X2} + ${Y2}`), `${X}${sup(3)} ${plus ? MINUS : '+'} ${Y}${sup(3)}`), f: (x, y) => m * (x * x + y * y) / (plus ? x ** 3 - y ** 3 : x ** 3 + y ** 3) }];
      const fac = plus ? `(${xpy})(${X2} ${MINUS} ${X}${Y} + ${Y2})` : `(${xmy})(${X2} + ${X}${Y} + ${Y2})`;
      return pickFn(d, '다음 식을 계산하면?', { figure: ex(h), pts: P2,
        explain: `${cube} = ${fac}이므로 통분하면 분자는 ${mm(`${X2} ${plus ? MINUS : '+'} ${X}${Y} + ${Y2}`)} ${plus ? '+' : MINUS} ${mt}${X}${Y} = ${mm(`${X2} + ${Y2}`)}이다. 따라서 ${right.h}이다.` }, right, wrongs);
    }, { count: 2 }),
    T('rexpr-mul', '유리식의 곱셈(인수분해하여 약분)', '①7', (d) => {
      const rs = d.shuffle([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]).slice(0, 5), [a, b, c, e, g] = rs, kind = d.int(0, 2);
      // 인수(근)의 목록으로 짓는다: 분자1·분모1·분자2·분모2와 약분한 결과
      const F4 = [[[a], [b], [c, b], [a, e], [c], [e]], [[a, a], [a, b], [c, b], [e, a], [c], [e]], [[a], [b, c], [e, c], [g, a], [e], [b, g]]][kind];
      const [n1, d1, n2, d2, rn, rd] = F4.map((r) => fromRoots(r)), R = ro(rn, rd);
      const h = `${frac(ptext(n1), ptext(d1))} × ${frac(ptext(n2), ptext(d2))}`;
      const flip = (P) => P.map((v, i) => (i === 0 ? -v : v));
      const wrongs = [ro(flip(rn), rd.length === 2 ? flip(rd) : rd), ro(rd.length === 2 ? rd : lin1(g), rn), ro(rn, lin1(a)), ro(lin1(a), rd), ro(flip(rn), rd), ro(rn, rd.length === 2 ? flip(rd) : fromRoots([-b, -g]))];
      return pickFn(d, '다음 식을 계산하면?', { figure: ex(h),
        explain: `분자와 분모를 인수분해하면 ${frac(facText(F4[0]), facText(F4[1]))} × ${frac(facText(F4[2]), facText(F4[3]))}이고, 같은 인수를 약분하면 ${R.h}이다.` }, R, wrongs);
    }),
    T('rexpr-div', '유리식의 나눗셈(나누는 식을 뒤집어 곱함)', '①8', (d) => {
      const rs = d.shuffle([-4, -3, -2, -1, 1, 2, 3, 4]).slice(0, 5), [a, b, c, e, g] = rs, kind = d.int(0, 2);
      // 인수(근)의 목록: 분자1·분모1·분자2·분모2와 계산한 결과
      const F4 = [[[a], [b, c], [a, e], [b, c, e], [], []], [[a], [b, c], [a, e], [b, c, g], [g], [e]], [[a], [b, c], [a, a], [b], [], [c, a]]][kind];
      const [n1, d1, n2, d2, rn, rd] = F4.map((r) => fromRoots(r)), R = ro(rn, rd);
      const h = `${frac(ptext(n1), ptext(d1))} ÷ ${frac(ptext(n2), ptext(d2))}`;
      const wrongs = [ro(rd, rn), ro([-1], [1]), ro(lin1(e), lin1(g)), ro([1], fromRoots([b, a])), ro(lin1(-g), lin1(-e)), ro([1], fromRoots([c, e])), ro(pmul(n1, n2), pmul(d1, d2))];
      // 곱을 펼친 보기는 삼차 이상이 되면 쓰지 않는다.
      const usable = wrongs.filter((w) => !/<sup>[3-9]<\/sup>/.test(w.h));
      return pickFn(d, '다음 식을 계산하면?', { figure: ex(h),
        explain: `나누는 식의 분자와 분모를 바꾸어 곱하면 ${frac(facText(F4[0]), facText(F4[1]))} × ${frac(facText(F4[3]), facText(F4[2]))}이고, 같은 인수를 약분하면 ${R.h}이다.` }, R, usable);
    }),
    T('rexpr-identity', '부분분수로 나눈 등식에서 계수 구하기', '①9', (d) => {
      const [p, q] = pick2(d, [-3, -2, -1, 1, 2, 3, 4]), b = nz(d, -5, 5), e = pm(d) * d.int(1, 3), a = b + e, c = -(b * q + e * p);
      if (a === 0 || c === 0 || Math.abs(c) > 25) return null;
      const right = `${frac(Bv, den(p))} ${e < 0 ? MINUS : '+'} ${frac(Math.abs(e), den(q))}`;
      return vals(`${nb(`${X} ≠ ${iq(p)}`)}, ${nb(`${X} ≠ ${iq(q)}`)}인 모든 실수 ${X}에 대하여 다음 등식이 성립할 때, 상수 ${Av}, ${Bv}의 값을 구하시오.`, [[Av, a], [Bv, b]], {
        figure: ex(`${frac(`${Av}${X} ${sgnT(c)}`, `(${den(p)})(${den(q)})`)} = ${right}`),
        explain: `오른쪽을 통분하면 ${frac(`${Bv}(${den(q)}) ${e < 0 ? MINUS : '+'} ${Math.abs(e) === 1 ? '' : Math.abs(e)}(${den(p)})`, `(${den(p)})(${den(q)})`)}이다. 분자의 계수를 비교하면 ${is(Av, `${Bv} ${sgnT(e)}`)}, ${is(iq(c), poly([[-q, Bv], [-e * p, '']]))}이므로 ${is(Bv, b)}, ${is(Av, a)}이다.`,
        facts: { calc: [[`(0-(${jn(c)})-(${jn(e)})*(${jn(p)}))/(${jn(q)})`, 1], [`(0-(${jn(c)})-(${jn(e)})*(${jn(p)}))/(${jn(q)})+(${jn(e)})`, 0]] } });
    }),
    T('rexpr-domain', '유리함수의 정의역', '①10', (d, n) => {
      let h, right, wrongs;
      if (n === 0) {
        const k = nz(d, -6, 6), p = nz(d, -6, 6), q = nz(d, -5, 5);
        if (q === p || q === -p || k - q * p === 0) return null;
        h = d.bool() ? hypGen(k, p, q) : stdR(k, p, q);
        right = notX(p); wrongs = [notX(-p), notX(q), allX, setX(`${X} ≠ 0인 실수`)];
      } else if (n === 1) {
        const c = d.int(2, 5), e = d.until(() => nz(d, -9, 9), (v) => v % c !== 0), a = nz(d, -5, 5), b = nz(d, -9, 9);
        if (a * e - b * c === 0) return null;
        h = genR(a, b, c, e); right = notX(Q(-e, c));
        wrongs = [notX(Q(e, c)), notX(Q(-c, e)), allX, notX(Q(-b, a))];
      } else {
        const c = d.int(2, 6), a = nz(d, -5, 5), b = nz(d, -9, 9), sq = d.bool();
        h = frac(sq ? poly([[a, X2], [b, '']]) : L(a, b), c); right = allX;
        wrongs = [notX(c), notX(-c), setX(`${X} ≠ 0인 실수`), sq ? setX(`${X} &gt; 0인 실수`) : notX(Q(-b, a))];
      }
      const rows = d.shuffle([right].concat(wrongs)), ans = rows.indexOf(right);
      if (new Set(rows.map(stripH)).size !== rows.length) return null;
      return C(`함수 ${yIs(h)}의 정의역은?`, rows, ans, {
        explain: n === 2 ? `분모가 0이 아닌 상수이므로 ${jw(yIs(h), '은/는')} 다항함수이고, 정의역은 실수 전체의 집합이다.` : `유리함수의 정의역은 분모를 0으로 하는 ${X}의 값을 뺀 실수 전체의 집합이므로 ${right}이다.`,
        facts: { truth: rows.map((r) => r === right), want: true, rule: 'domain-' + n } });
    }, { count: 3 }),
    T('rexpr-same-domain', '두 유리함수의 정의역이 같을 때 상수', '①11', (d) => {
      const m = d.int(2, 5), n0 = d.until(() => nz(d, -9, 9), (v) => gcd(v, m) === 1), k = d.int(1, 6), a = nz(d, -6, 6), b = nz(d, -9, 9), c = nz(d, -6, 6), e = nz(d, -9, 9);
      if ((k * n0) % m === 0 || a * n0 - b * m === 0) return null;
      const A = Q(-k * n0, m), ak = k === 1 ? Av : frac(Av, k);
      return F(`두 유리함수 ${yIs(genR(a, b, m, n0))}, ${yIs(frac(L(c, e), `${Av} ${MINUS} ${mono(k, X)}`))}의 정의역이 같을 때, 상수 ${Av}의 값은?`, Math.abs(A.p), A.q, {
        improper: Math.abs(A.p) > A.q, anyForm: true, signed: true, negative: A.p < 0,
        explain: `첫째 함수의 정의역은 ${notX(Q(-n0, m))}이고, 둘째 함수의 정의역은 ${setX(`${X} ≠ ${ak}인 실수`)}이다. ${k === 1 ? `두 정의역이 같으므로 ${is(Av, A)}이다.` : `${is(ak, Q(-n0, m))}이므로 ${is(Av, A)}이다.`}`,
        facts: { value: `-(${k}*${jn(n0)})/${m}` } });
    })
  ];

  // ════════════════════════════════════════════════════════════════
  // 유리함수의 그래프
  // ════════════════════════════════════════════════════════════════
  const rgraph = [
    T('rgraph-kx-claims', 'y = k/x 의 그래프의 성질 가리기', '①12', (d, n) => {
      const k = nz(d, -6, 6), s = d.pick(divisorsOf(k).filter((v) => Math.abs(v) !== Math.abs(k) || Math.abs(k) === 1)), m = (k > 0 ? 1 : -1) * d.int(1, 3);
      const fk = (kk) => (kk < 0 ? MINUS : '') + frac(Math.abs(kk), X), quad = k > 0 ? '제1사분면과 제3사분면' : '제2사분면과 제4사분면', anti = k > 0 ? '제2사분면과 제4사분면' : '제1사분면과 제3사분면';
      const yes = [
        `정의역과 치역은 모두 0이 아닌 실수 전체의 집합이다.`,
        `그래프는 ${quad}에 있다.`,
        `그래프는 원점에 대하여 대칭이다.`,
        `그래프의 점근선은 ${X}축과 ${Y}축이다.`,
        `역함수는 ${yIs(fk(k))}이다.`,
        `그래프는 점 ${jw(pt(s, k / s), '을/를')} 지난다.`,
        `직선 ${jw(yIs(term(m, X)), '과/와')} 서로 다른 두 점에서 만난다.`
      ];
      const no = [
        [`정의역은 실수 전체의 집합이다.`, `${is(X, 0)}일 때 정의되지 않으므로 정의역은 0이 아닌 실수 전체의 집합이다.`, yes[0]],
        [`그래프는 ${anti}에 있다.`, `${yIs(frac(Kv, X))} 꼴에서 ${jw(is(Kv, iq(k)), '이/가')} ${k > 0 ? '양수' : '음수'}이므로 그래프는 ${quad}에 있다.`, yes[1]],
        [`그래프는 ${X}축에 대하여 대칭이다.`, `그래프는 원점에 대하여 대칭이다.`, yes[2]],
        [`그래프의 점근선은 직선 ${jw(is(X, k), '과/와')} ${X}축이다.`, `그래프의 점근선은 ${X}축과 ${Y}축이다.`, yes[3]],
        [`역함수는 ${yIs(fk(-k))}이다.`, `${yIs(fk(k))}에서 ${jw(X, '과/와')} ${jw(Y, '을/를')} 바꾸어도 같은 식이므로 역함수는 자기 자신이다.`, yes[4]],
        [`그래프는 점 ${jw(pt(s, -k / s), '을/를')} 지난다.`, `${is(X, s)}일 때 ${is(Y, k / s)}이므로 점 ${jw(pt(s, k / s), '을/를')} 지난다.`, yes[5]],
        [`직선 ${jw(yIs(term(-m, X)), '과/와')} 서로 다른 두 점에서 만난다.`, `${fk(k)} = ${term(-m, X)}, 곧 ${jw(is(X2, Q(-k, m)), '을/를')} 만족하는 실수 ${jw(X, '이/가')} 없으므로 만나지 않는다.`, yes[6]]
      ];
      return claimQ(d, `함수 ${yIs(fk(k))}의 그래프에 대한 설명으로 ${n === 0 ? '옳은' : '옳지 않은'} 것은?`, yes, no, n === 0);
    }, { count: 2 }),
    T('rgraph-kx-triangle', 'y = k/x 의 그래프와 두 직선의 교점으로 만든 삼각형의 넓이', '①15', (d) => {
      const [a, b] = d.pick([[1, 3], [1, 5], [3, 5], [1, 7], [3, 7], [5, 7]]), k = a * b;
      return N(`함수 ${yIs(frac(k, X))} ${nb(`(${X} &gt; 0)`)}의 그래프와 두 직선 ${yIs(iq(Q(b, a)) + X)}, ${yIs(frac(a, b) + X)}의 교점을 각각 A, B라 할 때, 삼각형 OAB의 넓이는? (단, O는 원점이다.)`, (b * b - a * a) / 2, {
        explain: `${frac(k, X)} = ${iq(Q(b, a))}${X}에서 ${is(X2, a * a)}, ${is(X, a)}이므로 A${pt(a, b)}, 같은 방법으로 B${pt(b, a)}이다. 직선 AB는 ${is(`${X} + ${Y}`, a + b)}이고 원점과 이 직선 사이의 거리는 ${frac(a + b, rt(2))}, ${nb(`AB = ${b - a}${rt(2)}`)}이므로 넓이는 ${frac(1, 2)} × ${b - a}${rt(2)} × ${frac(a + b, rt(2))} = ${(b * b - a * a) / 2}이다.`,
        facts: { value: `(${b}*${b}-${a}*${a})/2`, derived: [2] } });
    }),
    T('rgraph-std', 'y = k/(x − p) + q 의 점근선, 정의역과 치역', '①16', (d, n) => {
      const k = nz(d, -6, 6), p = d.int(-6, 6), q = d.int(-6, 6);
      if (p === 0 && q === 0) return null;
      const f = yIs(stdR(k, p, q)), why = `${f}의 그래프는 ${yIs((k < 0 ? MINUS : '') + frac(Math.abs(k), X))}의 그래프를 ${shiftWords(p, q)} 평행이동한 것이다.`;
      if (n === 0) return asymAns(`함수 ${f}의 그래프의 점근선의 방정식을 구하시오.`, p, q, { explain: why + ` 따라서 점근선은 ${is(X, p)}, ${is(Y, q)}이다.`, facts: { calc: [[jn(p), 0], [jn(q), 1]], rule: 'std-asym' } });
      return drRat(`함수 ${f}의 정의역과 치역을 구하시오.`, p, q, { explain: why + ` 따라서 정의역은 ${notX(p)}, 치역은 ${notY(q)}이다.`, facts: { calc: [[jn(p), 0], [jn(q), 1]], rule: 'std-dr' } });
    }, { count: 2 }),
    T('rgraph-gen', 'y = (ax + b)/(x − p) 를 바꾸어 점근선, 정의역과 치역 구하기', '①17', (d, n) => {
      const k = nz(d, -7, 7), p = nz(d, -6, 6), q = nz(d, -5, 5), b = k - q * p;
      if (Math.abs(b) > 30) return null;
      if (n === 1) {
        // 분모가 p − x 인 꼴: (−qx − b)/(p − x)
        const h = frac(L(-q, -b), `${iq(p)} ${MINUS} ${X}`);
        return asymAns(`함수 ${yIs(h)}의 그래프의 점근선의 방정식을 구하시오.`, p, q, {
          explain: `분모가 ${iq(p)} ${MINUS} ${X} = ${MINUS}(${den(p)})이므로 ${yIs(h)} = ${hypGen(k, p, q)} = ${stdR(k, p, q)}이다. 따라서 점근선은 ${is(X, p)}, ${is(Y, q)}이다.`,
          facts: { calc: [[jn(p), 0], [`0-(${jn(-q)})`, 1]], rule: 'gen-flip' } });
      }
      const f = yIs(hypGen(k, p, q)), why = `${toStd(k, p, q)}이므로`;
      if (n === 0) return asymAns(`함수 ${f}의 그래프의 점근선의 방정식을 구하시오.`, p, q, { explain: `${why} 점근선은 ${is(X, p)}, ${is(Y, q)}이다.`, facts: { calc: [[jn(p), 0], [jn(q), 1]], rule: 'gen-asym' } });
      return drRat(`함수 ${f}의 정의역과 치역을 구하시오.`, p, q, { explain: `${why} 정의역은 ${notX(p)}, 치역은 ${notY(q)}이다.`, facts: { calc: [[jn(p), 0], [jn(q), 1]], rule: 'gen-dr' } });
    }, { count: 3 }),
    T('rgraph-gen-coef', '분모의 x의 계수가 1이 아닌 유리함수의 점근선', '①17', (d) => {
      const c = d.int(2, 4), e = d.until(() => nz(d, -9, 9), (v) => v % c !== 0), a = nz(d, -8, 8), b = nz(d, -9, 9);
      if (a * e - b * c === 0 || a % c === 0) return null;
      const ax = Q(-e, c), ay = Q(a, c), pair = (x, y) => `${is(X, x)}, ${is(Y, y)}`;
      const right = pair(ax, ay), wrongs = [pair(Q(-e), Q(a)), pair(Q(e, c), ay), pair(ax, Q(-a, c)), pair(Q(-c, e), ay), pair(ax, Q(b, e))];
      const rows = d.shuffle([right].concat(d.shuffle(wrongs.filter((w, i, all) => w !== right && all.indexOf(w) === i)).slice(0, 4)));
      if (rows.length < 5 || new Set(rows.map(stripH)).size !== 5) return null;
      return C(`함수 ${yIs(genR(a, b, c, e))}의 그래프의 점근선의 방정식은?`, rows, rows.indexOf(right), {
        explain: `분모 ${jw(L(c, e), '이/가')} 0이 되는 ${jw(is(X, ax), '이/가')} 한 점근선이다. 분자를 분모로 나누면 몫이 ${iq(ay)}이고 나머지는 상수이므로, ${X}의 절댓값이 커질수록 ${Y}의 값은 ${iq(ay)}에 가까워진다. 따라서 점근선은 ${right}이다.`,
        facts: { truth: rows.map((r) => r === right), want: true } });
    }),
    T('rgraph-shift-from', '유리함수의 그래프는 y = k/x 의 그래프를 얼마만큼 옮긴 것인가', '①18', (d) => {
      const k = nz(d, -6, 6), p = nz(d, -6, 6), q = nz(d, -6, 6), b = k - q * p;
      if (Math.abs(b) > 30) return null;
      return vals(`함수 ${yIs(hypGen(k, p, q))}의 그래프는 함수 ${yIs(frac(Kv, X))}의 그래프를 ${X}축의 방향으로 ${Mv}만큼, ${Y}축의 방향으로 ${Nv}만큼 평행이동한 것이다. 상수 ${Kv}, ${Mv}, ${Nv}의 값을 구하시오.`, [[Kv, k], [Mv, p], [Nv, q]], {
        explain: `${toStd(k, p, q)}이므로 ${is(Kv, k)}, ${is(Mv, p)}, ${is(Nv, q)}이다.`,
        facts: { calc: [[`${jn(b)}+${jn(q)}*${jn(p)}`, 0], [jn(p), 1], [jn(q), 2]] } });
    }),
    T('rgraph-shift-between', '두 유리함수의 그래프 사이의 평행이동', '①18', (d) => {
      const k = nz(d, -5, 5), [p1, p2] = pick2(d, [-4, -3, -2, -1, 1, 2, 3, 4]), [q1, q2] = pick2(d, [-4, -3, -2, -1, 1, 2, 3, 4]);
      const b1 = k - q1 * p1, b2 = k - q2 * p2;
      if (b1 === 0 || b2 === 0) return null;
      return vals(`함수 ${yIs(hypGen(k, p1, q1))}의 그래프를 ${X}축의 방향으로 ${Mv}만큼, ${Y}축의 방향으로 ${Nv}만큼 평행이동하면 함수 ${yIs(hypGen(k, p2, q2))}의 그래프와 일치한다. 상수 ${Mv}, ${Nv}의 값을 구하시오.`, [[Mv, p2 - p1], [Nv, q2 - q1]], {
        explain: `${yIs(hypGen(k, p1, q1))} = ${stdR(k, p1, q1)}, ${yIs(hypGen(k, p2, q2))} = ${stdR(k, p2, q2)}이다. 두 점근선의 교점이 ${pt(p1, q1)}에서 ${jw(pt(p2, q2), '으로/로')} 옮겨졌으므로 ${is(Mv, p2 - p1)}, ${is(Nv, q2 - q1)}이다.`,
        facts: { calc: [[`${jn(p2)}-(${jn(p1)})`, 0], [`${jn(q2)}-(${jn(q1)})`, 1]] } });
    }),
    T('rgraph-shift-unknown', '평행이동한 꼴이 되도록 분자의 상수 정하기', '①18', (d) => {
      const K = nz(d, -6, 6), p = nz(d, -6, 6), c = nz(d, -4, 4), k0 = K - c * p;
      if (k0 === 0 || Math.abs(k0) > 30) return null;
      return vals(`함수 ${yIs(frac(`${term(c, X)} + ${Kv}`, den(p)))}의 그래프는 함수 ${yIs((K < 0 ? MINUS : '') + frac(Math.abs(K), X))}의 그래프를 ${X}축의 방향으로 ${Av}만큼, ${Y}축의 방향으로 ${Bv}만큼 평행이동한 것이다. 상수 ${Kv}, ${Av}, ${Bv}의 값을 구하시오.`, [[Kv, k0], [Av, p], [Bv, c]], {
        explain: `${frac(`${term(c, X)} + ${Kv}`, den(p))} = ${frac(`${c === 1 ? '' : c === -1 ? MINUS : iq(c)}(${den(p)}) + ${Kv} ${sgnT(c * p)}`, den(p))} = ${frac(`${Kv} ${sgnT(c * p)}`, den(p))} ${sgnT(c)}이다. ${is(`${Kv} ${sgnT(c * p)}`, K)}에서 ${is(Kv, k0)}이고, ${is(Av, p)}, ${is(Bv, c)}이다.`,
        facts: { calc: [[`${jn(K)}-(${jn(c)})*(${jn(p)})`, 0], [jn(p), 1], [jn(c), 2]] } });
    }),
    T('rgraph-shift-to', '유리함수의 그래프를 평행이동한 그래프의 식', '①19', (d, n) => {
      if (n === 0) {
        const k = nz(d, -9, 9), p = nz(d, -6, 6), q = nz(d, -5, 5), m = nz(d, -5, 5), t = nz(d, -5, 5), b = k - q * p;
        if (Math.abs(b) > 40 || p + m === 0 || q + t === 0) return null;
        return vals(`함수 ${yIs(hypGen(k, p, q))}의 그래프를 ${X}축의 방향으로 ${iq(m)}만큼, ${Y}축의 방향으로 ${iq(t)}만큼 평행이동한 그래프의 식이 ${yIs(`${frac(Kv, `${X} ${MINUS} ${Pv}`)} + ${Qv}`)}일 때, 상수 ${Kv}, ${Pv}, ${Qv}의 값을 구하시오.`, [[Kv, k], [Pv, p + m], [Qv, q + t]], {
          explain: `${toStd(k, p, q)}이므로 평행이동한 그래프의 식은 ${yIs(stdR(k, p + m, q + t))}이다.`,
          facts: { calc: [[`${jn(b)}+${jn(q)}*${jn(p)}`, 0], [`${jn(p)}+(${jn(m)})`, 1], [`${jn(q)}+(${jn(t)})`, 2]] } });
      }
      const s = pm(d) * d.pick([1, 3, 5]), m = nz(d, -4, 4), t = nz(d, -4, 4), a = -2 * m, bb = 2 * t, cc = s - 2 * t * m;
      if (cc === 0) return null;
      return vals(`함수 ${yIs((s < 0 ? MINUS : '') + frac(Math.abs(s), '2' + X))}의 그래프를 ${X}축의 방향으로 ${iq(m)}만큼, ${Y}축의 방향으로 ${iq(t)}만큼 평행이동하였더니 함수 ${yIs(frac(`${Bv}${X} + ${Cv}`, `2${X} + ${Av}`))}의 그래프와 일치하였다. 상수 ${Av}, ${Bv}, ${Cv}의 값을 구하시오.`, [[Av, a], [Bv, bb], [Cv, cc]], {
        explain: `평행이동한 그래프의 식은 ${yIs(`${s < 0 ? MINUS : ''}${frac(Math.abs(s), `2(${den(m)})`)} ${sgnT(t)}`)} = ${frac(L(2 * t, cc), L(2, -2 * m))}이므로 ${is(Av, a)}, ${is(Bv, bb)}, ${is(Cv, cc)}이다.`,
        facts: { calc: [[`0-2*(${jn(m)})`, 0], [`2*(${jn(t)})`, 1], [`${jn(s)}-2*(${jn(t)})*(${jn(m)})`, 2]], derived: [2] } });
    }, { count: 2 }),
    T('rgraph-shift-point', '평행이동한 그래프가 지나는 점의 좌표', '①19', (d) => {
      const k = nz(d, -8, 8), m = nz(d, -5, 5), t = nz(d, -5, 5), x0 = m + d.pick(divisorsOf(k)), y0 = k / (x0 - m) + t;
      if (x0 === 0) return null;
      return N(`함수 ${yIs((k < 0 ? MINUS : '') + frac(Math.abs(k), X))}의 그래프를 ${X}축의 방향으로 ${iq(m)}만큼, ${Y}축의 방향으로 ${iq(t)}만큼 평행이동한 그래프가 점 ${jw(pt(x0, Av), '을/를')} 지날 때, 상수 ${Av}의 값은?`, y0, { signed: true,
        explain: `평행이동한 그래프의 식은 ${yIs(stdR(k, m, t))}이다. ${jw(is(X, x0), '을/를')} 넣으면 ${is(Av, `${frac(k < 0 ? MINUS + Math.abs(k) : k, `${iq(x0)} ${sgnT(-m)}`)} ${sgnT(t)}`)} = ${iq(y0)}이다.`,
        facts: { value: `${jn(k)}/(${jn(x0)}-(${jn(m)}))+(${jn(t)})` } });
    }),
    T('rgraph-shift-point2', '평행이동한 그래프가 지나는 두 점에서 k와 다른 좌표', '①19', (d) => {
      const k = nz(d, -8, 8), m = nz(d, -5, 5), t = nz(d, -5, 5), [u, w] = pick2(d, divisorsOf(k)), x1 = m + u, x2 = m + w, y1 = k / u + t, a = k / w + t;
      if (x1 === 0 || x2 === 0) return null;
      return vals(`함수 ${yIs(frac(Kv, X))}의 그래프를 ${X}축의 방향으로 ${iq(m)}만큼, ${Y}축의 방향으로 ${iq(t)}만큼 평행이동한 그래프가 두 점 ${pt(x1, y1)}, ${jw(pt(x2, Av), '을/를')} 지날 때, 상수 ${Kv}, ${Av}의 값을 구하시오.`, [[Kv, k], [Av, a]], {
        explain: `평행이동한 그래프의 식은 ${yIs(`${frac(Kv, den(m))} ${sgnT(t)}`)}이다. 점 ${jw(pt(x1, y1), '을/를')} 넣으면 ${is(iq(y1), `${frac(Kv, `${iq(x1)} ${sgnT(-m)}`)} ${sgnT(t)}`)}에서 ${is(Kv, k)}, 점 ${jw(pt(x2, Av), '을/를')} 넣으면 ${is(Av, a)}이다.`,
        facts: { calc: [[`(${jn(y1)}-(${jn(t)}))*(${jn(x1)}-(${jn(m)}))`, 0], [`(${jn(y1)}-(${jn(t)}))*(${jn(x1)}-(${jn(m)}))/(${jn(x2)}-(${jn(m)}))+(${jn(t)})`, 1]] } });
    }),
    T('rgraph-congruent', '평행이동(대칭이동)하여 겹쳐지는 유리함수의 그래프', '①20', (d, n) => {
      if (n === 0) {
        const k0 = nz(d, -4, 4), k1 = d.pick([-k0, 2 * k0, k0 + (k0 > 0 ? 1 : -1)]);
        const centers = d.shuffle([[1, 2], [-2, 1], [3, -1], [-1, -3], [2, -2], [-3, 2], [0, 2], [1, 0], [-2, -1], [4, 1]]).slice(0, 5);
        const rows = centers.map(([p, q], i) => ({ k: i === 0 ? k1 : k0, p, q })), shown = d.shuffle(rows);
        if (shown.some((r) => r.k - r.q * r.p === 0)) return null;
        const list = shown.map((r) => yIs(hypGen(r.k, r.p, r.q)));
        if (new Set(list.map(stripH)).size !== 5) return null;
        return C('다음 함수의 그래프 가운데 평행이동하여 나머지 넷과 일치시킬 수 없는 것은?', list, shown.findIndex((r) => r.k === k1), {
          explain: `각 식을 ${yIs(`${frac(Kv, `${X} ${MINUS} ${Pv}`)} + ${Qv}`)} 꼴로 바꾸면 하나만 ${is(Kv, k1)}이고 나머지는 ${is(Kv, k0)}이다. ${jw(Kv, '이/가')} 같아야 평행이동하여 겹친다.`,
          facts: { truth: shown.map((r) => r.k === k1), want: true } });
      }
      const k0 = pm(d) * d.int(2, 6), cp = () => [nz(d, -3, 3), nz(d, -3, 3)];
      // 네 갈래 가운데 셋: ① 표준형(같은 k) ② 일반형(k의 부호가 반대 — 대칭이동하면 겹친다) ③ 분모의 x의 계수가 2인 일반형(k가 반이거나 같거나 두 배 — 분자만 보면 속는다) ④ 일반형(k가 두 배)
      const kinds = [
        () => { const [p, q] = cp(); return [yIs(stdR(k0, p, q)), true]; },
        () => { const [p, q] = cp(); return -k0 - q * p === 0 ? null : [yIs(hypGen(-k0, p, q)), true]; },
        () => { const q = nz(d, -3, 3), dd = pm(d) * d.pick([1, 3, 5]), K = d.pick([k0 / 2, k0, 2 * k0].filter((v) => Number.isInteger(v))); return 2 * K - q * dd === 0 ? null : [yIs(genR(2 * q, 2 * K - q * dd, 2, -dd)), Math.abs(K) === Math.abs(k0)]; },
        () => { const [p, q] = cp(); return 2 * k0 - q * p === 0 ? null : [yIs(hypGen(2 * k0, p, q)), false]; }
      ];
      const items = d.shuffle([0, 1, 2, 3]).slice(0, 3).map((i) => kinds[i]());
      if (items.some((it) => !it)) return null;
      const list = items.map((it) => it[0]), truth = items.map((it) => it[1]);
      if (new Set(list.map(stripH)).size !== 3) return null;
      return comboPick(d, `다음 함수 가운데 그 그래프를 평행이동 또는 대칭이동하여 함수 ${yIs((k0 < 0 ? MINUS : '') + frac(Math.abs(k0), X))}의 그래프와 겹쳐질 수 있는 것만을 있는 대로 고른 것은?`, list, truth,
        `각 식을 ${yIs(`${frac(Kv, `${X} ${MINUS} ${Pv}`)} + ${Qv}`)} 꼴로 바꾸어 ${Kv}의 절댓값을 본다. ${X}축이나 ${Y}축에 대하여 대칭이동하면 ${Kv}의 부호만 바뀌므로 절댓값이 ${Math.abs(k0)}인 것만 겹쳐질 수 있다.`);
    }, { count: 2 }),
    T('rgraph-claims', '유리함수의 그래프에 대한 설명의 참·거짓', '①21', (d, n) => {
      const k = nz(d, -6, 6), p = nz(d, -5, 5), q = nz(d, -5, 5), b = k - q * p;
      if (Math.abs(b) > 30 || p === q || p === -q) return null;
      const u = d.pick(divisorsOf(k)), x1 = p + u, y1 = k / u + q, qs = quadsHyp(k, p, q), miss = [0, 1, 2, 3].filter((i) => !qs[i]);
      const f = hypGen(k, p, q);
      const yes = [
        `점근선의 방정식은 ${is(X, p)}, ${is(Y, q)}이다.`,
        `정의역은 ${notX(p)}이다.`,
        `치역은 ${notY(q)}이다.`,
        `함수 ${yIs((k < 0 ? MINUS : '') + frac(Math.abs(k), X))}의 그래프를 ${X}축의 방향으로 ${iq(p)}만큼, ${Y}축의 방향으로 ${iq(q)}만큼 평행이동한 것이다.`,
        `점 ${jw(pt(x1, y1), '을/를')} 지난다.`,
        `점 ${pt(p, q)}에 대하여 대칭이다.`,
        miss.length ? `${jw(QN[miss[0]], '을/를')} 지나지 않는다.` : `모든 사분면을 지난다.`
      ];
      const pass = [0, 1, 2, 3].filter((i) => qs[i]);
      const no = [
        [`점근선의 방정식은 ${is(X, -p)}, ${is(Y, q)}이다.`, `점근선의 방정식은 ${is(X, p)}, ${is(Y, q)}이다.`, yes[0]],
        [`정의역은 ${notX(-p)}이다.`, `분모가 0이 되는 ${jw(is(X, p), '을/를')} 빼야 하므로 정의역은 ${notX(p)}이다.`, yes[1]],
        [`치역은 ${notY(-q)}이다.`, `치역은 ${notY(q)}이다.`, yes[2]],
        [`함수 ${yIs((k < 0 ? MINUS : '') + frac(Math.abs(k), X))}의 그래프를 ${X}축의 방향으로 ${iq(-p)}만큼, ${Y}축의 방향으로 ${iq(q)}만큼 평행이동한 것이다.`, `${X}축의 방향으로 ${iq(p)}만큼 평행이동한 것이다.`, yes[3]],
        [`점 ${jw(pt(x1, y1 + (d.bool() ? 1 : -1)), '을/를')} 지난다.`, `${is(X, x1)}일 때 ${is(Y, y1)}이므로 점 ${jw(pt(x1, y1), '을/를')} 지난다.`, yes[4]],
        [`점 ${pt(-p, q)}에 대하여 대칭이다.`, `두 점근선의 교점 ${pt(p, q)}에 대하여 대칭이다.`, yes[5]],
        miss.length ? [`${jw(QN[d.pick(pass)], '을/를')} 지나지 않는다.`, `그래프는 ${jw(quadText(pass), '을/를')} 지나고 ${jw(QN[miss[0]], '을/를')} 지나지 않는다.`, yes[6]] : [`${jw(QN[d.int(0, 3)], '을/를')} 지나지 않는다.`, `그래프는 모든 사분면을 지난다.`, yes[6]]
      ];
      if (miss.length > 1) return null;
      return claimQ(d, `함수 ${yIs(f)}의 그래프에 대한 설명으로 ${n === 0 ? '옳은' : '옳지 않은'} 것은?`, yes, no, n === 0);
    }, { count: 2 }),
    T('rgraph-quadrant', '유리함수의 그래프가 지나지 않는 사분면', '①22', (d) => {
      const c = d.pick([1, 1, 2, 3]), e = nz(d, -6, 6), a = nz(d, -6, 6), b = d.int(-9, 9);
      if (a * e - b * c === 0 || (c > 1 && (e % c === 0))) return null;
      const p = -e / c, q = a / c, k = (b * c - a * e) / (c * c), qs = quadsHyp(k, p, q), miss = [0, 1, 2, 3].filter((i) => !qs[i]);
      if (miss.length > 1) return null;
      const opts = QN.concat(['없다']), ans = miss.length ? miss[0] : 4;
      return C(`함수 ${yIs(genR(a, b, c, e))}의 그래프가 지나지 않는 사분면은?`, opts, ans, {
        explain: `${yIs(genR(a, b, c, e))}의 그래프의 점근선은 ${is(X, Q(-e, c))}, ${is(Y, Q(a, c))}이고, ${Y}축과 ${b === 0 ? '원점' : '점 ' + pt(0, Q(b, e))}에서 만난다. 그래프를 그리면 ${jw(quadText([0, 1, 2, 3].filter((i) => qs[i])), '을/를')} 지나므로 ${ans === 4 ? '지나지 않는 사분면은 없다' : `지나지 않는 사분면은 ${QN[ans]}이다`}.`,
        facts: { truth: opts.map((_, i) => i === ans), want: true } });
    }),
    T('rgraph-quadrant-n', '그래프가 한 사분면을 지나지 않게 하는 자연수의 개수', '①23', (d) => {
      const p = d.int(2, 9), q = d.int(1, 3), s = d.int(2, 4), u = -d.int(s + 1, 5 * s);
      if (s + u + q * p <= 0) return null;
      const cnt = Math.floor(-u / s);
      return N(`함수 ${yIs(frac(poly([[q, X], [s, Nv], [u, '']]), den(p)))}의 그래프가 제3사분면을 지나지 않도록 하는 자연수 ${Nv}의 개수는?`, cnt, {
        explain: `${yIs(`${frac(poly([[s, Nv], [u + q * p, '']]), den(p))} ${sgnT(q)}`)}이고 자연수 ${Nv}에 대하여 ${nb(`${poly([[s, Nv], [u + q * p, '']])} &gt; 0`)}이므로, 그래프는 점 ${pt(p, q)}의 오른쪽 위와 왼쪽 아래에 있다. 제3사분면을 지나지 않으려면 ${Y}절편 ${jw(frac(poly([[s, Nv], [u, '']]), MINUS + p), '이/가')} 0 이상이어야 하므로 ${nb(`${mono(s, Nv)} ≤ ${-u}`)}, 자연수 ${jw(Nv, '은/는')} ${cnt}개이다.`,
        facts: { value: `(${-u}-${-u}%${s})/${s}` } });
    })
  ];

  // ════════════════════════════════════════════════════════════════
  // 유리함수의 그래프의 성질과 활용
  // ════════════════════════════════════════════════════════════════
  const ruse = [
    T('ruse-fig-coef', '그래프를 보고 유리함수의 계수 구하기', '①24', (d, n) => {
      const p = n === 2 ? pm(d) : nz(d, -3, 3), q = nz(d, -3, 3), k = d.pick([1, 2, 3, 4, 6].map((v) => pm(d) * v));
      let x0 = 0;
      if (k % p !== 0) { x0 = p + d.pick(divisorsOf(k).filter((v) => Math.abs(v) <= 2)); if (x0 === 0) return null; }
      const y0 = q + k / (x0 - p);
      if (Math.abs(y0) > 6 || y0 === q) return null;
      const xr = span([p, x0], 2.5), yr = span([q, y0], 2.5);
      if (xr[1] - xr[0] > 12 || yr[1] - yr[0] > 12) return null;
      const figure = rfig({ x: xr, y: yr, hyps: [{ k, p, q }], points: [{ x: x0, y: y0 }] });
      const facts = (list) => ({ calc: list });
      const kExpr = `(${jn(y0)}-(${jn(q)}))*(${jn(x0)}-(${jn(p)}))`;
      if (n === 0) return vals(`함수 ${yIs(frac(`${Av}${X} + ${Bv}`, `${X} + ${Cv}`))}의 그래프가 그림과 같을 때, 상수 ${Av}, ${Bv}, ${Cv}의 값을 구하시오.`, [[Av, q], [Bv, k - q * p], [Cv, -p]], { figure,
        explain: `점근선이 ${is(X, p)}, ${is(Y, q)}이므로 ${jw(yIs(`${frac(Kv, den(p))} ${sgnT(q)}`), '으로/로')} 놓는다. 점 ${jw(pt(x0, y0), '을/를')} 지나므로 ${is(Kv, k)}이고, ${yIs(stdR(k, p, q))} = ${hypGen(k, p, q)}이다.`,
        facts: facts([[jn(q), 0], [`${kExpr}-(${jn(q)})*(${jn(p)})`, 1], [`0-(${jn(p)})`, 2]]) });
      if (n === 1) return vals(`함수 ${yIs(`${frac(Bv, `${X} + ${Av}`)} + ${Cv}`)}의 그래프가 그림과 같을 때, 상수 ${Av}, ${Bv}, ${Cv}의 값을 구하시오.`, [[Av, -p], [Bv, k], [Cv, q]], { figure,
        explain: `점근선이 ${is(X, p)}, ${is(Y, q)}이므로 ${is(Av, -p)}, ${is(Cv, q)}이다. 점 ${jw(pt(x0, y0), '을/를')} 지나므로 ${is(iq(y0), `${frac(Bv, `${iq(x0)} ${p > 0 ? MINUS : '+'} ${Math.abs(p)}`)} ${sgnT(q)}`)}에서 ${is(Bv, k)}이다.`,
        facts: facts([[`0-(${jn(p)})`, 0], [kExpr, 1], [jn(q), 2]]) });
      // (ax + b)/(cx + 1): 분모의 상수항이 1이 되게 분자·분모에 −1/p 를 곱한다(p = ±1).
      const a = -q * p, b = -(k - q * p) * p, c = -p;
      return vals(`함수 ${yIs(frac(`${Av}${X} + ${Bv}`, `${Cv}${X} + 1`))}의 그래프가 그림과 같을 때, 상수 ${Av}, ${Bv}, ${Cv}의 값을 구하시오.`, [[Av, a], [Bv, b], [Cv, c]], { figure,
        explain: `점근선이 ${is(X, p)}, ${is(Y, q)}이고 점 ${jw(pt(x0, y0), '을/를')} 지나므로 ${yIs(stdR(k, p, q))} = ${hypGen(k, p, q)}이다. 분모의 상수항이 1이 되도록 분자와 분모에 ${jw(iq(-p), '을/를')} 곱하면 ${genR(a, b, c, 1)}이다.`,
        facts: facts([[`0-(${jn(q)})*(${jn(p)})`, 0], [`0-(${kExpr}-(${jn(q)})*(${jn(p)}))*(${jn(p)})`, 1], [`0-(${jn(p)})`, 2]]) });
    }, { count: 3 }),
    T('ruse-pass', '지나는 점과 점근선으로 유리함수의 계수 구하기', '①26', (d, n) => {
      const p = nz(d, -5, 5), q = nz(d, -5, 5), k = nz(d, -8, 8), b = k - q * p;
      if (Math.abs(b) > 30 || b === 0) return null;
      if (n === 0) {
        const u = d.pick(divisorsOf(k)), x0 = p + u, y0 = q + k / u;
        return vals(`함수 ${yIs(frac(`${Av}${X} + ${Bv}`, `${X} + ${Cv}`))}의 그래프가 점 ${jw(pt(x0, y0), '을/를')} 지나고, 점근선의 방정식이 ${is(X, p)}, ${is(Y, q)}일 때, 상수 ${Av}, ${Bv}, ${Cv}의 값을 구하시오.`, [[Av, q], [Bv, b], [Cv, -p]], {
          explain: `${jw(yIs(`${frac(Kv, den(p))} ${sgnT(q)}`), '으로/로')} 놓으면 점 ${jw(pt(x0, y0), '을/를')} 지나므로 ${is(Kv, k)}이다. ${yIs(stdR(k, p, q))} = ${hypGen(k, p, q)}이다.`,
          facts: { calc: [[jn(q), 0], [`(${jn(y0)}-(${jn(q)}))*(${jn(x0)}-(${jn(p)}))-(${jn(q)})*(${jn(p)})`, 1], [`0-(${jn(p)})`, 2]] } });
      }
      // x절편과 두 점근선의 교점
      if (b % q !== 0) return null;
      const r = -b / q;
      return vals(`함수 ${yIs(frac(`${Av}${X} + ${Bv}`, `${X} + ${Cv}`))}의 그래프가 ${X}축과 점 ${pt(r, 0)}에서 만나고, 두 점근선의 교점의 좌표가 ${pt(p, q)}일 때, 상수 ${Av}, ${Bv}, ${Cv}의 값을 구하시오.`, [[Av, q], [Bv, b], [Cv, -p]], {
        explain: `점근선이 ${is(X, p)}, ${is(Y, q)}이므로 ${is(Cv, -p)}, ${is(Av, q)}이다. ${X}축과 점 ${pt(r, 0)}에서 만나므로 ${is(`${iq(q)} × ${iq(r)} + ${Bv}`, 0)}, ${is(Bv, b)}이다.`,
        facts: { calc: [[jn(q), 0], [`0-(${jn(q)})*(${jn(r)})`, 1], [`0-(${jn(p)})`, 2]] } });
    }, { count: 2 }),
    T('ruse-same-asym', '점근선이 같은 두 유리함수', '①26', (d) => {
      const p = nz(d, -6, 6), A = nz(d, -5, 5), k = nz(d, -6, 6), m = d.int(2, 3), c0 = nz(d, -9, 9), B0 = k - A * p;
      const a = -m * p, b = m * A;
      if (B0 === 0 || b * a - c0 * m === 0 || Math.abs(B0) > 30) return null;
      return vals(`두 함수 ${yIs(genR(A, B0, 1, -p))}, ${yIs(frac(`${Bv}${X} ${sgnT(c0)}`, `${m}${X} + ${Av}`))}의 그래프의 점근선이 같을 때, 상수 ${Av}, ${Bv}의 값을 구하시오.`, [[Av, a], [Bv, b]], {
        explain: `첫째 함수의 점근선은 ${is(X, p)}, ${is(Y, A)}이다. 둘째 함수의 점근선은 ${is(X, `${MINUS}${frac(Av, m)}`)}, ${is(Y, frac(Bv, m))}이므로 ${is(Av, a)}, ${is(Bv, b)}이다.`,
        facts: { calc: [[`0-${m}*(${jn(p)})`, 0], [`${m}*(${jn(A)})`, 1]] } });
    }),
    T('ruse-asym-value', '점근선으로 계수를 정해 함숫값 구하기', '심1', (d) => {
      const p = nz(d, -5, 5), q = nz(d, -5, 5), e = nz(d, -6, 6), k = e + q * p, x0 = d.int(-6, 6), v = Q(q * x0 + e, x0 - p);
      if (k === 0 || x0 === p || isInt(v)) return null;
      return numAns(`함수 ${fIs(frac(`${Av}${X} ${sgnT(e)}`, `${X} + ${Bv}`))}의 그래프의 점근선의 방정식이 ${is(X, p)}, ${is(Y, q)}일 때, ${V('f')}(${iq(x0)})의 값은? (단, ${Av}, ${jw(Bv, '은/는')} 상수이다.)`, v, {
        explain: `${frac(`${Av}${X} ${sgnT(e)}`, `${X} + ${Bv}`)}의 점근선은 ${is(X, `${MINUS}${Bv}`)}, ${is(Y, Av)}이므로 ${is(Av, q)}, ${is(Bv, -p)}이다. ${fIs(genR(q, e, 1, -p))}에 ${jw(is(X, x0), '을/를')} 넣으면 ${iq(v)}이다.`,
        facts: { value: `(${jn(q)}*${jn(x0)}+${jn(e)})/(${jn(x0)}-(${jn(p)}))` } });
    }),
    T('ruse-sym-point', '점에 대하여 대칭인 유리함수의 그래프', '①29', (d) => {
      const p = nz(d, -5, 5), q = nz(d, -5, 5), e = nz(d, -9, 9);
      if (e + q * p === 0) return null;
      return vals(`함수 ${yIs(frac(`${Bv}${X} ${sgnT(e)}`, `${X} ${MINUS} ${Av}`))}의 그래프가 점 ${pt(p, q)}에 대하여 대칭일 때, 상수 ${Av}, ${Bv}의 값을 구하시오.`, [[Av, p], [Bv, q]], {
        explain: `${frac(`${Bv}${X} ${sgnT(e)}`, `${X} ${MINUS} ${Av}`)} = ${frac(`${Av}${Bv} ${sgnT(e)}`, `${X} ${MINUS} ${Av}`)} + ${Bv}이므로 점근선은 ${is(X, Av)}, ${is(Y, Bv)}이다. 유리함수의 그래프는 두 점근선의 교점에 대하여 대칭이므로 ${is(Av, p)}, ${is(Bv, q)}이다.`,
        facts: { calc: [[jn(p), 0], [jn(q), 1]] } });
    }),
    T('ruse-sym-line', '유리함수의 그래프의 대칭축이 되는 두 직선', '①30', (d) => {
      const k = nz(d, -6, 6), p = nz(d, -5, 5), q = nz(d, -5, 5), b0 = k - q * p;
      if (Math.abs(b0) > 30 || p + q === 0 || q - p === 0) return null;
      return vals(`함수 ${yIs(hypGen(k, p, q))}의 그래프가 두 직선 ${yIs(`${MINUS}${X} + ${Av}`)}, ${yIs(`${X} + ${Bv}`)}에 대하여 대칭일 때, 상수 ${Av}, ${Bv}의 값을 구하시오.`, [[Av, p + q], [Bv, q - p]], {
        explain: `${toStd(k, p, q)}이므로 두 점근선의 교점은 ${pt(p, q)}이다. 그래프는 이 점을 지나고 기울기가 1, −1인 두 직선에 대하여 대칭이므로 두 직선이 점 ${jw(pt(p, q), '을/를')} 지난다. ${is(iq(q), `${iq(-p)} + ${Av}`)}에서 ${is(Av, p + q)}, ${is(iq(q), `${iq(p)} + ${Bv}`)}에서 ${is(Bv, q - p)}이다.`,
        facts: { calc: [[`${jn(p)}+(${jn(q)})`, 0], [`${jn(q)}-(${jn(p)})`, 1]] } });
    }),
    T('ruse-center-line', '두 점근선의 교점이 직선 위에 있을 때 상수', '①31', (d) => {
      const r1 = d.int(1, 6), r2 = -d.int(1, 6), m = r1 + r2, n0 = -r1 * r2, k = nz(d, -5, 5);
      if (m === 0) return null;
      const tailH = `${m < 0 ? MINUS : '+'} ${poly([[Math.abs(m), Av], [n0, '']])}`;
      return N(`직선 ${jw(yIs(Av + X), '이/가')} 함수 ${fIs(`${(k < 0 ? MINUS : '') + frac(Math.abs(k), `${X} ${MINUS} ${Av}`)} ${tailH}`)}의 그래프의 두 점근선의 교점을 지날 때, 양수 ${Av}의 값은?`, r1, {
        explain: `두 점근선의 교점은 ${pt(Av, poly([[m, Av], [n0, '']]))}이다. 직선 ${yIs(Av + X)} 위에 있으므로 ${is(Av + sup(2), poly([[m, Av], [n0, '']]))}, ${nb(`(${Av} ${sgnT(-r1)})(${Av} ${sgnT(-r2)}) = 0`)}이다. ${jw(Av, '은/는')} 양수이므로 ${is(Av, r1)}이다.`,
        facts: { check: `a^2 = ${m}a + ${n0}, a > 0` } });
    }),
    T('ruse-inverse', '유리함수의 역함수 고르기', '①33', (d) => {
      const a = nz(d, -5, 5), b = nz(d, -6, 6), c = d.pick([1, 1, 2, 3]), e = nz(d, -6, 6);
      if (a * e - b * c === 0 || a === -e) return null;
      const g = (A, Bb, Cc, Dd) => ({ h: genR(A, Bb, Cc, Dd), f: (x) => (A * x + Bb) / (Cc * x + Dd) });
      const right = g(-e, b, c, -a);
      const wrongs = [g(e, b, c, -a), g(-e, b, c, a), g(-a, b, c, -e), g(-e, -b, c, -a), g(a, b, c, e), { h: frac(L(c, -a), L(-e, b)), f: (x) => (c * x - a) / (-e * x + b) }];
      return pickFn(d, `함수 ${yIs(genR(a, b, c, e))}의 역함수는?`, {
        explain: `${yIs(genR(a, b, c, e))}에서 ${jw(X, '을/를')} ${Y}에 대한 식으로 나타내면 ${nb(`(${mono(c, Y)} ${sgnT(-a)})${X} = ${L(-e, b, Y)}`)}, ${is(X, genR(-e, b, c, -a).replace(/<i class="mb-var">x<\/i>/g, Y))}이다. ${jw(X, '과/와')} ${jw(Y, '을/를')} 서로 바꾸면 ${yIs(right.h)}이다.`
      }, right, wrongs);
    }),
    T('ruse-inverse-coef', '역함수의 식이 주어질 때 계수 구하기', '①33', (d, n) => {
      if (n === 0) {
        const m = d.int(2, 4), g = nz(d, -6, 6), h = nz(d, -6, 6), e = nz(d, -6, 6), a = -g, b = h;
        if (a * b - m * e === 0 || h === g) return null;
        return vals(`함수 ${fIs(frac(`${Bv}${X} ${sgnT(e)}`, `${m}${X} + ${Av}`))}의 역함수가 ${nb(`${V('f')}<sup>−1</sup>(${X}) = ${frac(`${term(g, X)} + ${Cv}`, L(m, -h))}`)}일 때, 상수 ${Av}, ${Bv}, ${Cv}의 값을 구하시오.`, [[Av, a], [Bv, b], [Cv, e]], {
          explain: `${yIs(frac(`${Bv}${X} ${sgnT(e)}`, `${m}${X} + ${Av}`))}에서 ${jw(X, '과/와')} ${jw(Y, '을/를')} 바꾸어 풀면 역함수는 ${yIs(frac(`${MINUS}${Av}${X} ${sgnT(e)}`, `${m}${X} ${MINUS} ${Bv}`))}이다. 주어진 식과 비교하면 ${is(`${MINUS}${Av}`, g)}, ${is(Bv, h)}, ${is(Cv, e)}이다.`,
          facts: { calc: [[`0-(${jn(g)})`, 0], [jn(h), 1], [jn(e), 2]] } });
      }
      const A = nz(d, -5, 5), Bb = nz(d, -8, 8), D0 = nz(d, -5, 5);
      if (A * D0 - Bb === 0 || A === -D0) return null;
      return vals(`두 함수 ${fIs(genR(A, Bb, 1, D0))}, ${nb(`${V('g')}(${X}) = ${frac(`${Av}${X} + ${Bv}`, `${X} + ${Cv}`)}`)}에 대하여 ${nb(`(${V('f')} ∘ ${V('g')})(${X}) = ${X}`)}일 때, 상수 ${Av}, ${Bv}, ${Cv}의 값을 구하시오.`, [[Av, -D0], [Bv, Bb], [Cv, -A]], {
        explain: `${nb(`(${V('f')} ∘ ${V('g')})(${X}) = ${X}`)}이므로 ${jw(V('g'), '은/는')} ${V('f')}의 역함수이다. ${yIs(genR(A, Bb, 1, D0))}에서 ${jw(X, '과/와')} ${jw(Y, '을/를')} 바꾸어 풀면 ${yIs(genR(-D0, Bb, 1, -A))}이므로 ${is(Av, -D0)}, ${is(Bv, Bb)}, ${is(Cv, -A)}이다.`,
        facts: { calc: [[`0-(${jn(D0)})`, 0], [jn(Bb), 1], [`0-(${jn(A)})`, 2]] } });
    }, { count: 2 }),
    T('ruse-inverse-asym', '유리함수의 역함수의 그래프의 점근선', '①33', (d) => {
      const k = nz(d, -6, 6), p = nz(d, -5, 5), q = nz(d, -5, 5), b = k - q * p;
      if (p === q || Math.abs(b) > 30) return null;
      return asymAns(`함수 ${yIs(hypGen(k, p, q))}의 역함수의 그래프의 점근선의 방정식을 구하시오.`, q, p, {
        explain: `${toStd(k, p, q)}이므로 그래프의 점근선은 ${is(X, p)}, ${is(Y, q)}이다. 역함수의 그래프는 직선 ${yIs(X)}에 대하여 대칭이므로 점근선도 ${jw(X, '과/와')} ${jw(Y, '이/가')} 바뀌어 ${is(X, q)}, ${is(Y, p)}이다.`,
        facts: { calc: [[jn(q), 0], [jn(p), 1]] } });
    }),
    T('ruse-self-inverse', '자기 자신이 역함수인 유리함수(f = f⁻¹)', '①34', (d, n) => {
      if (n === 0) {
        const A = nz(d, -5, 5), Bb = nz(d, -9, 9);
        if (-A * A - Bb === 0) return null;
        return N(`함수 ${fIs(frac(L(A, Bb), `${X} + ${Av}`))}에 대하여 ${nb(`${V('f')} = ${V('f')}<sup>−1</sup>`)}일 때, 상수 ${Av}의 값은?`, -A, { signed: true,
          explain: `${fIs(frac(L(A, Bb), `${X} + ${Av}`))}의 역함수는 ${yIs(frac(`${MINUS}${Av}${X} ${sgnT(Bb)}`, L(1, -A)))}이다. 두 식이 같으려면 ${is(Av, -A)}이다. (두 점근선의 교점 ${jw(pt(`${MINUS}${Av}`, A), '이/가')} 직선 ${yIs(X)} 위에 있어야 한다.)`,
          facts: { value: `0-(${jn(A)})`, rule: 'self-den' } });
      }
      const D0 = nz(d, -5, 5), Bb = nz(d, -9, 9);
      if (D0 * D0 + Bb === 0) return null;
      return N(`함수 ${fIs(frac(`${Av}${X} ${sgnT(Bb)}`, den(D0)))}의 그래프와 그 역함수 ${nb(`${Y} = ${V('f')}<sup>−1</sup>(${X})`)}의 그래프가 일치할 때, 상수 ${Av}의 값은?`, D0, { signed: true,
        explain: `역함수의 그래프와 일치하면 ${nb(`${V('f')} = ${V('f')}<sup>−1</sup>`)}이다. 점근선이 ${is(X, D0)}, ${is(Y, Av)}이고 그 교점이 직선 ${yIs(X)} 위에 있어야 하므로 ${is(Av, D0)}이다.`,
        facts: { value: jn(D0), rule: 'self-num' } });
    }, { count: 2 }),
    T('ruse-self-inverse-pt', '한 점을 지나고 f = f⁻¹ 인 유리함수의 계수', '①34', (d) => {
      const D0 = nz(d, -5, 5), a = -D0, x0 = d.int(-4, 4), y0 = nz(d, -6, 6), b = y0 * (x0 + D0) - a * x0;
      if (x0 + D0 === 0 || a * D0 - b === 0 || Math.abs(b) > 30) return null;
      return vals(`함수 ${fIs(frac(`${Av}${X} + ${Bv}`, L(1, D0)))}의 그래프가 점 ${jw(pt(x0, y0), '을/를')} 지나고 ${nb(`${V('f')} = ${V('f')}<sup>−1</sup>`)}일 때, 상수 ${Av}, ${Bv}의 값을 구하시오.`, [[Av, a], [Bv, b]], {
        explain: `${nb(`${V('f')} = ${V('f')}<sup>−1</sup>`)}이면 두 점근선의 교점 ${jw(pt(-D0, Av), '이/가')} 직선 ${yIs(X)} 위에 있으므로 ${is(Av, a)}이다. 점 ${jw(pt(x0, y0), '을/를')} 지나므로 ${is(iq(y0), frac(`${iq(a)} × ${par0(x0)} + ${Bv}`, `${iq(x0)} ${D0 < 0 ? MINUS : '+'} ${Math.abs(D0)}`))}에서 ${is(Bv, b)}이다.`,
        facts: { calc: [[`0-(${jn(D0)})`, 0], [`${jn(y0)}*(${jn(x0)}+(${jn(D0)}))+(${jn(D0)})*(${jn(x0)})`, 1]] } });
    }),
    T('ruse-iterate', '자기 자신이 역함수인 유리함수를 거듭 합성한 값', '①35', (d) => {
      const a = nz(d, -3, 3), b = d.int(-4, 4), c = d.int(1, 3), t = d.int(-5, 6);
      if (a * a + b * c === 0 || c * t - a === 0) return null;
      const f1v = Q(a * t + b, c * t - a), total = qadd(qmul(Q(2), f1v), Q(t));
      if (!isInt(total) || Math.abs(total.p) > 60) return null;
      const f = (i) => `${V('f')}<sub>${i}</sub>`;
      return N(`함수 ${nb(`${f(1)}(${X}) = ${genR(a, b, c, -a)}`)}에 대하여 ${nb(`${f(`${Nv}+1`)}(${X}) = (${f(1)} ∘ ${f(Nv)})(${X})`)} (${Nv} = 1, 2, 3, …)로 정의할 때, ${nb(`${f(1)}(${iq(t)}) + ${f(2)}(${iq(t)}) + ${f(3)}(${iq(t)})`)}의 값은?`, total.p, { signed: true,
        explain: `${nb(`${f(1)}(${iq(t)}) = ${iq(f1v)}`)}이고 ${nb(`${f(2)}(${iq(t)}) = ${f(1)}(${iq(f1v)}) = ${iq(t)}`)}, ${nb(`${f(3)}(${iq(t)}) = ${f(1)}(${iq(t)}) = ${iq(f1v)}`)}이다(${jw(f(1), '은/는')} 자기 자신이 역함수이다). 따라서 합은 ${iq(total)}이다.`,
        facts: { value: `2*(${jn(a)}*${jn(t)}+(${jn(b)}))/(${jn(c)}*${jn(t)}-(${jn(a)}))+(${jn(t)})`, derived: [2] } });
    }),
    T('ruse-minmax', '제한된 정의역에서 유리함수의 최댓값과 최솟값', '①36', (d) => {
      const p = nz(d, -4, 4), q = nz(d, -5, 5), k = d.pick([4, 6, 8, 12].map((v) => pm(d) * v)), s = d.int(-5, 4), t = s + d.int(1, 3);
      if (s <= p && p <= t) return null;
      if (k % (s - p) !== 0 || k % (t - p) !== 0) return null;
      const fs = q + k / (s - p), ft = q + k / (t - p), [Mx, mn] = fs > ft ? [fs, ft] : [ft, fs], at = (v) => (v === fs ? s : t), b = k - q * p;
      const ev = (x) => `(${jn(q)}*${jn(x)}+(${jn(b)}))/(${jn(x)}-(${jn(p)}))`;
      return vals(`${nb(`${iq(s)} ≤ ${X} ≤ ${iq(t)}`)}에서 함수 ${yIs(hypGen(k, p, q))}의 최댓값과 최솟값을 구하시오.`, [['최댓값', Mx], ['최솟값', mn]], {
        explain: `${toStd(k, p, q)}이고 주어진 범위는 점근선 ${is(X, p)}의 한쪽에 있으므로, 이 범위에서 ${Y}의 값은 ${k > 0 ? '감소' : '증가'}한다. ${is(X, at(Mx))}일 때 최댓값 ${iq(Mx)}, ${is(X, at(mn))}일 때 최솟값 ${iq(mn)}이다.`,
        facts: { calc: [[ev(at(Mx)), 0], [ev(at(mn)), 1]] } });
    }),
    T('ruse-life', '실생활 속 유리함수의 값', '①41', (d, n) => {
      const B0 = d.pick([90, 99, 100, 120]), r = d.pick([18, 20, 21, 24]), A = r * B0;
      const divs = []; for (let v = B0 + 1; v <= B0 + 200; v += 1) if (A % v === 0) divs.push(v);
      if (!divs.length) return null;
      const s = d.pick(divs), x0 = s - B0, v0 = A / s;
      const head = `깊은 물속에서 일하는 잠수부에게 권장하는 공기 속 산소량의 백분율은 수심 ${X} m에서 ${nb(`${V('f')}(${X}) = ${frac(A, `${X} + ${B0}`)}`)} ${nb(`(0 &lt; ${X} ≤ 200)`)}(%)라고 한다.`;
      if (n === 0) return N(`${head} 수심이 ${x0} m일 때, 권장하는 산소량의 백분율은 몇 %인가?`, v0, { unit: '%',
        explain: `${nb(`${V('f')}(${x0}) = ${frac(A, `${x0} + ${B0}`)} = ${frac(A, s)} = ${v0}`)}이므로 ${v0} %이다.`,
        facts: { value: `${A}/(${x0}+${B0})` } });
      return N(`${head} 권장하는 산소량의 백분율이 ${v0} %일 때, 수심은 몇 m인가?`, x0, { unit: 'm',
        explain: `${is(frac(A, `${X} + ${B0}`), v0)}에서 ${is(`${X} + ${B0}`, s)}, ${is(X, x0)}이다.`,
        facts: { value: `${A}/${v0}-${B0}` } });
    }, { count: 2 }),
    T('ruse-lens', '렌즈의 초점 거리와 도수', '①41', (d) => {
      const [a, c] = d.pick([[2, 1], [3, 1], [2, 3], [4, 1], [3, 2], [4, 3], [5, 2], [3, 4]]), top = a + c, bot = a * c, g = gcd(top, bot);
      return F(`렌즈로부터 ${a} m 앞에 있는 물체의 상이 렌즈로부터 ${X} m 떨어진 곳에 맺힐 때, ${jw(X, '과/와')} 렌즈의 초점 거리 ${Y} m 사이에 ${yIs(frac(`${a}${X}`, `${X} + ${a}`))}인 관계가 있다고 한다. 렌즈의 도수(D)는 초점 거리(m)의 역수로 정할 때, 상이 맺히는 거리가 ${c} m인 렌즈의 도수는 몇 D인가?`, top / g, bot / g, {
        improper: top / g > bot / g, anyForm: true, unit: 'D',
        explain: `${is(X, c)}일 때 ${yIs(frac(`${a} × ${c}`, `${c} + ${a}`))} = ${frac(bot / gcd(bot, top), top / gcd(bot, top))}이므로 초점 거리는 ${frac(bot / g, top / g)} m이고, 도수는 그 역수인 ${frac(top / g, bot / g)} D이다.`,
        facts: { value: `(${a}+${c})/(${a}*${c})` } });
    }),
    T('ruse-model', '상황을 유리함수의 식으로 나타내기', '①42', (d, n) => {
      const ptsPos = [[0.5], [1.5], [2.25], [3.7], [5.2], [7.9]];
      if (n === 0) {
        const t1 = d.pick([20, 30, 40]), v1 = d.pick([60, 72, 90]), v2 = d.pick([50, 70, 80, 100].filter((v) => v !== v1)), dist = v1 * t1 / 60, den1 = 60 / gcd(60, t1), nm1 = t1 / gcd(60, t1);
        // 평균 속력 = (전체 거리)/(전체 시간) = (dist + v2 x)/(t1/60 + x)
        const right = { h: frac(L(v2 * den1, dist * den1), L(den1, nm1)), f: (x) => (dist + v2 * x) / (t1 / 60 + x) };
        const wrongs = [{ h: String((v1 + v2) / 2), f: () => (v1 + v2) / 2 }, { h: frac(L(v2, v1 * t1), L(1, t1)), f: (x) => (v1 * t1 + v2 * x) / (t1 + x) }, { h: frac(L(v2, dist), X), f: (x) => (dist + v2 * x) / x },
          { h: frac(L(v2 * den1, v1 * den1), L(den1, nm1)), f: (x) => (v1 + v2 * x) / (t1 / 60 + x) }, { h: frac(L(v2, dist), L(1, t1)), f: (x) => (dist + v2 * x) / (t1 + x) }];
        return pickFn(d, `자동차가 A 지점에서 B 지점까지 ${t1}분 동안 평균 ${v1} km/h의 속력으로, B 지점에서 C 지점까지 ${X}시간 동안 평균 ${v2} km/h의 속력으로 달렸다. A 지점에서 C 지점까지 자동차의 평균 속력을 ${Y} km/h라 할 때, ${jw(X, '과/와')} ${Y} 사이의 관계식은? ${nb(`(단, ${X} &gt; 0)`)}`,
          { pts: ptsPos, explain: `A 지점에서 B 지점까지 ${v1} × ${frac(nm1, den1)} = ${dist} (km), B 지점에서 C 지점까지 ${v2}${X} (km)를 달렸고 걸린 시간은 모두 ${nb(`${frac(nm1, den1)} + ${X}`)}시간이다. 평균 속력은 (전체 거리) ÷ (전체 시간)이므로 ${yIs(right.h)}이다.` },
          { h: yIs(right.h), f: right.f }, wrongs.map((w) => ({ h: yIs(w.h), f: w.f })));
      }
      if (n === 1) {
        const a = d.pick([20, 25, 30, 40]), b = d.int(Math.ceil(a / 2), a - 3);
        const right = { h: frac(L(1, b), L(1, a)), f: (x) => (b + x) / (a + x) };
        const wrongs = [{ h: frac(L(1, b), a), f: (x) => (b + x) / a }, { h: frac(b, L(1, a)), f: (x) => b / (a + x) }, { h: frac(X, L(1, a)), f: (x) => x / (a + x) }, { h: frac(L(1, a), L(1, b)), f: (x) => (a + x) / (b + x) }, { h: frac(L(1, b), L(2, a)), f: (x) => (b + x) / (a + 2 * x) }];
        return pickFn(d, `어느 농구 선수가 지난 경기까지 자유투를 ${a}번 던져 ${b}번 넣었다. 이번 경기에서 자유투를 ${X}번 던져 모두 넣었을 때, 지금까지의 자유투 성공률을 ${Y}라 하면 ${jw(Y, '을/를')} ${X}에 대한 식으로 나타낸 것은? (성공률은 (넣은 횟수) ÷ (던진 횟수)이다.)`,
          { pts: ptsPos, explain: `던진 횟수는 ${nb(`${a} + ${X}`)}번, 넣은 횟수는 ${nb(`${b} + ${X}`)}번이므로 ${yIs(right.h)}이다.` }, { h: yIs(right.h), f: right.f }, wrongs.map((w) => ({ h: yIs(w.h), f: w.f })));
      }
      const c = d.int(2, 6), K1 = V('k') + '<sub>1</sub>', K2 = V('k') + '<sub>2</sub>';
      const right = { h: frac(`${c}${X}`, L(1, c)), f: (x) => c * x / (x + c) };
      const wrongs = [{ h: frac(L(1, c), `${c}${X}`), f: (x) => (x + c) / (c * x) }, { h: L(1, c), f: (x) => x + c }, { h: frac(`${c}${X}`, L(1, -c)), f: (x) => c * x / (x - c) }, { h: frac(X, L(1, c)), f: (x) => x / (x + c) }, { h: frac(`${c}${X}`, `${c}${X} + 1`), f: (x) => c * x / (c * x + 1) }];
      return pickFn(d, `용수철 상수가 각각 ${K1}, ${K2}인 두 용수철을 이어 붙인 용수철의 용수철 상수 ${jw(Kv, '은/는')} ${jw(nb(`${frac(1, Kv)} = ${frac(1, K1)} + ${frac(1, K2)}`), '을/를')} 만족시킨다고 한다. ${nb(`${K1} = ${c}`)}, ${nb(`${K2} = ${X}`)}일 때의 ${Kv}의 값을 ${V('f')}(${X})라 하면, ${V('f')}(${X})는? ${nb(`(단, ${X} &gt; 0)`)}`,
        { pts: ptsPos, explain: `${nb(`${frac(1, Kv)} = ${frac(1, c)} + ${frac(1, X)} = ${frac(L(1, c), `${c}${X}`)}`)}이므로 ${jw(Kv, '은/는')} 그 역수인 ${right.h}이다.` }, { h: fIs(right.h), f: right.f }, wrongs.map((w) => ({ h: fIs(w.h), f: w.f })));
    }, { count: 3 })
  ];
  function par0(v) { return v < 0 ? `(${iq(v)})` : iq(v); }

  B.addUnit({ id: '10-2-7', grade: 10, semester: 2, no: 7, title: '유리함수와 무리함수', version: 1, groups: [
    { id: 'rexpr', title: '유리식과 유리함수', standard: S4, types: rexpr },
    { id: 'rgraph', title: '유리함수의 그래프', standard: S4, types: rgraph },
    { id: 'ruse', title: '유리함수의 그래프의 성질과 활용', standard: S4, types: ruse },
    { id: 'iexpr', title: '무리식과 무리함수', standard: S5, types: [] },
    { id: 'igraph', title: '무리함수의 그래프', standard: S5, types: [] },
    { id: 'iuse', title: '무리함수의 그래프의 성질과 활용', standard: S5, types: [] }
  ] });
})(typeof window !== 'undefined' ? window : globalThis);
