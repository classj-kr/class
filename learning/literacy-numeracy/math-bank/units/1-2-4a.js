// 1학년 2학기 4단원 덧셈과 뺄셈(2) — 단원 틀, 그림 도구, 덧셈 문항(뺄셈과 실력은 1-2-4b.js).
// 수집해 둔 교과서(국정 한 종)의 평가 자료에서 뽑은 꼴 목록(기본꼴_1 65꼴, 심화꼴 50꼴)을 처음부터 끝까지 대조하여 실었다.
// 꼴 번호는 ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번. 꼴(무엇을 주고 무엇을 묻는가)만 따르고 수와 상황은 새로 썼다.
//
// 영역과 성취기준: 수와 연산. [2수01-05] 덧셈과 뺄셈의 의미(문장제), [2수01-06] 가운데 (몇) + (몇) = (십몇), (십몇) − (몇) = (몇).
//
// 싣는 기준
//  - 수의 범위: 덧셈은 한 자리 수끼리 더해 합이 11~18, 뺄셈은 11~18에서 한 자리 수를 빼어 차가 2~9. 답을 구하는 계산은 모두 이 안에 있다.
//    (10을 만드는 과정에 나오는 7 + 3 = 10, 15 − 5 = 10, 10 − 2 = 8, 3 + 5 = 8과 두 단계 문항의 첫 단계만 이 범위 밖의 한 자리 수 계산이다.)
//  - 계산 방법의 빈칸은 교과서의 방법 그대로만 묻는다: 가르기 선 아래의 두 수, 10을 만든 뒤의 식. 방법의 이름은 묻지 않는다.
//  - 식만 주는 계산은 구조(덧셈/뺄셈, 가르는 수가 앞인가 뒤인가)와 나타내는 방법(그림, 과정의 빈칸, 가로식, 표)이 다를 때만 다른 유형으로 쳤다.
//    화살표 한 단계(①12·41 심7)와 상자 속 두 수의 합은 가로식과 같은 계산 한 번이라 가로식 하나로 묶었다.
//  - □가 든 식은 앞 식을 되짚으면 보이는 것만 실었다(두 수를 바꾼 식, 한 수가 1 큰 식, 그림에서 더 그릴 개수).
//  - 답 칸에는 숫자만 적는다. >, =, <와 말은 고르기로 받는다. 그리기·색칠하기는 그려 놓은 그림을 읽는 문항이나 세는 문항으로 바꾸었다.
//  - 낱말은 교과서의 말을 따랐다: 「같은 수에 1씩 큰 수를 더하면」「두 수를 바꾸어 더하면」「가르다」. 더해지는 수·빼어지는 수라는 말은 쓰지 않는다.
//
// 뺀 것과 까닭(뺄셈 쪽은 1-2-4b.js 머리에 적었다)
//  - 수의 범위 밖: 끝 식의 합이 10이 되는 덧셈 줄(①13 변형)
//  - 뜻 없는 셈: 홀수만 골라 더하기(①29 심19 — 홀수를 가려내는 일은 1-2-1의 것이고, 가려낸 수를 더하는 데는 뜻이 없다)
//  - 조건 풀이: 주사위 눈의 합이 더 커지는 눈 찾기(심21)
//  - 서술형: 알게 된 점 쓰기(①14·18 변형), 풀이 쓰기(①24 변형 — 답만 묻는 문항으로 실음)
//  - 같은 일: 주사위 눈·타일 그림(①3·4 변형 — 두 무리를 세어 더하는 그림과 같다), 합이 13인 칸을 칠해 나타나는 숫자(심15 — 합이 같은 식 세기와 같다)
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, LABELS, box, expr, lines, tagged, numbers, cards, table, N, M, C, E, shown } = B.kit;
  const MEAN = '2수01-05', CALC = '2수01-06';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});

  // ── 수 고르기 ────────────────────────────────────────────────
  // (몇) + (몇) = (십몇): 두 수는 2~9, 합은 11~18.  (십몇) − (몇) = (몇): 11~18에서 2~9를 빼어 차가 2~9.
  const ADDS = [], SUBS = [];
  for (let a = 2; a <= 9; a += 1) for (let b = 2; b <= 9; b += 1) if (a + b >= 11) ADDS.push([a, b]);
  for (let m = 11; m <= 18; m += 1) for (let s = 2; s <= 9; s += 1) if (m - s >= 2 && m - s <= 9) SUBS.push([m, s]);
  const isAdd = (a, b) => a >= 2 && a <= 9 && b >= 2 && b <= 9 && a + b >= 11;
  const isSub = (m, s) => m >= 11 && m <= 18 && s >= 2 && s <= 9 && m - s >= 2 && m - s <= 9;
  const addOf = (d, ok) => d.until(() => d.pick(ADDS), ok || (() => true));
  const subOf = (d, ok) => d.until(() => d.pick(SUBS), ok || (() => true));
  const sumOf = (p) => p[0] + p[1], difOf = (p) => p[0] - p[1];
  const keyOf = (p) => p[0] + ',' + p[1];
  const allDiffer = (list) => new Set(list.map(keyOf)).size === list.length;
  // 글 속에 적는 식: say(7, '+', 5, 12) → '7 + 5 = 12'
  const say = (a, op, b, c) => a + (op === '+' ? ' + ' : ' − ') + b + (c === undefined ? '' : ' = ' + c);
  const SIGNS = ['&gt;', '=', '&lt;'];
  const signOf = (x, y) => (x > y ? 0 : x === y ? 1 : 2);
  const versus = (left, right) => '<div class="mb-versus">' + left + '<span class="mb-ring"></span>' + right + '</div>';
  const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  const PAIRS4 = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];

  // ── 그림 ─────────────────────────────────────────────────────
  // 물건은 간단한 도형으로 그리고 두 무리를 빛깔(과 모양)로 가른다. 그림 속 수는 그림 설명(aria-label)에 적는다.
  const PAINT = { red: ['#fca5a5', '#b91c1c'], blue: ['#93c5fd', '#1d4ed8'], yellow: ['#fcd34d', '#a16207'], green: ['#86efac', '#15803d'], cream: ['#fffaf0', '#8a6a3b'] };
  const ink = (color) => 'style="fill:' + PAINT[color][0] + ';stroke:' + PAINT[color][1] + ';stroke-width:1.2"';
  const r1 = (v) => Math.round(v * 10) / 10;
  function mark(kind, x, y, r, color) {
    if (kind === 'tri') return '<path d="M' + r1(x) + ' ' + r1(y - r) + 'L' + r1(x + r) + ' ' + r1(y + r * 0.8) + 'H' + r1(x - r) + 'Z" ' + ink(color) + '/>';
    if (kind === 'box') return '<rect x="' + r1(x - r) + '" y="' + r1(y - r) + '" width="' + r1(2 * r) + '" height="' + r1(2 * r) + '" rx="1.5" ' + ink(color) + '/>';
    if (kind === 'egg') return '<ellipse cx="' + r1(x) + '" cy="' + r1(y) + '" rx="' + r1(r * 0.8) + '" ry="' + r1(r) + '" ' + ink(color) + '/>';
    return '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + r + '" ' + ink(color) + '/>';
  }
  // /표: 덜어 낸 물건 위에 긋는다.
  const slash = (x, y, r) => '<path d="M' + r1(x - r) + ' ' + r1(y + r) + 'L' + r1(x + r) + ' ' + r1(y - r) + '" style="stroke:#b42318;stroke-width:2.2;stroke-linecap:round;fill:none"/>';
  const pic = (w, h, label, body) => '<svg class="mb-dots" viewBox="0 0 ' + Math.ceil(w) + ' ' + Math.ceil(h) + '" width="' + Math.ceil(w) + '" role="img" aria-label="' + label + '">' + body + '</svg>';

  // 무리마다 다섯 개씩 끊어 두 줄로 놓는다. groups: [{ n(10까지), kind, color, cut(뒤에서부터 /표 한 개수) }]
  function heaps(groups, label) {
    const pad = 8, step = 19, gap = 22; let x0 = pad, out = '';
    for (const g of groups) {
      for (let i = 0; i < g.n; i += 1) {
        const x = x0 + (i % 5) * step + step / 2, y = pad + Math.floor(i / 5) * step + step / 2;
        out += mark(g.kind, x, y, 7, g.color) + (i >= g.n - (g.cut || 0) ? slash(x, y, 8.5) : '');
      }
      x0 += 5 * step + gap;
    }
    return pic(x0 - gap + pad, pad * 2 + 2 * step, label, out);
  }
  // 물건 total 개(11~18)를 10개와 나머지로 놓고, 뒤에서부터 cut 개에 /표를 한다.
  const crossed = (total, cut, kind, color, label) => heaps([{ n: 10, kind, color, cut: Math.max(0, cut - (total - 10)) }, { n: total - 10, kind, color, cut: Math.min(cut, total - 10) }], label);
  // 윗줄과 아랫줄. 다섯 개마다 틈을 둔다. link: 위아래를 하나씩 짝 지어 선으로 잇는다.
  function twoRows(top, bottom, label, o) {
    const step = (o && o.step) || 13.6, r = (o && o.r) || 5.2, link = Boolean(o && o.link), pad = 8, five = 4;
    const xOf = (i) => pad + i * step + Math.floor(i / 5) * five + step / 2, n = Math.max(top.n, bottom.n), y1 = pad + r, y2 = y1 + (link ? 28 : 2 * r + 7);
    let out = '';
    if (link) for (let i = 0; i < Math.min(top.n, bottom.n); i += 1) out += '<path d="M' + r1(xOf(i)) + ' ' + r1(y1 + r) + 'V' + r1(y2 - r) + '" style="stroke:#64748b;stroke-width:1.1;fill:none"/>';
    for (let i = 0; i < top.n; i += 1) out += mark(top.kind, xOf(i), y1, r, top.color);
    for (let i = 0; i < bottom.n; i += 1) out += mark(bottom.kind, xOf(i), y2, r, bottom.color);
    return pic(xOf(n - 1) + step / 2 + pad, y2 + r + pad, label, out);
  }
  // 십 배열판(2줄 5칸)을 count 개 놓고 왼쪽 위 칸부터 채운다. marks: [{ kind, color }] — 칸 차례대로.
  function frames(marks, label, count) {
    const cell = 22, gap = 14, pad = 6, n = count || 2;
    let out = '';
    for (let f = 0; f < n; f += 1) {
      const x0 = pad + f * (5 * cell + gap);
      out += '<rect x="' + x0 + '" y="' + pad + '" width="' + 5 * cell + '" height="' + 2 * cell + '" style="fill:#fff;stroke:#334155;stroke-width:1.5"/>';
      for (let c = 1; c < 5; c += 1) out += '<path d="M' + (x0 + c * cell) + ' ' + pad + 'v' + 2 * cell + '" style="stroke:#94a3b8;stroke-width:1;fill:none"/>';
      out += '<path d="M' + x0 + ' ' + (pad + cell) + 'h' + 5 * cell + '" style="stroke:#94a3b8;stroke-width:1;fill:none"/>';
    }
    marks.forEach((m, i) => {
      const f = Math.floor(i / 10), k = i % 10, x = pad + f * (5 * cell + gap) + (k % 5) * cell + cell / 2, y = pad + Math.floor(k / 5) * cell + cell / 2;
      out += mark(m.kind, x, y, m.kind === 'tri' ? 7.4 : 7, m.color);
    });
    return pic(pad * 2 + n * 5 * cell + (n - 1) * gap, pad * 2 + 2 * cell, label, out);
  }
  // ○ a개를 그리고 이어서 △ b개를 그린 십 배열판
  const ringsAndTris = (a, b) => frames(Array.from({ length: a }, () => ({ kind: 'dot', color: 'red' })).concat(Array.from({ length: b }, () => ({ kind: 'tri', color: 'blue' }))), '십 배열판: ○ ' + a + '개' + (b ? ', △ ' + b + '개' : ''));
  // 달걀판(10칸)에 가득 담긴 달걀과 판 밖의 달걀. used 개에 /표를 한다(판 밖의 것부터).
  function tray(total, used) {
    const cell = 22, pad = 6, loose = total - 10, cutLoose = Math.min(used, loose), cutTray = used - cutLoose;
    let out = '<rect x="' + pad + '" y="' + pad + '" width="' + 5 * cell + '" height="' + 2 * cell + '" rx="8" style="fill:#ead7b7;stroke:#8a6a3b;stroke-width:1.4"/>';
    for (let i = 0; i < 10; i += 1) {
      const x = pad + (i % 5) * cell + cell / 2, y = pad + Math.floor(i / 5) * cell + cell / 2;
      out += '<circle cx="' + x + '" cy="' + y + '" r="9.6" style="fill:#d6bd92;stroke:none"/>' + mark('egg', x, y, 8.2, 'cream') + (i >= 10 - cutTray ? slash(x, y, 8.5) : '');
    }
    const x0 = pad + 5 * cell + 16;
    for (let i = 0; i < loose; i += 1) {
      const x = x0 + (i % 4) * cell + cell / 2, y = pad + Math.floor(i / 4) * cell + cell / 2;
      out += mark('egg', x, y, 8.2, 'cream') + (i >= loose - cutLoose ? slash(x, y, 8.5) : '');
    }
    return pic(x0 + 4 * cell + pad, pad * 2 + 2 * cell, '달걀 ' + total + '개(달걀판에 10개, 달걀판 밖에 ' + loose + '개) 가운데 ' + used + '개에 /표', out);
  }
  // 가르기 그림: 식의 한 수 아래로 두 갈래 선을 긋고 가른 두 수를 적는다. 조각이 { blank: '㉠' } 이면 빈칸이다.
  // tokens: 식의 조각, at: 가르는 조각의 번호, parts: 가른 두 수(왼쪽, 오른쪽)
  function tree(tokens, at, parts, label) {
    const isBlank = (t) => typeof t === 'object', wOf = (t) => (isBlank(t) ? 26 : String(t).length * 11 + 4), gap = 9, top = 24, low = 72;
    let x = 32; const xs = tokens.map((t) => { const cx = x + wOf(t) / 2; x += wOf(t) + gap; return cx; });
    const piece = (t, cx, cy) => (isBlank(t)
      ? '<rect x="' + r1(cx - 12.5) + '" y="' + (cy - 18) + '" width="25" height="25" rx="4" style="fill:#fff;stroke:#1f2933;stroke-width:1.8"/><text x="' + r1(cx) + '" y="' + (cy - 1) + '" text-anchor="middle" style="font-size:13px;fill:#1f2933">' + t.blank + '</text>'
      : '<text x="' + r1(cx) + '" y="' + cy + '" text-anchor="middle" style="font-size:19px;font-weight:600;fill:#1f2933">' + t + '</text>');
    let out = tokens.map((t, i) => piece(t, xs[i], top)).join('');
    out += '<path d="M' + r1(xs[at] - 3) + ' ' + (top + 7) + 'L' + r1(xs[at] - 18) + ' ' + (low - 23) + 'M' + r1(xs[at] + 3) + ' ' + (top + 7) + 'L' + r1(xs[at] + 18) + ' ' + (low - 23) + '" style="stroke:#1d4ed8;stroke-width:1.7;fill:none;stroke-linecap:round"/>';
    out += piece(parts[0], xs[at] - 21, low) + piece(parts[1], xs[at] + 21, low);
    return pic(Math.max(x - gap + 12, xs[at] + 46), low + 14, label, out);
  }
  const blank = (label) => ({ blank: label });
  // 이어 세기·거꾸로 세기의 수 띠. 처음 수는 빛깔을 넣는다.
  const cellOf = (v, first) => '<span style="display:inline-flex;align-items:center;justify-content:center;min-width:1.95em;height:1.95em;border:1.6px solid ' + (first ? '#1d4ed8' : '#8a96a3') + ';border-radius:8px;background:' + (first ? '#dbeafe' : '#fff') + ';font-weight:600;font-variant-numeric:tabular-nums">' + v + '</span>';
  const strip = (cells) => '<div style="display:flex;flex-wrap:wrap;gap:4px;align-items:center">' + cells.map((v, i) => cellOf(v, i === 0)).join('') + '</div>';
  // 식이 줄지어 놓인 표. 칸은 [윗글, 아랫글(없어도 된다)].
  const cellHtml = (c) => '<td style="background:#fff;font-weight:400;padding:6px 9px"><div>' + c[0] + '</div>' + (c.length > 1 ? '<div style="font-weight:700;min-height:1.7em">' + c[1] + '</div>' : '') + '</td>';
  const grid = (rows) => '<div class="mb-table-wrap"><table class="mb-table"><tbody>' + rows.map((row) => '<tr>' + row.map(cellHtml).join('') + '</tr>').join('') + '</tbody></table></div>';
  // 방법마다 이름을 붙인 그림
  const way = (title, html) => '<figure class="mb-blocks"><figcaption>' + title + '</figcaption>' + html + '</figure>';
  // 같은 단원의 b 파일이 쓴다.
  B.kit.g124 = { ADDS, SUBS, isAdd, isSub, addOf, subOf, sumOf, difOf, keyOf, allDiffer, say, SIGNS, signOf, versus, ORDERS, PAIRS4, mark, slash, pic, heaps, crossed, twoRows, frames, ringsAndTris, tray, tree, blank, strip, grid, way, MEAN, CALC };

  const dot = (n, color) => ({ n, kind: 'dot', color });

  B.addUnit({
    id: '1-2-4', grade: 1, semester: 2, no: 4, title: '덧셈과 뺄셈(2)', version: 1,
    groups: [
      {
        id: 'addsee', title: '덧셈 알아보기', standard: CALC,
        types: [
          T('see-counton', '이어 세기로 덧셈하기', '①1 심3', (d) => {
            // 9개와 4개: 9 → 10, 11, ㉠, ㉡
            const [a, b] = addOf(d, (p) => p[0] >= 6 && p[1] >= 3 && p[1] <= 5), s = a + b;
            const cells = [a]; for (let v = a + 1; v <= s; v += 1) cells.push(v === s - 1 ? LABELS[0] : v === s ? LABELS[1] : v);
            const counted = Array.from({ length: b }, (_, i) => a + 1 + i).join(', ');
            return M(`구슬이 모두 몇 개인지 ${a}에서부터 이어 세었다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: s - 1 }, { label: LABELS[1], answer: s }], {
              figure: heaps([dot(a, 'red'), dot(b, 'blue')], `빨간 구슬 ${a}개, 파란 구슬 ${b}개`) + strip(cells),
              explain: `${a} 다음 수부터 ${b}개를 이어 세면 ${counted}이다. 구슬은 모두 ${s}개이다.`,
              facts: { calc: [[`${a}+${b}-1`, 0], [`${a}+${b}`, 1]], unseen: [1] }
            });
          }),
          T('see-beads', '그림을 보고 덧셈하기', '①3 심1', (d) => {
            // 윗줄 구슬 7개, 아랫줄 구슬 4개
            const [a, b] = addOf(d);
            return N('그림을 보고 덧셈을 하시오.', a + b, {
              figure: twoRows(dot(a, 'yellow'), dot(b, 'green'), `윗줄에 구슬 ${a}개, 아랫줄에 구슬 ${b}개`, { step: 19, r: 7 }) + expr(a, '+', b, '=', box()),
              explain: shown(a, '+', b), facts: { calc: [[E(a, '+', b), 0]] }
            });
          }),
          T('see-frame', '십 배열판을 보고 모두 몇 개인지 구하기', '①2 ①3 심2', (d) => {
            // ○ 8개에 △ 5개를 이어 그렸다: △ 2개로 한 판이 가득 차고 3개가 남는다.
            const [a, b] = addOf(d, (p) => p[0] >= 5), fill = 10 - a, rest = b - fill;
            return N('○와 △는 모두 몇 개인가?', a + b, {
              unit: '개', figure: ringsAndTris(a, b),
              explain: `○ ${a}개와 △ ${fill}개로 십 배열판 하나가 가득 찬다. 10개와 ${rest}개이므로 모두 ${a + b}개이다.`,
              facts: { calc: [[E(a, '+', b), 0]] }
            });
          }),
          T('see-write', '그림을 보고 덧셈식의 빈칸 채우기', '①4 심1', (d) => {
            const [a, b] = addOf(d);
            return M('구슬이 모두 몇 개인지 덧셈식으로 나타내었다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: b }, { label: LABELS[1], answer: a + b }], {
              figure: heaps([dot(a, 'yellow'), dot(b, 'green')], `노란 구슬 ${a}개, 초록 구슬 ${b}개`) + expr(a, '+', box(LABELS[0]), '=', box(LABELS[1])),
              explain: `노란 구슬이 ${a}개, 초록 구슬이 ${b}개이다. ${say(a, '+', b, a + b)}`,
              facts: { calc: [[String(b), 0], [E(a, '+', b), 1]] }
            });
          }),
          T('see-pick', '그림에 알맞은 덧셈식 고르기', '①5 심1', (d) => {
            // ○ 6개, △ 7개 → 6 + 7 = 13. 틀린 보기는 한 수만 1 다른 식(식 자체는 맞는 계산이다).
            const [a, b] = addOf(d, (p) => p[0] >= 5 && p[0] <= 8 && p[1] <= 8 && p[0] + p[1] >= 12);
            const near = d.shuffle([[a - 1, b], [a + 1, b], [a, b - 1], [a, b + 1]]).slice(0, 3);
            const list = d.shuffle(near.concat([[a, b]]));
            return C('그림에 알맞은 덧셈식은?', list.map((p) => say(p[0], '+', p[1], p[0] + p[1])), list.findIndex((p) => p[0] === a && p[1] === b), {
              figure: ringsAndTris(a, b), explain: `○가 ${a}개, △가 ${b}개이다. ${say(a, '+', b, a + b)}`,
              facts: { truth: list.map((p) => p[0] === a && p[1] === b), want: true }
            });
          }),
          T('see-more', '모두 몇 개가 되게 더 그릴 개수', '심2 ①15', (d) => {
            // ○ 9개에 △를 더 그려 모두 12개 → 9 + □ = 12
            const [a, b] = addOf(d, (p) => p[0] >= 5), c = a + b;
            return N(`○가 ${a}개 있다. △를 더 그려 모두 ${c}개가 되게 하려고 한다. △를 몇 개 그려야 하는가?`, b, {
              unit: '개', figure: ringsAndTris(a, 0) + expr(a, '+', box(), '=', c),
              explain: `△ ${10 - a}개를 그리면 10개가 되고, ${c - 10}개를 더 그리면 ${c}개가 된다. ${say(a, '+', b, c)}`,
              facts: { inverse: ['b+x=a', c, a], calc: [[E(c, '-', a), 0]] }
            });
          })
        ]
      },
      {
        id: 'addten', title: '10을 만들어 더하기', standard: CALC,
        types: [
          T('ten-back', '뒤의 수를 갈라 더하기', '①6 심4', (d) => {
            // 7 + 5: 5를 3과 ㉠으로 → 7 + 3 = 10, 10 + 2 = 12
            const [a, b] = addOf(d, (p) => p[0] !== p[1] && p[0] >= 4), fill = 10 - a, rest = b - fill;
            return M('뒤의 수를 갈라 10을 만들어 더한다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: rest }, { label: LABELS[1], answer: a + b }], {
              figure: tree([a, '+', b, '=', blank(LABELS[1])], 2, [fill, blank(LABELS[0])], `가르기 그림: ${a} + ${b} = □에서 ${josa(b, '을/를')} ${josa(fill, '과/와')} □로 가름`),
              explain: `${say(a, '+', fill, 10)}이므로 ${josa(b, '을/를')} ${josa(fill, '과/와')} ${josa(rest, '으로/로')} 가른다. ${say(10, '+', rest, a + b)}`,
              facts: { calc: [[`${b}-${fill}`, 0], [E(a, '+', b), 1]], rule: 'split-back' }
            });
          }),
          T('ten-backpic', '십 배열판을 보고 10을 만들어 더하기', '①6 ①3', (d) => {
            // ○ 8개, △ 6개: 8 + ㉠ = 10, 10 + ㉡ = ㉢
            const [a, b] = addOf(d, (p) => p[0] >= 5 && p[0] <= 8), fill = 10 - a, rest = b - fill;
            return M('십 배열판을 보고 10을 만들어 더한다. ㉠, ㉡, ㉢에 알맞은 수는?', [{ label: LABELS[0], answer: fill }, { label: LABELS[1], answer: rest }, { label: LABELS[2], answer: a + b }], {
              figure: ringsAndTris(a, b) + lines([expr(a, '+', box(LABELS[0]), '=', 10), expr(10, '+', box(LABELS[1]), '=', box(LABELS[2]))]),
              explain: `△ ${b}개 가운데 ${fill}개로 십 배열판 하나를 채우면 ${rest}개가 남는다. ${say(a, '+', fill, 10)}, ${say(10, '+', rest, a + b)}`,
              facts: { calc: [[`10-${a}`, 0], [`${b}-(10-${a})`, 1], [E(a, '+', b), 2]] }
            });
          }),
          T('ten-front', '앞의 수를 갈라 더하기', '①7 심4', (d) => {
            // 6 + 8: 6을 ㉠과 2로 → 2 + 8 = 10, 4 + 10 = 14
            const [a, b] = addOf(d, (p) => p[0] !== p[1] && p[1] >= 4), fill = 10 - b, rest = a - fill;
            return M('앞의 수를 갈라 10을 만들어 더한다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: rest }, { label: LABELS[1], answer: a + b }], {
              figure: tree([a, '+', b, '=', blank(LABELS[1])], 0, [blank(LABELS[0]), fill], `가르기 그림: ${a} + ${b} = □에서 ${josa(a, '을/를')} □와 ${josa(fill, '으로/로')} 가름`),
              explain: `${say(fill, '+', b, 10)}이므로 ${josa(a, '을/를')} ${josa(rest, '과/와')} ${josa(fill, '으로/로')} 가른다. ${say(rest, '+', 10, a + b)}`,
              facts: { calc: [[`${a}-${fill}`, 0], [E(a, '+', b), 1]], rule: 'split-front' }
            });
          }),
          T('ten-two', '한 덧셈을 두 가지 방법으로 계산하기', '①8', (d) => {
            // 9 + 7: 7을 1과 ㉠으로 / 9를 ㉡과 3으로
            const [a, b] = addOf(d, (p) => p[0] !== p[1] && p[0] >= 4 && p[1] >= 4), backRest = b - (10 - a), frontRest = a - (10 - b);
            return M(`${a} + ${josa(b, '을/를')} 두 가지 방법으로 계산한다. ㉠, ㉡, ㉢에 알맞은 수는?`, [{ label: LABELS[0], answer: backRest }, { label: LABELS[1], answer: frontRest }, { label: LABELS[2], answer: a + b }], {
              figure: way('방법 1', tree([a, '+', b], 2, [10 - a, blank(LABELS[0])], `방법 1: ${a} + ${b}에서 ${josa(b, '을/를')} ${josa(10 - a, '과/와')} □로 가름`))
                + way('방법 2', tree([a, '+', b], 0, [blank(LABELS[1]), 10 - b], `방법 2: ${a} + ${b}에서 ${josa(a, '을/를')} □와 ${josa(10 - b, '으로/로')} 가름`))
                + expr(a, '+', b, '=', box(LABELS[2])),
              explain: `방법 1: ${say(a, '+', 10 - a, 10)}, ${say(10, '+', backRest, a + b)}. 방법 2: ${say(10 - b, '+', b, 10)}, ${say(frontRest, '+', 10, a + b)}.`,
              facts: { calc: [[`${b}-${10 - a}`, 0], [`${a}-${10 - b}`, 1], [E(a, '+', b), 2]] }
            });
          }),
          T('ten-least', '가른 수가 가장 작은 것', '①9 심5', (d) => {
            // ㉠ 7 + 6: 6을 3과 □ … □ 안의 수가 가장 작은 것
            const rows = d.until(() => d.shuffle(ADDS).slice(0, 3), (list) => { const v = list.map((p) => p[0] + p[1] - 10).sort((x, y) => x - y); return v[0] < v[1] && new Set(list.map((p) => p[0])).size === 3 && list.every((p) => p[0] >= 4); });
            const rests = rows.map((p) => p[0] + p[1] - 10);
            return C('10을 만들어 더하려고 뒤의 수를 갈랐다. □ 안의 수가 가장 작은 것은?', LABELS.slice(0, 3), rests.indexOf(Math.min(...rests)), {
              figure: tagged(rows.map((p) => `${expr(p[0], '+', p[1])}: ${josa(p[1], '을/를')} ${josa(10 - p[0], '과/와')} ${box()}`)),
              explain: rows.map((p, i) => `${LABELS[i]} ${josa(p[1], '은/는')} ${josa(10 - p[0], '과/와')} ${i === 2 ? josa(rests[i], '으로/로') : rests[i]}`).join(', ') + ` 가른다. □ 안의 수는 차례로 ${rests.join(', ')}이다.`,
              facts: { choose: { exprs: rows.map((p) => `${p[1]}-${10 - p[0]}`), rule: 'min' } }
            });
          }),
          T('ten-three', '10을 만드는 세 수의 식 고르기', '①10 심6', (d, n) => {
            // n = 0: 뒤의 수를 가른 식(8 + 4 → 8 + 2 + 2), n = 1: 앞의 수를 가른 식(6 + 8 → 4 + 2 + 8)
            // 틀린 보기는 같은 수를 다르게 가른 식이다. 가른 두 수의 차례만 바꾼 식(7 + 2 + 3)은 7과 3이 10이라고 우길 수 있어 넣지 않는다.
            const back = n === 0;
            const [a, b] = addOf(d, (p) => { const cut = back ? p[1] : p[0], fill = 10 - (back ? p[0] : p[1]); return p[0] !== p[1] && Array.from({ length: cut - 1 }, (_, i) => i + 1).filter((v) => v !== fill && v !== cut - fill).length >= 2; });
            const cut = back ? b : a, fill = 10 - (back ? a : b);
            const others = d.shuffle(Array.from({ length: cut - 1 }, (_, i) => i + 1).filter((v) => v !== fill && v !== cut - fill)).slice(0, 2);
            const list = d.shuffle(others.concat([fill]));
            // 뒤의 수는 (10을 만드는 수, 나머지) 차례로, 앞의 수는 (나머지, 10을 만드는 수) 차례로 적는다.
            const text = (v) => (back ? `${a} + ${v} + ${b - v}` : `${a - v} + ${v} + ${b}`);
            return C(`${a} + ${josa(b, '을/를')} 10을 만들어 계산하려고 한다. 알맞은 식은?`, list.map(text), list.indexOf(fill), {
              explain: back ? `${say(a, '+', fill, 10)}이므로 ${josa(b, '을/를')} ${josa(fill, '과/와')} ${josa(b - fill, '으로/로')} 가른다.` : `${say(fill, '+', b, 10)}이므로 ${josa(a, '을/를')} ${josa(a - fill, '과/와')} ${josa(fill, '으로/로')} 가른다.`,
              facts: { truth: list.map((v) => (back ? a + v === 10 : v + b === 10)), want: true, rule: back ? 'three-back' : 'three-front' }
            });
          }, { count: 2 })
        ]
      },
      {
        id: 'addrule', title: '여러 가지 덧셈', standard: CALC,
        types: [
          T('add-row', '가로셈', '①11 ①12 심7', (d) => {
            const [a, b] = addOf(d);
            return N('다음을 계산하시오.', a + b, { figure: expr(a, '+', b, '=', box()), explain: shown(a, '+', b), facts: { calc: [[E(a, '+', b), 0]] } });
          }),
          T('rule-up', '같은 수에 1씩 큰 수를 더하는 덧셈', '①13 심8', (d) => {
            // 9 + 3, 9 + 4, 9 + 5
            const [a, b] = addOf(d, (p) => p[1] <= 7);
            return M('㉠, ㉡, ㉢에 알맞은 수는?', [0, 1, 2].map((i) => ({ label: LABELS[i], answer: a + b + i })), {
              figure: lines([0, 1, 2].map((i) => expr(a, '+', b + i, '=', box(LABELS[i])))),
              explain: `같은 수에 1씩 큰 수를 더하면 합도 1씩 커진다. 차례로 ${a + b}, ${a + b + 1}, ${a + b + 2}이다.`,
              facts: { calc: [0, 1, 2].map((i) => [E(a, '+', b + i), i]) }
            });
          }),
          T('rule-say', '덧셈식의 규칙 말하기', '①13', (d) => {
            // 9 + 4 = 13, 8 + 4 = 12, 7 + 4 = 11 (앞의 수가 1씩 작아진다) 또는 8 + 7 = 15, 8 + 6 = 14, 8 + 5 = 13 (뒤의 수가 1씩 작아진다)
            const front = d.bool(), [a, b] = addOf(d, (p) => (front ? p[0] : p[1]) >= 4 && p[0] + p[1] >= 13);
            const rows = [0, 1, 2].map((i) => (front ? [a - i, b] : [a, b - i])), sums = rows.map(sumOf), step = sums[1] - sums[0];
            const head = front ? '1씩 작아지는 수에 같은 수를 더하면' : '같은 수에 1씩 작아지는 수를 더하면';
            const list = d.shuffle([[`${head} 합은 1씩 작아진다.`, -1], [`${head} 합은 1씩 커진다.`, 1], [`${head} 합은 변하지 않는다.`, 0]]);
            return C('덧셈식을 보고 바르게 말한 것은?', list.map((row) => row[0]), list.findIndex((row) => row[1] === step), {
              figure: lines(rows.map((p) => expr(p[0], '+', p[1], '=', p[0] + p[1]))),
              explain: `합이 ${sums.join(', ')}${josa(sums[2], '으로/로').slice(String(sums[2]).length)} 1씩 작아진다.`,
              facts: { truth: list.map((row) => sums.every((v, i) => i === 0 || v - sums[i - 1] === row[1])), want: true }
            });
          }),
          T('rule-swap', '두 수를 바꾸어 더하기', '①14 심9', (d) => {
            const [a, b] = addOf(d, (p) => p[0] !== p[1]);
            return M('두 수를 바꾸어 더한다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: a + b }, { label: LABELS[1], answer: a + b }], {
              figure: lines([expr(a, '+', b, '=', box(LABELS[0])), expr(b, '+', a, '=', box(LABELS[1]))]),
              explain: `${say(a, '+', b, a + b)}, ${say(b, '+', a, a + b)}. 두 수를 바꾸어 더해도 합은 같다.`,
              facts: { calc: [[E(a, '+', b), 0], [E(b, '+', a), 1]] }
            });
          }),
          T('rule-swapbox', '두 수를 바꾼 덧셈식의 □', '①15', (d) => {
            // 8 + 4 = 12, □ + 8 = 12
            const [a, b] = addOf(d, (p) => p[0] !== p[1]), s = a + b;
            return N('□ 안에 알맞은 수는?', b, {
              figure: lines([expr(a, '+', b, '=', s), expr(box(), '+', a, '=', s)]),
              explain: `두 수를 바꾸어 더해도 합은 같다. ${say(b, '+', a, s)}`,
              facts: { inverse: ['x+b=a', s, a], rule: 'box-swap' }
            });
          }),
          T('rule-nextbox', '합이 1 큰 덧셈식의 □', '①15 심10', (d) => {
            // 9 + 5 = 14, 9 + □ = 15
            const [a, b] = addOf(d, (p) => p[1] <= 8 && p[0] + p[1] <= 17), s = a + b;
            return N('□ 안에 알맞은 수는?', b + 1, {
              figure: lines([expr(a, '+', b, '=', s), expr(a, '+', box(), '=', s + 1)]),
              explain: `같은 수에 1 큰 수를 더하면 합도 1 커진다. ${say(a, '+', b + 1, s + 1)}`,
              facts: { inverse: ['b+x=a', s + 1, a], rule: 'box-next' }
            });
          }),
          T('rule-table', '덧셈식이 놓인 표의 빈칸', '①16', (d) => {
            // 가로줄은 앞의 수가, 세로줄은 뒤의 수가 같은 표(3줄 3칸). 세 칸의 합을 가린다.
            const [r, c] = addOf(d, (p) => p[0] <= 7 && p[1] <= 7);
            const hidden = d.until(() => d.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]).slice(0, 3).sort((x, y) => x - y), (list) => new Set(list.map((k) => Math.floor(k / 3))).size >= 2 && new Set(list.map((k) => k % 3)).size >= 2);
            const at = (k) => [r + Math.floor(k / 3), c + (k % 3)];
            const rows = [0, 1, 2].map((i) => [0, 1, 2].map((j) => { const k = i * 3 + j, h = hidden.indexOf(k); return [say(r + i, '+', c + j), h < 0 ? r + i + c + j : box(LABELS[h])]; }));
            return M('표의 ㉠, ㉡, ㉢에 알맞은 수는?', hidden.map((k, i) => ({ label: LABELS[i], answer: sumOf(at(k)) })), {
              figure: grid(rows),
              explain: hidden.map((k, i) => `${LABELS[i]} ${say(at(k)[0], '+', at(k)[1], sumOf(at(k)))}`).join(', ') + '. 오른쪽으로 한 칸, 아래로 한 칸 갈 때마다 합이 1씩 커진다.',
              facts: { calc: hidden.map((k, i) => [E(at(k)[0], '+', at(k)[1]), i]) }
            });
          }),
          T('rule-grid', '두 수의 합을 써넣는 표', '①16 심11', (d) => {
            // 세로 머리 8, 9 · 가로 머리 4, 5 → 12, 13, 13, 14
            const [r, c] = addOf(d, (p) => p[0] <= 8 && p[1] <= 8);
            const cellsOf = [[r, c], [r, c + 1], [r + 1, c], [r + 1, c + 1]];
            return M('두 수의 합을 빈칸에 써넣는다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?', cellsOf.map((p, i) => ({ label: LABELS[i], answer: sumOf(p) })), {
              figure: table(['+', c, c + 1], [[r, box(LABELS[0]), box(LABELS[1])], [r + 1, box(LABELS[2]), box(LABELS[3])]]),
              explain: cellsOf.map((p, i) => `${LABELS[i]} ${say(p[0], '+', p[1], sumOf(p))}`).join(', '),
              facts: { calc: cellsOf.map((p, i) => [E(p[0], '+', p[1]), i]) }
            });
          }),
          T('rule-cell', '표의 빈칸에 알맞은 덧셈식', '①16', (d) => {
            // 가로줄은 앞의 수가, 세로줄은 뒤의 수가 같다. 빈칸에 들어갈 식: 두 수를 바꾼 식은 합이 같아도 자리가 틀리다.
            const [r, c] = addOf(d, (p) => p[0] <= 7 && p[1] <= 7);
            const [i, j] = d.until(() => [d.int(0, 2), d.int(0, 2)], (p) => r + p[0] !== c + p[1]), x = r + i, y = c + j;
            const side = [x, c + (j === 2 ? 1 : j + 1)], above = [r + (i === 2 ? 1 : i + 1), y];
            // 틀린 보기: 두 수를 바꾼 식(합만 보는 아이), 옆 칸의 식(가로줄만 보는 아이), 위아래 칸의 식(세로줄만 보는 아이)
            const list = d.shuffle([[x, y], [y, x], side, above]);
            const rows = [0, 1, 2].map((p) => [0, 1, 2].map((q) => [p === i && q === j ? box(LABELS[0]) : say(r + p, '+', c + q)]));
            return C('덧셈식을 규칙에 따라 표에 써넣었다. ㉠에 알맞은 식은?', list.map((p) => say(p[0], '+', p[1])), list.findIndex((p) => p[0] === x && p[1] === y), {
              figure: grid(rows),
              explain: `㉠이 있는 가로줄은 앞의 수가 모두 ${x}이고, 세로줄은 뒤의 수가 모두 ${y}이다. ㉠에 알맞은 식은 ${say(x, '+', y)}이다.`,
              facts: { truth: list.map((p) => p[0] === x && p[1] === y), want: true }
            });
          }),
          T('rule-talk', '덧셈식이 놓인 표를 보고 잘못 말한 것', '①17', (d) => {
            // 두 줄 세 칸: 6 + 5, 6 + 6, 6 + 7 / 7 + 5, 7 + 6, 7 + 7
            const [r, c] = addOf(d, (p) => p[0] <= 8 && p[1] <= 7), bad = d.int(0, 2), top = r + c + 3;
            const [i, j] = d.pick([[0, 1], [0, 2], [1, 0], [1, 1]]), x = r + i, y = c + j, slip = d.pick([-1, 1]);
            const saidSum = x + y + (bad === 0 ? slip : 0), saidTop = top + (bad === 2 ? slip : 0), saidStep = bad === 1 ? -1 : 1;
            const list = d.shuffle([
              { text: `${say(x, '+', y, saidSum)}이다.`, ok: x + y === saidSum },
              { text: `오른쪽으로 한 칸 갈 때마다 합이 1씩 ${saidStep === 1 ? '커진다' : '작아진다'}.`, ok: (r + c + 1) - (r + c) === saidStep },
              { text: `가장 큰 합은 ${saidTop}이다.`, ok: saidTop === Math.max(r + c + 2, r + 1 + c + 2) }
            ]);
            return C('표를 보고 잘못 말한 것은?', list.map((row) => row.text), list.findIndex((row) => !row.ok), {
              figure: grid([0, 1].map((p) => [0, 1, 2].map((q) => [say(r + p, '+', c + q)]))),
              explain: bad === 0 ? `${say(x, '+', y, x + y)}이다.` : bad === 1 ? `뒤의 수가 1씩 커지므로 합도 1씩 커진다.` : `가장 큰 합은 ${say(r + 1, '+', c + 2, top)}이다.`,
              facts: { truth: list.map((row) => row.ok), want: false }
            });
          }),
          T('rule-count', '합이 같은 덧셈식 세기', '①18 ①19 심15', (d) => {
            // 여섯 식 가운데 합이 13인 식의 수. 나머지는 합이 1 다르다.
            const t = d.int(12, 15), hit = d.int(2, 4);
            const yes = d.shuffle(ADDS.filter((p) => sumOf(p) === t)).slice(0, hit), no = d.shuffle(ADDS.filter((p) => Math.abs(sumOf(p) - t) === 1)).slice(0, 6 - hit);
            const list = d.shuffle(yes.concat(no));
            return N(`합이 ${t}인 식은 모두 몇 개인가?`, hit, {
              unit: '개', figure: grid([0, 1].map((p) => [0, 1, 2].map((q) => [say(list[p * 3 + q][0], '+', list[p * 3 + q][1])]))),
              explain: `합이 ${t}인 식은 ${list.filter((p) => sumOf(p) === t).map((p) => say(p[0], '+', p[1])).join(', ')}이다.`,
              facts: { count: list.map((p) => sumOf(p) === t) }
            });
          }),
          T('rule-same', '합이 같은 덧셈식 고르기', '①19 ①18', (d) => {
            // 9 + 6과 합이 같은 식: 8 + 7(한 수가 1 작아지고 다른 수가 1 커졌다). 틀린 보기는 한 수만 1 달라진 식이다. 두 수를 바꾼 식(6 + 9)은 보기에 넣지 않는다.
            const moved = (p, ks) => ks.map((k) => [p[0] + k[0], p[1] + k[1]]).filter((q) => isAdd(q[0], q[1]) && !(q[0] === p[1] && q[1] === p[0]));
            const SAME = [[1, -1], [-1, 1]], ONE = [[1, 0], [0, 1], [-1, 0], [0, -1]];
            const [a, b] = addOf(d, (p) => moved(p, SAME).length >= 1 && moved(p, ONE).length >= 3), s = a + b;
            const right = d.pick(moved([a, b], SAME)), wrong = d.shuffle(moved([a, b], ONE)).slice(0, 3);
            const list = d.shuffle(wrong.concat([right]));
            return C(`${a} + ${josa(b, '과/와')} 합이 같은 식은?`, list.map((p) => expr(p[0], '+', p[1])), list.indexOf(right), {
              explain: `${say(a, '+', b, s)}, ${say(right[0], '+', right[1], s)}`,
              facts: { choose: { exprs: list.map((p) => E(p[0], '+', p[1])), rule: 'equals', target: s } }
            });
          }),
          T('rule-odd', '합이 나머지와 다른 덧셈식', '①20 심13', (d) => {
            const t = d.int(12, 15), three = d.shuffle(ADDS.filter((p) => sumOf(p) === t)).slice(0, 3), lone = d.pick(ADDS.filter((p) => Math.abs(sumOf(p) - t) === 1));
            const list = d.shuffle(three.concat([lone]));
            return C('합이 나머지와 다른 식은?', list.map((p) => expr(p[0], '+', p[1])), list.indexOf(lone), {
              explain: list.map((p) => say(p[0], '+', p[1], sumOf(p))).join(', '),
              facts: { choose: { exprs: list.map((p) => E(p[0], '+', p[1])), rule: 'odd' } }
            });
          }),
          T('rule-pair', '합이 같은 두 식 찾기', '①21', (d) => {
            // 네 식 가운데 합이 같은 것은 한 쌍뿐이다. 두 수를 바꾼 짝은 넣지 않는다(계산하지 않고도 보인다).
            const rows = d.until(() => d.shuffle(ADDS).slice(0, 4), (list) => {
              const v = list.map(sumOf);
              return new Set(v).size === 3 && Math.max(...v) - Math.min(...v) <= 3 && list.every((p, i) => list.every((q, k) => i === k || !(p[0] === q[1] && p[1] === q[0])));
            });
            const values = rows.map(sumOf), right = PAIRS4.find((p) => values[p[0]] === values[p[1]]);
            const list = d.shuffle(d.shuffle(PAIRS4.filter((p) => p !== right)).slice(0, 3).concat([right]));
            return C('합이 같은 두 식은?', list.map((p) => p.map((i) => LABELS[i]).join(', ')), list.indexOf(right), {
              figure: tagged(rows.map((p) => expr(p[0], '+', p[1]))), explain: rows.map((p, i) => `${LABELS[i]} ${say(p[0], '+', p[1], sumOf(p))}`).join(', '),
              facts: { choose: { exprs: rows.map((p) => E(p[0], '+', p[1])), rule: 'same', pairsShown: list } }
            });
          }),
          T('rule-versus', '두 덧셈식의 크기 비교', '①22 심12', (d) => {
            // 9 + 8 ○ 6 + 8, 5 + 9 ○ 8 + 6 — 네 수가 모두 달라 계산해야 알 수 있다.
            const [p, q] = d.until(() => [d.pick(ADDS), d.pick(ADDS)], ([x, y]) => new Set([x[0], x[1], y[0], y[1]]).size === 4 && Math.abs(sumOf(x) - sumOf(y)) <= 2);
            return C('○ 안에 알맞은 것은?', SIGNS, signOf(sumOf(p), sumOf(q)), {
              figure: versus(expr(p[0], '+', p[1]), expr(q[0], '+', q[1])), explain: `${say(p[0], '+', p[1], sumOf(p))}, ${say(q[0], '+', q[1], sumOf(q))}`,
              facts: { choose: { exprs: [E(p[0], '+', p[1]), E(q[0], '+', q[1])], rule: 'compare' } }
            });
          }),
          T('rule-max', '합이 가장 큰 덧셈식', '①22', (d) => {
            // 가장 큰 수가 든 식을 둘 넘게 두어, 수 하나만 보고는 고르지 못하게 한다.
            const rows = d.until(() => d.shuffle(ADDS).slice(0, 4), (list) => {
              const v = list.map(sumOf), big = Math.max(...list.map((p) => Math.max(p[0], p[1])));
              return v.filter((x) => x === Math.max(...v)).length === 1 && Math.max(...v) - Math.min(...v) <= 4 && new Set(v).size >= 3 && list.filter((p) => Math.max(p[0], p[1]) === big).length >= 2;
            });
            const values = rows.map(sumOf);
            return C('합이 가장 큰 식은?', LABELS.slice(0, 4), values.indexOf(Math.max(...values)), {
              figure: tagged(rows.map((p) => expr(p[0], '+', p[1]))), explain: rows.map((p, i) => `${LABELS[i]} ${say(p[0], '+', p[1], sumOf(p))}`).join(', '),
              facts: { choose: { exprs: rows.map((p) => E(p[0], '+', p[1])), rule: 'max' } }
            });
          }),
          T('rule-order', '합이 작은 식부터 차례로 쓰기', '심14', (d) => {
            const rows = d.until(() => d.shuffle(ADDS).slice(0, 3), (list) => { const v = list.map(sumOf); return new Set(v).size === 3 && Math.max(...v) - Math.min(...v) <= 4 && new Set(list.map((p) => p[0])).size === 3; });
            const values = rows.map(sumOf), right = [0, 1, 2].sort((x, y) => values[x] - values[y]);
            const list = d.shuffle(d.shuffle(ORDERS.filter((o) => o.join() !== right.join())).slice(0, 3).concat([right]));
            return C('합이 작은 식부터 차례로 쓴 것은?', list.map((o) => o.map((i) => LABELS[i]).join(', ')), list.findIndex((o) => o.join() === right.join()), {
              figure: tagged(rows.map((p) => expr(p[0], '+', p[1]))), explain: rows.map((p, i) => `${LABELS[i]} ${say(p[0], '+', p[1], sumOf(p))}`).join(', '),
              facts: { choose: { exprs: rows.map((p) => E(p[0], '+', p[1])), rule: 'ascending', orders: list } }
            });
          })
        ]
      },
      {
        id: 'addword', title: '덧셈 문장제', standard: MEAN,
        types: [
          T('word-join', '문장제: 두 양을 합치기', '①24 심17', (d) => {
            const [a, b] = addOf(d);
            return N(`바구니에 사과가 ${a}개, 귤이 ${b}개 있다. 바구니에 있는 과일은 모두 몇 개인가?`, a + b, { unit: '개', explain: shown(a, '+', b), facts: { calc: [[E(a, '+', b), 0]] } });
          }),
          T('word-come', '문장제: 더 온 뒤의 수', '①24 심17', (d) => {
            const [a, b] = addOf(d);
            return N(`놀이터에 어린이가 ${a}명 있었다. 잠시 뒤에 ${b}명이 더 왔다. 놀이터에 있는 어린이는 모두 몇 명인가?`, a + b, { unit: '명', explain: shown(a, '+', b), facts: { calc: [[E(a, '+', b), 0]] } });
          }),
          T('word-bigger', '문장제: 더 많은 쪽의 수', '심18 심50', (d) => {
            const [a, b] = addOf(d, (p) => p[0] > p[1]);
            return N(`빨간 색종이가 ${a}장 있다. 파란 색종이는 빨간 색종이보다 ${b}장 더 많다. 파란 색종이는 몇 장인가?`, a + b, { unit: '장', explain: shown(a, '+', b), facts: { calc: [[E(a, '+', b), 0]] } });
          }),
          T('word-double', '문장제: 같은 수를 두 번 더하기', '심17', (d) => {
            // 다리가 8개인 문어 2마리 → 8 + 8
            const a = d.int(6, 9);
            return N(`한 봉지에 사탕이 ${a}개씩 들어 있다. 2봉지에 들어 있는 사탕은 모두 몇 개인가?`, a + a, { unit: '개', explain: `${a}개씩 2봉지이므로 ${josa(a, '을/를')} 두 번 더한다. ${say(a, '+', a, a + a)}`, facts: { calc: [[E(a, '+', a), 0]] } });
          }),
          T('word-cards', '수 카드로 합이 가장 큰 덧셈식 만들기', '①26 심20', (d) => {
            const list = d.until(() => d.shuffle([2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4), (xs) => { const s = xs.slice().sort((x, y) => y - x); return s[0] + s[1] >= 12 && s[0] + s[2] >= 11; });
            const s = list.slice().sort((x, y) => y - x);
            return N('수 카드 4장 중 2장을 골라 두 수를 더한다. 가장 큰 합은?', s[0] + s[1], {
              figure: cards(list), explain: `가장 큰 수 ${josa(s[0], '과/와')} 둘째로 큰 수 ${josa(s[1], '을/를')} 더한다. ${say(s[0], '+', s[1], s[0] + s[1])}`,
              facts: { pairs: { numbers: list, want: 'maxSum' } }
            });
          }),
          T('word-cardsum', '수 카드로 합이 정해진 덧셈식 만들기', '①27', (d) => {
            // 카드 넉 장에서 합이 14인 두 장은 한 쌍뿐이다.
            const pairsOf = (xs) => PAIRS4.map((p) => [xs[p[0]], xs[p[1]]]);
            const list = d.until(() => d.shuffle([4, 5, 6, 7, 8, 9]).slice(0, 4).sort((x, y) => x - y), (xs) => { const v = pairsOf(xs).map(sumOf); return v.filter((x) => x >= 11).length >= 4 && v.some((x) => x >= 11 && v.filter((y) => y === x).length === 1); });
            const all = pairsOf(list), sums = all.map(sumOf), right = d.pick(all.filter((p) => sumOf(p) >= 11 && sums.filter((v) => v === sumOf(p)).length === 1)), t = sumOf(right);
            // 틀린 보기도 이 단원의 덧셈(합이 11 이상)이다.
            const options = d.shuffle(d.shuffle(all.filter((p) => p !== right && sumOf(p) >= 11)).slice(0, 3).concat([right]));
            return C(`수 카드 2장을 골라 합이 ${t}인 덧셈식을 만든다. 고른 두 수는?`, options.map((p) => p.join(', ')), options.indexOf(right), {
              figure: cards(d.shuffle(list)) + expr(box(), '+', box(), '=', t), explain: say(right[0], '+', right[1], t),
              facts: { choose: { exprs: options.map((p) => E(p[0], '+', p[1])), rule: 'equals', target: t } }
            });
          }),
          T('word-cardfill', '수 카드로 덧셈식 완성하기', '①28', (d) => {
            // 9 + ㉠ = ㉡: 카드 7, 16, 5, 13 → 7, 16. 맞는 짝은 하나뿐이다.
            const [a, x] = addOf(d), y = a + x;
            const [p, q] = d.until(() => [d.int(2, 9), d.int(11, 18)], (v) => v[0] !== x && v[0] !== a && v[1] !== y && a + v[0] !== v[1] && a + v[0] !== y && Math.abs(v[1] - y) <= 4);
            const list = d.shuffle([x, y, p, q]);
            return M('수 카드 2장을 골라 덧셈식을 완성한다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: x }, { label: LABELS[1], answer: y }], {
              figure: cards(list) + expr(a, '+', box(LABELS[0]), '=', box(LABELS[1])), explain: say(a, '+', x, y),
              facts: { calc: [[E(y, '-', a), 0], [E(a, '+', x), 1]] }
            });
          })
        ]
      },
      { id: 'subsee', title: '뺄셈 알아보기', standard: CALC, types: [] },
      { id: 'subten', title: '10을 만들어 빼기', standard: CALC, types: [] },
      { id: 'subrule', title: '여러 가지 뺄셈', standard: CALC, types: [] },
      { id: 'subword', title: '뺄셈 문장제', standard: MEAN, types: [] }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
