// 6학년 2학기 3단원 소수의 나눗셈 — 단원 틀과 기본 문항(자연수의 나눗셈을 이용한 계산 원리, 자릿수가 같은·다른 (소수)÷(소수), (자연수)÷(소수), 세로셈의 계산 과정과 잘못된 계산).
// 수집해 둔 교과서 8종의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1~3: 66·77·71꼴, 심화꼴 77꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/6-2-3/싣기_대조표.md 에 있다.
// (어림, 몫의 크기 비교와 조건에 맞는 수, 몫을 반올림하여 나타내기, 나누어 주고 남는 양, 문장제는 6-2-3b.js 에, 실력 문항은 6-2-3c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2, ③n = 기본꼴_3, 심n = 심화꼴.
// 영역은 수와 연산, 성취기준은 6수01-15(소수의 나눗셈의 계산 원리를 탐구하고 그 계산을 할 수 있다) 가운데 (자연수)÷(소수)와 (소수)÷(소수)이다((소수)÷(자연수)는 6-1-3).
//
// 싣는 기준
//  - 나누는 수가 소수인 나눗셈((소수)÷(소수), (자연수)÷(소수))과 이 단원에서 새로 배우는 「몫을 반올림하여 나타내기」「몫을 자연수까지 구하고 남는 양」을 싣는다.
//    (소수)÷(자연수), (자연수)÷(자연수)의 몫을 소수로 나타내는 계산만 하는 문항은 6-1-3에 있으므로 싣지 않는다. 반올림과 남는 양은 나누는 수가 자연수여도 싣는다(7 ÷ 3, 18.7 ÷ 4).
//  - 하는 일이 다르면 다른 문제다: 주는 것(가로식, 세로셈, 계산 과정의 빈칸, 자연수의 나눗셈, 분수로 고친 식, 수직선, 문장), 묻는 것(값, 고르기, 차례, 처음 틀린 곳),
//    계산 구조가 다르면 따로 싣고 계산 문항에는 facts.rule 에 그 이름을 단다(이름대로 되게 수를 뽑는다): 자릿수가 같은가 다른가, 나누는 수가 1보다 작은가, (자연수)÷(소수)인가,
//    몫이 자연수인가 소수인가, 몫이 1보다 작은가, 0을 내려 계산하는가.
//  - 교육과정: 「소수의 곱셈과 나눗셈은 계산 원리를 탐구하여 이해하는 수준에서 다룬다.」 「복잡한 계산은 계산기를 사용하게 할 수 있다.」
//    소수점을 옮긴 뒤의 나눗셈이 (두세 자리 수)÷(한두 자리 수)가 되게 한다: 나누는 수는 소수점을 떼면 두 자리 이하(0.02~0.99, 0.2~9.9)이고, 나누어지는 수는 소수 두 자리까지이며
//    소수점과 끝자리 0을 뗀 숫자가 세 자리 이하이다. 나누어떨어지는 몫은 소수 둘째 자리까지이다. 몫을 반올림하여 소수 둘째 자리까지 나타내는 것은 옮긴 뒤 한 자리 수로 나눌 때만 싣고,
//    두 자리 수로 나눌 때는 일의 자리·소수 첫째 자리까지만 싣는다.
//  - 수는 모두 정수(소수점을 뗀 수와 소수점 아래 자리 수)로 뽑아 셈하고 글에 적을 때만 소수로 적는다. 몫과 나누는 수를 먼저 정하고 나누어지는 수를 거꾸로 만든다. 반올림과 남는 양도 정수로 셈한다.
//    답이 소수이면 소수 칸, 자연수로 떨어지면 수 하나로 답한다. 유형(차례)마다 답의 꼴은 정해져 있다. 끝자리가 0인 소수(2.50)는 적지 않는다.
//  - 숫자만 다르거나 상황만 다른 것은 한 번만 싣는다(빈 곳에 몫 써넣기, 화살표 상자, 표, 사다리, 잇기는 계산 문항과 같은 문제).
//
// 뺀 것과 까닭(6-2-3b.js, 6-2-3c.js 의 것까지 여기에 모아 적는다)
//  - 다른 단원·영역의 일: 평균을 구해 반올림하기(①56 ②48 ③44 심41 — 5-2 자료와 가능성, 나눗셈도 (소수)÷(자연수)), 전체의 0.12로 전체 구하기·0.7을 쓰고 남은 양으로 전체 구하기(②62 심61 ①39 — 비율의 기준량,
//    변화와 관계 영역), 삼각형·사다리꼴·마름모의 넓이와 직육면체의 부피를 거꾸로 풀기(①47 ②68 ③68 심73·74 — 넓이 공식을 거꾸로 푸는 일이 고비), 둘레에서 세로를 구해 몇 배(심72),
//    각기둥의 모서리 수(①36의 변형), 1 mL의 무게 표(①48 — 들이와 무게 바꾸기), 대응 규칙 찾기(심29), 앞 단원 되짚기(③1), (소수)÷(자연수)만 하는 문항(①19·24·40의 변형, 심42·43 — 6-1-3)
//  - 거리·시간·빠르기를 여러 단계로 엮는 문제: 분을 소수 시간으로 고쳐 나누기(①44 심40의 24분·45분·48분 — 1시간 30분을 1.5시간으로 고치는 것 하나만 실력에 실었다), 걸리는 시간을 몇 분 몇 초·몇 시 몇 분으로(①43 심68),
//    빠르기를 구해 걸리는 시간(심65), 마주 보고 움직이기·시곗바늘(①45), 터널을 빠져나오는 기차(심70)
//  - 조건 풀이·경우 따지기·세기가 어려움의 대부분인 것: 간격·나무 심기(①46 ②69 ③69 심75·76), 겹쳐 이어 붙이기(②70), 가려진 세로셈의 숫자 여럿(②76 심19), 세 사람의 조건을 거꾸로 풀기(①42),
//    몫의 소수 몇째 자리 숫자(①57 ③46 심77 — 되풀이되는 숫자의 규칙, 순환소수), 반올림한 몫에서 거꾸로 수 찾기(③45), 약속한 셈(③62), 0이 낀 수 카드 다섯 장(③61·심32의 변형),
//    조건에 맞는 자연수부터 찾아야 하는 어떤 수(①41의 변형), 여러 단계 끝에 몫을 자연수까지 구하기(①39), 빈 통의 무게까지 구하는 덜어 내기(①40의 둘째)
//  - 계산기에 맡기는 금을 넘는 것: 옮긴 뒤 세 자리 수로 나누는 계산((자연수)÷(소수 두 자리 수)의 30 ÷ 1.25, 8.61 ÷ 1.23, 96.83 ÷ 4.21 — ①9·17 ②15·19 ③14·23 심10·11의 변형. 나누는 수가 0.□□인 것으로 실었다),
//    네 자리 수를 두 자리 수로 나누는 계산(34.79 ÷ 7.1, 19.95 ÷ 0.57), 몫을 소수 셋째 자리까지 구하는 것(①51 심33의 변형, 심17·27의 변형), 두 자리 수로 나누어 소수 둘째 자리까지 반올림하기(③37의 변형, 심37),
//    몫이 네 자리 수인 1 kg의 값을 반올림해 견주기(심44), 5 t 트럭에 실을 수 있는 상자 수(②55의 변형)
//  - 한 종에만 있는 것: 몫을 올림·버림하여 나타내기(②40 ③41 — 「남김없이 담으려면 통이 몇 개 필요한가」처럼 상황으로 올리는 것은 실력에 실었다)
//  - 지나치게 여러 단계인 것: 필요한 페인트의 양을 구해 통의 수로 올리기(②56·심52의 변형 — 나눗셈 두 번에 올림까지), 몇 배의 거꾸로를 구해 반올림하기(③43의 변형), 골라 나눈 몫을 반올림하기(②25의 변형)
//  - 뜻 없는 셈: 두 몫의 합·차·몇 배(②29 ③30 심15), 두 □를 구해 더하거나 몇 배(②73, ①15와 심5·22의 합), 반올림하여 나타낸 두 수의 차(①52 ②42 심35 — 두 값의 크기 비교로 실력에 실었다),
//    두 가지로 나눈 개수의 차(③70의 변형 심62), 남는 수가 큰 차례(심49), 쓰고 남은 도막 수(심54)
//  - 작도·서술형·열린 답: 긋기·잇기·색칠(①1·23 ②28 ③29의 그리는 부분, 심9), 계산 과정·까닭·방법 쓰기(①4·5·7·11 ②10·21·22·35·53 ③12·20·33·52 심7·8·18·47 — 과정의 빈칸,
//    알맞은 까닭 고르기, 처음 잘못된 곳 고르기, 바른 값 구하기, 틀린 사람 고르기로 바꿈), 문제 만들기(②77 ③56), 놀이(③71), 자리를 정해 주지 않은 어림(②45의 변형 — 답이 여럿)
//  - 같은 문제여서 한 번만 실은 것: 빈 곳에 몫 써넣기·화살표·표·잇기(①25 ②24 ③25 — 계산 문항·이어서 두 번 나누기와 같다), 몫이 같은 두 식 찾기(②28 ③28 — 몫이 다른 하나 찾기와 같다),
//    계산이 틀린 식 고르기·잘못 계산한 사람(②23 ③21 — 어림하여 소수점의 위치가 잘못된 계산 찾기와 같다), 다른 수로 잘못 나눈 어떤 수(심27 — 잘못 곱한 어떤 수와 얼개가 같다),
//    각자 나눈 수 견주기(②58 — 1 kg의 값 견주기와 얼개가 같다), 빈 상자를 빼는 것과 얼개가 같은 이어 붙여 자르기·남은 양을 빼고 사람 수(①38의 첫째, 심57), 뺀 뒤 몇 배(①54·③64의 변형)
//  - 그림이 필요해 미룬 것은 없다. 소수점을 옮기는 세로셈(옮긴 소수점, 몫의 소수점, 붙인 0과 내려 쓴 0, 남는 수의 소수점)과 뛰어 세는 수직선은 단원 파일의 그림 함수로 그렸다.
//    그림이 빠져 수를 알 수 없는 꼴(길 그림에서 거리 읽기 ①33·②59의 변형 심69, 빈칸 표)은 수를 글에 적은 같은 꼴로 실었다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  // ── 함께 쓰는 도우미 시작(6-2-3a.js, 6-2-3b.js, 6-2-3c.js 에 똑같이 적는다. 파일마다 따로 닫혀 있어 함께 쓸 수 없다) ──
  const { josa, name, nick, NAMES, box, frac, lines, chain, numbers, cards, table, N, M, C, D } = B.kit;
  const STD = '6수01-15';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  // 실력 문항. 기본 자료에서만 나온 꼴은 ref 를 '기본 ②52' 처럼 적는다.
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: ref.startsWith('기본 ') ? '수집본 기본 자료(' + ref.slice(3) + ')' : '수집본 심화 자료(' + ref + ')', make }, more || {});
  const LAB = ['㉠', '㉡', '㉢', '㉣'], THREE = LAB.slice(0, 3);
  const SIGNS = ['&gt;', '=', '&lt;'], GT = '&gt;', LT = '&lt;';
  const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  const SG = { '+': '+', '-': '−', '*': '×', '/': '÷', '=': '=', '>': GT, '<': LT };
  const ex = (html) => '<span class="mb-expr">' + html + '</span>';
  // 식 한 줄: 조각을 이어 적는다. '+', '-', '*', '/', '=', '>', '<' 은 기호로 바꾼다.
  const eq = (...parts) => ex(parts.map((p) => (typeof p === 'string' && SG[p] ? '<i>' + SG[p] + '</i>' : p)).join(' '));
  // 길어서 휴대폰 너비를 넘을 수 있는 식은 글씨를 조금 작게 적는다.
  const eqs = (...parts) => eq(...parts).replace('class="mb-expr"', 'class="mb-expr" style="font-size:1.02rem"');
  const tag = (label) => '<span class="mb-tag mb-tag-short">' + label + '</span>';
  const tagged = (list, tags) => lines(list.map((html, i) => tag((tags || LAB)[i]) + html));
  const said = (who, text) => `${who}: 「${text}」`;
  const versus = (left, right) => `<div class="mb-versus">${left}<span class="mb-ring"></span>${right}</div>`;

  // ── 수 하나 ──
  // 수는 { n: 소수점을 뗀 자연수, k: 소수점 아래 자리 수 }로 다룬다(끝자리 0은 떼어 둔다). 2.35 = { n: 235, k: 2 }.
  const P10 = [1, 10, 100, 1000, 10000, 100000, 1000000, 10000000];
  const dec = (n, k) => { while (k > 0 && n % 10 === 0) { n /= 10; k -= 1; } return { n, k }; };
  const nat = (n) => ({ n, k: 0 });
  const fx = (n, k) => { const t = String(n).padStart(k + 1, '0'); return k ? t.slice(0, -k) + '.' + t.slice(-k) : t; };
  const S = (x) => fx(x.n, x.k);                 // 글에 적는 꼴
  const V = (x) => x.n / P10[x.k];               // 답 칸에 넣는 값
  const mulD = (a, b) => dec(a.n * b.n, a.k + b.k);                                    // 곱
  const plus = (x, y, sign) => { const K = Math.max(x.k, y.k); return dec(x.n * P10[K - x.k] + (sign || 1) * y.n * P10[K - y.k], K); };
  const sh = (x, e) => (e >= x.k ? nat(x.n * P10[e - x.k]) : { n: x.n, k: x.k - e });   // 10을 e번 곱한 수(소수점을 오른쪽으로 e자리 옮긴다)
  const sig = (x) => String(x.n).replace(/0+$/, '').length;                            // 소수점과 끝자리 0을 뗀 숫자의 수
  const less = (x, y) => x.n * P10[y.k] < y.n * P10[x.k];
  // x ÷ y 를 자연수의 분수 a / b 로 나타낸다(소수점을 떼어 같은 자리로 맞춘다).
  const frc = (x, y) => ({ a: x.n * P10[y.k], b: y.n * P10[x.k] });
  // 나눗셈: 소수 셋째 자리 안에서 나누어떨어지면 몫을, 아니면 null 을 돌려준다.
  const quo = (x, y) => { const f = frc(x, y); for (let K = 0; K <= 3; K += 1) if ((f.a * P10[K]) % f.b === 0) return dec(f.a * P10[K] / f.b, K); return null; };
  // 몫을 반올림하여 소수 p째 자리까지 나타낸 수(끝자리 0을 떼지 않는다), 소수 p째 자리까지만 구한 몫(글), 몫을 자연수까지 구했을 때의 몫과 남는 수
  const rnd = (x, y, p) => { const f = frc(x, y); return { n: Math.floor((2 * f.a * P10[p] + f.b) / (2 * f.b)), k: p }; };
  const cutq = (x, y, p) => { const f = frc(x, y); return fx(Math.floor(f.a * P10[p] / f.b), p); };
  const rest = (x, y) => { const f = frc(x, y), q = Math.floor(f.a / f.b); return { q, r: dec(f.a - q * f.b, x.k + y.k) }; };
  const endless = (x, y) => { const f = frc(x, y); return (f.a * 1000) % f.b !== 0; };      // 소수 셋째 자리까지 구해도 나누어떨어지지 않는다.
  // 토씨: 소수는 끝자리 숫자를 마지막에 읽는다(0.3은, 0.25는). 자연수를 적은 글에도 쓴다.
  const BATCHIM = [true, true, false, true, false, false, true, true, true, false], RIEUL = [false, true, false, false, false, false, false, true, true, false];
  const dj = (text, pair) => { const [yes, no] = pair.split('/'), k = Number(String(text).slice(-1)); return text + (yes === '으로' ? (BATCHIM[k] && !RIEUL[k] ? '으로' : '로') : BATCHIM[k] ? yes : no); };
  const J = (x, pair) => dj(S(x), pair);
  const part = (k) => frac(1, P10[k]);
  // 분수 뒤 토씨: 분자를 마지막에 읽는다(100분의 15는).
  const fj = (top, bottom, pair) => frac(top, bottom) + josa(top, pair).slice(String(top).length);
  const PLACES = ['', '한', '두'], NTH = ['일의 자리', '소수 첫째 자리', '소수 둘째 자리', '소수 셋째 자리'];
  const nz = (d, lo, hi) => d.until(() => d.int(lo, hi), (v) => v % 10 !== 0);
  const digs = (n) => String(n).split('').map(Number);
  // 단위 기호 뒤 토씨(읽는 소리대로): m·cm·km·L·mL·m² 는 받침 없음, g·kg 은 받침 있음
  const uj = (unit, pair) => unit + pair.split('/')[/g$/.test(unit) ? 0 : 1];
  // 나누는 수: 소수 한 자리 수(0.□, □.□)와 소수 두 자리 수(0.0□, 0.□□). 소수점을 떼면 한두 자리 수이다.
  const Y = {
    s1: (d) => ({ n: d.int(2, 9), k: 1 }), b1: (d) => ({ n: nz(d, 11, 98), k: 1 }), a1: (d) => (d.bool() ? { n: d.int(2, 9), k: 1 } : { n: nz(d, 11, 98), k: 1 }),
    s2: (d) => ({ n: d.int(2, 9), k: 2 }), b2: (d) => ({ n: nz(d, 11, 98), k: 2 }), a2: (d) => (d.int(0, 2) === 0 ? { n: d.int(2, 9), k: 2 } : { n: nz(d, 11, 98), k: 2 })
  };
  // 몫 q 와 나누는 수 y 를 먼저 정하고 나누어지는 수 x 를 만든다(어떤 씨앗에서도 나누어떨어진다). 나누어지는 수는 소수 두 자리까지, 소수점과 끝자리 0을 뗀 숫자는 세 자리까지.
  const mk = (d, pickY, pickQ, ok) => d.until(() => { const y = pickY(d), q = pickQ(y); return { y, q, x: mulD(q, y) }; }, (v) => v.q.n > 0 && v.x.k <= 2 && sig(v.x) <= 3 && v.x.n < 10000 && (!ok || ok(v)));
  const qn = (d, lo, hi) => nat(d.int(lo, hi));
  const qd = (d, lo, hi, k) => ({ n: nz(d, lo, hi), k });

  // ── 검사가 다시 셈하는 식 ──
  // 소수 답은 글에 적힌 소수 그대로 나눈 식으로(검사가 소수 셋째 자리까지 맞춰 본다), 자연수 답과 견주기는 정수 식으로 적는다.
  // 수 하나를 소수점을 뗀 자연수로 적은 식: 2.35 → (2*100+35). 글에 없는 수(100, 소수 부분이 0으로 시작하는 05의 5)는 un 에 모은다.
  const ix = (x) => { if (!x.k) return { s: String(x.n), un: [] }; const w = Math.floor(x.n / P10[x.k]), f = x.n % P10[x.k]; return { s: `(${w}*${P10[x.k]}+${f})`, un: [P10[x.k]].concat(f < P10[x.k - 1] ? [f] : []) }; };
  // x ÷ y 를 자연수의 분수 a / b 로 적은 식
  const xab = (x, y) => { const i = ix(x), j = ix(y); return { a: y.k ? `${i.s}*${P10[y.k]}` : i.s, b: x.k ? `${j.s}*${P10[x.k]}` : j.s, un: i.un.concat(j.un, y.k ? [P10[y.k]] : [], x.k ? [P10[x.k]] : []) }; };
  const xq = (x, y) => { const f = xab(x, y); return { s: `(${f.a})/(${f.b})`, un: f.un }; };                                                   // 자연수로 떨어지는 몫
  const xmil = (x, y) => { const f = xab(x, y), g = frc(x, y); return { s: `(${f.a})*1000/(${f.b})`, un: f.un.concat([1000]), v: g.a * 1000 / g.b }; };   // 몫의 1000배
  const xfloor = (x, y) => { const f = xab(x, y); return { s: `((${f.a})-(${f.a})%(${f.b}))/(${f.b})`, un: f.un }; };                            // 몫의 자연수 부분
  const xrem = (x, y) => { const f = xab(x, y), p = P10[x.k + y.k]; return { s: `(${f.a})%(${f.b})/${p}`, un: f.un.concat([p]) }; };                 // 몫을 자연수까지 구했을 때 남는 수
  // 몫을 반올림하여 소수 p째 자리까지 나타낸 수. whole 이면 소수점을 뗀 자연수(10을 p번 곱한 수)로 적는다.
  const xround = (x, y, p, whole) => { const f = xab(x, y), top = `((${f.a})*${2 * P10[p]}+(${f.b}))`, low = `(2*(${f.b}))`; return { s: `(${top}-${top}%${low})/${low}` + (p && !whole ? `/${P10[p]}` : ''), un: f.un.concat([2, 2 * P10[p], P10[p]]) }; };
  const inp = (label, x, unit) => Object.assign({ label, answer: V(x) }, x.k ? { decimal: true } : {}, unit ? { unit } : {});
  // 몫 하나를 답하는 문항. 몫이 소수이면 소수 칸(식은 글에 적힌 수 그대로), 자연수이면 수 하나(정수 식)로 답한다.
  const ask = (text, x, y, o) => {
    const q = quo(x, y); if (!q) throw new Error('나누어떨어지지 않는다');
    const e = q.k ? { s: `${S(x)}/${S(y)}`, un: [] } : xq(x, y), f = Object.assign({}, o.facts || {});
    f.calc = [[e.s, 0]]; f.unseen = (f.unseen || []).concat(e.un);
    return (q.k ? D : N)(text, V(q), Object.assign({}, o, { facts: f }));
  };
  // 풀이 글: 소수점을 같은 자리만큼 옮겨 나누는 수를 자연수로 만든다.
  const how = (x, y) => { const q = quo(x, y); return y.k ? `나누어지는 수와 나누는 수의 소수점을 오른쪽으로 ${PLACES[y.k]} 자리씩 옮기면 ${S(sh(x, y.k))} ÷ ${y.n}이다. ${S(sh(x, y.k))} ÷ ${y.n} = ${S(q)}이다.` : `${S(x)} ÷ ${y.n} = ${S(q)}이다.`; };
  const told = (x, y) => `${S(x)} ÷ ${S(y)} = ${S(quo(x, y))}`;
  const CALC = '다음을 계산하시오.';
  // 여러 몫을 크기 차례로 늘어놓는 보기
  const orderChoice = (d, values, labels, descending) => {
    const right = values.map((_, i) => i).sort((p, q) => (descending ? values[q] - values[p] : values[p] - values[q]));
    const list = d.shuffle(d.shuffle(ORDERS.filter((o) => o.join() !== right.join())).slice(0, 3).concat([right]));
    return { list, right, options: list.map((o) => o.map((i) => labels[i]).join(', ')), answer: list.findIndex((o) => o.join() === right.join()) };
  };

  // ── 그림 ──
  const PALE = 'color:#94a3b8', BLUE = 'color:#2563eb';
  const dot = (style) => `<span style="display:inline-block;width:0${style ? ';' + style : ''}">.</span>`;
  // 소수점이 한 자리 옮겨 가는 표시(숫자 아래의 작은 곡선)
  const HOP = '<span style="position:absolute;left:1px;right:-1px;bottom:0;height:5px;border:1.6px solid #2563eb;border-top:0;border-radius:0 0 9px 9px"></span>';
  // 나눗셈을 세로로 계산하는 차례(엔진의 longDivision 과 같다). 숫자 글 ds 를 받아 앞자리 0도 한 칸으로 둔다. at: 그 줄을 적게 한 몫의 자리.
  function ldiv(c, ds) {
    const digits = ds.split('').map(Number), n = digits.length, quot = digits.map(() => null), rows = [];
    let cur = 0, started = false;
    for (let i = 0; i < n; i += 1) {
      cur = cur * 10 + digits[i];
      const q = Math.floor(cur / c);
      if (q === 0) { if (started) quot[i] = 0; continue; }
      started = true; quot[i] = q;
      rows.push({ value: q * c, end: i, sub: true, at: i });
      cur -= q * c;
      let j = i, shown = cur;
      while (j < n - 1 && shown < c) { j += 1; shown = shown * 10 + digits[j]; }
      rows.push({ value: shown, end: j, sub: false, at: i });
    }
    return { quot, rows, rest: cur };
  }
  // 세로셈에 적는 숫자 줄을 정한다. own: 나누어지는 수의 숫자, lift: 소수점을 옮기느라 붙인 0의 수, pad: 내려 쓴 0의 수, mv: 옮긴 소수점 바로 앞 칸(몫의 일의 자리 칸).
  // o.pad 를 주지 않으면 나누어떨어질 때까지(소수 셋째 자리 안에서) 0을 내려 쓴다. o.stop 이면 몫을 자연수까지만 구하고, o.upto 이면 앞의 몇 칸까지만 계산한다.
  // o.short 이면 나누어지는 수에 0을 붙이지 않고 소수점을 있는 자리만큼만 옮긴다(두 수의 소수점을 서로 다른 자리만큼 옮긴 잘못된 계산).
  function plan(y, x, o) {
    o = o || {};
    const s = y.k, c = y.n, xt = S(x), intLen = xt.split('.')[0].length, own = xt.replace('.', ''), lift = o.short ? 0 : Math.max(0, s - x.k), mv = intLen - 1 + (o.short ? Math.min(s, x.k) : s);
    let ds = own + '0'.repeat(lift), pad = 0;
    if (!o.stop && !o.upto) { if (o.pad !== undefined) pad = o.pad; else while (Number(ds + '0'.repeat(pad)) % c !== 0 && ds.length + pad - 1 - mv < 3) pad += 1; }
    ds += '0'.repeat(pad);
    const upto = o.stop ? mv + 1 : o.upto || ds.length;
    return { s, c, xt, intLen, own, lift, pad, mv, ds, n: ds.length, upto, work: ldiv(c, ds.slice(0, upto)) };
  }
  // 나누는 수가 소수인 나눗셈의 세로셈. y ) x 를 적는다(y 가 자연수이면 소수점을 옮기지 않는다).
  //  - o.shift: 소수점을 옮긴 표시를 그린다 — 처음 소수점은 옅게, 옮긴 소수점은 파랗게, 건너뛴 숫자 아래에는 작은 곡선, 옮기느라 붙인 0은 파랗게 적는다.
  //  - o.steps: 몫과 계산 과정도 적는다(소수점을 옮긴 표시도 함께 그린다). 몫의 소수점은 옮긴 소수점 자리에 맞추어 찍고, 내려 쓴 0은 옅게 적는다.
  //  - 빈칸: o.quot(몫을 가리는 이름표), o.rows({ 줄 번호: 이름표 }), o.rest(남는 수를 가리는 이름표). o.nodot: 몫에 소수점을 찍지 않는다.
  //  - o.given({ cells, dot }): 잘못 계산한 세로셈처럼 몫의 칸(자리마다 글자)과 소수점을 찍을 칸을 그대로 정해 줄 때 쓴다.
  //  - o.stop: 몫을 자연수까지만 구하고 남는 수를 적는다. 남는 수의 소수점은 나누어지는 수의 처음 소수점 자리에 찍는다(o.restDot: 'moved' 이면 옮긴 소수점 자리에 잘못 찍는다).
  //  - o.upto: 앞의 몇 칸까지만 계산하고 멈춘 세로셈(붙인 0을 계산하지 않아 몫의 끝자리 0을 빠뜨린 것).
  function sdiv(y, x, o) {
    o = o || {};
    const calcd = Boolean(o.steps), show = (calcd || Boolean(o.shift)) && y.k > 0, p = plan(y, x, calcd ? o : { pad: 0, short: o.short });
    const ds = show || calcd ? p.ds : p.own, n = ds.length, mv = show ? p.mv : p.intLen - 1, lift = show ? p.lift : 0, g = o.given || {}, hidden = o.rows || {};
    const rows = calcd ? p.work.rows.slice() : [];
    if (o.stop && rows.length && !rows[rows.length - 1].sub) rows.pop();
    // 몫
    const cells = g.cells || Array.from({ length: n }, (_, i) => { const v = p.work.quot[i]; return calcd && v !== null && v !== undefined ? String(v) : calcd && !o.stop && i >= mv && i < p.upto ? '0' : ''; });
    const qdot = o.nodot ? null : g.dot !== undefined ? g.dot : !o.stop && n - 1 > mv ? mv : null;
    const dotted = (i) => i === qdot && cells.slice(i + 1).some(Boolean);
    const quotText = cells.map((ch, i) => ch + (dotted(i) ? '.' : '')).join('');
    const line = (value, end, label, cls) => {
      const t = String(value), from = end - t.length + 1;
      let h = `<tr${cls ? ` class="${cls}"` : ''}><td></td><td></td>`;
      for (let col = 0; col < n; col += 1) {
        if (col < from || col > end) h += '<td></td>';
        else if (label !== undefined) { if (col === from) h += `<td colspan="${t.length}" class="mb-ld-blank">${box(label)}</td>`; }
        else h += `<td>${t[col - from]}</td>`;
      }
      return h + '</tr>';
    };
    let out = '';
    if (calcd) out += '<tr class="mb-ld-quot"><td></td><td></td>' + (o.quot !== undefined ? `<td colspan="${n}" class="mb-ld-blank">${box(o.quot)}</td>` : cells.map((ch, i) => `<td>${ch}${dotted(i) ? dot() : ''}</td>`).join('')) + '</tr>';
    // 나누는 수: 소수점을 옮긴 표시를 그릴 때는 숫자를 한 칸씩 띄워 곡선을 그린다.
    const yt = S(y), ydot = yt.indexOf('.');
    const left = show ? yt.split('').map((ch, i) => (ch === '.' ? `<span style="display:inline-block;width:0.3em;text-align:center;${PALE}">.</span>` : `<span style="position:relative;display:inline-block;width:0.68em;text-align:center">${ch}${i > ydot ? HOP : ''}</span>`)).join('') : yt;
    out += `<tr class="mb-ld-top"><td style="white-space:nowrap">${left}</td><td class="mb-ld-hook"></td>` + ds.split('').map((ch, i) => {
      const lifted = i >= p.own.length && i < p.own.length + lift, padded = i >= p.own.length + lift;
      let point = '';
      if (i === p.intLen - 1 && (x.k > 0 || show || n > p.own.length)) point += dot(show || x.k === 0 ? PALE : '');   // 처음 소수점(자연수이면 옅게)
      if (show && i === mv && i < n - 1) point += dot(BLUE);                                                           // 옮긴 소수점
      const hop = show && i >= p.intLen && i <= mv ? HOP : '';
      return `<td style="position:relative${lifted ? ';' + BLUE : padded ? ';' + PALE : ''}">${ch}${point}${hop}</td>`;
    }).join('') + (calcd || n > 1 ? '' : '<td></td>') + '</tr>';
    rows.forEach((row, k) => { out += line(row.value, row.end, hidden[k], row.sub ? 'mb-ld-sub' : ''); });
    // 남는 수: 끝 칸에 맞추어 적고, 소수점을 찍는 칸까지 앞에 0을 채운다.
    let restText = '';
    if (o.stop) {
      const tail = ds.slice(mv + 1), rem = String(p.work.rest * P10[tail.length] + Number(tail || 0)), at = o.restDot === 'moved' ? mv : p.intLen - 1, from = Math.min(at, n - rem.length);
      const marks = Array.from({ length: n }, (_, i) => (i < from ? '' : i < n - rem.length ? '0' : rem[i - (n - rem.length)]));
      restText = marks.map((ch, i) => ch + (i === at && at < n - 1 ? '.' : '')).join('');
      out += '<tr><td></td><td></td>' + (o.rest !== undefined
        ? '<td></td>'.repeat(from) + `<td colspan="${n - from}" class="mb-ld-blank">${box(o.rest)}</td>`
        : marks.map((ch, i) => `<td>${ch}${ch !== '' && i === at && at < n - 1 ? dot() : ''}</td>`).join('')) + '</tr>';
    }
    let process = '';
    if (calcd) {
      process = `, ${o.nodot ? `몫의 숫자 ${quotText}(소수점을 찍지 않았다)` : `몫 ${o.quot !== undefined ? '□' : quotText}`}, 계산 과정: ` + rows.map((row, k) => (hidden[k] !== undefined ? '□' : row.value)).join(', ');
      if (o.stop) process += `, 남는 수 ${o.rest !== undefined ? '□' : restText}`;
    }
    return `<table class="mb-longdiv" role="img" aria-label="나눗셈 세로셈 ${p.xt} 나누기 ${yt}${show ? (o.short ? `, 나누는 수의 소수점은 오른쪽으로 ${PLACES[y.k]} 자리, 나누어지는 수의 소수점은 오른쪽으로 ${PLACES[Math.min(y.k, x.k)]} 자리 옮김` : `, 소수점을 오른쪽으로 ${PLACES[y.k]} 자리씩 옮김`) : ''}${process}">${out}</table>`;
  }
  // 세로셈 과정의 줄을 검사가 다시 셈하는 식. x 에 0을 zeros 개 붙인 자연수를 c 로 나눈다(c 는 나누는 수 y 의 소수점을 뗀 수).
  function rowExprs(y, x, zeros) {
    const c = y.n, i0 = ix(x), base = zeros ? `${i0.s}*${P10[zeros]}` : i0.s, n = S(x).replace('.', '').length + zeros;
    const pre = (i) => (i === n - 1 ? `(${base})` : `((${base}-(${base})%${P10[n - 1 - i]})/${P10[n - 1 - i]})`);
    const fl = (e) => `((${e}-${e}%${c})/${c})`;
    return {
      of: (row) => (row.sub ? `${c}*(${fl(pre(row.at))}${row.at > 0 ? `-10*${fl(pre(row.at - 1))}` : ''})` : `${pre(row.end)}-${c}*${fl(pre(row.at))}*${P10[row.end - row.at]}`),
      un: i0.un.concat([10, 100, 1000, 10000, 100000], S(y).split('.').includes(String(c)) ? [] : [c])
    };
  }
  // 수직선: 0부터 total(0.1의 개수)까지 0.1마다 눈금을 긋고 0에서부터 step(0.1의 개수)씩 뛰어 센다.
  function hopLine(total, step) {
    const u = Math.min(15, 264 / total), x = (v) => (18 + v * u).toFixed(1), y = 40, word = 'style="font-size:13px;font-weight:600"';
    let out = `<line class="mb-axis" x1="${x(0)}" y1="${y}" x2="${x(total)}" y2="${y}"/>`;
    for (let v = 0; v <= total; v += 1) { const len = v % 10 === 0 || v === total ? 6.5 : 3.5; out += `<line class="mb-axis" x1="${x(v)}" y1="${y - len}" x2="${x(v)}" y2="${y + len}"/>`; }
    for (let v = 0; v <= total; v += 10) if (v === 0 || total - v >= 3) out += `<text class="mb-axis-label" ${word} x="${x(v)}" y="${y + 23}" text-anchor="middle">${v / 10}</text>`;
    out += `<text class="mb-axis-label" ${word} x="${x(total)}" y="${y + 23}" text-anchor="middle">${fx(total, 1)}</text>`;
    for (let v = 0; v + step <= total; v += step) out += `<path class="mb-jump" style="stroke-width:1.6" d="M${x(v)} ${y - 8}Q${x(v + step / 2)} ${y - 8 - Math.min(28, step * u * 0.6 + 8)} ${x(v + step)} ${y - 8}"/>`;
    const w = Math.ceil(36 + total * u);
    return `<svg class="mb-numberline" viewBox="0 0 ${w} 70" width="${w}" role="img" aria-label="수직선: 0부터 ${fx(total, 1)}까지 0.1마다 눈금을 긋고 0에서부터 ${fx(step, 1)}씩 뛰어 세었다.">${out}</svg>`;
  }
  // 숫자 사이에 소수점을 찍을 자리(㉠㉡㉢)를 적은 수
  const spots = (text) => ex(String(text).split('').map((ch, i) => (i ? `<span style="font-size:0.7em;color:#1d4ed8;margin:0 2px;vertical-align:-0.4em">${LAB[i - 1]}</span>` : '') + ch).join(''));
  // ── 함께 쓰는 도우미 끝 ──

  // 계산 문항. specs 의 차례마다 { rule: 계산 구조의 이름, col: 세로셈으로 보인다, pick(d): { x, y } }. 같은 꼴의 식이 계산 구조만 달리하여 여러 번 실리므로 facts.rule 에 구조의 이름을 단다.
  const calcType = (id, title, ref, specs) => T(id, title, ref, (d, n) => {
    const sp = specs[n], v = sp.pick(d);
    return ask(CALC, v.x, v.y, { figure: sp.col ? sdiv(v.y, v.x) : eq(S(v.x), '/', S(v.y), '=', box()), explain: how(v.x, v.y), facts: { rule: sp.rule } });
  }, { count: specs.length });
  // 세로셈 과정의 빈칸에 쓰는 것: 가릴 줄(마지막 줄은 가리지 않는다)의 값이 서로 다르게 뽑는다.
  const withRows = (d, pick, want) => d.until(() => { const w = pick(), p = plan(w.y, w.x); return { w, p, asks: want.filter((k) => k < p.work.rows.length - 1) }; }, (m) => m.asks.length >= 1 && new Set(m.asks.map((k) => m.p.work.rows[k].value)).size === m.asks.length);
  // 잘못 계산한 세로셈. kind: 0 몫의 소수점을 옮기기 전 자리에 찍음((소수 두 자리 수)÷(소수 한 자리 수)), 1 몫의 소수점을 옮기기 전 자리에 찍음((자연수)÷(소수)), 2 소수점을 옮기며 붙인 0을 계산하지 않음.
  function wrongDiv(d, kind) {
    if (kind === 2) {
      const v = mk(d, Y.b1, () => nat(10 * d.int(2, 19)), (w) => w.x.k === 0 && w.x.n % 10 !== 0), p = plan(v.y, v.x, { upto: S(v.x).length });
      return Object.assign(v, { figure: sdiv(v.y, v.x, { steps: true, upto: S(v.x).length }), wrong: String(v.q.n / 10), why: `소수점을 옮기며 붙인 0까지 계산해야 한다. ${S(sh(v.x, 1))} ÷ ${v.y.n}에서 ${p.own} ÷ ${v.y.n} = ${v.q.n / 10}이고 남은 수가 없어도 몫의 일의 자리에 0을 써야 한다.` });
    }
    const v = kind === 0 ? mk(d, Y.b1, () => qd(d, 12, 98, 1), (w) => w.x.k === 2) : mk(d, Y.a1, () => qn(d, 12, 98), (w) => w.x.k === 0 && w.x.n <= 99 && w.x.n % 10 !== 0 && w.q.n % 10 !== 0);
    const p = plan(v.y, v.x), at = p.intLen - 1, cells = p.work.quot.map((q, i) => (q !== null ? String(q) : i === at ? '0' : '')).concat(Array.from({ length: p.n - p.work.quot.length }, () => ''));
    const wrong = cells.map((ch, i) => ch + (i === at ? '.' : '')).join('');
    return Object.assign(v, { figure: sdiv(v.y, v.x, { steps: true, given: { cells, dot: at } }), wrong, why: '몫의 소수점은 나누어지는 수의 옮긴 소수점의 자리에 맞추어 찍어야 한다.' });
  }

  B.addUnit({
    id: '6-2-3', grade: 6, semester: 2, no: 3, title: '소수의 나눗셈', version: 1,
    groups: [
      {
        id: 'prin', title: '자연수의 나눗셈을 이용한 (소수)÷(소수)', standard: STD,
        types: [
          T('pr-group', '묶어 세어 (소수)÷(소수)의 몫 알아보기', '①1 ②2 ③2 심9', (d, n) => {
            if (n === 0) {
              // 수직선에서 뛰어 센 횟수를 센다.
              const m = d.until(() => { const step = d.int(2, 6), q = d.int(3, 7); return { step, q, total: step * q }; }, (w) => w.total <= 30 && w.total % 10 !== 0), x = dec(m.total, 1), y = dec(m.step, 1), e = xq(x, y);
              return N(`수직선에서 0부터 ${S(x)}까지를 ${S(y)}씩 뛰어 세었다. □ 안에 알맞은 수는?`, m.q, {
                figure: hopLine(m.total, m.step) + eq(S(x), '/', S(y), '=', box()),
                explain: `${S(x)}에는 ${J(y, '이/가')} ${m.q}번 들어 있다. ${S(x)} ÷ ${S(y)} = ${m.q}이다.`,
                facts: { calc: [[e.s, 0]], unseen: e.un }
              });
            }
            // 같은 수를 0이 될 때까지 덜어 낸 횟수를 센다.
            const m = d.until(() => { const step = d.int(2, 9), q = d.int(3, 4); return { step, q, total: step * q }; }, (w) => w.total % 10 !== 0), x = dec(m.total, 1), y = dec(m.step, 1), e = xq(x, y);
            const parts = [S(x)]; for (let i = 0; i < m.q; i += 1) parts.push('-', S(y));
            return N(`${S(x)}에서 ${J(y, '을/를')} 0이 될 때까지 덜어 낸 뺄셈식이다. □ 안에 알맞은 수는?`, m.q, {
              figure: lines([eqs(...parts, '=', 0), eq(S(x), '/', S(y), '=', box())]),
              explain: `${S(x)}에서 ${J(y, '을/를')} ${m.q}번 빼면 0이 된다. ${S(x)} ÷ ${S(y)} = ${m.q}이다.`,
              facts: { calc: [[e.s, 0]], unseen: e.un }
            });
          }, { count: 2 }),
          T('pr-unit', '단위를 바꾸어 자연수의 나눗셈으로 계산하기', '①2 ②1 ③3', (d, n) => {
            // 첫째 문항은 cm를 mm로(소수 한 자리 수), 둘째 문항은 m를 cm로(소수 두 자리 수) 바꾼다.
            const k = n + 1, v = mk(d, n === 0 ? Y.a1 : Y.b2, () => qn(d, 2, 19), (w) => w.x.k === k && w.q.n !== 10), [big, small] = n === 0 ? ['cm', 'mm'] : ['m', 'cm'], i = ix(v.x), j = ix(v.y);
            return M(`길이가 ${S(v.x)} ${big}인 철사를 ${S(v.y)} ${big}씩 자르려고 한다. 1 ${big} = ${P10[k]} ${small}임을 이용하여 몇 도막이 되는지 구하는 과정이다. ㉠, ㉡, ㉢에 알맞은 수는?`, [inp(LAB[0], nat(v.x.n)), inp(LAB[1], nat(v.y.n)), inp(LAB[2], v.q)], {
              figure: lines([`${S(v.x)} ${big} = ${box(LAB[0])} ${small}`, `${S(v.y)} ${big} = ${box(LAB[1])} ${small}`, eq(S(v.x), '/', S(v.y), '=', box(LAB[0]), '/', box(LAB[1]), '=', box(LAB[2]))]),
              explain: `${S(v.x)} ${big}는 ${v.x.n} ${small}, ${S(v.y)} ${big}는 ${v.y.n} ${small}이다. ${v.x.n} ÷ ${v.y.n} = ${v.q.n}이므로 ${S(v.x)} ÷ ${S(v.y)} = ${v.q.n}이다.`,
              facts: { calc: [[i.s, 0], [j.s, 1], [`${i.s}/${j.s}`, 2]], unseen: i.un.concat(j.un) }
            });
          }, { count: 2 }),
          T('pr-ten', '똑같이 10배, 100배 하여 자연수의 나눗셈으로 계산하기', '①3 ②3 ③4 심3', (d, n) => {
            if (n === 2) {
              // 몇 배 하였는지 묻는다.
              const k = d.pick([1, 2]), v = mk(d, k === 1 ? Y.a1 : Y.b2, () => qn(d, 2, 29), (w) => w.x.k === k), i = ix(v.x);
              return N(`${S(v.x)} ÷ ${J(v.y, '을/를')} 자연수의 나눗셈 ${v.x.n} ÷ ${josa(v.y.n, '으로/로')} 바꾸어 계산하였다. 나누어지는 수와 나누는 수를 똑같이 몇 배 하였는가?`, P10[k], {
                unit: '배', explain: `${josa(v.x.n, '은/는')} ${S(v.x)}의 ${P10[k]}배이고 ${josa(v.y.n, '은/는')} ${S(v.y)}의 ${P10[k]}배이다. 두 수를 똑같이 ${P10[k]}배 하였다.`,
                facts: { calc: [[`${v.x.n}*${P10[k]}/${i.s}`, 0]], unseen: i.un }
              });
            }
            // 첫째 문항은 10배(소수 한 자리 수끼리), 둘째 문항은 100배(소수 두 자리 수끼리).
            const k = n + 1, v = mk(d, k === 1 ? Y.a1 : Y.b2, () => qn(d, 2, 39), (w) => w.x.k === k && w.q.n !== 10), i = ix(v.x), j = ix(v.y);
            return M(`나누어지는 수와 나누는 수를 똑같이 ${P10[k]}배 하여 계산하려고 한다. ㉠, ㉡, ㉢에 알맞은 수는?`, [inp(LAB[0], nat(v.x.n)), inp(LAB[1], nat(v.y.n)), inp(LAB[2], v.q)], {
              figure: lines([eq(S(v.x), '/', S(v.y)), '→ ' + eq(box(LAB[0]), '/', box(LAB[1]), '=', box(LAB[2]))]),
              explain: `${S(v.x)}의 ${P10[k]}배는 ${v.x.n}, ${S(v.y)}의 ${P10[k]}배는 ${v.y.n}이다. 두 수를 똑같이 ${P10[k]}배 하여도 몫은 변하지 않으므로 ${S(v.x)} ÷ ${S(v.y)} = ${v.x.n} ÷ ${v.y.n} = ${v.q.n}이다.`,
              facts: { calc: [[i.s, 0], [j.s, 1], [`${i.s}/${j.s}`, 2]], unseen: i.un.concat(j.un), rule: ['ten', 'hundred'][n] }
            });
          }, { count: 3 }),
          T('pr-use-nat', '자연수의 나눗셈의 몫을 보고 (소수)÷(소수)의 몫 알기', '①3 ②7 ③5', (d) => {
            const m = d.until(() => { const c = d.bool() ? d.int(3, 9) : nz(d, 12, 98), Q = d.int(3, 39); return { c, Q, X: c * Q }; }, (w) => w.X >= 100 && w.X <= 999 && w.X % 10 !== 0 && w.Q !== 10);
            const rows = [1, 2].map((k) => [dec(m.X, k), dec(m.c, k)]), es = rows.map(([x, y]) => xq(x, y));
            return M(`${m.X} ÷ ${m.c} = ${m.Q}이다. ㉠, ㉡에 알맞은 수는?`, rows.map((r, j) => inp(LAB[j], nat(m.Q))), {
              figure: lines(rows.map(([x, y], j) => eq(S(x), '/', S(y), '=', box(LAB[j])))),
              explain: `${rows.map(([x, y], j) => `${S(x)} ÷ ${J(y, '은/는')} ${m.X} ÷ ${m.c}의 두 수를 똑같이 ${part(j + 1)}배 한 식`).join('이고, ')}이다. 두 수를 똑같이 줄이면 몫은 변하지 않으므로 두 식의 몫은 모두 ${m.Q}이다.`,
              facts: { calc: es.map((e, j) => [e.s, j]), unseen: es.reduce((all, e) => all.concat(e.un), []) }
            });
          }),
          T('pr-back', '똑같이 10배, 100배 하기 전의 나눗셈식 찾기', '①6 ②11 ③8 심6', (d) => {
            const k = d.pick([1, 2]), v = mk(d, k === 1 ? Y.a1 : Y.b2, () => qn(d, 2, 49), (w) => w.x.k === k && w.x.n >= 100 && w.q.n !== 10), X = v.x.n, c = v.y.n;
            return M(`어떤 나눗셈식의 나누어지는 수와 나누는 수를 똑같이 ${P10[k]}배 하였더니 ${X} ÷ ${josa(c, '이/가')} 되었다. 처음 나눗셈식 ㉠ ÷ ㉡ = ㉢에서 ㉠, ㉡, ㉢에 알맞은 수는?`, [inp(LAB[0], v.x), inp(LAB[1], v.y), inp(LAB[2], v.q)], {
              explain: `${X}의 ${part(k)}배는 ${S(v.x)}, ${c}의 ${part(k)}배는 ${S(v.y)}이다. 처음 식은 ${S(v.x)} ÷ ${S(v.y)}이고 몫은 ${X} ÷ ${c}의 몫과 같은 ${v.q.n}이다.`,
              facts: { calc: [[`${X}/${P10[k]}`, 0], [`${c}/${P10[k]}`, 1], [`${X}/${c}`, 2]] }
            });
          }),
          T('pr-same-pick', '몫이 같은 나눗셈 고르기', '①15 ②9 ③7 심5', (d) => {
            // 두 수의 소수점을 같은 자리만큼 옮긴 식만 몫이 같다. 틀린 보기는 한쪽만 옮기거나 서로 다른 자리만큼 옮긴 식이다.
            const v = d.bool() ? mk(d, Y.b1, () => (d.bool() ? qd(d, 12, 98, 1) : qn(d, 2, 9)), (w) => w.x.k === 2) : mk(d, Y.s2, () => qn(d, 12, 98), (w) => w.x.k === 2);
            const e = d.pick([1, 2]), rows = d.shuffle([[e, e]].concat(d.shuffle([[1, 0], [0, 1], [2, 1], [1, 2]]).slice(0, 3))).map(([p, q]) => ({ x: sh(v.x, p), y: sh(v.y, q), hit: p === q }));
            const ms = rows.map((r) => xmil(r.x, r.y)), hit = rows.findIndex((r) => r.hit);
            return C(`${S(v.x)} ÷ ${J(v.y, '과/와')} 몫이 같은 것은?`, rows.map((r) => eq(S(r.x), '/', S(r.y))), hit, {
              explain: `나누어지는 수와 나누는 수에 같은 수를 곱하면 몫은 변하지 않는다. ${S(rows[hit].x)} ÷ ${J(rows[hit].y, '은/는')} 두 수를 똑같이 ${P10[e]}배 한 식이므로 몫이 같다.`,
              facts: { choose: { exprs: ms.map((m) => m.s), rule: 'equals', target: xmil(v.x, v.y).v }, unseen: ms.reduce((all, m) => all.concat(m.un), []) }
            });
          }),
          T('pr-same-odd', '몫이 다른 나눗셈 찾기', '①7 ②9 심5', (d) => {
            // 자연수의 나눗셈에서 두 수를 똑같이 1/10배, 1/100배 한 식은 몫이 같다. 한 식만 두 수의 소수점을 서로 다른 자리만큼 옮겼다.
            const m = d.until(() => { const c = nz(d, 12, 48), Q = d.int(2, 9); return { c, Q, X: c * Q }; }, (w) => w.X % 10 !== 0 && w.X >= 100), odd = d.bool() ? [1, 2] : [2, 1];
            const rows = d.shuffle([[0, 0], [1, 1], [2, 2], odd]).map(([p, q]) => ({ x: dec(m.X, p), y: dec(m.c, q), odd: p !== q })), ms = rows.map((r) => xmil(r.x, r.y)), hit = rows.findIndex((r) => r.odd);
            return C('계산하지 않고 알아볼 때, 몫이 나머지 셋과 다른 하나는?', LAB, hit, {
              figure: tagged(rows.map((r) => eq(S(r.x), '/', S(r.y)))),
              explain: `${m.X} ÷ ${m.c}의 두 수를 똑같이 ${part(1)}배, ${part(2)}배 한 식은 몫이 ${josa(m.Q, '으로/로')} 같다. ${LAB[hit]}은 나누어지는 수와 나누는 수의 소수점을 서로 다른 자리만큼 옮긴 식이므로 몫이 다르다.`,
              facts: { choose: { exprs: ms.map((e) => e.s), rule: 'odd' }, unseen: ms.reduce((all, e) => all.concat(e.un), []) }
            });
          }),
          T('pr-same-blank', '몫이 같도록 나눗셈식의 빈칸 채우기', '①15 ②3·9 심5', (d) => {
            // 7.8 ÷ 0.26 = ㉠ ÷ 2.6 = 780 ÷ ㉡: 두 수의 소수점을 한 자리씩, 두 자리씩 옮긴다.
            const v = mk(d, Y.b2, () => (d.bool() ? qn(d, 2, 60) : qd(d, 12, 98, 1)), (w) => w.x.k === 1 && w.x.n >= 11), i = ix(v.x), j = ix(v.y);
            return M('몫이 같은 나눗셈식을 만들려고 한다. ㉠, ㉡에 알맞은 수는?', [inp(LAB[0], sh(v.x, 1)), inp(LAB[1], sh(v.y, 2))], {
              figure: lines([eq(S(v.x), '/', S(v.y), '=', box(LAB[0]), '/', S(sh(v.y, 1))), eq(S(v.x), '/', S(v.y), '=', S(sh(v.x, 2)), '/', box(LAB[1]))]),
              explain: `${J(sh(v.y, 1), '은/는')} ${S(v.y)}의 10배이므로 ㉠은 ${S(v.x)}의 10배인 ${S(sh(v.x, 1))}이다. ${J(sh(v.x, 2), '은/는')} ${S(v.x)}의 100배이므로 ㉡은 ${S(v.y)}의 100배인 ${v.y.n}이다.`,
              facts: { calc: [[i.s, 0], [j.s, 1]], unseen: i.un.concat(j.un) }
            });
          }),
          T('pr-same-wrong', '자연수의 나눗셈을 잘못 이용한 계산 찾기', '①7 ②9 심5·7', (d) => {
            // 줄의 꼴: 0 둘 다 1/10배(몫 그대로), 1 둘 다 1/100배(몫 그대로), 2 나누는 수만 1/10배(몫은 10배), 3 나누어지는 수만 1/10배(몫은 1/10배). 한 줄만 몫을 잘못 적었다.
            const m = d.until(() => { const c = d.int(2, 9), Q = nz(d, 12, 98); return { c, Q, X: c * Q }; }, (w) => w.X % 10 !== 0 && w.X >= 100), X = m.X, c = m.c, Q = m.Q;
            const kinds = d.shuffle([0, 1, 2, 3]).slice(0, 3), bad = d.int(0, 2);
            const rows = kinds.map((kind, i) => {
              const x = [dec(X, 1), dec(X, 2), nat(X), dec(X, 1)][kind], y = [dec(c, 1), dec(c, 2), dec(c, 1), nat(c)][kind], right = [nat(Q), nat(Q), nat(Q * 10), dec(Q, 1)][kind], slip = [dec(Q, 1), dec(Q, 2), nat(Q), nat(Q)][kind];
              return { x, y, right, shown: i === bad ? slip : right, why: ['두 수를 똑같이 ' + part(1) + '배 하였으므로 몫은 변하지 않는다', '두 수를 똑같이 ' + part(2) + '배 하였으므로 몫은 변하지 않는다', '나누는 수만 ' + part(1) + '배 하였으므로 몫은 10배가 된다', '나누어지는 수만 ' + part(1) + '배 하였으므로 몫도 ' + part(1) + '배가 된다'][kind] };
            });
            return C(`${X} ÷ ${c} = ${Q}이다. 이를 이용하여 계산한 것 가운데 잘못된 것은?`, THREE, bad, {
              figure: tagged(rows.map((r) => eq(S(r.x), '/', S(r.y), '=', S(r.shown)))),
              explain: `${LAB[bad]}은 ${rows[bad].why}. 바르게 계산하면 ${S(rows[bad].x)} ÷ ${S(rows[bad].y)} = ${S(rows[bad].right)}이다.`,
              facts: { claimed: rows.map((r) => [xmil(r.x, r.y).s, r.shown.n * P10[3 - r.shown.k]]), claimedWant: false }
            });
          }),
          T('pr-talk', '소수점을 옮겨 계산하는 방법을 잘못 말한 사람 찾기', '②10 ①15 심7', (d) => {
            // 6.44 ÷ 0.7: 64.4 ÷ 7, 644 ÷ 70과 몫이 같고 몫은 9.2이다. 틀린 말은 「644 ÷ 7과 몫이 같다」(한쪽만 한 자리 더 옮김)이거나 몫의 소수점을 잘못 찍은 것이다.
            const v = mk(d, Y.s1, () => qd(d, 12, 98, 1), (w) => w.x.k === 2), who = d.shuffle(NAMES).slice(0, 3), kind = d.int(0, 1), c = v.y.n, base = xmil(v.x, v.y).v;
            const p1 = kind === 0 ? [sh(v.x, 2), nat(c)] : [sh(v.x, 1), nat(c)], shown = kind === 1 ? dec(v.q.n, 2) : v.q;
            const rows = d.shuffle([
              { ok: kind !== 0, text: `${S(p1[0])} ÷ ${josa(c, '과/와')} 몫이 같다.`, fact: [xmil(p1[0], p1[1]).s, base] },
              { ok: true, text: `${S(sh(v.x, 2))} ÷ ${josa(c * 10, '과/와')} 몫이 같다.`, fact: [xmil(sh(v.x, 2), nat(c * 10)).s, base] },
              { ok: kind !== 1, text: `몫은 ${S(shown)}이다.`, fact: [xmil(v.x, v.y).s, shown.n * P10[3 - shown.k]] }
            ]), hit = rows.findIndex((r) => !r.ok);
            return C(`${S(v.x)} ÷ ${S(v.y)}의 계산에 대하여 말하였다. 잘못 말한 사람은?`, who, hit, {
              figure: lines(rows.map((r, i) => said(who[i], r.text))),
              explain: `나누어지는 수와 나누는 수의 소수점을 똑같이 한 자리씩 옮기면 ${S(sh(v.x, 1))} ÷ ${c}, 두 자리씩 옮기면 ${S(sh(v.x, 2))} ÷ ${c * 10}이고 몫은 모두 ${S(v.q)}이다. ${name(who[hit], '이/가')} 잘못 말하였다.`,
              facts: { claimed: rows.map((r) => r.fact), claimedWant: false }
            });
          }),
          T('pr-why', '두 나눗셈의 몫이 같은 까닭 알기', '②10 ③4·12', (d) => {
            const k = d.pick([1, 2]), v = mk(d, k === 1 ? Y.a1 : Y.b2, () => qn(d, 2, 39), (w) => w.x.k === k && w.q.n !== 10), t = P10[k];
            const rows = d.shuffle([[`나누어지는 수와 나누는 수를 똑같이 ${t}배 하였기 때문이다.`, true], [`나누어지는 수만 ${t}배 하였기 때문이다.`, false], [`나누어지는 수와 나누는 수에 똑같이 ${josa(t, '을/를')} 더하였기 때문이다.`, false], [`나누는 수만 ${t}배 하였기 때문이다.`, false]]);
            return C(`${S(v.x)} ÷ ${J(v.y, '과/와')} ${v.x.n} ÷ ${v.y.n}의 몫이 같은 까닭으로 알맞은 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              explain: `${josa(v.x.n, '은/는')} ${S(v.x)}의 ${t}배이고 ${josa(v.y.n, '은/는')} ${S(v.y)}의 ${t}배이다. 나누어지는 수와 나누는 수에 같은 수를 곱하면 몫은 변하지 않는다.`,
              facts: { truth: rows.map((r) => r[1]), want: true }
            });
          }),
          T('pr-frac', '분수의 나눗셈으로 고쳐 계산하기', '①4 ②5 ③9 심1', (d, n) => {
            if (n === 2) {
              // 몫이 소수: 0.7 ÷ 0.2 = 7/10 ÷ 2/10 = 7 ÷ 2 = 3.5
              const v = mk(d, Y.s1, () => qd(d, 12, 98, 1), (w) => w.x.k === 1 && w.x.n <= 99), i = ix(v.x);
              return M('소수를 분수로 고쳐 계산하는 과정이다. ㉠, ㉡에 알맞은 수는?', [inp(LAB[0], nat(v.x.n)), inp(LAB[1], v.q)], {
                figure: lines([eq(S(v.x), '/', S(v.y), '=', frac(v.x.n, 10), '/', frac(v.y.n, 10)), eq('=', box(LAB[0]), '/', v.y.n, '=', box(LAB[1]))]),
                explain: `분모가 같은 분수의 나눗셈은 분자끼리 나눈다. ${v.x.n} ÷ ${v.y.n} = ${S(v.q)}이다.`,
                facts: { calc: [[i.s, 0], [`${S(v.x)}/${S(v.y)}`, 1]], unseen: i.un }
              });
            }
            // 첫째 문항은 분모가 10(소수 한 자리 수끼리), 둘째 문항은 분모가 100(소수 두 자리 수끼리).
            const k = n + 1, den = P10[k], v = mk(d, k === 1 ? Y.a1 : Y.b2, () => qn(d, 2, 29), (w) => w.x.k === k && w.q.n !== 10), i = ix(v.x), j = ix(v.y), e = xq(v.x, v.y);
            const fig = n === 0
              ? [eq(S(v.x), '/', S(v.y), '=', frac(v.x.n, den), '/', frac(box(LAB[0]), den)), eq('=', v.x.n, '/', box(LAB[0]), '=', box(LAB[1]))]
              : [eq(S(v.x), '/', S(v.y), '=', frac(box(LAB[0]), den), '/', frac(v.y.n, den)), eq('=', box(LAB[0]), '/', v.y.n, '=', box(LAB[1]))];
            return M('소수를 분수로 고쳐 계산하는 과정이다. ㉠, ㉡에 알맞은 수는?', [inp(LAB[0], nat(n === 0 ? v.y.n : v.x.n)), inp(LAB[1], v.q)], {
              figure: lines(fig),
              explain: `${S(v.x)} = ${frac(v.x.n, den)}, ${S(v.y)} = ${frac(v.y.n, den)}이다. 분모가 같은 분수의 나눗셈은 분자끼리 나누므로 ${v.x.n} ÷ ${v.y.n} = ${v.q.n}이다.`,
              facts: { calc: [[n === 0 ? j.s : i.s, 0], [e.s, 1]], unseen: i.un.concat(j.un, e.un) }
            });
          }, { count: 3 }),
          T('pr-frac-mixed', '분모를 같게 고쳐 분수의 나눗셈으로 계산하기', '①18 ②5 ③10', (d, n) => {
            if (n === 0) {
              // 자릿수가 다른 소수: 5.88 ÷ 1.4 = 588/100 ÷ 140/100
              const v = mk(d, Y.b1, () => qd(d, 12, 98, 1), (w) => w.x.k === 2), j = ix(v.y);
              return M('자릿수가 다른 두 소수를 분모가 같은 분수로 고쳐 계산하는 과정이다. ㉠, ㉡에 알맞은 수는?', [inp(LAB[0], nat(v.y.n * 10)), inp(LAB[1], v.q)], {
                figure: lines([eq(S(v.x), '/', S(v.y), '=', frac(v.x.n, 100), '/', frac(box(LAB[0]), 100)), eq('=', v.x.n, '/', box(LAB[0]), '=', box(LAB[1]))]),
                explain: `${S(v.y)} = ${frac(v.y.n, 10)} = ${frac(v.y.n * 10, 100)}이다. 분자끼리 나누면 ${v.x.n} ÷ ${v.y.n * 10} = ${S(v.q)}이다.`,
                facts: { calc: [[`${j.s}*10`, 0], [`${S(v.x)}/${S(v.y)}`, 1]], unseen: j.un.concat([10]) }
              });
            }
            // (자연수)÷(소수): 36 ÷ 2.4 = 360/10 ÷ 24/10
            const v = mk(d, Y.b1, () => qn(d, 2, 49), (w) => w.x.k === 0 && w.x.n <= 99 && w.q.n !== 10), e = xq(v.x, v.y);
            return M('자연수와 소수를 분모가 같은 분수로 고쳐 계산하는 과정이다. ㉠, ㉡에 알맞은 수는?', [inp(LAB[0], nat(v.x.n * 10)), inp(LAB[1], v.q)], {
              figure: lines([eq(v.x.n, '/', S(v.y), '=', frac(box(LAB[0]), 10), '/', frac(v.y.n, 10)), eq('=', box(LAB[0]), '/', v.y.n, '=', box(LAB[1]))]),
              explain: `${v.x.n} = ${frac(v.x.n * 10, 10)}, ${S(v.y)} = ${frac(v.y.n, 10)}이다. 분자끼리 나누면 ${v.x.n * 10} ÷ ${v.y.n} = ${v.q.n}이다.`,
              facts: { calc: [[`${v.x.n}*10`, 0], [e.s, 1]], unseen: e.un.concat([10]) }
            });
          }, { count: 2 }),
          T('pr-frac-pick', '자릿수가 다른 소수의 나눗셈을 분수의 나눗셈으로 바르게 고친 것 고르기', '②6 심2', (d) => {
            // 1.8 ÷ 0.15 = 180/100 ÷ 15/100. 틀린 보기는 소수와 크기가 다른 분수로 고친 것이다(18/10 ÷ 15/10, 18/100 ÷ 15/100, 180/100 ÷ 15/10).
            const v = d.bool() ? mk(d, Y.b2, () => qn(d, 2, 60), (w) => w.x.k === 1 && w.x.n >= 11) : mk(d, Y.b1, () => qd(d, 12, 98, 1), (w) => w.x.k === 2);
            const a = v.x.n, b = v.y.n, A = a * P10[2 - v.x.k], Bn = b * P10[2 - v.y.k], truth = xmil(v.x, v.y).v;
            const rows = d.shuffle([[A, 100, Bn, 100], [a, 10, b, 10], [a, 100, b, 100], v.x.k === 1 ? [A, 100, b, 10] : [a, 10, Bn, 100]]);
            const good = rows.map(([p, dp, q, dq]) => p * dq * 1000 / (dp * q) === truth);
            return C(`${S(v.x)} ÷ ${J(v.y, '을/를')} 분수의 나눗셈으로 바르게 고친 것은?`, rows.map(([p, dp, q, dq]) => eq(frac(p, dp), '/', frac(q, dq))), good.indexOf(true), {
              explain: `${S(v.x)} = ${frac(A, 100)}, ${S(v.y)} = ${frac(Bn, 100)}이다. 분모가 같으므로 ${A} ÷ ${josa(Bn, '으로/로')} 계산하면 몫은 ${S(v.q)}이다.`,
              facts: { claimed: rows.map(([p, dp, q, dq]) => [`${p}*${dq}*1000/(${dp}*${q})`, truth]), claimedWant: true }
            });
          }),
          T('pr-frac-where', '분수의 나눗셈으로 고쳐 계산한 과정에서 처음 잘못된 곳 찾기', '①20 ②6 심2', (d) => {
            // kind 0: 분모가 다른데 분자끼리 나눔(4.32 ÷ 1.6 = 432 ÷ 16), 1: 끝에서 몫을 분모가 100인 분수로 적음(12 ÷ 0.75 = 16/100), 2: 소수 두 자리 수를 분모가 10인 분수로 고침(1.8 ÷ 0.15 = 18/10 ÷ 15/10).
            // 줄마다 값(1000배 한 정수)을 함께 적는다: 처음 식, ㉠, ㉡, ㉢.
            const kind = d.int(0, 2);
            let v, steps, values, why;
            if (kind === 0) {
              v = mk(d, Y.b1, () => qd(d, 12, 98, 1), (w) => w.x.k === 2); const t = xmil(v.x, v.y).v;
              steps = [eq(frac(v.x.n, 100), '/', frac(v.y.n, 10)), eq(v.x.n, '/', v.y.n), ex(String(v.q.n))]; values = [t, t, t * 10, t * 10];
              why = `분모가 다르면 분자끼리 나눌 수 없다. ${fj(v.y.n, 10, '을/를')} ${fj(v.y.n * 10, 100, '으로/로')} 고쳐 ${v.x.n} ÷ ${josa(v.y.n * 10, '을/를')} 계산해야 한다.`;
            } else if (kind === 1) {
              v = mk(d, Y.b2, () => qn(d, 12, 98), (w) => w.x.k === 0 && w.x.n <= 99); const t = xmil(v.x, v.y).v;
              steps = [eq(frac(v.x.n * 100, 100), '/', frac(v.y.n, 100)), eq(v.x.n * 100, '/', v.y.n), eq(frac(v.q.n, 100), '=', fx(v.q.n, 2))]; values = [t, t, t, t / 100];
              why = `분자끼리 나눈 ${v.x.n * 100} ÷ ${v.y.n} = ${josa(v.q.n, '이/가')} 몫이다. 몫에 분모 100을 다시 붙이지 않는다.`;
            } else {
              v = mk(d, Y.b2, () => qn(d, 2, 60), (w) => w.x.k === 1 && w.x.n >= 11 && quo(nat(w.x.n), nat(w.y.n)).k >= 1); const t = xmil(v.x, v.y).v, low = quo(nat(v.x.n), nat(v.y.n));
              steps = [eq(frac(v.x.n, 10), '/', frac(v.y.n, 10)), eq(v.x.n, '/', v.y.n), ex(S(low))]; values = [t, t / 10, t / 10, t / 10];
              why = `${J(v.y, '은/는')} 소수 두 자리 수이므로 ${frac(v.y.n, 100)}이다. ${S(v.x)} = ${fj(v.x.n * 10, 100, '으로/로')} 고쳐 ${v.x.n * 10} ÷ ${josa(v.y.n, '을/를')} 계산해야 한다.`;
            }
            return C(`${S(v.x)} ÷ ${J(v.y, '을/를')} 분수의 나눗셈으로 고쳐 계산한 과정에서 처음으로 잘못된 곳은?`, THREE, [1, 2, 0][kind], {
              figure: lines([eq(S(v.x), '/', S(v.y))].concat(steps.map((step, i) => tag(LAB[i]) + eq('=') + ' ' + step))),
              explain: `${why} 바르게 계산하면 ${told(v.x, v.y)}이다.`,
              facts: { claimed: [0, 1, 2].map((i) => [String(values[i]), values[i + 1]]), claimedWant: false }
            });
          }),
          T('pr-tenth', '나누는 수나 나누어지는 수의 소수점만 옮길 때 몫의 변화', '①19 ②8 ③6 심4', (d, n) => {
            if (n === 0) {
              // 나누는 수가 1/10배, 1/100배가 되면 몫은 10배, 100배가 된다.
              const m = d.until(() => { const c = d.int(2, 9), Q = d.int(2, 19); return { c, Q, X: c * Q }; }, (w) => w.X <= 99 && w.Q !== 10), ys = [dec(m.c, 1), dec(m.c, 2)], es = ys.map((y) => xq(nat(m.X), y));
              return M(`${m.X} ÷ ${m.c} = ${m.Q}이다. ㉠, ㉡에 알맞은 수는?`, [inp(LAB[0], nat(m.Q * 10)), inp(LAB[1], nat(m.Q * 100))], {
                figure: lines(ys.map((y, j) => eq(m.X, '/', S(y), '=', box(LAB[j])))),
                explain: `나누어지는 수가 같을 때 나누는 수가 ${part(1)}배, ${part(2)}배가 되면 몫은 10배, 100배가 된다. ${m.Q}의 10배는 ${m.Q * 10}, 100배는 ${m.Q * 100}이다.`,
                facts: { calc: es.map((e, j) => [e.s, j]), unseen: es.reduce((all, e) => all.concat(e.un), []), rule: 'tenthDivisor' }
              });
            }
            // 나누어지는 수가 10배, 100배가 되면 몫도 10배, 100배가 된다.
            const m = d.until(() => { const c = d.int(2, 9), Q = nz(d, 12, 98); return { c, Q, X: c * Q }; }, (w) => w.X % 10 !== 0 && w.X >= 100), y = dec(m.c, 2), xs = [dec(m.X, 1), nat(m.X)], es = xs.map((x) => xq(x, y));
            return M(`${fx(m.X, 2)} ÷ ${S(y)} = ${m.Q}이다. ㉠, ㉡에 알맞은 수는?`, [inp(LAB[0], nat(m.Q * 10)), inp(LAB[1], nat(m.Q * 100))], {
              figure: lines(xs.map((x, j) => eq(S(x), '/', S(y), '=', box(LAB[j])))),
              explain: `나누는 수가 같을 때 나누어지는 수가 10배, 100배가 되면 몫도 10배, 100배가 된다. ${m.Q}의 10배는 ${m.Q * 10}, 100배는 ${m.Q * 100}이다.`,
              facts: { calc: es.map((e, j) => [e.s, j]), unseen: es.reduce((all, e) => all.concat(e.un), []), rule: 'tenthDividend' }
            });
          }, { count: 2 }),
          T('pr-ratio', '몫이 같은 두 나눗셈에서 나누어지는 수는 몇 배', '②8', (d) => {
            // ㉠ ÷ 0.62 = 7, ㉡ ÷ 62 = 7: 몫이 같고 나누는 수가 100배이면 나누어지는 수도 100배이다.
            const k = d.pick([1, 2]), c = k === 1 ? d.int(2, 9) : nz(d, 12, 98), Q = d.int(3, 9), y = dec(c, k), i = ix(y);
            return N('㉠과 ㉡은 다음 식에 알맞은 수이다. 계산하지 않고 알아볼 때, ㉡은 ㉠의 몇 배인가?', P10[k], {
              unit: '배', figure: lines([eq('㉠', '/', S(y), '=', Q), eq('㉡', '/', c, '=', Q)]),
              explain: `${josa(c, '은/는')} ${S(y)}의 ${P10[k]}배이다. 몫이 같을 때 나누는 수가 ${P10[k]}배이면 나누어지는 수도 ${P10[k]}배이다.`,
              facts: { calc: [[`${c}*${Q}*${P10[k]}/(${i.s}*${Q})`, 0]], unseen: i.un.concat([P10[k]]) }
            });
          })
        ]
      },
      {
        id: 'same', title: '자릿수가 같은 (소수)÷(소수)', standard: STD,
        types: [
          calcType('sm-one', '(소수 한 자리 수)÷(소수 한 자리 수)', '①8 ②13 ③13 심10', [
            { rule: 'oneNat1', pick: (d) => mk(d, Y.a1, () => qn(d, 2, 9), (w) => w.x.k === 1 && w.x.n >= 10) },                                  // 7.2 ÷ 0.8 = 9
            { rule: 'oneNat2', col: true, pick: (d) => mk(d, Y.a1, () => qn(d, 11, 49), (w) => w.x.k === 1) }                                     // 77.7 ÷ 2.1 = 37
          ]),
          calcType('sm-two', '(소수 두 자리 수)÷(소수 두 자리 수)', '①9 ②15 ③14 심10', [
            { rule: 'twoNatSmall', pick: (d) => mk(d, Y.s2, () => qn(d, 3, 160), (w) => w.x.k === 2) },                                           // 3.28 ÷ 0.02 = 164
            { rule: 'twoNat', col: true, pick: (d) => mk(d, Y.b2, () => qn(d, 2, 39), (w) => w.x.k === 2 && w.x.n >= 100) }                       // 5.76 ÷ 0.32 = 18
          ]),
          calcType('sm-dec', '자릿수가 같고 몫이 소수인 (소수)÷(소수)', '②14 ③15', [
            { rule: 'oneDec', pick: (d) => mk(d, Y.a1, () => qd(d, 12, 495, 1), (w) => w.x.k === 1) },                                            // 5.5 ÷ 2.2 = 2.5
            { rule: 'twoDec', col: true, pick: (d) => mk(d, Y.b2, () => qd(d, 12, 98, 1), (w) => w.x.k === 2) },                                  // 0.78 ÷ 0.12 = 6.5
            { rule: 'oneDec2', col: true, pick: (d) => mk(d, Y.a1, () => qd(d, 105, 995, 2), (w) => w.x.k === 1) }                                // 8.4 ÷ 2.5 = 3.36
          ])
        ]
      },
      {
        id: 'diff', title: '자릿수가 다른 (소수)÷(소수)', standard: STD,
        types: [
          calcType('df-21', '(소수 두 자리 수)÷(소수 한 자리 수)', '①12 ②16 ③16 심11', [
            { rule: 'twoOneSmall', pick: (d) => mk(d, Y.s1, () => qd(d, 12, 98, 1), (w) => w.x.k === 2) },                                        // 1.54 ÷ 0.7 = 2.2
            { rule: 'twoOne', col: true, pick: (d) => mk(d, Y.b1, () => qd(d, 12, 98, 1), (w) => w.x.k === 2) },                                  // 8.88 ÷ 2.4 = 3.7
            { rule: 'twoOneLess', pick: (d) => mk(d, Y.b1, () => ({ n: d.int(2, 9), k: 1 }), (w) => w.x.k === 2) },                               // 1.08 ÷ 1.2 = 0.9
            { rule: 'twoOneDec2', col: true, pick: (d) => mk(d, Y.a1, () => qd(d, 105, 495, 2), (w) => w.x.k === 2) }                             // 2.12 ÷ 0.8 = 2.65
          ]),
          calcType('df-12', '(소수 한 자리 수)÷(소수 두 자리 수)', '①13 ②17 ③17 심11', [
            { rule: 'oneTwoNat', pick: (d) => mk(d, Y.a2, () => qn(d, 2, 150), (w) => w.x.k === 1) },                                             // 13.8 ÷ 0.23 = 60
            { rule: 'oneTwoDec', col: true, pick: (d) => mk(d, Y.b2, () => qd(d, 12, 295, 1), (w) => w.x.k === 1) }                               // 5.2 ÷ 0.25 = 20.8
          ]),
          T('df-move', '나누는 수가 자연수가 되도록 소수점을 옮겨 계산하기', '②4 ①10', (d, n) => {
            if (n === 0) {
              // 1.75 ÷ 3.5 = 17.5 ÷ 35: 소수점을 한 자리씩 옮긴다(나누어지는 수는 소수로 남는다).
              const v = mk(d, Y.b1, () => (d.bool() ? { n: d.int(2, 9), k: 1 } : qd(d, 12, 98, 1)), (w) => w.x.k === 2);
              return M('나누는 수가 자연수가 되도록 소수점을 옮겨 계산하려고 한다. ㉠, ㉡에 알맞은 수는?', [inp(LAB[0], sh(v.x, 1)), inp(LAB[1], v.q)], {
                figure: lines([eq(S(v.x), '/', S(v.y), '=', box(LAB[0]), '/', v.y.n, '=', box(LAB[1]))]),
                explain: `${J(v.y, '을/를')} 자연수 ${josa(v.y.n, '으로/로')} 만들려면 소수점을 오른쪽으로 한 자리 옮긴다. 나누어지는 수의 소수점도 한 자리 옮기면 ${S(sh(v.x, 1))}이다. ${S(sh(v.x, 1))} ÷ ${v.y.n} = ${S(v.q)}이다.`,
                facts: { calc: [[`${S(v.x)}*10`, 0], [`${S(v.x)}/${S(v.y)}`, 1]], unseen: [10], rule: 'moveTwoOne' }
              });
            }
            // 5.2 ÷ 0.25 = 520 ÷ 25: 소수점을 두 자리씩 옮긴다(나누어지는 수에 0을 붙인다).
            const v = mk(d, Y.b2, () => qd(d, 12, 295, 1), (w) => w.x.k === 1), i = ix(v.x);
            return M('나누는 수가 자연수가 되도록 소수점을 옮겨 계산하려고 한다. ㉠, ㉡에 알맞은 수는?', [inp(LAB[0], sh(v.x, 2)), inp(LAB[1], v.q)], {
              figure: lines([eq(S(v.x), '/', S(v.y), '=', box(LAB[0]), '/', v.y.n, '=', box(LAB[1]))]),
              explain: `${J(v.y, '을/를')} 자연수 ${josa(v.y.n, '으로/로')} 만들려면 소수점을 오른쪽으로 두 자리 옮긴다. 나누어지는 수의 소수점도 두 자리 옮기면 ${S(sh(v.x, 2))}이다. ${S(sh(v.x, 2))} ÷ ${v.y.n} = ${S(v.q)}이다.`,
              facts: { calc: [[`${i.s}*10`, 0], [`${S(v.x)}/${S(v.y)}`, 1]], unseen: i.un.concat([10]), rule: 'moveOneTwo' }
            });
          }, { count: 2 }),
          T('df-two-ways', '자릿수가 다른 (소수)÷(소수)를 두 가지 방법으로 계산하기', '①5·14 ②21 ③11 심8', (d) => {
            // 6.21 ÷ 2.7: 10배씩 하면 62.1 ÷ 27, 100배씩 하면 621 ÷ 270
            const v = mk(d, Y.b1, () => qd(d, 12, 98, 1), (w) => w.x.k === 2), j = ix(v.y), c = v.y.n;
            return M(`${S(v.x)} ÷ ${J(v.y, '을/를')} 두 가지 방법으로 계산하려고 한다. ㉠, ㉡, ㉢에 알맞은 수는?`, [inp(LAB[0], nat(c)), inp(LAB[1], nat(c * 10)), inp(LAB[2], v.q)], {
              figure: lines([`두 수를 10배씩: ${eq(S(sh(v.x, 1)), '/', box(LAB[0]), '=', box(LAB[2]))}`, `두 수를 100배씩: ${eq(S(sh(v.x, 2)), '/', box(LAB[1]), '=', box(LAB[2]))}`]),
              explain: `${S(v.y)}의 10배는 ${c}, 100배는 ${c * 10}이다. ${S(sh(v.x, 1))} ÷ ${c} = ${S(v.q)}, ${S(sh(v.x, 2))} ÷ ${c * 10} = ${J(v.q, '으로/로')} 몫이 서로 같다.`,
              facts: { calc: [[j.s, 0], [`${j.s}*10`, 1], [`${S(v.x)}/${S(v.y)}`, 2]], unseen: j.un.concat([10]) }
            });
          })
        ]
      },
      {
        id: 'nat', title: '(자연수)÷(소수)', standard: STD,
        types: [
          calcType('nt-one', '(자연수)÷(소수 한 자리 수)', '①16 ②18 ③22 심12', [
            { rule: 'natOne', pick: (d) => mk(d, Y.a1, () => qn(d, 2, 60), (w) => w.x.k === 0 && w.x.n <= 99 && w.x.n % 10 !== 0) },             // 27 ÷ 1.8 = 15
            { rule: 'natOneWide', col: true, pick: (d) => mk(d, Y.b1, () => qn(d, 11, 99), (w) => w.x.k === 0 && w.x.n >= 100 && w.x.n % 10 !== 0) },   // 168 ÷ 4.8 = 35
            { rule: 'natOneDec', pick: (d) => mk(d, Y.a1, () => qd(d, 12, 295, 1), (w) => w.x.k === 0 && w.x.n <= 99) }                           // 21 ÷ 2.5 = 8.4
          ]),
          calcType('nt-two', '(자연수)÷(소수 두 자리 수)', '①17 ②19 ③23 심12', [
            { rule: 'natTwo', pick: (d) => mk(d, Y.a2, () => qn(d, 2, 300), (w) => w.x.k === 0 && w.x.n <= 99) },                                 // 8 ÷ 0.25 = 32
            { rule: 'natTwoDec', col: true, pick: (d) => mk(d, () => ({ n: d.pick([8, 16, 24, 32, 48, 56, 64, 72]), k: 2 }), () => ({ n: d.pick([125, 375, 625, 875]), k: 1 }), (w) => w.x.k === 0 && w.x.n <= 9) }   // 2 ÷ 0.16 = 12.5
          ]),
          T('nt-move', '(자연수)÷(소수)에서 소수점을 옮겨 계산하기', '②4 ①18', (d) => {
            // 15 ÷ 0.5 = 150 ÷ 5: 자연수에 0을 붙여 소수점을 한 자리씩 옮긴다.
            const v = mk(d, Y.a1, () => qn(d, 2, 60), (w) => w.x.k === 0 && w.x.n <= 99 && w.q.n !== 10), e = xq(v.x, v.y);
            return M('나누는 수가 자연수가 되도록 소수점을 옮겨 계산하려고 한다. ㉠, ㉡에 알맞은 수는?', [inp(LAB[0], nat(v.x.n * 10)), inp(LAB[1], v.q)], {
              figure: lines([eq(v.x.n, '/', S(v.y), '=', box(LAB[0]), '/', v.y.n, '=', box(LAB[1]))]),
              explain: `${J(v.y, '을/를')} 자연수 ${josa(v.y.n, '으로/로')} 만들려면 두 수를 10배씩 한다. ${v.x.n}의 10배는 ${v.x.n * 10}이므로 ${v.x.n * 10} ÷ ${v.y.n} = ${v.q.n}이다.`,
              facts: { calc: [[`${v.x.n}*10`, 0], [e.s, 1]], unseen: e.un.concat([10]) }
            });
          })
        ]
      },
      {
        id: 'col', title: '세로셈의 계산 과정과 잘못된 계산', standard: STD,
        types: [
          T('col-move', '세로셈에서 소수점을 옮겨 나타낸 나눗셈식 알기', '①10 ②20 ③18', (d, n) => {
            // 첫째 문항은 자릿수가 같은 소수, 둘째 문항은 자릿수가 다른 소수(나누어지는 수가 소수로 남는다), 셋째 문항은 (자연수)÷(소수)(0을 붙인다).
            const v = [
              () => mk(d, Y.b2, () => qn(d, 2, 39), (w) => w.x.k === 2 && w.x.n >= 100),
              () => mk(d, Y.b1, () => qd(d, 12, 98, 1), (w) => w.x.k === 2),
              () => mk(d, Y.b1, () => qn(d, 2, 49), (w) => w.x.k === 0 && w.x.n <= 99 && w.x.n % 10 !== 0)
            ][n](), mx = sh(v.x, v.y.k), i = ix(v.x), j = ix(v.y), e = v.q.k ? { s: `${S(v.x)}/${S(v.y)}`, un: [] } : xq(v.x, v.y);
            return M('나눗셈을 세로로 계산하려고 소수점을 옮겨 나타내었다. 소수점을 옮긴 뒤의 나눗셈식 ㉠ ÷ ㉡ = ㉢에서 ㉠, ㉡, ㉢에 알맞은 수는?', [inp(LAB[0], mx), inp(LAB[1], nat(v.y.n)), inp(LAB[2], v.q)], {
              figure: sdiv(v.y, v.x, { shift: true }),
              explain: `나누어지는 수와 나누는 수의 소수점을 오른쪽으로 ${PLACES[v.y.k]} 자리씩 옮기면 ${S(mx)} ÷ ${v.y.n}이다. ${S(mx)} ÷ ${v.y.n} = ${S(v.q)}이다.`,
              facts: { calc: [[mx.k ? `${S(v.x)}*10` : `${i.s}*${P10[v.y.k - v.x.k]}`, 0], [j.s, 1], [e.s, 2]], unseen: i.un.concat(j.un, e.un, [1, 10, 100]), rule: ['moveSame', 'moveDiff', 'moveNat'][n] }
            });
          }, { count: 3 }),
          T('col-steps', '세로셈의 계산 과정', '①10 ②20 ③18 심18', (d, n) => {
            // 문항마다 계산 구조가 다르다: 자릿수가 같은 소수, 자릿수가 다른 소수, (자연수)÷(소수), 0을 내려 계산하는 것.
            const pick = [
              () => mk(d, Y.b2, () => qn(d, 11, 39), (w) => w.x.k === 2 && w.q.n % 10 !== 0),
              () => mk(d, Y.b1, () => qd(d, 12, 98, 1), (w) => w.x.k === 2),
              () => mk(d, Y.b1, () => qn(d, 11, 49), (w) => w.x.k === 0 && w.x.n % 10 !== 0 && w.q.n % 10 !== 0),
              () => mk(d, Y.b1, () => qd(d, 12, 98, 1), (w) => w.x.k === 1)
            ][n];
            const made = withRows(d, pick, [0, 2]), v = made.w, p = made.p, asks = made.asks, rx = rowExprs(v.y, v.x, p.lift + p.pad), hidden = {};
            asks.forEach((k, j) => { hidden[k] = LAB[j + 1]; });
            const e = v.q.k ? { s: `${S(v.x)}/${S(v.y)}`, un: [] } : xq(v.x, v.y);
            return M(`나눗셈을 세로로 계산한 것이다. ${LAB.slice(0, asks.length + 1).join(', ')}에 알맞은 수는?`, [inp(LAB[0], v.q)].concat(asks.map((k, j) => inp(LAB[j + 1], nat(p.work.rows[k].value)))), {
              figure: sdiv(v.y, v.x, { steps: true, quot: LAB[0], rows: hidden }),
              explain: `${how(v.x, v.y)} 계산 과정에 적히는 수는 차례로 ${p.work.rows.map((row) => row.value).join(', ')}이다.`,
              facts: { calc: [[e.s, 0]].concat(asks.map((k, j) => [rx.of(p.work.rows[k]), j + 1])), unseen: rx.un.concat(e.un), rule: ['stepsSame', 'stepsDiff', 'stepsNat', 'stepsDown'][n] }
            });
          }, { count: 4 }),
          T('col-point', '계산해 둔 세로셈의 몫에 소수점 찍기', '②22 ③16·20 심18', (d, n) => {
            // 첫째 문항은 (소수 두 자리 수)÷(소수 한 자리 수), 둘째 문항은 0을 내려 계산한 (자연수)÷(소수).
            const v = n === 0 ? mk(d, Y.b1, () => qd(d, 12, 98, 1), (w) => w.x.k === 2) : mk(d, Y.a1, () => qd(d, 12, 295, 1), (w) => w.x.k === 0 && w.x.n <= 99);
            return ask('나눗셈을 세로로 계산하고 몫에 소수점을 찍지 않았다. 소수점을 찍어 몫을 바르게 나타내면?', v.x, v.y, {
              figure: sdiv(v.y, v.x, { steps: true, nodot: true }),
              explain: `몫의 소수점은 나누어지는 수의 옮긴 소수점의 자리에 맞추어 찍는다. 옮긴 뒤의 나눗셈은 ${S(sh(v.x, 1))} ÷ ${v.y.n}이므로 몫은 ${S(v.q)}이다.`,
              facts: { rule: ['pointTwoOne', 'pointNat'][n] }
            });
          }, { count: 2 }),
          T('col-fix', '잘못 계산한 세로셈 바로잡기', '①11·20 ②22 ③20 심18', (d, n) => {
            // 첫째·둘째 문항은 몫의 소수점을 옮기기 전의 자리에 찍은 것, 셋째 문항은 소수점을 옮기며 붙인 0을 계산하지 않은 것.
            const w = wrongDiv(d, n);
            return ask('나눗셈을 잘못 계산한 것이다. 바르게 계산한 몫은?', w.x, w.y, { figure: w.figure, explain: `${w.why} 바르게 계산하면 ${told(w.x, w.y)}이다.`, facts: { rule: ['fixPointDec', 'fixPointNat', 'fixTailZero'][n] } });
          }, { count: 3 }),
          T('col-fix-why', '세로셈을 잘못 계산한 까닭 알기', '①11 ②22 ③20 심18', (d) => {
            const kind = d.pick([0, 2]), w = wrongDiv(d, kind);
            const rows = d.shuffle([['몫의 소수점을 나누어지는 수의 옮긴 소수점의 자리에 맞추어 찍지 않았다.', 0], ['소수점을 옮기며 붙인 0을 계산하지 않아 몫의 일의 자리에 0을 쓰지 않았다.', 2], ['나누어지는 수와 나누는 수의 소수점을 서로 다른 자리만큼 옮겼다.', 1], ['나누는 수와 몫의 곱을 나누어지는 수보다 크게 썼다.', 3]]);
            return C(`${S(w.x)} ÷ ${J(w.y, '을/를')} 잘못 계산한 것이다. 잘못 계산한 까닭으로 알맞은 것은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[1] === kind), {
              figure: w.figure, explain: `${w.why} 바르게 계산하면 ${told(w.x, w.y)}이다.`,
              facts: { truth: rows.map((row) => row[1] === kind), want: true }
            });
          })
        ]
      },
      { id: 'est', title: '어림하여 몫의 크기 알기', standard: STD, types: [] },
      { id: 'comp', title: '몫의 크기 비교와 조건에 맞는 수', standard: STD, types: [] },
      { id: 'round', title: '몫을 반올림하여 나타내기', standard: STD, types: [] },
      { id: 'rest', title: '나누어 주고 남는 양', standard: STD, types: [] },
      { id: 'word', title: '소수의 나눗셈의 활용', standard: STD, types: [] }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
