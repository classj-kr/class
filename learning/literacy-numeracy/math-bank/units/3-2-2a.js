// 3학년 2학기 2단원 나눗셈 — 단원 틀과 기본 문항.
// 수집해 둔 교과서 9종의 평가 자료(단원평가·형성평가·수학익힘·수행평가 253개 문서)에서 뽑은 문제 꼴 목록(기본꼴 1~3)을
// 처음부터 끝까지 대조하여, 꼴마다 ① 몇 학년 무슨 단원 내용인가 ② 무엇을 하게 하는 문제인가를 따져서 실었다.
// (교과서마다 단원 차례가 달라 류희찬·최수일·장혜원·강문봉의 자료는 3단원 폴더에서 가져왔다.)
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 계산은 구조가 다른 것마다(내림이 있는가, 나머지가 있는가, 몫이 몇 자리인가, 몫에 0이 있는가),
//    나타내는 방법이 다른 것마다(수 모형, 세로셈의 계산 과정, 십과 일로 가르기, 확인하는 식) 한 문항씩 싣는다.
//  - 숫자만 다르거나 말만 다른 것은 한 번만 싣는다.
//  - 상위 학년의 특정 단원에 해당하는 것은 모두 뺐다.
//      5학년 「약수와 배수」: 나누어떨어지게 하는 나누는 수 모두 찾기, 범위 안에서 나누어떨어지는 수, 나누어떨어지게 하는 자리 숫자
//      5학년 「다각형의 둘레와 넓이」: 네 변의 길이의 합으로 정사각형의 한 변 구하기
//      4학년 2학기 「관계와 규칙」의 등식: 두 식의 결과가 같게 하는 □
//      중학교 내용에 가까운 것: 조건(나머지 여럿)을 모두 만족하는 수, 연속하는 자연수의 합
//  - 뜻 없는 셈(몫과 나머지의 합, 두 몫의 합·차, 몫과 나머지를 이어 쓴 비밀번호), 경우를 모두 따져야 하는 것(수 카드로 몫이 가장 큰 식 만들기),
//    숫자가 가려진 세로셈, 놀이(사다리 타기·낱말 만들기)는 싣지 않는다.
//  - 식 쓰기·계산 방법 설명하기·문제 만들기 같은 서술형은 싣지 않는다.
// 나머지가 있을 때는 몫과 나머지를 따로 적는다. 묻는 말: 수나 값을 물을 때는 "~은?/~는?", 양을 물을 때는 "몇 ~인가?" 로 맺는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, LABELS, box, expr, divColumn, divSteps, longDivision, blocks, dots, cards, chain, lines, tagged, N, M, C, E } = B.kit;
  const CALC = '4수01-06', SOLVE = '4수01-08';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const SIGNS = ['&gt;', '=', '&lt;'];
  const versus = (left, right) => `<div class="mb-versus">${left}<span class="mb-ring"></span>${right}</div>`;
  const both = (a, b) => [{ label: '몫', answer: Math.floor(a / b) }, { label: '나머지', answer: a % b }];
  const shown = (a, b) => (a % b === 0 ? expr(a, '/', b, '=', a / b) : `${expr(a, '/', b, '=', Math.floor(a / b))} … ${a % b}`);
  const said = (rows) => rows.map(([a, b], i) => `${LABELS[i]} ${shown(a, b)}`).join(', ');
  const apart = (list) => new Set(list.map(([a]) => a)).size === list.length;
  // (몇십)÷(몇): 십의 자리에서 나누어떨어지는 것과, 남은 십을 일로 바꾸어야 하는 것
  const tensPlain = (d) => d.pick([[20, 2], [40, 2], [60, 2], [80, 2], [30, 3], [60, 3], [90, 3], [40, 4], [80, 4]]);
  const tensDown = (d) => d.pick([[30, 2], [50, 2], [70, 2], [90, 2], [60, 4], [60, 5], [70, 5], [80, 5], [90, 5], [90, 6]]);
  // 나누어떨어지는 (몇십몇)÷(몇). carry: 십의 자리에서 내림이 있는가.
  const exact2 = (d, carry) => d.until(() => [d.int(24, 98), d.int(2, 8)], ([a, b]) => a % b === 0 && a % 10 !== 0 && a / b >= 11 && Math.floor(a / 10) >= b && ((Math.floor(a / 10) % b !== 0) === carry));
  // 나머지가 있는 (몇십몇)÷(몇): 몫이 한 자리인 것, 몫이 두 자리이고 내림이 없는 것, 내림이 있는 것
  const rest1 = (d, ok) => d.until(() => [d.int(13, 89), d.int(3, 9)], ([a, b]) => a % b !== 0 && Math.floor(a / b) >= 2 && Math.floor(a / b) <= 9 && (!ok || ok(a, b, Math.floor(a / b), a % b)));
  const restPlain = (d) => d.until(() => [d.int(23, 99), d.int(2, 8)], ([a, b]) => a % b !== 0 && Math.floor(a / 10) % b === 0 && a % 10 > b);
  const restDown = (d) => d.until(() => [d.int(31, 99), d.int(2, 8)], ([a, b]) => a % b !== 0 && Math.floor(a / 10) % b !== 0 && Math.floor(a / 10) > b);
  // (세 자리 수)÷(한 자리 수): 몫이 세 자리인 것(full), 두 자리인 것(short), 몫에 0이 있는 것(zero), 나머지가 있는 것
  const KIND = {
    full: (a, b, q, r) => r === 0 && Math.floor(a / 100) >= b && !String(q).includes('0') && a % 10 !== 0,
    short: (a, b, q, r) => r === 0 && Math.floor(a / 100) < b && a % 10 !== 0,
    zero: (a, b, q, r) => r === 0 && Math.floor(a / 100) >= b && String(q).split('0').length === 2 && a % 100 !== 0,
    restFull: (a, b, q, r) => r !== 0 && Math.floor(a / 100) >= b && !String(q).includes('0'),
    restShort: (a, b, q, r) => r !== 0 && Math.floor(a / 100) < b
  };
  const three = (d, kind) => d.until(() => [d.int(104, 987), d.int(2, 9)], ([a, b]) => KIND[kind](a, b, Math.floor(a / b), a % b));
  const flat = (a, b) => expr(a, '/', b), tall = (a, b) => divColumn(b, a);
  const one = (pick, figure, rule) => (d) => { const [a, b] = pick(d); return N('다음을 계산하시오.', a / b, { figure: figure(a, b), explain: shown(a, b), facts: { divide: [a, b], rule } }); };
  const two = (pick, figure, rule) => (d) => { const [a, b] = pick(d); return M('다음을 계산하여 몫과 나머지를 구하시오.', both(a, b), { figure: figure(a, b), explain: shown(a, b), facts: { divide: [a, b], rule } }); };
  const labelled = (answers) => answers.map((answer, i) => ({ label: LABELS[i], answer }));
  const rowsOf = (a, b) => longDivision(b, a).rows.map((row) => row.value);

  B.addUnit({
    id: '3-2-2', grade: 3, semester: 2, no: 2, title: '나눗셈', version: 4,
    groups: [
      {
        id: 'tens', title: '(몇십)÷(몇)', standard: CALC,
        types: [
          T('tens-calc', '내림이 없는 (몇십)÷(몇)', '①3 ②1 ③4', one(tensPlain, flat, 'tensPlain')),
          T('tens-down', '내림이 있는 (몇십)÷(몇)', '①3 ②1 ③4', one(tensDown, flat, 'tensDown')),
          T('tens-col', '내림이 있는 (몇십)÷(몇)의 세로셈', '①4 ②2 ③4', one(tensDown, tall, 'tensDown')),
          T('tens-relate', '(몇)÷(몇)과 (몇십)÷(몇)', '①2 ②6 ③2', (d) => {
            // 6÷2=3 → 60÷2=30
            const [q, b] = d.until(() => [d.int(2, 4), d.int(2, 4)], ([x, y]) => x * y <= 9);
            return M('㉠, ㉡에 알맞은 수는?', labelled([q, q * 10]), {
              figure: lines([expr(q * b, '/', b, '=', box(LABELS[0])), expr(q * b * 10, '/', b, '=', box(LABELS[1]))]),
              explain: `${josa(q * b * 10, '은/는')} ${q * b}의 10배이므로 몫도 10배가 된다.`, facts: { calc: [[E(q * b, '/', b), 0], [E(q * b * 10, '/', b), 1]] }
            });
          }),
          T('tens-times', '몫이 몇 배인지', '②7 ③3', (d) => {
            const [q, b] = d.until(() => [d.int(2, 4), d.int(2, 4)], ([x, y]) => x * y <= 9);
            return N(`${q * b * 10} ÷ ${b}의 몫은 ${q * b} ÷ ${b}의 몫의 몇 배인가?`, 10, {
              unit: '배', explain: `${shown(q * b * 10, b)}, ${shown(q * b, b)}이다. 나누어지는 수가 10배가 되면 몫도 10배가 된다.`, facts: { calc: [[`(${q * b * 10}/${b})/(${q * b}/${b})`, 0]] }
            });
          }),
          T('tens-model', '십 모형을 일 모형으로 바꾸어 나누기', '①1 ②4 ③1', (d) => {
            // 십 모형 7개를 5묶음으로: 한 묶음에 십 모형 1개, 남은 2개는 일 모형 20개 → 4개씩
            const [a, b] = tensDown(d), t = a / 10, keep = Math.floor(t / b), left = t % b;
            return M(`십 모형 ${t}개를 똑같이 ${b}묶음으로 나누려고 한다. 남는 십 모형을 일 모형으로 바꾸어 나누면 한 묶음은 십 모형 ${box(LABELS[0])}개와 일 모형 ${box(LABELS[1])}개이다. ㉠, ㉡에 알맞은 수는?`, labelled([keep, left * 10 / b]), {
              figure: blocks(a), explain: `십 모형을 한 묶음에 ${keep}개씩 놓으면 ${left}개가 남는다. 남은 십 모형 ${left}개는 일 모형 ${left * 10}개와 같으므로 한 묶음에 일 모형을 ${left * 10 / b}개씩 놓는다. ${shown(a, b)}`,
              facts: { calc: [[`(${t}-${t}%${b})/${b}`, 0], [`(${t}%${b})*10/${b}`, 1]], unseen: [10], divide: [a, b], divideFree: true, rule: 'tensDown' }
            });
          }),
          T('tens-word', '문장제: 똑같이 나누기', '①6 ②5 ③6', (d) => {
            const [a, b] = tensPlain(d);
            return N(`색 구슬 ${a}개를 ${b}명이 똑같이 나누어 가지려고 한다. 한 명이 가지는 색 구슬은 몇 개인가?`, a / b, { unit: '개', explain: shown(a, b), facts: { divide: [a, b] } });
          }),
          T('tens-word2', '문장제: 같은 수씩 묶기', '①6 ②5 ③6', (d) => {
            const [a, b] = tensDown(d);
            return N(`공책 ${a}권을 한 묶음에 ${b}권씩 묶으려고 한다. 묶음은 몇 개가 되는가?`, a / b, { unit: '개', explain: shown(a, b), facts: { divide: [a, b] } });
          })
        ]
      },
      {
        id: 'plain', title: '내림이 없는 (몇십몇)÷(몇)', standard: CALC,
        types: [
          T('plain-calc', '가로셈', '①9 ②9 ③10', one((d) => exact2(d, false), flat, 'plain')),
          T('plain-col', '세로셈', '①9 ②10 ③10', one((d) => exact2(d, false), tall, 'plain')),
          T('plain-split', '십과 일로 갈라 나누기', '①5 ②11 ③9', (d) => {
            // 39÷3: 30÷3=10, 9÷3=3
            const [a, b] = exact2(d, false), tens = Math.floor(a / 10) * 10, ones = a % 10;
            return M('㉠, ㉡, ㉢에 알맞은 수는?', labelled([tens / b, ones / b, a / b]), {
              figure: lines([expr(tens, '/', b, '=', box(LABELS[0])), expr(ones, '/', b, '=', box(LABELS[1])), expr(a, '/', b, '=', box(LABELS[2]))]),
              explain: `${josa(a, '을/를')} ${josa(tens, '과/와')} ${josa(ones, '으로/로')} 갈라 각각 나눈 몫을 더한다. ${tens / b} + ${ones / b} = ${a / b}`,
              facts: { calc: [[E(tens, '/', b), 0], [E(ones, '/', b), 1], [E(a, '/', b), 2]] }
            });
          }),
          T('plain-steps', '세로셈의 계산 과정', '①8 ②11 심6', (d) => {
            const [a, b] = exact2(d, false), rows = rowsOf(a, b);
            return M('나눗셈을 세로로 계산한 것이다. ㉠, ㉡에 알맞은 수는?', labelled([a / b, rows[2]]), {
              figure: divSteps(b, a, { steps: true, quot: LABELS[0], rows: { 2: LABELS[1] } }),
              explain: `십의 자리부터 차례로 나눈다. ${shown(a, b)}이고, 일의 자리에서 빼는 수는 ${b} × ${(a / b) % 10} = ${rows[2]}이다.`, facts: { longDiv: { a, b, asks: ['quot', 2] } }
            });
          }),
          T('plain-model', '수 모형을 똑같이 나누기', '①7 ②12 ③7', (d) => {
            const [a, b] = exact2(d, false), t = Math.floor(a / 10), o = a % 10;
            return M(`수 모형을 똑같이 ${b}묶음으로 나누려고 한다. 한 묶음은 십 모형 ${box(LABELS[0])}개와 일 모형 ${box(LABELS[1])}개이다. ㉠, ㉡에 알맞은 수는?`, labelled([t / b, o / b]), {
              figure: blocks(a), explain: `십 모형 ${t}개를 ${b}묶음으로 나누면 ${t / b}개씩, 일 모형 ${o}개를 ${b}묶음으로 나누면 ${o / b}개씩이다. ${shown(a, b)}`,
              facts: { calc: [[E(t, '/', b), 0], [E(o, '/', b), 1]], divide: [a, b], divideFree: true, rule: 'plain' }
            });
          }),
          T('plain-layout', '나눗셈식을 세로로 나타내기', '①4 ③8', (d) => {
            // 84÷4 를 세로로 쓴 것 고르기: 나누는 수와 나누어지는 수의 자리를 바꾼 것, 숫자의 차례를 바꾼 것
            const [a, b] = d.until(() => exact2(d, false), ([x]) => Math.floor(x / 10) !== x % 10), flipped = (a % 10) * 10 + Math.floor(a / 10);
            const rows = d.shuffle([[b, a], [a, b], [b, flipped]]);
            return C(`${a} ÷ ${josa(b, '을/를')} 세로로 바르게 나타낸 것은?`, LABELS.slice(0, 3), rows.findIndex(([x, y]) => x === b && y === a), {
              figure: tagged(rows.map(([x, y]) => divColumn(x, y))), explain: `나누어지는 수 ${josa(a, '을/를')} 안쪽에, 나누는 수 ${josa(b, '을/를')} 왼쪽에 쓴다.`,
              facts: { truth: rows.map(([x, y]) => x === b && y === a), want: true }
            });
          }),
          T('plain-word', '문장제: 한 묶음의 수', '①10 ②13 ③13', (d) => {
            const [a, b] = exact2(d, false);
            return N(`구슬 ${a}개를 주머니 ${b}개에 똑같이 나누어 담았다. 주머니 한 개에 담은 구슬은 몇 개인가?`, a / b, { unit: '개', explain: shown(a, b), facts: { divide: [a, b] } });
          })
        ]
      },
      {
        id: 'down', title: '내림이 있는 (몇십몇)÷(몇)', standard: CALC,
        types: [
          T('down-calc', '가로셈', '①13 ②14 ③18', one((d) => exact2(d, true), flat, 'down')),
          T('down-col', '세로셈', '①13 ②15 ③18', one((d) => exact2(d, true), tall, 'down')),
          T('down-steps', '세로셈의 계산 과정', '①12 ②16 ③16 심9', (d) => {
            // 96÷6: 6을 빼고 남은 3 옆에 6을 내려 쓴 36
            const [a, b] = exact2(d, true), rows = rowsOf(a, b);
            return M('나눗셈을 세로로 계산한 것이다. ㉠, ㉡에 알맞은 수는?', labelled([a / b, rows[1]]), {
              figure: divSteps(b, a, { steps: true, quot: LABELS[0], rows: { 1: LABELS[1] } }),
              explain: `십의 자리를 계산하고 남은 ${Math.floor(a / 10) % b} 옆에 일의 자리 수 ${josa(a % 10, '을/를')} 내려 쓰면 ${rows[1]}이다. ${shown(a, b)}`, facts: { longDiv: { a, b, asks: ['quot', 1] } }
            });
          }),
          T('down-means', '세로셈에서 뺀 수가 나타내는 수', '①26 ③16', (d) => {
            // 72÷3 에서 7 아래에 쓴 6은 60
            const [a, b] = exact2(d, true), sub = rowsOf(a, b)[0];
            return N(`${a} ÷ ${josa(b, '을/를')} 세로로 계산한 것이다. 계산 과정에서 처음에 뺀 ${josa(sub, '이/가')} 실제로 나타내는 수는?`, sub * 10, {
              figure: divSteps(b, a, { steps: true }), explain: `처음에 뺀 ${josa(sub, '은/는')} 십의 자리에 쓴 수이므로 ${b} × ${sub / b * 10} = ${josa(sub * 10, '을/를')} 나타낸다.`,
              facts: { calc: [[`${sub}*10`, 0]], unseen: [10] }
            });
          }),
          T('down-model', '수 모형으로 내림 알아보기', '①11 ②17 ③14', (d) => {
            // 42÷3: 십 모형 4개를 1개씩 놓으면 1개가 남고, 일 모형으로 바꾸면 12개
            const [a, b] = exact2(d, true), t = Math.floor(a / 10), o = a % 10, left = t % b;
            return M(`수 모형을 똑같이 ${b}묶음으로 나누려고 한다. 십 모형을 한 묶음에 ${Math.floor(t / b)}개씩 놓으면 십 모형 ${box(LABELS[0])}개가 남는다. 남은 십 모형을 일 모형으로 바꾸면 일 모형은 모두 ${box(LABELS[1])}개가 된다. ㉠, ㉡에 알맞은 수는?`, labelled([left, left * 10 + o]), {
              figure: blocks(a), explain: `남은 십 모형 ${left}개는 일 모형 ${left * 10}개와 같다. 일 모형은 모두 ${left * 10} + ${o} = ${left * 10 + o}(개)이므로 한 묶음에 ${(left * 10 + o) / b}개씩 놓는다. ${shown(a, b)}`,
              facts: { calc: [[`${t}%${b}`, 0], [`(${t}%${b})*10+${o}`, 1]], unseen: [10], divide: [a, b], divideFree: true, rule: 'down' }
            });
          }),
          T('down-word', '문장제: 묶음의 수', '①14 ②18 ③20', (d) => {
            const [a, b] = exact2(d, true);
            return N(`쿠키 ${a}개를 접시 한 개에 ${b}개씩 놓았다. 쿠키를 놓은 접시는 몇 개인가?`, a / b, { unit: '개', explain: shown(a, b), facts: { divide: [a, b] } });
          })
        ]
      },
      {
        id: 'rest', title: '나머지가 있는 (몇십몇)÷(몇)', standard: CALC,
        types: [
          T('rest-words', '몫과 나머지의 뜻', '①15 ②26 ③22', (d) => {
            const [a, b] = rest1(d, (x, y, q, r) => q !== r), q = Math.floor(a / b), r = a % b;
            const rows = d.shuffle([[`몫은 ${q}이다.`, true], [`나머지는 ${q}이다.`, false], [`${josa(a, '은/는')} ${josa(b, '으로/로')} 나누어떨어진다.`, false], [`나누는 수는 ${a}이다.`, false]]);
            return C(`${a} ÷ ${b} = ${q} … ${r}에 대한 설명으로 옳은 것은?`, rows.map(([text]) => text), rows.findIndex(([, ok]) => ok), {
              explain: `${josa(a, '을/를')} ${josa(b, '으로/로')} 나누면 몫은 ${q}이고 ${josa(r, '이/가')} 남는다. 이때 ${josa(r, '을/를')} 나머지라고 한다. 나머지가 0일 때 나누어떨어진다고 한다.`,
              facts: { truth: rows.map(([, ok]) => ok), want: true, divide: [a, b], divideFree: true }
            });
          }),
          T('rest-picture', '그림을 보고 몫과 나머지 구하기', '①16 ②24 ③23 심13', (d) => {
            const [a, b] = d.until(() => [d.int(13, 29), d.int(3, 8)], ([x, y]) => x % y !== 0 && Math.floor(x / y) >= 2), cols = b === 5 ? 6 : 5;
            return M(`구슬을 ${b}개씩 묶으려고 한다. 몇 묶음이 되고, 몇 개가 남는가?`, [{ answer: Math.floor(a / b), unit: '묶음' }, { answer: a % b, unit: '개' }], {
              figure: dots(Math.ceil(a / cols), cols, { count: a }), explain: `구슬은 ${a}개이다. ${shown(a, b)}`, facts: { divide: [a, b] }
            });
          }),
          T('rest-calc1', '몫이 한 자리 수인 계산', '①18 ②21 ③24', two(rest1, flat, 'rest1')),
          T('rest-calc2', '몫이 두 자리 수이고 내림이 없는 계산', '①18 ②22 ③24', two(restPlain, tall, 'restPlain')),
          T('rest-calc3', '내림이 있는 계산', '①18 ②21 ③24', two(restDown, flat, 'restDown')),
          T('rest-steps', '세로셈의 계산 과정', '①17 ②23 심12', (d) => {
            // 78÷4: 4, 38, 36, 2
            const [a, b] = restDown(d), rows = rowsOf(a, b);
            return M('나눗셈을 세로로 계산한 것이다. ㉠, ㉡에 알맞은 수는?', labelled([rows[1], rows[2]]), {
              figure: divSteps(b, a, { steps: true, rows: { 1: LABELS[0], 2: LABELS[1] } }),
              explain: `십의 자리를 계산하고 남은 ${Math.floor(a / 10) % b} 옆에 ${josa(a % 10, '을/를')} 내려 쓰면 ${rows[1]}이다. ${b} × ${Math.floor(a / b) % 10} = ${josa(rows[2], '을/를')} 빼면 ${josa(a % b, '이/가')} 남는다.`,
              facts: { longDiv: { a, b, asks: [1, 2] } }
            });
          }),
          T('rest-times', '몫을 구하는 데 알맞은 곱셈식', '②27', (d) => {
            // 39÷7 → 7×5=35
            const [a, b] = rest1(d, (x, y, q) => q >= 3 && q <= 7), q = Math.floor(a / b), qs = d.shuffle([q - 1, q, q + 1, q + 2]);
            return C(`${a} ÷ ${b}의 몫을 구하는 데 알맞은 곱셈식은?`, qs.map((v) => `${b} × ${v} = ${b * v}`), qs.indexOf(q), {
              explain: `${b} × ${q} = ${josa(b * q, '은/는')} ${a}보다 작고 ${b} × ${q + 1} = ${josa(b * (q + 1), '은/는')} ${a}보다 크다. 따라서 몫은 ${q}이다.`,
              facts: { pick: { expr: `(${a}-${a}%${b})/${b}`, options: qs }, divide: [a, b], divideFree: true }
            });
          }),
          T('rest-can', '나머지가 될 수 없는 수', '①19 ②34 ③25 심15', (d) => {
            // 0도 나머지가 될 수 있다. 나누는 수와 같은 수는 될 수 없다.
            const b = d.int(4, 9), list = d.shuffle([0, d.int(1, b - 2), b - 1, b]);
            return C(`어떤 수를 ${josa(b, '으로/로')} 나눌 때, 나머지가 될 수 없는 수는?`, list.map(String), list.indexOf(b), {
              explain: `나머지는 나누는 수 ${b}보다 작아야 한다. 나머지가 될 수 있는 수는 0부터 ${b - 1}까지이다.`, facts: { only: { values: list, test: 'atLeast', target: b } }
            });
          }),
          T('rest-cannot', '그 나머지가 나올 수 없는 나눗셈', '①20 ②35 ③26 심16', (d) => {
            const r = d.int(3, 6), list = d.shuffle([r, r + 1, r + 2, r + 3]);
            return C(`나머지가 ${josa(r, '이/가')} 될 수 없는 나눗셈은?`, list.map((v) => `□ ÷ ${v}`), list.indexOf(r), {
              explain: `나머지는 나누는 수보다 작아야 한다. ${josa(r, '으로/로')} 나누면 나머지는 ${r}보다 작으므로 ${josa(r, '이/가')} 될 수 없다.`, facts: { only: { values: list, test: 'atMost', target: r } }
            });
          }),
          T('rest-divisor', '가장 큰 나머지로 나누는 수 알기', '②36 심17', (d) => {
            const b = d.int(4, 9);
            return N(`어떤 수를 □로 나눌 때 나머지가 될 수 있는 수 중에서 가장 큰 수는 ${b - 1}이다. □ 안에 알맞은 수는?`, b, {
              explain: `나머지가 될 수 있는 수 중에서 가장 큰 수는 나누는 수보다 1 작은 수이다. ${b - 1} + 1 = ${b}`, facts: { calc: [[`${b - 1}+1`, 0]], unseen: [1] }
            });
          }),
          T('rest-exact', '나누어떨어지는 나눗셈 고르기', '①21 ②33 ③27 심14', (d) => {
            // 넷 가운데 나머지가 0인 것은 하나
            const hit = exact2(d, d.bool()), others = d.until(() => [restDown(d), restPlain(d), restDown(d)], (list) => apart(list.concat([hit])));
            const rows = d.shuffle([hit].concat(others));
            return C('나누어떨어지는 나눗셈은?', LABELS, rows.indexOf(hit), {
              figure: tagged(rows.map(([a, b]) => expr(a, '/', b))), explain: said(rows) + '. 나머지가 0인 나눗셈이 나누어떨어지는 나눗셈이다.', facts: { remainders: rows, want: 'zero' }
            });
          }),
          T('rest-big', '나머지의 크기 비교', '①22 ②30 ③28 심18', (d) => {
            const rows = d.until(() => [rest1(d), rest1(d), rest1(d)], (list) => apart(list) && new Set(list.map(([a, b]) => a % b)).size === 3), values = rows.map(([a, b]) => a % b);
            return C('나머지가 가장 큰 것은?', LABELS.slice(0, 3), values.indexOf(Math.max(...values)), {
              figure: tagged(rows.map(([a, b]) => expr(a, '/', b))), explain: said(rows), facts: { choose: { exprs: rows.map(([a, b]) => `${a}%${b}`), rule: 'max' } }
            });
          }),
          T('rest-same', '나머지가 같은 나눗셈 찾기', '②29 ③29 심19', (d) => {
            const [[a, b], rows] = d.until(() => [rest1(d), [rest1(d), rest1(d), rest1(d)]], ([[x, y], list]) => apart(list.concat([[x, y]])) && list.filter(([z, w]) => z % w === x % y).length === 1 && list.every(([, w]) => w !== y));
            const r = a % b;
            return C(`${a} ÷ ${josa(b, '과/와')} 나머지가 같은 것은?`, LABELS.slice(0, 3), rows.findIndex(([x, y]) => x % y === r), {
              figure: tagged(rows.map(([x, y]) => expr(x, '/', y))), explain: `${shown(a, b)}이다. ${said(rows)}`, facts: { choose: { exprs: rows.map(([x, y]) => `${x}%${y}`), rule: 'equals', target: r } }
            });
          }),
          T('rest-fix', '잘못 계산한 세로셈 바로잡기', '①54 ②83 ③67 심58', (d) => {
            // 47÷6 을 몫 6, 나머지 11로 계산한 세로셈
            const [a, b] = rest1(d, (x, y, q) => q >= 3), q = Math.floor(a / b), r = a % b;
            return M('나눗셈을 잘못 계산한 것이다. 바르게 계산한 몫과 나머지는?', both(a, b), {
              figure: divSteps(b, a, { steps: true, given: { quot: q - 1, rows: [{ value: b * (q - 1), end: 1, sub: true }, { value: r + b, end: 1, sub: false }] } }),
              explain: `나머지 ${josa(r + b, '이/가')} 나누는 수 ${b}보다 크므로 더 나눌 수 있다. ${shown(a, b)}`, facts: { divide: [a, b], restTalk: { a, b, saidQ: q - 1, saidR: r + b } }
            });
          }),
          T('rest-word', '문장제: 몫과 나머지', '①23 ②25 ③33 심20', (d) => {
            const [a, b] = rest1(d);
            return M(`풍선 ${a}개를 한 명에게 ${b}개씩 나누어 주려고 한다. 몇 명에게 줄 수 있고, 몇 개가 남는가?`, [{ answer: Math.floor(a / b), unit: '명' }, { answer: a % b, unit: '개' }], { explain: shown(a, b), facts: { divide: [a, b] } });
          }),
          T('rest-allin', '문장제: 모두 넣으려면 적어도 몇 개', '①62 ②42 ③35 심22', (d) => {
            const [a, b] = rest1(d, (x, y, q) => q >= 4), q = Math.floor(a / b), r = a % b;
            return N(`책 ${a}권을 책꽂이 한 칸에 ${b}권씩 꽂으려고 한다. 책을 모두 꽂으려면 책꽂이는 적어도 몇 칸 필요한가?`, q + 1, {
              unit: '칸', explain: `${shown(a, b)}이다. ${q}칸에 꽂으면 ${r}권이 남으므로 한 칸이 더 필요하다. ${q} + 1 = ${q + 1}`, facts: { calc: [[`(${a}-${a}%${b})/${b}+1`, 0]], unseen: [1] }
            });
          }, { standard: SOLVE })
        ]
      },
      {
        id: 'three', title: '(세 자리 수)÷(한 자리 수)', standard: CALC,
        types: [
          T('three-hundreds', '(몇백)÷(몇)', '②50 ③41', one((d) => d.pick([[400, 2], [600, 2], [800, 2], [600, 3], [900, 3], [800, 4]]), flat, 'hundreds')),
          T('three-calc', '몫이 세 자리 수인 계산', '①27 ②44 ③43', one((d) => three(d, 'full'), tall, 'full')),
          T('three-short', '몫이 두 자리 수인 계산', '①27 ②43 ③43', one((d) => three(d, 'short'), tall, 'short')),
          T('three-zero', '몫에 0이 있는 계산', '②44 ②47 심60', one((d) => three(d, 'zero'), flat, 'zero')),
          T('three-rest', '나머지가 있고 몫이 세 자리 수인 계산', '①27 ②46 ③44', two((d) => three(d, 'restFull'), tall, 'restFull')),
          T('three-rest2', '나머지가 있고 몫이 두 자리 수인 계산', '①27 ②45 ③44', two((d) => three(d, 'restShort'), flat, 'restShort')),
          T('three-steps', '세로셈의 계산 과정', '①25 ②47', (d) => {
            // 738÷3: 6, 13, 12, 18, 18, 0
            const [a, b] = three(d, 'full'), rows = rowsOf(a, b);
            return M('나눗셈을 세로로 계산한 것이다. ㉠, ㉡에 알맞은 수는?', labelled([rows[1], rows[3]]), {
              figure: divSteps(b, a, { steps: true, rows: { 1: LABELS[0], 3: LABELS[1] } }),
              explain: `백의 자리, 십의 자리, 일의 자리의 차례로 나눈다. 남은 수 옆에 아래 자리 수를 내려 쓰면 ㉠은 ${rows[1]}, ㉡은 ${rows[3]}이다. ${shown(a, b)}`, facts: { longDiv: { a, b, asks: [1, 3] } }
            });
          }),
          T('three-digits', '몫이 두 자리 수인 나눗셈 고르기', '③46', (d) => {
            // 백의 자리 수가 나누는 수보다 작으면 몫은 두 자리 수
            const hit = three(d, 'short'), others = d.until(() => [three(d, 'full'), three(d, 'full'), three(d, 'full')], (list) => apart(list.concat([hit])));
            const rows = d.shuffle([hit].concat(others));
            return C('몫이 두 자리 수인 나눗셈은?', LABELS, rows.indexOf(hit), {
              figure: tagged(rows.map(([a, b]) => expr(a, '/', b))), explain: `백의 자리 수가 나누는 수보다 작으면 몫은 두 자리 수이다. ${said(rows)}`,
              facts: { choose: { exprs: rows.map(([a, b]) => E(a, '/', b)), rule: 'onlyBelow', target: 100 } }
            });
          }),
          T('three-word', '문장제: 똑같이 나누기', '①28 ②48 ③47 심28', (d) => {
            const [a, b] = three(d, 'full');
            return N(`색종이 ${a}장을 ${b}모둠에 똑같이 나누어 주었다. 한 모둠이 받은 색종이는 몇 장인가?`, a / b, { unit: '장', explain: shown(a, b), facts: { divide: [a, b] } });
          }),
          T('three-word2', '문장제: 몫과 나머지', '②49 심29', (d) => {
            const [a, b] = three(d, 'restShort');
            return M(`연필 ${a}자루를 ${b}개 반에 똑같이 나누어 주려고 한다. 한 반에 몇 자루씩 줄 수 있고, 몇 자루가 남는가?`, [{ answer: Math.floor(a / b), unit: '자루' }, { answer: a % b, unit: '자루' }], { explain: shown(a, b), facts: { divide: [a, b] } });
          }),
          T('three-weeks', '문장제: 날수를 몇 주 며칠로', '①61 ③49 심30', (d) => {
            const days = d.until(() => d.int(100, 365), (v) => v % 7 !== 0);
            return M(`${days}일은 몇 주 며칠인가?`, [{ answer: Math.floor(days / 7), unit: '주' }, { answer: days % 7, unit: '일' }], { explain: `1주일은 7일이다. ${shown(days, 7)}`, facts: { divide: [days, 7] } });
          }, { standard: SOLVE }),
          T('three-unit', '문장제: 단위를 바꾸어 나누기', '①60', (d) => {
            const [m, cm, b] = d.until(() => [d.int(1, 4), d.int(11, 98), d.int(3, 8)], ([x, y, z]) => (x * 100 + y) % z === 0 && y % 10 !== 0);
            return N(`길이가 ${m} m ${cm} cm인 끈을 똑같이 ${b}도막으로 잘랐다. 한 도막의 길이는 몇 cm인가?`, (m * 100 + cm) / b, {
              unit: 'cm', explain: `${m} m ${cm} cm는 ${m * 100 + cm} cm이다. ${shown(m * 100 + cm, b)}`, facts: { calc: [[`(${m}*100+${cm})/${b}`, 0]], unseen: [100] }
            });
          }, { standard: SOLVE })
        ]
      },
      {
        id: 'est', title: '나눗셈의 어림셈', standard: CALC,
        types: [
          T('est-pick', '어림셈에 알맞은 식 고르기', '①65', (d) => {
            // 298÷3 → 300÷3
            const [h, b] = d.until(() => [d.int(2, 8) * 100, d.int(2, 9)], ([x, y]) => x % y === 0), a = h + d.pick([-9, -8, -7, -6, -5, -4, -3, 3, 4, 5, 6, 7, 8, 9]);
            const list = d.shuffle([h - 100, h, h + 100]);
            return C(`${a} ÷ ${b}의 몫을 어림셈으로 구하려고 한다. 어림셈에 가장 알맞은 식은?`, list.map((v) => `${v} ÷ ${b}`), list.indexOf(h), {
              explain: `${josa(a, '은/는')} ${h}에 가까우므로 ${josa(a, '을/를')} 약 ${josa(h, '으로/로')} 어림한다. ${shown(h, b)}이므로 몫은 약 ${h / b}이다.`,
              facts: { choose: { exprs: list.map(String), rule: 'nearest', target: a }, nearHundred: [a, h] }
            });
          }),
          T('est-both', '어림한 몫과 실제 몫', '①67 ②51 ③42', (d) => {
            // 398÷4: 어림하면 약 100, 실제로는 99…2
            const [h, b] = d.until(() => [d.int(2, 8) * 100, d.int(3, 9)], ([x, y]) => x % y === 0), a = d.until(() => h + d.pick([-9, -8, -7, -6, -5, -4, -3, 3, 4, 5, 6, 7, 8, 9]), (v) => v % b !== 0);
            return M(`${a} ÷ ${b}의 몫을 어림한 값과 실제로 계산한 값을 구하려고 한다. ㉠, ㉡, ㉢에 알맞은 수는?`, labelled([h / b, Math.floor(a / b), a % b]), {
              figure: lines([`${josa(a, '을/를')} 몇백으로 어림하여 계산하면 몫은 약 ${box(LABELS[0])}이다.`, `실제로 계산하면 몫은 ${box(LABELS[1])}, 나머지는 ${box(LABELS[2])}이다.`]),
              explain: `${josa(a, '을/를')} 약 ${josa(h, '으로/로')} 어림하면 ${shown(h, b)}이다. 실제로 계산하면 ${shown(a, b)}이다.`,
              facts: { calc: [[E(h, '/', b), 0], [`(${a}-${a}%${b})/${b}`, 1], [`${a}%${b}`, 2]], unseen: [h], nearHundred: [a, h] }
            });
          }),
          T('est-enough', '어림셈으로 충분한지 판단하기', '①69 심32', (d) => {
            // 6개씩 담는 상자 50개와 귤 298개: 300÷6=50
            const [n, b] = d.until(() => [d.int(2, 9) * 10, d.int(3, 9)], ([x, y]) => (x * y) % 100 === 0 && x * y <= 800), h = n * b, a = h + d.pick([-8, -7, -6, -5, 5, 6, 7, 8]), fits = a <= h;
            const size = fits ? '작으므로' : '크므로';
            const rows = d.shuffle([[`${h} ÷ ${b} = ${n}이고 ${josa(a, '은/는')} ${h}보다 ${size} 모두 담을 수 있다.`, fits], [`${h} ÷ ${b} = ${n}이고 ${josa(a, '은/는')} ${h}보다 ${size} 상자가 모자란다.`, !fits], [`${josa(a, '은/는')} ${josa(h, '과/와')} 다르므로 어림셈으로는 알 수 없다.`, false]]);
            return C(`귤을 한 상자에 ${b}개씩 담으려고 한다. 상자 ${n}개에 귤 ${a}개를 모두 담을 수 있는지 어림셈으로 알아본 것으로 옳은 것은?`, rows.map(([text]) => text), rows.findIndex(([, ok]) => ok), {
              explain: `상자 ${n}개에는 ${b} × ${n} = ${h}(개)까지 담을 수 있다. 귤 ${a}개는 ${h}개보다 ${fits ? '적으므로 모두 담을 수 있다' : '많으므로 상자가 모자란다'}.`,
              facts: { truth: rows.map(([, ok]) => ok), want: true, enough: { a, b, n, fits } }
            });
          }, { standard: SOLVE }),
          T('est-about', '문장제: 어림하여 약 몇', '①68 심31', (d) => {
            const [h, b] = d.until(() => [d.int(2, 9) * 100, d.int(2, 9)], ([x, y]) => x % y === 0 && x / y !== 100), a = h + d.pick([-8, -7, -6, -5, -4, 4, 5, 6, 7, 8]);
            return N(`밤 ${a}개를 ${b}상자에 똑같이 나누어 담으려고 한다. ${josa(a, '을/를')} 몇백으로 어림하여 계산하면 한 상자에 약 몇 개씩 담게 되는가?`, h / b, {
              unit: '개', lead: '약', explain: `${josa(a, '을/를')} 약 ${josa(h, '으로/로')} 어림한다. ${shown(h, b)}`, facts: { calc: [[E(h, '/', b), 0]], unseen: [h], nearHundred: [a, h] }
            });
          }, { standard: SOLVE })
        ]
      },
      {
        id: 'check', title: '계산이 맞는지 확인하기', standard: CALC,
        types: [
          T('check-fill', '확인하는 식 완성하기', '①29 ②56 ③50', (d) => {
            // 38÷5=7…3 → 5×7=35, 35+3=38
            const [a, b] = rest1(d), q = Math.floor(a / b), r = a % b;
            return M(`${a} ÷ ${b} = ${q} … ${josa(r, '이/가')} 맞는지 확인하려고 한다. ㉠, ㉡에 알맞은 수는?`, labelled([b * q, a]), {
              figure: lines([expr(b, '*', q, '=', box(LABELS[0])), expr(box(LABELS[0]), '+', r, '=', box(LABELS[1]))]),
              explain: `나누는 수와 몫의 곱에 나머지를 더하면 나누어지는 수가 된다. ${expr(b, '*', q, '=', b * q)}, ${expr(b * q, '+', r, '=', a)}`, facts: { calc: [[E(b, '*', q), 0], [`${b}*${q}+${r}`, 1]], divide: [a, b], divideFree: true }
            });
          }),
          T('check-what', '나누어지는 수 구하기', '①35 ②61 ③55 심41', (d) => {
            // □÷6=12…3
            const [a, b] = d.until(() => [d.int(31, 98), d.int(3, 9)], ([x, y]) => x % y !== 0 && Math.floor(x / y) >= 4), q = Math.floor(a / b), r = a % b;
            return N('□ 안에 알맞은 수는?', a, {
              figure: `<span class="mb-expr">${box()} <i>÷</i> ${b} <i>=</i> ${q} … ${r}</span>`, explain: `나누는 수와 몫의 곱에 나머지를 더한다. ${expr(b, '*', q, '=', b * q)}, ${expr(b * q, '+', r, '=', a)}`, facts: { calc: [[`${b}*${q}+${r}`, 0]] }
            });
          }),
          T('check-back', '확인한 식을 보고 나눗셈식 되찾기', '①34 ②60 ③53 심39', (d) => {
            // 7×4=28, 28+5=33 → 33÷7=4…5
            const [b, q, r] = d.until(() => [d.int(4, 9), d.int(3, 12), d.int(1, 8)], ([x, y, z]) => z < x && y !== z && y !== x), a = b * q + r;
            return M('나눗셈을 계산하고 계산이 맞는지 확인하였다. ㉠, ㉡, ㉢에 알맞은 수는?', labelled([a, q, r]), {
              figure: lines([`확인: ${expr(b, '*', q, '=', b * q)}, ${expr(b * q, '+', r, '=', a)}`, `계산한 나눗셈: <span class="mb-expr">${box(LABELS[0])} <i>÷</i> ${b} <i>=</i> ${box(LABELS[1])} … ${box(LABELS[2])}</span>`]),
              explain: `나누는 수와 몫의 곱에 나머지를 더하면 나누어지는 수가 된다. 나누는 수가 ${b}이므로 몫은 ${q}, 나머지는 ${r}, 나누어지는 수는 ${a}이다.`,
              facts: { calc: [[`${b}*${q}+${r}`, 0], [String(q), 1], [String(r), 2]] }
            });
          }),
          T('check-word', '문장제: 나눈 결과로 처음 수 구하기', '③59', (d) => {
            const [b, q, r] = d.until(() => [d.int(3, 9), d.int(11, 24), d.int(1, 8)], ([x, y, z]) => z < x);
            return N(`딱지를 ${b}명에게 ${q}장씩 나누어 주었더니 ${r}장이 남았다. 처음에 있던 딱지는 몇 장인가?`, b * q + r, {
              unit: '장', explain: `${expr(b, '*', q, '=', b * q)}, ${expr(b * q, '+', r, '=', b * q + r)}`, facts: { calc: [[`${b}*${q}+${r}`, 0]] }
            });
          }, { standard: SOLVE }),
          T('check-judge', '바르게 계산한 식 고르기', '①31 ①53 ②38 ③66', (d) => {
            // 몫이나 나머지를 틀리게 적은 식 둘과 바른 식 하나
            const rows = d.until(() => [rest1(d), rest1(d), rest1(d)], apart), good = d.int(0, 2);
            const told = rows.map(([a, b], i) => { const q = Math.floor(a / b), r = a % b; return i === good ? [q, r] : i === (good + 1) % 3 ? [q - 1, r + b] : [q, r + 1]; });
            return C('바르게 계산한 것은?', LABELS.slice(0, 3), good, {
              figure: tagged(rows.map(([a, b], i) => `${expr(a, '/', b, '=', told[i][0])} … ${told[i][1]}`)), explain: said(rows) + '. 나누는 수와 몫의 곱에 나머지를 더하면 나누어지는 수가 되어야 하고, 나머지는 나누는 수보다 작아야 한다.',
              facts: { remainders: rows, said: told, want: 'right' }
            });
          })
        ]
      },
      {
        id: 'mix', title: '여러 가지 나눗셈', standard: CALC,
        types: [
          T('mix-compare', '몫의 크기 비교', '①40 ②68 ③60', (d) => {
            const [[a, b], [c, e]] = d.until(() => [exact2(d, true), exact2(d, d.bool())], ([[x, y], [z, w]]) => x !== z && y !== w && Math.abs(x / y - z / w) <= 4);
            const p = a / b, q = c / e;
            return C('두 식의 몫을 비교할 때, ○ 안에 알맞은 것은?', SIGNS, p > q ? 0 : p === q ? 1 : 2, {
              figure: versus(expr(a, '/', b), expr(c, '/', e)), explain: `${shown(a, b)}, ${shown(c, e)}`, facts: { choose: { exprs: [E(a, '/', b), E(c, '/', e)], rule: 'compare' } }
            });
          }),
          T('mix-order', '몫이 가장 큰 나눗셈', '①41 ②69 ③61', (d) => {
            const quotient = ([a, b]) => a / b;
            const rows = d.until(() => [exact2(d, true), exact2(d, false), exact2(d, true)], (list) => apart(list) && new Set(list.map(quotient)).size === 3 && Math.max(...list.map(quotient)) - Math.min(...list.map(quotient)) <= 9);
            const values = rows.map(quotient);
            return C('몫이 가장 큰 것은?', LABELS.slice(0, 3), values.indexOf(Math.max(...values)), {
              figure: tagged(rows.map(([a, b]) => expr(a, '/', b))), explain: said(rows), facts: { choose: { exprs: rows.map(([a, b]) => E(a, '/', b)), rule: 'max' } }
            });
          }),
          T('mix-same', '몫이 같은 나눗셈 찾기', '②71 ③62 심49', (d) => {
            const [[a, b], rows] = d.until(() => [exact2(d, true), [exact2(d, d.bool()), exact2(d, d.bool()), exact2(d, d.bool())]], ([[x, y], list]) => apart(list.concat([[x, y]])) && list.filter(([z, w]) => z / w === x / y).length === 1);
            return C(`${a} ÷ ${josa(b, '과/와')} 몫이 같은 것은?`, LABELS.slice(0, 3), rows.findIndex(([x, y]) => x / y === a / b), {
              figure: tagged(rows.map(([x, y]) => expr(x, '/', y))), explain: `${shown(a, b)}이다. ${said(rows)}`, facts: { choose: { exprs: rows.map(([x, y]) => E(x, '/', y)), rule: 'equals', target: a / b } }
            });
          }),
          T('mix-chain', '이어서 두 번 나누기', '①44 ②67 ③12 심52', (d) => {
            // 96 ÷4 → 24 ÷3 → 8
            const [m, c, b] = d.until(() => [d.int(12, 48), d.int(2, 6), d.int(2, 4)], ([x, y, v]) => x % y === 0 && x / y >= 2 && x % 10 !== 0 && x * v <= 98 && v !== y);
            return M('㉠, ㉡에 알맞은 수는?', labelled([m, m / c]), {
              figure: chain([m * b, '÷' + b, box(LABELS[0]), '÷' + c, box(LABELS[1])]), explain: `${shown(m * b, b)}, ${shown(m, c)}`, facts: { calc: [[E(m * b, '/', b), 0], [`${m * b}/${b}/${c}`, 1]] }
            });
          }),
          T('mix-range', '□ 안에 들어갈 수 있는 가장 큰 수', '①45 ②75 ③68', (d) => {
            const [a, b] = exact2(d, d.bool());
            return N('□ 안에 들어갈 수 있는 자연수 중에서 가장 큰 수는?', a / b - 1, {
              figure: `<span class="mb-expr">${box()} <i>&lt;</i> ${a} <i>÷</i> ${b}</span>`, explain: `${shown(a, b)}이다. □ 안에는 ${a / b}보다 작은 수가 들어갈 수 있으므로 가장 큰 수는 ${a / b - 1}이다.`, facts: { calc: [[`${a}/${b}-1`, 0]], unseen: [1] }
            });
          }),
          T('mix-cards', '수 카드로 만든 가장 큰 수 나누기', '①48 ②79 ③70 심64', (d) => {
            // 3, 7, 5 → 75÷3
            const [x, y, z] = d.until(() => d.shuffle([2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3).sort((p, q) => q - p), ([p, q, r]) => (p * 10 + q) % r === 0);
            return N('수 카드 3장 중에서 2장을 골라 만들 수 있는 가장 큰 두 자리 수를 남은 수 카드의 수로 나누었다. 몫은?', (x * 10 + y) / z, {
              figure: cards(d.shuffle([x, y, z])), explain: `만들 수 있는 가장 큰 두 자리 수는 ${x * 10 + y}이고 남은 수는 ${z}이다. ${shown(x * 10 + y, z)}`, facts: { divCards: [x, y, z] }
            });
          }),
          T('mix-divisor', '나누는 수와 몫의 크기', '②78 심66', (d) => {
            // 나누어지는 수가 같으면 나누는 수가 작을수록 몫이 크다
            const [a, all] = d.pick([[84, [2, 3, 4, 6, 7]], [72, [2, 3, 4, 6, 8]], [96, [2, 3, 4, 6, 8]], [60, [2, 3, 4, 5, 6]], [90, [2, 3, 5, 6, 9]], [48, [2, 3, 4, 6, 8]]]), picks = d.shuffle(all).slice(0, 4), least = Math.min(...picks);
            return C(`${a} ÷ □의 □ 안에 다음 수를 넣어 계산할 때, 몫이 가장 큰 것은?`, picks.map(String), picks.indexOf(least), {
              explain: `나누어지는 수가 같을 때에는 나누는 수가 작을수록 몫이 크다. ${shown(a, least)}`, facts: { choose: { exprs: picks.map((v) => E(a, '/', v)), rule: 'max' } }
            });
          })
        ]
      }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
