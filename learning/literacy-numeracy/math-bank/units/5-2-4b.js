// 5학년 2학기 4단원 소수의 곱셈 — 어림하기, 잘못된 계산, 곱의 크기 비교와 조건에 맞는 수, 문장제, 도형, 실력 문항.
// 단원 틀과 싣는 기준, 뺀 것과 까닭은 5-2-4a.js 에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2, ③n = 기본꼴_3, 심n = 심화꼴.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 ①의 장치는 이 잘못을 가진 아이가 걸리게 만들었다)
//  - 곱하면 언제나 커진다고 여긴다. 1보다 작은 수를 곱하면 작아지고 1을 곱하면 그대로라는 것을 곱하는 수와 1의 크기로 가리지 못한다(0.99와 1.01, 순서가 바뀐 식).
//  - 곱의 소수점을 「두 수의 소수점 아래 자리 수의 합」으로만 외운다. 곱의 끝자리가 0이 되면 자리 수가 줄어드는데(0.25 × 0.4 = 0.1) 합 그대로라고 하고,
//    거꾸로 자연수의 곱에서 끝자리 0을 먼저 지운 다음 소수점을 찍는다(0.24 × 5 = 0.12).
//  - 한 수가 10배가 되면 곱도 10배가 된다는 것을 한 수씩만 본다: 두 수가 다 10배이면 곱은 100배이고, 한 수가 1/10배가 되었을 때 곱이 같으려면 다른 수는 10배가 되어야 한다.
//    10배와 0.01배가 이어지면 0.1배라는 것, 곱하는 수가 자연수 몇십·몇백일 때 소수점이 거꾸로 옮겨지는 것을 놓친다.
//  - 「~의 0.4만큼」에서 기준이 되는 양을 놓친다: 「0.4배만큼 더」를 0.4배로 읽고, 쓴 양을 구해 놓고 남은 양이라고 답하며, 전체가 다른 두 양을 배의 크기만으로 견준다.
//    문장에 수가 여럿 있으면 묻는 것과 상관없는 수까지 곱한다.
//  - 단위를 맞추지 않고 곱한다(1.5 m와 80 cm).
//  - 두 곱 사이의 자연수를 셀 때 곱이 꼭 자연수로 떨어지면 그 수까지 넣어 세고, 소수 둘째 자리까지 견주어야 하는데 첫째 자리만 본다.
//
// 실력에는 ① 문제의 상황·수에 함정이 있어 뜻을 정확히 대야 풀리는 문제와 ② 두 번 넘게 생각해야 풀리는 문제(두 곱 사이의 □, 어떤 수를 구해 바르게 계산하기,
// 잘못 누른 수 찾기, 곱한 뒤 더하거나 덜어 내기, 시간을 소수로 고쳐 곱한 뒤 다시 셈하기, 변을 바꾼 도형의 넓이, 수 카드로 가장 큰 곱 만들기)만 실었다.
// 기본에서 하는 곱셈 한 번을 고르기로 바꾼 것은 싣지 않았다.
// 문장제는 얼개마다 한 번씩 싣는다: 같은 양이 여러 개(소수 두 자리·두 자리 자연수·곱이 자연수), 날수 꺼내기, 자연수의 소수 배(1보다 작은 배·큰 배·곱이 자연수),
//   소수의 자연수 배, 소수의 소수 배, 「~의 0.□만큼」, 단위량, 거듭 곱하기, 세 수의 곱, 10·100·1000개, 0.01배, 30초를 0.5분으로, 다녀온 거리 /
//   (실력) 남은 양, 「~배만큼 더」, 전체가 다른 두 양, 쓰지 않는 수, 단위 섞임, 두 곱 견주기, 더하거나 뺀 뒤 곱하기, 적어도 몇 개, 처음 양, 양초, 몇 배인 것과의 차, 휘발유.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, nick, box, frac, lines, numbers, cards, N, M, C, D } = B.kit;
  const STD = '6수01-13';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  // 실력 문항. 기본 자료에서만 나온 꼴은 ref 를 '기본 ②52' 처럼 적는다.
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: ref.startsWith('기본 ') ? '수집본 기본 자료(' + ref.slice(3) + ')' : '수집본 심화 자료(' + ref + ')', make }, more || {});
  const LAB = ['㉠', '㉡', '㉢', '㉣'], THREE = LAB.slice(0, 3);
  const SIGNS = ['&gt;', '=', '&lt;'], GT = '&gt;', LT = '&lt;';
  const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  const SG = { '+': '+', '-': '−', '*': '×', '=': '=', '>': GT, '<': LT };
  const ex = (html) => '<span class="mb-expr">' + html + '</span>';
  const eq = (...parts) => ex(parts.map((p) => (SG[p] ? '<i>' + SG[p] + '</i>' : p)).join(' '));
  const tag = (label) => '<span class="mb-tag mb-tag-short">' + label + '</span>';
  const tagged = (list, tags) => lines(list.map((html, i) => tag((tags || LAB)[i]) + html));
  const versus = (left, right) => `<div class="mb-versus">${left}<span class="mb-ring"></span>${right}</div>`;
  const said = (who, text) => `${who}: 「${text}」`;

  // ── 수 하나(5-2-4a.js 와 같다) ──
  const P10 = [1, 10, 100, 1000, 10000, 100000, 1000000];
  const dec = (n, k) => { while (k > 0 && n % 10 === 0) { n /= 10; k -= 1; } return { n, k }; };
  const nat = (n) => ({ n, k: 0 });
  const fx = (n, k) => { const t = String(n).padStart(k + 1, '0'); return k ? t.slice(0, -k) + '.' + t.slice(-k) : t; };
  const S = (x) => fx(x.n, x.k);
  const V = (x) => x.n / P10[x.k];
  const mul = (...xs) => xs.slice(1).reduce((r, x) => dec(r.n * x.n, r.k + x.k), xs[0]);
  const places = (xs) => xs.reduce((s, x) => s + x.k, 0);
  const digits = (xs) => xs.reduce((m, x) => m * x.n, 1);
  const BATCHIM = [true, true, false, true, false, false, true, true, true, false], RIEUL = [false, true, false, false, false, false, false, true, true, false];
  const dj = (text, pair) => { const [yes, no] = pair.split('/'), k = Number(String(text).slice(-1)); return text + (yes === '으로' ? (BATCHIM[k] && !RIEUL[k] ? '으로' : '로') : BATCHIM[k] ? yes : no); };
  const J = (x, pair) => dj(S(x), pair);
  const part = (k) => frac(1, P10[k]);
  const NTH = ['', '한', '두', '세'];
  // 단위 기호 뒤 토씨(읽는 소리대로): m·cm·km·L·mL·m² 는 받침 없음, g·kg 은 받침 있음
  const uj = (unit, pair) => unit + pair.split('/')[/g$/.test(unit) ? 0 : 1];
  const nz = (d, lo, hi) => d.until(() => d.int(lo, hi), (v) => v % 10 !== 0);
  const one = (d, lo, hi) => ({ n: nz(d, lo, hi), k: 1 }), two = (d, lo, hi) => ({ n: nz(d, lo, hi), k: 2 }), three = (d, lo, hi) => ({ n: nz(d, lo, hi), k: 3 });
  const pair = (d, make, ok) => d.until(make, ([x, y]) => x.n * y.n < 100000 && x.k + y.k <= 3 && ok(x.n * y.n, x, y));
  const clean = (p) => p % 10 !== 0;
  const pick = (d, k) => d.shuffle(NAMES).slice(0, k);
  const key = (row) => row.map(S).join('×');
  const shares = (p, q) => p.some((x) => q.some((y) => S(x) === S(y)));

  // ── 검사가 다시 셈하는 식(5-2-4a.js 와 같다) ──
  const ix = (x) => { if (!x.k) return { s: String(x.n), un: [] }; const w = Math.floor(x.n / P10[x.k]), f = x.n % P10[x.k]; return { s: `(${w}*${P10[x.k]}+${f})`, un: [P10[x.k]].concat(f < P10[x.k - 1] ? [f] : []) }; };
  const px = (xs) => { const list = xs.map(ix); return { s: list.map((p) => p.s).join('*'), k: places(xs), un: list.reduce((all, p) => all.concat(p.un), []) }; };
  const scaled = (rows) => { const ps = rows.map(px), K = Math.max(...ps.map((p) => p.k)); return { K, exprs: ps.map((p) => (K > p.k ? `${p.s}*${P10[K - p.k]}` : p.s)), values: rows.map((row, i) => digits(row) * P10[K - ps[i].k]), un: ps.reduce((all, p) => all.concat(p.un, [P10[K - p.k]]), []) }; };
  const inp = (label, x, unit) => Object.assign({ label, answer: V(x) }, x.k ? { decimal: true } : {}, unit ? { unit } : {});
  function ans(text, xs, o) {
    const r = mul(...xs), more = o.facts || {};
    if ((r.k === 0) !== (o.kind === 'nat')) throw new Error('답의 꼴이 유형과 다르다');
    if (r.k) return D(text, V(r), { unit: o.unit, figure: o.figure, explain: o.explain, facts: Object.assign({}, more, { calc: [[xs.map(S).join('*'), 0]] }) });
    const p = px(xs);
    return N(text, r.n, { unit: o.unit, figure: o.figure, explain: o.explain, facts: Object.assign({}, more, { calc: [[p.k ? `${p.s}/${P10[p.k]}` : p.s, 0]], unseen: p.un.concat([P10[p.k]], more.unseen || []) }) });
  }
  const word = (text, xs, unit, explain, more) => ans(text, xs, Object.assign({ unit, explain }, more || {}));
  // 곱셈식과 결과: 2.5 × 1.7 = 4.25
  const told = (...xs) => `${xs.map(S).join(' × ')} = ${S(mul(...xs))}`;
  // 소수 답 하나(식을 글 그대로 적는다). value: { n, k }
  const dAns = (text, value, expr, o) => { if (!value.k || value.n <= 0) throw new Error('답이 소수가 아니다'); return D(text, V(value), Object.assign({}, o, { facts: Object.assign({ calc: [[expr, 0]] }, o.facts || {}) })); };
  // 덧셈·뺄셈: 소수점 아래 자리 수를 맞추어 셈한다.
  const plus = (x, y, sign) => { const K = Math.max(x.k, y.k); return dec(x.n * P10[K - x.k] + (sign || 1) * y.n * P10[K - y.k], K); };

  // ── 그림 ──
  const svg = (cls, w, h, label, body) => `<svg class="${cls}" style="vertical-align:middle" viewBox="0 0 ${w} ${h}" width="${Math.round(w)}" role="img" aria-label="${label}">${body}</svg>`;
  const DOT = '<span style="display:inline-block;width:0">.</span>';
  const cellsOf = (text) => String(text).match(/\d\.?/g);
  // 곱셈의 세로셈(표). 수는 끝자리를 맞추어 적는다. result 를 주면 결과 줄에 적는다.
  function mcol(a, b, result) {
    const rows = [cellsOf(a), cellsOf(b)].concat(result ? [cellsOf(result)] : []), width = Math.max(...rows.map((r) => r.length)), rule = 'border-bottom:2px solid #1f2933;';
    const tds = (list, style) => Array.from({ length: width - list.length }, () => '').concat(list).map((ch) => `<td${style ? ` style="${style}"` : ''}>${String(ch).endsWith('.') ? String(ch).slice(0, -1) + DOT : ch}</td>`).join('');
    return `<table class="mb-longdiv" role="img" aria-label="세로셈: ${a} × ${b}${result ? ` = ${result}` : ''}">`
      + `<tr><td style="min-width:1.3em"></td>${tds(rows[0])}</tr>`
      + `<tr><td style="min-width:1.3em;text-align:center;${rule}">×</td>${tds(rows[1], rule)}</tr>`
      + `<tr><td></td>${result ? tds(rows[2]) : `<td colspan="${width}" style="padding-top:5px"><span class="mb-box" style="min-width:${Math.max(2.6, width * 0.9)}em"></span></td>`}</tr></table>`;
  }
  // ㄱ자 모양 도형: 가로 W, 세로 Ht 인 직사각형의 오른쪽 위 귀퉁이를 잘라 낸 모양. 위쪽 변 a, 오른쪽 변 b 의 길이를 적는다(글은 모두 수와 단위).
  function notch(W, Ht, a, b, unit) {
    const u = 176 / V(W), left = 58, top = 22, w = V(W) * u, h = V(Ht) * u, aw = V(a) * u, bh = V(b) * u, word = 'style="font-size:13px;font-weight:600;fill:#1f2933"';
    const pts = [[left, top], [left + aw, top], [left + aw, top + h - bh], [left + w, top + h - bh], [left + w, top + h], [left, top + h]].map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ');
    const out = `<polygon points="${pts}" style="fill:#dbeafe;stroke:#1f2933;stroke-width:1.2"/>`
      + `<text ${word} x="${(left + aw / 2).toFixed(1)}" y="${top - 6}" text-anchor="middle">${S(a)} ${unit}</text>`
      + `<text ${word} x="${left - 5}" y="${(top + h / 2 + 4).toFixed(1)}" text-anchor="end">${S(Ht)} ${unit}</text>`
      + `<text ${word} x="${(left + w / 2).toFixed(1)}" y="${(top + h + 16).toFixed(1)}" text-anchor="middle">${S(W)} ${unit}</text>`
      + `<text ${word} x="${(left + w + 5).toFixed(1)}" y="${(top + h - bh / 2 + 4).toFixed(1)}" text-anchor="start">${S(b)} ${unit}</text>`;
    return svg('mb-pieces', Math.ceil(left + w + 52), Math.ceil(top + h + 24), `직사각형의 오른쪽 위 귀퉁이를 직사각형 모양으로 잘라 낸 도형. 아래쪽 변 ${S(W)} ${unit}, 왼쪽 변 ${S(Ht)} ${unit}, 위쪽 변 ${S(a)} ${unit}, 오른쪽 변 ${S(b)} ${unit}`, out);
  }
  const orderChoice = (d, values, labels, descending) => {
    const right = values.map((_, i) => i).sort((p, q) => (descending ? values[q] - values[p] : values[p] - values[q]));
    const list = d.shuffle(d.shuffle(ORDERS.filter((o) => o.join() !== right.join())).slice(0, 3).concat([right]));
    return { list, right, options: list.map((o) => o.map((i) => labels[i]).join(', ')), answer: list.findIndex((o) => o.join() === right.join()) };
  };

  // ── 값이 가까운 곱 만들기 ──
  // 값(100배 한 정수)이 v 에 가까운 곱 하나. form: 'n2' (자연수)×(소수 두 자리 수), 'n1' (자연수)×(소수 한 자리 수), '2n' (소수 두 자리 수)×(자연수), '1n' (소수 한 자리 수)×(자연수), '11' (소수 한 자리 수)끼리
  function near(d, v, form) {
    if (form === '11') { const a = nz(d, 12, 98); return [dec(a, 1), dec(Math.round(v / a), 1)]; }
    const c = d.int(2, 9), fine = form === 'n2' || form === '2n', other = dec(Math.round(v / (fine ? c : c * 10)), fine ? 2 : 1);
    return form === '2n' || form === '1n' ? [other, nat(c)] : [nat(c), other];
  }
  const cents = (row) => digits(row) * P10[2 - places(row)];
  const sound = (row) => row.every((x) => x.n >= 2) && row.some((x) => x.k > 0) && digits(row) < 100000 && places(row) <= 2;
  const FORMS = ['n2', 'n1', '2n', '1n', '11'];
  // 값이 서로 가깝고(한가운데 값에서 spread 안쪽) 모두 다른 곱 count 개
  const nearRows = (d, count, lo, hi, spread) => d.until(() => { const v0 = d.int(lo, hi), w = Math.max(8, Math.round(v0 * spread)); return d.shuffle(FORMS).slice(0, count).map((f) => near(d, v0 + d.int(-w, w), f)); },
    (list) => list.every(sound) && new Set(list.map(cents)).size === list.length && list.every((p, i) => list.every((q, j) => i >= j || !shares(p, q))));
  const times = (row) => eq(...row.reduce((out, x, i) => out.concat(i ? ['*', S(x)] : [S(x)]), []));

  // ── 어림하기 ──
  // 곱이 T 인 자연수의 곱(어림의 기준)
  const FACT = { 12: [[2, 6], [3, 4], [4, 3], [6, 2]], 16: [[2, 8], [4, 4], [8, 2]], 18: [[2, 9], [3, 6], [6, 3], [9, 2]], 24: [[3, 8], [4, 6], [6, 4], [8, 3]] };
  B.addTypes('5-2-4', 'est', [
    T('est-point-pick', '어림하여 소수점의 위치가 맞는 곱 고르기', '②34 ①38·39 심31', (d, n) => {
      // 첫째 문항은 (자연수)×(1보다 큰 소수 두 자리 수), 둘째 문항은 1보다 작은 소수끼리. 보기는 숫자 배열이 같고 소수점의 위치만 다르다.
      const [x, y] = n === 0 ? pair(d, () => [nat(d.int(3, 9)), two(d, 212, 489)], (p) => clean(p) && p >= 1000) : pair(d, () => [one(d, 5, 9), two(d, 32, 98)], (p) => clean(p) && p >= 100);
      const p = x.n * y.n, K = x.k + y.k, rows = d.shuffle([1, 2, 3]), w = Math.floor(y.n / 100), i = px([x, y]);
      return C(`어림하여 ${S(x)} × ${S(y)}의 계산 결과를 찾으려고 한다. 알맞은 것은?`, rows.map((k) => fx(p, k)), rows.indexOf(K), {
        explain: n === 0
          ? `${J(y, '은/는')} ${w}보다 크고 ${w + 1}보다 작으므로 계산 결과는 ${x.n} × ${w} = ${x.n * w}보다 크고 ${x.n} × ${w + 1} = ${x.n * (w + 1)}보다 작다. 알맞은 것은 ${fx(p, K)}이다.`
          : `곱하는 두 수가 모두 1보다 작으므로 계산 결과는 ${S(y)}보다 작다. ${J(x, '은/는')} 0.1보다 크므로 계산 결과는 ${S(y)}의 ${part(1)}배인 ${fx(y.n, 3)}보다 크다. 알맞은 것은 ${fx(p, K)}이다.`,
        facts: { pick: { expr: `${i.s}*${P10[3 - K]}`, options: rows.map((k) => p * P10[3 - k]) }, unseen: i.un.concat([P10[3 - K]]), rule: ['pointNat', 'pointSmall'][n] }
      });
    }, { count: 2 }),
    T('est-wrong-point', '어림하여 소수점의 위치가 잘못된 계산 찾기', '①39·37 심34', (d) => {
      // 세 식 가운데 하나만 소수점을 한 자리 잘못 찍었다(바른 곱의 10배 또는 1/10배). 가까운 수로 바꾸어 어림하면 가려낼 수 있다.
      const mk = () => d.pick([() => pair(d, () => [nat(d.int(3, 9)), two(d, 112, 489)], clean), () => pair(d, () => [one(d, 21, 89), one(d, 21, 89)], clean), () => pair(d, () => [nat(nz(d, 11, 29)), one(d, 3, 9)], clean), () => pair(d, () => [one(d, 3, 9), two(d, 32, 98)], clean)])();
      const rows = d.until(() => [mk(), mk(), mk()], (list) => list.every((p, i) => list.every((q, j) => i >= j || !shares(p, q)))), bad = d.int(0, 2);
      const shown = rows.map((row, i) => { const r = mul(...row); return i === bad ? (r.k <= 2 && d.bool() ? dec(r.n, r.k + 1) : dec(r.n * 10, r.k)) : r; });
      // 가장 높은 자리만 남긴 수(어림에 쓰는 수)
      const lead = (x) => { const len = String(x.n).length; return dec(Math.round(x.n / P10[len - 1]) * P10[len - 1], x.k); };
      const [x, y] = rows[bad], rx = lead(x), ry = lead(y), sc = scaled(rows), top = Math.max(sc.K, ...shown.map((v) => v.k));
      return C('어림하여 소수점의 위치가 잘못된 계산을 찾으면?', THREE, bad, {
        figure: tagged(rows.map((row, i) => eq(S(row[0]), '*', S(row[1]), '=', S(shown[i])))),
        explain: `${S(x)} × ${J(y, '은/는')} ${S(rx)} × ${S(ry)} = ${S(mul(rx, ry))}쯤이므로 ${J(shown[bad], '이/가')} 될 수 없다. 바르게 계산하면 ${told(x, y)}이다.`,
        facts: { claimed: rows.map((row, i) => [`${sc.exprs[i]}*${P10[top - sc.K]}`, shown[i].n * P10[top - shown[i].k]]), claimedWant: false }
      });
    }),
    T('est-spot', '어림하여 자연수의 곱에 소수점 찍기', '②35 ①37 심31', (d) => {
      const near1 = () => { const w = d.int(2, 9), f = d.pick([1, 2, 3, 7, 8, 9]); return { v: dec(w * 10 + f, 1), r: f < 5 ? w : w + 1 }; };
      const [X, Y] = d.until(() => [near1(), near1()], ([p, q]) => clean(p.v.n * q.v.n) && p.v.n !== q.v.n && p.r !== q.r), x = X.v, y = Y.v, p = x.n * y.n, r = mul(x, y);
      return D(`${x.n} × ${y.n} = ${p}이다. ${S(x)} × ${J(y, '을/를')} ${X.r} × ${josa(Y.r, '으로/로')} 어림하여 ${p}에 소수점을 찍으면?`, V(r), {
        explain: `${S(x)} × ${J(y, '은/는')} ${X.r} × ${Y.r} = ${X.r * Y.r}에 가깝다. ${p}에 소수점을 찍어 ${X.r * Y.r}에 가까운 수를 만들면 ${S(r)}이다.`,
        facts: { calc: [[`${S(x)}*${S(y)}`, 0]] }
      });
    }),
    T('est-about', '자연수의 곱으로 소수의 곱 어림하기', '②35 심32', (d) => {
      // 틀린 보기: 소수점을 한 자리 덜·더 옮긴 것, 옮기지 않은 것
      const c = d.int(3, 9), y = d.int(3, 9) * 10 + d.pick([-1, 1]), R = Math.round(y / 10) * 10, about = c * R, rows = d.shuffle([2, 1, 0, 3]);
      return C(`${josa(c, '과/와')} ${y}의 곱은 약 ${about}이다. ${josa(c, '과/와')} ${fx(y, 2)}의 곱은 약 얼마인가?`, rows.map((k) => S(dec(about, k))), rows.indexOf(2), {
        explain: `${dj(fx(y, 2), '은/는')} ${y}의 ${part(2)}배이므로 곱도 약 ${about}의 ${part(2)}배인 약 ${S(dec(about, 2))}이다.`,
        facts: { pick: { expr: `${about}*10`, options: rows.map((k) => about * P10[3 - k]) }, unseen: [10] }
      });
    }),
    T('est-nearest', '어림하여 계산 결과에 가장 가까운 수 고르기', '②36', (d) => {
      const [a, b] = d.until(() => [d.int(3, 9), d.int(3, 9)], ([p, q]) => p !== q), x = dec(a * 100 + d.pick([-1, 1]) * d.int(2, 9), 2), y = dec(b * 10 + d.pick([-1, 1]), 1);
      const opts = d.shuffle([a * b, (a + 1) * (b + 1), (a - 1) * (b - 1), a * b * 10]);
      return C(`어림하여 ${S(x)} × ${S(y)}의 계산 결과에 가장 가까운 수를 찾으면?`, opts.map(String), opts.indexOf(a * b), {
        explain: `${J(x, '은/는')} ${a}에, ${J(y, '은/는')} ${b}에 가까우므로 계산 결과는 ${a} × ${b} = ${a * b}에 가장 가깝다.`,
        facts: { choose: { exprs: opts.map(String), rule: 'nearest', target: x.n * y.n / 1000 } }
      });
    }),
    T('est-process', '가까운 자연수로 어림하는 과정', '②37 ①35', (d) => {
      const c = d.int(3, 9), A = d.int(3, 9), delta = d.pick([-1, 1]) * d.int(2, 9), x = dec(A * 100 + delta, 2), lo = delta < 0 ? A - 1 : A;
      return M(`${S(x)} × ${josa(c, '을/를')} 어림하려고 한다. ㉠, ㉡에 알맞은 수는?`, [inp(LAB[0], nat(A)), inp(LAB[1], nat(A * c))], {
        figure: lines([`${J(x, '은/는')} ${josa(lo, '과/와')} ${lo + 1} 가운데 ${box(LAB[0])}에 더 가깝다.`, `${S(x)} × ${c}의 계산 결과는 ${box(LAB[0])} × ${c} = ${box(LAB[1])}에 가깝다.`]),
        explain: `${J(x, '은/는')} ${A}에 더 가깝다. ${A} × ${c} = ${A * c}이므로 ${S(x)} × ${c}의 계산 결과는 ${A * c}보다 조금 ${delta > 0 ? '크다' : '작다'}.`,
        facts: { calc: [[String(A), 0], [`${A}*${c}`, 1]] }
      });
    }),
    T('est-side', '어림한 값과 계산 결과의 크기 비교', '②37·39', (d, n) => {
      if (n === 0) {
        // (자연수에 가까운 소수)×(자연수)와 어림한 값
        const c = d.int(3, 9), A = d.int(3, 9), s = d.pick([-1, 1]), x = dec(A * 100 + s * d.int(2, 9), 2), sc = scaled([[x, nat(c)], [nat(A * c)]]);
        return C('어림하여 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, s > 0 ? 0 : 2, {
          figure: versus(eq(S(x), '*', c), ex(A * c)),
          explain: `${J(x, '은/는')} ${A}보다 ${s > 0 ? '크므로' : '작으므로'} ${S(x)} × ${josa(c, '은/는')} ${A} × ${c} = ${A * c}보다 ${s > 0 ? '크다' : '작다'}.`,
          facts: { choose: { exprs: sc.exprs, rule: 'compare' }, unseen: sc.un, rule: 'sideOne' }
        });
      }
      // 두 수가 모두 어림한 수보다 크거나 모두 작다.
      const A = d.int(3, 9), b = d.int(2, 9), s = d.pick([-1, 1]), x = dec(A * 10 + s * d.int(1, 2), 1), y = dec(b * 10 + s * d.int(1, 3), 2), target = dec(A * b, 1), sc = scaled([[x, y], [target]]);
      return C('어림하여 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, s > 0 ? 0 : 2, {
        figure: versus(eq(S(x), '*', S(y)), ex(S(target))),
        explain: `${J(x, '은/는')} ${A}보다 ${s > 0 ? '크고' : '작고'} ${J(y, '은/는')} ${fx(b, 1)}보다 ${s > 0 ? '크므로' : '작으므로'} ${S(x)} × ${J(y, '은/는')} ${A} × ${fx(b, 1)} = ${S(target)}보다 ${s > 0 ? '크다' : '작다'}.`,
        facts: { choose: { exprs: sc.exprs, rule: 'compare' }, unseen: sc.un, rule: 'sideTwo' }
      });
    }, { count: 2 }),
    T('est-above-pick', '어림하여 기준 수보다 큰(작은) 곱 고르기', '①34 ②38 심30', (d, n) => {
      // 세 식 모두 곱이 꼭 T 인 자연수의 곱에서 한 수(둘째 문항은 두 수)를 조금 바꾼 것이다. 큰 것을 물으면 하나만 늘리고, 작은 것을 물으면 하나만 줄인다.
      const Tn = d.pick([12, 16, 18, 24]), big = d.bool(), hit = d.int(0, 2);
      const rows = d.shuffle(FACT[Tn]).slice(0, 3).map(([c, q], i) => {
        const s = (i === hit) === big ? 1 : -1;
        return n === 0 ? { c, q, s, row: [nat(c), d.bool() ? dec(q * 10 + s * d.int(1, 2), 1) : dec(q * 100 + s * nz(d, 2, 19), 2)] } : { c, q, s, row: [dec(c * 10 + s * d.int(1, 3), 1), dec(q * 100 + s * nz(d, 2, 21), 2)] };
      });
      return C(`어림하여 계산 결과가 ${Tn}보다 ${big ? '큰' : '작은'} 것을 찾으면?`, THREE, hit, {
        figure: tagged(rows.map((v) => times(v.row))),
        explain: rows.map((v, i) => `${LAB[i]}은 ${v.c} × ${v.q} = ${Tn}에서 ${n === 0 ? '곱하는 수가' : '두 수가 모두'} 조금 ${v.s > 0 ? '커졌으므로' : '작아졌으므로'} ${Tn}보다 ${v.s > 0 ? '크다' : '작다'}`).join('. ') + '.',
        facts: { choose: { exprs: rows.map((v) => v.row.map(S).join('*')), rule: big ? 'onlyAbove' : 'onlyBelow', target: Tn }, rule: ['aboveNat', 'aboveDec'][n] }
      });
    }, { count: 2 }),
    T('est-wrong-person', '잘못 어림한 사람 찾기', '①36 심32', (d) => {
      // 세 사람 가운데 한 사람만 소수점의 위치를 한 자리 틀리게 어림하였다.
      const who = pick(d, 3), bad = d.int(0, 2);
      const c1 = d.int(3, 9), t = d.pick([3, 4, 6, 7, 8]), y1 = t * 10 + d.pick([-1, 1]), c2 = d.pick([4, 6, 8]), y2 = d.pick([49, 51]), A3 = d.int(3, 9), c3 = d.int(3, 9), x3 = dec(A3 * 100 + d.pick([-1, 1]) * d.int(2, 6), 2);
      const rows = d.shuffle([
        { ok: bad !== 0, text: `${josa(c1, '과/와')} ${y1}의 곱이 약 ${c1 * t * 10}이므로 ${c1} × ${dj(fx(y1, 2), '은/는')} ${S(bad === 0 ? nat(c1 * t) : dec(c1 * t, 1))}쯤이다.`, fix: `${c1} × ${dj(fx(y1, 2), '은/는')} ${c1 * t * 10}의 ${part(2)}배인 ${S(dec(c1 * t, 1))}쯤이다.` },
        { ok: bad !== 1, text: `${c2} × ${dj(fx(y2, 2), '은/는')} ${josa(c2, '과/와')} 0.5의 곱으로 어림할 수 있으므로 ${bad === 1 ? c2 * 5 : c2 / 2}쯤이다.`, fix: `${josa(c2, '과/와')} 0.5의 곱은 ${c2}의 반인 ${c2 / 2}이다.` },
        { ok: bad !== 2, text: `${S(x3)} × ${josa(c3, '은/는')} ${A3} × ${josa(c3, '으로/로')} 어림할 수 있으므로 ${S(bad === 2 ? dec(A3 * c3, 1) : nat(A3 * c3))}쯤이다.`, fix: `${A3} × ${c3} = ${A3 * c3}이므로 ${A3 * c3}쯤이다.` }
      ]), hit = rows.findIndex((row) => !row.ok);
      return C('곱을 어림하여 말하였다. 잘못 어림한 사람은?', who, hit, {
        figure: lines(rows.map((row, i) => said(who[i], row.text))),
        explain: `${name(who[hit], '이/가')} 소수점의 위치를 틀리게 어림하였다. ${rows[hit].fix}`,
        facts: { truth: rows.map((row) => row.ok), want: false }
      });
    }),
    T('est-area', '어림으로 두 직사각형의 넓이 비교', '②40·41', (d) => {
      // 두 넓이 모두 T 에 가깝다. 한쪽은 T 보다 조금 좁고 다른 쪽은 조금 넓다.
      const Tn = d.pick([12, 16, 18, 24]), [f1, f2] = d.shuffle(FACT[Tn]).slice(0, 2), up = d.int(0, 1);
      const rows = [f1, f2].map(([c, q], i) => { const s = i === up ? 1 : -1; return { c, q, s, y: d.bool() ? dec(q * 10 + s * d.int(1, 2), 1) : dec(q * 100 + s * nz(d, 2, 12), 2) }; });
      return C(`직사각형 모양의 두 꽃밭 가와 나가 있다. 넓이를 ${Tn} m²와 비교하는 방법으로 어림할 때, 더 넓은 꽃밭은?`, ['가', '나', '두 꽃밭의 넓이는 같다.'], up, {
        figure: tagged(rows.map((v) => `가로 ${v.c} m, 세로 ${S(v.y)} m`), ['가', '나']),
        explain: rows.map((v, i) => `${['가', '나'][i]}의 넓이는 ${v.c} × ${v.q} = ${Tn}(m²)보다 조금 ${v.s > 0 ? '넓다' : '좁다'}`).join('. ') + `. 더 넓은 꽃밭은 ${['가', '나'][up]}이다.`,
        facts: { choose: { exprs: rows.map((v) => `${v.c}*${S(v.y)}`), rule: 'max' } }
      });
    }),
    T('est-fill', '어림으로 수조가 가득 차는지 알아보기', '③48 ②41', (d) => {
      // 그릇의 들이를 소수 첫째 자리까지 올려(내려) 생각해도 답이 바뀌지 않는다.
      const c = d.int(4, 9), x = two(d, 52, 98), over = d.bool(), ru = Math.ceil(x.n / 10), rd = Math.floor(x.n / 10), Tn = over ? Math.ceil(rd * c / 10) - 1 : Math.floor(ru * c / 10) + 1, sc = scaled([[x, nat(c)], [nat(Tn)]]);
      return C(`들이가 ${Tn} L인 수조가 비어 있다. 들이가 ${S(x)} L인 그릇에 물을 가득 담아 이 수조에 ${c}번 부었다. 어림하여 알아볼 때 알맞은 것은?`, ['물이 수조에서 넘친다.', '물이 수조에 꼭 맞게 찬다.', '수조가 가득 차지 않는다.'], over ? 0 : 2, {
        explain: over
          ? `${S(x)} L를 ${fx(rd, 1)} L로 줄여 생각해도 ${fx(rd, 1)} × ${c} = ${S(dec(rd * c, 1))}(L)로 ${Tn} L보다 많다. 물이 수조에서 넘친다.`
          : `${S(x)} L를 ${fx(ru, 1)} L로 늘려 생각해도 ${fx(ru, 1)} × ${c} = ${S(dec(ru * c, 1))}(L)로 ${Tn} L보다 적다. 수조가 가득 차지 않는다.`,
        facts: { choose: { exprs: sc.exprs, rule: 'compare' }, unseen: sc.un }
      });
    }),
    T('est-buy', '어림으로 가진 돈으로 살 수 있는지 알아보기', '③67 심33 ②41', (d) => {
      const price = d.int(5, 9) * 100 + d.pick([0, 50]), L = d.int(3, 6), can = d.bool(), len = dec(L * 10 + (can ? -1 : 1) * d.int(1, 3), 1);
      const have = can ? Math.ceil(price * L / 500) * 500 : Math.floor(price * L / 500) * 500;
      return C(`1 m에 ${price}원인 리본 ${S(len)} m를 사려고 한다. ${have}원으로 이 리본을 살 수 있는지 어림하여 알아보면?`, ['살 수 있다.', '살 수 없다.'], can ? 0 : 1, {
        explain: can
          ? `${S(len)} m를 ${L} m로 늘려 생각해도 ${price} × ${L} = ${price * L}(원)으로 ${have}원을 넘지 않는다. 살 수 있다.`
          : `${S(len)} m를 ${L} m로 줄여 생각해도 ${price} × ${L} = ${price * L}(원)으로 ${have}원보다 많다. 살 수 없다.`,
        facts: { choose: { exprs: [String(have), `${price}*${S(len)}`], rule: 'max' } }
      });
    }),
    T('est-closest', '가장 가깝게 어림한 식 고르기', '②42', (d) => {
      const [A, Bn] = d.until(() => [d.int(12, 38), d.int(12, 38)], ([p, q]) => p % 10 !== 0 && q % 10 !== 0 && p !== q), x = dec(A * 10 + d.pick([-1, 1]), 1), y = dec(Bn * 10 + d.pick([-1, 1]), 1);
      const down = (v) => Math.floor(v / 10) * 10, rows = d.shuffle([[A, Bn], [down(A), down(Bn)], [down(A) + 10, down(Bn) + 10]]);
      return C(`휘발유 1 L로 ${S(x)} km를 가는 자동차가 있다. 휘발유 ${S(y)} L로 갈 수 있는 거리를 어림하려고 한다. 가장 가깝게 어림한 식은?`, rows.map(([p, q]) => eq(p, '*', q)), rows.findIndex(([p, q]) => p === A && q === Bn), {
        explain: `갈 수 있는 거리는 ${S(x)} × ${S(y)}이다. ${J(x, '은/는')} ${A}에, ${J(y, '은/는')} ${Bn}에 가장 가까우므로 ${A} × ${Bn} = ${A * Bn}(km)쯤이다.`,
        facts: { closer: { expr: `${S(x)}*${S(y)}`, estimates: rows.map(([p, q]) => p * q) } }
      });
    })
  ]);

  // ── 잘못된 계산 살펴보기 ──
  // 분수로 고쳐 계산하다 틀린 과정. kind: 0 분모를 100으로 잘못 고침, 1 끝에서 소수로 잘못 고침, 2 분모끼리 곱하지 않음, 3 소수 두 자리 수의 분모를 10으로 고침.
  // 줄마다 값(1000배 한 정수)을 함께 돌려준다: 처음 식, ㉠, ㉡, ㉢.
  function wrongFrac(d, kind) {
    if (kind === 0) {
      const [x, c] = d.until(() => [one(d, 11, 98), d.int(2, 9)], ([v, k]) => clean(v.n * k)), p = x.n * c;
      return { xs: [x, nat(c)], steps: [eq(frac(x.n, 100), '*', c), ex(frac(p, 100)), ex(fx(p, 2))], values: [p * 100, p * 10, p * 10, p * 10], why: `${J(x, '은/는')} 소수 한 자리 수이므로 분모가 10인 분수로 고쳐야 한다.` };
    }
    if (kind === 1) {
      const [c, y] = d.until(() => [d.int(2, 9), two(d, 12, 98)], ([k, v]) => clean(k * v.n)), p = c * y.n;
      return { xs: [nat(c), y], steps: [eq(c, '*', frac(y.n, 100)), ex(frac(p, 100)), ex(fx(p, 1))], values: [p * 10, p * 10, p * 10, p * 100], why: `${frac(p, 100)}${dj(String(p), '은/는').slice(String(p).length)} 0.01이 ${p}개인 수이므로 ${fx(p, 2)}이다.` };
    }
    if (kind === 2) {
      const [x, y] = d.until(() => [one(d, 2, 9), one(d, 2, 9)], ([v, w]) => clean(v.n * w.n) && v.n !== w.n), p = x.n * y.n;
      return { xs: [x, y], steps: [eq(frac(x.n, 10), '*', frac(y.n, 10)), ex(frac(p, 10)), ex(fx(p, 1))], values: [p * 10, p * 10, p * 100, p * 100], why: `분모는 분모끼리 곱하여 10 × 10 = 100이 되어야 한다.` };
    }
    const [x, y] = d.until(() => [one(d, 2, 9), two(d, 12, 98)], ([v, w]) => clean(v.n * w.n)), p = x.n * y.n;
    return { xs: [x, y], steps: [eq(frac(x.n, 10), '*', frac(y.n, 10)), ex(frac(p, 100)), ex(fx(p, 2))], values: [p, p * 10, p * 10, p * 10], why: `${J(y, '은/는')} 소수 두 자리 수이므로 분모가 100인 분수로 고쳐야 한다.` };
  }
  B.addTypes('5-2-4', 'check', [
    T('check-forms', '(소수)×(자연수)와 같지 않은 것 찾기', '①6', (d) => {
      // 틀린 것: 1/10배 대신 1/100배 한 것, 소수 한 자리 수를 분모가 100인 분수로 고친 것
      const [x, c] = d.until(() => [one(d, 12, 48), d.int(2, 4)], ([v, k]) => clean(v.n * k)), a = x.n, text = S(x);
      const sum = Array.from({ length: c }, () => text), good = d.shuffle([
        [eq(...sum.reduce((out, t, i) => out.concat(i ? ['+', t] : [t]), [])), sum.join('+')],
        [eq(frac(a, 10), '*', c), `${a}/10*${c}`],
        [ex(frac(`${a} × ${c}`, 10)), `${a}*${c}/10`],
        [eq(a, '*', c, '*', frac(1, 10)), `${a}*${c}*1/10`]
      ]).slice(0, 3), bad = d.pick([[eq(a, '*', c, '*', frac(1, 100)), `${a}*${c}*1/100`], [eq(frac(a, 100), '*', c), `${a}/100*${c}`]]);
      const rows = d.shuffle(good.concat([bad]));
      return C(`${text} × ${josa(c, '과/와')} 계산 결과가 같지 않은 것은?`, rows.map((row) => row[0]), rows.indexOf(bad), {
        explain: `${J(x, '은/는')} ${frac(a, 10)}이고 ${a}의 ${part(1)}배이다. ${text} × ${c} = ${frac(`${a} × ${c}`, 10)} = ${S(mul(x, nat(c)))}이다. 분모가 100이거나 ${part(2)}배 한 것은 계산 결과가 다르다.`,
        facts: { choose: { exprs: rows.map((row) => row[1]), rule: 'odd' }, unseen: [1] }
      });
    }),
    T('check-talk', '(소수)×(자연수)의 계산 방법을 잘못 말한 사람 찾기', '①7', (d) => {
      const [a, c] = d.until(() => [d.int(2, 9), d.int(2, 9)], ([v, k]) => clean(v * k) && v !== k), x = dec(a, 1), who = pick(d, 3), kind = d.int(0, 1);
      const rows = d.shuffle([
        { ok: kind !== 0, text: `${J(x, '은/는')} 0.1이 ${a}개인 수이므로 ${S(x)} × ${josa(c, '은/는')} 0.1이 ${kind === 0 ? a + c : a * c}개인 수이다.` },
        { ok: kind !== 1, text: `${a} × ${c} = ${a * c}이고 ${J(x, '은/는')} ${a}의 ${part(1)}배이므로 ${S(x)} × ${josa(c, '은/는')} ${a * c}의 ${part(kind === 1 ? 2 : 1)}배이다.` },
        { ok: true, text: `${S(x)} × ${josa(c, '은/는')} ${J(x, '을/를')} ${c}번 더한 것과 같다.` }
      ]), hit = rows.findIndex((row) => !row.ok);
      return C(`${S(x)} × ${josa(c, '을/를')} 계산하는 방법을 말하였다. 잘못 말한 사람은?`, who, hit, {
        figure: lines(rows.map((row, i) => said(who[i], row.text))),
        explain: (kind === 0 ? `0.1이 ${a}개씩 ${c}번이므로 0.1은 모두 ${a} × ${c} = ${a * c}(개)이다.` : `곱해지는 수가 ${part(1)}배가 되면 곱도 ${part(1)}배가 된다.`) + ` ${S(x)} × ${c} = ${S(mul(x, nat(c)))}이다.`,
        facts: { truth: rows.map((row) => row.ok), want: false }
      });
    }),
    T('check-frac-where', '분수로 고쳐 계산한 과정에서 처음 잘못된 곳 찾기', '②56 ③51 ①7', (d) => {
      const kind = d.int(0, 2), w = wrongFrac(d, kind), first = [0, 2, 1][kind];
      return C('계산 과정에서 처음으로 잘못된 곳은?', THREE, first, {
        figure: lines([times(w.xs)].concat(w.steps.map((step, i) => tag(LAB[i]) + eq('=') + ' ' + step))),
        explain: `${w.why} 바르게 계산하면 ${told(...w.xs)}이다.`,
        facts: { claimed: [0, 1, 2].map((i) => [String(w.values[i]), w.values[i + 1]]), claimedWant: false }
      });
    }),
    T('check-frac-value', '분수로 고쳐 잘못 계산한 것을 바르게 계산하기', '②56 ③51 ①7', (d, n) => {
      // 첫째 문항은 한 수만 소수(분모를 잘못 고치거나 끝에서 소수로 잘못 고침), 둘째 문항은 두 수가 모두 소수(분모끼리 곱하지 않거나 분모를 잘못 고침).
      const w = wrongFrac(d, n === 0 ? d.int(0, 1) : d.int(2, 3));
      return ans('다음은 잘못 계산한 것이다. 바르게 계산한 값은?', w.xs, {
        figure: lines([eq(...w.xs.reduce((out, x, i) => out.concat(i ? ['*', S(x)] : [S(x)]), []), '=') + ' ' + w.steps[0], eq('=') + ' ' + w.steps[1] + ' ' + eq('=') + ' ' + w.steps[2]]),
        explain: `${w.why} 바르게 계산하면 ${told(...w.xs)}이다.`, facts: { rule: ['fracValueOne', 'fracValueTwo'][n] }
      });
    }, { count: 2 }),
    T('check-col-point', '소수점을 잘못 찍은 세로셈 바로잡기', '①21 ③50 심34 ②57', (d, n) => {
      // 첫째 문항은 (자연수)×(소수 두 자리 수)에서 한 자리만 옮긴 것, 둘째 문항은 (소수)×(소수)에서 한 수의 자리 수만 센 것.
      const [x, y] = n === 0 ? pair(d, () => [nat(d.int(3, 9)), two(d, 112, 489)], clean) : pair(d, () => (d.bool() ? [one(d, 11, 98), one(d, 11, 98)] : [two(d, 112, 989), one(d, 11, 98)]), clean);
      const p = x.n * y.n, K = x.k + y.k, wrong = fx(p, n === 0 ? 1 : x.k);
      return ans('소수점을 잘못 찍은 계산이다. 바르게 계산한 값은?', [x, y], {
        figure: mcol(S(x), S(y), wrong),
        explain: `${x.n} × ${y.n} = ${p}이다. 곱하는 두 수의 소수점 아래 자리 수를 더하면 ${K}이므로 ${p}에서 소수점을 왼쪽으로 ${NTH[K]} 자리 옮긴 ${fx(p, K)}이다.`,
        facts: { rule: ['colNat', 'colDec'][n] }
      });
    }, { count: 2 }),
    T('check-zero-talk', '몇십과 소수의 곱을 잘못 계산한 것 바로잡기', '심35 ②25·57', (d) => {
      // 20 × 4.7을 2 × 47 = 94로 계산한 다음 소수 한 자리 수라고 소수점을 찍었다(20을 2로 줄인 것을 되돌리지 않았다).
      const [t, y] = d.until(() => [d.int(2, 9), one(d, 12, 98)], ([k, v]) => clean(k * v.n)), Tn = t * 10, p = t * y.n;
      return ans('다음은 잘못 계산한 것이다. 바르게 계산한 값은?', [nat(Tn), y], {
        kind: 'nat', figure: lines([eq(Tn, '*', S(y)), `${t} × ${y.n} = ${p}이고 ${J(y, '이/가')} 소수 한 자리 수이므로 ${fx(p, 1)}이다.`]),
        explain: `${Tn} × ${y.n} = ${p * 10}이다. ${J(y, '은/는')} ${y.n}의 ${part(1)}배이므로 곱은 ${p * 10}의 ${part(1)}배인 ${p}이다. ${josa(Tn, '을/를')} ${josa(t, '으로/로')} 줄여 계산했으면 다시 10배 해야 한다.`
      });
    }),
    T('check-move-talk', '자연수의 곱으로 소수의 곱을 구하는 방법을 잘못 말한 사람 찾기', '심27 ①7 ②25', (d) => {
      const [a, b] = d.until(() => [nz(d, 112, 989), nz(d, 12, 98)], ([p, q]) => clean(p * q) && p * q < 100000), p = a * b, x = dec(a, 2), y = dec(b, 1), who = pick(d, 3), kind = d.int(0, 2);
      const rows = d.shuffle([
        { ok: kind !== 0, text: `${J(x, '은/는')} ${a}의 ${part(kind === 0 ? 1 : 2)}배이다.` },
        { ok: true, text: `${J(y, '은/는')} ${b}의 ${part(1)}배이다.` },
        { ok: kind === 0, text: `${p}에서 소수점을 ${kind === 1 ? '오른쪽으로 세 자리' : kind === 2 ? '왼쪽으로 두 자리' : '왼쪽으로 세 자리'} 옮긴다.` }
      ]), hit = rows.findIndex((row) => !row.ok);
      return C(`${a} × ${b} = ${josa(p, '을/를')} 이용하여 ${S(x)} × ${J(y, '을/를')} 계산하는 방법을 말하였다. 잘못 말한 사람은?`, who, hit, {
        figure: lines(rows.map((row, i) => said(who[i], row.text))),
        explain: `${J(x, '은/는')} ${a}의 ${part(2)}배, ${J(y, '은/는')} ${b}의 ${part(1)}배이므로 곱은 ${p}의 ${part(3)}배이다. ${p}에서 소수점을 왼쪽으로 세 자리 옮기면 ${S(mul(x, y))}이다.`,
        facts: { truth: rows.map((row) => row.ok), want: false }
      });
    })
  ]);

  // ── 곱의 크기 비교와 조건에 맞는 수 ──
  B.addTypes('5-2-4', 'comp', [
    T('comp-one-sign', '곱과 곱해지는 수의 크기 비교', '①40 ③49', (d, n) => {
      // 첫째 문항은 자연수에, 둘째 문항은 소수에 곱한다. 곱하는 수는 1보다 작은 소수, 1보다 큰 소수, 1 가운데 하나이다.
      const A = n === 0 ? nat(d.int(12, 98)) : one(d, 12, 98), m = d.pick([() => one(d, 2, 9), () => two(d, 82, 99), () => two(d, 101, 119), () => one(d, 11, 58), () => nat(1)])(), flip = d.bool();
      const rows = flip ? [[A], [A, m]] : [[A, m], [A]], sc = scaled(rows), v = sc.values;
      return C('계산하지 않고 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, v[0] > v[1] ? 0 : v[0] === v[1] ? 1 : 2, {
        figure: versus(times(rows[0]), times(rows[1])),
        explain: m.n === 1 && m.k === 0 ? '어떤 수에 1을 곱하면 계산 결과는 그 수와 같다.' : `곱하는 수 ${J(m, '은/는')} 1보다 ${m.n > P10[m.k] ? '크므로' : '작으므로'} 계산 결과는 ${S(A)}보다 ${m.n > P10[m.k] ? '크다' : '작다'}.`,
        facts: { choose: { exprs: sc.exprs, rule: 'compare' }, unseen: sc.un, rule: ['oneNat', 'oneDec'][n] }
      });
    }, { count: 2 }),
    T('comp-one-pick', '곱하는 수를 보고 기준보다 큰(작은) 곱 고르기', '①40 ③49', (d) => {
      // 큰 것을 물으면 1보다 큰 수를 곱한 식 하나만, 작은 것을 물으면 1보다 작은 수를 곱한 식 하나만 답이다. 1을 곱한 식은 어느 쪽에도 들지 않는다.
      const A = d.bool() ? nat(d.int(12, 98)) : one(d, 12, 98), big = d.bool(), small = () => (d.bool() ? one(d, 2, 9) : two(d, 62, 99)), large = () => (d.bool() ? two(d, 101, 129) : one(d, 11, 48));
      const ms = d.shuffle(d.until(() => (big ? [small(), small(), nat(1), large()] : [large(), large(), nat(1), small()]), (list) => new Set(list.map(S)).size === 4)), hit = ms.findIndex((m) => (big ? m.n > P10[m.k] : m.n < P10[m.k]));
      return C(`계산하지 않고 알아보려고 한다. 계산 결과가 ${S(A)}보다 ${big ? '큰' : '작은'} 것은?`, ms.map((m) => eq(S(A), '*', S(m))), hit, {
        explain: `${S(A)}에 1보다 ${big ? '큰' : '작은'} 수를 곱해야 계산 결과가 ${S(A)}보다 ${big ? '크다' : '작다'}. 곱하는 수 가운데 1보다 ${big ? '큰' : '작은'} 수는 ${S(ms[hit])}뿐이다. 1을 곱하면 계산 결과는 ${J(A, '과/와')} 같다.`,
        facts: { only: { values: ms.map((m) => m.n * P10[2 - m.k]), test: big ? 'atLeast' : 'atMost', target: big ? 101 : 99 } }
      });
    }),
    T('comp-shared', '같은 수가 있는 두 곱을 계산하지 않고 비교하기', '②47 심12', (d) => {
      // 한 수는 두 식에 똑같이 있고(자리만 바뀜) 다른 수만 다르다. 다섯 번에 한 번은 곱하는 순서만 바꾼 식이다.
      const A = one(d, 12, 98), same = d.int(0, 4) === 0, [x, y] = d.until(() => { const base = d.int(11, 98); return [dec(base * 10 + d.int(1, 9), 2), d.bool() ? dec(base * 10 + d.int(1, 9), 2) : dec(base + d.pick([0, 1]), 1)]; }, ([p, q]) => S(p) !== S(q) && S(p) !== S(A) && S(q) !== S(A) && p.n * A.n < 100000 && q.n * A.n < 100000);
      const rows = same ? [[x, A], [A, x]] : [[x, A], [A, y]], sc = scaled(rows), v = sc.values;
      return C('두 식에 같은 수가 있다. 계산하지 않고 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, v[0] > v[1] ? 0 : v[0] === v[1] ? 1 : 2, {
        figure: versus(times(rows[0]), times(rows[1])),
        explain: same ? '두 수를 바꾸어 곱해도 계산 결과는 같다.' : `두 식 모두 ${J(A, '을/를')} 곱하므로 다른 수가 큰 쪽의 계산 결과가 더 크다. ${S(x)} ${v[0] > v[1] ? GT : LT} ${S(y)}이다.`,
        facts: { choose: { exprs: sc.exprs, rule: 'compare' }, unseen: sc.un }
      });
    }),
    T('comp-sign', '두 곱의 크기 비교', '①41 ②47 ③52 심12', (d, n) => {
      // 첫째 문항은 한 수가 자연수인 곱끼리(네 번에 한 번은 계산 결과가 같다), 둘째 문항은 (소수)×(소수)끼리. 두 결과가 가까워 계산해 보아야 알 수 있다.
      const equal = n === 0 && d.int(0, 3) === 0;
      const mk = n === 0
        ? () => d.pick(equal ? [() => [one(d, 2, 98), nat(d.int(2, 9))], () => [nat(d.int(2, 9)), one(d, 2, 98)]] : [() => [one(d, 2, 98), nat(d.int(2, 9))], () => [nat(d.int(2, 9)), one(d, 2, 98)], () => [two(d, 12, 598), nat(d.int(2, 9))], () => [nat(d.int(2, 9)), two(d, 12, 598)]])()
        : () => d.pick([() => [one(d, 2, 98), one(d, 2, 98)], () => [two(d, 12, 98), one(d, 2, 9)], () => [one(d, 2, 9), two(d, 12, 98)]])();
      const rows = d.until(() => [mk(), mk()], ([p, q]) => { const [u, v] = scaled([p, q]).values; return !shares(p, q) && digits(p) < 100000 && digits(q) < 100000 && (equal ? u === v : u !== v && Math.abs(u - v) * 12 <= Math.max(u, v)); });
      const sc = scaled(rows), v = sc.values, sign = v[0] > v[1] ? 0 : v[0] === v[1] ? 1 : 2;
      return C('두 식의 계산 결과를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, sign, {
        figure: versus(times(rows[0]), times(rows[1])),
        explain: `${told(...rows[0])}, ${told(...rows[1])}이다. ` + (sign === 1 ? '두 계산 결과는 같다.' : `${S(mul(...rows[0]))} ${SIGNS[sign]} ${S(mul(...rows[1]))}이다.`),
        facts: { choose: { exprs: sc.exprs, rule: 'compare' }, unseen: sc.un, rule: ['signNat', 'signDec'][n] }
      });
    }, { count: 2 }),
    T('comp-sign-value', '곱과 소수의 크기 비교', '①41', (d) => {
      const [x, y] = pair(d, () => [two(d, 12, 98), one(d, 11, 38)], clean), p = x.n * y.n, k = dec(d.until(() => Math.round(p / 100) + d.pick([-1, 0, 1]), (v) => v > 0 && v % 10 !== 0), 1), sc = scaled([[x, y], [k]]), v = sc.values, sign = v[0] > v[1] ? 0 : 2;
      return C('계산 결과와 수의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, sign, {
        figure: versus(times([x, y]), ex(S(k))),
        explain: `${told(x, y)}이다. ${S(mul(x, y))} ${SIGNS[sign]} ${S(k)}이다.`,
        facts: { choose: { exprs: sc.exprs, rule: 'compare' }, unseen: sc.un }
      });
    }),
    T('comp-max', '계산 결과가 가장 큰(작은) 것 찾기', '①42 ②48 ③53 심13', (d) => {
      const rows = nearRows(d, 3, 300, 3000, 0.07), vals = rows.map(cents), big = d.bool(), hit = vals.indexOf(big ? Math.max(...vals) : Math.min(...vals));
      return C(`계산 결과가 가장 ${big ? '큰' : '작은'} 것은?`, THREE, hit, {
        figure: tagged(rows.map(times)),
        explain: `계산 결과는 ${rows.map((row, i) => `${LAB[i]} ${S(mul(...row))}`).join(', ')}이다. 가장 ${big ? '큰' : '작은'} 것은 ${LAB[hit]}이다.`,
        facts: { choose: { exprs: rows.map((row) => row.map(S).join('*')), rule: big ? 'max' : 'min' } }
      });
    }),
    T('comp-order', '계산 결과를 크기 차례로 늘어놓기', '①42 ②48 심13', (d) => {
      const rows = nearRows(d, 3, 200, 2000, 0.1), desc = d.bool(), choice = orderChoice(d, rows.map(cents), THREE, desc);
      return C(`계산 결과가 ${desc ? '큰' : '작은'} 것부터 차례대로 쓴 것은?`, choice.options, choice.answer, {
        figure: tagged(rows.map(times)),
        explain: `계산 결과는 ${rows.map((row, i) => `${LAB[i]} ${S(mul(...row))}`).join(', ')}이다. ${choice.right.map((i) => S(mul(...rows[i]))).join(desc ? ` ${GT} ` : ` ${LT} `)}이다.`,
        facts: { choose: { exprs: rows.map((row) => row.map(S).join('*')), rule: desc ? 'descending' : 'ascending', orders: choice.list } }
      });
    }),
    T('comp-above', '계산하여 기준 수보다 큰(작은) 곱 고르기', '①43 ②48 ③54 심14', (d) => {
      // 세 곱 모두 기준 수에 가깝다. 한 식은 「~의 몇 배」로 적는다.
      const Tn = d.int(5, 20), big = d.bool(), hit = d.int(0, 2);
      const rows = d.until(() => d.shuffle(['11', 'n2', d.pick(['2n', 'n1'])]).map((f, i) => near(d, Tn * 100 + ((i === hit) === big ? 1 : -1) * d.int(6, Math.max(12, Tn * 6)), f)),
        (list) => list.every(sound) && list.every((row, i) => (cents(row) > Tn * 100) === ((i === hit) === big) && cents(row) !== Tn * 100) && new Set(list.map(cents)).size === 3);
      const worded = d.int(0, 2), show = (row, i) => (i === worded ? `${S(row[0])}의 ${S(row[1])}배` : times(row));
      return C(`계산 결과가 ${Tn}보다 ${big ? '큰' : '작은'} 것은?`, THREE, hit, {
        figure: tagged(rows.map(show)),
        explain: `계산 결과는 ${rows.map((row, i) => `${LAB[i]} ${S(mul(...row))}`).join(', ')}이다. ${Tn}보다 ${big ? '큰' : '작은'} 것은 ${LAB[hit]}이다.`,
        facts: { choose: { exprs: rows.map((row) => row.map(S).join('*')), rule: big ? 'onlyAbove' : 'onlyBelow', target: Tn } }
      });
    }),
    T('comp-odd', '계산 결과가 다른 하나 찾기', '①44 ②50 심15', (d) => {
      // 두 식은 계산 결과가 같고 한 식만 조금 다르다. 줄: (소수 한 자리 수)×(자연수) 또는 그 순서를 바꾼 것
      const m = d.until(() => { const a = nz(d, 2, 98), c = d.int(2, 9), c2 = d.int(2, 9), a3 = nz(d, 2, 98), c3 = d.int(2, 9); return { a, c, a2: a * c / c2, c2, a3, c3 }; },
        (v) => v.c2 !== v.c && Number.isInteger(v.a2) && v.a2 % 10 !== 0 && v.a2 >= 2 && v.a2 <= 98 && v.a2 !== v.a && v.a3 * v.c3 !== v.a * v.c && Math.abs(v.a3 * v.c3 - v.a * v.c) <= Math.max(4, v.a * v.c / 8) && ![v.a, v.a2].includes(v.a3));
      const put = (a, c) => (d.bool() ? [dec(a, 1), nat(c)] : [nat(c), dec(a, 1)]), made = [put(m.a, m.c), put(m.a2, m.c2), put(m.a3, m.c3)], order = d.shuffle([0, 1, 2]), rows = order.map((i) => made[i]), hit = order.indexOf(2);
      return C('계산 결과가 나머지와 다른 하나는?', THREE, hit, {
        figure: tagged(rows.map(times)),
        explain: `계산 결과는 ${rows.map((row, i) => `${LAB[i]} ${S(mul(...row))}`).join(', ')}이다. ${LAB[hit]}만 다르다.`,
        facts: { choose: { exprs: rows.map((row) => row.map(S).join('*')), rule: 'odd' }, rule: 'compOdd' }
      });
    }),
    T('comp-same', '주어진 곱과 계산 결과가 같은 식 찾기', '②50 ①44 심15', (d) => {
      // 틀린 보기: 숫자의 곱은 같지만 소수점 아래 자리 수가 다른 것(0.9 × 0.04), 숫자의 곱이 조금 다른 것 둘
      const m = d.until(() => { const a = d.int(2, 9), b = d.int(2, 9), e = d.int(2, 9), n1 = [d.int(2, 9), d.int(2, 9)], n2 = [d.int(2, 9), d.int(2, 9)]; return { a, b, c: a * b / e, e, n1, n2 }; },
        (v) => { const P = v.a * v.b, q1 = v.n1[0] * v.n1[1], q2 = v.n2[0] * v.n2[1]; return Number.isInteger(v.c) && v.c >= 2 && v.c <= 18 && v.c % 10 !== 0 && v.c !== v.a && v.c !== v.b && clean(P) && q1 !== P && q2 !== P && q1 !== q2 && Math.abs(q1 - P) <= 8 && Math.abs(q2 - P) <= 8; });
      const x = dec(m.a, 1), y = dec(m.b, 1), right = [dec(m.c, 1), dec(m.e, 1)], trap = [dec(m.c, 1), dec(m.e, 2)];
      const rows = d.shuffle([right, trap, [dec(m.n1[0], 1), dec(m.n1[1], 1)], [dec(m.n2[0], 1), dec(m.n2[1], 1)]]), sc = scaled(rows.concat([[x, y]]));
      return C(`${S(x)} × ${J(y, '과/와')} 계산 결과가 같은 것은?`, rows.map(times), rows.indexOf(right), {
        explain: `${told(x, y)}이다. 보기의 계산 결과는 차례로 ${rows.map((row) => S(mul(...row))).join(', ')}이다.`,
        facts: { choose: { exprs: sc.exprs.slice(0, 4), rule: 'equals', target: sc.values[4] }, unseen: sc.un, rule: 'compSame' }
      });
    }),
    T('comp-match', '식과 계산 결과 짝 짓기', '①13 ②49 ③55 심15', (d) => {
      const rows = nearRows(d, 3, 300, 2500, 0.08), sc = scaled(rows), list = d.shuffle(d.shuffle(ORDERS.slice(1)).slice(0, 3).concat([ORDERS[0]]));
      return C('식과 계산 결과를 알맞게 짝 지은 것은?', list.map((o) => o.map((j, i) => `${LAB[i]} ${S(mul(...rows[j]))}`).join(', ')), list.findIndex((o) => o.join() === '0,1,2'), {
        figure: tagged(rows.map(times)),
        explain: rows.map((row, i) => `${LAB[i]} ${told(...row)}`).join(', ') + '이다.',
        facts: { match: { exprs: sc.exprs, options: list.map((o) => o.map((j) => sc.values[j])) }, rule: 'compMatch' }
      });
    }),
    T('comp-natural', '계산 결과가 자연수인 식 찾기', '①45 ②51 심16', (d) => {
      // 자연수가 되는 것은 하나뿐이다. 두 식은 곱의 끝자리가 0이 되지만 소수가 남고, 한 식은 끝자리가 0이 아니다.
      const whole = () => pair(d, () => d.pick([() => [two(d, 25, 475), one(d, 2, 98)], () => [one(d, 5, 95), one(d, 2, 98)], () => [one(d, 5, 95), nat(d.pick([2, 4, 6, 8, 12, 14, 16, 18]))], () => [nat(d.pick([4, 8, 12, 16, 20])), two(d, 25, 475)]])(), (p, x, y) => p % P10[x.k + y.k] === 0);
      const drop = () => pair(d, () => d.pick([() => [two(d, 12, 495), one(d, 2, 98)], () => [one(d, 2, 95), one(d, 2, 98)], () => [nat(d.pick([2, 4, 5, 6, 8, 12, 14, 15, 16, 18])), two(d, 12, 495)]])(), (p, x, y) => p % 10 === 0 && p % P10[x.k + y.k] !== 0);
      const plain = () => pair(d, () => [one(d, 2, 98), d.bool() ? one(d, 2, 98) : nat(d.int(2, 9))], clean);
      const rows = d.shuffle(d.until(() => [whole(), drop(), drop(), plain()], (list) => list.every((p, i) => list.every((q, j) => i >= j || !shares(p, q))))), hit = rows.findIndex((row) => mul(...row).k === 0);
      return C('계산 결과가 자연수인 것은?', LAB, hit, {
        figure: tagged(rows.map(times)),
        explain: `계산 결과는 ${rows.map((row, i) => `${LAB[i]} ${S(mul(...row))}`).join(', ')}이다. 자연수인 것은 ${LAB[hit]}이다.`,
        facts: { claimed: rows.map((row) => { const p = px(row); return [`${p.s}%${P10[p.k]}`, 0]; }), claimedWant: true }
      });
    }),
    T('comp-ends', '가장 큰 수와 가장 작은 수의 곱', '①47 ②52 ③56 심9', (d, n) => {
      // 첫째 문항은 자리 수가 섞인 소수 넷(가장 큰 수는 소수 한 자리 수이고, 자연수 부분이 같은 소수 두 자리 수가 그다음이다), 둘째 문항은 자연수가 섞인 수 넷.
      const list = d.until(() => (n === 0
        ? (() => { const w = d.int(3, 8); return [dec(w * 100 + nz(d, 11, 49), 2), dec(w * 10 + d.int(5, 9), 1), one(d, 12, w * 10 - 1), two(d, 105, w * 100 - 1)]; })()
        : [nat(d.pick([8, 9, 11, 12, 13, 14, 15])), nat(d.int(2, 7)), one(d, 3, 9), two(d, 12, 98)]),
        (xs) => { const vs = xs.map((x) => x.n * P10[2 - x.k]); if (new Set(vs).size !== 4) return false; const big = xs[vs.indexOf(Math.max(...vs))], small = xs[vs.indexOf(Math.min(...vs))]; return big.k + small.k <= 3 && big.n * small.n < 100000 && mul(big, small).k > 0; });
      const vs = list.map((x) => x.n * P10[2 - x.k]), order = d.shuffle(list), big = list[vs.indexOf(Math.max(...vs))], small = list[vs.indexOf(Math.min(...vs))];
      return ans('다음 수 가운데 가장 큰 수와 가장 작은 수의 곱은?', [big, small], {
        figure: numbers(order.map(S)),
        explain: `가장 큰 수는 ${S(big)}, 가장 작은 수는 ${S(small)}이다. ${told(big, small)}이다.`, facts: { rule: ['endsDec', 'endsNat'][n] }
      });
    }, { count: 2 }),
    T('comp-described', '개수로 나타낸 두 수의 곱', '②53 심10', (d) => {
      // 0.1이 열 개가 넘는 수(0.1이 23개 → 2.3)도 있다.
      const a = d.bool() ? d.int(2, 9) : nz(d, 12, 38), b = nz(d, 12, 98), x = dec(a, 1), y = dec(b, 2);
      return dAns(`0.1이 ${a}개인 수와 0.01이 ${b}개인 수의 곱은?`, mul(x, y), `0.1*${a}*0.01*${b}`, {
        explain: `0.1이 ${a}개인 수는 ${S(x)}, 0.01이 ${b}개인 수는 ${S(y)}이다. ${told(x, y)}이다.`
      });
    }),
    T('comp-box', '곱과 비교하는 □ 안의 자연수', '①48 ②54 ③57 심36', (d, n) => {
      if (n === 0) {
        // 들어갈 수 있는 자연수의 개수
        const [c, y] = pair(d, () => [nat(d.int(2, 9)), two(d, 12, 298)], (p) => p % 100 !== 0 && p >= 200 && p < 1300), p = c.n * y.n, k = Math.floor(p / 100), i = px([c, y]);
        return N('□ 안에 들어갈 수 있는 자연수는 모두 몇 개인가?', k, {
          unit: '개', figure: eq(S(c), '*', S(y), '>', box()),
          explain: `${told(c, y)}이다. □는 ${S(mul(c, y))}보다 작은 자연수이므로 1부터 ${k}까지 ${k}개이다.`,
          facts: { digit: { template: `${i.s}>□*100`, lo: 1, hi: k + 2, ask: 'count' } }
        });
      }
      if (n === 1) {
        // 가장 큰 자연수
        const [x, y] = pair(d, () => [one(d, 12, 98), one(d, 12, 98)], (p) => p % 100 !== 0), p = x.n * y.n, k = Math.floor(p / 100), i = px([x, y]);
        return N('□ 안에 들어갈 수 있는 가장 큰 자연수는?', k, {
          figure: eq(S(x), '*', S(y), '>', box()),
          explain: `${told(x, y)}이다. ${S(mul(x, y))}보다 작은 자연수 가운데 가장 큰 수는 ${k}이다.`,
          facts: { digit: { template: `${i.s}>□*100`, lo: 1, hi: k + 3, ask: 'max' } }
        });
      }
      // 가장 작은 자연수
      const [x, y] = pair(d, () => [two(d, 112, 598), one(d, 12, 58)], (p) => p % 1000 !== 0), p = x.n * y.n, k = Math.floor(p / 1000) + 1, i = px([x, y]);
      return N('□ 안에 들어갈 수 있는 가장 작은 자연수는?', k, {
        figure: eq(S(x), '*', S(y), '<', box()),
        explain: `${told(x, y)}이다. ${S(mul(x, y))}보다 큰 자연수 가운데 가장 작은 수는 ${k}이다.`,
        facts: { digit: { template: `${i.s}<□*1000`, lo: 1, hi: k + 3, ask: 'min' } }
      });
    }, { count: 3 }),
    T('cards-ends', '수 카드로 만든 가장 큰 소수와 가장 작은 소수의 곱', '②58 ③73 심41', (d) => {
      const s = d.until(() => d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4).sort((p, q) => q - p), (v) => ((v[0] * 10 + v[1]) * (v[3] * 10 + v[2])) % 100 !== 0), big = dec(s[0] * 10 + s[1], 1), small = dec(s[3] * 10 + s[2], 1);
      return dAns('수 카드 4장 가운데 2장을 골라 한 번씩만 사용하여 소수 한 자리 수 □.□를 만들려고 한다. 만들 수 있는 가장 큰 수와 가장 작은 수의 곱은?', mul(big, small), `(${s[0]}*10+${s[1]})*(${s[3]}*10+${s[2]})/100`, {
        figure: cards(d.shuffle(s)),
        explain: `가장 큰 수는 큰 수부터 차례로 놓은 ${S(big)}, 가장 작은 수는 작은 수부터 차례로 놓은 ${S(small)}이다. ${told(big, small)}이다.`,
        facts: { unseen: [10, 100] }
      });
    }),
    T('cards-rest', '수 카드로 가장 큰 소수를 만들고 남은 수와 곱하기', '③74 ②58', (d) => {
      const s = d.until(() => d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4).sort((p, q) => q - p), (v) => v[3] >= 2 && ((v[0] * 100 + v[1] * 10 + v[2]) * v[3]) % 100 !== 0 && v[2] !== 0), big = dec(s[0] * 100 + s[1] * 10 + s[2], 2), rest = nat(s[3]);
      return dAns('수 카드 4장 가운데 3장을 골라 한 번씩만 사용하여 가장 큰 소수 두 자리 수 □.□□를 만들었다. 만든 수와 남은 수 카드에 적힌 수의 곱은?', mul(big, rest), `(${s[0]}*100+${s[1]}*10+${s[2]})*${s[3]}/100`, {
        figure: cards(d.shuffle(s)),
        explain: `가장 큰 소수 두 자리 수는 큰 수부터 차례로 놓은 ${S(big)}이고 남은 수는 ${s[3]}이다. ${told(big, rest)}이다.`,
        facts: { unseen: [10, 100] }
      });
    }),
    T('cards-nat-dec', '0이 있는 수 카드로 만든 자연수와 소수의 곱', '②58', (d) => {
      // 가장 작은 소수 두 자리 수는 일의 자리에 0을 놓은 0.□□이다.
      const s = d.until(() => d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4).sort((p, q) => q - p), (v) => ((v[0] * 10 + v[1]) * (v[3] * 10 + v[2])) % 100 !== 0), big = nat(s[0] * 10 + s[1]), small = dec(s[3] * 10 + s[2], 2);
      return dAns('수 카드 5장이 있다. 2장을 골라 만들 수 있는 가장 큰 두 자리 수와, 3장을 골라 만들 수 있는 가장 작은 소수 두 자리 수 □.□□의 곱은? (한 수를 만들 때 수 카드는 한 번씩만 사용한다.)', mul(big, small), `(${s[0]}*10+${s[1]})*(0*100+${s[3]}*10+${s[2]})/100`, {
        figure: cards(d.shuffle(s.concat([0]))),
        explain: `가장 큰 두 자리 수는 ${S(big)}이다. 가장 작은 소수 두 자리 수는 일의 자리에 0을 놓고 작은 수부터 차례로 놓은 ${S(small)}이다. ${told(big, small)}이다.`,
        facts: { unseen: [10, 100] }
      });
    })
  ]);

  // ── 소수의 곱셈의 활용 ──
  B.addTypes('5-2-4', 'word', [
    T('word-each', '문장제: 같은 양이 여러 개', '①51 ②60 ③8 심44', (d, n) => {
      // 첫째 문항은 (소수 두 자리 수)×(한 자리 수), 둘째 문항은 (소수 한 자리 수)×(두 자리 수).
      if (n === 0) {
        const [x, c] = pair(d, () => [two(d, 12, 195), nat(d.int(3, 9))], clean);
        return word(`선물 한 개를 묶는 데 끈이 ${S(x)} m 필요하다. 선물 ${c.n}개를 묶는 데 필요한 끈은 모두 몇 m인가?`, [x, c], 'm', `${S(x)} m씩 ${c.n}개이므로 ${told(x, c)}(m)이다.`, { facts: { rule: 'eachTwo' } });
      }
      const [x, c] = pair(d, () => [one(d, 3, 19), nat(nz(d, 11, 24))], clean);
      return word(`주스가 한 병에 ${S(x)} L씩 들어 있다. ${c.n}병에 들어 있는 주스는 모두 몇 L인가?`, [x, c], 'L', `${S(x)} L씩 ${c.n}병이므로 ${told(x, c)}(L)이다.`, { facts: { rule: 'eachTens' } });
    }, { count: 2 }),
    T('word-each-whole', '문장제: 같은 양이 여러 개(답이 자연수)', '①51 심44', (d) => {
      const [x, c] = pair(d, () => [d.bool() ? two(d, 125, 475) : one(d, 15, 85), nat(d.int(4, 12))], (p, v) => p % P10[v.k] === 0);
      return word(`둘레가 ${S(x)} km인 호수의 둘레를 따라 ${c.n}바퀴 걸었다. 걸은 거리는 모두 몇 km인가?`, [x, c], 'km', `${S(x)} km씩 ${c.n}바퀴이므로 ${told(x, c)}(km)이다. 곱의 소수점 아래 끝자리가 0이면 자연수가 된다.`, { kind: 'nat' });
    }),
    T('word-days', '문장제: 날수를 스스로 꺼내 곱하기', '①52 ②61 심47', (d) => {
      const weeks = d.int(1, 3), days = weeks * 7, span = ['일주일', '2주일', '3주일'][weeks - 1], x = d.until(() => one(d, 6, 28), (v) => clean(v.n * days)), p = d.pick(NAMES);
      return word(`${name(p, '은/는')} 매일 ${S(x)} km씩 달린다. ${name(p, '이/가')} ${span} 동안 달리는 거리는 모두 몇 km인가?`, [x, nat(days)], 'km', `${span}은 ${days}일이다. ${S(x)} km씩 ${days}일 동안 달리므로 ${told(x, nat(days))}(km)이다.`, { facts: { unseen: [days] } });
    }),
    T('word-times-nat', '문장제: 자연수의 소수 배', '①53 ②62 ③19 심45', (d, n) => {
      // 첫째 문항은 1보다 작은 배(처음 양보다 작아진다), 둘째 문항은 1보다 큰 배.
      if (n === 0) {
        const [c, y] = pair(d, () => [nat(d.int(12, 48)), d.bool() ? one(d, 6, 9) : two(d, 62, 88)], clean);
        return word(`쌀 한 자루의 무게는 ${c.n} kg이고, 콩 한 자루의 무게는 쌀 한 자루의 무게의 ${S(y)}배이다. 콩 한 자루의 무게는 몇 kg인가?`, [c, y], 'kg', `${c.n} kg의 ${S(y)}배이므로 ${told(c, y)}(kg)이다. 1보다 작은 수를 곱했으므로 ${c.n} kg보다 가볍다.`, { facts: { rule: 'timesSmall' } });
      }
      const [c, y] = pair(d, () => [nat(d.int(2, 9)), two(d, 105, 295)], clean);
      return word(`집에서 학교까지의 거리는 ${c.n} km이고, 집에서 도서관까지의 거리는 집에서 학교까지의 거리의 ${S(y)}배이다. 집에서 도서관까지의 거리는 몇 km인가?`, [c, y], 'km', `${c.n} km의 ${S(y)}배이므로 ${told(c, y)}(km)이다.`, { facts: { rule: 'timesBig' } });
    }, { count: 2 }),
    T('word-times-whole', '문장제: 자연수의 소수 배(답이 자연수)', '①53 ②62', (d) => {
      const [c, y] = pair(d, () => [nat(d.pick([15, 20, 25, 30, 35, 40, 45, 50, 60])), one(d, 12, 28)], (p) => p % 10 === 0);
      return word(`도서관에 동화책이 ${c.n}권 있고, 과학책의 수는 동화책의 수의 ${S(y)}배이다. 과학책은 몇 권인가?`, [c, y], '권', `${c.n}권의 ${S(y)}배이므로 ${told(c, y)}(권)이다.`, { kind: 'nat' });
    }),
    T('word-times-dec-nat', '문장제: 소수의 자연수 배', '③9', (d) => {
      const [x, c] = pair(d, () => [two(d, 112, 298), nat(d.int(2, 6))], clean);
      return word(`빨간색 끈의 길이는 ${S(x)} m이고, 파란색 끈의 길이는 빨간색 끈의 길이의 ${c.n}배이다. 파란색 끈의 길이는 몇 m인가?`, [x, c], 'm', `${S(x)} m의 ${c.n}배이므로 ${told(x, c)}(m)이다.`);
    }),
    T('word-times-dec', '문장제: 소수의 소수 배', '①54 ②63 심45', (d, n) => {
      // 첫째 문항은 1보다 큰 배, 둘째 문항은 1보다 작은 배.
      if (n === 0) {
        const [x, y] = pair(d, () => [one(d, 21, 49), one(d, 12, 28)], clean);
        return word(`고양이의 무게는 ${S(x)} kg이고, 강아지의 무게는 고양이의 무게의 ${S(y)}배이다. 강아지의 무게는 몇 kg인가?`, [x, y], 'kg', `${S(x)} kg의 ${S(y)}배이므로 ${told(x, y)}(kg)이다.`, { facts: { rule: 'decBig' } });
      }
      const [x, y] = pair(d, () => [d.bool() ? one(d, 6, 48) : two(d, 105, 295), one(d, 2, 9)], clean), p = d.pick(NAMES);
      return word(`${name(p, '은/는')} 어제 ${S(x)} km를 걸었고, 오늘은 어제 걸은 거리의 ${S(y)}배를 걸었다. ${name(p, '이/가')} 오늘 걸은 거리는 몇 km인가?`, [x, y], 'km', `${S(x)} km의 ${S(y)}배이므로 ${told(x, y)}(km)이다. 1보다 작은 수를 곱했으므로 어제보다 적게 걸었다.`, { facts: { rule: 'decSmall' } });
    }, { count: 2 }),
    T('word-of', '문장제: 「~의 0.□만큼」', '①54 ②64 ③60 심45', (d) => {
      const [x, y] = pair(d, () => [one(d, 4, 98), one(d, 2, 9)], clean);
      return word(`넓이가 ${S(x)} m²인 텃밭의 ${S(y)}만큼에 상추를 심었다. 상추를 심은 부분의 넓이는 몇 m²인가?`, [x, y], 'm²', `${S(x)} m²의 ${S(y)}만큼은 ${S(x)} m²에 ${J(y, '을/를')} 곱한 것이다. ${told(x, y)}(m²)이다.`);
    }),
    T('word-rate', '문장제: 단위 하나의 양에 소수 곱하기', '①58 ②65 ③59 심46', (d, n) => {
      // 첫째 문항은 (자연수)×(소수 두 자리 수), 둘째 문항은 (소수 두 자리 수)×(소수 한 자리 수).
      if (n === 0) {
        const [c, y] = pair(d, () => [nat(d.int(3, 9)), two(d, 12, 98)], clean);
        return word(`굵기가 일정한 통나무 1 m의 무게는 ${c.n} kg이다. 이 통나무 ${S(y)} m의 무게는 몇 kg인가?`, [c, y], 'kg', `1 m의 무게에 길이를 곱한다. ${told(c, y)}(kg)이다.`, { facts: { rule: 'rateNat' } });
      }
      const [x, y] = pair(d, () => [dec(d.int(5, 15), 2), one(d, 4, 98)], (p, v) => clean(p) && clean(v.n));
      return word(`1 km를 달리는 데 휘발유 ${S(x)} L가 필요한 자동차가 있다. 이 자동차가 ${S(y)} km를 달리는 데 필요한 휘발유는 몇 L인가?`, [x, y], 'L', `1 km를 달리는 데 필요한 양에 달리는 거리를 곱한다. ${told(x, y)}(L)이다.`, { facts: { rule: 'rateDec' } });
    }, { count: 2 }),
    T('word-chain', '문장제: 거듭 곱하기', '②70 ③64 심51·53', (d, n) => {
      if (n === 0) {
        // 같은 배를 두 번
        const [c, y] = d.until(() => [d.int(2, 5), one(d, 4, 9)], ([k, v]) => clean(k * v.n * v.n)), x = nat(c);
        return word(`떨어진 높이의 ${S(y)}배만큼 튀어 오르는 공이 있다. 이 공을 ${c} m 높이에서 떨어뜨렸을 때, 두 번째로 튀어 오른 높이는 몇 m인가?`, [x, y, y], 'm', `첫 번째로 튀어 오른 높이는 ${told(x, y)}(m)이고, 두 번째로 튀어 오른 높이는 ${told(mul(x, y), y)}(m)이다.`);
      }
      // 서로 다른 배를 두 번(답이 자연수)
      const c = d.int(4, 9) * 1000, y = one(d, 4, 8), z = d.until(() => one(d, 3, 7), (v) => v.n !== y.n), p = d.pick(NAMES), mid = mul(nat(c), y);
      return word(`${name(p, '은/는')} 용돈 ${c}원의 ${S(y)}만큼을 썼고, 쓴 돈의 ${S(z)}만큼은 책을 사는 데 썼다. ${name(p, '이/가')} 책을 사는 데 쓴 돈은 몇 원인가?`, [nat(c), y, z], '원', `쓴 돈은 ${told(nat(c), y)}(원)이고, 책을 사는 데 쓴 돈은 ${told(mid, z)}(원)이다.`, { kind: 'nat' });
    }, { count: 2 }),
    T('word-three', '문장제: 글에 없는 수를 꺼내 세 수 곱하기', '심51 ①52', (d) => {
      const [x, c] = d.until(() => [d.bool() ? one(d, 2, 8) : two(d, 15, 45), d.int(2, 4)], ([v, k]) => clean(v.n * k * 7)), p = d.pick(NAMES);
      return word(`${name(p, '은/는')} 둘레가 ${S(x)} km인 운동장을 매일 ${c}바퀴씩 달린다. ${name(p, '이/가')} 일주일 동안 달리는 거리는 모두 몇 km인가?`, [x, nat(c), nat(7)], 'km', `하루에 달리는 거리는 ${told(x, nat(c))}(km)이고 일주일은 7일이므로 ${told(mul(x, nat(c)), nat(7))}(km)이다.`, { facts: { unseen: [7] } });
    }),
    T('word-ten', '문장제: 한 개의 양에 10, 100, 1000개', '①32 ②32 ③47 심18', (d) => {
      const x = two(d, 112, 989), i = ix(x), rs = [10, 100, 1000].map((m) => mul(x, nat(m)));
      return M(`구슬 한 개의 무게는 ${S(x)} g이다. 구슬 10개, 100개, 1000개의 무게는 각각 몇 g인가?`, rs.map((r, j) => inp(`${P10[j + 1]}개`, r, 'g')), {
        explain: `개수의 0이 하나씩 늘어날 때마다 소수점이 오른쪽으로 한 자리씩 옮겨진다. 차례로 ${rs.map((r) => `${S(r)} g`).join(', ')}이다.`,
        facts: { calc: rs.map((r, j) => [r.k ? `${S(x)}*${P10[j + 1]}` : `${i.s}*${P10[j + 1]}/100`, j]), unseen: i.un }
      });
    }),
    T('word-hundredth', '문장제: 자연수의 0.01배', '②32 ③19 심18·52', (d) => {
      const price = d.until(() => d.int(31, 98) * 100, (v) => v % 1000 !== 0);
      return N(`물건값의 0.01배만큼 점수를 쌓아 주는 가게가 있다. 이 가게에서 ${price}원짜리 물건을 사면 점수는 몇 점 쌓이는가?`, price / 100, {
        unit: '점', explain: `0.01을 곱하면 소수점이 왼쪽으로 두 자리 옮겨진다. ${price} × 0.01 = ${price / 100}(점)이다.`,
        facts: { calc: [[`${price}/100`, 0]], unseen: [100] }
      });
    }),
    T('word-half', '문장제: 30초를 0.5분으로 고쳐 곱하기', '①59 ②66 ③65 심47·55', (d) => {
      const [x, m] = d.until(() => [one(d, 22, 86), d.int(1, 4)], ([v, k]) => clean(v.n * (k * 10 + 5))), t = dec(m * 10 + 5, 1);
      return word(`1분에 ${S(x)} L씩 물이 나오는 수도로 ${m}분 30초 동안 물을 받았다. 받은 물은 모두 몇 L인가?`, [x, t], 'L', `30초는 0.5분이므로 ${m}분 30초는 ${S(t)}분이다. ${told(x, t)}(L)이다.`, { facts: { unseen: [V(t)] } });
    }),
    T('word-round-trip', '문장제: 단위를 소수로 고쳐 다녀온 거리 구하기', '③11', (d) => {
      const k = d.int(1, 4), m = d.pick([1, 2, 3, 4, 6, 7, 8, 9]) * 100, x = dec(k * 10 + m / 100, 1), r = mul(x, nat(2)), p = d.pick(NAMES);
      return dAns(`${nick(p)}네 집에서 도서관까지의 거리는 ${k} km ${m} m이다. ${name(p, '이/가')} 집에서 도서관까지 걸어서 다녀왔을 때 걸은 거리는 모두 몇 km인가?`, r, `(${k}+${m}/1000)*2`, {
        unit: 'km', explain: `${k} km ${m} m는 ${S(x)} km이다. 다녀온 거리는 가는 거리의 2배이므로 ${told(x, nat(2))}(km)이다.`,
        facts: { unseen: [1000, 2] }
      });
    })
  ]);

  // ── 도형에서 소수의 곱셈 ──
  const POLY = [['정삼각형', 3], ['정사각형', 4], ['정오각형', 5], ['정육각형', 6], ['정팔각형', 8]];
  B.addTypes('5-2-4', 'shape', [
    T('shape-perimeter', '정다각형의 둘레', '①67 ②78 심62', (d) => {
      const [shape, sides] = d.pick(POLY), x = d.until(() => (d.bool() ? one(d, 12, 98) : two(d, 105, 395)), (v) => clean(v.n * sides));
      return word(`한 변의 길이가 ${S(x)} cm인 ${shape}의 둘레는 몇 cm인가?`, [x, nat(sides)], 'cm', `${shape}은 길이가 같은 변이 ${sides}개이다. ${told(x, nat(sides))}(cm)이다.`, { facts: { unseen: [sides] } });
    }),
    T('shape-perimeter-max', '둘레가 가장 긴 정다각형 찾기', '③72 심62', (d) => {
      const rows = d.until(() => { const v0 = d.int(120, 300); return d.shuffle(POLY.slice(0, 4)).slice(0, 3).map(([shape, sides]) => ({ shape, sides, x: dec(Math.round((v0 + d.int(-9, 9)) / sides), 1) })); }, (list) => new Set(list.map((r) => r.x.n * r.sides)).size === 3 && list.every((r) => r.x.n % 10 !== 0 && r.x.n >= 12));
      const vals = rows.map((r) => r.x.n * r.sides), hit = vals.indexOf(Math.max(...vals));
      return C('둘레가 가장 긴 것은?', THREE, hit, {
        figure: tagged(rows.map((r) => `한 변의 길이가 ${S(r.x)} cm인 ${r.shape}`)),
        explain: `둘레는 ${rows.map((r, i) => `${LAB[i]} ${told(r.x, nat(r.sides))}(cm)`).join(', ')}이다. 가장 긴 것은 ${LAB[hit]}이다.`,
        facts: { choose: { exprs: rows.map((r) => `${S(r.x)}*${r.sides}`), rule: 'max' }, unseen: rows.map((r) => r.sides) }
      });
    }),
    T('shape-rect-perimeter', '직사각형의 둘레', '①68 심63', (d) => {
      const [x, y] = d.until(() => [one(d, 21, 98), two(d, 105, 895)], ([p, q]) => p.n * 10 > q.n && ((p.n * 10 + q.n) * 2) % 100 !== 0), sum = plus(x, y), r = mul(sum, nat(2));
      return dAns(`가로가 ${S(x)} m, 세로가 ${S(y)} m인 직사각형 모양의 텃밭의 둘레는 몇 m인가?`, r, `(${S(x)}+${S(y)})*2`, {
        unit: 'm', explain: `직사각형의 둘레는 가로와 세로의 합의 2배이다. ${S(x)} + ${S(y)} = ${S(sum)}이고 ${told(sum, nat(2))}(m)이다.`, facts: { unseen: [2] }
      });
    }),
    T('shape-area', '변의 길이가 소수인 도형의 넓이', '①65·66 ②79·80 ③69·70 심64', (d, n) => {
      // 문항마다 도형이 다르다: 직사각형, 정사각형(같은 수를 두 번 곱한다), 평행사변형(밑변과 높이).
      if (n === 0) {
        const [x, y] = pair(d, () => [two(d, 112, 895), one(d, 12, 68)], clean);
        return word(`가로가 ${S(x)} m, 세로가 ${S(y)} m인 직사각형 모양의 밭의 넓이는 몇 m²인가?`, [x, y], 'm²', `직사각형의 넓이는 가로와 세로의 곱이다. ${told(x, y)}(m²)이다.`, { facts: { rule: 'areaRect' } });
      }
      if (n === 1) {
        const x = d.until(() => one(d, 6, 98), (v) => clean(v.n * v.n));
        return word(`한 변의 길이가 ${S(x)} m인 정사각형 모양의 꽃밭의 넓이는 몇 m²인가?`, [x, x], 'm²', `정사각형의 넓이는 한 변의 길이를 두 번 곱한 것이다. ${told(x, x)}(m²)이다.`, { facts: { rule: 'areaSquare' } });
      }
      const [x, y] = pair(d, () => (d.bool() ? [one(d, 21, 98), two(d, 105, 495)] : [nat(d.int(6, 15)), one(d, 21, 98)]), clean);
      return word(`밑변의 길이가 ${S(x)} cm, 높이가 ${S(y)} cm인 평행사변형의 넓이는 몇 cm²인가?`, [x, y], 'cm²', `평행사변형의 넓이는 밑변의 길이와 높이의 곱이다. ${told(x, y)}(cm²)이다.`, { facts: { rule: 'areaPara' } });
    }, { count: 3 }),
    T('shape-area-many', '크기가 같은 직사각형 여러 장의 넓이', '①65 ②82', (d) => {
      const [x, y, c] = d.until(() => [one(d, 6, 18), one(d, 12, 25), d.int(3, 9)], ([p, q, k]) => clean(p.n * q.n * k) && p.n !== q.n);
      return word(`가로가 ${S(x)} m, 세로가 ${S(y)} m인 직사각형 모양의 천이 ${c}장 있다. 천의 넓이는 모두 몇 m²인가?`, [x, y, nat(c)], 'm²', `천 한 장의 넓이는 ${told(x, y)}(m²)이고, ${c}장의 넓이는 ${told(mul(x, y), nat(c))}(m²)이다.`);
    }),
    T('shape-area-compare', '두 도형의 넓이 비교', '①70 심64', (d) => {
      // 틀린 보기: 넓이가 좁은 쪽, 소수점을 한 자리 잘못 찍은 차
      const m = d.until(() => { const s = one(d, 21, 68), x = one(d, 21, 98); return { s, x, y: dec(Math.round(s.n * s.n / x.n) + d.int(-3, 3), 1) }; }, (v) => v.y.n >= 12 && v.y.n % 10 !== 0 && v.x.n !== v.y.n && v.x.n * v.y.n !== v.s.n * v.s.n && Math.abs(v.x.n * v.y.n - v.s.n * v.s.n) % 10 !== 0);
      const flip = d.bool(), rows = flip ? [[m.s, m.s], [m.x, m.y]] : [[m.x, m.y], [m.s, m.s]], vals = rows.map((row) => digits(row)), winner = vals[0] > vals[1] ? 0 : 1, gap = Math.abs(vals[0] - vals[1]);
      const tell = (row, i) => ((i === 0) === flip ? `한 변의 길이가 ${S(row[0])} m인 정사각형 모양` : `가로가 ${S(row[0])} m, 세로가 ${S(row[1])} m인 직사각형 모양`);
      const list = d.shuffle([[0, gap], [1, gap], [0, gap * 10], [1, gap * 10]]), sc = scaled(rows);
      return C(`가 밭은 ${tell(rows[0], 0)}이고, 나 밭은 ${tell(rows[1], 1)}이다. 어느 밭이 몇 m² 더 넓은가?`, list.map(([who, g]) => `${['가', '나'][who]} 밭, ${S(dec(g, 2))} m²`), list.findIndex(([who, g]) => who === winner && g === gap), {
        explain: `가 밭의 넓이는 ${told(...rows[0])}(m²), 나 밭의 넓이는 ${told(...rows[1])}(m²)이다. ${['가', '나'][winner]} 밭이 ${S(dec(gap, 2))} m² 더 넓다.`,
        facts: { who: { values: vals, exprs: sc.exprs, options: list }, unseen: sc.un }
      });
    })
  ]);

  // ── 실력 ──
  B.addGroup('5-2-4', {
    id: 'hard', title: '단원 종합', standard: STD,
    types: [
      // ── ① 문제의 상황·수에 함정이 있어 뜻을 정확히 대야 풀리는 문제 ──
      H('hard-size-count', '계산하지 않고 기준보다 큰 곱 세기', '기본 ①40 ③49', (d) => {
        // 함정: 0.99처럼 1에 아주 가까운 수를 곱해도 작아지고 1.01을 곱해도 커진다. 1을 곱한 것을 「크다」에 넣는 아이, 순서가 바뀐 식에서 앞의 수만 보는 아이,
        //  「소수를 곱하면 작아진다」고 외워 1.2를 곱해도 작아진다고 하는 아이가 걸린다. 끝이 s 인 것은 곱하는 순서를 바꾸어 적는다.
        const A = d.bool() ? nat(d.int(12, 98)) : one(d, 12, 98), plan = d.pick([['U', 'O', 'P', 'Bs'], ['U', 'O', 'Ps', 'D'], ['D', 'Bs', 'O', 'U'], ['P', 'O', 'Ds', 'Us'], ['U', 'Bs', 'P', 'D'], ['Us', 'O', 'D', 'B']]);
        // U: 1.01~1.09, D: 0.91~0.99, B: 1보다 큰 소수 한 자리 수, P: 1보다 작은 소수 한 자리 수, O: 1
        const one1 = (code) => (code[0] === 'U' ? two(d, 101, 109) : code[0] === 'D' ? two(d, 91, 99) : code[0] === 'B' ? one(d, 11, 38) : code[0] === 'P' ? one(d, 2, 9) : nat(1));
        const rows = d.until(() => d.shuffle(plan).map((code) => ({ m: one1(code), swap: code.endsWith('s') })), (list) => new Set(list.map((r) => S(r.m)).concat([S(A)])).size === 5);
        const flags = rows.map((r) => r.m.n > P10[r.m.k]), hits = rows.map((r, i) => (flags[i] ? LAB[i] : '')).filter(Boolean);
        return N(`계산하지 않고 알아보려고 한다. 계산 결과가 ${S(A)}보다 큰 것은 모두 몇 개인가?`, hits.length, {
          unit: '개', figure: tagged(rows.map((r) => times(r.swap ? [r.m, A] : [A, r.m]))),
          explain: `${S(A)}에 1보다 큰 수를 곱한 것만 ${S(A)}보다 크다. 곱하는 순서를 바꾸어도 계산 결과는 같고, 1을 곱하면 크기가 그대로이다. 1보다 큰 수를 곱한 것은 ${hits.join(', ')}이다.`,
          facts: { count: flags }
        });
      }),
      H('hard-places-min', '곱의 소수점 아래 자리 수가 가장 적은 식 찾기', '심17', (d) => {
        // 함정: 자리 수의 합이 가장 큰 식(소수 두 자리 수 × 소수 한 자리 수)의 곱이 끝자리 0 두 개가 사라져 소수 한 자리 수가 된다.
        //  「곱의 소수점 아래 자리 수 = 두 수의 자리 수의 합」으로만 외운 아이는 자리 수의 합이 2인 식을 고른다.
        const short = () => pair(d, () => [two(d, 5, 475), one(d, 2, 48)], (p) => p % 100 === 0 && p % 1000 !== 0);
        const twoP = () => pair(d, () => [one(d, 2, 98), one(d, 2, 98)], clean), threeP = () => pair(d, () => [two(d, 12, 498), one(d, 2, 98)], clean);
        const rows = d.shuffle(d.until(() => [short(), twoP(), twoP(), threeP()], (list) => list.every((p, i) => list.every((q, j) => i >= j || !shares(p, q))))), ks = rows.map((row) => mul(...row).k), hit = ks.indexOf(1);
        return C('곱을 소수로 나타낼 때, 소수점 아래 자리 수가 가장 적은 것은?', LAB, hit, {
          figure: tagged(rows.map(times)),
          explain: `계산 결과는 ${rows.map((row, i) => `${LAB[i]} ${S(mul(...row))}`).join(', ')}이다. ${LAB[hit]}은 ${rows[hit][0].n} × ${rows[hit][1].n} = ${digits(rows[hit])}에서 소수점을 왼쪽으로 세 자리 옮기면 ${fx(digits(rows[hit]), 3)}이고, 끝자리 0을 떼면 소수 한 자리 수 ${S(mul(...rows[hit]))}이다.`,
          facts: { only: { values: ks, test: 'atMost', target: 1 } }
        });
      }),
      H('hard-zero-wrong', '끝자리 0을 먼저 지우고 소수점을 찍은 계산 바로잡기', '심34', (d) => {
        // 함정: 자연수의 곱 120에서 0을 먼저 지우고(12) 소수 두 자리 수라고 0.12로 적었다. 0.24가 소수 두 자리 수이니 답도 소수 두 자리 수라고 여기는 아이는 틀린 곳을 찾지 못한다.
        const [x, c] = pair(d, () => [two(d, 12, 98), nat(d.pick([2, 4, 5, 6, 8]))], (p) => p % 10 === 0 && p % 100 !== 0), p = x.n * c.n, who = d.pick(NAMES);
        return ans(`${name(who, '은/는')} ${S(x)} × ${josa(c.n, '을/를')} 다음과 같이 계산하였다. 바르게 계산한 값은?`, [x, c], {
          figure: lines([`${x.n} × ${c.n} = ${p}에서 끝자리 0을 지우면 ${p / 10}이다.`, `${J(x, '이/가')} 소수 두 자리 수이므로 ${S(x)} × ${c.n} = ${fx(p / 10, 2)}이다.`]),
          explain: `소수점은 0을 지우기 전의 ${p}에 찍어야 한다. ${p}에서 소수점을 왼쪽으로 두 자리 옮기면 ${fx(p, 2)}이고, 끝자리 0을 떼면 ${S(mul(x, c))}이다.`
        });
      }),
      H('hard-natural-zero', '끝자리가 0인 자연수의 곱으로 소수의 곱 구하기', '심22', (d) => {
        // 함정: 자연수의 곱의 끝자리가 0 두 개다. 0을 먼저 지우고 소수점을 찍는 아이(900 → 9 → 0.09), 자리 수의 합만큼 꼭 소수 자리가 남는다고 여기는 아이가 걸린다.
        //  두 식은 소수점 아래 자리 수의 합이 2와 3으로 다르고, 첫 식의 곱은 자연수가 된다.
        const [x, y] = d.until(() => [nz(d, 12, 98), nz(d, 12, 98)], ([p, q]) => (p * q) % 100 === 0 && (p * q) % 1000 !== 0), p = x * y, rows = [[dec(x, 1), dec(y, 1)], d.bool() ? [dec(x, 2), dec(y, 1)] : [dec(x, 1), dec(y, 2)]], i = px(rows[0]);
        return M(`${x} × ${y} = ${p}이다. ㉠, ㉡에 알맞은 수는?`, rows.map((row, j) => inp(LAB[j], mul(...row))), {
          figure: lines(rows.map((row, j) => eq(S(row[0]), '*', S(row[1]), '=', box(LAB[j])))),
          explain: `${p}에서 소수점을 왼쪽으로 두 자리 옮기면 ${fx(p, 2)}이고 끝자리 0을 떼면 ${p / 100}이다. 세 자리 옮기면 ${fx(p, 3)}이고 끝자리 0을 떼면 ${S(dec(p, 3))}이다. 끝자리 0은 소수점을 찍은 다음에 뗀다.`,
          facts: { calc: [[`${i.s}/100`, 0], [`${S(rows[1][0])}*${S(rows[1][1])}`, 1]], unseen: i.un.concat([100]), rule: 'naturalZero' }
        });
      }),
      H('hard-same-count', '숫자 배열이 같은 곱 가운데 계산 결과가 주어진 수인 것 세기', '심23 / 기본 ①27 ②22·30', (d) => {
        // 함정: 한 수는 10배, 다른 수는 1/1000배가 된 식(13.4 × 0.26이 아니라 1340 × 0.026 꼴)이 섞여 있다. 소수점 아래 자리 수의 합만 세는 아이는 0.134 × 260을 소수 세 자리 수라고 한다.
        const [a, b] = d.until(() => [nz(d, 112, 989), nz(d, 12, 98)], ([p, q]) => clean(p * q) && p * q < 100000), p = a * b;
        const yes = [[dec(a, 1), dec(b, 1)], [dec(a, 2), nat(b)], [nat(a), dec(b, 2)], [dec(a, 3), nat(b * 10)]], no = [[dec(a, 2), dec(b, 1)], [dec(a, 1), nat(b)], [dec(a, 3), nat(b)], [dec(a, 2), nat(b * 10)], [dec(a, 3), nat(b * 100)]];
        const k = d.int(1, 3), rows = d.until(() => d.shuffle(d.shuffle(yes).slice(0, k).concat(d.shuffle(no).slice(0, 4 - k))), (list) => list.some((row) => row[1].n % 10 === 0)), flags = rows.map((row) => digits(row) * P10[3 - places(row)] === p * 10);
        return N(`${a} × ${b} = ${p}이다. 계산 결과가 ${fx(p, 2)}인 것은 모두 몇 개인가?`, flags.filter(Boolean).length, {
          unit: '개', figure: tagged(rows.map(times)),
          explain: `계산 결과는 ${rows.map((row, i) => `${LAB[i]} ${S(mul(...row))}`).join(', ')}이다. 곱하는 수가 10배, 100배가 되면 곱의 소수점은 오른쪽으로 옮겨진다. ${fx(p, 2)}인 것은 ${rows.map((row, i) => (flags[i] ? LAB[i] : '')).filter(Boolean).join(', ')}이다.`,
          facts: { count: flags }
        });
      }),
      H('hard-ten-chain', '10배와 0.01배를 이어서 한 수', '심21 / 기본 ②29 ③43', (d) => {
        // 함정: 「10배」와 「0.01배」가 한 문장에 섞여 있다. 두 번 다 같은 쪽으로 소수점을 옮기는 아이, 앞의 배만 쓰는 아이가 걸린다.
        const [m1, m2] = d.pick([[nat(10), dec(1, 2)], [dec(1, 2), nat(10)], [nat(100), dec(1, 1)], [dec(1, 1), nat(100)], [nat(1000), dec(1, 2)]]);
        const x = d.until(() => (d.bool() ? one(d, 12, 98) : two(d, 105, 895)), (v) => { const mid = mul(v, m1), r = mul(v, m1, m2); return r.k >= 1 && r.k <= 3 && mid.k <= 3; }), mid = mul(x, m1), r = mul(mid, m2);
        return dAns(`㉠은 ${S(x)}의 ${S(m1)}배인 수이고, ㉡은 ㉠의 ${S(m2)}배인 수이다. ㉡에 알맞은 수는?`, r, `${S(x)}*${S(m1)}*${S(m2)}`, {
          explain: `㉠은 ${told(x, m1)}이고, ㉡은 ${told(mid, m2)}이다. 10배, 100배 하면 소수점이 오른쪽으로, 0.1배, 0.01배 하면 왼쪽으로 옮겨진다.`
        });
      }),
      H('hard-unit-mix', '문장제: 단위가 다른 두 길이로 넓이 구하기', '심46 / 기본 ①65', (d) => {
        // 함정: 가로는 m, 세로는 cm로 적혀 있다. 적힌 수를 그대로 곱하는 아이(1.5 × 80)가 걸린다. 80 cm를 0.8 m로 고쳐야 m²가 된다.
        const [x, c] = d.until(() => [one(d, 12, 38), d.pick([30, 40, 60, 70, 80, 90, 45, 65, 75, 85])], ([v, k]) => mul(v, dec(k, 2)).k > 0), y = dec(c, 2);
        return dAns(`가로가 ${S(x)} m, 세로가 ${c} cm인 직사각형 모양의 천의 넓이는 몇 m²인가?`, mul(x, y), `${S(x)}*${c}/100`, {
          unit: 'm²', explain: `넓이를 m²로 구하려면 두 길이를 모두 m로 나타내야 한다. ${c} cm는 ${S(y)} m이므로 ${told(x, y)}(m²)이다.`, facts: { unseen: [100] }
        });
      }),
      H('hard-balance', '곱이 같아지도록 □ 채우기', '기본 ③42 ②26', (d) => {
        // 함정: 오른쪽 식의 한 수가 왼쪽의 1/10배(10배)가 되었다. 「□도 1/10배(10배)」라고 같은 쪽으로 옮기는 아이가 걸린다. 곱이 같으려면 □는 거꾸로 10배(1/10배)가 되어야 한다.
        const down = d.bool(), [x, y] = d.until(() => (down ? [two(d, 112, 989), one(d, 12, 98)] : [one(d, 12, 98), two(d, 12, 98)]), ([p, q]) => clean(p.n * q.n) && p.n * q.n < 100000);
        const y2 = down ? dec(y.n, 2) : dec(y.n, 1), ansX = down ? dec(x.n, 1) : dec(x.n, 2);
        return dAns('□ 안에 알맞은 수는?', ansX, `${S(x)}*${S(y)}/${S(y2)}`, {
          figure: eq(S(x), '*', S(y), '=', box(), '*', S(y2)),
          explain: `${J(y2, '은/는')} ${S(y)}의 ${down ? `${part(1)}배` : '10배'}이다. 곱이 같으려면 다른 수는 ${down ? '10배' : `${part(1)}배`}가 되어야 하므로 □는 ${S(x)}의 ${down ? '10배' : `${part(1)}배`}인 ${S(ansX)}이다.`,
          facts: { rule: 'balance' }
        });
      }),
      H('hard-digit-box', '곱보다 큰 소수의 □ 안에 들어갈 수 있는 숫자', '심38 / 기본 ②55', (d) => {
        // 함정: 곱은 W.fg 이고 오른쪽 수의 소수 둘째 자리 e 는 g 보다 작다. 소수 첫째 자리만 견주어 □에 f 도 넣는 아이가 걸린다(f 를 넣으면 오른쪽 수가 더 작다).
        const [c, y] = pair(d, () => [nat(d.int(3, 9)), two(d, 212, 989)], (p) => { const f = Math.floor(p / 10) % 10, g = p % 10; return f >= 2 && f <= 7 && g >= 3; }), p = c.n * y.n, W = Math.floor(p / 100), f = Math.floor(p / 10) % 10, g = p % 10, e = d.int(1, g - 1), i = px([c, y]);
        return N('0부터 9까지의 수 가운데 □ 안에 들어갈 수 있는 수는 모두 몇 개인가?', 9 - f, {
          unit: '개', figure: eq(S(c), '*', S(y), '<', `${W}.${box()}${e}`),
          explain: `${told(c, y)}이다. □ 안에 ${f}${dj(String(f), '을/를').slice(-1)} 넣으면 ${W}.${f}${e}${dj(String(e), '이/가').slice(-1)} 되어 ${fx(p, 2)}보다 작다. □ 안에는 ${f}보다 큰 수 ${Array.from({ length: 9 - f }, (_, j) => f + 1 + j).join(', ')}만 들어갈 수 있으므로 ${9 - f}개이다.`,
          facts: { digit: { template: `${i.s}<${W}*100+□*10+${e}`, lo: 0, hi: 9, ask: 'count' } }
        });
      }),
      H('hard-box-exact', '한쪽 곱이 자연수로 떨어질 때 두 곱 사이의 자연수', '심37', (d) => {
        // 함정: 오른쪽 곱이 꼭 자연수 K 로 떨어진다. 「K보다 작은 자연수」에 K 를 넣어 세는 아이가 걸린다.
        const right = pair(d, () => [nat(d.pick([4, 5, 8, 12, 15, 20])), d.bool() ? one(d, 5, 95) : two(d, 25, 175)], (p, x, y) => p % P10[y.k] === 0 && p / P10[y.k] >= 6 && p / P10[y.k] <= 30), K = mul(...right).n;
        const left = pair(d, () => [nat(d.int(2, 9)), two(d, 112, 698)], (p) => p % 100 !== 0 && p < (K - 2) * 100 && p > (K - 6) * 100), lo = Math.floor(digits(left) / 100) + 1, il = px(left), ir = px(right);
        return N('□ 안에 들어갈 수 있는 자연수는 모두 몇 개인가?', K - lo, {
          unit: '개', figure: lines([eq(S(left[0]), '*', S(left[1]), '<', box(), '<', S(right[0]), '*', S(right[1]))]),
          explain: `${told(...left)}, ${told(...right)}이다. □는 ${S(mul(...left))}보다 크고 ${K}보다 작은 자연수이다. ${josa(K, '은/는')} 들어갈 수 없으므로 ${lo}부터 ${K - 1}까지 ${K - lo}개이다.`,
          facts: { digit: { template: `${il.s}*${P10[2 - il.k]}<□*100<${ir.s}*${P10[2 - ir.k]}`, lo: 1, hi: K + 2, ask: 'count' }, rule: 'boxExact' }
        });
      }),
      H('hard-more-by', '문장제: 「몇 배만큼 더」 한 양', '기본 ②68 ③10 / 심49', (d) => {
        // 함정: 「어제의 0.4배만큼을 더」는 어제 양에 0.4배를 보탠 것이다. 곱한 값(늘어난 양)만 답하는 아이가 걸린다.
        const [x, y] = d.until(() => [one(d, 8, 18), one(d, 2, 5)], ([p, q]) => clean(p.n * q.n)), more = mul(x, y), r = plus(x, more), p = d.pick(NAMES);
        return dAns(`${name(p, '은/는')} 어제 물을 ${S(x)} L 마셨고, 오늘은 어제 마신 양의 ${S(y)}배만큼을 어제보다 더 마셨다. ${name(p, '이/가')} 오늘 마신 물은 몇 L인가?`, r, `${S(x)}+${S(x)}*${S(y)}`, {
          unit: 'L', explain: `어제보다 더 마신 양은 ${told(x, y)}(L)이다. 오늘 마신 물은 어제 마신 양에 이 양을 더한 ${S(x)} + ${S(more)} = ${S(r)}(L)이다.`
        });
      }),
      H('hard-left', '문장제: 0.□만큼을 쓰고 남은 양', '기본 ①55 ③62 / 심50', (d) => {
        // 함정: 주어진 소수는 「사용한 양」의 배이고 묻는 것은 「남은 양」이다. 곱한 값을 그대로 답하는 아이가 걸린다.
        const [x, y] = d.until(() => [d.bool() ? nat(d.int(2, 9)) : one(d, 12, 58), one(d, 2, 8)], ([p, q]) => clean(p.n * q.n) && mul(p, q).k > 0), used = mul(x, y), r = plus(x, used, -1);
        return dAns(`길이가 ${S(x)} m인 색 테이프의 ${S(y)}만큼을 사용하였다. 남은 색 테이프는 몇 m인가?`, r, `${S(x)}-${S(x)}*${S(y)}`, {
          unit: 'm', explain: `사용한 색 테이프는 ${told(x, y)}(m)이다. 남은 색 테이프는 ${S(x)} − ${S(used)} = ${S(r)}(m)이다.`
        });
      }),
      H('hard-different-wholes', '문장제: 전체가 다른 두 양의 0.□만큼 비교', '기본 ②69 ③61', (d) => {
        // 함정: 곱하는 소수가 더 큰 쪽이 더 많이 사용했다고 여기는 아이. 두 밀가루의 무게가 다르므로 사용한 양을 구해 보아야 한다(소수가 큰 쪽이 사용한 양은 더 적다).
        const m = d.until(() => ({ A: d.int(2, 6), Bn: d.int(4, 12), f: one(d, 5, 9), g: one(d, 2, 7) }), (v) => v.f.n > v.g.n && v.A * v.f.n < v.Bn * v.g.n && v.Bn * v.g.n - v.A * v.f.n <= 12 && clean(v.A * v.f.n) && clean(v.Bn * v.g.n));
        const [p, s] = pick(d, 2), rows = d.shuffle([[nat(m.A), m.f], [nat(m.Bn), m.g]]), sc = scaled(rows), v = sc.values;
        return C(`${name(p, '은/는')} 무게가 ${S(rows[0][0])} kg인 밀가루의 ${S(rows[0][1])}만큼을 사용하였고, ${name(s, '은/는')} 무게가 ${S(rows[1][0])} kg인 밀가루의 ${S(rows[1][1])}만큼을 사용하였다. 밀가루를 더 많이 사용한 사람은?`, [p, '두 사람이 사용한 양은 같다.', s], v[0] > v[1] ? 0 : 2, {
          explain: `${name(p, '이/가')} 사용한 밀가루는 ${told(...rows[0])}(kg), ${name(s, '이/가')} 사용한 밀가루는 ${told(...rows[1])}(kg)이다. 전체의 무게가 다르므로 곱하는 수의 크기만으로는 비교할 수 없다.`,
          facts: { choose: { exprs: sc.exprs, rule: 'compare' }, unseen: sc.un }
        });
      }),
      H('hard-extra-number', '문장제: 쓰지 않는 수가 섞인 「~의 0.□만큼」', '기본 ②64 / 심45', (d) => {
        // 함정: 탄수화물의 양을 나타내는 수는 쓰지 않는 조건이다. 적힌 수를 차례로 모두 곱하는 아이, 앞에 나온 수를 곱하는 아이가 걸린다.
        const [x, g] = pair(d, () => [one(d, 12, 48), dec(d.int(2, 8), 2)], clean), f = d.until(() => one(d, 2, 4), (v) => v.n !== g.n);
        return word(`무게가 ${S(x)} kg인 고구마가 있다. 이 고구마 무게의 ${S(f)}만큼은 탄수화물이고, ${S(g)}만큼은 단백질이다. 이 고구마에 들어 있는 단백질은 몇 kg인가?`, [x, g], 'kg', `단백질은 고구마 무게 ${S(x)} kg의 ${S(g)}만큼이다. 탄수화물의 양은 쓰지 않는다. ${told(x, g)}(kg)이다.`);
      }),
      H('hard-stretch-shrink', '가로를 늘이고 세로를 줄인 직사각형의 넓이 비교', '심66 / 기본 ①71 ②81', (d) => {
        // 함정: 1.2배로 늘이고 0.8배로 줄이면 「늘인 만큼 줄였으니 같다」고 여기는 아이. 넓이는 1.2 × 0.8 = 0.96(배)가 되어 좁아진다. 1.25배와 0.8배처럼 꼭 같아지는 경우도 있다.
        const [u, v] = d.pick([[dec(12, 1), dec(8, 1)], [dec(15, 1), dec(5, 1)], [dec(125, 2), dec(8, 1)], [dec(16, 1), dec(7, 1)], [dec(25, 1), dec(4, 1)], [dec(14, 1), dec(8, 1)], [dec(11, 1), dec(9, 1)], [dec(15, 1), dec(8, 1)], [dec(13, 1), dec(7, 1)], [dec(14, 1), dec(6, 1)]]);
        const sc = scaled([[u, v], [nat(1)]]), w = sc.values, r = mul(u, v);
        return C(`직사각형의 가로를 ${S(u)}배로 늘이고 세로를 ${S(v)}배로 줄여 새로운 직사각형을 만들었다. 새로운 직사각형의 넓이는 처음 직사각형의 넓이와 비교하여 어떠한가?`, ['처음보다 넓다.', '처음과 같다.', '처음보다 좁다.'], w[0] > w[1] ? 0 : w[0] === w[1] ? 1 : 2, {
          explain: `넓이는 가로와 세로의 곱이므로 새로운 직사각형의 넓이는 처음 넓이의 ${told(u, v)}(배)이다. ${r.k === 0 ? '1배이므로 넓이는 처음과 같다.' : `${S(r)}${dj(S(r), '은/는').slice(-1)} 1보다 ${r.n > P10[r.k] ? '크므로 처음보다 넓다' : '작으므로 처음보다 좁다'}.`}`,
          facts: { choose: { exprs: sc.exprs, rule: 'compare' }, unseen: sc.un.concat([1]) }
        });
      }),
      H('hard-ten-area', '가로와 세로가 각각 10배인 직사각형의 넓이는 몇 배', '심28 / 기본 ①28', (d) => {
        // 함정: 가로도 10배, 세로도 10배이면 넓이는 10배가 아니라 100배이다. 넓이를 직접 곱해 구하려 들면 수가 너무 커서 풀 수 없고, 곱의 소수점 위치를 대야 한다.
        const [j1, j2] = d.pick([[1, 1], [1, 1], [1, 2], [2, 1]]), x = d.until(() => three(d, 1012, 4898), (v) => v.n % 10 !== 0), y = d.until(() => three(d, 1012, 4898), (v) => v.n !== x.n), X = dec(x.n, 3 - j1), Y = dec(y.n, 3 - j2), times10 = P10[j1 + j2];
        const iX = ix(X), iY = ix(Y), i1 = ix(x), i2 = ix(y);
        return N(`직사각형 모양의 밭은 가로가 ${S(X)} m, 세로가 ${S(Y)} m이고, 직사각형 모양의 꽃밭은 가로가 ${S(x)} m, 세로가 ${S(y)} m이다. 밭의 넓이는 꽃밭의 넓이의 몇 배인가?`, times10, {
          unit: '배', explain: `밭의 가로는 꽃밭의 가로의 ${P10[j1]}배, 밭의 세로는 꽃밭의 세로의 ${P10[j2]}배이다. 넓이는 가로와 세로의 곱이므로 ${P10[j1]} × ${P10[j2]} = ${times10}(배)이다.`,
          facts: { calc: [[`${iX.s}*${iY.s}*1000*1000/(${i1.s}*${i2.s}*${P10[3 - j1]}*${P10[3 - j2]})`, 0]], unseen: iX.un.concat(iY.un, i1.un, i2.un, [1000, P10[3 - j1], P10[3 - j2]]) }
        });
      }),
      // ── ② 두 번 넘게 생각해야 풀리는 문제 ──
      H('hard-between', '두 곱 사이에 있는 자연수', '심37 / 기본 ①48 ②55 ③58', (d) => {
        const left = d.until(() => near(d, d.int(300, 3000), d.pick(['n2', '11', 'n1'])), (l) => sound(l) && cents(l) % 100 !== 0), base = cents(left);
        const rightRow = d.until(() => near(d, base + d.int(150, 560), d.pick(['n2', '11', 'n1'])), (r) => sound(r) && cents(r) % 100 !== 0 && cents(r) - base >= 110 && !shares(left, r) && Math.floor(cents(r) / 100) > Math.floor(base / 100));
        const lo = Math.floor(base / 100) + 1, hi = Math.floor(cents(rightRow) / 100), il = px(left), ir = px(rightRow);
        return N('□ 안에 들어갈 수 있는 자연수는 모두 몇 개인가?', hi - lo + 1, {
          unit: '개', figure: lines([eq(...left.reduce((out, x, i) => out.concat(i ? ['*', S(x)] : [S(x)]), []), '<', box(), '<', ...rightRow.reduce((out, x, i) => out.concat(i ? ['*', S(x)] : [S(x)]), []))]),
          explain: `${told(...left)}, ${told(...rightRow)}이다. □는 ${S(mul(...left))}보다 크고 ${S(mul(...rightRow))}보다 작은 자연수이므로 ${lo}부터 ${hi}까지 ${hi - lo + 1}개이다.`,
          facts: { digit: { template: `${il.s}*${P10[2 - il.k]}<□*100<${ir.s}*${P10[2 - ir.k]}`, lo: 1, hi: hi + 3, ask: 'count' }, rule: 'between' }
        });
      }),
      H('hard-wrong-any', '잘못 계산한 어떤 수를 구해 바르게 계산하기', '심39 / 기본 ①50 ②72 ③68', (d, n) => {
        // 첫째 문항은 곱해야 할 것을 더한 경우, 둘째 문항은 곱해야 할 것을 뺀 경우.
        const [x, y] = d.until(() => [one(d, 21, 98), one(d, 7, 29)], ([p, q]) => clean(p.n * q.n) && p.n > q.n + 5), got = plus(x, y, n === 0 ? 1 : -1), r = mul(x, y);
        return dAns(`어떤 수에 ${J(y, '을/를')} 곱해야 할 것을 잘못하여 ${n === 0 ? '더했더니' : '뺐더니'} ${J(got, '이/가')} 되었다. 바르게 계산한 값은?`, r, n === 0 ? `(${S(got)}-${S(y)})*${S(y)}` : `(${S(got)}+${S(y)})*${S(y)}`, {
          explain: `어떤 수는 ${S(got)} ${n === 0 ? '−' : '+'} ${S(y)} = ${S(x)}이다. 바르게 계산하면 ${told(x, y)}이다.`, facts: { rule: ['wrongAdd', 'wrongSub'][n] }
        });
      }, { count: 2 }),
      H('hard-calculator', '계산기에 잘못 누른 수 찾기', '기본 ①31 ②31 ③46', (d) => {
        // 한 수의 소수점만 잘못 눌렀다. 바르게 계산한 값과 나온 값을 견주어 몇 배가 되었는지 알아낸다.
        const down = d.bool(), [x, y] = pair(d, () => (down ? [one(d, 12, 98), one(d, 12, 98)] : [one(d, 12, 98), two(d, 12, 98)]), clean), right = mul(x, y), typed = down ? dec(y.n, 2) : dec(y.n, 1), got = mul(x, typed);
        return dAns(`계산기로 ${S(x)} × ${J(y, '을/를')} 계산하려고 하였는데, ${S(y)}의 소수점을 잘못 눌러 계산 결과가 ${J(got, '이/가')} 나왔다. ${S(y)} 대신 누른 수는?`, typed, `${S(got)}/${S(x)}`, {
          explain: `바르게 계산하면 ${told(x, y)}이다. 나온 값 ${J(got, '은/는')} 바른 값의 ${down ? `${part(1)}배` : '10배'}이므로 ${S(y)}의 ${down ? `${part(1)}배` : '10배'}인 ${J(typed, '을/를')} 누른 것이다.`
        });
      }),
      H('hard-missing-ten', '자연수의 곱을 보고 빠진 수 구하기(한 수가 몇십·몇백)', '심24 / 기본 ②28', (d) => {
        const [a, b] = d.until(() => [nz(d, 112, 989), nz(d, 12, 98)], ([p, q]) => clean(p * q) && p * q < 100000), p = a * b, [m, kx, kr] = d.pick([[10, 3, 2], [100, 3, 1], [10, 2, 1]]), x = dec(a, kx), r = dec(p, kr), known = nat(b * m);
        return dAns(`${a} × ${b} = ${p}이다. □ 안에 알맞은 수는?`, x, `${S(r)}/${S(known)}`, {
          figure: eq(box(), '*', S(known), '=', S(r)),
          explain: `${J(r, '은/는')} ${p}의 ${part(kr)}배이고 ${J(known, '은/는')} ${b}의 ${m}배이다. 곱이 ${part(kr)}배가 되려면 □는 ${a}의 ${part(kx)}배이어야 하므로 ${S(x)}이다.`,
          facts: { rule: 'missingTen' }
        });
      }),
      H('hard-two-products', '문장제: 두 곱을 구해 어느 쪽이 얼마나 더 많은지 알기', '심48 / 기본 ①56 ②69', (d) => {
        // 틀린 보기: 적은 쪽, 한 통의 양끼리의 차
        const m = d.until(() => ({ x1: one(d, 12, 28), c1: d.int(4, 9), x2: one(d, 12, 28), c2: d.int(4, 9) }), (v) => v.x1.n !== v.x2.n && v.c1 !== v.c2 && (v.x1.n > v.x2.n) === (v.c1 < v.c2) && v.x1.n * v.c1 !== v.x2.n * v.c2 && Math.abs(v.x1.n * v.c1 - v.x2.n * v.c2) <= 30 && Math.abs(v.x1.n * v.c1 - v.x2.n * v.c2) !== Math.abs(v.x1.n - v.x2.n));
        const rows = [[m.x1, nat(m.c1)], [m.x2, nat(m.c2)]], vals = rows.map(digits), winner = vals[0] > vals[1] ? 0 : 1, gap = Math.abs(vals[0] - vals[1]), other = Math.abs(m.x1.n - m.x2.n), names = ['노란색', '파란색'];
        const list = d.shuffle([[0, gap], [1, gap], [0, other], [1, other]]), sc = scaled(rows);
        return C(`노란색 물감은 ${S(m.x1)} L씩 ${m.c1}통, 파란색 물감은 ${S(m.x2)} L씩 ${m.c2}통 있다. 어느 색 물감이 몇 L 더 많은가?`, list.map(([who, g]) => `${names[who]} 물감, ${S(dec(g, 1))} L`), list.findIndex(([who, g]) => who === winner && g === gap), {
          explain: `노란색 물감은 ${told(...rows[0])}(L), 파란색 물감은 ${told(...rows[1])}(L)이다. ${names[winner]} 물감이 ${S(dec(gap, 1))} L 더 많다.`,
          facts: { who: { values: vals, exprs: sc.exprs, options: list }, unseen: sc.un }
        });
      }),
      H('hard-sum-then-mul', '문장제: 더하거나 뺀 뒤 곱하기', '심52 / 기본 ①57', (d, n) => {
        if (n === 0) {
          // 한 묶음의 양을 더한 다음 묶음 수를 곱한다.
          const [a, b, c, k] = d.until(() => [two(d, 12, 48), two(d, 32, 68), two(d, 22, 58), d.int(3, 8)], ([p, q, r, m]) => new Set([p.n, q.n, r.n]).size === 3 && clean((p.n + q.n + r.n) * m) && clean(p.n + q.n + r.n)), sum = dec(a.n + b.n + c.n, 2);
          return dAns(`가방 하나에 무게가 ${S(a)} kg인 수건, ${S(b)} kg인 물통, ${S(c)} kg인 도시락을 넣었다. 똑같이 넣은 가방 ${k}개에 든 물건의 무게는 모두 몇 kg인가?`, mul(sum, nat(k)), `(${S(a)}+${S(b)}+${S(c)})*${k}`, {
            unit: 'kg', explain: `가방 하나에 든 물건의 무게는 ${S(a)} + ${S(b)} + ${S(c)} = ${S(sum)}(kg)이다. 가방 ${k}개에 든 물건의 무게는 ${told(sum, nat(k))}(kg)이다.`
          });
        }
        // 그릇의 무게를 뺀 다음 그릇 수를 곱한다.
        const [e, f, k] = d.until(() => [one(d, 412, 698), one(d, 21, 68), d.int(3, 9)], ([p, q, m]) => clean(q.n * m)), full = plus(e, f), net = f;
        return dAns(`빈 통의 무게는 ${S(e)} g이고, 소금을 가득 채운 통의 무게는 ${S(full)} g이다. 똑같은 통 ${k}개에 가득 채운 소금의 무게는 모두 몇 g인가?`, mul(net, nat(k)), `(${S(full)}-${S(e)})*${k}`, {
          unit: 'g', explain: `통 하나에 채운 소금의 무게는 ${S(full)} − ${S(e)} = ${S(net)}(g)이다. 통 ${k}개에 채운 소금의 무게는 ${told(net, nat(k))}(g)이다.`
        });
      }, { count: 2 }),
      H('hard-at-least', '문장제: 곱한 뒤 적어도 몇 개인지 구하기', '심54 / 기본 ①63 ②71', (d) => {
        const [x, c] = pair(d, () => [two(d, 32, 98), nat(d.int(6, 15))], (p) => p % 100 !== 0), p = x.n * c.n, i = px([x, c]), k = Math.floor(p / 100) + 1;
        return N(`상자 하나를 묶는 데 끈이 ${S(x)} m 필요하다. 상자 ${c.n}개를 묶으려면 길이가 1 m인 끈을 적어도 몇 개 사야 하는가?`, k, {
          unit: '개', explain: `필요한 끈은 ${told(x, c)}(m)이다. 1 m짜리 끈 ${k - 1}개로는 모자라므로 적어도 ${k}개를 사야 한다.`,
          facts: { calc: [[`(${i.s}-${i.s}%100)/100+1`, 0]], unseen: i.un }
        });
      }),
      H('hard-first-amount', '문장제: 나누어 주고 남은 양으로 처음 양 구하기', '기본 ②67', (d) => {
        const [x, c] = pair(d, () => [two(d, 112, 198), nat(d.int(6, 14))], clean), rest = one(d, 3, 9), used = mul(x, c), r = plus(used, rest);
        return dAns(`리본을 한 사람에게 ${S(x)} m씩 ${c.n}명에게 나누어 주었더니 ${S(rest)} m가 남았다. 처음에 있던 리본은 몇 m인가?`, r, `${S(x)}*${c.n}+${S(rest)}`, {
          unit: 'm', explain: `나누어 준 리본은 ${told(x, c)}(m)이다. 처음에 있던 리본은 ${S(used)} + ${S(rest)} = ${S(r)}(m)이다.`
        });
      }),
      H('hard-candle', '문장제: 시간을 소수로 고쳐 곱한 뒤 남은 길이 구하기', '심55 / 기본 ②67', (d) => {
        const [x, h, L] = d.until(() => [one(d, 12, 28), d.int(1, 3), one(d, 152, 248)], ([p, q, w]) => w.n * 10 - p.n * (q * 10 + 5) >= 300 && (w.n * 10 - p.n * (q * 10 + 5)) % 100 !== 0), t = dec(h * 10 + 5, 1), burned = mul(x, t), r = plus(L, burned, -1);
        return dAns(`길이가 ${S(L)} cm인 양초에 불을 붙이면 한 시간에 ${S(x)} cm씩 탄다. 불을 붙인 지 ${h}시간 30분이 지났을 때, 남은 양초의 길이는 몇 cm인가?`, r, `${S(L)}-${S(x)}*${S(t)}`, {
          unit: 'cm', explain: `30분은 0.5시간이므로 ${h}시간 30분은 ${S(t)}시간이다. 탄 길이는 ${told(x, t)}(cm)이고, 남은 길이는 ${S(L)} − ${S(burned)} = ${S(r)}(cm)이다.`, facts: { unseen: [V(t)] }
        });
      }),
      H('hard-times-gap', '문장제: 몇 배인 양과 처음 양의 차', '심49 / 기본 ③63', (d) => {
        const [x, y] = pair(d, () => [one(d, 212, 298), one(d, 12, 16)], clean), big = mul(x, y), r = plus(big, x, -1), [p, s] = pick(d, 2);
        return dAns(`${nick(p)}의 몸무게는 ${S(x)} kg이고, ${nick(s)}의 몸무게는 ${nick(p)}의 몸무게의 ${S(y)}배이다. ${name(s, '은/는')} ${nick(p)}보다 몇 kg 더 무거운가?`, r, `${S(x)}*${S(y)}-${S(x)}`, {
          unit: 'kg', explain: `${nick(s)}의 몸무게는 ${told(x, y)}(kg)이다. ${name(s, '은/는')} ${nick(p)}보다 ${S(big)} − ${S(x)} = ${S(r)}(kg) 더 무겁다.`
        });
      }),
      H('hard-fuel', '문장제: 간 거리를 구해 다시 곱하기', '심57', (d) => {
        const [v, h, f] = d.until(() => [d.int(5, 9) * 10 + d.pick([0, 2, 4, 6, 8]), d.int(1, 2), dec(d.int(6, 14), 2)], ([p, q, r]) => clean(r.n) && mul(nat(p), dec(q * 10 + 5, 1), r).k > 0), t = dec(h * 10 + 5, 1), far = mul(nat(v), t);
        return dAns(`한 시간에 ${v} km를 가는 자동차가 있다. 이 자동차는 1 km를 가는 데 휘발유 ${S(f)} L를 쓴다. 이 자동차가 ${h}시간 30분 동안 갈 때 쓰는 휘발유는 몇 L인가?`, mul(far, f), `${v}*${S(t)}*${S(f)}`, {
          unit: 'L', explain: `${h}시간 30분은 ${S(t)}시간이므로 간 거리는 ${told(nat(v), t)}(km)이다. 쓰는 휘발유는 ${told(far, f)}(L)이다.`, facts: { unseen: [V(t)] }
        });
      }),
      H('hard-rect-ratio', '세로가 가로의 몇 배인 직사각형의 넓이와 둘레', '심65 / 기본 ①68', (d, n) => {
        if (n === 0) {
          const [c, y] = d.until(() => [d.int(6, 24), one(d, 12, 28)], ([p, q]) => clean(p * q.n) && clean(p * p * q.n) && p * p * q.n < 10000), x = nat(c), tall = mul(x, y);
          return dAns(`직사각형의 가로는 ${c} cm이고 세로는 가로의 ${S(y)}배이다. 이 직사각형의 넓이는 몇 cm²인가?`, mul(x, tall), `${c}*${c}*${S(y)}`, {
            unit: 'cm²', explain: `세로는 ${told(x, y)}(cm)이다. 넓이는 ${told(x, tall)}(cm²)이다.`
          });
        }
        const [x, y] = d.until(() => [one(d, 32, 98), one(d, 12, 18)], ([p, q]) => clean(p.n * q.n) && ((p.n * 10 + p.n * q.n) * 2) % 100 !== 0), tall = mul(x, y), sum = plus(x, tall), r = mul(sum, nat(2));
        return dAns(`직사각형의 가로는 ${S(x)} cm이고 세로는 가로의 ${S(y)}배이다. 이 직사각형의 둘레는 몇 cm인가?`, r, `(${S(x)}+${S(x)}*${S(y)})*2`, {
          unit: 'cm', explain: `세로는 ${told(x, y)}(cm)이다. 둘레는 가로와 세로의 합의 2배이므로 ${S(x)} + ${S(tall)} = ${S(sum)}, ${told(sum, nat(2))}(cm)이다.`, facts: { unseen: [2] }
        });
      }, { count: 2 }),
      H('hard-scale-rect', '가로와 세로를 각각 몇 배로 늘인 직사각형의 넓이', '심66 / 기본 ①71 ②81 ③71', (d) => {
        const [x, c, k] = d.until(() => [one(d, 25, 85), d.int(3, 8), one(d, 12, 15)], ([p, q, m]) => clean(p.n * m.n) && clean(q * m.n) && clean(p.n * m.n * q * m.n) && p.n * m.n <= 999 && q * m.n <= 99), y = nat(c), nx = mul(x, k), ny = mul(y, k);
        return dAns(`가로가 ${S(x)} cm, 세로가 ${c} cm인 직사각형의 가로와 세로를 각각 ${S(k)}배로 늘여 새로운 직사각형을 만들었다. 새로운 직사각형의 넓이는 몇 cm²인가?`, mul(nx, ny), `${S(x)}*${S(k)}*${c}*${S(k)}`, {
          unit: 'cm²', explain: `새로운 직사각형의 가로는 ${told(x, k)}(cm), 세로는 ${told(y, k)}(cm)이다. 넓이는 ${told(nx, ny)}(cm²)이다.`
        });
      }),
      H('hard-perimeter-chain', '한 도형의 둘레가 다른 도형의 한 변인 정다각형의 둘레', '기본 ①67', (d) => {
        const [shape, sides] = d.pick([['정삼각형', 3], ['정육각형', 6]]), x = d.until(() => one(d, 12, 28), (v) => clean(v.n * 4 * sides) && clean(v.n * 4)), side = mul(x, nat(4));
        return word(`한 변의 길이가 ${S(x)} cm인 정사각형이 있다. 이 정사각형의 둘레와 한 변의 길이가 같은 ${shape}의 둘레는 몇 cm인가?`, [x, nat(4), nat(sides)], 'cm', `정사각형의 둘레는 ${told(x, nat(4))}(cm)이다. ${shape}의 한 변의 길이가 ${S(side)} cm이므로 둘레는 ${told(side, nat(sides))}(cm)이다.`, { facts: { unseen: [4, sides] } });
      }),
      H('hard-cards-max', '수 카드로 곱이 가장 큰 (자연수)×(소수) 만들기', '기본 ③75 / 심42', (d) => {
        // 가장 큰 수를 자연수 자리에 놓은 식과 둘째로 큰 수를 자연수 자리에 놓은 식 둘만 견주면 된다.
        const s = d.until(() => d.shuffle([2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3).sort((p, q) => q - p), (v) => { const all = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]].map(([i, j, k]) => v[i] * (v[j] * 10 + v[k])).sort((p, q) => q - p); return all[0] !== all[1] && all[0] % 100 !== 0; });
        const c1 = s[0] * (s[1] * 10 + s[2]), c2 = s[1] * (s[0] * 10 + s[2]), best = c1 > c2 ? [s[0], s[1], s[2]] : [s[1], s[0], s[2]];
        return dAns('수 카드 3장을 한 번씩 모두 사용하여 다음과 같은 곱셈식을 만들려고 한다. 계산 결과가 가장 클 때의 값은?', dec(Math.max(c1, c2), 2), `${best[0]}*(0*100+${best[1]}*10+${best[2]})/100`, {
          figure: cards(d.shuffle(s)) + eq(box(), '*', `0.${box()}${box()}`),
          explain: `큰 수를 자연수 자리와 소수 첫째 자리에 놓아야 한다. ${s[0]} × 0.${s[1]}${s[2]} = ${S(dec(c1, 2))}, ${s[1]} × 0.${s[0]}${s[2]} = ${S(dec(c2, 2))}이므로 가장 큰 값은 ${S(dec(Math.max(c1, c2), 2))}이다.`,
          facts: { unseen: [0, 10, 100] }
        });
      }),
      H('hard-notch', '귀퉁이를 잘라 낸 도형의 넓이', '심67', (d) => {
        const m = d.until(() => ({ W: one(d, 32, 68), Ht: one(d, 22, 48), a: one(d, 12, 38), b: one(d, 12, 28) }), (v) => v.W.n - v.a.n >= 12 && v.Ht.n - v.b.n >= 8 && v.Ht.n < v.W.n && clean(v.a.n * v.Ht.n) && clean((v.W.n - v.a.n) * v.b.n) && (v.W.n - v.a.n) % 10 !== 0 && (v.a.n * v.Ht.n + (v.W.n - v.a.n) * v.b.n) % 100 !== 0);
        const rest = dec(m.W.n - m.a.n, 1), p1 = mul(m.a, m.Ht), p2 = mul(rest, m.b), r = plus(p1, p2);
        return dAns('직사각형 모양의 종이에서 오른쪽 위 귀퉁이를 직사각형 모양으로 잘라 내었더니 그림과 같은 도형이 되었다. 이 도형의 넓이는 몇 cm²인가?', r, `${S(m.a)}*${S(m.Ht)}+(${S(m.W)}-${S(m.a)})*${S(m.b)}`, {
          unit: 'cm²', figure: notch(m.W, m.Ht, m.a, m.b, 'cm'),
          explain: `세로로 선을 그어 두 직사각형으로 나눈다. 왼쪽 직사각형의 넓이는 ${told(m.a, m.Ht)}(cm²)이다. 오른쪽 직사각형의 가로는 ${S(m.W)} − ${S(m.a)} = ${S(rest)}(cm)이므로 넓이는 ${told(rest, m.b)}(cm²)이다. 두 넓이의 합은 ${S(r)} cm²이다.`
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
