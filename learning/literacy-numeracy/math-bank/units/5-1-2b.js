// 5학년 1학기 2단원 약수와 배수 — 공배수와 최소공배수, 최소공배수 구하는 방법, 활용 문장제의 기본 문항과 실력 문항.
// 꼴 목록(기본꼴 1~3, 심화꼴 91꼴)을 꼴마다 따져서 실었다. 꼴 번호는 ①n = 기본꼴_1의 n번, ②n, ③n, 심n.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것
//   ① 1과 자기 자신을 약수에서 빠뜨린다. 자기 자신을 배수에서 빠뜨린다(6의 배수는 12부터라고 여긴다).
//   ② 큰 수일수록 약수가 많다고 여긴다. 약수는 끝이 있고 배수는 끝이 없다는 것을 거꾸로 안다.
//   ③ 최대공약수와 최소공배수를 바꾸어 쓴다(나누어 담기에 최소공배수, 다시 만나기에 최대공약수).
//   ④ 공약수로 나누는 셈에서 덜 나누고 멈추거나, 최소공배수를 구할 때 밑에 남은 수를 빼먹는다.
//   ⑤ 최소공배수는 언제나 두 수의 곱이라고 여기거나, 공약수가 1뿐인 두 수는 최소공배수를 못 구한다고 여긴다.
//   ⑥ 「몇 번」을 셀 때 처음 것을 넣는지 빼는지를 읽지 않는다.
// 이 가운데 기본에서 하는 일(약수 구하기, 최대공약수·최소공배수 한 번 구하기, 뜻 되묻기)을 고르기로 바꾸고 틀린 보기에 실수 답을 넣은 것은
// 실력이 아니므로 기본 묶음에 실었다(dv-all, ml-say, rl-say-general, gw-ladder-short, lw-ladder-short, lw-ladder-expr, cm-say).
//
// 실력 문항의 잣대: 어려움이 보기가 아니라 문제의 장치에서 나와야 한다.
//   ㉮ 상황 자체에 함정이 있어 뜻을 정확히 대야 풀리는 문제 — 나누어 주기와 다시 오기를 한 문제에 섞어 어느 쪽이 최대공약수인지 가리기,
//      공약수가 1뿐인 쌍·한쪽이 배수인 쌍·그 밖의 쌍을 섞어 놓고 묻기, 처음 것을 넣어 세기와 빼고 세기, 자기 자신이 약수이자 배수라는 것.
//   ㉯ 심화꼴 목록에 있는, 두 번 넘게 생각해야 풀리는 문제 — 나머지가 있는 꼴, 범위 안의 공배수, 공약수 가운데 조건에 맞는 것,
//      다시 만나는 횟수, 정사각형 장수, 톱니바퀴, 규칙대로 놓은 바둑돌.
//
// 뺀 것과 까닭
//  - 중학교 내용·방정식 꼴: 두 수의 곱과 최대공약수로 최소공배수 구하기(심67), 합과 차로 두 수 구하기(심69), 합·최대공약수·최소공배수로 두 수 구하기(①75),
//    한 수와 최대공약수·최소공배수로 다른 수 구하기(③78 심66 — 가려진 칸 둘을 되짚어야 한다)
//  - 둘레(5-1 뒤 단원)·닫힌 길의 간격 세기: 직사각형 가장자리의 말뚝(심79)
//  - 꼬임: 나눗셈 틀에서 가려진 수 여럿 되짚기(①74 ③73 심64), 1 모자란 수로 바꿔 읽기(심73), 두 수 어느 것의 배수도 아닌 수의 개수(심63),
//    켜졌다 꺼지는 두 등대(심91), 묻고 답하는 말로 수 맞히기(①76), 새 기호를 약속하여 이어 셈하기(심68)
//  - 받아올림이 있는 시각 셈이 어려움인 것: 정각이 아닌 때부터 동시에 출발하는 시각(심83 변형)
//  - 같은 얼개: 몇째마다 주는 것을 처음으로 둘 다 받는 사람(②110 — 다음에 함께 하는 날과 같다), 한 달 동안 함께 하는 날의 수(②106 심82)와
//    정해진 시간 동안 동시에 출발하는 횟수(심84)는 처음 것을 넣어 세는 hd-road-count 와 얼개가 같다. 한 사람이 받는 두 가지의 합(①78 변형 심76)은
//    us-share-each 에서 더하기만 한 것이다. 최소공배수 잇기·잘못 구한 것 찾기(②76·78 ③76)는 쌍마다 구해 비교하는 lw-compare 와 하는 일이 같다.
//  - 서술형: 두 가지 방법으로 구하기(①52 변형 ③50·71 변형), 관계 설명하기(③67 — 뜻은 cm-same-as, cm-say 로 묻는다)
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { LABELS, NAMES, box, lines, tagged, numbers, cards, josa, name, N, M, C } = B.kit;
  const U = '5-1-2', DIV = '6수01-04', MUL = '6수01-05';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  // 실력 문항의 꼴 번호는 심화꼴 번호다. 기본 자료에만 있는 꼴은 '기본 ②109'처럼 적는다.
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: ref.startsWith('기본 ') ? '수집본 기본 자료(' + ref.slice(3) + ')' : '수집본 심화 자료(' + ref + ')', make }, more || {});
  const ORD = ['첫째', '둘째', '셋째', '넷째', '다섯째', '여섯째', '일곱째', '여덟째', '아홉째', '열째'];
  const SIGNS = ['&gt;', '=', '&lt;'];
  const range = (n, from) => Array.from({ length: n }, (_, i) => i + (from || 0));
  const asc = (list) => list.slice().sort((x, y) => x - y);
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const lcm = (a, b) => (a * b) / gcd(a, b);
  const divs = (n) => range(n, 1).filter((k) => n % k === 0);
  const factors = (n) => { const out = []; let m = n; for (let p = 2; m > 1; p += 1) while (m % p === 0) { out.push(p); m /= p; } return out; };
  const times = (list) => list.join(' × ');
  const rest = (a, b) => (a % b ? ` … ${a % b}` : '');
  const truthOf = (rows, want) => ({ truth: rows.map((row) => row[1]), want });
  const CT = (text, rows, want, o) => C(text, rows.map((row) => row[0]), rows.findIndex((row) => row[1] === want), Object.assign({}, o, { facts: Object.assign(truthOf(rows, want), o.facts || {}) }));
  const swap = (d, pair) => (d.bool() ? pair : [pair[1], pair[0]]);
  const versus = (left, right) => `<div class="mb-versus"><span class="mb-expr">${left}</span><span class="mb-ring"></span><span class="mb-expr">${right}</span></div>`;
  // 글이 긴 줄(약수·배수를 늘어놓은 줄, 문장)은 글씨를 조금 줄여 적는다.
  const notes = (rows) => '<div class="mb-lines" style="font-size:1rem">' + rows.map((row) => '<div>' + row + '</div>').join('') + '</div>';
  // 두 수 고르기(5-1-2a.js 와 같은 도구)
  function pairOf(d, kind, o) {
    const m = Object.assign({ min: 4, max: 96, maxL: 400, gMin: 2, gMax: 24 }, o || {});
    if (kind === 'nested') return d.until(() => { const a = d.int(m.min, 24); return [a, a * d.int(2, 6)]; }, ([, b]) => b <= m.max);
    if (kind === 'coprime') return d.until(() => [d.int(3, 14), d.int(4, 16)], ([a, b]) => a < b && gcd(a, b) === 1 && a * b <= m.maxL);
    return d.until(() => { const g = d.int(m.gMin, Math.min(m.gMax, 16)); return [g * d.int(2, 7), g * d.int(3, 9)]; },
      ([a, b]) => a < b && a >= m.min && b <= m.max && b % a !== 0 && gcd(a, b) >= m.gMin && gcd(a, b) <= m.gMax && lcm(a, b) <= m.maxL && (!m.ok || m.ok(a, b)));
  }
  // 최소공배수를 다시 셈하는 식 글(두 수는 문제에 적힌 수이고, 최대공약수는 facts.unseen 에 밝힌다)
  const lcmExpr = (a, b) => `${a}*${b}/${gcd(a, b)}`;
  const THINGS = [['사탕', '개'], ['초콜릿', '개'], ['공책', '권'], ['연필', '자루'], ['색종이', '장'], ['구슬', '개'], ['귤', '개'], ['딱지', '장']];

  // ── 그림(numGrid·ladder·ladderOf 는 5-1-2a.js 와 같은 도구) ──────
  function numGrid(cells, cols, on) {
    const rows = [];
    for (let i = 0; i < cells.length; i += cols) rows.push(cells.slice(i, i + cols));
    const td = (v) => '<td style="padding:5px 0;width:2.2em;font-weight:400;background:' + (on && on(v) ? '#fde68a' : '#fff') + '">' + v + '</td>';
    return '<div class="mb-table-wrap"><table class="mb-table"><tbody>' + rows.map((row) => '<tr>' + row.map(td).join('') + '</tr>').join('') + '</tbody></table></div>';
  }
  function ladder(rows, last) {
    const cell = 'padding:4px 12px;text-align:center;min-width:2.6em', ink = '2px solid var(--ink, #1f2933)';
    const body = rows.map(([k, a, b]) => '<tr><td style="padding:4px 8px 4px 4px;text-align:right;min-width:1.8em">' + k + '</td><td style="' + cell + ';border-left:' + ink + ';border-bottom:' + ink + '">' + a + '</td><td style="' + cell + ';border-bottom:' + ink + '">' + b + '</td></tr>').join('');
    return '<table role="img" aria-label="공약수로 나누는 셈" style="border-collapse:collapse;font-size:1.2rem;font-variant-numeric:tabular-nums;line-height:1.4"><tbody>' + body
      + '<tr><td></td><td style="' + cell + '">' + last[0] + '</td><td style="' + cell + '">' + last[1] + '</td></tr></tbody></table>';
  }
  function ladderOf(a, b, steps) {
    const rows = []; let x = a, y = b;
    for (const p of factors(gcd(a, b)).slice(0, steps || 99)) { rows.push([p, x, y]); x /= p; y /= p; }
    return { rows, last: [x, y], by: rows.map((row) => row[0]) };
  }
  const ladderPair = (d, steps, o) => pairOf(d, 'general', Object.assign({ ok: (x, y) => factors(gcd(x, y)).length === steps }, o || {}));
  // 직사각형과 가로·세로의 길이. size: 긴 변을 그리는 길이(px)
  function rectFig(w, h, size) {
    const k = (size || 130) / Math.max(w, h), W = Math.round(w * k), H = Math.round(h * k), left = 54, top = 24;
    return '<svg class="mb-geo" viewBox="0 0 ' + (left + W + 12) + ' ' + (top + H + 8) + '" width="' + (left + W + 12) + '" role="img" aria-label="직사각형: 가로 ' + w + ' cm, 세로 ' + h + ' cm">'
      + '<rect class="mb-poly" x="' + left + '" y="' + top + '" width="' + W + '" height="' + H + '"/>'
      + '<text class="mb-label" style="font-size:13px" x="' + (left + W / 2) + '" y="' + (top - 8) + '" text-anchor="middle">' + w + ' cm</text>'
      + '<text class="mb-label" style="font-size:13px" x="' + (left - 6) + '" y="' + (top + H / 2 + 4) + '" text-anchor="end">' + h + ' cm</text></svg>';
  }
  // 맞물려 도는 톱니바퀴 두 개. 톱니 하나의 너비가 같게 반지름을 톱니 수에 맞추고, 톱니를 실제 수만큼 그린다.
  function gears(a, b) {
    const p = Math.min(8.5, 760 / (a + b)), ra = (a * p) / (2 * Math.PI), rb = (b * p) / (2 * Math.PI), t = 2.6, f = (v) => v.toFixed(1);
    const cy = 6 + t + Math.max(ra, rb), xa = 6 + t + ra, xb = xa + ra + rb, base = cy + Math.max(ra, rb) + t + 17;
    const wheel = (cx, n, r, start) => {
      const th = (2 * Math.PI) / n, at = (rad, ang) => f(cx + rad * Math.cos(ang)) + ' ' + f(cy + rad * Math.sin(ang));
      let path = '';
      for (let i = 0; i < n; i += 1) { const s = start + i * th; path += (i ? 'L' : 'M') + at(r - t, s) + 'L' + at(r + t, s + th * 0.14) + 'L' + at(r + t, s + th * 0.46) + 'L' + at(r - t, s + th * 0.6); }
      return '<path d="' + path + 'Z" style="fill:#e2e8f0;stroke:#1f2933;stroke-width:1.1;stroke-linejoin:round"/><circle cx="' + f(cx) + '" cy="' + f(cy) + '" r="' + f(Math.max(3, r * 0.14)) + '" style="fill:#fff;stroke:#1f2933;stroke-width:1.1"/>';
    };
    const label = (cx, mark, n) => '<text class="mb-label" style="font-size:12px" x="' + f(cx) + '" y="' + f(base) + '" text-anchor="middle">' + mark + ' ' + n + '개</text>';
    // 처음에 맞물린 두 톱니에 점을 찍는다.
    const dot = (x) => '<circle cx="' + f(x) + '" cy="' + f(cy) + '" r="2.2" style="fill:#dc2626"/>';
    return '<svg class="mb-geo" viewBox="0 0 ' + f(xb + rb + t + 6) + ' ' + f(base + 6) + '" width="' + f(xb + rb + t + 6) + '" role="img" aria-label="맞물려 도는 톱니바퀴 두 개: ㉮의 톱니 ' + a + '개, ㉯의 톱니 ' + b + '개">'
      + wheel(xa, a, ra, (-0.3 * 2 * Math.PI) / a) + wheel(xb, b, rb, Math.PI - (0.8 * 2 * Math.PI) / b) + dot(xa + ra - 7) + dot(xb - rb + 7) + label(xa, '㉮', a) + label(xb, '㉯', b) + '</svg>';
  }
  // 규칙에 따라 놓은 바둑돌 두 줄: 윗줄은 a 개마다, 아랫줄은 b 개마다 검은 돌. 처음 n 개만 그린다.
  function stoneRows(a, b, n) {
    const u = 15, left = 40;
    const row = (k, y, label) => '<text class="mb-label" style="font-size:12px" x="2" y="' + (y + 4) + '">' + label + '</text>'
      + range(n, 1).map((i) => '<circle cx="' + (left + (i - 0.5) * u) + '" cy="' + y + '" r="5.6" style="fill:' + (i % k === 0 ? '#374151' : '#fff') + ';stroke:#1f2933;stroke-width:1.1"/>').join('')
      + '<text class="mb-label" style="font-size:12px" x="' + (left + n * u + 3) + '" y="' + (y + 4) + '">…</text>';
    return '<svg class="mb-geo" viewBox="0 0 ' + (left + n * u + 18) + ' 54" width="' + (left + n * u + 18) + '" role="img" aria-label="바둑돌 두 줄의 처음 ' + n + '개: 윗줄은 ' + a + '개마다 검은 돌, 아랫줄은 ' + b + '개마다 검은 돌, 나머지는 흰 돌">' + row(a, 15, '윗줄') + row(b, 40, '아랫줄') + '</svg>';
  }

  // ── 공배수와 최소공배수 ──────────────────────────────────────
  B.addTypes(U, 'cm', [
    T('cm-word', '최대공약수와 최소공배수의 뜻', '①3 ③36', (d) => {
      // 틀린 보기: 「최대」「최소」를 뒤바꾼 것, 둘 다 가장 큰 수(작은 수)라고 여긴 것
      const rows = d.shuffle([['큰, 작은', true], ['작은, 큰', false], ['큰, 큰', false], ['작은, 작은', false]]);
      return CT('㉠, ㉡에 알맞은 말을 차례로 쓴 것은?', rows, true, {
        figure: lines([`두 수의 공약수 중 가장 ${box(LABELS[0])} 수 → 최대공약수`, `두 수의 공배수 중 가장 ${box(LABELS[1])} 수 → 최소공배수`]),
        explain: '공약수 중 가장 큰 수가 최대공약수이고, 공배수 중 가장 작은 수가 최소공배수이다. 공배수는 끝없이 있으므로 가장 큰 공배수는 없다.'
      });
    }),
    T('cm-lists', '배수를 늘어놓아 공배수와 최소공배수 찾기', '①59·60 ②64·65 ③57·58·66 심52', (d) => {
      const [a, b] = d.pick([[4, 6], [6, 8], [6, 9], [8, 12], [4, 10], [6, 10], [9, 12], [6, 15], [10, 15], [8, 20]]), L = lcm(a, b), list = (k) => range((2 * L) / k, 1).map((m) => k * m).join(', ') + ', …';
      return M(`두 수의 배수를 보고 ${josa(a, '과/와')} ${b}의 최소공배수와 둘째로 작은 공배수를 구하시오.`, [{ label: '최소공배수', answer: L }, { label: '둘째로 작은 공배수', answer: 2 * L }], {
        figure: notes([`${a}의 배수: ${list(a)}`, `${b}의 배수: ${list(b)}`]), explain: `두 줄에 모두 있는 수는 ${L}, ${2 * L}이다. 공배수 중 가장 작은 수 ${josa(L, '이/가')} 최소공배수이다.`, facts: { calc: [[`${L}`, 0], [`${L}+${L}`, 1]] }
      });
    }),
    T('cm-first3', '공배수를 작은 수부터 쓰기', '①60 ②66 ③58 심52', (d) => {
      const [a, b] = swap(d, pairOf(d, 'general', { max: 30, maxL: 120 })), g = gcd(a, b), L = lcm(a, b);
      return M(`${a}의 배수도 되고 ${b}의 배수도 되는 수를 가장 작은 수부터 차례로 3개 쓰시오.`, [0, 1, 2].map((i) => ({ label: ORD[i], answer: L * (i + 1) })), {
        explain: `${josa(a, '과/와')} ${b}의 최소공배수는 ${L}이다. 공배수는 ${L}의 배수이므로 ${L}, ${2 * L}, ${3 * L}이다.`, facts: { calc: [[lcmExpr(a, b), 0], [lcmExpr(a, b) + '*2', 1], [lcmExpr(a, b) + '*3', 2]], unseen: [g, 2] }
      });
    }),
    T('cm-not', '공배수가 아닌 것 고르기', '①61 ②67 ③59 심53', (d) => {
      // 틀린 수: 두 수 가운데 한 수만의 배수
      const [a, b] = pairOf(d, 'general', { max: 20, maxL: 60 }), L = lcm(a, b), one = d.pick([a, b]), bad = L * d.int(1, 3) + one;
      const rows = d.shuffle(d.shuffle([1, 2, 3, 4, 5]).slice(0, 4).map((m) => L * m).concat([bad]).map((x) => [String(x), x % a === 0 && x % b === 0]));
      return CT(`${josa(a, '과/와')} ${b}의 공배수가 아닌 것은?`, rows, false, { explain: `${josa(bad, '은/는')} ${one}의 배수이지만 ${one === a ? b : a}의 배수는 아니다. ${josa(a, '과/와')} ${b}의 공배수는 최소공배수 ${L}의 배수이다.` });
    }),
    T('cm-among-count', '수 가운데 공배수의 개수', '①61 ②67 ③59 심53', (d) => {
      const [a, b] = d.pick([[2, 5], [3, 4], [4, 6], [6, 8], [3, 5], [4, 10], [6, 9], [2, 7], [5, 6]]), L = lcm(a, b), upto = range(120, 1);
      const yes = d.shuffle(upto.filter((x) => x % L === 0)).slice(0, d.int(2, 3)), onlyA = d.shuffle(upto.filter((x) => x > 9 && x % a === 0 && x % b !== 0)).slice(0, 2), onlyB = d.shuffle(upto.filter((x) => x > 9 && x % b === 0 && x % a !== 0)).slice(0, 2);
      const none = d.shuffle(upto.filter((x) => x > 9 && x % a !== 0 && x % b !== 0)).slice(0, 4 - yes.length), shown = d.shuffle(yes.concat(onlyA, onlyB, none));
      return N(`다음 수 가운데 ${a}의 배수이면서 ${b}의 배수인 수는 모두 몇 개인가?`, yes.length, {
        unit: '개', figure: numbers(shown), explain: `${josa(a, '과/와')} ${b}의 공배수는 최소공배수 ${L}의 배수이다. 이 가운데 ${L}의 배수는 ${asc(yes).join(', ')}이다.`, facts: { count: shown.map((x) => x % a === 0 && x % b === 0) }
      });
    }),
    T('cm-grid', '수 배열표에서 공배수 찾기', '①18·62 심13', (d) => {
      const [a, b] = d.pick([[4, 6], [3, 4], [6, 8], [4, 10], [6, 9], [3, 5], [2, 9], [4, 5], [3, 8], [2, 5]]), cells = range(35, d.pick([1, 11, 21])), marked = cells.filter((x) => x % a === 0), hits = marked.filter((x) => x % b === 0);
      return N(`수 배열표에서 ${a}의 배수를 모두 색칠하였다. 색칠한 수 가운데 ${b}의 배수는 모두 몇 개인가?`, hits.length, {
        unit: '개', figure: numGrid(cells, 7, (x) => x % a === 0), explain: `색칠한 수 가운데 ${b}의 배수는 ${hits.join(', ')}이다. 이 수들은 ${josa(a, '과/와')} ${b}의 공배수이다.`, facts: { count: marked.map((x) => x % b === 0) }
      });
    }),
    T('cm-count-upto', '몇까지의 수 가운데 공배수의 수', '①62 ②69 ③61 심62', (d) => {
      const [a, b, top] = d.until(() => pairOf(d, 'general', { max: 20, maxL: 40 }).concat([d.pick([50, 100, 150, 200])]), ([x, y, t]) => Math.floor(t / lcm(x, y)) >= 2), g = gcd(a, b), L = lcm(a, b), q = Math.floor(top / L);
      return N(`1부터 ${top}까지의 자연수 중 ${josa(a, '과/와')} ${b}의 공배수는 모두 몇 개인가?`, q, {
        unit: '개', explain: `${josa(a, '과/와')} ${b}의 최소공배수는 ${L}이고, 공배수는 ${L}의 배수이다. ${top} ÷ ${L} = ${q}${rest(top, L)}이므로 ${q}개이다.`, facts: { calc: [[`(${top}-${top}%(${lcmExpr(a, b)}))/(${lcmExpr(a, b)})`, 0]], unseen: [g] }
      });
    }),
    T('cm-in-range', '범위에 드는 공배수', '①62 ②69 ③62 심61', (d) => {
      // 최소공배수가 10보다 크면 십의 자리가 같은 수 가운데 공배수는 하나뿐이다.
      const [a, b, m] = d.until(() => pairOf(d, 'general', { max: 24, maxL: 48 }).concat([d.int(2, 5)]), ([x, y, k]) => lcm(x, y) >= 12 && (lcm(x, y) * k) % 10 !== 0 && lcm(x, y) * k <= 200);
      const g = gcd(a, b), L = lcm(a, b), x = L * m, lo = Math.floor(x / 10) * 10, hi = lo + 10;
      return N(`${josa(a, '과/와')} ${b}의 공배수 중 ${lo}보다 크고 ${hi}보다 작은 수는?`, x, {
        explain: `최소공배수는 ${L}이고, 공배수는 ${L}의 배수 ${L}, ${2 * L}, ${3 * L}, …이다. 이 중 ${lo}보다 크고 ${hi}보다 작은 수는 ${L} × ${m} = ${x}이다.`, facts: { calc: [[lcmExpr(a, b) + '*' + m, 0]], unseen: [g, m] }
      });
    }),
    T('cm-both-min', '두 수로 모두 나누어떨어지는 가장 작은 수', '①63 ②68 ③60 심58', (d) => {
      const [a, b] = swap(d, pairOf(d, 'general', { max: 30, maxL: 200 })), g = gcd(a, b), L = lcm(a, b);
      return N(`${josa(a, '으로/로')} 나누어도 ${josa(b, '으로/로')} 나누어도 나누어떨어지는 수 중 가장 작은 수는?`, L, {
        explain: `구하는 수는 ${josa(a, '과/와')} ${b}의 공배수 중 가장 작은 수이다. ${a} = ${g} × ${a / g}, ${b} = ${g} × ${b / g}이므로 최소공배수는 ${g} × ${a / g} × ${b / g} = ${L}이다.`, facts: { calc: [[lcmExpr(a, b), 0]], unseen: [g] }
      });
    }),
    T('cm-same-as', '공배수는 어떤 수의 배수와 같은가', '①71 ②79·83 ③67', (d) => {
      const [a, b] = swap(d, pairOf(d, 'general', { max: 30, maxL: 200 })), g = gcd(a, b), L = lcm(a, b);
      return N(`${josa(a, '과/와')} ${b}의 공배수는 □의 배수와 같다. □ 안에 알맞은 수는?`, L, {
        explain: `${josa(a, '과/와')} ${b}의 공배수는 ${L}, ${2 * L}, ${3 * L}, …이다. 이 수들은 최소공배수 ${L}의 배수와 같다.`, facts: { calc: [[lcmExpr(a, b), 0]], unseen: [g] }
      });
    }),
    T('cm-l-nth', '최소공배수를 알 때 몇째 공배수', '①72 ②80·81 ③63 심59', (d) => {
      const L = d.pick([12, 14, 15, 16, 18, 21, 24, 28, 35, 36]), k = d.int(4, 8);
      return N(`어떤 두 수의 최소공배수가 ${L}이다. 두 수의 공배수 중 ${ORD[k - 1]}로 작은 수는?`, L * k, { explain: `두 수의 공배수는 최소공배수 ${L}의 배수와 같다. ${ORD[k - 1]}로 작은 수는 ${L} × ${k} = ${L * k}이다.`, facts: { calc: [[`${L}*${k}`, 0]], unseen: [k] } });
    }),
    T('cm-l-not', '최소공배수를 알 때 공배수가 아닌 것', '②82 ③64 심59', (d) => {
      // 틀린 수: 최소공배수의 약수(공약수와 섞은 것), 배수에서 조금 어긋난 수
      const L = d.pick([12, 14, 15, 16, 18, 24, 26]), bad = d.bool() ? d.pick(divs(L).filter((k) => k > 2 && k < L)) : L * d.int(2, 5) + d.pick([2, 4, 6]);
      const rows = d.shuffle([L].concat(d.shuffle([2, 3, 4, 5, 6]).slice(0, 3).map((m) => L * m), [bad]).map((x) => [String(x), x % L === 0]));
      return CT(`어떤 두 수의 최소공배수가 ${L}이다. 두 수의 공배수가 아닌 것은?`, rows, false, { explain: `두 수의 공배수는 최소공배수 ${L}의 배수이다. ${josa(bad, '은/는')} ${L}의 배수가 아니다.` });
    }),
    T('cm-l-nearest', '최소공배수를 알 때 어떤 수에 가장 가까운 공배수', '①72 ②70 ③65 심60', (d) => {
      const [L, t] = d.until(() => [d.pick([12, 14, 16, 18, 21, 24, 26, 28, 32, 35, 36]), d.pick([100, 150, 200])], ([x, y]) => y % x !== 0 && (y % x) * 2 !== x);
      const low = t - (t % L), ans = (t % L) * 2 < L ? low : low + L;
      return N(`어떤 두 수의 최소공배수가 ${L}이다. 두 수의 공배수 중 ${t}에 가장 가까운 수는?`, ans, {
        explain: `공배수는 ${L}의 배수이다. ${t}보다 작은 공배수 중 가장 큰 수는 ${low}, ${t}보다 큰 공배수 중 가장 작은 수는 ${low + L}이다. ${t} − ${low} = ${t - low}, ${low + L} − ${t} = ${low + L - t}이므로 ${josa(ans, '이/가')} 더 가깝다.`,
        facts: { calc: [[ans === low ? `${t}-${t}%${L}` : `${t}-${t}%${L}+${L}`, 0]] }
      });
    }),
    T('cm-say', '공배수에 대한 설명', '①73 ②79 ③68', (d) => {
      // 틀린 말: 가장 작은 공배수를 두 수의 곱이라고 한 것, 공배수에 끝이 있다고 여긴 것, 공배수를 최대공약수의 배수와 같다고 한 것
      const [a, b] = d.pick([[20, 30], [6, 8], [8, 12], [10, 15], [12, 18], [6, 9], [4, 6], [9, 12]]), g = gcd(a, b), L = lcm(a, b), m = d.int(2, 4), slip = d.pick(['product', 'end', 'same']);
      const many = ['공배수는 셀 수 없이 많다.', true], member = [`${josa(L * m, '은/는')} 공배수이다.`, true], least = [`공배수 중 가장 작은 수는 ${L}이다.`, true], same = [`공배수는 ${L}의 배수와 같다.`, true];
      const rows = d.shuffle({
        product: [many, member, same, [`공배수 중 가장 작은 수는 ${a * b}이다.`, false]],
        end: [least, member, same, [`공배수 중 가장 큰 수는 ${a * b}이다.`, false]],
        same: [many, member, least, [`공배수는 ${g}의 배수와 같다.`, false]]
      }[slip]);
      const why = { product: `${josa(a * b, '은/는')} 공배수이지만 가장 작은 공배수는 ${L}이다.`, end: `공배수는 ${L}, ${2 * L}, ${3 * L}, …으로 끝없이 있으므로 가장 큰 공배수는 없다.`, same: `공배수는 최소공배수 ${L}의 배수와 같다. ${josa(g, '은/는')} 두 수의 최대공약수이다.` }[slip];
      return CT(`${josa(a, '과/와')} ${b}의 공배수에 대한 설명으로 옳지 않은 것은?`, rows, false, { explain: why });
    })
  ]);

  // ── 최소공배수 구하는 방법 ───────────────────────────────────
  const lcmItem = (kind) => (d) => {
    const [a, b] = swap(d, pairOf(d, kind, kind === 'general' ? { max: 72 } : {})), g = gcd(a, b), L = lcm(a, b), small = Math.min(a, b), big = Math.max(a, b);
    const why = {
      general: `${a} = ${g} × ${a / g}, ${b} = ${g} × ${b / g}이므로 최소공배수는 ${g} × ${a / g} × ${b / g} = ${L}이다.`,
      nested: `${big} = ${small} × ${big / small}이므로 ${josa(big, '은/는')} ${small}의 배수이다. 두 수의 최소공배수는 큰 수 ${big}이다.`,
      coprime: `${josa(a, '과/와')} ${b}의 공약수는 1뿐이므로 최소공배수는 두 수의 곱 ${a} × ${b} = ${L}이다.`
    }[kind];
    return N(`${josa(a, '과/와')} ${b}의 최소공배수는?`, L, { explain: why, facts: { calc: [[lcmExpr(a, b), 0]], unseen: [g], rule: kind } });
  };
  B.addTypes(U, 'lw', [
    T('lw-two-products', '두 수의 곱으로 나타내어 최소공배수 구하기', '①65 ②71 ③69', (d) => {
      const [g, p, q] = d.until(() => [d.int(4, 12), d.int(2, 5), d.int(3, 7)], ([x, y, z]) => y < z && gcd(y, z) === 1 && x * z <= 96 && x * y * z <= 400), a = g * p, b = g * q;
      return N(`곱셈식을 보고 ${josa(a, '과/와')} ${b}의 최소공배수를 구하면?`, g * p * q, {
        figure: lines([`${a} = ${g} × ${p}`, `${b} = ${g} × ${q}`]), explain: `공통으로 들어 있는 ${g}에 남은 ${josa(p, '과/와')} ${josa(q, '을/를')} 곱한다. ${g} × ${p} × ${q} = ${g * p * q}`, facts: { calc: [[`${g}*${p}*${q}`, 0]] }
      });
    }),
    T('lw-ladder-read', '공약수로 나누는 셈을 보고 최소공배수 구하기', '①66 ②73·74 ③70 심54', (d) => {
      const [a, b] = ladderPair(d, d.pick([2, 3])), L = ladderOf(a, b), all = L.by.concat(L.last);
      return N(`${josa(a, '과/와')} ${b}의 최소공배수를 구하려고 두 수를 공약수로 나누었다. 최소공배수는?`, lcm(a, b), {
        figure: ladder(L.rows, L.last), explain: `나눈 공약수와 밑에 남은 두 수를 모두 곱한다. ${times(all)} = ${lcm(a, b)}`, facts: { calc: [[all.join('*'), 0]] }
      });
    }),
    T('lw-ladder-both', '공약수로 나누는 셈으로 최대공약수와 최소공배수 구하기', '①70 ②85 ③72·77', (d) => {
      const [a, b] = ladderPair(d, 2), L = ladderOf(a, b), [p1, p2] = L.by, [x, y] = L.last;
      return M('두 수를 공약수로 나누었다. □ 안에 알맞은 수를 찾아 두 수의 최대공약수와 최소공배수를 구하시오.', [{ label: '최대공약수', answer: p1 * p2 }, { label: '최소공배수', answer: lcm(a, b) }], {
        figure: ladder([[p1, a, b], [box(), a / p1, b / p1]], [x, y]), explain: `${a / p1} ÷ ${x} = ${p2}이므로 □는 ${p2}이다. 최대공약수는 ${p1} × ${p2} = ${p1 * p2}, 최소공배수는 ${p1} × ${p2} × ${x} × ${y} = ${lcm(a, b)}이다.`,
        facts: { calc: [[`${p1}*(${a / p1}/${x})`, 0], [`${p1}*(${a / p1}/${x})*${x}*${y}`, 1]] }
      });
    }),
    T('lw-ladder-short', '덜 나눈 셈 바로잡기(최소공배수)', '①69 ②78 ③74 심49', (d) => {
      // 공약수가 더 있는데 한 번만 나누고 곱한 셈. 그대로 곱하면 최소공배수보다 크다.
      const [a, b] = ladderPair(d, 2, { max: 60 }), L = ladderOf(a, b, 1), full = ladderOf(a, b), p1 = L.by[0], wrong = p1 * L.last[0] * L.last[1], all = full.by.concat(full.last);
      return N(`${josa(a, '과/와')} ${b}의 최소공배수를 구하려고 두 수를 공약수로 한 번 나누고 ${p1} × ${L.last[0]} × ${L.last[1]} = ${josa(wrong, '이라고/라고')} 하였다. 두 수의 최소공배수를 바르게 구하면?`, lcm(a, b), {
        figure: ladder(L.rows, L.last), explain: `밑에 남은 ${josa(L.last[0], '과/와')} ${josa(L.last[1], '은/는')} ${josa(full.by[1], '으로/로')} 더 나눌 수 있다. 끝까지 나눈 뒤 곱하면 ${times(all)} = ${lcm(a, b)}이다.`,
        facts: { calc: [[all.join('*'), 0]], unseen: all }
      });
    }),
    T('lw-ladder-expr', '공약수로 나누는 셈과 최소공배수를 구하는 식', '③72', (d) => {
      // 틀린 보기: 최대공약수만 쓴 것, 밑에 남은 수만 곱한 것, 처음 두 수를 다시 곱한 것
      const rows = d.shuffle([['㉠ × ㉡ × ㉢', true], ['㉠', false], ['㉡ × ㉢', false], ['㉠ × ● × ■', false]]);
      return CT('두 수 ●와 ■를 최대공약수 ㉠으로 나누었더니 몫이 ㉡, ㉢이었다. ●와 ■의 최소공배수를 구하는 식은?', rows, true, {
        figure: ladder([['㉠', '●', '■']], ['㉡', '㉢']), explain: '최소공배수는 나눈 수 ㉠과 밑에 남은 두 몫 ㉡, ㉢을 모두 곱한 수이다. ㉠은 최대공약수이다.'
      });
    }),
    T('lw-ladder-say', '공약수로 나누는 셈을 보고 한 설명', '심65 ③72', (d) => {
      // 틀린 말: 밑에 남은 수만 곱한 것을 최소공배수(최대공약수)라고 한 것, 두 수를 곱한 것을 최소공배수라고 한 것
      const [g, p, q] = d.until(() => [d.int(3, 9), d.int(2, 6), d.int(3, 7)], ([x, y, z]) => y < z && gcd(y, z) === 1 && y * z !== x), a = g * p, b = g * q, L = g * p * q, slip = d.pick(['drop', 'big', 'gcd']);
      const rows = d.shuffle([
        [`●에 알맞은 수는 ${a}이다.`, true],
        [`■에 알맞은 수는 ${b}이다.`, true],
        [`●와 ■의 최대공약수는 ${slip === 'gcd' ? p * q : g}이다.`, slip !== 'gcd'],
        [`●와 ■의 최소공배수는 ${slip === 'drop' ? p * q : slip === 'big' ? a * b : L}이다.`, slip === 'gcd']
      ]);
      return CT('두 수 ●와 ■를 공약수로 나누었더니 밑에 남은 두 수의 공약수가 1뿐이었다. 옳지 않은 것은?', rows, false, {
        figure: ladder([[g, '●', '■']], [p, q]), explain: `● = ${g} × ${p} = ${a}, ■ = ${g} × ${q} = ${b}이다. 최대공약수는 나눈 수 ${g}이고, 최소공배수는 ${g} × ${p} × ${q} = ${L}이다.`
      });
    }),
    T('lw-lcm-general', '두 수의 최소공배수', '①67 ②74·75 ③71', lcmItem('general')),
    T('lw-lcm-nested', '한쪽이 다른 쪽의 배수인 두 수의 최소공배수', '①67 ③58·71', lcmItem('nested')),
    T('lw-lcm-coprime', '공약수가 1뿐인 두 수의 최소공배수', '①67 ②75 ③71', lcmItem('coprime')),
    T('lw-compare', '최소공배수의 크기 비교', '①68 ②76·77·78 ③75·76 심57', (d) => {
      const want = d.pick(['>', '<', '>', '<', '=']), by = (p) => lcm(p[0], p[1]);
      const [P, Q] = d.until(() => [pairOf(d, d.pick(['general', 'general', 'nested']), { max: 40, maxL: 240 }), pairOf(d, 'general', { max: 40, maxL: 240 })], ([p, q]) => String(p) !== String(q) && (want === '=' ? by(p) === by(q) : want === '>' ? by(p) > by(q) : by(p) < by(q)));
      return C('㉠과 ㉡의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, ['>', '=', '<'].indexOf(want), {
        figure: tagged([`${josa(P[0], '과/와')} ${P[1]}의 최소공배수`, `${josa(Q[0], '과/와')} ${Q[1]}의 최소공배수`]) + versus('㉠', '㉡'), explain: `${josa(P[0], '과/와')} ${P[1]}의 최소공배수는 ${by(P)}이고, ${josa(Q[0], '과/와')} ${Q[1]}의 최소공배수는 ${by(Q)}이다.`,
        facts: { choose: { exprs: [lcmExpr(P[0], P[1]), lcmExpr(Q[0], Q[1])], rule: 'compare' }, unseen: [gcd(P[0], P[1]), gcd(Q[0], Q[1])] }
      });
    }),
    T('lw-both', '최대공약수와 최소공배수 함께 구하기', '①70 ②84 ③77 심56', (d) => {
      const [a, b] = swap(d, pairOf(d, 'general', { max: 72, gMin: 3 })), g = gcd(a, b), L = lcm(a, b);
      return M(`${josa(a, '과/와')} ${b}의 최대공약수와 최소공배수를 구하시오.`, [{ label: '최대공약수', answer: g }, { label: '최소공배수', answer: L }], {
        explain: `${a} = ${g} × ${a / g}, ${b} = ${g} × ${b / g}이다. 최대공약수는 ${g}, 최소공배수는 ${g} × ${a / g} × ${b / g} = ${L}이다.`, facts: { calc: [[`${a}/${a / g}`, 0], [`${a}*${b}/(${a}/${a / g})`, 1]], unseen: [a / g] }
      });
    }),
    T('lw-say', '두 수의 공약수와 공배수에 대한 설명', '②87', (d) => {
      // 틀린 말: 최소공배수를 두 수의 곱이라고 한 것, 한 수만의 약수를 공약수라고 한 것
      const [a, b] = swap(d, pairOf(d, 'general', { max: 40, ok: (x, y) => divs(gcd(x, y)).length >= 3 })), g = gcd(a, b), L = lcm(a, b), slip = d.pick(['lcm', 'cd']);
      const part = d.pick(divs(g).filter((k) => k > 1 && k < g)), lone = divs(a).filter((k) => k > 1 && b % k !== 0)[0];
      const rows = d.shuffle([
        [`두 수의 최대공약수는 ${g}이다.`, true],
        [`두 수의 최소공배수는 ${slip === 'lcm' ? a * b : L}이다.`, slip !== 'lcm'],
        [`${josa(slip === 'cd' ? lone : part, '은/는')} 두 수의 공약수이다.`, slip !== 'cd'],
        [`${josa(L * 2, '은/는')} 두 수의 공배수이다.`, true]
      ]);
      const why = slip === 'lcm' ? `${josa(a * b, '은/는')} 공배수이지만 가장 작은 공배수는 ${L}이다.` : `${josa(lone, '은/는')} ${a}의 약수이지만 ${b}의 약수는 아니다.`;
      return CT(`${josa(a, '과/와')} ${b}에 대한 설명으로 옳지 않은 것은?`, rows, false, { explain: `${josa(a, '과/와')} ${b}의 최대공약수는 ${g}, 최소공배수는 ${L}이다. ${why}` });
    })
  ]);

  // ── 최대공약수와 최소공배수의 활용 ───────────────────────────
  // 다음에 동시에 출발하는 시각: 한 시간 안에 다시 출발하는 것과, 분을 시간과 분으로 바꾸어야 하는 것
  const meetTime = (kind) => (d) => {
    const [a, b] = d.until(() => pairOf(d, 'general', { min: 6, max: 45, maxL: 180 }), ([x, y]) => (kind === 'within' ? lcm(x, y) < 60 : lcm(x, y) > 60 && lcm(x, y) % 60 !== 0));
    const g = gcd(a, b), L = lcm(a, b), h = d.int(6, 8), e = lcmExpr(a, b);
    return M(`${a}분마다 출발하는 버스와 ${b}분마다 출발하는 버스가 오전 ${h}시에 동시에 출발하였다. 다음에 처음으로 동시에 출발하는 시각은 오전 몇 시 몇 분인가?`, [{ lead: '오전', answer: h + Math.floor(L / 60), unit: '시' }, { answer: L % 60, unit: '분' }], {
      explain: `${josa(a, '과/와')} ${b}의 최소공배수는 ${L}이므로 ${L}분 뒤에 동시에 출발한다. ` + (L < 60 ? `오전 ${h}시 ${L}분이다.` : `${L}분은 ${Math.floor(L / 60)}시간 ${L % 60}분이므로 오전 ${h + Math.floor(L / 60)}시 ${L % 60}분이다.`),
      facts: { calc: [[`${h}+(${e}-${e}%60)/60`, 0], [`${e}%60`, 1]], unseen: [g, 60], rule: kind }
    });
  };
  B.addTypes(U, 'use', [
    T('us-share-max', '최대한 많은 사람에게 똑같이 나누어 주기', '①77 ②99 ③87 심74', (d) => {
      const [[t1, u1], [t2, u2]] = d.shuffle(THINGS).slice(0, 2), [a, b] = swap(d, pairOf(d, 'general', { gMin: 4, max: 90 })), g = gcd(a, b);
      return N(`${t1} ${a}${josa(u1, '과/와')} ${t2} ${b}${josa(u2, '을/를')} 최대한 많은 친구에게 남김없이 똑같이 나누어 주려고 한다. 최대 몇 명에게 나누어 줄 수 있는가?`, g, {
        unit: '명', explain: `친구 수는 ${josa(a, '과/와')} ${b}의 공약수이고, 가장 많은 친구 수는 최대공약수이다. ${a} = ${g} × ${a / g}, ${b} = ${g} × ${b / g}이므로 ${g}명이다.`, facts: { calc: [[`${a}/${a / g}`, 0], [`${b}/${b / g}`, 0]], unseen: [a / g, b / g] }
      });
    }),
    T('us-share-each', '똑같이 나누어 줄 때 한 사람이 받는 수', '①78 ②100 ③88 심75·76', (d) => {
      const [[t1, u1], [t2, u2]] = d.shuffle(THINGS).slice(0, 2), [a, b] = swap(d, pairOf(d, 'general', { gMin: 4, max: 90 })), g = gcd(a, b);
      return M(`${t1} ${a}${josa(u1, '과/와')} ${t2} ${b}${josa(u2, '을/를')} 최대한 많은 친구에게 남김없이 똑같이 나누어 주려고 한다. 한 명이 받는 ${t1}의 수와 ${t2}의 수는?`, [{ label: t1, answer: a / g, unit: u1 }, { label: t2, answer: b / g, unit: u2 }], {
        explain: `${josa(a, '과/와')} ${b}의 최대공약수가 ${g}이므로 ${g}명에게 나누어 줄 수 있다. 한 명이 ${t1} ${a} ÷ ${g} = ${a / g}(${u1}), ${t2} ${b} ÷ ${g} = ${b / g}(${u2})씩 받는다.`, facts: { calc: [[`${a}/${g}`, 0], [`${b}/${g}`, 1]], unseen: [g] }
      });
    }),
    T('us-share-can', '똑같이 나누어 줄 수 있는 사람 수', '①79 ②101', (d) => {
      // 틀린 수: 두 물건 가운데 한 가지만 똑같이 나눌 수 있는 사람 수
      const [[t1, u1], [t2, u2]] = d.shuffle(THINGS).slice(0, 2), [a, b] = swap(d, pairOf(d, 'general', { max: 90, ok: (x, y) => divs(gcd(x, y)).length >= 4 }));
      const lone = divs(a).filter((k) => b % k !== 0).concat(divs(b).filter((k) => a % k !== 0)).filter((k) => k < Math.min(a, b)), bad = d.pick(lone.length ? lone : [Math.max(a, b)]);
      const rows = d.shuffle(d.shuffle(divs(gcd(a, b)).filter((k) => k > 1)).slice(0, 3).concat([bad]).map((k) => [`${k}명`, a % k === 0 && b % k === 0]));
      const [n, t] = a % bad !== 0 ? [a, t1] : [b, t2];
      return CT(`${t1} ${a}${josa(u1, '과/와')} ${t2} ${b}${josa(u2, '을/를')} 남김없이 똑같이 나누어 줄 수 있는 친구 수가 아닌 것은?`, rows, false, {
        explain: `${josa(bad, '은/는')} ${n}의 약수가 아니므로 ${bad}명에게는 ${josa(t, '을/를')} 남김없이 똑같이 나누어 줄 수 없다. 친구 수는 ${josa(a, '과/와')} ${b}의 공약수여야 한다.`
      });
    }),
    T('us-square-side', '직사각형을 가장 큰 정사각형으로 자르기', '①80 ②102 ③91 심77', (d) => {
      const [w, h] = swap(d, pairOf(d, 'general', { gMin: 4, min: 12 })), g = gcd(w, h);
      return N(`가로 ${w} cm, 세로 ${h} cm인 직사각형 모양의 종이를 남는 부분 없이 크기가 같은 정사각형 모양으로 자르려고 한다. 가장 큰 정사각형의 한 변의 길이는 몇 cm인가?`, g, {
        unit: 'cm', figure: rectFig(w, h), explain: `정사각형의 한 변의 길이는 ${josa(w, '과/와')} ${h}의 공약수이다. 가장 큰 정사각형의 한 변의 길이는 최대공약수인 ${g} cm이다.`, facts: { calc: [[`${w}/${w / g}`, 0], [`${h}/${h / g}`, 0]], unseen: [w / g, h / g] }
      });
    }),
    T('us-rods', '두 끈을 같은 길이로 가장 길게 자르기', '②103 ③89', (d) => {
      const [a, b] = swap(d, pairOf(d, 'general', { gMin: 4, min: 12 })), g = gcd(a, b);
      return N(`길이가 ${a} cm, ${b} cm인 두 끈을 남김없이 같은 길이로 자르려고 한다. 한 도막을 가장 길게 자를 때 한 도막의 길이는 몇 cm인가?`, g, {
        unit: 'cm', explain: `한 도막의 길이는 ${josa(a, '과/와')} ${b}의 공약수이다. 가장 긴 한 도막의 길이는 최대공약수인 ${g} cm이다.`, facts: { calc: [[`${a}/${a / g}`, 0], [`${b}/${b / g}`, 0]], unseen: [a / g, b / g] }
      });
    }),
    T('us-meet-after', '다음에 함께 하는 날', '①82 ②104·110 ③92 심80', (d) => {
      const [n1, n2] = d.shuffle(NAMES).slice(0, 2), [a, b] = swap(d, pairOf(d, 'general', { max: 15, maxL: 60 })), g = gcd(a, b), L = lcm(a, b);
      return N(`${name(n1, '은/는')} ${a}일마다, ${name(n2, '은/는')} ${b}일마다 도서관에 간다. 오늘 두 사람이 도서관에서 만났다면 다음에 처음으로 다시 만나는 날은 며칠 뒤인가?`, L, {
        unit: '일 뒤', explain: `두 사람이 함께 가는 날은 ${josa(a, '과/와')} ${b}의 공배수만큼 지난 날이다. 처음으로 다시 만나는 날은 최소공배수인 ${L}일 뒤이다.`, facts: { calc: [[lcmExpr(a, b), 0]], unseen: [g] }
      });
    }, { standard: MUL }),
    T('us-meet-date', '다시 겹치는 날짜', '①83 ②105 심81', (d) => {
      const [a, b] = swap(d, pairOf(d, 'general', { max: 12, maxL: 24 })), g = gcd(a, b), L = lcm(a, b), month = d.pick([3, 5, 7, 8, 10]), s = d.int(1, 5);
      return N(`두 가게가 있다. 한 가게는 ${a}일마다, 다른 가게는 ${b}일마다 하루씩 쉰다. ${month}월 ${s}일에 두 가게가 함께 쉬었다면 다음에 처음으로 함께 쉬는 날은 ${month}월 며칠인가?`, s + L, {
        lead: `${month}월`, unit: '일', explain: `${josa(a, '과/와')} ${b}의 최소공배수가 ${L}이므로 ${L}일 뒤에 함께 쉰다. ${s} + ${L} = ${s + L}(일)`, facts: { calc: [[`${s}+${lcmExpr(a, b)}`, 0]], unseen: [g] }
      });
    }, { standard: MUL }),
    T('us-meet-time-within', '동시에 출발하는 시각(한 시간 안)', '①84 ②105 ③92 심83', meetTime('within'), { standard: MUL }),
    T('us-meet-time-over', '동시에 출발하는 시각(시간과 분으로 바꾸기)', '①84 ②105 심83', meetTime('over'), { standard: MUL }),
    T('us-tile-side', '직사각형을 늘어놓아 가장 작은 정사각형 만들기', '①86 ②107 심86', (d) => {
      const [w, h] = swap(d, pairOf(d, 'general', { min: 6, max: 30, maxL: 200 })), g = gcd(w, h), L = lcm(w, h);
      return N(`가로 ${w} cm, 세로 ${h} cm인 직사각형 모양의 타일을 같은 방향으로 빈틈없이 늘어놓아 정사각형을 만들려고 한다. 가장 작은 정사각형의 한 변의 길이는 몇 cm인가?`, L, {
        unit: 'cm', figure: rectFig(w, h, 70), explain: `정사각형의 한 변의 길이는 ${josa(w, '과/와')} ${h}의 공배수이다. 가장 작은 정사각형의 한 변의 길이는 최소공배수인 ${L} cm이다.`, facts: { calc: [[lcmExpr(w, h), 0]], unseen: [g] }
      });
    }, { standard: MUL }),
    T('us-points', '간격이 다른 두 점이 처음으로 겹치는 곳', '②108 ③95 심88', (d) => {
      const [a, b] = swap(d, pairOf(d, 'general', { min: 6, max: 30, maxL: 200 })), g = gcd(a, b), L = lcm(a, b);
      return N(`긴 종이띠에 시작점부터 빨간 점은 ${a} cm 간격으로, 파란 점은 ${b} cm 간격으로 찍는다. 시작점을 빼고 두 점이 처음으로 같은 곳에 찍히는 곳은 시작점에서 몇 cm 떨어져 있는가?`, L, {
        unit: 'cm', explain: `빨간 점은 시작점에서 ${a}의 배수만큼, 파란 점은 ${b}의 배수만큼 떨어진 곳에 찍힌다. 처음으로 같이 찍히는 곳은 최소공배수인 ${L} cm 떨어진 곳이다.`, facts: { calc: [[lcmExpr(a, b), 0]], unseen: [g] }
      });
    }, { standard: MUL }),
    T('us-pack-both', '두 가지로 묶어도 남지 않는 물건의 수', '②111 심61', (d) => {
      // 최소공배수는 조건에 맞고 그 두 배는 넘는 범위를 준다.
      const thing = d.pick(['귤', '구슬', '사탕', '딱지']), [a, b, top] = d.until(() => pairOf(d, 'general', { min: 6, max: 30, maxL: 96 }).concat([d.pick([50, 80, 100])]), ([x, y, t]) => lcm(x, y) >= 24 && lcm(x, y) < t && 2 * lcm(x, y) > t);
      const g = gcd(a, b), L = lcm(a, b);
      return N(`${josa(thing, '을/를')} 한 봉지에 ${a}개씩 담아도, ${b}개씩 담아도 남는 것이 없다. ${thing}의 수가 ${top}개보다 적을 때 ${josa(thing, '은/는')} 모두 몇 개인가?`, L, {
        unit: '개', explain: `${thing}의 수는 ${josa(a, '과/와')} ${b}의 공배수이다. 최소공배수는 ${L}이고, 그다음 공배수 ${josa(2 * L, '은/는')} ${top}보다 크므로 ${L}개이다.`, facts: { calc: [[lcmExpr(a, b), 0]], unseen: [g] }
      });
    }, { standard: MUL })
  ]);

  // ── 실력 문제 ────────────────────────────────────────────────
  B.addGroup(U, {
    id: 'hard', title: '실력 문제', standard: DIV,
    types: [
      H('hd-lcm-is-product', '최소공배수가 두 수의 곱과 같은 것', '56·57', (d) => {
        // 공약수가 1뿐인 쌍, 한쪽이 다른 쪽의 배수인 쌍, 그 밖의 쌍을 섞어 놓는다. 최소공배수는 언제나 두 수의 곱이라고 여기면 넷 다 고른다.
        const kinds = d.shuffle(d.pick([['coprime', 'nested', 'general', 'coprime'], ['coprime', 'nested', 'general', 'general'], ['coprime', 'coprime', 'nested', 'general']]));
        const pairs = d.until(() => kinds.map((kind) => pairOf(d, kind, { max: 40, maxL: 300 })), (ps) => new Set(ps.map(String)).size === 4);
        return N('두 수의 최소공배수가 두 수의 곱과 같은 것은 모두 몇 개인가?', pairs.filter(([a, b]) => gcd(a, b) === 1).length, {
          unit: '개', figure: tagged(pairs.map(([a, b]) => `${a}, ${b}`)), explain: '공약수가 1뿐인 두 수만 최소공배수가 두 수의 곱과 같다. 최소공배수는 ' + pairs.map(([a, b], i) => `${LABELS[i]} ${lcm(a, b)}`).join(', ') + '이다.',
          facts: { count: pairs.map(([a, b]) => gcd(a, b) === 1) }
        });
      }, { standard: MUL }),
      H('hd-self-gcd', '가장 큰 약수와 가장 작은 배수', '47', (d) => {
        // 가장 큰 약수도, 가장 작은 배수도 그 수 자신이다.
        const [a, b] = swap(d, pairOf(d, 'general', { gMin: 3 })), g = gcd(a, b);
        return N(`${a}의 약수 중 가장 큰 수와 ${b}의 배수 중 가장 작은 수의 최대공약수는?`, g, {
          explain: `${a}의 약수 중 가장 큰 수는 ${a}이고, ${b}의 배수 중 가장 작은 수는 ${b}이다. ${josa(a, '과/와')} ${b}의 최대공약수는 ${g}이다.`, facts: { calc: [[`${a}/${a / g}`, 0], [`${b}/${b / g}`, 0]], unseen: [a / g, b / g] }
        });
      }),
      H('hd-with-range', '범위 안에서 약수와 배수의 관계인 수', '24', (d) => {
        // 약수 쪽과 배수 쪽을 모두 세되, 그 수 자신은 한 번만 센다.
        const n = d.pick([12, 15, 16, 18, 20]), top = d.pick([50, 60, 70, 80]), list = divs(n), mults = range(top - 1, 1).filter((x) => x % n === 0), all = range(top - 1, 1).map((x) => x % n === 0 || n % x === 0);
        return N(`${top}보다 작은 자연수 중 ${josa(n, '과/와')} 약수와 배수의 관계인 수는 모두 몇 개인가?`, list.length + mults.length - 1, {
          unit: '개', explain: `${n}의 약수는 ${list.join(', ')}의 ${list.length}개이고, ${top}보다 작은 ${n}의 배수는 ${mults.join(', ')}의 ${mults.length}개이다. ${josa(n, '은/는')} 두 번 세었으므로 ${list.length} + ${mults.length} − 1 = ${list.length + mults.length - 1}(개)이다.`,
          facts: { count: all }
        });
      }),
      H('hd-div-not-div', '한 수의 약수이지만 다른 수의 약수는 아닌 수', '31', (d) => {
        const [a, b] = swap(d, pairOf(d, 'general', { max: 72, ok: (x, y) => divs(x).length >= 6 && divs(y).length >= 6 })), list = divs(a), hits = list.filter((k) => b % k !== 0);
        return N(`${a}의 약수 중 ${b}의 약수가 아닌 수는 모두 몇 개인가?`, hits.length, {
          unit: '개', explain: `${a}의 약수는 ${list.join(', ')}이다. 이 중 ${b}의 약수가 아닌 수는 ${hits.join(', ')}이다. ${a}의 약수 ${list.length}개에서 두 수의 공약수 ${list.length - hits.length}개를 뺀 것과 같다.`, facts: { count: list.map((k) => b % k !== 0) }
        });
      }),
      H('hd-div-mul-range', '약수이면서 배수이고 범위에 드는 수', '32·33', (d) => {
        const pool = range(73, 24).filter((v) => divs(v).length >= 8), inside = (p, q) => range(q - p - 1, p + 1);
        const [n, k, lo, hi] = d.until(() => { const lo = d.pick([10, 20, 30]); return [d.pick(pool), d.pick([3, 4, 6, 8, 9]), lo, lo + d.pick([10, 20])]; },
          ([v, x, p, q]) => { const m = inside(p, q).filter((t) => t % x === 0); return m.length >= 2 && m.filter((t) => v % t === 0).length === 1 && inside(p, q).filter((t) => v % t === 0).length >= 2; });
        const mults = inside(lo, hi).filter((t) => t % k === 0), x = mults.find((t) => n % t === 0);
        return N(`${lo}보다 크고 ${hi}보다 작은 수 중 ${k}의 배수이면서 ${n}의 약수인 수는?`, x, {
          explain: `${lo}보다 크고 ${hi}보다 작은 ${k}의 배수는 ${mults.join(', ')}이다. 이 중 ${n}의 약수는 ${x}이다.`, facts: { calc: [[`${n}/${n / x}`, 0]], unseen: [n / x] }
        });
      }),
      H('hd-common-most', '공약수가 가장 많은 두 수', '44', (d) => {
        // 최대공약수가 가장 큰 쌍이 공약수도 가장 많은 것은 아니다(최대공약수 13의 약수는 2개, 12의 약수는 6개).
        const make = (g) => d.until(() => [g * d.int(1, 4), g * d.int(2, 5)], ([x, y]) => x < y && y <= 96 && gcd(x, y) === g);
        const pairs = d.shuffle([make(d.pick([13, 17, 19, 23])), make(d.pick([6, 8, 10, 12])), make(d.pick([4, 9]))]), gs = pairs.map(([a, b]) => gcd(a, b)), counts = gs.map((g) => divs(g).length);
        return C('두 수의 공약수의 개수가 가장 많은 것은?', pairs.map(([a, b]) => `(${a}, ${b})`), counts.indexOf(Math.max(...counts)), {
          explain: '공약수의 개수는 최대공약수의 약수의 개수와 같다. ' + pairs.map(([a, b], i) => `(${a}, ${b})의 최대공약수는 ${gs[i]}이고 공약수는 ${counts[i]}개`).join(', ') + '이다.', facts: { rank: { values: counts, nth: 1 } }
        });
      }),
      H('hd-common-cond', '공약수 가운데 조건에 맞는 수', '45', (d) => {
        const [a, b, k] = d.until(() => swap(d, pairOf(d, 'general', { gMin: 9 })).concat([d.pick([2, 3, 4, 5, 6])]), ([x, y, m]) => { const c = divs(gcd(x, y)).filter((v) => v % m === 0).length; return c >= 2 && c <= 4; });
        const g = gcd(a, b), list = divs(g), hits = list.filter((v) => v % k === 0);
        return N(`${josa(a, '과/와')} ${b}의 공약수 중 ${k}의 배수는 모두 몇 개인가?`, hits.length, {
          unit: '개', explain: `${josa(a, '과/와')} ${b}의 최대공약수가 ${g}이므로 공약수는 ${list.join(', ')}이다. 이 중 ${k}의 배수는 ${hits.join(', ')}이다.`, facts: { count: list.map((v) => v % k === 0) }
        });
      }),
      H('hd-cards-gcd', '수 카드로 만든 두 수의 최대공약수', '48', (d) => {
        const c = d.until(() => asc(d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4)), (x) => { const big = x[3] * 10 + x[2], small = x[0] * 10 + x[1]; return gcd(big, small) >= 3 && big % small !== 0; });
        const big = c[3] * 10 + c[2], small = c[0] * 10 + c[1], g = gcd(big, small);
        return N('수 카드 4장 가운데 2장을 골라 한 번씩만 사용하여 두 자리 수를 만들려고 한다. 만들 수 있는 가장 큰 수와 가장 작은 수의 최대공약수는?', g, {
          figure: cards(d.shuffle(c)), explain: `가장 큰 수는 ${big}, 가장 작은 수는 ${small}이다. ${big} = ${g} × ${big / g}, ${small} = ${g} × ${small / g}이므로 최대공약수는 ${g}이다.`,
          facts: { calc: [[`${big}/${big / g}`, 0], [`${small}/${small / g}`, 0]], unseen: [big, small, big / g, small / g] }
        });
      }),
      H('hd-rem-gcd', '두 수를 나누면 나머지가 같은 수', '70·71', (d) => {
        // 어떤 수는 나머지를 뺀 두 수의 공약수 가운데 나머지보다 큰 수이다.
        const [x, y] = swap(d, pairOf(d, 'general', { gMin: 6, max: 90 })), g = gcd(x, y), r = d.int(2, Math.min(5, g - 1)), a = x + r, b = y + r;
        return N(`어떤 수로 ${josa(a, '과/와')} ${josa(b, '을/를')} 나누면 나머지가 모두 ${r}이다. 어떤 수 중 가장 큰 수는?`, g, {
          explain: `${a} − ${r} = ${x}, ${b} − ${r} = ${josa(y, '은/는')} 어떤 수로 나누어떨어진다. 어떤 수는 ${josa(x, '과/와')} ${y}의 공약수 중 나머지 ${r}보다 큰 수이고, 가장 큰 수는 최대공약수 ${g}이다.`,
          facts: { calc: [[`(${a}-${r})/${x / g}`, 0], [`(${b}-${r})/${y / g}`, 0]], unseen: [x / g, y / g] }
        });
      }),
      H('hd-square-count', '가장 큰 정사각형으로 자른 조각의 수', '78', (d) => {
        const [w, h] = swap(d, pairOf(d, 'general', { gMin: 6, min: 12, ok: (x, y) => (x * y) / (gcd(x, y) * gcd(x, y)) <= 48 })), g = gcd(w, h), n = (w / g) * (h / g);
        return N(`가로 ${w} cm, 세로 ${h} cm인 직사각형 모양의 종이를 남는 부분 없이 크기가 같은 가장 큰 정사각형 모양으로 잘랐다. 정사각형 모양의 종이는 모두 몇 장인가?`, n, {
          unit: '장', figure: rectFig(w, h), explain: `정사각형의 한 변의 길이는 최대공약수인 ${g} cm이다. 가로로 ${w} ÷ ${g} = ${w / g}(장), 세로로 ${h} ÷ ${g} = ${h / g}(장)씩 놓이므로 ${w / g} × ${h / g} = ${n}(장)이다.`,
          facts: { calc: [[`(${w}/${g})*(${h}/${g})`, 0]], unseen: [g] }
        });
      }),
      H('hd-rods-count', '같은 길이로 가장 길게 자른 도막의 수', '기본 ③90', (d) => {
        const [a, b] = swap(d, pairOf(d, 'general', { gMin: 4, min: 12 })), g = gcd(a, b);
        return N(`길이가 ${a} cm, ${b} cm인 두 끈을 남김없이 같은 길이로 자르려고 한다. 한 도막을 가장 길게 자르면 도막은 모두 몇 개인가?`, a / g + b / g, {
          unit: '개', explain: `한 도막의 길이는 최대공약수인 ${g} cm이다. ${a} ÷ ${g} = ${a / g}, ${b} ÷ ${g} = ${b / g}이므로 도막은 ${a / g} + ${b / g} = ${a / g + b / g}(개)이다.`, facts: { calc: [[`${a}/${g}+${b}/${g}`, 0]], unseen: [g] }
        });
      }),
      H('hd-cm-between-count', '두 수 사이에 있는 공배수의 수', '62', (d) => {
        const [a, b, lo, hi] = d.until(() => { const lo = d.pick([100, 150, 200]); return pairOf(d, 'general', { max: 24, maxL: 40 }).concat([lo, lo + d.pick([50, 100])]); }, ([x, y, p, q]) => range(q - p - 1, p + 1).filter((v) => v % lcm(x, y) === 0).length >= 2);
        const L = lcm(a, b), inside = range(hi - lo - 1, lo + 1), hits = inside.filter((v) => v % L === 0);
        return N(`${lo}보다 크고 ${hi}보다 작은 수 중 ${josa(a, '과/와')} ${b}의 공배수는 모두 몇 개인가?`, hits.length, {
          unit: '개', explain: `${josa(a, '과/와')} ${b}의 최소공배수는 ${L}이다. ${L}의 배수 중 ${lo}보다 크고 ${hi}보다 작은 수는 ${hits.join(', ')}이다.`, facts: { count: inside.map((v) => v % a === 0 && v % b === 0) }
        });
      }, { standard: MUL }),
      H('hd-cm-max-two-digit', '가장 큰 두 자리 공배수', '58·60', (d) => {
        const [a, b] = d.until(() => swap(d, pairOf(d, 'general', { max: 24, maxL: 40 })), ([x, y]) => 99 % lcm(x, y) !== 0), g = gcd(a, b), L = lcm(a, b), q = Math.floor(99 / L);
        return N(`${josa(a, '으로/로')} 나누어도 ${josa(b, '으로/로')} 나누어도 나누어떨어지는 두 자리 수 중 가장 큰 수는?`, L * q, {
          explain: `구하는 수는 ${josa(a, '과/와')} ${b}의 공배수이고, 공배수는 최소공배수 ${L}의 배수이다. 99 ÷ ${L} = ${q}${rest(99, L)}이므로 ${L} × ${q} = ${L * q}이다.`, facts: { calc: [[`99-99%(${lcmExpr(a, b)})`, 0]], unseen: [99, g] }
        });
      }, { standard: MUL }),
      H('hd-cm-nearest', '어떤 수에 가장 가까운 공배수', '60', (d) => {
        const [a, b, t] = d.until(() => swap(d, pairOf(d, 'general', { max: 30, maxL: 45 })).concat([d.pick([100, 150, 200])]), ([x, y, v]) => v % lcm(x, y) !== 0 && (v % lcm(x, y)) * 2 !== lcm(x, y));
        const g = gcd(a, b), L = lcm(a, b), low = t - (t % L), ans = (t % L) * 2 < L ? low : low + L, e = lcmExpr(a, b);
        return N(`${josa(a, '과/와')} ${b}의 공배수 중 ${t}에 가장 가까운 수는?`, ans, {
          explain: `최소공배수가 ${L}이므로 공배수는 ${L}의 배수이다. ${t}보다 작은 공배수 중 가장 큰 수는 ${low}, ${t}보다 큰 공배수 중 가장 작은 수는 ${low + L}이다. ${t} − ${low} = ${t - low}, ${low + L} − ${t} = ${low + L - t}이므로 ${josa(ans, '이/가')} 더 가깝다.`,
          facts: { calc: [[ans === low ? `${t}-${t}%(${e})` : `${t}-${t}%(${e})+${e}`, 0]], unseen: [g] }
        });
      }, { standard: MUL }),
      H('hd-rem-lcm', '두 수로 나누면 나머지가 같은 수', '72', (d) => {
        // 나머지 그 수도 조건에 맞으므로(3 ÷ 9 = 0 … 3) 두 자리 수 가운데 가장 작은 수를 묻는다. 나머지는 두 나누는 수보다 작다.
        const [a, b] = swap(d, pairOf(d, 'general', { max: 20, maxL: 90 })), g = gcd(a, b), L = lcm(a, b), r = d.int(1, Math.min(a, b, 9) - 1);
        return N(`어떤 수를 ${josa(a, '으로/로')} 나누어도 ${josa(b, '으로/로')} 나누어도 나머지가 ${r}이다. 어떤 수가 될 수 있는 수 중 가장 작은 두 자리 수는?`, L + r, {
          explain: `어떤 수에서 ${josa(r, '을/를')} 뺀 수는 ${josa(a, '과/와')} ${b}의 공배수이다. 최소공배수가 ${L}이므로 가장 작은 두 자리 수는 ${L} + ${r} = ${L + r}이다.`, facts: { calc: [[`${lcmExpr(a, b)}+${r}`, 0]], unseen: [g] }
        });
      }, { standard: MUL }),
      H('hd-tile-count', '가장 작은 정사각형을 만드는 데 필요한 장수', '87', (d) => {
        const [w, h] = swap(d, pairOf(d, 'general', { min: 6, max: 32, maxL: 160 })), g = gcd(w, h), L = lcm(w, h), n = (L / w) * (L / h);
        return N(`가로 ${w} cm, 세로 ${h} cm인 직사각형 모양의 타일을 같은 방향으로 빈틈없이 늘어놓아 가장 작은 정사각형을 만들었다. 늘어놓은 타일은 모두 몇 장인가?`, n, {
          unit: '장', figure: rectFig(w, h, 70), explain: `정사각형의 한 변의 길이는 최소공배수인 ${L} cm이다. 가로로 ${L} ÷ ${w} = ${L / w}(장), 세로로 ${L} ÷ ${h} = ${L / h}(장)씩 놓이므로 ${L / w} × ${L / h} = ${n}(장)이다.`,
          facts: { calc: [[`(${h}/${g})*(${w}/${g})`, 0]], unseen: [g] }
        });
      }, { standard: MUL }),
      H('hd-gear', '맞물려 도는 톱니바퀴', '기본 ②109', (d) => {
        const [a, b] = pairOf(d, 'general', { min: 16, max: 48, gMin: 4, ok: (x, y) => y / gcd(x, y) <= 8 }), g = gcd(a, b), L = lcm(a, b);
        return M(`톱니가 ${a}개인 톱니바퀴 ㉮와 톱니가 ${b}개인 톱니바퀴 ㉯가 맞물려 돌고 있다. 처음에 맞물렸던 두 톱니가 처음으로 다시 맞물리려면 ㉮와 ㉯는 각각 몇 바퀴 돌아야 하는가?`, [{ label: '㉮', answer: L / a, unit: '바퀴' }, { label: '㉯', answer: L / b, unit: '바퀴' }], {
          figure: gears(a, b), explain: `두 톱니가 다시 맞물릴 때까지 지나간 톱니의 수는 ${josa(a, '과/와')} ${b}의 최소공배수인 ${L}개이다. ㉮는 ${L} ÷ ${a} = ${L / a}(바퀴), ㉯는 ${L} ÷ ${b} = ${L / b}(바퀴) 돈다.`,
          facts: { calc: [[`${b}/${g}`, 0], [`${a}/${g}`, 1]], unseen: [g] }
        });
      }, { standard: MUL }),
      H('hd-meet-again', '정해진 시간 동안 다시 만나는 횟수', '85', (d) => {
        // 출발할 때는 세지 않는다. 마지막 순간에 딱 만나는 수(60이 최소공배수로 나누어떨어지는 수)는 내지 않는다.
        const [n1, n2] = d.shuffle(NAMES).slice(0, 2), [a, b, hours] = d.until(() => pairOf(d, 'general', { max: 18, maxL: 45 }).concat([d.pick([1, 2])]), ([x, y, t]) => (60 * t) % lcm(x, y) !== 0 && Math.floor((60 * t) / lcm(x, y)) >= 2);
        const g = gcd(a, b), L = lcm(a, b), span = 60 * hours, q = Math.floor(span / L), e = lcmExpr(a, b);
        return N(`${name(n1, '과/와')} ${name(n2, '이/가')} 운동장 둘레를 일정한 빠르기로 걷는다. 한 바퀴 도는 데 ${name(n1, '은/는')} ${a}분, ${name(n2, '은/는')} ${b}분 걸린다. 두 사람이 출발점에서 같은 방향으로 동시에 출발하여 ${hours}시간 동안 걸을 때, 출발점에서 다시 만나는 것은 모두 몇 번인가? (출발할 때는 세지 않는다.)`, q, {
          unit: '번', explain: `두 사람은 ${josa(a, '과/와')} ${b}의 공배수만큼 지날 때마다 출발점에서 만난다. 최소공배수는 ${L}이고 ${hours}시간은 ${span}분이다. ${span} ÷ ${L} = ${q}${rest(span, L)}이므로 ${q}번 만난다.`,
          facts: { calc: [[`(${span}-${span}%(${e}))/(${e})`, 0]], unseen: [span, g] }
        });
      }, { standard: MUL }),
      H('hd-road-count', '길 위에서 두 가지가 함께 서 있는 곳의 수', '89·84', (d) => {
        // 길의 처음을 넣어 센다. 처음에서 떨어진 곳만 세면 하나 모자란다.
        const [a, b, R] = d.until(() => pairOf(d, 'general', { min: 6, max: 30, maxL: 150 }).concat([d.pick([300, 400, 500, 600, 900])]), ([x, y, t]) => Math.floor(t / lcm(x, y)) >= 2 && Math.floor(t / lcm(x, y)) <= 9);
        const g = gcd(a, b), L = lcm(a, b), q = Math.floor(R / L), e = lcmExpr(a, b);
        return N(`길이가 ${R} m인 곧은 길의 한쪽에 나무는 ${a} m 간격으로, 가로등은 ${b} m 간격으로 세웠다. 길의 처음에는 나무와 가로등을 모두 세웠다. 나무와 가로등이 함께 서 있는 곳은 길의 처음을 넣어 모두 몇 군데인가?`, q + 1, {
          unit: '군데', explain: `함께 서 있는 곳은 길의 처음에서 ${josa(a, '과/와')} ${b}의 공배수만큼 떨어진 곳이다. 최소공배수는 ${L}이고 ${R} ÷ ${L} = ${q}${rest(R, L)}이므로 처음에서 떨어진 곳이 ${q}군데이다. 길의 처음을 넣으면 ${q} + 1 = ${q + 1}(군데)이다.`,
          facts: { calc: [[`(${R}-${R}%(${e}))/(${e})+1`, 0]], unseen: [g, 1] }
        });
      }, { standard: MUL }),
      H('hd-stones', '규칙에 따라 놓은 두 줄의 바둑돌', '90', (d) => {
        // 그림에서 몇 개마다 검은 돌인지 읽고, 둘 다 검은 돌인 자리가 공배수 번째임을 알아야 한다.
        const [a, b] = swap(d, d.pick([[2, 3], [3, 4], [2, 5], [3, 5], [4, 6], [4, 5], [2, 7], [3, 7], [5, 6]])), total = d.pick([50, 60, 70, 80, 100]), g = gcd(a, b), L = lcm(a, b), q = Math.floor(total / L), e = lcmExpr(a, b);
        return N(`두 사람이 바둑돌을 ${total}개씩 규칙에 따라 한 줄로 놓는다. 그림은 처음 15개까지 놓은 것이다. 두 줄의 같은 자리에 모두 검은 돌이 놓이는 것은 몇 번인가?`, q, {
          unit: '번', figure: stoneRows(a, b, 15), explain: `윗줄은 ${a}개마다, 아랫줄은 ${b}개마다 검은 돌을 놓는다. 모두 검은 돌인 자리는 ${josa(a, '과/와')} ${b}의 공배수인 ${L}번째, ${2 * L}번째, …이다. ${total} ÷ ${L} = ${q}${rest(total, L)}이므로 ${q}번이다.`,
          facts: { calc: [[`(${total}-${total}%(${e}))/(${e})`, 0]], unseen: [g] }
        });
      }, { standard: MUL })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
