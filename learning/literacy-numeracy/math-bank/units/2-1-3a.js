// 2학년 1학기 3단원 덧셈과 뺄셈 — 단원 틀과 기본 문항(덧셈 계산 · 뺄셈 계산 · 여러 가지 방법으로 계산하기).
// 수집해 둔 교과서·익힘책·평가지에서 뽑은 꼴 목록(기본꼴_1 90꼴, 심화꼴 52꼴)을 하나씩 옮긴 것이다.
// 꼴(무엇을 주고 무엇을 묻는가)만 따르고 수와 상황은 새로 쓴다. 유형마다 꼴 번호를 적는다(①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번).
//
// 영역은 수와 연산. 성취기준 2수01-06(두 자리 수의 범위에서 덧셈과 뺄셈), 2수01-07(덧셈과 뺄셈의 관계),
// 2수01-08(세 수의 덧셈과 뺄셈), 2수01-09(□가 사용된 식), 2수01-05(실생활 상황 — 문장제).
//
// 싣는 기준
//  - 수의 범위: 더하는 수·더해지는 수·빼어지는 수·빼는 수는 모두 두 자리 수 이하이다. 합만 세 자리 수가 될 수 있다.
//    세 수의 계산은 가운데 결과도 두 자리 수가 되게 수를 고른다(세 자리 수에서 빼거나 세 자리 수에 더하는 일이 없다).
//  - 식만 주는 계산은 계산의 구조(일의 자리에서 십의 자리로 올림 / 십의 자리에서 백의 자리로 올림 / 둘 다 / (몇십)−(몇십몇) / 십의 자리에서 10을 가져옴)와
//    나타내는 방법(세로셈, 가로셈, 수 모형, 과정의 빈칸)이 다를 때만 다른 유형으로 싣는다. 구조는 facts.rule 로 가른다.
//  - 계산 방법의 빈칸은 꼴 목록에 있는 교과서의 방법 그대로만 묻는다(더하는 수를 몇십과 몇으로 가르기, 몇십으로 보고 더한 뒤 빼기,
//    앞의 수가 몇십이 되게 가르기, 십의 자리끼리·일의 자리끼리). 방법의 이름은 묻지 않는다(교육과정: 지나치게 형식화하지 않는다).
//  - 「받아올림」「받아내림」이라는 말은 아이에게 보이는 글에 쓰지 않는다(「십의 자리로 올린 1」「십의 자리에서 10을 가져온다」로 풀어 쓴다).
//  - 답 칸에는 숫자만 받는다. 식 쓰기·까닭 쓰기·이름 쓰기는 싣지 않는다(고르기로 바꿀 수 있는 것은 고르기로).
//
// 뺀 것과 까닭(이 파일이 맡은 꼴 묶음 가·나·다·라·바에서)
//  - ①41·심3(여러 수에 같은 수를 더하고 빼는 표): 같은 계산을 표에 되풀이할 뿐이라 세로셈·가로셈과 같은 문제이다.
//    ①38·①39의 「두 수를 빈 곳에」는 「두 수의 합」「두 수의 차」로 물었다(add-sum, sub-diff).
//  - ①14의 ○ 더 그리기, 심13의 /으로 지우기: 그리기(작도). 합만 묻는 것은 add-beads 로 실었다.
//  - ①27, 심12, 심13의 설명: 과정·까닭을 글로 쓰는 것(서술형). 틀린 과정을 가리는 것은 실력 문항으로 옮겼다(2-1-3c.js).
//  - ①43, 심23, 심24: 합이 주어진 수가 되는 짝·세 수를 「모두」 찾기 — 어려움이 계산이 아니라 경우 따지기에서 온다.
//  - ①48, 심27, 심28: 세로셈의 빈 숫자 둘·셋(빈 숫자 하나인 ①47은 실었다).
//  - 심8: 사다리 타기(놀이 꼴). 심6(이어진 두 수의 차)은 「작은 수가 앞에 놓인 두 수의 차」로 sub-diff 에 합쳤다.
//  - ①46·심26(숫자 카드 넉 장으로 차가 가장 큰 뺄셈식), ①26·심14(두 사람의 계산 과정에서 틀린 쪽)는 실력 문항으로 옮겼다. 심25는 같은 생각(가장 작은 수를 뺀다)이라 싣지 않았다.
//  - 그림이 필요해 미룬 꼴은 없다. 수집본에서 그림을 알 수 없던 꼴(①17·①66·①68)은 수 모형·띠 그림으로 새로 그렸다.
//
// 그림 함수(이 파일에 있고 B.kit.g213 으로 내보낸다)
//  - beads: 구슬·바둑돌을 한 줄에 10개씩, 5개마다 틈을 두어 놓는다(×표, 두 빛깔).
//  - model: 십 모형 1개를 일 모형 10개로 바꾸어 놓은 수 모형(일 모형이 열 개를 넘는다)과 ×표.
//  - band: 전체와 두 부분을 나타낸 띠 그림(그림 속 수를 그림 설명에 적는다).
//  - steps: 계산 과정을 등호에 맞추어 줄마다 적는다. side: 기호를 붙여 나란히 놓은 세로셈.
// 묻는 말: 수나 값을 물을 때는 「~은?/~는?」, 양을 물을 때는 「몇 ~인가?」, 시키는 말은 「다음을 계산하시오.」.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, LABELS, box, expr, column, chars, blocks, cards, chain, table, numbers, N, M, C, E, shown } = B.kit;
  const CALC = '2수01-06';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const tens = (n) => Math.floor(n / 10), ones = (n) => n % 10;

  // ── 수 고르기 ────────────────────────────────────────────────
  // 일의 자리에서 십의 자리로 올리는가, 십의 자리에서 백의 자리로 올리는가(합이 세 자리 수)
  const upOnes = (a, b) => ones(a) + ones(b) >= 10;
  const upTens = (a, b) => tens(a) + tens(b) + (upOnes(a, b) ? 1 : 0) >= 10;
  const KIND = {
    ones: (a, b) => upOnes(a, b) && !upTens(a, b),   // 일의 자리에서만(합은 두 자리 수)
    tens: (a, b) => !upOnes(a, b) && upTens(a, b),   // 십의 자리에서만(합은 세 자리 수)
    both: (a, b) => upOnes(a, b) && upTens(a, b),    // 둘 다(합은 세 자리 수)
    up: (a, b) => upOnes(a, b),                      // 일의 자리에서 올린다(합은 두 자리 수일 수도, 세 자리 수일 수도)
    big: (a, b) => upTens(a, b)                      // 합이 세 자리 수
  };
  // (몇십몇)+(몇십몇)
  const addTwo = (d, kind, more) => d.until(() => [d.int(12, 98), d.int(12, 98)], ([a, b]) => a !== b && ones(a) > 0 && ones(b) > 0 && KIND[kind](a, b) && (!more || more(a, b)));
  // (몇십몇)+(몇): 일의 자리에서 올린다. 합은 두 자리 수.
  const addOne = (d, more) => d.until(() => [d.int(13, 89), d.int(3, 9)], ([a, b]) => ones(a) > 0 && upOnes(a, b) && (!more || more(a, b)));
  // (몇십몇)−(몇십몇): 십의 자리에서 10을 가져온다.
  const subTwo = (d, more) => d.until(() => [d.int(31, 98), d.int(12, 79)], ([a, b]) => ones(a) > 0 && ones(a) < ones(b) && a - b >= 12 && (!more || more(a, b)));
  // (몇십)−(몇십몇)
  const subRound = (d, more) => d.until(() => [d.int(3, 9) * 10, d.int(12, 78)], ([a, b]) => ones(b) > 0 && a - b >= 11 && (!more || more(a, b)));
  // (몇십몇)−(몇)
  const subOne = (d, more) => d.until(() => [d.int(21, 98), d.int(3, 9)], ([a, b]) => ones(a) > 0 && ones(a) < b && (!more || more(a, b)));

  // ── 풀이 글 ──────────────────────────────────────────────────
  const addWhy = (a, b) => {
    const o = ones(a) + ones(b), t = tens(a) + tens(b) + (o >= 10 ? 1 : 0);
    if (o >= 10 && t >= 10) return `일의 자리 계산은 ${ones(a)} + ${ones(b)} = ${o}이다. 십의 자리로 1을 올려 십의 자리 계산은 1 + ${tens(a)} + ${tens(b)} = ${t}이다. ` + shown(a, '+', b);
    if (o >= 10) return `일의 자리 계산은 ${ones(a)} + ${ones(b)} = ${o}이다. 10을 십의 자리로 올려 계산한다. ` + shown(a, '+', b);
    if (t >= 10) return `십의 자리 계산은 ${tens(a)} + ${tens(b)} = ${t}이다. 10이 ${t}개이면 ${t * 10}이다. ` + shown(a, '+', b);
    return shown(a, '+', b);
  };
  const subWhy = (a, b) => `일의 자리 수 ${ones(a)}에서 ${josa(ones(b), '을/를')} 뺄 수 없다. 십의 자리에서 10을 가져오면 일의 자리 계산은 ${10 + ones(a)} − ${ones(b)} = ${10 + ones(a) - ones(b)}이다. ` + shown(a, '-', b);

  // ── 그림 ────────────────────────────────────────────────────
  const cross = (x1, y1, x2, y2) => `<path class="mb-strike" d="M${x1} ${y1}L${x2} ${y2}M${x1} ${y2}L${x2} ${y1}"/>`;
  // 구슬(동그라미)을 한 줄에 10개씩, 5개마다 틈을 두어 놓는다(한눈에 세게).
  // o.out: 뒤에서부터 ×표 한 수. o.dark: 앞의 몇 개를 검은 돌로, 나머지를 흰 돌로 그린다(바둑돌). o.label: 그림 설명.
  function beads(n, o) {
    const opt = o || {}, step = 20, gap = 8, pad = 8, dark = opt.dark, twoKinds = dark !== undefined;
    // 검은 돌과 흰 돌은 줄을 바꾸어 놓는다(빛깔마다 따로 세게).
    const slot = (i) => (twoKinds && i >= dark ? Math.ceil(dark / 10) * 10 + (i - dark) : i);
    const cols = Math.min(10, twoKinds ? Math.max(dark, n - dark) : n), rows = Math.floor(slot(n - 1) / 10) + 1;
    const width = pad * 2 + (cols - 1) * step + 14 + (cols > 5 ? gap : 0), height = pad * 2 + (rows - 1) * step + 14;
    let out = '';
    for (let i = 0; i < n; i += 1) {
      const c = slot(i) % 10, cx = pad + 7 + c * step + (c >= 5 ? gap : 0), cy = pad + 7 + Math.floor(slot(i) / 10) * step;
      const style = !twoKinds ? '' : i < dark ? ' style="fill:#1f2933;stroke:#1f2933"' : ' style="fill:#fff;stroke:#1f2933"';
      out += `<circle class="mb-thing"${style} cx="${cx}" cy="${cy}" r="7"/>`;
      if (opt.out && i >= n - opt.out) out += cross(cx - 6, cy - 6, cx + 6, cy + 6);
    }
    return `<svg class="mb-dots" viewBox="0 0 ${width} ${height}" width="${Math.round(width * 1.2)}" role="img" aria-label="${opt.label}">${out}</svg>`;
  }
  // 수 모형(십 모형과 일 모형). 십 모형 1개를 일 모형 10개로 바꾸어 놓은 그림을 그리려고 일 모형을 열 개 넘게도 놓는다.
  // outT·outO: 뒤에서부터 ×표 한 십 모형·일 모형의 수.
  function model(t, o, outT, outO) {
    const parts = []; let x = 4;
    for (let i = 0; i < t; i += 1) {
      let ticks = '';
      for (let k = 1; k < 10; k += 1) ticks += `<path d="M${x} ${(6 + k * 3.4).toFixed(1)}h5"/>`;
      const gone = i >= t - outT;
      parts.push(`<g class="mb-rod${gone ? ' is-out' : ''}"><rect x="${x}" y="6" width="5" height="34" rx="1"/>${ticks}</g>` + (gone ? cross(x - 0.7, 19.8, x + 5.7, 26.2) : '')); x += 8;
    }
    x += t ? 6 : 0;
    for (let i = 0; i < o; i += 1) {
      const px = x + Math.floor(i / 5) * 8, py = 6 + (i % 5) * 7, gone = i >= o - outO;
      parts.push(`<rect class="mb-one${gone ? ' is-out' : ''}" x="${px}" y="${py}" width="5.4" height="5.4" rx="1"/>` + (gone ? cross(px + 0.4, py + 0.4, px + 5, py + 5) : ''));
    }
    x += o ? Math.ceil(o / 5) * 8 : 0;
    const width = Math.max(x + 4, 60);
    const said = `수 모형: 십 모형 ${t}개, 일 모형 ${o}개` + (outT || outO ? ` 가운데 십 모형 ${outT}개, 일 모형 ${outO}개에 ×표` : '');
    return `<figure class="mb-blocks"><svg viewBox="0 0 ${width} 46" width="${Math.round(width * 2.1)}" role="img" aria-label="${said}">${parts.join('')}</svg></figure>`;
  }
  // 띠 그림: 전체(위)와 두 부분(아래). 모르는 쪽에는 '□'를 넘긴다. 그림 속 수를 그림 설명에 적는다.
  function band(total, left, right) {
    const share = typeof left === 'number' && typeof right === 'number' ? left / (left + right) : typeof left === 'number' && typeof total === 'number' ? left / total : typeof right === 'number' && typeof total === 'number' ? 1 - right / total : 0.5;
    const cut = 8 + 154 * Math.min(0.68, Math.max(0.32, share));
    const mark = (value, x, y, cls) => (value === '□' ? `<rect x="${(x - 5).toFixed(1)}" y="${y - 8}" width="10" height="10" rx="1.2" style="fill:#fff;stroke:#1f2933;stroke-width:1.1"/>` : `<text class="${cls}" x="${x.toFixed(1)}" y="${y}" text-anchor="middle">${value}</text>`);
    return `<svg class="mb-bar" viewBox="0 0 170 44" width="300" role="img" aria-label="띠 그림: 전체 ${total}, 왼쪽 ${left}, 오른쪽 ${right}">`
      + `<path class="mb-brace" d="M8 18v-5h154v5"/>` + mark(total, 85, 10, 'mb-road-label')
      + `<rect class="mb-tape-a" x="8" y="21" width="${(cut - 8).toFixed(1)}" height="16"/><rect class="mb-tape-b" x="${cut.toFixed(1)}" y="21" width="${(162 - cut).toFixed(1)}" height="16"/>`
      + mark(left, (8 + cut) / 2, 32, 'mb-bar-label') + mark(right, (cut + 162) / 2, 32, 'mb-bar-label') + '</svg>';
  }
  // 계산 과정을 줄마다 적는다. 첫 줄 왼쪽에 식을 적고, 줄마다 「= …」을 등호에 맞추어 적는다.
  const steps = (head, rows) => '<div class="mb-lines" style="grid-template-columns:auto 1fr;gap:8px 4px">' + rows.map((row, i) => `<div>${i === 0 ? head : ''}</div><div>${row}</div>`).join('') + '</div>';
  // 기호(㉠㉡㉢)를 붙여 나란히 놓은 세로셈
  const side = (list) => list.map((html, i) => `<div style="display:flex;align-items:flex-start;gap:2px"><span class="mb-tag mb-tag-short">${LABELS[i]}</span>${html}</div>`).join('');
  const col = (a, op, b, result, above) => column(chars(a), op, chars(b), result, above);
  const row = (a, op, b) => expr(a, op, b, '=', box());
  const sum = (figure, a, b, rule, why) => N('다음을 계산하시오.', a + b, { figure, explain: why || addWhy(a, b), facts: { calc: [[E(a, '+', b), 0]], rule } });
  const diff = (figure, a, b, rule) => N('다음을 계산하시오.', a - b, { figure, explain: subWhy(a, b), facts: { calc: [[E(a, '-', b), 0]], rule } });
  // 같은 단원의 b·c 파일이 함께 쓴다.
  B.kit.g213 = { tens, ones, upOnes, upTens, KIND, addTwo, addOne, subTwo, subRound, subOne, addWhy, subWhy, beads, model, band, steps, side, col, row, cross };

  B.addUnit({
    id: '2-1-3', grade: 2, semester: 1, no: 3, title: '덧셈과 뺄셈', version: 1,
    groups: [
      {
        id: 'add', title: '덧셈 계산', standard: CALC,
        types: [
          T('add-col-one', '(몇십몇)+(몇) 세로셈', '①1', (d) => { const [a, b] = addOne(d); return sum(col(a, '+', b), a, b, 'one'); }),
          T('add-row-front', '(몇)+(몇십몇) 가로셈', '심1', (d) => {
            const [a, b] = addOne(d);
            return sum(row(b, '+', a), b, a, 'front', `일의 자리끼리 더하면 ${b} + ${ones(a)} = ${b + ones(a)}이다. 10을 십의 자리로 올려 계산한다. ` + shown(b, '+', a));
          }),
          T('add-col-ones', '(몇십몇)+(몇십몇) 세로셈: 일의 자리에서 올림', '①2', (d) => { const [a, b] = addTwo(d, 'ones'); return sum(col(a, '+', b), a, b, 'ones'); }),
          T('add-row-ones', '(몇십몇)+(몇십몇) 가로셈: 일의 자리에서 올림', '①3', (d) => { const [a, b] = addTwo(d, 'ones'); return sum(row(a, '+', b), a, b, 'ones'); }),
          T('add-col-tens', '(몇십몇)+(몇십몇) 세로셈: 십의 자리에서 올림(합이 세 자리 수)', '①4', (d) => { const [a, b] = addTwo(d, 'tens'); return sum(col(a, '+', b), a, b, 'tens'); }),
          T('add-col-both', '(몇십몇)+(몇십몇) 세로셈: 일의 자리와 십의 자리에서 올림', '①5 심2', (d) => { const [a, b] = addTwo(d, 'both', (x, y) => x + y >= 111); return sum(col(a, '+', b), a, b, 'both'); }),
          T('add-row-both', '(몇십몇)+(몇십몇) 가로셈: 일의 자리와 십의 자리에서 올림', '①5 심2', (d) => { const [a, b] = addTwo(d, 'both', (x, y) => x + y >= 111); return sum(row(a, '+', b), a, b, 'both'); }),
          T('add-col-zero', '(몇십몇)+(몇십몇) 세로셈: 합의 십의 자리 숫자가 0', '①5', (d) => { const [a, b] = addTwo(d, 'both', (x, y) => x + y <= 109); return sum(col(a, '+', b), a, b, 'zero'); }),
          T('add-carry-ten', '십의 자리 위에 작게 쓴 1이 나타내는 수', '①6', (d) => {
            const [a, b] = addTwo(d, 'ones', (x, y) => ones(x) + ones(y) >= 11), o = ones(a) + ones(b);
            return N('덧셈식에서 □ 안의 수 1이 나타내는 수는?', 10, {
              figure: col(a, '+', b, chars(a + b), [box(1), '']),
              explain: `일의 자리 계산은 ${ones(a)} + ${ones(b)} = ${o}이다. ${o}에서 10을 십의 자리로 올려 쓴 것이므로 □ 안의 수 1은 10을 나타낸다.`,
              facts: { calc: [[`${ones(a)}+${ones(b)}-${ones(a + b)}`, 0]] }
            });
          }),
          T('add-carry-hundred', '합의 백의 자리 숫자 1이 나타내는 수', '①6', (d) => {
            const [a, b] = addTwo(d, 'tens'), s = a + b, t = tens(a) + tens(b);
            return N('덧셈식에서 □ 안의 수 1이 나타내는 수는?', 100, {
              figure: col(a, '+', b, [box(1), String(tens(s) % 10), String(ones(s))]),
              explain: `십의 자리 계산은 ${tens(a)} + ${tens(b)} = ${t}이다. 10이 ${t}개이면 ${t * 10}이므로 □ 안의 수 1은 100을 나타낸다.`,
              facts: { calc: [[`${tens(a)}*10+${tens(b)}*10-${tens(s) % 10}*10`, 0]], unseen: [10] }
            });
          }),
          T('add-blocks-one', '수 모형을 보고 계산하기: (몇십몇)+(몇)', '①12', (d) => {
            const [a, b] = addOne(d, (x, y) => x <= 68 && ones(x) + y >= 11), o = ones(a) + b;
            return N('수 모형을 보고 계산하시오.', a + b, {
              figure: blocks(a) + blocks(b) + row(a, '+', b),
              explain: `일 모형은 모두 ${o}개이다. 일 모형 10개를 십 모형 1개로 바꾸면 십 모형 ${tens(a) + 1}개, 일 모형 ${o - 10}개가 된다. ` + shown(a, '+', b),
              facts: { calc: [[E(a, '+', b), 0]], rule: 'blocksOne' }
            });
          }),
          T('add-blocks-two', '수 모형을 보고 계산하기: 합이 세 자리 수', '①12', (d) => {
            const [a, b] = addTwo(d, d.pick(['tens', 'both']), (x, y) => ones(x) + ones(y) !== 10), o = ones(a) + ones(b), t = tens(a) + tens(b);
            return N('수 모형을 보고 계산하시오.', a + b, {
              figure: blocks(a) + blocks(b) + row(a, '+', b),
              explain: `십 모형은 모두 ${t}개, 일 모형은 모두 ${o}개이다. ` + (o >= 10 ? '일 모형 10개를 십 모형 1개로, ' : '') + '십 모형 10개를 백 모형 1개로 바꾼다. ' + shown(a, '+', b),
              facts: { calc: [[E(a, '+', b), 0]], rule: 'blocksTwo' }
            });
          }),
          T('add-count-on', '이어 세기로 더하기', '①13 심11', (d) => {
            // 17 + 6: 17, 18, 19, 20, ㉠, ㉡, ㉢
            const b = d.int(4, 6), a = d.until(() => d.int(15, 88), (x) => ones(x) >= 7 && ones(x) + b >= 11), s = a + b;
            const seen = Array.from({ length: b - 2 }, (_, i) => a + i);
            return M(`${a} + ${josa(b, '을/를')} 이어 세기로 구한다. ㉠, ㉡, ㉢에 알맞은 수는?`, [0, 1, 2].map((i) => ({ label: LABELS[i], answer: s - 2 + i })), {
              figure: table(null, [seen.concat([0, 1, 2].map((i) => box(LABELS[i])))]),
              explain: `${a}부터 ${b}만큼 이어 세면 ${Array.from({ length: b }, (_, i) => a + 1 + i).join(', ')}이다. ` + shown(a, '+', b),
              facts: { calc: [[`${a}+${b}-2`, 0], [`${a}+${b}-1`, 1], [E(a, '+', b), 2]], unseen: [2, 1] }
            });
          }),
          T('add-beads', '그림을 보고 더하기: (십몇)+(몇)', '①14', (d) => {
            const a = d.int(14, 19), b = d.until(() => d.int(4, 9), (v) => ones(a) + v >= 11);
            return N(`구슬이 ${a}개 있다. 구슬 ${b}개를 더 놓으면 구슬은 모두 몇 개인가?`, a + b, {
              unit: '개', figure: beads(a, { label: `구슬 ${a}개` }),
              explain: `구슬 ${20 - a}개를 놓아 20개를 만들고 나머지 ${b - (20 - a)}개를 더 놓는다. ` + shown(a, '+', b),
              facts: { calc: [[E(a, '+', b), 0]] }
            });
          }),
          T('add-sum', '두 수의 합', '①38 심1', (d) => {
            const b = d.int(3, 9), a = d.until(() => d.int(13, 89), (x) => ones(x) > 0 && upOnes(x, b));
            return N(`${josa(b, '과/와')} ${a}의 합은?`, a + b, { explain: `일의 자리끼리 더하면 ${b} + ${ones(a)} = ${b + ones(a)}이다. 10을 십의 자리로 올려 계산한다. ` + shown(b, '+', a), facts: { calc: [[E(b, '+', a), 0]] } });
          }),
          T('add-more', '몇만큼 더 큰 수', '①42', (d) => {
            const [a, b] = addTwo(d, 'ones');
            return N(`${a}보다 ${b}만큼 더 큰 수는?`, a + b, { explain: addWhy(a, b), facts: { calc: [[E(a, '+', b), 0]] } });
          }),
          T('add-arrow', '화살표를 따라 더하기', '①40', (d) => {
            const [a, b] = addTwo(d, 'tens');
            return N('□ 안에 알맞은 수는?', a + b, { figure: chain([a, '+' + b, box()]), explain: addWhy(a, b), facts: { calc: [[E(a, '+', b), 0]] } });
          }),
          T('add-ends', '가장 큰 수와 가장 작은 수의 합', '심21', (d) => {
            const list = d.until(() => Array.from({ length: 4 }, () => d.int(13, 97)), (xs) => {
              const s = xs.slice().sort((p, q) => p - q);
              return xs.every((x) => ones(x) > 0) && s.every((x, i) => i === 0 || x - s[i - 1] >= 4) && upOnes(s[3], s[0]);
            });
            const big = Math.max(...list), small = Math.min(...list);
            return N('네 수 중 가장 큰 수와 가장 작은 수의 합은?', big + small, {
              figure: numbers(list), explain: `가장 큰 수는 ${big}, 가장 작은 수는 ${small}이다. ` + shown(big, '+', small),
              facts: { calc: [[E(big, '+', small), 0]], ends: list }
            });
          }),
          T('add-cards', '수 카드로 만든 가장 큰 수와 가장 작은 수의 합', '①45', (d) => {
            // 9, 8, 4, 1 → 98 + 14
            const list = d.until(() => d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4), (xs) => { const s = xs.slice().sort((p, q) => q - p); return s[1] + s[2] >= 10; });
            const s = list.slice().sort((p, q) => q - p), big = s[0] * 10 + s[1], small = s[3] * 10 + s[2];
            return N('수 카드 4장 중 2장을 골라 두 자리 수를 만든다. 만들 수 있는 가장 큰 수와 가장 작은 수의 합은?', big + small, {
              figure: cards(list), explain: `가장 큰 수는 ${big}, 가장 작은 수는 ${small}이다. ` + shown(big, '+', small),
              facts: { calc: [[`(${s[0]}*10+${s[1]})+(${s[3]}*10+${s[2]})`, 0]], unseen: [10] }
            });
          }),
          T('add-digit', '덧셈식의 빈 숫자', '①47', (d) => {
            // 68 + □9 = 127
            const [a, b] = addTwo(d, 'up'), s = a + b;
            return N('□ 안에 알맞은 숫자는?', tens(b), {
              figure: column(chars(a), '+', [box(), String(ones(b))], chars(s)),
              explain: `일의 자리 계산은 ${ones(a)} + ${ones(b)} = ${ones(a) + ones(b)}이다. 십의 자리로 1을 올리면 십의 자리 계산은 1 + ${tens(a)} + □ = ${tens(s)}이므로 □ 안의 숫자는 ${tens(b)}이다.`,
              facts: { calc: [[`(${s}-${a}-${ones(b)})/10`, 0]], unseen: [s, 10] }
            });
          }),
          T('add-fix', '잘못 계산한 덧셈 바로잡기', '①37 심17', (d) => {
            // 65 + 58 = 113: 십의 자리로 올린 1을 더하지 않았다.
            const [a, b] = addTwo(d, 'up'), wrong = a + b - 10;
            return N(`${a} + ${josa(b, '을/를')} 다음과 같이 잘못 계산하였다. 바르게 계산한 값은?`, a + b, {
              figure: col(a, '+', b, chars(wrong)),
              explain: `일의 자리에서 십의 자리로 올린 1을 십의 자리 계산에 더하지 않았다. 바르게 계산하면 ${shown(a, '+', b)}이다.`,
              facts: { calc: [[E(a, '+', b), 0]], wrong }
            });
          })
        ]
      },
      {
        id: 'sub', title: '뺄셈 계산', standard: CALC,
        types: [
          T('sub-col-one', '(몇십몇)−(몇) 세로셈', '①7', (d) => { const [a, b] = subOne(d); return diff(col(a, '-', b), a, b, 'one'); }),
          T('sub-row-one', '(몇십몇)−(몇) 가로셈', '①8', (d) => { const [a, b] = subOne(d); return diff(row(a, '-', b), a, b, 'one'); }),
          T('sub-row-tens', '(몇십)−(몇) 가로셈', '①8', (d) => { const b = d.int(2, 9), a = d.int(2, 9) * 10; return diff(row(a, '-', b), a, b, 'tensOne'); }),
          T('sub-row-round', '(몇십)−(몇십몇) 가로셈', '①9', (d) => { const [a, b] = subRound(d, (x) => x <= 40); return diff(row(a, '-', b), a, b, 'round'); }),
          T('sub-col-round', '(몇십)−(몇십몇) 세로셈', '①9', (d) => { const [a, b] = subRound(d, (x) => x >= 80); return diff(col(a, '-', b), a, b, 'round'); }),
          T('sub-col-two', '(몇십몇)−(몇십몇) 세로셈', '①10', (d) => { const [a, b] = subTwo(d); return diff(col(a, '-', b), a, b, 'two'); }),
          T('sub-row-two', '(몇십몇)−(몇십몇) 가로셈', '①10', (d) => { const [a, b] = subTwo(d); return diff(row(a, '-', b), a, b, 'two'); }),
          T('sub-marks', '십의 자리에서 10을 가져온 것을 적어 가며 계산하기', '①11', (d) => {
            // 50 − 39: 십의 자리 위에 4, 일의 자리 위에 10
            const [a, b] = subRound(d, (x) => x >= 50 && x <= 60), t = tens(a);
            return M('뺄셈식에서 ㉠, ㉡에 알맞은 수와 계산 결과는?', [{ label: LABELS[0], answer: t - 1 }, { label: LABELS[1], answer: 10 }, { label: '계산 결과', answer: a - b }], {
              figure: col(a, '-', b, null, [box(LABELS[0]), box(LABELS[1])]),
              explain: `일의 자리 수 0에서 ${josa(ones(b), '을/를')} 뺄 수 없다. 십의 자리에서 10을 가져오면 십의 자리 수는 ${josa(t - 1, '이/가')} 되고 일의 자리 수는 10이 된다. ` + shown(a, '-', b),
              facts: { calc: [[`${t}-1`, 0], ['10', 1], [E(a, '-', b), 2]], unseen: [1, 10] }
            });
          }),
          T('sub-model-one', '수 모형을 보고 계산하기: (몇십몇)−(몇)', '①15 심5', (d) => {
            const [a, b] = subOne(d, (x) => x <= 78);
            return N(`${a}의 십 모형 1개를 일 모형 10개로 바꾸어 놓았다. ×표 한 것을 덜어 낼 때, □ 안에 알맞은 수는?`, a - b, {
              figure: model(tens(a) - 1, 10 + ones(a), 0, b) + row(a, '-', b),
              explain: `십 모형 ${tens(a) - 1}개와 일 모형 ${10 + ones(a) - b}개가 남는다. ` + shown(a, '-', b),
              facts: { calc: [[E(a, '-', b), 0]], rule: 'modelOne' }
            });
          }),
          T('sub-model-round', '수 모형을 보고 계산하기: (몇십)−(몇십몇)', '①15 ①17', (d) => {
            // 빼는 수부터 고른다(같은 묶음의 세로셈과 수가 겹치지 않게 고르는 차례를 달리한다).
            const b = d.until(() => d.int(12, 58), (v) => ones(v) > 0), a = d.pick([6, 7].filter((t) => t * 10 - b >= 11)) * 10;
            return N(`${a}의 십 모형 1개를 일 모형 10개로 바꾸어 놓았다. ×표 한 것을 덜어 낼 때, □ 안에 알맞은 수는?`, a - b, {
              figure: model(tens(a) - 1, 10, tens(b), ones(b)) + row(a, '-', b),
              explain: `십 모형 ${tens(a) - 1 - tens(b)}개와 일 모형 ${10 - ones(b)}개가 남는다. ` + shown(a, '-', b),
              facts: { calc: [[E(a, '-', b), 0]], rule: 'modelRound' }
            });
          }),
          T('sub-model-two', '수 모형을 보고 계산하기: (몇십몇)−(몇십몇)', '①15 심13', (d) => {
            const [a, b] = subTwo(d, (x) => x <= 79);
            return N(`${a}의 십 모형 1개를 일 모형 10개로 바꾸어 놓았다. ×표 한 것을 덜어 낼 때, □ 안에 알맞은 수는?`, a - b, {
              figure: model(tens(a) - 1, 10 + ones(a), tens(b), ones(b)) + row(a, '-', b),
              explain: `십 모형 ${tens(a) - 1 - tens(b)}개와 일 모형 ${10 + ones(a) - ones(b)}개가 남는다. ` + shown(a, '-', b),
              facts: { calc: [[E(a, '-', b), 0]], rule: 'modelTwo' }
            });
          }),
          T('sub-beads', '그림에서 덜어 낸 수를 읽어 뺄셈식 채우기', '①16', (d) => {
            const a = d.int(11, 18), b = d.until(() => d.int(3, 9), (v) => v > ones(a));
            return M('구슬 가운데 ×표 한 것을 덜어 냈다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: b }, { label: LABELS[1], answer: a - b }], {
              figure: beads(a, { out: b, label: `구슬 ${a}개 가운데 ${b}개에 ×표` }) + expr(a, '-', box(LABELS[0]), '=', box(LABELS[1])),
              explain: `×표 한 구슬은 ${b}개이다. ` + shown(a, '-', b),
              facts: { calc: [[String(b), 0], [E(a, '-', b), 1]] }
            });
          }),
          T('sub-diff', '두 수의 차', '①39 심4 심6', (d) => {
            // 작은 수가 앞에 놓이기도 한다(27과 45의 차).
            const [a, b] = subTwo(d), [x, y] = d.bool() ? [a, b] : [b, a];
            return N(`${josa(x, '과/와')} ${y}의 차는?`, a - b, { explain: '두 수의 차는 큰 수에서 작은 수를 뺀 값이다. ' + shown(a, '-', b), facts: { calc: [[E(a, '-', b), 0]] } });
          }),
          T('sub-less', '몇만큼 더 작은 수', '①42', (d) => {
            const [a, b] = subOne(d);
            return N(`${a}보다 ${b}만큼 더 작은 수는?`, a - b, { explain: subWhy(a, b), facts: { calc: [[E(a, '-', b), 0]] } });
          }),
          T('sub-arrow', '화살표를 따라 빼기', '①40 심4', (d) => {
            const [a, b] = subTwo(d);
            return N('□ 안에 알맞은 수는?', a - b, { figure: chain([a, '-' + b, box()]), explain: subWhy(a, b), facts: { calc: [[E(a, '-', b), 0]] } });
          }),
          T('sub-ends', '가장 큰 수와 가장 작은 수의 차', '①44', (d) => {
            // 35, 6, 18, 27 → 35 − 6
            const small = d.int(4, 9), big = d.until(() => d.int(31, 98), (x) => ones(x) > 0 && ones(x) < small);
            const rest = d.until(() => [d.int(12, big - 4), d.int(12, big - 4)], ([p, q]) => Math.abs(p - q) >= 4);
            const list = d.shuffle([big, small, rest[0], rest[1]]);
            return N('네 수 중 가장 큰 수와 가장 작은 수의 차는?', big - small, {
              figure: numbers(list), explain: `가장 큰 수는 ${big}, 가장 작은 수는 ${small}이다. ` + shown(big, '-', small),
              facts: { pairs: { numbers: list, want: 'maxDiff' }, calc: [[E(big, '-', small), 0]] }
            });
          }),
          T('sub-digit', '뺄셈식의 빈 숫자', '①47', (d) => {
            // 47 − □9 = 18
            const [a, b] = subTwo(d), c = a - b;
            return N('□ 안에 알맞은 숫자는?', tens(b), {
              figure: column(chars(a), '-', [box(), String(ones(b))], chars(c)),
              explain: `일의 자리 수 ${ones(a)}에서 ${josa(ones(b), '을/를')} 뺄 수 없어 십의 자리에서 10을 가져온다. 십의 자리 계산은 ${tens(a) - 1} − □ = ${tens(c)}이므로 □ 안의 숫자는 ${tens(b)}이다.`,
              facts: { calc: [[`(${a}-${c}-${ones(b)})/10`, 0]], unseen: [c, 10] }
            });
          }),
          T('sub-fix', '잘못 계산한 뺄셈 바로잡기', '①37', (d) => {
            // 83 − 37 = 56: 십의 자리 수를 1 줄이지 않았다.
            const [a, b] = subTwo(d), wrong = a - b + 10;
            return N(`${a} − ${josa(b, '을/를')} 다음과 같이 잘못 계산하였다. 바르게 계산한 값은?`, a - b, {
              figure: col(a, '-', b, chars(wrong)),
              explain: `십의 자리에서 10을 가져왔으므로 십의 자리 수는 1 작아진 ${tens(a) - 1}이다. 바르게 계산하면 ${shown(a, '-', b)}이다.`,
              facts: { calc: [[E(a, '-', b), 0]], wrong }
            });
          })
        ]
      },
      {
        id: 'ways', title: '여러 가지 방법으로 계산하기', standard: CALC,
        types: [
          T('ways-add-one', '(몇십몇)+(몇): 몇십을 만들어 더하기', '심11', (d) => {
            // 28 + 4 = 28 + 2 + ㉠ = 30 + ㉠ = ㉡
            const [a, b] = addOne(d, (x, y) => ones(x) + y >= 11), need = 10 - ones(a), rest = b - need;
            return M(`${a} + ${josa(b, '을/를')} 다음과 같이 계산한다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: rest }, { label: LABELS[1], answer: a + b }], {
              figure: steps(expr(a, '+', b), [expr('=', a, '+', need, '+', box(LABELS[0])), expr('=', a + need, '+', box(LABELS[0])), expr('=', box(LABELS[1]))]),
              explain: `${josa(b, '을/를')} ${josa(need, '과/와')} ${josa(rest, '으로/로')} 가른다. ${shown(a, '+', need)}, ${shown(a + need, '+', rest)}`,
              facts: { calc: [[`${b}-${need}`, 0], [E(a, '+', b), 1]], rule: 'makeTenOne' }
            });
          }),
          T('ways-add-split', '더하는 수를 몇십과 몇으로 갈라 더하기', '①18 심11', (d) => {
            // 47 + 19 = 47 + 10 + ㉠ = 57 + ㉠ = ㉡
            const [a, b] = addTwo(d, 'ones'), ten = tens(b) * 10;
            return M(`${a} + ${josa(b, '을/를')} 다음과 같이 계산한다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: ones(b) }, { label: LABELS[1], answer: a + b }], {
              figure: steps(expr(a, '+', b), [expr('=', a, '+', ten, '+', box(LABELS[0])), expr('=', a + ten, '+', box(LABELS[0])), expr('=', box(LABELS[1]))]),
              explain: `${josa(b, '을/를')} ${josa(ten, '과/와')} ${josa(ones(b), '으로/로')} 가른다. ${shown(a, '+', ten)}, ${shown(a + ten, '+', ones(b))}`,
              facts: { calc: [[`${b}-${ten}`, 0], [E(a, '+', b), 1]], rule: 'splitTens' }
            });
          }),
          T('ways-add-round', '더하는 수를 몇십으로 보고 더한 뒤 빼기', '①19', (d) => {
            // 24 + 17 = 24 + 20 − ㉠ = 44 − ㉠ = ㉡
            const [a, b] = addTwo(d, 'ones', (x, y) => ones(y) >= 7 && x + (tens(y) + 1) * 10 <= 99), round = (tens(b) + 1) * 10, over = round - b;
            return M(`${a} + ${josa(b, '을/를')} 다음과 같이 계산한다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: over }, { label: LABELS[1], answer: a + b }], {
              figure: steps(expr(a, '+', b), [expr('=', a, '+', round, '-', box(LABELS[0])), expr('=', a + round, '-', box(LABELS[0])), expr('=', box(LABELS[1]))]),
              explain: `${josa(b, '을/를')} ${josa(round, '으로/로')} 보고 더하면 ${over}만큼 더 더한 것이다. 더 더한 ${josa(over, '을/를')} 뺀다. ${shown(a + round, '-', over)}`,
              facts: { calc: [[`${round}-${b}`, 0], [E(a, '+', b), 1]] }
            });
          }),
          T('ways-add-make', '앞의 수가 몇십이 되게 갈라 더하기', '①20 심11', (d) => {
            // 29 + 17 = 29 + 1 + ㉠ = ㉡ + ㉠ = ㉢
            const [a, b] = addTwo(d, 'ones', (x, y) => ones(x) >= 6 && (y - (10 - ones(x))) % 10 !== 0 && y - (10 - ones(x)) >= 11), need = 10 - ones(a), rest = b - need;
            return M(`${a} + ${josa(b, '을/를')} 다음과 같이 계산한다. ㉠, ㉡, ㉢에 알맞은 수는?`, [{ label: LABELS[0], answer: rest }, { label: LABELS[1], answer: a + need }, { label: LABELS[2], answer: a + b }], {
              figure: steps(expr(a, '+', b), [expr('=', a, '+', need, '+', box(LABELS[0])), expr('=', box(LABELS[1]), '+', box(LABELS[0])), expr('=', box(LABELS[2]))]),
              explain: `${josa(b, '을/를')} ${josa(need, '과/와')} ${josa(rest, '으로/로')} 가른다. ${shown(a, '+', need)}, ${shown(a + need, '+', rest)}`,
              facts: { calc: [[`${b}-${need}`, 0], [`${a}+${need}`, 1], [E(a, '+', b), 2]] }
            });
          }),
          T('ways-add-places', '십의 자리끼리, 일의 자리끼리 더하기', '①21', (d) => {
            // 56 + 34 = 50 + ㉠ + 6 + 4 = 80 + ㉡ = ㉢
            const [a, b] = addTwo(d, 'ones'), ta = tens(a) * 10, tb = tens(b) * 10, o = ones(a) + ones(b);
            return M(`${a} + ${josa(b, '을/를')} 다음과 같이 계산한다. ㉠, ㉡, ㉢에 알맞은 수는?`, [{ label: LABELS[0], answer: tb }, { label: LABELS[1], answer: o }, { label: LABELS[2], answer: a + b }], {
              figure: steps(expr(a, '+', b), [expr('=', ta, '+', box(LABELS[0]), '+', ones(a), '+', ones(b)), expr('=', ta + tb, '+', box(LABELS[1])), expr('=', box(LABELS[2]))]),
              explain: `${josa(a, '을/를')} ${josa(ta, '과/와')} ${ones(a)}, ${josa(b, '을/를')} ${josa(tb, '과/와')} ${josa(ones(b), '으로/로')} 가른다. 몇십끼리 더하면 ${shown(ta, '+', tb)}, 몇끼리 더하면 ${shown(ones(a), '+', ones(b))}이다. ${shown(ta + tb, '+', o)}`,
              facts: { calc: [[`${b}-${ones(b)}`, 0], [`${ones(a)}+${ones(b)}`, 1], [E(a, '+', b), 2]] }
            });
          }),
          T('ways-add-pick', '수를 갈라 바르게 더한 것 고르기', '①22', (d) => {
            // 68 + 16: 16을 2와 14로 가른다.
            const [a, b] = addTwo(d, 'ones', (x, y) => ones(x) >= 6 && y - (10 - ones(x)) >= 11), need = 10 - ones(a), rest = b - need;
            const rows = d.shuffle([
              { parts: [need, rest], ok: true },             // 더하는 수를 need 와 rest 로 바르게 가름
              { parts: [need, b], ok: false },               // need 를 더하고도 더하는 수를 그대로 또 더한 아이
              { parts: [need, rest - 10], ok: false }        // 가르고 남은 수의 십의 자리를 빠뜨린 아이
            ]);
            const said = ({ parts: [p, q] }) => `${a} + ${p} + ${q} = ${a + p} + ${q} = ${a + p + q}`;
            return C(`${a} + ${josa(b, '을/를')} 바르게 계산한 것은?`, rows.map(said), rows.findIndex((r) => r.ok), {
              explain: `${josa(b, '을/를')} ${josa(need, '과/와')} ${josa(rest, '으로/로')} 가른다. ${shown(a, '+', need)}, ${shown(a + need, '+', rest)}`,
              facts: { claimed: rows.map(({ parts: [p, q] }) => [E(a, '+', b), a + p + q]), claimedWant: true }
            });
          }),
          T('ways-sub-split', '빼는 수를 몇십과 몇으로 갈라 빼기', '①23', (d) => {
            // 52 − 28 = 52 − 20 − ㉠ = 32 − ㉠ = ㉡
            const [a, b] = (d.bool() ? subRound : subTwo)(d), ten = tens(b) * 10;
            return M(`${a} − ${josa(b, '을/를')} 다음과 같이 계산한다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: ones(b) }, { label: LABELS[1], answer: a - b }], {
              figure: steps(expr(a, '-', b), [expr('=', a, '-', ten, '-', box(LABELS[0])), expr('=', a - ten, '-', box(LABELS[0])), expr('=', box(LABELS[1]))]),
              explain: `${josa(b, '을/를')} ${josa(ten, '과/와')} ${josa(ones(b), '으로/로')} 가른다. ${shown(a, '-', ten)}, ${shown(a - ten, '-', ones(b))}`,
              facts: { calc: [[`${b}-${ten}`, 0], [E(a, '-', b), 1]] }
            });
          }),
          T('ways-sub-round', '빼는 수를 몇십으로 보고 뺀 뒤 더하기', '①24 심10', (d) => {
            // 63 − 19 = 63 − 20 + ㉠ = 43 + ㉠ = ㉡
            const [a, b] = (d.bool() ? subRound : subTwo)(d, (x, y) => ones(y) >= 7 && x - (tens(y) + 1) * 10 >= 10), round = (tens(b) + 1) * 10, over = round - b;
            return M(`${a} − ${josa(b, '을/를')} 다음과 같이 계산한다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: over }, { label: LABELS[1], answer: a - b }], {
              figure: steps(expr(a, '-', b), [expr('=', a, '-', round, '+', box(LABELS[0])), expr('=', a - round, '+', box(LABELS[0])), expr('=', box(LABELS[1]))]),
              explain: `${josa(b, '을/를')} ${josa(round, '으로/로')} 보고 빼면 ${over}만큼 더 뺀 것이다. 더 뺀 ${josa(over, '을/를')} 더한다. ${shown(a - round, '+', over)}`,
              facts: { calc: [[`${round}-${b}`, 0], [E(a, '-', b), 1]], rule: 'subRound' }
            });
          }),
          T('ways-sub-front', '앞의 수를 몇십과 몇으로 갈라 빼기', '①25', (d) => {
            // 74 − 58 = 70 − 58 + ㉠ = 12 + ㉠ = ㉡
            const [a, b] = subTwo(d, (x, y) => tens(x) * 10 - y >= 2), ten = tens(a) * 10;
            return M(`${a} − ${josa(b, '을/를')} 다음과 같이 계산한다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: ones(a) }, { label: LABELS[1], answer: a - b }], {
              figure: steps(expr(a, '-', b), [expr('=', ten, '-', b, '+', box(LABELS[0])), expr('=', ten - b, '+', box(LABELS[0])), expr('=', box(LABELS[1]))]),
              explain: `${josa(a, '을/를')} ${josa(ten, '과/와')} ${josa(ones(a), '으로/로')} 가른다. ${shown(ten, '-', b)}, ${shown(ten - b, '+', ones(a))}`,
              facts: { calc: [[`${a}-${ten}`, 0], [E(a, '-', b), 1]], rule: 'subFront' }
            });
          })
        ]
      }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
