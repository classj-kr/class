// 6학년 2학기 1단원 분수의 나눗셈 — 단원 틀과 기본 문항(분모가 같은 (분수)÷(분수), 분모가 다른 (분수)÷(분수), (자연수)÷(분수), 곱셈으로 나타내어 계산하기, 가분수·대분수가 있는 나눗셈).
// 수집해 둔 교과서 9종의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1~3: 67·83·63꼴, 심화꼴 59꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/6-2-1/싣기_대조표.md 에 있다.
// (잘못된 계산, 몫의 크기 비교, 조건에 맞는 수의 나눗셈, □가 있는 식, 문장제는 6-2-1b.js 에, 실력 문항은 6-2-1c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2, ③n = 기본꼴_3, 심n = 심화꼴.
// 영역은 수와 연산, 성취기준은 6수01-11(분수의 나눗셈의 계산 원리를 탐구하고 그 계산을 할 수 있다) 하나이다. (분수)÷(자연수)는 6학년 1학기에 배웠고,
// 이 단원은 분모가 같은 (분수)÷(분수), 분모가 다른 (분수)÷(분수), (자연수)÷(분수), 곱셈으로 나타내어 계산하기, 가분수·대분수가 있는 나눗셈을 배운다.
//
// 싣는 기준
//  - 분수의 나눗셈만 싣는다. 하는 일이 다르면 다른 문제다: 주는 것(띠·수직선·식·문장·표), 묻는 것(과정의 빈칸, 값, 고르기), 나타내는 방법(그림, 통분하여, 곱셈으로 바꾸어),
//    계산 구조가 다르면 따로 싣고 계산 문항에는 facts.rule 에 그 이름을 단다(이름대로 되게 수를 뽑는다): 분모가 같다·다르다(한 분모가 다른 분모의 배수, 서로소),
//    분자끼리 나누어떨어진다·떨어지지 않는다, 몫이 자연수·진분수·대분수, 단위분수로 나눈다, 자연수가 분자의 배수이다·아니다, 약분이 없다·한 번·엇갈려 두 번,
//    진분수·가분수·대분수·자연수의 갈래.
//  - 교육과정: 「분수의 곱셈과 나눗셈은 계산 원리를 탐구하여 이해하는 수준에서 다룬다.」 「지나치게 복잡한 혼합 계산은 다루지 않는다.」 계산 문항의 분모는 24 이하,
//    가분수로 고친 분자는 30 이하, 몫의 분모는 60 이하(대분수가 있는 나눗셈은 30 이하)에서 뽑는다. 나눗셈·곱셈이 세 번 넘게 이어지는 식은 싣지 않는다.
//  - 교육과정: 「기약분수로 나타낼 것을 요구하지 않을 경우, 계산 결과를 기약분수가 아닌 분수로 나타내는 것도 허용한다.」 분수 하나를 답하는 문항은 크기가 같은 분수를
//    모두 맞게 친다(anyForm). 수집본에서 「기약분수로」를 요구한 문제는 여섯 곳뿐이고(②7·15·17·76 심31·50) 교사용 문서는 「기약분수나 대분수로 나타내지 않아도 정답」이라고
//    적었으므로 기약분수를 요구하는 문항은 두지 않았다. 적어 두는 답은 언제나 기약분수이고 대분수의 분수 부분은 진분수이다.
//    몫이 자연수로 떨어지는 문항은 수 하나로 답한다(분수 칸으로 내지 않는다). 유형마다 답의 꼴(분수·자연수)은 정해져 있다.
//  - 계산 과정의 빈칸을 묻는 문항은 공통분모나 마지막 분모를 틀이 정해 주어 답이 하나가 되게 하였다(두 분모의 곱으로 통분, 약분한 뒤의 분모).
//  - 숫자만 다르거나 상황만 다른 것은 한 번만 싣는다(빈 곳에 몫 써넣기, 화살표 상자, 가로·세로로 나누는 표, 식과 식 잇기는 계산 문항·곱셈식 고르기와 같은 문제).
//  - 꼴 목록에 적힌 원문 답지의 잘못(③60, 심24·31의 어긋난 답)은 따르지 않는다. 답은 모두 코드가 셈한다.
//
// 뺀 것과 까닭(6-2-1b.js, 6-2-1c.js 의 것까지 여기에 모아 적는다)
//  - 방정식 꼴: 모르는 수 둘을 차례로 거꾸로 푸는 식(①52, 심23의 변형), 남은 것의 몇 분의 몇을 또 쓴 뒤의 처음 양(심47), 두 번 튀어 오른 공의 처음 높이(심48).
//    거꾸로 한 번만 푸는 것(□ × (분수) = (분수), (수) ÷ □ = (수), 어떤 수를 한 번 구해 바르게 계산하기, 한쪽을 먼저 계산하는 □)은 실었다.
//  - 비례·빠르기: 같은 빠르기로 다른 시간 동안 가는 거리(③48), 빠르기를 구해 다시 시간을 곱하는 네 단계(심50의 변형), 양초가 다 타는 시간(심52의 변형),
//    낮과 밤의 길이(②75 — 합이 24시간임을 써서 가르는 비례배분).
//  - 넓이·둘레 셈이 여러 단계인 것: 삼각형·마름모의 넓이 공식을 거꾸로 풀기(①63 ②78 심56), 넓이가 같은 다른 도형으로 잇기·둘레(②79 심55), 둘레가 같은 두 정다각형(심58).
//    넓이가 주어진 직사각형·평행사변형의 한 변(나눗셈 한 번), 넓이를 구한 다음 한 번 나누기, 둘레를 한 변으로 나누어 정다각형의 이름 알기는 실었다.
//  - 간격·자르는 횟수(①66 ②63 심59 — 간격 수에 1을 더하고 빼는 일이 어려움의 대부분이다).
//  - 약속한 기호와 순서도(②54·55 ③61 심15 — 새 기호에 수를 넣는 일과 혼합 계산이 대부분이고 ②55는 나눗셈이 여섯 번이다).
//  - 조건 풀이·경우 따지기가 어려움의 대부분인 것: 조건 여럿에 맞는 나눗셈식 쓰기(①53 ②53 ③13 심27 — 식을 쓰는 열린 답이기도 하다), 기약분수 조건이 붙은 □(②48),
//    몫이 자연수가 되는 □를 모두 찾기·개수(①51 ②44 ③56 심26 — 약수 찾기 5-1-2. 보기에서 하나 고르기는 실었다), □가 나누는 수의 분자인 부등식(①50의 변형),
//    수 카드 넉 장으로 진분수 둘을 만들어 견주기·몫이 자연수가 되는 식 찾기·조건에 맞는 식을 「모두」 만들기(①54 ③60 심30의 변형).
//  - 뜻 없는 셈: 두 몫을 따로 구해 다시 더하고 빼고 나누기(①45 ②39·40 심12 — 이어 나누기 한 가지만 실었다), 두 번 덜어 낸 횟수의 합·차(심35),
//    과정의 빈칸에 들어갈 수끼리 더하고 빼기(②9·19 ③40 심6·7의 변형 — 빈칸을 그대로 물었다).
//  - 다른 단원·다른 지식: 소수의 덧셈이 먼저인 것(②68의 변형 — 6-2-3), 앞 학년·앞 학기 준비 학습(③63 — (분수)÷(자연수) 6-1, 통분 5-1, 분수의 곱셈 5-2).
//  - 서술형·작도·열린 답: 계산 방법을 글로 설명하기(③22), 두 가지 방법을 다 쓰기(①27 ②22 심8의 쓰는 부분), 까닭 쓰기(①12·26·35 ②31 ③6·53 심9의 쓰는 부분),
//    문제 만들기·말하기(①67 ②83 ③62), 색칠하기(②1·38의 변형). 과정의 빈칸, 까닭 고르기, 잘못 말한 사람 찾기, 처음 틀린 곳 찾기, 바른 값 구하기,
//    식에 맞는 상황 고르기로 바꾸어 실었다.
//  - 같은 문제여서 한 번만 실은 것: 빈 곳에 몫 써넣기·화살표 상자·표(①43 심11, ②3·③3·10의 변형 — 계산 문항과 같다), 나눗셈식과 곱셈식·자연수의 나눗셈 잇기(①4·24 ②20 ③4·41의 변형
//    — 식 고르기와 같다), 답 고르기(①31 ②7의 변형), 어떤 수를 구한 뒤 다른 수로 나누기·다른 수로 잘못 나눈 것(②81·82 심33의 변형 — 나누어야 할 것을 곱한 계산 고치기와 같다),
//    1 kg의 값이 더 싼 것·들이가 더 큰 통(③39 ①60의 변형 — 1시간 동안 걷는 거리 견주기와 같다), 단위를 t에서 kg으로 바꾼 뒤 나누기(①61의 변형 — 분을 시간으로 고쳐 나누기와 같다),
//    한 번 튀어 오른 공의 처음 높이(③44의 변형 — 부분으로 전체 구하기와 같다), 음표의 박자 수·액자의 가로와 세로(①56 ③46의 변형 — 몇 배와 같다).
//  - 그림이 필요해 미룬 것은 없다. 띠·수직선 그림은 단원 파일의 그림 함수로 그렸고, 변의 길이가 적힌 도형(③54 심55의 그림)은 수를 글에 적어 실었다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, box, frac, mixed, lines, N, M, C, F } = B.kit;
  const STD = '6수01-11';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const LAB = ['㉠', '㉡', '㉢', '㉣'], THREE = LAB.slice(0, 3);
  const labelled = (answers) => answers.map((answer, i) => ({ label: LAB[i], answer }));
  const gcd = (x, y) => (y ? gcd(y, x % y) : x), lcm = (x, y) => x / gcd(x, y) * y;
  // 토씨: 분수와 대분수는 분자를 마지막에 읽는다(5분의 3, 2와 5분의 3).
  const tail = (n, pair) => josa(n, pair).slice(String(n).length);
  const SG = { '+': '+', '-': '−', '*': '×', '/': '÷', '=': '=', '>': '&gt;', '<': '&lt;' };
  const ex = (html) => '<span class="mb-expr">' + html + '</span>';
  // 식 한 줄: 조각을 이어 적는다. '+', '-', '*', '/', '=' 은 기호로 바꾼다.
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
  const key = (v) => v.w + ' ' + v.n + '/' + v.d;
  const R = (p, q) => { const g = gcd(p, q) || 1; return { p: p / g, q: q / g }; };
  // 몫(기약분수 p/q)
  const div = (a, b) => R(top(a) * b.d, a.d * top(b));
  const toV = (r) => (r.q === 1 ? nat(r.p) : V(Math.floor(r.p / r.q), r.p % r.q, r.q));
  // 가분수 꼴로 적은 글(자연수는 그대로)
  const bare = (v) => (v.n ? frac(top(v), v.d) : String(v.w));

  // ── 검사가 다시 셈하는 식 ──
  // 식의 값을 (분자 식)/(분모 식)으로 적는다. 문제에 적힌 수로만 적는다(대분수 2 3/7 은 (2*7+3)).
  const imp = (v) => (v.n === 0 ? String(v.w) : v.w ? `(${v.w}*${v.d}+${v.n})` : String(v.n));
  const q = (v) => ({ num: imp(v), dens: v.n ? [String(v.d)] : [], P: top(v), D: v.d });
  const qdiv = (x, y) => ({ num: [x.num].concat(y.dens).join('*'), dens: x.dens.concat([y.num]), P: x.P * y.D, D: x.D * y.P });
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
  const ans = (text, a, b, o) => ansQ(text, qdiv(q(a), q(b)), o);

  // ── 풀이 글 ──
  const chainOf = (out) => out.filter((s, i) => i === 0 || s !== out[i - 1]).join(' = ');
  // 분자끼리의 나눗셈 x ÷ y 의 끝: 자연수이거나, 분수(약분한 꼴, 대분수)이다.
  function tailOf(x, y) {
    const r = R(x, y), out = [`${x} ÷ ${y}`];
    if (r.q === 1) out.push(String(r.p));
    else { out.push(frac(x, y)); if (r.p !== x) out.push(frac(r.p, r.q)); if (r.p > r.q) out.push(show(toV(r))); }
    return out;
  }
  // 분모가 같은 나눗셈: 분자끼리 나눈다.
  const toldSame = (a, b) => chainOf([`${show(a)} ÷ ${show(b)}`, `${bare(a)} ÷ ${bare(b)}`].concat(tailOf(top(a), top(b))));
  // 통분하여 분자끼리 나눈다(자연수는 분모가 같은 분수로 나타낸다).
  function toldCommon(a, b) {
    const L = lcm(a.d, b.d), x = top(a) * (L / a.d), y = top(b) * (L / b.d);
    return chainOf([`${show(a)} ÷ ${show(b)}`, `${bare(a)} ÷ ${bare(b)}`, `${frac(x, L)} ÷ ${frac(y, L)}`].concat(tailOf(x, y)));
  }
  // 분자들과 분모들을 엇갈려 약분한다.
  function cancel(tops, dens) {
    const ns = tops.slice(), ds = dens.slice();
    for (let i = 0; i < ns.length; i += 1) for (let j = 0; j < ds.length; j += 1) { const g = gcd(ns[i], ds[j]); ns[i] /= g; ds[j] /= g; }
    return [ns, ds];
  }
  const product = (list) => { const keep = list.filter((x) => x !== 1); return keep.length ? keep.join(' × ') : '1'; };
  // 나누는 수의 분모와 분자를 바꾼 수
  const flipped = (b) => (top(b) === 1 ? String(b.d) : frac(b.d, top(b)));
  // 곱셈으로 나타내어 계산하는 차례: 처음 식, (대분수가 있으면) 가분수로 고친 식, 곱셈식, 약분한 식, 결과, 대분수.
  function told(a, b) {
    const out = [`${show(a)} ÷ ${show(b)}`, `${bare(a)} ÷ ${bare(b)}`, `${bare(a)} × ${flipped(b)}`], ns = [top(a), b.d], ds = [a.d, top(b)], [n2, d2] = cancel(ns, ds), r = div(a, b);
    if (n2.join() !== ns.join() && r.q !== 1) out.push(frac(product(n2), product(d2)));
    if (n2.join() !== ns.join() && r.q === 1 && n2.filter((x) => x !== 1).length > 1) out.push(product(n2));
    out.push(r.q === 1 ? String(r.p) : frac(r.p, r.q));
    if (r.q !== 1 && r.p > r.q) out.push(show(toV(r)));
    return chainOf(out);
  }

  // ── 수 고르기 ──
  const coTop = (d, den, lo, hi) => d.until(() => d.int(lo || 1, hi || den - 1), (v) => gcd(v, den) === 1);
  const proper = (d, lo, hi, minTop) => { const den = d.int(lo, hi); return V(0, coTop(d, den, den > 2 ? minTop : 1), den); };
  // 분모가 같은 두 진분수 a ÷ b. kind: 'nat' 분자끼리 나누어떨어진다, 'unit' 단위분수로 나눈다, 'over' 몫이 대분수(약분 없음), 'under' 몫이 진분수, 'cut' 분자끼리의 몫을 약분한다.
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
  // 분모가 같은 (가분수)÷(진분수). whole: 몫이 자연수인가.
  function sameImproper(d, whole) {
    return d.until(() => { const den = d.int(4, 13), y = coTop(d, den, 2); return [V(0, whole ? y * d.int(2, 5) : den + d.int(1, 2 * den - 1), den), V(0, y, den)]; },
      ([a, b]) => a.n > a.d && a.n < 3 * a.d && gcd(a.n, a.d) === 1 && (a.n % b.n === 0) === whole);
  }
  // 몫이 자연수 m 인 분모가 다른 두 진분수 a ÷ b: 나누는 수와 몫을 먼저 정한다. unit 이면 단위분수로 나눈다.
  function diffNat(d, unit) {
    return d.until(() => { const e = d.int(4, 24), c = unit ? 1 : coTop(d, e, 2), m = d.int(2, 6), r = R(c * m, e); return [V(0, r.p, r.q), V(0, c, e), m]; }, ([a, b]) => a.n < a.d && a.n >= 2 && a.d !== b.d);
  }
  // 분모가 다른 두 진분수 a ÷ b(몫은 자연수가 아니다). rel: 'multiple' 한 분모가 다른 분모의 배수, 'coprime' 두 분모가 서로소. over: 몫이 1보다 큰가(따지지 않으면 null).
  function diffPick(d, rel, over, more) {
    return d.until(() => [proper(d, 2, 12), proper(d, 2, 12)], ([a, b]) => {
      const r = div(a, b), g = gcd(a.d, b.d), multiple = a.d !== b.d && (a.d % b.d === 0 || b.d % a.d === 0);
      return a.d !== b.d && (rel === 'multiple' ? multiple : g === 1) && (over == null || (r.p > r.q) === over) && r.q > 1 && r.q <= 60 && r.p <= 99 && (!more || more(a, b));
    });
  }
  // (자연수)÷(진분수) c ÷ f. kind: 'whole' 자연수가 분자의 배수(몫이 자연수), 'plain' 자연수와 분자가 서로소, 'cut' 자연수와 분자를 약분한다(몫은 분수).
  function natPick(d, kind, cMax) {
    return d.until(() => { const e = d.int(3, 12), n = coTop(d, e, 2); return [nat(kind === 'whole' ? n * d.int(2, 6) : d.int(2, cMax || 12)), V(0, n, e)]; }, ([c, f]) => {
      const g = gcd(c.w, f.n), r = div(c, f);
      if (c.w > 30 || r.p > 150 || c.w === f.d) return false;
      return kind === 'whole' ? r.p <= 99 : kind === 'plain' ? g === 1 : g > 1 && c.w % f.n !== 0;
    });
  }
  // 분모가 다른 두 진분수 a ÷ b 를 곱셈으로 고쳤을 때 약분하는 횟수가 cuts(0·1·2)인 것. over: 몫이 1보다 큰가(따지지 않으면 null).
  function mulPick(d, cuts, over, hi) {
    return d.until(() => [proper(d, 3, hi || 12, 2), proper(d, 3, hi || 12, 2)], ([a, b]) => {
      const r = div(a, b), k = (gcd(a.n, b.n) > 1 ? 1 : 0) + (gcd(a.d, b.d) > 1 ? 1 : 0);
      return a.d !== b.d && k === cuts && (over == null || (r.p > r.q) === over) && r.q > 1 && r.q <= 60 && r.p <= 99;
    });
  }
  // 수의 갈래: 'N' 자연수, 'P' 진분수, 'I' 가분수, 'M' 대분수
  const one = (d, kind) => {
    if (kind === 'N') return nat(d.int(2, 15));
    const den = d.int(2, kind === 'P' ? 12 : 9), n = coTop(d, den, kind === 'P' && den > 2 ? 2 : 1);
    return kind === 'M' ? V(d.int(1, 5), n, den) : kind === 'I' ? V(0, den * d.int(1, 2) + n, den) : V(0, n, den);
  };
  // 갈래가 shape(예: 'MP' = (대분수)÷(진분수))인 두 수 a ÷ b. o: whole 몫이 자연수인가, under 몫이 1보다 작은가(따지지 않으면 null), same 분모가 같은가(적지 않으면 다른 것만, 따지지 않으면 null).
  // 계산 원리를 이해하는 수준: 가분수로 고친 분자는 30 이하, 몫의 분모는 30 이하, 분자는 120 이하에서 뽑는다.
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

  // ── 그림 ──
  const svg = (cls, w, h, label, body) => `<svg class="${cls}" style="vertical-align:middle" viewBox="0 0 ${w} ${h}" width="${Math.round(w)}" role="img" aria-label="${label}">${body}</svg>`;
  // 띠 한 줄(왼쪽 위 x, y / 너비 width): 똑같이 parts 칸으로 나누어 앞의 on 칸을 색칠하고, fine 이 parts 보다 크면 점선으로 다시 똑같이 fine 칸으로 나눈다.
  function bandAt(x, y, width, parts, on, fine) {
    const pw = width / parts; let out = '';
    for (let i = 0; i < parts; i += 1) out += `<rect class="mb-piece${i < on ? ' is-on' : ''}" x="${(x + i * pw).toFixed(2)}" y="${y}" width="${pw.toFixed(2)}" height="24"/>`;
    if (fine && fine > parts) for (let i = 1; i < fine; i += 1) if ((i * parts) % fine !== 0) out += `<line x1="${(x + i * width / fine).toFixed(2)}" y1="${y}" x2="${(x + i * width / fine).toFixed(2)}" y2="${y + 24}" style="stroke:#1f2933;stroke-width:0.9;stroke-dasharray:3 2.4"/>`;
    return out;
  }
  // 띠를 똑같이 den 칸으로 나누어 on 칸을 색칠하고, 색칠한 부분을 앞에서부터 size 칸씩 묶어 띠 아래에 표시한다. rest 이면 묶고 남은 칸을 점선으로 표시한다.
  function takeBand(den, on, size, rest) {
    const W = 216, cw = W / den, groups = Math.floor(on / size), y = 30, left = on % size;
    let out = bandAt(2, 2, W, den, on);
    for (let g = 0; g < groups; g += 1) out += `<path d="M${(4 + g * size * cw).toFixed(1)} ${y}v7H${((g + 1) * size * cw).toFixed(1)}v-7" style="fill:none;stroke:#1d4ed8;stroke-width:1.6"/>`;
    if (rest && left) out += `<path d="M${(4 + groups * size * cw).toFixed(1)} ${y}v7H${(on * cw).toFixed(1)}v-7" style="fill:none;stroke:#c2410c;stroke-width:1.6;stroke-dasharray:3 2"/>`;
    return svg('mb-pieces', W + 4, 40, `띠를 똑같이 ${den}칸으로 나누어 ${on}칸을 색칠하고, 색칠한 부분을 앞에서부터 ${size}칸씩 묶어 표시` + (rest && left ? '. 묶고 남은 칸은 점선으로 표시' : ''), out);
  }
  // 길이가 같은 띠 여러 줄. rows: { tag 이름, parts 나눈 칸 수, on 색칠한 칸 수, fine 점선으로 다시 나눈 칸 수 }
  function twinBands(rows) {
    const W = 216, x0 = 26; let out = '';
    rows.forEach((r, i) => { const y = 2 + i * 36; out += `<text class="mb-km-label" style="font-size:14px" x="11" y="${y + 17}" text-anchor="middle">${r.tag}</text>` + bandAt(x0, y, W, r.parts, r.on, r.fine); });
    return svg('mb-pieces', x0 + W + 4, rows.length * 36 - 8, `길이가 같은 띠 ${rows.length}개: ` + rows.map((r) => `${r.tag}는 똑같이 ${r.parts}칸으로 나누어 ${r.on}칸을 색칠` + (r.fine ? `하고 점선으로 다시 똑같이 ${r.fine}칸으로 나눔` : '')).join(', '), out);
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
  // 0부터 1까지의 수직선(똑같이 parts 칸)에 두 점 ㉠(at1 칸), ㉡(at2 칸)을 화살표로 나타낸다.
  function twoPointLine(parts, at1, at2) {
    const u = Math.min(24, 252 / parts), x = (i) => 18 + i * u, y = 40, width = 36 + parts * u;
    let out = `<line class="mb-axis" x1="${x(0)}" y1="${y}" x2="${x(parts).toFixed(1)}" y2="${y}"/>`;
    for (let i = 0; i <= parts; i += 1) out += `<line class="mb-axis" x1="${x(i).toFixed(1)}" y1="${y - (i % parts === 0 ? 6 : 3.5)}" x2="${x(i).toFixed(1)}" y2="${y + (i % parts === 0 ? 6 : 3.5)}"/>`;
    out += `<text class="mb-km-label" x="${x(0)}" y="${y + 20}" text-anchor="middle">0</text><text class="mb-km-label" x="${x(parts).toFixed(1)}" y="${y + 20}" text-anchor="middle">1</text>`;
    [[at1, LAB[0]], [at2, LAB[1]]].forEach(([at, label]) => { out += `<path class="mb-pointer" d="M${x(at).toFixed(1)} ${y - 7}l-4.5 -9h9z"/><text class="mb-km-label" style="font-size:14px" x="${x(at).toFixed(1)}" y="${y - 21}" text-anchor="middle">${label}</text>`; });
    return svg('mb-numberline', Number(width.toFixed(1)), 66, `수직선: 0부터 1까지를 똑같이 ${parts}칸으로 나누었다. ㉠은 0에서 작은 눈금 ${at1}칸 간 곳, ㉡은 0에서 작은 눈금 ${at2}칸 간 곳`, out);
  }
  // 차례로 계산하는 칸. 조각은 칸에 적는 글이거나 { step: 화살표 위에 적는 글 }이다(kit.chain 은 분수 글의 '-' 를 바꾸어 쓸 수 없다).
  const flow = (parts) => '<div class="mb-chain">' + parts.map((part) => (part.step ? `<span class="mb-step">${part.step}</span>` : `<span class="mb-node">${part}</span>`)).join('') + '</div>';

  const CALC = '다음을 계산하시오.';
  const SAME = '분모가 같은 분수의 나눗셈은 분자끼리 나누어 계산한다. ', COMMON = '통분하여 분모를 같게 한 다음 분자끼리 나눈다. ', FLIP = '나누는 수의 분모와 분자를 바꾸어 곱한다. ', TO_TOP = '대분수를 가분수로 나타낸 다음 나누는 수의 분모와 분자를 바꾸어 곱한다. ';
  // 계산 문항: 식 하나를 보이고 값을 답한다. 같은 꼴의 식이 여럿이므로 계산 구조의 이름(rule)을 단다.
  const calc = (a, b, o) => ans(CALC, a, b, { kind: o.kind, figure: eq(show(a), '/', show(b)), explain: o.explain, facts: { rule: o.rule } });
  // 몫과 나머지를 다시 셈하는 식(대분수의 자연수 부분과 분자)
  const quot = (num, den) => `(${num}-${num}%${den})/${den}`, rest = (num, den) => `${num}%${den}`;

  B.addUnit({
    id: '6-2-1', grade: 6, semester: 2, no: 1, title: '분수의 나눗셈', version: 1,
    groups: [
      {
        id: 'same', title: '분모가 같은 (분수)÷(분수)', standard: STD,
        types: [
          T('same-fig-take', '그림을 보고 덜어 내는 횟수 알아보기', '①2 ②1 ③1 심1', (d) => {
            const [a, b] = samePick(d, 'nat', 5, 12), k = a.n / b.n;
            return N(`띠에 ${show(a)}만큼 색칠하고, 색칠한 부분을 ${show(b)}씩 묶었다. ${show(a)}에서 ${vj(b, '을/를')} 몇 번 덜어 낼 수 있는가?`, k, {
              unit: '번', figure: takeBand(a.d, a.n, b.n),
              explain: `색칠한 ${a.n}칸을 ${b.n}칸씩 묶으면 ${k}묶음이다. ${show(a)}에서 ${vj(b, '을/를')} ${k}번 덜어 낼 수 있으므로 ${show(a)} ÷ ${show(b)} = ${k}이다.`,
              facts: { calc: [[`${a.n}/${b.n}`, 0]] }
            });
          }),
          T('same-line-expr', '수직선을 보고 나눗셈식 완성하기', '①8 ②1 ③1 심1', (d) => {
            const [a, b] = samePick(d, 'nat', 5, 11), k = a.n / b.n, den = a.d;
            return M(`수직선에서 0부터 ${frac(LAB[0], den)}까지를 ${frac(LAB[1], den)}씩 뛰어 세었다. 그림에 알맞은 나눗셈식이 되도록 할 때, ㉠, ㉡, ㉢에 알맞은 수는?`, labelled([a.n, b.n, k]), {
              figure: hopLine(1, den, b.n, k) + eq(frac(box(LAB[0]), den), '/', frac(box(LAB[1]), den), '=', box(LAB[2])),
              explain: `작은 눈금 한 칸은 ${frac(1, den)}이다. 0부터 ${show(a)}까지를 ${show(b)}씩 ${k}번 뛰어 세었으므로 ${show(a)} ÷ ${show(b)} = ${k}이다.`,
              facts: { calc: [[`${b.n}*${k}`, 0], [String(b.n), 1], [String(k), 2]] }
            });
          }),
          T('same-unit-count', '단위분수의 개수로 분모가 같은 나눗셈 알아보기', '①1 ②2 ③2 심1', (d) => {
            const [a, b] = samePick(d, 'nat'), k = a.n / b.n, u = frac(1, a.d);
            return M(`${vj(a, '은/는')} ${u}이 ㉠개, ${vj(b, '은/는')} ${u}이 ㉡개인 수이다. ㉠, ㉡, ㉢에 알맞은 수는?`, labelled([a.n, b.n, k]), {
              figure: lines([eq(show(a), '/', show(b), '=', box(LAB[0]), '/', box(LAB[1]), '=', box(LAB[2]))]),
              explain: `${show(a)}에는 ${u}이 ${a.n}개, ${show(b)}에는 ${u}이 ${b.n}개 있다. ${a.n}개를 ${b.n}개씩 묶으면 ${k}묶음이므로 ${show(a)} ÷ ${show(b)} = ${a.n} ÷ ${b.n} = ${k}이다.`,
              facts: { calc: [[String(a.n), 0], [String(b.n), 1], [`${a.n}/${b.n}`, 2]] }
            });
          }),
          T('same-calc-nat', '분모가 같은 (분수)÷(분수): 몫이 자연수', '①3 ②3 ③3 심1', (d, n) => {
            // 문항마다 계산 구조가 다르다: 진분수끼리, 단위분수로 나누기, (가분수)÷(진분수).
            const [a, b] = n === 0 ? d.until(() => samePick(d, 'nat'), ([x, y]) => x.n >= 3 * y.n) : n === 1 ? samePick(d, 'unit', 4, 15) : sameImproper(d, true);
            return calc(a, b, { kind: 'nat', explain: SAME + toldSame(a, b) + '이다.', rule: ['same-nat', 'same-unit', 'same-improper-nat'][n] });
          }, { count: 3 }),
          T('same-fig-rest', '그림을 보고 묶고 남는 부분으로 몫 알아보기', '①6 ②4 ③8', (d) => {
            const [a, b] = d.until(() => samePick(d, 'over', 6, 12), ([x, y]) => x.n >= 2 * y.n), k = Math.floor(a.n / b.n), r = a.n % b.n;
            return M(`띠에 ${show(a)}만큼 색칠하고, 색칠한 부분을 ${show(b)}씩 묶었다. ㉠묶음이 되고, 남은 부분은 한 묶음의 ${frac(LAB[1], b.n)}이다. ㉠, ㉡에 알맞은 수는?`, labelled([k, r]), {
              figure: takeBand(a.d, a.n, b.n, true) + eq(show(a), '/', show(b), '=', mixed(box(LAB[0]), box(LAB[1]), b.n)),
              explain: `색칠한 ${a.n}칸을 ${b.n}칸씩 묶으면 ${k}묶음이 되고 ${r}칸이 남는다. 남은 ${r}칸은 한 묶음(${b.n}칸)의 ${frac(r, b.n)}이므로 ${show(a)} ÷ ${show(b)} = ${mixed(k, r, b.n)}이다.`,
              facts: { calc: [[quot(a.n, b.n), 0], [rest(a.n, b.n), 1]] }
            });
          }),
          T('same-steps', '분자끼리의 나눗셈으로 바꾸어 몫을 분수로 나타내는 과정', '①5 ②5 ③9 심2', (d, n) => {
            // 첫째 문항은 몫이 대분수, 둘째 문항은 작은 수를 큰 수로 나누어 몫이 진분수.
            if (n === 0) {
              const [a, b] = samePick(d, 'over'), x = a.n, y = b.n;
              return M('분자끼리의 나눗셈으로 바꾸어 계산하는 과정이다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?', labelled([x, y, Math.floor(x / y), x % y]), {
                figure: lines([eq(show(a), '/', show(b), '=', box(LAB[0]), '/', box(LAB[1])), eq('=', frac(box(LAB[0]), box(LAB[1])), '=', mixed(box(LAB[2]), box(LAB[3]), box(LAB[1])))]),
                explain: `${SAME}${toldSame(a, b)}이다.`,
                facts: { calc: [[String(x), 0], [String(y), 1], [quot(x, y), 2], [rest(x, y), 3]] }
              });
            }
            const [a, b] = samePick(d, 'under'), x = a.n, y = b.n;
            return M('분자끼리의 나눗셈의 몫을 분수로 나타내는 과정이다. ㉠, ㉡에 알맞은 수는?', labelled([x, y]), {
              figure: lines([eq(show(a), '/', show(b), '=', x, '/', y, '=', frac(box(LAB[0]), box(LAB[1])))]),
              explain: `${x} ÷ ${y}의 몫은 나누어지는 수 ${josa(x, '을/를')} 분자로, 나누는 수 ${josa(y, '을/를')} 분모로 하는 분수이다. ${toldSame(a, b)}이다.`,
              facts: { calc: [[String(x), 0], [String(y), 1]] }
            });
          }, { count: 2 }),
          T('same-calc-frac', '분모가 같은 (분수)÷(분수): 몫이 분수', '①7 ②6·7 ③10 심2', (d, n) => {
            // 문항마다 계산 구조가 다르다: 몫이 대분수, 몫이 진분수, 분자끼리의 몫을 약분, (가분수)÷(진분수).
            const [a, b] = n === 3 ? sameImproper(d, false) : samePick(d, ['over', 'under', 'cut'][n]);
            return calc(a, b, { explain: SAME + toldSame(a, b) + '이다.', rule: ['same-over', 'same-under', 'same-cut', 'same-improper'][n] });
          }, { count: 4 }),
          T('same-same-form', '분모가 같은 나눗셈과 계산 결과가 같은 식 찾기', '①4 ②2 ③4 심1', (d) => {
            // 틀린 식: 나누는 차례를 바꾼 것, 분자끼리 곱한 것, 분자를 분모로 나눈 것
            const [a, b] = samePick(d, d.bool() ? 'over' : 'under'), x = a.n, y = b.n, den = a.d;
            const rows = d.shuffle([[eq(x, '/', y), `${x}/${y}`, true], [eq(y, '/', x), `${y}/${x}`], [eq(x, '*', y), `${x}*${y}`], [eq(x, '/', den), `${x}/${den}`]]);
            return C(`${show(a)} ÷ ${vj(b, '과/와')} 계산 결과가 같은 것은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[2]), {
              explain: `${show(a)}에는 ${frac(1, den)}이 ${x}개, ${show(b)}에는 ${frac(1, den)}이 ${y}개 있으므로 ${x} ÷ ${y}로 계산한다. ${toldSame(a, b)}이다.`,
              facts: { choose: { exprs: rows.map((row) => row[1]), rule: 'equals', target: x / y } }
            });
          }),
          T('same-odd', '몫이 나머지와 다른 나눗셈 찾기', '①9 ③5 심18', (d) => {
            // 두 식은 분자끼리의 나눗셈을 약분하면 몫이 같고(분모는 서로 다르다) 한 식만 다르다.
            const PRIMES = [7, 11, 13, 17, 19, 23, 29];
            const m = d.until(() => {
              const p = d.int(2, 9), s = d.int(2, 9), [m1, m2] = d.shuffle([1, 2, 3]).slice(0, 2), p2 = d.int(2, 9), s2 = d.int(2, 9), m3 = d.int(1, 3), dens = d.shuffle(PRIMES).slice(0, 3);
              return { p, s, p2, s2, rows: [[p * m1, s * m1, dens[0]], [p * m2, s * m2, dens[1]], [p2 * m3, s2 * m3, dens[2]]] };
            }, (v) => gcd(v.p, v.s) === 1 && gcd(v.p2, v.s2) === 1 && v.p * v.s2 !== v.s * v.p2 && v.rows.every(([x, y, den]) => x < den && y < den) && Math.abs(v.p * v.s2 - v.s * v.p2) <= 2 * v.s * v.s2);
            const order = d.shuffle([0, 1, 2]), rows = order.map((i) => m.rows[i]), hit = order.indexOf(2);
            return C('몫이 나머지와 다른 하나는?', THREE, hit, {
              figure: tagged(rows.map(([x, y, den]) => eq(frac(x, den), '/', frac(y, den)))),
              explain: `분모가 같으므로 분자끼리 나눈다. ${rows.map(([x, y], i) => `${LAB[i]} ${tailOf(x, y).join(' = ')}`).join(', ')}이다. ${LAB[hit]}만 다르다.`,
              facts: { choose: { exprs: rows.map(([x, y]) => `${x}/${y}`), rule: 'odd' } }
            });
          }),
          T('same-line-two', '수직선에 나타낸 두 분수의 나눗셈', '심14 ②1', (d) => {
            const [a, b] = samePick(d, 'over', 6, 12), den = a.d;
            return ans('수직선에서 ㉡이 나타내는 수를 ㉠이 나타내는 수로 나눈 몫은?', a, b, {
              figure: twoPointLine(den, b.n, a.n),
              explain: `작은 눈금 한 칸은 ${frac(1, den)}이므로 ㉠은 ${show(b)}, ㉡은 ${show(a)}이다. ${toldSame(a, b)}이다.`
            });
          })
        ]
      },
      {
        id: 'diff', title: '분모가 다른 (분수)÷(분수)', standard: STD,
        types: [
          T('diff-fig', '그림을 보고 분모가 다른 (분수)÷(단위분수) 알아보기', '②8 ③15', (d) => {
            const [b, k] = d.until(() => [d.int(2, 5), d.int(2, 4)], ([x, y]) => x * y <= 12), a = coTop(d, b, b > 2 ? 2 : 1), e = b * k;
            return N(`길이가 같은 두 띠 가, 나에 각각 ${frac(a, b)}, ${frac(1, e)}만큼 색칠하였다. 그림을 보고 구한 ${frac(a, b)} ÷ ${frac(1, e)}의 몫은?`, a * k, {
              figure: twinBands([{ tag: '가', parts: b, on: a, fine: e }, { tag: '나', parts: e, on: 1 }]),
              explain: `가의 한 칸은 나의 ${k}칸과 같으므로 ${fj(a, b, '은/는')} ${fj(a * k, e, '과/와')} 크기가 같다. ${frac(a * k, e)}에는 ${frac(1, e)}이 ${a * k}번 들어가므로 ${frac(a, b)} ÷ ${frac(1, e)} = ${a * k}이다.`,
              facts: { calc: [[`${a}*${e}/${b}`, 0]] }
            });
          }),
          T('diff-steps', '통분하여 계산하는 과정', '①10 ②9·10 ③16 심3', (d, n) => {
            if (n === 0) {
              // 한 분모가 다른 분모의 배수: 한쪽만 고친다. 분자끼리 나누어떨어진다.
              const [a, b, m] = diffNat(d), x = b.n * m;
              return M('통분하여 계산하는 과정이다. ㉠, ㉡에 알맞은 수는?', labelled([x, m]), {
                figure: lines([eq(show(a), '/', show(b), '=', frac(box(LAB[0]), b.d), '/', show(b)), eq('=', box(LAB[0]), '/', b.n, '=', box(LAB[1]))]),
                explain: `${vj(a, '을/를')} 분모가 ${b.d}인 분수로 나타내면 ${frac(x, b.d)}이다. ${frac(x, b.d)} ÷ ${show(b)} = ${x} ÷ ${b.n} = ${m}이다.`,
                facts: { calc: [[`${a.n}*${b.d}/${a.d}`, 0], [`${a.n}*${b.d}/(${a.d}*${b.n})`, 1]] }
              });
            }
            // 두 분모의 곱을 공통분모로: 분자끼리 나누어떨어지지 않는다.
            const [a, b] = diffPick(d, 'coprime', true, (p, s) => s.n >= 2 && p.d * s.d <= 60 && gcd(p.n * s.d, s.n * p.d) === 1), L = a.d * b.d, x = a.n * b.d, y = b.n * a.d;
            return M('두 분모의 곱을 공통분모로 하여 통분한 다음 계산하는 과정이다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?', labelled([x, y, Math.floor(x / y), x % y]), {
              figure: lines([eq(show(a), '/', show(b), '=', frac(box(LAB[0]), L), '/', frac(box(LAB[1]), L)), eq('=', box(LAB[0]), '/', box(LAB[1]), '=', mixed(box(LAB[2]), box(LAB[3]), box(LAB[1])))]),
              explain: `${COMMON}${toldCommon(a, b)}이다.`,
              facts: { calc: [[`${a.n}*${b.d}`, 0], [`${b.n}*${a.d}`, 1], [quot(`${a.n}*${b.d}`, `(${b.n}*${a.d})`), 2], [rest(`${a.n}*${b.d}`, `(${b.n}*${a.d})`), 3]] }
            });
          }, { count: 2 }),
          T('diff-same-form', '통분하여 나타낸 식 가운데 계산 결과가 같은 것 찾기', '②10 ①10 심3', (d) => {
            // 틀린 식: 분모만 바꾸고 분자는 그대로 둔 것, 통분한 두 분수의 차례를 바꾼 것, 한쪽만 고친 것
            const [a, b] = d.until(() => [proper(d, 2, 9), proper(d, 2, 9)], ([p, s]) => { const L = lcm(p.d, s.d); return L !== p.d && L !== s.d && L <= 40 && p.n * (L / p.d) !== s.n * (L / s.d) && s.n >= 2; });
            const L = lcm(a.d, b.d), x = a.n * (L / a.d), y = b.n * (L / b.d), f = (p, s) => eq(frac(p, L), '/', frac(s, L));
            const rows = d.shuffle([[f(x, y), `${x}/${y}`, true], [f(a.n, b.n), `${a.n}/${b.n}`], [f(y, x), `${y}/${x}`], [f(x, b.n), `${x}/${b.n}`]]);
            return C(`${show(a)} ÷ ${vj(b, '을/를')} 통분하여 계산하려고 한다. 계산 결과가 같은 식은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[2]), {
              explain: `분모가 ${L}${tail(L, '이/가')} 되도록 통분하면 ${show(a)} = ${frac(x, L)}, ${show(b)} = ${frac(y, L)}이다. ${toldCommon(a, b)}이다.`,
              facts: { choose: { exprs: rows.map((row) => row[1]), rule: 'equals', target: x / y } }
            });
          }),
          T('diff-calc-nat', '분모가 다른 (분수)÷(분수): 몫이 자연수', '①11 ②11 ③16', (d, n) => {
            // 첫째 문항은 단위분수로 나누고, 둘째 문항은 진분수로 나눈다.
            const [a, b] = diffNat(d, n === 0);
            return calc(a, b, { kind: 'nat', explain: COMMON + toldCommon(a, b) + '이다.', rule: ['diff-unit-nat', 'diff-nat'][n] });
          }, { count: 2 }),
          T('diff-calc-frac', '분모가 다른 (분수)÷(분수): 통분하여 계산하기', '①11 ②12 ③17 심3', (d, n) => {
            // 문항마다 계산 구조가 다르다: 나누는 수의 분모가 배수이고 몫이 대분수, 나누어지는 수의 분모가 배수이고 몫이 진분수, 분모가 서로소인 단위분수로 나누기.
            const [a, b] = n === 0 ? diffPick(d, 'multiple', true, (p, s) => s.n >= 2 && p.d < s.d) : n === 1 ? diffPick(d, 'multiple', false, (p, s) => p.n >= 2 && p.d > s.d) : d.until(() => [proper(d, 3, 9, 2), V(0, 1, d.int(2, 9))], ([p, s]) => gcd(p.d, s.d) === 1 && div(p, s).q > 1 && div(p, s).p > div(p, s).q);
            return calc(a, b, { explain: COMMON + toldCommon(a, b) + '이다.', rule: ['diff-multiple-over', 'diff-multiple-under', 'diff-unit-frac'][n] });
          }, { count: 3 })
        ]
      },
      {
        id: 'nat', title: '(자연수)÷(분수)', standard: STD,
        types: [
          T('nat-unit-line', '수직선을 보고 (자연수)÷(단위분수) 알아보기', '③23 ①13', (d) => {
            const [c, e] = d.until(() => [d.int(2, 4), d.int(2, 5)], ([x, y]) => x * y <= 12 && x !== y);
            return N(`수직선에서 0부터 ${c}까지를 ${frac(1, e)}씩 뛰어 세었다. 그림을 보고 구한 ${c} ÷ ${frac(1, e)}의 몫은?`, c * e, {
              figure: hopLine(c, e, 1, c * e),
              explain: `1에는 ${frac(1, e)}이 ${e}번 들어가므로 ${c}에는 ${c} × ${e} = ${c * e}(번) 들어간다. ${c} ÷ ${frac(1, e)} = ${c * e}이다.`,
              facts: { calc: [[`${c}*${e}`, 0]] }
            });
          }),
          T('nat-unit-steps', '(자연수)÷(단위분수)를 곱셈으로 바꾸는 과정', '①13·14 ②13 ③24', (d) => {
            const [c, e] = d.until(() => [d.int(2, 9), d.int(3, 9)], ([x, y]) => x !== y);
            return M(`물통에 물 ${c} L를 부었더니 물통의 ${frac(1, e)}이 찼다. 물통을 가득 채우는 데 필요한 물의 양을 구하는 과정이다. ㉠, ㉡에 알맞은 수는?`, [{ label: LAB[0], answer: e }, { label: LAB[1], answer: c * e, unit: 'L' }], {
              figure: eq(c, '/', frac(1, e), '=', c, '*', box(LAB[0]), '=', box(LAB[1])),
              explain: `물통의 ${frac(1, e)}이 ${c} L이므로 물통 전체는 그 ${e}배이다. ${c} ÷ ${frac(1, e)} = ${c} × ${e} = ${c * e}이므로 ${c * e} L이다.`,
              facts: { calc: [[String(e), 0], [`${c}*${e}`, 1]] }
            });
          }),
          T('nat-rate-expr', '분수만큼의 양으로 1만큼의 양을 구하는 식 고르기', '①13 ③24', (d) => {
            // 틀린 식: 분수를 곱한 것(곱하면 줄어드는 것을 살피지 않는 아이), 나누는 차례를 바꾼 것, 분모로 나눈 것
            const k = d.int(2, 5), w = d.int(3, 9), [c, e] = d.until(() => [d.int(2, 9), d.int(2, 6)], ([x, y]) => x !== y && x !== k * w && y !== k), u = frac(1, e);
            const rows = d.shuffle([[eq(c, '/', u), `${c}*${e}/1`, true], [eq(c, '*', u), `${c}*1/${e}`], [eq(u, '/', c), `1/(${e}*${c})`], [eq(c, '/', e), `${c}/${e}`]]);
            return C(`쌀 ${k}포대의 무게가 ${k * w} kg이면 쌀 1포대의 무게는 ${k * w} ÷ ${josa(k, '으로/로')} 구한다. 쌀 ${u}포대의 무게가 ${c} kg일 때, 쌀 1포대의 무게를 구하는 식은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[2]), {
              explain: `무게를 포대의 수로 나누면 1포대의 무게가 된다. 포대의 수가 ${u}이어도 같으므로 ${c} ÷ ${u}이다. ${c} ÷ ${u} = ${c} × ${e} = ${c * e}(kg)이다.`,
              facts: { choose: { exprs: rows.map((row) => row[1]), rule: 'equals', target: c * e } }
            });
          }),
          T('nat-unit-calc', '(자연수)÷(단위분수)', '①14 ②14 ③25 심5', (d) => {
            const [c, e] = d.until(() => [d.int(2, 12), d.int(2, 12)], ([x, y]) => x !== y), a = nat(c), b = V(0, 1, e);
            return calc(a, b, { kind: 'nat', explain: `(자연수)÷(단위분수)는 자연수에 단위분수의 분모를 곱한다. ${told(a, b)}이다.`, rule: 'nat-unit' });
          }),
          T('nat-unit-say', '(자연수)÷(단위분수)를 바르게 설명한 것 고르기', '①15 ③27 ②13', (d) => {
            // 틀린 말: 분모로 나누는 것과 같다고 여기는 말, 나누면 작아진다고 여기는 말, 단위분수를 그대로 곱하는 말, 똑같이 나눈 것 중의 하나로 읽는 말
            const [c, e] = d.until(() => [d.int(3, 15), d.int(2, 9)], ([x, y]) => x !== y), u = frac(1, e), right = d.pick([`${c} × ${josa(e, '으로/로')} 바꾸어 계산할 수 있다.`, `몫은 ${c}보다 크다.`, `${c} 안에 ${u}이 몇 번 들어가는지 구하는 식이다.`]);
            const wrong = d.shuffle([`${josa(c, '을/를')} ${josa(e, '으로/로')} 나눈 몫과 같다.`, `몫은 ${c}보다 작다.`, `${c} × ${u}로 바꾸어 계산할 수 있다.`, `${josa(c, '을/를')} 똑같이 ${josa(e, '으로/로')} 나눈 것 중의 하나를 구하는 식이다.`]).slice(0, 3);
            const rows = d.shuffle([[right, true]].concat(wrong.map((text) => [text, false])));
            return C(`${c} ÷ ${u}에 대한 설명으로 옳은 것은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
              explain: `${c} ÷ ${u}${tail(1, '은/는')} ${c} 안에 ${u}이 몇 번 들어가는지 구하는 식이다. 1에 ${u}이 ${e}번 들어가므로 ${c} ÷ ${u} = ${c} × ${e} = ${c * e}이고, 몫은 ${c}보다 크다.`,
              facts: { truth: rows.map((row) => row[1]), want: true }
            });
          }),
          T('nat-steps-common', '자연수를 분수로 나타내어 (자연수)÷(분수)를 계산하는 과정', '①14·18 ③23·30 심5·6', (d) => {
            const [c, f] = natPick(d, 'whole', 12), x = c.w * f.d;
            return M('자연수를 나누는 수와 분모가 같은 분수로 나타내어 계산하는 과정이다. ㉠, ㉡에 알맞은 수는?', labelled([x, x / f.n]), {
              figure: lines([eq(c.w, '/', show(f), '=', frac(box(LAB[0]), f.d), '/', show(f)), eq('=', box(LAB[0]), '/', f.n, '=', box(LAB[1]))]),
              explain: `${c.w} = ${frac(x, f.d)}이다. ${toldCommon(c, f)}이다.`,
              facts: { calc: [[`${c.w}*${f.d}`, 0], [`${c.w}*${f.d}/${f.n}`, 1]] }
            });
          }),
          T('nat-div-steps', '(자연수÷분자)×분모로 계산하는 과정', '①16 ②15 ③29 심6', (d) => {
            const [c, f] = natPick(d, 'whole');
            return M('자연수를 분자로 나눈 다음 분모를 곱하여 계산하는 과정이다. ㉠, ㉡, ㉢에 알맞은 수는?', labelled([f.n, f.d, c.w / f.n * f.d]), {
              figure: lines([eq(c.w, '/', show(f), '=', par(c.w, '/', box(LAB[0])), '*', box(LAB[1])), eq('=', box(LAB[2]))]),
              explain: `${c.w} ÷ ${f.n} = ${c.w / f.n}${tail(c.w / f.n, '은/는')} ${frac(1, f.d)}만큼에 해당하는 양이고, 1만큼은 그 ${f.d}배이다. (${c.w} ÷ ${f.n}) × ${f.d} = ${c.w / f.n} × ${f.d} = ${c.w / f.n * f.d}이다.`,
              facts: { calc: [[String(f.n), 0], [String(f.d), 1], [`${c.w}/${f.n}*${f.d}`, 2]] }
            });
          }),
          T('nat-two-step-unit', '단위분수만큼을 먼저 구하여 1만큼의 양 구하기', '①17 ③29 심45', (d) => {
            const [c, f] = natPick(d, 'whole'), part = c.w / f.n;
            return M(`굵기가 일정한 막대 ${show(f)} m의 무게가 ${c.w} kg이다. 이 막대 1 m의 무게를 구하는 과정이다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?`, labelled([f.n, part, f.d, part * f.d]), {
              figure: lines([`막대 ${frac(1, f.d)} m의 무게: ` + eq(c.w, '/', box(LAB[0]), '=', box(LAB[1])), '막대 1 m의 무게: ' + eq(box(LAB[1]), '*', box(LAB[2]), '=', box(LAB[3]))]),
              explain: `${show(f)} m는 ${frac(1, f.d)} m의 ${f.n}배이므로 ${frac(1, f.d)} m의 무게는 ${c.w} ÷ ${f.n} = ${part}(kg)이다. 1 m는 ${frac(1, f.d)} m의 ${f.d}배이므로 ${part} × ${f.d} = ${part * f.d}(kg)이다. ${c.w} ÷ ${vj(f, '은/는')} (${c.w} ÷ ${f.n}) × ${josa(f.d, '과/와')} 같다.`,
              facts: { calc: [[String(f.n), 0], [`${c.w}/${f.n}`, 1], [String(f.d), 2], [`${c.w}/${f.n}*${f.d}`, 3]] }
            });
          }),
          T('nat-to-mul-steps', '(자연수)÷(분수)를 곱셈으로 나타내는 과정', '①19 ②17 ③29', (d) => {
            const [c, f] = natPick(d, 'plain', 9);
            return M('(자연수)÷(분수)를 분수의 곱셈으로 나타내는 과정이다. ㉠, ㉡, ㉢에 알맞은 수는?', labelled([f.n, f.d, c.w * f.d]), {
              figure: lines([eq(c.w, '/', show(f), '=', c.w, '/', f.n, '*', f.d), eq('=', c.w, '*', frac(1, box(LAB[0])), '*', f.d), eq('=', c.w, '*', frac(box(LAB[1]), box(LAB[0])), '=', frac(box(LAB[2]), box(LAB[0])))]),
              explain: `${c.w} ÷ ${f.n} = ${c.w} × ${frac(1, f.n)}이므로 ${c.w} × ${frac(1, f.n)} × ${f.d} = ${c.w} × ${frac(f.d, f.n)} = ${frac(c.w * f.d, f.n)}이다. 나누는 수의 분모와 분자를 바꾸어 곱한 것과 같다.`,
              facts: { calc: [[String(f.n), 0], [String(f.d), 1], [`${c.w}*${f.d}`, 2]] }
            });
          }),
          T('nat-calc-nat', '(자연수)÷(진분수): 몫이 자연수', '①18 ②16 ③31 심6', (d) => {
            const [c, f] = natPick(d, 'whole');
            return calc(c, f, { kind: 'nat', explain: `자연수가 분자의 배수이므로 자연수를 분자로 나눈 다음 분모를 곱한다. (${c.w} ÷ ${f.n}) × ${f.d} = ${c.w / f.n} × ${f.d} = ${c.w / f.n * f.d}이다.`, rule: 'nat-whole' });
          }),
          T('nat-calc-frac', '(자연수)÷(진분수): 몫이 분수', '①19 ②17 ③31 심6', (d, n) => {
            // 첫째 문항은 약분이 없고, 둘째 문항은 자연수와 분자를 약분한다.
            const [c, f] = natPick(d, ['plain', 'cut'][n]);
            return calc(c, f, { explain: FLIP + told(c, f) + '이다.', rule: ['nat-plain', 'nat-cut'][n] });
          }, { count: 2 }),
          T('nat-forms-odd', '(자연수)÷(분수)와 계산 결과가 다른 식 찾기', '②15 ③35', (d) => {
            // 틀린 식: 분모로 나누고 분자를 곱한 것(나누는 수를 뒤집지 않은 것)
            const [c, f] = natPick(d, 'whole', 12), x = c.w * f.d, swap = d.bool();
            const rows = d.shuffle([[eq(c.w, '/', f.n, '*', f.d), `${c.w}/${f.n}*${f.d}`], [eq(c.w, '*', frac(f.d, f.n)), `${c.w}*${f.d}/${f.n}`], [eq(frac(x, f.d), '/', show(f)), `${x}/${f.d}/(${f.n}/${f.d})`],
              swap ? [eq(c.w, '/', f.d, '*', f.n), `${c.w}/${f.d}*${f.n}`, true] : [eq(c.w, '*', show(f)), `${c.w}*${f.n}/${f.d}`, true]]);
            return C(`${c.w} ÷ ${vj(f, '과/와')} 계산 결과가 다른 것은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[2]), {
              explain: `${c.w} ÷ ${show(f)} = (${c.w} ÷ ${f.n}) × ${f.d} = ${c.w} × ${frac(f.d, f.n)} = ${x / f.n}이고, ${c.w} = ${frac(x, f.d)}이므로 ${frac(x, f.d)} ÷ ${vj(f, '과/와')}도 같다. ` + (swap ? `분모 ${josa(f.d, '으로/로')} 나누고 분자 ${josa(f.n, '을/를')} 곱하면` : `${vj(f, '을/를')} 그대로 곱하면`) + ' 계산 결과가 달라진다.',
              facts: { choose: { exprs: rows.map((row) => row[1]), rule: 'odd' } }
            });
          }),
          T('nat-flow', '자연수를 분수로 차례로 나누기', '③36 ②40 심12', (d) => {
            // 두 번 모두 몫이 자연수이다.
            const m = d.until(() => { const [c, f] = natPick(d, 'whole', 20), mid = div(c, f).p, e = d.int(3, 12), n = coTop(d, e, 2); return { c, f, mid, g: V(0, n, e) }; }, (v) => v.mid % v.g.n === 0 && v.g.d !== v.f.d && v.mid / v.g.n * v.g.d <= 99 && v.mid <= 40);
            const { c, f, g, mid } = m;
            return ansQ('차례로 나누어 빈 곳에 써넣으려고 한다. ㉠에 알맞은 수는?', qdiv(qdiv(q(c), q(f)), q(g)), {
              kind: 'nat', figure: flow([c.w, { step: `÷ ${show(f)}` }, box(), { step: `÷ ${show(g)}` }, box(LAB[0])]),
              explain: `${told(c, f)}이고, ${told(nat(mid), g)}이다.`
            });
          })
        ]
      },
      {
        id: 'mul', title: '분수의 곱셈으로 나타내어 계산하기', standard: STD,
        types: [
          T('mul-principle', '(분수)÷(분수)를 곱셈으로 나타내는 원리', '①22 ②18 ③40', (d) => {
            const [a, b] = mulPick(d, d.int(0, 1), null, 9);
            return M(`굵기가 일정한 쇠막대 ${show(b)} m의 무게가 ${show(a)} kg이다. 이 쇠막대 1 m의 무게를 구하는 식을 곱셈으로 나타내는 과정이다. ㉠, ㉡에 알맞은 수는?`, labelled([b.n, b.d]), {
              figure: lines([eq(show(a), '/', show(b), '=', par(show(a), '/', b.n), '*', b.d), eq('=', show(a), '*', frac(1, box(LAB[0])), '*', box(LAB[1])), eq('=', show(a), '*', frac(box(LAB[1]), box(LAB[0])))]),
              explain: `쇠막대 ${frac(1, b.d)} m의 무게는 ${show(a)} ÷ ${b.n} = ${show(a)} × ${frac(1, b.n)}(kg)이고, 1 m의 무게는 그 ${b.d}배이다. ${show(a)} ÷ ${show(b)} = ${show(a)} × ${frac(1, b.n)} × ${b.d} = ${show(a)} × ${frac(b.d, b.n)}이다.`,
              facts: { calc: [[String(b.n), 0], [String(b.d), 1]] }
            });
          }),
          T('mul-flip-steps', '나누는 수의 분모와 분자를 바꾸어 곱하는 과정', '①23 ②19 ③40 심4', (d, n) => {
            if (n === 0) {
              const [a, b] = mulPick(d, 0, null);
              return M('나눗셈을 곱셈으로 나타내어 계산하는 과정이다. ㉠, ㉡, ㉢에 알맞은 수는?', labelled([b.d, b.n, a.n * b.d]), {
                figure: lines([eq(show(a), '/', show(b), '=', show(a), '*', frac(box(LAB[0]), box(LAB[1]))), eq('=', frac(box(LAB[2]), a.d * b.n))]),
                explain: `${FLIP}${show(a)} × ${frac(b.d, b.n)} = ${frac(`${a.n} × ${b.d}`, `${a.d} × ${b.n}`)} = ${frac(a.n * b.d, a.d * b.n)}이다.`,
                facts: { calc: [[String(b.d), 0], [String(b.n), 1], [`${a.n}*${b.d}`, 2]] }
              });
            }
            const [a, b] = d.until(() => mulPick(d, d.int(1, 2), null), ([p, s]) => div(p, s).p >= 2), r = div(a, b);
            return M('나눗셈을 곱셈으로 나타내고 약분하여 계산하는 과정이다. ㉠, ㉡, ㉢에 알맞은 수는?', labelled([b.d, b.n, r.p]), {
              figure: lines([eq(show(a), '/', show(b), '=', show(a), '*', frac(box(LAB[0]), box(LAB[1]))), eq('=', frac(box(LAB[2]), r.q))]),
              explain: `${FLIP}${told(a, b)}이다.`,
              facts: { calc: [[String(b.d), 0], [String(b.n), 1], [`${a.n}*${b.d}*${r.q}/(${a.d}*${b.n})`, 2]] }
            });
          }, { count: 2 }),
          T('mul-form-pick', '나눗셈을 곱셈식으로 바르게 나타낸 것 고르기', '①24 ②20 ③41 심4', (d) => {
            // 틀린 식: 나누어지는 수의 분모와 분자를 바꾼 것, 아무것도 바꾸지 않은 것, 두 수를 모두 바꾼 것
            const [a, b] = mulPick(d, d.int(0, 1), null), fa = frac(a.d, a.n), fb = frac(b.d, b.n);
            const rows = d.shuffle([[eq(show(a), '*', fb), `${a.n}*${b.d}/(${a.d}*${b.n})`, true], [eq(fa, '*', show(b)), `${a.d}*${b.n}/(${a.n}*${b.d})`], [eq(show(a), '*', show(b)), `${a.n}*${b.n}/(${a.d}*${b.d})`], [eq(fa, '*', fb), `${a.d}*${b.d}/(${a.n}*${b.n})`]]);
            return C(`${show(a)} ÷ ${vj(b, '을/를')} 곱셈식으로 바르게 나타낸 것은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[2]), {
              explain: `나누어지는 수 ${vj(a, '은/는')} 그대로 두고, 나누는 수 ${show(b)}의 분모와 분자를 바꾸어 곱한다. ${show(a)} ÷ ${show(b)} = ${show(a)} × ${fb}이다.`,
              facts: { choose: { exprs: rows.map((row) => row[1]), rule: 'equals', target: a.n * b.d / (a.d * b.n) } }
            });
          }),
          T('mul-calc', '곱셈으로 나타내어 (진분수)÷(진분수) 계산하기', '①25 ②21 ③17 심4', (d, n) => {
            // 문항마다 계산 구조가 다르다: 약분이 없고 몫이 진분수, 약분이 없고 몫이 대분수, 한 번 약분, 엇갈려 두 번 약분.
            const [a, b] = [() => mulPick(d, 0, false), () => mulPick(d, 0, true), () => mulPick(d, 1, null), () => mulPick(d, 2, null)][n]();
            return calc(a, b, { explain: FLIP + told(a, b) + '이다.', rule: ['mul-plain-under', 'mul-plain-over', 'mul-once', 'mul-twice'][n] });
          }, { count: 4 }),
          T('mul-two-ways', '통분하는 방법과 곱셈으로 나타내는 방법으로 계산하기', '①27 ②22 ③30·49 심8', (d) => {
            const [a, b] = diffPick(d, 'coprime', null, (p, s) => s.n >= 2 && p.n >= 2 && p.d * s.d <= 60), L = a.d * b.d, x = a.n * b.d, y = b.n * a.d;
            return M(`${show(a)} ÷ ${vj(b, '을/를')} 두 가지 방법으로 계산하려고 한다. ㉠, ㉡, ㉢에 알맞은 수는?`, labelled([y, b.d, b.n]), {
              figure: lines(['[방법 1] 통분하여 분자끼리 나눈다.', eq(show(a), '/', show(b), '=', frac(x, L), '/', frac(box(LAB[0]), L)), eq('=', x, '/', box(LAB[0])), '[방법 2] 분수의 곱셈으로 나타낸다.', eq(show(a), '/', show(b), '=', show(a), '*', frac(box(LAB[1]), box(LAB[2])))]),
              explain: `통분하면 ${toldCommon(a, b)}이다. 곱셈으로 나타내면 ${told(a, b)}이다. 두 방법의 계산 결과는 같다.`,
              facts: { calc: [[`${b.n}*${a.d}`, 0], [String(b.d), 1], [String(b.n), 2]] }
            });
          })
        ]
      },
      {
        id: 'mixed', title: '가분수·대분수가 있는 나눗셈', standard: STD,
        types: [
          T('mixed-first', '대분수가 있는 나눗셈에서 가장 먼저 할 일', '①34 심7', (d) => {
            // 틀린 말: 가분수를 대분수로 고치는 것, 대분수인 채로 분자끼리 약분하는 것
            const [a, b] = d.until(() => pairOf(d, 'MI', { whole: false }), ([p, s]) => gcd(p.n, s.n) > 1 && p.d !== s.d);
            const rows = d.shuffle([[`대분수 ${vj(a, '을/를')} 가분수로 나타낸다.`, true], [`나누는 수 ${vj(b, '을/를')} 대분수로 나타낸다.`, false], [`${show(a)}의 분자 ${josa(a.n, '과/와')} ${show(b)}의 분자 ${josa(b.n, '을/를')} 약분한다.`, false]]);
            return C(`${show(a)} ÷ ${vj(b, '을/를')} 계산할 때 가장 먼저 해야 할 일은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
              explain: `대분수가 있는 나눗셈은 먼저 대분수를 가분수로 나타낸다. 대분수인 채로는 약분할 수 없다. ${told(a, b)}이다.`,
              facts: { truth: rows.map((row) => row[1]), want: true }
            });
          }),
          T('mixed-steps', '(대분수)÷(진분수): 가분수로 나타내어 계산하는 과정', '①30 ②23 심7', (d) => {
            const [a, b] = d.until(() => pairOf(d, 'MP', { whole: false, under: false }), ([p, s]) => s.n >= 2), r = div(a, b), e = `(${a.w}*${a.d}+${a.n})*${b.d}*${r.q}/(${a.d}*${b.n})`;
            return M('대분수를 가분수로 나타낸 다음 곱셈으로 나타내어 계산하는 과정이다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?', labelled([top(a), b.d, b.n, r.p % r.q]), {
              figure: lines([eq(show(a), '/', show(b), '=', frac(box(LAB[0]), a.d), '/', show(b)), eq('=', frac(box(LAB[0]), a.d), '*', frac(box(LAB[1]), box(LAB[2])), '=', mixed(Math.floor(r.p / r.q), box(LAB[3]), r.q))]),
              explain: `${show(a)} = ${frac(top(a), a.d)}이다. ${told(a, b)}이다.`,
              facts: { calc: [[`${a.w}*${a.d}+${a.n}`, 0], [String(b.d), 1], [String(b.n), 2], [rest(e, r.q), 3]] }
            });
          }),
          T('mixed-steps-two', '(대분수)÷(대분수): 두 수를 가분수로 나타내어 계산하는 과정', '②23 ①32 심7', (d) => {
            const [a, b] = pairOf(d, 'MM', { whole: false }), r = div(a, b);
            return M('두 대분수를 가분수로 나타내어 계산하는 과정이다. ㉠, ㉡, ㉢에 알맞은 수는?', labelled([top(a), top(b), r.p]), {
              figure: lines([eq(show(a), '/', show(b), '=', frac(box(LAB[0]), a.d), '/', frac(box(LAB[1]), b.d)), eq('=', frac(box(LAB[0]), a.d), '*', frac(b.d, box(LAB[1])), '=', frac(box(LAB[2]), r.q))]),
              explain: `${show(a)} = ${frac(top(a), a.d)}, ${show(b)} = ${frac(top(b), b.d)}이다. ${told(a, b)}이다.`,
              facts: { calc: [[`${a.w}*${a.d}+${a.n}`, 0], [`${b.w}*${b.d}+${b.n}`, 1], [`(${a.w}*${a.d}+${a.n})*${b.d}*${r.q}/(${a.d}*(${b.w}*${b.d}+${b.n}))`, 2]] }
            });
          }),
          T('mixed-common-steps', '(대분수)÷(진분수): 통분하여 계산하는 과정', '③49 ①27 심8', (d) => {
            const [a, b] = d.until(() => pairOf(d, 'MP', { whole: false }), ([p, s]) => s.n >= 2 && lcm(p.d, s.d) <= 40 && lcm(p.d, s.d) !== p.d), L = lcm(a.d, b.d), x = top(a) * (L / a.d), y = b.n * (L / b.d);
            return M('대분수를 가분수로 나타낸 다음 통분하여 계산하는 과정이다. ㉠, ㉡, ㉢에 알맞은 수는?', labelled([top(a), x, y]), {
              figure: lines([eq(show(a), '/', show(b), '=', frac(box(LAB[0]), a.d), '/', show(b)), eq('=', frac(box(LAB[1]), L), '/', frac(box(LAB[2]), L), '=', box(LAB[1]), '/', box(LAB[2]))]),
              explain: `${show(a)} = ${frac(top(a), a.d)}이다. ${toldCommon(a, b)}이다.`,
              facts: { calc: [[`${a.w}*${a.d}+${a.n}`, 0], [`(${a.w}*${a.d}+${a.n})*${L}/${a.d}`, 1], [`${b.n}*${L}/${b.d}`, 2]] }
            });
          }),
          T('mixed-calc-improper', '가분수가 있는 나눗셈', '①29·33 ②28 ③18 심4', (d, n) => {
            // 문항마다 수의 갈래가 다르다: (가분수)÷(진분수), (가분수)÷(가분수), (진분수)÷(가분수).
            const [a, b] = pairOf(d, ['IP', 'II', 'PI'][n], { whole: false });
            return calc(a, b, { explain: FLIP + told(a, b) + '이다.', rule: ['improper-proper', 'improper-improper', 'proper-improper'][n] });
          }, { count: 3 }),
          T('mixed-calc-proper', '(대분수)÷(진분수)', '①31 ②24 ③50 심7', (d, n) => {
            // 첫째 문항은 분모가 다르고, 둘째 문항은 분모가 같다(가분수로 고치면 분자끼리 나눈다).
            const [a, b] = pairOf(d, 'MP', { whole: false, same: n === 1 });
            return calc(a, b, { explain: n === 1 ? `대분수를 가분수로 나타내면 분모가 같으므로 분자끼리 나눈다. ${toldSame(a, b)}이다.` : TO_TOP + told(a, b) + '이다.', rule: ['mixed-proper', 'mixed-proper-same'][n] });
          }, { count: 2 }),
          T('mixed-calc-two', '대분수로 나누는 나눗셈', '①32·33 ②25·26·28 ③51 심7', (d, n) => {
            // 문항마다 구조가 다르다: (대분수)÷(대분수)의 몫이 1보다 크다, 1보다 작다, (진분수)÷(대분수), (대분수)÷(가분수).
            const [a, b] = [() => pairOf(d, 'MM', { whole: false, under: false }), () => pairOf(d, 'MM', { whole: false, under: true }), () => pairOf(d, 'PM', { whole: false }), () => pairOf(d, 'MI', { whole: false })][n]();
            return calc(a, b, { explain: TO_TOP + told(a, b) + '이다.', rule: ['mixed-mixed-over', 'mixed-mixed-under', 'proper-mixed', 'mixed-improper'][n] });
          }, { count: 4 }),
          T('mixed-calc-natdiv', '(자연수)÷(대분수), (자연수)÷(가분수)', '①33 ②27 ③32', (d, n) => {
            const [a, b] = pairOf(d, ['NM', 'NI'][n], { whole: false });
            return calc(a, b, { explain: (n === 0 ? TO_TOP : FLIP) + told(a, b) + `이다. 1보다 큰 수로 나누었으므로 몫은 ${a.w}보다 작다.`, rule: ['nat-mixed', 'nat-improper'][n] });
          }, { count: 2 }),
          T('mixed-calc-whole', '가분수·대분수가 있는 나눗셈: 몫이 자연수', '①29·31·33 ②24·27 ③32·50 심7', (d, n) => {
            // 문항마다 수의 갈래가 다르다: (대분수)÷(진분수), (가분수)÷(진분수), (자연수)÷(대분수), (자연수)÷(가분수), (대분수)÷(대분수).
            const shape = ['MP', 'IP', 'NM', 'NI', 'MM'][n], [a, b] = pairOf(d, shape, { whole: true, same: n === 4 ? null : false });
            return calc(a, b, { kind: 'nat', explain: (shape.includes('M') ? TO_TOP : FLIP) + told(a, b) + '이다.', rule: 'whole-' + shape });
          }, { count: 5 })
        ]
      },
      { id: 'check', title: '잘못된 계산 살펴보기', standard: STD, types: [] },
      { id: 'comp', title: '몫의 크기 비교하기', standard: STD, types: [] },
      { id: 'pick', title: '조건에 맞는 수의 나눗셈', standard: STD, types: [] },
      { id: 'box', title: '□가 있는 식과 어떤 수', standard: STD, types: [] },
      { id: 'word', title: '분수의 나눗셈의 활용', standard: STD, types: [] }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
