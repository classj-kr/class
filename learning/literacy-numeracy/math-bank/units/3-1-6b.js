// 3학년 1학기 6단원 분수와 소수 — 실력 문항.
// 수집해 둔 평가 자료 가운데 심화·실력 단원평가, 차시별 심화 문제, 수학익힘 심화, 서술형 평가(45개 문서)에 나온
// 문제 꼴 75개를 하나씩 따져 고른 것이다. 꼴과 조건은 그 문제를 따르고 수와 문장만 바꾼다.
//
// 고른 기준
//  - 분수·소수로 한 번 나타내거나 한 번 견주면 끝나는 문제는 기본 문항으로 보냈다(3-1-6a.js).
//  - 숫자만 다르거나 말만 다른 꼴은 한 번만 싣는다. 방향만 뒤집은 꼴도 한 번만 싣는다
//    (남은 양으로 가장 많이 마신 사람 찾기는 「거의 다 먹은 사람」 꼴로만, 두 분수 사이의 분수는 단위분수 꼴로만,
//     10조각 중 남은 양은 여러 사람이 쓰고 남은 양으로만).
//  - 서술형(똑같이 나누지 않은 까닭, 견주는 방법 쓰기)과 그리는 활동은 싣지 않는다.
//  - 아래는 뺐다.
//      뒤 학기·뒤 학년 것이 있어야 풀리는 것: 길이의 분수만큼(40cm의 5/8), 남은 길이로 전체 길이 구하기, 분수의 2배,
//        소수로 적힌 변의 길이 더하기, 500m를 0.5km로 바꾸기
//      분수·소수의 뜻보다 조건 풀이가 어려움의 대부분인 것: 하루 중 시간을 분수로(시각 셈이 숨어 있음), 접은 횟수로 조각 수 구하기,
//        조건 셋에 맞는 분수(짝수 조건), 두 조건 묶음의 개수 견주기, 수 카드로 만든 소수를 모두 늘어놓아 세기·몇 번째로 작은 수,
//        분모와 분자의 합으로 찾는 분수, 빈칸에 들어갈 수끼리 더하기(뜻 없는 덧셈)
// 묻는 말: 수나 값을 물을 때는 "~은?/~는?", 양을 물을 때는 "몇 ~인가?" 로 맺는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, box, frac, lines, onePiece, N, C, D } = B.kit;
  const WHOLE = '4수01-09', FCOMPARE = '4수01-11', DECIMAL = '4수01-12', DCOMPARE = '4수01-14';
  const H = (id, title, source, make, more) => Object.assign({ id, level: '실력', title, source, make }, more || {});
  const deci = (x) => `${Math.floor(x / 10)}.${x % 10}`;
  // 토씨: 분수는 분자를 마지막에 읽고, 소수는 끝자리 숫자를 마지막에 읽는다.
  const tail = (n, pair) => josa(n, pair).slice(String(n).length);
  const fj = (k, n, pair) => frac(k, n) + tail(k, pair);

  B.addGroup('3-1-6', {
    id: 'hard', title: '실력 문제', standard: FCOMPARE,
    types: [
      H('h-nolines', '나눈 선이 없는 그림의 분수', '천재 단원평가 심화 · 천재 수학독해', (d) => {
        // 한 칸만 색칠되어 있고 나머지에는 선이 없다 → 전체를 똑같이 6으로 나눈 것 중의 1
        const [rows, cols] = d.until(() => [d.int(2, 3), d.int(2, 4)], ([r, c]) => r * c >= 6);
        return N('색칠한 부분은 전체를 똑같이 몇 조각으로 나눈 것 중의 1조각인가?', rows * cols, {
          unit: '조각', figure: onePiece(rows, cols), explain: `색칠한 부분과 크기가 같은 조각으로 전체를 나누면 가로로 ${cols}칸, 세로로 ${rows}줄이다. 전체는 ${rows * cols}조각이다.`, facts: { onePiece: true }
        });
      }, { standard: WHOLE }),
      H('h-times', '남은 양은 먹은 양의 몇 배', '디딤돌 서술형 · 지학사 단원평가', (d) => {
        // 떡 한 개의 1/10만큼 먹었다 → 남은 떡은 먹은 떡의 9배
        const n = d.int(5, 12);
        return N(`식빵 한 개를 똑같이 나누어 전체의 ${frac(1, n)}만큼 먹었다. 남은 식빵의 양은 먹은 식빵의 양의 몇 배인가?`, n - 1, {
          unit: '배', explain: `전체를 똑같이 ${n}조각으로 나눈 것 중의 1조각을 먹었다. 남은 식빵은 ${n - 1}조각이므로 먹은 양의 ${n - 1}배이다.`, facts: { calc: [[`${n}-1`, 0]] }
        });
      }, { standard: WHOLE }),
      H('h-rest', '남은 양을 견주기', '천재 서술형 평가 · 디딤돌 서술형', (d) => {
        // 4/7컵과 2/7컵을 마셨을 때 더 많이 남긴 사람
        const who = d.shuffle(NAMES).slice(0, 3), n = d.int(7, 12), ks = d.shuffle(Array.from({ length: n - 2 }, (_, i) => i + 1)).slice(0, 3);
        return C(`같은 크기의 병에 가득 든 주스를 ${name(who[0], '은/는')} 한 병의 ${frac(ks[0], n)}만큼, ${name(who[1], '은/는')} ${frac(ks[1], n)}만큼, ${name(who[2], '은/는')} ${frac(ks[2], n)}만큼 마셨다. 주스가 가장 많이 남은 사람은?`, who, ks.indexOf(Math.min(...ks)), {
          explain: `가장 적게 마신 사람의 주스가 가장 많이 남는다. 분모가 같으므로 분자가 가장 작은 ${frac(Math.min(...ks), n)}만큼 마신 사람이다.`, facts: { choose: { exprs: ks.map((k) => `${k}/${n}`), rule: 'min' } }
        });
      }),
      H('h-almost', '거의 다 먹은 양에서 남은 부분 견주기', '비상 단원평가 실력 · YBM 단원심화평가 · 지학사 단원평가 실력', (d) => {
        // 3/4, 5/6, 11/12 만큼 먹었을 때 가장 많이 남긴 사람
        const who = d.shuffle(NAMES).slice(0, 3), ns = d.shuffle([3, 4, 5, 6, 7, 8, 9, 10, 12]).slice(0, 3);
        return C(`같은 크기의 케이크를 ${name(who[0], '은/는')} 한 개의 ${frac(ns[0] - 1, ns[0])}만큼, ${name(who[1], '은/는')} ${frac(ns[1] - 1, ns[1])}만큼, ${name(who[2], '은/는')} ${frac(ns[2] - 1, ns[2])}만큼 먹었다. 케이크를 가장 많이 남긴 사람은?`, who, ns.indexOf(Math.min(...ns)), {
          explain: `남은 케이크는 차례대로 ${ns.map((n) => frac(1, n)).join(', ')}이다. 단위분수는 분모가 작을수록 크므로 ${frac(1, Math.min(...ns))}만큼 남긴 사람이 가장 많이 남겼다.`,
          facts: { choose: { exprs: ns.map((n) => `1-${n - 1}/${n}`), rule: 'max' }, unseen: [1] }
        });
      }),
      H('h-link', '분모가 같은 분수와 단위분수를 이어 견주기', '디딤돌 단원평가 심화', (d) => {
        // 1/8, 3/7, 1/7 가운데 가장 큰 것
        const who = d.shuffle(NAMES).slice(0, 3), n = d.int(5, 9), m = n + d.int(1, 3), k = d.int(2, 3);
        const order = d.shuffle([[1, m], [k, n], [1, n]]);
        return C(`색 테이프 한 개를 ${name(who[0], '은/는')} 전체의 ${frac(order[0][0], order[0][1])}만큼, ${name(who[1], '은/는')} ${frac(order[1][0], order[1][1])}만큼, ${name(who[2], '은/는')} ${frac(order[2][0], order[2][1])}만큼 사용하였다. 색 테이프를 가장 많이 사용한 사람은?`, who, order.findIndex(([top]) => top === k), {
          explain: `분모가 같은 ${fj(k, n, '과/와')} ${frac(1, n)} 중에서는 ${fj(k, n, '이/가')} 더 크고, 단위분수 ${fj(1, n, '과/와')} ${frac(1, m)} 중에서는 ${fj(1, n, '이/가')} 더 크다. 가장 큰 수는 ${frac(k, n)}이다.`,
          facts: { choose: { exprs: order.map(([top, bottom]) => `${top}/${bottom}`), rule: 'max' } }
        });
      }),
      H('h-between', '조건에 맞는 단위분수의 개수', '천재 단원평가 심화 · 비상 차시별 심화 · YBM·아이스크림·지학사 단원평가 심화', (d) => {
        // 1/15보다 크고 1/10보다 작은 단위분수 → 4개
        const b = d.int(3, 9), a = b + d.int(3, 6);
        return N(`분자가 1인 분수 중에서 ${frac(1, a)}보다 크고 ${frac(1, b)}보다 작은 분수는 모두 몇 개인가?`, a - b - 1, {
          unit: '개', explain: `단위분수는 분모가 작을수록 크다. 분모가 ${b}보다 크고 ${a}보다 작은 분수이므로 ${a - b - 1}개이다.`, facts: { unitBetween: [a, b] }
        });
      }),
      H('h-grow', 'mm로 더한 뒤 소수로 나타내기', 'YBM 수학익힘 심화', (d) => {
        // 42mm와 35mm → 7.7cm
        const [a, b] = d.until(() => [d.int(12, 48), d.int(12, 48)], ([x, y]) => x !== y && (x + y) % 10 !== 0 && (x % 10) + (y % 10) >= 10);
        return D(`강낭콩 싹이 어제는 ${a}mm, 오늘은 ${b}mm 자랐다. 이틀 동안 자란 길이를 소수로 나타내면 몇 cm인가?`, (a + b) / 10, {
          unit: 'cm', explain: `이틀 동안 ${a + b}mm 자랐다. 1mm는 0.1cm이므로 ${deci(a + b)}cm이다.`, facts: { calc: [[`(${a}+${b})/10`, 0]], unseen: [10] }
        });
      }, { standard: DECIMAL }),
      H('h-lengths', '단위가 섞인 길이 견주기', 'YBM·디딤돌·미래엔 단원평가 심화 · 천재 서술형 평가', (d) => {
        // 4cm 7mm, 5.2cm, 48mm 가운데 가장 긴 것
        const who = d.shuffle(NAMES).slice(0, 3), base = d.int(3, 12) * 10;
        const xs = d.until(() => [base + d.int(-9, 14), base + d.int(-9, 14), base + d.int(-9, 14)], (v) => new Set(v).size === 3 && v.every((x) => x % 10 !== 0) && new Set(v.map((x) => Math.floor(x / 10))).size >= 2);
        const said = [`${Math.floor(xs[0] / 10)}cm ${xs[0] % 10}mm`, `${deci(xs[1])}cm`, `${xs[2]}mm`];
        return C(`종이띠의 길이가 ${name(who[0], '은/는')} ${said[0]}, ${name(who[1], '은/는')} ${said[1]}, ${name(who[2], '은/는')} ${said[2]}이다. 가장 긴 종이띠를 가진 사람은?`, who, xs.indexOf(Math.max(...xs)), {
          explain: `cm로 나타내면 ${xs.map((x) => deci(x) + 'cm').join(', ')}이다.`, facts: { choose: { exprs: [`${Math.floor(xs[0] / 10)}+${xs[0] % 10}/10`, deci(xs[1]), `${xs[2]}/10`], rule: 'max' }, unseen: [10] }
        });
      }, { standard: DCOMPARE }),
      H('h-common', '두 식에 공통으로 들어갈 수', '동아 단원평가 심화 · YBM·지학사 단원평가 심화 · 비상 차시별 심화', (d) => {
        // 3.4<3.□, 7.7>7.□ → 5, 6
        const [lo, hi] = d.until(() => [d.int(1, 5), d.int(4, 8)], ([x, y]) => y - x >= 3), w1 = d.int(1, 9), w2 = d.until(() => d.int(1, 9), (v) => v !== w1);
        return N('0부터 9까지의 수 중 두 식의 □ 안에 공통으로 들어갈 수 있는 수는 모두 몇 개인가?', hi - lo - 1, {
          unit: '개', figure: lines([`<span class="mb-expr">${w1}.${lo} <i>&lt;</i> ${w1}.${box()}</span>`, `<span class="mb-expr">${w2}.${hi} <i>&gt;</i> ${w2}.${box()}</span>`]),
          explain: `첫째 식에서 □는 ${lo}보다 크고, 둘째 식에서 □는 ${hi}보다 작다. ${lo + 1}부터 ${hi - 1}까지 ${hi - lo - 1}개이다.`, facts: { digitBoth: { templates: [`${w1}.${lo}<${w1}.□`, `${w2}.${hi}>${w2}.□`], lo: 0, hi: 9 } }
        });
      }, { standard: DCOMPARE }),
      H('h-front', '자연수 부분에 □가 있는 식', '아이스크림·디딤돌 단원평가 심화', (d) => {
        // 5.8<□.2 → 6, 7, 8, 9
        const w = d.int(2, 6), [a, b] = d.until(() => [d.int(1, 9), d.int(1, 9)], ([x, y]) => x > y);
        return N('1부터 9까지의 수 중 □ 안에 들어갈 수 있는 수는 모두 몇 개인가?', 9 - w, {
          unit: '개', figure: `<span class="mb-expr">${w}.${a} <i>&lt;</i> ${box()}.${b}</span>`, explain: `□가 ${w}이면 ${w}.${b}${tail(b, '은/는')} ${w}.${a}보다 작으므로 □는 ${w}보다 큰 수이다. ${w + 1}부터 9까지 ${9 - w}개이다.`,
          facts: { digit: { template: `${w}.${a}<□.${b}`, lo: 1, hi: 9, ask: 'count' } }
        });
      }, { standard: DCOMPARE }),
      H('h-share', '여러 사람이 쓰고 남은 양을 소수로', 'YBM·지학사 단원평가 심화', (d) => {
        // 1m를 10조각으로 나누어 3조각, 5조각을 쓰고 남은 길이
        const [one, two] = d.shuffle(NAMES).slice(0, 2), [a, b] = d.until(() => [d.int(2, 5), d.int(2, 5)], ([x, y]) => x !== y && x + y <= 8);
        return D(`색 테이프 1m를 똑같이 10조각으로 나누어 ${name(one, '은/는')} ${a}조각, ${name(two, '은/는')} ${b}조각을 사용하였다. 남은 색 테이프의 길이를 소수로 나타내면 몇 m인가?`, (10 - a - b) / 10, {
          unit: 'm', explain: `사용한 색 테이프는 ${a + b}조각이고 남은 색 테이프는 ${10 - a - b}조각이다. 한 조각은 0.1m이므로 0.${10 - a - b}m이다.`, facts: { calc: [[`(10-${a}-${b})/10`, 0]] }
        });
      }, { standard: DECIMAL }),
      H('h-garden', '분수와 소수로 나타낸 세 부분 견주기', '디딤돌 단원평가 심화', (d) => {
        // 5/10에 장미, 0.3에 수국, 나머지에 국화
        const [a, b] = d.until(() => [d.int(1, 6), d.int(1, 6)], ([x, y]) => new Set([x, y, 10 - x - y]).size === 3 && x + y <= 8), plants = d.shuffle(['상추', '고추', '토마토', '가지', '오이']).slice(0, 3), parts = [a, b, 10 - a - b];
        return C(`텃밭 전체의 ${frac(a, 10)}에는 ${josa(plants[0], '을/를')}, 전체의 0.${b}에는 ${josa(plants[1], '을/를')} 심고 나머지에는 모두 ${josa(plants[2], '을/를')} 심었다. 가장 넓은 곳에 심은 것은?`, plants, parts.indexOf(Math.max(...parts)), {
          explain: `소수로 나타내면 ${plants.map((plant, i) => `${plant} 0.${parts[i]}`).join(', ')}이다.`, facts: { choose: { exprs: [`${a}/10`, `0.${b}`, `(10-${a}-${b})/10`], rule: 'max' } }
        });
      }, { standard: DCOMPARE })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
