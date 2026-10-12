// 5학년 1학기 3단원 대응 관계 — 한 양에서 다른 양 구하기, 식을 읽고 상황 찾기의 기본 문항과 실력 문항.
// 꼴 목록(기본꼴 1~3, 심화꼴 74꼴)을 꼴마다 따져서 실었다. 꼴 번호는 ①n = 기본꼴_1의 n번, ②n, ③n, 심n.
//
// 실력 문항의 잣대: 어려움은 보기가 아니라 문제의 장치에서 나와야 한다. 기본에서 하는 일(표의 빈칸 하나, 알맞은 식 하나 고르기,
// 한 양에서 다른 양 한 번 구하기)에 틀린 보기만 얹은 것은 실력이 아니다. 실력에는 두 가지만 실었고, 모두 수를 적어 답한다.
//  ① 상황이나 표에 함정이 있어 대응 관계의 뜻을 정확히 대야 풀리는 문제. 이 단원에서 아이들이 흔히 잘못 아는 것:
//    - 표의 첫 짝만 보고 관계를 정한다(2와 4를 보고 「2배」와 「2 더하기」를 가리지 않는다).
//    - 칸을 건너뛴 표에서 옆 칸과의 차를 두 양 사이의 관계로 읽는다.
//    - 자른 횟수와 도막의 수, 꼭짓점의 수와 나누어진 삼각형의 수처럼 하나·둘 차이 나는 두 양을 같게 본다.
//    - 올해 나이가 3배이면 몇 해 뒤에도 3배라고 여긴다(나이는 차가 변하지 않는다).
//    - 「친구 4명과 함께」에서 자기를 빼고 센다. 오전과 오후에 걸친 두 시각의 차를 숫자끼리만 뺀다.
//  ② 두 번 넘게 따져야 풀리는 문제: 묶음으로 준 대응에서 하나의 값을 먼저 구하기(앞으로·거꾸로), 단위를 바꾸어 넣기,
//    두 대응을 합쳐 하나의 대응으로 보기, 관계를 찾아 구한 값으로 한 번 더 셈하기(거스름돈, 두 양의 합).
//
// 뺀 것과 까닭은 5-1-3a.js 머리에 적었다. 여기 묶음에서 더 뺀 것:
//  - 같은 문제(상황·숫자만 다름): 식을 쓰고 값까지 구하기(①36 변형), 공연 시작 시각과 끝나는 시각(③31)은 두 도시의 시각과,
//    성냥개비로 따로 만든 다각형(심62)·배열 순서와 조각의 수(②53)는 배열에서 곱해 구하기와, 10분에 500원인 요금의 거꾸로(심5 변형)는 묶음 값의 거꾸로와 같다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { LABELS, NAMES, box, lines, table, josa, name, nick, N, M, C } = B.kit;
  const STD = '6수02-01';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});
  const ORD = ['첫째', '둘째', '셋째', '넷째', '다섯째'];
  const S = { '+': '+', '-': '−', '*': '×', '/': '÷' };
  const range = (n, from) => Array.from({ length: n }, (_, i) => i + (from || 0));
  const truthOf = (rows, want) => ({ truth: rows.map((row) => row[1]), want });
  const ev = (x, op, k) => (op === '+' ? x + k : op === '-' ? x - k : op === '*' ? x * k : x / k);
  const READ = { '□': '네모', '△': '세모', '○': '동그라미', '☆': '별', '◇': '마름모', '♡': '하트' };
  const jo = (word, pair) => (READ[word] ? word + josa(READ[word], pair).slice(READ[word].length) : josa(word, pair));
  const SYMS = [['□', '△'], ['○', '△'], ['☆', '○'], ['◇', '○'], ['♡', '☆'], ['△', '☆'], ['◇', '☆'], ['○', '□']];
  const called = (A, B2, s) => `${jo(A, '을/를')} ${s[0]}, ${jo(B2, '을/를')} ${jo(s[1], '이라고/라고')} 할 때`;

  // ── 식(5-1-3a.js 와 같은 도구) ────────────────────────────────
  const holds = (e, pairs) => pairs.every((p) => ev(p[e[0]], e[1], e[2]) === p[e[3]]);
  const eq = (e, names) => `${names[e[0]]} ${S[e[1]]} ${e[2]} = ${names[e[3]]}`;
  const eqLead = (e, names) => `${names[e[3]]} = ${names[e[0]]} ${S[e[1]]} ${e[2]}`;
  const eqj = (e, names, pair) => { const last = names[e[3]], text = eq(e, names); return text.slice(0, text.length - last.length) + jo(last, pair); };
  function judge(list, pairs, want) {
    const rows = list.map((o) => {
      if (!o.e) return o;
      const ps = o.pairs || pairs, ok = holds(o.e, ps), p = ps.slice().reverse().find((q) => holds(o.e, [q]) === ok);
      return { text: o.text, ok, claim: [`${p[o.e[0]]}${o.e[1]}${o.e[2]}`, p[o.e[3]]] };
    });
    if (rows.filter((o) => o.ok === want).length !== 1) throw new Error('답이 하나가 아니다: ' + rows.map((o) => o.text + '=' + o.ok).join(' | '));
    const facts = { truth: rows.map((o) => o.ok), want };
    if (rows.every((o) => o.claim)) { facts.claimed = rows.map((o) => o.claim); facts.claimedWant = want; }
    return { options: rows.map((o) => o.text), answer: rows.findIndex((o) => o.ok === want), facts };
  }
  const ELDERS = ['어머니', '아버지', '이모', '삼촌', '선생님'];
  const tableOf = (rows) => '<div class="mb-table-wrap"><table class="mb-table"><tbody>' + rows.map((row) => '<tr>' + row.map((c, i) => '<td style="padding:5px 7px' + (i ? '' : ';white-space:normal;word-break:keep-all') + '">' + c + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>';

  // ── 도형의 배열(5-1-3a.js 와 같은 도구) ───────────────────────
  const fx = (v) => Math.round(v * 10) / 10;
  const stone = (fill) => (u, x, y) => '<circle class="mb-poly" style="stroke-width:1.2;fill:' + fill + '" cx="' + fx(x + u / 2) + '" cy="' + fx(y + u / 2) + '" r="' + fx(u * 0.41) + '"/>';
  const PIECE = {
    s: (u, x, y) => '<rect class="mb-poly" style="stroke-width:1.2;fill:#fde68a" x="' + fx(x + u * 0.09) + '" y="' + fx(y + u * 0.09) + '" width="' + fx(u * 0.82) + '" height="' + fx(u * 0.82) + '"/>',
    t: (u, x, y) => '<path class="mb-poly" style="stroke-width:1.2;fill:#bbf7d0" d="M' + fx(x + u / 2) + ' ' + fx(y + u * 0.1) + 'L' + fx(x + u * 0.93) + ' ' + fx(y + u * 0.9) + 'H' + fx(x + u * 0.07) + 'Z"/>',
    c: stone('#bfdbfe'), k: stone('#374151'), w: stone('#fff')
  };
  const NAME = { s: '사각형', c: '원', t: '삼각형', k: '검은 바둑돌', w: '흰 바둑돌' };
  const shape = (cells) => ({ w: 1 + Math.max.apply(null, cells.map((c) => c[0])), h: 1 + Math.max.apply(null, cells.map((c) => c[1])), kinds: cells.map((c) => c[2]).filter((kind, i, all) => all.indexOf(kind) === i),
    n: (kind) => cells.filter((c) => c[2] === kind).length, body: (u, ox, oy) => cells.map(([x, y, kind]) => PIECE[kind](u, ox + x * u, oy + y * u)).join('') });
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
  const told = (shapes, names, head) => (head || '모양의 배열') + ': ' + shapes.map((sh, i) => names[i] + ' ' + sh.kinds.map((kind) => NAME[kind] + ' ' + sh.n(kind) + '개').join(' ')).join(', ');
  const cols = (n, k, base, top) => range(n).reduce((all, i) => all.concat(range(k).map((j) => [i, j, top]), [[i, k, base]]), []);
  const twoRows = (n, k, up, down) => range(n).map((i) => [i, 0, up]).concat(range(n + k).map((i) => [i, 1, down]));
  const block = (rows, n, kind) => range(rows).reduce((all, r) => all.concat(range(n).map((c) => [c, r, kind])), []);
  // ㄴ자: 왼쪽에 세로로 c개를 세우고 그 아래에 가로로 n개를 놓는다(n + c개).
  const ell = (n, c) => range(c).map((j) => [0, j, 's']).concat(range(n).map((i) => [i, c, 's']));
  function rowsFig(rows, label) {
    const rowH = 34;
    const out = rows.map(([nameText, draw], i) => '<text class="mb-label" x="4" y="' + (6 + i * rowH + 13) + '" dominant-baseline="central">' + nameText + '</text>' + draw(60, 6 + i * rowH)).join('');
    return '<svg class="mb-geo" viewBox="0 0 276 ' + (rows.length * rowH + 4) + '" width="276" role="img" aria-label="' + label + '">' + out + '</svg>';
  }
  const cutRow = (n) => (x, y) => '<rect class="mb-poly" style="stroke-width:1.2;fill:#fde68a" x="' + x + '" y="' + (y + 5) + '" width="204" height="16" rx="2"/>'
    + range(n, 1).map((i) => '<path style="stroke:#b42318;stroke-width:1.8;stroke-dasharray:4 3;fill:none" d="M' + fx(x + (204 * i) / (n + 1)) + ' ' + y + 'v26"/>').join('');
  const cutFig = (list) => rowsFig(list.map((n) => [n + '번', cutRow(n)]), '끈 한 개를 자른 모습: ' + list.map((n) => `${n}번 자르면 ${n + 1}도막`).join(', '));
  // 한 꼭짓점에서 대각선을 모두 그은 정다각형(꼭짓점 n개). 삼각형 n − 2개로 나누어진다.
  const fan = (n) => ({ w: 3, h: 3, body: (u, ox, oy) => {
    const turn = (i) => Math.PI - Math.PI / n + (2 * Math.PI * i) / n, at = (i) => [fx(ox + 1.5 * u + 1.4 * u * Math.sin(turn(i))), fx(oy + 1.55 * u - 1.4 * u * Math.cos(turn(i)))];
    return '<polygon class="mb-poly" style="stroke-width:1.4;fill:#fef3c7" points="' + range(n).map((i) => at(i).join(',')).join(' ') + '"/>'
      + range(n - 3, 2).map((i) => '<path style="stroke:#2563eb;stroke-width:1.4;fill:none" d="M' + at(0).join(' ') + 'L' + at(i).join(' ') + '"/>').join('');
  } });

  B.addTypes('5-1-3', 'value', [
    T('vl-mul', '곱해서 구하기', '①36 ②44 ③18 심38·62', (d) => {
      const [lead, ask, unit, k, ms, why] = d.pick([
        ['만화 영화 1초를 만드는 데 그림이 24장 필요하다.', (m) => `${m}초짜리 만화 영화를 만드는 데 필요한 그림은 몇 장인가?`, '장', 24, [20, 30, 40], '그림의 수는 만화 영화의 길이(초)의 24배이다.'],
        ['목걸이 한 개를 만드는 데 구슬이 50개 필요하다.', (m) => `목걸이 ${m}개를 만드는 데 필요한 구슬은 몇 개인가?`, '개', 50, [12, 16, 18], '구슬의 수는 목걸이의 수의 50배이다.'],
        ['서연이는 1분에 80 m씩 걷는다.', (m) => `서연이가 ${m}분 동안 걷는 거리는 몇 m인가?`, 'm', 80, [12, 15, 25], '걸은 거리(m)는 걸은 시간(분)의 80배이다.'],
        ['가야금 한 대에는 줄이 12개 있다.', (m) => `가야금 ${m}대에 있는 줄은 모두 몇 개인가?`, '개', 12, [11, 15, 20], '줄의 수는 가야금의 수의 12배이다.']
      ]), m = d.pick(ms);
      return N(`${lead} ${ask(m)}`, k * m, { unit, explain: `${why} ${m} × ${k} = ${k * m}`, facts: { calc: [[`${m}*${k}`, 0]] } });
    }),
    T('vl-div', '거꾸로 나누어 구하기', '①37 ②45 ③19 심39·62', (d) => {
      const [lead, ask, unit, k, ms, why] = d.pick([
        ['꽃 한 송이에 꽃잎이 5장씩 있다.', (t) => `꽃잎이 모두 ${t}장일 때 꽃은 몇 송이인가?`, '송이', 5, [13, 15, 17], '꽃잎의 수는 꽃의 수의 5배이므로 꽃의 수는 꽃잎의 수를 5로 나눈 몫이다.'],
        ['쿠키를 한 접시에 12개씩 담는다.', (t) => `쿠키 ${t}개를 모두 담는 데 필요한 접시는 몇 개인가?`, '개', 12, [9, 12, 14], '쿠키의 수는 접시의 수의 12배이므로 접시의 수는 쿠키의 수를 12로 나눈 몫이다.'],
        ['지우는 1분에 150 m씩 달린다.', (t) => `지우가 ${t} m를 달리는 데 걸리는 시간은 몇 분인가?`, '분', 150, [5, 6, 8], '달린 거리(m)는 달린 시간(분)의 150배이므로 달린 시간은 달린 거리를 150으로 나눈 몫이다.'],
        ['과자 한 봉지의 값은 900원이다.', (t) => `과자를 사고 ${t}원을 냈다면 산 과자는 몇 봉지인가?`, '봉지', 900, [7, 8, 9], '과자값은 과자의 수의 900배이므로 과자의 수는 과자값을 900으로 나눈 몫이다.']
      ]), m = d.pick(ms);
      return N(`${lead} ${ask(k * m)}`, m, { unit, explain: `${why} ${k * m} ÷ ${k} = ${m}`, facts: { calc: [[`${k * m}/${k}`, 0]] } });
    }),
    T('vl-rate-mul', '표에서 관계를 찾아 곱하기(큰 수)', '①22·38 ③18 심19·38', (d) => {
      const [money, unit, rate, ms] = d.pick([['미국 돈', '달러', 1400, [4, 5, 6, 7]], ['중국 돈', '위안', 190, [20, 30, 40, 50]]]), m = d.pick(ms);
      return N(`어느 날 ${money} 1${jo(unit, '을/를')} 우리나라 돈 ${rate}원으로 바꿀 수 있었다. 이날 ${money} ${m}${jo(unit, '은/는')} 우리나라 돈 몇 원으로 바꿀 수 있는가?`, rate * m, {
        unit: '원', figure: table([`${money}(${unit})`, '우리나라 돈(원)'], [[1, rate], [2, 2 * rate], [3, 3 * rate]]), explain: `우리나라 돈은 ${money}의 ${rate}배이다. ${m} × ${rate} = ${rate * m}`, facts: { calc: [[`${m}*${rate}`, 0]] }
      });
    }),
    T('vl-rate-div', '표에서 관계를 찾아 나누기(큰 수)', '①38 ②45 심19·39', (d) => {
      const [money, unit, rate, ms] = d.pick([['미국 돈', '달러', 1400, [5, 6, 8, 9]], ['중국 돈', '위안', 190, [6, 7, 8, 9]]]), m = d.pick(ms);
      return N(`어느 날 ${money} 1${jo(unit, '을/를')} 우리나라 돈 ${rate}원으로 바꿀 수 있었다. 이날 우리나라 돈 ${rate * m}원은 ${money} 몇 ${jo(unit, '으로/로')} 바꿀 수 있는가?`, m, {
        unit, figure: table(['우리나라 돈(원)', `${money}(${unit})`], [[rate, 1], [2 * rate, 2], [3 * rate, 3]]), explain: `${jo(money, '은/는')} 우리나라 돈을 ${josa(rate, '으로/로')} 나눈 몫이다. ${rate * m} ÷ ${rate} = ${m}`, facts: { calc: [[`${rate * m}/${rate}`, 0]] }
      });
    }),
    T('vl-add', '넣은 수와 나온 수(더하기)', '①39·42 ②46·48 ③27 심49', (d) => {
      const k = d.int(3, 9), a = d.int(11, 15), b = a + d.int(2, 5), x = d.int(21, 48);
      return N(`어떤 상자에 구슬을 ${a}개 넣으면 ${a + k}개가 나오고, ${b}개 넣으면 ${b + k}개가 나온다. 이 상자에 구슬을 ${x}개 넣으면 몇 개가 나오는가?`, x + k, {
        unit: '개', explain: `${a + k} − ${a} = ${k}, ${b + k} − ${b} = ${k}이므로 넣은 수보다 ${k}개 더 많이 나온다. ${x} + ${k} = ${x + k}`, facts: { calc: [[`${x}+(${a + k}-${a})`, 0]] }
      });
    }),
    T('vl-add-back', '표에서 거꾸로 구하기(더하기)', '①40 ②47 ③28 심57', (d) => {
      const k = d.int(3, 8), a = d.int(3, 6), m = d.int(31, 58);
      return N(`상자마다 노란색 구슬과 초록색 구슬을 규칙에 따라 넣고 수를 세어 표로 나타냈다. 초록색 구슬을 ${m}개 넣은 상자에 든 노란색 구슬은 몇 개인가?`, m - k, {
        unit: '개', figure: tableOf([['노란색 구슬의 수(개)', a, a + 1, a + 2, a + 3], ['초록색 구슬의 수(개)', a + k, a + 1 + k, a + 2 + k, a + 3 + k]]),
        explain: `초록색 구슬의 수는 노란색 구슬의 수보다 ${a + k} − ${a} = ${k}만큼 더 크다. 노란색 구슬은 ${m} − ${k} = ${m - k}(개)이다.`, facts: { calc: [[`${m}-(${a + k}-${a})`, 0]] }
      });
    }),
    T('vl-pic-mul', '배열에서 곱해 구하기', '①36 ②44·53 ③39 심54·58', (d) => {
      const k = d.pick([3, 4]), m = d.int(12, 19), shapes = range(3, 1).map((n) => shape(cols(n, k, 's', 'c')));
      return N(`규칙에 따라 사각형과 원을 늘어놓았다. 사각형이 ${m}개일 때 원은 몇 개인가?`, m * k, {
        unit: '개', figure: steps(shapes, ORD, told(shapes, ORD)), explain: `사각형이 1개, 2개, 3개일 때 원은 ${k}개, ${2 * k}개, ${3 * k}개이다. 원의 수는 사각형의 수의 ${k}배이므로 ${m} × ${k} = ${m * k}(개)이다.`, facts: { calc: [[`${m}*${k}`, 0]] }
      });
    }),
    T('vl-pic-nth', '개수를 보고 배열 순서 구하기', '②45 ③38 심55', (d) => {
      const k = d.pick([3, 4]), m = d.int(12, 20), shapes = range(3, 1).map((n) => shape(block(k, n, 'k')));
      return N(`규칙에 따라 검은 바둑돌을 늘어놓았다. 검은 바둑돌 ${k * m}개로 만든 모양은 몇째 모양인가?`, m, {
        unit: '째', figure: steps(shapes, ORD, told(shapes, ORD)), explain: `검은 바둑돌의 수는 ${k}개, ${2 * k}개, ${3 * k}개로 배열 순서의 ${k}배이다. ${k * m} ÷ ${k} = ${m}이므로 ${m}째 모양이다.`, facts: { calc: [[`${k * m}/${k}`, 0]] }
      });
    }),
    T('vl-pic-add', '먼 차례의 조각 수(더하기)', '②53 ③37 심56', (d) => {
      const c = d.pick([2, 3]), m = d.pick([20, 30, 40, 50]), names = range(3, 1).map((i) => i + '번째'), shapes = range(3, 1).map((n) => shape(ell(n, c)));
      return N(`규칙에 따라 사각형 조각을 늘어놓았다. ${m}번째 모양의 사각형 조각은 몇 개인가?`, m + c, {
        unit: '개', figure: steps(shapes, names, told(shapes, names)), explain: `사각형 조각의 수는 ${1 + c}개, ${2 + c}개, ${3 + c}개로 배열 순서보다 ${c}만큼 더 크다. ${m} + ${c} = ${m + c}(개)이다.`, facts: { calc: [[`${m}+(${1 + c}-1)`, 0]] }
      });
    }),
    T('vl-pic-add-back', '배열에서 거꾸로 구하기(더하기)', '①40 ②47 ③39·40 심57', (d) => {
      const k = d.pick([2, 3]), m = d.int(24, 45), shapes = range(3, 1).map((n) => shape(twoRows(n, k, 't', 's')));
      return N(`규칙에 따라 삼각형과 사각형을 늘어놓았다. 사각형이 ${m}개일 때 삼각형은 몇 개인가?`, m - k, {
        unit: '개', figure: steps(shapes, ORD, told(shapes, ORD)), explain: `사각형의 수는 삼각형의 수보다 ${1 + k} − 1 = ${k}만큼 더 크다. 삼각형은 ${m} − ${k} = ${m - k}(개)이다.`, facts: { calc: [[`${m}-(${1 + k}-1)`, 0]] }
      });
    }),
    T('vl-talk-back', '답한 수에서 말한 수 구하기', '①42 ②49 ③28·29 심50', (d) => {
      // 빼는 관계를 더해서 되돌린다.
      const [p, q] = d.shuffle(NAMES).slice(0, 2), k = d.int(4, 9), a = d.int(k + 3, k + 9), b = a + d.int(3, 8), y = d.int(31, 55);
      return N(`${name(p, '이/가')} ${josa(a, '이라고/라고')} 말하면 ${name(q, '은/는')} ${a - k}, ${josa(b, '이라고/라고')} 말하면 ${josa(b - k, '이라고/라고')} 답한다. ${name(q, '이/가')} ${josa(y, '이라고/라고')} 답했다면 ${name(p, '이/가')} 말한 수는?`, y + k, {
        explain: `${a} − ${a - k} = ${k}, ${b} − ${b - k} = ${k}이므로 말한 수에서 ${josa(k, '을/를')} 뺀 수를 답한다. 말한 수는 답한 수보다 ${k}만큼 더 크므로 ${y} + ${k} = ${y + k}이다.`, facts: { calc: [[`${y}+(${a}-${a - k})`, 0]] }
      });
    }),
    T('vl-talk-mul', '말한 수와 답한 수(몇 배)', '①42 ②33 심49', (d) => {
      const [p, q] = d.shuffle(NAMES).slice(0, 2), k = d.int(6, 9), xs = d.shuffle([3, 7, 8, 10]).slice(0, 3), x = d.pick([11, 12, 15, 20]);
      return N(`${name(p, '이/가')} ${josa(xs[0], '이라고/라고')} 말하면 ${name(q, '은/는')} ${xs[0] * k}, ${josa(xs[1], '이라고/라고')} 말하면 ${xs[1] * k}, ${josa(xs[2], '이라고/라고')} 말하면 ${josa(xs[2] * k, '이라고/라고')} 답한다. ${name(p, '이/가')} ${josa(x, '이라고/라고')} 말하면 ${name(q, '이/가')} 답하는 수는?`, x * k, {
        explain: `${xs.map((v) => `${v * k} ÷ ${v} = ${k}`).join(', ')}이므로 말한 수의 ${k}배를 답한다. ${x} × ${k} = ${x * k}`, facts: { calc: [[`${x}*(${xs[0] * k}/${xs[0]})`, 0]] }
      });
    }),
    T('vl-age', '두 사람의 나이(더하는 쪽)', '①41 ②50 ③30 심51', (d) => {
      const child = d.pick(NAMES), elder = d.pick(ELDERS), c = d.int(10, 13), e = c + d.int(21, 32), t = d.int(17, 25);
      return N(`올해 ${name(child, '은/는')} ${c}살이고 ${jo(elder, '은/는')} ${e}살이다. ${name(child, '이/가')} ${t}살이 될 때 ${jo(elder, '은/는')} 몇 살인가?`, t + e - c, {
        unit: '살', explain: `두 사람의 나이의 차는 ${e} − ${c} = ${e - c}(살)로 변하지 않는다. ${t} + ${e - c} = ${t + e - c}(살)이다.`, facts: { calc: [[`${t}+(${e}-${c})`, 0]] }
      });
    }),
    T('vl-year-back', '나이에서 연도 구하기', '①41 ②51 심52', (d) => {
      const child = d.pick(NAMES), y = d.int(2024, 2027), a = d.int(10, 13), age = d.pick([20, 25, 30, 40]);
      return N(`${y}년에 ${name(child, '은/는')} ${a}살이다. ${name(child, '이/가')} ${age}살이 되는 해는 몇 년인가?`, age + (y - a), {
        unit: '년', explain: `연도와 나이의 차는 ${y} − ${a} = ${josa(y - a, '으로/로')} 변하지 않는다. ${age} + ${y - a} = ${age + (y - a)}(년)이다.`, facts: { calc: [[`${age}+(${y}-${a})`, 0]] }
      });
    }),
    T('vl-time', '다른 도시의 시각에서 서울의 시각 구하기', '①41 ②52 ③31', (d) => {
      const [city, gap] = d.pick([['방콕', 2], ['베이징', 1], ['두바이', 5]]), h = d.int(gap + 1, 9), x = d.int(1, 11 - gap);
      return N(`서울이 오후 ${h}시일 때 ${jo(city, '은/는')} 같은 날 오후 ${h - gap}시이다. ${jo(city, '이/가')} 오전 ${x}시일 때 서울은 같은 날 오전 몇 시인가?`, x + gap, {
        lead: '오전', unit: '시', explain: `서울의 시각은 ${city}의 시각보다 ${h} − ${h - gap} = ${gap}(시간) 빠르다. ${x} + ${gap} = ${x + gap}이므로 오전 ${x + gap}시이다.`, facts: { calc: [[`${x}+(${h}-${h - gap})`, 0]] }
      });
    }),
    T('vl-cut', '자른 횟수에서 도막의 수 구하기', '①44 ②46 ③33 심69', (d) => {
      const m = d.int(8, 15);
      return N(`끈 한 개를 그림과 같이 자른다. 이 끈을 ${m}번 자르면 몇 도막이 되는가?`, m + 1, {
        unit: '도막', figure: cutFig([1, 2, 3]), explain: `1번 자르면 2도막, 2번 자르면 3도막, 3번 자르면 4도막이다. 도막의 수는 자른 횟수보다 1만큼 더 크므로 ${m} + 1 = ${m + 1}(도막)이다.`, facts: { calc: [[`${m}+(2-1)`, 0]] }
      });
    }),
    T('vl-pin', '누름 못의 수에서 사진의 수 구하기', '①39·40 ②46·47 ③33 심73', (d) => {
      const m = d.int(16, 30);
      return N(`사진을 한 줄로 이어 붙이면서 누름 못을 꽂고, 사진의 수와 누름 못의 수를 표로 나타냈다. 누름 못을 ${m}개 꽂았다면 붙인 사진은 몇 장인가?`, m - 1, {
        unit: '장', figure: tableOf([['사진의 수(장)', 1, 2, 3, 4], ['누름 못의 수(개)', 2, 3, 4, 5]]), explain: `누름 못의 수는 사진의 수보다 2 − 1 = 1만큼 더 크다. 사진은 ${m} − 1 = ${m - 1}(장)이다.`, facts: { calc: [[`${m}-(2-1)`, 0]] }
      });
    }),
    T('vl-post', '이어 붙인 색 테이프와 겹친 부분', '①39 ②46 ③32·33 심72', (d) => {
      const m = d.int(12, 25);
      return N(`색 테이프를 한 줄로 이어 붙이고, 색 테이프의 수와 겹친 부분의 수를 표로 나타냈다. 색 테이프 ${m}장을 이어 붙이면 겹친 부분은 몇 군데인가?`, m - 1, {
        unit: '군데', figure: tableOf([['색 테이프의 수(장)', 2, 3, 4, 5], ['겹친 부분의 수(군데)', 1, 2, 3, 4]]), explain: `겹친 부분의 수는 색 테이프의 수보다 2 − 1 = 1만큼 더 작다. ${m} − 1 = ${m - 1}(군데)이다.`, facts: { calc: [[`${m}-(2-1)`, 0]] }
      });
    }),
    T('vl-sum', '읽은 쪽수와 남은 쪽수(합이 일정)', '③8 심3·26', (d) => {
      const child = d.pick(NAMES), total = d.pick([120, 150, 180, 200]), x = d.until(() => d.int(52, total - 30), (v) => v % 10 !== 0);
      return N(`${name(child, '이/가')} 책 한 권을 읽으면서 읽은 쪽수와 남은 쪽수를 표로 나타냈다. ${x}쪽을 읽었을 때 남은 쪽수는 몇 쪽인가?`, total - x, {
        unit: '쪽', figure: tableOf([['읽은 쪽수(쪽)', 10, 20, 30, 40], ['남은 쪽수(쪽)', total - 10, total - 20, total - 30, total - 40]]),
        explain: `읽은 쪽수와 남은 쪽수의 합은 10 + ${total - 10} = ${josa(total, '으로/로')} 변하지 않는다. ${total} − ${x} = ${total - x}(쪽)이다.`, facts: { calc: [[`(10+${total - 10})-${x}`, 0]] }
      });
    }),
    T('vl-two-qty', '한 양에 대응하는 두 양', '심43', (d) => {
      const [p, q] = d.pick([[5, 3], [6, 4], [7, 2], [4, 3]]), m = d.int(12, 18);
      return M(`꽃다발 한 개를 만드는 데 장미 ${p}송이와 튤립 ${q}송이가 든다. 꽃다발 ${m}개를 만드는 데 드는 장미와 튤립은 각각 몇 송이인가?`, [{ label: '장미', answer: p * m, unit: '송이' }, { label: '튤립', answer: q * m, unit: '송이' }], {
        explain: `장미의 수는 꽃다발의 수의 ${p}배, 튤립의 수는 꽃다발의 수의 ${q}배이다. 장미는 ${m} × ${p} = ${p * m}(송이), 튤립은 ${m} × ${q} = ${q * m}(송이)이다.`, facts: { calc: [[`${m}*${p}`, 0], [`${m}*${q}`, 1]] }
      });
    }),
    T('vl-two-back', '두 대응에서 따로 거꾸로 구하기', '①45', (d) => {
      const [n, p, q] = d.pick([[24, 8, 6], [30, 5, 6], [36, 4, 9], [40, 8, 5], [48, 6, 8]]);
      return M(`학생 ${n}명에게 요구르트와 과자를 한 개씩 나누어 주려고 한다. 요구르트는 한 묶음에 ${p}개, 과자는 한 묶음에 ${q}개 들어 있다. 요구르트와 과자는 각각 몇 묶음 필요한가?`, [{ label: '요구르트', answer: n / p, unit: '묶음' }, { label: '과자', answer: n / q, unit: '묶음' }], {
        explain: `요구르트의 수는 묶음의 수의 ${p}배, 과자의 수는 묶음의 수의 ${q}배이다. 요구르트는 ${n} ÷ ${p} = ${n / p}(묶음), 과자는 ${n} ÷ ${q} = ${n / q}(묶음)이다.`, facts: { calc: [[`${n}/${p}`, 0], [`${n}/${q}`, 1]] }
      });
    }),
    T('vl-extra', '쓰지 않는 수가 섞인 글', '①37 심39', (d) => {
      const per = d.pick([2, 3, 4]), price = d.pick([5000, 6000, 8000]), m = d.int(4, 9), byCount = d.bool();
      return N(`배가 ${per}개씩 든 바구니 한 개의 값은 ${price}원이다. ${byCount ? `배 ${per * m}개를 사려면 바구니를 몇 개 사야 하는가?` : `${price * m}원으로 살 수 있는 바구니는 몇 개인가?`}`, m, {
        unit: '개', explain: byCount ? `배의 수는 바구니의 수의 ${per}배이다. ${per * m} ÷ ${per} = ${m}(개)이다. 바구니의 값은 쓰지 않는다.` : `바구니의 값은 바구니의 수의 ${price}배이다. ${price * m} ÷ ${price} = ${m}(개)이다. 바구니에 든 배의 수는 쓰지 않는다.`,
        facts: { calc: [[byCount ? `${per * m}/${per}` : `${price * m}/${price}`, 0]] }
      });
    }),
    T('vl-expr-mul', '나눗셈식을 보고 큰 쪽의 양 구하기', '①36 ②48 심16', (d) => {
      const k = d.pick([6, 8, 12, 15]), x = d.int(7, 14), s = d.pick(SYMS);
      return N(`연필을 한 상자에 ${k}자루씩 담는다. ${called('상자의 수', '연필의 수', s)}, 두 양 사이의 대응 관계는 ${eq([1, '/', k, 0], s)}이다. ${jo(s[0], '이/가')} ${x}일 때 ${s[1]}의 값은?`, x * k, {
        explain: `${jo(s[1], '을/를')} ${josa(k, '으로/로')} 나누어 ${jo(s[0], '이/가')} 되므로 ${jo(s[1], '은/는')} ${s[0]}의 ${k}배이다. ${x} × ${k} = ${x * k}`, facts: { calc: [[`${x}*${k}`, 0]] }
      });
    }),
    T('vl-expr-add', '뺄셈식을 보고 거꾸로 구하기', '②48 ③27·28', (d) => {
      const k = d.int(6, 19), y = d.int(21, 58), s = d.pick(SYMS);
      return N(`두 양 ${jo(s[0], '과/와')} ${s[1]} 사이의 대응 관계를 식으로 나타내면 ${eq([0, '-', k, 1], s)}이다. ${jo(s[1], '이/가')} ${y}일 때 ${s[0]}의 값은?`, y + k, {
        explain: `${s[0]}에서 ${josa(k, '을/를')} 빼어 ${jo(s[1], '이/가')} 되므로 ${jo(s[0], '은/는')} ${s[1]}보다 ${k}만큼 더 크다. ${y} + ${k} = ${y + k}`, facts: { calc: [[`${y}+${k}`, 0]] }
      });
    })
  ]);

  B.addTypes('5-1-3', 'read', [
    T('rd-expr-add', '식을 보고 표 채우기(더하기)', '①55 ③55 심35', (d) => {
      const s = d.pick(SYMS), k = d.int(4, 9), a = d.int(2, 9);
      return M(`${eqj([0, '+', k, 1], s, '과/와')} 같은 대응 관계를 나타낸 표이다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: a + 5 }, { label: LABELS[1], answer: a + 9 + k }], {
        figure: tableOf([[s[0], a, a + 3, box(LABELS[0]), a + 9], [s[1], a + k, a + 3 + k, a + 5 + k, box(LABELS[1])]]),
        explain: `${jo(s[1], '은/는')} ${s[0]}보다 ${k}만큼 더 크다. ㉠은 ${a + 5 + k} − ${k} = ${a + 5}, ㉡은 ${a + 9} + ${k} = ${a + 9 + k}이다.`, facts: { calc: [[`${a + 5 + k}-${k}`, 0], [`${a + 9}+${k}`, 1]] }
      });
    }),
    T('rd-expr-mul', '식을 보고 표 채우기(몇 배)', '①55 ③55 심35', (d) => {
      const s = d.pick(SYMS), k = d.int(3, 9), a = d.int(2, 4);
      return M(`${eqj([0, '*', k, 1], s, '과/와')} 같은 대응 관계를 나타낸 표이다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: a + 5 }, { label: LABELS[1], answer: (a + 7) * k }], {
        figure: tableOf([[s[0], a, a + 3, box(LABELS[0]), a + 7], [s[1], a * k, (a + 3) * k, (a + 5) * k, box(LABELS[1])]]),
        explain: `${jo(s[1], '은/는')} ${s[0]}의 ${k}배이다. ㉠은 ${(a + 5) * k} ÷ ${k} = ${a + 5}, ㉡은 ${a + 7} × ${k} = ${(a + 7) * k}이다.`, facts: { calc: [[`${(a + 5) * k}/${k}`, 0], [`${a + 7}*${k}`, 1]] }
      });
    }),
    T('rd-claims', '식에 대한 설명', '①53 ②20·21 ③54 심34', (d) => {
      // 틀린 보기(답): 두 양이 따로 변한다고 본 것, 몇 배의 방향을 바꾼 것, 곱하지 않고 더한 값을 넣은 것
      const [a, b, text] = d.pick([['꽃병', '장미', (k) => `꽃병 한 개에 장미가 ${k}송이씩 꽂혀 있다.`], ['상자', '사과', (k) => `사과가 한 상자에 ${k}개씩 들어 있다.`], ['접시', '만두', (k) => `만두가 한 접시에 ${k}개씩 놓여 있다.`]]);
      const k = d.int(4, 9), m = d.int(3, 8), s = d.pick(SYMS), A = a + '의 수', B2 = b + '의 수';
      const wrong = d.pick([[`${s[0]}의 값이 변해도 ${s[1]}의 값은 변하지 않는다.`, `${jo(s[0], '이/가')} 1, 2, 3으로 변하면 ${jo(s[1], '은/는')} ${k}, ${2 * k}, ${josa(3 * k, '으로/로')} 따라 변한다.`], [`${jo(A, '은/는')} ${B2}의 ${k}배이다.`, `${jo(B2, '이/가')} ${A}의 ${k}배이다. ${jo(A, '은/는')} ${jo(B2, '을/를')} ${josa(k, '으로/로')} 나눈 몫이다.`], [`${jo(s[0], '이/가')} ${m}일 때 ${jo(s[1], '은/는')} ${m + k}이다.`, `${jo(s[0], '이/가')} ${m}일 때 ${jo(s[1], '은/는')} ${m} × ${k} = ${m * k}이다.`]]);
      const rows = d.shuffle([[`${jo(s[1], '이/가')} ${k * (m + 1)}일 때 ${jo(s[0], '은/는')} ${m + 1}이다.`, true], [`같은 대응 관계를 ${eqj([1, '/', k, 0], s, '으로/로')} 나타낼 수도 있다.`, true], [`${jo(s[0], '과/와')} ${jo(s[1], '은/는')} 다른 기호로 바꾸어 나타낼 수 있다.`, true], [wrong[0], false]]);
      return C(`${text(k)} ${called(A, B2, s)}, 두 양 사이의 대응 관계는 ${eq([0, '*', k, 1], s)}이다. 이 식에 대한 설명으로 옳지 않은 것은?`, rows.map((row) => row[0]), rows.findIndex((row) => !row[1]), { explain: wrong[1], facts: truthOf(rows, false) });
    }),
    T('rd-swap-value', '식에 값을 넣어 말한 것', '①53 ②20 ③53', (d) => {
      // 틀린 말: 두 기호의 값을 맞바꾸어 넣은 것, 식은 한 가지로만 쓸 수 있다고 한 것
      const price = d.pick([600, 700, 800, 900]), m = d.int(4, 7), n = d.until(() => d.int(5, 9), (v) => v !== m), s = d.pick(SYMS), who = d.shuffle(NAMES).slice(0, 3);
      const rows = d.shuffle([[`${jo(s[0], '이/가')} ${price * m}이면 ${jo(s[1], '은/는')} ${m}이다.`, false], [`${jo(s[1], '이/가')} ${price * n}이면 ${jo(s[0], '은/는')} ${n}이다.`, true], ['이 대응 관계는 식 한 가지로만 나타낼 수 있다.', false]]);
      return C(`공책 한 권의 값은 ${price}원이다. 공책의 수를 ${s[0]}, 공책값을 ${s[1]}원이라고 할 때, 두 양 사이의 대응 관계는 ${eq([0, '*', price, 1], s)}이다. 바르게 말한 사람은?`, who, rows.findIndex((row) => row[1]), {
        figure: lines(rows.map((row, i) => `${who[i]}: ${row[0]}`)), explain: `${jo(s[0], '은/는')} 공책의 수, ${jo(s[1], '은/는')} 공책값이다. 공책값이 ${price * n}원이면 공책은 ${price * n} ÷ ${price} = ${n}(권)이다. 같은 관계를 ${eqj([1, '/', price, 0], s, '으로/로')} 나타낼 수도 있다.`, facts: truthOf(rows, true)
      });
    }),
    T('rd-situ-add', '뺄셈식에 알맞은 상황', '①34·56 ②63', (d) => {
      // 틀린 보기: 더 많은 상황, 몇 배인 상황, 같은 상황이지만 기호를 거꾸로 붙인 것
      const k = d.int(2, 6), s = d.pick(SYMS), e = [0, '-', k, 1], xs = [k + 1, k + 2, k + 5], flip = d.bool();
      const less = [['사과', '귤', '개'], ['형', '동생', '살']], [good, swapped] = flip ? [less[1], less[0]] : less;
      const sayLess = ([big, small, unit], first, second) => (unit === '살' ? `${small}의 나이는 ${big}의 나이보다 ${k}살 더 적다. (${first === 0 ? big : small}의 나이 ${s[0]}, ${second === 0 ? big : small}의 나이 ${s[1]})` : `${small}의 수는 ${big}의 수보다 ${k}개 더 적다. (${first === 0 ? big : small}의 수 ${s[0]}, ${second === 0 ? big : small}의 수 ${s[1]})`);
      const list = [{ text: sayLess(good, 0, 1), e, pairs: xs.map((x) => [x, x - k]) }, { text: sayLess(swapped, 1, 0), e, pairs: xs.map((x) => [x - k, x]) },
        { text: `연필의 수는 지우개의 수보다 ${k}개 더 많다. (지우개의 수 ${s[0]}, 연필의 수 ${s[1]})`, e, pairs: xs.map((x) => [x, x + k]) }, { text: `구슬의 수는 주머니의 수의 ${k}배이다. (주머니의 수 ${s[0]}, 구슬의 수 ${s[1]})`, e, pairs: xs.map((x) => [x, x * k]) }];
      const j = judge(d.shuffle(list), null, true);
      return C(`${eqj(e, s, '으로/로')} 나타낼 수 있는 상황은?`, j.options, j.answer, {
        explain: `${eqj(e, s, '은/는')} ${jo(s[1], '이/가')} ${s[0]}보다 ${k}만큼 더 작다는 식이다. ${good[1]}의 ${good[2] === '살' ? '나이' : '수'}가 ${k}만큼 더 작고, 큰 쪽에 ${s[0]}, 작은 쪽에 ${jo(s[1], '을/를')} 붙인 상황을 찾는다.`, facts: j.facts
      });
    }),
    T('rd-situ-mul', '곱셈식에 알맞은 상황', '①34 ②63 ③57', (d) => {
      // 틀린 보기: 한 묶음의 수가 다른 상황, 한 묶음의 수는 같지만 기호를 거꾸로 붙인 것
      const SITU = { 4: [['강아지의 수', '강아지 다리의 수'], ['자동차의 수', '바퀴의 수']], 6: [['개미의 수', '개미 다리의 수'], ['육각형의 수', '꼭짓점의 수']], 8: [['문어의 수', '문어 다리의 수'], ['팔각형의 수', '변의 수']], 3: [['세발자전거의 수', '바퀴의 수']], 5: [['오각형의 수', '변의 수']] };
      const k = d.pick([4, 6, 8]), s = d.pick(SYMS), e = [0, '*', k, 1], [good, swapped] = d.shuffle(SITU[k]), others = d.shuffle([3, 4, 5, 6, 8].filter((v) => v !== k)).slice(0, 2);
      const list = [{ text: `${s[0]}: ${good[0]}, ${s[1]}: ${good[1]}`, e, pairs: [1, 2, 3].map((x) => [x, k * x]) }, { text: `${s[0]}: ${swapped[1]}, ${s[1]}: ${swapped[0]}`, e, pairs: [1, 2, 3].map((x) => [k * x, x]) }]
        .concat(others.map((v) => ({ text: `${s[0]}: ${SITU[v][0][0]}, ${s[1]}: ${SITU[v][0][1]}`, e, pairs: [1, 2, 3].map((x) => [x, v * x]) })));
      const j = judge(d.shuffle(list), null, true);
      return C(`${eqLead(e, s)}${josa(k, '으로/로').slice(String(k).length)} 나타낼 수 있는 두 양은?`, j.options, j.answer, {
        explain: `${eqLead(e, s)}${josa(k, '은/는').slice(String(k).length)} ${jo(s[1], '이/가')} ${s[0]}의 ${k}배라는 식이다. ${jo(good[1], '은/는')} ${good[0]}의 ${k}배이고, 작은 쪽에 ${s[0]}, 큰 쪽에 ${jo(s[1], '을/를')} 붙였다.`, facts: j.facts
      });
    }),
    T('rd-situ-div', '나눗셈식에 알맞은 상황', '③57 심36', (d) => {
      // 나눗셈식에서는 나누어지는 쪽이 큰 양이다. 틀린 보기: 기호를 거꾸로 붙인 것, 한 묶음의 수가 다른 것
      const SITU = { 3: [['세발자전거의 수', '바퀴의 수'], ['삼각형의 수', '변의 수']], 5: [['오각형의 수', '꼭짓점의 수'], ['손의 수', '손가락의 수']], 4: [['코끼리의 수', '코끼리 다리의 수']], 6: [['개미의 수', '개미 다리의 수']], 8: [['문어의 수', '문어 다리의 수']] };
      const k = d.pick([3, 5]), s = d.pick(SYMS), e = [1, '/', k, 0], [good, swapped] = d.shuffle(SITU[k]), others = d.shuffle([4, 6, 8]).slice(0, 2);
      const list = [{ text: `${s[0]}: ${good[0]}, ${s[1]}: ${good[1]}`, e, pairs: [1, 2, 3].map((x) => [x, k * x]) }, { text: `${s[0]}: ${swapped[1]}, ${s[1]}: ${swapped[0]}`, e, pairs: [1, 2, 3].map((x) => [k * x, x]) }]
        .concat(others.map((v) => ({ text: `${s[0]}: ${SITU[v][0][0]}, ${s[1]}: ${SITU[v][0][1]}`, e, pairs: [1, 2, 3].map((x) => [x, v * x]) })));
      const j = judge(d.shuffle(list), null, true);
      return C(`${eqLead(e, s)}${josa(k, '으로/로').slice(String(k).length)} 나타낼 수 있는 두 양은?`, j.options, j.answer, {
        explain: `${eqLead(e, s)}${josa(k, '은/는').slice(String(k).length)} ${jo(s[1], '을/를')} ${josa(k, '으로/로')} 나누면 ${jo(s[0], '이/가')} 된다는 식이므로 ${jo(s[1], '이/가')} 큰 쪽의 양이다. ${jo(good[1], '은/는')} ${good[0]}의 ${k}배이고, 큰 쪽에 ${jo(s[1], '을/를')} 붙였다.`, facts: j.facts
      });
    })
  ]);

  B.addGroup('5-1-3', {
    id: 'hard', title: '실력 문제', standard: STD,
    types: [
      H('hd-first-add', '첫 짝만 보면 몇 배로 보이는 표', '13·31, 기본 ①9·49 ②36', (d) => {
        // 첫 짝(2와 4)만 보면 2배와 2 더하기가 모두 맞는다. 둘째 짝에서 더하기임이 드러난다. 2배로 보면 답이 달라진다.
        const [p, q] = d.shuffle(NAMES).slice(0, 2), [a, m] = d.pick([[2, 2], [3, 2], [4, 2], [2, 3], [3, 3]]), k = a * (m - 1), xs = [a, a + 1, a + 3, a + 6];
        return N(`${name(p, '이/가')} 수를 말하면 ${name(q, '은/는')} 규칙에 따라 답한다. 표의 ㉠에 알맞은 수는?`, xs[3] + k, {
          figure: tableOf([[`${name(p, '이/가')} 말한 수`].concat(xs), [`${name(q, '이/가')} 답한 수`, xs[0] + k, xs[1] + k, xs[2] + k, box(LABELS[0])]]),
          explain: `${xs[0]}에 ${xs[0] + k}만 보면 ${m}배로도 보이지만, ${xs[1]}에 ${xs[1] + k}, ${xs[2]}에 ${josa(xs[2] + k, '이/가')} 대응하므로 말한 수에 ${josa(k, '을/를')} 더한 수를 답한다. ${xs[3]} + ${k} = ${xs[3] + k}`, facts: { calc: [[`${xs[3]}+(${xs[1] + k}-${xs[1]})`, 0]] }
        });
      }),
      H('hd-first-mul', '첫 짝만 보면 더하기로 보이는 표', '13·31, 기본 ①49 ②36', (d) => {
        // 첫 짝(2와 4)만 보면 2 더하기와 2배가 모두 맞는다. 둘째 짝에서 몇 배임이 드러난다. 더하기로 보면 답이 달라진다.
        const s = d.pick(SYMS), [a, m] = d.pick([[2, 2], [3, 2], [4, 2], [2, 3], [3, 3]]), xs = [a, a + 1, a + 3, a + 6];
        return N(`표에서 ${jo(s[0], '과/와')} ${s[1]} 사이의 대응 관계를 찾아 ㉠에 알맞은 수를 구하면?`, xs[3] * m, {
          figure: tableOf([[s[0]].concat(xs), [s[1], xs[0] * m, xs[1] * m, xs[2] * m, box(LABELS[0])]]),
          explain: `${xs[0]}에 ${xs[0] * m}만 보면 ${a * (m - 1)}만큼 더 큰 수로도 보이지만, ${xs[1]}에 ${xs[1] * m}, ${xs[2]}에 ${josa(xs[2] * m, '이/가')} 대응하므로 ${jo(s[1], '은/는')} ${s[0]}의 ${m}배이다. ${xs[3]} × ${m} = ${xs[3] * m}`, facts: { calc: [[`${xs[3]}*(${xs[1] * m}/${xs[1]})`, 0]] }
        });
      }),
      H('hd-skip-mul', '칸을 건너뛴 표에 없는 값', '5·18', (d) => {
        // 옆 칸과의 차(한 묶음의 수의 몇 배)를 한 묶음의 수로 읽으면 틀린다. 표에 없는 값을 묻는다.
        const g = d.pick([2, 3]), k = d.int(6, 9), x = d.pick(g === 2 ? [5, 7, 9] : [5, 7, 8]);
        return N(`상자마다 구슬을 같은 수만큼 넣고, 상자의 수와 구슬의 수를 표로 나타냈다. 상자가 ${x}개일 때 구슬은 몇 개인가?`, x * k, {
          unit: '개', figure: tableOf([['상자의 수(개)'].concat(range(4, 1).map((i) => g * i)), ['구슬의 수(개)'].concat(range(4, 1).map((i) => g * i * k))]),
          explain: `상자 ${g}개에 구슬 ${g * k}개이므로 한 상자에 ${g * k} ÷ ${g} = ${k}(개)씩 넣었다. 옆 칸과의 차 ${josa(g * k, '은/는')} 상자 ${g}개에 든 구슬의 수이다. 상자가 ${x}개일 때 구슬은 ${x} × ${k} = ${x * k}(개)이다.`, facts: { calc: [[`${x}*(${g * k}/${g})`, 0]] }
        });
      }),
      H('hd-skip-add', '칸을 건너뛴 표에서 거꾸로 구하기', '49, 기본 ①25·43 ②30', (d) => {
        // 첫 짝(3과 9)만 보면 3배로 보이고, 옆 칸만 보면 「3씩 커진다」로 읽힌다. 위아래 짝의 차가 관계이다. 표에 없는 값을 거꾸로 묻는다.
        const [g, k] = d.pick([[3, 6], [2, 4], [4, 8], [3, 9], [2, 6]]), s = d.pick(SYMS), y = d.until(() => d.int(31, 58), (v) => (v - k) % g !== 0);
        return N(`${jo(s[0], '과/와')} ${s[1]} 사이의 대응 관계를 나타낸 표이다. ${jo(s[1], '이/가')} ${y}일 때 ${s[0]}의 값은?`, y - k, {
          figure: tableOf([[s[0]].concat(range(4, 1).map((i) => g * i)), [s[1]].concat(range(4, 1).map((i) => g * i + k))]),
          explain: `${g}에 ${g + k}만 보면 ${(g + k) / g}배로도 보이지만, ${2 * g}에 ${2 * g + k}, ${3 * g}에 ${josa(3 * g + k, '이/가')} 대응하므로 ${jo(s[1], '은/는')} ${s[0]}보다 ${k}만큼 더 크다. ${josa(g, '은/는')} 옆 칸과의 차일 뿐이다. ${y} − ${k} = ${y - k}`, facts: { calc: [[`${y}-(${2 * g + k}-${2 * g})`, 0]] }
        });
      }),
      H('hd-cut-back', '도막의 수에서 자른 횟수 구하기', '69, 기본 ①44 ②47 ③33', (d) => {
        // 자른 횟수와 도막의 수를 같게 보면 틀린다. 그림도 표도 주지 않는다.
        const what = d.pick(['통나무', '긴 끈', '가래떡']), m = d.int(12, 25);
        return N(`${what} 한 개를 ${m}도막으로 자르려면 몇 번 잘라야 하는가?`, m - 1, {
          unit: '번', explain: `1번 자르면 2도막, 2번 자르면 3도막이 된다. 자른 횟수는 도막의 수보다 1만큼 더 작으므로 ${m} − 1 = ${m - 1}(번)이다.`, facts: { calc: [[`${m}-1`, 0]], unseen: [1] }
        });
      }),
      H('hd-age-ratio', '올해 나이가 몇 배인 두 사람', '23·51', (d) => {
        // 나이는 차가 변하지 않는다. 몇 배라는 관계는 올해에만 맞는다.
        const child = d.pick(NAMES), elder = d.pick(ELDERS), c = d.int(10, 12), r = d.pick([3, 4]), e = c * r, t = c + d.int(5, 10);
        return N(`올해 ${name(child, '은/는')} ${c}살이고, ${elder}의 나이는 ${nick(child)} 나이의 ${r}배인 ${e}살이다. ${name(child, '이/가')} ${t}살이 될 때 ${jo(elder, '은/는')} 몇 살인가?`, t + e - c, {
          unit: '살', explain: `두 사람의 나이의 차는 ${e} − ${c} = ${e - c}(살)로 변하지 않는다. ${t} + ${e - c} = ${t + e - c}(살)이다. 그때 ${elder}의 나이는 ${nick(child)} 나이의 ${r}배(${t * r}살)가 아니다.`, facts: { calc: [[`${t}+(${e}-${c})`, 0]] }
        });
      }),
      H('hd-change', '대응 관계로 구한 값으로 한 번 더 셈하기', '42, 기본 ②54', (d) => {
        const fee = d.pick([1200, 1500, 1800]), n = d.pick(fee === 1800 ? [5] : [5, 6]);
        return N(`전시회의 입장객 수와 입장료 사이의 대응 관계를 표로 나타냈다. ${n}명이 들어가면서 10000원을 냈을 때 거스름돈은 얼마인가?`, 10000 - fee * n, {
          unit: '원', figure: table(['입장객의 수(명)', '입장료(원)'], [[1, fee], [2, 2 * fee], [3, 3 * fee]]), explain: `입장료는 입장객 수의 ${fee}배이다. ${n}명의 입장료는 ${n} × ${fee} = ${fee * n}(원)이므로 거스름돈은 10000 − ${fee * n} = ${10000 - fee * n}(원)이다.`, facts: { calc: [[`10000-${n}*${fee}`, 0]] }
        });
      }),
      H('hd-total', '한 양에서 다른 양을 구해 합하기', '57, 기본 ②54', (d) => {
        const k = d.pick([2, 3]), m = d.int(15, 30), shapes = range(3, 1).map((n) => shape(twoRows(n, k, 'k', 'w')));
        return N(`규칙에 따라 바둑돌을 늘어놓았다. 흰 바둑돌이 ${m}개인 모양에 놓인 검은 바둑돌과 흰 바둑돌은 모두 몇 개인가?`, 2 * m - k, {
          unit: '개', figure: steps(shapes, ORD, told(shapes, ORD)), explain: `흰 바둑돌의 수는 검은 바둑돌의 수보다 ${1 + k} − 1 = ${k}만큼 더 크다. 검은 바둑돌은 ${m} − ${k} = ${m - k}(개)이므로 모두 ${m - k} + ${m} = ${2 * m - k}(개)이다.`, facts: { calc: [[`${m}+${m}-(${1 + k}-1)`, 0]] }
        });
      }),
      H('hd-per-one', '묶음으로 준 대응(앞으로)', '44, 기본 ①54', (d) => {
        // 2잔에 8개를 「1잔에 8개」로 읽으면 틀린다. 구하는 잔의 수는 묶음의 몇 배가 아니다.
        const g = d.pick([2, 3, 4]), per = d.int(3, 6), m = d.until(() => d.int(5, 11), (v) => v % g !== 0);
        return N(`주스 ${g}잔을 만드는 데 딸기가 ${g * per}개 든다. 같은 주스 ${m}잔을 만드는 데 드는 딸기는 몇 개인가?`, per * m, {
          unit: '개', explain: `주스 1잔에 드는 딸기는 ${g * per} ÷ ${g} = ${per}(개)이다. 딸기의 수는 주스의 수의 ${per}배이므로 ${m} × ${per} = ${per * m}(개)이다.`, facts: { calc: [[`${g * per}/${g}*${m}`, 0]] }
        });
      }),
      H('hd-per-back', '묶음으로 준 대응(거꾸로)', '5·39, 기본 ③21', (d) => {
        const g = d.pick([3, 4, 5]), one = d.pick([300, 400, 500]), n = d.until(() => d.int(11, 19), (v) => v % g !== 0);
        return N(`머리끈 ${g}개의 값은 ${g * one}원이다. 같은 머리끈을 ${one * n}원어치 샀다면 산 머리끈은 몇 개인가?`, n, {
          unit: '개', explain: `머리끈 1개의 값은 ${g * one} ÷ ${g} = ${one}(원)이다. 머리끈의 값은 머리끈의 수의 ${one}배이므로 ${one * n} ÷ ${one} = ${n}(개)이다.`, facts: { calc: [[`${one * n}/(${g * one}/${g})`, 0]] }
        });
      }),
      H('hd-per-ten', '단위를 바꾸어 넣기', '41', (d) => {
        const fee = d.pick([300, 400, 500]), min = d.pick([20, 30, 40, 50]);
        return N(`어느 주차장의 주차 요금은 10분에 ${fee}원이다. 이 주차장에 1시간 ${min}분 동안 주차하면 요금은 얼마인가?`, ((60 + min) / 10) * fee, {
          unit: '원', explain: `1시간 ${min}분은 ${60 + min}분이고, ${60 + min}분은 10분의 ${(60 + min) / 10}배이다. 요금은 ${(60 + min) / 10} × ${fee} = ${((60 + min) / 10) * fee}(원)이다.`, facts: { calc: [[`(1*60+${min})/10*${fee}`, 0]], unseen: [60] }
        });
      }),
      H('hd-two-sum', '두 대응을 합쳐 하나의 대응으로 보기', '27', (d) => {
        const [a, b] = d.pick([[7, 8], [6, 9], [8, 4], [7, 5], [9, 6]]), t = d.int(6, 12);
        return N(`1분에 물이 ${a} L씩 나오는 수도와 ${b} L씩 나오는 수도를 함께 틀어 빈 물통에 물을 받는다. 물통에 물이 ${(a + b) * t} L 찼을 때는 수도를 튼 지 몇 분 뒤인가?`, t, {
          unit: '분', explain: `두 수도에서 1분에 나오는 물은 ${a} + ${b} = ${a + b}(L)이다. 받은 물의 양은 시간의 ${a + b}배이므로 ${(a + b) * t} ÷ ${a + b} = ${t}(분)이다.`, facts: { calc: [[`${(a + b) * t}/(${a}+${b})`, 0]] }
        });
      }),
      H('hd-time-cross', '오전과 오후에 걸친 두 도시의 시각', '53, 기본 ①41', (d) => {
        // 오후 1시와 오전 4시의 차를 1과 4의 차(3시간)로 보면 틀린다. 낮 12시를 지나 9시간이다.
        const [city, gap] = d.pick([['런던', 9], ['파리', 8]]), g = d.int(1, 3), there = g + 12 - gap, toSeoul = d.bool(), x = toSeoul ? d.int(1, 11 - gap) : d.int(gap + 1, 11);
        return N(`어느 날 서울이 오후 ${g}시일 때 ${jo(city, '은/는')} 같은 날 오전 ${there}시였다. 이날 ${toSeoul ? `${jo(city, '이/가')} 오후 ${x}시일 때 서울은 오후 몇 시인가?` : `서울이 오후 ${x}시일 때 ${jo(city, '은/는')} 오후 몇 시인가?`}`, toSeoul ? x + gap : x - gap, {
          lead: '오후', unit: '시', explain: `오전 ${there}시에서 낮 12시까지 ${12 - there}시간, 낮 12시에서 오후 ${g}시까지 ${g}시간이므로 서울의 시각은 ${city}의 시각보다 ${12 - there} + ${g} = ${gap}(시간) 빠르다. ${toSeoul ? `${x} + ${gap} = ${x + gap}이므로 서울은 오후 ${x + gap}시이다.` : `${x} − ${gap} = ${x - gap}이므로 ${jo(city, '은/는')} 오후 ${x - gap}시이다.`}`,
          facts: { calc: [[toSeoul ? `${x}+((12-${there})+${g})` : `${x}-((12-${there})+${g})`, 0]], unseen: [12] }
        });
      }),
      H('hd-poly', '꼭짓점의 수와 나누어진 삼각형의 수', '기본 ③34', (d) => {
        // 꼭짓점의 수와 삼각형의 수를 같게 보거나 하나 차이로 보면 틀린다(둘 차이).
        const n = d.pick([10, 12, 15, 20]), shapes = [4, 5, 6].map(fan), names = ['사각형', '오각형', '육각형'];
        return N(`다각형의 한 꼭짓점에서 대각선을 모두 그어 다각형을 삼각형으로 나누었다. 같은 방법으로 꼭짓점이 ${n}개인 다각형을 나누면 삼각형은 몇 개가 되는가?`, n - 2, {
          unit: '개', figure: steps(shapes, names, '한 꼭짓점에서 대각선을 모두 그어 나눈 다각형: 사각형은 꼭짓점 4개에 삼각형 2개, 오각형은 꼭짓점 5개에 삼각형 3개, 육각형은 꼭짓점 6개에 삼각형 4개', 26),
          explain: `꼭짓점이 4개, 5개, 6개일 때 삼각형은 2개, 3개, 4개이다. 삼각형의 수는 꼭짓점의 수보다 4 − 2 = 2만큼 더 작으므로 ${n} − 2 = ${n - 2}(개)이다.`, facts: { calc: [[`${n}-(4-2)`, 0]] }
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
