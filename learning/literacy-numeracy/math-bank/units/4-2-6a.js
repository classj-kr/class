// 4학년 2학기 6단원 평면도형의 이동 — 단원 틀과 기본 문항(점의 이동, 밀기, 뒤집기, 돌리기).
// 수집해 둔 교과서 9종의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1~3: 69·84·72꼴, 심화꼴 71꼴)을 번호마다 따져,
// 꼴마다 ① 몇 학년 무슨 단원 내용인가 ② 무엇을 하게 하는 문제인가를 보고 실었다.
// 교육과정이 금을 그은 것은 싣지 않는다(2026-10-12 걷어 냄): 「돌리고 뒤집기나 뒤집고 돌리기 등 복잡한 변화를 지양한다」 → 뒤집기와 돌리기를 이어 하는 문제,
//   「꼭짓점의 이동을 이용하여 평면도형의 이동을 설명하는 활동은 다루지 않는다」 → 민·뒤집은·돌린 도형에서 꼭짓점이 옮겨 가는 자리를 묻는 문제.
//   같은 갈래를 거듭하는 것(뒤집기 여러 번, 돌리기 여러 번)은 싣는다.
// (움직인 방법, 글자와 수 카드, 규칙적인 무늬의 기본 문항과 실력 문항은 4-2-6b.js에 있다. 대조표는 수집본의 _분석/4-2-6/싣기_대조표.md)
//
// 싣는 기준
//  - 이 단원의 꼴은 절반이 「움직인 도형을 그리시오」이다. 그리기는 받을 수 없으므로 두 가지 고르기로 바꾸어 싣는다.
//    ① 움직인 뒤의 도형은 어느 것인가(가·나·다·라 가운데)
//    ② 움직인 도형을 빈 모눈에 그릴 때 꼭짓점 ㄱ이 옮겨 가는 자리는 어느 점인가(빈 모눈판을 교과서의 그리기 문제와 같은 쪽에 놓는다)
//    그리기 꼴과 고르기 꼴이 같은 판단을 하게 하면 한 번만 싣는다(①22·24, ②30·31, ③22·23은 모두 「뒤집은 도형」).
//  - 움직인 도형을 고르는 문항에는 뒤집거나 돌린 여덟 가지 모양이 모두 다른 도형(LOPSIDED)만 쓴다. 그래야 답이 하나다.
//    오답 보기는 다른 이동의 결과로 짓는다(오른쪽으로 뒤집기를 물으면 위쪽으로 뒤집은 것·반 바퀴 돌린 것·처음 그대로).
//    보기끼리 같은 모양이 생기면 문항을 만들지 않는다(lineup 이 멈춘다).
//  - 「뒤집어도·돌려도 처음과 같은 도형」을 묻는 문항에서는 거꾸로, 왼쪽과 오른쪽이 같은 도형·위와 아래가 같은 도형·반 바퀴 돌려야 같은 도형을
//    일부러 섞는다. 어느 도형이 그런 도형인지는 손으로 적지 않고 점을 움직여 본 결과(sym)로 가린다. 「대칭」이라는 말은 쓰지 않는다(5학년).
//  - 도형은 한 변이 5칸인 모눈판의 가운데 3×3칸 안에 그린다. 그래야 뒤집거나 돌려도 판 안에서 도형이 놓인 자리가 달라지지 않아,
//    모양이 아니라 자리를 보고 답을 고르는 일이 없다.
//  - 밀기는 모양이 변하지 않으므로 「어느 도형인가」보다 「어디로 가는가」를 묻는다(꼭짓점이 옮겨 가는 자리, 민 방법).
//    처음 도형과 민 도형 사이의 빈칸을 민 거리로 세는 잘못을 보기에 넣었다.
//  - 같은 이동을 두세 번 되풀이하는 것(2번·3번 뒤집기, 90°씩 2~3번 돌리기)은 교과서 본문에 있어 기본에 싣고, 네 번 넘게 되풀이하는 것은 실력에 싣는다.
//  - 보기 점의 이름은 가·나·다·라로 붙인다(점 ㄱ·ㄴ과 ㉠·㉡이 한 그림에 있으면 헷갈린다).
//
// 뺀 것과 까닭
//  - 줄 이름과 번호로 자리 읽기(②14·15·17·18 심10, ②16의 자리 이름 부분): 「가의 5」처럼 이름 둘로 자리를 나타내는 것은 좌표 읽기에 가깝고
//    미래엔 한 곳의 차시에만 있다. 두 자리를 그림에 점으로 찍으면 「두 방향으로 이동하는 방법」과 같은 문제다.
//  - 조각을 밀거나 돌리거나 뒤집어 빈 곳에 맞추기(①20·52 ②28·61 ③19·42 심15·23·47), 막힌 조각 빼내기(①21 ②29 심16), 사다리 타기(③64):
//    어려움이 이동이 아니라 조각 맞추기·차례 찾기에서 온다.
//  - 길 찾아 그리기(①10 ②13 심12의 길 긋기, 심5의 피해 가는 길): 답이 여럿이고 그려야 한다.
//  - 한 점을 스스로 골라 옮겨 정사각형 만들기(심11의 원래 꼴): 옮길 점과 갈 자리를 찾는 조건 풀이다. 옮길 점을 정해 준 꼴(③13)만 싣는다.
//  - 처음 도형을 찾아 다른 쪽으로 다시 밀어 그리기(②26): 민 거리가 없어 답이 하나로 정해지지 않는다. 되돌리기는 「밀기 전의 도형의 꼭짓점」이 묻는다.
//  - 네 방향으로 뒤집어 완성되는 도형 그리기(①63), 두 번 뒤집은 방향을 가운데 그림과 함께 묻기(①28 — 「뒤집은 방향」을 두 번 하는 것과 같다)
//  - 방법·까닭 쓰기(①17·25의 설명, ②6·58의 설명, ③6·8의 고쳐 쓰기, 심18·70): 서술형. 같은 판단은 고르기 유형이 묻는다.
//  - 한 칸이 100 m인 지도에서 움직인 거리(심3의 변형): 이동이 아니라 단위 바꾸기가 더 든다. 2 cm씩 5번 움직인 거리(③10의 변형)는 곱셈 한 번이다.
//  - 놀이·만들기(달걀 퍼즐, 책갈피, 블록 밀기 따위), 앞 학년 되짚기(직각·각도·규칙 찾기)
// 낱말: 「시계 방향」「시계 반대 방향」으로 통일한다. 칸 수는 붙여 쓰고(3칸) 길이는 띄어 쓴다(3 cm). 각도는 수에 붙여 쓴다(90°).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { N, M, C } = B.kit;
  const G = B.kit.geo;
  const MOVE = '4수03-04', PATTERN = '4수03-05';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});

  // ── 공통 도구 시작(4-2-6a.js와 4-2-6b.js에 같은 것을 둔다) ─────────────────
  const TAGS = ['가', '나', '다', '라', '마', '바'];
  // 보기 점의 이름(점 ㄱ·ㄴ과 헷갈리지 않게 ㉠㉡이 아니라 가·나를 쓴다)
  const PICKS = TAGS.slice(0, 4);
  // 도형을 그리는 정사각형 모눈판의 한 변(칸). 도형은 가운데 3×3칸 안에 그린다.
  const S = 5;
  const side = (p) => G.flip(p, S, S, 'side'), updown = (p) => G.flip(p, S, S, 'updown'), turn = (p, q) => G.turn(p, S, q);
  // 뒤집고 돌려서 나올 수 있는 여덟 가지
  const images = (p) => [0, 1, 2, 3].map((q) => turn(p, q)).concat([0, 1, 2, 3].map((q) => turn(side(p), q)));
  const distinct = (list) => list.every((a, i) => list.every((b, j) => i >= j || !G.samePoints(a, b)));
  const framed = (list) => list.map(([x, y]) => [x + 1, y + 1]);
  // 여덟 가지가 모두 다른 도형(3×3칸 틀 안의 점)
  const LOPSIDED = [
    [[0, 0], [3, 0], [3, 2], [1, 2], [1, 3], [0, 3]],                                 // 깃발
    [[0, 0], [3, 0], [3, 1], [1, 1], [1, 2], [2, 2], [2, 3], [0, 3]],                 // 아래 가지가 짧은 ㄷ자
    [[1, 0], [3, 0], [3, 1], [2, 1], [2, 3], [1, 3], [1, 2], [0, 2], [0, 1], [1, 1]], // 가지가 둘 달린 막대
    [[0, 0], [2, 0], [3, 3], [0, 3]],                                                 // 한쪽만 비스듬한 사각형
    [[0, 0], [1, 0], [3, 3], [0, 3]],
    [[0, 0], [2, 0], [3, 2], [3, 3], [0, 3]],                                         // 한 귀를 비스듬히 자른 사각형
    [[0, 0], [1, 0], [3, 1], [1, 2], [1, 3], [0, 3]],                                 // 세모 깃발
    [[0, 2], [2, 0], [3, 1], [3, 3], [0, 3]]                                          // 지붕이 한쪽으로 치우친 집
  ].map(framed);
  // 뒤집거나 돌려도 처음과 같아지는 도형들
  const EVEN = [
    [[0, 0], [3, 0], [3, 1], [2, 1], [2, 3], [1, 3], [1, 1], [0, 1]],                 // T자
    [[1, 0], [2, 0], [3, 3], [0, 3]],                                                 // 양쪽이 같게 비스듬한 사각형
    [[0, 0], [1, 0], [1, 2], [2, 2], [2, 0], [3, 0], [3, 3], [0, 3]],                 // U자
    [[0, 1], [3, 1], [3, 2], [0, 2]],                                                 // 긴 네모
    [[0, 0], [1, 0], [1, 1], [2, 1], [2, 0], [3, 0], [3, 3], [2, 3], [2, 2], [1, 2], [1, 3], [0, 3]], // H자
    [[1, 0], [3, 0], [2, 3], [0, 3]],                                                 // 기울어진 네모
    [[0, 0], [2, 0], [2, 2], [3, 2], [3, 3], [1, 3], [1, 1], [0, 1]],                 // 번개
    [[0, 0], [3, 0], [3, 3], [0, 3]],                                                 // 정사각형
    [[1, 0], [2, 0], [2, 1], [3, 1], [3, 2], [2, 2], [2, 3], [1, 3], [1, 2], [0, 2], [0, 1], [1, 1]], // 십자
    [[1, 0], [2, 0], [3, 1], [3, 2], [2, 3], [1, 3], [0, 2], [0, 1]],                 // 팔각형
    [[0, 0], [1, 0], [1, 2], [3, 2], [3, 3], [0, 3]],                                 // 두 가지의 길이가 같은 ㄴ자
    [[0, 0], [3, 3], [0, 3]],                                                         // 두 변의 길이가 같은 직각삼각형
    [[1, 1], [2, 0], [2, 1], [3, 2], [2, 2], [1, 3], [1, 2], [0, 1]]                  // 바람개비
  ].map(framed);
  // 점을 움직여 본 결과로 도형을 가른다(손으로 적지 않는다).
  const sym = (p) => ({ side: G.samePoints(side(p), p), updown: G.samePoints(updown(p), p), half: G.samePoints(turn(p, 2), p), quarter: G.samePoints(turn(p, 1), p) });
  // wide: 왼쪽과 오른쪽만 같다 / tall: 위와 아래만 같다 / both: 둘 다 같지만 90° 돌리면 다르다 / half: 반 바퀴 돌려야만 같다
  // all: 어떻게 움직여도 같다 / wheel: 돌리면 같지만 뒤집으면 다르다 / diag: 뒤집은 것이 90° 돌린 것과 같다 / lopsided: 여덟 가지가 모두 다르다
  function kindOf(p) {
    const s = sym(p);
    if (s.quarter) return s.side ? 'all' : 'wheel';
    if (s.side && s.updown) return 'both';
    if (s.side) return 'wide';
    if (s.updown) return 'tall';
    if (s.half) return 'half';
    return distinct(images(p)) ? 'lopsided' : 'diag';
  }
  const BY = {};
  for (const base of LOPSIDED.concat(EVEN)) for (const p of images(base)) {
    const kind = kindOf(p), list = BY[kind] = BY[kind] || [];
    if (!list.some((q) => G.samePoints(p, q))) list.push(p);
  }
  if (LOPSIDED.some((p) => kindOf(p) !== 'lopsided') || ['wide', 'tall', 'both', 'half', 'all', 'wheel', 'diag'].some((kind) => !BY[kind])) throw new Error('도형 감이 생각한 갈래와 다르다');
  const from = (d, kind) => d.pick(BY[kind]);
  const lopsided = (d) => from(d, 'lopsided');

  // 이동 한 번: flip('오른쪽'), turnBy(true, 90), slide('왼쪽'). times 를 주면 같은 이동을 되풀이한다.
  const flip = (word, times) => ({ kind: 'flip', way: word === '왼쪽' || word === '오른쪽' ? 'side' : 'updown', word, times: times || 1 });
  const turnBy = (clockwise, deg, times) => ({ kind: 'turn', clockwise, deg, q: (clockwise ? 1 : -1) * (deg / 90), times: times || 1 });
  const slide = (word) => ({ kind: 'slide', word, times: 1 });
  const once = (m, p) => (m.kind === 'flip' ? G.flip(p, S, S, m.way) : m.kind === 'turn' ? G.turn(p, S, m.q) : p);
  const act = (m, p) => { let out = p; for (let i = 0; i < m.times; i += 1) out = once(m, out); return out; };
  const run = (moves, p) => moves.reduce((now, m) => act(m, now), p);
  // 검사가 다시 셈할 때 쓰는 이름: 'side', 'updown', 'keep', 시계 방향으로 90° × n
  const steps = (moves) => moves.reduce((out, m) => out.concat(Array.from({ length: m.times }, () => (m.kind === 'flip' ? m.way : m.kind === 'turn' ? m.q : 'keep'))), []);
  const VERB = { flip: ['뒤집기', '뒤집은', '뒤집었을 때', '뒤집은 다음', '뒤집었더니', '뒤집으면'], turn: ['돌리기', '돌린', '돌렸을 때', '돌린 다음', '돌렸더니', '돌리면'], slide: ['밀기', '민', '밀었을 때', '민 다음', '밀었더니', '밀면'] };
  const way = (m) => (m.kind === 'turn' ? `${m.clockwise ? '시계 방향' : '시계 반대 방향'}으로 ${m.deg}°만큼` : `${m.word}으로`);
  // form: 0 ~기, 1 ~ㄴ, 2 ~었을 때, 3 ~ㄴ 다음, 4 ~었더니, 5 ~면
  const say = (m, form) => `${way(m)} ${m.times > 1 ? m.times + '번 ' : ''}${VERB[m.kind][form]}`;
  const anyFlip = (d, axis) => flip(d.pick(axis === 'side' ? ['왼쪽', '오른쪽'] : axis === 'updown' ? ['위쪽', '아래쪽'] : ['왼쪽', '오른쪽', '위쪽', '아래쪽']));
  // 시계 방향으로 90° × q 만큼 돌린 것을 말하는 두 가지 길 가운데 하나(q: 1, 2, 3)
  const anyTurn = (d, q) => (d.bool() ? turnBy(true, q * 90) : turnBy(false, (4 - q) * 90));
  const SWAPPED = { side: '왼쪽과 오른쪽', updown: '위쪽과 아래쪽' };
  const norm = (q) => ((q % 4) + 4) % 4;
  // 돌렸을 때 도형의 위쪽 부분이 가는 쪽: 판의 위쪽 가운데 점을 돌려 보고 정한다.
  function topGoes(q) {
    const [x, y] = G.turn([[S / 2, 0]], S, q)[0];
    return y === 0 ? '위쪽' : x === S ? '오른쪽' : y === S ? '아래쪽' : '왼쪽';
  }

  const shapeBoard = (points, scale, label) => G.board(S, S, [G.polygon(points)], { grid: 'lines', scale: scale || 0.78, label: label || '모눈종이 위의 도형' });
  const shown = (caption, points) => G.tiles([[caption, shapeBoard(points, 0.95)]]);
  const pair = (first, second, captions) => G.tiles([[(captions || ['처음 도형', '움직인 도형'])[0], shapeBoard(first)], [(captions || ['처음 도형', '움직인 도형'])[1], shapeBoard(second)]]);
  const choices = (list) => G.tiles(list.map((p, i) => [TAGS[i], shapeBoard(p)]));
  // 정답 want 와 오답 wrongs 를 섞어 가·나·다·라로 늘어놓는다. 보기끼리 같은 모양이 있으면 만들지 않는다.
  function lineup(d, want, wrongs) {
    const list = d.shuffle([want].concat(wrongs));
    if (!distinct(list)) throw new Error('보기 도형이 서로 겹친다');
    const hits = list.map((p) => G.samePoints(p, want));
    return { list, at: hits.indexOf(true), kinds: hits.map((hit, i) => (hit ? 'hit' : 'no' + i)) };
  }
  // 움직인 도형(또는 움직이기 전의 도형) 고르기. o.moves: 물은 이동, o.back: 그림이 움직인 뒤의 도형이고 처음 도형을 묻는가
  function movedItem(d, text, caption, drawn, want, wrongs, o) {
    const made = lineup(d, want, wrongs);
    return C(text, TAGS.slice(0, made.list.length), made.at, {
      figure: shown(caption, drawn) + choices(made.list), explain: `${o.explain} 답은 ${TAGS[made.at]}이다.`,
      facts: Object.assign({ kindPick: { kinds: made.kinds, target: 'hit' }, moved: { size: S, shown: drawn, steps: steps(o.moves), back: Boolean(o.back), options: made.list } }, o.rule ? { rule: o.rule } : {})
    });
  }
  // 여럿을 고르는 문제의 보기: 맞는 묶음 하나와, 거기서 하나를 빼거나 더하거나 바꾼 틀린 묶음 셋
  function setOptions(d, labels, flags) {
    const key = (list) => list.join(', ');
    const right = labels.filter((_, i) => flags[i]);
    const pool = [];
    labels.forEach((_, i) => { const flipped = labels.filter((__, j) => (j === i ? !flags[j] : flags[j])); if (flipped.length) pool.push(flipped); });
    labels.forEach((_, i) => labels.forEach((__, j) => { if (flags[i] && !flags[j]) pool.push(labels.filter((___, k) => (k === i ? false : k === j ? true : flags[k]))); }));
    const out = [right], seen = new Set([key(right)]);
    for (const cand of d.shuffle(pool)) { if (out.length === 4) break; if (!seen.has(key(cand))) { seen.add(key(cand)); out.push(cand); } }
    const list = d.shuffle(out);
    return { options: list.map(key), answer: list.findIndex((o) => key(o) === key(right)), sets: list };
  }
  // 글 보기 가운데 참(또는 거짓)이 하나뿐인 고르기. rows: [글, 참인가]
  function truthItem(d, text, rows, want, o) {
    const list = d.shuffle(rows);
    if (list.filter(([, ok]) => ok === want).length !== 1) throw new Error('답이 하나가 아니다');
    return C(text, list.map(([said]) => said), list.findIndex(([, ok]) => ok === want), Object.assign({}, o, { facts: Object.assign({ truth: list.map(([, ok]) => ok), want }, o.facts || {}) }));
  }

  // 점의 이동: 모눈의 점은 [가로, 세로]이고 세로는 아래로 갈수록 커진다.
  const DIR = { 오른쪽: [1, 0], 왼쪽: [-1, 0], 위쪽: [0, -1], 아래쪽: [0, 1] };
  const DIRS = Object.keys(DIR);
  const BACK = { 오른쪽: '왼쪽', 왼쪽: '오른쪽', 위쪽: '아래쪽', 아래쪽: '위쪽' };
  const ACROSS = { 오른쪽: ['위쪽', '아래쪽'], 왼쪽: ['위쪽', '아래쪽'], 위쪽: ['왼쪽', '오른쪽'], 아래쪽: ['왼쪽', '오른쪽'] };
  const go = (p, legs) => legs.reduce((now, [dir, n]) => [now[0] + DIR[dir][0] * n, now[1] + DIR[dir][1] * n], p);
  const legsText = (legs, unit) => legs.map(([dir, n]) => `${dir}으로 ${n}${unit}`).join(', ');
  const samePoint = (p, q) => p[0] === q[0] && p[1] === q[1];
  const inside = (p, cols, rows) => p[0] >= 0 && p[0] <= cols && p[1] >= 0 && p[1] <= rows;
  const apart = (list) => list.every((p, i) => list.every((q, j) => i >= j || !samePoint(p, q)));
  // 점의 이름은 언제나 점의 오른쪽 위에 적는다(가장자리에서 자리를 바꾸면 옆 점의 이름과 겹친다). 판의 여백 안에 들어가는 거리다.
  const mark = (p, name) => G.point(p).replace('r="2.8"', 'r="3.3"') + G.text([p[0] + 0.4, p[1] - 0.4], name);
  const gridBoard = (cols, rows, parts, label) => G.board(cols, rows, parts, { grid: 'lines', scale: Math.min(1.2, 286 / (32 + cols * 22)), label });
  const thick = (points) => G.polyline(points).replace('class="mb-line"', 'class="mb-line" style="stroke:#2563eb;stroke-width:3.2;stroke-linejoin:round"');
  // 보기 점들(cands[0] 이 정답)을 섞어 가~라를 붙인다.
  function pointChoice(d, cands) {
    if (!apart(cands)) throw new Error('보기 점이 겹친다');
    const list = d.shuffle(cands), hits = list.map((p) => samePoint(p, cands[0]));
    return { list, at: hits.indexOf(true), kinds: hits.map((hit, i) => (hit ? 'hit' : 'no' + i)) };
  }
  // 밀기 문항에 쓰는 작은 도형(2×2칸). 왼쪽 위 꼭짓점이 [0, 0]이다. spot: 이름을 적을 자리
  const SMALL = [
    { points: [[0, 0], [2, 0], [2, 2], [1, 2], [1, 1], [0, 1]], spot: [1.5, 0.5] },
    { points: [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [0, 2]], spot: [0.5, 1.5] },
    { points: [[0, 0], [2, 2], [0, 2]], spot: [0.62, 1.42] },
    { points: [[0, 0], [1, 0], [2, 2], [0, 2]], spot: [0.62, 1.3] }
  ];
  const shifted = (points, dx, dy) => points.map(([x, y]) => [x + dx, y + dy]);
  // ── 공통 도구 끝 ─────────────────────────────────────────────

  // 처음 도형을 그린 모눈판과, 움직인 도형을 그릴 빈 모눈판을 나란히(위아래로 뒤집을 때는 위아래로) 놓는다. 교과서의 그리기 문제와 같은 자리다.
  // where: 빈 판이 놓이는 쪽. vertex: 처음 도형의 꼭짓점 ㄱ, spots: 빈 판 위의 보기 점들(판 안의 자리)
  function twinBoards(shape, vertex, spots, where) {
    const gap = 1, wide = where === '왼쪽' || where === '오른쪽', span = S * 2 + gap;
    const [first, blank] = { 오른쪽: [[0, 0], [S + gap, 0]], 왼쪽: [[S + gap, 0], [0, 0]], 아래쪽: [[0, 0], [0, S + gap]], 위쪽: [[0, S + gap], [0, 0]] }[where];
    const grid = ([ox, oy]) => { let out = ''; for (let k = 0; k <= S; k += 1) out += G.line([ox + k, oy], [ox + k, oy + S], 'mb-gridline') + G.line([ox, oy + k], [ox + S, oy + k], 'mb-gridline'); return out; };
    const parts = [grid(first), grid(blank), G.polygon(shifted(shape, first[0], first[1])), mark([vertex[0] + first[0], vertex[1] + first[1]], 'ㄱ')].concat(spots.map((p, i) => mark([p[0] + blank[0], p[1] + blank[1]], PICKS[i])));
    return G.board(wide ? span : S, wide ? S : span, parts, { grid: false, scale: wide ? Math.min(1.2, 286 / (32 + span * 22)) : 1.1, label: `모눈판 둘. 한 판에는 도형과 그 도형의 꼭짓점 ㄱ이 있고, ${where}에 놓인 빈 판에는 점 가, 나, 다, 라가 있다.` });
  }
  // 꼭짓점 ㄱ은 3×3칸 틀의 가장자리에 있는 것으로 고른다(한가운데 가까운 꼭짓점은 보기 점 넷이 한 칸 안에 몰린다).
  const onRim = ([x, y]) => x === 1 || x === S - 1 || y === 1 || y === S - 1;

  B.addUnit({
    id: '4-2-6', grade: 4, semester: 2, no: 6, title: '평면도형의 이동', version: 2,
    groups: [
      {
        id: 'point', title: '점의 이동', standard: MOVE,
        types: [
          T('point-go-one', '한 방향으로 이동한 점', '①1·2 ②1 ③1·10 심1·12', (d) => {
            // 오답: 한 칸 덜 간 점(처음 점부터 1로 센 것), 반대쪽으로 간 점, 한 칸 더 간 점이나 다른 쪽으로 간 점
            const cols = 9, rows = 7;
            const m = d.until(() => {
              const dir = d.pick(DIRS), n = d.int(3, 4), start = [d.int(0, cols), d.int(0, rows)];
              const odd = d.bool() ? go(start, [[dir, n + 1]]) : go(start, [[d.pick(ACROSS[dir]), n]]);
              return { dir, n, start, cands: [go(start, [[dir, n]]), go(start, [[dir, n - 1]]), go(start, [[BACK[dir], n]]), odd] };
            }, (x) => x.cands.every((p) => inside(p, cols, rows)));
            const made = pointChoice(d, m.cands);
            return C(`모눈 한 칸의 길이는 1 cm이다. 점 ㄱ을 ${m.dir}으로 ${m.n} cm 이동한 자리에 있는 점은?`, PICKS, made.at, {
              figure: gridBoard(cols, rows, [mark(m.start, 'ㄱ')].concat(made.list.map((p, i) => mark(p, PICKS[i]))), '모눈종이 위의 점 ㄱ과 점 가, 나, 다, 라'),
              explain: `한 칸이 1 cm이므로 점 ㄱ에서 ${m.dir}으로 ${m.n}칸 간 곳의 점을 찾는다. 점 ㄱ이 놓인 자리는 세지 않는다. 답은 점 ${PICKS[made.at]}이다.`,
              facts: { kindPick: { kinds: made.kinds, target: 'hit' }, walk: { from: m.start, legs: [[m.dir, m.n]], options: made.list } }
            });
          }),
          T('point-go-two', '두 방향으로 이동한 점', '①2·3 ②1·2 ③2·10 심1·12', (d) => {
            // 오답: 가로와 세로의 칸 수를 바꾼 점, 위아래를 반대로 간 점, 좌우를 반대로 간 점
            const cols = 9, rows = 7;
            const m = d.until(() => {
              const h = d.pick(['오른쪽', '왼쪽']), v = d.pick(['위쪽', '아래쪽']), a = d.int(2, 4), b = d.int(1, 3), start = [d.int(0, cols), d.int(0, rows)];
              return { h, v, a, b, start, cands: [go(start, [[h, a], [v, b]]), go(start, [[h, b], [v, a]]), go(start, [[h, a], [BACK[v], b]]), go(start, [[BACK[h], a], [v, b]])] };
            }, (x) => x.a !== x.b && x.cands.every((p) => inside(p, cols, rows)));
            const legs = d.shuffle([[m.h, m.a], [m.v, m.b]]), made = pointChoice(d, m.cands);
            return C(`점 ㄱ을 ${legsText(legs, '칸')} 이동한 자리에 있는 점은?`, PICKS, made.at, {
              figure: gridBoard(cols, rows, [mark(m.start, 'ㄱ')].concat(made.list.map((p, i) => mark(p, PICKS[i]))), '모눈종이 위의 점 ㄱ과 점 가, 나, 다, 라'),
              explain: `점 ㄱ에서 ${legs[0][0]}으로 ${legs[0][1]}칸 간 다음, 거기서 ${legs[1][0]}으로 ${legs[1][1]}칸 간 곳의 점을 찾는다. 답은 점 ${PICKS[made.at]}이다.`,
              facts: { kindPick: { kinds: made.kinds, target: 'hit' }, walk: { from: m.start, legs, options: made.list } }
            });
          }),
          T('point-chain', '차례로 여러 번 이동한 점', '①4 ②9·11 ③12 심7', (d) => {
            // 되돌아오는 이동이 섞여 있다. 오답: 마지막 이동을 빠뜨린 점, 되돌아오는 이동을 같은 쪽으로 간 점, 마지막 이동을 반대쪽으로 간 점
            const cols = 9, rows = 7;
            const m = d.until(() => {
              const h = d.pick(['오른쪽', '왼쪽']), v = d.pick(['위쪽', '아래쪽']), start = [d.int(0, cols), d.int(0, rows)];
              const legs = [[h, d.int(3, 5)], [v, d.int(1, 3)], [BACK[h], d.int(1, 2)], [d.bool() ? v : BACK[v], d.int(1, 3)]];
              const stops = legs.map((_, i) => go(start, legs.slice(0, i + 1)));
              const cands = [stops[3], stops[2], go(start, [legs[0], legs[1], [h, legs[2][1]], legs[3]]), go(start, [legs[0], legs[1], legs[2], [BACK[legs[3][0]], legs[3][1]]])];
              return { h, legs, start, stops, cands };
            }, (x) => x.stops.concat(x.cands).every((p) => inside(p, cols, rows)) && apart(x.cands.concat([x.start])));
            const made = pointChoice(d, m.cands);
            return C(`점 ㄱ을 ${legsText(m.legs, '칸')} 차례로 이동하였을 때 도착하는 자리에 있는 점은?`, PICKS, made.at, {
              figure: gridBoard(cols, rows, [mark(m.start, 'ㄱ')].concat(made.list.map((p, i) => mark(p, PICKS[i]))), '모눈종이 위의 점 ㄱ과 점 가, 나, 다, 라'),
              explain: `이동을 하나씩 차례로 따라간다. ${m.h}으로 ${m.legs[0][1]}칸 갔다가 ${BACK[m.h]}으로 ${m.legs[2][1]}칸 되돌아오므로 ${m.h}으로는 ${m.legs[0][1] - m.legs[2][1]}칸 간 셈이다. 답은 점 ${PICKS[made.at]}이다.`,
              facts: { kindPick: { kinds: made.kinds, target: 'hit' }, walk: { from: m.start, legs: m.legs, options: made.list } }
            });
          }),
          T('point-how-one', '한 방향으로 이동하는 방법', '①5 ②3 ③3·4·7 심2', (d) => {
            // 오답: 반대쪽으로 말한 것, 점의 수를 센 것(한 칸 많다), 한 칸 적게 센 것
            const cols = 9, rows = 6;
            const m = d.until(() => { const dir = d.pick(DIRS), n = d.int(3, 6), start = [d.int(0, cols), d.int(0, rows)]; return { dir, n, start, end: go(start, [[dir, n]]) }; }, (x) => inside(x.end, cols, rows));
            const rows4 = [[m.dir, m.n], [BACK[m.dir], m.n], [m.dir, m.n + 1], [m.dir, m.n - 1]].map((leg) => [legsText([leg], '칸'), samePoint(go(m.start, [leg]), m.end)]);
            return truthItem(d, '점 ㄱ을 점 ㄴ의 자리로 이동하려고 한다. 어느 쪽으로 몇 칸 이동해야 하는가?', rows4, true, {
              figure: gridBoard(cols, rows, [mark(m.start, 'ㄱ'), mark(m.end, 'ㄴ')], '모눈종이 위의 점 ㄱ과 점 ㄴ'),
              explain: `점 ㄴ은 점 ㄱ에서 ${m.dir}으로 ${m.n}칸 떨어져 있다. 칸 수는 점이 아니라 점과 점 사이의 칸을 센다.`,
              facts: { walk: { from: m.start, legs: [[m.dir, m.n]], to: m.end } }
            });
          }),
          T('point-how-two', '두 방향으로 이동하는 방법', '①6·8 ②3·4·6·16 ③5·8 심2', (d) => {
            // 오답: 점 ㄴ에서 점 ㄱ으로 가는 방법(거꾸로 말한 것), 가로와 세로의 수를 바꾼 것, 한쪽 방향만 반대로 말한 것
            const cols = 9, rows = 6;
            const m = d.until(() => {
              const h = d.pick(['오른쪽', '왼쪽']), v = d.pick(['위쪽', '아래쪽']), a = d.int(2, 6), b = d.int(1, 4), start = [d.int(0, cols), d.int(0, rows)];
              return { h, v, a, b, start, end: go(start, [[h, a], [v, b]]) };
            }, (x) => x.a !== x.b && inside(x.end, cols, rows));
            const good = d.shuffle([[m.h, m.a], [m.v, m.b]]);
            const rows4 = [good, good.map(([dir, n]) => [BACK[dir], n]), good.map(([dir], i) => [dir, good[1 - i][1]]), good.map(([dir, n]) => [dir === m.v ? BACK[dir] : dir, n])]
              .map((legs) => [legsText(legs, ' cm'), samePoint(go(m.start, legs), m.end)]);
            return truthItem(d, '모눈 한 칸의 길이는 1 cm이다. 점 ㄱ을 점 ㄴ의 자리로 이동하는 방법으로 옳은 것은?', rows4, true, {
              figure: gridBoard(cols, rows, [mark(m.start, 'ㄱ'), mark(m.end, 'ㄴ')], '모눈종이 위의 점 ㄱ과 점 ㄴ'),
              explain: `점 ㄴ은 점 ㄱ에서 ${m.h}으로 ${m.a}칸, ${m.v}으로 ${m.b}칸 떨어져 있다. 한 칸이 1 cm이므로 ${legsText(good, ' cm')} 이동한다. 방향을 모두 반대로 말하면 점 ㄴ에서 점 ㄱ으로 가는 방법이 된다.`,
              facts: { walk: { from: m.start, legs: good, to: m.end } }
            });
          }),
          T('point-path', '꺾인 길을 따라 이동하는 방법', '①7 ②18 ③11 심3', (d) => {
            // 오답: 점 ㄴ에서 거꾸로 읽은 것, 칸이 아니라 점을 세어 한 칸씩 많은 것, 가운데 구간의 방향을 반대로 읽은 것
            const cols = 9, rows = 6;
            const m = d.until(() => {
              const h = d.pick(['오른쪽', '왼쪽']), v = d.pick(['위쪽', '아래쪽']), first = d.bool(), start = [d.int(0, cols), d.int(0, rows)];
              const legs = first ? [[h, d.int(2, 4)], [v, d.int(2, 4)], [h, d.int(1, 3)]] : [[v, d.int(1, 3)], [h, d.int(2, 5)], [v, d.int(1, 3)]];
              return { legs, start, stops: legs.map((_, i) => go(start, legs.slice(0, i + 1))) };
            }, (x) => x.stops.every((p) => inside(p, cols, rows)));
            const same = (legs) => JSON.stringify(legs) === JSON.stringify(m.legs), end = m.stops[2];
            const rows4 = [m.legs, m.legs.slice().reverse().map(([dir, n]) => [BACK[dir], n]), m.legs.map(([dir, n]) => [dir, n + 1]), m.legs.map(([dir, n], i) => [i === 1 ? BACK[dir] : dir, n])].map((legs) => [legsText(legs, '칸'), same(legs)]);
            return truthItem(d, '점 ㄱ에서 굵은 선을 따라 점 ㄴ까지 간다. 가는 방법을 차례대로 바르게 나타낸 것은?', rows4, true, {
              figure: gridBoard(cols, rows, [thick([m.start].concat(m.stops)), mark(m.start, 'ㄱ'), mark(end, 'ㄴ')], '모눈종이 위의 점 ㄱ에서 점 ㄴ까지 두 번 꺾인 굵은 선'),
              explain: `점 ㄱ에서 출발하여 선이 꺾이는 곳까지의 칸 수를 차례로 센다. ${legsText(m.legs, '칸')}이다.`,
              facts: { walk: { from: m.start, legs: m.legs, to: end } }
            });
          }),
          T('point-distance', '선을 따라 움직인 거리', '②6 ③10 심2·4', (d) => {
            const cols = 9, rows = 6;
            const m = d.until(() => {
              const h = d.pick(['오른쪽', '왼쪽']), v = d.pick(['위쪽', '아래쪽']), first = d.bool(), count = d.int(3, 4), start = [d.int(0, cols), d.int(0, rows)];
              const legs = Array.from({ length: count }, (_, i) => [(i % 2 === 0) === first ? h : v, d.int(1, 4)]);
              return { legs, start, stops: legs.map((_, i) => go(start, legs.slice(0, i + 1))) };
            }, (x) => x.stops.every((p) => inside(p, cols, rows)) && new Set(x.legs.map(([, n]) => n)).size >= 2);
            const end = m.stops[m.stops.length - 1], sum = m.legs.reduce((s, [, n]) => s + n, 0);
            return N('모눈 한 칸의 길이는 1 cm이다. 점 ㄱ에서 굵은 선을 따라 점 ㄴ까지 갈 때 움직인 거리는 몇 cm인가?', sum, {
              unit: 'cm', figure: gridBoard(cols, rows, [thick([m.start].concat(m.stops)), mark(m.start, 'ㄱ'), mark(end, 'ㄴ')], `모눈종이 위의 점 ㄱ에서 ${legsText(m.legs, '칸')} 간 곳에 점 ㄴ이 있고, 그 길을 굵은 선으로 그렸다.`),
              explain: `구간마다 칸 수를 세어 더한다. ${m.legs.map(([, n]) => n).join(' + ')} = ${sum}(칸)이고 한 칸이 1 cm이므로 ${sum} cm이다.`,
              facts: { calc: [[m.legs.map(([, n]) => n).join('+'), 0]] }
            });
          }),
          T('point-same-place', '차례를 바꾸어도 같은 자리', '②5 ③6 심5', (d) => {
            // 오답: 가로와 세로의 수를 바꾼 것, 한쪽 방향을 반대로 한 것, 차례도 수도 바꾼 것
            const h = d.pick(['오른쪽', '왼쪽']), v = d.pick(['위쪽', '아래쪽']), [a, b] = d.until(() => [d.int(2, 7), d.int(2, 7)], ([x, y]) => x !== y);
            const first = d.shuffle([[h, a], [v, b]]), net = (legs) => go([0, 0], legs), told = (legs) => `${legs[0][0]}으로 ${legs[0][1]}칸 이동한 다음 ${legs[1][0]}으로 ${legs[1][1]}칸 이동`;
            const swapped = [[first[0][0], first[1][1]], [first[1][0], first[0][1]]];
            const rows4 = [[first[1], first[0]], swapped, [[BACK[first[0][0]], first[0][1]], first[1]], [swapped[1], swapped[0]]].map((legs) => [told(legs), samePoint(net(legs), net(first))]);
            return truthItem(d, `점을 ${told(first)}하였다. 같은 자리에 도착하는 것은?`, rows4, true, {
              explain: `이동하는 차례를 바꾸어도 ${h}으로 ${a}칸, ${v}으로 ${b}칸 간 곳은 같다. 방향이나 칸 수가 달라지면 다른 곳에 도착한다.`,
              facts: { walk: { from: [0, 0], legs: first, to: net(first) } }
            });
          }),
          T('point-detour', '지나쳤다가 되돌아오는 이동', '①8 ②3 심5', (d) => {
            // 오답: 같은 쪽으로 더 가는 것, 한 칸 더 되돌아오는 것, 다른 방향으로 되돌아오는 것
            const cols = 9, rows = 6;
            const m = d.until(() => {
              const h = d.pick(['오른쪽', '왼쪽']), v = d.pick(['위쪽', '아래쪽']), [p, q] = d.bool() ? [h, v] : [v, h], a = d.int(2, 4), b = d.int(2, 4), k = d.int(1, 3), start = [d.int(0, cols), d.int(0, rows)];
              return { p, q, a, b, k, start, over: go(start, [[p, a + k], [q, b]]), end: go(start, [[p, a], [q, b]]) };
            }, (x) => inside(x.over, cols, rows) && inside(x.end, cols, rows) && inside(go(x.start, [[x.p, x.a + x.k]]), cols, rows));
            const rows4 = [[BACK[m.p], m.k], [m.p, m.k], [BACK[m.p], m.k + 1], [BACK[m.q], m.k]].map((leg) => [legsText([leg], '칸'), samePoint(go(m.over, [leg]), m.end)]);
            return truthItem(d, `점 ㄱ에서 ${legsText([[m.p, m.a + m.k], [m.q, m.b]], '칸')} 이동한 다음, 한 번 더 이동하여 점 ㄴ에 도착하려고 한다. 마지막에 이동하는 방법은?`, rows4, true, {
              figure: gridBoard(cols, rows, [mark(m.start, 'ㄱ'), mark(m.end, 'ㄴ')], '모눈종이 위의 점 ㄱ과 점 ㄴ'),
              explain: `점 ㄴ은 점 ㄱ에서 ${m.p}으로 ${m.a}칸, ${m.q}으로 ${m.b}칸 떨어져 있다. ${m.p}으로 ${m.a + m.k}칸을 가면 ${m.k}칸을 더 간 것이므로 ${BACK[m.p]}으로 ${m.k}칸 되돌아온다.`,
              facts: { walk: { from: m.start, legs: [[m.p, m.a + m.k], [m.q, m.b], [BACK[m.p], m.k]], to: m.end } }
            });
          }),
          T('point-before', '이동하기 전의 자리', '①9 ②7 ③9 심6', (d) => {
            // 오답: 같은 쪽으로 한 번 더 간 점(되돌리지 않은 것), 한쪽 방향만 되돌린 점 둘
            const cols = 9, rows = 7;
            const m = d.until(() => {
              const h = d.pick(['오른쪽', '왼쪽']), v = d.pick(['위쪽', '아래쪽']), a = d.int(2, 4), b = d.int(1, 3), end = [d.int(0, cols), d.int(0, rows)];
              return { h, v, a, b, end, cands: [go(end, [[BACK[h], a], [BACK[v], b]]), go(end, [[h, a], [v, b]]), go(end, [[BACK[h], a], [v, b]]), go(end, [[h, a], [BACK[v], b]])] };
            }, (x) => x.cands.every((p) => inside(p, cols, rows)));
            const legs = d.shuffle([[m.h, m.a], [m.v, m.b]]), made = pointChoice(d, m.cands);
            return C(`어떤 점을 ${legsText(legs, '칸')} 이동하였더니 점 ㄴ의 자리에 왔다. 이동하기 전의 자리에 있는 점은?`, PICKS, made.at, {
              figure: gridBoard(cols, rows, [mark(m.end, 'ㄴ')].concat(made.list.map((p, i) => mark(p, PICKS[i]))), '모눈종이 위의 점 ㄴ과 점 가, 나, 다, 라'),
              explain: `이동한 방법을 거꾸로 되돌린다. 점 ㄴ에서 ${legsText(legs.map(([dir, n]) => [BACK[dir], n]), '칸')} 간 곳이 처음 자리이다. 답은 점 ${PICKS[made.at]}이다.`,
              facts: { kindPick: { kinds: made.kinds, target: 'hit' }, walk: { to: m.end, legs, options: made.list, back: true } }
            });
          }),
          T('point-square', '점 하나를 옮겨 정사각형 만들기', '②12 ③13 심11', (d) => {
            // 정사각형의 세 꼭짓점 자리에 점 ㄱ, ㄴ, ㄷ이 있고, 점 ㄹ만 제자리에서 벗어나 있다.
            const cols = 8, rows = 7;
            const m = d.until(() => {
              const s = d.int(2, 3), x0 = d.int(1, cols - s - 1), y0 = d.int(1, rows - s - 1), corners = [[x0, y0], [x0 + s, y0], [x0 + s, y0 + s], [x0, y0 + s]], k = d.int(0, 3);
              const ox = d.pick([-2, -1, 1, 2]), oy = d.pick([-2, -1, 1, 2]);
              return { s, corners, k, ox, oy, off: [corners[k][0] + ox, corners[k][1] + oy] };
            }, (x) => inside(x.off, cols, rows) && x.corners.every((p) => Math.max(Math.abs(p[0] - x.off[0]), Math.abs(p[1] - x.off[1])) >= 2 || samePoint(p, x.corners[x.k])));
            const hd = m.ox > 0 ? '왼쪽' : '오른쪽', vd = m.oy > 0 ? '위쪽' : '아래쪽', a = Math.abs(m.ox), b = Math.abs(m.oy);
            const fixed = [1, 2, 3].map((i) => m.corners[(m.k + i) % 4]);
            return M(`네 점 ㄱ, ㄴ, ㄷ, ㄹ을 차례로 이어 정사각형을 만들려고 한다. 점 ㄹ을 ${hd}과 ${vd}으로 각각 몇 칸 이동해야 하는가?`, [{ label: hd, answer: a, unit: '칸' }, { label: vd, answer: b, unit: '칸' }], {
              figure: gridBoard(cols, rows, fixed.map((p, i) => mark(p, ['ㄱ', 'ㄴ', 'ㄷ'][i])).concat([mark(m.off, 'ㄹ')]),
                `모눈종이 위의 네 점. 점 ㄱ, ㄴ, ㄷ은 한 변이 ${m.s}칸인 정사각형의 세 꼭짓점 자리에 있고, 점 ㄹ은 나머지 꼭짓점 자리에서 ${BACK[hd]}으로 ${a}칸, ${BACK[vd]}으로 ${b}칸 벗어나 있다.`),
              explain: `점 ㄱ, ㄴ, ㄷ으로 정사각형의 세 꼭짓점이 정해지므로 나머지 꼭짓점의 자리도 정해진다. 점 ㄹ은 그 자리에서 ${BACK[hd]}으로 ${a}칸, ${BACK[vd]}으로 ${b}칸 떨어져 있으므로 ${hd}으로 ${a}칸, ${vd}으로 ${b}칸 이동한다.`,
              facts: { calc: [[String(a), 0], [String(b), 1]], walk: { from: m.off, legs: [[hd, a], [vd, b]], to: m.corners[m.k], square: fixed.concat([m.corners[m.k]]) } }
            });
          }),
          T('point-odd', '도착하는 자리가 다른 이동', '①8 ②10 심5', (d) => {
            // 지나쳤다가 되돌아오는 이동이 섞여 있다. 방향별로 모으지 않고 눈에 띄는 수만 보면 틀린다.
            const h = d.pick(['오른쪽', '왼쪽']), v = d.pick(['위쪽', '아래쪽']), a = d.int(3, 6), b = d.int(2, 5), k = d.int(1, 2), j = d.int(1, 2), net = (legs) => go([0, 0], legs);
            const same = [[[h, a + k], [v, b], [BACK[h], k]], [[v, b + j], [h, a], [BACK[v], j]], d.shuffle([[h, a], [v, b]])];
            const odd = d.pick([[[BACK[h], k], [v, b], [h, a]], [[v, b], [h, a + k], [BACK[h], k + 1]], [[h, a], [BACK[v], j], [v, b]]]);
            const rows4 = same.concat([odd]).map((legs) => [legsText(legs, '칸'), !samePoint(net(legs), net(same[2]))]);
            return truthItem(d, '점을 다음과 같이 차례로 이동할 때, 도착하는 자리가 나머지 셋과 다른 것은?', rows4, true, {
              explain: `같은 방향끼리 모으고, 반대 방향으로 간 칸 수는 덜어 낸다. 나머지 셋은 모두 처음 자리에서 ${h}으로 ${a}칸, ${v}으로 ${b}칸 떨어진 곳에 도착한다.`,
              facts: { walk: { from: [0, 0], legs: same[0], to: net(same[2]) } }
            });
          })
        ]
      },
      {
        id: 'slide', title: '평면도형 밀기', standard: MOVE,
        types: [
          T('slide-pick', '민 도형', '①11·13 ②19·20 ③15 심13', (d) => {
            // 오답: 뒤집은 것, 돌린 것 둘. 밀면 모양도 방향도 그대로다.
            const start = lopsided(d), m = slide(d.pick(DIRS));
            return movedItem(d, `도형을 ${say(m, 2)}의 도형은?`, '처음 도형', start, start, [side(start), turn(start, 1), turn(start, 2)], {
              moves: [m], explain: '도형을 밀면 위치만 바뀌고 모양과 방향은 변하지 않는다. 처음 도형과 똑같이 놓인 것을 찾는다.'
            });
          }),
          T('slide-word', '도형을 밀었을 때 변하는 것', '①12 ②27 ③14·62 심18', (d) => {
            const bad = d.shuffle(['모양과 위치가 모두 바뀐다.', '위쪽으로 밀면 도형의 위쪽과 아래쪽이 서로 바뀐다.', '오른쪽으로 밀면 도형의 왼쪽과 오른쪽이 서로 바뀐다.', '위치는 변하지 않고 모양만 바뀐다.', '멀리 밀수록 도형의 크기가 작아진다.']).slice(0, 3);
            return truthItem(d, '도형을 밀었을 때에 대한 설명으로 옳은 것은?', [['모양은 변하지 않고 위치만 바뀐다.', true]].concat(bad.map((said) => [said, false])), true, {
              explain: '도형을 어느 쪽으로 밀어도 모양과 크기, 놓인 방향은 변하지 않는다. 바뀌는 것은 위치뿐이다.'
            });
          }),
          T('slide-two', '두 방향으로 민 도형', '①15 ②21 ③17 심17', (d) => {
            // 같은 도형 여섯 개를 두 줄로 놓았다. 오답: 한쪽으로만 민 것, 칸 수가 다른 것
            const shape = d.pick(SMALL), slots = [0, 3].reduce((out, y) => out.concat([0, 4, 8].map((x) => [x, y])), []);
            const [start, end] = d.until(() => d.shuffle(slots).slice(0, 2), ([p, q]) => p[0] !== q[0] && p[1] !== q[1]);
            const others = slots.filter((p) => p !== start), at = others.indexOf(end), named = [[start, '가']].concat(others.map((p, i) => [p, TAGS[i + 1]]));
            const legs = d.shuffle([[end[0] > start[0] ? '오른쪽' : '왼쪽', Math.abs(end[0] - start[0])], [end[1] > start[1] ? '아래쪽' : '위쪽', Math.abs(end[1] - start[1])]]);
            return C(`가 도형을 ${legsText(legs, '칸')} 밀었을 때의 도형은?`, TAGS.slice(1, 6), at, {
              figure: gridBoard(10, 5, named.map(([p, name]) => G.polygon(shifted(shape.points, p[0], p[1])) + G.text([p[0] + shape.spot[0], p[1] + shape.spot[1]], name)), '모눈종이 위에 모양과 크기가 같은 도형 가, 나, 다, 라, 마, 바가 두 줄로 놓여 있다.'),
              explain: `가 도형의 꼭짓점 하나를 정하여 ${legsText(legs, '칸')} 옮긴 자리를 찾는다. 그 자리에 같은 꼭짓점이 있는 도형은 ${TAGS[at + 1]} 도형이다.`,
              facts: { kindPick: { kinds: others.map((p, i) => (samePoint(p, go(start, legs)) ? 'hit' : 'no' + i)), target: 'hit' }, walk: { from: start, legs, options: others } }
            });
          }),
          T('slide-how', '한 방향으로 민 방법', '①16 ②23·24 ③18 심14', (d) => {
            // 오답: 두 도형 사이의 빈칸을 센 것(2칸 적다), 거꾸로 말한 것(나를 가로 옮기는 방법), 바깥 끝끼리 센 것(2칸 많다)
            const shape = d.pick(SMALL), n = d.int(5, 8), right = d.bool(), cols = n + 2, dir = right ? '오른쪽' : '왼쪽';
            const ga = shifted(shape.points, right ? 0 : n, 0), na = shifted(shape.points, right ? n : 0, 0), reach = (leg) => shifted(ga, DIR[leg[0]][0] * leg[1], 0);
            const rows4 = [[dir, n], [dir, n - 2], [BACK[dir], n], [dir, n + 2]].map((leg) => [legsText([leg], ' cm'), G.samePoints(reach(leg), na)]);
            const label = (points, name) => G.polygon(points) + G.text([points[0][0] + shape.spot[0], points[0][1] + shape.spot[1]], name);
            return truthItem(d, '모눈 한 칸의 길이는 1 cm이다. 가 도형을 밀어 나 도형의 자리로 옮기려면 어느 쪽으로 몇 cm 밀어야 하는가?', rows4, true, {
              figure: gridBoard(cols, 2, [label(ga, '가'), label(na, '나')], '모눈종이 위에 모양과 크기가 같은 도형 가와 나가 한 줄로 떨어져 놓여 있다.'),
              explain: `같은 꼭짓점끼리 비교하면 나 도형은 가 도형에서 ${dir}으로 ${n}칸 떨어져 있다. 한 칸이 1 cm이므로 ${dir}으로 ${n} cm 밀어야 한다. 두 도형 사이의 빈칸만 세면 ${n - 2}칸이라 틀린다.`,
              facts: { walk: { from: ga[0], legs: [[dir, n]], to: na[0] } }
            });
          }),
          T('slide-how-two', '두 방향으로 민 방법', '①17·18 ②23 ③18 심14', (d) => {
            const shape = d.pick(SMALL), cols = 9, rows = 6;
            const m = d.until(() => ({ a: [d.int(0, cols - 2), d.int(0, rows - 2)], b: [d.int(0, cols - 2), d.int(0, rows - 2)] }), (x) => Math.abs(x.a[0] - x.b[0]) >= 3 && Math.abs(x.a[1] - x.b[1]) >= 3);
            const h = m.b[0] > m.a[0] ? '오른쪽' : '왼쪽', v = m.b[1] > m.a[1] ? '아래쪽' : '위쪽', dx = Math.abs(m.b[0] - m.a[0]), dy = Math.abs(m.b[1] - m.a[1]);
            const label = (p, name) => G.polygon(shifted(shape.points, p[0], p[1])) + G.text([p[0] + shape.spot[0], p[1] + shape.spot[1]], name);
            return M(`가 도형을 밀어 나 도형의 자리로 옮기려고 한다. ${h}과 ${v}으로 각각 몇 칸 밀어야 하는가?`, [{ label: h, answer: dx, unit: '칸' }, { label: v, answer: dy, unit: '칸' }], {
              figure: gridBoard(cols, rows, [label(m.a, '가'), label(m.b, '나')], `모눈종이 위에 모양과 크기가 같은 도형 가와 나가 있다. 나 도형은 가 도형에서 ${h}으로 ${dx}칸, ${v}으로 ${dy}칸 떨어진 자리에 있다.`),
              explain: `가 도형과 나 도형의 같은 꼭짓점끼리 비교한다. 나 도형의 꼭짓점은 가 도형의 꼭짓점에서 ${h}으로 ${dx}칸, ${v}으로 ${dy}칸 떨어져 있다.`,
              facts: { calc: [[String(dx), 0], [String(dy), 1]], walk: { from: m.a, legs: [[h, dx], [v, dy]], to: m.b } }
            });
          })
        ]
      },
      {
        id: 'flip', title: '평면도형 뒤집기', standard: MOVE,
        types: [
          T('flip-pick', '뒤집은 도형', '①22·24 ②30·31 ③22·23·35 심19·20', (d, n) => {
            // 오답: 다른 쪽으로 뒤집은 것, 반 바퀴 돌린 것(두 쪽이 다 바뀐 것), 처음 그대로(민 것)
            const m = anyFlip(d, n ? 'updown' : 'side'), start = lopsided(d);
            return movedItem(d, `도형을 ${say(m, 2)}의 도형은?`, '처음 도형', start, act(m, start), [n ? side(start) : updown(start), turn(start, 2), start], {
              moves: [m], explain: `도형을 ${say(m, 5)} 도형의 ${SWAPPED[m.way]}이 서로 바뀐다. ${m.way === 'side' ? '위쪽과 아래쪽' : '왼쪽과 오른쪽'}은 그대로이다.`
            });
          }, { count: 2 }),
          T('flip-word', '뒤집으면 바뀌는 쪽', '①23 ②33 ③21', (d) => {
            const m = anyFlip(d);
            const rows4 = [['도형의 왼쪽과 오른쪽이 서로 바뀐다.', m.way === 'side'], ['도형의 위쪽과 아래쪽이 서로 바뀐다.', m.way === 'updown'], ['도형의 왼쪽과 오른쪽, 위쪽과 아래쪽이 모두 서로 바뀐다.', false], ['도형의 어느 쪽도 바뀌지 않고 위치만 바뀐다.', false]];
            return truthItem(d, `도형을 ${say(m, 2)}에 대한 설명으로 옳은 것은?`, rows4, true, {
              explain: `도형을 왼쪽이나 오른쪽으로 뒤집으면 왼쪽과 오른쪽이 서로 바뀌고, 위쪽이나 아래쪽으로 뒤집으면 위쪽과 아래쪽이 서로 바뀐다. ${m.word}으로 뒤집으면 ${SWAPPED[m.way]}이 서로 바뀐다.`
            });
          }),
          T('flip-same', '결과가 같은 뒤집기', '①23 ②33 ③24 심20', (d) => {
            // 참·거짓은 여덟 가지가 모두 다른 도형 하나를 실제로 움직여 보고 정한다.
            const m = anyFlip(d), probe = LOPSIDED[0], twin = flip({ 왼쪽: '오른쪽', 오른쪽: '왼쪽', 위쪽: '아래쪽', 아래쪽: '위쪽' }[m.word]);
            const others = (m.way === 'side' ? ['위쪽', '아래쪽'] : ['왼쪽', '오른쪽']).map((word) => flip(word));
            const rows4 = [twin, others[0], others[1]].map((x) => [`${say(x, 1)} 도형`, G.samePoints(act(x, probe), act(m, probe))]).concat([[`${m.word}으로 민 도형`, G.samePoints(probe, act(m, probe))]]);
            return truthItem(d, `도형을 ${say(m, 1)} 도형과 항상 같은 것은?`, rows4, true, {
              explain: `왼쪽으로 뒤집은 도형과 오른쪽으로 뒤집은 도형은 서로 같고, 위쪽으로 뒤집은 도형과 아래쪽으로 뒤집은 도형은 서로 같다. 그러므로 ${say(twin, 1)} 도형과 같다.`
            });
          }),
          T('flip-twice', '같은 쪽으로 2번·3번 뒤집은 도형', '①25 ②35 ③25 심24', (d, n) => {
            // 2번 뒤집으면 처음과 같고, 3번 뒤집으면 한 번 뒤집은 것과 같다. 오답: 한 번 뒤집은 것(또는 처음 그대로), 다른 쪽으로 뒤집은 것, 반 바퀴 돌린 것
            const m = anyFlip(d), times = n + 2, start = lopsided(d), one = once(m, start), other = m.way === 'side' ? updown(start) : side(start), many = flip(m.word, times);
            return movedItem(d, `도형을 ${say(many, 2)}의 도형은?`, '처음 도형', start, act(many, start), [times === 2 ? one : start, other, turn(start, 2)], {
              moves: [many], rule: times === 2 ? 'twice' : 'thrice',
              explain: `같은 쪽으로 2번 뒤집으면 처음 도형과 같아진다. ${times === 2 ? '' : `3번 뒤집은 도형은 2번 뒤집어 처음과 같아진 도형을 한 번 더 뒤집은 것이므로 ${m.word}으로 한 번 뒤집은 도형과 같다.`}`.trim()
            });
          }, { count: 2 }),
          T('flip-both', '두 방향으로 이어 뒤집은 도형', '①26 ③26 심25', (d) => {
            // 오답: 한 번만 뒤집은 것 둘, 처음 그대로
            const moves = d.shuffle([anyFlip(d, 'side'), anyFlip(d, 'updown')]), start = lopsided(d);
            return movedItem(d, `도형을 ${say(moves[0], 3)} ${say(moves[1], 2)}의 도형은?`, '처음 도형', start, run(moves, start), [side(start), updown(start), start], {
              moves, explain: `${moves[0].word}으로 뒤집으면 ${SWAPPED[moves[0].way]}이 바뀌고, 이어서 ${moves[1].word}으로 뒤집으면 ${SWAPPED[moves[1].way]}도 바뀐다. 왼쪽과 오른쪽, 위쪽과 아래쪽이 모두 바뀐 도형을 찾는다.`
            });
          }),
          T('flip-which', '뒤집은 방향', '①27 ②30·32 ③27 심22', (d) => {
            // 답이 늘 둘이다(왼쪽과 오른쪽, 또는 위쪽과 아래쪽).
            const m = anyFlip(d), start = lopsided(d), result = act(m, start), labels = ['왼쪽', '오른쪽', '위쪽', '아래쪽'];
            const flags = labels.map((word) => G.samePoints(act(flip(word), start), result));
            const sets = d.shuffle([['왼쪽', '오른쪽'], ['위쪽', '아래쪽'], ['왼쪽', '위쪽'], ['오른쪽', '아래쪽']]), right = labels.filter((_, i) => flags[i]);
            return C('처음 도형을 한 번 뒤집었더니 움직인 도형이 되었다. 뒤집은 방향이 될 수 있는 것을 모두 고른 것은?', sets.map((s) => s.join(', ')), sets.findIndex((s) => s.join() === right.join()), {
              figure: pair(start, result),
              explain: `움직인 도형은 처음 도형의 ${SWAPPED[m.way]}이 서로 바뀐 모양이다. ${right.join('으로 뒤집어도 ')}으로 뒤집어도 같은 도형이 된다.`,
              facts: { sets: { labels, flags, options: sets }, moved: { size: S, shown: start, steps: steps([m]), back: false, options: [result] } }
            });
          }),
          T('flip-before', '뒤집기 전의 도형', '①29 ②34 ③28 심26', (d) => {
            // 같은 쪽으로 한 번 더 뒤집으면 처음 도형이 된다. 오답: 다른 쪽으로 뒤집은 것, 반 바퀴 돌린 것, 그림 그대로
            const m = anyFlip(d), drawn = lopsided(d);
            return movedItem(d, `어떤 도형을 ${say(m, 4)} 그림과 같은 도형이 되었다. 뒤집기 전의 도형은?`, '뒤집은 도형', drawn, act(m, drawn), [m.way === 'side' ? updown(drawn) : side(drawn), turn(drawn, 2), drawn], {
              moves: [m], back: true, explain: `뒤집은 도형을 같은 쪽으로 한 번 더 뒤집으면 처음 도형이 된다. 그림의 도형에서 ${SWAPPED[m.way]}을 서로 바꾼 도형을 찾는다.`
            });
          }),
          T('flip-keep', '뒤집어도 처음과 같은 도형', '①31 ②36 ③30 심28', (d, n) => {
            // 왼쪽과 오른쪽이 같은 도형, 위와 아래가 같은 도형, 둘 다 같은 도형, 반 바퀴 돌려야 같은 도형을 섞는다(방향을 헷갈리면 틀린다).
            const m = anyFlip(d, n ? 'updown' : 'side'), keep = m.way === 'side' ? 'wide' : 'tall', lose = m.way === 'side' ? 'tall' : 'wide';
            const picks = d.until(() => d.shuffle([from(d, keep), from(d, d.pick(['both', 'all', keep])), from(d, lose), from(d, d.pick(['half', 'lopsided', 'diag', lose]))]), distinct);
            const flags = picks.map((p) => G.samePoints(act(m, p), p)), labels = TAGS.slice(0, 4), made = setOptions(d, labels, flags);
            return C(`도형을 ${say(m, 2)} 처음 도형과 같은 것을 모두 고른 것은?`, made.options, made.answer, {
              figure: choices(picks),
              explain: `${m.word}으로 뒤집으면 ${SWAPPED[m.way]}이 서로 바뀐다. ${SWAPPED[m.way]}의 모양이 같은 도형은 뒤집어도 처음과 같다. 그런 도형은 ${labels.filter((_, i) => flags[i]).join(', ')}이다.`,
              facts: { sets: { labels, flags, options: made.sets }, kept: { size: S, shapes: picks, steps: steps([m]) } }
            });
          }, { count: 2 }),
          T('flip-keep-any', '어느 쪽으로 뒤집어도 처음과 같은 도형', '②37 ③30 심29', (d) => {
            const picks = d.shuffle([from(d, d.pick(['both', 'all'])), from(d, 'wide'), from(d, 'tall'), from(d, d.pick(['half', 'diag']))]);
            const hits = picks.map((p) => sym(p).side && sym(p).updown), at = hits.indexOf(true);
            return C('위쪽, 아래쪽, 왼쪽, 오른쪽 가운데 어느 쪽으로 뒤집어도 처음 도형과 같은 것은?', TAGS.slice(0, 4), at, {
              figure: choices(picks),
              explain: `왼쪽과 오른쪽의 모양이 같고 위쪽과 아래쪽의 모양도 같아야 어느 쪽으로 뒤집어도 처음과 같다. ${TAGS[at]} 도형만 그렇다.`,
              facts: { kindPick: { kinds: hits.map((hit, i) => (hit ? 'hit' : 'no' + i)), target: 'hit' }, kept: { size: S, shapes: picks, steps: ['side'], also: ['updown'] } }
            });
          }),
          T('flip-can', '한 번 뒤집어 나올 수 있는 도형', '①32 ②38 ③29 심21', (d) => {
            // 돌려야만 나오는 도형과 두 번 뒤집어야 나오는 도형(반 바퀴 돌린 것)을 섞는다.
            const start = lopsided(d), list = d.shuffle([side(start), updown(start), turn(start, d.pick([1, 3])), turn(start, 2)]);
            const flags = list.map((p) => G.samePoints(p, side(start)) || G.samePoints(p, updown(start))), labels = TAGS.slice(0, 4), made = setOptions(d, labels, flags);
            return C('처음 도형을 한 번 뒤집었을 때 나올 수 있는 도형을 모두 고른 것은?', made.options, made.answer, {
              figure: shown('처음 도형', start) + choices(list),
              explain: `한 번 뒤집으면 왼쪽과 오른쪽이 바뀌거나 위쪽과 아래쪽이 바뀐다. 그런 도형은 ${labels.filter((_, i) => flags[i]).join(', ')}이다. 나머지는 돌리거나 두 번 뒤집어야 나온다.`,
              facts: { sets: { labels, flags, options: made.sets }, reach: { size: S, shown: start, ways: [['side'], ['updown']], options: list } }
            });
          })
        ]
      },
      {
        id: 'turn', title: '평면도형 돌리기', standard: MOVE,
        types: [
          T('turn-pick', '돌린 도형', '①41·43 ②42·43 ③44·45 심35·36', (d, n) => {
            // 오답: 반대 방향으로 돌린 것, 반 바퀴 돌린 것, 뒤집은 것(반 바퀴를 물을 때는 위쪽으로 뒤집은 것 — 흔히 헷갈린다)
            const start = lopsided(d), cw = d.bool();
            const m = [turnBy(true, 90), turnBy(false, 90), turnBy(cw, 180), turnBy(cw, 270)][n], q = norm(m.q);
            const wrongs = q === 2 ? [updown(start), side(start), turn(start, d.pick([1, 3]))] : [turn(start, 4 - q), turn(start, 2), d.pick([start, side(start)])];
            return movedItem(d, `도형을 ${say(m, 2)}의 도형은?`, '처음 도형', start, act(m, start), wrongs, {
              moves: [m], rule: ['cw-quarter', 'ccw-quarter', 'half', 'three-quarters'][n],
              explain: `${m.deg === 270 ? `${way(m)} 돌린 도형은 ${m.clockwise ? '시계 반대 방향' : '시계 방향'}으로 90°만큼 돌린 도형과 같다. ` : ''}도형의 위쪽 부분이 ${topGoes(m.q)}으로 간 도형을 찾는다.`
            });
          }, { count: 4 }),
          T('turn-word', '돌리면 위쪽 부분이 가는 쪽', '①42 ③43 심42', (d) => {
            const m = d.pick([turnBy(true, 90), turnBy(false, 90), turnBy(d.bool(), 180), turnBy(true, 270), turnBy(false, 270)]), goes = topGoes(m.q);
            return truthItem(d, `도형을 ${say(m, 5)} 도형의 위쪽 부분은 어느 쪽으로 가는가?`, ['오른쪽', '아래쪽', '왼쪽'].map((word) => [word, word === goes]).concat([['움직이지 않는다', goes === '위쪽']]), true, {
              explain: `시계 방향으로 90°만큼 돌리면 위쪽 부분이 오른쪽으로, 180°만큼 돌리면 아래쪽으로, 270°만큼 돌리면 왼쪽으로 간다. 시계 반대 방향으로 돌리면 90°일 때 왼쪽, 270°일 때 오른쪽으로 간다.`
            });
          }),
          T('turn-how', '돌린 방법', '①44·45 ②45 ③49 심38', (d, n) => {
            const start = lopsided(d), q = d.int(1, 3), result = turn(start, q);
            if (n === 0) {
              // 방향이 주어지고 각도를 묻는다. 반대 방향으로 재면 다른 각도가 나온다.
              const cw = d.bool(), rows3 = [90, 180, 270].map((deg) => [deg + '°', G.samePoints(act(turnBy(cw, deg), start), result)]), deg = cw ? q * 90 : (4 - q) * 90;
              return truthItem(d, `처음 도형을 ${cw ? '시계 방향' : '시계 반대 방향'}으로 돌렸더니 움직인 도형이 되었다. 몇 도만큼 돌렸는가?`, rows3, true, {
                figure: pair(start, result), explain: `도형의 위쪽 부분이 ${topGoes(q)}으로 갔다. ${cw ? '시계 방향' : '시계 반대 방향'}으로 ${deg}°만큼 돌린 것이다.`,
                facts: { moved: { size: S, shown: start, steps: [q], back: false, options: [result] } }
              });
            }
            // 방향과 각도를 모두 묻는다. 보기 넷은 돌린 결과가 서로 다르다(90°, 180°, 270°, 360°를 한 가지씩).
            const rows4 = [1, 2, 3].map((k) => anyTurn(d, k)).concat([turnBy(d.bool(), 360)]).map((m) => [say(m, 0), G.samePoints(act(m, start), result)]);
            return truthItem(d, '처음 도형을 한 번 돌렸더니 움직인 도형이 되었다. 돌린 방법으로 옳은 것은?', rows4, true, {
              figure: pair(start, result), explain: `도형의 위쪽 부분이 ${topGoes(q)}으로 갔다. 시계 방향으로 ${q * 90}°만큼 돌리거나 시계 반대 방향으로 ${(4 - q) * 90}°만큼 돌리면 된다.`,
              facts: { moved: { size: S, shown: start, steps: [q], back: false, options: [result] } }
            });
          }, { count: 2 }),
          T('turn-same', '반대 방향으로 돌려 같은 도형이 되는 각도', '①46 ②46 ③50 심39', (d) => {
            const cw = d.bool(), deg = d.pick([90, 270]);
            return N(`도형을 ${way(turnBy(cw, deg))} 돌린 도형은 ${cw ? '시계 반대 방향' : '시계 방향'}으로 몇 도만큼 돌린 도형과 같은가? (단, 360°보다 작은 각도로 답한다.)`, 360 - deg, {
              unit: '°', explain: `한 바퀴는 360°이다. ${cw ? '시계 방향' : '시계 반대 방향'}으로 ${deg}°만큼 돌린 도형은 반대 방향으로 360° − ${deg}° = ${360 - deg}°만큼 돌린 도형과 같다.`,
              facts: { calc: [[`360-${deg}`, 0]] }
            });
          }),
          T('turn-full', '처음 도형과 같아지는 돌리기', '①43 ②47 ③51', (d) => {
            const cw = d.bool(), list = d.shuffle([90, 180, 270, 360]);
            return C(`어떤 도형이든 ${cw ? '시계 방향' : '시계 반대 방향'}으로 몇 도만큼 돌리면 처음 도형과 같아지는가?`, list.map((v) => v + '°'), list.indexOf(360), {
              explain: '360°만큼 돌리면 한 바퀴를 돌아 제자리로 오므로 어떤 도형이든 처음 도형과 같아진다.', facts: { pick: { expr: '360', options: list } }
            });
          }),
          T('turn-repeat', '같은 각도로 2번·3번 돌린 도형', '②44 ③47 심40', (d, n) => {
            // 90°씩 2번이면 180°, 3번이면 270°, 180°씩 2번이면 360°(처음과 같다). 오답: 한 번만 돌린 것 따위
            const start = lopsided(d), cw = d.bool();
            const m = n === 0 ? turnBy(cw, 90, d.int(2, 3)) : turnBy(cw, 180, 2), total = norm(m.q * m.times), want = act(m, start);
            const wrongs = total === 0 ? [turn(start, 2), turn(start, 1), updown(start)] : total === 2 ? [turn(start, 1), turn(start, 3), updown(start)] : [turn(start, 4 - total), turn(start, 2), start];
            return movedItem(d, `도형을 ${say(m, 2)}의 도형은?`, '처음 도형', start, want, wrongs, {
              moves: [m], rule: n === 0 ? 'quarter-times' : 'half-twice',
              explain: `${m.deg}°씩 ${m.times}번 돌리면 모두 ${m.deg * m.times}°만큼 돌린 것이다. ${total === 0 ? '360°만큼 돌리면 처음 도형과 같다.' : `도형의 위쪽 부분이 ${topGoes(m.q * m.times)}으로 간 도형을 찾는다.`}`
            });
          }, { count: 2 }),
          T('turn-before', '돌리기 전의 도형', '①48 ②49 ③52 심43', (d) => {
            // 반대 방향으로 같은 각도만큼 되돌린다. 오답: 같은 방향으로 한 번 더 돌린 것, 반 바퀴 돌린 것, 그림 그대로
            const m = turnBy(d.bool(), d.pick([90, 270])), drawn = lopsided(d);
            return movedItem(d, `어떤 도형을 ${say(m, 4)} 그림과 같은 도형이 되었다. 돌리기 전의 도형은?`, '돌린 도형', drawn, turn(drawn, -m.q), [turn(drawn, m.q), turn(drawn, 2), drawn], {
              moves: [m], back: true, explain: `돌린 방향과 반대로 같은 각도만큼 되돌린다. 그림의 도형을 ${m.clockwise ? '시계 반대 방향' : '시계 방향'}으로 ${m.deg}°만큼 돌린 도형을 찾는다.`
            });
          }),
          T('turn-cannot', '돌려서 나올 수 없는 도형', '①50 ②53 ③48 심37', (d) => {
            // 돌린 도형 셋에 뒤집은 도형 하나를 섞는다.
            const start = lopsided(d), odd = d.pick([side(start), updown(start), turn(side(start), 1), turn(side(start), 3)]);
            const list = d.shuffle([turn(start, 1), turn(start, 2), turn(start, 3), odd]);
            if (!distinct(list)) throw new Error('보기 도형이 서로 겹친다');
            const hits = list.map((p) => ![0, 1, 2, 3].some((q) => G.samePoints(p, turn(start, q)))), at = hits.indexOf(true);
            return C('처음 도형을 돌렸을 때 나올 수 없는 도형은?', TAGS.slice(0, 4), at, {
              figure: shown('처음 도형', start) + choices(list),
              explain: `${TAGS[at]} 도형은 처음 도형을 뒤집어야 나오는 도형이다. 도형을 돌리기만 해서는 뒤집은 모양이 되지 않는다.`,
              facts: { kindPick: { kinds: hits.map((hit, i) => (hit ? 'hit' : 'no' + i)), target: 'hit' }, reach: { size: S, shown: start, ways: [[1], [2], [3], [4]], options: list, not: true } }
            });
          }),
          T('turn-keep', '돌려도 처음과 같은 도형', '①51 ②52 ③54 심44', (d, n) => {
            // 180°: 반 바퀴 돌려야 같은 도형 하나와, 뒤집어야만 같은 도형들. 90°: 180°에는 같아도 90°에는 다른 도형을 섞는다.
            const m = n === 0 ? turnBy(d.bool(), 180) : turnBy(d.bool(), d.pick([90, 270]));
            const picks = d.shuffle(n === 0 ? [from(d, d.pick(['half', 'both'])), from(d, 'wide'), from(d, 'tall'), from(d, d.pick(['diag', 'lopsided']))] : [from(d, d.pick(['all', 'wheel'])), from(d, 'both'), from(d, 'half'), from(d, d.pick(['wide', 'tall']))]);
            const hits = picks.map((p) => G.samePoints(act(m, p), p)), at = hits.indexOf(true);
            return C(`도형을 ${say(m, 2)} 처음 도형과 같은 것은?`, TAGS.slice(0, 4), at, {
              figure: choices(picks), explain: `도형을 하나씩 ${way(m)} 돌려 본다. ${TAGS[at]} 도형만 처음 도형과 똑같이 놓인다.${n === 0 ? ' 뒤집어야 처음과 같아지는 도형은 돌리면 달라진다.' : ' 180°만큼 돌렸을 때 처음과 같은 도형도 90°만큼 돌리면 달라질 수 있다.'}`,
              facts: { kindPick: { kinds: hits.map((hit, i) => (hit ? 'hit' : 'no' + i)), target: 'hit' }, kept: { size: S, shapes: picks, steps: steps([m]) }, rule: n === 0 ? 'half-turn' : 'quarter-turn' }
            });
          }, { count: 2 })
        ]
      },
      { id: 'mix', title: '움직인 방법', standard: MOVE, types: [] },
      { id: 'card', title: '글자와 수 카드의 이동', standard: MOVE, types: [] },
      { id: 'pattern', title: '규칙적인 무늬', standard: PATTERN, types: [] }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
