// 5학년 1학기 5단원 분수의 덧셈과 뺄셈 — 잘못된 계산, 계산 결과 비교, 조건에 맞는 수, □가 있는 식, 문장제, 실력 문항.
// 단원 틀과 싣는 기준, 뺀 것과 까닭은 5-1-5a.js 에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2, ③n = 기본꼴_3, 심n = 심화꼴.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 ①의 장치는 이 잘못을 가진 아이가 걸리게 만들었다)
//  - 통분하지 않고 분모는 분모끼리, 분자는 분자끼리 더하거나 뺀다(1/2 + 1/3 = 2/5). 그림에서도 색칠한 칸 수와 전체 칸 수를 세어 더한다.
//  - 통분하면서 분모만 바꾸고 분자는 그대로 두거나, 분자에 곱하는 수를 잘못 고른다.
//  - 수직선의 눈금 수나 분자의 크기만 보고 분수의 크기를 정한다(7/10 이 3/4 보다 크다고 여긴다). 그래서 받아내림이 필요한지도 분자만 보고 정한다.
//  - 분수 부분의 합이 가분수일 때 받아올림한 1을 자연수 부분에 더하지 않는다. 받아내림하고도 자연수 부분을 줄이지 않거나, 큰 분자에서 작은 분자를 뺀다.
//  - 전체가 다른 두 분수를 그대로 더한다(큰 떡의 1/2 과 작은 떡의 1/3 을 5/6 이라고 한다).
//  - 「~보다 더 무겁다」가 나오면 무조건 더하고, 「남은 양」을 「쓴 양」으로 읽는다.
//
// 실력에는 ① 문제의 상황·그림·수에 함정이 있어 뜻을 정확히 대야 풀리는 문제와 ② 두 번 넘게 생각해야 풀리는 문제(어떤 수를 구해 바르게 계산하기,
// 거꾸로 구하기, 다시 통분해야 하는 □의 범위, 두 식 사이의 □, 여러 단계 문장제)만 실었다. 기본에서 하는 계산 한 번을 고르기로 바꾼 것은 싣지 않았다.
// 문장제는 얼개마다 한 번씩 싣는다: 합치기, 더 붓기, 처음 양, 전체의 얼마, 더 많은(적은) 쪽, 남은 양, 두 양의 차, 누가 얼마나 더, 그릇의 무게, 쓴 양, 더 필요한 양,
//   길 위의 두 구간·한 구간, 기준과 견주기, 세 양의 합 / (실력) 두 번 덜어 내기, 쓰고 다시 채우기, 합친 뒤 덜어 내기, 한쪽을 구한 뒤 합, 차례로 많고 적은 양,
//   두 합 견주기, 합과 한 양 견주기, 돌아가는 길, 겹쳐 이어 붙인 길이, 겹친 구간, 반을 덜어 낸 무게, 기준선에 가까운 쪽, 전체에서 두 부분을 뺀 나머지.
// 묻는 말: 수나 값은 "~은?/~는?", 양은 "몇 ~인가?", 시키는 말은 "~하시오."
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, nick, box, frac, mixed, lines, tagged, numbers, cards, route, tapes, N, C, F } = B.kit;
  const STD = '6수01-08';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  // 실력 문항. 기본 자료에서만 나온 꼴은 ref 를 '기본 ②52' 처럼 적는다.
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: ref.startsWith('기본 ') ? '수집본 기본 자료(' + ref.slice(3) + ')' : '수집본 심화 자료(' + ref + ')', make }, more || {});
  const LAB = ['㉠', '㉡', '㉢', '㉣'], THREE = LAB.slice(0, 3);
  const SIGNS = ['&gt;', '=', '&lt;'], GT = '&gt;', LT = '&lt;';
  const gcd = (x, y) => (y ? gcd(y, x % y) : x), lcm = (x, y) => x / gcd(x, y) * y;
  const tail = (n, pair) => josa(n, pair).slice(String(n).length);
  const SG = { '+': '+', '-': '−', '=': '=', '>': GT, '<': LT };
  const ex = (html) => '<span class="mb-expr">' + html + '</span>';
  const eq = (...parts) => ex(parts.map((p) => (SG[p] ? '<i>' + SG[p] + '</i>' : p)).join(' '));
  const tag = (label) => '<span class="mb-tag mb-tag-short">' + label + '</span>';
  const versus = (left, right) => `<div class="mb-versus">${left}<span class="mb-ring"></span>${right}</div>`;

  // ── 수 하나(5-1-5a.js 와 같다) ──
  const V = (w, n, d) => ({ w, n, d });
  const W = (v, w) => V(w, v.n, v.d);
  const show = (v) => (v.n === 0 ? String(v.w) : v.w ? mixed(v.w, v.n, v.d) : frac(v.n, v.d));
  const vj = (v, pair) => show(v) + tail(v.n === 0 ? v.w : v.n, pair);
  const fj = (n, den, pair) => frac(n, den) + tail(n, pair);
  const top = (v) => v.w * v.d + v.n;
  const R = (p, q) => { const g = gcd(Math.abs(p), q) || 1; return { p: p / g, q: q / g }; };
  const val = (v) => R(top(v), v.d);
  const cmp = (x, y) => x.p * y.q - y.p * x.q;
  const calc = (parts) => { let r = R(0, 1), s = '+'; for (const p of parts) { if (typeof p === 'string') s = p; else { const v = val(p); r = R(r.p * v.q + (s === '+' ? 1 : -1) * v.p * r.q, r.q * v.q); } } return r; };
  const toV = (r) => V(Math.floor(r.p / r.q), r.p % r.q, r.q);
  const res = (parts) => show(toV(calc(parts)));
  const say = (parts) => parts.map((p) => (typeof p === 'string' ? SG[p] : show(p))).join(' ');
  const eqOf = (parts) => eq(...parts.map((p) => (typeof p === 'string' ? p : show(p))));
  const imp = (v) => (v.n === 0 ? String(v.w) : v.w ? `(${v.w}*${v.d}+${v.n})` : String(v.n));
  function over(parts) {
    const dens = parts.filter((p) => typeof p !== 'string').map((v) => (v.n === 0 ? 0 : v.d));
    let num = '', s = '', k = 0;
    for (const p of parts) {
      if (typeof p === 'string') { s = p; continue; }
      num += s + [imp(p)].concat(dens.filter((x, j) => j !== k && x)).join('*'); k += 1;
    }
    return { num, den: dens.filter(Boolean).join('*'), D: dens.filter(Boolean).reduce((x, y) => x * y, 1) };
  }
  function proof(parts, more) {
    const { num, den, D } = over(parts), r = calc(parts), g = D / r.q, m = more || {};
    const list = r.p > r.q ? [[`((${num})-(${num})%(${den}))/(${den})`, 0], [`(${num})%(${den})/${g}`, 1], [`${den}/${g}`, 2]] : [[`(${num})/${g}`, 0], [`${den}/${g}`, 1]];
    return Object.assign({}, m, { calc: list, unseen: [g].concat(m.unseen || []) });
  }
  function ans(text, parts, o) {
    const r = calc(parts);
    if (r.p <= 0 || r.q === 1) throw new Error('답이 자연수이거나 0보다 크지 않다');
    return F(text, r.p % r.q, r.q, { whole: r.p > r.q ? Math.floor(r.p / r.q) : undefined, anyForm: !o.simplest, unit: o.unit, figure: o.figure, explain: o.explain, facts: proof(parts, o.facts) });
  }
  // 여러 식의 값을 견줄 때 검사가 다시 셈하는 정수 식: 식마다 분자에 다른 식들의 공통분모(분모들의 곱)를 곱한다. scaledValues 는 그 값.
  const scaled = (rows) => { const os = rows.map(over); return os.map((o, i) => [`(${o.num})`].concat(os.filter((_, j) => j !== i).map((p) => `(${p.den})`)).join('*')); };
  const scaledValues = (rows) => { const os = rows.map(over), rs = rows.map(calc); return rs.map((r, i) => r.p * (os[i].D / r.q) * os.filter((_, j) => j !== i).reduce((x, o) => x * o.D, 1)); };
  const allD = (rows) => rows.map(over).reduce((x, o) => x * o.D, 1);
  // 식의 값을 소수로 셈하는 식(값이 같은지만 가릴 때)
  const fx = (parts) => parts.map((p) => (typeof p === 'string' ? p : p.n === 0 ? String(p.w) : `${imp(p)}/${p.d}`)).join('');

  // ── 풀이 글 ──
  function stages(a, op, b) {
    const L = lcm(a.d, b.d), x = a.n * (L / a.d), y = b.n * (L / b.d), out = [`${show(a)} ${SG[op]} ${show(b)}`, `${show(V(a.w, x, L))} ${SG[op]} ${show(V(b.w, y, L))}`];
    let w, n;
    if (op === '+') { w = a.w + b.w; n = x + y; if (n >= L) { out.push(show(V(w, n, L))); w += 1; n -= L; } }
    else if (x < y) { out.push(`${show(V(a.w - 1, x + L, L))} ${SG[op]} ${show(V(b.w, y, L))}`); w = a.w - 1 - b.w; n = x + L - y; }
    else { w = a.w - b.w; n = x - y; }
    out.push(show(V(w, n, L)));
    const g = gcd(n, L);
    if (g > 1) out.push(show(V(w, n / g, L / g)));
    return out.filter((s, i) => i === 0 || s !== out[i - 1]);
  }
  const told = (a, op, b) => stages(a, op, b).join(' = ');
  // 세 수의 계산: 앞에서부터 차례로
  const told3 = (parts) => { const [a, s1, b, s2, c] = parts, r1 = toV(calc([a, s1, b])); return `${told(a, s1, b)}, ${told(r1, s2, c)}`; };

  // ── 수 고르기 ──
  const MULTIPLE = [[2, 4], [2, 6], [3, 6], [2, 8], [4, 8], [3, 9], [5, 10], [3, 12], [4, 12], [6, 12], [7, 14], [3, 15], [5, 15], [4, 16], [8, 16], [6, 18], [9, 18], [4, 20], [5, 20], [10, 20], [7, 21], [6, 24], [8, 24], [12, 24]];
  const COPRIME = [[2, 3], [3, 4], [2, 5], [3, 5], [4, 5], [5, 6], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [3, 8], [5, 8], [7, 8], [2, 9], [4, 9], [5, 9], [7, 9], [8, 9], [3, 10], [7, 10]];
  const GENERAL = [[4, 6], [6, 8], [6, 9], [4, 10], [6, 10], [8, 10], [8, 12], [9, 12], [10, 12], [6, 14], [6, 15], [9, 15], [10, 15], [12, 15], [12, 16], [12, 18], [8, 20], [15, 20], [14, 21], [10, 25]];
  const ANY = MULTIPLE.concat(COPRIME, GENERAL).filter(([x, y]) => lcm(x, y) <= 60);
  const SMALL = ANY.filter(([x, y]) => lcm(x, y) <= 30);
  const TRIPLES = [[4, 6, 8], [3, 4, 6], [2, 3, 8], [4, 8, 12], [5, 10, 20], [6, 9, 18], [3, 5, 15], [4, 5, 10], [6, 8, 12], [9, 12, 18], [5, 6, 15], [4, 9, 12], [2, 5, 10], [3, 6, 9], [4, 6, 12], [3, 8, 12]];
  // 분모 넷을 한꺼번에 통분해도 공통분모가 크지 않은 묶음
  const FAMS = [[4, 5, 10, 20], [3, 4, 6, 12], [2, 3, 6, 9, 18], [4, 6, 8, 12, 24], [5, 6, 10, 15, 30], [2, 4, 8, 16], [3, 5, 6, 10, 15]];
  const coTop = (d, den) => d.until(() => d.int(1, den - 1), (v) => gcd(v, den) === 1);
  const two = (d, list, ok) => d.until(() => { const [b, e] = d.shuffle(d.pick(list)); return [V(0, coTop(d, b), b), V(0, coTop(d, e), e)]; }, ([a, b]) => !ok || ok(a, b));
  const fsum = (a, b) => a.n * b.d + b.n * a.d - a.d * b.d;
  const fgap = (a, b) => a.n * b.d - b.n * a.d;
  const less1 = (a, b) => fsum(a, b) < 0, more1 = (a, b) => fsum(a, b) > 0, bigger = (a, b) => fgap(a, b) > 0, smaller = (a, b) => fgap(a, b) < 0;
  const numer = (v, L) => v.n * (L / v.d);
  // 분모가 서로 다른 기약 진분수 여럿(분모는 dens 에서)
  const fracsOf = (d, dens) => dens.map((den) => V(0, coTop(d, den), den));
  const distinct = (vs) => vs.every((p, i) => vs.every((q, j) => i === j || cmp(val(p), val(q)) !== 0));
  // 두 값의 차가 1/k 이하인가
  const near = (x, y, k) => Math.abs(cmp(x, y)) * k <= x.q * y.q;
  // 두 수의 덧셈·뺄셈 식 하나. kind: 'p+' 진분수의 덧셈, 'p-' 진분수의 뺄셈, 'm+' 대분수의 덧셈, 'm-' 대분수의 뺄셈
  function expr2(d, kind, list) {
    const [f1, f2] = two(d, list || ANY);
    if (kind === 'p+') return [f1, '+', f2];
    if (kind === 'p-') return bigger(f1, f2) ? [f1, '-', f2] : [f2, '-', f1];
    const w2 = d.int(1, 3);
    return kind === 'm+' ? [W(f1, d.int(1, 3)), '+', W(f2, w2)] : [W(f1, w2 + d.int(1, 3)), '-', W(f2, w2)];
  }
  // 값이 r 인 두 진분수의 덧셈(뺄셈)을 모두 찾는다(분모는 서로 다르고 20 이하).
  const PROPER = [];
  for (let q = 2; q <= 20; q += 1) for (let p = 1; p < q; p += 1) if (gcd(p, q) === 1) PROPER.push(V(0, p, q));
  const splits = (r, op) => PROPER.map((t) => {
    const tv = val(t), u = op === '+' ? R(r.p * tv.q - tv.p * r.q, r.q * tv.q) : R(tv.p * r.q - r.p * tv.q, tv.q * r.q);
    return u.p > 0 && u.p < u.q && u.q <= 20 && u.q !== t.d ? [t, op, V(0, u.p, u.q)] : null;
  }).filter(Boolean);
  const key = (v) => v.w + ' ' + v.n + '/' + v.d;
  const shares = (p, q) => [p[0], p[2]].some((x) => [q[0], q[2]].some((y) => key(x) === key(y)));
  const apart = (rows) => rows.every((p, i) => rows.every((q, j) => i >= j || !shares(p, q)));
  // 차례 고르기 보기: 바른 차례 하나와 틀린 차례 셋
  const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  function orderChoice(d, vals, names, desc) {
    const right = [0, 1, 2].sort((p, q) => (desc ? cmp(vals[q], vals[p]) : cmp(vals[p], vals[q]))), id = (o) => o.join();
    const list = d.shuffle(d.shuffle(ORDERS.filter((o) => id(o) !== id(right))).slice(0, 3).concat([right]));
    return { list, right, options: list.map((o) => o.map((i) => names[i]).join(', ')), answer: list.findIndex((o) => id(o) === id(right)) };
  }
  const sgn = (x, y) => (cmp(x, y) > 0 ? 0 : cmp(x, y) === 0 ? 1 : 2);
  const SGN = (x, y) => SIGNS[sgn(x, y)];
  // 문장제: 식의 값을 분수 칸에 답한다.
  const word = (text, parts, unit, explain, more) => ans(text, parts, Object.assign({ unit, explain }, more || {}));

  // ── 그림 ──
  // 띠 하나: 똑같이 parts 칸으로 나누어 앞의 on 칸을 색칠한다.
  function band(parts, on) {
    const width = 216, h = 26, w = width / parts;
    let out = '';
    for (let i = 0; i < parts; i += 1) out += `<rect class="mb-piece${i < on ? ' is-on' : ''}" x="${(2 + i * w).toFixed(2)}" y="2" width="${w.toFixed(2)}" height="${h}"/>`;
    return `<svg class="mb-pieces" style="vertical-align:middle" viewBox="0 0 ${width + 4} ${h + 4}" width="${width + 4}" role="img" aria-label="띠를 똑같이 ${parts}칸으로 나누어 ${on}칸을 색칠">${out}</svg>`;
  }
  // 길이가 같은 수직선 여러 개(0부터 1까지). rows: [나눈 칸 수, 화살표가 가리키는 칸, 이름표]
  function twinLines(rows) {
    const L = 220, x0 = 36, gap = 48, width = x0 + L + 14, height = rows.length * gap + 2;
    let out = '';
    rows.forEach(([parts, at, label], r) => {
      const y = 24 + r * gap, x = (i) => (x0 + (i / parts) * L).toFixed(1);
      out += `<line class="mb-axis" x1="${x0}" y1="${y}" x2="${x0 + L}" y2="${y}"/>`;
      for (let i = 0; i <= parts; i += 1) out += `<line class="mb-axis" x1="${x(i)}" y1="${y - (i % parts === 0 ? 6 : 3.5)}" x2="${x(i)}" y2="${y + (i % parts === 0 ? 6 : 3.5)}"/>`;
      out += `<text class="mb-km-label" x="${x0}" y="${y + 19}" text-anchor="middle">0</text><text class="mb-km-label" x="${x0 + L}" y="${y + 19}" text-anchor="middle">1</text>`;
      out += `<path class="mb-pointer" d="M${x(at)} ${y - 7}l-4.5 -9h9z"/>`;
      out += `<text class="mb-km-label" style="font-size:14px" x="10" y="${y + 5}" text-anchor="middle">${label}</text>`;
    });
    const said = rows.map(([parts, at, label]) => `${label} 0부터 1까지를 똑같이 ${parts}칸으로 나누고 화살표는 0에서 ${at}칸 간 곳`).join(', ');
    return `<svg class="mb-numberline" viewBox="0 0 ${width} ${height}" width="${width}" role="img" aria-label="길이가 같은 수직선 ${rows.length}개: ${said}">${out}</svg>`;
  }
  // 차례로 계산하는 칸: 수 → (+a) → 수 → (−b) → 수. 조각은 칸에 적는 글이거나 { step: 화살표 위에 적는 글 }이다.
  const flow = (parts) => '<div class="mb-chain">' + parts.map((part) => (part.step ? `<span class="mb-step">${part.step}</span>` : `<span class="mb-node">${part}</span>`)).join('') + '</div>';

  // ── 잘못된 계산 살펴보기 ──
  B.addTypes('5-1-5', 'check', [
    T('check-where', '처음으로 잘못된 곳 찾기', '①35 ②42·44 ③64 심7', (d, n) => {
      if (n === 0) {
        // 진분수의 덧셈을 두 분모의 곱으로 통분하는 과정. 잘못은 ㉠(분자에 곱한 수가 분모에 곱한 수와 다름), ㉡(둘째 분자를 그대로 둠), ㉢(분모끼리도 더함) 가운데 한 곳이다.
        const [a, b] = two(d, COPRIME.filter(([x, y]) => x * y <= 72), (p, q) => less1(p, q) && q.n >= 2), at = d.int(0, 2), P = a.d * b.d;
        const m2 = at === 0 ? d.until(() => d.pick([b.n, b.d, a.d + 1, a.d - 1]), (v) => v !== a.d && v >= 2) : a.d, X = a.n * b.d, Y = at === 1 ? b.n : b.n * m2, den = at === 2 ? P + P : P;
        const why = ['분모에 곱한 수와 같은 수를 분자에도 곱해야 한다.', '통분하면 분자도 곱한 수만큼 커진다.', '분모가 같은 분수의 덧셈은 분모는 그대로 두고 분자끼리만 더한다.'][at];
        return C('다음 계산에서 처음으로 잘못된 곳의 기호는?', THREE, at, {
          figure: lines([eq(show(a), '+', show(b)), tag(LAB[0]) + eq('=', frac(`${a.n} × ${b.d}`, `${a.d} × ${b.d}`), '+', frac(`${b.n} × ${m2}`, `${b.d} × ${a.d}`)), tag(LAB[1]) + eq('=', frac(X, P), '+', frac(Y, P)), tag(LAB[2]) + eq('=', frac(X + Y, den))]),
          explain: `${why} 바르게 계산하면 ${frac(X, P)} + ${frac(b.n * a.d, P)} = ${frac(X + b.n * a.d, P)}이다.`,
          facts: { claimed: [[String(m2), a.d], [`${b.n}*${m2}`, Y], [String(den), P]], claimedWant: false, rule: 'whereAdd' }
        });
      }
      // 대분수의 뺄셈에서 받아내림하는 과정. 잘못은 ㉠(빼는 수의 분자를 그대로 둠), ㉡(받아내림하고 자연수 부분을 줄이지 않음), ㉢(줄이기 전의 자연수 부분에서 뺌) 가운데 한 곳이다.
      const [f1, f2] = two(d, SMALL, (p, q) => smaller(p, q) && q.d !== lcm(p.d, q.d) && numer(p, lcm(p.d, q.d)) < q.n), w2 = d.int(1, 3), a = W(f1, w2 + d.int(2, 3)), b = W(f2, w2);
      const at = d.int(0, 2), L = lcm(a.d, b.d), x = numer(a, L), y = numer(b, L), yS = at === 0 ? b.n : y, wB = at === 1 ? a.w : a.w - 1, wC = at === 2 ? a.w - b.w : wB - b.w;
      const why = ['통분하면 빼는 수의 분자도 곱한 수만큼 커진다.', '자연수에서 1만큼을 받아내림하였으므로 자연수 부분은 1만큼 작아진다.', '받아내림하여 고친 자연수 부분에서 빼야 한다.'][at];
      return C('다음 계산에서 처음으로 잘못된 곳의 기호는?', THREE, at, {
        figure: lines([eq(show(a), '-', show(b)), tag(LAB[0]) + eq('=', mixed(a.w, x, L), '-', mixed(b.w, yS, L)), tag(LAB[1]) + eq('=', mixed(wB, x + L, L), '-', mixed(b.w, yS, L)), tag(LAB[2]) + eq('=', mixed(wC, x + L - yS, L))]),
        explain: `${why} 바르게 계산하면 ${told(a, '-', b)}이다.`,
        facts: { claimed: [[`${b.n}*${L}/${b.d}`, yS], [`${a.w}-1`, wB], [`${wB}-${b.w}`, wC]], claimedWant: false, rule: 'whereBorrow' }
      });
    }, { count: 2 }),
    T('check-why', '잘못 계산한 까닭 고르기', '①36 ②43·44 ③64 심8', (d, n) => {
      // 문항마다 잘못이 다르다: 분모끼리·분자끼리 더함, 통분하면서 분자를 그대로 둠, 받아올림한 1을 더하지 않음, 자연수 부분에도 곱함.
      const BOTH = '통분하지 않고 분모는 분모끼리, 분자는 분자끼리 더하였다.', KEEP = '통분하면서 분모만 바꾸고 분자는 바꾸지 않았다.';
      if (n <= 1) {
        const both = n === 0, [a, b] = two(d, GENERAL.concat(MULTIPLE).filter(([x, y]) => lcm(x, y) <= 30), (p, q) => p.n + q.n < lcm(p.d, q.d) && less1(p, q)), L = lcm(a.d, b.d);
        const rows = d.shuffle([[BOTH, both], [KEEP, !both], ['분자끼리 더하는 계산을 잘못하였다.', false], ['두 분모의 곱을 공통분모로 하여 통분하였다.', false]]);
        return C('다음은 잘못 계산한 것이다. 잘못 계산한 까닭을 바르게 말한 것은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
          figure: both ? eq(show(a), '+', show(b), '=', frac(`${a.n} + ${b.n}`, `${a.d} + ${b.d}`), '=', frac(a.n + b.n, a.d + b.d)) : eq(show(a), '+', show(b), '=', frac(a.n, L), '+', frac(b.n, L), '=', frac(a.n + b.n, L)),
          explain: (both ? '분모가 다른 분수는 통분한 다음 분자끼리 더해야 한다.' : '통분할 때에는 분모에 곱한 수를 분자에도 곱해야 한다.') + ` 바르게 계산하면 ${told(a, '+', b)}이다.`,
          facts: { truth: rows.map((row) => row[1]), want: true, rule: both ? 'whyBoth' : 'whyKeep' }
        });
      }
      const carry = n === 2, [f1, f2] = two(d, SMALL, carry ? more1 : (p, q) => less1(p, q) && p.d !== lcm(p.d, q.d) && q.d !== lcm(p.d, q.d)), a = W(f1, d.int(1, 3)), b = W(f2, d.int(1, 3));
      const L = lcm(a.d, b.d), x = numer(a, L), y = numer(b, L), k1 = L / a.d, k2 = L / b.d;
      const rows = d.shuffle([['분수 부분의 합에서 받아올림한 1을 자연수 부분에 더하지 않았다.', carry], ['통분하면서 자연수 부분에도 분모에 곱한 수를 곱하였다.', !carry], [BOTH, false], [KEEP, false]]);
      return C('다음은 잘못 계산한 것이다. 잘못 계산한 까닭을 바르게 말한 것은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
        figure: lines(carry
          ? [eq(show(a), '+', show(b)), eq('=', mixed(a.w, x, L), '+', mixed(b.w, y, L)), eq('=', a.w + b.w, '+', frac(x + y, L), '=', mixed(a.w + b.w, x + y - L, L))]
          : [eq(show(a), '+', show(b)), eq('=', mixed(a.w * k1, x, L), '+', mixed(b.w * k2, y, L)), eq('=', mixed(a.w * k1 + b.w * k2, x + y, L))]),
        explain: (carry ? `${fj(x + y, L, '은/는')} ${mixed(1, x + y - L, L)}이므로 자연수 부분에 1을 더해야 한다.` : '통분할 때 자연수 부분은 그대로 두고 분수 부분의 분모와 분자에만 같은 수를 곱한다.') + ` 바르게 계산하면 ${told(a, '+', b)}이다.`,
        facts: { truth: rows.map((row) => row[1]), want: true, rule: carry ? 'whyCarry' : 'whyWhole' }
      });
    }, { count: 4 }),
    T('check-value', '잘못된 계산을 바르게 고치기', '①35 ②43·44 ③64 심7', (d, n) => {
      if (n === 0) {
        // 분모는 분모끼리, 분자는 분자끼리 뺀 계산
        const [a, b] = two(d, ANY, (p, q) => bigger(p, q) && p.d - q.d >= 2 && p.n > q.n && p.n - q.n < p.d - q.d);
        return ans('다음은 잘못 계산한 것이다. 바르게 계산한 값은?', [a, '-', b], {
          figure: eq(show(a), '-', show(b), '=', frac(`${a.n} − ${b.n}`, `${a.d} − ${b.d}`), '=', frac(a.n - b.n, a.d - b.d)),
          explain: `분모가 다른 분수는 통분한 다음 분자끼리 빼야 한다. ${told(a, '-', b)}`, facts: { rule: 'valueBoth' }
        });
      }
      // 받아내림하지 않고 큰 분자에서 작은 분자를 뺀 계산
      const [f1, f2] = two(d, SMALL, smaller), w2 = d.int(1, 4), a = W(f1, w2 + d.int(2, 4)), b = W(f2, w2), L = lcm(a.d, b.d), x = numer(a, L), y = numer(b, L);
      return ans('다음은 잘못 계산한 것이다. 바르게 계산한 값은?', [a, '-', b], {
        figure: lines([eq(show(a), '-', show(b)), eq('=', mixed(a.w, x, L), '-', mixed(b.w, y, L), '=', mixed(a.w - b.w, y - x, L))]),
        explain: `${frac(x, L)}에서 ${fj(y, L, '을/를')} 뺄 수 없으므로 자연수에서 1만큼을 받아내림해야 한다. ${told(a, '-', b)}`, facts: { rule: 'valueBorrow' }
      });
    }, { count: 2 }),
    T('check-wrong-pick', '계산이 잘못된 것 고르기', '①34 ②41 ③32 심9', (d) => {
      // 네 식 가운데 하나만 틀리다. 틀린 값은 그 계산에서 흔한 잘못(분모끼리도 더함, 분자를 그대로 둠, 받아올림을 빠뜨림, 큰 분자에서 작은 분자를 뺌)으로 구한 값이다.
      const made = d.until(() => {
        const [p1, p2] = two(d, SMALL, more1), [q1, q2] = two(d, SMALL, (x, y) => bigger(x, y) && x.n > y.n), [r1, r2] = two(d, SMALL, more1), [s1, s2] = two(d, SMALL, smaller), w = d.int(1, 3);
        const A = W(r1, d.int(1, 4)), Bm = W(r2, d.int(1, 4)), Cm = W(s1, w + d.int(2, 4)), Dm = W(s2, w), L3 = lcm(r1.d, r2.d), L4 = lcm(s1.d, s2.d);
        const rows = [[p1, '+', p2], [q1, '-', q2], [A, '+', Bm], [Cm, '-', Dm]];
        const wrong = [R(p1.n + p2.n, p1.d + p2.d), R(q1.n - q2.n, lcm(q1.d, q2.d)), R((A.w + Bm.w) * L3 + numer(r1, L3) + numer(r2, L3) - L3, L3), R((Cm.w - Dm.w) * L4 + numer(s2, L4) - numer(s1, L4), L4)];
        return { rows, wrong };
      }, (m) => m.wrong.every((w, i) => w.q !== 1 && cmp(w, calc(m.rows[i])) !== 0));
      const bad = d.int(0, 3), saids = made.rows.map((row, i) => (i === bad ? made.wrong[i] : calc(row)));
      return C('계산이 잘못된 것은?', made.rows.map((row, i) => eq(...row.map((p) => (typeof p === 'string' ? p : show(p))), '=', show(toV(saids[i])))), bad, {
        explain: `바르게 계산하면 ${told(made.rows[bad][0], made.rows[bad][1], made.rows[bad][2])}이다. 나머지는 바르게 계산하였다.`,
        facts: { claimed: made.rows.map((row, i) => { const o = over(row); return [`(${o.num})*${saids[i].q}`, saids[i].p * o.D]; }), claimedWant: false }
      });
    })
  ]);

  // ── 계산 결과 비교하기 ──
  B.addTypes('5-1-5', 'comp', [
    T('comp-sign-two', '두 식의 계산 결과 비교', '①32 ②35 ③26 심11', (d, n) => {
      // 첫째 문항은 진분수의 덧셈끼리(계산 결과가 같을 때도 있다), 둘째 문항은 대분수의 덧셈과 뺄셈, 셋째 문항은 대분수의 뺄셈끼리. 두 결과가 가까워 계산해 보아야 알 수 있다.
      const equal = n === 0 && d.int(0, 3) === 0;
      const rows = d.until(() => {
        if (n === 1) return d.shuffle([expr2(d, 'm+', SMALL), expr2(d, 'm-', SMALL)]);
        if (n === 2) return [expr2(d, 'm-', SMALL), expr2(d, 'm-', SMALL)];
        const first = expr2(d, 'p+', SMALL), same = equal ? splits(calc(first), '+').filter((row) => !shares(row, first)) : [];
        return [first, same.length ? d.pick(same) : expr2(d, 'p+', SMALL)];
      }, ([p, q]) => near(calc(p), calc(q), 6) && !shares(p, q) && (cmp(calc(p), calc(q)) === 0) === equal);
      const [v1, v2] = rows.map(calc);
      return C('두 식의 계산 결과를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, sgn(v1, v2), {
        figure: versus(eqOf(rows[0]), eqOf(rows[1])),
        explain: `${say(rows[0])} = ${res(rows[0])}, ${say(rows[1])} = ${res(rows[1])}이다. ` + (cmp(v1, v2) === 0 ? '두 계산 결과는 같다.' : `통분하여 비교하면 ${res(rows[0])} ${SGN(v1, v2)} ${res(rows[1])}이다.`),
        facts: { choose: { exprs: scaled(rows), rule: 'compare' }, rule: ['signProper', 'signMixed', 'signMixedSub'][n] }
      });
    }, { count: 3 }),
    T('comp-sign-value', '계산 결과와 수의 크기 비교', '②34 ③27 ①32', (d) => {
      const row = expr2(d, d.pick(['m+', 'm-']), SMALL), v = calc(row);
      const num = d.int(0, 4) === 4 ? toV(v) : d.until(() => { const den = d.int(2, 12); return V(Math.floor(v.p / v.q), coTop(d, den), den); }, (x) => near(val(x), v, 4) && cmp(val(x), v) !== 0 && x.d !== v.q), rows = [row, [num]];
      return C('계산 결과와 수의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, sgn(v, val(num)), {
        figure: versus(eqOf(row), ex(show(num))),
        explain: `${say(row)} = ${res(row)}이다. ` + (cmp(v, val(num)) === 0 ? '계산 결과와 수의 크기가 같다.' : `통분하여 비교하면 ${res(row)} ${SGN(v, val(num))} ${show(num)}이다.`),
        facts: { choose: { exprs: scaled(rows), rule: 'compare' }, rule: 'signValue' }
      });
    }),
    T('comp-sign-shared', '같은 수가 있는 두 식을 계산하지 않고 비교하기', '②35 ③26', (d, n) => {
      // 첫째 문항은 같은 수를 더하는 두 식, 둘째 문항은 같은 수에서 빼는 두 식(빼는 수가 클수록 결과가 작다).
      const kind = ['add', 'from'][n], [lo, mid, hi] = d.until(() => fracsOf(d, d.shuffle(d.pick(TRIPLES))), distinct).sort((p, q) => cmp(val(p), val(q)));
      const flip = d.bool(), [x, y] = kind === 'add' ? (flip ? [lo, hi] : [hi, lo]) : kind === 'from' ? (flip ? [lo, mid] : [mid, lo]) : (flip ? [mid, hi] : [hi, mid]), same = kind === 'add' ? mid : kind === 'from' ? hi : lo;
      const rows = kind === 'add' ? [[x, '+', same], [y, '+', same]] : kind === 'from' ? [[same, '-', x], [same, '-', y]] : [[x, '-', same], [y, '-', same]];
      const why = kind === 'add' ? `두 식 모두 ${vj(same, '을/를')} 더하므로 ${vj(x, '과/와')} ${show(y)}의 크기만 비교한다.` : kind === 'from' ? `두 식 모두 ${show(same)}에서 빼므로 빼는 수가 클수록 계산 결과가 작다.` : `두 식 모두 ${vj(same, '을/를')} 빼므로 ${vj(x, '과/와')} ${show(y)}의 크기만 비교한다.`;
      const L = lcm(x.d, y.d);
      return C('두 식에 같은 수가 있다. 계산하지 않고 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, sgn(calc(rows[0]), calc(rows[1])), {
        figure: versus(eqOf(rows[0]), eqOf(rows[1])),
        explain: `${why} ${vj(x, '과/와')} ${vj(y, '을/를')} 통분하면 ${frac(numer(x, L), L)}, ${frac(numer(y, L), L)}이므로 ${say(rows[0])} ${SGN(calc(rows[0]), calc(rows[1]))} ${say(rows[1])}이다.`,
        facts: { choose: { exprs: scaled(rows), rule: 'compare' }, rule: ['sharedAdd', 'sharedFrom'][n] }
      });
    }, { count: 2 }),
    T('comp-max', '계산 결과가 가장 큰(작은) 식 찾기', '①33 ②36 ③28 심12', (d) => {
      const rows = d.until(() => d.shuffle(['m+', 'm-', 'm+']).map((k) => expr2(d, k, SMALL)), (list) => { const vs = list.map(calc); return apart(list) && vs.every((p, i) => vs.every((q, j) => i === j || (cmp(p, q) !== 0 && near(p, q, 2)))); });
      const vs = rows.map(calc), big = d.bool(), hit = vs.reduce((at, v, i) => ((big ? cmp(v, vs[at]) > 0 : cmp(v, vs[at]) < 0) ? i : at), 0);
      return C(`계산 결과가 가장 ${big ? '큰' : '작은'} 것은?`, THREE, hit, {
        figure: tagged(rows.map(eqOf)),
        explain: `계산 결과는 ${rows.map((row, i) => `${LAB[i]} ${res(row)}`).join(', ')}이다. 통분하여 비교하면 가장 ${big ? '큰' : '작은'} 것은 ${LAB[hit]}이다.`,
        facts: { choose: { exprs: scaled(rows), rule: big ? 'max' : 'min' } }
      });
    }),
    T('comp-order', '계산 결과를 크기 차례로 늘어놓기', '①33 ②37 ③28 심13', (d, n) => {
      // 첫째 문항은 진분수의 뺄셈 셋, 둘째 문항은 대분수의 뺄셈 셋.
      const rows = d.until(() => [0, 0, 0].map(() => expr2(d, n === 0 ? 'p-' : 'm-', SMALL)), (list) => { const vs = list.map(calc); return apart(list) && vs.every((p, i) => vs.every((q, j) => i === j || (cmp(p, q) !== 0 && near(p, q, n === 0 ? 3 : 2)))); });
      const vs = rows.map(calc), desc = d.bool(), pick = orderChoice(d, vs, THREE, desc);
      return C(`계산 결과가 ${desc ? '큰' : '작은'} 것부터 차례대로 쓴 것은?`, pick.options, pick.answer, {
        figure: tagged(rows.map(eqOf)),
        explain: `계산 결과는 ${rows.map((row, i) => `${LAB[i]} ${res(row)}`).join(', ')}이다. 통분하여 비교하면 ${pick.right.map((i) => res(rows[i])).join(desc ? ` ${GT} ` : ` ${LT} `)}이다.`,
        facts: { choose: { exprs: scaled(rows), rule: desc ? 'descending' : 'ascending', orders: pick.list }, rule: ['orderProper', 'orderMixed'][n] }
      });
    }, { count: 2 }),
    T('comp-over-one', '합이 1보다 큰 덧셈 찾기', '①21 ②38 ③29 심14', (d) => {
      // 세 식 모두 합이 1에 가깝다(3/4보다 크고 5/4보다 작다). 1보다 큰 것은 하나뿐이다.
      const close = (row) => { const v = calc(row); return v.p * 4 > v.q * 3 && v.p * 4 < v.q * 5; };
      const rows = d.until(() => d.shuffle([expr2(d, 'p+', SMALL), expr2(d, 'p+', SMALL), expr2(d, 'p+', SMALL)]), (list) => list.every(close) && list.filter((row) => calc(row).p > calc(row).q).length === 1 && !shares(list[0], list[1]) && !shares(list[0], list[2]) && !shares(list[1], list[2]));
      const hit = rows.findIndex((row) => calc(row).p > calc(row).q);
      return C('계산 결과가 1보다 큰 것은?', THREE, hit, {
        figure: tagged(rows.map(eqOf)),
        explain: `계산 결과는 ${rows.map((row, i) => `${LAB[i]} ${res(row)}`).join(', ')}이다. 1보다 큰 것은 ${LAB[hit]}이다.`,
        facts: { choose: { exprs: scaled(rows), rule: 'onlyAbove', target: allD(rows) } }
      });
    }),
    T('comp-below-one', '차가 1보다 작은 대분수의 뺄셈 찾기', '②38 ③29 심14', (d) => {
      // 자연수 부분의 차가 1이어도 받아내림하면 차가 1보다 작다. 나머지 둘은 자연수 부분의 차가 1이고 받아내림이 없는 것, 차가 2이고 받아내림이 있는 것.
      const mk = (gap, cond) => { const [f1, f2] = two(d, SMALL, cond), w2 = d.int(1, 5); return [W(f1, w2 + gap), '-', W(f2, w2)]; };
      const rows = d.until(() => d.shuffle([mk(1, smaller), mk(1, bigger), mk(2, smaller)]), (list) => apart(list) && distinct(list.map((row) => toV(calc(row))))), hit = rows.findIndex((row) => calc(row).p < calc(row).q);
      return C('계산 결과가 1보다 작은 것은?', THREE, hit, {
        figure: tagged(rows.map(eqOf)),
        explain: `계산 결과는 ${rows.map((row, i) => `${LAB[i]} ${res(row)}`).join(', ')}이다. ${LAB[hit]}은 분수 부분끼리 뺄 수 없어 자연수에서 1만큼을 받아내림하므로 1보다 작다.`,
        facts: { choose: { exprs: scaled(rows), rule: 'onlyBelow', target: allD(rows) } }
      });
    }),
    T('comp-over-nat', '합이 어떤 자연수보다 큰 대분수의 덧셈 찾기', '②38 ③29', (d) => {
      // 자연수 부분의 합이 기준보다 1 작아도 받아올림하면 기준보다 크다. 나머지 둘은 받아올림이 없는 것, 자연수 부분의 합이 2 작고 받아올림이 있는 것.
      const Nn = d.int(4, 7), mk = (sum, cond) => { const [f1, f2] = two(d, SMALL, cond), w1 = d.int(1, sum - 1); return [W(f1, w1), '+', W(f2, sum - w1)]; };
      const rows = d.until(() => d.shuffle([mk(Nn - 1, more1), mk(Nn - 1, less1), mk(Nn - 2, more1)]), apart), hit = rows.findIndex((row) => calc(row).p > Nn * calc(row).q);
      return C(`계산 결과가 ${Nn}보다 큰 것은?`, THREE, hit, {
        figure: tagged(rows.map(eqOf)),
        explain: `계산 결과는 ${rows.map((row, i) => `${LAB[i]} ${res(row)}`).join(', ')}이다. ${LAB[hit]}은 분수 부분의 합이 1보다 커서 받아올림하므로 ${Nn}보다 크다.`,
        facts: { choose: { exprs: scaled(rows), rule: 'onlyAbove', target: Nn * allD(rows) } }
      });
    }),
    T('comp-odd', '계산 결과가 다른 하나 찾기', '①33 ②40 ③30 심15', (d) => {
      // 두 식은 계산 결과가 같고(약분해야 같은 것이 보일 때도 있다) 한 식만 다르다.
      const op = d.pick(['+', '-']), small = PROPER.filter((v) => v.d <= 12);
      const made = d.until(() => {
        const r = val(d.pick(small)), same = d.shuffle(splits(r, op)), pair = same.length >= 2 ? [same[0], same.find((row) => !shares(row, same[0]))] : [];
        const r2 = val(d.pick(small)), other = splits(r2, op).filter((row) => pair[0] && pair[1] && !shares(row, pair[0]) && !shares(row, pair[1]));
        return pair[1] && other.length && cmp(r, r2) !== 0 && near(r, r2, 5) ? { rows: [pair[0], pair[1], d.pick(other)], r } : null;
      }, Boolean);
      const order = d.shuffle([0, 1, 2]), rows = order.map((i) => made.rows[i]), hit = order.indexOf(2);
      return C('계산 결과가 나머지와 다른 하나는?', THREE, hit, {
        figure: tagged(rows.map(eqOf)),
        explain: `계산 결과는 ${rows.map((row, i) => `${LAB[i]} ${res(row)}`).join(', ')}이다. ${LAB[hit]}만 다르다.`,
        facts: { choose: { exprs: rows.map(fx), rule: 'odd' } }
      });
    }),
    T('comp-same-as', '주어진 식과 계산 결과가 같은 식 고르기', '②40 ③30 심11', (d) => {
      const made = d.until(() => {
        const given = expr2(d, 'p+', SMALL), v = calc(given), same = splits(v, '+').filter((row) => !shares(row, given));
        const others = [0, 0].map(() => expr2(d, 'p+', SMALL));
        return same.length ? { given, rows: [d.pick(same)].concat(others), v } : null;
      }, (m) => m && m.rows.slice(1).every((row) => cmp(calc(row), m.v) !== 0 && near(calc(row), m.v, 4) && !shares(row, m.given)) && !shares(m.rows[1], m.rows[2]) && !shares(m.rows[0], m.rows[1]) && !shares(m.rows[0], m.rows[2]));
      const order = d.shuffle([0, 1, 2]), rows = order.map((i) => made.rows[i]), hit = order.indexOf(0), g = over(made.given);
      return C(`${say(made.given)}${tail(made.given[2].n, '과/와')} 계산 결과가 같은 것은?`, THREE, hit, {
        figure: tagged(rows.map(eqOf)),
        explain: `${say(made.given)} = ${res(made.given)}이다. 세 식의 계산 결과는 ${rows.map((row, i) => `${LAB[i]} ${res(row)}`).join(', ')}이므로 ${LAB[hit]}의 계산 결과가 같다.`,
        facts: { claimed: rows.map((row) => { const o = over(row); return [`(${o.num})*(${g.den})-(${g.num})*(${o.den})`, 0]; }), claimedWant: true }
      });
    }),
    T('comp-match', '식과 계산 결과 짝 짓기', '①31 ②39 ③31 심10', (d) => {
      const rows = d.until(() => [0, 0, 0].map(() => expr2(d, 'm+', SMALL)), (list) => { const vs = list.map(calc); return apart(list) && vs.every((p, i) => vs.every((q, j) => i === j || (cmp(p, q) !== 0 && near(p, q, 2)))); });
      const ints = scaledValues(rows), list = d.shuffle(d.shuffle(ORDERS.slice(1)).slice(0, 3).concat([ORDERS[0]]));
      return C('식과 계산 결과를 알맞게 짝 지은 것은?', list.map((o) => o.map((j, i) => `${LAB[i]} ${res(rows[j])}`).join(', ')), list.findIndex((o) => o.join() === '0,1,2'), {
        figure: tagged(rows.map(eqOf)),
        explain: rows.map((row, i) => `${LAB[i]} ${told(row[0], row[1], row[2])}`).join(', ') + '이다.',
        facts: { match: { exprs: scaled(rows), options: list.map((o) => o.map((j) => ints[j])) } }
      });
    })
  ]);

  // ── 조건에 맞는 수의 합과 차 ──
  B.addTypes('5-1-5', 'pick', [
    T('say-more', '어떤 수보다 얼마만큼 더 큰 수', '①20 ②45 ③25 심18', (d) => {
      const [a, b] = two(d, ANY, more1);
      return ans(`${show(a)}보다 ${show(b)}만큼 더 큰 수는?`, [a, '+', b], { explain: `${show(a)}에 ${vj(b, '을/를')} 더한다. ${told(a, '+', b)}` });
    }),
    T('say-less', '어떤 수보다 얼마만큼 더 작은 수', '①20 ②45 ③25 심18', (d) => {
      const [f1, f2] = two(d, ANY, smaller), w2 = d.int(1, 4), a = W(f1, w2 + d.int(2, 4)), b = W(f2, w2);
      return ans(`${show(a)}보다 ${show(b)}만큼 더 작은 수는?`, [a, '-', b], { explain: `${show(a)}에서 ${vj(b, '을/를')} 뺀다. ${told(a, '-', b)}` });
    }),
    T('say-twice', '말로 두 번 이어 나타낸 수', '심18 ③25 ①42', (d) => {
      const parts = d.until(() => { const [x, y, z] = d.shuffle(d.pick(TRIPLES)); return [V(d.int(1, 3), coTop(d, x), x), '+', V(0, coTop(d, y), y), '-', V(0, coTop(d, z), z)]; }, (p) => calc(p).q !== 1 && calc([p[0], '+', p[2]]).q !== 1);
      const [a, , b, , c] = parts;
      return ans(`${show(a)}보다 ${show(b)}만큼 더 큰 수보다 ${show(c)}만큼 더 작은 수는?`, parts, { explain: `${show(a)}에 ${vj(b, '을/를')} 더한 다음 ${vj(c, '을/를')} 뺀다. ${told3(parts)}` });
    }),
    T('say-unit-sum', '단위분수가 몇 개인 수끼리의 합', '①23 ②46 심20', (d) => {
      const [a, b] = two(d, ANY, (p, q) => p.n >= 2 && q.n >= 2);
      return ans(`${frac(1, a.d)}이 ${a.n}개인 수와 ${frac(1, b.d)}이 ${b.n}개인 수의 합은?`, [a, '+', b], { explain: `${frac(1, a.d)}이 ${a.n}개인 수는 ${show(a)}, ${frac(1, b.d)}이 ${b.n}개인 수는 ${show(b)}이다. ${told(a, '+', b)}` });
    }),
    T('say-unit-count', '합을 단위분수의 개수로 나타내기', '①23', (d) => {
      const [a, b] = two(d, SMALL, (p, q) => p.n >= 2 && q.n >= 2 && p.d !== lcm(p.d, q.d) && q.d !== lcm(p.d, q.d)), L = lcm(a.d, b.d), x = numer(a, L), y = numer(b, L);
      return N(`${frac(1, a.d)}이 ${a.n}개인 수와 ${frac(1, b.d)}이 ${b.n}개인 수의 합은 ${frac(1, L)}이 몇 개인 수인가?`, x + y, {
        unit: '개', explain: `${show(a)} = ${frac(x, L)}이므로 ${frac(1, L)}이 ${x}개, ${show(b)} = ${frac(y, L)}이므로 ${frac(1, L)}이 ${y}개이다. 합은 ${frac(1, L)}이 ${x} + ${y} = ${x + y}(개)인 수이다.`,
        facts: { calc: [[`${a.n}*${L}/${a.d}+${b.n}*${L}/${b.d}`, 0]] }
      });
    }),
    T('say-diff-order', '두 수의 차(작은 수가 앞에 놓임)', '②30 ③20 심2', (d) => {
      const [f1, f2] = two(d, ANY, smaller), w2 = d.int(1, 4), big = W(f1, w2 + d.int(1, 3)), small = W(f2, w2);
      return ans('두 수의 차는?', [big, '-', small], { figure: numbers([show(small), show(big)]), explain: `큰 수 ${show(big)}에서 작은 수 ${vj(small, '을/를')} 뺀다. ${told(big, '-', small)}` });
    }),
    T('ends-sum', '가장 큰 수와 가장 작은 수의 합', '①22 ②55 ③40 심21', (d) => {
      const list = d.until(() => fracsOf(d, d.shuffle(d.pick(FAMS)).slice(0, 4)), (vs) => distinct(vs) && vs.filter((v) => v.n === 1).length <= 1 && vs.every((p) => vs.every((q) => near(val(p), val(q), 2)))), L = list.reduce((acc, v) => lcm(acc, v.d), 1);
      const sorted = list.slice().sort((p, q) => cmp(val(p), val(q))), lo = sorted[0], hi = sorted[3];
      return ans('네 분수 가운데 가장 큰 수와 가장 작은 수의 합은?', [hi, '+', lo], {
        figure: numbers(list.map(show)),
        explain: `분모가 ${L}${tail(L, '이/가')} 되도록 통분하면 차례대로 ${list.map((v) => frac(numer(v, L), L)).join(', ')}이다. 가장 큰 수는 ${show(hi)}, 가장 작은 수는 ${show(lo)}이다. ${told(hi, '+', lo)}`
      });
    }),
    T('ends-diff', '가장 큰 수와 가장 작은 수의 차', '①22 ②55 ③40 심21', (d) => {
      // 자연수 부분이 같은 수가 둘씩 있어 분수 부분을 통분해야 가장 큰 수와 가장 작은 수를 알 수 있다.
      const fs = d.until(() => fracsOf(d, d.shuffle(d.pick(FAMS)).slice(0, 4)), distinct), wLo = d.int(1, 3), wHi = wLo + d.int(2, 4);
      const his = [W(fs[0], wHi), W(fs[1], wHi)], los = [W(fs[2], wLo), W(fs[3], wLo)], hi = bigger(fs[0], fs[1]) ? his[0] : his[1], lo = smaller(fs[2], fs[3]) ? los[0] : los[1];
      return ans('네 수 가운데 가장 큰 수와 가장 작은 수의 차는?', [hi, '-', lo], {
        figure: numbers(d.shuffle(his.concat(los)).map(show)),
        explain: `자연수 부분이 ${wHi}인 두 수의 분수 부분을 통분하여 비교하면 가장 큰 수는 ${show(hi)}이고, 자연수 부분이 ${wLo}인 두 수를 비교하면 가장 작은 수는 ${show(lo)}이다. ${told(hi, '-', lo)}`
      });
    }),
    T('pick-two-sum', '두 수를 골라 합이 가장 큰(작은) 덧셈식 만들기', '②56 ③41 심22', (d) => {
      const w = d.int(1, 5), list = d.until(() => fracsOf(d, d.shuffle(d.pick(TRIPLES))), distinct).map((f) => W(f, w)), big = d.bool();
      const sorted = list.slice().sort((p, q) => cmp(val(p), val(q))), [x, y] = big ? [sorted[2], sorted[1]] : [sorted[0], sorted[1]], out = big ? sorted[0] : sorted[2];
      return ans(`세 수 가운데 두 수를 골라 합이 가장 ${big ? '큰' : '작은'} 덧셈식을 만들었다. 이 덧셈식의 계산 결과는?`, [x, '+', y], {
        figure: numbers(list.map(show)),
        explain: `합이 가장 ${big ? '크려면 가장 작은' : '작으려면 가장 큰'} 수 ${vj(out, '을/를')} 빼고 나머지 두 수를 더한다. ${told(x, '+', y)}`
      });
    }),
    T('pick-pair-sum', '합이 주어진 수가 되는 두 수 찾기', '①62 심24', (d) => {
      // 네 분수에서 두 수를 고르는 여섯 가지 가운데 합이 주어진 수가 되는 것은 하나뿐이다.
      const PAIRS = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]], hits = (list, v) => PAIRS.filter(([i, j]) => cmp(calc([list[i], '+', list[j]]), v) === 0);
      const made = d.until(() => { const list = fracsOf(d, d.shuffle(d.pick(FAMS)).slice(0, 4)); return { list: d.shuffle(list), v: calc([list[0], '+', list[1]]) }; }, (m) => m.list.every((v) => v.d <= 15) && hits(m.list, m.v).length === 1);
      const right = hits(made.list, made.v)[0], shown = d.shuffle(d.shuffle(PAIRS.filter((p) => p !== right)).slice(0, 3).concat([right])), [i, j] = right, target = toV(made.v);
      return C(`네 분수 가운데 두 수를 골라 더하였더니 ${vj(target, '이/가')} 되었다. 고른 두 수는?`, shown.map(([p, q]) => `${show(made.list[p])}, ${show(made.list[q])}`), shown.indexOf(right), {
        figure: numbers(made.list.map(show)),
        explain: `${told(made.list[i], '+', made.list[j])}이다. 다른 두 수를 더하면 ${show(target)}${tail(target.n, '이/가')} 되지 않는다.`,
        facts: { claimed: shown.map(([p, q]) => { const x = made.list[p], y = made.list[q]; return [`(${x.n}*${y.d}+${y.n}*${x.d})*${made.v.q}-${made.v.p}*${x.d}*${y.d}`, 0]; }), claimedWant: true }
      });
    }),
    T('cards-proper', '수 카드로 만든 가장 큰 진분수와 가장 작은 진분수의 차', '①46 ③43 심35·36', (d) => {
      // 세 수 a < b < c 로 만드는 진분수는 a/b, a/c, b/c 이다. 가장 큰 수가 a/b 가 되게 뽑아(a × c > b × b) 분모가 다른 뺄셈이 되게 한다.
      const [a, b, c] = d.until(() => d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3).sort((x, y) => x - y), ([x, y, z]) => x * z > y * y && gcd(x, y) === 1 && gcd(x, z) === 1 && gcd(y, z) === 1);
      const hi = V(0, a, b), lo = V(0, a, c);
      return ans('수 카드 3장 가운데 2장을 골라 진분수를 만들려고 한다. 만들 수 있는 가장 큰 진분수와 가장 작은 진분수의 차는?', [hi, '-', lo], {
        figure: cards(d.shuffle([a, b, c])),
        explain: `만들 수 있는 진분수는 ${frac(a, b)}, ${frac(a, c)}, ${frac(b, c)}이다. 통분하여 비교하면 가장 큰 수는 ${frac(a, b)}, 가장 작은 수는 ${frac(a, c)}이다. ${told(hi, '-', lo)}`
      });
    }),
    T('cards-mixed', '수 카드로 만든 대분수의 합과 차', '①46 ②57 ③45 심33·34', (d, n) => {
      // 세 수 a < b < c 로 만드는 가장 큰 대분수는 c a/b, 가장 작은 대분수는 a b/c 이다. 첫째 문항은 한 묶음의 차, 둘째 문항은 두 묶음에서 하나씩 만든 수의 합.
      const three = () => d.until(() => d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3).sort((x, y) => x - y), ([x, y, z]) => gcd(x, y) === 1 && gcd(y, z) === 1);
      if (n === 0) {
        const [a, b, c] = three(), hi = V(c, a, b), lo = V(a, b, c);
        return ans('수 카드 3장을 한 번씩 모두 사용하여 대분수를 만들려고 한다. 만들 수 있는 가장 큰 대분수와 가장 작은 대분수의 차는?', [hi, '-', lo], {
          figure: cards(d.shuffle([a, b, c])),
          explain: `가장 큰 대분수는 가장 큰 수 ${josa(c, '을/를')} 자연수 부분에 놓은 ${show(hi)}, 가장 작은 대분수는 가장 작은 수 ${josa(a, '을/를')} 자연수 부분에 놓은 ${show(lo)}이다. ${told(hi, '-', lo)}`,
          facts: { rule: 'cardsOne' }
        });
      }
      const [p, q] = d.shuffle(NAMES).slice(0, 2), [s2, s1] = d.until(() => [three(), three()], ([y, x]) => x[1] !== y[2] && x.join() !== y.join()), hi = V(s1[2], s1[0], s1[1]), lo = V(s2[0], s2[1], s2[2]);
      return ans(`${name(p, '은/는')} 수 카드 3장을 한 번씩 모두 사용하여 가장 큰 대분수를 만들고, ${name(q, '은/는')} 수 카드 3장을 한 번씩 모두 사용하여 가장 작은 대분수를 만들었다. 두 사람이 만든 대분수의 합은?`, [hi, '+', lo], {
        figure: tagged([cards(d.shuffle(s1)), cards(d.shuffle(s2))], [p, q]),
        explain: `${name(p, '이/가')} 만든 가장 큰 대분수는 ${show(hi)}, ${name(q, '이/가')} 만든 가장 작은 대분수는 ${show(lo)}이다. ${told(hi, '+', lo)}`,
        facts: { rule: 'cardsTwo' }
      });
    }, { count: 2 })
  ]);

  // ── □가 있는 식과 어떤 수 ──
  B.addTypes('5-1-5', 'box', [
    T('box-expr', '덧셈식·뺄셈식의 □에 알맞은 분수', '①37 ②47 ③33 심25', (d, n) => {
      // 문항마다 □의 자리가 다르다: □ + a = b, □ − a = b, a − □ = b.
      if (n === 0) {
        const [f1, f2] = two(d, ANY, bigger), a = W(f1, d.int(1, 3)), b = W(f2, a.w + d.int(2, 4));
        return ans('□ 안에 알맞은 수는?', [b, '-', a], { figure: eq(box(), '+', show(a), '=', show(b)), explain: `□는 ${show(b)}에서 ${vj(a, '을/를')} 뺀 수이다. ${told(b, '-', a)}`, facts: { rule: 'boxPlus' } });
      }
      if (n === 1) {
        const [f1, f2] = two(d, ANY, more1), a = W(f1, d.int(1, 3)), b = W(f2, d.int(1, 3));
        return ans('□ 안에 알맞은 수는?', [b, '+', a], { figure: eq(box(), '-', show(a), '=', show(b)), explain: `□는 ${show(b)}에 ${vj(a, '을/를')} 더한 수이다. ${told(b, '+', a)}`, facts: { rule: 'boxMinus' } });
      }
      const [f1, f2] = two(d, ANY), b = W(f2, d.int(1, 3)), a = W(f1, b.w + d.int(2, 4));
      return ans('□ 안에 알맞은 수는?', [a, '-', b], { figure: eq(show(a), '-', box(), '=', show(b)), explain: `□는 ${show(a)}에서 ${vj(b, '을/를')} 뺀 수이다. ${told(a, '-', b)}`, facts: { rule: 'boxTaken' } });
    }, { count: 3 }),
    T('box-top', '등식이 성립하게 하는 분자', '①37', (d) => {
      const [den, L] = d.pick(MULTIPLE.filter(([x, y]) => y / x >= 2 && y <= 24)), a = V(0, coTop(d, den), den), x = numer(a, L), r = d.until(() => d.int(1, x - 1), (v) => x - v >= 2 || x <= 2);
      return N('□ 안에 알맞은 수는?', x - r, {
        figure: eq(show(a), '-', frac(box(), L), '=', frac(r, L)),
        explain: `${show(a)} = ${frac(x, L)}이다. ${frac(x, L)} − ${frac('□', L)} = ${frac(r, L)}에서 □는 ${x} − ${r} = ${x - r}이다.`,
        facts: { calc: [[`${a.n}*${L}/${a.d}-${r}`, 0]], rule: 'boxTop' }
      });
    }),
    T('any-find', '어떤 수 구하기', '②48 ③35 심25', (d, n) => {
      // 첫째 문항은 뺐더니, 둘째 문항은 더했더니.
      const minus = n === 0, [f1, f2] = two(d, ANY, minus ? more1 : smaller), a = W(f1, d.int(1, 3)), b = W(f2, minus ? d.int(1, 4) : a.w + d.int(2, 4));
      return minus
        ? ans(`어떤 수에서 ${vj(a, '을/를')} 뺐더니 ${vj(b, '이/가')} 되었다. 어떤 수는?`, [b, '+', a], { explain: `어떤 수는 ${show(b)}에 ${vj(a, '을/를')} 더한 수이다. ${told(b, '+', a)}` })
        : ans(`어떤 수에 ${vj(a, '을/를')} 더했더니 ${vj(b, '이/가')} 되었다. 어떤 수는?`, [b, '-', a], { explain: `어떤 수는 ${show(b)}에서 ${vj(a, '을/를')} 뺀 수이다. ${told(b, '-', a)}` });
    }, { count: 2 }),
    T('box-top-range', '계산 결과보다 작은 분수의 분자', '①38 ②54 ③37 심30', (d, n) => {
      // □가 든 분수의 분모는 두 분모의 최소공배수이다. 첫째 문항은 개수(진분수의 덧셈), 둘째 문항은 가장 큰 수(대분수의 뺄셈).
      if (n === 0) {
        const [a, b] = two(d, SMALL, (p, q) => less1(p, q) && p.d !== lcm(p.d, q.d) && q.d !== lcm(p.d, q.d)), L = lcm(a.d, b.d), s = numer(a, L) + numer(b, L);
        return N('□ 안에 들어갈 수 있는 자연수는 모두 몇 개인가?', s - 1, {
          unit: '개', figure: eq(show(a), '+', show(b), '>', frac(box(), L)),
          explain: `${show(a)} + ${show(b)} = ${frac(numer(a, L), L)} + ${frac(numer(b, L), L)} = ${frac(s, L)}이다. □는 ${s}보다 작아야 하므로 1부터 ${s - 1}까지의 자연수가 들어갈 수 있다.`,
          facts: { digit: { template: `(${a.n}*${b.d}+${b.n}*${a.d})*${L}>□*${a.d}*${b.d}`, lo: 1, hi: 2 * L, ask: 'count' }, rule: 'topCount' }
        });
      }
      const made = d.until(() => { const [f1, f2] = two(d, SMALL), w2 = d.int(1, 3), a = W(f1, w2 + d.int(2, 4)), b = W(f2, w2), L = lcm(a.d, b.d), t = top(a) * L / a.d - top(b) * L / b.d; return { a, b, L, w: Math.floor(t / L), r: t % L }; }, (m) => m.r >= 3 && m.w >= 1);
      const { a, b, L, w, r } = made;
      return N('□ 안에 들어갈 수 있는 자연수 가운데 가장 큰 수는?', r - 1, {
        figure: eq(show(a), '-', show(b), '>', mixed(w, box(), L)),
        explain: `분모가 ${L}${tail(L, '이/가')} 되도록 통분하여 계산하면 ${show(a)} − ${show(b)} = ${mixed(w, r, L)}이다. □는 ${r}보다 작아야 하므로 가장 큰 수는 ${r - 1}이다.`,
        facts: { digit: { template: `${imp(a)}*${b.d}*${L}-${imp(b)}*${a.d}*${L}>(${w}*${L}+□)*${a.d}*${b.d}`, lo: 1, hi: L - 1, ask: 'max' }, rule: 'topMax' }
      });
    }, { count: 2 }),
    T('box-nat-range', '계산 결과와 자연수의 크기 비교', '①38 ②52 ③37 심31', (d, n) => {
      // 첫째 문항은 계산 결과보다 작은 자연수의 개수(덧셈), 둘째 문항은 계산 결과보다 큰 가장 작은 자연수(받아내림이 있는 뺄셈).
      if (n === 0) {
        const [f1, f2] = two(d, ANY), a = W(f1, d.int(1, 4)), b = W(f2, d.int(1, 4)), parts = [a, '+', b], v = calc(parts), o = over(parts), k = Math.floor(v.p / v.q);
        return N('□ 안에 들어갈 수 있는 자연수는 모두 몇 개인가?', k, {
          unit: '개', figure: eq(show(a), '+', show(b), '>', box()),
          explain: `${told(a, '+', b)}이다. □는 ${res(parts)}보다 작은 자연수이므로 1부터 ${k}까지 ${k}개이다.`,
          facts: { digit: { template: `${o.num}>□*${o.den}`, lo: 1, hi: k + 3, ask: 'count' }, rule: 'natCount' }
        });
      }
      const [f1, f2] = two(d, ANY, smaller), w2 = d.int(1, 4), a = W(f1, w2 + d.int(2, 5)), b = W(f2, w2), parts = [a, '-', b], v = calc(parts), o = over(parts), k = Math.floor(v.p / v.q);
      return N('□ 안에 들어갈 수 있는 자연수 가운데 가장 작은 수는?', k + 1, {
        figure: eq(show(a), '-', show(b), '<', box()),
        explain: `${told(a, '-', b)}이다. □는 ${res(parts)}보다 큰 자연수이므로 가장 작은 수는 ${k + 1}이다.`,
        facts: { digit: { template: `${o.num}<□*${o.den}`, lo: 1, hi: k + 4, ask: 'min' }, rule: 'natMin' }
      });
    }, { count: 2 })
  ]);

  // ── 분수의 덧셈과 뺄셈의 활용 ──
  B.addTypes('5-1-5', 'word', [
    T('word-join', '문장제: 두 양을 합치기', '①48 ②20·59 ③48 심38', (d) => {
      const [a, b] = two(d, ANY, less1), p = d.pick(NAMES);
      return word(`${name(p, '은/는')} 물을 오전에 ${show(a)} L, 오후에 ${show(b)} L 마셨다. ${name(p, '이/가')} 오전과 오후에 마신 물은 모두 몇 L인가?`, [a, '+', b], 'L', `오전에 마신 양과 오후에 마신 양을 더한다. ${told(a, '+', b)}`);
    }),
    T('word-pour', '문장제: 들어 있는 양에 더 붓기', '①48 ②59 ③48 심38', (d) => {
      const [f1, f2] = two(d, ANY, more1), a = W(f1, d.int(1, 5)), b = W(f2, d.int(1, 3));
      return word(`물이 ${show(a)} L 들어 있는 물통에 물을 ${show(b)} L 더 부었다. 물통에 들어 있는 물은 모두 몇 L인가?`, [a, '+', b], 'L', `들어 있던 양에 더 부은 양을 더한다. ${told(a, '+', b)}`);
    }),
    T('word-first', '문장제: 쓴 양과 남은 양으로 처음 양 구하기', '①48', (d) => {
      const [a, b] = two(d, ANY, more1);
      return word(`철사를 ${show(a)} m 사용하였더니 ${show(b)} m가 남았다. 처음에 있던 철사는 몇 m인가?`, [a, '+', b], 'm', `사용한 길이와 남은 길이를 더하면 처음 길이이다. ${told(a, '+', b)}`);
    }),
    T('word-part-join', '문장제: 전체의 얼마인지 더하기', '①48 심38', (d) => {
      const [a, b] = two(d, ANY, less1), [p, q] = d.shuffle(NAMES).slice(0, 2);
      return word(`떡 한 판을 ${name(p, '은/는')} 전체의 ${show(a)}만큼, ${name(q, '은/는')} 전체의 ${show(b)}만큼 먹었다. 두 사람이 먹은 떡은 전체의 얼마인가?`, [a, '+', b], '', `두 사람이 먹은 양은 같은 떡 한 판을 전체로 한 것이므로 그대로 더한다. ${told(a, '+', b)}`);
    }),
    T('word-more', '문장제: 더 많은 쪽의 양 구하기', '①49 ②64 심38', (d) => {
      const [f1, f2] = two(d, ANY, more1), a = W(f1, d.int(1, 4)), [p, q] = d.shuffle(NAMES).slice(0, 2);
      return word(`${nick(p)}의 가방의 무게는 ${show(a)} kg이고, ${nick(q)}의 가방은 ${nick(p)}의 가방보다 ${show(f2)} kg 더 무겁다. ${nick(q)}의 가방의 무게는 몇 kg인가?`, [a, '+', f2], 'kg', `${nick(p)}의 가방의 무게에 더 무거운 만큼을 더한다. ${told(a, '+', f2)}`);
    }),
    T('word-less', '문장제: 더 적은 쪽의 양 구하기', '①49 ②64', (d) => {
      const [a, b] = two(d, ANY, bigger), p = d.pick(NAMES);
      return word(`${name(p, '은/는')} 어제 책을 ${show(a)}시간 동안 읽었고, 오늘은 어제보다 ${show(b)}시간 적게 읽었다. ${name(p, '이/가')} 오늘 책을 읽은 시간은 몇 시간인가?`, [a, '-', b], '시간', `어제 읽은 시간에서 적게 읽은 만큼을 뺀다. ${told(a, '-', b)}`);
    }),
    T('word-left', '문장제: 남은 양(진분수)', '①50 ②60 ③49 심39', (d) => {
      const [a, b] = two(d, ANY, bigger);
      return word(`찰흙 ${show(a)} kg 가운데 ${show(b)} kg을 사용하였다. 남은 찰흙은 몇 kg인가?`, [a, '-', b], 'kg', `처음 양에서 사용한 양을 뺀다. ${told(a, '-', b)}`);
    }),
    T('word-left-borrow', '문장제: 남은 양(받아내림)', '①50 ②60 ③49 심39', (d) => {
      const [f1, f2] = two(d, ANY, smaller), w2 = d.int(1, 4), a = W(f1, w2 + d.int(2, 5)), b = W(f2, w2);
      return word(`길이가 ${show(a)} m인 끈에서 ${show(b)} m를 잘라 사용하였다. 남은 끈의 길이는 몇 m인가?`, [a, '-', b], 'm', `처음 길이에서 사용한 길이를 뺀다. ${told(a, '-', b)}`);
    }),
    T('word-diff', '문장제: 두 양의 차', '①51 ②62 ③50 심40', (d) => {
      // 더 큰 쪽이 뒤에 나온다.
      const [f1, f2] = two(d, ANY, bigger), w = d.int(1, 4), a = W(f1, w), b = W(f2, w + 1), [p, q] = d.shuffle(NAMES).slice(0, 2);
      return word(`${name(p, '은/는')} 리본을 ${show(a)} m, ${name(q, '은/는')} ${show(b)} m 가지고 있다. ${name(q, '은/는')} ${nick(p)}보다 리본을 몇 m 더 많이 가지고 있는가?`, [b, '-', a], 'm', `${nick(q)}의 리본의 길이에서 ${nick(p)}의 리본의 길이를 뺀다. ${told(b, '-', a)}`);
    }),
    T('word-who-more', '문장제: 누가 얼마나 더', '①52 ②63 ③51 심40', (d) => {
      // 틀린 양: 두 양을 더한 값
      const [a, b] = two(d, ANY, (p, q) => Math.abs(fgap(p, q)) * 3 <= p.d * q.d), [p, q] = d.shuffle(NAMES).slice(0, 2), who = [p, q], rows = [[a], [b]], vs = scaledValues(rows);
      const winner = vs[0] > vs[1] ? 0 : 1, gap = Math.abs(vs[0] - vs[1]), sum = vs[0] + vs[1], [hi, lo] = winner === 0 ? [a, b] : [b, a];
      const options = d.shuffle([[winner, gap], [1 - winner, gap], [winner, sum], [1 - winner, sum]]), text = (n) => (n === gap ? res([hi, '-', lo]) : res([a, '+', b]));
      return C(`주스를 ${name(p, '은/는')} ${show(a)} L, ${name(q, '은/는')} ${show(b)} L 마셨다. 누가 주스를 몇 L 더 많이 마셨는가?`, options.map(([i, n]) => `${who[i]}, ${text(n)} L`), options.findIndex(([i, n]) => i === winner && n === gap), {
        explain: `통분하여 비교하면 ${show(hi)} ${GT} ${show(lo)}이다. ${told(hi, '-', lo)}이므로 ${name(who[winner], '이/가')} ${res([hi, '-', lo])} L 더 많이 마셨다.`,
        facts: { who: { values: vs, options, exprs: scaled(rows) } }
      });
    }),
    T('word-box', '문장제: 그릇째 잰 무게에서 그릇의 무게 빼기', '①53 ②67 ③52 심39', (d) => {
      const [f1, f2] = two(d, ANY), a = W(f1, d.int(2, 6));
      return word(`감자가 담긴 바구니의 무게는 ${show(a)} kg이고, 빈 바구니의 무게는 ${show(f2)} kg이다. 감자만의 무게는 몇 kg인가?`, [a, '-', f2], 'kg', `바구니째 잰 무게에서 빈 바구니의 무게를 뺀다. ${told(a, '-', f2)}`);
    }),
    T('word-used', '문장제: 처음 양과 남은 양으로 쓴 양 구하기', '①53 ②61 ③52 심39', (d) => {
      const [f1, f2] = two(d, ANY, bigger), w2 = d.int(1, 3), a = W(f1, w2 + d.int(1, 4)), b = W(f2, w2);
      return word(`쌀이 ${show(a)} kg 있었다. 얼마만큼을 먹었더니 ${show(b)} kg이 남았다. 먹은 쌀은 몇 kg인가?`, [a, '-', b], 'kg', `처음 양에서 남은 양을 빼면 먹은 양이다. ${told(a, '-', b)}`);
    }),
    T('word-need', '문장제: 더 필요한 양', '①54 ②70 ③52 심39', (d) => {
      const [f1, f2] = two(d, ANY, smaller), w2 = d.int(1, 4), a = W(f1, w2 + d.int(2, 5)), b = W(f2, w2);
      return word(`들이가 ${show(a)} L인 물통에 물이 ${show(b)} L 들어 있다. 물통을 가득 채우려면 물을 몇 L 더 부어야 하는가?`, [a, '-', b], 'L', `물통의 들이에서 들어 있는 물의 양을 뺀다. ${told(a, '-', b)}`);
    }),
    T('word-route-sum', '문장제: 한 곳을 지나서 간 거리', '①55 ②71·73 ③53', (d) => {
      const [f1, f2] = two(d, ANY, more1), a = W(f1, d.int(1, 3)), b = W(f2, d.int(1, 3));
      return word(`집에서 공원까지의 거리는 ${show(a)} km이고, 공원에서 도서관까지의 거리는 ${show(b)} km이다. 집에서 공원을 지나 도서관까지 가는 거리는 몇 km인가?`, [a, '+', b], 'km', `두 구간의 거리를 더한다. ${told(a, '+', b)}`, { figure: route([['집', 0, 50], ['공원', 55, 50], ['도서관', 100, 50]], [[0, 1], [1, 2]], 40) });
    }),
    T('word-route-part', '문장제: 길 위의 한 구간', '①55 ②73·74 ③53 심60', (d) => {
      const [f1, f2] = two(d, ANY), b = W(f2, d.int(1, 2)), a = W(f1, b.w + d.int(1, 3));
      return word(`학교에서 우체국을 지나 병원까지 가는 거리는 ${show(a)} km이고, 학교에서 우체국까지의 거리는 ${show(b)} km이다. 우체국에서 병원까지의 거리는 몇 km인가?`, [a, '-', b], 'km', `전체 거리에서 학교에서 우체국까지의 거리를 뺀다. ${told(a, '-', b)}`, { figure: route([['학교', 0, 50], ['우체국', 45, 50], ['병원', 100, 50]], [[0, 1], [1, 2]], 40) });
    }),
    T('word-limit', '문장제: 합을 기준과 견주어 고르기', '①48 심41', (d) => {
      // 자연수 부분의 합은 기준보다 1 작다. 분수 부분의 합이 1보다 큰지에 따라 답이 갈린다.
      const Nn = d.int(3, 6), over1 = d.bool(), [f1, f2] = two(d, SMALL, over1 ? more1 : less1), w1 = d.int(1, Nn - 2), a = W(f1, w1), b = W(f2, Nn - 1 - w1), p = d.pick(NAMES), parts = [a, '+', b], o = over(parts);
      return C(`${name(p, '은/는')} 집에서 서점을 지나 도서관까지 가려고 한다. 집에서 서점까지의 거리는 ${show(a)} km, 서점에서 도서관까지의 거리는 ${show(b)} km이다. 가는 거리가 ${Nn} km보다 멀면 버스를 타고, ${Nn} km보다 가까우면 걸어서 가기로 하였다. ${name(p, '은/는')} 어떻게 가는가?`, ['버스를 타고 간다.', '걸어서 간다.'], over1 ? 0 : 1, {
        explain: `${told(a, '+', b)}이다. ${res(parts)} km는 ${Nn} km보다 ${over1 ? '멀므로 버스를 타고' : '가까우므로 걸어서'} 간다.`,
        facts: { choose: { exprs: [o.num, `${Nn}*${o.den}`], rule: 'max' } }
      });
    }),
    T('word-three', '문장제: 세 양의 합', '①57 심42', (d) => {
      const [a, b, c] = d.until(() => fracsOf(d, d.shuffle(d.pick(TRIPLES))), (list) => calc([list[0], '+', list[1], '+', list[2]]).q !== 1 && calc([list[0], '+', list[1]]).q !== 1), [p, q, r] = d.shuffle(NAMES).slice(0, 3), parts = [a, '+', b, '+', c];
      return word(`끈을 ${name(p, '은/는')} ${show(a)} m, ${name(q, '은/는')} ${show(b)} m, ${name(r, '은/는')} ${show(c)} m 가지고 있다. 세 사람이 가지고 있는 끈은 모두 몇 m인가?`, parts, 'm', `앞에서부터 차례로 더한다. ${told3(parts)}`);
    })
  ]);

  // ── 실력 ──
  B.addGroup('5-1-5', {
    id: 'hard', title: '단원 종합', standard: STD,
    types: [
      // ── ① 문제의 상황·그림·수에 함정이 있어 뜻을 정확히 대야 풀리는 문제 ──
      H('hard-count-cells', '나눈 칸 수가 다른 두 띠에 색칠한 부분의 합', '심3 / 기본 ①3 ②1 ③1', (d) => {
        // 함정: 통분한 모양(점선)을 그려 주지 않았다. 색칠한 칸 수와 전체 칸 수를 세어 (분자의 합)/(분모의 합)이라고 답하는 아이가 걸린다.
        const [a, b] = two(d, [[2, 3], [3, 4], [2, 5], [4, 6], [3, 5], [4, 5], [5, 6], [3, 8], [6, 8], [4, 10], [6, 9], [3, 7]], less1);
        return ans('길이가 같은 두 띠를 각각 똑같이 나누어 색칠하였다. 색칠한 부분을 모두 합하면 띠 하나의 얼마인가?', [a, '+', b], {
          figure: lines([band(a.d, a.n), band(b.d, b.n)]),
          explain: `색칠한 부분은 띠 하나의 ${show(a)}, ${show(b)}이다. 두 띠는 한 칸의 크기가 다르므로 칸 수를 그대로 더할 수 없고, 통분하여 한 칸의 크기를 같게 해야 한다. ${told(a, '+', b)}`
        });
      }),
      H('hard-lines-diff', '눈금의 수가 다른 두 수직선에서 읽은 수의 차', '기본 ①55 ③4', (d) => {
        // 함정: 화살표까지의 눈금 수가 더 많은 쪽이 더 작은 수이다. 눈금 수(분자)만 보고 큰 수를 정하거나 눈금 수끼리 빼는 아이가 걸린다.
        const [a, b] = two(d, ANY.filter(([x, y]) => y <= 12), (p, q) => p.n > q.n && smaller(p, q) && Math.abs(fgap(p, q)) * 4 <= p.d * q.d);
        return ans('길이가 같은 두 수직선에서 화살표 ㉠과 ㉡이 가리키는 두 수의 차는?', [b, '-', a], {
          figure: twinLines([[a.d, a.n, LAB[0]], [b.d, b.n, LAB[1]]]),
          explain: `㉠은 ${show(a)}, ㉡은 ${show(b)}이다. 두 수직선은 눈금 한 칸의 크기가 다르므로 통분하여 비교하면 ${vj(b, '이/가')} 더 크다. ${told(b, '-', a)}`
        });
      }),
      H('hard-borrow-count', '분자만 보아서는 알 수 없는 받아내림', '심14 / 기본 ①12 ②13', (d) => {
        // 함정: 분자끼리만 비교하는 아이. 분자는 작지만 통분하면 더 큰 분수(받아내림 없음)와 분자는 크지만 통분하면 더 작은 분수(받아내림)를 섞어,
        //  분자만 보고 센 개수와 통분하여 센 개수가 다르게 하였다.
        const KIND = { both: (p, q) => p.n < q.n && smaller(p, q), looksSmall: (p, q) => p.n < q.n && bigger(p, q), looksBig: (p, q) => p.n > q.n && smaller(p, q), none: (p, q) => p.n > q.n && bigger(p, q) };
        const plan = d.pick([['both', 'looksSmall', 'looksSmall', 'looksBig'], ['looksSmall', 'looksBig', 'looksBig', 'none'], ['both', 'looksSmall', 'looksBig', 'looksBig'], ['looksSmall', 'looksSmall', 'looksBig', 'none']]);
        const rows = d.until(() => d.shuffle(plan).map((k) => { const [f1, f2] = two(d, SMALL, KIND[k]), w2 = d.int(1, 4); return { a: W(f1, w2 + d.int(1, 4)), b: W(f2, w2), borrow: k === 'both' || k === 'looksBig' }; }), (list) => new Set(list.map((r) => key(r.a) + key(r.b))).size === 4);
        const flags = rows.map((r) => r.borrow), hits = rows.map((r, i) => (r.borrow ? LAB[i] : '')).filter(Boolean);
        return N('대분수의 뺄셈 가운데 통분한 분수 부분끼리 뺄 수 없어서 자연수에서 1만큼을 받아내림해야 하는 것은 모두 몇 개인가?', hits.length, {
          unit: '개', figure: tagged(rows.map((r) => eq(show(r.a), '-', show(r.b)))),
          explain: `분자의 크기만 보아서는 알 수 없으므로 분수 부분을 통분하여 비교한다. ${rows.map((r, i) => { const L = lcm(r.a.d, r.b.d); return `${LAB[i]} ${frac(numer(r.a, L), L)} ${r.borrow ? LT : GT} ${frac(numer(r.b, L), L)}`; }).join(', ')}이다. 빼는 수의 분수 부분이 더 큰 ${hits.join(', ')}에서 받아내림해야 한다.`,
          facts: { count: flags }
        });
      }),
      H('hard-reverse-more', '「더 무겁다」가 뺄셈이 되는 문장', '기본 ①49 ②64', (d) => {
        // 함정: 「~보다 더 무겁다(가볍다)」의 임자가 구하려는 쪽이 아니다. 낱말만 보고 더하는(빼는) 아이가 걸린다.
        const heavier = d.bool(), [f1, f2] = two(d, ANY, heavier ? smaller : more1), a = W(f1, d.int(2, 5)), [p, q] = d.shuffle(NAMES).slice(0, 2), parts = heavier ? [a, '-', f2] : [a, '+', f2];
        return word(`${nick(p)}의 가방의 무게는 ${show(a)} kg이다. ${nick(p)}의 가방은 ${nick(q)}의 가방보다 ${show(f2)} kg 더 ${heavier ? '무겁다' : '가볍다'}. ${nick(q)}의 가방의 무게는 몇 kg인가?`, parts, 'kg',
          `${nick(p)}의 가방이 ${show(f2)} kg 더 ${heavier ? '무거우므로' : '가벼우므로'} ${nick(q)}의 가방은 ${nick(p)}의 가방보다 ${show(f2)} kg ${heavier ? '가볍다' : '무겁다'}. ${told(parts[0], parts[1], parts[2])}`);
      }),
      H('hard-most-used', '남은 양으로 가장 많이 쓴 양 구하기', '기본 ②79', (d) => {
        // 함정: 가장 많이 남은 것을 가장 많이 쓴 것으로 읽는 아이. 가장 적게 남은 것이 가장 많이 쓴 것이다.
        const total = d.pick([V(0, 3, 4), V(0, 4, 5), V(0, 5, 6), V(0, 7, 8), V(0, 9, 10)]), small = PROPER.filter((v) => v.d <= 8 && v.d !== total.d && cmp(val(v), val(total)) < 0);
        const rest = d.until(() => d.shuffle(small).slice(0, 3), (vs) => new Set(vs.map((v) => v.d)).size === 3 && vs.every((p, i) => vs.every((q, j) => i === j || Math.abs(fgap(p, q)) * 8 >= p.d * q.d)));
        const least = rest.reduce((m, v) => (smaller(v, m) ? v : m), rest[0]), colors = ['빨간색', '노란색', '파란색'];
        return word(`빨간색, 노란색, 파란색 페인트를 ${show(total)} L씩 준비하여 벽을 칠하였더니 빨간색은 ${show(rest[0])} L, 노란색은 ${show(rest[1])} L, 파란색은 ${show(rest[2])} L 남았다. 가장 많이 사용한 색의 페인트는 몇 L를 사용하였는가?`, [total, '-', least], 'L',
          `처음 양이 같으므로 가장 적게 남은 ${colors[rest.indexOf(least)]} 페인트를 가장 많이 사용하였다. ${told(total, '-', least)}`);
      }),
      H('hard-whole-trap', '전체가 다른 두 분수의 합', '심38 / 기본 ①48', (d) => {
        // 보기마다 고르는 아이 — 「큰 떡의 (합)이다」: 전체가 달라도 분수끼리 더하면 된다고 여기는 아이, 「작은 떡의 (합)이다」: 전체를 아무 쪽으로나 잡는 아이,
        //  「큰 떡의 (합)보다 많다」: 두 떡을 합쳤으니 더 많다고 여기는 아이. 작은 떡의 1/3 은 큰 떡의 1/3 보다 적다는 것을 대야 풀린다.
        const [a, b] = two(d, [[2, 3], [2, 4], [3, 4], [2, 5], [3, 5], [4, 5], [3, 6], [2, 6]], less1), [p, q] = d.shuffle(NAMES).slice(0, 2), s = res([a, '+', b]), sn = calc([a, '+', b]).p;
        const rows = d.shuffle([[`큰 떡의 ${s}보다 적다.`, true], [`큰 떡의 ${s}${tail(sn, '과/와')} 같다.`, false], [`큰 떡의 ${s}보다 많다.`, false], [`작은 떡의 ${s}${tail(sn, '과/와')} 같다.`, false]]);
        return C(`크기가 다른 두 떡이 있다. ${name(p, '은/는')} 큰 떡의 ${show(a)}만큼, ${name(q, '은/는')} 작은 떡의 ${show(b)}만큼 먹었다. 두 사람이 먹은 떡을 합한 양은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
          explain: `${show(a)} + ${show(b)} = ${s}${tail(sn, '은/는')} 두 분수의 전체가 같을 때의 합이다. 작은 떡의 ${show(b)}${tail(b.n, '은/는')} 큰 떡의 ${show(b)}보다 적으므로, 두 사람이 먹은 양은 큰 떡의 ${s}보다 적다.`,
          facts: { truth: rows.map((row) => row[1]), want: true }
        });
      }),

      // ── ② 두 번 넘게 생각해야 풀리는 문제 ──
      H('hard-any-wrong', '잘못 계산한 것을 바르게 계산하기', '심62 / 기본 ①41 ②49 ③36', (d, n) => {
        // 문항마다 얼개가 다르다: 뺄 것을 더함, 더할 것을 뺌, 어떤 수가 빼는 수 자리에 있음.
        // 2 × (분모가 짝수인 분수)가 자연수와 얽혀 답이 자연수가 되는 수는 거른다.
        const whole = (parts) => calc(parts).q === 1 || calc(parts).p <= 0;
        if (n === 0) {
          const [a, r] = d.until(() => { const [f1, f2] = two(d, SMALL), p = W(f1, d.int(1, 2)); return [p, W(f2, p.w * 2 + d.int(2, 4))]; }, ([p, q]) => !whole([q, '-', p, '-', p]) && !whole([q, '-', p])), x = toV(calc([r, '-', a]));
          return ans(`어떤 수에서 ${vj(a, '을/를')} 빼야 할 것을 잘못하여 더했더니 ${vj(r, '이/가')} 되었다. 바르게 계산한 값은?`, [r, '-', a, '-', a], { explain: `어떤 수는 ${told(r, '-', a)}이다. 바르게 계산하면 ${told(x, '-', a)}이다.`, facts: { rule: 'wrongAdded' } });
        }
        if (n === 1) {
          const [a, r] = d.until(() => { const [f1, f2] = two(d, SMALL); return [W(f1, d.int(1, 2)), W(f2, d.int(1, 4))]; }, ([p, q]) => !whole([q, '+', p, '+', p]) && !whole([q, '+', p])), x = toV(calc([r, '+', a]));
          return ans(`어떤 수에 ${vj(a, '을/를')} 더해야 할 것을 잘못하여 뺐더니 ${vj(r, '이/가')} 되었다. 바르게 계산한 값은?`, [r, '+', a, '+', a], { explain: `어떤 수는 ${told(r, '+', a)}이다. 바르게 계산하면 ${told(x, '+', a)}이다.`, facts: { rule: 'wrongTaken' } });
        }
        const [a, x0] = d.until(() => { const [f1, f2] = two(d, SMALL), p = W(f1, d.int(3, 6)); return [p, W(f2, d.int(1, p.w - 2))]; }, ([p, q]) => !whole([p, '+', q]) && !whole([p, '-', q]) && toV(calc([p, '+', q])).d !== p.d), r = toV(calc([a, '+', x0])), x = toV(calc([r, '-', a]));
        return ans(`${show(a)}에서 어떤 수를 빼야 할 것을 잘못하여 더했더니 ${vj(r, '이/가')} 되었다. 바르게 계산한 값은?`, [a, '+', a, '-', r], { explain: `어떤 수는 ${told(r, '-', a)}이다. 바르게 계산하면 ${told(a, '-', x)}이다.`, facts: { rule: 'wrongFrom' } });
      }, { count: 3 }),
      H('hard-balance', '양쪽의 계산 결과가 같은 식의 □', '심26 / 기본 ①37 ②50 ③34', (d) => {
        const parts = d.until(() => { const [x, y, z] = d.shuffle(d.pick(TRIPLES)), c = V(d.int(1, 2), coTop(d, z), z), b = V(d.int(1, 3), coTop(d, y), y); return [V(b.w + c.w + d.int(1, 3), coTop(d, x), x), '-', b, '-', c]; }, (p) => calc(p).p > 0 && calc(p).q !== 1 && calc([p[0], '-', p[2]]).q !== 1);
        const [a, , b, , c] = parts, left = toV(calc([a, '-', b]));
        return ans('□ 안에 알맞은 수는?', parts, { figure: eq(show(a), '-', show(b), '=', show(c), '+', box()), explain: `왼쪽을 먼저 계산하면 ${told(a, '-', b)}이다. □는 ${show(left)}에서 ${vj(c, '을/를')} 뺀 수이므로 ${told(left, '-', c)}이다.`, facts: { rule: 'boxBalance' } });
      }),
      H('hard-chain-back', '차례로 계산한 결과에서 처음 수 구하기', '심28 / 기본 ②51', (d) => {
        // ㉠에 a 를 더하고(빼고) b 를 빼어(더하여) r 이 되었다. 거꾸로 두 번 계산한다.
        const [op1, op2] = d.pick([['+', '-'], ['-', '+'], ['+', '+']]), inv = (op) => (op === '+' ? '-' : '+');
        const made = d.until(() => { const [x, y, z] = d.shuffle(d.pick(TRIPLES)), a = V(d.int(0, 1), coTop(d, x), x), b = V(d.int(0, 1), coTop(d, y), y), r = V(d.int(2, 5), coTop(d, z), z); return { a, b, r, parts: [r, inv(op2), b, inv(op1), a] }; }, (m) => calc(m.parts).p > 0 && calc(m.parts).q !== 1 && calc(m.parts.slice(0, 3)).q !== 1 && calc(m.parts.slice(0, 3)).p > 0);
        const { a, b, r, parts } = made, mid = toV(calc(parts.slice(0, 3)));
        return ans('차례로 계산한 것이다. ㉠에 알맞은 수는?', parts, {
          figure: flow([box(LAB[0]), { step: `${SG[op1]} ${show(a)}` }, box(), { step: `${SG[op2]} ${show(b)}` }, show(r)]),
          explain: `거꾸로 계산한다. 가운데 수는 ${told(r, inv(op2), b)}이고, ㉠은 ${told(mid, inv(op1), a)}이다.`
        });
      }),
      H('hard-box-regroup', '분모가 달라 다시 통분해야 하는 □의 범위', '기본 ①38 ③37', (d) => {
        // □가 든 분수의 분모가 계산 결과의 분모와 달라 한 번 더 통분해야 한다.
        const made = d.until(() => { const [a, b] = two(d, SMALL, bigger), q = d.pick([5, 6, 7, 8, 9, 10, 12]), v = calc([a, '-', b]); return { a, b, q, v, count: Math.ceil(v.p * q / v.q) - 1 }; }, (m) => m.count >= 2 && m.q % m.v.q !== 0 && m.v.q % m.q !== 0 && m.q !== m.a.d && m.q !== m.b.d);
        const { a, b, q, v, count } = made, L = lcm(v.q, q);
        return N('□ 안에 들어갈 수 있는 자연수는 모두 몇 개인가?', count, {
          unit: '개', figure: eq(frac(box(), q), '<', show(a), '-', show(b)),
          explain: `${told(a, '-', b)}이다. 분모가 ${L}${tail(L, '이/가')} 되도록 통분하면 ${frac(`□ × ${L / q}`, L)} ${LT} ${frac(v.p * L / v.q, L)}이므로 □ 안에는 1부터 ${count}까지의 자연수가 들어갈 수 있다.`,
          facts: { digit: { template: `□*${a.d}*${b.d}<(${a.n}*${b.d}-${b.n}*${a.d})*${q}`, lo: 1, hi: q, ask: 'count' }, rule: 'regroupCount' }
        });
      }),
      H('hard-between-nat', '두 계산 결과 사이에 있는 자연수', '심32 / 기본 ①39 ②53', (d) => {
        const made = d.until(() => { const lo = expr2(d, 'm-', SMALL), hi = expr2(d, 'm+', SMALL), vl = calc(lo), vh = calc(hi); return { lo, hi, from: Math.floor(vl.p / vl.q) + 1, to: Math.floor(vh.p / vh.q) }; }, (m) => m.to - m.from >= 1 && m.to - m.from <= 4 && !shares(m.lo, m.hi));
        const { lo, hi, from, to } = made, ol = over(lo), oh = over(hi), list = Array.from({ length: to - from + 1 }, (_, i) => from + i);
        return N('두 식을 모두 만족하는 자연수 □는 모두 몇 개인가?', list.length, {
          unit: '개', figure: lines([eq(...lo.map((p) => (typeof p === 'string' ? p : show(p))), '<', box()), eq(box(), '<', ...hi.map((p) => (typeof p === 'string' ? p : show(p))))]),
          explain: `${say(lo)} = ${res(lo)}, ${say(hi)} = ${res(hi)}이다. ${res(lo)}보다 크고 ${res(hi)}보다 작은 자연수는 ${list.join(', ')}${tail(list[list.length - 1], '으로/로')} ${list.length}개이다.`,
          facts: { digit: { template: `(${ol.num})*(${oh.den})<□*(${ol.den})*(${oh.den})<(${oh.num})*(${ol.den})`, lo: 1, hi: to + 3, ask: 'count' }, rule: 'betweenNat' }
        });
      }),
      H('hard-between-top', '두 계산 결과 사이에 있는 분수의 분자', '심32 / 기본 ①39 ③38', (d) => {
        // □가 든 분수의 분모는 두 식의 분모 넷의 공배수이다.
        const made = d.until(() => {
          const dens = d.shuffle(d.pick(FAMS)).slice(0, 4), fs = fracsOf(d, dens), L = dens.reduce((x, y) => lcm(x, y), 1);
          const lo = bigger(fs[0], fs[1]) ? [fs[0], '-', fs[1]] : [fs[1], '-', fs[0]], hi = [fs[2], '+', fs[3]], vl = calc(lo), vh = calc(hi);
          return { lo, hi, L, from: vl.p * L / vl.q + 1, to: vh.p * L / vh.q - 1 };
        }, (m) => m.to - m.from >= 1 && m.to - m.from <= 5 && m.L <= 30 && m.to < m.L);
        const { lo, hi, L, from, to } = made, ol = over(lo), oh = over(hi), list = Array.from({ length: to - from + 1 }, (_, i) => from + i);
        return N('두 식을 모두 만족하는 자연수 □는 모두 몇 개인가?', list.length, {
          unit: '개', figure: lines([eq(...lo.map((p) => (typeof p === 'string' ? p : show(p))), '<', frac(box(), L)), eq(frac(box(), L), '<', ...hi.map((p) => (typeof p === 'string' ? p : show(p))))]),
          explain: `분모가 ${L}${tail(L, '이/가')} 되도록 통분하여 계산하면 ${say(lo)} = ${frac(from - 1, L)}, ${say(hi)} = ${frac(to + 1, L)}이다. □는 ${from - 1}보다 크고 ${to + 1}보다 작은 ${list.join(', ')}${tail(list[list.length - 1], '으로/로')} ${list.length}개이다.`,
          facts: { digit: { template: `(${ol.num})*${L}*(${oh.den})<□*(${ol.den})*(${oh.den})<(${oh.num})*${L}*(${ol.den})`, lo: 1, hi: L, ask: 'count' }, rule: 'betweenTop' }
        });
      }),
      H('hard-box-sub', '빼는 수의 분자에 □가 있는 크기 비교', '기본 ①38', (d) => {
        // 자연수 부분의 차와 같은 수와 비교하므로, 빼는 수의 분수 부분이 빼지는 수의 분수 부분보다 작아야 한다(분모가 달라 통분하여 비교한다).
        const made = d.until(() => { const [f, g] = two(d, SMALL), w2 = d.int(1, 4), a = W(f, w2 + d.int(1, 3)), q = g.d; return { a, w2, q, top: Math.ceil(a.n * q / a.d) - 1 }; }, (m) => m.top >= 2 && m.top <= m.q - 2 && (m.a.n * m.q) % m.a.d !== 0);
        const { a, w2, q, top: best } = made, k = a.w - w2, L = lcm(a.d, q);
        return N('□ 안에 들어갈 수 있는 자연수 가운데 가장 큰 수는?', best, {
          figure: eq(show(a), '-', mixed(w2, box(), q), '>', k),
          explain: `자연수 부분의 차가 ${k}이므로 계산 결과가 ${k}보다 크려면 ${frac('□', q)}가 ${show(V(0, a.n, a.d))}보다 작아야 한다. 분모가 ${L}${tail(L, '이/가')} 되도록 통분하면 ${frac(`□ × ${L / q}`, L)} ${LT} ${frac(numer(a, L), L)}이므로 가장 큰 수는 ${best}이다.`,
          facts: { digit: { template: `(${a.w}*${a.d}+${a.n})*${q}-(${w2}*${q}+□)*${a.d}>${k}*${a.d}*${q}`, lo: 1, hi: q - 1, ask: 'max' }, rule: 'boxSub' }
        });
      }),
      H('hard-three-place', '세 수를 넣어 계산 결과가 가장 큰 식 만들기', '심23', (d) => {
        const order = (vs) => vs.slice().sort((p, q) => cmp(val(q), val(p)));
        const list = d.until(() => { const dens = d.shuffle(d.pick(TRIPLES)); return dens.map((den) => V(d.int(1, 5), coTop(d, den), den)); }, (vs) => { const s = order(vs); return distinct(vs) && calc([s[0], '+', s[1], '-', s[2]]).q !== 1 && calc([s[0], '+', s[1]]).q !== 1; }), sorted = order(list);
        const parts = [sorted[0], '+', sorted[1], '-', sorted[2]];
        return ans('세 수를 한 번씩 모두 넣어 계산 결과가 가장 큰 식을 만들었다. 이 식의 계산 결과는?', parts, {
          figure: numbers(list.map(show)) + eq(box(), '+', box(), '-', box()),
          explain: `계산 결과가 가장 크려면 가장 작은 수 ${vj(sorted[2], '을/를')} 빼는 자리에 넣는다. ${told3(parts)}`
        });
      }),
      H('hard-cards-four', '수 카드 4장 가운데 3장으로 만든 대분수의 차', '심33 / 기본 ②57 ③45', (d) => {
        // 자연수 부분을 정한 다음, 남은 세 장으로 만드는 진분수 셋을 견주어 분수 부분을 정한다. 만들 수 있는 대분수를 모두 따져 답을 뽑는다.
        const made = d.until(() => {
          const digits = d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4).sort((x, y) => x - y), all = [];
          for (const w of digits) for (const n of digits) for (const den of digits) if (w !== n && w !== den && n < den) all.push(V(w, n, den));
          all.sort((p, q) => cmp(val(p), val(q)));
          return { digits, lo: all[0], next: all[1], hi: all[all.length - 1], prev: all[all.length - 2] };
        }, (m) => cmp(val(m.lo), val(m.next)) !== 0 && cmp(val(m.hi), val(m.prev)) !== 0 && gcd(m.lo.n, m.lo.d) === 1 && gcd(m.hi.n, m.hi.d) === 1 && m.lo.d !== m.hi.d);
        const { digits, lo, hi } = made, restOf = (v) => digits.filter((x) => x !== v.w);
        return ans('수 카드 4장 가운데 3장을 골라 한 번씩 사용하여 대분수를 만들려고 한다. 만들 수 있는 가장 큰 대분수와 가장 작은 대분수의 차는?', [hi, '-', lo], {
          figure: cards(d.shuffle(digits)),
          explain: `가장 큰 대분수의 자연수 부분은 ${hi.w}이고, 남은 ${restOf(hi).join(', ')}${tail(restOf(hi)[2], '으로/로')} 만든 진분수 가운데 가장 큰 수는 ${frac(hi.n, hi.d)}이다. 가장 작은 대분수의 자연수 부분은 ${lo.w}이고, 남은 ${restOf(lo).join(', ')}${tail(restOf(lo)[2], '으로/로')} 만든 진분수 가운데 가장 작은 수는 ${frac(lo.n, lo.d)}이다. ${told(hi, '-', lo)}`
        });
      }),
      H('hard-two-out', '문장제: 두 번 덜어 내기', '심46 / 기본 ①57 ③55', (d, n) => {
        // 첫째 문항은 대분수에서, 둘째 문항은 자연수에서 두 번 덜어 낸다.
        const parts = d.until(() => { const [x, y, z] = d.shuffle(d.pick(TRIPLES)), b = V(d.int(0, 1), coTop(d, y), y), c = V(d.int(0, 2), coTop(d, z), z), w = b.w + c.w + d.int(2, 4); return [n === 0 ? V(w, coTop(d, x), x) : V(w + 3, 0, 1), '-', b, '-', c]; }, (p) => calc(p).p > 0 && calc(p).q !== 1 && calc([p[0], '-', p[2]]).q !== 1 && (n === 0 || p[2].d !== p[4].d));
        const [a, , b, , c] = parts;
        return n === 0
          ? word(`우유 ${show(a)} L 가운데 어제 ${show(b)} L를 마시고, 오늘 ${show(c)} L를 마셨다. 남은 우유는 몇 L인가?`, parts, 'L', `처음 양에서 마신 양을 차례로 뺀다. ${told3(parts)}`, { facts: { rule: 'outMixed' } })
          : word(`쌀 ${show(a)} kg 가운데 지난주에 ${show(b)} kg을 먹고, 이번 주에 ${show(c)} kg을 먹었다. 남은 쌀은 몇 kg인가?`, parts, 'kg', `처음 양에서 먹은 양을 차례로 뺀다. ${told3(parts)}`, { facts: { rule: 'outNatural' } });
      }, { count: 2 }),
      H('hard-use-refill', '문장제: 쓰고 남은 것에 다시 채우기', '심46', (d) => {
        const parts = d.until(() => { const [x, y, z] = d.shuffle(d.pick(TRIPLES)), b = V(d.int(1, 2), coTop(d, y), y); return [V(b.w + d.int(1, 3), coTop(d, x), x), '-', b, '+', V(d.int(1, 2), coTop(d, z), z)]; }, (p) => calc(p).q !== 1 && calc([p[0], '-', p[2]]).q !== 1);
        const [a, , b, , c] = parts;
        return word(`물통에 물이 ${show(a)} L 들어 있었다. 이 가운데 ${show(b)} L를 사용한 다음 다시 ${show(c)} L를 채워 넣었다. 지금 물통에 들어 있는 물은 몇 L인가?`, parts, 'L', `사용한 양을 빼고 채워 넣은 양을 더한다. ${told3(parts)}`);
      }),
      H('hard-join-out', '문장제: 합친 뒤 덜어 내기', '심46', (d) => {
        const parts = d.until(() => { const [x, y, z] = d.shuffle(d.pick(TRIPLES)); return [V(d.int(0, 2), coTop(d, x), x), '+', V(d.int(0, 2), coTop(d, y), y), '-', V(0, coTop(d, z), z)]; }, (p) => calc(p).p > 0 && calc(p).q !== 1 && calc([p[0], '+', p[2]]).q !== 1 && cmp(calc([p[0], '+', p[2]]), val(p[4])) > 0);
        const [a, , b, , c] = parts;
        return word(`밀가루 ${show(a)} kg과 설탕 ${show(b)} kg을 섞은 다음 그 가운데 ${show(c)} kg을 사용하여 빵을 만들었다. 남은 것은 몇 kg인가?`, parts, 'kg', `섞은 양을 구한 다음 사용한 양을 뺀다. ${told3(parts)}`);
      }),
      H('hard-more-total', '문장제: 한쪽의 양을 구한 뒤 둘의 합 구하기', '심44 / 기본 ①49 ②65 ③56', (d, n) => {
        // 첫째 문항은 더 많은 쪽, 둘째 문항은 더 적은 쪽을 구한 뒤 둘을 합한다.
        const op = n === 0 ? '+' : '-', [a, f2] = d.until(() => { const [f1, g] = two(d, SMALL, n === 0 ? null : bigger); return [W(f1, d.int(1, 4)), g]; }, ([x, g]) => calc([x, '+', x, op, g]).q !== 1);
        const [p, q] = d.shuffle(NAMES).slice(0, 2), parts = [a, '+', a, op, f2], other = toV(calc([a, op, f2]));
        return word(`${name(p, '은/는')} 고구마를 ${show(a)} kg 캤고, ${name(q, '은/는')} ${nick(p)}보다 ${show(f2)} kg 더 ${n === 0 ? '많이' : '적게'} 캤다. 두 사람이 캔 고구마는 모두 몇 kg인가?`, parts, 'kg',
          `${name(q, '이/가')} 캔 고구마는 ${told(a, op, f2)}(kg)이다. 두 사람이 캔 고구마는 ${told(a, '+', other)}(kg)이다.`, { facts: { rule: n === 0 ? 'totalMore' : 'totalLess' } });
      }, { count: 2 }),
      H('hard-chain-amounts', '문장제: 차례로 더 많고 더 적은 양', '심45 / 기본 ②66', (d) => {
        const parts = d.until(() => { const [x, y, z] = d.shuffle(d.pick(TRIPLES)); return [V(d.int(1, 3), coTop(d, x), x), '+', V(d.int(0, 1), coTop(d, y), y), '-', V(d.int(0, 1), coTop(d, z), z)]; }, (p) => calc(p).p > 0 && calc(p).q !== 1 && calc([p[0], '+', p[2]]).q !== 1);
        const [a, , b, , c] = parts, milk = toV(calc([a, '+', b]));
        return word(`주스는 ${show(a)} L 있다. 우유는 주스보다 ${show(b)} L 더 많고, 물은 우유보다 ${show(c)} L 더 적다. 물은 몇 L 있는가?`, parts, 'L', `우유는 ${told(a, '+', b)}(L)이다. 물은 ${told(milk, '-', c)}(L)이다.`);
      }),
      H('hard-two-sums', '문장제: 두 사람의 합을 각각 구해 견주기', '심47 / 기본 ①56 ③57', (d) => {
        const rows = d.until(() => [expr2(d, 'p+', SMALL), expr2(d, 'p+', SMALL)], ([x, y]) => near(calc(x), calc(y), 5) && !shares(x, y)), [p, q] = d.shuffle(NAMES).slice(0, 2), [v1, v2] = rows.map(calc);
        return C(`운동을 ${name(p, '은/는')} 오전에 ${show(rows[0][0])}시간, 오후에 ${show(rows[0][2])}시간 하였고, ${name(q, '은/는')} 오전에 ${show(rows[1][0])}시간, 오후에 ${show(rows[1][2])}시간 하였다. 오전과 오후에 운동한 시간의 합이 더 긴 사람은?`, [p, '두 사람이 운동한 시간은 같다.', q], sgn(v1, v2), {
          explain: `${name(p, '은/는')} ${told(rows[0][0], '+', rows[0][2])}(시간), ${name(q, '은/는')} ${told(rows[1][0], '+', rows[1][2])}(시간) 운동하였다. ` + (cmp(v1, v2) === 0 ? '두 사람이 운동한 시간은 같다.' : `통분하여 비교하면 ${res(rows[0])} ${SGN(v1, v2)} ${res(rows[1])}이다.`),
          facts: { choose: { exprs: scaled(rows), rule: 'compare' }, rule: 'twoSums' }
        });
      }),
      H('hard-sum-vs-one', '문장제: 합친 양과 다른 한 양 견주기', '기본 ②80', (d) => {
        // 틀린 양: 오전에 마신 양만 견준 값
        const made = d.until(() => { const [x, y, z] = d.shuffle(d.pick(TRIPLES)), a1 = V(d.int(1, 2), coTop(d, x), x), a2 = V(d.int(0, 1), coTop(d, y), y), b = V(d.int(2, 4), coTop(d, z), z); return { a1, a2, b }; },
          (m) => { const s = calc([m.a1, '+', m.a2]), v = val(m.b); return cmp(s, v) !== 0 && near(s, v, 1) && cmp(val(m.a1), v) !== 0 && Math.abs(cmp(s, v)) * val(m.a1).q * v.q !== Math.abs(cmp(val(m.a1), v)) * s.q * v.q; });
        const { a1, a2, b } = made, [p, q] = d.shuffle(NAMES).slice(0, 2), who = [p, q], rows = [[a1, '+', a2], [b]], three = [[a1, '+', a2], [b], [a1]], K = scaledValues(three);
        // 세 값을 같은 공통분모로 맞춘 정수: [합, 다른 한 양, 오전의 양]
        const exprs = scaled(three).slice(0, 2), vs = K.slice(0, 2), winner = vs[0] > vs[1] ? 0 : 1, gap = Math.abs(vs[0] - vs[1]), wrong = Math.abs(K[2] - K[1]);
        const sumV = toV(calc(rows[0])), gapText = cmp(calc(rows[0]), val(b)) > 0 ? res([sumV, '-', b]) : res([b, '-', sumV]), wrongText = cmp(val(a1), val(b)) > 0 ? res([a1, '-', b]) : res([b, '-', a1]);
        const options = d.shuffle([[winner, gap], [1 - winner, gap], [winner, wrong], [1 - winner, wrong]]);
        return C(`${name(p, '은/는')} 물을 오전에 ${show(a1)}컵, 오후에 ${show(a2)}컵 마셨고, ${name(q, '은/는')} 하루 동안 ${show(b)}컵 마셨다. 누가 물을 몇 컵 더 많이 마셨는가?`, options.map(([i, n]) => `${who[i]}, ${n === gap ? gapText : wrongText}컵`), options.findIndex(([i, n]) => i === winner && n === gap), {
          explain: `${name(p, '이/가')} 마신 물은 ${told(a1, '+', a2)}(컵)이다. ${show(sumV)} ${SGN(calc(rows[0]), val(b))} ${show(b)}이므로 ${name(who[winner], '이/가')} ${gapText}컵 더 많이 마셨다.`,
          facts: { who: { values: vs, options, exprs } }
        });
      }),
      H('hard-detour', '문장제: 돌아가는 길과 바로 가는 길의 차', '심48 / 기본 ③63', (d) => {
        const parts = d.until(() => { const [x, y, z] = d.shuffle(d.pick(TRIPLES)); return [V(d.int(1, 2), coTop(d, x), x), '+', V(d.int(1, 2), coTop(d, y), y), '-', V(d.int(2, 3), coTop(d, z), z)]; },
          (p) => calc(p).p > 0 && calc(p).q !== 1 && calc([p[0], '+', p[2]]).q !== 1 && cmp(val(p[4]), val(p[0])) > 0 && cmp(val(p[4]), val(p[2])) > 0);
        const [a, , b, , c] = parts, sum = toV(calc([a, '+', b]));
        return word(`집에서 서점까지 바로 가는 길의 거리는 ${show(c)} km이다. 병원을 지나서 가면 집에서 병원까지 ${show(a)} km, 병원에서 서점까지 ${show(b)} km를 가야 한다. 병원을 지나서 가는 길은 바로 가는 길보다 몇 km 더 먼가?`, parts, 'km',
          `병원을 지나서 가는 길은 ${told(a, '+', b)}(km)이다. ${told(sum, '-', c)}`, { figure: route([['집', 0, 100], ['병원', 50, 0, false], ['서점', 100, 100]], [[0, 1], [1, 2], [0, 2]], 70) });
      }),
      H('hard-tape-two', '문장제: 두 장을 겹쳐 이어 붙인 전체 길이', '심55 / 기본 ①58 ②72 ③59', (d) => {
        const parts = d.until(() => { const [x, y, z] = d.shuffle(d.pick(TRIPLES)); return [V(d.int(1, 3), coTop(d, x), x), '+', V(d.int(1, 3), coTop(d, y), y), '-', V(0, coTop(d, z), z)]; }, (p) => calc(p).q !== 1 && calc([p[0], '+', p[2]]).q !== 1);
        const [a, , b, , c] = parts, sum = toV(calc([a, '+', b]));
        return word(`길이가 ${show(a)} m, ${show(b)} m인 색 테이프 2장을 ${show(c)} m만큼 겹치게 이어 붙였다. 이어 붙인 색 테이프의 전체 길이는 몇 m인가?`, parts, 'm',
          `두 장의 길이의 합은 ${told(a, '+', b)}(m)이다. 겹친 부분은 두 번 더해졌으므로 한 번 뺀다. ${told(sum, '-', c)}`, { figure: tapes('색 테이프', '색 테이프', '겹친 부분') });
      }),
      H('hard-seg-overlap', '문장제: 겹친 구간의 거리', '심56·59 / 기본 ③61', (d) => {
        // 한 길 위의 네 곳: 가~다, 나~라, 가~라의 거리로 나~다의 거리를 구한다(두 구간의 합에서 전체를 뺀다).
        const made = d.until(() => { const [x, y, z] = d.shuffle(d.pick(TRIPLES)), a = V(d.int(1, 3), coTop(d, x), x), b = V(d.int(1, 3), coTop(d, y), y), mid = V(0, coTop(d, z), z), t = toV(calc([a, '+', b, '-', mid])); return { a, b, mid, t }; },
          (m) => m.t.n !== 0 && m.t.d <= 40 && cmp(val(m.mid), val(m.a)) < 0 && cmp(val(m.mid), val(m.b)) < 0 && calc([m.a, '+', m.b]).q !== 1 && m.t.d !== m.a.d && m.t.d !== m.b.d);
        const { a, b, t } = made, parts = [a, '+', b, '-', t], sum = toV(calc([a, '+', b]));
        return word(`한 길 위에 학교, 서점, 공원, 병원이 차례로 있다. 학교에서 공원까지의 거리는 ${show(a)} km, 서점에서 병원까지의 거리는 ${show(b)} km, 학교에서 병원까지의 거리는 ${show(t)} km이다. 서점에서 공원까지의 거리는 몇 km인가?`, parts, 'km',
          `학교에서 공원까지와 서점에서 병원까지를 더하면 서점에서 공원까지가 두 번 들어간다. ${told(a, '+', b)}(km)에서 전체 거리를 빼면 ${told(sum, '-', t)}`, { figure: route([['학교', 0, 50], ['서점', 30, 50], ['공원', 62, 50], ['병원', 100, 50]], [[0, 1], [1, 2], [2, 3]], 40) });
      }),
      H('hard-half-empty', '문장제: 반을 덜어 낸 무게로 빈 그릇의 무게 구하기', '심63 / 기본 ①59 ②69 ③62', (d) => {
        const made = d.until(() => { const [f1, f2] = two(d, SMALL), a = W(f1, d.int(3, 7)), b = W(f2, d.int(2, a.w - 1)); return { a, b }; }, (m) => { const half = calc([m.a, '-', m.b]), empty = calc([m.b, '+', m.b, '-', m.a]); return half.p > 0 && empty.p > 0 && empty.q !== 1 && half.q !== 1 && cmp(empty, half) < 0; });
        const { a, b } = made, parts = [b, '+', b, '-', a], half = toV(calc([a, '-', b]));
        return word(`물이 가득 든 물통의 무게를 재었더니 ${show(a)} kg이었다. 물을 반만 따라 내고 다시 재었더니 ${show(b)} kg이었다. 빈 물통의 무게는 몇 kg인가?`, parts, 'kg',
          `따라 낸 물의 무게는 ${told(a, '-', b)}(kg)이고, 물통에 남은 물의 무게도 이와 같다. 빈 물통의 무게는 ${told(b, '-', half)}(kg)이다.`);
      }),
      H('hard-nearer-line', '문장제: 기준선에 더 가까운 쪽의 거리', '심16 / 기본 ②78', (d) => {
        // 한 사람은 선에 못 미치게, 한 사람은 선을 넘게 던졌다. 뺄셈을 두 번 하고 두 차를 통분하여 비교한다.
        const made = d.until(() => { const [x, y, z] = d.shuffle(d.pick(TRIPLES)), t = V(d.int(3, 6), coTop(d, x), x), a = V(t.w - 1, coTop(d, y), y), b = V(t.w + d.int(0, 1), coTop(d, z), z); return { t, a, b }; },
          (m) => { const g1 = calc([m.t, '-', m.a]), g2 = calc([m.b, '-', m.t]); return g1.p > 0 && g2.p > 0 && cmp(g1, g2) !== 0 && near(g1, g2, 3) && g1.q !== 1 && g2.q !== 1; });
        const { t, a, b } = made, [p, q] = d.shuffle(NAMES).slice(0, 2), g1 = calc([t, '-', a]), g2 = calc([b, '-', t]), first = cmp(g1, g2) < 0, parts = first ? [t, '-', a] : [b, '-', t];
        return word(`공 던지기 놀이에서 던지는 곳으로부터 ${show(t)} m 떨어진 곳에 선을 긋고, 공이 선에 더 가까이 떨어진 사람이 이기기로 하였다. ${nick(p)}의 공은 ${show(a)} m, ${nick(q)}의 공은 ${show(b)} m 날아가 떨어졌다. 이긴 사람의 공은 선에서 몇 m 떨어져 있는가?`, parts, 'm',
          `${nick(p)}의 공은 선에서 ${told(t, '-', a)}(m), ${nick(q)}의 공은 ${told(b, '-', t)}(m) 떨어져 있다. 통분하여 비교하면 ${show(toV(first ? g1 : g2))} ${LT} ${show(toV(first ? g2 : g1))}이므로 ${name(first ? p : q, '이/가')} 이겼다.`);
      }),
      H('hard-rest-part', '문장제: 전체에서 두 부분을 뺀 나머지', '심50 / 기본 ②81', (d) => {
        const [a, b] = two(d, ANY, less1), one = V(1, 0, 1), left = toV(calc([one, '-', a]));
        return word(`학급 문고의 책 가운데 동화책은 전체의 ${show(a)}, 과학책은 전체의 ${show(b)}이고, 나머지는 모두 위인전이다. 위인전은 전체의 얼마인가?`, [one, '-', a, '-', b], '',
          `전체를 1로 생각하여 두 부분을 차례로 뺀다. 1 − ${show(a)} = ${show(left)}, ${told(left, '-', b)}`, { facts: { unseen: [1] } });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
