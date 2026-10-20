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
//      뒤 학기·뒤 학년 것이 있어야 풀리는 것: 길이의 분수만큼(40 cm의 5/8), 남은 길이로 전체 길이 구하기, 분수의 2배,
//        소수로 적힌 변의 길이 더하기, 500 m를 0.5 km로 바꾸기
//      분수·소수의 뜻보다 조건 풀이가 어려움의 대부분인 것: 하루 중 시간을 분수로(시각 셈이 숨어 있음), 접은 횟수로 조각 수 구하기,
//        조건 셋에 맞는 분수(짝수 조건), 두 조건 묶음의 개수 견주기, 수 카드로 만든 소수를 모두 늘어놓아 세기·몇 번째로 작은 수,
//        분모와 분자의 합으로 찾는 분수, 빈칸에 들어갈 수끼리 더하기(뜻 없는 덧셈)
// 실력 문항의 잣대(2026-10-12): 어려움은 이 단원에서 배운 뜻을 정확히 아는가에서 나와야 한다. 맨 앞의 문항들이 그런 문항이다.
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
    id: 'hard', title: '단원 종합', standard: FCOMPARE,
    types: [
      H('h-onepiece', '나눈 조각 수가 다른 한 조각의 크기', '단위분수 문장제(기본·심화 자료) — 분모를 자연수처럼 견주는 것, 조각 수만 보는 것을 보기에 넣는다', (d) => {
        const [one, two] = d.shuffle(NAMES).slice(0, 2), [many, few] = d.until(() => [d.int(5, 12), d.int(3, 8)], ([x, y]) => x > y + 1), flip = d.bool();
        const cuts = flip ? [few, many] : [many, few], more = flip ? 0 : 1;       // 조각 수가 적은 쪽이 한 조각이 크다
        const rows = d.shuffle([
          { text: `${josa(Math.max(...cuts), '이/가')} ${Math.min(...cuts)}보다 크므로 ${name([one, two][1 - more], '이/가')} 더 많이 먹었다.`, ok: false },      // 분모를 자연수처럼 견줌
          { text: '둘 다 한 조각씩 먹었으므로 먹은 양이 같다.', ok: false },                                                                             // 조각 수만 봄
          { text: `${name([one, two][more], '이/가')} 더 많이 먹었다.`, ok: true },
          { text: '나눈 조각 수가 달라서 먹은 양을 비교할 수 없다.', ok: false }                                                                          // 전체가 같다는 조건을 못 씀
        ]);
        return C(`같은 크기의 떡을 ${name(one, '은/는')} 똑같이 ${cuts[0]}조각으로, ${name(two, '은/는')} 똑같이 ${cuts[1]}조각으로 나누어 한 조각씩 먹었다. 옳은 것은?`, rows.map((row) => row.text), rows.findIndex((row) => row.ok), {
          explain: `${name(one, '은/는')} 전체의 ${frac(1, cuts[0])}, ${name(two, '은/는')} 전체의 ${frac(1, cuts[1])}만큼 먹었다. 단위분수는 분모가 작을수록 크므로 ${cuts[more]}조각으로 나눈 한 조각이 더 크다.`,
          facts: { truth: rows.map((row) => row.ok), want: true, biggerPiece: { cuts, more } }
        });
      }),
      H('h-frac-say', '분수에 대한 설명 가리기', '분수 설명의 참·거짓·비교식의 옳고 그름(심화 자료) — 분모가 같은 분수와 단위분수의 견주는 법을 함께 가리게', (d) => {
        const n = d.int(4, 9), k = d.int(2, n - 1), [a, b] = d.until(() => [d.int(2, 9), d.int(2, 9)], ([x, y]) => x < y), m = d.int(6, 11), [p, q] = d.until(() => [d.int(1, m - 1), d.int(1, m - 1)], ([x, y]) => x > y);
        const slip = d.bool();     // 단위분수 비교를 틀리게 할지, 분모가 같은 분수 비교를 틀리게 할지
        const unit = slip ? [b, a] : [a, b], same = slip ? [p, q] : [q, p];
        const rows = d.shuffle([
          { text: `${fj(1, n, '은/는')} 전체를 똑같이 ${josa(n, '으로/로')} 나눈 것 중의 1이다.`, ok: true },
          { text: `${fj(k, n, '은/는')} ${frac(1, n)}이 ${k}개인 수이다.`, ok: true },
          { text: `${fj(1, unit[0], '은/는')} ${frac(1, unit[1])}보다 크다.`, ok: !slip, big: `1/${unit[0]}`, small: `1/${unit[1]}` },
          { text: `${fj(same[0], m, '은/는')} ${frac(same[1], m)}보다 크다.`, ok: slip, big: `${same[0]}/${m}`, small: `${same[1]}/${m}` }
        ]);
        return C('분수에 대한 설명으로 옳지 않은 것은?', rows.map((row) => row.text), rows.findIndex((row) => !row.ok), {
          explain: '단위분수는 분모가 작을수록 크고, 분모가 같은 분수는 분자가 클수록 크다.',
          facts: { truth: rows.map((row) => row.ok), want: false, biggerClaims: rows.map((row, i) => (row.big ? [row.big, row.small, i] : null)).filter(Boolean) }
        });
      }),
      H('h-deci-say', '소수에 대한 설명 가리기', '소수 설명의 옳고 그름·소수를 두고 바르게 말한 친구(기본 자료)', (d) => {
        const k = d.int(2, 9), [w, j] = d.until(() => [d.int(1, 8), d.int(1, 9)], ([x, y]) => x !== y), p = d.until(() => d.int(2, 9), (v) => v !== k), slip = d.bool();
        const rows = d.shuffle([
          { text: '0.1이 10개이면 1이다.', ok: true },
          { text: `0.${k}${tail(k, '은/는')} ${frac(1, 10)}이 ${k}개인 수이다.`, ok: true },
          { text: `${w}.${j}${tail(j, '은/는')} 0.1이 ${slip ? j * 10 + w : w * 10 + j}개인 수이다.`, ok: !slip },
          { text: slip ? `${fj(p, 10, '과/와')} 0.${p}${tail(p, '은/는')} 크기가 같다.` : `0.${p}${tail(p, '은/는')} ${frac(p, 10)}보다 크다.`, ok: slip }
        ]);
        return C('소수에 대한 설명으로 옳지 않은 것은?', rows.map((row) => row.text), rows.findIndex((row) => !row.ok), {
          explain: slip ? `${w}.${j}${tail(j, '은/는')} 0.1이 ${w * 10 + j}개인 수이다.` : `${fj(p, 10, '과/와')} 0.${p}${tail(p, '은/는')} 크기가 같다.`,
          facts: { truth: rows.map((row) => row.ok), want: false, tenthFacts: { w, j, said: slip ? j * 10 + w : w * 10 + j, slip } }
        });
      }, { standard: DECIMAL }),
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
        // 42 mm와 35 mm → 7.7 cm
        const [a, b] = d.until(() => [d.int(12, 48), d.int(12, 48)], ([x, y]) => x !== y && (x + y) % 10 !== 0 && (x % 10) + (y % 10) >= 10);
        return D(`강낭콩 싹이 어제는 ${a} mm, 오늘은 ${b} mm 자랐다. 이틀 동안 자란 길이를 소수로 나타내면 몇 cm인가?`, (a + b) / 10, {
          unit: 'cm', explain: `이틀 동안 ${a + b} mm 자랐다. 1 mm는 0.1 cm이므로 ${deci(a + b)} cm이다.`, facts: { calc: [[`(${a}+${b})/10`, 0]], unseen: [10] }
        });
      }, { standard: DECIMAL }),
      H('h-lengths', '단위가 섞인 길이 견주기', 'YBM·디딤돌·미래엔 단원평가 심화 · 천재 서술형 평가', (d) => {
        // 4 cm 7 mm, 5.2 cm, 48 mm 가운데 가장 긴 것
        const who = d.shuffle(NAMES).slice(0, 3), base = d.int(3, 12) * 10;
        const xs = d.until(() => [base + d.int(-9, 14), base + d.int(-9, 14), base + d.int(-9, 14)], (v) => new Set(v).size === 3 && v.every((x) => x % 10 !== 0) && new Set(v.map((x) => Math.floor(x / 10))).size >= 2);
        const said = [`${Math.floor(xs[0] / 10)} cm ${xs[0] % 10} mm`, `${deci(xs[1])} cm`, `${xs[2]} mm`];
        return C(`종이띠의 길이가 ${name(who[0], '은/는')} ${said[0]}, ${name(who[1], '은/는')} ${said[1]}, ${name(who[2], '은/는')} ${said[2]}이다. 가장 긴 종이띠를 가진 사람은?`, who, xs.indexOf(Math.max(...xs)), {
          explain: `cm로 나타내면 ${xs.map((x) => deci(x) + ' cm').join(', ')}이다.`, facts: { choose: { exprs: [`${Math.floor(xs[0] / 10)}+${xs[0] % 10}/10`, deci(xs[1]), `${xs[2]}/10`], rule: 'max' }, unseen: [10] }
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
        // 1 m를 10조각으로 나누어 3조각, 5조각을 쓰고 남은 길이
        const [one, two] = d.shuffle(NAMES).slice(0, 2), [a, b] = d.until(() => [d.int(2, 5), d.int(2, 5)], ([x, y]) => x !== y && x + y <= 8);
        return D(`색 테이프 1 m를 똑같이 10조각으로 나누어 ${name(one, '은/는')} ${a}조각, ${name(two, '은/는')} ${b}조각을 사용하였다. 남은 색 테이프의 길이를 소수로 나타내면 몇 m인가?`, (10 - a - b) / 10, {
          unit: 'm', explain: `사용한 색 테이프는 ${a + b}조각이고 남은 색 테이프는 ${10 - a - b}조각이다. 한 조각은 0.1 m이므로 0.${10 - a - b} m이다.`, facts: { calc: [[`(10-${a}-${b})/10`, 0]] }
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
