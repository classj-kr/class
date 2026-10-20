// 3학년 1학기 3단원 나눗셈 — 실력 문항.
// 수집해 둔 평가 자료 가운데 심화·실력 단원평가, 차시별 심화 문제, 수학익힘 심화, 서술형 평가(38개 문서)에 나온
// 문제 꼴 55개를 하나씩 따져 고른 것이다. 꼴과 조건은 그 문제를 따르고 수와 문장만 바꾼다.
//
// 고른 기준
//  - 한 번 나누면 끝나는 문제는 기본 문항으로 보냈다(3-1-3a.js).
//  - 숫자만 다르거나 말만 다른 꼴은 한 번만 싣는다(□ 값 견주기·모양이 든 이어진 두 식은 「여러 식의 값 더하기」와 같은 꼴,
//    문장으로 쓴 두 번 나누기는 기본의 「이어서 나누기」와 같은 꼴, 더한 뒤 나누기는 뺀 뒤 나누기와 같은 꼴로 본다).
//  - 서술형(식 쓰기, 방법 설명하기, 문제 만들기)은 싣지 않는다.
//  - 수집본에 3학년 심화로 실려 있다는 것은 3학년 내용이라는 근거가 아니다. 문제마다 「이것은 몇 학년 무슨 단원의 내용인가」를 따져 뺐다.
//  - 아래는 뺐다.
//      4학년 2학기 「관계와 규칙」의 등식: 몫이 같은 두 나눗셈(27÷3=81÷□)
//      뜻 없는 덧셈: 여러 식의 □에 들어갈 수를 구해 서로 더하기
//      뒤 학기 것이 있어야 풀리는 것: 남김없이 나눌 수 있는 경우 가리기·「나누어떨어지는」 수 찾기(나머지는 3학년 2학기),
//        곱셈구구를 넘는 나눗셈이 보기에 섞인 것
//      계산보다 조건 풀이가 어려움의 대부분인 것: 합과 몫으로 두 수 찾기, 숫자 카드로 식을 만들어 몫이 가장 크게(작게),
//        간격 문제(가로등), 일의 빠르기(기계 몇 대가 몇 시간), 쓰이지 않는 조건이 섞인 문장제, 변의 수로 도형 알아내기
// 실력 문항의 잣대(2026-10-12): 어려움은 이 단원에서 배운 뜻을 정확히 아는가에서 나와야 한다. 맨 앞의 문항들이 그런 문항이다.
// 묻는 말: 수나 값을 물을 때는 "~은?/~는?", 양을 물을 때는 "몇 ~인가?" 로 맺는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, LABELS, box, expr, chain, lines, N, M, C, E } = B.kit;
  const MEAN = '4수01-05', CALC = '4수01-06';
  const H = (id, title, source, make, more) => Object.assign({ id, level: '실력', title, source, make }, more || {});
  const fact = (d, ok) => d.until(() => { const b = d.int(2, 9), q = d.int(2, 9); return [b * q, b, q]; }, ok || (() => true));

  B.addGroup('3-1-3', {
    id: 'hard', title: '단원 종합', standard: CALC,
    types: [
      H('h-means', '나눗셈식으로 나타낼 수 없는 상황', '상황에 맞는 식·나눗셈식에 대한 설명(기본 자료) — 똑같이 나누기, 묶어 덜어 내기, 거듭 빼기를 한자리에서 가리게', (d) => {
        const [a, b, q] = fact(d, ([, y, z]) => y !== z);
        const rows = d.shuffle([
          { text: `구슬 ${a}개를 ${b}명이 똑같이 나누어 가지면 한 명이 ${q}개씩 가진다.`, ok: true },
          { text: `구슬 ${a}개를 한 명에게 ${b}개씩 주면 ${q}명에게 줄 수 있다.`, ok: true },
          { text: `${a}에서 ${josa(b, '을/를')} ${q}번 빼면 0이 된다.`, ok: true },
          // 세 수가 모두 나오니 맞다고 여기기 쉽다. 이것은 a÷q=b 이다.
          { text: `구슬 ${a}개를 ${q}명이 똑같이 나누어 가지면 한 명이 ${b}개씩 가진다.`, ok: false }
        ]);
        return C(`나눗셈식 ${a} ÷ ${b} = ${josa(q, '으로/로')} 나타낼 수 없는 것은?`, rows.map((row) => row.text), rows.findIndex((row) => !row.ok), {
          explain: `${q}명이 똑같이 나누어 가지는 것은 ${expr(a, '/', q, '=', b)}이다. ${expr(a, '/', b, '=', q)}는 ${b}명이 똑같이 나누어 가지거나 ${b}개씩 덜어 내는 상황이다.`.replace('</span>는 ', '</span>의 식은 '),
          facts: { truth: rows.map((row) => row.ok), want: false, divMeans: [a, b, q] }
        });
      }, { standard: MEAN }),
      H('h-quotient', '몫이 나타내는 것', '같은 수를 두 가지 뜻으로 나누기(기본 자료) — 식이 같아도 몫의 뜻이 다름을 가리게', (d) => {
        const [a, b, q] = fact(d, ([, y, z]) => y !== z), sharing = d.bool();
        const list = ['한 명이 받는 연필의 수', '연필을 받는 사람의 수', '전체 연필의 수', '남는 연필의 수'];
        return C(sharing ? `연필 ${a}자루를 ${b}명에게 똑같이 나누어 주려고 한다. 나눗셈식 ${a} ÷ ${b} = ${q}에서 몫 ${josa(q, '이/가')} 나타내는 것은?` : `연필 ${a}자루를 한 명에게 ${b}자루씩 나누어 주려고 한다. 나눗셈식 ${a} ÷ ${b} = ${q}에서 몫 ${josa(q, '이/가')} 나타내는 것은?`, list, sharing ? 0 : 1, {
          explain: sharing ? `${b}명에게 똑같이 나누어 주므로 몫 ${josa(q, '은/는')} 한 명이 받는 연필의 수이다.` : `${b}자루씩 나누어 주므로 몫 ${josa(q, '은/는')} 연필을 받는 사람의 수이다.`,
          facts: { truth: list.map((_, i) => i === (sharing ? 0 : 1)), want: true, divMeans: [a, b, q] }
        });
      }, { standard: MEAN }),
      H('h-minus', '같은 수를 거듭 뺀 식', 'YBM 단원심화평가', (d) => {
        // 36-△-△-△-△=0 → △=9
        const [a, k, n] = fact(d, ([, y, z]) => z >= 3 && z <= 5 && y !== z);
        return N('△가 모두 같은 수일 때, △에 알맞은 수는?', k, {
          figure: '<span class="mb-expr">' + [a].concat(Array.from({ length: n }, () => '△')).join(' <i>−</i> ') + ' <i>=</i> 0</span>',
          explain: `${a}에서 △를 ${n}번 빼면 0이 되므로 ${expr(a, '/', '△', '=', n)}이다. ${expr(n, '*', k, '=', a)}이므로 △는 ${k}이다.`,
          facts: { minus: { a, k, n, hidden: true } }
        });
      }, { standard: MEAN }),
      H('h-fits', '□에 들어갈 수 있는 수', 'YBM 단원심화평가 · 동아·지학사·천재 단원평가 심화', (d) => {
        // 1부터 9까지의 수 중 □<35÷7
        const [a, b, q] = fact(d, ([, y, z]) => z >= 4 && z <= 8 && y !== z);
        return N('1부터 9까지의 수 중 □ 안에 들어갈 수 있는 수는 모두 몇 개인가?', q - 1, {
          unit: '개', figure: expr(box(), '<i>&lt;</i>', a, '/', b), explain: `${expr(a, '/', b, '=', q)}이므로 □는 ${q}보다 작은 수이다. 1부터 ${q - 1}까지 ${q - 1}개이다.`,
          facts: { digit: { template: `□<${a}/${b}`, lo: 1, hi: 9, ask: 'count' } }
        });
      }),
      H('h-back', '거꾸로 생각하여 처음 수 구하기', '아이스크림·지학사 단원평가 심화', (d) => {
        // ㉠ ÷6 → ㉡ ÷3 → 3
        const [mid, c, end] = fact(d, ([x, y, z]) => x <= 9 && z >= 2), b = d.until(() => d.int(2, 9), (v) => v !== c);
        return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: mid * b }, { label: LABELS[1], answer: mid }], {
          figure: chain([box(LABELS[0]), '÷' + b, box(LABELS[1]), '÷' + c, end]), explain: `㉡은 ${expr(end, '*', c, '=', mid)}, ㉠은 ${expr(mid, '*', b, '=', mid * b)}이다.`,
          facts: { calc: [[`${end}*${c}*${b}`, 0], [`${end}*${c}`, 1]] }
        });
      }),
      H('h-wrong', '잘못 나눈 어떤 수', 'YBM·동아·디딤돌·아이스크림·지학사 단원평가 심화 · 지학사 서술형', (d) => {
        // 4로 나눌 것을 8로 나눴더니 4 → 32÷4=8
        const [x, right, wrong] = d.until(() => { const n = d.pick([12, 16, 18, 24, 36]), a = d.int(2, 9), b = d.int(2, 9); return [n, a, b]; }, ([n, a, b]) => a !== b && n % a === 0 && n % b === 0 && n / a <= 9 && n / b <= 9 && n / a >= 2 && n / b >= 2 && n / b !== a);
        return N(`어떤 수를 ${josa(right, '으로/로')} 나누어야 할 것을 잘못하여 ${josa(wrong, '으로/로')} 나누었더니 몫이 ${josa(x / wrong, '이/가')} 되었다. 바르게 계산한 몫은?`, x / right, {
          explain: `어떤 수는 ${expr(wrong, '*', x / wrong, '=', x)}이다. 바르게 계산하면 ${expr(x, '/', right, '=', x / right)}이다.`,
          facts: { calc: [[`${wrong}*${x / wrong}/${right}`, 0]] }
        });
      }),
      H('h-regroup', '곱셈으로 전체를 구한 뒤 나누기', 'YBM·동아·디딤돌·아이스크림·지학사·천재 단원평가 심화 · 동아 서술형', (d) => {
        // 3송이씩 6묶음을 2송이씩 → 9
        const [p, n, k] = d.until(() => [d.int(2, 9), d.int(2, 9), d.int(2, 9)], ([x, y, z]) => (x * y) % z === 0 && (x * y) / z <= 9 && (x * y) / z >= 2 && z !== x && z !== y && x !== y);
        return N(`귤이 한 봉지에 ${p}개씩 ${n}봉지 있다. 이 귤을 한 접시에 ${k}개씩 모두 담으려면 접시는 몇 개 필요한가?`, (p * n) / k, {
          unit: '개', explain: `귤은 모두 ${expr(p, '*', n, '=', p * n)}(개)이다. ${expr(p * n, '/', k, '=', (p * n) / k)}`, facts: { calc: [[`${p}*${n}/${k}`, 0]] }
        });
      }),
      H('h-rest', '덜어 낸 나머지를 나누기', 'YBM·아이스크림·천재 단원평가 심화', (d) => {
        // 책 48권 중 6권을 읽고 한 달에 7권씩 → 6달
        const [a, k, n] = fact(d, ([x, y, z]) => x >= 24 && y !== z), used = d.int(3, 18);
        return N(`색종이 ${a + used}장 중에서 ${used}장을 사용하였다. 남은 색종이를 한 명에게 ${k}장씩 나누어 주면 몇 명에게 줄 수 있는가?`, n, {
          unit: '명', explain: `남은 색종이는 ${expr(a + used, '-', used, '=', a)}(장)이다. ${expr(a, '/', k, '=', n)}`, facts: { calc: [[`(${a + used}-${used})/${k}`, 0]] }
        });
      }),
      H('h-two', '따로 나눈 뒤 더하기', 'YBM 서술형평가 · 디딤돌 문장제 서술형', (d) => {
        // 남 56명, 여 72명이 따로 8명씩 → 7+9=16줄
        const k = d.int(4, 9), [x, y] = d.until(() => [d.int(3, 9), d.int(3, 9)], ([p, q]) => p !== q);
        return N(`빨간 구슬 ${k * x}개와 파란 구슬 ${k * y}개를 색깔별로 한 봉지에 ${k}개씩 담았다. 구슬을 담은 봉지는 모두 몇 개인가?`, x + y, {
          unit: '개', explain: `빨간 구슬은 ${expr(k * x, '/', k, '=', x)}(봉지), 파란 구슬은 ${expr(k * y, '/', k, '=', y)}(봉지)이다. ${expr(x, '+', y, '=', x + y)}`,
          facts: { calc: [[`${k * x}/${k}+${k * y}/${k}`, 0]] }
        });
      }),
      H('h-who', '몫을 견주어 먼저 끝내는 사람 찾기', 'YBM 수학익힘 심화 · 디딤돌 서술형 · 비상 차시별 심화', (d) => {
        // 72쪽을 9쪽씩(8일), 63쪽을 7쪽씩(9일)
        const [one, two] = d.shuffle(NAMES).slice(0, 2);
        const [f1, f2] = d.until(() => [fact(d, ([x]) => x >= 30), fact(d, ([x]) => x >= 30)], ([p, q]) => p[2] !== q[2] && p[0] !== q[0] && p[1] !== q[1] && (p[0] > q[0]) === (p[2] > q[2]) === false);
        return C(`${name(one, '은/는')} ${f1[0]}쪽인 책을 하루에 ${f1[1]}쪽씩 읽고, ${name(two, '은/는')} ${f2[0]}쪽인 책을 하루에 ${f2[1]}쪽씩 읽는다. 두 사람이 같은 날 읽기 시작하였을 때, 책을 먼저 모두 읽는 사람은?`, [one, two], f1[2] < f2[2] ? 0 : 1, {
          explain: `${name(one, '은/는')} ${expr(f1[0], '/', f1[1], '=', f1[2])}(일), ${name(two, '은/는')} ${expr(f2[0], '/', f2[1], '=', f2[2])}(일)이 걸린다.`,
          facts: { choose: { exprs: [E(f1[0], '/', f1[1]), E(f2[0], '/', f2[1])], rule: 'min' } }
        });
      }),
      H('h-three', '곱하고 더한 뒤 나누기', '천재 서술형 평가 · 지학사 단원평가 실력', (d) => {
        // 6명씩 4줄에 4명이 더 와 7명씩 → 4줄
        const [p, n, r, k] = d.until(() => [d.int(3, 8), d.int(3, 6), d.int(2, 9), d.int(3, 9)], ([x, y, more, z]) => (x * y + more) % z === 0 && (x * y + more) / z <= 9 && (x * y + more) / z >= 2 && z !== x && (x * y) % z !== 0);
        return N(`학생들이 한 줄에 ${p}명씩 ${n}줄로 서 있다. 학생 ${r}명이 더 와서 한 줄에 ${k}명씩 다시 서면 모두 몇 줄이 되는가?`, (p * n + r) / k, {
          unit: '줄', explain: `처음에 서 있던 학생은 ${expr(p, '*', n, '=', p * n)}(명)이고, ${r}명이 더 와서 ${expr(p * n, '+', r, '=', p * n + r)}(명)이 되었다. ${expr(p * n + r, '/', k, '=', (p * n + r) / k)}`,
          facts: { calc: [[`(${p}*${n}+${r})/${k}`, 0]] }
        });
      }),
      H('h-limit', '두 재료로 만들 수 있는 수', '두 재료로 만들 수 있는 개수(기본 ③54) — 많은 쪽의 몫·두 몫의 합을 보기에 넣는다', (d) => {
        // 장미 4송이와 튤립 3송이로 한 다발: 장미 32송이, 튤립 21송이 → 7다발
        const [[a, b, p], [c, e, q]] = d.until(() => [fact(d), fact(d)], ([x, y]) => x[1] !== y[1] && x[2] !== y[2] && x[0] !== y[0] && new Set([Math.min(x[2], y[2]), Math.max(x[2], y[2]), x[2] + y[2], Math.abs(x[2] - y[2])]).size === 4);
        const list = d.shuffle([Math.min(p, q), Math.max(p, q), p + q, Math.abs(p - q)]);
        return C(`꽃다발 한 개를 만드는 데 장미 ${b}송이와 튤립 ${e}송이가 필요하다. 장미 ${a}송이와 튤립 ${c}송이로 만들 수 있는 꽃다발은 몇 개인가?`, list.map((v) => `${v}개`), list.indexOf(Math.min(p, q)), {
          explain: `장미로는 ${expr(a, '/', b, '=', p)}(개), 튤립으로는 ${expr(c, '/', e, '=', q)}(개)까지 만들 수 있다. 두 꽃이 모두 있어야 하므로 ${Math.min(p, q)}개까지 만들 수 있다.`,
          facts: { limit: { pairs: [[a, b], [c, e]], options: list } }
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
