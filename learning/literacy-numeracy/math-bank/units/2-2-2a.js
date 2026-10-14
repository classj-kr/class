// 2학년 2학기 2단원 곱셈구구 — 단원 틀, 그림 도구, 기본 문항 앞쪽 네 묶음
// (그림을 곱셈식으로 · 곱 구하기 · 곱이 커지는 규칙과 여러 가지 방법 · □가 있는 곱셈식과 곱의 크기 비교).
// 영역: 수와 연산. 성취기준 [2수01-11] 곱셈구구를 이해하고, 한 자리 수의 곱셈을 할 수 있다. 문장제는 [2수01-10].
// 수집해 둔 교과서 평가 자료의 꼴 목록(기본꼴_1 62꼴 = ①n, 심화꼴 51꼴 = 심n)을 하나씩 따져 옮긴 것이다.
// 꼴과 조건은 그 문제를 따르고 수와 상황은 새로 썼다. 답은 모두 코드로 셈한다(답지가 어긋난 곳이 있다).
//
// 싣는 기준
//  - 곱은 한 자리 수 × 한 자리 수까지(0 × □, □ × 0 포함). 나눗셈식은 쓰지 않는다. 「□ × 6 = 42」처럼 곱셈구구를 거꾸로 떠올리는 □는 싣는다.
//  - 곱셈과 덧셈·뺄셈을 한 식에 섞어 쓰지 않는다(5학년). 「7 × 6은 7 × 5에 7을 더한 수」처럼 말로 적고, 풀이는 식을 두 번에 나누어 적는다.
//  - 「배수」「약수」라는 말은 쓰지 않는다. 짝수·홀수는 20 이하의 수에서만 쓴다.
//  - 단만 바꾼 계산을 단마다 싣지 않는다. 식만 주는 계산은 유형 하나를 단 묶음(2·5단 / 3·6단 / 4·8단 / 7단 / 9단)에 따라 다섯 차례로 두고,
//    나타내는 방법(화살표, 한 줄 표, 묶음 그림, 줄 배열, 수직선)이 다를 때만 따로 싣는다.
//  - 그림의 묶음을 「한 묶음의 수 × 묶음 수」의 차례로만 읽게 하는 문항은 만들지 않는다. 두 수를 바꾼 식은 곱이 같으므로 틀린 보기로 쓰지 않는다.
//  - 답은 숫자만 받는다. 식·이름·기호·방법은 고르기로 받는다. 답 칸은 넷까지.
//
// 뺀 것과 까닭(꼴 번호)
//  - 긋기·그리기·색칠(작도): ①3(직접 묶기 — 묶음을 달리해 세는 일은 pic-both가 한다), ①6(○ 그리기), ①13의 색칠 변형, 심8(수직선에 나타내기)
//    (색칠하기 ①49는 칸 세기로, 색칠된 칸 찾기 심39는 고르기로 바꿔 실었다.)
//  - 식·방법·규칙을 글로 쓰기(서술형): ①28, 심9의 「관계 설명」, 심24 ⑶ (규칙 쓰기 심41은 고르기로 바꿔 실었다.)
//  - 뜻 없는 셈(두 곱의 합, 빈칸에 들어갈 수끼리 더하기·빼기): ①17, ①50의 「㉡ − ㉠」, ①62의 「두 곱의 합」(두 곱을 따로 묻는다)
//  - 나눗셈 상황으로만 읽히는 문장제(3-1-3 나눗셈): ①59, 심48 — 식으로 주면 「양쪽이 곱셈인 식의 □」(box-both)와 같은 일이다.
//  - 조건 여럿으로 수를 거르는 것(조건 풀이), 20을 넘는 수의 짝수·홀수: ①60, ①61, 심49, 심50
//  - 기호 둘을 차례로 거꾸로 푸는 것(앞에서 구한 수를 다음 식에 넣어 다시 거꾸로): 심28
//  - 한 칸을 알아야 다음 칸이 풀리는 가려진 머리 칸: ①50 (한 칸씩 따로 풀리는 심40은 실력에 실었다.)
//  - 놀이(한 단의 값을 따라 길 찾기): ①14 → 「한 단의 값을 모두 고른 것」(calc-inlist)으로 바꿔 실었다.
//  - 답이 하나로 정해지지 않는 것: ①5의 「□ × □ = □」(두 수의 차례가 어느 쪽이어도 맞다)
//  - 이미 실은 유형과 하는 일이 같은 것(물건·칸의 모양만 다름): ①2의 주사위 눈·책상 다리, ①8의 ㉠·㉡ 짝 고르기, ①11의 「곱이 하나 남는 잇기」,
//    ①35의 1단 한 줄 표, ①44·심37의 칸 수만 많은 곱셈표, 심13(곱이 맞도록 곱하는 수 고르기 = □ 구하기), 심19의 「가장 작은 것」(가장 큰 것과 방향만 다름), 심42의 식 빈칸
//  - 그림의 물건 수: 곱셈구구는 물건이 20개를 넘는 그림을 피할 수 없다. 대신 한 묶음(한 줄)의 수와 묶음(줄) 수가 9를 넘지 않게 하고,
//    묶음은 둥근 테두리로, 줄 배열은 줄을 맞추어 그려 묶음째 세게 한다.
// 묻는 말: 값을 물을 때는 「~은?/~는?」, 양을 물을 때는 「몇 ~인가?」, 시키는 말은 「~하시오.」. 문장은 짧게, 한 문장에 한 가지만 적는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, LABELS, box, expr, lines, tagged, numbers, chain, numberLine, N, M, C, E } = B.kit;
  const UNIT = '2-2-2', CALC = '2수01-11', WORD = '2수01-10';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const L5 = ['㉠', '㉡', '㉢', '㉣', '㉤'];
  const SIGNS = ['&gt;', '=', '&lt;'];
  const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  const range = (lo, hi) => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
  const times = (a, b) => expr(a, '*', b, '=', a * b);
  const versus = (left, right) => `<div class="mb-versus">${left}<span class="mb-ring"></span>${right}</div>`;
  const labelled = (answers) => answers.map((answer, i) => ({ label: L5[i], answer }));
  // 2~9단 곱셈구구 전부, a단 곱셈구구의 값인가
  const FACTS = []; for (let a = 2; a <= 9; a += 1) for (let b = 2; b <= 9; b += 1) FACTS.push([a, b]);
  const inDan = (a, v) => v % a === 0 && v / a >= 1 && v / a <= 9;
  const product = ([x, y]) => x * y;
  // 곱이 정한 수 가까이에 오는 곱셈구구들(견주는 문항은 곱이 몰려 있어야 셈해야 풀린다)
  const around = (center, spread) => FACTS.filter((f) => Math.abs(product(f) - center) <= spread);
  // 곱셈구구에 세 번 넘게 나오는 곱(두 수를 바꾼 것 말고 다른 단에도 있다)
  const MULTI = [12, 16, 18, 24, 36];
  const waysOf = (p) => FACTS.filter((f) => product(f) === p);
  // 「모두 고른 것」의 보기. flags: 맞는 것, wrongs: 틀린 묶음들(자리 배열). 묶음 안의 차례는 늘어놓은 차례를 따른다.
  function setOptions(d, labels, flags, wrongs) {
    const right = labels.map((_, i) => i).filter((i) => flags[i]);
    const sets = d.shuffle([right].concat(wrongs)).map((p) => p.slice().sort((x, y) => x - y).map((i) => labels[i]));
    const key = right.map((i) => labels[i]).join();
    return { sets, options: sets.map((s) => s.join(', ')), answer: sets.findIndex((s) => s.join() === key) };
  }
  // 넷 가운데 둘이 맞을 때: 둘씩 묶은 보기 넷(맞는 묶음은 하나)
  function pairOptions(d, labels, flags) {
    const all = []; for (let i = 0; i < labels.length; i += 1) for (let j = i + 1; j < labels.length; j += 1) all.push([i, j]);
    const right = labels.map((_, i) => i).filter((i) => flags[i]);
    return setOptions(d, labels, flags, d.shuffle(all.filter((p) => p.join() !== right.join())).slice(0, 3));
  }

  // ── 그림 ─────────────────────────────────────────────────────
  const fx = (v) => Math.round(v * 10) / 10;
  const THINGS = [{ what: '사탕', holder: '봉지' }, { what: '귤', holder: '접시' }, { what: '구슬', holder: '주머니' }, { what: '딸기', holder: '접시' }, { what: '달걀', holder: '바구니' }, { what: '과자', holder: '접시' }];
  // 묶음 그림: 둥근 테두리 n개에 물건이 a개씩 들어 있다(a = 0 이면 빈 그릇). 물건은 줄을 맞추어 놓는다(한 줄에 넷까지).
  const PACK_COLS = [2, 1, 2, 3, 2, 3, 3, 4, 4, 3];
  function packs(a, n, thing) {
    const P = 11, R = 4.2, gap = 6, cols = PACK_COLS[a], rows = Math.max(1, Math.ceil(a / cols));
    const cw = Math.max(cols * P + 9, 31), ch = rows * P + 9;
    const most = Math.max(1, Math.floor((236 + gap) / (cw + gap))), per = Math.ceil(n / Math.ceil(n / most));
    const W = per * (cw + gap) - gap + 8, H = Math.ceil(n / per) * (ch + gap) - gap + 8;
    let out = '';
    for (let i = 0; i < n; i += 1) {
      const x0 = 4 + (i % per) * (cw + gap), y0 = 4 + Math.floor(i / per) * (ch + gap);
      out += '<rect class="mb-loop" style="fill:#fffdf5" x="' + x0 + '" y="' + y0 + '" width="' + cw + '" height="' + ch + '" rx="7"/>';
      for (let k = 0; k < a; k += 1) {
        const row = Math.floor(k / cols), inRow = Math.min(cols, a - row * cols), col = k % cols;
        out += '<circle class="mb-thing" cx="' + fx(x0 + cw / 2 + (col - (inRow - 1) / 2) * P) + '" cy="' + fx(y0 + ch / 2 + (row - (rows - 1) / 2) * P) + '" r="' + R + '"/>';
      }
    }
    const said = a === 0 ? '빈 ' + thing.holder + ' ' + n + '개' : thing.what + ' ' + a + '개씩 ' + n + '묶음';
    return '<svg class="mb-dots" viewBox="0 0 ' + W + ' ' + H + '" width="' + Math.round(W * 1.15) + '" role="img" aria-label="' + said + '">' + out + '</svg>';
  }
  // 줄 배열: 한 줄에 cols개씩 rows줄. o.gap: 그 수만큼씩 가로로 띄운다, o.skip(r, c): 비운 자리, o.tone(r, c): 다른 색(1)으로 칠할 자리,
  // o.loop: 'rows' 는 가로줄마다, 'cols' 는 세로줄마다 둥근 테두리로 묶는다, o.said: 그림 설명, o.scale: 그림 배율.
  function arr(rows, cols, o) {
    const opt = o || {}, P = 15, R = 5.4, pad = 9;
    const x = (c) => pad + P / 2 + c * P + (opt.gap ? Math.floor(c / opt.gap) * 9 : 0), y = (r) => pad + P / 2 + r * P;
    const W = fx(x(cols - 1) + P / 2 + pad), H = fx(y(rows - 1) + P / 2 + pad), band = R * 2 + 3;
    let out = '';
    if (opt.loop === 'rows') for (let r = 0; r < rows; r += 1) out += '<rect class="mb-loop" x="' + fx(x(0) - band / 2 - 1.5) + '" y="' + fx(y(r) - band / 2) + '" width="' + fx(x(cols - 1) - x(0) + band + 3) + '" height="' + band + '" rx="' + band / 2 + '"/>';
    if (opt.loop === 'cols') for (let c = 0; c < cols; c += 1) out += '<rect class="mb-loop" x="' + fx(x(c) - band / 2) + '" y="' + fx(y(0) - band / 2 - 1.5) + '" width="' + band + '" height="' + fx(y(rows - 1) - y(0) + band + 3) + '" rx="' + band / 2 + '"/>';
    for (let r = 0; r < rows; r += 1) for (let c = 0; c < cols; c += 1) {
      if (opt.skip && opt.skip(r, c)) continue;
      out += '<circle class="mb-thing' + (opt.tone && opt.tone(r, c) ? ' is-on' : '') + '" cx="' + fx(x(c)) + '" cy="' + fx(y(r)) + '" r="' + R + '"/>';
    }
    const said = opt.said || (opt.loop === 'rows' ? cols + '개씩 ' + rows + '묶음' : opt.loop === 'cols' ? rows + '개씩 ' + cols + '묶음' : '한 줄에 ' + cols + '개씩 ' + rows + '줄');
    return '<svg class="mb-dots" viewBox="0 0 ' + W + ' ' + H + '" width="' + Math.round(W * (opt.scale || 1.25)) + '" role="img" aria-label="' + said + '">' + out + '</svg>';
  }
  // 곱셈표. cols·rows: 머리 칸의 수(가려진 머리 칸은 글), cell(i, j, 세로 머리, 가로 머리): 칸의 글. { html, on: true } 이면 색칠한 칸, 빈 글이면 빈칸.
  function mtable(cols, rows, cell) {
    const head = 'style="background:var(--brand-soft);font-weight:600"';
    const td = (v) => { const c = v !== null && typeof v === 'object' ? v : { html: v }; return '<td style="min-width:1.5em;font-weight:400;background:' + (c.on ? '#fde68a' : '#fff') + '">' + (c.html === '' || c.html === undefined ? '&nbsp;' : c.html) + '</td>'; };
    return '<div class="mb-table-wrap"><table class="mb-table"><thead><tr><th>×</th>' + cols.map((c) => '<th>' + c + '</th>').join('') + '</tr></thead><tbody>'
      + rows.map((r, i) => '<tr><td ' + head + '>' + r + '</td>' + cols.map((c, j) => td(cell(i, j, r, c))).join('') + '</tr>').join('') + '</tbody></table></div>';
  }
  // 같은 길이의 막대 n개를 겹치지 않게 한 줄로 이은 그림(막대마다 길이를 적는다)
  function bars(a, n) {
    const w = Math.min(34, 252 / n), W = fx(n * w + 8);
    let out = '';
    for (let i = 0; i < n; i += 1) {
      out += '<rect x="' + fx(4 + i * w) + '" y="22" width="' + fx(w) + '" height="13" style="fill:' + (i % 2 ? '#bfdbfe' : '#fde68a') + ';stroke:#475569;stroke-width:1"/>';
      out += '<text class="mb-axis-label" x="' + fx(4 + i * w + w / 2) + '" y="15" text-anchor="middle">' + a + ' cm</text>';
    }
    return '<svg class="mb-numberline" viewBox="0 0 ' + W + ' 42" width="' + Math.round(W * 1.12) + '" role="img" aria-label="길이가 ' + a + ' cm인 막대 ' + n + '개를 한 줄로 이은 그림">' + out + '</svg>';
  }
  // 위의 두 수를 곱해 아래 칸에 쓰는 칸(윗줄 셋, 가운데 줄 둘, 아랫줄 하나)
  function stack(top, mid, bottom) {
    const row = (cells) => '<div style="display:flex;gap:6px;justify-content:center">' + cells.map((c) => '<span class="mb-node" style="min-width:2.6em">' + c + '</span>').join('') + '</div>';
    return '<div style="display:grid;gap:6px">' + row(top) + row(mid) + row([bottom]) + '</div>';
  }
  // 같은 단원의 다른 파일이 쓰는 도구
  B.kit.g222 = { UNIT, CALC, WORD, L5, SIGNS, ORDERS, FACTS, MULTI, THINGS, range, times, versus, labelled, inDan, product, around, waysOf, setOptions, pairOptions, packs, arr, mtable, bars, stack };

  // 식만 주는 계산의 단 묶음
  const DANS = [[2, 5], [3, 6], [4, 8], [7], [9]];

  B.addUnit({
    id: '2-2-2', grade: 2, semester: 2, no: 2, title: '곱셈구구', version: 1,
    groups: [
      {
        id: 'pic', title: '그림을 곱셈식으로 나타내기', standard: CALC,
        types: [
          T('pic-add', '묶음 그림을 덧셈식과 곱셈식으로', '①1 심1', (d) => {
            // 2 + 2 + 2 + 2 + 2 = 2 × ㉠ = ㉡
            const a = d.pick([2, 5]), n = d.int(3, 6), thing = d.pick(THINGS);
            return M('그림을 보고 덧셈식을 곱셈식으로 나타낸다. ㉠, ㉡에 알맞은 수는?', labelled([n, a * n]), {
              figure: packs(a, n, thing) + lines(['<span class="mb-expr">' + Array.from({ length: n }, () => a).join(' <i>+</i> ') + '</span>', expr('=', a, '*', box(L5[0]), '=', box(L5[1]))]),
              explain: `${josa(a, '을/를')} ${n}번 더한 것이다. ${times(a, n)}`, facts: { repeatAdd: { a, n } }
            });
          }),
          T('pic-group', '묶음 그림을 곱셈식으로', '①2 심2', (d) => {
            const a = d.int(3, 9), n = d.int(3, 7), thing = d.pick(THINGS);
            return M('그림을 보고 곱셈식으로 나타낼 때, ㉠, ㉡에 알맞은 수는?', labelled([n, a * n]), {
              figure: packs(a, n, thing) + expr(a, '*', box(L5[0]), '=', box(L5[1])),
              explain: `${josa(thing.what, '이/가')} ${a}개씩 ${n}묶음이다. ${times(a, n)}`, facts: { calc: [[String(n), 0], [E(a, '*', n), 1]] }
            });
          }),
          T('pic-rows', '줄 배열을 곱셈식으로', '①2', (d) => {
            // 바둑돌 a개씩 n줄(줄마다 묶어 보인다)
            const a = d.int(4, 9), n = d.until(() => d.int(3, 6), (v) => v !== a);
            return M('바둑돌을 한 줄씩 묶었다. 바둑돌의 수를 곱셈식으로 나타낼 때, ㉠, ㉡에 알맞은 수는?', labelled([n, a * n]), {
              figure: arr(n, a, { loop: 'rows' }) + expr(a, '*', box(L5[0]), '=', box(L5[1])),
              explain: `한 줄에 ${a}개씩 ${n}줄이다. ${times(a, n)}`, facts: { calc: [[String(n), 0], [E(a, '*', n), 1]] }
            });
          }),
          T('pic-both', '같은 그림을 두 단의 곱셈식으로', '①4 심7', (d) => {
            // 한 줄에 8개씩 3줄 → 4 × 6 = 24, 8 × 3 = 24
            const a = d.pick([2, 3, 4]), r = d.until(() => d.int(2, 4), (v) => v !== a), what = d.pick(['사과', '귤', '구슬']);
            return M(`${what}의 수를 두 가지 곱셈식으로 나타낸다. ㉠, ㉡, ㉢에 알맞은 수는?`, labelled([2 * r, r, 2 * a * r]), {
              figure: arr(r, 2 * a, { gap: a, said: `${what}: 한 줄에 ${2 * a}개씩 ${r}줄, 한 줄을 ${a}개씩 둘로 띄움` }) + lines([expr(a, '*', box(L5[0]), '=', box(L5[2])), expr(2 * a, '*', box(L5[1]), '=', box(L5[2]))]),
              explain: `${a}개씩 묶으면 ${2 * r}묶음이고, ${2 * a}개씩 묶으면 ${r}묶음이다. ${times(a, 2 * r)}, ${times(2 * a, r)}`,
              facts: { calc: [[`${2 * a}*${r}/${a}`, 0], [String(r), 1], [E(2 * a, '*', r), 2]] }
            });
          }),
          T('pic-swap', '가로줄과 세로줄로 묶은 그림', '①4', (d) => {
            // 같은 배열을 가로줄로 묶으면 7 × 2, 세로줄로 묶으면 2 × 7
            const [r, c] = d.until(() => [d.int(2, 4), d.int(4, 6)], ([x, y]) => x < y);
            return M('같은 구슬을 두 가지 방법으로 묶었다. ㉠, ㉡, ㉢에 알맞은 수는?', labelled([r, c, r * c]), {
              figure: arr(r, c, { loop: 'rows', scale: 1.15 }) + arr(r, c, { loop: 'cols', scale: 1.15 }) + lines([expr(c, '*', box(L5[0]), '=', box(L5[2])), expr(r, '*', box(L5[1]), '=', box(L5[2]))]),
              explain: `가로줄로 묶으면 ${c}개씩 ${r}묶음이고, 세로줄로 묶으면 ${r}개씩 ${c}묶음이다. ${times(c, r)}, ${times(r, c)}`,
              facts: { calc: [[String(r), 0], [String(c), 1], [E(c, '*', r), 2]] }
            });
          }),
          T('pic-line', '수직선의 뛰어 세기를 곱셈식으로', '①5 심3', (d) => {
            const a = d.int(2, 9), n = d.int(3, 5);
            return M('수직선을 보고 곱셈식으로 나타낼 때, ㉠, ㉡에 알맞은 수는?', labelled([n, a * n]), {
              figure: numberLine(a * n, a, { hideEnd: true, length: 240 }) + expr(a, '*', box(L5[0]), '=', box(L5[1])),
              explain: `0에서 ${a}씩 ${n}번 뛰었다. ${times(a, n)}`, facts: { calc: [[String(n), 0], [E(a, '*', n), 1]] }
            });
          }),
          T('pic-pick', '그림에 맞는 곱셈식 고르기', '①7 심4', (d) => {
            // 틀린 보기는 묶음 수나 한 묶음의 수를 하나 더 센 식이다. 두 수를 바꾼 식은 곱이 같으므로 넣지 않는다.
            const [a, n] = d.until(() => [d.int(3, 7), d.int(3, 7)], ([x, y]) => x !== y), thing = d.pick(THINGS);
            const list = d.shuffle([[a, n], [a, n + 1], [a + 1, n], [a + 1, n + 1]]);
            return C(`그림의 ${thing.what} 수를 구하는 곱셈식은?`, list.map(([x, y]) => `${x} × ${y}`), list.findIndex(([x, y]) => x === a && y === n), {
              figure: packs(a, n, thing), explain: `${a}개씩 ${n}묶음이다. ${times(a, n)}`,
              facts: { choose: { exprs: list.map(([x, y]) => E(x, '*', y)), rule: 'equals', target: a * n } }
            });
          })
        ]
      },
      {
        id: 'calc', title: '곱셈구구로 곱 구하기', standard: CALC,
        types: [
          T('calc-fact', '곱셈구구 계산(2·5단, 3·6단, 4·8단, 7단, 9단)', '①8 심10', (d, n) => {
            const a = d.pick(DANS[n]), b = d.int(3, 9);
            return N('다음을 계산하시오.', a * b, { figure: expr(a, '*', b, '=', box()), explain: times(a, b), facts: { calc: [[E(a, '*', b), 0]], rule: 'dan' + DANS[n].join('') } });
          }, { count: 5 }),
          T('calc-arrow', '화살표 칸에 곱 쓰기', '①9 심10', (d) => {
            const a = d.int(3, 9), [b, c] = d.shuffle(range(2, 9)).slice(0, 2);
            return M('빈칸 ㉠, ㉡에 알맞은 수는?', labelled([a * b, a * c]), {
              figure: lines([chain([a, '×' + b, box(L5[0])]), chain([a, '×' + c, box(L5[1])])]),
              explain: `${times(a, b)}, ${times(a, c)}`, facts: { calc: [[E(a, '*', b), 0], [E(a, '*', c), 1]] }
            });
          }),
          T('calc-row', '한 단의 곱을 표로 채우기', '①10 심11', (d, n) => {
            // 첫째는 곱하는 수가 차례로 놓인 표(이어 세어도 된다), 둘째는 곱하는 수가 섞인 표(곱을 하나씩 떠올려야 한다)
            const a = d.pick(n === 0 ? [3, 4, 6] : [7, 8, 9]), from = d.int(2, 6);
            const heads = n === 0 ? range(from, from + 3) : d.until(() => d.shuffle(range(2, 9)).slice(0, 4), (list) => list.some((v, i) => i > 0 && Math.abs(v - list[i - 1]) !== 1));
            return M(`${a}단 곱셈구구의 표이다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?`, labelled(heads.map((b) => a * b)), {
              figure: mtable(heads, [a], (i, j) => L5[j]), explain: heads.map((b) => times(a, b)).join(', '),
              facts: { calc: heads.map((b, i) => [E(a, '*', b), i]), rule: n === 0 ? 'row-inorder' : 'row-mixed' }
            });
          }, { count: 2 }),
          T('calc-match', '곱셈식과 곱 짝 짓기', '①11 심12', (d) => {
            const a = d.int(6, 9), bs = d.shuffle(range(3, 9)).slice(0, 3), values = bs.map((b) => a * b);
            const list = d.shuffle(d.shuffle(ORDERS.slice(1)).slice(0, 3).concat([ORDERS[0]]));
            return C('식과 곱을 알맞게 짝 지은 것은?', list.map((o) => o.map((k, i) => `${LABELS[i]} ${values[k]}`).join(', ')), list.findIndex((o) => o.join() === '0,1,2'), {
              figure: tagged(bs.map((b) => expr(a, '*', b))), explain: bs.map((b, i) => `${LABELS[i]} ${times(a, b)}`).join(', '),
              facts: { match: { exprs: bs.map((b) => E(a, '*', b)), options: list.map((o) => o.map((k) => values[k])) } }
            });
          }),
          T('calc-right', '잘못 계산한 곱셈식 찾기', '①12 심15', (d) => {
            // 틀린 값: 곱하는 수를 하나 더하거나 덜 센 곱, 일의 자리를 잘못 적은 곱
            const a = d.int(3, 9), bs = d.shuffle(range(3, 9)).slice(0, 4), bad = d.int(0, 3);
            const wrong = d.until(() => a * bs[bad] + d.pick([-a, a, -2, 2]), (v) => v > 0 && v !== a * bs[bad]);
            const said = bs.map((b, i) => (i === bad ? wrong : a * b));
            return C('계산이 틀린 것은?', LABELS, bad, {
              figure: tagged(bs.map((b, i) => expr(a, '*', b, '=', said[i]))), explain: `${LABELS[bad]} ${times(a, bs[bad])}`,
              facts: { claimed: bs.map((b, i) => [E(a, '*', b), said[i]]), claimedWant: false }
            });
          }),
          T('calc-inlist', '한 단의 곱셈구구 값 모두 고르기', '①13 ①14', (d) => {
            // 다섯 수: 그 단의 값 셋, 값에서 1이나 2가 어긋난 수, 옆 단에만 있는 값
            const a = d.int(3, 9), ins = d.shuffle(range(2, 9)).slice(0, 3).map((b) => a * b);
            const [o1, o2] = d.until(() => [d.pick(ins) + d.pick([-2, -1, 1, 2]), d.pick([a - 1, a + 1].filter((v) => v >= 2 && v <= 9)) * d.int(2, 9)], ([x, y]) => x !== y && !inDan(a, x) && !inDan(a, y));
            const list = d.shuffle(ins.concat([o1, o2])), flags = list.map((v) => inDan(a, v)), spots = list.map((_, i) => i);
            const made = setOptions(d, list, flags, [
              spots.filter((i) => (flags[i] && list[i] !== ins[0]) || list[i] === o1),
              spots.filter((i) => (flags[i] && list[i] !== ins[1]) || list[i] === o2),
              spots.filter((i) => flags[i] || list[i] === o1)
            ]);
            return C(`${a}단 곱셈구구의 값을 모두 고른 것은?`, made.options, made.answer, {
              figure: numbers(list), explain: `${a}단 곱셈구구의 값은 ${range(1, 9).map((b) => a * b).join(', ')}이다. 이 가운데 있는 수는 ${list.filter((_, i) => flags[i]).join(', ')}이다.`,
              facts: { sets: { labels: list, flags, options: made.sets } }
            });
          }),
          T('calc-notin', '한 단의 곱셈구구 값이 아닌 것', '심16', (d) => {
            // 값 셋과, 값에서 1이나 2가 어긋난 수 하나(45 대신 46)
            const a = d.int(2, 9), bs = d.shuffle(range(2, 9)).slice(0, 4), k = d.int(0, 3);
            const bad = d.until(() => a * bs[k] + d.pick(a === 2 ? [-1, 1] : [-2, -1, 1, 2]), (v) => !inDan(a, v) && v > 0);
            const list = bs.map((b, i) => (i === k ? bad : a * b)).sort((x, y) => x - y);
            return C(`${a}단 곱셈구구의 값이 아닌 것은?`, list.map(String), list.indexOf(bad), {
              explain: `${a}단 곱셈구구의 값은 ${range(1, 9).map((b) => a * b).join(', ')}이다. ${josa(bad, '은/는')} 여기에 없다.`,
              facts: { truth: list.map((v) => inDan(a, v)), want: false }
            });
          }),
          T('calc-count', '한 단의 곱셈구구 값의 개수', '심17', (d) => {
            // 4단 값과, 2단에만 있는 값을 섞는다(하나씩 가려야 한다)
            const [a, h] = d.pick([[4, 2], [6, 3], [8, 4], [6, 2], [8, 2]]), k = d.int(3, 5);
            const ins = d.shuffle(range(1, 9).map((b) => a * b)).slice(0, k), outs = d.shuffle(range(2, 9).map((b) => h * b).filter((v) => !inDan(a, v))).slice(0, 8 - k);
            const list = ins.concat(outs).sort((x, y) => x - y);
            return N(`다음 수 가운데 ${a}단 곱셈구구의 값은 모두 몇 개인가?`, k, {
              unit: '개', figure: numbers(list), explain: `${a}단 곱셈구구의 값은 ${list.filter((v) => inDan(a, v)).join(', ')}이다. 나머지는 ${h}단 곱셈구구에만 있다.`,
              facts: { count: list.map((v) => inDan(a, v)) }
            });
          }),
          T('calc-target', '곱이 정해진 수인 곱셈식 고르기', '①15', (d) => {
            const right = d.pick(FACTS.filter(([x, y]) => x !== y)), p = product(right);
            const others = d.until(() => d.shuffle(around(p, 10).filter((f) => product(f) !== p)).slice(0, 3), (list) => list.length === 3 && new Set(list.map(product)).size === 3);
            const list = d.shuffle([right].concat(others));
            return C(`곱이 ${p}인 것은?`, list.map(([x, y]) => `${x} × ${y}`), list.indexOf(right), {
              explain: list.map(([x, y]) => times(x, y)).join(', '), facts: { choose: { exprs: list.map(([x, y]) => E(x, '*', y)), rule: 'equals', target: p } }
            });
          }),
          T('calc-max', '곱이 가장 큰 곱셈식 고르기', '①15', (d) => {
            const center = d.int(20, 60);
            const list = d.until(() => d.shuffle(around(center, 9)).slice(0, 4), (rows) => rows.length === 4 && new Set(rows.map(product)).size === 4 && new Set(rows.map(([x]) => x)).size >= 3);
            const values = list.map(product);
            return C('곱이 가장 큰 것은?', list.map(([x, y]) => `${x} × ${y}`), values.indexOf(Math.max(...values)), {
              explain: list.map(([x, y]) => times(x, y)).join(', '), facts: { choose: { exprs: list.map(([x, y]) => E(x, '*', y)), rule: 'max' } }
            });
          }),
          T('calc-below', '어떤 수보다 작은 곱 고르기', '①15 심18', (d) => {
            const t = d.pick([20, 30, 40, 50]);
            const list = d.until(() => d.shuffle(around(t, 9).filter((f) => product(f) !== t)).slice(0, 3), (rows) => rows.length === 3 && rows.filter((f) => product(f) < t).length === 1 && new Set(rows.map(([x]) => x)).size === 3);
            return C(`곱이 ${t}보다 작은 것은?`, list.map(([x, y]) => `${x} × ${y}`), list.findIndex((f) => product(f) < t), {
              explain: list.map(([x, y]) => times(x, y)).join(', '), facts: { choose: { exprs: list.map(([x, y]) => E(x, '*', y)), rule: 'onlyBelow', target: t } }
            });
          }),
          T('calc-order', '곱이 큰 것부터 차례로 쓰기', '심19', (d) => {
            const center = d.int(18, 58);
            const rows = d.until(() => d.shuffle(around(center, 10)).slice(0, 3), (list) => list.length === 3 && new Set(list.map(product)).size === 3 && new Set(list.map(([x]) => x)).size === 3);
            const values = rows.map(product), right = [0, 1, 2].sort((p, q) => values[q] - values[p]);
            const list = d.shuffle(d.shuffle(ORDERS.filter((o) => o.join() !== right.join())).slice(0, 3).concat([right]));
            return C('곱이 큰 것부터 차례로 쓴 것은?', list.map((o) => o.map((i) => LABELS[i]).join(', ')), list.findIndex((o) => o.join() === right.join()), {
              figure: tagged(rows.map(([x, y]) => expr(x, '*', y))), explain: rows.map(([x, y], i) => `${LABELS[i]} ${times(x, y)}`).join(', '),
              facts: { choose: { exprs: rows.map(([x, y]) => E(x, '*', y)), rule: 'descending', orders: list } }
            });
          }),
          T('calc-same', '곱이 같은 곱셈식 모두 고르기', '①16', (d) => {
            // 8 × 3 과 곱이 같은 것: 두 수를 바꾼 3 × 8, 다른 단의 6 × 4. 틀린 것은 한 수만 하나 어긋난 식이다.
            const p = d.pick(MULTI), all = waysOf(p), base = d.pick(all.filter(([x, y]) => x !== y));
            const swap = [base[1], base[0]], other = d.pick(all.filter(([x]) => x !== base[0] && x !== base[1]));
            const ok = ([x, y]) => x >= 2 && x <= 9 && y >= 2 && y <= 9 && x * y !== p;
            const [w1, w2] = d.until(() => [[base[0], base[1] + d.pick([-1, 1])], [other[0] + d.pick([-1, 1]), other[1]]], ([u, v]) => ok(u) && ok(v) && u.join() !== v.join());
            const rows = d.shuffle([swap, other, w1, w2]), flags = rows.map((f) => product(f) === p), made = pairOptions(d, LABELS, flags);
            return C(`${base[0]} × ${josa(base[1], '과/와')} 곱이 같은 것을 모두 고른 것은?`, made.options, made.answer, {
              figure: tagged(rows.map(([x, y]) => expr(x, '*', y))), explain: `${times(base[0], base[1])}이다. ` + rows.map(([x, y], i) => `${LABELS[i]} ${times(x, y)}`).join(', '),
              facts: { sets: { labels: LABELS, flags, options: made.sets } }
            });
          }),
          T('calc-pair', '곱이 같은 두 식 찾기', '심14', (d) => {
            // 넷 가운데 곱이 같은 것은 서로 다른 단의 두 식뿐이다(6 × 2 와 3 × 4).
            const p = d.pick(MULTI), [u, v] = d.until(() => d.shuffle(waysOf(p)).slice(0, 2), ([x, y]) => x[0] !== y[1]);
            const others = d.until(() => d.shuffle(around(p, 8).filter((f) => product(f) !== p)).slice(0, 2), (list) => list.length === 2 && product(list[0]) !== product(list[1]));
            const rows = d.shuffle([u, v].concat(others)), flags = rows.map((f) => product(f) === p), made = pairOptions(d, LABELS, flags);
            return C('곱이 같은 두 식을 고른 것은?', made.options, made.answer, {
              figure: tagged(rows.map(([x, y]) => expr(x, '*', y))), explain: rows.map(([x, y], i) => `${LABELS[i]} ${times(x, y)}`).join(', '),
              facts: { choose: { exprs: rows.map(([x, y]) => E(x, '*', y)), rule: 'same', pairsShown: made.sets.map((s) => s.map((label) => LABELS.indexOf(label))) } }
            });
          })
        ]
      },
      {
        id: 'grow', title: '곱이 커지는 규칙과 여러 가지 방법으로 곱 구하기', standard: CALC,
        types: [
          T('grow-one', '곱하는 수가 1 커질 때 곱이 커지는 수', '①18', (d) => {
            const a = d.int(3, 9), b = d.int(2, 5);
            return N('그림을 보고 □ 안에 알맞은 수를 구하시오.', a, {
              figure: arr(b, a, { loop: 'rows' }) + arr(b + 1, a, { loop: 'rows', tone: (r) => r === b }) + lines([`${a} × ${josa(b + 1, '은/는')} ${a} × ${b}보다 ${box()}만큼 더 크다.`]),
              explain: `${a}개씩 한 묶음이 더 있으므로 ${a}만큼 더 크다.`, facts: { calc: [[`${a}*${b + 1}-${a}*${b}`, 0]] }
            });
          }),
          T('grow-less', '곱하는 수가 1 작을 때 곱이 작아지는 수', '①19', (d) => {
            const a = d.int(3, 9), b = d.int(3, 8);
            return N('□ 안에 알맞은 수는?', a, {
              figure: lines([`${a} × ${josa(b, '은/는')} ${a} × ${b + 1}보다 ${box()}만큼 더 작다.`]),
              explain: `${a} × ${josa(b + 1, '은/는')} ${josa(a, '을/를')} ${b + 1}번 더한 수이고, ${a} × ${josa(b, '은/는')} ${josa(a, '을/를')} ${b}번 더한 수이다. ${a}만큼 더 작다.`,
              facts: { calc: [[`${a}*${b + 1}-${a}*${b}`, 0]] }
            });
          }),
          T('grow-which', '단의 수만큼 더 큰(작은) 곱의 곱하는 수', '①20 ①21', (d, n) => {
            const a = d.int(3, 9), b = d.int(3, 8), next = n === 0 ? b + 1 : b - 1;
            return N('□ 안에 알맞은 수는?', next, {
              figure: lines([`${a} × ${b}보다 ${a}만큼 더 ${n === 0 ? '큰' : '작은'} 수는 ${a} × ${box()}이다.`]),
              explain: `${a}단 곱셈구구에서는 곱하는 수가 1 ${n === 0 ? '커지면' : '작아지면'} 곱이 ${a}만큼 ${n === 0 ? '커진다' : '작아진다'}. ${times(a, b)}, ${times(a, next)}`,
              facts: { calc: [[`(${a}*${b}${n === 0 ? '+' : '-'}${a})/${a}`, 0]] }
            });
          }, { count: 2 }),
          T('grow-chain', '앞의 곱에 단의 수를 더해 다음 곱 구하기', '①21 심20', (d, n) => {
            // 첫째: 3 × 6 = 18 → (+㉠) → 3 × 7 = ㉡ → (+㉠) → 3 × 8 = ㉢. 둘째(심20): 곱하는 수도 빈칸.
            const a = d.int(3, 9), b = d.int(2, 7), p = a * b;
            const step = '<span style="padding-left:2.2em;color:var(--brand-dark);font-weight:600">↓ + ' + box(L5[0]) + '</span>';
            if (n === 0) return M('곱이 커지는 규칙을 보고 ㉠, ㉡, ㉢에 알맞은 수를 구하시오.', labelled([a, p + a, p + 2 * a]), {
              figure: lines([expr(a, '*', b, '=', p), step, expr(a, '*', b + 1, '=', box(L5[1])), step, expr(a, '*', b + 2, '=', box(L5[2]))]),
              explain: `${a}단 곱셈구구에서는 곱이 ${a}씩 커진다. ${expr(p, '+', a, '=', p + a)}, ${expr(p + a, '+', a, '=', p + 2 * a)}`,
              facts: { calc: [[`${a}*${b + 1}-${a}*${b}`, 0], [E(a, '*', b + 1), 1], [E(a, '*', b + 2), 2]] }
            });
            return M('곱이 커지는 규칙을 보고 ㉠, ㉡, ㉢, ㉣에 알맞은 수를 구하시오.', labelled([a, b + 1, b + 2, p + 2 * a]), {
              figure: lines([expr(a, '*', b, '=', p), step, expr(a, '*', box(L5[1]), '=', p + a), step, expr(a, '*', box(L5[2]), '=', box(L5[3]))]),
              explain: `${expr(p + a, '-', p, '=', a)}이므로 곱이 ${a}씩 커진다. ${times(a, b + 1)}, ${times(a, b + 2)}`,
              facts: { calc: [[`${p + a}-${p}`, 0], [`${p + a}/${a}`, 1], [`(${p + a}+${a})/${a}`, 2], [`${p + a}+${a}`, 3]] }
            });
          }, { count: 2 }),
          T('grow-repeat', '곱셈식을 같은 수의 덧셈으로 풀어 쓰기', '①22', (d) => {
            // 3 × 4 = ㉠ + ㉠ + ㉠ + ㉠ = ㉡
            const a = d.int(3, 9), b = d.int(3, 5), sum = [];
            for (let i = 0; i < b; i += 1) sum.push(i ? '+' : '=', box(L5[0]));
            return M('곱셈식을 같은 수의 덧셈식으로 나타낸다. ㉠, ㉡에 알맞은 수는?', labelled([a, a * b]), {
              figure: lines([expr(a, '*', b), expr.apply(null, sum), expr('=', box(L5[1]))]),
              explain: `${a} × ${josa(b, '은/는')} ${josa(a, '을/를')} ${b}번 더한 수이다. ${times(a, b)}`, facts: { calc: [[String(a), 0], [E(a, '*', b), 1]] }
            });
          }),
          T('grow-ways', '그림의 수를 두 가지 방법으로 구하기', '①23', (d) => {
            // 5씩 ㉠번 더한다 / 5 × 6 에 ㉡만큼 더한다
            const a = d.pick([5, 5, 2, 3, 4]), n = d.int(5, 8), thing = d.pick(THINGS);
            return M(`${thing.what}의 수를 두 가지 방법으로 구한다. ㉠, ㉡에 알맞은 수는?`, labelled([n, a]), {
              figure: packs(a, n, thing) + lines([`${a}씩 ${box(L5[0])}번 더한다.`, `${a} × ${n - 1}에 ${box(L5[1])}만큼 더한다.`]),
              explain: `${a}개씩 ${n}묶음이므로 ${a}씩 ${n}번 더한다. ${a} × ${josa(n, '은/는')} ${a} × ${n - 1}보다 ${a}만큼 더 크다.`,
              facts: { calc: [[String(n), 0], [`${a}*${n}-${a}*${n - 1}`, 1]] }
            });
          }),
          T('grow-double', '같은 곱을 몇 번 더해 곱 구하기', '심22', (d) => {
            // 8 × 4 는 8 × 2 를 2번 더한 수
            const a = d.int(3, 7), [b, k] = d.pick([[4, 2], [6, 3], [6, 2], [8, 4], [8, 2], [9, 3]]);
            return N(`${a} × ${josa(b, '은/는')} ${a} × ${josa(k, '을/를')} 몇 번 더한 수와 같은가?`, b / k, {
              unit: '번', figure: arr(b, a, { tone: (r) => Math.floor(r / k) % 2 === 1, said: `한 줄에 ${a}개씩 ${b}줄, ${k}줄씩 색을 바꾸어 칠함` }),
              explain: `${a}개씩 ${b}줄은 ${a}개씩 ${k}줄이 ${b / k}번 있는 것과 같다. ${a} × ${josa(k, '을/를')} ${b / k}번 더하면 ${a} × ${josa(b, '이/가')} 된다.`,
              facts: { calc: [[`${a}*${b}/(${a}*${k})`, 0]] }
            });
          }),
          T('grow-part', '곱을 두 곱으로 갈라 구하기', '심21', (d) => {
            // 7 × 6 은 7 × 4 와 7 × ㉠ 의 합
            const a = d.int(4, 7), b = d.int(5, 9), k = d.int(2, b - 1);
            return M(`${a} × ${josa(b, '을/를')} 두 곱으로 갈라 구한다. ㉠, ㉡, ㉢에 알맞은 수는?`, labelled([b - k, a * (b - k), a * b]), {
              figure: arr(b, a, { tone: (r) => r >= k, said: `한 줄에 ${a}개씩 ${b}줄, 위쪽 ${k}줄과 나머지 줄을 다른 색으로 칠함` })
                + lines([`${a} × ${josa(b, '은/는')} ${a} × ${josa(k, '과/와')} ${a} × ${box(L5[0])}의 합과 같다.`, expr(a, '*', k, '=', a * k), expr(a, '*', box(L5[0]), '=', box(L5[1])), expr(a, '*', b, '=', box(L5[2]))]),
              explain: `${b}줄을 ${k}줄과 ${b - k}줄로 가른다. ${times(a, k)}, ${times(a, b - k)}이고, ${expr(a * k, '+', a * (b - k), '=', a * b)}이다.`,
              facts: { calc: [[`${b}-${k}`, 0], [`${a}*(${b}-${k})`, 1], [E(a, '*', b), 2]] }
            });
          }),
          T('grow-talk', '그림의 수를 구하는 방법을 잘못 말한 사람', '①25', (d) => {
            // 틀린 말은 묶음 수를 하나 더 세거나 한 묶음의 수를 하나 덜 센 곱이다.
            const a = d.int(6, 9), n = d.int(3, 5), thing = d.pick(THINGS), who = d.shuffle(NAMES).slice(0, 3);
            const slip = d.bool() ? [a, n + 1] : [a - 1, n];
            const rows = d.shuffle([
              [`${josa(a, '을/를')} ${n}번 더한다.`, Array.from({ length: n }, () => a).join('+')],
              [`${a} × ${n - 1}에 ${josa(a, '을/를')} 더한다.`, `${a}*${n - 1}+${a}`],
              [`${slip[0]} × ${slip[1]}의 곱을 구한다.`, E(slip[0], '*', slip[1])]
            ]);
            const bad = rows.findIndex(([, text]) => text === E(slip[0], '*', slip[1]));
            return C(`${thing.what}의 수를 구하는 방법을 잘못 말한 사람은?`, who, bad, {
              figure: packs(a, n, thing) + lines(rows.map(([said], i) => '<span class="mb-tag mb-tag-short" style="min-width:3em">' + who[i] + '</span>' + said)),
              explain: `${a}개씩 ${n}묶음이므로 ${a} × ${josa(n, '으로/로')} 구한다. ${slip[0]} × ${josa(slip[1], '은/는')} 이 그림의 수가 아니다.`,
              facts: { claimed: rows.map(([, text]) => [text, a * n]), claimedWant: false }
            });
          }),
          T('grow-minus', '빈 곳이 있는 배열을 채워서 세기', '①26', (d) => {
            // 8 × 3 에서 2 를 빼면 22
            const c = d.int(5, 9), r = d.int(3, 5), k = d.int(1, 3), what = d.pick(['과자', '구슬', '바둑돌']);
            return M(`${what}의 수를 구한다. ㉠, ㉡에 알맞은 수는?`, labelled([r, c * r - k]), {
              figure: arr(r, c, { skip: (row, col) => row === r - 1 && col >= c - k, said: `한 줄에 ${c}개씩 ${r}줄에서 ${k}개가 빈 배열` })
                + lines([`${c} × ${box(L5[0])}에서 ${josa(k, '을/를')} 빼면 모두 ${box(L5[1])}개이다.`]),
              explain: `빈 곳을 채우면 한 줄에 ${c}개씩 ${r}줄이다. ${times(c, r)}이고, ${expr(c * r, '-', k, '=', c * r - k)}이다.`,
              facts: { calc: [[String(r), 0], [`${c}*${r}-${k}`, 1]] }
            });
          }),
          T('grow-plus', '덩어리 그림을 둘로 나누어 세기', '①26 심24', (d) => {
            // 위쪽 7 × 3, 아래쪽 5 × 2 → 21 + 10
            const c1 = d.int(5, 8), r1 = d.int(2, 4), c2 = d.int(2, c1 - 1), r2 = d.int(2, 3), what = d.pick(['도넛', '구슬', '바둑돌']);
            return M(`${what}의 수를 두 덩어리로 나누어 구한다. ㉠, ㉡, ㉢에 알맞은 수는?`, labelled([r2, c2 * r2, c1 * r1 + c2 * r2]), {
              figure: arr(r1 + r2, c1, { skip: (row, col) => row >= r1 && col >= c2, tone: (row) => row >= r1, said: `위쪽은 한 줄에 ${c1}개씩 ${r1}줄, 아래쪽은 한 줄에 ${c2}개씩 ${r2}줄` })
                + lines([`위쪽 ${expr(c1, '*', r1, '=', c1 * r1)}`, `아래쪽 ${expr(c2, '*', box(L5[0]), '=', box(L5[1]))}`, `모두 ${box(L5[2])}개이다.`]),
              explain: `아래쪽은 ${c2}개씩 ${r2}줄이다. ${times(c2, r2)}이고, ${expr(c1 * r1, '+', c2 * r2, '=', c1 * r1 + c2 * r2)}이다.`,
              facts: { calc: [[String(r2), 0], [`${c2}*${r2}`, 1], [`${c1}*${r1}+${c2}*${r2}`, 2]] }
            });
          })
        ]
      },
      {
        id: 'box', title: '□가 있는 곱셈식과 곱의 크기 비교', standard: CALC,
        types: [
          T('box-find', '곱하는 수(곱해지는 수) □ 구하기', '①29 심25 심13', (d, n) => {
            const [a, b] = d.pick(FACTS.filter(([x, y]) => x !== y)), p = a * b;
            return N('□ 안에 알맞은 수는?', n === 0 ? b : a, {
              figure: n === 0 ? expr(a, '*', box(), '=', p) : expr(box(), '*', b, '=', p),
              explain: `${times(a, b)}이므로 □ 안에 알맞은 수는 ${n === 0 ? b : a}이다.`, facts: { calc: [[`${p}/${n === 0 ? a : b}`, 0]] }
            });
          }, { count: 2 }),
          T('box-max', '□ 안의 수가 가장 큰 식 고르기', '①30 심26', (d) => {
            // 곱이 가장 큰 식이 답이 되지 않게 한다(곱의 크기만 보고는 고를 수 없다).
            const rows = d.until(() => Array.from({ length: 4 }, () => { const [k, x] = d.pick(FACTS); return { k, x, front: d.bool() }; }), (list) => {
              const xs = list.map((row) => row.x), ps = list.map((row) => row.k * row.x), top = Math.max(...xs);
              return xs.filter((v) => v === top).length === 1 && new Set(list.map((row) => row.k * 10 + row.x)).size === 4 && ps.indexOf(Math.max(...ps)) !== xs.indexOf(top);
            });
            const xs = rows.map((row) => row.x);
            return C('□ 안에 알맞은 수가 가장 큰 것은?', LABELS, xs.indexOf(Math.max(...xs)), {
              figure: tagged(rows.map((row) => (row.front ? expr(box(), '*', row.k, '=', row.k * row.x) : expr(row.k, '*', box(), '=', row.k * row.x)))),
              explain: '□ 안에 알맞은 수는 ' + rows.map((row, i) => `${LABELS[i]} ${row.x}`).join(', ') + '이다.',
              facts: { choose: { exprs: rows.map((row) => `${row.k * row.x}/${row.k}`), rule: 'max' } }
            });
          }),
          T('box-both', '양쪽이 곱셈인 식의 □', '①31 심27', (d) => {
            // 4 × □ = 6 × 6
            const [a, x, c, e] = d.until(() => { const [p, q] = d.pick(FACTS), k = d.int(2, 9); return [k, (p * q) / k, p, q]; }, ([k, v, p, q]) => Number.isInteger(v) && v >= 2 && v <= 9 && k !== p && k !== q);
            return N('□ 안에 알맞은 수는?', x, {
              figure: expr(a, '*', box(), '=', c, '*', e), explain: `${times(c, e)}이다. ${times(a, x)}이므로 □ 안에 알맞은 수는 ${x}이다.`,
              facts: { calc: [[`${c}*${e}/${a}`, 0]] }
            });
          }),
          T('box-compare', '두 곱의 크기 비교', '①32 심18', (d) => {
            const same = d.int(0, 2) === 0;
            const [[a, b], [c, e]] = d.until(() => [d.pick(FACTS), d.pick(FACTS)], ([p, q]) => p[0] !== q[0] && p[0] !== q[1] && (same ? product(p) === product(q) : product(p) !== product(q) && Math.abs(product(p) - product(q)) <= 8));
            const x = a * b, y = c * e;
            return C('두 곱의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, x > y ? 0 : x === y ? 1 : 2, {
              figure: versus(expr(a, '*', b), expr(c, '*', e)), explain: `${times(a, b)}, ${times(c, e)}`,
              facts: { choose: { exprs: [E(a, '*', b), E(c, '*', e)], rule: 'compare' }, rule: 'compare' }
            });
          }),
          T('box-between', '두 곱 사이의 수', '①33 심30', (d) => {
            // 두 곱 자신은 들지 않는다(15보다 크고 18보다 작은 수에 15와 18은 없다).
            const [[a, b], [c, e]] = d.until(() => [d.pick(FACTS), d.pick(FACTS)], ([p, q]) => product(q) - product(p) >= 2 && product(q) - product(p) <= 5);
            const lo = a * b, hi = c * e, mid = lo + d.int(1, hi - lo - 1), list = [lo, mid, hi, d.bool() ? hi + 1 : lo - 1].sort((x, y) => x - y);
            return C(`${a} × ${b}보다 크고 ${c} × ${e}보다 작은 수는?`, list.map(String), list.indexOf(mid), {
              explain: `${times(a, b)}, ${times(c, e)}이다. ${lo}보다 크고 ${hi}보다 작은 수를 고른다. ${josa(lo, '과/와')} ${josa(hi, '은/는')} 들지 않는다.`,
              facts: { between: { low: E(a, '*', b), high: E(c, '*', e), exprs: list.map(String) } }
            });
          })
        ]
      }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
