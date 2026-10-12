// 3학년 2학기 4단원 분수 — 실력 문항.
// 수집해 둔 평가 자료 가운데 심화·실력 단원평가, 차시별 심화 문제, 수학익힘 심화, 서술형 평가(39개 문서)의 문제 꼴 76개와
// 기본 자료의 꼴을 참고하되, 그대로 옮기지 않고 꼴마다 따져서 냈다.
//
// 실력 문항의 잣대: 어려움은 이 단원에서 배운 것을 정확히 아는가에서 나와야 한다. 이 단원에서 아이들이 흔히 잘못 아는 것을 먼저 적고,
// 그 오개념을 가진 아이가 고를 보기를 넣어 문제를 냈다.
//   ① 가분수: 분자와 분모가 같은 분수는 가분수가 아니라고 여긴다. 가분수는 모두 1보다 크다고 여긴다.
//   ② 부분을 분수로: 묶음의 수와 낱개의 수를 섞어 쓴다(15를 3씩 묶을 때 9를 9/5 또는 3/15라고 한다).
//   ③ 대분수 → 가분수: 자연수와 분자를 이어 쓰거나(2 3/5 → 23/5) 자연수만 바꾼다(10/5).
// 그다음에 분수만큼을 두 번 구하거나 거꾸로 생각해야 하는 문제를 실었다(남은 것의 분수만큼, 단위분수만큼으로 전체 구하기, □가 있는 크기 비교).
//
// 뺀 것과 까닭
//  - 상위 학년의 특정 단원에 해당하는 것은 모두 뺐다.
//      5학년 1학기 「약분과 통분」: 한 부분을 여러 분수로 나타내기(크기가 같은 분수), 분모가 다른 분수를 비교해야 하는 수 카드 꼴
//      4학년 2학기 「분수의 덧셈과 뺄셈」·5학년 「분수의 곱셈」: 단위분수씩 여러 번 더하는 문장제(1/7 m씩 16개), 분수만큼의 분수만큼을 분수로 구하기
//      6학년 「분수의 나눗셈」에 가까운 것: 진분수만큼으로 전체 구하기(단위분수만큼으로 전체를 구하는 것만 실었다)
//  - 조건 풀이·경우 따지기가 어려움의 대부분: 범위와 가분수 조건을 겹쳐 세기, 분모·분자의 합과 차로 분수 찾기, 수 카드로 분수 모두 만들기,
//    말풍선 조건에 맞는 분수의 개수, 자연수와 분모를 바꾼 대분수 되돌리기
//  - 작도·서술형: 분수만큼 색칠하기, 까닭·방법 쓰기
// 묻는 말: 수나 값을 물을 때는 "~은?/~는?", 양을 물을 때는 "몇 ~인가?" 로 맺는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, box, frac, mixed, dots, N, C } = B.kit;
  const PART = '4수01-09', KIND = '4수01-10', COMP = '4수01-11';
  const H = (id, title, source, make, more) => Object.assign({ id, level: '실력', title, source, make }, more || {});
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const tail = (n, pair) => josa(n, pair).slice(String(n).length);
  const fj = (k, n, pair) => frac(k, n) + tail(k, pair);
  const mj = (w, k, n, pair) => mixed(w, k, n) + tail(k, pair);

  B.addGroup('3-2-4', {
    id: 'hard', title: '실력 문제', standard: KIND,
    types: [
      H('h-improper-say', '가분수의 뜻', '옳은(틀린) 설명 고르기(심화 36), 설명이 옳은지 가려내기(기본 ③56)', (d) => {
        const den = d.int(4, 9);
        const rows = d.shuffle([
          { text: `${fj(den, den, '은/는')} 가분수이다.`, ok: true },                       // 분자와 분모가 같으면 가분수가 아니라는 아이가 고른다
          { text: '진분수는 모두 1보다 작다.', ok: true },
          { text: '가분수는 모두 1보다 크다.', ok: false },                                  // 가분수는 1보다 큰 분수라고만 아는 아이는 옳다고 본다
          { text: `자연수 1은 ${fj(den, den, '으로/로')} 나타낼 수 있다.`, ok: true }
        ]);
        return C('분수에 대한 설명으로 옳지 않은 것은?', rows.map((row) => row.text), rows.findIndex((row) => !row.ok), {
          explain: `분자가 분모와 같거나 분모보다 큰 분수가 가분수이다. ${fj(den, den, '은/는')} 가분수이고 1과 크기가 같으므로, 가분수가 모두 1보다 큰 것은 아니다.`,
          facts: { truth: rows.map((row) => row.ok), want: false }
        });
      }),
      H('h-kind-fill', '가분수가 되게 하는 가장 작은 분자', '□에 들어갈 수(심화 41), 분자 □에 들어갈 수(기본 ①42 ③49)', (d) => {
        const den = d.int(5, 9), list = d.shuffle([den, den + 1, den - 1, 1]);          // 분자가 분모보다 커야만 가분수라는 아이는 den+1 을 고른다
        return C(`${fj(box(), den, '이/가').replace(/(이|가)$/, '')}가 가분수일 때, □ 안에 들어갈 수 있는 자연수 중에서 가장 작은 수는?`, list.map(String), list.indexOf(den), {
          explain: `분자가 분모와 같거나 분모보다 큰 분수가 가분수이다. 분자가 ${den}일 때도 가분수이므로 가장 작은 수는 ${den}이다.`, facts: { pick: { expr: String(den), options: list } }
        });
      }),
      H('h-of-rest', '남은 것의 분수만큼', '남은 것의 분수만큼(심화 23, 기본 ①20 ③24)', (d) => {
        const [a, b, k, u] = d.until(() => [d.int(3, 6), d.int(3, 6), d.int(1, 4), d.int(2, 4)], ([x, y, z, w]) => z < y && gcd(z, y) === 1 && ((x - 1) * w) % y === 0 && x * w * y <= 99 && x !== y);
        const total = a * u * b, eaten = total / a, rest = total - eaten;
        return N(`사탕 ${total}개 중에서 ${fj(1, a, '을/를')} 먹고, 남은 사탕의 ${fj(k, b, '을/를')} 동생에게 주었다. 동생에게 준 사탕은 몇 개인가?`, rest / b * k, {
          unit: '개', explain: `먹은 사탕은 ${total} ÷ ${a} = ${eaten}(개)이고 남은 사탕은 ${total} - ${eaten} = ${rest}(개)이다. ${rest}의 ${fj(k, b, '은/는')} ${rest} ÷ ${b} × ${k} = ${rest / b * k}(개)이다.`,
          facts: { calc: [[`(${total}-${total}/${a})/${b}*${k}`, 0]] }
        });
      }, { standard: PART }),
      H('h-whole', '단위분수만큼으로 전체 구하기', '거꾸로: 분수만큼 → 전체(심화 29, 기본 ③28)', (d) => {
        const den = d.int(3, 8), v = d.int(4, 12);
        return N(`어떤 수의 ${fj(1, den, '은/는')} ${v}이다. 어떤 수는?`, v * den, {
          explain: `어떤 수를 똑같이 ${den}묶음으로 나눈 것 중의 1묶음이 ${v}이다. 어떤 수는 ${v} × ${den} = ${v * den}이다.`, facts: { calc: [[`${v}*${den}`, 0]] }
        });
      }, { standard: PART }),
      H('h-fill', '□가 있는 대분수와 가분수의 크기 비교', '대분수의 분자 □(심화 72, 기본 ①91 ③108)', (d) => {
        const w = d.int(1, 3), den = d.int(5, 9), t = d.int(3, den - 1), top = w * den + t;
        return N('□ 안에 들어갈 수 있는 자연수 중에서 가장 큰 수는?', t - 1, {
          figure: `<span class="mb-expr">${mixed(w, box(), den)} <i>&lt;</i> ${frac(top, den)}</span>`,
          explain: `${fj(top, den, '을/를')} 대분수로 나타내면 ${mixed(w, t, den)}이다. □ 안에는 ${t}보다 작은 수가 들어갈 수 있으므로 가장 큰 수는 ${t - 1}이다.`,
          facts: { calc: [[`${top}-${w}*${den}-1`, 0]], unseen: [1] }
        });
      }, { standard: COMP })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
