// 1학년 2학기 5단원 규칙 찾기 — 단원 틀, 그림 도구, 기본 문항(물체·무늬의 배열, 규칙 만들기·무늬 꾸미기, 수 배열).
// 영역은 「변화와 관계」. 성취기준 [2수02-01] 물체, 무늬, 수 등의 배열에서 규칙을 찾아 여러 가지 방법으로 표현할 수 있다.
//                         [2수02-02] 자신이 정한 규칙에 따라 물체, 무늬, 수 등을 배열할 수 있다.
// 수집해 둔 평가 자료에서 뽑은 문제 꼴 목록(기본꼴_1 45꼴, 심화꼴 40꼴)을 처음부터 끝까지 대조하여 실었다. 꼴 번호는 ①n = 기본꼴_1의 n번, 심n.
// (수 배열표, 규칙을 여러 가지 방법으로 나타내기의 기본 문항과 실력 문항은 1-2-5b.js에 있다.)
//
// 교육과정의 금
//  - 「물체, 무늬, 수 등의 배열에서는 크기, 색깔, 위치, 순서 등에 대한 단순한 규칙을 다루고, 지나치게 복잡한 배열에 대한 평가는 지양한다.」
//    → 반복되는 부분은 2~4개짜리, 수 배열은 같은 수만큼(2, 3, 4, 5, 10씩) 커지거나 작아지는 것과 반복되는 것만 쓴다. 수는 100까지.
//    → 두 가지가 겹쳐 변하는 규칙(모양과 색이 따로 바뀌는 배열), 묶음 안에서 수를 더하는 규칙은 싣지 않는다.
//  - 답으로 한글을 쓰게 하지 않는다. 물건·색·모양은 고르게 하고, 답 칸에는 수만 받는다.
//
// 싣는 기준
//  - 유형은 주는 것(물체·크기·색·자리·수·무늬)과 묻는 것(다음 것·빠진 것·반복되는 부분·말로 한 규칙·몇째)이 다를 때만 나눈다.
//    「다음에 올 것」을 반복되는 부분만 바꾸어 여러 번 싣지 않는다. 한 유형 안에서 씨앗마다 반복되는 부분의 얼개와 소재가 바뀐다.
//  - 그리기·색칠하기 꼴(①6·7·8·15·16 심2·5·11)은 알맞은 것을 고르게, 규칙을 문장으로 쓰는 꼴(①4·25 심4·20)은 바르게 말한 것을 고르게 바꾸었다.
//  - 뽑은 글에 그림이 없는 꼴은 꼴의 얼개만 따라 배열을 새로 정했다. 낱말은 교과서에 나오는 「규칙, 반복, 빈칸, 수 배열」을 쓴다.
//
// 뺀 것과 까닭
//  - 다른 단원의 일: 빈칸의 모양과 같은 모양의 물건 찾기(①11 심6 — 1-2-3 「여러 가지 모양」의 분류이고 답이 여럿이다)
//  - 규칙이 아니라 눈으로 가려내기: 무늬에 쓰인 모양 고르기(①20 심14)
//  - 묶음 안에서 수를 더하는 규칙(①28 심23), 뜻 없는 셈(빈칸에 들어갈 두 수의 합 ①38·44 심7), 20을 넘는 수의 홀수 세기(심35)
//  - 답이 열린 것: 두 가지로 규칙 만들기(①18 심15), 규칙을 만들어 수를 쓰고 설명하기(①29 심24 — 말한 규칙대로 놓은 수 배열 고르기로 바꾸어 실었다),
//    규칙을 만들어 색칠하고 쓰기(①37 심36), 같은 규칙으로 다른 물건 놓기(①19 — 같은 규칙으로 나타낸 것 고르기로 바꾸어 b 파일에 실었다)
//  - 한 그림에 물건이 서른 개를 넘는 것: 무늬를 완성하는 데 드는 모양의 수(심9). 이어 놓고 세는 일은 「10개를 놓을 때 한 모양의 수」(심8)에 있다.
//  - 뛰는 수가 6·7·11·20인 수 배열(①22·26·33 변형, 심17·19)은 2·3·4·5·10씩으로 바꾸어 실었다.
// 묻는 말: 「~은?/~는?」, 「몇 ~인가?」. 풀이는 「~이다.」 한 문장에 한 가지만 적는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { box, lines, josa, N, M, C } = B.kit;
  const FIND = '2수02-01', MAKE = '2수02-02';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const ORD = ['첫째', '둘째', '셋째', '넷째', '다섯째', '여섯째', '일곱째', '여덟째', '아홉째', '열째'];
  const range = (n, from) => Array.from({ length: n }, (_, i) => i + (from || 0));
  const truthOf = (rows, want) => ({ truth: rows.map((row) => row[1]), want });
  const nameOf = (t) => t.name;

  // ── 그림 도구 ────────────────────────────────────────────────
  // 물건 하나(토큰)는 { name(그림 설명과 보기 이름), word(규칙을 말할 때의 낱말), tail(낱말 뒤에 붙는 말), draw(x, y, r, w) }.
  // draw 는 가운데 (x, y), 반지름쯤 되는 크기 r, 칸 너비 w 를 받아 SVG 조각을 돌려준다.
  const INK = '#1f2933';
  const PAINT = { 빨간색: '#ef4444', 주황색: '#fb923c', 노란색: '#fde047', 초록색: '#4ade80', 파란색: '#3b82f6', 보라색: '#a855f7', 분홍색: '#f9a8d4' };
  const COLORS = Object.keys(PAINT);
  // 색만으로 가려야 하는 배열에 쓰는 색 묶음(서로 헷갈리지 않는 것끼리)
  const PAIRS = [['빨간색', '노란색'], ['파란색', '노란색'], ['보라색', '노란색'], ['빨간색', '파란색'], ['주황색', '파란색'], ['초록색', '보라색']];
  const TRIPLES = [['빨간색', '노란색', '파란색'], ['초록색', '노란색', '보라색'], ['분홍색', '파란색', '노란색']];
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
  // 색을 칠한 모양(색과 모양이 함께 바뀐다), 색 없는 모양(규칙을 나타내는 기호), 색만 다른 같은 모양, 크기만 다른 같은 모양
  const shape = (glyph, color) => ({ name: color + ' ' + glyph, word: glyph, tail: '모양', draw: (x, y, r) => DRAW[glyph](x, y, r, PAINT[color]) });
  const outline = (glyph) => ({ name: glyph, word: glyph, tail: '모양', draw: (x, y, r) => DRAW[glyph](x, y, r * 0.92, '#fff') });
  const tinted = (glyph, color) => ({ name: color + ' ' + glyph, word: color, draw: (x, y, r) => DRAW[glyph](x, y, r, PAINT[color]) });
  const sized = (glyph, color, big) => ({ name: (big ? '큰 ' : '작은 ') + glyph, word: big ? '큰 것' : '작은 것', draw: (x, y, r) => DRAW[glyph](x, y, r * (big ? 1.16 : 0.6), PAINT[color]) });
  // 과일과 하늘의 것
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
  // 구슬(색만 다르다)과 아직 색칠하지 않은 구슬
  const bead = (color) => ({ name: color + ' 구슬', word: color, draw: (x, y, r) => '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + f1(r * 0.98) + '" ' + ink(PAINT[color]) + '/><circle cx="' + f1(x - r * 0.36) + '" cy="' + f1(y - r * 0.38) + '" r="' + f1(r * 0.19) + '" style="fill:#fff;opacity:0.8"/>' });
  const BARE = { name: '빈칸(색칠하지 않은 구슬)', word: '빈칸', draw: (x, y, r) => '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + f1(r * 0.98) + '" style="fill:#fff;stroke:#475569;stroke-width:1.5;stroke-dasharray:3.5 2.5"/>' };
  // 화살표: 0 ↑, 1 →, 2 ↓, 3 ←
  const ARROW = ['↑', '→', '↓', '←'];
  const arrow = (k) => ({ name: ARROW[k] + ' 화살표', word: ARROW[k], tail: '화살표', draw: (x, y, r) => {
    const turn = ([px, py]) => { let p = [px, py]; for (let i = 0; i < k; i += 1) p = [-p[1], p[0]]; return f1(x + p[0] * r) + ',' + f1(y + p[1] * r); };
    return '<polygon points="' + [[0, -1.12], [0.9, -0.08], [0.34, -0.08], [0.34, 1.08], [-0.34, 1.08], [-0.34, -0.08], [-0.9, -0.08]].map(turn).join(' ') + '" ' + ink('#93c5fd') + '/>';
  } });
  // 주사위와 단추(구멍의 수)
  const PIPS = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] };
  const die = (n) => ({ name: '눈 ' + n, word: n, value: n, draw: (x, y, r) => { const h = r * 1.14; return '<rect x="' + f1(x - h) + '" y="' + f1(y - h) + '" width="' + f1(h * 2) + '" height="' + f1(h * 2) + '" rx="' + f1(h * 0.28) + '" ' + ink('#fff') + '/>' + PIPS[n].map(([px, py]) => '<circle cx="' + f1(x + px * h * 0.54) + '" cy="' + f1(y + py * h * 0.54) + '" r="' + f1(h * 0.17) + '" style="fill:' + INK + '"/>').join(''); } });
  const HOLES = { 2: [[-0.3, 0], [0.3, 0]], 3: [[0, -0.32], [-0.3, 0.2], [0.3, 0.2]], 4: [[-0.28, -0.28], [0.28, -0.28], [-0.28, 0.28], [0.28, 0.28]] };
  const button = (n) => ({ name: '구멍 ' + n + '개인 단추', word: n, value: n, draw: (x, y, r) => { const h = r * 1.14; return '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + f1(h) + '" ' + ink('#bfdbfe') + '/><circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + f1(h * 0.74) + '" style="fill:none;stroke:' + INK + ';stroke-width:0.8"/>' + HOLES[n].map(([px, py]) => '<circle cx="' + f1(x + px * h) + '" cy="' + f1(y + py * h) + '" r="' + f1(h * 0.14) + '" style="fill:' + INK + '"/>').join(''); } });
  // 네 칸 가운데 한 칸에 ●이 있는 그림: 0 왼쪽 위, 1 오른쪽 위, 2 오른쪽 아래, 3 왼쪽 아래
  const SPOT = ['왼쪽 위', '오른쪽 위', '오른쪽 아래', '왼쪽 아래'];
  const quad = (p) => ({ name: SPOT[p] + ' 칸에 ●', word: SPOT[p], draw: (x, y, r) => { const h = r * 1.16, dx = p === 1 || p === 2 ? h / 2 : -h / 2, dy = p >= 2 ? h / 2 : -h / 2; return '<rect x="' + f1(x - h) + '" y="' + f1(y - h) + '" width="' + f1(h * 2) + '" height="' + f1(h * 2) + '" ' + ink('#fff') + '/><path d="M' + f1(x) + ' ' + f1(y - h) + 'v' + f1(h * 2) + 'M' + f1(x - h) + ' ' + f1(y) + 'h' + f1(h * 2) + '" ' + pen(INK, 1) + '/><circle cx="' + f1(x + dx) + '" cy="' + f1(y + dy) + '" r="' + f1(h * 0.3) + '" style="fill:' + INK + '"/>'; } });
  // 작은 시계(몇 시). 수는 12, 3, 6, 9만 적는다.
  const clock = (hour) => ({ name: hour + '시', word: hour, value: hour, draw: (x, y, r) => {
    const R = r * 1.26, at = (deg, len) => [x + len * Math.sin((deg * Math.PI) / 180), y - len * Math.cos((deg * Math.PI) / 180)], h = at((hour % 12) * 30, R * 0.5);
    let out = '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + f1(R) + '" ' + ink('#fff', 1.5) + '/>';
    for (let i = 0; i < 12; i += 1) { const p = at(i * 30, R), q = at(i * 30, R * (i % 3 === 0 ? 0.86 : 0.9)); out += '<path d="M' + f1(p[0]) + ' ' + f1(p[1]) + 'L' + f1(q[0]) + ' ' + f1(q[1]) + '" ' + pen(INK, i % 3 === 0 ? 1.4 : 0.9) + '/>'; }
    for (const n of [12, 3, 6, 9]) { const p = at(n * 30, R * 0.66); out += label(p[0], p[1] + 0.4, n, R * 0.34); }
    return out + '<path d="M' + f1(x) + ' ' + f1(y) + 'L' + f1(x) + ' ' + f1(y - R * 0.76) + '" ' + pen('#1d4ed8', 1.7) + '/><path d="M' + f1(x) + ' ' + f1(y) + 'L' + f1(h[0]) + ' ' + f1(h[1]) + '" ' + pen(INK, 2.8) + '/><circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="1.8" style="fill:' + INK + '"/>';
  } });
  // 수 카드와 낱말 카드, 색을 칠한 칸(무늬)
  const card = (x, y, w) => '<rect x="' + f1(x - w / 2 + 1.5) + '" y="' + f1(y - w / 2 + 2.5) + '" width="' + f1(w - 3) + '" height="' + f1(w - 5) + '" rx="4" style="fill:#fff;stroke:#8a96a3;stroke-width:1.1"/>';
  const num = (v) => ({ name: String(v), word: v, value: v, draw: (x, y, r, w) => card(x, y, w) + label(x, y + 0.5, v, String(v).length > 2 ? Math.min(12.5, w * 0.42) : Math.min(16, w * 0.52)) });
  const word = (text) => ({ name: text, word: text, draw: (x, y, r, w) => card(x, y, w) + label(x, y + 0.5, text, Math.min(15, w * 0.5)) });
  const tile = (color) => ({ name: color, word: color, draw: (x, y, r, w) => '<rect x="' + f1(x - w / 2) + '" y="' + f1(y - w / 2) + '" width="' + f1(w) + '" height="' + f1(w) + '" style="fill:' + PAINT[color] + ';stroke:' + INK + ';stroke-width:1"/>' });
  // 빈칸: BL() 은 물음표 칸, BL('㉠') 은 이름 붙은 칸, BL('') 은 이름 없는 빈 칸
  const BL = (name) => ({ blank: name === undefined ? '?' : name });
  const isBlank = (t) => Boolean(t) && t.blank !== undefined;
  const blankAt = (x, y, w, name) => '<rect x="' + f1(x - w / 2 + 2.5) + '" y="' + f1(y - w / 2 + 2.5) + '" width="' + f1(w - 5) + '" height="' + f1(w - 5) + '" rx="4" style="fill:#f8fafc;stroke:#475569;stroke-width:1.4;stroke-dasharray:3.5 2.5"/>' + (name ? label(x, y + 0.5, name, Math.min(15, w * 0.5), '#1d4ed8') : '');
  // 여러 줄을 칸을 맞추어 놓는다. 한 줄에 열 개까지(휴대폰 너비).
  // o: w(칸 너비), gap(줄 사이), label(그림 설명 머리말), names(줄 이름), frame(칸마다 옅은 테두리 — 무늬)
  // 그림 설명에는 놓인 차례대로 이름을 적는다(빈 곳은 「빈칸」).
  function rows(lists, options) {
    const o = options || {}, most = Math.max.apply(null, lists.map((list) => list.length));
    const w = o.w || Math.min(34, Math.floor(284 / most)), r = w * 0.37, gap = o.gap === undefined ? 8 : o.gap, pad = 2;
    const W = most * w + pad * 2, H = lists.length * w + (lists.length - 1) * gap + pad * 2;
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
  // 수 배열표. cell(r, c) 가 칸의 수이고, marks['r,c'] 는 'on'(색칠한 칸) | 'hide'(가려진 칸) | 'empty'(수를 적지 않은 칸) | 빈칸 이름(㉠ …)
  function chart(cell, nRows, nCols, marks, options) {
    const m = marks || {}, o = options || {}, cw = Math.min(34, Math.floor(284 / nCols)), ch = 26, pad = 1.5, told = [];
    let out = '';
    for (let r = 0; r < nRows; r += 1) {
      const line = [];
      for (let c = 0; c < nCols; c += 1) {
        const mark = m[r + ',' + c], v = cell(r, c), x = pad + c * cw, y = pad + r * ch;
        out += '<rect x="' + f1(x) + '" y="' + f1(y) + '" width="' + cw + '" height="' + ch + '" style="fill:' + (mark === 'on' ? '#fde68a' : mark === 'hide' ? '#dfe5ec' : '#fff') + ';stroke:#8a96a3;stroke-width:1"/>';
        if (mark === 'hide') line.push('가려진 칸');
        else if (mark === 'empty') line.push('빈칸');
        else if (mark && mark !== 'on') { out += label(x + cw / 2, y + ch / 2 + 0.5, mark, 14, '#1d4ed8'); line.push('빈칸 ' + mark); }
        else { out += label(x + cw / 2, y + ch / 2 + 0.5, v, String(v).length > 2 ? 11 : 13); line.push(mark === 'on' ? v + '(색칠)' : String(v)); }
      }
      told.push(line.join(', '));
    }
    return '<svg class="mb-geo" viewBox="0 0 ' + (nCols * cw + pad * 2) + ' ' + (nRows * ch + pad * 2) + '" width="' + (nCols * cw + pad * 2) + '" role="img" aria-label="' + (o.label || '수 배열표') + ': ' + told.join(' / ') + '">' + out + '</svg>';
  }

  // ── 반복되는 부분 ────────────────────────────────────────────
  // 얼개는 자리 번호의 줄이다: [0, 1, 1] 은 「가, 나, 나」가 반복되는 배열
  const FORM = { AB: [0, 1], AAB: [0, 0, 1], ABB: [0, 1, 1], ABC: [0, 1, 2], AABB: [0, 0, 1, 1], ABA: [0, 1, 0] };
  const kindsOf = (form) => Math.max.apply(null, form) + 1;
  const unitOf = (form, toks) => form.map((i) => toks[i]);
  const run = (unit, n) => range(n).map((i) => unit[i % unit.length]);
  // 줄에서 처음부터 반복되는 가장 짧은 부분의 길이
  const period = (keys) => { for (let p = 1; p <= keys.length; p += 1) if (keys.every((k, i) => i < p || k === keys[i - p])) return p; return keys.length; };
  // 두 줄이 같은 규칙인가: 같은 것이 놓인 자리가 서로 같다.
  const sameRule = (a, b) => a.length === b.length && a.every((x, i) => a.every((y, j) => (x === y) === (b[i] === b[j])));
  // 소재 고르기
  const castShapes = (d, k) => { const gs = d.shuffle(GLYPHS), cs = d.shuffle(COLORS); return range(k).map((i) => shape(gs[i], cs[i])); };
  const castThings = (d, k) => d.shuffle(d.pick(k > 2 ? [FRUITS, SKY] : [FRUITS, SKY, STONES])).slice(0, k).map(thing);
  const castAny = (d, k) => (d.bool() ? castShapes(d, k) : castThings(d, k));
  // 낱말을 늘어놓고 토씨를 붙인다: told([사과, 귤, 귤], '이/가') → '사과, 귤, 귤이'. 기호(○, ↑)는 뒤에 「모양」「화살표」를 붙여 읽는다.
  const told = (toks, pair) => { const ws = toks.map((t) => t.word), tail = toks[0].tail; return tail ? ws.join(', ') + ' ' + josa(tail, pair) : ws.slice(0, -1).concat([josa(ws[ws.length - 1], pair)]).join(', '); };
  const noun = (t) => (t.tail ? t.word + ' ' + t.tail : String(t.word));

  B.kit.g125 = { ORD, range, truthOf, nameOf, INK, PAINT, COLORS, PAIRS, TRIPLES, GLYPHS, shape, outline, tinted, sized, thing, FRUITS, SKY, STONES, bead, BARE, arrow, die, button, quad, clock, num, word, tile, BL, isBlank, rows, row, pic, named, stack, chart, FORM, kindsOf, unitOf, run, period, sameRule, castShapes, castThings, castAny, told, noun };

  B.addUnit({
    id: '1-2-5', grade: 1, semester: 2, no: 5, title: '규칙 찾기', version: 1,
    groups: [
      {
        id: 'repeat', title: '물체와 무늬의 배열에서 규칙 찾기', standard: FIND,
        types: [
          T('rp-unit', '반복되는 부분 고르기', '①1 심5', (d) => {
            // 틀린 보기: 하나를 더 묶은 것, 하나를 덜 묶은 것(반복되는 부분이 둘이면 뒤의 것을 한 번 더 놓은 것)
            const form = FORM[d.pick(['AB', 'AAB', 'ABB', 'ABC'])], toks = castShapes(d, kindsOf(form)), unit = unitOf(form, toks), L = unit.length, list = run(unit, L === 2 ? 8 : 9);
            const picks = d.shuffle([unit, unit.concat([unit[0]]), L === 2 ? [toks[0], toks[1], toks[1]] : unit.slice(0, L - 1)]), p = period(list.map(nameOf));
            const truth = picks.map((pick) => pick.length === p && pick.every((t, i) => t === list[i]));
            return C('규칙에 따라 놓았다. 반복되는 부분은?', picks.map((pick) => pic(pick)), truth.indexOf(true), { figure: row(list), explain: `처음부터 차례로 보면 ${told(unit, '이/가')} 반복된다.`, facts: { truth, want: true } });
          }),
          T('rp-dice', '반복되는 눈의 수', '①2', (d) => {
            const form = FORM[d.pick(['AAB', 'ABB', 'ABC'])], vals = d.shuffle(range(6, 1)).slice(0, kindsOf(form)), unit = form.map((i) => vals[i]), list = run(unit, d.pick([8, 9]));
            return M(`주사위를 규칙에 따라 놓았다. 눈의 수가 ${unit[0]}, ㉠, ㉡의 차례로 반복된다. ㉠, ㉡에 알맞은 수는?`, [{ label: '㉠', answer: unit[1] }, { label: '㉡', answer: unit[2] }], {
              figure: row(list.map(die), { label: '주사위' }), explain: `눈의 수가 ${unit.join(', ')}의 차례로 반복된다.`, facts: { calc: [[String(unit[1]), 0], [String(unit[2]), 1]] }
            });
          }),
          T('rp-say', '규칙을 바르게 말한 것', '①3·4', (d) => {
            // 틀린 보기: 반복되는 부분의 개수나 차례를 잘못 본 것
            const key = d.pick(['AB', 'AAB', 'ABB']), toks = castThings(d, 2), unit = unitOf(FORM[key], toks), list = run(unit, key === 'AB' ? 8 : 9), p = period(list.map(nameOf));
            const claims = d.shuffle(['AB', 'AAB', 'ABB']).map((k) => unitOf(FORM[k], toks)), said = claims.map((u) => [`${told(u, '이/가')} 반복된다.`, u.length === p && u.every((t, i) => t === list[i])]);
            return C('규칙을 바르게 말한 것은?', said.map((s) => s[0]), said.findIndex((s) => s[1]), { figure: row(list), explain: `처음부터 차례로 보면 ${told(unit, '이/가')} 반복된다.`, facts: truthOf(said, true) });
          }),
          T('rp-next', '다음에 올 것', '①5·6 심1', (d) => {
            const form = FORM[d.pick(['AB', 'AAB', 'ABB', 'ABC', 'AABB'])], toks = castAny(d, kindsOf(form)), unit = unitOf(form, toks), L = unit.length;
            const n = Math.min(9, L * 2 + d.int(0, L - 1)), list = run(unit, n + 1), ans = list[n], picks = d.shuffle(toks);
            return C('규칙에 따라 놓았다. 다음에 올 것은?', picks.map((t) => pic(t)), picks.indexOf(ans), {
              figure: row(list.slice(0, n).concat([BL()])), explain: `${told(unit, '이/가')} 반복된다. 빈칸에는 ${josa(noun(ans), '이/가')} 온다.`, facts: { kindPick: { kinds: picks.map(nameOf), target: ans.name } }
            });
          }),
          T('rp-arrow', '빠진 화살표', '①7 심2', (d) => {
            // 방향이 바뀌는 규칙. 네 방향이 반복될 때는 한쪽으로 돌아가는 차례로 놓는다.
            const L = d.pick([2, 3, 4]), from = d.int(0, 3), step = d.bool() ? 1 : 3;
            const unit = (L === 4 ? range(4).map((i) => (from + i * step) % 4) : d.shuffle(range(4)).slice(0, L)).map(arrow), n = L + 5, at = d.int(L, n - 2), list = run(unit, n), ans = list[at], picks = d.shuffle(range(4)).map(arrow);
            return C('화살표를 규칙에 따라 놓았다. 빈칸에 알맞은 것은?', picks.map((t) => pic(t)), picks.findIndex((t) => t.name === ans.name), {
              figure: row(list.map((t, i) => (i === at ? BL() : t))), explain: `${told(unit, '이/가')} 반복된다. 빈칸에는 ${josa(noun(ans), '이/가')} 온다.`, facts: { kindPick: { kinds: picks.map(nameOf), target: ans.name } }
            });
          }),
          T('rp-two', '빈칸 두 곳', '①6·7 심1·2', (d) => {
            // 틀린 보기: 차례를 바꾼 것, 같은 것을 두 번 놓은 것
            const form = FORM[d.pick(['AAB', 'ABB', 'ABC'])], toks = castAny(d, kindsOf(form)), unit = unitOf(form, toks), list = run(unit, 10);
            const [i, j] = d.until(() => [d.int(3, 5), d.int(7, 9)], ([a, b]) => list[a] !== list[b]), x = list[i], y = list[j];
            const pairs = d.shuffle([[x, y], [y, x], [x, x], [y, y]]), key = (pair) => pair.map(nameOf).join(', ');
            return C('규칙에 따라 놓았다. ㉠, ㉡에 알맞은 것을 차례로 놓은 것은?', pairs.map((pair) => pic(pair)), pairs.findIndex((pair) => pair[0] === x && pair[1] === y), {
              figure: row(list.map((t, k) => (k === i ? BL('㉠') : k === j ? BL('㉡') : t))), explain: `${told(unit, '이/가')} 반복된다. ㉠에는 ${noun(x)}, ㉡에는 ${josa(noun(y), '이/가')} 온다.`, facts: { kindPick: { kinds: pairs.map(key), target: key([x, y]) } }
            });
          }),
          T('rp-color', '색칠하지 않은 것의 색', '①8 심5', (d) => {
            const form = FORM[d.pick(['AB', 'AAB', 'ABB', 'ABC'])], toks = d.shuffle(d.pick(kindsOf(form) === 3 ? TRIPLES : PAIRS)).map(bead), unit = unitOf(form, toks), L = unit.length;
            const n = L === 2 ? 7 : 9, at = d.int(L + 1, n - 1), list = run(unit, n), ans = list[at], picks = d.shuffle(toks);
            return C('구슬을 규칙에 따라 색칠한다. 색칠하지 않은 구슬에 알맞은 색은?', picks.map((t) => pic(t)), picks.indexOf(ans), {
              figure: row(list.map((t, i) => (i === at ? BARE : t)), { label: '구슬' }), explain: `${told(unit, '이/가')} 반복된다. 색칠하지 않은 구슬에는 ${josa(ans.word, '을/를')} 칠한다.`, facts: { kindPick: { kinds: picks.map(nameOf), target: ans.name } }
            });
          }),
          T('rp-size', '크기가 반복되는 배열', '심2 ①3', (d) => {
            const glyph = d.pick(GLYPHS), color = d.pick(COLORS), toks = d.shuffle([sized(glyph, color, true), sized(glyph, color, false)]), unit = unitOf(FORM[d.pick(['AB', 'AAB', 'ABB'])], toks), L = unit.length;
            const n = L === 2 ? 7 : 8, at = d.int(L + 1, n - 1), list = run(unit, n), ans = list[at], picks = d.shuffle(toks);
            return C(`크기가 다른 ${glyph} 모양을 규칙에 따라 놓았다. 빈칸에 알맞은 것은?`, picks.map((t) => pic(t, 36)), picks.indexOf(ans), {
              figure: row(list.map((t, i) => (i === at ? BL() : t)), { w: 34 }), explain: `${told(unit, '이/가')} 반복된다. 빈칸에는 ${josa(ans.word, '이/가')} 온다.`, facts: { kindPick: { kinds: picks.map(nameOf), target: ans.name } }
            });
          }),
          T('rp-turn', '자리가 돌아가는 규칙', '①9', (d) => {
            const from = d.int(0, 3), step = d.bool() ? 1 : 3, at = (i) => (from + i * step) % 4, picks = d.shuffle(range(4));
            return C('●의 자리가 규칙에 따라 바뀐다. 빈칸에 알맞은 그림은?', picks.map((p) => pic(quad(p), 40)), picks.indexOf(at(5)), {
              figure: row(range(5).map((i) => quad(at(i))).concat([BL()]), { w: 46, label: '●의 자리' }),
              explain: `●의 자리가 ${range(4).map((i) => SPOT[at(i)]).join(', ')}의 차례로 바뀌는 것이 반복된다. ${SPOT[at(4)]} 다음에는 ${SPOT[at(5)]}이다.`, facts: { kindPick: { kinds: picks.map((p) => quad(p).name), target: quad(at(5)).name } }
            });
          }),
          T('rp-count', '빈칸까지 채워 세기', '①12', (d) => {
            const ws = d.shuffle(['쿵', '짝']), unit = FORM[d.pick(['AAB', 'ABB'])].map((i) => ws[i]), full = run(unit, 9), target = d.pick(ws), n = full.filter((w) => w === target).length;
            return N(`「쿵」과 「짝」을 규칙에 따라 늘어놓았다. 빈칸까지 모두 채우면 「${target}」은 모두 몇 번 나오는가?`, n, {
              unit: '번', figure: row(full.map((w, i) => (i < 6 ? word(w) : BL())), { label: '소리' }),
              explain: `${unit.join(', ')}의 차례로 반복된다. 빈칸에 차례로 ${full.slice(6, 8).join(', ')}, ${josa(full[8], '을/를')} 넣는다. 「${target}」은 모두 ${n}번 나온다.`, facts: { tallyOf: { list: full, target } }
            });
          }),
          T('rp-nth', '몇째에 놓을 것', '심8', (d) => {
            const form = FORM[d.pick(['AB', 'AAB', 'ABB', 'ABC'])], toks = castAny(d, kindsOf(form)), unit = unitOf(form, toks), L = unit.length, shown = L === 2 ? 5 : 6, k = d.int(8, 10), ans = unit[(k - 1) % L], picks = d.shuffle(toks);
            return C(`규칙에 따라 계속 놓는다. ${ORD[k - 1]}에 놓을 것은?`, picks.map((t) => pic(t)), picks.indexOf(ans), {
              figure: row(run(unit, shown)), explain: `${told(unit, '이/가')} 반복된다. 이어서 놓으면 ${range(k - shown, shown).map((i) => ORD[i] + ' ' + noun(unit[i % L])).join(', ')}이다.`, facts: { kindPick: { kinds: picks.map(nameOf), target: ans.name } }
            });
          }),
          T('rp-clock', '시계의 규칙', '①13 심3', (d) => {
            // 「몇 시」(1-2-3)만 쓴다. 작은 그림에서도 읽히게 3시, 6시, 9시, 12시 가운데 둘을 쓴다.
            const unit = d.shuffle([3, 6, 9, 12]).slice(0, 2), list = run(unit, 5), ans = list[4];
            return N('시계를 규칙에 따라 놓았다. 빈칸에 알맞은 시계는 몇 시를 가리키는가?', ans, {
              unit: '시', figure: row(list.slice(0, 4).map(clock).concat([BL()]), { w: 56, label: '시계' }), explain: `${unit[0]}시, ${unit[1]}시가 반복된다. 빈칸에는 ${ans}시를 가리키는 시계가 온다.`, facts: { calc: [[String(ans), 0]] }
            });
          })
        ]
      },
      {
        id: 'make', title: '규칙을 만들어 무늬 꾸미기', standard: MAKE,
        types: [
          T('mk-follow', '말한 규칙대로 놓은 줄', '①14 심10', (d) => {
            // 틀린 줄: 같은 두 가지를 다른 차례로 반복한 것
            const names = ['가', '나', '다'], keys = d.shuffle(['AB', 'AAB', 'ABB']), key = d.pick(keys), toks = castThings(d, 2), unit = unitOf(FORM[key], toks);
            const lists = keys.map((k) => run(unitOf(FORM[k], toks), 8)), truth = lists.map((list) => list.every((t, i) => t === unit[i % unit.length])), at = truth.indexOf(true);
            return C(`${told(unit, '이/가')} 반복되는 규칙으로 놓은 것은?`, names, at, { figure: named(lists.map((list) => row(list, { w: 28 })), names), explain: `${names[at]}에서 ${told(unit, '이/가')} 반복된다.`, facts: { truth, want: true } });
          }),
          T('mk-blank', '말한 규칙에서 빈칸', '①10', (d) => {
            const form = d.pick([[0, 1, 2, 2], [0, 1, 1, 2], [0, 0, 1, 2], [0, 1, 2]]), toks = castThings(d, 3), unit = unitOf(form, toks), L = unit.length, list = run(unit, L + 3), at = d.int(1, L - 1), ans = list[at], picks = d.shuffle(toks);
            return C(`${told(unit, '이/가')} 반복되는 규칙으로 놓는다. 빈칸에 알맞은 것은?`, picks.map((t) => pic(t)), picks.indexOf(ans), {
              figure: row(list.map((t, i) => (i === at ? BL() : t))), explain: `규칙대로 놓으면 ${list.map((t) => t.word).join(', ')}이다. 빈칸에는 ${josa(noun(ans), '이/가')} 온다.`, facts: { kindPick: { kinds: picks.map(nameOf), target: ans.name } }
            });
          }),
          T('mk-tile', '무늬에서 빈칸의 색', '①15 심11', (d) => {
            // 줄마다 반복되는 부분이 엇갈린다(첫째·셋째 줄과 둘째 줄).
            const toks = d.shuffle(d.pick(PAIRS)).map(tile), unit = unitOf(FORM[d.pick(['AB', 'ABB', 'AAB'])], toks), L = unit.length, shift = L === 2 ? 1 : d.pick([1, 2]), nc = 6;
            const lineOf = (r) => range(nc).map((c) => unit[(c + (r % 2 ? shift : 0)) % L]), grid = range(3).map(lineOf), r = d.int(0, 2), c = d.int(2, nc - 1), ans = grid[r][c], picks = d.shuffle(toks);
            return C('규칙에 따라 색칠한 무늬이다. 빈칸에 알맞은 색은?', picks.map((t) => pic(t)), picks.indexOf(ans), {
              figure: rows(grid.map((line, i) => line.map((t, j) => (i === r && j === c ? BL() : t))), { w: 30, gap: 0, label: '색칠한 무늬' }),
              explain: `첫째 줄과 셋째 줄은 ${told(grid[0].slice(0, L), '이/가')} 반복되고, 둘째 줄은 ${told(grid[1].slice(0, L), '이/가')} 반복된다. 빈칸은 ${ORD[r]} 줄의 ${ORD[c]} 칸이므로 ${ans.word}이다.`, facts: { kindPick: { kinds: picks.map(nameOf), target: ans.name } }
            });
          }),
          T('mk-wrap', '다음 줄로 이어지는 무늬', '①16', (d) => {
            const form = FORM[d.pick(['AAB', 'ABB', 'ABC'])], toks = castShapes(d, kindsOf(form)), unit = unitOf(form, toks), nc = d.pick([4, 5]), seq = run(unit, nc * 3), at = d.int(nc + 1, nc * 3 - 1), ans = seq[at], picks = d.shuffle(toks);
            return C('모양을 규칙에 따라 놓아 무늬를 꾸몄다. 빈칸에 알맞은 모양은?', picks.map((t) => pic(t)), picks.indexOf(ans), {
              figure: rows(range(3).map((r) => range(nc).map((c) => (r * nc + c === at ? BL() : seq[r * nc + c]))), { w: 34, gap: 0, frame: true, label: '모양 무늬' }),
              explain: `첫째 줄부터 차례로 보면 ${told(unit, '이/가')} 반복되고 다음 줄로 이어진다. 빈칸에는 ${josa(noun(ans), '이/가')} 온다.`, facts: { kindPick: { kinds: picks.map(nameOf), target: ans.name } }
            });
          }),
          T('mk-tile-count', '빈칸에 칠할 색의 칸 수', '①17', (d) => {
            const toks = d.shuffle(d.pick(PAIRS)).map(tile), unit = unitOf(FORM[d.pick(['ABB', 'AAB'])], toks), shift = d.pick([1, 2]), nc = 6;
            const grid = range(3).map((r) => range(nc).map((c) => unit[(c + (r % 2 ? shift : 0)) % 3]));
            // 빈칸은 줄마다 한 칸. 세 칸에 칠할 색이 모두 같지는 않게 고른다.
            const cols = d.until(() => range(3).map(() => d.int(1, nc - 1)), (list) => new Set(list.map((c, r) => grid[r][c])).size === 2), target = d.pick(toks), fills = cols.map((c, r) => grid[r][c]), flags = fills.map((t) => t === target);
            return N(`규칙에 따라 색칠한 무늬이다. 빈칸 3칸 가운데 ${josa(target.word, '을/를')} 칠할 칸은 몇 칸인가?`, flags.filter(Boolean).length, {
              unit: '칸', figure: rows(grid.map((line, r) => line.map((t, c) => (c === cols[r] ? BL() : t))), { w: 30, gap: 0, label: '색칠한 무늬' }),
              explain: `빈칸에 칠할 색은 위에서부터 차례로 ${fills.map((t) => t.word).join(', ')}이다. ${josa(target.word, '은/는')} ${flags.filter(Boolean).length}칸이다.`, facts: { count: flags }
            });
          }),
          T('mk-number', '말한 규칙대로 놓은 수', '①29 심24', (d) => {
            // 틀린 보기: 커지고 작아지는 것을 거꾸로 한 것, 뛰는 수가 다른 것
            const up = d.bool(), dir = up ? 1 : -1, s = d.pick([2, 3, 4, 5, 10]), a = d.int(4 * s + 1, 100 - 4 * s), other = s === 10 ? 5 : s - 1;
            const seq = (step) => range(5).map((i) => a + i * step), said = d.shuffle([seq(dir * s), seq(-dir * s), seq(dir * other)]).map((list) => [list.join(', '), list[0] === a && list.every((v, i) => i === 0 || v - list[i - 1] === dir * s)]);
            return C(`${a}부터 시작하여 ${s}씩 ${up ? '커지게' : '작아지게'} 수를 놓은 것은?`, said.map((row) => row[0]), said.findIndex((row) => row[1]), {
              explain: `${a}부터 ${s}씩 ${up ? '커지는' : '작아지는'} 수를 차례로 쓰면 ${seq(dir * s).join(', ')}이다.`, facts: truthOf(said, true)
            });
          })
        ]
      },
      {
        id: 'number', title: '수 배열에서 규칙 찾기', standard: FIND,
        types: [
          T('nm-repeat', '반복되는 수 배열의 빈칸', '①21 심16', (d) => {
            const form = FORM[d.pick(['AB', 'AAB', 'ABB', 'ABC'])], vals = d.shuffle(range(15, 1)).slice(0, kindsOf(form)), unit = form.map((i) => vals[i]), L = unit.length, n = L === 2 ? 6 : 8, at = d.int(L + 1, n - 1), list = run(unit, n);
            return N('수를 규칙에 따라 놓았다. 빈칸에 알맞은 수는?', list[at], {
              figure: row(list.map((v, i) => (i === at ? BL() : num(v))), { label: '수 배열' }), explain: `${unit.slice(0, -1).concat([josa(unit[L - 1], '이/가')]).join(', ')} 반복된다. 빈칸에 알맞은 수는 ${list[at]}이다.`, facts: { calc: [[String(list[at]), 0]] }
            });
          }),
          T('nm-up', '커지는 수 배열의 빈칸', '①22 심17', (d) => {
            const s = d.pick([2, 3, 4, 5, 10]), a = d.int(1, s === 10 ? 40 : 60), list = range(6).map((i) => a + i * s), at = d.int(3, 5);
            return N('규칙에 따라 수가 커진다. 빈칸에 알맞은 수는?', list[at], {
              figure: row(list.map((v, i) => (i === at ? BL() : num(v))), { label: '수 배열' }), explain: `${a}부터 시작하여 ${s}씩 커진다. ${list[at - 1]}보다 ${s} 큰 수는 ${list[at]}이다.`, facts: { calc: [[`${list[at - 1]}+${list[1]}-${list[0]}`, 0]] }
            });
          }),
          T('nm-down', '작아지는 수 배열의 빈칸', '①23 심18', (d) => {
            const s = d.pick([2, 3, 4, 5, 10]), a = d.int(5 * s + 1, 100), list = range(6).map((i) => a - i * s), at = d.int(3, 5);
            return N('규칙에 따라 수가 작아진다. 빈칸에 알맞은 수는?', list[at], {
              figure: row(list.map((v, i) => (i === at ? BL() : num(v))), { label: '수 배열' }), explain: `${a}부터 시작하여 ${s}씩 작아진다. ${list[at - 1]}보다 ${s} 작은 수는 ${list[at]}이다.`, facts: { calc: [[`${list[at - 1]}-(${list[0]}-${list[1]})`, 0]] }
            });
          }),
          T('nm-step', '몇부터 시작하여 몇씩', '①24', (d) => {
            const up = d.bool(), s = d.pick([2, 3, 4, 5, 10]), a = up ? d.int(2, 100 - 4 * s) : d.int(4 * s + 1, 100), list = range(5).map((i) => a + (up ? i : -i) * s), how = up ? '커진다' : '작아진다';
            return M('수 배열의 규칙을 찾았다. ㉠, ㉡에 알맞은 수는?', [{ label: '㉠', answer: a }, { label: '㉡', answer: s }], {
              figure: stack([row(list.map(num), { label: '수 배열' }), lines([`${box('㉠')}부터 시작하여 ${box('㉡')}씩 ${how}.`])]),
              explain: `${list[0]}, ${list[1]}, ${josa(list[2], '으로/로')} ${s}씩 ${how}. 시작하는 수는 ${a}이다.`, facts: { calc: [[String(a), 0], [up ? `${list[1]}-${list[0]}` : `${list[0]}-${list[1]}`, 1]] }
            });
          }),
          T('nm-say', '수 배열의 규칙을 바르게 말한 것', '①25 심20', (d) => {
            // 말은 { unit } (반복) 이거나 { start, step } (같은 수만큼 커지거나 작아짐). 참·거짓은 수 배열에 대어 다시 따진다.
            // 틀린 보기: 앞의 두 수만 보고 말한 것, 커지고 작아지는 것을 거꾸로 말한 것, 뛰는 수를 잘못 센 것
            const kind = d.pick(['repeat', 'up', 'down']);
            const holds = (claim, list) => (claim.unit ? period(list) === claim.unit.length && claim.unit.every((v, i) => v === list[i]) : list[0] === claim.start && list.every((v, i) => i === 0 || v - list[i - 1] === claim.step));
            const say = (claim) => (claim.unit ? `${claim.unit.slice(0, -1).concat([josa(claim.unit[claim.unit.length - 1], '이/가')]).join(', ')} 반복된다.` : `${claim.start}부터 시작하여 ${Math.abs(claim.step)}씩 ${claim.step > 0 ? '커진다' : '작아진다'}.`);
            let list, claims;
            if (kind === 'repeat') {
              const lo = d.int(1, 9), hi = lo + d.int(2, 6), long = d.bool(), unit = long ? [lo, hi, hi] : [lo, hi];
              list = run(unit, long ? 7 : 6); claims = [{ unit }, { unit: long ? [lo, hi] : [lo, hi, hi] }, { start: lo, step: hi - lo }];
            } else {
              const dir = kind === 'up' ? 1 : -1, s = d.pick([2, 3, 4, 5, 10]), a = dir > 0 ? d.int(2, 100 - 4 * s) : d.int(4 * s + 1, 100);
              list = range(5).map((i) => a + dir * i * s); claims = [{ start: a, step: dir * s }, { start: a, step: -dir * s }, { start: a, step: dir * (s === 10 ? 5 : s + 1) }, { unit: [list[0], list[1]] }];
            }
            const said = d.shuffle(claims).map((claim) => [say(claim), holds(claim, list)]), right = said.find((row) => row[1]);
            return C('수 배열의 규칙을 바르게 말한 것은?', said.map((row) => row[0]), said.indexOf(right), { figure: row(list.map(num), { label: '수 배열' }), explain: `끝까지 차례로 보면 ${right[0]}`, facts: truthOf(said, true) });
          }),
          T('nm-far', '떨어진 칸의 수', '①26 심19', (d) => {
            const s = d.pick([2, 3, 4, 5, 10]), a = d.int(1, 100 - 6 * s), list = range(6).map((i) => a + i * s);
            return N('규칙에 따라 수를 놓았다. ㉠에 알맞은 수는?', list[5], {
              figure: row(list.slice(0, 4).map(num).concat([BL(''), BL('㉠')]), { label: '수 배열' }), explain: `${a}부터 시작하여 ${s}씩 커진다. ${list[3]} 다음 수는 ${list[4]}이고, ㉠에 알맞은 수는 ${list[5]}이다.`,
              facts: { calc: [[`${list[3]}+(${list[1]}-${list[0]})+(${list[1]}-${list[0]})`, 0]] }
            });
          }),
          T('nm-which', '수가 반복되는 수 배열', '①27', (d) => {
            // 틀린 줄: 같은 수만큼 커지는 것(규칙은 있지만 반복이 아니다), 아무 규칙 없이 놓은 것
            const names = ['가', '나', '다'], unit = d.shuffle(range(9, 1)).slice(0, d.pick([2, 3])), a = d.int(1, 6), s = d.pick([2, 3]);
            const mixed = d.until(() => range(6).map(() => d.int(1, 9)), (list) => period(list) > 3 && new Set(list.map((v, i) => (i ? v - list[i - 1] : 0)).slice(1)).size > 2 && list.every((v, i) => i === 0 || v !== list[i - 1]));
            const lists = d.shuffle([run(unit, 6), range(6).map((i) => a + i * s), mixed]), truth = lists.map((list) => period(list) <= 3), at = truth.indexOf(true);
            return C('수가 반복되는 규칙으로 놓은 것은?', names, at, {
              figure: named(lists.map((list) => row(list.map(num), { w: 30, label: '수 배열' })), names), explain: `${names[at]}에서 ${unit.slice(0, -1).concat([josa(unit[unit.length - 1], '이/가')]).join(', ')} 반복된다.`, facts: { truth, want: true }
            });
          })
        ]
      },
      { id: 'table', title: '수 배열표에서 규칙 찾기', standard: FIND, types: [] },
      { id: 'express', title: '규칙을 여러 가지 방법으로 나타내기', standard: FIND, types: [] }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
