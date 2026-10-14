// 5학년 1학기 4단원 약분과 통분 — 분모가 다른 분수의 크기 비교, 분수와 소수의 크기 비교, 실력 문항.
// 단원 틀과 싣는 기준, 뺀 것과 까닭은 5-1-4a.js 에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2, ③n = 기본꼴_3, 심n = 심화꼴.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 ①의 장치는 이 잘못을 가진 아이가 걸리게 만들었다)
//  - 분모와 분자에 같은 수를 더하거나 빼도 크기가 같다고 여긴다(3/4 = 5/6).
//  - 분수가 같으면 나타내는 양도 같다고 여긴다(전체의 크기가 다른 것을 보지 않는다).
//  - 약분을 한 번 하면 기약분수라고 여기거나(12/18 = 6/9), 분모와 분자가 모두 홀수이면 기약분수라고 여긴다(15/21, 9/15). 기약분수는 분자가 1인 분수라고 여긴다.
//  - 약분하면 분수가 작아진다고(분모와 분자가 큰 분수가 더 크다고) 여긴다.
//  - 통분할 때 분모만 바꾸고 분자는 그대로 두거나, 분자에 곱하는 수를 서로 바꾼다. 통분하기 전의 분수를 물으면 무조건 기약분수로 약분한다.
//  - 공통분모가 다른 통분 결과의 분자끼리 비교한다.
//  - 분수 2/5 를 소수 0.2 나 0.25 로 읽는다(숫자를 그대로 옮긴다).
//  - 「보다 큰」「보다 작은」에 같은 수를 넣는다. 걸린 시간처럼 작을수록 빠른 것을 큰 쪽으로 답한다.
//
// 분수를 소수로 고치는 것은 분모를 10, 100, 1000으로 고칠 수 있는 분수(분모 2, 4, 5, 8, 20, 25, 40, 50)뿐이다. 분모가 3·6·7·9·12·15인 분수와 소수는
// 소수를 분수로 고쳐 통분하는 길로만 풀리게 내고 풀이도 그렇게 썼다(나눗셈으로 몫을 소수로 구하는 것은 6학년).
// 소수 답은 소수 첫째 자리까지만 칸에 받는다(검사가 이 단원의 소수 답을 한 자리로 본다). 소수 둘째·셋째 자리가 답인 유형(분모 4·20·25·50·8·40·125)은 고르기로 냈다.
//
// 실력에는 ① 문제의 상황·그림·수에 함정이 있어 뜻을 정확히 대야 풀리는 문제와 ② 두 번 넘게 생각해야 풀리는 문제(□의 범위, 두 수 사이의 분수,
// 거꾸로 구하기, 분수·대분수·소수가 섞인 차례, 여러 단계 문장제)만 실었다. 기본에서 하는 계산을 고르기로 바꾼 것은 싣지 않았다.
// 묻는 말: 수나 값은 "~은?/~는?", 양은 "몇 ~인가?".
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, box, frac, mixed, lines, tagged, numbers, table, N, M, C, F, D } = B.kit;
  const EQ = '6수01-06', CMP = '6수01-07', DEC = '6수01-12';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  // 실력 문항. 기본 자료에서만 나온 꼴은 ref 를 '기본 ②52' 처럼 적는다.
  // 실력 묶음의 성취기준은 크기가 같은 분수·약분·통분(6수01-06)이고, 크기 비교와 분수·소수 유형만 아래에서 바꾼다.
  const HARD_STANDARD = {
    'hard-top-trap': CMP, 'hard-box-lcm': CMP, 'hard-box-both': CMP, 'hard-between-count': CMP, 'hard-between-simplest': CMP, 'hard-nearest': CMP,
    'hard-lookalike-order': DEC, 'hard-between-equal': DEC, 'hard-order-four': DEC, 'hard-deci-box': DEC, 'hard-deci-box-both': DEC, 'hard-deci-between': DEC, 'hard-deci-between-mixed': DEC,
    'hard-word-time-order': DEC, 'hard-word-rest': DEC, 'hard-word-minutes': DEC
  };
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: ref.startsWith('기본 ') ? '수집본 기본 자료(' + ref.slice(3) + ')' : '수집본 심화 자료(' + ref + ')', make }, HARD_STANDARD[id] ? { standard: HARD_STANDARD[id] } : {}, more || {});
  const LAB = ['㉠', '㉡', '㉢', '㉣'], THREE = LAB.slice(0, 3), KA = ['가', '나'];
  const SIGNS = ['&gt;', '=', '&lt;'], GT = '&gt;', LT = '&lt;';
  const labelled = (answers) => answers.map((answer, i) => ({ label: LAB[i], answer }));
  const gcd = (x, y) => (y ? gcd(y, x % y) : x), lcm = (x, y) => x / gcd(x, y) * y;
  const divisors = (n) => { const out = []; for (let k = 1; k <= n; k += 1) if (n % k === 0) out.push(k); return out; };
  const primesOf = (n) => [2, 3, 5, 7, 11, 13].filter((p) => n % p === 0);
  const coprimeTo = (n) => primesOf(n).map((p) => `(□%${p})`).join('*');
  const sign = (x, y) => (x > y ? 0 : x === y ? 1 : 2);
  const tail = (n, pair) => josa(n, pair).slice(String(n).length);
  const fj = (n, d, pair) => frac(n, d) + tail(n, pair);
  const SIGN = { '=': '=', '>': '&gt;', '<': '&lt;', '→': '→' };
  const ex = (html) => '<span class="mb-expr">' + html + '</span>';
  const eq = (...parts) => ex(parts.map((p) => (SIGN[p] ? '<i>' + SIGN[p] + '</i>' : p)).join(' '));
  const versus = (left, right) => `<div class="mb-versus">${ex(left)}<span class="mb-ring"></span>${ex(right)}</div>`;
  const duo = (x, y) => `(${x}, ${y})`;
  const blankFrac = (i, j) => frac(box(LAB[i]), box(LAB[j]));
  const arrow = (from, to) => ex(`${from} <i>→</i> ${to}`);

  // ── 수 적기 ──
  // 소수는 정수(10배·100배·1000배 한 수)로 뽑아 셈하고 글에 적을 때만 소수로 적는다. sx(350, 2) → '3.5', sx(48, 2) → '0.48'
  const fx = (n, k) => { const t = String(n).padStart(k + 1, '0'); return k ? t.slice(0, -k) + '.' + t.slice(-k) : t; };
  const sx = (n, k) => { while (k > 0 && n % 10 === 0) { n /= 10; k -= 1; } return fx(n, k); };
  // 수 하나: 값은 top/den. html 은 적는 글, expr 은 검사가 다시 셈하는 식(문제에 적힌 수로만), last 는 토씨를 정하는 마지막에 읽는 수.
  const Fr = (n, den) => ({ top: n, den, html: frac(n, den), expr: `${n}/${den}`, last: n });
  const Mx = (w, n, den) => ({ top: w * den + n, den, html: mixed(w, n, den), expr: `(${w}*${den}+${n})/${den}`, last: n });
  const Dc = (m, k) => { const text = sx(m, k); return { top: m, den: 10 ** k, html: text, expr: text, last: Number(text.slice(-1)), dec: true }; };
  const cmp = (p, q) => p.top * q.den - q.top * p.den;
  const SG = (p, q) => (cmp(p, q) > 0 ? GT : cmp(p, q) === 0 ? '=' : LT);
  const vj = (v, pair) => v.html + tail(v.last, pair);
  const distinct = (vs) => vs.every((p, i) => vs.every((q, j) => i === j || cmp(p, q) !== 0));
  const best = (vs, big) => vs.reduce((hit, v, i) => ((big ? cmp(v, vs[hit]) > 0 : cmp(v, vs[hit]) < 0) ? i : hit), 0);

  // ── 수 고르기 ──
  const reduced = (d, lo, hi, ok) => d.until(() => { const b = d.int(lo, hi); return [d.int(1, b - 1), b]; }, ([a, b]) => gcd(a, b) === 1 && (!ok || ok(a, b)));
  const coTop = (d, den, lo) => d.until(() => d.int(lo || 1, den - 1), (v) => gcd(v, den) === 1);
  const MULTIPLE = [[2, 4], [2, 6], [3, 6], [2, 8], [4, 8], [3, 9], [5, 10], [3, 12], [4, 12], [6, 12], [7, 14], [3, 15], [5, 15], [4, 16], [8, 16], [6, 18], [9, 18], [4, 20], [5, 20], [10, 20], [7, 21], [6, 24], [8, 24], [12, 24]];
  const COPRIME = [[2, 3], [3, 4], [2, 5], [3, 5], [4, 5], [5, 6], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [3, 8], [5, 8], [7, 8], [2, 9], [4, 9], [5, 9], [7, 9], [8, 9], [3, 10], [7, 10]];
  const GENERAL = [[4, 6], [6, 8], [6, 9], [4, 10], [6, 10], [8, 10], [8, 12], [9, 12], [10, 12], [6, 14], [6, 15], [9, 15], [10, 15], [12, 15], [12, 16], [12, 18], [8, 20], [15, 20], [14, 21], [10, 25]];
  const MID = GENERAL.concat(COPRIME).filter(([x, y]) => lcm(x, y) <= 72);
  const twoFracs = (d, list, ok) => d.until(() => { const [b, e] = d.shuffle(d.pick(list)); return [coTop(d, b), b, coTop(d, e), e]; }, ([a, b, c, e]) => a * e !== c * b && (!ok || ok(a, b, c, e)));
  // 크기가 가까운 두 기약분수(같지 않다): 통분해 보아야 크기를 알 수 있다.
  const nearFracs = (d, list, ok) => twoFracs(d, list, (a, b, c, e) => Math.abs(a * e - c * b) <= Math.max(b, e) && !(a === 1 && c === 1) && (!ok || ok(a, b, c, e)));
  // 크기가 가까운 세 기약분수(모두 다르다). 분모 셋은 list 에서 뽑는다.
  const TRIPLES = [[4, 6, 8], [3, 4, 6], [2, 3, 8], [4, 8, 12], [5, 10, 20], [6, 9, 18], [3, 5, 15], [4, 5, 10], [6, 8, 12], [9, 12, 18], [5, 6, 15], [4, 9, 12], [2, 5, 10], [3, 6, 9], [4, 6, 12], [3, 8, 12]];
  const PAIRWISE = [[9, 12, 15], [8, 12, 18], [5, 8, 12], [6, 8, 9], [4, 9, 15], [5, 9, 12], [6, 10, 14], [8, 10, 15]];
  const threeFracs = (d, list) => d.until(() => d.shuffle(d.pick(list)).map((den) => Fr(coTop(d, den), den)), (vs) => distinct(vs) && vs.every((p) => vs.every((q) => Math.abs(cmp(p, q)) * 3 <= p.den * q.den)));
  // 통분한 글: (a/b, c/e) → (x/L, y/L)
  const both = (a, b, c, e) => { const L = lcm(b, e); return `${duo(frac(a, b), frac(c, e))} → ${duo(frac(a * L / b, L), frac(c * L / e, L))}`; };
  // 분모가 4·5·20·25·50인 분수 둘과 소수 하나(백분의 몇으로 셈한 값이 서로 가깝고 모두 다르다): [[분자, 분모, 값], [분자, 분모, 값], 값]
  const nearHundredths = (d) => d.until(() => {
    const [b1, b2] = d.shuffle([4, 5, 20, 25, 50]).slice(0, 2), t1 = coTop(d, b1), x1 = t1 * 100 / b1, t2 = Math.round(x1 * b2 / 100) + d.pick([-1, 0, 1]), x3 = x1 + d.pick([-6, -4, -3, -2, 2, 3, 4, 6]);
    return [[t1, b1, x1], [t2, b2, t2 * 100 / b2], x3];
  }, ([p, q, x3]) => q[0] >= 1 && q[0] < q[1] && gcd(q[0], q[1]) === 1 && x3 > 5 && x3 < 95 && new Set([p[2], q[2], x3]).size === 3);
  // 차례 고르기 보기: 바른 차례 하나와 틀린 차례 셋. vals 는 수, shown 은 보기에 적는 글, desc 이면 큰 것부터. extra 는 먼저 넣을 틀린 차례.
  const ORDERS3 = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  function orderChoice(d, vals, shown, desc, extra) {
    const right = vals.map((_, i) => i).sort((p, q) => (desc ? cmp(vals[q], vals[p]) : cmp(vals[p], vals[q]))), key = (o) => o.join();
    const swaps = vals.length === 3 ? ORDERS3 : [[1, 0, 2, 3], [0, 2, 1, 3], [0, 1, 3, 2], [3, 2, 1, 0], [1, 0, 3, 2], [2, 1, 0, 3]].map((p) => p.map((i) => right[i]));
    const wrong = (extra || []).concat(d.shuffle(swaps)).filter((o, i, all) => key(o) !== key(right) && all.findIndex((x) => key(x) === key(o)) === i).slice(0, 3);
    const list = d.shuffle(wrong.concat([right]));
    return { list, right, options: list.map((o) => o.map((i) => shown[i]).join(', ')), answer: list.findIndex((o) => key(o) === key(right)) };
  }

  // ── 그림 ──
  // 더 큰 수를 위 칸에 써넣는 칸: 아래 줄에 수 넷, 가운데 줄에 빈칸 둘, 맨 위에 ㉠.
  function ladder(list) {
    const cell = (html, span) => `<td colspan="${span}" style="background:#fff;font-weight:600;padding:8px 10px">${html}</td>`;
    return '<div class="mb-table-wrap"><table class="mb-table"><tbody>' + `<tr>${cell(box(LAB[0]), 4)}</tr><tr>${cell(box(), 2)}${cell(box(), 2)}</tr><tr>${list.map((v) => cell(v, 1)).join('')}</tr></tbody></table></div>`;
  }
  // 크기가 다른 직사각형 둘(왼쪽이 가, 오른쪽이 나). 각각 세로로 똑같이 나누어 앞의 몇 칸을 색칠한다. first·second: [색칠한 칸, 나눈 칸], firstBig: 가가 큰 쪽인가.
  function twoSizes(first, second, firstBig) {
    const BIG = [124, 72], SMALL = [76, 44], base = 78, said = [];
    let out = '', x = 6;
    [[first, firstBig ? BIG : SMALL], [second, firstBig ? SMALL : BIG]].forEach(([[k, n], [w, h]], i) => {
      const cw = w / n;
      for (let c = 0; c < n; c += 1) out += `<rect class="mb-piece${c < k ? ' is-on' : ''}" x="${(x + c * cw).toFixed(2)}" y="${base - h}" width="${cw.toFixed(2)}" height="${h}"/>`;
      out += `<text class="mb-km-label" style="font-size:14px" x="${x + w / 2}" y="${base + 17}" text-anchor="middle">${KA[i]}</text>`;
      said.push(`${KA[i]}는 ${w === BIG[0] ? '큰' : '작은'} 직사각형을 똑같이 ${n}칸으로 나누어 ${k}칸을 색칠`);
      x += w + 28;
    });
    return `<svg class="mb-pieces" viewBox="0 0 240 100" width="240" role="img" aria-label="크기가 다른 직사각형 두 개: ${said.join(', ')}">${out}</svg>`;
  }

  // ── 분모가 다른 분수의 크기 비교 ──
  B.addTypes('5-1-4', 'comp', [
    T('comp-steps', '통분하여 두 분수의 크기 비교하기', '①55 ②52 ③55 심48', (d) => {
      // 틀린 보기: 통분은 맞는데 부등호가 거꾸로인 것, 분자에 곱하는 수를 서로 바꾸어 통분한 것(부등호 둘)
      const [a, b, c, e] = nearFracs(d, MID, (p, q, r, s) => p < s && r < q), L = lcm(b, e), x = a * L / b, y = c * L / e, x2 = a * L / e, y2 = c * L / b;
      const said = (p, q, s) => `${duo(frac(p, L), frac(q, L))}이므로 ${ex(`${frac(a, b)} <i>${s}</i> ${frac(c, e)}`)}`, s1 = x > y ? GT : LT, s0 = x > y ? LT : GT;
      const rows = d.shuffle([[said(x, y, s1), true], [said(x, y, s0), false], [said(x2, y2, s1), false], [said(x2, y2, s0), false]]);
      return C(`${fj(a, b, '과/와')} ${fj(c, e, '을/를')} 통분하여 크기를 바르게 비교한 것은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
        explain: `${josa(b, '과/와')} ${e}의 최소공배수 ${josa(L, '을/를')} 공통분모로 하여 통분하면 ${both(a, b, c, e)}이다. 분자를 비교하면 ${frac(a, b)} ${s1} ${frac(c, e)}이다.`,
        facts: { truth: rows.map((row) => row[1]), want: true }
      });
    }),
    T('comp-two', '두 분수의 크기 비교', '①56 ②53 ③56 심48', (d, n) => {
      // 문항마다 두 분모의 관계가 다르다: 한쪽이 다른 쪽의 배수, 공약수가 1뿐, 그 밖.
      const [a, b, c, e] = nearFracs(d, [MULTIPLE, COPRIME, GENERAL][n]);
      return C('두 분수의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, sign(a * e, c * b), {
        figure: versus(frac(a, b), frac(c, e)),
        explain: `${both(a, b, c, e)}이므로 ${frac(a, b)} ${SG(Fr(a, b), Fr(c, e))} ${frac(c, e)}이다.`,
        facts: { choose: { exprs: [`${a}/${b}`, `${c}/${e}`], rule: 'compare' }, rule: ['cmpMultiple', 'cmpCoprime', 'cmpGeneral'][n] }
      });
    }, { count: 3 }),
    T('comp-two-scaled', '약분되는 분수와의 크기 비교', '①56 ③56', (d) => {
      const [a, b] = reduced(d, 3, 9, (x) => x >= 2), k = d.int(2, 6), gap = d.pick([0, 0, 1, -1]), p = Fr(a, b), q = Fr(a * k + gap, b * k), [left, right] = d.bool() ? [p, q] : [q, p];
      return C('두 분수의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, sign(cmp(left, right), 0), {
        figure: versus(left.html, right.html),
        explain: `${frac(a, b)}의 분모와 분자에 각각 ${josa(k, '을/를')} 곱하면 ${frac(a * k, b * k)}이다. ` + (gap === 0 ? '두 분수는 크기가 같다.' : `${fj(a * k, b * k, '은/는')} ${q.html}보다 ${gap < 0 ? '크다' : '작다'}.`),
        facts: { choose: { exprs: [left.expr, right.expr], rule: 'compare' }, rule: 'cmpScaled' }
      });
    }),
    T('comp-same-top', '분자가 같은 분수의 크기 비교', '①56 ②57 ③60 심49', (d) => {
      const [a, b, e] = d.until(() => [d.int(2, 9), d.int(3, 20), d.int(3, 20)], ([x, y, z]) => y !== z && Math.abs(y - z) <= 4 && x < Math.min(y, z) && gcd(x, y) === 1 && gcd(x, z) === 1);
      return C('두 분수의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, sign(e, b), {
        figure: versus(frac(a, b), frac(a, e)),
        explain: `분자가 같은 분수는 분모가 작을수록 크다. ${b} ${b < e ? LT : GT} ${e}이므로 ${frac(a, b)} ${b < e ? GT : LT} ${frac(a, e)}이다.`,
        facts: { choose: { exprs: [`${a}/${b}`, `${a}/${e}`], rule: 'compare' }, rule: 'cmpSameTop' }
      });
    }),
    T('comp-via-half', '2분의 1을 기준으로 두 분수의 크기 비교', '②58 ③59 심50', (d) => {
      // 통분하면 공통분모가 매우 커지는 두 분수: 한쪽은 1/2보다 조금 크고 다른 쪽은 조금 작다.
      const [a, b, c, e] = d.until(() => { const y = d.int(11, 40), s = d.int(11, 40); return [Math.floor(y / 2) + 1, y, Math.ceil(s / 2) - 1, s]; }, ([x, y, z, s]) => Math.abs(y - s) >= 5 && gcd(y, s) <= 2 && gcd(x, y) === 1 && gcd(z, s) === 1);
      const p = Fr(a, b), q = Fr(c, e), [left, right] = d.bool() ? [p, q] : [q, p];
      return C('두 분수의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, sign(cmp(left, right), 0), {
        figure: versus(left.html, right.html),
        explain: `${fj(a, b, '은/는')} 분자의 2배 ${josa(a * 2, '이/가')} 분모 ${b}보다 크므로 ${frac(1, 2)}보다 크고, ${fj(c, e, '은/는')} 분자의 2배 ${josa(c * 2, '이/가')} 분모 ${e}보다 작으므로 ${frac(1, 2)}보다 작다. 따라서 ${frac(a, b)} ${GT} ${frac(c, e)}이다.`,
        facts: { choose: { exprs: [left.expr, right.expr], rule: 'compare' }, rule: 'cmpViaHalf' }
      });
    }),
    T('comp-half-pick', '2분의 1보다 작은(큰) 분수 고르기', '②58 심53', (d) => {
      const below = d.bool(), mk = (low) => d.until(() => { const den = d.int(5, 19); return [low ? Math.ceil(den / 2) - 1 : Math.floor(den / 2) + 1, den]; }, ([x, y]) => gcd(x, y) === 1 && x >= 2);
      const right = mk(below), others = d.until(() => [mk(!below), mk(!below), mk(!below)], (list) => new Set(list.map(String)).size === 3), rows = d.shuffle([right].concat(others));
      return C(`${frac(1, 2)}보다 ${below ? '작은' : '큰'} 분수는?`, rows.map((row) => frac(...row)), rows.indexOf(right), {
        explain: `분자의 2배가 분모보다 작으면 ${frac(1, 2)}보다 작고, 분모보다 크면 ${frac(1, 2)}보다 크다. ${fj(right[0], right[1], '은/는')} 분자의 2배 ${josa(right[0] * 2, '이/가')} 분모 ${right[1]}보다 ${below ? '작다' : '크다'}.`,
        facts: { choose: { exprs: rows.map(([x, y]) => `${x}/${y}`), rule: below ? 'onlyBelow' : 'onlyAbove', target: 0.5 } }
      });
    }),
    T('comp-mixed', '대분수의 크기 비교', '①57 ②54 ③57 심48', (d) => {
      const [a, b, c, e] = nearFracs(d, MID), w = d.int(1, 6), p = Mx(w, a, b), q = Mx(w, c, e);
      return C('두 대분수의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, sign(a * e, c * b), {
        figure: versus(p.html, q.html),
        explain: `자연수 부분이 같으므로 분수 부분을 통분하여 비교한다. ${both(a, b, c, e)}이므로 ${p.html} ${SG(p, q)} ${q.html}이다.`,
        facts: { choose: { exprs: [p.expr, q.expr], rule: 'compare' } }
      });
    }),
    T('comp-mixed-improper', '대분수와 가분수의 크기 비교', '①57 ②54', (d) => {
      const [a, b, c, e] = nearFracs(d, MID.filter(([x, y]) => lcm(x, y) <= 60)), w = d.int(1, 3), p = Mx(w, a, b), q = Fr(w * e + c, e), [left, right] = d.bool() ? [p, q] : [q, p];
      return C('대분수와 가분수의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, sign(cmp(left, right), 0), {
        figure: versus(left.html, right.html),
        explain: `${vj(q, '을/를')} 대분수로 나타내면 ${mixed(w, c, e)}이다. 자연수 부분이 같으므로 분수 부분을 통분하여 비교한다. ${both(a, b, c, e)}이므로 ${p.html} ${SG(p, q)} ${q.html}이다.`,
        facts: { choose: { exprs: [left.expr, right.expr], rule: 'compare' } }
      });
    }),
    T('comp-ladder', '더 큰 분수를 위 칸에 써넣기', '①62 ②55 ③63·64 심52', (d) => {
      const vs = d.until(() => d.shuffle([2, 3, 4, 5, 6, 8, 9, 10, 12]).slice(0, 4).map((den) => Fr(coTop(d, den), den)), (list) => distinct(list) && list.every((v) => v.top * 5 >= v.den * 2));
      const w1 = vs[best(vs.slice(0, 2), true)], w2 = vs[2 + best(vs.slice(2), true)], hit = best(vs, true);
      return C('두 분수 가운데 더 큰 분수를 바로 위의 빈칸에 써넣으려고 한다. ㉠에 알맞은 분수는?', vs.map((v) => v.html), hit, {
        figure: ladder(vs.map((v) => v.html)),
        explain: `${vj(vs[0], '과/와')} ${vs[1].html} 가운데 더 큰 분수는 ${w1.html}, ${vj(vs[2], '과/와')} ${vs[3].html} 가운데 더 큰 분수는 ${w2.html}이다. ${vj(w1, '과/와')} ${w2.html}${tail(w2.last, '을/를')} 통분하여 비교하면 더 큰 분수는 ${vs[hit].html}이다.`,
        facts: { choose: { exprs: vs.map((v) => v.expr), rule: 'max' } }
      });
    }),
    T('comp-three-order', '세 분수를 차례대로 쓰기', '①59·60 ②60 ③62 심51', (d) => {
      const vs = threeFracs(d, TRIPLES), desc = d.bool(), pick = orderChoice(d, vs, vs.map((v) => v.html), desc), L = vs.reduce((acc, v) => lcm(acc, v.den), 1);
      return C(`세 분수를 ${desc ? '큰' : '작은'} 분수부터 차례대로 쓴 것은?`, pick.options, pick.answer, {
        figure: numbers(vs.map((v) => v.html)),
        explain: `세 분모의 최소공배수 ${josa(L, '을/를')} 공통분모로 하여 통분하면 차례대로 ${vs.map((v) => frac(v.top * L / v.den, L)).join(', ')}이다. 분자가 ${desc ? '큰' : '작은'} 것부터 쓴다.`,
        facts: { choose: { exprs: vs.map((v) => v.expr), rule: desc ? 'descending' : 'ascending', orders: pick.list } }
      });
    }),
    T('comp-three-max', '세 분수 가운데 가장 큰(작은) 분수', '①61 ②61 ③62 심51', (d) => {
      const vs = threeFracs(d, PAIRWISE), big = d.bool(), hit = best(vs, big), [p, q, r] = vs.slice().sort((x, y) => cmp(y, x));
      return C(`세 분수 가운데 가장 ${big ? '큰' : '작은'} 분수는?`, vs.map((v) => v.html), hit, {
        explain: `두 분수씩 통분하여 비교한다. ${both(p.top, p.den, q.top, q.den)}, ${both(q.top, q.den, r.top, r.den)}이므로 ${p.html} ${GT} ${q.html} ${GT} ${r.html}이다.`,
        facts: { choose: { exprs: vs.map((v) => v.expr), rule: big ? 'max' : 'min' } }
      });
    }),
    T('comp-three-mixed', '세 대분수를 차례대로 쓰기', '②54·60·61 심51', (d) => {
      const w = d.int(1, 5), vs = threeFracs(d, TRIPLES).map((v) => Mx(w, v.top, v.den)), desc = d.bool(), pick = orderChoice(d, vs, vs.map((v) => v.html), desc), L = vs.reduce((acc, v) => lcm(acc, v.den), 1);
      return C(`세 대분수를 ${desc ? '큰' : '작은'} 수부터 차례대로 쓴 것은?`, pick.options, pick.answer, {
        figure: numbers(vs.map((v) => v.html)),
        explain: `자연수 부분이 같으므로 분수 부분을 통분하여 비교한다. 공통분모를 ${josa(L, '으로/로')} 하면 분수 부분은 차례대로 ${vs.map((v) => frac((v.top - w * v.den) * L / v.den, L)).join(', ')}이다.`,
        facts: { choose: { exprs: vs.map((v) => v.expr), rule: desc ? 'descending' : 'ascending', orders: pick.list } }
      });
    }),
    T('comp-above-count', '기준 분수보다 큰 분수의 수', '①63 ②59 ③61 심53', (d) => {
      const t = Fr(...reduced(d, 4, 10, (x, y) => x * 4 >= y && x * 4 <= y * 3));
      const vs = d.until(() => d.shuffle([3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 16, 20].filter((den) => den !== t.den)).slice(0, 5).map((den) => Fr(Math.max(1, Math.min(den - 1, Math.round(t.top * den / t.den) + d.pick([-1, 0, 0, 1]))), den)),
        (list) => list.every((v) => cmp(v, t) !== 0 && gcd(v.top, v.den) === 1) && [2, 3].includes(list.filter((v) => cmp(v, t) > 0).length));
      const above = vs.filter((v) => cmp(v, t) > 0);
      return N(`${t.html}보다 큰 분수는 모두 몇 개인가?`, above.length, {
        unit: '개', figure: numbers(vs.map((v) => v.html)),
        explain: `${t.html}${tail(t.last, '과/와')} 하나씩 통분하여 비교한다. ${t.html}보다 큰 분수는 ${above.map((v) => v.html).join(', ')}${tail(above[above.length - 1].last, '으로/로')} ${above.length}개이다.`,
        facts: { choose: { exprs: vs.map((v) => v.expr), rule: 'countAbove', target: t.top / t.den } }
      });
    }),
    T('comp-between-pick', '두 분수 사이에 있는 분수 고르기', '②59 심53', (d) => {
      const lo = Fr(...d.pick([[1, 2], [1, 3], [2, 5], [1, 4], [3, 5]])), mk = () => { const den = d.pick([3, 4, 5, 6, 8, 9, 10, 12]); return Fr(d.int(1, den - 1), den); }, plain = (v) => gcd(v.top, v.den) === 1;
      const hi = d.until(mk, (v) => plain(v) && v.den !== lo.den && cmp(v, lo) * 6 >= v.den * lo.den && v.top * 9 < v.den * 8);
      const inside = d.until(mk, (v) => plain(v) && cmp(v, lo) > 0 && cmp(v, hi) < 0 && v.den !== lo.den && v.den !== hi.den);
      const outs = d.until(() => [mk(), mk(), mk()], (list) => list.every((v) => plain(v) && (cmp(v, lo) < 0 || cmp(v, hi) > 0)) && list.some((v) => cmp(v, lo) < 0) && list.some((v) => cmp(v, hi) > 0) && new Set(list.map((v) => v.expr)).size === 3);
      const rows = d.shuffle([inside].concat(outs));
      return C(`${lo.html}보다 크고 ${hi.html}보다 작은 분수는?`, rows.map((v) => v.html), rows.indexOf(inside), {
        explain: `${both(lo.top, lo.den, inside.top, inside.den)}이므로 ${lo.html} ${LT} ${inside.html}이고, ${both(inside.top, inside.den, hi.top, hi.den)}이므로 ${inside.html} ${LT} ${hi.html}이다.`,
        facts: { between: { low: lo.expr, high: hi.expr, exprs: rows.map((v) => v.expr) } }
      });
    }),
    T('comp-unit-count', '단위분수가 몇 개인 수의 크기 비교', '①64', (d) => {
      const [a, b, c, e] = d.until(() => { const [y, s] = d.shuffle(d.pick(GENERAL.concat(COPRIME, MULTIPLE).filter(([p, q]) => p >= 4 && lcm(p, q) <= 72))); return [d.int(2, y - 1), y, d.int(2, s - 1), s]; }, ([x, y, z, s]) => x !== z && Math.abs(x * s - z * y) <= Math.max(y, s));
      return C('㉠과 ㉡의 크기를 바르게 비교한 것은?', ['㉠이 ㉡보다 크다.', '㉠과 ㉡은 크기가 같다.', '㉠이 ㉡보다 작다.'], sign(a * e, c * b), {
        figure: tagged([`${fj(1, b, '이/가')} ${a}개인 수`, `${fj(1, e, '이/가')} ${c}개인 수`]),
        explain: `㉠은 ${frac(a, b)}, ㉡은 ${frac(c, e)}이다. ${both(a, b, c, e)}이므로 ${frac(a, b)} ${SG(Fr(a, b), Fr(c, e))} ${frac(c, e)}이다.`,
        facts: { choose: { exprs: [`${a}/${b}`, `${c}/${e}`], rule: 'compare' }, rule: 'unitFractions' }
      });
    }),
    T('comp-wrong-pick', '크기 비교가 잘못된 것 고르기', '①65 ②56 ③58 심79', (d) => {
      // 네 식 가운데 하나만 틀리다. 어느 식이든 통분해 보아야 알 수 있게 두 수의 크기가 가깝다.
      const pair = (whole) => { const [a, b, c, e] = nearFracs(d, MID), w = d.int(1, 4); return whole ? [Mx(w, a, b), Mx(w, c, e)] : [Fr(a, b), Fr(c, e)]; };
      const made = d.shuffle([pair(false), pair(false), pair(true), pair(true)]), bad = d.int(0, 3);
      const rows = made.map(([p, q], i) => ({ p, q, said: (cmp(p, q) > 0) === (i !== bad) }));
      const [p, q] = made[bad];
      return C('두 수의 크기를 잘못 비교한 것은?', rows.map((row) => ex(`${row.p.html} <i>${row.said ? GT : LT}</i> ${row.q.html}`)), bad, {
        explain: `통분하여 비교하면 ${p.html} ${SG(p, q)} ${q.html}이다. 나머지는 바르게 비교하였다.`,
        facts: { biggerClaims: rows.map((row, i) => (row.said ? [row.p.expr, row.q.expr, i] : [row.q.expr, row.p.expr, i])), truth: rows.map((_, i) => i !== bad), want: false }
      });
    }),
    T('comp-box', '□ 안에 들어갈 수 있는 자연수', '①66 ②62 ③65 심57', (d, n) => {
      // 한 분모가 다른 분모의 배수여서 한쪽만 고치면 된다. 첫째 문항은 개수, 둘째 문항은 가장 큰 수를 묻는다.
      const [b, k, c] = d.until(() => [d.int(3, 9), d.int(2, 5), d.int(5, 40)], ([y, kk, z]) => z < y * kk && z % kk !== 0 && Math.floor(z / kk) >= 2 && gcd(z, y * kk) === 1), top = Math.floor(c / k);
      const why = `${frac('□', b)}의 분모와 분자에 각각 ${josa(k, '을/를')} 곱하면 분모가 ${b * k}${tail(b * k, '으로/로')} 같아진다. □ × ${josa(k, '이/가')} ${c}보다 작아야 하므로 □ 안에는 1부터 ${top}까지의 자연수가 들어갈 수 있다.`;
      if (n === 0) return N('□ 안에 들어갈 수 있는 자연수는 모두 몇 개인가?', top, { unit: '개', figure: eq(frac(box(), b), '<', frac(c, b * k)), explain: why, facts: { digit: { template: `□/${b}<${c}/${b * k}`, lo: 1, hi: b * k, ask: 'count' }, rule: 'boxMultipleCount' } });
      return N('□ 안에 들어갈 수 있는 자연수 가운데 가장 큰 수는?', top, { figure: eq(frac(c, b * k), '>', frac(box(), b)), explain: why, facts: { digit: { template: `${c}/${b * k}>□/${b}`, lo: 1, hi: b * k, ask: 'max' }, rule: 'boxMultipleMax' } });
    }, { count: 2 }),
    T('comp-word-two', '두 분수의 크기를 비교하는 문장제', '①69 ②65 ③68 심74', (d) => {
      const [a, b, c, e] = nearFracs(d, MID), [p, q] = d.shuffle(NAMES).slice(0, 2), more = a * e > c * b ? p : q;
      return C(`${name(p, '은/는')} 리본을 ${frac(a, b)} m, ${name(q, '은/는')} ${frac(c, e)} m 사용하였다. 리본을 더 많이 사용한 사람은?`, [p, '두 사람이 사용한 길이는 같다.', q], sign(a * e, c * b), {
        explain: `${both(a, b, c, e)}이므로 ${frac(a, b)} ${SG(Fr(a, b), Fr(c, e))} ${frac(c, e)}이다. 따라서 ${name(more, '이/가')} 더 많이 사용하였다.`,
        facts: { choose: { exprs: [`${a}/${b}`, `${c}/${e}`], rule: 'compare' } }
      });
    }),
    T('comp-word-mixed', '대분수로 나타낸 두 거리의 비교', '①69 ②65 ③68 심74', (d) => {
      // 더 가까운 곳(작은 쪽)을 묻는다.
      const [a, b, c, e] = nearFracs(d, MID), w = d.int(1, 4), [s1, s2] = d.pick([['학교', '도서관'], ['공원', '수영장'], ['서점', '박물관']]), p = Mx(w, a, b), q = Mx(w, c, e);
      return C(`집에서 ${s1}까지의 거리는 ${p.html} km이고, 집에서 ${s2}까지의 거리는 ${q.html} km이다. 집에서 더 가까운 곳은?`, [s1, '두 곳까지의 거리는 같다.', s2], sign(c * b, a * e), {
        explain: `자연수 부분이 같으므로 분수 부분을 통분하여 비교한다. ${both(a, b, c, e)}이므로 ${p.html} ${SG(p, q)} ${q.html}이다. 따라서 ${cmp(p, q) < 0 ? s1 : s2}까지의 거리가 더 짧다.`,
        facts: { choose: { exprs: [q.expr, p.expr], rule: 'compare' } }
      });
    }),
    T('comp-word-three-max', '세 분수를 비교하는 문장제(가장 큰 것)', '①70 ②66 ③69 심75', (d) => {
      const vs = threeFracs(d, PAIRWISE.concat(TRIPLES)), who = d.shuffle(NAMES).slice(0, 3), hit = best(vs, true), [p, q, r] = vs.slice().sort((x, y) => cmp(y, x));
      return C(`줄넘기를 ${name(who[0], '은/는')} ${vs[0].html}시간, ${name(who[1], '은/는')} ${vs[1].html}시간, ${name(who[2], '은/는')} ${vs[2].html}시간 동안 하였다. 줄넘기를 가장 오래 한 사람은?`, who, hit, {
        explain: `두 분수씩 통분하여 비교한다. ${both(p.top, p.den, q.top, q.den)}, ${both(q.top, q.den, r.top, r.den)}이므로 ${p.html} ${GT} ${q.html} ${GT} ${r.html}이다. 가장 오래 한 사람은 ${josa(who[hit], '이다/다')}.`,
        facts: { choose: { exprs: vs.map((v) => v.expr), rule: 'max' } }
      });
    }),
    T('comp-word-three-order', '세 거리를 차례대로 쓰는 문장제', '①70 ②66 ③69 심75', (d) => {
      const vs = threeFracs(d, TRIPLES), places = d.shuffle(['학교', '서점', '도서관', '공원', '우체국']).slice(0, 3), pick = orderChoice(d, vs, places, false), L = vs.reduce((acc, v) => lcm(acc, v.den), 1);
      return C(`집에서 ${places[0]}까지의 거리는 ${vs[0].html} km, ${places[1]}까지의 거리는 ${vs[1].html} km, ${places[2]}까지의 거리는 ${vs[2].html} km이다. 집에서 가까운 곳부터 차례대로 쓴 것은?`, pick.options, pick.answer, {
        explain: `공통분모를 ${josa(L, '으로/로')} 하여 통분하면 차례대로 ${vs.map((v) => frac(v.top * L / v.den, L)).join(', ')}이다. 거리가 짧은 곳부터 쓰면 ${pick.right.map((i) => places[i]).join(', ')}의 차례이다.`,
        facts: { choose: { exprs: vs.map((v) => v.expr), rule: 'ascending', orders: pick.list } }
      });
    })
  ]);

  // ── 분수와 소수의 크기 비교 ──
  B.addTypes('5-1-4', 'deci', [
    T('deci-steps', '분수를 분모가 100인 분수로 고치는 과정', '①71 ②68 ③71', (d) => {
      const b = d.pick([4, 20, 25, 50]), a = coTop(d, b), m = 100 / b;
      return M('분수를 분모가 100인 분수로 고치는 과정이다. ㉠, ㉡에 알맞은 수는?', labelled([m, a * m]), {
        figure: eq(frac(a, b), '=', frac(`${a} × ${box(LAB[0])}`, `${b} × ${box(LAB[0])}`), '=', frac(box(LAB[1]), 100)),
        explain: `${b} × ${m} = 100이므로 분모와 분자에 각각 ${josa(m, '을/를')} 곱한다. ${frac(a, b)} = ${frac(a * m, 100)}이고, 소수로 나타내면 ${fx(a * m, 2)}이다.`,
        facts: { calc: [[`100/${b}`, 0], [`${a}*100/${b}`, 1]] }
      });
    }),
    T('deci-frac-tenths', '분수를 소수로 나타내기(분모가 2, 5인 분수)', '①71 ②68 ③71', (d) => {
      const b = d.pick([2, 5, 5]), a = coTop(d, b), t = a * 10 / b;
      return D('분수를 소수로 나타내면?', t / 10, {
        figure: lines([ex(frac(a, b))]),
        explain: `분모와 분자에 각각 ${josa(10 / b, '을/를')} 곱하면 ${frac(t, 10)}이다. 소수로 나타내면 ${sx(t, 1)}이다.`,
        facts: { calc: [[`${a}/${b}`, 0]], rule: 'toTenths' }
      });
    }),
    T('deci-frac-reduce', '약분하여 소수로 나타내기', '①71 ②72 ③75', (d) => {
      const t = d.int(1, 9), k = d.pick([2, 3, 4, 6, 7]), A = t * k, Bk = 10 * k;
      return D('분수를 소수로 나타내면?', t / 10, {
        figure: lines([ex(frac(A, Bk))]),
        explain: `분모와 분자를 각각 ${josa(k, '으로/로')} 나누면 ${frac(t, 10)}이다. 소수로 나타내면 ${sx(t, 1)}이다.`,
        facts: { calc: [[`${A}/${Bk}`, 0]], rule: 'reduceTenths' }
      });
    }),
    T('deci-frac-hundredths', '분수를 소수로 나타내기(분모가 4, 20, 25, 50인 분수)', '①71 ②68 ③71', (d) => {
      // 틀린 보기: 소수점의 자리를 잘못 잡은 것 둘, 분자와 분모의 숫자를 그대로 이어 쓴 것
      const [a, b, opts] = d.until(() => { const den = d.pick([4, 20, 25, 50]), top = coTop(d, den), v = top * 100 / den; return [top, den, [top / den, v / 10, v / 1000, Number(`0.${top}${den}`)]]; }, (made) => new Set(made[2]).size === 4);
      const rows = d.shuffle(opts), v = a * 100 / b;
      return C('분수를 소수로 나타내면?', rows.map(String), rows.indexOf(a / b), {
        figure: lines([ex(frac(a, b))]),
        explain: `분모와 분자에 각각 ${josa(100 / b, '을/를')} 곱하면 ${frac(v, 100)}이다. 소수로 나타내면 ${fx(v, 2)}이다.`,
        facts: { pick: { expr: `${a}/${b}`, options: rows }, rule: 'toHundredths' }
      });
    }),
    T('deci-frac-thousandths', '분수를 소수로 나타내기(분모가 8, 40, 125인 분수)', '①73 ③82', (d) => {
      const [a, b, opts] = d.until(() => { const den = d.pick([8, 8, 40, 125]), top = coTop(d, den), v = top * 1000 / den; return [top, den, [top / den, v / 100, v / 10000, Number(`0.${top}${den}`)]]; }, (made) => new Set(made[2]).size === 4);
      const rows = d.shuffle(opts), v = a * 1000 / b;
      return C('분수를 소수로 나타내면?', rows.map(String), rows.indexOf(a / b), {
        figure: lines([ex(frac(a, b))]),
        explain: `${b} × ${1000 / b} = 1000이므로 분모와 분자에 각각 ${josa(1000 / b, '을/를')} 곱하면 ${frac(v, 1000)}이다. 소수로 나타내면 ${fx(v, 3)}이다.`,
        facts: { pick: { expr: `${a}/${b}`, options: rows }, rule: 'toThousandths' }
      });
    }),
    T('deci-mixed-decimal', '대분수를 소수로 나타내기', '①71', (d) => {
      const w = d.int(1, 9), b = d.pick([2, 5, 5]), a = coTop(d, b), t = a * 10 / b;
      return D('대분수를 소수로 나타내면?', (w * 10 + t) / 10, {
        figure: lines([ex(mixed(w, a, b))]),
        explain: `분수 부분 ${fj(a, b, '을/를')} 소수로 나타내면 ${sx(t, 1)}이다. 따라서 ${w}.${t}이다.`,
        facts: { calc: [[`${w}+${a}/${b}`, 0]] }
      });
    }),
    T('deci-to-frac', '소수를 기약분수로 나타내기', '②69 ③72', (d, n) => {
      // 문항마다 소수의 꼴이 다르다: 소수 한 자리 수, 소수 두 자리 수, 1보다 큰 소수(대분수로).
      if (n === 0) {
        const t = d.pick([2, 4, 5, 6, 8]), g = gcd(t, 10), text = sx(t, 1);
        return F(`${text}${tail(t, '을/를')} 기약분수로 나타내면?`, t / g, 10 / g, { explain: `${text} = ${frac(t, 10)}이다. 분모와 분자를 각각 ${josa(g, '으로/로')} 나누면 ${frac(t / g, 10 / g)}이다.`, facts: { calc: [[`${t}/${g}`, 0], [`10/${g}`, 1]], unseen: [10, g], rule: 'fracTenths' } });
      }
      const v = d.until(() => d.int(12, 96), (x) => x % 10 !== 0 && gcd(x, 100) > 1), g = gcd(v, 100);
      if (n === 1) {
        const text = sx(v, 2);
        return F(`${text}${tail(v % 10, '을/를')} 기약분수로 나타내면?`, v / g, 100 / g, { explain: `${text} = ${frac(v, 100)}이다. 분모와 분자를 각각 최대공약수 ${josa(g, '으로/로')} 나누면 ${frac(v / g, 100 / g)}이다.`, facts: { calc: [[`${v}/${g}`, 0], [`100/${g}`, 1]], unseen: [100, g], rule: 'fracHundredths' } });
      }
      const w = d.int(1, 6), text = sx(w * 100 + v, 2);
      return F(`${text}${tail(v % 10, '을/를')} 대분수로 나타내면? (분수 부분은 기약분수로 나타낸다.)`, v / g, 100 / g, {
        whole: w, explain: `${text} = ${mixed(w, v, 100)}이다. 분수 부분의 분모와 분자를 각각 ${josa(g, '으로/로')} 나누면 ${mixed(w, v / g, 100 / g)}이다.`,
        facts: { calc: [[String(w), 0], [`${v}/${g}`, 1], [`100/${g}`, 2]], unseen: [100, g] }
      });
    }, { count: 3 }),
    T('deci-to-frac-steps', '소수를 분수로 고쳐 약분하는 과정', '②69', (d) => {
      const v = d.until(() => d.int(12, 96), (x) => x % 10 !== 0 && gcd(x, 100) > 1), g = gcd(v, 100);
      return M('소수를 기약분수로 나타내는 과정이다. ㉠, ㉡에 알맞은 수는?', labelled([v, 100 / g]), {
        figure: eq(sx(v, 2), '=', frac(box(LAB[0]), 100), '=', frac(v / g, box(LAB[1]))),
        explain: `${sx(v, 2)} = ${frac(v, 100)}이다. 분자 ${josa(v, '을/를')} ${josa(g, '으로/로')} 나누어 ${josa(v / g, '이/가')} 되었으므로 분모도 ${josa(g, '으로/로')} 나누면 ${100 / g}이다.`,
        facts: { calc: [[String(v), 0], [`100*${v / g}/${v}`, 1]] }
      });
    }),
    T('deci-via-frac', '소수를 분수로 고쳐 비교하는 과정', '①72 ②70 ③74', (d) => {
      const [a, b, v] = d.until(() => { const den = d.pick([4, 20, 25, 50]), top = coTop(d, den); return [top, den, top * 100 / den + d.pick([-6, -4, -3, -2, 2, 3, 4, 6])]; }, (made) => made[2] >= 11 && made[2] <= 99 && made[2] % 10 !== 0), x = a * 100 / b;
      return M('소수와 분수를 분모가 100인 분수로 고쳐 크기를 비교하려고 한다. ㉠, ㉡에 알맞은 수는?', labelled([v, x]), {
        figure: lines([eq(sx(v, 2), '=', frac(box(LAB[0]), 100)), eq(frac(a, b), '=', frac(box(LAB[1]), 100))]),
        explain: `${sx(v, 2)} = ${frac(v, 100)}, ${frac(a, b)} = ${frac(x, 100)}이다. 분자를 비교하면 ${sx(v, 2)} ${v > x ? GT : LT} ${frac(a, b)}이다.`,
        facts: { calc: [[String(v), 0], [`${a}*100/${b}`, 1]] }
      });
    }),
    T('deci-via-decimal', '분수를 소수로 고치는 과정', '①72 ②70 ③73', (d) => {
      const b = d.pick([2, 5, 5]), a = coTop(d, b), t = a * 10 / b;
      return M('분수를 소수로 고치는 과정이다. ㉠, ㉡에 알맞은 수는?', [{ label: LAB[0], answer: t }, { label: LAB[1], answer: t / 10, decimal: true }], {
        figure: eq(frac(a, b), '=', frac(box(LAB[0]), 10), '=', box(LAB[1])),
        explain: `분모와 분자에 각각 ${josa(10 / b, '을/를')} 곱하면 ${frac(t, 10)}이다. ${fj(t, 10, '은/는')} 0.1이 ${t}개인 수이므로 ${sx(t, 1)}이다.`,
        facts: { calc: [[`${a}*10/${b}`, 0], [`${a}/${b}`, 1]] }
      });
    }),
    T('deci-compare', '분수와 소수의 크기 비교', '①73 ②71 ③76 심59', (d, n) => {
      // 문항마다 분수를 소수로 고치는 길이 다르다: 분모 2·5(소수 한 자리), 분모 4·20·25·50(소수 두 자리), 분모 8·40(소수 세 자리), 약분하면 분모가 10이 되는 분수.
      let f, dec, shown;
      if (n === 0) { const b = d.pick([2, 5, 5]), a = coTop(d, b), t = d.until(() => a * 10 / b + d.pick([0, 0, 1, -1, 2, -2]), (v) => v >= 1 && v <= 9); f = Fr(a, b); dec = Dc(t, 1); shown = sx(a * 10 / b, 1); }
      else if (n === 1) { const [a, b] = d.until(() => { const den = d.pick([4, 20, 25, 50]); return [coTop(d, den), den]; }, ([top, den]) => top * 100 / den >= 16 && top * 100 / den <= 94), v = d.until(() => a * 100 / b + d.pick([0, 1, -1, 2, -2, 3, -3, 5, -5]), (x) => x >= 11 && x <= 99 && x % 10 !== 0); f = Fr(a, b); dec = Dc(v, 2); shown = sx(a * 100 / b, 2); }
      else if (n === 2) { const [a, b] = d.until(() => { const den = d.pick([8, 40]); return [coTop(d, den), den]; }, ([top, den]) => top * 100 / den >= 10 && top * 100 / den <= 95), v = d.until(() => Math.round(a * 100 / b) + d.pick([0, -1, 1, -2]), (x) => x >= 5 && x <= 99); f = Fr(a, b); dec = Dc(v, 2); shown = sx(a * 1000 / b, 3); }
      else { const t = d.int(2, 9), k = d.pick([3, 4, 6, 7]), v = d.until(() => t * 10 + d.pick([0, 0, 5, -5, 2, -2, 8, -8]), (x) => x >= 11 && x <= 99); f = Fr(t * k, 10 * k); dec = Dc(v, 2); shown = sx(t, 1); }
      const [left, right] = d.bool() ? [f, dec] : [dec, f];
      return C('두 수의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, sign(cmp(left, right), 0), {
        figure: versus(left.html, right.html),
        explain: `${vj(f, '을/를')} ${n === 3 ? '약분한 다음 ' : ''}소수로 나타내면 ${shown}이다. 따라서 ${left.html} ${SG(left, right)} ${right.html}이다.`,
        facts: { choose: { exprs: [left.expr, right.expr], rule: 'compare' }, rule: ['dcTenths', 'dcHundredths', 'dcThousandths', 'dcReduce'][n] }
      });
    }, { count: 4 }),
    T('deci-compare-third', '소수로 고칠 수 없는 분수와 소수의 크기 비교', '①74 ②73 ③74 심60', (d) => {
      // 분모가 3·6·7·9·12·15인 분수: 소수를 분수로 고쳐 통분해야 한다.
      const b = d.pick([3, 6, 7, 9, 12, 15]), a = coTop(d, b), t = d.until(() => Math.round(a * 10 / b) + d.pick([0, 0, 1, -1]), (v) => v >= 1 && v <= 9), g = gcd(t, 10), p = t / g, q = 10 / g;
      const f = Fr(a, b), dec = Dc(t, 1), [left, right] = d.bool() ? [f, dec] : [dec, f];
      return C('두 수의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, sign(cmp(left, right), 0), {
        figure: versus(left.html, right.html),
        explain: `소수를 분수로 고쳐 통분한다. ${dec.html} = ${frac(p, q)}이고 ${both(a, b, p, q)}이므로 ${left.html} ${SG(left, right)} ${right.html}이다.`,
        facts: { choose: { exprs: [left.expr, right.expr], rule: 'compare' }, rule: 'dcNonTerminating' }
      });
    }),
    T('deci-compare-mixed', '대분수와 소수의 크기 비교', '①75 ②71 ③77 심59', (d) => {
      const w = d.int(1, 9), b = d.pick([4, 5, 20, 25]), a = coTop(d, b), x = a * 100 / b, v = d.until(() => x + d.pick([0, 0, 3, -3, 7, -7, 10, -10, 4, -4]), (y) => y >= 5 && y <= 95);
      const f = Mx(w, a, b), dec = Dc(w * 100 + v, 2), [left, right] = d.bool() ? [f, dec] : [dec, f];
      return C('대분수와 소수의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, sign(cmp(left, right), 0), {
        figure: versus(left.html, right.html),
        explain: `${vj(f, '을/를')} 소수로 나타내면 ${sx(w * 100 + x, 2)}이다. 따라서 ${left.html} ${SG(left, right)} ${right.html}이다.`,
        facts: { choose: { exprs: [left.expr, right.expr], rule: 'compare' } }
      });
    }),
    T('deci-pair-tenths', '두 분수를 약분하여 소수로 나타내어 비교하기', '②72 ③75', (d) => {
      const [t1, t2] = d.until(() => { const t = d.int(2, 9); return [t, t + d.pick([0, 1, -1])]; }, (made) => made[1] >= 1 && made[1] <= 9), [k1, k2] = d.shuffle([2, 3, 4, 5, 6, 7]).slice(0, 2);
      const p = Fr(t1 * k1, 10 * k1), q = Fr(t2 * k2, 10 * k2);
      return C('두 분수를 약분하여 소수로 나타낸 다음 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, sign(t1, t2), {
        figure: versus(p.html, q.html),
        explain: `${p.html} = ${frac(t1, 10)} = ${sx(t1, 1)}, ${q.html} = ${frac(t2, 10)} = ${sx(t2, 1)}이므로 ${p.html} ${SG(p, q)} ${q.html}이다.`,
        facts: { choose: { exprs: [p.expr, q.expr], rule: 'compare' }, rule: 'pairTenths' }
      });
    }),
    T('deci-max-three', '분수와 소수 가운데 가장 큰(작은) 수', '①77 ②76 ③78 심60', (d) => {
      const [p, q, x3] = nearHundredths(d), vs = d.shuffle([Fr(p[0], p[1]), Fr(q[0], q[1]), Dc(x3, 2)]), big = d.bool(), hit = best(vs, big);
      return C(`가장 ${big ? '큰' : '작은'} 수는?`, THREE, hit, {
        figure: tagged(vs.map((v) => v.html)),
        explain: `분수를 소수로 나타내면 ${vs.filter((v) => !v.dec).map((v) => `${v.html} = ${sx(v.top * 100 / v.den, 2)}`).join(', ')}이다. 가장 ${big ? '큰' : '작은'} 수는 ${LAB[hit]}이다.`,
        facts: { choose: { exprs: vs.map((v) => v.expr), rule: big ? 'max' : 'min' } }
      });
    }),
    T('deci-below-pick', '기준 소수보다 작은(큰) 분수 고르기', '②75 ③79', (d) => {
      const t = d.int(3, 8), below = d.bool(), target = Dc(t, 1);
      const mk = (low) => d.until(() => { const b = d.pick([4, 5, 10, 20, 25, 50]); return Fr(Math.round(t * b / 10) + d.pick([-3, -2, -1, 0, 1, 2, 3]), b); }, (v) => v.top >= 1 && v.top < v.den && gcd(v.top, v.den) === 1 && (low ? cmp(v, target) < 0 : cmp(v, target) > 0));
      const right = mk(below), others = d.until(() => [mk(!below), mk(!below), mk(!below)], (list) => new Set(list.map((v) => v.expr)).size === 3), rows = d.shuffle([right].concat(others));
      return C(`${target.html}보다 ${below ? '작은' : '큰'} 수는?`, rows.map((v) => v.html), rows.indexOf(right), {
        explain: `분수를 소수로 나타내면 ${rows.map((v) => `${v.html} = ${sx(v.top * 100 / v.den, 2)}`).join(', ')}이다. ${target.html}보다 ${below ? '작은' : '큰'} 수는 ${right.html}이다.`,
        facts: { choose: { exprs: rows.map((v) => v.expr), rule: below ? 'onlyBelow' : 'onlyAbove', target: t / 10 } }
      });
    }),
    T('deci-above-decimals', '주어진 분수보다 큰 소수의 수', '③79', (d) => {
      const [a, b] = d.until(() => { const den = d.pick([4, 20, 25, 50]); return [coTop(d, den), den]; }, ([top, den]) => top * 100 / den >= 8 && top * 100 / den <= 92), x = a * 100 / b;
      const list = d.until(() => d.shuffle([-4, -3, -2, -1, 1, 2, 3, 4]).slice(0, 5).map((g) => x + g).sort((p, q) => p - q), (vs) => [2, 3].includes(vs.filter((v) => v > x).length));
      const above = list.filter((v) => v > x), last = sx(above[above.length - 1], 2);
      return N(`${frac(a, b)}보다 큰 소수는 모두 몇 개인가?`, above.length, {
        unit: '개', figure: numbers(list.map((v) => sx(v, 2))),
        explain: `${fj(a, b, '을/를')} 소수로 나타내면 ${sx(x, 2)}이다. ${sx(x, 2)}보다 큰 소수는 ${above.map((v) => sx(v, 2)).join(', ')}${tail(Number(last.slice(-1)), '으로/로')} ${above.length}개이다.`,
        facts: { choose: { exprs: list.map((v) => sx(v, 2)), rule: 'countAbove', target: a / b } }
      });
    }),
    T('deci-unit-count', '몇 개인 수로 나타낸 분수와 소수의 크기 비교', '①64 ③80', (d) => {
      const b = d.pick([4, 5, 20, 25]), k = d.int(2, b - 1), t = d.until(() => Math.round(k * 10 / b) + d.pick([0, 0, 1, -1]), (v) => v >= 1 && v <= 9);
      return C('㉠과 ㉡의 크기를 바르게 비교한 것은?', ['㉠이 ㉡보다 크다.', '㉠과 ㉡은 크기가 같다.', '㉠이 ㉡보다 작다.'], sign(k * 10, t * b), {
        figure: tagged([`${fj(1, b, '이/가')} ${k}개인 수`, `0.1이 ${t}개인 수`]),
        explain: `㉠은 ${frac(k, b)}이고 소수로 나타내면 ${sx(k * 100 / b, 2)}이다. ㉡은 ${sx(t, 1)}이다.`,
        facts: { choose: { exprs: [`${k}/${b}`, `${t}/10`], rule: 'compare' }, unseen: [10], rule: 'unitDecimal' }
      });
    }),
    T('deci-box-tenths', '□ 안에 들어갈 수 있는 수(분모가 10인 분수와 소수)', '③81 심65', (d) => {
      const m = d.int(2, 7) * 10 + d.pick([0, 2, 5, 8]), more = d.bool(), text = sx(m, 2), list = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((x) => (more ? x * 10 > m : x * 10 < m));
      return N('1부터 9까지의 자연수 가운데 □ 안에 들어갈 수 있는 수는 모두 몇 개인가?', list.length, {
        unit: '개', figure: eq(frac(box(), 10), more ? '>' : '<', text),
        explain: `분모가 10인 분수 ${frac('□', 10)}의 값은 소수 0.□와 같다. ${text}보다 ${more ? '큰' : '작은'} 것은 □ 안에 ${list.join(', ')}${tail(list[list.length - 1], '이/가')} 들어갈 때이므로 ${list.length}개이다.`,
        facts: { digit: { template: `□/10${more ? '>' : '<'}${text}`, lo: 1, hi: 9, ask: 'count' } }
      });
    }),
    T('deci-box-digit', '□ 안에 들어갈 수 있는 숫자(소수의 한 자리)', '①78 ②77 ③81 심66', (d, n) => {
      // 첫째 문항은 한쪽 부등식의 개수, 둘째 문항은 두 분수 사이에 드는 숫자 하나.
      const pickFrac = () => { const den = d.pick([4, 20, 25, 50]), top = coTop(d, den); return [top, den, top * 100 / den]; };
      if (n === 0) {
        const [a, b, x] = d.until(pickFrac, (f) => f[2] >= 15 && f[2] <= 85), less = d.bool(), list = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((v) => (less ? x < v * 10 : x > v * 10));
        return N('□ 안에는 1부터 9까지의 숫자가 들어갈 수 있다. □ 안에 들어갈 수 있는 숫자는 모두 몇 개인가?', list.length, {
          unit: '개', figure: eq(frac(a, b), less ? '<' : '>', `0.${box()}`),
          explain: `${fj(a, b, '을/를')} 소수로 나타내면 ${sx(x, 2)}이다. 0.□가 ${sx(x, 2)}보다 ${less ? '크려면' : '작으려면'} □ 안에 ${list.join(', ')}${tail(list[list.length - 1], '이/가')} 들어가야 하므로 ${list.length}개이다.`,
          facts: { digit: { template: `${a}/${b}${less ? '<' : '>'}0.□`, lo: 1, hi: 9, ask: 'count' } }
        });
      }
      const [lo, hi, digit] = d.until(() => [pickFrac(), pickFrac(), d.int(2, 8)], ([p, q, v]) => p[2] >= (v - 1) * 10 && p[2] < v * 10 && q[2] > v * 10 && q[2] <= (v + 1) * 10 && p[1] !== q[1]);
      return N('□ 안에 알맞은 숫자는?', digit, {
        figure: eq(frac(lo[0], lo[1]), '<', `0.${box()}`, '<', frac(hi[0], hi[1])),
        explain: `${frac(lo[0], lo[1])} = ${sx(lo[2], 2)}, ${frac(hi[0], hi[1])} = ${sx(hi[2], 2)}이다. ${sx(lo[2], 2)}보다 크고 ${sx(hi[2], 2)}보다 작은 소수 한 자리 수는 0.${digit}뿐이다.`,
        facts: { digit: { template: `${lo[0]}/${lo[1]}<0.□<${hi[0]}/${hi[1]}`, lo: 1, hi: 9, ask: 'max' } }
      });
    }, { count: 2 }),
    T('deci-word-two', '분수와 소수로 나타낸 두 양의 비교', '①81 ②78 ③82 심76', (d) => {
      const b = d.pick([4, 5, 20, 25]), a = coTop(d, b), x = a * 100 / b, v = d.until(() => x + d.pick([-10, -6, -5, -4, 4, 5, 6, 10]), (y) => y >= 10 && y <= 95);
      const [p, q] = d.shuffle(NAMES).slice(0, 2), [first, second] = d.bool() ? [Fr(a, b), Dc(v, 2)] : [Dc(v, 2), Fr(a, b)], more = cmp(first, second) > 0 ? p : q;
      return C(`${name(p, '은/는')} 끈을 ${first.html} m, ${name(q, '은/는')} ${second.html} m 사용하였다. 끈을 더 많이 사용한 사람은?`, [p, '두 사람이 사용한 길이는 같다.', q], sign(cmp(first, second), 0), {
        explain: `${fj(a, b, '을/를')} 소수로 나타내면 ${sx(x, 2)}이다. ${first.html} ${SG(first, second)} ${second.html}이므로 ${name(more, '이/가')} 더 많이 사용하였다.`,
        facts: { choose: { exprs: [first.expr, second.expr], rule: 'compare' } }
      });
    }),
    T('deci-word-mixed', '대분수와 소수로 나타낸 두 거리의 비교', '①81 ②78 ③82 심76', (d) => {
      // 더 가까운 곳(작은 쪽)을 묻는다.
      const w = d.int(1, 5), b = d.pick([4, 5, 20, 25]), a = coTop(d, b), x = a * 100 / b, v = d.until(() => x + d.pick([-8, -6, -4, -3, 3, 4, 6, 8]), (y) => y >= 5 && y <= 95);
      const [s1, s2] = d.pick([['수영장', '박물관'], ['체육관', '도서관'], ['놀이터', '우체국']]), dec = Dc(w * 100 + v, 2), f = Mx(w, a, b);
      return C(`집에서 ${s1}까지의 거리는 ${dec.html} km이고, 집에서 ${s2}까지의 거리는 ${f.html} km이다. 집에서 더 가까운 곳은?`, [s1, '두 곳까지의 거리는 같다.', s2], sign(cmp(f, dec), 0), {
        explain: `${vj(f, '을/를')} 소수로 나타내면 ${sx(w * 100 + x, 2)}이다. ${dec.html} ${SG(dec, f)} ${f.html}이므로 ${cmp(dec, f) < 0 ? s1 : s2}까지의 거리가 더 짧다.`,
        facts: { choose: { exprs: [f.expr, dec.expr], rule: 'compare' } }
      });
    }),
    T('deci-word-three', '분수와 소수로 나타낸 세 양의 비교(가장 큰 것)', '①82 ②79 ③83 심77', (d) => {
      const [p, q, x3] = nearHundredths(d), w = d.int(1, 3), vs = d.shuffle([Mx(w, p[0], p[1]), Mx(w, q[0], q[1]), Dc(w * 100 + x3, 2)]), who = d.shuffle(NAMES).slice(0, 3), hit = best(vs, true);
      return C(`멀리뛰기를 하여 ${name(who[0], '은/는')} ${vs[0].html} m, ${name(who[1], '은/는')} ${vs[1].html} m, ${name(who[2], '은/는')} ${vs[2].html} m를 뛰었다. 가장 멀리 뛴 사람은?`, who, hit, {
        explain: `대분수를 소수로 나타내면 ${vs.filter((v) => !v.dec).map((v) => `${v.html} = ${sx(v.top * 100 / v.den, 2)}`).join(', ')}이다. 가장 큰 수는 ${vs[hit].html}이다.`,
        facts: { choose: { exprs: vs.map((v) => v.expr), rule: 'max' } }
      });
    }),
    T('deci-word-three-order', '분수와 소수로 나타낸 세 양을 차례대로 쓰기', '①82 ②79 ③83 심77', (d) => {
      const [p, q, x3] = nearHundredths(d), vs = d.shuffle([Fr(p[0], p[1]), Fr(q[0], q[1]), Dc(x3, 2)]), who = d.shuffle(NAMES).slice(0, 3), pick = orderChoice(d, vs, who, true);
      return C(`주스를 ${name(who[0], '은/는')} ${vs[0].html} L, ${name(who[1], '은/는')} ${vs[1].html} L, ${name(who[2], '은/는')} ${vs[2].html} L 마셨다. 주스를 많이 마신 사람부터 차례대로 쓴 것은?`, pick.options, pick.answer, {
        explain: `분수를 소수로 나타내면 ${vs.filter((v) => !v.dec).map((v) => `${v.html} = ${sx(v.top * 100 / v.den, 2)}`).join(', ')}이다. 많이 마신 사람부터 쓰면 ${pick.right.map((i) => who[i]).join(', ')}의 차례이다.`,
        facts: { choose: { exprs: vs.map((v) => v.expr), rule: 'descending', orders: pick.list } }
      });
    })
  ]);

  // ── 실력 ──
  B.addGroup('5-1-4', {
    id: 'hard', title: '실력 문제', standard: EQ,
    types: [
      // ── ① 문제의 상황·그림·수에 함정이 있어 뜻을 정확히 대야 풀리는 문제 ──
      H('hard-area-trap', '크기가 다른 두 도형에 색칠한 같은 크기의 분수', '기본 ①1 ②1', (d) => {
        // 보기마다 고르는 아이 — 「넓이도 같다」: 분수가 같으면 나타내는 양도 같다고 여기는 아이(전체의 크기가 다른 것을 보지 않는다),
        //  「작은 쪽이 더 넓다」: 색칠한 칸 수가 많은 쪽을 고르거나 그림을 보지 않는 아이, 「…보다 큰 분수이다」: 분모와 분자가 큰 분수가 더 크다고 여기는 아이
        const [a, b] = d.pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4]]), k = b === 2 ? d.pick([2, 3]) : 2, firstBig = d.bool(), bigFine = d.bool();
        const fine = [a * k, b * k], coarse = [a, b], big = bigFine ? fine : coarse, small = bigFine ? coarse : fine, first = firstBig ? big : small, second = firstBig ? small : big;
        const bigName = firstBig ? '가' : '나', smallName = firstBig ? '나' : '가';
        const rows = d.shuffle([
          [`색칠한 부분의 넓이는 ${bigName} 쪽이 더 넓다.`, true],
          [`${fj(first[0], first[1], '과/와')} ${fj(second[0], second[1], '은/는')} 크기가 같은 분수이므로 색칠한 부분의 넓이도 같다.`, false],
          [`색칠한 부분의 넓이는 ${smallName} 쪽이 더 넓다.`, false],
          [`${fj(fine[0], fine[1], '은/는')} ${frac(coarse[0], coarse[1])}보다 큰 분수이다.`, false]
        ]);
        return C(`가와 나는 크기가 다른 직사각형이다. 각각을 똑같이 나누어 가는 전체의 ${frac(first[0], first[1])}만큼, 나는 전체의 ${frac(second[0], second[1])}만큼 색칠하였다. 옳은 것은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
          figure: twoSizes(first, second, firstBig),
          explain: `${fj(first[0], first[1], '과/와')} ${fj(second[0], second[1], '은/는')} 크기가 같은 분수이지만, 전체의 크기가 다르면 같은 분수가 나타내는 양도 다르다. 전체가 더 큰 ${bigName}의 색칠한 부분이 더 넓다.`,
          facts: { truth: rows.map((row) => row[1]), want: true }
        });
      }),
      H('hard-added-count', '같은 수를 더하거나 뺀 분수를 섞어 놓고 크기가 같은 분수 세기', '심5·19 / 기본 ①8·16 ②10·11', (d) => {
        // 함정: 분모와 분자에 같은 수를 더한 분수, 같은 수를 뺀 분수, 분모만 2배 한 분수. 「같은 수를 더하거나 빼도 크기가 같다」고 여기는 아이는 이것까지 센다.
        const { A, Bg, list } = d.until(() => {
          const [a, b] = reduced(d, 3, 6, (x) => x >= 2), g = d.pick([2, 3]), top = a * g, bot = b * g, k = d.pick([1, 2]);
          const equals = d.shuffle([[a, b], [top * 2, bot * 2], [a * (g + 1), b * (g + 1)], [a * 5, b * 5]]).slice(0, d.pick([2, 3]));
          const traps = d.shuffle([[top + k, bot + k], [top + 3, bot + 3], [top - 1, bot - 1], [top, bot * 2]]).slice(0, 6 - equals.length);
          return { A: top, Bg: bot, list: d.shuffle(equals.concat(traps)) };
        }, (made) => new Set(made.list.map(String)).size === 6);
        const flags = list.map(([x, y]) => x * Bg === y * A), hits = list.filter((_, i) => flags[i]);
        return N(`${fj(A, Bg, '과/와')} 크기가 같은 분수는 모두 몇 개인가?`, hits.length, {
          unit: '개', figure: numbers(list.map((row) => frac(...row))),
          explain: `분모와 분자에 0이 아닌 같은 수를 곱하거나 분모와 분자를 0이 아닌 같은 수로 나눈 분수만 크기가 같다. ${hits.map((row) => frac(...row)).join(', ')}${tail(hits[hits.length - 1][0], '으로/로')} ${hits.length}개이다. 분모와 분자에 같은 수를 더하거나 뺀 분수는 크기가 다르다.`,
          facts: { count: flags }
        });
      }),
      H('hard-top-trap', '공통분모가 다른 통분 결과의 분자끼리 비교하는 함정', '심51 / 기본 ①59 ②60', (d) => {
        // ㉡이 가장 작다. ㉠과 ㉢은 통분한 분자가 큰 쪽이 실제로는 더 작다 — 공통분모가 다른 채로 분자끼리 비교하는 아이가 틀린 쪽을 고른다.
        const [p, q, r] = d.until(() => d.shuffle([3, 4, 5, 6, 8, 9, 10, 12]).slice(0, 3).map((den) => [coTop(d, den), den]), ([x, y, z]) => {
          const L1 = lcm(x[1], y[1]), L2 = lcm(y[1], z[1]), x1 = x[0] * L1 / x[1], y1 = y[0] * L1 / y[1], y2 = y[0] * L2 / y[1], z2 = z[0] * L2 / z[1], xz = x[0] * z[1] - z[0] * x[1];
          return L1 !== L2 && x1 > y1 && z2 > y2 && xz !== 0 && x1 !== z2 && (x1 > z2) === (xz < 0);
        });
        const L1 = lcm(p[1], q[1]), L2 = lcm(q[1], r[1]), vs = [Fr(...p), Fr(...q), Fr(...r)], hit = best(vs, true);
        return C('세 분수 ㉠, ㉡, ㉢의 크기를 비교하려고 두 분수씩 통분하였다. 가장 큰 분수는?', THREE, hit, {
          figure: numbers(vs.map((v, i) => `${LAB[i]} ${v.html}`)) + lines([`㉠과 ㉡을 통분: ${ex(duo(frac(p[0] * L1 / p[1], L1), frac(q[0] * L1 / q[1], L1)))}`, `㉡과 ㉢을 통분: ${ex(duo(frac(q[0] * L2 / q[1], L2), frac(r[0] * L2 / r[1], L2)))}`]),
          explain: `㉡은 ㉠보다도 ㉢보다도 작다. ㉠과 ㉢은 공통분모가 다른 채로 분자끼리 비교할 수 없으므로 다시 통분한다. ${both(p[0], p[1], r[0], r[1])}이므로 ${vs[0].html} ${SG(vs[0], vs[2])} ${vs[2].html}이다.`,
          facts: { choose: { exprs: vs.map((v) => v.expr), rule: 'max' } }
        });
      }),
      H('hard-lookalike-order', '숫자가 닮은 분수와 소수의 차례', '심59·60 / 기본 ①76 ②76', (d) => {
        // 숫자가 닮은 분수와 소수를 짝 지어 놓았다(1/5 과 0.5, 2/5 와 0.25). 틀린 보기는 분수의 숫자를 그대로 소수로 옮기는 아이(a/b 를 0.b, 0.a, 0.ab 로 읽는다)가 쓰는 차례다.
        const LOOK = [[[1, 5], [5, 1]], [[2, 5], [25, 2]], [[1, 4], [4, 1]], [[1, 2], [2, 1]], [[3, 4], [34, 2]], [[1, 8], [8, 1]], [[3, 5], [35, 2]], [[1, 4], [14, 2]], [[4, 5], [45, 2]], [[2, 5], [2, 1]], [[1, 5], [15, 2]], [[3, 4], [3, 1]]];
        const vs = d.until(() => d.shuffle(d.shuffle(LOOK).slice(0, 2).reduce((all, [f, c]) => all.concat([Fr(...f), Dc(...c)]), [])), distinct);
        const misread = [(v) => v.den / 10, (v) => v.top / 10, (v) => (v.top * 10 + v.den) / 100].map((read) => { const val = vs.map((v) => (v.dec ? v.top / v.den : read(v))); return vs.map((_, i) => i).sort((x, y) => val[y] - val[x] || x - y); });
        const pick = orderChoice(d, vs, vs.map((v) => v.html), true, misread);
        return C('분수와 소수가 섞인 네 수를 큰 수부터 차례대로 쓴 것은?', pick.options, pick.answer, {
          figure: numbers(vs.map((v) => v.html)),
          explain: `분수를 소수로 나타내면 ${vs.filter((v) => !v.dec).map((v) => `${v.html} = ${sx(v.top * 1000 / v.den, 3)}`).join(', ')}이다. 큰 수부터 쓰면 ${pick.right.map((i) => vs[i].html).join(', ')}의 차례이다.`,
          facts: { choose: { exprs: vs.map((v) => v.expr), rule: 'descending', orders: pick.list } }
        });
      }),
      H('hard-between-equal', '「보다 크고 보다 작은」에서 끝 수와 크기가 같은 수 가려내기', '심61', (d) => {
        // 함정: 위쪽 끝의 분수와 크기가 같은 소수(16/20 = 0.8), 아래쪽 끝의 소수와 크기가 같은 분수(0.5 = 1/2). 「보다 큰」「보다 작은」에 같은 수를 넣는 아이는 더 많이 센다.
        const t1 = d.int(3, 5), t2 = t1 + d.pick([2, 3]), k = d.pick([2, 4, 5]), g = gcd(t1, 10), lo = Dc(t1, 1), hi = Fr(t2 * k, 10 * k), cands = [];
        for (let v = t1 * 10 + 2; v <= t2 * 10 - 2; v += 1) if (v % 10 !== 0) cands.push(v);
        const ins = d.shuffle(cands).slice(0, d.pick([2, 3])).map((v) => Dc(v, 2)).sort(cmp), same = Fr(t1 / g, 10 / g);
        const list = [same, Dc(t2, 1), Dc(t2 * 10 + d.pick([4, 6, 12]), 2)].concat(ins).sort(cmp);
        return N(`${lo.html}보다 크고 ${hi.html}보다 작은 수는 모두 몇 개인가?`, ins.length, {
          unit: '개', figure: numbers(list.map((v) => v.html)),
          explain: `${hi.html} = ${frac(t2, 10)} = ${sx(t2, 1)}이다. ${vj(same, '은/는')} ${lo.html}${tail(t1, '과/와')} 크기가 같고 ${sx(t2, 1)}${tail(t2, '은/는')} ${hi.html}${tail(t2 * k, '과/와')} 크기가 같으므로 세지 않는다. ${lo.html}보다 크고 ${sx(t2, 1)}보다 작은 수는 ${ins.map((v) => v.html).join(', ')}${tail(ins[ins.length - 1].last, '으로/로')} ${ins.length}개이다.`,
          facts: { count: list.map((v) => cmp(v, lo) > 0 && cmp(v, hi) < 0) }
        });
      }),
      H('hard-reduced-biggest', '약분하여 만든 분수들의 크기', '기본 ②31', (d) => {
        // 보기마다 고르는 아이 — 분모와 분자가 가장 큰 분수: 수가 크면 분수도 크다고 여기는 아이, 기약분수: 약분할수록(분모가 작을수록) 커진다고 여기는 아이,
        //  가운데 분수: 뜻 없이 어림으로 고르는 아이. 약분하여도 크기는 변하지 않는다는 뜻을 대야 「모두 같다」를 고른다.
        const g = d.pick([6, 8]), [a, b] = reduced(d, 2, 7), A = a * g, Bg = b * g, forms = divisors(g).filter((v) => v > 1).map((v) => [A / v, Bg / v]);
        const rows = d.shuffle(forms.map((row) => [frac(...row), false]).concat([['세 분수의 크기는 모두 같다.', true]]));
        return C(`${fj(A, Bg, '을/를')} 약분하여 세 분수 ${forms.map((row) => frac(...row)).join(', ')}${tail(forms[2][0], '을/를')} 만들었다. 세 분수 가운데 크기가 가장 큰 분수는?`, rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
          explain: '약분은 분모와 분자를 같은 수로 나누는 것이므로 약분하여도 분수의 크기는 변하지 않는다. 세 분수는 모두 처음 분수와 크기가 같다.',
          facts: { truth: rows.map((row) => row[1]), want: true }
        });
      }),
      H('hard-add-keep', '분자에 수를 더하거나 빼도 크기가 같게 하기', '심8 / 기본 ②19 ③19', (d, n) => {
        // 함정: 분자에 더한(뺀) 수만큼 분모에도 더하면(빼면) 된다고 여기는 아이. 첫째 문항은 더하고, 둘째 문항은 뺀다.
        const [a, b] = reduced(d, 3, 9, (x) => x >= 2), k = d.int(3, 5);
        if (n === 0) {
          const p = a * (k - 1);
          return N(`${frac(a, b)}의 분자에 ${josa(p, '을/를')} 더하였다. 분수의 크기가 변하지 않으려면 분모에 얼마를 더해야 하는가?`, b * (k - 1), {
            explain: `분자는 ${a} + ${p} = ${a * k}${tail(a * k, '으로/로')} ${k}배가 된다. 분모도 ${k}배인 ${josa(b * k, '이/가')} 되어야 하므로 ${b * k} − ${b} = ${josa(b * (k - 1), '을/를')} 더한다.`,
            facts: { calc: [[`(${a}+${p})/${a}*${b}-${b}`, 0]] }
          });
        }
        const m = d.int(1, k - 1), A = a * k, Bk = b * k, s = a * (k - m);
        return N(`${frac(A, Bk)}의 분자에서 ${josa(s, '을/를')} 뺐다. 분수의 크기가 변하지 않으려면 분모에서 얼마를 빼야 하는가?`, b * (k - m), {
          explain: `분자는 ${A} − ${s} = ${a * m}이다. ${fj(A, Bk, '을/를')} 기약분수로 나타내면 ${frac(a, b)}이므로, 분자가 ${a * m}인 크기가 같은 분수는 ${frac(a * m, b * m)}이다. 분모에서 ${Bk} − ${b * m} = ${josa(b * (k - m), '을/를')} 뺀다.`,
          facts: { calc: [[`${Bk}-(${A}-${s})*${Bk}/${A}`, 0]] }
        });
      }, { count: 2 }),
      H('hard-product-back', '두 분모의 곱으로 통분한 것에서 통분하기 전의 분수', '심46', (d) => {
        // 함정: 통분한 분수를 약분하여 기약분수로 나타내면 처음 분수가 나온다고 여기는 아이(다른 분수는 기약분수가 아니다).
        //  공통분모가 「두 분모의 곱」이라는 데에서 다른 분수의 분모를 먼저 찾아야 한다.
        const [a, b, c, e] = d.until(() => { const [z, s] = d.pick([[2, 4], [2, 6], [4, 6], [2, 8], [6, 8], [3, 9], [6, 9], [4, 10], [6, 10], [8, 10], [3, 6], [4, 8]]), y = d.int(3, 9); return [coTop(d, y), y, z, s]; }, ([x, y, z, s]) => y !== s && x * s !== z * y);
        const Nn = b * e, shown = d.bool() ? duo(frac(a * e, Nn), frac(c * b, Nn)) : duo(frac(c * b, Nn), frac(a * e, Nn));
        return M(`어떤 두 분수를 두 분모의 곱을 공통분모로 하여 통분하였더니 다음과 같이 되었다. 두 분수 가운데 하나가 ${frac(a, b)}일 때, 다른 분수를 구하려고 한다. ㉠, ㉡에 알맞은 수는?`, labelled([c, e]), {
          figure: lines([ex(shown), `다른 분수: ${ex(blankFrac(0, 1))}`]),
          explain: `공통분모 ${josa(Nn, '은/는')} 두 분모의 곱이므로 다른 분수의 분모는 ${Nn} ÷ ${b} = ${e}이다. 다른 분수의 분모와 분자에는 ${josa(b, '을/를')} 곱했으므로 분자는 ${c * b} ÷ ${b} = ${c}이다. 따라서 ${frac(c, e)}이다.`,
          facts: { calc: [[`${c * b}/${b}`, 0], [`${Nn}/${b}`, 1]] }
        });
      }),

      // ── ② 두 번 넘게 생각해야 풀리는 문제 ──
      H('hard-two-digit-den', '분모가 두 자리 수인 크기가 같은 분수의 수', '기본 ②16', (d) => {
        const b = d.int(5, 9), a = coTop(d, b), first = Math.floor(9 / b) + 1, last = Math.floor(99 / b);
        return N(`${fj(a, b, '과/와')} 크기가 같은 분수 가운데 분모가 두 자리 수인 분수는 모두 몇 개인가?`, last - first + 1, {
          unit: '개', explain: `분모는 ${b}의 배수이다. 두 자리 수인 ${b}의 배수는 ${b} × ${first} = ${b * first}부터 ${b} × ${last} = ${b * last}까지이므로 ${last} − ${first} + 1 = ${last - first + 1}(개)이다.`,
          facts: { digit: { template: `9<□*${b}<100`, lo: 1, hi: 99, ask: 'count' } }
        });
      }),
      H('hard-reduced-under', '약분한 분수 가운데 분자가 어떤 수보다 작은 것의 수', '심12 / 기본 ③27', (d) => {
        const { A, Bg, t, forms, hits } = d.until(() => {
          const g = d.pick([12, 18, 20, 24]), [a, b] = reduced(d, 3, 7, (x) => x >= 2), top = a * g, bot = b * g, limit = d.pick([10, 15, 20, 25, 30]), all = divisors(g).filter((v) => v > 1).map((v) => [top / v, bot / v]);
          return { A: top, Bg: bot, t: limit, forms: all, hits: all.filter((row) => row[0] < limit) };
        }, (made) => made.hits.length >= 2 && made.hits.length < made.forms.length && made.forms.every((row) => row[0] !== made.t));
        return N(`${fj(A, Bg, '을/를')} 약분하여 만들 수 있는 분수 가운데 분자가 ${t}보다 작은 분수는 모두 몇 개인가?`, hits.length, {
          unit: '개', explain: `${josa(A, '과/와')} ${Bg}의 1이 아닌 공약수마다 약분하면 ${forms.map((row) => frac(...row)).join(', ')}이다. 이 가운데 분자가 ${t}보다 작은 분수는 ${hits.map((row) => frac(...row)).join(', ')}${tail(hits[hits.length - 1][0], '으로/로')} ${hits.length}개이다.`,
          facts: { digit: { template: `${A}%□+${Bg}%□<1<${t}*□-${A}+1`, lo: 2, hi: A, ask: 'count' } }
        });
      }),
      H('hard-proper-count-range', '분모가 범위로 주어진 진분수 가운데 기약분수의 수', '심30', (d) => {
        const lo = d.int(3, 8), dens = [lo + 1, lo + 2], all = [];
        for (const den of dens) for (let top = 1; top < den; top += 1) all.push([top, den]);
        const flags = all.map(([x, y]) => gcd(x, y) === 1), per = dens.map((den) => all.filter(([x, y]) => y === den && gcd(x, y) === 1));
        return N(`분모가 ${lo}보다 크고 ${lo + 3}보다 작은 진분수 가운데 기약분수는 모두 몇 개인가?`, flags.filter(Boolean).length, {
          unit: '개', explain: `분모는 ${dens[0]} 또는 ${dens[1]}이다. 분모가 ${dens[0]}인 기약분수는 ${per[0].map((row) => frac(...row)).join(', ')}${tail(per[0][per[0].length - 1][0], '으로/로')} ${per[0].length}개, 분모가 ${dens[1]}인 기약분수는 ${per[1].map((row) => frac(...row)).join(', ')}${tail(per[1][per[1].length - 1][0], '으로/로')} ${per[1].length}개이므로 모두 ${per[0].length + per[1].length}개이다.`,
          facts: { count: flags }
        });
      }),
      H('hard-unit-top', '기약분수로 나타내면 분자가 1이 되는 분자의 수', '심31', (d) => {
        const den = d.pick([12, 18, 20, 24, 28, 30, 36, 40]), list = divisors(den).filter((v) => v > 1 && v < den);
        return N(`분모가 ${den}인 진분수를 기약분수로 나타내었더니 분자가 1이 되었다. 처음 진분수의 분자가 될 수 있는 수 가운데 1이 아닌 수는 모두 몇 개인가?`, list.length, {
          unit: '개', explain: `분자가 1이 되려면 분모와 분자를 분자로 나눌 수 있어야 하므로 분자는 ${den}의 약수이다. ${den}의 약수 가운데 1과 ${josa(den, '을/를')} 뺀 ${list.join(', ')}${tail(list[list.length - 1], '으로/로')} ${list.length}개이다.`,
          facts: { digit: { template: `${den}%□<1`, lo: 2, hi: den - 1, ask: 'count' } }
        });
      }),
      H('hard-simplest-below', '기준 분수보다 작은, 분모가 정해진 기약분수의 수', '기본 ②35', (d) => {
        const [den, t] = d.until(() => { const n = d.pick([12, 15, 16, 18, 20]); return [n, d.int(5, n - 2)]; }, ([n, v]) => gcd(n, v) === 1), list = [];
        for (let v = 1; v < t; v += 1) if (gcd(v, den) === 1) list.push(v);
        return N(`${frac(t, den)}보다 작은 분수 가운데 분모가 ${den}인 기약분수는 모두 몇 개인가?`, list.length, {
          unit: '개', explain: `분자는 ${t}보다 작고 ${den}${tail(den, '과/와')} 공약수가 1뿐인 수이다. 분자는 ${list.join(', ')}${tail(list[list.length - 1], '으로/로')} ${list.length}개이다.`,
          facts: { digit: { template: `${coprimeTo(den)}>0`, lo: 1, hi: t - 1, ask: 'count' } }
        });
      }),
      H('hard-part-rest', '나머지가 전체의 얼마인지 기약분수로 나타내기', '심32 / 기본 ②36 ③39', (d) => {
        const [p, t] = reduced(d, 3, 12), g = d.int(2, 8), total = t * g, part = total - p * g;
        const [all, one, other] = d.pick([['학생', '안경을 쓴 학생', '안경을 쓰지 않은 학생'], ['학생', '체험 학습으로 박물관에 가고 싶은 학생', '나머지 학생'], ['학생', '우유를 좋아하는 학생', '우유를 좋아하지 않는 학생']]);
        return F(`${all} ${total}명 가운데 ${one}${josa(one, '은/는').slice(one.length)} ${part}명이다. ${josa(other, '은/는')} 전체의 얼마인지 기약분수로 나타내면?`, p, t, {
          explain: `${josa(other, '은/는')} ${total} − ${part} = ${total - part}(명)이므로 전체의 ${frac(total - part, total)}이다. 분모와 분자를 각각 최대공약수 ${josa(g, '으로/로')} 나누면 ${frac(p, t)}이다.`,
          facts: { calc: [[`(${total}-${part})/${g}`, 0], [`${total}/${g}`, 1]], unseen: [g] }
        });
      }),
      H('hard-undo', '약분한 결과에서 거슬러 처음 분수 구하기', '심36·37 / 기본 ③35', (d, n) => {
        // 첫째 문항은 분자에 수를 더한 다음 약분한 것, 둘째 문항은 분모에 수를 더한 다음 기약분수로 나타낸 것.
        const [a, b] = reduced(d, 3, 9, (x) => x >= 2);
        if (n === 0) {
          const k = d.int(3, 8), p = d.int(1, Math.min(6, a * k - 2));
          return M(`어떤 분수의 분자에 ${josa(p, '을/를')} 더한 다음 분모와 분자를 각각 ${josa(k, '으로/로')} 나누어 약분하였더니 ${fj(a, b, '이/가')} 되었다. 어떤 분수를 구할 때, ㉠, ㉡에 알맞은 수는?`, labelled([a * k - p, b * k]), {
            figure: ex(blankFrac(0, 1)),
            explain: `약분하기 전의 분수는 ${frac(a, b)}의 분모와 분자에 각각 ${josa(k, '을/를')} 곱한 ${frac(a * k, b * k)}이다. 분자에 ${josa(p, '을/를')} 더하기 전의 분자는 ${a * k} − ${p} = ${a * k - p}이므로 ${frac(a * k - p, b * k)}이다.`,
            facts: { calc: [[`${a}*${k}-${p}`, 0], [`${b}*${k}`, 1]] }
          });
        }
        const [m, p] = d.until(() => [d.int(2, 5), d.int(1, 5)], ([x, y]) => a * x < b * x - y), den = b * m - p;
        return N(`분모가 ${den}인 어떤 분수의 분모에 ${josa(p, '을/를')} 더한 다음 기약분수로 나타내었더니 ${fj(a, b, '이/가')} 되었다. 어떤 분수의 분자는?`, a * m, {
          explain: `분모에 ${josa(p, '을/를')} 더하면 ${den} + ${p} = ${b * m}이다. ${fj(a, b, '과/와')} 크기가 같고 분모가 ${b * m}인 분수는 ${frac(a * m, b * m)}이다. 분자는 바뀌지 않았으므로 ${a * m}이다.`,
          facts: { calc: [[`${a}*(${den}+${p})/${b}`, 0]] }
        });
      }, { count: 2 }),
      H('hard-common-near', '100에 가장 가까운 공통분모로 통분하기', '심43 / 기본 ①48 ②48', (d) => {
        // 100보다 큰 쪽이 더 가까울 수도 있다(18의 배수는 90보다 108이 더 가깝다).
        const NEAR = GENERAL.concat(COPRIME).filter(([x, y]) => { const L = lcm(x, y), low = Math.floor(100 / L) * L; return L >= 12 && L <= 48 && low !== 100 && 100 - low !== low + L - 100; });
        const [a, b, c, e] = twoFracs(d, NEAR), L = lcm(b, e), low = Math.floor(100 / L) * L, Nn = 100 - low < low + L - 100 ? low : low + L;
        return M('공통분모가 100에 가장 가까운 수가 되도록 통분할 때, ㉠, ㉡, ㉢에 알맞은 수는?', labelled([a * Nn / b, c * Nn / e, Nn]), {
          figure: arrow(duo(frac(a, b), frac(c, e)), duo(blankFrac(0, 2), blankFrac(1, 2))),
          explain: `공통분모는 ${josa(b, '과/와')} ${e}의 최소공배수 ${L}의 배수이다. 100에 가까운 ${L}의 배수는 ${josa(low, '과/와')} ${low + L}이고, 100과의 차는 각각 ${100 - low}, ${low + L - 100}이므로 ${josa(Nn, '이/가')} 더 가깝다. ${duo(frac(a * Nn / b, Nn), frac(c * Nn / e, Nn))}`,
          facts: { calc: [[`${a}*${Nn / b}`, 0], [`${c}*${Nn / e}`, 1], [`${b}*${Nn / b}`, 2]], unseen: [Nn / b, Nn / e] }
        });
      }),
      H('hard-common-masked', '통분한 결과에서 가려진 분모와 분자', '심45 / 기본 ①51 ②51 ③53', (d) => {
        const [a, b, c, e] = twoFracs(d, GENERAL.filter(([x, y]) => lcm(x, y) <= 60)), Nn = lcm(b, e) * d.pick([1, 1, 2]), x = a * Nn / b, y = c * Nn / e;
        return M('두 분수를 통분한 것이다. ㉠, ㉡에 알맞은 수는?', labelled([b, y]), {
          figure: arrow(duo(frac(a, box(LAB[0])), frac(c, e)), duo(frac(x, Nn), frac(box(LAB[1]), Nn))),
          explain: `분자 ${josa(a, '이/가')} ${josa(x, '이/가')} 되었으므로 분모와 분자에 ${x} ÷ ${a} = ${josa(x / a, '을/를')} 곱한 것이다. ㉠ × ${x / a} = ${Nn}에서 ㉠은 ${b}이다. ${Nn} ÷ ${e} = ${Nn / e}이므로 ㉡은 ${c} × ${Nn / e} = ${y}이다.`,
          facts: { calc: [[`${Nn}*${a}/${x}`, 0], [`${c}*${Nn}/${e}`, 1]] }
        });
      }),
      H('hard-common-before', '통분하기 전의 두 기약분수', '심44 / 기본 ①52 ②50 ③52', (d) => {
        const [a, b, c, e] = twoFracs(d, MID.filter(([x, y]) => lcm(x, y) <= 60)), Nn = lcm(b, e) * d.pick([1, 1, 2]), x = a * Nn / b, y = c * Nn / e;
        return M('어떤 두 기약분수를 통분하였더니 다음과 같이 되었다. 통분하기 전의 두 기약분수를 구할 때, ㉠, ㉡, ㉢, ㉣에 알맞은 수는?', labelled([a, b, c, e]), {
          figure: lines([ex(duo(frac(x, Nn), frac(y, Nn))), `통분하기 전: ${ex(duo(blankFrac(0, 1), blankFrac(2, 3)))}`]),
          explain: `통분한 분수를 각각 기약분수로 나타낸다. ${frac(x, Nn)} = ${frac(a, b)}, ${frac(y, Nn)} = ${frac(c, e)}`,
          facts: { calc: [[`${x}/${Nn / b}`, 0], [`${Nn}/${Nn / b}`, 1], [`${y}/${Nn / e}`, 2], [`${Nn}/${Nn / e}`, 3]], unseen: [Nn / b, Nn / e] }
        });
      }),
      H('hard-table-common', '표에서 전체의 얼마인지 분수로 나타내어 통분하기', '심47', (d) => {
        const [t1, t2] = d.shuffle([20, 25, 50]).slice(0, 2), [m1, m2] = d.until(() => [d.int(6, t1 - 6), d.int(6, t2 - 6)], ([x, y]) => x * 100 / t1 !== y * 100 / t2 && Math.abs(x * 100 / t1 - y * 100 / t2) <= 12);
        return M('두 모둠의 학생 수를 나타낸 표이다. 모둠마다 남학생 수는 모둠 전체 학생 수의 얼마인지 분수로 나타낸 다음, 두 분수를 분모가 100인 분수로 통분하려고 한다. ㉠, ㉡에 알맞은 수는?', labelled([m1 * 100 / t1, m2 * 100 / t2]), {
          figure: table(['모둠', '남학생(명)', '여학생(명)'], [['가', m1, t1 - m1], ['나', m2, t2 - m2]]) + lines([`가: ${ex(frac(box(LAB[0]), 100))}, 나: ${ex(frac(box(LAB[1]), 100))}`]),
          explain: `가 모둠의 학생은 ${m1} + ${t1 - m1} = ${t1}(명)이므로 남학생은 전체의 ${frac(m1, t1)}이고, 나 모둠의 학생은 ${m2} + ${t2 - m2} = ${t2}(명)이므로 남학생은 전체의 ${frac(m2, t2)}이다. 분모가 100이 되도록 통분하면 ${duo(frac(m1 * 100 / t1, 100), frac(m2 * 100 / t2, 100))}이다.`,
          facts: { calc: [[`${m1}*100/(${m1}+${t1 - m1})`, 0], [`${m2}*100/(${m2}+${t2 - m2})`, 1]] }
        });
      }),
      H('hard-box-lcm', '□ 안에 들어갈 수 있는 자연수(통분하여 범위 구하기)', '심57 / 기본 ①66 ②62 ③65', (d, n) => {
        // 두 분모가 배수 관계가 아니어서 둘 다 통분해야 하고, □ × (곱한 수)가 나누어떨어지지 않는 수와 비교된다. 첫째 문항은 개수, 둘째 문항은 가장 작은 수.
        const [a, b, e] = d.until(() => { const [y, s] = d.shuffle(d.pick(MID)); return [coTop(d, y), y, s]; }, ([x, y, s]) => (x * s) % y !== 0 && Math.floor(x * s / y) >= 2), L = lcm(b, e), m = L / e, x = a * L / b, bound = Math.floor(a * e / b);
        const why = `공통분모를 ${josa(L, '으로/로')} 하여 통분하면 ${frac(a, b)} = ${frac(x, L)}, ${frac('□', e)} = ${frac(`□ × ${m}`, L)}이다. `;
        if (n === 0) return N('□ 안에 들어갈 수 있는 자연수는 모두 몇 개인가?', bound, { unit: '개', figure: eq(frac(a, b), '>', frac(box(), e)), explain: why + `□ × ${josa(m, '이/가')} ${x}보다 작아야 하므로 □ 안에는 1부터 ${bound}까지의 자연수가 들어갈 수 있다.`, facts: { digit: { template: `${a}/${b}>□/${e}`, lo: 1, hi: e * 3, ask: 'count' }, rule: 'boxGeneralCount' } });
        return N('□ 안에 들어갈 수 있는 자연수 가운데 가장 작은 수는?', bound + 1, { figure: eq(frac(a, b), '<', frac(box(), e)), explain: why + `□ × ${josa(m, '이/가')} ${x}보다 커야 하므로 가장 작은 수는 ${bound + 1}이다.`, facts: { digit: { template: `${a}/${b}<□/${e}`, lo: 1, hi: e * 3, ask: 'min' }, rule: 'boxGeneralMin' } });
      }, { count: 2 }),
      H('hard-box-both', '두 분수 사이에 드는 □(양쪽 부등식)', '심58', (d) => {
        const [a, b, c, f, e, lowN, highN] = d.until(() => { const den = d.pick([12, 15, 18, 20, 24]), [y, s] = d.shuffle([2, 3, 4, 5, 6, 8, 9, 10]).slice(0, 2), x = coTop(d, y), z = coTop(d, s); return [x, y, z, s, den, Math.floor(x * den / y) + 1, Math.ceil(z * den / s) - 1]; },
          (made) => made[0] * made[3] < made[2] * made[1] && made[6] - made[5] >= 2 && made[6] - made[5] <= 7 && made[6] < made[4]);
        return N('□ 안에 들어갈 수 있는 자연수는 모두 몇 개인가?', highN - lowN + 1, {
          unit: '개', figure: eq(frac(a, b), '<', frac(box(), e), '<', frac(c, f)),
          explain: `${fj(a, b, '과/와')} ${frac('□', e)}의 크기를 통분하여 비교하면 □ 안에 들어갈 수 있는 가장 작은 수는 ${lowN}이고, ${frac('□', e)}의 크기를 ${fj(c, f, '과/와')} 통분하여 비교하면 가장 큰 수는 ${highN}이다. ${lowN}부터 ${highN}까지 ${highN - lowN + 1}개이다.`,
          facts: { digit: { template: `${a}/${b}<□/${e}<${c}/${f}`, lo: 1, hi: e * 2, ask: 'count' }, rule: 'boxBoth' }
        });
      }),
      H('hard-between-count', '두 분수 사이에 있는 분모가 정해진 분수의 수', '심54 / 기본 ①67 ②63 ③66', (d) => {
        const [a, b, c, e, Nn, count] = d.until(() => { const f = twoFracs(d, MID.filter(([x, y]) => lcm(x, y) <= 60)), L = lcm(f[1], f[3]) * d.pick([1, 1, 2]), [p, q] = f[0] * f[3] < f[2] * f[1] ? [[f[0], f[1]], [f[2], f[3]]] : [[f[2], f[3]], [f[0], f[1]]]; return [p[0], p[1], q[0], q[1], L, q[0] * L / q[1] - p[0] * L / p[1] - 1]; },
          (made) => made[5] >= 2 && made[5] <= 9 && made[4] <= 120), x = a * Nn / b, y = c * Nn / e;
        return N(`${frac(a, b)}보다 크고 ${frac(c, e)}보다 작은 분수 가운데 분모가 ${Nn}인 분수는 모두 몇 개인가?`, count, {
          unit: '개', explain: `분모가 ${Nn}${tail(Nn, '이/가')} 되도록 통분하면 ${frac(a, b)} = ${frac(x, Nn)}, ${frac(c, e)} = ${frac(y, Nn)}이다. 분자가 ${x}보다 크고 ${y}보다 작은 분수는 ${frac(x + 1, Nn)}부터 ${frac(y - 1, Nn)}까지 ${count}개이다.`,
          facts: { digit: { template: `${a}/${b}<□/${Nn}<${c}/${e}`, lo: 1, hi: Nn, ask: 'count' } }
        });
      }),
      H('hard-between-simplest', '두 분수 사이에 있는 분모가 정해진 기약분수', '심55 / 기본 ①67 ②63 ③67', (d) => {
        // 두 분수 사이의 분수는 둘 넘게 있지만 기약분수는 하나뿐이다(모든 분자를 따져 뽑는다).
        const { p, q, L, ins } = d.until(() => {
          const f = twoFracs(d, MID.filter(([x, y]) => lcm(x, y) <= 48)), common = lcm(f[1], f[3]) * d.pick([1, 2]), [lo, hi] = f[0] * f[3] < f[2] * f[1] ? [[f[0], f[1]], [f[2], f[3]]] : [[f[2], f[3]], [f[0], f[1]]], list = [];
          for (let v = lo[0] * common / lo[1] + 1; v < hi[0] * common / hi[1]; v += 1) list.push(v);
          return { p: lo, q: hi, L: common, ins: list };
        }, (made) => made.L <= 96 && made.ins.length >= 2 && made.ins.length <= 5 && made.ins.filter((v) => gcd(v, made.L) === 1).length === 1);
        const top = ins.find((v) => gcd(v, L) === 1);
        return F(`${frac(p[0], p[1])}보다 크고 ${frac(q[0], q[1])}보다 작은 분수 가운데 분모가 ${L}인 기약분수는?`, top, L, {
          explain: `분모가 ${L}${tail(L, '이/가')} 되도록 통분하면 ${frac(p[0], p[1])} = ${frac(p[0] * L / p[1], L)}, ${frac(q[0], q[1])} = ${frac(q[0] * L / q[1], L)}이다. 사이에 있는 분수 ${ins.map((v) => frac(v, L)).join(', ')} 가운데 기약분수는 ${frac(top, L)}뿐이다.`,
          facts: { digit: { template: `0<${coprimeTo(L)}*(□*${p[1]}-${p[0]}*${L})*(${q[0]}*${L}-□*${q[1]})`, lo: 1, hi: L - 1, ask: 'max' }, calc: [[String(L), 1]] }
        });
      }),
      H('hard-nearest', '주어진 분수에 가장 가까운 분수', '기본 ②64', (d) => {
        // 주어진 분수보다 큰 분수와 작은 분수가 섞여 있어 통분한 다음 분자의 차를 비교해야 한다.
        const FAM = [[4, 5, 10, 20], [3, 4, 6, 12], [2, 3, 6, 9, 18], [4, 6, 8, 12, 24], [5, 6, 10, 15, 30]];
        const { vs, L, at } = d.until(() => { const dens = d.shuffle(d.pick(FAM)).slice(0, 4), common = dens.reduce((acc, v) => lcm(acc, v), 1), list = dens.map((den) => Fr(coTop(d, den), den)); return { vs: list, L: common, at: list.map((v) => v.top * common / v.den) }; },
          (made) => {
            // 가장 가까운 분수와 둘째로 가까운 분수는 주어진 분수의 서로 다른 쪽에 있고, 세 분수 모두 주어진 분수에서 1/3 넘게 떨어져 있지 않다.
            const diffs = made.at.slice(1).map((v) => v - made.at[0]), gaps = diffs.map(Math.abs), order = [0, 1, 2].sort((x, y) => gaps[x] - gaps[y]);
            return gaps[order[0]] >= 1 && gaps[order[0]] * 6 <= made.L && new Set(gaps).size === 3 && diffs[order[0]] * diffs[order[1]] < 0 && gaps[order[2]] * 3 <= made.L;
          });
        const t = vs[0], opts = vs.slice(1), gaps = at.slice(1).map((v) => Math.abs(v - at[0])), hit = gaps.indexOf(Math.min(...gaps));
        return C(`${t.html}에 가장 가까운 분수는?`, opts.map((v) => v.html), hit, {
          explain: `공통분모를 ${josa(L, '으로/로')} 하여 통분하면 ${t.den === L ? '' : `${t.html} = ${frac(at[0], L)}이고, `}세 분수는 차례대로 ${at.slice(1).map((v) => frac(v, L)).join(', ')}이다. 분자의 차는 ${gaps.join(', ')}이므로 가장 가까운 분수는 ${opts[hit].html}이다.`,
          facts: { choose: { exprs: opts.map((v) => v.expr), rule: 'nearest', target: t.top / t.den } }
        });
      }),
      H('hard-order-four', '대분수와 소수가 섞인 네 수의 차례', '심60 / 기본 ①76 ②76', (d) => {
        // 자연수 부분이 같은 수가 둘씩 있다. 한쪽 대분수는 소수로 고칠 수 없어(분모 3·6·7·9) 소수를 분수로 고쳐 통분해야 한다.
        const made = d.until(() => {
          const w = d.int(1, 3), b1 = d.pick([2, 4, 5]), e1 = d.pick([3, 6, 7, 9]), c1 = coTop(d, e1), t = Math.min(9, Math.max(1, Math.round(c1 * 10 / e1) + d.pick([-1, 0, 1])));
          return [[Mx(w + 1, coTop(d, b1), b1), Dc((w + 1) * 10 + d.int(1, 9), 1)], [Mx(w, c1, e1), Dc(w * 10 + t, 1)]];
        }, (pairs) => distinct(pairs[0].concat(pairs[1])));
        const vs = d.shuffle(made[0].concat(made[1])), pick = orderChoice(d, vs, vs.map((v) => v.html), true);
        return C('대분수와 소수가 섞인 네 수를 큰 수부터 차례대로 쓴 것은?', pick.options, pick.answer, {
          figure: numbers(vs.map((v) => v.html)),
          explain: `자연수 부분이 큰 수가 더 크다. 자연수 부분이 같은 수끼리 비교하면 ${made.map(([m, c]) => `${m.html} ${SG(m, c)} ${c.html}`).join(', ')}이다(소수로 고칠 수 없는 분수는 소수를 분수로 고쳐 통분한다). 큰 수부터 쓰면 ${pick.right.map((i) => vs[i].html).join(', ')}의 차례이다.`,
          facts: { choose: { exprs: vs.map((v) => v.expr), rule: 'descending', orders: pick.list } }
        });
      }),
      H('hard-deci-box-both', '두 소수 사이에 드는 분수의 분자', '심65 / 기본 ①78', (d) => {
        const [e, t1, t2, list] = d.until(() => { const den = d.pick([4, 5, 8, 20, 25]), lo = d.int(1, 6), hi = lo + d.int(2, 6), ok = []; for (let x = 1; x < den * 2; x += 1) if (x * 10 > lo * den && x * 10 < hi * den) ok.push(x); return [den, lo, hi, ok]; },
          (made) => made[2] <= 12 && made[2] % 10 !== 0 && made[3].length >= 2 && made[3].length <= 6);
        return N('□ 안에 들어갈 수 있는 자연수는 모두 몇 개인가?', list.length, {
          unit: '개', figure: eq(sx(t1, 1), '<', frac(box(), e), '<', sx(t2, 1)),
          explain: `분모가 ${e}인 분수를 소수로 나타내어 비교한다. ${sx(t1, 1)}보다 크고 ${sx(t2, 1)}보다 작은 것은 ${list.map((x) => `${frac(x, e)} = ${sx(x * 1000 / e, 3)}`).join(', ')}이므로 ${list.length}개이다.`,
          facts: { digit: { template: `${sx(t1, 1)}<□/${e}<${sx(t2, 1)}`, lo: 1, hi: e * 2, ask: 'count' }, rule: 'boxDecimalBoth' }
        });
      }),
      H('hard-deci-between', '분수와 소수 사이에 있는 분모가 정해진 분수의 수', '심62', (d) => {
        const [p, q, t, Nn, list] = d.until(() => { const den = d.pick([4, 5, 10, 20]), top = coTop(d, den), up = d.int(2, 9), nn = d.pick([20, 30, 40, 60]), ok = []; for (let x = 1; x < nn; x += 1) if (x * den > top * nn && x * 10 < up * nn) ok.push(x); return [top, den, up, nn, ok]; },
          (made) => made[4].length >= 2 && made[4].length <= 8 && made[3] % made[1] === 0 && made[3] !== made[1]);
        return N(`${frac(p, q)}보다 크고 ${sx(t, 1)}보다 작은 분수 가운데 분모가 ${Nn}인 분수는 모두 몇 개인가?`, list.length, {
          unit: '개', explain: `분모가 ${Nn}인 분수로 고치면 ${frac(p, q)} = ${frac(p * Nn / q, Nn)}, ${sx(t, 1)} = ${frac(t, 10)} = ${frac(t * Nn / 10, Nn)}이다. 분자가 ${p * Nn / q}보다 크고 ${t * Nn / 10}보다 작은 분수는 ${list.length}개이다.`,
          facts: { digit: { template: `${p}/${q}<□/${Nn}<${sx(t, 1)}`, lo: 1, hi: Nn, ask: 'count' } }
        });
      }),
      H('hard-deci-between-mixed', '대분수와 소수 사이에 있는 분모가 정해진 대분수', '심64', (d) => {
        const [Nn, k] = d.pick([[10, 3], [10, 7], [20, 3], [20, 7], [20, 9], [20, 11], [20, 13], [20, 17]]), w = d.int(1, 6), g = gcd(k - 1, Nn), lowTop = (k - 1) / g, lowDen = Nn / g, up = Dc(w * 100 + (k + 1) * 100 / Nn, 2);
        return F(`분모가 ${Nn}인 대분수 가운데 ${mixed(w, lowTop, lowDen)}보다 크고 ${up.html}보다 작은 수는?`, k, Nn, {
          whole: w, explain: `분모가 ${Nn}인 대분수로 고치면 ${mixed(w, lowTop, lowDen)} = ${mixed(w, k - 1, Nn)}, ${up.html} = ${mixed(w, k + 1, Nn)}이다. 분수 부분의 분자가 ${k - 1}보다 크고 ${k + 1}보다 작은 수는 ${mixed(w, k, Nn)}이다.`,
          facts: { calc: [[String(w), 0], [`${lowTop}*${Nn}/${lowDen}+1`, 1], [String(Nn), 2]], unseen: [1] }
        });
      }),
      H('hard-word-time-order', '걸린 시간이 짧은 차례(분수와 소수)', '심77 / 기본 ①82 ②79', (d) => {
        // 걸린 시간이 짧을수록 빨리 도착한다(큰 수부터 쓰는 아이가 고르는 보기를 넣는다). 소수로 고칠 수 없는 분수가 끼어 있어 소수를 분수로 고쳐 통분해야 한다.
        const vs = d.until(() => { const b = d.pick([3, 6, 7, 9]), b2 = d.pick([4, 5]); return d.shuffle([Fr(coTop(d, b), b), Fr(coTop(d, b2), b2), Dc(d.int(3, 9), 1)]); }, (list) => distinct(list) && list.every((p) => list.every((q) => Math.abs(cmp(p, q)) * 3 <= p.den * q.den)));
        const who = d.shuffle(NAMES).slice(0, 3), slow = vs.map((_, i) => i).sort((x, y) => cmp(vs[y], vs[x])), pick = orderChoice(d, vs, who, false, [slow]);
        return C(`세 사람이 학교에서 동시에 출발하여 도서관까지 걸어갔다. 걸린 시간은 ${name(who[0], '이/가')} ${vs[0].html}시간, ${name(who[1], '이/가')} ${vs[1].html}시간, ${name(who[2], '이/가')} ${vs[2].html}시간이다. 도서관에 빨리 도착한 사람부터 차례대로 쓴 것은?`, pick.options, pick.answer, {
          explain: `걸린 시간이 짧을수록 빨리 도착한다. 소수를 분수로 고쳐 두 수씩 통분하여 비교하면 ${pick.right.map((i) => vs[i].html).join(` ${LT} `)}이다. 빨리 도착한 사람부터 쓰면 ${pick.right.map((i) => who[i]).join(', ')}의 차례이다.`,
          facts: { choose: { exprs: vs.map((v) => v.expr), rule: 'ascending', orders: pick.list } }
        });
      }),
      H('hard-word-rest', '나머지 부분을 구하여 세 양 비교하기', '심78', (d) => {
        const [a, b, x1, x2] = d.until(() => { const den = d.pick([4, 5, 20, 25]), top = coTop(d, den); return [top, den, top * 100 / den, d.int(21, 44)]; },
          ([, , p, q]) => { const r = 100 - p - q; return new Set([p, q, r]).size === 3 && Math.min(p, q, r) >= 20 && Math.max(p, q, r) - Math.min(p, q, r) <= 16; });
        const rest = 100 - x1 - x2, crops = d.pick([['토마토', '참외', '상추'], ['고구마', '감자', '옥수수'], ['장미', '튤립', '국화']]), dec = Dc(x2, 2), parts = [x1, x2, rest], hit = parts.indexOf(Math.max(...parts));
        return C(`밭 전체의 ${frac(a, b)}에는 ${josa(crops[0], '을/를')} 심고, 전체의 ${dec.html}에는 ${josa(crops[1], '을/를')} 심었다. 나머지 부분에는 모두 ${josa(crops[2], '을/를')} 심었다. 가장 넓은 부분에 심은 것은?`, crops, hit, {
          explain: `${fj(a, b, '을/를')} 소수로 나타내면 ${sx(x1, 2)}이다. 나머지 부분은 전체 1에서 두 부분을 뺀 1 − ${sx(x1, 2)} − ${dec.html} = ${sx(rest, 2)}이다. 세 수 가운데 가장 큰 수는 ${sx(parts[hit], 2)}이다.`,
          facts: { choose: { exprs: [`${a}/${b}`, dec.expr, `1-${a}/${b}-${dec.expr}`], rule: 'max' }, unseen: [1] }
        });
      }),
      H('hard-word-minutes', '가장 긴 시간을 분으로 나타내기', '심77', (d) => {
        // 분수와 소수로 적힌 시간을 비교한 다음, 분모가 60인 분수로 고쳐 분으로 나타낸다.
        const vs = d.until(() => { const [b1, b2] = d.shuffle([4, 5, 6, 10, 12, 15, 20]).slice(0, 2); return d.shuffle([Fr(coTop(d, b1), b1), Fr(coTop(d, b2), b2), Dc(d.int(2, 9), 1)]); }, (list) => distinct(list) && list.every((p) => list.every((q) => Math.abs(cmp(p, q)) * 4 <= p.den * q.den)));
        const who = d.shuffle(NAMES).slice(0, 3), hit = best(vs, true), top = vs[hit], mins = vs.map((v) => v.top * 60 / v.den);
        return N(`${name(who[0], '은/는')} ${vs[0].html}시간, ${name(who[1], '은/는')} ${vs[1].html}시간, ${name(who[2], '은/는')} ${vs[2].html}시간 동안 운동을 하였다. 가장 오래 운동한 사람이 운동한 시간은 몇 분인가?`, mins[hit], {
          unit: '분', explain: `세 시간을 분모가 60인 분수로 고치면 차례대로 ${mins.map((v) => frac(v, 60)).join(', ')}이다. 가장 큰 수는 ${frac(mins[hit], 60)}이고, 1시간은 60분이므로 ${frac(mins[hit], 60)}시간은 ${mins[hit]}분이다.`,
          facts: { calc: [[top.dec ? `${top.top}*60/10` : `${top.top}*60/${top.den}`, 0]], unseen: [60, 10] }
        });
      })
    ]
  });

  // 기본 묶음에 보태는 유형(분수끼리 하던 일을 분수와 소수로 한다. 고르기 한 번이라 실력에 넣지 않았다)
  B.addTypes('5-1-4', 'deci', [
    T('deci-wrong-pick', '분수와 소수의 크기 비교가 잘못된 것 고르기', '②74', (d) => {
      // 네 식 가운데 하나만 틀리다. 분수(대분수)를 소수로 고쳐 보아야 알 수 있게 두 수의 크기가 가깝다.
      const one = (whole) => {
        const b = d.pick([4, 5, 20, 25]), a = coTop(d, b), x = a * 100 / b, v = d.until(() => x + d.pick([-8, -5, -4, -2, 2, 4, 5, 8]), (y) => y >= 5 && y <= 95), w = whole ? d.int(1, 4) : 0;
        const f = whole ? Mx(w, a, b) : Fr(a, b), dec = Dc(w * 100 + v, 2);
        return d.bool() ? [f, dec] : [dec, f];
      };
      const made = d.until(() => d.shuffle([one(false), one(false), one(true), one(true)]), (list) => new Set(list.map(([p, q]) => p.html + q.html)).size === 4), bad = d.int(0, 3);
      const rows = made.map(([p, q], i) => ({ p, q, said: (cmp(p, q) > 0) === (i !== bad) })), [p, q] = made[bad], f = p.dec ? q : p;
      return C('분수와 소수의 크기를 잘못 비교한 것은?', rows.map((row) => ex(`${row.p.html} <i>${row.said ? GT : LT}</i> ${row.q.html}`)), bad, {
        explain: `${vj(f, '을/를')} 소수로 나타내면 ${sx(f.top * 100 / f.den, 2)}이므로 ${p.html} ${SG(p, q)} ${q.html}이다. 나머지는 바르게 비교하였다.`,
        facts: { biggerClaims: rows.map((row, i) => (row.said ? [row.p.expr, row.q.expr, i] : [row.q.expr, row.p.expr, i])), truth: rows.map((_, i) => i !== bad), want: false }
      });
    }),
    T('deci-between-pick', '분수와 소수 사이에 있는 수 고르기', '심67', (d) => {
      // 사이에 있는 수는 소수로 고칠 수 없는 분수여서, 소수를 분수로 고쳐 통분해야 한다.
      const [lo, hi, inside] = d.pick([[Fr(1, 2), Dc(6, 1), Fr(5, 9)], [Fr(1, 2), Dc(6, 1), Fr(4, 7)], [Dc(6, 1), Fr(3, 4), Fr(2, 3)], [Dc(3, 1), Fr(2, 5), Fr(1, 3)], [Fr(3, 5), Dc(7, 1), Fr(2, 3)], [Dc(8, 1), Fr(9, 10), Fr(5, 6)], [Fr(1, 5), Dc(3, 1), Fr(2, 9)], [Dc(4, 1), Fr(1, 2), Fr(4, 9)], [Dc(7, 1), Fr(4, 5), Fr(7, 9)]]);
      const lo100 = lo.top * 100 / lo.den, hi100 = hi.top * 100 / hi.den, out = (v) => cmp(v, lo) < 0 || cmp(v, hi) > 0;
      const third = d.until(() => { const den = d.pick([4, 5, 10, 20, 25]); return Fr(coTop(d, den), den); }, (v) => out(v) && Math.abs(v.top * 100 / v.den - (lo100 + hi100) / 2) <= 30);
      const rows = d.shuffle([inside, Dc(lo100 - d.int(3, 9), 2), Dc(hi100 + d.int(3, 9), 2), third]);
      const asFrac = (v) => { const g = gcd(v.top, v.den); return [v.top / g, v.den / g]; }, [l1, l2] = asFrac(lo), [h1, h2] = asFrac(hi);
      return C(`${lo.html}보다 크고 ${hi.html}보다 작은 수는?`, rows.map((v) => v.html), rows.indexOf(inside), {
        explain: `소수를 분수로 고쳐 통분하여 비교한다. ${both(l1, l2, inside.top, inside.den)}이므로 ${lo.html} ${LT} ${inside.html}이고, ${both(inside.top, inside.den, h1, h2)}이므로 ${inside.html} ${LT} ${hi.html}이다.`,
        facts: { between: { low: lo.expr, high: hi.expr, exprs: rows.map((v) => v.expr) } }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
