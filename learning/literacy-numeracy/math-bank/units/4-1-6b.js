// 4학년 1학기 6단원 규칙 찾기 — 곱셈식·나눗셈식의 배열, 수 배열표·달력의 계산식, 등호를 사용한 식의 기본 문항과 실력 문항.
// 꼴 목록(기본꼴 1~3, 심화꼴 73꼴)을 꼴마다 따져서 실었다. 꼴 번호는 ①n = 기본꼴_1의 n번, ②n, ③n, 심n.
//
// 실력 문항의 잣대: 어려움은 이 단원에서 배운 것을 정확히 아는가에서 나와야 한다. 이 단원에서 아이들이 흔히 잘못 아는 것을 먼저 적고,
// 그 오개념을 가진 아이가 고를 보기를 넣어 문제를 냈다.
//   ① 등호를 「계산한 답을 쓰라는 표시」로 여긴다(27 + 15 = □ + 30 의 □에 42를 쓴다. 등호 오른쪽에는 수 하나만 온다고 여긴다. 식을 이어 쓰며 등호를 잇는다).
//   ② 덧셈 등식의 성질(한 수가 커진 만큼 다른 수가 작아진다)을 뺄셈·곱셈에도 그대로 쓴다. 거꾸로 곱셈의 「2배와 절반」을 덧셈에 쓴다.
//   ③ 규칙을 한 칸만 보고 정한다(10, 20, 40 을 「10씩 커진다」「20씩 커진다」고 한다).
//   ④ 가로 규칙과 세로 규칙을 뒤바꾸어 쓴다.
//   ⑤ 늘어나는 개수와 전체 개수를 혼동하거나, 전체 개수를 「순서 × 늘어나는 수」로 구한다. 순서와 식 속의 수가 하나 어긋나는 것을 놓친다.
//   ⑥ 곱하는 두 수가 모두 2배가 되어도 곱은 2배라고 여긴다.
// 그다음에 두 번 넘게 따져야 하는 문제를 실었다(가로·세로 규칙을 함께 써서 떨어진 칸 구하기, 규칙을 찾아 몇째인지 거꾸로 구하기,
// 계산식의 규칙으로 큰 수의 계산 결과 알기, 두 식을 이어 풀기).
//
// 뺀 것과 까닭
//  - 방정식 꼴: 양쪽에 같은 모르는 수가 있는 식(①67 변형 심63의 24 + △ = △ + △), 저울 여럿을 차례로 풀어 모르는 무게 둘을 구하기(②72)
//  - 경우 따지기가 어려움의 대부분인 것: 수를 골라 등식 완성하기(①69 ②62·71 ③74·76 심70), 연산 기호 하나를 등호로 바꾸기(①70 ②61)
//  - 규칙이 두 겹이거나 맞물린 것: 계산 결과의 각 자리 숫자의 합(①51 심50), 숨은 규칙 곱셈식(심51), 맞물린 두 계산식 배열(심56),
//    한쪽은 2배·한쪽은 1씩 줄어드는 곱셈식(심52 변형)
//  - 서술형·답이 열린 것: 식 만들기(①65 ②59·60 ③75 심69), 규칙적인 계산식 만들기(③61), 틀린 식을 마음대로 고치기(③72 심67), ○를 그려 식 완성하기(③77)
//  - 같은 문제: 조각을 더 달아 수평 맞추기(②55)는 덜어 내고 올리는 저울과, 한 식을 이용해 결과 맞추기(①68)는 양쪽의 셈이 다른 등식과,
//    합이 같은 두 줄(심73)은 세 수의 등식과 수만 다르다. 큰 수의 몫을 미리 아는 꼴(①50 변형 심54 변형)은 큰 수의 곱과 같은 얼개다.
//  - 그림이 필요해 미룬 것: 삼각형 모양 수 배열과 덧셈식(①75) — 뽑은 글에 배열이 없다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { LABELS, box, lines, tagged, josa, N, M, C } = B.kit;
  const RULE = '4수02-01', CALC = '4수02-02', EQUAL = '4수02-03';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});
  const ORD = ['첫째', '둘째', '셋째', '넷째', '다섯째', '여섯째', '일곱째', '여덟째', '아홉째', '열째'];
  const S = { '+': '+', '-': '−', '*': '×', '/': '÷' };
  const SIGNS = ['&gt;', '=', '&lt;'];
  const fmt = (text) => String(text).replace(/[+\-*\/=]/g, (ch) => ' ' + (S[ch] || ch) + ' ');
  const calcOf = (a, op, b) => (op === '+' ? a + b : op === '-' ? a - b : op === '*' ? a * b : a / b);
  const truthOf = (rows, want) => ({ truth: rows.map((row) => row[1]), want });
  const range = (n, from) => Array.from({ length: n }, (_, i) => i + (from || 0));
  const named = (list, names) => lines(list.map((html, i) => '<span class="mb-tag mb-tag-short" style="min-width:3.6em">' + (names || ORD)[i] + '</span>' + html));
  const eqs = (list, names) => named(list.map(fmt), names);
  // 한 줄로 놓인 수. kit 의 수 늘어놓기는 네 자리 수 다섯 개가 휴대폰 너비에서 두 줄로 넘어가므로 사이를 좁혀 쓴다.
  const seq = (list) => '<div class="mb-numbers" style="gap:6px 14px;padding:8px 12px">' + list.map((v) => '<span style="font-size:1.1rem">' + v + '</span>').join('') + '</div>';

  // ── 그림(4-1-6a.js 와 같은 도구) ──────────────────────────────
  const td = (c) => (Array.isArray(c) ? '<td style="background:#fde68a;font-weight:400">' + c[0] + '</td>' : '<td style="background:' + (c === '' ? '#eef1f4' : '#fff') + ';font-weight:400">' + (c === '' ? '&nbsp;' : c) + '</td>');
  const grid = (rows, head) => '<div class="mb-table-wrap"><table class="mb-table">' + (head ? '<thead><tr>' + head.map((c) => '<th>' + c + '</th>').join('') + '</tr></thead>' : '') + '<tbody>' + rows.map((row) => '<tr>' + row.map(td).join('') + '</tr>').join('') + '</tbody></table></div>';
  const tableOf = (cell, rows, cols, marks) => grid(range(rows).map((r) => range(cols).map((c) => (marks && (r + ',' + c) in marks ? marks[r + ',' + c] : cell(r, c)))));
  const cellOf = (a, h, v) => (r, c) => a + c * h + r * v;
  const HV = [[1, 100], [10, 100], [2, 100], [20, 100], [10, 200], [1, 1000], [10, 1000], [100, 1000]];
  const startOf = (d) => d.int(1, 4) * 1000 + d.int(1, 5) * 100 + d.int(1, 5) * 10 + d.int(1, 5);
  const WEEK = ['일', '월', '화', '수', '목', '금', '토'];
  function calendar(first, days) {
    const rows = []; let row = range(first).map(() => '');
    for (let day = 1; day <= days; day += 1) { row.push(day); if (row.length === 7) { rows.push(row); row = []; } }
    if (row.length) { while (row.length < 7) row.push(''); rows.push(row); }
    return grid(rows, WEEK);
  }
  const fx = (v) => Math.round(v * 10) / 10;
  const span = (list, k) => 1 + Math.max.apply(null, list.map((c) => c[k]));
  const sq = (cells) => ({ w: span(cells, 0), h: span(cells, 1), n: cells.length, on: cells.filter((c) => c[2]).length,
    body: (u, ox, oy) => cells.map(([x, y, on]) => '<rect class="mb-poly" style="stroke-width:1.2' + (on ? ';fill:#93c5fd' : '') + '" x="' + fx(ox + x * u) + '" y="' + fx(oy + y * u) + '" width="' + u + '" height="' + u + '"/>').join('') });
  const st = (stones) => ({ w: span(stones, 0), h: span(stones, 1), n: stones.length, on: stones.filter((c) => c[2]).length,
    body: (u, ox, oy) => stones.map(([x, y, on]) => '<circle class="mb-poly" style="stroke-width:1.2;fill:' + (on ? '#374151' : '#fff') + '" cx="' + fx(ox + (x + 0.5) * u) + '" cy="' + fx(oy + (y + 0.5) * u) + '" r="' + fx(u * 0.4) + '"/>').join('') });
  const sticks = (segs, pieces) => ({ w: Math.max.apply(null, segs.map((s) => Math.max(s[0], s[2]))), h: Math.max.apply(null, segs.map((s) => Math.max(s[1], s[3]))), n: segs.length, pieces,
    body: (u, ox, oy) => segs.map(([x1, y1, x2, y2]) => { const k = 0.13, dx = x2 - x1, dy = y2 - y1; return '<line class="mb-line" style="stroke:#b45309;stroke-width:2.6" x1="' + fx(ox + (x1 + dx * k) * u) + '" y1="' + fx(oy + (y1 + dy * k) * u) + '" x2="' + fx(ox + (x2 - dx * k) * u) + '" y2="' + fx(oy + (y2 - dy * k) * u) + '"/>'; }).join('') });
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
  const ell = (n) => range(n).map((i) => [i, n - 1]).concat(range(n - 1).map((i) => [0, i]));
  const cross = (n) => [[n - 1, n - 1]].concat(range(n - 1, 1).reduce((all, k) => all.concat([[n - 1 - k, n - 1 - k], [n - 1 + k, n - 1 - k], [n - 1 - k, n - 1 + k], [n - 1 + k, n - 1 + k]]), []));   // X자: 4n-3
  const block = (rows, cols) => range(rows).reduce((all, r) => all.concat(range(cols).map((c) => [c, r])), []);
  const stairs = (n) => range(n).reduce((all, r) => all.concat(range(r + 1).map((c) => [c, r])), []);
  // 정삼각형 n개를 한 줄로 이으면 왼쪽 빗변 개비 하나에, 정삼각형마다 개비 둘이 든다(위아래가 번갈아 뒤집힌다).
  const triRow = (n) => range(n).reduce((all, i) => { const x = i / 2, top = i % 2 ? 0 : 0.87, tip = i % 2 ? 0.87 : 0; return all.concat([[x, top, x + 1, top], [x + 1, top, x + 0.5, tip]]); }, [[0, 0.87, 0.5, 0]]);
  // 접시저울: 접시마다 수가 적힌 주머니를 올린다(모르는 수는 □).
  function scale(left, right) {
    const beam = 66, pan = (cx, list) => '<rect class="mb-poly" style="stroke-width:1.2;fill:#e2e8f0" x="' + (cx - 48) + '" y="' + (beam - 8) + '" width="96" height="8" rx="2"/>'
      + list.map((v, i) => { const x = cx + (i - (list.length - 1) / 2) * 44 - 19; return '<rect class="mb-poly" style="stroke-width:1.2" x="' + x + '" y="' + (beam - 40) + '" width="38" height="32" rx="7"/>' + (v === '□' ? '<rect style="fill:#fff;stroke:#1f2933;stroke-width:1.6" x="' + (x + 11) + '" y="' + (beam - 32) + '" width="16" height="16" rx="2"/>' : '<text class="mb-label" style="font-size:14px" x="' + (x + 19) + '" y="' + (beam - 23) + '" text-anchor="middle" dominant-baseline="central">' + v + '</text>'); }).join('');
    return '<svg class="mb-geo" viewBox="0 0 264 104" width="264" role="img" aria-label="수평을 이룬 저울: 왼쪽 접시 ' + left.join(', ') + ' / 오른쪽 접시 ' + right.join(', ') + '">'
      + '<path class="mb-line" style="stroke-width:2.4;fill:none" d="M22 ' + beam + 'H242"/><path class="mb-poly" style="stroke-width:1.4" d="M132 ' + beam + 'L116 98H148Z"/>' + pan(70, left) + pan(194, right) + '</svg>';
  }

  // ── 자리 수가 늘어나는 곱셈식·나눗셈식 ─────────────────────────
  const rep = (digit, k) => Number(String(digit).repeat(k));
  const GROW = {
    fives: { a: () => 6, op: '*', b: (k) => rep(5, k) },                                      // 6×5=30, 6×55=330, 6×555=3330
    sixteen: { a: (k) => Number('1'.repeat(k - 1) + '16'), op: '*', b: () => 4 },             // 16×4=64, 116×4=464, 1116×4=4464
    sixtySeven: { a: (k) => Number('6'.repeat(k - 1) + '67'), op: '*', b: () => 3 },          // 67×3=201, 667×3=2001, 6667×3=20001
    nines: { a: (k) => rep(9, k), op: '*', b: () => 7 },                                      // 9×7=63, 99×7=693, 999×7=6993
    zeros: { a: () => 3, op: '*', b: (k) => Math.pow(10, k + 1) + 1 },                        // 3×101=303, 3×1001=3003
    ones: { a: () => 5, op: '*', b: (k) => rep(1, k) },                                       // 5×1=5, 5×11=55, 5×111=555
    middle: { a: (k) => Number('3' + '0'.repeat(k - 1) + '2'), op: '*', b: () => 3 },         // 32×3=96, 302×3=906, 3002×3=9006
    fours: { a: (k) => Number('4' + '8'.repeat(k) + '4'), op: '/', b: () => 4 },              // 484÷4=121, 4884÷4=1221
    sixes: { a: (k) => Number('6' + '0'.repeat(k - 1) + '18'), op: '/', b: () => 6 },         // 618÷6=103, 6018÷6=1003
    threes: { a: (k) => Number('3'.repeat(k - 1) + '57'), op: '/', b: () => 3 },              // 57÷3=19, 357÷3=119, 3357÷3=1119
    eighths: { a: (k) => Number('7' + '9'.repeat(k - 1) + '2'), op: '/', b: () => 8 },        // 72÷8=9, 792÷8=99, 7992÷8=999
    pairs: { a: (k) => rep(3, k), op: '*', b: (k) => rep(3, k) + 1 }                          // 3×4=12, 33×34=1122, 333×334=111222
  };
  const valueOf = (f, k) => calcOf(f.a(k), f.op, f.b(k));
  const lineOf = (f, k) => fmt(f.a(k) + f.op + f.b(k) + '=' + valueOf(f, k));

  B.addTypes('4-1-6', 'muldiv', [
    T('md-rule', '곱셈식의 규칙', '①43 ②38 ③45', (d) => {
      const u = d.pick([102, 120, 201, 210, 31]), m = d.int(2, 4);
      return M('곱셈식의 배열에서 규칙을 찾았다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: u }, { label: LABELS[1], answer: u * m }], {
        figure: eqs(range(4, 1).map((i) => `${u * i}*${m}=${u * i * m}`)) + lines([`곱해지는 수가 ${box(LABELS[0])}씩 커지면 곱은 ${box(LABELS[1])}씩 커진다.`]),
        explain: `곱해지는 수는 ${u}, ${2 * u}, ${3 * u}, …로 ${u}씩 커지고, 곱은 ${u * m}, ${2 * u * m}, ${3 * u * m}, …로 ${u * m}씩 커진다.`, facts: { calc: [[`${2 * u}-${u}`, 0], [`${2 * u * m}-${u * m}`, 1]] }
      });
    }),
    T('md-div-rule', '나눗셈식의 규칙', '①43 ②38', (d) => {
      const [b, w] = d.pick([[4, 25], [5, 22], [3, 41], [2, 105], [6, 15]]), u = b * w;
      return M('나눗셈식의 배열에서 규칙을 찾았다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: u }, { label: LABELS[1], answer: w }], {
        figure: eqs(range(4, 1).map((i) => `${u * i}/${b}=${w * i}`)) + lines([`나누어지는 수가 ${box(LABELS[0])}씩 커지면 몫은 ${box(LABELS[1])}씩 커진다.`]),
        explain: `나누어지는 수는 ${u}, ${2 * u}, ${3 * u}, …로 ${u}씩 커지고, 몫은 ${w}, ${2 * w}, ${3 * w}, …로 ${w}씩 커진다.`, facts: { calc: [[`${2 * u}-${u}`, 0], [`${2 * w}-${w}`, 1]] }
      });
    }),
    T('md-say', '몫이 같은 나눗셈식의 규칙', '③45·46·48 ①53 ②47 심53·58', (d) => {
      // 틀린 보기: 두 수가 2배가 되면 몫도 2배가 된다고 여긴 것, 나누어지는 수가 커진 만큼 몫이 커진다고 본 것
      const [q, b] = d.pick([[300, 2], [100, 3], [50, 4], [30, 5]]);
      const rows = d.shuffle([['나누어지는 수와 나누는 수가 똑같이 2배, 3배가 되면 몫은 변하지 않는다.', true], ['나누어지는 수와 나누는 수가 똑같이 2배, 3배가 되면 몫도 2배, 3배가 된다.', false], [`나누어지는 수가 ${q * b}씩 커지면 몫도 ${q * b}씩 커진다.`, false], [`나누는 수가 ${b}씩 커지면 몫은 ${b}씩 작아진다.`, false]]);
      return C('나눗셈식의 배열에서 규칙을 바르게 말한 것은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), { figure: eqs(range(4, 1).map((i) => `${q * b * i}/${b * i}=${q}`)), explain: `나누어지는 수와 나누는 수가 함께 2배, 3배, 4배가 되었고 몫은 모두 ${josa(q, '으로/로')} 같다.`, facts: truthOf(rows, true) });
    }),
    T('md-blank', '곱셈식 속의 빈 수', '①44 ②39 ③50', (d) => {
      const a = d.pick([11, 12, 20, 25]), b = d.pick([5, 12, 21]), Bv = (i) => b + 10 * i;
      return N('곱셈식의 배열에서 □ 안에 알맞은 수는?', Bv(2), { figure: named(range(4).map((i) => (i === 2 ? `${a} × ${box()} = ${a * Bv(i)}` : fmt(`${a}*${Bv(i)}=${a * Bv(i)}`)))), explain: `곱하는 수가 ${Bv(0)}, ${Bv(1)}, …로 10씩 커진다. ${a} × ${Bv(2)} = ${a * Bv(2)}`, facts: { calc: [[`${Bv(1)}+(${Bv(1)}-${Bv(0)})`, 0]] } });
    }),
    T('md-same-product', '곱이 같은 곱셈식의 빈 수', '③50', (d) => {
      const [f, a, b] = d.pick([[2, 5, 7], [2, 3, 5], [2, 2, 9], [3, 2, 4], [2, 6, 3], [3, 4, 2]]), A = (i) => a * Math.pow(f, i), Bv = (i) => b * Math.pow(f, 3 - i), p = a * b * f * f * f;
      return N('곱셈식의 배열에서 □ 안에 알맞은 수는?', Bv(3), { figure: named(range(4).map((i) => (i === 3 ? `${A(i)} × ${box()} = ${p}` : fmt(`${A(i)}*${Bv(i)}=${p}`)))), explain: `곱해지는 수가 ${f}배가 되면 곱하는 수는 ${josa(f, '으로/로')} 나눈 수가 되어 곱이 같다. ${Bv(2)} ÷ ${f} = ${Bv(3)}`, facts: { calc: [[`${Bv(2)}/(${A(1)}/${A(0)})`, 0]] } });
    }),
    T('md-next', '다음에 올 곱셈식', '①45 ②39 ③47', (d) => {
      const u = d.pick([102, 120, 201, 31, 21]), m = d.int(2, 5);
      return M('곱셈식의 배열에서 규칙에 따라 다섯째에 올 식을 완성하려고 한다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: 5 * u }, { label: LABELS[1], answer: 5 * u * m }], {
        figure: named(range(4, 1).map((i) => fmt(`${u * i}*${m}=${u * i * m}`)).concat([`${box(LABELS[0])} × ${m} = ${box(LABELS[1])}`])), explain: `곱해지는 수는 ${u}씩, 곱은 ${u * m}씩 커진다. 다섯째 식은 ${5 * u} × ${m} = ${5 * u * m}이다.`,
        facts: { calc: [[`${4 * u}+${4 * u}-${3 * u}`, 0], [`${4 * u * m}+${4 * u * m}-${3 * u * m}`, 1]] }
      });
    }),
    T('md-next-div', '몫이 같은 나눗셈식의 다음 식', '①47 ②39 ③48 심53', (d) => {
      const q = d.pick([20, 5, 30]), b = d.pick([70, 80, 90]), Bv = (i) => b - 10 * i, A = (i) => q * Bv(i);
      return M('나눗셈식의 배열에서 규칙에 따라 다섯째에 올 식을 완성하려고 한다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: A(4) }, { label: LABELS[1], answer: Bv(4) }], {
        figure: named(range(3).map((i) => fmt(`${A(i)}/${Bv(i)}=${q}`)).concat([`${box(LABELS[0])} ÷ ${box(LABELS[1])} = ${q}`]), ORD.slice(0, 3).concat(['다섯째'])),
        explain: `나누어지는 수는 ${A(0) - A(1)}씩, 나누는 수는 10씩 작아지고 몫은 ${josa(q, '으로/로')} 같다. 넷째 식은 ${A(3)} ÷ ${Bv(3)}, 다섯째 식은 ${A(4)} ÷ ${Bv(4)} = ${q}이다.`,
        facts: { calc: [[`${A(2)}-(${A(0)}-${A(1)})*2`, 0], [`${Bv(2)}-(${Bv(0)}-${Bv(1)})*2`, 1]], unseen: [2] }
      });
    }),
    T('md-div-far', '규칙으로 떨어진 식의 몫 알기', '②39 ③47', (d) => {
      const b = d.pick([30, 40, 50]), q = d.int(12, 30), k = d.int(5, 8), x = b * (q + k);
      return N('나눗셈식의 배열에서 규칙을 찾아 □ 안에 알맞은 수를 구하면?', q + k, { figure: eqs(range(3).map((i) => `${b * (q + i)}/${b}=${q + i}`)) + lines([`${x} ÷ ${b} = ${box()}`]), explain: `나누어지는 수가 ${b}씩 커지면 몫은 1씩 커진다. ${josa(x, '은/는')} ${b * (q + 2)}보다 ${b * (k - 2)} 큰 수이므로 몫은 ${q + 2}보다 ${k - 2} 큰 ${q + k}이다.`, facts: { calc: [[`${x}/${b}`, 0]] } });
    }),
    T('md-double', '곱하는 수가 2배씩 되는 곱셈식', '②38 심52', (d) => {
      const a = d.pick([13, 14, 15, 21, 25]), b = d.int(2, 4), Bv = (i) => b * Math.pow(2, i);
      return N('곱셈식의 배열에서 □ 안에 알맞은 수는?', a * Bv(3), { figure: named(range(4).map((i) => (i === 3 ? `${a} × ${Bv(i)} = ${box()}` : fmt(`${a}*${Bv(i)}=${a * Bv(i)}`)))), explain: `곱하는 수가 2배가 되면 곱도 2배가 된다. ${a * Bv(2)} × 2 = ${a * Bv(3)}`, facts: { calc: [[`${a * Bv(2)}*(${a * Bv(1)}/${a * Bv(0)})`, 0]] } });
    }),
    T('md-digits-next', '자리 수가 늘어나는 곱셈식', '①46 ②42 ③49 심47', (d) => {
      // 틀린 보기: 한 단계 더 간 식, 결과만 한 자리 더 쓴 식, 곱하는 수만 한 자리 더 쓴 식
      const f = GROW[d.pick(['fives', 'sixteen', 'sixtySeven', 'nines'])];
      const rows = d.shuffle([[lineOf(f, 4), true], [lineOf(f, 5), false], [`${f.a(4)} × ${f.b(4)} = ${valueOf(f, 5)}`, false], [`${f.a(5)} × ${f.b(5)} = ${valueOf(f, 4)}`, false]]);
      return C('곱셈식의 배열에서 규칙에 따라 넷째에 올 식은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), { figure: named(range(3, 1).map((k) => lineOf(f, k))), explain: `자리 수가 한 자리씩 늘어난다. 넷째 식은 ${lineOf(f, 4)}이다.`, facts: truthOf(rows, true) });
    }),
    T('md-digits-div', '자리 수가 늘어나는 나눗셈식', '①47 ②42 ③49', (d) => {
      const f = GROW[d.pick(['fours', 'sixes', 'threes'])];
      return N('나눗셈식의 배열에서 규칙을 찾아 □ 안에 알맞은 수를 구하면?', valueOf(f, 4), { figure: named(range(3, 1).map((k) => lineOf(f, k)).concat([`${f.a(4)} ÷ ${f.b(4)} = ${box()}`])), explain: `나누어지는 수의 자리 수가 한 자리 늘어나면 몫의 자리 수도 한 자리 늘어난다. ${lineOf(f, 4)}`, facts: { calc: [[`${f.a(4)}/${f.b(4)}`, 0]] } });
    }),
    T('md-digits-value', '규칙으로 큰 수의 곱 알기', '①50 ②42 ③49 심48', (d) => {
      // 틀린 보기: 0(같은 숫자)의 개수를 하나 덜 쓰거나 더 쓴 것
      const [key, n] = d.pick([['zeros', 5], ['zeros', 6], ['ones', 7], ['middle', 5], ['middle', 6]]), f = GROW[key], list = d.shuffle([n - 1, n, n + 1, n + 2].map((k) => valueOf(f, k)));
      return C(`곱셈식의 배열에서 규칙을 찾아 ${f.a(n)} × ${f.b(n)}의 값을 구하면?`, list.map(String), list.indexOf(valueOf(f, n)), { figure: named(range(3, 1).map((k) => lineOf(f, k))), explain: `자리 수가 한 자리씩 늘어나는 규칙이다. ${lineOf(f, n)}`, facts: { pick: { expr: `${f.a(n)}*${f.b(n)}`, options: list } } });
    }),
    T('md-target', '계산 결과가 정해진 곱셈식', '①48 ②40 ③51 심49', (d) => {
      const u = d.pick([102, 201, 121, 131]), m = d.int(2, 4), k = d.int(6, 9), target = u * k * m;
      return N(`곱셈식의 배열에서 규칙에 따라 식을 계속 쓸 때, 계산 결과가 ${target}인 식에서 곱해지는 수는?`, u * k, { figure: eqs(range(3, 1).map((i) => `${u * i}*${m}=${u * i * m}`)), explain: `곱은 ${range(k - 1, 1).map((i) => u * i * m).join(', ')}, ${josa(target, '으로/로')} ${u * m}씩 커진다. ${josa(target, '은/는')} ${k}번째 식의 곱이므로 곱해지는 수는 ${u} × ${k} = ${u * k}이다.`, facts: { calc: [[`${target}/${m}`, 0]] } });
    }),
    T('md-ratio', '몫이 같은 나눗셈식의 빈 수', '①48 ③48·50 심53·54', (d) => {
      const [u, b, q] = d.pick([[202, 2, 101], [125, 5, 25], [108, 4, 27], [112, 8, 14]]), k = d.int(6, 9);
      return N('나눗셈식의 배열에서 규칙을 찾아 □ 안에 알맞은 수를 구하면?', b * k, { figure: eqs(range(3, 1).map((i) => `${u * i}/${b * i}=${q}`)) + lines([`${u * k} ÷ ${box()} = ${q}`]), explain: `나누어지는 수와 나누는 수가 함께 2배, 3배가 되면 몫이 같다. ${josa(u * k, '은/는')} ${u}의 ${k}배이므로 나누는 수도 ${b}의 ${k}배인 ${b * k}이다.`, facts: { calc: [[`${b}*(${u * k}/${u})`, 0]] } });
    }),
    T('md-repeat', '같은 숫자가 되풀이되는 곱의 곱셈식', '②41 ③51 심52', (d) => {
      const [a, m, unit] = d.pick([[101, 11, 1111], [143, 7, 1001]]), k = d.int(5, 9);
      return N('곱셈식의 배열에서 규칙을 찾아 □ 안에 알맞은 수를 구하면?', m * k, { figure: eqs(range(3, 1).map((i) => `${a}*${m * i}=${unit * i}`)) + lines([`${a} × ${box()} = ${unit * k}`]), explain: `곱하는 수가 ${m}의 2배, 3배가 되면 곱도 ${unit}의 2배, 3배가 된다. ${josa(unit * k, '은/는')} ${unit}의 ${k}배이므로 곱하는 수는 ${m} × ${k} = ${m * k}이다.`, facts: { calc: [[`${m}*(${unit * k}/${unit})`, 0]] } });
    }),
    T('md-nth', '주어진 나눗셈식이 몇째인지 구하기', '①49 ③52', (d) => {
      const [q, b] = d.pick([[300, 2], [100, 3], [50, 4], [30, 5], [25, 4]]), k = d.int(6, 9);
      return N(`나눗셈식의 배열에서 규칙에 따라 식을 계속 쓸 때, ${q * b * k} ÷ ${b * k} = ${josa(q, '은/는')} 몇 번째 식인가?`, k, { unit: '번째', figure: eqs(range(3, 1).map((i) => `${q * b * i}/${b * i}=${q}`)), explain: `나누는 수가 ${b}, ${2 * b}, ${3 * b}, …로 ${b}씩 커진다. ${b * k} ÷ ${b} = ${k}이므로 ${k}번째 식이다.`, facts: { calc: [[`${q * b * k}/${q * b}`, 0]] } });
    }),
    T('md-chain-div', '같은 수로 거듭 나누는 식', '①47 ②44 ③54 심46', (d) => {
      const [f, q] = d.pick([[2, 3], [2, 5], [3, 5], [3, 4], [2, 7]]), row = (i) => [q * Math.pow(f, i)].concat(range(i).map(() => f)).join(' ÷ ') + ' = ' + q;
      return N('나눗셈식의 배열에서 □ 안에 알맞은 수는?', q * Math.pow(f, 4), { figure: named(range(3, 1).map(row).concat([[box()].concat(range(4).map(() => f)).join(' ÷ ') + ' = ' + q])), explain: `${josa(f, '으로/로')} 한 번씩 더 나누므로 나누어지는 수는 ${f}배씩 커진다. ${q * Math.pow(f, 3)} × ${f} = ${q * Math.pow(f, 4)}`, facts: { calc: [[`${q * Math.pow(f, 3)}*${f}`, 0]] } });
    }),
    T('md-convert', '곱셈식의 배열을 나눗셈식의 배열로', '①52 ②45 ③55 심57', (d) => {
      const m = d.pick([11, 12, 21, 31]), tile = (label, body) => '<figure class="mb-tile"><figcaption>' + label + '</figcaption>' + body + '</figure>';
      return N('곱셈식의 배열을 보고 같은 규칙으로 나눗셈식의 배열을 만들었다. ㉠에 알맞은 수는?', 30 * m, {
        figure: '<div class="mb-tiles">' + tile('곱셈식', lines([1, 2, 3].map((i) => fmt(`${10 * i}*${m}=${10 * i * m}`)))) + tile('나눗셈식', lines([fmt(`${10 * m}/${m}=10`), fmt(`${20 * m}/${m}=20`), `${box(LABELS[0])} ÷ ${m} = 30`])) + '</div>',
        explain: `곱셈식의 곱을 곱하는 수 ${josa(m, '으로/로')} 나누면 곱해지는 수가 된다. 30 × ${m} = ${30 * m}이므로 ${30 * m} ÷ ${m} = 30이다.`, facts: { calc: [[`30*${m}`, 0]] }
      });
    }),
    T('md-both', '양쪽이 모두 식인 배열', '②46', () => M('계산식의 배열에서 규칙에 따라 다섯째에 올 식을 완성하려고 한다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: 65 }, { label: LABELS[1], answer: 50 }], {
      figure: named(['21 × 10 = 200 + 10', '32 × 10 = 300 + 20', '43 × 10 = 400 + 30', `${box(LABELS[0])} × 10 = 600 + ${box(LABELS[1])}`], ORD.slice(0, 3).concat(['다섯째'])),
      explain: '곱해지는 수는 21, 32, 43으로 11씩 커지고, 더하는 수는 10, 20, 30으로 10씩 커진다. 넷째 식은 54 × 10 = 500 + 40, 다섯째 식은 65 × 10 = 600 + 50이다.', facts: { calc: [['43+(43-32)*2', 0], ['30+(30-20)*2', 1]], unseen: [2] }
    })),
    T('md-transfer', '찾은 규칙을 다른 수에 옮기기', '심55', (d) => {
      const p = d.pick([4, 6]), x = d.pick([2, 3, 7, 8, 9]), k = d.pick([1, 2]), big = Number(x + '0'.repeat(k) + x);
      return N(`나눗셈식의 배열에서 찾은 규칙을 이용하여 ${big} ÷ ${x}의 몫을 구하면?`, big / x, { figure: eqs([`${p}${p}/${p}=11`, `${p}0${p}/${p}=101`, `${p}00${p}/${p}=1001`]), explain: `같은 숫자 사이에 0이 낀 수를 그 숫자로 나누면 1 사이에 0이 같은 개수만큼 낀 수가 된다. ${big} ÷ ${x} = ${big / x}`, facts: { calc: [[`${big}/${x}`, 0]] } });
    })
  ]);

  B.addTypes('4-1-6', 'found', [
    T('fd-cross', '엇갈린 두 수의 합이 같은 식', '②49 ③58 ①73 심20', (d) => {
      const s = d.int(11, 60) * 10 + 3, top = range(5).map((i) => s + 2 * i), bottom = top.map((v) => v + 1);
      return N('수 배열표에서 규칙적인 계산식을 찾았다. □ 안에 알맞은 수는?', top[4], {
        figure: grid([top, bottom]) + lines(range(3).map((i) => fmt(`${top[i]}+${bottom[i + 1]}=${bottom[i]}+${top[i + 1]}`)).concat([`${top[3]} + ${bottom[4]} = ${bottom[3]} + ${box()}`])),
        explain: `↘ 방향으로 놓인 두 수의 합과 ↙ 방향으로 놓인 두 수의 합이 같다. ${top[3]} + ${bottom[4]} = ${bottom[3]} + ${top[4]}`, facts: { calc: [[`${top[3]}+${bottom[4]}-${bottom[3]}`, 0]] }
      });
    }),
    T('fd-cal-wrong', '달력에서 찾은 계산식', '②52 심20', (d) => {
      // 틀린 보기(답): 가로로 이웃한 두 수의 합과 그 아래 두 수의 합이 같다고 한 것(14만큼 다르다)
      const first = d.int(0, 6), days = d.pick([30, 31]), inRow = (x) => (first + x - 1) % 7 <= 5;
      const x = d.until(() => d.int(2, 8), inRow), u = d.until(() => d.int(9, 15), inRow), z = d.int(1, 9), w = z + d.int(2, 9);
      const rows = d.shuffle([[`${x} + ${x + 8} = ${x + 1} + ${x + 7}`, `${x}+${x + 8}`, 2 * x + 8], [`${x + 7} + ${x + 15} = ${x + 8} + ${x + 14}`, `${x + 7}+${x + 15}`, 2 * x + 22], [`${z + 7} − ${z} = ${w + 7} − ${w}`, `${z + 7}-${z}`, 7], [`${u} + ${u + 1} = ${u + 7} + ${u + 8}`, `${u}+${u + 1}`, 2 * u + 15]]);
      return C('달력에서 규칙을 찾아 식으로 나타냈다. 옳지 않은 식은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1] === `${u}+${u + 1}`), {
        figure: calendar(first, days), explain: `아래 줄의 수는 윗줄의 수보다 7씩 크다. ${u} + ${u + 1} = ${2 * u + 1}이고 ${u + 7} + ${u + 8} = ${2 * u + 15}이므로 두 합은 같지 않다.`, facts: { claimed: rows.map((row) => [row[1], row[2]]), claimedWant: false }
      });
    }),
    T('fd-three', '세 수의 합과 가운데 수', '②50 심22', (d) => {
      const s = d.int(11, 60) * 10 + 5, t = range(6).map((i) => s + 2 * i);
      return N('수의 배열에서 규칙적인 계산식을 찾았다. □ 안에 알맞은 수는?', t[4], { figure: seq(t) + lines([`${t[0]} + ${t[1]} + ${t[2]} = ${t[1]} × 3`, `${t[3]} + ${t[4]} + ${t[5]} = ${box()} × 3`]), explain: `이웃한 세 수의 합은 가운데 수의 3배이다. ${t[3]}, ${t[4]}, ${t[5]}의 가운데 수는 ${t[4]}이다.`, facts: { calc: [[`(${t[3]}+${t[4]}+${t[5]})/3`, 0]] } });
    }),
    T('fd-plus', '십자 모양으로 놓인 수의 합', '③57 심19·21', (d) => {
      const cell = cellOf(d.int(11, 40), 2, 10), c = d.int(1, 3), up = cell(0, c), left = cell(1, c - 1), right = cell(1, c + 1), down = cell(2, c);
      return N('수 배열표에서 색칠한 네 수의 합을 곱셈식으로 나타냈다. □ 안에 알맞은 수는?', cell(1, c), {
        figure: tableOf(cell, 3, 5, { ['0,' + c]: [up], ['1,' + (c - 1)]: [left], ['1,' + (c + 1)]: [right], ['2,' + c]: [down] }) + lines([`${up} + ${left} + ${right} + ${down} = ${box()} × 4`]),
        explain: `위아래 두 수의 합 ${up} + ${down}, 양옆 두 수의 합 ${left} + ${josa(right, '은/는')} 각각 가운데 수 ${cell(1, c)}의 2배이다. 네 수의 합은 ${cell(1, c)} × 4이다.`, facts: { calc: [[`(${up}+${left}+${right}+${down})/4`, 0]] }
      });
    }),
    T('fd-rowcol', '가로 세 수의 합과 세로 세 수의 합', '②51', (d) => {
      const cell = (r, c) => 6 * r + c + 1, v1 = cell(1, d.int(1, 4)), v2 = cell(d.int(2, 3), d.int(1, 4));
      return N('1부터 30까지의 수를 차례로 적은 표에서 규칙적인 계산식을 찾았다. □ 안에 알맞은 수는?', v2 + 6, {
        figure: tableOf(cell, 5, 6) + lines([`${v1 - 1} + ${v1} + ${v1 + 1} = ${v1 - 6} + ${v1} + ${v1 + 6}`, `${v2 - 1} + ${v2} + ${v2 + 1} = ${v2 - 6} + ${v2} + ${box()}`]),
        explain: `가로로 이웃한 세 수의 합과 세로로 이웃한 세 수의 합이 같다. ${v2}의 아래에 있는 수는 ${v2 + 6}이다.`, facts: { calc: [[`${v2 - 1}+${v2}+${v2 + 1}-${v2 - 6}-${v2}`, 0]] }
      });
    }),
    T('fd-cal-diff', '달력에서 찾은 뺄셈식', '①72 ③56', (d) => {
      const x = d.int(3, 15), g = d.pick([2, 4]), row = (i) => [x + g + i, x + i, x + g + 7 + i, x + 7 + i];
      return N('달력에서 규칙적인 계산식을 찾았다. □ 안에 알맞은 수는?', x + 9, {
        figure: calendar(d.int(0, 6), d.pick([30, 31])) + lines(range(2).map((i) => `${row(i)[0]} − ${row(i)[1]} = ${row(i)[2]} − ${row(i)[3]}`).concat([`${row(2)[0]} − ${row(2)[1]} = ${row(2)[2]} − ${box()}`])),
        explain: `두 수의 차가 모두 ${g}이다. ${row(2)[0]} − ${row(2)[1]} = ${g}이므로 ${row(2)[2]} − ${x + 9} = ${g}이다.`, facts: { calc: [[`${row(2)[2]}-(${row(2)[0]}-${row(2)[1]})`, 0]] }
      });
    }),
    T('fd-one', '이웃한 수로 한 수 나타내기', '③59', (d) => {
      const cell = (r, c) => 6 * r + c + 1, r = d.int(2, 3), c = d.int(1, 4), v = cell(r, c);
      return N(`1부터 30까지의 수를 차례로 적은 표에서 색칠한 수 ${josa(v, '을/를')} 이웃한 수로 나타냈다. □ 안에 알맞은 수는?`, 7, {
        figure: tableOf(cell, 5, 6, { [r + ',' + c]: [v] }) + lines([`${v - 1} + 1 = ${v}`, `${v - 6} + 6 = ${v}`, `${v + 6} − 6 = ${v}`, `${v - 7} + ${box()} = ${v}`]),
        explain: `${josa(v - 7, '은/는')} ${v}의 ↖ 방향에 있는 수이다. ↘ 방향으로 7씩 커지므로 ${v - 7} + 7 = ${v}이다.`, facts: { calc: [[`${v}-${v - 7}`, 0]] }
      });
    }),
    T('fd-next', '양쪽이 식인 배열의 다음 식', '①73 심23', (d) => {
      const a = d.int(3, 9), e = d.pick([5, 7, 10]), row = (i) => [a + i, a + i + e, a + i + 2 * e, a + i + 2, a + i + e, a + i + 2 * e - 2];
      const show = (list) => `${list[0]} + ${list[1]} + ${list[2]} = ${list[3]} + ${list[4]} + ${list[5]}`, last = row(3);
      return N('계산식의 배열에서 규칙에 따라 넷째에 올 식을 완성하려고 한다. □ 안에 알맞은 수는?', last[5], {
        figure: named(range(3).map((i) => show(row(i))).concat([show(last.slice(0, 5).concat([box()]))])), explain: `여섯 수가 모두 1씩 커진다. 넷째 식은 ${show(last)}이다.`, facts: { calc: [[`${last[0]}+${last[1]}+${last[2]}-${last[3]}-${last[4]}`, 0]] }
      });
    }),
    T('fd-weekday', '달력의 같은 요일', '③60', (d) => {
      const day = d.pick(WEEK), first = d.int(1, 7), n = d.pick([3, 4]);
      return N(`어느 달의 첫째 ${day}요일은 ${first}일이다. 이 달의 ${ORD[n - 1]} ${day}요일은 며칠인가?`, first + 7 * (n - 1), { unit: '일', explain: `같은 요일은 7일마다 돌아온다. ${range(n).map((i) => first + 7 * i).join(', ')}이므로 ${ORD[n - 1]} ${day}요일은 ${first + 7 * (n - 1)}일이다.`, facts: { calc: [[`${first}+7*${n - 1}`, 0]], unseen: [7, n - 1] } });
    })
  ]);

  B.addTypes('4-1-6', 'equal', [
    T('eq-meaning', '등호의 뜻', '③62', (d) => {
      // 틀린 보기: 등호를 「답을 쓰라는 표시」로 여긴 것, 오른쪽에는 수 하나만 온다고 여긴 것
      const rows = d.shuffle([['등호의 왼쪽과 오른쪽의 크기가 같음을 나타낸다.', true], ['왼쪽 식을 계산한 답을 오른쪽에 쓰라는 표시이다.', false], ['등호의 오른쪽에는 수 하나만 쓸 수 있다.', false], ['왼쪽이 오른쪽보다 크다는 것을 나타낸다.', false]]);
      return C('등호(=)에 대한 설명으로 옳은 것은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), { explain: '등호는 양쪽의 크기가 같음을 나타낸다. 20 + 5 = 5 × 5처럼 오른쪽에도 식을 쓸 수 있다.', facts: truthOf(rows, true) });
    }),
    T('eq-same-pick', '크기가 같은 식 찾기', '①54·55 ②58 심66', (d) => {
      const v = d.int(24, 48), a = d.int(11, v - 9), b = v - a, k = d.int(5, 19), m = d.pick([2, 3, 4]), n = Math.floor(v / m) + 1;
      const rows = d.shuffle([[`${v + k} − ${k}`, `${v + k}-${k}`], [`${v - 3} + 4`, `${v - 3}+4`], [`${v + 12} − 10`, `${v + 12}-10`], [`${m} × ${n}`, `${m}*${n}`]]);
      return C(`${a} + ${josa(b, '과/와')} 크기가 같은 것은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[1] === `${v + k}-${k}`), { explain: `${a} + ${b} = ${v}이다. ${v + k} − ${k} = ${v}이므로 ${a} + ${b} = ${v + k} − ${k}이다.`, facts: { choose: { exprs: rows.map((row) => row[1]), rule: 'equals', target: v } } });
    }),
    T('eq-pair', '크기가 같은 두 카드', '②58 ③73 심66', (d) => {
      const v = d.int(31, 69), p = d.int(12, v - 12), w = v - 10, r = v + d.int(11, 25), s = r - v + d.pick([2, 3, 4]), cards = [`${p} + ${v - p}`, String(v), String(w), `${r} − ${s}`];
      const pairs = d.shuffle([[0, 1], [0, 2], [3, 1], [3, 2]]);
      return C('수와 식이 적힌 카드 가운데 크기가 같은 두 카드를 찾아 등호로 나타낸 것은?', pairs.map(([x, y]) => `${cards[x]} = ${cards[y]}`), pairs.findIndex(([x, y]) => x === 0 && y === 1), {
        figure: seq(cards), explain: `${p} + ${v - p} = ${v}이고 ${r} − ${s} = ${r - s}이다. 크기가 같은 두 카드는 ${p} + ${josa(v - p, '과/와')} ${v}이다.`,
        facts: { choose: { exprs: [`${p}+${v - p}`, String(v), String(w), `${r}-${s}`], rule: 'same', pairsShown: pairs } }
      });
    }),
    T('eq-odd', '크기가 다른 식 하나', '①56', (d) => {
      const [a, b] = d.pick([[15, 8], [18, 10], [24, 5], [16, 5], [14, 10], [22, 5]]);
      const rows = d.shuffle([[`${a} × ${b}`, `${a}*${b}`], [`${b} × ${a}`, `${b}*${a}`], [`${a / 2} × ${2 * b}`, `${a / 2}*${2 * b}`], [`${a + 1} × ${b - 1}`, `${a + 1}*${b - 1}`]]);
      return C('크기가 나머지 셋과 다른 것은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1] === `${a + 1}*${b - 1}`), { explain: `${a} × ${b} = ${a * b}, ${a / 2} × ${2 * b} = ${a * b}이지만 ${a + 1} × ${b - 1} = ${(a + 1) * (b - 1)}이다.`, facts: { choose: { exprs: rows.map((row) => row[1]), rule: 'odd' } } });
    }),
    T('eq-count', '크기가 같은 것 모두 찾기', '①56 ②56 ③73', (d) => {
      const v = d.until(() => d.int(21, 43) * 2, (x) => x !== 62), same = d.bool(), half = same ? v / 2 : v / 2 - 1;
      const rows = d.shuffle([[`${v - 2} + 1 + 1`, true], [`${v + 8} − 8`, true], [`${half} × 2`, same], [`${v - 2} − 2`, false]]);
      return N(`${josa(v, '과/와')} 크기가 같은 것은 모두 몇 개인가?`, rows.filter((row) => row[1]).length, { unit: '개', figure: tagged(rows.map((row) => row[0])), explain: `${v - 2} + 1 + 1 = ${v}, ${v + 8} − 8 = ${v}, ${half} × 2 = ${half * 2}, ${v - 2} − 2 = ${v - 4}이다.`, facts: { count: rows.map((row) => row[1]) } });
    }),
    T('eq-true', '옳은 등식 고르기', '①57 ②57·64 ③68·69 심64', (d) => {
      // 틀린 보기: 뺄셈에서 두 수를 반대쪽으로 바꾼 것, 곱셈에서 한 수는 1 크게 한 수는 1 작게 한 것, 한쪽이 수 하나인 식
      const a = d.int(21, 58), b = d.int(21, 39), k = d.int(2, 9), c = d.int(51, 89), e = d.int(21, 39), m = d.int(3, 8), n = d.until(() => d.int(3, 9), (x) => x !== m + 1), p = d.int(11, 29), q = d.int(11, 29);
      const rows = d.shuffle([[`${a} + ${b} = ${a + k} + ${b - k}`, `${a}+${b}`, a + b], [`${c} − ${e} = ${c + k} − ${e - k}`, `${c}-${e}`, c - e + 2 * k], [`${m} × ${n} = ${m + 1} × ${n - 1}`, `${m}*${n}`, (m + 1) * (n - 1)], [`${p} = ${p + q} − ${q + 1}`, String(p), p - 1]]);
      return C('등호를 바르게 사용한 식은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1] === `${a}+${b}`), { explain: `${a} + ${b} = ${a + b}, ${a + k} + ${b - k} = ${josa(a + b, '으로/로')} 양쪽의 크기가 같다. 나머지 식은 양쪽의 크기가 다르다.`, facts: { claimed: rows.map((row) => [row[1], row[2]]), claimedWant: true } });
    }),
    T('eq-zero-one', '0과 1이 든 등식', '③66·69 ②64', (d) => {
      const a = d.int(6, 9), b = d.int(11, 19), c = d.int(21, 49), e = d.int(11, 29), g = d.int(5, 19), minus = d.bool();
      const rows = d.shuffle([[`${a} × 0 = ${b} × 0`, `${a}*0`, 0], [`${c} = ${c} + 0`, String(c), c], [`${e} = ${e} × 1`, String(e), e], minus ? [`${g} − 0 = 0`, `${g}-0`, 0] : [`${g} = ${g} × 0`, String(g), 0]]);
      return C('등호를 잘못 사용한 식은?', rows.map((row) => row[0]), rows.findIndex((row) => row[2] === 0 && row[1] !== `${a}*0`), { explain: minus ? `어떤 수에서 0을 빼면 그 수 그대로이다. ${g} − 0 = ${g}` : `어떤 수에 0을 곱하면 0이다. ${g} × 0 = 0이므로 ${josa(g, '과/와')} 같지 않다.`, facts: { claimed: rows.map((row) => [row[1], row[2]]), claimedWant: false } });
    }),
    T('eq-sign', '두 식의 크기 비교', '①58 ③68', (d) => {
      const a = d.int(21, 48), b = d.int(11, 29), k = d.int(2, 5), [right, expr] = d.pick([[`${a + k} + ${b - k}`, `${a + k}+${b - k}`], [`${a + k} + ${b}`, `${a + k}+${b}`], [`${a + b + k} − ${k + 1}`, `${a + b + k}-${k + 1}`]]), R = a + b - (expr === `${a + k}+${b - k}` ? 0 : expr === `${a + k}+${b}` ? -k : 1);
      return C('○ 안에 &gt;, =, &lt; 중 알맞은 것은?', SIGNS, a + b > R ? 0 : a + b === R ? 1 : 2, { figure: lines([`${a} + ${b} ○ ${right}`]), explain: `${a} + ${b} = ${a + b}, ${right} = ${R}이다.`, facts: { choose: { exprs: [`${a}+${b}`, expr], rule: 'compare' } } });
    }),
    T('eq-swap', '두 수의 순서를 바꾼 식', '①59 ③66 심60', (d) => {
      const add = d.bool(), a = add ? d.int(21, 68) : d.int(12, 39), b = add ? d.int(21, 68) : d.int(3, 9);
      return N(`두 수의 순서를 바꾸어 ${add ? '더한' : '곱한'} 식이다. □ 안에 알맞은 수는?`, a, { figure: lines([`${a} ${add ? '+' : '×'} ${b} = ${b} ${add ? '+' : '×'} ${box()}`]), explain: `두 수의 순서를 바꾸어 ${add ? '더해도 합' : '곱해도 곱'}은 같다. □ 안에 알맞은 수는 ${a}이다.`, facts: { calc: [[add ? `${a}+${b}-${b}` : `${a}*${b}/${b}`, 0]] } });
    }),
    T('eq-add', '덧셈 등식의 □', '①60 ②66 ③65 심59', (d) => {
      const a = d.int(21, 68), b = d.int(16, 39), k = d.pick([2, 3, 4, 5, 10]), more = d.bool(), c = more ? a + k : a - k, x = more ? b - k : b + k;
      return N('□ 안에 알맞은 수는?', x, { figure: lines([`${a} + ${b} = ${c} + ${box()}`]), explain: `${josa(c, '은/는')} ${a}보다 ${k} ${more ? '크므로' : '작으므로'} □는 ${b}보다 ${k} ${more ? '작은' : '큰'} ${x}이다. ${a} + ${b} = ${a + b}, ${c} + ${x} = ${a + b}`, facts: { calc: [[`${a}+${b}-${c}`, 0]] } });
    }),
    T('eq-sub', '뺄셈 등식의 □', '①61 ②66 ③65 심59', (d) => {
      const a = d.int(41, 88), b = d.int(16, 35), k = d.pick([2, 3, 4, 5, 10]), more = d.bool(), e = more ? b + k : b - k, x = more ? a + k : a - k;
      return N('□ 안에 알맞은 수는?', x, { figure: lines([`${a} − ${b} = ${box()} − ${e}`]), explain: `빼는 수가 ${k} ${more ? '커졌으므로' : '작아졌으므로'} 빼지는 수도 ${k} ${more ? '커져야' : '작아져야'} 차가 같다. ${a} − ${b} = ${a - b}, ${x} − ${e} = ${a - b}`, facts: { calc: [[`${a}-${b}+${e}`, 0]] } });
    }),
    T('eq-mixed', '양쪽의 셈이 다른 등식의 □', '①62', (d) => {
      const a = d.int(31, 69), x = d.int(6, 25), c = d.int(2, 9), b = a + x + c;
      return N('□ 안에 알맞은 수는?', x, { figure: lines([`${a} + ${box()} = ${b} − ${c}`]), explain: `${b} − ${c} = ${b - c}이므로 ${a} + □ = ${b - c}이다. □ = ${b - c} − ${a} = ${x}`, facts: { calc: [[`${b}-${c}-${a}`, 0]] } });
    }),
    T('eq-mul', '곱셈 등식의 □', '①63 ②67 ③67 심60', (d) => {
      const f = d.pick([2, 3]), down = d.bool(), a = down ? f * d.int(3, 12) : d.int(3, 12), b = down ? d.int(3, 9) : f * d.int(2, 9), c = down ? a / f : a * f, x = down ? b * f : b / f;
      return N('□ 안에 알맞은 수는?', x, { figure: lines([`${a} × ${b} = ${c} × ${box()}`]), explain: down ? `${josa(c, '은/는')} ${josa(a, '을/를')} ${josa(f, '으로/로')} 나눈 수이므로 □는 ${b}의 ${f}배인 ${x}이다. ${a} × ${b} = ${a * b}, ${c} × ${x} = ${a * b}` : `${josa(c, '은/는')} ${a}의 ${f}배이므로 □는 ${josa(b, '을/를')} ${josa(f, '으로/로')} 나눈 ${x}이다. ${a} × ${b} = ${a * b}, ${c} × ${x} = ${a * b}`, facts: { calc: [[`${a}*${b}/${c}`, 0]] } });
    }),
    T('eq-div', '나눗셈 등식의 □', '②67 ③67 심60', (d) => {
      const f = d.pick([2, 3]), b = d.int(2, 9), q = d.int(2, 9), upward = d.bool(), a = upward ? q * b : q * b * f, bb = upward ? b : b * f, c = upward ? a * f : a / f, x = upward ? b * f : b;
      return N('□ 안에 알맞은 수는?', x, { figure: lines([`${a} ÷ ${bb} = ${c} ÷ ${box()}`]), explain: `${a} ÷ ${bb} = ${q}이므로 ${c} ÷ □ = ${q}이다. 나누어지는 수가 ${upward ? f + '배가 되면' : josa(f, '으로/로') + ' 나눈 수가 되면'} 나누는 수도 그렇게 되어야 몫이 같다. □ = ${x}`, facts: { calc: [[`${c}/(${a}/${bb})`, 0]] } });
    }),
    T('eq-three', '세 수의 합이 든 등식의 □', '②66 ③65 심59·73', (d) => {
      const a = d.int(23, 78), s = d.pick([30, 40, 50]), b = d.int(11, s - 11);
      return N('□ 안에 알맞은 수는?', a, { figure: lines([`${a} + ${b} + ${s - b} = ${box()} + ${s}`]), explain: `${b} + ${s - b} = ${s}이므로 ${a} + ${b} + ${s - b} = ${a} + ${s}이다. □ 안에 알맞은 수는 ${a}이다.`, facts: { calc: [[`${a}+${b}+${s - b}-${s}`, 0]] } });
    }),
    T('eq-sub-split', '빼는 수를 갈라서 뺀 식의 □', '②66 심59', (d) => {
      const a = d.int(61, 98), c = d.int(3, 9), x = d.pick([20, 30, 40]), b = x + c;
      return N('□ 안에 알맞은 수는?', x, { figure: lines([`${a} − ${b} = ${a} − ${box()} − ${c}`]), explain: `${josa(b, '을/를')} 두 번에 나누어 뺀 것이다. ${b} = ${x} + ${c}이므로 □ 안에 알맞은 수는 ${x}이다. ${a} − ${b} = ${a - b}, ${a} − ${x} − ${c} = ${a - b}`, facts: { calc: [[`${b}-${c}`, 0]] } });
    }),
    T('eq-chain', '등호로 이어진 식', '①60·63 심59', (d) => {
      const a = d.int(52, 95), b = d.int(23, 58);
      return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: b + 10 }, { label: LABELS[1], answer: b + 20 }], { figure: lines([`${a} + ${b} = ${a - 10} + ${box(LABELS[0])} = ${a - 20} + ${box(LABELS[1])}`]), explain: `더해지는 수가 10씩 작아지므로 더하는 수는 10씩 커져야 합이 같다. ㉠은 ${b + 10}, ㉡은 ${b + 20}이다.`, facts: { calc: [[`${a}+${b}-${a - 10}`, 0], [`${a}+${b}-${a - 20}`, 1]] } });
    }),
    T('eq-why', '식이 옳은 까닭', '①64·71 ②63·65 ③70·71 심65', (d) => {
      // 틀린 보기: 등호를 「답」으로 읽은 것, 두 수가 같은 쪽으로 변했다고 본 것, 순서만 바꾸었다고 본 것
      const a = d.int(41, 68), b = d.int(11, 29), k = d.int(2, 12);
      const rows = d.shuffle([[`${a}에서 ${josa(a - k, '으로/로')} ${k}만큼 작아지고, ${b}에서 ${josa(b + k, '으로/로')} ${k}만큼 커졌기 때문이다.`, true], [`두 수가 모두 ${k}만큼 작아졌기 때문이다.`, false], [`${a} + ${josa(b, '을/를')} 계산한 답이 ${a - k}이기 때문이다.`, false], ['더하는 두 수의 순서를 바꾸었기 때문이다.', false]]);
      return C('다음 식이 옳은 까닭을 바르게 말한 것은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), { figure: lines([`${a} + ${b} = ${a - k} + ${b + k}`]), explain: `한 수가 ${k}만큼 작아지고 다른 수가 ${k}만큼 커지면 합은 같다. 양쪽 모두 ${a + b}이다.`, facts: truthOf(rows, true) });
    }),
    T('eq-fix', '틀린 식 바로잡기', '①66 ②70 ③72', (d) => {
      const a = d.int(21, 58), b = d.int(21, 39), k = d.int(3, 9), c = a + k, wrong = b + k;
      return N(`${a} + ${b} = ${c} + ${josa(wrong, '은/는')} 옳지 않은 식이다. 옳은 식이 되도록 ${josa(wrong, '을/를')} 고치면 어떤 수가 되는가?`, b - k, { explain: `${josa(c, '은/는')} ${a}보다 ${k} 크므로 더하는 수는 ${b}보다 ${k} 작아야 한다. ${a} + ${b} = ${c} + ${b - k}`, facts: { calc: [[`${a}+${b}-${c}`, 0]] } });
    }),
    T('eq-same-symbol', '같은 수를 여러 번 더한 식', '①67 심63', (d) => {
      const n = d.int(4, 6), x = d.int(6, 15);
      return N('같은 모양은 같은 수를 나타낸다. △가 나타내는 수는?', x, { figure: lines([`${n * x} = ${range(n).map(() => '△').join(' + ')}`]), explain: `△를 ${n}번 더한 값이 ${n * x}이므로 △ = ${n * x} ÷ ${n} = ${x}이다.`, facts: { calc: [[`${n * x}/${n}`, 0]], unseen: [n] } });
    }),
    T('eq-split', '한 수를 갈라서 쓴 식', '①71 심72', (d) => {
      const tens = d.int(2, 8) * 10, ones = d.int(2, 9), a = tens + ones, b = d.int(11, 49);
      const rows = d.shuffle([[`${a} + ${b} = ${tens} + ${ones} + ${b}`, a + b], [`${a} + ${b} = ${tens} + ${b}`, tens + b], [`${a} + ${b} = ${tens / 10} + ${ones} + ${b}`, tens / 10 + ones + b], [`${a} + ${b} = ${tens} + ${ones * 10} + ${b}`, tens + ones * 10 + b]]);
      return C(`${josa(a, '을/를')} ${josa(tens, '과/와')} ${josa(ones, '으로/로')} 갈라서 쓴 식으로 옳은 것은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[1] === a + b), { explain: `${a} = ${tens} + ${ones}이므로 ${a} + ${b} = ${tens} + ${ones} + ${b}이다. 계산하지 않아도 옳은 식임을 알 수 있다.`, facts: { claimed: rows.map((row) => [`${a}+${b}`, row[1]]), claimedWant: true } });
    }),
    T('eq-both-add', '양쪽에 같은 수를 더한 식', '②63', (d) => {
      const h = d.pick([15, 25, 30, 35]), total = 2 * h, k = d.int(1, 9);
      const rows = d.shuffle([[`${total} + ${k} = ${h} + ${h} + ${k}`, `${total}+${k}`, total + k], [`${total} + ${k} = ${h} + ${h}`, `${total}+${k}`, total], [`${total} − ${k} = ${h} + ${h} + ${k}`, `${total}-${k}`, total + k], [`${total} + ${k} = ${h} + ${k} + ${h} + ${k}`, `${total}+${k}`, total + 2 * k]]);
      return C(`${total} = ${h} + ${josa(h, '은/는')} 옳은 식이다. 이 식을 이용하여 만든 식 가운데 옳은 것은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[2] === total + k && row[1] === `${total}+${k}`), { explain: `양쪽에 같은 수 ${josa(k, '을/를')} 더하면 양쪽의 크기는 여전히 같다. ${total} + ${k} = ${h} + ${h} + ${k}`, facts: { claimed: rows.map((row) => [row[1], row[2]]), claimedWant: true } });
    }),
    T('eq-stones', '양쪽 접시의 돌의 수', '②54 ③64 심71', (d) => {
      const a = d.int(14, 29), b = d.int(21, 38), k = d.int(1, 5), c = b - k;
      return N(`저울의 왼쪽 접시에 흰 돌 ${a}개와 검은 돌 ${b}개를, 오른쪽 접시에 흰 돌 □개와 검은 돌 ${c}개를 올렸더니 수평이 되었다. 돌의 무게가 모두 같을 때, □ 안에 알맞은 수는?`, a + k, { explain: `양쪽 접시의 돌의 수가 같으므로 ${a} + ${b} = □ + ${c}이다. 검은 돌이 ${k}개 적으므로 흰 돌은 ${k}개 많은 ${a + k}개이다.`, facts: { calc: [[`${a}+${b}-${c}`, 0]] } });
    }),
    T('eq-situation', '상황을 등호를 사용한 식으로 나타내기', '심71', (d) => {
      // 틀린 보기: 같은 과일끼리 묶은 것, 덧셈을 뺄셈으로 쓴 것, 계산한 답을 쓰고 식을 이어 쓴 것
      const [a, b, k] = d.until(() => [d.int(31, 68), d.int(5, 19), d.int(2, 9)], ([x, y, z]) => x - y !== z), c = a - k, e = b + k;
      const rows = d.shuffle([[`${a} + ${b} = ${c} + ${e}`, `${a}+${b}`, c + e], [`${a} + ${c} = ${b} + ${e}`, `${a}+${c}`, b + e], [`${a} − ${b} = ${c} − ${e}`, `${a}-${b}`, c - e], [`${a} + ${b} = ${a + b} + ${c} + ${e}`, `${a}+${b}`, a + b + c + e]]);
      return C(`한 상자에는 사과 ${a}개와 배 ${b}개가, 다른 상자에는 사과 ${c}개와 배 ${e}개가 들어 있다. 두 상자에 든 과일의 수가 같음을 등호를 사용한 식으로 바르게 나타낸 것은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[1] === `${a}+${b}` && row[2] === c + e), { explain: `한 상자의 과일은 ${a} + ${b}, 다른 상자의 과일은 ${c} + ${e}이다. 두 수가 같으므로 ${a} + ${b} = ${c} + ${e}`, facts: { claimed: rows.map((row) => [row[1], row[2]]), claimedWant: true } });
    }),
    T('eq-scale', '저울 그림을 식으로 나타내기', '②53 ①58·60', (d) => {
      const a = d.int(5, 9), b = d.int(2, 6), c = d.until(() => d.int(3, 9), (v) => v !== a && v !== b && v < a + b && a + b - v !== v), x = a + b - c;
      return N('주머니에 적힌 수만큼 구슬이 들어 있고, 저울은 수평을 이루고 있다. 구슬의 무게가 모두 같을 때, □ 안에 알맞은 수는?', x, { figure: scale([a, b], [c, '□']), explain: `양쪽 접시의 구슬의 수가 같으므로 ${a} + ${b} = ${c} + □이다. ${a} + ${b} = ${a + b}이므로 □ = ${a + b} − ${c} = ${x}`, facts: { calc: [[`${a}+${b}-${c}`, 0]] } });
    }),
    T('eq-scale-move', '덜어 내고 올려 수평 맞추기', '③63 ②53·55', (d) => {
      const [a, b, x] = d.until(() => [d.int(12, 20), d.int(5, 9), d.int(1, 3)], ([p, q, r]) => p - r - q >= 2);
      return N(`무게가 같은 구슬이 저울의 왼쪽 접시에 ${a}개, 오른쪽 접시에 ${b}개 놓여 있다. 왼쪽 접시에서 ${x}개를 덜어 내고 오른쪽 접시에 구슬을 더 올렸더니 수평이 되었다. 더 올린 구슬의 수 □는?`, a - x - b, { unit: '개', figure: lines([`${a} − ${x} = ${b} + ${box()}`]), explain: `${a} − ${x} = ${a - x}이므로 ${b} + □ = ${a - x}이다. □ = ${a - x} − ${b} = ${a - x - b}`, facts: { calc: [[`${a}-${x}-${b}`, 0]] } });
    })
  ]);

  B.addGroup('4-1-6', {
    id: 'hard', title: '단원 종합', standard: EQUAL,
    types: [
      H('hd-right-side', '등호 오른쪽에 올 수 있는 것', '66, 기본 ③73', (d) => {
        // 등호 오른쪽에는 수 하나(답)만 온다고 여기는 아이는 1개라고 답한다.
        const a = d.int(15, 29), b = d.int(6, 10), v = a - b, p = d.int(2, v - 2), q = d.int(5, 12), same = d.bool();
        const rows = d.shuffle([[String(v), true], [`${p} + ${v - p}`, true], [`${v + q} − ${same ? q : q + 1}`, same], [`${a} + ${b}`, false]]);
        return N(`${a} − ${b} = □의 □ 안에 들어갈 수 있는 것은 모두 몇 개인가?`, rows.filter((row) => row[1]).length, { unit: '개', figure: tagged(rows.map((row) => row[0])), explain: `${a} − ${b} = ${v}이다. 등호의 오른쪽에는 크기가 ${v}인 수나 식이 모두 올 수 있다. ${p} + ${v - p} = ${v}, ${v + q} − ${same ? q : q + 1} = ${same ? v : v - 1}, ${a} + ${b} = ${a + b}`, facts: { count: rows.map((row) => row[1]) } });
      }),
      H('hd-run-on', '이어 쓴 등호', '68', (d) => {
        // 계산 과정을 이어 쓰며 등호를 「그래서 답은」으로 쓰는 버릇
        const a = d.int(21, 39), b = d.int(12, 19), c = d.int(5, 9);
        const rows = d.shuffle([[`${a} + ${b} + ${c} = ${a + b + c}`, true], [`${a} + ${b} = ${a + b}`, true], [`${a + b} + ${c} = ${a + b + c}`, true], [`${a} + ${b} = ${a + b} + ${c} = ${a + b + c}`, false]]);
        return C(`책꽂이에 책이 ${a}권 꽂혀 있었다. 오전에 ${b}권을 더 꽂고, 오후에 ${c}권을 더 꽂았다. 책꽂이에 꽂힌 책의 수를 구하면서 쓴 식 가운데 등호를 잘못 사용한 것은?`, rows.map((row) => row[0]), rows.findIndex((row) => !row[1]), { explain: `${a} + ${b} = ${a + b}이고 ${a + b} + ${c} = ${a + b + c}이다. ${a} + ${josa(b, '과/와')} ${a + b} + ${josa(c, '은/는')} 크기가 다르므로 등호로 이을 수 없다.`, facts: truthOf(rows, false) });
      }),
      H('hd-double-half', '덧셈과 곱셈에서 달라지는 규칙', '60·65', (d) => {
        // 틀린 보기: 곱셈의 「2배와 절반」을 덧셈에 쓴 것, 덧셈의 「커진 만큼 작게」를 곱셈에 쓴 것, 두 수를 모두 2배 한 것
        const [a, b] = d.until(() => [d.pick([12, 14, 16, 18]), d.pick([24, 26, 28, 32, 34])], ([x, y]) => y !== 2 * x && y - x !== 10);
        const rows = d.shuffle([[`${a} × ${b} = ${2 * a} × ${b / 2}`, `${a}*${b}`, 2 * a * (b / 2)], [`${a} + ${b} = ${2 * a} + ${b / 2}`, `${a}+${b}`, 2 * a + b / 2], [`${a} × ${b} = ${a + 10} × ${b - 10}`, `${a}*${b}`, (a + 10) * (b - 10)], [`${a} × ${b} = ${2 * a} × ${2 * b}`, `${a}*${b}`, 4 * a * b]]);
        return C('계산하지 않고 두 수가 어떻게 변했는지 살펴 옳은 식을 찾으려고 한다. 옳은 식은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1] === `${a}*${b}` && row[2] === a * b), { explain: `곱셈에서는 한 수가 2배가 되면 다른 수는 절반이 되어야 곱이 같다. 덧셈에서는 한 수가 커진 만큼 다른 수가 작아져야 합이 같다. ${a} × ${b} = ${a * b}, ${2 * a} × ${b / 2} = ${a * b}`, facts: { claimed: rows.map((row) => [row[1], row[2]]), claimedWant: true } });
      }),
      H('hd-torn-back', '규칙을 거꾸로 써서 구하는 칸', '3', (d) => {
        const [h, v] = d.pick(HV), cell = cellOf(startOf(d), h, v), marks = { '0,0': box(LABELS[0]) };
        for (let i = 1; i < 4; i += 1) { marks['0,' + i] = ''; marks[i + ',0'] = ''; }
        return N('수 배열표의 일부가 지워졌다. ㉠에 알맞은 수는?', cell(0, 0), { figure: tableOf(cell, 4, 4, marks), explain: `→ 방향으로 ${h}씩, ↓ 방향으로 ${v}씩 커진다. ㉠은 ${cell(1, 1)}에서 왼쪽으로 한 칸, 위쪽으로 한 칸 간 곳이므로 ${cell(1, 1)} − ${h} − ${v} = ${cell(0, 0)}이다.`, facts: { calc: [[`${cell(1, 1)}-(${cell(1, 2)}-${cell(1, 1)})-(${cell(2, 1)}-${cell(1, 1)})`, 0]] } });
      }, { standard: RULE }),
      H('hd-diag-far', '↘ 방향으로 이어지는 수', '4', (d) => {
        const v = d.pick([100, 1000]), h = d.pick([-10, -1, 1, 10]), cell = cellOf(startOf(d), h, v), step = v + h;
        return N('수 배열표에서 색칠한 수는 ↘ 방향으로 놓여 있다. 이 규칙으로 수를 계속 늘어놓을 때, ↘ 방향으로 놓이는 다섯째 수는?', cell(4, 4), { figure: tableOf(cell, 3, 3, { '0,0': [cell(0, 0)], '1,1': [cell(1, 1)], '2,2': [cell(2, 2)] }), explain: `→ 방향으로 ${Math.abs(h)}씩 ${h > 0 ? '커지고' : '작아지고'} ↓ 방향으로 ${v}씩 커지므로 ↘ 방향으로 ${step}씩 커진다. 넷째 수는 ${cell(3, 3)}, 다섯째 수는 ${cell(4, 4)}이다.`, facts: { calc: [[`${cell(2, 2)}+(${cell(1, 1)}-${cell(0, 0)})*2`, 0]], unseen: [2] } });
      }, { standard: RULE }),
      H('hd-row-first-1000', '규칙을 이어 가 처음 나오는 네 자리 수', '11', (d) => {
        const [p, s] = d.pick([[2, 3], [2, 5], [4, 3], [3, 5], [2, 7], [5, 2], [3, 7], [2, 9]]), t = [s];
        while (t[t.length - 1] < 1000) t.push(t[t.length - 1] * p);
        return N('규칙에 따라 수를 늘어놓았다. 이 규칙으로 수를 계속 늘어놓을 때, 처음으로 나오는 네 자리 수는?', t[t.length - 1], { figure: seq(t.slice(0, 4).concat(['…'])), explain: `${p}씩 곱하는 규칙이다. ${t.slice(3).join(', ')}이므로 처음으로 나오는 네 자리 수는 ${t[t.length - 1]}이다.`, facts: { calc: [[t[3] + range(t.length - 4).map(() => `*(${t[1]}/${t[0]})`).join(''), 0]] } });
      }, { standard: RULE }),
      H('hd-nth-stairs', '계단 모양에서 몇째인지 구하기', '26, 기본 ②23 ③26', (d) => {
        const shapes = range(4, 1).map((n) => sq(stairs(n))), k = d.pick([6, 7]), total = (k * (k + 1)) / 2, list = range(k, 1).map((n) => (n * (n + 1)) / 2);
        return N(`규칙에 따라 사각형을 계단 모양으로 늘어놓았다. 사각형 ${total}개로 만든 모양은 몇 번째 모양인가?`, k, { unit: '번째', figure: steps(shapes, ORD, told(shapes, ORD, '사각형')), explain: `늘어나는 수가 2개, 3개, 4개, …로 1씩 커진다. 사각형의 수는 ${list.join(', ')}이므로 ${total}개인 모양은 ${k}번째 모양이다.`, facts: { count: range(10, 1).map((n) => (n * (n + 1)) / 2 <= total) } });
      }, { standard: RULE }),
      H('hd-two-diff', '두 색 바둑돌의 수의 차', '34, 기본 ②24', () => {
        const shapes = range(4, 1).map((n) => st(block(n, n).map(([x, y]) => [x, y, x === n - 1 || y === 0])));
        return N('검은 바둑돌과 흰 바둑돌을 규칙에 따라 늘어놓았다. 여섯째 모양에서 흰 바둑돌은 검은 바둑돌보다 몇 개 더 많은가?', 14, { unit: '개', figure: steps(shapes, ORD, '모양의 배열: ' + shapes.map((sh, i) => `${ORD[i]} 검은 바둑돌 ${sh.on}개 흰 바둑돌 ${sh.n - sh.on}개`).join(', ')), explain: '검은 바둑돌은 1개, 3개, 5개, 7개로 2개씩 늘어나므로 여섯째에는 11개이다. 흰 바둑돌은 0개, 1개, 4개, 9개이고 다섯째에는 4 × 4 = 16(개), 여섯째에는 5 × 5 = 25(개)이다. 25 − 11 = 14', facts: { calc: [[`5*5-(${shapes[3].on}+2+2)`, 0]], unseen: [5, 2] } });
      }, { standard: RULE }),
      H('hd-big-product', '규칙으로 큰 수의 곱 알기', '47·48, 기본 ①46·50', (d) => {
        // 틀린 보기: 한 단계 앞의 곱, 2를 하나 덜 쓴 것, 1을 하나 덜 쓴 것
        const f = GROW.pairs, n = d.pick([5, 6]), right = valueOf(f, n);
        const list = d.shuffle([right, valueOf(f, n - 1), Number('1'.repeat(n) + '2'.repeat(n - 1)), Number('1'.repeat(n - 1) + '2'.repeat(n))]);
        return C(`곱셈식의 배열에서 규칙을 찾으면 계산하지 않고도 ${f.a(n)} × ${f.b(n)}의 값을 알 수 있다. 그 값은?`, list.map(String), list.indexOf(right), { figure: named(range(3, 1).map((k) => lineOf(f, k))), explain: `3이 2개씩이면 1122, 3개씩이면 111222이다. 곱하는 수의 자리 수만큼 1과 2가 차례로 놓인다. ${f.a(n)} × ${josa(f.b(n), '은/는')} 1이 ${n}개, 2가 ${n}개인 ${right}이다.`, facts: { pick: { expr: `${f.a(n)}*${f.b(n)}`, options: list } } });
      }, { standard: CALC }),
      H('hd-digits-find', '계산 결과가 정해진 긴 덧셈식', '43, 기본 ①37 ②35', (d) => {
        // 틀린 보기: 결과의 자리 수(일곱 자리)만큼 숫자를 쓴 것, 한 자리 덜 쓴 것, 한 수만 한 자리 덜 쓴 것
        const [x, y] = d.pick([[5, 6], [6, 5], [7, 4]]), k = d.pick([5, 6]), target = rep(x, k) + rep(y, k);
        const rows = d.shuffle([[k, k], [k + 1, k + 1], [k - 1, k - 1], [k, k - 1]]);
        return C(`덧셈식의 배열에서 규칙에 따라 계산 결과가 ${target}인 식은?`, rows.map(([i, j]) => `${rep(x, i)} + ${rep(y, j)}`), rows.findIndex(([i, j]) => i === k && j === k), { figure: named(range(3, 1).map((i) => fmt(`${rep(x, i)}+${rep(y, i)}=${rep(x, i) + rep(y, i)}`))), explain: `결과는 11, 121, 1221, …로 2가 하나씩 늘어난다. 결과의 자리 수는 더하는 수의 자리 수보다 하나 많다. ${josa(target, '은/는')} ${k + 1}자리 수이므로 ${k}자리 수끼리 더한 ${rep(x, k)} + ${rep(y, k)}이다.`, facts: { choose: { exprs: rows.map(([i, j]) => `${rep(x, i)}+${rep(y, j)}`), rule: 'equals', target } } });
      }, { standard: CALC }),
      H('hd-count-digits', '몫이 정해진 긴 나눗셈식', '54, 기본 ②43', (d) => {
        // 틀린 보기: 9를 하나 더 쓰거나 덜 쓴 것, 맨 앞의 7을 8로 쓴 것
        const f = GROW.eighths, k = d.pick([5, 6]), q = rep(9, k), list = d.shuffle([f.a(k), f.a(k + 1), f.a(k - 1), f.a(k) + Math.pow(10, k)]);
        return C(`나눗셈식의 배열에서 규칙에 따라 몫이 ${q}인 식을 쓸 때, 나누어지는 수는?`, list.map(String), list.indexOf(f.a(k)), { figure: named(range(3, 1).map((i) => lineOf(f, i))), explain: `몫에 9가 2개이면 나누어지는 수는 792, 3개이면 7992이다. 몫의 9가 ${k}개이면 7과 2 사이에 9가 ${k - 1}개 놓인 ${f.a(k)}이다.`, facts: { pick: { expr: `${q}*8`, options: list } } });
      }, { standard: CALC }),
      H('hd-odd-sum-nth', '더하는 수가 늘어나는 식의 순서', '41·45, 기본 ①37', (d) => {
        // 틀린 보기: 「두 번 곱해 그 수가 되는 수」를 그대로 순서로 답한 것(순서보다 1 큰 수를 두 번 곱한 값이 결과이다)
        const k = d.int(5, 7), target = (k + 1) * (k + 1), ks = [5, 6, 7, 8];
        return C(`덧셈식의 배열에서 규칙에 따라 식을 계속 쓸 때, 계산 결과가 ${target}인 식은 몇째 식인가?`, ks.map((n) => ORD[n - 1]), ks.indexOf(k), { figure: eqs(['1+3=4', '1+3+5=9', '1+3+5+7=16']), explain: `첫째 식의 결과는 2 × 2, 둘째는 3 × 3, 셋째는 4 × 4이다. ${target} = ${k + 1} × ${k + 1}이므로 ${ORD[k - 1]} 식이다.`, facts: { truth: ks.map((n) => (n + 1) * (n + 1) === target), want: true } });
      }, { standard: CALC }),
      H('hd-updown-nth', '커졌다가 작아지는 덧셈식의 순서', '44·45', (d) => {
        const k = d.int(5, 8), target = (k + 1) * (k + 1), row = (n) => range(n, 1).concat(range(n - 1, 1).reverse());
        return N(`덧셈식의 배열에서 규칙에 따라 식을 계속 쓸 때, 계산 결과가 ${target}인 식은 몇 번째 식인가?`, k, { unit: '번째', figure: eqs(range(3, 2).map((n) => row(n).join('+') + '=' + n * n)), explain: `가운데 수를 두 번 곱한 값이 합이다. ${target} = ${k + 1} × ${k + 1}이므로 가운데 수는 ${k + 1}이다. 첫째 식의 가운데 수가 2이므로 가운데 수가 ${k + 1}인 식은 ${k}번째 식이다.`, facts: { count: range(10, 1).map((n) => (n + 1) * (n + 1) <= target) } });
      }, { standard: CALC }),
      H('hd-two-eqs', '두 식을 이어 풀기', '62, 기본 ①67', (d) => {
        const x = d.pick([28, 32, 36]), a = d.pick([60, 70, 80]), b = x - 20, y = d.int(2, 4), m = 2 * y;
        return M('같은 기호에는 같은 수가 들어간다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: x }, { label: LABELS[1], answer: y }], { figure: lines([`${a} + ${b} = ${a - 20} + ${box(LABELS[0])}`, `${box(LABELS[0])} × ${m} = ${2 * x} × ${box(LABELS[1])}`]), explain: `${a} + ${b} = ${a + b}이므로 ㉠ = ${a + b} − ${a - 20} = ${x}이다. ${x} × ${m} = ${2 * x} × ㉡에서 ${josa(2 * x, '은/는')} ${x}의 2배이므로 ㉡은 ${josa(m, '을/를')} 2로 나눈 ${y}이다.`, facts: { calc: [[`${a}+${b}-${a - 20}`, 0], [`(${a}+${b}-${a - 20})*${m}/${2 * x}`, 1]] } });
      }),
      H('hd-box-max', '□에 알맞은 수가 가장 큰 식', '61, 기본 ②68', (d) => {
        const [x, y, z] = d.until(() => [d.int(5, 19), d.int(5, 19), d.int(5, 19)], (v) => new Set(v).size === 3 && Math.max.apply(null, v) - Math.min.apply(null, v) <= 6);
        const a = d.int(51, 79), b = d.int(21, 35), c = d.pick([20, 30]), e = d.int(41, 69), g = d.int(11, 29);
        const rows = [[`${a} − ${b} = ${a - b + x} − ${box()}`, `${a - b + x}-(${a}-${b})`], [`${2 * c + y} = ${c} + ${c} + ${box()}`, `${2 * c + y}-${c}-${c}`], [`${e} + ${box()} = ${g} + ${e - g} + ${z}`, `${g}+${e - g}+${z}-${e}`]];
        return C('□ 안에 알맞은 수가 가장 큰 식은?', LABELS.slice(0, 3), [x, y, z].indexOf(Math.max(x, y, z)), { figure: tagged(rows.map((row) => row[0])), explain: `□ 안에 알맞은 수는 차례로 ${x}, ${y}, ${z}이다.`, facts: { choose: { exprs: rows.map((row) => row[1]), rule: 'max' } } });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
