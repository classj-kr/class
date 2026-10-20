// 6학년 1학기 1단원 분수의 나눗셈 — 잘못된 계산, 몫의 크기 비교와 조건에 맞는 수, 문장제, 도형, 실력 문항.
// 단원 틀과 싣는 기준, 뺀 것과 까닭은 6-1-1a.js 에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2, ③n = 기본꼴_3, 심n = 심화꼴.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 ①의 장치는 이 잘못을 가진 아이가 걸리게 만들었다)
//  - (자연수)÷(자연수)에서 언제나 큰 수를 작은 수로 나누거나, 글에 먼저 나온 수를 나중에 나온 수로 나눈다. 「3 L를 5명이」는 3 ÷ 5 인데 5 ÷ 3 으로 쓰고,
//    「㉠은 ㉡의 몇 배」에서 무엇을 무엇으로 나누는지를 가리지 못한다. 몫을 분수로 쓸 때 분자와 분모를 바꾸어 쓴다.
//  - 나누는 수를 글에서 찾지 못한다: 「친구 4명과 함께」(5명), 「일주일 동안」(7), 가짓수, 정삼각형과 정사각형의 변의 수. 거꾸로 쓰지 않는 수(변의 수)로 한 번 더 나눈다.
//  - (분수)÷(자연수)에서 분자가 아니라 분모를 나누거나 분모와 분자를 모두 나눈다(크기가 그대로이다). ÷ (자연수)를 × (자연수)로 바꾸거나 나누어지는 수를 뒤집어 곱한다.
//  - 대분수를 가분수로 고치지 않고 분수 부분만 나누거나(1 4/7 ÷ 2 = 1 2/7) 자연수 부분만 나눈다.
//  - 가분수는 분수라서 자연수보다 작다고 여겨, 나누어지는 수와 나누는 수의 크기로 몫이 1보다 큰지를 가리지 못한다. 나누어지는 수와 나누는 수가 같을 때(몫이 1)를 「1보다 크다」에 넣는다.
//  - 「전체의 얼마를 똑같이 나눈 것 가운데 하나」가 전체의 얼마인지를, 크기가 다른 칸을 그냥 세어서 답한다.
//  - 「3/4 m를 똑같이 3도막으로 나눈 것 중의 한 도막」(÷)과 「3 m의 3/4」(×)을 같은 것으로 읽는다. 전체가 큰 쪽의 한 몫이 언제나 크다고 여긴다.
//
// 실력에는 ① 문제의 상황·그림·수에 함정이 있어 뜻을 정확히 대야 풀리는 문제와 ② 두 번 넘게 생각해야 풀리는 문제(어떤 수를 거꾸로 구해 바르게 계산하기, 양쪽이 식인 등식의 □,
// 두 몫 사이의 □, 계산 원리로 수 카드의 자리 정하기, 더하거나 덜어 낸 뒤·모은 뒤 나누기, 나눈 뒤 다시 나누거나 몇 몫을 모으기, 같은 철사로 만든 다른 도형, 눈금 한 칸)만 실었다.
// 기본에서 하는 나눗셈 한 번을 고르기로 바꾼 것은 싣지 않았다.
// 문장제는 얼개마다 한 번씩 싣는다: 똑같이 나누기((자연수)÷(자연수)의 몫이 1보다 작다·크다·기약분수, 진분수, 가분수, 대분수), 하나의 양(무게가 같은 물건 한 개, 1분 동안 간 거리), 몇 배(자연수·대분수),
//   재료 표, 구하는 식 / (실력) 숨은 나누는 수 넷, 표에서 골라 몇 배, 「나눈 것 중의 하나」와 「~의」, 전체가 다른 두 몫, 한 개의 둘레, 잘못 계산한 어떤 수 넷, 합친 뒤·덜어 낸 뒤·빈 상자,
//   모은 뒤 나누기, 나눈 것 가운데 몇 몫, 나눈 한 몫을 다시 나누기, 몇 분의 몇을 잘라 나누기, 같은 철사로 만든 도형 둘.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, nick, box, frac, mixed, lines, numbers, cards, table, N, C, F } = B.kit;
  const STD_NN = '6수01-10', STD = '6수01-11';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
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
  const tagged = (list) => lines(list.map((html, i) => tag(LAB[i]) + html));
  const versus = (left, right) => `<div class="mb-versus">${left}<span class="mb-ring"></span>${right}</div>`;

  // ── 수 하나(6-1-1a.js 와 같다) ──
  const V = (w, n, d) => ({ w, n, d: n ? d : 1 });
  const nat = (w) => V(w, 0, 1);
  const show = (v) => (v.n === 0 ? String(v.w) : v.w ? mixed(v.w, v.n, v.d) : frac(v.n, v.d));
  const vj = (v, pair) => show(v) + tail(v.n === 0 ? v.w : v.n, pair);
  const fj = (n, den, pair) => frac(n, den) + tail(n, pair);
  const top = (v) => v.w * v.d + v.n;
  const R = (p, q) => { const g = gcd(Math.abs(p), q) || 1; return { p: p / g, q: q / g }; };
  const val = (v) => R(top(v), v.d);
  const cmp = (x, y) => x.p * y.q - y.p * x.q;
  const toV = (r) => (r.q === 1 ? nat(r.p) : V(Math.floor(r.p / r.q), r.p % r.q, r.q));
  const key = (v) => v.w + ' ' + v.n + '/' + v.d;
  const quo = (v, c) => R(top(v), v.d * c);
  const res = (v, c) => show(toV(quo(v, c)));
  const rs = (r) => show(toV(r));
  const div = (v, c) => eq(show(v), '/', c);
  const sgn = (x, y) => (cmp(x, y) > 0 ? 0 : cmp(x, y) === 0 ? 1 : 2);
  const distinct = (vals) => vals.every((p, i) => vals.every((s, j) => i === j || cmp(p, s) !== 0));
  // 나눗셈 여럿이 서로 다른 식인가(나누어지는 수와 나누는 수가 모두 같은 식이 없다)
  const apart = (rows) => new Set(rows.map(([v, c]) => key(v) + '÷' + c)).size === rows.length;
  const best = (vals, big) => vals.reduce((at, v, i) => ((big ? cmp(v, vals[at]) > 0 : cmp(v, vals[at]) < 0) ? i : at), 0);

  // ── 검사가 다시 셈하는 식(6-1-1a.js 와 같다) ──
  const imp = (v) => (v.n === 0 ? String(v.w) : v.w ? `(${v.w}*${v.d}+${v.n})` : String(v.n));
  const q = (v) => ({ num: imp(v), dens: v.n ? [v.d] : [], P: top(v), D: v.d });
  const qdiv = (x, c) => ({ num: x.num, dens: x.dens.concat([c]), P: x.P, D: x.D * c });
  const qtimes = (x, k) => ({ num: x.num + '*' + k, dens: x.dens, P: x.P * k, D: x.D });
  // 두 식의 합(s: '+')·차(s: '-'): 분모들의 곱으로 통분한 분자
  const qadd = (x, y, s) => ({ num: '(' + [x.num].concat(y.dens).join('*') + s + [y.num].concat(x.dens).join('*') + ')', dens: x.dens.concat(y.dens), P: x.P * y.D + (s === '+' ? 1 : -1) * y.P * x.D, D: x.D * y.D });
  const qd = (v, c) => qdiv(q(v), c);
  function proofQ(x, more) {
    const r = R(x.P, x.D), g = x.D / r.q, den = x.dens.join('*'), m = more || {};
    const list = r.q === 1 ? [[den ? `${x.num}/(${den})` : x.num, 0]]
      : r.p > r.q ? [[`(${x.num}-${x.num}%(${den}))/(${den})`, 0], [`${x.num}%(${den})/${g}`, 1], [`${den}/${g}`, 2]]
        : [[`${x.num}/${g}`, 0], [`${den}/${g}`, 1]];
    return Object.assign({}, m, { calc: list, unseen: (r.q === 1 ? [] : [g]).concat(m.unseen || []) });
  }
  // 식의 값을 답하는 문항. 값이 자연수이면 수 하나(o.kind: 'nat'), 아니면 분수 칸에 답한다. o.exact 가 아니면 크기가 같은 분수를 모두 받는다.
  function ansQ(text, x, o) {
    const r = R(x.P, x.D);
    if (r.p <= 0 || (r.q === 1) !== (o.kind === 'nat')) throw new Error('답의 꼴이 유형과 다르다');
    const facts = proofQ(x, o.facts);
    if (r.q === 1) return N(text, r.p, { unit: o.unit, figure: o.figure, explain: o.explain, facts });
    return F(text, r.p % r.q, r.q, { whole: r.p > r.q ? Math.floor(r.p / r.q) : undefined, anyForm: !o.exact, unit: o.unit, figure: o.figure, explain: o.explain, facts });
  }
  const divQ = (text, v, c, o) => ansQ(text, qd(v, c), o);
  const whole = (x) => x.P % x.D === 0;
  const scaled = (xs) => xs.map((x, i) => xs.filter((_, j) => j !== i).reduce((list, y) => list.concat(y.dens), [x.num]).join('*'));
  // 한 번의 나눗셈으로 적은 식(검사가 값을 견줄 때 쓴다)
  const one = (x) => (x.dens.length ? `${x.num}/(${x.dens.join('*')})` : x.num);

  // ── 풀이 글 ──
  function told(v, c) {
    const t = top(v), r = quo(v, c), out = [`${show(v)} ÷ ${c}`];
    if (v.n === 0) out.push(frac(t, c));
    else {
      if (v.w) out.push(`${frac(t, v.d)} ÷ ${c}`);
      if (t % c === 0) out.push(frac(`${t} ÷ ${c}`, v.d));
      else { out.push(`${frac(t, v.d)} × ${frac(1, c)}`); out.push(frac(t, v.d * c)); }
    }
    out.push(r.q === 1 ? String(r.p) : frac(r.p, r.q));
    if (r.q !== 1 && r.p > r.q) out.push(show(toV(r)));
    return out.filter((s, i) => i === 0 || s !== out[i - 1]).join(' = ');
  }

  // ── 수 고르기(6-1-1a.js 와 같다) ──
  const coTop = (d, den, lo) => d.until(() => d.int(lo || 1, den - 1), (v) => gcd(v, den) === 1);
  function nnPick(d, kind) {
    const small = kind.startsWith('proper'), cut = kind.endsWith('Reduce');
    return d.until(() => (small ? [d.int(2, 14), d.int(3, 19)] : [d.int(3, 40), d.int(2, 9)]), ([a, b]) => (small ? a < b : a > b && a % b !== 0 && a < 6 * b) && (gcd(a, b) > 1) === cut);
  }
  const PF = {
    top: (a, b, c) => a % c === 0,
    plain: (a, b, c) => a >= 2 && gcd(a, c) === 1,
    reduce: (a, b, c) => gcd(a, c) > 1 && a % c !== 0,
    unit: (a) => a === 1
  };
  function pfPick(d, kind, bMax, cMax) {
    const [a, b, c] = d.until(() => { const b = d.int(3, bMax || (kind === 'top' ? 20 : 15)); return [kind === 'unit' ? 1 : coTop(d, b, 2), b, d.int(2, cMax || 9)]; }, ([x, y, z]) => PF[kind](x, y, z) && y * z / gcd(x, z) <= 120);
    return [V(0, a, b), c];
  }
  const IF = {
    top: (a, b, c) => a % c === 0 && a < b * c,
    plain: (a, b, c) => gcd(a, c) === 1 && a < b * c,
    reduce: (a, b, c) => gcd(a, c) > 1 && a % c !== 0 && a < b * c,
    over: (a, b, c) => a > b * c && a % (b * c) !== 0
  };
  function ifPick(d, kind, bMax) {
    const [a, b, c] = d.until(() => { const b = d.int(2, bMax || 11); return [d.int(b + 1, kind === 'over' ? 45 : 3 * b), b, d.int(2, kind === 'over' ? 5 : 9)]; }, ([x, y, z]) => gcd(x, y) === 1 && IF[kind](x, y, z) && y * z / gcd(x, z) <= 100 && x <= 45);
    return [V(0, a, b), c];
  }
  const MX = {
    top: (t, b, c) => t % c === 0 && t < b * c,
    plain: (t, b, c) => gcd(t, c) === 1 && t < b * c,
    reduce: (t, b, c) => gcd(t, c) > 1 && t % c !== 0 && t < b * c,
    over: (t, b, c) => t > b * c && t % (b * c) !== 0
  };
  function mxPick(d, kind, wMax, bMax, cMax) {
    const [w, a, b, c] = d.until(() => { const b = d.int(2, bMax || 9); return [d.int(1, wMax || (kind === 'over' ? 9 : 5)), coTop(d, b), b, d.int(2, cMax || (kind === 'over' ? 6 : 9))]; }, ([w, x, y, z]) => MX[kind](w * y + x, y, z) && y * z / gcd(w * y + x, z) <= 100 && w * y + x <= 60);
    return [V(w, a, b), c];
  }
  // 나누는 수 c 가 정해졌을 때 나누어지는 분수(대분수나 진분수): 몫의 분모가 limit 을 넘지 않는다.
  function forC(d, c, kind, limit) {
    return d.until(() => { const b = d.int(2, 9); return kind === 'mixed' || (kind !== 'proper' && d.bool()) ? V(d.int(1, 6), coTop(d, b), b) : V(0, coTop(d, b + 1, 2), b + 1); }, (v) => quo(v, c).q <= (limit || 72) && quo(v, c).q > 1 && top(v) <= 60);
  }
  // 몫이 r 인 (진분수·가분수)÷(자연수)를 모두 찾는다.
  function formsOf(r) {
    const out = [];
    for (let c = 2; c <= 9; c += 1) { const v = R(r.p * c, r.q); if (v.q > 1 && v.q <= 20 && v.p <= 40) out.push([V(0, v.p, v.q), c]); }
    return out;
  }
  const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  function orderChoice(d, vals, names, desc) {
    const right = [0, 1, 2].sort((p, s) => (desc ? cmp(vals[s], vals[p]) : cmp(vals[p], vals[s]))), id = (o) => o.join();
    const list = d.shuffle(d.shuffle(ORDERS.filter((o) => id(o) !== id(right))).slice(0, 3).concat([right]));
    return { list, right, options: list.map((o) => o.map((i) => names[i]).join(', ')), answer: list.findIndex((o) => id(o) === id(right)) };
  }

  // ── 그림 ──
  const svg = (cls, w, h, label, body) => `<svg class="${cls}" style="vertical-align:middle" viewBox="0 0 ${w} ${h}" width="${Math.round(w)}" role="img" aria-label="${label}">${body}</svg>`;
  const INK = '#1f2933', LIGHT = '#dbeafe', DARK = '#3b82f6';
  // 직사각형을 세로 선으로 똑같이 cols 칸으로 나누어 왼쪽 on 칸을 옅게 칠하고, 칠한 부분만 가로 선으로 똑같이 rows 줄로 나누어 그 가운데 한 줄(at)을 진하게 칠한 그림.
  // 칠하지 않은 칸은 가로로 나누지 않는다(칸의 크기가 서로 달라 칸 수만 세어서는 답할 수 없다).
  function partRect(cols, on, rows, at) {
    const W = 210, HH = 100, cw = W / cols, rh = HH / rows; let out = `<rect x="2" y="2" width="${on * cw}" height="${HH}" style="fill:${LIGHT}"/><rect x="2" y="${(2 + at * rh).toFixed(2)}" width="${on * cw}" height="${rh.toFixed(2)}" style="fill:${DARK}"/>`;
    for (let i = 1; i < cols; i += 1) out += `<line x1="${2 + i * cw}" y1="2" x2="${2 + i * cw}" y2="${2 + HH}" style="stroke:${INK};stroke-width:1"/>`;
    for (let j = 1; j < rows; j += 1) out += `<line x1="2" y1="${(2 + j * rh).toFixed(2)}" x2="${2 + on * cw}" y2="${(2 + j * rh).toFixed(2)}" style="stroke:${INK};stroke-width:1"/>`;
    out += `<rect x="2" y="2" width="${W}" height="${HH}" style="fill:none;stroke:${INK};stroke-width:1.4"/>`;
    return svg('mb-pieces', W + 4, HH + 4, `직사각형을 세로 선으로 똑같이 ${cols}칸으로 나누어 왼쪽 ${on}칸을 색칠하였다. 색칠한 부분만 가로 선으로 똑같이 ${rows}줄로 나누어 그 가운데 한 줄을 진하게 색칠하였다`, out);
  }
  // 직사각형을 가로 cols 칸, 세로 rows 줄로 똑같이 나누어 cells(칸 번호)를 색칠한 그림
  function cellGrid(cols, rows, cells) {
    const cw = Math.min(40, 200 / cols), rh = 30; let out = '';
    for (let i = 0; i < cols * rows; i += 1) out += `<rect class="mb-piece${cells.includes(i) ? ' is-on' : ''}" x="${2 + (i % cols) * cw}" y="${2 + Math.floor(i / cols) * rh}" width="${cw}" height="${rh}"/>`;
    return svg('mb-pieces', cols * cw + 4, rows * rh + 4, `직사각형을 똑같이 ${cols * rows}칸으로 나누어 그 가운데 ${cells.length}칸을 색칠`, out);
  }
  // 두 자연수 left, right 사이를 똑같이 parts 칸으로 나눈 수직선. left 에서 한 칸 간 눈금에 ㉠을 적는다.
  function gapLine(left, right, parts) {
    const u = Math.min(40, 216 / parts), x = (i) => Number((22 + i * u).toFixed(1)), y = 40, width = Number((44 + parts * u).toFixed(1));
    let out = `<line class="mb-axis" x1="${x(0) - 12}" y1="${y}" x2="${x(parts) + 12}" y2="${y}"/>`;
    for (let i = 0; i <= parts; i += 1) { const big = i === 0 || i === parts; out += `<line class="mb-axis" x1="${x(i)}" y1="${y - (big ? 7 : 4)}" x2="${x(i)}" y2="${y + (big ? 7 : 4)}"/>`; }
    out += `<text class="mb-km-label" style="font-size:13px" x="${x(0)}" y="${y + 22}" text-anchor="middle">${left}</text><text class="mb-km-label" style="font-size:13px" x="${x(parts)}" y="${y + 22}" text-anchor="middle">${right}</text>`;
    out += `<path class="mb-pointer" d="M${x(1)} ${y - 8}l-4.5 -9h9z"/><text class="mb-km-label" style="font-size:14px" x="${x(1)}" y="${y - 22}" text-anchor="middle">㉠</text>`;
    return svg('mb-numberline', width, 68, `수직선: ${josa(left, '과/와')} ${right} 사이를 똑같이 ${parts}칸으로 나누었다. ㉠은 ${left}에서 오른쪽으로 작은 눈금 한 칸을 간 곳`, out);
  }
  const who3 = (list, i) => `<span class="mb-tag" style="min-width:3em">${list[i]}</span>`;

  // ── 잘못된 계산 살펴보기 ──
  B.addTypes('6-1-1', 'check', [
    T('check-why', '잘못 계산한 까닭 고르기', '①42·44 ②36·41 ③49 심19·20', (d, n) => {
      // 문항마다 잘못이 다르다: 분모를 자연수로 나눔, 자연수를 그대로 곱함, 나누어지는 수의 분모와 분자를 바꿈, 대분수의 분수 부분만 나눔.
      const WHY = [['분자가 아니라 분모를 자연수로 나누었다.', 0], ['나누는 자연수를 그대로 곱하였다.', 1], ['나누어지는 분수의 분모와 분자를 바꾸어 곱하였다.', 2], ['대분수를 가분수로 나타내지 않고 분수 부분만 나누었다.', 3]];
      let figure, v, c, why;
      if (n === 0) {
        const [a, b, k] = d.until(() => { const k = d.int(2, 5), b = k * d.int(2, 5); return [coTop(d, b), b, k]; }, ([x, y, z]) => x % z !== 0 && y <= 20 && x >= 2);
        v = V(0, a, b); c = k; figure = lines([eq(show(v), '/', c, '=', frac(a, `${b} ÷ ${c}`), '=', frac(a, b / c))]);
        why = `분모를 나누면 몫이 처음 수보다 커진다. 분자를 나눌 수 없으면 ${fj(1, c, '을/를')} 곱한다.`;
      } else if (n === 1) {
        [v, c] = d.bool() ? pfPick(d, 'plain', 11, 6) : ifPick(d, 'plain', 7); figure = lines([eq(show(v), '/', c, '=', show(v), '*', c), eq('=', frac(v.n * c, v.d))]);
        why = `÷ ${josa(c, '은/는')} × ${frac(1, c)}${tail(1, '으로/로')} 바꾸어야 한다.`;
      } else if (n === 2) {
        [v, c] = d.until(() => pfPick(d, 'plain', 9, 6), ([x]) => x.n >= 2); figure = lines([eq(show(v), '/', c, '=', frac(v.d, v.n), '*', frac(1, c)), eq('=', frac(v.d, v.n * c))]);
        why = `나누어지는 수 ${vj(v, '은/는')} 그대로 두어야 한다.`;
      } else {
        const [w, a, b, k] = d.until(() => { const k = d.int(2, 4), a = k * d.int(1, 3); return [d.int(1, 7), a, d.int(a + 1, 11), k]; }, ([x, y, z, m]) => gcd(y, z) === 1 && x % m !== 0 && x * z + y <= 60);
        v = V(w, a, b); c = k; figure = lines([eq(show(v), '/', c, '=', mixed(w, `${a} ÷ ${c}`, b), '=', mixed(w, a / c, b))]);
        why = '대분수는 가분수로 나타낸 다음 나누어야 한다.';
      }
      const rows = d.shuffle(WHY);
      return C('다음은 잘못 계산한 것이다. 잘못 계산한 까닭을 바르게 말한 것은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1] === n), {
        figure, explain: `${why} 바르게 계산하면 ${told(v, c)}이다.`, facts: { truth: rows.map((row) => row[1] === n), want: true }
      });
    }, { count: 4 }),
    T('check-value', '잘못된 계산을 바르게 고치기', '①44 ②36·41 ③49 심19·20', (d, n) => {
      // 문항마다 잘못이 다르다: 가분수를 뒤집어 자연수를 곱함, 대분수를 가분수로 고친 뒤 자연수를 그대로 곱함, 대분수의 분수 부분에만 1/(자연수)을 곱함.
      const TEXT = '다음은 잘못 계산한 것이다. 바르게 계산한 값은?';
      if (n === 0) {
        const [v, c] = ifPick(d, 'plain', 7), a = v.n, b = v.d;
        return divQ(TEXT, v, c, { figure: lines([eq(show(v), '/', c, '=', frac(b, a), '*', c), eq('=', frac(b * c, a))]), explain: `나누어지는 수는 그대로 두고 ÷ ${josa(c, '을/를')} × ${frac(1, c)}${tail(1, '으로/로')} 바꾼다. ${told(v, c)}이다.` });
      }
      if (n === 1) {
        const [v, c] = d.until(() => mxPick(d, d.bool() ? 'top' : 'plain', 4, 9, 6), ([x, y]) => top(x) * y <= 120), t = top(v), b = v.d;
        return divQ(TEXT, v, c, { figure: lines([eq(show(v), '/', c, '=', frac(t, b), '*', c), eq('=', frac(t * c, b), '=', rs(R(t * c, b)))]), explain: `÷ ${josa(c, '은/는')} × ${frac(1, c)}${tail(1, '으로/로')} 바꾸어야 한다. ${told(v, c)}이다.` });
      }
      const [v, c] = d.until(() => mxPick(d, d.pick(['plain', 'reduce', 'over']), 6, 7, 6), ([x, y]) => gcd(x.n, y) === 1), w = v.w, a = v.n, b = v.d;
      return divQ(TEXT, v, c, { figure: lines([eq(show(v), '/', c, '=', show(v), '*', frac(1, c)), eq('=', mixed(w, a, `${b} × ${c}`), '=', mixed(w, a, b * c))]), explain: `대분수를 가분수로 나타낸 다음 ${fj(1, c, '을/를')} 곱해야 자연수 부분도 나누어진다. ${told(v, c)}이다.` });
    }, { count: 3 }),
    T('check-wrong-pick', '계산이 잘못된 것 고르기', '①43 ②35 ③50 심18', (d, n) => {
      // 네 식 가운데 하나만 틀리다. 틀린 값은 그 계산에서 흔한 잘못으로 구한 값이다.
      //  첫째 문항(진분수·가분수): 분자를 나누고 분모에도 곱함, 자연수를 그대로 곱함, 분자만 약분하고 분모에는 곱하지 않음. 둘째 문항(대분수): 분수 부분만 나눔.
      const made = n === 0
        ? d.until(() => {
          const rows = [pfPick(d, 'top'), pfPick(d, 'plain', 9, 6), ifPick(d, 'reduce'), pfPick(d, 'reduce')];
          return { rows, wrong: rows.map(([v, c], i) => (i === 0 ? R(v.n / c, v.d * c) : i === 1 ? R(v.n * c, v.d) : R(v.n / gcd(v.n, c), v.d))) };
        }, (m) => apart(m.rows) && m.rows[0][0].n / m.rows[0][1] >= 1)
        : d.until(() => {
          const rows = [mxPick(d, 'top'), mxPick(d, 'plain', 4, 7, 7), mxPick(d, 'reduce', 5, 9, 8), mxPick(d, 'plain', 4, 7, 7)];
          return { rows, wrong: rows.map(([v, c]) => R(v.w * v.d * c + v.n, v.d * c)) };
        }, (m) => apart(m.rows));
      const order = d.shuffle([0, 1, 2, 3]), rows = order.map((i) => made.rows[i]), bad = d.int(0, 3), saids = rows.map(([v, c], i) => (i === bad ? made.wrong[order[i]] : quo(v, c)));
      return C('계산이 잘못된 것은?', rows.map(([v, c], i) => eq(show(v), '/', c, '=', rs(saids[i]))), bad, {
        explain: `바르게 계산하면 ${told(rows[bad][0], rows[bad][1])}이다. 나머지는 바르게 계산하였다.`,
        facts: { claimed: rows.map(([v, c], i) => { const x = qd(v, c); return [`${x.num}*${saids[i].q}`, saids[i].p * x.D]; }), claimedWant: false, rule: ['wrongFn', 'wrongMx'][n] }
      });
    }, { count: 2 }),
    T('check-who', '잘못 계산한 사람 찾기', '①42 ②17 ③50 심18', (d, n) => {
      const who = d.shuffle(NAMES).slice(0, 3);
      if (n === 0) {
        // (자연수)÷(자연수)를 분수의 곱셈으로 나타내었다. 틀린 사람은 나누어지는 수를 뒤집어 곱하였다.
        const rows = d.until(() => d.shuffle([nnPick(d, 'over'), nnPick(d, 'over'), nnPick(d, 'proper')]), (list) => new Set(list.map((r) => r.join())).size === 3 && list.every(([a]) => a <= 25)), bad = d.int(0, 2);
        const saids = rows.map(([a, b], i) => (i === bad ? R(b, a) : R(a, b)));
        return C('잘못 계산한 사람은?', who, bad, {
          figure: lines(rows.map(([a, b], i) => who3(who, i) + (i === bad ? eq(a, '/', b, '=', frac(1, a), '*', b, '=', rs(saids[i])) : eq(a, '/', b, '=', a, '*', frac(1, b), '=', rs(saids[i]))))),
          explain: `나누어지는 수는 그대로 두고 나누는 수만 분수로 바꾸어 곱한다. ${rows[bad][0]} ÷ ${rows[bad][1]} = ${rows[bad][0]} × ${frac(1, rows[bad][1])} = ${rs(R(rows[bad][0], rows[bad][1]))}이다.`,
          facts: { claimed: rows.map(([a, b], i) => [`${a}*${saids[i].q}`, saids[i].p * b]), claimedWant: false }
        });
      }
      // 같은 나눗셈을 세 사람이 다른 방법으로 계산하였다. 틀린 사람은 분모를 자연수로 나누었다.
      const [a, b, c] = d.until(() => { const c = d.int(2, 4), b = c * d.int(2, 4); return [coTop(d, b), b, c]; }, ([x, y, z]) => gcd(x, z) === 1 && x >= 2 && y * z <= 48), v = V(0, a, b), order = d.shuffle([0, 1, 2]), bad = order.indexOf(2);
      const way = [eq(show(v), '/', c, '=', frac(a * c, b * c), '/', c, '=', frac(a, b * c)), eq(show(v), '/', c, '=', show(v), '*', frac(1, c), '=', frac(a, b * c)), eq(show(v), '/', c, '=', frac(a, `${b} ÷ ${c}`), '=', frac(a, b / c))];
      return C('잘못 계산한 사람은?', who, bad, {
        figure: lines(order.map((k, i) => who3(who, i) + way[k])),
        explain: `(분수)÷(자연수)는 분자를 자연수로 나누거나 ${fj(1, c, '을/를')} 곱하여 계산한다. 분모를 ${josa(c, '으로/로')} 나누면 안 된다. ${told(v, c)}이다.`,
        facts: { claimed: order.map((k) => (k === 2 ? [`${a}*${b / c}`, a * b * c] : [`${a}*${b * c}`, a * b * c])), claimedWant: false, rule: 'whoFn' }
      });
    }, { count: 2 })
  ]);

  // ── 몫의 크기 비교와 조건에 맞는 수 ──
  B.addTypes('6-1-1', 'comp', [
    T('comp-sign', '두 몫의 크기 비교', '①45 ②43 ③51 심21', (d, n) => {
      // 문항마다 견주는 길이 다르다: 진분수·가분수의 몫을 구하면 분자가 같다(네 번에 한 번은 몫이 같다), 대분수의 몫을 구하면 분모나 분자가 같거나 한쪽만 1보다 크다,
      //  한쪽이 분수이다. (나누는 수가 같아 계산하지 않고 견주는 것은 comp-no-calc 에 있다.)
      if (n === 2) {
        const m = d.until(() => { const [v, c] = d.bool() ? pfPick(d, d.pick(['top', 'reduce']), 15, 8) : mxPick(d, d.pick(['top', 'reduce']), 4, 9, 8), r = quo(v, c), same = d.int(0, 2) === 0; return { v, c, r, f: same ? r : R(r.p, r.q + d.pick([-3, -2, -1, 1, 2, 3])) }; }, (x) => x.f.q > x.f.p && x.r.q > x.r.p && (cmp(x.f, x.r) === 0 || x.f.p === x.r.p));
        const fv = V(0, m.f.p, m.f.q), sign = sgn(m.r, m.f);
        return C('나눗셈의 몫과 분수의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, sign, {
          figure: versus(div(m.v, m.c), ex(show(fv))),
          explain: `${told(m.v, m.c)}이다. ` + (sign === 1 ? '몫과 분수의 크기는 같다.' : `분자가 같은 분수는 분모가 작을수록 크므로 ${rs(m.r)} ${SIGNS[sign]} ${show(fv)}이다.`),
          facts: { choose: { exprs: scaled([qd(m.v, m.c), q(fv)]), rule: 'compare' } }
        });
      }
      let rows, r1, r2;
      if (n === 0) {
        const m = d.until(() => { const p = d.int(1, 7), same = d.int(0, 3) === 0, a = R(p, d.int(4, 40)); return { a, b: same ? a : R(p, d.int(4, 40)) }; }, (x) => x.a.p < x.a.q && x.b.p < x.b.q && x.a.p === x.b.p && formsOf(x.a).length >= 2 && formsOf(x.b).length >= 2);
        const f1 = d.pick(formsOf(m.a)), f2 = d.until(() => d.pick(formsOf(m.b)), (f) => f[1] !== f1[1]);
        rows = [f1, f2];
      } else {
        const mk = () => mxPick(d, d.pick(['top', 'plain', 'reduce', 'over']), 6, 9, 9);
        rows = d.until(() => [mk(), mk()], ([p, s]) => { const x = quo(p[0], p[1]), y = quo(s[0], s[1]); return key(p[0]) !== key(s[0]) && p[1] !== s[1] && (x.q === y.q || x.p === y.p || (x.p > x.q) !== (y.p > y.q)); });
      }
      [r1, r2] = rows.map(([v, c]) => quo(v, c));
      const sign = sgn(r1, r2);
      return C('두 나눗셈의 몫의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, sign, {
        figure: versus(div(rows[0][0], rows[0][1]), div(rows[1][0], rows[1][1])),
        explain: `${told(rows[0][0], rows[0][1])}, ${told(rows[1][0], rows[1][1])}이다. ` + (sign === 1 ? '두 몫의 크기는 같다.' : `${rs(r1)} ${SIGNS[sign]} ${rs(r2)}이다.`),
        facts: { choose: { exprs: scaled(rows.map(([v, c]) => qd(v, c))), rule: 'compare' }, rule: ['signFn', 'signMx'][n] }
      });
    }, { count: 3 }),
    T('comp-max', '몫이 가장 큰(작은) 것 찾기', '①46 ②44 ③52 심21', (d) => {
      const mk = () => d.pick([() => pfPick(d, 'top'), () => pfPick(d, 'plain', 9, 6), () => pfPick(d, 'reduce'), () => ifPick(d, 'top'), () => ifPick(d, 'reduce')])();
      const rows = d.until(() => [mk(), mk(), mk()], (list) => { const vs = list.map(([v, c]) => quo(v, c)); return distinct(vs) && apart(list) && vs.reduce((x, r) => lcm(x, r.q), 1) <= 36 && new Set(vs.map((r) => r.q)).size >= 2; });
      const vs = rows.map(([v, c]) => quo(v, c)), big = d.bool(), hit = best(vs, big), L = vs.reduce((x, r) => lcm(x, r.q), 1);
      return C(`몫이 가장 ${big ? '큰' : '작은'} 것은?`, THREE, hit, {
        figure: tagged(rows.map(([v, c]) => div(v, c))),
        explain: `몫은 ${vs.map((r, i) => `${LAB[i]} ${rs(r)}`).join(', ')}이다. 분모가 ${L}${tail(L, '이/가')} 되도록 고치면 ${vs.map((r) => frac(r.p * L / r.q, L)).join(', ')}이므로 가장 ${big ? '큰' : '작은'} 것은 ${LAB[hit]}이다.`,
        facts: { choose: { exprs: scaled(rows.map(([v, c]) => qd(v, c))), rule: big ? 'max' : 'min' } }
      });
    }),
    T('comp-no-calc', '계산하지 않고 몫이 가장 큰(작은) 것 찾기', '②44 ③52', (d) => {
      // 두 식은 나누는 수가 같고, 두 식은 나누어지는 수가 같다.
      const b = d.int(3, 9), [wa, wb] = d.until(() => [d.int(2, 6), d.int(1, 5)], ([x, y]) => x > y), A = V(wa, coTop(d, b), b), Bv = V(wb, coTop(d, b), b), c2 = d.int(3, 9), c1 = c2 + d.int(1, 2), small = d.bool();
      const base = small ? [[Bv, c1], [A, c1], [Bv, c2]] : [[A, c2], [Bv, c2], [A, c1]], order = d.shuffle([0, 1, 2]), rows = order.map((i) => base[i]), hit = order.indexOf(0);
      return C(`계산하지 않고 알아보려고 한다. 몫이 가장 ${small ? '작은' : '큰'} 것은?`, THREE, hit, {
        figure: tagged(rows.map(([v, c]) => div(v, c))),
        explain: `나누는 수가 같으면 나누어지는 수가 ${small ? '작을수록' : '클수록'}, 나누어지는 수가 같으면 나누는 수가 ${small ? '클수록' : '작을수록'} 몫이 ${small ? '작다' : '크다'}. ${show(small ? Bv : A)} ÷ ${small ? c1 : c2}의 몫은 다른 두 식의 몫보다 ${small ? '작다' : '크다'}.`,
        facts: { choose: { exprs: scaled(rows.map(([v, c]) => qd(v, c))), rule: small ? 'min' : 'max' } }
      });
    }),
    T('comp-order', '여러 가지 나눗셈의 몫을 크기 차례로 늘어놓기', '①46 ②44 심21', (d) => {
      // (자연수)÷(자연수), (대분수)÷(자연수), (가분수)÷(자연수)를 하나씩 섞는다.
      const rows = d.until(() => { const [a, b] = nnPick(d, d.bool() ? 'over' : 'overReduce'); return d.shuffle([[nat(a), b], mxPick(d, d.pick(['over', 'plain', 'top']), 9, 6, 6), ifPick(d, d.pick(['over', 'top', 'plain']), 6)]); }, (list) => { const vs = list.map(([v, c]) => quo(v, c)); return distinct(vs) && vs.reduce((x, r) => lcm(x, r.q), 1) <= 24 && vs.every((r) => r.p <= 6 * r.q); });
      const vs = rows.map(([v, c]) => quo(v, c)), desc = d.bool(), pick = orderChoice(d, vs, THREE, desc);
      return C(`몫이 ${desc ? '큰' : '작은'} 것부터 차례대로 쓴 것은?`, pick.options, pick.answer, {
        figure: tagged(rows.map(([v, c]) => div(v, c))),
        explain: `몫은 ${vs.map((r, i) => `${LAB[i]} ${rs(r)}`).join(', ')}이다. ${pick.right.map((i) => rs(vs[i])).join(desc ? ` ${GT} ` : ` ${LT} `)}이다.`,
        facts: { choose: { exprs: scaled(rows.map(([v, c]) => qd(v, c))), rule: desc ? 'descending' : 'ascending', orders: pick.list } }
      });
    }),
    T('comp-odd', '몫이 다른 하나 찾기', '①47 ②45 ③53 심22', (d) => {
      // 두 식은 몫이 같고(약분해야 같은 것이 보인다) 한 식만 다르다. 나누어지는 수가 가분수이면 대분수로 적기도 한다.
      const m = d.until(() => { const qq = d.int(6, 36), p = coTop(d, qq), r = R(p, qq), o = d.bool() ? R(p + 1, qq) : R(p, qq + d.pick([-1, 1, 2])); return { r, o }; }, (x) => x.r.p < x.r.q && x.o.p < x.o.q && cmp(x.r, x.o) !== 0 && formsOf(x.r).length >= 2 && formsOf(x.o).length >= 1);
      const two = d.shuffle(formsOf(m.r)).slice(0, 2), other = d.pick(formsOf(m.o)), face = ([v, c]) => [v.n > v.d && d.bool() ? toV(val(v)) : v, c];
      const order = d.shuffle([0, 1, 2]), rows = order.map((i) => face([two[0], two[1], other][i])), hit = order.indexOf(2);
      return C('몫이 나머지와 다른 하나는?', THREE, hit, {
        figure: tagged(rows.map(([v, c]) => div(v, c))),
        explain: `몫은 ${rows.map(([v, c], i) => `${LAB[i]} ${res(v, c)}`).join(', ')}이다. ${LAB[hit]}만 다르다.`,
        facts: { choose: { exprs: rows.map(([v, c]) => one(qd(v, c))), rule: 'odd' } }
      });
    }),
    T('comp-target', '몫이 주어진 분수인 나눗셈 찾기', '①47 ②35', (d) => {
      // 틀린 식은 정답과 나누어지는 수가 같거나 나누는 수가 같다(분모만 보아서는 고를 수 없다). 나누어지는 수가 가분수이면 대분수로 적는다.
      const m = d.until(() => {
        const qq = d.int(8, 40), r = R(coTop(d, qq), qq), list = formsOf(r);
        if (!list.length) return null;
        const [v, c] = d.pick(list), c2 = d.int(2, 9), n2 = d.int(1, 2 * v.d);
        return { r, rows: [[v, c], [v, c2], [V(0, n2, v.d), c], [V(0, n2, v.d), c2]] };
      }, (x) => x && x.r.p < x.r.q && x.r.p <= 7 && x.rows[0][1] !== x.rows[1][1] && x.rows[2][0].n !== x.rows[0][0].n && gcd(x.rows[2][0].n, x.rows[2][0].d) === 1 && x.rows.slice(1).every(([v, c]) => cmp(quo(v, c), x.r) !== 0 && quo(v, c).q > 1 && quo(v, c).q <= 120));
      const face = ([v, c]) => [v.n > v.d ? toV(val(v)) : v, c], order = d.shuffle([0, 1, 2, 3]), rows = order.map((i) => face(m.rows[i])), hit = order.indexOf(0);
      return C(`몫이 ${frac(m.r.p, m.r.q)}인 것은?`, rows.map(([v, c]) => div(v, c)), hit, {
        explain: `${told(rows[hit][0], rows[hit][1])}이다. 나머지의 몫은 ${rows.filter((_, i) => i !== hit).map(([v, c]) => res(v, c)).join(', ')}이다.`,
        facts: { choose: { exprs: rows.map(([v, c]) => one(qd(v, c))), rule: 'equals', target: m.r.p / m.r.q } }
      });
    }),
    T('comp-chain-odd', '자연수를 이어 나눈 식과 (분수)÷(자연수) 견주기', '①49', (d) => {
      // a ÷ b ÷ c, a/b ÷ c, a ÷ c ÷ b 는 모두 a/(b×c)이다. b/c ÷ a 만 다르다.
      const [a, b, c] = d.until(() => [d.int(2, 9), d.int(2, 9), d.int(2, 9)], ([x, y, z]) => new Set([x, y, z]).size === 3 && gcd(x, y) === 1 && gcd(y, z) === 1 && gcd(x, z) === 1 && x < y);
      const rows = d.shuffle([[eq(a, '/', b, '/', c), `${a}/(${b}*${c})`], [eq(frac(a, b), '/', c), `${a}/(${b}*${c})`], [eq(a, '/', c, '/', b), `${a}/(${c}*${b})`], [eq(frac(b, c), '/', a), `${b}/(${c}*${a})`, true]]);
      return C('계산 결과가 나머지와 다른 하나는?', rows.map((row) => row[0]), rows.findIndex((row) => row[2]), {
        explain: `${a} ÷ ${b} = ${frac(a, b)}이므로 ${a} ÷ ${b} ÷ ${c} = ${frac(a, b)} ÷ ${c} = ${frac(a, b * c)}이다. ${a} ÷ ${c} ÷ ${b} = ${frac(a, c)} ÷ ${b} = ${frac(a, b * c)}${tail(a, '으로/로')} 같다. ${frac(b, c)} ÷ ${a} = ${frac(b, c * a)}만 다르다.`,
        facts: { choose: { exprs: rows.map((row) => row[1]), rule: 'odd' } }
      });
    }),
    T('comp-half', '몫이 1/2보다 작은 것 찾기', '①48 ②46', (d) => {
      // 세 식의 몫은 모두 1/4보다 크고 1보다 작다. 1/2보다 작은 것은 하나뿐이다.
      const mk = () => mxPick(d, d.pick(['top', 'plain', 'reduce']), 5, 9, 9);
      const rows = d.until(() => [mk(), mk(), mk()], (list) => { const vs = list.map(([v, c]) => quo(v, c)); return apart(list) && vs.every((r) => 4 * r.p > r.q && 2 * r.p !== r.q) && vs.filter((r) => 2 * r.p < r.q).length === 1 && new Set(list.map((row) => row[1])).size === 3; });
      const vs = rows.map(([v, c]) => quo(v, c)), hit = vs.findIndex((r) => 2 * r.p < r.q);
      return C(`몫이 ${frac(1, 2)}보다 작은 것은?`, THREE, hit, {
        figure: tagged(rows.map(([v, c]) => div(v, c))),
        explain: `몫은 ${vs.map((r, i) => `${LAB[i]} ${rs(r)}`).join(', ')}이다. 분자의 2배가 분모보다 작은 ${LAB[hit]}만 ${frac(1, 2)}보다 작다.`,
        facts: { only: { values: rows.map(([v, c]) => 2 * top(v) - v.d * c), test: 'atMost', target: -1 } }
      });
    }),
    T('comp-ends', '여러 수에서 골라 나누기(분수)', '①51 ②49 ③57 심9', (d, n) => {
      if (n === 0) {
        // 분모가 같은 진분수 둘과 자연수 둘: 가장 작은 수(진분수)를 가장 큰 수(자연수)로 나눈다.
        const b = d.pick([5, 7, 8, 9, 10, 11, 12, 13]), [a1, a2] = d.until(() => [coTop(d, b, 2), coTop(d, b, 2)], ([x, y]) => x < y), [n1, n2] = d.until(() => [d.int(1, 8), d.int(2, 9)], ([x, y]) => x < y), lo = V(0, a1, b);
        return divQ('가장 작은 수를 가장 큰 수로 나눈 몫을 구하시오.', lo, n2, {
          figure: numbers(d.shuffle([lo, V(0, a2, b), nat(n1), nat(n2)]).map(show)),
          explain: `가장 작은 수는 ${show(lo)}, 가장 큰 수는 ${n2}이다. ${told(lo, n2)}이다.`
        });
      }
      if (n === 2) {
        // 분자가 같은 세 진분수: 분모가 클수록 작다. 가장 큰(작은) 수를 주어진 자연수로 나눈다.
        const a = d.int(2, 5), dens = d.until(() => d.shuffle([3, 4, 5, 7, 8, 9, 11, 13, 14]).slice(0, 3), (list) => list.every((x) => x > a && gcd(x, a) === 1)), big = d.bool(), c = d.int(2, 8), v = V(0, a, big ? Math.min(...dens) : Math.max(...dens));
        return divQ(`세 분수 가운데 가장 ${big ? '큰' : '작은'} 수를 ${josa(c, '으로/로')} 나눈 몫을 구하시오.`, v, c, {
          figure: numbers(dens.map((x) => frac(a, x))),
          explain: `분자가 같은 분수는 분모가 ${big ? '작을수록 크다' : '클수록 작다'}. 가장 ${big ? '큰' : '작은'} 수는 ${show(v)}이다. ${told(v, c)}이다.`
        });
      }
      // 자연수 하나와 그보다 조금 큰 대분수·가분수: 가장 큰 수를 가장 작은 수(자연수)로 나눈다.
      const k = d.int(2, 4), [x, y] = d.until(() => [d.int(2, 6), d.int(2, 6)], ([p, s]) => p !== s), mixedOne = V(k, 1, x), improper = V(0, k * y + 1, y), hi = x < y ? mixedOne : improper;
      return divQ('가장 큰 수를 가장 작은 수로 나눈 몫을 구하시오.', hi, k, {
        figure: numbers(d.shuffle([mixedOne, improper, nat(k)]).map(show)),
        explain: `${show(improper)} = ${mixed(k, 1, y)}이고 ${frac(1, x)} ${x < y ? GT : LT} ${frac(1, y)}이므로 가장 큰 수는 ${show(hi)}, 가장 작은 수는 ${k}이다. ${told(hi, k)}이다.`
      });
    }, { count: 3 }),
    T('comp-times-of', '대분수는 자연수의 몇 배인지 구하기', '①17 ②59 심11', (d) => {
      // 나누어지는 수가 더 작아 몫이 1보다 작다.
      const [v, c] = d.until(() => mxPick(d, d.pick(['top', 'reduce', 'plain']), 8, 9, 9), ([x, y]) => x.w >= 2 && y - x.w <= 3);
      return divQ(`${vj(v, '은/는')} ${c}의 몇 배인가?`, v, c, { unit: '배', explain: `${vj(v, '을/를')} ${josa(c, '으로/로')} 나눈다. ${told(v, c)}이므로 ${res(v, c)}배이다.` });
    }),
    T('comp-kinds', '수의 종류를 가려 골라 나누기', '②49 ③40', (d) => {
      const wantProper = d.bool(), b1 = d.int(3, 9), b2 = d.int(2, 7), proper = V(0, coTop(d, b1, 2), b1), improper = V(0, b2 + coTop(d, b2), b2), c = d.until(() => d.int(2, 9), (x) => quo(wantProper ? proper : improper, x).q > 1), v = wantProper ? proper : improper;
      return divQ(`세 수 가운데 ${wantProper ? '진분수' : '가분수'}를 자연수로 나눈 몫을 구하시오.`, v, c, {
        figure: numbers(d.shuffle([proper, improper, nat(c)]).map(show)),
        explain: `${wantProper ? '진분수는 분자가 분모보다 작은' : '가분수는 분자가 분모와 같거나 분모보다 큰'} 분수이므로 ${show(v)}이다. ${told(v, c)}이다.`
      });
    }),
    T('comp-times-box', '곱셈식의 □를 나눗셈으로 구하기(분수)', '①52 ②51 ③79 심10', (d, n) => {
      if (n === 0) {
        const [v, c] = pfPick(d, d.bool() ? 'top' : 'reduce');
        return divQ('□ 안에 알맞은 수는?', v, c, { figure: eq(box(), '*', c, '=', show(v)), explain: `□ = ${show(v)} ÷ ${c}이다. ${told(v, c)}이다.` });
      }
      if (n === 1) {
        const [v, c] = mxPick(d, d.pick(['top', 'reduce', 'plain']));
        return divQ('□ 안에 알맞은 수는?', v, c, { figure: eq(c, '*', box(), '=', show(v)), explain: `□ = ${show(v)} ÷ ${c}이다. ${told(v, c)}이다.` });
      }
      // 문제가 기약분수로 나타내라고 한다: 크기가 같은 다른 분수는 받지 않는다.
      const [v, c] = pfPick(d, 'reduce');
      return divQ(`어떤 수에 ${josa(c, '을/를')} 곱하였더니 ${vj(v, '이/가')} 되었다. 어떤 수를 기약분수로 나타내시오.`, v, c, { exact: true, explain: `(어떤 수) × ${c} = ${show(v)}이므로 어떤 수는 ${show(v)} ÷ ${c}이다. ${told(v, c)}이다.` });
    }, { count: 3 }),
    T('comp-box-top', '몫보다 작은 분수의 분자(□)', '①54 ②47 ③55 심28', (d, n) => {
      if (n === 0) {
        // 몫의 분모와 □가 든 분수의 분모가 같다.
        const [v, c] = d.until(() => (d.bool() ? pfPick(d, 'plain', 9, 7) : ifPick(d, 'plain', 7)), ([x]) => x.n >= 3), a = v.n, L = v.d * c;
        return N('□ 안에 들어갈 수 있는 자연수 가운데 가장 큰 수는?', a - 1, {
          figure: eq(frac(box(), L), '<', show(v), '/', c),
          explain: `${told(v, c)}이다. ${frac('□', L)} ${LT} ${frac(a, L)}이므로 □는 ${a}보다 작아야 한다. 가장 큰 수는 ${a - 1}이다.`,
          facts: { digit: { template: `□*${v.d}*${c}<${a}*${L}`, lo: 1, hi: a + 3, ask: 'max' }, rule: 'topMax' }
        });
      }
      // 몫을 약분하거나 분모를 맞추어 견준다.
      const m = d.until(() => { const [v, c] = d.bool() ? pfPick(d, d.pick(['top', 'reduce'])) : mxPick(d, d.pick(['top', 'reduce'])), r = quo(v, c), k = d.int(1, 3); return { v, c, r, L: r.q * k, cut: r.p * k }; }, (x) => x.cut >= 3 && x.cut <= 9 && x.L <= 60 && x.L !== x.v.d * x.c);
      const { v, c, r, L, cut } = m, x = qd(v, c);
      return N('□ 안에 들어갈 수 있는 자연수는 모두 몇 개인가?', cut - 1, {
        unit: '개', figure: eq(show(v), '/', c, '>', frac(box(), L)),
        explain: `${told(v, c)}이다. ` + (L === r.q ? '' : `분모가 ${L}${tail(L, '이/가')} 되도록 고치면 ${frac(cut, L)}이다. `) + `□는 ${cut}보다 작아야 하므로 1부터 ${cut - 1}까지 ${cut - 1}개이다.`,
        facts: { digit: { template: `${x.num}*${L}>□*${x.dens.join('*')}`, lo: 1, hi: cut + 3, ask: 'count' }, rule: 'topCount' }
      });
    }, { count: 2 }),
    T('comp-box-nat', '몫과 자연수의 크기 비교(□)', '①55 ②48 ③55 심26', (d, n) => {
      // 첫째 문항은 몫보다 작은 가장 큰 자연수, 둘째 문항은 몫보다 큰 가장 작은 자연수. 몫은 1보다 크고 자연수로 떨어지지 않는다.
      const [v, c] = n === 0 ? d.until(() => (d.bool() ? ifPick(d, 'over') : mxPick(d, 'over', 20, 6, 5)), ([p, s]) => top(p) >= 2 * p.d * s && top(p) <= 99) : mxPick(d, 'over'), x = qd(v, c), r = quo(v, c), k = Math.floor(r.p / r.q), den = x.dens.join('*');
      if (n === 0) return N('□ 안에 들어갈 수 있는 자연수 가운데 가장 큰 수는?', k, { figure: eq(show(v), '/', c, '>', box()), explain: `${told(v, c)}이다. □는 ${rs(r)}보다 작은 자연수이므로 가장 큰 수는 ${k}이다.`, facts: { digit: { template: `${x.num}>□*(${den})`, lo: 1, hi: k + 3, ask: 'max' }, rule: 'natMax' } });
      return N('□ 안에 들어갈 수 있는 자연수 가운데 가장 작은 수는?', k + 1, { figure: eq(box(), '>', show(v), '/', c), explain: `${told(v, c)}이다. □는 ${rs(r)}보다 큰 자연수이므로 가장 작은 수는 ${k + 1}이다.`, facts: { digit: { template: `□*(${den})>${x.num}`, lo: 1, hi: k + 4, ask: 'min' }, rule: 'natMin' } });
    }, { count: 2 }),
    T('comp-cards-fixed', '분모가 정해진 식에 수 카드 두 장 넣기', '②54 심36', (d) => {
      // 분모가 정해져 있으므로 분자는 크게(작게), 나누는 수는 작게(크게) 넣는다.
      const D = d.pick([11, 13]), list = d.shuffle([2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3), hi = Math.max(...list), lo = Math.min(...list), big = d.bool(), v = V(0, big ? hi : lo, D), c = big ? lo : hi;
      return divQ(`수 카드 3장 가운데 2장을 골라 □ 안에 한 번씩 넣어 몫이 가장 ${big ? '큰' : '작은'} 나눗셈을 만들었다. 이 나눗셈의 몫은?`, v, c, {
        figure: cards(list) + eq(frac(box(), D), '/', box()),
        explain: `나누어지는 수가 ${big ? '클수록' : '작을수록'}, 나누는 수가 ${big ? '작을수록' : '클수록'} 몫이 ${big ? '크다' : '작다'}. 분자에 가장 ${big ? '큰' : '작은'} 수 ${v.n}, 나누는 수에 가장 ${big ? '작은' : '큰'} 수 ${josa(c, '을/를')} 넣으면 ${told(v, c)}이다.`
      });
    }),
    T('comp-cards-mixed', '수 카드로 만든 대분수를 자연수로 나누기', '②54 ③60·63 심35', (d) => {
      // 세 수 a < b < c 로 만드는 가장 큰 대분수는 c a/b, 가장 작은 대분수는 a b/c 이다.
      const big = d.bool(), m = d.until(() => { const [a, b, c] = d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3).sort((x, y) => x - y); return { list: [a, b, c], v: big ? V(c, a, b) : V(a, b, c), k: d.int(2, 9) }; }, (x) => gcd(x.v.n, x.v.d) === 1 && !x.list.includes(x.k) && quo(x.v, x.k).q > 1 && quo(x.v, x.k).q <= 72);
      const [a, , c] = m.list;
      return divQ(`수 카드 3장을 한 번씩 모두 사용하여 만들 수 있는 가장 ${big ? '큰' : '작은'} 대분수를 ${josa(m.k, '으로/로')} 나눈 몫을 구하시오.`, m.v, m.k, {
        figure: cards(d.shuffle(m.list)),
        explain: `가장 ${big ? '큰' : '작은'} 대분수는 가장 ${big ? '큰' : '작은'} 수 ${josa(big ? c : a, '을/를')} 자연수 부분에 놓은 ${show(m.v)}이다. ${told(m.v, m.k)}이다.`
      });
    }),
    T('comp-cond-frac', '조건에 맞는 분수를 찾아 나누기', '심37', (d) => {
      const [D, c] = d.until(() => [d.int(5, 16), d.int(2, 9)], ([x, y]) => gcd(x - 1, y) > 1), v = V(0, D - 1, D);
      return ansQ(`분모가 ${D}인 진분수 가운데 가장 큰 수를 ${josa(c, '으로/로')} 나눈 몫을 구하시오.`, { num: `(${D}-1)`, dens: [D, c], P: D - 1, D: D * c }, {
        explain: `분모가 ${D}인 진분수 가운데 가장 큰 수는 분자가 ${D - 1}인 ${show(v)}이다. ${told(v, c)}이다.`, facts: { unseen: [1] }
      });
    })
  ]);

  // ── 분수의 나눗셈의 활용 ──
  const word = (text, v, c, unit, explain, more) => divQ(text, v, c, Object.assign({ unit, explain }, more || {}));
  B.addTypes('6-1-1', 'word', [
    T('word-nn', '문장제: 똑같이 나누기((자연수)÷(자연수), 몫이 1보다 작다)', '①57 ②21 ③20 심42', (d) => {
      const [a, b] = d.until(() => nnPick(d, 'proper'), ([x, y]) => x <= 9 && y <= 12);
      return word(`밀가루 ${a} kg을 봉지 ${b}개에 똑같이 나누어 담았다. 봉지 한 개에 담은 밀가루는 몇 kg인가?`, nat(a), b, 'kg', `${a} kg을 똑같이 ${josa(b, '으로/로')} 나누므로 ${told(nat(a), b)}이다.`);
    }, { standard: STD_NN }),
    T('word-nn-over', '문장제: 똑같이 나누기((자연수)÷(자연수), 몫이 1보다 크다)', '①58 ②22 ③21 심42', (d) => {
      const [a, b] = d.until(() => nnPick(d, 'over'), ([x, y]) => x <= 30 && y >= 3);
      return word(`길이가 ${a} m인 끈을 ${b}명이 똑같이 나누어 가졌다. 한 명이 가진 끈은 몇 m인가?`, nat(a), b, 'm', `${a} m를 똑같이 ${josa(b, '으로/로')} 나누므로 ${told(nat(a), b)}이다.`);
    }, { standard: STD_NN }),
    T('word-nn-reduce', '문장제: 똑같이 나눈 양을 기약분수로 나타내기', '②22 ③20 ①60', (d) => {
      const [a, b] = d.until(() => nnPick(d, 'properReduce'), ([x, y]) => y <= 12), g = gcd(a, b);
      return word(`설탕 ${a} kg을 통 ${b}개에 똑같이 나누어 담았다. 통 한 개에 담은 설탕은 몇 kg인지 기약분수로 나타내시오.`, nat(a), b, 'kg', `${a} ÷ ${b} = ${frac(a, b)}이다. 분모와 분자를 각각 ${josa(g, '으로/로')} 나누면 ${frac(a / g, b / g)}이다.`, { exact: true });
    }, { standard: STD_NN }),
    T('word-fn', '문장제: 똑같이 나누기(진분수·가분수)', '①59 ②55 ③65 심43', (d, n) => {
      // 첫째 문항은 진분수, 둘째 문항은 가분수.
      if (n === 0) {
        const [v, c] = pfPick(d, d.pick(['plain', 'reduce', 'top']), 12, 9);
        return word(`주스 ${show(v)} L를 컵 ${c}개에 똑같이 나누어 담았다. 컵 한 개에 담은 주스는 몇 L인가?`, v, c, 'L', `${show(v)} L를 똑같이 ${josa(c, '으로/로')} 나누므로 ${told(v, c)}이다.`);
      }
      const [v, c] = ifPick(d, d.pick(['top', 'reduce', 'plain']));
      return word(`색 테이프 ${show(v)} m를 ${c}명이 똑같이 나누어 가졌다. 한 명이 가진 색 테이프는 몇 m인가?`, v, c, 'm', `${show(v)} m를 똑같이 ${josa(c, '으로/로')} 나누므로 ${told(v, c)}이다.`);
    }, { count: 2 }),
    T('word-mx', '문장제: 똑같이 나누기(대분수)', '①60 ②56 ③66 심43', (d, n) => {
      // 첫째 문항은 몫이 1보다 작다. 둘째 문항은 무게가 같은 물건 한 개의 무게(몫이 1보다 크다).
      if (n === 0) {
        const [v, c] = mxPick(d, d.pick(['top', 'plain', 'reduce']));
        return word(`우유 ${show(v)} L를 ${c}명이 똑같이 나누어 마셨다. 한 명이 마신 우유는 몇 L인가?`, v, c, 'L', `${show(v)} L를 똑같이 ${josa(c, '으로/로')} 나누므로 ${told(v, c)}이다.`);
      }
      const [v, c] = mxPick(d, 'over');
      return word(`무게가 같은 수박 ${c}통의 무게를 재었더니 ${show(v)} kg이었다. 수박 한 통의 무게는 몇 kg인가?`, v, c, 'kg', `수박 ${c}통의 무게를 ${josa(c, '으로/로')} 나눈다. ${told(v, c)}이다.`);
    }, { count: 2 }),
    T('word-rate', '문장제: 일정한 빠르기로 1분 동안 간 거리', '①67 ②22·57 ③67 심43', (d) => {
      const [v, c] = pfPick(d, d.pick(['plain', 'reduce', 'top']), 12, 9);
      return word(`일정한 빠르기로 ${c}분 동안 ${show(v)} km를 걸었다. 1분 동안 걸은 거리는 몇 km인가?`, v, c, 'km', `${c}분 동안 걸은 거리를 ${josa(c, '으로/로')} 나눈다. ${told(v, c)}이다.`);
    }),
    T('word-times-nn', '문장제: 몇 배인지 분수로 나타내기(자연수)', '①62 ②23 ③24 심11', (d) => {
      const [a, b] = d.until(() => nnPick(d, d.bool() ? 'over' : 'overReduce'), ([x, y]) => x <= 30 && y >= 3 && x < 4 * y);
      return word(`빨간색 끈의 길이는 ${a} m이고, 파란색 끈의 길이는 ${b} m이다. 빨간색 끈의 길이는 파란색 끈의 길이의 몇 배인가?`, nat(a), b, '배', `${a} m를 ${b} m로 나눈다. ${told(nat(a), b)}이므로 ${res(nat(a), b)}배이다.`);
    }, { standard: STD_NN }),
    T('word-times', '문장제: 대분수는 자연수의 몇 배인가', '①62 ②59 ③69 심11', (d) => {
      const [v, c] = d.until(() => mxPick(d, 'over', 12, 9, 9), ([x, y]) => top(x) < 2 * x.d * y && y >= 3);
      return word(`강아지의 무게는 ${show(v)} kg이고, 고양이의 무게는 ${c} kg이다. 강아지의 무게는 고양이의 무게의 몇 배인가?`, v, c, '배', `강아지의 무게를 고양이의 무게로 나눈다. ${told(v, c)}이므로 ${res(v, c)}배이다.`);
    }),
    T('word-table', '문장제: 표의 양을 1인분의 양으로 고치기', '①63 ②58 심42', (d) => {
      const k = d.int(2, 4), v1 = forC(d, k, 'proper', 40), v2 = d.until(() => forC(d, k, 'mixed', 40), (x) => x.w <= 3 && x.d !== v1.d), spoon = d.until(() => d.int(3, 9), (x) => x % k !== 0), ask = d.int(0, 1);
      const rows = [['떡', `${show(v1)} kg`], ['물', `${show(v2)}컵`], ['간장', `${spoon}큰술`]], v = [v1, v2][ask], unit = ['kg', '컵'][ask];
      return word(`표는 떡볶이 ${k}인분을 만드는 데 필요한 재료의 양이다. 1인분을 만드는 데 필요한 ${['떡은', '물은'][ask]} 몇 ${unit}인가?`, v, k, unit, `${k}인분의 양을 ${josa(k, '으로/로')} 나눈다. ${told(v, k)}이다.`, { figure: table(['재료', '필요한 양'], rows) });
    }),
    T('word-expr', '문장제: 구하는 식으로 알맞지 않은 것 고르기', '①61', (d) => {
      const [v, c] = pfPick(d, 'plain', 9, 7), a = v.n, b = v.d;
      const rows = d.shuffle([[div(v, c), `${a}/(${b}*${c})`], [eq(show(v), '*', frac(1, c)), `${a}*1/(${b}*${c})`], [eq(frac(a * c, b * c), '/', c), `${a * c}/(${b * c}*${c})`], [eq(show(v), '*', c), `${a}*${c}/${b}`, true]]);
      return C(`설탕 ${show(v)} kg을 봉지 ${c}개에 똑같이 나누어 담으려고 한다. 봉지 한 개에 담는 설탕의 양을 구하는 식으로 알맞지 않은 것은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[2]), {
        explain: `똑같이 ${josa(c, '으로/로')} 나누므로 ${show(v)} ÷ ${c}이다. 이것은 ${show(v)} × ${frac(1, c)}, ${frac(a * c, b * c)} ÷ ${josa(c, '과/와')} 같다. ${show(v)} × ${josa(c, '은/는')} 봉지 ${c}개에 ${show(v)} kg씩 담을 때의 양이다.`,
        facts: { choose: { exprs: rows.map((row) => row[1]), rule: 'odd' } }
      });
    })
  ]);

  // ── 도형에서 분수의 나눗셈 ──
  const SHAPES = [['정삼각형', 3], ['정사각형', 4], ['정오각형', 5], ['정육각형', 6]];
  B.addTypes('6-1-1', 'shape', [
    T('shape-side-nn', '둘레가 자연수인 정다각형의 한 변의 길이', '①70 ②64 ③22 심59', (d) => {
      const [shape, sides] = d.pick(SHAPES), L = d.until(() => d.int(7, 40), (x) => x % sides !== 0 && x > sides && x < 7 * sides);
      return word(`둘레가 ${L} cm인 ${shape}의 한 변의 길이는 몇 cm인가?`, nat(L), sides, 'cm', `${shape}은 길이가 같은 변이 ${sides}개이므로 둘레를 ${josa(sides, '으로/로')} 나눈다. ${told(nat(L), sides)}이다.`, { facts: { unseen: [sides] } });
    }, { standard: STD_NN }),
    T('shape-side', '둘레가 분수인 정다각형의 한 변의 길이', '①70 ②64 ③70 심59', (d, n) => {
      // 첫째 문항은 진분수 길이의 철사, 둘째 문항은 대분수 둘레.
      const [shape, sides] = d.pick(SHAPES);
      if (n === 0) {
        const v = forC(d, sides, 'proper', 80);
        return word(`길이가 ${show(v)} m인 철사를 겹치지 않게 남김없이 사용하여 ${shape} 하나를 만들었다. 이 ${shape}의 한 변의 길이는 몇 m인가?`, v, sides, 'm', `${shape}은 길이가 같은 변이 ${sides}개이므로 철사의 길이를 ${josa(sides, '으로/로')} 나눈다. ${told(v, sides)}이다.`, { facts: { unseen: [sides] } });
      }
      const v = d.until(() => forC(d, sides, 'mixed', 60), (x) => gcd(top(x), sides) > 1);
      return word(`둘레가 ${show(v)} cm인 ${shape}의 한 변의 길이는 몇 cm인가?`, v, sides, 'cm', `${shape}은 길이가 같은 변이 ${sides}개이므로 둘레를 ${josa(sides, '으로/로')} 나눈다. ${told(v, sides)}이다.`, { facts: { unseen: [sides] } });
    }, { count: 2 }),
    T('shape-rect-nn', '넓이와 가로가 자연수인 직사각형의 세로', '②65 심63', (d) => {
      const [a, b] = d.until(() => nnPick(d, 'over'), ([x, y]) => y >= 3 && x <= 40);
      return word(`넓이가 ${a} cm²이고 가로가 ${b} cm인 직사각형의 세로는 몇 cm인가?`, nat(a), b, 'cm', `직사각형의 넓이는 가로와 세로의 곱이므로 넓이를 가로로 나눈다. ${told(nat(a), b)}이다.`);
    }, { standard: STD_NN }),
    T('shape-rect-side', '넓이가 분수인 직사각형·평행사변형의 한 변의 길이', '①72 ②65 ③71 심63', (d, n) => {
      // 첫째 문항은 직사각형의 세로, 둘째 문항은 평행사변형의 높이.
      const [v, c] = d.until(() => mxPick(d, d.pick(['over', 'over', 'plain', 'reduce']), 12, 9, 9), ([x, y]) => y >= 3 && x.w >= 2);
      if (n === 0) return word(`넓이가 ${show(v)} m²인 직사각형 모양의 꽃밭이 있다. 이 꽃밭의 가로가 ${c} m일 때, 세로는 몇 m인가?`, v, c, 'm', `직사각형의 넓이는 가로와 세로의 곱이므로 넓이를 가로로 나눈다. ${told(v, c)}이다.`);
      return word(`넓이가 ${show(v)} cm²이고 밑변의 길이가 ${c} cm인 평행사변형의 높이는 몇 cm인가?`, v, c, 'cm', `평행사변형의 넓이는 밑변의 길이와 높이의 곱이므로 넓이를 밑변의 길이로 나눈다. ${told(v, c)}이다.`);
    }, { count: 2 }),
    T('shape-cell', '똑같이 나눈 도형에서 색칠한 한 칸의 넓이', '①73 ②66 ③72 심68', (d) => {
      const [cols, rows] = d.pick([[3, 2], [4, 2], [5, 2], [3, 3], [4, 3], [5, 1], [3, 1]]), parts = cols * rows, v = forC(d, parts, 'mixed', 60);
      return word(`넓이가 ${show(v)} cm²인 직사각형을 그림과 같이 똑같이 나누었다. 색칠한 부분의 넓이는 몇 cm²인가?`, v, parts, 'cm²', `직사각형을 똑같이 ${parts}칸으로 나눈 것 중의 한 칸이다. ${told(v, parts)}이다.`, { figure: cellGrid(cols, rows, [d.int(0, parts - 1)]).replace(`그 가운데 1칸을 색칠`, '그 가운데 한 칸을 색칠') });
    }),
    T('shape-area-split', '넓이를 구한 다음 똑같이 나눈 한 칸의 넓이', '①74 심70', (d) => {
      const [cols, rows] = d.pick([[3, 2], [4, 2], [3, 3], [5, 1], [4, 1], [3, 1], [5, 2]]), parts = cols * rows, [x, y] = d.until(() => [d.int(4, 9), d.int(3, 8)], ([p, s]) => p > s && (p * s) % parts !== 0 && p * s > parts && cols >= rows);
      return ansQ(`가로가 ${x} cm, 세로가 ${y} cm인 직사각형을 그림과 같이 똑같이 나누었다. 색칠한 부분의 넓이는 몇 cm²인가?`, { num: `${x}*${y}`, dens: [parts], P: x * y, D: parts }, {
        unit: 'cm²', figure: cellGrid(cols, rows, [d.int(0, parts - 1)]).replace(`그 가운데 1칸을 색칠`, '그 가운데 한 칸을 색칠'),
        explain: `직사각형의 넓이는 ${x} × ${y} = ${x * y}(cm²)이다. 똑같이 ${parts}칸으로 나눈 것 중의 한 칸이므로 ${told(nat(x * y), parts)}이다.`
      });
    }, { standard: STD_NN })
  ]);

  // ── 실력 ──
  B.addGroup('6-1-1', {
    id: 'hard', title: '단원 종합', standard: STD,
    types: [
      // ── ① 문제의 상황·그림·수에 함정이 있어 뜻을 정확히 대야 풀리는 문제 ──
      H('hard-over-one-count', '계산하지 않고 몫이 1보다 큰 나눗셈 세기', '심6·23 / 기본 ①48 ②46 ③54', (d) => {
        // 함정: 가분수는 「분수」라서 자연수보다 작다고 여기는 아이, 대분수의 자연수 부분이 나누는 수와 같을 때를 놓치는 아이, 나누어지는 수와 나누는 수가 같아
        //  몫이 꼭 1인 식을 「1보다 크다」에 넣는 아이가 걸린다. 나누어지는 수가 나누는 수보다 큰가를 식마다 정확히 대야 센다.
        const make = (code) => {
          if (code === 'NS') { const b = d.int(5, 15); return [nat(b - d.int(1, 3)), b]; }
          if (code === 'NB') { const b = d.int(4, 12); return [nat(b + d.int(1, 3)), b]; }
          if (code === 'IB') { const c = d.int(2, 4), b = d.int(3, 9); return [V(0, d.until(() => d.int(b * c + 1, b * c + b - 1), (t) => gcd(t, b) === 1), b), c]; }
          if (code === 'IS') { const c = d.int(2, 4), b = d.int(3, 9); return [V(0, d.until(() => d.int(b * c - b + 1, b * c - 1), (t) => gcd(t, b) === 1), b), c]; }
          if (code === 'MB') { const c = d.int(2, 6), b = d.int(2, 9); return [V(c + d.int(0, 1), coTop(d, b), b), c]; }
          if (code === 'MS') { const c = d.int(3, 7), b = d.int(2, 9); return [V(c - 1, coTop(d, b), b), c]; }
          const c = d.int(2, 5), b = d.int(2, 6); return [{ w: 0, n: c * b, d: b }, c];
        };
        const plan = d.pick([['NS', 'IB', 'MS', 'ONE'], ['NB', 'IS', 'MB', 'ONE'], ['IB', 'IS', 'MB', 'MS'], ['NS', 'IS', 'MB', 'IB'], ['IB', 'MS', 'ONE', 'NB'], ['IS', 'MB', 'ONE', 'NS']]);
        const rows = d.until(() => d.shuffle(plan).map(make), apart), flags = rows.map(([v, c]) => top(v) > v.d * c), hits = rows.map((_, i) => (flags[i] ? LAB[i] : '')).filter(Boolean);
        return N('계산하지 않고 알아보려고 한다. 몫이 1보다 큰 것은 모두 몇 개인가?', hits.length, {
          unit: '개', figure: tagged(rows.map(([v, c]) => div(v, c))),
          explain: `나누어지는 수가 나누는 수보다 커야 몫이 1보다 크다. 가분수는 대분수로 고쳐 나누는 수와 크기를 비교한다. 나누어지는 수와 나누는 수가 같으면 몫은 1이다. 몫이 1보다 큰 것은 ${hits.join(', ')}이다.`,
          facts: { count: flags }
        });
      }),
      H('hard-hidden', '문장제: 글에 숨은 나누는 수 찾기', '심44 / 기본 ①57·58·60·71 ②22·56', (d, n) => {
        // 함정: 나누는 수가 글에 숫자로 적혀 있지 않거나, 적힌 수가 나누는 수가 아니다.
        //  첫째 문항은 「친구 k명과 함께」(k + 1명), 둘째 문항은 「일주일」(7), 셋째 문항은 심은 채소의 가짓수, 넷째 문항은 두 정다각형의 변의 수의 합.
        if (n === 0) {
          const k = d.int(2, 5), c = k + 1, v = d.until(() => forC(d, c, 'mixed', 60), (x) => x.w <= 2), p = d.pick(NAMES);
          return word(`${name(p, '은/는')} 친구 ${k}명과 함께 주스 ${show(v)} L를 남김없이 똑같이 나누어 마셨다. ${name(p, '이/가')} 마신 주스는 몇 L인가?`, v, c, 'L', `주스를 마신 사람은 ${nick(p)}와 친구 ${k}명이므로 모두 ${c}명이다. ${told(v, c)}이다.`, { facts: { unseen: [c] } });
        }
        if (n === 1) {
          const v = d.until(() => forC(d, 7, 'mixed', 70), (x) => x.w >= 2);
          return word(`우유 ${show(v)} L를 일주일 동안 날마다 똑같이 나누어 남김없이 마셨다. 하루에 마신 우유는 몇 L인가?`, v, 7, 'L', `일주일은 7일이다. ${told(v, 7)}이다.`, { facts: { unseen: [7] } });
        }
        if (n === 2) {
          const k = d.int(3, 4), list = d.shuffle(['상추', '고추', '오이', '가지', '배추', '당근']).slice(0, k), v = d.until(() => forC(d, k, 'mixed', 48), (x) => x.w >= 3);
          return word(`넓이가 ${show(v)} m²인 텃밭을 넓이가 같게 나누어 ${list.slice(0, k - 1).join(', ')}, ${josa(list[k - 1], '을/를')} 한 부분에 한 가지씩 심었다. ${josa(list[0], '을/를')} 심은 부분의 넓이는 몇 m²인가?`, v, k, 'm²', `심은 채소가 ${k}가지이므로 텃밭을 똑같이 ${josa(k, '으로/로')} 나눈다. ${told(v, k)}이다.`, { facts: { unseen: [k] } });
        }
        const [s1, n1, s2, n2] = d.pick([['정삼각형', 3, '정사각형', 4], ['정삼각형', 3, '정오각형', 5], ['정사각형', 4, '정육각형', 6], ['정삼각형', 3, '정육각형', 6]]), c = n1 + n2, v = forC(d, c, 'any', 80);
        return word(`길이가 ${show(v)} m인 철사를 겹치지 않게 남김없이 사용하여 한 변의 길이가 서로 같은 ${s1} 하나와 ${s2} 하나를 만들었다. ${s1}의 한 변의 길이는 몇 m인가?`, v, c, 'm', `${s1}의 변은 ${n1}개, ${s2}의 변은 ${n2}개이므로 길이가 같은 변이 모두 ${c}개이다. ${told(v, c)}이다.`, { facts: { unseen: [c] } });
      }, { count: 4 }),
      H('hard-times-order', '표에서 두 양을 골라 작은 양이 큰 양의 몇 배인지 구하기', '심11 / 기본 ①62 ②23 ③24', (d) => {
        // 함정: 「㉠은 ㉡의 몇 배」는 ㉠ ÷ ㉡이다. 큰 수를 작은 수로 나누는 아이, 표에 먼저 나온 수를 나중에 나온 수로 나누는 아이가 걸린다(묻는 양이 더 작고 표에서는 뒤에 나온다).
        const things = d.shuffle(['당근', '무', '호박', '감자', '양파']).slice(0, 3), ws = d.until(() => [d.int(2, 12), d.int(2, 12), d.int(2, 12)], (list) => new Set(list).size === 3 && list[0] > list[2] && list[0] % list[2] !== 0);
        const a = ws[2], b = ws[0];
        return divQ(`표는 채소의 무게를 나타낸 것이다. ${things[2]}의 무게는 ${things[0]}의 무게의 몇 배인가?`, nat(a), b, {
          unit: '배', figure: table(['채소', '무게'], things.map((t, i) => [t, `${ws[i]} kg`])),
          explain: `${things[2]}의 무게 ${a} kg을 ${things[0]}의 무게 ${b} kg으로 나눈다. ${told(nat(a), b)}이므로 ${res(nat(a), b)}배이다. 기준이 되는 양으로 나누어야 한다.`
        });
      }, { standard: STD_NN }),
      H('hard-of-vs-div', '「똑같이 나눈 것 중의 하나」와 「~의 몇 분의 몇」이 섞인 길이 가리기', '심43 / 기본 ①34·59 ③32', (d) => {
        // 함정: 「a m를 똑같이 b도막으로 나눈 것 중의 한 도막」(a ÷ b), 「a m의 1/b」(a × 1/b), 「1 m를 b도막으로 나눈 것 중의 a도막」, 「1/b m의 a배」는 모두 a/b m이다.
        //  같은 수가 적힌 다른 말(분수 길이를 다시 나눈 것, 나누어지는 수와 나누는 수를 바꾼 것)을 같은 길이로 읽는 아이가 걸린다.
        //  보기: 「똑같이 나눈 것 중의 한 도막」이 붙은 것끼리 같다고 여기는 아이는 「a m의 1/b」이나 「1/b m의 a배」를 고르고,
        //  분수가 적힌 것끼리 같다고 여기는 아이는 「a m를 b도막으로 나눈 것 중의 한 도막」을 고른다.
        const [a, b] = d.until(() => [d.int(2, 5), d.int(3, 9)], ([x, y]) => x < y && gcd(x, y) === 1);
        const same = d.shuffle([[`${a} m를 똑같이 ${b}도막으로 나눈 것 중의 한 도막`, `${a}/${b}`], [`${a} m의 ${frac(1, b)}`, `${a}*1/${b}`], [`1 m를 똑같이 ${b}도막으로 나눈 것 중의 ${a}도막`, `1*${a}/${b}`], [`${frac(1, b)} m의 ${a}배`, `1*${a}/${b}`]]).slice(0, 3);
        const odd = d.pick([[`${frac(a, b)} m를 똑같이 ${a}도막으로 나눈 것 중의 한 도막`, `${a}/(${b}*${a})`, frac(1, b)], [`${b} m를 똑같이 ${a}도막으로 나눈 것 중의 한 도막`, `${b}/${a}`, rs(R(b, a))], [`${frac(1, b)} m를 똑같이 ${a}도막으로 나눈 것 중의 한 도막`, `1/(${b}*${a})`, frac(1, a * b)]]);
        const rows = d.shuffle(same.concat([odd.concat([true])])), hit = rows.findIndex((row) => row[3]);
        return C('길이가 나머지와 다른 하나는?', LAB, hit, {
          figure: tagged(rows.map((row) => row[0])),
          explain: `${LAB[hit]}의 길이는 ${odd[2]} m이고, 나머지는 모두 ${a} ÷ ${b} = ${a} × ${frac(1, b)} = ${frac(a, b)}(m)이다. 무엇을 몇으로 나누는지, 무엇의 몇 분의 몇인지를 말마다 따져야 한다.`,
          facts: { choose: { exprs: rows.map((row) => row[1]), rule: 'odd' } }
        });
      }),
      H('hard-share-compare', '문장제: 전체가 다른 두 모둠의 한 명의 몫 견주기', '심46 / 기본 ①66 ②24 ③23', (d) => {
        // 함정: 전체가 많은 쪽의 한 명의 몫이 더 많다고 여기는 아이(여기서는 전체가 적은 쪽의 몫이 더 많다), 「k명이 끈 x m를」에서 사람 수를 나누어지는 수로 쓰는 아이가 걸린다.
        //  보기: 끈이 더 긴 모둠은 전체만 견준 아이가 고르고, 「같다」는 두 수의 차(끈과 사람 수의 차)만 본 아이나 통분하지 않고 어림한 아이가 고른다.
        const m = d.until(() => { const k = d.int(2, 5), t = d.int(2, 3), A = d.int(2, 9); return { k, n: k * t, A, Bn: d.int(A + 1, A * t) }; }, (x) => x.n <= 12 && x.A % x.k !== 0 && x.Bn % x.n !== 0 && x.Bn < x.A * (x.n / x.k) && x.Bn <= 12);
        const [p, s] = d.shuffle(NAMES).slice(0, 2), rows = d.shuffle([[m.A, m.k], [m.Bn, m.n]]), sign = rows[0][0] * rows[1][1] > rows[1][0] * rows[0][1] ? 0 : 2, L = Math.max(m.k, m.n);
        return C(`${nick(p)}네 모둠은 끈 ${rows[0][0]} m를 ${rows[0][1]}명이 똑같이 나누어 가졌고, ${nick(s)}네 모둠은 ${rows[1][1]}명이 끈 ${rows[1][0]} m를 똑같이 나누어 가졌다. 한 명이 가진 끈이 더 긴 모둠은?`, [`${nick(p)}네 모둠`, '두 모둠에서 한 명이 가진 끈의 길이는 같다.', `${nick(s)}네 모둠`], sign, {
          explain: `한 명이 가진 끈은 ${nick(p)}네 모둠이 ${rows[0][0]} ÷ ${rows[0][1]} = ${frac(rows[0][0], rows[0][1])}(m), ${nick(s)}네 모둠이 ${rows[1][0]} ÷ ${rows[1][1]} = ${frac(rows[1][0], rows[1][1])}(m)이다. 분모가 ${L}${tail(L, '이/가')} 되도록 고치면 ${frac(rows[0][0] * L / rows[0][1], L)} ${SIGNS[sign]} ${frac(rows[1][0] * L / rows[1][1], L)}이다. 끈이 긴 모둠의 한 명의 몫이 더 긴 것은 아니다.`,
          facts: { choose: { exprs: [`${rows[0][0]}*${rows[1][1]}`, `${rows[1][0]}*${rows[0][1]}`], rule: 'compare' } }
        });
      }, { standard: STD_NN }),
      H('hard-fig-part', '그림에서 「전체의 얼마를 똑같이 나눈 것 중의 하나」가 전체의 얼마인지 구하기', '기본 ①27·34 ②28·29 ③32', (d) => {
        // 함정: 색칠한 부분만 가로로 나누었으므로 칸의 크기가 서로 다르다. 칸 수를 그대로 세는 아이(진한 칸 ÷ 모든 칸), 색칠한 부분만 보고 1/(줄 수)이라고 답하는 아이가 걸린다.
        //  색칠한 부분이 전체의 a/b 이고 그것을 c 로 나눈 것 중의 하나라는 뜻(a/b ÷ c)을 대야 풀린다.
        const [a, b, c] = d.until(() => { const b = d.int(3, 5); return [d.int(2, b - 1), b, d.int(3, 5)]; }, ([x, y, z]) => gcd(x, y) === 1 && x !== z), v = V(0, a, b);
        return divQ('직사각형을 세로 선으로 똑같이 나누어 일부를 색칠한 다음, 색칠한 부분만 가로 선으로 똑같이 나누어 그 가운데 한 줄을 진하게 색칠하였다. 진하게 색칠한 부분은 직사각형 전체의 얼마인가?', v, c, {
          figure: partRect(b, a, c, d.int(0, c - 1)),
          explain: `색칠한 부분은 전체의 ${show(v)}이고, 진하게 색칠한 부분은 그것을 똑같이 ${josa(c, '으로/로')} 나눈 것 중의 하나이다. ${told(v, c)}이다. 색칠하지 않은 칸은 가로로 나누지 않아 칸의 크기가 다르므로 칸 수만 세면 안 된다.`
        });
      }),
      H('hard-first-wrong', '크기가 같은 분수로 바꾸어 나누는 과정에서 처음으로 잘못된 곳 찾기', '심19·20 / 기본 ①44 ②36 ③49', (d) => {
        // 함정: 잘못은 ㉠(분자에만 곱하여 크기가 달라짐), ㉡(분자를 나누면서 분모까지 나눔 — 약분처럼 보인다), ㉢(가분수를 대분수로 잘못 고침) 가운데 한 곳이고, 그 뒤는 잘못된 수로 바르게 이어 간다.
        //  줄마다 「크기가 같은가」「나눈 것은 분자뿐인가」를 정확히 대야 찾는다. 끝의 값만 견주어서는 어느 줄이 처음 잘못인지 알 수 없다.
        //  보기: ㉠은 분모와 분자에 같은 수를 곱했는지 따지지 않은 아이가 지나치고, ㉡은 분모와 분자를 함께 나누는 것을 약분으로 여기는 아이가 지나치며,
        //  ㉢은 앞의 줄을 믿고 끝의 대분수만 고쳐 보는 아이가 고른다.
        const at = d.int(0, 2), [a, b, c] = d.until(() => { const b = d.int(2, 5), c = d.int(2, 4); return [d.int(b * c + 1, 39), b, c]; }, ([x, y, z]) => gcd(x, y) === 1 && gcd(x, z) === 1 && x * z <= 99 && y !== z), v = V(0, a, b);
        const A = a * c, Bd = at === 0 ? b : b * c, D3 = at === 1 ? Bd / c : Bd, Wn = Math.floor(a / D3), rem = a % D3;
        const [Ws, rsd] = at !== 2 ? [Wn, rem] : Wn !== rem && Wn < D3 ? [rem, Wn] : [Wn + 1, rem];
        const why = [`분모와 분자에 같은 수를 곱해야 크기가 같은 분수가 된다. ${show(v)} = ${frac(A, b * c)}이다.`, `자연수로 나눌 때에는 분자만 나눈다. 분모까지 나누면 처음 분수와 크기가 같아진다.`, `${frac(a, D3)}${tail(a, '을/를')} 대분수로 나타내면 ${mixed(Wn, rem, D3)}이다.`][at];
        return C('다음 계산에서 처음으로 잘못된 곳의 기호는?', THREE, at, {
          figure: lines([div(v, c), tag(LAB[0]) + eq('=', frac(A, Bd), '/', c), tag(LAB[1]) + eq('=', frac(`${A} ÷ ${c}`, at === 1 ? `${Bd} ÷ ${c}` : Bd)), tag(LAB[2]) + eq('=', frac(a, D3), '=', mixed(Ws, rsd, D3))]),
          explain: `${why} 바르게 계산하면 ${show(v)} ÷ ${c} = ${frac(A, b * c)} ÷ ${c} = ${frac(`${A} ÷ ${c}`, b * c)} = ${frac(a, b * c)} = ${rs(R(a, b * c))}이다.`,
          facts: { claimed: [[`${a}*${Bd}`, A * b], [`${A}*${D3}`, a * Bd * c], [`${Ws}*${D3}+${rsd}`, a]], claimedWant: false }
        });
      }),
      H('hard-wire-perimeter', '문장제: 철사로 만든 정다각형 여러 개에서 한 개의 둘레 구하기', '기본 ③22 / 심62', (d) => {
        // 함정: 묻는 것은 「한 변」이 아니라 「한 개의 둘레」이다. 도형의 이름에서 꺼낸 변의 수로 한 번 더 나누는 아이가 걸린다(변의 수는 쓰지 않는 조건이다).
        const [shape, sides] = d.pick(SHAPES.filter((s) => s[1] !== 5)), [L, k] = d.until(() => [d.int(7, 30), d.int(2, 7)], ([x, y]) => x % y !== 0 && x > y && y !== sides);
        return divQ(`길이가 ${L} cm인 철사를 겹치지 않게 남김없이 사용하여 크기가 같은 ${shape} ${k}개를 만들었다. ${shape} 한 개의 둘레는 몇 cm인가?`, nat(L), k, {
          unit: 'cm', explain: `철사를 ${shape} ${k}개에 똑같이 나누어 썼으므로 한 개의 둘레는 ${told(nat(L), k)}(cm)이다. 한 변의 길이가 아니라 둘레를 물었으므로 변의 수로는 나누지 않는다.`
        });
      }, { standard: STD_NN }),

      // ── ② 두 번 넘게 생각해야 풀리는 문제 ──
      H('hard-wrong-any', '잘못 계산한 어떤 수를 구해 바르게 계산하기', '심39·40 / 기본 ①53 ②53 ③81', (d, n) => {
        // 문항마다 얼개가 다르다: 같은 수를 곱한 값이 분수, 다른 수를 곱한 값이 자연수(어떤 수가 분수), 다른 수로 나눈 값이 분수(어떤 수는 곱셈으로 구한다).
        if (n === 0) {
          const [v, c] = d.until(() => pfPick(d, d.pick(['plain', 'reduce']), 9, 7), ([x, y]) => (x.n * y) % x.d !== 0 && x.d * y * y / gcd(x.n * y, y * y) <= 200 && quo(x, y).q <= 72), X = toV(R(v.n * c, v.d));
          return ansQ(`어떤 수를 ${josa(c, '으로/로')} 나누어야 할 것을 잘못하여 ${josa(c, '을/를')} 곱하였더니 ${vj(X, '이/가')} 되었다. 바르게 계산한 값은?`, qdiv(qd(X, c), c), {
            explain: `(어떤 수) × ${c} = ${show(X)}이므로 어떤 수는 ${told(X, c)}이다. 바르게 계산하면 ${told(v, c)}이다.`, facts: { rule: 'wrongSame' }
          });
        }
        if (n === 1) {
          const [X, m, c] = d.until(() => [d.int(5, 40), d.int(2, 9), d.int(2, 9)], ([x, y, z]) => x % y !== 0 && y !== z && x > y && y * z / gcd(x, y * z) <= 60), some = toV(R(X, m));
          return ansQ(`어떤 수를 ${josa(c, '으로/로')} 나누어야 할 것을 잘못하여 ${josa(m, '을/를')} 곱하였더니 ${josa(X, '이/가')} 되었다. 바르게 계산한 값은?`, qdiv(qd(nat(X), m), c), {
            explain: `(어떤 수) × ${m} = ${X}이므로 어떤 수는 ${told(nat(X), m)}이다. 바르게 계산하면 ${told(some, c)}이다.`, facts: { rule: 'wrongOther' }
          });
        }
        const [X, m, c] = d.until(() => { const b = d.int(3, 9); return [V(d.int(1, 5), coTop(d, b), b), d.int(2, 6), d.int(2, 9)]; }, ([x, y, z]) => y !== z && top(x) * y <= 120 && (top(x) * y) % (x.d * z) !== 0 && x.d * z / gcd(top(x) * y, x.d * z) <= 60 && gcd(y, x.d) === 1), some = toV(R(top(X) * m, X.d));
        return ansQ(`어떤 수를 ${josa(c, '으로/로')} 나누어야 할 것을 잘못하여 ${josa(m, '으로/로')} 나누었더니 ${vj(X, '이/가')} 되었다. 바르게 계산한 값은?`, qdiv(qtimes(q(X), m), c), {
          explain: `(어떤 수) ÷ ${m} = ${show(X)}이므로 어떤 수는 ${show(X)} × ${m} = ${show(some)}이다. 바르게 계산하면 ${told(some, c)}이다.`, facts: { rule: 'wrongDivide' }
        });
      }, { count: 3 }),
      H('hard-balance', '양쪽이 식인 등식의 □', '심25 / 기본 ②52', (d) => {
        const [v, c, k] = d.until(() => { const [x, y] = mxPick(d, d.pick(['top', 'reduce', 'over']), 9, 9, 9); return [x, y, d.int(2, 6)]; }, ([x, y, z]) => y !== z && quo(x, y * z).q <= 72), mid = toV(quo(v, c));
        return ansQ('□ 안에 알맞은 수는?', qdiv(qd(v, c), k), {
          figure: eq(box(), '*', k, '=', show(v), '/', c),
          explain: `${told(v, c)}이다. □ × ${k} = ${show(mid)}이므로 □ = ${told(mid, k)}이다.`
        });
      }),
      H('hard-between', '두 (분수)÷(자연수)의 몫 사이에 있는 자연수', '심27 / 기본 ①55', (d) => {
        const rows = d.until(() => [d.bool() ? ifPick(d, d.pick(['plain', 'reduce', 'over']), 6) : mxPick(d, d.pick(['plain', 'reduce']), 6, 6, 9), mxPick(d, 'over', 20, 6, 6)], ([p, s]) => { const x = quo(p[0], p[1]), y = quo(s[0], s[1]), gap = Math.floor(y.p / y.q) - Math.floor(x.p / x.q); return gap >= 2 && gap <= 5 && top(s[0]) <= 90 && p[1] !== s[1]; });
        const [x, y] = rows.map(([v, c]) => quo(v, c)), lo = Math.floor(x.p / x.q) + 1, hi = Math.floor(y.p / y.q), list = Array.from({ length: hi - lo + 1 }, (_, i) => lo + i), xs = rows.map(([v, c]) => qd(v, c));
        return N('□ 안에 들어갈 수 있는 자연수는 모두 몇 개인가?', list.length, {
          unit: '개', figure: lines([eq(show(rows[0][0]), '/', rows[0][1], '<', box(), '<', show(rows[1][0]), '/', rows[1][1])]),
          explain: `${told(rows[0][0], rows[0][1])}, ${told(rows[1][0], rows[1][1])}이다. □는 ${rs(x)}보다 크고 ${rs(y)}보다 작은 자연수이므로 ${list.join(', ')}의 ${list.length}개이다.`,
          facts: { digit: { template: `${one(xs[0])}<□<${one(xs[1])}`, lo: 1, hi: hi + 2, ask: 'count' }, rule: 'betweenFn' }
        });
      }),
      H('hard-between-top', '두 몫 사이에 있는 분수의 분자(□)', '기본 ②47 ③56 / 심28', (d) => {
        // 두 몫을 □가 든 분수의 분모와 같게 고쳐 분자끼리 견준다.
        const m = d.until(() => { const b = d.int(3, 9), c = d.int(2, 5), L = b * c, lo = coTop(d, b), hi = d.int(lo + 3, lo + 5); return { low: [V(0, lo, b), c], L, lo, hi, ups: formsOf(R(hi, L)) }; }, (x) => x.hi < x.L && x.L <= 45 && x.ups.some(([, c]) => c !== x.low[1]));
        const up = d.pick(m.ups.filter(([, c]) => c !== m.low[1])), list = Array.from({ length: m.hi - m.lo - 1 }, (_, i) => m.lo + 1 + i), xs = [qd(m.low[0], m.low[1]), qd(up[0], up[1])];
        return N('□ 안에 들어갈 수 있는 자연수는 모두 몇 개인가?', list.length, {
          unit: '개', figure: lines([eq(show(m.low[0]), '/', m.low[1], '<', frac(box(), m.L), '<', show(up[0]), '/', up[1])]),
          explain: `${told(m.low[0], m.low[1])}, ${told(up[0], up[1])}이다. 분모가 ${m.L}${tail(m.L, '이/가')} 되도록 고치면 ${frac(m.lo, m.L)} ${LT} ${frac('□', m.L)} ${LT} ${frac(m.hi, m.L)}이다. □는 ${list.join(', ')}의 ${list.length}개이다.`,
          facts: { digit: { template: `${one(xs[0])}<□/${m.L}<${one(xs[1])}`, lo: 1, hi: m.hi + 2, ask: 'count' }, rule: 'betweenTop' }
        });
      }),
      H('hard-cards-proper', '수 카드 3장으로 몫이 가장 큰 (진분수)÷(자연수) 만들기', '심32 / 기본 ①56', (d) => {
        // 「가장 큰 진분수를 가장 작은 수로 나눈다」고 하면 틀리는 수만 고른다(x/y 가 y/z 보다 크다). 몫의 분모는 분모와 나누는 수의 곱이라는 계산 원리로 자리를 정한다.
        const [x, y, z] = d.until(() => d.shuffle([2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3).sort((p, s) => p - s), ([p, s, t]) => p * t > s * s && gcd(s, t) === 1);
        return ansQ('수 카드 3장을 □ 안에 한 번씩 모두 넣어 (진분수) ÷ (자연수)를 만들려고 한다. 몫이 가장 클 때의 몫은?', { num: String(y), dens: [z, x], P: y, D: z * x }, {
          figure: cards(d.shuffle([x, y, z])) + eq(frac(box(), box()), '/', box()),
          explain: `(진분수) ÷ (자연수)의 몫은 분자는 그대로이고 분모는 분모와 자연수의 곱이다. 분자에 놓지 않은 두 수는 어디에 놓아도 곱이 같다. 분자에 큰 수를 놓을수록 분자는 커지고 남은 두 수의 곱은 작아지므로 몫이 크다. 진분수의 분자에는 가장 큰 수 ${josa(z, '을/를')} 놓을 수 없으므로 ${josa(y, '을/를')} 놓는다. ${frac(y, z)} ÷ ${x} = ${frac(y, `${z} × ${x}`)} = ${rs(R(y, z * x))}이다.`
        });
      }),
      H('hard-cards-mixed', '수 카드 4장으로 몫이 가장 큰(작은) (대분수)÷(자연수) 만들기', '심34 / 기본 ③61', (d) => {
        const [w, x, y, z] = d.until(() => d.shuffle([2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4).sort((p, s) => p - s), (list) => gcd(list[1], list[2]) === 1), big = d.bool(), v = big ? V(z, x, y) : V(w, x, y), c = big ? w : z;
        return divQ(`수 카드 4장을 □ 안에 한 번씩 모두 넣어 (대분수) ÷ (자연수)를 만들려고 한다. 몫이 가장 ${big ? '클' : '작을'} 때의 몫은?`, v, c, {
          figure: cards(d.shuffle([w, x, y, z])) + eq(mixed(box(), box(), box()), '/', box()),
          explain: `몫이 가장 ${big ? '크려면' : '작으려면'} 나누는 수는 가장 ${big ? '작은' : '큰'} 수 ${c}이고, 나누어지는 수는 남은 세 수로 만든 가장 ${big ? '큰' : '작은'} 대분수 ${show(v)}이어야 한다. ${told(v, c)}이다.`
        });
      }),
      H('hard-combine-share', '문장제: 더하거나 덜어 낸 다음 똑같이 나누기', '심47·48·49 / 기본 ①65 ②61 ③73', (d, n) => {
        // 문항마다 얼개가 다르다: 두 양을 합친 뒤 나누기, 쓰고 남은 양을 나누기, 빈 상자의 무게를 빼고 한 개의 무게 구하기.
        if (n === 0) {
          const m = d.until(() => { const b = d.int(3, 8), t = d.int(1, 3); return { f1: V(0, coTop(d, b), b), f2: V(0, coTop(d, b * t), b * t), c: d.int(2, 6) }; }, (x) => { const s = qadd(q(x.f1), q(x.f2), '+'); return key(x.f1) !== key(x.f2) && !whole(s) && R(s.P, s.D * x.c).q <= 72 && x.f2.d <= 16; });
          const s = qadd(q(m.f1), q(m.f2), '+'), sum = toV(R(s.P, s.D));
          return ansQ(`길이가 ${show(m.f1)} m인 리본과 ${show(m.f2)} m인 리본을 겹치지 않게 이어 붙인 다음 똑같이 ${m.c}도막으로 잘랐다. 한 도막의 길이는 몇 m인가?`, qdiv(s, m.c), {
            unit: 'm', explain: `이어 붙인 리본의 길이는 ${show(m.f1)} + ${show(m.f2)} = ${show(sum)}(m)이다. ${told(sum, m.c)}이다.`
          });
        }
        const m = d.until(() => { const b = d.int(3, 9); return { v: V(d.int(1, 6), coTop(d, b), b), f: V(0, coTop(d, b), b), c: d.int(2, 9) }; }, (x) => { const s = qadd(q(x.v), q(x.f), '-'); return !whole(s) && x.v.n !== x.f.n && R(s.P, s.D * x.c).q <= 60 && R(s.P, s.D * x.c).q > 1; });
        const s = qadd(q(m.v), q(m.f), '-'), left = toV(R(s.P, s.D));
        if (n === 1) return ansQ(`주스 ${show(m.v)} L 가운데 ${show(m.f)} L를 마시고, 남은 주스를 병 ${m.c}개에 똑같이 나누어 담았다. 병 한 개에 담은 주스는 몇 L인가?`, qdiv(s, m.c), { unit: 'L', explain: `남은 주스는 ${show(m.v)} − ${show(m.f)} = ${show(left)}(L)이다. ${told(left, m.c)}이다.` });
        return ansQ(`무게가 같은 공 ${m.c}개가 들어 있는 상자의 무게는 ${show(m.v)} kg이고, 빈 상자의 무게는 ${show(m.f)} kg이다. 공 한 개의 무게는 몇 kg인가?`, qdiv(s, m.c), { unit: 'kg', explain: `공 ${m.c}개의 무게는 ${show(m.v)} − ${show(m.f)} = ${show(left)}(kg)이다. ${told(left, m.c)}이다.` });
      }, { count: 3 }),
      H('hard-gather-share', '문장제: 여러 묶음을 모은 다음 똑같이 나누기', '심52 / 기본 ①64 ②62 ③74', (d) => {
        const [v, k, c] = d.until(() => { const b = d.int(2, 7); return [V(d.int(0, 2), coTop(d, b), b), d.int(2, 6), d.int(2, 9)]; }, ([x, y, z]) => y !== z && z >= 3 && x.w <= 1 && (top(x) * y) % (x.d * z) !== 0 && R(top(x) * y, x.d * z).q <= 48 && top(x) * y * 2 <= 3 * x.d * z && (x.w > 0 || x.n > 1)), total = toV(R(top(v) * k, v.d));
        return ansQ(`한 병에 ${show(v)} L씩 들어 있는 우유 ${k}병을 ${c}일 동안 날마다 똑같이 나누어 남김없이 마셨다. 하루에 마신 우유는 몇 L인가?`, qdiv(qtimes(q(v), k), c), {
          unit: 'L', explain: `우유는 모두 ${show(v)} × ${k} = ${show(total)}(L)이다. ${told(total, c)}이다.`
        });
      }),
      H('hard-share-some', '문장제: 똑같이 나눈 것 가운데 몇 몫의 양', '심53 / 기본 ③75', (d) => {
        const [v, c, k] = d.until(() => { const c = d.int(3, 8), x = forC(d, c, 'any', 60); return [x, c, d.int(2, c - 1)]; }, ([x, y, z]) => gcd(y, z) === 1 && (top(x) * z) % (x.d * y) !== 0), piece = toV(quo(v, c)), used = R(top(v) * k, v.d * c);
        return ansQ(`길이가 ${show(v)} m인 리본을 똑같이 ${c}도막으로 잘라, 그 가운데 ${k}도막을 선물을 포장하는 데 사용하였다. 사용한 리본은 모두 몇 m인가?`, qtimes(qd(v, c), k), {
          unit: 'm', explain: `한 도막의 길이는 ${told(v, c)}(m)이다. ${k}도막의 길이는 ${show(piece)} × ${k} = ${rs(used)}(m)이다.`
        });
      }),
      H('hard-share-again', '문장제: 나눈 한 몫을 다시 똑같이 나누기', '심54 / 기본 ②62·63', (d) => {
        const [v, c] = d.until(() => { const c = d.int(2, 6); return [forC(d, c, 'any', 40), c]; }, ([x, y]) => quo(x, 2 * y).q <= 72), p = d.pick(NAMES), piece = toV(quo(v, c));
        return ansQ(`길이가 ${show(v)} m인 끈을 똑같이 ${c}도막으로 자른 다음, 그 가운데 한 도막을 ${name(p, '과/와')} 동생이 똑같이 나누어 가졌다. ${name(p, '이/가')} 가진 끈은 몇 m인가?`, qdiv(qd(v, c), 2), {
          unit: 'm', explain: `한 도막의 길이는 ${told(v, c)}(m)이다. 두 사람이 똑같이 나누어 가지므로 ${told(piece, 2)}이다.`, facts: { unseen: [2] }
        });
      }),
      H('hard-part-then-share', '문장제: 몇 분의 몇만큼을 잘라 내어 똑같이 나누기', '기본 ①59 ③74 / 심52', (d) => {
        // 「L m의 a/b」(곱셈)과 「똑같이 c도막」(나눗셈)이 한 문장에 섞여 있다. a/b m를 c도막으로 나누는 것으로 읽으면 틀린다.
        const [L, f, c] = d.until(() => { const b = d.int(3, 9); return [d.int(2, 9), V(0, coTop(d, b), b), d.int(2, 6)]; }, ([x, y, z]) => (x * y.n) % (y.d * z) !== 0 && R(x * y.n, y.d * z).q <= 60 && x !== z), cut = toV(R(L * f.n, f.d));
        return ansQ(`길이가 ${L} m인 끈의 ${vj(f, '을/를')} 잘라 내어 똑같이 ${c}도막으로 나누었다. 한 도막의 길이는 몇 m인가?`, { num: `${L}*${f.n}`, dens: [f.d, c], P: L * f.n, D: f.d * c }, {
          unit: 'm', explain: `잘라 낸 끈은 ${L} m의 ${show(f)}이므로 ${L} × ${show(f)} = ${show(cut)}(m)이다. ${told(cut, c)}이다.`
        });
      }),
      H('hard-same-wire', '문장제: 같은 철사로 만든 다른 정다각형의 한 변의 길이', '심61 / 기본 ①71 ②67', (d) => {
        const [s1, n1, s2, n2] = d.pick([['정삼각형', 3, '정사각형', 4], ['정사각형', 4, '정삼각형', 3], ['정오각형', 5, '정사각형', 4], ['정삼각형', 3, '정오각형', 5], ['정사각형', 4, '정오각형', 5], ['정육각형', 6, '정사각형', 4]]);
        const v = d.until(() => { const b = d.int(2, 9); return V(d.int(0, 3), coTop(d, b), b); }, (x) => (top(x) * n1) % (x.d * n2) !== 0 && R(top(x) * n1, x.d * n2).q <= 60 && (x.w > 0 || x.n > 1)), round = toV(R(top(v) * n1, v.d));
        return ansQ(`한 변의 길이가 ${show(v)} m인 ${s1}을 만든 철사를 모두 펴서, 겹치지 않게 남김없이 사용하여 ${s2} 하나를 만들었다. 이 ${s2}의 한 변의 길이는 몇 m인가?`, qdiv(qtimes(q(v), n1), n2), {
          unit: 'm', explain: `철사의 길이는 ${s1}의 둘레와 같으므로 ${show(v)} × ${n1} = ${show(round)}(m)이다. ${s2}의 변은 ${n2}개이므로 ${told(round, n2)}이다.`, facts: { unseen: [n1, n2] }
        });
      }),
      H('hard-wire-side', '문장제: 철사로 만든 정다각형 여러 개의 한 변의 길이', '심62 / 기본 ①71', (d) => {
        const [shape, sides] = d.pick(SHAPES.filter((s) => s[1] !== 5)), [v, k] = d.until(() => { const b = d.int(2, 9); return [V(d.int(1, 6), coTop(d, b), b), d.int(2, 5)]; }, ([x, y]) => y !== sides && quo(x, y * sides).q <= 60 && gcd(top(x), y) > 1), each = toV(quo(v, k));
        return ansQ(`길이가 ${show(v)} m인 철사를 겹치지 않게 남김없이 사용하여 크기가 같은 ${shape} ${k}개를 만들었다. ${shape}의 한 변의 길이는 몇 m인가?`, qdiv(qd(v, k), sides), {
          unit: 'm', explain: `${shape} 한 개를 만드는 데 쓴 철사는 ${told(v, k)}(m)이다. ${shape}의 변은 ${sides}개이므로 ${told(each, sides)}이다.`, facts: { unseen: [sides] }
        });
      }),
      H('hard-ticks', '두 자연수 사이를 똑같이 나눈 수직선의 눈금 읽기', '심30', (d) => {
        // 두 수의 차를 칸 수로 나누어 한 칸의 크기를 구한 다음 왼쪽 수에 더한다. 칸 수는 그림에서 센다.
        const [left, gap, parts] = d.until(() => [d.int(1, 12), d.int(1, 5), d.int(3, 8)], ([, y, z]) => y < z && gcd(y, z) === 1), right = left + gap;
        return ansQ(`수직선에서 ${josa(left, '과/와')} ${right} 사이를 똑같이 나누었다. ㉠이 나타내는 수를 대분수로 나타내시오.`, { num: `(${left}*${parts}+${right}-${left})`, dens: [parts], P: left * parts + gap, D: parts }, {
          figure: gapLine(left, right, parts),
          explain: `${josa(left, '과/와')} ${right}의 차 ${josa(gap, '을/를')} 똑같이 ${parts}칸으로 나누었으므로 한 칸은 ${gap} ÷ ${parts} = ${frac(gap, parts)}이다. ㉠은 ${left}에서 한 칸 더 간 수이므로 ${mixed(left, gap, parts)}이다.`
        });
      }, { standard: STD_NN }),
      H('hard-cells', '똑같이 나눈 도형에서 색칠한 여러 칸의 넓이', '심69 / 기본 ①73 ②66 ③72', (d) => {
        // 색칠한 칸을 흩어 놓았다. 나눈 칸 수와 색칠한 칸 수를 그림에서 세어, 한 칸의 넓이를 구한 다음 칸 수만큼 곱한다.
        const [cols, rows] = d.pick([[4, 2], [5, 2], [3, 3], [4, 3]]), parts = cols * rows, k = d.until(() => d.int(2, parts - 3), (x) => gcd(x, parts) === 1), cells = d.until(() => d.shuffle(Array.from({ length: parts }, (_, i) => i)).slice(0, k).sort((x, y) => x - y), (list) => list.some((x, i) => i > 0 && x - list[i - 1] > 1));
        const v = d.until(() => forC(d, parts, 'mixed', 60), (x) => (top(x) * k) % (x.d * parts) !== 0 && gcd(top(x), parts) > 1), piece = toV(quo(v, parts)), area = R(top(v) * k, v.d * parts);
        return ansQ(`넓이가 ${show(v)} cm²인 직사각형을 그림과 같이 똑같이 나누어 몇 칸을 색칠하였다. 색칠한 부분의 넓이는 몇 cm²인가?`, qtimes(qd(v, parts), k), {
          unit: 'cm²', figure: cellGrid(cols, rows, cells),
          explain: `직사각형을 똑같이 ${parts}칸으로 나누었으므로 한 칸의 넓이는 ${told(v, parts)}(cm²)이다. 색칠한 칸은 ${k}칸이므로 ${show(piece)} × ${k} = ${rs(area)}(cm²)이다.`
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
