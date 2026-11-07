// 고등학교 대수 Ⅰ-1 지수와 로그(11-1-1) — 단원 틀·단원 안의 도구와 앞쪽 묶음
// (거듭제곱근의 뜻, 거듭제곱근의 성질, 정수인 지수, 유리수·실수인 지수, 지수 조건식과 활용).
// 수집해 둔 천재 T셀파 대수(전인태, 2022 개정)의 교과서·평가 자료에서 뽑은 문제 꼴 목록
// (기본꼴_1: 거듭제곱근·지수 41꼴, 기본꼴_2: 로그·상용로그 37꼴, 심화꼴: 3꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음 / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/11-1-1/싣기_대조표.md 에 있다.
// (로그의 뜻·성질, 로그를 문자로 나타내기, 상용로그는 11-1-1b.js 에, 실력 문항은 11-1-1c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
// 영역은 수와 연산(대수 — 지수함수와 로그함수). 성취기준은 12대수01-01(거듭제곱근), 12대수01-02(지수의 확장), 12대수01-03(지수법칙),
// 12대수01-04(로그의 뜻과 성질), 12대수01-05(상용로그).
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(식·조건·보기·표·그래프), 묻는 것(값·지수·꼴·고르기·개수), 계산의 얼개(곱·몫·거듭제곱·근호 속 근호·이어진 곱)가 다르면
//    따로 싣는다. 같은 꼴에서 수만 바꾼 유형은 만들지 않았다. 차례(count)가 여럿인 유형은 차례마다 계산의 얼개나 답의 꼴이 다르다.
//  - 교육과정: 지수가 유리수·실수인 경우는 밑이 양수일 때만 다룬다(12대수01-02 해설) — 밑이 음수인 유리수 지수(①21의 최02)는 짓지 않았다.
//    「지나치게 복잡한 계산은 다루지 않는다」는 빼는 까닭으로 쓰지 않았다(과제 글). 고1·중학교 단원과 같은 일(①1 삼·사차방정식, ①11·①36 곱셈 공식,
//    ①17 x + 1/x 꼴)도 이 단원의 기호로 묻는 것이라 실었다(조율 결정).
//  - 답: 정수·분수는 qAns(분수는 크기가 같은 분수도 맞게 친다), a·ⁿ√b 는 「[±][ ] ⁿ√[ ]」(1도 칸에 적는다), 지수는 수 칸, 꼴이 답을 흘리는 것
//    (복소수 근의 묶음, 근호로 나타낸 꼴, 상용로그의 넷째 자리 소수, 문자로 나타낸 분수식)은 고르기로 낸다.
//    한 유형(한 차례)의 칸 모양은 씨앗이 바뀌어도 같다(정수가 답인 차례와 분수가 답인 차례를 나누었다). 음수가 될 수 있는 답에는 모두 부호 단추를 단다.
//  - 원문의 「a + b의 값」「b − a의 값」처럼 따로 구한 값을 뜻 없이 더하는 꼴은 값을 칸마다 묻는다.
//  - 참·거짓과 정답은 모두 코드가 셈한다(거듭제곱근은 소인수의 지수로, 복소수 근은 정수 셈으로, 상용로그는 만분의 일 단위 정수로).
//  - 검사 근거: 칸마다 글에 보이는 수로 다시 셈하는 식(facts.calc·value)을 단다. 거듭제곱근의 지수(ⁿ√의 n)처럼 글자로 보이지 않는 수는
//    seal 이 facts.unseen 에 밝히고, 밝히기로 한 수(derived) 밖의 수가 나오면 오류를 낸다.
//
// 뺀 것과 까닭(11-1-1b.js, 11-1-1c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 증명을 쓰게 하는 꼴(①14, ①18, ①28, ②15): 원문에 빈칸·고르기 꼴이 없다(조율 결정).
//  - 밑이 음수인 유리수 지수(①21의 최02 (−8)^(2/3)): 교과서 정의 밖이다. 같은 잘못을 짚는 꼴은 ①27(실력)에 있다.
//  - 따로 구한 값을 뜻 없이 더한 원문(소3표2 M/N, 소4표2 a − b 따위)은 칸마다 묻는 유형과 겹친다.
//  - 뒤 단원(11-1-2)의 일: 지수·로그부등식으로 푸는 상용로그 활용(대10, 교대15), 지수함수·로그함수의 그래프·대소·최대최소는 이 목록에 넣지 않았다.
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, frac, lines, N, M, C, D, inline } = B.kit;
  const { MINUS, Q, qadd, qsub, qmul, qdiv, qneg, qcmp, isInt, gcd, lcm, tx, V, sup, nb, tag } = B.kit.mid;
  const rt0 = B.kit.mid.rt;
  const { pw, rtn, lg, jh, hx, qAns, plot } = B.kit.hs;
  // 글 속의 짧은 식(a − a⁻¹, a² + a⁻²)은 줄이 식 가운데서 갈리지 않게 한 덩어리로 묶는다.
  const ms = (s, c) => (/\s/.test(String(s)) ? '<span style="white-space:nowrap">' + B.kit.hs.ms(s, c) + '</span>' : B.kit.hs.ms(s, c));
  const UNIT = '11-1-1', S1 = '12대수01-01', S2 = '12대수01-02', S3 = '12대수01-03', S4 = '12대수01-04', S5 = '12대수01-05';
  const HAN = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ'], CIR = ['㉠', '㉡', '㉢', '㉣', '㉤'];

  // ── 검사 근거 마무리(10-1-3a.js 와 같은 방법) ──
  const stripH = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  function visibleNumbers(item) {
    const seen = stripH([item.text, item.figure || ''].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, ' $1 ').replace(/<table[^>]*aria-label="([^"]*)"[^>]*>/g, ' $1 | '));
    return new Set((seen.match(/\d+/g) || []).concat(seen.match(/\d+\.\d+/g) || [], seen.replace(/(\d) (?=\d)/g, '$1').match(/\d+/g) || []));
  }
  // 「a > 0」「x ≠ 1」처럼 문자·부등호·수로 된 짧은 조건은 줄이 그 가운데서 갈리지 않게 묶는다.
  const REL = /<i class="mb-var">[A-Za-z]<\/i> (?:&gt;|&lt;|≠|≥|≤) −?\d+(?:\.\d+)?/g;
  const tieRel = (h) => (typeof h === 'string' ? h.replace(REL, (all) => '<span style="white-space:nowrap">' + all + '</span>') : h);
  function seal(item) {
    item.text = tieRel(item.text);
    if (item.explain) item.explain = tieRel(item.explain);
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
  const retry = (make) => (d, n) => { for (let i = 0; i < 4000; i += 1) { const item = make(d, n); if (item) return seal(item); } throw new Error('조건에 맞는 문항을 만들지 못했다'); };
  const srcOf = (ref) => (/[①②]/.test(ref) ? '수집본 기본 자료(' : '수집본 심화 자료(') + ref + ')';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: srcOf(ref), make: retry(make) }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: srcOf(ref), make: retry(make) }, more || {});

  // ── 수와 글 ──
  const num = (n) => (n < 0 ? MINUS + Math.abs(n) : String(n));                 // 정수
  const jn = (n) => (n < 0 ? '(' + n + ')' : String(n));                         // 검사 식의 정수
  const jq = (q) => (q.q === 1 ? jn(q.p) : '(' + q.p + '/' + q.q + ')');          // 검사 식의 유리수
  const qh = (q) => tx(q);                                                      // 유리수(분수는 세로 분수)
  const qp = (q) => (q.p < 0 || q.q !== 1 ? '(' + tx(q) + ')' : tx(q));          // 곱하는 자리의 음수·분수는 괄호
  const va = V('a'), vb = V('b'), vc = V('c'), vx = V('x'), vy = V('y'), vk = V('k'), vn = V('n'), vm = V('m');
  // 등식: 짧으면 한 덩어리, 길면 양변을 따로 묶어 「=」 앞에서 줄이 갈릴 수 있게 한다(풀이 칸은 휴대폰에서 300px 남짓이다).
  const eqW = (h) => String(h).replace(/<span class="mb-sr">[^<]*<\/span>/g, '').replace(/<svg[\s\S]*?<\/svg>/g, 'x').replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, 'x').length;
  const eq = (L, R) => (eqW(L) + eqW(R) > 16 ? nb(L) + ' = ' + nb(R) : nb(L + ' = ' + R));
  // 거듭제곱근: R(2, 5) → √5, R(3, 8) → ∛8 꼴(안은 수나 이미 그린 글)
  const inn = (x) => (typeof x === 'number' ? num(x) : x);
  const R = (n, x) => (n === 2 ? rt0(inn(x)) : rtn(n, inn(x)));
  // 거듭제곱: PW(2, 3) → 2³, PW(4, Q(3, 2)) → 4의 3/2제곱, 음수 밑은 괄호
  const bh = (b) => (typeof b === 'number' ? (b < 0 ? '(' + MINUS + Math.abs(b) + ')' : String(b)) : b);
  const PW = (b, e) => { if (typeof e === 'string') return nb(pw(bh(b), e)); const E = typeof e === 'number' ? Q(e) : e; if (isInt(E) && E.p === 1) return bh(b); return isInt(E) ? pw(bh(b), E.p) : pw(bh(b), [E.p, E.q]); };   // 지수 1은 적지 않는다
  const pv = (h, e) => (e === 1 ? h : PW(h, e));                                 // 지수 1은 적지 않는다
  const aP = (e) => PW(va, e);                                                  // a 의 거듭제곱
  // 로그
  const L = (b, x) => lg(b, x);
  const fq = (p, q) => (q === 1 ? num(p) : (p < 0 ? MINUS : '') + frac(Math.abs(p), q));  // 분수 글(정수면 정수)
  const NOTE1 = ' <span style="white-space:nowrap">(단, 1도 칸에 적는다.)</span>';
  const ROOT_N = { 2: '제곱근', 3: '세제곱근', 4: '네제곱근', 5: '다섯제곱근', 6: '여섯제곱근' };

  // ── 수론 ──
  const ipow = (b, e) => { let r = 1; for (let i = 0; i < e; i += 1) r *= b; return r; };
  const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23];
  // n 제곱인 수(1 제외)를 인수로 갖지 않는가
  const nFree = (x, n) => { for (let k = 2; ipow(k, n) <= x; k += 1) if (x % ipow(k, n) === 0) return false; return x >= 2; };
  // x = a^n × b (b 는 n 제곱인 수를 인수로 갖지 않는다) → [a, b]
  const nParts = (x, n) => { let a = 1, b = x; for (let k = 2; ipow(k, n) <= b; k += 1) while (b % ipow(k, n) === 0) { a *= k; b /= ipow(k, n); } return [a, b]; };
  const iroot = (x, n) => { const r = Math.round(Math.pow(x, 1 / n)); for (const c of [r - 1, r, r + 1]) if (c >= 0 && ipow(c, n) === x) return c; return null; };

  // ── 답 칸 ──
  // 답이 c·ⁿ√t(c 는 0이 아닌 정수, t 는 n 제곱인 수를 인수로 갖지 않는 2 이상의 수): 「[±][ ] ⁿ√[ ]」, 계수 1도 칸에 적는다.
  function rootAns(text, n, c, t, o) {
    if (!Number.isInteger(c) || c === 0 || !nFree(t, n)) throw new Error('근호 답 칸: 계수와 근호 안의 수');
    const opt = o || {};
    return inline(text + NOTE1, '{0}' + R(n, '{1}'), [{ answer: c, signed: Boolean(opt.signed) || c < 0 }, { answer: t }], Object.assign({}, opt, {
      shown: (c < 0 ? MINUS : '') + (Math.abs(c) === 1 ? '' : Math.abs(c)) + R(n, t)
    }));
  }
  // 문자마다 값을 답하는 문항: 칸 앞에 「a =」를 적는다. pairs: [[이름 글, 값, 부호 단추?], …]
  const valsQ = (text, pairs, o) => M(text, pairs.map(([n, v, s]) => ({ answer: v, signed: Boolean(s), lead: n + ' =' })), Object.assign({}, o, { shown: pairs.map(([n, v]) => nb(n + ' = ' + num(v))).join(', ') }));
  // 이름표(ㄱ. ㄴ. …)를 붙인 여러 줄
  const rowsFig = (list, tags) => lines(list.map((h, i) => tag((tags || HAN.map((x) => x + '.'))[i]) + ' ' + h));
  // 옳은(옳지 않은) 것 하나를 고르는 문항: rows = [글, 참인가]. 보기가 겹치거나 고를 것이 하나가 아니면 null(다시 만든다).
  function choose(d, text, rows, want, o) {
    const list = d.shuffle(rows), opt = o || {}, w = want !== false;
    if (new Set(list.map((r) => stripH(r[0]))).size !== list.length || list.filter((r) => r[1] === w).length !== 1) return null;
    return C(text, list.map((r) => r[0]), list.findIndex((r) => r[1] === w), Object.assign({}, opt, { facts: Object.assign({ truth: list.map((r) => r[1]), want: w }, opt.facts || {}) }));
  }
  // 「옳은 것만을 있는 대로 고른 것」: 보기 ㄱ, ㄴ, ㄷ …의 참·거짓(rows = [글, 참인가])으로 고르기 보기를 만든다.
  function pickSets(d, text, rows, o) {
    const flags = rows.map((r) => r[1]), labels = HAN.slice(0, rows.length), right = labels.filter((_, i) => flags[i]);
    if (!right.length || right.length === rows.length) return null;
    const cand = [];
    for (let i = 0; i < rows.length; i += 1) { const s = labels.filter((_, j) => (j === i ? !flags[j] : flags[j])); if (s.length) cand.push(s); }
    for (const s of [labels.slice(), [labels[0]], [labels[1]], [labels[rows.length - 1]], [labels[0], labels[1]]]) if (!cand.some((c) => c.join() === s.join()) && s.join() !== right.join()) cand.push(s);
    const opts = d.shuffle(d.shuffle(cand).slice(0, 4).concat([right]));
    const opt = o || {};
    return C(text, opts.map((s) => s.join(', ')), opts.indexOf(right), Object.assign({}, opt, { figure: opt.figure || rowsFig(rows.map((r) => r[0])), facts: Object.assign({ sets: { labels, flags, options: opts.map((s) => s.slice()) } }, opt.facts || {}) }));
  }
  // 식 하나를 그림 칸에: 짧으면 공용 hx(휴대폰 너비에 맞춰 글씨를 줄인다), 길면 겉에 드러난 연산 기호(괄호·태그 밖의 ×, ÷, +, −, =) 앞에서
  // 줄이 갈릴 수 있게 항마다 붙여 둔다(근호·분수가 여럿 든 긴 식은 글씨를 줄여도 288px 카드를 넘는다).
  const OPS = [' × ', ' ÷ ', ' + ', ' ' + MINUS + ' ', ' = '];
  function splitTop(h) {
    const parts = [];
    let depth = 0, paren = 0, last = 0;
    for (let i = 0; i < h.length;) {
      if (h[i] === '<') { const j = h.indexOf('>', i), t = h.slice(i, j + 1); if (t[1] === '/') depth -= 1; else if (!/\/>$/.test(t) && !/^<(br|wbr|path)\b/i.test(t)) depth += 1; i = j + 1; continue; }
      if (')}]'.includes(h[i])) paren -= 1;
      // 괄호로 묶은 두 인수 사이 「)(」에서도 줄이 갈릴 수 있게 한다
      if (depth === 0 && paren === 0 && h[i] === '(' && i > last && h[i - 1] === ')') { parts.push(h.slice(last, i)); last = i; }
      if ('({['.includes(h[i])) paren += 1;
      const op = depth === 0 && paren === 0 && i > last ? OPS.find((o) => h.startsWith(o, i)) : null;
      if (op) { parts.push(h.slice(last, i)); last = i + 1; i += 1; continue; }
      i += 1;
    }
    parts.push(h.slice(last));
    return parts;
  }
  const plainW = (h) => String(h).replace(/<span class="mb-sr">[^<]*<\/span>/g, '').replace(/<svg[\s\S]*?<\/svg>/g, 'xx').replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, 'x').length;
  const ex1 = (h) => { const parts = splitTop(String(h)); return parts.length < 2 || plainW(h) < 22 ? hx(h) : '<span class="mb-expr" style="white-space:normal;font-size:1.2rem">' + parts.map((p, i) => (i ? (p[0] === '(' && /\)$/.test(parts[i - 1]) ? '<wbr>' : ' ') : '') + nb(p)).join('') + '</span>'; };
  const VAL = '다음 값을 구하시오.', SIMP = '다음 식을 간단히 하시오.';

  B.kit.u1111 = {
    UNIT, S1, S2, S3, S4, S5, HAN, CIR, stripH, seal, retry, T, H, num, jn, jq, qh, qp, va, vb, vc, vx, vy, vk, vn, vm, eq, R, bh, PW, pv, aP, L, fq, NOTE1, ROOT_N,
    ipow, PRIMES, nFree, nParts, iroot, rootAns, valsQ, rowsFig, choose, pickSets, ex1, VAL, SIMP
  };

  // ── 단원 틀 ──
  B.addUnit({
    id: '11-1-1', grade: 11, semester: 1, no: 1, title: '지수와 로그', version: 1,
    groups: [
      { id: 'root', title: '거듭제곱근의 뜻', standard: S1, types: [] },
      { id: 'rootp', title: '거듭제곱근의 성질', standard: S1, types: [] },
      { id: 'intexp', title: '정수인 지수', standard: S2, types: [] },
      { id: 'ratexp', title: '유리수·실수인 지수', standard: S2, types: [] },
      { id: 'expuse', title: '지수법칙의 활용', standard: S3, types: [] },
      { id: 'logdef', title: '로그의 뜻', standard: S4, types: [] },
      { id: 'logprop', title: '로그의 성질', standard: S4, types: [] },
      { id: 'logexpr', title: '로그를 문자로 나타내기와 조건식', standard: S4, types: [] },
      { id: 'common', title: '상용로그', standard: S5, types: [] }
    ]
  });

  // ── 복소수 근(정수 셈): z = x + y·√s·i 를 [x, y] 로, s 는 유형마다 정한다 ──
  const cmul = (u, w, s) => [u[0] * w[0] - s * u[1] * w[1], u[0] * w[1] + u[1] * w[0]];
  const cpow = (u, n, s) => { let r = [1, 0]; for (let i = 0; i < n; i += 1) r = cmul(r, u, s); return r; };
  const cxh = (z, s) => {
    const [x, y] = z, im = (Math.abs(y) === 1 ? '' : Math.abs(y)) + (s === 1 ? '' : rt0(String(s))) + V('i');
    if (y === 0) return num(x);
    if (x === 0) return nb((y < 0 ? MINUS : '') + im);
    return nb(num(x) + (y < 0 ? ' ' + MINUS + ' ' : ' + ') + im);
  };
  // 실수 a 의 n 제곱근 가운데 실수인 것(값의 배열, 정수가 아니면 null 자리)
  const realCount = (a, n) => (n % 2 ? 1 : a > 0 ? 2 : a === 0 ? 1 : 0);

  // ── 거듭제곱근의 뜻 ──
  B.addTypes(UNIT, 'root', [
    T('root-all', 'n제곱근을 복소수의 범위에서 모두 구하기', '①1', (d, n) => {
      if (n === 0) {
        // x³ = a(a = ±k³): 근은 r, −r/2 ± (|r|/2)√3 i
        const k = d.pick([2, 4, 6]), s = d.pick([1, -1]), a = s * k * k * k, r = s * k, h = k / 2;
        const sets = [
          [[r, 0], [-s * h, h], [-s * h, -h]],
          [[-r, 0], [s * h, h], [s * h, -h]],
          [[r, 0]],
          [[r, 0], [s * h, h], [s * h, -h]],
          [[r, 0], [-r, 0]]
        ];
        const ok = (set) => set.length === 3 && new Set(set.map(String)).size === 3 && set.every((z) => { const c = cpow(z, 3, 3); return c[0] === a && c[1] === 0; });
        const rows = sets.map((set) => [set.map((z) => cxh(z, 3)).join(', '), ok(set)]);
        const X = vx;
        return choose(d, `${num(a)}의 세제곱근을 모두 구한 것은?`, rows, true, {
          explain: `${num(a)}의 세제곱근을 ${X}라 하면 ${eq(ms('x^3'), num(a))}, 곧 ${eq(`(${X} ${r < 0 ? '+' : MINUS} ${k})(${ms('x^2')} ${r < 0 ? MINUS : '+'} ${k}${X} + ${k * k})`, '0')}이다. 이차방정식을 풀면 ${eq(X, cxh([-s * h, h], 3).replace(' + ', ' ± '))}이므로 세제곱근은 ${rows.find((x) => x[1])[0]}의 3개이다.`
        });
      }
      // 네제곱근이 아닌 것: ±k, ±ki 와 k²
      const k = d.pick([2, 3, 4, 5]), a = ipow(k, 4);
      const cand = [[k, 0], [-k, 0], [0, k], [0, -k], [k * k, 0]];
      const rows = cand.map((z) => { const c = cpow(z, 4, 1); return [cxh(z, 1), c[0] === a && c[1] === 0]; });
      return choose(d, `다음 가운데 ${a}의 네제곱근이 아닌 것은?`, rows, false, {
        explain: `${a}의 네제곱근을 ${vx}라 하면 ${eq(ms('x^4') + ' ' + MINUS + ' ' + a, '0')}, ${eq(`(${vx} ${MINUS} ${k})(${vx} + ${k})(${ms('x^2')} + ${k * k})`, '0')}이므로 ${eq(vx, '±' + k)} 또는 ${eq(vx, '±' + k + V('i'))}이다. ${josa(k * k, '은/는')} ${a}의 제곱근이다.`
      });
    }, { count: 2 }),
    T('root-real', 'n제곱근 가운데 실수인 것', '①2', (d, n) => {
      if (n === 0) {
        const k1 = d.int(2, 6), s1 = d.pick([1, -1]), A = s1 * ipow(k1, 3), k2 = d.int(2, 5), Bv = ipow(k2, 4), pos = d.bool(), b = pos ? k2 : -k2;
        return valsQ(`${num(A)}의 세제곱근 가운데 실수인 것을 ${va}, ${Bv}의 네제곱근 가운데 ${pos ? '양수' : '음수'}인 것을 ${vb}라 할 때, ${va}, ${vb}의 값은?`, [[va, s1 * k1, true], [vb, b, true]], {
          explain: `${num(A)}의 세제곱근 가운데 실수인 것은 ${eq(R(3, A), num(s1 * k1))} 하나이다. ${Bv}의 네제곱근 가운데 실수인 것은 ${eq(R(4, Bv), k2)}, ${eq(MINUS + R(4, Bv), num(-k2))}이므로 ${eq(vb, num(b))}이다.`,
          facts: { calc: [[`${jn(s1)}*${k1}`, 0], [jn(b), 1]], derived: [k1, k2] }
        });
      }
      // 세 수의 실수인 n제곱근의 개수
      const kinds = d.shuffle([[4, 1], [4, -1], [3, -1], [3, 1]]).slice(0, 3);
      const rows = kinds.map(([deg, s]) => { const a = s * d.pick([2, 3, 5, 6, 7, 8, 10, 12, 16, 27, 81]); return { a, deg, c: realCount(a, deg) }; });
      if (new Set(rows.map((r) => r.a + ':' + r.deg)).size < 3) return null;
      return M('다음 ㉠, ㉡, ㉢에 해당하는 수의 개수를 차례로 구하시오.', rows.map((r, i) => ({ answer: r.c, label: CIR[i], unit: '개' })), {
        figure: rowsFig(rows.map((r) => `${num(r.a)}의 ${ROOT_N[r.deg]} 가운데 실수인 것`), CIR),
        shown: rows.map((r, i) => CIR[i] + ' ' + r.c + '개').join(', '),
        explain: '실수 a의 n제곱근 가운데 실수인 것은 n이 홀수이면 1개, n이 짝수이면 a > 0일 때 2개, a < 0일 때 0개이다. ' + rows.map((r, i) => `${CIR[i]}${r.deg % 2 ? '은 세제곱근이므로' : r.a > 0 ? '은 양수의 네제곱근이므로' : '은 음수의 네제곱근이므로'} ${r.c}개`).join(', ') + '이다.',
        facts: { calc: rows.map((r, i) => [String(r.c), i]).filter(([t]) => t !== '0'), derived: [2] }
      });
    }, { count: 2 }),
    T('root-val', 'ⁿ√a 의 값', '①3', (d, n) => {
      if (n === 0) {
        const kind = d.int(0, 2), deg = kind === 1 ? d.pick([4, 6]) : d.pick([3, 5]), k = d.int(2, { 3: 6, 4: 5, 5: 3, 6: 3 }[deg]), K = ipow(k, deg);
        const h = kind === 0 ? R(deg, -K) : kind === 1 ? MINUS + R(deg, K) : MINUS + R(deg, -K), v = kind === 2 ? k : -k;
        return qAns(VAL, v, {
          signed: true, figure: ex1(h),
          explain: kind === 0 ? `${eq(ms('x^' + deg), num(-K))}의 실근은 ${num(-k)}이므로 ${eq(R(deg, -K), num(-k))}이다.` : kind === 1 ? `${jh(R(deg, K), '은/는')} ${K}의 ${ROOT_N[deg]} 가운데 양수인 ${k}이므로 ${eq(h, num(-k))}이다.` : `${eq(R(deg, -K), num(-k))}이므로 ${eq(h, MINUS + '(' + num(-k) + ')')} = ${k}이다.`,
          facts: { value: kind === 2 ? `(${K})**(1/${deg})` : `0-(${K})**(1/${deg})`, derived: [deg] }
        });
      }
      if (n === 1) {
        const deg = d.pick([3, 4, 6]), pairs = { 3: [[1, 2], [2, 3], [1, 3], [3, 4], [2, 5], [1, 4]], 4: [[1, 2], [2, 3], [1, 3], [3, 4]], 6: [[1, 2]] }[deg], [p, q] = d.pick(pairs), s = deg === 3 ? d.pick([1, -1]) : 1;
        const P = ipow(p, deg), Qd = ipow(q, deg), inner = (s < 0 ? MINUS : '') + frac(P, Qd);
        return qAns(VAL, Q(s * p, q), {
          signed: true, figure: ex1(R(deg, inner)),
          explain: `${eq(fq(s * P, Qd), PW(qp(Q(s * p, q)), deg))}이므로 ${eq(R(deg, inner), fq(s * p, q))}이다.`,
          facts: { value: `${s < 0 ? '0-' : ''}(${P}/${Qd})**(1/${deg})`, derived: [deg] }
        });
      }
      const deg = d.pick([3, 3, 4, 5]), dd = deg === 3 ? d.int(1, 9) : deg === 4 ? d.int(1, 5) : d.int(1, 2), s = deg % 2 ? d.pick([1, -1]) : 1;
      if (dd === 1 && deg !== 3) return null;
      const Kt = (ipow(dd, deg) / ipow(10, deg)).toFixed(deg), lit = (s < 0 ? MINUS : '') + Kt, vt = (s < 0 ? MINUS : '') + String(dd / 10);
      return D(VAL, s * dd / 10, {
        signed: true, figure: ex1(R(deg, lit)),
        explain: `${eq(Kt, PW('(' + (dd / 10) + ')', deg))}이므로 ${eq(R(deg, lit), vt)}이다.`,
        facts: { value: `${s < 0 ? '0-' : ''}(${Kt})**(1/${deg})`, derived: [deg] }
      });
    }, { count: 3 }),
    T('root-claim', '실수인 n제곱근에 대한 설명', '①4', (d) => {
      // 구체적인 수의 말: [글, 참인가]
      const spec = () => {
        const deg = d.pick([3, 4]), s = d.pick([1, -1]), k = d.int(2, 5), a = s * ipow(k, deg), roots = deg === 3 ? [s * k] : s > 0 ? [k, -k] : [];
        const kind = d.int(0, 2), name = `${num(a)}의 ${ROOT_N[deg]} 가운데 실수인 것은`;
        if (kind === 0) { const c = realCount(a, deg) + d.pick([0, 0, 1, -1]); return c < 0 ? null : [`${name} ${c}개이다.`, c === realCount(a, deg)]; }
        if (kind === 1) {
          const shownR = d.pick([roots, deg === 4 && s > 0 ? [k] : [-roots[0] || k], [k, -k]]);
          const claim = shownR.length ? `${name} ${shownR.map(num).join(', ')}이다.` : `${name} 없다.`;
          return [claim, shownR.length === roots.length && shownR.every((v) => roots.includes(v))];
        }
        const none = roots.length === 0;
        return d.bool() ? [`${name} 없다.`, none] : [`${name} 하나뿐이다.`, roots.length === 1];
      };
      const general = [
        [`실수 ${va}의 세제곱근 가운데 실수인 것은 항상 하나 있다.`, true, 'odd'],
        [`실수 ${va}의 네제곱근 가운데 실수인 것은 항상 있다.`, false, 'even'],
        [`${jh(vn, '이/가')} 홀수일 때, 음수 ${va}의 ${vn}제곱근 가운데 실수인 것은 ${R(vn, va)}이다.`, true, 'oddneg'],
        [`${jh(vn, '이/가')} 홀수일 때, 음수 ${va}의 ${vn}제곱근 가운데 실수인 것은 ${MINUS}${R(vn, va)}이다.`, false, 'oddneg'],
        [`${jh(vn, '이/가')} 짝수일 때, 양수 ${va}의 ${vn}제곱근 가운데 실수인 것은 ${R(vn, va)}, ${MINUS}${R(vn, va)}이다.`, true, 'evenpos'],
        [`${jh(vn, '이/가')} 짝수일 때, 음수 ${va}의 ${vn}제곱근 가운데 실수인 것은 없다.`, true, 'evenneg']
      ];
      const g = d.pick(general), s1 = spec(), s2 = spec();
      if (!s1 || !s2 || stripH(s1[0]) === stripH(s2[0])) return null;
      const rows = d.shuffle([[g[0], g[1]], s1, s2]);
      return pickSets(d, '다음 보기 가운데 옳은 것만을 있는 대로 고른 것은?', rows, {
        explain: '실수 a의 n제곱근 가운데 실수인 것은 n이 홀수이면 ⁿ√a 하나이고, n이 짝수이면 a > 0일 때 ⁿ√a, −ⁿ√a, a < 0일 때 없다. ' + rows.map((r, i) => HAN[i] + (r[1] ? '은 옳다' : '은 옳지 않다')).join(', ') + '.'
      });
    }),
    T('root-cube', '부피가 주어진 정육면체의 모서리', '①5', (d) => {
      const m = d.int(2, 4), t = d.pick([2, 3, 4, 5, 6, 7, 9, 10]), V0 = m * m * m * t;
      if (V0 > 700) return null;
      return valsQ(`부피가 ${V0}인 정육면체의 한 모서리의 길이를 ${nb(va + R(3, vb))} 꼴로 나타낼 때, 자연수 ${va}, ${vb}의 값은? (단, ${jh(vb, '은/는')} 1보다 큰 세제곱수를 인수로 갖지 않는다.)`, [[va, m], [vb, t]], {
        explain: `한 모서리의 길이를 ${vx}라 하면 ${eq(ms('x^3'), V0)}이므로 ${eq(vx, R(3, V0))} = ${R(3, ms(m + '^3') + ' × ' + t)} = ${m}${R(3, t)}이다.`,
        facts: { calc: [[String(m), 0], [`${V0}/(${m}*${m}*${m})`, 1]], derived: [m] }
      });
    }),
    T('root-box', '부피가 주어진 직육면체의 밑면의 넓이', '①6', (d) => {
      const p = d.pick([2, 3]), m = d.pick([1, 2]), t = d.pick([2, 3, 5, 6, 7]), V0 = p * m * m * m * t;
      if (V0 > 200 || (m === 1 && t < 3)) return null;
      const a = p * m * m, b = t * t;
      return valsQ(`밑면의 가로의 길이가 세로의 길이의 ${p}배이고, 높이가 밑면의 세로의 길이와 같은 직육면체 모양의 상자가 있다. 이 상자의 부피가 ${V0}일 때, 밑면의 넓이를 ${nb(va + R(3, vb))} 꼴로 나타내면 자연수 ${va}, ${vb}의 값은? (단, ${jh(vb, '은/는')} 1보다 큰 세제곱수를 인수로 갖지 않는다.)`, [[va, a], [vb, b]], {
        explain: `세로의 길이를 ${vx}라 하면 부피는 ${eq(p + vx + ' × ' + vx + ' × ' + vx, p + ms('x^3'))}이므로 ${eq(ms('x^3'), V0 / p)}, ${eq(vx, R(3, V0 / p))} = ${m === 1 ? '' : m}${R(3, t)}이다. 밑면의 넓이는 ${eq(p + ms('x^2'), a + R(3, b))}이다.`,
        facts: { calc: [[`${p}*${m}*${m}`, 0], [`${t}*${t}`, 1]], derived: [m, t] }
      });
    })
  ]);

  // ── 거듭제곱근의 성질 ──
  // ⁿ√x × ⁿ√y = k 가 되는 x, y(소수의 거듭제곱): [n, x, y, k]
  function prodPair(d) {
    return d.until(() => { const p = d.pick([2, 3, 5]), deg = d.pick([3, 4, 5]), e = d.pick([1, 2]), T0 = deg * e, i = d.int(1, T0 - 1); return [deg, ipow(p, i), ipow(p, T0 - i), ipow(p, e), i % deg]; },
      ([deg, x, y, k, r]) => r !== 0 && x <= 1000 && y <= 1000 && x !== y && k <= 100);
  }
  // ⁿ√x ÷ ⁿ√y = k: [n, x, y, k]
  function quotPair(d) {
    return d.until(() => { const deg = d.pick([3, 4]), k = d.int(2, 5), y = d.pick([2, 3, 5, 6, 7]); return [deg, ipow(k, deg) * y, y, k]; }, ([, x]) => x <= 2000);
  }
  B.addTypes(UNIT, 'rootp', [
    T('rootp-one', '거듭제곱근의 성질 하나로 간단히', '①7', (d, n) => {
      if (n === 0) {
        const [deg, x, y, k] = prodPair(d);
        return qAns(VAL, k, { figure: ex1(R(deg, x) + ' × ' + R(deg, y)), explain: `${R(deg, x)} × ${eq(R(deg, y), R(deg, x * y))} = ${R(deg, PW(k, deg))} = ${k}이다.`, facts: { value: `(${x}*${y})**(1/${deg})`, derived: [deg] } });
      }
      if (n === 1) {
        const [deg, x, y, k] = quotPair(d);
        return qAns(VAL, k, { figure: ex1(frac(R(deg, x), R(deg, y))), explain: `${eq(frac(R(deg, x), R(deg, y)), R(deg, frac(x, y)))} = ${R(deg, x / y)} = ${R(deg, PW(k, deg))} = ${k}이다.`, facts: { value: `(${x}/${y})**(1/${deg})`, derived: [deg] } });
      }
      if (n === 2) {
        const [deg, q, a, m] = d.until(() => [d.pick([3, 4, 6]), d.pick([2, 3, 5, 7, 13]), d.int(1, 5), d.int(2, 6)], ([deg, q, a, m]) => a < deg && (a * m) % deg === 0 && ipow(q, a) <= 1000 && ipow(q, a * m / deg) <= 400 && m !== deg);
        const x = ipow(q, a), v = ipow(q, a * m / deg);
        return qAns(VAL, v, { figure: ex1(PW('(' + R(deg, x) + ')', m)), explain: `${eq(PW('(' + R(deg, x) + ')', m), R(deg, PW(x, m)))} = ${R(deg, PW(q, a * m))} = ${v}이다.`, facts: { value: `(${x})**(${m}/${deg})`, derived: [deg] } });
      }
      const [o, i] = d.pick([[3, 2], [2, 3], [2, 2], [3, 3], [4, 2], [2, 4]]), k = d.pick([2, 3, 5]), x = ipow(k, o * i);
      if (x > 4096) return null;
      return qAns(VAL, k, { figure: ex1(R(o, R(i, x))), explain: `${eq(R(o, R(i, x)), R(o * i, x))} = ${R(o * i, PW(k, o * i))} = ${k}이다.`, facts: { value: `(${x})**(1/(${o}*${i}))`, derived: [o, i] } });
    }, { count: 4 }),
    T('rootp-mix', '거듭제곱근의 성질을 이어 계산하기', '①8', (d, n) => {
      if (n === 0) {
        const [d1, x1, y1, k1] = prodPair(d), [d2, x2, y2, k2] = quotPair(d), plus = d.bool();
        if (d1 === d2) return null;
        const v = plus ? k1 + k2 : k1 - k2;
        if (v === 0) return null;
        return qAns(VAL, v, {
          signed: true, figure: ex1(`${R(d1, x1)} × ${R(d1, y1)} ${plus ? '+' : MINUS} ${frac(R(d2, x2), R(d2, y2))}`),
          explain: `${R(d1, x1)} × ${eq(R(d1, y1), R(d1, x1 * y1))} = ${k1}, ${eq(frac(R(d2, x2), R(d2, y2)), R(d2, x2 / y2))} = ${k2}이므로 값은 ${eq(k1 + (plus ? ' + ' : ' ' + MINUS + ' ') + k2, num(v))}이다.`,
          facts: { value: `(${x1}*${y1})**(1/${d1})${plus ? '+' : '-'}(${x2}/${y2})**(1/${d2})`, derived: [d1, d2] }
        });
      }
      // 소수 p 의 거듭제곱 세 개를 곱하고 나눈다: 항 = { h 글, e 지수(유리수), js 검사 식 }
      const p = d.pick([2, 3]);
      const term = () => {
        const kind = d.int(0, 2);
        if (kind === 0) { const deg = d.pick([3, 4, 5]), a = d.int(1, deg + 2), m = d.int(2, 3); if (a % deg === 0 || ipow(p, a) > 600) return null; return { h: PW('(' + R(deg, ipow(p, a)) + ')', m), e: Q(a * m, deg), js: `(${ipow(p, a)})**(${m}/${deg})`, idx: [deg] }; }
        if (kind === 1) { const deg = d.pick([3, 4, 6]), a = d.int(1, 2 * deg); if (a % deg === 0 || ipow(p, a) > 800) return null; return { h: R(deg, ipow(p, a)), e: Q(a, deg), js: `(${ipow(p, a)})**(1/${deg})`, idx: [deg] }; }
        const deg = d.pick([2, 3]), a = d.int(1, 3 * deg); if (ipow(p, a) > 800 || a % (2 * deg) === 0) return null; return { h: R(2, R(deg, ipow(p, a))), e: Q(a, 2 * deg), js: `(${ipow(p, a)})**(1/(2*${deg}))`, idx: [deg] };
      };
      if (n === 1) {
        const t = [term(), term(), term()];
        if (t.some((x) => !x)) return null;
        const ops = d.pick([['÷', '×'], ['×', '÷']]), E = ops[0] === '÷' ? qadd(qsub(t[0].e, t[1].e), t[2].e) : qsub(qadd(t[0].e, t[1].e), t[2].e);
        if (!isInt(E) || E.p < 0 || ipow(p, E.p) > 500) return null;
        const v = ipow(p, E.p);
        return qAns(VAL, v, {
          figure: ex1(`${t[0].h} ${ops[0]} ${t[1].h} ${ops[1]} ${t[2].h}`),
          explain: `${p}의 거듭제곱으로 나타내면 차례로 ${t.map((x) => PW(p, x.e)).join(', ')}이므로 값은 ${E.p === 1 ? '' : PW(p, E) + ' = '}${v}이다.`,
          facts: { value: `${t[0].js}${ops[0] === '÷' ? '/' : '*'}${t[1].js}${ops[1] === '÷' ? '/' : '*'}${t[2].js}`, derived: t.flatMap((x) => x.idx).concat([2]) }
        });
      }
      // 분수: 위 하나 ÷ (아래 둘의 곱) — 값이 1보다 작은 분수
      const t = [term(), term(), term()];
      if (t.some((x) => !x)) return null;
      const E = qsub(t[0].e, qadd(t[1].e, t[2].e));
      if (!isInt(E) || E.p > -1 || ipow(p, -E.p) > 200) return null;
      return qAns(VAL, Q(1, ipow(p, -E.p)), {
        figure: ex1(frac(t[0].h, `${t[1].h} × ${t[2].h}`)),
        explain: `${p}의 거듭제곱으로 나타내면 분자는 ${PW(p, t[0].e)}, 분모는 ${PW(p, t[1].e)} × ${eq(PW(p, t[2].e), PW(p, qadd(t[1].e, t[2].e)))}이므로 값은 ${eq(PW(p, E), frac(1, ipow(p, -E.p)))}이다.`,
        facts: { value: `${t[0].js}/(${t[1].js}*${t[2].js})`, derived: t.flatMap((x) => x.idx).concat([2]) }
      });
    }, { count: 3 }),
    T('rootp-like', '같은 거듭제곱근끼리 더하고 빼기', '①9', (d) => {
      const deg = d.pick([3, 4]), t = d.pick(deg === 3 ? [2, 3, 5, 6, 7] : [2, 3, 5, 6]), cnt = d.pick([2, 3]);
      const terms = [];
      for (let i = 0; i < cnt; i += 1) terms.push({ k: d.pick([1, 1, 2, 3]), s: i === 0 ? 1 : d.pick([1, -1]), m: d.pick([1, 2, 3]) });
      if (!terms.some((x) => x.m > 1) || new Set(terms.map((x) => x.m)).size < terms.length || terms.some((x) => ipow(x.m, deg) * t > 1500)) return null;
      const c = terms.reduce((acc, x) => acc + x.s * x.k * x.m, 0);
      if (c === 0) return null;
      // 첫 항은 곱으로 줄 수도 있다(ⁿ√u × ⁿ√v)
      let first = null;
      if (terms[0].k === 1 && d.bool()) { const X0 = ipow(terms[0].m, deg) * t, u = d.pick([2, 3, 4, 6, 8].filter((u) => X0 % u === 0 && X0 / u > 1 && iroot(u, deg) === null && iroot(X0 / u, deg) === null)); if (u) first = R(deg, u) + ' × ' + R(deg, X0 / u); }
      const termH = (x, i) => (i === 0 ? '' : x.s < 0 ? ' ' + MINUS + ' ' : ' + ') + (i === 0 && first ? first : (x.k === 1 ? '' : x.k) + R(deg, ipow(x.m, deg) * t));
      const h = terms.map(termH).join('');
      return rootAns(SIMP, deg, c, t, {
        signed: true, figure: ex1(h),
        explain: `근호 안에서 ${deg === 3 ? '세제곱' : '네제곱'}인 수를 꺼내면 ${terms.map((x, i) => (i === 0 ? '' : x.s < 0 ? ' ' + MINUS + ' ' : ' + ') + (x.k * x.m === 1 ? '' : x.k * x.m) + R(deg, t)).join('')} = ${c === 1 ? '' : c === -1 ? MINUS : num(c)}${R(deg, t)}이다.`,
        facts: { calc: [[terms.map((x, i) => (x.s < 0 ? '-' : i ? '+' : '') + x.k + '*' + x.m).join(''), 0], [String(t), 1]], derived: terms.map((x) => x.m).concat([t]) }
      });
    }),
    T('rootp-cmp', '두 거듭제곱근의 크기 비교', '①10', (d) => {
      const t = d.pick([2, 3, 5, 6, 7]), m1 = d.int(1, 3), m2 = d.pick([1, 2]);
      if (m1 === m2 || ipow(m1, 3) * t > 200) return null;
      const X1 = ipow(m1, 3) * t, X2 = ipow(m2, 6) * t * t, A = R(3, X1), Bh = R(2, R(3, X2)), swap = d.bool();
      const L0 = swap ? Bh : A, R0 = swap ? A : Bh, ex0 = swap ? [`(${X2})**(1/6)`, `(${X1})**(1/3)`] : [`(${X1})**(1/3)`, `(${X2})**(1/6)`];
      const big = (swap ? m2 : m1) > (swap ? m1 : m2);
      return C(`두 수의 크기를 비교할 때, ○ 안에 알맞은 것은?`, ['&gt;', '=', '&lt;'], big ? 0 : 2, {
        figure: ex1(`${L0} ○ ${R0}`),
        explain: `${eq(A, (m1 === 1 ? '' : m1) + R(3, t))}, ${eq(Bh, R(6, X2))} = ${(m2 === 1 ? '' : m2) + R(3, t)}이다. ${R(3, t)} &gt; 0이므로 계수가 큰 쪽이 크다.`,
        facts: { choose: { exprs: ex0, rule: 'compare' }, derived: [3, 6] }
      });
    }),
    T('rootp-cube', '곱셈 공식으로 거듭제곱근 계산', '①11', (d) => {
      const b = d.pick([1, 1, 2, 3]), a = d.pick([2, 3, 4, 5, 6, 7, 9, 10].filter((x) => x !== b)), minus = d.bool();
      const cb = (x) => (x === 1 ? '1' : R(3, x));
      const h = `(${R(3, a)} ${minus ? MINUS : '+'} ${cb(b)})(${R(3, a * a)} ${minus ? '+' : MINUS} ${cb(a * b)} + ${cb(b * b)})`;
      const v = minus ? a - b : a + b;
      return qAns(VAL, v, {
        signed: true, figure: ex1(h),
        explain: `${eq(R(3, a), va)}, ${jh(eq(cb(b), vb), '으로/로')} 놓으면 ${eq(`(${va} ${minus ? MINUS : '+'} ${vb})(${ms('a^2')} ${minus ? '+' : MINUS} ${va}${vb} + ${ms('b^2')})`, ms('a^3') + (minus ? ' ' + MINUS + ' ' : ' + ') + ms('b^3'))}이므로 값은 ${eq(a + (minus ? ' ' + MINUS + ' ' : ' + ') + b, num(v))}이다.`,
        facts: { value: `${a}${minus ? '-' : '+'}${b}` }
      });
    }),
    T('rootp-letter', '거듭제곱근으로 준 문자로 수 나타내기', '①12', (d) => {
      const [p, q] = d.shuffle([2, 3, 5]).slice(0, 2), n1 = d.pick([2, 3, 4]), n2 = d.pick([2, 3, 4, 5].filter((x) => x !== n1)), i = d.pick([1, 2]), j = d.pick([1, 2, -1]);
      const Nv = j > 0 ? String(ipow(p, i) * ipow(q, j)) : frac(ipow(p, i), q);
      if (j > 0 && ipow(p, i) * ipow(q, j) > 100) return null;
      const x = n1 * i, y = n2 * j;
      return valsQ(`${eq(va, R(n1, p))}, ${eq(vb, R(n2, q))}일 때, ${jh(eq(Nv, ms('a^x b^y')), '을/를')} 만족시키는 유리수 ${vx}, ${vy}의 값은?`, [[vx, x, true], [vy, y, true]], {
        explain: `${eq(p, PW(va, n1))}, ${eq(q, PW(vb, n2))}이므로 ${eq(Nv, (j > 0 ? pv('(' + ms('a^' + n1) + ')', i) + pv('(' + ms('b^' + n2) + ')', j) : frac(pv('(' + ms('a^' + n1) + ')', i), ms('b^' + n2))))} = ${PW(va, x)}${PW(vb, y)}이다.`,
        facts: { calc: [[`${n1}*${i}`, 0], [`${n2}*${jn(j)}`, 1]], derived: [n1, n2, i, Math.abs(j)] }
      });
    })
  ]);

  // ── 정수인 지수 ──
  B.addTypes(UNIT, 'intexp', [
    T('int-val', '0 또는 음의 정수인 지수의 값', '①15', (d, n) => {
      if (n === 0) {
        if (d.bool()) {
          const b = d.int(2, 9) * d.pick([1, -1]), k = d.int(1, 4), P0 = ipow(Math.abs(b), k);
          if (P0 > 300 || P0 === 1) return null;
          const v = Q(b < 0 && k % 2 ? -1 : 1, P0);
          return qAns(VAL, v, { signed: true, figure: ex1(PW(b, -k)), explain: `${eq(PW(b, -k), frac(1, PW(b, k)))}${k === 1 && b > 0 ? '' : ' = ' + qh(v)}이다.`, facts: { value: `(${b})**(${-k})`, rule: 'int-val-frac' } });
        }
        const p = d.int(1, 5), q = d.int(2, 7), k = d.pick([1, 2, 3]), s = d.pick([1, -1]);
        if (gcd(p, q) !== 1 || p === 1 || ipow(q, k) > 400) return null;
        const v = Q((s < 0 && k % 2 ? -1 : 1) * ipow(q, k), ipow(p, k)), base = '(' + (s < 0 ? MINUS : '') + frac(p, q) + ')';
        return qAns(VAL, v, { signed: true, figure: ex1(pw(base, -k)), explain: `${eq(pw(base, -k), PW('(' + (s < 0 ? MINUS : '') + frac(q, p) + ')', k))} = ${qh(v)}이다.`, facts: { value: `(${s < 0 ? '-' : ''}${p}/${q})**(${-k})`, rule: 'int-val-frac' } });
      }
      if (d.bool()) {
        const b = d.pick([d.int(2, 9) * -1, -1]), q = d.int(2, 7), base = d.bool() ? bh(b) : '(' + MINUS + frac(1, q) + ')';
        return qAns(VAL, 1, { signed: true, figure: ex1(pw(base, 0)), explain: `0이 아닌 수의 0제곱은 1이므로 값은 1이다.`, facts: { value: '1', rule: 'int-val-int' } });
      }
      const b = d.int(2, 6), k = d.int(2, 3), s = d.pick([1, -1]), v = (s < 0 && k % 2 ? -1 : 1) * ipow(b, k);
      return qAns(VAL, v, { signed: true, figure: ex1(pw('(' + (s < 0 ? MINUS : '') + frac(1, b) + ')', -k)), explain: `${eq(pw('(' + (s < 0 ? MINUS : '') + frac(1, b) + ')', -k), PW(s * b, k))} = ${num(v)}이다.`, facts: { value: `(${s < 0 ? '-' : ''}1/${b})**(${-k})`, rule: 'int-val-int' } });
    }, { count: 2 }),
    T('int-unit', '단위의 앞붙이와 10의 거듭제곱', '①15', (d) => {
      const [U1, e1] = d.pick([['km', 3], ['cm', -2]]), [U2, e2, word] = d.pick([['nm', 9, '나노미터'], ['μm', 6, '마이크로미터']]);
      return inline(`1 ${U2}(${word})는 ${frac(1, PW(10, e2))} m이다. 다음 빈칸에 알맞은 수를 차례로 구하시오.`, `1 ${U1} = ${nb('10<sup>{0}</sup> m')} = ${nb('10<sup>{1}</sup> ' + U2)}`, [{ answer: e1, signed: true }, { answer: e1 + e2, signed: true }], {
        shown: `1 ${U1} = ${PW(10, e1)} m = ${PW(10, e1 + e2)} ${U2}`,
        explain: `1 ${eq(U1, PW(10, e1) + ' m')}이고 1 m = ${PW(10, e2)} ${U2}이므로 1 ${U1} = ${PW(10, e1)} × ${PW(10, e2)} ${U2} = ${PW(10, e1 + e2)} ${U2}이다.`,
        facts: { calc: [[jn(e1), 0], [`${jn(e1)}+${e2}`, 1]], derived: [Math.abs(e1)] }
      });
    }),
    T('int-law', '정수인 지수의 지수법칙', '①16', (d, n) => {
      const nzI = (lo, hi) => d.until(() => d.int(lo, hi), (x) => x !== 0);
      if (n === 0) {
        const p = nzI(-5, 5), q = nzI(-5, 5), r = nzI(-3, 3), kind = d.int(0, 1), k = (kind === 0 ? p + q : p - q) * r;
        if (k === 0 || Math.abs(k) > 30 || p === q) return null;
        const h = PW('(' + aP(p) + (kind ? ' ÷ ' : ' × ') + aP(q) + ')', r);
        return qAns(`다음 식을 간단히 하면 ${aP(vk)}이다. 정수 ${vk}의 값은? (단, ${va} ≠ 0)`, k, { signed: true, figure: ex1(h), explain: `${eq(h, PW('(' + aP(kind ? p - q : p + q) + ')', r))} = ${aP(k)}이므로 ${eq(vk, num(k))}이다.`, facts: { calc: [[`(${jn(p)}${kind ? '-' : '+'}${jn(q)})*${jn(r)}`, 0]] } });
      }
      const [p1, q1, r1, p2, q2, r2] = [nzI(-4, 4), nzI(-4, 4), nzI(-3, 3), nzI(-4, 4), nzI(-4, 4), d.pick([1, 2, 3, -2])], div = d.bool();
      const m = p1 * r1 + (div ? -1 : 1) * p2 * r2, nn = q1 * r1 + (div ? -1 : 1) * q2 * r2;
      if (m === 0 || nn === 0 || Math.abs(m) > 20 || Math.abs(nn) > 20) return null;
      const h = pv('(' + pv(va, p1) + pv(vb, q1) + ')', r1) + (div ? ' ÷ ' : ' × ') + pv('(' + pv(va, p2) + pv(vb, q2) + ')', r2);
      return valsQ(`다음 식을 간단히 하면 ${ms('a^m b^n')}이다. 정수 ${vm}, ${vn}의 값은? (단, ${va} ≠ 0, ${vb} ≠ 0)`, [[vm, m, true], [vn, nn, true]], {
        figure: ex1(h),
        explain: `${eq(h, pv(va, p1 * r1) + pv(vb, q1 * r1) + (div ? ' ÷ ' : ' × ') + pv(va, p2 * r2) + pv(vb, q2 * r2))} = ${pv(va, m)}${pv(vb, nn)}이다.`,
        facts: { calc: [[`${jn(p1)}*${jn(r1)}${div ? '-' : '+'}${jn(p2)}*${jn(r2)}`, 0], [`${jn(q1)}*${jn(r1)}${div ? '-' : '+'}${jn(q2)}*${jn(r2)}`, 1]] }
      });
    }, { count: 2 }),
    T('int-recip', 'a + a⁻¹ 꼴 조건으로 식의 값', '①17', (d, n) => {
      if (n === 0) {
        const m = d.pick([1, 2]), k = d.int(3, 7);
        const g = m === 1 ? ms('a + a^{-1}') : ms('a^2 + a^{-2}'), s2 = m === 1 ? ms('a^2 + a^{-2}') : ms('a^4 + a^{-4}'), s3 = m === 1 ? ms('a^3 + a^{-3}') : ms('a^6 + a^{-6}');
        return M(`${eq(g, k)}일 때, 다음 두 식의 값을 차례로 구하시오. (단, ${va} ≠ 0)`, [{ answer: k * k - 2, lead: s2 + ' =' }, { answer: k * k * k - 3 * k, lead: s3 + ' =' }], {
          shown: `${eq(s2, k * k - 2)}, ${eq(s3, k * k * k - 3 * k)}`,
          explain: `${eq(s2, '(' + g + ')' + sup(2) + ' ' + MINUS + ' 2')} = ${k * k - 2}, ${eq(s3, '(' + g + ')' + sup(3) + ' ' + MINUS + ' 3(' + g + ')')} = ${k * k * k - 3 * k}이다.`,
          facts: { calc: [[`${k}*${k}-2`, 0], [`${k}*${k}*${k}-3*${k}`, 1]], derived: [2, 3] }
        });
      }
      const plus = d.bool(), k = d.int(3, 30), w = plus ? k + 2 : k - 2, [c, t] = nParts(w, 2);
      if (t === 1) return null;
      const ask = plus ? ms('a + a^{-1}') : ms('a - a^{-1}');
      return rootAns(`${plus ? va + ' &gt; 0' : va + ' &gt; 1'}이고 ${eq(ms('a^2 + a^{-2}'), k)}일 때, ${ask}의 값은?`, 2, c, t, {
        explain: `${eq('(' + ask + ')' + sup(2), ms('a^2 + a^{-2}') + (plus ? ' + 2' : ' ' + MINUS + ' 2'))} = ${w}이다. ${plus ? va + ' &gt; 0이면 ' + ask + ' &gt; 0' : va + ' &gt; 1이면 ' + va + ' &gt; ' + ms('a^{-1}') + ', 곧 ' + ask + ' &gt; 0'}이므로 ${eq(ask, R(2, w))}${c === 1 ? '' : ' = ' + c + R(2, t)}이다.`,
        facts: { calc: [[String(c), 0], [String(t), 1]], derived: [c, t] }
      });
    }, { count: 2 })
  ]);

  // ── 유리수·실수인 지수 ──
  // 유리수 지수 r = p/q 를 검사 식으로
  const jr = (r) => (r.q === 1 ? jn(r.p) : `(${r.p}/${r.q})`);
  // 지수법칙 옳은 것 고르기의 보기: [글, 참인가](값을 수로 셈해 견준다)
  const close = (x, y) => Math.abs(x - y) <= 1e-9 * Math.max(1, Math.abs(x), Math.abs(y));
  B.addTypes(UNIT, 'ratexp', [
    T('rat-to-pow', '거듭제곱근을 유리수인 지수로', '①19', (d) => {
      const deg = d.pick([2, 3, 4, 5, 6, 7]), m = d.int(1, 9) * d.pick([1, -1]), inv = d.bool();
      if (m % deg === 0 || Math.abs(m) === deg) return null;
      const inner = Math.abs(m) === 1 && m > 0 ? va : aP(m), h = inv ? frac(1, R(deg, inner)) : R(deg, inner), r = Q(inv ? -m : m, deg);
      return qAns(`다음을 ${aP(V('r'))} 꼴로 나타낼 때, 유리수 ${V('r')}의 값은? (단, ${va} &gt; 0)`, r, {
        signed: true, figure: ex1(h),
        explain: `${eq(R(deg, inner), aP(Q(m, deg)))}이므로 ${inv ? eq(h, aP(qneg(Q(m, deg)))) : eq(h, aP(Q(m, deg)))}이다.`,
        facts: { value: `${inv ? '0-' : ''}${jn(m)}/${deg}`, derived: [deg] }
      });
    }),
    T('rat-to-root', '유리수인 지수를 근호로', '①20', (d) => {
      const b = d.pick([2, 3, 5, 6, 7]), deg = d.pick([3, 4, 5, 7, 9]), m = d.pick([2, 3]), s = d.pick([1, -1]);
      if (gcd(m, deg) !== 1 || ipow(b, m) > 400) return null;
      // 보기의 값(수)으로 정답을 가린다
      const target = Math.pow(b, s * m / deg), opts = [];
      const add = (h, v) => opts.push([h, close(v, target)]);
      const bm = ipow(b, m), sgn = (h) => (s > 0 ? h : frac(1, h)), pos = (v) => (s > 0 ? v : 1 / v);
      add(sgn(R(deg, bm)), pos(Math.pow(bm, 1 / deg)));
      if (ipow(b, deg) <= 5000) add(sgn(R(m, ipow(b, deg))), pos(Math.pow(b, deg / m)));
      add(sgn(R(deg, b * m)), pos(Math.pow(b * m, 1 / deg)));
      add(sgn(R(deg * m, b)), pos(Math.pow(b, 1 / (deg * m))));
      add(s > 0 ? frac(1, R(deg, bm)) : R(deg, bm), Math.pow(bm, (s > 0 ? -1 : 1) / deg));
      if (s < 0) add(MINUS + R(deg, bm), -Math.pow(bm, 1 / deg));
      if (opts.length < 4) return null;
      return choose(d, `${jh(PW(b, Q(s * m, deg)), '을/를')} 근호를 사용하여 나타낸 것은?`, opts, true, {
        explain: `${va} &gt; 0일 때 ${eq(aP(Q(m, deg)), R(deg, aP(m)))}${s < 0 ? ', ' + eq(aP(Q(-m, deg)), frac(1, R(deg, aP(m)))) : ''}이므로 ${eq(PW(b, Q(s * m, deg)), opts[0][0])}이다.`
      });
    }),
    T('rat-val', '유리수인 지수의 값', '①21', (d, n) => {
      const one = (neg) => {
        const r = d.int(2, 5), q = d.pick([2, 3, 4]), p = d.int(1, 4), bse = ipow(r, q), v = ipow(r, p);
        if (gcd(p, q) !== 1 || bse > 1000 || v > 1000) return null;
        const decimal = (q === 2 || q === 4) && d.bool(), e = neg ? -p / q : p / q;
        const eh = decimal ? pw(bse, String(e).replace('-', MINUS)) : PW(bse, Q(neg ? -p : p, q));
        return { h: eh, v, js: `(${bse})**(${decimal ? jn(e) : '(' + (neg ? -p : p) + '/' + q + ')'})`, why: `${eq(eh, PW('(' + PW(r, q) + ')', Q(neg ? -p : p, q)))}` + (p === 1 ? '' : ' = ' + (neg ? frac(1, PW(r, p)) : PW(r, p))) };
      };
      if (n === 0) {
        const a = one(false);
        if (!a) return null;
        if (d.bool()) {
          const b = one(false);
          if (!b || stripH(a.h) === stripH(b.h)) return null;
          return qAns(VAL, a.v + b.v, { figure: ex1(a.h + ' + ' + b.h), explain: `${a.why}, ${b.why}이므로 값은 ${a.v + b.v}이다.`, facts: { value: `${a.js}+${b.js}` } });
        }
        return qAns(VAL, a.v, { figure: ex1(a.h), explain: `${a.why} = ${a.v}이다.`, facts: { value: a.js } });
      }
      if (d.bool()) {
        const b = d.pick([2, 3, 5, 7]), deg = d.pick([3, 4]), k = deg * d.pick([1, 2]);
        if (ipow(b, k / deg) > 100) return null;
        const h = PW('(' + R(deg, b) + ')', -k);
        return qAns(VAL, Q(1, ipow(b, k / deg)), { figure: ex1(h), explain: `${eq(h, PW(b, Q(-k, deg)))} = ${frac(1, ipow(b, k / deg))}이다.`, facts: { value: `(${b})**(${-k}/${deg})`, derived: [deg] } });
      }
      const a = one(true);
      if (!a) return null;
      return qAns(VAL, Q(1, a.v), { figure: ex1(a.h), explain: `${a.why} = ${frac(1, a.v)}이다.`, facts: { value: a.js } });
    }, { count: 2 }),
    T('rat-law-num', '유리수인 지수의 지수법칙(수)', '①22', (d, n) => {
      if (n === 0) {
        if (d.bool()) {
          // 같은 밑 세 거듭제곱의 곱·몫
          const p = d.pick([2, 3, 5, 7]), t = [];
          for (let i = 0; i < 3; i += 1) { const s = d.pick([1, 1, 2]), e = Q(d.int(-5, 7), d.pick([2, 3, 4, 6])); if (e.p === 0 || ipow(p, s) > 50) return null; t.push({ b: ipow(p, s), s, e, op: i === 0 ? '' : d.pick(['×', '÷']) }); }
          let E = Q(0);
          t.forEach((x) => { E = x.op === '÷' ? qsub(E, qmul(Q(x.s), x.e)) : qadd(E, qmul(Q(x.s), x.e)); });
          if (!isInt(E) || E.p < 0 || ipow(p, E.p) > 1000 || t.every((x) => isInt(x.e))) return null;
          const v = ipow(p, E.p);
          return qAns(VAL, v, {
            figure: ex1(t.map((x) => (x.op ? ' ' + x.op + ' ' : '') + PW(x.b, x.e)).join('')),
            explain: `밑을 ${jh(p, '으로/로')} 맞추면 ${t.map((x) => (x.op ? ' ' + x.op + ' ' : '') + PW(p, qmul(Q(x.s), x.e))).join('')} = ${PW(p, E)}${E.p === 1 ? '' : ' = ' + v}이다.`,
            facts: { value: t.map((x) => (x.op === '÷' ? '/' : x.op ? '*' : '') + `(${x.b})**${jr(x.e)}`).join('') }
          });
        }
        // (p^(1/a) × q^(1/b))^L
        const [p, q] = d.shuffle([2, 3, 5]).slice(0, 2), a = d.pick([2, 3, 4]), b = d.pick([2, 3, 4, 6].filter((x) => x !== a)), Lx = lcm(a, b), v = ipow(p, Lx / a) * ipow(q, Lx / b);
        if (v > 2000) return null;
        const h = PW('(' + PW(p, Q(1, a)) + ' × ' + PW(q, Q(1, b)) + ')', Lx);
        return qAns(VAL, v, { figure: ex1(h), explain: `${eq(h, pv(p, Lx / a) + ' × ' + pv(q, Lx / b))} = ${v}이다.`, facts: { value: `((${p})**(1/${a})*(${q})**(1/${b}))**${Lx}` } });
      }
      if (d.bool()) {
        // 2^e1 × 3^e2 × (2^e3 × 3^e4)^(1/2)
        const e = [Q(d.int(-5, 5), 4), Q(d.int(-7, 5), 3), Q(d.int(-3, 7), 2), Q(d.int(-4, 4), 3)], k = d.pick([2, 3]);
        const E2 = qadd(e[0], qdiv(e[2], Q(k))), E3 = qadd(e[1], qdiv(e[3], Q(k)));
        if (e.some((x) => x.p === 0) || !isInt(E2) || !isInt(E3) || (E2.p >= 0 && E3.p >= 0)) return null;
        const top = ipow(2, Math.max(E2.p, 0)) * ipow(3, Math.max(E3.p, 0)), bot = ipow(2, Math.max(-E2.p, 0)) * ipow(3, Math.max(-E3.p, 0));
        if (top > 50 || bot > 100 || bot === 1) return null;
        const h = `${PW(2, e[0])} × ${PW(3, e[1])} × ${PW('(' + PW(2, e[2]) + ' × ' + PW(3, e[3]) + ')', Q(1, k))}`;
        return qAns(VAL, Q(top, bot), { figure: ex1(h), explain: `밑이 2인 것끼리, 3인 것끼리 지수를 더하면 ${PW(2, E2)} × ${PW(3, E3)} = ${qh(Q(top, bot))}이다.`, facts: { value: `(2)**${jr(e[0])}*(3)**${jr(e[1])}*((2)**${jr(e[2])}*(3)**${jr(e[3])})**(1/${k})` } });
      }
      // {(분수)^e1}^e2
      const [u, w] = d.pick([[3, 2], [2, 3], [5, 3], [3, 5], [2, 5], [5, 2]]), a = d.pick([2, 3]), e1 = Q(d.pick([-4, -2, 2, 4, -3, 3]), d.pick([3, 9, 6, 4])), e2 = Q(d.pick([3, 2, -3, -1]), 2);
      const E = qmul(qmul(Q(a), e1), e2);
      if (!isInt(E) || E.p === 0 || Math.abs(E.p) > 3 || isInt(e1)) return null;
      const bb = '(' + frac(ipow(u, a), ipow(w, a)) + ')', h = PW('{' + PW(bb, e1) + '}', e2), v = E.p > 0 ? Q(ipow(u, E.p), ipow(w, E.p)) : Q(ipow(w, -E.p), ipow(u, -E.p));
      if (isInt(v)) return null;
      return qAns(VAL, v, { figure: ex1(h), explain: `${eq(bb, PW('(' + frac(u, w) + ')', a))}이므로 ${eq(h, PW('(' + frac(u, w) + ')', E))} = ${qh(v)}이다.`, facts: { value: `((${ipow(u, a)}/${ipow(w, a)})**${jr(e1)})**${jr(e2)}` } });
    }, { count: 2 }),
    T('rat-law-sym', '유리수인 지수의 지수법칙(문자식)', '①23', (d, n) => {
      if (n === 0) {
        if (d.bool()) {
          const t = [0, 1, 2].map((i) => ({ e: Q(d.int(-7, 7), d.pick([2, 3, 4, 6])), op: i === 0 ? '' : d.pick(['×', '÷']) }));
          let E = Q(0);
          t.forEach((x) => { E = x.op === '÷' ? qsub(E, x.e) : qadd(E, x.e); });
          if (t.some((x) => x.e.p === 0 || isInt(x.e)) || !isInt(E) || Math.abs(E.p) > 9) return null;
          const Lc = t.reduce((m, x) => lcm(m, x.e.q), 1);
          return qAns(`다음 식을 간단히 하면 ${aP(vk)}이다. 정수 ${vk}의 값은? (단, ${va} &gt; 0)`, E.p, { signed: true, figure: ex1(t.map((x) => (x.op ? ' ' + x.op + ' ' : '') + aP(x.e)).join('')), explain: `지수끼리 셈하면 ${t.map((x, i) => (x.op === '÷' ? ' ' + MINUS + ' ' : x.op ? ' + ' : '') + (i && x.e.p < 0 ? '(' + qh(x.e) + ')' : qh(x.e))).join('')} = ${num(E.p)}이다.`, facts: { calc: [['(' + t.map((x) => (x.op === '÷' ? '-' : x.op ? '+' : '') + `${jn(x.e.p)}*${Lc / x.e.q}`).join('') + `)/${Lc}`, 0]], derived: [Lc].concat(t.map((x) => Lc / x.e.q)) } });
        }
        const t = [0, 1, 2].map((i) => ({ deg: d.pick([2, 3, 4, 6]), u: d.int(1, 9), op: i === 0 ? '' : d.pick(['×', '÷']) }));
        let E = Q(0);
        t.forEach((x) => { const e = Q(x.u, x.deg); E = x.op === '÷' ? qsub(E, e) : qadd(E, e); });
        if (t.some((x) => x.u % x.deg === 0) || !isInt(E) || Math.abs(E.p) > 6) return null;
        const Lc = t.reduce((m, x) => lcm(m, x.deg), 1);
        return qAns(`다음 식을 간단히 하면 ${aP(vk)}이다. 정수 ${vk}의 값은? (단, ${va} &gt; 0)`, E.p, { signed: true, figure: ex1(t.map((x) => (x.op ? ' ' + x.op + ' ' : '') + R(x.deg, x.u === 1 ? va : aP(x.u))).join('')), explain: `${t.map((x) => (x.op ? ' ' + x.op + ' ' : '') + aP(Q(x.u, x.deg))).join('')} = ${aP(E.p)}이므로 ${eq(vk, num(E.p))}이다.`, facts: { calc: [['(' + t.map((x) => (x.op === '÷' ? '-' : x.op ? '+' : '') + `${x.u}*${Lc / x.deg}`).join('') + `)/${Lc}`, 0]], derived: [Lc].concat(t.map((x) => Lc / x.deg), t.map((x) => x.deg)) } });
      }
      if (d.bool()) {
        // (a^p1 b^q1)^r1 × (a^p2 b^q2)^r2
        const fr = () => Q(d.int(-9, 9), d.pick([2, 3, 4, 6])), [p1, q1, p2, q2] = [fr(), fr(), fr(), fr()], r1 = d.pick([2, 3, 4, 6]), r2 = d.pick([2, 3, 4, 6]);
        const m = qadd(qmul(p1, Q(r1)), qmul(p2, Q(r2))), nn = qadd(qmul(q1, Q(r1)), qmul(q2, Q(r2)));
        if ([p1, q1, p2, q2].some((x) => x.p === 0 || isInt(x)) || !isInt(m) || !isInt(nn) || Math.abs(m.p) > 9 || Math.abs(nn.p) > 9) return null;
        const h = PW('(' + aP(p1) + PW(vb, q1) + ')', r1) + ' × ' + PW('(' + aP(p2) + PW(vb, q2) + ')', r2);
        return valsQ(`다음 식을 간단히 하면 ${ms('a^m b^n')}이다. 정수 ${vm}, ${vn}의 값은? (단, ${va} &gt; 0, ${vb} &gt; 0이고, 지수가 0이면 0을 적는다.)`, [[vm, m.p, true], [vn, nn.p, true]], {
          figure: ex1(h), explain: `${eq(h, aP(qmul(p1, Q(r1))) + PW(vb, qmul(q1, Q(r1))) + ' × ' + aP(qmul(p2, Q(r2))) + PW(vb, qmul(q2, Q(r2))))} = ${aP(m.p)}${PW(vb, nn.p)}이다.`,
          facts: { calc: [[`(${p1.p}*${r1}*${p2.q}+${p2.p}*${r2}*${p1.q})/(${p1.q}*${p2.q})`, 0], [`(${q1.p}*${r1}*${q2.q}+${q2.p}*${r2}*${q1.q})/(${q1.q}*${q2.q})`, 1]] }
        });
      }
      // ⁿ√(a^u b^v) ÷ ᵐ√(a^s b^t)
      const n1 = d.pick([2, 3, 4]), n2 = d.pick([2, 3, 4, 6]), u = d.int(1, 9), v = d.int(1, 11), s = d.int(1, 9), t = d.int(1, 11);
      const m = qsub(Q(u, n1), Q(s, n2)), nn = qsub(Q(v, n1), Q(t, n2));
      if (!isInt(m) || !isInt(nn) || n1 === n2 || (u % n1 === 0 && v % n1 === 0) || Math.abs(m.p) > 6 || Math.abs(nn.p) > 6) return null;
      const h = R(n1, aP(u) + PW(vb, v)) + ' ÷ ' + R(n2, aP(s) + PW(vb, t));
      const Lc = lcm(n1, n2);
      return valsQ(`다음 식을 간단히 하면 ${ms('a^m b^n')}이다. 정수 ${vm}, ${vn}의 값은? (단, ${va} &gt; 0, ${vb} &gt; 0이고, 지수가 0이면 0을 적는다.)`, [[vm, m.p, true], [vn, nn.p, true]], {
        figure: ex1(h), explain: `${eq(h, aP(Q(u, n1)) + PW(vb, Q(v, n1)) + ' ÷ ' + aP(Q(s, n2)) + PW(vb, Q(t, n2)))} = ${aP(m.p)}${PW(vb, nn.p)}이다.`,
        facts: { calc: [[`(${u}*${Lc / n1}-${s}*${Lc / n2})/${Lc}`, 0], [`(${v}*${Lc / n1}-${t}*${Lc / n2})/${Lc}`, 1]], derived: [Lc, Lc / n1, Lc / n2] }
      });
    }, { count: 2 }),
    T('rat-nest', '근호가 겹친 식을 a^x 꼴로', '①24', (d, n) => {
      if (n === 0) {
        const r1 = d.pick([2, 3]), r2 = d.pick([2, 3, 4]), k = d.pick([2, 3, 4]), u = d.pick([1, 2]), v = d.int(1, 3);
        if (v % k === 0) return null;
        const x = qdiv(Q(u * k + v, k), Q(r1 * r2));
        if (isInt(x)) return null;
        const inner = (u === 1 ? va : aP(u)) + R(k, v === 1 ? va : aP(v));
        return qAns(`${jh(eq(R(r1, R(r2, inner)), aP(vx)), '을/를')} 만족시키는 유리수 ${vx}의 값은? (단, ${va} &gt; 0, ${va} ≠ 1)`, x, {
          explain: `안쪽부터 지수로 나타내면 ${eq(inner, aP(Q(u * k + v, k)))}이므로 ${eq(R(r1, R(r2, inner)), aP(x))}, ${eq(vx, qh(x))}이다.`,
          facts: { value: `(${u}*${k}+${v})/(${k}*${r1}*${r2})`, derived: [u, k, v, r1, r2] }
        });
      }
      if (n === 1) {
        const m1 = d.pick([3, 5, 7]), p = d.int(1, m1 - 1), n2 = d.pick([2, 3, 4]), j = d.pick([2, 3]);
        if (n2 === m1) return null;
        const kv = qsub(qmul(Q(n2), Q(p, m1)), Q(1, j));
        if (isInt(kv)) return null;
        return qAns(`${jh(eq(R(m1, aP(p)), R(n2, aP(vk) + R(j, va))), '을/를')} 만족시키는 유리수 ${vk}의 값은? (단, ${va} &gt; 0, ${va} ≠ 1)`, kv, {
          signed: true, explain: `${va}의 거듭제곱으로 나타내면 좌변의 지수는 ${frac(p, m1)}, 우변의 지수는 (${vk} + ${frac(1, j)}) ÷ ${n2}이다. ${eq(frac(p, m1), '(' + vk + ' + ' + frac(1, j) + ') ÷ ' + n2)}에서 ${eq(vk, qh(kv))}이다.`,
          facts: { value: `${n2}*${p}/${m1}-1/${j}`, derived: [m1, n2, j] }
        });
      }
      const g = d.pick([2, 3, 5]), terms = [0, 1, 2].map(() => { const [r, s] = d.shuffle([2, 3, 4]).slice(0, 2); return { r, s, m: d.pick([2, 3, 4]) }; });
      const kv = terms.reduce((acc, x) => qadd(acc, qdiv(qsub(Q(1, x.r), Q(1, x.s)), Q(x.m))), Q(0));
      if (isInt(kv)) return null;
      const h = terms.map((x) => R(x.m, frac(R(x.r, g), R(x.s, g)))).join(' × ');
      return qAns(`다음 식을 ${PW(g, vk)} 꼴로 나타낼 때, 유리수 ${vk}의 값은?`, kv, {
        signed: true, figure: ex1(h),
        explain: `각 항을 ${PW(g, ms('x'))} 꼴로 나타내면 ${terms.map((x) => PW(g, qdiv(qsub(Q(1, x.r), Q(1, x.s)), Q(x.m)))).join(', ')}이므로 지수를 모두 더하면 ${eq(vk, qh(kv))}이다.`,
        facts: { value: terms.map((x) => `(1/${x.r}-1/${x.s})/${x.m}`).join('+'), derived: terms.flatMap((x) => [x.r, x.s, x.m]) }
      });
    }, { count: 3 }),
    T('real-exp', '실수인 지수의 계산', '①25 심1', (d, n) => {
      const s = d.pick([2, 3, 5]), b = d.pick([2, 3, 5, 6, 7]);
      if (n === 0) {
        const kind = d.int(0, 3);
        if (kind === 0) {
          const c = d.int(1, 3), dd = d.int(1, 3), v = ipow(b, dd);
          return qAns(VAL, v, { figure: ex1(PW(b, (c === 1 ? '' : c) + R(2, s)) + ' × ' + PW(b, dd + ' ' + MINUS + ' ' + (c === 1 ? '' : c) + R(2, s))), explain: `지수끼리 더하면 ${(c === 1 ? '' : c) + R(2, s)} + (${dd} ${MINUS} ${(c === 1 ? '' : c) + R(2, s)}) = ${dd}이므로 값은 ${dd === 1 ? '' : PW(b, dd) + ' = '}${v}이다.`, facts: { value: `(${b})**(${c}*${s}**0.5)*(${b})**(${dd}-${c}*${s}**0.5)`, derived: [0.5] } });
        }
        if (kind === 1) {
          const d1 = d.int(1, 3), d2 = d.int(0, 2), v = ipow(b, d1 + d2);
          if (v > 2000) return null;
          return qAns(VAL, v, { figure: ex1(PW(b, R(2, s) + ' + ' + d1) + ' ÷ ' + PW(b, R(2, s) + (d2 ? ' ' + MINUS + ' ' + d2 : ''))), explain: `지수끼리 빼면 (${R(2, s)} + ${d1}) ${MINUS} (${R(2, s)}${d2 ? ' ' + MINUS + ' ' + d2 : ''}) = ${d1 + d2}이므로 값은 ${v}이다.`, facts: { value: `(${b})**(${s}**0.5+${d1})/(${b})**(${s}**0.5-${d2})`, derived: [0.5] } });
        }
        if (kind === 2) {
          const v = ipow(b, s);
          if (v > 2000) return null;
          return qAns(VAL, v, { figure: ex1(PW('(' + PW(b, R(2, s)) + ')', R(2, s))), explain: `${eq(PW('(' + PW(b, R(2, s)) + ')', R(2, s)), PW(b, R(2, s) + ' × ' + R(2, s)))} = ${PW(b, s)} = ${v}이다.`, facts: { value: `((${b})**(${s}**0.5))**(${s}**0.5)`, derived: [0.5] } });
        }
        const [b1, b2] = d.shuffle([2, 3, 5]).slice(0, 2), k = d.pick([2, 3]), v = ipow(b1, k) * b2;
        if (v > 2000) return null;
        const h = PW('(' + PW(b1, R(2, k * k * s)) + ' × ' + PW(b2, R(2, s)) + ')', frac(1, R(2, s)));
        return qAns(VAL, v, { figure: ex1(h), explain: `${eq(R(2, k * k * s), k + R(2, s))}이므로 ${eq(h, PW(b1, k) + ' × ' + b2)} = ${v}이다.`, facts: { value: `((${b1})**(${k * k * s}**0.5)*(${b2})**(${s}**0.5))**(1/${s}**0.5)`, derived: [0.5] } });
      }
      if (n === 1) {
        if (d.bool()) {
          const m = d.int(2, 5), k = m - 1;
          return qAns(`다음 식을 ${PW(b, vk + R(2, s))} 꼴로 나타낼 때, 정수 ${vk}의 값은?`, k, { signed: true, figure: ex1(PW(b, R(2, m * m * s)) + ' ÷ ' + PW(b, R(2, s))), explain: `${eq(R(2, m * m * s), m + R(2, s))}이므로 지수는 ${m}${R(2, s)} ${MINUS} ${eq(R(2, s), k + R(2, s))}, ${eq(vk, k)}이다.`, facts: { value: `(${m * m * s}**0.5-${s}**0.5)/${s}**0.5`, derived: [0.5] } });
        }
        const c1 = d.int(1, 3), c2 = d.int(1, 4), k = c2 - 2 * c1;
        if (k === 0) return null;
        return qAns(`다음 식을 ${PW(b, vk + R(2, s))} 꼴로 나타낼 때, 정수 ${vk}의 값은?`, k, { signed: true, figure: ex1(PW(b, MINUS + 2 * c1 + R(2, s)) + ' × ' + PW(b, (c2 === 1 ? '' : c2) + R(2, s))), explain: `지수끼리 더하면 ${MINUS}${2 * c1}${R(2, s)} + ${(c2 === 1 ? '' : c2) + R(2, s)} = ${k === 1 ? '' : k === -1 ? MINUS : num(k)}${R(2, s)}이므로 ${eq(vk, num(k))}이다.`, facts: { value: `${c2}-2*${c1}`, derived: [2, c1, c2] } });
      }
      const s2 = d.pick([2, 3, 5]), b2 = d.pick([2, 3]), v = ipow(b2, s2 - 1);
      if (d.bool()) {
        const h = PW('(' + frac(PW(b2, R(2, s2)), b2) + ')', R(2, s2) + ' + 1');
        return qAns(VAL, v, { figure: ex1(h), explain: `${eq(frac(PW(b2, R(2, s2)), b2), PW(b2, R(2, s2) + ' ' + MINUS + ' 1'))}이고 ${eq('(' + R(2, s2) + ' ' + MINUS + ' 1)(' + R(2, s2) + ' + 1)', s2 - 1)}이므로 값은 ${PW(b2, s2 - 1)} = ${v}이다.`, facts: { value: `((${b2})**(${s2}**0.5)/${b2})**(${s2}**0.5+1)`, derived: [0.5] } });
      }
      const h = PW('(' + PW(b2, R(2, s2) + ' + 1') + ')', R(2, s2) + ' ' + MINUS + ' 1');
      return qAns(VAL, v, { figure: ex1(h), explain: `지수를 곱하면 ${eq('(' + R(2, s2) + ' + 1)(' + R(2, s2) + ' ' + MINUS + ' 1)', s2 - 1)}이므로 값은 ${v}이다.`, facts: { value: `((${b2})**(${s2}**0.5+1))**(${s2}**0.5-1)`, derived: [0.5] } });
    }, { count: 3 }),
    T('law-claim', '지수법칙 가운데 옳은 것', '①26', (d) => {
      const p = d.pick([2, 3, 5]), q = d.pick([2, 3, 5, 7].filter((x) => x !== p)), lp = Math.log(p), lq = Math.log(q);
      // 보기: [글, 좌변의 로그, 우변의 로그]
      const builders = [
        () => { const ok = d.bool(); return [eq(R(2, R(2, R(2, p))), PW(p, Q(1, ok ? 8 : 6))), lp / 8, lp / (ok ? 8 : 6)]; },
        () => { const ok = d.bool(); return [eq(R(2, p) + ' × ' + R(3, p), R(6, ok ? ipow(p, 5) : p)), lp * 5 / 6, (ok ? 5 : 1) * lp / 6]; },
        () => { const ok = d.bool(); return [eq(PW(p, 2 + R(2, 2)) + ' ÷ ' + PW(p, R(2, 2)), ok ? PW(p, R(2, 2)) : PW(p, 2)), lp * Math.SQRT2, ok ? lp * Math.SQRT2 : 2 * lp]; },
        () => { const ok = d.bool(); return [eq(PW(p, -3) + ' × ' + PW(q, -6), ok ? PW('(' + p + ' × ' + PW(q, 2) + ')', -3) : PW('(' + p + ' × ' + q + ')', -9)), -3 * lp - 6 * lq, ok ? -3 * (lp + 2 * lq) : -9 * (lp + lq)]; },
        () => { const ok = d.bool(); return [eq(PW(p, Q(2, 3)) + ' × ' + PW(p, Q(1, 2)) + ' ÷ ' + PW(p, Q(7, 6)), ok ? '1' : String(p)), 0, ok ? 0 : lp]; },
        () => { const ok = d.bool(), a = d.pick([1, 3, 5]), c = 4 * d.int(1, 2); return [eq(PW('(' + PW(p, Q(a, 4)) + ')', c), ok ? PW(p, a * c / 4) : PW(p, qadd(Q(a, 4), Q(c)))), lp * a * c / 4, ok ? lp * a * c / 4 : lp * (a / 4 + c)]; }
      ];
      const rows = d.shuffle(builders).slice(0, 5).map((f) => { const [h, l, r] = f(); return [h, close(l, r)]; });
      if (rows.filter((r) => r[1]).length !== 1) return null;
      return choose(d, '다음 가운데 옳은 것은?', rows, true, {
        explain: '양변을 같은 밑의 거듭제곱으로 나타내어 지수법칙 ' + ms('a^x a^y = a^{x+y}') + ', ' + ms('(a^x)^y = a^{xy}') + ', ' + ms('(ab)^x = a^x b^x') + '에 따라 비교하면 옳은 것은 ' + rows.find((r) => r[1])[0] + '뿐이다.'
      });
    })
  ]);

  // ── 지수법칙의 활용(조건식) ──
  B.addTypes(UNIT, 'expuse', [
    T('cond-sub', '지수 조건에서 다른 지수식의 값', '①29', (d, n) => {
      if (n === 0) {
        const c = d.pick([2, 3]), i = d.pick([1, 2]), v = d.pick([3, 5, 7].filter((x) => x !== c)), k = d.int(i, i + 2), ans = ipow(c, k - i) * v;
        if (ans > 500) return null;
        const g = Q(ipow(c, 2 * i), v * v);
        return qAns(`실수 ${va}에 대하여 ${eq(PW(c * c, va), qh(g))}일 때, ${PW(c, ms(k + ' - a'))}의 값은?`, ans, {
          explain: `${eq(PW(c * c, va), PW('(' + PW(c, va) + ')', 2))}이고 ${PW(c, va)} &gt; 0이므로 ${eq(PW(c, va), qh(Q(ipow(c, i), v)))}이다. ${eq(PW(c, ms(k + ' - a')), PW(c, k) + ' ÷ ' + PW(c, va))} = ${ipow(c, k)} × ${qh(Q(v, ipow(c, i)))} = ${ans}이다.`,
          facts: { value: `(${c})**${k}/((${ipow(c, 2 * i)}/${v * v})**(1/2))`, derived: [2] }
        });
      }
      if (n === 1) {
        const c = d.pick([2, 3]), m = d.pick([3, 5, 7, 6].filter((x) => x % c !== 0)), t = d.int(2, 9), Nv = t * m * m, c3 = c * c * c;
        if (Nv > 2000) return null;
        return qAns(`두 실수 ${va}, ${vb}에 대하여 ${eq(PW(c, va), m)}, ${eq(PW(c3, ms('a+b')), Nv)}일 때, ${PW(c, ms('a+3b'))}의 값은?`, t, {
          explain: `${eq(PW(c3, ms('a+b')), PW(c, ms('3a+3b')))} = ${Nv}이고 ${eq(PW(c, ms('a+3b')), PW(c, ms('3a+3b')) + ' ÷ ' + PW('(' + PW(c, va) + ')', 2))} = ${Nv} ÷ ${m * m} = ${t}이다.`,
          facts: { value: `${Nv}/(${m}*${m})` }
        });
      }
      if (n === 2) {
        const c = d.pick([2, 3, 5]), p = d.pick([1, 2, 3]), q = d.pick([1, 2]), inv = d.bool();
        // (1/c)^(pa − qb) = y^q / x^p   또는   c^(pa − qb) = x^p / y^q
        const mono = (ex, ey) => { const top = [ex > 0 ? (ex === 1 ? vx : PW(vx, ex)) : '', ey > 0 ? (ey === 1 ? vy : PW(vy, ey)) : ''].join(''), bot = [ex < 0 ? (ex === -1 ? vx : PW(vx, -ex)) : '', ey < 0 ? (ey === -1 ? vy : PW(vy, -ey)) : ''].join(''); return bot ? frac(top || '1', bot) : top; };
        const want = inv ? [-p, q] : [p, -q];
        const cands = [want, [-want[0], -want[1]], [want[0], -want[1]], [-want[0], want[1]]];
        const rows = cands.map((e) => [mono(e[0], e[1]), e[0] === want[0] && e[1] === want[1]]);
        rows.push([`${p === 1 ? '' : p}${vx} ${MINUS} ${q === 1 ? '' : q}${vy}`, false]);
        const base = inv ? '(' + frac(1, c) + ')' : String(c), ea = ms((p === 1 ? '' : p) + 'a - ' + (q === 1 ? '' : q) + 'b');
        return choose(d, `${eq(PW(c, va), vx)}, ${eq(PW(c, vb), vy)}일 때, ${jh(PW(base, ea), '을/를')} ${vx}, ${jh(vy, '으로/로')} 나타낸 것은?`, rows, true, {
          explain: `${eq(PW(base, ea), PW(c, inv ? ms((q === 1 ? '' : q) + 'b - ' + (p === 1 ? '' : p) + 'a') : ea))} = ${rows.find((r) => r[1])[0]}이다.`
        });
      }
      // 지수함수 그래프: f(x) = a^x, f(x1) = p, f(x2) = q, f(k) = q^i / p^j
      const x1 = d.int(1, 3), x2 = d.int(x1 + 2, 6), i = d.pick([1, 2, 3]), j = d.pick([1, 2, 3, 4]), k = x2 * i - x1 * j, a0 = 1.45;
      if (k === 0 || k === x1 || k === x2 || Math.abs(k) > 15) return null;
      const fig = plot({ x: [-0.8, x2 + 1], y: [-0.8, Math.pow(a0, x2) + 1.2], ys: 0.55, xt: [x1, x2], curves: [{ f: (x) => Math.pow(a0, x), name: 'y=f(x)' }], dots: [{ x: x1, y: Math.pow(a0, x1), guide: true, yl: 'p', said: `x좌표 ${x1}, y좌표 p` }, { x: x2, y: Math.pow(a0, x2), guide: true, yl: 'q', said: `x좌표 ${x2}, y좌표 q` }] });
      const rhs = frac(pv(V('q'), i), pv(V('p'), j));
      return qAns(`함수 ${eq(ms('f(x)'), ms('a^x'))}(${va} &gt; 1)의 그래프가 그림과 같다. ${eq(ms('f(' + x1 + ')'), V('p'))}, ${eq(ms('f(' + x2 + ')'), V('q'))}일 때, ${jh(eq(ms('f(k)'), rhs), '을/를')} 만족시키는 실수 ${vk}의 값은?`, k, {
        signed: true, figure: fig,
        explain: `${eq(V('p'), PW(va, x1))}, ${eq(V('q'), PW(va, x2))}이므로 ${eq(rhs, frac(PW(va, x2 * i), PW(va, x1 * j)))} = ${PW(va, k)}이다. 따라서 ${eq(vk, num(k))}이다.`,
        facts: { calc: [[`${x2}*${i}-${x1}*${j}`, 0]], derived: [i, j] }
      });
    }, { count: 4 }),
    T('cond-factor', '공통인수로 묶어 지수의 값 구하기', '①30', (d) => {
      const b = d.pick([2, 3, 5, 7]), A = d.int(2, 9), w = d.int(1, 3), Bv = b * w;
      if (A % b === 0 || gcd(A, Bv) !== 1 || A === Bv) return null;
      const s1 = (b - 1) * A, s2 = (b - 1) * w;
      return qAns(`두 실수 ${vx}, ${vy}에 대하여 ${eq(PW(b, ms('x+1')) + ' ' + MINUS + ' ' + PW(b, vx), s1)}, ${eq(PW(b, vy) + ' ' + MINUS + ' ' + PW(b, ms('y-1')), s2)}일 때, ${PW(b, ms('x-y'))}의 값은?`, Q(A, Bv), {
        explain: `${b === 2 ? eq(PW(b, ms('x+1')) + ' ' + MINUS + ' ' + PW(b, vx), PW(b, vx)) + '이므로' : eq(PW(b, ms('x+1')) + ' ' + MINUS + ' ' + PW(b, vx), (b - 1) + PW(b, vx)) + ' = ' + s1 + '에서'} ${eq(PW(b, vx), A)}, ${eq(PW(b, vy) + ' ' + MINUS + ' ' + PW(b, ms('y-1')), frac(b - 1, b) + ' × ' + PW(b, vy))} = ${s2}에서 ${eq(PW(b, vy), Bv)}이다. 따라서 ${eq(PW(b, ms('x-y')), frac(PW(b, vx), PW(b, vy)))} = ${frac(A, Bv)}이다.`,
        facts: { value: `(${s1}/(${b}-1))/(${b}*${s2}/(${b}-1))` }
      });
    }),
    T('cond-vieta-exp', '근과 계수의 관계와 지수법칙', '①31', (d) => {
      const c = d.pick([2, 3, 5]), k = d.pick([1, 2, 3]), m = d.int(1, 5), p = k * m, v = ipow(c, k);
      if (v > 200) return null;
      const al = 'α', be = 'β';
      return qAns(`이차방정식 ${eq(ms('x^2') + ' + ' + p + vx + ' ' + MINUS + ' ' + m, '0')}의 두 근을 ${V(al)}, ${V(be)}라 할 때, ${PW(c, frac(1, V(al)))} × ${PW(c, frac(1, V(be)))}의 값은?`, v, {
        explain: `근과 계수의 관계에서 ${eq(V(al) + ' + ' + V(be), num(-p))}, ${eq(V(al) + V(be), num(-m))}이다. ${eq(frac(1, V(al)) + ' + ' + frac(1, V(be)), frac(V(al) + ' + ' + V(be), V(al) + V(be)))} = ${k}이므로 값은 ${k === 1 ? '' : PW(c, k) + ' = '}${v}이다.`,
        facts: { value: `(${c})**((0-${p})/(0-${m}))` }
      });
    }),
    T('cond-frac-fwd', 'a^(2x) = k 일 때 분수식의 값', '①32', (d) => {
      const k = d.int(2, 6), f = d.int(0, 3), ax = 'a^x', am = 'a^{-x}', a3 = 'a^{3x}', a3m = 'a^{-3x}';
      const forms = [
        [frac(ms(ax + ' - ' + am), ms(a3 + ' + ' + a3m)), Q(k * (k - 1), k * k * k + 1), `(${k}**0.5-${k}**(-0.5))/(${k}**1.5+${k}**(-1.5))`],
        [frac(ms(a3 + ' + ' + a3m), ms(ax + ' + ' + am)), Q(k * k - k + 1, k), `(${k}**1.5+${k}**(-1.5))/(${k}**0.5+${k}**(-0.5))`],
        [frac(ms(a3 + ' - ' + a3m), ms(ax + ' - ' + am)), Q(k * k + k + 1, k), `(${k}**1.5-${k}**(-1.5))/(${k}**0.5-${k}**(-0.5))`],
        [frac(ms(ax + ' + ' + am), ms(ax + ' - ' + am)), Q(k + 1, k - 1), `(${k}**0.5+${k}**(-0.5))/(${k}**0.5-${k}**(-0.5))`]
      ];
      const [h, v, js] = forms[f];
      if (isInt(v)) return null;
      return qAns(`${eq(ms('a^{2x}'), k)}일 때, 다음 식의 값은? (단, ${va} &gt; 0)`, v, {
        figure: ex1(h),
        explain: `분모와 분자에 ${jh(f === 1 || f === 2 ? ms('a^{3x}') : ms('a^x'), '을/를')} 곱하여 ${ms('a^{2x}')}만으로 나타낸 뒤 ${jh(eq(ms('a^{2x}'), k), '을/를')} 넣으면 ${qh(v)}이다.`,
        facts: { value: js, derived: [0.5, 1.5] }
      });
    }),
    T('cond-frac-back', '분수식의 값에서 c^(2a) + c^(−2a)', '①33', (d) => {
      const c = d.pick([2, 3]), m = d.int(2, 7), r = Q(m - 1, m + 1), c2 = c * c;
      const h = frac(PW(c, va) + ' ' + MINUS + ' ' + PW(c, ms('-a')), PW(c, va) + ' + ' + PW(c, ms('-a')));
      return qAns(`실수 ${va}에 대하여 ${eq(h, qh(r))}일 때, ${PW(c2, va) + ' + ' + PW(c2, ms('-a'))}의 값은?`, Q(m * m + 1, m), {
        explain: `분모와 분자에 ${jh(PW(c, va), '을/를')} 곱하면 ${eq(frac(PW(c2, va) + ' ' + MINUS + ' 1', PW(c2, va) + ' + 1'), qh(r))}이므로 ${eq(PW(c2, va), m)}이다. 따라서 ${eq(PW(c2, va) + ' + ' + PW(c2, ms('-a')), m + ' + ' + frac(1, m))} = ${qh(Q(m * m + 1, m))}이다.`,
        facts: { value: `((1+${r.p}/${r.q})/(1-${r.p}/${r.q}))+1/((1+${r.p}/${r.q})/(1-${r.p}/${r.q}))` }
      });
    }),
    T('cond-half', 'a^(1/2) ± a^(−1/2) 조건에서 a + a⁻¹', '①34', (d) => {
      const plus = d.bool(), k = plus ? d.int(5, 20) : d.int(2, 20);
      if (iroot(k, 2) !== null) return null;
      const g = PW(va, Q(1, 2)) + (plus ? ' + ' : ' ' + MINUS + ' ') + PW(va, Q(-1, 2)), v = plus ? k - 2 : k + 2;
      return qAns(`${eq(g, R(2, k))}일 때, ${ms('a + a^{-1}')}의 값은? (단, ${va} &gt; 1)`, v, {
        explain: `양변을 제곱하면 ${eq(ms('a') + (plus ? ' + 2 + ' : ' ' + MINUS + ' 2 + ') + ms('a^{-1}'), k)}이므로 ${eq(ms('a + a^{-1}'), v)}이다.`,
        facts: { value: `${k}${plus ? '-' : '+'}2`, derived: [2] }
      });
    }),
    T('cond-cube', 'x = p^(1/3) ∓ p^(−1/3) 에서 식의 값', '①35', (d) => {
      const p = d.pick([2, 3, 5, 7]), minus = d.bool();
      const xh = PW(p, Q(1, 3)) + (minus ? ' ' + MINUS + ' ' : ' + ') + PW(p, Q(-1, 3)), ask = minus ? ms('x^3 + 3x') : ms('x^3 - 3x'), v = minus ? Q(p * p - 1, p) : Q(p * p + 1, p);
      return qAns(`${eq(vx, xh)}일 때, ${ask}의 값은?`, v, {
        explain: `${eq(ms('x^3'), p + (minus ? ' ' + MINUS + ' ' : ' + ') + frac(1, p) + (minus ? ' ' + MINUS + ' 3' : ' + 3') + vx)}이므로 ${eq(ask, qh(v))}이다.`,
        facts: { value: `${p}${minus ? '-' : '+'}1/${p}` }
      });
    }),
    T('cond-mulform', '곱셈 공식과 유리수인 지수', '①36', (d, n) => {
      if (n === 0) {
        const p = d.pick([2, 3, 5, 7]), q = d.pick([2, 3, 5].filter((x) => x !== p));
        const h = `(${PW(p, Q(1, 4))} ${MINUS} ${PW(q, Q(-1, 4))})(${PW(p, Q(1, 4))} + ${PW(q, Q(-1, 4))})(${PW(p, Q(1, 2))} + ${PW(q, Q(-1, 2))})`;
        return qAns(VAL, Q(p * q - 1, q), { figure: ex1(h), explain: `합차 공식을 두 번 쓰면 ${eq('(' + PW(p, Q(1, 2)) + ' ' + MINUS + ' ' + PW(q, Q(-1, 2)) + ')(' + PW(p, Q(1, 2)) + ' + ' + PW(q, Q(-1, 2)) + ')', p + ' ' + MINUS + ' ' + frac(1, q))} = ${qh(Q(p * q - 1, q))}이다.`, facts: { value: `${p}-1/${q}` } });
      }
      const kind = d.int(0, 2);
      const h = [`(${PW(vx, Q(1, 2))} + ${PW(vy, Q(1, 2))})(${PW(vx, Q(1, 2))} ${MINUS} ${PW(vy, Q(1, 2))})`,
        `(${PW(vx, Q(1, 3))} + ${PW(vy, Q(1, 3))})(${PW(vx, Q(2, 3))} ${MINUS} ${PW(vx, Q(1, 3))}${PW(vy, Q(1, 3))} + ${PW(vy, Q(2, 3))})`,
        `(${PW(vx, Q(1, 3))} ${MINUS} ${PW(vy, Q(1, 3))})(${PW(vx, Q(2, 3))} + ${PW(vx, Q(1, 3))}${PW(vy, Q(1, 3))} + ${PW(vy, Q(2, 3))})`][kind];
      const right = kind === 1 ? 'x + y' : 'x - y';
      const rows = ['x + y', 'x - y', 'x^2 + y^2', 'x^2 - y^2', 'x^3 + y^3'].map((t) => [ms(t), t === right]);
      return choose(d, `다음 식을 간단히 한 것은? (단, ${vx} &gt; 0, ${vy} &gt; 0)`, rows, true, { figure: ex1(h), explain: `${kind === 0 ? '합차 공식' : '세제곱의 곱셈 공식'}에서 ${PW(vx, Q(1, kind ? 3 : 2))}, ${jh(PW(vy, Q(1, kind ? 3 : 2)), '을/를')} 한 문자로 보면 값은 ${ms(right)}이다.` });
    }, { count: 2 }),
    T('cond-same-base', 'a^x = b^y = c^z 꼴 조건', '①37', (d, n) => {
      if (n === 0) {
        const g = d.pick([2, 3, 5]), s = d.int(3, 6), Kv = ipow(g, s), u = d.int(1, s - 1);
        if (Kv > 1000) return null;
        const r = Q(u, s);
        return qAns(`세 양수 ${va}, ${vb}, ${jh(vc, '과/와')} 0이 아닌 세 실수 ${vx}, ${vy}, ${jh(V('z'), '이/가')} ${eq(ms('a^x'), ms('b^y'))} = ${eq(ms('c^z'), Kv)}, ${jh(eq(frac(1, vx) + ' + ' + frac(1, vy) + ' + ' + frac(1, V('z')), qh(r)), '을/를')} 만족시킬 때, ${va}${vb}${vc}의 값은?`, ipow(g, u), {
          explain: `${eq(va, PW(Kv, frac(1, vx)))}, ${eq(vb, PW(Kv, frac(1, vy)))}, ${eq(vc, PW(Kv, frac(1, V('z'))))}이므로 ${eq(va + vb + vc, PW(Kv, frac(1, vx) + ' + ' + frac(1, vy) + ' + ' + frac(1, V('z'))))} = ${PW(Kv, r)} = ${PW('(' + PW(g, s) + ')', r)} = ${ipow(g, u)}이다.`,
          facts: { value: `(${Kv})**(${r.p}/${r.q})` }
        });
      }
      const [P0, Q0, w] = d.pick([[40, 250, 4], [16, 625, 4], [80, 125, 4], [20, 500, 4], [4, 25, 2], [8, 125, 3], [40, 25, 3], [2, 50, 2]]), t = d.pick([2, 3]);
      if (w % t === 0) return null;
      const T0 = ipow(10, t);
      return qAns(`두 실수 ${va}, ${jh(vb, '이/가')} ${eq(PW(P0, frac(1, va)), T0)}, ${jh(eq(PW(Q0, frac(1, vb)), T0), '을/를')} 만족시킬 때, ${va} + ${vb}의 값은?`, Q(w, t), {
        explain: `${eq(P0, PW(10, ms(t + 'a')))}, ${eq(Q0, PW(10, ms(t + 'b')))}이므로 두 식을 곱하면 ${eq(P0 * Q0, PW(10, ms(t + '(a + b)')))}, ${eq(PW(10, w), PW(10, ms(t + '(a + b)')))}이다. 따라서 ${eq(va + ' + ' + vb, frac(w, t))}이다.`,
        facts: { value: `${w}/${t}`, derived: [w, t] }
      });
    }, { count: 2 }),
    T('cond-natural-min', '거듭제곱이 자연수가 되는 가장 작은 n', '①38', (d) => {
      const ps = d.shuffle([2, 3, 5, 7]).slice(0, 3), es = [d.int(2, 5), d.int(2, 6), d.int(2, 4)], Lv = es.reduce((m, e) => lcm(m, e), 1);
      if (new Set(es).size < 2) return null;
      return qAns(`세 양수 ${va}, ${vb}, ${vc}에 대하여 ${eq(PW(va, es[0]), ps[0])}, ${eq(PW(vb, es[1]), ps[1])}, ${eq(PW(vc, es[2]), ps[2])}일 때, ${jh(PW('(' + va + vb + vc + ')', vn), '이/가')} 자연수가 되도록 하는 자연수 ${vn}의 최솟값은?`, Lv, {
        explain: `${eq(va + vb + vc, PW(ps[0], Q(1, es[0])) + ' × ' + PW(ps[1], Q(1, es[1])) + ' × ' + PW(ps[2], Q(1, es[2])))}이므로 ${jh(PW('(' + va + vb + vc + ')', vn), '이/가')} 자연수이려면 ${jh(vn, '이/가')} ${es.join(', ')}의 공배수여야 한다. 최솟값은 최소공배수 ${Lv}이다.`,
        facts: { value: String(Lv), derived: [Lv] }
      });
    }),
    T('exp-life', '지수 꼴 공식으로 두 경우의 비 구하기', '①40', (d) => {
      const kind = d.int(0, 2);
      if (kind === 0) {
        const deg = d.pick([3, 4]), d1 = d.int(2, 9), d2 = d1 + deg * d.int(1, 3), v = ipow(2, (d2 - d1) / deg);
        return qAns(`어느 호수에서 수면에서의 빛의 세기가 ${V('A')} W/m²일 때, 수심이 ${vk} m인 곳에서의 빛의 세기는 ${frac(V('A'), R(deg, PW(2, vk)))} W/m²이라 한다. 이 호수에서 수심이 ${d1} m인 곳에서의 빛의 세기는 수심이 ${d2} m인 곳에서의 빛의 세기의 몇 배인가?`, v, {
          unit: '배', explain: `${eq(frac(V('A'), R(deg, PW(2, d1))) + ' ÷ ' + frac(V('A'), R(deg, PW(2, d2))), PW(2, Q(d2 - d1, deg)))}${(d2 - d1) / deg === 1 ? '' : ' = ' + v}이므로 ${v}배이다.`,
          facts: { value: `2**((${d2}-${d1})/${deg})`, derived: [deg] }
        });
      }
      if (kind === 1) {
        const c = d.int(10, 30), r = d.int(2, 4), n2 = d.int(2, 8), n1 = n2 * r * r;
        if (n1 > 100) return null;
        return qAns(`어느 전자레인지로 냉동 만두 ${vn}개를 데우는 데 ${c}${PW(vn, Q(1, 2))}초가 걸린다고 한다. 냉동 만두 ${n1}개를 데우는 데 걸리는 시간은 냉동 만두 ${n2}개를 데우는 데 걸리는 시간의 몇 배인가?`, r, {
          unit: '배', explain: `${eq(frac(c + ' × ' + PW(n1, Q(1, 2)), c + ' × ' + PW(n2, Q(1, 2))), PW('(' + frac(n1, n2) + ')', Q(1, 2)))} = ${PW(r * r, Q(1, 2))} = ${r}이므로 ${r}배이다.`,
          facts: { value: `(${n1}/${n2})**(1/2)` }
        });
      }
      const cq = d.int(2, 5), j = d.int(1, 2), v = cq * ipow(10, j);
      return qAns(`필름의 사진 농도가 ${V('P')}, 들어가는 빛의 세기가 ${V('Q')}일 때, 필름을 지나온 빛의 세기 ${jh(V('R'), '은/는')} ${eq(V('R'), V('Q') + ' × ' + PW(10, MINUS + V('P')))}이라 한다. 두 필름 A, B의 사진 농도가 각각 ${V('p')}, ${V('p')} + ${j}이고, 필름 A에 들어가는 빛의 세기가 필름 B에 들어가는 빛의 세기의 ${cq}배일 때, A를 지나온 빛의 세기는 B를 지나온 빛의 세기의 몇 배인가?`, v, {
        unit: '배', explain: `${eq(frac(ms('R_A'), ms('R_B')), frac(cq + ms('Q_B') + ' × ' + PW(10, ms('-p')), ms('Q_B') + ' × ' + PW(10, ms('-p-' + j))))} = ${cq} × ${PW(10, j)} = ${v}이므로 ${v}배이다.`,
        facts: { value: `${cq}*10**${j}`, derived: [10] }
      });
    }),
    T('exp-scale', '평균율과 거듭제곱근', '①41', (d) => {
      const k = d.pick([13, 25, 37, 61, 73]), v = 440 * Math.pow(2, (k - 49) / 12);
      return qAns(`평균율은 한 옥타브가 12개의 반음으로 이루어지고, 이웃한 반음 사이의 진동수의 비가 일정하며, 한 옥타브 높아지면 진동수가 2배가 되는 음계이다. 건반이 88개인 어느 피아노에서 음이 반음 높아지면 진동수가 ${va}배가 되고, ${vn}번째 건반을 누르면 나오는 음의 진동수가 440${PW(va, ms('n-49'))} Hz라 할 때, ${k}번째 건반의 진동수는?`, v, {
        unit: 'Hz', explain: `${eq(PW(va, 12), 2)}이므로 ${eq(va, R(12, 2))}이다. ${k}번째 건반의 진동수는 440${PW(va, k - 49)} = 440 × ${PW(2, Q(k - 49, 12))} = ${v} Hz이다.`,
        facts: { value: `440*2**((${k}-49)/12)` }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
