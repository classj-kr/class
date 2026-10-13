// 중학교 2학년 1학기 1단원 유리수와 순환소수 — 단원 틀·도구와 앞쪽 묶음(유한소수와 무한소수, 순환소수와 순환마디, 소수점 아래 n번째 자리의 숫자, 유한소수로 나타낼 수 있는 분수).
// 수집해 둔 교과서 3종(미래엔 황선욱 2015·2022, 천재 김동재·김화경)의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 75꼴, 심화꼴 45꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 뺌(까닭) / 겹침」을 가른 대조표는 references/textbooks/수학/_분석/8-1-1/싣기_대조표.md 에 있다.
// (유한소수·순환소수가 되게 하는 수, 순환소수를 분수로 나타내기, 크기 비교와 계산, 유리수와 순환소수의 관계는 8-1-1b.js 에, 실력 문항은 8-1-1c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
// 영역은 수와 연산. 성취기준은 9수01-06(순환소수의 뜻을 알고, 유리수와 순환소수의 관계를 설명할 수 있다)이다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(풀어 쓴 소수 0.2333… / 점을 찍은 표현 / 분수 / 분모를 소인수분해 한 분수 / 과정), 묻는 것(순환마디·자리의 숫자·개수·고르기·빈칸)이 다르면 따로 싣는다.
//    수만 다른 것은 한 번만 싣는다. 같은 글에 구조만 다른 문항은 facts.rule 에 이름을 달았다.
//  - 순환소수는 공용 도구 rep 로 적는다(순환마디의 양 끝 숫자 위에 점). 잘못 찍은 표현(정수 부분의 점, 가운데 숫자의 점)만 이 파일의 dotAt 으로 그린다.
//  - 답: 순환마디는 0으로 시작하지 않는 것만 수 칸으로 받고, 0으로 시작하는 것(09, 070)과 점을 찍은 표현은 고르기로 낸다. 분수는 기약분수(F)로 받는다.
//    유한소수 값(0.225)은 이 단원이 소수 둘째·셋째 자리 답 칸을 쓰는 단원이 아니어서 고르기나 분자(225/10³의 225)로 받는다. 음수는 쓰지 않으므로 부호 단추가 없다.
//  - 교육과정의 금: 「유한소수를 순환소수로 나타내는 것은 다루지 않는다.」「순환소수를 분수로 고치는 것은 순환소수가 유리수임을 이해할 수 있는 정도로 다룬다.」
//    순환마디가 9인 수(0.9̇, 3.79̇)는 하나도 쓰지 않는다(수를 고르는 okRep 이 막는다). 「무리수」라는 말을 쓰지 않고 「순환소수가 아닌 무한소수」로 적는다.
//    순환소수의 계산은 분수로 고쳐서 하는 계산 한 번(두 순환소수의 합, 역수, 자연수를 곱해 자연수가 되게 하기)까지만 싣는다. 두 순환소수의 차는 꼴 목록에 없어 싣지 않았다.
//  - 정수를 유한소수로 치는지에 따라 답이 갈리지 않게, 유한소수를 가리거나 세는 문항의 분수는 정수가 되지 않는 것만 고른다.
//    「유한소수가 되게 하는 가장 작은 자연수」도 그 수를 곱한 값이 정수가 되지 않는 분수(기약분수의 분모에 2나 5가 남는 것)만 쓴다.
//    「유한소수로 나타낼 수 없는 분수는 모두 순환소수로 나타낼 수 있다」는 자료끼리 판정이 갈려 쓰지 않는다.
//  - 꼴 목록에 적힌 원문 답지의 잘못은 따르지 않는다. 답은 모두 코드가 셈한다(나눗셈을 끝까지 하는 expand, 유한소수 판정 fin).
//  - 검사 근거: 자리의 숫자는 나머지를 n − 1번 이어 구하는 식(digitJs)으로, 「가장 작은 자연수」는 1부터 넣어 보는 틀(facts.digit — 10⁶을 곱해 분모로 나누어떨어지는가)로,
//    개수는 하나씩 따진 참·거짓 목록(facts.count)으로, 분수 답은 값(facts.value)으로 다시 셈한다. 문장·표현의 참·거짓을 고르는 문항은 검사가 답을 다시 셈하지 못하므로
//    문제 글만 읽어 다시 푸는 풀이를 따로 써서 맞춰 보았다.
//
// 뺀 것과 까닭(8-1-1b.js, 8-1-1c.js 의 것까지 여기에 모아 적는다)
//  - 교육과정의 금(유한소수를 순환소수로): 0.1999…(①8의 변형), 0.ȧ의 분모가 9가 되는 a(①62의 변형). 심29(3.79̇)는 순환마디가 9가 아닌 수로 바꾸어 실었다.
//  - 「유리수임을 이해할 수 있는 정도」를 넘는 것: 공식 꼴 식의 참·거짓(①55), 순환소수 셋의 혼합 계산(①69), 순환소수가 든 방정식·부등식(①72·73 심33·34·35·37·38),
//    문자로 된 순환소수의 합·차·곱(심39·40), 두 순환소수의 곱을 다시 긴 나눗셈으로(심36).
//  - 뒤 학년 낱말: 「무리수」가 든 문장(①75의 변형).
//  - 중1 복습: 정수가 아닌 유리수 고르기(①3 — 7-1-2에 있다).
//  - 조건 셋 이상을 한꺼번에 맞추거나 경우를 다 따지는 것: 배수·범위 조건이 더 붙은 분자(①44), 기약분수의 분자가 정해진 분수(①45 심23), 조건 ㈎㈏㈐(심24·25),
//    한 분수는 순환소수이고 다른 분수는 유한소수(①49), 두 순환소수 사이의 분수(①36 심16의 변형), 유한소수가 되는 가장 큰 두 자리 수(심21), 9999를 곱한 값의 최댓값(심41).
//  - 요령을 알아야 하는 것: 약분 조건을 거꾸로 푸는 숫자(①62), 순환마디가 첫째 자리에서 시작되게 하는 분자(심26), 끝없는 합(심32), 제곱수 만들기(심44), 자연수를 이어 쓴 소수(심11).
//  - 그림을 알 수 없는 것: 섬 밟기(①37), 음 가락(심10).
//  - 뜻 없는 셈·기본 둘을 붙인 것: 두 자리의 숫자의 합(①19·20의 변형), 분자와 분모의 합(①59), 빈칸 값으로 다시 셈하기(①22의 변형), 두 순환마디의 합(①14의 변형),
//    두 역수의 곱·몫(①67), 숫자를 구해 자리를 바꾼 수를 다시 분수로(①61의 변형). 하나하나는 실었다.
//  - 서술형: 틀린 표기를 고치고 까닭 쓰기(①16), 약분하지 않은 풀이 바로잡기(①32 — 고르기로 바꾸어 실었다), 까닭 설명(①38의 변형).
//  - 같은 일이어서 한 번만 실은 것은 대조표에 「겹침」으로 적었다(○× 표시 ①27, 관계 문장의 ○× ①75, 과정에서 틀린 것 고르기 ①51의 변형·심27,
//    같은 일을 다섯 번 하고 견주는 ①15·18의 변형·심2·3, 값만 묻는 ①23, 여집합을 세는 ①42 등).
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, box, frac, lines, numbers, tagged, N, M, C, F } = B.kit;
  const { LAB, range, gcd, lcm, Q, qcmp, fl, nb, tail, V, sup, claimQ, nline, rep, repQ, repDigit } = B.kit.mid;
  const STD = '9수01-06';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const ruled = (item, rule) => { item.facts.rule = rule; return item; };
  const asc = (list) => list.slice().sort((x, y) => x - y);
  const ORD = ['', '첫', '둘', '셋', '넷', '다섯', '여섯'];

  // ── 수의 성질 ──
  // 소인수분해: fz(360) → [[2, 3], [3, 2], [5, 1]]
  const fz = (n) => { const out = []; let m = n; for (let p = 2; m > 1; p += 1) { let e = 0; while (m % p === 0) { e += 1; m /= p; } if (e) out.push([p, e]); } return out; };
  const fval = (f) => f.reduce((s, [p, e]) => s * p ** e, 1);
  const strip25 = (n) => { let m = n; while (m % 2 === 0) m /= 2; while (m % 5 === 0) m /= 5; return m; };
  // p/q 가 유한소수가 되려면 곱해야 하는 가장 작은 자연수: 기약분수로 고친 분모에서 2와 5를 뺀 나머지
  const need = (p, q) => strip25(q / gcd(p, q));
  const fin = (p, q) => need(p, q) === 1;
  // 나눗셈 p ÷ q 를 나머지가 0이 되거나 되풀이될 때까지 한다: whole 정수 부분, pre 순환하지 않는 자리의 숫자들, cyc 순환마디(유한소수이면 '')
  function expand(p, q) {
    const seen = new Map(), digits = [];
    let r = p % q;
    while (r !== 0 && !seen.has(r)) { seen.set(r, digits.length); r *= 10; digits.push(Math.floor(r / q)); r %= q; }
    const start = r === 0 ? digits.length : seen.get(r);
    return { whole: Math.floor(p / q), pre: digits.slice(0, start).join(''), cyc: digits.slice(start).join('') };
  }
  // 순환마디로 적을 수 있는 숫자열인가: 더 짧게 되풀이되지 않고, 9뿐이거나 0뿐이 아니며, 순환하지 않는 자리의 끝 숫자와 순환마디의 끝 숫자가 다르다(같으면 순환마디가 한 칸 앞에서 시작한다).
  // 0이 잇달아 든 순환마디(300, 200)는 낯설어 쓰지 않는다.
  const primitive = (c) => range(1, c.length - 1).every((k) => c.length % k !== 0 || c !== c.slice(0, k).repeat(c.length / k));
  const okRep = (pre, cyc) => primitive(cyc) && !/^9+$/.test(cyc) && !/00/.test(cyc) && cyc !== '0' && pre.slice(-1) !== cyc.slice(-1);
  // 순환소수 하나를 고른다. o.whole 정수 부분(수이거나 [작은 끝, 큰 끝]), o.f 순환하지 않는 자리의 수, o.k 순환마디의 자리 수, o.ok 더 거는 조건
  const pickRep = (d, o) => d.until(() => ({
    whole: o.whole == null ? 0 : typeof o.whole === 'number' ? o.whole : d.int(o.whole[0], o.whole[1]),
    pre: range(1, o.f || 0).map(() => d.int(0, 9)).join(''), cyc: range(1, o.k).map(() => d.int(0, 9)).join('')
  }), (r) => okRep(r.pre, r.cyc) && (!o.ok || o.ok(r)));
  // 정수가 아닌 양의 기약분수 p/q 를 고른다(e 는 나눗셈 결과). dens 분모의 후보, max 크기의 끝(기본 1보다 작은 분수)
  const pickFrac = (d, dens, ok, max) => d.until(() => { const q = d.pick(dens), p = d.int(1, Math.max(1, Math.floor((max || 1) * q) - 1)); return { p, q, e: expand(p, q) }; }, (x) => gcd(x.p, x.q) === 1 && x.p % x.q !== 0 && (!ok || ok(x)));

  // ── 수를 적는 글 ──
  const headOf = (r) => r.whole + '.' + r.pre;
  const decText = (e) => e.whole + (e.pre ? '.' + e.pre : '');   // 유한소수
  const repOf = (r) => rep(headOf(r), r.cyc);
  const valOf = (r) => repQ(headOf(r), r.cyc);
  // 풀어 쓴 순환소수: 0.2333…, 0.121212…, 1.070070070…
  const unroll = (head, cyc) => head + String(cyc).repeat(3) + '…';
  const unrollOf = (r) => unroll(headOf(r), r.cyc);
  // 토씨는 읽을 때 마지막에 오는 숫자에 맞춘다. 소수는 끝 숫자, 분수는 분자.
  const lastJ = (text, pair) => { const m = String(text).match(/(\d)\D*$/); return tail(Number(m[1]), pair); };
  const repJ = (r, pair) => repOf(r) + lastJ(r.cyc, pair);
  const unJ = (r, pair) => unrollOf(r) + lastJ(r.cyc, pair);
  const decJ = (text, pair) => text + lastJ(text, pair);
  const fj = (n, d, pair) => nb(frac(n, d) + tail(n, pair));
  // 화면에는 안 보이고 글로 옮길 때만 남는 글
  const SR = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)';
  // 분모를 소인수분해 한 꼴로 적은 분수. f: 분모의 [소수, 지수]들, extra: 분모 끝에 덧붙이는 문자
  const fden = (f) => f.map(([p, e]) => p + (e > 1 ? sup(e) : '')).join(' × ');
  // 곱으로 적은 분자·분모는 글로 옮길 때만 괄호로 묶인다(기록과 답 줄에 35/(2 × 3 × 7)로 남는다). 화면의 분수에서는 가로줄이 묶어 주므로 괄호가 보이지 않는다.
  const hid = (s) => '<span style="' + SR + '">' + s + '</span>';
  const par = (h) => (/ × /.test(h) ? hid('(') + h + hid(')') : h);
  const ffrac = (n, f, extra) => frac(n, par(fden(f) + (extra ? ' × ' + extra : '')));
  // 소인수분해 한 등식(줄이 바뀌지 않게): 84 = 2² × 3 × 7
  const eqn = (n) => nb(n + ' = ' + fden(fz(n)));
  // 잘못 찍은 점(정수 부분의 숫자, 순환마디의 가운데 숫자)을 그린다. at: 점을 찍을 글자의 자리. 바르게 찍은 표현은 공용 도구 rep 로 적는다.
  const dotAt = (text, at) => '<span style="white-space:nowrap">' + text.split('').map((ch, i) => (at.includes(i) ? '<span class="mb-rdot">' + ch + '</span>' : ch)).join('') + '<span style="' + SR + '">(점을 찍은 숫자 ' + at.map((i) => text[i]).join(', ') + ')</span></span>';
  // 식 한 줄(줄이 바뀌지 않게)
  const row = (h) => '<span style="white-space:nowrap;font-size:1.12rem">' + h + '</span>';
  const x = V('x');

  // ── 검사가 답을 다시 셈하는 식 ──
  // p/q 의 소수점 아래 n번째 자리의 숫자: 나머지에 10을 곱해 q 로 나눈 나머지를 n − 1번 이어 구한 다음, 그 나머지에 10을 곱해 q 로 나눈 몫
  const remJs = (p, q, n) => { let r = `${p}%${q}`; for (let i = 1; i < n; i += 1) r = `(${r})*10%${q}`; return r; };
  const digitJs = (p, q, n) => { const r = remJs(p, q, n); return `((${r})*10-(${r})*10%${q})/${q}`; };
  // 순환마디(숫자열 cyc)의 왼쪽에서 at 번째(0부터 센 자리를 셈하는 식) 숫자
  const cycDigitJs = (cyc, at) => { const c = Number(cyc), e = `(${cyc.length}-1-(${at}))`; return `((${c}-${c}%10**${e})/10**${e})%10`; };
  // 순환소수의 값을 셈하는 식: 순환마디 앞까지의 수 + 순환마디 ÷ (9…90…0). 글에 숫자로 없는 수는 unseen 에 적는다.
  const repDen = (r) => (10 ** r.cyc.length - 1) * 10 ** r.pre.length;
  const repJs = (r) => `(${r.pre ? headOf(r) : r.whole}+${Number(r.cyc)}/${repDen(r)})`;
  const repUnseen = (r) => [repDen(r)].concat(String(Number(r.cyc)) === r.cyc ? [] : [Number(r.cyc)]);
  // 10ⁿ을 곱하면 q 로 나누어떨어지는가(= 유한소수인가)를 보는 틀. 분모의 2와 5의 지수는 6을 넘지 않는다.
  const BIG = 1000000;

  // ── 소수 목록에 쓰는 수 ──
  // 되풀이되는 숫자의 배열이 없는 무한소수(순환소수가 아닌 무한소수)
  const LOOSE = ['0.1010010001…', '0.2020020002…', '0.1211211121…', '0.3433433343…', '1.2122122212…', '0.5055055505…'];
  // 숫자가 되풀이되지만 끝이 있는 유한소수
  const fakeRep = (d) => { const c = d.pick(['6', '3', '34', '25', '47', '776', '183']); return d.int(0, 4) + '.' + (d.bool() ? d.pick(['1', '2', '4', '5']) : '') + c.repeat(c.length === 1 ? 5 : 3); };
  const shortDec = (d) => d.int(0, 9) + '.' + d.until(() => String(d.int(1, 999)), (s) => !s.endsWith('0'));
  const listJ = (rows, pair) => rows.map((r) => r.text).join(', ') + lastJ(rows[rows.length - 1].text, pair);

  // ── 분수 목록에 쓰는 분수 ── { html, p, q }
  const plainRow = (p, q) => ({ html: frac(p, q), p, q });
  const factRow = (n, f) => ({ html: ffrac(n, f), p: n, q: fval(f), f });
  const lowest = (r) => { const g = gcd(r.p, r.q); return [r.p / g, r.q / g]; };
  // 약분한 꼴을 적는 글: 21/(2 × 5 × 7) = 3/(2 × 5)
  const reduceTold = (r) => { const [p, q] = lowest(r); return `${r.html} = ${frac(p, par(fden(fz(q))))}`; };
  const FIN_DENS = [4, 8, 16, 20, 25, 32, 40, 50, 80, 125, 160, 200, 250], INF_DENS = [6, 12, 14, 15, 18, 21, 22, 24, 28, 30, 35, 36, 42, 45, 48, 55, 60, 63, 66, 70, 75, 90];
  const finPlain = (d) => { const q = d.pick(FIN_DENS), p = d.until(() => d.int(3, Math.min(q - 1, 49)), (v) => gcd(v, q) === 1); return plainRow(p, q); };
  const infPlain = (d) => { const q = d.pick(INF_DENS), p = d.until(() => d.int(1, q - 1), (v) => gcd(v, q) === 1); return plainRow(p, q); };
  // 약분하면 유한소수가 되는 분수(21/15, 9/12, 14/35 …)와 약분해도 유한소수가 되지 않는 분수(15/35, 24/45 …)
  const finHidden = (d) => { const [r, q0, p0] = d.until(() => { const k = d.pick([3, 7, 9, 11, 13]), q = d.pick([4, 5, 8, 10, 20, 25, 40]); return [k, q, d.int(1, 2 * q)]; }, ([k, q, v]) => gcd(v, q) === 1 && v % q !== 0 && gcd(v, k) === 1 && v * k <= 99 && q * k <= 200); return plainRow(p0 * r, q0 * r); };
  const infHidden = (d) => { const [k, q0, p0] = d.until(() => { const m = d.pick([2, 3, 4, 5]), q = d.pick([6, 7, 9, 12, 14, 15, 18, 21]); return [m, q, d.int(1, 2 * q)]; }, ([m, q, v]) => gcd(v, q) === 1 && v % q !== 0 && v * m <= 99); return plainRow(p0 * k, q0 * k); };
  // 분모를 소인수분해 한 꼴: 그대로 유한소수 / 2와 5 이외의 소인수가 약분되어 유한소수 / 약분해도 3이 남아 유한소수가 아님 / 처음부터 유한소수가 아님
  const twoFive = (d) => d.until(() => [[2, d.int(0, 3)], [5, d.int(0, 2)]].filter(([, e]) => e > 0), (f) => f.length > 0);
  const sortF = (f) => f.slice().sort((a, b) => a[0] - b[0]);
  const fFin = (d) => { const [num, f] = d.until(() => [d.pick([3, 7, 9, 11, 13]), twoFive(d)], ([v, g]) => fval(g) > v); return factRow(num, f); };
  const fFinCancel = (d) => { const r = d.pick([3, 7, 11, 13]), m = d.pick([1, 2, 3, 5].filter((v) => v !== r)); return factRow(r * m, sortF(twoFive(d).concat([[r, 1]]))); };
  const fFinSquare = (d) => { const m = d.pick([1, 2, 4, 5, 7]); return factRow(9 * m, sortF(twoFive(d).concat([[3, 2]]))); };
  const fInfPartial = (d) => (d.bool()
    ? factRow(3 * d.pick([1, 2, 4, 5, 7]), sortF(twoFive(d).concat([[3, 2]])))
    : (() => { const r = d.pick([7, 11, 13]); return factRow(r * d.pick([1, 2, 5]), sortF(twoFive(d).concat([[3, 1], [r, 1]]))); })());
  const fInf = (d) => factRow(d.pick([1, 7, 11, 13]), sortF(twoFive(d).concat([[d.pick([3, 7]), 1]])));
  const distinctRows = (rows) => new Set(rows.map((r) => r.html)).size === rows.length && new Set(rows.map((r) => r.p / r.q)).size === rows.length && rows.every((r) => r.p % r.q !== 0);

  // ── 참·거짓을 가리는 문장 ──
  const TERMS = [
    ['유한소수', '소수점 아래에 0이 아닌 숫자가 유한 번 나타나는 소수'],
    ['무한소수', '소수점 아래에 0이 아닌 숫자가 무한 번 나타나는 소수'],
    ['순환소수', '소수점 아래의 어떤 자리에서부터 일정한 숫자의 배열이 한없이 되풀이되는 무한소수'],
    ['순환마디', '순환소수의 소수점 아래에서 숫자의 배열이 되풀이되는 가장 짧은 한 부분']
  ];

  B.addUnit({
    id: '8-1-1', grade: 8, semester: 1, no: 1, title: '유리수와 순환소수', version: 1,
    groups: [
      {
        id: 'kinds', title: '유한소수와 무한소수', standard: STD,
        types: [
          T('kinds-count', '소수 목록에서 무한소수(유한소수)의 개수 세기', '①4', (d) => {
            // 숫자가 되풀이되어도 끝이 있으면 유한소수이다(0.776776776). 「…」이 붙은 것만 끝없이 이어진다.
            const ask = d.bool(), nRep = d.int(1, 2), nLoose = 1, nFake = 2, nShort = 6 - nRep - nLoose - nFake;
            const rows = d.until(() => d.shuffle([].concat(
              range(1, nRep).map(() => ({ text: unrollOf(pickRep(d, { whole: [0, 4], f: d.int(0, 1), k: d.int(1, 2) })), inf: true })),
              d.shuffle(LOOSE).slice(0, nLoose).map((text) => ({ text, inf: true })),
              range(1, nFake).map(() => ({ text: fakeRep(d), inf: false, fake: true })),
              range(1, nShort).map(() => ({ text: shortDec(d), inf: false }))
            )), (list) => new Set(list.map((r) => r.text.replace('…', '').slice(0, 5))).size === 6);
            const hit = rows.filter((r) => r.inf === ask), fakes = rows.filter((r) => r.fake), infs = rows.filter((r) => r.inf);
            return N(`다음 소수 가운데 ${ask ? '무한소수' : '유한소수'}는 모두 몇 개인가?`, hit.length, {
              unit: '개', figure: numbers(rows.map((r) => r.text)),
              explain: `${listJ(fakes, '은/는')} 같은 숫자가 되풀이되지만 끝이 있으므로 유한소수이다. 소수점 아래의 숫자가 끝없이 이어지는 ${listJ(infs, '이/가')} 무한소수이다. ${ask ? '무한소수' : '유한소수'}는 ${hit.map((r) => r.text).join(', ')}의 ${hit.length}개이다.`,
              facts: { count: rows.map((r) => r.inf === ask) }
            });
          }),
          T('kinds-divide', '분수를 소수로 나타내고 유한소수인지 무한소수인지 말하기', '①5', (d) => {
            // 틀린 보기: 소수는 맞지만 이름을 거꾸로 댄 것, 나누다가 멈춘 것, 되풀이되는 숫자를 잘못 잡은 것(유한소수를 되풀이되는 수로 여긴 것)
            const inf = d.bool();
            const [p, q] = inf ? d.pick([[5, 6], [7, 6], [4, 15], [7, 12], [5, 18], [11, 12], [7, 15], [13, 6], [11, 18]]) : d.pick([[3, 8], [5, 8], [7, 8], [9, 8], [7, 20], [9, 25], [13, 40], [11, 20], [9, 40], [7, 16]]);
            const e = expand(p, q), shown = inf ? unrollOf(e) : decText(e), FI = '유한소수', IN = '무한소수';
            const rows = d.shuffle(inf
              ? [[shown, IN, true], [shown, FI], [headOf(e) + e.cyc, FI], [unroll(e.whole + '.', e.pre + e.cyc), IN]]
              : [[shown, FI, true], [shown, IN], [shown.slice(0, -1), FI], [unroll(e.whole + '.', e.pre), IN]]);
            return C(`${fj(p, q, '을/를')} 소수로 나타내고, 유한소수인지 무한소수인지 바르게 말한 것은?`, rows.map((r) => `${r[0]}, ${r[1]}`), rows.findIndex((r) => r[2]), {
              explain: inf
                ? `${p} ÷ ${q} = ${shown}${lastJ(shown, '으로/로')} 나누어떨어지지 않고 ${e.cyc}${lastJ(e.cyc, '이/가')} 한없이 되풀이된다. 소수점 아래에 0이 아닌 숫자가 무한 번 나타나므로 무한소수이다.`
                : `${p} ÷ ${q} = ${decJ(shown, '으로/로')} 나누어떨어진다. 소수점 아래에 0이 아닌 숫자가 유한 번 나타나므로 유한소수이다.`,
              facts: { truth: rows.map((r) => Boolean(r[2])), want: true }
            });
          }),
          T('kinds-claims', '분수와 소수 하나하나에 대한 설명의 참·거짓', '①6', (d) => {
            const wantTrue = d.bool();
            const [fp, fq] = d.pick([[21, 8], [13, 20], [7, 40], [9, 25], [3, 16]]), [ip, iq] = d.pick([[17, 6], [5, 12], [7, 15], [8, 11], [4, 9]]), [rp, rq] = d.pick([[5, 3], [9, 4], [11, 7], [8, 5]]);
            const r = pickRep(d, { whole: [0, 3], k: 3 }), w = unrollOf(r), fake = fakeRep(d), fe = expand(fp, fq), ie = expand(ip, iq);
            const yes = [
              `${fj(rp, rq, '은/는')} 유리수이다.`, `${w}${lastJ(w, '은/는')} 무한소수이다.`, `${fj(ip, iq, '을/를')} 소수로 나타내면 무한소수이다.`,
              `${fj(fp, fq, '을/를')} 소수로 나타내면 유한소수이다.`, `${decJ(fake, '은/는')} 유한소수이다.`
            ];
            const no = [
              [`${fj(rp, rq, '은/는')} 유리수가 아니다.`, `${fj(rp, rq, '은/는')} 분자와 분모가 정수이고 분모가 0이 아닌 분수이므로 유리수이다.`, yes[0]],
              [`${w}${lastJ(w, '은/는')} 유한소수이다.`, `${w}${lastJ(w, '은/는')} 소수점 아래의 숫자가 끝없이 이어지므로 무한소수이다.`, yes[1]],
              [`${fj(ip, iq, '을/를')} 소수로 나타내면 유한소수이다.`, `${ip} ÷ ${iq} = ${unrollOf(ie)}이므로 ${fj(ip, iq, '을/를')} 소수로 나타내면 무한소수이다.`, yes[2]],
              [`${fj(fp, fq, '을/를')} 소수로 나타내면 무한소수이다.`, `${fp} ÷ ${fq} = ${decText(fe)}이므로 ${fj(fp, fq, '을/를')} 소수로 나타내면 유한소수이다.`, yes[3]],
              [`${decJ(fake, '은/는')} 무한소수이다.`, `${decJ(fake, '은/는')} 같은 숫자가 되풀이되지만 끝이 있으므로 유한소수이다.`, yes[4]]
            ];
            return claimQ(d, `분수와 소수에 대한 다음 설명 가운데 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, yes, no, wantTrue);
          })
        ]
      },
      {
        id: 'cycle', title: '순환소수와 순환마디', standard: STD,
        types: [
          T('cycle-terms', '뜻을 보고 알맞은 말 고르기', '①7', (d) => {
            const [word, meaning] = d.pick(TERMS), names = d.shuffle(TERMS.map((t) => t[0]));
            return C(`${meaning}${josa(meaning.slice(-1), '을/를').slice(1)} 무엇이라고 하는가?`, names, names.indexOf(word), {
              explain: `${meaning}${josa(meaning.slice(-1), '을/를').slice(1)} ${josa(word, '이라고/라고')} 한다.`,
              facts: { truth: names.map((n) => n === word), want: true }
            });
          }),
          T('cycle-find', '풀어 쓴 순환소수의 순환마디 구하기', '①8', (d, n) => {
            // 첫째는 순환마디가 0으로 시작하지 않는 수(수 칸), 둘째는 순환마디가 0으로 시작하는 수(고르기 — 0을 빼거나 한 칸 밀어 잡은 것, 두 번 적은 것이 틀린 보기)이다.
            if (n === 0) {
              const r = pickRep(d, { whole: [0, 9], f: d.int(0, 2), k: d.int(1, 3), ok: (v) => v.cyc[0] !== '0' }), k = r.cyc.length;
              // 검사: 글에 적힌 소수점 아래 숫자열(수 D)에서 순환하지 않는 자리 뒤의 k자리를 잘라 낸다.
              const shownDigits = r.pre + r.cyc.repeat(3), D = Number(shownDigits), cut = shownDigits.length - r.pre.length - k;
              return N(`순환소수 ${unrollOf(r)}의 순환마디는?`, Number(r.cyc), {
                explain: `${r.pre ? `소수점 아래 ${ORD[r.pre.length + 1]}째 자리부터 ` : '소수점 아래에서 '}${r.cyc}${lastJ(r.cyc, '이/가')} 한없이 되풀이된다. 되풀이되는 가장 짧은 부분은 ${r.cyc}${k === 1 ? '' : `(숫자 ${k}개)`}이므로 순환마디는 ${r.cyc}이다.`,
                facts: { calc: [[`((${D}-${D}%10**${cut})/10**${cut})%10**${k}`, 0]], unseen: [10, cut, k].concat(String(D) === shownDigits ? [] : [D]), rule: 'cycle-find-number' }
              });
            }
            const r = pickRep(d, { whole: [0, 9], f: d.int(0, 1), k: d.int(2, 3), ok: (v) => v.cyc[0] === '0' && v.cyc[1] !== '0' }), c = r.cyc;
            const rows = d.shuffle([c, c.slice(1), c.slice(1) + c[0], c + c]);
            return C(`순환소수 ${unrollOf(r)}의 순환마디는?`, rows, rows.indexOf(c), {
              explain: `${r.pre ? `소수점 아래 ${ORD[r.pre.length + 1]}째 자리부터 ` : '소수점 아래에서 '}${c.split('').join(', ')}${lastJ(c, '이/가')} 이 차례로 한없이 되풀이된다. 0도 순환마디에 드는 숫자이므로 순환마디는 ${c}이다.`,
              facts: { truth: rows.map((v) => v === c), want: true, rule: 'cycle-find-zero' }
            });
          }, { count: 2 }),
          T('cycle-match', '순환소수와 순환마디를 바르게 짝 지은 것 고르기', '①9', (d) => {
            // 틀린 짝: 순환마디를 두 번 적은 것, 한 칸 밀어 잡은 것, 한 숫자 더 길게 잡은 것, 정수 부분의 숫자부터 잡은 것, 순환하지 않는 자리의 숫자를 넣은 것
            const pair = (r, said, ok) => ({ text: `${unrollOf(r)} → ${said}`, ok, why: `${unrollOf(r)}의 순환마디는 ${r.cyc}이다.` });
            const right = [
              () => { const r = pickRep(d, { f: 1, k: 2 }); return pair(r, r.cyc, true); },
              () => { const r = pickRep(d, { k: 2, ok: (v) => v.cyc[1] !== '0' }); return pair({ whole: Number(r.cyc[1] + r.cyc[0]), pre: '', cyc: r.cyc }, r.cyc, true); },
              () => { const r = pickRep(d, { whole: [0, 3], k: 3 }); return pair(r, r.cyc, true); }
            ];
            const wrong = [
              () => { const r = pickRep(d, { f: 1, k: 1 }); return pair(r, r.cyc + r.cyc, false); },
              () => { const r = pickRep(d, { k: 2 }); return pair(r, r.cyc[1] + r.cyc[0], false); },
              () => { const r = pickRep(d, { k: 3 }); return pair(r, r.cyc + r.cyc[0], false); },
              () => { const r = pickRep(d, { whole: [1, 9], k: 3, ok: (v) => String(v.whole) !== v.cyc[2] }); return pair(r, r.whole + r.cyc.slice(0, 2), false); },
              () => { const r = pickRep(d, { f: 1, k: 2 }); return pair(r, r.pre + r.cyc, false); }
            ];
            const rows = d.until(() => d.shuffle([d.pick(right)()].concat(d.shuffle(wrong).slice(0, 4).map((make) => make()))), (list) => new Set(list.map((r) => r.text.split(' → ')[0])).size === 5);
            return C('다음 중 순환소수와 그 순환마디를 바르게 짝 지은 것은?', rows.map((r) => r.text), rows.findIndex((r) => r.ok), {
              explain: `순환마디는 소수점 아래에서 숫자의 배열이 되풀이되는 가장 짧은 한 부분이다. ${rows.filter((r) => !r.ok).map((r) => r.why).join(' ')}`,
              facts: { truth: rows.map((r) => r.ok), want: true }
            });
          }),
          T('cycle-dot-pick', '순환소수를 점을 찍어 나타낸 것 고르기', '①8·11', (d) => {
            // 틀린 보기: 정수 부분의 숫자에 점, 순환마디의 모든 숫자에 점, 순환마디를 한 칸 밀어 잡음, 앞의 두 숫자만 순환마디로 잡음
            const r = pickRep(d, { whole: [1, 9], k: 3, ok: (v) => new Set(v.cyc).size === 3 && !v.cyc.includes(String(v.whole)) }), c = r.cyc, w = r.whole + '.';
            const right = rep(w, c), rows = d.shuffle([right, dotAt(w + c.slice(0, 2), [0, 3]), dotAt(w + c, [2, 3, 4]), rep(w + c[0], c.slice(1) + c[0]), rep(w, c.slice(0, 2))]);
            return C(`순환소수 ${unJ(r, '을/를')} 순환마디에 점을 찍어 간단히 나타낸 것은?`, rows, rows.indexOf(right), {
              explain: `소수점 아래에서 ${c}${lastJ(c, '이/가')} 한없이 되풀이되므로 순환마디는 ${c}이다. 순환마디의 양 끝의 숫자 ${c[0]}${tail(Number(c[0]), '과/와')} ${c[2]} 위에 점을 찍어 ${right}${lastJ(c, '으로/로')} 나타낸다. 정수 부분의 숫자에는 점을 찍지 않는다.`,
              facts: { truth: rows.map((v) => v === right), want: true }
            });
          }),
          T('cycle-dot-claims', '점을 찍어 나타낸 것이 옳은(옳지 않은) 것 고르기', '①10 심1', (d) => {
            // 틀린 표현: 정수 부분에 점(1.212121… = 1̇.2̇), 한 칸 밀어 잡음(0.303030… = 0.30̇3̇), 순환마디를 두 번(1.3̇72372̇), 가운데 숫자에도 점(0.5̇2̇3̇),
            //  순환하지 않는 자리를 순환마디에(0.1666… = 0.1̇6̇), 가장 짧게 잡지 않음(0.333… = 0.3̇3̇)
            const wantTrue = d.bool(), line = (r, shown, fix) => ({ text: `${unrollOf(r)} = ${shown}`, key: unrollOf(r), ok: !fix, why: fix ? `${unrollOf(r)}의 순환마디는 ${r.cyc}이므로 ${repJ(r, '으로/로')} 나타낸다.` : '' });
            const right = [
              () => { const r = pickRep(d, { f: 1, k: 1 }); return line(r, repOf(r)); },
              () => { const r = pickRep(d, { whole: [0, 5], k: 2, ok: (v) => v.cyc.includes('0') }); return line(r, repOf(r)); },
              () => { const r = pickRep(d, { whole: [1, 5], k: 3 }); return line(r, repOf(r)); },
              () => { const r = pickRep(d, { f: 1, k: 3 }); return line(r, repOf(r)); }
            ];
            const wrong = [
              () => { const r = pickRep(d, { whole: [1, 9], k: 2, ok: (v) => v.cyc[1] === String(v.whole) }); return line(r, dotAt(r.whole + '.' + r.cyc[0], [0, 2]), true); },
              () => { const r = pickRep(d, { k: 2 }); return line(r, rep('0.' + r.cyc[0], r.cyc[1] + r.cyc[0]), true); },
              () => { const r = pickRep(d, { whole: [1, 5], k: 3 }); return line(r, rep(r.whole + '.', r.cyc + r.cyc), true); },
              () => { const r = pickRep(d, { k: 3 }); return line(r, dotAt('0.' + r.cyc, [2, 3, 4]), true); },
              () => { const r = pickRep(d, { f: 1, k: 1 }); return line(r, rep('0.', r.pre + r.cyc), true); },
              () => { const r = pickRep(d, { k: 1 }); return line(r, rep('0.', r.cyc + r.cyc), true); }
            ];
            const rows = d.until(() => d.shuffle(d.shuffle(right).slice(0, wantTrue ? 1 : 4).concat(d.shuffle(wrong).slice(0, wantTrue ? 4 : 1)).map((make) => make())), (list) => new Set(list.map((r) => r.key)).size === 5);
            return C(`순환소수를 점을 찍어 나타낸 것으로 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, rows.map((r) => r.text), rows.findIndex((r) => r.ok === wantTrue), {
              explain: `순환마디는 소수점 아래에서 되풀이되는 가장 짧은 부분이고, 점은 순환마디의 양 끝의 숫자 위에만 찍는다. ${rows.filter((r) => !r.ok).map((r) => r.why).join(' ')}`,
              facts: { truth: rows.map((r) => r.ok), want: wantTrue }
            });
          }),
          T('cycle-count', '소수 목록에서 순환소수의 개수 세기', '①12', (d) => {
            // 끝이 있는 소수(0.343434)는 유한소수이고, 되풀이되는 숫자의 배열이 없는 무한소수(0.1010010001…)는 순환소수가 아니다.
            const nRep = d.int(2, 3), nShort = 4 - nRep;
            const rows = d.until(() => d.shuffle([].concat(
              range(1, nRep).map(() => ({ text: unrollOf(pickRep(d, { whole: [0, 6], f: d.int(0, 2), k: d.int(1, 2) })), rep: true })),
              [{ text: d.pick(LOOSE), rep: false, loose: true }, { text: fakeRep(d), rep: false, fake: true }],
              range(1, nShort).map(() => ({ text: shortDec(d), rep: false }))
            )), (list) => new Set(list.map((r) => r.text.replace('…', '').slice(0, 5))).size === 6);
            const hit = rows.filter((r) => r.rep), fake = rows.find((r) => r.fake), loose = rows.find((r) => r.loose);
            return N('다음 소수 가운데 순환소수는 모두 몇 개인가?', hit.length, {
              unit: '개', figure: numbers(rows.map((r) => r.text)),
              explain: `${decJ(fake.text, '은/는')} 끝이 있는 유한소수이고, ${decJ(loose.text, '은/는')} 되풀이되는 숫자의 배열이 없으므로 순환소수가 아닌 무한소수이다. 순환소수는 ${hit.map((r) => r.text).join(', ')}의 ${hit.length}개이다.`,
              facts: { count: rows.map((r) => r.rep) }
            });
          }),
          T('cycle-frac-dot', '분수를 순환소수로 나타낸 것 고르기', '①13 심3', (d) => {
            // 틀린 보기: 순환하지 않는 자리의 숫자까지 순환마디로 잡은 것(0.8̇3̇), 나누다가 멈춘 것(0.83), 엉뚱한 숫자에 점을 찍은 것(0.8̇3)
            const { p, q, e } = pickFrac(d, [6, 12, 15, 18, 22, 30, 45, 55], (v) => v.e.pre.length === 1 && v.e.cyc.length <= 2 && okRep(v.e.pre, v.e.cyc), 2), h = headOf(e);
            const right = rep(h, e.cyc), rows = d.shuffle([right, rep(e.whole + '.', e.pre + e.cyc), h + e.cyc, dotAt(h + e.cyc, [2])]);
            return C(`${fj(p, q, '을/를')} 순환소수로 나타낸 것은?`, rows, rows.indexOf(right), {
              explain: `${p} ÷ ${q} = ${unrollOf(e)}이다. 소수점 아래 둘째 자리부터 ${e.cyc}${lastJ(e.cyc, '이/가')} 한없이 되풀이되므로 순환마디는 ${e.cyc}이고, ${right}${lastJ(e.cyc, '으로/로')} 나타낸다.`,
              facts: { truth: rows.map((v) => v === right), want: true }
            });
          }),
          T('cycle-frac-find', '분수를 소수로 나타낼 때의 순환마디 구하기', '①14 심2', (d) => {
            // 순환하지 않는 자리의 숫자(11/6 = 1.8333…의 8)는 순환마디가 아니다.
            const { p, q, e } = pickFrac(d, [6, 11, 12, 15, 18, 22, 27, 33, 37, 45], (v) => v.e.cyc[0] !== '0' && v.e.cyc.length <= 3 && (v.e.pre || v.e.cyc.length >= 2), 3), f = e.pre.length, k = e.cyc.length;
            return N(`${fj(p, q, '을/를')} 소수로 나타낼 때, 순환마디는?`, Number(e.cyc), {
              explain: `${p} ÷ ${q} = ${unrollOf(e)}이다. ${f ? `소수점 아래 ${ORD[f + 1]}째 자리부터 ` : '소수점 아래에서 '}${e.cyc}${lastJ(e.cyc, '이/가')} 한없이 되풀이되므로 순환마디는 ${e.cyc}이다.`,
              facts: { calc: [[`(${p}*10**${f + k}-(${p}*10**${f + k})%${q})/${q}-((${p}*10**${f}-(${p}*10**${f})%${q})/${q})*10**${k}`, 0]], unseen: [10, f, k, f + k] }
            });
          }),
          T('cycle-length', '순환마디를 이루는 숫자의 개수', '①15', (d, n) => {
            // 첫째는 순환마디의 숫자의 개수, 둘째는 순환마디의 숫자의 개수와 순환마디에 들지 않는 숫자의 개수를 따로 묻는다.
            if (n === 0) {
              const { p, q, e } = pickFrac(d, [7, 11, 13, 27, 33, 37], (v) => v.e.cyc.length >= 2, 2), k = e.cyc.length;
              return N(`${fj(p, q, '을/를')} 소수로 나타낼 때, 순환마디를 이루는 숫자는 모두 몇 개인가?`, k, {
                unit: '개', explain: `${p} ÷ ${q} = ${headOf(e) + e.cyc.repeat(k >= 6 ? 2 : 3)}…이다. 순환마디는 ${e.cyc}이므로 순환마디를 이루는 숫자는 ${k}개이다.`,
                facts: { digit: { template: `(10**□-1)%${q}<1`, lo: 1, hi: 7, ask: 'min' } }
              });
            }
            const { p, q, e } = pickFrac(d, [12, 22, 24, 36, 44, 55, 66, 88], (v) => v.e.pre.length >= 1 && v.e.cyc.length <= 2 && v.e.pre.length !== v.e.cyc.length && okRep(v.e.pre, v.e.cyc)), f = e.pre.length, k = e.cyc.length;
            return M(`${fj(p, q, '을/를')} 소수로 나타낼 때, 순환마디를 이루는 숫자의 개수 ㉠과 소수점 아래에서 순환마디에 들지 않는 숫자의 개수 ㉡은?`, [{ label: LAB[0], answer: k, unit: '개' }, { label: LAB[1], answer: f, unit: '개' }], {
              explain: `${p} ÷ ${q} = ${unrollOf(e)}이므로 ${frac(p, q)} = ${repOf(e)}이다. 순환마디는 ${e.cyc}이므로 ㉠은 ${k}이고, 소수점 아래에서 순환마디에 들지 않는 숫자는 ${e.pre.split('').join(', ')}이므로 ㉡은 ${f}이다.`,
              facts: { calc: [[String(k), 0], [String(f), 1]], unseen: [k, f] }
            });
          }, { count: 2 }),
          T('cycle-claims', '순환마디와 점을 찍는 방법에 대한 설명의 참·거짓', '①17', (d) => {
            const wantTrue = d.bool(), a = pickRep(d, { whole: [1, 9], k: 3, ok: (v) => String(v.whole) !== v.cyc[2] }), b = pickRep(d, { k: 3 }), c = pickRep(d, { f: 1, k: 1 }), one = d.int(1, 8);
            const yes = [
              '순환마디는 소수점 아래에서 숫자의 배열이 되풀이되는 가장 짧은 한 부분이다.', '순환소수는 순환마디의 양 끝의 숫자 위에 점을 찍어 나타낸다.',
              `${unrollOf(a)}의 순환마디는 ${a.cyc}이다.`, `${unJ(b, '은/는')} ${repJ(b, '으로/로')} 나타낸다.`, `0.${String(one).repeat(3)}…의 순환마디를 이루는 숫자는 1개이다.`, `${unrollOf(c)}의 순환마디는 소수점 아래 둘째 자리에서 시작한다.`
            ];
            const no = [
              ['순환소수는 순환마디의 모든 숫자 위에 점을 찍어 나타낸다.', '점은 순환마디의 양 끝의 숫자 위에만 찍는다.', yes[1]],
              [`${unrollOf(a)}의 순환마디는 ${a.whole + a.cyc.slice(0, 2)}이다.`, `순환마디는 소수점 아래에서 찾는다. ${unrollOf(a)}의 순환마디는 ${a.cyc}이다.`, yes[2]],
              [`${unJ(b, '은/는')} ${rep('0.' + b.cyc.slice(0, 2), b.cyc[2] + b.cyc[0])}${tail(Number(b.cyc[0]), '으로/로')} 나타낸다.`, `${unrollOf(b)}에서 되풀이되는 가장 짧은 부분은 ${b.cyc}이므로 ${repJ(b, '으로/로')} 나타낸다.`, yes[3]],
              ['순환소수의 순환마디는 2개 이상의 숫자로 이루어져 있다.', `0.${String(one).repeat(3)}…의 순환마디는 ${one}이고, 숫자 1개로 이루어져 있다.`, yes[4]],
              ['순환마디는 항상 소수점 아래 첫째 자리에서 시작한다.', `${unrollOf(c)}의 순환마디 ${c.cyc}${lastJ(c.cyc, '은/는')} 소수점 아래 둘째 자리에서 시작한다.`, yes[5]]
            ];
            return claimQ(d, `순환마디와 순환소수의 표현에 대한 설명으로 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, yes, no, wantTrue);
          })
        ]
      },
      {
        id: 'nth', title: '소수점 아래 n번째 자리의 숫자', standard: STD,
        types: [
          T('nth-pure', '순환소수의 소수점 아래 n번째 자리의 숫자', '①18', (d) => {
            const r = pickRep(d, { k: d.pick([2, 3, 3, 4]) }), k = r.cyc.length, n = d.until(() => d.int(15, 99), (v) => repDigit('0.', r.cyc, v) !== 0), m = n % k, digit = repDigit('0.', r.cyc, n);
            return N(`순환소수 ${repOf(r)}의 소수점 아래 ${n}번째 자리의 숫자는?`, digit, {
              explain: `순환마디를 이루는 숫자는 ${r.cyc.split('').join(', ')}의 ${k}개이다. ${nb(`${n} = ${k} × ${Math.floor(n / k)}${m ? ` + ${m}` : ''}`)}이므로 소수점 아래 ${n}번째 자리의 숫자는 순환마디의 ${m ? m + '번째' : '마지막'} 숫자인 ${digit}이다.`,
              facts: { calc: [[cycDigitJs(r.cyc, `(${n}-1)%${k}`), 0]], unseen: [1, 10, k, Number(r.cyc)], rule: 'nth-pure' }
            });
          }),
          T('nth-frac', '분수를 소수로 나타낼 때 소수점 아래 n번째 자리의 숫자', '①19 심5', (d) => {
            const { p, q, e } = pickFrac(d, [7, 11, 13, 27, 37], (v) => v.e.cyc.length >= 2, 2), k = e.cyc.length;
            const n = d.until(() => d.int(20, 100), (v) => repDigit(headOf(e), e.cyc, v) !== 0), m = n % k, digit = repDigit(headOf(e), e.cyc, n);
            return N(`${fj(p, q, '을/를')} 소수로 나타낼 때, 소수점 아래 ${n}번째 자리의 숫자는?`, digit, {
              explain: `${p} ÷ ${q}${tail(q, '을/를')} 계산하면 ${frac(p, q)} = ${repOf(e)}이다. 순환마디를 이루는 숫자는 ${k}개이고 ${nb(`${n} = ${k} × ${Math.floor(n / k)}${m ? ` + ${m}` : ''}`)}이므로 소수점 아래 ${n}번째 자리의 숫자는 순환마디의 ${m ? m + '번째' : '마지막'} 숫자인 ${digit}이다.`,
              facts: { calc: [[digitJs(p, q, n), 0]], unseen: [10], rule: 'nth-frac-pure' }
            });
          }),
          T('nth-mixed', '순환하지 않는 자리가 있는 순환소수의 소수점 아래 n번째 자리의 숫자', '①20 심6', (d, at) => {
            // 순환마디는 소수점 아래 첫째 자리가 아니라 그 뒤에서 시작한다. n 을 그대로 순환마디의 길이로 나누면 다른 숫자가 나오는 수만 고른다.
            // 첫째는 점을 찍은 순환소수로, 둘째는 분수로 준다(나눗셈부터 한다).
            const told = (pre, cyc, n) => {
              const f = pre.length, k = cyc.length, rest = n - f, m = rest % k;
              return `소수점 아래 ${f === 1 ? `첫째 자리의 숫자 ${pre}${lastJ(pre, '은/는')}` : `둘째 자리까지의 숫자 ${pre.split('').join(', ')}${lastJ(pre, '은/는')}`} 순환마디에 들지 않고, 순환마디 ${cyc}${lastJ(cyc, '은/는')} 소수점 아래 ${ORD[f + 1]}째 자리부터 되풀이된다. ${nb(`${n} − ${f} = ${rest}`)}이고 ${nb(`${rest} = ${k} × ${Math.floor(rest / k)}${m ? ` + ${m}` : ''}`)}이므로 소수점 아래 ${n}번째 자리의 숫자는 순환마디의 ${m ? m + '번째' : '마지막'} 숫자인 ${cyc[(rest - 1) % k]}이다.`;
            };
            const trap = (pre, cyc, n) => { const f = pre.length, k = cyc.length, digit = Number(cyc[(n - f - 1) % k]); return digit !== 0 && digit !== Number(cyc[(n - 1) % k]); };
            if (at === 0) {
              const [f, k] = d.pick([[1, 2], [1, 3], [2, 3]]), r = pickRep(d, { whole: [0, 5], f, k, ok: (v) => new Set(v.cyc).size >= 2 }), n = d.until(() => d.int(20, 99), (v) => trap(r.pre, r.cyc, v));
              return N(`순환소수 ${repOf(r)}의 소수점 아래 ${n}번째 자리의 숫자는?`, repDigit(headOf(r), r.cyc, n), {
                explain: told(r.pre, r.cyc, n),
                facts: { calc: [[cycDigitJs(r.cyc, `(${n}-${f}-1)%${k}`), 0]], unseen: [1, 10, f, k, Number(r.cyc)], rule: 'nth-rep-mixed' }
              });
            }
            const { p, q, e } = pickFrac(d, [22, 54, 55, 66, 74, 110], (v) => v.e.pre.length >= 1 && v.e.pre.length <= 2 && v.e.cyc.length >= 2 && v.e.cyc.length <= 3 && v.e.pre.length % v.e.cyc.length !== 0), n = d.until(() => d.int(20, 99), (v) => trap(e.pre, e.cyc, v));
            return N(`${fj(p, q, '을/를')} 소수로 나타낼 때, 소수점 아래 ${n}번째 자리의 숫자는?`, repDigit(headOf(e), e.cyc, n), {
              explain: `${p} ÷ ${q} = ${unrollOf(e)}이므로 ${frac(p, q)} = ${repOf(e)}이다. ${told(e.pre, e.cyc, n)}`,
              facts: { calc: [[digitJs(p, q, n), 0]], unseen: [10], rule: 'nth-frac-mixed' }
            });
          }, { count: 2 })
        ]
      },
      {
        id: 'finite', title: '유한소수로 나타낼 수 있는 분수', standard: STD,
        types: [
          T('finite-rule-blank', '유한소수로 나타낼 수 있는 분수의 조건', '①7', () => M(`기약분수의 분모를 소인수분해 했을 때 소인수가 ${box()} 또는 ${box()}뿐이면 그 분수는 유한소수로 나타낼 수 있다. □에 알맞은 두 수는?`, [{ answer: 2 }, { answer: 5 }], {
            unordered: true,
            explain: `유한소수는 분모가 10의 거듭제곱인 분수로 나타낼 수 있다. ${nb('10 = 2 × 5')}이므로 기약분수의 분모의 소인수가 2 또는 5뿐이면 분모를 10의 거듭제곱으로 고칠 수 있다.`,
            facts: { calc: [['2', 0], ['5', 1]], unseen: [2, 5] }
          })),
          T('finite-pow10-blank', '분모를 10의 거듭제곱으로 고치는 과정의 빈칸', '①22 심12', (d, n) => {
            // 첫째는 기약분수(모자란 2나 5를 곱한다), 둘째는 약분부터 해야 하는 분수이다.
            const [a, b] = d.until(() => [d.int(0, 3), d.int(0, 3)], ([i, j]) => i !== j && i + j >= 2 && Math.max(i, j) >= 2), e = Math.max(a, b), f = [[2, a], [5, b]].filter(([, v]) => v > 0), q = fval(f);
            const mul = 10 ** e / q, ten = `10${sup(e)}`, eq = ' <i>=</i> ';
            if (n === 0) {
              const p = d.until(() => d.int(3, 19), (v) => gcd(v, 10) === 1 && v < q);
              return ruled(M(`다음은 ${frac(p, q)}의 분모를 10의 거듭제곱으로 고치는 과정이다. ㉠, ㉡에 알맞은 수는?`, [{ label: LAB[0], answer: mul }, { label: LAB[1], answer: p * mul }], {
                figure: lines([row(frac(p, q) + eq + ffrac(p, f)), row(eq + frac(par(`${p} × ${box(LAB[0])}`), par(`${fden(f)} × ${box(LAB[0])}`)) + eq + frac(box(LAB[1]), ten))]),
                explain: `분모 ${fden(f)}에 ${mul}${tail(mul, '을/를')} 곱하면 10${sup(e)}이 된다. 분자에도 ${mul}${tail(mul, '을/를')} 곱하면 ${p} × ${mul} = ${p * mul}이므로 ㉠은 ${mul}, ㉡은 ${p * mul}이다. ${frac(p, q)} = ${frac(p * mul, 10 ** e)} = ${p * mul / 10 ** e}이다.`,
                facts: { calc: [[`10**${e}/${q}`, 0], [`${p}*10**${e}/${q}`, 1]] }
              }), 'finite-pow10-plain');
            }
            const p = d.until(() => d.int(3, 13), (v) => gcd(v, 10) === 1 && v < q), g = d.pick([3, 7]);
            return ruled(M(`다음은 ${frac(p * g, q * g)}의 분모를 10의 거듭제곱으로 고치는 과정이다. ㉠, ㉡, ㉢에 알맞은 수는?`, [{ label: LAB[0], answer: p }, { label: LAB[1], answer: mul }, { label: LAB[2], answer: p * mul }], {
              figure: lines([row(frac(p * g, q * g) + eq + ffrac(box(LAB[0]), f)), row(eq + frac(par(`${box(LAB[0])} × ${box(LAB[1])}`), par(`${fden(f)} × ${box(LAB[1])}`)) + eq + frac(box(LAB[2]), ten))]),
              explain: `분자와 분모를 ${g}${tail(g, '으로/로')} 나누어 약분하면 ${frac(p * g, q * g)} = ${ffrac(p, f)}이므로 ㉠은 ${p}이다. 분모에 ${mul}${tail(mul, '을/를')} 곱하면 10${sup(e)}이 되므로 ㉡은 ${mul}이고, ㉢은 ${p} × ${mul} = ${p * mul}이다. ${frac(p * g, q * g)} = ${frac(p * mul, 10 ** e)} = ${p * mul / 10 ** e}이다.`,
              facts: { calc: [[`${p * g}/(${q * g}/(${f.map(([b0, e0]) => `${b0}**${e0}`).join('*')}))`, 0], [`10**${e}/(${f.map(([b0, e0]) => `${b0}**${e0}`).join('*')})`, 1], [`${p * g}*10**${e}/${q * g}`, 2]], unseen: [1] }
            }), 'finite-pow10-reduce');
          }, { count: 2 }),
          T('finite-pow10-least', '분모가 10의 거듭제곱인 분수로 고칠 때 가장 작은 분자와 지수', '①24 심13', (d, n) => {
            // 첫째는 기약분수, 둘째는 약분부터 해야 하는 분수이다(약분하지 않으면 분모의 3이나 7 때문에 10의 거듭제곱으로 고칠 수 없다).
            const [a, b] = d.until(() => [d.int(0, 3), d.int(0, 3)], ([i, j]) => i !== j && i + j >= 2), e = Math.max(a, b), q = 2 ** a * 5 ** b, p0 = d.until(() => d.int(3, 19), (v) => gcd(v, 10) === 1 && v < q), g = n === 0 ? 1 : d.pick([3, 7, 9]);
            const p = p0 * g, Qd = q * g, top = p0 * 10 ** e / q, va = V('a'), vn = V('n'), form = frac(va, '10' + sup(vn));
            return ruled(M(`${fj(p, Qd, '을/를')} ${form} 꼴로 고쳐서 유한소수로 나타내려고 한다. 가장 작은 자연수 ${vn}의 값과 그때의 자연수 ${va}의 값은?`, [{ label: vn, answer: e }, { label: va, answer: top }], {
              shown: `${vn} = ${e}, ${va} = ${top}`,
              explain: `${g > 1 ? `약분하면 ${frac(p, Qd)} = ${frac(p0, q)}이다. ` : ''}${eqn(q)}이므로 분모와 분자에 ${10 ** e / q}${tail(10 ** e / q, '을/를')} 곱하면 ${frac(p0, q)} = ${frac(top, '10' + sup(e))}이다. ${vn} = ${e}, ${va} = ${top}이다.`,
              facts: { calc: [[String(e), 0], [`${p}*10**${e}/${Qd}`, 1]], unseen: [e] }
            }), n === 0 ? 'finite-least-plain' : 'finite-least-reduce');
          }, { count: 2 }),
          T('finite-one-claims', '분모를 소인수분해 한 분수 하나에 대한 설명의 참·거짓', '①25', (d) => {
            // 분자의 소인수는 유한소수인지와 상관이 없다. 2와 5의 지수를 같게 맞추어야 10의 거듭제곱이 된다.
            const wantTrue = d.bool(), [a, b] = d.until(() => [d.int(1, 3), d.int(1, 3)], ([i, j]) => i !== j), e = Math.max(a, b), f = [[2, a], [5, b]], q = fval(f), p = d.pick([3, 7, 9, 11]), mul = 10 ** e / q, bad = a < b ? 5 : 2;
            const me = ffrac(p, f), value = p * mul / 10 ** e, wrongValue = p * mul / 10 ** (e - 1);
            const yes = ['유한소수로 나타낼 수 있다.', `분모와 분자에 ${mul}${tail(mul, '을/를')} 곱하면 분모가 10${sup(e)}이 된다.`, `소수로 나타내면 ${value}이다.`, `${frac(p * mul, `(2 × 5)${sup(e)}`)}${tail(p * mul, '과/와')} 크기가 같다.`];
            const no = [
              [`분자에 소인수 ${p === 9 ? 3 : p}${tail(p === 9 ? 3 : p, '이/가')} 있으므로 유한소수로 나타낼 수 없다.`, '기약분수의 분모의 소인수가 2와 5뿐이므로 유한소수로 나타낼 수 있다. 분자의 소인수는 상관이 없다.', yes[0]],
              [`분모와 분자에 ${bad}${tail(bad, '을/를')} 곱하면 분모가 10의 거듭제곱이 된다.`, `2와 5의 지수가 같아지도록 ${mul}${tail(mul, '을/를')} 곱해야 분모가 10${sup(e)}이 된다.`, yes[1]],
              [`소수로 나타내면 ${wrongValue}이다.`, `${me} = ${frac(p * mul, 10 ** e)} = ${value}이다.`, yes[2]],
              ['소수로 나타내면 순환소수가 된다.', '기약분수의 분모의 소인수가 2와 5뿐이므로 유한소수로 나타낼 수 있다.', yes[0]]
            ];
            return claimQ(d, `분수 ${me}에 대한 설명으로 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, yes, no, wantTrue);
          }),
          T('finite-judge', '기약분수로 고친 분모의 소인수를 보고 유한소수인지 판정하기', '①26', (d) => {
            // 약분하기 전의 분모에서 소인수를 읽는 보기를 함께 둔다. 약분하면 2와 5만 남는 분수와, 약분해도 다른 소인수가 남는 분수가 번갈아 나온다.
            const finite = d.bool(), r = d.pick([3, 7, 11]), s = d.pick([3, 7, 11, 13].filter((v) => v !== r)), base = d.until(() => twoFive(d), (f) => f.length === 2 || f[0][1] >= 2);
            const f = sortF(base.concat(finite ? [[r, 1]] : [[r, 1], [s, 1]])), num = r * d.pick([1, 3].filter((v) => v !== s && (finite || v !== r)));
            const me = factRow(num, f), [lp, lq] = lowest(me), red = fz(lq).map(([v]) => v), raw = f.map(([v]) => v), CAN = '유한소수로 나타낼 수 있다.', CANT = '유한소수로 나타낼 수 없다.';
            const rows = d.shuffle([[red, CAN], [red, CANT], [raw, CAN], [raw, CANT]]), at = rows.findIndex((v) => v[0] === red && v[1] === (finite ? CAN : CANT));
            return C(`${nb(me.html + tail(num, '을/를'))} 기약분수로 나타내었을 때의 분모의 소인수와, 유한소수로 나타낼 수 있는지를 바르게 말한 것은?`, rows.map(([ps, say]) => `분모의 소인수는 ${ps.join(', ')}이고, ${say}`), at, {
              explain: `약분하면 ${me.html} = ${frac(lp, par(fden(fz(lq))))}이다. 기약분수의 분모의 소인수는 ${red.join(', ')}이다. ${finite ? '2와 5 이외의 소인수가 없으므로 유한소수로 나타낼 수 있다.' : `2와 5 이외의 소인수 ${s}${tail(s, '이/가')} 있으므로 유한소수로 나타낼 수 없다.`}`,
              facts: { truth: rows.map((v, i) => i === at), want: true }
            });
          }),
          T('finite-pick', '유한소수로 나타낼 수 있는(없는) 분수 고르기', '①28·29 심14', (d, n) => {
            // 첫째는 기약분수 다섯(분모를 소인수분해 한다), 둘째는 분모를 소인수분해 한 꼴의 분수 다섯(약분되는 것이 섞여 있다).
            if (n === 0) {
              const rows = d.until(() => d.shuffle([finPlain(d)].concat(range(1, 4).map(() => infPlain(d)))), distinctRows), at = rows.findIndex((r) => fin(r.p, r.q)), me = rows[at];
              return C('다음 분수 가운데 유한소수로 나타낼 수 있는 것은?', rows.map((r) => r.html), at, {
                explain: `${eqn(me.q)}이므로 ${fj(me.p, me.q, '은/는')} 분모의 소인수가 ${fz(me.q).map(([v]) => v).join(', ')}뿐인 기약분수이다. 나머지 분수는 기약분수의 분모에 2와 5 이외의 소인수가 있다(${[...new Set(rows.filter((r) => r !== me).map((r) => r.q))].map((v) => `${eqn(v)}`).join(', ')}).`,
                facts: { truth: rows.map((r) => fin(r.p, r.q)), want: true }
              });
            }
            const rows = d.until(() => d.shuffle([fFin(d), fFinCancel(d), d.bool() ? fFinCancel(d) : fFinSquare(d), fFinSquare(d), fInfPartial(d)]), distinctRows), at = rows.findIndex((r) => !fin(r.p, r.q)), me = rows[at];
            return C('다음 분수 가운데 유한소수로 나타낼 수 없는 것은?', rows.map((r) => r.html), at, {
              explain: `약분하면 ${reduceTold(me)}이다. 기약분수의 분모에 2와 5 이외의 소인수 ${fz(need(me.p, me.q)).map(([v]) => v).join(', ')}${tail(fz(need(me.p, me.q)).slice(-1)[0][0], '이/가')} 남으므로 유한소수로 나타낼 수 없다. ${rows.filter((r) => r !== me && gcd(r.p, r.q) > 1 && strip25(r.q) > 1).map(reduceTold).join(', ')}처럼 2와 5 이외의 소인수가 모두 약분되는 분수는 유한소수로 나타낼 수 있다.`,
              facts: { truth: rows.map((r) => fin(r.p, r.q)), want: false }
            });
          }, { count: 2 }),
          T('finite-count', '유한소수(무한소수)가 되는 것의 개수', '①27·30', (d, n) => {
            // 첫째는 약분해야 하는 분수가 섞인 목록에서 유한소수의 개수, 둘째는 소수·분수·π가 섞인 목록에서 무한소수의 개수이다.
            if (n === 0) {
              const k = d.int(2, 3), rows = d.until(() => d.shuffle([finHidden(d), finPlain(d)].concat(k === 3 ? [finHidden(d)] : [], [infHidden(d)], range(1, 4 - k).map(() => (d.bool() ? infHidden(d) : infPlain(d))))), distinctRows);
              const hit = rows.filter((r) => fin(r.p, r.q));
              return N('다음 분수 가운데 유한소수로 나타낼 수 있는 것은 모두 몇 개인가?', hit.length, {
                unit: '개', figure: numbers(rows.map((r) => r.html)),
                explain: `기약분수로 고친 다음 분모의 소인수를 본다. ${rows.map((r) => { const [p, q] = lowest(r); return gcd(r.p, r.q) > 1 ? `${r.html} = ${frac(p, q)}` : r.html; }).join(', ')}에서 분모의 소인수가 2 또는 5뿐인 것은 ${hit.map((r) => r.html).join(', ')}의 ${hit.length}개이다.`,
                facts: { count: rows.map((r) => fin(r.p, r.q)) }
              });
            }
            const rows = d.until(() => d.shuffle([{ html: V('π'), inf: true, pi: true }, { html: shortDec(d), inf: false }].concat([finPlain(d), finHidden(d), infPlain(d), d.bool() ? infHidden(d) : finPlain(d)].map((r) => Object.assign(r, { inf: !fin(r.p, r.q) })))), (list) => distinctRows(list.filter((r) => r.q)));
            const hit = rows.filter((r) => r.inf);
            return N('다음 수 가운데 소수로 나타내었을 때 무한소수가 되는 것은 모두 몇 개인가?', hit.length, {
              unit: '개', figure: numbers(rows.map((r) => r.html)),
              explain: `${V('π')} = 3.141592…는 무한소수이다. 분수는 기약분수로 고친 다음 분모에 2와 5 이외의 소인수가 있으면 무한소수가 된다. 무한소수가 되는 것은 ${hit.map((r) => r.html).join(', ')}의 ${hit.length}개이다.`,
              facts: { count: rows.map((r) => r.inf) }
            });
          }, { count: 2 }),
          T('finite-repeat-only', '순환소수로만 나타낼 수 있는 분수를 모두 고른 것', '①27·31', (d) => {
            // 「순환소수로만 나타낼 수 있다」는 유한소수로 나타낼 수 없다는 말이다. 틀린 보기는 약분하지 않고 판정한 것(하나를 더 넣거나 뺀 것)이다.
            const rows = d.until(() => d.shuffle([d.bool() ? finPlain(d) : fFin(d), d.bool() ? finHidden(d) : fFinCancel(d), d.bool() ? infHidden(d) : fInfPartial(d), d.bool() ? infPlain(d) : fInf(d)]), distinctRows);
            const flags = rows.map((r) => !fin(r.p, r.q)), on = [0, 1, 2, 3].filter((i) => flags[i]), off = [0, 1, 2, 3].filter((i) => !flags[i]);
            const name = (list) => asc(list).map((i) => LAB[i]).join(', '), right = name(on);
            const options = d.shuffle([right, name(on.concat([off[0]])), name(on.concat([off[1]])), name([on[0], off[0]]), name([on[1], off[1]])].filter((v, i, all) => all.indexOf(v) === i).slice(0, 4));
            return C('다음 분수 가운데 순환소수로만 나타낼 수 있는 것을 모두 고른 것은?', options, options.indexOf(right), {
              figure: tagged(rows.map((r) => r.html)),
              explain: `순환소수로만 나타낼 수 있는 분수는 유한소수로 나타낼 수 없는 분수이다. 기약분수로 고치면 ${rows.map((r, i) => { const [p, q] = lowest(r); return `${LAB[i]} ${frac(p, par(fden(fz(q))))}`; }).join(', ')}이다. 분모에 2와 5 이외의 소인수가 있는 것은 ${right}이다.`,
              facts: { truth: options.map((v) => v === right), want: true }
            });
          }),
          T('finite-fix', '약분하지 않고 판정한 풀이를 바로잡기', '①32', (d) => {
            // 틀린 보기: 풀이가 옳다고 본 것, 분자의 소인수를 따진 것, 약분하지 않아도 2가 있으니 된다고 본 것
            const [p, q] = d.pick([[21, 84], [33, 132], [39, 156], [21, 168], [33, 66], [77, 154], [21, 105], [33, 165], [39, 195], [21, 420]]), f = fz(q), others = f.map(([v]) => v).filter((v) => v !== 2 && v !== 5), g = gcd(p, q), lq = q / g, own = fz(lq).map(([v]) => v);
            const me = frac(p, q), right = `기약분수로 나타내면 ${frac(p / g, lq)}이고 분모의 소인수가 ${own.join(', ')}뿐이므로 유한소수로 나타낼 수 있다.`;
            const rows = d.shuffle([right, `고칠 곳이 없다. 분모에 소인수 ${others.join(', ')}${tail(others[others.length - 1], '이/가')} 있으므로 유한소수로 나타낼 수 없다.`,
              `분자 ${p}에도 2와 5 이외의 소인수가 있으므로 유한소수로 나타낼 수 없다.`, `분모에 소인수 ${own[0]}${tail(own[0], '이/가')} 있으므로 약분하지 않아도 유한소수로 나타낼 수 있다.`]);
            return C(`다음은 ${nb(me + tail(p, '을/를'))} 유한소수로 나타낼 수 있는지 알아본 풀이이다. 이 풀이를 바르게 고친 것은?`, rows, rows.indexOf(right), {
              figure: lines([`${q}${tail(q, '을/를')} 소인수분해 하면 ${eqn(q)}이다.`, `분모에 2와 5 이외의 소인수 ${others.join(', ')}${tail(others[others.length - 1], '이/가')} 있으므로 ${nb(me + tail(p, '은/는'))} 유한소수로 나타낼 수 없다.`]),
              explain: `분모의 소인수는 기약분수로 고친 다음에 본다. ${me} = ${frac(p / g, lq)}이고 ${lq === own[0] ? '' : `${eqn(lq)}이므로 `}기약분수의 분모의 소인수는 ${own.join(', ')}뿐이다. 유한소수로 나타낼 수 있다.`,
              facts: { truth: rows.map((v) => v === right), want: true }
            });
          }),
          T('finite-run-count', '줄지어 놓은 분수 가운데 유한소수가 되는 것의 개수', '①34·40', (d, n) => {
            // 첫째는 분자가 1씩 커지는 분수(분자가 분모의 3이나 7을 지우는 배수여야 한다), 둘째는 분모가 1씩 커지는 단위분수이다.
            if (n === 0) {
              const q = d.pick([12, 15, 24, 28, 30, 35, 36, 45]), k = need(1, q), want = d.bool(), flags = range(1, q - 1).map((v) => fin(v, q) === want), hits = range(1, q - 1).filter((v) => fin(v, q));
              return ruled(N(`${frac(1, q)}, ${frac(2, q)}, ${frac(3, q)}, …, ${frac(q - 1, q)} 가운데 유한소수로 나타낼 수 ${want ? '있는' : '없는'} 것은 모두 몇 개인가?`, flags.filter(Boolean).length, {
                unit: '개', explain: `${eqn(q)}이므로 분자가 ${k}의 배수이면 약분하여 분모의 소인수가 2 또는 5뿐이 된다. 분자가 ${k}의 배수인 분수는 ${hits.length}개이므로 유한소수로 나타낼 수 있는 것은 ${hits.length}개${want ? '' : `, 나타낼 수 없는 것은 ${q - 1} − ${hits.length} = ${q - 1 - hits.length}개`}이다.`,
                facts: { count: flags }
              }), 'finite-run-numerator');
            }
            const [lo, hi] = d.pick([[2, 10], [10, 20], [11, 25], [20, 32], [30, 50], [5, 16], [15, 26]]), hits = range(lo, hi).filter((v) => fin(1, v));
            return ruled(N(`${frac(1, lo)}, ${frac(1, lo + 1)}, ${frac(1, lo + 2)}, …, ${frac(1, hi)} 가운데 유한소수로 나타낼 수 있는 것은 모두 몇 개인가?`, hits.length, {
              unit: '개', explain: `분모의 소인수가 2 또는 5뿐인 것을 찾는다. ${lo}부터 ${hi}까지의 자연수 가운데 소인수가 2 또는 5뿐인 수는 ${hits.map((v) => (fz(v).length === 1 && fz(v)[0][1] === 1 ? String(v) : `${eqn(v)}`)).join(', ')}의 ${hits.length}개이다.`,
              facts: { count: range(lo, hi).map((v) => fin(1, v)) }
            }), 'finite-run-denominator');
          }, { count: 2 })
        ]
      },
      { id: 'make', title: '유한소수·순환소수가 되게 하는 수', standard: STD, types: [] },
      { id: 'tofrac', title: '순환소수를 분수로 나타내기', standard: STD, types: [] },
      { id: 'calc', title: '순환소수의 크기 비교와 계산', standard: STD, types: [] },
      { id: 'relation', title: '유리수와 순환소수의 관계', standard: STD, types: [] }
    ]
  });

  // 같은 단원의 다른 파일(8-1-1b.js, 8-1-1c.js)이 함께 쓰는 도구
  B.kit.m811 = {
    STD, LAB, range, gcd, lcm, Q, qcmp, fl, nb, tail, V, sup, claimQ, nline, rep, repQ, repDigit, ruled, asc, ORD,
    fz, fval, strip25, need, fin, expand, primitive, okRep, pickRep, pickFrac, headOf, decText, repOf, valOf, unroll, unrollOf, lastJ, repJ, unJ, decJ, fj, fden, hid, par, ffrac, eqn, SR, dotAt, row, x,
    remJs, digitJs, cycDigitJs, repDen, repJs, repUnseen, BIG, LOOSE, fakeRep, shortDec, listJ, plainRow, factRow, lowest, reduceTold, finPlain, infPlain, finHidden, infHidden, twoFive, sortF, distinctRows
  };
})(typeof window !== 'undefined' ? window : globalThis);
