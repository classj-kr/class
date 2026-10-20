// 5학년 2학기 2단원 분수의 곱셈 — 잘못된 계산, 곱의 크기 비교, 조건에 맞는 수의 곱, 문장제, 도형, 실력 문항.
// 단원 틀과 싣는 기준, 뺀 것과 까닭은 5-2-2a.js 에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2, ③n = 기본꼴_3, 심n = 심화꼴.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 ①의 장치는 이 잘못을 가진 아이가 걸리게 만들었다)
//  - 곱하면 언제나 커진다고 여긴다. 1보다 작은 수를 곱하면 작아지고, 1을 곱하면 그대로이며, 가분수·대분수를 곱하면 커진다는 것을 곱하는 수와 1의 크기로 가리지 못한다.
//    거꾸로 「분수를 곱하면 작아진다」고만 외워 가분수를 곱해도 작아진다고 한다.
//  - (분수)×(자연수)에서 자연수를 분모에 곱하거나 분모와 분자에 모두 곱한다.
//  - 대분수를 가분수로 고치지 않은 채 약분하거나, 자연수 부분끼리·분수 부분끼리만 곱한다(2 1/3 × 1 1/2 = 2 1/6). 넓이 그림에서 네 부분 가운데 두 부분을 빠뜨리는 것과 같다.
//  - 「~의 몇 분의 몇」에서 기준이 되는 양을 놓친다: 「3/4 m」와 「끈의 3/4」을 같은 것으로 읽고, 「남은 것의 몇 분의 몇」을 「전체의 몇 분의 몇」으로 읽으며,
//    전체가 다른 두 양을 분수의 크기만으로 견준다. 겹쳐 색칠한 그림에서 겹친 부분이 「전체의」 얼마인지와 「색칠한 부분의」 얼마인지를 가르지 못한다.
//  - 「사용한 양」을 묻는지 「남은 양」을 묻는지 가리지 않고 곱한 값을 그대로 답한다.
//  - 단위분수는 분모가 클수록 작다는 것을 잊고 분모의 곱이 큰 쪽을 크다고 한다. 곱이 꼭 자연수로 떨어질 때 「그보다 작은 자연수」에 그 수를 넣어 센다.
//
// 실력에는 ① 문제의 상황·그림·수에 함정이 있어 뜻을 정확히 대야 풀리는 문제와 ② 두 번 넘게 생각해야 풀리는 문제(남은 것의 몇 분의 몇, 곱한 뒤 더하거나 덜어 내기,
// 시간을 분수로 고쳐 곱하기, 어떤 수를 구해 바르게 계산하기, 두 곱 사이의 □, 변을 바꾼 도형의 넓이)만 실었다. 기본에서 하는 곱셈 한 번을 고르기로 바꾼 것은 싣지 않았다.
// 문장제는 얼개마다 한 번씩 싣는다: 같은 양이 여러 번(진분수·대분수·전체의 얼마씩·일주일), 자연수 양의 몇 분의 몇(자연수·분수), 대분수 배, 분수 양의 몇 분의 몇,
//   부분의 부분, 세 번 거듭한 부분, 자연수 양의 부분의 부분, 단위량, 몇 배의 몇 배, 값과 사람 수, 빨라지는 시계, 단위 바꾸기 / (실력) 남은 양, 「m」와 「~의」, 처음의, 전체가 다른 양,
//   나머지의 몇 분의 몇(전체의 얼마·양·끝에 남은 양), 두 사람의 몫 견주기, 부분을 구해 더하기, 나누어 주고 남은 양, 두 수도, 시간을 분수로, 숨은 수, 양초의 처음 길이.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, nick, box, frac, mixed, lines, numbers, cards, N, C, F } = B.kit;
  const STD = '6수01-09';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  // 실력 문항. 기본 자료에서만 나온 꼴은 ref 를 '기본 ②52' 처럼 적는다.
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: ref.startsWith('기본 ') ? '수집본 기본 자료(' + ref.slice(3) + ')' : '수집본 심화 자료(' + ref + ')', make }, more || {});
  const LAB = ['㉠', '㉡', '㉢', '㉣'], THREE = LAB.slice(0, 3);
  const SIGNS = ['&gt;', '=', '&lt;'], GT = '&gt;', LT = '&lt;';
  const gcd = (x, y) => (y ? gcd(y, x % y) : x), lcm = (x, y) => x / gcd(x, y) * y;
  const tail = (n, pair) => josa(n, pair).slice(String(n).length);
  const SG = { '+': '+', '-': '−', '*': '×', '=': '=', '>': GT, '<': LT };
  const ex = (html) => '<span class="mb-expr">' + html + '</span>';
  const eq = (...parts) => ex(parts.map((p) => (SG[p] ? '<i>' + SG[p] + '</i>' : p)).join(' '));
  const par = (...parts) => '(' + parts.map((p) => (SG[p] ? '<i>' + SG[p] + '</i>' : p)).join(' ') + ')';
  const tag = (label) => '<span class="mb-tag mb-tag-short">' + label + '</span>';
  const tagged = (list, tags) => lines(list.map((html, i) => tag((tags || LAB)[i]) + html));
  const versus = (left, right) => `<div class="mb-versus">${left}<span class="mb-ring"></span>${right}</div>`;

  // ── 수 하나(5-2-2a.js 와 같다) ──
  const V = (w, n, d) => ({ w, n, d: n ? d : 1 });
  const nat = (w) => V(w, 0, 1);
  const W = (v, w) => V(w, v.n, v.d);
  const show = (v) => (v.n === 0 ? String(v.w) : v.w ? mixed(v.w, v.n, v.d) : frac(v.n, v.d));
  const vj = (v, pair) => show(v) + tail(v.n === 0 ? v.w : v.n, pair);
  const top = (v) => v.w * v.d + v.n;
  const R = (p, q) => { const g = gcd(Math.abs(p), q) || 1; return { p: p / g, q: q / g }; };
  const val = (v) => R(top(v), v.d);
  const cmp = (x, y) => x.p * y.q - y.p * x.q;
  const mul = (vs) => vs.reduce((r, v) => R(r.p * top(v), r.q * v.d), R(1, 1));
  const toV = (r) => (r.q === 1 ? nat(r.p) : V(Math.floor(r.p / r.q), r.p % r.q, r.q));
  const res = (vs) => show(toV(mul(vs)));
  const said = (vs) => vs.map(show).join(' × ');
  const parts = (vs) => vs.reduce((out, v, i) => out.concat(i ? ['*', show(v)] : [show(v)]), []);
  const times = (vs) => eq(...parts(vs));
  const key = (v) => v.w + ' ' + v.n + '/' + v.d;
  const sgn = (x, y) => (cmp(x, y) > 0 ? 0 : cmp(x, y) === 0 ? 1 : 2);
  const SGN = (x, y) => SIGNS[sgn(x, y)];
  // 두 값의 차가 k 이하인가
  const near = (x, y, k) => Math.abs(cmp(x, y)) <= k * x.q * y.q;
  const distinct = (vals) => vals.every((p, i) => vals.every((s, j) => i === j || cmp(p, s) !== 0));
  const allNear = (vals, k) => vals.every((p) => vals.every((s) => near(p, s, k)));
  const shares = (p, s) => p.some((x) => s.some((y) => key(x) === key(y)));
  const apart = (rows) => rows.every((p, i) => rows.every((s, j) => i >= j || !shares(p, s)));

  // ── 검사가 다시 셈하는 식 ──
  // 식의 값을 (분자 식)/(분모 식)으로 적는다. 문제에 적힌 수로만 적는다(대분수 2 3/7 은 (2*7+3)).
  const imp = (v) => (v.n === 0 ? String(v.w) : v.w ? `(${v.w}*${v.d}+${v.n})` : String(v.n));
  const q = (v) => ({ num: imp(v), dens: v.n ? [v.d] : [], P: top(v), D: v.d });
  const qmul = (x, y) => ({ num: x.num + '*' + y.num, dens: x.dens.concat(y.dens), P: x.P * y.P, D: x.D * y.D });
  // 두 식의 합(s: '+')·차(s: '-'): 분모들의 곱으로 통분한 분자
  const qadd = (x, y, s) => ({ num: '(' + [x.num].concat(y.dens).join('*') + s + [y.num].concat(x.dens).join('*') + ')', dens: x.dens.concat(y.dens), P: x.P * y.D + (s === '+' ? 1 : -1) * y.P * x.D, D: x.D * y.D });
  const qof = (vs) => vs.map(q).reduce(qmul);
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
  const ans = (text, vs, o) => ansQ(text, qof(vs), o);
  const isWhole = (x) => x.P % x.D === 0;
  // 여러 식의 값을 견줄 때 검사가 다시 셈하는 정수 식: 식마다 분자에 다른 식들의 분모를 모두 곱한다. scaledValues 는 그 값, allD 는 분모를 모두 곱한 수.
  const scaled = (xs) => xs.map((x, i) => xs.filter((_, j) => j !== i).reduce((list, y) => list.concat(y.dens), [x.num]).join('*'));
  const scaledValues = (xs) => xs.map((x, i) => xs.filter((_, j) => j !== i).reduce((m, y) => m * y.D, x.P));
  const allD = (xs) => xs.reduce((m, x) => m * x.D, 1);

  // ── 풀이 글 ──
  function cancel(tops, dens) {
    const ns = tops.slice(), ds = dens.slice();
    for (let i = 0; i < ns.length; i += 1) for (let j = 0; j < ds.length; j += 1) { const g = gcd(ns[i], ds[j]); ns[i] /= g; ds[j] /= g; }
    return [ns, ds];
  }
  const product = (list) => { const keep = list.filter((x) => x !== 1); return keep.length ? keep.join(' × ') : '1'; };
  // 곱셈의 차례: 처음 식, (대분수가 있으면) 가분수로 고친 식, 분자끼리·분모끼리 모은 식, 약분한 식, 결과, 대분수.
  function told(vs) {
    const out = [said(vs)], ns = vs.map(top), ds = vs.filter((v) => v.n).map((v) => v.d), [n2, d2] = cancel(ns, ds), r = mul(vs);
    if (vs.some((v) => v.w && v.n)) out.push(vs.map((v) => (v.n ? frac(top(v), v.d) : String(v.w))).join(' × '));
    out.push(frac(ns.join(' × '), ds.join(' × ')));
    if (n2.join() !== ns.join()) out.push(d2.every((x) => x === 1) ? product(n2) : frac(product(n2), product(d2)));
    out.push(r.q === 1 ? String(r.p) : frac(r.p, r.q));
    if (r.q !== 1 && r.p > r.q) out.push(show(toV(r)));
    return out.filter((s, i) => i === 0 || s !== out[i - 1]).join(' = ');
  }

  // ── 수 고르기(5-2-2a.js 와 같다) ──
  const coTop = (d, den, lo) => d.until(() => d.int(lo || 1, den - 1), (v) => gcd(v, den) === 1);
  const properAny = (d, lo, hi, minTop) => { const b = d.int(lo, hi); return V(0, coTop(d, b, b > 2 ? minTop : 1), b); };
  const mixedAny = (d, wMax, lo, hi) => { const b = d.int(lo, hi); return V(d.int(1, wMax), coTop(d, b), b); };
  const FN = {
    plain: (a, b, c) => gcd(b, c) === 1 && a * c < b,
    over: (a, b, c) => a >= 2 && gcd(b, c) === 1 && a * c > b,
    reduce: (a, b, c) => a >= 2 && gcd(b, c) > 1 && c % b !== 0 && a * c > b,
    reduceProper: (a, b, c) => gcd(b, c) > 1 && a * c < b,
    natural: (a, b, c) => a >= 2 && c % b === 0
  };
  function fnPick(d, kind, bMax, cMax) {
    const [a, b, c] = d.until(() => { const b = d.int(3, bMax || (kind === 'reduceProper' ? 24 : 15)); return [coTop(d, b), b, d.int(2, cMax || (kind === 'natural' ? 30 : 12))]; }, ([x, y, z]) => FN[kind](x, y, z));
    return [V(0, a, b), nat(c)];
  }
  const MN = {
    plain: (a, b, c) => gcd(b, c) === 1 && a * c < b,
    carry: (a, b, c) => gcd(b, c) === 1 && a * c > b,
    reduce: (a, b, c) => gcd(b, c) > 1 && c % b !== 0,
    natural: (a, b, c) => c % b === 0
  };
  function mnPick(d, kind, wMax, bMax, cMax) {
    const [w, a, b, c] = d.until(() => { const b = d.int(2, bMax || 12); return [d.int(1, wMax || 5), coTop(d, b), b, d.int(2, cMax || 9)]; }, ([w, x, y, z]) => MN[kind](x, y, z) && (w * y + x) * z / gcd(y, z) <= 150);
    return [V(w, a, b), nat(c)];
  }
  function ffPick(d, kind) {
    const hi = kind === 'once' || kind === 'twice' ? 16 : 9;
    return d.until(() => { const b = d.int(2, hi), e = d.int(2, hi); return [V(0, coTop(d, b, b > 2 ? 2 : 1), b), V(0, coTop(d, e, e > 2 ? 2 : 1), e)]; }, ([x, y]) => {
      const cuts = (gcd(x.n, y.d) > 1 ? 1 : 0) + (gcd(y.n, x.d) > 1 ? 1 : 0);
      return x.d !== y.d && x.n > 1 && y.n > 1 && cuts === (kind === 'plain' ? 0 : kind === 'once' ? 1 : 2);
    });
  }
  function mmPick(d, shape, cut, whole) {
    const one = (kind) => { const b = d.int(2, kind === 'M' ? 9 : 12), n = coTop(d, b, kind === 'P' && b > 2 ? 2 : 1); return kind === 'M' ? V(d.int(1, 5), n, b) : V(0, n, b); };
    return d.until(() => [one(shape[0]), one(shape[1])], ([x, y]) => {
      const r = mul([x, y]), cuts = gcd(top(x), y.d) > 1 || gcd(top(y), x.d) > 1;
      return (r.q === 1) === Boolean(whole) && (cut == null || cuts === cut) && x.d !== y.d && r.q <= 60 && r.p <= 40 * r.q && r.p <= 150 && top(x) <= 40 && top(y) <= 40 && top(x) * top(y) <= (cuts ? 400 : 130);
    });
  }
  // 차례 고르기 보기: 바른 차례 하나와 틀린 차례 셋
  const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  function orderChoice(d, vals, names, desc) {
    const right = [0, 1, 2].sort((p, s) => (desc ? cmp(vals[s], vals[p]) : cmp(vals[p], vals[s]))), id = (o) => o.join();
    const list = d.shuffle(d.shuffle(ORDERS.filter((o) => id(o) !== id(right))).slice(0, 3).concat([right]));
    return { list, right, options: list.map((o) => o.map((i) => names[i]).join(', ')), answer: list.findIndex((o) => id(o) === id(right)) };
  }
  const best = (vals, big) => vals.reduce((at, v, i) => ((big ? cmp(v, vals[at]) > 0 : cmp(v, vals[at]) < 0) ? i : at), 0);

  // ── 그림 ──
  const svg = (cls, w, h, label, body) => `<svg class="${cls}" style="vertical-align:middle" viewBox="0 0 ${w} ${h}" width="${Math.round(w)}" role="img" aria-label="${label}">${body}</svg>`;
  // 띠 하나: 똑같이 parts 칸으로 나누어 앞의 on 칸을 색칠한다.
  function band(count, on) {
    const pw = 204 / count; let out = '';
    for (let i = 0; i < count; i += 1) out += `<rect class="mb-piece${i < on ? ' is-on' : ''}" x="${(2 + i * pw).toFixed(2)}" y="2" width="${pw.toFixed(2)}" height="24"/>`;
    return svg('mb-pieces', 208, 28, `띠를 똑같이 ${count}칸으로 나누어 ${on}칸을 색칠`, out);
  }
  // 가로 cols 칸, 세로 rows 칸으로 똑같이 나눈 정사각형. fill(가로 자리, 세로 자리)이 칸의 빛깔을 돌려준다.
  function areaGrid(cols, rows, fill, label, size) {
    const S = size || 120, cw = S / cols, rh = S / rows; let out = '';
    for (let r = 0; r < rows; r += 1) for (let c = 0; c < cols; c += 1) out += `<rect class="mb-piece" style="fill:${fill(c, r)}" x="${(2 + c * cw).toFixed(2)}" y="${(2 + r * rh).toFixed(2)}" width="${cw.toFixed(2)}" height="${rh.toFixed(2)}"/>`;
    return svg('mb-pieces', S + 4, S + 4, label, out);
  }
  const WHITE = '#fff', DARK = '#3b82f6', YELLOW = '#fde68a', SKY = '#bfdbfe', BOTH = '#34d399';
  // 그림 속 분수(가로줄 위아래로 분자와 분모)와 길이 글
  const sfrac = (x, y, n, den) => `<text class="mb-km-label" style="font-size:14px" x="${x}" y="${y - 4}" text-anchor="middle">${n}</text><line x1="${x - 7}" y1="${y}" x2="${x + 7}" y2="${y}" style="stroke:#1f2933;stroke-width:1.2"/><text class="mb-km-label" style="font-size:14px" x="${x}" y="${y + 14}" text-anchor="middle">${den}</text>`;
  const stext = (x, y, value, size) => `<text class="mb-km-label" style="font-size:${size || 12}px" x="${x}" y="${y}" text-anchor="middle">${value}</text>`;
  // 가로가 (w1 + a/b) m, 세로가 (w2 + c/e) m인 직사각형을 자연수 부분과 분수 부분에서 갈라 네 부분으로 나눈 그림. 부분마다 ㉠~㉣을 적는다.
  function splitRect(w1, a, b, w2, c, e) {
    const x0 = 62, y0 = 44, cw = [128, 62], rh = [72, 50], X = [x0, x0 + cw[0], x0 + cw[0] + cw[1]], Y = [y0, y0 + rh[0], y0 + rh[0] + rh[1]], FILLS = ['#fef3c7', '#dbeafe', '#dcfce7', '#fce7f3'];
    let out = '';
    [[0, 0], [1, 0], [0, 1], [1, 1]].forEach(([i, j], k) => { out += `<rect x="${X[i]}" y="${Y[j]}" width="${cw[i]}" height="${rh[j]}" style="fill:${FILLS[k]};stroke:#1f2933;stroke-width:1.2"/>` + stext(X[i] + cw[i] / 2, Y[j] + rh[j] / 2 + 6, LAB[k], 16); });
    out += stext(X[0] + cw[0] / 2, y0 - 14, `${w1} m`, 14) + sfrac(X[1] + cw[1] / 2 - 9, y0 - 20, a, b) + stext(X[1] + cw[1] / 2 + 11, y0 - 14, 'm', 14);
    out += stext(x0 - 28, Y[0] + rh[0] / 2 + 5, `${w2} m`, 14) + sfrac(x0 - 38, Y[1] + rh[1] / 2, c, e) + stext(x0 - 18, Y[1] + rh[1] / 2 + 6, 'm', 14);
    return svg('mb-pieces', X[2] + 8, Y[2] + 8, `직사각형을 네 부분으로 나눈 그림: 가로는 ${w1} m와 ${a}/${b} m로, 세로는 ${w2} m와 ${c}/${e} m로 나뉜다. ㉠은 가로 ${w1} m에 세로 ${w2} m, ㉡은 가로 ${a}/${b} m에 세로 ${w2} m, ㉢은 가로 ${w1} m에 세로 ${c}/${e} m, ㉣은 가로 ${a}/${b} m에 세로 ${c}/${e} m인 부분`, out);
  }

  const CALC = '다음을 계산하시오.';

  // ── 잘못된 계산 살펴보기 ──
  B.addTypes('5-2-2', 'check', [
    T('check-why', '잘못 계산한 까닭 고르기', '①37 ②8·9·30 ③47·48 심10·11', (d, n) => {
      // 문항마다 잘못이 다르다: 자연수를 분모에 곱함, 대분수를 가분수로 고치기 전에 약분함, 자연수 부분끼리·분수 부분끼리 곱함.
      const WHY = [['자연수를 분자가 아니라 분모에 곱하였다.', 0], ['대분수를 가분수로 나타내기 전에 약분하였다.', 1], ['자연수 부분끼리, 분수 부분끼리 따로 곱하였다.', 2], ['대분수의 분수 부분에만 자연수를 곱하였다.', 3]];
      let figure, vs, why;
      if (n === 0) {
        const [f, k] = d.until(() => fnPick(d, 'over'), ([x, y]) => gcd(x.n, y.w) === 1); vs = [f, k];
        figure = lines([eq(show(f), '*', k.w), eq('=', frac(f.n, `${f.d} × ${k.w}`), '=', frac(f.n, f.d * k.w))]);
        why = '(진분수)×(자연수)는 분모는 그대로 두고 분자와 자연수를 곱한다.';
      } else if (n === 1) {
        const [v, k] = d.until(() => mnPick(d, 'reduce', 4, 10, 10), ([x, y]) => { const g = gcd(x.d, y.w); return x.n < x.d / g && y.w / g >= 2; });
        const g = gcd(v.d, k.w), wv = V(v.w, v.n, v.d / g), c2 = k.w / g, P = top(wv) * c2; vs = [v, k];
        figure = lines([eq(show(v), '*', k.w, '=', show(wv), '*', c2), eq('=', frac(top(wv), wv.d), '*', c2, '=', frac(P, wv.d), '=', show(toV(R(P, wv.d))))]);
        why = '대분수는 가분수로 나타낸 다음에 약분해야 한다.';
      } else {
        const [x, y] = d.until(() => mmPick(d, 'MM', null, false), ([p, s]) => p.d <= 6 && s.d <= 6), r = R(x.n * y.n, x.d * y.d); vs = [x, y];
        figure = lines([eq(show(x), '*', show(y)), eq('=', par(x.w, '*', y.w), '+', par(frac(x.n, x.d), '*', frac(y.n, y.d))), eq('=', x.w * y.w, '+', frac(r.p, r.q), '=', mixed(x.w * y.w, r.p, r.q))]);
        why = '대분수의 곱셈은 대분수를 가분수로 나타내어 계산해야 한다.';
      }
      const rows = d.shuffle(WHY);
      return C('다음은 잘못 계산한 것이다. 잘못 계산한 까닭을 바르게 말한 것은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1] === n), {
        figure, explain: `${why} 바르게 계산하면 ${told(vs)}이다.`, facts: { truth: rows.map((row) => row[1] === n), want: true }
      });
    }, { count: 3 }),
    T('check-value', '잘못된 계산을 바르게 고치기', '①37 ②8·9·30 ③47·48 심10', (d, n) => {
      // 문항마다 잘못이 다르다: (자연수)×(진분수)에서 분모에 곱함, (자연수)×(대분수)에서 대분수인 채로 약분함, 분수 부분에만 곱함, 분모와 분자에 모두 곱함.
      const TEXT = '다음은 잘못 계산한 것이다. 바르게 계산한 값은?';
      if (n === 0) {
        const [f, k] = d.until(() => fnPick(d, 'over'), ([x, y]) => gcd(x.n, y.w) === 1), vs = [k, f];
        return ans(TEXT, vs, { figure: lines([eq(k.w, '*', show(f)), eq('=', frac(f.n, `${k.w} × ${f.d}`), '=', frac(f.n, k.w * f.d))]), explain: `(자연수)×(진분수)는 분모는 그대로 두고 자연수와 분자를 곱한다. ${told(vs)}이다.` });
      }
      if (n === 1) {
        const [v, k] = d.until(() => mnPick(d, 'reduce', 4, 10, 10), ([x, y]) => { const g = gcd(x.d, y.w); return x.n < x.d / g && y.w / g >= 2; });
        const g = gcd(v.d, k.w), wv = V(v.w, v.n, v.d / g), c2 = k.w / g, P = top(wv) * c2, vs = [k, v];
        return ans(TEXT, vs, { figure: lines([eq(k.w, '*', show(v), '=', c2, '*', show(wv)), eq('=', c2, '*', frac(top(wv), wv.d), '=', frac(P, wv.d), '=', show(toV(R(P, wv.d))))]), explain: `대분수는 가분수로 나타낸 다음에 약분해야 한다. ${told(vs)}이다.` });
      }
      if (n === 2) {
        const [v, k] = mnPick(d, 'carry', 4, 9, 6), s = v.n * k.w, vs = [v, k];
        return ans(TEXT, vs, { figure: lines([eq(show(v), '*', k.w, '=', mixed(v.w, `${v.n} × ${k.w}`, v.d)), eq('=', mixed(v.w, s, v.d), '=', mixed(v.w + Math.floor(s / v.d), s % v.d, v.d))]), explain: `자연수 부분에도 자연수를 곱해야 한다. ${told(vs)}이다.` });
      }
      const [v, k] = mnPick(d, d.bool() ? 'plain' : 'carry', 3, 8, 5), t = top(v), vs = [v, k];
      return ans(TEXT, vs, { figure: lines([eq(show(v), '*', k.w, '=', frac(t, v.d), '*', k.w), eq('=', frac(`${t} × ${k.w}`, `${v.d} × ${k.w}`), '=', frac(t * k.w, v.d * k.w))]), explain: `(분수)×(자연수)는 분모는 그대로 두고 분자에만 자연수를 곱한다. ${told(vs)}이다.` });
    }, { count: 4 }),
    T('check-where', '처음으로 잘못된 곳 찾기', '①37 ②30 심10·11', (d) => {
      // (대분수)×(대분수)의 계산. 잘못은 ㉠(가분수로 잘못 고침), ㉡(약분하면서 분모만 나눔), ㉢(대분수로 잘못 고침) 가운데 한 곳이고, 그 뒤는 잘못된 수로 바르게 이어 간다.
      const at = d.int(0, 2);
      const m = d.until(() => {
        const [x, y] = mmPick(d, 'MM', true, false), t1 = top(x), t2 = top(y), t1s = at === 0 ? x.w * x.n + x.d : t1, done = cancel([t1s, t2], [x.d, y.d]), ns = at === 1 ? [t1, t2] : done[0], ds = done[1];
        return { x, y, t1, t2, t1s, ns, ds, P: ns[0] * ns[1], Q: ds[0] * ds[1] };
      }, (v) => v.P > v.Q && v.P % v.Q !== 0 && v.P <= 120 && (at !== 0 || (v.x.w >= 2 && v.t1s !== v.t1)) && (at !== 1 || v.Q < v.x.d * v.y.d) && v.x.d <= 8 && v.y.d <= 8);
      const { x, y, t1, t2, t1s, ns, ds, P, Q } = m, Wn = Math.floor(P / Q), rem = P % Q, rs = at === 2 && Q - rem !== rem ? Q - rem : rem, Ws = at === 2 && rs === rem ? Wn + 1 : Wn;
      const why = [`${vj(x, '을/를')} 가분수로 나타내면 ${frac(t1, x.d)}이다.`, '약분할 때에는 분모와 분자를 같은 수로 나누어야 한다.', `${frac(P, Q)}${tail(P, '을/를')} 대분수로 나타내면 ${mixed(Wn, rem, Q)}이다.`][at];
      return C('다음 계산에서 처음으로 잘못된 곳의 기호는?', THREE, at, {
        figure: lines([eq(show(x), '*', show(y)), tag(LAB[0]) + eq('=', frac(t1s, x.d), '*', frac(t2, y.d)), tag(LAB[1]) + eq('=', frac(`${ns[0]} × ${ns[1]}`, `${ds[0]} × ${ds[1]}`)), tag(LAB[2]) + eq('=', frac(P, Q), '=', mixed(Ws, rs, Q))]),
        explain: `${why} 바르게 계산하면 ${told([x, y])}이다.`,
        facts: { claimed: [[`${x.w}*${x.d}+${x.n}`, t1s], [`${t1s}*${t2}*${ds[0]}*${ds[1]}`, ns[0] * ns[1] * x.d * y.d], [`${Ws}*${Q}+${rs}`, P]], claimedWant: false }
      });
    }),
    T('check-wrong-pick', '계산이 잘못된 것 고르기', '①36 ②38 ③31 심12', (d) => {
      // 네 식 가운데 하나만 틀리다. 틀린 값은 그 계산에서 흔한 잘못(분모에 곱함, 분수 부분에 곱하지 않음, 분자만 약분함, 자연수 부분끼리·분수 부분끼리 곱함)으로 구한 값이다.
      const made = d.until(() => {
        const r0 = fnPick(d, 'over', 9, 9), r1 = mnPick(d, 'plain', 3, 9, 6).reverse(), r2 = ffPick(d, 'once'), r3 = mmPick(d, 'MM', null, false);
        const [f, k] = r0, [c, v] = r1, [x, y] = r2, [p, s] = r3, g1 = gcd(x.n, y.d), g2 = gcd(y.n, x.d);
        return { rows: [r0, r1, r2, r3], wrong: [R(f.n, f.d * k.w), R(c.w * v.w * v.d + v.n, v.d), R(x.n / g1 * (y.n / g2), x.d * y.d), R(p.w * s.w * p.d * s.d + p.n * s.n, p.d * s.d)] };
      }, (v) => v.wrong.every((w, i) => cmp(w, mul(v.rows[i])) !== 0) && v.rows[3][0].d <= 6 && v.rows[3][1].d <= 6);
      const bad = d.int(0, 3), saids = made.rows.map((row, i) => (i === bad ? made.wrong[i] : mul(row)));
      return C('계산이 잘못된 것은?', made.rows.map((row, i) => eq(...parts(row), '=', show(toV(saids[i])))), bad, {
        explain: `바르게 계산하면 ${told(made.rows[bad])}이다. 나머지는 바르게 계산하였다.`,
        facts: { claimed: made.rows.map((row, i) => { const x = qof(row); return [`${x.num}*${saids[i].q}`, saids[i].p * x.D]; }), claimedWant: false }
      });
    }),
    T('check-cancel', '약분을 바르게 한 것 고르기', '①35 ②11', (d) => {
      // 틀린 것: 분자와 자연수를 약분한 것, 분모만 나누고 자연수는 그대로 둔 것
      const [a, b, c] = d.until(() => { const b = d.pick([4, 6, 8, 9, 10, 12, 14, 15]); return [coTop(d, b, 2), b, d.int(4, 12)]; }, ([x, y, z]) => gcd(x, z) > 1 && gcd(y, z) > 1 && z / gcd(y, z) >= 2 && z / gcd(x, z) >= 2 && z % y !== 0);
      const g1 = gcd(a, c), g2 = gcd(b, c), rows = d.shuffle([[a, b / g2, c / g2, true], [a / g1, b, c / g1], [a, b / g2, c]]), hit = rows.findIndex((row) => row[3]);
      return C('곱하기 전에 약분하려고 한다. 약분을 바르게 한 것은?', THREE, hit, {
        figure: tagged(rows.map(([x, y, z]) => eq(frac(a, b), '*', c, '=', frac(x, y), '*', z))),
        explain: `분모 ${josa(b, '과/와')} 자연수 ${josa(c, '을/를')} 각각 ${josa(g2, '으로/로')} 나누어 약분한 ${LAB[hit]}이 바르다. 분자와 자연수는 약분할 수 없고, 분모만 나누면 크기가 달라진다.`,
        facts: { claimed: rows.map(([x, y, z]) => [`${x}*${z}*${b}`, a * c * y]), claimedWant: true }
      });
    }),
    T('check-forms-mixed', '(대분수)×(자연수)와 계산 결과가 다른 식 찾기', '①34 ②7 ③29·32 심18', (d) => {
      // 틀린 식: 분수 부분에 자연수를 곱하지 않은 것, 자연수 부분에 자연수를 곱하지 않은 것, 자연수 부분과 분수 부분을 곱한 것 가운데 하나
      const [v, k] = mnPick(d, d.bool() ? 'plain' : 'carry', 4, 9, 3), w = v.w, a = v.n, b = v.d, c = k.w, t = top(v), f = frac(a, b), fx = `${a}/${b}`;
      const sum = Array.from({ length: c }, () => show(v)).reduce((out, part, i) => out.concat(i ? ['+', part] : [part]), []);
      const wrong = d.pick([[eq(par(w, '*', c), '+', f), `${w}*${c}+${fx}`], [eq(w, '+', par(f, '*', c)), `${w}+${fx}*${c}`], [eq(par(w, '*', f), '+', par(f, '*', c)), `${w}*${fx}+${fx}*${c}`]]);
      const rows = d.shuffle([[eq(par(w, '*', c), '+', par(f, '*', c)), `${w}*${c}+${fx}*${c}`], [eq(frac(t, b), '*', c), `${t}/${b}*${c}`], [eq(...sum), Array.from({ length: c }, () => `(${w}+${fx})`).join('+')], [wrong[0], wrong[1], true]]);
      return C(`${show(v)} × ${josa(c, '과/와')} 계산 결과가 다른 것은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[2]), {
        explain: `${show(v)} × ${josa(c, '은/는')} ${vj(v, '을/를')} ${c}번 더한 것이고, 가분수 ${frac(t, b)}${tail(t, '으로/로')} 고쳐 곱하거나 자연수 부분 ${josa(w, '과/와')} 분수 부분 ${f}에 각각 ${josa(c, '을/를')} 곱하여 더한 것과 같다. 계산 결과는 ${res([v, k])}이다.`,
        facts: { choose: { exprs: rows.map((row) => row[1]), rule: 'odd' } }
      });
    })
  ]);

  // ── 곱의 크기 비교하기 ──
  B.addTypes('5-2-2', 'comp', [
    T('comp-one-sign', '곱과 곱해지는 수의 크기 비교', '①26 ②32 ③23 심20', (d, n) => {
      // 첫째 문항은 자연수에, 둘째 문항은 진분수에 곱한다. 곱하는 수는 진분수, 대분수, (첫째 문항은) 1 가운데 하나이다.
      const pick = d.int(0, 4), b = d.int(3, 9), m = pick === 0 && n === 0 ? nat(1) : pick <= 2 ? V(0, coTop(d, b), b) : V(d.int(1, 3), coTop(d, b), b);
      const S = n === 0 ? nat(d.int(3, 15)) : d.until(() => properAny(d, 3, 9), (v) => v.d !== m.d), rows = d.bool() ? [[S], [S, m]] : [[S, m], [S]], vals = rows.map(mul);
      return C('계산하지 않고 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, sgn(vals[0], vals[1]), {
        figure: versus(times(rows[0]), times(rows[1])),
        explain: m.n === 0 ? '어떤 수에 1을 곱하면 계산 결과는 그 수와 같다.' : `곱하는 수 ${vj(m, '은/는')} 1보다 ${m.w ? '크므로' : '작으므로'} 계산 결과는 ${show(S)}보다 ${m.w ? '크다' : '작다'}.`,
        facts: { choose: { exprs: scaled(rows.map(qof)), rule: 'compare' }, rule: ['oneNat', 'oneFrac'][n] }
      });
    }, { count: 2 }),
    T('comp-shared', '같은 수가 있는 두 곱을 계산하지 않고 비교하기', '①26 ②33 ③29 심16', (d, n) => {
      let rows, why;
      if (n === 0) {
        // 곱해지는 수가 같고 곱하는 수만 다르다(단위분수 둘, 분모가 같은 진분수 둘, 대분수와 진분수). 다섯 번에 한 번은 곱하는 순서만 바꾼 식이다.
        const kind = d.int(0, 4), S = d.bool() ? nat(d.int(4, 15)) : properAny(d, 3, 9, 2);
        const [x, y] = d.until(() => {
          if (kind >= 3) return d.shuffle([mixedAny(d, 2, 2, 9), properAny(d, 3, 9)]);
          if (kind === 2) { const b = d.int(5, 11); return [V(0, d.int(1, b - 1), b), V(0, d.int(1, b - 1), b)]; }
          return [V(0, 1, d.int(2, 9)), V(0, 1, d.int(2, 9))];
        }, ([p, s]) => cmp(val(p), val(s)) !== 0 && key(p) !== key(S) && key(s) !== key(S) && (kind !== 2 || (gcd(p.n, p.d) === 1 && gcd(s.n, s.d) === 1)));
        if (kind === 0) { rows = [[S, x], [x, S]]; why = '두 수를 바꾸어 곱해도 계산 결과는 같다.'; }
        else { rows = [[S, x], [S, y]]; why = `두 식 모두 ${show(S)}에 곱하므로 곱하는 수가 클수록 계산 결과가 크다. ${show(x)} ${SGN(val(x), val(y))} ${show(y)}이다.`; }
      } else {
        // 한 식은 다른 식에 진분수나 대분수를 한 번 더 곱한 것이다.
        const [a, b, c] = d.until(() => [properAny(d, 3, 9, 2), properAny(d, 3, 9, 2), d.bool() ? properAny(d, 2, 7) : mixedAny(d, 2, 2, 7)], (list) => new Set(list.map((v) => v.d)).size === 3);
        rows = d.bool() ? [[a, b, c], [a, b]] : [[a, b], [a, b, c]];
        why = `${said([a, b])}에 1보다 ${c.w ? '큰' : '작은'} 수 ${vj(c, '을/를')} 한 번 더 곱한 식의 계산 결과가 더 ${c.w ? '크다' : '작다'}.`;
      }
      const vals = rows.map(mul);
      return C(n === 0 ? '두 식에 같은 수가 있다. 계산하지 않고 크기를 비교할 때, ○ 안에 알맞은 것은?' : '한 식은 다른 식에 수를 한 번 더 곱한 것이다. 계산하지 않고 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, sgn(vals[0], vals[1]), {
        figure: versus(times(rows[0]), times(rows[1])), explain: why,
        facts: { choose: { exprs: scaled(rows.map(qof)), rule: 'compare' }, rule: ['sharedFactor', 'sharedMore'][n] }
      });
    }, { count: 2 }),
    T('comp-above-pick', '곱하는 수를 보고 기준보다 큰(작은) 곱 고르기', '①27 ②32 ③24 심20', (d) => {
      // 큰 것을 물으면 대분수를 곱한 식 하나만, 작은 것을 물으면 진분수를 곱한 식 하나만 답이다. 1을 곱한 식은 어느 쪽에도 들지 않는다.
      const c = d.int(4, 15), big = d.bool();
      const rows = d.shuffle(d.until(() => (big ? [properAny(d, 3, 9), properAny(d, 3, 9), nat(1), mixedAny(d, 3, 2, 9)] : [mixedAny(d, 3, 2, 9), mixedAny(d, 3, 2, 9), nat(1), properAny(d, 3, 9)]), (list) => new Set(list.map(key)).size === 4));
      const L = rows.reduce((x, v) => lcm(x, v.d), 1), hit = rows.findIndex((m) => m.n > 0 && (big ? m.w >= 1 : m.w === 0));
      return C(`계산하지 않고 알아보려고 한다. 계산 결과가 ${c}보다 ${big ? '큰' : '작은'} 것은?`, rows.map((m) => times([nat(c), m])), hit, {
        explain: `${c}에 1보다 ${big ? '큰' : '작은'} 수를 곱해야 계산 결과가 ${c}보다 ${big ? '크다' : '작다'}. 곱하는 수 가운데 1보다 ${big ? '큰' : '작은'} 수는 ${show(rows[hit])}뿐이다. 1을 곱하면 계산 결과는 ${josa(c, '과/와')} 같다.`,
        facts: { only: { values: rows.map((m) => top(m) * (L / m.d)), test: big ? 'atLeast' : 'atMost', target: big ? L + 1 : L - 1 } }
      });
    }),
    T('comp-multiplier-pick', '곱하면 계산 결과가 커지는(작아지는) 수 고르기', '②32 심20', (d) => {
      const A = d.bool() ? mixedAny(d, 8, 2, 9) : properAny(d, 3, 11, 2), big = d.bool();
      const rows = d.shuffle(d.until(() => (big ? [properAny(d, 3, 9), properAny(d, 3, 9), nat(1), mixedAny(d, 3, 2, 9)] : [mixedAny(d, 3, 2, 9), mixedAny(d, 3, 2, 9), nat(1), properAny(d, 3, 9)]), (list) => new Set(list.map(key).concat([key(A)])).size === 5));
      const L = rows.reduce((x, v) => lcm(x, v.d), 1), hit = rows.findIndex((m) => m.n > 0 && (big ? m.w >= 1 : m.w === 0));
      return C(`${show(A)}에 어떤 수를 곱하려고 한다. 계산 결과가 ${show(A)}보다 ${big ? '커지는' : '작아지는'} 수는?`, rows.map((m) => ex(show(m))), hit, {
        explain: `1보다 ${big ? '큰' : '작은'} 수를 곱해야 계산 결과가 처음 수보다 ${big ? '커진다' : '작아진다'}. 1보다 ${big ? '큰' : '작은'} 수는 ${show(rows[hit])}뿐이다.`,
        facts: { only: { values: rows.map((m) => top(m) * (L / m.d)), test: big ? 'atLeast' : 'atMost', target: big ? L + 1 : L - 1 } }
      });
    }),
    T('comp-sign-two', '두 곱의 크기 비교', '①25 ②34 ③22 심15', (d, n) => {
      // 첫째 문항은 (진분수)×(자연수)끼리(계산 결과가 같을 때도 있다), 둘째 문항은 (대분수)×(대분수)끼리, 셋째 문항은 (대분수)×(자연수)와 (진분수)×(자연수). 두 결과가 가까워 계산해 보아야 알 수 있다.
      const gen = [() => [fnPick(d, d.pick(['over', 'reduce', 'natural'])), fnPick(d, d.pick(['over', 'reduce']))], () => [mmPick(d, 'MM', true, false), mmPick(d, 'MM', true, false)], () => d.shuffle([mnPick(d, d.pick(['carry', 'reduce']), 3, 9, 9), fnPick(d, 'reduce')])][n];
      let rows = d.until(gen, ([p, s]) => { const x = mul(p), y = mul(s); return near(x, y, 1) && cmp(x, y) !== 0 && !shares(p, s) && x.p <= 30 * x.q && y.p <= 30 * y.q; });
      if (n === 0 && d.int(0, 3) === 0) {
        // 계산 결과가 같은 식: 값이 같은 (진분수)×(자연수)를 찾는다.
        const v = mul(rows[0]), same = [];
        for (let c = 2; c <= 12; c += 1) { const r = R(v.p, v.q * c); if (r.p < r.q && r.q <= 24 && r.q !== rows[0][0].d && c !== rows[0][1].w) same.push([V(0, r.p, r.q), nat(c)]); }
        if (same.length) rows = [rows[0], d.pick(same)];
      }
      const [v1, v2] = rows.map(mul);
      return C('두 식의 계산 결과를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, sgn(v1, v2), {
        figure: versus(times(rows[0]), times(rows[1])),
        explain: `${said(rows[0])} = ${res(rows[0])}, ${said(rows[1])} = ${res(rows[1])}이다. ` + (cmp(v1, v2) === 0 ? '두 계산 결과는 같다.' : `${res(rows[0])} ${SGN(v1, v2)} ${res(rows[1])}이다.`),
        facts: { choose: { exprs: scaled(rows.map(qof)), rule: 'compare' }, rule: ['signFn', 'signMm', 'signMix'][n] }
      });
    }, { count: 3 }),
    T('comp-sign-value', '곱과 자연수의 크기 비교', '①26 ②34 심15', (d) => {
      // 네 번에 한 번은 곱이 자연수로 떨어져 수와 같다.
      const equal = d.int(0, 3) === 0, row = equal ? (d.bool() ? fnPick(d, 'natural').reverse() : mnPick(d, 'natural', 3, 9, 18)) : d.pick([() => fnPick(d, 'reduce').reverse(), () => mnPick(d, 'carry', 3, 9, 6), () => fnPick(d, 'over').reverse()])();
      const v = mul(row), k = equal ? v.p : Math.floor(v.p / v.q) + d.int(0, 1), x = qof(row);
      return C('계산 결과와 수의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, sgn(v, R(k, 1)), {
        figure: versus(times(row), ex(k)),
        explain: `${told(row)}이다. ` + (equal ? '계산 결과와 수의 크기가 같다.' : `${res(row)} ${SGN(v, R(k, 1))} ${k}이다.`),
        facts: { choose: { exprs: [x.num, [String(k)].concat(x.dens).join('*')], rule: 'compare' } }
      });
    }),
    T('comp-max', '곱이 가장 큰(작은) 식 찾기', '①28 ②35 ③25 심16', (d) => {
      const rows = d.until(() => [0, 0, 0].map(() => fnPick(d, d.pick(['natural', 'reduce', 'over']), 12, 20).reverse()), (list) => { const vs = list.map(mul); return distinct(vs) && allNear(vs, 3) && apart(list); });
      const vs = rows.map(mul), big = d.bool(), hit = best(vs, big);
      return C(`계산 결과가 가장 ${big ? '큰' : '작은'} 것은?`, THREE, hit, {
        figure: tagged(rows.map(times)),
        explain: `계산 결과는 ${rows.map((row, i) => `${LAB[i]} ${res(row)}`).join(', ')}이다. 가장 ${big ? '큰' : '작은'} 것은 ${LAB[hit]}이다.`,
        facts: { choose: { exprs: scaled(rows.map(qof)), rule: big ? 'max' : 'min' } }
      });
    }),
    T('comp-order', '곱을 크기 차례로 늘어놓기', '①28 ③26 심16', (d) => {
      const rows = d.until(() => [0, 0, 0].map(() => ffPick(d, d.pick(['once', 'twice', 'plain']))), (list) => { const vs = list.map(mul); return distinct(vs) && allNear(vs, 0.4) && apart(list) && vs.reduce((x, v) => lcm(x, v.q), 1) <= 48; });
      const vs = rows.map(mul), desc = d.bool(), pick = orderChoice(d, vs, THREE, desc), L = vs.reduce((x, v) => lcm(x, v.q), 1);
      return C(`계산 결과가 ${desc ? '큰' : '작은'} 것부터 차례대로 쓴 것은?`, pick.options, pick.answer, {
        figure: tagged(rows.map(times)),
        explain: `계산 결과는 ${rows.map((row, i) => `${LAB[i]} ${res(row)}`).join(', ')}이다. 분모가 ${L}${tail(L, '이/가')} 되도록 통분하여 비교하면 ${pick.right.map((i) => res(rows[i])).join(desc ? ` ${GT} ` : ` ${LT} `)}이다.`,
        facts: { choose: { exprs: scaled(rows.map(qof)), rule: desc ? 'descending' : 'ascending', orders: pick.list } }
      });
    }),
    T('comp-unit-max', '단위분수의 곱의 크기 비교', '①28 ②35 ③25 심18', (d) => {
      const pairs = d.until(() => [0, 0, 0, 0].map(() => [d.int(2, 12), d.int(2, 12)]), (list) => new Set(list.map(([x, y]) => x * y)).size === 4 && list.every(([x, y]) => x !== y && x * y >= 12 && x * y <= 60));
      const prods = pairs.map(([x, y]) => x * y), big = d.bool(), hit = prods.indexOf(big ? Math.min(...prods) : Math.max(...prods));
      return C(`계산 결과가 가장 ${big ? '큰' : '작은'} 것은?`, LAB, hit, {
        figure: tagged(pairs.map(([x, y]) => eq(frac(1, x), '*', frac(1, y)))),
        explain: `단위분수끼리의 곱은 분자가 1이고 분모는 두 분모의 곱이다. 분모의 곱은 ${prods.map((v, i) => `${LAB[i]} ${v}`).join(', ')}이다. 단위분수는 분모가 작을수록 크므로 가장 ${big ? '큰' : '작은'} 것은 ${LAB[hit]}이다.`,
        facts: { choose: { exprs: pairs.map(([x, y]) => `1/(${x}*${y})`), rule: big ? 'max' : 'min' } }
      });
    }),
    T('comp-odd', '계산 결과가 다른 하나 찾기', '①30 ②36 심18', (d) => {
      // 두 식은 계산 결과가 같고(약분해야 같은 것이 보인다) 한 식만 다르다.
      const made = d.until(() => {
        const b = d.int(3, 9), a = coTop(d, b, 2), c = d.int(2, 9), k = d.int(2, 4), other = fnPick(d, d.pick(['over', 'reduce']), 15, 20).reverse();
        return { rows: [[nat(c), V(0, a, b)], [nat(a * k), V(0, c, b * k)], other], a, b, c, k };
      }, (m) => m.a !== m.c && gcd(m.c, m.b * m.k) === 1 && m.c < m.b * m.k && m.a * m.k <= 30 && m.b * m.k <= 30 && cmp(mul(m.rows[2]), mul(m.rows[0])) !== 0 && near(mul(m.rows[2]), mul(m.rows[0]), 2) && apart(m.rows));
      const order = d.shuffle([0, 1, 2]), rows = order.map((i) => made.rows[i]), hit = order.indexOf(2);
      return C('계산 결과가 나머지와 다른 하나는?', THREE, hit, {
        figure: tagged(rows.map(times)),
        explain: `계산 결과는 ${rows.map((row, i) => `${LAB[i]} ${res(row)}`).join(', ')}이다. ${LAB[hit]}만 다르다.`,
        facts: { choose: { exprs: rows.map(([c, f]) => `${c.w}*${f.n}/${f.d}`), rule: 'odd' } }
      });
    }),
    T('comp-natural', '계산 결과가 자연수인 식 찾기', '①31 ②37 ③28 심19', (d, n) => {
      // 첫째 문항은 (진분수)×(자연수) 셋, 둘째 문항은 (대분수)×(대분수) 셋. 자연수가 되는 것은 하나뿐이고, 나머지도 약분은 되지만 분모가 남는다.
      const rows = d.shuffle(d.until(() => (n === 0 ? [fnPick(d, 'natural'), fnPick(d, 'reduce'), d.bool() ? fnPick(d, 'reduce') : fnPick(d, 'reduce').reverse()] : [mmPick(d, 'MM', true, true), mmPick(d, 'MM', true, false), mmPick(d, 'MM', true, false)]), apart)), hit = rows.findIndex((row) => mul(row).q === 1);
      return C('계산 결과가 자연수인 것은?', THREE, hit, {
        figure: tagged(rows.map(times)),
        explain: `계산 결과는 ${rows.map((row, i) => `${LAB[i]} ${res(row)}`).join(', ')}이다. 약분하여 분모가 1이 되는 것은 ${LAB[hit]}이다.`,
        facts: { claimed: rows.map((row) => { const x = qof(row); return [`${x.num}%(${x.dens.join('*')})`, 0]; }), claimedWant: true, rule: ['naturalFn', 'naturalMm'][n] }
      });
    }, { count: 2 }),
    T('comp-target', '계산 결과가 주어진 수인 식 찾기', '③27 ②37 ①14', (d) => {
      const made = d.until(() => { const right = fnPick(d, 'natural', 12, 30), K = mul(right).p; return { K, rows: [right, fnPick(d, 'natural', 12, 30), fnPick(d, d.pick(['over', 'reduce'])), fnPick(d, 'natural', 12, 30).reverse()] }; },
        (m) => m.K >= 4 && m.K <= 24 && m.rows.slice(1).every((row) => { const v = mul(row); return cmp(v, R(m.K, 1)) !== 0 && near(v, R(m.K, 1), 6); }) && apart(m.rows));
      const order = d.shuffle([0, 1, 2, 3]), rows = order.map((i) => made.rows[i]), K = made.K;
      return C(`계산 결과가 ${K}인 것은?`, rows.map(times), order.indexOf(0), {
        explain: `${told(made.rows[0])}이다. 나머지의 계산 결과는 ${rows.filter((_, i) => i !== order.indexOf(0)).map(res).join(', ')}이다.`,
        facts: { choose: { exprs: rows.map((row) => { const f = row.find((v) => v.n), c = row.find((v) => !v.n); return `${f.n}*${c.w}/${f.d}`; }), rule: 'equals', target: K } }
      });
    }),
    T('comp-half', '곱이 1/2보다 큰 식 찾기', '③33', (d) => {
      // 세 식의 계산 결과는 모두 1/4보다 크고 3/4보다 작다. 1/2보다 큰 것은 하나뿐이다.
      const HALF = R(1, 2), mk = () => (d.int(0, 2) === 0 ? [mixedAny(d, 2, 2, 6), V(0, 1, d.int(3, 9))] : ffPick(d, d.pick(['once', 'twice', 'plain'])));
      const rows = d.until(() => [mk(), mk(), mk()], (list) => { const vs = list.map(mul); return vs.every((v) => v.p * 4 > v.q && v.p * 4 < 3 * v.q && cmp(v, HALF) !== 0) && vs.filter((v) => cmp(v, HALF) > 0).length === 1 && apart(list) && list.every(([x, y]) => x.d !== y.d); });
      const xs = rows.map(qof), hit = rows.findIndex((row) => cmp(mul(row), HALF) > 0);
      return C(`계산 결과가 ${frac(1, 2)}보다 큰 것은?`, THREE, hit, {
        figure: tagged(rows.map(times)),
        explain: `계산 결과는 ${rows.map((row, i) => `${LAB[i]} ${res(row)}`).join(', ')}이다. 분자의 2배가 분모보다 큰 ${LAB[hit]}만 ${frac(1, 2)}보다 크다.`,
        facts: { choose: { exprs: scaled(xs).map((e) => '2*' + e), rule: 'onlyAbove', target: allD(xs) } }
      });
    }),
    T('comp-match', '식과 계산 결과 짝 짓기', '①14 ③30 심13', (d) => {
      const mk = () => (d.bool() ? mnPick(d, d.pick(['carry', 'reduce']), 3, 9, 8) : mnPick(d, d.pick(['plain', 'reduce']), 3, 9, 8).reverse());
      const rows = d.until(() => [mk(), mk(), mk()], (list) => { const vs = list.map(mul); return distinct(vs) && allNear(vs, 3) && apart(list); });
      const xs = rows.map(qof), ints = scaledValues(xs), list = d.shuffle(d.shuffle(ORDERS.slice(1)).slice(0, 3).concat([ORDERS[0]]));
      return C('식과 계산 결과를 알맞게 짝 지은 것은?', list.map((o) => o.map((j, i) => `${LAB[i]} ${res(rows[j])}`).join(', ')), list.findIndex((o) => o.join() === '0,1,2'), {
        figure: tagged(rows.map(times)),
        explain: rows.map((row, i) => `${LAB[i]} ${told(row)}`).join(', ') + '이다.',
        facts: { match: { exprs: scaled(xs), options: list.map((o) => o.map((j) => ints[j])) } }
      });
    })
  ]);

  // ── 조건에 맞는 수의 곱 ──
  B.addTypes('5-2-2', 'pick', [
    T('say-of', '「~의 몇 분의 몇」을 곱셈으로 구하기', '②16 ①40 심30·40', (d, n) => {
      // 첫째 문항은 자연수의 몇 분의 몇, 둘째 문항은 분수의 몇 분의 몇.
      if (n === 0) {
        const [f, k] = fnPick(d, d.bool() ? 'over' : 'reduce'), vs = [k, f];
        return ans(`${k.w}의 ${vj(f, '은/는')} 얼마인가?`, vs, { explain: `${k.w}의 ${vj(f, '은/는')} ${k.w} × ${show(f)}이다. ${told(vs)}이다.` });
      }
      const vs = ffPick(d, d.bool() ? 'once' : 'twice');
      return ans(`어떤 수는 ${show(vs[0])}의 ${show(vs[1])}이다. 어떤 수는?`, vs, { explain: `${show(vs[0])}의 ${vj(vs[1], '은/는')} ${said(vs)}이다. ${told(vs)}이다.` });
    }, { count: 2 }),
    T('say-count', '대분수가 몇 개인 수', '②16', (d) => {
      const vs = mnPick(d, d.bool() ? 'carry' : 'reduce', 3, 9, 9);
      return ans(`${vj(vs[0], '이/가')} ${vs[1].w}개인 수는?`, vs, { explain: `${vj(vs[0], '이/가')} ${vs[1].w}개인 수는 ${said(vs)}이다. ${told(vs)}이다.` });
    }),
    T('say-times', '자연수의 대분수 배인 수', '②16 ①13 심30', (d) => {
      const vs = mnPick(d, d.bool() ? 'plain' : 'reduce', 4, 9, 12).reverse();
      return ans(`${vs[0].w}의 ${show(vs[1])}배인 수는?`, vs, { explain: `${vs[0].w}의 ${show(vs[1])}배인 수는 ${said(vs)}이다. ${told(vs)}이다.` });
    }),
    T('say-unit-product', '단위분수가 몇 개인 수끼리의 곱', '①40', (d) => {
      const [f, g] = ffPick(d, d.bool() ? 'once' : 'twice');
      return ans(`${frac(1, f.d)}이 ${f.n}개인 수와 ${frac(1, g.d)}이 ${g.n}개인 수의 곱은?`, [f, g], { explain: `${frac(1, f.d)}이 ${f.n}개인 수는 ${show(f)}, ${frac(1, g.d)}이 ${g.n}개인 수는 ${show(g)}이다. ${told([f, g])}이다.` });
    }),
    T('say-twice', '「어떤 수는 ~의 몇 배」를 이어 곱하기', '②61 심30 ①24', (d) => {
      const vs = d.until(() => [d.bool() ? properAny(d, 3, 9, 2) : mixedAny(d, 3, 2, 7), mixedAny(d, 3, 2, 7), mixedAny(d, 2, 2, 7)], (list) => { const r = mul(list), ds = list.map((v) => v.d); return r.q > 1 && r.q <= 20 && new Set(ds).size === 3 && ds.reduce((x, y) => x * y, 1) >= r.q * 6 && list.every((v) => top(v) <= 15) && r.p <= 150 && mul(list.slice(0, 2)).p <= 60; });
      const [a, b, c] = vs, mid = toV(mul([a, b]));
      return ans(`어떤 수는 ${show(a)}의 ${show(b)}배이다. 어떤 수의 ${show(c)}배인 수는?`, vs, { explain: `어떤 수는 ${told([a, b])}이다. 어떤 수의 ${show(c)}배인 수는 ${told([mid, c])}이다.` });
    }),
    T('ends-product', '가장 큰 수와 가장 작은 수의 곱', '①38 ②39 ③40 심21', (d, n) => {
      if (n === 0) {
        // 자연수 부분이 같은 수가 둘씩 있어 분수 부분을 통분해야 가장 큰 수와 가장 작은 수를 알 수 있다.
        const m = d.until(() => {
          const fs = [0, 0, 0, 0].map(() => properAny(d, 2, 9)), wLo = d.int(1, 2), wHi = wLo + d.int(1, 2), his = [W(fs[0], wHi), W(fs[1], wHi)], los = [W(fs[2], wLo), W(fs[3], wLo)];
          return { fs, his, los, hi: cmp(val(fs[0]), val(fs[1])) > 0 ? his[0] : his[1], lo: cmp(val(fs[2]), val(fs[3])) < 0 ? los[0] : los[1] };
        }, (v) => new Set(v.fs.map((f) => f.d)).size === 4 && mul([v.hi, v.lo]).q > 1 && top(v.hi) * top(v.lo) <= 160 && near(val(v.fs[0]), val(v.fs[1]), 0.34) && near(val(v.fs[2]), val(v.fs[3]), 0.34));
        return ans('네 수 가운데 가장 큰 수와 가장 작은 수의 곱은?', [m.hi, m.lo], {
          figure: numbers(d.shuffle(m.his.concat(m.los)).map(show)),
          explain: `자연수 부분이 ${m.hi.w}인 두 수의 분수 부분을 통분하여 비교하면 가장 큰 수는 ${show(m.hi)}이고, 자연수 부분이 ${m.lo.w}인 두 수를 비교하면 가장 작은 수는 ${show(m.lo)}이다. ${told([m.hi, m.lo])}이다.`
        });
      }
      // 진분수 넷: 통분하여 크기를 비교한다.
      const list = d.until(() => [0, 0, 0, 0].map(() => properAny(d, 3, 12, 2)), (vs) => distinct(vs.map(val)) && new Set(vs.map((v) => v.d)).size === 4 && allNear(vs.map(val), 0.4) && vs.reduce((x, v) => lcm(x, v.d), 1) <= 72);
      const sorted = list.slice().sort((p, s) => cmp(val(p), val(s))), lo = sorted[0], hi = sorted[3], L = list.reduce((x, v) => lcm(x, v.d), 1);
      return ans('네 분수 가운데 가장 큰 수와 가장 작은 수의 곱은?', [hi, lo], {
        figure: numbers(list.map(show)),
        explain: `분모가 ${L}${tail(L, '이/가')} 되도록 통분하면 차례대로 ${list.map((v) => frac(v.n * (L / v.d), L)).join(', ')}이다. 가장 큰 수는 ${show(hi)}, 가장 작은 수는 ${show(lo)}이다. ${told([hi, lo])}이다.`
      });
    }, { count: 2 }),
    T('pick-kinds', '수의 종류를 가려 골라 곱하기', '심21 ③39 ②39', (d, n) => {
      const improper = () => { const b = d.int(2, 7); return V(0, b + coTop(d, b), b); };
      if (n === 0) {
        // 진분수만 골라 모두 곱한다(자연수, 가분수, 대분수가 섞여 있다).
        const m = d.until(() => ({ ps: [properAny(d, 3, 10, 2), properAny(d, 2, 10), properAny(d, 3, 12, 2)], rest: [nat(d.int(2, 9)), improper(), mixedAny(d, 3, 2, 9)] }), (v) => { const r = mul(v.ps); return new Set(v.ps.concat(v.rest).map((x) => x.d)).size === 6 && r.q <= 160 && v.ps.reduce((x, y) => x * y.d, 1) >= 3 * r.q; });
        return ans('다음 수 가운데 진분수를 모두 골라 곱한 값은?', m.ps, {
          figure: numbers(d.shuffle(m.ps.concat(m.rest)).map(show)),
          explain: `진분수는 분자가 분모보다 작은 ${m.ps.map(show).join(', ')}이다. ${told(m.ps)}이다.`
        });
      }
      const vs = mnPick(d, d.bool() ? 'carry' : 'reduce', 4, 9, 9), rest = d.until(() => [properAny(d, 3, 12, 2), improper()], ([x, y]) => new Set([x.d, y.d, vs[0].d]).size === 3);
      return ans('다음 수 가운데 대분수와 자연수를 골라 곱한 값은?', vs, {
        figure: numbers(d.shuffle(vs.concat(rest)).map(show)),
        explain: `대분수는 ${show(vs[0])}, 자연수는 ${vs[1].w}이다. ${told(vs)}이다.`
      });
    }, { count: 2 }),
    T('cards-unit', '수 카드로 곱이 가장 큰(작은) 단위분수의 곱 만들기', '①41 ②44 ③42 심36', (d) => {
      const digits = d.shuffle([2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4), sorted = digits.slice().sort((x, y) => x - y), big = d.bool(), [x, y] = big ? [sorted[0], sorted[1]] : [sorted[2], sorted[3]];
      return F(`수 카드 4장 가운데 2장을 골라 □ 안에 한 번씩 넣어 곱이 가장 ${big ? '큰' : '작은'} 곱셈식을 만들었다. 이 곱셈식의 계산 결과는?`, 1, x * y, {
        anyForm: true, figure: cards(digits) + eq(frac(1, box()), '*', frac(1, box())),
        explain: `단위분수끼리의 곱은 분모의 곱이 ${big ? '작을수록 크다' : '클수록 작다'}. 가장 ${big ? '작은' : '큰'} 두 수 ${x}, ${josa(y, '을/를')} 분모에 넣으면 ${frac(1, x)} × ${frac(1, y)} = ${frac(1, x * y)}이다.`,
        facts: { calc: [['1', 0], [`${x}*${y}`, 1]] }
      });
    }),
    T('cards-proper', '수 카드로 만든 가장 큰 진분수와 가장 작은 진분수의 곱', '심35', (d) => {
      // 세 수 a < b < c 로 만드는 진분수는 a/b, a/c, b/c 이다. 가장 작은 수는 a/c 이고, 가장 큰 수는 a/b 와 b/c 를 통분하여 견주어 정한다.
      const [a, b, c] = d.until(() => d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3).sort((x, y) => x - y), ([x, y, z]) => x * z !== y * y && gcd(x, y) === 1 && gcd(x, z) === 1 && gcd(y, z) === 1);
      const hi = a * c > b * b ? V(0, a, b) : V(0, b, c), lo = V(0, a, c);
      return ans('수 카드 3장 가운데 2장을 골라 진분수를 만들려고 한다. 만들 수 있는 가장 큰 진분수와 가장 작은 진분수의 곱은?', [hi, lo], {
        figure: cards(d.shuffle([a, b, c])),
        explain: `만들 수 있는 진분수는 ${frac(a, b)}, ${frac(a, c)}, ${frac(b, c)}이다. 통분하여 비교하면 가장 큰 수는 ${show(hi)}, 가장 작은 수는 ${show(lo)}이다. ${told([hi, lo])}이다.`
      });
    }),
    T('cards-mixed-nat', '수 카드로 만든 대분수와 자연수의 곱', '③41 ②45 심34', (d) => {
      // 세 수 a < b < c 로 만드는 가장 큰 대분수는 c a/b, 가장 작은 대분수는 a b/c 이다.
      const big = d.bool(), m = d.until(() => { const [a, b, c] = d.shuffle([1, 2, 3, 4, 5, 6, 7]).slice(0, 3).sort((x, y) => x - y); return { list: [a, b, c], v: big ? V(c, a, b) : V(a, b, c), k: d.int(2, 5) }; }, (x) => gcd(x.v.n, x.v.d) === 1 && mul([x.v, nat(x.k)]).q > 1 && mul([x.v, nat(x.k)]).p <= 150 && !x.list.includes(x.k));
      const vs = [m.v, nat(m.k)], [a, , c] = m.list;
      return ans(`수 카드 3장을 한 번씩 모두 사용하여 만들 수 있는 가장 ${big ? '큰' : '작은'} 대분수와 ${m.k}의 곱은?`, vs, {
        figure: cards(d.shuffle(m.list)),
        explain: `가장 ${big ? '큰' : '작은'} 대분수는 가장 ${big ? '큰' : '작은'} 수 ${josa(big ? c : a, '을/를')} 자연수 부분에 놓은 ${show(m.v)}이다. ${told(vs)}이다.`
      });
    }),
    T('cards-mixed-two', '수 카드로 만든 가장 큰 대분수와 가장 작은 대분수의 곱', '①44 ②45 ③43 심34', (d) => {
      const m = d.until(() => { const [a, b, c] = d.shuffle([1, 2, 3, 4, 5, 6, 7]).slice(0, 3).sort((x, y) => x - y); return { list: [a, b, c], hi: V(c, a, b), lo: V(a, b, c) }; }, (x) => gcd(x.hi.n, x.hi.d) === 1 && gcd(x.lo.n, x.lo.d) === 1 && mul([x.hi, x.lo]).q > 1 && top(x.hi) * top(x.lo) <= 300);
      const [a, , c] = m.list;
      return ans('수 카드 3장을 한 번씩 모두 사용하여 대분수를 만들려고 한다. 만들 수 있는 가장 큰 대분수와 가장 작은 대분수의 곱은?', [m.hi, m.lo], {
        figure: cards(d.shuffle(m.list)),
        explain: `가장 큰 대분수는 가장 큰 수 ${josa(c, '을/를')} 자연수 부분에 놓은 ${show(m.hi)}, 가장 작은 대분수는 가장 작은 수 ${josa(a, '을/를')} 자연수 부분에 놓은 ${show(m.lo)}이다. ${told([m.hi, m.lo])}이다.`
      });
    }),
    T('box-nat', '곱과 자연수의 크기 비교(□)', '①32 ②41 ③46 심22', (d, n) => {
      // 첫째 문항은 곱보다 작은 자연수의 개수, 둘째 문항은 곱보다 작은 가장 큰 자연수, 셋째 문항은 곱보다 큰 가장 작은 자연수. 곱은 자연수로 떨어지지 않는다.
      const vs = [() => mnPick(d, d.bool() ? 'plain' : 'reduce', 3, 9, 6).reverse(), () => mnPick(d, d.bool() ? 'carry' : 'reduce', 3, 9, 6), () => d.until(() => mmPick(d, 'MM', true, false), (list) => mul(list).p <= 15 * mul(list).q)][n](), x = qof(vs), v = mul(vs), k = Math.floor(v.p / v.q), den = x.dens.join('*');
      if (n === 0) return N('□ 안에 들어갈 수 있는 자연수는 모두 몇 개인가?', k, { unit: '개', figure: eq(box(), '<', ...parts(vs)), explain: `${told(vs)}이다. □는 ${res(vs)}보다 작은 자연수이므로 1부터 ${k}까지 ${k}개이다.`, facts: { digit: { template: `□*(${den})<${x.num}`, lo: 1, hi: k + 3, ask: 'count' }, rule: 'natCount' } });
      if (n === 1) return N('□ 안에 들어갈 수 있는 자연수 가운데 가장 큰 수는?', k, { figure: eq(...parts(vs), '>', box()), explain: `${told(vs)}이다. □는 ${res(vs)}보다 작은 자연수이므로 가장 큰 수는 ${k}이다.`, facts: { digit: { template: `${x.num}>□*(${den})`, lo: 1, hi: k + 3, ask: 'max' }, rule: 'natMax' } });
      return N('□ 안에 들어갈 수 있는 자연수 가운데 가장 작은 수는?', k + 1, { figure: eq(...parts(vs), '<', box()), explain: `${told(vs)}이다. □는 ${res(vs)}보다 큰 자연수이므로 가장 작은 수는 ${k + 1}이다.`, facts: { digit: { template: `${x.num}<□*(${den})`, lo: 1, hi: k + 4, ask: 'min' }, rule: 'natMin' } });
    }, { count: 3 }),
    T('box-top', '곱보다 작은 분수의 분자(□)', '②41 심24', (d) => {
      // □가 든 분수의 분모는 곱을 기약분수로 나타낸 분모의 배수이다.
      const m = d.until(() => { const [f, g] = ffPick(d, d.bool() ? 'once' : 'twice'), r = mul([f, g]), k = d.int(1, 3); return { f, g, r, L: r.q * k, cut: r.p * k }; }, (v) => v.cut >= 3 && v.L <= 48);
      const { f, g, r, L, cut } = m;
      return N('□ 안에 들어갈 수 있는 자연수 가운데 가장 큰 수는?', cut - 1, {
        figure: eq(show(f), '*', show(g), '>', frac(box(), L)),
        explain: `${told([f, g])}이다. ` + (L === r.q ? '' : `분모가 ${L}${tail(L, '이/가')} 되도록 고치면 ${frac(cut, L)}이다. `) + `□는 ${cut}보다 작아야 하므로 가장 큰 수는 ${cut - 1}이다.`,
        facts: { digit: { template: `${f.n}*${g.n}*${L}>□*${f.d}*${g.d}`, lo: 1, hi: L, ask: 'max' }, rule: 'topMax' }
      });
    })
  ]);

  // ── 분수의 곱셈의 활용 ──
  const word = (text, vs, unit, explain, more) => ans(text, vs, Object.assign({ unit, explain }, more || {}));
  B.addTypes('5-2-2', 'word', [
    T('word-each', '문장제: 같은 양이 여러 번(진분수)', '①45 ②47 ③49 심39', (d) => {
      const vs = fnPick(d, d.bool() ? 'over' : 'reduce', 12, 9);
      return word(`주스가 한 병에 ${show(vs[0])} L씩 들어 있다. ${vs[1].w}병에 들어 있는 주스는 모두 몇 L인가?`, vs, 'L', `${show(vs[0])} L씩 ${vs[1].w}병이므로 ${told(vs)}이다.`);
    }),
    T('word-each-mixed', '문장제: 같은 양이 여러 번(대분수)', '①45 ②47 ③49·51 심39', (d) => {
      const vs = mnPick(d, d.bool() ? 'carry' : 'reduce', 4, 9, 9);
      return word(`길이가 ${show(vs[0])} m인 색 테이프 ${vs[1].w}장을 겹치지 않게 한 줄로 이어 붙였다. 이어 붙인 색 테이프의 전체 길이는 몇 m인가?`, vs, 'm', `${show(vs[0])} m씩 ${vs[1].w}장이므로 ${told(vs)}이다.`);
    }),
    T('word-each-part', '문장제: 전체의 몇 분의 몇씩 여러 번', '①45', (d) => {
      const vs = fnPick(d, d.bool() ? 'plain' : 'reduceProper', 20, 6), p = d.pick(NAMES);
      return word(`${name(p, '은/는')} 책 한 권을 날마다 전체의 ${show(vs[0])}씩 읽었다. ${name(p, '이/가')} ${vs[1].w}일 동안 읽은 양은 책 전체의 얼마인가?`, vs, '', `날마다 전체의 ${show(vs[0])}씩 ${vs[1].w}일 동안 읽었으므로 ${told(vs)}이다.`);
    }),
    T('word-each-week', '문장제: 날수를 스스로 꺼내 곱하기', '①45 ②47 심39', (d) => {
      const weeks = d.int(1, 2), days = weeks * 7, f = d.until(() => properAny(d, 3, 6), (v) => days % v.d !== 0), p = d.pick(NAMES), vs = [f, nat(days)], span = weeks === 1 ? '일주일' : '2주일';
      return word(`${name(p, '은/는')} 날마다 운동장을 ${show(f)} km씩 달린다. ${name(p, '이/가')} ${span} 동안 달리는 거리는 모두 몇 km인가?`, vs, 'km', `${span}은 ${days}일이다. ${show(f)} km씩 ${days}일 동안 달리므로 ${told(vs)}이다.`, { facts: { unseen: [days] } });
    }),
    T('word-of-nat', '문장제: 자연수 양의 몇 분의 몇(답이 자연수)', '①46 ②48 ③52 심40·55', (d) => {
      const [f, k] = fnPick(d, 'natural', 12, 60), vs = [k, f];
      return word(`색종이 ${k.w}장 가운데 ${vj(f, '을/를')} 사용하였다. 사용한 색종이는 몇 장인가?`, vs, '장', `${k.w}장의 ${vj(f, '은/는')} ${told(vs)}(장)이다.`, { kind: 'nat' });
    }),
    T('word-of-nat-frac', '문장제: 자연수 양의 몇 분의 몇(답이 분수)', '①46 ②48 ③52 심40', (d) => {
      const [f, k] = fnPick(d, d.bool() ? 'over' : 'reduce', 12, 12), vs = [k, f];
      return word(`길이가 ${k.w} m인 철사의 ${vj(f, '을/를')} 잘라 사용하였다. 사용한 철사는 몇 m인가?`, vs, 'm', `${k.w} m의 ${vj(f, '은/는')} ${told(vs)}이다.`);
    }),
    T('word-times-nat', '문장제: 자연수 양의 대분수 배', '①47 ②50 ③53 심41', (d) => {
      const [m, k] = mnPick(d, d.bool() ? 'plain' : 'reduce', 3, 9, 15), vs = [k, m], [p, s] = d.shuffle(NAMES).slice(0, 2);
      return word(`${nick(p)}의 가방의 무게는 ${k.w} kg이고, ${nick(s)}의 가방의 무게는 ${nick(p)}의 가방의 무게의 ${show(m)}배이다. ${nick(s)}의 가방의 무게는 몇 kg인가?`, vs, 'kg', `${k.w} kg의 ${show(m)}배이므로 ${told(vs)}이다.`);
    }),
    T('word-of-frac', '문장제: 분수 양의 몇 분의 몇', '①48 ②49 ③61 심40', (d, n) => {
      // 첫째 문항은 진분수 양, 둘째 문항은 대분수 양.
      if (n === 0) {
        const vs = ffPick(d, d.bool() ? 'once' : 'twice');
        return word(`찰흙 ${show(vs[0])} kg의 ${vj(vs[1], '을/를')} 떼어 그릇을 빚었다. 그릇을 빚는 데 쓴 찰흙은 몇 kg인가?`, vs, 'kg', `${show(vs[0])} kg의 ${vj(vs[1], '은/는')} ${told(vs)}이다.`);
      }
      const vs = mmPick(d, 'MP', true, false);
      return word(`물통에 물이 ${show(vs[0])} L 들어 있다. 이 물의 ${vj(vs[1], '을/를')} 화분에 주었다. 화분에 준 물은 몇 L인가?`, vs, 'L', `${show(vs[0])} L의 ${vj(vs[1], '은/는')} ${told(vs)}이다.`);
    }, { count: 2 }),
    T('word-times-mixed', '문장제: 대분수 양의 대분수 배', '②50 ③63 심41', (d) => {
      const vs = mmPick(d, 'MM', true, false);
      return word(`파란색 끈의 길이는 ${show(vs[0])} m이고, 빨간색 끈의 길이는 파란색 끈의 길이의 ${show(vs[1])}배이다. 빨간색 끈의 길이는 몇 m인가?`, vs, 'm', `${show(vs[0])} m의 ${show(vs[1])}배이므로 ${told(vs)}이다.`);
    }),
    T('word-part-part', '문장제: 부분의 부분은 전체의 얼마', '①49 ②53 ③59 심52', (d) => {
      const vs = ffPick(d, d.pick(['plain', 'once', 'twice']));
      return word(`밭 전체의 ${show(vs[0])}에 채소를 심었고, 채소를 심은 부분의 ${show(vs[1])}에는 상추를 심었다. 상추를 심은 부분은 밭 전체의 얼마인가?`, vs, '', `전체의 ${show(vs[0])} 가운데 ${show(vs[1])}이므로 ${told(vs)}이다.`);
    }),
    T('word-part3', '문장제: 세 번 거듭한 부분은 전체의 얼마', '①53 ②54 ③60 심52', (d) => {
      const vs = d.until(() => [properAny(d, 2, 8), properAny(d, 3, 9, 2), properAny(d, 2, 8)], (list) => { const r = mul(list), ds = list.map((v) => v.d); return new Set(ds).size === 3 && r.q <= 60 && ds.reduce((x, y) => x * y, 1) >= r.q * 3; });
      return word(`꽃밭 전체의 ${show(vs[0])}에 꽃을 심었다. 꽃을 심은 부분의 ${vj(vs[1], '은/는')} 튤립이고, 튤립을 심은 부분의 ${vj(vs[2], '은/는')} 노란색 튤립이다. 노란색 튤립을 심은 부분은 꽃밭 전체의 얼마인가?`, vs, '', `전체의 ${show(vs[0])} 가운데 ${show(vs[1])}, 다시 그 가운데 ${show(vs[2])}이므로 세 분수를 곱한다. ${told(vs)}이다.`);
    }),
    T('word-nat-part-part', '문장제: 자연수 양의 부분의 부분', '①54 ②54 심51', (d) => {
      const vs = d.until(() => [nat(d.int(12, 60)), properAny(d, 2, 8), properAny(d, 2, 8)], ([t, f, g]) => f.d !== g.d && (t.w * f.n) % f.d === 0 && (t.w * f.n * g.n) % (f.d * g.d) === 0 && t.w * f.n * g.n / (f.d * g.d) >= 2);
      const [t, f, g] = vs, mid = t.w * f.n / f.d;
      return word(`구슬 ${t.w}개 가운데 ${vj(f, '은/는')} 유리구슬이고, 유리구슬의 ${vj(g, '은/는')} 파란색이다. 파란색 유리구슬은 몇 개인가?`, vs, '개', `유리구슬은 ${t.w} × ${show(f)} = ${mid}(개)이고, 파란색 유리구슬은 ${mid} × ${show(g)} = ${mid * g.n / g.d}(개)이다.`, { kind: 'nat' });
    }),
    T('word-rate', '문장제: 단위 하나의 양에 분수 곱하기', '①50 ②51 ③64 심42', (d, n) => {
      // 첫째 문항은 (자연수)×(대분수), 둘째 문항은 (대분수)×(대분수).
      if (n === 0) {
        const [m, k] = mnPick(d, d.bool() ? 'plain' : 'reduce', 4, 9, 15), vs = [k, m];
        return word(`굵기가 일정한 쇠막대 1 m의 무게는 ${k.w} kg이다. 이 쇠막대 ${show(m)} m의 무게는 몇 kg인가?`, vs, 'kg', `1 m의 무게에 길이를 곱한다. ${told(vs)}이다.`);
      }
      const vs = mmPick(d, 'MM', true, false);
      return word(`한 시간에 ${show(vs[0])} km씩 걷는 빠르기로 ${show(vs[1])}시간 동안 걸었다. 걸은 거리는 몇 km인가?`, vs, 'km', `한 시간에 걷는 거리에 걸은 시간을 곱한다. ${told(vs)}이다.`);
    }, { count: 2 }),
    T('word-times-chain', '문장제: 몇 배의 몇 배', '①61 심50·56', (d) => {
      const vs = d.until(() => [nat(d.int(2, 12)), mixedAny(d, 2, 2, 8), properAny(d, 3, 9, 2)], (list) => { const r = mul(list); return r.q > 1 && r.q <= 20 && list[1].d !== list[2].d && list[1].d * list[2].d >= r.q * 3 && mul(list.slice(0, 2)).p <= 100; });
      const [a, b, c] = vs, [p, s, t] = d.shuffle(NAMES).slice(0, 3), mid = toV(mul([a, b]));
      return word(`${nick(p)}의 끈의 길이는 ${a.w} m이다. ${nick(s)}의 끈의 길이는 ${nick(p)}의 끈의 길이의 ${show(b)}배이고, ${nick(t)}의 끈의 길이는 ${nick(s)}의 끈의 길이의 ${show(c)}배이다. ${nick(t)}의 끈의 길이는 몇 m인가?`, vs, 'm', `${nick(s)}의 끈의 길이는 ${told([a, b])}(m)이고, ${nick(t)}의 끈의 길이는 ${told([mid, c])}(m)이다.`);
    }),
    T('word-price', '문장제: 대분수 배 한 값에 사람 수까지 곱하기', '②59 심50', (d) => {
      const m = d.until(() => ({ P: d.pick([800, 1000, 1200, 1500, 2000, 2400, 2500]), v: V(1, ...d.pick([[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [1, 10], [3, 10]])), k: d.int(2, 4) }), (x) => (x.P * top(x.v)) % x.v.d === 0 && x.P * top(x.v) / x.v.d * x.k <= 9999);
      const { P, v, k } = m, one = P * top(v) / v.d, vs = [nat(P), v, nat(k)];
      return word(`놀이공원의 어린이 입장료는 ${P}원이고, 어른 입장료는 어린이 입장료의 ${show(v)}배이다. 어른 ${k}명의 입장료는 모두 몇 원인가?`, vs, '원', `어른 한 명의 입장료는 ${P} × ${show(v)} = ${one}(원)이다. 어른 ${k}명의 입장료는 ${one} × ${k} = ${one * k}(원)이다.`, { kind: 'nat' });
    }),
    T('word-clock-fast', '문장제: 날마다 빨라지는 시계가 가리키는 시각', '①52 심57', (d) => {
      const vs = d.until(() => mnPick(d, 'natural', 3, 6, 12), (list) => mul(list).p <= 30), hour = d.int(7, 10), fast = mul(vs).p;
      return word(`하루에 ${show(vs[0])}분씩 빨라지는 시계가 있다. 이 시계를 오늘 오전 ${hour}시에 정확히 맞추었다. ${vs[1].w}일이 지난 날 오전 ${hour}시에 이 시계는 오전 ${hour}시 몇 분을 가리키는가?`, vs, '분', `${vs[1].w}일 동안 빨라진 시간은 ${told(vs)}(분)이다. 빨라진 시계는 ${fast}분 더 간 시각을 가리키므로 오전 ${hour}시 ${fast}분이다.`, { kind: 'nat' });
    }),
    T('unit-part', '단위를 바꾸어 답하기', '①51 ②17 ③52 심43', (d, n) => {
      // 첫째 문항은 길이·들이·무게, 둘째 문항은 시간.
      const [whole, small, base, pt] = n === 0 ? d.pick([['1 km', 'm', 1000, '는'], ['1 m', 'cm', 100, '는'], ['1 L', 'mL', 1000, '는'], ['1 kg', 'g', 1000, '은']]) : d.pick([['1시간', '분', 60, '은'], ['하루', '시간', 24, '는']]);
      const f = d.until(() => properAny(d, 2, 20), (v) => base % v.d === 0 && (v.n > 1 || d.bool())), value = base * f.n / f.d, sp = n === 0 ? ' ' : '';
      return N(`${whole}의 ${vj(f, '은/는')} 몇 ${small}인가?`, value, {
        unit: small, explain: `${whole}${pt} ${base}${sp}${small}이다. ${base} × ${show(f)} = ${value}이므로 ${value}${sp}${small}이다.`,
        facts: { calc: [[`${base}*${f.n}/${f.d}`, 0]], unseen: [base] }
      });
    }, { count: 2 }),
    T('unit-talk', '단위를 바꾸어 말한 것 가운데 잘못 말한 사람 찾기', '①51 ②17 ③54 심43', (d) => {
      // 틀린 말: 시간은 1시간을 100분으로 셈한 값, 나머지는 큰 단위를 10분의 1로 셈한 값(1 L의 3/4 을 75 mL 라고 한다).
      const KIND = [['1 L', 'mL', 1000, ' ', '는'], ['1 km', 'm', 1000, ' ', '는'], ['1 kg', 'g', 1000, ' ', '은'], ['1 m', 'cm', 100, ' ', '는'], ['1시간', '분', 60, '', '은']];
      const who = d.shuffle(NAMES).slice(0, 3), bad = d.int(0, 2);
      const rows = d.until(() => d.shuffle(KIND).slice(0, 3).map(([whole, small, base, sp, pt], i) => { const f = d.until(() => properAny(d, 2, 10), (v) => base % v.d === 0), right = base * f.n / f.d, wrong = base === 60 ? 100 * f.n / f.d : right / 10; return { whole, small, base, sp, pt, f, right, said: i === bad ? wrong : right }; }),
        (list) => list.every((r) => Number.isInteger(r.said)) && list[bad].said !== list[bad].right);
      return C('잘못 말한 사람은?', who, bad, {
        figure: lines(rows.map((r, i) => `<span class="mb-tag" style="min-width:3em">${who[i]}</span>${r.whole}의 ${vj(r.f, '은/는')} ${r.said}${r.sp}${r.small}이다.`)),
        explain: `${rows[bad].whole}${rows[bad].pt} ${rows[bad].base}${rows[bad].sp}${rows[bad].small}이다. ${rows[bad].base} × ${show(rows[bad].f)} = ${rows[bad].right}이므로 ${rows[bad].whole}의 ${vj(rows[bad].f, '은/는')} ${rows[bad].right}${rows[bad].sp}${rows[bad].small}이다.`,
        facts: { claimed: rows.map((r) => [`${r.base}*${r.f.n}/${r.f.d}`, r.said]), claimedWant: false }
      });
    }),
    T('word-talk', '자연수의 대분수만큼을 잘못 말한 사람 찾기', '③55 ①36 ②38', (d) => {
      // 틀린 말: 대분수의 자연수 부분을 빠뜨리고 분수 부분만 곱한 값(1보다 큰 수를 곱했는데 처음 양보다 작아졌다).
      const who = d.shuffle(NAMES).slice(0, 3), bad = d.int(0, 2), units = d.shuffle(['m', 'L', 'kg']);
      const rows = d.until(() => [0, 1, 2].map((i) => { const b = d.int(2, 10), m = V(d.int(1, 3), coTop(d, b), b), c = b * d.int(1, 6); return { m, c, right: c * top(m) / b, said: i === bad ? c * m.n / b : c * top(m) / b }; }), (list) => new Set(list.map((r) => r.m.d)).size === 3 && list.every((r) => r.c <= 40 && r.c >= 4));
      return C('잘못 말한 사람은?', who, bad, {
        figure: lines(rows.map((r, i) => `<span class="mb-tag" style="min-width:3em">${who[i]}</span>${r.c} ${units[i]}의 ${vj(r.m, '은/는')} ${r.said} ${units[i]}이다.`)),
        explain: `1보다 큰 수 ${vj(rows[bad].m, '을/를')} 곱하면 처음 양보다 커져야 한다. ${told([nat(rows[bad].c), rows[bad].m])}이므로 ${rows[bad].right} ${units[bad]}이다.`,
        facts: { claimed: rows.map((r) => [`${r.c}*(${r.m.w}*${r.m.d}+${r.m.n})/${r.m.d}`, r.said]), claimedWant: false }
      });
    })
  ]);

  // ── 도형에서 분수의 곱셈 ──
  B.addTypes('5-2-2', 'shape', [
    T('shape-perimeter', '정다각형의 둘레', '①65 ②66 ③50 심59', (d, n) => {
      // 첫째 문항은 한 변이 진분수, 둘째 문항은 한 변이 대분수(정사각형·마름모). 변의 수는 도형의 이름에서 꺼낸다.
      if (n === 0) {
        const [shape, sides] = d.pick([['정삼각형', 3], ['정오각형', 5], ['정육각형', 6], ['정팔각형', 8]]), f = d.until(() => properAny(d, 3, 12, 2), (v) => (sides * v.n) % v.d !== 0), vs = [f, nat(sides)];
        return word(`한 변의 길이가 ${show(f)} m인 ${shape} 모양의 꽃밭이 있다. 이 꽃밭의 둘레는 몇 m인가?`, vs, 'm', `${shape}은 길이가 같은 변이 ${sides}개이다. ${told(vs)}이다.`, { facts: { unseen: [sides] } });
      }
      const shape = d.pick(['정사각형', '마름모']), v = d.until(() => mixedAny(d, 5, 3, 9), (x) => 4 % x.d !== 0 && mul([x, nat(4)]).p <= 150), vs = [v, nat(4)];
      return word(`한 변의 길이가 ${show(v)} cm인 ${shape}의 둘레는 몇 cm인가?`, vs, 'cm', `${shape === '마름모' ? '마름모는' : '정사각형은'} 네 변의 길이가 모두 같다. ${told(vs)}이다.`, { facts: { unseen: [4] } });
    }, { count: 2 }),
    T('shape-perimeter-max', '둘레가 가장 긴 정다각형 찾기', '심60 ②47', (d) => {
      const SHAPES = [['정삼각형', 3], ['정사각형', 4], ['정오각형', 5], ['정육각형', 6]];
      const rows = d.until(() => d.shuffle(SHAPES).slice(0, 3).map(([shape, sides]) => ({ shape, sides, f: properAny(d, 3, 12, 2) })), (list) => { const vs = list.map((r) => mul([r.f, nat(r.sides)])); return distinct(vs) && allNear(vs, 1) && new Set(list.map((r) => r.f.d)).size === 3 && vs.every((v) => v.q > 1); });
      const xs = rows.map((r) => qof([r.f, nat(r.sides)])), vs = rows.map((r) => mul([r.f, nat(r.sides)])), hit = best(vs, true);
      return C('둘레가 가장 긴 것은?', THREE, hit, {
        figure: tagged(rows.map((r) => `한 변이 ${show(r.f)} m인 ${r.shape}`)),
        explain: `둘레는 ${rows.map((r, i) => `${LAB[i]} ${show(r.f)} × ${r.sides} = ${res([r.f, nat(r.sides)])}(m)`).join(', ')}이다. 가장 긴 것은 ${LAB[hit]}이다.`,
        facts: { choose: { exprs: scaled(xs), rule: 'max' }, unseen: rows.map((r) => r.sides) }
      });
    }),
    T('shape-area', '변의 길이가 분수인 도형의 넓이', '①66 ②67·68 ③66 심61·62', (d, n) => {
      // 문항마다 도형이 다르다: 직사각형, 정사각형(같은 수를 두 번 곱한다), 평행사변형(밑변과 높이).
      if (n === 0) {
        const vs = mmPick(d, 'MM', true, false);
        return word(`가로가 ${show(vs[0])} m, 세로가 ${show(vs[1])} m인 직사각형 모양의 밭의 넓이는 몇 m²인가?`, vs, 'm²', `직사각형의 넓이는 가로와 세로의 곱이다. ${told(vs)}이다.`);
      }
      if (n === 1) {
        const v = d.until(() => mixedAny(d, 3, 2, 6), (x) => top(x) <= 13), vs = [v, v];
        return word(`한 변의 길이가 ${show(v)} cm인 정사각형의 넓이는 몇 cm²인가?`, vs, 'cm²', `정사각형의 넓이는 한 변의 길이를 두 번 곱한 것이다. ${told(vs)}이다.`);
      }
      const vs = d.bool() ? mmPick(d, 'MP', true, false) : mnPick(d, d.bool() ? 'carry' : 'reduce', 5, 9, 9);
      return word(`밑변의 길이가 ${show(vs[0])} cm, 높이가 ${show(vs[1])} cm인 평행사변형의 넓이는 몇 cm²인가?`, vs, 'cm²', `평행사변형의 넓이는 밑변의 길이와 높이의 곱이다. ${told(vs)}이다.`);
    }, { count: 3 }),
    T('shape-cell', '똑같이 나눈 정사각형에서 색칠한 직사각형의 넓이', '①67 ②71', (d) => {
      const [cols, rows, a, b] = d.until(() => [d.int(3, 6), d.int(3, 6), d.int(1, 4), d.int(1, 4)], ([c, r, x, y]) => c !== r && x < c && y < r && x * y >= 2 && gcd(x, c) === 1 && gcd(y, r) === 1), vs = [V(0, a, cols), V(0, b, rows)];
      return word(`한 변의 길이가 1 m인 정사각형을 가로 ${cols}칸, 세로 ${rows}칸으로 똑같이 나누어 그림과 같이 색칠하였다. 색칠한 직사각형의 넓이는 몇 m²인가?`, vs, 'm²', `색칠한 직사각형의 가로는 ${show(vs[0])} m, 세로는 ${show(vs[1])} m이다. ${told(vs)}이다.`, {
        figure: areaGrid(cols, rows, (x, y) => (x < a && y < b ? DARK : WHITE), `정사각형을 가로 ${cols}칸, 세로 ${rows}칸으로 똑같이 나누었다. 왼쪽 세로줄 ${a}칸과 위쪽 가로줄 ${b}칸이 겹치는 칸을 색칠`)
      });
    }),
    T('shape-band-part', '똑같이 나눈 띠에서 색칠한 부분의 길이', '①72 ②72 ③58 심68', (d, n) => {
      // 첫째 문항은 길이가 자연수, 둘째 문항은 길이가 진분수. 나눈 칸 수와 색칠한 칸 수는 그림에서 읽는다.
      const count = d.int(5, 9), on = coTop(d, count, 2);
      if (n === 0) {
        const len = count * d.int(3, 9);
        return N(`길이가 ${len} cm인 막대를 그림과 같이 똑같이 나누어 색칠하였다. 색칠한 부분의 길이는 몇 cm인가?`, len * on / count, {
          unit: 'cm', figure: band(count, on), explain: `색칠한 부분은 막대의 ${frac(on, count)}이다. ${len} × ${frac(on, count)} = ${len / count} × ${on} = ${len * on / count}이므로 ${len * on / count} cm이다.`,
          facts: { calc: [[`${len}*${on}/${count}`, 0]] }
        });
      }
      const f = d.until(() => properAny(d, 3, 12, 2), (v) => v.d !== count && gcd(v.n, count) > 1), vs = [f, V(0, on, count)];
      return word(`길이가 ${show(f)} m인 색 테이프를 그림과 같이 똑같이 나누어 색칠하였다. 색칠한 부분의 길이는 몇 m인가?`, vs, 'm', `색칠한 부분은 색 테이프의 ${frac(on, count)}이다. ${told(vs)}이다.`, { figure: band(count, on) });
    }, { count: 2 })
  ]);

  // ── 실력 ──
  B.addGroup('5-2-2', {
    id: 'hard', title: '단원 종합', standard: STD,
    types: [
      // ── ① 문제의 상황·그림·수에 함정이 있어 뜻을 정확히 대야 풀리는 문제 ──
      H('hard-size-count', '계산하지 않고 기준보다 큰 곱 세기', '심20 / 기본 ①26·27 ②32', (d) => {
        // 함정: 가분수도 분수라서 곱하면 작아진다고 여기는 아이, 1을 곱한 것을 「크다」에 넣는 아이, 곱하는 순서가 바뀐 식에서 앞의 수만 보는 아이가 걸린다.
        //  곱하는 수가 1보다 큰가(가분수·대분수), 1과 같은가, 1보다 작은가를 식마다 정확히 대야 센다. 끝이 s 인 것은 곱하는 순서를 바꾸어 적는다.
        const S = d.bool() ? nat(d.int(4, 12)) : properAny(d, 5, 11, 2), plan = d.pick([['I', 'O', 'P', 'Ms'], ['I', 'O', 'Ps', 'P'], ['I', 'Ms', 'O', 'I'], ['P', 'O', 'Ps', 'Ms'], ['I', 'Is', 'P', 'O'], ['Is', 'O', 'P', 'M']]);
        const one = (code) => (code[0] === 'I' ? (() => { const b = d.int(3, 9); return V(0, b + coTop(d, b), b); })() : code[0] === 'P' ? properAny(d, 3, 9) : code[0] === 'M' ? mixedAny(d, 2, 2, 7) : nat(1));
        const rows = d.until(() => d.shuffle(plan).map((code) => ({ m: one(code), swap: code.endsWith('s') })), (list) => new Set(list.map((r) => key(r.m)).concat([key(S)])).size === 5);
        const flags = rows.map((r) => top(r.m) > r.m.d), hits = rows.map((r, i) => (flags[i] ? LAB[i] : '')).filter(Boolean);
        return N(`계산하지 않고 알아보려고 한다. 계산 결과가 ${show(S)}보다 큰 것은 모두 몇 개인가?`, hits.length, {
          unit: '개', figure: tagged(rows.map((r) => times(r.swap ? [r.m, S] : [S, r.m]))),
          explain: `${show(S)}에 1보다 큰 수를 곱한 것만 ${show(S)}보다 크다. 곱하는 순서를 바꾸어도 계산 결과는 같다. 분자가 분모보다 큰 가분수와 대분수는 1보다 크고, 1을 곱하면 크기가 그대로이다. 1보다 큰 수를 곱한 것은 ${hits.join(', ')}이다.`,
          facts: { count: flags }
        });
      }),
      H('hard-chain-order', '곱하는 수가 늘어나는 식을 계산하지 않고 차례로 늘어놓기', '기본 ①29 / 심16', (d) => {
        // 함정: 여러 번 곱할수록 계산 결과가 커진다고 여기는 아이. 1보다 작은 수는 곱할수록 작아지고, 1보다 큰 수를 곱한 것만 처음 수보다 크다.
        const [A, p, s, r] = d.until(() => [properAny(d, 4, 9, 2), properAny(d, 3, 8, 2), properAny(d, 2, 7), mixedAny(d, 2, 2, 7)], (list) => new Set(list.map((v) => v.d)).size === 4);
        // 값의 차례: A × p × s < A × p < A < A × r
        const forms = [[A], [A, p], [A, p, s], [A, r]], order = d.shuffle([0, 1, 2, 3]), rows = order.map((i) => forms[i]), at = (i) => order.indexOf(i), desc = d.bool();
        const put = (list) => { const o = list.map(at); return desc ? o.reverse() : o; }, right = put([2, 1, 0, 3]), list = d.shuffle([right, put([0, 1, 2, 3]), put([3, 0, 1, 2]), put([1, 2, 0, 3])]);
        return C(`계산하지 않고 알아보려고 한다. 계산 결과가 ${desc ? '큰' : '작은'} 것부터 차례대로 쓴 것은?`, list.map((o) => o.map((i) => LAB[i]).join(', ')), list.findIndex((o) => o.join() === right.join()), {
          figure: tagged(rows.map(times)),
          explain: `1보다 작은 수를 곱하면 작아지고, 1보다 큰 수를 곱하면 커진다. ${show(A)}에 ${vj(p, '을/를')} 곱하면 ${show(A)}보다 작아지고, 거기에 ${vj(s, '을/를')} 한 번 더 곱하면 더 작아진다. ${vj(r, '을/를')} 곱한 것만 ${show(A)}보다 크다.`,
          facts: { choose: { exprs: scaled(rows.map(qof)), rule: desc ? 'descending' : 'ascending', orders: list } }
        });
      }),
      H('hard-box-exact', '곱이 자연수로 떨어질 때 □에 들어갈 수 있는 수', '심22 / 기본 ①32 ②41', (d) => {
        // 함정: 곱이 꼭 자연수 K 로 떨어진다. 「K보다 작은 자연수」에 K를 넣어 K개라고 세는 아이가 걸린다.
        const vs = d.until(() => (d.bool() ? mnPick(d, 'natural', 3, 9, 18) : mmPick(d, 'MM', true, true)), (list) => mul(list).p >= 3 && mul(list).p <= 12), K = mul(vs).p, x = qof(vs);
        return N('□ 안에 들어갈 수 있는 자연수는 모두 몇 개인가?', K - 1, {
          unit: '개', figure: eq(...parts(vs), '>', box()),
          explain: `${told(vs)}이다. □는 ${K}보다 작아야 하므로 ${josa(K, '은/는')} 들어갈 수 없다. 1부터 ${K - 1}까지 ${K - 1}개이다.`,
          facts: { digit: { template: `${x.num}>□*(${x.dens.join('*')})`, lo: 1, hi: K + 2, ask: 'count' }, rule: 'boxExact' }
        });
      }),
      H('hard-unit-box', '단위분수의 곱이 들어간 식의 □', '심25 / 기본 ②43', (d) => {
        // 함정: 단위분수는 분모가 클수록 작다. 부등호 방향 그대로 분모의 곱을 비교하는 아이가 걸린다(답이 뒤집힌다).
        //  분모의 곱이 꼭 같아지는 수(□ = t)는 들어갈 수 없다.
        const gt = d.bool(), a = d.int(2, 7), t = gt ? d.int(4, 8) : d.int(3, 7), K = a * t, list = [2, 3, 4, 5, 6, 7, 8, 9].filter((v) => (gt ? v < t : v > t));
        return N('2부터 9까지의 자연수 가운데 □ 안에 들어갈 수 있는 수는 모두 몇 개인가?', list.length, {
          unit: '개', figure: eq(frac(1, a), '*', frac(1, box()), gt ? '>' : '<', frac(1, K)),
          explain: `${frac(1, a)} × ${frac(1, '□')} = ${frac(1, `${a} × □`)}이다. 단위분수는 분모가 작을수록 크므로 ${a} × □가 ${K}보다 ${gt ? '작아야' : '커야'} 한다. ${a} × ${t} = ${K}이므로 □는 ${t}보다 ${gt ? '작다' : '크다'}. □ 안에는 ${list.join(', ')}${tail(list[list.length - 1], '이/가')} 들어갈 수 있으므로 ${list.length}개이다.`,
          facts: { digit: { template: gt ? `${K}>${a}*□` : `${K}<${a}*□`, lo: 2, hi: 9, ask: 'count' } }
        });
      }),
      H('hard-split-area', '넓이 그림에서 잘못된 계산이 빠뜨린 부분', '심7·10 / 기본 ①19 ②30', (d) => {
        // 함정: 대분수의 곱셈을 자연수 부분끼리, 분수 부분끼리만 곱하는 아이. 넓이 그림의 네 부분 가운데 ㉡과 ㉢이 빠진다는 것을 대야 풀린다.
        const missed = (X, Y) => qadd(qmul(q(nat(X.w)), q(V(0, Y.n, Y.d))), qmul(q(V(0, X.n, X.d)), q(nat(Y.w))), '+');
        const m = d.until(() => ({ X: mixedAny(d, 3, 2, 5), Y: mixedAny(d, 2, 2, 5) }), (v) => v.X.d !== v.Y.d && v.X.w !== v.Y.w && !isWhole(missed(v.X, v.Y))), { X, Y } = m, fx = V(0, X.n, X.d), fy = V(0, Y.n, Y.d), p = d.pick(NAMES);
        const x = missed(X, Y), sum = toV(R(x.P, x.D));
        return ansQ(`가로가 ${show(X)} m, 세로가 ${show(Y)} m인 직사각형 모양의 꽃밭을 그림과 같이 네 부분으로 나누었다. ${name(p, '은/는')} 꽃밭의 넓이를 다음과 같이 잘못 계산하였다. 이 계산에서 빠뜨린 부분의 넓이를 모두 더하면 몇 m²인가?`, x, {
          unit: 'm²', figure: splitRect(X.w, X.n, X.d, Y.w, Y.n, Y.d) + lines([eq(show(X), '*', show(Y)), eq('=', par(X.w, '*', Y.w), '+', par(show(fx), '*', show(fy)))]),
          explain: `${X.w} × ${josa(Y.w, '은/는')} ㉠의 넓이, ${show(fx)} × ${vj(fy, '은/는')} ㉣의 넓이이므로 ㉡과 ㉢을 빠뜨렸다. ㉡은 ${told([fx, nat(Y.w)])}(m²), ㉢은 ${told([nat(X.w), fy])}(m²)이고, 두 넓이의 합은 ${show(sum)} m²이다.`
        });
      }),
      H('hard-overlap-of', '겹쳐 색칠한 그림에서 겹친 부분이 한 색의 얼마인지 구하기', '기본 ①16·17 ②19·71', (d) => {
        // 함정: 두 분수의 곱은 겹친 부분이 「전체의」 얼마인지를 나타낸다. 묻는 것은 「노란색으로 색칠한 부분의」 얼마이므로 기준이 다르다.
        //  습관대로 두 분수를 곱하는 아이, 노란색 부분의 크기를 답하는 아이가 걸린다.
        const [f, g] = d.until(() => [properAny(d, 3, 6, 2), properAny(d, 3, 6, 2)], ([x, y]) => x.d !== y.d && key(x) !== key(y)), a = f.n, b = f.d, c = g.n, e = g.d;
        return F(`정사각형의 ${vj(f, '을/를')} 노란색으로, ${vj(g, '을/를')} 파란색으로 그림과 같이 색칠하였더니 두 색이 겹친 부분이 생겼다. 겹친 부분은 노란색으로 색칠한 부분의 얼마인가?`, c, e, {
          anyForm: true,
          figure: areaGrid(b, e, (x, y) => (x < a && y < c ? BOTH : x < a ? YELLOW : y < c ? SKY : WHITE), `정사각형을 가로 ${b}칸, 세로 ${e}칸으로 똑같이 나누었다. 왼쪽 세로줄 ${a}칸은 노란색, 위쪽 가로줄 ${c}칸은 파란색으로 색칠하였고, 두 색이 겹친 칸은 초록색으로 보인다`),
          explain: `노란색으로 색칠한 칸은 ${a} × ${e} = ${a * e}(칸)이고, 그 가운데 겹친 칸은 ${a} × ${c} = ${a * c}(칸)이다. 겹친 부분은 노란색으로 색칠한 부분의 ${frac(a * c, a * e)} = ${show(g)}이다. ${show(f)} × ${show(g)} = ${res([f, g])}${tail(mul([f, g]).p, '은/는')} 겹친 부분이 정사각형 전체의 얼마인지를 나타낸다.`,
          facts: { calc: [[`${a}*${c}/${a}`, 0], [`${a}*${e}/${a}`, 1]] }
        });
      }),
      H('hard-left-after-part', '문장제: 몇 분의 몇을 쓰고 남은 양', '심48 / 기본 ①55 ②57', (d) => {
        // 함정: 주어진 분수는 「사용한 양」이고 묻는 것은 「남은 양」이다. 곱한 값을 그대로 답하는 아이가 걸린다.
        const [f, k] = d.until(() => fnPick(d, d.bool() ? 'over' : 'reduce', 12, 12), ([v, c]) => (c.w * (v.d - v.n)) % v.d !== 0 && v.d - v.n >= 2), left = V(0, f.d - f.n, f.d);
        return ansQ(`길이가 ${k.w} m인 리본 가운데 ${vj(f, '을/를')} 사용하였다. 남은 리본은 몇 m인가?`, qmul(q(k), qadd(ONE, q(f), '-')), {
          unit: 'm', explain: `사용한 리본이 전체의 ${show(f)}이므로 남은 리본은 전체의 1 − ${show(f)} = ${show(left)}이다. ${told([k, left])}이다.`, facts: { unseen: [1] }
        });
      }),
      H('hard-m-vs-part', '문장제: 「몇 분의 몇 m」와 「끈의 몇 분의 몇」', '심66 / 기본 ②48·49', (d) => {
        // 함정: 「3/4 m」는 길이이고 「끈의 3/4」은 끈의 길이에 곱해야 하는 비율이다. 같은 분수라서 사용한 길이도 같다고 여기는 아이가 걸린다.
        const m = d.until(() => ({ f: properAny(d, 3, 9), c: d.int(2, 9) }), (v) => ((v.c - 1) * v.f.n) % v.f.d !== 0), { f, c } = m, [p, s] = d.shuffle(NAMES).slice(0, 2), used = toV(mul([nat(c), f]));
        const gap = toV(R(c * f.n - f.n, f.d));
        return ansQ(`${name(p, '과/와')} ${name(s, '은/는')} 길이가 ${c} m인 끈을 하나씩 가지고 있다. ${name(p, '은/는')} 끈을 ${show(f)} m 사용하였고, ${name(s, '은/는')} 가지고 있던 끈의 ${vj(f, '을/를')} 사용하였다. ${name(s, '이/가')} 사용한 끈은 ${name(p, '이/가')} 사용한 끈보다 몇 m 더 긴가?`, qadd(qmul(q(nat(c)), q(f)), q(f), '-'), {
          unit: 'm', explain: `${name(p, '이/가')} 사용한 끈은 ${show(f)} m이다. ${name(s, '이/가')} 사용한 끈은 ${c} m의 ${show(f)}이므로 ${told([nat(c), f])}(m)이다. 두 길이의 차는 ${show(used)} − ${show(f)} = ${show(gap)}이므로 ${show(gap)} m이다.`
        });
      }),
      H('hard-of-first', '문장제: 「처음의 몇 분의 몇」이 두 번 나오는 상황', '기본 ③57', (d) => {
        // 함정: 두 분수 모두 「처음의」 얼마이다. 「남은 것의 몇 분의 몇」처럼 두 분수를 이어 곱하는 아이가 걸린다(하루 뒤의 양은 쓰지 않는 조건이다).
        const m = d.until(() => { const b = d.pick([4, 5, 6, 8, 10]), e = d.pick([3, 4, 5, 6, 8]); return { f1: V(0, coTop(d, b, 2), b), f2: V(0, coTop(d, e, 2), e), c: d.int(2, 9) }; }, (v) => cmp(val(v.f1), val(v.f2)) > 0 && v.f1.d !== v.f2.d && (v.c * v.f2.n) % v.f2.d !== 0);
        const vs = [nat(m.c), m.f2];
        return word(`물통에 물이 ${m.c} L 들어 있었다. 하루가 지났더니 처음의 ${show(m.f1)}만큼 남았고, 이틀이 지났더니 처음의 ${show(m.f2)}만큼 남았다. 이틀이 지났을 때 남은 물은 몇 L인가?`, vs, 'L', `이틀이 지났을 때 남은 물은 처음 ${m.c} L의 ${show(m.f2)}이다. 하루가 지났을 때의 양은 쓰지 않는다. ${told(vs)}이다.`);
      }),
      H('hard-different-wholes', '문장제: 전체가 다른 두 양의 몇 분의 몇 비교', '기본 ③56 ②50', (d) => {
        // 함정: 분수가 더 큰 쪽이 더 많이 사용했다고 여기는 아이. 두 끈의 길이가 다르므로 사용한 길이를 구해 보아야 한다(분수가 큰 쪽이 사용한 길이는 더 짧다).
        const m = d.until(() => ({ f: properAny(d, 3, 8), g: properAny(d, 3, 8), A: d.int(4, 12), Bn: d.int(6, 24) }), (v) => cmp(val(v.f), val(v.g)) > 0 && v.A * v.f.n * v.g.d < v.Bn * v.g.n * v.f.d && v.f.d !== v.g.d && near(mul([nat(v.A), v.f]), mul([nat(v.Bn), v.g]), 3));
        const [p, s] = d.shuffle(NAMES).slice(0, 2), rows = d.shuffle([[nat(m.A), m.f], [nat(m.Bn), m.g]]), vals = rows.map(mul), who = [p, s];
        return C(`${name(p, '은/는')} 길이가 ${rows[0][0].w} m인 끈의 ${vj(rows[0][1], '을/를')} 사용하였고, ${name(s, '은/는')} 길이가 ${rows[1][0].w} m인 끈의 ${vj(rows[1][1], '을/를')} 사용하였다. 끈을 더 많이 사용한 사람은?`, [p, '두 사람이 사용한 끈의 길이는 같다.', s], sgn(vals[0], vals[1]), {
          explain: `${name(p, '이/가')} 사용한 끈은 ${told(rows[0])}(m), ${name(s, '이/가')} 사용한 끈은 ${told(rows[1])}(m)이다. 처음 끈의 길이가 다르므로 분수의 크기만으로는 알 수 없다. ${res(rows[0])} ${SGN(vals[0], vals[1])} ${res(rows[1])}이므로 ${name(who[sgn(vals[0], vals[1]) === 0 ? 0 : 1], '이/가')} 더 많이 사용하였다.`,
          facts: { choose: { exprs: scaled(rows.map(qof)), rule: 'compare' } }
        });
      }),

      // ── ② 두 번 넘게 생각해야 풀리는 문제 ──
      H('hard-rest-part', '문장제: 남은 부분의 몇 분의 몇은 전체의 얼마', '심53 / 기본 ①56 ②55 ③62', (d) => {
        const [f, g] = d.until(() => [properAny(d, 3, 9), properAny(d, 3, 9)], ([x, y]) => x.d !== y.d && mul([V(0, x.d - x.n, x.d), y]).q <= 60), left = V(0, f.d - f.n, f.d);
        return ansQ(`도화지 전체의 ${vj(f, '을/를')} 빨간색으로 색칠하고, 남은 부분의 ${vj(g, '을/를')} 파란색으로 색칠하였다. 파란색으로 색칠한 부분은 도화지 전체의 얼마인가?`, qmul(qadd(ONE, q(f), '-'), q(g)), {
          explain: `빨간색으로 색칠하고 남은 부분은 전체의 1 − ${show(f)} = ${show(left)}이다. 파란색으로 색칠한 부분은 그 가운데 ${show(g)}이므로 ${told([left, g])}이다.`, facts: { unseen: [1] }
        });
      }),
      H('hard-rest-amount', '문장제: 남은 양의 몇 분의 몇은 얼마', '심53·54 / 기본 ①56 ②56', (d) => {
        const m = d.until(() => ({ f: properAny(d, 3, 9), g: properAny(d, 3, 9), t: d.int(6, 30) * 10 }), (v) => v.f.d !== v.g.d && (v.t * (v.f.d - v.f.n)) % v.f.d === 0 && (v.t * (v.f.d - v.f.n) * v.g.n) % (v.f.d * v.g.d) === 0), { f, g, t } = m, left = V(0, f.d - f.n, f.d), rest = t * left.n / left.d;
        return ansQ(`${t}쪽인 책을 어제는 전체의 ${show(f)}만큼 읽었고, 오늘은 남은 쪽수의 ${show(g)}만큼 읽었다. 오늘 읽은 쪽수는 몇 쪽인가?`, qmul(qmul(q(nat(t)), qadd(ONE, q(f), '-')), q(g)), {
          kind: 'nat', unit: '쪽', explain: `어제 읽고 남은 쪽수는 전체의 1 − ${show(f)} = ${show(left)}이므로 ${t} × ${show(left)} = ${rest}(쪽)이다. 오늘 읽은 쪽수는 ${rest} × ${show(g)} = ${rest * g.n / g.d}(쪽)이다.`, facts: { unseen: [1] }
        });
      }),
      H('hard-rest-left', '문장제: 두 번 덜어 내고 끝에 남은 양', '심54 / 기본 ②56', (d) => {
        const m = d.until(() => ({ f: properAny(d, 3, 9), g: properAny(d, 3, 9), t: d.int(4, 20) * 6 }), (v) => v.f.d !== v.g.d && (v.t * (v.f.d - v.f.n)) % v.f.d === 0 && (v.t * (v.f.d - v.f.n) * (v.g.d - v.g.n)) % (v.f.d * v.g.d) === 0), { f, g, t } = m, l1 = V(0, f.d - f.n, f.d), l2 = V(0, g.d - g.n, g.d), rest = t * l1.n / l1.d;
        return ansQ(`색종이 ${t}장 가운데 ${vj(f, '을/를')} 사용하고, 남은 색종이의 ${vj(g, '을/를')} 동생에게 주었다. 지금 남아 있는 색종이는 몇 장인가?`, qmul(qmul(q(nat(t)), qadd(ONE, q(f), '-')), qadd(ONE, q(g), '-')), {
          kind: 'nat', unit: '장', explain: `사용하고 남은 색종이는 전체의 1 − ${show(f)} = ${show(l1)}이므로 ${t} × ${show(l1)} = ${rest}(장)이다. 동생에게 주고 남은 색종이는 그 가운데 1 − ${show(g)} = ${show(l2)}이므로 ${rest} × ${show(l2)} = ${rest * l2.n / l2.d}(장)이다.`, facts: { unseen: [1] }
        });
      }),
      H('hard-two-shares', '문장제: 두 사람의 몫을 각각 구해 견주기', '심49 / 기본 ①58 ②58', (d) => {
        // 틀린 양: 적게 푼 사람이 푼 쪽수
        const m = d.until(() => ({ f: properAny(d, 3, 10, 2), g: properAny(d, 3, 10, 2), t: d.int(6, 30) * 10 }), (v) => { const x = v.t * v.f.n / v.f.d, y = v.t * v.g.n / v.g.d; return v.f.d !== v.g.d && Number.isInteger(x) && Number.isInteger(y) && x !== y && Math.abs(x - y) <= 40 && Math.min(x, y) !== Math.abs(x - y); });
        const { f, g, t } = m, [p, s] = d.shuffle(NAMES).slice(0, 2), who = [p, s], vals = [t * f.n / f.d, t * g.n / g.d], winner = vals[0] > vals[1] ? 0 : 1, gap = Math.abs(vals[0] - vals[1]), small = Math.min(vals[0], vals[1]);
        const options = d.shuffle([[winner, gap], [1 - winner, gap], [winner, small], [1 - winner, small]]);
        return C(`${name(p, '과/와')} ${name(s, '은/는')} ${t}쪽인 문제집을 한 권씩 가지고 있다. ${name(p, '은/는')} 전체의 ${show(f)}만큼, ${name(s, '은/는')} 전체의 ${show(g)}만큼 풀었다. 누가 몇 쪽 더 많이 풀었는가?`, options.map(([i, n]) => `${who[i]}, ${n}쪽`), options.findIndex(([i, n]) => i === winner && n === gap), {
          explain: `${name(p, '은/는')} ${t} × ${show(f)} = ${vals[0]}(쪽), ${name(s, '은/는')} ${t} × ${show(g)} = ${vals[1]}(쪽) 풀었다. ${name(who[winner], '이/가')} ${Math.max(vals[0], vals[1])} − ${small} = ${gap}(쪽) 더 많이 풀었다.`,
          facts: { who: { values: vals, options, exprs: [`${t}*${f.n}/${f.d}`, `${t}*${g.n}/${g.d}`] } }
        });
      }),
      H('hard-add-back', '문장제: 몇 분의 몇만큼을 구해 처음 양과 더하기', '심46 / 기본 ①59', (d) => {
        const both = (f, g) => qadd(q(f), qmul(q(f), q(g)), '+');
        const [f, g] = d.until(() => [properAny(d, 3, 9, 2), properAny(d, 3, 9, 2)], ([x, y]) => x.d !== y.d && mul([x, y]).q <= 30 && gcd(x.n, y.d) * gcd(y.n, x.d) > 1 && !isWhole(both(x, y))), p = d.pick(NAMES), x = both(f, g), part = toV(mul([f, g]));
        return ansQ(`${name(p, '은/는')} 어제 줄넘기를 ${show(f)}시간 동안 하였고, 오늘은 어제 한 시간의 ${show(g)}만큼 하였다. ${name(p, '이/가')} 이틀 동안 줄넘기를 한 시간은 모두 몇 시간인가?`, x, {
          unit: '시간', explain: `오늘 줄넘기를 한 시간은 ${told([f, g])}(시간)이다. 이틀 동안 한 시간은 ${show(f)} + ${show(part)} = ${show(toV(R(x.P, x.D)))}이므로 ${show(toV(R(x.P, x.D)))}시간이다.`
        });
      }),
      H('hard-give-left', '문장제: 똑같이 나누어 주고 남은 양', '심45', (d) => {
        const m = d.until(() => { const [f, k] = fnPick(d, d.bool() ? 'over' : 'reduce', 12, 12), given = mul([f, k]); return { f, k, c: Math.ceil(given.p / given.q) + d.int(0, 3) }; }, (v) => v.c <= 20), { f, k, c } = m, given = toV(mul([f, k]));
        const x = qadd(q(nat(c)), qmul(q(f), q(k)), '-');
        return ansQ(`쌀 ${c} kg을 한 사람에게 ${show(f)} kg씩 ${k.w}명에게 나누어 주었다. 남은 쌀은 몇 kg인가?`, x, {
          unit: 'kg', explain: `나누어 준 쌀은 ${told([f, k])}(kg)이다. 남은 쌀은 ${c} − ${show(given)} = ${show(toV(R(x.P, x.D)))}이므로 ${show(toV(R(x.P, x.D)))} kg이다.`
        });
      }),
      H('hard-two-taps', '문장제: 두 양을 더한 다음 시간을 분수로 고쳐 곱하기', '심47 / 기본 ②60', (d) => {
        const m = d.until(() => { const b = d.pick([2, 3, 4, 5, 6]), e = d.pick([2, 3, 4, 5, 6, 10]), x = V(d.int(1, 2), coTop(d, b), b), y = V(d.int(0, 1), coTop(d, e), e), min = d.int(1, 4), sumQ = qadd(q(x), q(y), '+'); return { x, y, min, sumQ, all: qmul(sumQ, q(V(min, 1, 2))) }; }, (v) => v.x.d !== v.y.d && lcm(v.x.d, v.y.d) <= 12 && !isWhole(v.all) && !isWhole(v.sumQ) && R(v.all.P, v.all.D).p <= 200 && R(v.all.P, v.all.D).q <= 24);
        const { x, y, min, sumQ, all } = m, half = V(min, 1, 2), sum = toV(R(sumQ.P, sumQ.D));
        return ansQ(`1분에 물이 ${show(x)} L씩 나오는 수도와 1분에 물이 ${show(y)} L씩 나오는 수도가 있다. 두 수도를 동시에 틀어 ${min}분 30초 동안 물을 받았다. 받은 물은 모두 몇 L인가?`, all, {
          unit: 'L', explain: `두 수도에서 1분에 나오는 물은 ${show(x)} + ${show(y)} = ${show(sum)}(L)이다. 30초는 ${frac(1, 2)}분이므로 ${min}분 30초는 ${show(half)}분이다. ${told([sum, half])}이다.`, facts: { unseen: [2] }
        });
      }),
      H('hard-time-frac', '문장제: 몇 시간 몇 분을 분수로 고쳐 곱하기', '심44 / 기본 ①62 ②52 ③65', (d) => {
        const m = d.until(() => ({ x: mixedAny(d, 4, 2, 9), h: d.int(1, 2), min: d.pick([10, 12, 15, 20, 24, 30, 36, 40, 45, 48, 50]) }), (v) => { const t = toV(R(v.h * 60 + v.min, 60)), r = mul([v.x, t]); return r.q > 1 && r.q <= 30 && r.p <= 150 && gcd(top(v.x), t.d) * gcd(top(t), v.x.d) > 1; });
        const { x, h, min } = m, t = toV(R(h * 60 + min, 60)), part = R(min, 60);
        return ansQ(`한 시간에 ${show(x)} km씩 걷는 빠르기로 ${h}시간 ${min}분 동안 걸었다. 걸은 거리는 몇 km인가?`, qmul(q(x), q({ w: h, n: min, d: 60 })), {
          unit: 'km', explain: `1시간은 60분이므로 ${min}분은 ${frac(min, 60)}시간 = ${frac(part.p, part.q)}시간이고, ${h}시간 ${min}분은 ${show(t)}시간이다. ${told([x, t])}이다.`, facts: { unseen: [60] }
        });
      }),
      H('hard-hidden-numbers', '문장제: 글에 없는 수를 꺼내 세 수를 곱하기', '심50 / 기본 ①54', (d) => {
        const f = V(0, ...d.pick([[1, 3], [3, 8], [5, 12], [1, 4]])), p = d.pick(NAMES), day = 24 * f.n / f.d, vs = [nat(24), f, nat(7)];
        return word(`${name(p, '은/는')} 날마다 하루의 ${show(f)}만큼 잠을 잔다. ${name(p, '이/가')} 일주일 동안 잠을 자는 시간은 모두 몇 시간인가?`, vs, '시간', `하루는 24시간이므로 하루에 잠을 자는 시간은 24 × ${show(f)} = ${day}(시간)이다. 일주일은 7일이므로 ${day} × 7 = ${day * 7}(시간)이다.`, { kind: 'nat', facts: { unseen: [24, 7] } });
      }),
      H('hard-wrong-any', '잘못 계산한 것을 바르게 계산하기', '심29 / 기본 ①64 ②62', (d, n) => {
        // 첫째 문항은 곱해야 할 것을 더했고, 둘째 문항은 곱해야 할 것을 뺐다. 어떤 수를 덧셈·뺄셈으로 되돌려 구한 다음 곱한다.
        const m = d.until(() => {
          const [b, e] = d.shuffle(d.pick([[2, 3], [2, 4], [3, 4], [2, 5], [4, 5], [3, 6], [2, 6], [5, 10], [3, 5], [4, 8]])), a = V(d.int(0, 2), coTop(d, b), b), x = V(d.int(1, 4), coTop(d, e), e);
          const r = n === 0 ? R(top(x) * b + top(a) * e, b * e) : R(top(x) * b - top(a) * e, b * e);
          return { a, x, r };
        }, (v) => v.r.p > 0 && v.r.q > 1 && mul([v.x, v.a]).q > 1 && mul([v.x, v.a]).q <= 30 && mul([v.x, v.a]).p <= 150 && top(v.a) > 1);
        const { a, x } = m, r = toV(m.r), back = n === 0 ? '-' : '+';
        return ansQ(`어떤 수에 ${vj(a, '을/를')} 곱해야 할 것을 잘못하여 ${n === 0 ? '더했더니' : '뺐더니'} ${vj(r, '이/가')} 되었다. 바르게 계산한 값은?`, qmul(qadd(q(r), q(a), back), q(a)), {
          explain: `어떤 수는 ${show(r)} ${SG[back]} ${show(a)} = ${show(x)}이다. 바르게 계산하면 ${told([x, a])}이다.`, facts: { rule: ['wrongAdded', 'wrongTaken'][n] }
        });
      }, { count: 2 }),
      H('hard-candle', '문장제: 줄어든 양을 구해 처음 양 구하기', '기본 ②63', (d) => {
        const m = d.until(() => { const [f, k] = fnPick(d, d.bool() ? 'over' : 'reduce', 9, 15), burnt = mul([f, k]), now = V(d.int(8, 20), coTop(d, burnt.q), burnt.q); return { f, k, now }; }, (v) => mul([v.f, v.k]).q >= 2 && !isWhole(qadd(q(v.now), qmul(q(v.f), q(v.k)), '+')));
        const { f, k, now } = m, x = qadd(q(now), qmul(q(f), q(k)), '+'), burnt = toV(mul([f, k]));
        return ansQ(`불을 붙이면 1분에 ${show(f)} cm씩 일정하게 짧아지는 양초가 있다. 이 양초에 불을 붙이고 ${k.w}분이 지났을 때 양초의 길이를 재었더니 ${show(now)} cm였다. 불을 붙이기 전 양초의 길이는 몇 cm인가?`, x, {
          unit: 'cm', explain: `${k.w}분 동안 짧아진 길이는 ${told([f, k])}(cm)이다. 불을 붙이기 전의 길이는 ${show(now)} + ${show(burnt)} = ${show(toV(R(x.P, x.D)))}이므로 ${show(toV(R(x.P, x.D)))} cm이다.`
        });
      }),
      H('hard-between', '두 곱 사이에 있는 자연수', '심23 / 기본 ①33 ②42', (d) => {
        const m = d.until(() => { const lo = mnPick(d, d.bool() ? 'carry' : 'reduce', 3, 9, 6), hi = mnPick(d, d.bool() ? 'carry' : 'reduce', 4, 9, 9), vl = mul(lo), vh = mul(hi); return { lo, hi, from: Math.floor(vl.p / vl.q) + 1, to: Math.floor(vh.p / vh.q) }; }, (v) => v.to - v.from >= 1 && v.to - v.from <= 5 && !shares(v.lo, v.hi));
        const { lo, hi, from, to } = m, xl = qof(lo), xh = qof(hi), dl = xl.dens.join('*'), dh = xh.dens.join('*'), list = Array.from({ length: to - from + 1 }, (_, i) => from + i);
        return N('□ 안에 들어갈 수 있는 자연수는 모두 몇 개인가?', list.length, {
          unit: '개', figure: eq(...parts(lo), '<', box(), '<', ...parts(hi)),
          explain: `${said(lo)} = ${res(lo)}, ${said(hi)} = ${res(hi)}이다. ${res(lo)}보다 크고 ${res(hi)}보다 작은 자연수는 ${list.join(', ')}${tail(list[list.length - 1], '으로/로')} ${list.length}개이다.`,
          facts: { digit: { template: `${xl.num}*${dh}<□*${dl}*${dh}<${xh.num}*${dl}`, lo: 1, hi: to + 3, ask: 'count' }, rule: 'betweenNat' }
        });
      }),
      H('hard-box-mixed', '곱보다 작은 대분수의 자연수 부분(□)', '심24 / 기본 ①33 ②41 ③46', (d) => {
        // 곱을 대분수로 고친 다음 분수 부분끼리 통분하여 비교해야 □의 가장 큰 수가 정해진다.
        const m = d.until(() => { const vs = mnPick(d, d.bool() ? 'carry' : 'reduce', 4, 9, 9).reverse(), v = toV(mul(vs)), g = properAny(d, 2, 9); return { vs, v, g }; }, (x) => x.v.w >= 3 && x.g.d !== x.v.d && cmp(val(x.g), R(x.v.n, x.v.d)) !== 0 && near(val(x.g), R(x.v.n, x.v.d), 0.34));
        const { vs, v, g } = m, small = cmp(val(g), R(v.n, v.d)) < 0, bestBox = small ? v.w : v.w - 1, x = qof(vs), L = lcm(g.d, v.d);
        return N('□ 안에 들어갈 수 있는 자연수 가운데 가장 큰 수는?', bestBox, {
          figure: eq(...parts(vs), '>', mixed(box(), g.n, g.d)),
          explain: `${told(vs)}이다. 분수 부분을 분모가 ${L}${tail(L, '이/가')} 되도록 통분하면 ${frac(g.n * (L / g.d), L)} ${small ? LT : GT} ${frac(v.n * (L / v.d), L)}이다. ` + (small ? `□가 ${v.w}이어도 ${show(v)}보다 작으므로 가장 큰 수는 ${v.w}이다.` : `□가 ${v.w}이면 ${show(v)}보다 크므로 가장 큰 수는 ${v.w - 1}이다.`),
          facts: { digit: { template: `${x.num}*${g.d}>(□*${g.d}+${g.n})*${x.dens.join('*')}`, lo: 1, hi: v.w + 2, ask: 'max' }, rule: 'boxMixed' }
        });
      }),
      H('hard-cards-proper', '수 카드를 모두 써서 곱이 가장 작은 두 진분수 만들기', '심37 / 기본 ①42', (d) => {
        const digits = d.until(() => d.shuffle([2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4).sort((x, y) => x - y), ([x, y, z, w]) => gcd(x * y, z * w) < x * y), [x, y, z, w] = digits, r = R(x * y, z * w), g = z * w / r.q;
        return F('수 카드 4장을 □ 안에 한 번씩 모두 넣어 진분수 2개를 만들고 두 진분수를 곱하려고 한다. 곱이 가장 작을 때의 계산 결과는?', r.p, r.q, {
          anyForm: true, figure: cards(d.shuffle(digits)) + eq(frac(box(), box()), '*', frac(box(), box())),
          explain: `두 진분수의 곱은 분자끼리의 곱을 분모끼리의 곱으로 나눈 것이므로, 작은 두 수 ${x}, ${josa(y, '을/를')} 분자에, 큰 두 수 ${z}, ${josa(w, '을/를')} 분모에 놓을 때 가장 작다. ${frac(`${x} × ${y}`, `${z} × ${w}`)} = ${frac(x * y, z * w)}` + (g > 1 ? ` = ${frac(r.p, r.q)}` : '') + '이다.',
          facts: { calc: [[`${x}*${y}/${g}`, 0], [`${z}*${w}/${g}`, 1]], unseen: [g] }
        });
      }),
      H('hard-square-part', '똑같이 나눈 정사각형에서 색칠한 부분의 넓이', '심64·67 / 기본 ②69', (d) => {
        const m = d.until(() => { const count = d.pick([4, 6, 8]); return { v: mixedAny(d, 2, 2, 5), count, on: d.int(1, count - 1) }; }, (x) => { const r = mul([x.v, x.v, V(0, x.on, x.count)]); return r.q > 1 && r.q <= 60 && gcd(x.on, x.count) === 1 && top(x.v) <= 9; });
        const { v, count, on } = m, part = V(0, on, count), area = toV(mul([v, v])), vs = [v, v, part];
        return word(`한 변의 길이가 ${show(v)} cm인 정사각형을 그림과 같이 똑같이 나누어 색칠하였다. 색칠한 부분의 넓이는 몇 cm²인가?`, vs, 'cm²', `정사각형의 넓이는 ${told([v, v])}(cm²)이다. 색칠한 부분은 정사각형의 ${show(part)}이므로 ${told([area, part])}이다.`, { figure: areaGrid(count / 2, 2, (x, y) => (y * (count / 2) + x < on ? '#93c5fd' : WHITE), `정사각형을 똑같이 ${count}칸으로 나누어 ${on}칸을 색칠`, 110) });
      }),
      H('hard-cut-rect', '한 변을 줄여 만든 직사각형의 넓이', '심65 / 기본 ①69', (d) => {
        const cut = (v) => qmul(qadd(q(nat(v.w)), q(v.t), '-'), q(v.Y));
        const m = d.until(() => ({ w: d.int(2, 5), t: properAny(d, 3, 9), Y: d.bool() ? properAny(d, 3, 9, 2) : mixedAny(d, 2, 2, 7) }), (v) => v.t.d !== v.Y.d && !isWhole(cut(v)) && R(cut(v).P, cut(v).D).q <= 40 && R(cut(v).P, cut(v).D).p <= 150), { w, t, Y } = m, side = toV(R(w * t.d - t.n, t.d));
        const x = cut(m);
        return ansQ(`가로가 ${w} m, 세로가 ${show(Y)} m인 직사각형 모양의 밭이 있다. 가로를 ${show(t)} m만큼 줄여서 새 밭을 만들었다. 새 밭의 넓이는 몇 m²인가?`, x, {
          unit: 'm²', explain: `새 밭의 가로는 ${w} − ${show(t)} = ${show(side)}(m)이다. 넓이는 ${told([side, Y])}이다.`
        });
      }),
      H('hard-scale-rect', '변을 몇 배로 늘이고 줄여 만든 직사각형의 넓이', '심66 / 기본 ①68', (d) => {
        const m = d.until(() => ({ s: d.int(4, 12), x: mixedAny(d, 2, 2, 6), y: properAny(d, 3, 9, 2) }), (v) => v.s % v.x.d === 0 && (v.s * v.y.n) % v.y.d !== 0 && v.x.d !== v.y.d && mul([nat(v.s), v.x, nat(v.s), v.y]).q > 1 && mul([nat(v.s), v.x, nat(v.s), v.y]).p <= 200 && v.s * top(v.x) / v.x.d <= 20), { s, x, y } = m, wide = s * top(x) / x.d, tall = toV(mul([nat(s), y]));
        return word(`한 변의 길이가 ${s} cm인 정사각형의 가로를 ${show(x)}배로 늘이고, 세로를 ${show(y)}배로 줄여서 직사각형을 만들었다. 만든 직사각형의 넓이는 몇 cm²인가?`, [nat(s), x, nat(s), y], 'cm²',
          `직사각형의 가로는 ${s} × ${show(x)} = ${wide}(cm), 세로는 ${told([nat(s), y])}(cm)이다. 넓이는 ${told([nat(wide), tall])}이다.`);
      }),
      H('hard-area-compare', '넓이가 더 넓은 도형 찾기', '심63 / 기본 ①70 ②70', (d) => {
        const m = d.until(() => ({ v: mixedAny(d, 3, 2, 5), para: mnPick(d, d.bool() ? 'carry' : 'reduce', 4, 9, 6) }), (x) => { const a = mul([x.v, x.v]), b = mul(x.para); return cmp(a, b) !== 0 && near(a, b, 1.5) && x.v.d !== x.para[0].d && top(x.v) <= 13; });
        const rows = [[m.v, m.v], m.para], vals = rows.map(mul);
        return C('넓이가 더 넓은 것은?', ['가', '두 도형의 넓이는 같다.', '나'], sgn(vals[0], vals[1]), {
          figure: tagged([`한 변이 ${show(m.v)} cm인 정사각형`, `밑변이 ${show(m.para[0])} cm, 높이가 ${m.para[1].w} cm인 평행사변형`], ['가', '나']),
          explain: `가의 넓이는 ${told(rows[0])}(cm²), 나의 넓이는 ${told(rows[1])}(cm²)이다. ${res(rows[0])} ${SGN(vals[0], vals[1])} ${res(rows[1])}이므로 ${sgn(vals[0], vals[1]) === 0 ? '가' : '나'}의 넓이가 더 넓다.`,
          facts: { choose: { exprs: scaled(rows.map(qof)), rule: 'compare' } }
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
