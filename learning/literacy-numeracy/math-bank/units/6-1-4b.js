// 6학년 1학기 4단원 비와 비율 — 기본 문항(비율이 쓰이는 경우, 백분율, 백분율이 쓰이는 경우).
// 꼴 목록(기본꼴 1~3, 심화꼴 73꼴)을 꼴마다 따져서 실었다. 꼴 번호는 ①n = 기본꼴_1의 n번, ②n, ③n, 심n.
// 싣는 기준과 「뺀 것과 까닭」은 6-1-4a.js 머리에 적었다. 실력 문항은 6-1-4c.js 에 있다.
//
// 이 파일의 기본 문항은 모두 한 번에 하는 일이다.
//  - 비율이 쓰이는 경우: 걸린 시간에 대한 간 거리의 비율, 넓이에 대한 인구의 비율, 섞은 것의 비율, 전체 타수에 대한 안타 수의 비율,
//    지도에서의 거리, 키(높이)와 그림자, 기준량을 바꾼 두 비율. 상황마다 무엇이 기준량인지를 가리는 것이 일이다.
//    두 비율을 구해 견주는 것(빠르기·인구·진하기·성공률·하나당 값)은 실력 묶음에 실었다.
//  - 백분율: 뜻, 분수·소수·비 ↔ 백분율, 꼴이 다른 비율의 크기 비교, 색칠한 그림.
//    소수를 백분율로 고치는 문항의 답은 정수 식으로 다시 셈한다(0.29 × 100 은 자바스크립트에서 29 가 아니다).
//  - 백분율이 쓰이는 경우: 득표율·성공률·불량률, 진하기, 할인율(할인 금액을 줌), 이자율(이자를 줌), 기준량에 백분율을 곱해 비교하는 양 구하기.
//    판매 가격에서 할인 금액을 먼저 구하는 할인율, 오른 비율, 물과 소금을 따로 준 진하기, 무효표가 낀 득표율은 실력 묶음에 실었다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, box, frac, lines, table, tagged, numbers, N, M, C, D } = B.kit;
  const { U, tidy, LAB, SIGNS, gcd, range, K, ks, dec, ends, dj, fj, pj, READ, FR, DR, PR, pickOne, orderChoice, versus, tableOf, svg, cells } = B.kit.r614;
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make: (d, n) => tidy(make(d, n)) }, more || {});

  // 소수(천분의 몇 k)를 백분율로 고치는 정수 식: 0.24 → (0*100+24)*1, 0.8 → (0*10+8)*10, 1.25 → (1*100+25)*1. 글에 없는 수는 un 에 모은다.
  function pctExpr(k) {
    const text = ks(k), w = Math.floor(k / 1000), f = text.split('.')[1] || '', ten = Math.pow(10, f.length), up = 100 / ten;
    return { s: `(${w}*${ten}+${Number(f)})*${up}`, un: [ten, up, Number(f)] };
  }
  // 백분율이 소수인 문항(3.5 %)
  const DP = (text, num, den, o) => D(text, K(num * 100, den) / 1000, { unit: ' %', figure: o.figure, explain: o.explain, facts: { calc: [[`${num}*100/${den}`, 0]], unseen: [100] } });
  // 두 줄 수직선: 윗줄은 0부터 total 까지의 양, 아랫줄은 0부터 100까지의 백분율. 똑같이 10칸으로 나누고, 아랫줄의 k번째 눈금과 같은 자리의 윗줄에 □를 둔다.
  function twoLine(total, unit, k) {
    const x = (i) => 26 + i * 23, y1 = 34, y2 = 66, word = 'style="font-size:12px;font-weight:700;fill:#1f2937"';
    let out = `<line class="mb-axis" x1="${x(0)}" y1="${y1}" x2="${x(10)}" y2="${y1}"/><line class="mb-axis" x1="${x(0)}" y1="${y2}" x2="${x(10)}" y2="${y2}"/>`;
    for (let i = 0; i <= 10; i += 1) out += `<line class="mb-axis" x1="${x(i)}" y1="${y1 - 4}" x2="${x(i)}" y2="${y1 + 4}"/><line class="mb-axis" x1="${x(i)}" y1="${y2 - 4}" x2="${x(i)}" y2="${y2 + 4}"/>`;
    out += `<line x1="${x(k)}" y1="${y1 + 5}" x2="${x(k)}" y2="${y2 - 5}" style="stroke:#dc2626;stroke-width:1.2;stroke-dasharray:3 3"/>`
      + `<text ${word} x="${x(0)}" y="${y1 - 11}" text-anchor="middle">0</text><text ${word} x="${x(10)}" y="${y1 - 11}" text-anchor="middle">${total}</text><text ${word} x="${x(10) + 22}" y="${y1 + 4}" text-anchor="middle">(${unit})</text>`
      + `<rect x="${x(k) - 11}" y="${y1 - 25}" width="22" height="18" rx="3" style="fill:#fff;stroke:#1f2937;stroke-width:1.6"/>`
      + `<text ${word} x="${x(0)}" y="${y2 + 19}" text-anchor="middle">0</text><text ${word} x="${x(k)}" y="${y2 + 19}" text-anchor="middle">${k * 10}</text><text ${word} x="${x(10)}" y="${y2 + 19}" text-anchor="middle">100</text><text ${word} x="${x(10) + 22}" y="${y2 + 4}" text-anchor="middle">(%)</text>`;
    return svg(296, 90, `두 줄 수직선: 윗줄은 0부터 ${total}까지, 아랫줄은 0부터 100까지를 똑같이 10칸으로 나누었다. 아랫줄의 ${josa(k * 10, '과/와')} 같은 자리에 있는 윗줄의 수가 □`, out, 'mb-numberline');
  }

  // ── 비율이 쓰이는 경우 ───────────────────────────────────────
  B.addTypes(U, 'use', [
    T('us-speed', '걸린 시간에 대한 간 거리의 비율', '①40 ②38 ③36 심34', (d, n) => {
      // 첫째 문항은 자연수로 떨어지는 비율(km와 시간), 둘째 문항은 소수가 되는 비율(m와 초).
      if (n === 0) {
        const t = d.int(2, 5), v = d.int(12, 22) * 5, dist = v * t;
        return N(`자동차가 ${dist} km를 가는 데 ${t}시간이 걸렸다. 걸린 시간에 대한 간 거리의 비율은?`, v, {
          explain: `기준량은 걸린 시간인 ${t}, 비교하는 양은 간 거리인 ${dist}이다. 비율은 ${dist} ÷ ${t} = ${v}이다. 1시간에 ${v} km를 간 셈이다.`, facts: { calc: [[`${dist}/${t}`, 0]] }
        });
      }
      const [dist, t] = d.pick([[260, 40], [100, 16], [180, 25], [150, 24], [130, 20], [90, 12], [210, 28]]);
      return DR(`${name(d.pick(NAMES), '이/가')} 자전거를 타고 ${dist} m를 가는 데 ${t}초가 걸렸다. 걸린 시간에 대한 간 거리의 비율을 소수로 나타내시오.`, dist, t, {
        explain: `기준량은 걸린 시간인 ${t}, 비교하는 양은 간 거리인 ${dist}이다. 비율은 ${dist} ÷ ${t} = ${dec(dist, t)}이다. 1초에 ${dec(dist, t)} m를 간 셈이다.`
      });
    }, { count: 2 }),
    T('us-base', '상황에서 기준량과 비교하는 양 가리기', '①40 ②14 ③20 심12', (d) => {
      // 문장에 먼저 나온 수가 기준량인 것도 있고 아닌 것도 있다. 「~에 대한」 앞의 양이 기준량이다.
      const kind = d.int(0, 2), t = kind === 0 ? d.int(2, 5) : kind === 1 ? d.pick([20, 25, 30, 40]) : d.pick([200, 250, 300, 400]), k = kind === 0 ? t * d.int(12, 22) * 5 : kind === 1 ? d.int(8, t - 3) : t - d.int(3, 9) * 10;
      const said = [`버스가 ${k} km를 가는 데 ${t}시간이 걸렸다. 걸린 시간에 대한 간 거리의 비율`, `공을 ${t}번 던져 ${k}번 넣었다. 던진 횟수에 대한 넣은 횟수의 비율`, `관객 ${k}명이 좌석이 ${t}석인 극장에 들어왔다. 좌석 수에 대한 관객 수의 비율`][kind];
      const [base, cmp] = [['걸린 시간', '간 거리'], ['던진 횟수', '넣은 횟수'], ['좌석 수', '관객 수']][kind];
      return M(`${said}을 구할 때 기준량과 비교하는 양은 각각 얼마인가?`, [{ label: '기준량', answer: t }, { label: '비교하는 양', answer: k }], {
        explain: `「${base}에 대한」은 ${josa(base, '을/를')} 기준으로 한다는 뜻이다. 기준량은 ${base}인 ${t}, 비교하는 양은 ${cmp}인 ${k}이다.`,
        facts: { calc: [[String(t), 0], [String(k), 1]] }
      });
    }),
    T('us-density', '넓이에 대한 인구의 비율', '①42 ②39 ③38 심38', (d) => {
      const area = d.int(4, 12), dens = d.int(12, 95) * 10, pop = area * dens;
      return N(`넓이가 ${area} km²인 마을에 ${pop}명이 산다. 이 마을의 넓이에 대한 인구의 비율은?`, dens, {
        explain: `기준량은 넓이인 ${area}, 비교하는 양은 인구인 ${pop}이다. 비율은 ${pop} ÷ ${area} = ${dens}이다. 1 km²에 ${dens}명이 사는 셈이다.`, facts: { calc: [[`${pop}/${area}`, 0]] }
      });
    }),
    T('us-mix', '섞은 것의 비율', '①44 ②40 ③31·41', (d, n) => {
      // 첫째 문항은 섞어 만든 전체가 기준량(분수), 둘째 문항은 섞기 전의 한 가지가 기준량(소수).
      if (n === 0) {
        const w = d.pick([200, 250, 300, 400, 500]), s = d.until(() => d.int(2, 12) * 10, (v) => v * 3 < w), g = gcd(s, w);
        return FR(`설탕 ${s} g을 물에 녹여 설탕물 ${w} g을 만들었다. 설탕물의 양에 대한 설탕의 양의 비율을 분수로 나타내시오.`, s, w, {
          explain: `기준량은 설탕물의 양인 ${w} g, 비교하는 양은 설탕의 양인 ${s} g이다. 비율은 ${s} ÷ ${w} = ${frac(s, w)} = ${frac(s / g, w / g)}이다.`
        });
      }
      const w = d.pick([50, 200, 250]), b = d.until(() => d.int(3, 80), (v) => v * 2 < w && ends(v, w) && v % 10 !== 0);
      return DR(`흰색 물감 ${w} mL에 파란색 물감 ${b} mL를 섞었다. 흰색 물감의 양에 대한 파란색 물감의 양의 비율을 소수로 나타내시오.`, b, w, {
        explain: `기준량은 흰색 물감의 양인 ${w} mL이다(섞은 물감 전체의 양이 아니다). 비교하는 양은 파란색 물감의 양인 ${b} mL이므로 비율은 ${b} ÷ ${w} = ${dec(b, w)}이다.`
      });
    }, { count: 2 }),
    T('us-hit', '전체 타수에 대한 안타 수의 비율', '①36·47 ②42 ③39', (d) => {
      const [t, h] = d.pick([[125, 21], [40, 13], [200, 64], [80, 26], [50, 14], [25, 8], [250, 85], [120, 39], [40, 11], [125, 38]]);
      return DR(`야구 선수가 ${t}타수 가운데 안타를 ${h}개 쳤다. 전체 타수에 대한 안타 수의 비율을 소수로 나타내시오.`, h, t, {
        explain: `기준량은 전체 타수인 ${t}, 비교하는 양은 안타 수인 ${h}이다. 비율은 ${h} ÷ ${t} = ${dec(h, t)}이다.`
      });
    }),
    T('us-map', '실제 거리에 대한 지도에서의 거리의 비율', '①48 ②44 ③42 심42', (d) => {
      const [m, c] = d.pick([[800, 2], [1600, 8], [500, 2], [300, 1], [600, 3], [1200, 4], [900, 3], [1000, 5], [2000, 4], [1500, 3]]), real = m * 100, g = gcd(c, real);
      return FR(`실제 거리가 ${m} m인 길을 지도에 ${c} cm로 그렸다. 실제 거리에 대한 지도에서의 거리의 비율을 분수로 나타내시오.`, c, [`${m}*100`, real], {
        explain: `두 거리의 단위를 같게 한다. 1 m = 100 cm이므로 실제 거리는 ${m} m = ${real} cm이다. 기준량은 실제 거리이므로 비율은 ${frac(c, real)}${g > 1 ? ` = ${frac(c / g, real / g)}` : ''}이다.`,
        facts: { unseen: [100] }
      });
    }),
    T('us-shadow', '같은 시각에 잰 높이와 그림자의 길이', '①49 ②43 ③30', (d) => {
      const [p, q] = d.pick([[5, 4], [3, 4], [3, 2], [4, 5], [1, 4], [5, 8]]), [m1, m2] = d.until(() => [d.int(2, 6), d.int(2, 6)], ([x, y]) => x !== y), h = [q * m1 * 10, q * m2 * 10], s = [p * m1 * 10, p * m2 * 10], r = K(p, q) / 1000;
      return M('같은 시각에 두 나무의 높이와 그림자의 길이를 재었다. 높이에 대한 그림자의 길이의 비율을 각각 소수로 나타내시오.', [{ label: '가', answer: r, decimal: true }, { label: '나', answer: r, decimal: true }], {
        figure: tableOf([['나무', '가', '나'], ['높이(cm)', h[0], h[1]], ['그림자의 길이(cm)', s[0], s[1]]]),
        explain: `가 나무는 ${s[0]} ÷ ${h[0]} = ${dec(p, q)}, 나 나무는 ${s[1]} ÷ ${h[1]} = ${dec(p, q)}이다. 같은 시각에 잰 높이에 대한 그림자의 길이의 비율은 서로 같다.`,
        facts: { calc: [[`${s[0]}/${h[0]}`, 0], [`${s[1]}/${h[1]}`, 1]] }
      });
    }),
    T('us-two-way', '기준량을 바꾼 두 비율', '②45 ③43 심37', (d) => {
      const [a, b] = d.pick([[5, 2], [5, 4], [8, 5], [4, 5], [2, 5], [5, 8]]);
      return M(`길이가 ${a} m인 끈을 모두 써서 크기가 같은 리본 ${b}개를 만들었다. ㉠, ㉡을 각각 소수로 나타내시오.`, [{ label: LAB[0], answer: K(a, b) / 1000, decimal: true }, { label: LAB[1], answer: K(b, a) / 1000, decimal: true }], {
        figure: tagged(['리본 수에 대한 끈의 길이의 비율', '끈의 길이에 대한 리본 수의 비율'], LAB),
        explain: `리본 수가 기준량이면 ${a} ÷ ${b} = ${dec(a, b)}이다(리본 1개에 끈 ${dec(a, b)} m). 끈의 길이가 기준량이면 ${b} ÷ ${a} = ${dec(b, a)}이다(끈 1 m로 리본 ${dec(b, a)}개). 기준량을 바꾸면 비율이 달라진다.`,
        facts: { calc: [[`${a}/${b}`, 0], [`${b}/${a}`, 1]] }
      });
    }),
    T('us-meaning', '비율이 나타내는 뜻', '②46 ③43 심37', (d) => {
      // 틀린 보기: 기준량과 비교하는 양을 뒤바꾼 뜻, 비율의 수를 양으로 읽은 뜻
      const t = d.int(4, 9), k = d.int(2, 5), per = d.bool();
      return pickOne(d, per ? `${t}분 동안 종이꽃 ${t * k}개를 만들었다. 걸린 시간에 대한 만든 종이꽃 수의 비율 ${josa(k, '이/가')} 나타내는 것은?` : `${t}분 동안 종이꽃 ${t * k}개를 만들었다. 만든 종이꽃 수에 대한 걸린 시간의 비율 ${fj(1, k, '이/가')} 나타내는 것은?`, [
        ['1분 동안 만든 종이꽃의 수', per], ['종이꽃 1개를 만드는 데 걸린 시간(분)', !per], [`${k}분 동안 만든 종이꽃의 수`, false], [`종이꽃 ${k}개를 만드는 데 걸린 시간(분)`, false]
      ], true, {
        explain: per ? `기준량은 걸린 시간이다. ${t * k} ÷ ${t} = ${k}이므로 걸린 시간 1분에 대하여 종이꽃이 ${k}개라는 뜻이다. 1분 동안 종이꽃을 ${k}개 만들었다.` : `기준량은 만든 종이꽃 수이다. ${t} ÷ ${t * k} = ${frac(1, k)}이므로 종이꽃 1개에 대하여 걸린 시간이 ${frac(1, k)}분이라는 뜻이다. 종이꽃 1개를 만드는 데 ${frac(1, k)}분이 걸렸다.`
      });
    }),
    T('us-part', '분수로 준 비율로 비교하는 양 구하기', '③67 심66', (d) => {
      const [p, q] = d.pick([[1, 8], [3, 8], [2, 5], [3, 20], [1, 12], [5, 12], [3, 25], [2, 15]]), t = q * d.int(4, 15), [what, part, u] = d.pick([['과수원에서 딴 사과', '흠이 있는 사과', '개'], ['도서관에 있는 책', '과학책', '권'], ['농장에 있는 닭', '흰색 닭', '마리']]);
      return N(`${josa(what, '은/는')} ${t}${u}이고, 전체에 대한 ${part}의 비율은 ${frac(p, q)}이다. ${josa(part, '은/는')} 몇 ${u}인가?`, (t * p) / q, {
        unit: u, explain: `(비교하는 양) = (기준량) × (비율)이다. 기준량은 전체인 ${t}${u}이므로 ${t} × ${frac(p, q)} = ${(t * p) / q}(${u})이다.`,
        facts: { calc: [[`${t}*${p}/${q}`, 0]] }
      });
    }),
    T('us-pick-thing', '비율을 보고 대상 고르기', '①39', (d) => {
      const base = d.pick([200, 250, 500]), names = ['설탕', '버터', '소금', '우유'];
      const xs = d.until(() => [d.int(4, 20) * 10, d.int(4, 20) * 10, d.int(1, 9), d.int(4, 24) * 10], (v) => new Set(v).size === 4 && v.every((x) => ends(x, base) && x < base)), at = d.pick([0, 1, 3]);
      return C(`밀가루 ${base} g에 ${names.map((nm, i) => `${nm} ${xs[i]} g`).join(', ')}을 넣어 반죽을 만들었다. 밀가루의 양에 대한 비율이 ${dec(xs[at], base)}인 재료는?`, names, at, {
        explain: `기준량은 밀가루의 양인 ${base} g이다. ${names.map((nm, i) => `${nm} ${xs[i]} ÷ ${base} = ${dec(xs[i], base)}`).join(', ')}이므로 비율이 ${dec(xs[at], base)}인 재료는 ${names[at]}이다.`,
        facts: { choose: { exprs: xs.map((x) => `${x}/${base}`), rule: 'equals', target: K(xs[at], base) / 1000 } }
      });
    })
  ]);

  // ── 백분율 ───────────────────────────────────────────────────
  B.addTypes(U, 'pct', [
    T('pc-word', '백분율의 뜻', '①52 ②9 ③45', (d) => {
      const rows = d.shuffle([['백분율', true], ['비율', false], ['기준량', false], ['비교하는 양', false]]);
      return C('기준량을 100으로 할 때의 비율을 무엇이라고 하는가?', rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
        explain: '기준량을 100으로 할 때의 비율을 백분율이라고 한다. 백분율은 기호 %를 사용하여 나타내고 「퍼센트」라고 읽는다.', facts: { truth: rows.map((r) => r[1]), want: true }
      });
    }),
    T('pc-read', '백분율의 뜻에 알맞은 수', '①52 ③45', (d) => {
      const k = d.until(() => d.int(11, 97), (v) => v % 10 !== 0);
      return M('㉠, ㉡에 알맞은 수는?', [{ label: LAB[0], answer: 100 }, { label: LAB[1], answer: k }], {
        figure: lines([`기준량을 ${box(LAB[0])}으로 할 때의 비율을 백분율이라고 한다.`, `비율 ${fj(k, 100, '을/를')} 백분율로 나타내면 ${box(LAB[1])} %이다.`]),
        explain: `백분율은 기준량을 100으로 할 때의 비율이다. ${fj(k, 100, '은/는')} 기준량이 100일 때 비교하는 양이 ${k}인 비율이므로 ${k} %이다.`,
        facts: { calc: [['100', 0], [String(k), 1]] }
      });
    }),
    T('pc-frac-steps', '분모를 100으로 만들어 백분율로 나타내기', '①53 ②50 ③46 심44', (d) => {
      const b = d.pick([4, 5, 20, 25, 50]), a = d.until(() => d.int(1, b - 1), (v) => gcd(v, b) === 1), m = 100 / b;
      return M('분모를 100으로 만들어 분수를 백분율로 나타내는 과정이다. ㉠, ㉡에 알맞은 수는?', [{ label: LAB[0], answer: m }, { label: LAB[1], answer: a * m }], {
        figure: lines([`${frac(a, b)} = ${frac(`${a} × ${box(LAB[0])}`, `${b} × ${box(LAB[0])}`)} = ${frac(box(LAB[1]), 100)} → ${box(LAB[1])} %`]),
        explain: `${b} × ${m} = 100이므로 분모와 분자에 ${josa(m, '을/를')} 곱한다. ${frac(a, b)} = ${frac(a * m, 100)}이므로 ${a * m} %이다.`,
        facts: { calc: [[`100/${b}`, 0], [`${a}*100/${b}`, 1]] }
      });
    }),
    T('pc-times-steps', '비율에 100을 곱해 백분율로 나타내기', '②50 ③47', (d) => {
      const b = d.pick([4, 5, 20, 25, 50]), a = d.until(() => d.int(1, b - 1), (v) => gcd(v, b) === 1), p = (a * 100) / b;
      return M('분수로 나타낸 비율에 어떤 수를 곱하여 백분율로 나타내는 과정이다. ㉠, ㉡에 알맞은 수는?', [{ label: LAB[0], answer: 100 }, { label: LAB[1], answer: p }], {
        figure: lines([`${frac(a, b)} × ${box(LAB[0])} = ${box(LAB[1])} → ${box(LAB[1])} %`]),
        explain: `비율에 100을 곱한 값에 기호 %를 붙이면 백분율이 된다. ${frac(a, b)} × 100 = ${p}이므로 ${p} %이다.`,
        facts: { calc: [['100', 0], [`${a}*100/${b}`, 1]], unseen: [100] }
      });
    }),
    T('pc-frac', '분수를 백분율로 나타내기', '①53·55 ②52 ③48 심44', (d, n) => {
      // 첫째 문항은 분모가 100의 약수인 분수, 둘째 문항은 약분해야 분모가 100의 약수가 되는 분수, 셋째 문항은 1보다 큰 분수(100 %를 넘는다).
      const [a, b] = n === 0 ? d.until(() => [d.int(1, 49), d.pick([4, 5, 10, 20, 25, 50])], ([x, y]) => x < y && gcd(x, y) === 1)
        : n === 1 ? d.pick([[24, 80], [36, 150], [9, 18], [9, 45], [2, 8], [12, 30], [27, 60], [21, 35], [18, 40], [9, 15], [12, 16], [21, 60]])
          : d.pick([[3, 2], [9, 5], [7, 4], [5, 4], [7, 5], [11, 10], [6, 5], [13, 10], [8, 5], [27, 20]]);
      const g = gcd(a, b), p = (a * 100) / b;
      return PR(`비율 ${fj(a, b, '을/를')} 백분율로 나타내면 몇 %인가?`, a, b, {
        explain: `${g > 1 ? `${frac(a, b)} = ${frac(a / g, b / g)}이다. ` : ''}${frac(a / g, b / g)} × 100 = ${p}이므로 ${p} %이다.${n === 2 ? ' 비율이 1보다 크면 백분율은 100 %보다 크다.' : ''}`,
        facts: { rule: ['pctFracEasy', 'pctFracReduce', 'pctFracOver'][n] }
      });
    }, { count: 3 }),
    T('pc-dec', '소수를 백분율로 나타내기', '①54·55 ②51·56 ③48 심44', (d, n) => {
      // 첫째 문항은 소수 두 자리 수, 둘째 문항은 자리를 헷갈리기 쉬운 수(0.8, 0.09), 셋째 문항은 1보다 큰 소수, 넷째 문항은 소수 세 자리 수(백분율이 소수).
      const k = n === 0 ? d.until(() => d.int(11, 99), (v) => v % 10 !== 0) * 10 : n === 1 ? (d.bool() ? d.int(1, 9) * 100 : d.int(1, 9) * 10) : n === 2 ? d.pick([1250, 1400, 1050, 1200, 2500, 1080, 1750]) : d.pick([625, 375, 125, 875, 35, 175, 225, 45]);
      const s = ks(k), text = `비율 ${dj(s, '을/를')} 백분율로 나타내면 몇 %인가?`, how = `${s} × 100 = ${ks(k * 100)}이므로 ${ks(k * 100)} %이다.`;
      if (n === 3) return D(text, k / 10, { unit: ' %', explain: `${how} 백분율도 소수가 될 수 있다.`, facts: { calc: [[`${s}*100`, 0]], unseen: [100], rule: 'pctDecFine' } });
      const e = pctExpr(k);
      return N(text, k / 10, { unit: ' %', explain: `${how}${n === 1 ? ' 소수점을 오른쪽으로 두 자리 옮긴다.' : n === 2 ? ' 비율이 1보다 크면 백분율은 100 %보다 크다.' : ''}`, facts: { calc: [[e.s, 0]], unseen: e.un, rule: ['pctDecTwo', 'pctDecPlace', 'pctDecOver'][n] } });
    }, { count: 4 }),
    T('pc-back', '백분율을 소수와 분수로 나타내기', '①56 ②53 ③49', (d, n) => {
      // 첫째 문항은 소수로, 둘째 문항은 분수로.
      if (n === 0) {
        const p = d.bool() ? d.int(1, 9) : d.until(() => d.int(11, 99), (v) => v % 10 !== 0 || d.bool());
        return D(`백분율 ${pj(p, '을/를')} 소수로 나타내시오.`, p / 100, { explain: `${pj(p, '은/는')} ${frac(p, 100)}이므로 소수로 나타내면 ${ks(p * 10)}이다.`, facts: { calc: [[`${p}/100`, 0]], unseen: [100] } });
      }
      const p = d.until(() => d.int(4, 96), (v) => gcd(v, 100) > 1), g = gcd(p, 100);
      return FR(`백분율 ${pj(p, '을/를')} 분수로 나타내시오.`, p, 100, { explain: `${pj(p, '은/는')} 기준량을 100으로 할 때의 비율이므로 ${frac(p, 100)} = ${frac(p / g, 100 / g)}이다.`, facts: { unseen: [100] } });
    }, { count: 2 }),
    T('pc-table', '분수·소수·백분율 표 완성하기', '①57 ②54 ③50 심44', (d) => {
      const b = d.pick([4, 5, 20, 25, 50]), a = d.until(() => d.int(1, b - 1), (v) => gcd(v, b) === 1), q = d.pick([20, 25, 50]), h = d.until(() => d.int(11, 99), (v) => v % 10 !== 0 && (v * q) % 100 === 0), top = (h * q) / 100;
      return M('비율을 분수, 소수, 백분율로 나타낸 표이다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?', [{ label: LAB[0], answer: K(a, b) / 1000, decimal: true }, { label: LAB[1], answer: (a * 100) / b }, { label: LAB[2], answer: top }, { label: LAB[3], answer: h }], {
        figure: table(['분수', '소수', '백분율'], [[frac(a, b), box(LAB[0]), `${box(LAB[1])} %`], [frac(box(LAB[2]), q), `0.${h}`, `${box(LAB[3])} %`]]),
        explain: `${frac(a, b)} = ${dec(a, b)}이고 ${dec(a, b)} × 100 = ${(a * 100) / b}이므로 ${(a * 100) / b} %이다. 0.${h} = ${frac(h, 100)} = ${frac(top, q)}이고 0.${h} × 100 = ${h}이므로 ${h} %이다.`,
        facts: { calc: [[`${a}/${b}`, 0], [`${a}*100/${b}`, 1], [`${h}*${q}/100`, 2], [String(h), 3]], unseen: [100] }
      });
    }),
    T('pc-ratio', '비의 비율을 백분율로 나타내기', '①58 ②54', (d, n) => {
      // 첫째 문항은 기호로 쓴 비, 둘째 문항은 말로 읽은 비(기준량을 먼저 가린다).
      const [a, b] = d.until(() => [d.int(3, 48), d.pick([8, 12, 16, 20, 24, 25, 28, 40, 50, 60])], ([x, y]) => x < y && (x * 100) % y === 0), g = gcd(a, b), p = (a * 100) / b;
      return PR(`${n === 0 ? `비 ${a} : ${b}의` : `${READ[3](a, b)}의`} 비율을 백분율로 나타내면 몇 %인가?`, a, b, {
        explain: `${n === 1 ? `기준량은 ${b}, 비교하는 양은 ${a}이다. ` : ''}비율은 ${a} ÷ ${b} = ${frac(a, b)}${g > 1 ? ` = ${frac(a / g, b / g)}` : ''}이고 ${frac(a / g, b / g)} × 100 = ${p}이므로 ${p} %이다.`
      });
    }, { count: 2 }),
    T('pc-shade', '색칠한 부분을 백분율로 나타내기', '①59 ②59 ③53 심28', (d, n) => {
      // 첫째 문항은 100칸 모눈, 둘째 문항은 칸 수가 100이 아닌 모눈.
      if (n === 0) {
        const k = d.until(() => d.int(12, 88), (v) => v % 10 !== 0);
        return PR('전체에 대한 색칠한 부분의 비율은 몇 %인가?', k, 100, { figure: cells(10, 10, range(k), { u: 15 }), explain: `전체 100칸 가운데 ${k}칸을 색칠하였다. 기준량이 100일 때 비교하는 양이 ${k}이므로 ${k} %이다.`, facts: { rule: 'shade100' } });
      }
      const [cols, rows] = d.pick([[5, 2], [5, 4], [5, 5], [10, 5], [8, 5]]), total = cols * rows, k = d.until(() => d.int(2, total - 2), (v) => (v * 100) % total === 0 && v * 2 !== total);
      return PR('전체에 대한 색칠한 부분의 비율은 몇 %인가?', k, total, { figure: cells(cols, rows, range(k)), explain: `전체 ${total}칸 가운데 ${k}칸을 색칠하였다. 비율은 ${frac(k, total)}이고 ${frac(k, total)} × 100 = ${(k * 100) / total}이므로 ${(k * 100) / total} %이다.`, facts: { rule: 'shadeSmall' } });
    }, { count: 2 }),
    T('pc-shade-count', '백분율에 맞게 색칠할 칸 수', '①32 ②60 ③54 심29', (d) => {
      const [cols, rows] = d.pick([[4, 4], [5, 4], [5, 5], [8, 5], [4, 3]]), total = cols * rows, p = d.until(() => d.int(2, 18) * 5, (v) => (total * v) % 100 === 0 && v !== 50);
      return N(`전체의 ${p} %만큼 색칠하려고 한다. 몇 칸을 색칠해야 하는가?`, (total * p) / 100, {
        unit: '칸', figure: cells(cols, rows, []),
        explain: `전체는 ${total}칸이다. ${pj(p, '은/는')} ${frac(p, 100)}이므로 ${total} × ${frac(p, 100)} = ${(total * p) / 100}(칸)을 색칠해야 한다.`,
        facts: { calc: [[`${total}*${p}/100`, 0]], unseen: [100] }
      });
    }),
    T('pc-odd', '나타내는 비율이 다른 하나 찾기(백분율)', '①60 ②56 심23', (d) => {
      // 다른 하나는 소수점의 자리를 잘못 옮긴 백분율이다(1.2를 12 %로, 0.4를 4 %로).
      const [p, q] = d.pick([[6, 5], [2, 5], [3, 4], [1, 4], [3, 5], [7, 20], [3, 2], [9, 20], [4, 5]]), k = K(p, q), m = d.int(2, 5), P = k / 10, wrong = P / 10;
      const same = d.shuffle([[ks(k), ks(k)], [READ[d.pick([0, 2])](p * m, q * m), `${p * m}/${q * m}`], [frac(p, q), `${p}/${q}`]]).map(([text, e]) => [text, true, undefined, e]);
      const list = d.shuffle(same.concat([[`${wrong} %`, false, undefined, `${wrong}/100`]]));
      return pickOne(d, '나타내는 비율이 나머지와 다른 하나는?', list, false, {
        keep: true, facts: { choose: { exprs: list.map((r) => r[3]), rule: 'odd' }, unseen: [100] },
        explain: `${frac(p, q)} = ${ks(k)}이고 백분율로 나타내면 ${ks(k)} × 100 = ${P}이므로 ${P} %이다. ${pj(wrong, '은/는')} ${ks(wrong * 10)}이므로 나머지와 다르다.`
      });
    }),
    T('pc-match', '분수·소수·백분율 짝 짓기', '①60 ②55 ③51 심22', (d) => {
      // 틀린 보기: 백분율의 자리를 잘못 옮긴 것(0.06을 60 %로), 소수와 백분율은 맞지만 분수가 다른 것, 분수와 백분율은 맞지만 소수가 다른 것
      const ps = d.shuffle([[3, 50], [9, 20], [12, 25], [3, 5], [7, 25], [1, 20], [3, 4], [2, 25], [13, 20]]).slice(0, 4);
      const row = ([p, q], kind) => {
        const k = K(p, q), P = k / 10, right = `${frac(p, q)}, ${ks(k)}, ${P} %`;
        const shown = kind === 'pct' ? `${frac(p, q)}, ${ks(k)}, ${P < 10 ? P * 10 : P / 10} %` : kind === 'frac' ? `${frac(q - p, q)}, ${ks(k)}, ${P} %` : kind === 'dec' ? `${frac(p, q)}, ${ks(k < 100 ? k * 10 : k / 10)}, ${P} %` : right;
        return [shown, kind === 'ok', undefined, right];
      };
      const list = d.shuffle([row(ps[0], 'ok'), row(ps[1], 'pct'), row(ps[2], 'frac'), row(ps[3], 'dec')]);
      return pickOne(d, '같은 비율을 분수, 소수, 백분율로 바르게 나타낸 것은?', list, true, { keep: true, explain: `바르게 나타내면 차례로 ${list.map((r) => `(${r[3]})`).join(', ')}이다.` });
    }),
    T('pc-compare', '꼴이 다른 두 비율의 크기 비교', '①61 ②57 ③55 심46', (d) => {
      const q = d.pick([4, 5, 20, 25, 50]), p = d.until(() => d.int(1, q - 1), (v) => gcd(v, q) === 1 && (v * 100) / q >= 10), P = (p * 100) / q, shown = P + d.pick([-2, -1, 0, 0, 1, 2]), flip = d.bool();
      const left = flip ? frac(p, q) : `${shown} %`, right = flip ? `${shown} %` : frac(p, q), v = flip ? [P, shown] : [shown, P], at = v[0] > v[1] ? 0 : v[0] === v[1] ? 1 : 2;
      return C('두 비율의 크기를 비교하여 ○ 안에 알맞은 것은?', SIGNS, at, {
        figure: versus(left, right),
        explain: `${frac(p, q)} × 100 = ${P}이므로 ${fj(p, q, '은/는')} ${P} %이다. ${v[0]} % ${SIGNS[at]} ${v[1]} %`,
        facts: { choose: { exprs: flip ? [`${p}*100/${q}`, String(shown)] : [String(shown), `${p}*100/${q}`], rule: 'compare' }, unseen: [100] }
      });
    }),
    T('pc-order', '분수·소수·백분율의 크기 차례', '①61 ②57 ③55 심46', (d) => {
      const down = d.bool(), q = d.pick([20, 25, 50]), vals = d.until(() => [d.int(31, 139), d.int(31, 139), d.int(31, 139)], (v) => new Set(v).size === 3 && Math.max(...v) - Math.min(...v) <= 30 && (v[0] * q) % 100 === 0 && v[1] % 10 !== 0), tags = LAB.slice(0, 3);
      const items = [{ text: frac((vals[0] * q) / 100, q), e: `${(vals[0] * q) / 100}*100/${q}` }, { text: ks(vals[1] * 10), e: pctExpr(vals[1] * 10) }, { text: `${vals[2]} %`, e: String(vals[2]) }];
      const oc = orderChoice(d, vals, tags, down);
      return C(`비율이 ${down ? '큰' : '작은'} 것부터 차례로 쓴 것은?`, oc.options, oc.answer, {
        figure: tagged(items.map((x) => x.text), tags),
        explain: `백분율로 나타내면 ${tags.map((tag, i) => `${tag} ${vals[i]} %`).join(', ')}이다. ${down ? '큰' : '작은'} 것부터 차례로 쓰면 ${oc.options[oc.answer]}이다.`,
        facts: { choose: { exprs: [items[0].e, items[1].e.s, items[2].e], rule: down ? 'descending' : 'ascending', orders: oc.list }, unseen: [100].concat(items[1].e.un) }
      });
    }),
    T('pc-lowest', '자리를 헷갈리기 쉬운 비율 가운데 가장 낮은(높은) 것', '②57 심46', (d) => {
      // 낮은 것 찾기: 9.7 %(= 0.097)처럼 수는 커 보이지만 가장 낮은 것이 답. 높은 것 찾기: 1.02(= 102 %)처럼 수는 작아 보이지만 가장 높은 것이 답.
      const low = d.bool(), q = d.pick([20, 25, 50]), a = d.int(31, 89), h = d.until(() => d.int(21, 79), (v) => v % 10 !== 0 && v !== a), fp = d.until(() => d.int(30, 90), (v) => (v * q) % 100 === 0 && v !== a && v !== h), top = (fp * q) / 100;
      const key = low ? `${d.int(6, 9)}.${d.int(1, 9)}` : d.pick(['1.02', '1.1', '1.05', '1.2']);
      const list = d.shuffle([[`${a} %`, `${a}/100`, false], [`0.${h}`, `${h}/100`, false], [frac(top, q), `${top}/${q}`, false], low ? [`${key} %`, `${key}/100`, true] : [key, key, true]]);
      return C(`비율이 가장 ${low ? '낮은' : '높은'} 것은?`, list.map((r) => r[0]), list.findIndex((r) => r[2]), {
        explain: `백분율로 나타내면 ${dj(`0.${h}`, '은/는')} ${h} %, ${fj(top, q, '은/는')} ${fp} %${low ? `이다. ${key} %는 10 %보다도 낮으므로 가장 낮다.` : `, ${dj(key, '은/는')} ${Math.round(Number(key) * 100)} %이다. ${dj(key, '은/는')} 1보다 큰 비율이므로 가장 높다.`}`,
        facts: { choose: { exprs: list.map((r) => r[1]), rule: low ? 'min' : 'max' }, unseen: [100] }
      });
    }),
    T('pc-under-count', '비교하는 양이 기준량보다 작은 것 세기', '①61 ②31 ③56 심25', (d) => {
      // 비율이 1(100 %)보다 작은 것을 센다. 100 %를 넘는 백분율, 1보다 큰 분수와 소수를 섞었다.
      const under = d.bool(), mk = [
        (o) => { const p = o ? d.int(101, 190) : d.until(() => d.int(52, 98), (v) => v % 10 !== 0); return [`${p} %`, `${p}/100`]; },
        (o) => { const [a, b] = o ? d.pick([[3, 2], [5, 4], [7, 5], [13, 10], [9, 8]]) : d.pick([[2, 7], [6, 7], [4, 5], [7, 9], [5, 8]]); return [frac(a, b), `${a}/${b}`]; },
        (o) => { const t = o ? d.pick(['1.02', '1.3', '1.08', '2.1']) : d.pick(['0.87', '0.7', '0.43', '0.9']); return [t, t]; },
        (o) => { const p = o ? d.int(101, 190) : d.until(() => d.int(52, 98), (v) => v % 10 !== 0); return [`${p} %`, `${p}/100`]; },
        (o) => { const [a, b] = o ? d.pick([[6, 5], [11, 8], [10, 7]]) : d.pick([[3, 4], [9, 10], [5, 6]]); return [frac(a, b), `${a}/${b}`]; }
      ];
      const flags = d.until(() => range(5).map(() => d.bool()), (f) => f.filter(Boolean).length >= 2 && f.filter(Boolean).length <= 3 && f[0] !== f[3]), list = d.shuffle(mk.map((f, i) => f(flags[i]).concat([flags[i]])));
      const hit = list.filter((r) => r[2] !== under).length;
      return N(`비교하는 양이 기준량보다 ${under ? '작은' : '큰'} 것은 모두 몇 개인가?`, hit, {
        unit: '개', figure: numbers(list.map((r) => r[0])),
        explain: `비교하는 양이 기준량보다 ${under ? '작으면 비율이 1(100 %)보다 작다' : '크면 비율이 1(100 %)보다 크다'}. 비율이 1보다 ${under ? '작은' : '큰'} 것은 ${list.filter((r) => r[2] !== under).map((r) => r[0]).join(', ')}의 ${hit}개이다.`,
        facts: { choose: { exprs: list.map((r) => r[1]), rule: under ? 'countBelow' : 'countAbove', target: 1 }, unseen: [100] }
      });
    }),
    T('pc-wrong', '백분율로 잘못 나타낸 것 고르기', '①62 ②58 ③52 심45', (d) => {
      // 틀린 보기: 소수점을 한 자리만 옮긴 것(0.6 → 6 %, 0.07 → 70 %, 0.23 → 2.3 %), 분모를 100으로 만들지 않고 분자에 다른 수를 곱하거나 숫자를 이어 붙인 것
      const ds = d.shuffle([40, 70, 230, 600, 90, 1300, 670, 300, 400]).slice(0, 2), fs = d.shuffle([[12, 25, 24], [11, 50, 55], [3, 5, 6], [9, 20, 18], [7, 25, 14], [3, 4, 34], [13, 50, 65]]).slice(0, 2), badDec = d.bool();
      const decRow = (k, bad) => { const P = k / 10, shown = bad ? (P < 10 ? P * 10 : P / 10) : P; return [`${ks(k)} → ${shown} %`, !bad, [`${k}/10`, shown]]; };
      const fracRow = ([a, b, w], bad) => { const shown = bad ? w : (a * 100) / b; return [`${frac(a, b)} → ${shown} %`, !bad, [`${a}*100/${b}`, shown]]; };
      return pickOne(d, '비율을 백분율로 잘못 나타낸 것은?', [decRow(ds[0], false), fracRow(fs[0], false), decRow(ds[1], badDec), fracRow(fs[1], !badDec)], false, {
        explain: badDec ? `${ks(ds[1])} × 100 = ${ds[1] / 10}이므로 ${dj(ks(ds[1]), '은/는')} ${ds[1] / 10} %이다.` : `${frac(fs[1][0], fs[1][1])} × 100 = ${(fs[1][0] * 100) / fs[1][1]}이므로 ${fj(fs[1][0], fs[1][1], '은/는')} ${(fs[1][0] * 100) / fs[1][1]} %이다.`
      });
    })
  ]);

  // ── 백분율이 쓰이는 경우 ─────────────────────────────────────
  B.addTypes(U, 'puse', [
    T('pu-base', '득표율·할인율·진하기의 기준량', '③20 심55', (d) => {
      // 틀린 보기: 기준량을 나머지 한쪽(판매 가격, 물의 양, 다른 후보의 표)으로 잡은 것, 기준량과 비교하는 양을 바꾼 것
      const [ask, rows, why] = d.pick([
        ['물건의 할인율은 어떤 비율을 백분율로 나타낸 것인가?', [['원래 가격에 대한 할인 금액의 비율', true], ['판매 가격에 대한 할인 금액의 비율', false], ['원래 가격에 대한 판매 가격의 비율', false], ['할인 금액에 대한 원래 가격의 비율', false]], '할인율은 원래 가격을 기준량으로, 할인 금액을 비교하는 양으로 하는 비율이다.'],
        ['소금물의 진하기는 어떤 비율을 백분율로 나타낸 것인가?', [['소금물의 양에 대한 소금의 양의 비율', true], ['물의 양에 대한 소금의 양의 비율', false], ['소금의 양에 대한 소금물의 양의 비율', false], ['소금물의 양에 대한 물의 양의 비율', false]], '소금물의 진하기는 소금물의 양을 기준량으로, 녹아 있는 소금의 양을 비교하는 양으로 하는 비율이다.'],
        ['선거에서 한 후보의 득표율은 어떤 비율을 백분율로 나타낸 것인가?', [['전체 투표 수에 대한 그 후보의 득표수의 비율', true], ['다른 후보의 득표수에 대한 그 후보의 득표수의 비율', false], ['그 후보의 득표수에 대한 전체 투표 수의 비율', false], ['전체 투표 수에 대한 다른 후보의 득표수의 비율', false]], '득표율은 전체 투표 수를 기준량으로, 그 후보의 득표수를 비교하는 양으로 하는 비율이다.']
      ]);
      return pickOne(d, ask, rows, true, { explain: why });
    }),
    T('pu-rate', '전체에 대한 부분의 백분율(득표율)', '①63 ②61·62 ③57 심47', (d) => {
      const t = d.pick([200, 250, 300, 400, 500]), p = d.until(() => d.int(15, 68), (v) => (t * v) % 100 === 0 && v % 10 !== 0), k = (t * p) / 100;
      return PR(`전체 ${t}표 가운데 가 후보가 ${k}표를 얻었다. 가 후보의 득표율은 몇 %인가?`, k, t, {
        explain: `기준량은 전체 투표 수인 ${t}, 비교하는 양은 득표수인 ${k}이다. ${frac(k, t)} × 100 = ${p}이므로 득표율은 ${p} %이다.`
      });
    }),
    T('pu-rate-expr', '성공률을 구하는 식의 빈칸', '①63 ②61', (d) => {
      const t = d.pick([20, 25, 40, 50]), k = d.until(() => d.int(6, t - 4), (v) => (v * 100) % t === 0), p = (k * 100) / t;
      return M(`${name(d.pick(NAMES), '이/가')} 공을 ${t}번 던져 ${k}번 넣었다. 골 성공률을 구하는 식의 ㉠, ㉡에 알맞은 수는?`, [{ label: LAB[0], answer: k }, { label: LAB[1], answer: p }], {
        figure: lines([`(성공률) = ${frac(box(LAB[0]), t)} × 100 = ${box(LAB[1])}(%)`]),
        explain: `골 성공률은 던진 횟수에 대한 넣은 횟수의 비율이다. 기준량은 ${t}, 비교하는 양은 ${k}이므로 ${frac(k, t)} × 100 = ${p}(%)이다.`,
        facts: { calc: [[String(k), 0], [`${k}*100/${t}`, 1]] }
      });
    }),
    T('pu-rate-dec', '백분율이 소수로 나오는 경우(불량률)', '①63 ②61', (d) => {
      const [t, k] = d.pick([[200, 7], [200, 3], [400, 6], [40, 7], [80, 6], [200, 5], [400, 14], [80, 2], [1000, 25], [200, 9]]);
      return DP(`공장에서 만든 장난감 ${t}개 가운데 불량품이 ${k}개 나왔다. 전체 장난감 수에 대한 불량품 수의 비율은 몇 %인가?`, k, t, {
        explain: `기준량은 전체 장난감 수인 ${t}, 비교하는 양은 불량품 수인 ${k}이다. ${frac(k, t)} × 100 = ${ks(K(k * 100, t))}이므로 ${ks(K(k * 100, t))} %이다.`
      });
    }),
    T('pu-rate-table', '표를 보고 항목별 백분율 구하기', '①63·70 ③59 심52', (d) => {
      const total = d.pick([20, 25, 40, 50]), v = d.until(() => { const x = [d.int(4, total / 2), d.int(4, total / 2)]; return x.concat([total - x[0] - x[1]]); }, (x) => x[2] >= 4 && new Set(x).size === 3 && x.every((y) => (y * 100) % total === 0)), p = v.map((x) => (x * 100) / total);
      return M('학급 회장 선거에서 후보별 득표수와 득표율을 나타낸 표이다. ㉠, ㉡에 알맞은 수는?', [{ label: LAB[0], answer: p[1] }, { label: LAB[1], answer: p[2] }], {
        figure: tableOf([['후보', '가', '나', '다', '합계'], ['득표수(표)', v[0], v[1], v[2], total], ['득표율(%)', p[0], box(LAB[0]), box(LAB[1]), 100]]),
        explain: `기준량은 전체 투표 수인 ${total}이다. 나 후보는 ${frac(v[1], total)} × 100 = ${p[1]}(%), 다 후보는 ${frac(v[2], total)} × 100 = ${p[2]}(%)이다. 세 후보의 득표율을 모두 더하면 100 %이다.`,
        facts: { calc: [[`${v[1]}*100/${total}`, 0], [`${v[2]}*100/${total}`, 1]] }
      });
    }),
    T('pu-salt', '소금물의 진하기', '①44 ②63 ③60', (d) => {
      const w = d.pick([200, 250, 300, 400, 500]), p = d.until(() => d.int(4, 24), (v) => (w * v) % 100 === 0 && v !== 10 && v !== 20), s = (w * p) / 100;
      return PR(`소금 ${s} g을 물에 녹여 소금물 ${w} g을 만들었다. 이 소금물의 진하기는 몇 %인가?`, s, w, {
        explain: `진하기는 소금물의 양에 대한 소금의 양의 비율이다. 기준량은 소금물의 양인 ${w} g이므로 ${frac(s, w)} × 100 = ${p}(%)이다.`
      });
    }),
    T('pu-discount', '할인 금액으로 할인율 구하기', '①65 ②65 ③61', (d) => {
      const price = d.pick([2000, 2500, 4000, 5000, 8000, 12000, 16000]), p = d.pick([10, 15, 20, 25, 30, 35, 40]), off = (price * p) / 100;
      return PR(`원래 가격이 ${price}원인 물건을 ${off}원 할인하여 판다. 할인율은 몇 %인가?`, off, price, {
        explain: `할인율은 원래 가격에 대한 할인 금액의 비율이다. 기준량은 원래 가격인 ${price}원, 비교하는 양은 할인 금액인 ${off}원이므로 ${frac(off, price)} × 100 = ${p}(%)이다.`
      });
    }),
    T('pu-interest', '이자로 이자율 구하기(쓰지 않는 수가 섞임)', '①69 ②67 ③63 심62', (d) => {
      const won = d.pick([20000, 40000, 50000, 60000, 80000]), p = d.int(2, 6), i = (won * p) / 100, pocket = won + d.pick([10000, 20000, 30000]);
      return PR(`${name(d.pick(NAMES), '은/는')} 용돈 ${pocket}원 가운데 ${won}원을 은행에 예금하여 1년 뒤에 이자 ${i}원을 받았다. 예금한 돈에 대한 이자의 비율은 몇 %인가?`, i, won, {
        explain: `기준량은 예금한 돈인 ${won}원, 비교하는 양은 이자인 ${i}원이다. ${frac(i, won)} × 100 = ${p}이므로 ${p} %이다. 이 비율을 이자율이라고 한다. 용돈 ${pocket}원은 이 비율에 쓰이지 않는다.`
      });
    }),
    T('pu-part', '기준량에 백분율을 곱해 비교하는 양 구하기', '①71 ②71 ③67 심66', (d, n) => {
      // 첫째 문항은 득표수, 둘째 문항은 할인 금액, 셋째 문항은 소금의 양. 기준량이 무엇인지가 상황마다 다르다.
      const how = (base, p, u) => `(비교하는 양) = (기준량) × (비율)이다. ${pj(p, '은/는')} ${frac(p, 100)}이므로 ${base} × ${frac(p, 100)} = ${(base * p) / 100}(${u})이다.`;
      if (n === 0) {
        const t = d.pick([200, 300, 400, 480, 500, 600]), p = d.until(() => d.int(3, 13) * 5, (v) => (t * v) % 100 === 0);
        return N(`${t}명이 투표한 선거에서 가 후보의 득표율은 ${p} %이다. 가 후보가 얻은 표는 몇 표인가?`, (t * p) / 100, { unit: '표', explain: how(t, p, '표'), facts: { calc: [[`${t}*${p}/100`, 0]], unseen: [100] } });
      }
      if (n === 1) {
        const price = d.pick([3000, 4000, 6000, 8000, 12000, 15000]), p = d.pick([15, 20, 25, 30, 35, 45]);
        return N(`원래 가격이 ${price}원인 책을 ${p} % 할인하여 판다. 할인 금액은 얼마인가?`, (price * p) / 100, { unit: '원', explain: how(price, p, '원'), facts: { calc: [[`${price}*${p}/100`, 0]], unseen: [100] } });
      }
      const w = d.pick([200, 300, 400, 500, 600]), p = d.until(() => d.int(3, 18), (v) => (w * v) % 100 === 0 && v !== 10);
      return N(`진하기가 ${p} %인 소금물 ${w} g에 녹아 있는 소금은 몇 g인가?`, (w * p) / 100, { unit: 'g', explain: how(w, p, 'g'), facts: { calc: [[`${w}*${p}/100`, 0]], unseen: [100] } });
    }, { count: 3 }),
    T('pu-percent-of', '「~의 몇 %」를 바르게 계산한 것', '③71', (d) => {
      // 틀린 보기: 100이 아니라 10으로 나눈 것(400의 8 %는 320), 1000으로 나눈 것(27의 10 %는 0.27), 백분율의 수를 그대로 뺀 듯한 것(50의 50 %는 5)
      const right = d.pick([[350, 20], [400, 15], [250, 40], [600, 5], [80, 25]]), w1 = d.pick([[400, 8], [300, 6], [200, 9]]), w2 = d.pick([[27, 10], [45, 20], [36, 50]]), w3 = d.pick([[50, 50, 5], [60, 30, 30], [40, 40, 4]]);
      const good = (right[0] * right[1]) / 100;
      return pickOne(d, '바르게 계산한 것은?', [
        [`${right[0]}의 ${right[1]} %는 ${good}이다.`, true, [`${right[0]}*${right[1]}/100`, good]],
        [`${w1[0]}의 ${w1[1]} %는 ${(w1[0] * w1[1]) / 10}이다.`, false, [`${w1[0]}*${w1[1]}/100`, (w1[0] * w1[1]) / 10]],
        [`${w2[0]}의 ${w2[1]} %는 ${ks(w2[0] * w2[1])}이다.`, false, [`${w2[0]}*${w2[1]}/100`, (w2[0] * w2[1]) / 1000]],
        [`${w3[0]}의 ${w3[1]} %는 ${w3[2]}이다.`, false, [`${w3[0]}*${w3[1]}/100`, w3[2]]]
      ], true, { explain: `${right[1]} %는 ${frac(right[1], 100)}이므로 ${right[0]} × ${frac(right[1], 100)} = ${good}이다. 백분율을 곱할 때는 100으로 나누어야 한다.` });
    }),
    T('pu-copy', '처음 길이에 대한 줄인 길이의 백분율', '③31·57·67', (d) => {
      const [a, b] = d.pick([[20, 15], [25, 20], [40, 28], [30, 24], [20, 13], [50, 35], [24, 18], [16, 12], [40, 34], [25, 16]]);
      return PR(`가로가 ${a} cm인 그림을 가로가 ${b} cm가 되도록 줄여서 복사하였다. 처음 그림의 가로에 대한 복사한 그림의 가로의 비율은 몇 %인가?`, b, a, {
        explain: `기준량은 처음 그림의 가로인 ${a} cm, 비교하는 양은 복사한 그림의 가로인 ${b} cm이다. ${frac(b, a)} × 100 = ${(b * 100) / a}(%)이다.`
      });
    }),
    T('pu-table-say', '표를 보고 백분율로 설명한 것 가리기', '①70 심52', (d) => {
      // 틀린 보기: 학생 수를 그대로 백분율로 읽은 것(36명 → 36 %). 나머지 셋은 백분율을 구해 보아야 참인지 알 수 있다.
      const names = d.shuffle(['축구', '농구', '피구', '줄넘기']), total = d.pick([50, 150, 200, 250]), step = total === 150 ? 3 : total === 200 ? 2 : total === 250 ? 5 : 1, k = d.pick([2, 3]);
      const v = d.until(() => { const x = d.int(3, 12) * step, y = d.int(2, 20) * step; return [k * x, x, y, total - k * x - x - y]; }, (list) => list[3] >= 2 * step && list[3] < 100 && new Set(list).size === 4), p = v.map((x) => (x * 100) / total);
      return pickOne(d, `학생 ${total}명이 좋아하는 운동을 조사하여 나타낸 표이다. 잘못 설명한 것은?`, [
        [`${josa(names[2], '을/를')} 좋아하는 학생은 전체의 ${p[2]} %이다.`, true, [`${v[2]}*100/${total}`, p[2]]],
        [`${josa(names[0], '을/를')} 좋아하는 학생의 비율은 ${josa(names[1], '을/를')} 좋아하는 학생의 비율의 ${k}배이다.`, true, [`${v[0]}/${v[1]}`, k]],
        [`${josa(names[1], '을/를')} 좋아하는 학생과 ${josa(names[2], '을/를')} 좋아하는 학생의 비율을 더하면 ${p[1] + p[2]} %이다.`, true, [`(${v[1]}+${v[2]})*100/${total}`, p[1] + p[2]]],
        [`${josa(names[3], '을/를')} 좋아하는 학생은 전체의 ${v[3]} %이다.`, false, [`${v[3]}*100/${total}`, v[3]]]
      ], false, {
        figure: table(['운동', '학생 수(명)'], names.map((nm, i) => [nm, v[i]]).concat([['합계', total]])),
        explain: `기준량은 전체 학생 수인 ${total}명이다. ${josa(names[3], '을/를')} 좋아하는 학생은 ${v[3]}명이고 ${frac(v[3], total)} × 100 = ${p[3]}(%)이다. 학생 수 ${v[3]}명을 그대로 ${v[3]} %라고 하면 안 된다.`
      });
    }),
    T('pu-double-line', '두 줄 수직선에서 비교하는 양 읽기', '③68', (d) => {
      const total = d.pick([200, 300, 400, 500, 600, 800]), k = d.pick([2, 3, 4, 6, 7, 8]), [what, unit] = d.pick([['공연장의 좌석 수', '석'], ['과수원의 나무 수', '그루'], ['도서관의 책 수', '권']]);
      return N(`전체가 ${total}${unit}인 ${what}와 백분율을 두 줄 수직선에 나타내었다. □ 안에 알맞은 수는?`, (total * k) / 10, {
        unit, figure: twoLine(total, unit, k),
        explain: `□는 전체 ${total}${unit}의 ${k * 10} %이다. ${total} × ${frac(k * 10, 100)} = ${(total * k) / 10}(${unit})이다. 수직선 한 칸은 ${total / 10}${unit}이고 10 %이다.`,
        facts: { calc: [[`${total}*${k * 10}/100`, 0]] }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
