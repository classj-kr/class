// 5학년 2학기 2단원 분수의 곱셈 — 단원 틀과 기본 문항((분수)×(자연수), (자연수)×(분수), (진분수)×(진분수)와 세 분수의 곱셈, 대분수가 있는 곱셈).
// 수집해 둔 교과서 8종의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1~3: 75·76·71꼴, 심화꼴 68꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/5-2-2/싣기_대조표.md 에 있다.
// (잘못된 계산, 곱의 크기 비교, 조건에 맞는 수의 곱, 문장제, 도형, 실력 문항은 5-2-2b.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2, ③n = 기본꼴_3, 심n = 심화꼴.
// 영역은 수와 연산, 성취기준은 6수01-09(분수의 곱셈의 계산 원리를 탐구하고 그 계산을 할 수 있다) 하나이다.
//
// 싣는 기준
//  - 분수의 곱셈만 싣는다: (분수)×(자연수), (자연수)×(분수), (진분수)×(진분수), 대분수가 있는 곱셈, 세 분수의 곱셈.
//    하는 일이 다르면 다른 문제다: 주는 것(띠·수직선·묶음·나눈 정사각형, 식, 문장), 묻는 것(과정의 빈칸, 값, 고르기), 계산 구조가 다르면 따로 싣고
//    계산 문항에는 facts.rule 에 그 이름을 단다(이름대로 되게 수를 뽑는다): 자연수가 뒤·앞, 진분수·단위분수·대분수·가분수, 약분이 없다·한 번·엇갈려 두 번,
//    곱이 진분수·대분수·자연수, 분수 부분의 곱이 가분수, 세 수.
//  - 교육과정: 「분수의 곱셈은 계산 원리를 탐구하여 이해하는 수준에서 다룬다.」 계산 문항의 분모는 24 이하, 자연수는 30 이하에서 뽑고,
//    대분수가 있는 곱은 약분한 뒤 분자끼리의 곱이 150을 넘지 않게 한다. 네 분수 넘는 곱은 싣지 않는다.
//  - 교육과정: 「기약분수로 나타낼 것을 요구하지 않을 경우, 계산 결과를 기약분수가 아닌 분수로 나타내는 것도 허용한다.」 분수 하나를 답하는 문항은 크기가 같은 분수를
//    모두 맞게 친다(anyForm). 이 단원의 수집본에는 「기약분수로 나타내시오」라고 한 문제가 없어 기약분수를 요구하는 문항은 두지 않았다. 적어 두는 답은 언제나 기약분수이다.
//    곱이 자연수로 떨어지는 문항은 수 하나로 답한다(분수 칸으로 내지 않는다). 유형마다 답의 꼴(분수·자연수)은 정해져 있다.
//  - 계산 과정의 빈칸을 묻는 문항은 약분하는 수나 약분한 뒤의 분모를 글·틀이 정해 주어 답이 하나가 되게 하였다.
//  - 숫자만 다르거나 상황만 다른 것은 한 번만 싣는다(빈 곳에 두 수의 곱 써넣기, 화살표 상자, 곱셈표, 잇기는 계산 문항과 같은 문제).
//
// 뺀 것과 까닭(5-2-2b.js 의 것까지 여기에 모아 적는다)
//  - 6학년 분수의 나눗셈·비율이 있어야 풀리는 것: 삼각형·마름모의 넓이(①71, 심62의 변형 — ÷2가 분수에 걸린다), 자연수로 나누었더니 분수가 된 어떤 수(②74),
//    분수로 나누는 식의 □(②75 심28), 구간을 똑같이 나눈 수직선의 한 점(②73), 한 시간당으로 고쳐 견주기(①63 심58 — 단위당 양을 구하는 일.
//    「10분에 몇 km이면 한 시간에」(②52·심44의 변형)도 같다)
//  - 방정식 꼴·혼합 계산·새 기호·일의 양: 양쪽이 곱셈식인 등식의 □(심26), 괄호 안에 덧셈·뺄셈이 있는 식(심32, ②60의 변형), 약속한 기호(심31), 일의 양(②76),
//    □가 곱해지는 수 자리에 있는 부등식과 단위분수의 등식(심22·25의 변형 — 거꾸로 풀면 분수의 나눗셈)
//  - 앞 단원: 준비 학습(③71 — 3-2 분수, 5-1 약분과 통분·분수의 덧셈), 곱이 자연수가 되는 단위분수의 분모(심27 — 약수 세기 5-1-2)
//  - 시각 계산이 대부분인 것: 늦어지는 시계(②64, 심57의 변형 — 곱셈은 한 번이고 분을 분·초로 고쳐 시각에서 빼는 3-1-5의 일). 곱이 자연수인 빨라지는 시계(①52 심57)는 실었다.
//  - 조건 풀이·경우 따지기·규칙 찾기가 어려움의 대부분인 것: 사슬처럼 약분되는 긴 곱(②25 — 네 분수 넘는 곱), 합과 차로 두 분수 찾기(심33),
//    수 카드 넉 장을 놓는 자리 견주기(①43·44 ③44 심38, ②45·심34의 변형), 수 카드로 식의 빈칸 채우기(②46), 넉 장으로 진분수를 다 만들어 견주기(심35의 변형),
//    답이 여럿인 식 만들기(③45, ①42의 변형), 규칙을 찾아 빈칸 채우기(③38), 낯선 낱말과 안 쓰는 조건이 섞인 「아닌 것」의 수(①57), 두 번째로 작은 곱(③42의 변형)
//  - 뜻 없는 셈: 두 식의 계산 결과끼리 다시 더하고 빼고 곱하기(①39 ②40 심17), 두 둘레의 합·차(심60의 변형), 단위가 다른 두 값의 합(심43의 변형)
//  - 색칠하기(작도: ①5·9·17 ②10·19 ③23·33·67의 그리는 부분) — 색칠해 준 그림을 보고 답하거나 바르게 색칠한 그림을 고르는 꼴로 실었다.
//    과정·까닭·방법 쓰기(서술형: ①3·7·37 ②6·8·9 ③47·48·68 심8·9·11)는 과정의 빈칸, 방법 고르기, 처음 잘못된 곳 고르기, 까닭 고르기, 바른 값 구하기로 바꾸어 실었다.
//    문제 만들기·말하기·방법 글로 쓰기(①73·74·75 ②65 ③69·70 심14)는 뺐다.
//  - 같은 문제여서 한 번만 실은 것: 빈 곳에 두 수의 곱 써넣기·곱셈표·화살표 상자(③34·36·37, ①4·8·11·13·18·21의 변형 — 계산 문항과 같다),
//    이어 곱하기에서 가운데 값까지 써넣기(①24 ③35 심5 — 세 수의 곱과 같다), 세 묶음 가운데 가장 많은 것(②47의 변형 — 둘레가 가장 긴 도형과 같다),
//    튀어 오른 공의 높이(②48 심55·56 — 자연수의 몇 분의 몇, 몇 배의 몇 배와 같다), 주어진 식과 계산 결과가 같은 식(③27의 변형 — 계산 결과가 주어진 수인 식 찾기와 같다),
//    1분(1 L)에 가는 거리의 자연수 배(③51 — 대분수씩 자연수 번과 같다), 남은 개수에 한 개의 양 곱하기(①60 — 쓰고 남은 양, 남은 양의 몇 분의 몇과 같다),
//    넓이의 몇 배(심67 — 넓이의 몇 분의 몇과 같다)
//  - 그림이 필요해 미룬 것은 없다. 띠·수직선·묶음·나눈 정사각형·넓이 그림은 단원 파일의 그림 함수로 그렸고, 변의 길이가 적힌 도형(①65·66·70 ②67·68·70 ③66 심63)과
//    갈래 그림(①54 심51), 양팔저울(②47의 변형)은 수를 글에 적어 실었다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, box, frac, mixed, lines, dots, N, M, C, F } = B.kit;
  const STD = '6수01-09';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const LAB = ['㉠', '㉡', '㉢', '㉣'], THREE = LAB.slice(0, 3);
  const labelled = (answers) => answers.map((answer, i) => ({ label: LAB[i], answer }));
  const gcd = (x, y) => (y ? gcd(y, x % y) : x);
  // 토씨: 분수와 대분수는 분자를 마지막에 읽는다(5분의 3, 2와 5분의 3).
  const tail = (n, pair) => josa(n, pair).slice(String(n).length);
  const SG = { '+': '+', '-': '−', '*': '×', '=': '=', '>': '&gt;', '<': '&lt;' };
  const ex = (html) => '<span class="mb-expr">' + html + '</span>';
  // 식 한 줄: 조각을 이어 적는다. '+', '-', '*', '=' 은 기호로 바꾼다.
  const eq = (...parts) => ex(parts.map((p) => (SG[p] ? '<i>' + SG[p] + '</i>' : p)).join(' '));
  const par = (...parts) => '(' + parts.map((p) => (SG[p] ? '<i>' + SG[p] + '</i>' : p)).join(' ') + ')';
  const tagged = (list) => lines(list.map((html, i) => '<span class="mb-tag mb-tag-short">' + LAB[i] + '</span>' + html));

  // ── 수 하나 ──
  // 자연수 부분 w, 분수 부분 n/d. n = 0 이면 자연수, w = 0 이면 분수(분자가 분모보다 크면 가분수)이다.
  const V = (w, n, d) => ({ w, n, d: n ? d : 1 });
  const nat = (w) => V(w, 0, 1);
  const show = (v) => (v.n === 0 ? String(v.w) : v.w ? mixed(v.w, v.n, v.d) : frac(v.n, v.d));
  const vj = (v, pair) => show(v) + tail(v.n === 0 ? v.w : v.n, pair);
  const fj = (n, den, pair) => frac(n, den) + tail(n, pair);
  const top = (v) => v.w * v.d + v.n;
  const R = (p, q) => { const g = gcd(p, q) || 1; return { p: p / g, q: q / g }; };
  // 곱의 값(기약분수 p/q)
  const mul = (vs) => vs.reduce((r, v) => R(r.p * top(v), r.q * v.d), R(1, 1));
  const toV = (r) => (r.q === 1 ? nat(r.p) : V(Math.floor(r.p / r.q), r.p % r.q, r.q));
  const res = (vs) => show(toV(mul(vs)));
  const said = (vs) => vs.map(show).join(' × ');
  const times = (vs) => eq(...vs.reduce((out, v, i) => out.concat(i ? ['*', show(v)] : [show(v)]), []));

  // ── 검사가 다시 셈하는 식 ──
  // 식의 값을 (분자 식)/(분모 식)으로 적는다. 문제에 적힌 수로만 적는다(대분수 2 3/7 은 (2*7+3)).
  const imp = (v) => (v.n === 0 ? String(v.w) : v.w ? `(${v.w}*${v.d}+${v.n})` : String(v.n));
  const q = (v) => ({ num: imp(v), dens: v.n ? [v.d] : [], P: top(v), D: v.d });
  const qmul = (x, y) => ({ num: x.num + '*' + y.num, dens: x.dens.concat(y.dens), P: x.P * y.P, D: x.D * y.D });
  const qof = (vs) => vs.map(q).reduce(qmul);
  // 답 칸(자연수 / 분자·분모 / 자연수·분자·분모)마다 다시 셈하는 식. 기약분수로 고칠 때 나누는 수 g 는 글에 없다.
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

  // ── 풀이 글 ──
  // 분자들과 분모들을 엇갈려 약분한다.
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

  // ── 수 고르기 ──
  const coTop = (d, den, lo) => d.until(() => d.int(lo || 1, den - 1), (v) => gcd(v, den) === 1);
  // (진분수 a/b)와 (자연수 c)의 곱: 약분이 없고 곱이 진분수(plain)·대분수(over), 분모와 자연수를 약분하고 곱이 대분수(reduce)·진분수(reduceProper), 단위분수(unit), 곱이 자연수(natural)
  const FN = {
    plain: (a, b, c) => gcd(b, c) === 1 && a * c < b,
    over: (a, b, c) => a >= 2 && gcd(b, c) === 1 && a * c > b,
    reduce: (a, b, c) => a >= 2 && gcd(b, c) > 1 && c % b !== 0 && a * c > b,
    reduceProper: (a, b, c) => gcd(b, c) > 1 && a * c < b,
    unit: (a, b, c) => gcd(b, c) === 1 && c > 2,
    natural: (a, b, c) => a >= 2 && c % b === 0
  };
  function fnPick(d, kind, minTop) {
    const [a, b, c] = d.until(() => { const b = d.int(3, kind === 'reduceProper' ? 24 : 15); return [kind === 'unit' ? 1 : coTop(d, b, b > 2 ? minTop : 1), b, d.int(2, kind === 'natural' ? 30 : 12)]; }, ([x, y, z]) => FN[kind](x, y, z));
    return [V(0, a, b), nat(c)];
  }
  // (대분수 w a/b)와 (자연수 c)의 곱: 약분이 없고 분수 부분의 곱이 진분수(plain)·가분수(carry), 분모와 자연수를 약분(reduce), 곱이 자연수(natural).
  // 약분한 뒤 분자끼리의 곱이 150을 넘는 수는 뽑지 않는다(계산 원리를 이해하는 수준).
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
  // 두 진분수 a/b, c/e 의 곱: 단위분수끼리(units), 단위분수와 진분수(unitProper), 약분이 없다(plain), 한 번 약분(once), 엇갈려 두 번 약분(twice)
  function ffPick(d, kind) {
    const hi = kind === 'once' || kind === 'twice' ? 16 : 9;
    return d.until(() => {
      const b = d.int(2, hi), e = d.int(2, hi), unitA = kind === 'units' || (kind === 'unitProper' && d.bool()), unitC = kind === 'units' || (kind === 'unitProper' && !unitA);
      return [V(0, unitA ? 1 : coTop(d, b, b > 2 ? 2 : 1), b), V(0, unitC ? 1 : coTop(d, e, e > 2 ? 2 : 1), e)];
    }, ([x, y]) => {
      const g1 = gcd(x.n, y.d), g2 = gcd(y.n, x.d), cuts = (g1 > 1 ? 1 : 0) + (g2 > 1 ? 1 : 0);
      if (x.d === y.d && x.n === y.n) return false;
      if (kind === 'units') return x.d !== y.d;
      if (kind === 'unitProper') return cuts === 0 && x.n + y.n > 2 && x.d !== y.d;
      if (kind === 'plain') return cuts === 0 && x.n > 1 && y.n > 1;
      return cuts === (kind === 'once' ? 1 : 2) && x.n > 1 && y.n > 1 && x.d !== y.d;
    });
  }
  // 대분수가 있는 두 수의 곱. shape: 'MP' (대분수)×(진분수), 'PM' (진분수)×(대분수), 'MM' (대분수)×(대분수), 'PI' (진분수)×(가분수).
  // cut: 약분이 있는가(true·false, 따지지 않으면 null), whole: 곱이 자연수인가.
  function mmPick(d, shape, cut, whole) {
    const one = (kind) => { const b = d.int(2, kind === 'M' ? 9 : 12), n = coTop(d, b, kind === 'P' && b > 2 ? 2 : 1); return kind === 'M' ? V(d.int(1, 5), n, b) : kind === 'I' ? V(0, b + n, b) : V(0, n, b); };
    return d.until(() => [one(shape[0]), one(shape[1])], ([x, y]) => {
      const r = mul([x, y]), cuts = gcd(top(x), y.d) > 1 || gcd(top(y), x.d) > 1;
      return (r.q === 1) === Boolean(whole) && (cut == null || cuts === cut) && x.d !== y.d && r.q <= 60 && r.p <= 40 * r.q && r.p <= 150 && top(x) <= 40 && top(y) <= 40 && top(x) * top(y) <= (cuts ? 400 : 130);
    });
  }

  // ── 그림 ──
  const svg = (cls, w, h, label, body) => `<svg class="${cls}" style="vertical-align:middle" viewBox="0 0 ${w} ${h}" width="${Math.round(w)}" role="img" aria-label="${label}">${body}</svg>`;
  // 띠 한 칸(왼쪽 위 x, y / 너비 width): 똑같이 parts 칸으로 나누어 앞의 on 칸을 색칠한다.
  function bandAt(x, y, width, parts, on) {
    const pw = width / parts; let out = '';
    for (let i = 0; i < parts; i += 1) out += `<rect class="mb-piece${i < on ? ' is-on' : ''}" x="${(x + i * pw).toFixed(2)}" y="${y}" width="${pw.toFixed(2)}" height="24"/>`;
    return out;
  }
  // 띠 count 개를 아래로 쌓는다. 띠마다 똑같이 parts 칸으로 나누어 on 칸씩 색칠한다.
  function bands(parts, on, count) {
    let out = '';
    for (let k = 0; k < count; k += 1) out += bandAt(2, 2 + k * 30, 204, parts, on);
    return svg('mb-pieces', 208, count * 30 - 2, count === 1 ? `띠를 똑같이 ${parts}칸으로 나누어 ${on}칸을 색칠` : `띠 ${count}개를 각각 똑같이 ${parts}칸으로 나누어 띠마다 ${on}칸씩 색칠`, out);
  }
  // 대분수 v 만큼 색칠한 것을 count 줄: 한 줄에 모두 색칠한 띠 v.w 개와 v.d 칸 중 v.n 칸을 색칠한 띠 하나.
  function mixedBands(v, count) {
    const n = v.w + 1, bw = (208 - 8 * (n - 1)) / n; let out = '';
    for (let r = 0; r < count; r += 1) for (let j = 0; j < n; j += 1) out += bandAt(2 + j * (bw + 8), 2 + r * 32, bw, v.d, j < v.w ? v.d : v.n);
    return svg('mb-pieces', 212, count * 32 - 4, `한 줄에 모두 색칠한 띠 ${v.w}개와 똑같이 ${v.d}칸으로 나누어 ${v.n}칸을 색칠한 띠 1개가 있고, 이런 줄이 ${count}줄`, out);
  }
  // 0부터 spans 까지의 수직선(1을 똑같이 parts 칸). 0에서부터 작은 눈금 step 칸씩 count 번 뛴다.
  function hopLine(spans, parts, step, count) {
    const total = spans * parts, u = Math.min(22, 256 / total), x = (i) => 18 + i * u, y = 46, width = 36 + total * u;
    let out = `<line class="mb-axis" x1="${x(0)}" y1="${y}" x2="${x(total).toFixed(1)}" y2="${y}"/>`;
    for (let i = 0; i <= total; i += 1) { const big = i % parts === 0; out += `<line class="mb-axis" x1="${x(i).toFixed(1)}" y1="${y - (big ? 6 : 3.5)}" x2="${x(i).toFixed(1)}" y2="${y + (big ? 6 : 3.5)}"/>`; }
    for (let i = 0; i <= spans; i += 1) out += `<text class="mb-km-label" x="${x(i * parts).toFixed(1)}" y="${y + 20}" text-anchor="middle">${i}</text>`;
    for (let k = 0; k < count; k += 1) {
      const x1 = x(k * step), x2 = x((k + 1) * step), base = y - 8, cx = (x1 + x2) / 2, cy = base - 30;
      // 화살촉은 곡선이 끝점으로 들어오는 쪽을 향한다.
      const dx = x2 - cx, dy = base - cy, len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len, bx = x2 - ux * 6, by = base - uy * 6;
      out += `<path d="M${x1.toFixed(1)} ${base}Q${cx.toFixed(1)} ${cy} ${x2.toFixed(1)} ${base}" style="fill:none;stroke:#1d4ed8;stroke-width:1.6"/>`
        + `<path d="M${x2.toFixed(1)} ${base}L${(bx - uy * 3).toFixed(1)} ${(by + ux * 3).toFixed(1)}L${(bx + uy * 3).toFixed(1)} ${(by - ux * 3).toFixed(1)}Z" style="fill:#1d4ed8"/>`;
    }
    return svg('mb-numberline', Number(width.toFixed(1)), 72, `수직선: 0부터 ${spans}까지, 1을 똑같이 ${parts}칸으로 나누었다. 0에서 오른쪽으로 작은 눈금 ${step}칸씩 ${count}번 뛰었다`, out);
  }
  // 가로 cols 칸, 세로 rows 칸으로 똑같이 나눈 정사각형. shade(가로 자리, 세로 자리)가 0이면 흰 칸, 1이면 옅게, 2이면 진하게 칠한다.
  const FILL = ['#fff', '#dbeafe', '#3b82f6'];
  function areaGrid(cols, rows, shade, label, size) {
    const S = size || 120, cw = S / cols, rh = S / rows; let out = '';
    for (let r = 0; r < rows; r += 1) for (let c = 0; c < cols; c += 1) out += `<rect class="mb-piece" style="fill:${FILL[shade(c, r)]}" x="${(2 + c * cw).toFixed(2)}" y="${(2 + r * rh).toFixed(2)}" width="${cw.toFixed(2)}" height="${rh.toFixed(2)}"/>`;
    return svg('mb-pieces', S + 4, S + 4, label, out);
  }
  // 정사각형의 a/b(왼쪽 세로줄 a 칸)를 옅게 칠하고, 그 가운데 c/e(위쪽 가로줄 c 칸)를 진하게 칠한 그림
  const partOfPart = (a, b, c, e) => areaGrid(b, e, (x, y) => (x < a ? (y < c ? 2 : 1) : 0), `정사각형을 가로 ${b}칸, 세로 ${e}칸으로 똑같이 나누었다. 왼쪽 세로줄 ${a}칸을 옅게 색칠하고, 그 가운데 위쪽 가로줄 ${c}칸과 겹치는 칸을 진하게 색칠`);
  // 차례로 계산하는 칸. 조각은 칸에 적는 글이거나 { step: 화살표 위에 적는 글 }이다(kit.chain 은 분수 글의 '-' 를 바꾸어 쓸 수 없다).
  const flow = (parts) => '<div class="mb-chain">' + parts.map((part) => (part.step ? `<span class="mb-step">${part.step}</span>` : `<span class="mb-node">${part}</span>`)).join('') + '</div>';

  const CALC = '다음을 계산하시오.';
  const TOP_ONLY = '분모는 그대로 두고 분자와 자연수를 곱한다. ', CUT_FIRST = '분모와 자연수를 약분한 다음 곱하면 간단하다. ', TO_TOP = '대분수를 가분수로 나타낸 다음 곱한다. ', PAIRS = '분자는 분자끼리, 분모는 분모끼리 곱한다. ';
  // 몫과 나머지를 다시 셈하는 식(대분수의 자연수 부분과 분자)
  const quot = (num, den) => `(${num}-${num}%${den})/${den}`, rest = (num, den) => `${num}%${den}`;

  B.addUnit({
    id: '5-2-2', grade: 5, semester: 2, no: 2, title: '분수의 곱셈', version: 2,
    groups: [
      {
        id: 'fn', title: '(분수)×(자연수)', standard: STD,
        types: [
          T('fn-add-fig', '그림을 보고 덧셈식으로 (진분수)×(자연수) 알아보기', '①1 ②1 ③1 심6', (d) => {
            const [a, b, c] = d.until(() => { const b = d.int(3, 6); return [coTop(d, b), b, d.int(2, 4)]; }, ([x, y, z]) => gcd(y, z) === 1 && x * z > y && x * z < 3 * y);
            const f = frac(a, b), s = a * c, sum = Array.from({ length: c }, () => f).reduce((out, part, i) => out.concat(i ? ['+', part] : [part]), []);
            return M(`띠 ${c}개에 각각 ${f}만큼 색칠하였다. 색칠한 부분을 모두 더하는 과정이다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?`, labelled([c, s, Math.floor(s / b), s % b]), {
              figure: bands(b, a, c) + lines([eq(f, '*', c), eq('=', ...sum), eq('=', frac(`${a} × ${box(LAB[0])}`, b), '=', frac(box(LAB[1]), b), '=', mixed(box(LAB[2]), box(LAB[3]), b))]),
              explain: `${fj(a, b, '을/를')} ${c}번 더하면 분모는 그대로이고 분자는 ${a} × ${c} = ${s}이다. ${frac(s, b)} = ${mixed(Math.floor(s / b), s % b, b)}이다.`,
              facts: { calc: [[String(c), 0], [`${a}*${c}`, 1], [quot(`${a}*${c}`, b), 2], [rest(`${a}*${c}`, b), 3]] }
            });
          }),
          T('fn-line', '수직선을 보고 (분수)×(자연수) 알아보기', '①1·6 ②1·4', (d, n) => {
            if (n === 0) {
              // 곱하는 수(뛴 횟수)도 그림에서 읽는다.
              const [a, b, c] = d.until(() => { const b = d.int(3, 5); return [coTop(d, b, 2), b, d.int(2, 4)]; }, ([x, y, z]) => gcd(y, z) === 1 && x * z > y && x * z <= 3 * y);
              const s = a * c;
              return M(`수직선에서 0부터 ${frac(a, b)}씩 뛰어 세었다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?`, labelled([c, s, Math.floor(s / b), s % b]), {
                figure: hopLine(Math.ceil(s / b), b, a, c) + eq(frac(a, b), '*', box(LAB[0]), '=', frac(box(LAB[1]), b), '=', mixed(box(LAB[2]), box(LAB[3]), b)),
                explain: `${frac(a, b)}씩 ${c}번 뛰었으므로 ${frac(a, b)} × ${c}이다. 작은 눈금 한 칸은 ${frac(1, b)}이고 모두 ${a} × ${c} = ${s}(칸) 갔으므로 ${frac(s, b)} = ${mixed(Math.floor(s / b), s % b, b)}이다.`,
                facts: { calc: [[String(c), 0], [`${a}*${c}`, 1], [quot(`${a}*${c}`, b), 2], [rest(`${a}*${c}`, b), 3]] }
              });
            }
            const [a, b, c] = d.until(() => { const b = d.int(2, 4); return [coTop(d, b), b, d.int(2, 3)]; }, ([x, y, z]) => gcd(y, z) === 1 && (y + x) * z <= 5 * y);
            const v = V(1, a, b), t = top(v), s = t * c;
            return M(`수직선에서 0부터 ${show(v)}씩 ${c}번 뛰어 세었다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?`, labelled([t, s, Math.floor(s / b), s % b]), {
              figure: hopLine(Math.ceil(s / b), b, t, c) + lines([eq(show(v), '*', c, '=', frac(box(LAB[0]), b), '*', c), eq('=', frac(box(LAB[1]), b), '=', mixed(box(LAB[2]), box(LAB[3]), b))]),
              explain: `${show(v)} = ${frac(t, b)}이므로 한 번에 작은 눈금 ${t}칸씩 뛴다. ${c}번 뛰면 ${t} × ${c} = ${s}(칸)이므로 ${frac(s, b)} = ${mixed(Math.floor(s / b), s % b, b)}이다.`,
              facts: { calc: [[`1*${b}+${a}`, 0], [`(1*${b}+${a})*${c}`, 1], [quot(`(1*${b}+${a})*${c}`, b), 2], [rest(`(1*${b}+${a})*${c}`, b), 3]] }
            });
          }, { count: 2 }),
          T('fn-unit-count', '단위분수의 개수로 (진분수)×(자연수) 알아보기', '②1', (d) => {
            const [a, b, c] = d.until(() => { const b = d.int(5, 12); return [coTop(d, b, 2), b, d.int(2, 6)]; }, ([x, , z]) => x !== z);
            return N(`${fj(a, b, '은/는')} ${frac(1, b)}이 ${a}개인 수이다. ${frac(a, b)} × ${josa(c, '은/는')} ${frac(1, b)}이 몇 개인 수인가?`, a * c, {
              unit: '개', explain: `${frac(1, b)}이 ${a}개씩 ${c}번 있으므로 ${a} × ${c} = ${a * c}(개)이다. 그래서 ${frac(a, b)} × ${c} = ${frac(`${a} × ${c}`, b)}이다.`,
              facts: { calc: [[`${a}*${c}`, 0]] }
            });
          }),
          T('fn-fig-pick', '(진분수)×(자연수)만큼 바르게 색칠한 그림 고르기', '①5 ③67', (d) => {
            // 틀린 그림: 자연수를 분모에 곱한 것(a/(b×c)), 분모와 분자에 모두 곱한 것((a×c)/(b×c))
            const [a, b, c] = d.until(() => { const b = d.int(3, 5); return [coTop(d, b, 2), b, d.int(2, 4)]; }, ([, y, z]) => y * z <= 20);
            const rows = d.shuffle([[bands(b, a, c), `${a}*${c}/${b}`, true], [bands(b * c, a, 1), `${a}/(${b}*${c})`], [bands(b * c, a * c, 1), `${a}*${c}/(${b}*${c})`]]), hit = rows.findIndex((row) => row[2]);
            return C(`크기가 같은 띠에 ${frac(a, b)} × ${c}만큼 색칠하려고 한다. 바르게 색칠한 것은?`, THREE, hit, {
              figure: tagged(rows.map((row) => row[0])),
              explain: `${frac(a, b)} × ${josa(c, '은/는')} ${fj(a, b, '을/를')} ${c}번 더한 것이다. 띠를 똑같이 ${b}칸으로 나누어 ${a}칸씩 색칠한 띠가 ${c}개인 ${LAB[hit]}이 바르다. 나머지는 띠 하나의 ${frac(a, b * c)}, ${frac(a * c, b * c)}만큼 색칠한 것이다.`,
              facts: { choose: { exprs: rows.map((row) => row[1]), rule: 'equals', target: a * c / b } }
            });
          }),
          T('fn-steps-after', '(진분수)×(자연수): 곱한 뒤 약분하는 과정', '①2 ②2 ③2 심6', (d) => {
            const [f, k] = fnPick(d, 'reduce'), a = f.n, b = f.d, c = k.w, g = gcd(b, c), s = a * c, q2 = b / g, p2 = s / g, e = `${a}*${c}*${q2}/${b}`;
            return M('분자와 자연수를 곱한 다음 약분하여 계산하는 과정이다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?', labelled([s, p2, Math.floor(p2 / q2), p2 % q2]), {
              figure: lines([eq(show(f), '*', c, '=', frac(`${a} × ${c}`, b), '=', frac(box(LAB[0]), b)), eq('=', frac(box(LAB[1]), q2), '=', mixed(box(LAB[2]), box(LAB[3]), q2))]),
              explain: `${a} × ${c} = ${s}이므로 ${frac(s, b)}이다. 분모와 분자를 각각 ${josa(g, '으로/로')} 나누면 ${frac(p2, q2)}이고, 대분수로 나타내면 ${mixed(Math.floor(p2 / q2), p2 % q2, q2)}이다.`,
              facts: { calc: [[`${a}*${c}`, 0], [e, 1], [quot(e, q2), 2], [rest(e, q2), 3]] }
            });
          }),
          T('fn-steps-before', '(진분수)×(자연수): 곱하기 전에 약분하는 과정', '①2·3 ②2 ③2', (d) => {
            const [f, k] = d.until(() => fnPick(d, 'reduce'), ([x, y]) => y.w / gcd(x.d, y.w) >= 2), a = f.n, b = f.d, c = k.w, g = gcd(b, c);
            return M(`분모 ${josa(b, '과/와')} 자연수 ${josa(c, '을/를')} 각각 ${josa(g, '으로/로')} 나누어 약분한 다음 곱하는 과정이다. ㉠, ㉡, ㉢에 알맞은 수는?`, labelled([c / g, b / g, a * c / g]), {
              figure: lines([eq(show(f), '*', c), eq('=', frac(`${a} × ${box(LAB[0])}`, box(LAB[1])), '=', frac(box(LAB[2]), box(LAB[1])))]),
              explain: `${c} ÷ ${g} = ${c / g}, ${b} ÷ ${g} = ${b / g}이므로 ${frac(`${a} × ${c / g}`, b / g)} = ${frac(a * c / g, b / g)}이다. 곱한 다음 약분한 결과와 같다.`,
              facts: { calc: [[`${c}/${g}`, 0], [`${b}/${g}`, 1], [`${a}*${c}/${g}`, 2]] }
            });
          }),
          T('fn-same-forms', '(진분수)×(자연수)와 같지 않은 것 찾기', '②7 심18', (d) => {
            // 틀린 것: 자연수를 분모에 곱한 것, 분모와 분자에 모두 곱한 것 가운데 하나
            const [a, b, c] = d.until(() => { const b = d.int(5, 11); return [coTop(d, b, 2), b, d.int(2, 3)]; }, ([, y, z]) => gcd(y, z) === 1);
            const f = frac(a, b), sum = Array.from({ length: c }, () => f).reduce((out, part, i) => out.concat(i ? ['+', part] : [part]), []), both = d.bool();
            const rows = d.shuffle([[eq(...sum), Array.from({ length: c }, () => `${a}/${b}`).join('+')], [ex(frac(`${a} × ${c}`, b)), `${a}*${c}/${b}`], [ex(frac(a * c, b)), `${a * c}/${b}`], [ex(both ? frac(`${a} × ${c}`, `${b} × ${c}`) : frac(a, `${b} × ${c}`)), both ? `${a}*${c}/(${b}*${c})` : `${a}/(${b}*${c})`, true]]);
            return C(`${f} × ${josa(c, '과/와')} 계산 결과가 같지 않은 것은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[2]), {
              explain: `${f} × ${josa(c, '은/는')} ${fj(a, b, '을/를')} ${c}번 더한 것이므로 분모는 그대로 두고 분자에만 ${josa(c, '을/를')} 곱한다. ${f} × ${c} = ${frac(`${a} × ${c}`, b)} = ${frac(a * c, b)}이다. ${both ? '분모에도 곱하면 처음 분수와 크기가 같아진다.' : '분모에 곱하면 처음 분수보다 작아진다.'}`,
              facts: { choose: { exprs: rows.map((row) => row[1]), rule: 'odd' } }
            });
          }),
          T('fn-calc', '(진분수)×(자연수)', '①4 ②3 ③3 심1', (d, n) => {
            // 문항마다 계산 구조가 다르다: 약분이 없고 곱이 진분수, 약분이 없고 곱이 대분수, 분모와 자연수를 약분(곱이 대분수), 약분하면 곱이 진분수, 단위분수.
            const kind = ['plain', 'over', 'reduce', 'reduceProper', 'unit'][n], vs = fnPick(d, kind, kind === 'plain' ? 2 : 1);
            return ans(CALC, vs, { figure: times(vs), explain: (kind === 'reduce' || kind === 'reduceProper' ? CUT_FIRST : TOP_ONLY) + told(vs) + '이다.', facts: { rule: 'fn-' + kind } });
          }, { count: 5 }),
          T('fn-natural', '(진분수)×(자연수): 곱이 자연수', '①4 ③3', (d) => {
            const vs = fnPick(d, 'natural');
            return ans(CALC, vs, { kind: 'nat', figure: times(vs), explain: `자연수가 분모의 배수이므로 약분하면 분모가 1이 된다. ${told(vs)}이다.`, facts: { rule: 'fn-natural' } });
          }),
          T('fn-mixed-fig', '그림을 보고 (대분수)×(자연수) 알아보기', '①6·8 ②4', (d) => {
            const [v, k] = d.until(() => mnPick(d, 'plain', 2, 7, 3), ([x]) => x.d >= 3), w = v.w, a = v.n, b = v.d, c = k.w, f = frac(a, b);
            return M(`그림과 같이 ${show(v)}만큼씩 ${c}줄을 색칠하였다. 색칠한 부분을 모두 구하는 과정이다. ㉠, ㉡, ㉢에 알맞은 수는?`, labelled([c, w * c, a * c]), {
              figure: mixedBands(v, c) + lines([eq(show(v), '*', c), eq('=', par(w, '*', box(LAB[0])), '+', par(f, '*', box(LAB[0]))), eq('=', box(LAB[1]), '+', frac(box(LAB[2]), b), '=', mixed(box(LAB[1]), box(LAB[2]), b))]),
              explain: `모두 색칠한 띠는 ${w} × ${c} = ${w * c}(개)이고, 나머지 띠에 색칠한 부분은 ${f} × ${c} = ${frac(a * c, b)}이다. 그래서 ${show(v)} × ${c} = ${mixed(w * c, a * c, b)}이다.`,
              facts: { calc: [[String(c), 0], [`${w}*${c}`, 1], [`${a}*${c}`, 2]] }
            });
          }),
          T('fn-mixed-split', '(대분수)×(자연수): 자연수 부분과 분수 부분으로 나누어 곱하는 과정', '①6 ②4 ③4', (d, n) => {
            // 첫째 문항은 분수 부분의 곱이 가분수(약분 없음), 둘째 문항은 분수 부분의 곱을 약분한다.
            const [v, k] = d.until(() => mnPick(d, n === 0 ? 'carry' : 'reduce', 4, 10, 9), ([x, y]) => x.n * y.w > x.d), w = v.w, a = v.n, b = v.d, c = k.w, g = gcd(b, c), b2 = b / g, p = a * c / g, e = n === 0 ? `${a}*${c}` : `${a}*${c}*${b2}/${b}`;
            return M('대분수를 자연수 부분과 분수 부분으로 나누어 곱하는 과정이다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?', labelled([w * c, p, p % b2, w * c + Math.floor(p / b2)]), {
              figure: lines([eq(show(v), '*', c), eq('=', par(w, '*', c), '+', par(frac(a, b), '*', c)), eq('=', box(LAB[0]), '+', frac(box(LAB[1]), b2)), eq('=', box(LAB[0]), '+', mixed(Math.floor(p / b2), box(LAB[2]), b2), '=', mixed(box(LAB[3]), box(LAB[2]), b2))]),
              explain: `${w} × ${c} = ${w * c}이고, ${frac(a, b)} × ${c} = ${frac(p, b2)} = ${mixed(Math.floor(p / b2), p % b2, b2)}이다. 두 곱을 더하면 ${w * c} + ${mixed(Math.floor(p / b2), p % b2, b2)} = ${res([v, k])}이다.`,
              facts: { calc: [[`${w}*${c}`, 0], [e, 1], [rest(e, b2), 2], [`${w}*${c}+${quot(e, b2)}`, 3]], rule: ['splitCarry', 'splitReduce'][n] }
            });
          }, { count: 2 }),
          T('fn-mixed-improper', '(대분수)×(자연수): 가분수로 나타내어 곱하는 과정', '①6 ②4 ③4', (d) => {
            const [v, k] = mnPick(d, d.bool() ? 'plain' : 'carry', 4, 9, 7), b = v.d, c = k.w, t = top(v), s = t * c, e = `(${v.w}*${b}+${v.n})*${c}`;
            return M('대분수를 가분수로 나타내어 곱하는 과정이다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?', labelled([t, s, Math.floor(s / b), s % b]), {
              figure: lines([eq(show(v), '*', c, '=', frac(box(LAB[0]), b), '*', c), eq('=', frac(box(LAB[1]), b), '=', mixed(box(LAB[2]), box(LAB[3]), b))]),
              explain: `${show(v)} = ${frac(t, b)}이다. ${frac(t, b)} × ${c} = ${frac(`${t} × ${c}`, b)} = ${frac(s, b)}이고, 대분수로 나타내면 ${mixed(Math.floor(s / b), s % b, b)}이다.`,
              facts: { calc: [[`${v.w}*${b}+${v.n}`, 0], [e, 1], [quot(e, b), 2], [rest(e, b), 3]] }
            });
          }),
          T('fn-method', '(대분수)×(자연수)를 어떤 방법으로 계산했는지 알기', '①3·7 ②6 ③68 심8·9', (d) => {
            // 가분수로 나타내어 계산한 것과 자연수 부분·분수 부분으로 나누어 계산한 것 가운데 하나를 보인다. 약분은 없다.
            const [v, k] = mnPick(d, 'carry', 3, 8, 5), w = v.w, a = v.n, b = v.d, c = k.w, t = top(v), s = t * c, byTop = d.bool(), last = mixed(Math.floor(s / b), s % b, b);
            const shown = byTop
              ? [eq(show(v), '*', c, '=', frac(t, b), '*', c), eq('=', frac(s, b), '=', last)]
              : [eq(show(v), '*', c), eq('=', par(w, '*', c), '+', par(frac(a, b), '*', c)), eq('=', w * c, '+', frac(a * c, b)), eq('=', w * c, '+', mixed(Math.floor(a * c / b), a * c % b, b), '=', last)];
            const rows = d.shuffle([['대분수를 가분수로 나타내어 계산하였다.', byTop], ['대분수를 자연수 부분과 분수 부분으로 나누어 계산하였다.', !byTop], ['분모와 자연수를 약분한 다음 곱하였다.', false], ['대분수의 자연수 부분에만 자연수를 곱하였다.', false]]);
            return C('다음 계산에 대한 설명으로 옳은 것은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
              figure: lines(shown),
              explain: (byTop ? `${vj(v, '을/를')} ${frac(t, b)}${tail(t, '으로/로')} 고쳐서 곱하였다.` : `${show(v)}의 자연수 부분 ${josa(w, '과/와')} 분수 부분 ${frac(a, b)}에 각각 ${josa(c, '을/를')} 곱하여 더하였다.`) + ` 분모 ${josa(b, '과/와')} 자연수 ${josa(c, '은/는')} 약분되지 않는다.`,
              facts: { truth: rows.map((row) => row[1]), want: true }
            });
          }),
          T('fn-mixed-calc', '(대분수)×(자연수)', '①8 ②5 ③5 심1', (d, n) => {
            // 첫째 문항은 약분이 없고 분수 부분의 곱이 가분수, 둘째 문항은 분모와 자연수를 약분한다.
            const vs = mnPick(d, ['carry', 'reduce'][n]);
            return ans(CALC, vs, { figure: times(vs), explain: (n === 0 ? TO_TOP : '대분수를 가분수로 나타낸 다음 분모와 자연수를 약분하여 곱한다. ') + told(vs) + '이다.', facts: { rule: ['mn-carry', 'mn-reduce'][n] } });
          }, { count: 2 }),
          T('fn-mixed-natural', '(대분수)×(자연수): 곱이 자연수', '①8 ③5', (d) => {
            const vs = mnPick(d, 'natural', 5, 9, 27);
            return ans(CALC, vs, { kind: 'nat', figure: times(vs), explain: `${TO_TOP}자연수가 분모의 배수이므로 약분하면 분모가 1이 된다. ${told(vs)}이다.`, facts: { rule: 'mn-natural' } });
          })
        ]
      },
      {
        id: 'nf', title: '(자연수)×(분수)', standard: STD,
        types: [
          T('nf-fig-groups', '묶음 그림을 보고 (자연수)×(진분수) 알아보기', '①9 ②10', (d) => {
            const b = d.int(3, 6), per = d.int(2, 4), a = coTop(d, b, 2), total = b * per;
            return M(`구슬 ${total}개를 똑같이 ${b}묶음으로 나누고 그 가운데 ${a}묶음을 색칠하였다. ㉠, ㉡에 알맞은 수는?`, labelled([per, per * a]), {
              figure: dots(per, b, { loop: 'cols', on: a }) + lines([eq(total, '*', frac(1, b), '=', box(LAB[0])), eq(total, '*', frac(a, b), '=', box(LAB[1]))]),
              explain: `${total}의 ${fj(1, b, '은/는')} 한 묶음이므로 ${total} × ${frac(1, b)} = ${per}이다. ${total}의 ${fj(a, b, '은/는')} ${a}묶음이므로 ${total} × ${frac(a, b)} = ${per} × ${a} = ${per * a}이다.`,
              facts: { calc: [[`${total}/${b}`, 0], [`${total}/${b}*${a}`, 1]] }
            });
          }),
          T('nf-fig-bands', '그림을 보고 (자연수)×(단위분수) 알아보기', '①9·10 ②10', (d) => {
            const [b, c] = d.until(() => [d.int(3, 5), d.int(4, 7)], ([y, z]) => gcd(y, z) === 1 && z > y && z < 2 * y);
            return M(`띠 ${c}개를 각각 똑같이 ${b}칸으로 나누어 한 칸씩 색칠하였다. 색칠한 부분은 띠 ${c}개의 ${frac(1, b)}이다. ㉠, ㉡, ㉢에 알맞은 수는?`, labelled([c, 1, c - b]), {
              figure: bands(b, 1, c) + eq(c, '*', frac(1, b), '=', frac(box(LAB[0]), b), '=', mixed(box(LAB[1]), box(LAB[2]), b)),
              explain: `색칠한 칸은 ${c}칸이고 한 칸은 띠 하나의 ${frac(1, b)}이므로 ${c} × ${frac(1, b)} = ${frac(c, b)}이다. 대분수로 나타내면 ${mixed(1, c - b, b)}이다.`,
              facts: { calc: [[String(c), 0], [quot(String(c), b), 1], [rest(String(c), b), 2]] }
            });
          }),
          T('nf-steps-unit', '단위분수의 몇 배로 (자연수)×(진분수) 계산하기', '①10 ②10 ③6', (d) => {
            const [a, b, c] = d.until(() => { const b = d.int(4, 9); return [coTop(d, b, 2), b, d.int(2, 7)]; }, ([x, y, z]) => gcd(y, z) === 1 && z < y && x * z > y && x !== z), s = a * c;
            return M(`${c} × ${fj(a, b, '을/를')} ${c} × ${frac(1, b)}의 ${a}배로 생각하여 계산하는 과정이다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?`, labelled([c, s, Math.floor(s / b), s % b]), {
              figure: lines([eq(c, '*', frac(a, b), '=', par(c, '*', frac(1, b)), '*', a), eq('=', frac(box(LAB[0]), b), '*', a, '=', frac(box(LAB[1]), b)), eq('=', mixed(box(LAB[2]), box(LAB[3]), b))]),
              explain: `${c} × ${frac(1, b)} = ${frac(c, b)}이고, ${frac(c, b)} × ${a} = ${frac(`${c} × ${a}`, b)} = ${frac(s, b)}이다. 대분수로 나타내면 ${mixed(Math.floor(s / b), s % b, b)}이다.`,
              facts: { calc: [[String(c), 0], [`${c}*${a}`, 1], [quot(`${c}*${a}`, b), 2], [rest(`${c}*${a}`, b), 3]] }
            });
          }),
          T('nf-steps-mid', '(자연수)×(진분수): 곱하는 과정에서 약분하기', '②11 ③7 ①2', (d) => {
            const [f, k] = d.until(() => fnPick(d, 'reduce'), ([x, y]) => y.w / gcd(x.d, y.w) >= 2), a = f.n, b = f.d, c = k.w, g = gcd(b, c), c2 = c / g, b2 = b / g, p = a * c2;
            return M(`자연수 ${josa(c, '과/와')} 분모 ${josa(b, '을/를')} 각각 ${josa(g, '으로/로')} 나누어 약분하는 과정이다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?`, labelled([c2, b2, p, p % b2]), {
              figure: lines([eq(c, '*', show(f), '=', frac(`${c} × ${a}`, b)), eq('=', frac(`${box(LAB[0])} × ${a}`, box(LAB[1])), '=', frac(box(LAB[2]), box(LAB[1]))), eq('=', mixed(Math.floor(p / b2), box(LAB[3]), box(LAB[1])))]),
              explain: `${c} ÷ ${g} = ${c2}, ${b} ÷ ${g} = ${b2}이므로 ${frac(`${c2} × ${a}`, b2)} = ${frac(p, b2)}이다. 대분수로 나타내면 ${mixed(Math.floor(p / b2), p % b2, b2)}이다.`,
              facts: { calc: [[`${c}/${g}`, 0], [`${b}/${g}`, 1], [`${c}*${a}/${g}`, 2], [`${c}*${a}/${g}%(${b}/${g})`, 3]] }
            });
          }),
          T('nf-over-one', '자연수를 분모가 1인 분수로 나타내어 곱하기', '②15 심8', (d) => {
            const [f, k] = fnPick(d, 'over'), a = f.n, b = f.d, c = k.w, s = c * a;
            return M('자연수를 분모가 1인 분수로 나타내어 계산하는 과정이다. ㉠, ㉡, ㉢에 알맞은 수는?', labelled([c, s, s % b]), {
              figure: lines([eq(c, '*', show(f), '=', frac(box(LAB[0]), 1), '*', show(f)), eq('=', frac(`${box(LAB[0])} × ${a}`, `1 × ${b}`), '=', frac(box(LAB[1]), b)), eq('=', mixed(Math.floor(s / b), box(LAB[2]), b))]),
              explain: `${c} = ${frac(c, 1)}이므로 분자는 분자끼리, 분모는 분모끼리 곱하면 ${frac(`${c} × ${a}`, `1 × ${b}`)} = ${frac(s, b)}이다. 대분수로 나타내면 ${mixed(Math.floor(s / b), s % b, b)}이다.`,
              facts: { calc: [[String(c), 0], [`${c}*${a}`, 1], [rest(`${c}*${a}`, b), 2]] }
            });
          }),
          T('nf-same-forms', '「자연수의 몇 분의 몇」과 다른 것 찾기', '③11', (d) => {
            // 틀린 것: 자연수와 분수를 그대로 붙여 대분수로 적은 것(9의 3/4 을 9 3/4 이라고 여기는 아이가 고른다).
            const [f, k] = fnPick(d, 'over'), a = f.n, b = f.d, c = k.w, s = c * a, w = Math.floor(s / b), r = s % b;
            const rows = d.shuffle([[eq(c, '*', show(f)), `${c}*${a}/${b}`], [ex(frac(s, b)), `${s}/${b}`], [ex(mixed(w, r, b)), `${w}+${r}/${b}`], [ex(mixed(c, a, b)), `${c}+${a}/${b}`, true]]);
            return C(`${c}의 ${fj(a, b, '과/와')} 다른 것은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[2]), {
              explain: `${c}의 ${fj(a, b, '은/는')} ${c} × ${frac(a, b)} = ${frac(s, b)} = ${mixed(w, r, b)}이다. ${mixed(c, a, b)}${tail(a, '은/는')} ${josa(c, '과/와')} ${frac(a, b)}의 합이다.`,
              facts: { choose: { exprs: rows.map((row) => row[1]), rule: 'odd' } }
            });
          }),
          T('nf-calc', '(자연수)×(진분수)', '①11 ②12 ③8 심1', (d, n) => {
            // 문항마다 계산 구조가 다르다: 약분이 없고 곱이 진분수, 약분이 없고 곱이 대분수, 자연수와 분모를 약분(곱이 대분수), 약분하면 곱이 진분수.
            const kind = ['plain', 'over', 'reduce', 'reduceProper'][n], vs = fnPick(d, kind).reverse();
            return ans(CALC, vs, { figure: times(vs), explain: (n >= 2 ? '자연수와 분모를 약분한 다음 곱하면 간단하다. ' : '분모는 그대로 두고 자연수와 분자를 곱한다. ') + told(vs) + '이다.', facts: { rule: 'nf-' + kind } });
          }, { count: 4 }),
          T('nf-natural', '(자연수)×(진분수): 곱이 자연수', '①11 ②12 ③8', (d) => {
            const vs = fnPick(d, 'natural').reverse();
            return ans(CALC, vs, { kind: 'nat', figure: times(vs), explain: `자연수가 분모의 배수이므로 약분하면 분모가 1이 된다. ${told(vs)}이다.`, facts: { rule: 'nf-natural' } });
          }),
          T('nf-mixed-split', '(자연수)×(대분수): 자연수 부분과 분수 부분에 각각 곱하는 과정', '①12 ②13 ③9', (d) => {
            // 분수 부분과의 곱이 자연수가 되는 수(자연수가 분모의 배수)
            const [w, a, b, k] = d.until(() => { const b = d.int(2, 8); return [d.int(1, 4), coTop(d, b), b, d.int(1, 4)]; }, ([, , y, z]) => y * z <= 18 && y * z >= 4), c = b * k, v = V(w, a, b);
            return M('자연수에 대분수의 자연수 부분과 분수 부분을 각각 곱하는 과정이다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?', labelled([w, c * w, k * a, c * w + k * a]), {
              figure: lines([eq(c, '*', show(v)), eq('=', par(c, '*', box(LAB[0])), '+', par(c, '*', frac(a, b))), eq('=', box(LAB[1]), '+', box(LAB[2]), '=', box(LAB[3]))]),
              explain: `${show(v)} = ${w} + ${frac(a, b)}이다. ${c} × ${w} = ${c * w}이고, ${c} × ${frac(a, b)} = ${k * a}이므로 ${c * w} + ${k * a} = ${c * w + k * a}이다.`,
              facts: { calc: [[String(w), 0], [`${c}*${w}`, 1], [`${c}*${a}/${b}`, 2], [`${c}*${w}+${c}*${a}/${b}`, 3]] }
            });
          }),
          T('nf-mixed-improper', '(자연수)×(대분수): 가분수로 나타내고 약분하여 곱하는 과정', '①12 ②13 ③9', (d) => {
            const [v, k] = d.until(() => mnPick(d, 'reduce', 4, 10, 9), ([x, y]) => y.w / gcd(x.d, y.w) >= 2), b = v.d, c = k.w, g = gcd(b, c), c2 = c / g, b2 = b / g, t = top(v), p = c2 * t, e = `${c2}*(${v.w}*${b}+${v.n})`;
            return M('대분수를 가분수로 나타낸 다음 약분하여 곱하는 과정이다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?', labelled([t, p, Math.floor(p / b2), p % b2]), {
              figure: lines([eq(c, '*', show(v), '=', c, '*', frac(box(LAB[0]), b)), eq('=', frac(`${c2} × ${box(LAB[0])}`, b2), '=', frac(box(LAB[1]), b2)), eq('=', mixed(box(LAB[2]), box(LAB[3]), b2))]),
              explain: `${show(v)} = ${frac(t, b)}이다. 자연수 ${josa(c, '과/와')} 분모 ${josa(b, '을/를')} 각각 ${josa(g, '으로/로')} 나누면 ${frac(`${c2} × ${t}`, b2)} = ${frac(p, b2)}이고, 대분수로 나타내면 ${mixed(Math.floor(p / b2), p % b2, b2)}이다.`,
              facts: { calc: [[`${v.w}*${b}+${v.n}`, 0], [e, 1], [quot(e, b2), 2], [rest(e, b2), 3]] }
            });
          }),
          T('nf-mixed-calc', '(자연수)×(대분수)', '①13 ②14 ③10 심1', (d, n) => {
            // 첫째 문항은 약분이 없고, 둘째 문항은 자연수와 분모를 약분한다.
            const vs = mnPick(d, ['plain', 'reduce'][n]).reverse();
            return ans(CALC, vs, { figure: times(vs), explain: (n === 0 ? TO_TOP : '대분수를 가분수로 나타낸 다음 자연수와 분모를 약분하여 곱한다. ') + told(vs) + '이다.', facts: { rule: ['nm-plain', 'nm-reduce'][n] } });
          }, { count: 2 }),
          T('nf-mixed-natural', '(자연수)×(대분수): 곱이 자연수', '①13 ②14 ③10', (d) => {
            const vs = mnPick(d, 'natural', 5, 9, 27).reverse();
            return ans(CALC, vs, { kind: 'nat', figure: times(vs), explain: `${TO_TOP}자연수가 분모의 배수이므로 약분하면 분모가 1이 된다. ${told(vs)}이다.`, facts: { rule: 'nm-natural' } });
          })
        ]
      },
      {
        id: 'ff', title: '(진분수)×(진분수)와 세 분수의 곱셈', standard: STD,
        types: [
          T('ff-fig-unit', '그림을 보고 (단위분수)×(단위분수) 알아보기', '①15 ②18 ③12', (d) => {
            const [b, e] = d.until(() => [d.int(2, 6), d.int(2, 6)], ([x, y]) => x !== y);
            return M(`정사각형의 ${fj(1, b, '을/를')} 옅게 색칠하고, 색칠한 부분의 ${fj(1, e, '을/를')} 다시 진하게 색칠하였다. ㉠, ㉡에 알맞은 수는?`, labelled([e, b * e]), {
              figure: partOfPart(1, b, 1, e) + eq(frac(1, b), '*', frac(1, e), '=', frac(1, `${b} × ${box(LAB[0])}`), '=', frac(1, box(LAB[1]))),
              explain: `진하게 색칠한 부분은 정사각형을 똑같이 ${b} × ${e} = ${b * e}(칸)으로 나눈 것 가운데 한 칸이다. ${frac(1, b)} × ${frac(1, e)} = ${frac(1, `${b} × ${e}`)} = ${frac(1, b * e)}이다.`,
              facts: { calc: [[String(e), 0], [`${b}*${e}`, 1]] }
            });
          }),
          T('ff-fig', '그림을 보고 (진분수)×(진분수) 알아보기', '①16 ②19 ③13', (d) => {
            const [f, g] = d.until(() => ffPick(d, 'plain'), ([x, y]) => x.d <= 6 && y.d <= 6 && x.d !== y.d), a = f.n, b = f.d, c = g.n, e = g.d;
            return M(`정사각형의 ${vj(f, '을/를')} 옅게 색칠하고, 색칠한 부분의 ${vj(g, '을/를')} 다시 진하게 색칠하였다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?`, labelled([c, e, a * c, b * e]), {
              figure: partOfPart(a, b, c, e) + eq(show(f), '*', show(g), '=', frac(`${a} × ${box(LAB[0])}`, `${b} × ${box(LAB[1])}`), '=', frac(box(LAB[2]), box(LAB[3]))),
              explain: `정사각형은 똑같이 ${b} × ${e} = ${b * e}(칸)으로 나누어지고, 진하게 색칠한 칸은 ${a} × ${c} = ${a * c}(칸)이다. ${show(f)} × ${show(g)} = ${frac(`${a} × ${c}`, `${b} × ${e}`)} = ${frac(a * c, b * e)}이다.`,
              facts: { calc: [[String(c), 0], [String(e), 1], [`${a}*${c}`, 2], [`${b}*${e}`, 3]] }
            });
          }),
          T('ff-fig-pick', '(진분수)×(진분수)만큼 바르게 색칠한 그림 고르기', '①17 ②19 ③67', (d) => {
            // 틀린 그림: 두 분수만큼을 각각 다 칠한 것(겹친 부분만 곱이라는 것을 모르는 아이), 앞의 분수만큼만 칠한 것
            const [f, g] = d.until(() => ffPick(d, 'plain'), ([x, y]) => x.d <= 5 && y.d <= 5 && x.d !== y.d), a = f.n, b = f.d, c = g.n, e = g.d, head = `정사각형을 가로 ${b}칸, 세로 ${e}칸으로 똑같이 나누었다. `;
            const rows = d.shuffle([
              [areaGrid(b, e, (x, y) => (x < a && y < c ? 2 : 0), head + `왼쪽 세로줄 ${a}칸과 위쪽 가로줄 ${c}칸이 겹치는 칸만 색칠`, 84), `${a}*${c}/(${b}*${e})`, true],
              [areaGrid(b, e, (x, y) => (x < a || y < c ? 2 : 0), head + `왼쪽 세로줄 ${a}칸과 위쪽 가로줄 ${c}칸을 모두 색칠`, 84), `(${a}*${e}+${c}*${b}-${a}*${c})/(${b}*${e})`],
              [areaGrid(b, e, (x) => (x < a ? 2 : 0), head + `왼쪽 세로줄 ${a}칸을 모두 색칠`, 84), `${a}*${e}/(${b}*${e})`]
            ]), hit = rows.findIndex((row) => row[2]);
            return C(`정사각형에 ${show(f)} × ${show(g)}만큼 색칠하려고 한다. 바르게 색칠한 것은?`, THREE, hit, {
              figure: B.kit.geo.tiles(rows.map((row, i) => [LAB[i], row[0]])),
              explain: `${show(f)} × ${vj(g, '은/는')} 정사각형의 ${show(f)} 가운데 ${show(g)}만큼이다. 똑같이 나눈 ${b * e}칸 가운데 ${a} × ${c} = ${a * c}(칸)을 색칠한 ${LAB[hit]}이 바르다.`,
              facts: { choose: { exprs: rows.map((row) => row[1]), rule: 'equals', target: a * c / (b * e) } }
            });
          }),
          T('ff-words', '(진분수)×(진분수)의 뜻을 말로 나타내기', '①16', (d) => {
            const [f, g] = d.until(() => ffPick(d, 'plain'), ([x, y]) => x.d <= 7 && y.d <= 7 && x.d !== y.d), a = f.n, b = f.d, c = g.n, e = g.d;
            return M(`전체를 똑같이 ${josa(b, '으로/로')} 나눈 것 중의 ${josa(a, '을/를')} 다시 똑같이 ${josa(e, '으로/로')} 나눈 것 중의 ${josa(c, '은/는')}, 전체를 똑같이 ㉠으로 나눈 것 중의 ㉡이다. ㉠, ㉡에 알맞은 수는?`, labelled([b * e, a * c]), {
              figure: eq(show(f), '*', show(g)),
              explain: `전체는 똑같이 ${b} × ${e} = ${josa(b * e, '으로/로')} 나누어지고, 그 가운데 ${a} × ${c} = ${a * c}이다. ${show(f)} × ${show(g)} = ${frac(a * c, b * e)}이다.`,
              facts: { calc: [[`${b}*${e}`, 0], [`${a}*${c}`, 1]] }
            });
          }),
          T('ff-steps-after', '(진분수)×(진분수): 곱한 뒤 약분하는 과정', '②20 ③14 ①2', (d) => {
            const [f, g] = d.until(() => ffPick(d, 'once'), ([x, y]) => x.d * y.d <= 120), a = f.n, b = f.d, c = g.n, e = g.d, k = gcd(a * c, b * e), q2 = b * e / k;
            return M('분자는 분자끼리, 분모는 분모끼리 곱한 다음 약분하는 과정이다. ㉠, ㉡, ㉢에 알맞은 수는?', labelled([a * c, b * e, a * c / k]), {
              figure: lines([eq(show(f), '*', show(g), '=', frac(`${a} × ${c}`, `${b} × ${e}`), '=', frac(box(LAB[0]), box(LAB[1]))), eq('=', frac(box(LAB[2]), q2))]),
              explain: `${frac(`${a} × ${c}`, `${b} × ${e}`)} = ${frac(a * c, b * e)}이다. 분모와 분자를 각각 ${josa(k, '으로/로')} 나누면 ${frac(a * c / k, q2)}이다.`,
              facts: { calc: [[`${a}*${c}`, 0], [`${b}*${e}`, 1], [`${a}*${c}*${q2}/(${b}*${e})`, 2]] }
            });
          }),
          T('ff-steps-before', '(진분수)×(진분수): 약분한 다음 곱하는 과정', '②20 ③14 ①2', (d) => {
            const [f, g] = ffPick(d, 'twice'), a = f.n, b = f.d, c = g.n, e = g.d, g1 = gcd(a, e), g2 = gcd(c, b);
            return M(`분자와 분모를 약분한 다음 곱하는 과정이다. 분자 ${josa(a, '과/와')} 분모 ${josa(e, '은/는')} 각각 ${josa(g1, '으로/로')}, 분자 ${josa(c, '과/와')} 분모 ${josa(b, '은/는')} 각각 ${josa(g2, '으로/로')} 나누었다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?`, labelled([a / g1, c / g2, b / g2, e / g1]), {
              figure: eq(show(f), '*', show(g), '=', frac(`${box(LAB[0])} × ${box(LAB[1])}`, `${box(LAB[2])} × ${box(LAB[3])}`)),
              explain: `${a} ÷ ${g1} = ${a / g1}, ${e} ÷ ${g1} = ${e / g1}이고 ${c} ÷ ${g2} = ${c / g2}, ${b} ÷ ${g2} = ${b / g2}이다. ${frac(`${a / g1} × ${c / g2}`, `${b / g2} × ${e / g1}`)} = ${res([f, g])}이다.`,
              facts: { calc: [[`${a}/${g1}`, 0], [`${c}/${g2}`, 1], [`${b}/${g2}`, 2], [`${e}/${g1}`, 3]] }
            });
          }),
          T('ff-missing-top', '곱셈식의 빈 분자 구하기', '②22', (d) => {
            const [f, g] = d.until(() => ffPick(d, 'plain'), ([x, y]) => gcd(x.n * y.n, x.d * y.d) === 1), a = f.n, b = f.d, x = g.n, e = g.d;
            return N('□ 안에 알맞은 수는?', x, {
              figure: eq(show(f), '*', frac(box(), e), '=', frac(a * x, b * e)),
              explain: `분자는 분자끼리 곱하므로 ${a} × □ = ${a * x}이다. ${a} × ${x} = ${a * x}이므로 □는 ${x}이다. 분모는 ${b} × ${e} = ${b * e}이다.`,
              facts: { calc: [[`${a * x}/${a}`, 0]] }
            });
          }),
          T('ff-calc', '(진분수)×(진분수)', '①18 ②21 ③15·16 심2', (d, n) => {
            // 문항마다 계산 구조가 다르다: 단위분수끼리, 단위분수와 진분수, 약분이 없다, 한 번 약분한다, 엇갈려 두 번 약분한다.
            const kind = ['units', 'unitProper', 'plain', 'once', 'twice'][n], vs = ffPick(d, kind);
            return ans(CALC, vs, { figure: times(vs), explain: (n >= 3 ? '분자와 분모를 약분한 다음 곱하면 간단하다. ' : n === 0 ? '단위분수끼리의 곱은 분자는 1이고 분모끼리 곱한다. ' : PAIRS) + told(vs) + '이다.', facts: { rule: 'ff-' + kind } });
          }, { count: 5 }),
          T('three-unit-steps', '세 단위분수를 차례로 곱하는 과정', '①23 ②22', (d) => {
            const [x, y, z] = d.until(() => [d.int(2, 6), d.int(2, 6), d.int(2, 7)], (list) => new Set(list).size === 3);
            return M('세 단위분수를 앞에서부터 차례로 곱하는 과정이다. ㉠, ㉡에 알맞은 수는?', labelled([x * y, x * y * z]), {
              figure: lines([eq(frac(1, x), '*', frac(1, y), '*', frac(1, z)), eq('=', par(frac(1, x), '*', frac(1, y)), '*', frac(1, z)), eq('=', frac(1, box(LAB[0])), '*', frac(1, z), '=', frac(1, box(LAB[1])))]),
              explain: `${frac(1, x)} × ${frac(1, y)} = ${frac(1, x * y)}이고, ${frac(1, x * y)} × ${frac(1, z)} = ${frac(1, x * y * z)}이다. 분모끼리만 곱하면 된다.`,
              facts: { calc: [[`${x}*${y}`, 0], [`${x}*${y}*${z}`, 1]] }
            });
          }),
          T('three-steps', '세 분수를 앞에서부터 차례로 곱하는 과정', '②23 심4', (d) => {
            const vs = d.until(() => [ffPick(d, 'once'), V(0, 1, d.int(2, 7))], ([[x, y], z]) => { const r = mul([x, y, z]); return x.d * y.d <= 90 && mul([x, y]).q > 1 && r.q <= 90 && gcd(mul([x, y]).p, z.d) === 1; }), [f, g] = vs[0], h = vs[1];
            const r1 = mul([f, g]), r2 = mul([f, g, h]);
            return M('세 분수를 앞에서부터 차례로 곱하는 과정이다. ㉠, ㉡에 알맞은 수는?', labelled([r1.p, r2.p]), {
              figure: lines([eq(show(f), '*', show(g), '*', show(h)), eq('=', par(show(f), '*', show(g)), '*', show(h)), eq('=', frac(box(LAB[0]), r1.q), '*', show(h), '=', frac(box(LAB[1]), r2.q))]),
              explain: `${told([f, g])}이고, ${told([toV(r1), h])}이다.`,
              facts: { calc: [[`${f.n}*${g.n}*${r1.q}/(${f.d}*${g.d})`, 0], [`${f.n}*${g.n}*${h.n}*${r2.q}/(${f.d}*${g.d}*${h.d})`, 1]] }
            });
          }),
          T('three-steps-once', '세 분수를 한꺼번에 곱하는 과정', '②23 심4', (d) => {
            const [f, g, h] = d.until(() => [0, 0, 0].map(() => { const b = d.int(2, 7); return V(0, coTop(d, b), b); }), (list) => { const [x, y, z] = list; return gcd(x.n * y.n * z.n, x.d * y.d * z.d) === 1 && x.d * y.d * z.d <= 150 && x.n * y.n * z.n > 1 && y.n > 1 && new Set(list.map((v) => v.d)).size === 3; });
            const P = f.n * g.n * h.n, Q = f.d * g.d * h.d;
            return M('세 분수의 분자는 분자끼리, 분모는 분모끼리 한꺼번에 곱하는 과정이다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?', labelled([g.n, h.d, P, Q]), {
              figure: lines([eq(show(f), '*', show(g), '*', show(h)), eq('=', frac(`${f.n} × ${box(LAB[0])} × ${h.n}`, `${f.d} × ${g.d} × ${box(LAB[1])}`), '=', frac(box(LAB[2]), box(LAB[3])))]),
              explain: `분자끼리 곱하면 ${f.n} × ${g.n} × ${h.n} = ${P}, 분모끼리 곱하면 ${f.d} × ${g.d} × ${h.d} = ${Q}이므로 ${frac(P, Q)}이다.`,
              facts: { calc: [[String(g.n), 0], [String(h.d), 1], [`${f.n}*${g.n}*${h.n}`, 2], [`${f.d}*${g.d}*${h.d}`, 3]] }
            });
          }),
          T('three-calc', '세 분수의 곱셈', '①22 ②24 ③17 심4', (d, n) => {
            // 첫째 문항은 단위분수 셋, 둘째 문항은 약분이 있는 진분수 셋.
            if (n === 0) {
              const vs = d.until(() => [d.int(2, 6), d.int(2, 6), d.int(2, 6)], (list) => new Set(list).size >= 2).map((den) => V(0, 1, den));
              return ans(CALC, vs, { figure: times(vs), explain: `단위분수끼리의 곱은 분자는 1이고 분모끼리 곱한다. ${told(vs)}이다.`, facts: { rule: 'three-units' } });
            }
            const vs = d.until(() => [0, 0, 0].map(() => { const b = d.int(3, 10); return V(0, coTop(d, b, 2), b); }), (list) => { const r = mul(list), [x, y, z] = list; return new Set(list.map((v) => v.d)).size === 3 && r.q <= 60 && x.d * y.d * z.d > r.q * 4; });
            return ans(CALC, vs, { figure: times(vs), explain: `세 분수의 분자와 분모를 한꺼번에 약분한 다음 분자는 분자끼리, 분모는 분모끼리 곱한다. ${told(vs)}이다.`, facts: { rule: 'three-proper' } });
          }, { count: 2 }),
          T('three-flow', '자연수에 분수를 차례로 곱하기', '①24 ②21 ③35 심5', (d) => {
            // 자연수에 첫째 분수를 곱하면 자연수가 되고, 둘째 분수를 곱하면 대분수가 된다.
            const vs = d.until(() => { const b = d.int(3, 9), k = d.int(2, 4), e = d.int(3, 16); return [nat(b * k), V(0, coTop(d, b, 2), b), V(0, coTop(d, e, 2), e)]; }, ([c, f, g]) => { const mid = c.w * f.n / f.d, r = mul([c, f, g]); return c.w <= 30 && gcd(mid, g.d) > 1 && r.q > 1 && r.p > r.q && g.d !== f.d; }), [c, f, g] = vs, mid = c.w * f.n / f.d;
            return ans('차례로 곱하여 빈 곳에 써넣으려고 한다. ㉠에 알맞은 수는?', vs, {
              figure: flow([c.w, { step: `× ${show(f)}` }, box(), { step: `× ${show(g)}` }, box(LAB[0])]),
              explain: `${told([c, f])}이고, ${told([nat(mid), g])}이다.`
            });
          })
        ]
      },
      {
        id: 'mm', title: '대분수가 있는 곱셈', standard: STD,
        types: [
          T('mm-steps-improper', '(대분수)×(대분수): 가분수로 나타내어 곱하는 과정', '①19 ②26 ③18 심7', (d) => {
            const [x, y] = d.until(() => mmPick(d, 'MM', null, false), ([p, s]) => mul([p, s]).p > mul([p, s]).q && top(p) <= 20 && top(s) <= 20), r = mul([x, y]), e = `(${x.w}*${x.d}+${x.n})*(${y.w}*${y.d}+${y.n})*${r.q}/(${x.d}*${y.d})`;
            return M('대분수를 가분수로 나타내어 곱하는 과정이다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?', labelled([top(x), top(y), r.p, r.p % r.q]), {
              figure: lines([eq(show(x), '*', show(y), '=', frac(box(LAB[0]), x.d), '*', frac(box(LAB[1]), y.d)), eq('=', frac(box(LAB[2]), r.q), '=', mixed(Math.floor(r.p / r.q), box(LAB[3]), r.q))]),
              explain: `${show(x)} = ${frac(top(x), x.d)}, ${show(y)} = ${frac(top(y), y.d)}이다. ${told([V(0, top(x), x.d), V(0, top(y), y.d)])}이다.`,
              facts: { calc: [[`${x.w}*${x.d}+${x.n}`, 0], [`${y.w}*${y.d}+${y.n}`, 1], [e, 2], [rest(e, r.q), 3]] }
            });
          }),
          T('mm-steps-split', '대분수를 자연수와 진분수로 나누어 곱하는 과정', '①20 ②27 ③19', (d, n) => {
            if (n === 0) {
              // (대분수)×(진분수): 곱해지는 대분수를 나눈다. 두 곱을 통분하여 더한다.
              const made = d.until(() => { const [x, y] = mmPick(d, 'MP', null, false), r2 = R(x.n * y.n, x.d * y.d), L = y.d * r2.q / gcd(y.d, r2.q), sum = x.w * y.n * (L / y.d) + r2.p * (L / r2.q); return { x, y, r2, L, sum }; }, (m) => m.x.w <= 2 && m.L <= 40 && gcd(m.sum, m.L) === 1 && m.r2.q !== m.y.d && m.x.d <= 6 && m.y.d <= 8);
              const { x, y, r2, L, sum } = made, f = frac(x.n, x.d);
              return M('곱해지는 대분수를 자연수와 진분수로 나누어 계산하는 과정이다. ㉠, ㉡, ㉢에 알맞은 수는?', labelled([x.w * y.n, r2.p, sum]), {
                figure: lines([eq(show(x), '*', show(y)), eq('=', par(x.w, '*', show(y)), '+', par(f, '*', show(y))), eq('=', frac(box(LAB[0]), y.d), '+', frac(box(LAB[1]), r2.q), '=', frac(box(LAB[2]), L))]),
                explain: `${x.w} × ${show(y)} = ${frac(x.w * y.n, y.d)}이고, ${f} × ${show(y)} = ${frac(r2.p, r2.q)}이다. 분모가 ${L}${tail(L, '이/가')} 되도록 통분하여 더하면 ${frac(x.w * y.n * (L / y.d), L)} + ${frac(r2.p * (L / r2.q), L)} = ${frac(sum, L)}이다.`,
                facts: { calc: [[`${x.w}*${y.n}`, 0], [`${x.n}*${y.n}*${r2.q}/(${x.d}*${y.d})`, 1], [`${x.w}*${y.n}*${L}/${y.d}+${x.n}*${y.n}*${L}/(${x.d}*${y.d})`, 2]] }
              });
            }
            // (대분수)×(대분수): 곱하는 대분수(자연수 부분이 1)를 나눈다. 진분수와의 곱이 자연수가 되는 수.
            const [x, f] = d.until(() => { const b = d.int(2, 7), e = d.int(3, 9); return [V(d.int(1, 4), coTop(d, b), b), V(0, coTop(d, e, 2), e)]; }, ([p, s]) => (top(p) * s.n) % (p.d * s.d) === 0 && p.d !== s.d), k = top(x) * f.n / (x.d * f.d), y = V(1, f.n, f.d);
            return M('곱하는 대분수를 자연수와 진분수로 나누어 계산하는 과정이다. ㉠, ㉡에 알맞은 수는?', labelled([k, x.w + k]), {
              figure: lines([eq(show(x), '*', show(y)), eq('=', par(show(x), '*', 1), '+', par(show(x), '*', show(f))), eq('=', show(x), '+', box(LAB[0]), '=', mixed(box(LAB[1]), x.n, x.d))]),
              explain: `${show(x)} × 1 = ${show(x)}이고, ${told([x, f])}이다. 두 곱을 더하면 ${show(x)} + ${k} = ${mixed(x.w + k, x.n, x.d)}이다.`,
              facts: { calc: [[`(${x.w}*${x.d}+${x.n})*${f.n}/(${x.d}*${f.d})`, 0], [`${x.w}+(${x.w}*${x.d}+${x.n})*${f.n}/(${x.d}*${f.d})`, 1]] }
            });
          }, { count: 2 }),
          T('mm-calc', '대분수가 있는 두 분수의 곱셈', '①21 ②28·29 ③20·21 심3', (d, n) => {
            // 문항마다 계산 구조가 다르다: (대분수)×(진분수), (진분수)×(대분수), 약분이 없는 (대분수)×(대분수), 약분이 있는 (대분수)×(대분수), (진분수)×(가분수).
            const vs = [() => mmPick(d, 'MP', true, false), () => mmPick(d, 'PM', true, false), () => d.until(() => mmPick(d, 'MM', false, false), ([x, y]) => x.d * y.d <= 30), () => mmPick(d, 'MM', true, false), () => mmPick(d, 'PI', true, false)][n]();
            return ans(CALC, vs, { figure: times(vs), explain: (n === 4 ? '분자와 분모를 약분한 다음 분자는 분자끼리, 분모는 분모끼리 곱한다. ' : n === 2 ? '대분수를 가분수로 나타낸 다음 분자는 분자끼리, 분모는 분모끼리 곱한다. ' : '대분수를 가분수로 나타낸 다음 약분하여 곱한다. ') + told(vs) + '이다.', facts: { rule: ['mm-mixed-proper', 'mm-proper-mixed', 'mm-plain', 'mm-reduce', 'mm-improper'][n] } });
          }, { count: 5 }),
          T('mm-natural', '(대분수)×(대분수): 곱이 자연수', '①21 ②29 ③20', (d) => {
            const vs = mmPick(d, 'MM', true, true);
            return ans(CALC, vs, { kind: 'nat', figure: times(vs), explain: `대분수를 가분수로 나타낸 다음 약분하면 분모가 모두 1이 된다. ${told(vs)}이다.`, facts: { rule: 'mm-natural' } });
          }),
          T('mm-three', '대분수나 자연수가 섞인 세 수의 곱셈', '①22 ②31 심4', (d, n) => {
            // 첫째 문항은 대분수 둘과 진분수 하나, 둘째 문항은 대분수·자연수·진분수.
            const one = (hi) => { const b = d.int(2, hi); return [coTop(d, b, b > 2 ? 2 : 1), b]; };
            const vs = d.until(() => {
              const [a, b] = one(7), [c, e] = one(9), [f, h] = one(7);
              return n === 0 ? [V(d.int(1, 3), a, b), V(0, c, e), V(d.int(1, 2), f, h)] : [V(d.int(1, 3), a, b), nat(d.int(2, 15)), V(0, c, e)];
            }, (list) => { const r = mul(list), dens = list.filter((v) => v.n).map((v) => v.d); return r.q > 1 && r.q <= 30 && r.p <= 20 * r.q && new Set(dens).size === dens.length && dens.reduce((x, y) => x * y, 1) >= r.q * 6 && list.every((v) => top(v) <= 20); });
            return ans(CALC, vs, { figure: times(vs), explain: `대분수를 가분수로 나타낸 다음 세 수의 분자와 분모를 한꺼번에 약분하여 곱한다. ${told(vs)}이다.`, facts: { rule: ['three-mixed', 'three-mixed-nat'][n] } });
          }, { count: 2 })
        ]
      },
      { id: 'check', title: '잘못된 계산 살펴보기', standard: STD, types: [] },
      { id: 'comp', title: '곱의 크기 비교하기', standard: STD, types: [] },
      { id: 'pick', title: '조건에 맞는 수의 곱', standard: STD, types: [] },
      { id: 'word', title: '분수의 곱셈의 활용', standard: STD, types: [] },
      { id: 'shape', title: '도형에서 분수의 곱셈', standard: STD, types: [] }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
