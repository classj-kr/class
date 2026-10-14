// 6학년 2학기 1단원 분수의 나눗셈 — 잘못된 계산, 몫의 크기 비교, 조건에 맞는 수의 나눗셈, □가 있는 식과 어떤 수, 문장제.
// 단원 틀과 싣는 기준, 뺀 것과 까닭은 6-2-1a.js 에, 실력 문항은 6-2-1c.js 에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2, ③n = 기본꼴_3, 심n = 심화꼴.
// 문장제는 얼개마다 한 번씩 싣는다: 똑같이 덜어 내기(분모가 같다·다르다, 자연수, 대분수), 걸리는 시간, 몇 개까지(버림)·적어도 몇 개(올림),
//   몇 배(분모가 같다·다르다, 대분수, 1보다 작은 배, 표에서 골라), 1만큼의 양(1시간 동안, 한 통의 무게, 1 kg의 값 / 1 m의 무게, 1 L로 칠하는 넓이, 1시간에 가는 거리),
//   부분으로 전체 구하기(자연수·분수), 둘레와 한 변으로 정다각형의 이름 알기, 넓이와 한 변으로 다른 변 구하기. 식에 맞는 상황 고르기는 「문제 만들기」를 고르기로 바꾼 것이다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, box, frac, mixed, lines, numbers, cards, table, N, C, F } = B.kit;
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const LAB = ['㉠', '㉡', '㉢', '㉣'], THREE = LAB.slice(0, 3);
  const SIGNS = ['&gt;', '=', '&lt;'], GT = '&gt;', LT = '&lt;';
  const gcd = (x, y) => (y ? gcd(y, x % y) : x), lcm = (x, y) => x / gcd(x, y) * y;
  const tail = (n, pair) => josa(n, pair).slice(String(n).length);
  const SG = { '+': '+', '-': '−', '*': '×', '/': '÷', '=': '=', '>': GT, '<': LT };
  const ex = (html) => '<span class="mb-expr">' + html + '</span>';
  const eq = (...parts) => ex(parts.map((p) => (SG[p] ? '<i>' + SG[p] + '</i>' : p)).join(' '));
  const tag = (label) => '<span class="mb-tag mb-tag-short">' + label + '</span>';
  const tagged = (list, tags) => lines(list.map((html, i) => tag((tags || LAB)[i]) + html));
  const versus = (left, right) => `<div class="mb-versus">${left}<span class="mb-ring"></span>${right}</div>`;

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
  // 두 값의 차가 k 이하인가
  const near = (x, y, k) => Math.abs(cmp(x, y)) <= k * x.q * y.q;
  const distinct = (vals) => vals.every((p, i) => vals.every((s, j) => i === j || cmp(p, s) !== 0));
  const allNear = (vals, k) => vals.every((p) => vals.every((s) => near(p, s, k)));
  const shares = (p, s) => p.some((x) => s.some((y) => x.n && key(x) === key(y)));
  const apart = (rows) => rows.every((p, i) => rows.every((s, j) => i >= j || !shares(p, s)));

  // ── 검사가 다시 셈하는 식 ──
  const imp = (v) => (v.n === 0 ? String(v.w) : v.w ? `(${v.w}*${v.d}+${v.n})` : String(v.n));
  const q = (v) => ({ num: imp(v), dens: v.n ? [String(v.d)] : [], P: top(v), D: v.d });
  const qmul = (x, y) => ({ num: x.num + '*' + y.num, dens: x.dens.concat(y.dens), P: x.P * y.P, D: x.D * y.D });
  const qdiv = (x, y) => ({ num: [x.num].concat(y.dens).join('*'), dens: x.dens.concat([y.num]), P: x.P * y.D, D: x.D * y.P });
  const qd = (a, b) => qdiv(q(a), q(b));
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
  // 여러 식의 값을 견줄 때 검사가 다시 셈하는 정수 식: 식마다 분자에 다른 식들의 분모를 모두 곱한다. scaledValues 는 그 값.
  const scaled = (xs) => xs.map((x, i) => xs.filter((_, j) => j !== i).reduce((list, y) => list.concat(y.dens), [x.num]).join('*'));
  const scaledValues = (xs) => xs.map((x, i) => xs.filter((_, j) => j !== i).reduce((m, y) => m * y.D, x.P));

  // ── 풀이 글(6-2-1a.js 와 같다) ──
  const chainOf = (out) => out.filter((s, i) => i === 0 || s !== out[i - 1]).join(' = ');
  function tailOf(x, y) {
    const r = R(x, y), out = [`${x} ÷ ${y}`];
    if (r.q === 1) out.push(String(r.p));
    else { out.push(frac(x, y)); if (r.p !== x) out.push(frac(r.p, r.q)); if (r.p > r.q) out.push(show(toV(r))); }
    return out;
  }
  const toldSame = (a, b) => chainOf([`${show(a)} ÷ ${show(b)}`, `${bare(a)} ÷ ${bare(b)}`].concat(tailOf(top(a), top(b))));
  function toldCommon(a, b) {
    const L = lcm(a.d, b.d), x = top(a) * (L / a.d), y = top(b) * (L / b.d);
    return chainOf([`${show(a)} ÷ ${show(b)}`, `${bare(a)} ÷ ${bare(b)}`, `${frac(x, L)} ÷ ${frac(y, L)}`].concat(tailOf(x, y)));
  }
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
  // 분모가 같으면 분자끼리 나누고, 다르면 곱셈으로 나타내어 계산한다.
  const how = (a, b) => (a.n && b.n && a.d === b.d ? toldSame(a, b) : told(a, b));

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
  function diffNat(d, unit) {
    return d.until(() => { const e = d.int(4, 24), c = unit ? 1 : coTop(d, e, 2), m = d.int(2, 6), r = R(c * m, e); return [V(0, r.p, r.q), V(0, c, e), m]; }, ([a, b]) => a.n < a.d && a.n >= 2 && a.d !== b.d);
  }
  function diffPick(d, rel, over, more) {
    return d.until(() => [proper(d, 2, 12), proper(d, 2, 12)], ([a, b]) => {
      const r = div(a, b), g = gcd(a.d, b.d), multiple = a.d !== b.d && (a.d % b.d === 0 || b.d % a.d === 0);
      return a.d !== b.d && (rel === 'multiple' ? multiple : rel === 'coprime' ? g === 1 : true) && (over == null || (r.p > r.q) === over) && r.q > 1 && r.q <= 60 && r.p <= 99 && (!more || more(a, b));
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
  // 차례 고르기 보기: 바른 차례 하나와 틀린 차례 셋
  const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  function orderChoice(d, vals, names, desc) {
    const right = [0, 1, 2].sort((p, s) => (desc ? cmp(vals[s], vals[p]) : cmp(vals[p], vals[s]))), id = (o) => o.join();
    const list = d.shuffle(d.shuffle(ORDERS.filter((o) => id(o) !== id(right))).slice(0, 3).concat([right]));
    return { list, right, options: list.map((o) => o.map((i) => names[i]).join(', ')), answer: list.findIndex((o) => id(o) === id(right)) };
  }
  const best = (vals, big) => vals.reduce((at, v, i) => ((big ? cmp(v, vals[at]) > 0 : cmp(v, vals[at]) < 0) ? i : at), 0);

  const COMMON = '통분하여 분모를 같게 한 다음 분자끼리 나눈다. ', FLIP = '나누는 수의 분모와 분자를 바꾸어 곱한다. ';
  const said = (who, text) => `<span class="mb-tag" style="min-width:3em">${who}</span>${text}`;

  // ── 잘못된 계산 살펴보기 ──
  B.addTypes('6-2-1', 'check', [
    T('check-talk', '분모가 같은 나눗셈을 잘못 말한 사람 찾기', '③6 ①12', (d) => {
      // 틀린 말: 분자끼리 나눈 몫에 분모를 그대로 붙인 것(12/13 ÷ 4/13 = 3/13 이라고 하는 아이)
      const [a, b] = samePick(d, 'nat'), k = a.n / b.n, u = frac(1, a.d), who = d.shuffle(NAMES).slice(0, 3);
      const right = d.shuffle([`${show(a)}에는 ${u}이 ${a.n}개, ${show(b)}에는 ${u}이 ${b.n}개 있다.`, `${a.n} ÷ ${josa(b.n, '과/와')} 계산 결과가 같다.`, `${show(a)}에서 ${vj(b, '을/를')} ${k}번 덜어 낼 수 있다.`]).slice(0, 2);
      const rows = d.shuffle([[right[0], true], [right[1], true], [`분자끼리 나누면 ${k}이고 분모는 그대로이므로 몫은 ${frac(k, a.d)}이다.`, false]]);
      return C(`${show(a)} ÷ ${show(b)}의 계산을 두고 세 사람이 말하였다. 잘못 말한 사람은?`, who, rows.findIndex((row) => !row[1]), {
        figure: lines(rows.map((row, i) => said(who[i], row[0]))),
        explain: `${show(a)} ÷ ${vj(b, '은/는')} ${show(a)} 안에 ${vj(b, '이/가')} 몇 번 들어가는지 구하는 것이다. 분자끼리 나눈 ${a.n} ÷ ${b.n} = ${k}${tail(k, '이/가')} 몫이고, 분모는 붙이지 않는다.`,
        facts: { truth: rows.map((row) => row[1]), want: false }
      });
    }),
    T('check-why', '잘못 계산한 까닭 고르기', '①12·26·35 ②31 ③42·53 심9', (d, n) => {
      // 문항마다 잘못이 다르다: 통분하지 않고 분자끼리 나눔, 나누는 수를 뒤집지 않고 곱함, 대분수를 가분수로 고치지 않고 곱함.
      const WHY = [['분모가 다른데 통분하지 않고 분자끼리 나누었다.', 0], ['나누는 수의 분모와 분자를 바꾸지 않고 곱하였다.', 1], ['대분수를 가분수로 나타내지 않고 계산하였다.', 2], ['나누어지는 수의 분모와 분자를 바꾸어 곱하였다.', 3]];
      let figure, a, b, why;
      if (n === 0) {
        [a, b] = d.until(() => [proper(d, 4, 16, 2), proper(d, 2, 9, 2)], ([p, s]) => p.d !== s.d && p.n > s.n && p.n % s.n === 0 && s.n >= 2 && div(p, s).q <= 40 && div(p, s).q > 1);
        figure = lines([eq(show(a), '/', show(b), '=', a.n, '/', b.n, '=', a.n / b.n)]);
        why = '분모가 다른 분수의 나눗셈은 통분한 다음 분자끼리 나눈다.';
      } else if (n === 1) {
        [a, b] = mulPick(d, d.int(0, 1), null, 12);
        const w = R(a.n * b.n, a.d * b.d);
        figure = lines([eq(show(a), '/', show(b), '=', show(a), '*', show(b)), eq('=', frac(w.p, w.q))]);
        why = '나눗셈을 곱셈으로 나타낼 때에는 나누는 수의 분모와 분자를 바꾸어야 한다.';
      } else {
        [a, b] = d.until(() => pairOf(d, 'MP', { whole: false }), ([p, s]) => s.n >= 2 && p.n * s.d < p.d * s.n && p.d * s.n <= 40);
        const part = R(a.n * b.d, a.d * b.n);
        figure = lines([eq(show(a), '/', show(b), '=', show(a), '*', flipped(b)), eq('=', mixed(a.w, `${a.n} × ${b.d}`, `${a.d} × ${b.n}`), '=', mixed(a.w, part.p, part.q))]);
        why = '대분수는 가분수로 나타낸 다음 곱해야 한다. 분수 부분에만 곱하면 자연수 부분은 나누어지지 않는다.';
      }
      const rows = d.shuffle(WHY);
      return C('다음은 잘못 계산한 것이다. 잘못 계산한 까닭을 바르게 말한 것은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1] === n), {
        figure, explain: `${why} 바르게 계산하면 ${n === 0 ? toldCommon(a, b) : told(a, b)}이다.`, facts: { truth: rows.map((row) => row[1] === n), want: true }
      });
    }, { count: 3 }),
    T('check-value', '잘못된 계산을 바르게 고치기', '①12·21·35 ②29·31 ③53 심9', (d, n) => {
      // 문항마다 잘못이 다르다: 분자가 같다고 분모끼리 나눔, 나누어지는 수를 뒤집음, (자연수)÷(분수)에서 분수를 그대로 곱함, 대분수의 분수 부분에만 곱함.
      const TEXT = '다음은 잘못 계산한 것이다. 바르게 계산한 값은?';
      if (n === 0) {
        const [c, e, m] = d.until(() => [d.int(2, 9), d.int(3, 9), d.int(2, 4)], ([x, y, z]) => x < y && gcd(x, y * z) === 1 && y * z <= 30), a = V(0, c, e), b = V(0, c, e * m);
        return ans(TEXT, a, b, { kind: 'nat', figure: lines([eq(show(a), '/', show(b), '=', e, '/', e * m, '=', frac(1, m))]), explain: `분자가 같다고 분모끼리 나누면 안 된다. ${COMMON}${toldCommon(a, b)}이다.` });
      }
      if (n === 1) {
        const [a, b] = mulPick(d, d.int(0, 2), null, 12), w = R(a.d * b.n, a.n * b.d);
        return ans(TEXT, a, b, { figure: lines([eq(show(a), '/', show(b), '=', frac(a.d, a.n), '*', show(b)), eq('=', show(toV(w)))]), explain: `분모와 분자를 바꾸는 것은 나누어지는 수가 아니라 나누는 수 ${show(b)}이다. ${told(a, b)}이다.` });
      }
      if (n === 2) {
        const [c, f] = d.until(() => { const e = d.int(3, 8), t = coTop(d, e, 2); return [nat(t * e * d.int(1, 3)), V(0, t, e)]; }, ([x, y]) => x.w <= 60 && x.w * y.d / y.n <= 99);
        return ans(TEXT, c, f, { kind: 'nat', figure: lines([eq(c.w, '/', show(f), '=', c.w, '*', show(f), '=', c.w * f.n / f.d)]), explain: `1보다 작은 수로 나누었으므로 몫은 ${c.w}보다 커야 한다. ${FLIP}${told(c, f)}이다.` });
      }
      const [a, b] = d.until(() => pairOf(d, 'MP', { whole: false }), ([p, s]) => s.n >= 2 && p.n * s.d < p.d * s.n && p.d * s.n <= 40), part = R(a.n * b.d, a.d * b.n);
      return ans(TEXT, a, b, { figure: lines([eq(show(a), '/', show(b), '=', show(a), '*', flipped(b)), eq('=', mixed(a.w, `${a.n} × ${b.d}`, `${a.d} × ${b.n}`), '=', mixed(a.w, part.p, part.q))]), explain: `대분수는 가분수로 나타낸 다음 곱해야 한다. ${told(a, b)}이다.` });
    }, { count: 4 }),
    T('check-wrong-pick', '계산이 잘못된 것 고르기', '①21 ②29 ③42 심10', (d) => {
      // 네 식 가운데 하나만 틀리다. 틀린 값은 그 계산에서 흔한 잘못으로 구한 값이다: 분모를 곱하지 않음, 나누는 차례를 바꿈, 나누는 수를 뒤집지 않음, 대분수의 분수 부분에만 곱함.
      const made = d.until(() => {
        const r0 = natPick(d, 'whole'), r1 = samePick(d, d.bool() ? 'over' : 'cut'), r2 = mulPick(d, d.int(0, 1), null, 9), r3 = pairOf(d, 'MP', { whole: false });
        const [c, f] = r0, [p, s] = r1, [x, y] = r2, [m, g] = r3;
        return { rows: [r0, r1, r2, r3], wrong: [R(c.w, f.n), R(s.n, p.n), R(x.n * y.n, x.d * y.d), R(m.w * m.d * g.n + m.n * g.d, m.d * g.n)] };
      }, (v) => v.wrong.every((w, i) => cmp(w, div(v.rows[i][0], v.rows[i][1])) !== 0) && v.rows[3][1].n >= 2 && v.wrong[3].q <= 40);
      const bad = d.int(0, 3), saids = made.rows.map((row, i) => (i === bad ? made.wrong[i] : div(row[0], row[1])));
      return C('계산이 잘못된 것은?', made.rows.map((row, i) => eq(show(row[0]), '/', show(row[1]), '=', show(toV(saids[i])))), bad, {
        explain: `바르게 계산하면 ${how(made.rows[bad][0], made.rows[bad][1])}이다. 나머지는 바르게 계산하였다.`,
        facts: { claimed: made.rows.map((row, i) => { const x = qd(row[0], row[1]); return [`${x.num}*${saids[i].q}`, saids[i].p * x.D]; }), claimedWant: false }
      });
    }),
    T('check-process', '계산 과정이 잘못된 것 고르기', '②30 ①26 심10', (d) => {
      // 세 식 가운데 하나만 틀리다: 분모로 나누고 분자를 곱함, 나누는 수를 뒤집지 않음(나누어지는 수를 뒤집음), 통분하면서 분자를 그대로 둠, 단위분수를 그대로 곱함.
      // 줄마다 왼쪽 식의 값 L 과 오른쪽 식의 값 S 를 [분자, 분모]로 적어 둔다.
      const bad = d.int(0, 2), kinds = d.shuffle([0, 1, 2, 3]).slice(0, 3);
      const rows = kinds.map((kind, i) => {
        const wrong = i === bad;
        if (kind === 0) {
          const [c, f] = natPick(d, 'whole');
          return { html: eq(c.w, '/', show(f), '=', c.w, '/', wrong ? f.d : f.n, '*', wrong ? f.n : f.d), L: [c.w * f.d, f.n], S: wrong ? [c.w * f.n, f.d] : [c.w * f.d, f.n], fix: `${c.w} ÷ ${vj(f, '은/는')} 자연수를 분자로 나눈 다음 분모를 곱한다. ${c.w} ÷ ${show(f)} = ${c.w} ÷ ${f.n} × ${f.d}이다.` };
        }
        if (kind === 1) {
          const [a, b] = mulPick(d, d.int(0, 1), null, 9), turned = d.bool(), fa = frac(a.d, a.n), fb = frac(b.d, b.n);
          return { html: eq(show(a), '/', show(b), '=', wrong && turned ? fa : show(a), '*', wrong ? show(b) : fb), L: [a.n * b.d, a.d * b.n], S: !wrong ? [a.n * b.d, a.d * b.n] : turned ? [a.d * b.n, a.n * b.d] : [a.n * b.n, a.d * b.d], fix: `나누어지는 수는 그대로 두고 나누는 수의 분모와 분자를 바꾸어 곱한다. ${show(a)} ÷ ${show(b)} = ${show(a)} × ${fb}이다.` };
        }
        if (kind === 2) {
          const [a, b] = diffPick(d, 'coprime', null, (p, s) => p.d * s.d <= 40 && p.n >= 2 && s.n >= 2), L = a.d * b.d, x = a.n * b.d, y = b.n * a.d;
          return { html: eq(show(a), '/', show(b), '=', frac(wrong ? a.n : x, L), '/', frac(wrong ? b.n : y, L)), L: [x, y], S: wrong ? [a.n, b.n] : [x, y], fix: `통분하면 분자도 분모에 곱한 수만큼 커진다. ${show(a)} ÷ ${show(b)} = ${frac(x, L)} ÷ ${frac(y, L)}이다.` };
        }
        const [c, e] = d.until(() => [d.int(2, 12), d.int(2, 9)], ([x, y]) => x !== y), u = frac(1, e);
        return { html: eq(c, '/', u, '=', c, '*', wrong ? u : e), L: [c * e, 1], S: wrong ? [c, e] : [c * e, 1], fix: `(자연수)÷(단위분수)는 자연수에 단위분수의 분모를 곱한다. ${c} ÷ ${u} = ${c} × ${e}이다.` };
      });
      return C('계산 과정이 잘못된 것은?', THREE, bad, {
        figure: tagged(rows.map((row) => row.html)), explain: rows[bad].fix,
        facts: { claimed: rows.map((row) => [`${row.L[0]}*${row.S[1]}`, row.L[1] * row.S[0]]), claimedWant: false }
      });
    })
  ]);

  // ── 몫의 크기 비교하기 ──
  B.addTypes('6-2-1', 'comp', [
    T('comp-divisor-sign', '계산하지 않고 몫과 나누어지는 수의 크기 비교하기', '①41 심17·19', (d, n) => {
      if (n === 0) {
        // 나누는 수는 진분수, 가분수·대분수, 1 가운데 하나이다.
        const X = d.bool() ? nat(d.int(3, 12)) : proper(d, 3, 9, 2), kind = d.int(0, 4);
        const m = d.until(() => (kind === 0 ? nat(1) : kind <= 2 ? proper(d, 3, 9) : one(d, d.bool() ? 'M' : 'I')), (v) => key(v) !== key(X)), big = top(m) > m.d;
        const turned = d.bool(), parts = turned ? [ex(show(X)), divided(X, m)] : [divided(X, m), ex(show(X))], qs = turned ? [q(X), qd(X, m)] : [qd(X, m), q(X)], vals = turned ? [val(X), div(X, m)] : [div(X, m), val(X)];
        return C('계산하지 않고 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, sgn(vals[0], vals[1]), {
          figure: versus(parts[0], parts[1]),
          explain: m.n === 0 ? '어떤 수를 1로 나누면 몫은 그 수와 같다.' : `나누는 수 ${vj(m, '은/는')} 1보다 ${big ? '크므로' : '작으므로'} 몫은 ${show(X)}보다 ${big ? '작다' : '크다'}.`,
          facts: { choose: { exprs: scaled(qs), rule: 'compare' }, rule: 'divisorOne' }
        });
      }
      // 같은 두 수의 곱셈과 나눗셈
      const c = d.bool() ? nat(d.int(2, 12)) : proper(d, 3, 9, 2), f = d.until(() => (d.int(0, 2) ? proper(d, 2, 9) : one(d, d.bool() ? 'M' : 'I')), (v) => key(v) !== key(c)), small = top(f) < f.d;
      const order = d.shuffle(['*', '/']), qs = order.map((op) => (op === '*' ? qmul(q(c), q(f)) : qd(c, f))), vals = order.map((op) => (op === '*' ? R(top(c) * top(f), c.d * f.d) : div(c, f)));
      return C('계산하지 않고 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, sgn(vals[0], vals[1]), {
        figure: versus(eq(show(c), order[0], show(f)), eq(show(c), order[1], show(f))),
        explain: `${vj(f, '은/는')} 1보다 ${small ? '작다' : '크다'}. 1보다 ${small ? '작은' : '큰'} 수를 곱하면 ${show(c)}보다 ${small ? '작아지고' : '커지고'}, 1보다 ${small ? '작은' : '큰'} 수로 나누면 ${show(c)}보다 ${small ? '커진다' : '작아진다'}.`,
        facts: { choose: { exprs: scaled(qs), rule: 'compare' }, rule: 'mulOrDiv' }
      });
    }, { count: 2 }),
    T('comp-shared', '같은 수가 있는 두 나눗셈을 계산하지 않고 비교하기', '②32 심16', (d, n) => {
      // 첫째 문항은 나누는 수가 같고, 둘째 문항은 나누어지는 수가 같다(나누는 수가 클수록 몫이 작다).
      const [x, y] = easyPair(d), S = d.until(() => (d.int(0, 2) === 0 ? nat(d.int(2, 9)) : d.bool() ? proper(d, 3, 9) : one(d, 'M')), (v) => key(v) !== key(x) && key(v) !== key(y));
      const rows = n === 0 ? [[x, S], [y, S]] : [[S, x], [S, y]], vals = rows.map(([a, b]) => div(a, b));
      const why = n === 0 ? `두 식 모두 ${vj(S, '으로/로')} 나누므로 나누어지는 수가 클수록 몫이 크다. ${show(x)} ${SGN(val(x), val(y))} ${show(y)}이다.` : `두 식 모두 ${vj(S, '을/를')} 나누므로 나누는 수가 클수록 몫이 작다. ${show(x)} ${SGN(val(x), val(y))} ${show(y)}이므로 몫의 크기는 그 반대이다.`;
      return C(n === 0 ? '두 식의 나누는 수가 같다. 계산하지 않고 크기를 비교할 때, ○ 안에 알맞은 것은?' : '두 식의 나누어지는 수가 같다. 계산하지 않고 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, sgn(vals[0], vals[1]), {
        figure: versus(divided(rows[0][0], rows[0][1]), divided(rows[1][0], rows[1][1])), explain: why,
        facts: { choose: { exprs: scaled(rows.map(([a, b]) => qd(a, b))), rule: 'compare' }, rule: ['sharedDivisor', 'sharedDividend'][n] }
      });
    }, { count: 2 }),
    T('comp-same-numer', '분모가 같은 나눗셈끼리 몫 비교하기', '①9 ③12 심16', (d) => {
      // 세 번에 두 번은 분자끼리의 나눗셈이 같아 몫이 같다(분모는 서로 다르다).
      const equal = d.int(0, 2) > 0, PRIMES = [11, 13, 17, 19, 23];
      const m = d.until(() => { const [e1, e2] = d.shuffle(PRIMES).slice(0, 2), x = d.int(2, 10), y = d.int(2, 10); return { e1, e2, x, y, x2: equal ? x : x + d.pick([-1, 1]) }; }, (v) => v.x !== v.y && gcd(v.x, v.y) === 1 && v.x2 !== v.y && v.x2 >= 1 && Math.max(v.x, v.y, v.x2) < Math.min(v.e1, v.e2));
      const rows = [[V(0, m.x, m.e1), V(0, m.y, m.e1)], [V(0, m.x2, m.e2), V(0, m.y, m.e2)]], vals = rows.map(([a, b]) => div(a, b));
      return C('두 나눗셈의 몫의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, sgn(vals[0], vals[1]), {
        figure: versus(divided(rows[0][0], rows[0][1]), divided(rows[1][0], rows[1][1])),
        explain: `분모가 같은 분수의 나눗셈은 분자끼리 나눈다. 앞의 식은 ${m.x} ÷ ${m.y}, 뒤의 식은 ${m.x2} ÷ ${m.y}이다. ` + (equal ? '분모는 달라도 분자끼리의 나눗셈이 같으므로 몫이 같다.' : `나누는 수가 같으므로 나누어지는 수가 큰 쪽의 몫이 크다.`),
        facts: { choose: { exprs: [`${m.x}*${m.y}`, `${m.x2}*${m.y}`], rule: 'compare' }, rule: 'sameNumer' }
      });
    }),
    T('comp-sign', '두 몫의 크기 비교', '①36 ②32 ③11·19·33·52 심16', (d, n) => {
      // 문항마다 수의 갈래가 다르다: 분모가 같은 진분수끼리, 분모가 다른 진분수끼리, (자연수)÷(분수)끼리, 대분수가 있는 나눗셈끼리. 두 몫이 가까워 계산해 보아야 알 수 있다.
      const gen = [() => [samePick(d, d.bool() ? 'over' : 'cut'), samePick(d, 'over')], () => [mulPick(d, null, null, 12), mulPick(d, null, null, 12)], () => [natPick(d, d.bool() ? 'whole' : 'cut'), natPick(d, 'plain')], () => [pairOf(d, 'MP', { whole: d.bool() }), pairOf(d, 'MM', { whole: false })]][n];
      const rows = d.until(gen, ([p, s]) => { const x = div(p[0], p[1]), y = div(s[0], s[1]); return near(x, y, n === 2 ? 3 : 1) && cmp(x, y) !== 0 && !shares(p, s) && (n !== 0 || p[0].d !== s[0].d); });
      const vals = rows.map(([a, b]) => div(a, b));
      return C('두 식의 계산 결과를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, sgn(vals[0], vals[1]), {
        figure: versus(divided(rows[0][0], rows[0][1]), divided(rows[1][0], rows[1][1])),
        explain: `${show(rows[0][0])} ÷ ${show(rows[0][1])} = ${res(rows[0][0], rows[0][1])}, ${show(rows[1][0])} ÷ ${show(rows[1][1])} = ${res(rows[1][0], rows[1][1])}이다. ${res(rows[0][0], rows[0][1])} ${SGN(vals[0], vals[1])} ${res(rows[1][0], rows[1][1])}이다.`,
        facts: { choose: { exprs: scaled(rows.map(([a, b]) => qd(a, b))), rule: 'compare' }, rule: ['signSame', 'signDiff', 'signNat', 'signMixed'][n] }
      });
    }, { count: 4 }),
    T('comp-sign-value', '몫과 자연수의 크기 비교', '②32 ③19 심16', (d) => {
      // 네 번에 한 번은 몫이 자연수로 떨어져 수와 같다.
      const equal = d.int(0, 3) === 0, [a, b] = equal ? (d.bool() ? diffNat(d).slice(0, 2) : samePick(d, 'nat')) : d.bool() ? samePick(d, d.bool() ? 'over' : 'cut') : diffPick(d, 'any', true);
      const v = div(a, b), k = equal ? v.p : Math.floor(v.p / v.q) + d.int(0, 1), x = qd(a, b);
      return C('몫과 수의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, sgn(v, R(k, 1)), {
        figure: versus(divided(a, b), ex(k)),
        explain: `${how(a, b)}이다. ` + (equal ? '몫과 수의 크기가 같다.' : `${show(toV(v))} ${SGN(v, R(k, 1))} ${k}이다.`),
        facts: { choose: { exprs: [x.num, [String(k)].concat(x.dens).join('*')], rule: 'compare' } }
      });
    }),
    T('comp-max', '몫이 가장 큰(작은) 식 찾기', '①37 ②33 ③19·33 심17', (d) => {
      const rows = d.until(() => [natPick(d, 'whole'), natPick(d, d.bool() ? 'plain' : 'cut'), natPick(d, d.bool() ? 'whole' : 'plain')], (list) => { const vs = list.map(([a, b]) => div(a, b)); return distinct(vs) && allNear(vs, 5) && apart(list) && new Set(list.map(([c]) => c.w)).size === 3; });
      const order = d.shuffle([0, 1, 2]).map((i) => rows[i]), vs = order.map(([a, b]) => div(a, b)), big = d.bool(), hit = best(vs, big);
      return C(`계산 결과가 가장 ${big ? '큰' : '작은'} 것은?`, THREE, hit, {
        figure: tagged(order.map(([a, b]) => divided(a, b))),
        explain: `계산 결과는 ${order.map(([a, b], i) => `${LAB[i]} ${res(a, b)}`).join(', ')}이다. 가장 ${big ? '큰' : '작은'} 것은 ${LAB[hit]}이다.`,
        facts: { choose: { exprs: scaled(order.map(([a, b]) => qd(a, b))), rule: big ? 'max' : 'min' } }
      });
    }),
    T('comp-order', '(자연수)÷(단위분수)의 몫을 크기 차례로 늘어놓기', '①37 ②34 ③26 심17', (d) => {
      const rows = d.until(() => [0, 0, 0].map(() => [d.int(2, 12), d.int(2, 9)]), (list) => { const ps = list.map(([c, e]) => c * e); return new Set(ps).size === 3 && Math.max(...ps) - Math.min(...ps) <= 20 && new Set(list.map(([c]) => c)).size === 3 && new Set(list.map(([, e]) => e)).size === 3 && list.every(([c, e]) => c !== e); });
      const desc = d.bool(), pick = orderChoice(d, rows.map(([c, e]) => R(c * e, 1)), THREE, desc);
      return C(`계산 결과가 ${desc ? '큰' : '작은'} 것부터 차례대로 쓴 것은?`, pick.options, pick.answer, {
        figure: tagged(rows.map(([c, e]) => eq(c, '/', frac(1, e)))),
        explain: `(자연수)÷(단위분수)는 자연수에 단위분수의 분모를 곱한다. 계산 결과는 ${rows.map(([c, e], i) => `${LAB[i]} ${c} × ${e} = ${c * e}`).join(', ')}이다.`,
        facts: { choose: { exprs: rows.map(([c, e]) => `${c}*${e}`), rule: desc ? 'descending' : 'ascending', orders: pick.list } }
      });
    }),
    T('comp-one', '계산하지 않고 몫이 1보다 큰(작은) 나눗셈 찾기', '①38 ②37 ③20 심19', (d) => {
      // 나누어지는 수가 나누는 수보다 크면 몫이 1보다 크다. 네 식 가운데 하나만 다르다(분모가 같은 진분수, 분모가 같은 가분수, 분모가 다른 진분수, 대분수).
      const big = d.bool(), at = d.int(0, 3);
      const gens = [(over) => samePick(d, over ? 'over' : 'under'), (over) => { const den = d.int(3, 9), [x, y] = d.until(() => [den + d.int(1, den - 1), den + d.int(1, den - 1)], ([p, s]) => p !== s && gcd(p, den) === 1 && gcd(s, den) === 1).sort((p, s) => p - s); return over ? [V(0, y, den), V(0, x, den)] : [V(0, x, den), V(0, y, den)]; },
        (over) => mulPick(d, null, over, 12), (over) => pairOf(d, 'MM', { whole: false, under: !over })];
      const rows = d.shuffle(gens.map((gen, i) => gen((i === at) === big)));
      const diffs = rows.map(([a, b]) => top(a) * b.d - a.d * top(b)), hit = diffs.findIndex((v) => (big ? v > 0 : v < 0));
      return C(`계산하지 않고 알아보려고 한다. 몫이 1보다 ${big ? '큰' : '작은'} 것은?`, LAB, hit, {
        figure: tagged(rows.map(([a, b]) => divided(a, b))),
        explain: `나누어지는 수가 나누는 수보다 크면 몫이 1보다 크고, 작으면 몫이 1보다 작다. 나누어지는 수가 나누는 수보다 ${big ? '큰' : '작은'} 것은 ${LAB[hit]}뿐이다.`,
        facts: { only: { values: diffs, test: big ? 'atLeast' : 'atMost', target: big ? 1 : -1 } }
      });
    }),
    T('comp-natural', '몫이 자연수인 나눗셈 찾기', '①39 ②36 ③34 심19', (d, n) => {
      // 첫째 문항은 (자연수)÷(진분수) 셋, 둘째 문항은 분모가 다른 진분수의 나눗셈 셋. 자연수가 되는 것은 하나뿐이다.
      const rows = d.shuffle(d.until(() => (n === 0 ? [natPick(d, 'whole'), natPick(d, 'cut'), natPick(d, 'plain')] : [diffNat(d).slice(0, 2), diffPick(d, 'multiple', true), diffPick(d, 'multiple', null)]), (list) => apart(list) && (n !== 0 || new Set(list.map(([c]) => c.w)).size === 3)));
      const hit = rows.findIndex(([a, b]) => div(a, b).q === 1);
      return C('계산 결과가 자연수인 것은?', THREE, hit, {
        figure: tagged(rows.map(([a, b]) => divided(a, b))),
        explain: `계산 결과는 ${rows.map(([a, b], i) => `${LAB[i]} ${res(a, b)}`).join(', ')}이다. 자연수인 것은 ${LAB[hit]}이다.`,
        facts: { claimed: rows.map(([a, b]) => { const x = qd(a, b); return [`${x.num}%(${x.dens.join('*')})`, 0]; }), claimedWant: true }
      });
    }, { count: 2 }),
    T('comp-above', '몫이 주어진 수보다 큰 나눗셈 찾기', '①40 ②37 심19', (d) => {
      // 세 식의 몫은 모두 기준 수에 가깝고, 기준 수보다 큰 것은 하나뿐이다.
      const m = d.until(() => ({ K: d.int(2, 6), rows: [pairOf(d, 'MP', { whole: false }), pairOf(d, d.bool() ? 'NM' : 'NI', { whole: false }), pairOf(d, d.bool() ? 'MM' : 'IP', { whole: false })] }), (v) => {
        const vs = v.rows.map(([a, b]) => div(a, b)), K = R(v.K, 1);
        return vs.every((x) => near(x, K, 1.5)) && vs.filter((x) => cmp(x, K) > 0).length === 1 && apart(v.rows) && distinct(vs);
      });
      const rows = d.shuffle(m.rows), K = m.K, xs = rows.map(([a, b]) => qd(a, b)), hit = rows.findIndex(([a, b]) => cmp(div(a, b), R(K, 1)) > 0);
      return C(`계산 결과가 ${K}보다 큰 것은?`, THREE, hit, {
        figure: tagged(rows.map(([a, b]) => divided(a, b))),
        explain: `계산 결과는 ${rows.map(([a, b], i) => `${LAB[i]} ${res(a, b)}`).join(', ')}이다. ${K}보다 큰 것은 ${LAB[hit]}이다.`,
        facts: { only: { values: xs.map((x) => x.P - K * x.D), test: 'atLeast', target: 1 } }
      });
    }),
    T('comp-odd', '몫이 나머지와 다른 (자연수)÷(분수) 찾기', '②35 ③34 심18', (d) => {
      // 두 식은 몫이 같고 한 식만 다르다. 모두 몫이 자연수이다.
      const reps = (K) => { const out = []; for (let e = 3; e <= 12; e += 1) for (let t = 2; t < e; t += 1) if (gcd(t, e) === 1 && (K * t) % e === 0 && K * t / e <= 30) out.push([nat(K * t / e), V(0, t, e)]); return out; };
      const m = d.until(() => { const K = d.pick([12, 15, 16, 18, 20, 21, 24, 28, 30]), K2 = d.pick([12, 15, 16, 18, 20, 21, 24, 28, 30]); return { K, K2, same: d.shuffle(reps(K)).slice(0, 2), other: d.pick(reps(K2)) }; }, (v) => v.K !== v.K2 && Math.abs(v.K - v.K2) <= 8 && v.same.length === 2 && new Set(v.same.concat([v.other]).map(([c]) => c.w)).size === 3 && new Set(v.same.concat([v.other]).map(([, f]) => key(f))).size === 3);
      const order = d.shuffle([0, 1, 2]), all = m.same.concat([m.other]), rows = order.map((i) => all[i]), hit = order.indexOf(2);
      return C('계산 결과가 나머지와 다른 하나는?', THREE, hit, {
        figure: tagged(rows.map(([a, b]) => divided(a, b))),
        explain: `계산 결과는 ${rows.map(([a, b], i) => `${LAB[i]} ${res(a, b)}`).join(', ')}이다. ${LAB[hit]}만 다르다.`,
        facts: { choose: { exprs: rows.map(([c, f]) => `${c.w}*${f.d}/${f.n}`), rule: 'odd' } }
      });
    }),
    T('comp-match', '식과 몫 짝 짓기', '①28 ②38 ③4·31 심6', (d) => {
      const rows = d.until(() => [pairOf(d, 'NM', { whole: false }), pairOf(d, 'PM', { whole: false }), pairOf(d, 'MM', { whole: false })], (list) => { const vs = list.map(([a, b]) => div(a, b)); return distinct(vs) && apart(list) && vs.every((v) => v.q <= 24 && v.p <= 80); });
      const order = d.shuffle([0, 1, 2]).map((i) => rows[i]), xs = order.map(([a, b]) => qd(a, b)), ints = scaledValues(xs), list = d.shuffle(d.shuffle(ORDERS.slice(1)).slice(0, 3).concat([ORDERS[0]]));
      return C('식과 계산 결과를 알맞게 짝 지은 것은?', list.map((o) => o.map((j, i) => `${LAB[i]} ${res(order[j][0], order[j][1])}`).join(', ')), list.findIndex((o) => o.join() === '0,1,2'), {
        figure: tagged(order.map(([a, b]) => divided(a, b))),
        explain: order.map(([a, b], i) => `${LAB[i]} ${told(a, b)}`).join(', ') + '이다.',
        facts: { match: { exprs: scaled(xs), options: list.map((o) => o.map((j) => ints[j])) } }
      });
    })
  ]);

  // ── 조건에 맞는 수의 나눗셈 ──
  B.addTypes('6-2-1', 'pick', [
    T('say-unit-quot', '단위분수가 몇 개인 수를 분수로 나눈 몫', '①25 ②3·14', (d) => {
      const [a, b] = mulPick(d, null, null, 12);
      return ans(`${frac(1, a.d)}이 ${a.n}개인 수를 ${vj(b, '으로/로')} 나눈 몫은?`, a, b, { explain: `${frac(1, a.d)}이 ${a.n}개인 수는 ${show(a)}이다. ${told(a, b)}이다.` });
    }),
    T('say-times', '한 수는 다른 수의 몇 배인지 구하기', '①44 ②65 ③46 심40', (d, n) => {
      // 첫째 문항은 분수끼리(몫이 분수), 둘째 문항은 자연수와 진분수(몫이 자연수).
      if (n === 0) {
        const [a, b] = mulPick(d, d.int(1, 2), true, 24);
        return ans(`${vj(a, '은/는')} ${show(b)}의 몇 배인가?`, a, b, { unit: '배', explain: `${show(a)} ÷ ${vj(b, '으로/로')} 구한다. ${told(a, b)}이다.` });
      }
      const [c, f] = natPick(d, 'whole');
      return ans(`${josa(c.w, '은/는')} ${show(f)}의 몇 배인가?`, c, f, { kind: 'nat', unit: '배', explain: `${c.w} ÷ ${vj(f, '으로/로')} 구한다. ${told(c, f)}이다.` });
    }, { count: 2 }),
    T('pick-kinds', '수의 갈래를 가려 나누기', '①20·42 ②17·26·49 심7', (d, n) => {
      if (n === 0) {
        // 분수가 앞에 적혀 있어도 자연수가 나누어지는 수이다.
        const [c, f] = natPick(d, 'whole');
        return ans('두 수 가운데 자연수를 분수로 나눈 몫은?', c, f, { kind: 'nat', figure: numbers([show(f), c.w]), explain: `자연수 ${josa(c.w, '을/를')} 분수 ${vj(f, '으로/로')} 나눈다. ${told(c, f)}이다.` });
      }
      // 진분수·가분수·대분수 가운데 둘을 골라 나눈다.
      const mixedFirst = d.bool(), [a, b, other] = d.until(() => { const [x, y] = pairOf(d, mixedFirst ? 'MP' : 'IP', { whole: false }); return [x, y, one(d, mixedFirst ? 'I' : 'M')]; }, ([x, y, z]) => new Set([x.d, y.d, z.d]).size === 3);
      return ans(`세 수 가운데 ${mixedFirst ? '대분수' : '가분수'}를 진분수로 나눈 몫은?`, a, b, { figure: numbers(d.shuffle([a, b, other]).map(show)), explain: `${mixedFirst ? '대분수' : '가분수'}는 ${show(a)}, 진분수는 ${show(b)}이다. ${told(a, b)}이다.` });
    }, { count: 2 }),
    T('ends-quot', '가장 큰 수와 가장 작은 수로 나눗셈하기', '①42 ②49·50 ③21 심13', (d, n) => {
      if (n === 0) {
        // 분모가 같은 분수 다섯
        const den = d.pick([11, 13, 17, 19]), tops = d.until(() => d.shuffle(Array.from({ length: den - 2 }, (_, i) => i + 2)).slice(0, 5), (list) => { const hi = Math.max(...list), lo = Math.min(...list); return hi % lo !== 0; });
        const hi = V(0, Math.max(...tops), den), lo = V(0, Math.min(...tops), den);
        return ans('다섯 분수 가운데 가장 큰 수를 가장 작은 수로 나눈 몫은?', hi, lo, { figure: numbers(tops.map((t) => frac(t, den))), explain: `분모가 같으므로 분자가 가장 큰 ${vj(hi, '이/가')} 가장 크고, 분자가 가장 작은 ${vj(lo, '이/가')} 가장 작다. ${toldSame(hi, lo)}이다.` });
      }
      if (n === 1) {
        // 분자가 같은 진분수 넷: 분모가 작을수록 크다.
        const t = d.pick([2, 3, 4, 5, 7]), dens = d.until(() => d.shuffle(Array.from({ length: 13 - t }, (_, i) => t + 1 + i)).slice(0, 4), (list) => list.every((x) => gcd(x, t) === 1) && Math.max(...list) % Math.min(...list) !== 0);
        const hi = V(0, t, Math.min(...dens)), lo = V(0, t, Math.max(...dens));
        return ans('네 분수 가운데 가장 큰 수를 가장 작은 수로 나눈 몫은?', hi, lo, { figure: numbers(dens.map((den) => frac(t, den))), explain: `분자가 같으면 분모가 작을수록 큰 수이다. 가장 큰 수는 ${show(hi)}, 가장 작은 수는 ${show(lo)}이다. ${told(hi, lo)}이다.` });
      }
      if (n === 2) {
        // 대분수·가분수·진분수가 섞인 세 수
        const list = d.until(() => [one(d, 'M'), one(d, 'I'), one(d, 'P')], (vs) => { const sorted = vs.slice().sort((p, s) => cmp(val(p), val(s))), r = div(sorted[2], sorted[0]); return new Set(vs.map((v) => v.d)).size === 3 && distinct(vs.map(val)) && r.q > 1 && r.q <= 30 && r.p <= 120 && top(sorted[2]) <= 30 && near(val(vs[0]), val(vs[1]), 2); });
        const sorted = list.slice().sort((p, s) => cmp(val(p), val(s))), hi = sorted[2], lo = sorted[0];
        return ans('세 수 가운데 가장 큰 수를 가장 작은 수로 나눈 몫은?', hi, lo, { figure: numbers(d.shuffle(list).map(show)), explain: `가분수를 대분수로 나타내어 비교하면 가장 큰 수는 ${show(hi)}, 가장 작은 수는 ${show(lo)}이다. ${told(hi, lo)}이다.` });
      }
      // 분모가 다른 두 진분수: 통분하여 크기를 비교한 다음 작은 수를 큰 수로 나눈다.
      const [x, y] = d.until(() => [proper(d, 3, 12, 2), proper(d, 3, 12, 2)], ([p, s]) => p.d !== s.d && cmp(val(p), val(s)) !== 0 && near(val(p), val(s), 0.34) && lcm(p.d, s.d) <= 48 && p.n !== s.n), [lo, hi] = cmp(val(x), val(y)) < 0 ? [x, y] : [y, x], L = lcm(x.d, y.d);
      return ans('두 분수 가운데 작은 수를 큰 수로 나눈 몫은?', lo, hi, { figure: numbers([show(x), show(y)]), explain: `분모가 ${L}${tail(L, '이/가')} 되도록 통분하면 ${show(x)} = ${frac(x.n * (L / x.d), L)}, ${show(y)} = ${frac(y.n * (L / y.d), L)}이므로 작은 수는 ${show(lo)}이다. ${told(lo, hi)}이다.` });
    }, { count: 4 }),
    T('cards-mixed-one', '수 카드로 만든 대분수를 분수로 나누기', '①54 ②52 심29', (d) => {
      // 세 수 x < y < z 로 만드는 가장 큰 대분수는 z x/y, 가장 작은 대분수는 x y/z 이다.
      const big = d.bool(), m = d.until(() => { const [x, y, z] = d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3).sort((p, s) => p - s); return { list: [x, y, z], v: big ? V(z, x, y) : V(x, y, z), f: proper(d, 3, 12, 2) }; }, (v) => gcd(v.v.n, v.v.d) === 1 && v.v.d !== v.f.d && div(v.v, v.f).q > 1 && div(v.v, v.f).q <= 30 && div(v.v, v.f).p <= 120 && top(v.v) <= 40);
      const [x, , z] = m.list;
      return ans(`수 카드 3장을 한 번씩 모두 사용하여 만들 수 있는 가장 ${big ? '큰' : '작은'} 대분수를 ${vj(m.f, '으로/로')} 나눈 몫은?`, m.v, m.f, {
        figure: cards(d.shuffle(m.list)),
        explain: `가장 ${big ? '큰' : '작은'} 대분수는 가장 ${big ? '큰' : '작은'} 수 ${josa(big ? z : x, '을/를')} 자연수 부분에 놓은 ${show(m.v)}이다. ${told(m.v, m.f)}이다.`
      });
    }),
    T('cards-mixed-two', '수 카드로 만든 가장 큰 대분수를 가장 작은 대분수로 나누기', '①54 ②52 ③60 심29', (d) => {
      const m = d.until(() => { const [x, y, z] = d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3).sort((p, s) => p - s); return { list: [x, y, z], hi: V(z, x, y), lo: V(x, y, z) }; }, (v) => gcd(v.hi.n, v.hi.d) === 1 && gcd(v.lo.n, v.lo.d) === 1 && div(v.hi, v.lo).q > 1 && div(v.hi, v.lo).q <= 30 && div(v.hi, v.lo).p <= 120);
      const [x, , z] = m.list;
      return ans('수 카드 3장을 한 번씩 모두 사용하여 대분수를 만들려고 한다. 만들 수 있는 가장 큰 대분수를 가장 작은 대분수로 나눈 몫은?', m.hi, m.lo, {
        figure: cards(d.shuffle(m.list)),
        explain: `가장 큰 대분수는 가장 큰 수 ${josa(z, '을/를')} 자연수 부분에 놓은 ${show(m.hi)}, 가장 작은 대분수는 가장 작은 수 ${josa(x, '을/를')} 자연수 부분에 놓은 ${show(m.lo)}이다. ${told(m.hi, m.lo)}이다.`
      });
    }),
    T('cards-proper', '수 카드로 만든 가장 큰 진분수를 가장 작은 진분수로 나누기', '②52 심29', (d) => {
      // 세 수 x < y < z 로 만드는 진분수는 x/y, x/z, y/z 이다. 가장 작은 수는 x/z 이고, 가장 큰 수는 x/y 와 y/z 를 통분하여 견주어 정한다.
      const [x, y, z] = d.until(() => d.shuffle([2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3).sort((p, s) => p - s), ([p, s, t]) => p * t !== s * s && gcd(p, s) === 1 && gcd(p, t) === 1 && gcd(s, t) === 1);
      const hi = x * z > y * y ? V(0, x, y) : V(0, y, z), lo = V(0, x, z);
      return ans('수 카드 3장 가운데 2장을 골라 진분수를 만들려고 한다. 만들 수 있는 가장 큰 진분수를 가장 작은 진분수로 나눈 몫은?', hi, lo, {
        figure: cards(d.shuffle([x, y, z])),
        explain: `만들 수 있는 진분수는 ${frac(x, y)}, ${frac(x, z)}, ${frac(y, z)}이다. 통분하여 비교하면 가장 큰 수는 ${show(hi)}, 가장 작은 수는 ${show(lo)}이다. ${how(hi, lo)}이다.`
      });
    })
  ]);

  // ── □가 있는 식과 어떤 수 ──
  B.addTypes('6-2-1', 'box', [
    T('box-top', '분모가 같은 나눗셈식의 □', '①46 ②43 심21', (d, n) => {
      // 문항마다 □의 자리가 다르다: 나누어지는 수의 분자, 나누는 수의 분자, 나누는 수의 분모.
      const [a, b] = samePick(d, 'nat'), x = a.n, y = b.n, den = a.d, k = x / y;
      if (n === 0) return N('□ 안에 알맞은 수는?', x, { figure: eq(frac(box(), den), '/', frac(y, den), '=', k), explain: `분모가 같으므로 분자끼리 나누면 □ ÷ ${y} = ${k}이다. □ = ${y} × ${k} = ${x}이다.`, facts: { calc: [[`${y}*${k}`, 0]] } });
      if (n === 1) return N('□ 안에 알맞은 수는?', y, { figure: eq(frac(x, den), '/', frac(box(), den), '=', k), explain: `분모가 같으므로 분자끼리 나누면 ${x} ÷ □ = ${k}이다. □ = ${x} ÷ ${k} = ${y}이다.`, facts: { calc: [[`${x}/${k}`, 0]] } });
      return N('□ 안에 알맞은 수는?', den, { figure: eq(frac(x, den), '/', frac(y, box()), '=', k), explain: `${x} ÷ ${y} = ${k}이므로 분자끼리 나눈 것이 몫과 같다. 분자끼리 나누어 계산할 수 있으려면 두 분수의 분모가 같아야 하므로 □ = ${den}이다. ${frac(x, den)} ÷ ${frac(y, den)} = ${x} ÷ ${y} = ${k}이다.`, facts: { calc: [[`${k}*${den}*${y}/${x}`, 0]] } });
    }, { count: 3 }),
    T('box-mul', '곱셈식의 □를 나눗셈으로 구하기', '①47 ②41 ③58 심20', (d, n) => {
      // 문항마다 수의 갈래가 다르다: 진분수끼리(□는 분수), 곱이 자연수(□는 자연수), 대분수가 있는 식.
      if (n === 0) {
        const [g, f] = mulPick(d, null, null, 12);
        return ans('□ 안에 알맞은 수는?', g, f, { figure: eq(box(), '*', show(f), '=', show(g)), explain: `□ = ${show(g)} ÷ ${show(f)}이다. ${told(g, f)}이다.` });
      }
      if (n === 1) {
        const [c, f] = natPick(d, 'whole');
        return ans('□ 안에 알맞은 수는?', c, f, { kind: 'nat', figure: eq(show(f), '*', box(), '=', c.w), explain: `□ = ${c.w} ÷ ${show(f)}이다. ${told(c, f)}이다.` });
      }
      const [g, f] = pairOf(d, d.bool() ? 'MI' : 'PM', { whole: false });
      return ans('□ 안에 알맞은 수는?', g, f, { figure: eq(show(f), '*', box(), '=', show(g)), explain: `□ = ${show(g)} ÷ ${show(f)}이다. ${told(g, f)}이다.` });
    }, { count: 3 }),
    T('box-any-mul', '어떤 수에 분수를 곱한 결과로 어떤 수 구하기', '①64 ③58 심20', (d) => {
      const [c, f] = natPick(d, 'whole');
      return ans(`어떤 수에 ${vj(f, '을/를')} 곱했더니 ${josa(c.w, '이/가')} 되었다. 어떤 수는?`, c, f, { kind: 'nat', explain: `어떤 수는 ${c.w} ÷ ${vj(f, '으로/로')} 구한다. ${told(c, f)}이다. 1보다 작은 수를 곱했으므로 어떤 수는 ${c.w}보다 크다.` });
    }),
    T('box-div', '나누는 수 구하기', '①48 ②42 심22', (d, n) => {
      // 첫째 문항은 식의 □, 둘째 문항은 문장(대분수를 어떤 수로 나눔).
      if (n === 0) {
        const [a, b] = mulPick(d, null, null, 12);
        return ans('□ 안에 알맞은 수는?', a, b, { figure: eq(show(a), '/', box(), '=', show(b)), explain: `나누어지는 수를 몫으로 나누면 나누는 수가 된다. □ = ${show(a)} ÷ ${show(b)}이다. ${told(a, b)}이다.` });
      }
      const [a, b] = pairOf(d, 'MP', { whole: false });
      return ans(`${vj(a, '을/를')} 어떤 수로 나누었더니 ${vj(b, '이/가')} 되었다. 어떤 수는?`, a, b, { explain: `나누어지는 수를 몫으로 나누면 나누는 수가 된다. 어떤 수는 ${show(a)} ÷ ${show(b)}이다. ${told(a, b)}이다.` });
    }, { count: 2 }),
    T('box-nat', '몫과 자연수의 크기 비교(□)', '①49 ②45 ③55 심24', (d, n) => {
      // 첫째 문항은 몫보다 작은 자연수의 개수, 둘째 문항은 몫보다 작은 가장 큰 자연수, 셋째 문항은 몫보다 큰 가장 작은 자연수. 몫은 자연수로 떨어지지 않는다.
      const [a, b] = [() => d.until(() => (d.bool() ? samePick(d, 'over') : diffPick(d, 'any', true)), ([p, s]) => div(p, s).p >= 2 * div(p, s).q), () => natPick(d, d.bool() ? 'plain' : 'cut'), () => d.until(() => pairOf(d, d.bool() ? 'MM' : 'MP', { whole: false, under: false }), ([p, s]) => div(p, s).p <= 15 * div(p, s).q)][n]();
      const x = qd(a, b), v = div(a, b), k = Math.floor(v.p / v.q), den = x.dens.join('*');
      if (n === 0) return N('□ 안에 들어갈 수 있는 자연수는 모두 몇 개인가?', k, { unit: '개', figure: eq(show(a), '/', show(b), '>', box()), explain: `${how(a, b)}이다. □는 ${res(a, b)}보다 작은 자연수이므로 1부터 ${k}까지 ${k}개이다.`, facts: { digit: { template: `${x.num}>□*(${den})`, lo: 1, hi: k + 3, ask: 'count' }, rule: 'natCount' } });
      if (n === 1) return N('□ 안에 들어갈 수 있는 자연수 가운데 가장 큰 수는?', k, { figure: eq(box(), '<', show(a), '/', show(b)), explain: `${how(a, b)}이다. □는 ${res(a, b)}보다 작은 자연수이므로 가장 큰 수는 ${k}이다.`, facts: { digit: { template: `□*(${den})<${x.num}`, lo: 1, hi: k + 3, ask: 'max' }, rule: 'natMax' } });
      return N('□ 안에 들어갈 수 있는 자연수 가운데 가장 작은 수는?', k + 1, { figure: eq(show(a), '/', show(b), '<', box()), explain: `${how(a, b)}이다. □는 ${res(a, b)}보다 큰 자연수이므로 가장 작은 수는 ${k + 1}이다.`, facts: { digit: { template: `${x.num}<□*(${den})`, lo: 1, hi: k + 4, ask: 'min' }, rule: 'natMin' } });
    }, { count: 3 }),
    T('box-frac-top', '몫보다 작은 분수의 분자(□)', '①50', (d) => {
      // □가 든 분수의 분모는 몫을 기약분수로 나타낸 분모의 배수이다.
      const m = d.until(() => { const [a, b] = mulPick(d, null, null, 12), r = div(a, b), k = d.int(1, 3); return { a, b, r, L: r.q * k, cut: r.p * k }; }, (v) => v.cut >= 3 && v.L <= 40 && v.cut <= 30);
      const { a, b, r, L, cut } = m;
      return N('□ 안에 들어갈 수 있는 자연수 가운데 가장 큰 수는?', cut - 1, {
        figure: eq(show(a), '/', show(b), '>', frac(box(), L)),
        explain: `${told(a, b)}이다. ` + (L === r.q ? '' : `${frac(r.p, r.q)}${tail(r.p, '을/를')} 분모가 ${L}인 분수로 나타내면 ${frac(cut, L)}이다. `) + `□는 ${cut}보다 작아야 하므로 가장 큰 수는 ${cut - 1}이다.`,
        facts: { digit: { template: `${a.n}*${b.d}*${L}>□*${a.d}*${b.n}`, lo: 1, hi: cut + 3, ask: 'max' }, rule: 'topMax' }
      });
    }),
    T('box-natural-pick', '몫이 자연수가 되게 하는 분자 고르기', '②44 ③56 심26', (d) => {
      // 분자끼리 나누어떨어지는 수는 보기 가운데 하나뿐이다.
      const m = d.until(() => { const den = d.pick([13, 17, 19, 23, 25]), x = d.pick([8, 9, 10, 12, 14, 15, 16, 18, 20, 21]), opts = d.shuffle(Array.from({ length: 9 }, (_, i) => i + 2)).slice(0, 4).sort((p, s) => p - s); return { den, x, opts }; }, (v) => v.x < v.den && gcd(v.x, v.den) === 1 && v.opts.filter((o) => v.x % o === 0).length === 1 && v.opts.every((o) => o < v.x));
      const { den, x, opts } = m, hit = opts.findIndex((o) => x % o === 0);
      return C('몫이 자연수가 되게 하려고 한다. □ 안에 들어갈 수 있는 수는?', opts.map(String), hit, {
        figure: eq(frac(x, den), '/', frac(box(), den)),
        explain: `분모가 같으므로 분자끼리 나누면 ${x} ÷ □이다. ${x} ÷ ${opts[hit]} = ${x / opts[hit]}이므로 □ 안에 ${josa(opts[hit], '이/가')} 들어가면 몫이 자연수가 된다. 나머지 수로는 ${josa(x, '이/가')} 나누어떨어지지 않는다.`,
        facts: { claimed: opts.map((o) => [`${x}%${o}`, 0]), claimedWant: true }
      });
    })
  ]);

  // ── 분수의 나눗셈의 활용 ──
  const word = (text, a, b, unit, explain, more) => ans(text, a, b, Object.assign({ unit, explain }, more || {}));
  B.addTypes('6-2-1', 'word', [
    T('word-story-pick', '나눗셈식으로 구할 수 있는 상황 고르기', '③47·62 ①67 ②83', (d) => {
      // 틀린 상황: 곱셈 상황(~의 몇 분의 몇), 뺄셈 상황(잘라 내고 남은 길이), 나누는 차례가 뒤바뀐 상황
      const [a, b] = mulPick(d, null, true, 12);
      const rows = d.shuffle([[`길이가 ${show(a)} m인 끈은 길이가 ${show(b)} m인 끈의 몇 배인지 구한다.`, true], [`길이가 ${show(a)} m인 끈의 ${show(b)}만큼은 몇 m인지 구한다.`, false], [`길이가 ${show(a)} m인 끈에서 ${show(b)} m를 잘라 내고 남은 길이를 구한다.`, false], [`길이가 ${show(b)} m인 끈은 길이가 ${show(a)} m인 끈의 몇 배인지 구한다.`, false]]);
      return C(`${show(a)} ÷ ${vj(b, '으로/로')} 구할 수 있는 것은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
        explain: `「~는 ~의 몇 배」는 앞의 수를 뒤의 수로 나누어 구한다. ${show(a)} m는 ${show(b)} m의 ${show(a)} ÷ ${show(b)} = ${res(a, b)}(배)이다. 「~의 ${show(b)}만큼」은 곱셈으로, 남은 길이는 뺄셈으로 구한다.`,
        facts: { truth: rows.map((row) => row[1]), want: true }
      });
    }),
    T('word-take', '문장제: 똑같이 덜어 내기', '①55 ②56·57·58·59 ③7·28·37·45 심34', (d, n) => {
      // 문항마다 수의 갈래가 다르다: 분모가 같은 진분수, 분모가 다른 진분수, (자연수)÷(진분수), (대분수)÷(진분수). 몫은 모두 자연수이다.
      if (n === 0) { const [a, b] = samePick(d, 'nat'); return word(`주스 ${show(a)} L를 컵 하나에 ${show(b)} L씩 남김없이 나누어 담으려고 한다. 필요한 컵은 몇 개인가?`, a, b, '개', `${show(a)} L에서 ${show(b)} L씩 덜어 내는 횟수를 구한다. ${toldSame(a, b)}이다.`, { kind: 'nat' }); }
      if (n === 1) { const [a, b] = diffNat(d); return word(`케이크 한 개를 만드는 데 밀가루가 ${show(b)} kg 필요하다. 밀가루 ${show(a)} kg으로 만들 수 있는 케이크는 몇 개인가?`, a, b, '개', `${show(a)} ÷ ${vj(b, '으로/로')} 구한다. ${toldCommon(a, b)}이다.`, { kind: 'nat' }); }
      if (n === 2) { const [c, f] = natPick(d, 'whole'); return word(`설탕 ${c.w} kg을 통 하나에 ${show(f)} kg씩 남김없이 나누어 담으려고 한다. 필요한 통은 몇 개인가?`, c, f, '개', `${c.w} ÷ ${vj(f, '으로/로')} 구한다. ${told(c, f)}이다.`, { kind: 'nat' }); }
      const [a, b] = pairOf(d, 'MP', { whole: true });
      return word(`길이가 ${show(a)} m인 리본을 ${show(b)} m씩 잘라 선물을 하나씩 포장하려고 한다. 포장할 수 있는 선물은 몇 개인가?`, a, b, '개', `${show(a)} ÷ ${vj(b, '으로/로')} 구한다. ${told(a, b)}이다.`, { kind: 'nat' });
    }, { count: 4 }),
    T('word-time', '문장제: 일정한 빠르기로 가는 데 걸리는 시간', '①55 ②71', (d) => {
      const [a, b] = d.until(() => diffPick(d, 'any', true, (p, s) => s.d <= 10), ([p, s]) => div(p, s).q <= 20);
      return word(`1분에 ${show(b)} km씩 가는 빠르기로 ${show(a)} km를 가려고 한다. 걸리는 시간은 몇 분인가?`, a, b, '분', `가는 거리를 1분에 가는 거리로 나눈다. ${told(a, b)}이다.`);
    }),
    T('word-round', '문장제: 몫의 자연수 부분만 쓰기와 올림하기', '①57 ②60 심36·38', (d, n) => {
      // 첫째 문항은 만들 수 있는 개수(남는 것으로는 하나를 더 만들지 못한다), 둘째 문항은 남김없이 담는 데 필요한 개수(남는 것을 담을 하나가 더 필요하다).
      const [a, b] = d.until(() => (d.bool() ? samePick(d, 'over') : pairOf(d, 'MP', { whole: false, under: false })), ([p, s]) => div(p, s).p >= 2 * div(p, s).q && div(p, s).p <= 12 * div(p, s).q);
      const x = qd(a, b), v = div(a, b), k = Math.floor(v.p / v.q), den = x.dens.join('*'), fl = `(${x.num}-${x.num}%(${den}))/(${den})`;
      if (n === 0) return N(`꽃 한 송이를 만드는 데 철사가 ${show(b)} m 필요하다. 철사 ${show(a)} m로 만들 수 있는 꽃은 몇 송이인가?`, k, { unit: '송이', explain: `${how(a, b)}이다. ${k}송이를 만들고 남는 철사로는 한 송이를 더 만들 수 없으므로 ${k}송이이다.`, facts: { calc: [[fl, 0]] } });
      return N(`물 ${show(a)} L를 병 하나에 ${show(b)} L씩 담으려고 한다. 물을 남김없이 모두 담으려면 병은 적어도 몇 개 필요한가?`, k + 1, { unit: '개', explain: `${how(a, b)}이다. 병 ${k}개에 담고 남는 물도 담아야 하므로 병은 적어도 ${k + 1}개 필요하다.`, facts: { calc: [[fl + '+1', 0]], unseen: [1] } });
    }, { count: 2 }),
    T('word-times', '문장제: 몇 배인지 구하기', '①56 ②64·65·66 ③14·46 심40', (d, n) => {
      // 문항마다 수의 갈래와 묻는 차례가 다르다: 분모가 같은 진분수, 분모가 다른 진분수(뒤에 나온 양이 앞에 나온 양의 몇 배), 대분수, 작은 양이 큰 양의 몇 배(1보다 작은 배).
      if (n === 0) { const [a, b] = samePick(d, d.bool() ? 'over' : 'cut'); return word(`빨간색 끈의 길이는 ${show(a)} m이고 노란색 끈의 길이는 ${show(b)} m이다. 빨간색 끈의 길이는 노란색 끈의 길이의 몇 배인가?`, a, b, '배', `빨간색 끈의 길이를 노란색 끈의 길이로 나눈다. ${toldSame(a, b)}이다.`); }
      if (n === 1) { const [a, b] = diffPick(d, 'any', true, (p, s) => lcm(p.d, s.d) <= 40); return word(`사과의 무게는 ${show(b)} kg이고 배의 무게는 ${show(a)} kg이다. 배의 무게는 사과의 무게의 몇 배인가?`, a, b, '배', `배의 무게를 사과의 무게로 나눈다. ${told(a, b)}이다.`); }
      if (n === 2) { const [a, b] = pairOf(d, d.bool() ? 'MM' : 'MP', { whole: false, under: false }); return word(`우유가 ${show(a)} L, 주스가 ${show(b)} L 있다. 우유의 양은 주스의 양의 몇 배인가?`, a, b, '배', `우유의 양을 주스의 양으로 나눈다. ${told(a, b)}이다.`); }
      const [a, b] = d.bool() ? samePick(d, 'under') : diffPick(d, 'any', false);
      return word(`물이 가 그릇에 ${show(a)} L, 나 그릇에 ${show(b)} L 들어 있다. 가 그릇에 들어 있는 물의 양은 나 그릇에 들어 있는 물의 양의 몇 배인가?`, a, b, '배', `가 그릇의 물의 양을 나 그릇의 물의 양으로 나눈다. ${how(a, b)}이다. 가 그릇의 물이 더 적으므로 1배보다 작다.`);
    }, { count: 4 }),
    T('word-times-table', '표에서 가장 많은 양과 가장 적은 양을 골라 몇 배인지 구하기', '②67 ①56', (d) => {
      const list = d.until(() => [one(d, 'M'), nat(d.int(2, 5)), one(d, 'M')], (vs) => { const sorted = vs.slice().sort((p, s) => cmp(val(p), val(s))), r = div(sorted[2], sorted[0]); return vs[0].d !== vs[2].d && distinct(vs.map(val)) && r.q > 1 && r.q <= 20 && r.p <= 99 && near(val(sorted[2]), val(sorted[0]), 4); });
      const who = d.shuffle(NAMES).slice(0, 3), rows = d.shuffle(list), sorted = rows.slice().sort((p, s) => cmp(val(p), val(s))), hi = sorted[2], lo = sorted[0];
      return word('세 사람이 가지고 있는 찰흙의 무게를 나타낸 표이다. 찰흙을 가장 많이 가지고 있는 사람의 찰흙의 무게는 가장 적게 가지고 있는 사람의 찰흙의 무게의 몇 배인가?', hi, lo, '배',
        `가장 무거운 것은 ${show(hi)} kg, 가장 가벼운 것은 ${show(lo)} kg이다. ${told(hi, lo)}이다.`, { figure: table(['이름', '찰흙의 무게'], rows.map((v, i) => [who[i], show(v) + ' kg'])) });
    }),
    T('word-unit-nat', '문장제: 자연수인 양으로 1만큼의 양 구하기', '①58 ②69·71 ③28·38 심42·49', (d, n) => {
      // 문항마다 얼개와 수가 다르다: 단위분수만큼의 시간 동안 한 일, 진분수만큼의 무게(몫이 분수), 진분수만큼의 값.
      if (n === 0) {
        const [c, e] = d.until(() => [d.int(3, 12), d.int(2, 6)], ([x, y]) => x !== y), p = d.pick(NAMES), a = nat(c), b = V(0, 1, e);
        return word(`${name(p, '은/는')} ${show(b)}시간 동안 종이학을 ${c}개 접었다. 같은 빠르기로 접는다면 1시간 동안 접을 수 있는 종이학은 몇 개인가?`, a, b, '개', `접은 개수를 걸린 시간으로 나눈다. ${told(a, b)}이다.`, { kind: 'nat' });
      }
      if (n === 1) { const [c, f] = d.until(() => [nat(d.int(3, 9)), V(0, ...d.pick([[2, 3], [3, 4], [2, 5], [3, 5], [4, 5], [5, 6]]))], ([x, y]) => x.w % y.n !== 0); return word(`수박 ${show(f)}통의 무게가 ${c.w} kg이다. 이 수박 한 통의 무게는 몇 kg인가?`, c, f, 'kg', `무게를 수박의 양으로 나눈다. ${told(c, f)}이다.`); }
      const m = d.until(() => ({ f: V(0, ...d.pick([[3, 10], [3, 5], [2, 5], [3, 4], [4, 5], [7, 10], [9, 10], [5, 8]])), u: d.int(3, 12) * 100 }), (v) => v.u * v.f.d <= 9900 && (v.u * v.f.d) % 100 === 0), c = nat(m.f.n * m.u);
      return word(`콩 ${show(m.f)} kg의 값이 ${c.w}원이다. 이 콩 1 kg의 값은 몇 원인가?`, c, m.f, '원', `값을 무게로 나눈다. ${c.w} ÷ ${show(m.f)} = (${c.w} ÷ ${m.f.n}) × ${m.f.d} = ${m.u} × ${m.f.d} = ${m.u * m.f.d}이므로 ${m.u * m.f.d}원이다.`, { kind: 'nat' });
    }, { count: 3 }),
    T('word-whole', '문장제: 부분의 양으로 전체의 양 구하기', '②68 ③28·44 심45', (d, n) => {
      // 문항마다 수가 다르다: 전체의 단위분수만큼이 자연수, 전체의 진분수만큼이 자연수, 전체의 진분수만큼이 분수.
      if (n === 0) {
        const [c, e] = d.until(() => [d.int(5, 25), d.int(3, 8)], ([x, y]) => x !== y), a = nat(c), b = V(0, 1, e);
        return word(`책 한 권의 ${vj(b, '을/를')} 읽는 데 ${c}분이 걸렸다. 같은 빠르기로 읽는다면 책 한 권을 모두 읽는 데 걸리는 시간은 몇 분인가?`, a, b, '분', `전체의 ${vj(b, '이/가')} ${c}분이므로 ${c} ÷ ${vj(b, '으로/로')} 구한다. ${told(a, b)}이다.`, { kind: 'nat' });
      }
      if (n === 1) {
        const [c, f] = natPick(d, 'whole'), p = d.pick(NAMES);
        return word(`${name(p, '은/는')} 가지고 있던 구슬의 ${show(f)}인 ${c.w}개를 동생에게 주었다. ${name(p, '이/가')} 처음에 가지고 있던 구슬은 몇 개인가?`, c, f, '개', `처음 구슬의 ${vj(f, '이/가')} ${c.w}개이므로 ${c.w} ÷ ${vj(f, '으로/로')} 구한다. ${told(c, f)}이다.`, { kind: 'nat' });
      }
      const [a, f] = d.until(() => (d.bool() ? mulPick(d, null, null, 10) : pairOf(d, 'MP', { whole: false })), ([p, s]) => s.n >= 2 && div(p, s).q <= 20);
      return word(`빈 병에 물 ${show(a)} L를 부었더니 병의 ${show(f)}만큼 찼다. 이 병을 가득 채우는 물의 양은 몇 L인가?`, a, f, 'L', `병의 ${vj(f, '이/가')} ${show(a)} L이므로 ${show(a)} ÷ ${vj(f, '으로/로')} 구한다. ${told(a, f)}이다. 가득 채우는 물의 양은 부은 물의 양보다 많다.`);
    }, { count: 3 }),
    T('word-unit-frac', '문장제: 분수인 양으로 1만큼의 양 구하기', '①59 ②69·70·71 ③43 심42·49', (d, n) => {
      // 문항마다 얼개가 다르다: 1 m의 무게(무게÷길이), 1 L로 칠하는 넓이(넓이÷페인트의 양), 1시간에 가는 거리(거리÷시간, 대분수).
      if (n === 0) { const [a, b] = d.until(() => mulPick(d, null, null, 10), ([p, s]) => div(p, s).q <= 24); return word(`굵기가 일정한 철사 ${show(b)} m의 무게가 ${show(a)} kg이다. 이 철사 1 m의 무게는 몇 kg인가?`, a, b, 'kg', `무게를 길이로 나눈다. ${told(a, b)}이다.`); }
      if (n === 1) { const [a, b] = d.until(() => (d.bool() ? mulPick(d, null, null, 12) : pairOf(d, 'MP', { whole: false })), ([, s]) => s.n >= 2); return word(`페인트 ${show(b)} L로 넓이가 ${show(a)} m²인 벽을 칠하였다. 페인트 1 L로 칠할 수 있는 벽의 넓이는 몇 m²인가?`, a, b, 'm²', `칠한 넓이를 페인트의 양으로 나눈다. ${told(a, b)}이다.`); }
      const [a, b] = d.until(() => pairOf(d, 'MP', { whole: false }), ([p, s]) => s.d <= 6 && div(p, s).q <= 20);
      return word(`자전거를 타고 ${show(b)}시간 동안 ${show(a)} km를 갔다. 같은 빠르기로 간다면 1시간 동안 갈 수 있는 거리는 몇 km인가?`, a, b, 'km', `간 거리를 걸린 시간으로 나눈다. ${told(a, b)}이다.`);
    }, { count: 3 }),
    T('word-polygon', '둘레와 한 변의 길이로 정다각형의 이름 알기', '②61 심57', (d) => {
      // 둘레를 한 변의 길이로 나누면 변의 수가 된다. 변의 수는 3, 4, 5, 6, 8 가운데 하나이다.
      const SHAPES = [[3, '정삼각형'], [4, '정사각형'], [5, '정오각형'], [6, '정육각형'], [8, '정팔각형']];
      const m = d.until(() => { const side = d.bool() ? proper(d, 5, 17, 2) : V(1, ...d.pick([[1, 4], [3, 4], [2, 5], [3, 5], [1, 6], [5, 6], [2, 7], [3, 8], [5, 8], [2, 9], [7, 9]])), k = d.pick(SHAPES)[0]; return { side, k, all: R(top(side) * k, side.d) }; }, (v) => v.all.q > 1);
      const side = m.side, all = toV(m.all), rows = d.until(() => d.shuffle(SHAPES).slice(0, 4), (list) => list.some(([k]) => k === m.k)).sort((p, s) => p[0] - s[0]), x = qd(all, side);
      return C(`철사 ${show(all)} m를 남김없이 사용하여 한 변의 길이가 ${show(side)} m인 정다각형을 한 개 만들었다. 만든 정다각형의 이름은?`, rows.map(([, label]) => label), rows.findIndex(([k]) => k === m.k), {
        explain: `정다각형은 변의 길이가 모두 같으므로 철사의 길이를 한 변의 길이로 나누면 변의 수가 된다. ${how(all, side)}이므로 변이 ${m.k}개인 ${SHAPES.find(([k]) => k === m.k)[1]}이다.`,
        facts: { pick: { expr: `${x.num}/(${x.dens.join('*')})`, options: rows.map(([k]) => k) } }
      });
    }),
    T('word-area-side', '넓이와 한 변의 길이로 다른 변의 길이 구하기', '①62 ②76 ③54 심54', (d, n) => {
      // 문항마다 도형과 수가 다르다: 직사각형(진분수끼리), 평행사변형(대분수), 직사각형(넓이가 자연수).
      if (n === 0) { const [a, b] = mulPick(d, null, null, 12); return word(`넓이가 ${show(a)} m²인 직사각형 모양의 밭이 있다. 이 밭의 세로가 ${show(b)} m일 때 가로는 몇 m인가?`, a, b, 'm', `직사각형의 넓이는 가로와 세로의 곱이므로 넓이를 세로로 나눈다. ${told(a, b)}이다.`); }
      if (n === 1) { const [a, b] = d.until(() => pairOf(d, d.bool() ? 'MM' : 'MP', { whole: false }), ([p, s]) => div(p, s).q <= 20); return word(`넓이가 ${show(a)} cm²이고 밑변의 길이가 ${show(b)} cm인 평행사변형의 높이는 몇 cm인가?`, a, b, 'cm', `평행사변형의 넓이는 밑변의 길이와 높이의 곱이므로 넓이를 밑변의 길이로 나눈다. ${told(a, b)}이다.`); }
      const [c, b] = d.until(() => pairOf(d, 'NM', { whole: false }), ([p, s]) => div(p, s).q <= 12);
      return word(`넓이가 ${c.w} cm²이고 가로가 ${show(b)} cm인 직사각형의 세로는 몇 cm인가?`, c, b, 'cm', `넓이를 가로로 나눈다. ${told(c, b)}이다.`);
    }, { count: 3 })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
