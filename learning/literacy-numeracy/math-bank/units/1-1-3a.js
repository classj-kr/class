// 1학년 1학기 3단원 덧셈과 뺄셈 — 단원 틀, 그림 도구, 기본 문항(모으기와 가르기 · 이야기 만들기 · 덧셈식 · 덧셈하기).
// 수집해 둔 평가 자료(미래엔·아이스크림미디어·천재 — 기본 24개 문서, 심화·실력 5개 문서)에서 뽑은 꼴 목록
// (기본꼴_1 69꼴, 심화꼴 54꼴)을 하나씩 옮긴 것이다. 꼴(무엇을 주고 무엇을 묻는가)만 가져오고 수와 상황은 새로 썼다.
// 유형마다 꼴 번호를 적는다: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
//
// 영역은 수와 연산이다. 성취기준 2수01-04(모으기와 가르기), 2수01-05(덧셈과 뺄셈의 의미), 2수01-06 가운데 합이 9까지인 덧셈과 한 자리 수끼리의 뺄셈.
//
// 싣는 기준
//  - 수는 모두 한 자리 수이고 합은 9까지이다. 0은 「0이 있는 덧셈과 뺄셈」 묶음부터 나온다.
//  - 답은 숫자만 적거나 보기에서 고른다. 이야기 짓기·식 읽는 말 쓰기처럼 한글을 적는 꼴은 수 빈칸이나 고르기로 바꾸어 실었다
//    (①15·①16·①20·①31·①36, 심14·심15·심17·심29).
//  - 긋기·그리기 꼴은 수로 물을 수 있으면 수로 물었다: ○ 그리기(①8·심4) → 빈 곳에 놓을 ○의 수, 점 그리기(심5) → 더 그려야 하는 수,
//    두 수 묶기·잇기(①9·①19·①28·①48·심6·심19) → 고르기·짝 짓기.
//  - 「모두 고르기」(답 여럿)는 맞는 것이 하나뿐이게 보기를 다시 짰다(①6·①20·①24·①25·①35·①41·①46·①49, 심8·심40).
//  - 문장제는 얼개마다 한 번씩 싣는다: 합치기·늘어나기(덧셈하기), 덜어 내기·두 양의 차(뺄셈하기), 더 많은 쪽·더 적은 쪽·누가 더·나눈 나머지·셋 가운데(덧셈과 뺄셈).
//
// 뺀 것과 까닭
//  - 세 수를 잇달아 셈하는 문장제(①65·①66·①67, 심52·심53·심54): 1학년 2학기 「덧셈과 뺄셈(1)」의 세 수의 덧셈과 뺄셈이다.
//  - 가른 두 수에 차 조건이 붙은 것(①68, 심12): 합과 차로 두 수를 찾는 조건 풀이이다.
//  - 가르는 방법의 수 세기(①69): 경우를 빠짐없이 세는 일이다.
//  - 수 카드로 만들 수 있는 뺄셈식을 모두 쓰기(①55): 식을 「모두」 만드는 서술형이다.
//  - 답이 하나로 정해지지 않는 식 만들기(①29의 숫자 카드 변형, ①42의 숫자 카드 변형, 심3, 심23).
//  - 빈칸에 들어갈 두 수의 차(심47의 뒤쪽): 뜻 없는 셈이다. 「같은 수를 빼면 0」을 쓰는 앞쪽만 실력에 실었다.
// 묻는 말: 수나 값을 물을 때는 「~은?/~는?」, 양을 물을 때는 「몇 ~인가?」로 맺는다. 「~세요/~습니다」는 쓰지 않는다.
// 1학년 1학기라 문장은 짧게, 한 문장에 한 가지만 적는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, nick, NAMES, LABELS, box, expr, cards, chain, table, lines, tagged, numbers, N, M, C, E, shown } = B.kit;
  const G = B.kit.geo;
  const GATHER = '2수01-04', MEAN = '2수01-05', CALC = '2수01-06';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  const upTo = (n) => Array.from({ length: n }, (_, i) => i + 1);
  // 합이 9까지인 두 수(둘 다 1 이상)
  const two = (d, test) => d.until(() => [d.int(1, 8), d.int(1, 8)], ([a, b]) => a + b <= 9 && (!test || test(a, b)));
  // 한 자리 수끼리의 뺄셈(차가 1 이상): [빼어지는 수, 빼는 수]
  const gap = (d, test) => d.until(() => [d.int(2, 9), d.int(1, 8)], ([a, b]) => a > b && (!test || test(a, b)));
  const labelled = (values) => values.map((v, i) => ({ label: LABELS[i], answer: v }));
  // 읽는 말
  const joinSay = (a, b) => `${josa(a, '과/와')} ${josa(b, '을/를')} 모으면 ${a + b}`;
  const splitSay = (t, a) => `${josa(t, '은/는')} ${josa(a, '과/와')} ${josa(t - a, '으로/로')} 가른다.`;
  const plusSay = (a, b, s) => `${a} 더하기 ${josa(b, '은/는')} ${josa(s, '과/와')} 같다.`;
  const sumSay = (a, b, s) => `${josa(a, '과/와')} ${b}의 합은 ${s}이다.`;
  const minusSay = (a, b, r) => `${a} 빼기 ${josa(b, '은/는')} ${josa(r, '과/와')} 같다.`;
  const diffSay = (a, b, r) => `${josa(a, '과/와')} ${b}의 차는 ${r}이다.`;

  // ── 그림 ─────────────────────────────────────────────────────
  // 세는 물건은 간단한 도형으로 그리고 색으로 무리를 가른다. 수는 그림 설명(aria-label)에 적는다.
  const PAINT = { red: ['#f0715f', '#b42318'], blue: ['#6aa5f8', '#1d4ed8'], yellow: ['#f7c948', '#a86a00'], green: ['#6cc48a', '#15803d'], white: ['#fff3d6', '#8a6d3b'], dark: ['#64748b', '#1f2933'] };
  const starPath = (x, y) => { let p = ''; for (let i = 0; i < 10; i += 1) { const r = i % 2 ? 4.1 : 9, t = (Math.PI * i) / 5 - Math.PI / 2; p += (i ? 'L' : 'M') + (x + r * Math.cos(t)).toFixed(1) + ' ' + (y + r * Math.sin(t)).toFixed(1); } return p + 'Z'; };
  // 물건 하나. out 이면 옅게 칠하고 ×표를 한다(덜어 낸 것).
  function thing(kind, color, x, y, out) {
    const paint = PAINT[color], look = 'style="fill:' + paint[0] + ';stroke:' + paint[1] + ';stroke-width:1' + (out ? ';fill-opacity:0.3;stroke-opacity:0.6' : '') + '"';
    let body;
    if (kind === 'block') body = '<rect x="' + (x - 7.5) + '" y="' + (y - 7.5) + '" width="15" height="15" rx="2.5" ' + look + '/>';
    else if (kind === 'star') body = '<path d="' + starPath(x, y + 0.5) + '" ' + look + '/>';
    else if (kind === 'balloon') body = '<path d="M' + x + ' ' + (y + 5) + 'q-2.5 3 0 6" style="fill:none;stroke:#5b6770;stroke-width:0.9"/><ellipse cx="' + x + '" cy="' + (y - 2) + '" rx="6.6" ry="7.6" ' + look + '/>';
    else if (kind === 'apple') body = '<path d="M' + x + ' ' + (y - 5.5) + 'q1 -4 4 -4.5" style="fill:none;stroke:#6b4f2a;stroke-width:1.3"/><circle cx="' + x + '" cy="' + (y + 1.5) + '" r="7.2" ' + look + '/>';
    else if (kind === 'egg') body = '<ellipse cx="' + x + '" cy="' + y + '" rx="6.3" ry="8" ' + look + '/>';
    else body = '<circle cx="' + x + '" cy="' + y + '" r="7.5" ' + look + '/>';
    return body + (out ? '<path class="mb-strike" d="M' + (x - 8) + ' ' + (y - 8) + 'L' + (x + 8) + ' ' + (y + 8) + 'M' + (x + 8) + ' ' + (y - 8) + 'L' + (x - 8) + ' ' + (y + 8) + '"/>' : '');
  }
  // 줄지어 놓은 물건. rows: 줄마다 무리의 목록 [{ n, kind, color, out }] — out 은 그 무리의 뒤쪽부터 ×표 한 개수.
  // 한 무리 안에서는 다섯 개마다 조금 띄우고 무리 사이는 넓게 띄운다. 줄이 여럿이면 왼쪽 끝이 맞아 하나씩 짝 지어 볼 수 있다.
  // said: 그림 설명. o.frame: 한 묶음으로 둘러 주고 무리 사이에 금을 긋는다(가르기 그림). o.scale: 그림 배율.
  function scene(rows, said, o) {
    const opt = o || {}, step = 21, five = 7, between = 24, pad = 12, rowH = 27, cuts = [];
    let body = '', right = 0;
    rows.forEach((groups, r) => {
      let x = pad; const y = 17 + r * rowH;
      groups.forEach((g, k) => {
        if (k) { cuts.push(x + 10.5); x += between; }
        for (let i = 0; i < g.n; i += 1) {
          if (i && i % 5 === 0) x += five;
          body += thing(g.kind, g.color, x + 9, y, i >= g.n - (g.out || 0));
          x += step;
        }
      });
      right = Math.max(right, x - step + 18);
    });
    const height = 34 + (rows.length - 1) * rowH, inner = right + pad, width = Math.max(inner, 64);
    if (opt.frame) body = '<rect x="3" y="3" width="' + (inner - 6) + '" height="' + (height - 6) + '" rx="9" style="fill:#f8fafc;stroke:#8a96a3;stroke-width:1.2"/>' + cuts.map((x) => '<path d="M' + x + ' 6V' + (height - 6) + '" style="fill:none;stroke:#8a96a3;stroke-width:1.2;stroke-dasharray:3 3"/>').join('') + body;
    return '<svg class="mb-dots" viewBox="0 0 ' + width + ' ' + height + '" width="' + Math.round(width * (opt.scale || 1.15)) + '" role="img" aria-label="' + said + '"><g transform="translate(' + (width - inner) / 2 + ' 0)">' + body + '</g></svg>';
  }
  // 두 무리로 놓는 물건: [이름, 모양, 색], 둘을 아우르는 이름
  const PAIRS = [
    { a: ['빨간 구슬', 'bead', 'red'], b: ['파란 구슬', 'bead', 'blue'], all: '구슬' },
    { a: ['노란 풍선', 'balloon', 'yellow'], b: ['초록 풍선', 'balloon', 'green'], all: '풍선' },
    { a: ['빨간 블록', 'block', 'red'], b: ['노란 블록', 'block', 'yellow'], all: '블록' },
    { a: ['파란 별', 'star', 'blue'], b: ['노란 별', 'star', 'yellow'], all: '별' }
  ];
  const group = (side, n) => ({ n, kind: side[1], color: side[2] });
  // 한 줄에 나란히 놓인 두 무리(합치기), 두 줄로 놓인 두 무리(비교하기)
  const duo = (theme, a, b, o) => scene([[group(theme.a, a), group(theme.b, b)]], theme.a[0] + ' ' + a + '개, ' + theme.b[0] + ' ' + b + '개', o);
  const pairRows = (theme, a, b, o) => scene([[group(theme.a, a)], [group(theme.b, b)]], '윗줄에 ' + theme.a[0] + ' ' + a + '개, 아랫줄에 ' + theme.b[0] + ' ' + b + '개', o);
  // 덜어 내는 물건: ×표 한 것이 덜어 낸 것이다.
  const GONE = [
    { name: '풍선', kind: 'balloon', color: 'red', gone: '터진', did: '개가 터져서', past: '개가 터졌다' },
    { name: '사과', kind: 'apple', color: 'red', gone: '먹은', did: '개를 먹어서', past: '개를 먹었다' },
    { name: '달걀', kind: 'egg', color: 'white', gone: '깨진', did: '개가 깨져서', past: '개가 깨졌다' }
  ];
  const taken = (theme, t, k, o) => scene([[{ n: t, kind: theme.kind, color: theme.color, out: k }]], theme.name + ' ' + t + '개, 그 가운데 ×표 한 것 ' + k + '개', o);
  const plain = (theme, t, o) => scene([[{ n: t, kind: theme.kind, color: theme.color }]], theme.name + ' ' + t + '개', o);

  // 가지 그림의 칸. 수가 아니면 빈칸(굵은 테두리)으로 그리고, '□' 는 아무것도 적지 않는다.
  const slot = (x, y, v, w, h) => {
    const blank = typeof v !== 'number';
    return '<rect x="' + (x - w / 2) + '" y="' + (y - h / 2) + '" width="' + w + '" height="' + h + '" rx="7" style="fill:' + (blank ? '#ffffff' : '#eaf1fe') + ';stroke:#1f2933;stroke-width:' + (blank ? 1.9 : 1.1) + '"/>'
      + '<text x="' + x + '" y="' + (y + (blank ? 4.6 : 5.8)) + '" text-anchor="middle" style="font-size:' + (blank ? 13 : 17) + 'px;font-weight:700;fill:#1f2933">' + (v === '□' ? '' : v) + '</text>';
  };
  const limb = (x1, y1, x2, y2) => '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" style="fill:none;stroke:#5b6770;stroke-width:1.5"/>';
  // 모으기·가르기 가지 그림. whole 은 한 칸짜리 수, left·right 는 두 칸짜리 수.
  // join 이면 모으기(위 칸 둘, 아래 칸 하나), 아니면 가르기(위 칸 하나, 아래 칸 둘).
  function bond(whole, left, right, join, scale) {
    const top = 18, bottom = 62, said = join ? '모으기: 위의 수 ' + left + ', ' + right + ', 아래의 수 ' + whole : '가르기: 위의 수 ' + whole + ', 아래의 수 ' + left + ', ' + right;
    const body = join
      ? limb(22, top + 14, 52, bottom - 14) + limb(82, top + 14, 52, bottom - 14) + slot(22, top, left, 34, 28) + slot(82, top, right, 34, 28) + slot(52, bottom, whole, 34, 28)
      : limb(52, top + 14, 22, bottom - 14) + limb(52, top + 14, 82, bottom - 14) + slot(52, top, whole, 34, 28) + slot(22, bottom, left, 34, 28) + slot(82, bottom, right, 34, 28);
    return '<svg class="mb-dots" viewBox="0 0 104 80" width="' + Math.round(104 * (scale || 1.3)) + '" role="img" aria-label="' + said + '">' + body + '</svg>';
  }
  // 두 번 가르기: t 를 a 와 ㉠ 으로, a 를 다시 b 와 ㉡ 으로 가른다.
  function bond2(t, a, b) {
    return '<svg class="mb-dots" viewBox="0 0 118 112" width="153" role="img" aria-label="두 번 가르기: 위의 수 ' + t + ', 가운데 줄 ' + a + ', ㉠, 아랫줄 ' + b + ', ㉡">'
      + limb(70, 29, 42, 43) + limb(70, 29, 98, 43) + limb(42, 69, 18, 83) + limb(42, 69, 66, 83)
      + slot(70, 16, t, 32, 26) + slot(42, 56, a, 32, 26) + slot(98, 56, LABELS[0], 32, 26) + slot(18, 96, b, 32, 26) + slot(66, 96, LABELS[1], 32, 26) + '</svg>';
  }
  // ○ 로 나타낸 가르기 그림. 칸마다 ○ 의 수를 주고, 수가 아니면 빈칸으로 둔다.
  function dotBond(whole, left, right) {
    const cell = (x, y, v) => {
      const blank = typeof v !== 'number';
      let out = '<rect x="' + (x - 27) + '" y="' + (y - 16) + '" width="54" height="32" rx="7" style="fill:#ffffff;stroke:#1f2933;stroke-width:' + (blank ? 1.9 : 1.1) + '"/>';
      if (!blank) for (let i = 0; i < v; i += 1) out += '<circle cx="' + (x - 17.6 + (i % 5) * 8.8).toFixed(1) + '" cy="' + (v > 5 ? y - 6.5 + Math.floor(i / 5) * 13 : y) + '" r="3.4" style="fill:#f7c948;stroke:#a86a00;stroke-width:0.8"/>';
      return out;
    };
    const word = (v) => (typeof v === 'number' ? '○ ' + v + '개' : '빈칸');
    return '<svg class="mb-dots" viewBox="0 0 152 92" width="190" role="img" aria-label="가르기: 위 칸에 ' + word(whole) + ', 아래 왼쪽 칸에 ' + word(left) + ', 아래 오른쪽 칸에 ' + word(right) + '">'
      + limb(76, 38, 40, 54) + limb(76, 38, 112, 54) + cell(76, 22, whole) + cell(40, 70, left) + cell(112, 70, right) + '</svg>';
  }
  // 주사위 두 개
  const PIPS = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] };
  function dice(a, b) {
    const die = (x, n) => '<rect x="' + x + '" y="3" width="28" height="28" rx="5" style="fill:#ffffff;stroke:#1f2933;stroke-width:1.3"/>' + PIPS[n].map(([px, py]) => '<circle cx="' + (x + 14 + px * 7.5) + '" cy="' + (17 + py * 7.5) + '" r="2.7" style="fill:#1f2933"/>').join('');
    return '<svg class="mb-dots" viewBox="0 0 70 34" width="91" role="img" aria-label="주사위 두 개: 눈의 수 ' + a + ', ' + b + '">' + die(4, a) + die(38, b) + '</svg>';
  }
  // 접시 두 개에 놓인 것(동그라미). 빈 접시는 0개이다.
  function plates(l, r, what) {
    const plate = (cx, n) => {
      let out = '<ellipse cx="' + cx + '" cy="27" rx="39" ry="20" style="fill:#f8fafc;stroke:#64748b;stroke-width:1.3"/><ellipse cx="' + cx + '" cy="27" rx="31" ry="14.5" style="fill:none;stroke:#cbd5e1;stroke-width:0.8"/>';
      for (let i = 0; i < n; i += 1) { const row = Math.floor(i / 5), inRow = n > 5 ? (row ? n - 5 : 5) : n; out += '<circle cx="' + (cx + ((i % 5) - (inRow - 1) / 2) * 10.4).toFixed(1) + '" cy="' + (n > 5 ? 21.5 + row * 11 : 27) + '" r="4.4" style="fill:#e7a04f;stroke:#8a5a1c;stroke-width:0.8"/>'; }
      return out;
    };
    return '<svg class="mb-dots" viewBox="0 0 176 54" width="220" role="img" aria-label="접시 두 개: 왼쪽 접시에 ' + what + ' ' + l + '개, 오른쪽 접시에 ' + what + ' ' + r + '개">' + plate(46, l) + plate(130, r) + '</svg>';
  }
  // 같은 단원의 다른 파일이 함께 쓴다.
  B.kit.g113 = { T, ORDERS, upTo, two, gap, labelled, joinSay, splitSay, plusSay, sumSay, minusSay, diffSay, scene, PAIRS, GONE, group, duo, pairRows, taken, plain, bond, bond2, dotBond, dice, plates, GATHER, MEAN, CALC };

  B.addUnit({
    id: '1-1-3', grade: 1, semester: 1, no: 3, title: '덧셈과 뺄셈', version: 1,
    groups: [
      {
        id: 'gather', title: '모으기와 가르기', standard: GATHER,
        types: [
          T('gather-join', '두 수 모으기', '①1 심1', (d) => {
            const [a, b] = two(d, (x, y) => x + y >= 4);
            return N('두 수를 모았다. □ 안에 알맞은 수는?', a + b, { figure: bond('□', a, b, true), explain: `${joinSay(a, b)}이다.`, facts: { calc: [[E(a, '+', b), 0]] } });
          }),
          T('gather-split', '한 수 가르기', '①2 심2', (d) => {
            const t = d.int(4, 9), a = d.int(1, t - 1);
            return N('수를 두 수로 갈랐다. □ 안에 알맞은 수는?', t - a, { figure: d.bool() ? bond(t, '□', a) : bond(t, a, '□'), explain: splitSay(t, a), facts: { calc: [[E(t, '-', a), 0]] } });
          }),
          T('gather-join-pic', '그림을 보고 모으기', '①3 심1', (d) => {
            const theme = d.pick(PAIRS), [a, b] = two(d, (x, y) => x + y >= 4);
            return M('그림을 보고 모으기를 한다. ㉠, ㉡, ㉢에 알맞은 수는?', labelled([a, b, a + b]), {
              figure: duo(theme, a, b) + bond(LABELS[2], LABELS[0], LABELS[1], true),
              explain: `${theme.a[0]} ${a}개와 ${theme.b[0]} ${b}개를 모으면 ${a + b}개이다.`, facts: { calc: [[String(a), 0], [String(b), 1], [E(a, '+', b), 2]] }
            });
          }),
          T('gather-split-pic', '그림을 보고 가르기', '①4 심2', (d) => {
            const theme = d.pick(PAIRS), [a, b] = two(d, (x, y) => x + y >= 4);
            return M('그림을 보고 가르기를 한다. ㉠, ㉡, ㉢에 알맞은 수는?', labelled([a + b, a, b]), {
              figure: duo(theme, a, b, { frame: true }) + bond(LABELS[0], LABELS[1], LABELS[2]),
              explain: `${theme.all} ${a + b}개를 ${theme.a[0]} ${a}개와 ${theme.b[0]} ${b}개로 갈랐다.`, facts: { calc: [[E(a, '+', b), 0], [String(a), 1], [String(b), 2]] }
            });
          }),
          T('gather-split-dots', '가른 수만큼 놓아야 하는 ○의 수', '①8 ①4 심4', (d) => {
            const t = d.int(4, 9), a = d.int(1, t - 1);
            return N('가르기를 하였다. 빈 곳에 놓아야 하는 ○는 몇 개인가?', t - a, {
              unit: '개', figure: dotBond(t, a, '□'), explain: `위 칸의 ○는 ${t}개, 아래 왼쪽 칸의 ○는 ${a}개이다. ${splitSay(t, a)}`, facts: { calc: [[E(t, '-', a), 0]], rule: 'part' }
            });
          }),
          T('gather-more', '모두 몇 개가 되도록 더 그려야 하는 수', '심5', (d) => {
            const t = d.int(5, 9), a = d.int(1, t - 1);
            return N(`점이 모두 ${t}개가 되려면 몇 개를 더 그려야 하는가?`, t - a, {
              unit: '개', figure: scene([[{ n: a, kind: 'bead', color: 'dark' }]], '점 ' + a + '개'), explain: `그린 점은 ${a}개이다. ${splitSay(t, a)}`, facts: { calc: [[E(t, '-', a), 0]] }
            });
          }),
          T('gather-pick', '그림에 알맞은 모으기 고르기', '①5', (d) => {
            // 틀린 보기: 모은 수가 틀린 것 하나, 모으기는 옳지만 그림의 수와 다른 것 둘
            const theme = d.pick(PAIRS), [a, b] = two(d, (x, y) => x + y >= 4 && x + y <= 8 && y >= 2);
            const rows = d.shuffle([[a, b, a + b], [a, b, a + b + d.pick([-1, 1])], [a + 1, b, a + b + 1], [a, b - 1, a + b - 1]]);
            return C('그림을 보고 모으기를 바르게 한 것은?', rows.map(([x, y, s]) => `${josa(x, '과/와')} ${josa(y, '을/를')} 모으면 ${s}`), rows.findIndex(([x, y, s]) => x === a && y === b && s === a + b), {
              figure: duo(theme, a, b), explain: `${josa(theme.a[0], '은/는')} ${a}개, ${josa(theme.b[0], '은/는')} ${b}개이다. ${joinSay(a, b)}이다.`,
              facts: { truth: rows.map(([x, y, s]) => x === a && y === b && s === x + y), want: true }
            });
          }),
          T('gather-wrong', '가르기를 잘못 한 것', '①6 심8', (d) => {
            const rows = d.until(() => Array.from({ length: 4 }, () => { const t = d.int(4, 9), x = d.int(1, t - 1); return [t, x, t - x]; }), (list) => new Set(list.map(String)).size === 4 && new Set(list.map((row) => row[0])).size >= 3);
            const bad = d.int(0, 3), slip = rows[bad][2] > 1 && d.bool() ? -1 : 1;
            const said = rows.map(([t, x, y], i) => [t, x, y + (i === bad ? slip : 0)]);
            return C('가르기를 잘못 한 것은?', said.map(([t, x, y]) => `${josa(t, '은/는')} ${josa(x, '과/와')} ${y}`), bad, {
              explain: splitSay(rows[bad][0], rows[bad][1]), facts: { claimed: said.map(([t, x, y]) => [E(x, '+', y), t]), claimedWant: false }
            });
          }),
          T('gather-right', '모으기를 바르게 한 것', '①6', (d) => {
            const rows = d.until(() => Array.from({ length: 4 }, () => two(d, (x, y) => x + y >= 3)), (list) => new Set(list.map(String)).size === 4);
            const good = d.int(0, 3);
            const said = rows.map(([x, y], i) => [x, y, x + y + (i === good ? 0 : x + y >= 9 || (x + y > 3 && d.bool()) ? -1 : 1)]);
            return C('모으기를 바르게 한 것은?', said.map(([x, y, s]) => `${josa(x, '과/와')} ${josa(y, '을/를')} 모으면 ${s}`), good, {
              explain: `${joinSay(rows[good][0], rows[good][1])}이다.`, facts: { claimed: said.map(([x, y, s]) => [E(x, '+', y), s]), claimedWant: true }
            });
          }),
          T('gather-ways', '한 수를 여러 가지로 가른 것 가운데 틀린 것', '①6 ①7 심8', (d) => {
            const t = d.int(6, 9), xs = d.shuffle(upTo(t - 1)).slice(0, 4), bad = d.int(0, 3);
            const rows = xs.map((x, i) => [x, t - x + (i === bad ? (t - x > 1 && d.bool() ? -1 : 1) : 0)]);
            return C(`${josa(t, '을/를')} 두 수로 갈랐다. 잘못 가른 것은?`, rows.map(([x, y]) => `${josa(x, '과/와')} ${y}`), bad, {
              explain: `${joinSay(rows[bad][0], rows[bad][1])}이다. ${splitSay(t, rows[bad][0])}`, facts: { claimed: rows.map(([x, y]) => [E(x, '+', y), t]), claimedWant: false }
            });
          }),
          T('gather-table', '한 수를 여러 가지로 가르기', '①7 심7', (d) => {
            // 빈칸이 위에도 아래에도 있다.
            const t = d.int(5, 9), [p, q, r] = d.shuffle(upTo(t - 1)).slice(0, 3);
            return M(`${josa(t, '을/를')} 위와 아래의 두 수로 갈랐다. ㉠, ㉡에 알맞은 수는?`, labelled([t - q, t - r]), {
              figure: table(null, [['위', p, box(LABELS[0]), r], ['아래', t - p, q, box(LABELS[1])]]),
              explain: `${splitSay(t, q)} ${splitSay(t, r)}`, facts: { calc: [[E(t, '-', q), 0], [E(t, '-', r), 1]] }
            });
          }),
          T('gather-pair', '모으면 어떤 수가 되는 두 수', '①9 심6', (d) => {
            const t = d.int(5, 9);
            const rows = d.until(() => { const x = d.int(1, t - 1); return d.shuffle([[x, t - x]].concat(Array.from({ length: 3 }, () => [d.int(1, 8), d.int(1, 8)]))); },
              (list) => list.filter(([x, y]) => x + y === t).length === 1 && list.every(([x, y]) => x + y <= 9 && Math.abs(x + y - t) <= 2) && new Set(list.map(([x, y]) => [x, y].sort().join())).size === 4);
            const right = rows.findIndex(([x, y]) => x + y === t);
            return C(`모으면 ${josa(t, '이/가')} 되는 두 수는?`, rows.map(([x, y]) => `${josa(x, '과/와')} ${y}`), right, {
              explain: `${joinSay(rows[right][0], rows[right][1])}이다.`, facts: { choose: { exprs: rows.map(([x, y]) => E(x, '+', y)), rule: 'equals', target: t } }
            });
          }),
          T('gather-match', '모아서 어떤 수가 되는 수끼리 짝 짓기', '심6', (d) => {
            const t = d.int(6, 9), xs = d.shuffle(upTo(t - 1)).slice(0, 3), values = xs.map((x) => t - x);
            const list = d.shuffle(d.shuffle(ORDERS.slice(1)).slice(0, 3).concat([ORDERS[0]]));
            return C(`㉠, ㉡, ㉢과 모아서 ${josa(t, '이/가')} 되는 수를 알맞게 짝 지은 것은?`, list.map((o) => o.map((k, i) => `${LABELS[i]} ${values[k]}`).join(', ')), list.findIndex((o) => o.join() === '0,1,2'), {
              figure: tagged(xs.map((x) => `<span class="mb-expr">${x}</span>`)), explain: xs.map((x) => joinSay(x, t - x)).join(', ') + '이다.',
              facts: { match: { exprs: xs.map((x) => E(t, '-', x)), options: list.map((o) => o.map((k) => values[k])) } }
            });
          }),
          T('gather-odd', '빈칸에 들어갈 수가 다른 가르기', '①10', (d) => {
            // 빈칸이 v 인 가르기 셋과 v 보다 1 크거나 작은 가르기 하나
            const v = d.int(2, 5), w = v + d.pick([-1, 1]), given = d.shuffle(upTo(9 - v)).slice(0, 3), other = d.int(1, 9 - w);
            const rows = d.shuffle(given.map((a) => [a + v, a]).concat([[other + w, other]])), sides = rows.map(() => d.bool());
            return C('□ 안에 들어갈 수가 나머지와 다른 것은?', LABELS, rows.findIndex(([t, a]) => t - a !== v), {
              figure: G.tiles(rows.map(([t, a], i) => [LABELS[i], sides[i] ? bond(t, '□', a, false, 1) : bond(t, a, '□', false, 1)])),
              explain: `□ 안에 들어갈 수는 차례로 ${rows.map(([t, a]) => t - a).join(', ')}이다.`, facts: { choose: { exprs: rows.map(([t, a]) => E(t, '-', a)), rule: 'odd' } }
            });
          }),
          T('gather-odd-join', '모은 수가 다른 두 수', '①10', (d) => {
            const s = d.int(5, 8), o = s + d.pick([-1, 1]), x = d.int(1, o - 1);
            const rows = d.shuffle(d.shuffle(upTo(s - 1)).slice(0, 3).map((v) => [v, s - v]).concat([[x, o - x]]));
            return C('두 수를 모은 수가 나머지와 다른 것은?', rows.map(([p, q]) => `${josa(p, '과/와')} ${q}`), rows.findIndex(([p, q]) => p + q !== s), {
              explain: `모은 수는 차례로 ${rows.map(([p, q]) => p + q).join(', ')}이다.`, facts: { choose: { exprs: rows.map(([p, q]) => E(p, '+', q)), rule: 'odd' } }
            });
          }),
          T('gather-max', '빈칸에 들어갈 수가 가장 큰 모으기', '①10', (d) => {
            // 모으기 그림에서 모으는 수 하나가 빈칸이다.
            const rows = d.until(() => Array.from({ length: 3 }, () => { const t = d.int(5, 9); return [t, d.int(1, t - 1)]; }), (list) => { const v = list.map(([t, a]) => t - a).sort((p, q) => q - p); return v[0] > v[1] && new Set(list.map(String)).size === 3 && new Set(list.map((row) => row[0])).size >= 2; });
            const values = rows.map(([t, a]) => t - a), sides = rows.map(() => d.bool());
            return C('□ 안에 들어갈 수가 가장 큰 것은?', LABELS.slice(0, 3), values.indexOf(Math.max(...values)), {
              figure: G.tiles(rows.map(([t, a], i) => [LABELS[i], sides[i] ? bond(t, '□', a, true, 1) : bond(t, a, '□', true, 1)])),
              explain: `□ 안에 들어갈 수는 차례로 ${values.join(', ')}이다.`, facts: { choose: { exprs: rows.map(([t, a]) => E(t, '-', a)), rule: 'max' } }
            });
          }),
          T('gather-twice', '두 번 가르기', '심9', (d) => {
            const t = d.int(6, 9), a = d.int(3, t - 1), b = d.int(1, a - 1);
            return M('수를 두 번 갈랐다. ㉠, ㉡에 알맞은 수는?', labelled([t - a, a - b]), {
              figure: bond2(t, a, b), explain: `${splitSay(t, a)} ${splitSay(a, b)}`, facts: { calc: [[E(t, '-', a), 0], [E(a, '-', b), 1]] }
            });
          }),
          T('gather-pic-pick', '모으면 어떤 수가 되는 그림', '심11', (d) => {
            // 모은 수가 1 크거나 1 작은 그림을 섞는다.
            const theme = d.pick(PAIRS), t = d.int(5, 8), sums = d.shuffle([t, t - 1, t + 1]), rows = sums.map((s) => { const a = d.int(1, s - 1); return [a, s - a]; });
            return C(`두 가지를 모으면 ${t}개가 되는 그림은?`, LABELS.slice(0, 3), sums.indexOf(t), {
              figure: G.tiles(rows.map(([a, b], i) => [LABELS[i], duo(theme, a, b, { scale: 0.95 })])),
              explain: rows.map(([a, b], i) => `${LABELS[i]} ${joinSay(a, b)}`).join(', ') + '이다.', facts: { choose: { exprs: rows.map(([a, b]) => E(a, '+', b)), rule: 'equals', target: t } }
            });
          })
        ]
      },
      {
        id: 'story', title: '그림을 보고 이야기 만들기', standard: MEAN,
        types: [
          T('story-join', '합치는 이야기의 빈칸', '①11 심13', (d) => {
            const theme = d.pick(PAIRS), [a, b] = two(d, (x, y) => x + y >= 4);
            return M('그림을 보고 이야기를 만든다. ㉠, ㉡, ㉢에 알맞은 수는?', labelled([a, b, a + b]), {
              figure: duo(theme, a, b) + lines([`${josa(theme.a[0], '이/가')} ${box(LABELS[0])}개, ${josa(theme.b[0], '이/가')} ${box(LABELS[1])}개 있다.`, `${josa(theme.all, '은/는')} 모두 ${box(LABELS[2])}개이다.`]),
              explain: `${theme.a[0]} ${a}개와 ${theme.b[0]} ${b}개를 합하면 모두 ${a + b}개이다.`, facts: { calc: [[String(a), 0], [String(b), 1], [E(a, '+', b), 2]] }
            });
          }),
          T('story-take', '덜어 내는 이야기의 빈칸', '①12', (d) => {
            const theme = d.pick(GONE), [t, k] = gap(d, (x) => x >= 4);
            return M(`×표 한 것은 ${theme.gone} ${theme.name}이다. ㉠, ㉡, ㉢에 알맞은 수는?`, labelled([t, k, t - k]), {
              figure: taken(theme, t, k) + lines([`${josa(theme.name, '이/가')} ${box(LABELS[0])}개 있었다.`, `${box(LABELS[1])}${theme.did} ${box(LABELS[2])}개가 남았다.`]),
              explain: `${theme.name} ${t}개 가운데 ×표 한 것이 ${k}개이므로 ${t - k}개가 남았다.`, facts: { calc: [[String(t), 0], [String(k), 1], [E(t, '-', k), 2]] }
            });
          }),
          T('story-compare', '비교하는 이야기의 빈칸', '①13', (d) => {
            const theme = d.pick(PAIRS), [p, q] = gap(d), flip = d.bool(), a = flip ? q : p, b = flip ? p : q;   // 윗줄 a개, 아랫줄 b개
            const more = a > b ? theme.a[0] : theme.b[0], less = a > b ? theme.b[0] : theme.a[0];
            return M('그림을 보고 이야기를 만든다. ㉠, ㉡, ㉢에 알맞은 수는?', labelled([a, b, p - q]), {
              figure: pairRows(theme, a, b) + lines([`${josa(theme.a[0], '이/가')} ${box(LABELS[0])}개, ${josa(theme.b[0], '이/가')} ${box(LABELS[1])}개 있다.`, `${josa(more, '은/는')} ${less}보다 ${box(LABELS[2])}개 더 많다.`]),
              explain: `하나씩 짝 지으면 ${josa(more, '이/가')} ${p - q}개 남는다.`, facts: { calc: [[String(a), 0], [String(b), 1], [E(p, '-', q), 2]] }
            });
          }),
          T('story-split', '나누는 이야기의 빈칸', '①14', (d) => {
            const [a, b] = two(d, (x, y) => x + y >= 4), what = d.pick(['과자', '사탕']);
            return M('그림을 보고 이야기를 만든다. ㉠, ㉡에 알맞은 수는?', labelled([a + b, b]), {
              figure: plates(a, b, what) + lines([`${what} ${box(LABELS[0])}개를 두 접시에 나누어 담았다.`, `왼쪽 접시에 ${a}개, 오른쪽 접시에 ${box(LABELS[1])}개를 담았다.`]),
              explain: `왼쪽 접시에 ${a}개, 오른쪽 접시에 ${b}개이므로 모두 ${a + b}개이다.`, facts: { calc: [[E(a, '+', b), 0], [String(b), 1]] }
            });
          }),
          T('story-pick', '그림에 알맞은 이야기 고르기', '①15 심14 심16', (d) => {
            // 합치는 이야기와 비교하는 이야기를 섞는다. 맞는 것은 하나뿐이다.
            const theme = d.pick(PAIRS), [a, b] = two(d, (x, y) => x !== y && x + y >= 4 && x + y <= 8), s = a + b, g = Math.abs(a - b);
            const names = [theme.a[0], theme.b[0]], big = a > b ? 0 : 1;
            const sum = (v) => ({ text: `${josa(theme.all, '은/는')} 모두 ${v}개이다.`, ok: v === s });
            const more = (who, v) => ({ text: `${josa(names[who], '이/가')} ${v}개 더 많다.`, ok: who === big && v === g });
            const rows = d.shuffle(d.bool() ? [sum(s), sum(s + 1), more(1 - big, g), more(big, g + 1)] : [more(big, g), more(1 - big, g), sum(s + 1), sum(s - 1)]);
            return C('그림에 알맞은 이야기는?', rows.map((row) => row.text), rows.findIndex((row) => row.ok), {
              figure: duo(theme, a, b), explain: `${josa(names[0], '은/는')} ${a}개, ${josa(names[1], '은/는')} ${b}개이다. 모두 ${s}개이고, ${josa(names[big], '이/가')} ${g}개 더 많다.`,
              facts: { truth: rows.map((row) => row.ok), want: true }
            });
          }),
          T('story-pick-take', '덜어 내는 그림에 알맞은 이야기 고르기', '①15 ①12', (d) => {
            const theme = d.pick(GONE), [t, k] = gap(d, (x, y) => x >= 5 && y >= 2 && x - y >= 2 && y !== x - y), r = t - k;
            const rows = d.shuffle([[k, r], [r, k], [k, r + (d.bool() ? 1 : -1)], [k + 1, r]]);
            return C(`×표 한 것은 ${theme.gone} ${theme.name}이다. 그림에 알맞은 이야기는?`, rows.map(([x, y]) => `${x}${theme.did} ${y}개가 남았다.`), rows.findIndex(([x, y]) => x === k && y === r), {
              figure: taken(theme, t, k), explain: `${theme.name} ${t}개 가운데 ×표 한 것이 ${k}개이므로 ${r}개가 남았다.`, facts: { truth: rows.map(([x, y]) => x === k && y === r), want: true }
            });
          })
        ]
      },
      {
        id: 'plus', title: '덧셈식 쓰고 읽기', standard: MEAN,
        types: [
          T('plus-write', '그림을 보고 덧셈식 쓰기', '①16 ①17 심17 심18', (d) => {
            const theme = d.pick(PAIRS), [a, b] = two(d, (x, y) => x + y >= 4);
            return M('그림에 알맞은 덧셈식이다. ㉠, ㉡에 알맞은 수는?', labelled([b, a + b]), {
              figure: duo(theme, a, b) + expr(a, '+', box(LABELS[0]), '=', box(LABELS[1])),
              explain: `${theme.a[0]} ${a}개와 ${theme.b[0]} ${b}개를 더한다. ${shown(a, '+', b)}`, facts: { calc: [[String(b), 0], [E(a, '+', b), 1]] }
            });
          }),
          T('plus-pick', '그림에 알맞은 덧셈식 고르기', '①18 심18', (d) => {
            // 보기는 모두 옳은 계산이다. 합이 같은 식이 셋이라 두 수를 정확히 세어야 한다.
            const theme = d.pick(PAIRS), [a, b] = two(d, (x, y) => x >= 2 && y >= 2 && x + y <= 8 && Math.abs(x - y) !== 1);
            const rows = d.shuffle([[a, b], [a + 1, b - 1], [a - 1, b + 1], [a, b + 1]]);
            return C('그림에 알맞은 덧셈식은?', rows.map(([x, y]) => expr(x, '+', y, '=', x + y)), rows.findIndex(([x, y]) => x === a && y === b), {
              figure: duo(theme, a, b), explain: `${josa(theme.a[0], '은/는')} ${a}개, ${josa(theme.b[0], '은/는')} ${b}개이다. ${shown(a, '+', b)}`, facts: { truth: rows.map(([x, y]) => x === a && y === b), want: true }
            });
          }),
          T('plus-pic', '덧셈식에 알맞은 그림 고르기', '①19 심19', (d) => {
            // 합이 같은 그림이 둘이라 두 수까지 맞춰 보아야 한다.
            const theme = d.pick(PAIRS), [a, b] = two(d, (x, y) => x >= 2 && y >= 2 && x + y <= 8 && Math.abs(x - y) !== 1), shift = d.pick([-1, 1]);
            const rows = d.shuffle([[a, b], [a + shift, b - shift], [a, b + 1]]);
            return C('덧셈식에 알맞은 그림은?', LABELS.slice(0, 3), rows.findIndex(([x, y]) => x === a && y === b), {
              figure: expr(a, '+', b, '=', a + b) + G.tiles(rows.map(([x, y], i) => [LABELS[i], duo(theme, x, y, { scale: 0.95 })])),
              explain: `${josa(theme.a[0], '이/가')} ${a}개, ${josa(theme.b[0], '이/가')} ${b}개인 그림을 고른다.`, facts: { truth: rows.map(([x, y]) => x === a && y === b), want: true }
            });
          }),
          T('plus-read', '덧셈식을 읽은 말 고르기', '①20 ①16', (d) => {
            const [a, b] = two(d, (x, y) => x !== y && x + y >= 4), s = a + b, right = d.bool() ? plusSay(a, b, s) : sumSay(a, b, s);
            const rows = d.shuffle([right].concat(d.shuffle([`${josa(a, '과/와')} ${b}의 차는 ${s}이다.`, plusSay(a, s, b), sumSay(s, b, a), minusSay(a, b, s)]).slice(0, 3)));
            return C('덧셈식을 바르게 읽은 것은?', rows, rows.indexOf(right), {
              figure: expr(a, '+', b, '=', s), explain: `「${plusSay(a, b, s)}」 또는 「${sumSay(a, b, s)}」로 읽는다.`, facts: { truth: rows.map((row) => row === right), want: true }
            });
          }),
          T('plus-say', '읽은 말을 덧셈식으로 나타내기', '①20', (d) => {
            // 틀린 보기: 뺄셈식, 수의 자리를 바꾼 덧셈식 둘
            const [a, b] = two(d, (x, y) => x !== y && x + y >= 4), s = a + b;
            const rows = d.shuffle([[a, '+', b, s], [s, '-', b, a], [a, '+', s, b], [s, '+', b, a]]);
            return C('다음을 덧셈식으로 나타낸 것은?', rows.map(([x, op, y, z]) => expr(x, op, y, '=', z)), rows.findIndex(([x, op, y, z]) => op === '+' && x === a && y === b && z === s), {
              figure: lines([d.bool() ? plusSay(a, b, s) : sumSay(a, b, s)]), explain: shown(a, '+', b), facts: { truth: rows.map(([x, op, y, z]) => op === '+' && x === a && y === b && z === s), want: true }
            });
          }),
          T('plus-story-pick', '이야기에 알맞은 덧셈식 고르기', '①16 ①18', (d) => {
            // 틀린 보기: 뺄셈으로 구한 식, 수가 다른 덧셈식
            const [a, b] = two(d, (x, y) => x !== y && x + y >= 4 && x + y <= 8), s = a + b, big = Math.max(a, b), small = Math.min(a, b);
            const [p, q, all, u] = d.pick([['빨간 색종이', '파란 색종이', '색종이', '장'], ['사과', '배', '과일', '개'], ['동화책', '그림책', '책', '권']]);
            const rows = d.shuffle([[a, '+', b], [big, '-', small], [a, '+', b + 1]]);
            return C(`${p} ${a}${josa(u, '과/와')} ${q} ${b}${josa(u, '이/가')} 있다. ${josa(all, '은/는')} 모두 몇 ${u}인지 구하는 식은?`, rows.map(([x, op, y]) => expr(x, op, y, '=', op === '+' ? x + y : x - y)), rows.findIndex(([x, op, y]) => op === '+' && x === a && y === b), {
              explain: `두 가지를 합하므로 더한다. ${shown(a, '+', b)}`, facts: { truth: rows.map(([x, op, y]) => op === '+' && x === a && y === b), want: true }
            });
          }),
          T('plus-among', '여러 가지가 섞인 그림에서 두 가지의 합', '심17', (d) => {
            const kinds = [['빨간 구슬', 'bead', 'red'], ['파란 구슬', 'bead', 'blue'], ['노란 구슬', 'bead', 'yellow']];
            const [i, j] = d.shuffle([0, 1, 2]).slice(0, 2).sort();
            const counts = d.until(() => [d.int(1, 6), d.int(1, 6), d.int(1, 6)], (c) => new Set(c).size === 3 && c[i] + c[j] <= 9 && c[i] + c[j] >= 4);
            return N(`${josa(kinds[i][0], '과/와')} ${josa(kinds[j][0], '은/는')} 모두 몇 개인가?`, counts[i] + counts[j], {
              unit: '개', figure: scene(kinds.map((kind, n) => [group(kind, counts[n])]), kinds.map((kind, n) => kind[0] + ' ' + counts[n] + '개').join(', ')),
              explain: `${josa(kinds[i][0], '은/는')} ${counts[i]}개, ${josa(kinds[j][0], '은/는')} ${counts[j]}개이다. ${shown(counts[i], '+', counts[j])}`, facts: { calc: [[E(counts[i], '+', counts[j]), 0]] }
            });
          }),
          T('plus-hidden', '그림에 보이지 않는 것까지 더하기', '심22', (d) => {
            // 한쪽은 그림에서 세고 한쪽은 글에서 읽는다.
            const [a, b] = two(d, (x, y) => x + y >= 5 && x <= 5), [what, kind, color, where] = d.pick([['구슬', 'bead', 'blue', '주머니'], ['사과', 'apple', 'red', '상자'], ['블록', 'block', 'yellow', '상자']]);
            return N(`${where} 안에 ${josa(what, '이/가')} ${b}개 더 있다. ${josa(what, '은/는')} 모두 몇 개인가?`, a + b, {
              unit: '개', figure: scene([[{ n: a, kind, color }]], what + ' ' + a + '개'), explain: `그림의 ${josa(what, '은/는')} ${a}개이다. ${shown(a, '+', b)}`, facts: { calc: [[E(a, '+', b), 0]] }
            });
          })
        ]
      },
      {
        id: 'add', title: '덧셈하기', standard: CALC,
        types: [
          T('add-row', '덧셈식 계산', '①21', (d) => {
            const [a, b] = two(d, (x, y) => x + y >= 5);
            return N('다음을 계산하시오.', a + b, { figure: expr(a, '+', b, '=', box()), explain: shown(a, '+', b), facts: { calc: [[E(a, '+', b), 0]], rule: 'add' } });
          }),
          T('add-pic', '그림을 보고 덧셈하기', '①22', (d) => {
            const theme = d.pick(PAIRS), [a, b] = two(d, (x, y) => x + y >= 4);
            return N('그림을 보고 덧셈을 하시오.', a + b, {
              figure: duo(theme, a, b) + expr(a, '+', b, '=', box()), explain: `${theme.a[0]} ${a}개에 이어서 ${theme.b[0]} ${b}개를 세면 ${a + b}개이다. ${shown(a, '+', b)}`, facts: { calc: [[E(a, '+', b), 0]] }
            });
          }),
          T('add-arrow', '화살표를 따라 더하기', '①23 심24', (d) => {
            const [a, b] = two(d, (x, y) => x + y >= 5);
            return N('□ 안에 알맞은 수는?', a + b, { figure: chain([a, '+' + b, box()]), explain: shown(a, '+', b), facts: { calc: [[E(a, '+', b), 0]] } });
          }),
          T('add-table', '덧셈표의 빈칸', '①23', (d) => {
            const [r1, r2, c1, c2] = d.until(() => [d.int(1, 6), d.int(1, 6), d.int(1, 5), d.int(1, 5)], ([p, q, x, y]) => p !== q && x !== y && Math.max(p, q) + Math.max(x, y) <= 9);
            return M('덧셈표이다. ㉠, ㉡에 알맞은 수는?', labelled([r1 + c2, r2 + c1]), {
              figure: table(['+', c1, c2], [[r1, r1 + c1, box(LABELS[0])], [r2, box(LABELS[1]), r2 + c2]]),
              explain: `왼쪽의 수와 위쪽의 수를 더한다. ${shown(r1, '+', c2)}, ${shown(r2, '+', c1)}`, facts: { calc: [[E(r1, '+', c2), 0], [E(r2, '+', c1), 1]] }
            });
          }),
          T('add-step', '더하는 수가 1씩 커지는 덧셈', '심25', (d) => {
            const a = d.int(2, 6), k = d.int(1, 7 - a), rows = [k, k + 1, k + 2];
            return M('㉠, ㉡, ㉢에 알맞은 수는?', labelled(rows.map((v) => a + v)), {
              figure: lines(rows.map((v, i) => expr(a, '+', v, '=', box(LABELS[i])))), explain: `더하는 수가 1씩 커지면 합도 1씩 커진다. ${rows.map((v) => shown(a, '+', v)).join(', ')}`,
              facts: { calc: rows.map((v, i) => [E(a, '+', v), i]), rule: 'step' }
            });
          }),
          T('add-dice', '주사위 눈의 수의 합', '①24', (d) => {
            const t = d.int(5, 9);
            const rows = d.until(() => Array.from({ length: 4 }, () => [d.int(1, 6), d.int(1, 6)]), (list) => list.filter(([x, y]) => x + y === t).length === 1 && list.every(([x, y]) => x + y <= 9 && Math.abs(x + y - t) <= 2) && new Set(list.map(([x, y]) => [x, y].sort().join())).size === 4);
            return C(`주사위 두 개의 눈의 수의 합이 ${t}인 것은?`, LABELS, rows.findIndex(([x, y]) => x + y === t), {
              figure: G.tiles(rows.map(([x, y], i) => [LABELS[i], dice(x, y)])), explain: rows.map(([x, y], i) => `${LABELS[i]} ${shown(x, '+', y)}`).join(', '),
              facts: { choose: { exprs: rows.map(([x, y]) => E(x, '+', y)), rule: 'equals', target: t } }
            });
          }),
          T('add-find', '합이 정해진 식 찾기', '①25', (d) => {
            const t = d.int(5, 9);
            const rows = d.until(() => Array.from({ length: 4 }, () => two(d)), (list) => list.filter(([x, y]) => x + y === t).length === 1 && list.every(([x, y]) => Math.abs(x + y - t) <= 2) && new Set(list.map(([x, y]) => [x, y].sort().join())).size === 4);
            return C(`합이 ${t}인 식은?`, rows.map(([x, y]) => expr(x, '+', y)), rows.findIndex(([x, y]) => x + y === t), {
              explain: rows.map(([x, y]) => shown(x, '+', y)).join(', '), facts: { choose: { exprs: rows.map(([x, y]) => E(x, '+', y)), rule: 'equals', target: t } }
            });
          }),
          T('add-odd', '합이 나머지와 다른 식', '①26', (d) => {
            const s = d.int(5, 9), o = s === 9 ? 8 : s + d.pick([-1, 1]), x = d.int(1, o - 1);
            const rows = d.shuffle(d.shuffle(upTo(s - 1)).slice(0, 3).map((v) => [v, s - v]).concat([[x, o - x]]));
            return C('합이 나머지와 다른 것은?', rows.map(([p, q]) => expr(p, '+', q)), rows.findIndex(([p, q]) => p + q !== s), {
              explain: rows.map(([p, q]) => shown(p, '+', q)).join(', '), facts: { choose: { exprs: rows.map(([p, q]) => E(p, '+', q)), rule: 'odd' } }
            });
          }),
          T('add-max', '합이 가장 큰 식', '①27 심26', (d) => {
            const rows = d.until(() => Array.from({ length: 4 }, () => two(d, (x, y) => x + y >= 4)), (list) => { const v = list.map(([x, y]) => x + y).sort((p, q) => q - p); return v[0] > v[1] && v[0] - v[3] <= 4 && new Set(list.map(([x, y]) => [x, y].sort().join())).size === 4; });
            const values = rows.map(([x, y]) => x + y);
            return C('합이 가장 큰 것은?', rows.map(([x, y]) => expr(x, '+', y)), values.indexOf(Math.max(...values)), {
              explain: rows.map(([x, y]) => shown(x, '+', y)).join(', '), facts: { choose: { exprs: rows.map(([x, y]) => E(x, '+', y)), rule: 'max' } }
            });
          }),
          T('add-same', '합이 같은 식 찾기', '①28 심27', (d) => {
            const [a, b] = two(d, (x, y) => x + y >= 5), s = a + b;
            const rows = d.until(() => Array.from({ length: 4 }, () => two(d)), (list) => list.filter(([x, y]) => x + y === s).length === 1 && list.every(([x, y]) => Math.abs(x + y - s) <= 2 && [x, y].sort().join() !== [a, b].sort().join()) && new Set(list.map(([x, y]) => [x, y].sort().join())).size === 4);
            return C(`${a} + ${josa(b, '과/와')} 합이 같은 것은?`, rows.map(([x, y]) => expr(x, '+', y)), rows.findIndex(([x, y]) => x + y === s), {
              explain: `${shown(a, '+', b)}이다. ${rows.map(([x, y]) => shown(x, '+', y)).join(', ')}`, facts: { choose: { exprs: rows.map(([x, y]) => E(x, '+', y)), rule: 'equals', target: s } }
            });
          }),
          T('add-swap', '두 수를 바꾸어 더하기', '①28', (d) => {
            const [a, b] = two(d, (x, y) => x !== y && x + y >= 5);
            return M('두 수를 바꾸어 더한다. ㉠, ㉡에 알맞은 수는?', labelled([a + b, a + b]), {
              figure: lines([expr(a, '+', b, '=', box(LABELS[0])), expr(b, '+', a, '=', box(LABELS[1]))]), explain: `${shown(a, '+', b)}, ${shown(b, '+', a)}이다. 두 수를 바꾸어 더해도 합은 같다.`,
              facts: { calc: [[E(a, '+', b), 0], [E(b, '+', a), 1]] }
            });
          }),
          T('add-match', '덧셈식과 합 짝 짓기', '①28', (d) => {
            const pairs = d.until(() => [two(d), two(d), two(d)], (list) => { const v = list.map(([x, y]) => x + y); return new Set(v).size === 3 && Math.min(...v) >= 4; });
            const values = pairs.map(([x, y]) => x + y), list = d.shuffle(d.shuffle(ORDERS.slice(1)).slice(0, 3).concat([ORDERS[0]]));
            return C('식과 계산 결과를 알맞게 짝 지은 것은?', list.map((o) => o.map((k, i) => `${LABELS[i]} ${values[k]}`).join(', ')), list.findIndex((o) => o.join() === '0,1,2'), {
              figure: tagged(pairs.map(([x, y]) => expr(x, '+', y))), explain: pairs.map(([x, y], i) => `${LABELS[i]} ${shown(x, '+', y)}`).join(', '),
              facts: { match: { exprs: pairs.map(([x, y]) => E(x, '+', y)), options: list.map((o) => o.map((k) => values[k])) } }
            });
          }),
          T('add-pattern', '합이 같은 덧셈식의 빈칸', '①29', (d) => {
            // (s-1)+1, (s-2)+2, (s-3)+3, (s-4)+4 — 둘째 줄부터 두 줄에 빈칸을 하나씩 둔다.
            const s = d.int(6, 9), holes = d.shuffle([1, 2, 3]).slice(0, 2).sort(), front = [d.bool(), d.bool()], rows = [0, 1, 2, 3].map((i) => [s - 1 - i, i + 1]);
            const answers = holes.map((h, k) => rows[h][front[k] ? 0 : 1]);
            return M(`합이 ${s}인 덧셈식을 차례로 썼다. ㉠, ㉡에 알맞은 수는?`, labelled(answers), {
              figure: lines(rows.map(([x, y], i) => { const k = holes.indexOf(i); return k < 0 ? expr(x, '+', y, '=', s) : front[k] ? expr(box(LABELS[k]), '+', y, '=', s) : expr(x, '+', box(LABELS[k]), '=', s); })),
              explain: `앞의 수는 1씩 작아지고 뒤의 수는 1씩 커진다. ${holes.map((h) => shown(rows[h][0], '+', rows[h][1])).join(', ')}`,
              facts: { calc: holes.map((h, k) => [E(s, '-', rows[h][front[k] ? 1 : 0]), k]) }
            });
          }),
          T('add-cards', '가장 큰 수와 가장 작은 수의 합', '①30', (d) => {
            const list = d.until(() => d.shuffle(upTo(8)).slice(0, d.int(3, 4)), (xs) => Math.max(...xs) + Math.min(...xs) <= 9 && Math.max(...xs) - Math.min(...xs) >= 3);
            const big = Math.max(...list), small = Math.min(...list);
            return N('수 카드 가운데 가장 큰 수와 가장 작은 수의 합은?', big + small, {
              figure: cards(list), explain: `가장 큰 수는 ${big}, 가장 작은 수는 ${small}이다. ${shown(big, '+', small)}`, facts: { calc: [[E(big, '+', small), 0]], ends: list }
            });
          }),
          T('add-two', '더해서 어떤 수가 되는 두 수 고르기', '심28', (d) => {
            // 두 수씩 더한 세 값이 모두 다르다(고를 짝은 하나뿐).
            const list = d.until(() => d.shuffle(upTo(8)).slice(0, 3), ([x, y, z]) => new Set([x + y, y + z, x + z]).size === 3 && Math.max(x + y, y + z, x + z) <= 9);
            const [x, y] = list, target = x + y;
            return M(`세 수 가운데 두 수를 골라 더하면 ${target}이다. 고른 두 수는?`, [{ answer: Math.max(x, y) }, { answer: Math.min(x, y) }], {
              unordered: true, figure: numbers(d.shuffle(list)), explain: `두 수씩 더해 본다. ${shown(x, '+', y)}`, facts: { inverse: ['x+b=a', target, Math.min(x, y)] }
            });
          }),
          T('add-word-join', '문장제: 두 양을 합치기', '①57', (d) => {
            const [a, b] = two(d, (x, y) => x !== y && x + y >= 5);
            const [p, q, all, u] = d.pick([['빨간 색종이', '파란 색종이', '색종이', '장'], ['사과', '귤', '과일', '개'], ['동화책', '그림책', '책', '권'], ['흰 토끼', '검은 토끼', '토끼', '마리']]);
            return N(`${josa(p, '이/가')} ${a}${u}, ${josa(q, '이/가')} ${b}${u} 있다. ${josa(all, '은/는')} 모두 몇 ${u}인가?`, a + b, { unit: u, explain: shown(a, '+', b), facts: { calc: [[E(a, '+', b), 0]] } });
          }),
          T('add-word-grow', '문장제: 있던 것에 더 생기기', '①58 ①22', (d) => {
            const who = d.pick(NAMES), [a, b] = two(d, (x, y) => x + y >= 5), [what, u] = d.pick([['사탕', '개'], ['구슬', '개'], ['붙임딱지', '장'], ['연필', '자루']]);
            return N(`${name(who, '은/는')} ${josa(what, '을/를')} ${a}${u} 가지고 있다. ${b}${josa(u, '을/를')} 더 받았다. ${nick(who)}의 ${josa(what, '은/는')} 모두 몇 ${u}인가?`, a + b, {
              unit: u, explain: `처음 ${a}${u}에 ${b}${josa(u, '이/가')} 늘었다. ${shown(a, '+', b)}`, facts: { calc: [[E(a, '+', b), 0]] }
            });
          })
        ]
      },
      { id: 'minus', title: '뺄셈식 쓰고 읽기', standard: MEAN, types: [] },
      { id: 'sub', title: '뺄셈하기', standard: CALC, types: [] },
      { id: 'zero', title: '0이 있는 덧셈과 뺄셈', standard: CALC, types: [] },
      { id: 'mix', title: '덧셈과 뺄셈', standard: CALC, types: [] }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
