// 2학년 2학기 6단원 규칙 찾기 — 단원 틀, 그림 도구, 기본 문항(무늬에서 규칙 찾기, 돌아가는 무늬와 늘어나는 무늬, 쌓은 모양에서 규칙 찾기).
// 영역은 「변화와 관계」. 성취기준 [2수02-01] 물체, 무늬, 수 등의 배열에서 규칙을 찾아 여러 가지 방법으로 표현할 수 있다.
//                         [2수02-02] 자신이 정한 규칙에 따라 물체, 무늬, 수 등을 배열할 수 있다.
// 수집해 둔 평가 자료에서 뽑은 문제 꼴 목록(기본꼴_1 61꼴, 심화꼴 47꼴)을 처음부터 끝까지 대조하여 실었다. 꼴 번호는 ①n = 기본꼴_1의 n번, 심n.
// (덧셈표·곱셈표·생활에서 규칙 찾기의 기본 문항은 2-2-6b.js, 실력 문항은 2-2-6c.js에 있다.)
//
// 교육과정의 금
//  - 「물체, 무늬, 수 등의 배열을 관찰하여 일정하게 반복되거나 증가하는 규칙을 찾고 …」
//    「크기, 색깔, 위치, 순서 등에 대한 단순한 규칙을 다루고, 지나치게 복잡한 배열에 대한 평가는 지양한다.」
//    → 반복되는 부분은 넷까지, 늘어나는 수는 일정하게(1개씩·2개씩·3개씩) 한다. 모양과 색이 서로 다른 마디로 따로 반복되는 배열,
//      늘어나는 수가 번갈아 바뀌는 모양은 싣지 않는다.
//  - 답으로 한글을 쓰게 하지 않는다. 모양·색·방향·규칙을 말한 글은 고르게 하고, 답 칸에는 수만 받는다.
//  - 낱말은 교과서에 나오는 「규칙, 무늬, 반복, 쌓기나무, 시계 방향, 시계 반대 방향」을 쓴다.
//
// 싣는 기준
//  - 유형은 주는 것(한 줄 무늬·여러 줄 무늬·돌아가는 그림·늘어나는 모양·쌓은 모양)과 묻는 것(반복되는 부분·빈칸·방향·다음 것·몇 개씩)이 다를 때만 나눈다.
//    반복되는 부분만 바꾼 같은 물음은 한 번만 싣는다. 한 유형 안에서 씨앗마다 반복되는 부분의 얼개와 소재가 바뀐다.
//  - 그리기·색칠하기 꼴(①3·9·18 심2·6·9)은 알맞은 것을 고르게, 규칙을 문장으로 쓰는 꼴(①11·13·23)은 수 빈칸이나 바르게 말한 것 고르기로 바꾸었다.
//  - 뽑은 글에 그림이 없는 꼴은 꼴의 얼개만 따라 무늬와 쌓은 모양을 새로 정했다. 쌓은 모양은 한 줄로 세운 것만 그려 가려지는 쌓기나무가 없다.
//
// 뺀 것과 까닭(이 파일에 드는 꼴)
//  - 복잡한 배열: 모양과 색이 따로 반복되는 무늬(①6 심3), 늘어나는 수가 3개·2개로 번갈아 바뀌는 쌓은 모양(①32)
//  - 먼 차례를 여러 단계로 셈하기: 6층으로 쌓을 때의 개수(①30 변형), 늘어나는 수가 커지는 모양의 다섯·여섯 번째(심20), 층마다 구해 다섯 수를 더하기(심21),
//    늘어나는 수가 달라지는 모양에서 개수로 층 수를 거꾸로 찾기(①31)
//  - 규칙이 아니라 눈으로 가려내기: 쌓은 모양을 ㄱ·ㄷ 같은 글자에 견주기(①26), 한 모양의 쌓기나무를 세기만 하는 것(심17 — 세는 일은 「몇 개씩 늘어나는가」 안에 있다)
//  - 답이 열린 것: 규칙을 정해 무늬 꾸미기(①14 심7) — 말한 규칙대로 꿴 것 고르기로 바꾸어 실었다.
//  - 번갈아 옮겨 가는 색칠(①18 변형 — 왼쪽과 오른쪽, 대각선으로 번갈아): 두 가지가 반복되는 무늬와 하는 일이 같아 따로 싣지 않았다.
//  - 그림이 없어 얼개를 알 수 없는 변형(①2·3·9·17·18·19의 「그림 모름」 문서)은 같은 꼴의 대표로 묶었다.
//  - 그림 폭 때문에 미룬 것: 늘어나는 무늬의 빈칸을 다 채운 뒤 한 모양 세기(심13) — 열네 칸을 넘겨 놓아야 규칙이 답을 가르는데 휴대폰 너비 한 줄에 들어가지 않는다.
// 묻는 말: 「~은?/~는?」, 「몇 ~인가?」. 풀이는 「~이다.」 한 문장에 한 가지만 적는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, N, M, C } = B.kit;
  const FIND = '2수02-01', MAKE = '2수02-02';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const ORD = ['첫째', '둘째', '셋째', '넷째', '다섯째', '여섯째', '일곱째', '여덟째', '아홉째', '열째'];
  const MARKS = ['㉠', '㉡', '㉢', '㉣', '㉤'];
  const range = (n, from) => Array.from({ length: n }, (_, i) => i + (from || 0));
  const sum = (list) => list.reduce((s, v) => s + v, 0);
  const truthOf = (rows, want) => ({ truth: rows.map((row) => row[1]), want });
  const nameOf = (t) => t.name;
  // 하나씩 다시 센 수를 식으로: ones(3) → '1+1+1'
  const ones = (n) => range(n).map(() => 1).join('+');
  // 서로 다른 것만 남긴다(먼저 나온 것을 남긴다).
  const distinct = (list, key) => list.filter((a, i) => list.findIndex((b) => key(a) === key(b)) === i);

  // ── 그림 도구: 한 줄로 놓는 것 ───────────────────────────────
  // 물건 하나(토큰)는 { name(그림 설명과 보기 이름), word(규칙을 말할 때의 낱말), tail(낱말 뒤에 붙는 말), draw(x, y, r, w) }.
  // draw 는 가운데 (x, y), 반지름쯤 되는 크기 r, 칸 너비 w 를 받아 SVG 조각을 돌려준다.
  const INK = '#1f2933', BLUE = '#1d4ed8';
  const PAINT = { 빨간색: '#ef4444', 노란색: '#fde047', 초록색: '#34d399', 파란색: '#3b82f6', 보라색: '#a855f7', 주황색: '#fb923c' };
  const COLORS = ['빨간색', '노란색', '초록색', '파란색', '보라색'];
  // 색만으로 가려야 하는 배열에 쓰는 색 묶음(서로 헷갈리지 않는 것끼리)
  const PAIRS = [['빨간색', '노란색'], ['파란색', '노란색'], ['보라색', '노란색'], ['빨간색', '파란색'], ['주황색', '파란색'], ['초록색', '보라색']];
  const TRIPLES = [['빨간색', '노란색', '파란색'], ['초록색', '노란색', '보라색'], ['주황색', '파란색', '노란색']];
  const f1 = (v) => Math.round(v * 10) / 10;
  const ink = (fill, width) => 'style="fill:' + fill + ';stroke:' + INK + ';stroke-width:' + (width || 1.3) + ';stroke-linejoin:round"';
  const pen = (color, width) => 'style="fill:none;stroke:' + color + ';stroke-width:' + width + ';stroke-linecap:round"';
  const label = (x, y, value, size, color) => '<text x="' + f1(x) + '" y="' + f1(y) + '" text-anchor="middle" dominant-baseline="central" style="font-size:' + f1(size) + 'px;font-weight:700;fill:' + (color || INK) + '">' + value + '</text>';
  const GLYPHS = ['○', '△', '□', '☆', '♡'];
  const DRAW = {
    '○': (x, y, r, fill) => '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + f1(r * 0.96) + '" ' + ink(fill) + '/>',
    '△': (x, y, r, fill) => '<path d="M' + f1(x) + ' ' + f1(y - r) + 'L' + f1(x + r * 1.08) + ' ' + f1(y + r * 0.86) + 'H' + f1(x - r * 1.08) + 'Z" ' + ink(fill) + '/>',
    '□': (x, y, r, fill) => '<rect x="' + f1(x - r * 0.88) + '" y="' + f1(y - r * 0.88) + '" width="' + f1(r * 1.76) + '" height="' + f1(r * 1.76) + '" ' + ink(fill) + '/>',
    '☆': (x, y, r, fill) => '<polygon points="' + range(10).map((i) => { const a = ((-90 + i * 36) * Math.PI) / 180, q = i % 2 ? r * 0.46 : r * 1.1; return f1(x + q * Math.cos(a)) + ',' + f1(y + r * 0.08 + q * Math.sin(a)); }).join(' ') + '" ' + ink(fill) + '/>',
    '♡': (x, y, r, fill) => '<path d="M' + f1(x) + ' ' + f1(y + r * 0.98) + 'C' + f1(x - r * 1.55) + ' ' + f1(y) + ' ' + f1(x - r * 0.9) + ' ' + f1(y - r * 1.2) + ' ' + f1(x) + ' ' + f1(y - r * 0.42) + 'C' + f1(x + r * 0.9) + ' ' + f1(y - r * 1.2) + ' ' + f1(x + r * 1.55) + ' ' + f1(y) + ' ' + f1(x) + ' ' + f1(y + r * 0.98) + 'Z" ' + ink(fill) + '/>'
  };
  // 색을 칠한 모양(색과 모양이 함께 바뀐다)
  const shape = (glyph, color) => ({ name: color + ' ' + glyph, word: glyph, tail: '모양', draw: (x, y, r) => DRAW[glyph](x, y, r, PAINT[color]) });
  // 과일과 하늘의 것, 바둑돌
  const THING = {
    사과: (x, y, r) => '<circle cx="' + f1(x) + '" cy="' + f1(y + r * 0.16) + '" r="' + f1(r * 0.9) + '" ' + ink('#ef4444') + '/>'
      + '<path d="M' + f1(x) + ' ' + f1(y - r * 0.7) + 'q' + f1(r * 0.04) + ' ' + f1(-r * 0.3) + ' ' + f1(r * 0.24) + ' ' + f1(-r * 0.44) + '" ' + pen('#7c4a1e', 1.8) + '/>'
      + '<path d="M' + f1(x + r * 0.14) + ' ' + f1(y - r * 0.8) + 'q' + f1(r * 0.42) + ' ' + f1(-r * 0.44) + ' ' + f1(r * 0.82) + ' ' + f1(-r * 0.1) + 'q' + f1(-r * 0.42) + ' ' + f1(r * 0.38) + ' ' + f1(-r * 0.82) + ' ' + f1(r * 0.1) + 'z" ' + ink('#4ade80', 0.9) + '/>',
    귤: (x, y, r) => '<ellipse cx="' + f1(x) + '" cy="' + f1(y + r * 0.14) + '" rx="' + f1(r * 1.04) + '" ry="' + f1(r * 0.84) + '" ' + ink('#fb923c') + '/>'
      + '<circle cx="' + f1(x) + '" cy="' + f1(y - r * 0.6) + '" r="' + f1(r * 0.17) + '" ' + ink('#15803d', 0.8) + '/>',
    포도: (x, y, r) => '<path d="M' + f1(x + r * 0.02) + ' ' + f1(y - r * 0.7) + 'v' + f1(-r * 0.42) + '" ' + pen('#7c4a1e', 1.8) + '/>'
      + [[-0.52, -0.42], [0.02, -0.42], [0.56, -0.42], [-0.25, 0.1], [0.29, 0.1], [0.02, 0.62]].map(([px, py]) => '<circle cx="' + f1(x + px * r) + '" cy="' + f1(y + py * r) + '" r="' + f1(r * 0.31) + '" ' + ink('#a855f7', 1) + '/>').join(''),
    바나나: (x, y, r) => '<path d="M' + f1(x - r) + ' ' + f1(y - r * 0.35) + 'Q' + f1(x - r * 0.25) + ' ' + f1(y + r * 1.4) + ' ' + f1(x + r * 1.05) + ' ' + f1(y - r * 0.6) + 'Q' + f1(x + r * 0.2) + ' ' + f1(y + r * 0.42) + ' ' + f1(x - r) + ' ' + f1(y - r * 0.35) + 'Z" ' + ink('#fde047') + '/>'
      + '<path d="M' + f1(x + r * 1.05) + ' ' + f1(y - r * 0.6) + 'l' + f1(r * 0.06) + ' ' + f1(-r * 0.26) + '" ' + pen('#7c4a1e', 2.2) + '/>',
    별: (x, y, r) => DRAW['☆'](x, y, r, '#fde047'),
    달: (x, y, r) => '<path d="M' + f1(x + r * 0.35) + ' ' + f1(y - r * 0.9) + 'A' + f1(r * 0.95) + ' ' + f1(r * 0.95) + ' 0 1 0 ' + f1(x + r * 0.35) + ' ' + f1(y + r * 0.9) + 'A' + f1(r * 1.2) + ' ' + f1(r * 1.2) + ' 0 0 1 ' + f1(x + r * 0.35) + ' ' + f1(y - r * 0.9) + 'Z" ' + ink('#fde047') + '/>',
    해: (x, y, r) => range(8).map((i) => { const a = (i * Math.PI) / 4; return '<path d="M' + f1(x + r * 0.76 * Math.cos(a)) + ' ' + f1(y + r * 0.76 * Math.sin(a)) + 'L' + f1(x + r * 1.12 * Math.cos(a)) + ' ' + f1(y + r * 1.12 * Math.sin(a)) + '" ' + pen('#ea580c', 2) + '/>'; }).join('')
      + '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + f1(r * 0.54) + '" ' + ink('#fb923c') + '/>',
    '검은 돌': (x, y, r) => '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + f1(r * 0.94) + '" ' + ink('#1f2933') + '/>',
    '흰 돌': (x, y, r) => '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + f1(r * 0.94) + '" ' + ink('#fff', 1.6) + '/>'
  };
  const thing = (name) => ({ name, word: name, draw: THING[name] });
  const FRUITS = ['사과', '귤', '포도', '바나나'], SKY = ['별', '달', '해'], STONES = ['검은 돌', '흰 돌'];
  // 구슬(색만 다르다)과 아직 색칠하지 않은 구슬(이름을 적을 수 있다)
  const bead = (color) => ({ name: color + ' 구슬', word: color, draw: (x, y, r) => '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + f1(r * 0.98) + '" ' + ink(PAINT[color]) + '/><circle cx="' + f1(x - r * 0.36) + '" cy="' + f1(y - r * 0.38) + '" r="' + f1(r * 0.19) + '" style="fill:#fff;opacity:0.8"/>' });
  const bare = (mark) => ({ name: '색칠하지 않은 구슬' + (mark ? ' ' + mark : ''), word: '빈칸', draw: (x, y, r) => '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + f1(r * 0.98) + '" style="fill:#fff;stroke:#475569;stroke-width:1.5;stroke-dasharray:3.5 2.5"/>' + (mark ? label(x, y + 0.5, mark, r * 1.1, BLUE) : '') });
  // 화살표: 0 ↑, 1 →, 2 ↓, 3 ←
  const ARROW = ['↑', '→', '↓', '←'];
  const arrow = (k) => ({ name: ARROW[k] + ' 화살표', word: ARROW[k], tail: '화살표', draw: (x, y, r) => {
    const turn = ([px, py]) => { let p = [px, py]; for (let i = 0; i < k; i += 1) p = [-p[1], p[0]]; return f1(x + p[0] * r) + ',' + f1(y + p[1] * r); };
    return '<polygon points="' + [[0, -1.12], [0.9, -0.08], [0.34, -0.08], [0.34, 1.08], [-0.34, 1.08], [-0.34, -0.08], [-0.9, -0.08]].map(turn).join(' ') + '" ' + ink('#93c5fd') + '/>';
  } });
  // 네 칸 가운데 한 칸에 ●이 있는 그림: 0 왼쪽 위, 1 오른쪽 위, 2 오른쪽 아래, 3 왼쪽 아래(시계 방향으로 센다)
  const SPOT = ['왼쪽 위', '오른쪽 위', '오른쪽 아래', '왼쪽 아래'];
  const fourBox = (x, y, h) => '<rect x="' + f1(x - h) + '" y="' + f1(y - h) + '" width="' + f1(h * 2) + '" height="' + f1(h * 2) + '" ' + ink('#fff') + '/><path d="M' + f1(x) + ' ' + f1(y - h) + 'v' + f1(h * 2) + 'M' + f1(x - h) + ' ' + f1(y) + 'h' + f1(h * 2) + '" ' + pen(INK, 1) + '/>';
  const quad = (p) => ({ name: SPOT[p] + ' 칸에 ●', word: SPOT[p], draw: (x, y, r) => { const h = r * 1.16, dx = p === 1 || p === 2 ? h / 2 : -h / 2, dy = p >= 2 ? h / 2 : -h / 2; return fourBox(x, y, h) + '<circle cx="' + f1(x + dx) + '" cy="' + f1(y + dy) + '" r="' + f1(h * 0.3) + '" style="fill:' + INK + '"/>'; } });
  // 네 칸에 ㉠ ㉡ ㉢ ㉣을 적은 그림(읽는 차례: 왼쪽 위, 오른쪽 위, 왼쪽 아래, 오른쪽 아래). MARK_SPOT[i] 는 i번째 이름이 적힌 칸(SPOT 의 번호)
  const MARK_SPOT = [0, 1, 3, 2];
  const quadMarks = { name: '네 칸에 ㉠(왼쪽 위), ㉡(오른쪽 위), ㉢(왼쪽 아래), ㉣(오른쪽 아래)을 적은 그림', word: '빈칸', draw: (x, y, r) => { const h = r * 1.16; return fourBox(x, y, h) + [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy], i) => label(x + (sx * h) / 2, y + (sy * h) / 2 + 0.5, MARKS[i], h * 0.8, BLUE)).join(''); } };
  // 똑같이 나눈 원에서 한 칸을 색칠한 그림. 칸은 위쪽(12시)에서 시작해 시계 방향으로 센다.
  const sector = (x, y, R, from, to, fill) => { const p = (deg) => f1(x + R * Math.cos((deg * Math.PI) / 180)) + ' ' + f1(y + R * Math.sin((deg * Math.PI) / 180)); return '<path d="M' + f1(x) + ' ' + f1(y) + 'L' + p(from) + 'A' + f1(R) + ' ' + f1(R) + ' 0 0 1 ' + p(to) + 'Z" ' + ink(fill, 1) + '/>'; };
  const wheelArt = (parts, k) => (x, y, r) => { const R = r * 1.22, step = 360 / parts; return range(parts).map((i) => sector(x, y, R, i * step - 90, (i + 1) * step - 90, i === k ? PAINT.파란색 : '#fff')).join(''); };
  const QUARTER = ['오른쪽 위', '오른쪽 아래', '왼쪽 아래', '왼쪽 위'];
  const wheel4 = (k) => ({ name: QUARTER[k] + ' 칸을 색칠한 원', word: QUARTER[k], draw: wheelArt(4, k) });
  const wheel8 = (k) => ({ name: (k + 1) + '번 칸을 색칠한 원', word: (k + 1) + '번 칸', draw: wheelArt(8, k) });
  // 가로 세 줄(또는 세로 세 줄) 가운데 한 줄을 색칠한 그림
  const BAND = { row: ['위쪽 줄', '가운데 줄', '아래쪽 줄'], col: ['왼쪽 줄', '가운데 줄', '오른쪽 줄'] };
  const band = (kind, k) => ({ name: BAND[kind][k] + ' 색칠', word: BAND[kind][k], draw: (x, y, r) => {
    const h = r * 1.16, s = (h * 2) / 3; let out = '';
    for (let i = 0; i < 3; i += 1) for (let j = 0; j < 3; j += 1) out += '<rect x="' + f1(x - h + j * s) + '" y="' + f1(y - h + i * s) + '" width="' + f1(s) + '" height="' + f1(s) + '" ' + ink((kind === 'row' ? i : j) === k ? PAINT.주황색 : '#fff', 1) + '/>';
    return out;
  } });
  // 시계. t 는 0시부터 센 분(3시 30분 = 210). full 이면 수를 1부터 12까지 모두 적고, 아니면 12, 3, 6, 9만 적는다.
  const timeText = (t) => Math.floor(t / 60) + '시' + (t % 60 ? ' ' + (t % 60) + '분' : '');
  // 짧은바늘과 긴바늘이 벌어진 정도(도). 두 바늘이 거의 겹치는 시각(5시 30분, 6시 30분)은 작은 그림에서 읽기 어려워 쓰지 않는다.
  const handsApart = (t) => { const gap = Math.abs((Math.floor(t / 60) % 12) * 30 + (t % 60) * 0.5 - (t % 60) * 6) % 360; return Math.min(gap, 360 - gap); };
  // 수는 바늘과 겹치지 않게 테두리 가까이에 적고, 긴바늘은 수 앞에서 멈춘다. 수를 적지 않은 시각에만 눈금을 긋는다. 긴바늘은 파란색으로 가늘게, 짧은바늘은 검은색으로 굵게 그린다.
  const clock = (t, full) => ({ name: timeText(t), word: timeText(t), draw: (x, y, r) => {
    const R = r * 1.3, at = (deg, len) => [x + len * Math.sin((deg * Math.PI) / 180), y - len * Math.cos((deg * Math.PI) / 180)], h = at((Math.floor(t / 60) % 12) * 30 + (t % 60) * 0.5, R * 0.4), m = at((t % 60) * 6, R * 0.6), shown = full ? range(12, 1) : [12, 3, 6, 9];
    let out = '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + f1(R) + '" ' + ink('#fff', 1.5) + '/>';
    for (let n = 1; n <= 12; n += 1) if (!shown.includes(n)) { const p = at(n * 30, R), q = at(n * 30, R * 0.86); out += '<path d="M' + f1(p[0]) + ' ' + f1(p[1]) + 'L' + f1(q[0]) + ' ' + f1(q[1]) + '" ' + pen(INK, 1.1) + '/>'; }
    for (const n of shown) { const p = at(n * 30, R * 0.8); out += label(p[0], p[1] + 0.4, n, R * (full ? 0.24 : 0.3)); }
    return out + '<path d="M' + f1(x) + ' ' + f1(y) + 'L' + f1(m[0]) + ' ' + f1(m[1]) + '" ' + pen(BLUE, 1.8) + '/><path d="M' + f1(x) + ' ' + f1(y) + 'L' + f1(h[0]) + ' ' + f1(h[1]) + '" ' + pen(INK, 3) + '/><circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="1.8" style="fill:' + INK + '"/>';
  } });
  // 수 카드와 색을 칠한 칸(무늬)
  const card = (x, y, w) => '<rect x="' + f1(x - w / 2 + 1.5) + '" y="' + f1(y - w / 2 + 2.5) + '" width="' + f1(w - 3) + '" height="' + f1(w - 5) + '" rx="4" style="fill:#fff;stroke:#8a96a3;stroke-width:1.1"/>';
  const num = (v) => ({ name: String(v), word: v, value: v, draw: (x, y, r, w) => card(x, y, w) + label(x, y + 0.5, v, Math.min(16, w * 0.52)) });
  const tile = (color) => ({ name: color, word: color, draw: (x, y, r, w) => '<rect x="' + f1(x - w / 2) + '" y="' + f1(y - w / 2) + '" width="' + f1(w) + '" height="' + f1(w) + '" style="fill:' + PAINT[color] + ';stroke:' + INK + ';stroke-width:1"/>' });
  // 빈칸: BL() 은 물음표 칸, BL('㉠') 은 이름 붙은 칸, BL('') 은 이름 없는 빈 칸
  const BL = (name) => ({ blank: name === undefined ? '?' : name });
  const isBlank = (t) => Boolean(t) && t.blank !== undefined;
  const blankAt = (x, y, w, name) => '<rect x="' + f1(x - w / 2 + 2.5) + '" y="' + f1(y - w / 2 + 2.5) + '" width="' + f1(w - 5) + '" height="' + f1(w - 5) + '" rx="4" style="fill:#f8fafc;stroke:#475569;stroke-width:1.4;stroke-dasharray:3.5 2.5"/>' + (name ? label(x, y + 0.5, name, Math.min(15, w * 0.5), BLUE) : '');
  // 여러 줄을 칸을 맞추어 놓는다. 한 줄에 열 개까지(휴대폰 너비).
  // o: w(칸 너비), gap(줄 사이), label(그림 설명 머리말), names(줄 이름), frame(칸마다 옅은 테두리)
  // 그림 설명에는 놓인 차례대로 이름을 적는다(빈 곳은 「빈칸」).
  function rows(lists, options) {
    const o = options || {}, most = Math.max.apply(null, lists.map((list) => list.length));
    const w = o.w || Math.min(34, Math.floor(284 / most)), r = w * 0.37, gap = o.gap === undefined ? 8 : o.gap, pad = 2;
    const W = Math.max(64, most * w + pad * 2), H = lists.length * w + (lists.length - 1) * gap + pad * 2;
    let out = '';
    lists.forEach((list, k) => list.forEach((t, i) => {
      const x = pad + i * w + w / 2, y = pad + k * (w + gap) + w / 2;
      if (o.frame) out += '<rect x="' + f1(x - w / 2) + '" y="' + f1(y - w / 2) + '" width="' + w + '" height="' + w + '" style="fill:#fff;stroke:#b6c0cb;stroke-width:1"/>';
      out += isBlank(t) ? blankAt(x, y, w, t.blank) : t.draw(x, y, r, w);
    }));
    const say = (list) => list.map((t) => (isBlank(t) ? '빈칸' + (t.blank && t.blank !== '?' ? ' ' + t.blank : '') : t.name)).join(', ');
    const said = lists.length === 1 ? say(lists[0]) : lists.map((list, k) => (o.names ? o.names[k] : ORD[k] + ' 줄') + ' ' + say(list)).join(' / ');
    return '<svg class="mb-geo" viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" role="img" aria-label="' + (o.label || '차례로 놓인 것') + ': ' + said + '">' + out + '</svg>';
  }
  const row = (list, options) => rows([list], options);
  // 보기 단추에 넣는 작은 그림. 단추의 글(이름)은 크기 0으로 함께 넣어 둔다(검사와 화면 낭독이 읽는다).
  const pic = (tokens, size) => {
    const list = [].concat(tokens), w = size || 30, r = w * 0.37;
    return '<svg viewBox="0 0 ' + (list.length * w + 4) + ' ' + (w + 4) + '" width="' + (list.length * w + 4) + '" height="' + (w + 4) + '" aria-hidden="true" style="display:inline-block;vertical-align:middle">'
      + list.map((t, i) => t.draw(2 + i * w + w / 2, 2 + w / 2, r, w - 4)).join('') + '</svg><span style="font-size:0">' + list.map(nameOf).join(', ') + '</span>';
  };
  // 이름(가, 나, 다)을 붙여 여러 줄로, 그림 여럿을 위아래로
  const named = (list, names) => '<div class="mb-lines">' + list.map((html, i) => '<div style="display:flex;align-items:center;gap:8px"><span class="mb-tag mb-tag-short" style="min-width:1.3em;font-weight:700">' + names[i] + '</span>' + html + '</div>').join('') + '</div>';
  const stack = (parts) => '<div style="display:grid;gap:10px;justify-items:start;max-width:100%">' + parts.join('') + '</div>';

  // ── 그림 도구: 나란히 놓는 모양(늘어나는 무늬, 쌓은 모양) ─────
  // 조각 하나는 { w, h(px), draw(ox, oy) }. 바닥을 맞추어 왼쪽부터 놓고 아래에 이름(첫째, 둘째 …)을 적는다.
  function lineUp(parts, names, said, options) {
    const o = options || {}, gap = o.gap === undefined ? 12 : o.gap, pad = 4, slots = parts.map((p) => Math.max(p.w, names ? 30 : 0)), high = Math.max.apply(null, parts.map((p) => p.h));
    const inner = sum(slots) + gap * (parts.length - 1), side = Math.max(pad, (64 - inner) / 2), W = inner + side * 2, H = high + pad * 2 + (names ? 18 : 0);
    let x = side, out = '';
    parts.forEach((p, i) => {
      out += p.draw(x + (slots[i] - p.w) / 2, pad + high - p.h);
      if (names) out += '<text class="mb-label" style="font-size:12.5px" x="' + f1(x + slots[i] / 2) + '" y="' + f1(pad + high + 13) + '" text-anchor="middle">' + names[i] + '</text>';
      x += slots[i] + gap;
    });
    return '<svg class="mb-geo" viewBox="0 0 ' + f1(W) + ' ' + f1(H) + '" width="' + Math.ceil(W) + '" role="img" aria-label="' + said + '">' + out + '</svg>';
  }
  const fits = (parts, names, gap) => sum(parts.map((p) => Math.max(p.w, names ? 30 : 0))) + (gap === undefined ? 12 : gap) * (parts.length - 1) + 8 <= 282;
  // 모눈 칸에 놓은 ●. cells: [[가로 칸, 세로 칸(위에서부터)], …]
  const dotsPart = (cells, u, fill) => ({ w: (1 + Math.max.apply(null, cells.map((c) => c[0]))) * u, h: (1 + Math.max.apply(null, cells.map((c) => c[1]))) * u,
    draw: (ox, oy) => cells.map(([cx, cy]) => '<circle cx="' + f1(ox + (cx + 0.5) * u) + '" cy="' + f1(oy + (cy + 0.5) * u) + '" r="' + f1(u * 0.4) + '" ' + ink(fill, 1.1) + '/>').join('') });
  function dotSteps(list, names, said, fill) {
    let u = 22;
    while (u > 9 && !fits(list.map((cells) => dotsPart(cells, u, fill)), names)) u -= 1;
    return lineUp(list.map((cells) => dotsPart(cells, u, fill)), names, said);
  }
  // 쌓기나무를 한 줄로 세운 모양을 비스듬히 본 그림. hs: 왼쪽부터 자리마다 쌓은 수. 앞면, 오른쪽 옆면, 윗면이 보이고 가려지는 쌓기나무가 없다.
  const WOOD = ['#fff7dc', '#f6d27e', '#e0aa4c'];   // 윗면, 앞면, 옆면
  function wallPart(hs, u) {
    const dz = Math.round(u * 0.36), w = hs.length * u + dz + 2, h = Math.max.apply(null, hs) * u + dz + 2;
    const face = (pts, fill) => '<polygon points="' + pts.map((p) => f1(p[0]) + ',' + f1(p[1])).join(' ') + '" style="fill:' + fill + ';stroke:' + INK + ';stroke-width:1.1;stroke-linejoin:round"/>';
    return { w, h, draw: (ox, oy) => {
      const x0 = ox + 1, base = oy + h - 1; let out = '';
      // 왼쪽 자리부터, 아래 쌓기나무부터 칠한다(높은 오른쪽 자리의 앞면이 왼쪽 자리의 윗면 끝을 가린다).
      hs.forEach((height, i) => { for (let z = 0; z < height; z += 1) {
        const X = x0 + i * u, Y = base - (z + 1) * u;
        out += face([[X, Y], [X + u, Y], [X + u, Y + u], [X, Y + u]], WOOD[1]);
        if (!(hs[i + 1] > z)) out += face([[X + u, Y], [X + u + dz, Y - dz], [X + u + dz, Y - dz + u], [X + u, Y + u]], WOOD[2]);
        if (z === height - 1) out += face([[X, Y], [X + u, Y], [X + u + dz, Y - dz], [X + dz, Y - dz]], WOOD[0]);
      } });
      return out;
    } };
  }
  const blankPart = (size, name) => ({ w: size, h: size, draw: (ox, oy) => '<rect x="' + f1(ox + 1) + '" y="' + f1(oy + 1) + '" width="' + (size - 2) + '" height="' + (size - 2) + '" rx="5" style="fill:#f8fafc;stroke:#475569;stroke-width:1.4;stroke-dasharray:3.5 2.5"/>' + label(ox + size / 2, oy + size / 2 + 0.5, name === undefined ? '?' : name, 15, BLUE) });
  // 쌓은 모양 여럿을 나란히. list 의 빈 자리(없는 값)는 빈칸으로 그린다. 휴대폰 너비에 들어가게 쌓기나무의 크기를 줄인다.
  function walls(list, names, said, options) {
    const o = options || {}, build = (u) => list.map((hs) => (hs ? wallPart(hs, u) : blankPart(Math.round(u * 1.9))));
    let u = o.u || 18;
    while (u > 9 && !fits(build(u), names, o.gap)) u -= 1;
    return lineUp(build(u), names, said, { gap: o.gap });
  }
  // 층마다 놓인 쌓기나무의 수(1층부터)
  const layersOf = (hs) => range(Math.max.apply(null, hs), 1).map((k) => hs.filter((v) => v >= k).length);
  // 위층부터 층마다 놓을 수(tops)와 왼쪽에서 밀어 놓는 칸 수(shifts)로 자리마다 쌓은 수를 만든다. 위층은 아래층 안쪽에 놓인다.
  function heightsOf(tops, shifts) {
    const n = tops[tops.length - 1], hs = range(n).map(() => 0), from = tops.map((_, k) => sum(shifts.slice(k)));
    tops.forEach((len, k) => { for (let i = from[k]; i < from[k] + len; i += 1) hs[i] += 1; });
    return hs;
  }

  // ── 반복되는 부분 ────────────────────────────────────────────
  // 얼개는 자리 번호의 줄이다: [0, 1, 1] 은 「가, 나, 나」가 반복되는 배열
  const FORM = { AB: [0, 1], AAB: [0, 0, 1], ABB: [0, 1, 1], ABC: [0, 1, 2], ABA: [0, 1, 0], AABB: [0, 0, 1, 1], ABBA: [0, 1, 1, 0], ABBB: [0, 1, 1, 1], AAAB: [0, 0, 0, 1],
    AABC: [0, 0, 1, 2], ABBC: [0, 1, 1, 2], ABCC: [0, 1, 2, 2], ABCB: [0, 1, 2, 1], ABAC: [0, 1, 0, 2], ABCA: [0, 1, 2, 0], ABCD: [0, 1, 2, 3] };
  const kindsOf = (form) => Math.max.apply(null, form) + 1;
  const unitOf = (form, toks) => form.map((i) => toks[i]);
  const run = (unit, n) => range(n).map((i) => unit[i % unit.length]);
  // 줄에서 처음부터 반복되는 가장 짧은 부분의 길이
  const period = (keys) => { for (let p = 1; p <= keys.length; p += 1) if (keys.every((k, i) => i < p || k === keys[i - p])) return p; return keys.length; };
  // 보기가 줄의 반복되는 부분인가: 길이가 같고 처음부터 차례로 같다.
  const isUnit = (pick, list) => pick.length === period(list.map(nameOf)) && pick.every((t, i) => t === list[i]);
  // 두 줄이 같은 규칙인가: 같은 것이 놓인 자리가 서로 같다.
  const sameRule = (a, b) => a.length === b.length && a.every((x, i) => a.every((y, j) => (x === y) === (b[i] === b[j])));
  // 반복되는 부분을 돌려 놓은 것인가(둘째부터 묶은 것 따위). 그런 묶음도 줄 안에서 되풀이되어 보이므로 틀린 보기로 쓰지 않는다.
  const isTurnOf = (pick, unit) => pick.length === unit.length && range(unit.length).some((s) => pick.every((t, i) => t === unit[(i + s) % unit.length]));
  // 소재 고르기
  const castShapes = (d, k) => { const gs = d.shuffle(GLYPHS), cs = d.shuffle(COLORS); return range(k).map((i) => shape(gs[i], cs[i])); };
  const castThings = (d, k) => d.shuffle(d.pick(k > 2 ? [FRUITS, SKY] : [FRUITS, SKY, STONES])).slice(0, k).map(thing);
  const castBeads = (d, k) => d.shuffle(d.pick(k > 2 ? TRIPLES : PAIRS)).map(bead);
  // 낱말을 늘어놓고 토씨를 붙인다: told([사과, 귤, 귤], '이/가') → '사과, 귤, 귤이'. 기호(○, ↑)는 뒤에 「모양」「화살표」를 붙여 읽는다.
  const told = (toks, pair) => { const ws = toks.map((t) => t.word), tail = toks[0].tail; return tail ? ws.join(', ') + ' ' + josa(tail, pair) : ws.slice(0, -1).concat([josa(ws[ws.length - 1], pair)]).join(', '); };
  const noun = (t) => (t.tail ? t.word + ' ' + t.tail : String(t.word));
  const keyOf = (list) => list.map(nameOf).join(', ');

  // ── 늘어나는 쌓은 모양 ───────────────────────────────────────
  // make(n, b): n째 모양의 자리마다 쌓은 수(b 는 첫째 모양의 크기). step: 한 번에 늘어나는 수, said: 늘어나는 곳
  const GROW = {
    up: { step: 1, said: '위로 1개씩', make: (n, b) => [b + n - 1] },
    right: { step: 1, said: '오른쪽으로 1개씩', make: (n, b) => [2].concat(range(b + n - 1).map(() => 1)) },
    twin: { step: 2, said: '두 줄 모두 위로 1개씩, 모두 2개씩', make: (n, b) => [b + n - 1, b + n - 1] },
    ell: { step: 2, said: '위와 오른쪽으로 1개씩, 모두 2개씩', make: (n, b) => [b + n - 1].concat(range(b + n - 2).map(() => 1)) },
    wide: { step: 2, said: '오른쪽으로 2개씩', make: (n, b) => [2].concat(range(b + 2 * (n - 1)).map(() => 1)) },
    tee: { step: 3, said: '왼쪽, 오른쪽, 위로 1개씩, 모두 3개씩', make: (n) => range(n - 1).map(() => 1).concat([n], range(n - 1).map(() => 1)) },
    triple: { step: 3, said: '세 줄 모두 위로 1개씩, 모두 3개씩', make: (n, b) => [b + n - 1, b + n - 1, b + n - 1] }
  };
  const grown = (key, b, upTo) => range(upTo, 1).map((n) => GROW[key].make(n, b));
  // 그림 설명: 모양마다 쌓기나무의 수와, 왼쪽부터 자리마다 쌓은 수를 적는다.
  const stepsSaid = (list, names) => '쌓기나무로 쌓은 모양: ' + list.map((hs, i) => (names || ORD)[i] + ' ' + sum(hs) + '개(왼쪽부터 ' + hs.map((v) => v + '층').join(', ') + ')').join(' / ');

  // ── 그림 도구: 표(덧셈표·곱셈표·달력)와 번호가 적힌 칸 ───────
  // 엔진의 table() 과 같은 틀(mb-table)이다. 칸마다 색을 칠하거나 비워야 해서 칸의 모양을 따로 적는다. 칸 너비를 정해 두어 일곱 칸까지 휴대폰 너비에 들어간다.
  const CELL = 'width:34px;min-width:34px;padding:5px 0;';
  const TINT = '#fde68a';
  const th = (v) => '<th style="' + CELL + (v === '' ? 'background:#dfe5ec;' : '') + '">' + (v === '' ? '&nbsp;' : v) + '</th>';
  // 칸의 표시: 'on'(색칠한 수) | 'tint'(색칠한 빈칸) | 'none'(수를 적지 않은 칸) | 'gone'(조각에 없는 칸) | 빈칸 이름(㉠ …) | [빈칸 이름](색칠한 빈칸)
  const td = (v, mark, more) => {
    if (mark === 'gone') return '<td style="' + CELL + 'border:0;background:transparent">&nbsp;</td>';
    const name = Array.isArray(mark) ? mark[0] : mark && !['on', 'tint', 'none'].includes(mark) ? mark : '', fill = mark === 'on' || mark === 'tint' || Array.isArray(mark) ? TINT : '#fff';
    return '<td style="' + CELL + 'background:' + fill + ';' + (name ? 'font-weight:700;color:' + BLUE : 'font-weight:400') + (more || '') + '">' + (name || (mark === 'tint' || mark === 'none' ? '&nbsp;' : v)) + '</td>';
  };
  // 덧셈표·곱셈표. sign: '+' | '×', top·side: 가장 윗줄과 가장 왼쪽 줄의 수(빈 글 '' 은 지워진 수, 글자는 그대로 적는다), cell(r, c): 칸의 수, marks['r,c']: 칸의 표시
  function sheet(sign, top, side, cell, marks) {
    const m = marks || {};
    return '<div class="mb-table-wrap"><table class="mb-table" aria-label="' + (sign === '+' ? '덧셈표' : '곱셈표') + '"><thead><tr>' + th(sign) + top.map(th).join('') + '</tr></thead><tbody>'
      + side.map((s, r) => '<tr>' + th(s) + top.map((_, c) => td(cell(r, c), m[r + ',' + c])).join('') + '</tr>').join('') + '</tbody></table></div>';
  }
  // 표에서 떼어 낸 조각(가장 윗줄과 가장 왼쪽 줄의 수가 없다). cells[r][c]: 수 | 빈칸 이름 | ''(수를 적지 않은 칸) | 없는 값(조각에 없는 칸)
  function piece(cells, said) {
    return '<div class="mb-table-wrap"><table class="mb-table" aria-label="' + said + '"><tbody>' + cells.map((line) => '<tr>' + line.map((v) => td(v, v === undefined ? 'gone' : v === '' ? 'none' : typeof v === 'string' ? v : '')).join('') + '</tr>').join('') + '</tbody></table></div>';
  }
  // 달력. first: 1일의 요일(0 = 일요일), days: 그 달의 날수. weeksOf 는 줄마다 일곱 칸(날짜가 없는 칸은 0)
  const WEEK = ['일', '월', '화', '수', '목', '금', '토'];
  function weeksOf(first, days) {
    const out = []; let line = range(first).map(() => 0);
    for (let day = 1; day <= days; day += 1) { line.push(day); if (line.length === 7) { out.push(line); line = []; } }
    if (line.length) { while (line.length < 7) line.push(0); out.push(line); }
    return out;
  }
  // o.rows: 위에서부터 보이는 줄 수(아래쪽이 찢어진 달력), o.on: 색칠할 날짜들
  function calendar(first, days, options) {
    const o = options || {}, weeks = weeksOf(first, days), shown = o.rows ? weeks.slice(0, o.rows) : weeks, on = o.on || [];
    return '<div class="mb-table-wrap"><table class="mb-table" aria-label="달력' + (o.rows ? '(아래쪽이 찢어져 보이지 않는다)' : '') + '"><thead><tr>' + WEEK.map(th).join('') + '</tr></thead><tbody>'
      + shown.map((line, i) => '<tr>' + line.map((day) => td(day, day === 0 ? 'none' : on.includes(day) ? 'on' : '', o.rows && i === shown.length - 1 ? ';border-bottom:3px dashed #64748b' : '')).join('') + '</tr>').join('') + '</tbody></table></div>';
  }
  // 번호가 적힌 칸(자리·사물함·단추). cell(r, c): 칸의 수(r 은 위에서부터), marks['r,c']: 'empty'(수를 적지 않은 칸) | 빈칸 이름. o.round: 둥근 단추
  function board(cell, nRows, nCols, marks, options) {
    const m = marks || {}, o = options || {}, gap = o.round ? 6 : 0, cw = o.cw || Math.min(40, Math.floor((280 - gap * (nCols - 1)) / nCols)), ch = o.round ? cw : 28, pad = 2, told = [];
    let out = '';
    for (let r = 0; r < nRows; r += 1) {
      const line = [];
      for (let c = 0; c < nCols; c += 1) {
        const mark = m[r + ',' + c], v = cell(r, c), x = pad + c * (cw + gap), y = pad + r * (ch + gap);
        out += '<rect x="' + f1(x) + '" y="' + f1(y) + '" width="' + cw + '" height="' + ch + '" rx="' + (o.round ? cw / 2 : 3) + '" style="fill:' + (mark === 'empty' ? '#eef1f4' : '#fff') + ';stroke:#64748b;stroke-width:1.1"/>';
        if (mark === 'empty') line.push('빈칸');
        else if (mark) { out += label(x + cw / 2, y + ch / 2 + 0.5, mark, 14, BLUE); line.push('빈칸 ' + mark); }
        else { out += label(x + cw / 2, y + ch / 2 + 0.5, v, String(v).length > 2 ? 11.5 : 13.5); line.push(String(v)); }
      }
      told.push(line.join(', '));
    }
    const W = nCols * cw + gap * (nCols - 1) + pad * 2, H = nRows * ch + gap * (nRows - 1) + pad * 2;
    return '<svg class="mb-geo" viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" role="img" aria-label="' + (o.label || '번호가 적힌 칸') + '(위 줄부터): ' + told.join(' / ') + '">' + out + '</svg>';
  }
  // 표의 방향 규칙. 그 방향으로 한 칸 갈 때 달라지는 수가 모두 같으면 그 수를, 아니면 없는 값을 돌려준다. has(r, c): 수가 있는 칸인가
  const WAYS = { right: ['오른쪽으로 갈수록', 0, 1], left: ['왼쪽으로 갈수록', 0, -1], down: ['아래로 내려갈수록', 1, 0], up: ['위로 올라갈수록', -1, 0], se: ['↘ 방향으로 갈수록', 1, 1], sw: ['↙ 방향으로 갈수록', 1, -1] };
  function stepAlong(cell, nRows, nCols, way, has) {
    const [, dr, dc] = WAYS[way], seen = new Set(), inside = (r, c) => r >= 0 && r < nRows && c >= 0 && c < nCols && (!has || has(r, c));
    for (let r = 0; r < nRows; r += 1) for (let c = 0; c < nCols; c += 1) if (inside(r, c) && inside(r + dr, c + dc)) seen.add(cell(r + dr, c + dc) - cell(r, c));
    return seen.size === 1 ? [...seen][0] : undefined;
  }
  // 「오른쪽으로 갈수록 2씩 커진다.」 같은 말과 그 참·거짓(표의 수로 따진다)
  const claim = (cell, nRows, nCols, way, amount, grows, has) => [`${WAYS[way][0]} ${amount}씩 ${grows ? '커진다' : '작아진다'}.`, stepAlong(cell, nRows, nCols, way, has) === (grows ? amount : -amount)];
  // 참인 말 하나와 거짓인 말 셋을 골라 섞는다(같은 글은 한 번만).
  function oneTrue(d, claims) {
    const list = distinct(claims, (row) => row[0]), trues = list.filter((row) => row[1]), falses = list.filter((row) => !row[1]);
    return d.shuffle([d.pick(trues)].concat(d.shuffle(falses).slice(0, 3)));
  }
  const headsOf = (from, step, n) => range(n).map((i) => from + i * step);

  B.kit.g226 = { ORD, MARKS, range, sum, truthOf, nameOf, ones, distinct, INK, BLUE, PAINT, COLORS, PAIRS, TRIPLES, GLYPHS, f1, ink, pen, label, shape, thing, FRUITS, SKY, STONES, bead, bare, arrow, SPOT, quad, quadMarks, MARK_SPOT,
    wheel4, wheel8, QUARTER, band, BAND, timeText, clock, handsApart, num, tile, BL, isBlank, rows, row, pic, named, stack, lineUp, fits, dotsPart, dotSteps, wallPart, blankPart, walls, layersOf, heightsOf,
    FORM, kindsOf, unitOf, run, period, isUnit, sameRule, isTurnOf, castShapes, castThings, castBeads, told, noun, keyOf, GROW, grown, stepsSaid,
    sheet, piece, WEEK, weeksOf, calendar, board, WAYS, stepAlong, claim, oneTrue, headsOf };

  B.addUnit({
    id: '2-2-6', grade: 2, semester: 2, no: 6, title: '규칙 찾기', version: 1,
    groups: [
      {
        id: 'repeat', title: '무늬에서 규칙 찾기', standard: FIND,
        types: [
          T('rp-unit', '반복되는 부분 고르기', '①1·13', (d) => {
            // 틀린 보기: 하나를 덜 묶은 것, 다시 나오는 것까지 묶은 것, 한 자리를 다른 모양으로 잘못 본 것
            const form = FORM[d.pick(['ABC', 'ABB', 'AAB', 'ABCB', 'AABC', 'ABBC'])], toks = castShapes(d, kindsOf(form)), unit = unitOf(form, toks), L = unit.length, list = run(unit, L === 3 ? 9 : 8);
            const other = (t) => toks[(toks.indexOf(t) + 1) % toks.length];
            const wrongs = distinct([unit.slice(0, L - 1), unit.concat([unit[0]]), unit.map((t, i) => (i === L - 1 ? other(t) : t)), unit.map((t, i) => (i === 1 ? other(t) : t))].filter((c) => !isTurnOf(c, unit)), keyOf);
            const picks = d.shuffle([unit].concat(d.shuffle(wrongs).slice(0, 3))), truth = picks.map((pick) => isUnit(pick, list));
            return C('규칙에 따라 놓은 무늬이다. 반복되는 부분은?', picks.map((pick) => pic(pick)), truth.indexOf(true), { figure: row(list, { label: '무늬' }), explain: `처음부터 차례로 보면 ${told(unit, '이/가')} 반복된다.`, facts: { truth, want: true } });
          }),
          T('rp-words', '규칙을 말로 나타내기', '①2', (d) => {
            // 틀린 보기: 차례를 바꾼 것, 같은 것을 두 번 쓴 것
            const form = FORM[d.pick(['ABB', 'ABC', 'AAB', 'ABA'])], toks = castThings(d, kindsOf(form)), unit = unitOf(form, toks), list = run(unit, 9), key = (pair) => pair.map((t) => t.word).join(', ');
            const right = [unit[1], unit[2]], pool = [right, [right[1], right[0]], [right[0], right[0]], [right[1], right[1]], [unit[0], right[0]], [right[1], unit[0]], [unit[0], unit[0]]];
            const pairs = d.shuffle(distinct(pool, key).slice(0, 4));
            return C(`규칙에 따라 놓았다. ${unit[0].word}, ㉠, ㉡이 반복된다. ㉠, ㉡에 알맞은 것을 차례로 쓴 것은?`, pairs.map(key), pairs.findIndex((pair) => key(pair) === key(right)), {
              figure: row(list), explain: `처음부터 차례로 보면 ${told(unit, '이/가')} 반복된다.`, facts: { kindPick: { kinds: pairs.map(key), target: key(list.slice(1, period(list.map(nameOf)))) } }
            });
          }),
          T('rp-blank', '무늬의 빈칸에 알맞은 모양', '①3·4 심2·5', (d) => {
            const form = FORM[d.pick(['ABC', 'ABCB', 'AABC', 'ABBC', 'ABCC', 'ABCD'])], toks = castShapes(d, kindsOf(form)), unit = unitOf(form, toks), L = unit.length;
            const n = L + 5, at = d.int(L + 1, n - 2), list = run(unit, n), ans = list[at], picks = d.shuffle(toks);
            return C('규칙에 따라 놓은 무늬이다. 빈칸에 알맞은 모양은?', picks.map((t) => pic(t)), picks.indexOf(ans), {
              figure: row(list.map((t, i) => (i === at ? BL() : t)), { label: '무늬' }), explain: `${told(unit, '이/가')} 반복된다. 빈칸에는 ${josa(noun(ans), '이/가')} 온다.`, facts: { kindPick: { kinds: picks.map(nameOf), target: ans.name } }
            });
          }),
          T('rp-rows', '두 줄 무늬의 빈칸', '①5', (d) => {
            // 줄마다 반복되는 부분이 다르다. 틀린 보기: 차례를 바꾼 것, 첫째 줄을 그대로 따라 놓은 것
            const [p, q, r, s] = d.shuffle(range(4)).map(arrow), top = run(d.bool() ? [p, q] : [p, q, q], 8), low = run([r, s], 8), i = d.int(3, 6), key = (pair) => pair.map(nameOf).join(', ');
            const right = [low[i], low[i + 1]], pool = [right, [right[1], right[0]], [top[i], top[i + 1]], [top[i + 1], top[i]], [right[0], right[0]], [right[1], right[1]]];
            const pairs = d.shuffle(distinct(pool, key).slice(0, 4));
            return C('화살표를 줄마다 규칙에 따라 놓았다. ㉠, ㉡에 알맞은 화살표를 차례로 놓은 것은?', pairs.map((pair) => pic(pair)), pairs.findIndex((pair) => key(pair) === key(right)), {
              figure: rows([top, low.map((t, k) => (k === i ? BL('㉠') : k === i + 1 ? BL('㉡') : t))], { w: 34, label: '화살표 무늬' }),
              explain: `둘째 줄은 ${told([r, s], '이/가')} 반복된다. ㉠에는 ${noun(right[0])}, ㉡에는 ${josa(noun(right[1]), '이/가')} 온다.`, facts: { kindPick: { kinds: pairs.map(key), target: key([run([r, s], 8)[i], run([r, s], 8)[i + 1]]) } }
            });
          }),
          T('rp-which', '규칙에 따라 놓은 줄 고르기', '①7', (d) => {
            // 세 줄은 같은 두 모양으로 되어 있고, 틀린 줄은 한 곳만 규칙에 맞지 않는다.
            const names = ['가', '나', '다'], toks = castShapes(d, 2), keys = d.shuffle(['AB', 'AAB', 'ABB']), good = d.int(0, 2), flip = (t) => (t === toks[0] ? toks[1] : toks[0]);
            const lists = keys.map((key, k) => {
              const base = run(unitOf(FORM[key], toks), 9);
              return k === good ? base : d.until(() => { const at = d.int(3, 7); return base.map((t, i) => (i === at ? flip(t) : t)); }, (list) => period(list.map(nameOf)) > 4);
            });
            const truth = lists.map((list) => period(list.map(nameOf)) <= 3), at = truth.indexOf(true);
            return C('모양을 놓아 무늬를 꾸몄다. 모양이 규칙에 따라 반복되는 것은?', names, at, {
              figure: named(lists.map((list) => row(list, { w: 28, label: '무늬' })), names), explain: `${josa(names[at], '은/는')} ${told(lists[at].slice(0, period(lists[at].map(nameOf))), '이/가')} 끝까지 반복된다. 나머지 둘은 규칙에 맞지 않는 곳이 있다.`, facts: { truth, want: true }
            });
          }),
          T('rp-wrong', '잘못 놓은 모양 찾기', '①8', (d) => {
            // 한 칸만 바꾸어 끝까지 반복되게 할 수 있는 자리는 하나뿐이다(그 자리를 따로 찾아 답과 맞춘다).
            const form = FORM[d.pick(['ABC', 'ABB', 'AAB'])], toks = castShapes(d, kindsOf(form)), unit = unitOf(form, toks), base = run(unit, 10);
            const fixables = (list) => range(list.length).filter((i) => toks.some((t) => t !== list[i] && period(list.map((x, k) => (k === i ? t : x)).map(nameOf)) <= 4));
            const [at, list] = d.until(() => { const i = d.int(4, 8), t = d.pick(toks.filter((x) => x !== base[i])); return [i, base.map((x, k) => (k === i ? t : x))]; }, ([i, made]) => { const found = fixables(made); return found.length === 1 && found[0] === i; });
            const found = fixables(list)[0];
            return N('규칙에 따라 모양을 놓다가 한 곳을 잘못 놓았다. 잘못 놓은 모양은 왼쪽에서 몇 번째인가?', at + 1, {
              unit: '번째', figure: row(list, { label: '무늬' }), explain: `${told(unit, '이/가')} 반복된다. 왼쪽에서 ${at + 1}번째에는 ${josa(noun(base[at]), '을/를')} 놓아야 한다.`, facts: { count: list.map((_, i) => i <= found) }
            });
          }),
          T('rp-bead', '구슬의 색', '①9 심2·6', (d) => {
            // 같은 색이 둘씩 이어지거나 반복되는 부분의 처음과 끝이 같은 색이다. 틀린 보기: 한 개씩 번갈아 놓았다고 본 것
            const form = FORM[d.pick(['AABB', 'ABBA', 'ABBB', 'AAAB', 'ABB', 'AAB'])], cols = d.shuffle(d.pick(PAIRS)), toks = cols.map(bead), unit = unitOf(form, toks), n = unit.length === 4 ? d.pick([9, 10]) : d.pick([8, 9]), list = run(unit, n);
            const pairs = d.shuffle([[0, 0], [0, 1], [1, 0], [1, 1]]), key = (pair) => pair.map((i) => cols[i]).join(', '), right = [list[n - 2].word, list[n - 1].word].join(', ');
            return C('구슬을 규칙에 따라 색칠한다. ㉠, ㉡에 알맞은 색을 차례로 쓴 것은?', pairs.map(key), pairs.findIndex((pair) => key(pair) === right), {
              figure: row(list.map((t, i) => (i === n - 2 ? bare('㉠') : i === n - 1 ? bare('㉡') : t)), { label: '구슬' }),
              explain: `${told(unit, '이/가')} 반복된다. ㉠에는 ${list[n - 2].word}, ㉡에는 ${josa(list[n - 1].word, '을/를')} 칠한다.`, facts: { kindPick: { kinds: pairs.map(key), target: right } }
            });
          }),
          T('rp-count', '반복되는 구슬의 수', '①9·13', (d) => {
            const [a, b] = d.pick([[1, 2], [2, 1], [1, 3], [3, 1], [2, 2]]), [x, y] = castBeads(d, 2), unit = range(a).map(() => x).concat(range(b).map(() => y)), list = run(unit, unit.length * (unit.length === 4 ? 2 : 3));
            const first = list.slice(0, period(list.map(nameOf)));
            return M(`구슬을 규칙에 따라 꿰었다. ${x.word} 구슬 ㉠개, ${y.word} 구슬 ㉡개가 반복된다. ㉠, ㉡에 알맞은 수는?`, [{ label: '㉠', answer: a, unit: '개' }, { label: '㉡', answer: b, unit: '개' }], {
              figure: row(list, { label: '구슬' }), explain: `처음부터 차례로 보면 ${told(unit, '이/가')} 반복된다. ${x.word} 구슬 ${a}개, ${y.word} 구슬 ${b}개이다.`,
              facts: { parts: [[ones(first.filter((t) => t === x).length), 0], [ones(first.filter((t) => t === y).length), 1]] }
            });
          }),
          T('rp-num', '무늬를 수로 나타내기', '①10', (d) => {
            const form = FORM[d.pick(['ABB', 'AAB', 'ABC', 'ABA'])], k = kindsOf(form), toks = castShapes(d, k), n = 8, top = run(unitOf(form, toks), n), nums = run(form.map((i) => i + 1), n);
            const [i, j] = d.until(() => { const at = d.int(3, 5); return [at, d.int(at + 1, n - 1)]; }, ([p, q]) => nums[p] !== nums[q]);
            const rule = toks.map((t, v) => `${t.word} 모양은 ${v + 1}`).join(', ') + (k === 3 ? '으로' : '로');
            return M(`무늬를 ${rule} 바꾸어 나타낸다. ㉠, ㉡에 알맞은 수는?`, [{ label: '㉠', answer: nums[i] }, { label: '㉡', answer: nums[j] }], {
              figure: rows([top, nums.map((v, t) => (t < 3 ? num(v) : BL(t === i ? '㉠' : t === j ? '㉡' : '')))], { w: 32, names: ['무늬', '수'], label: '무늬를 수로 나타내기' }),
              explain: `㉠의 위에는 ${noun(top[i])}, ㉡의 위에는 ${josa(noun(top[j]), '이/가')} 있다. ㉠에 알맞은 수는 ${nums[i]}, ㉡에 알맞은 수는 ${nums[j]}이다.`, facts: { calc: [[String(toks.indexOf(top[i]) + 1), 0], [String(toks.indexOf(top[j]) + 1), 1]] }
            });
          }),
          T('rp-num-unit', '수로 나타낸 규칙', '①11', (d) => {
            const form = FORM[d.pick(['AABC', 'ABBC', 'ABCC', 'ABCB', 'ABAC', 'ABBA', 'AABB'])], k = kindsOf(form), toks = castShapes(d, k), unit = unitOf(form, toks), list = run(unit, 8);
            const rule = toks.map((t, v) => `${t.word} 모양은 ${v + 1}`).join(', ') + (k === 3 ? '으로' : '로'), first = list.slice(0, period(list.map(nameOf)));
            return M(`무늬를 ${rule} 바꾸어 나타내면 ㉠, ㉡, ㉢, ㉣이 반복된다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?`, first.map((t, i) => ({ label: MARKS[i], answer: toks.indexOf(t) + 1 })), {
              figure: row(list, { label: '무늬' }), explain: `무늬는 ${told(unit, '이/가')} 반복된다. 수로 바꾸면 ${form.map((i) => i + 1).join(', ')}이다.`, facts: { calc: form.map((v, i) => [String(v + 1), i]) }
            });
          }),
          T('rp-grid-dir', '여러 줄 무늬에서 같은 색이 놓인 방향', '①12', (d) => {
            // 세 가지 색이 반복되는 줄을 그대로 두거나(↓), 줄마다 한 칸씩 밀어(↘, ↙) 놓는다.
            const cols = d.shuffle(d.pick(TRIPLES)).map(tile), kind = d.pick(['down', 'se', 'sw']), nr = 3, nc = 6;
            const grid = range(nr).map((r) => range(nc).map((c) => cols[(((kind === 'down' ? c : kind === 'se' ? c - r : c + r) % 3) + 3) % 3]));
            const holds = (dr, dc) => grid.every((line, r) => line.every((t, c) => r + dr >= nr || c + dc < 0 || c + dc >= nc || grid[r + dr][c + dc] === t));
            const said = d.shuffle([['↓', 1, 0], ['↘', 1, 1], ['↙', 1, -1]]).map(([way, dr, dc]) => [way + ' 방향', holds(dr, dc)]), right = said.find((s) => s[1]);
            return C('세 가지 색을 규칙에 따라 칠한 무늬이다. 같은 색이 이어진 방향은?', said.map((s) => s[0]), said.indexOf(right), {
              figure: rows(grid, { w: 30, gap: 0, label: '색칠한 무늬' }), explain: `줄마다 ${told(grid[0].slice(0, 3), '이/가')} 반복되고, ${kind === 'down' ? '모든 줄이 같은 색으로 시작한다' : '아래 줄은 윗줄보다 한 칸씩 밀려 있다'}. ${right[0]}으로 같은 색이 놓여 있다.`, facts: truthOf(said, true)
            });
          }),
          T('rp-grid-blank', '줄마다 밀리는 무늬의 빈칸', '①12 심4', (d) => {
            const cols = d.shuffle(d.pick(TRIPLES)).map(tile), right = d.bool(), nr = 3, nc = 6, grid = range(nr).map((r) => range(nc).map((c) => cols[(((right ? c - r : c + r) % 3) + 3) % 3]));
            const r = d.int(1, 2), c = d.int(1, nc - 2), ans = grid[r][c], picks = d.shuffle(cols);
            return C('규칙에 따라 색칠한 무늬이다. 빈칸에 알맞은 색은?', picks.map((t) => pic(t)), picks.indexOf(ans), {
              figure: rows(grid.map((line, i) => line.map((t, j) => (i === r && j === c ? BL() : t))), { w: 30, gap: 0, label: '색칠한 무늬' }),
              explain: `${ORD[r]} 줄은 ${told(grid[r].slice(0, 3), '이/가')} 반복된다. 빈칸은 ${ORD[c]} 칸이므로 ${josa(ans.word, '을/를')} 칠한다.`, facts: { kindPick: { kinds: picks.map(nameOf), target: run(grid[r].slice(0, 3), nc)[c].name } }
            });
          }),
          T('rp-make', '말한 규칙대로 꿴 구슬', '①14 심7', (d) => {
            // 틀린 줄: 같은 색을 다른 차례로 반복한 것(넷째 칸 안에서 달라진다)
            const names = ['가', '나', '다'], keys = d.shuffle(d.pick([['ABB', 'AAB', 'ABA'], ['ABCC', 'ABBC', 'AABC']])), toks = castBeads(d, kindsOf(FORM[keys[0]])), unit = unitOf(FORM[d.pick(keys)], toks);
            const lists = keys.map((key) => run(unitOf(FORM[key], toks), unit.length === 3 ? 9 : 8)), truth = lists.map((list) => list.every((t, i) => t === unit[i % unit.length])), at = truth.indexOf(true);
            return C(`${told(unit, '이/가')} 반복되는 규칙으로 구슬을 꿰려고 한다. 규칙에 맞게 꿴 것은?`, names, at, {
              figure: named(lists.map((list) => row(list, { w: 28, label: '구슬' })), names), explain: `${names[at]}에서 ${told(unit, '이/가')} 끝까지 반복된다.`, facts: { truth, want: true }
            });
          }, { standard: MAKE })
        ]
      },
      {
        id: 'turn', title: '돌아가는 무늬와 늘어나는 무늬', standard: FIND,
        types: [
          T('tn-dir', '돌아가는 방향', '①15 심8', (d) => {
            const s = d.int(0, 3), cw = d.bool(), at = (i) => (((s + (cw ? i : -i)) % 4) + 4) % 4, gaps = range(3).map((i) => (at(i + 1) - at(i) + 4) % 4);
            const truth = [gaps.every((v) => v === 1), gaps.every((v) => v === 3)];
            return C('색칠한 부분이 규칙에 따라 돌아간다. 색칠한 부분이 돌아가는 방향은?', ['시계 방향', '시계 반대 방향'], truth.indexOf(true), {
              figure: row(range(4).map((i) => wheel4(at(i))), { w: 56, label: '돌아가는 무늬' }),
              explain: `색칠한 부분이 ${range(4).map((i) => QUARTER[at(i)]).join(', ')}의 차례로 옮겨 간다. ${cw ? '시곗바늘이 도는 방향과 같으므로 시계 방향이다.' : '시곗바늘이 도는 방향과 반대이므로 시계 반대 방향이다.'}`, facts: { truth, want: true }
            });
          }),
          T('tn-spot', '●이 놓일 칸', '①16·18 심9', (d) => {
            const s = d.int(0, 3), cw = d.bool(), at = (i) => (((s + (cw ? i : -i)) % 4) + 4) % 4, ans = MARK_SPOT.indexOf(at(5));
            return C('●의 자리가 규칙에 따라 바뀐다. 마지막 그림에서 ●이 놓일 칸은?', MARKS.slice(0, 4), ans, {
              figure: row(range(5).map((i) => quad(at(i))).concat([quadMarks]), { w: 46, label: '●의 자리' }),
              explain: `●이 ${cw ? '시계 방향' : '시계 반대 방향'}으로 한 칸씩 옮겨 간다. ${SPOT[at(4)]} 다음은 ${SPOT[at(5)]}이므로 ${MARKS[ans]}이다.`, facts: { kindPick: { kinds: MARK_SPOT.map((p) => SPOT[p]), target: SPOT[(at(4) + (cw ? 1 : 3)) % 4] } }
            });
          }),
          T('tn-next', '돌아가는 무늬의 다음 그림', '①17·18 심9', (d) => {
            // 틀린 보기: 두 칸 간 것, 반대 방향으로 간 것, 맞은편 칸
            const s = d.int(0, 7), cw = d.bool(), at = (i) => (((s + (cw ? i : -i)) % 8) + 8) % 8, picks = d.shuffle([at(4), at(5), at(2), (at(4) + 4) % 8]);
            return C('색칠한 칸이 규칙에 따라 돌아간다. 빈칸에 알맞은 그림은?', picks.map((k) => pic(wheel8(k), 44)), picks.indexOf(at(4)), {
              figure: row(range(4).map((i) => wheel8(at(i))).concat([BL()]), { w: 54, label: '돌아가는 무늬(칸은 위에서부터 시계 방향으로 1번, 2번, …, 8번)' }),
              explain: `색칠한 칸이 ${cw ? '시계 방향' : '시계 반대 방향'}으로 한 칸씩 돌아간다. 빈칸에는 넷째 그림에서 ${cw ? '시계 방향' : '시계 반대 방향'}으로 한 칸 더 간 그림이 온다.`,
              facts: { kindPick: { kinds: picks.map((k) => wheel8(k).name), target: wheel8((at(3) + (cw ? 1 : 7)) % 8).name } }
            });
          }),
          T('tn-slide', '색칠한 줄이 옮겨 가는 무늬', '①17·18', (d) => {
            const kind = d.pick(['row', 'col']), s = d.int(0, 2), fwd = d.bool(), at = (i) => (((s + (fwd ? i : -i)) % 3) + 3) % 3, picks = d.shuffle(range(3));
            return C('색칠한 줄이 규칙에 따라 바뀐다. 빈칸에 알맞은 그림은?', picks.map((k) => pic(band(kind, k), 44)), picks.indexOf(at(5)), {
              figure: row(range(5).map((i) => band(kind, at(i))).concat([BL()]), { w: 46, label: '색칠한 줄' }),
              explain: `색칠한 줄이 ${range(3).map((i) => BAND[kind][at(i)]).join(', ')}의 차례로 바뀌는 것이 반복된다. ${BAND[kind][at(4)]} 다음은 ${BAND[kind][at(5)]}이다.`, facts: { kindPick: { kinds: picks.map((k) => band(kind, k).name), target: band(kind, at(2)).name } }
            });
          }),
          T('gr-next', '늘어나는 무늬에서 다음에 놓을 수', '①19 심12', (d) => {
            // 한 모양은 1개씩 놓이고 다른 모양은 1개, 2개, 3개로 늘어난다.
            const [x, y] = d.bool() ? castShapes(d, 2) : d.shuffle(STONES).map(thing), list = [x, y, x, y, y, x, y, y, y, x], runs = [];
            list.forEach((t, i) => { if (t === y) { if (i > 0 && list[i - 1] === y) runs[runs.length - 1] += 1; else runs.push(1); } });
            return N(`${josa(noun(x), '과/와')} ${josa(noun(y), '을/를')} 규칙에 따라 놓았다. 다음에 이어서 놓을 ${josa(noun(y), '은/는')} 몇 개인가?`, 4, {
              unit: '개', figure: row(list, { label: '늘어나는 무늬' }), explain: `${noun(x)} 사이에 놓은 ${josa(noun(y), '이/가')} 1개, 2개, 3개로 1개씩 늘어난다. 다음에는 ${josa(noun(y), '을/를')} 4개 놓는다.`,
              facts: { parts: [[`${runs[2]}+(${runs[2]}-${runs[1]})`, 0]] }
            });
          }),
          T('gr-step', '늘어나는 무늬의 넷째 모양', '①19', (d) => {
            // ●이 한 줄씩(또는 몇 개씩) 늘어난다. 늘어나는 수는 1개, 2개, 3개 가운데 하나로 일정하다.
            const kind = d.pick(['rows', 'cols', 'ell', 'bar']), k = kind === 'rows' || kind === 'cols' ? d.int(2, 3) : kind === 'ell' ? 2 : d.int(1, 2), a = kind === 'bar' ? d.int(1, 3) : 0;
            const cellsOf = (n) => (kind === 'rows' ? range(n * k).map((i) => [i % k, Math.floor(i / k)]) : kind === 'cols' ? range(n * k).map((i) => [Math.floor(i / k), i % k])
              : kind === 'ell' ? range(n).map((i) => [0, i]).concat(range(n - 1, 1).map((i) => [i, n - 1])) : range(a + (n - 1) * k).map((i) => [i, 0]));
            const list = range(3, 1).map(cellsOf), counts = list.map((cells) => cells.length), next = cellsOf(4).length;
            return N('●을 규칙에 따라 늘어놓았다. 넷째에 놓을 ●은 모두 몇 개인가?', next, {
              unit: '개', figure: dotSteps(list, ORD, '늘어나는 무늬: ' + counts.map((v, i) => ORD[i] + ' ● ' + v + '개').join(', '), d.pick([PAINT.파란색, PAINT.빨간색, PAINT.초록색])),
              explain: `●이 ${counts[0]}개, ${counts[1]}개, ${counts[2]}개로 ${counts[1] - counts[0]}개씩 늘어난다. 넷째에는 ${counts[2]} + ${counts[1] - counts[0]} = ${next}(개)를 놓는다.`, facts: { calc: [[`${counts[2]}+(${counts[2]}-${counts[1]})`, 0]] }
            });
          })
        ]
      },
      {
        id: 'stack', title: '쌓은 모양에서 규칙 찾기', standard: FIND,
        types: [
          T('st-repeat', '반복하여 쌓은 규칙', '①20·21·23', (d) => {
            const unit = d.pick([[2, 1, 3], [1, 3, 2], [3, 1, 2], [1, 2, 3], [3, 2, 1], [2, 3, 1], [1, 1, 3], [3, 1, 1], [2, 1, 1], [1, 2, 2], [1, 3, 1], [2, 1, 2]]), hs = run(unit, d.pick([6, 9]));
            return M(`쌓기나무를 규칙에 따라 쌓았다. 왼쪽부터 ${unit[0]}개, ㉠개, ㉡개씩 반복된다. ㉠, ㉡에 알맞은 수는?`, [{ label: '㉠', answer: unit[1], unit: '개' }, { label: '㉡', answer: unit[2], unit: '개' }], {
              figure: walls([hs], undefined, '쌓기나무를 쌓은 모양: 왼쪽부터 ' + hs.map((v) => v + '개').join(', ')), explain: `왼쪽부터 ${hs.slice(0, 6).map((v) => v + '개').join(', ')}의 차례이다. ${unit.map((v) => v + '개').join(', ')}씩 반복된다.`,
              facts: { calc: [[String(hs[1 % period(hs)]), 0], [String(hs[2 % period(hs)]), 1]] }
            });
          }),
          T('st-blank', '반복하여 놓은 모양의 빈칸', '①22', (d) => {
            // 쌓기나무 1개, 2개, 3개, 4개로 만든 모양 가운데 셋을 차례로 반복하여 놓는다.
            const SHAPES = { 1: [1], 2: [2], 3: [2, 1], 4: [2, 2] }, unit = d.shuffle([1, 2, 3, 4]).slice(0, 3), counts = run(unit, 6), at = d.int(3, 5);
            return N('쌓기나무로 만든 모양을 규칙에 따라 놓았다. 빈칸에 놓을 모양의 쌓기나무는 몇 개인가?', counts[at], {
              unit: '개', figure: walls(counts.map((v, i) => (i === at ? undefined : SHAPES[v])), undefined, '쌓기나무로 만든 모양을 놓은 줄: ' + counts.map((v, i) => (i === at ? '빈칸' : v + '개')).join(', '), { u: 16, gap: 10 }),
              explain: `쌓기나무가 ${unit.map((v) => v + '개').join(', ')}인 모양이 반복된다. 빈칸에는 ${counts[at]}개로 만든 모양을 놓는다.`, facts: { calc: [[String(counts[at - 3]), 0]] }
            });
          }),
          T('st-pick', '말한 규칙대로 쌓은 모양', '①24', (d) => {
            // 가: 층마다 1개씩, 나: 층마다 2개씩 늘어나는 모양, 다: 늘어나는 수가 일정하지 않거나 늘어나지 않는 모양
            const names = ['가', '나', '다'], s = d.pick([1, 2]), list = d.shuffle([d.pick([[3, 2, 1], [1, 2, 3]]), [1, 2, 3, 2, 1], d.pick([[3, 2, 1, 1], [3, 3], [1, 3, 3, 1]])]);
            const tops = list.map((hs) => layersOf(hs).reverse()), truth = tops.map((layers) => layers.every((v, i) => i === 0 || v - layers[i - 1] === s)), at = truth.indexOf(true);
            return C(`가장 위층에서 아래층으로 내려갈수록 쌓기나무가 ${s}개씩 늘어나게 쌓은 것은?`, names, at, {
              figure: walls(list, names, '쌓기나무로 쌓은 모양: ' + tops.map((layers, i) => names[i] + ' 위층부터 ' + layers.map((v) => v + '개').join(', ')).join(' / '), { u: 16 }),
              explain: `${josa(names[at], '은/는')} 위층부터 ${tops[at].map((v) => v + '개').join(', ')}로 ${s}개씩 늘어난다.`, facts: { truth, want: true }
            });
          }),
          T('st-layer', '층 사이의 규칙', '①25', (d) => {
            const s = d.int(1, 3), t = s === 3 ? 1 : d.int(1, 2), tops = [t, t + s, t + 2 * s], side = d.pick(s === 2 ? ['left', 'right', 'center'] : ['left', 'right']);
            const hs = heightsOf(tops, side === 'left' ? [0, 0, 0] : side === 'right' ? [s, s, 0] : [s / 2, s / 2, 0]), layers = layersOf(hs);
            return N('쌓기나무를 규칙에 따라 쌓았다. 아래층으로 내려갈수록 쌓기나무는 몇 개씩 늘어나는가?', s, {
              unit: '개', figure: walls([hs], undefined, '쌓기나무를 쌓은 모양: ' + layers.map((v, i) => (i + 1) + '층 ' + v + '개').join(', ')),
              explain: `쌓기나무는 3층에 ${layers[2]}개, 2층에 ${layers[1]}개, 1층에 ${layers[0]}개이다. 아래층으로 내려갈수록 ${s}개씩 늘어난다.`, facts: { calc: [[`${layers[0]}-${layers[1]}`, 0]] }
            });
          }),
          T('st-say', '쌓은 규칙을 바르게 말한 것', '①23·27', (d) => {
            // 위로만, 오른쪽으로만, 위와 오른쪽으로 늘어나는 모양. 참·거짓은 모양의 높이와 너비가 달라진 수로 따진다.
            const key = d.pick(['up', 'right', 'ell']), list = grown(key, key === 'ell' ? 1 : d.int(1, 2), 3), tall = (hs) => Math.max.apply(null, hs);
            const ups = [tall(list[1]) - tall(list[0]), tall(list[2]) - tall(list[1])], rights = [list[1].length - list[0].length, list[2].length - list[1].length], all = (vals, v) => vals.every((x) => x === v);
            const said = d.shuffle([['위로 1개씩 늘어난다.', all(ups, 1) && all(rights, 0)], ['오른쪽으로 1개씩 늘어난다.', all(ups, 0) && all(rights, 1)], ['위와 오른쪽으로 1개씩 늘어난다.', all(ups, 1) && all(rights, 1)], ['오른쪽으로 2개씩 늘어난다.', all(ups, 0) && all(rights, 2)]]);
            return C('쌓기나무를 규칙에 따라 쌓았다. 쌓은 규칙을 바르게 말한 것은?', said.map((row) => row[0]), said.findIndex((row) => row[1]), {
              figure: walls(list, ORD, stepsSaid(list)), explain: `쌓기나무가 ${GROW[key].said} 늘어난다.`, facts: truthOf(said, true)
            });
          }),
          T('st-step', '몇 개씩 늘어나는가', '①27 심17·18', (d) => {
            const key = d.pick(['up', 'right', 'twin', 'ell', 'tee', 'triple']), list = grown(key, key === 'ell' || key === 'tee' ? 1 : d.int(1, 2), 3), counts = list.map(sum);
            return N('쌓기나무를 규칙에 따라 쌓았다. 쌓기나무는 몇 개씩 늘어나는가?', GROW[key].step, {
              unit: '개', figure: walls(list, ORD, stepsSaid(list)), explain: `쌓기나무가 ${counts[0]}개, ${counts[1]}개, ${counts[2]}개로 ${counts[1] - counts[0]}개씩 늘어난다.`, facts: { calc: [[`${counts[1]}-${counts[0]}`, 0]] }
            });
          }),
          T('st-next', '다음에 쌓을 모양의 쌓기나무 수', '①28·30 심19', (d) => {
            const key = d.pick(['right', 'twin', 'ell', 'wide', 'tee', 'triple']), b = key === 'tee' ? 1 : key === 'ell' ? d.int(1, 2) : key === 'right' ? d.int(1, 3) : 1, list = grown(key, b, 3), counts = list.map(sum), next = sum(GROW[key].make(4, b));
            return N('쌓기나무를 규칙에 따라 쌓았다. 넷째 모양을 쌓는 데 필요한 쌓기나무는 몇 개인가?', next, {
              unit: '개', figure: walls(list, ORD, stepsSaid(list)), explain: `쌓기나무가 ${counts[0]}개, ${counts[1]}개, ${counts[2]}개로 ${counts[1] - counts[0]}개씩 늘어난다. 넷째 모양은 ${counts[2]} + ${counts[1] - counts[0]} = ${next}(개)이다.`,
              facts: { calc: [[`${counts[2]}+(${counts[2]}-${counts[1]})`, 0]] }
            });
          })
        ]
      },
      { id: 'add', title: '덧셈표에서 규칙 찾기', standard: FIND, types: [] },
      { id: 'mul', title: '곱셈표에서 규칙 찾기', standard: FIND, types: [] },
      { id: 'life', title: '생활에서 규칙 찾기', standard: FIND, types: [] }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
