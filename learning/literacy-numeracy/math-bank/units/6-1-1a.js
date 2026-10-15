// 6학년 1학기 1단원 분수의 나눗셈 — 단원 틀과 기본 문항((자연수)÷(자연수)의 몫을 분수로 나타내기, 그 몫의 크기 비교와 □, (분수)÷(자연수),
// 분수의 곱셈으로 나타내어 계산하기, (대분수)÷(자연수)).
// 수집해 둔 교과서 8종의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1~3: 76·69·85꼴, 심화꼴 72꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/6-1-1/싣기_대조표.md 에 있다.
// (잘못된 계산, 몫의 크기 비교와 조건에 맞는 수, 문장제, 도형, 실력 문항은 6-1-1b.js 에 있다. 단원은 이 두 파일뿐이다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2, ③n = 기본꼴_3, 심n = 심화꼴.
// 영역은 수와 연산. 성취기준은 6수01-10('(자연수)÷(자연수)'에서 나눗셈의 몫을 분수로 나타낼 수 있다)과
// 6수01-11(분수의 나눗셈의 계산 원리를 탐구하고 그 계산을 할 수 있다) 가운데 (분수)÷(자연수)까지이다.
//
// 싣는 기준
//  - 이 단원의 나눗셈만 싣는다: (자연수)÷(자연수)의 몫을 분수로 나타내기(몫이 1보다 작다·크다), (분수)÷(자연수)(분자가 나누어떨어진다·떨어지지 않는다),
//    분수의 곱셈으로 나타내어 계산하기, (대분수)÷(자연수). 나누는 수는 언제나 자연수이다.
//    하는 일이 다르면 다른 문제다: 주는 것(띠·원·수직선·나눈 정사각형, 식, 문장, 표), 묻는 것(과정의 빈칸, 값, 고르기), 계산 구조가 다르면 따로 싣고
//    계산 문항에는 facts.rule 에 그 이름을 단다(이름대로 되게 수를 뽑는다): 진분수·가분수·대분수, 분자가 나누어떨어진다·떨어지지 않는다, 약분이 있다·없다,
//    몫이 1보다 크다·작다, 나누는 수가 두 자리이다.
//  - 교육과정: 「분수의 곱셈과 나눗셈은 계산 원리를 탐구하여 이해하는 수준에서 다룬다.」 계산 문항의 분모는 20 이하, 나누는 수는 한 자리(두 자리는 분자와 약분되는 것만),
//    몫의 분모는 120 이하에서 뽑는다. 나눗셈은 두 번까지, 곱셈과 섞일 때는 곱셈 한 번과 나눗셈 한 번까지만 싣는다.
//  - 교육과정: 「기약분수로 나타낼 것을 요구하지 않을 경우, 계산 결과를 기약분수가 아닌 분수로 나타내는 것도 허용한다.」 분수 하나를 답하는 문항은 크기가 같은 분수를
//    모두 맞게 친다(anyForm). 문제 글이 「기약분수로 나타내시오」라고 한 문항(nn-calc-reduce, comp-times-box 셋째, word-nn-reduce)만 기약분수를 요구한다(꼴 목록에 기○로 적힌 ①7·17·52·60 ②22 가운데 약분이 일의 한 부분인 세 곳).
//    적어 두는 답은 언제나 기약분수이고, 몫이 1보다 크면 대분수 칸에 답한다. 답이 자연수로 떨어지는 문항은 수 하나로 답한다.
//  - 계산 과정의 빈칸을 묻는 문항은 곱하는 수나 약분하는 수를 글·틀이 정해 주어 답이 하나가 되게 하였다.
//  - 숫자만 다르거나 상황만 다른 것은 한 번만 싣는다(화살표 상자·표의 빈칸·식과 몫 잇기·사다리 타기는 계산 문항과 같은 문제).
//
// 뺀 것과 까닭(6-1-1b.js 의 것까지 여기에 모아 적는다)
//  - 6학년 2학기 (자연수)÷(분수)·(분수)÷(분수)가 있어야 풀리는 것: 나누는 수가 분수가 되는 □(①23)
//  - 이 단원의 일이 끝에 한 번뿐이거나 없는 것: 혼합 계산 뒤 몫을 분수로(②20 — 5-1-1), 나누어지는 수 구하기(①33 — 푸는 셈이 5-2-2 (분수)×(자연수)뿐),
//    통분해서 몫의 크기를 견주는 일이 대부분인 (자연수)÷(자연수)의 비교(①19, ①20·②13·③15·심7의 통분하는 변형 — 5-1-4),
//    크기가 같은 분수 찾기로 풀리는 □(①21의 변형 □÷8 = 1÷2, ①19의 변형 4÷6 = 12÷18)
//  - 넓이·둘레 셈이 고비인 것: 삼각형·사다리꼴·마름모의 넓이 공식을 거꾸로 풀기(①76 ②68·69 심65·66·67), 나누어 얻은 변으로 둘레 구하기(①75 심64),
//    철사로 만든 정사각형의 넓이(③83), 한 변을 아는 정사각형을 나눈 한 칸의 넓이(③84 — 앞 단계가 분수의 곱셈), 변의 한가운데를 이은 도형(③85 심71)
//  - 간격 수·도막 수·시간 바꾸기가 고비인 것: 같은 간격으로 나무 심기(①68 ②26 ③76 심57·58), 올라간 층수(심45), 자른 횟수와 도막 수(③77), 빨라지는 시계(심56)
//  - 방정식 꼴·조건 풀이: 어떤 수를 두 단계 거꾸로 구하기(③82), 답이 여럿인 식 만들기(③62의 변형), 카드 그림이 없어 조건을 알 수 없는 것(①25·②16·②54의 변형),
//    가장 큰 수가 두 번 쓰이는 카드 문제(심35의 변형 — 읽기 함정이 꼬임), 과정의 빈칸에서 수가 다른 하나 찾기(②28의 변형), 곱셈이 섞인 식에 수 카드 놓기(③64)
//  - 뜻 없는 셈: 두 몫의 합·차(①50 ②50 ③58 심24), 빈칸에 들어갈 수끼리 더하기(②8·28의 변형, 심3·14의 변형), 기약분수의 분모와 분자의 차(③59),
//    바른 값과 잘못 계산한 값의 차(심41), 수 카드로 만든 가장 큰 몫과 가장 작은 몫의 차(①56·심32의 변형), 두 정다각형의 한 변의 차(심60), 표에서 둘을 골라 구한 두 몫의 차(③25 — 답도 여럿)
//  - 세 단계를 넘는 긴 계산: 한 개의 무게를 구해 몇 개의 무게(심50 — 빼고 나누고 곱함), 상자가 여러 개(심51),
//    두 수 사이를 똑같이 나눈 눈금 가운데 끝이 분수이거나 여러 칸째인 것(심30의 변형 — 자연수 끝의 첫 눈금만 실었다)
//  - 색칠하기·화살표 그리기(작도: ①1·3·11·12·27·31 ②3·34 ③3·30 심2·16의 그리는 부분) — 색칠해 준 그림을 보고 답하거나 바르게 나타낸 그림·수직선을 고르는 꼴로 실었다.
//    까닭·방법·과정 쓰기(서술형: ①8·39·44 ②17·36·39·41 ③10·31·44·49 심2·15·19·20)는 까닭 고르기, 과정의 빈칸, 바른 값 구하기, 처음 잘못된 곳 고르기로 바꾸어 실었다.
//    3÷4 가 3/4 과 같은 까닭 쓰기(③6), 문제 만들기(①69 ②25 ③78 심72), 답장 쓰기(②36의 변형)는 뺐다.
//  - 같은 문제여서 한 번만 실은 것: 화살표 상자·표의 빈칸·사다리 타기·놀이 카드(①6·13·29·30·41 ②6·32·40 ③4·9·36의 변형 — 계산 문항과 같다),
//    「분수를 자연수로 나눈 몫」처럼 말로 준 나눗셈(①29·30 ②7·32·40 ③37·46의 변형 — 계산 문항과 같다), 보기와 같은 방법으로 계산하기(①28·40 ③29·45 — 과정의 빈칸 문항과 같다),
//    그림에 맞는 나눗셈식 고르기(①4 — 그림을 보고 식을 세우는 nn-fig-many 와 같다), 한 수를 두 수로 따로 나누기(①32의 변형 — 계산 두 번),
//    나누는 수가 같은 두 (분수)÷(자연수)의 비교(①45의 변형 — 계산하지 않고 견주는 comp-no-calc 와 같다), 수 카드 두 장으로 가장 큰 몫과 가장 작은 몫을 따로 묻기(①25 ③18 — 한 유형에서 한쪽만 묻는다),
//    가분수를 수 카드에 놓기(심33)·두 장으로 가장 작은 진분수를 만들어 남은 수로 나누기(①56의 변형)·세 장으로 □/□÷□ 만들기(③62) — 진분수를 놓는 hard-cards-proper 와 같은 원리,
//    어떤 수에 곱한 값을 주고 다른 수로 나눈 몫(③80, ①52·②53의 변형 — 「곱한 수와 나눌 수가 다른 잘못된 계산」과 같다),
//    일정한 빠르기로 간 거리에서 다른 시간의 거리(심55)·봉지 몇 개의 무게(③75) — 하나치를 구해 몇 배 하는 얼개가 hard-share-some 과 같다,
//    왕복한 거리를 걸린 시간으로 나누기(①67 — 곱한 뒤 나누는 얼개가 hard-gather-share 와 같다. 답지는 왕복을 빠뜨렸다),
//    두 사람의 하루 양 견주기(①66 ②60 ③68)·가짓수로 나눈 두 텃밭 견주기(②24의 변형) — 전체가 다른 두 몫을 견주는 hard-share-compare 와 같다,
//    봉지에 든 낱개의 무게(②62의 변형)·반의 반(②63) — 두 번 나누는 얼개가 hard-share-again 과 같다, 남은 병의 양(심53의 변형),
//    무게가 같은 물건 한 개의 무게·1 m의 무게(①57·58·60 ②21·57 ③20·66·67의 변형 — 수박 한 통의 무게와 같다), 이어 붙여 만든 정육각형(①71의 변형 — 합친 뒤 나누기와 같다)
//  - 답지를 바로잡은 것: YBM 10분 학습 6차시의 5 1/4 ÷ 6(7/8), 1 7/9 ÷ 6(8/27)과 왕복 문제, 한대희 수행평가의 우유·주스 비교, 박만구 수행평가의 오타는 문항을 새로 쓰면서 답을 직접 셈하였다.
//  - 그림이 필요해 미룬 것은 없다. 띠·원·수직선·나눈 정사각형·나눈 직사각형은 단원 파일의 그림 함수로 그렸다. 저울 눈금(①57의 변형), 수직선 두 줄(③67의 변형),
//    정육각형·정팔각형·정삼각형을 똑같이 나눈 그림(①73 ②66 ③72 심68·69)은 수를 글에 적거나 직사각형을 똑같이 나눈 그림으로 바꾸어 실었다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, box, frac, mixed, lines, numbers, cards, pieces, N, M, C, F } = B.kit;
  const STD_NN = '6수01-10', STD = '6수01-11';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const LAB = ['㉠', '㉡', '㉢', '㉣'], THREE = LAB.slice(0, 3);
  const SIGNS = ['&gt;', '=', '&lt;'], GT = '&gt;', LT = '&lt;';
  const labelled = (answers) => answers.map((answer, i) => ({ label: LAB[i], answer }));
  const gcd = (x, y) => (y ? gcd(y, x % y) : x);
  // 토씨: 분수와 대분수는 분자를 마지막에 읽는다(5분의 3, 2와 5분의 3).
  const tail = (n, pair) => josa(n, pair).slice(String(n).length);
  const SG = { '+': '+', '-': '−', '*': '×', '/': '÷', '=': '=', '>': GT, '<': LT };
  const ex = (html) => '<span class="mb-expr">' + html + '</span>';
  // 식 한 줄: 조각을 이어 적는다. '+', '-', '*', '/', '=' 은 기호로 바꾼다('/' 는 나눗셈 기호이다. 분수는 frac 으로 적는다).
  const eq = (...parts) => ex(parts.map((p) => (SG[p] ? '<i>' + SG[p] + '</i>' : p)).join(' '));
  const par = (...parts) => '(' + parts.map((p) => (SG[p] ? '<i>' + SG[p] + '</i>' : p)).join(' ') + ')';
  const tag = (label) => '<span class="mb-tag mb-tag-short">' + label + '</span>';
  const tagged = (list) => lines(list.map((html, i) => tag(LAB[i]) + html));
  const versus = (left, right) => `<div class="mb-versus">${left}<span class="mb-ring"></span>${right}</div>`;

  // ── 수 하나 ──
  // 자연수 부분 w, 분수 부분 n/d. n = 0 이면 자연수, w = 0 이면 분수(분자가 분모보다 크면 가분수)이다.
  const V = (w, n, d) => ({ w, n, d: n ? d : 1 });
  const nat = (w) => V(w, 0, 1);
  const show = (v) => (v.n === 0 ? String(v.w) : v.w ? mixed(v.w, v.n, v.d) : frac(v.n, v.d));
  const vj = (v, pair) => show(v) + tail(v.n === 0 ? v.w : v.n, pair);
  const fj = (n, den, pair) => frac(n, den) + tail(n, pair);
  const top = (v) => v.w * v.d + v.n;
  const R = (p, q) => { const g = gcd(p, q) || 1; return { p: p / g, q: q / g }; };
  const cmp = (x, y) => x.p * y.q - y.p * x.q;
  const toV = (r) => (r.q === 1 ? nat(r.p) : V(Math.floor(r.p / r.q), r.p % r.q, r.q));
  const key = (v) => v.w + ' ' + v.n + '/' + v.d;
  // 나눗셈 v ÷ c 의 몫(기약분수 p/q)
  const quo = (v, c) => R(top(v), v.d * c);
  const res = (v, c) => show(toV(quo(v, c)));
  const div = (v, c) => eq(show(v), '/', c);
  const distinct = (vals) => vals.every((p, i) => vals.every((s, j) => i === j || cmp(p, s) !== 0));

  // ── 검사가 다시 셈하는 식 ──
  // 식의 값을 (분자 식)/(분모 식)으로 적는다. 문제에 적힌 수로만 적는다(대분수 2 3/7 은 (2*7+3)). 자연수로 나누면 그 수가 분모에 곱해진다.
  const imp = (v) => (v.n === 0 ? String(v.w) : v.w ? `(${v.w}*${v.d}+${v.n})` : String(v.n));
  const q = (v) => ({ num: imp(v), dens: v.n ? [v.d] : [], P: top(v), D: v.d });
  const qdiv = (x, c) => ({ num: x.num, dens: x.dens.concat([c]), P: x.P, D: x.D * c });
  const qd = (v, c) => qdiv(q(v), c);
  // 답 칸(자연수 / 분자·분모 / 자연수·분자·분모)마다 다시 셈하는 식. 기약분수로 고칠 때 나누는 수 g 는 글에 없다.
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
  // 여러 식의 값을 견줄 때 검사가 다시 셈하는 정수 식: 식마다 분자에 다른 식들의 분모를 모두 곱한다.
  const scaled = (xs) => xs.map((x, i) => xs.filter((_, j) => j !== i).reduce((list, y) => list.concat(y.dens), [x.num]).join('*'));
  const scaledValues = (xs) => xs.map((x, i) => xs.filter((_, j) => j !== i).reduce((m, y) => m * y.D, x.P));

  // ── 풀이 글 ──
  // 나눗셈의 차례: 처음 식, (대분수이면) 가분수로 고친 식, 분자를 나눈 식이나 곱셈으로 고친 식, 결과, 대분수.
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

  // ── 수 고르기 ──
  const coTop = (d, den, lo) => d.until(() => d.int(lo || 1, den - 1), (v) => gcd(v, den) === 1);
  // (자연수 a)÷(자연수 b): 몫이 1보다 작고 약분이 없다(proper)·있다(properReduce), 몫이 1보다 크고 약분이 없다(over)·있다(overReduce). 나누어떨어지지 않는다.
  function nnPick(d, kind) {
    const small = kind.startsWith('proper'), cut = kind.endsWith('Reduce');
    return d.until(() => (small ? [d.int(2, 14), d.int(3, 19)] : [d.int(3, 40), d.int(2, 9)]), ([a, b]) => (small ? a < b : a > b && a % b !== 0 && a < 6 * b) && (gcd(a, b) > 1) === cut);
  }
  // (진분수 a/b)÷(자연수 c): 분자가 나누어떨어진다(top), 나누어떨어지지 않고 약분이 없다(plain), 분자와 자연수를 약분한다(reduce), 단위분수(unit)
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
  // (가분수 a/b)÷(자연수 c): 몫이 진분수이고 분자가 나누어떨어진다(top)·약분이 없다(plain)·약분한다(reduce), 몫이 1보다 크다(over)
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
  // (대분수 w a/b)÷(자연수 c). 가분수의 분자 t 로 따진다: 몫이 진분수이고 t 가 나누어떨어진다(top)·약분이 없다(plain)·약분한다(reduce), 몫이 1보다 크다(over)
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
  // 차례 고르기 보기: 바른 차례 하나와 틀린 차례 셋
  const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  function orderChoice(d, vals, names, desc) {
    const right = [0, 1, 2].sort((p, s) => (desc ? cmp(vals[s], vals[p]) : cmp(vals[p], vals[s]))), id = (o) => o.join();
    const list = d.shuffle(d.shuffle(ORDERS.filter((o) => id(o) !== id(right))).slice(0, 3).concat([right]));
    return { list, right, options: list.map((o) => o.map((i) => names[i]).join(', ')), answer: list.findIndex((o) => id(o) === id(right)) };
  }
  // 식 셋과 계산 결과를 짝 짓는 보기: 바른 짝 하나와 틀린 짝 셋. said(자리) 는 그 식의 계산 결과 글이다.
  function matchChoice(d, said) {
    const list = d.shuffle(d.shuffle(ORDERS.slice(1)).slice(0, 3).concat([ORDERS[0]]));
    return { list, options: list.map((o) => o.map((j, i) => `${LAB[i]} ${said(j)}`).join(', ')), answer: list.findIndex((o) => o.join() === '0,1,2') };
  }

  // ── 그림 ──
  const svg = (cls, w, h, label, body) => `<svg class="${cls}" style="vertical-align:middle" viewBox="0 0 ${w} ${h}" width="${Math.round(w)}" role="img" aria-label="${label}">${body}</svg>`;
  // 띠 한 칸(왼쪽 위 x, y / 너비 width): 똑같이 parts 칸으로 나누어 앞의 on 칸을 색칠한다.
  function bandAt(x, y, width, parts, on, height) {
    const pw = width / parts; let out = '';
    for (let i = 0; i < parts; i += 1) out += `<rect class="mb-piece${i < on ? ' is-on' : ''}" x="${(x + i * pw).toFixed(2)}" y="${y}" width="${pw.toFixed(2)}" height="${height || 24}"/>`;
    return out;
  }
  // 띠 count 개를 아래로 쌓는다. 띠마다 똑같이 parts 칸으로 나누어 on 칸씩 색칠한다.
  function bands(parts, on, count) {
    let out = '';
    for (let k = 0; k < count; k += 1) out += bandAt(2, 2 + k * 30, 204, parts, on);
    return svg('mb-pieces', 208, count * 30 - 2, count === 1 ? `띠를 똑같이 ${parts}칸으로 나누어 ${on}칸을 색칠` : `띠 ${count}개를 각각 똑같이 ${parts}칸으로 나누어 띠마다 ${on}칸씩 색칠`, out);
  }
  // 띠 a 개를 b 명이 똑같이 나누어 가질 때 한 명의 몫: 통째로 가진 띠는 모두 색칠하고, 남은 띠는 각각 b 칸으로 나누어 한 칸씩 색칠한다.
  function shareBands(a, b) {
    const whole = Math.floor(a / b), rest = a % b; let out = '';
    for (let k = 0; k < a; k += 1) out += k < whole * b ? bandAt(2, 2 + k * 22, 204, 1, k < whole ? 1 : 0, 17) : bandAt(2, 2 + k * 22, 204, b, 1, 17);
    return svg('mb-pieces', 208, a * 22 - 1, `띠 ${a}개 가운데 ${whole}개는 모두 색칠하였고 ${whole * b - whole}개는 색칠하지 않았다. 남은 ${rest}개는 ${rest > 1 ? '각각 ' : ''}똑같이 ${b}칸으로 나누어 ${rest > 1 ? '한 칸씩' : '한 칸을'} 색칠하였다`, out);
  }
  // 띠를 똑같이 parts 칸으로 나누어 on 칸을 색칠하고, 색칠한 칸을 groups 묶음으로 똑같이 나눈 그림(묶음마다 빛깔을 번갈아 칠하고 아래에 꺾쇠를 긋는다).
  function groupBand(parts, on, groups) {
    const pw = 204 / parts, per = on / groups; let out = '';
    for (let i = 0; i < parts; i += 1) out += `<rect class="mb-piece" style="fill:${i < on ? (Math.floor(i / per) % 2 ? '#bfdbfe' : '#60a5fa') : '#fff'}" x="${(2 + i * pw).toFixed(2)}" y="2" width="${pw.toFixed(2)}" height="24"/>`;
    for (let g = 0; g < groups; g += 1) out += `<path d="M${(5 + g * per * pw).toFixed(1)} 30v5H${(g * per * pw + per * pw - 1).toFixed(1)}v-5" style="fill:none;stroke:#1d4ed8;stroke-width:1.4"/>`;
    return svg('mb-pieces', 208, 38, `띠를 똑같이 ${parts}칸으로 나누어 ${on}칸을 색칠하였다. 색칠한 칸을 ${per}칸씩 ${groups}묶음으로 나누었다`, out);
  }
  // 가로 cols 칸, 세로 rows 칸으로 똑같이 나눈 정사각형. shade(가로 자리, 세로 자리)가 0이면 흰 칸, 1이면 옅게, 2이면 진하게 칠한다. left 는 왼쪽 위의 x 자리.
  const FILL = ['#fff', '#dbeafe', '#3b82f6'];
  function gridAt(left, cols, rows, shade, S) {
    const cw = S / cols, rh = S / rows; let out = '';
    for (let r = 0; r < rows; r += 1) for (let c = 0; c < cols; c += 1) out += `<rect class="mb-piece" style="fill:${FILL[shade(c, r)]}" x="${(left + c * cw).toFixed(2)}" y="${(2 + r * rh).toFixed(2)}" width="${cw.toFixed(2)}" height="${rh.toFixed(2)}"/>`;
    return out;
  }
  const areaGrid = (cols, rows, shade, label, size) => svg('mb-pieces', (size || 120) + 4, (size || 120) + 4, label, gridAt(2, cols, rows, shade, size || 120));
  // 정사각형의 a/b(왼쪽 세로줄 a 칸)를 옅게 칠하고, 그것을 가로줄 c 줄로 똑같이 나눈 것 중의 맨 윗줄을 진하게 칠한 그림
  const divGrid = (a, b, c) => areaGrid(b, c, (x, y) => (x < a ? (y === 0 ? 2 : 1) : 0), `정사각형을 가로 ${b}칸, 세로 ${c}칸으로 똑같이 나누었다. 왼쪽 세로줄 ${a}칸을 옅게 색칠하고, 그 가운데 맨 위 가로줄에 있는 칸을 진하게 색칠`);
  // 대분수 v(자연수 부분 1)만큼 옅게 칠한 정사각형 둘을 가로줄 c 줄로 똑같이 나누어 맨 윗줄을 진하게 칠한 그림
  function mixedGrid(v, c) {
    const S = 96, out = gridAt(2, v.d, c, (x, y) => (y === 0 ? 2 : 1), S) + gridAt(S + 12, v.d, c, (x, y) => (x < v.n ? (y === 0 ? 2 : 1) : 0), S);
    return svg('mb-pieces', 2 * S + 14, S + 4, `정사각형 2개를 각각 가로 ${v.d}칸, 세로 ${c}칸으로 똑같이 나누었다. 정사각형 1개는 모두, 다른 1개는 왼쪽 세로줄 ${v.n}칸을 옅게 색칠하였다. 옅게 색칠한 부분 가운데 맨 위 가로줄에 있는 칸을 진하게 색칠`, out);
  }
  // 0부터 spans 까지의 수직선. 1을 parts 칸으로 똑같이 나누고 at(0에서 센 작은 눈금의 수)에 화살표를 둔다(kit.partLine 보다 좁게 그린다).
  function tickLine(spans, parts, at) {
    const total = spans * parts, u = Math.min(22, 212 / total), x = (i) => (14 + i * u).toFixed(1), y = 30, width = Number((28 + total * u).toFixed(1));
    let out = `<line class="mb-axis" x1="${x(0)}" y1="${y}" x2="${x(total)}" y2="${y}"/>`;
    for (let i = 0; i <= total; i += 1) out += `<line class="mb-axis" x1="${x(i)}" y1="${y - (i % parts === 0 ? 6 : 3.5)}" x2="${x(i)}" y2="${y + (i % parts === 0 ? 6 : 3.5)}"/>`;
    for (let i = 0; i <= spans; i += 1) out += `<text class="mb-km-label" x="${x(i * parts)}" y="${y + 20}" text-anchor="middle">${i}</text>`;
    out += `<path class="mb-pointer" d="M${x(at)} ${y - 8}l-4.5 -9h9z"/>`;
    return svg('mb-numberline', width, 54, `수직선: 0부터 ${spans}까지, 1을 똑같이 ${parts}칸으로 나누었다. 화살표는 0에서 작은 눈금 ${at}칸 간 곳`, out);
  }
  // 차례로 계산하는 칸. 조각은 칸에 적는 글이거나 { step: 화살표 위에 적는 글 }이다(kit.chain 은 분수 글의 '-' 를 바꾸어 쓸 수 없다).
  const flow = (parts) => '<div class="mb-chain">' + parts.map((part) => (part.step ? `<span class="mb-step">${part.step}</span>` : `<span class="mb-node">${part}</span>`)).join('') + '</div>';

  const CALC = '다음을 계산하시오.';
  const TOP_DIV = '분자가 자연수의 배수이므로 분자를 자연수로 나눈다. ', TO_MUL = '나눗셈을 분수의 곱셈으로 나타내어 계산한다. ', TO_TOP = '대분수를 가분수로 나타낸 다음 계산한다. ';
  // 몫과 나머지를 다시 셈하는 식(대분수의 자연수 부분과 분자)
  const quot = (num, den) => `(${num}-${num}%${den})/${den}`, rest = (num, den) => `${num}%${den}`;

  B.addUnit({
    id: '6-1-1', grade: 6, semester: 1, no: 1, title: '분수의 나눗셈', version: 2,
    groups: [
      {
        id: 'nn', title: '(자연수)÷(자연수)의 몫을 분수로 나타내기', standard: STD_NN,
        types: [
          T('nn-fig-unit', '그림을 보고 1÷(자연수)의 몫 알아보기', '①1 ②1 ③1 심2', (d) => {
            const b = d.int(3, 8), kind = d.pick(['circle', 'bar']), shape = kind === 'circle' ? '원' : '띠';
            return N(`${shape} 하나를 1로 보고 그림과 같이 똑같이 나누어 한 칸을 색칠하였다. 색칠한 부분의 크기를 나눗셈식으로 나타낼 때, □ 안에 공통으로 알맞은 수는?`, b, {
              figure: pieces(kind, b, { shaded: 1 }) + eq(1, '/', box(), '=', frac(1, box())),
              explain: `1을 똑같이 ${b}칸으로 나눈 것 중의 한 칸이므로 1 ÷ ${b} = ${frac(1, b)}이다.`,
              facts: { calc: [[String(b), 0]] }
            });
          }),
          T('nn-fig-many', '그림을 보고 (자연수)÷(자연수)를 식으로 나타내어 몫 구하기', '①3·4·5 ②1 ③1 심2', (d) => {
            const [a, b] = d.until(() => [d.int(2, 4), d.int(3, 7)], ([x, y]) => x < y && gcd(x, y) === 1);
            return M(`띠 하나를 1로 보고 띠 ${a}개를 각각 똑같이 나누어 한 칸씩 색칠하였다. 색칠한 부분을 모두 모은 크기를 나눗셈식으로 나타낼 때, ㉠, ㉡에 알맞은 수는?`, labelled([b, a]), {
              figure: bands(b, 1, a) + eq(a, '/', box(LAB[0]), '=', frac(box(LAB[1]), box(LAB[0]))),
              explain: `띠 하나를 똑같이 ${b}칸으로 나눈 것 중의 한 칸은 1 ÷ ${b} = ${frac(1, b)}이다. 색칠한 칸이 ${a}개이므로 ${a} ÷ ${b} = ${frac(a, b)}이다.`,
              facts: { calc: [[String(b), 0], [String(a), 1]] }
            });
          }),
          T('nn-unit-count', '1÷(자연수)의 몫을 이용하여 (자연수)÷(자연수)의 몫 구하기', '①2·11 ②4 ③2 심2', (d, n) => {
            if (n === 0) {
              // 몫이 1보다 작다.
              const [a, b] = d.until(() => [d.int(2, 9), d.int(5, 13)], ([x, y]) => x < y && gcd(x, y) === 1);
              return M(`1 ÷ ${b}의 몫을 이용하여 ${a} ÷ ${b}의 몫을 구하는 과정이다. ㉠, ㉡에 알맞은 수는?`, labelled([b, a]), {
                figure: lines([eq(1, '/', b, '=', frac(1, box(LAB[0]))), `${a} ÷ ${josa(b, '은/는')} ${frac(1, box(LAB[0]))}이 ${box(LAB[1])}개이다.`, eq(a, '/', b, '=', frac(box(LAB[1]), box(LAB[0])))]),
                explain: `1 ÷ ${b} = ${frac(1, b)}이다. ${a} ÷ ${josa(b, '은/는')} ${frac(1, b)}이 ${a}개이므로 ${a} ÷ ${b} = ${frac(a, b)}이다.`,
                facts: { calc: [[String(b), 0], [String(a), 1]] }
              });
            }
            // 몫이 1보다 크다: 가분수와 대분수로 나타낸다.
            const [a, b] = d.until(() => nnPick(d, 'over'), ([x, y]) => y >= 3 && x < 4 * y), w = Math.floor(a / b), r = a % b;
            return M(`1 ÷ ${b}의 몫을 이용하여 ${a} ÷ ${b}의 몫을 대분수로 나타내는 과정이다. ㉠, ㉡, ㉢에 알맞은 수는?`, labelled([a, w, r]), {
              figure: lines([eq(1, '/', b, '=', frac(1, b)), `${a} ÷ ${josa(b, '은/는')} ${frac(1, b)}이 ${box(LAB[0])}개이다.`, eq(a, '/', b, '=', frac(box(LAB[0]), b), '=', mixed(box(LAB[1]), box(LAB[2]), b))]),
              explain: `${a} ÷ ${josa(b, '은/는')} ${frac(1, b)}이 ${a}개이므로 ${frac(a, b)}이다. ${a} ÷ ${b} = ${w} … ${r}이므로 대분수로 나타내면 ${mixed(w, r, b)}이다.`,
              facts: { calc: [[String(a), 0], [quot(a, b), 1], [rest(a, b), 2]] }
            });
          }, { count: 2 }),
          T('nn-fig-pick', '(자연수)÷(자연수)의 몫만큼 바르게 색칠한 그림 고르기', '①3·4·11 ②3 ③3', (d) => {
            // 틀린 그림: 나누어지는 수와 나누는 수를 바꾼 것(b ÷ a), 띠마다 몫만큼 다 색칠한 것(a/b 를 a 번)
            const [a, b] = d.until(() => [d.int(2, 3), d.int(3, 5)], ([x, y]) => x < y && gcd(x, y) === 1);
            const rows = d.shuffle([[bands(b, 1, a), `${a}/${b}`, true], [bands(a, 1, b), `${b}/${a}`], [bands(b, a, a), `${a}*${a}/${b}`]]), hit = rows.findIndex((row) => row[2]);
            return C(`띠 하나를 1로 볼 때, ${a} ÷ ${b}의 몫만큼 바르게 색칠한 것은?`, THREE, hit, {
              figure: tagged(rows.map((row) => row[0])),
              explain: `${a} ÷ ${josa(b, '은/는')} 1 ÷ ${b} = ${frac(1, b)}이 ${a}개인 수이다. 띠 ${a}개를 각각 똑같이 ${b}칸으로 나누어 한 칸씩 색칠한 ${LAB[hit]}이 바르다.`,
              facts: { choose: { exprs: rows.map((row) => row[1]), rule: 'equals', target: a / b } }
            });
          }),
          T('nn-rest', '몫과 나머지를 이용하여 몫을 대분수로 나타내기', '①10 ②5 ③8', (d) => {
            const b = d.int(3, 9), w = d.int(1, 5), r = coTop(d, b), a = w * b + r;
            return M(`자연수의 나눗셈의 몫과 나머지를 이용하여 ${a} ÷ ${b}의 몫을 대분수로 나타내는 과정이다. ㉠, ㉡에 알맞은 수는?`, labelled([w, r]), {
              figure: lines([eq(a, '/', b, '=', box(LAB[0]), '…', box(LAB[1])), `나머지를 ${josa(b, '으로/로')} 나누면 ${frac(box(LAB[1]), b)}이다.`, eq(a, '/', b, '=', mixed(box(LAB[0]), box(LAB[1]), b))]),
              explain: `${a} ÷ ${b} = ${w} … ${r}이다. 나머지 ${josa(r, '을/를')} 다시 ${josa(b, '으로/로')} 나누면 ${frac(r, b)}이므로 ${a} ÷ ${b} = ${mixed(w, r, b)}이다.`,
              facts: { calc: [[quot(a, b), 0], [rest(a, b), 1]] }
            });
          }),
          T('nn-fig-share', '그림을 보고 몫이 1보다 큰 (자연수)÷(자연수) 알아보기', '①12 ②2 ③7·10', (d) => {
            const [a, b] = d.until(() => { const b = d.int(2, 4); return [b * d.int(1, 2) + coTop(d, b), b]; }, ([x]) => x <= 8), w = Math.floor(a / b), r = a % b;
            return F(`띠 하나를 1로 볼 때, 띠 ${a}개를 ${b}명이 똑같이 나누어 가졌다. 그림은 한 명이 가진 띠를 색칠한 것이다. ${a} ÷ ${b}의 몫을 대분수로 나타내시오.`, r, b, {
              whole: w, anyForm: true, figure: shareBands(a, b),
              explain: `한 명이 띠를 ${w}개씩 가지고, 남은 띠 ${r}개를 ${r > 1 ? '각각 ' : ''}똑같이 ${b}칸으로 나누어 ${r > 1 ? '한 칸씩' : '한 칸을'} 가졌다. ${frac(1, b)}이 ${r}개이므로 한 명이 가진 띠는 ${mixed(w, r, b)}이다.`,
              facts: { calc: [[quot(a, b), 0], [rest(a, b), 1], [String(b), 2]] }
            });
          }),
          T('nn-calc', '(자연수)÷(자연수)의 몫을 분수로 나타내기', '①6·13 ②6·7 ③4·9 심1', (d, n) => {
            // 문항마다 계산 구조가 다르다: 몫이 1보다 작다, 몫이 1보다 크다(대분수), 몫이 1보다 크고 약분이 된다.
            const kind = ['proper', 'over', 'overReduce'][n], [a, b] = nnPick(d, kind);
            return divQ('나눗셈의 몫을 분수로 나타내시오.', nat(a), b, {
              figure: eq(a, '/', b), facts: { rule: 'nn-' + kind },
              explain: n === 0 ? `${a} ÷ ${josa(b, '은/는')} ${frac(1, b)}이 ${a}개인 수이므로 ${frac(a, b)}이다.` : `나누어지는 수를 분자, 나누는 수를 분모로 하는 분수로 나타낸다. ${told(nat(a), b)}이다.`
            });
          }, { count: 3 }),
          T('nn-calc-reduce', '(자연수)÷(자연수)의 몫을 기약분수로 나타내기', '①7 ③4', (d) => {
            const [a, b] = nnPick(d, 'properReduce'), g = gcd(a, b);
            return divQ('나눗셈의 몫을 기약분수로 나타내시오.', nat(a), b, {
              exact: true, figure: eq(a, '/', b),
              explain: `${a} ÷ ${b} = ${frac(a, b)}이다. 분모와 분자를 각각 ${josa(g, '으로/로')} 나누면 ${frac(a / g, b / g)}이다.`
            });
          }),
          T('nn-box', '나눗셈식과 분수에서 □ 구하기', '①21 ②15 ③16 심3', (d, n) => {
            if (n === 1) {
              // 몫이 대분수: 가분수로 고쳐 분자를 읽는다.
              const b = d.int(3, 9), w = d.int(1, 5), r = coTop(d, b), a = w * b + r;
              return N('□ 안에 알맞은 수는?', a, {
                figure: eq(box(), '/', b, '=', mixed(w, r, b)),
                explain: `${mixed(w, r, b)} = ${frac(a, b)}이다. □ ÷ ${b} = ${frac('□', b)}이므로 □는 ${a}이다.`,
                facts: { calc: [[`${w}*${b}+${r}`, 0]] }
              });
            }
            const [a1, b1, a2, b2] = d.until(() => [d.int(2, 12), d.int(3, 15), d.int(2, 9), d.int(3, 15)], ([x, y, z, k]) => x !== y && z < k && gcd(x, y) === 1 && gcd(z, k) === 1 && new Set([x, y, z, k]).size === 4);
            const figure = lines([eq(box(LAB[0]), '/', b1, '=', frac(a1, b1)), eq(a2, '/', box(LAB[1]), '=', frac(a2, b2))]);
            return M('㉠, ㉡에 알맞은 수는?', labelled([a1, b2]), {
              figure, explain: `나누어지는 수가 분자, 나누는 수가 분모가 된다. ㉠ ÷ ${b1} = ${frac(a1, b1)}에서 ㉠은 ${a1}이고, ${a2} ÷ ㉡ = ${frac(a2, b2)}에서 ㉡은 ${b2}이다.`,
              facts: { calc: [[String(a1), 0], [String(b2), 1]] }
            });
          }, { count: 2 }),
          T('nn-right-pick', '몫을 분수로 잘못 나타낸 것 고르기', '①8 ②10 심4', (d, n) => {
            if (n === 0) {
              // 몫이 1보다 작은 식과 큰 식을 섞는다. 틀린 것은 분자와 분모를 바꾸어 쓴 것이다.
              const rows = d.shuffle(d.until(() => [nnPick(d, 'proper'), nnPick(d, 'proper'), d.until(() => nnPick(d, 'over'), ([x]) => x <= 19), d.until(() => nnPick(d, 'over'), ([x]) => x <= 19)], (list) => new Set(list.map((r) => r.join())).size === 4)), bad = d.int(0, 3);
              const said = rows.map(([a, b], i) => (i === bad ? [b, a] : [a, b]));
              return C('나눗셈의 몫을 분수로 잘못 나타낸 것은?', rows.map(([a, b], i) => eq(a, '/', b, '=', frac(said[i][0], said[i][1]))), bad, {
                explain: `나누어지는 수가 분자, 나누는 수가 분모가 된다. ${rows[bad][0]} ÷ ${rows[bad][1]} = ${frac(rows[bad][0], rows[bad][1])}이다.`,
                facts: { claimed: rows.map(([a, b], i) => [`${a}*${said[i][1]}`, said[i][0] * b]), claimedWant: false }
              });
            }
            // 몫을 대분수로 나타낸 식. 틀린 것은 몫과 나머지를 바꾸어 쓰거나 분모에 나누어지는 수를 쓴 것이다. 약분하여 바르게 적은 식도 섞는다.
            const rows = d.shuffle(d.until(() => [nnPick(d, 'over'), nnPick(d, 'over'), nnPick(d, 'overReduce'), nnPick(d, 'over')], (list) => new Set(list.map((r) => r.join())).size === 4 && list.every(([x]) => x <= 30)));
            const bad = d.until(() => d.int(0, 3), (i) => gcd(rows[i][0], rows[i][1]) === 1);
            const said = rows.map(([a, b], i) => { const w = Math.floor(a / b), r = a % b, v = toV(R(a, b)); return i !== bad ? [v.w, v.n, v.d] : w < b && w !== r ? [r, w, b] : [w, r, a]; });
            return C('나눗셈의 몫을 대분수로 잘못 나타낸 것은?', rows.map(([a, b], i) => eq(a, '/', b, '=', mixed(said[i][0], said[i][1], said[i][2]))), bad, {
              explain: `${rows[bad][0]} ÷ ${rows[bad][1]} = ${Math.floor(rows[bad][0] / rows[bad][1])} … ${rows[bad][0] % rows[bad][1]}이므로 ${told(nat(rows[bad][0]), rows[bad][1])}이다.`,
              facts: { claimed: rows.map(([a, b], i) => [`${a}*${said[i][2]}`, (said[i][0] * said[i][2] + said[i][1]) * b]), claimedWant: false, rule: 'rightMixed' }
            });
          }, { count: 2 }),
          T('nn-match', '나눗셈과 몫 짝 짓기', '②11 ③5 심5', (d) => {
            // 두 수를 바꾸어 나눈 식과 나누는 수가 같은 식을 섞어 분모만 보아서는 짝 지을 수 없게 한다.
            const [a, b] = d.until(() => { const a = d.int(3, 8); return [a, d.int(a + 1, 2 * a - 1)]; }, ([x, y]) => gcd(x, y) === 1);
            const rows = d.shuffle([[a, b], [b, a], [a + b, b]]), xs = rows.map(([x, y]) => qd(nat(x), y)), ints = scaledValues(xs), pick = matchChoice(d, (j) => res(nat(rows[j][0]), rows[j][1]));
            return C('나눗셈과 몫을 알맞게 짝 지은 것은?', pick.options, pick.answer, {
              figure: tagged(rows.map(([x, y]) => eq(x, '/', y))),
              explain: rows.map(([x, y], i) => `${LAB[i]} ${told(nat(x), y)}`).join(', ') + '이다.',
              facts: { match: { exprs: scaled(xs), options: pick.list.map((o) => o.map((j) => ints[j])) } }
            });
          }),
          T('nn-ends', '가장 큰 수와 가장 작은 수로 나눗셈하기', '①14 ②14 ③17 심8', (d, n) => {
            // 첫째 문항은 가장 큰 수를 가장 작은 수로, 둘째 문항은 가장 작은 수를 가장 큰 수로 나눈다.
            const list = d.until(() => d.shuffle([2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 17, 19]).slice(0, 5), (xs) => { const hi = Math.max(...xs), lo = Math.min(...xs); return hi % lo !== 0 && lo >= 3; });
            const hi = Math.max(...list), lo = Math.min(...list), [a, b] = n === 0 ? [hi, lo] : [lo, hi];
            return divQ(n === 0 ? '가장 큰 수를 가장 작은 수로 나눈 몫을 분수로 나타내시오.' : '가장 작은 수를 가장 큰 수로 나눈 몫을 분수로 나타내시오.', nat(a), b, {
              figure: numbers(list), explain: `가장 큰 수는 ${hi}, 가장 작은 수는 ${lo}이다. ${told(nat(a), b)}이다.`
            });
          }, { count: 2 }),
          T('nn-over-one', '몫이 1보다 큰 나눗셈 세기', '①15 ②12 ③13 심6', (d) => {
            const rows = d.until(() => Array.from({ length: 6 }, () => { const b = d.int(5, 21); return [b + d.pick([-4, -3, -2, -1, 1, 2, 3, 4]), b]; }), (list) => { const k = list.filter(([a, b]) => a > b).length; return k >= 2 && k <= 4 && new Set(list.map((r) => r.join())).size === 6; });
            const hits = rows.filter(([a, b]) => a > b);
            return N('몫이 1보다 큰 나눗셈은 모두 몇 개인가?', hits.length, {
              unit: '개', figure: numbers(rows.map(([a, b]) => `${a} ÷ ${b}`)),
              explain: `나누어지는 수가 나누는 수보다 크면 몫이 1보다 크다. 몫이 1보다 큰 나눗셈은 ${hits.map(([a, b]) => `${a} ÷ ${b}`).join(', ')}이다.`,
              facts: { choose: { exprs: rows.map(([a, b]) => `${a}/${b}`), rule: 'countAbove', target: 1 } }
            });
          }),
          T('nn-half', '몫이 1/2보다 큰 나눗셈 찾기', '①15 ②12 ③14', (d) => {
            // 몫이 꼭 1/2인 식을 하나 섞는다(1/2보다 큰 것이 아니다).
            const m = d.until(() => { const h = d.int(3, 9), b1 = d.int(7, 19), b2 = d.int(7, 19), b3 = d.int(7, 19); return [[Math.floor(b1 / 2) + d.int(1, 2), b1], [h, 2 * h], [Math.ceil(b2 / 2) - d.int(1, 2), b2], [Math.ceil(b3 / 2) - d.int(1, 2), b3]]; }, (list) => new Set(list.map((r) => r.join())).size === 4 && list[0][0] < list[0][1] && new Set(list.map((r) => r[1])).size === 4);
            const rows = d.shuffle(m), hit = rows.findIndex(([a, b]) => 2 * a > b), [a, b] = rows[hit], half = rows.find(([x, y]) => 2 * x === y);
            return C(`몫이 ${frac(1, 2)}보다 큰 것은?`, rows.map(([x, y]) => eq(x, '/', y)), hit, {
              explain: `나누어지는 수의 2배가 나누는 수보다 크면 몫이 ${frac(1, 2)}보다 크다. ${a} × 2 = ${josa(2 * a, '은/는')} ${b}보다 크므로 ${a} ÷ ${b}의 몫이 ${frac(1, 2)}보다 크다. ${half[0]} ÷ ${half[1]}의 몫은 ${fj(1, 2, '과/와')} 같다.`,
              facts: { only: { values: rows.map(([x, y]) => 2 * x - y), test: 'atLeast', target: 1 } }
            });
          }),
          T('nn-same-value', '(자연수)÷(자연수)의 몫과 다른 것 찾기', '②8·9 ③11·12 심4', (d) => {
            // 틀린 것: 분자와 분모를 바꾼 분수, 나누어지는 수를 뒤집어 곱한 식 가운데 하나
            const [a, b] = d.until(() => nnPick(d, 'over'), ([x, y]) => x < 3 * y && y >= 3), w = Math.floor(a / b), r = a % b;
            const wrong = d.bool() ? [ex(frac(b, a)), `${b}/${a}`] : [eq(frac(1, a), '*', b), `1/${a}*${b}`];
            const rows = d.shuffle([[ex(frac(a, b)), `${a}/${b}`], [ex(mixed(w, r, b)), `${w}+${r}/${b}`], [eq(a, '*', frac(1, b)), `${a}*1/${b}`], [wrong[0], wrong[1], true]]);
            return C(`${a} ÷ ${b}의 몫과 다른 것은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[2]), {
              explain: `${a} ÷ ${b} = ${a} × ${frac(1, b)} = ${frac(a, b)} = ${mixed(w, r, b)}이다. 나누어지는 수 ${josa(a, '이/가')} 분자, 나누는 수 ${josa(b, '이/가')} 분모가 된다.`,
              facts: { choose: { exprs: rows.map((row) => row[1]), rule: 'odd' } }
            });
          }),
          T('nn-same-quot', '몫이 다른 나눗셈 찾기', '①16 ②13 심7', (d) => {
            // 세 식은 약분하면 몫이 같고 한 식만 다르다.
            const m = d.until(() => { const qq = d.int(3, 6), p = coTop(d, qq), ks = d.shuffle([2, 3, 4, 5]).slice(0, 3), k = d.int(2, 4); return { p, qq, ks, odd: [(p + 1) * k, (qq + 1) * k] }; }, (v) => v.ks.every((k) => v.qq * k <= 30) && v.odd[0] !== v.odd[1]);
            const rows = d.shuffle(m.ks.map((k) => [m.p * k, m.qq * k]).concat([m.odd.concat([true])])), hit = rows.findIndex((row) => row[2]);
            return C('몫이 나머지와 다른 하나는?', rows.map(([a, b]) => eq(a, '/', b)), hit, {
              explain: `몫을 분수로 나타내어 약분하면 ${rows.map(([a, b]) => `${a} ÷ ${b} = ${frac(a, b)} = ${show(toV(R(a, b)))}`).join(', ')}이다. ${rows[hit][0]} ÷ ${rows[hit][1]}의 몫만 다르다.`,
              facts: { choose: { exprs: rows.map(([a, b]) => `${a}/${b}`), rule: 'odd' } }
            });
          }),
          T('nn-times', '(자연수)÷(자연수)를 분수의 곱셈으로 나타내기', '②8·9', (d) => {
            const [a, b] = d.until(() => nnPick(d, 'over'), ([x, y]) => y >= 3 && x <= 30), w = Math.floor(a / b), r = a % b;
            return M(`${a} ÷ ${josa(b, '을/를')} 분수의 곱셈으로 나타내어 계산하는 과정이다. ㉠, ㉡, ㉢에 알맞은 수는?`, labelled([b, w, r]), {
              figure: lines([eq(a, '/', b, '=', a, '*', frac(1, box(LAB[0]))), eq('=', frac(a, box(LAB[0])), '=', mixed(box(LAB[1]), box(LAB[2]), box(LAB[0])))]),
              explain: `${josa(b, '으로/로')} 나누는 것은 ${fj(1, b, '을/를')} 곱하는 것과 같다. ${a} × ${frac(1, b)} = ${frac(a, b)} = ${mixed(w, r, b)}이다.`,
              facts: { calc: [[String(b), 0], [quot(a, b), 1], [rest(a, b), 2]] }
            });
          }),
          T('nn-times-of', '몇 배인지 분수로 나타내기', '①17 ②23 심11', (d) => {
            const [a, b] = d.until(() => [d.int(5, 30), d.int(3, 9)], ([x, y]) => x > y && x % y !== 0 && x < 5 * y);
            return divQ(`${josa(a, '은/는')} ${b}의 몇 배인가?`, nat(a), b, { unit: '배', explain: `${josa(a, '을/를')} ${josa(b, '으로/로')} 나눈다. ${told(nat(a), b)}이므로 ${res(nat(a), b)}배이다.` });
          }),
          T('nn-line-pick', '(자연수)÷(자연수)의 몫을 수직선에서 찾기', '①9 ②1 ③1', (d) => {
            // 틀린 수직선: 나누어지는 수와 나누는 수를 바꾼 것(b ÷ a), 0도 한 칸으로 세어 한 칸 앞에 표시한 것
            const [a, b] = d.until(() => { const b = d.int(2, 4); return [b * d.int(1, 2) + coTop(d, b), b]; }, ([x]) => x <= 9), spans = Math.floor(a / b) + 1;
            const rows = d.shuffle([[b, a, true], [a, b], [b, a - 1]]), hit = rows.findIndex((row) => row[2]);
            return C(`수직선에서 ${a} ÷ ${b}의 몫을 바르게 나타낸 것은?`, THREE, hit, {
              figure: tagged(rows.map(([parts, at]) => tickLine(spans, parts, at))),
              explain: `${a} ÷ ${b} = ${frac(a, b)}${tail(a, '은/는')} ${frac(1, b)}이 ${a}개인 수이다. 1을 똑같이 ${b}칸으로 나눈 수직선에서 0부터 작은 눈금 ${a}칸을 간 ${LAB[hit]}이 바르다.`,
              facts: { choose: { exprs: rows.map(([parts, at]) => `${at}/${parts}`), rule: 'equals', target: a / b } }
            });
          })
        ]
      },
      {
        id: 'nncomp', title: '(자연수)÷(자연수): 몫의 크기 비교와 □', standard: STD_NN,
        types: [
          T('nc-sign', '두 나눗셈의 몫의 크기 비교', '①18 ②13 ③15 심7', (d, n) => {
            // 문항마다 견주는 길이 다르다: 나누는 수가 같다, 나누어지는 수가 같다, 한쪽 몫만 1보다 크다, 한쪽이 분수이다(분자가 같거나 크기가 같다).
            if (n === 3) {
              const [a, b, c] = d.until(() => [d.int(2, 9), d.int(5, 15), d.int(5, 15)], ([x, y, z]) => x < y && x < z && gcd(x, y) === 1 && gcd(x, z) === 1), same = d.int(0, 3) === 0, e = same ? b : c;
              const sign = b === e ? 1 : b < e ? 0 : 2;
              return C('나눗셈의 몫과 분수의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, sign, {
                figure: versus(eq(a, '/', b), ex(frac(a, e))),
                explain: `${a} ÷ ${b} = ${frac(a, b)}이다. ` + (sign === 1 ? '두 수의 크기는 같다.' : `분자가 같은 분수는 분모가 작을수록 크므로 ${frac(a, b)} ${SIGNS[sign]} ${frac(a, e)}이다.`),
                facts: { choose: { exprs: [`${a}*${e}`, `${a}*${b}`], rule: 'compare' } }
              });
            }
            let rows, why;
            if (n === 0) {
              const [a, b, c] = d.until(() => [d.int(2, 14), d.int(2, 14), d.int(5, 15)], ([x, y, z]) => x !== y && x !== z && y !== z);
              rows = [[a, c], [b, c]]; why = `나누는 수가 같으면 나누어지는 수가 클수록 몫이 크다. ${frac(a, c)} ${SIGNS[a > b ? 0 : 2]} ${frac(b, c)}이다.`;
            } else if (n === 1) {
              const [a, b, c] = d.until(() => [d.int(1, 9), d.int(4, 15), d.int(4, 15)], ([x, y, z]) => y !== z && x !== y && x !== z);
              rows = [[a, b], [a, c]]; why = `나누어지는 수가 같으면 나누는 수가 클수록 몫이 작다. ${frac(a, b)} ${SIGNS[b < c ? 0 : 2]} ${frac(a, c)}이다.`;
            } else {
              const [a, b, c, e] = d.until(() => [d.int(3, 14), d.int(4, 15), d.int(4, 15), d.int(3, 14)], ([x, y, z, k]) => x < y && z > k && z < 2 * k && new Set([x, y, z, k]).size === 4 && y - x <= 4 && z - k <= 4);
              rows = d.shuffle([[a, b], [c, e]]); why = `${a} ÷ ${b}의 몫은 1보다 작고, ${c} ÷ ${e}의 몫은 1보다 크다.`;
            }
            const [[x1, y1], [x2, y2]] = rows, sign = x1 * y2 > x2 * y1 ? 0 : 2;
            return C('두 나눗셈의 몫의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, sign, {
              figure: versus(eq(x1, '/', y1), eq(x2, '/', y2)), explain: why,
              facts: { choose: { exprs: [`${x1}*${y2}`, `${x2}*${y1}`], rule: 'compare' }, rule: ['sameDivisor', 'sameDividend', 'acrossOne'][n] }
            });
          }, { count: 4 }),
          T('nc-max', '몫이 가장 큰(작은) 나눗셈 찾기', '①20 ②13 심7', (d) => {
            // 두 식은 나누는 수가 같고, 두 식은 나누어지는 수가 같다. 통분하지 않고 견줄 수 있다.
            const [a, c, b, e] = d.until(() => [d.int(3, 14), d.int(2, 13), d.int(5, 19), d.int(4, 18)], ([x, y, z, k]) => y < x && k < z && new Set([x, y, z, k]).size === 4), big = d.bool();
            const order = d.shuffle([0, 1, 2]), base = [[c, b], [a, b], [a, e]], rows = order.map((i) => base[i]), hit = order.indexOf(big ? 2 : 0);
            return C(`몫이 가장 ${big ? '큰' : '작은'} 것은?`, THREE, hit, {
              figure: tagged(rows.map(([x, y]) => eq(x, '/', y))),
              explain: `나누는 수가 같은 ${c} ÷ ${josa(b, '과/와')} ${a} ÷ ${b}에서는 ${frac(c, b)} ${LT} ${frac(a, b)}이고, 나누어지는 수가 같은 ${a} ÷ ${josa(b, '과/와')} ${a} ÷ ${e}에서는 ${frac(a, b)} ${LT} ${frac(a, e)}이다. 가장 ${big ? '큰' : '작은'} 것은 ${LAB[hit]}이다.`,
              facts: { choose: { exprs: rows.map(([x, y]) => `${x}*${y === b ? e : b}`), rule: big ? 'max' : 'min' } }
            });
          }),
          T('nc-order', '몫을 크기 차례로 늘어놓기', '①20 ②13 ③15', (d) => {
            // 몫을 대분수로 나타내면 자연수 부분이 모두 다르다.
            const rows = d.until(() => d.shuffle([1, 2, 3]).map((w) => { const b = d.int(3, 9); return [w * b + coTop(d, b), b]; }), (list) => new Set(list.map((r) => r[1])).size === 3 && new Set(list.map((r) => r[0])).size === 3 && Math.max(...list.map((r) => r[0])) - Math.min(...list.map((r) => r[0])) <= 9);
            const vals = rows.map(([a, b]) => R(a, b)), desc = d.bool(), pick = orderChoice(d, vals, THREE, desc), xs = rows.map(([a, b]) => qd(nat(a), b));
            return C(`몫이 ${desc ? '큰' : '작은'} 것부터 차례대로 쓴 것은?`, pick.options, pick.answer, {
              figure: tagged(rows.map(([a, b]) => eq(a, '/', b))),
              explain: `몫을 대분수로 나타내면 ${rows.map(([a, b], i) => `${LAB[i]} ${res(nat(a), b)}`).join(', ')}이다. 자연수 부분이 ${desc ? '큰' : '작은'} 것부터 쓰면 ${pick.right.map((i) => LAB[i]).join(', ')}이다.`,
              facts: { choose: { exprs: scaled(xs), rule: desc ? 'descending' : 'ascending', orders: pick.list } }
            });
          }),
          T('nc-times-box', '곱셈식의 □를 나눗셈으로 구하기(자연수)', '①22 ②18 ③79 심10', (d, n) => {
            if (n === 0) {
              const [a, b] = nnPick(d, 'proper');
              return divQ('□ 안에 알맞은 수를 분수로 나타내시오.', nat(a), b, { figure: eq(box(), '*', b, '=', a), explain: `□ = ${a} ÷ ${b}이다. ${told(nat(a), b)}이다.` });
            }
            const [a, b] = d.until(() => nnPick(d, 'over'), ([x, y]) => y >= 3);
            return divQ(`어떤 수에 ${josa(b, '을/를')} 곱하였더니 ${josa(a, '이/가')} 되었다. 어떤 수를 분수로 나타내시오.`, nat(a), b, { explain: `(어떤 수) × ${b} = ${a}이므로 어떤 수는 ${a} ÷ ${b}이다. ${told(nat(a), b)}이다.` });
          }, { count: 2 }),
          T('nc-box', '몫과 크기를 비교하여 □에 들어갈 수 구하기', '①24 ③19 심29', (d, n) => {
            if (n === 0) {
              // 몫을 대분수로 나타내어 분자끼리 견준다.
              const b = d.int(5, 9), w = d.int(1, 4), r = d.until(() => d.int(3, b - 1), (x) => gcd(x, b) === 1), a = w * b + r;
              return N('□ 안에 들어갈 수 있는 자연수는 모두 몇 개인가?', r - 1, {
                unit: '개', figure: eq(a, '/', b, '>', mixed(w, box(), b)),
                explain: `${a} ÷ ${b} = ${frac(a, b)} = ${mixed(w, r, b)}이다. ${mixed(w, r, b)} ${GT} ${mixed(w, '□', b)}이므로 □는 ${r}보다 작은 자연수이다. 1부터 ${r - 1}까지 ${r - 1}개이다.`,
                facts: { digit: { template: `${a}>${w}*${b}+□`, lo: 1, hi: b - 1, ask: 'count' } }
              });
            }
            if (n === 1) {
              // 나누는 수가 몇 배인 식: 분모를 같게 하여 분자끼리 견준다.
              const [b, k] = d.pick([[5, 2], [4, 2], [3, 4], [4, 3], [6, 2], [3, 3]]), big = b * k, a = d.until(() => coTop(d, b), (x) => x * k >= 2 && x * k <= 8), gt = d.bool(), cut = a * k;
              const list = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((x) => (gt ? x > cut : x < cut));
              return N('1부터 9까지의 자연수 가운데 □ 안에 들어갈 수 있는 수는 모두 몇 개인가?', list.length, {
                unit: '개', figure: eq(box(), '/', big, gt ? '>' : '<', a, '/', b),
                explain: `□ ÷ ${big} = ${frac('□', big)}이고, ${a} ÷ ${b} = ${frac(a, b)} = ${frac(cut, big)}이다. □는 ${cut}보다 ${gt ? '커야' : '작아야'} 하므로 ${list.join(', ')}의 ${list.length}개이다.`,
                facts: { digit: { template: gt ? `□*${b}>${a}*${big}` : `□*${b}<${a}*${big}`, lo: 1, hi: 9, ask: 'count' } }
              });
            }
            // 나누는 수 자리의 □: 계산하지 않고 나누어지는 수와 견준다.
            const a = d.int(3, 8), small = d.bool(), list = [2, 3, 4, 5, 6, 7, 8, 9].filter((x) => (small ? x > a : x < a));
            return N('2부터 9까지의 자연수 가운데 □ 안에 들어갈 수 있는 수는 모두 몇 개인가?', list.length, {
              unit: '개', figure: eq(a, '/', box(), small ? '<' : '>', 1),
              explain: `몫이 1보다 ${small ? '작으려면' : '크려면'} 나누는 수가 나누어지는 수 ${a}보다 ${small ? '커야' : '작아야'} 한다. ${list.join(', ')}의 ${list.length}개이다.`,
              facts: { digit: { template: small ? `${a}/□<1` : `${a}/□>1`, lo: 2, hi: 9, ask: 'count' } }
            });
          }, { count: 3 }),
          T('nc-cards', '수 카드로 몫이 가장 큰(작은) 나눗셈 만들기', '①25 ②16 ③18 심31', (d, n) => {
            if (n === 1) {
              // 나누어지는 수가 정해진 식에 한 장을 넣는다.
              const c = d.int(1, 3), big = d.bool(), list = d.shuffle([2, 3, 4, 5, 6, 7, 8, 9].filter((x) => x > c)).slice(0, 4), pick = big ? Math.min(...list) : Math.max(...list);
              return divQ(`수 카드 4장 가운데 1장을 골라 □ 안에 넣어 몫이 가장 ${big ? '큰' : '작은'} 나눗셈을 만들었다. 이 나눗셈의 몫을 분수로 나타내시오.`, nat(c), pick, {
                figure: cards(list) + eq(c, '/', box()),
                explain: `나누어지는 수가 같으면 나누는 수가 ${big ? '작을수록' : '클수록'} 몫이 ${big ? '크다' : '작다'}. 가장 ${big ? '작은' : '큰'} 수 ${josa(pick, '을/를')} 넣으면 ${told(nat(c), pick)}이다.`
              });
            }
            const big = d.bool(), list = d.until(() => d.shuffle([2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4), (xs) => Math.max(...xs) % Math.min(...xs) !== 0), hi = Math.max(...list), lo = Math.min(...list), [a, b] = big ? [hi, lo] : [lo, hi];
            return divQ(`수 카드 4장 가운데 2장을 골라 □ 안에 한 번씩 넣어 몫이 가장 ${big ? '큰' : '작은'} 나눗셈을 만들었다. 이 나눗셈의 몫을 분수로 나타내시오.`, nat(a), b, {
              figure: cards(list) + eq(box(), '/', box()),
              explain: `나누어지는 수가 ${big ? '클수록' : '작을수록'}, 나누는 수가 ${big ? '작을수록' : '클수록'} 몫이 ${big ? '크다' : '작다'}. 가장 ${big ? '큰' : '작은'} 수 ${josa(a, '을/를')} 가장 ${big ? '작은' : '큰'} 수 ${josa(b, '으로/로')} 나누면 ${told(nat(a), b)}이다.`
            });
          }, { count: 2 })
        ]
      },
      {
        id: 'fn', title: '(분수)÷(자연수)', standard: STD,
        types: [
          T('fn-fig-top', '그림을 보고 분자가 나누어떨어지는 (분수)÷(자연수) 알아보기', '①26 ②27 ③26', (d) => {
            const [a, b, c] = d.until(() => { const c = d.int(2, 4), a = c * d.int(2, 3); return [a, d.int(a + 1, 11), c]; }, ([x, y]) => gcd(x, y) === 1 && y >= 5), v = V(0, a, b);
            return divQ(`띠의 ${vj(v, '을/를')} 색칠한 다음, 색칠한 부분을 그림과 같이 똑같이 ${c}묶음으로 나누었다. 그림을 보고 ${show(v)} ÷ ${c}의 몫을 구하시오.`, v, c, {
              figure: groupBand(b, a, c),
              explain: `색칠한 ${a}칸을 똑같이 ${c}묶음으로 나누면 한 묶음은 ${a} ÷ ${c} = ${a / c}(칸)이다. 한 칸은 ${frac(1, b)}이므로 ${show(v)} ÷ ${c} = ${frac(`${a} ÷ ${c}`, b)} = ${frac(a / c, b)}이다.`
            });
          }),
          T('fn-top-steps', '분자를 자연수로 나누어 계산하는 과정', '①26 ②27 ③27', (d) => {
            const [v, c] = d.until(() => pfPick(d, 'top'), ([x, y]) => x.n / y >= 2), a = v.n, b = v.d;
            return M('분자를 자연수로 나누어 계산하는 과정이다. ㉠, ㉡에 알맞은 수는?', labelled([c, a / c]), {
              figure: lines([eq(show(v), '/', c, '=', frac(`${a} ÷ ${box(LAB[0])}`, b), '=', frac(box(LAB[1]), b))]),
              explain: `${vj(v, '은/는')} ${frac(1, b)}이 ${a}개인 수이다. ${a}개를 똑같이 ${josa(c, '으로/로')} 나누면 ${a} ÷ ${c} = ${a / c}(개)이므로 ${frac(a / c, b)}이다.`,
              facts: { calc: [[String(c), 0], [`${a}/${c}`, 1]] }
            });
          }),
          T('fn-equal-steps', '크기가 같은 분수로 바꾸어 계산하는 과정', '①27·28 ②28 ③28·29·31 심14', (d, n) => {
            if (n === 0) {
              // 분자와 자연수에 공약수가 없다: 분모와 분자에 자연수를 곱한다. 진분수와 가분수를 모두 쓴다.
              const [v, c] = d.until(() => (d.bool() ? pfPick(d, 'plain', 9, 6) : ifPick(d, 'plain', 6)), ([x, y]) => x.d * y <= 45 && y <= 6), a = v.n, b = v.d;
              return M(`분자가 ${c}의 배수가 되도록 분모와 분자에 각각 ${josa(c, '을/를')} 곱하여 계산하는 과정이다. ㉠, ㉡에 알맞은 수는?`, labelled([a * c, a]), {
                figure: lines([eq(show(v), '/', c, '=', frac(`${a} × ${c}`, `${b} × ${c}`), '/', c), eq('=', frac(box(LAB[0]), b * c), '/', c), eq('=', frac(`${box(LAB[0])} ÷ ${c}`, b * c), '=', frac(box(LAB[1]), b * c))]),
                explain: `분자 ${josa(a, '은/는')} ${c}의 배수가 아니므로 크기가 같은 분수 ${frac(a * c, b * c)}${tail(a * c, '으로/로')} 바꾼다. ${frac(`${a * c} ÷ ${c}`, b * c)} = ${frac(a, b * c)}이다.`,
                facts: { calc: [[`${a}*${c}`, 0], [`${a}*${c}/${c}`, 1]] }
              });
            }
            // 분자와 자연수에 공약수가 있다: 분자가 자연수의 배수가 되는 가장 작은 수를 곱한다.
            const [v, c] = d.until(() => pfPick(d, 'reduce', 15, 12), ([x, y]) => y / gcd(x.n, y) >= 2 && x.d * y / gcd(x.n, y) <= 60), a = v.n, b = v.d, k = c / gcd(a, c);
            return M(`분자가 ${c}의 배수가 되도록 분모와 분자에 각각 ${josa(k, '을/를')} 곱하여 계산하는 과정이다. ㉠, ㉡에 알맞은 수는?`, labelled([a * k, a * k / c]), {
              figure: lines([eq(show(v), '/', c, '=', frac(box(LAB[0]), b * k), '/', c), eq('=', frac(`${box(LAB[0])} ÷ ${c}`, b * k), '=', frac(box(LAB[1]), b * k))]),
              explain: `분모와 분자에 각각 ${josa(k, '을/를')} 곱하면 ${frac(a * k, b * k)}이고, ${a * k} ÷ ${c} = ${a * k / c}이므로 ${frac(a * k / c, b * k)}이다.`,
              facts: { calc: [[`${a}*${k}`, 0], [`${a}*${k}/${c}`, 1]] }
            });
          }, { count: 2 }),
          T('fn-fig-grid', '그림을 보고 (분수)÷(자연수)의 몫 알아보기', '①27·34 ②28·29 ③28·32', (d) => {
            const [a, b, c] = d.until(() => { const b = d.int(3, 6); return [coTop(d, b, 2), b, d.int(2, 5)]; }, ([x, y, z]) => gcd(x, z) === 1 && y !== z), v = V(0, a, b);
            return M(`정사각형의 ${vj(v, '을/를')} 옅게 색칠하고, 색칠한 부분을 똑같이 ${josa(c, '으로/로')} 나눈 것 중의 하나를 진하게 색칠하였다. ㉠, ㉡에 알맞은 수는?`, labelled([b * c, a]), {
              figure: divGrid(a, b, c) + lines([`진하게 색칠한 부분은 정사각형을 똑같이 ${box(LAB[0])}칸으로 나눈 것 중의 ${box(LAB[1])}칸이다.`, eq(show(v), '/', c, '=', frac(box(LAB[1]), box(LAB[0])))]),
              explain: `정사각형은 똑같이 ${b} × ${c} = ${b * c}(칸)으로 나누어지고, 진하게 색칠한 칸은 ${a}칸이다. ${show(v)} ÷ ${c} = ${frac(a, b * c)}이다.`,
              facts: { calc: [[`${b}*${c}`, 0], [String(a), 1]] }
            });
          }),
          T('fn-calc', '(진분수)÷(자연수)', '①29 ②32 ③36·37·38 심12', (d, n) => {
            // 문항마다 계산 구조가 다르다: 분자가 나누어떨어진다, 나누어떨어지지 않고 약분이 없다, 분자와 자연수를 약분한다, 단위분수, 나누는 수가 두 자리(분자가 나누는 수의 약수).
            const kind = ['top', 'plain', 'reduce', 'unit', 'two'][n];
            const [v, c] = kind === 'two' ? d.until(() => { const b = d.int(5, 20), a = coTop(d, b, 2); return [V(0, a, b), a * d.int(2, 6)]; }, ([x, y]) => y >= 10 && y <= 24 && x.d * y / x.n <= 80) : pfPick(d, kind);
            return divQ(CALC, v, c, { figure: div(v, c), explain: (kind === 'top' ? TOP_DIV : kind === 'reduce' || kind === 'two' ? '분수의 곱셈으로 나타낸 다음 분자와 자연수를 약분한다. ' : TO_MUL) + told(v, c) + '이다.', facts: { rule: 'pf-' + kind } });
          }, { count: 5 }),
          T('fn-improper-calc', '(가분수)÷(자연수)', '①30 ②33 ③39 심12', (d, n) => {
            // 문항마다 계산 구조가 다르다: 분자가 나누어떨어진다, 약분이 없다, 분자와 자연수를 약분한다, 몫이 1보다 크다.
            const kind = ['top', 'plain', 'reduce', 'over'][n], [v, c] = ifPick(d, kind);
            return divQ(CALC, v, c, { figure: div(v, c), explain: (kind === 'top' ? TOP_DIV : kind === 'reduce' ? '분수의 곱셈으로 나타낸 다음 분자와 자연수를 약분한다. ' : TO_MUL) + told(v, c) + '이다.', facts: { rule: 'if-' + kind } });
          }, { count: 4 }),
          T('fn-fig-pick', '(분수)÷(자연수)의 몫만큼 바르게 색칠한 그림 고르기', '①31 ②34 ③30 심16', (d) => {
            // 틀린 그림: 전체를 자연수로 나눈 것 중의 하나를 칠한 것(1/c), 세로줄 하나만 칠한 것(1/b)
            const [a, b, c] = d.until(() => { const b = d.int(3, 5); return [coTop(d, b, 2), b, d.int(2, 4)]; }, ([x, y, z]) => new Set([x, y, z]).size === 3 && gcd(x, z) === 1), v = V(0, a, b), head = `정사각형을 가로 ${b}칸, 세로 ${c}칸으로 똑같이 나누었다. `;
            const rows = d.shuffle([
              [areaGrid(b, c, (x, y) => (x < a && y === 0 ? 2 : 0), head + `맨 위 가로줄의 왼쪽 ${a}칸을 색칠`, 84), `${a}/(${b}*${c})`, true],
              [areaGrid(b, c, (x, y) => (y === 0 ? 2 : 0), head + `맨 위 가로줄 ${b}칸을 모두 색칠`, 84), `${b}/(${b}*${c})`],
              [areaGrid(b, c, (x) => (x === 0 ? 2 : 0), head + `맨 왼쪽 세로줄 ${c}칸을 모두 색칠`, 84), `${c}/(${b}*${c})`]
            ]), hit = rows.findIndex((row) => row[2]);
            return C(`정사각형 하나를 1로 볼 때, ${show(v)} ÷ ${c}의 몫만큼 바르게 색칠한 것은?`, THREE, hit, {
              figure: B.kit.geo.tiles(rows.map((row, i) => [LAB[i], row[0]])),
              explain: `${show(v)} ÷ ${josa(c, '은/는')} 정사각형의 ${vj(v, '을/를')} 똑같이 ${josa(c, '으로/로')} 나눈 것 중의 하나이다. 똑같이 나눈 ${b * c}칸 가운데 ${a}칸을 색칠한 ${LAB[hit]}이 바르다. ${show(v)} ÷ ${c} = ${frac(a, b * c)}이다.`,
              facts: { choose: { exprs: rows.map((row) => row[1]), rule: 'equals', target: a / (b * c) } }
            });
          }),
          T('fn-line-pick', '(분수)÷(자연수)의 몫을 수직선에서 찾기', '①31 ③30 심16', (d) => {
            // 틀린 수직선: 나누어지는 수를 그대로 표시한 것, 나누지 않고 자연수만큼 뺀 것
            const [a, b, c] = d.until(() => { const c = d.int(2, 4), a = c * d.int(2, 4); return [a, d.int(a + 1, 12), c]; }, ([x, y, z]) => x / z !== x - z && y <= 12 && gcd(x, y) === 1), v = V(0, a, b);
            const rows = d.shuffle([[a / c, true], [a], [a - c]]), hit = rows.findIndex((row) => row[1]);
            return C(`수직선에서 ${show(v)} ÷ ${c}의 몫을 바르게 나타낸 것은?`, THREE, hit, {
              figure: tagged(rows.map(([at]) => tickLine(1, b, at))),
              explain: `${vj(v, '은/는')} ${frac(1, b)}이 ${a}개인 수이므로 ${show(v)} ÷ ${c} = ${frac(`${a} ÷ ${c}`, b)} = ${frac(a / c, b)}이다. 0부터 작은 눈금 ${a / c}칸을 간 ${LAB[hit]}이 바르다.`,
              facts: { choose: { exprs: rows.map(([at]) => `${at}/${b}`), rule: 'equals', target: a / c / b } }
            });
          }),
          T('fn-chain', '이어서 두 번 나누기', '①32 ③48 심17', (d, n) => {
            const TEXT = '차례로 나누어 빈 곳에 써넣으려고 한다. ㉠에 알맞은 수는?';
            if (n === 0) {
              // 진분수에서 시작한다: 첫 나눗셈은 분자가 나누어떨어진다.
              const [v, c1, c2] = d.until(() => { const [x, y] = pfPick(d, 'top', 20, 5); return [x, y, d.int(2, 6)]; }, ([x, y, z]) => y !== z && x.n / y >= 2 && x.d * z <= 90), mid = toV(quo(v, c1));
              return ansQ(TEXT, qdiv(qd(v, c1), c2), { figure: flow([show(v), { step: `÷ ${c1}` }, box(), { step: `÷ ${c2}` }, box(LAB[0])]), explain: `${told(v, c1)}이고, ${told(mid, c2)}이다.` });
            }
            // 자연수에서 시작한다: (자연수)÷(자연수)의 몫을 다시 자연수로 나눈다.
            const [a, b, c] = d.until(() => [d.int(2, 9), d.int(3, 9), d.int(2, 6)], ([x, y, z]) => gcd(x, y) === 1 && y !== z && x !== y && y * z <= 48), mid = toV(R(a, b));
            return ansQ(TEXT, qdiv(qd(nat(a), b), c), { figure: flow([a, { step: `÷ ${b}` }, box(), { step: `÷ ${c}` }, box(LAB[0])]), explain: `${told(nat(a), b)}이고, ${told(mid, c)}이다.` });
          }, { count: 2 })
        ]
      },
      {
        id: 'mul', title: '분수의 곱셈으로 나타내어 계산하기', standard: STD,
        types: [
          T('mul-mean', '(분수)÷(자연수)를 「~의 몇 분의 1」로 알아보기', '①34 ②29 ③32', (d) => {
            const [v, c] = d.until(() => pfPick(d, 'plain', 9, 7), ([x, y]) => x.d !== y), a = v.n, b = v.d;
            return M(`${show(v)} ÷ ${c}의 몫을 알아보는 과정이다. ㉠, ㉡, ㉢에 알맞은 수는?`, labelled([c, a, b * c]), {
              figure: lines([`${show(v)} ÷ ${c}의 몫은 ${vj(v, '을/를')} 똑같이 ${box(LAB[0])}묶음으로 나눈 것 중의 한 묶음이다.`, `이것은 ${show(v)}의 ${frac(1, box(LAB[0]))}이다.`, eq(show(v), '/', c, '=', show(v), '*', frac(1, box(LAB[0])), '=', frac(box(LAB[1]), box(LAB[2])))]),
              explain: `${vj(v, '을/를')} 똑같이 ${c}묶음으로 나눈 것 중의 한 묶음은 ${show(v)}의 ${frac(1, c)}이다. ${show(v)} × ${frac(1, c)} = ${frac(a, `${b} × ${c}`)} = ${frac(a, b * c)}이다.`,
              facts: { calc: [[String(c), 0], [String(a), 1], [`${b}*${c}`, 2]] }
            });
          }),
          T('mul-steps', '분수의 곱셈으로 나타내어 계산하는 과정', '①36 ②29 ③33 심15', (d, n) => {
            if (n === 0) {
              // 가분수: 약분이 없다.
              const [v, c] = ifPick(d, 'plain', 9), a = v.n, b = v.d;
              return M('나눗셈을 분수의 곱셈으로 나타내어 계산하는 과정이다. ㉠, ㉡에 알맞은 수는?', labelled([c, b * c]), {
                figure: lines([eq(show(v), '/', c, '=', show(v), '*', frac(1, box(LAB[0]))), eq('=', frac(a, box(LAB[1])))]),
                explain: `${josa(c, '으로/로')} 나누는 것은 ${fj(1, c, '을/를')} 곱하는 것과 같다. ${show(v)} × ${frac(1, c)} = ${frac(a, `${b} × ${c}`)} = ${frac(a, b * c)}이다.`,
                facts: { calc: [[String(c), 0], [`${b}*${c}`, 1]] }
              });
            }
            // 진분수: 분자와 자연수를 약분한다.
            const [v, c] = d.until(() => pfPick(d, 'reduce', 15, 12), ([x, y]) => y / gcd(x.n, y) >= 2), a = v.n, b = v.d, g = gcd(a, c);
            return M(`나눗셈을 분수의 곱셈으로 나타낸 다음 분자 ${josa(a, '과/와')} 분모 ${josa(c, '을/를')} 각각 ${josa(g, '으로/로')} 나누어 약분하는 과정이다. ㉠, ㉡, ㉢에 알맞은 수는?`, labelled([a / g, c / g, b * c / g]), {
              figure: lines([eq(show(v), '/', c, '=', show(v), '*', frac(1, c)), eq('=', frac(box(LAB[0]), `${b} × ${box(LAB[1])}`), '=', frac(box(LAB[0]), box(LAB[2])))]),
              explain: `${a} ÷ ${g} = ${a / g}, ${c} ÷ ${g} = ${c / g}이므로 ${frac(a / g, `${b} × ${c / g}`)} = ${frac(a / g, b * c / g)}이다.`,
              facts: { calc: [[`${a}/${g}`, 0], [`${c}/${g}`, 1], [`${b}*${c}/${g}`, 2]] }
            });
          }, { count: 2 }),
          T('mul-pick', '나눗셈을 분수의 곱셈으로 바르게 나타낸 것 고르기', '①35 ②31 ③34', (d) => {
            // 틀린 식: 자연수를 그대로 곱한 것, 나누어지는 수의 분모와 분자를 바꾼 것 둘
            const [v, c] = d.bool() ? pfPick(d, 'plain', 11, 9) : ifPick(d, 'plain', 9), a = v.n, b = v.d;
            const rows = d.shuffle([[eq(show(v), '*', frac(1, c)), `${a}/${b}*1/${c}`, true], [eq(show(v), '*', c), `${a}/${b}*${c}`], [eq(frac(b, a), '*', frac(1, c)), `${b}/${a}*1/${c}`], [eq(frac(b, a), '*', c), `${b}/${a}*${c}`]]);
            return C(`${show(v)} ÷ ${josa(c, '을/를')} 분수의 곱셈으로 바르게 나타낸 것은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[2]), {
              explain: `나누어지는 수 ${vj(v, '은/는')} 그대로 두고, ÷ ${josa(c, '을/를')} × ${frac(1, c)}${tail(1, '으로/로')} 바꾼다. ${show(v)} ÷ ${c} = ${show(v)} × ${frac(1, c)}이다.`,
              facts: { choose: { exprs: rows.map((row) => row[1]), rule: 'equals', target: a / b * 1 / c } }
            });
          }),
          T('mul-match', '(분수)÷(자연수)와 몫 짝 짓기', '①37 ②30 ③35 심5', (d) => {
            // 두 식은 나누어지는 수가 같고, 두 식은 나누는 수가 같다.
            const m = d.until(() => { const b1 = d.int(3, 9), b2 = d.int(3, 9); return { v1: V(0, coTop(d, b1, 2), b1), v2: V(0, coTop(d, b2, 2), b2), c1: d.int(2, 7), c2: d.int(2, 7) }; }, (x) => x.c1 !== x.c2 && key(x.v1) !== key(x.v2) && distinct([quo(x.v1, x.c1), quo(x.v1, x.c2), quo(x.v2, x.c1)]) && x.v1.d * x.c2 <= 60 && x.v2.d * x.c1 <= 60);
            const rows = d.shuffle([[m.v1, m.c1], [m.v1, m.c2], [m.v2, m.c1]]), xs = rows.map(([v, c]) => qd(v, c)), ints = scaledValues(xs), pick = matchChoice(d, (j) => res(rows[j][0], rows[j][1]));
            return C('나눗셈과 몫을 알맞게 짝 지은 것은?', pick.options, pick.answer, {
              figure: tagged(rows.map(([v, c]) => div(v, c))),
              explain: rows.map(([v, c], i) => `${LAB[i]} ${told(v, c)}`).join(', ') + '이다.',
              facts: { match: { exprs: scaled(xs), options: pick.list.map((o) => o.map((j) => ints[j])) }, rule: 'matchFn' }
            });
          }),
          T('mul-verify', '나눗셈의 몫을 곱셈으로 확인하기', '②37', (d) => {
            // 몫에 나누는 수를 곱하면 나누어지는 수가 된다.
            const [v, c] = d.bool() ? pfPick(d, 'plain', 9, 7) : ifPick(d, 'plain', 7), t = v.n, r = quo(v, c), s = frac(r.p, r.q);
            const rows = d.shuffle([[eq(s, '*', c, '=', show(v)), `${r.p}*${c}*${v.d}`, t * r.q, true], [eq(s, '/', c, '=', show(v)), `${r.p}*${v.d}`, t * r.q * c], [eq(show(v), '*', c, '=', s), `${t}*${c}*${r.q}`, r.p * v.d], [eq(s, '*', show(v), '=', c), `${r.p}*${t}`, c * r.q * v.d]]);
            return C(`${show(v)} ÷ ${c} = ${s}${tail(r.p, '이/가')} 맞는지 곱셈으로 확인하려고 한다. 확인하는 식으로 알맞은 것은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[3]), {
              explain: `나눗셈의 몫에 나누는 수를 곱하면 나누어지는 수가 된다. ${s} × ${c} = ${frac(`${r.p} × ${c}`, r.q)} = ${show(v)}이다.`,
              facts: { claimed: rows.map((row) => [row[1], row[2]]), claimedWant: true }
            });
          })
        ]
      },
      {
        id: 'mixed', title: '(대분수)÷(자연수)', standard: STD,
        types: [
          T('mx-fig', '그림을 보고 (대분수)÷(자연수) 알아보기', '①38 ②38 ③41', (d) => {
            const [v, c] = d.until(() => { const b = d.int(2, 4); return [V(1, coTop(d, b), b), d.int(2, 3)]; }, ([x, y]) => gcd(top(x), y) === 1 && x.d !== y), t = top(v), b = v.d;
            return M(`정사각형 하나를 1로 볼 때, ${vj(v, '을/를')} 옅게 색칠하고 색칠한 부분을 똑같이 ${josa(c, '으로/로')} 나눈 것 중의 하나를 진하게 색칠하였다. ㉠, ㉡에 알맞은 수는?`, labelled([t, b * c]), {
              figure: mixedGrid(v, c) + lines([eq(show(v), '/', c, '=', frac(box(LAB[0]), b), '/', c), eq('=', frac(box(LAB[0]), box(LAB[1])))]),
              explain: `${show(v)} = ${frac(t, b)}이다. 정사각형 하나는 똑같이 ${b} × ${c} = ${b * c}(칸)으로 나누어지고 진하게 색칠한 칸은 ${t}칸이므로 ${show(v)} ÷ ${c} = ${frac(t, b * c)}이다.`,
              facts: { calc: [[`1*${b}+${v.n}`, 0], [`${b}*${c}`, 1]] }
            });
          }),
          T('mx-steps', '(대분수)÷(자연수)의 계산 과정', '①38·40 ②38 ③42·45', (d, n) => {
            if (n === 0) {
              // 가분수의 분자가 나누어떨어진다: 분자를 자연수로 나눈다.
              const [v, c] = d.until(() => mxPick(d, 'top'), ([x, y]) => top(x) / y >= 2), t = top(v), b = v.d;
              return M('대분수를 가분수로 나타낸 다음 분자를 자연수로 나누어 계산하는 과정이다. ㉠, ㉡에 알맞은 수는?', labelled([t, t / c]), {
                figure: lines([eq(show(v), '/', c, '=', frac(box(LAB[0]), b), '/', c), eq('=', frac(`${box(LAB[0])} ÷ ${c}`, b), '=', frac(box(LAB[1]), b))]),
                explain: `${show(v)} = ${frac(t, b)}이다. ${t} ÷ ${c} = ${t / c}이므로 ${frac(t / c, b)}이다.`,
                facts: { calc: [[`${v.w}*${b}+${v.n}`, 0], [`(${v.w}*${b}+${v.n})/${c}`, 1]] }
              });
            }
            if (n === 1) {
              // 분수의 곱셈으로 나타낸다: 약분이 없다.
              const [v, c] = mxPick(d, 'plain', 4, 9, 9), t = top(v), b = v.d;
              return M('대분수를 가분수로 나타낸 다음 분수의 곱셈으로 나타내어 계산하는 과정이다. ㉠, ㉡, ㉢에 알맞은 수는?', labelled([t, c, b * c]), {
                figure: lines([eq(show(v), '/', c, '=', frac(box(LAB[0]), b), '/', c), eq('=', frac(box(LAB[0]), b), '*', frac(1, box(LAB[1])), '=', frac(box(LAB[0]), box(LAB[2])))]),
                explain: `${show(v)} = ${frac(t, b)}이다. ${frac(t, b)} × ${frac(1, c)} = ${frac(t, `${b} × ${c}`)} = ${frac(t, b * c)}이다.`,
                facts: { calc: [[`${v.w}*${b}+${v.n}`, 0], [String(c), 1], [`${b}*${c}`, 2]] }
              });
            }
            // 크기가 같은 분수로 바꾼다: 분자가 자연수의 배수가 되는 가장 작은 수를 곱한다.
            const [v, c] = d.until(() => mxPick(d, d.bool() ? 'plain' : 'reduce', 4, 7, 8), ([x, y]) => x.d * y / gcd(top(x), y) <= 48), t = top(v), b = v.d, k = c / gcd(t, c);
            return M(`대분수를 가분수로 나타낸 다음 분모와 분자에 각각 ${josa(k, '을/를')} 곱하여 계산하는 과정이다. ㉠, ㉡에 알맞은 수는?`, labelled([t * k, t * k / c]), {
              figure: lines([eq(show(v), '/', c, '=', frac(t, b), '/', c), eq('=', frac(box(LAB[0]), b * k), '/', c, '=', frac(box(LAB[1]), b * k))]),
              explain: `${frac(t, b)}의 분모와 분자에 각각 ${josa(k, '을/를')} 곱하면 ${frac(t * k, b * k)}이다. ${t * k} ÷ ${c} = ${t * k / c}이므로 ${frac(t * k / c, b * k)}이다.`,
              facts: { calc: [[`${t}*${k}`, 0], [`${t}*${k}/${c}`, 1]] }
            });
          }, { count: 3 }),
          T('mx-two-ways', '(대분수)÷(자연수)를 두 가지 방법으로 계산하기', '①39 ②39 ③43·44', (d) => {
            const [v, c] = d.until(() => mxPick(d, 'top', 5, 9, 7), ([x, y]) => top(x) / y >= 2 && x.d * y <= 60), t = top(v), b = v.d;
            return M(`${show(v)} ÷ ${josa(c, '을/를')} 두 가지 방법으로 계산하는 과정이다. ㉠, ㉡에 알맞은 수는?`, labelled([t / c, b * c]), {
              figure: lines([eq(show(v), '/', c, '=', frac(t, b), '/', c), `<span class="mb-tag">방법 1</span>` + eq(frac(t, b), '/', c, '=', frac(`${t} ÷ ${c}`, b), '=', frac(box(LAB[0]), b)), `<span class="mb-tag">방법 2</span>` + eq(frac(t, b), '*', frac(1, c), '=', frac(t, box(LAB[1])), '=', frac(box(LAB[0]), b))]),
              explain: `분자를 자연수로 나누면 ${frac(`${t} ÷ ${c}`, b)} = ${frac(t / c, b)}이다. 분수의 곱셈으로 나타내면 ${frac(t, b)} × ${frac(1, c)} = ${frac(t, b * c)}이고, 약분하면 ${frac(t / c, b)}이다.`,
              facts: { calc: [[`${t}/${c}`, 0], [`${b}*${c}`, 1]] }
            });
          }),
          T('mx-calc', '(대분수)÷(자연수)', '①41 ②40 ③46·47 심13', (d, n) => {
            // 문항마다 계산 구조가 다르다: 가분수의 분자가 나누어떨어진다, 약분이 없다, 분자와 자연수를 약분한다, 몫이 1보다 크다, 나누는 수가 두 자리(분자가 나누어떨어진다).
            const kind = ['top', 'plain', 'reduce', 'over', 'two'][n];
            const [v, c] = kind === 'two' ? d.until(() => { const b = d.int(2, 9), c = d.int(10, 18), k = d.int(1, 4), t = c * k; return [V(Math.floor(t / b), t % b, b), c]; }, ([x]) => x.n > 0 && x.w >= 1 && x.w <= 9 && gcd(x.n, x.d) === 1 && top(x) <= 60) : mxPick(d, kind);
            return divQ(CALC, v, c, { figure: div(v, c), explain: TO_TOP + told(v, c) + '이다.', facts: { rule: 'mx-' + kind } });
          }, { count: 5 }),
          T('mx-same-forms', '(대분수)÷(자연수)와 계산 결과가 다른 식 찾기', '②42', (d) => {
            // 틀린 식: 분수 부분만 나눈 것, 자연수 부분을 빠뜨린 것 가운데 하나
            const [v, c] = mxPick(d, d.bool() ? 'plain' : 'reduce', 5, 9, 7), w = v.w, a = v.n, b = v.d, t = top(v);
            const wrong = d.bool() ? [eq(w, '+', par(frac(a, b), '/', c)), `${w}+${a}/(${b}*${c})`] : [eq(frac(a, b), '/', c), `${a}/(${b}*${c})`];
            const rows = d.shuffle([[eq(frac(t, b), '/', c), `${t}/(${b}*${c})`], [eq(frac(t, b), '*', frac(1, c)), `${t}*1/(${b}*${c})`], [ex(frac(t, `${b} × ${c}`)), `${t}/(${b}*${c})`], [wrong[0], wrong[1], true]]);
            return C(`${show(v)} ÷ ${josa(c, '과/와')} 계산 결과가 다른 것은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[2]), {
              explain: `${show(v)} = ${frac(t, b)}이므로 ${show(v)} ÷ ${c} = ${frac(t, b)} ÷ ${c} = ${frac(t, b)} × ${frac(1, c)} = ${frac(t, `${b} × ${c}`)}이다. 자연수 부분 ${josa(w, '을/를')} 그대로 두거나 빼고 분수 부분만 나누면 안 된다.`,
              facts: { choose: { exprs: rows.map((row) => row[1]), rule: 'odd' } }
            });
          }),
          T('mx-chain', '대분수를 이어서 두 번 나누기', '①32 심17', (d) => {
            // 첫 나눗셈은 가분수의 분자가 나누어떨어진다.
            const [v, c1, c2] = d.until(() => { const b = d.int(2, 9), c1 = d.int(2, 5), t = c1 * d.int(2, 9); return [V(Math.floor(t / b), t % b, b), c1, d.int(2, 6)]; }, ([x, y, z]) => x.n > 0 && x.w >= 1 && gcd(x.n, x.d) === 1 && y !== z && x.d * z <= 60), mid = toV(quo(v, c1));
            return ansQ('차례로 나누어 빈 곳에 써넣으려고 한다. ㉠에 알맞은 수는?', qdiv(qd(v, c1), c2), { figure: flow([show(v), { step: `÷ ${c1}` }, box(), { step: `÷ ${c2}` }, box(LAB[0])]), explain: `${told(v, c1)}이고, ${told(mid, c2)}이다.` });
          })
        ]
      },
      { id: 'check', title: '잘못된 계산 살펴보기', standard: STD, types: [] },
      { id: 'comp', title: '몫의 크기 비교와 조건에 맞는 수', standard: STD, types: [] },
      { id: 'word', title: '분수의 나눗셈의 활용', standard: STD, types: [] },
      { id: 'shape', title: '도형에서 분수의 나눗셈', standard: STD, types: [] }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
