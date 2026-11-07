// 고등학교 미적분Ⅱ Ⅱ-3 도함수의 활용 — 실력 문제.
// 단원 틀·싣는 기준·뺀 것과 까닭은 11-5-5a.js 머리에 적었다. 도구는 B.kit.u55x(a 파일)를 쓴다.
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번. 미적분Ⅱ 자료에는 기출 모의고사가 없어 대단원 평가·학기 시험·중단원 평가의 끝 문제에서 골랐다.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것
//  - 두 곡선의 접선이 일치한다는 것을 「기울기가 같다」 하나로만 읽고, 그 점이 두 곡선의 교점이어야(함숫값도 같아야) 한다는 것을 놓친다.
//  - f″(a) = 0이면 곧 변곡점이라고 여긴다. 좌우에서 f″의 부호가 바뀌어야 하고, 부호가 바뀌는 곳이 정의역 밖일 수도 있다.
//  - 「열린구간 (p, q)에서 아래로 볼록」을 구간의 한 점에서 f″ > 0인 것으로 판단한다(구간 전체에서 f″ > 0이어야 한다).
//  - f′ = 0의 근이 셋이면 늘 극대·극소가 다 있다고 여기거나, 중근에서도 극값을 갖는다고 여긴다.
//  - 열린 끝(x > 0 의 x = 0)에서의 값을 최솟값으로 쓰거나, 극솟값이 끝없이 많을 때 가장 작은 것을 고르지 않는다.
//  - 그래프와 가로 직선의 교점을 셀 때 직선이 극값에 닿는 경우와 끝값을 함께 따지지 않는다.
// 실력에 둔 까닭: ① 문제의 장치에 함정이 있어 배운 뜻을 정확히 대야 풀리는 것, ② 세 단계 넘게 이어 생각해야 풀리는 것만 남겼다(유형마다 주석).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, N, C } = B.kit;
  const { MINUS, Q, nb, V, sup, rt, radAns } = B.kit.mid;
  const { jh, ln, trig, pw, sfrac } = B.kit.hs;
  const { Board } = B.kit.mgeo;
  const K = B.kit.u55x;
  const { S8, S9, S10, X, Y, Av, Kv, Fv, E, PI, INF, FP, FPP, H, near, toQ, qt, jq, R, one, add, numH, is, yIs, fIs, ePow, piOver, ivH, numChoice, textChoice, comboPick, pickBy } = K;
  const X2 = X + sup(2);
  const cf = (c) => (c === 1 ? '' : c === -1 ? MINUS : String(c));

  const hard = [
    // ① 「접선이 일치」를 기울기만 같은 것으로 읽으면 풀리지 않는다 — 교점(함숫값)과 미분계수를 함께 세우고, 두 식을 나누어 접점을 구한 뒤 상수를 정한다(세 단계).
    H('hard-common', '두 곡선이 만나는 점에서 접선이 일치할 때 상수', '①8', (d) => {
      const fam = d.int(0, 3);
      let text, right, wr, told;
      if (fam === 0) {
        // a sec x 와 eˣ (−π/2 < x < π/2): tan t = 1, t = π/4, a = (√2/2)e^{π/4}  /  a csc x 와 eˣ (0 < x < π): cot t = −1, t = 3π/4, a = (√2/2)e^{3π/4}
        const sec = d.bool(), q = sec ? 1 : 3, eq = (k, r2) => ({ key: `r2e${k}pi`, h: `${r2 ? rt(2) : ''}${pw(E, sfrac(`${k === 1 ? '' : k}π`, 4))}`, v: (r2 ? Math.SQRT2 : 1) * Math.exp(k * Math.PI / 4) });
        right = one(Q(1, 2), eq(q, true));
        wr = [one(1, eq(q, true)), one(Q(1, 2), eq(q === 1 ? 3 : 1, true)), one(1, eq(q, false)), one(Q(1, 2), eq(2 * q, true)), one(2, eq(q, true)), one(Q(1, 2), eq(q, false))];
        const fn = sec ? 'sec' : 'csc';
        text = `두 곡선 ${yIs(`${Av} ${trig(fn, X)}`)}, ${yIs(ePow(X))} (${sec ? `${MINUS}${frac(PI, 2)} &lt; ${X} &lt; ${frac(PI, 2)}` : `0 &lt; ${X} &lt; ${PI}`})의 교점에서 각 곡선에 접하는 직선이 일치할 때, 상수 ${Av}의 값은?`;
        told = `교점의 ${X}좌표를 ${jh(V('t'), '이라/라')} 하면 ${is(`${Av} ${trig(fn, V('t'))}`, ePow(V('t')))}, ${is(sec ? `${Av} ${trig('sec', V('t'))}${trig('tan', V('t'))}` : `${MINUS}${Av} ${trig('csc', V('t'))}${trig('cot', V('t'))}`, ePow(V('t')))}이다. 두 식을 나누면 ${sec ? is(trig('tan', V('t')), 1) : is(trig('cot', V('t')), MINUS + '1')}이므로 ${is(V('t'), piOver(q, 4))}이고, 첫 식에서 ${is(Av, numH(right))}이다`;
      } else if (fam === 1) {
        // a ln x 와 xⁿ: a/t = n tⁿ⁻¹, a ln t = tⁿ → ln t = 1/n, a = ne
        const n = d.pick([2, 3]); right = one(n, 'e^1');
        wr = [one(Q(1, n), 'e^1'), one(n, 'e^-1'), one(n, 'e^2'), R(n), one(2 * n, 'e^1'), one(n + 1, 'e^1')];
        text = `두 곡선 ${yIs(`${Av} ${ln(X)}`)}, ${yIs(X + sup(n))}의 교점에서 각 곡선에 접하는 직선이 일치할 때, 상수 ${Av}의 값은?`;
        told = `교점의 ${X}좌표를 ${jh(V('t'), '이라/라')} 하면 ${is(`${Av} ${ln(V('t'))}`, V('t') + sup(n))}, ${is(frac(Av, V('t')), `${n}${V('t')}${n === 2 ? '' : sup(n - 1)}`)}이다. 둘째 식에서 ${is(Av, `${n}${V('t')}${sup(n)}`)}이고 첫 식에 넣으면 ${is(ln(V('t')), frac(1, n))}이다. 따라서 ${is(Av, numH(right))}이다`;
      } else if (fam === 2) {
        // a√x 와 ln x: a/(2√t) = 1/t, a√t = ln t → ln t = 2, a = 2/e
        right = one(2, 'e^-1');
        wr = [one(2, 'e^1'), one(1, 'e^-1'), one(2, 'e^-2'), R(2), one(Q(1, 2), 'e^1'), one(4, 'e^-1')];
        text = `두 곡선 ${yIs(`${Av}${rt(X)}`)}, ${yIs(ln(X))}의 교점에서 각 곡선에 접하는 직선이 일치할 때, 상수 ${Av}의 값은?`;
        told = `교점의 ${X}좌표를 ${jh(V('t'), '이라/라')} 하면 ${is(`${Av}${rt(V('t'))}`, ln(V('t')))}, ${is(frac(Av, `2${rt(V('t'))}`), frac(1, V('t')))}이다. 둘째 식에서 ${is(`${Av}${rt(V('t'))}`, 2)}이므로 ${is(ln(V('t')), 2)}, ${is(V('t'), pw(E, 2))}이고 ${is(Av, frac(2, E))}이다`;
      } else {
        // eˣ 와 a√x: eᵗ = a√t, eᵗ = a/(2√t) → t = 1/2, a = √(2e)
        const r2e = (c) => ({ key: `r${c}e`, h: rt(`${c === 1 ? '' : c}${E}`), v: Math.sqrt(c * Math.E) });
        right = one(1, r2e(2));
        wr = [one(1, r2e(1)), one(2, r2e(1)), one(1, r2e(4)), one(Q(1, 2), r2e(2)), one(2, r2e(2)), one(1, 'e^1')];
        text = `두 곡선 ${yIs(ePow(X))}, ${yIs(`${Av}${rt(X)}`)}의 교점에서 각 곡선에 접하는 직선이 일치할 때, 양수 ${Av}의 값은?`;
        told = `교점의 ${X}좌표를 ${jh(V('t'), '이라/라')} 하면 ${is(ePow(V('t')), `${Av}${rt(V('t'))}`)}, ${is(ePow(V('t')), frac(Av, `2${rt(V('t'))}`))}이다. 두 식에서 ${is(`${Av}${rt(V('t'))}`, frac(Av, `2${rt(V('t'))}`))}, 곧 ${is(V('t'), frac(1, 2))}이고 ${is(Av, `${frac(ePow(sfrac(1, 2)), rt(frac(1, 2)))}`)} = ${jh(numH(right), '이다/이다')}`;
      }
      return numChoice(d, text, right, wr, { explain: `접선이 일치하려면 교점에서 함숫값과 미분계수가 모두 같아야 한다. ${told}.` });
    }, { standard: S8 }),

    // ② 증명의 빈칸: 할선을 뺀 함수 h, h″ = f″ 의 부호로 h′의 증감, 평균값 정리의 c, h의 증감표와 양 끝 0을 이어 대소를 끌어낸다(네 단계).
    H('hard-proof', '곡선의 볼록을 증명하는 과정의 빈칸', '①24', (d) => {
      const down = d.bool();
      const hp = `${FP}(${X}) ${MINUS} ${frac(`${Fv}(${V('b')}) ${MINUS} ${Fv}(${Av})`, `${V('b')} ${MINUS} ${Av}`)}`, hpWrong1 = `${frac(`${Fv}(${V('b')}) ${MINUS} ${Fv}(${Av})`, `${V('b')} ${MINUS} ${Av}`)} ${MINUS} ${FP}(${X})`, hpWrong2 = `${Fv}(${X}) ${MINUS} ${frac(`${Fv}(${V('b')}) ${MINUS} ${Fv}(${Av})`, `${V('b')} ${MINUS} ${Av}`)}`;
      const row = (a1, a2, a3) => `${nb(`㈎ ${a1}`)}, ${nb(`㈏ ${a2}`)}, ${nb(`㈐ ${a3}`)}`;
      const inc = down ? '증가' : '감소', dec = down ? '감소' : '증가', le = down ? '≤' : '≥', ge = down ? '≥' : '≤';
      const right = row(hp, inc, le);
      const wr = [row(hp, dec, le), row(hp, inc, ge), row(hpWrong1, inc, le), row(hpWrong2, inc, le), row(hp, dec, ge)];
      const proof = `어떤 열린구간에 속하는 두 실수 ${Av}, ${V('b')} (${Av} &lt; ${V('b')})에 대하여 곡선 ${is(Y, `${Fv}(${X})`)} 위의 두 점 ${nb(`(${Av}, ${Fv}(${Av}))`)}, ${nb(`(${V('b')}, ${Fv}(${V('b')}))`)}를 지나는 직선을 ${jh(is(Y, `${V('g')}(${X})`), '이라/라')} 하고 ${is(`${V('h')}(${X})`, `${Fv}(${X}) ${MINUS} ${V('g')}(${X})`)}로 놓으면 ${is(`${V('h')}′(${X})`, '(㈎)')}, ${is(`${V('h')}″(${X})`, `${FPP}(${X})`)}이다. 조건에서 ${V('h')}′(${X})는 이 구간에서 (㈏)한다. 평균값 정리에 의하여 ${is(`${FP}(${V('c')})`, frac(`${Fv}(${V('b')}) ${MINUS} ${Fv}(${Av})`, `${V('b')} ${MINUS} ${Av}`))}인 ${V('c')}가 ${Av}와 ${V('b')} 사이에 있으므로 ${is(`${V('h')}′(${V('c')})`, 0)}이고, ${is(`${V('h')}(${Av})`, `${V('h')}(${V('b')}) = 0`)}이다. 따라서 닫힌구간 [${Av}, ${V('b')}]에서 ${nb(`${V('h')}(${X}) (㈐) 0`)}, 곧 곡선은 직선보다 ${down ? '아래쪽' : '위쪽'}에 있다.`;
      return textChoice(d, `다음은 「이계도함수를 갖는 함수 ${Fv}(${X})에 대하여 어떤 열린구간에서 ${FPP}(${X}) ${down ? '&gt;' : '&lt;'} 0이면 곡선 ${is(Y, `${Fv}(${X})`)}는 ${down ? '아래로' : '위로'} 볼록하다」를 증명하는 과정이다. (㈎), (㈏), (㈐)에 알맞은 것을 차례로 나열한 것은?`, right, wr, {
        figure: `<div style="border:1px solid #c8ced6;border-radius:8px;padding:8px 12px;line-height:1.75;text-align:left">${proof}</div>`,
        explain: `${is(`${V('g')}(${X})`, `${frac(`${Fv}(${V('b')}) ${MINUS} ${Fv}(${Av})`, `${V('b')} ${MINUS} ${Av}`)}(${X} ${MINUS} ${Av}) + ${Fv}(${Av})`)}이므로 (㈎)는 ${hp}이다. ${V('h')}″ = ${FPP} ${down ? '&gt;' : '&lt;'} 0이므로 ${V('h')}′은 (㈏) ${inc}하고, ${V('h')}′(${V('c')}) = 0이므로 ${V('h')}는 ${V('c')}의 왼쪽에서 ${dec}, 오른쪽에서 ${inc}한다. 양 끝의 값이 0이므로 ${V('h')}의 ${down ? '최댓값' : '최솟값'}이 0이고 (㈐)는 ${le}이다.` });
    }, { standard: S9 }),

    // ① ㄴ은 구간이 볼록이 바뀌는 점을 걸치게 지어(구간의 일부에서만 맞다) 뜻을 정확히 대야 한다. ㄷ은 변곡점 둘 → f′에 넣기 → 곱(네 단계).
    H('hard-claims', '보기에서 곡선의 성질 고르기(극값·볼록·변곡점의 접선)', '①27', (d) => {
      const s = d.pick([1, -1]), m = (x) => s * x;   // s = −1 이면 그래프를 y축에 대하여 뒤집은 x²e^{−x}
      const r2 = Math.SQRT2, fH = `${X2}${ePow(s > 0 ? X : MINUS + X)}`;
      const ivT = (a, b) => (s > 0 ? ivH(a, b) : ivH(-b, -a));
      const valT = (k) => numH(one(k, 'e^-2'));
      // ㄱ: 극댓값
      const g = d.pick([
        [`${is(X, m(-2))}에서 극댓값 ${jh(valT(4), '을/를')} 갖는다.`, true],
        [`${is(X, m(-2))}에서 극댓값 ${jh(valT(2), '을/를')} 갖는다.`, false],
        [`${is(X, 0)}에서 극댓값을 갖는다.`, false],
        [`${is(X, m(-2))}에서 극솟값 ${jh(valT(4), '을/를')} 갖는다.`, false]]);
      // ㄴ: 볼록(아래로 볼록한 구간은 x < −2 − √2, x > −2 + √2 — s = −1 이면 뒤집는다)
      const n = d.pick([
        [`열린구간 ${ivT(0, 1)}에서 아래로 볼록하다.`, true],
        [`열린구간 ${ivT(-3, -1)}에서 위로 볼록하다.`, true],
        [`열린구간 ${ivT(-2, 0)}에서 아래로 볼록하다.`, false],
        [`열린구간 ${ivT(-1, 1)}에서 아래로 볼록하다.`, false],
        [`열린구간 ${ivT(-4, -2)}에서 위로 볼록하다.`, false]]);
      // ㄷ: 두 변곡점에서의 접선의 기울기의 곱 −4e⁻⁴
      const prod = d.pick([[-4, true], [4, false], [-2, false]]), cE = d.pick([true, true, false]);
      const dd = [`곡선 ${is(Y, `${Fv}(${X})`)}의 두 변곡점에서의 접선의 기울기의 곱은 ${numH(one(prod[0], cE ? 'e^-4' : 'e^-2'))}이다.`, prod[1] && cE];
      return comboPick(d, `함수 ${fIs(fH)}에 대하여 보기에서 옳은 것만을 있는 대로 고른 것은?`, [g[0], n[0], dd[0]], [g[1], n[1], dd[1]],
        `${is(`${FP}(${X})`, s > 0 ? `${X}(${X} + 2)${ePow(X)}` : `${X}(2 ${MINUS} ${X})${ePow(MINUS + X)}`)}이므로 ${is(X, m(-2))}에서 극댓값 ${valT(4)}, ${is(X, 0)}에서 극솟값 0을 갖는다. ${is(`${FPP}(${X})`, s > 0 ? `(${X2} + 4${X} + 2)${ePow(X)}` : `(${X2} ${MINUS} 4${X} + 2)${ePow(MINUS + X)}`)}이므로 위로 볼록한 구간은 ${s > 0 ? `(${MINUS}2 ${MINUS} ${rt(2)}, ${MINUS}2 + ${rt(2)})` : `(2 ${MINUS} ${rt(2)}, 2 + ${rt(2)})`}이고 나머지에서 아래로 볼록하다. 변곡점의 ${X}좌표 ${s > 0 ? `${MINUS}2 ± ${rt(2)}` : `2 ± ${rt(2)}`}를 ${FP}(${X})에 넣은 두 값의 곱은 ${numH(one(-4, 'e^-4'))}이다. 따라서 ㄱ은 ${g[1] ? '참' : '거짓'}, ㄴ은 ${n[1] ? '참' : '거짓'}, ㄷ은 ${dd[1] ? '참' : '거짓'}이다.`);
    }, { standard: S9 }),

    // ① f′ = 0 의 근이 셋이어도 중근이 끼면 부호가 한 번만 바뀐다(경계 k 를 빼야 한다). 삼차방정식의 근 조건(극값의 곱)까지 네 단계.
    H('hard-twoext', '극댓값과 극솟값을 모두 가질 조건', '①29', (d) => {
      // f(x) = (x³ − k)e^{cx}, c = ±1/m: f′ = c(x³ + (3/c)x² − k)e^{cx}, g(x) = x³ + (3/c)x² − k 의 극값 g(0) = −k, g(−2/c) = 4/c³ − k
      const m = d.pick([1, 2, 3]), sg = d.pick([1, -1]), bound = sg * 4 * m ** 3, cnt = 4 * m ** 3 - 1;
      const exH = m === 1 ? (sg > 0 ? X : MINUS + X) : `${sg > 0 ? '' : MINUS}${frac(X, m)}`;
      const g3 = `${X}${sup(3)} ${sg > 0 ? '+' : MINUS} ${3 * m}${X2} ${MINUS} ${Kv}`;
      return N(`함수 ${jh(fIs(`(${X}${sup(3)} ${MINUS} ${Kv})${ePow(exH)}`), '이/가')} 극댓값과 극솟값을 모두 갖도록 하는 정수 ${Kv}의 개수는?`, cnt, {
        explain: `${is(`${FP}(${X})`, `${sg > 0 ? '' : MINUS}${m === 1 ? '' : frac(1, m)}(${g3})${ePow(exH)}`)}이다. ${is(`${V('g')}(${X})`, g3)}가 부호가 바뀌는 근을 둘 이상 가져야 하므로 서로 다른 세 실근이 필요하다(중근이 끼면 부호가 한 번만 바뀐다). ${V('g')}(${X})는 ${is(X, 0)}, ${is(X, sg * -2 * m)}에서 극값 ${MINUS}${Kv}, ${jh(`${bound < 0 ? MINUS : ''}${Math.abs(bound)} ${MINUS} ${Kv}`, '을/를')} 가지므로 ${nb(`${MINUS}${Kv}(${bound < 0 ? MINUS + Math.abs(bound) : bound} ${MINUS} ${Kv}) &lt; 0`)}, 곧 ${sg > 0 ? `0 &lt; ${Kv} &lt; ${bound}` : `${MINUS}${Math.abs(bound)} &lt; ${Kv} &lt; 0`}이다. 정수 ${Kv}는 ${cnt}개이다.`,
        facts: { value: `4*${m}*${m}*${m}-1`, derived: [4] } });
    }, { standard: S9 }),

    // ② 변수(각) 고르기 → 넓이를 각의 함수로 → 미분해 인수분해 → 최댓값(네 단계).
    H('hard-area', '반원에 내접하는 사다리꼴의 넓이의 최댓값', '②4', (d) => {
      const r = d.pick([2, 4, 6, 8, 10]), coef = 3 * r * r / 4;
      const b = Board(), R0 = 108, O = [0, 0], at = (deg) => [R0 * Math.cos(deg * Math.PI / 180), -R0 * Math.sin(deg * Math.PI / 180)];
      const A = at(0), Bp = at(52), Cp = at(128), D = at(180);
      b.arc(O, R0, 0, 180).seg(D, A).seg(A, Bp).seg(Bp, Cp).seg(Cp, D).dot(O);
      b.name(A, 'A', 0).name(Bp, 'B', 52).name(Cp, 'C', 128).name(D, 'D', 180).name(O, 'O', 270, 12);
      b.arrow(D, A, 0.3).arrow(Cp, Bp, 0.5).beside(O, A, String(r), [R0 / 2, -30]);
      const fig = b.svg(`그림: 중심이 O이고 반지름의 길이가 ${r}인 반원. 선분 AD는 지름이고 호 위의 두 점 B, C에 대하여 선분 BC는 AD와 평행하다. 사다리꼴 ABCD.`);
      return radAns(`그림과 같이 중심이 O이고 반지름의 길이가 ${jh(String(r), '인/인')} 반원에서 선분 AD는 지름이고, 호 위의 두 점 B, C에 대하여 두 선분 AD, BC가 평행하다. 사다리꼴 ABCD의 넓이의 최댓값은?`, coef, 3, {
        figure: fig,
        explain: `${is('∠BOA', V('θ'))} (0 &lt; ${V('θ')} &lt; ${frac(PI, 2)})라 하면 높이는 ${r}${trig('sin', V('θ'))}, ${is('BC', `${2 * r}${trig('cos', V('θ'))}`)}이므로 넓이는 ${is(`${V('S')}(${V('θ')})`, `${r * r}${trig('sin', V('θ'))}(1 + ${trig('cos', V('θ'))})`)}이다. ${is(`${V('S')}′(${V('θ')})`, `${r * r}(2${trig('cos', V('θ'))} ${MINUS} 1)(${trig('cos', V('θ'))} + 1)`)} = 0에서 ${is(V('θ'), frac(PI, 3))}이고 이 점에서 최대이므로 최댓값은 ${r * r} × ${frac(rt(3), 2)} × ${frac(3, 2)} = ${coef}${jh(rt(3), '이다/이다')}.`,
        facts: { calc: [[`3*${r}*${r}/4`, 0], ['3', 1]], derived: [3, 4] } });
    }, { standard: S9 }),

    // ① 직선이 극값에 닿는 경우를 가르고 양 끝값까지 따져야 한다 — 교점이 둘인 경우가 두 갈래이고 조건으로 하나를 고른다(네 단계).
    H('hard-line2', '그래프와 가로 직선이 두 점에서 만날 때 f(0)', '②10', (d) => {
      // f(x) = −x cos x + sin x + C: x = −2π, −π, 0, π, 2π 에서 2π + C, −π + C, C, π + C, −2π + C (↘ ↗ ↗ ↘). y = Lπ 와 교점 둘 ⇔ C = (L ± 1)π
      const L = d.pick([1, 2, 3, -1]), up = d.bool(), Cv = up ? L + 1 : L - 1;
      const right = one(Cv, 'pi'), wr = [L - 1, L + 1, L, L + 2, L - 2, 2 * L].filter((k) => k !== Cv).map((k) => one(k, 'pi'));
      const LH = numH(one(L, 'pi'));
      return numChoice(d, `함수 ${fIs(`${MINUS}${X} ${trig('cos', X)} + ${trig('sin', X)} + ${V('C')}`)} (${V('C')}는 상수)에 대하여 닫힌구간 [${MINUS}2${PI}, 2${PI}]에서 직선 ${is(Y, LH)}와 곡선 ${is(Y, `${Fv}(${X})`)}가 서로 다른 두 점에서 만난다. ${Fv}(0) ${up ? '&gt;' : '&lt;'} ${jh(LH, '일/일')} 때, ${Fv}(0)의 값은?`, right, wr, {
        explain: `${is(`${FP}(${X})`, `${X} ${trig('sin', X)}`)}이므로 ${Fv}(${X})는 [${MINUS}2${PI}, ${MINUS}${PI}]에서 감소, [${MINUS}${PI}, ${PI}]에서 증가, [${PI}, 2${PI}]에서 감소한다. ${Fv}(${MINUS}2${PI}) = 2${PI} + ${V('C')}, ${Fv}(${MINUS}${PI}) = ${MINUS}${PI} + ${V('C')}, ${Fv}(${PI}) = ${PI} + ${V('C')}, ${Fv}(2${PI}) = ${MINUS}2${PI} + ${V('C')}이므로 직선과 교점이 둘인 것은 직선이 극솟값이나 극댓값에 닿을 때, 곧 ${is(`${MINUS}${PI} + ${V('C')}`, LH)} 또는 ${is(`${PI} + ${V('C')}`, LH)}일 때뿐이다(그 밖에는 하나나 셋). ${is(V('C'), numH(one(L + 1, 'pi')))} 또는 ${is(V('C'), numH(one(L - 1, 'pi')))}이고 ${is(`${Fv}(0)`, V('C'))} ${up ? '&gt;' : '&lt;'} ${jh(LH, '이므로/이므로')} ${is(`${Fv}(0)`, numH(right))}이다.` });
    }, { standard: S10 }),

    // ① 극솟값이 끝없이 많아 가장 작은 것을 골라야 하고, 열린 끝 x = 0 의 값은 닿지 않는다. 곱해 떼기 → 미분 → 극솟값 비교(네 단계).
    H('hard-trigineq', '삼각함수와 지수함수가 섞인 부등식의 상수', '②14', (d) => {
      // (cb sin x + b cos x)e^{−cx} ≥ k (x > 0): f′ = −b(1 + c²)e^{−cx} sin x, x = (2n − 1)π 에서 극솟값 −b e^{−c(2n−1)π}, 가장 작은 것 −b e^{−cπ}
      const b = d.pick([1, 2, 3]), c = d.pick([1, 2, 3]), ebase = (k, half) => ({ key: `em${k}pi${half ? 'h' : ''}`, den: pw(E, half ? sfrac(`${k === 1 ? '' : k}π`, 2) : `${k === 1 ? '' : k}π`), v: Math.exp(-k * Math.PI / (half ? 2 : 1)) });
      const right = one(-b, ebase(c)), wr = [one(-b, ebase(2 * c)), one(b, ebase(c)), one(-b, ebase(c, true)), R(b), R(-b), one(-b, ebase(3 * c))];
      const lhs = `${cf(c * b)}${trig('sin', X)} + ${cf(b)}${trig('cos', X)}`, ex = ePow(c === 1 ? X : `${c}${X}`), exm = ePow(c === 1 ? MINUS + X : `${MINUS}${c}${X}`);
      return numChoice(d, `${X} &gt; 0일 때, 부등식 ${jh(nb(`${lhs} ≥ ${Kv}${ex}`), '이/가')} 성립하도록 하는 실수 ${Kv}의 최댓값은?`, right, wr, {
        explain: `${ex} &gt; 0이므로 ${nb(`(${lhs})${exm} ≥ ${Kv}`)}이다. ${jh(fIs(`(${lhs})${exm}`), '이라/라')} 하면 ${is(`${FP}(${X})`, `${MINUS}${b * (1 + c * c)}${exm}${trig('sin', X)}`)}이므로 ${X} = ${PI}, 3${PI}, 5${PI}, ⋯에서 극소이고 극솟값은 ${MINUS}${b === 1 ? '' : b}${pw(E, `${MINUS}${c === 1 ? '' : c}${PI}`)}, ${MINUS}${b === 1 ? '' : b}${pw(E, `${MINUS}${3 * c}${PI}`)}, ⋯로 점점 0에 가까워진다. 가장 작은 것은 ${is(X, PI)}에서의 ${jh(numH(right), '이고/이고')} ${X} → 0+일 때의 값 ${b}에는 닿지 않으므로 ${Kv}의 최댓값은 ${jh(numH(right), '이다/이다')}.` });
    }, { standard: S10 }),

    // ② 최소가 되는 점을 a로 → 최솟값을 a의 식으로 → 그 식 ≥ 0 의 이차부등식(네 단계).
    H('hard-ineqa', '부등식이 성립할 양수 a의 범위', '②15', (d) => {
      // x > −1, ax + c ≥ √(x + 1): 최솟값 c − a − 1/(4a) ≥ 0 ⇔ 4a² − 4ca + 1 ≤ 0 ⇔ (c − √(c² − 1))/2 ≤ a ≤ (c + √(c² − 1))/2
      const [cq, lo, hi] = d.pick([[Q(5, 4), Q(1, 4), Q(1, 1)], [Q(5, 3), Q(1, 6), Q(3, 2)], [Q(13, 12), Q(1, 3), Q(3, 4)], [Q(17, 8), Q(1, 8), Q(2, 1)]]);
      const r = (a, op1, op2, b2) => nb(`${qt(a)} ${op1} ${Av} ${op2} ${qt(b2)}`), right = r(lo, '≤', '≤', hi);
      const wr = [r(lo, '&lt;', '&lt;', hi), nb(`${Av} ≥ ${qt(lo)}`), nb(`0 &lt; ${Av} ≤ ${qt(hi)}`), r(lo, '≤', '≤', toQ(lo.p / lo.q + hi.p / hi.q)), r(toQ(hi.p / hi.q / 2), '≤', '≤', hi)];
      return textChoice(d, `${X} &gt; ${MINUS}1일 때, 부등식 ${jh(nb(`${Av}${X} + ${qt(cq)} ≥ ${rt(`${X} + 1`)}`), '이/가')} 성립하도록 하는 양수 ${Av}의 값의 범위는?`, right, wr, {
        explain: `${jh(fIs(`${Av}${X} + ${qt(cq)} ${MINUS} ${rt(`${X} + 1`)}`), '이라/라')} 하면 ${is(`${FP}(${X})`, `${Av} ${MINUS} ${frac(1, `2${rt(`${X} + 1`)}`)}`)} = 0에서 ${is(X, `${frac(1, `4${Av}${sup(2)}`)} ${MINUS} 1`)}이고 이 점에서 최소이다. 최솟값 ${nb(`${qt(cq)} ${MINUS} ${Av} ${MINUS} ${frac(1, `4${Av}`)}`)} ≥ 0의 양변에 ${jh(`4${Av}`, '을/를')} 곱하면 ${nb(`4${Av}${sup(2)} ${MINUS} ${qt(toQ(4 * cq.p / cq.q))}${Av} + 1 ≤ 0`)}이므로 ${jh(right, '이다/이다')}.` });
    }, { standard: S10 })
  ];

  B.addGroup('11-5-5', { id: 'hard', title: '실력 문제', standard: S9, types: hard });
})(typeof window !== 'undefined' ? window : globalThis);
