// 1학년 2학기 6단원 덧셈과 뺄셈(3) — 단원 틀과 기본 문항(덧셈, 뺄셈, 그림을 보고 계산하기, 계산 결과 비교하기).
// 영역: 수와 연산. 성취기준 [2수01-05] 덧셈과 뺄셈의 의미, [2수01-06] 두 자리 수의 범위에서 덧셈과 뺄셈의 계산 원리와 계산
// 가운데 「받아올림·받아내림이 없는 두 자리 수의 덧셈과 뺄셈」.
// 수집해 둔 교과서 평가 자료의 꼴 목록(기본꼴_1 76꼴 = ①n, 심화꼴 47꼴 = 심n)을 하나씩 따져 옮긴 것이다. 꼴과 조건은 그 문제를 따르고 수와 상황은 새로 썼다.
//
// 싣는 기준
//  - 모든 계산은 받아올림·받아내림이 없고 합이 99 이하이다. 보기·풀이에 적히는 식도, 수를 골라 만들 수 있는 식도 그렇게 고른다.
//  - 식만 주는 계산은 계산의 구조와 꼴(가로·세로)이 다를 때만 다른 유형이다. 구조는 facts.rule 에 유형 이름으로 적어 검사가 가르게 한다.
//      덧셈: (몇십몇)+(몇), (몇)+(몇십몇), (몇십)+(몇십), (몇십몇)+(몇십), (몇십몇)+(몇십몇)
//      뺄셈: (몇십몇)−(몇), 차가 몇십인 (몇십몇)−(몇), (몇십)−(몇십), (몇십몇)−(몇십), (몇십몇)−(몇십몇), 차가 몇십인 것, 차가 몇인 것
//  - 풀이는 「10개씩 묶음끼리, 낱개끼리」로 적는다. 자리 이름(일의 자리·십의 자리)과 받아올림이라는 말은 2학년에서 배우므로 아이에게 보이는 글에 쓰지 않는다.
//  - 답은 숫자만 받는다. 비교 기호와 이름은 고르기로 받는다.
//
// 뺀 것과 까닭(꼴 번호)
//  - 두 자리 수로 이어지는 세 수의 계산·두 번 계산하는 문장제(2-1-3): ①47의 「마지막 수만 묻기」, ①70, ①71, ①72, 심7의 「마지막 수만 묻기」, 심35, 심44
//  - □를 거꾸로 풀어야 하는 것·어떤 수(2-1-3, 직관적으로 구해지지 않는다): ①73, ①74, ①75, 심45, 심46
//  - 조건 풀이·경우 따지기가 어려움의 대부분인 것: ①59(규칙 찾기), ①76, 심9(기호 식 셋), 심29(차가 정해진 짝), 심30(규칙 찾기), 심47
//  - 뜻 없는 셈(두 계산 결과끼리 다시 빼기, 가려진 숫자끼리 더하기): ①39, ①46의 「차 둘의 차」, 심32의 「㉠+㉡」
//  - 열린 답·식 쓰기·문제 만들기·색칠: ①40, ①53, ①54, ①63, 심22·심23의 색칠(개수 묻기로 바꿔 실음), 심28
//  - 만들 수 있는 식에 받아내림이 생기는 것: ①55(숫자 카드 8, 7, 4 → 84 − 7)
//  - 이미 실은 유형과 하는 일이 같은 것(상황·그림만 다름): ①38·심21(짝 짓기와 같음), 심13, 심19, 심37, 심38
// 묻는 말: 값을 물을 때는 「~은?/~는?」, 양을 물을 때는 「몇 ~인가?」, 시키는 말은 「~하시오.」. 문장은 짧게, 한 문장에 한 가지만 적는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, LABELS, box, expr, column, chars, blocks, lines, tagged, N, M, C, E, result, shown } = B.kit;
  const UNIT = '1-2-6', CALC = '2수01-06', MEAN = '2수01-05';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});

  // ── 수 고르기 ────────────────────────────────────────────────
  const tens = (n) => Math.floor(n / 10), ones = (n) => n % 10;
  // 받아올림이 없는 덧셈(합 99 이하), 받아내림이 없는 뺄셈
  const noCarry = (a, b) => ones(a) + ones(b) <= 9 && tens(a) + tens(b) <= 9;
  const noBorrow = (a, b) => a >= b && ones(a) >= ones(b);
  // 합이 max 이하인 두 숫자(각각 1 이상)
  const two = (d, max) => { const x = d.int(1, max - 1); return [x, d.int(1, max - x)]; };
  const ADD = {
    a: (d) => { const [p, q] = two(d, 9); return [d.int(1, 9) * 10 + p, q]; },                                 // (몇십몇)+(몇)
    r: (d) => { const [p, q] = two(d, 9); return [p, d.int(1, 9) * 10 + q]; },                                 // (몇)+(몇십몇)
    t: (d) => { const [p, q] = two(d, 9); return [p * 10, q * 10]; },                                           // (몇십)+(몇십)
    m: (d) => { const [p, q] = two(d, 9); return [p * 10 + d.int(1, 9), q * 10]; },                             // (몇십몇)+(몇십)
    f: (d) => d.until(() => { const [p, q] = two(d, 9), [x, y] = two(d, 9); return [p * 10 + x, q * 10 + y]; }, ([a, b]) => a !== b)   // (몇십몇)+(몇십몇)
  };
  const SUB = {
    a: (d) => { const o = d.int(2, 9); return [d.int(1, 9) * 10 + o, d.int(1, o - 1)]; },                      // (몇십몇)−(몇)
    z: (d) => { const o = d.int(1, 9); return [d.int(1, 9) * 10 + o, o]; },                                    // (몇십몇)−(몇)=(몇십)
    t: (d) => { const p = d.int(2, 9); return [p * 10, d.int(1, p - 1) * 10]; },                               // (몇십)−(몇십)
    m: (d) => { const p = d.int(2, 9); return [p * 10 + d.int(1, 9), d.int(1, p - 1) * 10]; },                 // (몇십몇)−(몇십)
    f: (d) => { const p = d.int(2, 9), o = d.int(2, 9); return [p * 10 + o, d.int(1, p - 1) * 10 + d.int(1, o - 1)]; },   // (몇십몇)−(몇십몇), 차도 몇십몇
    f0: (d) => { const p = d.int(2, 9), o = d.int(1, 9); return [p * 10 + o, d.int(1, p - 1) * 10 + o]; },     // 차가 몇십
    f1: (d) => { const p = d.int(1, 9), o = d.int(2, 9); return [p * 10 + o, p * 10 + d.int(1, o - 1)]; }      // 차가 몇
  };
  // 합이 v 인 덧셈식, 차가 v 인 뺄셈식(받아올림·받아내림 없음). ok 로 두 수의 꼴을 더 가린다.
  const addTo = (d, v, ok) => d.until(() => { const a = d.int(0, tens(v)) * 10 + d.int(0, ones(v)); return [a, v - a]; }, ([a, b]) => a >= 1 && b >= 1 && (!ok || ok(a, b)));
  const subTo = (d, v, ok) => d.until(() => { const b = d.int(0, 9 - tens(v)) * 10 + d.int(0, 9 - ones(v)); return [v + b, b]; }, ([a, b]) => b >= 1 && (!ok || ok(a, b)));
  const bothTwo = (a, b) => a >= 11 && b >= 11 && ones(b) >= 1;   // 두 수 모두 몇십몇
  const key = ([a, b]) => [a, b].sort((x, y) => x - y).join('+');

  // ── 풀이 글: 10개씩 묶음끼리, 낱개끼리 ───────────────────────
  function why(a, op, b) {
    const at = tens(a), ao = ones(a), bt = tens(b), bo = ones(b), verb = op === '+' ? '더하면' : '빼면', sg = op === '+' ? '+' : '−';
    const one = `낱개끼리 ${verb} ${ao} ${sg} ${bo} = ${result(ao, op, bo)}`, ten = `10개씩 묶음끼리 ${verb} ${at} ${sg} ${bt} = ${result(at, op, bt)}`;
    let how;
    if (at && bt) how = ao && bo ? `${one}, ${ten}이다.` : !ao && !bo ? `${ten}이다.` : `${ten}이고, 낱개는 ${ao || bo}개 그대로이다.`;
    else if (ao && bo) how = `${one}이고, 10개씩 묶음은 ${at || bt}개 그대로이다.`;
    else how = `10개씩 묶음 ${at || bt}개와 낱개 ${ao || bo}개이다.`;
    return how + ' ' + shown(a, op, b);
  }
  const listed = (rows) => rows.map(([a, op, b], i) => `${LABELS5[i]} ${shown(a, op, b)}`).join(', ');
  const LABELS5 = ['㉠', '㉡', '㉢', '㉣', '㉤'];
  const calcFacts = (a, op, b, rule) => ({ calc: [[E(a, op, b), 0]], rule });

  // ── 그림 ─────────────────────────────────────────────────────
  const fix = (v) => Math.round(v * 100) / 100;
  const TONES = [{ main: '#f5b942', pale: '#fdf3d8', line: '#a86a00', band: '#fff8e1', word: '노란색' }, { main: '#93c5fd', pale: '#eef5ff', line: '#1d4ed8', band: '#f1f7ff', word: '파란색' }];
  const bundleWords = (t, o) => [t ? `10개씩 묶음 ${t}개` : '', o ? `낱개 ${o}개` : ''].filter(Boolean).join('와 ');
  // 10개씩 묶은 물건 그림. groups: [{ n, tone(0 노란색 | 1 파란색), out(/표 하여 덜어 낸 수 — 묶음도 낱개도 뒤쪽부터) }]
  // 10개씩 묶음은 열 개를 한 줄로 세워 띠로 둘러 그리고, 낱개는 다섯 개씩 끊어 세운다.
  function bundles(groups, thing) {
    const R = 2.9, P = 6.6, TOP = 7, BW = 11, BP = 14.5, OP = 8.6, BOTTOM = TOP + P * 9 + R * 2;
    let x = 7, body = '';
    const said = [];
    const dot = (cx, cy, tone, gone) => `<circle cx="${fix(cx)}" cy="${fix(cy)}" r="${R}" style="fill:${gone ? tone.pale : tone.main};stroke:${tone.line};stroke-width:0.7${gone ? ';stroke-dasharray:1.6 1.2' : ''}"/>`;
    groups.forEach((g, gi) => {
      const tone = TONES[g.tone || 0], t = tens(g.n), o = ones(g.n), outT = tens(g.out || 0), outO = ones(g.out || 0);
      if (gi) x += 13;
      for (let i = 0; i < t; i += 1) {
        const gone = i >= t - outT;
        body += `<rect x="${fix(x)}" y="${fix(TOP - 2.6)}" width="${BW}" height="${fix(BOTTOM - TOP + 5.2)}" rx="5.5" style="fill:${gone ? '#fff' : tone.band};stroke:${tone.line};stroke-width:0.8${gone ? ';stroke-dasharray:2 1.5' : ''}"/>`;
        for (let k = 0; k < 10; k += 1) body += dot(x + BW / 2, TOP + R + k * P, tone, gone);
        if (gone) body += `<path class="mb-strike" d="M${fix(x - 1.5)} ${fix(BOTTOM + 3)}L${fix(x + BW + 1.5)} ${fix(TOP - 3)}"/>`;
        x += BP;
      }
      if (t && o) x += 2;
      for (let i = 0; i < o; i += 1) {
        const cx = x + R + 0.6 + Math.floor(i / 5) * OP, cy = TOP + R + (i % 5) * P, gone = i >= o - outO;
        body += dot(cx, cy, tone, gone) + (gone ? `<path class="mb-strike" d="M${fix(cx - 3.7)} ${fix(cy + 3.7)}L${fix(cx + 3.7)} ${fix(cy - 3.7)}"/>` : '');
      }
      x += o ? Math.ceil(o / 5) * OP : 0;
      said.push((groups.length > 1 ? tone.word + ' ' : '') + thing + ' ' + bundleWords(t, o) + (g.out ? ', 그 가운데 ' + bundleWords(outT, outO) + '에 /표' : ''));
    });
    const width = Math.max(x + 7, 46), height = BOTTOM + 7, scale = Math.min(1.7, 286 / width);
    return `<svg class="mb-dots" viewBox="0 0 ${fix(width)} ${fix(height)}" width="${Math.round(width * scale)}" role="img" aria-label="10개씩 묶어 놓은 그림: ${said.join(' / ')}">${body}</svg>`;
  }
  // 이어 세기: start 에서 1씩 k 번 뛰어 센다. 처음 두 수만 적고 마지막 수는 빈칸으로 둔다.
  function hops(start, k) {
    const u = 36, x = (i) => 24 + i * u, y = 40, width = 48 + k * u, word = 'style="font-size:13px;font-weight:700"';
    let out = `<line class="mb-axis" x1="${x(0) - 12}" y1="${y}" x2="${x(k) + 12}" y2="${y}"/>`;
    for (let i = 0; i <= k; i += 1) out += `<line class="mb-axis" x1="${x(i)}" y1="${y - 5}" x2="${x(i)}" y2="${y + 5}"/>`;
    for (let i = 0; i < k; i += 1) out += `<path class="mb-jump" d="M${x(i)} ${y - 7}Q${x(i) + u / 2} ${y - 32} ${x(i + 1)} ${y - 7}"/>`;
    out += `<text class="mb-axis-label" ${word} x="${x(0)}" y="${y + 22}" text-anchor="middle">${start}</text><text class="mb-axis-label" ${word} x="${x(1)}" y="${y + 22}" text-anchor="middle">${start + 1}</text>`;
    out += `<rect x="${x(k) - 11}" y="${y + 9}" width="22" height="18" rx="2.5" style="fill:#fff;stroke:#1f2933;stroke-width:1.5"/>`;
    return `<svg class="mb-numberline" viewBox="0 0 ${width} 74" width="${Math.round(width * 1.2)}" role="img" aria-label="이어 세기: ${start}에서 1씩 ${k}번 뛰어 센다. 마지막 수는 빈칸">${out}</svg>`;
  }
  // 두 계산 결과의 크기 비교(○ 안에 >, =, <)
  const versus = (left, right) => `<div class="mb-versus">${left}<span class="mb-ring"></span>${right}</div>`;
  const SIGNS = ['&gt;', '=', '&lt;'];
  const signOf = (x, y) => (x > y ? 0 : x === y ? 1 : 2);
  // 이름표를 단 세로셈 여럿
  const tiles = (list) => '<div class="mb-tiles">' + list.map(([label, html]) => `<figure class="mb-tile"><figcaption>${label}</figcaption>${html}</figure>`).join('') + '</div>';
  const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  const PAIRS4 = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];

  // b 파일이 함께 쓰는 도구
  B.kit.g126 = { UNIT, CALC, MEAN, T, tens, ones, noCarry, noBorrow, two, ADD, SUB, addTo, subTo, bothTwo, key, why, listed, LABELS5, calcFacts, fix, TONES, bundles, bundleWords, versus, SIGNS, signOf, tiles, ORDERS, PAIRS4 };

  // ── 식만 주는 계산: 구조와 꼴(가로·세로)마다 하나 ─────────────
  const rowType = (id, title, ref, op, kind) => T(id, title, ref, (d) => {
    const [a, b] = (op === '+' ? ADD : SUB)[kind](d);
    return N('다음을 계산하시오.', result(a, op, b), { figure: expr(a, op, b, '=', box()), explain: why(a, op, b), facts: calcFacts(a, op, b, id) });
  });
  const colType = (id, title, ref, op, kind) => T(id, title, ref, (d) => {
    const [a, b] = (op === '+' ? ADD : SUB)[kind](d);
    return N('다음을 계산하시오.', result(a, op, b), { figure: column(chars(a), op, chars(b)), explain: why(a, op, b), facts: calcFacts(a, op, b, id) });
  });
  // 10개씩 묶음끼리, 낱개끼리 계산하는 과정의 빈칸
  const splitType = (id, title, ref, op) => T(id, title, ref, (d) => {
    const [a, b] = op === '+' ? ADD.f(d) : SUB.f(d), s = op === '+' ? '+' : '−';
    const tag = (word) => `<span class="mb-tag">${word}</span>`;
    return M(`${a} ${s} ${josa(b, '을/를')} 계산한다. ㉠, ㉡, ㉢에 알맞은 수는?`, [{ label: LABELS[0], answer: result(ones(a), op, ones(b)) }, { label: LABELS[1], answer: result(tens(a), op, tens(b)) }, { label: LABELS[2], answer: result(a, op, b) }], {
      figure: lines([tag('낱개끼리') + expr(ones(a), op, ones(b), '=', box(LABELS[0])), tag('10개씩 묶음끼리') + expr(tens(a), op, tens(b), '=', box(LABELS[1])), expr(a, op, b, '=', box(LABELS[2]))]),
      explain: why(a, op, b),
      facts: { calc: [[E(ones(a), op, ones(b)), 0], [E(tens(a), op, tens(b)), 1], [E(a, op, b), 2]] }
    });
  });

  B.addUnit({
    id: '1-2-6', grade: 1, semester: 2, no: 6, title: '덧셈과 뺄셈(3)', version: 1,
    groups: [
      {
        id: 'add', title: '덧셈', standard: CALC,
        types: [
          rowType('add-a-row', '(몇십몇)+(몇) 가로셈', '①1 심1', '+', 'a'),
          colType('add-a-col', '(몇십몇)+(몇) 세로셈', '①2', '+', 'a'),
          colType('add-r-col', '(몇)+(몇십몇) 세로셈', '①3 심2', '+', 'r'),
          rowType('add-t-row', '(몇십)+(몇십) 가로셈', '①4', '+', 't'),
          colType('add-t-col', '(몇십)+(몇십) 세로셈', '①5', '+', 't'),
          rowType('add-m-row', '(몇십몇)+(몇십) 가로셈', '①6', '+', 'm'),
          colType('add-m-col', '(몇십몇)+(몇십) 세로셈', '①7 심1', '+', 'm'),
          rowType('add-f-row', '(몇십몇)+(몇십몇) 가로셈', '①8 심1 심13', '+', 'f'),
          colType('add-f-col', '(몇십몇)+(몇십몇) 세로셈', '①9 심1', '+', 'f'),
          splitType('add-split', '10개씩 묶음끼리, 낱개끼리 더하기', '①9', '+'),
          T('add-say', '몇만큼 더 큰 수', '①52', (d) => {
            const [a, b] = ADD.f(d);
            return N(`${a}보다 ${b}만큼 더 큰 수는?`, a + b, { explain: why(a, '+', b), facts: calcFacts(a, '+', b, 'add-say') });
          })
        ]
      },
      {
        id: 'sub', title: '뺄셈', standard: CALC,
        types: [
          rowType('sub-a-row', '(몇십몇)−(몇) 가로셈', '①10 심3', '-', 'a'),
          colType('sub-a-col', '(몇십몇)−(몇) 세로셈', '①11', '-', 'a'),
          rowType('sub-z-row', '차가 몇십인 (몇십몇)−(몇)', '①12', '-', 'z'),
          rowType('sub-t-row', '(몇십)−(몇십) 가로셈', '①13 ①40', '-', 't'),
          colType('sub-t-col', '(몇십)−(몇십) 세로셈', '①14', '-', 't'),
          rowType('sub-m-row', '(몇십몇)−(몇십) 가로셈', '①15 심3', '-', 'm'),
          colType('sub-m-col', '(몇십몇)−(몇십) 세로셈', '①16 심3', '-', 'm'),
          rowType('sub-f-row', '(몇십몇)−(몇십몇) 가로셈', '①17 심3', '-', 'f'),
          colType('sub-f-col', '(몇십몇)−(몇십몇) 세로셈', '①18 심3', '-', 'f'),
          colType('sub-f0-col', '차가 몇십인 (몇십몇)−(몇십몇)', '①18', '-', 'f0'),
          rowType('sub-f1-row', '차가 몇인 (몇십몇)−(몇십몇)', '①18', '-', 'f1'),
          splitType('sub-split', '10개씩 묶음끼리, 낱개끼리 빼기', '①18', '-'),
          T('sub-say', '몇만큼 더 작은 수', '①52', (d) => {
            const [a, b] = SUB.f(d);
            return N(`${a}보다 ${b}만큼 더 작은 수는?`, a - b, { explain: why(a, '-', b), facts: calcFacts(a, '-', b, 'sub-say') });
          })
        ]
      },
      {
        id: 'pic', title: '그림을 보고 계산하기', standard: CALC,
        types: [
          T('pic-hop', '이어 세어 더하기', '①19 심10', (d) => {
            const a = d.int(2, 8) * 10 + d.int(1, 5), k = d.int(3, Math.min(5, 9 - ones(a)));
            const said = Array.from({ length: k }, (_, i) => a + 1 + i).join(', ');
            return N('이어 세기로 덧셈을 하시오.', a + k, { figure: hops(a, k) + expr(a, '+', k, '=', box()), explain: `${a}에서 ${k}만큼 이어 세면 ${said}이다. ` + shown(a, '+', k), facts: calcFacts(a, '+', k, 'pic-hop') });
          }),
          T('pic-bundle-add', '10개씩 묶음과 낱개 그림을 보고 더하기', '①20', (d) => {
            // (몇십)+(몇): 노란색 구슬 20개와 파란색 구슬 8개
            const a = d.int(2, 6) * 10, b = d.int(2, 9);
            return N('그림을 보고 덧셈을 하시오.', a + b, { figure: bundles([{ n: a }, { n: b, tone: 1 }], '구슬') + expr(a, '+', b, '=', box()), explain: why(a, '+', b), facts: calcFacts(a, '+', b, 'pic-bundle-add') });
          }),
          T('pic-bundle-fill', '그림에서 더하는 수를 읽어 덧셈식 채우기', '①21', (d) => {
            // (몇십)+(몇십): 20 + ㉠ = ㉡
            const [p, q] = two(d, 8), a = p * 10, b = q * 10;
            return M('노란색 구슬과 파란색 구슬은 모두 몇 개인지 덧셈식으로 나타내었다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: b }, { label: LABELS[1], answer: a + b }], {
              figure: bundles([{ n: a }, { n: b, tone: 1 }], '구슬') + expr(a, '+', box(LABELS[0]), '=', box(LABELS[1])),
              explain: `파란색 구슬은 10개씩 묶음 ${q}개이므로 ${b}개이다. ` + why(a, '+', b),
              facts: { calc: [[`${q}*10`, 0], [`${a}+${q}*10`, 1]] }
            });
          }),
          T('pic-blocks-add', '수 모형을 보고 더하기', '①20 심11', (d) => {
            const [a, b] = ADD.f(d);
            return N('수 모형을 보고 덧셈을 하시오.', a + b, { figure: blocks(a) + blocks(b) + expr(a, '+', b, '=', box()), explain: why(a, '+', b), facts: calcFacts(a, '+', b, 'pic-blocks-add') });
          }),
          T('pic-blocks-read', '수 모형에서 두 수를 읽어 덧셈식 만들기', '①22', (d) => {
            const [a, b] = ADD.f(d);
            return M('수 모형이 나타내는 두 수를 더한다. ㉠, ㉡, ㉢에 알맞은 수는?', [{ label: LABELS[0], answer: a }, { label: LABELS[1], answer: b }, { label: LABELS[2], answer: a + b }], {
              figure: blocks(a, LABELS[0]) + blocks(b, LABELS[1]) + expr(box(LABELS[0]), '+', box(LABELS[1]), '=', box(LABELS[2])),
              explain: `㉠은 10개씩 묶음 ${tens(a)}개와 낱개 ${ones(a)}개이므로 ${a}, ㉡은 10개씩 묶음 ${tens(b)}개와 낱개 ${ones(b)}개이므로 ${b}이다. ` + shown(a, '+', b),
              facts: { calc: [[`${tens(a)}*10+${ones(a)}`, 0], [`${tens(b)}*10+${ones(b)}`, 1], [`${tens(a)}*10+${ones(a)}+${tens(b)}*10+${ones(b)}`, 2]], unseen: [10] }
            });
          }),
          T('pic-out-sub', '덜어 낸 수 모형을 보고 빼기', '①23', (d) => {
            const [a, b] = SUB.a(d);
            return N('수 모형에서 /표 한 만큼 덜어 내었다. 뺄셈을 하시오.', a - b, { figure: blocks(a, '', b) + expr(a, '-', b, '=', box()), explain: why(a, '-', b), facts: calcFacts(a, '-', b, 'pic-out-sub') });
          }),
          T('pic-out-fill', '그림에서 빼는 수를 읽어 뺄셈식 채우기', '①24 심12', (d) => {
            // (몇십몇)−(몇십몇): 37 − ㉠ = ㉡
            const p = d.int(2, 6), o = d.int(2, 9), a = p * 10 + o, bt = d.int(1, p - 1), bo = d.int(1, o - 1), b = bt * 10 + bo;
            return M('구슬에서 /표 한 만큼 덜어 내었다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: b }, { label: LABELS[1], answer: a - b }], {
              figure: bundles([{ n: a, out: b }], '구슬') + expr(a, '-', box(LABELS[0]), '=', box(LABELS[1])),
              explain: `/표 한 구슬은 10개씩 묶음 ${bt}개와 낱개 ${bo}개이므로 ${b}개이다. ` + why(a, '-', b),
              facts: { calc: [[`${bt}*10+${bo}`, 0], [`${a}-${bt}*10-${bo}`, 1]] }
            });
          }),
          T('pic-out-read', '그림에서 수를 모두 읽어 뺄셈식 만들기', '①25 심12', (d) => {
            const [a, b] = SUB.m(d);
            return M('수 모형에서 /표 한 만큼 덜어 내었다. 뺄셈식으로 나타낼 때 ㉠, ㉡, ㉢에 알맞은 수는?', [{ label: LABELS[0], answer: a }, { label: LABELS[1], answer: b }, { label: LABELS[2], answer: a - b }], {
              figure: blocks(a, '', b) + expr(box(LABELS[0]), '-', box(LABELS[1]), '=', box(LABELS[2])),
              explain: `수 모형은 모두 ${a}이고, /표 한 것은 10개씩 묶음 ${tens(b)}개이므로 ${b}이다. ` + shown(a, '-', b),
              facts: { calc: [[`${tens(a)}*10+${ones(a)}`, 0], [`${tens(b)}*10`, 1], [`${tens(a)}*10+${ones(a)}-${tens(b)}*10`, 2]], unseen: [10] }
            });
          }),
          T('pic-out-pick', '그림에 알맞은 뺄셈식 고르기', '①26', (d) => {
            // 구슬 28개 가운데 낱개 2개를 덜어 냄: 28 − 2 = 26 이 맞고, 2를 10개씩 묶음에서 뺀 8, 두 곳에서 다 뺀 6 은 틀리다.
            const b = d.int(1, 3), at = d.int(b, 6), ao = d.int(b + 1, 9), a = at * 10 + ao;
            const said = d.shuffle([a - b, (at - b) * 10 + ao, (at - b) * 10 + ao - b]);
            return C('구슬에서 /표 한 만큼 덜어 내었다. 그림에 알맞은 뺄셈식은?', said.map((v) => expr(a, '-', b, '=', v)), said.indexOf(a - b), {
              figure: bundles([{ n: a, out: b }], '구슬'),
              explain: `구슬 ${a}개에서 낱개 ${b}개를 덜어 내었다. ` + why(a, '-', b),
              facts: { claimed: said.map((v) => [E(a, '-', b), v]), claimedWant: true }
            });
          })
        ]
      },
      {
        id: 'cmp', title: '계산 결과 비교하기', standard: CALC,
        types: [
          T('cmp-match', '식과 계산 결과 짝 짓기', '①27 ①38 심16 심21', (d) => {
            // 계산 결과 셋이 같은 몇십대에 모여 있어 낱개까지 계산해야 가릴 수 있다.
            const base = d.int(2, 5) * 10 + d.int(1, 3), values = d.shuffle([0, 1, 2, 3, 4, 5]).slice(0, 3).map((k) => base + k);
            const pairs = values.map((v) => subTo(d, v, bothTwo));
            const list = d.shuffle(d.shuffle(ORDERS.slice(1)).slice(0, 3).concat([ORDERS[0]]));
            return C('식과 계산 결과를 알맞게 짝 지은 것은?', list.map((o) => o.map((k, i) => `${LABELS[i]} ${values[k]}`).join(', ')), list.findIndex((o) => o.join() === '0,1,2'), {
              figure: tagged(pairs.map(([x, y]) => expr(x, '-', y))), explain: listed(pairs.map(([x, y]) => [x, '-', y])),
              facts: { match: { exprs: pairs.map(([x, y]) => E(x, '-', y)), options: list.map((o) => o.map((k) => values[k])) } }
            });
          }),
          T('cmp-same-sum', '합이 같은 두 식', '①28 심15', (d) => {
            const rows = d.until(() => {
              const v = d.int(4, 8) * 10 + d.int(2, 8), near = () => addTo(d, v + d.pick([-11, -10, -2, -1, 1, 2, 10, 11]));
              return d.shuffle([addTo(d, v), addTo(d, v), near(), near()]);
            }, (list) => new Set(list.map(([x, y]) => x + y)).size === 3 && new Set(list.map(key)).size === 4);
            return sameItem(d, '합이 같은 두 식은?', rows.map(([x, y]) => [x, '+', y]));
          }),
          T('cmp-same-diff', '차가 같은 두 식', '①28', (d) => {
            const rows = d.until(() => {
              const v = d.int(2, 6) * 10 + d.int(2, 6), near = () => subTo(d, v + d.pick([-11, -10, -2, -1, 1, 2, 10, 11]), bothTwo);
              return d.shuffle([subTo(d, v, bothTwo), subTo(d, v, bothTwo), near(), near()]);
            }, (list) => new Set(list.map(([x, y]) => x - y)).size === 3 && new Set(list.map(([x]) => x)).size === 4);
            return sameItem(d, '차가 같은 두 식은?', rows.map(([x, y]) => [x, '-', y]));
          }),
          T('cmp-same-mix', '덧셈식과 뺄셈식에서 계산 결과가 같은 것', '①29', (d) => {
            const rows = d.until(() => {
              const v = d.int(3, 6) * 10 + d.int(2, 7), w = () => v + d.pick([-11, -10, -1, 1, 10, 11]);
              return d.shuffle([[...addTo(d, v, bothTwo), '+'], [...subTo(d, v, bothTwo), '-'], [...addTo(d, w(), bothTwo), '+'], [...subTo(d, w(), bothTwo), '-']]);
            }, (list) => new Set(list.map(([x, y, op]) => result(x, op, y))).size === 3);
            return sameItem(d, '계산 결과가 같은 두 식은?', rows.map(([x, y, op]) => [x, op, y]));
          }),
          T('cmp-equal', '주어진 식과 합이 같은 식', '①30', (d) => {
            const [a, b] = d.until(() => ADD.m(d), ([x, y]) => tens(x + y) >= 3 && tens(x + y) <= 8 && ones(x + y) <= 8);
            const v = a + b, right = d.until(() => addTo(d, v), (p) => key(p) !== key([a, b]));
            const wrong = d.shuffle([-10, -1, 1, 10]).slice(0, 3).map((k) => addTo(d, v + k));
            const list = d.shuffle([right].concat(wrong));
            return C(`${a} + ${josa(b, '과/와')} 합이 같은 것은?`, list.map(([x, y]) => expr(x, '+', y)), list.indexOf(right), {
              explain: `${shown(a, '+', b)}이다. ${shown(right[0], '+', right[1])}`,
              facts: { choose: { exprs: list.map(([x, y]) => E(x, '+', y)), rule: 'equals', target: v } }
            });
          }),
          T('cmp-count', '계산 결과가 정해진 수인 식의 개수', '심22 심23', (d) => {
            // 덧셈식과 뺄셈식 다섯 가운데 계산 결과가 25 인 것
            const v = d.int(2, 6) * 10 + d.int(2, 7), hit = d.int(2, 3);
            const rows = d.until(() => d.shuffle(Array.from({ length: 5 }, (_, i) => {
              const w = i < hit ? v : v + d.pick([-11, -10, -1, 1, 10, 11]), plus = d.bool();
              return plus ? [...addTo(d, w), '+'] : [...subTo(d, w), '-'];
            })), (list) => new Set(list.map(([x, y, op]) => x + op + y)).size === 5 && list.some(([, , op]) => op === '+') && list.some(([, , op]) => op === '-'));
            const values = rows.map(([x, y, op]) => result(x, op, y));
            return N(`계산 결과가 ${v}인 식은 모두 몇 개인가?`, hit, {
              unit: '개', figure: tagged(rows.map(([x, y, op]) => expr(x, op, y)), LABELS5), explain: listed(rows.map(([x, y, op]) => [x, op, y])),
              facts: { tallyOf: { list: values, target: v }, exprs: rows.map(([x, y, op]) => E(x, op, y)) }
            });
          }),
          T('cmp-max', '계산 결과가 가장 큰 식', '①31 심17', (d) => {
            const w = d.int(3, 6) * 10 + d.int(3, 6), values = d.shuffle([-12, -11, -10, -2, -1, 0, 1, 2, 10, 11, 12]).slice(0, 4).map((k) => w + k);
            const rows = d.until(() => values.map((v) => subTo(d, v, bothTwo)), (list) => new Set(list.map(([x]) => x)).size === 4);
            return C('계산 결과가 가장 큰 것은?', LABELS.slice(0, 4), values.indexOf(Math.max(...values)), {
              figure: tagged(rows.map(([x, y]) => expr(x, '-', y))), explain: listed(rows.map(([x, y]) => [x, '-', y])),
              facts: { choose: { exprs: rows.map(([x, y]) => E(x, '-', y)), rule: 'max' } }
            });
          }),
          T('cmp-min', '덧셈식과 뺄셈식에서 계산 결과가 가장 작은 식', '①31 심17', (d) => {
            const w = d.int(3, 6) * 10 + d.int(3, 6), values = d.shuffle([-12, -11, -10, -2, -1, 0, 1, 2, 10, 11, 12]).slice(0, 4).map((k) => w + k);
            const ops = d.shuffle(['+', '+', '-', '-']);
            const rows = values.map((v, i) => (ops[i] === '+' ? [...addTo(d, v), '+'] : [...subTo(d, v), '-']));
            return C('계산 결과가 가장 작은 것은?', LABELS.slice(0, 4), values.indexOf(Math.min(...values)), {
              figure: tagged(rows.map(([x, y, op]) => expr(x, op, y))), explain: listed(rows.map(([x, y, op]) => [x, op, y])),
              facts: { choose: { exprs: rows.map(([x, y, op]) => E(x, op, y)), rule: 'min' } }
            });
          }),
          T('cmp-minuend', '같은 수에서 뺀 식의 계산 결과 비교', '①31', (d) => {
            // 75 − 33, 75 − 13, 75 − 23: 빼는 수가 작을수록 차가 크다.
            const at = d.int(4, 9), ao = d.int(2, 9), a = at * 10 + ao, bo = d.int(1, ao);
            const list = d.shuffle(d.shuffle(Array.from({ length: at - 1 }, (_, i) => i + 1)).slice(0, 3)).map((t) => t * 10 + bo);
            const values = list.map((b) => a - b);
            return C('계산 결과가 가장 큰 것은?', LABELS.slice(0, 3), values.indexOf(Math.max(...values)), {
              figure: tagged(list.map((b) => expr(a, '-', b))), explain: listed(list.map((b) => [a, '-', b])) + '이다. 같은 수에서 뺄 때는 빼는 수가 작을수록 차가 크다.',
              facts: { choose: { exprs: list.map((b) => E(a, '-', b)), rule: 'max' }, rule: 'cmp-minuend' }
            });
          }),
          T('cmp-gap', '두 수의 차가 가장 작은 것', '①31', (d) => {
            const w = d.int(2, 4) * 10 + d.int(2, 5), values = d.shuffle([-11, -10, -1, 0, 1, 10, 11]).slice(0, 3).map((k) => w + k);
            const rows = d.until(() => values.map((v) => d.shuffle(subTo(d, v, bothTwo))), (list) => new Set(list.map((p) => Math.max(...p))).size === 3);
            return C('두 수의 차가 가장 작은 것은?', LABELS.slice(0, 3), values.indexOf(Math.min(...values)), {
              figure: tagged(rows.map(([x, y]) => `${x}, ${y}`)), explain: '큰 수에서 작은 수를 뺀다. ' + listed(rows.map((p) => [Math.max(...p), '-', Math.min(...p)])),
              facts: { choose: { exprs: rows.map((p) => E(Math.max(...p), '-', Math.min(...p))), rule: 'min' } }
            });
          }),
          T('cmp-versus', '두 식의 계산 결과 비교', '①32 심19', (d) => {
            const v = d.int(3, 7) * 10 + d.int(2, 7), w = v + d.pick([-2, -1, 0, 1, 2, -10, 10]);
            const [a, b] = addTo(d, v, (x, y) => x >= 10 && y >= 10), [c, e] = subTo(d, w, (x, y) => y >= 10);
            return C('두 식의 계산 결과를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, signOf(v, w), {
              figure: versus(expr(a, '+', b), expr(c, '-', e)), explain: `${shown(a, '+', b)}, ${shown(c, '-', e)}이므로 ${v} ${SIGNS[signOf(v, w)]} ${w}이다.`,
              facts: { choose: { exprs: [E(a, '+', b), E(c, '-', e)], rule: 'compare' } }
            });
          }),
          T('cmp-order', '계산 결과가 큰 것부터 차례로', '①33 심18', (d) => {
            const w = d.int(3, 6) * 10 + d.int(3, 6), values = d.shuffle([-12, -11, -10, -2, -1, 0, 1, 2, 10, 11, 12]).slice(0, 3).map((k) => w + k);
            const ops = d.shuffle(['+', '-', d.pick(['+', '-'])]);
            const rows = values.map((v, i) => (ops[i] === '+' ? [...addTo(d, v, (x, y) => x >= 10 && y >= 10), '+'] : [...subTo(d, v, (x, y) => y >= 10), '-']));
            const right = [0, 1, 2].sort((p, q) => values[q] - values[p]);
            const list = d.shuffle(d.shuffle(ORDERS.filter((o) => o.join() !== right.join())).slice(0, 3).concat([right]));
            return C('계산 결과가 큰 것부터 차례로 쓴 것은?', list.map((o) => o.map((i) => LABELS[i]).join(', ')), list.findIndex((o) => o.join() === right.join()), {
              figure: tagged(rows.map(([x, y, op]) => expr(x, op, y))), explain: listed(rows.map(([x, y, op]) => [x, op, y])),
              facts: { choose: { exprs: rows.map(([x, y, op]) => E(x, op, y)), rule: 'descending', orders: list } }
            });
          }),
          T('cmp-odd', '계산 결과가 나머지와 다른 하나', '①34 심20', (d) => {
            const v = d.int(3, 6) * 10 + d.int(2, 7), bad = d.int(0, 3), ops = d.shuffle(['+', '-', '-', d.pick(['+', '-'])]);
            const rows = d.until(() => ops.map((op, i) => { const w = i === bad ? v + d.pick([-10, -1, 1, 10]) : v; return op === '+' ? [...addTo(d, w, (x, y) => x >= 10 && y >= 10), '+'] : [...subTo(d, w, bothTwo), '-']; }), (list) => new Set(list.map(([x, y, op]) => x + op + y)).size === 4);
            return C('계산 결과가 나머지와 다른 하나는?', LABELS.slice(0, 4), bad, {
              figure: tagged(rows.map(([x, y, op]) => expr(x, op, y))), explain: listed(rows.map(([x, y, op]) => [x, op, y])),
              facts: { choose: { exprs: rows.map(([x, y, op]) => E(x, op, y)), rule: 'odd' } }
            });
          }),
          T('cmp-right', '바르게 계산한 것 고르기', '①35', (d) => {
            // 덧셈식 넷 가운데 하나만 옳다. 틀린 값은 낱개나 10개씩 묶음을 하나 잘못 센 것이다.
            const rows = d.until(() => [ADD.f(d), ADD.f(d), ADD.f(d), ADD.f(d)], (list) => new Set(list.map(key)).size === 4 && list.every(([x, y]) => x + y >= 22 && x + y <= 88));
            const good = d.int(0, 3), slips = d.shuffle([-10, -1, 1, 10]);
            const said = rows.map(([x, y], i) => x + y + (i === good ? 0 : slips[i]));
            return C('바르게 계산한 것은?', LABELS.slice(0, 4), good, {
              figure: tagged(rows.map(([x, y], i) => expr(x, '+', y, '=', said[i]))), explain: listed(rows.map(([x, y]) => [x, '+', y])),
              facts: { claimed: rows.map(([x, y], i) => [E(x, '+', y), said[i]]), claimedWant: true }
            });
          }),
          T('cmp-wrong', '잘못 계산한 것 고르기', '①35', (d) => {
            // 틀린 값은 흔한 잘못에서 나온다: 24 + 40 = 28(몇십을 낱개에 더함), 34 + 5 = 84(몇을 10개씩 묶음에 더함), 60 − 50 = 1(0을 빠뜨림), 10개씩 묶음을 하나 덜 셈.
            const kinds = d.shuffle(['m', 'a', 't', 'f']), bad = d.int(0, 3);
            const make = {
              m: () => { const [a, b] = d.until(() => ADD.m(d), ([x, y]) => ones(x) + tens(y) <= 9); return [a, '+', b, tens(a) * 10 + ones(a) + tens(b)]; },
              a: () => { const [a, b] = d.until(() => ADD.a(d), ([x, y]) => tens(x) + y <= 9); return [a, '+', b, (tens(a) + b) * 10 + ones(a)]; },
              t: () => { const [a, b] = SUB.t(d); return [a, '-', b, tens(a) - tens(b)]; },
              f: () => { const [a, b] = SUB.f(d); return [a, '-', b, a - b >= 20 ? a - b - 10 : a - b + 10]; }
            };
            const rows = kinds.map((kind) => make[kind]());
            const said = rows.map(([a, op, b, slip], i) => (i === bad ? slip : result(a, op, b)));
            return C('잘못 계산한 것은?', LABELS.slice(0, 4), bad, {
              figure: tagged(rows.map(([a, op, b], i) => expr(a, op, b, '=', said[i]))),
              explain: `${LABELS[bad]}을 바르게 계산하면 ${shown(rows[bad][0], rows[bad][1], rows[bad][2])}이다.`,
              facts: { claimed: rows.map(([a, op, b], i) => [E(a, op, b), said[i]]), claimedWant: false }
            });
          }),
          T('cmp-fix', '잘못 계산한 세로셈 바로잡기', '①37', (d, n) => {
            if (n === 0) {
              // 34 + 5 를 84 로: 한 자리 수 5를 10개씩 묶음의 수 3 아래에 맞추어 썼다.
              const [a, b] = d.until(() => ADD.a(d), ([x, y]) => tens(x) + y <= 9), wrong = (tens(a) + b) * 10 + ones(a);
              return N(`${a} + ${josa(b, '을/를')} 다음과 같이 잘못 계산하였다. 바르게 계산한 값은?`, a + b, {
                figure: column(chars(a), '+', [String(b), ''], chars(wrong)),
                explain: `${josa(b, '은/는')} 낱개의 수이므로 낱개 ${josa(ones(a), '과/와')} 더해야 한다. ` + shown(a, '+', b),
                facts: { calc: [[E(a, '+', b), 0]], wrong }
              });
            }
            // 86 − 13 을 99 로: 빼야 하는데 더하였다.
            const [a, b] = d.until(() => SUB.f(d), ([x, y]) => noCarry(x, y));
            return N(`${a} − ${josa(b, '을/를')} 다음과 같이 잘못 계산하였다. 바르게 계산한 값은?`, a - b, {
              figure: column(chars(a), '-', chars(b), chars(a + b)),
              explain: `빼야 하는데 더하였다. ` + why(a, '-', b),
              facts: { calc: [[E(a, '-', b), 0]], wrong: a + b }
            });
          }, { count: 2 })
        ]
      }
    ]
  });

  // 계산 결과가 같은 두 식 찾기(식 넷 가운데 같은 것은 한 쌍뿐이다)
  function sameItem(d, text, rows) {
    const values = rows.map(([a, op, b]) => result(a, op, b));
    const right = [0, 1, 2, 3].filter((i) => values.filter((v) => v === values[i]).length === 2);
    const list = d.shuffle(d.shuffle(PAIRS4.filter((p) => p.join() !== right.join())).slice(0, 3).concat([right]));
    return C(text, list.map((p) => p.map((i) => LABELS[i]).join(', ')), list.findIndex((p) => p.join() === right.join()), {
      figure: tagged(rows.map(([a, op, b]) => expr(a, op, b))), explain: listed(rows),
      facts: { choose: { exprs: rows.map(([a, op, b]) => E(a, op, b)), rule: 'same', pairsShown: list } }
    });
  }
})(typeof window !== 'undefined' ? window : globalThis);
