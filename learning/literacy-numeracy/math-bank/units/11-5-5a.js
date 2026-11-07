// 고등학교 미적분Ⅱ Ⅱ-3 도함수의 활용 — 단원 틀·도구와 앞쪽 묶음(접선의 방정식, 이계도함수와 곡선의 볼록·변곡점).
// 수집해 둔 천재 T셀파 미적분Ⅱ(홍진곤, 2022 개정)의 교과서·평가 자료에서 뽑은 문제 꼴 목록(기본꼴_1: 30꼴, 기본꼴_2: 24꼴, 심화 문서 없음)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/11-5-5/싣기_대조표.md 에 있다.
// (그래프의 개형·최댓값과 최솟값·방정식·부등식·속도와 가속도는 11-5-5b.js 에, 실력 문항은 11-5-5c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번.
// 성취기준: [12미적Ⅱ-02-08] 다양한 곡선의 접선의 방정식 / [12미적Ⅱ-02-09] 함수의 그래프의 개형 / [12미적Ⅱ-02-10] 방정식과 부등식 / [12미적Ⅱ-02-11] 속도와 가속도.
// 은행에서 고2·3 선택 과목은 grade 11, semester 자리에 과목 번호(5 = 미적분Ⅱ)를 둔다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(곡선 위의 점·곡선 밖의 점·기울기·평행·수직·각, 매개변수·음함수·역함수로 나타낸 곡선), 묻는 것(접선·상수·좌표·구간·개수·고르기),
//    함수의 꼴(지수·로그·삼각·무리·유리함수)이 다르면 따로 싣는다. 수만 바꾼 유형은 만들지 않는다.
//  - 11-5-4(여러 가지 미분법)와의 경계: 이계도함수를 구하는 셈(다항함수 포함)과 매개변수·음함수·역함수 곡선의 기울기(dy/dx 의 값)까지는 11-5-4 의 몫이다.
//    접선의 방정식으로 잇는 것, 볼록·변곡점·극값·최댓값과 최솟값의 판정, 방정식·부등식, 평면 위의 운동은 이 단원의 몫이다.
//  - 사용자가 정한 대로 내신 대비이고 「수학 실력에 필요해 보이는 문제는 다 넣는다」. 교육과정의 「지나치게 복잡한 계산을 포함하는 문제는 다루지 않는다」
//    「매개변수로 나타낸 함수와 음함수는 간단한 것만 다룬다」는 정도를 말하는 줄이라 빼는 까닭으로 쓰지 않았다. 학년·과목이 다른 단원(고1 원의 접선,
//    미적분Ⅰ의 다항함수 그래프)과 같은 일도 싣는다.
//  - 답: e·π·근호·ln 이 섞인 값(접선의 y절편, 상수의 경계, 최댓값 따위)과 계수가 분수인 직선은 다섯 보기로 고르게 한다(칸의 모양이 답을 흘리지 않게).
//    계수가 정수인 직선은 「y = [±][ ]x [±][ ]」, 정수·분수 값은 부호 단추가 붙은 칸, 정수 좌표는 coordAns, a√b 는 radAns 로 받는다.
//    개수·길이만 단추 없이 받는다. 원문의 「a + b」「a × m」「M + m」처럼 따로 구한 값을 뜻 없이 더하거나 곱한 꼴은 값을 칸마다 따로 받는다.
//    원문 답이 늘 같은 꼴(교점7·기말4 의 π/4)은 수를 바꾸어 답이 달라지게 지었다.
//  - 답은 모두 코드가 셈한다. 고르기의 참·거짓도 값을 셈해서 가린다. 수 칸의 검사 근거는 문제에 적힌 수로 다시 셈하는 식(facts.calc·value)이고,
//    글에 없는 수(접점의 x좌표처럼 풀이 도중에 나오는 수)는 seal 이 facts.unseen 에 밝힌다(derived). 개수처럼 식으로 다시 셀 수 없는 칸은
//    facts.check 에 셈의 바탕을 적고 _work 의 따로 지은 풀이로 맞춰 보았다.
//
// 뺀 것과 까닭(11-5-5b.js, 11-5-5c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 같은 과목의 다른 단원(11-5-4 여러 가지 미분법) 몫: ①12(여러 가지 함수의 이계도함수 구하기), ①13(다항함수의 이계도함수), ①11 의 변형
//    (교대12 — 역함수의 그래프 위의 점에서 접선의 기울기만 묻기), ①14(f″(a)의 값 — 11-5-4 second-value 와 겹침),
//    ①15(극한으로 준 f′(a)·f″(a) — 11-5-4 hard-second-limit 과 겹침).
//  - 서술형만으로 묻는 것: ①24 의 2(접선이 곡선의 아래쪽에 있음을 증명), ②11(부등식의 증명 — 최솟값을 묻는 꼴로 바꾸면 ②13 과 같은 일),
//    ②12(앞 단계의 결과를 이어 쓰는 증명 — 빈칸·고르기로 낸 원문이 없다).
//  - 바꾼 것: ①25 개형 그리기 → 개형 고르기, ②10 기말19 의 f′(x) = x sin x → f(x) 를 식으로 준다(부분적분은 11-5-6 의 몫), ①24 의 1 → 빈칸을 차례로 나열한 것 고르기.
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」 문자를 부르는 말: 값 하나를 물으면 「상수 a」, 범위·최댓값·최솟값을 물으면 「실수 a」.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, N, M, C, inline } = B.kit;
  const { LAB, MINUS, Q, qadd, qmul, nb, V, sup, nz, poly, grp, rt } = B.kit.mid;
  const { ms, jh, df, ln, trig, pw, plot, qAns, coordAns, signed } = B.kit.hs;
  const S8 = '12미적Ⅱ-02-08', S9 = '12미적Ⅱ-02-09', S10 = '12미적Ⅱ-02-10', S11 = '12미적Ⅱ-02-11';
  const X = V('x'), Y = V('y'), Tv = V('t'), Av = V('a'), Bv = V('b'), Kv = V('k'), Fv = V('f'), E = V('e'), PI = 'π', INF = '∞';
  const FP = df('f'), FPP = df('f', 2);

  // ── 검사 근거 마무리 ──
  const stripH = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  function visibleNumbers(item) {
    const seen = stripH([item.text, item.figure || ''].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, ' $1 ').replace(/<table[^>]*aria-label="([^"]*)"[^>]*>/g, ' $1 | '));
    return new Set((seen.match(/\d+/g) || []).concat(seen.match(/\d+\.\d+/g) || [], seen.replace(/(\d) (?=\d)/g, '$1').match(/\d+/g) || []));
  }
  // 다시 셈하는 식의 수 가운데 글에 보이지 않는 수를 facts.unseen 에 밝힌다. 0, 1 과 facts.derived 로 밝히기로 한 수(풀이 도중에 나오는 수, 지수의 셈에 쓰는 2·3 따위)만 된다.
  function seal(item) {
    const f = item.facts || {};
    if (f.calc) f.calc = f.calc.map(([t, i]) => [`(${t})+0`, i]);   // −0 이 나오지 않게(검사는 −0과 0을 가른다)
    const derived = new Set((f.derived || []).map((v) => Math.abs(Number(v))).concat([0, 1])), shown = visibleNumbers(item), out = new Set(f.unseen || []);
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

  // ── 유리수 ──
  const near = (u, v) => Math.abs(u - v) < 1e-9 * Math.max(1, Math.abs(u), Math.abs(v));
  function toQ(v) { for (let q = 1; q <= 400; q += 1) { const p = Math.round(v * q); if (Math.abs(v * q - p) < 1e-7) return Q(p, q); } throw new Error('유리수로 적을 수 없는 값: ' + v); }
  const isInt = (v) => Math.abs(v - Math.round(v)) < 1e-9;
  // 화면 글: −3, 5/2(세로 분수)
  const qt = (v) => { const q = typeof v === 'number' ? toQ(v) : v; return q.q === 1 ? signed(q.p) : nb((q.p < 0 ? MINUS : '') + frac(Math.abs(q.p), q.q)); };
  // 검사 식 글: 음수는 괄호, 분수는 (p/q)
  const jq = (v) => { const q = typeof v === 'number' ? toQ(v) : v; const body = q.q === 1 ? String(Math.abs(q.p)) : `${Math.abs(q.p)}/${q.q}`; return q.p < 0 ? `(-${body})` : q.q === 1 ? body : `(${body})`; };
  const qj = (v, pair) => jh(qt(v), pair);
  const par = (v) => (v < 0 ? `(${qt(v)})` : qt(v));
  const times = (e, k) => Array(k).fill(e).join('*');

  // ── 무리수·초월수가 섞인 값: 밑(1, eᵏ, π, √n, ln n …)의 유리수배를 더한 꼴 { t: [{ c 유리수, b 밑, k 이름 }], v 값 } ──
  const BASES = {};
  function base(key) {
    if (typeof key === 'object') return key;
    if (BASES[key]) return BASES[key];
    let b, m;
    if (key === '1') b = { h: '', v: 1 };
    else if (key === 'pi') b = { h: PI, v: Math.PI };
    else if (key === 'pi^-1') b = { den: PI, v: 1 / Math.PI };
    else if ((m = /^e\^(-?\d+)(?:\/(\d+))?$/.exec(key))) {
      const p = Number(m[1]), q = Number(m[2] || 1), v = Math.E ** (p / q), up = q === 1 ? (Math.abs(p) === 1 ? E : pw('e', Math.abs(p))) : pw('e', [Math.abs(p), q]);
      b = p < 0 ? { den: up, v } : { h: up, v };
    } else if ((m = /^r(\d+)$/.exec(key))) b = { h: rt(Number(m[1])), v: Math.sqrt(Number(m[1])) };
    else if ((m = /^r(\d+)pi$/.exec(key))) b = { h: rt(Number(m[1])) + PI, v: Math.sqrt(Number(m[1])) * Math.PI };
    else if ((m = /^ln(\d+)$/.exec(key))) b = { h: ln(Number(m[1])), v: Math.log(Number(m[1])) };
    else if (key === 'sqe') b = { h: rt(E), v: Math.sqrt(Math.E) };
    else if (key === 'esqe') b = { h: E + rt(E), v: Math.E ** 1.5 };
    else throw new Error('모르는 밑: ' + key);
    BASES[key] = b;
    return b;
  }
  const keyOf = (key) => (key == null ? '1' : key === 'e' ? 'e^1' : typeof key === 'object' ? key.key : /^e\^0$/.test(key) ? '1' : key);
  const term = (c, key) => ({ c: typeof c === 'number' ? toQ(c) : c, b: key && typeof key === 'object' ? key : base(keyOf(key)), k: keyOf(key) });
  function num(...ts) {
    const merged = [];
    for (const x of ts.flat(4)) { if (!x) continue; const same = merged.find((y) => y.k === x.k); if (same) same.c = qadd(same.c, x.c); else merged.push({ c: x.c, b: x.b, k: x.k }); }
    const t = merged.filter((x) => x.c.p !== 0);
    return { t, v: t.reduce((s, x) => s + (x.c.p / x.c.q) * x.b.v, 0) };
  }
  const R = (v) => num(term(v));                                           // 유리수 하나
  const one = (c, key) => num(term(c, key));                               // 항 하나
  const neg = (a) => num(a.t.map((x) => ({ c: Q(-x.c.p, x.c.q), b: x.b, k: x.k })));
  const scl = (a, r) => { const q = typeof r === 'number' ? toQ(r) : r; return num(a.t.map((x) => ({ c: qmul(x.c, q), b: x.b, k: x.k }))); };
  const add = (...xs) => (xs.some((x) => !x) ? null : num(xs.map((x) => x.t)));
  const sub = (a, b) => (a && b ? add(a, neg(b)) : null);
  const MULK = { 'r3*pi': 'r3pi', 'pi*r3': 'r3pi', 'r2*pi': 'r2pi', 'pi*r2': 'r2pi' };
  function mulK(k1, k2) {
    if (k1 === '1') return k2; if (k2 === '1') return k1;
    if (MULK[k1 + '*' + k2]) return MULK[k1 + '*' + k2];
    const m1 = /^e\^(-?\d+)$/.exec(k1), m2 = /^e\^(-?\d+)$/.exec(k2);
    if (m1 && m2) { const s = Number(m1[1]) + Number(m2[1]); return s === 0 ? '1' : 'e^' + s; }
    return null;
  }
  function mul(a, b) {
    if (!a || !b) return null;
    const out = [];
    for (const x of a.t) for (const y of b.t) { const k = mulK(x.k, y.k); if (k == null) return null; out.push(term(qmul(x.c, y.c), k)); }
    return num(out);
  }
  // 항의 크기(부호를 뗀 글)
  const termAbs = (x) => {
    const p = Math.abs(x.c.p), q = x.c.q, b = x.b;
    if (b.den) return frac(String(p), (q === 1 ? '' : q) + b.den);
    if (!b.h) return q === 1 ? String(p) : frac(p, q);
    const top = (p === 1 ? '' : p) + b.h;
    return q === 1 ? top : frac(top, q);
  };
  const numH = (a) => (!a.t.length ? '0' : nb(a.t.map((x, i) => (i === 0 ? (x.c.p < 0 ? MINUS : '') : x.c.p < 0 ? ` ${MINUS} ` : ' + ') + termAbs(x)).join('')));
  const tailH = (a) => a.t.map((x) => (x.c.p < 0 ? ` ${MINUS} ` : ' + ') + termAbs(x)).join('');          // 앞 항 뒤에 잇는 글
  // 문자 앞에 곱하는 수: 1 은 적지 않고 −1 은 −만, 여러 항이면 괄호로 묶는다.
  function coefH(a) {
    if (a.t.length !== 1) return `(${numH(a)})`;
    const x = a.t[0], s = x.c.p < 0 ? MINUS : '';
    if (!x.b.h && !x.b.den) return x.c.q === 1 && Math.abs(x.c.p) === 1 ? s : s + termAbs(x);
    return s + termAbs(x);
  }
  const toNum = (v) => (typeof v === 'number' ? R(v) : v);
  const lineH = (m, k) => (m.t.length ? nb(`${Y} = ${coefH(m)}${X}${tailH(k)}`) : nb(`${Y} = ${numH(k)}`));
  const ptH = (x, y) => nb(`(${numH(toNum(x))}, ${numH(toNum(y))})`);
  const ptS = (x, y) => nb(`(${typeof x === 'string' ? x : numH(toNum(x))}, ${typeof y === 'string' ? y : numH(toNum(y))})`);   // 문자가 든 좌표
  const fracOf = (s) => { const [p, q] = String(s).split('/').map(Number); return p / (q || 1); };
  // 값을 √n 의 유리수배로(n = 1, 3, 2) — 아니면 null
  const asSurd = (v) => { for (const [k, w] of [['1', 1], ['r3', Math.sqrt(3)], ['r2', Math.sqrt(2)]]) { try { return one(toQ(v / w), k); } catch (e) { /* 다음 밑 */ } } return null; };
  // 점 (x0, y0)을 지나고 기울기가 m 인 직선: y = m(x − x0) + y0
  const psH = (m, x0, y0) => nb(`${Y} = ${coefH(m)}${x0.t.length ? `(${X}${tailH(neg(x0))})` : X}${tailH(y0)}`);

  // ── 다항식(오름차순 계수의 배열: [상수항, x의 계수, x²의 계수, …]) ──
  const pz = (a) => { const out = a.slice(); while (out.length > 1 && near(out[out.length - 1], 0)) out.pop(); return out; };
  const pval = (a, x) => a.reduce((s, c, i) => s + c * x ** i, 0);
  const pder = (a) => (a.length < 2 ? [0] : pz(a.slice(1).map((c, i) => c * (i + 1))));
  const ptext = (a, v) => poly(a.map((c, i) => [toQ(c), i === 0 ? '' : (v || X) + (i > 1 ? sup(i) : '')]).reverse());
  const pjs = (a, e) => a.map((c, i) => (near(c, 0) ? '' : i === 0 ? jq(c) : `${jq(c)}*${times(e, i)}`)).filter(Boolean).join('+') || '0';
  const lin = (a, b, v) => poly([[a, v || X], [b, '']]);
  const yIs = (h) => nb(`${Y} = ${h}`);
  const fIs = (h, name, v) => nb(`${V(name || 'f')}(${v || X}) = ${h}`);
  const is = (l, r) => nb(`${l} = ${typeof r === 'number' ? qt(r) : r}`);
  const ePow = (h) => pw('e', h);                                         // e 의 거듭제곱(지수는 그린 글)
  const piOver = (p, q) => numH(one(Q(p, q), 'pi'));                     // pπ/q
  // 구간 글: 끝을 ±∞ 로 줄 수 있다.
  const endH = (v) => (v === Infinity ? INF : v === -Infinity ? MINUS + INF : typeof v === 'number' ? qt(v) : numH(v));
  const ivH = (a, b, closed) => nb(`${closed ? '[' : '('}${endH(a)}, ${endH(b)}${closed ? ']' : ')'}`);

  // ── 답 ──
  // 직선 「y = [±][ ]x [±][ ]」 — 기울기와 y절편은 정수(y절편 0 도 된다)
  const lineAns = (text, m, k, o) => inline(text, grp(`${Y} = {0}${X} {1}`), [{ answer: m, signed: true }, { answer: k, signed: true }], Object.assign({}, o, { shown: lineH(R(m), R(k)) }));
  // 문자의 값 여럿: 「a = [±][ ]  b = [±][ ]」(셋째 원소가 참이면 부호 단추 없이)
  const vals = (text, pairs, o) => M(text, pairs.map(([lead, answer, bare]) => ({ lead: lead + ' =', answer, signed: !bare })), Object.assign({}, o, { shown: pairs.map(([lead, answer]) => is(lead, answer)).join(', ') }));
  const numAns = (text, v, o) => qAns(text, v, Object.assign({ signed: true }, o));

  // ── 고르기 ──
  const sameV = (a, b) => a.length === b.length && a.every((v, i) => near(v, b[i]));
  // 보기 다섯(정답 포함): 값(key)이 서로 다르고 글도 서로 다르다. o.n 으로 보기 수를 바꾼다.
  function pickBy(d, text, right, wrongs, keyF, show, o) {
    const opt = Object.assign({}, o), want = opt.n || 5; delete opt.n;
    const keep = [right];
    for (const w of d.shuffle(wrongs.filter(Boolean))) if (keep.length < want && keep.every((k) => !sameV(keyF(k), keyF(w)) && stripH(show(k)) !== stripH(show(w)))) keep.push(w);
    if (keep.length < want) return null;
    const rows = d.shuffle(keep), at = rows.indexOf(right);
    return C(text, rows.map(show), at, Object.assign(opt, { facts: Object.assign({ truth: rows.map((r) => r === right), want: true }, (o && o.facts) || {}) }));
  }
  const okLine = (l) => l && l.m && l.k;
  const lineChoice = (d, text, right, wrongs, o) => pickBy(d, text, right, wrongs.filter(okLine), (l) => [l.m.v, l.k.v], (l) => lineH(l.m, l.k), o);
  const numChoice = (d, text, right, wrongs, o) => pickBy(d, text, right, wrongs, (a) => [a.v], numH, o);
  const ptChoice = (d, text, right, wrongs, o) => pickBy(d, text, right, wrongs.filter((p) => p && p.x && p.y), (p) => [p.x.v, p.y.v], (p) => ptH(p.x, p.y), o);
  // 글 보기: 같은 글은 하나만 남긴다.
  const textChoice = (d, text, right, wrongs, o) => pickBy(d, text, right, wrongs, (s) => [stripH(s).length, [...stripH(s)].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) % 1000003, 7)], (s) => s, o);
  // 접선 y = m(x − x0) + y0 의 흔한 잘못
  function tanWrongs(m, x0, y0) {
    const L = (mm, kk) => (mm && kk ? { m: mm, k: kk } : null), mx0 = mul(m, x0), k = sub(y0, mx0), m2 = scl(m, 2), mh = scl(m, Q(1, 2));
    return [L(m, k && neg(k)), L(m, add(y0, mx0)), L(m, y0), L(neg(m), add(y0, mx0)), L(neg(m), k), L(m2, sub(y0, mul(m2, x0))), L(mh, sub(y0, mul(mh, x0))), L(m, sub(neg(y0), mx0))];
  }
  // ㄱ, ㄴ, ㄷ 가운데 옳은 것을 「있는 대로 고른 것」
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
  // 보기 그림: 기호와 그림을 나란히
  const figOpt = (lab, fig) => `<span style="display:inline-flex;align-items:flex-start;gap:6px"><span style="font-weight:700">${lab}</span>${fig}</span>`;
  // 증감표: cols 는 [x 칸 글, f′ 칸 글, f 칸 글] 의 배열(가로로 늘어놓는다). 휴대폰 너비를 넘지 않게 칸은 다섯 개 안팎으로.
  const TD = 'style="padding:5px 8px"';
  function udTable(cols, said, rows) {
    const heads = rows || [X, `${FP}(${X})`, `${Fv}(${X})`];
    return `<div class="mb-table-wrap"><table class="mb-table" aria-label="${said}"><tbody>${heads.map((h, r) => `<tr><th ${TD}>${h}</th>${cols.map((c) => `<td ${TD}>${c[r]}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }
  // 작은 그래프(보기 그림): 눈금 없이 축과 곡선만
  const mini = (f, xr, yr, o) => { const opt = o || {}, w = opt.w || 122, h = opt.h || 86, ux = (w - 46) / (xr[1] - xr[0]); return plot({ x: xr, y: yr, w, ys: h / ((yr[1] - yr[0]) * ux), curves: [{ f }] }); };

  // 삼각함수의 값(특수각 kπ/12): [sin, cos] 을 값으로
  const SC = {
    '1/6': [R(0.5), one(Q(1, 2), 'r3')], '1/3': [one(Q(1, 2), 'r3'), R(0.5)], '1/2': [R(1), R(0)], '2/3': [one(Q(1, 2), 'r3'), R(-0.5)], '5/6': [R(0.5), one(Q(-1, 2), 'r3')],
    '1': [R(0), R(-1)], '1/4': [one(Q(1, 2), 'r2'), one(Q(1, 2), 'r2')], '3/4': [one(Q(1, 2), 'r2'), one(Q(-1, 2), 'r2')]
  };
  const angKey = (q) => (q.q === 1 ? String(q.p) : q.p + '/' + q.q);

  B.kit.u55x = {
    S8, S9, S10, S11, X, Y, Tv, Av, Bv, Kv, Fv, E, PI, INF, FP, FPP, stripH, seal, retry, T, H, near, toQ, isInt, qt, jq, qj, par, times,
    base, term, num, R, one, neg, scl, add, sub, mul, termAbs, numH, tailH, coefH, toNum, lineH, ptH, ptS, fracOf, asSurd, psH,
    pz, pval, pder, ptext, pjs, lin, yIs, fIs, is, ePow, piOver, endH, ivH,
    lineAns, vals, numAns, sameV, pickBy, lineChoice, numChoice, ptChoice, textChoice, tanWrongs, GA, comboPick, figOpt, udTable, mini, SC, angKey
  };

  // ════════════════════════════════════════════════════════════════
  // 접선의 방정식
  // ════════════════════════════════════════════════════════════════
  // 접선의 풀이 줄: f(x) = …, f′(x) = … 이고 점 (x0, y0)에서의 기울기 m → 접선
  const tanTold = (fH, dH, x0, y0, m) => `${jh(fIs(fH), '이라/라')} 하면 ${FP}(${X}) = ${dH}이므로 점 ${ptH(x0, y0)}에서의 접선의 기울기는 ${FP}(${numH(x0)}) = ${jh(numH(m), '이다/이다')}. 따라서 접선의 방정식은 ${x0.t.length ? `${psH(m, x0, y0)}, 곧 ` : ''}${lineH(m, sub(y0, mul(m, x0)))}이다.`;

  const tan = [
    T('tan-point', '곡선 위의 한 점에서의 접선의 방정식', '①1', (d, n) => {
      if (n === 0) {
        // 지수·로그·유리·무리함수 — 기울기와 y절편이 정수
        const fam = d.int(0, 3);
        if (fam === 0) {
          const a = d.pick([-3, -2, -1, 1, 2, 3]), x0 = nz(d, -3, 3), b = -a * x0, k = 1 - a * x0;
          if (!k) return null;
          const ex = ePow(lin(a, b)), x0n = R(x0), y0n = R(1), m = R(a);
          return lineAns(`곡선 ${yIs(ex)} 위의 점 ${ptH(x0, 1)}에서의 접선의 방정식은?`, a, k, {
            explain: tanTold(ex, `${coefH(m)}${ex}`, x0n, y0n, m), facts: { calc: [[jq(a), 0], [`1-${jq(a)}*${jq(x0)}`, 1]] } });
        }
        if (fam === 1) {
          const a = d.pick([-2, -1, 1, 2, 3]), x0 = nz(d, -3, 3), b = 1 - a * x0, k = -a * x0;
          const inner = lin(a, b), fH = ln(`(${inner})`), m = R(a);
          return lineAns(`곡선 ${yIs(fH)} 위의 점 ${ptH(x0, 0)}에서의 접선의 방정식은?`, a, k, {
            explain: tanTold(fH, `${a < 0 ? MINUS : ''}${frac(Math.abs(a), inner)}`, R(x0), R(0), m), facts: { calc: [[jq(a), 0], [`0-${jq(a)}*${jq(x0)}`, 1]] } });
        }
        if (fam === 2) {
          // y = K/(x + c), x0 + c = s
          const s = d.pick([-2, -1, 1, 2]), t = nz(d, -3, 3), K = s * s * t, x0 = nz(d, -3, 3), c = s - x0, y0 = s * t, m = -t, k = y0 - m * x0;
          if (!c || !k) return null;
          const den = lin(1, c), fH = `${K < 0 ? MINUS : ''}${frac(Math.abs(K), den)}`;
          return lineAns(`곡선 ${yIs(fH)} 위의 점 ${ptH(x0, y0)}에서의 접선의 방정식은?`, m, k, {
            explain: tanTold(fH, `${K > 0 ? MINUS : ''}${frac(Math.abs(K), `(${den})${sup(2)}`)}`, R(x0), R(y0), R(m)),
            facts: { calc: [[`0-${jq(K)}/((${jq(x0)}+${jq(c)})*(${jq(x0)}+${jq(c)}))`, 0], [`${jq(y0)}+${jq(K)}/((${jq(x0)}+${jq(c)})*(${jq(x0)}+${jq(c)}))*${jq(x0)}`, 1]] } });
        }
        // y = √(ax + b), a·x0 + b = s², 기울기 a/(2s) = m
        const s = d.pick([1, 2, 3]), m = d.pick([1, 2]) * d.pick([1, -1]), a = 2 * s * m, x0 = nz(d, -3, 3), b = s * s - a * x0, k = s - m * x0;
        if (!k || Math.abs(b) > 30) return null;
        const inner = lin(a, b), fH = rt(inner);
        return lineAns(`곡선 ${yIs(fH)} 위의 점 ${ptH(x0, s)}에서의 접선의 방정식은?`, m, k, {
          explain: tanTold(fH, `${a < 0 ? MINUS : ''}${frac(Math.abs(a), `2${rt(inner)}`)}`, R(x0), R(s), R(m)), facts: { calc: [[`${jq(a)}/(2*${s})`, 0], [`${s}-${jq(a)}/(2*${s})*${jq(x0)}`, 1]], derived: [2] } });
      }
      // 삼각·로그·지수함수 — y절편에 π·근호·e 가 섞인다: 다섯 보기
      const fam = d.int(0, 4);
      let fH, dH, x0, y0, m;
      if (fam === 0) {
        const A = d.pick([1, 2]), kind = d.pick(['sin', 'cos']), ang = d.pick(['1/6', '1/3', '2/3', '5/6', '1', '1/4', '3/4']), [sv, cv] = SC[ang];
        y0 = scl(kind === 'sin' ? sv : cv, A); m = scl(kind === 'sin' ? cv : neg(sv), A);
        if (!m.t.length) return null;
        const q = toQ(fracOf(ang)); x0 = one(q, 'pi');
        fH = (A === 1 ? '' : A) + trig(kind, X); dH = kind === 'sin' ? (A === 1 ? '' : A) + trig('cos', X) : MINUS + (A === 1 ? '' : A) + trig('sin', X);
      } else if (fam === 1) {
        const j = d.pick([1, 2, 3]); x0 = one(1, 'e^' + j); y0 = R(j * j); m = one(2 * j, 'e^-' + j);
        fH = `(${ln(X)})${sup(2)}`; dH = frac(`2${ln(X)}`, X);
      } else if (fam === 2) {
        const a = d.pick([-2, -1, 2, 3]), b = d.pick([-1, 1, 2]); x0 = R(0); y0 = one(1, 'e^' + b); m = one(a, 'e^' + b);
        fH = ePow(lin(a, b)); dH = `${a === -1 ? MINUS : signed(a)}${fH}`;
      } else if (fam === 3) {
        const A = d.pick([1, 2]), b = d.pick([1, 2]), at = d.pick([1, -1]); x0 = one(Q(at, 4 * b), 'pi'); y0 = R(A * at); m = R(2 * A * b);
        fH = (A === 1 ? '' : A) + trig('tan', b === 1 ? X : b + X); dH = `${A * b === 1 ? '' : A * b}${trig('sec', b === 1 ? X : b + X, 2)}`;
      } else {
        const j = d.pick([1, 2]), sq = d.bool();
        if (sq) { x0 = one(1, 'e^' + j); y0 = one(j, 'e^' + 2 * j); m = one(2 * j + 1, 'e^' + j); fH = `${X}${sup(2)} ${ln(X)}`; dH = `2${X} ${ln(X)} + ${X}`; }
        else { x0 = one(1, 'e^' + j); y0 = one(j, 'e^' + j); m = R(j + 1); fH = `${X} ${ln(X)}`; dH = `${ln(X)} + 1`; }
      }
      const right = { m, k: sub(y0, mul(m, x0)) };
      const extra = [{ m: right.k, k: m }, { m, k: add(right.k, R(1)) }, { m: add(m, R(1)), k: right.k }, { m: scl(m, -1), k: scl(right.k, -1) }];
      return lineChoice(d, `곡선 ${yIs(fH)} 위의 점 ${ptH(x0, y0)}에서의 접선의 방정식은?`, right, tanWrongs(m, x0, y0).concat(extra), { explain: tanTold(fH, dH, x0, y0, m) });
    }, { count: 2, standard: S8 }),

    T('tan-slope', '기울기가 주어진 접선의 방정식', '①2', (d, n) => {
      if (n === 0) {
        if (d.bool()) {
          // y = √(ax + b) 에 접하고 기울기가 m: √(ax0 + b) = a/(2m) = s
          const s = d.pick([1, 2, 3]), m = d.pick([1, 2, 3]), a = 2 * s * m, x0 = nz(d, -3, 3), b = s * s - a * x0, k = s - m * x0;
          if (!k || a > 12 || Math.abs(b) > 30) return null;
          const inner = lin(a, b);
          return lineAns(`곡선 ${yIs(rt(inner))}에 접하고 기울기가 ${jh(String(m), '인/인')} 직선의 방정식은?`, m, k, {
            explain: `접점의 ${X}좌표를 ${jh(Tv, '이라/라')} 하면 ${is(`${Y}′`, frac(a, `2${rt(inner)}`))}이므로 ${is(frac(a, `2${rt(lin(a, b, Tv))}`), m)}에서 ${is(rt(lin(a, b, Tv)), s)}, 곧 ${is(Tv, x0)}이다. 접점은 ${ptH(x0, s)}이므로 접선은 ${psH(R(m), R(x0), R(s))}, 곧 ${lineH(R(m), R(k))}이다.`,
            facts: { calc: [[jq(m), 0], [`${jq(a)}/(2*${m})-${m}*((${jq(a)}/(2*${m}))*(${jq(a)}/(2*${m}))-${jq(b)})/${jq(a)}`, 1]], derived: [2] } });
        }
        // y = e^{a(x − p)} + c 에 접하고 기울기가 a
        const a = d.pick([-3, -2, 2, 3]), p = nz(d, -2, 2), c = nz(d, -4, 4), k = 1 + c - a * p;
        if (!k) return null;
        const fH = `${ePow(lin(a, -a * p))} ${c < 0 ? MINUS : '+'} ${Math.abs(c)}`;
        return lineAns(`곡선 ${yIs(fH)}에 접하고 기울기가 ${qj(a, '인/인')} 직선의 방정식은?`, a, k, {
          explain: `접점의 ${X}좌표를 ${jh(Tv, '이라/라')} 하면 ${is(`${Y}′`, `${signed(a)}${ePow(lin(a, -a * p))}`)}이므로 ${is(`${signed(a)}${ePow(lin(a, -a * p, Tv))}`, a)}에서 ${is(ePow(lin(a, -a * p, Tv)), 1)}, 곧 ${is(Tv, p)}이다. 접점은 ${ptH(p, 1 + c)}이므로 접선은 ${psH(R(a), R(p), R(1 + c))}, 곧 ${lineH(R(a), R(k))}이다.`,
          facts: { calc: [[jq(a), 0], [`1+${jq(c)}-${jq(a)}*(${jq(-a * p)})/(0-${jq(a)})`, 1]] } });
      }
      // 삼각함수와 정의역의 제한 — 접점이 하나로 정해진다
      const A = d.pick([1, 2, 3]), b = d.pick([1, 2]), c = d.pick([0, 0, 1]), kind = d.pick(['sin', 'cos']), arg = b === 1 ? X : b + X;
      let m, x0, y0, dom, dH, told;
      const Ah = A === 1 ? '' : String(A);
      if (kind === 'sin') {
        const eps = d.pick([1, -1]); m = R(eps * A * b / 2 + c); x0 = one(Q(eps > 0 ? 1 : 2, 3 * b), 'pi'); y0 = add(one(Q(A, 2), 'r3'), scl(x0, c));
        dom = `0 ≤ ${X} ≤ ${b === 1 ? PI : frac(PI, b)}`; dH = `${A * b === 1 ? '' : A * b}${trig('cos', arg)}${c ? ' + 1' : ''}`;
        told = `${trig('cos', b === 1 ? Tv : b + Tv)} = ${eps > 0 ? frac(1, 2) : MINUS + frac(1, 2)}`;
      } else {
        m = R(c - A * b / 2); x0 = one(Q(1, 6 * b), 'pi'); y0 = add(one(Q(A, 2), 'r3'), scl(x0, c));
        dom = `0 ≤ ${X} ≤ ${frac(PI, 2 * b)}`; dH = `${MINUS}${A * b === 1 ? '' : A * b}${trig('sin', arg)}${c ? ' + 1' : ''}`;
        told = `${trig('sin', b === 1 ? Tv : b + Tv)} = ${frac(1, 2)}`;
      }
      if (!m.t.length) return null;
      const fH = `${Ah}${trig(kind, arg)}${c ? ' + ' + X : ''}`, right = { m, k: sub(y0, mul(m, x0)) };
      const other = kind === 'sin' ? one(Q(near(m.v, (A * b) / 2 + c) ? 2 : 1, 3 * b), 'pi') : one(Q(5, 6 * b), 'pi');   // 다른 각·정의역 밖의 근(잘못)
      const oy = kind === 'sin' ? add(one(Q(A, 2), 'r3'), scl(other, c)) : add(one(Q(-A, 2), 'r3'), scl(other, c));
      return lineChoice(d, `곡선 ${yIs(fH)} (${dom})에 접하고 기울기가 ${jh(numH(m), '인/인')} 직선의 방정식은?`, right, tanWrongs(m, x0, y0).concat([{ m, k: sub(oy, mul(m, other)) }]), {
        explain: `접점의 ${X}좌표를 ${jh(Tv, '이라/라')} 하면 ${is(`${Y}′`, dH)}이므로 ${is(`${Y}′`, numH(m))}에서 ${told}이다. ${dom}에서 ${is(Tv, numH(x0))}이고 접점은 ${ptH(x0, y0)}이므로 접선은 ${psH(m, x0, y0)}, 곧 ${lineH(m, right.k)}이다.` });
    }, { count: 2, standard: S8 }),

    T('tan-cond', '평행·수직·기울어진 각으로 기울기를 준 접선', '①3', (d, n) => {
      if (n === 0) {
        if (d.bool()) {
          // y = √(x² + c²) (x > 0) 에 접하고 직선 px − qy + r = 0 에 평행: 기울기 p/q
          const [p, q, xs, ys] = d.pick([[4, 5, 4, 3], [3, 5, 3, 4]]), t = d.pick([1, 2]), cc = ys * t, x0 = xs * t, y0 = 5 * t, r0 = nz(d, -6, 6);
          const m = R(p / q), k = R(y0 - p / q * x0);
          if (near(k.v, r0 / q)) return null;
          const lineGiven = nb(`${p}${X} ${MINUS} ${q}${Y} ${r0 < 0 ? MINUS : '+'} ${Math.abs(r0)} = 0`);
          return lineChoice(d, `곡선 ${yIs(rt(`${X}${sup(2)} + ${cc * cc}`))} (${X} &gt; 0)에 접하고 직선 ${jh(lineGiven, '과/와')} 평행한 직선의 방정식은?`, { m, k }, tanWrongs(m, R(x0), R(y0)).concat([{ m: R(q / p), k }, { m: R(-p / q), k }]), {
            explain: `평행한 두 직선은 기울기가 같으므로 접선의 기울기는 ${jh(frac(p, q), '이다/이다')}. 접점의 ${X}좌표를 ${jh(Tv, '이라/라')} 하면 ${is(frac(Tv, rt(`${Tv}${sup(2)} + ${cc * cc}`)), frac(p, q))}에서 ${is(Tv, x0)}이고 접점은 ${ptH(x0, y0)}이다. 따라서 접선은 ${psH(m, R(x0), R(y0))}, 곧 ${lineH(m, k)}이다.` });
        }
        // y = ln(x − c) 에 접하고 직선 y = −m0 x + b0 에 수직: 기울기 1/m0
        const m0 = d.pick([2, 3]), c = d.pick([-2, -1, 1, 2]), b0 = nz(d, -5, 5), x0 = c + m0;
        const m = R(1 / m0), y0 = one(1, 'ln' + m0), k = add(y0, R(-x0 / m0));
        return lineChoice(d, `곡선 ${yIs(ln(`(${lin(1, -c)})`))}에 접하고 직선 ${jh(lineH(R(-m0), R(b0)), '에/에')} 수직인 직선의 방정식은?`, { m, k }, tanWrongs(m, R(x0), y0).concat([{ m: R(-m0), k: add(y0, R(m0 * x0)) }, { m: R(-1 / m0), k: add(y0, R(x0 / m0)) }]), {
          explain: `수직인 두 직선의 기울기의 곱은 −1이므로 접선의 기울기는 ${jh(frac(1, m0), '이다/이다')}. 접점의 ${X}좌표를 ${jh(Tv, '이라/라')} 하면 ${is(frac(1, lin(1, -c, Tv)), frac(1, m0))}에서 ${is(Tv, x0)}이고 접점은 ${ptH(x0, y0)}이다. 따라서 접선은 ${psH(m, R(x0), y0)}, 곧 ${lineH(m, k)}이다.` });
      }
      // y = k x√x 에 접하고 x축의 양의 방향과 이루는 각의 크기가 45°인 직선과 원점 사이의 거리
      const kq = d.pick([Q(1, 3), Q(2, 3), Q(1, 6), Q(1, 9)]), kv = kq.p / kq.q, x0 = 4 / (9 * kv * kv), y0 = 8 / (27 * kv * kv), c = y0 - x0;   // 접선 y = x + c
      const dist = one(toQ(Math.abs(c) / 2), 'r2');
      const wr = [one(toQ(Math.abs(c)), 'r2'), R(Math.abs(c)), one(toQ(Math.abs(c) / 4), 'r2'), R(x0), one(toQ(x0 / 2), 'r2'), one(toQ(y0 / 2), 'r2'), R(Math.abs(c) / 2)];
      return numChoice(d, `곡선 ${yIs(`${qt(kq)}${X}${rt(X)}`)}에 접하고 ${X}축의 양의 방향과 이루는 각의 크기가 45°인 직선을 ${V('l')}이라 할 때, 직선 ${V('l')}과 원점 사이의 거리는?`, dist, wr, {
        explain: `기울기는 tan 45° = 1이다. ${is(`${Y}′`, `${near(1.5 * kv, 1) ? '' : qt(toQ(1.5 * kv))}${rt(X)}`)} = 1에서 ${is(X, qt(x0))}이고 접점은 ${ptH(x0, y0)}이므로 접선은 ${lineH(R(1), R(c))}, 곧 ${nb(`${X} ${MINUS} ${Y} ${c < 0 ? MINUS : '+'} ${qt(Math.abs(c))} = 0`)}이다. 원점과의 거리는 ${frac(qt(Math.abs(c)), rt(2))} = ${jh(numH(dist), '이다/이다')}.` });
    }, { count: 2, standard: S8 }),

    T('tan-xpoint', '점 (a, 0)에서 그은 접선의 기울기가 주어질 때 a', '①4', (d) => {
      const s = d.pick([1, 2, 3]), c = nz(d, -4, 4), x0 = s * s - c, a = -s * s - c;
      if (!a) return null;
      const slope = frac(1, 2 * s);
      return numAns(`점 ${jh(ptS(Av, 0), '에서/에서')} 곡선 ${yIs(rt(lin(1, c)))}에 그은 접선의 기울기가 ${jh(slope, '일/일')} 때, 상수 ${Av}의 값은?`, a, {
        explain: `기울기를 알므로 접점부터 구한다. 접점의 ${X}좌표를 ${jh(Tv, '이라/라')} 하면 ${is(frac(1, `2${rt(lin(1, c, Tv))}`), slope)}에서 ${is(rt(lin(1, c, Tv)), s)}, 곧 ${is(Tv, x0)}이고 접점은 ${ptH(x0, s)}이다. 접선 ${psH(R(1 / (2 * s)), R(x0), R(s))}에 ${is(Y, 0)}을 넣으면 ${is(X, a)}이므로 ${is(Av, a)}이다.`,
        facts: { value: `0-(${2 * s}/2)*(${2 * s}/2)-${jq(c)}`, derived: [2] } });
    }, { standard: S8 }),

    T('tan-from', '곡선 밖의 한 점에서 곡선에 그은 접선의 방정식', '①5', (d) => {
      const fam = d.int(0, 4);
      let fH, px, py, m, x0, y0, told;
      if (fam === 0) {
        // 점 (p, 0) → y = e^x (접점 x = p + 1) 또는 y = e^{−x} (접점 x = p − 1)
        const p = d.pick([-3, -2, 0, 1]), sgn = d.pick([1, -1]); px = R(p); py = R(0);
        if (sgn > 0) { const al = p + 1; fH = ePow(X); x0 = R(al); y0 = one(1, 'e^' + al); m = one(1, 'e^' + al); }
        else { const al = p - 1; fH = ePow(MINUS + X); x0 = R(al); y0 = one(1, 'e^' + (-al)); m = one(-1, 'e^' + (-al)); }
        if (!y0.t.length) return null;
        told = sgn > 0 ? `${is(`${E}${sup(Tv)}(${numH(px)} ${MINUS} ${Tv}) + ${E}${sup(Tv)}`, 0)}에서 ${is(Tv, numH(x0))}` : `${is(`${MINUS}${E}${sup(MINUS + Tv)}(${numH(px)} ${MINUS} ${Tv}) + ${E}${sup(MINUS + Tv)}`, 0)}에서 ${is(Tv, numH(x0))}`;
      } else if (fam === 1) {
        // 원점 → y = ln x + c (접점 x = e^{1−c})
        const c = d.pick([-1, 0, 2, 3]); px = R(0); py = R(0); x0 = one(1, 'e^' + (1 - c)); y0 = R(1); m = one(1, 'e^' + (c - 1));
        fH = c ? `${ln(X)} ${c < 0 ? MINUS : '+'} ${Math.abs(c)}` : ln(X);
        if (1 - c === 0) return null;
        told = `${is(`${ln(Tv)}${c ? ` ${c < 0 ? MINUS : '+'} ${Math.abs(c)}` : ''} ${MINUS} 1`, 0)}에서 ${is(Tv, numH(x0))}`;
      } else if (fam === 2) {
        // 점 (p, 0) → y = √(x + c): 접점에서 √(t + c) = s, t = −p − 2c
        const s = d.pick([1, 2, 3]), c = nz(d, -3, 3), p = -s * s - c, al = s * s - c; px = R(p); py = R(0); x0 = R(al); y0 = R(s); m = R(1 / (2 * s));
        if (!p) return null;
        fH = rt(lin(1, c)); told = `${is(`${frac(`${numH(px)} ${MINUS} ${Tv}`, `2${rt(lin(1, c, Tv))}`)} + ${rt(lin(1, c, Tv))}`, 0)}에서 ${is(Tv, al)}`;
      } else if (fam === 3) {
        // 원점 → y = 1/(x + c): 접점 x = −c/2
        const c = d.pick([-2, 2, 1, -1]), al = -c / 2; px = R(0); py = R(0); x0 = R(al); y0 = R(2 / c); m = R(-4 / (c * c));
        fH = frac(1, lin(1, c)); told = `${is(`${frac(Tv, `(${lin(1, c, Tv)})${sup(2)}`)} + ${frac(1, lin(1, c, Tv))}`, 0)}에서 ${is(Tv, qt(al))}`;
      } else {
        // 원점 → y = √(x − c) (c > 0): 접점 x = 2c, 기울기 1/(2√c) = √c/(2c)
        const c = d.pick([2, 3, 5]); px = R(0); py = R(0); x0 = R(2 * c); y0 = one(1, 'r' + c); m = one(Q(1, 2 * c), 'r' + c);
        fH = rt(lin(1, -c)); told = `${is(`${MINUS}${frac(Tv, `2${rt(lin(1, -c, Tv))}`)} + ${rt(lin(1, -c, Tv))}`, 0)}에서 ${is(Tv, 2 * c)}`;
      }
      const right = { m, k: sub(y0, mul(m, x0)) };
      const fromWr = [{ m, k: neg(right.k) }, { m: neg(m), k: right.k }, { m: scl(m, 2), k: scl(right.k, 2) }, { m: scl(m, Q(1, 2)), k: scl(right.k, Q(1, 2)) }, { m: y0, k: sub(y0, mul(y0, x0)) }];
      return lineChoice(d, `점 ${jh(ptH(px, py), '에서/에서')} 곡선 ${yIs(fH)}에 그은 접선의 방정식은?`, right, tanWrongs(m, x0, y0).concat(fromWr), {
        explain: `접점의 ${X}좌표를 ${jh(Tv, '이라/라')} 하고 접점에서의 접선 ${yIs(`${FP}(${Tv})(${X} ${MINUS} ${Tv}) + ${Fv}(${Tv})`)}에 점 ${jh(ptH(px, py), '의/의')} 좌표를 넣으면 ${told}이다. 접점은 ${jh(ptH(x0, y0), '이고/이고')} 기울기는 ${jh(numH(m), '이므로/이므로')} 접선은 ${lineH(m, right.k)}이다.` });
    }, { standard: S8 }),

    T('tan-from-pass', '곡선 밖의 점에서 그은 접선이 다른 점을 지날 때', '①6', (d) => {
      if (d.bool()) {
        // 원점 → y = e^{x + c}: 접점 x = 1, 접선 y = e^{1+c} x, 점 (r, a)
        const c = d.pick([-2, 1, 2]), r = d.pick([2, 3, -1, -2]), e1 = 1 + c;
        if (!e1) return null;
        const right = one(r, 'e^' + e1), wr = [one(r, 'e^' + c), one(r, 'e^' + (2 + c)), one(Q(1, r), 'e^' + e1), one(-r, 'e^' + e1), one(r + 1, 'e^' + e1), one(r, 'e^' + (c - 1))].filter((w) => w.t.length && !w.t.some((x) => x.k === '1'));
        return numChoice(d, `원점에서 곡선 ${yIs(ePow(lin(1, c)))}에 그은 접선이 점 ${jh(ptS(r, Av), '을/를')} 지날 때, 상수 ${Av}의 값은?`, right, wr, {
          explain: `접점의 ${X}좌표를 ${jh(Tv, '이라/라')} 하면 접선 ${jh(yIs(`${ePow(lin(1, c, Tv))}(${X} ${MINUS} ${Tv}) + ${ePow(lin(1, c, Tv))}`), '이/가')} 원점을 지나므로 ${is(`(1 ${MINUS} ${Tv})${ePow(lin(1, c, Tv))}`, 0)}, 곧 ${is(Tv, 1)}이다. 접선은 ${lineH(one(1, 'e^' + e1), R(0))}이고 점 ${jh(ptS(r, Av), '을/를')} 지나므로 ${is(Av, numH(right))}이다.` });
      }
      // 원점 → y = ln x / xⁿ: 접점에서 ln t = 1/(n + 1), 기울기 1/((n + 1)e), 점 (a, c0)
      const nn = d.pick([1, 2, 3]), c0 = d.pick([1, 2, 3, -2]), right = one((nn + 1) * c0, 'e^1');
      const wr = [one(nn * c0, 'e^1'), one(Q(c0, nn + 1), 'e^-1'), one((nn + 2) * c0, 'e^1'), one(-(nn + 1) * c0, 'e^1'), R((nn + 1) * c0), one((nn + 1) * c0, 'e^2')];
      const xn = nn === 1 ? X : X + sup(nn);
      return numChoice(d, `원점에서 곡선 ${yIs(frac(ln(X), xn))}에 그은 접선이 점 ${jh(ptS(Av, c0), '을/를')} 지날 때, 상수 ${Av}의 값은?`, right, wr, {
        explain: `${is(`${Y}′`, frac(`1 ${MINUS} ${nn === 1 ? '' : nn}${ln(X)}`, X + sup(nn + 1)))}이다. 접점의 ${X}좌표를 ${jh(Tv, '이라/라')} 하면 접선이 원점을 지나므로 ${is(frac(ln(Tv), nn === 1 ? Tv : Tv + sup(nn)), `${Tv} × ${frac(`1 ${MINUS} ${nn === 1 ? '' : nn}${ln(Tv)}`, Tv + sup(nn + 1))}`)}에서 ${is(ln(Tv), frac(1, nn + 1))}이고, 기울기는 ${jh(frac(1, `${nn + 1}${E}`), '이다/이다')}. 접선 ${jh(yIs(frac(X, `${nn + 1}${E}`)), '이/가')} 점 ${jh(ptS(Av, c0), '을/를')} 지나므로 ${is(Av, numH(right))}이다.` });
    }, { standard: S8 }),

    T('tan-touch', '직선이 곡선에 접할 때 곡선의 상수', '①7', (d) => {
      // y = x + A sin x + a (0 ≤ x ≤ π) 에 직선 y = mx + c√3 이 접한다: 1 + A cos t = m, cos t = ±1/2
      const A = d.pick([2, 4, 6]), eps = d.pick([1, -1]), m = 1 + eps * A / 2, t = one(Q(eps > 0 ? 1 : 2, 3), 'pi'), cc = d.int(1, 4);
      if (m === 0) return null;
      // 접점이 직선 위: t + A sin t + a = m t + c√3  →  a = (m − 1)t + (c − A/2)√3
      const a = add(mul(R(m - 1), t), one(toQ(cc - A / 2), 'r3'));
      const tw = one(Q(eps > 0 ? 2 : 1, 3), 'pi');   // 다른 각(잘못)
      const wr = [add(mul(R(m - 1), tw), one(toQ(cc - A / 2), 'r3')), add(mul(R(1 - m), t), one(toQ(cc - A / 2), 'r3')), add(mul(R(m - 1), t), one(toQ(cc + A / 2), 'r3')), mul(R(m - 1), t), add(mul(R(m), t), one(toQ(cc - A / 2), 'r3')), add(mul(R(m - 1), t), one(cc, 'r3'))];
      const lineGiven = lineH(R(m), one(cc, 'r3'));
      return numChoice(d, `직선 ${jh(lineGiven, '이/가')} 곡선 ${yIs(`${X} + ${A}${trig('sin', X)} + ${Av}`)} (0 ≤ ${X} ≤ ${PI})에 접할 때, 상수 ${Av}의 값은?`, a, wr, {
        explain: `접점의 ${X}좌표를 ${jh(Tv, '이라/라')} 하면 ${is(`1 + ${A}${trig('cos', Tv)}`, m)}에서 ${is(trig('cos', Tv), eps > 0 ? frac(1, 2) : MINUS + frac(1, 2))}이고 0 ≤ ${Tv} ≤ ${PI}이므로 ${is(Tv, numH(t))}이다. 접점 ${jh(ptS(t, `${numH(add(t, one(Q(A, 2), 'r3')))} + ${Av}`), '이/가')} 직선 위에 있으므로 ${is(`${numH(add(t, one(Q(A, 2), 'r3')))} + ${Av}`, numH(add(mul(R(m), t), one(cc, 'r3'))))}에서 ${is(Av, numH(a))}이다.` });
    }, { standard: S8 }),

    T('tan-param', '매개변수로 나타낸 곡선의 접선의 방정식', '①9', (d, n) => {
      if (n === 0) {
        // x = t² + p, y = t³ + qt + r, t = t0 — 기울기와 y절편이 정수
        const t0 = d.pick([-2, -1, 1, 2]), m = nz(d, -4, 4), q = 2 * t0 * m - 3 * t0 * t0, p = d.int(-3, 3), r = d.int(-4, 4);
        const x0 = t0 * t0 + p, y0 = t0 ** 3 + q * t0 + r, k = y0 - m * x0;
        if (Math.abs(k) > 40 || Math.abs(q) > 15) return null;
        const xE = `${jq(t0)}*${jq(t0)}+${jq(p)}`, yE = `${jq(t0)}*${jq(t0)}*${jq(t0)}+${jq(q)}*${jq(t0)}+${jq(r)}`, mE = `(3*${jq(t0)}*${jq(t0)}+${jq(q)})/(2*${jq(t0)})`;
        return lineAns(`매개변수 ${Tv}로 나타낸 곡선 ${nb(`${X} = ${ptext([p, 0, 1], Tv)}`)}, ${nb(`${Y} = ${ptext([r, q, 0, 1], Tv)}`)}에서 ${is(Tv, t0)}에 대응하는 점에서의 접선의 방정식은?`, m, k, {
          explain: `${is(frac(`${V('d')}${X}`, `${V('d')}${Tv}`), `2${Tv}`)}, ${is(frac(`${V('d')}${Y}`, `${V('d')}${Tv}`), ptext([q, 0, 3], Tv))}이므로 ${is(Tv, t0)}일 때 ${is(frac(`${V('d')}${Y}`, `${V('d')}${X}`), frac(`3 × ${par(t0)}${sup(2)}${q ? ` ${q < 0 ? MINUS : '+'} ${Math.abs(q)}` : ''}`, `2 × ${par(t0)}`))} = ${qj(m, '이다/이다')}. 이 점의 좌표는 ${jh(ptH(x0, y0), '이므로/이므로')} 접선은 ${psH(R(m), R(x0), R(y0))}, 곧 ${lineH(R(m), R(k))}이다.`,
          facts: { calc: [[mE, 0], [`${yE}-(${mE})*(${xE})`, 1]], derived: [2, 3] } });
      }
      // x = a sin t, y = b cos t + c 또는 x = a cos t, y = b sin t, t 는 특수각
      const a = d.pick([1, 2, -1, 3]), b = d.pick([1, 2, 3]), cos = d.bool(), c = cos ? 0 : d.int(-3, 3), ang = d.pick(['1/6', '1/4', '1/3']), [sv, cv] = SC[ang];
      // dx/dt, dy/dt
      const dx = cos ? scl(sv, -a) : scl(cv, a), dy = cos ? scl(cv, b) : scl(sv, -b);
      const x0 = cos ? scl(cv, a) : scl(sv, a), y0 = cos ? scl(sv, b) : add(scl(cv, b), R(c));
      // 기울기 dy/dx: 두 값의 비 — 근호가 하나뿐이라 셈한다
      const m = asSurd(dy.v / dx.v);
      if (!m || !m.t.length) return null;
      const right = { m, k: sub(y0, mul(m, x0)) };
      if (!right.k) return null;
      const aH = Math.abs(a) === 1 ? (a < 0 ? MINUS : '') : String(a), bH = b === 1 ? '' : String(b);
      const xH = `${aH}${trig(cos ? 'cos' : 'sin', Tv)}`, yH = `${bH}${trig(cos ? 'sin' : 'cos', Tv)}${c ? ` ${c < 0 ? MINUS : '+'} ${Math.abs(c)}` : ''}`;
      const recip = asSurd(dx.v / dy.v);                                     // dx/dy 를 기울기로 쓴 잘못
      const wr = tanWrongs(m, x0, y0).concat(recip ? [{ m: recip, k: sub(y0, mul(recip, x0)) }] : []);
      return lineChoice(d, `매개변수 ${Tv}로 나타낸 곡선 ${nb(`${X} = ${xH}`)}, ${nb(`${Y} = ${yH}`)}에서 ${is(Tv, piOver(...ang.split('/').map(Number)))}에 대응하는 점에서의 접선의 방정식은?`, right, wr, {
        explain: `${is(frac(`${V('d')}${X}`, `${V('d')}${Tv}`), cos ? `${a === 1 ? MINUS : a === -1 ? '' : signed(-a)}${trig('sin', Tv)}` : `${aH}${trig('cos', Tv)}`)}, ${is(frac(`${V('d')}${Y}`, `${V('d')}${Tv}`), cos ? `${bH}${trig('cos', Tv)}` : `${MINUS}${bH}${trig('sin', Tv)}`)}이므로 이 점에서 ${is(frac(`${V('d')}${Y}`, `${V('d')}${X}`), numH(m))}이다. 점의 좌표는 ${jh(ptH(x0, y0), '이므로/이므로')} 접선은 ${psH(m, x0, y0)}, 곧 ${lineH(m, right.k)}이다.` });
    }, { count: 2, standard: S8 }),

    T('tan-implicit', '음함수로 나타낸 곡선 위의 점에서의 접선의 방정식', '①10', (d) => {
      const p = nz(d, -2, 2), q = nz(d, -2, 2);
      let eqH, mnum, mden, dydx;
      if (d.bool()) {
        // x² + αxy + βy² = c
        const al = d.pick([-1, 0, 1, 2]), be = d.pick([1, 2]), c0 = p * p + al * p * q + be * q * q;
        if (c0 <= 0 || al * al >= 4 * be) return null;   // (x + y)² 꼴은 두 직선이라 뺀다
        eqH = `${poly([[1, X + sup(2)], [al, X + Y], [be, Y + sup(2)]])} = ${c0}`; mnum = -(2 * p + al * q); mden = al * p + 2 * be * q;
        dydx = `${MINUS}${frac(poly([[2, X], [al, Y]]), poly([[al, X], [2 * be, Y]]))}`;
      } else {
        // x² + y² + Dx + Ey = F (원)
        const D = nz(d, -4, 4), Ee = nz(d, -4, 4), F0 = p * p + q * q + D * p + Ee * q;
        eqH = `${poly([[1, X + sup(2)], [1, Y + sup(2)], [D, X], [Ee, Y]])} = ${signed(F0)}`; mnum = -(2 * p + D); mden = 2 * q + Ee;
        if (D * D + Ee * Ee + 4 * F0 <= 0) return null;
        dydx = `${MINUS}${frac(poly([[2, X], [D, '']]), poly([[2, Y], [Ee, '']]))}`;
      }
      if (!mden || !mnum) return null;
      const mv = mnum / mden, m = R(mv), k = R(q - mv * p);
      const wr = [{ m: R(-mv), k: R(q + mv * p) }, { m: R(1 / mv), k: R(q - p / mv) }, { m: R(-1 / mv), k: R(q + p / mv) }, { m, k: R(-(q - mv * p)) }, { m, k: R(q + mv * p) }, { m, k: R(q) }];
      return lineChoice(d, `곡선 ${nb(eqH)} 위의 점 ${jh(ptH(p, q), '에서의/에서의')} 접선의 방정식은?`, { m, k }, wr, {
        explain: `음함수의 미분법으로 양변을 ${X}에 대하여 미분하면 ${is(frac(`${V('d')}${Y}`, `${V('d')}${X}`), dydx)}이므로 점 ${jh(ptH(p, q), '에서/에서')} ${is(frac(`${V('d')}${Y}`, `${V('d')}${X}`), qt(mv))}이다. 따라서 접선은 ${psH(m, R(p), R(q))}, 곧 ${lineH(m, k)}이다.` });
    }, { standard: S8 }),

    T('tan-inverse', '역함수의 그래프 위의 점에서의 접선', '①11', (d) => {
      if (d.bool()) {
        // f(x) = e^x + c·e·x³, g = f⁻¹, 곡선 y = g(x) 위의 점 (e(1 + c), 1)
        const c = d.pick([1, 2, 3]), yi = Q(2 * c, 1 + 3 * c);
        const pH = numH(one(1 + c, 'e^1'));
        return numAns(`함수 ${fIs(`${ePow(X)} + ${c === 1 ? '' : c}${E}${X}${sup(3)}`)}의 역함수를 ${V('g')}(${X})라 할 때, 곡선 ${yIs(`${V('g')}(${X})`)} 위의 점 ${jh(nb(`(${pH}, 1)`), '에서의/에서의')} 접선의 ${Y}절편은?`, yi, {
          explain: `${is(`${V('g')}(${pH})`, 1)}이므로 ${is(`${Fv}(1)`, pH)}이다. ${is(`${FP}(${X})`, `${ePow(X)} + ${3 * c}${E}${X}${sup(2)}`)}이므로 ${is(`${V('g')}′(${pH})`, frac(1, `${FP}(1)`))} = ${frac(1, `${1 + 3 * c}${E}`)}이다. 접선 ${yIs(`${frac(1, `${1 + 3 * c}${E}`)}(${X} ${MINUS} ${pH}) + 1`)}의 ${Y}절편은 ${qj(yi.p / yi.q, '이다/이다')}.`,
          facts: { value: `1-(1+${c})/(1+3*${c})`, derived: [3] } });
      }
      // f(x) = e^{kx} + mx, 곡선 y = g(x) 위의 점 (1, 0)
      const k = d.pick([1, 2, 3]), m = d.pick([1, 2, 3, 4]), yi = Q(-1, k + m);
      return numAns(`함수 ${fIs(`${ePow(k === 1 ? X : k + X)} + ${m === 1 ? '' : m}${X}`)}의 역함수를 ${V('g')}(${X})라 할 때, 곡선 ${yIs(`${V('g')}(${X})`)} 위의 점 ${jh(ptH(1, 0), '에서의/에서의')} 접선의 ${Y}절편은?`, yi, {
        explain: `${is(`${Fv}(0)`, 1)}이므로 ${is(`${V('g')}(1)`, 0)}이다. ${is(`${FP}(${X})`, `${k === 1 ? '' : k}${ePow(k === 1 ? X : k + X)} + ${m}`)}이므로 ${is(`${V('g')}′(1)`, frac(1, `${FP}(0)`))} = ${jh(frac(1, k + m), '이다/이다')}. 접선 ${yIs(`${frac(1, k + m)}(${X} ${MINUS} 1)`)}의 ${Y}절편은 ${qj(yi.p / yi.q, '이다/이다')}.`,
        facts: { value: `0-1/(${k}+${m})` } });
    }, { standard: S8 })
  ];

  // ════════════════════════════════════════════════════════════════
  // 이계도함수와 곡선의 볼록·변곡점
  // ════════════════════════════════════════════════════════════════
  const conv = [
    T('conv-ext2', '이계도함수를 이용하여 극값 구하기', '①16', (d, n) => {
      if (n === 0) {
        // f(x) = ax + b/x (b = as²): x = −s 에서 극대 −2as, x = s 에서 극소 2as
        const a = d.pick([1, 2, 3]), s = d.pick([1, 2, 3]), b = a * s * s;
        return M(`이계도함수를 이용하여 구한 함수 ${fIs(`${a === 1 ? '' : a}${X} + ${frac(b, X)}`)}의 극댓값과 극솟값은?`, [{ lead: '극댓값', answer: -2 * a * s, signed: true }, { lead: '극솟값', answer: 2 * a * s, signed: true }], {
          shown: `극댓값 ${signed(-2 * a * s)}, 극솟값 ${2 * a * s}`,
          explain: `${is(`${FP}(${X})`, `${a} ${MINUS} ${frac(b, X + sup(2))}`)} = 0에서 ${is(X, `${MINUS}${s}`)} 또는 ${is(X, s)}이다. ${is(`${FPP}(${X})`, frac(2 * b, X + sup(3)))}이고 ${FPP}(${MINUS}${s}) &lt; 0, ${FPP}(${s}) &gt; 0이므로 극댓값은 ${Fv}(${MINUS}${s}) = ${signed(-2 * a * s)}, 극솟값은 ${Fv}(${s}) = ${jh(String(2 * a * s), '이다/이다')}. (극댓값이 극솟값보다 작다.)`,
          facts: { calc: [[`0-2*${a}*${s}`, 0], [`2*${a}*${s}`, 1]], derived: [s, 2] } });
      }
      if (d.bool()) {
        // f(x) = x e^{kx}: x = −1/k 에서 극값 −1/(ke) (k > 0 극소, k < 0 극대)
        const k = d.pick([1, 2, 3, -1, -2]), right = one(Q(-1, k), 'e^-1'), word = k > 0 ? '극솟값' : '극댓값';
        const wr = [one(Q(1, k), 'e^-1'), one(-k, 'e^-1'), one(Q(-1, k), 'e^-2'), one(Q(-1, k), 'e^1'), R(-1 / k), one(Q(-2, k), 'e^-1')];
        return numChoice(d, `이계도함수를 이용하여 구한 함수 ${fIs(`${X}${ePow(k === 1 ? X : k === -1 ? MINUS + X : signed(k) + X)}`)}의 ${word}은?`, right, wr, {
          explain: `${is(`${FP}(${X})`, `(1 ${k < 0 ? MINUS : '+'} ${Math.abs(k) === 1 ? '' : Math.abs(k)}${X})${ePow(k === 1 ? X : k === -1 ? MINUS + X : signed(k) + X)}`)} = 0에서 ${is(X, qt(-1 / k))}이고, ${is(`${FPP}(${X})`, `${k === 1 ? '' : k === -1 ? MINUS : signed(k)}(2 ${k < 0 ? MINUS : '+'} ${Math.abs(k) === 1 ? '' : Math.abs(k)}${X})${ePow(k === 1 ? X : k === -1 ? MINUS + X : signed(k) + X)}`)}에서 ${FPP}(${qt(-1 / k)}) ${k > 0 ? '&gt;' : '&lt;'} 0이므로 ${word}은 ${Fv}(${qt(-1 / k)}) = ${jh(numH(right), '이다/이다')}.` });
      }
      // f(x) = ln x / xⁿ: x = e^{1/n} 에서 극댓값 1/(ne)
      const nn = d.pick([1, 2, 3]), right = one(Q(1, nn), 'e^-1'), xn = nn === 1 ? X : X + sup(nn);
      const wr = [one(nn, 'e^-1'), one(Q(1, nn), 'e^1'), one(Q(1, nn + 1), 'e^-1'), R(1 / nn), one(Q(-1, nn), 'e^-1'), one(Q(1, nn), 'e^-2')];
      return numChoice(d, `이계도함수를 이용하여 구한 함수 ${fIs(frac(ln(X), xn))}의 극댓값은?`, right, wr, {
        explain: `${is(`${FP}(${X})`, frac(`1 ${MINUS} ${nn === 1 ? '' : nn}${ln(X)}`, X + sup(nn + 1)))} = 0에서 ${is(ln(X), frac(1, nn))}이고, 이 점에서 ${FPP}(${X}) &lt; 0이므로 극댓값은 ${frac(frac(1, nn), E)} = ${jh(numH(right), '이다/이다')}.` });
    }, { count: 2, standard: S9 }),

    T('conv-pick', '주어진 구간에서 곡선이 아래로(위로) 볼록한가', '①17', (d) => {
      const pool = [
        [`${yIs(trig('sin', X))} (0 &lt; ${X} &lt; ${PI})`, -1, `${is(`${Y}″`, `${MINUS}${trig('sin', X)}`)} &lt; 0`],
        [`${yIs(trig('sin', X))} (${PI} &lt; ${X} &lt; 2${PI})`, 1, `${is(`${Y}″`, `${MINUS}${trig('sin', X)}`)} &gt; 0`],
        [`${yIs(trig('cos', X))} (${MINUS}${frac(PI, 2)} &lt; ${X} &lt; ${frac(PI, 2)})`, -1, `${is(`${Y}″`, `${MINUS}${trig('cos', X)}`)} &lt; 0`],
        [`${yIs(trig('cos', X))} (${frac(PI, 2)} &lt; ${X} &lt; ${frac(`3${PI}`, 2)})`, 1, `${is(`${Y}″`, `${MINUS}${trig('cos', X)}`)} &gt; 0`],
        [`${yIs(ln(X))} (${X} &gt; 0)`, -1, `${is(`${Y}″`, `${MINUS}${frac(1, X + sup(2))}`)} &lt; 0`],
        [`${yIs(ePow(MINUS + X))}`, 1, `${is(`${Y}″`, ePow(MINUS + X))} &gt; 0`],
        [`${yIs(rt(X))} (${X} &gt; 0)`, -1, `${is(`${Y}″`, `${MINUS}${frac(1, `4${X}${rt(X)}`)}`)} &lt; 0`],
        [`${yIs(frac(1, X))} (${X} &gt; 0)`, 1, `${is(`${Y}″`, frac(2, X + sup(3)))} &gt; 0`],
        [`${yIs(frac(1, X))} (${X} &lt; 0)`, -1, `${is(`${Y}″`, frac(2, X + sup(3)))} &lt; 0`],
        [`${yIs(`${X} ${ln(X)}`)} (${X} &gt; 0)`, 1, `${is(`${Y}″`, frac(1, X))} &gt; 0`],
        [`${yIs(trig('tan', X))} (0 &lt; ${X} &lt; ${frac(PI, 2)})`, 1, `${is(`${Y}″`, `2${nb(`<span class="mb-fn">sec</span>${sup(2)} ${X}`)}${trig('tan', X)}`)} &gt; 0`],
        [`${yIs(trig('tan', X))} (${MINUS}${frac(PI, 2)} &lt; ${X} &lt; 0)`, -1, `${is(`${Y}″`, `2${nb(`<span class="mb-fn">sec</span>${sup(2)} ${X}`)}${trig('tan', X)}`)} &lt; 0`],
        [`${yIs(`${MINUS}${ePow(X)}`)}`, -1, `${is(`${Y}″`, `${MINUS}${ePow(X)}`)} &lt; 0`]
      ];
      const want = d.pick([1, -1]), right = d.pick(pool.filter((r) => r[1] === want)), wrongs = pool.filter((r) => r[1] !== want);
      const rows = [right].concat(d.shuffle(wrongs).slice(0, 3)), list = d.shuffle(rows), at = list.indexOf(right);
      return C(`다음 가운데 주어진 구간에서 곡선이 ${want > 0 ? '아래로' : '위로'} 볼록한 것은?`, list.map((r) => r[0]), at, {
        explain: `이계도함수의 부호를 본다: ${right[2]}이므로 ${jh(right[0], '은/는')} ${want > 0 ? '아래로' : '위로'} 볼록하다. 나머지는 모두 ${want > 0 ? '위로' : '아래로'} 볼록하다.`,
        facts: { truth: list.map((r) => r === right), want: true } });
    }, { standard: S9 }),

    T('conv-infl', '볼록한 구간과 변곡점', '①18', (d, n) => {
      if (n === 0) {
        // 사차함수: f″(x) = 12(x − u)(x − w) — 변곡점 둘(정수 좌표)
        const u = d.int(-2, 1), w = d.int(u + 1, 3), pp = d.int(-6, 6), qq = d.int(-6, 6), a = [qq, pp, 6 * u * w, -2 * (u + w), 1];
        const fu = pval(a, u), fw = pval(a, w);
        if (Math.abs(fu) > 60 || Math.abs(fw) > 60 || (a[3] === 0 && a[2] === 0)) return null;
        const vE = (x) => pjs(a, jq(x));
        return inline(`곡선 ${yIs(ptext(a))}의 두 변곡점의 좌표는?`, `${grp('({0}, {1})')}, ${grp('({2}, {3})')}`, [u, fu, w, fw].map((v) => ({ answer: v, signed: true })), {
          blocks: [[0, 1], [2, 3]], shown: `${ptH(u, fu)}, ${ptH(w, fw)}`,
          explain: `${is(`${Y}″`, ptext(pder(pder(a))))} = 12(${lin(1, -u)})(${lin(1, -w)})이므로 ${is(X, u)}, ${is(X, w)}의 좌우에서 ${Y}″의 부호가 바뀐다. 변곡점은 ${ptH(u, fu)}, ${jh(ptH(w, fw), '이다/이다')}.`,
          facts: { calc: [[jq(u), 0], [vE(u), 1], [jq(w), 2], [vE(w), 3]], derived: [u, w] } });
      }
      if (n === 1) {
        // 초월함수의 변곡점: (x + c)eˣ, ln(x² + s²)(x > 0 쪽), x² + 2s² ln x
        const fam = d.int(0, 2);
        let fH, x1, y1, told, wr;
        if (fam === 0) {
          const c = d.int(-2, 2), xi = -c - 2; fH = `(${lin(1, c)})${ePow(X)}`; x1 = R(xi); y1 = one(-2, 'e^' + xi);
          if (xi === 0) y1 = R(-2);
          told = `${is(`${Y}″`, `(${lin(1, c + 2)})${ePow(X)}`)}이므로 ${is(X, xi)}의 좌우에서 부호가 바뀐다`;
          wr = [{ x: R(-c - 1), y: one(-1, 'e^' + (-c - 1)) }, { x: x1, y: neg(y1) }, { x: R(-xi), y: y1 }, { x: x1, y: one(-1, 'e^' + xi) }, { x: R(xi - 1), y: one(-3, 'e^' + (xi - 1)) }];
        } else if (fam === 1) {
          const s = d.pick([1, 2, 3]); fH = ln(`(${X}${sup(2)} + ${s * s})`); x1 = R(s); y1 = one(1, 'ln' + 2 * s * s);
          told = `${is(`${Y}″`, frac(`2(${s * s} ${MINUS} ${X}${sup(2)})`, `(${X}${sup(2)} + ${s * s})${sup(2)}`))}이므로 ${is(X, s)}의 좌우에서 부호가 바뀐다`;
          wr = [{ x: R(0), y: one(1, 'ln' + s * s) }, { x: R(s), y: one(1, 'ln' + s * s) }, { x: R(s * s), y: one(1, 'ln' + (s ** 4 + s * s)) }, { x: R(2 * s), y: one(1, 'ln' + 5 * s * s) }, { x: R(s), y: one(2, 'ln' + s) }].filter((p) => p.y.t.length);
          fH = `${fH} (${X} &gt; 0)`;
        } else {
          const s = d.pick([2, 3]); fH = `${X}${sup(2)} + ${2 * s * s}${ln(X)}`; x1 = R(s); y1 = add(R(s * s), one(2 * s * s, 'ln' + s));
          told = `${is(`${Y}″`, `2 ${MINUS} ${frac(2 * s * s, X + sup(2))}`)}이므로 ${is(X, s)}의 좌우에서 부호가 바뀐다`;
          wr = [{ x: R(s), y: add(R(s * s), one(s * s, 'ln' + s)) }, { x: R(s), y: one(2 * s * s, 'ln' + s) }, { x: R(s * s), y: add(R(s ** 4), one(4 * s * s, 'ln' + s)) }, { x: R(s), y: add(R(-s * s), one(2 * s * s, 'ln' + s)) }, { x: R(2 * s), y: add(R(4 * s * s), one(2 * s * s, 'ln' + 2 * s)) }];
        }
        return ptChoice(d, `곡선 ${yIs(fH)}의 변곡점의 좌표는?`, { x: x1, y: y1 }, wr, { explain: `${told}. 변곡점은 ${jh(ptH(x1, y1), '이다/이다')}.` });
      }
      if (n === 2) {
        // 위로 볼록한 x 의 값의 범위(전체) 고르기: x/(x + c)(변곡점 없음), x e^{ax}, sin bx, 삼차함수 — 보기는 부등식이라 일부 구간이 답이 되지 않는다
        const fam = d.int(0, 3);
        let fH, right, told;
        const cand = [];
        if (fam === 0) {
          // y″ = −2c/(x + c)³: c > 0 이면 x > −c 에서, c < 0 이면 x < −c 에서 음수
          const c = nz(d, -3, 3); fH = frac(X, lin(1, c));
          right = c > 0 ? [-c, Infinity] : [-Infinity, -c];
          const f2H = c > 0 ? `${MINUS}${frac(2 * c, `(${lin(1, c)})${sup(3)}`)}` : frac(-2 * c, `(${lin(1, c)})${sup(3)}`);
          told = `${is(`${Y}″`, f2H)}이고 ${is(X, -c)}에서는 정의되지 않는다(변곡점은 없다)`;
          cand.push([-Infinity, -c], [-c, Infinity], [-Infinity, c], [c, Infinity], [-Infinity, Infinity]);
        } else if (fam === 1) {
          // y″ = a(2 + ax)e^{ax} < 0 ⇔ x < −2/a (a 의 부호와 관계없다)
          const a = d.pick([1, 2, -1, -2]), b0 = -2 / a; fH = `${X}${ePow(a === 1 ? X : a === -1 ? MINUS + X : signed(a) + X)}`;
          right = [-Infinity, b0];
          told = `${is(`${Y}″`, `${a === 1 ? '' : a === -1 ? MINUS : signed(a)}(${lin(a, 2)})${ePow(a === 1 ? X : a === -1 ? MINUS + X : signed(a) + X)}`)}이므로 ${is(X, qt(b0))}의 좌우에서 부호가 바뀐다`;
          cand.push([-Infinity, b0], [b0, Infinity], [-Infinity, -b0], [-b0, Infinity], [-Infinity, Infinity]);
        } else if (fam === 2) {
          // y = sin bx (0 < x < 2π/b): y″ = −b² sin bx < 0 ⇔ 0 < x < π/b
          const b = d.pick([1, 2, 3]), P = (p, q) => one(Q(p, q), 'pi'); fH = `${trig('sin', b === 1 ? X : b + X)} (0 &lt; ${X} &lt; ${numH(P(2, b))})`;
          right = [0, P(1, b)];
          told = `${is(`${Y}″`, `${MINUS}${b * b === 1 ? '' : b * b}${trig('sin', b === 1 ? X : b + X)}`)}이므로 ${nb(`0 &lt; ${X} &lt; ${numH(P(1, b))}`)}에서 음수이고 ${is(X, numH(P(1, b)))}의 좌우에서 부호가 바뀐다`;
          cand.push([0, P(1, b)], [P(1, b), P(2, b)], [0, P(1, 2 * b)], [P(1, 2 * b), P(3, 2 * b)], [0, P(2, b)]);
        } else {
          const u = nz(d, -3, 3), bb = d.int(-5, 5), a = [d.int(-4, 4), bb, -3 * u, 1]; fH = ptext(a);
          right = [-Infinity, u];
          told = `${is(`${Y}″`, ptext(pder(pder(a))))}이므로 ${is(X, u)}의 좌우에서 부호가 바뀐다`;
          cand.push([-Infinity, u], [u, Infinity], [-Infinity, -u], [-u, Infinity], [-Infinity, Infinity]);
        }
        const show = (iv) => (iv[0] === -Infinity && iv[1] === Infinity ? '모든 실수' : iv[0] === -Infinity ? nb(`${X} &lt; ${endH(iv[1])}`) : iv[1] === Infinity ? nb(`${X} &gt; ${endH(iv[0])}`) : nb(`${endH(iv[0])} &lt; ${X} &lt; ${endH(iv[1])}`));
        const val = (v) => (typeof v === 'number' ? v : v.v);
        return pickBy(d, `곡선 ${jh(yIs(fH), '이/가')} 위로 볼록한 ${X}의 값의 범위는?`, right, cand.filter((iv) => !(near(val(iv[0]), val(right[0])) && near(val(iv[1]), val(right[1])))), (iv) => [val(iv[0]), val(iv[1])], show, {
          explain: `${told}. ${Y}″ &lt; 0인 ${X}의 값의 범위는 ${jh(show(right), '이다/이다')}.` });
      }
      // 두 변곡점 사이의 거리: K/(x² + 3s²), e^{−x²/(2s²)}
      const s = d.pick([1, 2, 3]);
      if (d.bool()) {
        const K = d.pick([1, 2, 3, 6]);
        return N(`곡선 ${yIs(frac(K, `${X}${sup(2)} + ${3 * s * s}`))}의 두 변곡점 사이의 거리는?`, 2 * s, {
          explain: `${is(`${Y}″`, frac(`${6 * K}(${X}${sup(2)} ${MINUS} ${s * s})`, `(${X}${sup(2)} + ${3 * s * s})${sup(3)}`))}이므로 변곡점의 ${X}좌표는 ${MINUS}${s}, ${jh(String(s), '이고/이고')} 두 점의 ${Y}좌표가 같으므로 거리는 ${2 * s}이다.`,
          facts: { value: `2*${s}`, derived: [2, s] } });
      }
      return N(`곡선 ${yIs(ePow(`${MINUS}${frac(X + sup(2), 2 * s * s)}`))}의 두 변곡점 사이의 거리는?`, 2 * s, {
        explain: `${is(`${Y}″`, `${frac(`${X}${sup(2)} ${MINUS} ${s * s}`, s ** 4)}${ePow(`${MINUS}${frac(X + sup(2), 2 * s * s)}`)}`)}이므로 변곡점의 ${X}좌표는 ${MINUS}${s}, ${jh(String(s), '이고/이고')} 두 점의 ${Y}좌표가 같으므로 거리는 ${2 * s}이다.`,
        facts: { value: `2*${s}`, derived: [2, s] } });
    }, { count: 4, standard: S9 }),

    T('conv-inflconst', '변곡점의 조건으로 상수 구하기', '①19', (d) => {
      if (d.bool()) {
        // y = kx + A cos x (0 ≤ x ≤ π) 의 변곡점 x = π/2, y좌표 c → k = 2c/π ; y = kx + A sin x (0 < x < 2π) 의 변곡점 x = π → k = c/π
        const cosine = d.bool(), A = d.pick([1, 2, 3]), c = d.pick([2, 3, 4, 5, 6]), right = one(toQ(cosine ? 2 * c : c), 'pi^-1');
        const wr = [one(toQ(cosine ? c : 2 * c), 'pi^-1'), one(Q(1, cosine ? 2 * c : c), 'pi'), one(toQ(cosine ? 2 * c : c), 'pi'), one(toQ(cosine ? 4 * c : c / 2), 'pi^-1'), R(cosine ? 2 * c : c), one(toQ((cosine ? 2 * c : c) + A), 'pi^-1')];
        const fH = `${Kv}${X} + ${A === 1 ? '' : A}${trig(cosine ? 'cos' : 'sin', X)}`;
        return numChoice(d, `곡선 ${yIs(fH)} (${cosine ? `0 ≤ ${X} ≤ ${PI}` : `0 &lt; ${X} &lt; 2${PI}`})의 변곡점의 ${Y}좌표가 ${jh(String(c), '일/일')} 때, 상수 ${Kv}의 값은?`, right, wr, {
          explain: `${is(`${Y}″`, `${MINUS}${A === 1 ? '' : A}${trig(cosine ? 'cos' : 'sin', X)}`)}이므로 ${cosine ? `${is(X, frac(PI, 2))}` : `${is(X, PI)}`}의 좌우에서 부호가 바뀐다. 이 점의 ${Y}좌표는 ${cosine ? frac(`${PI}${Kv}`, 2) : `${PI}${Kv}`}이므로 ${is(cosine ? frac(`${PI}${Kv}`, 2) : `${PI}${Kv}`, c)}에서 ${is(Kv, numH(right))}이다.` });
      }
      // y = (ln kx)² 의 변곡점 (e/k, 1)이 직선 y = mx 위 → k = me
      const m = d.pick([1, 2, 3, 4]), right = one(m, 'e^1');
      const wr = [one(Q(1, m), 'e^1'), one(m, 'e^-1'), one(2 * m, 'e^1'), one(m, 'e^2'), R(m), one(Q(m, 2), 'e^1')];
      return numChoice(d, `곡선 ${yIs(`(${ln(Kv + X)})${sup(2)}`)}의 변곡점이 직선 ${yIs(`${m === 1 ? '' : m}${X}`)} 위에 있을 때, 양수 ${Kv}의 값은?`, right, wr, {
        explain: `${is(`${Y}′`, frac(`2${ln(Kv + X)}`, X))}, ${is(`${Y}″`, frac(`2(1 ${MINUS} ${ln(Kv + X)})`, X + sup(2)))}이므로 ${is(ln(Kv + X), 1)}, 곧 ${is(X, frac(E, Kv))}의 좌우에서 부호가 바뀌고 변곡점은 ${nb(`(${frac(E, Kv)}, 1)`)}이다. ${is(`${m === 1 ? '' : m} × ${frac(E, Kv)}`, 1)}에서 ${is(Kv, numH(right))}이다.` });
    }, { standard: S9 }),

    T('conv-inflext', '극값과 변곡점의 조건으로 두 상수 구하기(삼각함수)', '①20', (d) => {
      // f(x) = a sin x + b cos x + cx (0 < x < 2π): x0 에서 극값, x1 에서 변곡점
      const c = d.pick([1, 2, 3, -1, -2]), x0k = d.pick(['1/2', '1', '3/2']), x1k = d.pick(['1/4', '3/4']);
      let a, b;
      if (x0k === '1/2') { b = c; a = x1k === '1/4' ? -b : b; } else if (x0k === '1') { a = c; b = x1k === '1/4' ? -a : a; } else { b = -c; a = x1k === '1/4' ? -b : b; }
      if ((a === -1 && b === 2) || (a === 1 && b === -1 && c === 1)) return null;
      const x0 = fracOf(x0k) * Math.PI, f2 = -a * Math.sin(x0) - b * Math.cos(x0);
      if (near(f2, 0)) return null;
      const kind = f2 > 0 ? '극소' : '극대', x0H = piOver(...(x0k.includes('/') ? x0k.split('/').map(Number) : [Number(x0k), 1])), x1H = piOver(...x1k.split('/').map(Number));
      return vals(`함수 ${fIs(`${Av} ${trig('sin', X)} + ${Bv} ${trig('cos', X)} ${c < 0 ? MINUS : '+'} ${Math.abs(c) === 1 ? '' : Math.abs(c)}${X}`)} (0 &lt; ${X} &lt; 2${PI})가 ${is(X, x0H)}에서 ${kind}이고, 곡선 ${is(Y, `${Fv}(${X})`)}의 변곡점의 ${X}좌표가 ${jh(x1H, '일/일')} 때, 상수 ${Av}, ${Bv}의 값은?`, [[Av, a], [Bv, b]], {
        explain: `${is(`${FP}(${X})`, `${Av} ${trig('cos', X)} ${MINUS} ${Bv} ${trig('sin', X)} ${c < 0 ? MINUS : '+'} ${Math.abs(c)}`)}, ${is(`${FPP}(${X})`, `${MINUS}${Av} ${trig('sin', X)} ${MINUS} ${Bv} ${trig('cos', X)}`)}이다. ${is(`${FP}(${x0H})`, 0)}과 ${is(`${FPP}(${x1H})`, 0)}에서 ${is(Av, a)}, ${is(Bv, b)}이고, 이때 ${FPP}(${x0H}) ${f2 > 0 ? '&gt;' : '&lt;'} 0이므로 ${is(X, x0H)}에서 ${kind}가 맞다.`,
        facts: { calc: [[jq(a), 0], [jq(b), 1]], derived: [Math.abs(a), Math.abs(b)] } });
    }, { standard: S9 }),

    T('conv-inflexist', '변곡점이 존재할 조건(사차함수)', '①21', (d) => {
      // f(x) = p x⁴ + q x³ + a x²: f″ = 12p x² + 6q x + 2a 가 서로 다른 두 실근 ⇔ 9q² − 24pa > 0
      const p = d.pick([1, 2, 3, -1, -2]), q = d.pick([-4, -3, -2, 2, 3, 4, 1, -1]), Nn = 3 * q * q, Dd = 8 * Math.abs(p);
      const ans = p > 0 ? Math.floor((Nn - 1) / Dd) : 1 - Math.ceil(Nn / Dd);
      const word = p > 0 ? '최댓값' : '최솟값';
      const fH = poly([[p, X + sup(4)], [q, X + sup(3)], [1, Av + X + sup(2)]]);
      const vE = p > 0 ? `(3*${Math.abs(q)}*${Math.abs(q)}-1-(3*${Math.abs(q)}*${Math.abs(q)}-1)%(8*${p}))/(8*${p})` : `1-(3*${Math.abs(q)}*${Math.abs(q)}+8*${-p}-1-(3*${Math.abs(q)}*${Math.abs(q)}+8*${-p}-1)%(8*${-p}))/(8*${-p})`;
      return numAns(`곡선 ${yIs(fH)}의 변곡점이 존재하도록 하는 정수 ${Av}의 ${word}은?`, ans, {
        explain: `${is(`${Y}″`, poly([[12 * p, X + sup(2)], [6 * q, X], [2, Av]]))}이다. ${Y}″의 부호가 바뀌려면 이차방정식 ${Y}″ = 0이 서로 다른 두 실근을 가져야 하므로(중근이면 부호가 바뀌지 않는다) 판별식에서 ${nb(`${36 * q * q} ${MINUS} ${96 * p < 0 ? `(${signed(96 * p)})` : 96 * p}${Av} &gt; 0`)}, 곧 ${Av} ${p > 0 ? '&lt;' : '&gt;'} ${qt(toQ(Nn / (8 * p)))}이다. 따라서 정수 ${Av}의 ${word}은 ${signed(ans)}이다.`,
        facts: { value: vE, derived: [3, 8] } });
    }, { standard: S9 }),

    T('conv-allconvex', '실수 전체에서 아래로 볼록할 조건', '①22', (d) => {
      // y = (x² + bx + k)e^{±x}: y″ = (x² + (b ± 4)x + …)e^{±x} ≥ 0 ⇔ k ≥ (b² + 8)/4
      const b = d.pick([-3, -2, -1, 1, 2, 3, 4, 0]), sgn = d.pick([1, -1]), v = Q(b * b + 8, 4);
      if (b === -2 && sgn === 1) return null;
      const ex = ePow(sgn > 0 ? X : MINUS + X), inner = poly([[1, X + sup(2)], [b, X], [1, Kv]]);
      const inner2 = sgn > 0 ? poly([[1, X + sup(2)], [b + 4, X], [2 * b + 2, '']]) : poly([[1, X + sup(2)], [b - 4, X], [2 - 2 * b, '']]);
      return numAns(`곡선 ${jh(yIs(`(${inner})${ex}`), '이/가')} 실수 전체의 집합에서 아래로 볼록하도록 하는 실수 ${Kv}의 최솟값은?`, v, {
        explain: `${is(`${Y}″`, `(${inner2} + ${Kv})${ex}`)}이고 ${ex} &gt; 0이므로 모든 실수 ${X}에서 ${nb(`${inner2} + ${Kv} ≥ 0`)}이어야 한다. 판별식 ≤ 0에서 ${Kv} ≥ ${qt(v)}이므로 최솟값은 ${jh(qt(v), '이다/이다')}.`,
        facts: { value: `(${jq(b)}*${jq(b)}+8)/4`, derived: [8, 4] } });
    }, { standard: S9 }),

    T('conv-story', '곡선의 모양을 말로 설명한 것과 f′·f″의 부호', '①23', (d) => {
      const kinds = [[1, 1, '오르막길이 갈수록 가팔라져 오르기가 점점 힘들어진다.'], [1, -1, '오르막길이 갈수록 완만해져 오르기가 점점 쉬워진다.'], [-1, -1, '내리막길이 갈수록 가팔라져 넘어지지 않게 조심해야 한다.'], [-1, 1, '내리막길이 갈수록 완만해져 걷기가 점점 쉬워진다.']];
      const sg = (v) => (v > 0 ? '+' : MINUS), right = d.pick(kinds), lead = `어느 등산로에서 출발점부터 떨어진 거리 ${X}에서의 해발 고도를 ${jh(Y, '이라/라')} 할 때 ${is(Y, `${Fv}(${X})`)}이고, ${Fv}(${X})는 이계도함수를 갖는다.`;
      const rows = d.shuffle(kinds), at = rows.indexOf(right);
      if (d.bool()) {
        return C(`${lead} 어떤 구간에서 이 길을 걸은 사람이 「${right[2]}」라고 말했을 때, 그 구간에서 ${FP}(${X})와 ${FPP}(${X})의 부호로 알맞은 것은?`, rows.map((r) => `${FP}(${X}): ${sg(r[0])}, ${FPP}(${X}): ${sg(r[1])}`), at, {
          explain: `${right[0] > 0 ? '올라가므로' : '내려가므로'} ${FP}(${X}) ${right[0] > 0 ? '&gt;' : '&lt;'} 0이다. 접선의 기울기가 ${right[1] > 0 ? '커지므로' : '작아지므로'}(${right[0] > 0 ? (right[1] > 0 ? '가팔라진다' : '완만해진다') : (right[1] > 0 ? '완만해진다' : '가팔라진다')}) ${FP}(${X})는 ${right[1] > 0 ? '증가' : '감소'}하고 ${FPP}(${X}) ${right[1] > 0 ? '&gt;' : '&lt;'} 0이다.`,
          facts: { truth: rows.map((r) => r === right), want: true } });
      }
      return C(`${lead} 어떤 구간에서 ${FP}(${X}) ${right[0] > 0 ? '&gt;' : '&lt;'} 0, ${FPP}(${X}) ${right[1] > 0 ? '&gt;' : '&lt;'} 0일 때, 그 구간을 걸은 사람이 한 말로 알맞은 것은?`, rows.map((r) => `「${r[2]}」`), at, {
        explain: `${FP}(${X}) ${right[0] > 0 ? '&gt;' : '&lt;'} 0이므로 ${right[0] > 0 ? '오르막' : '내리막'}이다. ${FPP}(${X}) ${right[1] > 0 ? '&gt;' : '&lt;'} 0이면 접선의 기울기가 ${right[1] > 0 ? '커지므로' : '작아지므로'} 길은 ${right[0] > 0 ? (right[1] > 0 ? '가팔라진다' : '완만해진다') : (right[1] > 0 ? '완만해진다' : '가팔라진다')}.`,
        facts: { truth: rows.map((r) => r === right), want: true } });
    }, { standard: S9 })
  ];

  B.addUnit({ id: '11-5-5', grade: 11, semester: 5, no: 5, title: '도함수의 활용', version: 1, groups: [
    { id: 'tan', title: '접선의 방정식', standard: S8, types: tan },
    { id: 'conv', title: '이계도함수와 곡선의 볼록·변곡점', standard: S9, types: conv },
    { id: 'graph', title: '함수의 그래프의 개형과 극값', standard: S9, types: [] },
    { id: 'maxmin', title: '함수의 최댓값과 최솟값', standard: S9, types: [] },
    { id: 'eq', title: '방정식에의 활용', standard: S10, types: [] },
    { id: 'ineq', title: '부등식에의 활용', standard: S10, types: [] },
    { id: 'motion', title: '평면 위를 움직이는 점의 속도와 가속도', standard: S11, types: [] }
  ] });
})(typeof window !== 'undefined' ? window : globalThis);
