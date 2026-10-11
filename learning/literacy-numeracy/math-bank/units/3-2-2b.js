// 3학년 2학기 2단원 나눗셈 — 실력 문항.
// 수집해 둔 평가 자료 가운데 심화·실력 단원평가, 차시별 심화 문제, 수학익힘 심화, 서술형 평가(41개 문서)의 문제 꼴 84개와
// 기본 자료의 꼴을 참고하되, 그대로 옮기지 않고 꼴마다 따져서 냈다.
//
// 실력 문항의 잣대: 어려움은 이 단원에서 배운 것을 정확히 아는가에서 나와야 한다. 이 단원에서 아이들이 흔히 잘못 아는 것을 먼저 적고,
// 그 오개념을 가진 아이가 고를 보기를 넣어 문제를 냈다.
//   ① 나머지는 나누는 수보다 작아야 한다: 확인식만 맞으면 된다고 여기거나, 나머지를 몫과 견주거나, 나머지가 있으면 틀린 계산이라고 여긴다.
//   ② 내림: 십의 자리를 계산하고 남은 수를 나머지로 여기거나, 10이 아니라 1로 보고 일의 자리 수에 더한다.
//   ③ 몫의 가운데 0: 0을 적지 않고 건너뛴다(618÷6을 13으로).
//   ④ 확인하는 식: 몫과 나머지의 자리를 바꾸거나 나머지를 뺀다.
//   ⑤ 나머지의 뜻: 문장제에서 몫만 답하거나 나머지를 답한다(남김없이 나누려면 더 필요한 수, 묶음이 되지 못하는 나머지).
//   ⑥ 가장 큰 나머지는 나누는 수보다 1 작은 수이다.
// 그다음에 계산을 두 번 해야 하는 문제를 실었다(잘못 나눈 수 바로잡기, 곱한 것을 바로잡기, 더한 뒤·곱한 뒤 나누기, 두 몫 비교, 한 묶음을 구해 곱하기).
//
// 뺀 것과 까닭
//  - 상위 학년의 특정 단원에 해당하는 것은 모두 뺐다.
//      5학년 1학기 「약수와 배수」: 나누어떨어지게 하는 나누는 수 모두 찾기, 나누어떨어지는 수를 범위에서 찾기, 남김없이 담기는 상자 고르기
//      5학년 1학기 「다각형의 둘레와 넓이」: 네 변의 길이의 합으로 한 변 구하기
//      4학년 1학기 「곱셈과 나눗셈」: 나누는 수 구하기(두 자리 수로 나누게 된다)
//      4학년 2학기 「관계와 규칙」: 두 식의 결과가 같게 하는 □
//      중학교 내용에 가까운 것: 나머지 조건을 모두 만족하는 수, 연속하는 자연수의 합
//  - 조건 풀이가 어려움의 대부분: 간격, 일의 양, 빠르기와 시각, □ 자리 숫자 찾기, 군데군데 빈 세로셈, 수 카드로 몫이 가장 큰 나눗셈 만들기, 두 몫 사이의 수 세기
//  - 뜻 없는 셈: 두 몫의 합·차, 몫과 나머지로 새 수 만들기
//  - 서술형: 확인식 쓰기, 계산 방법 쓰기, 문제 만들기, 틀린 문장 고치기
// 묻는 말: 수나 값을 물을 때는 "~은?/~는?", 양을 물을 때는 "몇 ~인가?" 로 맺는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, divSteps, N, M, C } = B.kit;
  const CALC = '4수01-06', SOLVE = '4수01-08';
  const H = (id, title, source, make, more) => Object.assign({ id, level: '실력', title, source, make }, more || {});
  const rest2 = (d, ok) => d.until(() => [d.int(26, 98), d.int(3, 9)], ([a, b]) => a % b !== 0 && Math.floor(a / b) >= 4 && (!ok || ok(a, b, Math.floor(a / b), a % b)));
  const down2 = (d, ok) => d.until(() => [d.int(32, 98), d.int(2, 8)], ([a, b]) => a % b === 0 && a % 10 !== 0 && Math.floor(a / 10) % b !== 0 && Math.floor(a / 10) > b && (!ok || ok(a, b)));

  B.addGroup('3-2-2', {
    id: 'hard', title: '실력 문제', standard: CALC,
    types: [
      H('h-rem', '나머지가 나누는 수보다 큰 계산', '세로셈 고치기: 나머지가 나누는 수보다 큼(심화 58), 나눗셈식을 두고 한 말의 참·거짓(심화 34)', (d) => {
        // 47÷6 = 6 … 11 이라고 한 계산
        const [a, b] = rest2(d, (x, y, q, r) => r + y > q - 1), q = Math.floor(a / b), r = a % b;
        const rows = d.shuffle([
          { text: `${b} × ${q - 1}에 ${josa(r + b, '을/를')} 더하면 ${josa(a, '이/가')} 되므로 바르게 계산하였다.`, ok: false },      // 확인식만 맞으면 된다는 아이
          { text: `나머지 ${josa(r + b, '이/가')} 나누는 수 ${b}보다 크므로 더 나눌 수 있다.`, ok: true },
          { text: `나머지 ${josa(r + b, '이/가')} 몫 ${q - 1}보다 크므로 잘못 계산하였다.`, ok: false },                               // 나머지를 몫과 비교하는 아이
          { text: '나머지가 0이 아니므로 잘못 계산하였다.', ok: false }                                                              // 나머지가 있으면 틀린 계산이라는 아이
        ]);
        return C(`${a} ÷ ${josa(b, '을/를')} 계산하여 몫을 ${q - 1}, 나머지를 ${josa(r + b, '이라고/라고')} 하였다. 이 계산에 대한 설명으로 옳은 것은?`, rows.map((row) => row.text), rows.findIndex((row) => row.ok), {
          explain: `나머지는 나누는 수보다 작아야 한다. 나머지 ${r + b}에서 ${josa(b, '을/를')} 한 번 더 덜어 낼 수 있으므로 몫은 ${q}, 나머지는 ${r}이다.`,
          facts: { truth: rows.map((row) => row.ok), want: true, restTalk: { a, b, saidQ: q - 1, saidR: r + b } }
        });
      }),
      H('h-carry', '십의 자리를 계산하고 남은 수', '세로셈 고치기: 내림을 빠뜨림(심화 59), 수 모형으로 내림 과정 채우기(기본 ③14)', (d) => {
        // 56÷4: 십의 자리에서 남은 1은 10이다
        const [a, b] = down2(d), left = Math.floor(a / 10) % b, o = a % 10;
        const rows = d.shuffle([
          { text: `일의 자리 수 ${josa(o, '과/와')} 합쳐 ${josa(left * 10 + o, '으로/로')} 보고 ${josa(b, '으로/로')} 나눈다.`, ok: true },
          { text: `${b}보다 작아 더 나눌 수 없으므로 나머지가 된다.`, ok: false },                                                   // 남은 수는 곧 나머지라는 아이
          { text: `일의 자리 수 ${o}에 더해 ${josa(left + o, '으로/로')} 보고 ${josa(b, '으로/로')} 나눈다.`, ok: false },               // 남은 십을 1로 보는 아이
          { text: '몫의 일의 자리에 쓴다.', ok: false }                                                                             // 남은 수와 몫의 자리를 혼동하는 아이
        ]);
        return C(`${a} ÷ ${josa(b, '을/를')} 세로로 계산한 것이다. 십의 자리를 계산하고 남은 ${left}에 대한 설명으로 옳은 것은?`, rows.map((row) => row.text), rows.findIndex((row) => row.ok), {
          figure: divSteps(b, a, { steps: true }),
          explain: `십의 자리를 계산하고 남은 ${josa(left, '은/는')} 십 모형 ${left}개와 같으므로 ${josa(left * 10, '을/를')} 나타낸다. 일의 자리 수 ${josa(o, '과/와')} 합친 ${josa(left * 10 + o, '을/를')} ${josa(b, '으로/로')} 나눈다.`,
          facts: { truth: rows.map((row) => row.ok), want: true, divide: [a, b], divideFree: true, rule: 'down' }
        });
      }),
      H('h-zero', '몫의 가운데에 0이 있는 나눗셈', '세로셈 고치기: 몫의 자리와 0(심화 60) — 0을 건너뛰는 것을 보기에 넣는다', (d) => {
        // 618÷6 = 103 (13 이 아니다)
        const [h, o, b] = d.until(() => [d.int(1, 3), d.int(1, 9), d.int(2, 4)], ([x, y, z]) => (x * 100 + y) * z <= 999), q = h * 100 + o, a = q * b;
        const list = d.shuffle([q, h * 10 + o, h * 100 + o * 10, h * 1000 + o]);      // 바른 몫, 0을 건너뜀, 0의 자리를 틀림, 0을 하나 더 씀
        return C(`${a} ÷ ${b}의 몫은?`, list.map(String), list.indexOf(q), {
          explain: `백의 자리부터 차례로 나눈다. 십의 자리에서 나눌 수 없으면 몫의 십의 자리에 0을 쓴다. ${a} ÷ ${b} = ${q}`, facts: { pick: { expr: `${a}/${b}`, options: list }, divide: [a, b], divideFree: true, rule: 'zero' }
        });
      }),
      H('h-check', '계산이 맞는지 확인하는 방법', '확인식으로 맞는지 판단(심화 37), 확인에 필요한 식 고르기(기본 ①32)', (d) => {
        const [a, b] = rest2(d, (x, y, q, r) => y * r + q !== x && q * r + y !== x && q !== r && q !== y && y * q - r !== x), q = Math.floor(a / b), r = a % b;
        const list = d.shuffle([
          [`${b} × ${q}에 ${josa(r, '을/를')} 더한 값이 ${a}인지 본다.`, `${b}*${q}+${r}`],
          [`${b} × ${r}에 ${josa(q, '을/를')} 더한 값이 ${a}인지 본다.`, `${b}*${r}+${q}`],      // 몫과 나머지의 자리를 바꾸는 아이
          [`${q} × ${r}에 ${josa(b, '을/를')} 더한 값이 ${a}인지 본다.`, `${q}*${r}+${b}`],      // 세 수를 아무렇게나 엮는 아이
          [`${b} × ${q}에서 ${josa(r, '을/를')} 뺀 값이 ${a}인지 본다.`, `${b}*${q}-${r}`]       // 나머지를 빼는 아이
        ]);
        return C(`${a} ÷ ${josa(b, '을/를')} 계산하여 몫 ${q}, 나머지 ${josa(r, '을/를')} 얻었다. 계산이 맞는지 확인하는 방법으로 옳은 것은?`, list.map(([text]) => text), list.findIndex(([, text]) => text === `${b}*${q}+${r}`), {
          explain: `나누는 수와 몫의 곱에 나머지를 더하면 나누어지는 수가 되어야 한다. ${b} × ${q} = ${b * q}, ${b * q} + ${r} = ${a}`,
          facts: { choose: { exprs: list.map(([, text]) => text), rule: 'equals', target: a } }
        });
      }),
      H('h-more', '남김없이 나누려면 더 필요한 수', '남김없이 나누려면 적어도 몇 개 더(심화 23, 기본 ②54 ③34)', (d) => {
        const [a, b] = rest2(d, (x, y, q, r) => new Set([y - r, r, q + 1, y]).size === 4), q = Math.floor(a / b), r = a % b;
        const list = d.shuffle([b - r, r, q + 1, b]);                                  // 바른 답, 나머지를 답함, 몫보다 1 큰 수를 답함, 나누는 수를 답함
        return C(`구슬 ${a}개를 ${b}명에게 남김없이 똑같이 나누어 주려고 한다. 구슬은 적어도 몇 개 더 필요한가?`, list.map((v) => `${v}개`), list.indexOf(b - r), {
          explain: `${a} ÷ ${b} = ${q} … ${r}이다. ${r}개가 남으므로 ${b - r}개가 더 있으면 한 명에게 ${q + 1}개씩 남김없이 나누어 줄 수 있다.`,
          facts: { pick: { expr: `${b}-${a}%${b}`, options: list }, divide: [a, b], divideFree: true }
        });
      }, { standard: SOLVE }),
      H('h-sets', '나머지는 묶음이 되지 못하는 경우', '나머지를 버리는 문장제(심화 24), 나눈 몫에 곱하기(기본 ②89)', (d) => {
        const [a, b] = rest2(d, (x, y, q, r) => ![q, q + 1, q - 1].includes(r)), q = Math.floor(a / b), r = a % b;
        const list = d.shuffle([q, q + 1, r, q - 1]);                                  // 바른 답, 남은 것도 한 묶음으로 셈, 나머지를 답함
        return C(`장미 ${a}송이를 ${b}송이씩 묶어 꽃다발을 만들려고 한다. 만들 수 있는 꽃다발은 몇 개인가?`, list.map((v) => `${v}개`), list.indexOf(q), {
          explain: `${a} ÷ ${b} = ${q} … ${r}이다. 남은 ${r}송이로는 꽃다발을 만들 수 없으므로 ${q}개이다.`, facts: { pick: { expr: `(${a}-${a}%${b})/${b}`, options: list }, divide: [a, b], divideFree: true }
        });
      }, { standard: SOLVE }),
      H('h-max', '나누어지는 수가 될 수 있는 가장 큰 수', '나누어지는 수의 가장 큰 값(심화 47), 몫이 정해졌을 때 가장 큰 나누어지는 수(기본 ③39)', (d) => {
        // □÷6의 몫이 12일 때 □가 될 수 있는 가장 큰 수 → 6×12+5
        const b = d.int(3, 9), q = d.int(4, 11);
        return N(`어떤 수를 ${josa(b, '으로/로')} 나누었더니 몫이 ${josa(q, '이/가')} 되었다. 어떤 수가 될 수 있는 수 중에서 가장 큰 수는?`, b * q + b - 1, {
          explain: `나머지는 나누는 수 ${b}보다 작으므로 가장 큰 나머지는 ${b - 1}이다. ${b} × ${q} = ${b * q}, ${b * q} + ${b - 1} = ${b * q + b - 1}`, facts: { calc: [[`${b}*${q}+${b}-1`, 0]], unseen: [1] }
        });
      }),
      H('h-wrong', '잘못 나눈 수 바로잡기', '잘못 나눈 수 바로잡기(심화 43, 기본 ②63 ③57)', (d) => {
        // 4로 나눌 것을 7로 나누었더니 몫 12, 나머지 2 → 86÷4
        const [right, wrong, q, r] = d.until(() => [d.int(2, 9), d.int(3, 9), d.int(5, 12), d.int(1, 8)], ([x, y, z, w]) => x !== y && w < y && (y * z + w) % x !== 0 && y * z + w <= 99), x = wrong * q + r;
        return M(`어떤 수를 ${josa(right, '으로/로')} 나누어야 할 것을 잘못하여 ${josa(wrong, '으로/로')} 나누었더니 몫이 ${q}, 나머지가 ${josa(r, '이/가')} 되었다. 바르게 계산한 몫과 나머지는?`, [{ label: '몫', answer: Math.floor(x / right) }, { label: '나머지', answer: x % right }], {
          explain: `어떤 수는 ${wrong} × ${q} = ${wrong * q}, ${wrong * q} + ${r} = ${x}이다. ${x} ÷ ${right} = ${Math.floor(x / right)} … ${x % right}`,
          facts: { wrongDivide: { right, wrong, q, r } }
        });
      }, { standard: SOLVE }),
      H('h-times', '나눌 것을 곱한 계산 바로잡기', '곱셈과 나눗셈을 바꿔 한 계산 바로잡기(심화 44, 기본 ③58)', (d) => {
        // 3으로 나눌 것을 곱했더니 108 → 108÷3=36, 36÷3=12
        const [b, k] = d.until(() => [d.int(2, 6), d.int(4, 19)], ([x, y]) => x * y >= 24 && x * y <= 99 && (x * y) % 10 !== 0 && y !== x), x = b * k;
        return N(`어떤 수를 ${josa(b, '으로/로')} 나누어야 할 것을 잘못하여 ${josa(b, '을/를')} 곱했더니 ${josa(x * b, '이/가')} 되었다. 바르게 계산한 값은?`, k, {
          explain: `어떤 수는 ${x * b} ÷ ${b} = ${x}이다. 바르게 계산하면 ${x} ÷ ${b} = ${k}이다.`, facts: { calc: [[`${x * b}/${b}/${b}`, 0]] }
        });
      }, { standard: SOLVE }),
      H('h-add', '문장제: 더한 뒤 나누기', '합친 뒤 나누기(심화 69, 기본 ①56 ②85 ③73)', (d) => {
        const [m, w, b] = d.until(() => [d.int(24, 68), d.int(17, 59), d.int(3, 8)], ([x, y, z]) => (x + y) % z === 0 && x % z !== 0 && x !== y && (x + y) % 10 !== 0 && x + y <= 99);
        return N(`동화책 ${m}권과 과학책 ${w}권을 책꽂이 ${b}칸에 똑같이 나누어 꽂았다. 책꽂이 한 칸에 꽂은 책은 몇 권인가?`, (m + w) / b, {
          unit: '권', explain: `책은 모두 ${m} + ${w} = ${m + w}(권)이다. ${m + w} ÷ ${b} = ${(m + w) / b}`, facts: { calc: [[`(${m}+${w})/${b}`, 0]] }
        });
      }, { standard: SOLVE }),
      H('h-mul', '문장제: 곱한 뒤 나누기', '곱한 뒤 나누기(심화 71, 기본 ①58 ②86 ③74)', (d) => {
        const [per, boxes, b] = d.until(() => [d.int(12, 36), d.int(3, 8), d.int(3, 9)], ([x, y, z]) => (x * y) % z === 0 && x % z !== 0 && y !== z && x * y / z >= 12 && x % 10 !== 0);
        return N(`한 상자에 ${per}개씩 들어 있는 초콜릿이 ${boxes}상자 있다. 이 초콜릿을 ${b}명이 똑같이 나누어 가지면 한 명이 가지는 초콜릿은 몇 개인가?`, per * boxes / b, {
          unit: '개', explain: `초콜릿은 모두 ${per} × ${boxes} = ${per * boxes}(개)이다. ${per * boxes} ÷ ${b} = ${per * boxes / b}`, facts: { calc: [[`${per}*${boxes}/${b}`, 0]] }
        });
      }, { standard: SOLVE }),
      H('h-two', '문장제: 두 나눗셈의 몫 비교', '두 나눗셈의 몫을 견주는 문장제(심화 77, 기본 ①59 ②90 ③75)', (d) => {
        const [a, b, c, e] = d.until(() => [d.int(48, 98), d.int(3, 8), d.int(42, 96), d.int(3, 8)], ([x, y, z, w]) => x % y === 0 && z % w === 0 && y !== w && x !== z && x / y - z / w >= 2 && x / y - z / w <= 9 && x % 10 !== 0 && z % 10 !== 0);
        return N(`연필 ${a}자루를 ${b}명에게, 볼펜 ${c}자루를 ${e}명에게 각각 똑같이 나누어 주었다. 한 명이 받은 연필은 한 명이 받은 볼펜보다 몇 자루 더 많은가?`, a / b - c / e, {
          unit: '자루', explain: `연필은 ${a} ÷ ${b} = ${a / b}(자루)씩, 볼펜은 ${c} ÷ ${e} = ${c / e}(자루)씩 받았다. ${a / b} - ${c / e} = ${a / b - c / e}`, facts: { calc: [[`${a}/${b}-${c}/${e}`, 0]] }
        });
      }, { standard: SOLVE }),
      H('h-per', '문장제: 한 묶음의 수를 구해 곱하기', '표에서 한 묶음을 구해 다른 묶음 수 구하기(심화 75)', (d) => {
        const [per, n, m] = d.until(() => [d.int(12, 32), d.int(3, 7), d.int(4, 9)], ([x, y, z]) => x % 10 !== 0 && z > y);
        return N(`똑같은 상자 ${n}개에 들어 있는 귤은 모두 ${per * n}개이다. 이 상자 ${m}개에 들어 있는 귤은 모두 몇 개인가?`, per * m, {
          unit: '개', explain: `한 상자에 들어 있는 귤은 ${per * n} ÷ ${n} = ${per}(개)이다. ${per} × ${m} = ${per * m}`, facts: { calc: [[`${per * n}/${n}*${m}`, 0]] }
        });
      }, { standard: SOLVE })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
