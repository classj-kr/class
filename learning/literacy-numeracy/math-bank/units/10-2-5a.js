// 고등학교 1학년 2학기(공통수학2) 5단원 명제 — 단원 틀·도구와 앞쪽 묶음(명제와 조건, 「모든」·「어떤」을 포함한 명제, 명제 p → q의 참·거짓, 명제의 역과 대우).
// 수집해 둔 천재 T셀파 공통수학2 두 종(홍진곤·전인태, 2022 개정)의 교과서·평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1: 38꼴, 기본꼴 2: 38꼴, 심화꼴: 5꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 뺌(까닭) / 겹침」을 가른 대조표는 references/textbooks/수학/_분석/10-2-5/싣기_대조표.md 에 있다.
// (충분조건과 필요조건, 명제의 증명, 절대부등식은 10-2-5b.js 에, 실력 문항은 10-2-5c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
// 성취기준: [10공수2-02-04] 명제와 조건, 「모든」·「어떤」, 명제 p → q / [10공수2-02-05] 역과 대우 / [10공수2-02-06] 충분조건과 필요조건 /
//           [10공수2-02-07] 대우를 이용한 증명법과 귀류법 / [10공수2-02-08] 절대부등식.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(문장·식·진리집합의 관계·벤 다이어그램), 묻는 것(참·거짓, 부정, 진리집합, 상수, 고르기)이 다르면 따로 싣는다. 수만 다른 것은 한 번만 싣는다.
//  - 참·거짓은 모두 코드가 가린다. 실수 하나의 조건은 1/8 간격의 수(−40 ~ 40)에, 두 실수의 조건은 1/4 간격의 수(−6 ~ 6)의 짝에, 자연수·정수의 조건은 1 ~ 150, −150 ~ 150 에
//    넣어 보아 진리집합의 포함을 따진다(같음이 걸린 조건은 근이 정수가 되게 지었다). 기호 p, q, r 만으로 된 명제와 집합의 관계는 진리집합 P, Q, R 이 나누는 영역 가운데
//    어느 것이 비어 있는지를 모두(두 집합 16가지, 세 집합 256가지) 따져 「항상」 옳은지를 가린다. 「정의」, 「무리수」처럼 셈으로 가릴 수 없는 문장만 참·거짓을 적어 두었다.
//  - 답: 상수·값은 부호 단추가 붙은 칸(개수·합처럼 음수일 수 없는 것만 단추 없이), 진리집합의 구간은 「{x | [±][ ] [부등호] x [부등호] [±][ ]}」, 여럿을 고르는 것은 「모두 고른 것」 고르기.
//    원문의 「a + b의 값」「M + m의 값」「최솟값과 그때의 x의 값의 합」처럼 따로 구한 값을 더한 꼴은 값을 칸마다 따로 받는다.
//    늘 같은 답이 나오는 원문(반례의 최솟값 6, 카드 D와 5 …)도 수와 말을 바꾸어 답이 달라지게 지었다.
//  - 명제 기호는 글로 적는다: →(명제), ⇒·⇔(충분·필요), ∼(부정). 조건의 이름 p, q, r 과 진리집합 P, Q, R, U 는 기울인 글자로 적는다.
//
// 뺀 것과 까닭(10-2-5b.js, 10-2-5c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 증명 전체를 쓰게 하는 서술형(②25 — 대우·귀류법 증명 열세 가지, ②31 — 절대부등식 증명 열두 가지): 교육과정이 「간단한 것만 다룬다」고 못 박았고 답만으로 채점할 수 없다.
//    같은 증명의 대우·처음 가정 고르기(②25 → prove-start), 등호가 성립하는 조건 고르기(②31 → ineq-equal)로 바꾸어 실었다. 빈칸을 채우는 꼴(②21~24·29·30)은 원문 그대로 실었다.
//  - 용어의 정의를 쓰게 하는 것(②20의 서술): 「정의로 옳은 것 고르기」로 바꾸었다.
//  - 문제 만들기·놀이·활동: 「모든」·「어떤」을 포함한 실생활 명제 만들기, 공학 도구 활동, 송편 자리 맞히기(①38의 변형 — 진술 퍼즐 꼴은 실었다), 수행과제 카드 짝짓기(①32의 변형 — 역·대우의 참·거짓은 실었다).
//  - 겹침: 심3(→ ①36), ②37 과 심5 는 얼개가 같으나 평면(정사각형)과 공간(직육면체 대각선)이라 둘 다 실었다.
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」
// 문자를 부르는 말: 값 하나를 물으면 「상수 a」, 범위·최댓값·최솟값을 물으면 「실수 a」(정수·자연수로 묶이는 것은 그대로, 양수로 묶이는 것은 「(단, a > 0)」으로 적는다).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, frac, lines, N, M, C, F, inline } = B.kit;
  const { MINUS, Q, tx, nb, V, sup, poly, gcd, range, rt } = B.kit.mid;
  const UNIT = '10-2-5';
  const STD = { prop: '10공수2-02-04', conv: '10공수2-02-05', cond: '10공수2-02-06', proof: '10공수2-02-07', ineq: '10공수2-02-08' };
  const sourceOf = (ref) => '수집본 ' + (/[①②]/.test(ref) ? (/심/.test(ref) ? '기본·심화' : '기본') : '심화') + ' 자료(' + ref + ')';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: sourceOf(ref), make }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: sourceOf(ref), make }, more || {});

  // ════════════════════════════════════════════════════════════════
  // ── 글 ──
  const X = V('x'), Yv = V('y'), Av = V('a'), Bv = V('b'), Cv = V('c'), Kv = V('k'), Mv = V('m'), Nv = V('n');
  const pV = V('p'), qV = V('q'), rV = V('r'), PS = V('P'), QS = V('Q'), RS = V('R'), US = V('U');
  const NOT = '∼', TO = '→', IMP = '⇒', IFF = '⇔', EMPTY = '∅';
  const sq = (h) => h + sup(2);
  const num = (n) => (n < 0 ? MINUS + Math.abs(n) : String(n));                 // 정수
  const numH = (v) => (Number.isInteger(v) ? num(v) : tx(Q(Math.round(v * 8), 8)));   // 1/8 의 배수까지
  const par = (n) => (n < 0 ? '(' + num(n) + ')' : num(n));                    // 식 속의 수(음수는 괄호)
  const jn = (n) => (n < 0 ? '(' + n + ')' : String(n));                       // 검사 식에 적는 수
  const quo = (h) => '‘' + h + '’';                                             // 문장·조건을 감싸는 따옴표
  const cond = (name, h) => quo(V(name) + ': ' + h);                             // ‘p: x > 3’
  const roster = (list) => nb('{' + list.map(num).join(', ') + '}');            // {−2, −1, 0}
  const setOf = (list) => (list.length ? roster(list) : EMPTY);
  const polyH = (c2, c1, c0, v) => poly([[c2, sq(v || X)], [c1, v || X], [c0, '']]);
  const linH = (c1, c0, v) => poly([[c1, v || X], [c0, '']]);
  const absH = (c, v) => '|' + (c === 0 ? (v || X) : linH(1, -c, v)) + '|';    // |x − 3|
  // 토씨: 글의 마지막 소리(숫자·한글·로마자·위첨자)에 맞춘다. 로마자는 l·m·n·r(엘·엠·엔·알)만 받침이 있다.
  function ej(h, pair) {
    const [w, wo] = pair.split('/');
    // 분수는 분자를 나중에 읽는다(사분의 삼): 빗금과 분모를 지우고 본다.
    const s = String(h).replace(/<span class="mb-frac-bar">\/<\/span><span>(?:(?!<\/span>)[\s\S])*<\/span>/g, '').replace(/(<\/(?:span|i)>|[’.)\]|\s])+$/g, '');
    if (/<\/sup>$/.test(s)) return h + w;
    const t = s.replace(/<[^>]+>/g, '').replace(/[’.)\]|\s]+$/, ''), last = t[t.length - 1] || '';
    if (/\d/.test(last)) return h + josa(Number(/\d+$/.exec(t)[0]), pair).replace(/^\d+/, '');
    if (/[가-힣]/.test(last)) return h + josa(last, pair).slice(1);
    if (last === EMPTY) return h + (w === '으로' ? '으로' : w);
    return h + ('lmnrLMNR'.includes(last) ? (w === '으로' && /[lL]/.test(last) ? '로' : w) : wo);
  }
  const lj = (name, pair) => ej(V(name), pair);
  // 따로 구한 수를 칸마다 받는다. rows: [이름표, 답, 검사 식(없으면 null), 부호 단추를 붙이는가]
  function slots(text, rows, o) {
    const opt = o || {}, calc = rows.map((r, i) => [r[2], i]).filter(([e]) => e);
    return M(text, rows.map(([label, answer, , signedOn]) => Object.assign({ label, answer: answer + 0 }, signedOn === false ? {} : { signed: true })), {
      figure: opt.figure, explain: opt.explain, unordered: opt.unordered,
      facts: Object.assign(calc.length ? { calc } : {}, opt.unseen ? { unseen: opt.unseen } : {}, opt.rule ? { rule: opt.rule } : {}, opt.check ? { check: opt.check } : {})
    });
  }
  // 수 하나(부호 단추는 o.signed === false 일 때만 뺀다)
  const numQ = (text, answer, o) => N(text, answer + 0, { signed: o.signed !== false, figure: o.figure, unit: o.unit, explain: o.explain,
    facts: Object.assign(o.calc ? { calc: [[o.calc, 0]] } : {}, o.unseen ? { unseen: o.unseen } : {}, o.rule ? { rule: o.rule } : {}, o.check ? { check: o.check } : {}) });

  // ── 보기 짜기 ──
  const GA = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ'];
  const bogi = (list) => lines(list.map((h, i) => '<span class="mb-tag mb-tag-short">' + GA[i] + '.</span>' + h));
  // 「옳은 것만을 있는 대로 고른 것」: rows 는 { h 글, ok 옳은가, why 까닭 }. 옳은 묶음 하나와, 하나를 빼거나 더하거나 바꾼 틀린 묶음을 섞어 다섯(보기 셋 이상) 또는 넷.
  function setsQ(d, text, rows, o) {
    const opt = o || {}, labels = GA.slice(0, rows.length), flags = rows.map((r) => Boolean(r.ok));
    if (!flags.some(Boolean) || flags.every(Boolean)) throw new Error('옳은 것이 없거나 모두 옳다');
    const key = (s) => s.join('|'), right = labels.filter((_, i) => flags[i]), near = [], far = [];
    labels.forEach((_, i) => { const t = labels.filter((__, j) => (j === i ? !flags[j] : flags[j])); if (t.length) near.push(t); });
    labels.forEach((_, i) => labels.forEach((__, j) => { if (flags[i] && !flags[j]) near.push(labels.filter((___, k) => (k === i ? false : k === j ? true : flags[k]))); }));
    for (let m = 1; m < (1 << labels.length); m += 1) far.push(labels.filter((_, k) => (m >> k) & 1));
    const want = opt.count || (labels.length >= 3 ? 5 : 3), out = [right], seen = new Set([key(right)]);
    for (const cand of d.shuffle(near).concat(d.shuffle(far))) { if (out.length === want) break; if (!seen.has(key(cand))) { seen.add(key(cand)); out.push(cand); } }
    const sets = d.shuffle(out).sort((a, b) => a.length - b.length || key(a).localeCompare(key(b)));
    // 까닭이 같은 보기는 한데 묶는다(ㄱ, ㄴ. 주어진 명제에서 이끌어 낼 수 없다.)
    const groups = [];
    rows.forEach((r, i) => { if (!r.why) return; const g = groups.find((x) => x.why === r.why); if (g) g.at.push(labels[i]); else groups.push({ why: r.why, at: [labels[i]] }); });
    const why = groups.map((g) => g.at.join(', ') + '. ' + g.why).join(' ');
    return C(text, sets.map((s) => s.join(', ')), sets.findIndex((s) => key(s) === key(right)), {
      figure: (opt.figure || '') + bogi(rows.map((r) => r.h)),
      explain: (opt.lead ? opt.lead + ' ' : '') + why + ` 따라서 ${ej(opt.what || '옳은 것', '은/는')} ${right.join(', ')}이다.`,
      facts: Object.assign({ sets: { labels, flags, options: sets } }, opt.rule ? { rule: opt.rule } : {})
    });
  }
  // 하나 고르기: rows 가운데 ok 가 want 인 것이 꼭 하나다.
  function oneQ(d, text, rows, want, o) {
    const opt = o || {}, list = opt.keep ? rows.slice() : d.shuffle(rows);
    if (list.filter((r) => r.ok === want).length !== 1) throw new Error('답이 하나가 아니다');
    const at = list.findIndex((r) => r.ok === want);
    return C(text, list.map((r) => r.h), at, {
      figure: opt.figure, explain: (typeof opt.explain === 'function' ? opt.explain(list, at) : opt.explain) || list[at].why || '',
      facts: Object.assign({ truth: list.map((r) => r.ok), want }, opt.rule ? { rule: opt.rule } : {})
    });
  }

  // ════════════════════════════════════════════════════════════════
  // ── 조건(실수·정수의 변수) ──
  // 조건은 at(왼쪽 글, 관계, 오른쪽 수, 값 함수) — 「x² − 5x ≤ 0」, iv(변수, 아래 끝, 위 끝, 아래 끝 포함, 위 끝 포함) — 「−1 < x ≤ 3」,
  // pr(글, 부정의 글, 참·거짓 함수) — 말로 된 조건, OR(…)·AND(…). 값 함수는 변수 묶음 e({ x, y, … })를 받는다.
  const OPH = { '<': '&lt;', '<=': '≤', '>': '&gt;', '>=': '≥', '=': '=', '!=': '≠' };
  const OPF = { '<': (u, v) => u < v, '<=': (u, v) => u <= v, '>': (u, v) => u > v, '>=': (u, v) => u >= v, '=': (u, v) => u === v, '!=': (u, v) => u !== v };
  const NEG = { '<': '>=', '<=': '>', '>': '<=', '>=': '<', '=': '!=', '!=': '=' };
  const at = (lhs, op, c, val) => ({ k: 'at', lhs, op, c, val });
  const iv = (v, lo, hi, lc, hc) => ({ k: 'iv', v, lo, hi, lc, hc });
  const pr = (h, nh, f) => ({ k: 'pr', h, nh, f });
  const OR = (...list) => ({ k: 'or', list }), AND = (...list) => ({ k: 'and', list });
  const xr = (op, c) => at(X, op, c, (e) => e.x);                      // x > c
  const vr = (name, op, c) => at(V(name), op, c, (e) => e[name]);      // a ≥ 1
  const xpoly = (c2, c1, c0, op, c) => at(polyH(c2, c1, c0), op, c || 0, (e) => c2 * e.x * e.x + c1 * e.x + c0);
  const xabs = (c0, op, r) => at(absH(c0), op, r, (e) => Math.abs(e.x - c0));
  function cH(c) {
    if (c.k === 'at') return nb(`${c.lhs} ${OPH[c.op]} ${numH(c.c)}`);
    if (c.k === 'iv') return nb(`${numH(c.lo)} ${c.lc ? '≤' : '&lt;'} ${V(c.v)} ${c.hc ? '≤' : '&lt;'} ${numH(c.hi)}`);
    if (c.k === 'pr') return c.h;
    return c.list.map(cH).join(c.k === 'or' ? ' 또는 ' : '이고 ');
  }
  function cF(c, e) {
    if (c.k === 'at') return OPF[c.op](c.val(e), c.c);
    if (c.k === 'iv') { const x = e[c.v]; return (c.lc ? x >= c.lo : x > c.lo) && (c.hc ? x <= c.hi : x < c.hi); }
    if (c.k === 'pr') return c.f(e);
    return c.k === 'or' ? c.list.some((t) => cF(t, e)) : c.list.every((t) => cF(t, e));
  }
  function cN(c) {
    if (c.k === 'at') return at(c.lhs, NEG[c.op], c.c, c.val);
    if (c.k === 'iv') return OR(at(V(c.v), c.lc ? '<' : '<=', c.lo, (e) => e[c.v]), at(V(c.v), c.hc ? '>' : '>=', c.hi, (e) => e[c.v]));
    if (c.k === 'pr') return pr(c.nh, c.h, (e) => !c.f(e));
    return c.k === 'or' ? AND(...c.list.map(cN)) : OR(...c.list.map(cN));
  }
  // 넣어 볼 수
  const RX = range(-320, 320).map((k) => ({ x: k / 8 }));
  const NX = range(1, 150).map((x) => ({ x }));
  const ZX = range(-150, 150).map((x) => ({ x }));
  const grid2 = (u, w, step, lim) => { const out = []; for (let i = -lim; i <= lim; i += 1) for (let j = -lim; j <= lim; j += 1) out.push({ [u]: i / step, [w]: j / step }); return out; };
  const R2 = { xy: grid2('x', 'y', 4, 24), ab: grid2('a', 'b', 4, 24) };
  const grid3 = (() => { const out = [], vs = range(-6, 6).map((k) => k / 2); for (const a of vs) for (const b of vs) for (const c of vs) out.push({ a, b, c }); return out; })();
  // 반례로 보일 수는 쉬운 것부터 고른다: 정수 먼저, 절댓값이 작은 것, 양수 먼저
  const niceKey = (e) => Object.values(e).reduce((s, v) => s + ([1, 2, 4, 8].find((q) => Number.isInteger(v * q)) || 16) * 1000 + Math.abs(v) * 2 + (v < 0 ? 1 : 0), 0);
  const NICE = new Map();
  const nice = (S) => { if (!NICE.has(S)) NICE.set(S, S.slice().sort((u, w) => niceKey(u) - niceKey(w))); return NICE.get(S); };
  const holdsAll = (c, S) => S.every((e) => cF(c, e));
  const holdsSome = (c, S) => S.some((e) => cF(c, e));
  const implies = (p, q, S) => S.every((e) => !cF(p, e) || cF(q, e));
  const sameSet = (p, q, S) => S.every((e) => cF(p, e) === cF(q, e));
  // 두 조건 p, q 의 관계: 'iff' P = Q, 'suff' P ⊂ Q, 'nec' Q ⊂ P, 'none'
  const relOf = (p, q, S) => { const a = implies(p, q, S), b = implies(q, p, S); return a && b ? 'iff' : a ? 'suff' : b ? 'nec' : 'none'; };
  const isPrime = (n) => { if (n < 2) return false; for (let k = 2; k * k <= n; k += 1) if (n % k === 0) return false; return true; };
  const divisors = (n) => range(1, n).filter((k) => n % k === 0);

  // ── 기호 p, q, r 과 진리집합 P, Q, R(벤 다이어그램의 영역) ──
  // 집합 식: 0·1·2 는 P·Q·R, 'U', 'E'(공집합), { c } 여집합, { u: […] } 합집합, { i: […] } 교집합, { d: [A, B] } 차집합.
  // 영역 k(0 ~ 2ⁿ − 1)의 비트 j 는 「집합 j 에 든다」. 식의 값은 그 식에 드는 영역의 묶음(비트 마스크)이다.
  function maskOf(e, n) {
    const R = 1 << n, ALL = (1 << R) - 1;
    if (typeof e === 'number') { let m = 0; for (let k = 0; k < R; k += 1) if ((k >> e) & 1) m |= 1 << k; return m; }
    if (e === 'U') return ALL;
    if (e === 'E') return 0;
    if (e.c !== undefined) return ALL & ~maskOf(e.c, n);
    if (e.u) return e.u.reduce((m, t) => m | maskOf(t, n), 0);
    if (e.i) return e.i.reduce((m, t) => m & maskOf(t, n), ALL);
    return maskOf(e.d[0], n) & ~maskOf(e.d[1], n) & ALL;
  }
  const SETN = [PS, QS, RS];
  function sH(e, inner) {
    if (typeof e === 'number') return SETN[e];
    if (e === 'U') return US;
    if (e === 'E') return EMPTY;
    if (e.c !== undefined) return (typeof e.c === 'number' ? SETN[e.c] : '(' + sH(e.c) + ')') + sup('C');
    const body = e.u ? e.u.map((t) => sH(t, true)).join(' ∪ ') : e.i ? e.i.map((t) => sH(t, true)).join(' ∩ ') : sH(e.d[0], true) + ' − ' + sH(e.d[1], true);
    return inner ? '(' + body + ')' : body;
  }
  // 관계: ['sub', A, B] A ⊂ B, ['nsub', A, B], ['eq', A, B], ['ne', A] A ≠ ∅, ['emp', A] A = ∅
  function relHolds(r, cfg, n) {
    const m = (e) => maskOf(e, n) & cfg;
    if (r[0] === 'sub') return (m(r[1]) & ~m(r[2])) === 0;
    if (r[0] === 'nsub') return (m(r[1]) & ~m(r[2])) !== 0;
    if (r[0] === 'eq') return m(r[1]) === m(r[2]);
    if (r[0] === 'ne') return m(r[1]) !== 0;
    return m(r[1]) === 0;
  }
  const RELH = { sub: ' ⊂ ', nsub: ' ⊄ ', eq: ' = ' };
  const rH = (r) => nb(r[0] === 'ne' ? sH(r[1]) + ' ≠ ' + EMPTY : r[0] === 'emp' ? sH(r[1]) + ' = ' + EMPTY : sH(r[1]) + RELH[r[0]] + sH(r[2]));
  // hyps 를 모두 만족하는 배치마다 r 이 성립하는가(배치가 하나도 없으면 오류)
  function always(hyps, r, n) {
    const R = 1 << n; let any = false;
    for (let cfg = 1; cfg < (1 << R); cfg += 1) {
      if (!hyps.every((h) => relHolds(h, cfg, n))) continue;
      any = true;
      if (!relHolds(r, cfg, n)) return false;
    }
    if (!any) throw new Error('가정을 만족하는 경우가 없다');
    return true;
  }
  // 조건 기호: 리터럴 { v: 0|1|2, neg } → p, ∼q. 묶음 { or: [L…] }, { and: [L…] }.
  const LIT = [pV, qV, rV];
  const L = (v, neg) => ({ v, neg: Boolean(neg) });
  const lH = (l) => (l.or ? l.or.map(lH).join(' 또는 ') : l.and ? l.and.map(lH).join('이고 ') : (l.neg ? NOT : '') + LIT[l.v]);
  const lS = (l) => (l.or ? { u: l.or.map(lS) } : l.and ? { i: l.and.map(lS) } : l.neg ? { c: l.v } : l.v);
  const wrapL = (l) => (l.or || l.and ? '(' + lH(l) + ')' : lH(l));
  const impH = (a, b) => nb(wrapL(a) + ' ' + TO + ' ' + wrapL(b));
  const impR = (a, b) => ['sub', lS(a), lS(b)];                       // 명제 a → b 가 참 ⟺ (a 의 진리집합) ⊂ (b 의 진리집합)
  const negL = (l) => L(l.v, !l.neg);

  // ════════════════════════════════════════════════════════════════
  // ── 그림 ──
  const INK = '#1f2933', BLUE = '#1d4ed8';
  const svg = (w, h, aria, body) => `<svg class="mb-geo" viewBox="0 0 ${w} ${h}" width="${w}" role="img" aria-label="${aria}">${body}</svg>`;
  const IT = "font-style:italic;font-family:'MB Math','Times New Roman',serif";
  const word = (x, y, text, o) => `<text x="${x}" y="${y}" text-anchor="${(o && o.anchor) || 'middle'}" style="font-size:${(o && o.size) || 13}px;font-weight:${(o && o.weight) || 600};fill:${(o && o.color) || INK}${o && o.italic ? ';' + IT : ''}">${text}</text>`;
  // 벤 다이어그램: 직사각형 U 안에 원(집합). sets: [{ name, cx, cy, r }], dots: [{ name, x, y }]. 영역마다 비어 있지 않은 곳을 그림에서 재어 낸다.
  const W0 = 250, H0 = 168, PAD = 8;
  const inC = (s, x, y) => (x - s.cx) ** 2 + (y - s.cy) ** 2 < s.r * s.r;
  const codeAt = (sets, x, y) => sets.reduce((m, s, j) => m | (inC(s, x, y) ? 1 << j : 0), 0);
  // 영역마다 경계에서 가장 먼 점(점을 찍을 자리)과 그 여유
  function regionSpots(sets) {
    const best = {};
    for (let x = PAD + 6; x <= W0 - PAD - 6; x += 2) for (let y = PAD + 6; y <= H0 - PAD - 6; y += 2) {
      const code = codeAt(sets, x, y);
      const clear = Math.min(x - PAD, W0 - PAD - x, y - PAD, H0 - PAD - y, ...sets.map((s) => Math.abs(Math.hypot(x - s.cx, y - s.cy) - s.r)));
      if (!best[code] || clear > best[code].clear) best[code] = { x, y, clear };
    }
    return best;
  }
  // 점과 이름표를 함께 놓을 자리: 이름표(오른쪽·왼쪽·위·아래)까지 같은 영역 안에 들고, 선에서 가장 먼 곳
  const LABEL_BOX = { right: [5, 14, -6, 5], left: [-14, -5, -6, 5], up: [-4, 4, -16, -6], down: [-4, 4, 5, 15] };
  // 같은 원 배치는 한 번만 잰다(재는 데 시간이 든다)
  const DOT_SPOTS = new Map();
  function dotSpots(sets) {
    const key = JSON.stringify(sets.map((t) => [t.cx, t.cy, t.r]));
    if (!DOT_SPOTS.has(key)) DOT_SPOTS.set(key, measureDots(sets));
    return DOT_SPOTS.get(key);
  }
  function measureDots(sets) {
    const best = {}, edge = (x, y) => Math.min(x - PAD, W0 - PAD - x, y - PAD, H0 - PAD - y, ...sets.map((s) => Math.abs(Math.hypot(x - s.cx, y - s.cy) - s.r)));
    for (let x = PAD + 4; x <= W0 - PAD - 4; x += 1) for (let y = PAD + 4; y <= H0 - PAD - 4; y += 1) {
      const code = codeAt(sets, x, y), dotClear = edge(x, y) - 2.6;
      if (dotClear < 2) continue;
      for (const side of Object.keys(LABEL_BOX)) {
        const [x0, x1, y0, y1] = LABEL_BOX[side]; let clear = dotClear, ok = true;
        for (let u = x0; u <= x1 && ok; u += 3) for (let v = y0; v <= y1; v += 3) { const px = x + u, py = y + v; if (codeAt(sets, px, py) !== code || px < PAD || px > W0 - PAD || py < PAD || py > H0 - PAD) { ok = false; break; } clear = Math.min(clear, edge(px, py)); }
        // 이름표는 옆(오른쪽·왼쪽)에 두는 쪽을 앞세운다 — 위·아래에 두면 이웃한 점의 이름표와 헷갈린다
        const score = clear + (side === 'right' ? 6 : side === 'left' ? 5 : 0);
        if (ok && (!best[code] || score > best[code].score)) best[code] = { x, y, clear, side, score };
      }
    }
    return best;
  }
  // 그림에서 비어 있지 않은 영역의 묶음(비트 마스크) — 여유 4 px 이상인 영역만 센다.
  const cfgOf = (sets) => { const spots = regionSpots(sets); let cfg = 0; for (const k of Object.keys(spots)) if (spots[k].clear >= 4) cfg |= 1 << Number(k); return cfg; };
  function vennFig(sets, dots, aria) {
    let body = `<rect x="${PAD}" y="${PAD}" width="${W0 - 2 * PAD}" height="${H0 - 2 * PAD}" style="fill:#fff;stroke:${INK};stroke-width:1.4"/>` + word(PAD + 10, PAD + 15, 'U', { italic: true, size: 14 });
    for (const s of sets) body += `<circle cx="${s.cx}" cy="${s.cy}" r="${s.r}" style="fill:rgba(37,99,235,0.06);stroke:${INK};stroke-width:1.4"/>`;
    for (const s of sets) body += word(s.lx, s.ly, s.name, { italic: true, size: 14 });
    const at = { right: [7, 4.5, 'start'], left: [-7, 4.5, 'end'], up: [0, -7, 'middle'], down: [0, 14, 'middle'] };
    for (const t of dots || []) { const [dx, dy, anchor] = at[t.side || 'right']; body += `<circle cx="${t.x}" cy="${t.y}" r="2.6" style="fill:${INK}"/>` + word(t.x + dx, t.y + dy, t.name, { anchor, size: 13, italic: true }); }
    return svg(W0, H0, aria, body);
  }


  // ════════════════════════════════════════════════════════════════
  // ── 문장 모음: 명제(참·거짓은 코드가 셈한다)와 명제가 아닌 것 ──
  const tv = (t) => (t ? '참' : '거짓');
  const stmt = (a, b) => `${a}이면 ${b}이다.`;
  const noDot = (h) => String(h).replace(/\.$/, '');
  // 수에 관한 짧은 명제: kind 의 꼴로, 참·거짓이 want 인 것을 만든다(참·거짓은 셈으로 가린다).
  function simpleProp(d, kind, want) {
    return d.until(() => {
      if (kind === 'sum') { const a = d.int(2, 9), b = d.int(2, 9), c = a + b + (want ? 0 : d.pick([1, -1, 2])); return { h: `${a} + ${b} = ${c}`, truth: a + b === c, why: `${a} + ${b} = ${a + b}이므로 ${tv(a + b === c)}인 명제이다.` }; }
      if (kind === 'prime' || kind === 'comp') {
        const n = d.int(11, 59), f = range(2, n).find((t) => n % t === 0), t = kind === 'prime' ? isPrime(n) : !isPrime(n);
        return { h: `${josa(n, '은/는')} ${kind === 'prime' ? '소수' : '합성수'}이다.`, truth: t, why: isPrime(n) ? `${n}의 약수는 1과 ${n}뿐이므로 ${tv(t)}인 명제이다.` : `${n} = ${f} × ${n / f}이므로 ${tv(t)}인 명제이다.` };
      }
      if (kind === 'div') { const m = d.int(3, 9), big = d.int(12, 60); return { h: `${josa(m, '은/는')} ${big}의 약수이다.`, truth: big % m === 0, why: big % m === 0 ? `${big} = ${m} × ${big / m}이므로 참인 명제이다.` : `${josa(big, '은/는')} ${josa(m, '으로/로')} 나누어떨어지지 않으므로 거짓인 명제이다.` }; }
      if (kind === 'mult') { const m = d.int(3, 9), big = d.int(12, 60); return { h: `${josa(big, '은/는')} ${m}의 배수이다.`, truth: big % m === 0, why: big % m === 0 ? `${big} = ${m} × ${big / m}이므로 참인 명제이다.` : `${josa(big, '은/는')} ${josa(m, '으로/로')} 나누어떨어지지 않으므로 거짓인 명제이다.` }; }
      if (kind === 'odd') { const n = d.int(11, 99); return { h: `${josa(n, '은/는')} 홀수이다.`, truth: n % 2 === 1, why: `${josa(n, '은/는')} ${n % 2 ? '홀수' : '짝수'}이므로 ${tv(n % 2 === 1)}인 명제이다.` }; }
      const l1 = d.pick([4, 6, 8, 9, 10]), l2 = d.pick([6, 9, 12, 15]), lcm = l1 * l2 / gcd(l1, l2), lc = want ? lcm : d.pick([l1 * l2, lcm * 2, gcd(l1, l2)]);
      return { h: `${josa(l1, '과/와')} ${l2}의 최소공배수는 ${lc}이다.`, truth: lc === lcm, why: `${josa(l1, '과/와')} ${l2}의 최소공배수는 ${lcm}이므로 ${tv(lc === lcm)}인 명제이다.` };
    }, (s) => s.truth === want);
  }
  // 여러 꼴의 명제(참·거짓을 섞어)
  function propPool(d) {
    const out = ['sum', 'prime', 'div', 'lcm'].map((kind) => Object.assign({ tag: kind }, simpleProp(d, kind, d.bool())));
    const [s1, s2] = d.shuffle([2, 3, 5, 7]), k = d.int(2, 6);
    const prod = Math.abs(Math.sqrt(s1) * Math.sqrt(s2) - Math.sqrt(s1 * s2)) < 1e-9, sum = Math.abs(Math.sqrt(s1) + Math.sqrt(s2) - Math.sqrt(s1 + s2)) < 1e-9;
    if (d.bool()) out.push({ h: `${rt(s1)} × ${rt(s2)} = ${rt(s1 * s2)}`, truth: prod, tag: 'root', why: `양수 ${Av}, ${Bv}에 대하여 ${rt(Av)} × ${rt(Bv)} = ${rt(Av + Bv)}이므로 ${tv(prod)}인 명제이다.` });
    else out.push({ h: `${rt(s1)} + ${rt(s2)} = ${rt(s1 + s2)}`, truth: sum, tag: 'root', why: `(${rt(s1)} + ${rt(s2)})${sup(2)} = ${s1 + s2} + 2${rt(s1 * s2)}이므로 ${tv(sum)}인 명제이다.` });
    const fwd = implies(xr('=', k), xpoly(1, 0, 0, '=', k * k), RX), back = implies(xpoly(1, 0, 0, '=', k * k), xr('=', k), RX);
    if (d.bool()) out.push({ h: stmt(`${X} = ${k}`, `${sq(X)} = ${k * k}`), truth: fwd, tag: 'if', why: `${X} = ${k}이면 ${sq(X)} = ${k * k}이므로 ${tv(fwd)}인 명제이다.` });
    else out.push({ h: stmt(`${sq(X)} = ${k * k}`, `${X} = ${k}`), truth: back, tag: 'if', why: `${X} = ${MINUS}${k}이면 ${sq(X)} = ${k * k}이지만 ${X} ≠ ${k}이므로 ${tv(back)}인 명제이다.` });
    const all1 = holdsAll(xpoly(1, 0, 0, '>=', 0), RX), all2 = holdsAll(xabs(0, '>', 0), RX);
    if (d.bool()) out.push({ h: `모든 실수 ${X}에 대하여 ${sq(X)} ≥ 0이다.`, truth: all1, tag: 'all', why: `실수의 제곱은 0 이상이므로 ${tv(all1)}인 명제이다.` });
    else out.push({ h: `모든 실수 ${X}에 대하여 |${X}| &gt; 0이다.`, truth: all2, tag: 'all', why: `${X} = 0이면 |${X}| = 0이므로 ${tv(all2)}인 명제이다.` });
    return out;
  }
  // 말로만 정해지는 명제(참·거짓과 까닭을 적어 둔다)
  const FACTS = [
    { h: '소수는 모두 홀수이다.', truth: false, why: '2는 짝수인 소수이므로 거짓인 명제이다.' },
    { h: '정사각형의 네 변의 길이는 모두 같다.', truth: true, why: '정사각형은 네 변의 길이가 모두 같은 사각형이므로 참인 명제이다.' },
    { h: '삼각형의 세 내각의 크기의 합은 180°이다.', truth: true, why: '삼각형의 세 내각의 크기의 합은 180°이므로 참인 명제이다.' },
    { h: '모든 직사각형은 정사각형이다.', truth: false, why: '이웃한 두 변의 길이가 다른 직사각형은 정사각형이 아니므로 거짓인 명제이다.' }
  ].map((t) => Object.assign({ tag: 'fact' }, t));
  const vaguePool = (d) => [
    { h: `${josa(d.pick([100, 500, 999, 10000]), '은/는')} 큰 수이다.`, why: '「큰 수」의 기준이 분명하지 않아 참, 거짓을 판별할 수 없으므로 명제가 아니다.' },
    { h: `${d.pick(['0.1', '0.01', '0.001'])}은 작은 수이다.`, why: '「작은 수」의 기준이 분명하지 않아 참, 거짓을 판별할 수 없으므로 명제가 아니다.' },
    { h: '백두산은 높은 산이다.', why: '「높은 산」의 기준이 분명하지 않아 명제가 아니다.' },
    { h: '코스모스는 아름다운 꽃이다.', why: '「아름다운」의 기준이 사람마다 달라 명제가 아니다.' },
    { h: '서울에는 많은 사람이 산다.', why: '「많은」의 기준이 분명하지 않아 명제가 아니다.' }
  ].map((t) => Object.assign({ tag: 'vague' }, t));
  const condPool = (d) => {
    const a = d.int(2, 9), b = d.int(10, 19), m = d.int(3, 9), why = `${X}의 값에 따라 참, 거짓이 달라지므로 명제가 아니다(조건이다).`;
    return [
      { h: `${X} + ${a} = ${b}`, why }, { h: `${X} − ${a} &lt; 0`, why }, { h: `${X}는 ${m}의 배수이다.`, why }, { h: `${a}${X} = ${a * m}`, why }
    ].map((t) => Object.assign({ tag: 'cond' }, t));
  };

  // ════════════════════════════════════════════════════════════════
  // ── 명제와 조건 ──
  const propTypes = [
    T('prop-which', '명제인 것 모두 고르기', '①1', (d) => {
      const props = d.shuffle(propPool(d)).slice(0, d.int(1, 2)).concat(d.bool() ? [d.pick(FACTS)] : []);
      const not = d.shuffle(vaguePool(d)).slice(0, 1).concat(d.shuffle(condPool(d)).slice(0, 3 - props.length));
      const rows = d.shuffle(props.map((p) => ({ h: p.h, ok: true, why: p.why })).concat(not.map((p) => ({ h: p.h, ok: false, why: p.why }))));
      return setsQ(d, '다음 보기에서 명제인 것만을 있는 대로 고른 것은?', rows, { lead: '참, 거짓을 분명하게 판별할 수 있는 문장이나 식이 명제이다(거짓이어도 명제이다).', what: '명제인 것' });
    }),
    T('prop-pick', '참인(거짓인) 명제 하나 고르기', '①2', (d, n) => {
      const want = n === 0;
      const got = d.until(() => {
        const pool = d.shuffle(propPool(d).concat(d.shuffle(FACTS).slice(0, 1)));
        const hit = pool.find((p) => p.truth === want), used = new Set([hit && hit.tag]), others = [];
        for (const p of pool) { if (others.length === 3) break; if (p.truth !== want && !used.has(p.tag)) { used.add(p.tag); others.push(p); } }
        return { hit, others };
      }, (t) => t.hit && t.others.length === 3);
      const extra = d.pick(d.bool() ? vaguePool(d) : condPool(d));
      const rows = [{ h: got.hit.h, ok: true }].concat(got.others.map((p) => ({ h: p.h, ok: false })), [{ h: extra.h, ok: false }]);
      return oneQ(d, want ? '다음 중 참인 명제는?' : '다음 중 거짓인 명제는?', rows, true, {
        explain: `${got.hit.why} ${ej(quo(noDot(extra.h)), '은/는')} ${extra.why} 나머지는 ${tv(!want)}인 명제이다.`,
        rule: want ? 'true-prop' : 'false-prop'
      });
    }, { count: 2 }),
    T('prop-negate', '명제의 부정과 그 참·거짓', '①3', (d, n) => {
      if (n === 0) {
        // 부등식 명제: <의 부정은 ≥(> 가 아니다)
        const a = d.int(2, 19), b = d.until(() => d.int(2, 19), (v) => v !== a), op = d.pick(['<', '>', '<=', '>=']);
        const ng = NEG[op], truthOf = (o) => OPF[o](a, b), FLIP = { '<': '>', '>': '<', '<=': '>=', '>=': '<=' };
        const cands = d.shuffle([[ng, !truthOf(ng)], [FLIP[op], truthOf(FLIP[op])], [FLIP[ng], truthOf(FLIP[ng])], [op, !truthOf(op)], [op, truthOf(op)]]);
        const seen = new Set([ng + truthOf(ng)]), rows = [{ h: `${quo(`${a} ${OPH[ng]} ${b}`)}, ${tv(truthOf(ng))}`, ok: true }];
        for (const [o, t] of cands) { const key = o + t; if (seen.has(key) || rows.length === 4) continue; seen.add(key); rows.push({ h: `${quo(`${a} ${OPH[o]} ${b}`)}, ${tv(t)}`, ok: o === ng && t === truthOf(ng) }); }
        return oneQ(d, `명제 ${quo(`${a} ${OPH[op]} ${b}`)}의 부정과 그 참, 거짓을 바르게 짝지은 것은?`, rows, true, {
          explain: `${OPH[op]}의 부정은 ${OPH[ng]}이므로 부정은 ${quo(`${a} ${OPH[ng]} ${b}`)}이고, 이것은 ${tv(truthOf(ng))}이다.`, rule: 'neg-ineq'
        });
      }
      // 다섯 명제 가운데 그 부정이 참인 것(= 거짓인 명제) 하나
      const kinds = d.shuffle(['sum', 'prime', 'comp', 'div', 'mult', 'odd', 'lcm']).slice(0, 5);
      const list = kinds.map((kind, i) => simpleProp(d, kind, i !== 0));
      return oneQ(d, '다음 명제 중 그 부정이 참인 것은?', list.map((p) => ({ h: p.h, ok: !p.truth })), true, {
        explain: `명제가 거짓이면 그 부정은 참이다. ${list[0].why} 나머지는 모두 참인 명제이므로 그 부정은 거짓이다.`, rule: 'neg-pick'
      });
    }, { count: 2 }),
    T('prop-truthset', '유한 전체집합에서 조건의 진리집합', '①4', (d, n) => {
      if (n === 0) {
        const Nn = d.int(8, 12), rin = d.int(2, Nn), rout = d.pick([d.int(-5, -1), d.int(Nn + 1, Nn + 4)]);
        const s = rin + rout, p = rin * rout, U = range(1, Nn), P = U.filter((x) => x * x - s * x + p === 0);
        const opts = [[rin], [Math.min(rin, rout), Math.max(rin, rout)], [rin, rin === Nn ? rin - 1 : rin + 1].sort((u, v) => u - v), [Math.abs(rout), rin].sort((u, v) => u - v), []];
        const seen = new Set(), rows = [];
        for (const o of opts) { const key = o.join(','); if (seen.has(key) || rows.length === 4) continue; seen.add(key); rows.push({ h: setOf(o), ok: key === P.join(',') }); }
        return oneQ(d, `전체집합 ${US} = {${X} | ${X}는 ${Nn} 이하의 자연수}일 때, 조건 ${cond('p', `${polyH(1, -s, p)} = 0`)}의 진리집합은?`, rows, true, {
          explain: `${polyH(1, -s, p)} = (${linH(1, -rin)})(${linH(1, -rout)}) = 0에서 ${X} = ${num(rin)} 또는 ${X} = ${num(rout)}이다. 이 가운데 ${US}의 원소는 ${rin}뿐이므로 진리집합은 {${rin}}이다.`, rule: 'set-eq'
        });
      }
      if (n === 1) {
        const a = d.int(-5, 0), b = a + d.int(4, 7), out = d.pick([a - 1, b + 1]), inside = d.shuffle(range(a, b)).slice(0, 4);
        const rows = inside.concat([out]).sort((u, v) => u - v).map((v) => ({ h: num(v), ok: !(v >= a && v <= b) }));
        return oneQ(d, `전체집합 ${US}가 정수 전체의 집합일 때, 다음 중 조건 ${cond('p', `${polyH(1, -(a + b), a * b)} ≤ 0`)}의 진리집합의 원소가 아닌 것은?`, rows, true, {
          keep: true, rule: 'set-notin',
          explain: `${polyH(1, -(a + b), a * b)} = (${linH(1, -a)})(${linH(1, -b)}) ≤ 0에서 ${num(a)} ≤ ${X} ≤ ${num(b)}이므로 진리집합은 {${num(a)}, ${num(a + 1)}, …, ${num(b)}}이다. 따라서 ${ej(num(out), '은/는')} 원소가 아니다.`
        });
      }
      const Nn = d.int(7, 10), kind = d.pick(['소수', '짝수', '3의 배수']), test = { 소수: isPrime, 짝수: (x) => x % 2 === 0, '3의 배수': (x) => x % 3 === 0 }[kind];
      const U = range(1, Nn), r2 = d.until(() => d.int(2, Nn), (v) => !test(v)), r1 = d.int(-4, -1), P = U.filter(test), Qs = U.filter((x) => (x - r1) * (x - r2) === 0);
      const PQ = U.filter((x) => P.includes(x) || Qs.includes(x)), sum = PQ.reduce((s, v) => s + v, 0);
      return numQ(`전체집합 ${US} = {${X} | ${X}는 ${Nn} 이하의 자연수}에 대하여 두 조건 ${pV}, ${qV}가 ${cond('p', `${X}는 ${kind}이다.`)}, ${cond('q', `(${linH(1, -r1)})(${linH(1, -r2)}) = 0`)}일 때, 조건 ${quo(`${pV} 또는 ${qV}`)}의 진리집합의 모든 원소의 합은?`, sum, {
        signed: false, calc: PQ.join('+'), unseen: PQ, rule: 'set-or',
        explain: `${pV}의 진리집합은 ${roster(P)}, ${qV}의 진리집합은 ${roster(Qs)}이다(${ej(num(r1), '은/는')} ${US}의 원소가 아니다). ${quo(`${pV} 또는 ${qV}`)}의 진리집합은 두 집합의 합집합 ${roster(PQ)}이므로 원소의 합은 ${sum}이다.`
      });
    }, { count: 3 }),
    T('prop-notset', '∼p의 진리집합의 원소의 합', '①5', (d, n) => {
      if (n === 0) {
        const g = d.until(() => {
          const lo = d.int(-3, 0), U = range(lo, lo + 5), c = d.pick(U.slice(1, -1)), r = d.int(1, 3);
          const P = U.filter((x) => Math.abs(x - c) === r), PC = U.filter((x) => !P.includes(x));
          return { U, c, r, P, PC, sum: PC.reduce((s, v) => s + v, 0) };
        }, (t) => t.P.length >= 1 && t.sum !== 0);
        return numQ(`전체집합 ${US} = ${roster(g.U)}에 대하여 조건 ${cond('p', `${absH(g.c)} = ${g.r}`)}일 때, 조건 ${NOT}${pV}의 진리집합의 모든 원소의 합은?`, g.sum, {
          calc: g.PC.map(jn).join('+'), rule: 'not-abs',
          explain: `${absH(g.c)} = ${g.r}에서 ${X} = ${num(g.c - g.r)} 또는 ${X} = ${num(g.c + g.r)}이므로 ${pV}의 진리집합은 ${roster(g.P)}이다. ${NOT}${pV}의 진리집합은 그 여집합 ${roster(g.PC)}이므로 원소의 합은 ${num(g.sum)}이다.`
        });
      }
      const g = d.until(() => {
        const Nn = d.int(5, 8), U = range(1, Nn), k = d.int(3, Nn * Nn - 2), big = d.bool();
        const P = U.filter((x) => (big ? x * x >= k : x * x < k)), PC = U.filter((x) => !P.includes(x));
        return { U, k, big, P, PC, sum: PC.reduce((s, v) => s + v, 0) };
      }, (t) => Math.sqrt(t.k) % 1 !== 0 && t.P.length >= 1 && t.PC.length >= 2);
      return numQ(`전체집합 ${US} = ${roster(g.U)}에 대하여 조건 ${cond('p', `${sq(X)} ${g.big ? '≥' : '&lt;'} ${g.k}`)}일 때, 조건 ${NOT}${pV}의 진리집합의 모든 원소의 합은?`, g.sum, {
        signed: false, calc: g.PC.join('+'), rule: 'not-square',
        explain: `${pV}의 진리집합은 ${roster(g.P)}이고 ${NOT}${pV}의 진리집합은 그 여집합 ${roster(g.PC)}이므로 원소의 합은 ${g.sum}이다.`
      });
    }, { count: 2 }),
    T('prop-combine', '두 조건으로 만든 조건의 진리집합', '①6', (d, n) => {
      if (n === 0) {
        // p: a1 ? x ? b1, q: a2 ? x ? b2 (a1 < a2 < b1 < b2) → 「p이고 ∼q」의 진리집합은 a1 ? x ? a2
        const a1 = d.int(-4, 1), a2 = a1 + d.int(2, 5), b1 = a2 + d.int(1, 4), b2 = b1 + d.int(1, 3);
        const [pl, ph, ql, qh] = [d.bool(), d.bool(), d.bool(), d.bool()];
        const p = iv('x', a1, b1, pl, ph), q = iv('x', a2, b2, ql, qh), shownSet = iv('x', a1, a2, pl, !ql);
        if (!sameSet(AND(p, cN(q)), shownSet, RX)) throw new Error('진리집합 셈이 어긋났다');
        return inline(`실수 전체의 집합에서 두 조건 ${cond('p', cH(p))}, ${cond('q', cH(q))}에 대하여 조건 ${quo(`${pV}이고 ${NOT}${qV}`)}의 진리집합을 구하시오.`,
          `{${X} | {0} {1} ${X} {2} {3}}`, [{ answer: a1, signed: true }, { rel: true, answer: pl ? '<=' : '<' }, { rel: true, answer: ql ? '<' : '<=' }, { answer: a2, signed: true }], {
            shown: `{${X} | ${cH(shownSet)}}`,
            explain: `${NOT}${qV}의 진리집합은 ${quo(cH(cN(q)))}이고, 이것과 ${pV}의 진리집합의 공통부분은 ${cH(shownSet)}이다. ${ej(num(a2), '은/는')} ${ql ? qV + '의 진리집합에 들어 있으므로 빠진다' : NOT + qV + '의 진리집합에 들어 있으므로 포함된다'}.`,
            facts: { calc: [[jn(a1), 0], [jn(a2), 3]], rule: 'comb-interval' }
          });
      }
      const g = d.until(() => {
        const lo = d.int(-3, -1), U = range(lo, lo + 5), k = d.int(2, 15), [r1, r2] = d.shuffle(U).slice(0, 2).sort((u, v) => u - v);
        const P = U.filter((x) => x * x >= k), Qs = U.filter((x) => (x - r1) * (x - r2) === 0), R = U.filter((x) => !P.includes(x) || !Qs.includes(x));
        return { U, k, r1, r2, P, Qs, R, sum: R.reduce((s, v) => s + v, 0) };
      }, (t) => Math.sqrt(t.k) % 1 !== 0 && t.P.length >= 1 && t.P.length < t.U.length && t.sum !== 0 && t.R.length < t.U.length);
      return numQ(`전체집합 ${US} = ${roster(g.U)}에 대하여 두 조건 ${cond('p', `${sq(X)} ≥ ${g.k}`)}, ${cond('q', `${polyH(1, -(g.r1 + g.r2), g.r1 * g.r2)} = 0`)}의 진리집합을 각각 ${PS}, ${QS}라고 할 때, 집합 ${PS}${sup('C')} ∪ ${QS}${sup('C')}의 모든 원소의 합은?`, g.sum, {
        calc: g.R.map(jn).join('+'), rule: 'comb-demorgan',
        explain: `${PS} = ${roster(g.P)}, ${QS} = ${roster(g.Qs)}이고 ${PS}${sup('C')} ∪ ${QS}${sup('C')} = (${PS} ∩ ${QS})${sup('C')} = ${roster(g.R)}이므로 원소의 합은 ${num(g.sum)}이다.`
      });
    }, { count: 2 }),
    T('prop-negrange', '범위로 주어진 조건의 부정', '①7', (d) => {
      const lo = d.int(-4, 2), hi = lo + d.int(2, 5), [lc, hc] = [d.bool(), d.bool()], inside = d.bool();
      const c = inside ? iv('x', lo, hi, lc, hc) : OR(xr(lc ? '<=' : '<', lo), xr(hc ? '>=' : '>', hi));
      const right = cN(c);
      const cands = [right,
        inside ? OR(xr(lc ? '<=' : '<', lo), xr(hc ? '>=' : '>', hi)) : iv('x', lo, hi, lc, hc),
        inside ? AND(xr(lc ? '<' : '<=', lo), xr(hc ? '>' : '>=', hi)) : OR(xr(lc ? '>' : '>=', lo), xr(hc ? '<' : '<=', hi)),
        inside ? OR(xr(lc ? '<' : '<=', lo), xr(hc ? '>=' : '>', hi)) : iv('x', lo, hi, !lc, !hc),
        inside ? OR(xr(lc ? '<=' : '<', lo), xr(hc ? '>' : '>=', hi)) : iv('x', lo, hi, lc, !hc)];
      const rows = [], seenH = new Set();
      for (const t of cands) {
        if (rows.length === 4) break;
        const h = cH(t);
        if (seenH.has(h) || rows.some((r) => sameSet(r.c, t, RX))) continue;
        seenH.add(h); rows.push({ h, c: t, ok: sameSet(t, cN(c), RX) });
      }
      return oneQ(d, `실수 ${X}에 대하여 조건 ${quo(cH(c))}의 부정은?`, rows, true, {
        explain: `부정은 주어진 조건을 만족시키지 않는 ${X}의 조건이므로 ${quo(cH(right))}이다. 등호가 붙는 쪽이 바뀌고 ${inside ? '「이고」가 「또는」으로' : '「또는」이 「이고」로'} 바뀐다.`
      });
    }),
    T('prop-demorgan', '「또는」·「그리고」 조건의 부정', '①8', (d, n) => {
      if (n === 0) {
        const a = d.int(-5, 4), b = d.until(() => d.int(-5, 5), (v) => v > a), form = d.pick(['or', 'and', 'prod']);
        const c = form === 'and' ? AND(xr('=', a), xr('=', b)) : OR(xr('=', a), xr('=', b));
        const shown = form === 'prod' ? `(${linH(1, -a)})(${linH(1, -b)}) = 0` : cH(c);
        const cands = [AND(xr('!=', a), xr('!=', b)), OR(xr('!=', a), xr('!=', b)), AND(xr('=', a), xr('=', b)), OR(xr('=', a), xr('!=', b)), AND(xr('!=', a), xr('=', b))];
        const right = cN(c), rows = [];
        for (const t of cands) { if (rows.length === 4) break; if (rows.some((r) => sameSet(r.c, t, RX))) continue; rows.push({ h: cH(t), c: t, ok: sameSet(t, right, RX) }); }
        if (!rows.some((r) => r.ok)) throw new Error('바른 부정이 보기에 없다');
        return oneQ(d, `실수 ${X}에 대하여 조건 ${quo(shown)}의 부정은?`, rows, true, {
          explain: `${form === 'prod' ? `${ej(quo(shown), '은/는')} ${quo(cH(c))}와 같고, ` : ''}${form === 'and' ? '「~이고 ~」' : '「~ 또는 ~」'}의 부정은 ${form === 'and' ? '각각을 부정하여 「또는」으로' : '각각을 부정하여 「이고」로'} 이은 것이므로 ${quo(cH(right))}이다.`,
          rule: 'dm-' + form
        });
      }
      // 기호만으로: 「∼p 또는 q」의 부정의 진리집합(또는 부정인 조건)
      const A = L(0, d.bool()), Bq = L(1, d.bool()), isOr = d.bool(), comp = isOr ? { or: [A, Bq] } : { and: [A, Bq] };
      const negMask = maskOf({ c: lS(comp) }, 2), askSet = d.bool(), right = isOr ? { i: [lS(negL(A)), lS(negL(Bq))] } : { u: [lS(negL(A)), lS(negL(Bq))] };
      const exprs = [right, isOr ? { u: [lS(negL(A)), lS(negL(Bq))] } : { i: [lS(negL(A)), lS(negL(Bq))] }, { i: [lS(A), lS(negL(Bq))] }, { i: [lS(negL(A)), lS(Bq)] }, { u: [lS(A), lS(negL(Bq))] }, { i: [lS(A), lS(Bq)] }, { u: [lS(negL(A)), lS(Bq)] }];
      const rows = [];
      for (const e of [exprs[0]].concat(d.shuffle(exprs.slice(1)))) {
        const m = maskOf(e, 2);
        if (rows.length === 4) break;
        if (rows.some((r) => r.m === m)) continue;
        const lits = (e.i || e.u).map((t) => (typeof t === 'number' ? L(t, false) : L(t.c, true)));
        rows.push({ h: askSet ? nb(sH(e)) : quo(lits.map(lH).join(e.i ? '이고 ' : ' 또는 ')), m, ok: m === negMask });
      }
      return oneQ(d, `두 조건 ${pV}, ${qV}의 진리집합을 각각 ${PS}, ${QS}라고 할 때, 조건 ${quo(lH(comp))}의 부정${askSet ? '의 진리집합' : ''}은?`, rows, true, {
        explain: `${quo(lH(comp))}의 진리집합은 ${sH(lS(comp))}이므로 부정의 진리집합은 (${sH(lS(comp))})${sup('C')} = ${sH(right)}이다(드모르간의 법칙). 즉 부정은 ${quo(lH(isOr ? { and: [negL(A), negL(Bq)] } : { or: [negL(A), negL(Bq)] }))}이다.`,
        rule: askSet ? 'dm-set' : 'dm-cond'
      });
    }, { count: 2 })
  ];

  // ════════════════════════════════════════════════════════════════
  // ── 「모든」·「어떤」을 포함한 명제 ──
  // 꼴(kind)을 겹치지 않게 골라, 참·거짓이 wants 와 같은 명제를 차례로 만든다.
  function fillProps(d, kinds, wants, make) {
    const used = new Set(), out = [];
    for (const want of wants) {
      let got = null;
      for (let i = 0; i < 600 && !got; i += 1) {
        const kind = d.pick(kinds);
        if (used.has(kind)) continue;
        const s = make(kind);
        if (s && s.truth === want) { got = s; used.add(kind); }
      }
      if (!got) throw new Error('조건에 맞는 명제를 만들지 못했다');
      out.push(got);
    }
    return out;
  }
  const mixWants = (d, k) => d.until(() => range(1, k).map(() => d.bool()), (w) => w.some(Boolean) && !w.every(Boolean));
  // 원소가 몇 안 되는 전체집합 U 에서의 명제(U 의 원소를 하나하나 넣어 참·거짓을 가린다)
  function finProp(d, U, kind) {
    const max = Math.max(...U), min = Math.min(...U), absMax = Math.max(...U.map(Math.abs)), sqMax = Math.max(...U.map((x) => x * x));
    const witness = (f) => U.find(f);
    if (kind === 'lin') {
      const a = d.int(2, 3), b = a * max + d.int(-2, 2), t = U.every((x) => a * x <= b);
      return { h: `모든 ${X}에 대하여 ${a}${X} ≤ ${num(b)}이다.`, truth: t, why: t ? `가장 큰 원소 ${num(max)}에서도 ${a} × ${par(max)} = ${num(a * max)} ≤ ${num(b)}이므로 참이다.` : `${X} = ${num(max)}이면 ${a} × ${par(max)} = ${num(a * max)} &gt; ${num(b)}이므로 거짓이다.` };
    }
    if (kind === 'absEx') {
      const k = absMax + d.int(-1, 0), t = U.some((x) => Math.abs(x) > k), w = witness((x) => Math.abs(x) > k);
      return { h: `어떤 ${X}에 대하여 |${X}| &gt; ${k}이다.`, truth: t, why: t ? `${X} = ${num(w)}이면 |${num(w)}| = ${Math.abs(w)} &gt; ${k}이므로 참이다.` : `모든 원소의 절댓값이 ${k} 이하이므로 거짓이다.` };
    }
    if (kind === 'sqAll') {
      const u = d.pick(U.filter((x) => x !== 0)), k = u * u, t = U.every((x) => x * x === k), w = witness((x) => x * x !== k);
      return { h: `모든 ${X}에 대하여 ${sq(X)} = ${k}이다.`, truth: t, why: t ? '참이다.' : `${X} = ${num(w)}이면 ${sq(X)} = ${w * w} ≠ ${k}이므로 거짓이다.` };
    }
    if (kind === 'parity') {
      const odd = d.bool(), t = U.every((x) => (x * x) % 2 === (odd ? 1 : 0)), w = witness((x) => (x * x) % 2 !== (odd ? 1 : 0));
      return { h: `모든 ${X}에 대하여 ${sq(X)}은 ${odd ? '홀수' : '짝수'}이다.`, truth: t, why: t ? `모든 원소의 제곱이 ${odd ? '홀수' : '짝수'}이므로 참이다.` : `${X} = ${num(w)}이면 ${sq(X)} = ${w * w}이므로 거짓이다.` };
    }
    if (kind === 'natEx') {
      const t = U.some((x) => x >= 1), w = witness((x) => x >= 1);
      return { h: `어떤 ${X}에 대하여 ${X}는 자연수이다.`, truth: t, why: t ? `${josa(w, '은/는')} 자연수이므로 참이다.` : '자연수인 원소가 없으므로 거짓이다.' };
    }
    if (kind === 'quadEx') {
      const r1 = d.int(-5, 5), r2 = r1 + d.int(1, 6), t = U.some((x) => (x - r1) * (x - r2) === 0), w = witness((x) => (x - r1) * (x - r2) === 0);
      return { h: `어떤 ${X}에 대하여 ${polyH(1, -(r1 + r2), r1 * r2)} = 0이다.`, truth: t, why: `${polyH(1, -(r1 + r2), r1 * r2)} = 0의 해는 ${X} = ${num(r1)} 또는 ${X} = ${num(r2)}이고, ` + (t ? `${ej(num(w), '은/는')} 원소이므로 참이다.` : '둘 다 원소가 아니므로 거짓이다.') };
    }
    if (kind === 'geq') {
      const k = min + d.int(0, 1), t = U.every((x) => x >= k);
      return { h: `모든 ${X}에 대하여 ${X} ≥ ${num(k)}이다.`, truth: t, why: t ? `가장 작은 원소가 ${num(min)}이므로 참이다.` : `${X} = ${num(min)}이면 ${num(min)} &lt; ${num(k)}이므로 거짓이다.` };
    }
    if (kind === 'sqGt') {
      const k = sqMax + d.int(-1, 0), t = U.some((x) => x * x > k), w = witness((x) => x * x > k);
      return { h: `어떤 ${X}에 대하여 ${sq(X)} &gt; ${k}이다.`, truth: t, why: t ? `${X} = ${num(w)}이면 ${sq(X)} = ${w * w} &gt; ${k}이므로 참이다.` : `모든 원소의 제곱이 ${k} 이하이므로 거짓이다.` };
    }
    const c = d.pick(U), k = d.int(2, 4), t = U.every((x) => Math.abs(x - c) <= k), w = witness((x) => Math.abs(x - c) > k);
    return { h: `모든 ${X}에 대하여 ${absH(c)} ≤ ${k}이다.`, truth: t, why: t ? `모든 원소가 ${num(c - k)} 이상 ${num(c + k)} 이하이므로 참이다.` : `${X} = ${num(w)}이면 |${num(w - c)}| = ${Math.abs(w - c)} &gt; ${k}이므로 거짓이다.` };
  }
  const FIN_KINDS = ['lin', 'absEx', 'sqAll', 'parity', 'natEx', 'quadEx', 'geq', 'sqGt', 'absLe'];
  // 두 변수 x, y ∈ U 의 명제
  function finProp2(d, U, kind) {
    const pairs = []; for (const x of U) for (const y of U) pairs.push([x, y]);
    if (kind === 'sumSq') {
      const vals = [...new Set(pairs.map(([x, y]) => x * x + y * y))], k = d.bool() ? d.pick(vals) : d.int(Math.min(...vals), Math.max(...vals) + 2);
      const w = pairs.find(([x, y]) => x * x + y * y === k);
      return { h: `어떤 ${X}, ${Yv}에 대하여 ${sq(X)} + ${sq(Yv)} = ${k}이다.`, truth: Boolean(w), why: w ? `${X} = ${num(w[0])}, ${Yv} = ${num(w[1])}이면 ${sq(X)} + ${sq(Yv)} = ${k}이므로 참이다.` : `${sq(X)} + ${sq(Yv)}의 값 가운데 ${ej(String(k), '이/가')} 없으므로 거짓이다.` };
    }
    if (kind === 'sumLt') {
      const top = 2 * Math.max(...U), k = top + d.int(0, 2), t = pairs.every(([x, y]) => x + y < k);
      return { h: `모든 ${X}, ${Yv}에 대하여 ${X} + ${Yv} &lt; ${num(k)}이다.`, truth: t, why: t ? `${X} + ${Yv}의 가장 큰 값이 ${num(top)}이므로 참이다.` : `${X} = ${Yv} = ${num(Math.max(...U))}이면 ${X} + ${Yv} = ${num(top)}이므로 거짓이다.` };
    }
    if (kind === 'prodEx') {
      const vals = [...new Set(pairs.map(([x, y]) => x * y))], k = d.bool() ? d.pick(vals) : d.int(Math.min(...vals), Math.max(...vals) + 1), w = pairs.find(([x, y]) => x * y === k);
      return { h: `어떤 ${X}, ${Yv}에 대하여 ${X}${Yv} = ${num(k)}이다.`, truth: Boolean(w), why: w ? `${X} = ${num(w[0])}, ${Yv} = ${num(w[1])}이면 ${X}${Yv} = ${num(k)}이므로 참이다.` : `${X}${Yv}의 값 가운데 ${ej(num(k), '이/가')} 없으므로 거짓이다.` };
    }
    const low = 2 * Math.min(...U.map((x) => x * x)), k = low + d.int(0, 1), t = pairs.every(([x, y]) => x * x + y * y >= k), m = U.reduce((b, x) => (x * x < b * b ? x : b), U[0]);
    return { h: `모든 ${X}, ${Yv}에 대하여 ${sq(X)} + ${sq(Yv)} ≥ ${k}이다.`, truth: t, why: t ? `${sq(X)} + ${sq(Yv)}의 가장 작은 값이 ${low}이므로 참이다.` : `${X} = ${Yv} = ${num(m)}이면 ${sq(X)} + ${sq(Yv)} = ${low}이므로 거짓이다.` };
  }
  // 수의 범위 전체(실수·자연수·정수)에서의 명제
  const DOM = { real: { w: '실수', S: RX }, nat: { w: '자연수', S: NX }, int: { w: '정수', S: ZX } };
  function infProp(d, kind) {
    const m = d.int(1, 4), a = d.int(-4, 4), k = d.int(1, 6), want = d.bool();
    if (kind === 'natTrap') {
      const c = xpoly(1, -(2 * m + 1), m * (m + 1), '>=');
      return { h: `모든 자연수 ${X}에 대하여 ${cH(c)}이다.`, truth: holdsAll(c, NX), why: `(${linH(1, -m)})(${linH(1, -m - 1)}) ≥ 0은 ${X} ≤ ${m} 또는 ${X} ≥ ${m + 1}일 때 성립하고, 그 사이에는 자연수가 없으므로 참이다.` };
    }
    if (kind === 'natGap') {
      const c = xpoly(1, -(2 * m + 2), m * (m + 2), '>=');
      return { h: `모든 자연수 ${X}에 대하여 ${cH(c)}이다.`, truth: holdsAll(c, NX), why: `${X} = ${m + 1}이면 ${polyH(1, -(2 * m + 2), m * (m + 2))} = ${MINUS}1 &lt; 0이므로 거짓이다.` };
    }
    if (kind === 'realGap') {
      const c = xpoly(1, -(2 * m + 1), m * (m + 1), '>=');
      return { h: `모든 실수 ${X}에 대하여 ${cH(c)}이다.`, truth: holdsAll(c, RX), why: `(${linH(1, -m)})(${linH(1, -m - 1)}) ≥ 0은 ${m} &lt; ${X} &lt; ${m + 1}에서 성립하지 않으므로 거짓이다.` };
    }
    if (kind === 'exRoot') {
      if (want) { const r1 = d.int(-4, 4), r2 = d.int(-4, 4), c = xpoly(1, -(r1 + r2), r1 * r2, '='); return { h: `어떤 실수 ${X}에 대하여 ${cH(c)}이다.`, truth: holdsSome(c, RX), why: `${X} = ${num(r1)}이면 성립하므로 참이다.` }; }
      const b = d.int(-4, 4), cc = Math.floor(b * b / 4) + d.int(1, 3), c = xpoly(1, b, cc, '=');
      return { h: `어떤 실수 ${X}에 대하여 ${cH(c)}이다.`, truth: holdsSome(c, RX), why: `판별식 D = ${par(b)}${sup(2)} − 4 × ${cc} &lt; 0이므로 실근이 없어 거짓이다.` };
    }
    if (kind === 'exSq') {
      if (want) { const c = at(a === 0 ? sq(X) : `(${linH(1, -a)})${sup(2)}`, '<=', 0, (e) => (e.x - a) ** 2); return { h: `어떤 실수 ${X}에 대하여 ${cH(c)}이다.`, truth: holdsSome(c, RX), why: `${X} = ${num(a)}이면 좌변이 0이므로 참이다.` }; }
      const c = xpoly(1, 0, k, '<=');
      return { h: `어떤 실수 ${X}에 대하여 ${cH(c)}이다.`, truth: holdsSome(c, RX), why: `모든 실수 ${X}에 대하여 ${sq(X)} + ${k} ≥ ${k} &gt; 0이므로 거짓이다.` };
    }
    if (kind === 'absAll') {
      const c = xabs(a, want ? '>=' : '>', 0);
      return { h: `모든 실수 ${X}에 대하여 ${cH(c)}이다.`, truth: holdsAll(c, RX), why: want ? '절댓값은 0 이상이므로 참이다.' : `${X} = ${num(a)}이면 ${absH(a)} = 0이므로 거짓이다.` };
    }
    if (kind === 'natSq') {
      const c = at(sq(X), want ? '>=' : '>', 0, (e) => e.x * e.x - e.x);
      return { h: `모든 자연수 ${X}에 대하여 ${sq(X)} ${want ? '≥' : '&gt;'} ${X}이다.`, truth: holdsAll(c, NX), why: want ? `자연수 ${X}에 대하여 ${sq(X)} − ${X} = ${X}(${linH(1, -1)}) ≥ 0이므로 참이다.` : `${X} = 1이면 ${sq(X)} = ${X}이므로 거짓이다.` };
    }
    if (kind === 'intEven') {
      const v = 2 * d.int(-9, 9) + (want ? 0 : 1), c = at(`2${X}`, '=', v, (e) => 2 * e.x);
      return { h: `어떤 정수 ${X}에 대하여 ${cH(c)}이다.`, truth: holdsSome(c, ZX), why: want ? `${X} = ${num(v / 2)}이면 성립하므로 참이다.` : `2${X} = ${num(v)}에서 ${ej(`${X} = ${numH(v / 2)}`, '은/는')} 정수가 아니므로 거짓이다.` };
    }
    if (kind === 'orAll') {
      const c = OR(xr(want ? '<=' : '<', a), xr('>', a));
      return { h: `모든 실수 ${X}에 대하여 ${cH(c)}이다.`, truth: holdsAll(c, RX), why: want ? `모든 실수는 ${num(a)} 이하이거나 ${num(a)}보다 크므로 참이다.` : `${X} = ${num(a)}이면 성립하지 않으므로 거짓이다.` };
    }
    const b = a + d.int(1, 4) * (want ? -1 : 1), c = AND(xr('<=', a), xr('>', b));
    return { h: `${cH(c)}인 실수 ${X}가 존재한다.`, truth: holdsSome(c, RX), why: want ? `${num(b)} &lt; ${X} ≤ ${num(a)}인 실수가 있으므로 참이다.` : `${X} ≤ ${num(a)}이면서 ${X} &gt; ${num(b)}인 실수는 없으므로 거짓이다.` };
  }
  // 부정을 묻는 명제: 양화사(모든·어떤), 수의 범위, 조건
  function quantPool(d, all) {
    const a = d.int(-6, 6), r = d.int(2, 5), m = d.int(2, 5);
    const list = all ? [
      { dom: 'int', c: xpoly(1, 0, 0, '>', 0) }, { dom: 'real', c: xpoly(1, -r, 0, '>=', 0) }, { dom: 'nat', c: at(`${sq(X)} + ${X}`, '!=', 0, (e) => e.x * e.x + e.x) },
      { dom: 'real', c: xpoly(1, -2 * m, m * m, '>', 0) }, { dom: 'real', c: xabs(a, '>=', 0) }, { dom: 'real', c: xpoly(1, 0, m, '<=', m + r) }, { dom: 'nat', c: xr('>=', 1) }
    ] : [
      { dom: 'real', c: at(linH(1, -a), '=', 0, (e) => e.x - a) }, { dom: 'nat', c: pr(`${sq(X)} = ${linH(1, r * r - r)}`, `${sq(X)} ≠ ${linH(1, r * r - r)}`, (e) => e.x * e.x === e.x + r * r - r) },
      { dom: 'real', c: xpoly(1, 0, m, '<=', 0) }, { dom: 'real', c: pr(`${X} ≥ |${X}|`, `${X} &lt; |${X}|`, (e) => e.x >= Math.abs(e.x)) }, { dom: 'real', c: xpoly(1, -r, 0, '<', 0) },
      { dom: 'int', c: at(`2${X}`, '=', 2 * m + 1, (e) => 2 * e.x) }
    ];
    return list.map((t) => Object.assign({ all }, t));
  }
  const qText = (all, dom, c) => `${all ? '모든' : '어떤'} ${DOM[dom].w} ${X}에 대하여 ${cH(c)}이다.`;
  const qTruth = (all, dom, c) => (all ? holdsAll(c, DOM[dom].S) : holdsSome(c, DOM[dom].S));

  const quantTypes = [
    T('quant-finite', '유한 전체집합에서 「모든」·「어떤」 명제의 참·거짓', '①10', (d, n) => {
      if (n === 2) {
        const U = d.shuffle(range(-5, 3)).slice(0, 3).sort((u, v) => u - v);
        const list = fillProps(d, ['sumSq', 'sumLt', 'prodEx', 'sqGe'], mixWants(d, 3), (kind) => finProp2(d, U, kind));
        return setsQ(d, `전체집합 ${US} = ${roster(U)}에 대하여 ${X} ∈ ${US}, ${Yv} ∈ ${US}일 때, 다음 보기에서 참인 명제만을 있는 대로 고른 것은?`, list.map((s) => ({ h: s.h, ok: s.truth, why: s.why })), { what: '참인 명제', rule: 'fin-two' });
      }
      const U = d.shuffle(range(-3, 5)).slice(0, 5).sort((u, v) => u - v);
      if (n === 0) {
        const wants = d.shuffle([false, true, true, true, true]);
        const list = fillProps(d, FIN_KINDS, wants, (kind) => finProp(d, U, kind));
        return oneQ(d, `전체집합 ${US} = ${roster(U)}에 대하여 다음 중 거짓인 명제는?`, list.map((s) => ({ h: s.h, ok: s.truth, why: s.why })), false, { rule: 'fin-false' });
      }
      const list = fillProps(d, FIN_KINDS, mixWants(d, 4), (kind) => finProp(d, U, kind));
      return setsQ(d, `전체집합 ${US} = ${roster(U)}에 대하여 다음 보기에서 참인 명제만을 있는 대로 고른 것은?`, list.map((s) => ({ h: s.h, ok: s.truth, why: s.why })), {
        lead: `「모든 ${X}」는 모든 원소가, 「어떤 ${X}」는 적어도 한 원소가 조건을 만족시키면 참이다.`, what: '참인 명제', rule: 'fin-sets'
      });
    }, { count: 3 }),
    T('quant-infinite', '수 전체에서 「모든」·「어떤」 명제의 참·거짓', '①11', (d) => {
      const trap = infProp(d, d.pick(['natTrap', 'natGap']));
      const rest = fillProps(d, ['realGap', 'exRoot', 'exSq', 'absAll', 'natSq', 'intEven', 'orAll', 'andEx'], d.until(() => [d.bool(), d.bool()], (w) => w.concat([trap.truth]).some(Boolean) && !w.concat([trap.truth]).every(Boolean)), (kind) => infProp(d, kind));
      const rows = d.shuffle([trap].concat(rest)).map((s) => ({ h: s.h, ok: s.truth, why: s.why }));
      return setsQ(d, '다음 보기에서 참인 명제만을 있는 대로 고른 것은?', rows, { what: '참인 명제' });
    }),
    T('quant-negate', '「모든」·「어떤」 명제의 부정과 그 참·거짓', '①12', (d, n) => {
      if (n === 2) {
        const pool = quantPool(d, true).concat(quantPool(d, false));
        const picked = d.until(() => d.shuffle(pool).slice(0, 3).map((s) => ({ s, t: qTruth(s.all, s.dom, s.c) })), (list) => list.some((r) => r.t) && !list.every((r) => r.t));
        const rows = picked.map(({ s, t }) => ({ h: qText(s.all, s.dom, s.c), ok: t, why: `부정은 ${quo(qText(!s.all, s.dom, cN(s.c)))}이고 ${tv(!t)}이다.` }));
        return setsQ(d, '다음 보기에서 그 부정이 거짓인 명제만을 있는 대로 고른 것은?', rows, { lead: '명제가 참이면 그 부정은 거짓이다.', what: '부정이 거짓인 명제', rule: 'qneg-sets' });
      }
      const all = n === 0, s = d.pick(quantPool(d, all)), negT = qTruth(!all, s.dom, cN(s.c));
      const forms = [[qText(!all, s.dom, cN(s.c)), negT, true], [qText(!all, s.dom, cN(s.c)), !negT, false], [qText(all, s.dom, cN(s.c)), qTruth(all, s.dom, cN(s.c)), false], [qText(!all, s.dom, s.c), qTruth(!all, s.dom, s.c), false]];
      return oneQ(d, `명제 ${quo(qText(all, s.dom, s.c))}의 부정과 그 참, 거짓을 바르게 짝지은 것은?`, forms.map(([h, t, ok]) => ({ h: `${quo(h)}, ${tv(t)}`, ok })), true, {
        explain: `${all ? '「모든 …에 대하여 p이다.」의 부정은 「어떤 …에 대하여 ∼p이다.」' : '「어떤 …에 대하여 p이다.」의 부정은 「모든 …에 대하여 ∼p이다.」'}이다. 따라서 부정은 ${quo(qText(!all, s.dom, cN(s.c)))}이고, 이것은 ${tv(negT)}이다.`,
        rule: all ? 'qneg-all' : 'qneg-some'
      });
    }, { count: 3 }),
    T('quant-allquad', '「모든 실수 x에 대하여 이차부등식」이 참이 되는 상수', '①13', (d) => {
      const h = d.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]), b = 2 * h, ans = h * h;
      const expr = `${sq(X)} ${b < 0 ? MINUS : '+'} ${Math.abs(b)}${X} + ${Av}`;
      return numQ(`명제 ${quo(`모든 실수 ${X}에 대하여 ${expr} ≥ 0이다.`)}가 참이 되도록 하는 실수 ${Av}의 최솟값은?`, ans, {
        calc: `${jn(b)}*${jn(b)}/4`, unseen: [4],
        explain: `이차방정식 ${expr} = 0의 판별식을 D라고 하면 D/4 = ${par(h)}${sup(2)} − ${Av} ≤ 0이어야 하므로 ${Av} ≥ ${ans}이다. 따라서 최솟값은 ${ans}이다.`
      });
    }),
    T('quant-negsome', '「어떤」 명제의 부정이 참이 되는 상수', '①14', (d, n) => {
      const h = d.pick([-4, -3, -2, -1, 1, 2, 3, 4]), b = -2 * h, strict = n === 0, ans = strict ? h * h + 1 : h * h;
      const expr = `${sq(X)} ${b < 0 ? MINUS : '+'} ${Math.abs(b)}${X} + ${Kv}`;
      return numQ(`명제 ${quo(`어떤 실수 ${X}에 대하여 ${expr} ${strict ? '≤' : '&lt;'} 0이다.`)}의 부정이 참이 되도록 하는 ${strict ? '정수' : '실수'} ${Kv}의 최솟값은?`, ans, {
        calc: strict ? `${Math.abs(b)}*${Math.abs(b)}/4+1` : `${Math.abs(b)}*${Math.abs(b)}/4`, unseen: strict ? [4, 1] : [4], rule: strict ? 'negsome-strict' : 'negsome-weak',
        explain: `부정은 ${quo(`모든 실수 ${X}에 대하여 ${expr} ${strict ? '&gt;' : '≥'} 0이다.`)}이다. 판별식 D에 대하여 D/4 = ${par(-h)}${sup(2)} − ${Kv} ${strict ? '&lt;' : '≤'} 0이어야 하므로 ${Kv} ${strict ? '&gt;' : '≥'} ${h * h}이고, ${strict ? '정수' : '실수'} ${Kv}의 최솟값은 ${ans}이다.`
      });
    }, { count: 2 }),
    T('quant-overlap', '「어떤 x∈A」가 참이 되는 두 범위의 겹침', '①16', (d) => {
      const p = d.int(1, 3), q = d.int(2, 6), s = d.int(-3, 0), t = s + d.int(2, 4), count = (t + p) - (s - q) - 1;
      const A = V('A');
      return numQ(`집합 ${A} = {${X} | ${Kv} − ${p} &lt; ${X} &lt; ${Kv} + ${q}}에 대하여 명제 ${quo(`${X} ∈ ${A}인 어떤 실수 ${X}에 대하여 ${num(s)} ≤ ${X} ≤ ${num(t)}이다.`)}가 참이 되도록 하는 정수 ${Kv}의 개수는?`, count, {
        signed: false, calc: `${t}+${p}-${jn(s)}+${q}-1`, unseen: [1],
        explain: `${A}와 {${X} | ${num(s)} ≤ ${X} ≤ ${num(t)}}가 겹쳐야 하므로 ${Kv} − ${p} &lt; ${num(t)}이고 ${Kv} + ${q} &gt; ${num(s)}, 즉 ${num(s - q)} &lt; ${Kv} &lt; ${num(t + p)}이다. 정수 ${Kv}는 ${num(s - q + 1)}부터 ${num(t + p - 1)}까지 ${count}개이다.`
      });
    })
  ];

  // ════════════════════════════════════════════════════════════════
  // ── 명제 p → q 의 참·거짓 ──
  // 반례(가정은 참, 결론은 거짓인 수) 하나
  const cexOf = (p, q, S) => nice(S).find((e) => cF(p, e) && !cF(q, e));
  const showE = (e) => Object.keys(e).map((k) => `${V(k)} = ${numH(e[k])}`).join(', ');
  const sHp = (e) => (e && (e.u || e.i || e.d) ? '(' + sH(e) + ')' : sH(e));
  // 한 변수의 명제 p → q (참·거짓은 넣어 보아 가린다)
  function oneVarImp(d, kind) {
    const k = d.int(2, 6), a = d.int(1, 6), b = a + d.int(1, 6);
    let p, q, S = RX;
    if (kind === 'lin') { p = at(linH(1, a), '>', b, (e) => e.x + a); q = xr('>', b - a + d.int(-2, 2)); }
    else if (kind === 'root') { p = xpoly(1, -k, 0, '='); q = xr('=', k); }
    else if (kind === 'rootBack') { p = xr('=', k); q = xpoly(1, -k, 0, '='); }
    else if (kind === 'sqLt') { p = xpoly(1, 0, 0, '<', k * k); q = xr('<', k); }
    else if (kind === 'ltSq') { p = xr('<', k); q = xpoly(1, 0, 0, '<', k * k); }
    else if (kind === 'sqEq') { p = xpoly(1, 0, 0, '=', k * k); q = xr('=', k); }
    else if (kind === 'negSq') { p = xr('=', -k); q = xpoly(1, 0, 0, '=', k * k); }
    else if (kind === 'ivGe') { const lo = d.int(-4, 2); p = iv('x', lo, lo + d.int(2, 5), true, true); q = xr('>=', lo + d.int(-2, 2)); }
    else if (kind === 'prod') { p = at(`${X}(${linH(1, -k)})`, '=', 0, (e) => e.x * (e.x - k)); q = xpoly(1, 0, 0, '<=', k * k); }
    else if (kind === 'mult') {
      const m = d.pick([2, 3, 4, 6, 8, 9, 12]), nn = d.pick([2, 3, 4, 6, 8, 12].filter((v) => v !== m)); S = NX;
      p = pr(`${X}가 ${m}의 배수`, '', (e) => e.x % m === 0); q = pr(`${X}는 ${nn}의 배수`, '', (e) => e.x % nn === 0);
    } else {
      const m = d.pick([6, 8, 12, 16, 18]), nn = d.pick([4, 8, 12, 24, 36, 48].filter((v) => v !== m)); S = NX;
      p = pr(`${X}가 ${m}의 양의 약수`, '', (e) => m % e.x === 0); q = pr(`${X}는 ${nn}의 양의 약수`, '', (e) => nn % e.x === 0);
    }
    const truth = implies(p, q, S), e = cexOf(p, q, S);
    return { h: stmt(cH(p), cH(q)), truth, p, q, S, why: truth ? `두 조건의 진리집합을 ${PS}, ${QS}라고 하면 ${PS} ⊂ ${QS}이므로 참이다.` : `[반례] ${showE(e)}이면 가정은 참이지만 결론은 거짓이다.` };
  }
  const ONE_KINDS = ['lin', 'root', 'rootBack', 'sqLt', 'ltSq', 'sqEq', 'negSq', 'ivGe', 'prod', 'mult', 'div'];
  // 두 실수 x, y 의 명제
  function twoVarPool(d) {
    const c = d.int(0, 3), r = d.int(1, 2), kk = d.int(1, 3), s = R2.xy;
    const P = (h, f) => pr(h, '', f);
    const list = [
      [P(`${sq(X)} = 0`, (e) => e.x * e.x === 0), P(`${X} ≥ 0`, (e) => e.x >= 0), `${sq(X)} = 0이면 ${X} = 0이므로 참이다.`],
      [P(`${sq(X)} = ${sq(Yv)}`, (e) => e.x * e.x === e.y * e.y), P(`${X}${sup(3)} = ${Yv}${sup(3)}`, (e) => e.x ** 3 === e.y ** 3)],
      [P(`${X} &lt; 0`, (e) => e.x < 0), P(`|${X}| = ${X}`, (e) => Math.abs(e.x) === e.x)],
      [P(`${X}${Yv} = 0`, (e) => e.x * e.y === 0), P(`${sq(X)} + ${sq(Yv)} = 0`, (e) => e.x * e.x + e.y * e.y === 0)],
      [P(`${X} &gt; 0이고 ${Yv} &lt; 0`, (e) => e.x > 0 && e.y < 0), P(`${X} + ${Yv} &lt; 0`, (e) => e.x + e.y < 0)],
      [P(`|${linH(1, -c)}| &lt; ${r}`, (e) => Math.abs(e.x - c) < r), P(`${sq(X)} &lt; ${(c + r) ** 2}`, (e) => e.x * e.x < (c + r) ** 2), `${num(c - r)} &lt; ${X} &lt; ${c + r}이면 ${sq(X)} &lt; ${(c + r) ** 2}이므로 참이다.`],
      [P(`${sq(X)} &gt; ${kk * kk}`, (e) => e.x * e.x > kk * kk), P(`${X} &gt; ${kk}`, (e) => e.x > kk)],
      [P(`${X}${Yv} &gt; 0`, (e) => e.x * e.y > 0), P(`${X} + ${Yv} &gt; 0`, (e) => e.x + e.y > 0)],
      [P(`${X} + ${Yv} &lt; ${kk}`, (e) => e.x + e.y < kk), P(`${X} &lt; ${kk}이고 ${Yv} &lt; ${kk}`, (e) => e.x < kk && e.y < kk)],
      [P(`${sq(X)} + ${sq(Yv)} ≤ 1`, (e) => e.x * e.x + e.y * e.y <= 1), P(`|${X}| + |${Yv}| ≤ 1`, (e) => Math.abs(e.x) + Math.abs(e.y) <= 1)],
      [P(`|${X}| + |${Yv}| ≤ 1`, (e) => Math.abs(e.x) + Math.abs(e.y) <= 1), P(`${sq(X)} + ${sq(Yv)} ≤ 1`, (e) => e.x * e.x + e.y * e.y <= 1), `|${X}| ≤ 1, |${Yv}| ≤ 1이므로 ${sq(X)} + ${sq(Yv)} ≤ |${X}| + |${Yv}| ≤ 1이다. 따라서 참이다.`],
      [P(`${X} &gt; 0이고 ${Yv} &gt; 0`, (e) => e.x > 0 && e.y > 0), P(`${X}${Yv} &gt; 0`, (e) => e.x * e.y > 0), '양수끼리의 곱은 양수이므로 참이다.'],
      [P(`${sq(X)} + ${sq(Yv)} = 0`, (e) => e.x * e.x + e.y * e.y === 0), P(`${X} = 0이고 ${Yv} = 0`, (e) => e.x === 0 && e.y === 0), `${sq(X)} ≥ 0, ${sq(Yv)} ≥ 0이므로 참이다.`],
      [P(`${X} &gt; ${Yv}`, (e) => e.x > e.y), P(`${sq(X)} &gt; ${sq(Yv)}`, (e) => e.x * e.x > e.y * e.y)],
      [P(`${X} &lt; ${Yv} &lt; 0`, (e) => e.x < e.y && e.y < 0), P(`${sq(X)} &gt; ${sq(Yv)}`, (e) => e.x * e.x > e.y * e.y), `|${X}| &gt; |${Yv}|이므로 참이다.`],
      [P(`|${X}| = |${Yv}|`, (e) => Math.abs(e.x) === Math.abs(e.y)), P(`${sq(X)} = ${sq(Yv)}`, (e) => e.x * e.x === e.y * e.y), '양변을 제곱하면 같으므로 참이다.']
    ];
    return list.map(([p, q, w]) => {
      const truth = implies(p, q, s), e = cexOf(p, q, s);
      return { h: stmt(p.h, q.h), truth, why: truth ? (w || '가정을 만족시키면 결론도 항상 만족시키므로 참이다.') : `[반례] ${showE(e)}이면 가정은 참이지만 결론은 거짓이다.` };
    });
  }
  // 「자연수 n 이 짝수(홀수)이면 bⁿ + c 는 소수이다」 꼴 가운데 셋째 후보 이후에 처음 반례가 나오는 것
  const CEX = (() => {
    const out = [];
    for (const b of [2, 3, 4, 5, 6]) for (let c = 1; c <= 15; c += 1) for (const par of [0, 1]) {
      if (gcd(b, c) !== 1) continue;
      const vals = [];
      for (const nn of (par ? [1, 3, 5, 7, 9, 11] : [2, 4, 6, 8, 10, 12])) { const v = b ** nn + c; vals.push([nn, v]); if (!isPrime(v) || v > 3e6) break; }
      const last = vals[vals.length - 1];
      if (vals.length >= 3 && !isPrime(last[1]) && last[1] <= 3e6) out.push({ b, c, par, vals });
    }
    return out;
  })();
  // 진리집합의 관계(두 집합): 보기 후보
  const REL2 = [['sub', 0, 1], ['sub', 1, 0], ['eq', { i: [0, 1] }, 0], ['eq', { i: [0, 1] }, 1], ['eq', { u: [0, 1] }, 1], ['eq', { u: [0, 1] }, 0], ['emp', { d: [0, 1] }], ['emp', { d: [1, 0] }],
    ['emp', { i: [0, 1] }], ['eq', { u: [0, 1] }, 'U'], ['sub', { c: 0 }, { c: 1 }], ['sub', { c: 1 }, { c: 0 }], ['emp', { i: [{ c: 0 }, 1] }], ['emp', { i: [0, { c: 1 }] }], ['eq', { u: [0, { c: 1 }] }, 0],
    ['sub', { c: 0 }, 1], ['sub', { c: 1 }, 0], ['sub', 0, { c: 1 }], ['eq', { d: [0, 1] }, 0], ['eq', { d: [1, 0] }, 1], ['emp', { i: [{ c: 0 }, { c: 1 }] }], ['eq', { i: [{ c: 0 }, 1] }, 1]];
  // 그림의 원 사이의 관계를 말로(그림 설명)
  function vennSay(sets, cfg) {
    const out = [], m = (e) => maskOf(e, 3) & cfg;
    for (let i = 0; i < 3; i += 1) for (let j = i + 1; j < 3; j += 1) {
      const a = sets[i].name, b = sets[j].name;
      if (!m({ d: [i, j] })) out.push(`원 ${ej(a, '은/는')} 원 ${b} 안에 있다`);
      else if (!m({ d: [j, i] })) out.push(`원 ${ej(b, '은/는')} 원 ${a} 안에 있다`);
      else if (!m({ i: [i, j] })) out.push(`원 ${ej(a, '과/와')} 원 ${ej(b, '은/는')} 만나지 않는다`);
      else out.push(`원 ${ej(a, '과/와')} 원 ${ej(b, '은/는')} 서로 겹친다`);
    }
    return out.join(', ');
  }

  const implTypes = [
    T('impl-parts', '가정과 결론', '①18', (d) => {
      const k = d.int(2, 5), m = d.pick([15, 21, 27, 35, 45]);
      const pool = d.shuffle([
        [`${Nv}이 ${m}의 약수이면 ${Nv}은 홀수이다.`, `${Nv}이 ${m}의 약수이다.`, `${Nv}은 홀수이다.`],
        [`${X} ≥ 0이면 ${X} &gt; ${k}이다.`, `${X} ≥ 0`, `${X} &gt; ${k}`],
        [`${X}가 홀수이면 ${X} + 1은 홀수이다.`, `${X}는 홀수이다.`, `${X} + 1은 홀수이다.`],
        [`${Av}${Bv} = 0이면 ${Av} = 0이고 ${Bv} = 0이다.`, `${Av}${Bv} = 0`, `${Av} = 0이고 ${Bv} = 0`],
        [`${X} = ${k}이면 3${X} + 2 = ${3 * k + 2}이다.`, `${X} = ${k}`, `3${X} + 2 = ${3 * k + 2}`],
        [`${Nv}이 홀수이면 ${sq(Nv)}은 홀수이다.`, `${Nv}이 홀수이다.`, `${sq(Nv)}은 홀수이다.`]
      ]).slice(0, 3);
      const right = mixWants(d, 3);
      const rows = pool.map(([s, a, b], i) => ({ h: `${quo(s)} — 가정: ${right[i] ? a : b} 결론: ${right[i] ? b : a}`, ok: right[i], why: right[i] ? '' : '가정과 결론이 바뀌었다.' }));
      return setsQ(d, '다음 보기에서 명제의 가정과 결론을 바르게 말한 것만을 있는 대로 고른 것은?', rows, { lead: `명제 ${quo(`${pV}이면 ${qV}이다.`)}에서 ${ej(pV, '이/가')} 가정, ${ej(qV, '이/가')} 결론이다.`, what: '바르게 말한 것' });
    }),
    T('impl-truth', '진리집합의 포함으로 p → q 의 참·거짓', '①19', (d) => {
      const list = fillProps(d, ONE_KINDS, mixWants(d, 4), (kind) => oneVarImp(d, kind));
      return setsQ(d, `다음 보기에서 참인 명제만을 있는 대로 고른 것은? (단, ${X}는 실수이고, 배수나 약수가 나오는 명제에서는 자연수이다.)`, list.map((s) => ({ h: s.h, ok: s.truth, why: s.why })), {
        lead: `명제 ${pV} ${TO} ${qV}에서 두 조건의 진리집합을 ${PS}, ${QS}라고 할 때, ${PS} ⊂ ${QS}이면 참이고 ${PS} ⊄ ${QS}이면 거짓이다.`, what: '참인 명제'
      });
    }),
    T('impl-negs', '두 조건과 그 부정으로 만든 명제의 참·거짓', '①20', (d) => {
      const pairs = [[L(0), L(1)], [L(0), L(1, true)], [L(0, true), L(1)], [L(1, true), L(0)]];
      // 두 조건이 같거나 서로 부정이면 보기가 뻔해지므로 뺀다
      const g = d.until(() => {
        const a = d.int(-3, 3), b = a + d.int(-2, 4), p = xr(d.pick(['>', '>=', '<', '<=']), a), q = xr(d.pick(['>', '>=', '<', '<=']), b);
        const condOf = (l) => { const base = l.v === 0 ? p : q; return l.neg ? cN(base) : base; };
        return { p, q, condOf, truths: pairs.map(([A, Bq]) => implies(condOf(A), condOf(Bq), RX)) };
      }, (t) => t.truths.some(Boolean) && !t.truths.every(Boolean) && !sameSet(t.p, t.q, RX) && !sameSet(t.q, cN(t.p), RX));
      const rows = pairs.map(([A, Bq], i) => ({ h: impH(A, Bq), ok: g.truths[i], why: `${quo(cH(g.condOf(A)))}의 진리집합이 ${quo(cH(g.condOf(Bq)))}의 진리집합에 ${g.truths[i] ? '포함되므로 참' : '포함되지 않으므로 거짓'}이다.` }));
      return setsQ(d, `실수 ${X}에 대하여 두 조건 ${cond('p', cH(g.p))}, ${ej(cond('q', cH(g.q)), '이/가')} 있을 때, 다음 보기에서 참인 명제만을 있는 대로 고른 것은?`, rows, { what: '참인 명제' });
    }),
    T('impl-twovar', '두 실수에 대한 명제 — 반례로 가리기', '①21', (d, n) => {
      const want = n === 0, pool = d.shuffle(twoVarPool(d));
      const hit = pool.find((s) => s.truth === want), rest = pool.filter((s) => s.truth !== want).slice(0, 4);
      return oneQ(d, `다음 중 ${want ? '참' : '거짓'}인 명제는? (단, ${X}, ${Yv}는 실수이다.)`, [hit].concat(rest).map((s) => ({ h: s.h, ok: s.truth })), want, {
        explain: `${hit.why} 나머지는 ${want ? '반례가 있어 거짓' : '모두 참'}이다.`, rule: want ? 'two-true' : 'two-false'
      });
    }, { count: 2 }),
    T('impl-counter', '반례 찾기', '①22', (d, n) => {
      if (n === 0) {
        const t = d.pick(CEX), vals = t.vals, last = vals[vals.length - 1], f = range(2, last[1]).find((v) => last[1] % v === 0);
        return numQ(`명제 ${quo(`자연수 ${Nv}이 ${t.par ? '홀수' : '짝수'}이면 ${t.b}${sup(Nv)} + ${josa(t.c, '은/는')} 소수이다.`)}가 거짓임을 보이는 반례 가운데 가장 작은 ${Nv}의 값은?`, last[0], {
          signed: false, check: [t.b, t.c, t.par], rule: 'counter-power',
          explain: vals.map(([k, v], i) => `${Nv} = ${k}일 때 ${t.b}${sup(k)} + ${t.c} = ${v}` + (i < vals.length - 1 ? '(소수)' : ` = ${f} × ${v / f}(소수가 아니다)`)).join(', ') + `이므로 가장 작은 반례는 ${Nv} = ${last[0]}이다.`
        });
      }
      const g = d.until(() => {
        const a = d.pick([12, 16, 18, 20, 24, 30, 36]), b = d.pick([4, 6, 8, 9, 10, 12, 15, 18, 24]), da = divisors(a), db = divisors(b);
        return { a, b, bad: da.filter((v) => !db.includes(v)), good: da.filter((v) => db.includes(v)), outside: range(2, 40).filter((v) => !da.includes(v)) };
      }, (t) => t.a !== t.b && t.bad.length >= 1 && t.good.length >= 2);
      const hit = d.pick(g.bad), others = d.shuffle(g.good).slice(0, 2).concat(d.shuffle(g.outside).slice(0, 2));
      const rows = [hit].concat(others).sort((u, v) => u - v).map((v) => ({ h: String(v), ok: v === hit }));
      return oneQ(d, `명제 ${quo(`${X}가 ${g.a}의 양의 약수이면 ${X}는 ${g.b}의 양의 약수이다.`)}가 거짓임을 보이는 반례인 것은?`, rows, true, {
        keep: true, rule: 'counter-divisor',
        explain: `반례는 ${g.a}의 양의 약수이면서 ${g.b}의 양의 약수가 아닌 수이다. ${josa(hit, '은/는')} ${g.a}의 약수이지만 ${g.b}의 약수가 아니다. 나머지는 ${g.b}의 약수이거나 ${g.a}의 약수가 아니다.`
      });
    }, { count: 2 }),
    T('impl-sets', 'p → q 가 참일 때 진리집합 사이의 관계', '①23', (d, n) => {
      const all = d.int(0, 4) === 0, A = L(0, d.bool()), Bq = L(1, d.bool()), flip = d.bool();
      const hyp = all ? ['eq', { u: [0, { c: 1 }] }, 'U'] : flip ? impR(Bq, A) : impR(A, Bq);
      const said = all ? `명제 ${quo(`모든 ${X}에 대하여 ${pV} 또는 ${NOT}${qV}이다.`)}가 참일 때` : `명제 ${ej(flip ? impH(Bq, A) : impH(A, Bq), '이/가')} 참일 때`;
      const want = n === 0, cands = d.shuffle(REL2.map((r) => ({ r, ok: always([hyp], r, 2) })));
      const hit = cands.find((c) => c.ok === want), seen = new Set([rH(hit.r)]), rest = [];
      for (const c of cands) { if (rest.length === 4) break; if (c.ok !== want && !seen.has(rH(c.r))) { seen.add(rH(c.r)); rest.push(c); } }
      if (rest.length < 4) throw new Error('보기가 모자라다');
      return oneQ(d, `전체집합 ${US}에서 정의된 두 조건 ${pV}, ${qV}의 진리집합을 각각 ${PS}, ${QS}라고 하자. ${said}, 다음 중 ${want ? '항상 옳은 것' : '옳지 않은 것'}은?`, [hit].concat(rest).map((c) => ({ h: rH(c.r), ok: c.ok })), want, {
        explain: `주어진 명제가 참이므로 ${rH(hyp)}이다. 이때 ${ej(rH(hit.r), '은/는')} ${want ? '항상 성립한다' : '성립하지 않는 경우가 있다'}. 나머지는 ${want ? '성립하지 않는 경우가 있다' : '항상 성립한다'}.`,
        rule: want ? 'rel-always' : 'rel-not'
      });
    }, { count: 2 }),
    T('impl-countercell', 'p → q 가 거짓임을 보이는 원소의 자리', '①24', (d, n) => {
      if (n === 0) {
        const A = L(d.int(0, 1), d.bool()), Bq = L(1 - A.v, d.bool()), right = { i: [lS(A), lS(negL(Bq))] }, target = maskOf(right, 2);
        const exprs = [[0, { c: 1 }], [{ c: 0 }, 1], [0, 1], [{ c: 0 }, { c: 1 }]].map((pq) => ({ i: pq })).concat([{ u: [0, 1] }, { u: [{ c: 0 }, { c: 1 }] }, { u: [0, { c: 1 }] }, { u: [{ c: 0 }, 1] }]);
        const rows = [], seen = new Set([target]);
        rows.push({ h: nb(sH(exprs.find((e) => maskOf(e, 2) === target))), ok: true });
        for (const e of d.shuffle(exprs)) { const m = maskOf(e, 2); if (rows.length === 5 || seen.has(m)) continue; seen.add(m); rows.push({ h: nb(sH(e)), ok: false }); }
        return oneQ(d, `전체집합 ${US}에서 정의된 두 조건 ${pV}, ${qV}의 진리집합을 각각 ${PS}, ${QS}라고 할 때, 명제 ${ej(impH(A, Bq), '이/가')} 거짓임을 보이는 원소가 속하는 집합은?`, rows, true, {
          explain: `반례는 가정 ${ej(quo(lH(A)), '은/는')} 만족시키고 결론 ${ej(quo(lH(Bq)), '은/는')} 만족시키지 않는 원소이므로 ${sH(lS(A))} ∩ ${sHp(lS(negL(Bq)))}에 속한다.`,
          rule: 'cell-sym'
        });
      }
      // 벤 다이어그램과 점 a ~ e: 그림에서 영역을 재어 점을 놓는다.
      const sets = [{ name: 'P', cx: 92, cy: 66, r: 46, lx: 52, ly: 28 }, { name: 'Q', cx: 158, cy: 66, r: 46, lx: 198, ly: 28 }, { name: 'R', cx: 125, cy: 112, r: 44, lx: 184, ly: 152 }];
      const forms = [[{ or: [L(0), L(1)] }, L(2)], [{ and: [L(0), L(1)] }, L(2)], [L(0), { or: [L(1), L(2)] }], [{ or: [L(0), L(2)] }, L(1)], [L(2), { and: [L(0), L(1)] }], [{ and: [L(1), L(2)] }, L(0)], [L(1), L(2, true)]];
      const spots = dotSpots(sets), codes = Object.keys(spots).map(Number).filter((k) => spots[k].clear >= 2);
      const g = d.until(() => {
        const [A, Bq] = d.pick(forms), target = maskOf(lS(A), 3) & ~maskOf(lS(Bq), 3) & 255;
        return { A, Bq, target, inT: codes.filter((k) => (target >> k) & 1), outT: codes.filter((k) => !((target >> k) & 1)) };
      }, (t) => t.inT.length >= 1 && t.outT.length >= 4);
      const chosen = d.shuffle([d.pick(g.inT)].concat(d.shuffle(g.outT).slice(0, 4))), names = ['a', 'b', 'c', 'd', 'e'];
      const dots = chosen.map((k, i) => ({ name: names[i], x: spots[k].x, y: spots[k].y, side: spots[k].side, code: k }));
      const member = (k) => { const ins = [0, 1, 2].filter((j) => (k >> j) & 1).map((j) => 'PQR'[j]); return ins.length === 3 ? '세 원에 모두 속한다' : ins.length ? `${ins.join(', ')}에만 속한다` : '어느 원에도 속하지 않는다'; };
      const fig = vennFig(sets, dots, `벤 다이어그램: 직사각형 U 안에 세 원 P, Q, R이 서로 겹쳐 있다. ${dots.map((t) => `점 ${t.name}는 ${member(t.code)}`).join('. ')}.`);
      const rows = dots.map((t) => ({ h: V(t.name), ok: Boolean((g.target >> t.code) & 1) }));
      const hit = dots.find((t) => (g.target >> t.code) & 1);
      return oneQ(d, `전체집합 ${US}에서 정의된 세 조건 ${pV}, ${qV}, ${rV}의 진리집합 ${PS}, ${QS}, ${RS} 사이의 관계가 다음 그림과 같을 때, 명제 ${ej(impH(g.A, g.Bq), '이/가')} 거짓임을 보이는 원소는?`, rows, true, {
        keep: true, figure: fig, rule: 'cell-venn',
        explain: `반례는 ${sHp(lS(g.A))}에는 속하고 ${sHp(lS(g.Bq))}에는 속하지 않는 원소이다. 그림에서 그런 원소는 ${V(hit.name)}뿐이다.`
      });
    }, { count: 2 }),
    T('impl-three', '세 조건의 진리집합의 관계로 참인 명제 고르기', '①25', (d, n) => {
      const cands = [];
      for (let i = 0; i < 3; i += 1) for (let j = 0; j < 3; j += 1) if (i !== j) for (const s of [false, true]) for (const t of [false, true]) cands.push([L(i, s), L(j, t)]);
      for (const [i, j, k] of [[0, 1, 2], [0, 2, 1], [1, 2, 0]]) { cands.push([{ and: [L(i), L(j)] }, L(k)]); cands.push([L(k), { or: [L(i), L(j)] }]); }
      const whyNo = (cd) => `${sHp(lS(cd[0]))} ⊄ ${sHp(lS(cd[1]))}일 수 있다.`;
      if (n === 0) {
        const [a, b, c] = d.shuffle([0, 1, 2]);
        const TEMPL = [
          [['sub', a, b], ['ne', { i: [a, c] }]], [['eq', { u: [a, b] }, b], ['eq', { i: [b, c] }, b]],
          [['eq', { i: [a, b] }, a], ['emp', { d: [b, { c }] }]], [['sub', a, b], ['emp', { i: [b, c] }]]
        ];
        const rels = d.pick(TEMPL), truthOf = (cd) => always(rels, impR(cd[0], cd[1]), 3);
        const picked = d.until(() => d.shuffle(cands).slice(0, 4).map((cd) => ({ cd, ok: truthOf(cd) })), (list) => list.some((r) => r.ok) && !list.every((r) => r.ok) && list.some((r) => r.cd[0].and || r.cd[1].or));
        const rows = picked.map(({ cd, ok }) => ({ h: impH(cd[0], cd[1]), ok, why: ok ? '' : whyNo(cd).replace('일 수 있다', '인 경우가 있다') }));
        return setsQ(d, `전체집합 ${US}에서 정의된 세 조건 ${pV}, ${qV}, ${rV}의 진리집합을 각각 ${PS}, ${QS}, ${RS}라고 하자. ${rels.map(rH).join(', ')}일 때, 다음 보기에서 항상 참인 명제만을 있는 대로 고른 것은?`, rows, {
          lead: '주어진 관계를 진리집합의 포함 관계로 바꾸어 생각한다.', what: '항상 참인 명제', rule: 'three-rel'
        });
      }
      // 그림으로 준 세 진리집합: 그림에서 비어 있지 않은 영역을 재어 참·거짓을 가린다. [원 둘레, 이름표 자리]
      const LAYOUT = [
        // 원 이름은 원 바로 바깥(왼쪽 위·오른쪽 위)이나 안쪽 원의 바로 위에 둔다
        [[115, 84, 64, 66, 33], [92, 84, 28, 92, 48], [170, 84, 44, 212, 50]],     // 큰 원 안에 작은 원, 둘에 걸쳐 밖으로 나간 원
        [[125, 84, 70, 70, 29], [95, 84, 28, 95, 50], [158, 84, 28, 158, 50]],    // 큰 원 안에 서로 떨어진 두 원
        [[125, 84, 70, 70, 29], [115, 92, 46, 115, 38], [107, 98, 22, 107, 70]]   // 차례로 포함
      ];
      const g = d.until(() => {
        const lay = d.pick(LAYOUT), role = d.shuffle([0, 1, 2]);
        const sets = role.map((ri, j) => { const [cx, cy, r, lx, ly] = lay[ri]; return { name: 'PQR'[j], cx, cy, r, lx, ly }; });
        const cfg = cfgOf(sets), picked = d.shuffle(cands).slice(0, 4).map((cd) => ({ cd, ok: relHolds(impR(cd[0], cd[1]), cfg, 3) }));
        return { sets, cfg, picked };
      }, (t) => t.picked.some((r) => r.ok) && !t.picked.every((r) => r.ok));
      const fig = vennFig(g.sets, [], `벤 다이어그램: 직사각형 U 안에 세 원 P, Q, R이 있다. ${vennSay(g.sets, g.cfg)}.`);
      const rows = g.picked.map(({ cd, ok }) => ({ h: impH(cd[0], cd[1]), ok, why: ok ? '' : `${sHp(lS(cd[0]))} ⊄ ${sHp(lS(cd[1]))}이다.` }));
      return setsQ(d, `전체집합 ${US}에서 정의된 세 조건 ${pV}, ${qV}, ${rV}의 진리집합 ${PS}, ${QS}, ${RS} 사이의 포함 관계가 다음 그림과 같을 때, 다음 보기에서 참인 명제만을 있는 대로 고른 것은?`, rows, {
        figure: fig, lead: '명제는 가정의 진리집합이 결론의 진리집합에 포함될 때 참이다.', what: '참인 명제', rule: 'three-venn'
      });
    }, { count: 2 }),
    T('impl-count', '명제가 참이 되도록 하는 진리집합의 개수', '①26', (d) => {
      const Nn = d.int(5, 6), U = range(1, Nn), Qset = d.shuffle(U).slice(0, d.int(2, 3)).sort((u, v) => u - v), Qc = U.filter((x) => !Qset.includes(x));
      // [가정, 결론, P 가 부분집합인 집합(속), 또는 P 가 꼭 가지는 집합(덮)]
      const forms = [[L(1), L(0, true), 'in', Qc], [L(0), L(1), 'in', Qset], [L(0), L(1, true), 'in', Qc], [L(1, true), L(0), 'has', Qc], [L(1), L(0), 'has', Qset]];
      const [A, Bq, how, base] = d.pick(forms);
      let count = 0;
      for (let m = 1; m < (1 << Nn); m += 1) {
        const P = U.filter((_, i) => (m >> i) & 1), inS = (l, x) => (l.v === 0 ? P.includes(x) : Qset.includes(x)) !== l.neg;
        if (U.every((x) => !inS(A, x) || inS(Bq, x))) count += 1;
      }
      const free = how === 'in' ? base.length : Nn - base.length, expr = how === 'in' ? `2**${free}-1` : `2**${free}`;
      if (Function('"use strict"; return (' + expr + ');')() !== count) throw new Error('개수 셈이 어긋났다');
      return numQ(`전체집합 ${US} = ${roster(U)}에서 정의된 두 조건 ${pV}, ${qV}의 진리집합을 각각 ${PS}, ${QS}라고 하자. ${QS} = ${roster(Qset)}일 때, 명제 ${ej(impH(A, Bq), '이/가')} 참이 되도록 하는 집합 ${PS}의 개수는? (단, ${PS} ≠ ${EMPTY})`, count, {
        signed: false, calc: expr, unseen: [2, free, 1],
        explain: `명제가 참이려면 ${rH(impR(A, Bq))}이어야 한다. ` + (how === 'in'
          ? `즉 ${PS}는 ${roster(base)}의 공집합이 아닌 부분집합이므로 2${sup(free)} − 1 = ${count}개이다.`
          : `즉 ${PS}는 ${roster(base)}의 원소를 모두 가지고, 나머지 ${free}개의 원소는 가져도 되고 가지지 않아도 되므로 2${sup(free)} = ${count}개이다.`)
      });
    }),
    T('impl-const', '명제가 참이 되도록 하는 상수 — 한 점 대입', '①27', (d, n) => {
      if (n === 0) {
        const { r, c } = d.until(() => { const r0 = d.pick([-5, -4, -3, -2, 2, 3, 4, 5]); return { r: r0, c: r0 * d.pick([-4, -3, -2, -1, 1, 2, 3, 4, 5]) }; }, (t) => t.r * t.r + t.c !== 0), k = (r * r + c) / r;
        return numQ(`명제 ${quo(`${X} = ${num(r)}이면 ${sq(X)} − ${Kv}${X} ${c < 0 ? MINUS : '+'} ${Math.abs(c)} = 0이다.`)}가 참이 되도록 하는 상수 ${Kv}의 값은?`, k, {
          calc: `(${jn(r)}*${jn(r)}+${jn(c)})/${jn(r)}`, rule: 'const-point',
          explain: `${ej(`${X} = ${num(r)}`, '이/가')} 방정식의 해이어야 하므로 ${par(r)}${sup(2)} − ${Kv} × ${par(r)} ${c < 0 ? MINUS : '+'} ${Math.abs(c)} = 0에서 ${Kv} = ${num(k)}이다.`
        });
      }
      const { r, bb } = d.until(() => ({ r: d.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]), bb: d.int(-4, 4) }), (t) => t.r * t.r + t.bb * t.r !== 0), k = r * r + bb * r;
      const qh = `${sq(X)}${bb === 0 ? '' : ` ${bb < 0 ? MINUS : '+'} ${Math.abs(bb) === 1 ? '' : Math.abs(bb)}${X}`} − ${Kv} = 0`;
      return numQ(`두 조건 ${cond('p', `${linH(1, -r)} = 0`)}, ${cond('q', qh)}에 대하여 ${ej(pV, '이/가')} ${qV}이기 위한 충분조건이 되도록 하는 상수 ${Kv}의 값은?`, k, {
        calc: `${jn(r)}*${jn(r)}+${jn(bb)}*${jn(r)}`, unseen: bb === 0 ? [0] : Math.abs(bb) === 1 ? [1] : [], rule: 'const-suff',
        explain: `${pV}의 진리집합 {${num(r)}}이 ${qV}의 진리집합에 포함되어야 하므로 ${ej(`${X} = ${num(r)}`, '을/를')} 대입하면 ${Kv} = ${num(k)}이다.`
      });
    }, { count: 2 }),
    T('impl-interval', '명제가 참이 되도록 하는 범위의 상수', '①28', (d, n) => {
      if (n === 0) {
        const g = d.until(() => { const s = d.int(-8, -3), t = d.int(2, 6), c = d.int(s + 1, t - 1); return { s, t, c }; }, (t) => t.c - t.s !== t.t - t.c && t.c !== 0);
        const { s, t, c } = g, k = Math.min(c - s, t - c);
        return numQ(`두 조건 ${cond('p', `${num(c)} − ${Kv} &lt; ${X} &lt; ${num(c)} + ${Kv}`)}, ${cond('q', `${num(s)} &lt; ${X} &lt; ${num(t)}`)}에 대하여 명제 ${pV} ${TO} ${ej(qV, '이/가')} 참이 되도록 하는 실수 ${Kv}의 최댓값은? (단, ${Kv} &gt; 0)`, k, {
          signed: false, calc: c - s < t - c ? `${jn(c)}-${jn(s)}` : `${jn(t)}-${jn(c)}`, rule: 'interval-sym',
          explain: `${num(s)} ≤ ${num(c)} − ${Kv}이고 ${num(c)} + ${Kv} ≤ ${num(t)}이어야 하므로 ${Kv} ≤ ${c - s}, ${Kv} ≤ ${t - c}이다. 따라서 최댓값은 ${k}이다.`
        });
      }
      const m = d.int(1, 3), nn = d.int(1, 4), s = d.int(-6, -1), t = s + m + nn + d.int(2, 6);
      return slots(`두 조건 ${cond('p', `${Av} − ${m} ≤ ${X} ≤ ${Av} + ${nn}`)}, ${cond('q', `${num(s)} ≤ ${X} ≤ ${num(t)}`)}에 대하여 명제 ${pV} ${TO} ${ej(qV, '이/가')} 참이 되도록 하는 실수 ${Av}의 최솟값과 최댓값을 차례대로 구하시오.`, [['최솟값', s + m, `${jn(s)}+${m}`], ['최댓값', t - nn, `${t}-${nn}`]], {
        rule: 'interval-two', explain: `${num(s)} ≤ ${Av} − ${m}이고 ${Av} + ${nn} ≤ ${num(t)}이어야 하므로 ${num(s + m)} ≤ ${Av} ≤ ${num(t - nn)}이다.`
      });
    }, { count: 2 })
  ];

  // ════════════════════════════════════════════════════════════════
  // ── 명제의 역과 대우 ──
  // 명제와 역·대우를 나타낸 네 칸 그림: 왼쪽 위에 명제, 오른쪽 위 ㉠, 왼쪽 아래 ㉡, 오른쪽 아래 ㉢. 가로는 역, 대각선은 대우.
  const svgL = (l) => (l.neg ? '∼' : '') + `<tspan style="${IT}">${'pqr'[l.v]}</tspan>`;
  const plainL = (l) => (l.neg ? '∼' : '') + 'pqr'[l.v];
  function diagFig(A, Bq) {
    const W = 288, Hh = 150, bw = 96, bh = 32, xs = [14, W - 14 - bw], ys = [12, Hh - 12 - bh];
    const boxAt = (x, y, text) => `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="6" style="fill:#fff;stroke:${INK};stroke-width:1.3"/><text x="${x + bw / 2}" y="${y + bh / 2 + 5}" text-anchor="middle" style="font-size:14px;fill:${INK}">${text}</text>`;
    const head = (x, y, ang) => { const a = ang * Math.PI / 180, p1 = [x - 8 * Math.cos(a - 0.45), y - 8 * Math.sin(a - 0.45)], p2 = [x - 8 * Math.cos(a + 0.45), y - 8 * Math.sin(a + 0.45)]; return `<path d="M${p1[0].toFixed(1)} ${p1[1].toFixed(1)}L${x} ${y}L${p2[0].toFixed(1)} ${p2[1].toFixed(1)}" style="fill:none;stroke:${BLUE};stroke-width:1.4"/>`; };
    const link = (x1, y1, x2, y2) => { const ang = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI; return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:${BLUE};stroke-width:1.4"/>` + head(x2, y2, ang) + head(x1, y1, ang + 180); };
    const gx1 = xs[0] + bw + 5, gx2 = xs[1] - 5, mx = W / 2, my = Hh / 2;
    let body = boxAt(xs[0], ys[0], svgL(A) + ' → ' + svgL(Bq)) + boxAt(xs[1], ys[0], '㉠') + boxAt(xs[0], ys[1], '㉡') + boxAt(xs[1], ys[1], '㉢');
    body += link(gx1, ys[0] + bh / 2, gx2, ys[0] + bh / 2) + link(gx1, ys[1] + bh / 2, gx2, ys[1] + bh / 2);
    body += link(xs[0] + bw + 2, ys[0] + bh + 2, xs[1] - 2, ys[1] - 2) + link(xs[1] - 2, ys[0] + bh + 2, xs[0] + bw + 2, ys[1] - 2);
    body += word(mx, ys[0] + bh / 2 - 6, '역', { size: 12, color: BLUE }) + word(mx, ys[1] + bh / 2 + 17, '역', { size: 12, color: BLUE });
    body += `<rect x="${mx - 15}" y="${my - 10}" width="30" height="19" style="fill:#fff"/>` + word(mx, my + 4.5, '대우', { size: 12, color: BLUE });
    return svg(W, Hh, `네 칸 그림: 왼쪽 위 칸에 명제 ${plainL(A)} → ${plainL(Bq)}, 오른쪽 위 칸 ㉠, 왼쪽 아래 칸 ㉡, 오른쪽 아래 칸 ㉢. 위의 두 칸, 아래의 두 칸은 각각 서로 역이고, 대각선으로 마주 보는 두 칸은 서로 대우이다.`, body);
  }
  // 역·대우를 만들어 볼 명제: 조건 p, q 와 넣어 볼 수
  function convPool(d) {
    const k = d.int(2, 5), a = d.int(1, 3), m = d.int(1, 3), lo = d.int(-3, 2), hi = lo + d.int(1, 4), bb = (a + d.int(0, 2)) ** 2;
    return [
      { p: xr('=', k), q: xpoly(1, 0, 0, '=', k * k), S: RX },
      { p: xabs(0, '=', a), q: xpoly(1, 0, 0, '<=', bb), S: RX },
      { p: xr('<', lo), q: xr('<', hi), S: RX },
      { p: xr('!=', 0), q: xpoly(1, 0, 0, '>', 0), S: RX },
      { p: OR(vr('a', '=', 0), vr('b', '=', 0)), q: at(`${Av}${Bv}`, '=', 0, (e) => e.a * e.b), S: R2.ab },
      { p: AND(vr('a', '>', m), vr('b', '>', m)), q: at(`${Av} + ${Bv}`, '>', 2 * m, (e) => e.a + e.b), S: R2.ab },
      { p: at(`${Av} + ${Bv}`, '=', 0, (e) => e.a + e.b), q: at(`${Av}${Bv}`, '<', 0, (e) => e.a * e.b), S: R2.ab },
      { p: xr('=', k), q: xpoly(1, -(k + m), k * m, '='), S: RX }
    ];
  }
  // 잘못 부정한 조건: 「또는」·「이고」를 그대로 두거나, 등호를 빼고 부등호만 뒤집는다(바른 부정과 같아지면 null).
  const BAD = { '<': '>', '<=': '>=', '>': '<', '>=': '<=' };
  function badN(c) {
    if (c.k === 'at') return BAD[c.op] ? at(c.lhs, BAD[c.op], c.c, c.val) : null;
    if (c.k === 'or') return OR(...c.list.map(cN));
    if (c.k === 'and') return AND(...c.list.map(cN));
    return null;
  }
  // 역·대우의 참·거짓을 가릴 명제(n = 0: 실수 하나·자연수, n = 1: 두·세 실수)
  function tfPool(d, two) {
    const k = d.int(2, 5), a = d.int(1, 4), m = d.pick([2, 3, 4, 6]), nn = d.pick([4, 6, 8, 12].filter((v) => v !== m));
    if (!two) return [
      { p: xpoly(1, -k, 0, '='), q: xr('=', k), S: RX }, { p: xpoly(1, 0, 0, '<', k * k), q: iv('x', -k, k, false, false), S: RX },
      { p: xr('>', a), q: xpoly(1, 0, 0, '>', a * a), S: RX }, { p: xr('=', -a), q: xpoly(1, 0, 0, '=', a * a), S: RX },
      { p: xabs(0, '<', a), q: xr('<', a), S: RX }, { p: xpoly(1, 0, 0, '<=', k * k), q: xr('<=', k), S: RX },
      { p: pr(`${X}가 ${m}의 배수`, `${X}가 ${m}의 배수가 아님`, (e) => e.x % m === 0), q: pr(`${X}는 ${nn}의 배수`, `${X}는 ${nn}의 배수가 아님`, (e) => e.x % nn === 0), S: NX }
    ];
    const P = (h, f) => pr(h, '', f);
    return [
      { p: P(`${Av} = ${Bv}`, (e) => e.a === e.b), q: P(`${sq(Av)} = ${sq(Bv)}`, (e) => e.a * e.a === e.b * e.b), S: R2.ab },
      { p: P(`${Av}${Bv} ≠ 0`, (e) => e.a * e.b !== 0), q: P(`${Av} ≠ 0`, (e) => e.a !== 0), S: R2.ab },
      { p: P(`${Av} + ${Bv} &gt; 0`, (e) => e.a + e.b > 0), q: P(`${Av} &gt; 0이고 ${Bv} &gt; 0`, (e) => e.a > 0 && e.b > 0), S: R2.ab },
      { p: P(`${Av} &gt; 0이고 ${Bv} &gt; 0`, (e) => e.a > 0 && e.b > 0), q: P(`${Av}${Bv} &gt; 0`, (e) => e.a * e.b > 0), S: R2.ab },
      { p: P(`${sq(Av)} + ${sq(Bv)} = 0`, (e) => e.a * e.a + e.b * e.b === 0), q: P(`${Av} = 0이고 ${Bv} = 0`, (e) => e.a === 0 && e.b === 0), S: R2.ab },
      { p: P(`|${Av}| = |${Bv}|`, (e) => Math.abs(e.a) === Math.abs(e.b)), q: P(`${Av} = ${Bv}`, (e) => e.a === e.b), S: R2.ab },
      { p: P(`${Av} = ${Bv}`, (e) => e.a === e.b), q: P(`${Av}${Cv} = ${Bv}${Cv}`, (e) => e.a * e.c === e.b * e.c), S: grid3 }
    ];
  }
  // 역이 참인가를 가릴 명제
  function convTruthPool() {
    const P = (h, f) => pr(h, '', f), ab = R2.ab, xy = R2.xy;
    return [
      { p: P(`${Av} = ${Bv}`, (e) => e.a === e.b), q: P(`${sq(Av)} = ${sq(Bv)}`, (e) => e.a * e.a === e.b * e.b), S: ab },
      { p: P(`${Av} = ${Bv}`, (e) => e.a === e.b), q: P(`${Av} + ${Cv} = ${Bv} + ${Cv}`, (e) => e.a + e.c === e.b + e.c), S: grid3 },
      { p: P(`${Av} &gt; 0이고 ${Bv} &gt; 0`, (e) => e.a > 0 && e.b > 0), q: P(`${Av} + ${Bv} &gt; 0`, (e) => e.a + e.b > 0), S: ab },
      { p: P(`${X}가 3의 약수`, (e) => 3 % e.x === 0), q: P(`${X}는 6의 약수`, (e) => 6 % e.x === 0), S: NX },
      { p: P(`${Av}${Cv} = ${Bv}${Cv}`, (e) => e.a * e.c === e.b * e.c), q: P(`${Av} = ${Bv}`, (e) => e.a === e.b), S: grid3 },
      { p: P(`${Av}${Bv} &gt; 1`, (e) => e.a * e.b > 1), q: P(`${Av} &gt; 1이고 ${Bv} &gt; 1`, (e) => e.a > 1 && e.b > 1), S: ab },
      { p: P(`${sq(Av)} + ${sq(Bv)} = 0`, (e) => e.a * e.a + e.b * e.b === 0), q: P(`${Av} = 0이고 ${Bv} = 0`, (e) => e.a === 0 && e.b === 0), S: ab },
      { p: P(`${sq(Av)} = ${sq(Bv)}`, (e) => e.a * e.a === e.b * e.b), q: P(`${Av} = ${Bv}`, (e) => e.a === e.b), S: ab },
      { p: P(`${Av}${Bv} &gt; 0`, (e) => e.a * e.b > 0), q: P(`${Av} &gt; 0이고 ${Bv} &gt; 0`, (e) => e.a > 0 && e.b > 0), S: ab },
      { p: P(`${sq(X)} + ${sq(Yv)} = 0`, (e) => e.x * e.x + e.y * e.y === 0), q: P(`${X} = 0 또는 ${Yv} = 0`, (e) => e.x === 0 || e.y === 0), S: xy },
      { p: P(`${X} &gt; 0이고 ${Yv} &lt; 0`, (e) => e.x > 0 && e.y < 0), q: P(`${X}${Yv} &lt; 0`, (e) => e.x * e.y < 0), S: xy },
      { p: P(`|${X}| = |${Yv}|`, (e) => Math.abs(e.x) === Math.abs(e.y)), q: P(`${X} = ${Yv}`, (e) => e.x === e.y), S: xy },
      { p: P(`${sq(X)} &gt; ${sq(Yv)}`, (e) => e.x * e.x > e.y * e.y), q: P(`${X} &gt; ${Yv}`, (e) => e.x > e.y), S: xy },
      { p: P(`${X} = 0 또는 ${Yv} = 0`, (e) => e.x === 0 || e.y === 0), q: P(`${X}${Yv} = 0`, (e) => e.x * e.y === 0), S: xy }
    ].map((t) => Object.assign(t, { h: stmt(t.p.h, t.q.h), orig: implies(t.p, t.q, t.S), conv: implies(t.q, t.p, t.S) }));
  }
  const CONV_POOL = convTruthPool();
  const varNote = (S) => (S === R2.ab ? ` (단, ${Av}, ${Bv}는 실수이다.)` : S === grid3 ? ` (단, ${Av}, ${Bv}, ${Cv}는 실수이다.)` : S === R2.xy ? ` (단, ${X}, ${Yv}는 실수이다.)` : '');

    // 문자의 범위: 약수가 나오는 명제가 섞였을 때만 자연수라고 따로 적는다
    const convNote = (list) => (list.some((t) => t.S === NX) ? '(단, 약수가 나오는 명제의 문자는 자연수이고, 나머지 문자는 모두 실수이다.)' : '(단, 문자는 모두 실수이다.)');
  const convTypes = [
    T('conv-diagram', '명제와 역·대우의 자리', '①29', (d) => {
      const A = L(0, d.bool()), Bq = L(1, d.bool()), ask = d.int(0, 2), mark = ['㉠', '㉡', '㉢'][ask];
      const forms = [[Bq, A], [negL(A), negL(Bq)], [negL(Bq), negL(A)], [A, Bq]], names = ['역', '역의 대우', '대우', '처음 명제'];
      const rows = forms.map(([u, w], i) => ({ h: impH(u, w), ok: i === ask }));
      return oneQ(d, `다음 그림은 명제 ${impH(A, Bq)}와 그 역, 대우 사이의 관계를 나타낸 것이다. ${mark}에 알맞은 명제는?`, rows, true, {
        figure: diagFig(A, Bq),
        explain: `㉠은 처음 명제의 역 ${impH(Bq, A)}, ㉢은 처음 명제의 대우 ${impH(negL(Bq), negL(A))}, ㉡은 ㉠의 대우 ${impH(negL(A), negL(Bq))}이다. 따라서 ${mark}에 알맞은 것은 ${names[ask]}인 ${impH(...forms[ask])}이다.`
      });
    }),
    T('conv-make', '명제의 역·대우 고르기', '①30', (d, n) => {
      const wantContra = n === 0;
      const g = d.until(() => {
        const t = d.pick(convPool(d)), { p, q, S } = t, bq = badN(q), bp = badN(p);
        const cands = [[cN(q), cN(p)], [q, p], [cN(p), cN(q)], [p, q]].concat(bq && bp ? [[bq, bp]] : [], bq ? [[bq, cN(p)]] : []);
        const isRight = ([u, w]) => (wantContra ? sameSet(u, cN(q), S) && sameSet(w, cN(p), S) : sameSet(u, q, S) && sameSet(w, p, S));
        const rows = [], seen = new Set();
        for (const cd of [cands[wantContra ? 0 : 1]].concat(d.shuffle(cands))) {
          const h = stmt(cH(cd[0]), cH(cd[1]));
          if (rows.length === 4 || seen.has(h)) continue;
          if (rows.length && isRight(cd)) continue;
          seen.add(h); rows.push({ h, ok: isRight(cd) });
        }
        return { t, rows };
      }, (r) => r.rows.length === 4 && r.rows.filter((x) => x.ok).length === 1);
      const { p, q, S } = g.t;
      return oneQ(d, `명제 ${quo(stmt(cH(p), cH(q)))}의 ${wantContra ? '대우는' : '역은'}?${varNote(S)}`, g.rows, true, {
        explain: wantContra ? `대우는 가정과 결론을 각각 부정하여 서로 바꾼 것이므로 ${quo(stmt(cH(cN(q)), cH(cN(p))))}이다.` : `역은 가정과 결론을 서로 바꾼 것이므로 ${quo(stmt(cH(q), cH(p)))}이다.`,
        rule: wantContra ? 'make-contra' : 'make-converse'
      });
    }, { count: 2 }),
    T('conv-truth', '명제의 역·대우의 참·거짓', '①31', (d, n) => {
      const t = d.pick(tfPool(d, n === 1)), conv = implies(t.q, t.p, t.S), orig = implies(t.p, t.q, t.S);
      const combos = [[true, true], [true, false], [false, true], [false, false]];
      const rows = combos.map(([u, w]) => ({ h: `역: ${tv(u)}, 대우: ${tv(w)}`, ok: u === conv && w === orig }));
      const ce = conv ? null : cexOf(t.q, t.p, t.S), ce2 = orig ? null : cexOf(t.p, t.q, t.S);
      return oneQ(d, `명제 ${quo(stmt(cH(t.p), cH(t.q)))}의 역과 대우의 참, 거짓을 바르게 짝지은 것은?${varNote(t.S)}`, rows, true, {
        keep: true, rule: n === 1 ? 'tf-two' : 'tf-one',
        explain: `역 ${quo(stmt(cH(t.q), cH(t.p)))}는 ${conv ? '참' : `거짓이다([반례] ${showE(ce)})`}${conv ? '이다' : ''}. 대우는 처음 명제와 참, 거짓이 같다. 처음 명제는 ${orig ? '참' : `거짓([반례] ${showE(ce2)})`}이므로 대우도 ${tv(orig)}이다.`
      });
    }, { count: 2 }),
    T('conv-pick', '역(역과 대우)이 참인 명제 고르기', '①32', (d, n) => {
      if (n === 0) {
        const pool = d.shuffle(CONV_POOL), hit = pool.find((t) => t.conv), rest = pool.filter((t) => !t.conv).slice(0, 4);
        return oneQ(d, `다음 명제 중 그 역이 참인 것은? ${convNote([hit].concat(rest))}`, [hit].concat(rest).map((t) => ({ h: t.h, ok: t.conv })), true, {
          explain: `${quo(t2s(hit))}의 역 ${quo(stmt(hit.q.h, hit.p.h))}는 참이다. 나머지의 역은 반례가 있어 거짓이다.`, rule: 'pick-converse'
        });
      }
      const picked = d.until(() => d.shuffle(CONV_POOL).slice(0, 3), (list) => list.some((t) => t.orig && t.conv) && !list.every((t) => t.orig && t.conv));
      const rows = picked.map((t) => ({ h: t.h, ok: t.orig && t.conv, why: `역은 ${tv(t.conv)}, 대우는 ${tv(t.orig)}이다.` }));
      return setsQ(d, `다음 보기에서 역과 대우가 모두 참인 명제만을 있는 대로 고른 것은? ${convNote(picked)}`, rows, { what: '역과 대우가 모두 참인 명제', rule: 'pick-both' });
    }, { count: 2 }),
    T('conv-root', '대우로 상수 구하기 — 근 하나', '①33', (d, n) => {
      if (n === 0) {
        const { r, c } = d.until(() => { const r0 = d.pick([-4, -3, -2, -1, 1, 2, 3, 4]); return { r: r0, c: r0 * d.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]) }; }, (t) => t.r * t.r + t.c !== 0);
        const a = -(r * r + c) / r, expr = `${sq(X)} + ${Av}${X} ${c < 0 ? MINUS : '+'} ${Math.abs(c)}`;
        return numQ(`명제 ${quo(`${expr} ≠ 0이면 ${X} ≠ ${num(r)}이다.`)}가 참일 때, 상수 ${Av}의 값은?`, a, {
          calc: `-(${jn(r)}*${jn(r)}+${jn(c)})/${jn(r)}`, rule: 'root-sentence',
          explain: `대우 ${quo(`${X} = ${num(r)}이면 ${expr} = 0이다.`)}도 참이므로 ${par(r)}${sup(2)} + ${Av} × ${par(r)} ${c < 0 ? MINUS : '+'} ${Math.abs(c)} = 0에서 ${Av} = ${num(a)}이다.`
        });
      }
      const { s, b } = d.until(() => ({ s: d.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]), b: d.pick([-4, -3, -2, -1, 1, 2, 3, 4]) }), (t) => t.b * t.s - t.s * t.s !== 0);
      const a = b * s - s * s, expr = `${sq(X)} ${b < 0 ? MINUS : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}${X} + ${Av}`;
      return numQ(`실수 ${X}에 대하여 두 조건 ${cond('p', `${expr} ≠ 0`)}, ${cond('q', `${linH(1, s)} ≠ 0`)}이 있다. 명제 ${pV} ${TO} ${ej(qV, '이/가')} 참일 때, 상수 ${Av}의 값은?`, a, {
        calc: `${jn(b)}*${jn(s)}-${jn(s)}*${jn(s)}`, unseen: Math.abs(b) === 1 ? [1] : [], rule: 'root-pq',
        explain: `대우 ${NOT}${qV} ${TO} ${NOT}${pV}, 즉 ${quo(`${X} = ${num(-s)}이면 ${expr} = 0이다.`)}가 참이므로 ${par(-s)}${sup(2)} ${b < 0 ? MINUS : '+'} ${Math.abs(b)} × ${par(-s)} + ${Av} = 0에서 ${Av} = ${num(a)}이다.`
      });
    }, { count: 2 }),
    T('conv-roots', '대우로 상수 구하기 — x ≠ a 의 a 모두', '①34', (d) => {
      // 두 근이 ±r 이면 부호를 뒤집어 적어도 맞으므로 뺀다
      const [r1, r2] = d.until(() => { const u = d.int(-5, 3); return [u, u + d.int(1, 6)]; }, ([u, w]) => u + w !== 0), factored = d.bool(), fac = (r) => (r === 0 ? X : `(${linH(1, -r)})`), expr = factored ? (r2 === 0 ? fac(r2) + fac(r1) : fac(r1) + fac(r2)) : polyH(1, -(r1 + r2), r1 * r2);
      return M(`명제 ${quo(`${expr} ≠ 0이면 ${X} ≠ ${Av}이다.`)}가 참이 되도록 하는 상수 ${Av}의 값을 모두 구하시오.`, [{ label: `${Av} =`, answer: r1, signed: true }, { label: `${Av} =`, answer: r2, signed: true }], {
        unordered: true, shown: `${Av} = ${num(r1)} 또는 ${Av} = ${num(r2)}`,
        explain: `대우 ${quo(`${X} = ${Av}이면 ${expr} = 0이다.`)}가 참이어야 하므로 ${Av}는 방정식 ${expr} = 0의 해이다. 따라서 ${Av} = ${num(r1)} 또는 ${Av} = ${num(r2)}이다.`,
        facts: { roots: [r1, r2], check: 'roots' }
      });
    }),
    T('conv-orconst', '대우로 범위의 상수 구하기 — 「또는」이 든 결론', '①35', (d, n) => {
      if (n === 0) {
        const p = d.int(1, 3), q = d.int(1, 3), s = d.int(-2, 5), t = d.int(-2, 5), k = p * s + q * t, co = (c) => (c === 1 ? '' : c);
        return numQ(`두 실수 ${Av}, ${Bv}에 대하여 명제 ${quo(`${co(p)}${Av} + ${co(q)}${Bv} &lt; ${Kv}이면 ${Av} &lt; ${num(s)} 또는 ${Bv} &lt; ${num(t)}이다.`)}가 참이 되도록 하는 실수 ${Kv}의 최댓값은?`, k, {
          calc: `${p}*${jn(s)}+${q}*${jn(t)}`, unseen: [1].concat(s === 0 || t === 0 ? [0] : []), rule: 'or-max',
          explain: `대우 ${quo(`${Av} ≥ ${num(s)}이고 ${Bv} ≥ ${num(t)}이면 ${co(p)}${Av} + ${co(q)}${Bv} ≥ ${Kv}이다.`)}가 참이어야 한다. 이때 ${co(p)}${Av} + ${co(q)}${Bv}의 가장 작은 값은 ${num(k)}이므로 ${Kv} ≤ ${num(k)}이고, 최댓값은 ${num(k)}이다.`
        });
      }
      const m = d.int(4, 12), s = d.int(-2, 3), k = m - s;
      return numQ(`두 실수 ${Av}, ${Bv}에 대하여 명제 ${quo(`${Av} + ${Bv} &lt; ${m}이면 ${Av} &lt; ${num(s)} 또는 ${Bv} &lt; ${Kv}이다.`)}가 참이 되도록 하는 실수 ${Kv}의 최솟값은?`, k, {
        calc: `${m}-${jn(s)}`, unseen: s === 0 ? [0] : [], rule: 'or-min',
        explain: `대우 ${quo(`${Av} ≥ ${num(s)}이고 ${Bv} ≥ ${Kv}이면 ${Av} + ${Bv} ≥ ${m}이다.`)}가 참이어야 한다. ${Av} + ${Bv}의 가장 작은 값 ${num(s)} + ${Kv}가 ${m} 이상이어야 하므로 ${Kv} ≥ ${num(k)}이고, 최솟값은 ${num(k)}이다.`
      });
    }, { count: 2 }),
    T('conv-chain', '참인 명제로부터 항상 참인 명제 고르기(대우·삼단논법)', '①36', (d, n) => {
      if (n === 2) {
        const A = L(0, d.bool()), Bq = L(1, d.bool()), hyp = impR(A, Bq);
        const cands = [[negL(Bq), negL(A)], [Bq, A], [negL(A), negL(Bq)], [A, negL(Bq)], [Bq, negL(A)]].map(([u, w]) => ({ u, w, ok: always([hyp], impR(u, w), 2) }));
        const hit = cands.find((c) => c.ok), rest = d.shuffle(cands.filter((c) => !c.ok)).slice(0, 3);
        return oneQ(d, `두 조건 ${pV}, ${qV}에 대하여 명제 ${ej(impH(A, Bq), '이/가')} 참일 때, 다음 중 항상 참인 명제는?`, [hit].concat(rest).map((c) => ({ h: impH(c.u, c.w), ok: c.ok })), true, {
          explain: `명제와 그 대우는 참, 거짓이 같으므로 대우 ${ej(impH(hit.u, hit.w), '이/가')} 항상 참이다. 역이나 다른 명제는 참이라고 할 수 없다.`, rule: 'chain-one'
        });
      }
      const g = d.until(() => {
        const [x, y, z] = d.shuffle([0, 1, 2]), H1 = [L(x, d.bool()), L(y, d.bool())], back = d.bool();
        const H2 = back ? [L(z, d.bool()), L(y, d.bool())] : [L(y, d.bool()), L(z, d.bool())];
        const hyps = [impR(...H1), impR(...H2)], key = (u, w) => lH(u) + '>' + lH(w), skip = new Set([key(...H1), key(...H2)]);
        const cands = [];
        for (let i = 0; i < 3; i += 1) for (let j = 0; j < 3; j += 1) if (i !== j) for (const s of [false, true]) for (const t of [false, true]) {
          const u = L(i, s), w = L(j, t); if (skip.has(key(u, w))) continue;
          cands.push({ u, w, ok: always(hyps, impR(u, w), 3) });
        }
        return { H1, H2, cands };
      }, (t) => t.cands.filter((c) => c.ok).length >= 4);
      const head = `세 조건 ${pV}, ${qV}, ${rV}에 대하여 두 명제 ${impH(...g.H1)}, ${ej(impH(...g.H2), '이/가')} 모두 참일 때,`;
      const lead = `참인 명제의 대우 ${impH(negL(g.H1[1]), negL(g.H1[0]))}, ${impH(negL(g.H2[1]), negL(g.H2[0]))}도 참이고, 참인 명제를 이어 붙인 명제(삼단논법)도 참이다.`;
      if (n === 0) {
        const goods = d.shuffle(g.cands.filter((c) => c.ok)).slice(0, 4), bad = d.pick(g.cands.filter((c) => !c.ok));
        return oneQ(d, `${head} 다음 중 항상 참이라고 할 수 없는 것은?`, goods.concat([bad]).map((c) => ({ h: impH(c.u, c.w), ok: c.ok })), false, {
          explain: `${lead} ${ej(impH(bad.u, bad.w), '은/는')} 주어진 명제에서 이끌어 낼 수 없으므로 항상 참이라고 할 수 없다.`, rule: 'chain-not'
        });
      }
      const picked = d.until(() => d.shuffle(g.cands).slice(0, 4), (list) => list.some((c) => c.ok) && !list.every((c) => c.ok));
      return setsQ(d, `${head} 다음 보기에서 항상 참인 명제만을 있는 대로 고른 것은?`, picked.map((c) => ({ h: impH(c.u, c.w), ok: c.ok, why: c.ok ? '' : '주어진 명제에서 이끌어 낼 수 없다.' })), {
        lead, what: '항상 참인 명제', rule: 'chain-sets'
      });
    }, { count: 3 })
  ];
  const t2s = (t) => stmt(t.p.h, t.q.h);

  // ════════════════════════════════════════════════════════════════
  // b.js·c.js 가 함께 쓰는 도구
  B.kit.m1025 = {
    UNIT, STD, T, H, X, Yv, Av, Bv, Cv, Kv, Mv, Nv, pV, qV, rV, PS, QS, RS, US, NOT, TO, IMP, IFF, EMPTY, sq, num, numH, par, jn, quo, cond, roster, setOf, polyH, linH, absH, ej, lj, slots, numQ,
    GA, bogi, setsQ, oneQ, OPH, OPF, NEG, at, iv, pr, OR, AND, xr, vr, xpoly, xabs, cH, cF, cN, RX, NX, ZX, grid2, R2, grid3, holdsAll, holdsSome, nice, implies, sameSet, relOf, isPrime, divisors,
    maskOf, sH, sHp, relHolds, rH, always, LIT, L, lH, lS, wrapL, impH, impR, negL, INK, BLUE, svg, IT, word, regionSpots, cfgOf, vennFig, tv, stmt, noDot, cexOf, showE, fillProps, mixWants, varNote
  };

  B.addUnit({
    id: '10-2-5', grade: 10, semester: 2, no: 5, title: '명제', version: 1,
    groups: [
      { id: 'prop', title: '명제와 조건', standard: STD.prop, types: propTypes },
      { id: 'quant', title: '‘모든’이나 ‘어떤’을 포함한 명제', standard: STD.prop, types: quantTypes },
      { id: 'impl', title: '명제 p → q의 참, 거짓', standard: STD.prop, types: implTypes },
      { id: 'conv', title: '명제의 역과 대우', standard: STD.conv, types: convTypes },
      { id: 'cond', title: '충분조건과 필요조건', standard: STD.cond, types: [] },
      { id: 'proof', title: '대우를 이용한 증명법과 귀류법', standard: STD.proof, types: [] },
      { id: 'ineq', title: '절대부등식', standard: STD.ineq, types: [] }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
