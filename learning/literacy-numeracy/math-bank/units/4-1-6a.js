// 4학년 1학기 6단원 규칙 찾기 — 단원 틀과 기본 문항(수 배열표, 한 줄로 놓인 수, 도형의 배열, 덧셈식·뺄셈식의 배열).
// 수집해 둔 교과서 9종의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1~3: 75·75·78꼴, 심화꼴 73꼴)을 처음부터 끝까지 대조하여,
// 꼴마다 ① 몇 학년 무슨 단원 내용인가 ② 무엇을 주고 무엇을 묻는가를 따져서 실었다. 꼴 번호는 ①n = 기본꼴_1의 n번, ②n, ③n, 심n.
// (곱셈식·나눗셈식의 배열, 수 배열표·달력의 계산식, 등호를 사용한 식의 문항과 실력 문항은 4-1-6b.js에 있다.)
//
// 싣는 기준
//  - 주는 것(배열의 얼개)·규칙의 종류(더하기·곱하기, 한 방향·대각선, 같은 만큼·커지는 만큼)·묻는 것(규칙, 빈칸, 다음, 몇째)이 다르면 다른 문제다.
//    숫자만 다르거나 상황만 다른 것(신발장·사물함 번호의 빈칸은 수 배열표의 빈칸과, 삼각수는 계단 모양과 같다)은 한 번만 싣는다.
//  - 뽑은 글에 그림이 없는 꼴(도형의 배열, 수 배열표)은 꼴의 얼개만 따라 배열과 수를 새로 정했다.
//  - 규칙을 글로 쓰는 꼴(①11·30·42 ②5·28 ③2·22·36)은 「규칙을 바르게 말한 것은?」으로, 다음 모양을 그리는 꼴(①18 ②26 ③23 심37)은
//    「알맞은 모양은?」과 「몇 개인가?」로 바꾸어 실었다.
//  - 계산식의 배열은 직접 셈하지 않고 규칙으로 미루어 아는 것이 뜻이다. 여섯 자리를 넘는 답은 적지 않고 고르게 했다.
//  - 수는 수집 자료의 보기와 겹치지 않게 새로 정했다(1 + 3 + 5 + …, 1 + 2 + 3 + 2 + 1 처럼 널리 알려진 수의 규칙은 그대로 쓴다).
//
// 뺀 것과 까닭
//  - 5학년 「규칙과 대응」: ★째 모양의 개수를 구하는 식(②29), 순서와 개수의 대응식으로 푸는 풀이(③18 변형)
//  - 규칙이 두 겹인 것: 가로·세로 모두 늘어나는 폭이 달라지는 표(①8 ②9 ③6 심17), 늘어나는 수가 커지는 수들의 합(③15),
//    3배·2배로 따로 커지는 뺄셈식(①36), 색이 번갈아 바뀌며 늘어나는 모양(②24 변형 심35·36), 늘어나는 수가 3·4씩 커지는 모양(③28 변형 심31)
//  - 숨은 셈을 알아채야 풀리는 표: 머리 수 둘을 셈한 결과의 일부만 적은 표(②11 ③8 심14), 파스칼의 삼각형(심16)
//  - 2학년 「규칙 찾기」 복습: 덧셈표·곱셈표(②12·73 ③78), 무늬(②74), 쌓기나무(②75)
//  - 작도·서술형·만들기: 수의 배열을 보고 도형 그리기(①29), 규칙 만들기(②14 ③12·29·44), 뜻 없는 셈(두 배열 빈칸의 합·차, 여러 순서의 합 ③27)
//  - 그림이 필요해 미룬 것: 돌리며 늘어나는 모양(①28 ③24 변형) — 원을 중심으로 돌아가며 사각형이 늘어나는 배열(4-1 「평면도형의 이동」과도 겹친다)
//    화살표 두 갈래로 이어진 수 배열(심18) — 뽑은 글에 배열이 없다.
// 묻는 말: 수나 값을 물으면 "~은?/~는?", 양을 물으면 "몇 ~인가?" 로 맺는다. 방향은 → ↓ ↘ ↗ ↙ ↑ ← 로 적는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { LABELS, NAMES, box, lines, josa, N, M, C } = B.kit;
  const G = B.kit.geo;
  const RULE = '4수02-01', CALC = '4수02-02', EQUAL = '4수02-03';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const ORD = ['첫째', '둘째', '셋째', '넷째', '다섯째', '여섯째', '일곱째', '여덟째', '아홉째', '열째'];
  const S = { '+': '+', '-': '−', '*': '×', '/': '÷' };
  // 식 글: fmt('250+120=370') → '250 + 120 = 370'
  const fmt = (text) => String(text).replace(/[+\-*\/=]/g, (ch) => ' ' + (S[ch] || ch) + ' ');
  const calcOf = (a, op, b) => (op === '+' ? a + b : op === '-' ? a - b : op === '*' ? a * b : a / b);
  const truthOf = (rows, want) => ({ truth: rows.map((row) => row[1]), want });
  const range = (n, from) => Array.from({ length: n }, (_, i) => i + (from || 0));
  // 이름(첫째, 둘째 …)을 붙여 여러 줄로 늘어놓기. named() 는 이름과 식이 붙어 보여 칸을 넓혀 쓴다.
  const named = (list, names) => lines(list.map((html, i) => '<span class="mb-tag mb-tag-short" style="min-width:3.6em">' + (names || ORD)[i] + '</span>' + html));
  const eqs = (list, names) => named(list.map(fmt), names);
  // 한 줄로 놓인 수. kit 의 수 늘어놓기는 네 자리 수 다섯 개가 휴대폰 너비에서 두 줄로 넘어가므로 사이를 좁혀 쓴다.
  const seq = (list) => '<div class="mb-numbers" style="gap:6px 14px;padding:8px 12px">' + list.map((v) => '<span style="font-size:1.1rem">' + v + '</span>').join('') + '</div>';

  // ── 수 배열표 ────────────────────────────────────────────────
  // table() 은 첫 칸을 머리 칸처럼 굵게 칠하므로, 수 배열표는 칸을 모두 같게 그린다. 칸이 배열이면 색칠한 칸, 빈 글이면 지워진 칸이다.
  const td = (c) => (Array.isArray(c) ? '<td style="background:#fde68a;font-weight:400">' + c[0] + '</td>' : '<td style="background:' + (c === '' ? '#eef1f4' : '#fff') + ';font-weight:400">' + (c === '' ? '&nbsp;' : c) + '</td>');
  const grid = (rows, head) => '<div class="mb-table-wrap"><table class="mb-table">' + (head ? '<thead><tr>' + head.map((c) => '<th>' + c + '</th>').join('') + '</tr></thead>' : '') + '<tbody>' + rows.map((row) => '<tr>' + row.map(td).join('') + '</tr>').join('') + '</tbody></table></div>';
  const tableOf = (cell, rows, cols, marks) => grid(range(rows).map((r) => range(cols).map((c) => (marks && (r + ',' + c) in marks ? marks[r + ',' + c] : cell(r, c)))));
  // a 에서 시작하여 → 방향으로 h 씩, ↓ 방향으로 v 씩 커지는 표
  const cellOf = (a, h, v) => (r, c) => a + c * h + r * v;
  const HV = [[1, 100], [10, 100], [2, 100], [20, 100], [10, 200], [1, 1000], [10, 1000], [100, 1000]];
  const startOf = (d) => d.int(1, 4) * 1000 + d.int(1, 5) * 100 + d.int(1, 5) * 10 + d.int(1, 5);
  const WEEK = ['일', '월', '화', '수', '목', '금', '토'];
  // 달력: first 는 1일의 요일(0 = 일요일), days 는 그 달의 날수
  function calendar(first, days) {
    const rows = []; let row = range(first).map(() => '');
    for (let day = 1; day <= days; day += 1) { row.push(day); if (row.length === 7) { rows.push(row); row = []; } }
    if (row.length) { while (row.length < 7) row.push(''); rows.push(row); }
    return grid(rows, WEEK);
  }

  // ── 도형의 배열 ──────────────────────────────────────────────
  // 모양 하나는 { w, h(모눈 칸 수), n(개수), on(색칠한 것의 수), body(u, ox, oy) }. 좌표는 모눈 칸 단위이고 y 는 아래로 커진다.
  const fx = (v) => Math.round(v * 10) / 10;
  const span = (list, k) => 1 + Math.max.apply(null, list.map((c) => c[k]));
  const sq = (cells) => ({ w: span(cells, 0), h: span(cells, 1), n: cells.length, on: cells.filter((c) => c[2]).length,
    body: (u, ox, oy) => cells.map(([x, y, on]) => '<rect class="mb-poly" style="stroke-width:1.2' + (on ? ';fill:#93c5fd' : '') + '" x="' + fx(ox + x * u) + '" y="' + fx(oy + y * u) + '" width="' + u + '" height="' + u + '"/>').join('') });
  const st = (stones) => ({ w: span(stones, 0), h: span(stones, 1), n: stones.length, on: stones.filter((c) => c[2]).length,
    body: (u, ox, oy) => stones.map(([x, y, on]) => '<circle class="mb-poly" style="stroke-width:1.2;fill:' + (on ? '#374151' : '#fff') + '" cx="' + fx(ox + (x + 0.5) * u) + '" cy="' + fx(oy + (y + 0.5) * u) + '" r="' + fx(u * 0.4) + '"/>').join('') });
  // 성냥개비: 선분 [x1, y1, x2, y2] 를 양 끝을 조금 줄여 긋는다(개비가 하나씩 떨어져 보이게).
  const sticks = (segs, pieces) => ({ w: Math.max.apply(null, segs.map((s) => Math.max(s[0], s[2]))), h: Math.max.apply(null, segs.map((s) => Math.max(s[1], s[3]))), n: segs.length, pieces,
    body: (u, ox, oy) => segs.map(([x1, y1, x2, y2]) => { const k = 0.13, dx = x2 - x1, dy = y2 - y1; return '<line class="mb-line" style="stroke:#b45309;stroke-width:2.6" x1="' + fx(ox + (x1 + dx * k) * u) + '" y1="' + fx(oy + (y1 + dy * k) * u) + '" x2="' + fx(ox + (x2 - dx * k) * u) + '" y2="' + fx(oy + (y2 - dy * k) * u) + '"/>'; }).join('') });
  // 변을 k 칸으로 똑같이 나눈 정사각형
  const split = (k, size) => ({ w: size, h: size, n: k * k,
    body: (u, ox, oy) => { let out = '<rect class="mb-poly" style="stroke-width:1.4" x="' + fx(ox) + '" y="' + fx(oy) + '" width="' + size * u + '" height="' + size * u + '"/>'; for (let i = 1; i < k; i += 1) { const t = (size * u * i) / k; out += '<path class="mb-line" style="stroke-width:1;fill:none" d="M' + fx(ox + t) + ' ' + fx(oy) + 'v' + size * u + 'M' + fx(ox) + ' ' + fx(oy + t) + 'h' + size * u + '"/>'; } return out; } });
  // 모양 여럿을 왼쪽부터 나란히 놓고(바닥을 맞춘다) 아래에 이름(첫째, 둘째 …)을 적는다.
  function steps(shapes, names, label, maxUnit) {
    const gap = 12, pad = 6, slotsFor = (unit) => shapes.map((sh) => Math.max(sh.w * unit, 30)), widthFor = (unit) => pad * 2 + gap * (shapes.length - 1) + slotsFor(unit).reduce((s, v) => s + v, 0);
    let u = maxUnit || 16;
    while (u > 8 && widthFor(u) > 276) u -= 1;
    const slots = slotsFor(u), high = Math.max.apply(null, shapes.map((sh) => sh.h)) * u;
    let x = pad, out = '';
    shapes.forEach((sh, i) => {
      out += sh.body(u, x + (slots[i] - sh.w * u) / 2, pad + high - sh.h * u);
      out += '<text class="mb-label" x="' + fx(x + slots[i] / 2) + '" y="' + fx(pad + high + 16) + '" text-anchor="middle">' + names[i] + '</text>';
      x += slots[i] + gap;
    });
    return '<svg class="mb-geo" viewBox="0 0 ' + fx(x - gap + pad) + ' ' + fx(pad + high + 24) + '" width="' + fx(x - gap + pad) + '" role="img" aria-label="' + label + '">' + out + '</svg>';
  }
  const told = (shapes, names, what) => '모양의 배열: ' + shapes.map((sh, i) => names[i] + ' ' + what + ' ' + sh.n + '개').join(', ');
  // 모양들: n 은 몇째인가
  const ell = (n) => range(n).map((i) => [i, n - 1]).concat(range(n - 1).map((i) => [0, i]));                      // ㄴ자: 2n-1
  const plus = (n) => [[n - 1, n - 1]].concat(range(n - 1, 1).reduce((all, k) => all.concat([[n - 1 - k, n - 1], [n - 1 + k, n - 1], [n - 1, n - 1 - k], [n - 1, n - 1 + k]]), []));   // 십자: 4n-3
  const twoRow = (n) => range(n + 1).map((i) => [i, 1]).concat(range(n).map((i) => [i, 0]));                         // 두 줄: 2n+1
  const tee = (n) => range(2 * n - 1).map((i) => [i, n - 1]).concat(range(n - 1).map((i) => [n - 1, i]));           // ㅗ자: 3n-2
  const vee = (n) => [[n - 1, n - 1]].concat(range(n - 1, 1).reduce((all, k) => all.concat([[n - 1 - k, n - 1 - k], [n - 1 + k, n - 1 - k]]), []));   // V자: 2n-1
  const block = (rows, cols) => range(rows).reduce((all, r) => all.concat(range(cols).map((c) => [c, r])), []);      // 직사각형: rows × cols
  const stairs = (n) => range(n).reduce((all, r) => all.concat(range(r + 1).map((c) => [c, r])), []);                // 계단: 1+2+…+n
  const pyramid = (n) => range(n).reduce((all, r) => all.concat(range(r + 1).map((c) => [(n - 1 - r) / 2 + c, r])), []);   // 삼각형: 1+2+…+n
  const ring = (n) => block(n + 1, n + 1).filter(([x, y]) => x === 0 || y === 0 || x === n || y === n);             // 테두리: 4n
  // 벽돌처럼 쌓은 칸(위 줄부터). 위 칸은 아래 두 칸 사이에 놓인다.
  function bricks(rows, label) {
    const cw = 60, ch = 30, most = rows[rows.length - 1].length;
    let out = '';
    rows.forEach((row, r) => row.forEach((v, i) => {
      const x = 4 + ((most - row.length) * cw) / 2 + i * cw, y = 4 + r * ch;
      out += '<rect class="mb-poly" style="stroke-width:1.2;fill:' + (v === '' ? '#eef1f4' : '#fff') + '" x="' + x + '" y="' + y + '" width="' + cw + '" height="' + ch + '"/><text class="mb-label" style="font-size:14px" x="' + (x + cw / 2) + '" y="' + (y + ch / 2 + 1) + '" text-anchor="middle" dominant-baseline="central">' + v + '</text>';
    }));
    return '<svg class="mb-geo" viewBox="0 0 ' + (most * cw + 8) + ' ' + (rows.length * ch + 8) + '" width="' + (most * cw + 8) + '" role="img" aria-label="' + label + '">' + out + '</svg>';
  }

  // ── 자리 수가 늘어나는 계산식 ─────────────────────────────────
  const rep = (digit, k) => Number(String(digit).repeat(k));
  const back = (n) => Number(String(n).split('').reverse().join(''));
  const run = (k) => Number(range(k, 2).join(''));   // 2, 23, 234, 2345 …
  const GROW = {
    mirror: { a: run, op: '+', b: (k) => back(run(k)) },                       // 2+2=4, 23+32=55, 234+432=666
    nines: { a: run, op: '+', b: (k) => rep(9, k) - run(k) },                  // 2+7=9, 23+76=99, 234+765=999
    plusThree: { a: (k) => rep(9, k), op: '+', b: () => 3 },                   // 9+3=12, 99+3=102, 999+3=1002
    minusThree: { a: (k) => Math.pow(10, k) + 2, op: '-', b: () => 3 },        // 12-3=9, 102-3=99, 1002-3=999
    minusFour: { a: (k) => Math.pow(10, k) + 3, op: '-', b: () => 4 },         // 13-4=9, 103-4=99, 1003-4=999
    sevens: { a: (k) => rep(7, k), op: '+', b: (k) => rep(4, k) }              // 7+4=11, 77+44=121, 777+444=1221
  };
  const valueOf = (f, k) => calcOf(f.a(k), f.op, f.b(k));
  const lineOf = (f, k) => fmt(f.a(k) + f.op + f.b(k) + '=' + valueOf(f, k));
  const wordOf = (op) => ({ '+': '덧셈식', '-': '뺄셈식', '*': '곱셈식', '/': '나눗셈식' })[op];

  B.addUnit({
    id: '4-1-6', grade: 4, semester: 1, no: 6, title: '규칙 찾기', version: 3,
    groups: [
      {
        id: 'table', title: '수 배열표에서 규칙 찾기', standard: RULE,
        types: [
          T('tb-steps', '가로와 세로의 규칙', '①1 ②1 ③1 심5', (d) => {
            const [h, v] = d.pick(HV), cell = cellOf(startOf(d), h, v);
            return M('수 배열표에서 규칙을 찾았다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: h }, { label: LABELS[1], answer: v }], {
              figure: tableOf(cell, 4, 4) + lines([`→ 방향으로 ${box(LABELS[0])}씩 커진다.`, `↓ 방향으로 ${box(LABELS[1])}씩 커진다.`]),
              explain: `→ 방향으로 ${cell(0, 1)} - ${cell(0, 0)} = ${h}씩, ↓ 방향으로 ${cell(1, 0)} - ${cell(0, 0)} = ${v}씩 커진다.`,
              facts: { calc: [[`${cell(0, 1)}-${cell(0, 0)}`, 0], [`${cell(1, 0)}-${cell(0, 0)}`, 1]] }
            });
          }),
          T('tb-back', '거꾸로 가는 방향의 규칙', '①1·2 ②1 ③1', (d) => {
            // 방향을 거꾸로 가면 작아진다. 틀린 보기: 커진다고 한 것, 다른 방향의 수를 쓴 것
            const [h, v] = d.pick(HV), cell = cellOf(startOf(d), h, v), upward = d.bool(), step = upward ? v : h, other = upward ? h : v;
            const rows = d.shuffle([[`${step}씩 작아진다.`, true], [`${step}씩 커진다.`, false], [`${other}씩 작아진다.`, false], [`${other}씩 커진다.`, false]]);
            return C(`수 배열표에서 ${upward ? '↑' : '←'} 방향의 규칙으로 옳은 것은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
              figure: tableOf(cell, 4, 4), explain: `${upward ? '아래에서 위로' : '오른쪽에서 왼쪽으로'} 갈수록 ${step}씩 작아진다. ${upward ? cell(1, 0) : cell(0, 1)} - ${cell(0, 0)} = ${step}`, facts: truthOf(rows, true)
            });
          }),
          T('tb-less', '작아지는 표의 규칙', '①1 ②1', (d) => {
            const [h, v] = d.pick(HV), cell = cellOf(startOf(d) + 400, -h, v);
            return N('수 배열표에서 → 방향으로 몇씩 작아지는가?', h, { figure: tableOf(cell, 4, 4), explain: `${cell(0, 0)} - ${cell(0, 1)} = ${h}이므로 → 방향으로 ${h}씩 작아진다.`, facts: { calc: [[`${cell(0, 0)}-${cell(0, 1)}`, 0]] } });
          }),
          T('tb-diag', '↘ 방향의 규칙', '①3 ②1 ③1 심6', (d) => {
            const [h, v] = d.pick(HV), cell = cellOf(startOf(d), h, v);
            return N('수 배열표에서 ↘ 방향으로 몇씩 커지는가?', h + v, { figure: tableOf(cell, 4, 4), explain: `${cell(1, 1)} - ${cell(0, 0)} = ${h + v}이므로 ↘ 방향으로 ${h + v}씩 커진다. → 방향으로 ${h}, ↓ 방향으로 ${v} 커진 것을 합친 것이다.`, facts: { calc: [[`${cell(1, 1)}-${cell(0, 0)}`, 0]] } });
          }),
          T('tb-diag-up', '↗ 방향의 규칙', '①3 ②2 심6', (d) => {
            // 틀린 보기: 대각선은 늘 두 규칙을 더한다고 여긴 것, 커지는지 작아지는지를 거꾸로 본 것
            const [h, v] = d.pick(HV), cell = cellOf(startOf(d), h, v);
            const rows = d.shuffle([[`${v - h}씩 작아진다.`, true], [`${v + h}씩 작아진다.`, false], [`${v - h}씩 커진다.`, false], [`${v + h}씩 커진다.`, false]]);
            return C('수 배열표에서 ↗ 방향의 규칙으로 옳은 것은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
              figure: tableOf(cell, 4, 4), explain: `↗ 방향으로 한 칸 가면 위로 한 칸(${v} 작아짐), 오른쪽으로 한 칸(${h} 커짐) 간 것이다. ${cell(1, 0)} - ${cell(0, 1)} = ${v - h}이므로 ${v - h}씩 작아진다.`, facts: truthOf(rows, true)
            });
          }),
          T('tb-cell', '수 배열표의 빈칸', '①4 ②3 ③3 심2', (d) => {
            const [h, v] = d.pick(HV), cell = cellOf(startOf(d), h, v), r = d.int(1, 3), c = d.int(1, 3);
            return N('수 배열표에서 빈칸에 알맞은 수는?', cell(r, c), { figure: tableOf(cell, 4, 4, { [r + ',' + c]: box() }), explain: `→ 방향으로 ${h}씩 커진다. ${cell(r, c - 1)}보다 ${h} 큰 수는 ${cell(r, c)}이다.`, facts: { calc: [[`${cell(r, c - 1)}+${cell(0, 1)}-${cell(0, 0)}`, 0]] } });
          }),
          T('tb-wrap', '줄을 바꾸어 이어 적은 표의 빈칸', '①4 ③4', (d) => {
            const k = d.int(2, 6), s = d.until(() => d.int(2, 15), (v) => v !== k), cell = (r, c) => s + k * (r * 5 + c), r = d.int(2, 3);
            return N('수를 규칙에 따라 차례로 적은 표이다. ㉠에 알맞은 수는?', cell(r, 0), { figure: tableOf(cell, 4, 5, { [r + ',0']: box(LABELS[0]) }), explain: `→ 방향으로 ${k}씩 커지고, 줄이 바뀌어도 이어서 ${k}씩 커진다. ${cell(r - 1, 4)}보다 ${k} 큰 수는 ${cell(r, 0)}이다.`, facts: { calc: [[`${cell(r - 1, 4)}+${cell(0, 1)}-${cell(0, 0)}`, 0]] } });
          }),
          T('tb-wrap-down', '줄을 바꾸어 이어 적은 표의 세로 규칙', '③4', (d) => {
            const k = d.int(2, 6), s = d.int(2, 15), cols = d.pick([5, 6]), cell = (r, c) => s + k * (r * cols + c);
            return N('수를 규칙에 따라 차례로 적은 표이다. ↓ 방향으로 몇씩 커지는가?', k * cols, { figure: tableOf(cell, 3, cols), explain: `→ 방향으로 ${k}씩 커지고 한 줄에 ${cols}칸이므로 ↓ 방향으로 ${k} × ${cols} = ${k * cols}씩 커진다. ${cell(1, 0)} - ${cell(0, 0)} = ${k * cols}`, facts: { calc: [[`${cell(1, 0)}-${cell(0, 0)}`, 0]] } });
          }),
          T('tb-torn', '일부가 지워진 표의 칸', '①9 ②4 심3', (d) => {
            const [h, v] = d.pick(HV), cell = cellOf(startOf(d), h, v), [r, c] = d.pick([[2, 2], [2, 3], [3, 2], [3, 3]]), marks = {};
            for (let i = 1; i < 4; i += 1) for (let j = 1; j < 4; j += 1) marks[i + ',' + j] = '';
            marks[r + ',' + c] = box(LABELS[0]);
            return N('수 배열표의 일부가 지워졌다. ㉠에 알맞은 수는?', cell(r, c), { figure: tableOf(cell, 4, 4, marks), explain: `→ 방향으로 ${h}씩, ↓ 방향으로 ${v}씩 커진다. ${cell(r, 0)}에서 → 방향으로 ${c}칸 가면 ${cell(r, c)}이다.`, facts: { calc: [[`${cell(0, c)}+${cell(r, 0)}-${cell(0, 0)}`, 0]] } });
          }),
          T('tb-line', '규칙에 맞는 방향 찾기', '③5 심8', (d) => {
            const [h, v] = d.pick(HV), cell = cellOf(startOf(d), h, v), down = d.bool(), step = down ? h + v : v - h;
            const dirs = d.shuffle([['→', `${cell(0, 1)}-${cell(0, 0)}`], ['↓', `${cell(1, 0)}-${cell(0, 0)}`], ['↘', `${cell(1, 1)}-${cell(0, 0)}`], ['↙', `${cell(1, 0)}-${cell(0, 1)}`]]);
            return C(`수 배열표에서 ${step}씩 커지는 수가 놓인 방향은?`, dirs.map((x) => x[0] + ' 방향'), dirs.findIndex((x) => x[0] === (down ? '↘' : '↙')), {
              figure: tableOf(cell, 4, 4), explain: `→ 방향으로 ${h}씩, ↓ 방향으로 ${v}씩, ↘ 방향으로 ${h + v}씩, ↙ 방향으로 ${v - h}씩 커진다.`, facts: { choose: { exprs: dirs.map((x) => x[1]), rule: 'equals', target: step } }
            });
          }),
          T('tb-expr', '방향의 규칙을 식으로 나타내기', '②13 심13', (d) => {
            // 틀린 보기: 다른 방향(가로·세로를 뒤바꾼 것, 대각선)의 식
            const [h, v] = d.pick(HV), cell = cellOf(startOf(d), h, v), down = d.bool();
            const rows = d.shuffle([[`${cell(0, 0)} + ${h} = ${cell(0, 1)}`, !down], [`${cell(0, 0)} + ${v} = ${cell(1, 0)}`, down], [`${cell(0, 0)} + ${h + v} = ${cell(1, 1)}`, false], [`${cell(0, 1)} + ${v - h} = ${cell(1, 0)}`, false]]);
            return C(`수 배열표에서 ${down ? '↓' : '→'} 방향의 규칙을 식으로 바르게 나타낸 것은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
              figure: tableOf(cell, 3, 4), explain: `${down ? '↓' : '→'} 방향으로 이웃한 두 수는 ${down ? `${cell(0, 0)}, ${cell(1, 0)}` : `${cell(0, 0)}, ${cell(0, 1)}`}이다. ${down ? v : h}씩 커지는 규칙을 식으로 나타낸다.`, facts: truthOf(rows, true)
            });
          }),
          T('tb-say', '수 배열표에 대한 설명', '②2 ①11 ③2 심5', (d) => {
            const [h, v] = d.pick(HV), cell = cellOf(startOf(d), h, v);
            const wrong = d.pick([[`↘ 방향으로 ${v}씩 커진다.`, `↘ 방향으로는 ${h + v}씩 커진다.`], [`↗ 방향으로 ${v + h}씩 작아진다.`, `↗ 방향으로는 ${v - h}씩 작아진다.`]]);
            const rows = d.shuffle([[`→ 방향으로 ${h}씩 커진다.`, true], [`↓ 방향으로 ${v}씩 커진다.`, true], [`← 방향으로 ${h}씩 작아진다.`, true], [wrong[0], false]]);
            return C('수 배열표에 대한 설명으로 옳지 않은 것은?', rows.map((row) => row[0]), rows.findIndex((row) => !row[1]), { figure: tableOf(cell, 4, 4), explain: wrong[1], facts: truthOf(rows, false) });
          }),
          T('tb-which', '규칙에 맞는 표 고르기', '②6', (d) => {
            // 틀린 표: → 방향이나 ↓ 방향으로 그 수만큼 커지는 표(방향을 잘못 본 것)
            const h = d.pick([1, 2, 3]), v = d.pick([10, 20]), target = h + v, names = ['가', '나', '다'];
            const specs = d.shuffle([[h, v, true], [target, v, false], [h, target, false]]), cells = specs.map(([x, y]) => cellOf(d.int(11, 25), x, y));
            return C(`↘ 방향으로 ${target}씩 커지는 수 배열표는?`, names, specs.findIndex((spec) => spec[2]), {
              figure: G.tiles(cells.map((cell, i) => [names[i], tableOf(cell, 3, 3)])), explain: `↘ 방향으로 이웃한 두 수의 차를 구한다. ${cells.map((cell, i) => `${names[i]}: ${cell(1, 1)} - ${cell(0, 0)} = ${cell(1, 1) - cell(0, 0)}`).join(', ')}`,
              facts: { choose: { exprs: cells.map((cell) => `${cell(1, 1)}-${cell(0, 0)}`), rule: 'equals', target } }
            });
          }),
          T('tb-mul-rule', '곱셈·나눗셈 규칙의 표', '①5 ②10 ③7 심12', (d) => {
            const [p, q] = d.pick([[2, 3], [3, 2], [2, 5], [2, 2], [3, 3]]), s = d.pick([4, 5, 7]), cell = (r, c) => (s * q * q * Math.pow(p, c)) / Math.pow(q, r);
            return M('수 배열표에서 규칙을 찾았다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: p }, { label: LABELS[1], answer: q }], {
              figure: tableOf(cell, 3, 4) + lines([`→ 방향으로 ${box(LABELS[0])}씩 곱한다.`, `↓ 방향으로 ${box(LABELS[1])}씩 나눈다.`]),
              explain: `${cell(0, 0)} × ${p} = ${cell(0, 1)}이므로 → 방향으로 ${p}씩 곱하고, ${cell(0, 0)} ÷ ${cell(1, 0)} = ${q}이므로 ↓ 방향으로 ${q}씩 나눈다.`,
              facts: { calc: [[`${cell(0, 1)}/${cell(0, 0)}`, 0], [`${cell(0, 0)}/${cell(1, 0)}`, 1]] }
            });
          }),
          T('tb-mul-cell', '곱셈 규칙 표의 빈칸', '①6 ②10 심12', (d) => {
            const [p, q] = d.pick([[2, 3], [3, 2], [2, 5], [5, 2], [2, 2]]), s = d.pick([5, 7]), cell = (r, c) => s * Math.pow(p, c) * Math.pow(q, r), r = d.int(1, 2), c = d.int(1, 3);
            return N('수 배열표에서 빈칸에 알맞은 수는?', cell(r, c), { figure: tableOf(cell, 3, 4, { [r + ',' + c]: box() }), explain: `→ 방향으로 ${p}씩 곱한다. ${cell(r, c - 1)} × ${p} = ${cell(r, c)}`, facts: { calc: [[`${cell(r, c - 1)}*(${cell(0, 1)}/${cell(0, 0)})`, 0]] } });
          }),
          T('tb-make', '규칙에 따라 표 만들기', '①7 ②10 심9', (d) => {
            const [p, q, top] = d.pick([[2, 2, [120, 240, 480]], [3, 2, [40, 120, 360]], [2, 5, [100, 200, 400]], [3, 5, [50, 150, 450]]]), c = d.int(0, 2), cell = (r, j) => top[j] / Math.pow(q, r), marks = {};
            for (let i = 1; i < 3; i += 1) for (let j = 0; j < 3; j += 1) marks[i + ',' + j] = '';
            marks['2,' + c] = box(LABELS[0]);
            return N(`→ 방향으로 ${p}씩 곱하고, ↓ 방향으로 ${q}씩 나누는 규칙으로 수 배열표를 만들고 있다. ㉠에 알맞은 수는?`, cell(2, c), {
              figure: tableOf(cell, 3, 3, marks), explain: `${top[c]}에서 ↓ 방향으로 두 칸 가므로 ${josa(q, '으로/로')} 두 번 나눈다. ${top[c]} ÷ ${q} = ${cell(1, c)}, ${cell(1, c)} ÷ ${q} = ${cell(2, c)}`, facts: { calc: [[`${top[c]}/${q}/${q}`, 0]] }
            });
          }),
          T('tb-mul-say', '곱셈 규칙의 표를 잘못 말한 것', '③7 심12', (d) => {
            // 틀린 보기: 첫 두 칸의 차만 보고 「몇씩 커진다」고 한 것
            const [p, q] = d.pick([[2, 3], [3, 2], [2, 5]]), s = d.pick([5, 7]), cell = (r, c) => s * Math.pow(p, c) * Math.pow(q, r), gap = cell(0, 1) - cell(0, 0);
            const rows = d.shuffle([[`→ 방향으로 ${p}씩 곱한다.`, true], [`↓ 방향으로 ${q}씩 곱한다.`, true], [`↘ 방향으로 ${p * q}씩 곱한다.`, true], [`→ 방향으로 ${gap}씩 커진다.`, false]]);
            return C('수 배열표의 규칙을 잘못 말한 것은?', rows.map((row) => row[0]), rows.findIndex((row) => !row[1]), {
              figure: tableOf(cell, 3, 4), explain: `→ 방향으로 놓인 ${cell(0, 0)}, ${cell(0, 1)}, ${cell(0, 2)}에서 이웃한 두 수의 차는 ${gap}, ${cell(0, 2) - cell(0, 1)}이어서 같지 않다. ${p}씩 곱한 수가 오른쪽에 있다.`, facts: truthOf(rows, false)
            });
          }),
          T('tb-seat', '좌석 번호의 규칙', '①10 ③11 심7', (d) => {
            // 틀린 보기: 글자와 수의 규칙을 뒤바꾼 것, 한 칸 더 센 것, 윗줄의 글자를 그대로 쓴 것
            const first = d.int(3, 9), L = ['A', 'B', 'C', 'D'], [r, c] = d.pick([[1, 2], [1, 3], [2, 1], [2, 3], [3, 1], [3, 2]]), cell = (i, j) => L[i] + (first + j), marks = {};
            for (let i = 1; i < 4; i += 1) for (let j = 1; j < 4; j += 1) marks[i + ',' + j] = '';
            marks[r + ',' + c] = box(LABELS[0]);
            const rows = d.shuffle([[cell(r, c), true], [cell(c, r), false], [L[r] + (first + c + 1), false], [cell(r - 1, c), false]]);
            return C('공연장 좌석 번호의 일부이다. 규칙에 따라 ㉠에 알맞은 번호는?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
              figure: tableOf(cell, 4, 4, marks), explain: `→ 방향으로 수가 1씩 커지고, ↓ 방향으로 알파벳이 차례로 바뀐다. ㉠은 ${L[r]}로 시작하는 줄의 ${ORD[c]} 칸이므로 ${cell(r, c)}이다.`, facts: truthOf(rows, true)
            });
          }),
          T('tb-cal', '달력의 방향별 규칙', '②16', (d) => {
            // 틀린 보기: ↙ 방향도 ↘ 방향처럼 8씩 커진다고 여긴 것(실제로는 7 - 1 = 6)
            const rows = d.shuffle([['→ 방향으로 1씩 커진다.', true], ['↓ 방향으로 7씩 커진다.', true], ['↘ 방향으로 8씩 커진다.', true], ['↙ 방향으로 8씩 커진다.', false]]);
            return C('달력에서 찾은 규칙으로 옳지 않은 것은?', rows.map((row) => row[0]), rows.findIndex((row) => !row[1]), {
              figure: calendar(d.int(0, 6), d.pick([30, 31])), explain: '↙ 방향으로 한 칸 가면 아래로 한 칸(7 커짐), 왼쪽으로 한 칸(1 작아짐) 간 것이므로 6씩 커진다.', facts: truthOf(rows, false)
            });
          }),
          T('tb-bricks', '아래 두 수의 합을 위에 쓰는 배열', '③9 심15', (d) => {
            const a = d.int(11, 19) * 10 + 5, s = d.pick([10, 20, 30]), bottom = [a, a + s, a + 2 * s], mid = [bottom[0] + bottom[1], bottom[1] + bottom[2]], top = mid[0] + mid[1];
            return N('아래 칸의 이웃한 두 수를 더하여 바로 위 칸에 쓰는 규칙이다. ㉠에 알맞은 수는?', top, {
              figure: bricks([[LABELS[0]], [mid[0], ''], bottom], `쌓은 수 배열: 맨 아래 줄 ${bottom.join(', ')} / 가운데 줄 ${mid[0]}, 빈칸 / 맨 위 ㉠`),
              explain: `가운데 줄의 빈칸은 ${bottom[1]} + ${bottom[2]} = ${mid[1]}이다. ㉠은 ${mid[0]} + ${mid[1]} = ${top}이다.`, facts: { calc: [[`${mid[0]}+${bottom[1]}+${bottom[2]}`, 0]] }
            });
          }),
          T('tb-tri', '삼각형 모양으로 놓인 수', '③10', (d) => {
            const a = d.int(10, 40), h = d.pick([10, 20]), g = d.pick([3, 4, 6, 7]), at = (row, i) => a + row * g + i * h;
            return M('수를 규칙에 따라 삼각형 모양으로 늘어놓았다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: at(2, 1) }, { label: LABELS[1], answer: at(3, 0) }], {
              figure: bricks([[LABELS[1]], [at(2, 0), LABELS[0]], [at(1, 0), at(1, 1), at(1, 2)], [at(0, 0), at(0, 1), at(0, 2), at(0, 3)]], `삼각형 모양 수 배열: 맨 아래 줄 ${range(4).map((i) => at(0, i)).join(', ')} / 그 윗줄 ${range(3).map((i) => at(1, i)).join(', ')} / 그 윗줄 ${at(2, 0)}, ㉠ / 맨 위 ㉡`),
              explain: `→ 방향으로 ${h}씩, ↗ 방향으로 ${g}씩 커진다. ㉠은 ${at(2, 0)} + ${h} = ${at(2, 1)}, ㉡은 ${at(2, 0)} + ${g} = ${at(3, 0)}이다.`,
              facts: { calc: [[`${at(2, 0)}+(${at(0, 1)}-${at(0, 0)})`, 0], [`${at(2, 0)}+(${at(1, 0)}-${at(0, 0)})`, 1]] }
            });
          })
        ]
      },
      {
        id: 'row', title: '한 줄로 놓인 수의 규칙', standard: RULE,
        types: [
          T('row-add', '같은 수만큼 커지는 수', '①12 ②7 ③13 심1', (d) => {
            const step = d.pick([100, 200, 110, 50, 20]), a = d.int(12, 60) * 100 + d.int(1, 9), t = range(5).map((i) => a + i * step);
            return M('규칙에 따라 수를 늘어놓았다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: t[2] }, { label: LABELS[1], answer: t[4] }], {
              figure: seq([t[0], t[1], box(LABELS[0]), t[3], box(LABELS[1])]), explain: `${t[1]} - ${t[0]} = ${step}이므로 ${step}씩 커진다. ㉠은 ${t[2]}, ㉡은 ${t[4]}이다.`, facts: { calc: [[`${t[1]}+${t[1]}-${t[0]}`, 0], [`${t[3]}+(${t[1]}-${t[0]})`, 1]] }
            });
          }),
          T('row-sub', '같은 수만큼 작아지는 수', '①12 ②7 ③13 심1', (d) => {
            const step = d.pick([200, 30, 20, 300, 150]), a = d.int(25, 90) * 100 + d.int(1, 9) * 10, t = range(5).map((i) => a - i * step);
            return N('규칙에 따라 수를 늘어놓았다. ㉠에 알맞은 수는?', t[3], { figure: seq([t[0], t[1], t[2], box(LABELS[0]), t[4]]), explain: `${t[0]} - ${t[1]} = ${step}이므로 ${step}씩 작아진다. ${t[2]}보다 ${step} 작은 수는 ${t[3]}이다.`, facts: { calc: [[`${t[2]}-(${t[0]}-${t[1]})`, 0]] } });
          }),
          T('row-mixed', '두 자리 숫자가 함께 바뀌는 수', '①12 ③13 심1', (d) => {
            const step = d.pick([1001, 1010, 101, 102, 110]), a = step > 1000 ? 1000 + d.int(2, 4) : d.int(1, 4) * 100 + d.int(1, 5), t = range(5).map((i) => a + i * step);
            return M('규칙에 따라 수를 늘어놓았다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: t[1] }, { label: LABELS[1], answer: t[4] }], {
              figure: seq([t[0], box(LABELS[0]), t[2], t[3], box(LABELS[1])]), explain: `${t[3]} - ${t[2]} = ${step}이므로 ${step}씩 커진다. ㉠은 ${t[0]} + ${step} = ${t[1]}, ㉡은 ${t[3]} + ${step} = ${t[4]}이다.`, facts: { calc: [[`${t[0]}+${t[3]}-${t[2]}`, 0], [`${t[3]}+${t[3]}-${t[2]}`, 1]] }
            });
          }),
          T('row-times', '몇 배씩 커지는 수', '①13 ②8 ③14 심10', (d) => {
            const [p, s] = d.pick([[2, 3], [2, 7], [2, 9], [3, 1], [3, 5], [3, 7], [4, 2], [4, 5], [5, 3]]), t = range(5).map((i) => s * Math.pow(p, i));
            return M('규칙에 따라 수를 늘어놓았다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: t[3] }, { label: LABELS[1], answer: t[4] }], {
              figure: seq([t[0], t[1], t[2], box(LABELS[0]), box(LABELS[1])]), explain: `${t[1]} ÷ ${t[0]} = ${p}, ${t[2]} ÷ ${t[1]} = ${p}이므로 ${p}씩 곱하는 규칙이다. ㉠은 ${t[2]} × ${p} = ${t[3]}, ㉡은 ${t[3]} × ${p} = ${t[4]}이다.`,
              facts: { calc: [[`${t[2]}*(${t[1]}/${t[0]})`, 0], [`${t[2]}*(${t[1]}/${t[0]})*(${t[1]}/${t[0]})`, 1]] }
            });
          }),
          T('row-div', '같은 수로 나눈 몫이 놓이는 수', '①13 ②8 심10', (d) => {
            const [q, last] = d.pick([[2, 9], [2, 11], [2, 13], [3, 2], [3, 5], [4, 3], [5, 3]]), t = range(5).map((i) => last * Math.pow(q, 4 - i));
            return N('규칙에 따라 수를 늘어놓았다. ㉠에 알맞은 수는?', t[2], { figure: seq([t[0], t[1], box(LABELS[0]), t[3], t[4]]), explain: `${t[3]} ÷ ${t[4]} = ${q}이고 ${t[1]} × ${q} = ${t[0]}이므로 ${josa(q, '으로/로')} 나눈 몫이 오른쪽에 있다. ${t[1]} ÷ ${q} = ${t[2]}`, facts: { calc: [[`${t[1]}/(${t[0]}/${t[1]})`, 0]] } });
          }),
          T('row-say', '수의 배열의 규칙 고르기', '②8·15 ③14', (d) => {
            // 틀린 보기: 첫 두 수의 차만 본 것, 둘째·셋째 수의 차만 본 것, 곱하는 수를 더하는 수로 여긴 것
            const [p, s] = d.pick([[2, 3], [2, 7], [2, 9], [3, 5], [3, 7], [4, 3]]), t = range(5).map((i) => s * Math.pow(p, i));
            const rows = d.shuffle([[`${s}부터 시작하여 ${p}씩 곱한 수가 오른쪽에 있다.`, true], [`${s}부터 시작하여 ${t[1] - t[0]}씩 커진다.`, false], [`${s}부터 시작하여 ${t[2] - t[1]}씩 커진다.`, false], [`${s}부터 시작하여 ${p}씩 커진다.`, false]]);
            return C('수의 배열에서 규칙을 바르게 말한 것은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), { figure: seq(t), explain: `이웃한 두 수의 차는 ${t[1] - t[0]}, ${t[2] - t[1]}, ${josa(t[3] - t[2], '으로/로')} 같지 않다. 앞의 수에 ${josa(p, '을/를')} 곱하면 뒤의 수가 된다.`, facts: truthOf(rows, true) });
          }),
          T('row-grow', '늘어나는 수가 1씩 커지는 수', '①14', (d) => {
            const a = d.int(21, 40), g = d.int(1, 3), t = range(6).reduce((list, i) => list.concat([i ? list[i - 1] + g + i - 1 : a]), []);
            return N('규칙에 따라 수를 늘어놓았다. ㉠에 알맞은 수는?', t[5], { figure: seq(t.slice(0, 5).concat([box(LABELS[0])])), explain: `늘어나는 수가 ${g}, ${g + 1}, ${g + 2}, ${josa(g + 3, '으로/로')} 1씩 커진다. ${t[4]}보다 ${g + 4} 큰 수는 ${t[5]}이다.`, facts: { calc: [[`${t[4]}+(${t[4]}-${t[3]})+1`, 0]], unseen: [1] } });
          }),
          T('row-digits', '숫자와 자리 수가 함께 늘어나는 수', '①15', (d) => {
            const k = d.int(2, 5), t = range(5).map((i) => rep(k + i, i + 1));
            return N('규칙에 따라 수를 늘어놓았다. ㉠에 알맞은 수는?', t[4], { figure: seq(t.slice(0, 4).concat([box(LABELS[0])])), explain: `숫자가 1씩 커지고 자리 수도 한 자리씩 늘어난다. 다음 수는 숫자 ${josa(k + 4, '을/를')} 5번 쓴 ${t[4]}이다.`, facts: { calc: [[`${k + 4}*11111`, 0]], unseen: [k + 4, 11111] } });
          }),
          T('row-expr', '수의 배열의 규칙에 맞지 않는 식', '②13 심13', (d) => {
            // 틀린 보기(답): 값은 맞지만 다른 자리에서는 맞지 않는 뺄셈식. 한 칸만 보고 규칙을 정하면 고른다.
            const [q, last] = d.pick([[5, 2], [3, 3], [2, 6], [4, 2], [3, 2]]), t = range(5).map((i) => last * Math.pow(q, 4 - i));
            const rows = d.shuffle([[`${t[0]} ÷ ${q} = ${t[1]}`, true], [`${t[1]} ÷ ${q} = ${t[2]}`, true], [`${t[1]} − ${t[1] - t[2]} = ${t[2]}`, false], [`${t[2]} ÷ ${q} = ${t[3]}`, true]]);
            return C('수의 배열에서 규칙을 찾아 식으로 나타냈다. 규칙을 나타낸 식이 아닌 것은?', rows.map((row) => row[0]), rows.findIndex((row) => !row[1]), {
              figure: seq(t), explain: `${josa(q, '으로/로')} 나눈 몫이 오른쪽에 있는 규칙이다. ${t[1] - t[2]}씩 작아지는 규칙이라면 ${t[0]} − ${t[1] - t[2]} = ${t[1]}이어야 하는데 그렇지 않다.`, facts: truthOf(rows, false)
            });
          }),
          T('row-make', '규칙에 따라 수 늘어놓기', '심9', (d) => {
            const a = d.int(11, 40), step = d.int(3, 9), k = d.int(5, 7);
            return N(`${a}부터 시작하여 ${step}씩 커지는 수를 차례로 늘어놓을 때, ${ORD[k - 1]} 수는?`, a + step * (k - 1), { explain: `${range(k).map((i) => a + i * step).join(', ')}이므로 ${ORD[k - 1]} 수는 ${a + step * (k - 1)}이다.`, facts: { calc: [[`${a}+${step}*${k - 1}`, 0]], unseen: [k - 1] } });
          }),
          T('row-match', '규칙에 맞는 수의 배열', '②8 ②6', (d) => {
            // 틀린 보기: 곱하지 않고 더한 것, 시작하는 수와 곱하는 수를 뒤바꾼 것, 첫 칸만 곱하고 그다음은 더한 것
            const [s, p] = d.pick([[2, 3], [3, 2], [4, 3], [5, 2], [2, 4], [3, 4]]);
            const rows = d.shuffle([[range(4).map((i) => s * Math.pow(p, i)), true], [range(4).map((i) => s + p * i), false], [range(4).map((i) => p * Math.pow(s, i)), false], [range(4).map((i) => (i ? s * p + (i - 1) * (s * p - s) : s)), false]]);
            return C(`「${s}부터 시작하여 ${p}씩 곱한 수가 오른쪽에 있다.」 이 규칙에 맞는 수의 배열은?`, rows.map((row) => row[0].join(', ')), rows.findIndex((row) => row[1]), { explain: `${s} × ${p} = ${s * p}, ${s * p} × ${p} = ${s * p * p}, ${s * p * p} × ${p} = ${s * p * p * p}`, facts: truthOf(rows, true) });
          }),
          T('row-same-rule', '같은 규칙으로 늘어놓은 수', '②8 심13', (d) => {
            const [q, a, x] = d.pick([[2, 60, 9], [3, 20, 4], [3, 10, 7], [4, 5, 3], [2, 50, 13]]), first = range(4).map((i) => a * Math.pow(q, 3 - i)), second = range(4).map((i) => x * Math.pow(q, 3 - i));
            return N('가의 규칙과 같은 규칙으로 나에 수를 늘어놓았다. ㉠에 알맞은 수는?', second[1], {
              figure: lines([`가: ${first.join(', ')}`, `나: ${second[0]}, ${box(LABELS[0])}, ${second[2]}, ${second[3]}`]), explain: `가는 ${josa(q, '으로/로')} 나눈 몫이 오른쪽에 있다. ${second[0]} ÷ ${q} = ${second[1]}`, facts: { calc: [[`${second[0]}/(${first[0]}/${first[1]})`, 0]] }
            });
          })
        ]
      },
      {
        id: 'shape', title: '도형의 배열에서 규칙 찾기', standard: RULE,
        types: [
          T('sh-count', '모양의 수를 세어 수로 나타내기', '①16 ②17 ③16', () => {
            const shapes = range(4, 1).map((n) => st(block(n, n)));
            return M('규칙에 따라 바둑돌을 늘어놓았다. 셋째 모양과 넷째 모양의 바둑돌은 각각 몇 개인가?', [{ label: '셋째', answer: 3 * 3, unit: '개' }, { label: '넷째', answer: 4 * 4, unit: '개' }], {
              figure: steps(shapes, ORD, told(shapes, ORD, '바둑돌')), explain: '바둑돌의 수는 차례로 1개, 4개, 9개, 16개이다. 가로와 세로가 한 줄씩 늘어난다.', facts: { calc: [[String(shapes[2].n), 0], [String(shapes[3].n), 1]] }
            });
          }),
          T('sh-step', '몇 개씩 늘어나는가', '①17 ②17 ③16', () => {
            const shapes = range(4, 1).map((n) => sq(ell(n)));
            return N('규칙에 따라 사각형을 늘어놓았다. 사각형은 몇 개씩 늘어나는가?', 2, { unit: '개', figure: steps(shapes, ORD, told(shapes, ORD, '사각형')), explain: '사각형의 수는 차례로 1개, 3개, 5개, 7개이다. 위쪽과 오른쪽으로 1개씩, 모두 2개씩 늘어난다.', facts: { calc: [[`${shapes[1].n}-${shapes[0].n}`, 0]] } });
          }),
          T('sh-dir', '모양이 늘어나는 규칙', '①17·30 ②25·28 ③22 심38', (d) => {
            // 틀린 보기: 한쪽으로만 늘어난다고 본 것, 둘째 모양의 개수(5개)를 늘어나는 수로 여긴 것
            const shapes = range(4, 1).map((n) => sq(plus(n)));
            const rows = d.shuffle([['가운데 1개에서 시작하여 위, 아래, 왼쪽, 오른쪽으로 각각 1개씩 늘어난다.', true], ['가운데 1개에서 시작하여 위와 아래로만 각각 2개씩 늘어난다.', false], ['가운데 1개에서 시작하여 오른쪽으로만 4개씩 늘어난다.', false], ['1개에서 시작하여 5개씩 늘어난다.', false]]);
            return C('규칙에 따라 사각형을 늘어놓았다. 규칙을 바르게 말한 것은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), { figure: steps(shapes, ORD, told(shapes, ORD, '사각형')), explain: '사각형의 수는 1개, 5개, 9개, 13개이다. 네 방향으로 1개씩, 모두 4개씩 늘어난다.', facts: truthOf(rows, true) });
          }),
          T('sh-next', '다섯째 모양의 수', '①20 ②18 ③17 심24', () => {
            const shapes = range(4, 1).map((n) => sq(twoRow(n)));
            return N('규칙에 따라 사각형을 두 줄로 늘어놓았다. 다섯째 모양의 사각형은 몇 개인가?', 11, { unit: '개', figure: steps(shapes, ORD, told(shapes, ORD, '사각형')), explain: '사각형의 수는 3개, 5개, 7개, 9개로 2개씩 늘어난다. 다섯째 모양은 9 + 2 = 11(개)이다.', facts: { calc: [[`${shapes[3].n}+(${shapes[1].n}-${shapes[0].n})`, 0]] } });
          }),
          T('sh-far', '건너뛴 순서의 모양의 수', '③18 ②18 심24', (d) => {
            const shapes = range(4, 1).map((n) => st(tee(n))), k = d.pick([7, 9]);
            return N(`규칙에 따라 바둑돌을 늘어놓았다. ${ORD[k - 1]} 모양의 바둑돌은 몇 개인가?`, 3 * k - 2, { unit: '개', figure: steps(shapes, ORD, told(shapes, ORD, '바둑돌')), explain: `바둑돌의 수는 1개, 4개, 7개, 10개로 3개씩 늘어난다. ${ORD[k - 1]} 모양은 넷째 모양보다 3개씩 ${k - 4}번 늘어난 10 + ${3 * (k - 4)} = ${3 * k - 2}(개)이다.`, facts: { calc: [[`${shapes[3].n}+(${shapes[1].n}-${shapes[0].n})*${k - 4}`, 0]], unseen: [k - 4] } });
          }),
          T('sh-stairs', '늘어나는 수가 1씩 커지는 모양', '①22 ②19 ③19·28 심30', () => {
            const shapes = range(4, 1).map((n) => sq(stairs(n)));
            return N('규칙에 따라 사각형을 계단 모양으로 늘어놓았다. 다섯째 모양의 사각형은 몇 개인가?', 15, { unit: '개', figure: steps(shapes, ORD, told(shapes, ORD, '사각형')), explain: '사각형의 수는 1개, 3개, 6개, 10개로 2개, 3개, 4개씩 늘어난다. 다섯째 모양은 10 + 5 = 15(개)이다.', facts: { calc: [[`${shapes[3].n}+(${shapes[3].n}-${shapes[2].n})+1`, 0]] } });
          }),
          T('sh-rule-pick', '늘어나는 수가 달라지는 규칙', '③21 ①17 ②19', (d) => {
            // 틀린 보기: 첫째에서 둘째로 갈 때만 본 것(2개씩, 3배씩), 둘째에서 셋째로 갈 때만 본 것(3개씩)
            const shapes = range(4, 1).map((n) => st(pyramid(n)));
            const rows = d.shuffle([['바둑돌이 2개씩 늘어난다.', false], ['바둑돌이 3개씩 늘어난다.', false], ['앞 모양보다 2개, 3개, 4개, …씩 늘어난다.', true], ['바둑돌의 수가 앞 모양의 3배씩 된다.', false]]);
            return C('규칙에 따라 바둑돌을 늘어놓았다. 바둑돌이 늘어나는 규칙을 바르게 말한 것은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), { figure: steps(shapes, ORD, told(shapes, ORD, '바둑돌')), explain: '바둑돌의 수는 1개, 3개, 6개, 10개이다. 앞 모양보다 2개, 3개, 4개가 늘어났으므로 늘어나는 수가 1씩 커진다.', facts: truthOf(rows, true) });
          }),
          T('sh-times', '몇 배씩 늘어나는 모양', '①23 ③20 심32', () => {
            const shapes = [1, 2, 4].map((k) => split(k, 4));
            return N('규칙에 따라 정사각형을 작은 정사각형으로 나누었다. 넷째 모양에서 가장 작은 정사각형은 몇 개인가?', 64, { unit: '개', figure: steps(shapes, ORD, '모양의 배열: ' + shapes.map((sh, i) => `${ORD[i]} 가장 작은 정사각형 ${sh.n}개`).join(', ')), explain: '가장 작은 정사각형의 수는 1개, 4개, 16개로 4배씩 된다. 넷째 모양은 16 × 4 = 64(개)이다.', facts: { calc: [[`${shapes[2].n}*(${shapes[1].n}/${shapes[0].n})`, 0]] } });
          }),
          T('sh-add-expr', '규칙을 덧셈식으로 나타내기', '①24 ②21 ③30 심25', (d) => {
            // 틀린 보기: 더하는 횟수를 순서와 같게 쓴 것(넷째이니 4번), 더하는 수가 1씩 커진다고 본 것, 처음 1개를 빼먹은 것
            const s = 2, shapes = range(3, 1).map((n) => st(vee(n))), what = '바둑돌';
            const rows = d.shuffle([[`1 + ${s} + ${s} + ${s}`, true], [`1 + ${s} + ${s} + ${s} + ${s}`, false], [`1 + ${s} + ${s + 1} + ${s + 2}`, false], [`${s} + ${s} + ${s} + ${s}`, false]]);
            return C(`${what}의 수를 덧셈식으로 나타냈다. 같은 규칙으로 넷째 모양의 ${what}의 수를 나타낸 식은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
              figure: steps(shapes, ORD, told(shapes, ORD, what)) + named(['1', `1 + ${s}`, `1 + ${s} + ${s}`], ORD), explain: `1개에서 시작하여 ${s}개씩 늘어난다. 넷째 모양은 ${josa(s, '을/를')} 3번 더한 1 + ${s} + ${s} + ${s}이다.`, facts: truthOf(rows, true)
            });
          }),
          T('sh-sticks', '성냥개비로 만든 모양', '①24 ③17 심24', () => {
            // 정사각형 n개를 한 줄로 이으면 왼쪽 세로 개비 하나에, 정사각형마다 위·아래·오른쪽 개비 셋이 든다.
            const first = 4, step = 3, what = '정사각형', squareRow = (n) => range(n).reduce((all, i) => all.concat([[i, 0, i + 1, 0], [i, 1, i + 1, 1], [i + 1, 0, i + 1, 1]]), [[0, 0, 0, 1]]);
            const shapes = range(3, 1).map((n) => sticks(squareRow(n), n));
            return N(`성냥개비로 ${what}을 한 줄로 이어 만들었다. 다섯째 모양을 만드는 데 필요한 성냥개비는 몇 개인가?`, first + step * 4, {
              unit: '개', figure: steps(shapes, ORD, '모양의 배열: ' + shapes.map((sh, i) => `${ORD[i]} ${what} ${sh.pieces}개 성냥개비 ${sh.n}개`).join(', '), 32) + named([String(first), `${first} + ${step}`, `${first} + ${step} + ${step}`], ORD),
              explain: `${what}이 1개 늘 때마다 성냥개비는 ${step}개씩 늘어난다. 다섯째 모양은 ${first} + ${step} + ${step} + ${step} + ${step} = ${first + step * 4}(개)이다.`, facts: { calc: [[`${first}+${step}+${step}+${step}+${step}`, 0]] }
            });
          }),
          T('sh-odd-expr', '늘어나는 부분을 더해 가는 식', '①22 ②20 ③31 심28', () => {
            const shapes = range(3, 1).map((n) => sq(block(n, n).map(([x, y]) => [x, y, n > 1 && (x === n - 1 || y === 0)])));
            return N('새로 늘어난 사각형을 색칠하고, 사각형의 수를 덧셈식으로 나타냈다. 여섯째 모양의 사각형은 몇 개인가?', 36, {
              unit: '개', figure: steps(shapes, ORD, '모양의 배열: ' + shapes.map((sh, i) => `${ORD[i]} 사각형 ${sh.n}개` + (sh.on ? `(새로 늘어난 ${sh.on}개를 색칠)` : '')).join(', ')) + named(['1', '1 + 3', '1 + 3 + 5'], ORD),
              explain: '늘어나는 수가 3, 5, 7, 9, 11로 2씩 커진다. 여섯째 모양은 1 + 3 + 5 + 7 + 9 + 11 = 36(개)이다.', facts: { calc: [['1+3+5+7+9+11', 0]], unseen: [7, 9, 11] }
            });
          }),
          T('sh-rect', '가로와 세로가 함께 늘어나는 모양', '①21 ②22 ③32', (d) => {
            const e = d.pick([1, 2]), shapes = range(3, 1).map((n) => st(block(n, n + e)));
            return N('바둑돌의 수를 곱셈식으로 나타냈다. 다섯째 모양의 바둑돌은 몇 개인가?', 5 * (5 + e), {
              unit: '개', figure: steps(shapes, ORD, told(shapes, ORD, '바둑돌')) + named(range(3, 1).map((n) => `${n} × ${n + e} = ${n * (n + e)}`), ORD),
              explain: `곱하는 두 수가 1씩 커진다. 넷째 모양은 4 × ${4 + e}, 다섯째 모양은 5 × ${5 + e} = ${5 * (5 + e)}(개)이다.`, facts: { calc: [[`5*${5 + e}`, 0]], unseen: [5, 5 + e] }
            });
          }),
          T('sh-two-expr', '한 모양을 여러 식으로 나타내기', '①25 ③33 심28', (d) => {
            const shapes = range(3, 1).map((n) => sq(ring(n)));
            const rows = d.shuffle([['4 + 4 + 4 + 4 + 4', '4+4+4+4+4'], ['4 × 5', '4*5'], ['16 + 4', '16+4'], ['5 × 5', '5*5']]);
            return C('규칙에 따라 사각형을 늘어놓았다. 다섯째 모양의 사각형의 수를 구하는 식으로 알맞지 않은 것은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1] === '5*5'), {
              figure: steps(shapes, ORD, told(shapes, ORD, '사각형')), explain: '사각형의 수는 4개, 8개, 12개로 4개씩 늘어난다. 다섯째 모양은 4 × 5 = 20(개)이다. 5 × 5 = 25는 20이 아니다.', facts: { choose: { exprs: rows.map((row) => row[1]), rule: 'odd' } }
            });
          }),
          T('sh-nth', '개수를 보고 몇째인지 구하기', '①26 ②22·23', (d) => {
            const shapes = range(4, 1).map((n) => st(block(3, n))), k = d.pick([8, 9, 11, 12]);
            return N(`규칙에 따라 바둑돌을 늘어놓았다. 바둑돌 ${3 * k}개로 만든 모양은 몇 번째 모양인가?`, k, { unit: '번째', figure: steps(shapes, ORD, told(shapes, ORD, '바둑돌')), explain: `바둑돌의 수는 3개, 6개, 9개, 12개로 3개씩 늘어난다. ${3 * k} ÷ 3 = ${k}이므로 ${k}번째 모양이다.`, facts: { calc: [[`${3 * k}/${shapes[0].n}`, 0]] } });
          }),
          T('sh-nth-square', '정사각형 모양에서 몇째인지 구하기', '①26 심29', (d) => {
            const shapes = range(3, 1).map((n) => sq(block(n, n))), k = d.pick([6, 7, 9]);
            return N(`규칙에 따라 사각형을 늘어놓았다. 사각형 ${k * k}개로 만든 모양은 몇 번째 모양인가?`, k, { unit: '번째', figure: steps(shapes, ORD, told(shapes, ORD, '사각형')), explain: `사각형의 수는 1 × 1, 2 × 2, 3 × 3으로 늘어난다. ${k} × ${k} = ${k * k}이므로 ${k}번째 모양이다.`, facts: { count: range(11, 1).map((n) => n * n <= k * k) } });
          }),
          T('sh-two', '두 가지 사각형의 수', '①27 ②24 ③25·34 심33', () => {
            const shapes = range(4, 1).map((n) => sq(block(n + 1, n + 1).map(([x, y]) => [x, y, x === n || y === 0])));
            return M('색칠한 사각형과 색칠하지 않은 사각형을 규칙에 따라 늘어놓았다. 다섯째 모양에서 색칠한 사각형과 색칠하지 않은 사각형은 각각 몇 개인가?', [{ label: '색칠한 사각형', answer: 11, unit: '개' }, { label: '색칠하지 않은 사각형', answer: 25, unit: '개' }], {
              figure: steps(shapes, ORD, '모양의 배열: ' + shapes.map((sh, i) => `${ORD[i]} 색칠한 사각형 ${sh.on}개 색칠하지 않은 사각형 ${sh.n - sh.on}개`).join(', ')),
              explain: '색칠한 사각형은 3개, 5개, 7개, 9개로 2개씩 늘어나므로 다섯째에는 11개이다. 색칠하지 않은 사각형은 1 × 1, 2 × 2, 3 × 3, 4 × 4로 늘어나므로 다섯째에는 5 × 5 = 25(개)이다.',
              facts: { calc: [[`${shapes[3].on}+(${shapes[1].on}-${shapes[0].on})`, 0], ['5*5', 1]], unseen: [5] }
            });
          }),
          T('sh-pick', '다음에 올 모양 고르기', '①18·19 ②26·27 ③23·24 심37', (d) => {
            // 틀린 보기: 개수는 맞지만 한쪽으로만 늘어난 것, 모양은 맞지만 한 단계 더 간 것
            const shapes = range(3, 1).map((n) => sq(ell(n))), names = ['가', '나', '다'];
            const lop = range(5).map((i) => [i, 2]).concat(range(2).map((i) => [0, i]));
            const picks = d.shuffle([[sq(ell(4)), true, '가로 4칸 세로 4칸인 ㄴ자 모양 사각형 7개'], [sq(lop), false, '가로 5칸 세로 3칸인 ㄴ자 모양 사각형 7개'], [sq(ell(5)), false, '가로 5칸 세로 5칸인 ㄴ자 모양 사각형 9개']]);
            return C('규칙에 따라 사각형을 늘어놓았다. 넷째에 알맞은 모양은?', names, picks.findIndex((pick) => pick[1]), {
              figure: steps(shapes, ORD, told(shapes, ORD, '사각형')) + steps(picks.map((pick) => pick[0]), names, '고를 모양: ' + picks.map((pick, i) => names[i] + ' ' + pick[2]).join(', '), 14),
              explain: '위쪽과 오른쪽으로 1개씩 늘어난다. 넷째 모양은 가로 4칸, 세로 4칸인 ㄴ자 모양이고 사각형은 7개이다.', facts: truthOf(picks, true)
            });
          })
        ]
      },
      {
        id: 'addsub', title: '덧셈식·뺄셈식의 배열에서 규칙 찾기', standard: CALC,
        types: [
          T('as-rule', '덧셈식의 규칙', '①31 ②31 ③35', (d) => {
            const a = d.int(12, 48) * 10, b = d.int(11, 29) * 10, s = d.pick([10, 20, 100]);
            return M('덧셈식의 배열에서 규칙을 찾았다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: s }, { label: LABELS[1], answer: s }], {
              figure: eqs(range(4).map((i) => `${a}+${b + i * s}=${a + b + i * s}`)) + lines([`더하는 수가 ${box(LABELS[0])}씩 커지면 합은 ${box(LABELS[1])}씩 커진다.`]),
              explain: `더하는 수가 ${b}, ${b + s}, ${b + 2 * s}, …로 ${s}씩 커지고, 합도 ${a + b}, ${a + b + s}, ${a + b + 2 * s}, …로 ${s}씩 커진다.`, facts: { calc: [[`${b + s}-${b}`, 0], [`${a + b + s}-${a + b}`, 1]] }
            });
          }),
          T('as-rule-sub', '뺄셈식의 규칙', '①31 ②31 심40', (d) => {
            // 틀린 보기: 빼는 수가 커지면 차도 커진다고 여긴 것, 변하지 않는 수(빼지는 수)가 변한다고 한 것
            const a = d.int(60, 95) * 10 + 7, b = d.int(11, 25) * 10 + 3, s = d.pick([10, 20]);
            const rows = d.shuffle([[`빼는 수가 ${s}씩 커지면 차는 ${s}씩 작아진다.`, true], [`빼는 수가 ${s}씩 커지면 차도 ${s}씩 커진다.`, false], [`빼지는 수가 ${s}씩 커지면 차는 ${s}씩 작아진다.`, false], [`빼는 수가 ${s}씩 커져도 차는 변하지 않는다.`, false]]);
            return C('뺄셈식의 배열에서 찾은 규칙으로 옳은 것은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), { figure: eqs(range(4).map((i) => `${a}-${b + i * s}=${a - b - i * s}`)), explain: `빼지는 수는 ${josa(a, '으로/로')} 같고, 빼는 수가 ${s}씩 커지면 차는 ${a - b}, ${a - b - s}, ${a - b - 2 * s}, …로 ${s}씩 작아진다.`, facts: truthOf(rows, true) });
          }),
          T('as-rule-sum', '두 수가 함께 커지는 덧셈식의 규칙', '②31 ③35 심39', (d) => {
            const p = d.pick([100, 200]), q = d.pick([10, 20, 100]), a = d.int(2, 4) * 100 + d.int(11, 88), b = d.int(1, 2) * 100 + d.int(1, 9);
            return N(`덧셈식의 배열에서 더해지는 수가 ${p}씩, 더하는 수가 ${q}씩 커지면 합은 몇씩 커지는가?`, p + q, { figure: eqs(range(3).map((i) => `${a + i * p}+${b + i * q}=${a + b + i * (p + q)}`)), explain: `합은 ${a + b}, ${a + b + p + q}, ${josa(a + b + 2 * (p + q), '으로/로')} ${p} + ${q} = ${p + q}씩 커진다.`, facts: { calc: [[`${a + b + p + q}-${a + b}`, 0]] } });
          }),
          T('as-say', '합이 같은 덧셈식의 규칙', '①42 ②31·47 ③36 심58', (d) => {
            // 틀린 보기: 두 수가 변했으니 합도 변한다고 여긴 것, 두 수가 같은 쪽으로 변했다고 본 것
            const s = d.pick([5, 10, 20]), a = d.int(6, 9) * 10 + 5, b = d.int(2, 3) * 10;
            const rows = d.shuffle([[`더해지는 수가 ${s}씩 작아지고 더하는 수가 ${s}씩 커지면 합은 변하지 않는다.`, true], [`더해지는 수가 ${s}씩 작아지고 더하는 수가 ${s}씩 커지면 합은 ${s}씩 커진다.`, false], [`더해지는 수가 ${s}씩 작아지고 더하는 수가 ${s}씩 커지면 합은 ${2 * s}씩 작아진다.`, false], [`더해지는 수와 더하는 수가 모두 ${s}씩 커지면 합은 변하지 않는다.`, false]]);
            return C('덧셈식의 배열에서 규칙을 바르게 말한 것은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), { figure: eqs(range(4).map((i) => `${a - i * s}+${b + i * s}=${a + b}`)), explain: `한 수가 작아진 만큼 다른 수가 커지면 합은 같다. 합은 모두 ${a + b}이다.`, facts: truthOf(rows, true) });
          }),
          T('as-which', '설명에 맞는 계산식의 배열', '②36', (d) => {
            const a = d.int(85, 98) * 10 + d.int(1, 9), b = d.int(5, 6) * 100 + d.int(11, 79), names = ['가', '나', '다'];
            const picks = d.shuffle([[range(3).map((i) => `${a}-${b - i * 100}=${a - b + i * 100}`), true], [range(3).map((i) => `${a - 200 + i * 100}-${b - 200}=${a - b + i * 100}`), false], [range(3).map((i) => `${a}-${b - 200 + i * 100}=${a - b + 200 - i * 100}`), false]]);
            return C('「같은 수에서 100씩 작아지는 수를 빼면 차는 100씩 커진다.」 이 설명에 맞는 뺄셈식의 배열은?', names, picks.findIndex((pick) => pick[1]), {
              figure: G.tiles(picks.map((pick, i) => [names[i], lines(pick[0].map(fmt))])), explain: `빼지는 수가 ${josa(a, '으로/로')} 같고 빼는 수가 100씩 작아지는 배열을 찾는다. 차는 ${a - b}, ${a - b + 100}, ${josa(a - b + 200, '으로/로')} 100씩 커진다.`, facts: truthOf(picks, true)
            });
          }),
          T('as-blank', '덧셈식 속의 빈 수', '①32 ②32 ③40', (d) => {
            const a = d.int(13, 30), b = d.int(1, 4) * 10, sum = (i) => a + i + b + 10 * i;
            return N('덧셈식의 배열에서 □ 안에 알맞은 수는?', b + 20, { figure: named(range(4).map((i) => (i === 2 ? `${a + i} + ${box()} = ${sum(i)}` : fmt(`${a + i}+${b + 10 * i}=${sum(i)}`)))), explain: `더하는 수가 ${b}, ${b + 10}, …로 10씩 커진다. ${a + 2} + ${b + 20} = ${sum(2)}`, facts: { calc: [[`${sum(2)}-${a + 2}`, 0]] } });
          }),
          T('as-next', '다음에 올 덧셈식', '①33 ②32 ③37 심39', (d) => {
            const p = d.pick([10, 100]), q = d.pick([10, 20]), a = d.int(2, 5) * 100 + d.int(2, 9), b = d.int(1, 3) * 10, A = (i) => a + i * p, Bv = (i) => b + i * q;
            return M('덧셈식의 배열에서 규칙에 따라 다섯째에 올 식을 완성하려고 한다. ㉠, ㉡, ㉢에 알맞은 수는?', [{ label: LABELS[0], answer: A(4) }, { label: LABELS[1], answer: Bv(4) }, { label: LABELS[2], answer: A(4) + Bv(4) }], {
              figure: named(range(4).map((i) => fmt(`${A(i)}+${Bv(i)}=${A(i) + Bv(i)}`)).concat([`${box(LABELS[0])} + ${box(LABELS[1])} = ${box(LABELS[2])}`]), ORD),
              explain: `더해지는 수는 ${p}씩, 더하는 수는 ${q}씩, 합은 ${p + q}씩 커진다. 다섯째 식은 ${A(4)} + ${Bv(4)} = ${A(4) + Bv(4)}이다.`,
              facts: { calc: [[`${A(3)}+${A(3)}-${A(2)}`, 0], [`${Bv(3)}+${Bv(3)}-${Bv(2)}`, 1], [`${A(3) + Bv(3)}+${A(3) + Bv(3)}-${A(2) + Bv(2)}`, 2]] }
            });
          }),
          T('as-next-sub', '건너뛴 순서의 뺄셈식', '②32 ③37·41 심40', (d) => {
            const a = d.int(70, 95) * 10 + 6, b = d.int(11, 25) * 10 + 2, s = d.pick([10, 20, 100]), R = (i) => a - b - i * s;
            return N('뺄셈식의 배열에서 규칙에 따라 다섯째에 올 식을 계산한 값은?', R(4), { figure: eqs(range(3).map((i) => `${a}-${b + i * s}=${R(i)}`)), explain: `빼는 수가 ${s}씩 커지면 차는 ${s}씩 작아진다. 넷째 식의 차는 ${R(3)}, 다섯째 식 ${a} − ${b + 4 * s}의 차는 ${R(4)}이다.`, facts: { calc: [[`${R(2)}-(${R(0)}-${R(1)})*2`, 0]], unseen: [2] } });
          }),
          T('as-same-sum', '합이 같은 덧셈식의 다음 식', '①33·39 ③38 심39', (d) => {
            const s = d.pick([10, 20, 50, 100]), a = d.int(11, 29) * 10 + 5, sum = a + 4 * s + d.int(10, 40) * 10, A = (i) => a + i * s, Bv = (i) => sum - A(i);
            return M('덧셈식의 배열에서 규칙에 따라 다섯째에 올 식을 완성하려고 한다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: A(4) }, { label: LABELS[1], answer: Bv(4) }], {
              figure: named(range(3).map((i) => fmt(`${A(i)}+${Bv(i)}=${sum}`)).concat([`${box(LABELS[0])} + ${box(LABELS[1])} = ${sum}`]), ORD.slice(0, 3).concat(['다섯째'])),
              explain: `더해지는 수는 ${s}씩 커지고 더하는 수는 ${s}씩 작아져서 합이 같다. 넷째 식은 ${A(3)} + ${Bv(3)}, 다섯째 식은 ${A(4)} + ${Bv(4)} = ${sum}이다.`,
              facts: { calc: [[`${A(2)}+(${A(2)}-${A(1)})*2`, 0], [`${Bv(2)}-(${Bv(1)}-${Bv(2)})*2`, 1]], unseen: [2] }
            });
          }),
          T('as-same-diff', '차가 같은 뺄셈식의 다음 식', '③38 심40', (d) => {
            const s = d.pick([100, 110, 11, 111]), b = d.int(1, 2) * 100 + d.int(1, 9), diff = d.int(2, 4) * 100 + d.int(1, 9), A = (i) => b + diff + i * s, Bv = (i) => b + i * s;
            return M('뺄셈식의 배열에서 규칙에 따라 넷째에 올 식을 완성하려고 한다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: A(3) }, { label: LABELS[1], answer: Bv(3) }], {
              figure: named(range(3).map((i) => fmt(`${A(i)}-${Bv(i)}=${diff}`)).concat([`${box(LABELS[0])} − ${box(LABELS[1])} = ${diff}`]), ORD),
              explain: `빼지는 수와 빼는 수가 똑같이 ${s}씩 커져서 차가 같다. 넷째 식은 ${A(3)} − ${Bv(3)} = ${diff}이다.`, facts: { calc: [[`${A(2)}+${A(2)}-${A(1)}`, 0], [`${Bv(2)}+${Bv(2)}-${Bv(1)}`, 1]] }
            });
          }),
          T('as-three', '세 수가 함께 변하는 계산식', '②34 ③42 심42', (d) => {
            const plus = d.bool(), base = d.pick([100, 200]), A = (i) => (plus ? base * i : 1000 - base * i), R = (i) => (plus ? A(i) + 9 * i : A(i) - 9 * i);
            const show = (i, second, third) => (plus ? `${A(i)} + ${second} − ${third} = ${R(i)}` : `${A(i)} − ${second} + ${third} = ${R(i)}`);
            return M('계산식의 배열에서 규칙에 따라 넷째에 올 식을 완성하려고 한다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: 40 }, { label: LABELS[1], answer: 4 }], {
              figure: named(range(3, 1).map((i) => show(i, 10 * i, i)).concat([show(4, box(LABELS[0]), box(LABELS[1]))])), explain: `둘째 수는 10, 20, 30으로 10씩 커지고, 셋째 수는 1, 2, 3으로 1씩 커진다. 넷째 식은 ${show(4, 40, 4)}이다.`,
              facts: { calc: [['30+(30-20)', 0], ['3+(3-2)', 1]] }
            });
          }),
          T('as-shift', '수가 하나씩 밀리는 덧셈식', '①33 ③42 심42', (d) => {
            const a = d.int(21, 40), terms = d.pick([3, 4]), row = (i) => range(terms).map((j) => a + i + j), sum = (i) => row(i).reduce((s, v) => s + v, 0);
            return N('덧셈식의 배열에서 규칙에 따라 다섯째에 올 식을 계산한 값은?', sum(4), { figure: eqs(range(3).map((i) => row(i).join('+') + '=' + sum(i))), explain: `더하는 수가 모두 1씩 커지므로 합은 ${terms}씩 커진다. 다섯째 식은 ${row(4).join(' + ')} = ${sum(4)}이다.`, facts: { calc: [[`${sum(2)}+(${sum(1)}-${sum(0)})*2`, 0]], unseen: [2] } });
          }),
          T('as-odd-sum', '더하는 수가 하나씩 늘어나는 덧셈식', '①35 ②37 ③31', (d) => {
            const odd = d.bool(), at = (j) => (odd ? 2 * j + 1 : 2 * j + 2), row = (i) => range(i + 2).map(at), sum = (i) => row(i).reduce((s, v) => s + v, 0);
            return N('덧셈식의 배열에서 규칙에 따라 넷째에 올 식을 계산한 값은?', sum(3), { figure: eqs(range(3).map((i) => row(i).join('+') + '=' + sum(i))), explain: `더하는 수가 하나씩 늘어난다. 넷째 식은 ${row(3).join(' + ')} = ${sum(3)}이다.`, facts: { calc: [[`${sum(2)}+${at(3)}+2`, 0]], unseen: [2] } });
          }),
          T('as-updown', '커졌다가 작아지는 덧셈식', '①35 심44', (d) => {
            const m = d.int(6, 8), row = (k) => range(k, 1).concat(range(k - 1, 1).reverse());
            return N('덧셈식의 배열에서 규칙을 찾아 다음을 계산하면?', m * m, { figure: eqs(range(3, 2).map((k) => row(k).join('+') + '=' + k * k)) + lines([row(m).join(' + ')]), explain: `가운데 수를 두 번 곱한 값이 합이다. 가운데 수가 ${m}이므로 ${m} × ${m} = ${m * m}이다.`, facts: { calc: [[`${m}*${m}`, 0]] } });
          }),
          T('as-digits-next', '자리 수가 늘어나는 덧셈식·뺄셈식', '①34 ②35 ③39 심43', (d) => {
            // 틀린 보기: 한 단계 더 간 식, 결과만 한 자리 더 쓴 식, 두 수만 한 자리 더 쓴 식
            const f = GROW[d.pick(['mirror', 'nines', 'plusThree', 'minusThree'])], word = wordOf(f.op), sign = S[f.op];
            const rows = d.shuffle([[lineOf(f, 4), true], [lineOf(f, 5), false], [`${f.a(4)} ${sign} ${f.b(4)} = ${valueOf(f, 5)}`, false], [`${f.a(5)} ${sign} ${f.b(5)} = ${valueOf(f, 4)}`, false]]);
            return C(`${word}의 배열에서 규칙에 따라 넷째에 올 식은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[1]), { figure: named(range(3, 1).map((k) => lineOf(f, k)), ORD), explain: `자리 수가 한 자리씩 늘어난다. 넷째 식은 ${lineOf(f, 4)}이다.`, facts: truthOf(rows, true) });
          }),
          T('as-digits-value', '규칙으로 계산 결과 알기', '①39 ②35 ③39 심43', (d) => {
            const [key, k] = d.pick([['mirror', 5], ['nines', 5], ['minusThree', 6], ['sevens', 5]]), f = GROW[key];
            return N(`${wordOf(f.op)}의 배열에서 규칙을 찾아 다음을 계산하면?`, valueOf(f, k), { figure: named(range(3, 1).map((i) => lineOf(f, i)), ORD) + lines([`${f.a(k)} ${S[f.op]} ${f.b(k)}`]), explain: `자리 수가 한 자리씩 늘어나는 규칙이다. ${lineOf(f, k)}`, facts: { calc: [[`${f.a(k)}${f.op}${f.b(k)}`, 0]] } });
          }),
          T('as-digits-nth', '계산 결과로 몇째 식인지 구하기', '①38 심43', (d) => {
            const f = GROW[d.pick(['minusThree', 'minusFour'])], k = d.int(5, 8), target = valueOf(f, k), ks = [5, 6, 7, 8];
            return C(`뺄셈식의 배열에서 계산 결과가 ${target}인 식은 몇째 식인가?`, ks.map((n) => ORD[n - 1]), ks.indexOf(k), { figure: named(range(3, 1).map((i) => lineOf(f, i)), ORD), explain: `첫째 식의 결과는 9, 둘째는 99, 셋째는 999로 9가 순서만큼 놓인다. ${josa(target, '은/는')} 9가 ${k}개이므로 ${ORD[k - 1]} 식이다.`, facts: { truth: ks.map((n) => valueOf(f, n) === target), want: true } });
          }),
          T('as-target', '계산 결과가 정해진 뺄셈식', '①37 ②33 ③41 심41', (d) => {
            const a = d.int(85, 99) * 10, b = d.int(11, 20) * 10 + 5, q = d.pick([10, 20]), n = d.pick([4, 5]), A = (i) => a - 10 * i, Bv = (i) => b + q * i, R = (i) => A(i) - Bv(i);
            return M(`뺄셈식의 배열에서 규칙에 따라 계산 결과가 ${R(n)}인 식을 완성하려고 한다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: A(n) }, { label: LABELS[1], answer: Bv(n) }], {
              figure: named(range(3).map((i) => fmt(`${A(i)}-${Bv(i)}=${R(i)}`)), ORD) + lines([`${box(LABELS[0])} − ${box(LABELS[1])} = ${R(n)}`]),
              explain: `빼지는 수는 10씩 작아지고 빼는 수는 ${q}씩 커져서 차는 ${10 + q}씩 작아진다. ${R(2)}에서 ${10 + q}씩 ${n - 2}번 작아지면 ${R(n)}이므로 ${ORD[n]} 식 ${A(n)} − ${Bv(n)} = ${R(n)}이다.`,
              facts: { calc: [[`${A(2)}-(${A(0)}-${A(1)})*((${R(2)}-${R(n)})/(${R(0)}-${R(1)}))`, 0], [`${Bv(2)}+(${Bv(1)}-${Bv(0)})*((${R(2)}-${R(n)})/(${R(0)}-${R(1)}))`, 1]] }
            });
          }),
          T('as-nth', '주어진 식이 몇째인지 구하기', '①38 심41', (d) => {
            const [top, s] = d.pick([[97, 11], [96, 12], [95, 11], [99, 13]]), k = d.int(6, 7), A = (i) => top - s * i, Bv = (i) => A(i) - s;
            return N(`뺄셈식의 배열에서 규칙에 따라 식을 계속 쓸 때, ${A(k - 1)} − ${Bv(k - 1)} = ${josa(s, '은/는')} 몇 번째 식인가?`, k, { unit: '번째', figure: eqs(range(3).map((i) => `${A(i)}-${Bv(i)}=${s}`)), explain: `빼지는 수가 ${A(0)}, ${A(1)}, ${A(2)}, …로 ${s}씩 작아진다. ${A(0)} − ${A(k - 1)} = ${A(0) - A(k - 1)}이고, ${A(0) - A(k - 1)} ÷ ${s} = ${k - 1}이므로 첫째 식에서 ${k - 1}번 더 간 ${k}번째 식이다.`, facts: { calc: [[`(${A(0)}-${A(k - 1)})/(${A(0)}-${A(1)})+1`, 0]], unseen: [1] } });
          }),
          T('as-talk', '계산식의 배열을 보고 한 말', '①40 ②35 심39', (d) => {
            const a = d.pick([21, 31, 41]), who = d.shuffle(NAMES).slice(0, 3), row = (i) => [a + 2 * i, a + 2 + 2 * i, a + 4 + 2 * i], sum = (i) => 3 * a + 6 + 6 * i;
            const rows = d.shuffle([[`다섯째 식은 ${row(4).join(' + ')} = ${sum(4)}이다.`, true], ['계산 결과는 6씩 커진다.', true], [`계산 결과가 ${sum(6)}인 식은 여덟째 식이다.`, false]]);
            return C('덧셈식의 배열을 보고 잘못 말한 사람은?', who, rows.findIndex((row) => !row[1]), {
              figure: eqs(range(4).map((i) => row(i).join('+') + '=' + sum(i))) + lines(rows.map((row, i) => `${who[i]}: ${row[0]}`)), explain: `계산 결과는 6씩 커지므로 다섯째 ${sum(4)}, 여섯째 ${sum(5)}, 일곱째 ${sum(6)}이다. 계산 결과가 ${sum(6)}인 식은 일곱째 식이다.`, facts: truthOf(rows, false)
            });
          }),
          T('as-parity', '짝수와 홀수의 덧셈식', '①41', (d) => {
            const mixed = d.bool(), a = mixed ? d.pick([4, 8, 12]) : d.pick([3, 5, 7]), row = (i) => [a + 2 * i, a + 2 * i + (mixed ? 1 : 2)];
            const rows = d.shuffle(mixed ? [['짝수와 홀수를 더하면 홀수가 된다.', true], ['짝수와 홀수를 더하면 짝수가 된다.', false], ['더하는 두 수는 모두 짝수이다.', false], ['합은 2씩 커진다.', false]] : [['홀수와 홀수를 더하면 짝수가 된다.', true], ['홀수와 홀수를 더하면 홀수가 된다.', false], ['더하는 두 수는 모두 짝수이다.', false], ['합은 2씩 커진다.', false]]);
            return C('덧셈식의 배열에서 알 수 있는 것은?', rows.map((r) => r[0]), rows.findIndex((r) => r[1]), { figure: eqs(range(4).map((i) => `${row(i)[0]}+${row(i)[1]}=${row(i)[0] + row(i)[1]}`)), explain: mixed ? '더하는 두 수는 짝수와 홀수이고 합은 모두 홀수이다. 합은 4씩 커진다.' : '더하는 두 수는 모두 홀수이고 합은 모두 짝수이다. 합은 4씩 커진다.', facts: truthOf(rows, true) });
          }),
          T('as-convert', '덧셈식의 배열을 뺄셈식의 배열로', '③43 심57', (d) => {
            const a = d.pick([26, 37, 48, 62, 71]), k = d.int(3, 5);
            return N('덧셈식의 배열을 보고 같은 규칙으로 뺄셈식의 배열을 만들었다. ㉠에 알맞은 수는?', a + k * 100, {
              figure: G.tiles([['덧셈식', lines([1, 2, k].map((i) => fmt(`${a}+${i * 100}=${a + i * 100}`)))], ['뺄셈식', lines([fmt(`${a + 100}-${a}=100`), fmt(`${a + 200}-${a}=200`), `${box(LABELS[0])} − ${a} = ${k * 100}`])]]),
              explain: `덧셈식의 합에서 더해지는 수 ${josa(a, '을/를')} 빼면 더하는 수가 된다. ${a} + ${k * 100} = ${a + k * 100}이므로 ${a + k * 100} − ${a} = ${k * 100}이다.`, facts: { calc: [[`${a}+${k * 100}`, 0]] }
            });
          })
        ]
      },
      { id: 'muldiv', title: '곱셈식·나눗셈식의 배열에서 규칙 찾기', standard: CALC, types: [] },
      { id: 'found', title: '수 배열표와 달력에서 계산식 찾기', standard: CALC, types: [] },
      { id: 'equal', title: '등호를 사용한 식', standard: EQUAL, types: [] }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
