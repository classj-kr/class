// 3학년 2학기 1단원 곱셈 — 단원 틀과 기본 문항.
// 수집해 둔 교과서 10종의 평가 자료(단원평가·형성평가·수학익힘·수행평가 214개 문서)에 나온 문제 꼴을 세 덩이로 나누어 모은
// 목록(기본꼴 1~3, 모두 217꼴)을 처음부터 끝까지 대조하여 실었다. 꼴과 조건은 그 문제를 따르고 수와 문장만 바꾼다.
// 하는 일이 다르면 다른 문제로 본다: 계산은 구조마다(올림 횟수, 곱하는 수의 자리), 나타내는 방법마다(수 모형, 자릿값으로 말한 수,
// 자리별 곱을 적는 세로셈, 모눈, 어림) 한 문항씩 싣는다.
//
// 고른 기준
//  - 숫자만 다르거나 말만 다른 꼴은 한 번만 싣는다. 가로셈·세로셈과 한 번 계산하는 문장제만 묶음마다 싣되(계산 방법이 다르다)
//    문장제는 묶음마다 얼개를 달리한다. 묶음마다 되풀이되는 수 모형·모눈 그림, 자리별 곱 세로셈은 한두 번만 싣는다.
//  - 수집본에 3학년 자료로 실려 있다는 것은 3학년 내용이라는 근거가 아니다. 문제마다 몇 학년 무슨 단원의 내용인지 따져 아래를 뺐다.
//      5학년 「다각형의 둘레와 넓이」: 정사각형·삼각형의 변의 길이의 합(곱하는 수가 변의 수인 문제)
//      4학년 2학기 「관계와 규칙」의 등식: 곱이 같아지는 □(60×20=40×□)
//      4학년 나눗셈을 거꾸로 묻는 것: (몇십)×□=(몇천몇백)에서 □ 구하기, 곱이 주어진 수가 되는 두 수 찾기
//      곱셈보다 조건 풀이가 어려움의 대부분인 것: 간격 수, 겹쳐 이은 길이, 두 곱 사이의 수, 약속셈, 수 카드로 곱이 가장 큰 식 만들기
//      말만 바꾼 계산: 표·도형 속 수의 곱, 계산 결과 잇기·색칠하기, 두 곱의 합·차
//  - 식 쓰기·계산 방법 설명하기·문제 만들기 같은 서술형, 놀이는 싣지 않는다.
//  - 곱은 (세 자리 수)×(한 자리 수)와 (두 자리 수)×(두 자리 수)까지다. 문장제에 딸린 덧셈·뺄셈은 세 자리 수 안에서만 한다.
// 묻는 말: 수나 값을 물을 때는 "~은?/~는?", 양을 물을 때는 "몇 ~인가?" 로 맺는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, LABELS, box, expr, column, columnSteps, chars, chain, lines, tagged, numbers, blocks, cards, splitGrid, N, M, C, E } = B.kit;
  const CALC = '4수01-04', SOLVE = '4수01-08';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const SIGNS = ['&gt;', '=', '&lt;'];
  const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  const versus = (left, right) => `<div class="mb-versus">${left}<span class="mb-ring"></span>${right}</div>`;
  const times = (a, b) => expr(a, '*', b, '=', a * b);
  // (세 자리 수)×(한 자리 수)에서 올림이 일어나는 횟수(일·십·백의 자리 계산)
  const ups3 = (a, b) => { let carry = 0, n = 0; for (const digit of [a % 10, Math.floor(a / 10) % 10, Math.floor(a / 100)]) { carry = Math.floor((digit * b + carry) / 10); if (carry) n += 1; } return n; };
  const pair3 = (d, ok) => d.until(() => [d.int(101, 989), d.int(2, 9)], ([a, b]) => a % 10 !== 0 && Math.floor(a / 10) % 10 !== 0 && ok(ups3(a, b), a, b));
  const NONE = (n) => n === 0, ONCE = (n) => n === 1, MANY = (n) => n >= 2;
  // (두 자리 수)×(두 자리 수): 몇십이 아닌 두 수
  // (두 자리 수)×(두 자리 수)에서 일의 자리 숫자끼리, 일의 자리 숫자와 십의 자리 숫자를 곱할 때 올림이 일어나는 횟수
  const ups22 = (x, y) => [(x % 10) * (y % 10) >= 10, (x % 10) * Math.floor(y / 10) >= 10].filter(Boolean).length;
  const pair22 = (d, ok) => d.until(() => [d.int(12, 89), d.int(12, 89)], ([a, b]) => a % 10 !== 0 && b % 10 !== 0 && a !== b && (!ok || ok(a, b)));
  const across = (pick, rule) => (d) => { const [a, b] = pick(d); return N('다음을 계산하시오.', a * b, { figure: expr(a, '*', b, '=', box()), explain: times(a, b), facts: { calc: [[E(a, '*', b), 0]], mulAny: [a, b], rule: rule || true } }); };
  const down = (pick, rule) => (d) => { const [a, b] = pick(d); return N('다음을 계산하시오.', a * b, { figure: column(chars(a), '*', chars(b)), explain: times(a, b), facts: { calc: [[E(a, '*', b), 0]], mulAny: [a, b], rule: rule || true } }); };
  const near = (d, center, spread, pick) => d.until(() => pick(d), ([a, b]) => Math.abs(a * b - center) <= spread);
  const anyPair = (d) => (d.bool() ? pair3(d, (n) => n >= 1) : pair22(d));

  B.addUnit({
    id: '3-2-1', grade: 3, semester: 2, no: 1, title: '곱셈', version: 4,
    groups: [
      {
        id: 'h3a', title: '올림이 없는 (세 자리 수)×(한 자리 수)', standard: CALC,
        types: [
          T('h3a-calc', '가로셈', '①1 ②1 ③7', across((d) => pair3(d, NONE))),
          T('h3a-col', '세로셈', '①1 ②1 ③7', down((d) => pair3(d, NONE))),
          T('h3a-split', '자리별로 나누어 곱하고 더하기', '①3 ②3 ③3', (d) => {
            // 213×3 = 200×3 + 10×3 + 3×3
            const [a, b] = pair3(d, NONE), h = Math.floor(a / 100) * 100, t = (Math.floor(a / 10) % 10) * 10, o = a % 10;
            return M(`${a} × ${josa(b, '을/를')} 자리별로 나누어 계산하려고 한다. ㉠, ㉡, ㉢에 알맞은 수는?`, [{ label: LABELS[0], answer: h * b }, { label: LABELS[1], answer: t * b }, { label: LABELS[2], answer: a * b }], {
              figure: lines([expr(h, '*', b, '=', box(LABELS[0])), expr(t, '*', b, '=', box(LABELS[1])), expr(o, '*', b, '=', o * b), expr(a, '*', b, '=', box(LABELS[2]))]),
              explain: `${times(h, b)}, ${times(t, b)}, ${times(o, b)}를 모두 더하면 ${a * b}이다.`.replace(/<\/span>를 모두/, '</span>의 값을 모두'), facts: { calc: [[E(h, '*', b), 0], [E(t, '*', b), 1], [E(a, '*', b), 2]], mulAny: [a, b] }
            });
          }),
          T('h3a-steps', '자리별 곱을 세 줄로 적는 세로셈', '①4 ③4', (d) => {
            // 213×3 → 9, 30, 600, 639
            const [a, b] = pair3(d, NONE), h = Math.floor(a / 100) * 100, t = (Math.floor(a / 10) % 10) * 10, o = a % 10;
            return M(`${a} × ${josa(b, '을/를')} 다음과 같이 계산하였다. ㉠, ㉡, ㉢에 알맞은 수는?`, [{ label: LABELS[0], answer: t * b }, { label: LABELS[1], answer: h * b }, { label: LABELS[2], answer: a * b }], {
              figure: columnSteps(chars(a), '*', [String(b)], [chars(o * b), box(LABELS[0]), box(LABELS[1])], box(LABELS[2]), [`← ${o} × ${b}`, `← ${t} × ${b}`, `← ${h} × ${b}`]),
              explain: `${times(o, b)}, ${times(t, b)}, ${times(h, b)}이고, 세 곱을 더하면 ${a * b}이다.`, facts: { calc: [[E(t, '*', b), 0], [E(h, '*', b), 1], [E(a, '*', b), 2]], mulAny: [a, b] }
            });
          }),
          T('h3a-part', '세로셈의 한 줄이 어떤 두 수의 곱인지', '②13 ③5', (d) => {
            // 213×3 의 둘째 줄 30은 10×3
            const [a, b] = pair3(d, (n, x) => n === 0 && Math.floor(x / 100) !== Math.floor(x / 10) % 10 && Math.floor(x / 10) % 10 !== x % 10 && Math.floor(x / 100) !== x % 10), h = Math.floor(a / 100) * 100, t = (Math.floor(a / 10) % 10) * 10, o = a % 10;
            const list = d.shuffle([[t, b], [t / 10, b], [h, b], [o, b]]);
            return C(`${a} × ${josa(b, '을/를')} 다음과 같이 계산하였다. 둘째 줄의 ${josa(t * b, '은/는')} 어떤 두 수의 곱인가?`, list.map(([x, y]) => `${x} × ${y}`), list.findIndex(([x]) => x === t), {
              figure: columnSteps(chars(a), '*', [String(b)], [chars(o * b), chars(t * b), chars(h * b)], chars(a * b)),
              explain: `둘째 줄은 십의 자리 계산이다. 십의 자리 숫자 ${t / 10}은 ${t}을 나타내므로 ${times(t, b)}이다.`.replace(`${t / 10}은`, josa(t / 10, '은/는')).replace(`${t}을`, josa(t, '을/를')),
              facts: { choose: { exprs: list.map(([x, y]) => E(x, '*', y)), rule: 'equals', target: t * b }, mulAny: [a, b] }
            });
          }),
          T('h3a-add', '같은 수를 여러 번 더한 식을 곱셈식으로', '①6 ②4 ③6', (d) => {
            const [a, b] = pair3(d, (n, x, y) => n === 0 && y <= 4), sum = Array(b).fill(a).join('+');
            return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: b }, { label: LABELS[1], answer: a * b }], {
              figure: `<span class="mb-expr">${Array(b).fill(a).join(' <i>+</i> ')} <i>=</i> ${a} <i>×</i> ${box(LABELS[0])} <i>=</i> ${box(LABELS[1])}</span>`,
              explain: `${josa(a, '을/를')} ${b}번 더한 것은 ${a}의 ${b}배이다. ${times(a, b)}`, facts: { calc: [[`(${sum})/${a}`, 0], [sum, 1]], mulAny: [a, b] }
            });
          }),
          T('h3a-place', '자릿값으로 말한 수의 몇 배', '①7 ②49 ③42', (d) => {
            const [a, b] = pair3(d, (n, x) => n === 0 && new Set(String(x)).size === 3), h = Math.floor(a / 100), t = Math.floor(a / 10) % 10, o = a % 10;
            return N(`100이 ${h}개, 10이 ${t}개, 1이 ${o}개인 수의 ${b}배는?`, a * b, { explain: `100이 ${h}개, 10이 ${t}개, 1이 ${o}개인 수는 ${a}이다. ${times(a, b)}`, facts: { calc: [[`(${h}*100+${t}*10+${o})*${b}`, 0]], mulAny: [a, b] } });
          }),
          T('h3a-model', '수 모형이 나타내는 수의 몇 배', '①2 ②2 ③1', (d) => {
            const [a, b] = pair3(d, (n, x) => n === 0 && x < 400), h = Math.floor(a / 100), t = Math.floor(a / 10) % 10, o = a % 10;
            return N(`수 모형이 나타내는 수의 ${b}배는?`, a * b, { figure: blocks(a), explain: `수 모형이 나타내는 수는 ${a}이다. ${times(a, b)}`, facts: { calc: [[`(${h}*100+${t}*10+${o})*${b}`, 0]], unseen: [100, 10], mulAny: [a, b] } });
          }),
          T('h3a-word', '문장제: 묶음', '①8 ②5 ③8', (d) => {
            const [a, b] = pair3(d, NONE);
            return N(`단추가 한 봉지에 ${a}개씩 들어 있다. ${b}봉지에 든 단추는 모두 몇 개인가?`, a * b, { unit: '개', explain: times(a, b), facts: { calc: [[E(a, '*', b), 0]] } });
          })
        ]
      },
      {
        id: 'h3b', title: '올림이 한 번 있는 (세 자리 수)×(한 자리 수)', standard: CALC,
        types: [
          T('h3b-calc', '가로셈', '①9 ②6 ③11', across((d) => pair3(d, ONCE))),
          T('h3b-col', '세로셈', '①9 ②6 ③11', down((d) => pair3(d, ONCE))),
          T('h3b-carry', '올림한 수가 실제로 나타내는 값', '①11 ②7 ③10', (d) => {
            // 일의 자리에서 올림: 십의 자리 위에 작게 쓴 수는 몇십을 나타낸다.
            const [a, b] = pair3(d, (n, x, y) => n === 1 && (x % 10) * y >= 10), up = Math.floor(((a % 10) * b) / 10);
            return N(`${a} × ${josa(b, '을/를')} 계산한 세로셈이다. 십의 자리 위에 작게 쓴 ${josa(up, '이/가')} 실제로 나타내는 값은?`, up * 10, {
              figure: column(chars(a), '*', [String(b)], chars(a * b), ['', String(up), '']), explain: `일의 자리 계산 ${times(a % 10, b)}에서 ${up * 10}을 십의 자리로 올림한 것이다.`.replace(/(\d)0을 십의/, (m, digit) => digit + '0을 십의'),
              facts: { calc: [[`${Math.floor(((a % 10) * b) / 10)}*10`, 0]], unseen: [10], mulAny: [a, b], carry3: [a, b] }
            });
          }),
          T('h3b-mark', '올림한 수를 작게 적기', '①10 ③9', (d) => {
            // 일의 자리에서 올림한 수를 십의 자리 위에 적는다
            const [a, b] = pair3(d, (n, x, y) => n === 1 && (x % 10) * y >= 10), o = a % 10;
            return N(`${a} × ${josa(b, '을/를')} 계산한 세로셈이다. □ 안에 알맞은 수는?`, Math.floor(o * b / 10), {
              figure: column(chars(a), '*', [String(b)], chars(a * b), ['', box(), '']), explain: `일의 자리 계산은 ${times(o, b)}이다. ${o * b}에서 ${Math.floor(o * b / 10) * 10}을 십의 자리로 올림하므로 십의 자리 위에 ${josa(Math.floor(o * b / 10), '을/를')} 작게 쓴다.`,
              facts: { calc: [[`(${o}*${b}-(${o}*${b})%10)/10`, 0]], unseen: [10], mulAny: [a, b], carry3: [a, b] }
            });
          }),
          T('h3b-word', '문장제: 몇 배', '①13 ②11 ③12', (d) => {
            const [a, b] = pair3(d, (n, x, y) => n === 1 && x * y < 1000);
            return N(`집에서 학교까지의 거리는 ${a} m이고, 집에서 공원까지의 거리는 그 ${b}배이다. 집에서 공원까지의 거리는 몇 m인가?`, a * b, { unit: 'm', explain: times(a, b), facts: { calc: [[E(a, '*', b), 0]] } });
          })
        ]
      },
      {
        id: 'h3c', title: '올림이 여러 번 있는 (세 자리 수)×(한 자리 수)', standard: CALC,
        types: [
          T('h3c-calc', '가로셈', '①14 ②12 ③15', across((d) => pair3(d, MANY))),
          T('h3c-col', '세로셈', '①14 ②12 ③15', down((d) => pair3(d, MANY))),
          T('h3c-fix', '잘못 계산한 세로셈 바로잡기', '①15 ②9 ③17', (d) => {
            // 올림한 수를 더하지 않고 자리마다 곱의 일의 자리만 쓴 계산
            const [a, b] = pair3(d, (n, x, y) => n >= 2 && Math.floor(x / 100) * y < 10), wrong = Math.floor(a / 100) * b * 100 + ((Math.floor(a / 10) % 10) * b % 10) * 10 + ((a % 10) * b) % 10;
            return N(`다음은 ${a} × ${josa(b, '을/를')} 잘못 계산한 것이다. 바르게 계산한 값은?`, a * b, {
              figure: column(chars(a), '*', [String(b)], chars(wrong)), explain: `올림한 수를 윗자리 계산에 더하지 않았다. 바르게 계산하면 ${times(a, b)}이다.`, facts: { calc: [[E(a, '*', b), 0]], mulAny: [a, b], wrongProduct: wrong }
            });
          }),
          T('h3c-word', '문장제: 날마다 같은 양', '①17 ②15 ③16', (d) => {
            const [a, b] = pair3(d, MANY), who = d.pick(NAMES);
            return N(`${name(who, '은/는')} 계단을 하루에 ${a}칸씩 ${b}일 동안 올랐다. 오른 계단은 모두 몇 칸인가?`, a * b, { unit: '칸', explain: times(a, b), facts: { calc: [[E(a, '*', b), 0]] } });
          })
        ]
      },
      {
        id: 'tens', title: '(몇십)×(몇십), (몇십몇)×(몇십)', standard: CALC,
        types: [
          T('tens-calc', '(몇십)×(몇십) 계산', '①18 ②16 ③22', across((d) => [d.int(2, 9) * 10, d.int(2, 9) * 10])),
          T('tens-calc2', '(몇십몇)×(몇십) 계산', '①18 ②16 ③22', (d) => {
            const a = d.until(() => d.int(12, 89), (v) => v % 10 !== 0), b = d.int(2, 9) * 10;
            return N('다음을 계산하시오.', a * b, { figure: column(chars(a), '*', chars(b)), explain: `${times(a, b / 10)}이므로 ${times(a, b)}이다.`, facts: { calc: [[E(a, '*', b), 0]], mulAny: [a, b], rule: true } });
          }),
          T('tens-relate', '(몇)을 곱한 값과 (몇십)을 곱한 값', '①19 ②17 ③21', (d) => {
            // 15×3=45 → 15×30=450
            const a = d.until(() => d.int(12, 48), (v) => v % 10 !== 0), b = d.int(2, 9);
            return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: a * b }, { label: LABELS[1], answer: a * b * 10 }], {
              figure: lines([expr(a, '*', b, '=', box(LABELS[0])), expr(a, '*', b * 10, '=', box(LABELS[1]))]), explain: `${josa(b * 10, '은/는')} ${b}의 10배이므로 ${a} × ${b * 10}은 ${a} × ${b}의 10배이다. ${times(a, b)}, ${times(a, b * 10)}`,
              facts: { calc: [[E(a, '*', b), 0], [E(a, '*', b * 10), 1]] }
            });
          }),
          T('tens-word2', '문장제: (몇십몇)×(몇십)', '①25 ②24 ③23', (d) => {
            const a = d.until(() => d.int(12, 48), (v) => v % 10 !== 0), b = d.int(2, 6) * 10;
            return N(`한 상자에 ${a}개씩 들어 있는 방울토마토가 ${b}상자 있다. 방울토마토는 모두 몇 개인가?`, a * b, { unit: '개', explain: times(a, b), facts: { calc: [[E(a, '*', b), 0]], mulAny: [a, b] } });
          }),
          T('tens-word', '문장제: 한 통에 든 수', '①25 ②24 ③23', (d) => {
            const a = d.int(2, 6) * 10, b = d.int(2, 9) * 10;
            return N(`구슬이 한 통에 ${a}개씩 들어 있다. ${b}통에 들어 있는 구슬은 모두 몇 개인가?`, a * b, { unit: '개', explain: times(a, b), facts: { calc: [[E(a, '*', b), 0]] } });
          })
        ]
      },
      {
        id: 'one2', title: '(몇)×(몇십몇)', standard: CALC,
        types: [
          T('one2-calc', '가로셈', '①26 ②26 ③29', across((d) => [d.int(3, 9), d.until(() => d.int(13, 89), (v) => v % 10 !== 0)])),
          T('one2-col', '세로셈', '①26 ②26 ③29', down((d) => [d.int(3, 9), d.until(() => d.int(13, 89), (v) => v % 10 !== 0)])),
          T('one2-steps', '자리별 곱을 두 줄로 적는 세로셈', '①28 ②27 ③28', (d) => {
            // 7×36 → 42, 210, 252
            const a = d.int(3, 9), b = d.until(() => d.int(13, 89), (v) => v % 10 >= 2), ones = b % 10, tens = b - ones;
            return M(`${a} × ${josa(b, '을/를')} 다음과 같이 계산하였다. ㉠, ㉡, ㉢에 알맞은 수는?`, [{ label: LABELS[0], answer: a * ones }, { label: LABELS[1], answer: a * tens }, { label: LABELS[2], answer: a * b }], {
              figure: columnSteps([String(a)], '*', chars(b), [box(LABELS[0]), box(LABELS[1])], box(LABELS[2]), [`← ${a} × ${ones}`, `← ${a} × ${tens}`]),
              explain: `${times(a, ones)}, ${times(a, tens)}이고, 두 곱을 더하면 ${a * b}이다.`, facts: { calc: [[E(a, '*', ones), 0], [E(a, '*', tens), 1], [E(a, '*', b), 2]], mulAny: [a, b] }
            });
          }),
          T('one2-grid', '모눈을 둘로 나누어 곱하기', '①27 ②28 ③27', (d) => {
            // 6×14: 6×10 과 6×4
            const a = d.int(3, 7), b = d.int(12, 19), ones = b - 10;
            return M(`모눈의 수를 두 부분으로 나누어 ${a} × ${josa(b, '을/를')} 계산하려고 한다. ㉠, ㉡, ㉢에 알맞은 수는?`, [{ label: LABELS[0], answer: a * 10 }, { label: LABELS[1], answer: a * ones }, { label: LABELS[2], answer: a * b }], {
              figure: splitGrid(a, 10, ones) + lines([expr(a, '*', 10, '=', box(LABELS[0])), expr(a, '*', ones, '=', box(LABELS[1])), expr(a, '*', b, '=', box(LABELS[2]))]),
              explain: `${times(a, 10)}, ${times(a, ones)}이고, 두 곱을 더하면 ${a * b}이다.`, facts: { calc: [[E(a, '*', 10), 0], [E(a, '*', ones), 1], [E(a, '*', b), 2]], mulAny: [a, b] }
            });
          }),
          T('one2-means', '두 숫자의 곱이 실제로 나타내는 값', '①29', (d) => {
            // 7×46 에서 7과 4의 곱 28은 280
            const a = d.int(3, 9), b = d.until(() => d.int(23, 89), (v) => v % 10 >= 2 && Math.floor(v / 10) !== v % 10 && Math.floor(v / 10) !== a), tens = Math.floor(b / 10);
            return N(`${a} × ${b}에서 ${josa(a, '과/와')} ${b}의 십의 자리 숫자 ${tens}의 곱이 실제로 나타내는 값은?`, a * tens * 10, {
              explain: `${b}의 십의 자리 숫자 ${josa(tens, '은/는')} ${josa(tens * 10, '을/를')} 나타낸다. ${times(a, tens * 10)}`, facts: { calc: [[`${a}*${tens}*10`, 0]], unseen: [10], mulAny: [a, b] }
            });
          }),
          T('one2-swap', '곱하는 차례를 바꾸어 계산하기', '②29 ③31', (d) => {
            const a = d.int(3, 9), b = d.until(() => d.int(13, 89), (v) => v % 10 >= 2);
            return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: a }, { label: LABELS[1], answer: a * b }], {
              figure: `<span class="mb-expr">${a} <i>×</i> ${b} <i>=</i> ${b} <i>×</i> ${box(LABELS[0])} <i>=</i> ${box(LABELS[1])}</span>`,
              explain: `두 수를 바꾸어 곱해도 곱은 같다. ${times(b, a)}`, facts: { calc: [[String(a), 0], [E(a, '*', b), 1]], mulAny: [a, b] }
            });
          }),
          T('one2-word', '문장제: 모둠의 수', '①30 ②30 ③30', (d) => {
            const a = d.int(3, 9), b = d.until(() => d.int(13, 68), (v) => v % 10 !== 0);
            return N(`한 모둠에 ${a}명씩 ${b}모둠이 모였다. 모인 사람은 모두 몇 명인가?`, a * b, { unit: '명', explain: times(a, b), facts: { calc: [[E(a, '*', b), 0]] } });
          })
        ]
      },
      {
        id: 'two2', title: '(몇십몇)×(몇십몇)', standard: CALC,
        types: [
          T('two2-calc', '올림이 적은 계산', '①32 ②31 ③37', across((d) => pair22(d, (x, y) => ups22(x, y) <= 1), 'fewCarries')),
          T('two2-col', '올림이 여러 번 있는 계산', '①32 ②32 ③37', down((d) => pair22(d, (x, y) => ups22(x, y) === 2), 'manyCarries')),
          T('two2-steps', '자리별 곱을 두 줄로 적는 세로셈', '①34 ②33 ③36', (d) => {
            // 32×12 → 64, 320, 384
            const [a, b] = pair22(d, (x, y) => y % 10 >= 2), ones = b % 10, tens = b - ones;
            return M(`${a} × ${josa(b, '을/를')} 다음과 같이 계산하였다. ㉠, ㉡, ㉢에 알맞은 수는?`, [{ label: LABELS[0], answer: a * ones }, { label: LABELS[1], answer: a * tens }, { label: LABELS[2], answer: a * b }], {
              figure: columnSteps(chars(a), '*', chars(b), [box(LABELS[0]), box(LABELS[1])], box(LABELS[2]), [`← ${a} × ${ones}`, `← ${a} × ${tens}`]),
              explain: `${times(a, ones)}, ${times(a, tens)}이고, 두 곱을 더하면 ${a * b}이다.`, facts: { calc: [[E(a, '*', ones), 0], [E(a, '*', tens), 1], [E(a, '*', b), 2]], mulAny: [a, b] }
            });
          }),
          T('two2-fix', '자리를 잘못 맞춘 세로셈 바로잡기', '①37 ②35 ③39', (d) => {
            // 32×26 을 192+64=256 으로 계산한 것(십의 자리 곱을 일의 자리에 맞춰 적음)
            const [a, b] = pair22(d), ones = b % 10, tensDigit = Math.floor(b / 10), wrong = a * ones + a * tensDigit;
            return N(`다음은 ${a} × ${josa(b, '을/를')} 잘못 계산한 것이다. 바르게 계산한 값은?`, a * b, {
              figure: columnSteps(chars(a), '*', chars(b), [chars(a * ones), chars(a * tensDigit)], chars(wrong)),
              explain: `${a} × ${tensDigit}의 값 ${josa(a * tensDigit, '은/는')} 실제로 ${a} × ${tensDigit * 10} = ${a * tensDigit * 10}이므로 한 자리 왼쪽에 적어야 한다. 바르게 계산하면 ${times(a, b)}이다.`,
              facts: { calc: [[E(a, '*', b), 0]], mulAny: [a, b], wrongProduct: wrong }
            });
          }),
          T('two2-est', '몇십으로 어림하여 곱하기', '②36 ③40', (d) => {
            // 38×21 → 40×20
            const [a, b] = pair22(d, (x, y) => [x, y].every((v) => v % 10 !== 5 && v % 10 !== 0) && x <= 59 && y <= 59), ra = Math.round(a / 10) * 10, rb = Math.round(b / 10) * 10;
            return M(`${josa(a, '과/와')} ${josa(b, '을/를')} 각각 가장 가까운 몇십으로 어림하여 ${a} × ${b}의 값을 어림하려고 한다. ㉠, ㉡, ㉢에 알맞은 수는?`, [{ label: LABELS[0], answer: ra }, { label: LABELS[1], answer: rb }, { label: LABELS[2], answer: ra * rb }], {
              figure: lines([`${josa(a, '은/는')} 약 ${box(LABELS[0])}이다.`, `${josa(b, '은/는')} 약 ${box(LABELS[1])}이다.`, `${a} × ${josa(b, '은/는')} 약 ${box(LABELS[2])}이다.`]),
              explain: `${josa(a, '은/는')} ${ra}에, ${josa(b, '은/는')} ${rb}에 가깝다. ${times(ra, rb)}`, facts: { tensEstimate: [a, b], mulAny: [a, b] }
            });
          }),
          T('two2-cards', '수 카드로 만든 가장 큰 수와 가장 작은 수의 곱', '②64 ③43', (d) => {
            // 2, 5, 3, 7 → 75×23
            const list = d.shuffle([1, 2, 3, 4, 5, 6, 7, 8]).slice(0, 4), s = list.slice().sort((x, y) => x - y), big = s[3] * 10 + s[2], small = s[0] * 10 + s[1];
            return N('수 카드 4장 중에서 2장을 골라 두 자리 수를 만들려고 한다. 만들 수 있는 가장 큰 수와 가장 작은 수의 곱은?', big * small, {
              figure: cards(list), explain: `가장 큰 수는 ${big}, 가장 작은 수는 ${small}이다. ${times(big, small)}`, facts: { twoCards: list }
            });
          }),
          T('two2-word', '문장제: 줄지어 놓은 수', '①39 ②37·38 ③38', (d) => {
            const [a, b] = pair22(d, (x, y) => x <= 48 && y <= 48);
            return N(`의자를 한 줄에 ${a}개씩 ${b}줄로 놓았다. 놓은 의자는 모두 몇 개인가?`, a * b, { unit: '개', explain: times(a, b), facts: { calc: [[E(a, '*', b), 0]] } });
          })
        ]
      },
      {
        id: 'mix', title: '여러 가지 곱셈', standard: CALC,
        types: [
          T('mix-compare', '두 곱의 크기 비교', '①40 ②40 ③46', (d) => {
            const [a, b] = pair3(d, (n) => n >= 1), [c, e] = near(d, a * b, 150, (dd) => pair22(dd));
            const flip = d.bool(), left = flip ? [c, e] : [a, b], right = flip ? [a, b] : [c, e], x = left[0] * left[1], y = right[0] * right[1];
            return C('두 식의 계산 결과를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, x > y ? 0 : x === y ? 1 : 2, {
              figure: versus(expr(left[0], '*', left[1]), expr(right[0], '*', right[1])), explain: `${times(left[0], left[1])}, ${times(right[0], right[1])}`, facts: { choose: { exprs: [E(left[0], '*', left[1]), E(right[0], '*', right[1])], rule: 'compare' } }
            });
          }),
          T('mix-order', '곱이 큰 것부터 차례대로', '①43 ②43 ③48', (d) => {
            // ㉠ 53×46 ㉡ 692×4 ㉢ 30×90
            const base = d.int(900, 3000);
            const rows = d.until(() => d.shuffle([near(d, base, 200, (dd) => pair3(dd, (n) => n >= 1)), near(d, base, 200, (dd) => pair22(dd)), near(d, base, 400, (dd) => [dd.int(2, 9) * 10, dd.int(2, 9) * 10])]), (list) => new Set(list.map(([x, y]) => x * y)).size === 3);
            const values = rows.map(([x, y]) => x * y), right = [0, 1, 2].sort((p, q) => values[q] - values[p]);
            const list = d.shuffle(d.shuffle(ORDERS.filter((o) => o.join() !== right.join())).slice(0, 3).concat([right]));
            return C('계산 결과가 큰 것부터 차례대로 나열한 것은?', list.map((o) => o.map((i) => LABELS[i]).join(', ')), list.findIndex((o) => o.join() === right.join()), {
              figure: tagged(rows.map(([x, y]) => expr(x, '*', y))), explain: rows.map(([x, y], i) => `${LABELS[i]} ${times(x, y)}`).join(', '), facts: { choose: { exprs: rows.map(([x, y]) => E(x, '*', y)), rule: 'descending', orders: list } }
            });
          }),
          T('mix-same', '계산 결과가 다른 식 찾기', '①44 ②45 ③52', (d) => {
            // ㉠ 94×30 ㉡ 40×70 ㉢ 705×4 → 같은 값 둘과 다른 값 하나
            const [a, k, c] = d.until(() => [d.int(12, 45), d.int(2, 4), d.int(12, 24)], ([x, y, z]) => x * y <= 98 && y * z <= 98 && [x, x * y, z, y * z].every((v) => v % 10 !== 0) && x !== z);
            const other = d.bool() ? [a * k + 1, c] : [a, k * c + 1], picked = d.shuffle([[a * k, c], [a, k * c], other]), where = picked.indexOf(other);
            return C('계산 결과가 나머지 둘과 다른 것은?', LABELS.slice(0, 3), where, {
              figure: tagged(picked.map(([x, y]) => expr(x, '*', y))), explain: picked.map(([x, y], i) => `${LABELS[i]} ${times(x, y)}`).join(', '), facts: { choose: { exprs: picked.map(([x, y]) => E(x, '*', y)), rule: 'odd' } }
            });
          }),
          T('mix-right', '바르게 계산한 식 고르기', '①16 ②47 ③18', (d) => {
            // ① 15×30=400 ② 80×40=320 ③ 43×20=860
            const good = d.int(0, 2), rows = [[d.int(2, 9) * 10, d.int(2, 9) * 10], [d.until(() => d.int(12, 48), (v) => v % 10 !== 0), d.int(2, 9) * 10], pair22(d)];
            const said = rows.map(([x, y], i) => (i === good ? x * y : i === 0 ? (x * y) / 10 : i === 1 ? x * y + 100 : x * y - 100)), order = d.shuffle([0, 1, 2]);
            return C('바르게 계산한 것은?', LABELS.slice(0, 3), order.indexOf(good), {
              figure: tagged(order.map((i) => expr(rows[i][0], '*', rows[i][1], '=', said[i]))), explain: order.map((i, k) => `${LABELS[k]} ${times(rows[i][0], rows[i][1])}`).join(', '),
              facts: { claimed: order.map((i) => [E(rows[i][0], '*', rows[i][1]), said[i]]), claimedWant: true }
            });
          }),
          T('mix-ends', '가장 큰 수와 가장 작은 수의 곱', '①47 ②48 ③53', (d) => {
            const list = d.until(() => d.shuffle([d.int(52, 89), d.int(12, 28), d.int(31, 49), d.int(30, 50)]), (v) => new Set(v).size === 4 && v.every((x) => x % 10 !== 0)), big = Math.max(...list), small = Math.min(...list);
            return N('가장 큰 수와 가장 작은 수의 곱은?', big * small, { figure: numbers(list), explain: `가장 큰 수는 ${big}, 가장 작은 수는 ${small}이다. ` + times(big, small), facts: { mulEnds2: list } });
          }),
          T('mix-chain', '이어 곱하기', '②51', (d) => {
            // 18 ×21 → 378 ×3 → 1134
            const [a, b] = pair22(d, (x, y) => x * y <= 989 && (x * y) % 10 !== 0 && Math.floor((x * y) / 10) % 10 !== 0), c = d.int(2, 9);
            return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: a * b }, { label: LABELS[1], answer: a * b * c }], {
              figure: chain([a, '×' + b, box(LABELS[0]), '×' + c, box(LABELS[1])]), explain: `${times(a, b)}, ${times(a * b, c)}`, facts: { calc: [[E(a, '*', b), 0], [`${a}*${b}*${c}`, 1]] }
            });
          }),
          T('mix-above', '기준이 되는 수보다 큰 곱 찾기', '①45 ②44 ③49', (d) => {
            const target = d.int(2, 7) * 500;
            const rows = d.until(() => [near(d, target, 380, (dd) => pair3(dd, (n) => n >= 1)), near(d, target, 380, (dd) => pair22(dd)), near(d, target, 380, (dd) => pair3(dd, (n) => n >= 1))], (list) => list.filter(([x, y]) => x * y > target).length === 1 && list.every(([x, y]) => x * y !== target));
            return C(`곱이 ${target}보다 큰 것은?`, LABELS.slice(0, 3), rows.findIndex(([x, y]) => x * y > target), {
              figure: tagged(rows.map(([x, y]) => expr(x, '*', y))), explain: rows.map(([x, y], i) => `${LABELS[i]} ${times(x, y)}`).join(', '), facts: { choose: { exprs: rows.map(([x, y]) => E(x, '*', y)), rule: 'onlyAbove', target } }
            });
          }),
          T('mix-cards', '수 카드로 만든 가장 큰 세 자리 수의 곱', '①52 ②60 ③20', (d) => {
            // 4, 7, 2 → 742×3
            const list = d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3), by = d.int(2, 6), big = Number(list.slice().sort((x, y) => y - x).join(''));
            return N(`수 카드 3장을 한 번씩 모두 사용하여 만들 수 있는 가장 큰 세 자리 수와 ${by}의 곱은?`, big * by, {
              figure: cards(list), explain: `만들 수 있는 가장 큰 세 자리 수는 ${big}이다. ${times(big, by)}`, facts: { bigCards: { digits: list, by } }
            });
          }),
          T('mix-hidden', '문장제: 곱하는 수가 글에 숨어 있는 경우', '①54 ②69 ③58', (d) => {
            const a = d.until(() => d.int(105, 289), (v) => v % 10 !== 0 && ups3(v, 7) >= 2), who = d.pick(NAMES);
            return N(`${name(who, '은/는')} 하루에 ${a}걸음씩 일주일 동안 매일 걸었다. 일주일 동안 걸은 걸음은 모두 몇 걸음인가?`, a * 7, { unit: '걸음', explain: `일주일은 7일이다. ` + times(a, 7), facts: { calc: [[E(a, '*', 7), 0]], unseen: [7] } });
          }, { standard: SOLVE }),
          T('mix-estimate', '어림셈', '①65·67 ②10·36 ③40', (d) => {
            // 396×9 → 400×9=3600
            const h = d.int(2, 8) * 100, a = h + d.pick([-1, 1]) * d.int(3, 12), b = d.int(3, 9);
            return M(`${josa(a, '을/를')} 가장 가까운 몇백으로 어림하여 ${a} × ${b}의 값을 어림하려고 한다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: h }, { label: LABELS[1], answer: h * b }], {
              figure: lines([`${josa(a, '은/는')} 약 ${box(LABELS[0])}이다.`, `${a} × ${josa(b, '은/는')} 약 ${box(LABELS[1])}이다.`]), explain: `${josa(a, '은/는')} ${h}에 가깝다. ${times(h, b)}`, facts: { hundredEstimate: [a, b] }
            });
          }, { standard: SOLVE })
        ]
      }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
