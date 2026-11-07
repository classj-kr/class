// 고등학교 대수 Ⅲ-1 「등차수열과 등비수열」 — 단원 틀·도구와 앞쪽 묶음(수열의 뜻, 등차수열의 뜻과 일반항, 등차수열의 합).
// 수집해 둔 천재 T셀파 대수(전인태, 2022 개정)의 교과서·평가 자료에서 뽑은 문제 꼴 목록
// (기본꼴_1: 수열의 뜻·등차수열 38꼴, 기본꼴_2: 등비수열·합과 일반항·함께 36꼴, 심화꼴: 기출 5꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음 / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/11-1-5/싣기_대조표.md 에 있다.
// (등비수열·등비수열의 합·수열의 합과 일반항의 관계·등차와 등비를 함께 쓰는 꼴은 11-1-5b.js 에, 실력 문항은 11-1-5c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
// 영역은 대수의 「수열」. 성취기준은 12대수03-01(수열의 뜻), 12대수03-02(등차수열의 일반항과 합), 12대수03-03(등비수열의 일반항과 합).
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(일반항·나열·두 항·두 합·관계식), 묻는 것(값·일반항·항 번호·개수·고르기), 계산의 얼개가 다르면 따로 싣는다.
//    같은 꼴에서 수만 바꾼 유형은 만들지 않았다. 차례(count)마다 주는 것이나 묻는 것이 다르다.
//  - 내신 대비라 수학 실력에 필요해 보이는 꼴은 다 싣는다. 교육과정의 「지나치게 복잡한 상황은 다루지 않는다」(연금·대출 상환)는 정도를 말하는 줄이고 수집본에 그런 꼴은 없다.
//    고1과 겹치는 도구(나머지정리, 근과 계수의 관계)를 쓰는 꼴도 수열을 묻는 일이므로 싣는다(이 단원에 정한 것).
//    Σ 기호와 그 성질은 다음 단원(수열의 합)의 일이라 쓰지 않는다. 원문이 Σ로 적은 기출·평가 문항은 「T₁ + T₃ + … + T₁₅」처럼 풀어 적었다.
//  - 답: 등차수열의 일반항은 「aₙ = [±][ ]n [±][ ]」, 등비수열의 일반항은 「aₙ = [±][ ] × ([±][ ])ⁿ⁻¹」(공비가 분수이면 「([±][ ]/[ ])ⁿ⁻¹」, 기약분수)로 받는다.
//    한 유형의 칸 모양은 씨앗이 바뀌어도 같다(정수 답 유형은 늘 정수, 분수 답 유형은 늘 분수가 나오게 수를 고른다). 항의 값·공차·공비·상수처럼 음수가 될 수 있는 수 칸에는
//    부호 단추를 모두 단다. 항 번호(제몇 항)·개수·길이·넓이에는 달지 않는다. 9999를 넘는 수와 둘째 자리 이상의 소수는 칸으로 받지 않는다.
//    거듭제곱을 남긴 큰 답(5⁹ − 1 따위)은 고르기로 낸다.
//  - 원문이 따로 구한 값을 더하거나 곱해 물은 곳(a + b, xy, k + a₁, a₁ + a₉ …)은 칸마다 따로 묻는다. 다만 a, b가 하나로 정해지지 않아 식의 값으로만 정해지는 꼴
//    (등비중항으로 a² + ab + b², 등차중항·등비중항으로 a² + b²)은 원문처럼 식의 값을 묻는다.
//  - 「~임을 보이시오·설명하시오」는 공차·공비·값만 묻는다. 계산기가 있어야 하는 값(10제곱근, log 0.99)은 문제 글로 준다.
//  - 검사 근거: 칸마다 글에 보이는 수로 다시 셈하는 식(facts.calc·value)을 단다. 글에 없는 수(1, 2 따위)는 seal 이 facts.unseen 에 밝히고,
//    밝히기로 한 수(derived) 밖의 수가 나오면 오류를 낸다. 「제몇 항」처럼 식으로 거꾸로 셈할 수 없는 답은 facts.range(부등식을 만족하는 자연수의 끝)로 다시 찾는다.
//
// 뺀 것과 까닭(11-1-5b.js, 11-1-5c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 놀이·활동(생각 열기): 조건에 맞는 수와 상황(초콜릿 배열, 보증금, 꿀타래)을 차례로 나열하기(①9). 수열을 처음 보이는 활동이고 하는 일은 ①2·①3에 있다.
//  - 겹침(같은 일): 등차·등비 묶음 합의 수열로 다음 합(①31의 S₃, S₆ → S₁₂ — ①30), 첫째항이 √2인 등비수열의 일반항(②3의 차4-1 — ②3), Sₙ에서 구한 항들의 절댓값(②25의 기말11 — ②25),
//    a₂ − a₁ 과 두 항의 합으로 공차·합(①18의 소2-발2 — ①18 첫째 차례), 공비가 분수인 Sₙ = (3/2)ⁿ − 1 의 일반항(②26의 차6-2 — ②26),
//    수능 기출의 등차수열 두 항의 관계식(심1 — ①18), 첫째항과 두 항의 합으로 공비(심2 — ②10).
// 묻는 말: 수나 값은 「~은?/~는?」, 항 번호는 「제몇 항인가?」, 시키는 말은 「~하시오.」 문자는 값을 물으면 「상수 a」로 부른다(원문이 「실수 a」이면 그대로).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { box, frac, lines, N, M, C, F, inline } = B.kit;
  const { MINUS, gcd, range, Q, qadd, qsub, qmul, qdiv, qneg, qabs, qpow, qcmp, isInt, tx, nb, tail, tj, V, sup, nz, asQ, poly, lin, rt, sys } = B.kit.mid;
  const { ms, sub, jh, lg, trig, fn } = B.kit.hs;

  const UNIT = '11-1-5', S1 = '12대수03-01', S2 = '12대수03-02', S3 = '12대수03-03';

  // ── 검사 근거 마무리 ──
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
  // 만들기가 null 을 돌려주면(조건에 맞지 않는 수) 다시 만든다.
  // 칸으로 받는 수는 9999를 넘지 않는다(분수의 분자·분모도). 넘으면 수를 다시 고른다.
  const tooBig = (item) => Array.isArray(item.inputs) && item.inputs.some((input) => !input.rel && Math.abs(input.answer) > 9999);
  const retry = (make) => (d, n) => { for (let i = 0; i < 4000; i += 1) { const item = make(d, n); if (item && !tooBig(item)) return seal(item); } throw new Error('조건에 맞는 문항을 만들지 못했다'); };
  const srcOf = (ref) => (/[①②]/.test(ref) ? '수집본 기본 자료(' : '수집본 심화 자료(') + ref + ')';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: srcOf(ref), make: retry(make) }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: srcOf(ref), make: retry(make) }, more || {});

  // ── 수와 글 ──
  const iq = (n) => tx(Q(n));                                                      // 정수 −3
  const qq = (x) => tx(asQ(x));                                                    // 정수나 분수
  const jn = (n) => (n < 0 ? '(' + n + ')' : String(n));                          // 검사 식에 적는 정수
  const jq = (x) => { const q = asQ(x); return q.q === 1 ? jn(q.p) : '(' + q.p + '/' + q.q + ')'; };
  const nj = (n, pair) => iq(n) + tail(Math.abs(n), pair);                         // 정수 뒤 토씨
  const qj = (x, pair) => tj(asQ(x), pair);                                        // 분수 뒤 토씨(분자의 끝소리)
  const A = (k) => ms('a_{' + k + '}');                                            // aₖ
  const SS = (k) => ms('S_{' + k + '}');                                           // Sₖ
  const NV = V('n'), AN = A('n'), SN = SS('n');
  const SEQ = nb('{' + AN + '}');                                                  // {aₙ}
  const eq = (l, r) => nb(l + ' = ' + r);
  const EXP = sup(ms('n-1'));                                                      // ⁿ⁻¹
  const listH = (vals, more) => vals.map(qq).join(', ') + (more === false ? '' : ', …');
  const NOTEF = ' <span style="white-space:nowrap">(단, 분수는 기약분수로 적는다.)</span>';
  // 수열의 값
  const ar = (a, d, n) => a + (n - 1) * d;
  const arS = (a, d, n) => (n * (2 * a + (n - 1) * d)) / 2;
  const geoQ = (a, r, n) => qmul(asQ(a), qpow(asQ(r), n - 1));
  const geoSQ = (a, r, n) => { const ra = asQ(r); if (ra.p === ra.q) return qmul(asQ(a), Q(n)); return qdiv(qmul(asQ(a), qsub(qpow(ra, n), Q(1))), qsub(ra, Q(1))); };

  // ── 답 칸 ──
  const iA = (text, v, o) => N(text, v, Object.assign({ signed: true }, o));                         // 음수가 될 수 있는 값
  const nA = (text, v, o) => N(text, v, Object.assign({ signed: false }, o));                        // 개수·길이·넓이
  const termA = (text, v, o) => N(text, v, Object.assign({ signed: false, lead: '제', unit: '항' }, o));   // 항 번호
  const fA = (text, x, o) => { const q = asQ(x); return F(text, Math.abs(q.p), q.q, Object.assign({ improper: Math.abs(q.p) > q.q, anyForm: true, signed: true, negative: q.p < 0 }, o)); };
  // 답이 등차수열의 일반항 aₙ = an + b(a, b 는 0이 아닌 정수)
  const linT = (text, a, b, o) => inline(text, `${AN} = {0}${NV} {1}`, [{ answer: a, signed: true }, { answer: b, signed: true }], Object.assign({}, o, { shown: eq(AN, lin(a, b, NV)) }));
  // 답이 등비수열의 일반항 aₙ = c × rⁿ⁻¹(c, r 는 0이 아닌 정수, r ≠ 1)
  const gH = (c, r) => { const rq = asQ(r), base = rq.q === 1 && rq.p > 0 ? String(rq.p) : '(' + qq(rq) + ')'; return nb(`${qq(c)} × ${base}${EXP}`); };
  const geoT = (text, c, r, o) => inline(text, `${AN} = {0} × ({1})${EXP}`, [{ answer: c, signed: true }, { answer: r, signed: true }], Object.assign({}, o, { shown: eq(AN, gH(c, r)) }));
  // 답이 aₙ = c × (p/q)ⁿ⁻¹(공비가 정수가 아닌 분수)
  const geoTF = (text, c, r, o) => inline(text + NOTEF, `${AN} = {0} × (${frac('{1}', '{2}')})${EXP}`, [{ answer: c, signed: true }, { answer: r.p, signed: true }, { answer: r.q }], Object.assign({}, o, { shown: eq(AN, gH(c, r)) }));
  // 옳은 것 하나와 나머지를 섞는다. 보기는 [글, 옳은가]이다. 보기가 겹치거나 옳은 보기가 하나가 아니면 null(다시 만든다).
  function choose(d, text, rows, o) {
    const list = d.shuffle(rows), opt = o || {};
    if (new Set(list.map((r) => stripH(r[0]))).size !== list.length || list.filter((r) => r[1]).length !== 1) return null;
    return C(text, list.map((r) => r[0]), list.findIndex((r) => r[1]), Object.assign({}, opt, { facts: Object.assign({ truth: list.map((r) => r[1]), want: true }, opt.facts || {}) }));
  }
  // 수 여럿을 답하는 칸: [[앞에 적을 글, 답, 부호 단추를 다는가], …]
  const valsQ = (text, rows, o) => M(text, rows.map(([lead, v, sign]) => ({ answer: v, signed: sign !== false, lead: lead + ' =' })), Object.assign({}, o, { shown: rows.map(([lead, v]) => nb(`${lead} = ${iq(v)}`)).join(', ') }));
  // 두 칸에 이름을 붙여 받는다: [[이름, 답, 부호 단추를 다는가], …]
  const namedQ = (text, rows, o) => M(text, rows.map(([label, v, sign]) => ({ label, answer: v, signed: sign !== false })), Object.assign({}, o, { shown: rows.map(([label, v]) => `${label} ${iq(v)}`).join(', ') }));
  // 경우를 나눈 식(왼쪽 중괄호)
  const cases = (rows) => sys(rows.map(([h, cond]) => `${h} <span style="white-space:nowrap">(${cond})</span>`));

  B.kit.u1115 = {
    UNIT, S1, S2, S3, stripH, seal, retry, srcOf, T, H, iq, qq, jn, jq, nj, qj, A, SS, NV, AN, SN, SEQ, eq, EXP, listH, NOTEF, ar, arS, geoQ, geoSQ,
    iA, nA, termA, fA, linT, gH, geoT, geoTF, choose, valsQ, namedQ, cases
  };

  // ── 단원 틀 ──
  B.addUnit({
    id: '11-1-5', grade: 11, semester: 1, no: 5, title: '등차수열과 등비수열', version: 1,
    groups: [
      { id: 'mean', title: '수열의 뜻', standard: S1, types: [] },
      { id: 'ar', title: '등차수열의 뜻과 일반항', standard: S2, types: [] },
      { id: 'arsum', title: '등차수열의 합', standard: S2, types: [] },
      { id: 'geo', title: '등비수열의 뜻과 일반항', standard: S3, types: [] },
      { id: 'geosum', title: '등비수열의 합', standard: S3, types: [] },
      { id: 'snan', title: '수열의 합과 일반항의 관계', standard: S3, types: [] },
      { id: 'mix', title: '등차수열과 등비수열을 함께', standard: S3, types: [] }
    ]
  });


  // ── 일반항이 식으로 주어진 수열: { h 식의 글, f(n) 값(유리수), js(n) 검사 식 } ──
  const NN = NV + sup(2);
  const formula = {
    lin: (p, q) => ({ h: lin(p, q, NV), f: (n) => Q(p * n + q), js: (n) => `${jn(p)}*${n}+${jn(q)}` }),
    sqp: (p) => ({ h: poly([[1, NN], [p, NV]]), f: (n) => Q(n * n + p * n), js: (n) => `${n}*${n}+${jn(p)}*${n}` }),
    sqc: (c) => ({ h: poly([[1, NN], [c, '']]), f: (n) => Q(n * n + c), js: (n) => `${n}*${n}+${jn(c)}` }),
    pow: (b, c) => ({ h: nb(`${b}${sup(NV)}${c < 0 ? ' + ' + -c : ' ' + MINUS + ' ' + c}`), f: (n) => Q(b ** n - c), js: (n) => `${b}**${n}-${jn(c)}` }),
    con: (c) => ({ h: iq(c), f: () => Q(c), js: () => jn(c) }),
    prod: (c) => ({ h: nb(`${NV}(${NV} + ${c})`), f: (n) => Q(n * (n + c)), js: (n) => `${n}*(${n}+${c})` }),
    over: (c) => ({ h: frac(NV, nb(`${NV} + ${c}`)), f: (n) => Q(n, n + c), js: (n) => `${n}/(${n}+${c})` }),
    recip: (c) => ({ h: frac(1, nb(`${NV}(${NV} + ${c})`)), f: (n) => Q(1, n * (n + c)), js: (n) => `1/(${n}*(${n}+${c}))` }),
    alt: (p, q) => ({ h: nb(`(${MINUS}1)${sup(ms('n-1'))}(${lin(p, q, NV)})`), f: (n) => Q((n % 2 ? 1 : -1) * (p * n + q)), js: (n) => `(-1)**(${n}-1)*(${jn(p)}*${n}+${jn(q)})` }),
    half: (c) => ({ h: nb(`${c}{1 + (${MINUS}1)${sup(NV)}}`), f: (n) => Q(n % 2 ? 0 : 2 * c), js: (n) => `${c}*(1+(-1)**${n})` }),
    sgn: (c, shift) => ({ h: nb(`${c === 1 ? '' : c}(${MINUS}1)${sup(shift ? ms('n-1') : NV)}`), f: (n) => Q(c * ((n + (shift ? 1 : 0)) % 2 ? -1 : 1)), js: (n) => `${c}*(-1)**${shift ? '(' + n + '-1)' : n}` }),
    sgnN: () => ({ h: nb(`(${MINUS}1)${sup(NV)}${NV}`), f: (n) => Q((n % 2 ? -1 : 1) * n), js: (n) => `(-1)**${n}*${n}` }),
    shift: (c) => ({ h: frac(nb(`${NV} + ${c}`), nb(`${NV} + ${c + 1}`)), f: (n) => Q(n + c, n + c + 1), js: (n) => `(${n}+${c})/(${n}+${c + 1})` }),
    halfPow: (b) => ({ h: frac(1, b + sup(NV)), f: (n) => Q(1, b ** n), js: (n) => `1/${b}**${n}` }),
    cOver: (c) => ({ h: frac(c, NV), f: (n) => Q(c, n), js: (n) => `${c}/${n}` })
  };
  const sameSeq = (f, g, upto) => range(1, upto).every((n) => qcmp(f.f(n), g.f(n)) === 0);

  // ── 삼각함수 값(30°·45° 꼴): { h 글, k 견줄 값 } ──
  const R2 = frac(rt(2), 2), R3 = frac(rt(3), 2), HALF = frac(1, 2);
  const tv = (h, k) => ({ h, k });
  const neg = (v) => (v.k === '0' ? v : v.k[0] === '-' ? tv(v.raw, v.k.slice(1)) : Object.assign(tv(nb(MINUS + v.h), '-' + v.k), { raw: v.h }));
  const ONE = tv('1', '1'), ZERO = tv('0', '0'), H1 = tv(HALF, 'h'), H2 = tv(R2, 'r2'), H3 = tv(R3, 'r3');
  const FIRST = { 0: [ZERO, ONE], 30: [H1, H3], 45: [H2, H2], 60: [H3, H1] };
  function trigAt(name, deg) {
    const g = ((deg % 360) + 360) % 360, q = Math.floor(g / 90), r = g % 90;
    let [s, c] = FIRST[r];
    for (let i = 0; i < q; i += 1) [s, c] = [c, neg(s)];   // 90° 돌리면 (sin, cos) → (cos, −sin)
    return name === 'sin' ? s : c;
  }
  // 수 뒤 토씨(양수): josa2(5, '을/를') → 5를
  const josa2 = (n, pair) => n + tail(n, pair);
  const pq = (n) => (n < 0 ? '(' + iq(n) + ')' : String(n));                       // 곱하는 자리의 수: 음수는 괄호
  const dPick = (d) => d.pick([-9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9]);

  // ── 수열의 뜻 ──
  B.addTypes(UNIT, 'mean', [
    T('mean-words', '수열의 용어', '①1', (d, n) => {
      if (n === 0) {
        return choose(d, '다음 글의 ㉠, ㉡에 알맞은 말을 차례로 적은 것은?', [['수열, 항', true], ['항, 수열', false], ['수열, 일반항', false], ['일반항, 항', false]], {
          figure: lines([`차례로 나열된 수의 열을 ${box('㉠')}(이)라고 하며, 수열을 이루고 있는 각 수를 그 수열의 ${box('㉡')}(이)라고 한다.`]),
          explain: '차례로 나열된 수의 열이 수열이고, 수열을 이루는 각 수가 그 수열의 항이다.'
        });
      }
      return choose(d, '다음 글의 ㉠, ㉡에 알맞은 것을 차례로 적은 것은?', [[`일반항, ${SEQ}`, true], [`첫째항, ${SEQ}`, false], [`일반항, ${SN}`, false], [`공차, ${SEQ}`, false]], {
        figure: lines([`수열을 ${A(1)}, ${A(2)}, ${A(3)}, …, ${AN}, …과 같이 나타낼 때, 제${NV}항 ${jh(AN, '을/를')} 이 수열의 ${box('㉠')}(이)라고 하며, 일반항이 ${AN}인 수열을 기호로 ${box('㉡')}과 같이 나타낸다.`]),
        explain: `제${NV}항 ${jh(AN, '이/가')} 일반항이고, 일반항이 ${AN}인 수열을 ${SEQ}로 나타낸다. ${jh(SN, '은/는')} 첫째항부터 제${NV}항까지의 합을 나타내는 기호이다.`
      });
    }, { count: 2 }),
    T('mean-read', '나열된 수열에서 첫째항과 제k항', '①2', (d) => {
      const kind = d.int(0, 2), k = d.int(4, 7);
      let t;
      if (kind === 0) { const a = d.int(-9, 12), dd = nz(d, -7, 7); t = range(1, 8).map((i) => a + (i - 1) * dd); }
      else if (kind === 1) { const a = d.pick([1, 2, 3, -1, -2, -3]), r = d.pick([2, -2, 3]); t = range(1, 8).map((i) => a * r ** (i - 1)); }
      else { const c = d.pick([1, 2, 3]); t = range(1, 8).map((i) => (i % 2 ? 1 : -1) * c * (2 * i - 1)); }
      return namedQ(`수열 ${listH(t)}에서 첫째항과 제${k}항은?`, [['첫째항', t[0]], [`제${k}항`, t[k - 1]]], {
        explain: `왼쪽부터 첫째항, 둘째항, …이므로 첫째항은 ${iq(t[0])}, 제${k}항은 왼쪽에서 ${k}번째 수 ${iq(t[k - 1])}이다.`,
        facts: { calc: [[jn(t[0]), 0], [jn(t[k - 1]), 1]] }
      });
    }),
    T('mean-list', '일반항에 n을 넣어 항 구하기', '①3', (d, n) => {
      if (n === 1) {
        const kind = d.int(0, 1), c = d.int(1, 3), k = d.int(4, 9), F0 = kind === 0 ? formula.over(c) : formula.recip(c), v = F0.f(k);
        return fA(`수열 ${SEQ}의 일반항이 ${eq(AN, F0.h)}일 때, ${A(k)}의 값은?`, v, {
          explain: `일반항의 ${NV}에 ${josa2(k, '을/를')} 대입하면 ${eq(A(k), qq(v))}이다.`,
          facts: { value: F0.js(k) }
        });
      }
      let F0;
      if (n === 0) {
        const kind = d.int(0, 3);
        F0 = kind === 0 ? formula.lin(d.pick([-5, -4, -3, -2, 2, 3, 4, 5, 6]), nz(d, -9, 9)) : kind === 1 ? formula.sqp(nz(d, -5, 5)) : kind === 2 ? formula.pow(d.int(2, 4), d.int(1, 5)) : formula.con(nz(d, -9, 9));
      } else F0 = d.bool() ? formula.alt(d.pick([2, 3, 4]), d.int(-3, 3)) : formula.half(d.int(2, 5));
      const vals = [1, 2, 3, 4].map((i) => F0.f(i).p);
      return M(`수열 ${SEQ}의 일반항이 ${eq(AN, F0.h)}일 때, 첫째항부터 제4항까지 차례로 구하시오.`, vals.map((v, i) => ({ answer: v, signed: true, lead: A(i + 1) + ' =' })), {
        shown: vals.map((v, i) => eq(A(i + 1), iq(v))).join(', '),
        explain: `일반항의 ${NV}에 1, 2, 3, 4를 차례로 대입하면 ${vals.map(iq).join(', ')}이다.` + (vals.every((v) => v === vals[0]) ? ' 모든 항이 같아도 수열이다.' : ''),
        facts: { calc: vals.map((v, i) => [F0.js(i + 1), i]), derived: [2, 3, 4] }
      });
    }, { count: 3 }),
    T('mean-trig', '일반항이 삼각함수인 수열의 항', '①4', (d) => {
      const name = d.pick(['sin', 'cos']), den = d.pick([3, 4, 6]), other = name === 'sin' ? 'cos' : 'sin';
      const seq = (nm, from) => [0, 1, 2, 3].map((i) => trigAt(nm, (180 * (from + i)) / den));
      const show = (list) => list.map((v) => v.h).join(', '), key = (list) => list.map((v) => v.k).join(',');
      const right = seq(name, 1), rows = [[show(right), true]], seen = new Set([key(right)]);
      for (const c of d.shuffle([seq(name, 0), seq(other, 1), right.map(neg), seq(name, 2), seq(other, 0)])) {
        if (rows.length === 4) break;
        if (!seen.has(key(c))) { seen.add(key(c)); rows.push([show(c), false]); }
      }
      if (rows.length < 4) return null;
      const arg = (k) => { const g = gcd(k, den), u = k / g, w = den / g, top = (u === 1 ? '' : u) + 'π'; return trig(name, w === 1 ? ms(top) : frac(ms(top), w)); };
      return choose(d, `수열 ${SEQ}의 일반항이 ${eq(AN, trig(name, frac(ms('nπ'), den)))}일 때, 첫째항부터 제4항까지 차례로 나열한 것은?`, rows, {
        explain: `${NV}에 1, 2, 3, 4를 차례로 대입한 ${[1, 2, 3, 4].map(arg).join(', ')}의 값은 ${show(right)}이다.`
      });
    }),
    T('mean-parity', '홀짝으로 갈린 일반항의 항', '①4', (d) => {
      const p = d.int(2, 5), q = d.int(-4, 4), c = nz(d, -3, 3), evenLin = d.bool();
      const isLin = (k) => evenLin === (k % 2 === 0), f = (k) => (isLin(k) ? p * k + q : k * k + c), vals = [1, 2, 3, 4].map(f);
      const hL = lin(p, q, NV), hS = poly([[1, NN], [c, '']]);
      const js = (k) => (isLin(k) ? `${p}*${k}+${jn(q)}` : `${k}*${k}+${jn(c)}`);
      return M(`수열 ${SEQ}의 일반항이 ${AN} = ${cases(evenLin ? [[hL, `${NV}이 짝수`], [hS, `${NV}이 홀수`]] : [[hS, `${NV}이 짝수`], [hL, `${NV}이 홀수`]])}일 때, 첫째항부터 제4항까지 차례로 구하시오.`, vals.map((v, i) => ({ answer: v, signed: true, lead: A(i + 1) + ' =' })), {
        shown: vals.map((v, i) => eq(A(i + 1), iq(v))).join(', '),
        explain: `${NV}이 홀수인 1, 3에는 홀수일 때의 식을, 짝수인 2, 4에는 짝수일 때의 식을 쓴다. ${vals.map((v, i) => eq(A(i + 1), iq(v))).join(', ')}이다.`,
        facts: { calc: vals.map((v, i) => [js(i + 1), i]), derived: [2, 3, 4] }
      });
    }),
    T('mean-mod', '나머지로 정해지는 수열', '①5', (d, n) => {
      if (n === 0) {
        const m = d.int(3, 9), k = d.until(() => d.int(2, 9), (v) => gcd(v, m) === 1 && v % m !== 1), j = d.int(5, 8), v = k ** j % m;
        return nA(`수열 ${SEQ}의 일반항이 ${AN} = (${k}${sup(NV)}을 ${josa2(m, '으로/로')} 나눈 나머지)일 때, ${A(j)}의 값은?`, v, {
          explain: `${k}${sup(NV)}을 ${josa2(m, '으로/로')} 나눈 나머지는 ${range(1, 6).map((i) => k ** i % m).join(', ')}, …와 같이 되풀이되므로 ${eq(A(j), String(v))}이다.`,
          facts: { calc: [[`${k}**${j}%${m}`, 0]] }
        });
      }
      const k = d.pick([2, 3, 7, 8, 9]), vals = [1, 2, 3, 4].map((i) => k ** i % 10);
      return M(`수열 ${SEQ}의 제${NV}항이 ${k}${sup(NV)}을 10으로 나눈 나머지일 때, 첫째항부터 제4항까지 차례로 구하시오.`, vals.map((v, i) => ({ answer: v, lead: A(i + 1) + ' =' })), {
        shown: vals.map((v, i) => eq(A(i + 1), String(v))).join(', '),
        explain: `${k}, ${k}${sup(2)}, ${k}${sup(3)}, ${k}${sup(4)}은 ${[1, 2, 3, 4].map((i) => k ** i).join(', ')}이고, 10으로 나눈 나머지는 일의 자리의 숫자이므로 ${vals.join(', ')}이다.`,
        facts: { calc: vals.map((v, i) => [`${k}**${i + 1}%10`, i]), derived: [2, 3, 4] }
      });
    }, { count: 2 }),
    T('mean-which', '주어진 수가 제몇 항인가', '①6', (d, n) => {
      const MV = V('m');
      if (n === 0) {
        const p = d.int(0, 5), q = d.int(-5, 5), m = d.int(5, 14), v = m * m + p * m + q, h = poly([[1, NN], [p, NV], [q, '']]);
        return termA(`수열 ${SEQ}의 일반항이 ${eq(AN, h)}일 때, ${nj(v, '은/는')} 제몇 항인가?`, m, {
          explain: `제${MV}항이 ${nj(v, '이라/라')}고 하면 ${eq(poly([[1, MV + sup(2)], [p, MV], [q, '']]), iq(v))}이고, ${MV}은 자연수이므로 ${eq(MV, String(m))}이다. 따라서 제${m}항이다.`,
          facts: { range: { ineq: `x*x+${p}*x+${jn(q)}<${v + 1}`, lo: 1, hi: 400, want: 'max' } }
        });
      }
      const [p, q] = d.pick([[2, 1], [3, 1], [4, 1], [3, 2]]), m = d.int(3, 12), v = Q(p * m - q, m * m);
      if (range(1, 300).filter((x) => qcmp(Q(p * x - q, x * x), v) === 0).length !== 1) return null;
      return termA(`수열 ${SEQ}의 일반항이 ${eq(AN, frac(lin(p, -q, NV), NN))}일 때, ${qj(v, '은/는')} 제몇 항인가?`, m, {
        explain: `제${MV}항이 ${qq(v)}이라고 하면 ${eq(frac(lin(p, -q, MV), MV + sup(2)), qq(v))}이다. 정리한 이차방정식의 두 근 가운데 자연수는 ${eq(MV, String(m))}뿐이므로 제${m}항이다.`,
        facts: { range: { ineq: `(${p}*x-${q})*${v.q}<${v.p}*x*x+1`, lo: 1, hi: 300, want: 'min' } }
      });
    }, { count: 2 }),
    T('mean-log', '로그로 된 일반항에서 제몇 항', '①7', (d) => {
      const m = d.int(3, 20), prod = m * (m + 1);
      let s = 0, w = prod;
      while (w % 2 === 0) { w /= 2; s += 1; }
      if (w === 1) return null;
      const t = Math.round(Math.sqrt(w)), val = nb(`${s} + ${t * t === w ? '2' + lg(2, t) : lg(2, w)}`);
      return termA(`수열 ${SEQ}의 일반항이 ${eq(AN, nb(lg(2, NV) + ' + ' + lg(2, ms('(n+1)'))))}일 때, ${jh(val, '은/는')} 제몇 항인가?`, m, {
        explain: `${eq(AN, lg(2, ms('n(n+1)')))}이고 ${eq(val, lg(2, prod))}이므로 ${eq(ms('n(n+1)'), String(prod))}이다. ${eq(String(prod), `${m} × ${m + 1}`)}이므로 제${m}항이다.`,
        facts: { range: { ineq: `x*(x+1)<${prod + 1}`, lo: 1, hi: 200, want: 'max' } }
      });
    }),
    T('mean-guess', '나열된 수열의 일반항 고르기', '①8', (d, n) => {
      let truth, pool;
      if (n === 0) {
        const p = d.pick([2, 3, 4, 5, -2, -3]), q = d.int(-5, 5), c = nz(d, -3, 3), b = d.pick([2, 3]);
        const fams = [formula.lin(p, q), formula.sqc(c), formula.prod(d.int(1, 3)), formula.pow(b, nz(d, -3, 3))];
        truth = d.pick(fams);
        pool = [formula.lin(p, q + p), formula.lin(p, q - p), formula.lin(p + 1, q - 1), formula.lin(-p, q), formula.sqc(c + 1), formula.sqc(c - 1), formula.sqp(p), formula.prod(d.int(1, 3)), formula.pow(b, 1), formula.pow(b, -1), formula.lin(q === 0 ? 1 : q, p)].concat(fams);
      } else {
        const c = d.int(1, 3), k = d.pick([1, 2, 3]);
        const fams = [formula.over(c), formula.sgn(k, false), formula.sgn(k, true), formula.sgnN(), formula.halfPow(d.pick([2, 3])), formula.cOver(d.pick([1, 2, 3]))];
        truth = d.pick(fams);
        pool = [formula.over(c + 1), formula.shift(c), formula.sgn(k, false), formula.sgn(k, true), formula.sgn(k + 1, false), formula.sgnN(), formula.halfPow(2), formula.halfPow(3), formula.cOver(1), formula.cOver(2), formula.over(1)].concat(fams);
      }
      const bad = [];
      for (const g of d.shuffle(pool)) {
        if (bad.length === 3) break;
        if (sameSeq(g, truth, 6) || bad.some((b0) => sameSeq(b0, g, 6)) || stripH(g.h) === stripH(truth.h)) continue;
        bad.push(g);
      }
      if (bad.length < 3) return null;
      const shown = [1, 2, 3, 4, 5].map((i) => truth.f(i));
      return choose(d, `수열 ${listH(shown)}의 일반항 ${AN}으로 알맞은 것은?`, [[eq(AN, truth.h), true]].concat(bad.map((g) => [eq(AN, g.h), false])), {
        explain: `${eq(AN, truth.h)}의 ${NV}에 1, 2, 3, 4, 5를 대입하면 ${listH(shown, false)}이다. 다른 식은 앞의 다섯 항 가운데 맞지 않는 항이 있다.`
      });
    }, { count: 2 })
  ]);

  // ── 등차수열의 뜻과 일반항 ──
  B.addTypes(UNIT, 'ar', [
    T('ar-ad', '등차수열의 첫째항과 공차', '①10', (d) => {
      const a = nz(d, -20, 30), dd = dPick(d), t = range(1, 5).map((i) => ar(a, dd, i));
      return namedQ(`등차수열 ${listH(t)}의 첫째항과 공차는?`, [['첫째항', a], ['공차', dd]], {
        explain: `첫째항은 ${iq(a)}이고, 공차는 뒤의 항에서 앞의 항을 뺀 ${nb(`${iq(t[1])} − ${pq(t[0])} = ${iq(dd)}`)}이다.`,
        facts: { calc: [[jn(t[0]), 0], [`${jn(t[1])}-${jn(t[0])}`, 1]] }
      });
    }),
    T('ar-blank', '등차수열 나열의 빈칸', '①11', (d, n) => {
      const a = nz(d, -15, 25), dd = dPick(d), t = range(1, 5).map((i) => ar(a, dd, i)), hide = n === 0 ? [3, 4] : [2, 4];
      const fig = t.map((v, i) => (i === hide[0] ? box('㉠') : i === hide[1] ? box('㉡') : iq(v))).join(', ') + ', …';
      const calc = n === 0
        ? [[`${jn(t[2])}+(${jn(t[1])}-${jn(t[0])})`, 0], [`${jn(t[2])}+2*(${jn(t[1])}-${jn(t[0])})`, 1]]
        : [[`${jn(t[1])}+(${jn(t[3])}-${jn(t[1])})/2`, 0], [`${jn(t[3])}+(${jn(t[3])}-${jn(t[1])})/2`, 1]];
      return namedQ('다음 수열이 등차수열일 때, ㉠, ㉡에 알맞은 수는?', [['㉠', t[hide[0]]], ['㉡', t[hide[1]]]], {
        figure: lines([fig]),
        explain: n === 0 ? `공차가 ${nb(`${iq(t[1])} − ${pq(t[0])} = ${iq(dd)}`)}이므로 ㉠은 ${iq(t[3])}, ㉡은 ${iq(t[4])}이다.` : `${iq(t[1])}에 공차를 두 번 더하면 ${iq(t[3])}이므로 공차는 ${iq(dd)}이다. ㉠은 ${iq(t[2])}, ㉡은 ${iq(t[4])}이다.`,
        facts: { calc, derived: [2] }
      });
    }, { count: 2 }),
    T('ar-term', '첫째항과 공차로 일반항·제k항', '①12', (d, n) => {
      const a = nz(d, -20, 30), dd = dPick(d);
      if (a - dd === 0) return null;
      if (n === 2) {
        const k = d.int(6, 20), v = ar(a, dd, k);
        return iA(`첫째항이 ${iq(a)}, 공차가 ${iq(dd)}인 등차수열의 제${k}항은?`, v, {
          explain: `${eq(A(k), nb(`${iq(a)} + (${k} − 1) × ${pq(dd)}`))} = ${iq(v)}이다.`,
          facts: { calc: [[`${jn(a)}+(${k}-1)*${jn(dd)}`, 0]] }
        });
      }
      const text = n === 0 ? `첫째항이 ${iq(a)}, 공차가 ${iq(dd)}인 등차수열의 일반항 ${jh(AN, '은/는')}?` : `등차수열 ${listH(range(1, 4).map((i) => ar(a, dd, i)))}의 일반항 ${jh(AN, '은/는')}?`;
      return linT(text, dd, a - dd, {
        explain: (n === 1 ? `첫째항이 ${iq(a)}, 공차가 ${iq(dd)}이다. ` : '') + `${eq(AN, nb(`${iq(a)} + (${NV} − 1) × ${pq(dd)}`))} = ${lin(dd, a - dd, NV)}이다.`,
        facts: { calc: n === 0 ? [[jn(dd), 0], [`${jn(a)}-${jn(dd)}`, 1]] : [[`${jn(ar(a, dd, 2))}-${jn(a)}`, 0], [`2*${jn(a)}-${jn(ar(a, dd, 2))}`, 1]], derived: [2] }
      });
    }, { count: 3 }),
    T('ar-two', '두 항으로 일반항·제k항·몇째 항', '①13', (d, n) => {
      const a = nz(d, -15, 25), dd = dPick(d), p = d.int(1, 4), q = p + d.int(3, 7);
      if (a - dd === 0) return null;
      const ap = ar(a, dd, p), aq = ar(a, dd, q), given = `${eq(A(p), iq(ap))}, ${eq(A(q), iq(aq))}`, dJ = `(${jn(aq)}-${jn(ap)})/(${q}-${p})`;
      const solved = `첫째항을 ${V('a')}, 공차를 ${V('d')}라고 하면 ${eq(ms(p === 1 ? 'a' : p === 2 ? 'a + d' : `a + ${p - 1}d`), iq(ap))}, ${eq(ms(`a + ${q - 1}d`), iq(aq))}이다. 연립하여 풀면 ${eq(V('a'), iq(a))}, ${eq(V('d'), iq(dd))}이므로 ${eq(AN, lin(dd, a - dd, NV))}이다.`;
      if (n === 0) {
        return linT(`등차수열 ${SEQ}에서 ${given}일 때, 일반항 ${jh(AN, '은/는')}?`, dd, a - dd, {
          explain: solved,
          facts: { calc: [[dJ, 0], [`${jn(ap)}-${p}*${dJ}`, 1]] }
        });
      }
      if (n === 1) {
        const k = q + d.int(4, 15), v = ar(a, dd, k);
        return iA(`등차수열 ${SEQ}에서 ${given}일 때, 제${k}항은?`, v, {
          explain: `공차는 ${nb(`(${iq(aq)} − ${pq(ap)}) ÷ ${q - p}`)} = ${iq(dd)}이므로 ${eq(A(k), nb(`${A(q)} + ${k - q} × ${pq(dd)}`))} = ${iq(v)}이다.`,
          facts: { calc: [[`${jn(aq)}+(${k}-${q})*${dJ}`, 0]] }
        });
      }
      const m = q + d.int(6, 25), v = ar(a, dd, m);
      return termA(`등차수열 ${SEQ}에서 ${given}일 때, ${nj(v, '은/는')} 제몇 항인가?`, m, {
        explain: `${solved} ${eq(lin(dd, a - dd, NV), iq(v))}에서 ${eq(NV, String(m))}이므로 제${m}항이다.`,
        facts: { calc: [[`${p}+(${jn(v)}-${jn(ap)})*(${q}-${p})/(${jn(aq)}-${jn(ap)})`, 0]] }
      });
    }, { count: 3 }),
    T('ar-first', '처음으로 양수·음수·k보다 큰 수가 되는 항', '①14', (d, n) => {
      let a, dd, V0 = 0;
      if (n === 0 || n === 3) { dd = -d.int(2, n === 3 ? 6 : 9); a = n === 3 ? d.int(25, 70) : d.int(20, 120); }
      else if (n === 1) { dd = d.int(2, 9); a = -d.int(20, 120); }
      else { dd = d.int(2, 7); a = d.int(-10, 20); V0 = d.pick([100, 200, 300]); }
      if ((V0 - a) % dd === 0) return null;
      const test = n === 1 ? (x) => ar(a, dd, x) > 0 : n === 2 ? (x) => ar(a, dd, x) > V0 : (x) => ar(a, dd, x) < 0;
      const m = range(1, 300).find(test);
      if (!m || m < 5) return null;
      const ask = n === 1 ? '처음으로 양수가 되는 항은 제몇 항인가?' : n === 2 ? `처음으로 ${V0}보다 큰 수가 되는 항은 제몇 항인가?` : '처음으로 음수가 되는 항은 제몇 항인가?';
      const rel = n === 1 ? '&gt; 0' : n === 2 ? '&gt; ' + V0 : '&lt; 0';
      const facts = { range: { ineq: `${jn(a)}+(x-1)*${jn(dd)}${n === 1 ? '>0' : n === 2 ? '>' + V0 : '<0'}`, lo: 1, hi: 300, want: 'min' } };
      const tailT = `${nb(lin(dd, a - dd, NV) + ' ' + rel)}을 만족시키는 가장 작은 자연수 ${jh(NV, '은/는')} ${m}이므로 제${m}항이다.`;
      if (n === 3) {
        const q = d.int(4, 6), ap = ar(a, dd, 2), aq = ar(a, dd, q);
        return termA(`제2항이 ${iq(ap)}, 제${q}항이 ${iq(aq)}인 등차수열에서 ${ask}`, m, {
          explain: `첫째항을 ${V('a')}, 공차를 ${V('d')}라고 하면 ${eq(ms('a + d'), iq(ap))}, ${eq(ms(`a + ${q - 1}d`), iq(aq))}에서 ${eq(V('a'), iq(a))}, ${eq(V('d'), iq(dd))}이고 일반항은 ${eq(AN, lin(dd, a - dd, NV))}이다. ` + tailT,
          facts
        });
      }
      return termA(`첫째항이 ${iq(a)}, 공차가 ${iq(dd)}인 등차수열에서 ${ask}`, m, { explain: `일반항은 ${eq(AN, lin(dd, a - dd, NV))}이다. ` + tailT, facts });
    }, { count: 4 }),
    T('ar-mid', '등차중항으로 미지수', '①15', (d, n) => {
      const X = V('x'), va = V('a');
      if (n === 0) {
        const p = d.int(-20, 30), q = d.int(-20, 30);
        if ((p + q) % 2 !== 0 || p === q || p + q === 0) return null;
        const x = (p + q) / 2;
        return iA(`세 수 ${iq(p)}, ${X}, ${jh(iq(q), '이/가')} 이 순서대로 등차수열의 연속한 세 항일 때, 실수 ${X}의 값은?`, x, {
          explain: `${X}는 ${nj(p, '과/와')} ${iq(q)}의 등차중항이므로 ${eq(X, frac(nb(`${iq(p)} + ${pq(q)}`), 2))} = ${iq(x)}이다.`,
          facts: { calc: [[`(${jn(p)}+${jn(q)})/2`, 0]], derived: [2] }
        });
      }
      const x = nz(d, -6, 6), u1 = d.pick([0, 1]), u2 = d.int(1, 3), u3 = d.int(1, 4), den = 2 * u2 - u1 - u3;
      if (den === 0) return null;
      const v1 = d.int(-6, 6), v3 = d.int(-6, 6), twice = v1 + v3 + (u1 + u3 - 2 * u2) * x;
      if (twice % 2 !== 0) return null;
      const v2 = twice / 2, e = (u, v) => (u === 0 ? iq(v) : poly([[u, va], [v, '']]));
      const e1 = e(u1, v1), e2 = e(u2, v2), e3 = e(u3, v3);
      if (new Set([e1, e2, e3]).size < 3 || (u1 === 0 && v1 === 0)) return null;
      return iA(`세 수 ${e1}, ${e2}, ${jh(e3, '이/가')} 이 순서대로 등차수열의 연속한 세 항일 때, 실수 ${va}의 값은?`, x, {
        explain: `가운데 수는 앞뒤 두 수의 등차중항이므로 ${eq(nb(`2(${e2})`), nb(`(${e1}) + (${e3})`))}이다. 정리하면 ${eq(va, iq(x))}이다.`,
        facts: { calc: [[`(${jn(v1)}+${jn(v3)}-2*${jn(v2)})/(2*${u2}-${u1}-${u3})`, 0]], derived: [2, u1, u2, u3] }
      });
    }, { count: 2 }),
    T('ar-midmany', '넷·다섯 수가 등차수열일 때 미지수', '①16', (d, n) => {
      const a = d.int(-25, 25), dd = dPick(d), t = range(1, 5).map((i) => ar(a, dd, i));
      if (t.some((v) => v === 0)) return null;
      if (n === 0) {
        return valsQ(`네 수 ${V('a')}, ${iq(t[1])}, ${V('b')}, ${jh(iq(t[3]), '이/가')} 이 순서대로 등차수열의 연속한 네 항일 때, 실수 ${V('a')}, ${V('b')}의 값은?`, [[V('a'), t[0]], [V('b'), t[2]]], {
          explain: `${V('b')}는 ${nj(t[1], '과/와')} ${iq(t[3])}의 등차중항이므로 ${eq(V('b'), iq(t[2]))}이다. ${nj(t[1], '은/는')} ${V('a')}와 ${V('b')}의 등차중항이므로 ${eq(nb(`${V('a')} + ${V('b')}`), iq(2 * t[1]))}, ${eq(V('a'), iq(t[0]))}이다.`,
          facts: { calc: [[`2*${jn(t[1])}-(${jn(t[1])}+${jn(t[3])})/2`, 0], [`(${jn(t[1])}+${jn(t[3])})/2`, 1]], derived: [2] }
        });
      }
      return valsQ(`다섯 수 ${iq(t[0])}, ${V('x')}, ${V('y')}, ${V('z')}, ${jh(iq(t[4]), '이/가')} 이 순서대로 등차수열의 연속한 다섯 항일 때, ${V('x')}, ${V('y')}, ${V('z')}의 값은?`, [[V('x'), t[1]], [V('y'), t[2]], [V('z'), t[3]]], {
        explain: `공차를 ${V('d')}라고 하면 ${eq(nb(`${iq(t[0])} + 4${V('d')}`), iq(t[4]))}에서 ${eq(V('d'), iq(dd))}이다. 따라서 ${eq(V('x'), iq(t[1]))}, ${eq(V('y'), iq(t[2]))}, ${eq(V('z'), iq(t[3]))}이다.`,
        facts: { calc: [1, 2, 3].map((i) => [`${jn(t[0])}+${i}*(${jn(t[4])}-${jn(t[0])})/4`, i - 1]), derived: [2, 3, 4] }
      });
    }, { count: 2 }),
    T('ar-rel', '항 사이의 관계식으로 공차와 항', '①18', (d, n) => {
      const DV = V('d');
      if (n === 0) {
        const a = nz(d, -15, 25), dd = dPick(d), p = d.int(1, 3), q = p + d.int(1, 2), r = q + d.int(1, 3), ap = ar(a, dd, p), S = ar(a, dd, q) + ar(a, dd, r);
        return iA(`등차수열 ${SEQ}에서 ${eq(A(p), iq(ap))}, ${eq(nb(`${A(q)} + ${A(r)}`), iq(S))}일 때, 수열 ${SEQ}의 공차는?`, dd, {
          explain: `공차를 ${DV}라고 하면 ${eq(nb(`${A(q)} + ${A(r)}`), nb(`2${A(p)} + ${q - p + r - p}${DV}`))}이므로 ${eq(nb(`${iq(2 * ap)} + ${q - p + r - p}${DV}`), iq(S))}, ${eq(DV, iq(dd))}이다.`,
          facts: { calc: [[`(${jn(S)}-2*${jn(ap)})/(${q}+${r}-2*${p})`, 0]], derived: [2] }
        });
      }
      if (n === 1) {
        const a = nz(d, -20, 30), k = d.pick([2, 3]), p = d.int(6, 20), q = d.int(2, 5), D = k * (p - 1) - (q - 1);
        if (D === 0) return null;
        const dq = Q(a * (1 - k), D);
        if (isInt(dq) && Math.abs(dq.p) < 2) return null;
        const ts = range(10, 40).filter((x) => isInt(qmul(Q(x - 1), dq)) && x !== p && x !== q);
        if (!ts.length) return null;
        const t = d.pick(ts), v = a + qmul(Q(t - 1), dq).p;
        return iA(`등차수열 ${SEQ}에서 ${eq(A(1), iq(a))}, ${eq(nb(k + A(p)), A(q))}일 때, ${A(t)}의 값은?`, v, {
          explain: `공차를 ${DV}라고 하면 ${eq(nb(`${k}(${iq(a)} + ${p - 1}${DV})`), nb(`${iq(a)} + ${q - 1}${DV}`))}에서 ${eq(DV, qq(dq))}이다. 따라서 ${eq(A(t), nb(`${iq(a)} + ${t - 1} × ${dq.p < 0 ? '(' + qq(dq) + ')' : qq(dq)}`))} = ${iq(v)}이다.`,
          facts: { calc: [[`${jn(a)}+(${t}-1)*${jn(a)}*(1-${k})/(${k}*(${p}-1)-(${q}-1))`, 0]] }
        });
      }
      if (n === 2) {
        const a = nz(d, -15, 25), dd = dPick(d), q = d.int(3, 8), s1 = ar(a, dd, q) + ar(a, dd, q + 1), s2 = ar(a, dd, q + 1) + ar(a, dd, q + 2), v = ar(a, dd, q + 1);
        return iA(`등차수열 ${jh(SEQ, '이/가')} ${eq(nb(`${A(q)} + ${A(q + 1)}`), iq(s1))}, ${nb(`${A(q + 1)} + ${A(q + 2)} = ${nj(s2, '을/를')}`)} 만족시킬 때, ${A(q + 1)}의 값은?`, v, {
          explain: `${eq(nb(`${A(q)} + ${A(q + 2)}`), nb(`2${A(q + 1)}`))}이므로 두 식을 더하면 ${eq(nb(`4${A(q + 1)}`), iq(s1 + s2))}, ${eq(A(q + 1), iq(v))}이다.`,
          facts: { calc: [[`(${jn(s1)}+${jn(s2)})/4`, 0]], derived: [4] }
        });
      }
      if (n === 3) {
        const k = d.pick([2, 4, 5, 6]), a = nz(d, -12, 12), num = a * (k - 3), den = 9 - 2 * k;
        if (num % den !== 0 || num / den === 0 || Math.abs(num / den) > 12) return null;
        const dd = num / den;
        return iA(`첫째항이 ${iq(a)}인 등차수열 ${SEQ}에서 ${eq(nb(`${A(2)} + ${A(4)} + ${A(6)}`), nb(k + A(3)))}일 때, 수열 ${SEQ}의 공차는?`, dd, {
          explain: `공차를 ${DV}라고 하면 ${eq(nb(`(${iq(a)} + ${DV}) + (${iq(a)} + 3${DV}) + (${iq(a)} + 5${DV})`), nb(`${k}(${iq(a)} + 2${DV})`))}이다. 정리하면 ${eq(poly([[9 - 2 * k, DV]]), iq(a * (k - 3)))}이므로 공차는 ${iq(dd)}이다.`,
          facts: { calc: [[`${jn(a)}*(${k}-3)/(9-2*${k})`, 0]], derived: [3, 9, 2] }
        });
      }
      const a = d.int(1, 9), dd = d.int(1, 5), p = d.int(2, 4), s = p + d.int(2, 4), t = s + d.int(2, 5), P = ar(a, dd, p), as = ar(a, dd, s), at = ar(a, dd, t), g = gcd(as, at), u = as / g, w = at / g, S = arS(a, dd, t);
      const dE = `(${u}-${w})*${P}/(${w}*(${s}-${p})-${u}*(${t}-${p}))`;
      return iA(`등차수열 ${SEQ}에서 ${eq(A(p), String(P))}이고 ${nb(`${A(s)} : ${A(t)} = ${u} : ${w}`)}일 때, 수열 ${SEQ}의 첫째항부터 제${t}항까지의 합은?`, S, {
        explain: `공차를 ${DV}라고 하면 ${eq(A(s), nb(`${P} + ${s - p}${DV}`))}, ${eq(A(t), nb(`${P} + ${t - p}${DV}`))}이고 ${eq(nb(`${w}${A(s)}`), nb(`${u}${A(t)}`))}에서 ${eq(DV, String(dd))}, 첫째항은 ${a}이다. 따라서 합은 ${frac(nb(`${t}(2 × ${a} + ${t - 1} × ${dd})`), 2)} = ${S}이다.`,
        facts: { calc: [[`${t}*(2*(${P}-(${p}-1)*${dE})+(${t}-1)*${dE})/2`, 0]], derived: [2] }
      });
    }, { count: 5 }),
    T('ar-roots', '이차방정식의 두 근이 항일 때 가운데 항', '①20', (d) => {
      const p = d.int(3, 8), q = p + 2 * d.int(1, 2), u = d.int(2, 9), w = d.int(2, 9);
      if (u === w || (u + w) % 2 !== 0) return null;
      const X = V('x'), eqH = nb(`${poly([[u * w, X + sup(2)], [-(u + w), X], [1, '']])} = 0`), mid = (p + q) / 2;
      return iA(`등차수열 ${SEQ}에 대하여 ${frac(1, A(p))}과 ${jh(frac(1, A(q)), '이/가')} 이차방정식 ${eqH}의 두 근일 때, ${A(mid)}의 값은?`, (u + w) / 2, {
        explain: `${eqH}에서 ${nb(`(${u}${X} − 1)(${w}${X} − 1) = 0`)}이므로 두 근은 ${frac(1, u)}, ${frac(1, w)}이다. 따라서 ${A(p)}, ${jh(A(q), '은/는')} ${u}, ${w} 가운데 하나씩이고, ${jh(A(mid), '은/는')} 두 수의 등차중항이므로 ${frac(nb(`${u} + ${w}`), 2)} = ${(u + w) / 2}이다.`,
        facts: { calc: [[`${u + w}/2`, 0]], derived: [2] }
      });
    }),
    T('ar-remainder', '나머지정리의 나머지가 등차수열', '①22', (d) => {
      const X = V('x'), P = V('P'), K = V('k'), p = d.int(1, 3), c = nz(d, -6, 6), [r1, r2, r3] = d.shuffle([-2, -1, 1, 2, 3]).slice(0, 3), den = 2 * r2 - r1 - r3;
      if (den === 0) return null;
      const num = p * (r1 * r1 + r3 * r3 - 2 * r2 * r2);
      if (num % den !== 0 || num / den === 0) return null;
      const k = num / den, dv = (r) => poly([[1, X], [-r, '']]);
      const Px = nb(`${poly([[p, X + sup(2)]])} + ${K}${X}${c < 0 ? ' ' + MINUS + ' ' + -c : ' + ' + c}`);
      return iA(`다항식 ${jh(eq(nb(`${P}(${X})`), Px), '을/를')} ${dv(r1)}, ${dv(r2)}, ${jh(dv(r3), '으로/로')} 나누었을 때의 나머지가 이 순서대로 등차수열의 연속한 세 항일 때, 상수 ${K}의 값은?`, k, {
        explain: `나머지정리에 의하여 세 나머지는 ${P}(${iq(r1)}), ${P}(${iq(r2)}), ${P}(${iq(r3)})이다. 가운데가 등차중항이므로 ${eq(nb(`2${P}(${iq(r2)})`), nb(`${P}(${iq(r1)}) + ${P}(${iq(r3)})`))}이고, 이를 정리하면 ${eq(K, iq(k))}이다.`,
        facts: { calc: [[`${p}*(${jn(r1)}*${jn(r1)}+${jn(r3)}*${jn(r3)}-2*${jn(r2)}*${jn(r2)})/(2*${jn(r2)}-${jn(r1)}-${jn(r3)})`, 0]], derived: [2] }
      });
    }),
    T('ar-pyth', '세 변이 등차수열인 직각삼각형', '①23', (d) => {
      const t = d.int(2, 9), hyp = 5 * t, area = 6 * t * t, DV = V('d');
      return nA(`빗변의 길이가 ${hyp}인 직각삼각형의 세 변의 길이가 등차수열을 이룰 때, 이 직각삼각형의 넓이는?`, area, {
        explain: `세 변의 길이를 ${nb(`${hyp} − 2${DV}`)}, ${nb(`${hyp} − ${DV}`)}, ${hyp}(${nb(`${DV} &gt; 0`)})라고 하면 ${eq(nb(`(${hyp} − 2${DV})${sup(2)} + (${hyp} − ${DV})${sup(2)}`), hyp + sup(2))}에서 ${eq(DV, String(t))}이다(${eq(DV, String(5 * t))}이면 변의 길이가 0 이하). 세 변은 ${3 * t}, ${4 * t}, ${hyp}이므로 넓이는 ${frac(1, 2)} × ${3 * t} × ${4 * t} = ${area}이다.`,
        facts: { calc: [[`(${hyp}/5*3)*(${hyp}/5*4)/2`, 0]], derived: [5, 3, 4, 2] }
      });
    })
  ]);

  // ── 등차수열의 합 ──
  const sumOfMult = (lo, hi, k) => { const a = Math.ceil(lo / k), b = Math.floor(hi / k); return b < a ? 0 : (k * (a + b) * (b - a + 1)) / 2; };
  const sumJs = (k) => `${k}*((99-99%${k})/${k}*((99-99%${k})/${k}+1)-(9-9%${k})/${k}*((9-9%${k})/${k}+1))/2`;   // 두 자리 수 가운데 k의 배수의 합
  const sumH = (m, a, dd) => frac(nb(`${m}{2 × ${pq(a)} + ${m - 1} × ${pq(dd)}}`), 2);
  B.addTypes(UNIT, 'arsum', [
    T('arsum-basic', '첫째항·공차·끝항으로 등차수열의 합', '①26', (d, n) => {
      const a = nz(d, -15, 20), dd = dPick(d), m = d.int(7, 20), S = arS(a, dd, m);
      if (Math.abs(S) > 9999 || S === 0) return null;
      if (n === 0) {
        const l = ar(a, dd, m);
        return iA(`첫째항이 ${iq(a)}, 제${m}항이 ${iq(l)}인 등차수열의 첫째항부터 제${m}항까지의 합은?`, S, {
          explain: `첫째항과 끝항을 아는 등차수열의 합은 ${eq(SS(m), frac(nb(`${m}{${iq(a)} + ${pq(l)}}`), 2))} = ${iq(S)}이다.`,
          facts: { calc: [[`${m}*(${jn(a)}+${jn(l)})/2`, 0]], derived: [2] }
        });
      }
      if (n === 1) {
        return iA(`첫째항이 ${iq(a)}, 공차가 ${iq(dd)}인 등차수열의 첫째항부터 제${m}항까지의 합은?`, S, {
          explain: `${eq(SS(m), sumH(m, a, dd))} = ${iq(S)}이다.`,
          facts: { calc: [[`${m}*(2*${jn(a)}+(${m}-1)*${jn(dd)})/2`, 0]], derived: [2] }
        });
      }
      const t = range(1, 4).map((i) => ar(a, dd, i));
      return iA(`등차수열 ${listH(t)}의 첫째항부터 제${m}항까지의 합은?`, S, {
        explain: `첫째항이 ${iq(a)}, 공차가 ${iq(dd)}이므로 ${eq(SS(m), sumH(m, a, dd))} = ${iq(S)}이다.`,
        facts: { calc: [[`${m}*(2*${jn(t[0])}+(${m}-1)*(${jn(t[1])}-${jn(t[0])}))/2`, 0]], derived: [2] }
      });
    }, { count: 3 }),
    T('arsum-formula', '등차수열의 합 Sₙ을 n의 식으로', '①26', (d) => {
      const a = d.int(-5, 8), dd = d.pick([1, 2, 3, -1, -2, 4]);
      if (2 * a - dd === 0) return null;
      const h = (x, y) => poly([[x, NN], [y, NV]]), right = h(Q(dd, 2), Q(2 * a - dd, 2));
      const wrongs = [h(Q(dd, 2), Q(2 * a + dd, 2)), h(Q(dd), Q(a - dd)), h(Q(dd, 2), Q(a)), h(Q(dd, 2), Q(2 * a - 3 * dd, 2)), h(Q(dd), Q(2 * a - dd))];
      const rows = [[eq(SN, right), true]].concat(d.shuffle(wrongs).filter((w) => stripH(w) !== stripH(right)).slice(0, 3).map((w) => [eq(SN, w), false]));
      const t = range(1, 4).map((i) => ar(a, dd, i));
      return choose(d, `등차수열 ${listH(t)}의 첫째항부터 제${NV}항까지의 합 ${jh(SN, '은/는')}?`, rows, {
        explain: `첫째항이 ${iq(a)}, 공차가 ${iq(dd)}이므로 ${eq(SN, frac(nb(`${NV}{2 × ${pq(a)} + (${NV} − 1) × ${pq(dd)}}`), 2))} = ${right}이다.`
      });
    }),
    T('arsum-mult', '조건에 맞는 자연수의 합', '①27', (d, n) => {
      const k = d.int(3, 9);
      if (n === 0) {
        const L = d.pick([50, 100, 150]), v = sumOfMult(1, L, k), cnt = Math.floor(L / k);
        if (v > 9999) return null;
        return nA(`${L} 이하의 자연수 가운데 ${k}의 배수의 합은?`, v, {
          explain: `${k}의 배수를 작은 것부터 나열하면 ${k}, ${2 * k}, …, ${cnt * k}이고, 첫째항이 ${k}, 공차가 ${k}인 등차수열의 첫째항부터 제${cnt}항까지이다. 합은 ${frac(nb(`${cnt}(${k} + ${cnt * k})`), 2)} = ${v}이다.`,
          facts: { calc: [[`${k}*((${L}-${L}%${k})/${k})*((${L}-${L}%${k})/${k}+1)/2`, 0]], derived: [2] }
        });
      }
      if (n === 1) {
        const L = 100, r = d.int(1, k - 1), last = Math.floor((L - r) / k) * k + r, cnt = (last - r) / k + 1, v = (cnt * (r + last)) / 2;
        return nA(`${L} 이하의 자연수 가운데 ${josa2(k, '으로/로')} 나눈 나머지가 ${r}인 수의 합은?`, v, {
          explain: `조건에 맞는 수는 ${r}, ${r + k}, …, ${last}이고, 첫째항이 ${r}, 공차가 ${k}인 등차수열의 첫째항부터 제${cnt}항까지이다. 합은 ${frac(nb(`${cnt}(${r} + ${last})`), 2)} = ${v}이다.`,
          facts: { calc: [[`((${L}-${r}-(${L}-${r})%${k})/${k}+1)*(2*${r}+(${L}-${r}-(${L}-${r})%${k}))/2`, 0]], derived: [2] }
        });
      }
      const lo = d.pick([50, 100, 120]), hi = lo + d.pick([100, 150, 200]), v = sumOfMult(lo, hi, k), first = Math.ceil(lo / k) * k, last = Math.floor(hi / k) * k, cnt = (last - first) / k + 1;
      if (v > 9999 || lo % k === 0) return null;
      return nA(`${lo} 이상 ${hi} 이하의 자연수 가운데 ${k}의 배수의 합은?`, v, {
        explain: `조건에 맞는 가장 작은 수는 ${first}, 가장 큰 수는 ${last}이고 모두 ${cnt}개이다. 합은 ${frac(nb(`${cnt}(${first} + ${last})`), 2)} = ${v}이다.`,
        facts: { calc: [[`((${hi}-${hi}%${k})/${k}-(${lo}-${lo}%${k})/${k})*((${hi}-${hi}%${k})+(${lo}-${lo}%${k}+${k}))/2`, 0]], derived: [2] }
      });
    }, { count: 3 }),
    T('arsum-notmult', '한 배수의 합에서 다른 배수의 합을 빼기', '①28', (d) => {
      const k = d.int(2, 5), km = k * d.int(2, 4), s1 = sumOfMult(10, 99, k), s2 = sumOfMult(10, 99, km), v = s1 - s2;
      if (v > 9999) return null;
      return nA(`두 자리의 자연수 가운데 ${k}의 배수이지만 ${km}의 배수가 아닌 수의 합은?`, v, {
        explain: `두 자리의 자연수 가운데 ${k}의 배수의 합은 ${s1}, ${km}의 배수의 합은 ${s2}이다. ${km}의 배수는 모두 ${k}의 배수이므로 구하는 합은 ${nb(`${s1} − ${s2}`)} = ${v}이다.`,
        facts: { calc: [[`${sumJs(k)}-${sumJs(km)}`, 0]], derived: [99, 9, 2] }
      });
    }),
    T('arsum-two', '두 항(한 항과 공차)으로 등차수열의 합', '①29', (d, n) => {
      if (n === 0) {
        const a = nz(d, -15, 20), dd = dPick(d), p = d.int(2, 4), q = p + d.int(3, 8), m = d.int(8, 20), S = arS(a, dd, m), ap = ar(a, dd, p), aq = ar(a, dd, q);
        if (Math.abs(S) > 9999 || S === 0) return null;
        const dJ = `(${jn(aq)}-${jn(ap)})/(${q}-${p})`;
        return iA(`${eq(A(p), iq(ap))}, ${eq(A(q), iq(aq))}인 등차수열 ${SEQ}의 첫째항부터 제${m}항까지의 합은?`, S, {
          explain: `공차는 ${iq(dd)}, 첫째항은 ${iq(a)}이므로 ${eq(SS(m), sumH(m, a, dd))} = ${iq(S)}이다.`,
          facts: { calc: [[`${m}*(2*(${jn(ap)}-(${p}-1)*${dJ})+(${m}-1)*${dJ})/2`, 0]], derived: [2] }
        });
      }
      const k = d.int(3, 7), ak = nz(d, -40, 120), dd = dPick(d), m = 2 * k - 1, S = m * ak;
      if (Math.abs(S) > 9999) return null;
      return iA(`제${k}항이 ${iq(ak)}이고 공차가 ${iq(dd)}인 등차수열의 첫째항부터 제${m}항까지의 합은?`, S, {
        explain: `첫째항부터 제${m}항까지에서 제${k}항이 가운데 항이다. 가운데 항을 중심으로 대칭인 두 항의 합이 늘 ${iq(2 * ak)}이므로 합은 ${m} × ${pq(ak)} = ${iq(S)}이다.`,
        facts: { calc: [[`${m}*${jn(ak)}`, 0]] }
      });
    }, { count: 2 }),
    T('arsum-ss', '두 합으로 첫째항·공차, 다른 항·합', '①30', (d, n) => {
      const a = nz(d, -12, 20), dd = dPick(d), AV = V('a'), DV = V('d');
      if (n === 1) {
        const k = d.pick([3, 4, 5, 10]), S1 = arS(a, dd, k), S2 = arS(a, dd, 2 * k), S3 = arS(a, dd, 3 * k);
        if (Math.abs(S3) > 9999) return null;
        return iA(`첫째항부터 제${k}항까지의 합이 ${iq(S1)}, 첫째항부터 제${2 * k}항까지의 합이 ${iq(S2)}인 등차수열의 첫째항부터 제${3 * k}항까지의 합은?`, S3, {
          explain: `두 합의 식을 연립하여 풀면 첫째항은 ${iq(a)}, 공차는 ${iq(dd)}이다. 따라서 ${eq(SS(3 * k), sumH(3 * k, a, dd))} = ${iq(S3)}이다.`,
          facts: { calc: [[`3*${jn(S2)}-3*${jn(S1)}`, 0]], derived: [3] }
        });
      }
      const [p, q] = n === 0 ? d.pick([[5, 10], [6, 12], [8, 16], [4, 9], [3, 7]]) : d.pick([[3, 7], [4, 8], [5, 9], [3, 8]]), Sp = arS(a, dd, p), Sq = arS(a, dd, q);
      const U = `2*${jn(Sp)}/${p}`, W = `2*${jn(Sq)}/${q}`, dE = `(${W}-${U})/(${q}-${p})`, aE = `(${U}-(${p}-1)*${dE})/2`;
      const given = `첫째항부터 제${p}항까지의 합이 ${iq(Sp)}, 첫째항부터 제${q}항까지의 합이 ${iq(Sq)}인 등차수열`;
      const solved = `첫째항을 ${AV}, 공차를 ${DV}라고 하면 ${eq(frac(nb(`${p}(2${AV} + ${p - 1}${DV})`), 2), iq(Sp))}, ${eq(frac(nb(`${q}(2${AV} + ${q - 1}${DV})`), 2), iq(Sq))}이다. 연립하여 풀면 ${eq(AV, iq(a))}, ${eq(DV, iq(dd))}이다.`;
      if (n === 0) return namedQ(`${given}의 첫째항과 공차는?`, [['첫째항', a], ['공차', dd]], { explain: solved, facts: { calc: [[aE, 0], [dE, 1]], derived: [2] } });
      const k = d.int(6, 12), v = ar(a, dd, k);
      return iA(`${given} ${SEQ}에서 ${A(k)}의 값은?`, v, {
        explain: `${solved} 따라서 ${eq(A(k), nb(`${iq(a)} + ${k - 1} × ${pq(dd)}`))} = ${iq(v)}이다.`,
        facts: { calc: [[`${aE}+(${k}-1)*${dE}`, 0]], derived: [2] }
      });
    }, { count: 3 }),
    T('arsum-group', '연속한 k개의 항씩 묶은 합의 수열', '①31', (d) => {
      const k = d.int(2, 5), b1 = range(1, k).map(A).join(' + '), b2 = range(k + 1, 2 * k).map(A).join(' + '), B1 = ms('b_1'), B2 = ms('b_2');
      return nA(`공차가 ${V('d')}인 등차수열 ${SEQ}에서 연속한 ${k}개의 항씩 묶어 더한 수열 ${eq(B1, b1)}, ${eq(B2, b2)}, …은 등차수열이다. 수열 ${nb('{' + ms('b_n') + '}')}의 공차는 ${V('d')}의 몇 배인가?`, k * k, {
        unit: '배',
        explain: `${B2}의 각 항은 ${B1}의 같은 자리의 항보다 ${k}${V('d')}씩 크고 항이 ${k}개이므로 ${eq(nb(`${B2} − ${B1}`), nb(`${k} × ${k}${V('d')}`))} = ${k * k}${V('d')}이다. 따라서 ${k * k}배이다.`,
        facts: { calc: [[`${k}*${k}`, 0]] }
      });
    }),
    T('arsum-findm', '합이 주어진 값이 되는 항의 수', '①32', (d) => {
      const a = nz(d, -8, 10), dd = d.int(2, 5), p = d.int(2, 3), q = p + 2, m = d.int(9, 20), V0 = arS(a, dd, m), MV = V('m');
      if (V0 <= 0 || V0 > 9999 || a > V0) return null;
      if (range(1, 400).filter((x) => arS(a, dd, x) === V0).length !== 1) return null;
      return nA(`제${p}항이 ${iq(ar(a, dd, p))}, 제${q}항이 ${iq(ar(a, dd, q))}인 등차수열의 첫째항부터 제${MV}항까지의 합이 ${V0}일 때, 자연수 ${MV}의 값은?`, m, {
        explain: `공차는 ${dd}, 첫째항은 ${iq(a)}이다. ${eq(frac(nb(`${MV}{2 × ${pq(a)} + (${MV} − 1) × ${dd}}`), 2), nj(V0, '을/를'))} 정리한 이차방정식의 자연수인 근은 ${eq(MV, String(m))}이다.`,
        facts: { range: { ineq: `x*(2*${jn(a)}+(x-1)*${dd})<${2 * V0 + 1}`, lo: 1, hi: 400, want: 'max' } }
      });
    }),
    T('arsum-endsum', '첫째항·끝항·합으로 공차', '①33', (d) => {
      const a = d.int(20, 80), dd = -d.int(1, 6), m = d.int(8, 40), l = ar(a, dd, m), S = arS(a, dd, m), MV = V('m');
      if (a + l === 0 || S <= 0 || S > 9999 || l >= 0) return null;
      return iA(`첫째항이 ${a}, 제${MV}항이 ${iq(l)}인 등차수열의 첫째항부터 제${MV}항까지의 합이 ${S}일 때, 이 등차수열의 공차는?`, dd, {
        explain: `${eq(frac(nb(`${MV}{${a} + (${iq(l)})}`), 2), String(S))}에서 ${eq(MV, String(m))}이다. 제${m}항이 ${iq(l)}이므로 ${eq(nb(`${a} + ${m - 1}${V('d')}`), iq(l))}, 공차는 ${iq(dd)}이다.`,
        facts: { calc: [[`(${jn(l)}-${a})/(2*${S}/(${a}+${jn(l)})-1)`, 0]], derived: [2] }
      });
    }),
    T('arsum-zero', '합이 0이 되는 항 수로 다른 항', '①34', (d) => {
      const dd = -d.int(1, 6), a = d.int(4, 30), m = 1 - (2 * a) / dd, K = V('k');
      if (!Number.isInteger(m) || m < 5 || m > 40) return null;
      const v = ar(a, dd, 2 * m);
      return iA(`첫째항이 ${a}, 공차가 ${iq(dd)}인 등차수열 ${SEQ}에서 첫째항부터 제${K}항까지의 합이 0일 때, ${A('2k')}의 값은?`, v, {
        explain: `${eq(frac(nb(`${K}{2 × ${a} + (${K} − 1) × (${iq(dd)})}`), 2), '0')}에서 ${K}는 자연수이므로 ${eq(K, String(m))}이다. 따라서 ${eq(A(2 * m), nb(`${a} + ${2 * m - 1} × (${iq(dd)})`))} = ${iq(v)}이다.`,
        facts: { calc: [[`${a}+(2*(1-2*${a}/${jn(dd)})-1)*${jn(dd)}`, 0]], derived: [2] }
      });
    }),
    T('arsum-max', '등차수열의 합의 최댓값', '①35', (d, n) => {
      if (n === 0) {
        const dd = -d.int(2, 4), a = d.int(25, 70);
        if (a % dd === 0) return null;
        const last = range(1, 200).filter((x) => ar(a, dd, x) > 0).pop(), S = arS(a, dd, last), t = range(1, 4).map((i) => ar(a, dd, i));
        if (S > 9999) return null;
        return iA(`등차수열 ${listH(t)}의 첫째항부터 제${NV}항까지의 합 ${SN}의 최댓값은?`, S, {
          explain: `일반항은 ${eq(AN, lin(dd, a - dd, NV))}이고 제${last}항까지 양수, 제${last + 1}항부터 음수이다. 양수인 항을 모두 더할 때 합이 가장 크므로 최댓값은 ${eq(SS(last), String(S))}이다.`,
          facts: { calc: [[`${last}*(2*${t[0]}+(${last}-1)*(${jn(t[1])}-${t[0]}))/2`, 0]], unseen: [last], derived: [2] }
        });
      }
      const p = d.int(2, 5), q = d.int(20, 50);
      if (q % p === 0) return null;
      const a = q - p, dd = -p, last = range(1, 200).filter((x) => ar(a, dd, x) > 0).pop(), S = arS(a, dd, last);
      if (S > 9999) return null;
      return iA(`일반항이 ${eq(AN, lin(-p, q, NV))}인 수열 ${SEQ}의 첫째항부터 제${NV}항까지의 합 ${SN}의 최댓값은?`, S, {
        explain: `${nb(`${lin(-p, q, NV)} &gt; 0`)}에서 ${nb(`${NV} &lt; ${frac(q, p)}`)}이므로 제${last}항까지 양수이다. 첫째항이 ${a}, 공차가 ${iq(dd)}이므로 최댓값은 ${eq(SS(last), frac(nb(`${last}(${a} + ${ar(a, dd, last)})`), 2))} = ${S}이다.`,
        facts: { calc: [[`${last}*((${q}-${p})+(${q}-${p}*${last}))/2`, 0]], unseen: [last], derived: [2] }
      });
    }, { count: 2 }),
    T('arsum-seats', '생활 속 등차수열의 합', '①37', (d) => {
      const f1 = d.int(3, 8), f2 = f1 + d.int(1, 3), t = d.int(2, 4), R = d.int(10, 16), s1 = arS(f1, t, R), s2 = arS(f2, t, R), total = 2 * s1 + s2;
      if (total > 9999) return null;
      return nA(`어느 공연장의 관람석은 가, 나, 다의 세 구역으로 나뉘어 있다. 가 구역과 다 구역의 관람석은 모두 첫 번째 줄이 ${f1}석이고 그다음 줄부터 ${t}석씩 늘어나 ${R}번째 줄까지 있다. 나 구역의 관람석은 첫 번째 줄이 ${f2}석이고 그다음 줄부터 ${t}석씩 늘어나 ${R}번째 줄까지 있다. 이 공연장의 관람석은 모두 몇 석인가?`, total, {
        unit: '석',
        explain: `가 구역의 관람석은 ${frac(nb(`${R}{2 × ${f1} + ${R - 1} × ${t}}`), 2)} = ${s1}석이고 다 구역도 같다. 나 구역은 ${frac(nb(`${R}{2 × ${f2} + ${R - 1} × ${t}}`), 2)} = ${s2}석이다. 모두 ${nb(`${s1} × 2 + ${s2}`)} = ${total}석이다.`,
        facts: { calc: [[`2*${R}*(2*${f1}+(${R}-1)*${t})/2+${R}*(2*${f2}+(${R}-1)*${t})/2`, 0]], derived: [2] }
      });
    })
  ]);

  Object.assign(B.kit.u1115, { formula, josa2, pq, dPick, sumH, NN });
})(typeof window !== 'undefined' ? window : globalThis);
