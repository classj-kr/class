// 4학년 2학기 1단원 분수의 덧셈과 뺄셈 — 계산 결과 비교, 조건에 맞는 수, □가 있는 식, 문장제, 실력 문항.
// 단원 틀과 계산 문항, 싣는 기준, 뺀 것과 까닭은 4-2-1a.js에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2, ③n = 기본꼴_3, 심n = 심화꼴.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 문항의 고르기 보기는 이 잘못을 가진 아이가 고르게 만들었다)
//  - 분자끼리 더하면서 분모끼리도 더한다(2/7 + 3/7 = 5/14).
//  - 분수 부분의 합이 1보다 클 때 받아올림한 1을 자연수 부분에 더하지 않거나(2 5/8 + 1 6/8 = 3 3/8), 1을 올리고도 분자를 그대로 둔다.
//  - 분수 부분끼리 뺄 수 없을 때 분자를 큰 수에서 작은 수를 빼거나(4 1/5 − 1 3/5 = 3 2/5), 1만큼을 받아내림하고도 자연수 부분을 줄이지 않는다.
//  - 자연수에서 분수를 뺄 때 자연수끼리만 빼고 분수는 그대로 붙이거나(6 − 2 3/7 = 4 3/7), 자연수 부분을 줄이지 않는다.
//  - 가분수를 대분수로 고칠 때 분모만큼 덜어 낸 횟수와 자연수 부분에 더하는 수가 어긋난다.
//  - 대분수를 가분수로 고칠 때 자연수와 분자를 이어 쓰거나(2 2/6 → 22/6) 더한다(2 2/6 → 4/6).
//  - □가 빼는 수 자리에 있을 때 □가 커질수록 계산 결과가 작아진다는 것을 놓친다.
//
// 실력에는 ① 위의 잘못을 가려내는 고르기 문항 ② 두 번 넘게 계산해야 하는 문장제와 어떤 수를 구해 바르게 계산하기 ③ 빼는 수 자리에 □가 있는 크기 비교를 실었다.
// 문장제는 얼개마다 한 번씩 싣는다: 합치기, 더 많은(적은) 쪽, 남은 양, 쓴 양, 그릇의 무게 빼기, 두 양의 차, 누가 얼마나 더, 더 필요한 양, 처음 양, 조각 수, 세 양의 합, 같은 양 두 번,
//   길 위의 한 구간·이어 간 거리, 표에서 골라 더하기 / (실력) 한쪽을 구한 뒤 합·차, 쓰고 다시 채우기, 두 번 덜어 내기, 나머지를 구해 견주기, 각자 남은 양 견주기, 합친 뒤 덜어 내기,
//   구한 값을 넣어 차례 정하기, 겹쳐 이어 붙인 길이와 겹친 부분, 길에서 두 구간 빼기, 두 길 견주기, 기준으로 가른 뒤 합, 날마다 같은 만큼 자라는 것.
// 묻는 말: 수나 값은 "~은?/~는?", 양은 "몇 ~인가?".
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, nick, box, frac, mixed, lines, tagged, numbers, cards, table, route, tapes, N, M, C } = B.kit;
  const STD = '4수01-15';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  // 실력 문항. 기본 자료에서만 나온 꼴은 ref 를 '기본 ②52' 처럼 적는다.
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: ref.startsWith('기본 ') ? '수집본 기본 자료(' + ref.slice(3) + ')' : '수집본 심화 자료(' + ref + ')', make }, more || {});
  const LAB = ['㉠', '㉡', '㉢', '㉣'], THREE = LAB.slice(0, 3);
  const SIGNS = ['&gt;', '=', '&lt;'];
  const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  const labelled = (answers) => answers.map((answer, i) => ({ label: LAB[i], answer }));
  const tail = (n, pair) => josa(n, pair).slice(String(n).length);
  const SIGN = { '+': '+', '-': '−', '=': '=', '>': '&gt;', '<': '&lt;' };
  const ex = (html) => '<span class="mb-expr">' + html + '</span>';
  const eq = (...parts) => ex(parts.map((p) => (SIGN[p] ? '<i>' + SIGN[p] + '</i>' : p)).join(' '));
  const versus = (left, right) => `<div class="mb-versus">${ex(left)}<span class="mb-ring"></span>${ex(right)}</div>`;
  const sign = (x, y) => (x > y ? 0 : x === y ? 1 : 2);
  // 수 하나: 분자 top, 분모 den. imp 이면 가분수 그대로 적고, 아니면 자연수·진분수·대분수로 적는다.
  const Q = (top, den, imp) => ({ top, den, imp: Boolean(imp) });
  const MX = (w, n, den) => Q(w * den + n, den);
  const W = (q) => Math.floor(q.top / q.den), R = (q) => q.top % q.den;
  const kind = (q) => (q.imp || q.top < q.den ? 'f' : R(q) === 0 ? 'n' : 'm');
  const show = (q) => (kind(q) === 'f' ? frac(q.top, q.den) : kind(q) === 'n' ? String(W(q)) : mixed(W(q), R(q), q.den));
  // 검사가 분자를 다시 셈하는 식. 문제에 적힌 수로만 적는다: 대분수 2 3/7 은 (2*7+3), 자연수 5 는 5*7.
  const top = (q) => (kind(q) === 'f' ? String(q.top) : kind(q) === 'n' ? `${W(q)}*${q.den}` : `(${W(q)}*${q.den}+${R(q)})`);
  const sj = (q, pair) => show(q) + tail(kind(q) === 'f' ? q.top : kind(q) === 'n' ? W(q) : R(q), pair);
  const fj = (k, n, pair) => frac(k, n) + tail(k, pair);
  const blank2 = (den, from) => mixed(box(LAB[from || 0]), box(LAB[(from || 0) + 1]), den);
  const calc2 = (e, den, from) => [[`((${e})-(${e})%${den})/${den}`, from || 0], [`(${e})%${den}`, (from || 0) + 1]];
  const two = (d, lo, hi, ok) => d.until(() => [d.int(lo, hi), d.int(lo, hi)], ([x, y]) => ok(x, y));
  // 식: 수와 '+', '-' 를 번갈아 적은 배열. 적는 글, 값(분자), 검사가 다시 셈하는 식
  const say = (parts) => parts.map((p) => (typeof p === 'string' ? SIGN[p] : show(p))).join(' ');
  const valueOf = (parts) => { let v = 0, s = '+'; parts.forEach((p) => { if (typeof p === 'string') s = p; else v += s === '+' ? p.top : -p.top; }); return v; };
  const numer = (parts) => { let e = '', s = ''; parts.forEach((p) => { if (typeof p === 'string') s = p; else e += s + top(p); }); return e; };
  const worth = (parts) => `(${numer(parts)})/${parts[0].den}`;
  const result = (parts) => show(Q(valueOf(parts), parts[0].den));
  const told = (parts) => `${say(parts)} = ${result(parts)}`;
  // 결과(분자 r, 자연수가 아니다)가 정해진 뺄셈. mode: 'borrow' 분수 부분끼리 뺄 수 없다 | 'plain' 뺄 수 있다 | 'natural' 자연수에서 뺀다.
  function subWith(d, r, den, mode, maxWhole) {
    const rr = r % den, lo = mode === 'borrow' ? den - rr + 1 : mode === 'plain' ? 1 : den - rr, hi = mode === 'borrow' ? den - 1 : mode === 'plain' ? den - rr - 1 : den - rr;
    if (lo > hi) throw new Error('이 결과로는 만들 수 없는 뺄셈: ' + r + '/' + den + ' ' + mode);
    const e = MX(d.int(1, maxWhole || 3), d.int(lo, hi), den);
    return [Q(r + e.top, den), '-', e];
  }
  // 결과(분자 s, 2*den+2 이상)가 정해진 대분수끼리의 덧셈
  function addWith(d, s, den) {
    const a = d.until(() => d.int(den + 1, s - den - 1), (v) => v % den !== 0 && (s - v) % den !== 0);
    return [Q(a, den), '+', Q(s - a, den)];
  }
  const carryPair = (d, den, maxW) => { const [x, y] = two(d, 2, den - 1, (p, q) => p + q > den); return [MX(d.int(1, maxW || 5), x, den), MX(d.int(1, maxW || 5), y, den)]; };
  const borrowPair = (d, den, maxW) => { const [x, y] = two(d, 1, den - 1, (p, q) => p < q), [w1, w2] = two(d, 1, maxW || 9, (p, q) => p >= q + 2); return [MX(w1, x, den), MX(w2, y, den)]; };
  // 큰 것부터(descending) 또는 작은 것부터 늘어놓은 차례를 고르는 보기 넷
  const orderChoice = (d, values, names) => {
    const right = values.map((_, i) => i).sort((p, q) => values[q] - values[p]);
    const list = d.shuffle(d.shuffle(ORDERS.filter((o) => o.join() !== right.join())).slice(0, 3).concat([right]));
    return { list, options: list.map((o) => o.map((i) => names[i]).join(', ')), answer: list.findIndex((o) => o.join() === right.join()) };
  };
  // from 부터 spans 만큼의 수직선(1을 parts 칸으로 똑같이 나눔)에 점을 찍고 이름을 단다. marks: [이름, from 에서 센 작은 눈금의 수]
  function markLine(from, spans, parts, marks) {
    const total = spans * parts, u = Math.min(24, 264 / total), x = (i) => 18 + i * u, y = 36, width = 36 + total * u;
    let out = `<line class="mb-axis" x1="${x(0)}" y1="${y}" x2="${x(total).toFixed(1)}" y2="${y}"/>`;
    for (let i = 0; i <= total; i += 1) out += `<line class="mb-axis" x1="${x(i).toFixed(1)}" y1="${y - (i % parts === 0 ? 6 : 3.5)}" x2="${x(i).toFixed(1)}" y2="${y + (i % parts === 0 ? 6 : 3.5)}"/>`;
    for (let i = 0; i <= spans; i += 1) out += `<text class="mb-km-label" x="${x(i * parts).toFixed(1)}" y="${y + 20}" text-anchor="middle">${from + i}</text>`;
    for (const [label, at] of marks) out += `<circle cx="${x(at).toFixed(1)}" cy="${y}" r="3.4" style="fill:#b42318"/><text class="mb-axis-label" style="font-size:14px;font-weight:700;fill:#b42318" x="${x(at).toFixed(1)}" y="${y - 12}" text-anchor="middle">${label}</text>`;
    const said = marks.map(([label, at]) => `${josa(label, '은/는')} ${from + Math.floor(at / parts)}에서 작은 눈금 ${at % parts}칸 간 곳`).join(', ');
    return `<svg class="mb-numberline" viewBox="0 0 ${width.toFixed(1)} 62" width="${Math.round(width * 1.05)}" role="img" aria-label="수직선: ${from}부터 ${from + spans}까지, 1을 똑같이 ${parts}칸으로 나누었다. ${said}">${out}</svg>`;
  }
  // 답 틀을 적은 줄: 「답 ㉠ ㉡/den 단위」
  const answerLine = (html, unit, lead) => tagged([(lead || '') + ex(html) + (unit ? ' ' + unit : '')], ['답']);
  // 문장제: 식 e(분자)의 값을 대분수 틀이나 분자 틀로 답한다.
  function wordRaw(text, e, value, den, unit, explain, o) {
    const more = o || {};
    if (value > den) return M(text, labelled([Math.floor(value / den), value % den]), { figure: (more.figure || '') + answerLine(blank2(den), unit, more.lead), explain, facts: { calc: calc2(e, den), unseen: more.unseen || [] } });
    return N(text, value, { figure: (more.figure || '') + answerLine(frac(box(), den), unit, more.lead), explain, facts: { calc: [[e, 0]], unseen: more.unseen || [] } });
  }
  const word = (text, parts, unit, explain, o) => wordRaw(text, numer(parts), valueOf(parts), parts[0].den, unit, explain, o);

  // ── 계산 결과 비교하기 ──
  B.addTypes('4-2-1', 'comp', [
    T('comp-sign-two', '덧셈식과 뺄셈식의 계산 결과 비교', '①39 ②42 ③42 심20', (d) => {
      const den = d.int(5, 9), gap = d.pick([0, 0, 1, -1, 2, -2]);
      const s = d.until(() => d.int(den * 2 + 3, den * 4 - 1), (v) => v % den !== 0 && (v + gap) % den >= 2);
      const sum = addWith(d, s, den), diff = subWith(d, s + gap, den, 'borrow'), rows = d.bool() ? [sum, diff] : [diff, sum];
      return C('계산 결과를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, sign(valueOf(rows[0]), valueOf(rows[1])), {
        figure: versus(say(rows[0]), say(rows[1])),
        explain: `${told(rows[0])}, ${told(rows[1])}이다.`,
        facts: { choose: { exprs: rows.map(worth), rule: 'compare' } }
      });
    }),
    T('comp-sign-value', '계산 결과와 수의 크기 비교', '①39 ②42 ③42 심20', (d) => {
      const den = d.int(5, 12), gap = d.pick([0, 1, -1]), r = d.until(() => d.int(den + 2, den * 5 - 2), (v) => v % den !== 0 && (v + gap) % den !== 0);
      const row = subWith(d, r, den, 'natural', 4), q = Q(r + gap, den);
      return C('계산 결과와 수의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, sign(r, q.top), {
        figure: versus(say(row), show(q)),
        explain: `${told(row)}이다. ` + (gap === 0 ? '두 수는 같다.' : `${sj(Q(r, den), '은/는')} ${show(q)}보다 ${gap < 0 ? '크다' : '작다'}.`),
        facts: { choose: { exprs: [worth(row), `${top(q)}/${den}`], rule: 'compare' } }
      });
    }),
    T('comp-max', '계산 결과가 가장 큰 식 찾기', '①40 ②43 ③43 심21', (d) => {
      // 빼어지는 자연수가 가장 큰 식이 답이 되지 않게 고른다.
      const den = d.int(6, 13), pool = [];
      for (let v = den + 1; v < den * 3; v += 1) if (v % den !== 0) pool.push(v);
      const [rs, ns] = d.until(() => [d.shuffle(pool).slice(0, 3), d.shuffle([4, 5, 6, 7, 8, 9]).slice(0, 3)], ([r, n]) => r.indexOf(Math.max(...r)) !== n.indexOf(Math.max(...n)) && Math.max(...r) - Math.min(...r) <= den);
      const rows = rs.map((r, i) => [Q(ns[i] * den, den), '-', Q(ns[i] * den - r, den)]);
      return C('계산 결과가 가장 큰 것은?', THREE, rs.indexOf(Math.max(...rs)), {
        figure: tagged(rows.map((row) => ex(say(row)))),
        explain: rows.map((row, i) => `${LAB[i]} ${result(row)}`).join(', ') + '이다. 자연수 부분이 같으면 분자가 큰 수가 더 크다.',
        facts: { choose: { exprs: rows.map(worth), rule: 'max' } }
      });
    }),
    T('comp-order', '계산 결과가 큰 것부터 차례대로 나열하기', '①40 ②44 ③43 심22', (d) => {
      const den = d.int(5, 10);
      const sums = d.until(() => [0, 0, 0].map(() => d.int(den * 3 + 1, den * 6 - 1)), (list) => new Set(list).size === 3 && list.every((v) => v % den !== 0) && Math.max(...list) - Math.min(...list) <= den);
      const rows = sums.map((s) => addWith(d, s, den)), pick = orderChoice(d, sums, LAB);
      return C('계산 결과가 큰 것부터 차례대로 쓴 것은?', pick.options, pick.answer, {
        figure: tagged(rows.map((row) => ex(say(row)))),
        explain: rows.map((row, i) => `${LAB[i]} ${result(row)}`).join(', ') + '이다. 자연수 부분이 큰 수가 더 크고, 자연수 부분이 같으면 분자가 큰 수가 더 크다.',
        facts: { choose: { exprs: rows.map(worth), rule: 'descending', orders: pick.list } }
      });
    }),
    T('comp-odd', '계산 결과가 다른 하나 찾기', '①41 ②45 ③44 심24', (d) => {
      // 결과가 같은 두 식은 빼는 수의 분수 부분이 서로 다르다(자연수만 다른 식이면 계산하지 않고도 같다는 것이 보인다).
      const den = d.int(5, 9), gap = d.pick([1, -1]), v = d.until(() => d.int(den + 3, den * 3 - 2), (x) => x % den >= 3 && (x + gap) % den >= 2);
      const made = d.until(() => [subWith(d, v, den, 'borrow', 4), subWith(d, v, den, 'borrow', 4), subWith(d, v + gap, den, 'borrow', 4)], (list) => new Set(list.map((row) => row[0].top)).size === 3 && R(list[0][2]) !== R(list[1][2]));
      const rows = d.shuffle(made);
      return C('계산 결과가 나머지와 다른 하나는?', THREE, rows.indexOf(made[2]), {
        figure: tagged(rows.map((row) => ex(say(row)))),
        explain: rows.map((row, i) => `${LAB[i]} ${result(row)}`).join(', ') + '이다.',
        facts: { choose: { exprs: rows.map(worth), rule: 'odd' } }
      });
    }),
    T('comp-below-one', '계산 결과가 1보다 작은 덧셈 찾기', '①42 ②46 ③48 심23', (d) => {
      // 분자의 합이 분모와 같아 꼭 1이 되는 식을 섞는다.
      const den = d.int(8, 15), k = d.int(1, 2), sums = d.shuffle([den - k, den, den + k]);
      const rows = sums.map((s) => { const a = d.until(() => d.int(Math.max(1, s - den + 1), Math.min(den - 1, s - 1)), (v) => v * 2 !== s); return [a, s - a]; });
      return C('계산 결과가 1보다 작은 것은?', THREE, sums.indexOf(den - k), {
        figure: tagged(rows.map(([a, b]) => eq(frac(a, den), '+', frac(b, den)))),
        explain: rows.map(([a, b], i) => `${LAB[i]} ${a + b === den ? `${frac(den, den)} = 1` : frac(a + b, den)}`).join(', ') + `이다. 분자가 분모 ${den}보다 작은 분수가 1보다 작다.`,
        facts: { choose: { exprs: rows.map(([a, b]) => `(${a}+${b})/${den}`), rule: 'min' }, truth: sums.map((s) => s < den), want: true }
      });
    }),
    T('comp-natural', '계산 결과가 자연수인 식 찾기', '①23·42 ②11 ③18 심23', (d) => {
      // 자연수가 되는 식은 하나뿐이다(분수 부분의 합이 꼭 1이거나 분수 부분이 같다). 나머지는 분자의 합이 분모와 1만큼 어긋나거나 분자가 1만큼 다르다.
      const den = d.int(5, 12), w = () => d.int(1, 5);
      const add = (s) => { const x = d.int(Math.max(1, s - den + 1), Math.min(den - 1, s - 1)); return [MX(w(), x, den), '+', MX(w(), s - x, den)]; };
      const sub = (gap) => { const y = d.int(1, den - 1 - gap), k = w(); return [MX(k + d.int(1, 4), y + gap, den), '-', MX(k, y, den)]; };
      const natural = d.bool() ? add(den) : sub(0), rows = d.shuffle([natural].concat(d.shuffle([add(den - 1), add(den + 1), sub(1)]).slice(0, 2)));
      return C('계산 결과가 자연수인 것은?', THREE, rows.indexOf(natural), {
        figure: tagged(rows.map((row) => ex(say(row)))),
        explain: rows.map((row, i) => `${LAB[i]} ${result(row)}`).join(', ') + '이다. 분수 부분의 합이 1이거나 분수 부분끼리의 차가 0이면 계산 결과가 자연수이다.',
        facts: { claimed: rows.map((row) => [`(${numer(row)})%${den}`, 0]), claimedWant: true }
      });
    }),
    T('comp-between', '계산 결과가 두 자연수 사이에 있는 식 찾기', '①42 ②47 ③48 심23', (d) => {
      // 자연수끼리만 빼면 사이에 드는 것처럼 보이지만 받아내림하면 벗어나는 식이 섞인다.
      const den = d.int(5, 10), k = d.int(2, 4), fr = () => d.int(2, den - 2), modes = d.shuffle(['borrow', 'plain', 'natural']);
      const values = d.shuffle([k * den + fr(), (k - 1) * den + fr(), (k + 1) * den + fr()]), rows = values.map((v, i) => subWith(d, v, den, modes[i]));
      return C(`계산 결과가 ${k}보다 크고 ${k + 1}보다 작은 것은?`, THREE, values.findIndex((v) => v > k * den && v < (k + 1) * den), {
        figure: tagged(rows.map((row) => ex(say(row)))),
        explain: rows.map((row, i) => `${LAB[i]} ${result(row)}`).join(', ') + '이다.',
        facts: { between: { low: String(k), high: String(k + 1), exprs: rows.map(worth) } }
      });
    }),
    T('comp-nearest', '어떤 수에 가장 가까운 식 찾기', '①43 ②48', (d) => {
      const den = d.int(6, 10), target = d.int(3, 6), mags = d.pick([[1, 2, 3], [1, 2, 4], [1, 3, 4], [2, 3, 4]]);
      const gaps = d.shuffle(d.until(() => mags.map((m) => (d.bool() ? m : -m)), (list) => list.some((g) => g > 0) && list.some((g) => g < 0)));
      const rows = gaps.map((g) => { const r = target * den + g, n = Math.floor(r / den) + d.int(2, 4); return [Q(n * den, den), '-', Q(n * den - r, den)]; });
      const near = gaps.findIndex((g) => Math.abs(g) === Math.min(...mags));
      return C(`계산 결과가 ${target}에 가장 가까운 것은?`, THREE, near, {
        figure: tagged(rows.map((row) => ex(say(row)))),
        explain: rows.map((row, i) => `${LAB[i]} ${result(row)}`).join(', ') + `이다. ${josa(target, '과/와')}의 차는 차례로 ${gaps.map((g) => frac(Math.abs(g), den)).join(', ')}이다.`,
        facts: { choose: { exprs: rows.map(worth), rule: 'nearest', target } }
      });
    }),
    T('comp-match', '식과 계산 결과 짝 짓기', '①44 ②49 ③46 심25', (d) => {
      const den = d.int(5, 12);
      const rs = d.until(() => [0, 0, 0].map(() => d.int(den + 1, den * 5 - 1)), (list) => new Set(list).size === 3 && list.every((v) => v % den !== 0) && Math.max(...list) - Math.min(...list) <= den * 2);
      const rows = rs.map((r, i) => { const n = Math.floor(r / den) + (i === 0 ? 1 : d.int(2, 3)); return [Q(n * den, den), '-', Q(n * den - r, den)]; });
      const order = d.shuffle([0, 1, 2]), shown = order.map((i) => rows[i]), tops = order.map((i) => rs[i]);
      const list = d.shuffle(d.shuffle(ORDERS.slice(1)).slice(0, 3).concat([ORDERS[0]]));
      return C('식과 계산 결과를 알맞게 짝 지은 것은?', list.map((o) => o.map((j, i) => `${LAB[i]} ${show(Q(tops[j], den))}`).join(', ')), list.findIndex((o) => o.join() === '0,1,2'), {
        figure: tagged(shown.map((row) => ex(say(row)))),
        explain: shown.map((row, i) => `${LAB[i]} ${told(row)}`).join(', ') + '이다.',
        facts: { match: { exprs: shown.map(numer), options: list.map((o) => o.map((j) => tops[j])) } }
      });
    }),
    T('comp-same', '계산 결과가 같은 두 식 찾기', '③45 심25', (d) => {
      const den = d.int(9, 15), pool = [];
      for (let v = 3; v <= den - 3; v += 1) pool.push(v);
      const [x, y, z] = d.shuffle(pool).slice(0, 3), twin = d.bool() ? x : y, adds = d.shuffle([twin, z]);
      const sub = (v) => { const a = d.int(v + 1, den - 1); return [Q(a, den), '-', Q(a - v, den)]; };
      const add = (v) => { const a = d.until(() => d.int(1, v - 1), (p) => p * 2 !== v); return [Q(a, den), '+', Q(v - a, den)]; };
      const rows = [sub(x), sub(y), add(adds[0]), add(adds[1])], pairsShown = [[0, 2], [0, 3], [1, 2], [1, 3]];
      const right = [twin === x ? 0 : 1, adds.indexOf(twin) + 2];
      return C('계산 결과가 같은 두 식은?', pairsShown.map(([i, j]) => `${LAB[i]}과 ${LAB[j]}`), pairsShown.findIndex((p) => p.join() === right.join()), {
        figure: tagged(rows.map((row) => ex(say(row))), LAB),
        explain: rows.map((row, i) => `${LAB[i]} ${result(row)}`).join(', ') + '이다.',
        facts: { choose: { exprs: rows.map(worth), rule: 'same', pairsShown } }
      });
    }),
    T('comp-equals', '주어진 계산 결과가 되는 식 고르기', '③16·47', (d) => {
      const den = d.int(6, 12), t = d.int(den + 3, den * 2 - 3), values = d.shuffle([t, t + 1, t - 1]), kinds = d.shuffle(['sum', 'plain', 'borrow']);
      const rows = values.map((v, i) => {
        if (kinds[i] !== 'sum') return subWith(d, v, den, kinds[i]);
        const a = d.int(v - den + 1, den - 1); return [Q(a, den), '+', Q(v - a, den)];
      });
      return C(`계산 결과가 ${show(Q(t, den))}인 것은?`, rows.map(say), values.indexOf(t), {
        explain: rows.map(told).join(', ') + '이다.',
        facts: { choose: { exprs: rows.map(worth), rule: 'equals', target: t / den } }
      });
    }),
    T('comp-wrong-pick', '잘못 계산한 식 찾기', '①45 ②50 심7', (d) => {
      // 틀린 식: 자연수에서 1만큼을 받아내림하고도 자연수 부분을 줄이지 않았다.
      const dens = d.shuffle([5, 6, 7, 8, 9, 10, 11]).slice(0, 3), bad = d.int(0, 2);
      const rows = dens.map((den) => subWith(d, d.until(() => d.int(den + 2, den * 4 - 1), (v) => v % den >= 2), den, 'borrow'));
      const said = rows.map((row, i) => valueOf(row) + (i === bad ? row[0].den : 0));
      return C('잘못 계산한 것은?', rows.map((row, i) => `${say(row)} = ${show(Q(said[i], row[0].den))}`), bad, {
        explain: `${told(rows[bad])}이다. 자연수에서 1만큼을 받아내림하면 자연수 부분이 1 작아진다.`,
        facts: { claimed: rows.map((row, i) => [numer(row), said[i]]), claimedWant: false }
      });
    }),
    T('comp-talk', '두 식의 계산 결과에 대한 설명', '②98', (d) => {
      // 자연수끼리만 빼어 어림하면 틀리는 설명을 섞는다(받아내림하면 자연수 부분이 1 작아진다).
      const den = d.int(5, 9), pick = () => d.until(() => d.int(den + 2, den * 4 - 1), (v) => v % den >= 2);
      const [ra, rb] = d.until(() => [pick(), pick()], ([p, q]) => p !== q && Math.abs(p - q) <= den);
      const rows = [subWith(d, ra, den, 'borrow'), subWith(d, rb, den, 'borrow')], naive = rows.map((row) => W(row[0]) - W(row[2])), bad = d.int(0, 2);
      const claims = d.shuffle([
        { text: `㉠의 계산 결과는 ${naive[0]}보다 ${bad === 0 ? '크다' : '작다'}.`, ok: (bad === 0) === (ra > naive[0] * den) },
        { text: `㉡의 계산 결과는 ${naive[1]}보다 ${bad === 1 ? '크다' : '작다'}.`, ok: (bad === 1) === (rb > naive[1] * den) },
        { text: `㉠의 계산 결과는 ㉡의 계산 결과보다 ${(ra > rb) === (bad !== 2) ? '크다' : '작다'}.`, ok: bad !== 2 }
      ]);
      return C('두 식의 계산 결과에 대한 설명으로 옳지 않은 것은?', claims.map((c) => c.text), claims.findIndex((c) => !c.ok), {
        figure: tagged(rows.map((row) => ex(say(row)))),
        explain: `㉠ ${told(rows[0])}, ㉡ ${told(rows[1])}이다.`,
        facts: { truth: claims.map((c) => c.ok), want: false }
      });
    })
  ]);

  // ── 조건에 맞는 수의 합과 차 ──
  B.addTypes('4-2-1', 'pick', [
    T('say-more', '어떤 수보다 얼마만큼 더 큰 수', '①38 ②56 ③50 심9', (d) => {
      const den = d.int(5, 13), [a, b] = carryPair(d, den, 6), parts = [a, '+', b];
      return M(`${show(a)}보다 ${show(b)}만큼 더 큰 수를 대분수로 나타낼 때, ㉠, ㉡에 알맞은 수는?`, labelled([Math.floor(valueOf(parts) / den), valueOf(parts) % den]), {
        figure: eq(blank2(den)), explain: `${show(a)}보다 ${show(b)}만큼 더 큰 수는 두 수의 합이다. ${told(parts)}`, facts: { calc: calc2(numer(parts), den) }
      });
    }),
    T('say-less', '어떤 수보다 얼마만큼 더 작은 수', '①38 ②56 ③50', (d) => {
      const den = d.int(5, 13), [a, b] = borrowPair(d, den), parts = [a, '-', b];
      return M(`${show(a)}보다 ${show(b)}만큼 더 작은 수를 대분수로 나타낼 때, ㉠, ㉡에 알맞은 수는?`, labelled([Math.floor(valueOf(parts) / den), valueOf(parts) % den]), {
        figure: eq(blank2(den)), explain: `${show(a)}보다 ${show(b)}만큼 더 작은 수는 ${show(a)}에서 ${sj(b, '을/를')} 뺀 수이다. ${told(parts)}`, facts: { calc: calc2(numer(parts), den) }
      });
    }),
    T('say-compare', '말로 나타낸 두 수의 크기 비교', '①38', (d) => {
      // 빼어지는 자연수가 큰 쪽이 꼭 더 크지는 않게 고른다.
      const den = d.int(5, 10), gap = d.pick([0, 1, -1, 2, -2]), r = d.until(() => d.int(den + 3, den * 4 - 3), (v) => v % den !== 0 && (v + gap) % den !== 0);
      const rows = [r, r + gap].map((v, i) => { const n = Math.floor(v / den) + 2 + i; return [Q(n * den, den), '-', Q(n * den - v, den)]; });
      return C('㉠과 ㉡의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, sign(r, r + gap), {
        figure: tagged(rows.map((row) => `${show(row[0])}보다 ${show(row[2])}만큼 더 작은 수`), LAB) + versus('㉠', '㉡'),
        explain: `㉠ ${told(rows[0])}, ㉡ ${told(rows[1])}이다.`,
        facts: { choose: { exprs: rows.map(worth), rule: 'compare' } }
      });
    }),
    T('say-unit-sum', '단위분수가 몇 개인 수끼리의 합', '①26 ②57 ③51 심6', (d) => {
      const den = d.int(5, 13), [p, q] = two(d, den + 1, den * 2 - 1, (x, y) => x !== y && (x + y) % den !== 0), u = frac(1, den);
      return M(`${u}이 ${p}개인 수와 ${u}이 ${q}개인 수의 합을 대분수로 나타낼 때, ㉠, ㉡에 알맞은 수는?`, labelled([Math.floor((p + q) / den), (p + q) % den]), {
        figure: eq(blank2(den)), explain: `합은 ${u}이 ${p} + ${q} = ${p + q}(개)인 수이므로 ${frac(p + q, den)}이다. 대분수로 나타내면 ${show(Q(p + q, den))}이다.`,
        facts: { calc: calc2(`${p}+${q}`, den) }
      });
    }),
    T('pick-diff-order', '두 수의 차(작은 수가 앞에 놓임)', '③53 심14', (d) => {
      const den = d.int(5, 13), [a, b] = borrowPair(d, den), parts = [a, '-', b];
      return M('두 수의 차를 대분수로 나타낼 때, ㉠, ㉡에 알맞은 수는?', labelled([Math.floor(valueOf(parts) / den), valueOf(parts) % den]), {
        figure: numbers([show(b), show(a)]) + eq(blank2(den)), explain: `차는 큰 수에서 작은 수를 빼어 구한다. ${told(parts)}`, facts: { calc: calc2(numer(parts), den) }
      });
    }),
    T('pick-line-sum', '수직선의 두 점이 나타내는 수의 합', '①74 ③85 심29', (d) => {
      const den = d.int(4, 8), from = d.int(1, 3), [p, q] = two(d, 1, den * 2 - 1, (x, y) => x < y - 1 && x % den !== 0 && y % den !== 0 && (x + y) % den !== 0);
      const a = Q(from * den + p, den), b = Q(from * den + q, den), parts = [a, '+', b];
      return M('수직선에서 가와 나가 나타내는 수의 합을 대분수로 나타낼 때, ㉠, ㉡에 알맞은 수는?', labelled([Math.floor(valueOf(parts) / den), valueOf(parts) % den]), {
        figure: markLine(from, 2, den, [['가', p], ['나', q]]) + eq(blank2(den)),
        explain: `작은 눈금 한 칸은 ${frac(1, den)}이다. 가는 ${show(a)}, 나는 ${show(b)}이다. ${told(parts)}`,
        facts: { calc: calc2(numer(parts), den) }
      });
    }),
    T('ends-sum', '가장 큰 수와 가장 작은 수의 합', '①51 ②54 ③54 심26', (d) => {
      // 자연수 부분이 같은 수를 섞어 분자까지 비교하게 한다.
      const den = d.int(6, 13);
      const tops = d.until(() => [0, 0, 0, 0].map(() => d.int(den + 1, den * 5 - 1)), (list) => {
        const s = list.slice().sort((p, q) => p - q), w = (v) => Math.floor(v / den);
        return new Set(list).size === 4 && list.every((v) => v % den !== 0) && (s[0] + s[3]) % den !== 0 && (w(s[3]) === w(s[2]) || w(s[0]) === w(s[1]));
      });
      const big = Q(Math.max(...tops), den), small = Q(Math.min(...tops), den), parts = [big, '+', small];
      return M('가장 큰 수와 가장 작은 수의 합을 대분수로 나타낼 때, ㉠, ㉡에 알맞은 수는?', labelled([Math.floor(valueOf(parts) / den), valueOf(parts) % den]), {
        figure: numbers(tops.map((v) => show(Q(v, den)))) + eq(blank2(den)),
        explain: `가장 큰 수는 ${show(big)}, 가장 작은 수는 ${show(small)}이다. ${told(parts)}`, facts: { calc: calc2(numer(parts), den) }
      });
    }),
    T('ends-diff', '가장 큰 수와 가장 작은 수의 차(가분수와 자연수가 섞임)', '①51·52·63 ②54·69 ③55 심26·46·77', (d) => {
      // 대분수 둘, 가분수 하나, 자연수 하나. 가분수가 가장 크거나 가장 작다.
      const den = d.int(5, 9);
      const list = d.until(() => d.shuffle([Q(d.int(den + 1, den * 6 - 1), den), Q(d.int(den + 1, den * 6 - 1), den), Q(d.int(den + 1, den * 6 - 1), den, true), Q(d.int(2, 5) * den, den)]), (qs) => {
        const ts = qs.map((q) => q.top), hi = Math.max(...ts), lo = Math.min(...ts), imp = qs.find((q) => q.imp).top;
        return new Set(ts).size === 4 && qs.filter((q) => q.top % den === 0).length === 1 && (imp === hi || imp === lo) && hi - lo > den && (hi - lo) % den !== 0;
      });
      const big = list.reduce((p, q) => (q.top > p.top ? q : p)), small = list.reduce((p, q) => (q.top < p.top ? q : p)), parts = [big, '-', small];
      return M('가장 큰 수와 가장 작은 수의 차를 대분수로 나타낼 때, ㉠, ㉡에 알맞은 수는?', labelled([Math.floor(valueOf(parts) / den), valueOf(parts) % den]), {
        figure: numbers(list.map(show)) + eq(blank2(den)),
        explain: `모두 가분수로 나타내면 ${list.map((q) => frac(q.top, den)).join(', ')}이다. 가장 큰 수는 ${show(big)}, 가장 작은 수는 ${show(small)}이고, ${frac(big.top, den)} − ${frac(small.top, den)} = ${frac(big.top - small.top, den)} = ${result(parts)}이다.`,
        facts: { calc: calc2(numer(parts), den) }
      });
    }),
    T('both-sum-diff', '두 수의 합과 차', '①37 ②55 ③52', (d) => {
      const den = d.int(5, 12), [x, y] = two(d, 1, den - 1, (p, q) => p < q && p + q > den), [w1, w2] = two(d, 1, 9, (p, q) => p >= q + 2), a = MX(w1, x, den), b = MX(w2, y, den);
      const sum = [a, '+', b], diff = [a, '-', b];
      return M('두 수의 합과 차를 각각 대분수로 나타낼 때, ㉠, ㉡, ㉢, ㉣에 알맞은 수는?', labelled([Math.floor(valueOf(sum) / den), valueOf(sum) % den, Math.floor(valueOf(diff) / den), valueOf(diff) % den]), {
        figure: lines([numbers([show(a), show(b)]), `합: ${ex(blank2(den, 0))}`, `차: ${ex(blank2(den, 2))}`]),
        explain: `${told(sum)}, ${told(diff)}`, facts: { calc: calc2(numer(sum), den, 0).concat(calc2(numer(diff), den, 2)) }
      });
    }),
    T('between-diff', '두 자연수 사이에 있는 두 분수의 차', '②53', (d) => {
      // 사이에 있는 두 수는 대분수 하나와 가분수 하나이다. 나머지 둘은 사이를 벗어난다.
      const den = d.int(7, 13), k = d.int(2, 3), [p, q] = two(d, 1, den - 1, (x, y) => x > y);
      const inside = d.shuffle([Q(k * den + p, den, false), Q(k * den + q, den, true)]);
      const out = [Q((k - 1) * den + d.int(1, den - 1), den, true), Q((k + 1) * den + d.int(1, den - 1), den, d.bool())];
      const list = d.shuffle(inside.concat(out)), big = inside.find((v) => v.top === k * den + p), small = inside.find((v) => v.top === k * den + q);
      return N(`${k}보다 크고 ${k + 1}보다 작은 두 분수의 차를 구할 때, □ 안에 알맞은 수는?`, p - q, {
        figure: numbers(list.map(show)) + eq(frac(box(), den)),
        explain: `모두 가분수로 나타내면 ${list.map((v) => frac(v.top, den)).join(', ')}이다. ${josa(k, '은/는')} ${frac(k * den, den)}, ${josa(k + 1, '은/는')} ${frac((k + 1) * den, den)}이므로 사이에 있는 수는 ${frac(big.top, den)}, ${frac(small.top, den)}이다. ${frac(big.top, den)} − ${frac(small.top, den)} = ${frac(p - q, den)}`,
        facts: { calc: [[`${top(big)}-${top(small)}`, 0]] }
      });
    }),
    T('proper-ends', '분모가 같은 진분수 가운데 가장 큰 수와 가장 작은 수의 차', '①57 ②58 심28', (d) => {
      const den = d.int(6, 19);
      return N(`분모가 ${den}인 진분수 중에서 가장 큰 수와 가장 작은 수의 차를 구할 때, □ 안에 알맞은 수는?`, den - 2, {
        figure: eq(frac(box(), den)),
        explain: `분모가 ${den}인 진분수 중에서 가장 큰 수는 ${frac(den - 1, den)}, 가장 작은 수는 ${frac(1, den)}이다. ${frac(den - 1, den)} − ${frac(1, den)} = ${frac(den - 2, den)}`,
        facts: { calc: [[`${den}-1-1`, 0]], unseen: [1] }
      });
    }),
    T('proper-above-sum', '조건에 맞는 진분수를 모두 더하기', '②58 심28', (d) => {
      const den = d.int(7, 12), count = d.int(2, 3), k = den - 1 - count, tops = Array.from({ length: count }, (_, i) => k + 1 + i), s = tops.reduce((p, q) => p + q, 0);
      return M(`분모가 ${den}인 진분수 중에서 ${frac(k, den)}보다 큰 분수를 모두 더한 값을 대분수로 나타낼 때, ㉠, ㉡에 알맞은 수는?`, labelled([Math.floor(s / den), s % den]), {
        figure: eq(blank2(den)),
        explain: `${frac(k, den)}보다 큰 진분수는 ${tops.map((v) => frac(v, den)).join(', ')}이다. ${tops.map((v) => frac(v, den)).join(' + ')} = ${frac(s, den)} = ${show(Q(s, den))}`,
        facts: { calc: calc2(tops.map((_, i) => `(${k}+${i + 1})`).join('+'), den), unseen: [1, 2, 3] }
      });
    }),
    T('pick-two-sum', '두 수를 골라 합이 가장 작은 덧셈식 만들기', '①52 ②69 ③63 심46', (d) => {
      // 대분수 둘과 가분수 둘. 가장 작은 두 수 가운데 하나는 가분수이다.
      const den = d.int(5, 9);
      const list = d.until(() => d.shuffle([false, false, true, true]).map((imp) => Q(d.int(den + 1, den * 4 - 1), den, imp)), (qs) => {
        const s = qs.slice().sort((p, q) => p.top - q.top);
        return new Set(qs.map((q) => q.top)).size === 4 && qs.every((q) => q.top % den !== 0) && (s[0].top + s[1].top) % den !== 0 && (s[0].imp || s[1].imp) && !(s[0].imp && s[1].imp);
      });
      const [s1, s2] = list.slice().sort((p, q) => p.top - q.top), parts = [s1, '+', s2];
      return M('두 수를 골라 합이 가장 작은 덧셈식을 만들려고 한다. 그 합을 대분수로 나타낼 때, ㉠, ㉡에 알맞은 수는?', labelled([Math.floor(valueOf(parts) / den), valueOf(parts) % den]), {
        figure: numbers(list.map(show)) + eq(blank2(den)),
        explain: `가장 작은 수와 둘째로 작은 수를 더한다. 모두 가분수로 나타내면 ${list.map((q) => frac(q.top, den)).join(', ')}이므로 ${frac(s1.top, den)} + ${frac(s2.top, den)} = ${frac(s1.top + s2.top, den)} = ${result(parts)}이다.`,
        facts: { calc: calc2(numer(parts), den) }
      });
    }),
    T('pairs-natural', '합이 자연수가 되는 두 수 찾기', '①53 ③65', (d) => {
      // 분수 부분의 합이 1인 짝은 하나뿐이고, 분자의 합이 분모보다 1 크거나 작은 짝이 섞여 있다.
      const den = d.int(6, 12), pairs = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];
      const list = d.until(() => [0, 0, 0, 0].map(() => MX(d.int(1, 4), d.int(1, den - 1), den)), (qs) => {
        const sums = pairs.map(([i, j]) => R(qs[i]) + R(qs[j]));
        return new Set(qs.map((q) => q.top)).size === 4 && sums.filter((s) => s === den).length === 1 && sums.some((s) => Math.abs(s - den) === 1);
      });
      const right = pairs.find(([i, j]) => R(list[i]) + R(list[j]) === den), shownPairs = d.shuffle(d.shuffle(pairs.filter((p) => p !== right)).slice(0, 3).concat([right]));
      const sum = (list[right[0]].top + list[right[1]].top) / den;
      return C('합이 자연수가 되는 두 수는?', shownPairs.map(([i, j]) => `${show(list[i])}, ${show(list[j])}`), shownPairs.indexOf(right), {
        figure: numbers(list.map(show)),
        explain: `분수 부분의 합이 1이 되는 두 수를 찾는다. ${frac(R(list[right[0]]), den)} + ${frac(R(list[right[1]]), den)} = 1이므로 ${show(list[right[0]])} + ${show(list[right[1]])} = ${sum}이다.`,
        facts: { choose: { exprs: shownPairs.map(([i, j]) => `(${top(list[i])}+${top(list[j])})/${den}`), rule: 'equals', target: sum } }
      });
    }),
    T('cards-proper', '수 카드로 만든 가장 큰 진분수와 가장 작은 진분수의 합', '①54 ②71 심44', (d) => {
      // 분모보다 큰 카드는 진분수의 분자가 될 수 없다.
      const den = d.int(11, 17), pool = [];
      for (let v = 2; v < den; v += 1) pool.push(v);
      const tops = d.until(() => d.shuffle(pool).slice(0, 3), (list) => Math.max(...list) + Math.min(...list) > den);
      const over = den + d.int(1, 4), hi = Math.max(...tops), lo = Math.min(...tops);
      return M(`수 카드 중에서 한 장을 골라 분자로 하여 분모가 ${den}인 진분수를 만들려고 한다. 만들 수 있는 가장 큰 진분수와 가장 작은 진분수의 합을 대분수로 나타낼 때, ㉠, ㉡에 알맞은 수는?`, labelled([1, hi + lo - den]), {
        figure: cards(d.shuffle(tops.concat([over]))) + eq(blank2(den)),
        explain: `진분수는 분자가 분모보다 작으므로 ${josa(over, '은/는')} 쓸 수 없다. 가장 큰 진분수는 ${frac(hi, den)}, 가장 작은 진분수는 ${frac(lo, den)}이고, ${frac(hi, den)} + ${frac(lo, den)} = ${frac(hi + lo, den)} = ${mixed(1, hi + lo - den, den)}이다.`,
        facts: { calc: calc2(`${hi}+${lo}`, den) }
      });
    }),
    T('cards-mixed-diff', '수 카드로 만든 가장 큰 대분수와 가장 작은 대분수의 차', '①54 ②71 심52', (d) => {
      const den = d.int(9, 13), [c1, c2, c3, c4] = d.shuffle([1, 2, 3, 4, 5, 6, 7, 8]).slice(0, 4).sort((p, q) => p - q), big = MX(c4, c3, den), small = MX(c1, c2, den), parts = [big, '-', small];
      return M(`수 카드 중에서 두 장을 골라 한 번씩만 사용하여 분모가 ${den}인 대분수를 만들려고 한다. 만들 수 있는 가장 큰 대분수와 가장 작은 대분수의 차를 대분수로 나타낼 때, ㉠, ㉡에 알맞은 수는?`, labelled([Math.floor(valueOf(parts) / den), valueOf(parts) % den]), {
        figure: cards(d.shuffle([c1, c2, c3, c4])) + eq(blank2(den)),
        explain: `자연수 부분이 클수록 큰 수이다. 가장 큰 대분수는 ${show(big)}, 가장 작은 대분수는 ${show(small)}이다. ${told(parts)}`,
        facts: { calc: calc2(numer(parts), den) }
      });
    }),
    T('cards-mixed-sum', '수 카드로 가장 큰 대분수를 만들어 더하기', '심51', (d) => {
      const den = d.int(5, 9), lo = d.int(2, Math.min(den - 1, 7)), hi = d.until(() => d.int(lo + 1, 9), (v) => v !== den), y = d.int(den - lo + 1, den - 1), g = MX(d.int(1, 5), y, den), made = MX(hi, lo, den), parts = [made, '+', g];
      return M(`수 카드 세 장을 한 번씩 모두 사용하여 분모가 ${den}인 가장 큰 대분수를 만들었다. 이 대분수와 ${show(g)}의 합을 대분수로 나타낼 때, ㉠, ㉡에 알맞은 수는?`, labelled([Math.floor(valueOf(parts) / den), valueOf(parts) % den]), {
        figure: cards(d.shuffle([lo, hi, den])) + eq(blank2(den)),
        explain: `분모가 ${den}이므로 남은 두 수 가운데 큰 수 ${josa(hi, '을/를')} 자연수 부분에, 작은 수 ${josa(lo, '을/를')} 분자에 놓는다. 가장 큰 대분수는 ${show(made)}이다. ${told(parts)}`,
        facts: { calc: calc2(numer(parts), den) }
      });
    }),
    T('cards-sub-max', '수 카드로 빼는 수를 만들어 계산 결과가 가장 큰 뺄셈식 만들기', '②72 ③62 심48', (d) => {
      const den = d.int(7, 11), [c1, c2, c3] = d.shuffle([1, 2, 3, 4, 5, 6]).slice(0, 3).sort((p, q) => p - q), n = c1 + d.int(2, 5), small = MX(c1, c2, den), parts = [Q(n * den, den), '-', small];
      return M('수 카드 중에서 두 장을 골라 □ 안에 한 번씩 써넣어 계산 결과가 가장 큰 뺄셈식을 만들려고 한다. 그 계산 결과를 대분수로 나타낼 때, ㉠, ㉡에 알맞은 수는?', labelled([Math.floor(valueOf(parts) / den), valueOf(parts) % den]), {
        figure: cards(d.shuffle([c1, c2, c3])) + lines([eq(n, '-', mixed(box(), box(), den)), `계산 결과: ${ex(blank2(den))}`]),
        explain: `빼는 수가 작을수록 계산 결과가 크다. 만들 수 있는 가장 작은 대분수는 ${show(small)}이다. ${told(parts)}`,
        facts: { calc: calc2(numer(parts), den) }
      });
    })
  ]);

  // ── □가 있는 식과 어떤 수 ──
  B.addTypes('4-2-1', 'box', [
    T('box-expr', '덧셈식·뺄셈식의 □에 알맞은 분수', '①47 ②59 ③60 심31', (d, n) => {
      // 차례로 □ + b = c(더해지는 수), a − □ = c(빼는 수), □ − b = c(빼어지는 수)
      const den = d.int(5, 12), text = '□ 안에 알맞은 수를 대분수로 나타낼 때, ㉠, ㉡에 알맞은 수는?';
      const item = (shown, parts, why) => M(text, labelled([Math.floor(valueOf(parts) / den), valueOf(parts) % den]), {
        figure: lines([shown, eq(box(), '=', blank2(den))]), explain: `${why} ${told(parts)}`, facts: { calc: calc2(numer(parts), den) }
      });
      if (n === 2) { const [c, b] = carryPair(d, den, 4); return item(eq(box(), '-', show(b), '=', show(c)), [c, '+', b], '□에서 뺀 수를 계산 결과에 더하면 □를 구할 수 있다.'); }
      const [a, b] = borrowPair(d, den);
      if (n === 0) return item(eq(box(), '+', show(b), '=', show(a)), [a, '-', b], '합에서 더한 수를 빼면 □를 구할 수 있다.');
      return item(eq(show(a), '-', box(), '=', show(Q(a.top - b.top, den))), [a, '-', Q(a.top - b.top, den)], '빼어지는 수에서 계산 결과를 빼면 □를 구할 수 있다.');
    }, { count: 3 }),
    T('box-top', '등식이 성립하게 하는 분자', '①47 ③60 심32', (d) => {
      const den = d.int(6, 15), [a, b] = two(d, 2, den - 1, (x, y) => x + y > den), r = a + b - den;
      return N('□ 안에 알맞은 수는?', b, {
        figure: eq(frac(a, den), '+', frac(box(), den), '=', mixed(1, r, den)),
        explain: `${mixed(1, r, den)}${tail(r, '을/를')} 가분수로 나타내면 ${frac(den + r, den)}이다. ${a} + □ = ${den + r}이므로 □ = ${den + r} − ${a} = ${b}이다.`,
        facts: { calc: [[`(1*${den}+${r})-${a}`, 0]] }
      });
    }),
    T('box-balance', '양쪽의 계산 결과가 같은 식의 □', '심33', (d) => {
      const den = d.int(5, 9), [a, b] = carryPair(d, den, 3), c = d.until(() => MX(d.int(1, 2), d.int(1, den - 1), den), (q) => a.top + b.top - q.top > den && (a.top + b.top - q.top) % den !== 0 && R(Q(a.top + b.top, den)) < R(q));
      const parts = [a, '+', b, '-', c];
      return M('□ 안에 알맞은 수를 대분수로 나타낼 때, ㉠, ㉡에 알맞은 수는?', labelled([Math.floor(valueOf(parts) / den), valueOf(parts) % den]), {
        figure: lines([eq(show(a), '+', show(b), '=', show(c), '+', box()), eq(box(), '=', blank2(den))]),
        explain: `왼쪽을 먼저 계산하면 ${told([a, '+', b])}이다. ${show(c)} + □ = ${result([a, '+', b])}이므로 □ = ${result([a, '+', b])} − ${show(c)} = ${result(parts)}이다.`,
        facts: { calc: calc2(numer(parts), den) }
      });
    }),
    T('box-chain', '두 식을 차례로 풀기', '②62', (d) => {
      const den = d.int(6, 13), [a, s] = two(d, 1, den - 1, (x, y) => y > x + 1), t = d.int(den - (s - a) + 1, den - 1), v = t + s - a;
      return M('두 식을 보고 ▲에 알맞은 수를 대분수로 나타낼 때, ㉠, ㉡에 알맞은 수는?', labelled([1, v - den]), {
        figure: lines([eq('●', '+', frac(a, den), '=', frac(s, den)), eq('▲', '-', '●', '=', frac(t, den)), eq('▲', '=', blank2(den))]),
        explain: `● = ${frac(s, den)} − ${frac(a, den)} = ${frac(s - a, den)}이다. ▲ = ${frac(t, den)} + ${frac(s - a, den)} = ${frac(v, den)} = ${mixed(1, v - den, den)}`,
        facts: { calc: calc2(`${t}+${s}-${a}`, den) }
      });
    }),
    T('any-find', '어떤 수 구하기', '①48 ②60 심35', (d) => {
      const den = d.int(5, 12), [c, b] = borrowPair(d, den), parts = [c, '-', b];
      return M(`어떤 수에 ${sj(b, '을/를')} 더했더니 ${sj(c, '이/가')} 되었다. 어떤 수를 대분수로 나타낼 때, ㉠, ㉡에 알맞은 수는?`, labelled([Math.floor(valueOf(parts) / den), valueOf(parts) % den]), {
        figure: eq(blank2(den)), explain: `어떤 수는 ${show(c)}에서 ${sj(b, '을/를')} 뺀 수이다. ${told(parts)}`, facts: { calc: calc2(numer(parts), den) }
      });
    }),
    T('range-proper', '계산 결과가 진분수가 되게 하는 □', '①50 ②63 심37', (d) => {
      const den = d.int(7, 13), a = d.int(den - 7 > 1 ? den - 7 : 1, den - 3), count = den - 1 - a;
      return N('다음 덧셈의 계산 결과가 진분수일 때, □ 안에 들어갈 수 있는 자연수는 모두 몇 개인가?', count, {
        unit: '개', figure: eq(frac(a, den), '+', frac(box(), den)),
        explain: `계산 결과가 진분수이려면 분자의 합 ${a} + □가 분모 ${den}보다 작아야 한다. □ 안에는 1부터 ${count}까지 들어갈 수 있다.`,
        facts: { digit: { template: `(${a}+□)/${den}<1`, lo: 1, hi: den, ask: 'count' } }
      });
    }),
    T('range-add-max', '□가 있는 덧셈식과 자연수의 크기 비교', '③61 심37', (d) => {
      const den = d.int(4, 9), a = d.int(1, den - 1), n = d.int(2, 3), best = n * den - a - 1;
      return N('□ 안에 들어갈 수 있는 자연수 중에서 가장 큰 수는?', best, {
        figure: eq(frac(a, den), '+', frac(box(), den), '<', n),
        explain: `${josa(n, '은/는')} ${frac(n * den, den)}${tail(n * den, '과/와')} 같다. ${a} + □가 ${n * den}보다 작아야 하므로 □ 안의 수는 ${n * den - a}보다 작다. 가장 큰 수는 ${best}이다.`,
        facts: { digit: { template: `(${a}+□)/${den}<${n}`, lo: 1, hi: 60, ask: 'max' } }
      });
    }),
    T('range-add-between', '계산 결과가 1과 2 사이에 있게 하는 □', '①50 ②64', (d) => {
      const den = d.int(5, 11), a = d.int(2, den - 1);
      return N('□ 안에 들어갈 수 있는 자연수는 모두 몇 개인가?', den - 1, {
        unit: '개', figure: eq(1, '<', frac(a, den), '+', frac(box(), den), '<', 2),
        explain: `1은 ${frac(den, den)}, 2는 ${frac(den * 2, den)}이므로 ${a} + □는 ${den}보다 크고 ${den * 2}보다 작아야 한다. □ 안에는 ${den - a + 1}부터 ${den * 2 - a - 1}까지 들어갈 수 있으므로 ${den - 1}개이다.`,
        facts: { digit: { template: `1<(${a}+□)/${den}<2`, lo: 1, hi: 40, ask: 'count' } }
      });
    }),
    T('range-sub-count', '□가 있는 뺄셈식의 크기 비교', '②64 심38', (d) => {
      const den = d.int(8, 15), [a, c] = two(d, 2, den - 1, (x, y) => x - y >= 3 && x - y <= 7);
      return N('□ 안에 들어갈 수 있는 자연수는 모두 몇 개인가?', a - c - 1, {
        unit: '개', figure: eq(frac(a, den), '-', frac(box(), den), '>', frac(c, den)),
        explain: `분자끼리 비교하면 ${a} − □가 ${c}보다 커야 한다. ${a} − ${c} = ${a - c}이므로 □ 안에는 ${a - c}보다 작은 수 1부터 ${a - c - 1}까지 들어갈 수 있다.`,
        facts: { digit: { template: `(${a}-□)/${den}>${c}/${den}`, lo: 1, hi: a - 1, ask: 'count' } }
      });
    }),
    T('range-sub-min', '빼는 수가 커질수록 작아지는 계산 결과', '②64 심38', (d) => {
      const den = d.int(8, 15), [a, c] = two(d, 3, den - 1, (x, y) => x - y >= 2 && y >= 2);
      return N('□ 안에 들어갈 수 있는 자연수 중에서 가장 작은 수는?', a - c + 1, {
        figure: eq(frac(a, den), '-', frac(box(), den), '<', frac(c, den)),
        explain: `분자끼리 비교하면 ${a} − □가 ${c}보다 작아야 한다. ${a} − ${a - c} = ${c}이고 빼는 수가 클수록 계산 결과는 작아지므로 □ 안에는 ${a - c}보다 큰 수가 들어간다. 가장 작은 수는 ${a - c + 1}이다.`,
        facts: { digit: { template: `(${a}-□)/${den}<${c}/${den}`, lo: 1, hi: a - 1, ask: 'min' } }
      });
    }),
    T('range-mixed', '계산 결과와 □가 있는 대분수의 크기 비교', '①50 ②65 심39', (d) => {
      const den = d.int(6, 12), [a, b] = d.until(() => borrowPair(d, den), ([p, q]) => (p.top - q.top) % den >= 3), r = Q(a.top - b.top, den);
      return N('□ 안에 들어갈 수 있는 자연수는 모두 몇 개인가?', R(r) - 1, {
        unit: '개', figure: eq(show(a), '-', show(b), '>', mixed(W(r), box(), den)),
        explain: `${told([a, '-', b])}이다. 자연수 부분이 같으므로 □ 안에는 ${R(r)}보다 작은 수 1부터 ${R(r) - 1}까지 들어갈 수 있다.`,
        facts: { digit: { template: `(${top(a)}-${top(b)})/${den}>(${W(r)}*${den}+□)/${den}`, lo: 1, hi: den - 1, ask: 'count' } }
      });
    }),
    T('between-nat', '두 계산 결과 사이에 있는 자연수', '심41', (d) => {
      const den = d.int(4, 9), n = d.int(2, 4), p = d.int(1, den - 1), [a, b] = d.until(() => carryPair(d, den, 3), ([x, y]) => Math.floor((x.top + y.top) / den) >= n + 2), hi = Math.floor((a.top + b.top) / den);
      return N('□ 안에 들어갈 수 있는 자연수는 모두 몇 개인가?', hi - n + 1, {
        unit: '개', figure: eq(n, '-', frac(p, den), '<', box(), '<', show(a), '+', show(b)),
        explain: `${n} − ${frac(p, den)} = ${show(Q(n * den - p, den))}, ${told([a, '+', b])}이다. □ 안에는 ${n}부터 ${hi}까지의 자연수가 들어갈 수 있다.`,
        facts: { digit: { template: `${n}-${p}/${den}<□<(${top(a)}+${top(b)})/${den}`, lo: 1, hi: 30, ask: 'count' } }
      });
    })
  ]);

  // ── 분수의 덧셈과 뺄셈의 활용(문장제) ──
  const FRUITS = ['사과', '배', '감', '귤', '참외', '복숭아'];
  B.addTypes('4-2-1', 'word', [
    T('word-join-proper', '문장제: 두 양을 합치기(진분수)', '①59 ②77 ③68 심54', (d) => {
      const den = d.int(6, 15), [a, b] = two(d, 1, den - 2, (x, y) => x + y < den && x !== y), parts = [Q(a, den), '+', Q(b, den)];
      return word(`빨간색 페인트 ${frac(a, den)} L와 흰색 페인트 ${frac(b, den)} L를 섞어 분홍색 페인트를 만들었다. 만든 분홍색 페인트는 모두 몇 L인가?`, parts, 'L', told(parts));
    }),
    T('word-join-over', '문장제: 두 양을 합치기(합이 1보다 크다)', '①59 ②77 ③69 심54', (d) => {
      const who = d.pick(NAMES), den = d.int(5, 12), [a, b] = two(d, 2, den - 1, (x, y) => x + y > den && x !== y), parts = [Q(a, den), '+', Q(b, den)];
      return word(`${name(who, '은/는')} 물을 아침에 ${frac(a, den)} L, 저녁에 ${frac(b, den)} L 마셨다. ${name(who, '이/가')} 아침과 저녁에 마신 물은 모두 몇 L인가?`, parts, 'L', `${frac(a, den)} + ${frac(b, den)} = ${frac(a + b, den)} = ${result(parts)}`);
    }),
    T('word-join-mixed', '문장제: 두 양을 합치기(대분수)', '①59 ②77 ③70 심54', (d) => {
      const den = d.int(5, 12), [a, b] = carryPair(d, den, 6), parts = [a, '+', b];
      return word(`밭에서 고구마를 ${show(a)} kg, 감자를 ${show(b)} kg 캤다. 캔 고구마와 감자의 무게는 모두 몇 kg인가?`, parts, 'kg', told(parts));
    }),
    T('word-more', '문장제: 더 많은 쪽의 양 구하기', '①60 ②78 심56', (d) => {
      const den = d.int(5, 15), [a, b] = carryPair(d, den, 6), parts = [a, '+', b];
      return word(`작은 물통에는 물이 ${show(a)} L 들어 있고, 큰 물통에는 작은 물통보다 물이 ${show(b)} L 더 많이 들어 있다. 큰 물통에 들어 있는 물은 몇 L인가?`, parts, 'L', `큰 물통의 물의 양은 작은 물통의 물의 양에 ${show(b)} L를 더한 것이다. ${told(parts)}`);
    }),
    T('word-less', '문장제: 더 적은 쪽의 양 구하기', '②79 ③81', (d) => {
      const den = d.int(5, 12), [x, y] = two(d, 1, den - 1, (p, q) => p < q), a = MX(d.int(2, 9), x, den), b = Q(y, den), parts = [a, '-', b];
      return word(`수박의 무게는 ${show(a)} kg이고, 멜론은 수박보다 ${show(b)} kg 더 가볍다. 멜론의 무게는 몇 kg인가?`, parts, 'kg', `멜론의 무게는 수박의 무게에서 ${show(b)} kg을 뺀 것이다. ${told(parts)}`);
    }),
    T('word-left-proper', '문장제: 남은 양(진분수)', '①61 ②80 ③73', (d) => {
      const den = d.int(6, 20), [a, b] = two(d, 1, den - 1, (x, y) => x > y + 1 && x - y !== y), parts = [Q(a, den), '-', Q(b, den)];
      return word(`철사 ${frac(a, den)} m 중에서 ${frac(b, den)} m를 잘라 사용하였다. 남은 철사는 몇 m인가?`, parts, 'm', told(parts));
    }),
    T('word-one-left', '문장제: 전체 1에서 덜어 낸 나머지', '①61·64 ②80 ③77 심58', (d) => {
      const who = d.pick(NAMES), den = d.int(5, 12), b = d.until(() => d.int(2, den - 2), (v) => v * 2 !== den);
      return wordRaw(`${name(who, '은/는')} 떡 한 판을 똑같이 ${den}조각으로 나누어 그중 ${b}조각을 먹었다. 남은 떡은 한 판의 얼마인가?`, `${den}-${b}`, den - b, den, '', `한 판 전체는 1이고 먹은 떡은 한 판의 ${frac(b, den)}이다. 1 − ${frac(b, den)} = ${frac(den, den)} − ${frac(b, den)} = ${frac(den - b, den)}`, { lead: '한 판의 ' });
    }),
    T('word-left-nat', '문장제: 자연수만큼에서 덜어 낸 나머지', '①61 ②80 ③76 심58', (d) => {
      const den = d.int(5, 15), [n, w] = two(d, 1, 9, (p, q) => p >= q + 2), b = MX(w, d.int(1, den - 1), den), parts = [Q(n * den, den), '-', b];
      return word(`식용유 ${n} L 중에서 ${show(b)} L를 사용하였다. 남은 식용유는 몇 L인가?`, parts, 'L', `${n}에서 1만큼을 ${frac(den, den)}${tail(den, '으로/로')} 바꾸어 계산한다. ${mixed(n - 1, den, den)} − ${show(b)} = ${result(parts)}`);
    }),
    T('word-left-borrow', '문장제: 남은 양(받아내림)', '①61 ②80 ③74·75 심58', (d) => {
      const den = d.int(5, 13), [a, b] = borrowPair(d, den), parts = [a, '-', b];
      return word(`털실 ${show(a)} m 중에서 ${show(b)} m를 사용하여 장갑을 떴다. 남은 털실은 몇 m인가?`, parts, 'm', told(parts));
    }),
    T('word-used', '문장제: 처음 양과 남은 양으로 쓴 양 구하기', '①61 ②87 ③74', (d) => {
      const den = d.int(5, 12), [x, y] = two(d, 1, den - 1, (p, q) => p > q), [w1, w2] = two(d, 1, 9, (p, q) => p >= q + 2), a = MX(w1, x, den), c = MX(w2, y, den), parts = [a, '-', c];
      return word(`콩 ${show(a)} kg 중에서 얼마를 팔았더니 ${show(c)} kg이 남았다. 판 콩은 몇 kg인가?`, parts, 'kg', `판 콩의 무게는 처음 무게에서 남은 무게를 뺀 것이다. ${told(parts)}`);
    }),
    T('word-box', '문장제: 그릇째 잰 무게에서 그릇의 무게 빼기', '①61 ②80 ③78', (d) => {
      const den = d.int(5, 12), [x, y] = two(d, 1, den - 1, (p, q) => p < q), a = MX(d.int(4, 9), x, den), b = MX(1, y, den), parts = [a, '-', b];
      return word(`책이 든 가방의 무게는 ${show(a)} kg이고, 빈 가방의 무게는 ${show(b)} kg이다. 가방에 든 책의 무게는 몇 kg인가?`, parts, 'kg', `책의 무게는 책이 든 가방의 무게에서 빈 가방의 무게를 뺀 것이다. ${told(parts)}`);
    }),
    T('word-diff', '문장제: 두 양의 차', '①62·75 ②81·88 ③79·85 심59·77', (d) => {
      const den = d.int(5, 12), [x, y] = two(d, 1, den - 1, (p, q) => p < q), w = d.int(1, 6), a = MX(w + 1, x, den), b = MX(w, y, den), parts = [a, '-', b];
      return word(`노란색 리본의 길이는 ${show(a)} m이고, 초록색 리본의 길이는 ${show(b)} m이다. 노란색 리본은 초록색 리본보다 몇 m 더 긴가?`, parts, 'm', `${frac(x, den)}에서 ${fj(y, den, '을/를')} 뺄 수 없으므로 ${sj(a, '을/를')} ${mixed(w, x + den, den)}${tail(x + den, '으로/로')} 바꾸어 계산한다. ${told(parts)}`);
    }),
    T('word-who-more', '문장제: 누가 얼마나 더', '①63 ②82 ③80 심59', (d) => {
      // 틀린 차: 받아내림하지 않고 자연수끼리, 분자끼리 큰 수에서 작은 수를 뺀 값
      const [one, two2] = d.shuffle(NAMES).slice(0, 2), den = d.int(5, 12), [big, small] = borrowPair(d, den, 6), flip = d.bool(), list = flip ? [small, big] : [big, small];
      const gap = big.top - small.top, naive = (W(big) - W(small)) * den + (R(small) - R(big)), winner = flip ? 1 : 0;
      const options = d.shuffle([[winner, gap], [1 - winner, gap], [winner, naive], [1 - winner, naive]]);
      return C(`${name(one, '은/는')} 리본을 ${show(list[0])} m, ${name(two2, '은/는')} ${show(list[1])} m 가지고 있다. 누가 리본을 몇 m 더 많이 가지고 있는가?`, options.map(([who, n]) => `${[one, two2][who]}, ${show(Q(n, den))} m`), options.findIndex(([who, n]) => who === winner && n === gap), {
        explain: `자연수 부분이 큰 ${show(big)} m가 더 길다. ${told([big, '-', small])}이므로 ${name([one, two2][winner], '이/가')} ${show(Q(gap, den))} m 더 많이 가지고 있다.`,
        facts: { who: { values: list.map((q) => q.top), options, exprs: list.map(top) } }
      });
    }),
    T('word-need', '문장제: 더 필요한 양', '심60', (d) => {
      const who = d.pick(NAMES), den = d.int(5, 12), [a, b] = borrowPair(d, den), parts = [a, '-', b];
      return word(`${name(who, '은/는')} 목도리를 ${show(a)} m 뜨려고 한다. 지금까지 ${show(b)} m를 떴다면 앞으로 몇 m를 더 떠야 하는가?`, parts, 'm', `더 떠야 하는 길이는 뜨려는 길이에서 지금까지 뜬 길이를 뺀 것이다. ${told(parts)}`);
    }),
    T('word-first', '문장제: 처음에 있던 양', '심61', (d) => {
      const den = d.int(5, 12), [c, b] = borrowPair(d, den), parts = [c, '-', b];
      return word(`화분에 흙을 ${show(b)} kg 더 넣었더니 화분의 흙이 ${show(c)} kg이 되었다. 처음 화분에 들어 있던 흙은 몇 kg인가?`, parts, 'kg', `처음에 있던 흙의 무게는 지금의 무게에서 더 넣은 무게를 뺀 것이다. ${told(parts)}`);
    }),
    T('word-pieces', '문장제: 조각 수를 분수로 나타내어 차 구하기', '①64 ②95', (d) => {
      const [one, two2] = d.shuffle(NAMES).slice(0, 2), den = d.int(6, 12), [a, b] = two(d, 1, den - 2, (x, y) => x > y && x + y <= den && x - y !== y);
      return wordRaw(`카스텔라 한 개를 똑같이 ${den}조각으로 나누어 ${name(one, '은/는')} ${a}조각, ${name(two2, '은/는')} ${b}조각을 먹었다. ${name(one, '은/는')} ${nick(two2)}보다 카스텔라 한 개의 얼마만큼을 더 먹었는가?`, `${a}-${b}`, a - b, den, '', `한 조각은 카스텔라 한 개의 ${frac(1, den)}이다. ${name(one, '은/는')} ${frac(a, den)}, ${name(two2, '은/는')} ${frac(b, den)}만큼 먹었으므로 ${frac(a, den)} − ${frac(b, den)} = ${frac(a - b, den)}이다.`, { lead: '한 개의 ' });
    }),
    T('word-three', '문장제: 세 양의 합', '①66 심55', (d) => {
      const who = d.pick(NAMES), den = d.int(5, 9), tops = d.until(() => [d.int(1, den - 1), d.int(1, den - 1), d.int(1, den - 1)], ([p, q, r]) => (p + q + r) % den !== 0 && p + q + r > den);
      const [a, b, c] = tops.map((v) => MX(d.int(1, 2), v, den)), parts = [a, '+', b, '+', c];
      return word(`${name(who, '은/는')} 어제 ${show(a)} km, 오늘 ${show(b)} km를 달렸고, 내일은 ${show(c)} km를 달리려고 한다. ${name(who, '이/가')} 3일 동안 달리는 거리는 모두 몇 km인가?`, parts, 'km', `앞에서부터 차례로 더한다. ${told([a, '+', b])}, ${result([a, '+', b])} + ${show(c)} = ${result(parts)}`);
    }),
    T('word-twice', '문장제: 같은 양 두 번 더하기', '②90 ③72', (d) => {
      const den = d.int(5, 12), a = d.until(() => d.int(2, den - 1), (v) => v * 2 > den && v * 2 !== den * 2), q = Q(a, den), parts = [q, '+', q];
      return word(`물뿌리개 한 개에는 물이 ${frac(a, den)} L 들어간다. 똑같은 물뿌리개 2개를 가득 채우는 데 필요한 물은 모두 몇 L인가?`, parts, 'L', `한 개에 들어가는 물의 양을 두 번 더한다. ${frac(a, den)} + ${frac(a, den)} = ${frac(a * 2, den)} = ${result(parts)}`);
    }),
    T('word-route-part', '문장제: 길 위의 한 구간', '①75 ③83', (d) => {
      const den = d.int(5, 12), [a, b] = borrowPair(d, den, 5), parts = [a, '-', b];
      return word(`학교에서 공원을 지나 도서관까지의 거리는 ${show(a)} km이고, 공원에서 도서관까지의 거리는 ${show(b)} km이다. 학교에서 공원까지의 거리는 몇 km인가?`, parts, 'km', `학교에서 도서관까지의 거리에서 공원에서 도서관까지의 거리를 뺀다. ${told(parts)}`, { figure: route([['학교', 0, 50], ['공원', 45, 50], ['도서관', 100, 50]], [[0, 1], [1, 2]], 40) });
    }),
    T('word-route-sum', '문장제: 한 곳을 지나서 간 거리', '②86 ③70·85', (d) => {
      const den = d.int(5, 15), [x, y] = two(d, 2, den - 1, (p, q) => p + q > den), a = MX(d.int(1, 3), x, den), b = Q(y, den), parts = [a, '+', b];
      return word(`집에서 놀이터까지의 거리는 ${show(a)} km이고, 놀이터에서 수영장까지의 거리는 ${show(b)} km이다. 집에서 놀이터를 지나 수영장까지 가는 거리는 몇 km인가?`, parts, 'km', `두 구간의 거리를 더한다. ${told(parts)}`, { figure: route([['집', 0, 50], ['놀이터', 60, 50], ['수영장', 100, 50]], [[0, 1], [1, 2]], 40) });
    }),
    T('word-table-sum', '문장제: 표에서 두 양을 찾아 더하기', '③71', (d) => {
      const den = d.int(5, 9), names = d.shuffle(FRUITS).slice(0, 4);
      const list = d.until(() => [0, 0, 0, 0].map(() => MX(d.int(1, 4), d.int(1, den - 1), den)), (qs) => new Set(qs.map((q) => q.top)).size === 4 && R(qs[0]) + R(qs[1]) > den);
      const order = d.shuffle([0, 1, 2, 3]), parts = [list[0], '+', list[1]];
      return word(`과일의 무게를 나타낸 표이다. ${josa(names[0], '과/와')} ${names[1]}의 무게의 합은 몇 kg인가?`, parts, 'kg', `${names[0]}의 무게는 ${show(list[0])} kg, ${names[1]}의 무게는 ${show(list[1])} kg이다. ${told(parts)}`, { figure: table(['과일', '무게'], order.map((i) => [names[i], show(list[i]) + ' kg'])) });
    })
  ]);

  // ── 실력 문제 ──
  B.addGroup('4-2-1', {
    id: 'hard', title: '실력 문제', standard: STD,
    types: [
      H('h-add-den', '진분수의 덧셈을 바르게 계산한 것', '심7·8, 기본 ①46 ③10', (d) => {
        const den = d.int(5, 9), [a, b] = two(d, 2, den - 1, (x, y) => x + y > den + 1 && x !== y), s = a + b, r = s - den;
        const list = d.shuffle([
          [mixed(1, r, den), `(1*${den}+${r})/${den}`],                    // 바른 것
          [frac(s, den * 2), `${s}/${den * 2}`],                            // 분자끼리 더하면서 분모끼리도 더하는 아이가 고른다
          [mixed(1, r, den * 2), `(1*${den * 2}+${r})/${den * 2}`],         // 분모끼리도 더한 뒤 분자에서 처음 분모만큼 덜어 대분수로 고치는 아이가 고른다
          [frac(r, den), `${r}/${den}`]                                     // 분자의 합에서 분모만큼 덜어 내고 자연수 1을 적지 않는 아이가 고른다
        ]);
        return C('바르게 계산한 것은?', list.map((row) => row[0]), list.findIndex((row) => row[1] === `(1*${den}+${r})/${den}`), {
          figure: eq(frac(a, den), '+', frac(b, den)),
          explain: `분모는 그대로 두고 분자끼리만 더한다. ${frac(a, den)} + ${frac(b, den)} = ${frac(s, den)}이고, ${fj(s, den, '은/는')} ${frac(den, den)}${tail(den, '과/와')} ${frac(r, den)}의 합이므로 ${mixed(1, r, den)}이다.`,
          facts: { choose: { exprs: list.map((row) => row[1]), rule: 'equals', target: s / den } }
        });
      }),
      H('h-add-carry', '분수 부분의 합이 1보다 큰 대분수의 덧셈을 바르게 계산한 것', '심10, 기본 ①46', (d) => {
        const den = d.int(5, 9), [a, b] = carryPair(d, den, 4), w = W(a) + W(b), s = R(a) + R(b), r = s - den;
        const list = d.shuffle([
          [mixed(w + 1, r, den), `(${w + 1}*${den}+${r})/${den}`, true],   // 바른 것
          [mixed(w, r, den), `(${w}*${den}+${r})/${den}`],                  // 분수 부분에서 받아올림한 1을 자연수 부분에 더하지 않는 아이가 고른다
          [mixed(w, s, den * 2), `(${w}*${den * 2}+${s})/${den * 2}`],      // 분수 부분을 더할 때 분모끼리도 더하는 아이가 고른다
          [mixed(w + 1, s, den), `(${w + 1}*${den}+${s})/${den}`]           // 자연수 부분에 1을 더하고도 분자에서 분모만큼 덜어 내지 않는 아이가 고른다
        ]);
        return C('바르게 계산한 것은?', list.map((row) => row[0]), list.findIndex((row) => row[2]), {
          figure: eq(show(a), '+', show(b)),
          explain: `자연수 부분끼리 더하면 ${W(a)} + ${W(b)} = ${w}, 분수 부분끼리 더하면 ${frac(R(a), den)} + ${frac(R(b), den)} = ${frac(s, den)} = ${mixed(1, r, den)}이다. ${w} + ${mixed(1, r, den)} = ${mixed(w + 1, r, den)}`,
          facts: { choose: { exprs: list.map((row) => row[1]), rule: 'equals', target: ((w + 1) * den + r) / den } }
        });
      }),
      H('h-sub-borrow', '분수 부분끼리 뺄 수 없는 대분수의 뺄셈을 바르게 계산한 것', '심15, 기본 ①46 ③41', (d) => {
        const den = d.int(5, 11), [a, b] = d.until(() => borrowPair(d, den, 7), ([p, q]) => (R(q) - R(p)) * 2 !== den), w = W(a) - W(b), up = R(a) + den - R(b), down = R(b) - R(a);
        const list = d.shuffle([
          [mixed(w - 1, up, den), `(${w - 1}*${den}+${up})/${den}`, true],  // 바른 것
          [mixed(w, down, den), `(${w}*${den}+${down})/${den}`],             // 받아내림하지 않고 분자를 큰 수에서 작은 수를 빼는 아이가 고른다
          [mixed(w, up, den), `(${w}*${den}+${up})/${den}`],                 // 1만큼을 받아내림하고도 자연수 부분을 줄이지 않는 아이가 고른다
          [mixed(w - 1, down, den), `(${w - 1}*${den}+${down})/${den}`]      // 자연수 부분은 줄였지만 분자는 큰 수에서 작은 수를 뺀 아이가 고른다
        ]);
        return C('바르게 계산한 것은?', list.map((row) => row[0]), list.findIndex((row) => row[2]), {
          figure: eq(show(a), '-', show(b)),
          explain: `${frac(R(a), den)}에서 ${fj(R(b), den, '을/를')} 뺄 수 없으므로 자연수에서 1만큼을 받아내림하여 ${sj(a, '을/를')} ${mixed(W(a) - 1, R(a) + den, den)}${tail(R(a) + den, '으로/로')} 바꾼다. ${mixed(W(a) - 1, R(a) + den, den)} − ${show(b)} = ${mixed(w - 1, up, den)}`,
          facts: { choose: { exprs: list.map((row) => row[1]), rule: 'equals', target: ((w - 1) * den + up) / den } }
        });
      }),
      H('h-nat-minus', '자연수에서 대분수를 빼는 계산을 바르게 한 것', '심8·17, 기본 ①46 ②96 ③35', (d) => {
        const den = d.int(5, 11), y = d.until(() => d.int(1, den - 1), (v) => v * 2 !== den), [n, k] = two(d, 1, 9, (p, q) => p >= q + 2), b = MX(k, y, den), w = n - k;
        const list = d.shuffle([
          [mixed(w - 1, den - y, den), `(${w - 1}*${den}+${den - y})/${den}`, true],  // 바른 것
          [mixed(w, y, den), `(${w}*${den}+${y})/${den}`],                             // 자연수끼리만 빼고 분수는 빼지 않고 그대로 붙이는 아이가 고른다
          [mixed(w, den - y, den), `(${w}*${den}+${den - y})/${den}`],                 // 1만큼을 분수로 바꾸고도 자연수 부분을 줄이지 않는 아이가 고른다
          [mixed(w - 1, y, den), `(${w - 1}*${den}+${y})/${den}`]                      // 자연수 부분은 줄였지만 분수를 빼지 않고 그대로 쓴 아이가 고른다
        ]);
        return C('바르게 계산한 것은?', list.map((row) => row[0]), list.findIndex((row) => row[2]), {
          figure: eq(n, '-', show(b)),
          explain: `${n}에서 1만큼을 ${frac(den, den)}${tail(den, '으로/로')} 바꾸면 ${mixed(n - 1, den, den)}이다. ${mixed(n - 1, den, den)} − ${show(b)} = ${mixed(w - 1, den - y, den)}`,
          facts: { choose: { exprs: list.map((row) => row[1]), rule: 'equals', target: ((w - 1) * den + den - y) / den } }
        });
      }),
      H('h-to-mixed', '가분수가 낀 덧셈의 결과를 대분수로 바르게 나타낸 것', '심11, 기본 ②14', (d) => {
        const den = d.int(5, 9), w = d.int(1, 5), x = d.int(2, den - 1), t = d.until(() => d.int(den + 2, den * 2 - 1), (v) => x + v > den * 2), s = x + t, r = s - den * 2;
        const a = MX(w, x, den), b = Q(t, den, true);
        const list = d.shuffle([
          [mixed(w + 2, r, den), `(${w + 2}*${den}+${r})/${den}`, true],   // 바른 것
          [mixed(w + 1, r, den), `(${w + 1}*${den}+${r})/${den}`],          // 분자에서 분모만큼 두 번 덜어 내고 자연수 부분에는 1만 더하는 아이가 고른다
          [mixed(w, r, den), `(${w}*${den}+${r})/${den}`],                  // 분자에서 분모만큼 덜어 내기만 하고 자연수 부분에 더하지 않는 아이가 고른다
          [mixed(w, s, den * 2), `(${w}*${den * 2}+${s})/${den * 2}`]       // 분자끼리 더하면서 분모끼리도 더하는 아이가 고른다
        ]);
        return C('계산 결과를 대분수로 바르게 나타낸 것은?', list.map((row) => row[0]), list.findIndex((row) => row[2]), {
          figure: eq(show(a), '+', show(b)),
          explain: `분수 부분끼리 더하면 ${frac(x, den)} + ${frac(t, den)} = ${frac(s, den)}이다. ${fj(s, den, '은/는')} ${frac(den, den)}${tail(den, '이/가')} 2개이고 ${frac(r, den)}${tail(r, '이/가')} 남으므로 ${mixed(2, r, den)}이다. ${w} + ${mixed(2, r, den)} = ${mixed(w + 2, r, den)}`,
          facts: { choose: { exprs: list.map((row) => row[1]), rule: 'equals', target: ((w + 2) * den + r) / den } }
        });
      }),
      H('h-improper-pick', '대분수를 가분수로 바꾸어 바르게 계산한 것', '심7·18, 기본 ①46 ③23·41', (d) => {
        const den = d.int(4, 9), [x, y] = two(d, 1, den - 1, () => true), [w1, w2] = two(d, 1, 4, (p, q) => p !== q || x !== y), a = MX(w1, x, den), b = MX(w2, y, den);
        const line = (p, q) => `${frac(p, den)} + ${frac(q, den)} = ${frac(p + q, den)}`;
        const rows = d.shuffle([
          [a.top, b.top],                    // 바른 것: 자연수 부분에 분모를 곱하고 분자를 더한다
          [w1 * 10 + x, w2 * 10 + y],        // 자연수와 분자를 이어 써서 분자로 삼는 아이가 고른다
          [w1 + x, w2 + y]                   // 자연수와 분자를 더해 분자로 삼는 아이가 고른다
        ]);
        return C(`${show(a)} + ${show(b)}${tail(y, '을/를')} 가분수로 바꾸어 계산하려고 한다. 바르게 계산한 것은?`, rows.map(([p, q]) => line(p, q)), rows.findIndex(([p, q]) => p === a.top && q === b.top), {
          explain: `${sj(a, '은/는')} ${frac(1, den)}이 ${w1} × ${den} + ${x} = ${a.top}(개)이므로 ${frac(a.top, den)}이고, ${sj(b, '은/는')} ${frac(1, den)}이 ${w2} × ${den} + ${y} = ${b.top}(개)이므로 ${frac(b.top, den)}이다.`,
          facts: { claimed: rows.map(([p, q]) => [`${top(a)}+${top(b)}`, p + q]), claimedWant: true }
        });
      }),
      H('h-range-sub-top', '빼는 수의 분자에 □가 있는 크기 비교', '심39, 기본 ①50', (d) => {
        const den = d.int(6, 12), [n, w] = two(d, 1, 9, (p, q) => p >= q + 2), z = d.int(2, den - 3), count = den - z - 1;
        return N('□ 안에 들어갈 수 있는 자연수는 모두 몇 개인가?', count, {
          unit: '개', figure: eq(n, '-', mixed(w, box(), den), '>', mixed(n - w - 1, z, den)),
          explain: `${n}에서 1만큼을 ${frac(den, den)}${tail(den, '으로/로')} 바꾸면 ${mixed(n - 1, den, den)} − ${mixed(w, '□', den)}이므로 계산 결과의 자연수 부분은 ${n - w - 1}, 분자는 ${den} − □이다. ${den} − □가 ${z}보다 커야 하므로 □ 안에는 ${den - z}보다 작은 수 1부터 ${count}까지 들어갈 수 있다.`,
          facts: { digit: { template: `(${n}*${den}-(${w}*${den}+□))/${den}>(${n - w - 1}*${den}+${z})/${den}`, lo: 1, hi: den - 1, ask: 'count' } }
        });
      }),
      H('h-range-improper', '계산 결과보다 작은 가분수의 분자', '심40', (d) => {
        const den = d.int(4, 9), [a, b] = borrowPair(d, den, 6), v = a.top - b.top;
        return N('□ 안에 들어갈 수 있는 자연수 중에서 가장 큰 수는?', v - 1, {
          figure: eq(show(a), '-', show(b), '>', frac(box(), den)),
          explain: `${told([a, '-', b])}이고, 가분수로 나타내면 ${frac(v, den)}이다. □ 안에는 ${v}보다 작은 수가 들어갈 수 있으므로 가장 큰 수는 ${v - 1}이다.`,
          facts: { digit: { template: `(${top(a)}-${top(b)})/${den}>□/${den}`, lo: 1, hi: 80, ask: 'max' } }
        });
      }),
      H('h-any-wrong', '잘못 계산한 것을 바르게 계산하기', '심36, 기본 ①49 ②61 ③67', (d, n) => {
        // 첫째 문항은 빼야 할 것을 더했고, 둘째 문항은 더해야 할 것을 뺐다.
        const den = d.int(5, 11);
        if (n === 0) {
          const [b, c] = d.until(() => [MX(d.int(1, 2), d.int(1, den - 1), den), MX(d.int(4, 9), d.int(1, den - 1), den)], ([p, q]) => q.top - p.top * 2 > den && (q.top - p.top * 2) % den !== 0 && (q.top - p.top) % den !== 0 && R(q) < R(p));
          const parts = [c, '-', b, '-', b], any = Q(c.top - b.top, den);
          return M(`어떤 수에서 ${sj(b, '을/를')} 빼야 할 것을 잘못하여 더했더니 ${sj(c, '이/가')} 되었다. 바르게 계산한 값을 대분수로 나타낼 때, ㉠, ㉡에 알맞은 수는?`, labelled([Math.floor(valueOf(parts) / den), valueOf(parts) % den]), {
            figure: eq(blank2(den)), explain: `어떤 수는 ${show(c)} − ${show(b)} = ${show(any)}이다. 바르게 계산하면 ${show(any)} − ${show(b)} = ${result(parts)}이다.`, facts: { calc: calc2(numer(parts), den) }
          });
        }
        const [b, c] = d.until(() => [MX(d.int(1, 3), d.int(1, den - 1), den), MX(d.int(1, 5), d.int(1, den - 1), den)], ([p, q]) => (q.top + p.top * 2) % den !== 0 && (q.top + p.top) % den !== 0 && R(q) + R(p) > den);
        const parts = [c, '+', b, '+', b], any = Q(c.top + b.top, den);
        return M(`어떤 수에 ${sj(b, '을/를')} 더해야 할 것을 잘못하여 뺐더니 ${sj(c, '이/가')} 되었다. 바르게 계산한 값을 대분수로 나타낼 때, ㉠, ㉡에 알맞은 수는?`, labelled([Math.floor(valueOf(parts) / den), valueOf(parts) % den]), {
          figure: eq(blank2(den)), explain: `어떤 수는 ${show(c)} + ${show(b)} = ${show(any)}이다. 바르게 계산하면 ${show(any)} + ${show(b)} = ${result(parts)}이다.`, facts: { calc: calc2(numer(parts), den) }
        });
      }, { count: 2 }),
      H('h-one-then-sum', '문장제: 한쪽의 양을 구한 뒤 둘의 합 구하기', '심57, 기본 ①65 ②83', (d) => {
        const [one, two2] = d.shuffle(NAMES).slice(0, 2), den = d.int(5, 11);
        const [a, b] = d.until(() => carryPair(d, den, 3), ([p, q]) => (p.top * 2 + q.top) % den !== 0 && W(p) !== W(q)), parts = [a, '+', a, '+', b], other = Q(a.top + b.top, den);
        return word(`${name(one, '은/는')} 찰흙을 ${show(a)} kg 사용하였고, ${name(two2, '은/는')} ${nick(one)}보다 ${show(b)} kg 더 많이 사용하였다. 두 사람이 사용한 찰흙은 모두 몇 kg인가?`, parts, 'kg', `${name(two2, '이/가')} 사용한 찰흙은 ${show(a)} + ${show(b)} = ${show(other)}(kg)이다. 두 사람이 사용한 찰흙은 ${show(a)} + ${show(other)} = ${result(parts)}(kg)이다.`);
      }),
      H('h-one-then-diff', '문장제: 한쪽의 양을 구한 뒤 다른 양과의 차 구하기', '심67', (d) => {
        const [one, two2, three] = d.shuffle(NAMES).slice(0, 3), den = d.int(5, 11);
        const [a, b, c] = d.until(() => [MX(d.int(4, 7), d.int(1, den - 1), den), MX(d.int(2, 3), d.int(1, den - 1), den), Q(d.int(1, den - 1), den)], ([p, q, r]) => R(q) < r.top && (p.top - q.top + r.top) % den !== 0 && p.top - q.top + r.top > den);
        const third = Q(b.top - c.top, den), value = a.top - third.top;
        return wordRaw(`리본을 ${name(one, '은/는')} ${show(a)} m, ${name(two2, '은/는')} ${show(b)} m 사용하였고, ${name(three, '은/는')} ${nick(two2)}보다 ${show(c)} m 더 적게 사용하였다. ${name(one, '은/는')} ${nick(three)}보다 리본을 몇 m 더 많이 사용하였는가?`, `${top(a)}-(${top(b)}-${top(c)})`, value, den, 'm', `${name(three, '이/가')} 사용한 리본은 ${show(b)} − ${show(c)} = ${show(third)}(m)이다. ${show(a)} − ${show(third)} = ${show(Q(value, den))}`);
      }),
      H('h-use-refill', '문장제: 쓰고 남은 것에 다시 채우기', '심65, 기본 ①67', (d) => {
        const den = d.int(5, 11);
        const [a, b, c] = d.until(() => [MX(d.int(4, 8), d.int(1, den - 1), den), MX(d.int(1, 2), d.int(1, den - 1), den), MX(d.int(1, 3), d.int(1, den - 1), den)], ([p, q, r]) => R(p) < R(q) && (R(p) + den - R(q)) + R(r) > den && (p.top - q.top + r.top) % den !== 0 && q.top !== r.top);
        const parts = [a, '-', b, '+', c], left = Q(a.top - b.top, den);
        return word(`쌀통에 쌀이 ${show(a)} kg 들어 있었다. 그중에서 ${show(b)} kg을 먹고, ${show(c)} kg을 새로 채웠다. 지금 쌀통에 들어 있는 쌀은 몇 kg인가?`, parts, 'kg', `먹고 남은 쌀은 ${show(a)} − ${show(b)} = ${show(left)}(kg)이다. 새로 채운 뒤에는 ${show(left)} + ${show(c)} = ${result(parts)}(kg)이다.`);
      }),
      H('h-two-out', '문장제: 서로 다른 양을 두 번 덜어 내기', '심62·63, 기본 ①68', (d) => {
        const den = d.int(4, 10);
        const [b, c] = d.until(() => [MX(d.int(1, 3), d.int(1, den - 1), den), MX(d.int(1, 3), d.int(1, den - 1), den)], ([p, q]) => p.top !== q.top && (p.top + q.top) % den !== 0 && R(p) + R(q) !== den);
        const n = Math.ceil((b.top + c.top) / den) + d.int(1, 3), parts = [Q(n * den, den), '-', b, '-', c], left = Q(n * den - b.top, den);
        return word(`밀가루 ${n} kg 중에서 빵을 만드는 데 ${show(b)} kg, 과자를 만드는 데 ${show(c)} kg을 사용하였다. 남은 밀가루는 몇 kg인가?`, parts, 'kg', `빵을 만들고 남은 밀가루는 ${n} − ${show(b)} = ${show(left)}(kg)이다. 과자를 만들고 남은 밀가루는 ${show(left)} − ${show(c)} = ${result(parts)}(kg)이다.`);
      }),
      H('h-one-two-out', '문장제: 전체 1에서 두 번 덜어 내기', '심62, 기본 ①68', (d) => {
        const den = d.int(8, 21), [a, b] = two(d, 2, den - 4, (x, y) => x + y < den - 1 && x !== y);
        return wordRaw(`밭 전체의 ${frac(a, den)}에는 배추를 심고, 밭 전체의 ${frac(b, den)}에는 무를 심었다. 아무것도 심지 않은 부분은 밭 전체의 얼마인가?`, `${den}-${a}-${b}`, den - a - b, den, '', `밭 전체는 1이다. 1 − ${frac(a, den)} − ${frac(b, den)} = ${frac(den, den)} − ${frac(a, den)} − ${frac(b, den)} = ${frac(den - a - b, den)}`, { lead: '밭 전체의 ' });
      }),
      H('h-rest-compare', '문장제: 나머지를 구해 어느 쪽이 얼마나 더 많은지 견주기', '기본 ①69', (d) => {
        // 틀린 차: 나머지의 양을 그대로 답한 것(차를 구하지 않았다)
        const den = d.int(9, 17), [t, a] = two(d, 2, den - 1, (x, y) => x > y + 1 && x !== y * 2 && Math.abs(x - y * 2) <= 5), rest = t - a, gap = Math.abs(a - rest), winner = a > rest ? 0 : 1;
        const other = [rest, a, gap + 1].find((v) => v !== gap), options = d.shuffle([[winner, gap], [1 - winner, gap], [winner, other], [1 - winner, other]]), what = ['상자', '카드'];
        return C(`색 테이프 ${frac(t, den)} m 중에서 ${frac(a, den)} m는 상자를 꾸미는 데 사용하고, 나머지는 모두 카드를 꾸미는 데 사용하였다. 상자와 카드 중에서 어느 것을 꾸미는 데 색 테이프를 몇 m 더 많이 사용하였는가?`, options.map(([who, n]) => `${what[who]}, ${frac(n, den)} m`), options.findIndex(([who, n]) => who === winner && n === gap), {
          explain: `카드를 꾸미는 데 사용한 색 테이프는 ${frac(t, den)} − ${frac(a, den)} = ${frac(rest, den)}(m)이다. ${josa(what[winner], '을/를')} 꾸미는 데 ${frac(Math.max(a, rest), den)} − ${frac(Math.min(a, rest), den)} = ${frac(gap, den)}(m) 더 많이 사용하였다.`,
          facts: { who: { values: [a, rest], options, exprs: [String(a), `${t}-${a}`] } }
        });
      }),
      H('h-each-left', '문장제: 각자 남은 양을 구해 견주기', '심68, 기본 ②84', (d) => {
        // 틀린 차: 처음에 가지고 있던 양끼리의 차
        const [one, two2] = d.shuffle(NAMES).slice(0, 2), den = d.int(5, 10);
        const rows = d.until(() => [borrowPair(d, den, 6), borrowPair(d, den, 6)], ([p, q]) => {
          const x = p[0].top - p[1].top, y = q[0].top - q[1].top, start = Math.abs(p[0].top - q[0].top);
          return x !== y && Math.abs(x - y) < den && start !== 0 && start !== Math.abs(x - y) && (p[0].top > q[0].top) !== (x > y);
        });
        const left = rows.map(([p, q]) => p.top - q.top), gap = Math.abs(left[0] - left[1]), winner = left[0] > left[1] ? 0 : 1, other = Math.abs(rows[0][0].top - rows[1][0].top);
        const options = d.shuffle([[winner, gap], [1 - winner, gap], [winner, other], [1 - winner, other]]);
        return C(`${name(one, '은/는')} 색 테이프 ${show(rows[0][0])} m 중에서 ${show(rows[0][1])} m를 사용하였고, ${name(two2, '은/는')} 색 테이프 ${show(rows[1][0])} m 중에서 ${show(rows[1][1])} m를 사용하였다. 남은 색 테이프는 누가 몇 m 더 긴가?`, options.map(([who, n]) => `${[one, two2][who]}, ${show(Q(n, den))} m`), options.findIndex(([who, n]) => who === winner && n === gap), {
          explain: `${name(one, '은/는')} ${told([rows[0][0], '-', rows[0][1]])}(m), ${name(two2, '은/는')} ${told([rows[1][0], '-', rows[1][1]])}(m)가 남았다. ${name([one, two2][winner], '이/가')} ${show(Q(gap, den))} m 더 길다.`,
          facts: { who: { values: left, options, exprs: rows.map(([p, q]) => `${top(p)}-${top(q)}`) } }
        });
      }),
      H('h-join-then-out', '문장제: 합친 뒤 덜어 내기', '심66', (d) => {
        const den = d.int(5, 10);
        const [a, b, c] = d.until(() => { const [p, q] = carryPair(d, den, 4); return [p, q, MX(d.int(1, 3), d.int(1, den - 1), den)]; }, ([p, q, r]) => (p.top + q.top - r.top) % den !== 0 && (p.top + q.top) % den < R(r) && p.top + q.top - r.top > den);
        const parts = [a, '+', b, '-', c];
        return word(`큰 통에 물이 ${show(a)} L, 작은 통에 물이 ${show(b)} L 들어 있다. 두 통의 물을 한 통에 모은 다음 그중에서 ${show(c)} L를 꽃밭에 뿌렸다. 남은 물은 몇 L인가?`, parts, 'L', `두 통의 물을 모으면 ${told([a, '+', b])}(L)이다. 꽃밭에 뿌리고 남은 물은 ${result([a, '+', b])} − ${show(c)} = ${result(parts)}(L)이다.`);
      }),
      H('h-order', '문장제: 한 양을 구한 뒤 차례 정하기', '기본 ③82', (d) => {
        // 셋째 양은 첫째보다 조금 적어, 둘째 양과 견주려면 계산해 보아야 한다.
        const names = d.shuffle(['수박', '호박', '멜론', '배추', '양배추']).slice(0, 3), den = d.int(5, 10);
        const [a, b, c] = d.until(() => [MX(d.int(3, 6), d.int(1, den - 1), den), MX(d.int(2, 5), d.int(1, den - 1), den), Q(d.int(2, den - 1), den)], ([p, q, r]) => p.top > q.top && p.top - q.top < den * 2 && R(p) < r.top && p.top - r.top !== q.top && Math.abs(p.top - r.top - q.top) < den);
        const third = Q(a.top - c.top, den), pick = orderChoice(d, [a.top, b.top, third.top], names);
        return C(`${names[0]}의 무게는 ${show(a)} kg, ${names[1]}의 무게는 ${show(b)} kg이고, ${josa(names[2], '은/는')} ${names[0]}보다 ${show(c)} kg 더 가볍다. 무거운 것부터 차례대로 쓴 것은?`, pick.options, pick.answer, {
          explain: `${names[2]}의 무게는 ${show(a)} − ${show(c)} = ${show(third)}(kg)이다. 자연수 부분이 큰 수가 더 크고, 자연수 부분이 같으면 분자가 큰 수가 더 크다.`,
          facts: { choose: { exprs: [`${top(a)}/${den}`, `${top(b)}/${den}`, `(${top(a)}-${top(c)})/${den}`], rule: 'descending', orders: pick.list } }
        });
      }),
      H('h-tape-two', '문장제: 두 장을 겹쳐 이어 붙인 전체 길이', '심70, 기본 ①72 ②91 ③84', (d) => {
        const den = d.int(4, 10), [a, c] = d.until(() => [MX(d.int(2, 7), d.int(1, den - 1), den), Q(d.int(1, den - 1), den)], ([p, q]) => (p.top * 2 - q.top) % den !== 0 && (R(p) * 2) % den < q.top), parts = [a, '+', a, '-', c];
        return word(`길이가 ${show(a)} m인 색 테이프 2장을 ${show(c)} m만큼 겹치게 이어 붙였다. 이어 붙인 색 테이프의 전체 길이는 몇 m인가?`, parts, 'm', `두 장의 길이의 합은 ${told([a, '+', a])}(m)이다. 겹친 부분은 두 번 더해졌으므로 한 번 뺀다. ${result([a, '+', a])} − ${show(c)} = ${result(parts)}`, { figure: tapes('색 테이프', '색 테이프', '겹친 부분') });
      }),
      H('h-tape-overlap', '문장제: 겹친 부분의 길이', '심72·75, 기본 ②92', (d) => {
        const den = d.int(5, 12), [a, b] = carryPair(d, den, 5), cut = d.until(() => d.int(2, den - 1), (v) => (a.top + b.top - v) % den !== 0), whole = Q(a.top + b.top - cut, den);
        return wordRaw(`길이가 ${show(a)} m, ${show(b)} m인 색 테이프 2장을 겹치게 이어 붙였더니 전체 길이가 ${show(whole)} m가 되었다. 겹친 부분의 길이는 몇 m인가?`, `${top(a)}+${top(b)}-${top(whole)}`, cut, den, 'm', `두 장의 길이의 합은 ${told([a, '+', b])}(m)이다. 이어 붙인 길이가 그보다 짧아진 만큼이 겹친 부분이다. ${result([a, '+', b])} − ${show(whole)} = ${frac(cut, den)}`, { figure: tapes('색 테이프', '색 테이프', '겹친 부분') });
      }),
      H('h-route-seg', '문장제: 한 줄로 이어진 길에서 가운데 구간 구하기', '심74, 기본 ①76 ②85', (d) => {
        const den = d.int(5, 12);
        const [a, b] = d.until(() => [Q(d.int(1, den - 1), den), MX(1, d.int(1, den - 1), den)], ([p, q]) => (p.top + q.top) % den !== 0);
        const n = Math.ceil((a.top + b.top) / den) + d.int(1, 2), parts = [Q(n * den, den), '-', a, '-', b], left = Q(n * den - a.top, den);
        return word(`기차역에서 시장과 병원을 차례로 지나 공원까지 가는 거리는 ${n} km이다. 기차역에서 시장까지의 거리는 ${show(a)} km이고, 병원에서 공원까지의 거리는 ${show(b)} km이다. 시장에서 병원까지의 거리는 몇 km인가?`, parts, 'km', `전체 거리에서 양 끝의 두 구간을 뺀다. ${n} − ${show(a)} = ${show(left)}, ${show(left)} − ${show(b)} = ${result(parts)}`, { figure: route([['기차역', 0, 50], ['시장', 34, 50], ['병원', 68, 50], ['공원', 100, 50]], [[0, 1], [1, 2], [2, 3]], 40) });
      }),
      H('h-two-routes', '문장제: 두 길의 거리를 구해 견주기', '심73', (d) => {
        // 틀린 차: 집에서 가는 첫 구간끼리의 차
        const den = d.int(5, 12), places = ['서점', '공원'];
        const rows = d.until(() => [[MX(1, d.int(1, den - 1), den), MX(d.int(1, 2), d.int(1, den - 1), den)], [Q(d.int(2, den - 1), den), MX(d.int(2, 3), d.int(1, den - 1), den)]], ([p, q]) => {
          const x = p[0].top + p[1].top, y = q[0].top + q[1].top, first = Math.abs(p[0].top - q[0].top);
          return x !== y && Math.abs(x - y) < den && first !== Math.abs(x - y) && R(p[0]) + R(p[1]) > den;
        });
        const sums = rows.map(([p, q]) => p.top + q.top), gap = Math.abs(sums[0] - sums[1]), winner = sums[0] < sums[1] ? 0 : 1, other = Math.abs(rows[0][0].top - rows[1][0].top);
        const options = d.shuffle([[winner, gap], [1 - winner, gap], [winner, other], [1 - winner, other]]);
        return C(`집에서 학교까지 가는 길은 두 가지이다. 서점을 지나는 길은 집에서 서점까지 ${show(rows[0][0])} km, 서점에서 학교까지 ${show(rows[0][1])} km이다. 공원을 지나는 길은 집에서 공원까지 ${show(rows[1][0])} km, 공원에서 학교까지 ${show(rows[1][1])} km이다. 어느 곳을 지나는 길이 몇 km 더 가까운가?`, options.map(([who, n]) => `${places[who]}, ${show(Q(n, den))} km`), options.findIndex(([who, n]) => who === winner && n === gap), {
          figure: route([['집', 0, 50], ['서점', 50, 0, false], ['공원', 50, 100], ['학교', 100, 50]], [[0, 1], [1, 3], [0, 2], [2, 3]], 76),
          explain: `서점을 지나는 길은 ${told([rows[0][0], '+', rows[0][1]])}(km), 공원을 지나는 길은 ${told([rows[1][0], '+', rows[1][1]])}(km)이다. ${josa(places[winner], '을/를')} 지나는 길이 ${show(Q(gap, den))} km 더 가깝다.`,
          facts: { who: { values: sums, options, exprs: rows.map(([p, q]) => `${top(p)}+${top(q)}`), smaller: true } }
        });
      }),
      H('h-split-sum', '문장제: 기준보다 가벼운 것을 골라 합 구하기', '기본 ②52', (d) => {
        // 기준보다 가벼운 것은 대분수 하나와 가분수 하나이다. 가분수는 대분수로 고쳐 보아야 기준과 견줄 수 있다.
        const den = d.int(5, 9), k = d.int(3, 5);
        const [low1, low2, up1, up2] = d.until(() => [MX(k - 1, d.int(1, den - 1), den), Q((k - d.int(1, 2)) * den + d.int(1, den - 1), den, true), MX(k + d.int(0, 2), d.int(1, den - 1), den), Q((k + d.int(0, 1)) * den + d.int(1, den - 1), den, true)], (qs) => new Set(qs.map((q) => q.top)).size === 4 && (qs[0].top + qs[1].top) % den !== 0);
        const list = d.shuffle([low1, low2, up1, up2]), parts = [low1, '+', low2];
        return word(`호박 네 개의 무게가 다음과 같다. 무게가 ${k} kg보다 가벼운 호박의 무게의 합은 몇 kg인가?`, parts, 'kg', `가분수를 대분수로 나타내면 ${show(low2)} = ${show(Q(low2.top, den))}, ${show(up2)} = ${show(Q(up2.top, den))}이다. ${k} kg보다 가벼운 것은 ${show(low1)} kg, ${show(low2)} kg이다. ${show(low1)} + ${show(Q(low2.top, den))} = ${result(parts)}`, { figure: numbers(list.map((q) => show(q) + ' kg')) });
      }),
      H('h-grow', '문장제: 날마다 같은 길이만큼 자랄 때 다음 날의 길이', '기본 ②93', (d) => {
        const den = d.int(5, 9), [h, g] = d.until(() => [MX(d.int(1, 4), d.int(1, den - 1), den), d.int(2, den - 1)], ([p, k]) => [1, 2, 3].every((i) => (p.top + k * i) % den !== 0));
        const days = [0, 1, 2, 3].map((i) => Q(h.top + g * i, den));
        return wordRaw('나팔꽃 줄기의 길이를 날마다 재어 나타낸 표이다. 줄기가 날마다 같은 길이만큼 자랄 때, 4일의 줄기의 길이는 몇 cm인가?', `${top(days[2])}+(${top(days[1])}-${top(days[0])})`, days[3].top, den, 'cm', `하루에 ${show(days[1])} − ${show(days[0])} = ${frac(g, den)}(cm)씩 자란다. 4일의 줄기의 길이는 ${show(days[2])} + ${frac(g, den)} = ${show(days[3])}(cm)이다.`, { figure: table(['날짜', '길이'], days.slice(0, 3).map((q, i) => [`${i + 1}일`, show(q) + ' cm'])) });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
