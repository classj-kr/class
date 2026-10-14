// 6학년 2학기 1단원 분수의 나눗셈 — 실력 문항.
// 단원 틀과 싣는 기준, 뺀 것과 까닭은 6-2-1a.js 에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2, ③n = 기본꼴_3, 심n = 심화꼴.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 ①의 장치는 이 잘못을 가진 아이가 걸리게 만들었다)
//  - 나누면 언제나 작아진다고 여긴다. 1보다 작은 수로 나누면 몫이 나누어지는 수보다 커지고, 1보다 큰 수(가분수·대분수)로 나누면 작아지며, 1로 나누면 그대로라는 것을
//    나누는 수와 1의 크기로 가리지 못한다. 나누는 수가 클수록 몫이 크다고 여기기도 한다.
//  - 분모가 같은 나눗셈에서 분자끼리 나눈 몫에 분모를 그대로 붙인다(12/13 ÷ 4/13 = 3/13). 분모가 다른데 통분하지 않고 분자끼리 나누고, 통분하면서 분자는 그대로 둔다.
//    작은 수를 큰 수로 나눈 몫을 뒤집어 적는다(7 ÷ 9 = 9/7).
//  - 곱셈으로 나타낼 때 나누는 수가 아니라 나누어지는 수의 분모와 분자를 바꾸거나, 바꾸지 않고 곱한다. 대분수를 가분수로 잘못 고치거나 고치지 않은 채 분수 부분에만 곱한다.
//  - 무엇을 무엇으로 나누는지 가리지 못하고 문장에 나온 차례대로 나눈다(「3/4 m의 무게가 5/8 kg」에서 1 m의 무게와 1 kg의 길이, 「~씩 자르면 몇 도막」과 「~명이 나누면 한 명의 몫」).
//  - 「~의 몇 분의 몇」(곱셈)과 「~가 전체의 몇 분의 몇」(나눗셈)을 가르지 못한다. 전체를 구할 때 주어진 분수가 쓴 부분인지 남은 부분인지 살피지 않는다.
//  - 띠 그림에서 색칠한 칸 수만 세어 몇 배인지 답한다(나눈 칸의 크기가 다르다는 것을 놓친다).
//  - 몫이 꼭 자연수로 떨어질 때 「그보다 작은 자연수」에 그 수를 넣어 센다. 「만들고 남는 양」을 몫의 분수 부분으로 읽는다(6 2/3개이면 2/3 m가 남는다고 한다).
//
// 실력에는 ① 문제의 상황·그림·수에 함정이 있어 뜻을 정확히 대야 풀리는 문제와 ② 두 번 넘게 생각해야 풀리는 문제(어떤 수를 한 번 거꾸로 구해 바르게 계산하기,
// 만들고 남는 양, 단위량을 구한 뒤 한 번 더 곱하기, 두 몫 사이의 □, □가 분모인 부등식, 수 카드로 몫이 가장 큰(작은) 식 만들기, 한쪽을 먼저 계산하는 □,
// 덧셈·뺄셈·곱셈이 한 번 섞인 두 단계 문장제)만 실었다. 기본에서 하는 나눗셈 한 번을 고르기로 바꾼 것은 싣지 않았다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, box, frac, mixed, lines, cards, N, M, C, F } = B.kit;
  const STD = '6수01-11';
  // 실력 문항. 기본 자료에서만 나온 꼴은 ref 를 '기본 ②52' 처럼 적는다.
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: ref.startsWith('기본 ') ? '수집본 기본 자료(' + ref.slice(3) + ')' : '수집본 심화 자료(' + ref + ')', make }, more || {});
  const LAB = ['㉠', '㉡', '㉢', '㉣'], THREE = LAB.slice(0, 3);
  const SIGNS = ['&gt;', '=', '&lt;'], GT = '&gt;', LT = '&lt;';
  const gcd = (x, y) => (y ? gcd(y, x % y) : x), lcm = (x, y) => x / gcd(x, y) * y;
  const tail = (n, pair) => josa(n, pair).slice(String(n).length);
  const SG = { '+': '+', '-': '−', '*': '×', '/': '÷', '=': '=', '>': GT, '<': LT };
  const ex = (html) => '<span class="mb-expr">' + html + '</span>';
  const eq = (...parts) => ex(parts.map((p) => (SG[p] ? '<i>' + SG[p] + '</i>' : p)).join(' '));
  const tag = (label) => '<span class="mb-tag mb-tag-short">' + label + '</span>';
  const tagged = (list, tags) => lines(list.map((html, i) => tag((tags || LAB)[i]) + html));

  // ── 수 하나(6-2-1a.js 와 같다) ──
  const V = (w, n, d) => ({ w, n, d: n ? d : 1 });
  const nat = (w) => V(w, 0, 1);
  const show = (v) => (v.n === 0 ? String(v.w) : v.w ? mixed(v.w, v.n, v.d) : frac(v.n, v.d));
  const vj = (v, pair) => show(v) + tail(v.n === 0 ? v.w : v.n, pair);
  const top = (v) => v.w * v.d + v.n;
  const key = (v) => v.w + ' ' + v.n + '/' + v.d;
  const R = (p, q) => { const g = gcd(Math.abs(p), q) || 1; return { p: p / g, q: q / g }; };
  const val = (v) => R(top(v), v.d);
  const cmp = (x, y) => x.p * y.q - y.p * x.q;
  const div = (a, b) => R(top(a) * b.d, a.d * top(b));
  const toV = (r) => (r.q === 1 ? nat(r.p) : V(Math.floor(r.p / r.q), r.p % r.q, r.q));
  const res = (a, b) => show(toV(div(a, b)));
  const bare = (v) => (v.n ? frac(top(v), v.d) : String(v.w));
  const divided = (a, b) => eq(show(a), '/', show(b));
  const sgn = (x, y) => (cmp(x, y) > 0 ? 0 : cmp(x, y) === 0 ? 1 : 2);
  const SGN = (x, y) => SIGNS[sgn(x, y)];
  const near = (x, y, k) => Math.abs(cmp(x, y)) <= k * x.q * y.q;
  // 덧셈·뺄셈·곱셈의 값
  const plus = (x, y, s) => R(x.p * y.q + (s === '-' ? -1 : 1) * y.p * x.q, x.q * y.q);
  const times = (x, y) => R(x.p * y.p, x.q * y.q);

  // ── 검사가 다시 셈하는 식 ──
  const imp = (v) => (v.n === 0 ? String(v.w) : v.w ? `(${v.w}*${v.d}+${v.n})` : String(v.n));
  const q = (v) => ({ num: imp(v), dens: v.n ? [String(v.d)] : [], P: top(v), D: v.d });
  const qmul = (x, y) => ({ num: x.num + '*' + y.num, dens: x.dens.concat(y.dens), P: x.P * y.P, D: x.D * y.D });
  const qdiv = (x, y) => ({ num: [x.num].concat(y.dens).join('*'), dens: x.dens.concat([y.num]), P: x.P * y.D, D: x.D * y.P });
  // 두 식의 합(s: '+')·차(s: '-'): 분모들의 곱으로 통분한 분자
  const qadd = (x, y, s) => ({ num: '(' + [x.num].concat(y.dens).join('*') + s + [y.num].concat(x.dens).join('*') + ')', dens: x.dens.concat(y.dens), P: x.P * y.D + (s === '+' ? 1 : -1) * y.P * x.D, D: x.D * y.D });
  const qd = (a, b) => qdiv(q(a), q(b));
  const ONE = q(nat(1));
  function proofQ(x, more) {
    const r = R(x.P, x.D), g = x.D / r.q, den = x.dens.join('*'), m = more || {};
    const list = r.q === 1 ? [[den ? `${x.num}/(${den})` : x.num, 0]]
      : r.p > r.q ? [[`(${x.num}-${x.num}%(${den}))/(${den})`, 0], [`${x.num}%(${den})/${g}`, 1], [`${den}/${g}`, 2]]
        : [[`${x.num}/${g}`, 0], [`${den}/${g}`, 1]];
    return Object.assign({}, m, { calc: list, unseen: (r.q === 1 ? [] : [g]).concat(m.unseen || []) });
  }
  // 식의 값을 답하는 문항. 값이 자연수이면 수 하나(o.kind: 'nat'), 아니면 분수 칸에 답한다(크기가 같은 분수를 모두 받는다). 유형마다 답의 꼴은 정해져 있다.
  function ansQ(text, x, o) {
    const r = R(x.P, x.D);
    if (r.p <= 0 || (r.q === 1) !== (o.kind === 'nat')) throw new Error('답의 꼴이 유형과 다르다');
    const facts = proofQ(x, o.facts);
    if (r.q === 1) return N(text, r.p, { unit: o.unit, figure: o.figure, explain: o.explain, facts });
    return F(text, r.p % r.q, r.q, { whole: r.p > r.q ? Math.floor(r.p / r.q) : undefined, anyForm: true, unit: o.unit, figure: o.figure, explain: o.explain, facts });
  }
  const ans = (text, a, b, o) => ansQ(text, qd(a, b), o);
  const scaled = (xs) => xs.map((x, i) => xs.filter((_, j) => j !== i).reduce((list, y) => list.concat(y.dens), [x.num]).join('*'));
  const whole = (x) => x.P % x.D === 0;
  const valueOf = (x) => R(x.P, x.D);

  // ── 풀이 글(6-2-1a.js 와 같다) ──
  const chainOf = (out) => out.filter((s, i) => i === 0 || s !== out[i - 1]).join(' = ');
  function tailOf(x, y) {
    const r = R(x, y), out = [`${x} ÷ ${y}`];
    if (r.q === 1) out.push(String(r.p));
    else { out.push(frac(x, y)); if (r.p !== x) out.push(frac(r.p, r.q)); if (r.p > r.q) out.push(show(toV(r))); }
    return out;
  }
  const toldSame = (a, b) => chainOf([`${show(a)} ÷ ${show(b)}`, `${bare(a)} ÷ ${bare(b)}`].concat(tailOf(top(a), top(b))));
  function cancel(tops, dens) {
    const ns = tops.slice(), ds = dens.slice();
    for (let i = 0; i < ns.length; i += 1) for (let j = 0; j < ds.length; j += 1) { const g = gcd(ns[i], ds[j]); ns[i] /= g; ds[j] /= g; }
    return [ns, ds];
  }
  const product = (list) => { const keep = list.filter((x) => x !== 1); return keep.length ? keep.join(' × ') : '1'; };
  const flipped = (b) => (top(b) === 1 ? String(b.d) : frac(b.d, top(b)));
  function told(a, b) {
    const out = [`${show(a)} ÷ ${show(b)}`, `${bare(a)} ÷ ${bare(b)}`, `${bare(a)} × ${flipped(b)}`], ns = [top(a), b.d], ds = [a.d, top(b)], [n2, d2] = cancel(ns, ds), r = div(a, b);
    if (n2.join() !== ns.join() && r.q !== 1) out.push(frac(product(n2), product(d2)));
    if (n2.join() !== ns.join() && r.q === 1 && n2.filter((x) => x !== 1).length > 1) out.push(product(n2));
    out.push(r.q === 1 ? String(r.p) : frac(r.p, r.q));
    if (r.q !== 1 && r.p > r.q) out.push(show(toV(r)));
    return chainOf(out);
  }
  const how = (a, b) => (a.n && b.n && a.d === b.d ? toldSame(a, b) : told(a, b));
  const sv = (r) => show(toV(r));

  // ── 수 고르기(6-2-1a.js 와 같다) ──
  const coTop = (d, den, lo, hi) => d.until(() => d.int(lo || 1, hi || den - 1), (v) => gcd(v, den) === 1);
  const proper = (d, lo, hi, minTop) => { const den = d.int(lo, hi); return V(0, coTop(d, den, den > 2 ? minTop : 1), den); };
  function samePick(d, kind, lo, hi) {
    return d.until(() => { const den = d.int(lo || 5, hi || 17); return [V(0, d.int(2, den - 1), den), V(0, kind === 'unit' ? 1 : d.int(2, den - 1), den)]; }, ([a, b]) => {
      const x = a.n, y = b.n;
      if (gcd(x, a.d) !== 1 || gcd(y, a.d) !== 1 || x === y) return false;
      if (kind === 'unit') return x >= 3;
      if (kind === 'nat') return x % y === 0;
      if (kind === 'over') return x > y && gcd(x, y) === 1;
      if (kind === 'under') return x < y && gcd(x, y) === 1;
      return x > y && x % y !== 0 && gcd(x, y) > 1;
    });
  }
  function natPick(d, kind, cMax) {
    return d.until(() => { const e = d.int(3, 12), n = coTop(d, e, 2); return [nat(kind === 'whole' ? n * d.int(2, 6) : d.int(2, cMax || 12)), V(0, n, e)]; }, ([c, f]) => {
      const g = gcd(c.w, f.n), r = div(c, f);
      if (c.w > 30 || r.p > 150 || c.w === f.d) return false;
      return kind === 'whole' ? r.p <= 99 : kind === 'plain' ? g === 1 : g > 1 && c.w % f.n !== 0;
    });
  }
  function mulPick(d, cuts, over, hi) {
    return d.until(() => [proper(d, 3, hi || 12, 2), proper(d, 3, hi || 12, 2)], ([a, b]) => {
      const r = div(a, b), k = (gcd(a.n, b.n) > 1 ? 1 : 0) + (gcd(a.d, b.d) > 1 ? 1 : 0);
      return a.d !== b.d && (cuts == null || k === cuts) && (over == null || (r.p > r.q) === over) && r.q > 1 && r.q <= 60 && r.p <= 99;
    });
  }
  const one = (d, kind) => {
    if (kind === 'N') return nat(d.int(2, 15));
    const den = d.int(2, kind === 'P' ? 12 : 9), n = coTop(d, den, kind === 'P' && den > 2 ? 2 : 1);
    return kind === 'M' ? V(d.int(1, 5), n, den) : kind === 'I' ? V(0, den * d.int(1, 2) + n, den) : V(0, n, den);
  };
  function pairOf(d, shape, o) {
    return d.until(() => [one(d, shape[0]), one(d, shape[1])], ([a, b]) => {
      const r = div(a, b);
      if ((r.q === 1) !== Boolean(o.whole) || r.p === r.q) return false;
      if (o.under != null && (r.p < r.q) !== o.under) return false;
      const same = o.same === undefined ? false : o.same;
      if (same != null && a.n && b.n && (a.d === b.d) !== same) return false;
      return r.q <= 30 && r.p <= 120 && r.p <= 30 * r.q && top(a) <= 30 && top(b) <= 30 && key(a) !== key(b);
    });
  }
  // 계산하지 않고 크기를 가릴 수 있는 두 분수: 분모가 같거나 분자가 같다.
  function easyPair(d) {
    return d.until(() => {
      if (d.bool()) { const den = d.int(5, 12); return [V(0, d.int(1, den - 1), den), V(0, d.int(1, den - 1), den)]; }
      const n = d.int(1, 5); return [V(0, n, d.int(n + 1, 12)), V(0, n, d.int(n + 1, 12))];
    }, ([x, y]) => gcd(x.n, x.d) === 1 && gcd(y.n, y.d) === 1 && key(x) !== key(y));
  }

  // ── 그림 ──
  const svg = (cls, w, h, label, body) => `<svg class="${cls}" style="vertical-align:middle" viewBox="0 0 ${w} ${h}" width="${Math.round(w)}" role="img" aria-label="${label}">${body}</svg>`;
  // 길이가 같은 띠 여러 줄. rows: { tag 이름, parts 나눈 칸 수, on 색칠한 칸의 자리 목록 }
  function scatterBands(rows) {
    const W = 216, x0 = 26; let out = '';
    rows.forEach((r, i) => {
      const y = 2 + i * 36, pw = W / r.parts;
      out += `<text class="mb-km-label" style="font-size:14px" x="11" y="${y + 17}" text-anchor="middle">${r.tag}</text>`;
      for (let k = 0; k < r.parts; k += 1) out += `<rect class="mb-piece${r.on.includes(k) ? ' is-on' : ''}" x="${(x0 + k * pw).toFixed(2)}" y="${y}" width="${pw.toFixed(2)}" height="24"/>`;
    });
    return svg('mb-pieces', x0 + W + 4, rows.length * 36 - 8, `길이가 같은 띠 ${rows.length}개: ` + rows.map((r) => `${r.tag}는 똑같이 ${r.parts}칸으로 나누어 ${r.on.length}칸을 색칠`).join(', '), out);
  }

  const word = (text, a, b, unit, explain, more) => ans(text, a, b, Object.assign({ unit, explain }, more || {}));
  const WHERE = '다음 계산에서 처음으로 잘못된 곳의 기호는?';

  B.addGroup('6-2-1', {
    id: 'hard', title: '실력 문제', standard: STD,
    types: [
      // ── ① 문제의 상황·그림·수에 함정이 있어 뜻을 정확히 대야 풀리는 문제 ──
      H('hard-size-count', '계산하지 않고 처음 수보다 큰 계산 결과 세기', '심17·19 / 기본 ①41 ③27·32', (d) => {
        // 함정: 나누면 언제나 작아진다고 여기는 아이, 가분수도 분수라서 나누면 커진다고 여기는 아이, 1로 나눈 것을 「크다」에 넣는 아이, 곱셈과 나눗셈을 가리지 않는 아이가 걸린다.
        //  나눗셈은 나누는 수가 1보다 작을 때만, 곱셈은 곱하는 수가 1보다 클 때만 처음 수보다 커진다.
        const S = d.bool() ? nat(d.int(4, 12)) : proper(d, 5, 11, 2), plan = d.pick([['/P', '/I', '*P', '/1'], ['/P', '*M', '/M', '*P'], ['/P', '/P', '/I', '*I'], ['/I', '*P', '/P', '/1'], ['/M', '*I', '/P', '*P'], ['/P', '/M', '*M', '/1']]);
        const pickOne = (code) => ({ op: code[0], m: code[1] === '1' ? nat(1) : one(d, code[1]) });
        const rows = d.until(() => d.shuffle(plan).map(pickOne), (list) => new Set(list.map((r) => key(r.m)).concat([key(S)])).size === 5);
        const flags = rows.map((r) => (r.op === '/' ? top(r.m) < r.m.d : top(r.m) > r.m.d)), hits = rows.map((r, i) => (flags[i] ? LAB[i] : '')).filter(Boolean);
        return N(`계산하지 않고 알아보려고 한다. 계산 결과가 ${show(S)}보다 큰 것은 모두 몇 개인가?`, hits.length, {
          unit: '개', figure: tagged(rows.map((r) => eq(show(S), r.op, show(r.m)))),
          explain: `1보다 작은 수로 나누거나 1보다 큰 수를 곱하면 ${show(S)}보다 커진다. 1보다 큰 수로 나누거나 1보다 작은 수를 곱하면 작아지고, 1로 나누면 그대로이다. 분자가 분모보다 큰 가분수와 대분수는 1보다 크다. ${show(S)}보다 큰 것은 ${hits.join(', ')}이다.`,
          facts: { count: flags }
        });
      }),
      H('hard-order-nocalc', '나누는 수만 다른 나눗셈을 계산하지 않고 차례로 늘어놓기', '심16·17 / 기본 ③32·33', (d) => {
        // 함정: 나누는 수가 클수록 몫이 크다고 여기는 아이, 나누면 언제나 작아진다(커진다)고 여기는 아이. 1보다 작은 수로 나눈 것만 처음 수보다 크고, 나누는 수가 작을수록 몫이 크다.
        const A = d.bool() ? nat(d.int(3, 12)) : proper(d, 4, 9, 2);
        const [p1, p2] = d.until(() => easyPair(d), ([x, y]) => cmp(val(x), val(y)) < 0 && key(x) !== key(A) && key(y) !== key(A)), m = d.until(() => one(d, d.bool() ? 'M' : 'I'), (v) => key(v) !== key(A));
        // 값의 차례: A ÷ m < A < A ÷ p2 < A ÷ p1
        const forms = [[A, p1], [A, p2], [A], [A, m]], order = d.shuffle([0, 1, 2, 3]), rows = order.map((i) => forms[i]), at = (i) => order.indexOf(i), desc = d.bool();
        const put = (list) => { const o = list.map(at); return desc ? o.reverse() : o; }, right = put([3, 2, 1, 0]), list = d.shuffle([right, put([2, 3, 1, 0]), put([3, 1, 0, 2]), put([0, 1, 2, 3])]);
        return C(`계산하지 않고 알아보려고 한다. 수와 계산 결과를 ${desc ? '큰' : '작은'} 것부터 차례대로 쓴 것은?`, list.map((o) => o.map((i) => LAB[i]).join(', ')), list.findIndex((o) => o.join() === right.join()), {
          figure: tagged(rows.map((row) => (row.length === 1 ? ex(show(A)) : divided(row[0], row[1])))),
          explain: `1보다 큰 수 ${vj(m, '으로/로')} 나누면 ${show(A)}보다 작아지고, 1보다 작은 수로 나누면 ${show(A)}보다 커진다. 나누는 수가 작을수록 몫이 크므로 ${show(p1)} ${LT} ${show(p2)}에서 ${show(A)} ÷ ${show(p1)}의 몫이 가장 크다.`,
          facts: { choose: { exprs: scaled(rows.map((row) => (row.length === 1 ? q(A) : qd(row[0], row[1])))), rule: desc ? 'descending' : 'ascending', orders: list } }
        });
      }),
      H('hard-unit-reverse', '문장제: 무게와 길이 가운데 무엇을 무엇으로 나누는지 가리기', '심43 / 기본 ①59 ②72', (d) => {
        // 함정: 「~ m의 무게가 ~ kg」을 보면 습관대로 무게를 길이로 나누는 아이, 문장에 나온 차례의 반대로만 나누는 아이. 묻는 것이 1 kg의 길이이므로 길이를 무게로 나눈다.
        const [len, wt] = d.until(() => mulPick(d, null, null, 10), ([p, s]) => div(p, s).q <= 24 && div(s, p).q <= 24);
        return word(`굵기가 일정한 철사 ${show(len)} m의 무게가 ${show(wt)} kg이다. 이 철사 1 kg의 길이는 몇 m인가?`, len, wt, 'm',
          `1 kg의 길이는 길이를 무게로 나누어 구한다. ${told(len, wt)}이다. 무게를 길이로 나눈 ${show(wt)} ÷ ${show(len)} = ${res(wt, len)}${tail(toV(div(wt, len)).n || toV(div(wt, len)).w, '은/는')} 1 m의 무게이다.`);
      }),
      H('hard-take-vs-share', '같은 두 수로 세우는 서로 다른 나눗셈식 가리기', '기본 ①13·55 ③24·47 / 심34', (d) => {
        // 함정: 문장에 나온 수의 차례대로 식을 세우는 아이(두 문장 모두 나누는 수가 먼저 나온다), 두 상황을 같은 식으로 여기는 아이.
        //  「~씩 자를 때 도막의 수」는 전체를 한 도막의 길이로, 「~명이 똑같이 나눌 때 한 명의 몫」은 전체를 사람 수로 나눈다.
        const [c, f] = d.until(() => natPick(d, 'whole'), ([x]) => x.w <= 8), takeFirst = d.bool();
        const take = `한 도막이 ${show(f)} m가 되도록 길이가 ${c.w} m인 끈을 자를 때 생기는 도막의 수`, share = `${c.w}명이 길이가 ${show(f)} m인 끈을 똑같이 나누어 가질 때 한 명이 가지는 끈의 길이`;
        const E1 = eq(c.w, '/', show(f)), E2 = eq(show(f), '/', c.w), right = takeFirst ? [E1, E2] : [E2, E1];
        const options = d.shuffle([[E1, E2], [E2, E1], [E1, E1], [E2, E2]]);
        return C('가와 나를 구하는 식을 차례대로 바르게 쓴 것은?', options.map(([x, y]) => `가: ${x}, 나: ${y}`), options.findIndex(([x, y]) => x === right[0] && y === right[1]), {
          figure: tagged(takeFirst ? [take, share] : [share, take], ['가', '나']),
          explain: `도막의 수는 끈의 길이 ${c.w} m를 한 도막의 길이 ${show(f)} m로 나눈 ${c.w} ÷ ${show(f)} = ${res(c, f)}이고, 한 명이 가지는 끈의 길이는 끈의 길이 ${show(f)} m를 사람 수 ${josa(c.w, '으로/로')} 나눈 ${show(f)} ÷ ${c.w} = ${res(f, c)}이다. 두 수가 같아도 무엇을 무엇으로 나누는지에 따라 식이 달라진다.`,
          facts: { truth: options.map(([x, y]) => x === right[0] && y === right[1]), want: true }
        });
      }),
      H('hard-where', '계산 과정에서 처음으로 잘못된 곳 찾기', '심9·10 / 기본 ①12·26·35 ②30·31 ③6·42·53', (d, n) => {
        const at = d.int(0, 2);
        if (n === 0) {
          // 곱셈으로 나타내어 계산하는 과정. 잘못은 ㉠(나누어지는 수의 분모와 분자를 바꿈), ㉡(약분하면서 분자만 나눔), ㉢(가분수를 대분수로 잘못 고침) 가운데 한 곳이고, 그 뒤는 잘못된 수로 바르게 이어 간다.
          const m = d.until(() => {
            const [a, b] = mulPick(d, 1, true, 12), f1 = at === 0 ? [[a.d, a.n], [b.n, b.d]] : [[a.n, a.d], [b.d, b.n]];
            const [ns, ds] = cancel([f1[0][0], f1[1][0]], [f1[0][1], f1[1][1]]), dsShown = at === 1 ? [f1[0][1], f1[1][1]] : ds;
            return { a, b, f1, ns, ds: dsShown, P: ns[0] * ns[1], Q: dsShown[0] * dsShown[1] };
          }, (v) => v.Q > 1 && v.P !== v.Q && (at === 0 || (v.P > v.Q && v.P % v.Q !== 0)) && v.ns.join() !== [v.f1[0][0], v.f1[1][0]].join());
          const { a, b, f1, ns, ds, P, Q } = m, W = Math.floor(P / Q), rem = P % Q, rs = at === 2 && Q - rem !== rem ? Q - rem : rem, Ws = at === 2 && rs === rem ? W + 1 : W;
          const why = ['분모와 분자를 바꾸는 것은 나누어지는 수가 아니라 나누는 수이다.', '약분할 때에는 분모와 분자를 같은 수로 나누어야 한다.', `${frac(P, Q)}${tail(P, '을/를')} 대분수로 나타내면 ${mixed(W, rem, Q)}이다.`][at];
          return C(WHERE, THREE, at, {
            figure: lines([eq(show(a), '/', show(b)), tag(LAB[0]) + eq('=', frac(f1[0][0], f1[0][1]), '*', frac(f1[1][0], f1[1][1])), tag(LAB[1]) + eq('=', frac(`${ns[0]} × ${ns[1]}`, `${ds[0]} × ${ds[1]}`)), tag(LAB[2]) + eq(...['=', frac(P, Q)].concat(P > Q ? ['=', mixed(Ws, rs, Q)] : []))]),
            explain: `${why} 바르게 계산하면 ${told(a, b)}이다.`,
            facts: { claimed: [[`${a.n}*${b.d}*${f1[0][1] * f1[1][1]}`, f1[0][0] * f1[1][0] * a.d * b.n], [`${f1[0][0] * f1[1][0]}*${Q}`, P * f1[0][1] * f1[1][1]], P > Q ? [`${Ws}*${Q}+${rs}`, P] : ['1', 1]], claimedWant: false, rule: 'whereMul' }
          });
        }
        if (n === 1) {
          // 대분수의 나눗셈. 잘못은 ㉠(나누는 수를 가분수로 잘못 고침), ㉡(나누는 수의 분모와 분자를 바꾸지 않고 곱함), ㉢(약분하면서 분모만 나눔) 가운데 한 곳이다.
          const m = d.until(() => {
            const [a, b] = pairOf(d, 'MM', { whole: false }), A = top(a), Bs = at === 0 ? b.w * b.n + b.d : top(b), f2 = at === 1 ? [[A, a.d], [Bs, b.d]] : [[A, a.d], [b.d, Bs]];
            const [ns, ds] = cancel([f2[0][0], f2[1][0]], [f2[0][1], f2[1][1]]), nsShown = at === 2 ? [f2[0][0], f2[1][0]] : ns;
            return { a, b, A, Bs, f2, ds, cut: ns.join() !== [f2[0][0], f2[1][0]].join(), P: nsShown[0] * nsShown[1], Q: ds[0] * ds[1] };
          }, (v) => v.b.w >= 2 && v.Bs !== v.b.d && gcd(v.Bs, v.b.d) === 1 && v.Q > 1 && v.P <= 150 && v.P !== v.Q && (at !== 2 || v.cut) && v.a.d <= 8 && v.b.d <= 8);
          const { a, b, A, Bs, f2, P, Q } = m, n2 = f2[0][0] * f2[1][0], d2 = f2[0][1] * f2[1][1];
          const why = [`${vj(b, '을/를')} 가분수로 나타내면 ${frac(top(b), b.d)}이다.`, '나눗셈을 곱셈으로 나타낼 때에는 나누는 수의 분모와 분자를 바꾸어야 한다.', '약분할 때에는 분모와 분자를 같은 수로 나누어야 한다.'][at];
          return C(WHERE, THREE, at, {
            figure: lines([eq(show(a), '/', show(b)), tag(LAB[0]) + eq('=', frac(A, a.d), '/', frac(Bs, b.d)), tag(LAB[1]) + eq('=', frac(f2[0][0], f2[0][1]), '*', frac(f2[1][0], f2[1][1])), tag(LAB[2]) + eq('=', frac(P, Q))]),
            explain: `${why} 바르게 계산하면 ${told(a, b)}이다.`,
            facts: { claimed: [[`${b.w}*${b.d}+${b.n}`, Bs], [`${A * b.d}*${d2}`, n2 * a.d * Bs], [`${n2}*${Q}`, P * d2]], claimedWant: false, rule: 'whereMixed' }
          });
        }
        // 통분하여 계산하는 과정. 잘못은 ㉠(통분하면서 분자를 그대로 둠), ㉡(분자끼리 나누는 차례를 바꿈), ㉢(몫을 분수로 나타내면서 분모와 분자를 바꿈) 가운데 한 곳이다.
        const [a, b] = d.until(() => [proper(d, 3, 9, 2), proper(d, 3, 9, 2)], ([p, s]) => gcd(p.d, s.d) === 1 && p.d * s.d <= 45 && gcd(p.n, s.n) === 1 && p.n !== s.n && gcd(p.n * s.d, s.n * p.d) === 1);
        const L = a.d * b.d, x = a.n * b.d, y = b.n * a.d, xs = at === 0 ? a.n : x, ys = at === 0 ? b.n : y, [u, v] = at === 1 ? [ys, xs] : [xs, ys], [n3, d3] = at === 2 ? [v, u] : [u, v];
        const why = ['통분하면 분자도 분모에 곱한 수만큼 커진다.', '분자끼리 나눌 때에도 나누어지는 수와 나누는 수의 차례는 그대로이다.', `${u} ÷ ${v}의 몫은 나누어지는 수를 분자로 하는 ${frac(u, v)}이다.`][at];
        return C(WHERE, THREE, at, {
          figure: lines([eq(show(a), '/', show(b)), tag(LAB[0]) + eq('=', frac(xs, L), '/', frac(ys, L)), tag(LAB[1]) + eq('=', u, '/', v), tag(LAB[2]) + eq(...['=', frac(n3, d3)].concat(n3 > d3 ? ['=', mixed(Math.floor(n3 / d3), n3 % d3, d3)] : []))]),
          explain: `${why} 바르게 계산하면 ${show(a)} ÷ ${show(b)} = ${frac(x, L)} ÷ ${frac(y, L)} = ${tailOf(x, y).join(' = ')}이다.`,
          facts: { claimed: [[`${x}*${ys}`, xs * y], [`${xs}*${v}`, u * ys], [`${u}*${d3}`, n3 * v]], claimedWant: false, rule: 'whereCommon' }
        });
      }, { count: 3 }),
      H('hard-fig-bands', '나눈 칸 수가 다른 두 띠에서 색칠한 부분이 몇 배인지 구하기', '기본 ②8 ③15·46 / 심14', (d) => {
        // 함정: 색칠한 칸 수만 세어 몇 배인지 답하는 아이. 두 띠는 나눈 칸의 크기가 달라서 칸 수의 비로는 답이 나오지 않는다(칸 수가 같아도 1배가 아니다).
        //  색칠한 부분을 분수로 읽어 나누어야 한다. 나의 색칠한 칸은 흩어 놓아 길이를 눈으로 대어 볼 수 없게 하였다.
        const m = d.until(() => { const b = d.int(3, 6), e = d.int(4, 12), a = d.int(1, b - 1), c = d.int(2, e - 2); return { a, b, c, e }; }, (v) => v.b !== v.e && (v.a * v.e) % (v.b * v.c) === 0 && v.a * v.e / (v.b * v.c) >= 2 && v.a * v.e / (v.b * v.c) <= 6 && v.a !== v.c * (v.a * v.e / (v.b * v.c)) && gcd(v.a, v.b) === 1);
        const { a, b, c, e } = m, K = a * e / (b * c), spots = d.until(() => d.shuffle(Array.from({ length: e }, (_, i) => i)).slice(0, c).sort((p, s) => p - s), (list) => list.some((v, i) => i > 0 && v - list[i - 1] > 1));
        return N('길이가 같은 두 띠 가, 나를 각각 똑같이 나누어 색칠하였다. 가의 색칠한 부분의 길이는 나의 색칠한 부분의 길이의 몇 배인가?', K, {
          unit: '배', figure: scatterBands([{ tag: '가', parts: b, on: Array.from({ length: a }, (_, i) => i) }, { tag: '나', parts: e, on: spots }]),
          explain: `가의 색칠한 부분은 띠의 ${frac(a, b)}, 나의 색칠한 부분은 띠의 ${frac(c, e)}이다. ${told(V(0, a, b), V(0, c, e))}이다. 두 띠는 한 칸의 크기가 다르므로 칸 수만 견주면 안 된다.`,
          facts: { calc: [[`${a}*${e}/(${b}*${c})`, 0]] }
        });
      }),
      H('hard-rest-whole', '문장제: 남은 양으로 전체의 양 구하기', '심46', (d) => {
        // 함정: 주어진 분수는 「읽은 부분」이고 주어진 쪽수는 「남은 부분」이다. 남은 쪽수를 주어진 분수로 나누는 아이, 남은 쪽수에 분수를 곱하는 아이가 걸린다.
        const m = d.until(() => { const f = proper(d, 3, 9, 2), k = d.int(4, 30); return { f, left: k * (f.d - f.n), total: k * f.d }; }, (v) => v.total <= 300 && v.total >= 40 && v.f.d - v.f.n !== v.f.n), { f, left, total } = m, p = d.pick(NAMES), rest = V(0, f.d - f.n, f.d);
        return ansQ(`${name(p, '은/는')} 책 한 권의 ${vj(f, '을/를')} 읽었더니 ${left}쪽이 남았다. 이 책은 모두 몇 쪽인가?`, qdiv(q(nat(left)), qadd(ONE, q(f), '-')), {
          kind: 'nat', unit: '쪽', explain: `남은 ${left}쪽은 책 전체의 1 − ${show(f)} = ${show(rest)}이다. 책 전체의 쪽수는 ${told(nat(left), rest)}이므로 ${total}쪽이다.`, facts: { unseen: [1] }
        });
      }),
      H('hard-mul-vs-div', '문장제: 「~의 몇 분의 몇」과 「~가 전체의 몇 분의 몇」', '심45 / 기본 ①58 ②68', (d) => {
        // 함정: 같은 양과 같은 분수가 나오지만 가는 곱셈, 나는 나눗셈 상황이다. 분수가 나오면 무조건 곱하는(또는 나누는) 아이가 걸린다. 사용한 양은 처음보다 적고, 통 전체는 담은 양보다 많다.
        const [c, f] = d.until(() => { const e = d.int(3, 8), t = coTop(d, e, 2); return [nat(t * e * d.int(1, 3)), V(0, t, e)]; }, ([x, y]) => x.w <= 36 && x.w * y.d / y.n <= 99), used = c.w * f.n / f.d, full = c.w * f.d / f.n;
        return M('가와 나에서 ㉠, ㉡에 알맞은 수는?', [{ label: LAB[0], answer: used, unit: 'kg' }, { label: LAB[1], answer: full, unit: 'kg' }], {
          figure: tagged([`설탕 ${c.w} kg의 ${vj(f, '을/를')} 사용하였다. 사용한 설탕은 ㉠ kg이다.`, `설탕 ${c.w} kg을 빈 통에 담았더니 통의 ${show(f)}만큼 찼다. 이 통을 가득 채우는 설탕은 ㉡ kg이다.`], ['가', '나']),
          explain: `가는 ${c.w} kg의 ${show(f)}만큼이므로 ${c.w} × ${show(f)} = ${used}(kg)이다. 나는 통의 ${vj(f, '이/가')} ${c.w} kg이므로 ${c.w} ÷ ${show(f)} = ${c.w} × ${frac(f.d, f.n)} = ${full}(kg)이다.`,
          facts: { calc: [[`${c.w}*${f.n}/${f.d}`, 0], [`${c.w}*${f.d}/${f.n}`, 1]] }
        });
      }),
      H('hard-box-exact', '몫이 자연수로 떨어질 때 □에 들어갈 수 있는 수', '심24 / 기본 ①49 ②45', (d) => {
        // 함정: 몫이 꼭 자연수 K 로 떨어진다. 「K보다 작은 자연수」에 K를 넣어 K개라고 세는 아이가 걸린다.
        const [a, b] = d.until(() => (d.bool() ? natPick(d, 'whole') : pairOf(d, 'MP', { whole: true })), ([p, s]) => div(p, s).p >= 3 && div(p, s).p <= 12), K = div(a, b).p, x = qd(a, b);
        return N('□ 안에 들어갈 수 있는 자연수는 모두 몇 개인가?', K - 1, {
          unit: '개', figure: eq(show(a), '/', show(b), '>', box()),
          explain: `${told(a, b)}이다. □는 ${K}보다 작아야 하므로 ${josa(K, '은/는')} 들어갈 수 없다. 1부터 ${K - 1}까지 ${K - 1}개이다.`,
          facts: { digit: { template: `${x.num}>□*(${x.dens.join('*')})`, lo: 1, hi: K + 2, ask: 'count' }, rule: 'boxExact' }
        });
      }),

      // ── ② 두 번 넘게 생각해야 풀리는 문제 ──
      H('hard-wrong-mul', '나누어야 할 것을 곱한 계산을 바르게 고치기', '심31 / 기본 ①65 ②80·82 ③59', (d, n) => {
        // 어떤 수를 나눗셈으로 한 번 거꾸로 구한 다음 바르게 나눈다. 첫째 문항은 답이 자연수, 둘째 문항은 답이 분수이다.
        if (n === 0) {
          const m = d.until(() => { const e = d.int(3, 9), t = coTop(d, e, 2); return { b: V(0, t, e), y: t * t * d.int(1, 3) }; }, (v) => v.y * v.b.d * v.b.d / (v.b.n * v.b.n) <= 150), { b, y } = m, x = y * b.d / b.n;
          return ansQ(`어떤 수를 ${vj(b, '으로/로')} 나누어야 할 것을 잘못하여 곱했더니 ${josa(y, '이/가')} 되었다. 바르게 계산한 값은?`, qdiv(qdiv(q(nat(y)), q(b)), q(b)), {
            kind: 'nat', explain: `어떤 수에 ${vj(b, '을/를')} 곱한 값이 ${y}이므로 어떤 수는 ${told(nat(y), b)}이다. 바르게 계산하면 ${told(nat(x), b)}이다.`, facts: { rule: 'wrongMulNat' }
          });
        }
        const m = d.until(() => { const b = proper(d, 3, 9, 2), y = proper(d, 2, 12); return { b, y, x: div(y, b) }; }, (v) => v.y.d !== v.b.d && v.x.q > 1 && v.x.q <= 20 && v.x.p <= 40 && div(toV(v.x), v.b).q <= 60 && div(toV(v.x), v.b).q > 1 && div(toV(v.x), v.b).p <= 150);
        const { b, y } = m, x = toV(m.x);
        return ansQ(`어떤 수를 ${vj(b, '으로/로')} 나누어야 할 것을 잘못하여 곱했더니 ${vj(y, '이/가')} 되었다. 바르게 계산한 값은?`, qdiv(qdiv(q(y), q(b)), q(b)), {
          explain: `어떤 수에 ${vj(b, '을/를')} 곱한 값이 ${show(y)}이므로 어떤 수는 ${told(y, b)}이다. 바르게 계산하면 ${told(x, b)}이다.`, facts: { rule: 'wrongMulFrac' }
        });
      }),
      H('hard-wrong-add', '나누어야 할 것을 더하거나 뺀 계산을 바르게 고치기', '심33 / 기본 ②81', (d, n) => {
        // 첫째 문항은 나누어야 할 것을 더했고, 둘째 문항은 뺐다. 어떤 수를 뺄셈·덧셈으로 되돌려 구한 다음 나눈다.
        const m = d.until(() => {
          const [e1, e2] = d.shuffle(d.pick([[2, 4], [3, 6], [2, 6], [4, 8], [3, 9], [5, 10], [4, 12], [6, 12], [5, 15], [3, 4], [2, 3], [2, 5], [3, 5]])), b = V(0, coTop(d, e1), e1), x = V(d.int(0, 2), coTop(d, e2), e2);
          return { b, x, y: n === 0 ? plus(val(x), val(b), '+') : plus(val(x), val(b), '-') };
        }, (v) => v.y.p > 0 && top(v.x) > 1 && v.b.n >= 2 && div(v.x, v.b).q > 1 && div(v.x, v.b).q <= 30 && div(v.x, v.b).p <= 120);
        const { b, x } = m, y = toV(m.y), back = n === 0 ? '-' : '+';
        return ansQ(`어떤 수를 ${vj(b, '으로/로')} 나누어야 할 것을 잘못하여 ${n === 0 ? '더했더니' : '뺐더니'} ${vj(y, '이/가')} 되었다. 바르게 계산한 값은?`, qdiv(qadd(q(y), q(b), back), q(b)), {
          explain: `어떤 수는 ${show(y)} ${SG[back]} ${show(b)} = ${show(x)}이다. 바르게 계산하면 ${how(x, b)}이다.`, facts: { rule: ['wrongAdded', 'wrongTaken'][n] }
        });
      }),
      H('hard-wrong-divisor', '어떤 수로 나누어야 할 것을 곱한 계산을 바르게 고치기', '심32', (d) => {
        // 어떤 수가 나누는 수이다. 바른 식은 (주어진 수)÷(어떤 수)이고, 어떤 수는 (곱한 결과)÷(주어진 수)로 구한다.
        const m = d.until(() => { const a = proper(d, 3, 9, 2), x = proper(d, 3, 9, 2), y = times(val(a), val(x)); return { a, x, y }; }, (v) => v.a.d !== v.x.d && v.y.q <= 40 && div(v.a, v.x).q > 1 && div(v.a, v.x).q <= 60 && div(v.a, v.x).p <= 99 && key(v.a) !== key(v.x));
        const { a, x } = m, y = toV(m.y);
        return ansQ(`${vj(a, '을/를')} 어떤 수로 나누어야 할 것을 잘못하여 곱했더니 ${vj(y, '이/가')} 되었다. 바르게 계산한 값은?`, qdiv(q(a), qdiv(q(y), q(a))), {
          explain: `${show(a)}에 어떤 수를 곱한 값이 ${show(y)}이므로 어떤 수는 ${told(y, a)}이다. 바르게 계산하면 ${told(a, x)}이다.`
        });
      }),
      H('hard-left-after', '문장제: 만들 수 있는 만큼 만들고 남는 양', '심37 / 기본 ①57 ②60', (d) => {
        // 몫의 자연수 부분만큼 만들고, 쓴 양을 곱셈으로 구해 처음 양에서 뺀다. 몫의 분수 부분은 남는 양이 아니라 「하나를 만드는 양의 얼마」이다.
        const m = d.until(() => { const a = one(d, 'M'), b = d.bool() ? proper(d, 3, 12, 2) : one(d, 'M'), v = div(a, b), k = Math.floor(v.p / v.q); return { a, b, v, k, left: plus(val(a), times(val(b), R(k, 1)), '-') }; }, (x) => x.v.q > 1 && x.k >= 2 && x.k <= 9 && x.a.d !== x.b.d && lcm(x.a.d, x.b.d) <= 30 && x.left.q > 1);
        const { a, b, v, k } = m, used = times(val(b), R(k, 1)), A = imp(a), Bq = imp(b), x = { num: `(${A}*${b.d}%(${a.d}*${Bq}))`, dens: [String(a.d), String(b.d)], P: (top(a) * b.d) % (a.d * top(b)), D: a.d * b.d };
        return ansQ(`주머니 한 개를 만드는 데 천이 ${show(b)} m 필요하다. 천 ${show(a)} m로 주머니를 만들 수 있는 만큼 만들었다. 남은 천은 몇 m인가?`, x, {
          unit: 'm', explain: `${told(a, b)}이므로 주머니를 ${k}개 만들 수 있다. ${k}개를 만드는 데 쓴 천은 ${show(b)} × ${k} = ${sv(used)}(m)이므로 남은 천은 ${show(a)} − ${sv(used)} = ${sv(m.left)}(m)이다. 몫의 분수 부분 ${frac(v.p % v.q, v.q)}${tail(v.p % v.q, '은/는')} 남은 천이 주머니 한 개를 만드는 양의 얼마인지를 나타낸다.`
        });
      }),
      H('hard-unit-then-mul', '문장제: 1만큼의 양을 구한 다음 곱하기', '심44 / 기본 ②74', (d) => {
        const m = d.until(() => { const [a, b] = d.bool() ? mulPick(d, null, null, 10) : pairOf(d, 'MP', { whole: false }); return { a, b, c: d.int(2, 9) }; }, (v) => v.b.n >= 2 && !whole(qmul(qd(v.a, v.b), q(nat(v.c)))) && valueOf(qmul(qd(v.a, v.b), q(nat(v.c)))).q <= 20 && valueOf(qmul(qd(v.a, v.b), q(nat(v.c)))).p <= 150 && v.c !== v.b.d);
        const { a, b, c } = m, unit = div(a, b), all = times(unit, R(c, 1));
        return ansQ(`굵기가 일정한 쇠막대 ${show(b)} m의 무게가 ${show(a)} kg이다. 이 쇠막대 ${c} m의 무게는 몇 kg인가?`, qmul(qd(a, b), q(nat(c))), {
          unit: 'kg', explain: `쇠막대 1 m의 무게는 ${told(a, b)}(kg)이다. ${c} m의 무게는 ${sv(unit)} × ${c} = ${sv(all)}(kg)이다.`
        });
      }),
      H('hard-between', '두 몫 사이에 있는 자연수', '심24 / 기본 ①49 ②46 ③55', (d) => {
        // 한쪽 몫이 자연수로 떨어질 때도 있다. 그 수는 □에 들어갈 수 없다.
        const gen = () => d.pick([() => natPick(d, 'whole'), () => natPick(d, 'plain'), () => pairOf(d, 'MP', { whole: false, under: false }), () => pairOf(d, 'MP', { whole: true })])();
        const m = d.until(() => { const lo = gen(), hi = gen(), vl = div(lo[0], lo[1]), vh = div(hi[0], hi[1]); return { lo, hi, vl, vh, from: Math.floor(vl.p / vl.q) + 1, to: vh.q === 1 ? vh.p - 1 : Math.floor(vh.p / vh.q) }; }, (v) => v.to - v.from >= 1 && v.to - v.from <= 4 && v.to <= 40 && key(v.lo[1]) !== key(v.hi[1]) && key(v.lo[0]) !== key(v.hi[0]));
        const { lo, hi, from, to } = m, xl = qd(lo[0], lo[1]), xh = qd(hi[0], hi[1]), dl = xl.dens.join('*'), dh = xh.dens.join('*'), list = Array.from({ length: to - from + 1 }, (_, i) => from + i);
        return N('□ 안에 들어갈 수 있는 자연수는 모두 몇 개인가?', list.length, {
          unit: '개', figure: lines([eq(show(lo[0]), '/', show(lo[1]), '<', box(), '<', show(hi[0]), '/', show(hi[1]))]),
          explain: `${show(lo[0])} ÷ ${show(lo[1])} = ${res(lo[0], lo[1])}, ${show(hi[0])} ÷ ${show(hi[1])} = ${res(hi[0], hi[1])}이다. ${res(lo[0], lo[1])}보다 크고 ${res(hi[0], hi[1])}보다 작은 자연수는 ${list.join(', ')}${tail(list[list.length - 1], '으로/로')} ${list.length}개이다.`,
          facts: { digit: { template: `${xl.num}*${dh}<□*${dl}*${dh}<${xh.num}*${dl}`, lo: 1, hi: to + 3, ask: 'count' }, rule: 'betweenNat' }
        });
      }),
      H('hard-unit-denom-box', '단위분수의 분모가 □인 나눗셈의 크기 비교', '심25 / 기본 ①50 ②47', (d) => {
        // (자연수)÷(단위분수)를 곱셈으로 바꾸고, 오른쪽 나눗셈을 계산한 다음 □의 범위를 정한다. 두 값이 같아지는 수는 들어갈 수 없다.
        const m = d.until(() => { const c = d.int(2, 9), [c2, f] = natPick(d, 'whole'), K = div(c2, f).p; return { c, c2, f, K }; }, (v) => v.c !== v.c2 && Math.ceil(v.K / v.c) - 1 >= 3 && Math.ceil(v.K / v.c) - 1 <= 8);
        const { c, c2, f, K } = m, hiBox = Math.ceil(K / c) - 1, list = Array.from({ length: hiBox - 1 }, (_, i) => i + 2);
        return N('□ 안에 들어갈 수 있는 1보다 큰 자연수는 모두 몇 개인가?', list.length, {
          unit: '개', figure: eq(c, '/', frac(1, box()), '<', c2.w, '/', show(f)),
          explain: `${c} ÷ ${frac(1, '□')} = ${c} × □이고, ${told(c2, f)}이다. ${c} × □가 ${K}보다 작아야 하므로 □는 ${list.join(', ')}${tail(list[list.length - 1], '이/가')} 될 수 있다.` + (K % c === 0 ? ` ${c} × ${K / c} = ${K}이므로 ${josa(K / c, '은/는')} 들어갈 수 없다.` : ''),
          facts: { digit: { template: `${c}*□*${f.n}<${c2.w}*${f.d}`, lo: 2, hi: hiBox + 3, ask: 'count' } }
        });
      }),
      H('hard-cards-top', '수 카드로 몫이 가장 큰(작은) 분모가 같은 나눗셈 만들기', '심28 / 기본 ②50 ③21', (d) => {
        // 분모가 같으면 분자끼리 나눈다. 나누어지는 수의 분자가 클수록, 나누는 수의 분자가 작을수록 몫이 크다.
        const den = d.pick([11, 13, 17, 19]), list = d.until(() => d.shuffle([2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4), (v) => Math.max(...v) % Math.min(...v) !== 0), hi = Math.max(...list), lo = Math.min(...list), big = d.bool();
        const [x, y] = big ? [hi, lo] : [lo, hi];
        return ansQ(`수 카드 4장 가운데 2장을 골라 □ 안에 한 번씩 넣어 몫이 가장 ${big ? '큰' : '작은'} 나눗셈식을 만들었다. 이 나눗셈식의 몫은?`, { num: String(x), dens: [String(y)], P: x, D: y }, {
          figure: cards(list) + eq(frac(box(), den), '/', frac(box(), den)),
          explain: `분모가 같으므로 몫은 분자끼리 나눈 것과 같다. 몫이 가장 ${big ? '크려면' : '작으려면'} 나누어지는 수의 분자에 가장 ${big ? '큰' : '작은'} 수 ${josa(x, '을/를')}, 나누는 수의 분자에 가장 ${big ? '작은' : '큰'} 수 ${josa(y, '을/를')} 넣는다. ${toldSame(V(0, x, den), V(0, y, den))}이다.`
        });
      }),
      H('hard-cards-nat', '수 카드로 몫이 가장 작은 (자연수)÷(진분수) 만들기', '심30 / 기본 ②51 ①54', (d) => {
        // 나누어지는 수가 작을수록, 나누는 수가 클수록 몫이 작다. 가장 작은 수를 자연수로 하면 남은 두 수로 만드는 진분수는 하나뿐이고, 다른 식보다 나누는 수도 크다.
        const [x, y, z] = d.until(() => d.shuffle([2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3).sort((p, s) => p - s), ([p, s, t]) => (p * t) % s !== 0 && gcd(s, t) === 1);
        return ansQ('수 카드 3장을 □ 안에 한 번씩 모두 넣어 (자연수)÷(진분수)의 식을 만들려고 한다. 몫이 가장 작을 때의 몫은?', { num: `${x}*${z}`, dens: [String(y)], P: x * z, D: y }, {
          figure: cards(d.shuffle([x, y, z])) + eq(box(), '/', frac(box(), box())),
          explain: `만들 수 있는 식은 ${x} ÷ ${frac(y, z)}, ${y} ÷ ${frac(x, z)}, ${z} ÷ ${frac(x, y)}이다. 나누어지는 수가 가장 작고 나누는 수가 가장 큰 ${x} ÷ ${frac(y, z)}의 몫이 가장 작다. ${told(nat(x), V(0, y, z))}이다.`
        });
      }),
      H('hard-box-two', '한쪽을 먼저 계산하여 곱셈식의 □ 구하기', '심23 / 기본 ①47 ②41', (d) => {
        const m = d.until(() => { const [g, h] = samePick(d, d.pick(['over', 'under', 'cut', 'nat'])), f = proper(d, 3, 9, 2), right = div(g, h); return { g, h, f, right, r: div(toV(right), f) }; }, (v) => v.f.d !== v.g.d && v.r.q > 1 && v.r.q <= 30 && v.r.p <= 120 && key(v.f) !== key(v.g) && key(v.f) !== key(v.h));
        const { g, h, f } = m, right = toV(m.right);
        return ansQ('□ 안에 알맞은 수는?', qdiv(qd(g, h), q(f)), {
          figure: eq(box(), '*', show(f), '=', show(g), '/', show(h)),
          explain: `오른쪽을 먼저 계산하면 ${toldSame(g, h)}이다. □ × ${show(f)} = ${show(right)}이므로 □ = ${how(right, f)}이다.`
        });
      }),
      H('hard-box-same-quot', '두 나눗셈의 몫이 같게 하는 □', '심18·21 / 기본 ②43 ③57', (d) => {
        const PRIMES = [11, 13, 17, 19, 23, 29];
        const m = d.until(() => { const [a, b] = samePick(d, 'nat'), k = a.n / b.n, den = d.pick(PRIMES), y = d.int(2, 9); return { a, b, k, den, y }; }, (v) => v.den !== v.a.d && v.k * v.y < v.den && v.y !== v.b.n);
        const { a, b, k, den, y } = m;
        return N('□ 안에 알맞은 수는?', k * y, {
          figure: eq(show(a), '/', show(b), '=', frac(box(), den), '/', frac(y, den)),
          explain: `왼쪽을 먼저 계산하면 ${toldSame(a, b)}이다. 오른쪽도 분모가 같으므로 □ ÷ ${y} = ${k}이고, □ = ${y} × ${k} = ${k * y}이다.`,
          facts: { calc: [[`${a.n}/${b.n}*${y}`, 0]] }
        });
      }),
      H('hard-box-top-mixed', '몫이 대분수인 분모가 같은 나눗셈식의 □', '심21 / 기본 ①46', (d) => {
        // 분자끼리의 나눗셈으로 바꾸고, 몫을 가분수로 고친 다음 크기가 같은 분수를 찾는다.
        const [a, b] = samePick(d, d.bool() ? 'cut' : 'over'), x = a.n, y = b.n, den = a.d, r = R(x, y), W = Math.floor(r.p / r.q), rem = r.p % r.q, first = d.bool();
        if (first) return N('□ 안에 알맞은 수는?', x, {
          figure: eq(frac(box(), den), '/', frac(y, den), '=', mixed(W, rem, r.q)),
          explain: `분모가 같으므로 분자끼리 나누면 □ ÷ ${y} = ${mixed(W, rem, r.q)} = ${frac(r.p, r.q)}이다. □ = ${y} × ${frac(r.p, r.q)} = ${x}이다.`,
          facts: { calc: [[`${y}*(${W}*${r.q}+${rem})/${r.q}`, 0]] }
        });
        return N('□ 안에 알맞은 수는?', y, {
          figure: eq(frac(x, den), '/', frac(box(), den), '=', mixed(W, rem, r.q)),
          explain: `분모가 같으므로 분자끼리 나누면 ${x} ÷ □ = ${mixed(W, rem, r.q)} = ${frac(r.p, r.q)}이다. ${x} ÷ □ = ${frac(x, '□')}이고 ${frac(r.p, r.q)} = ${frac(x, y)}이므로 □ = ${y}이다.`,
          facts: { calc: [[`${x}*${r.q}/(${W}*${r.q}+${rem})`, 0]] }
        });
      }),
      H('hard-fill-short', '문장제: 모자란 양을 구해 덜어 붓는 횟수 구하기', '심39', (d) => {
        const m = d.until(() => { const b = d.bool() ? proper(d, 2, 6) : V(d.int(1, 2), ...d.pick([[1, 2], [1, 4], [3, 4], [1, 3], [2, 3], [1, 5], [2, 5]])), k = d.int(3, 12), short = times(val(b), R(k, 1)), T = Math.ceil(short.p / short.q) + d.int(1, 8); return { b, k, short, T, a: plus(R(T, 1), short, '-') }; }, (v) => v.short.q > 1 && v.T <= 30 && v.a.p > v.a.q);
        const { b, k, T } = m, a = toV(m.a), short = toV(m.short);
        return ansQ(`들이가 ${T} L인 물통에 물이 ${show(a)} L 들어 있다. 이 물통에 물을 한 번에 ${show(b)} L씩 부어 가득 채우려고 한다. 물을 몇 번 부어야 하는가?`, qdiv(qadd(q(nat(T)), q(a), '-'), q(b)), {
          kind: 'nat', unit: '번', explain: `더 부어야 하는 물은 ${T} − ${show(a)} = ${show(short)}(L)이다. ${how(short, b)}이므로 ${k}번 부어야 한다.`
        });
      }),
      H('hard-boxes-take', '문장제: 여러 상자의 양을 구한 다음 똑같이 덜어 담기', '기본 ②62 / 심35', (d) => {
        const m = d.until(() => { const a = one(d, 'M'), c = d.int(2, 5), b = proper(d, 3, 15, 2); return { a, c, b, x: qdiv(qmul(q(a), q(nat(c))), q(b)) }; }, (v) => whole(v.x) && valueOf(v.x).p <= 40 && v.a.d !== v.b.d && v.a.w <= 3);
        const { a, c, b, x } = m, all = toV(times(val(a), R(c, 1)));
        return ansQ(`딸기가 한 상자에 ${show(a)} kg씩 ${c}상자 있다. 이 딸기를 통 하나에 ${show(b)} kg씩 남김없이 나누어 담으려고 한다. 필요한 통은 몇 개인가?`, x, {
          kind: 'nat', unit: '개', explain: `딸기는 모두 ${show(a)} × ${c} = ${show(all)}(kg)이다. ${how(all, b)}이므로 통은 ${valueOf(x).p}개 필요하다.`
        });
      }),
      H('hard-rest-times', '문장제: 남은 양을 구한 다음 몇 배인지 구하기', '심41 / 기본 ②67', (d) => {
        const m = d.until(() => { const T = d.int(1, 3), den = d.int(5, 15), t = d.int(Math.floor(den * T / 2) + 1, den * T - 1); return { T, t, rest: den * T - t, used: R(t, den), left: R(den * T - t, den) }; }, (v) => v.used.q > 1 && v.t % v.rest !== 0 && v.t > v.rest);
        const T = m.T, a = toV(m.used), left = toV(m.left);
        return ansQ(`길이가 ${T} m인 끈 가운데 ${show(a)} m를 사용하였다. 사용한 끈의 길이는 남은 끈의 길이의 몇 배인가?`, qdiv(q(a), qadd(q(nat(T)), q(a), '-')), {
          unit: '배', explain: `남은 끈은 ${T} − ${show(a)} = ${show(left)}(m)이다. 사용한 끈의 길이를 남은 끈의 길이로 나누면 ${how(a, left)}이다.`
        });
      }),
      H('hard-rate-compare', '문장제: 1시간 동안 걷는 거리를 각각 구해 견주기', '심51 / 기본 ①60 ③39', (d) => {
        // 더 먼 거리를 걸은 사람이 1시간 동안 걷는 거리는 더 짧다. 걸은 거리만 견주는 아이는 틀린다.
        const TIMES = [[1, 2], [1, 3], [1, 4], [1, 5], [2, 3], [3, 4], [2, 5], [3, 5], [5, 6]];
        const m = d.until(() => { const [t1, t2] = d.shuffle(TIMES).slice(0, 2).map(([x, y]) => V(0, x, y)), mk = () => (d.bool() ? proper(d, 3, 10, 2) : V(d.int(1, 3), ...d.pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5]]))); return { rows: [[mk(), t1], [mk(), t2]] }; },
          (v) => { const [r1, r2] = v.rows.map(([x, t]) => div(x, t)); return cmp(val(v.rows[0][0]), val(v.rows[1][0])) > 0 && cmp(r1, r2) < 0 && near(r1, r2, 2) && r1.q <= 12 && r2.q <= 12 && r2.p <= 8 * r2.q; });
        const [p, s] = d.shuffle(NAMES).slice(0, 2), rows = d.shuffle(m.rows), rates = rows.map(([x, t]) => div(x, t)), who = [p, s], win = sgn(rates[0], rates[1]) === 0 ? 0 : 1;
        return C(`${name(p, '은/는')} ${show(rows[0][1])}시간 동안 ${show(rows[0][0])} km를 걸었고, ${name(s, '은/는')} ${show(rows[1][1])}시간 동안 ${show(rows[1][0])} km를 걸었다. 두 사람이 각각 일정한 빠르기로 걸었을 때, 1시간 동안 더 먼 거리를 걷는 사람은?`, [p, '두 사람이 1시간 동안 걷는 거리는 같다.', s], sgn(rates[0], rates[1]), {
          explain: `1시간 동안 걷는 거리는 걸은 거리를 걸린 시간으로 나누어 구한다. ${name(p, '은/는')} ${told(rows[0][0], rows[0][1])}(km), ${name(s, '은/는')} ${told(rows[1][0], rows[1][1])}(km)이다. ${sv(rates[0])} ${SGN(rates[0], rates[1])} ${sv(rates[1])}이므로 ${name(who[win], '이/가')} 더 먼 거리를 걷는다.`,
          facts: { choose: { exprs: scaled(rows.map(([x, t]) => qd(x, t))), rule: 'compare' } }
        });
      }),
      H('hard-wall-paint', '문장제: 넓이를 구한 다음 1 L로 칠한 넓이 구하기', '심53 / 기본 ②77', (d) => {
        const m = d.until(() => { const w = d.bool() ? nat(d.int(2, 5)) : one(d, 'M'), h = d.bool() ? proper(d, 2, 6) : one(d, 'M'), p = d.bool() ? proper(d, 3, 9, 2) : V(d.int(1, 2), ...d.pick([[1, 2], [1, 4], [3, 4], [1, 3], [2, 3]])); return { w, h, p, x: qdiv(qmul(q(w), q(h)), q(p)) }; },
          (v) => !whole(v.x) && valueOf(v.x).q <= 20 && valueOf(v.x).p <= 150 && top(v.w) <= 20 && top(v.h) <= 20 && key(v.w) !== key(v.h) && v.w.d !== v.h.d && times(val(v.w), val(v.h)).q <= 30);
        const { w, h, p, x } = m, area = toV(times(val(w), val(h)));
        return ansQ(`가로가 ${show(w)} m, 세로가 ${show(h)} m인 직사각형 모양의 벽을 칠하는 데 페인트 ${show(p)} L를 모두 사용하였다. 페인트 1 L로 칠한 벽의 넓이는 몇 m²인가?`, x, {
          unit: 'm²', explain: `벽의 넓이는 ${show(w)} × ${show(h)} = ${show(area)}(m²)이다. 넓이를 페인트의 양으로 나누면 ${how(area, p)}이다.`
        });
      }),
      H('hard-minutes-rate', '문장제: 분을 시간으로 고쳐 1시간 동안의 양 구하기', '심50 / 기본 ①61 ②73', (d) => {
        const m = d.until(() => { const a = d.bool() ? proper(d, 3, 12, 2) : one(d, 'M'), min = d.pick([10, 12, 15, 20, 24, 30, 36, 40, 45, 48, 50]), t = R(min, 60); return { a, min, t, r: div(a, toV(t)) }; }, (v) => v.r.q > 1 && v.r.q <= 20 && v.r.p <= 150);
        const { a, min } = m, t = toV(m.t);
        return ansQ(`수도에서 일정하게 나오는 물을 ${min}분 동안 받았더니 ${show(a)} L였다. 이 수도에서 1시간 동안 나오는 물은 몇 L인가?`, qdiv(q(a), { num: String(min), dens: ['60'], P: min, D: 60 }), {
          unit: 'L', explain: `1시간은 60분이므로 ${min}분은 ${frac(min, 60)}시간 = ${show(t)}시간이다. 받은 물의 양을 걸린 시간으로 나누면 ${told(a, t)}이다.`, facts: { unseen: [60] }
        });
      }),
      H('hard-candle', '문장제: 줄어든 길이를 구한 다음 1시간 동안 줄어든 길이 구하기', '심52', (d) => {
        // 나누어지는 수는 남은 길이가 아니라 탄 길이이다.
        const m = d.until(() => {
          const t = V(...d.pick([[0, 1, 2], [0, 3, 4], [0, 2, 3], [1, 1, 4], [1, 1, 2], [1, 1, 3], [0, 4, 5], [1, 1, 5]])), [e1, e2] = d.pick([[2, 4], [4, 8], [2, 8], [3, 6], [2, 6], [5, 10], [2, 10], [4, 4], [8, 8], [6, 6]]), now = V(d.int(4, 12), coTop(d, e1), e1), burnt = V(d.int(1, 4), coTop(d, e2), e2);
          return { t, now, burnt, start: plus(val(now), val(burnt), '+') };
        }, (v) => v.start.q > 1 && div(v.burnt, v.t).q > 1 && div(v.burnt, v.t).q <= 20 && div(v.burnt, v.t).p <= 99);
        const { t, now, burnt } = m, start = toV(m.start);
        return ansQ(`길이가 ${show(start)} cm인 양초에 불을 붙이고 ${show(t)}시간이 지난 뒤에 길이를 재었더니 ${show(now)} cm였다. 양초가 일정한 빠르기로 탔을 때, 1시간 동안 탄 양초의 길이는 몇 cm인가?`, qdiv(qadd(q(start), q(now), '-'), q(t)), {
          unit: 'cm', explain: `${show(t)}시간 동안 탄 길이는 ${show(start)} − ${show(now)} = ${show(burnt)}(cm)이다. 탄 길이를 걸린 시간으로 나누면 ${how(burnt, t)}이다.`
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
