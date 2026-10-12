// 1학년 2학기 2단원 덧셈과 뺄셈(1) — 단원 틀과 기본 문항(세 수의 덧셈, 세 수의 뺄셈, 10이 되는 더하기).
// 수집해 둔 교과서(국정 한 종) 평가 자료에서 뽑은 꼴 목록(기본꼴_1 68꼴, 심화꼴 54꼴)을 하나씩 문항으로 옮긴 것이다.
// 꼴(무엇을 주고 무엇을 묻는가)만 따르고 수와 상황은 새로 쓴다. 유형마다 꼴 번호를 적는다(①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번).
//
// 영역과 성취기준: 수와 연산.
//   [2수01-08] 세 수의 덧셈과 뺄셈 — 이 단원에서는 한 자리 수 세 개의 덧셈(합 9까지), 한 자리 수에서 두 번 빼기, 10을 만들어 더하기(답 11~19)
//   [2수01-06] 덧셈과 뺄셈의 계산 — 10이 되는 더하기, 10에서 빼기
//   [2수01-04] 수를 두 수로 가르고 모으기 — 10을 가르고 모으는 그림
//
// 싣는 기준
//  - 수의 범위를 지킨다. 세 수의 덧셈은 합이 9 이하, 세 수의 뺄셈은 한 자리 수(또는 10)에서 시작하고 차가 1 이상,
//    10을 만들어 더하기는 세 수 가운데 꼭 한 쌍의 합이 10이고 답이 11~19이다.
//    받아올림을 식 하나로 하는 (몇) + (몇) = (십몇)(1-2-4), 덧셈과 뺄셈이 한 식에 섞인 계산(2-1-3)은 문제에도 풀이에도 쓰지 않는다.
//  - 식만 주는 계산은 구조가 다를 때만 다른 유형이다: 세 수의 덧셈 / 세 수의 뺄셈 / 10에서 빼기 / 10을 만들어 더하기(앞의 두 수가 짝, 뒤의 두 수가 짝, 양 끝이 짝 — 양 끝은 실력).
//  - 답 칸에는 숫자만 받는다. 이름·기호를 쓰게 하던 꼴은 고르기로 바꾸었다. 잇기 꼴은 짝 고르기로 바꾸었다.
//  - 그림 속 수는 그림 설명(aria-label)에 적는다. 세는 물건은 다섯 개씩 끊어 줄을 맞춘다.
//
// 뺀 것과 까닭(꼴 번호)
//  - ①15 모양 속 규칙 찾기: 규칙을 스스로 찾는 일은 「변화와 관계」(1-2-5 규칙 찾기)의 일이다. 규칙을 알려 주면 ①5(세 수의 합)·①23(가장 큰 수에서 두 수 빼기)과 같은 문제다.
//  - ①34·심25 수 판에서 10이 되는 두 수를 모두 묶기: 빠짐없이 찾기가 어려움의 대부분(작도). 이웃한 짝 하나를 고르는 꼴로 바꿔 실었다(ten-board).
//  - ①40 □를 구한 뒤 그 수보다 몇 큰 수, ①61 식을 완성하고 남은 카드의 합, 심20·심28·심37 두 식의 값(□)을 더하기, 심53 기호 셋을 이어 풀기: 다른 꼴을 이어 붙였을 뿐인 뜻 없는 셈.
//  - ①50 10에서 빼는 뺄셈식 여러 개 만들기, ①59·①60의 「여러 가지로」 변형, 심51: 답이 여럿인 열린 물음. 한 수를 주면 make10-blank·make10-cards와 같다.
//  - ①68·심54 □가 든 부등식에 맞는 수 모두 찾기: 교육과정은 □가 든 식을 「직관적으로 구할 수 있는 수준」까지만 다룬다.
//  - 심11 세 가지를 합친 뒤 덜어 낸 수를 거꾸로 구하기: 덧셈 뒤에 뺄셈을 잇고 한 번 거꾸로 간다(섞인 계산은 2-1-3).
//  - 색칠하기·○ 더 그리기·/ 긋기(①25·①27·①31·①52·심23·심34의 변형): 손으로 그리는 활동. 고르거나 세는 꼴로 바꿀 수 있는 것은 바꿔 실었다.
//  - ①26의 「2 + 8 = □」처럼 합(10)만 묻는 변형: 묶음 이름이 답을 말한다. 합이 10이 아닌 식 찾기(ten-not)·세기(ten-count)가 같은 일을 한다.
// 묻는 말: 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」. 문장은 짧게, 한 문장에 한 가지만 적는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, nick, NAMES, LABELS, box, expr, lines, tagged, numbers, cards, table, N, M, C } = B.kit;
  const THREE = '2수01-08', TEN = '2수01-06', SPLIT = '2수01-04';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});

  // ── 수 고르기 ────────────────────────────────────────────────
  const sum = (xs) => xs.reduce((s, v) => s + v, 0);
  const key = (xs) => xs.slice().sort().join();
  const pairsOf = (list) => { const out = []; list.forEach((x, i) => list.forEach((y, j) => { if (i < j) out.push([x, y]); })); return out; };
  // 세 수 가운데 합이 10인 두 수의 자리
  const pairsIn = (xs) => [[0, 1], [1, 2], [0, 2]].filter(([i, j]) => xs[i] + xs[j] === 10);
  // 세 수의 덧셈(합 lo~hi, 9 이하). 세 수는 모두 1 이상이다.
  const add3 = (d, lo, hi) => d.until(() => [d.int(1, 6), d.int(1, 6), d.int(1, 6)], (xs) => sum(xs) >= lo && sum(xs) <= hi);
  // 세 수의 뺄셈: 5~9에서 두 번 빼고 1 이상 남는다.
  const sub3 = (d) => d.until(() => [d.int(5, 9), d.int(1, 6), d.int(1, 6)], ([a, b, c]) => a - b - c >= 1);
  // 10을 만들어 더하는 세 수. where: 'front'(앞의 두 수가 짝) | 'back'(뒤의 두 수가 짝) | 'ends'(양 끝이 짝). 짝은 꼭 한 쌍이다.
  const ten3 = (d, where) => d.until(() => { const a = d.int(1, 9), k = d.int(1, 9); return where === 'front' ? [a, 10 - a, k] : where === 'back' ? [k, a, 10 - a] : [a, k, 10 - a]; }, (xs) => pairsIn(xs).length === 1);
  const diff3 = (xs) => xs[0] - xs[1] - xs[2];
  const ex3 = (xs, op) => expr(xs[0], op, xs[1], op, xs[2]);
  const E3 = (xs, op) => xs.join(op);
  const said3 = (xs, op, value) => expr(xs[0], op, xs[1], op, xs[2], '=', value);
  // 풀이: 앞에서부터 차례로 두 번 계산한다(1학년 풀이에는 식 하나에 계산 하나만 적는다).
  const stepAdd = ([a, b, c]) => `${expr(a, '+', b, '=', a + b)}, ${expr(a + b, '+', c, '=', a + b + c)}`;
  const stepSub = ([a, b, c]) => `${expr(a, '-', b, '=', a - b)}, ${expr(a - b, '-', c, '=', a - b - c)}`;
  // 풀이: 합이 10인 두 수를 먼저 더하고 나머지 수를 더한다.
  const stepTen = (xs) => { const [i, j] = pairsIn(xs)[0], k = 3 - i - j; return `${expr(xs[i], '+', xs[j], '=', 10)}, ${k === 0 ? expr(xs[k], '+', 10, '=', 10 + xs[k]) : expr(10, '+', xs[k], '=', 10 + xs[k])}`; };
  const both = ([x, y]) => `${josa(x, '과/와')} ${y}`;
  const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  const orderChoice = (d, values, descending) => {
    const right = values.map((_, i) => i).sort((p, q) => (descending ? values[q] - values[p] : values[p] - values[q]));
    const list = d.shuffle(d.shuffle(ORDERS.filter((o) => o.join() !== right.join())).slice(0, 3).concat([right]));
    return { list, options: list.map((o) => o.map((i) => LABELS[i]).join(', ')), answer: list.findIndex((o) => o.join() === right.join()) };
  };
  const SIGNS = ['&gt;', '=', '&lt;'];
  const signOf = (x, y) => (x > y ? 0 : x === y ? 1 : 2);
  const versus = (left, right) => `<div class="mb-versus">${left}<span class="mb-ring"></span>${right}</div>`;
  const COMPARE = '계산 결과를 비교하여 ○ 안에 알맞은 것을 고르시오.';

  // ── 그림 ─────────────────────────────────────────────────────
  // 물건은 간단한 도형으로 그리고 무리는 색으로 가른다. 그림 속 수는 그림 설명에 적는다.
  const HUE = { red: ['#f87171', '#991b1b'], blue: ['#60a5fa', '#1e40af'], green: ['#4ade80', '#166534'], yellow: ['#fcd34d', '#92400e'] };
  const DARK = '#1f2933';
  const pic = (w, h, scale, label, body) => `<svg class="mb-dots" viewBox="0 0 ${w} ${h}" width="${Math.round(w * scale)}" role="img" aria-label="${label}">${body}</svg>`;
  const mark = (kind, x, y, r, hue, more) => {
    const st = `style="fill:${HUE[hue][0]};stroke:${HUE[hue][1]};stroke-width:1.2${more || ''}"`;
    if (kind === 'square') return `<rect x="${x - r}" y="${y - r}" width="${2 * r}" height="${2 * r}" rx="2" ${st}/>`;
    if (kind === 'triangle') return `<path d="M${x} ${y - r}L${x + r} ${y + r - 1}H${x - r}Z" ${st}/>`;
    return `<circle cx="${x}" cy="${y}" r="${r}" ${st}/>`;
  };
  // 다섯 개씩 끊어 놓는 줄의 자리
  const colX = (i) => 14 + i * 22 + (i >= 5 ? 8 : 0);
  // 줄마다 한 무리. rows: [개수, 색, 모양]
  function rowsOf(rows, label) {
    const most = Math.max(...rows.map(([n]) => n)), w = Math.max(colX(most - 1) + 14, 64), h = 28 + (rows.length - 1) * 26;
    return pic(w, h, 1.15, label, rows.map(([n, hue, kind], r) => Array.from({ length: n }, (_, i) => mark(kind || 'circle', colX(i), 14 + r * 26, 8, hue)).join('')).join(''));
  }
  // 한 줄에 색이 다른 무리를 이어 놓는다. parts: [개수, 색]
  function oneRow(parts, label) {
    const list = [].concat(...parts.map(([n, hue]) => Array.from({ length: n }, () => hue)));
    return pic(Math.max(colX(list.length - 1) + 14, 64), 28, 1.15, label, list.map((hue, i) => mark('circle', colX(i), 14, 8, hue)).join(''));
  }
  // 십 배열판(2줄 5칸). cells: 칸마다 색(빈칸은 ''), struck: /으로 지운 칸
  function frameBody(cells, struck) {
    const u = 28, at = (i) => [3 + (i % 5) * u + u / 2, 3 + Math.floor(i / 5) * u + u / 2], gone = struck || [];
    let out = '';
    for (let i = 0; i < 10; i += 1) out += `<rect x="${3 + (i % 5) * u}" y="${3 + Math.floor(i / 5) * u}" width="${u}" height="${u}" style="fill:#fff;stroke:${DARK};stroke-width:1.4"/>`;
    cells.forEach((hue, i) => { if (hue) out += mark('circle', at(i)[0], at(i)[1], 9.5, hue, gone.includes(i) ? ';opacity:0.5' : ''); });
    gone.forEach((i) => { out += `<path d="M${at(i)[0] - 11} ${at(i)[1] + 11}L${at(i)[0] + 11} ${at(i)[1] - 11}" style="stroke:#b42318;stroke-width:2.2;stroke-linecap:round;fill:none"/>`; });
    return out;
  }
  const tenFrame = (cells, label, struck) => pic(146, 62, 1.25, label, frameBody(cells, struck));
  // 가득 찬 십 배열판 옆에 낱개 extra 개
  function tenPlus(cells, extra, hue, label) {
    let out = frameBody(cells);
    for (let i = 0; i < extra; i += 1) out += mark('circle', 174 + (i % 5) * 22, 17 + Math.floor(i / 5) * 28, 9.5, hue);
    return pic(274, 62, 1, label, out);
  }
  // 한 줄로 놓인 구슬 n개 가운데 b개는 빨간 /, c개는 파란 ×로 지운다(두 번 덜어 내기).
  function strikeRow(n, b, c, label) {
    const x = (i) => 15 + i * 25 + (i >= 5 ? 8 : 0);
    let out = '';
    for (let i = 0; i < n; i += 1) {
      const gone = i >= n - b - c, second = i >= n - c;
      out += mark('circle', x(i), 16, 9.5, 'yellow', gone ? ';opacity:0.5' : '');
      if (gone && !second) out += `<path d="M${x(i) - 11} 27L${x(i) + 11} 5" style="stroke:#b42318;stroke-width:2.2;stroke-linecap:round;fill:none"/>`;
      if (second) out += `<path d="M${x(i) - 10} 6L${x(i) + 10} 26M${x(i) - 10} 26L${x(i) + 10} 6" style="stroke:#1d4ed8;stroke-width:2.2;stroke-linecap:round;fill:none"/>`;
    }
    return pic(x(n - 1) + 15, 32, 1.1, label, out);
  }
  // 주사위. tags 를 주면 주사위 위에 이름표(㉠, ㉡ …)를 적는다.
  const PIPS = { 1: [[1, 1]], 2: [[0, 0], [2, 2]], 3: [[0, 0], [1, 1], [2, 2]], 4: [[0, 0], [2, 0], [0, 2], [2, 2]], 5: [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]], 6: [[0, 0], [2, 0], [0, 1], [2, 1], [0, 2], [2, 2]] };
  function dice(values, label, tags) {
    const s = 40, gap = 16, top = tags ? 20 : 4;
    let out = '';
    values.forEach((v, k) => {
      const x0 = 4 + k * (s + gap);
      if (tags) out += `<text x="${x0 + s / 2}" y="14" text-anchor="middle" style="font-size:14px;font-weight:700;fill:${DARK}">${tags[k]}</text>`;
      out += `<rect x="${x0}" y="${top}" width="${s}" height="${s}" rx="7" style="fill:#fffdf5;stroke:${DARK};stroke-width:1.5"/>`;
      for (const [cx, cy] of PIPS[v]) out += `<circle cx="${x0 + 10 + cx * 10}" cy="${top + 10 + cy * 10}" r="3.6" style="fill:${DARK}"/>`;
    });
    return pic(8 + values.length * s + (values.length - 1) * gap, top + s + 4, 1.15, label, out);
  }
  // 가르기 그림: 위의 수를 아래 두 수로 가른다. 오른쪽 아래는 빈칸이다.
  function bond(top, left, label) {
    const ball = (x, y, v) => `<circle cx="${x}" cy="${y}" r="17" style="fill:#fffdf5;stroke:${DARK};stroke-width:1.5"/>` + (v === '' ? `<rect x="${x - 9}" y="${y - 9}" width="18" height="18" rx="3" style="fill:#fff;stroke:${DARK};stroke-width:1.6"/>` : `<text x="${x}" y="${y + 6}" text-anchor="middle" style="font-size:17px;font-weight:700;fill:${DARK}">${v}</text>`);
    return pic(124, 96, 1.2, label, `<path d="M62 22L28 74M62 22L96 74" style="stroke:${DARK};stroke-width:1.5;fill:none"/>` + ball(62, 22, top) + ball(28, 74, left) + ball(96, 74, ''));
  }
  // 수 판: 한 줄로 붙어 있는 칸에 수를 하나씩 적는다.
  function board(values, label) {
    const u = 40;
    return pic(values.length * u + 4, 40, 1.1, label, values.map((v, i) => `<rect x="${2 + i * u}" y="2" width="${u}" height="36" style="fill:#fffdf5;stroke:${DARK};stroke-width:1.4"/><text x="${2 + i * u + u / 2}" y="26" text-anchor="middle" style="font-size:17px;font-weight:700;fill:${DARK}">${v}</text>`).join(''));
  }
  // 화살표를 따라 계산하는 칸(한 자리 수라 칸을 좁게 잡는다). 조각은 수·box()·'+3'·'-2' 같은 글이다.
  const hop = (parts) => '<div class="mb-chain">' + parts.map((part) => (/^[+\-]/.test(String(part)) ? `<span class="mb-step" style="min-width:3.2em">${String(part).replace('-', '−')}</span>` : `<span class="mb-node" style="min-width:2.4em">${part}</span>`)).join('') + '</div>';

  // 같은 단원의 b 파일이 함께 쓴다.
  B.kit.g122 = { sum, key, pairsOf, pairsIn, add3, sub3, ten3, diff3, ex3, E3, said3, stepAdd, stepSub, stepTen, both, ORDERS, orderChoice, SIGNS, signOf, versus, COMPARE, rowsOf, oneRow, tenFrame, tenPlus, strikeRow, dice, bond, board, hop, THREE, TEN, SPLIT };

  B.addUnit({
    id: '1-2-2', grade: 1, semester: 2, no: 2, title: '덧셈과 뺄셈(1)', version: 1,
    groups: [
      {
        id: 'add3', title: '세 수의 덧셈', standard: THREE,
        types: [
          T('add3-row', '세 수의 덧셈', '①2', (d) => {
            const xs = add3(d, 6, 9);
            return N('다음을 계산하시오.', sum(xs), { figure: expr(xs[0], '+', xs[1], '+', xs[2], '=', box()), explain: stepAdd(xs), facts: { calc: [[E3(xs, '+'), 0]], rule: 'add3' } });
          }),
          T('add3-steps', '세 수의 덧셈의 계산 과정', '①1', (d) => {
            const [a, b, c] = add3(d, 6, 9);
            return M(`${a} + ${b} + ${josa(c, '을/를')} 앞에서부터 차례로 계산한다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: a + b }, { label: LABELS[1], answer: a + b + c }], {
              figure: lines([expr(a, '+', b, '=', box(LABELS[0])), expr(box(LABELS[0]), '+', c, '=', box(LABELS[1]))]),
              explain: `앞의 두 수를 먼저 더한다. ${stepAdd([a, b, c])}`,
              facts: { calc: [[`${a}+${b}`, 0], [`${a}+${b}+${c}`, 1]] }
            });
          }),
          T('add3-chain', '화살표를 따라 두 번 더하기', '①4', (d) => {
            const [a, b, c] = add3(d, 6, 9);
            return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: a + b }, { label: LABELS[1], answer: a + b + c }], {
              figure: hop([a, '+' + b, box(LABELS[0]), '+' + c, box(LABELS[1])]), explain: stepAdd([a, b, c]),
              facts: { calc: [[`${a}+${b}`, 0], [`${a}+${b}+${c}`, 1]] }
            });
          }),
          T('add3-pic', '그림을 보고 세 수의 덧셈식 만들기', '①3 심1', (d) => {
            const [a, b, c] = d.until(() => add3(d, 6, 9), (xs) => new Set(xs).size >= 2);
            return M('구슬은 모두 몇 개인지 덧셈식으로 나타내었다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: c }, { label: LABELS[1], answer: a + b + c }], {
              figure: rowsOf([[a, 'red'], [b, 'blue'], [c, 'green']], `구슬 세 줄: 빨간색 ${a}개, 파란색 ${b}개, 초록색 ${c}개`) + expr(a, '+', b, '+', box(LABELS[0]), '=', box(LABELS[1])),
              explain: `빨간색 ${a}개, 파란색 ${b}개, 초록색 ${c}개이다. ${stepAdd([a, b, c])}`,
              facts: { calc: [[String(c), 0], [`${a}+${b}+${c}`, 1]] }
            });
          }),
          T('add3-pic-expr', '그림에 알맞은 세 수의 덧셈식 고르기', '심2', (d) => {
            // 보기의 식은 값이 모두 같다. 줄마다 구슬을 세어 더하는 수를 하나하나 맞춰 보아야 한다.
            const { xs, wrong } = d.until(() => {
              const xs = add3(d, 7, 9), wrong = [];
              const moved = [[1, -1, 0], [-1, 1, 0], [0, 1, -1], [0, -1, 1], [1, 0, -1], [-1, 0, 1]].map((t) => xs.map((v, i) => v + t[i])).filter((v) => v.every((n) => n >= 1) && key(v) !== key(xs));
              for (const v of d.shuffle(moved)) if (!wrong.some((w) => key(w) === key(v))) wrong.push(v);
              return { xs, wrong };
            }, (v) => new Set(v.xs).size === 3 && v.wrong.length >= 3);
            const list = d.shuffle([xs].concat(wrong.slice(0, 3)));
            return C('줄마다 놓인 구슬의 수를 차례로 더한 식은?', list.map((v) => ex3(v, '+')), list.findIndex((v) => v.join() === xs.join()), {
              figure: rowsOf([[xs[0], 'red'], [xs[1], 'blue'], [xs[2], 'green']], `구슬 세 줄: 빨간색 ${xs[0]}개, 파란색 ${xs[1]}개, 초록색 ${xs[2]}개`),
              explain: `빨간색 ${xs[0]}개, 파란색 ${xs[1]}개, 초록색 ${xs[2]}개이다. 알맞은 식은 ${ex3(xs, '+')}이다. 값이 같아도 더하는 수가 그림과 다르면 알맞은 식이 아니다.`,
              facts: { truth: list.map((v) => v.join() === xs.join()), want: true }
            });
          }),
          T('add3-cards', '수 카드 세 장의 합', '①5 심3', (d) => {
            const xs = add3(d, 6, 9);
            return N('수 카드에 적힌 세 수의 합은?', sum(xs), { figure: cards(xs), explain: stepAdd(xs), facts: { calc: [[E3(xs, '+'), 0]] } });
          }),
          T('add3-match', '식과 계산 결과 짝 짓기', '①6', (d) => {
            const rows = d.until(() => [add3(d, 5, 9), add3(d, 5, 9), add3(d, 5, 9)], (list) => new Set(list.map(sum)).size === 3);
            const values = rows.map(sum), list = d.shuffle(d.shuffle(ORDERS.slice(1)).slice(0, 3).concat([ORDERS[0]]));
            return C('식과 계산 결과를 알맞게 짝 지은 것은?', list.map((o) => o.map((k, i) => `${LABELS[i]} ${values[k]}`).join(', ')), list.findIndex((o) => o.join() === '0,1,2'), {
              figure: tagged(rows.map((xs) => ex3(xs, '+'))), explain: rows.map((xs, i) => `${LABELS[i]} ${said3(xs, '+', sum(xs))}`).join(', '),
              facts: { match: { exprs: rows.map((xs) => E3(xs, '+')), options: list.map((o) => o.map((k) => values[k])) } }
            });
          }),
          T('add3-right', '바르게 계산한 덧셈식 고르기', '①7', (d) => {
            const rows = d.until(() => [0, 1, 2, 3].map(() => add3(d, 6, 9)), (list) => new Set(list.map((xs) => xs.join())).size === 4);
            const good = d.int(0, 3);
            // 틀린 값: 두 수만 더한 값, 하나 크거나 작은 값
            const told = rows.map((xs, i) => (i === good ? sum(xs) : d.pick([sum(xs) - 1, sum(xs) + 1, xs[0] + xs[1]].filter((v) => v <= 9 && v !== sum(xs)))));
            return C('바르게 계산한 것은?', LABELS.slice(0, 4), good, {
              figure: tagged(rows.map((xs, i) => said3(xs, '+', told[i]))), explain: rows.map((xs, i) => `${LABELS[i]} ${said3(xs, '+', sum(xs))}`).join(', '),
              facts: { claimed: rows.map((xs, i) => [E3(xs, '+'), told[i]]), claimedWant: true, rule: 'add3' }
            });
          }),
          T('add3-lone', '계산 결과가 다른 덧셈식 고르기', '①8 심5', (d) => {
            const v = d.int(7, 9), w = d.pick([v - 1, v + 1].filter((x) => x <= 9));
            const rows = d.until(() => d.shuffle([add3(d, v, v), add3(d, v, v), add3(d, v, v), add3(d, w, w)]), (list) => new Set(list.map(key)).size === 4);
            return C('계산 결과가 나머지와 다른 것은?', LABELS.slice(0, 4), rows.findIndex((xs) => sum(xs) === w), {
              figure: tagged(rows.map((xs) => ex3(xs, '+'))), explain: rows.map((xs, i) => `${LABELS[i]} ${said3(xs, '+', sum(xs))}`).join(', '),
              facts: { choose: { exprs: rows.map((xs) => E3(xs, '+')), rule: 'odd' } }
            });
          }),
          T('add3-max', '계산 결과가 가장 큰 덧셈식', '①9 심6', (d) => {
            // 가장 큰 수가 든 식이 가장 큰 식은 아니다.
            const rows = d.until(() => [add3(d, 6, 9), add3(d, 6, 9), add3(d, 6, 9)], (list) => {
              const s = list.map(sum), top = list.map((xs) => Math.max(...xs));
              return new Set(s).size === 3 && top[s.indexOf(Math.max(...s))] < Math.max(...top);
            });
            const values = rows.map(sum);
            return C('계산 결과가 가장 큰 것은?', LABELS.slice(0, 3), values.indexOf(Math.max(...values)), {
              figure: tagged(rows.map((xs) => ex3(xs, '+'))), explain: rows.map((xs, i) => `${LABELS[i]} ${said3(xs, '+', sum(xs))}`).join(', '),
              facts: { choose: { exprs: rows.map((xs) => E3(xs, '+')), rule: 'max' }, rule: 'add3' }
            });
          }),
          T('add3-order', '계산 결과가 작은 것부터 차례로', '①9 심6', (d) => {
            const rows = d.until(() => [add3(d, 5, 9), add3(d, 5, 9), add3(d, 5, 9)], (list) => new Set(list.map(sum)).size === 3);
            const pick = orderChoice(d, rows.map(sum), false);
            return C('계산 결과가 작은 것부터 차례로 쓴 것은?', pick.options, pick.answer, {
              figure: tagged(rows.map((xs) => ex3(xs, '+'))), explain: rows.map((xs, i) => `${LABELS[i]} ${said3(xs, '+', sum(xs))}`).join(', '),
              facts: { choose: { exprs: rows.map((xs) => E3(xs, '+')), rule: 'ascending', orders: pick.list } }
            });
          }),
          T('add3-blank', '세 수의 덧셈식에서 □ 구하기', '①10', (d) => {
            const [a, b, c] = add3(d, 7, 9), s = a + b + c;
            return N('□ 안에 알맞은 수는?', c, {
              figure: expr(a, '+', b, '+', box(), '=', s), explain: `${expr(a, '+', b, '=', a + b)}이다. ${expr(a + b, '+', c, '=', s)}이므로 □ 안에 알맞은 수는 ${c}이다.`,
              facts: { calc: [[`${s}-${a}-${b}`, 0]], rule: 'add3-blank' }
            });
          }),
          T('add3-pick2', '수 카드 두 장을 골라 덧셈식 완성하기', '①11 심7', (d) => {
            // 2 + □ + □ = 9: 합이 7인 두 장은 한 쌍뿐이다.
            const v = d.until(() => {
              const a = d.int(1, 3), s = d.int(8, 9), list = d.shuffle([1, 2, 3, 4, 5, 6, 7].filter((n) => n !== a)).slice(0, 4);
              return { a, s, list, all: pairsOf(list) };
            }, (o) => o.all.filter(([x, y]) => o.a + x + y === o.s).length === 1);
            const right = v.all.find(([x, y]) => v.a + x + y === v.s), need = v.s - v.a;
            const opts = d.shuffle(d.shuffle(v.all.filter((p) => p !== right)).slice(0, 3).concat([right]));
            return C('수 카드 두 장을 골라 □ 안에 넣으려고 한다. 알맞은 두 수는?', opts.map(([x, y]) => `${x}, ${y}`), opts.indexOf(right), {
              figure: cards(v.list) + expr(v.a, '+', box(), '+', box(), '=', v.s),
              explain: `${josa(v.a, '과/와')} 더하여 ${josa(v.s, '이/가')} 되는 수는 ${need}이다. 수 카드에서 합이 ${need}인 두 수는 ${both(right)}이다.`,
              facts: { choose: { exprs: opts.map(([x, y]) => `${v.a}+${x}+${y}`), rule: 'equals', target: v.s } }
            });
          }),
          T('add3-word', '문장제: 세 가지를 모두 합치기', '①12 심4', (d) => {
            const [a, b, c] = add3(d, 6, 9);
            return N(`빨간 색종이 ${a}장, 노란 색종이 ${b}장, 파란 색종이 ${c}장이 있다. 색종이는 모두 몇 장인가?`, a + b + c, { unit: '장', explain: stepAdd([a, b, c]), facts: { calc: [[`${a}+${b}+${c}`, 0]] } });
          }),
          T('add3-word-more', '문장제: 두 번 더 늘어나기', '①13', (d) => {
            const [a, b, c] = d.until(() => add3(d, 6, 9), (xs) => xs[1] !== xs[2]);
            return N(`놀이터에 어린이가 ${a}명 있다. ${b}명이 더 왔다. 조금 뒤에 ${c}명이 더 왔다. 놀이터에 있는 어린이는 모두 몇 명인가?`, a + b + c, { unit: '명', explain: stepAdd([a, b, c]), facts: { calc: [[`${a}+${b}+${c}`, 0]] } });
          }),
          T('add3-table', '세 번의 합이 더 큰 사람', '①14 심9', (d) => {
            // 가장 큰 수를 한 번 얻은 사람이 합은 더 작다.
            const [one, two] = d.shuffle(NAMES).slice(0, 2);
            const [xs, ys] = d.until(() => [add3(d, 5, 9), add3(d, 5, 9)], ([p, q]) => sum(p) !== sum(q) && Math.max(...p) !== Math.max(...q) && (Math.max(...p) > Math.max(...q)) !== (sum(p) > sum(q)));
            return C(`${name(one, '과/와')} ${name(two, '이/가')} 공을 세 번씩 던져 바구니에 넣은 수이다. 공을 더 많이 넣은 사람은?`, [one, two], sum(xs) > sum(ys) ? 0 : 1, {
              figure: table(['', '1회', '2회', '3회'], [[one].concat(xs.map((v) => v + '개')), [two].concat(ys.map((v) => v + '개'))]),
              explain: `${name(one, '은/는')} ${said3(xs, '+', sum(xs))}(개), ${name(two, '은/는')} ${said3(ys, '+', sum(ys))}(개)를 넣었다.`,
              facts: { choose: { exprs: [E3(xs, '+'), E3(ys, '+')], rule: 'max' } }
            });
          }),
          T('add3-odds', '홀수만 골라 더하기', '심8', (d) => {
            // 홀수는 1-2-1에서 배운다. 서로 다른 홀수 셋의 합이 9 이하인 것은 1, 3, 5뿐이다.
            const list = d.shuffle([1, 3, 5].concat(d.shuffle([2, 4, 6, 8]).slice(0, 2))), odds = list.filter((v) => v % 2 === 1);
            return N('홀수를 모두 골라 더한 값은?', sum(odds), { figure: numbers(list), explain: `홀수는 ${odds.join(', ')}이다. ${stepAdd(odds)}`, facts: { calc: [[E3(odds, '+'), 0]] } });
          })
        ]
      },
      {
        id: 'sub3', title: '세 수의 뺄셈', standard: THREE,
        types: [
          T('sub3-row', '세 수의 뺄셈', '①17', (d) => {
            const xs = sub3(d);
            return N('다음을 계산하시오.', diff3(xs), { figure: expr(xs[0], '-', xs[1], '-', xs[2], '=', box()), explain: stepSub(xs), facts: { calc: [[E3(xs, '-'), 0]], rule: 'sub3' } });
          }),
          T('sub3-steps', '세 수의 뺄셈의 계산 과정', '①16', (d) => {
            const [a, b, c] = sub3(d);
            return M(`${a} − ${b} − ${josa(c, '을/를')} 앞에서부터 차례로 계산한다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: a - b }, { label: LABELS[1], answer: a - b - c }], {
              figure: lines([expr(a, '-', b, '=', box(LABELS[0])), expr(box(LABELS[0]), '-', c, '=', box(LABELS[1]))]),
              explain: `앞의 두 수를 먼저 계산한다. ${stepSub([a, b, c])}`,
              facts: { calc: [[`${a}-${b}`, 0], [`${a}-${b}-${c}`, 1]] }
            });
          }),
          T('sub3-chain', '화살표를 따라 두 번 빼기', '①19 심14', (d) => {
            const [a, b, c] = sub3(d);
            return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: a - b }, { label: LABELS[1], answer: a - b - c }], {
              figure: hop([a, '-' + b, box(LABELS[0]), '-' + c, box(LABELS[1])]), explain: stepSub([a, b, c]),
              facts: { calc: [[`${a}-${b}`, 0], [`${a}-${b}-${c}`, 1]] }
            });
          }),
          T('sub3-pic', '그림을 보고 세 수의 뺄셈식 만들기', '①18 심12', (d) => {
            const [a, b, c] = d.until(() => sub3(d), (xs) => xs[1] !== xs[2]);
            return M('구슬을 두 번 덜어 내고 선으로 지웠다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: c }, { label: LABELS[1], answer: a - b - c }], {
              figure: strikeRow(a, b, c, `구슬 ${a}개: ${b}개는 빨간 선으로, ${c}개는 파란 선으로 지웠다`) + expr(a, '-', b, '-', box(LABELS[0]), '=', box(LABELS[1])),
              explain: `구슬 ${a}개에서 ${b}개를 덜어 내고 ${c}개를 더 덜어 내었다. ${stepSub([a, b, c])}`,
              facts: { calc: [[String(c), 0], [`${a}-${b}-${c}`, 1]] }
            });
          }),
          T('sub3-match', '계산 결과가 정해진 뺄셈식 찾기', '①20 심15', (d) => {
            const rows = d.until(() => [sub3(d), sub3(d), sub3(d)], (list) => new Set(list.map(diff3)).size === 3 && new Set(list.map((xs) => xs[0])).size >= 2);
            const want = d.int(0, 2);
            return C(`계산 결과가 ${diff3(rows[want])}인 것은?`, LABELS.slice(0, 3), want, {
              figure: tagged(rows.map((xs) => ex3(xs, '-'))), explain: rows.map((xs, i) => `${LABELS[i]} ${said3(xs, '-', diff3(xs))}`).join(', '),
              facts: { choose: { exprs: rows.map((xs) => E3(xs, '-')), rule: 'equals', target: diff3(rows[want]) } }
            });
          }),
          T('sub3-versus', '두 뺄셈식의 계산 결과 비교', '①21', (d) => {
            // 더 큰 수에서 시작한 식의 결과가 더 작다.
            const [xs, ys] = d.until(() => [sub3(d), sub3(d)], ([p, q]) => p[0] !== q[0] && diff3(p) !== diff3(q) && (p[0] > q[0]) === (diff3(p) < diff3(q)));
            return C(COMPARE, SIGNS, signOf(diff3(xs), diff3(ys)), {
              figure: versus(ex3(xs, '-'), ex3(ys, '-')), explain: `${said3(xs, '-', diff3(xs))}, ${said3(ys, '-', diff3(ys))}`,
              facts: { choose: { exprs: [E3(xs, '-'), E3(ys, '-')], rule: 'compare' } }
            });
          }),
          T('sub3-versus2', '세 수의 뺄셈과 두 수의 뺄셈 비교', '①21', (d) => {
            // 7 − 3 − 1 과 7 − 4: 두 번 빼는 수를 모은 것과 견준다.
            const [a, b, c] = sub3(d), k = d.pick([b + c - 1, b + c, b + c + 1].filter((v) => a - v >= 1));
            return C(COMPARE, SIGNS, signOf(a - b - c, a - k), {
              figure: versus(ex3([a, b, c], '-'), expr(a, '-', k)), explain: `${stepSub([a, b, c])}이고 ${expr(a, '-', k, '=', a - k)}이다.`,
              facts: { choose: { exprs: [`${a}-${b}-${c}`, `${a}-${k}`], rule: 'compare' } }
            });
          }),
          T('sub3-min', '계산 결과가 가장 작은 뺄셈식', '①22', (d) => {
            // 가장 작은 수에서 시작한 식이 가장 작은 식은 아니다.
            const rows = d.until(() => [sub3(d), sub3(d), sub3(d)], (list) => {
              const v = list.map(diff3), first = list.map((xs) => xs[0]);
              return new Set(v).size === 3 && new Set(first).size === 3 && first[v.indexOf(Math.min(...v))] !== Math.min(...first);
            });
            const values = rows.map(diff3);
            return C('계산 결과가 가장 작은 것은?', LABELS.slice(0, 3), values.indexOf(Math.min(...values)), {
              figure: tagged(rows.map((xs) => ex3(xs, '-'))), explain: rows.map((xs, i) => `${LABELS[i]} ${said3(xs, '-', diff3(xs))}`).join(', '),
              facts: { choose: { exprs: rows.map((xs) => E3(xs, '-')), rule: 'min' } }
            });
          }),
          T('sub3-order', '계산 결과가 큰 것부터 차례로', '심16', (d) => {
            // 가장 작은 수에서 시작한 식의 결과가 가장 크다.
            const rows = d.until(() => [sub3(d), sub3(d), sub3(d)], (list) => {
              const v = list.map(diff3), first = list.map((xs) => xs[0]);
              return new Set(v).size === 3 && new Set(first).size === 3 && first[v.indexOf(Math.max(...v))] === Math.min(...first);
            });
            const pick = orderChoice(d, rows.map(diff3), true);
            return C('계산 결과가 큰 것부터 차례로 쓴 것은?', pick.options, pick.answer, {
              figure: tagged(rows.map((xs) => ex3(xs, '-'))), explain: rows.map((xs, i) => `${LABELS[i]} ${said3(xs, '-', diff3(xs))}`).join(', '),
              facts: { choose: { exprs: rows.map((xs) => E3(xs, '-')), rule: 'descending', orders: pick.list } }
            });
          }),
          T('sub3-biggest', '가장 큰 수에서 나머지 두 수 빼기', '①23 심17 심21', (d) => {
            const xs = d.until(() => d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3), (v) => { const s = v.slice().sort((p, q) => q - p); return s[0] - s[1] - s[2] >= 1 && v[0] !== s[0]; });
            const big = Math.max(...xs), rest = xs.filter((v) => v !== big);
            return N('가장 큰 수에서 나머지 두 수를 뺀 값은?', big - rest[0] - rest[1], {
              figure: numbers(xs), explain: `가장 큰 수는 ${big}이다. ${stepSub([big, rest[0], rest[1]])}`,
              facts: { calc: [[`${big}-${rest[0]}-${rest[1]}`, 0]] }
            });
          }),
          T('sub3-pick2', '수 카드 두 장을 골라 뺄셈식 완성하기', '①24', (d) => {
            // 9 − □ − □ = 1: 합이 8인 두 장은 한 쌍뿐이다.
            const v = d.until(() => {
              const a = d.int(7, 9), r = d.int(1, 3), list = d.shuffle([1, 2, 3, 4, 5, 6]).slice(0, 4);
              return { a, r, list, all: pairsOf(list) };
            }, (o) => o.all.filter(([x, y]) => o.a - x - y === o.r).length === 1);
            const right = v.all.find(([x, y]) => v.a - x - y === v.r), need = v.a - v.r;
            const opts = d.shuffle(d.shuffle(v.all.filter((p) => p !== right)).slice(0, 3).concat([right]));
            return C('수 카드 두 장을 골라 □ 안에 넣으려고 한다. 알맞은 두 수는?', opts.map(([x, y]) => `${x}, ${y}`), opts.indexOf(right), {
              figure: cards(v.list) + expr(v.a, '-', box(), '-', box(), '=', v.r),
              explain: `${expr(v.a, '-', need, '=', v.r)}이므로 빼는 두 수의 합은 ${need}이다. 수 카드에서 합이 ${need}인 두 수는 ${both(right)}이다.`,
              facts: { claimed: opts.map(([x, y]) => [`${v.a}-${x}-${y}`, v.r]), claimedWant: true }
            });
          }),
          T('sub3-word', '문장제: 두 번 덜어 내기', '①25 심13', (d) => {
            const [a, b, c] = sub3(d);
            return N(`버스에 ${a}명이 타고 있었다. 첫째 정류장에서 ${b}명이 내렸다. 둘째 정류장에서 ${c}명이 내렸다. 버스에 남은 사람은 몇 명인가?`, a - b - c, { unit: '명', explain: stepSub([a, b, c]), facts: { calc: [[`${a}-${b}-${c}`, 0]] } });
          })
        ]
      },
      {
        id: 'ten', title: '10이 되는 더하기', standard: TEN,
        types: [
          T('ten-blank', '10이 되는 덧셈식에서 □ 구하기', '①26', (d) => {
            const a = d.int(1, 9), front = d.bool();
            return N('□ 안에 알맞은 수는?', 10 - a, {
              figure: front ? expr(box(), '+', a, '=', 10) : expr(a, '+', box(), '=', 10), explain: `${josa(a, '과/와')} 더하여 10이 되는 수는 ${10 - a}이다.`,
              facts: { calc: [[`10-${a}`, 0]], inverse: [front ? 'x+b=a' : 'b+x=a', 10, a], rule: 'ten-blank' }
            });
          }),
          T('ten-frame', '그림을 보고 10이 되는 덧셈식 만들기', '①27 심22', (d) => {
            const a = d.int(2, 8), b = 10 - a;
            return M('빨간색 ○와 파란색 ○의 수를 더한다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: b }, { label: LABELS[1], answer: 10 }], {
              figure: tenFrame(Array.from({ length: 10 }, (_, i) => (i < a ? 'red' : 'blue')), `십 배열판: 빨간색 ○ ${a}개, 파란색 ○ ${b}개`) + expr(a, '+', box(LABELS[0]), '=', box(LABELS[1])),
              explain: `빨간색 ○는 ${a}개, 파란색 ○는 ${b}개이다. ${expr(a, '+', b, '=', 10)}`,
              facts: { calc: [[String(b), 0], [`${a}+${b}`, 1]] }
            });
          }, { standard: SPLIT }),
          T('ten-frame-more', '○를 더 놓아 10 만들기', '①27', (d) => {
            const a = d.int(2, 8);
            return N('빈칸에 ○를 더 놓아 10개를 만들려고 한다. ○를 몇 개 더 놓아야 하는가?', 10 - a, {
              unit: '개', figure: tenFrame(Array.from({ length: 10 }, (_, i) => (i < a ? 'red' : '')), `십 배열판: ○ ${a}개, 빈칸 ${10 - a}칸`),
              explain: `○는 ${a}개이고 빈칸은 ${10 - a}칸이다. ${expr(a, '+', 10 - a, '=', 10)}`,
              facts: { calc: [[`10-${a}`, 0]] }
            });
          }, { standard: SPLIT }),
          T('ten-frame-expr', '그림에 알맞은 덧셈식 고르기', '①28', (d) => {
            // 두 색이 섞여 있어 색마다 세어야 한다. 틀린 식은 한 수가 하나씩 다르다.
            const a = d.pick([2, 3, 4, 6, 7, 8]), b = 10 - a;
            const cells = d.shuffle(Array.from({ length: 10 }, (_, i) => (i < a ? 'red' : 'blue')));
            const list = d.shuffle([[a, b], [a + 1, b - 1], [a - 1, b + 1], d.bool() ? [a, b - 1] : [a - 1, b]]);
            return C('빨간색 ○의 수와 파란색 ○의 수를 차례로 더한 식은?', list.map(([x, y]) => expr(x, '+', y, '=', x + y)), list.findIndex(([x, y]) => x === a && y === b), {
              figure: tenFrame(cells, `십 배열판: 빨간색 ○ ${a}개와 파란색 ○ ${b}개가 섞여 있다`),
              explain: `빨간색 ○는 ${a}개, 파란색 ○는 ${b}개이다. ${expr(a, '+', b, '=', 10)}`,
              facts: { truth: list.map(([x, y]) => x === a && y === b), want: true }
            });
          }),
          T('ten-on', '이어 세어 10 만들기', '①29', (d) => {
            // 7 + 3: 7 다음 수부터 8, 9, 10
            const a = d.int(6, 8), b = 10 - a, seq = Array.from({ length: b }, (_, i) => a + 1 + i);
            return M(`${a}에서 ${b}만큼 이어 세어 덧셈을 한다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: a + 1 }, { label: LABELS[1], answer: 10 }], {
              figure: oneRow([[a, 'red'], [b, 'blue']], `구슬 한 줄: 빨간색 ${a}개, 파란색 ${b}개`) + numbers([a].concat(seq.map((v, i) => (i === 0 ? box(LABELS[0]) : i === b - 1 ? box(LABELS[1]) : v)))) + expr(a, '+', b, '=', box(LABELS[1])),
              explain: `${a} 다음 수부터 ${b}개를 이어 세면 ${seq.join(', ')}이다. ${expr(a, '+', b, '=', 10)}`,
              facts: { calc: [[`${a}+1`, 0], [`${a}+${b}`, 1]], unseen: [1] }
            });
          }),
          T('ten-swap', '두 수를 바꾸어 더하기', '①30', (d) => {
            const a = d.pick([2, 3, 4, 6, 7, 8]), b = 10 - a;
            const list = d.shuffle([[b, a]].concat(d.shuffle([[b, a - 1], [a - 1, b], [b - 1, a], [a, b - 1]]).slice(0, 3)));
            return C(`${a} + ${josa(b, '과/와')} 계산 결과가 같은 것은?`, list.map(([x, y]) => expr(x, '+', y)), list.findIndex(([x, y]) => x === b && y === a), {
              explain: `두 수를 바꾸어 더해도 합은 같다. ${expr(a, '+', b, '=', 10)}, ${expr(b, '+', a, '=', 10)}`,
              facts: { choose: { exprs: list.map(([x, y]) => `${x}+${y}`), rule: 'equals', target: 10 } }
            });
          }),
          T('ten-not', '합이 10이 아닌 덧셈식 찾기', '①31 심26', (d) => {
            const rows = d.until(() => {
              const s = d.pick([8, 9]), x = d.int(2, s - 2);
              return d.shuffle(d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3).map((a) => [a, 10 - a]).concat([[x, s - x]]));
            }, (list) => new Set(list.map((p) => p.join())).size === 4);
            return C('합이 10이 아닌 것은?', LABELS.slice(0, 4), rows.findIndex(([x, y]) => x + y !== 10), {
              figure: tagged(rows.map(([x, y]) => expr(x, '+', y))), explain: rows.map(([x, y], i) => `${LABELS[i]} ${expr(x, '+', y, '=', x + y)}`).join(', '),
              facts: { choose: { exprs: rows.map(([x, y]) => `${x}+${y}`), rule: 'odd' } }
            });
          }),
          T('ten-count', '합이 10인 덧셈식 세기', '심23 ①31', (d) => {
            // 0을 더한 식(0 + 9, 8 + 0)과 합이 9인 식이 섞여 있다.
            const k = d.int(2, 4);
            const rows = d.until(() => {
              const tens = d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, k).map((a) => [a, 10 - a]);
              const rest = Array.from({ length: 5 - k }, () => { const s = d.pick([8, 9, 9]), x = d.int(1, s - 1); return [x, s - x]; });
              return d.shuffle(tens.concat([d.pick([[0, 9], [9, 0], [0, 8], [8, 0]])], rest));
            }, (list) => new Set(list.map((p) => p.join())).size === 6);
            const flags = rows.map(([x, y]) => x + y === 10);
            return N('합이 10인 덧셈식은 모두 몇 개인가?', k, {
              unit: '개', figure: numbers(rows.map(([x, y]) => expr(x, '+', y))),
              explain: `합이 10인 덧셈식은 ${rows.filter((_, i) => flags[i]).map(([x, y]) => expr(x, '+', y)).join(', ')}이다. 0을 더하면 수가 그대로이다.`,
              // 합은 모두 10 이하이므로 「9.5보다 큰 것」이 곧 합이 10인 것이다(검사가 식을 다시 셈해 센다).
              facts: { count: flags, choose: { exprs: rows.map(([x, y]) => `${x}+${y}`), rule: 'countAbove', target: 9.5 } }
            });
          }),
          T('ten-pair', '여러 수 가운데 더하여 10이 되는 두 수', '①32 심24', (d) => {
            // 짝은 한 쌍뿐이고, 틀린 보기는 합이 9나 11이다.
            const near = ([x, y]) => x + y === 9 || x + y === 11;
            const list = d.until(() => d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 5), (xs) => pairsOf(xs).filter(([x, y]) => x + y === 10).length === 1 && pairsOf(xs).filter(near).length >= 3);
            const all = pairsOf(list), right = all.find(([x, y]) => x + y === 10);
            const opts = d.shuffle(d.shuffle(all.filter(near)).slice(0, 3).concat([right]));
            return C('더하여 10이 되는 두 수는?', opts.map(both), opts.indexOf(right), {
              figure: numbers(list), explain: `${expr(right[0], '+', right[1], '=', 10)}이다.`,
              facts: { choose: { exprs: opts.map(([x, y]) => `${x}+${y}`), rule: 'equals', target: 10 } }
            });
          }, { standard: SPLIT }),
          T('ten-dice', '눈의 수의 합이 10인 두 주사위', '심24 심26', (d) => {
            const tagsOf = ([i, j]) => `${LABELS[i]}, ${LABELS[j]}`;
            const vals = d.until(() => d.shuffle(d.pick([[4, 6], [5, 5]]).concat([d.int(2, 6), d.int(2, 6)])), (v) => pairsOf([0, 1, 2, 3]).filter(([i, j]) => v[i] + v[j] === 10).length === 1 && pairsOf([0, 1, 2, 3]).filter(([i, j]) => Math.abs(v[i] + v[j] - 10) === 1).length >= 2);
            const all = pairsOf([0, 1, 2, 3]), right = all.find(([i, j]) => vals[i] + vals[j] === 10);
            const close = d.shuffle(all.filter(([i, j]) => Math.abs(vals[i] + vals[j] - 10) === 1)), far = d.shuffle(all.filter(([i, j]) => Math.abs(vals[i] + vals[j] - 10) > 1));
            const opts = d.shuffle(close.concat(far).slice(0, 3).concat([right]));
            return C('눈의 수의 합이 10인 두 주사위는?', opts.map(tagsOf), opts.indexOf(right), {
              figure: dice(vals, `주사위 네 개의 눈: ${vals.map((v, i) => `${LABELS[i]} ${v}`).join(', ')}`, LABELS),
              explain: `눈의 수는 ${vals.map((v, i) => `${LABELS[i]} ${v}`).join(', ')}이다. ${expr(vals[right[0]], '+', vals[right[1]], '=', 10)}`,
              facts: { choose: { exprs: opts.map(([i, j]) => `${vals[i]}+${vals[j]}`), rule: 'equals', target: 10 } }
            });
          }, { standard: SPLIT }),
          T('ten-board', '수 판에서 붙어 있는 두 수로 10 만들기', '①34 심25', (d) => {
            // 「모두 묶기」가 아니라 붙어 있는 짝 하나를 고른다. 붙어 있는 두 수의 합이 10인 곳은 한 군데뿐이다.
            const list = d.until(() => Array.from({ length: 6 }, () => d.int(1, 9)), (xs) => {
              const next = xs.slice(0, 5).map((x, i) => [x, xs[i + 1]]);
              return next.filter(([x, y]) => x + y === 10).length === 1 && new Set(next.map(both)).size === 5 && new Set(xs).size >= 5 && next.filter(([x, y]) => Math.abs(x + y - 10) === 1).length >= 1;
            });
            const next = list.slice(0, 5).map((x, i) => [x, list[i + 1]]), right = next.find(([x, y]) => x + y === 10);
            const opts = d.shuffle(d.shuffle(next.filter((p) => p !== right)).slice(0, 3).concat([right]));
            return C('수 판에서 옆으로 붙어 있는 두 수의 합이 10인 것은?', opts.map(both), opts.indexOf(right), {
              figure: board(list, `수 판: ${list.join(', ')}`), explain: `${expr(right[0], '+', right[1], '=', 10)}이다.`,
              facts: { choose: { exprs: opts.map(([x, y]) => `${x}+${y}`), rule: 'equals', target: 10 } }
            });
          }, { standard: SPLIT }),
          T('ten-match', '더하여 10이 되는 수를 차례로 찾기', '①33', (d) => {
            const xs = d.shuffle([1, 2, 3, 4, 6, 7, 8, 9]).slice(0, 3), mates = xs.map((v) => 10 - v);
            const list = d.shuffle(d.shuffle(ORDERS.slice(1)).slice(0, 3).concat([ORDERS[0]]));
            return C('㉠, ㉡, ㉢과 더하여 10이 되는 수를 차례로 쓴 것은?', list.map((o) => o.map((k) => mates[k]).join(', ')), list.findIndex((o) => o.join() === '0,1,2'), {
              figure: tagged(xs.map((v) => `<span class="mb-expr">${v}</span>`)), explain: xs.map((v, i) => `${LABELS[i]} ${expr(v, '+', 10 - v, '=', 10)}`).join(', '),
              facts: { match: { exprs: xs.map((v) => `10-${v}`), options: list.map((o) => o.map((k) => mates[k])) } }
            });
          }, { standard: SPLIT }),
          T('ten-blank-most', '□ 안에 알맞은 수의 크기 비교', '①35 심27', (d) => {
            const xs = d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3), big = d.bool(), mates = xs.map((v) => 10 - v);
            const shape = xs.map((v) => (d.bool() ? expr(box(), '+', v, '=', 10) : expr(v, '+', box(), '=', 10)));
            return C(`□ 안에 알맞은 수가 가장 ${big ? '큰' : '작은'} 것은?`, LABELS.slice(0, 3), mates.indexOf(big ? Math.max(...mates) : Math.min(...mates)), {
              figure: tagged(shape), explain: `□ 안에 알맞은 수는 ${mates.map((v, i) => `${LABELS[i]} ${v}`).join(', ')}이다.`,
              facts: { choose: { exprs: xs.map((v) => `10-${v}`), rule: big ? 'max' : 'min' } }
            });
          }),
          T('ten-word', '문장제: 합쳐서 10', '①36 심30', (d) => {
            const who = d.pick(NAMES), a = d.int(2, 8), b = 10 - a;
            return N(`${name(who, '은/는')} 색종이를 ${a}장 가지고 있다. 친구에게 ${b}장을 더 받았다. ${nick(who)}의 색종이는 모두 몇 장인가?`, 10, { unit: '장', explain: expr(a, '+', b, '=', 10), facts: { calc: [[`${a}+${b}`, 0]] } });
          }),
          T('ten-word-more', '문장제: 몇을 더해야 10', '①37 심31', (d) => {
            const a = d.int(2, 8);
            return N(`버스에 ${a}명이 타고 있다. 몇 명이 더 타서 10명이 되었다. 더 탄 사람은 몇 명인가?`, 10 - a, {
              unit: '명', explain: `${josa(a, '과/와')} 더하여 10이 되는 수는 ${10 - a}이다. ${expr(a, '+', 10 - a, '=', 10)}`, facts: { calc: [[`10-${a}`, 0]] }
            });
          }),
          T('ten-family', '세 수로 만든 덧셈식과 뺄셈식', '①38', (d) => {
            // 4, 6, 10 으로 만들 수 있는 식: 4 + 6 = 10, 6 + 4 = 10, 10 − 4 = 6, 10 − 6 = 4
            const a = d.pick([1, 2, 3, 4, 6, 7, 8, 9]), b = 10 - a;
            const good = d.pick([[a, '+', b, 10], [10, '-', a, b], [10, '-', b, a]]);
            const bad = d.shuffle([[10, '+', a, b], [Math.max(a, b), '-', Math.min(a, b), 10], [10, '-', a, a], [a, '+', 10, b]]).slice(0, 3);
            const list = d.shuffle([good].concat(bad));
            return C('수 카드 세 장을 한 번씩 모두 써서 식을 만들었다. 바르게 만든 식은?', list.map(([x, op, y, z]) => expr(x, op, y, '=', z)), list.indexOf(good), {
              figure: cards(d.shuffle([a, b, 10])), explain: `${josa(a, '과/와')} ${josa(b, '을/를')} 더하면 10이다. 10에서 ${josa(a, '을/를')} 빼면 ${b}이고, ${josa(b, '을/를')} 빼면 ${a}이다.`,
              facts: { claimed: list.map((row) => [`${row[0]}${row[1]}${row[2]}`, row[3]]), claimedWant: true }
            });
          })
        ]
      },
      { id: 'tensub', title: '10에서 빼기', standard: TEN, types: [] },
      { id: 'make10', title: '10을 만들어 더하기', standard: THREE, types: [] }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
