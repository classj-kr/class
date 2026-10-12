// 4학년 2학기 6단원 평면도형의 이동 — 뒤집고 돌리기, 글자와 수 카드, 규칙적인 무늬의 기본 문항과 실력 문항.
// 꼴 목록(기본꼴 1~3의 「뒤집고 돌리기」「글자」「수 카드」「무늬」 묶음, 심화꼴 71꼴)을 번호마다 따져서 실었다.
//
// 실력 문항의 잣대(기본에서 이미 하는 일을 고르기로 바꾸고 흔한 실수 답을 보기에 넣은 것은 실력이 아니다. 그런 것은 싣지 않는다)
//   ① 그림·상황 자체에 장치가 있어 뜻을 정확히 대야 풀리는 문제. 어려움이 보기가 아니라 문제에 놓인 도형에서 나온다.
//      - 한쪽만 같은 도형을 주면 「위쪽으로 뒤집은 도형과 180° 돌린 도형은 같다」가 참이 되기도 하고 거짓이 되기도 한다(hard-shape-talk).
//      - 뒤집어도 같은 도형·반 바퀴 돌려야 같은 도형·어떻게 해도 달라지는 도형을 섞어 놓고, 두 가지로 움직인 결과가 같은 도형을 찾게 한다(hard-equal-moves).
//      - 한쪽이 같은 도형이 움직인 그림을 주면 그 이동이 뒤집기로도 돌리기로도 읽힌다(hard-two-readings).
//   ② 심화꼴 목록에 있는, 이동을 두세 번 잇거나 거꾸로 되돌려야 풀리는 문제: 여러 번 이동하기 전의 자리, 여러 번 되풀이한 이동을 한 번으로 줄이기,
//      두 번 움직이기 전의 도형, 잘못 움직인 것 바로잡기, 이어 한 이동과 같은 한 번의 이동, 되풀이되는 모양의 몇 번째, 수 카드를 두 가지로 움직인 합과 차.
// 실력에서 내리거나 지운 것(처음에는 실력에 두었다)
//   - 밀기·뒤집기·돌리기에 대한 설명 고르기(오개념 보기 넷), 같은 도형이 되는 두 돌리기 짝 고르기: 뜻 되묻기다. 같은 일은 기본의
//     「도형을 밀었을 때 변하는 것」「결과가 같은 뒤집기」「돌리면 위쪽 부분이 가는 쪽」「반대 방향으로 돌려 같은 도형이 되는 각도」가 한다. 지웠다.
//   - 처음과 같은 도형이 되는 여러 가지 이동(③36·37): 2번 뒤집기·360° 돌리기는 기본의 「같은 쪽으로 2번·3번 뒤집은 도형」「처음 도형과 같아지는 돌리기」가 하고,
//     여러 번 되풀이는 실력의 「여러 번 움직인 뒤 처음과 같아지는 것」이 한다. 지웠다.
//   - 움직인 뒤 처음과 달라지는 것(③63): 「한 도형을 뒤집고 돌린 결과에 대한 설명」에 합쳤다.
//   - 도착하는 자리가 다른 이동(②10 심5), 어떻게 움직여도 나올 수 없는 도형(②57), 보기와 같은 방법으로 움직인 도형(②59): 기본 꼴이고 장치도 없다. 기본으로 내렸다.
//
// 뺀 것과 까닭(4-2-6a.js에 적은 것 말고)
//  - 낱자를 돌려 낱말·영어 문장 만들기(①54 ②68, ①56의 영어 문장, 심31의 낱말): 낱말 짜 맞추기이고 수학 밖이다.
//  - 조건이 여럿인 수 만들기(①38 심31·59): 뒤집어도 같은 숫자를 고른 뒤 0을 맨 앞에 두지 않는 가장 작은 수를 만드는 조건 풀이가 어려움의 절반이다.
//    수 카드로 가장 큰(작은) 수 하나를 만들어 돌리는 것(②75 심58)은 싣는다.
//  - 알파벳(②65·66 ③32 심30·46의 알파벳 보기): 글꼴에 따라 답이 달라진다(B, S, N). 같은 판단은 획이 곧은 한글 낱자로 묻는다.
//    ㅈ·ㅊ·ㅎ·ㅅ·ㅇ도 글꼴을 타므로 쓰지 않는다. 낱자는 글꼴이 아니라 선분으로 그려, 뒤집고 돌린 모양을 끝점으로 셈한다.
//  - 바늘 시계를 돌린 시각(②54): 시계를 돌리면 눈금의 수도 함께 돌아 시각이 그대로이고, 수를 빼고 읽으면 두 바늘이 실제로 있을 수 없는 자리에 놓인다.
//  - 숫자마다 다른 이동을 하여 나온 숫자를 모두 더하기(심62): 뜻 없는 셈.
//  - 무늬 꾸미기·색칠하기(①68 ②84 ③71 심71), 규칙 설명하기(③72 심70): 작도와 서술형. 같은 판단은 「무늬를 만든 방법」이 묻는다.
// 디지털 숫자: 옆으로·위로 뒤집으면 2와 5가 바뀌고, 반 바퀴 돌리면 6과 9가 바뀐다. 옆으로 뒤집기와 반 바퀴 돌리기는 자리의 차례도 거꾸로 된다.
// 뒤집은 1은 칸의 왼쪽으로 옮겨 가므로 「처음과 같은 숫자」를 묻는 문항(옆으로 뒤집기·반 바퀴 돌리기)에는 1을 내지 않는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, N, M, C } = B.kit;
  const G = B.kit.geo;
  const MOVE = '4수03-04', PATTERN = '4수03-05';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});

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

  // 어떤 도형에서나 두 이동의 결과가 같은가(도형 감을 모두 움직여 본다). 「항상 같다」는 말의 참·거짓을 손으로 적지 않으려고 쓴다.
  const PROBES = LOPSIDED.concat(EVEN);
  const alwaysSame = (a, b) => PROBES.every((p) => G.samePoints(run(a, p), run(b, p)));
  const rotations = (p) => [0, 1, 2, 3].map((q) => turn(p, q));

  // ── 글자 ─────────────────────────────────────────────────────
  // 낱자는 3×3 틀 안에 선분으로 그린다. 선분의 끝점을 뒤집고 돌려 움직인 모양을 셈한다.
  const JAMO = {
    ㄱ: [[[0, 0], [3, 0]], [[3, 0], [3, 3]]],
    ㄴ: [[[0, 0], [0, 3]], [[0, 3], [3, 3]]],
    ㄷ: [[[0, 0], [3, 0]], [[0, 0], [0, 3]], [[0, 3], [3, 3]]],
    ㄹ: [[[0, 0], [3, 0]], [[3, 0], [3, 1.5]], [[3, 1.5], [0, 1.5]], [[0, 1.5], [0, 3]], [[0, 3], [3, 3]]],
    ㅁ: [[[0, 0], [3, 0]], [[3, 0], [3, 3]], [[3, 3], [0, 3]], [[0, 3], [0, 0]]],
    ㅂ: [[[0, 0], [0, 3]], [[3, 0], [3, 3]], [[0, 1.5], [3, 1.5]], [[0, 3], [3, 3]]],
    ㅍ: [[[0, 0], [3, 0]], [[0, 3], [3, 3]], [[1, 0], [1, 3]], [[2, 0], [2, 3]]],
    ㅌ: [[[0, 0], [3, 0]], [[0, 1.5], [3, 1.5]], [[0, 3], [3, 3]], [[0, 0], [0, 3]]],
    ㅋ: [[[0, 0], [3, 0]], [[3, 0], [3, 3]], [[0, 1.5], [3, 1.5]]],
    ㅏ: [[[1.5, 0], [1.5, 3]], [[1.5, 1.5], [3, 1.5]]],
    ㅓ: [[[1.5, 0], [1.5, 3]], [[1.5, 1.5], [0, 1.5]]],
    ㅗ: [[[0, 1.5], [3, 1.5]], [[1.5, 1.5], [1.5, 0]]],
    ㅜ: [[[0, 1.5], [3, 1.5]], [[1.5, 1.5], [1.5, 3]]]
  };
  const strokeKey = (segs) => segs.map((seg) => seg.map((p) => p.map((v) => Math.round(v * 100) / 100).join(',')).sort().join('~')).sort().join(' ');
  const sameStrokes = (a, b) => strokeKey(a) === strokeKey(b);
  // 이동(m)을 글자(가로 w, 세로 h 틀)에 한다. 틀이 정사각형이 아니면 돌리기는 180°만 쓴다(옆으로 한 번, 위로 한 번 뒤집은 것과 같다).
  function strokeAct(m, segs, w, h) {
    let out = segs;
    for (let i = 0; i < m.times; i += 1) {
      if (m.kind === 'flip') out = out.map((seg) => G.flip(seg, w, h, m.way));
      else if (m.kind === 'turn' && w === h) out = out.map((seg) => G.turn(seg, w, m.q));
      else if (m.kind === 'turn') {
        if (norm(m.q) % 2) throw new Error('긴 글자 틀은 90°로 돌리지 않는다');
        if (norm(m.q) === 2) out = out.map((seg) => G.flip(G.flip(seg, w, h, 'side'), w, h, 'updown'));
      }
    }
    return out;
  }
  const strokeRun = (moves, segs, w, h) => moves.reduce((now, m) => strokeAct(m, now, w, h), segs);
  function strokeCard(segs, w, h, scale, label) {
    const pad = 0.6, frame = [[0, 0], [w + pad * 2, 0], [w + pad * 2, h + pad * 2], [0, h + pad * 2]];
    const bold = (p, q) => G.line([p[0] + pad, p[1] + pad], [q[0] + pad, q[1] + pad]).replace('class="mb-line"', 'class="mb-line" style="stroke-width:3.4"');
    return G.board(w + pad * 2, h + pad * 2, [G.polygon(frame).replace('class="mb-poly"', 'class="mb-poly" style="fill:#fff;stroke:#94a3b8;stroke-width:1.2"')].concat(segs.map(([p, q]) => bold(p, q))), { grid: false, scale: scale || 0.85, label: label || '글자 카드' });
  }
  const jamoCard = (segs, scale) => strokeCard(segs, 3, 3, scale);
  // 이름표 없이 늘어놓은 카드. 화면 검사는 너비 60px 미만인 그림을 찌그러진 것으로 보므로 숫자 한 자리 카드도 60px 넘게 그린다(scale 0.92).
  const plainRow = (list) => '<div class="mb-tiles">' + list.join('') + '</div>';
  // 받침 있는 글자(가로 3, 세로 6.6 틀): 위 칸에 첫소리, 가운데에 홀소리(ㅗ·ㅜ), 아래 칸에 받침을 그린다. 위아래로 뒤집으면 첫소리와 받침의 자리가 바뀐다.
  const SYL_W = 3, SYL_H = 6.6;
  function syllable(first, vowel, last) {
    const squash = (name, y0) => JAMO[name].map((seg) => seg.map(([x, y]) => [x, y0 + y * 0.6])), mid = SYL_H / 2;
    return squash(first, 0).concat([[[-0.3, mid], [3.3, mid]], [[1.5, mid], [1.5, mid + (vowel === 'ㅗ' ? -0.8 : 0.8)]]], squash(last, SYL_H - 1.8));
  }
  const SYL = { 문: ['ㅁ', 'ㅜ', 'ㄴ'], 곰: ['ㄱ', 'ㅗ', 'ㅁ'], 눈: ['ㄴ', 'ㅜ', 'ㄴ'], 곡: ['ㄱ', 'ㅗ', 'ㄱ'], 몸: ['ㅁ', 'ㅗ', 'ㅁ'], 뭄: ['ㅁ', 'ㅜ', 'ㅁ'], 돔: ['ㄷ', 'ㅗ', 'ㅁ'], 묻: ['ㅁ', 'ㅜ', 'ㄷ'], 롬: ['ㄹ', 'ㅗ', 'ㅁ'], 물: ['ㅁ', 'ㅜ', 'ㄹ'] };
  const syl = (name) => syllable(SYL[name][0], SYL[name][1], SYL[name][2]);
  const sylCard = (segs, scale) => strokeCard(segs, SYL_W, SYL_H, scale || 0.7);

  // ── 디지털 숫자 ──────────────────────────────────────────────
  // 엔진의 획 셈(segNumber)과 따로, 숫자끼리 바뀌는 표로도 셈해 둘이 어긋나면 멈춘다.
  const DIGIT = { side: { 0: '0', 1: '1', 2: '5', 5: '2', 8: '8' }, updown: { 0: '0', 1: '1', 2: '5', 3: '3', 5: '2', 8: '8' }, half: { 0: '0', 1: '1', 2: '2', 5: '5', 6: '9', 8: '8', 9: '6' } };
  // 움직인 뒤의 수(글). 숫자가 아닌 모양이 생기면 null. axis: 'side', 'updown', 'half'
  function segMoved(text, axis) {
    const mapped = String(text).split('').map((ch) => DIGIT[axis][ch]);
    const byTable = mapped.some((ch) => ch === undefined) ? null : (axis === 'updown' ? mapped : mapped.reverse()).join('');
    if (byTable !== G.segText(G.segNumber(String(text), axis))) throw new Error('디지털 숫자 셈이 어긋난다');
    return byTable;
  }
  const segAxis = (m) => (m.kind === 'flip' ? m.way : 'half');
  const segCard = (text, scale) => G.segDigits(String(text), { scale: scale || 1.2, label: `디지털 숫자로 쓴 수 카드 ${text}` });
  // 수(글) 뽑기: 맨 앞과 맨 끝은 0이 아니다(옆으로 뒤집거나 반 바퀴 돌리면 끝자리가 맨 앞으로 온다). 같은 숫자만으로 된 수(66)는 쓰지 않는다.
  const digitText = (d, pool, lengths, ok) => d.until(() => Array.from({ length: d.pick(lengths) }, () => d.pick(pool.split(''))).join(''), (t) => t[0] !== '0' && t[t.length - 1] !== '0' && new Set(t).size > 1 && ok(t));
  // 숫자 사이에 기호(: 또는 +)를 넣어 한 줄로 그린다. left·right: 수(글)나 획 묶음
  const segLine = (left, sign, right, label, scale) => '<span style="display:inline-flex;align-items:center;gap:2px;padding:2px 8px;border:2px solid #1e293b;border-radius:10px;background:#fff">'
    + G.segDigits(left, { card: false, label, scale }) + '<span style="font-size:28px;font-weight:700;line-height:1">' + sign + '</span>' + G.segDigits(right, { card: false, label: '디지털 숫자', scale }) + '</span>';
  // 가운데 점선을 따라 접는 종이. 왼쪽 절반에 디지털 숫자로 수를 썼다.
  // (그림 안에 그림을 넣으면 안쪽 그림의 크기가 숫자 획이 차지한 만큼으로만 재어져 화면 검사가 「찌그러진 그림」으로 본다. 그래서 종이는 HTML 칸으로 그린다.)
  function foldPaper(text) {
    const half = 'display:flex;align-items:center;justify-content:center;width:116px;height:92px';
    return '<span style="display:inline-flex;border:1.5px solid #64748b;border-radius:4px;background:#fff"><span style="' + half + ';border-right:1.5px dashed #64748b">'
      + G.segDigits(String(text), { card: false, scale: 1.1, label: `종이의 왼쪽 절반에 디지털 숫자로 쓴 수 ${text}, 종이의 가운데에는 접는 점선` }) + '</span><span style="' + half + '"></span></span>';
  }
  // 거울에 비친 바늘 시계: 시계 그림을 통째로 옆으로 뒤집는다. seen: 거울 속에서 읽히는 [시, 분]
  const mirrorClock = (hour, minute, seen) => G.clock(hour, minute).replace(/^(<svg[^>]*>)([\s\S]*)(<\/svg>)$/, '$1<g transform="translate(108 0) scale(-1 1)">$2</g>$3')
    .replace(/aria-label="[^"]*"/, `aria-label="거울에 비친 시계. 거울 속에서는 ${seen[0]}시 ${seen[1]}분을 가리키는 것처럼 보인다."`).replace('width="104"', 'width="150"');

  // ── 무늬 ─────────────────────────────────────────────────────
  // 한 칸(2×2)에 모양 하나. 칸 안의 점을 뒤집고 돌려 무늬를 짠다. 모양은 뒤집거나 돌린 여덟 가지가 모두 다르다.
  const CELL = 2;
  const MOTIFS = [[[0, 0], [2, 0], [0, 1]], [[0, 0], [2, 0], [2, 1], [0, 2]]];
  const cellAct = (m, p) => { let out = p; for (let i = 0; i < m.times; i += 1) out = m.kind === 'flip' ? G.flip(out, CELL, CELL, m.way) : m.kind === 'turn' ? G.turn(out, CELL, m.q) : out; return out; };
  const cellTurn = (p, q) => G.turn(p, CELL, q), cellSide = (p) => G.flip(p, CELL, CELL, 'side'), cellUpdown = (p) => G.flip(p, CELL, CELL, 'updown');
  const cellImages = (p) => [0, 1, 2, 3].map((q) => cellTurn(p, q)).concat([0, 1, 2, 3].map((q) => cellTurn(cellSide(p), q)));
  if (MOTIFS.some((p) => !distinct(cellImages(p)))) throw new Error('무늬의 모양이 뒤집거나 돌려도 같아진다');
  const motif = (d) => d.pick(cellImages(d.pick(MOTIFS)));
  // 첫 모양에서 시작해 같은 이동을 되풀이한 한 줄
  const rowBy = (base, m, count) => { const out = [base]; while (out.length < count) out.push(cellAct(m, out[out.length - 1])); return out; };
  const sameRow = (a, b) => a.length === b.length && a.every((p, i) => G.samePoints(p, b[i]));
  const sameGrid = (a, b) => a.length === b.length && a.every((row, i) => sameRow(row, b[i]));
  // 무늬 그림. cells: 줄마다 칸의 모양(점들). 빈 값인 칸은 비워 두고 ? 를 적는다.
  function patternBoard(cells, scale, label) {
    const rows = cells.length, cols = cells[0].length, w = cols * CELL, h = rows * CELL;
    const parts = [G.polygon([[0, 0], [w, 0], [w, h], [0, h]]).replace('class="mb-poly"', 'class="mb-poly" style="fill:#fff;stroke:none"')];
    cells.forEach((row, r) => row.forEach((p, c) => {
      if (p) parts.push(G.polygon(shifted(p, c * CELL, r * CELL)).replace('class="mb-poly"', 'class="mb-poly" style="fill:#7dd3fc;stroke:#38bdf8;stroke-width:0.8"'));
      else parts.push(G.text([c * CELL + 1, r * CELL + 1], '?'));
    }));
    for (let c = 0; c <= cols; c += 1) parts.push(G.line([c * CELL, 0], [c * CELL, h]).replace('class="mb-line"', 'class="mb-line" style="stroke:#1e293b;stroke-width:1.5"'));
    for (let r = 0; r <= rows; r += 1) parts.push(G.line([0, r * CELL], [w, r * CELL]).replace('class="mb-line"', 'class="mb-line" style="stroke:#1e293b;stroke-width:1.5"'));
    return G.board(w, h, parts, { grid: false, scale: scale || 1, label: label || '모양을 늘어놓아 만든 무늬' });
  }
  const cellTiles = (list) => G.tiles(list.map((p, i) => [TAGS[i], patternBoard([[p]], 1.1, '무늬에 쓰는 모양')]));
  // 한 줄 무늬를 만든 방법: 'slide'(밀기), 'flip'(뒤집기), 'turn'(돌리기). 어느 것도 아니면 빈 값
  function ruleOf(row) {
    const base = row[0], by = (m) => sameRow(rowBy(base, m, row.length), row);
    if (by(slide('오른쪽'))) return 'slide';
    if (by(flip('오른쪽')) || by(flip('아래쪽'))) return 'flip';
    if ([1, 2, 3].some((q) => by(turnBy(true, q * 90)))) return 'turn';
    return null;
  }
  const RULE_NAME = { slide: '밀기', flip: '뒤집기', turn: '돌리기' };

  // ── 뒤집고 돌리기, 움직인 방법 ───────────────────────────────
  B.addTypes('4-2-6', 'mix', [
    T('mix-flip-turn', '뒤집고 돌린 도형, 돌리고 뒤집은 도형', '①57·58 심48', (d, n) => {
      // 오답: 한 가지만 한 것 둘, 차례를 바꾸어 한 것(90° 돌리기는 차례를 바꾸면 결과가 달라진다)
      const f = anyFlip(d), t = turnBy(d.bool(), d.pick([90, 270])), moves = n === 0 ? [f, t] : [t, f], start = lopsided(d);
      return movedItem(d, `도형을 ${say(moves[0], 3)} ${say(moves[1], 2)}의 도형은?`, '처음 도형', start, run(moves, start), [act(f, start), act(t, start), run([moves[1], moves[0]], start)], {
        moves, explain: `차례대로 움직인다. 먼저 ${say(moves[0], 1)} 도형을 떠올리고, 그 도형을 다시 ${say(moves[1], 5)} 된다. 차례를 바꾸어 움직이면 다른 도형이 된다.`
      });
    }, { count: 2 }),
    T('mix-how', '한 번 움직인 방법', '①59·60 ②58 ③61 심51·52', (d) => {
      // 보기 넷은 움직인 결과가 서로 다르다(여덟 가지가 모두 다른 도형이라서).
      const start = lopsided(d), pool = d.shuffle([anyFlip(d, 'side'), anyFlip(d, 'updown'), anyTurn(d, 1), anyTurn(d, 3), anyTurn(d, 2)]), real = pool[0], result = act(real, start);
      const rows4 = [real, pool[1], pool[2], d.bool() ? slide(d.pick(DIRS)) : pool[3]].map((m) => [say(m, 0), G.samePoints(act(m, start), result)]);
      return truthItem(d, '처음 도형을 한 번 움직였더니 움직인 도형이 되었다. 움직인 방법으로 옳은 것은?', rows4, true, {
        figure: pair(start, result),
        explain: real.kind === 'flip' ? `움직인 도형은 처음 도형의 ${SWAPPED[real.way]}이 서로 바뀐 모양이다. ${say(real, 1)} 것이다.` : `처음 도형의 위쪽 부분이 ${topGoes(real.q)}으로 갔다. ${say(real, 1)} 것이다.`,
        facts: { moved: { size: S, shown: start, steps: steps([real]), back: false, options: [result] } }
      });
    }),
    T('mix-keep-all', '어떻게 움직여도 처음과 같은 도형', '①62 ②56 심45', (d) => {
      // 돌리면 같지만 뒤집으면 다른 도형(바람개비), 뒤집으면 같지만 90° 돌리면 다른 도형을 섞는다.
      const picks = d.shuffle([from(d, 'all'), from(d, 'wheel'), from(d, 'both'), from(d, d.pick(['half', 'wide', 'tall']))]);
      const hits = picks.map((p) => sym(p).side && sym(p).updown && sym(p).quarter), at = hits.indexOf(true);
      return C('밀기, 뒤집기, 돌리기 가운데 어느 것을 하여도 항상 처음 도형과 같은 것은?', TAGS.slice(0, 4), at, {
        figure: choices(picks),
        explain: `${TAGS[at]} 도형은 어느 쪽으로 뒤집어도, 90°씩 돌려도 처음과 같다. 뒤집었을 때만 같거나 돌렸을 때만 같은 도형은 답이 아니다.`,
        facts: { kindPick: { kinds: hits.map((hit, i) => (hit ? 'hit' : 'no' + i)), target: 'hit' }, kept: { size: S, shapes: picks, steps: ['side'], also: ['updown', 1] } }
      });
    }),
    T('mix-cannot', '어떻게 움직여도 나올 수 없는 도형', '②57', (d) => {
      // 밀고 뒤집고 돌려도 모양과 크기는 변하지 않는다. 뒤집고 돌린 도형 셋에 생김새가 비슷한 다른 도형 하나를 섞는다.
      const [base, alike] = d.pick([[LOPSIDED[3], LOPSIDED[4]], [LOPSIDED[4], LOPSIDED[3]], [LOPSIDED[5], LOPSIDED[7]], [LOPSIDED[7], LOPSIDED[5]], [LOPSIDED[0], EVEN[10]]]);
      const start = d.pick(images(base)), list = d.shuffle([turn(start, d.pick([1, 3])), d.bool() ? side(start) : updown(start), turn(side(start), d.pick([1, 3])), d.pick(images(alike))]);
      const hits = list.map((p) => !images(start).some((q) => G.samePoints(p, q))), at = hits.indexOf(true);
      if (!distinct(list)) throw new Error('보기 도형이 서로 겹친다');
      return C('처음 도형을 밀거나 뒤집거나 돌려서 나올 수 없는 도형은?', TAGS.slice(0, 4), at, {
        figure: shown('처음 도형', start) + choices(list),
        explain: `도형을 밀거나 뒤집거나 돌려도 모양과 크기는 변하지 않는다. ${TAGS[at]} 도형은 처음 도형과 모양이 다르다. 나머지는 처음 도형을 돌리거나 뒤집은 도형이다.`,
        facts: { kindPick: { kinds: hits.map((hit, i) => (hit ? 'hit' : 'no' + i)), target: 'hit' }, reach: { size: S, shown: start, ways: [[0], [1], [2], [3], ['side'], ['side', 1], ['side', 2], ['side', 3]], options: list, not: true } }
      });
    }),
    T('mix-same-way', '보기와 같은 방법으로 움직인 도형', '②59', (d) => {
      // 보기에서 움직인 방법을 알아낸 다음 다른 도형에 그대로 쓴다.
      const [a, b] = d.until(() => [lopsided(d), lopsided(d)], ([x, y]) => !images(x).some((p) => G.samePoints(p, y)));
      const pool = d.shuffle([flip('오른쪽'), flip('위쪽'), turnBy(true, 90), turnBy(false, 90), turnBy(true, 180)]), real = pool[0], made = lineup(d, act(real, b), pool.slice(1, 4).map((m) => act(m, b)));
      return C('보기의 도형을 한 번 움직인 방법과 같은 방법으로 새 도형을 움직였을 때의 도형은?', TAGS.slice(0, 4), made.at, {
        figure: pair(a, act(real, a), ['보기: 처음', '보기: 움직인 뒤']) + shown('새 도형', b) + choices(made.list),
        explain: `보기의 도형은 ${real.kind === 'flip' ? `${SWAPPED[real.way]}이 서로 바뀌었으므로 ${say(real, 1)} 것이다` : `위쪽 부분이 ${topGoes(real.q)}으로 갔으므로 ${say(real, 1)} 것이다`}. 새 도형도 같은 방법으로 움직인다. 답은 ${TAGS[made.at]}이다.`,
        facts: { kindPick: { kinds: made.kinds, target: 'hit' }, moved: { size: S, shown: b, steps: steps([real]), back: false, options: made.list }, sample: { shown: a, steps: steps([real]), result: act(real, a) } }
      });
    })
  ]);

  // ── 글자와 수 카드 ───────────────────────────────────────────
  const JAMO_NAMES = Object.keys(JAMO);
  const keeps = (m, name) => sameStrokes(strokeAct(m, JAMO[name], 3, 3), JAMO[name]);
  B.addTypes('4-2-6', 'card', [
    T('letter-move', '글자 카드를 뒤집고 돌린 모양', '①34 ②62 ③33·57', (d) => {
      // 뒤집거나 반 바퀴 돌린 네 모양이 모두 다른 낱자만 쓴다(ㄱ, ㄴ, ㅋ).
      const segs = JAMO[d.pick(['ㄱ', 'ㄴ', 'ㅋ'])], m = d.pick([anyFlip(d, 'side'), anyFlip(d, 'updown'), turnBy(d.bool(), 180)]), want = strokeAct(m, segs, 3, 3);
      const list = d.shuffle([flip('오른쪽'), flip('위쪽'), turnBy(true, 180)].map((x) => strokeAct(x, segs, 3, 3)).concat([segs])), hits = list.map((s) => sameStrokes(s, want));
      if (new Set(list.map(strokeKey)).size !== 4) throw new Error('보기 글자가 서로 겹친다');
      return C(`글자 카드를 ${say(m, 2)}의 모양은?`, TAGS.slice(0, 4), hits.indexOf(true), {
        figure: G.tiles([['처음 카드', jamoCard(segs, 0.95)]]) + G.tiles(list.map((s, i) => [TAGS[i], jamoCard(s)])),
        explain: m.kind === 'flip' ? `${m.word}으로 뒤집으면 글자의 ${SWAPPED[m.way]}이 서로 바뀐다. 답은 ${TAGS[hits.indexOf(true)]}이다.` : `180°만큼 돌리면 글자의 위쪽 부분이 아래쪽으로 가고, 왼쪽 부분이 오른쪽으로 간다. 답은 ${TAGS[hits.indexOf(true)]}이다.`,
        facts: { kindPick: { kinds: hits.map((hit, i) => (hit ? 'hit' : 'no' + i)), target: 'hit' }, strokes: { w: 3, h: 3, shown: segs, steps: steps([m]), options: list } }
      });
    }),
    T('letter-flip-keep', '뒤집어도 처음과 같은 글자', '①33 ②64·65 ③32 심30', (d, n) => {
      if (n === 0) {
        // 한쪽으로 뒤집기. 다른 쪽으로 뒤집어야 같은 글자를 꼭 섞는다(ㅂ은 옆으로, ㄷ은 위아래로).
        const m = anyFlip(d), other = flip(m.way === 'side' ? '위쪽' : '오른쪽');
        const names = d.until(() => d.shuffle(JAMO_NAMES).slice(0, 4), (list) => { const k = list.filter((name) => keeps(m, name)).length; return k >= 1 && k <= 3 && list.some((name) => !keeps(m, name) && keeps(other, name)); });
        const flags = names.map((name) => keeps(m, name)), labels = TAGS.slice(0, 4), made = setOptions(d, labels, flags);
        return C(`글자 카드를 ${say(m, 2)} 처음과 같은 글자를 모두 고른 것은?`, made.options, made.answer, {
          figure: G.tiles(names.map((name, i) => [TAGS[i], jamoCard(JAMO[name])])),
          explain: `${m.word}으로 뒤집으면 ${SWAPPED[m.way]}이 서로 바뀐다. ${SWAPPED[m.way]}의 모양이 같은 글자는 뒤집어도 처음과 같다. 그런 카드는 ${labels.filter((_, i) => flags[i]).join(', ')}이다.`,
          facts: { sets: { labels, flags, options: made.sets }, strokes: { w: 3, h: 3, shapes: names.map((name) => JAMO[name]), steps: steps([m]) } }
        });
      }
      // 어느 쪽으로 뒤집어도 같은 글자: 왼쪽과 오른쪽도, 위와 아래도 같아야 한다.
      const R = flip('오른쪽'), U = flip('위쪽'), kind = (name) => (keeps(R, name) ? 1 : 0) + (keeps(U, name) ? 2 : 0), of = (k) => d.pick(JAMO_NAMES.filter((name) => kind(name) === k));
      const names = d.shuffle([of(3), of(1), of(2), of(0)]), hits = names.map((name) => kind(name) === 3), at = hits.indexOf(true);
      return C('글자 카드를 왼쪽, 오른쪽, 위쪽, 아래쪽 가운데 어느 쪽으로 뒤집어도 처음과 같은 글자는?', TAGS.slice(0, 4), at, {
        figure: G.tiles(names.map((name, i) => [TAGS[i], jamoCard(JAMO[name])])),
        explain: `왼쪽과 오른쪽의 모양이 같고 위쪽과 아래쪽의 모양도 같은 글자를 찾는다. ${TAGS[at]} 카드만 그렇다.`,
        facts: { kindPick: { kinds: hits.map((hit, i) => (hit ? 'hit' : 'no' + i)), target: 'hit' }, strokes: { w: 3, h: 3, shapes: names.map((name) => JAMO[name]), steps: ['side'], also: ['updown'] } }
      });
    }, { count: 2 }),
    T('letter-turn-keep', '돌려도 처음과 같은 글자', '②66 ③55 심46', (d) => {
      // 뒤집어야 같은 글자(ㅂ, ㄷ)와 가르게 한다.
      const m = turnBy(d.bool(), 180), flipKeep = (name) => keeps(flip('오른쪽'), name) || keeps(flip('위쪽'), name);
      const names = d.until(() => d.shuffle(JAMO_NAMES).slice(0, 4), (list) => { const k = list.filter((name) => keeps(m, name)).length; return k >= 1 && k <= 3 && list.some((name) => !keeps(m, name) && flipKeep(name)); });
      const flags = names.map((name) => keeps(m, name));
      return N(`글자 카드를 ${say(m, 2)} 처음과 같은 글자는 모두 몇 개인가?`, flags.filter(Boolean).length, {
        unit: '개', figure: plainRow(names.map((name) => jamoCard(JAMO[name]))),
        explain: `180°만큼 돌리면 위쪽 부분이 아래쪽으로, 왼쪽 부분이 오른쪽으로 간다. 카드를 하나씩 돌려 보면 처음과 같은 글자는 ${flags.filter(Boolean).length}개이다. 뒤집었을 때 같은 글자가 돌렸을 때도 같은 것은 아니다.`,
        facts: { count: flags, strokes: { w: 3, h: 3, shapes: names.map((name) => JAMO[name]), steps: steps([m]) } }
      });
    }),
    T('letter-how', '글자가 바뀌도록 돌린 각도', '①53 ②63', (d) => {
      // ㅏ·ㅓ·ㅗ·ㅜ는 90°씩 돌리면 서로 바뀌고, ㄱ과 ㄴ은 180° 돌리면 서로 바뀐다.
      const cw = d.bool(), [name, q] = d.pick([['ㅏ', 1], ['ㅏ', 3], ['ㅗ', 1], ['ㅗ', 2], ['ㅜ', 1], ['ㅜ', 3], ['ㅓ', 3], ['ㄱ', 2], ['ㄴ', 2]]);
      const start = JAMO[name], result = strokeAct(turnBy(true, q * 90), start, 3, 3);
      if (!JAMO_NAMES.some((other) => sameStrokes(JAMO[other], result))) throw new Error('돌린 모양이 글자가 아니다');
      const rows3 = [90, 180, 270].map((deg) => [deg + '°', sameStrokes(strokeAct(turnBy(cw, deg), start, 3, 3), result)]), deg = cw ? q * 90 : (4 - q) * 90;
      return truthItem(d, `처음 카드를 ${cw ? '시계 방향' : '시계 반대 방향'}으로 돌렸더니 움직인 카드가 되었다. 몇 도만큼 돌렸는가?`, rows3, true, {
        figure: G.tiles([['처음 카드', jamoCard(start)], ['움직인 카드', jamoCard(result)]]),
        explain: `글자의 위쪽 부분이 ${topGoes(q)}으로 갔다. ${cw ? '시계 방향' : '시계 반대 방향'}으로 ${deg}°만큼 돌린 것이다.`,
        facts: { strokes: { w: 3, h: 3, shown: start, steps: [q], options: [result] } }
      });
    }),
    T('letter-syllable', '뒤집거나 돌리면 다른 글자가 되는 글자', '①53 ②67 ③57', (d) => {
      const half = turnBy(d.bool(), 180), up = anyFlip(d, 'updown');
      const [name, m, to, wrongs] = d.pick([['문', half, '곰', ['굼', '몬', '문']], ['곰', half, '문', ['몬', '굼', '곰']], ['눈', half, '곡', ['국', '논', '눈']], ['곡', half, '눈', ['논', '국', '곡']],
        ['뭄', up, '몸', ['뭄', '믐', '맘']], ['몸', up, '뭄', ['몸', '믐', '멈']], ['돔', up, '묻', ['둠', '몯', '돔']], ['롬', half, '물', ['룸', '몰', '롬']]]);
      if (!sameStrokes(strokeAct(m, syl(name), SYL_W, SYL_H), syl(to))) throw new Error('움직인 글자가 생각과 다르다');
      const list = d.shuffle([to].concat(wrongs));
      return C(`글자 카드를 ${say(m, 2)} 만들어지는 글자는?`, list, list.indexOf(to), {
        figure: sylCard(syl(name), 0.9),
        explain: m.kind === 'flip' ? `${m.word}으로 뒤집으면 위쪽과 아래쪽이 서로 바뀐다. 첫소리와 받침의 자리가 바뀌고 가운데 홀소리도 위아래가 바뀌어 「${to}」이 된다.` : `180°만큼 돌리면 위쪽과 아래쪽, 왼쪽과 오른쪽이 모두 바뀐다. 받침이 돌아서 위로 올라가 첫소리가 되므로 「${to}」이 된다.`,
        facts: { kindPick: { kinds: list.map((word, i) => (word === to ? 'hit' : 'no' + i)), target: 'hit' }, strokes: { w: SYL_W, h: SYL_H, shown: syl(name), steps: steps([m]), options: [syl(to)] } }
      });
    }),
    T('letter-stamp', '도장에 새긴 모양', '①35 ②39·40 ③39 심33·34', (d) => {
      // 도장을 찍으면 왼쪽과 오른쪽이 바뀐다. 오답: 위아래를 바꾼 것, 반 바퀴 돌린 것, 찍힌 모양 그대로
      const printed = syl(d.pick(['곰', '문', '눈', '곡'])), want = strokeAct(flip('오른쪽'), printed, SYL_W, SYL_H);
      const list = d.shuffle([want, strokeAct(flip('위쪽'), printed, SYL_W, SYL_H), strokeAct(turnBy(true, 180), printed, SYL_W, SYL_H), printed]), hits = list.map((s) => sameStrokes(s, want));
      if (new Set(list.map(strokeKey)).size !== 4) throw new Error('보기 글자가 서로 겹친다');
      return C('도장을 찍었더니 종이에 그림과 같은 글자가 찍혔다. 도장에 새겨진 모양은?', TAGS.slice(0, 4), hits.indexOf(true), {
        figure: G.tiles([['종이에 찍힌 글자', sylCard(printed, 0.8)]]) + G.tiles(list.map((s, i) => [TAGS[i], sylCard(s)])),
        explain: `도장을 찍으면 새긴 모양의 왼쪽과 오른쪽이 서로 바뀌어 찍힌다. 찍힌 글자를 왼쪽이나 오른쪽으로 뒤집은 모양이 도장에 새겨져 있다. 답은 ${TAGS[hits.indexOf(true)]}이다.`,
        facts: { kindPick: { kinds: hits.map((hit, i) => (hit ? 'hit' : 'no' + i)), target: 'hit' }, strokes: { w: SYL_W, h: SYL_H, shown: printed, steps: ['side'], options: list } }
      });
    }),
    T('seg-flip', '수 카드를 뒤집은 수', '①36 ②69 심54', (d, n) => {
      // 위·아래로 뒤집으면 2와 5만 바뀐다. 왼쪽·오른쪽으로 뒤집으면 자리의 차례도 거꾸로 된다.
      const m = anyFlip(d, n ? 'side' : 'updown'), text = digitText(d, n ? '01258' : '012358', [2, 3], (t) => /[25]/.test(t) && segMoved(t, m.way) !== t && segMoved(t, m.way) !== t.split('').reverse().join('')), moved = segMoved(text, m.way);
      return N(`수 카드를 ${say(m, 2)} 만들어지는 수는?`, Number(moved), {
        figure: segCard(text),
        explain: n ? `${m.word}으로 뒤집으면 2는 5로, 5는 2로 보이고, 숫자가 놓인 차례도 거꾸로 된다. ${text}의 끝자리부터 차례로 뒤집어 읽으면 ${moved}이다.` : `${m.word}으로 뒤집으면 숫자의 위쪽과 아래쪽이 바뀌어 2는 5로, 5는 2로 보인다. 숫자가 놓인 차례는 그대로이므로 ${moved}이다.`,
        facts: { calc: [[moved, 0]], unseen: [Number(moved)], seg: { from: text, steps: [m.way], to: moved } }
      });
    }, { count: 2 }),
    T('seg-turn', '수 카드를 돌린 수', '①55 ②70 ③58 심54', (d) => {
      const m = turnBy(d.bool(), 180), text = digitText(d, '0125689', [2, 3], (t) => /[69]/.test(t) && segMoved(t, 'half') !== t), moved = segMoved(text, 'half');
      return N(`수 카드를 ${say(m, 2)} 만들어지는 수는?`, Number(moved), {
        figure: segCard(text), explain: `180°만큼 돌리면 6은 9로, 9는 6으로 보이고, 숫자가 놓인 차례도 거꾸로 된다. ${text}의 끝자리부터 차례로 돌려 읽으면 ${moved}이다.`,
        facts: { calc: [[moved, 0]], unseen: [Number(moved)], seg: { from: text, steps: ['half'], to: moved } }
      });
    }),
    T('seg-before', '뒤집기 전의 수', '②74 심34', (d) => {
      // 같은 쪽으로 한 번 더 뒤집으면 처음 수가 된다. 그림은 뒤집은 뒤의 수다.
      const m = anyFlip(d), drawn = digitText(d, m.way === 'side' ? '01258' : '012358', [2, 3], (t) => /[25]/.test(t) && segMoved(t, m.way) !== t), first = segMoved(drawn, m.way);
      return N(`어떤 수 카드를 ${say(m, 4)} 그림과 같은 수가 되었다. 뒤집기 전의 수는?`, Number(first), {
        figure: segCard(drawn), explain: `뒤집은 카드를 같은 쪽으로 한 번 더 뒤집으면 처음 카드가 된다. ${drawn}${m.way === 'side' ? '의 끝자리부터 차례로 뒤집어 읽으면' : '의 숫자를 하나씩 뒤집으면'} ${first}이다.`,
        facts: { calc: [[first, 0]], unseen: [Number(first)], seg: { from: first, steps: [m.way], to: drawn } }
      });
    }),
    T('seg-sum', '움직인 수와 처음 수의 합과 차', '②71·72 ③41·59 심56', (d, n) => {
      const m = n === 0 ? anyFlip(d) : turnBy(d.bool(), 180), axis = segAxis(m);
      const text = digitText(d, axis === 'half' ? '0125689' : axis === 'side' ? '01258' : '012358', [2, 3], (t) => (axis === 'half' ? /[69]/ : /[25]/).test(t) && segMoved(t, axis) !== t), moved = segMoved(text, axis);
      const a = Number(text), b = Number(moved), big = Math.max(a, b), small = Math.min(a, b);
      return N(`수 카드를 ${say(m, 2)} 만들어지는 수와 처음 수의 ${n === 0 ? '합은' : '차는'}?`, n === 0 ? a + b : big - small, {
        figure: segCard(text),
        explain: `${say(m, 5)} ${josa(b, '이/가')} 된다. ${n === 0 ? `${moved} + ${text} = ${a + b}` : `${big} − ${small} = ${big - small}`}`,
        facts: { calc: [[n === 0 ? `${moved}+${text}` : `${big}-${small}`, 0]], unseen: [b], seg: { from: text, steps: [axis], to: moved } }
      });
    }, { count: 2 }),
    T('seg-biggest', '움직였을 때 가장 큰 수가 되는 카드', '②76 심55', (d) => {
      // 지금 가장 큰 수가 움직인 뒤에도 가장 큰 것은 아니다.
      const m = d.bool() ? turnBy(d.bool(), 180) : anyFlip(d, 'updown'), axis = segAxis(m), pool = axis === 'half' ? '125689' : '12358';
      const texts = d.until(() => [0, 1, 2].map(() => digitText(d, pool, [2], () => true)), (list) => {
        const before = list.map(Number), after = list.map((t) => Number(segMoved(t, axis)));
        return new Set(before).size === 3 && new Set(after).size === 3 && before.indexOf(Math.max(...before)) !== after.indexOf(Math.max(...after)) && list.every((t) => segMoved(t, axis) !== t);
      });
      const after = texts.map((t) => segMoved(t, axis)), at = after.map(Number).indexOf(Math.max(...after.map(Number)));
      return C(`수 카드를 각각 ${say(m, 2)} 만들어지는 수가 가장 큰 카드는?`, TAGS.slice(0, 3), at, {
        figure: G.tiles(texts.map((t, i) => [TAGS[i], segCard(t, 0.75)])),
        explain: `움직인 뒤의 수는 ${texts.map((t, i) => `${TAGS[i]} ${after[i]}`).join(', ')}이다. 가장 큰 수는 ${after[at]}이다.`,
        facts: { choose: { exprs: after, rule: 'max' }, unseen: after.map(Number), seg: { cards: texts, steps: [axis], to: after } }
      });
    }),
    T('seg-keep', '움직여도 처음과 같은 숫자', '①33·56 ②77 ③56', (d, n) => {
      // 돌리면 6과 9는 숫자가 되지만 서로 바뀐다. 위로 뒤집으면 2와 5가 서로 바뀐다. 처음과 같은 것만 센다.
      const m = n === 0 ? turnBy(d.bool(), 180) : anyFlip(d, 'updown'), axis = segAxis(m), same = (digit) => G.segMove(G.SEGMENTS[digit], axis) === G.SEGMENTS[digit];
      const digits = d.until(() => d.shuffle(n === 0 ? [0, 2, 3, 4, 5, 6, 7, 8, 9] : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4), (list) => { const k = list.filter(same).length; return k >= 1 && k <= 3 && list.some((digit) => !same(digit) && G.segRead(G.segMove(G.SEGMENTS[digit], axis)) !== null); });
      const flags = digits.map(same);
      return N(`디지털 숫자 카드를 각각 ${say(m, 2)} 처음과 같은 숫자가 되는 카드는 모두 몇 장인가?`, flags.filter(Boolean).length, {
        unit: '장', figure: plainRow(digits.map((digit) => G.segDigits(String(digit), { scale: 0.92, label: '디지털 숫자 카드 한 장' }))),
        explain: n === 0 ? `180°만큼 돌려도 처음과 같은 숫자는 0, 2, 5, 8이다. 6과 9는 돌리면 서로 바뀌므로 처음과 같지 않다. 그러므로 ${flags.filter(Boolean).length}장이다.` : `${m.word}으로 뒤집어도 처음과 같은 숫자는 0, 1, 3, 8이다. 2와 5는 뒤집으면 서로 바뀌므로 처음과 같지 않다. 그러므로 ${flags.filter(Boolean).length}장이다.`,
        facts: { count: flags, seg: { digits, steps: [axis], keep: true } }
      });
    }, { count: 2 }),
    T('seg-valid', '뒤집어도 숫자가 되는 카드', '①33 ②64 ③38', (d) => {
      const m = anyFlip(d, 'side'), valid = (digit) => G.segRead(G.segMove(G.SEGMENTS[digit], m.way)) !== null;
      const digits = d.until(() => d.shuffle([0, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4).sort((x, y) => x - y), (list) => { const k = list.filter(valid).length; return k >= 1 && k <= 3 && list.some((digit) => digit === 2 || digit === 5); });
      const flags = digits.map(valid), labels = digits.map(String), made = setOptions(d, labels, flags);
      return C(`디지털 숫자 카드를 각각 ${say(m, 2)}, 숫자로 읽을 수 있는 카드를 모두 고른 것은?`, made.options, made.answer, {
        figure: plainRow(digits.map((digit) => G.segDigits(String(digit), { scale: 0.92, label: '디지털 숫자 카드 한 장' }))),
        explain: `${m.word}으로 뒤집으면 0과 8은 그대로이고 2는 5로, 5는 2로 보인다. 나머지 숫자는 뒤집으면 숫자가 아닌 모양이 된다.`,
        facts: { sets: { labels, flags, options: made.sets }, seg: { digits, steps: [m.way], valid: true } }
      });
    }),
    T('seg-how', '수 카드를 움직인 방법', '②78 ③38', (d) => {
      // 세 가지 이동 가운데 하나로만 그 수가 되는 카드를 쓴다.
      const ways = [anyFlip(d, 'updown'), anyFlip(d, 'side'), turnBy(d.bool(), 180)], cells = (t, axis) => G.segNumber(t, axis).join('|');
      const made = d.until(() => { const text = digitText(d, '025689', [2], () => true), real = d.pick(ways); return { text, real, target: G.segNumber(text, segAxis(real)) }; },
        (x) => G.segText(x.target) !== null && x.target.join('|') !== cells(x.text) && ways.filter((m) => cells(x.text, segAxis(m)) === x.target.join('|')).length === 1);
      const rows4 = ways.map((m) => [say(m, 0), cells(made.text, segAxis(m)) === made.target.join('|')]).concat([['오른쪽으로 밀기', cells(made.text) === made.target.join('|')]]), after = G.segText(made.target);
      return truthItem(d, '처음 카드를 한 번 움직였더니 움직인 카드가 되었다. 움직인 방법으로 옳은 것은?', rows4, true, {
        figure: G.tiles([['처음 카드', segCard(made.text, 0.9)], ['움직인 카드', G.segDigits(made.target, { scale: 0.9, label: `디지털 숫자로 쓴 수 카드 ${after}` })]]),
        explain: `처음 카드의 숫자를 하나씩 움직여 본다. ${say(made.real, 5)} ${made.real.kind === 'flip' ? '' : '6과 9가 서로 바뀌고 차례가 거꾸로 되어 '}${josa(Number(after), '이/가')} 된다. 다른 방법으로는 이 수가 되지 않는다.`,
        facts: { seg: { from: made.text, steps: [segAxis(made.real)], to: after } }
      });
    }),
    T('seg-fold', '접었다 펼친 종이에 나타난 수', '①39 ②41', (d) => {
      // 접었다 펼치면 접은 선 건너편에 뒤집은 모양이 찍힌다(데칼코마니). 쓴 수 뒤에 오른쪽으로 뒤집은 수가 이어진다.
      const text = digitText(d, '1258', [2], (t) => /[25]/.test(t) && segMoved(t, 'side') !== t), moved = segMoved(text, 'side'), answer = Number(text + moved);
      return N('종이의 왼쪽에 물감으로 수를 쓴 다음, 가운데 점선을 따라 접었다가 펼쳤다. 종이에 나타난 네 자리 수는?', answer, {
        figure: foldPaper(text), explain: `접었다 펼치면 점선의 오른쪽에 왼쪽의 수를 오른쪽으로 뒤집은 모양이 찍힌다. ${josa(Number(text), '을/를')} 오른쪽으로 뒤집으면 ${moved}이므로 종이에는 ${josa(answer, '이/가')} 나타난다.`,
        facts: { calc: [[String(answer), 0]], unseen: [answer], seg: { from: text, steps: ['side'], to: moved, joined: String(answer) } }
      });
    }),
    T('mirror-digital', '거울에 비친 디지털시계', '②40 심34·63', (d) => {
      // 거울에 비치면 왼쪽과 오른쪽이 바뀐다. 숫자가 놓인 차례도 거꾸로 된다.
      const made = d.until(() => { const hour = d.pick([1, 2, 5, 8, 10, 11, 12]), minute = Number(d.pick(['0', '1', '2', '5']) + d.pick(['0', '1', '2', '5', '8'])); return { hour, minute, text: String(hour).padStart(2, '0') + String(minute).padStart(2, '0') }; },
        (x) => x.minute >= 1 && segMoved(x.text, 'side') !== x.text && /[25]/.test(x.text));
      const seen = G.segNumber(made.text, 'side');
      return M('거울에 비친 디지털시계가 그림과 같다. 이 시계가 나타내는 실제 시각은 몇 시 몇 분인가?', [{ answer: made.hour, unit: '시' }, { answer: made.minute, unit: '분' }], {
        figure: segLine(seen.slice(0, 2), ':', seen.slice(2), '거울에 비친 디지털시계'),
        explain: `거울에 비친 모양을 왼쪽이나 오른쪽으로 뒤집으면 실제 모양이 된다. 오른쪽 끝의 숫자부터 차례로 뒤집어 읽으면 ${made.text.slice(0, 2)}:${made.text.slice(2)}이므로 ${made.hour}시 ${made.minute}분이다.`,
        facts: { parts: [[String(made.hour), 0], [String(made.minute), 1]], seg: { from: made.text, steps: ['side'], to: segMoved(made.text, 'side') } }
      });
    }),
    T('mirror-clock', '거울에 비친 바늘 시계', '②40 ③40', (d) => {
      const hour = d.int(1, 10), minute = d.pick([5, 10, 15, 20, 25, 35, 40, 45, 50, 55]), back = 720 - (hour * 60 + minute), seen = [Math.floor(back / 60), back % 60];
      return M('거울에 비친 시계가 그림과 같다. 이 시계가 나타내는 실제 시각은 몇 시 몇 분인가?', [{ answer: hour, unit: '시' }, { answer: minute, unit: '분' }], {
        figure: mirrorClock(hour, minute, seen),
        explain: `거울에 비친 시계를 왼쪽이나 오른쪽으로 뒤집으면 실제 시계가 된다. 실제 시계에서 긴바늘은 ${josa(minute / 5, '을/를')} 가리키고 짧은바늘은 ${josa(hour, '과/와')} ${hour + 1} 사이에 있으므로 ${hour}시 ${minute}분이다.`,
        facts: { clock: [{ expr: `12*60-(${seen[0]}*60+${seen[1]})`, parts: 'hm', at: 0 }], unseen: [12] }
      });
    })
  ]);

  // ── 규칙적인 무늬 ────────────────────────────────────────────
  B.addTypes('4-2-6', 'pattern', [
    T('pattern-how', '무늬를 만든 방법', '①64 ②79 ③65 심64', (d) => {
      const base = motif(d), kind = d.pick(['slide', 'flip', 'turn']), m = kind === 'slide' ? slide('오른쪽') : kind === 'flip' ? flip('오른쪽') : turnBy(d.bool(), 90), row = rowBy(base, m, 4);
      const rows3 = ['slide', 'flip', 'turn'].map((name) => [RULE_NAME[name], ruleOf(row) === name]);
      return truthItem(d, '한 모양을 일정한 규칙에 따라 움직이며 오른쪽으로 늘어놓아 무늬를 만들었다. 모양을 움직인 방법은?', rows3, true, {
        figure: patternBoard([row], 1.15),
        explain: kind === 'slide' ? '모든 칸의 모양이 놓인 방향까지 같다. 모양을 오른쪽으로 밀어 만든 무늬이다.' : kind === 'flip' ? '이웃한 칸의 모양은 왼쪽과 오른쪽이 서로 바뀌어 있다. 모양을 오른쪽으로 뒤집는 것을 되풀이하여 만든 무늬이다.' : `칸마다 모양이 ${way(m)} 돌아가 있다. 모양을 돌리는 것을 되풀이하여 만든 무늬이다.`,
        facts: { pattern: { cell: CELL, rows: [row], steps: steps([m]) } }
      });
    }),
    T('pattern-pick', '정해진 방법으로 만든 무늬', '①65 ②80 ③66 심64', (d) => {
      // 같은 모양으로 만든 세 무늬: 밀기, 뒤집기, 돌리기
      const base = motif(d), rows3 = d.shuffle([rowBy(base, slide('오른쪽'), 4), rowBy(base, flip('오른쪽'), 4), rowBy(base, turnBy(d.bool(), 90), 4)]), kinds = rows3.map(ruleOf), want = d.pick(['slide', 'flip', 'turn']);
      return C(`같은 모양으로 만든 세 무늬 가운데 ${RULE_NAME[want]}를 이용하여 만든 것은?`, TAGS.slice(0, 3), kinds.indexOf(want), {
        figure: G.tiles(rows3.map((row, i) => [TAGS[i], patternBoard([row])])),
        explain: `${kinds.map((kind, i) => `${TAGS[i]}는 ${RULE_NAME[kind]}`).join(', ')}를 이용하여 만든 무늬이다. 밀면 모양이 그대로이고, 뒤집으면 왼쪽과 오른쪽이 바뀌며, 돌리면 모양의 위쪽 부분이 옆이나 아래로 간다.`,
        facts: { kindPick: { kinds, target: want }, pattern: { cell: CELL, rows: rows3 } }
      });
    }),
    T('pattern-rule', '줄을 만들고 줄을 움직여 만든 무늬', '①66 ③68·72 심65·70', (d) => {
      // 한 줄 안의 규칙과 줄끼리의 규칙이 따로 있다. 보기 넷의 무늬는 모두 다르다.
      const base = motif(d), grid = (across, down) => { const row = rowBy(base, across, 4); return [row, row.map((p) => cellAct(down, p))]; };
      const combos = [[flip('오른쪽'), slide('아래쪽')], [flip('오른쪽'), flip('아래쪽')], [slide('오른쪽'), flip('아래쪽')], [slide('오른쪽'), slide('아래쪽')]], real = d.pick(combos.slice(0, 3)), drawn = grid(real[0], real[1]);
      const told = ([across, down]) => `${say(across, 0)}를 되풀이하여 윗줄을 만들고, 윗줄을 ${way(down)} ${down.kind === 'flip' ? '뒤집어' : '밀어'} 아랫줄을 만들었다.`;
      return truthItem(d, '한 모양을 일정한 규칙에 따라 늘어놓아 두 줄짜리 무늬를 만들었다. 무늬를 만든 방법으로 옳은 것은?', combos.map((combo) => [told(combo), sameGrid(grid(combo[0], combo[1]), drawn)]), true, {
        figure: patternBoard(drawn, 1.15),
        explain: `윗줄에서 이웃한 칸끼리 비교하면 ${real[0].kind === 'flip' ? '왼쪽과 오른쪽이 서로 바뀌어 있으므로 오른쪽으로 뒤집기를' : '모양이 똑같으므로 오른쪽으로 밀기를'} 되풀이한 것이다. 윗줄과 아랫줄을 비교하면 ${real[1].kind === 'flip' ? '위쪽과 아래쪽이 서로 바뀌어 있으므로 아래쪽으로 뒤집은 것이다.' : '모양이 똑같으므로 아래쪽으로 민 것이다.'}`,
        facts: { pattern: { cell: CELL, rows: drawn, across: steps([real[0]]), down: steps([real[1]]) } }
      });
    }),
    T('pattern-block', '돌려서 만든 네 칸을 움직여 만든 무늬', '①66 ③69·72 심65·67', (d) => {
      // 네 칸(2×2)을 시계 방향으로 돌아가며 놓고, 그 네 칸을 오른쪽으로 밀거나 뒤집어 이어 붙인다.
      const base = motif(d), block = (q) => { const r = rowBy(base, turnBy(true, q * 90), 4); return [[r[0], r[1]], [r[3], r[2]]]; };
      const joined = (q, flipped) => { const b = block(q), next = flipped ? b.map((row) => row.slice().reverse().map(cellSide)) : b; return b.map((row, i) => row.concat(next[i])); };
      const combos = [[1, false], [1, true], [2, false], [2, true]], real = d.pick(combos), drawn = joined(real[0], real[1]);
      const told = ([q, flipped]) => `시계 방향으로 ${q * 90}°만큼 돌리기를 되풀이하여 네 칸짜리 모양을 만들고, 그 모양을 오른쪽으로 ${flipped ? '뒤집어' : '밀어'} 이어 붙였다.`;
      return truthItem(d, '한 모양을 왼쪽 위 칸부터 시계 방향으로 돌아가며 놓아 네 칸짜리 모양을 만든 다음, 그것을 오른쪽에 이어 붙여 무늬를 만들었다. 무늬를 만든 방법으로 옳은 것은?', combos.map((combo) => [told(combo), sameGrid(joined(combo[0], combo[1]), drawn)]), true, {
        figure: patternBoard(drawn, 1.15, '모양을 가로 4칸, 세로 2칸으로 늘어놓아 만든 무늬. 왼쪽 네 칸은 왼쪽 위 칸에서 시작하여 시계 방향으로 돌아가며 놓았다.'),
        explain: `왼쪽 네 칸을 왼쪽 위부터 시계 방향으로 따라가면 모양이 ${real[0] * 90}°씩 돌아간다. 오른쪽 네 칸은 왼쪽 네 칸${real[1] ? '의 왼쪽과 오른쪽이 서로 바뀐 모양이므로 뒤집은 것이다.' : '과 똑같으므로 민 것이다.'}`,
        facts: { pattern: { cell: CELL, rows: drawn, quarter: real[0], flipped: real[1] } }
      });
    }),
    T('pattern-turn-angle', '무늬를 만들 때 돌린 각도', '①66 ③72 심65', (d) => {
      const base = motif(d), cw = d.bool(), q = d.int(1, 3), row = rowBy(base, turnBy(true, q * 90), 4);
      const rows3 = [90, 180, 270].map((deg) => [deg + '°', sameRow(rowBy(base, turnBy(cw, deg), 4), row)]), deg = cw ? q * 90 : (4 - q) * 90;
      return truthItem(d, `모양을 ${cw ? '시계 방향' : '시계 반대 방향'}으로 같은 각도만큼 돌리는 것을 되풀이하며 오른쪽으로 늘어놓았다. 한 번에 몇 도만큼 돌렸는가?`, rows3, true, {
        figure: patternBoard([row], 1.15), explain: `첫째 칸과 둘째 칸을 비교하면 모양의 위쪽 부분이 ${topGoes(q)}으로 갔다. ${cw ? '시계 방향' : '시계 반대 방향'}으로 ${deg}°만큼 돌린 것이다.`,
        facts: { pattern: { cell: CELL, rows: [row], steps: [q, q, q] } }
      });
    }),
    T('pattern-blank', '무늬의 빈칸에 알맞은 모양', '①67 ②60·83 ③69 심67', (d) => {
      const base = motif(d), turning = d.bool(), m = turning ? turnBy(d.bool(), 90) : flip('오른쪽'), row = rowBy(base, m, 5), k = d.int(2, 4), want = row[k];
      const list = d.shuffle(turning ? [0, 1, 2, 3].map((q) => cellTurn(base, q)) : [base, cellSide(base), cellUpdown(base), cellTurn(base, 2)]), hits = list.map((p) => G.samePoints(p, want));
      return C('한 모양을 일정한 규칙에 따라 움직이며 오른쪽으로 늘어놓았다. ? 표시가 있는 칸에 알맞은 모양은?', TAGS.slice(0, 4), hits.indexOf(true), {
        figure: patternBoard([row.map((p, i) => (i === k ? null : p))], 1, '모양을 한 줄로 늘어놓아 만든 무늬. 한 칸은 비어 있고 물음표가 적혀 있다.') + cellTiles(list),
        explain: turning ? `모양을 ${way(m)} 돌리는 것을 되풀이하였다. 빈칸의 왼쪽 칸에 있는 모양을 같은 방법으로 한 번 더 돌린 모양을 찾는다. 답은 ${TAGS[hits.indexOf(true)]}이다.` : `모양을 오른쪽으로 뒤집는 것을 되풀이하였다. 빈칸의 왼쪽 칸에 있는 모양의 왼쪽과 오른쪽을 서로 바꾼 모양을 찾는다. 답은 ${TAGS[hits.indexOf(true)]}이다.`,
        facts: { kindPick: { kinds: hits.map((hit, i) => (hit ? 'hit' : 'no' + i)), target: 'hit' }, pattern: { cell: CELL, rows: [row], steps: steps([m]), blank: k, options: list } }
      });
    }),
    T('pattern-base', '무늬를 만드는 데 쓴 모양', '①69 ②82 ③70 심68', (d) => {
      // 돌리기만으로 만든 무늬에는 뒤집은 모양이 나오지 않는다. 오답: 뒤집어야 나오는 모양, 다른 모양 둘
      const k = d.int(0, 1), base = d.pick(cellImages(MOTIFS[k])), other = d.pick(cellImages(MOTIFS[1 - k])), row = rowBy(base, turnBy(d.bool(), 90), 4);
      const list = d.shuffle([cellTurn(base, d.int(0, 3)), cellTurn(cellSide(base), d.int(0, 3)), other, cellSide(other)]), hits = list.map((p) => [0, 1, 2, 3].some((q) => G.samePoints(p, cellTurn(base, q))));
      if (!distinct(list)) throw new Error('보기 모양이 서로 겹친다');
      return C('한 모양을 돌리기만 이용하여 늘어놓은 무늬이다. 이 무늬를 만드는 데 쓴 모양은?', TAGS.slice(0, 4), hits.indexOf(true), {
        figure: patternBoard([row], 1.15) + cellTiles(list),
        explain: `${TAGS[hits.indexOf(true)]} 모양을 돌리면 무늬의 네 칸에 있는 모양이 모두 나온다. 나머지 모양은 뒤집어야 나오거나 무늬에 없는 모양이다.`,
        facts: { kindPick: { kinds: hits.map((hit, i) => (hit ? 'hit' : 'no' + i)), target: 'hit' }, pattern: { cell: CELL, rows: [row], options: list, base: true } }
      });
    }),
    T('pattern-cannot', '한 가지 이동만으로는 만들 수 없는 무늬', '②80·81 ③66·67 심66', (d) => {
      // 돌리기만: 뒤집은 모양이 섞인 무늬는 만들 수 없다. 뒤집기만: 90° 돌아간 모양이 섞인 무늬는 만들 수 없다.
      const base = motif(d), only = d.pick(['turn', 'flip']);
      const rows3 = d.shuffle(only === 'turn' ? [rowBy(base, turnBy(d.bool(), 90), 4), rowBy(base, turnBy(true, 180), 4), rowBy(base, anyFlip(d), 4)] : [rowBy(base, flip('오른쪽'), 4), rowBy(base, flip('아래쪽'), 4), rowBy(base, turnBy(d.bool(), 90), 4)]);
      const reach = only === 'turn' ? [0, 1, 2, 3].map((q) => cellTurn(base, q)) : [base, cellSide(base), cellUpdown(base), cellTurn(base, 2)];
      const hits = rows3.map((row) => !row.every((p) => reach.some((r) => G.samePoints(p, r)))), at = hits.indexOf(true);
      return C(`같은 모양으로 만든 세 무늬 가운데 ${RULE_NAME[only]}만 이용해서는 만들 수 없는 것은?`, TAGS.slice(0, 3), at, {
        figure: G.tiles(rows3.map((row, i) => [TAGS[i], patternBoard([row])])),
        explain: only === 'turn' ? `${TAGS[at]} 무늬에는 첫 칸의 모양을 뒤집어야 나오는 모양이 있다. 돌리기만 해서는 뒤집은 모양이 나오지 않는다.` : `${TAGS[at]} 무늬에는 첫 칸의 모양을 90°만큼 돌려야 나오는 모양이 있다. 뒤집기만 해서는 그런 모양이 나오지 않는다.`,
        facts: { kindPick: { kinds: hits.map((hit, i) => (hit ? 'hit' : 'no' + i)), target: 'hit' }, pattern: { cell: CELL, rows: rows3, only } }
      });
    })
  ]);

  // ── 실력 ─────────────────────────────────────────────────────
  B.addGroup('4-2-6', {
    id: 'hard', title: '실력 문제', standard: MOVE,
    types: [
      H('hard-point-undo', '여러 번 이동하기 전의 자리', '8, 기본 ②8', (d) => {
        // 오답: 같은 쪽으로 또 간 점, 마지막 이동만 되돌린 점, 가로 방향만 되돌린 점
        const cols = 9, rows = 7;
        const m = d.until(() => {
          const h = d.pick(['오른쪽', '왼쪽']), v = d.pick(['위쪽', '아래쪽']), end = [d.int(0, cols), d.int(0, rows)];
          const legs = [[v, d.int(1, 2)], [h, d.int(2, 4)], [d.bool() ? v : BACK[v], d.int(1, 2)]], undo = legs.slice().reverse().map(([dir, n]) => [BACK[dir], n]);
          return { legs, end, cands: [go(end, undo), go(end, legs), go(end, [undo[0]]), go(end, [undo[1]])] };
        }, (x) => x.cands.every((p) => inside(p, cols, rows)) && apart(x.cands.concat([x.end])));
        const made = pointChoice(d, m.cands);
        return C(`어떤 점을 ${legsText(m.legs, '칸')} 차례로 이동하였더니 점 ㄴ의 자리에 왔다. 처음 자리에 있는 점은?`, PICKS, made.at, {
          figure: gridBoard(cols, rows, [mark(m.end, 'ㄴ')].concat(made.list.map((p, i) => mark(p, PICKS[i]))), '모눈종이 위의 점 ㄴ과 점 가, 나, 다, 라'),
          explain: `마지막 이동부터 거꾸로, 방향을 반대로 하여 되돌아간다. 점 ㄴ에서 ${legsText(m.legs.slice().reverse().map(([dir, n]) => [BACK[dir], n]), '칸')} 간 곳이 처음 자리이다. 답은 점 ${PICKS[made.at]}이다.`,
          facts: { kindPick: { kinds: made.kinds, target: 'hit' }, walk: { to: m.end, legs: m.legs, options: made.list, back: true } }
        });
      }),
      H('hard-point-between', '따로 이동한 두 점 사이의 이동', '9, 기본 ②3', (d) => {
        // 한 점에서 서로 반대쪽으로 벌어진 두 점. 벌어진 거리를 더해야 한다(빼는 아이가 많다).
        const h = d.pick(['오른쪽', '왼쪽']), v = d.pick(['위쪽', '아래쪽']), [a, b, c, e] = d.until(() => [d.int(2, 7), d.int(2, 8), d.int(2, 7), d.int(2, 8)], (x) => new Set(x).size === 4);
        return M(`한 점에서 ${v}으로 ${a} cm, ${h}으로 ${b} cm 이동한 자리에 점 가를 찍고, 같은 점에서 ${BACK[v]}으로 ${c} cm, ${BACK[h]}으로 ${e} cm 이동한 자리에 점 나를 찍었다. 점 가에서 점 나까지 가려면 ${BACK[v]}과 ${BACK[h]}으로 각각 몇 cm 이동해야 하는가?`,
          [{ label: BACK[v], answer: a + c, unit: 'cm' }, { label: BACK[h], answer: b + e, unit: 'cm' }], {
            explain: `점 가에서 처음 점으로 되돌아오려면 ${BACK[v]}으로 ${a} cm, ${BACK[h]}으로 ${b} cm 가야 하고, 거기서 점 나까지 ${BACK[v]}으로 ${c} cm, ${BACK[h]}으로 ${e} cm 더 가야 한다. ${BACK[v]}으로 ${a} + ${c} = ${a + c}(cm), ${BACK[h]}으로 ${b} + ${e} = ${b + e}(cm)`,
            facts: { calc: [[`${a}+${c}`, 0], [`${b}+${e}`, 1]] }
          });
      }),
      H('hard-shape-talk', '한 도형을 뒤집고 돌린 결과에 대한 설명', '44·50, 기본 ①31·51 ③31·63', (d) => {
        // 보기가 아니라 그림의 도형이 장치다. 어느 쪽이 같은 도형인가에 따라 같은 말의 참·거짓이 뒤바뀐다.
        //  - 왼쪽과 오른쪽만 같은 도형: 위아래로 뒤집은 것과 180° 돌린 것이 같다(보통은 다르다).
        //  - 위와 아래만 같은 도형: 옆으로 뒤집은 것과 180° 돌린 것이 같다.
        //  - 양쪽이 다 같은 도형: 어느 쪽으로 뒤집어도, 180° 돌려도 처음과 같지만 90° 돌리면 다르다.
        //  - 반 바퀴 돌려야 같은 도형: 뒤집으면 처음과 다르지만, 옆으로 뒤집은 것과 위아래로 뒤집은 것은 서로 같다.
        const p = from(d, d.pick(['wide', 'tall', 'both', 'half'])), kind = kindOf(p), sideF = anyFlip(d, 'side'), upF = anyFlip(d, 'updown'), half = turnBy(d.bool(), 180), quarter = turnBy(d.bool(), 90);
        const keeps1 = (m) => [`${say(m, 5)} 처음 도형과 같다.`, G.samePoints(act(m, p), p)], equal = (a, b) => [`${say(a, 1)} 도형과 ${say(b, 1)} 도형은 서로 같다.`, G.samePoints(act(a, p), act(b, p))];
        const pool = d.shuffle([keeps1(sideF), keeps1(upF), keeps1(half), keeps1(quarter), equal(sideF, upF), equal(upF, half), equal(sideF, half)]);
        // 참인 말로는 그 도형에서만 성립하는 「두 가지로 움직인 도형이 서로 같다」를 낸다(양쪽이 다 같은 도형은 거짓인 말 하나: 90° 돌리기).
        const device = { wide: equal(upF, half), tall: equal(sideF, half), half: equal(sideF, upF) }[kind], want = kind !== 'both';
        const rows4 = want ? [device].concat(pool.filter(([, ok]) => !ok).slice(0, 3)) : [keeps1(quarter)].concat(pool.filter(([, ok]) => ok).slice(0, 3));
        const why = {
          wide: '이 도형은 왼쪽과 오른쪽의 모양만 같다. 왼쪽이나 오른쪽으로 뒤집으면 처음과 같다. 180°만큼 돌리면 왼쪽과 오른쪽, 위쪽과 아래쪽이 모두 바뀌는데 왼쪽과 오른쪽은 바뀌어도 그대로이므로, 위쪽이나 아래쪽으로 뒤집은 도형과 같아진다.',
          tall: '이 도형은 위쪽과 아래쪽의 모양만 같다. 위쪽이나 아래쪽으로 뒤집으면 처음과 같다. 180°만큼 돌리면 왼쪽과 오른쪽, 위쪽과 아래쪽이 모두 바뀌는데 위쪽과 아래쪽은 바뀌어도 그대로이므로, 왼쪽이나 오른쪽으로 뒤집은 도형과 같아진다.',
          both: '이 도형은 왼쪽과 오른쪽의 모양이 같고 위쪽과 아래쪽의 모양도 같다. 어느 쪽으로 뒤집어도, 180°만큼 돌려도 처음과 같다. 그러나 90°만큼 돌리면 가로와 세로가 바뀌어 처음과 다르다.',
          half: '이 도형은 뒤집으면 처음과 달라지고, 180°만큼 돌려야 처음과 같다. 왼쪽이나 오른쪽으로 뒤집은 도형을 180°만큼 돌리면 위쪽이나 아래쪽으로 뒤집은 도형이 되는데, 이 도형은 180°만큼 돌려도 그대로이므로 두 도형이 서로 같다.'
        }[kind];
        return truthItem(d, `그림의 도형에 대한 설명으로 ${want ? '옳은' : '옳지 않은'} 것은?`, rows4, want, {
          figure: shown('도형', p), explain: why, facts: { talk: { size: S, shape: p } }
        });
      }),
      H('hard-two-readings', '뒤집기로도 돌리기로도 되는 이동', '50, 기본 ①61', (d) => {
        // 왼쪽과 오른쪽이 같은 도형은 위쪽으로 뒤집은 것과 180° 돌린 것이 같다(위와 아래가 같은 도형은 옆으로 뒤집은 것과 같다).
        const kind = d.pick(['wide', 'tall']), start = from(d, kind), across = kind === 'wide' ? ['위쪽', '아래쪽'] : ['왼쪽', '오른쪽'], along = kind === 'wide' ? ['왼쪽', '오른쪽'] : ['위쪽', '아래쪽'];
        const result = act(flip(across[0]), start), ok = [flip(d.pick(across)), turnBy(d.bool(), 180), turnBy(d.bool(), 90, 2)];
        const no = d.pick([flip(d.pick(across), 2), flip(d.pick(along)), turnBy(d.bool(), 360)]);
        return truthItem(d, '처음 도형을 움직였더니 움직인 도형이 되었다. 움직인 방법을 잘못 말한 것은?', ok.concat([no]).map((m) => [say(m, 0), G.samePoints(act(m, start), result)]), false, {
          figure: pair(start, result),
          explain: `처음 도형은 ${kind === 'wide' ? '왼쪽과 오른쪽' : '위쪽과 아래쪽'}의 모양이 같다. 그래서 ${across[0]}으로 뒤집은 도형과 180°만큼 돌린 도형이 같다. ${no.kind === 'flip' && no.times === 2 ? '같은 쪽으로 2번 뒤집으면' : no.kind === 'flip' ? `${no.word}으로 뒤집으면` : '360°만큼 돌리면'} 처음 도형과 같아지므로 움직인 도형이 되지 않는다.`,
          facts: { moved: { size: S, shown: start, steps: steps([ok[0]]), back: false, options: [result] } }
        });
      }),
      H('hard-equal-moves', '두 가지로 움직인 도형이 서로 같은 도형', '기본 ①51 ③31', (d, n) => {
        // 도형을 섞어 놓은 것이 장치다. 뒤집어도 처음과 같은 도형, 반 바퀴 돌려야 같은 도형, 여덟 가지가 모두 다른 도형 가운데 하나에서만 두 결과가 같다.
        //  0: 옆으로 뒤집은 것 = 위아래로 뒤집은 것 → 반 바퀴 돌려야 처음과 같은 도형에서만
        //  1: 시계 방향 90° = 시계 반대 방향 90° → 반 바퀴 돌려야 처음과 같은 도형에서만
        //  2: 뒤집은 것 = 180° 돌린 것 → 뒤집은 쪽과 다른 쪽이 같은 도형에서만(위로 뒤집었으면 왼쪽과 오른쪽이 같은 도형)
        const f = anyFlip(d), a = n === 0 ? anyFlip(d, 'side') : n === 1 ? turnBy(true, 90) : f, b = n === 0 ? anyFlip(d, 'updown') : n === 1 ? turnBy(false, 90) : turnBy(d.bool(), 180);
        const kinds = n < 2 ? ['half', 'wide', 'tall', d.pick(['lopsided', 'diag'])] : [f.way === 'updown' ? 'wide' : 'tall', f.way === 'updown' ? 'tall' : 'wide', 'half', d.pick(['lopsided', 'diag'])];
        const picks = d.shuffle(kinds.map((kind) => from(d, kind))), hits = picks.map((p) => G.samePoints(act(a, p), act(b, p))), at = hits.indexOf(true);
        return C(`${say(a, 1)} 도형과 ${say(b, 1)} 도형이 서로 같은 것은?`, TAGS.slice(0, 4), at, {
          figure: choices(picks),
          explain: n < 2 ? `도형마다 두 가지로 움직여 비교한다. ${TAGS[at]} 도형은 180°만큼 돌리면 처음과 같아지는 도형이라, ${n === 0 ? '옆으로 뒤집은 것과 위아래로 뒤집은 것' : '시계 방향으로 90°만큼 돌린 것과 시계 반대 방향으로 90°만큼 돌린 것'}이 서로 같다. 뒤집으면 처음과 같아지는 도형에서는 두 결과가 다르다.`
            : `180°만큼 돌리면 왼쪽과 오른쪽, 위쪽과 아래쪽이 모두 바뀐다. ${TAGS[at]} 도형은 ${f.way === 'updown' ? '왼쪽과 오른쪽' : '위쪽과 아래쪽'}의 모양이 같아서 그쪽은 바뀌어도 그대로이므로, ${f.word}으로 뒤집은 도형과 180°만큼 돌린 도형이 같다. 다른 도형에서는 두 결과가 다르다.`,
          facts: { kindPick: { kinds: hits.map((hit, i) => (hit ? 'hit' : 'no' + i)), target: 'hit' }, equal: { size: S, shapes: picks, first: steps([a]), second: steps([b]) } }
        });
      }, { count: 3 }),
      H('hard-many', '여러 번 되풀이한 이동을 한 번으로 줄이기', '24·40·43, 기본 ①25 ②35·44·50', (d, n) => {
        if (n === 0) {
          // 2번 뒤집을 때마다 처음으로 돌아온다. 오답: 횟수가 많으니 달라진다고(또는 처음과 같다고) 여긴 것
          const word = d.pick(['왼쪽', '오른쪽', '위쪽', '아래쪽']), times = d.int(5, 9), m = flip(word, times), start = lopsided(d), one = act(flip(word), start);
          return movedItem(d, `도형을 ${say(m, 2)}의 도형은?`, '처음 도형', start, act(m, start), [times % 2 ? start : one, m.way === 'side' ? updown(start) : side(start), turn(start, 2)], {
            moves: [m], rule: 'many-flips', explain: `같은 쪽으로 2번 뒤집을 때마다 처음 도형과 같아진다. ${times}번은 2번씩 ${Math.floor(times / 2)}번 뒤집고 ${times % 2 ? '한 번 더 뒤집은 것이므로 한 번 뒤집은 도형과 같다.' : '남는 것이 없으므로 처음 도형과 같다.'}`
          });
        }
        const cw = d.bool(), times = d.pick([5, 6, 7, 9, 10, 11]), m = turnBy(cw, 90, times), rest = times % 4;
        if (n === 1) {
          const start = lopsided(d), want = act(m, start);
          return movedItem(d, `도형을 ${say(m, 2)}의 도형은?`, '처음 도형', start, want, rotations(start).filter((p) => !G.samePoints(p, want)), {
            moves: [m], rule: 'many-turns', explain: `90°만큼 4번 돌리면 360°라 처음 도형과 같아진다. ${times}번은 4번씩 ${Math.floor(times / 4)}번 돌리고 ${rest}번 더 돌린 것이므로 같은 방향으로 90°만큼 ${rest}번 돌린 도형과 같다.`
          });
        }
        // 거꾸로: 여러 번 돌린 뒤의 도형에서 처음 도형 찾기. 줄인 다음 반대 방향으로 되돌린다.
        const drawn = lopsided(d), want = turn(drawn, -m.q * times);
        return movedItem(d, `어떤 도형을 ${say(m, 4)} 그림과 같은 도형이 되었다. 돌리기 전의 도형은?`, '돌린 도형', drawn, want, rotations(drawn).filter((p) => !G.samePoints(p, want)), {
          moves: [m], back: true, explain: `90°만큼 4번 돌리면 처음과 같으므로 ${times}번 돌린 것은 ${rest}번 돌린 것과 같다. 그림의 도형을 ${cw ? '시계 반대 방향' : '시계 방향'}으로 90°만큼 ${rest}번 되돌린 도형을 찾는다.`
        });
      }, { count: 3 }),
      H('hard-back-to-start', '여러 번 움직인 뒤 처음과 같아지는 것', '41, 기본 ②55', (d) => {
        // 뒤집기는 짝수 번, 돌리기는 모두 360°의 몇 배가 될 때만 처음과 같다.
        const anyWord = () => d.pick(['왼쪽', '오른쪽', '위쪽', '아래쪽']), back = (moves) => alwaysSame(moves, []);
        const good = d.pick([[flip(anyWord(), d.pick([4, 6, 8]))], [turnBy(d.bool(), 90, 8)], [turnBy(d.bool(), 180, d.pick([2, 4, 6]))], [turnBy(d.bool(), 270, 4)]]);
        const bad = d.shuffle([[flip(anyWord(), d.pick([3, 5, 7]))], [turnBy(d.bool(), 90, d.pick([5, 6, 7]))], [turnBy(d.bool(), 180, d.pick([3, 5]))], [turnBy(d.bool(), 270, d.pick([2, 3]))], [flip(d.pick(['왼쪽', '오른쪽'])), flip(d.pick(['위쪽', '아래쪽']))]]).slice(0, 3);
        const told = (moves) => (moves.length === 1 ? say(moves[0], 0) : `${say(moves[0], 3)} ${say(moves[1], 0)}`);
        return truthItem(d, '도형을 다음과 같이 움직였을 때, 어떤 도형이든 처음 도형과 같아지는 것은?', [good].concat(bad).map((moves) => [told(moves), back(moves)]), true, {
          explain: '같은 쪽으로 2번 뒤집을 때마다 처음 도형과 같아지므로 뒤집기는 짝수 번이어야 한다. 돌리기는 돌린 각도를 모두 더한 것이 360°의 몇 배가 되어야 처음 도형과 같다.'
        });
      }),
      H('hard-turn-times', '같은 각도로 몇 번 돌려야 하는가', '50, 기본 ①47 ②48', (d) => {
        // 270°는 반대 방향 90°로 바꾸어 센다.
        const start = lopsided(d), cw = d.bool(), [deg, times] = d.pick([[90, 2], [90, 3], [270, 2], [270, 3]]), m = turnBy(cw, deg), result = act(turnBy(cw, deg, times), start);
        const least = [1, 2, 3].find((k) => G.samePoints(act(turnBy(cw, deg, k), start), result));
        if (least !== times) throw new Error('가장 적은 횟수가 아니다');
        return N(`처음 도형을 ${say(m, 0)}를 되풀이하여 움직인 도형을 만들려고 한다. 적어도 몇 번 돌려야 하는가?`, times, {
          unit: '번', figure: pair(start, result),
          explain: `${deg === 270 ? `${way(m)} 돌리는 것은 ${cw ? '시계 반대 방향' : '시계 방향'}으로 90°만큼 돌리는 것과 같다. ` : ''}움직인 도형은 처음 도형의 위쪽 부분이 ${topGoes(m.q * times)}으로 간 모양이다. 한 번 돌릴 때마다 위쪽 부분이 간 곳을 따라가면 ${times}번째에 움직인 도형이 된다.`,
          facts: { calc: [[String(times), 0]], unseen: [times], moved: { size: S, shown: start, steps: Array.from({ length: times }, () => m.q), back: false, options: [result] } }
        });
      }),
      H('hard-undo2', '두 번 움직이기 전의 도형', '26, 기본 ①30·49', (d, n) => {
        // 두 이동을 모두 되돌린다. 오답: 한 가지만 되돌린 것 둘, 그림 그대로
        const drawn = lopsided(d);
        if (n === 0) {
          const moves = d.shuffle([anyFlip(d, 'side'), anyFlip(d, 'updown')]);
          return movedItem(d, `어떤 도형을 ${say(moves[0], 3)} ${say(moves[1], 4)} 그림과 같은 도형이 되었다. 처음 도형은?`, '움직인 도형', drawn, turn(drawn, 2), [side(drawn), updown(drawn), drawn], {
            moves, back: true, explain: `뒤집은 도형은 같은 쪽으로 한 번 더 뒤집으면 되돌아간다. 그림의 도형을 ${moves[1].word}으로 뒤집고 다시 ${moves[0].word}으로 뒤집으면 처음 도형이 된다. 왼쪽과 오른쪽, 위쪽과 아래쪽이 모두 바뀐 도형을 찾는다.`
          });
        }
        const moves = d.until(() => [anyTurn(d, d.int(1, 3)), anyTurn(d, d.int(1, 3))], ([a, b]) => norm(a.q + b.q) !== 0 && (a.clockwise !== b.clockwise || a.deg !== b.deg)), total = norm(moves[0].q + moves[1].q), want = turn(drawn, -total);
        return movedItem(d, `어떤 도형을 ${say(moves[0], 3)} ${say(moves[1], 4)} 그림과 같은 도형이 되었다. 처음 도형은?`, '움직인 도형', drawn, want, rotations(drawn).filter((p) => !G.samePoints(p, want)), {
          moves, back: true, explain: `두 번 돌린 것을 한 번으로 줄이면 시계 방향으로 ${total * 90}°만큼 돌린 것과 같다. 그림의 도형을 시계 반대 방향으로 ${total * 90}°만큼 되돌린 도형을 찾는다.`
        });
      }, { count: 2 }),
      H('hard-fix', '잘못 움직인 것 바로잡기', '27, 기본 ②51 ③53', (d, n) => {
        // 잘못 움직인 것을 되돌려 처음 도형을 찾고, 바르게 다시 움직인다. 오답: 되돌리기만 한 것(처음 도형), 그림의 도형을 그대로 바르게 움직인 것, 그림 그대로
        const drawn = lopsided(d);
        if (n === 0) {
          const [right, wrong] = d.shuffle([anyFlip(d, 'side'), anyFlip(d, 'updown')]), first = act(wrong, drawn);
          return movedItem(d, `도형을 ${right.word}으로 뒤집어야 할 것을 잘못하여 ${say(wrong, 4)} 그림과 같은 도형이 되었다. 바르게 뒤집은 도형은?`, '잘못 뒤집은 도형', drawn, act(right, first), [first, act(right, drawn), drawn], {
            moves: [wrong, right], explain: `그림의 도형을 ${wrong.word}으로 한 번 더 뒤집으면 처음 도형이 된다. 그 도형을 ${right.word}으로 뒤집은 도형을 찾는다.`
          });
        }
        const cw = d.bool(), right = turnBy(cw, 90), wrong = turnBy(!cw, 90), first = turn(drawn, -wrong.q), want = act(right, first);
        return movedItem(d, `도형을 ${way(right)} 돌려야 할 것을 잘못하여 ${say(wrong, 4)} 그림과 같은 도형이 되었다. 바르게 돌린 도형은?`, '잘못 돌린 도형', drawn, want, [first, turn(drawn, wrong.q), drawn], {
          moves: [turnBy(cw, 90), right], explain: `그림의 도형을 ${way(right)} 되돌리면 처음 도형이 된다. 그 도형을 다시 ${way(right)} 돌려야 하므로, 그림의 도형을 180°만큼 돌린 도형을 찾는다.`
        });
      }, { count: 2 }),
      H('hard-turn-sum', '단추를 눌러 여러 번 돌린 도형', '40, 기본 ③60', (d) => {
        // 서로 다른 돌리기 세 번을 한 번으로 줄인다. 반대 방향끼리는 덜어 낸다.
        const start = lopsided(d), red = turnBy(d.bool(), d.pick([90, 270])), blue = d.until(() => turnBy(d.bool(), d.pick([90, 180])), (m) => norm(m.q) !== norm(red.q));
        const order = d.pick([['빨간', '파란', '빨간'], ['파란', '빨간', '파란'], ['빨간', '빨간', '파란'], ['파란', '파란', '빨간'], ['빨간', '파란', '파란'], ['파란', '빨간', '빨간']]);
        const moves = order.map((color) => (color === '빨간' ? red : blue)), want = run(moves, start), total = norm(moves.reduce((s, m) => s + m.q, 0)), sum = moves.reduce((s, m) => s + norm(m.q) * 90, 0);
        const made = lineup(d, want, rotations(start).filter((p) => !G.samePoints(p, want)));
        return C(`빨간 단추를 누르면 도형이 ${way(red)} 돌아가고, 파란 단추를 누르면 ${way(blue)} 돌아간다. ${order.map((color) => color + ' 단추').join(', ')}를 차례로 눌렀을 때의 도형은?`, TAGS.slice(0, 4), made.at, {
          figure: shown('처음 도형', start) + choices(made.list),
          explain: `돌린 각도를 모두 시계 방향으로 고쳐 더하면 ${moves.map((m) => norm(m.q) * 90 + '°').join(' + ')} = ${sum}°이다. ${total === 0 ? `360°가 한 바퀴이므로 ${sum}°만큼 돌리면 처음 도형과 같다.` : `${sum > 360 ? `360°가 한 바퀴이므로 ${sum}° − ${Math.floor(sum / 360) * 360}° = ${total * 90}°만큼 돌린 것과 같다. ` : ''}시계 방향으로 ${total * 90}°만큼 돌린 도형을 찾는다.`} 답은 ${TAGS[made.at]}이다.`,
          facts: { kindPick: { kinds: made.kinds, target: 'hit' }, moved: { size: S, shown: start, steps: steps(moves), back: false, options: made.list } }
        });
      }),
      H('hard-mix-one', '이어 한 이동과 같은 한 번의 이동', '25·63, 기본 ①58', (d) => {
        // 뒤집고 반 바퀴 돌리면 다른 쪽으로 한 번 뒤집은 것과 같고, 두 쪽으로 한 번씩 뒤집으면 반 바퀴 돌린 것과 같다. 참·거짓은 도형 감을 모두 움직여 본 결과다.
        const f = anyFlip(d), g = anyFlip(d, f.way === 'side' ? 'updown' : 'side'), half = turnBy(d.bool(), 180), moves = d.pick([[f, half], [half, f], [f, g]]);
        const rows4 = [g, flip(f.word === '왼쪽' ? '오른쪽' : f.word === '오른쪽' ? '왼쪽' : f.word === '위쪽' ? '아래쪽' : '위쪽'), turnBy(d.bool(), 180), turnBy(d.bool(), 90)].map((m) => [`${say(m, 1)} 도형`, alwaysSame(moves, [m])]);
        return truthItem(d, `도형을 ${say(moves[0], 3)} ${say(moves[1], 1)} 도형과 항상 같은 것은?`, rows4, true, {
          explain: moves[1].kind === 'flip' && moves[0].kind === 'flip' ? '왼쪽과 오른쪽이 바뀌고 위쪽과 아래쪽도 바뀐다. 180°만큼 돌린 도형도 왼쪽과 오른쪽, 위쪽과 아래쪽이 모두 바뀌므로 같다.'
            : `180°만큼 돌리면 왼쪽과 오른쪽, 위쪽과 아래쪽이 모두 바뀐다. ${f.word}으로 뒤집으면 ${SWAPPED[f.way]}이 한 번 더 바뀌어 제자리로 오므로, ${SWAPPED[g.way]}만 바뀐 도형이 된다. ${g.word}으로 뒤집은 도형과 같다.`
        });
      }),
      H('hard-mix-how', '뒤집기와 돌리기를 이어 움직인 방법', '49', (d) => {
        // 한 번의 뒤집기나 돌리기로는 나오지 않는 도형. 오답: 차례를 바꾼 것, 돌리기만 한 것, 뒤집기만 한 것
        const start = lopsided(d), f = anyFlip(d), t = turnBy(d.bool(), 90), real = d.shuffle([f, t]), result = run(real, start);
        const told = (moves) => (moves.length === 1 ? say(moves[0], 0) : `${say(moves[0], 3)} ${say(moves[1], 0)}`);
        return truthItem(d, '처음 도형을 두 번 움직였더니 움직인 도형이 되었다. 움직인 방법으로 옳은 것은?', [real, [real[1], real[0]], [turnBy(t.clockwise, 90, 2)], [flip(f.word, 2)]].map((moves) => [told(moves), G.samePoints(run(moves, start), result)]), true, {
          figure: pair(start, result),
          explain: `보기의 방법대로 처음 도형을 차례로 움직여 본다. ${say(real[0], 3)} ${say(real[1], 5)} 움직인 도형이 된다. 차례를 바꾸면 다른 도형이 된다.`,
          facts: { moved: { size: S, shown: start, steps: steps(real), back: false, options: [result] } }
        });
      }),
      H('hard-nth', '되풀이되는 모양의 몇 번째', '69', (d) => {
        // 90°씩 돌리면 네 칸마다, 180°씩 돌리면 두 칸마다 같은 모양이 되풀이된다.
        const base = motif(d), m = d.pick([turnBy(true, 90), turnBy(false, 90), turnBy(d.bool(), 180)]), row = rowBy(base, m, 4), at = d.pick([10, 11, 14, 15, 18, 19]), period = m.deg === 180 ? 2 : 4;
        const want = rowBy(base, m, at)[at - 1], list = d.shuffle([0, 1, 2, 3].map((q) => cellTurn(base, q))), hits = list.map((p) => G.samePoints(p, want));
        return C(`한 모양을 일정한 규칙에 따라 돌리며 왼쪽부터 차례로 늘어놓았다. 같은 규칙으로 계속 늘어놓을 때, ${at}번째에 놓이는 모양은?`, TAGS.slice(0, 4), hits.indexOf(true), {
          figure: patternBoard([row], 1.15, '모양을 한 줄로 4칸 늘어놓은 무늬') + cellTiles(list),
          explain: `모양을 ${way(m)} 돌리는 것을 되풀이하므로 ${period}칸마다 같은 모양이 나온다. ${at} ÷ ${period}의 나머지가 ${at % period}이므로 ${at}번째 모양은 ${at % period === 0 ? period : at % period}번째 모양과 같다. 답은 ${TAGS[hits.indexOf(true)]}이다.`,
          facts: { kindPick: { kinds: hits.map((hit, i) => (hit ? 'hit' : 'no' + i)), target: 'hit' }, pattern: { cell: CELL, rows: [row], steps: steps([m]), nth: at, options: list } }
        });
      }, { standard: PATTERN }),
      H('hard-letter-reduce', '돌리고 뒤집어도 처음과 같은 글자', '53', (d) => {
        // 180° 돌리고 위로 뒤집으면 옆으로 한 번 뒤집은 것과 같다. 한 가지씩 따로 보면 틀린다.
        const moves = d.shuffle([turnBy(d.bool(), 180), anyFlip(d)]), keep = (name) => sameStrokes(strokeRun(moves, JAMO[name], 3, 3), JAMO[name]), alone = (name) => keeps(moves[0], name) && keeps(moves[1], name);
        const names = d.until(() => d.shuffle(JAMO_NAMES).slice(0, 4), (list) => { const k = list.filter(keep).length; return k >= 1 && k <= 3 && list.some((name) => keep(name) !== alone(name)); });
        const flags = names.map(keep), net = moves.find((m) => m.kind === 'flip').way === 'side' ? 'updown' : 'side';
        return N(`글자 카드를 ${say(moves[0], 3)} ${say(moves[1], 2)} 처음과 같은 글자는 모두 몇 개인가?`, flags.filter(Boolean).length, {
          unit: '개', figure: plainRow(names.map((name) => jamoCard(JAMO[name]))),
          explain: `180°만큼 돌리면 왼쪽과 오른쪽, 위쪽과 아래쪽이 모두 바뀐다. 여기에 한 번 뒤집으면 한쪽은 제자리로 오므로, 두 번 움직인 것은 ${net === 'side' ? '왼쪽이나 오른쪽' : '위쪽이나 아래쪽'}으로 한 번 뒤집은 것과 같다. ${SWAPPED[net]}의 모양이 같은 글자는 ${flags.filter(Boolean).length}개이다.`,
          facts: { count: flags, strokes: { w: 3, h: 3, shapes: names.map((name) => JAMO[name]), steps: steps(moves) } }
        });
      }),
      H('hard-syllable-how', '글자가 바뀌도록 뒤집는 방법', '32, 기본 ①40 ③38', (d) => {
        // 위아래도 좌우도 바뀌었으니 두 쪽으로 한 번씩 뒤집어야 한다. 오답: 한 쪽으로만 뒤집은 것, 같은 쪽으로 2번 뒤집은 것(처음과 같다), 2번 뒤집기를 섞어 한쪽만 바뀐 것
        const [name, to] = d.pick([['문', '곰'], ['곰', '문'], ['눈', '곡'], ['곡', '눈'], ['롬', '물']]), start = syl(name), target = syl(to);
        const s = () => d.pick(['왼쪽', '오른쪽']), u = () => d.pick(['위쪽', '아래쪽']), told = (moves) => (moves.length === 1 ? say(moves[0], 0) : `${say(moves[0], 3)} ${say(moves[1], 0)}`);
        const rows4 = [d.shuffle([flip(s()), flip(u())]), [flip(u())], [flip(s(), 2)], [flip(u(), 2), flip(s())]].map((moves) => [told(moves), sameStrokes(strokeRun(moves, start, SYL_W, SYL_H), target)]);
        return truthItem(d, '처음 카드를 뒤집어 움직인 카드를 만들려고 한다. 뒤집는 방법으로 옳은 것은?', rows4, true, {
          figure: G.tiles([['처음 카드', sylCard(start, 0.8)], ['움직인 카드', sylCard(target, 0.8)]]),
          explain: '움직인 카드는 처음 카드의 위쪽과 아래쪽이 바뀌었고 왼쪽과 오른쪽도 바뀌었다. 위쪽이나 아래쪽으로 한 번, 왼쪽이나 오른쪽으로 한 번 뒤집어야 한다. 같은 쪽으로 2번 뒤집으면 처음과 같아진다.',
          facts: { strokes: { w: SYL_W, h: SYL_H, shown: start, steps: ['side', 'updown'], options: [target] } }
        });
      }),
      H('hard-seg-two', '두 가지로 움직인 수의 합과 차', '57, 기본 ①37 ②73', (d) => {
        // 둘째 이동도 처음 수에 한다(이어 하지 않는다). 옆으로 뒤집기와 반 바퀴 돌리기는 자리의 차례가 거꾸로 된다.
        const [a, b] = d.shuffle([anyFlip(d, 'side'), anyFlip(d, 'updown'), turnBy(d.bool(), 180)]).slice(0, 2), plus = d.bool();
        const text = digitText(d, '1258', [2, 3], (t) => /[25]/.test(t) && segMoved(t, segAxis(a)) !== segMoved(t, segAxis(b)) && t !== t.split('').reverse().join(''));
        const x = segMoved(text, segAxis(a)), y = segMoved(text, segAxis(b)), big = Math.max(Number(x), Number(y)), small = Math.min(Number(x), Number(y));
        return N(`수 카드를 ${say(a, 2)} 만들어지는 수와 ${say(b, 2)} 만들어지는 수의 ${plus ? '합은' : '차는'}?`, plus ? big + small : big - small, {
          figure: segCard(text),
          explain: `처음 수 ${text}에서 두 수를 따로 만든다. ${say(a, 5)} ${x}, ${say(b, 5)} ${y}이다. ${plus ? `${x} + ${y} = ${big + small}` : `${big} − ${small} = ${big - small}`}`,
          facts: { calc: [[plus ? `${x}+${y}` : `${big}-${small}`, 0]], unseen: [Number(x), Number(y)], seg: { from: text, steps: [segAxis(a)], to: x, second: { steps: [segAxis(b)], to: y } } }
        });
      }),
      H('hard-seg-chain', '두 번 이어 뒤집은 수', '54·63', (d) => {
        // 옆으로 뒤집고 위로 뒤집으면 2와 5는 두 번 바뀌어 제자리로 오고, 자리의 차례만 거꾸로 된다.
        const moves = d.shuffle([anyFlip(d, 'side'), anyFlip(d, 'updown')]), text = digitText(d, '01258', [3], (t) => /[25]/.test(t) && t !== t.split('').reverse().join(''));
        const mid = segMoved(text, moves[0].way), last = segMoved(mid, moves[1].way);
        if (last !== segMoved(text, 'half')) throw new Error('두 번 뒤집은 수가 반 바퀴 돌린 수와 다르다');
        return N(`수 카드를 ${say(moves[0], 3)} ${say(moves[1], 2)} 만들어지는 수는?`, Number(last), {
          figure: segCard(text),
          explain: `${say(moves[0], 5)} ${josa(Number(mid), '이/가')} 되고, 이것을 다시 ${say(moves[1], 5)} ${josa(Number(last), '이/가')} 된다. 2와 5는 두 번 바뀌어 제자리로 오고, 숫자가 놓인 차례만 거꾸로 된다.`,
          facts: { calc: [[last, 0]], unseen: [Number(last)], seg: { from: text, steps: moves.map((m) => m.way), to: last } }
        });
      }),
      H('hard-seg-undo', '뒤집힌 수에서 처음 수를 찾아 돌리기', '60, 기본 ②74', (d) => {
        // 투명 종이를 뒤집어 본 모양이라 숫자가 아닌 모양이 섞여 있다. 처음 수를 찾은 다음 그 수를 돌린다.
        const f = anyFlip(d, 'side'), t = turnBy(d.bool(), 180), text = digitText(d, '0125689', [2, 3], (x) => /[69]/.test(x) && segMoved(x, 'half') !== x), moved = segMoved(text, 'half');
        return N(`투명 종이에 디지털 숫자로 수를 쓴 다음 종이를 ${say(f, 4)} 그림과 같이 보였다. 처음에 쓴 수를 ${say(t, 2)} 만들어지는 수는?`, Number(moved), {
          figure: G.segDigits(G.segNumber(text, 'side'), { scale: 1.2, label: '투명 종이를 뒤집어 본 디지털 숫자' }),
          explain: `그림을 ${f.word}으로 한 번 더 뒤집으면 처음에 쓴 수 ${josa(Number(text), '이/가')} 된다. ${josa(Number(text), '을/를')} 180°만큼 돌리면 6과 9가 서로 바뀌고 차례가 거꾸로 되어 ${josa(Number(moved), '이/가')} 된다.`,
          facts: { calc: [[moved, 0]], unseen: [Number(moved)], seg: { from: text, steps: ['half'], to: moved, shownBy: ['side'] } }
        });
      }),
      H('hard-seg-make', '수 카드로 만든 수를 돌린 수와의 차', '58, 기본 ②75', (d) => {
        const t = turnBy(d.bool(), 180), biggest = d.bool();
        const digits = d.until(() => d.shuffle('125689'.split('')).slice(0, 3), (list) => { const made = list.slice().sort().join(''), text = biggest ? made.split('').reverse().join('') : made; return /[69]/.test(text) && segMoved(text, 'half') !== text; });
        const sorted = digits.slice().sort(), text = (biggest ? sorted.slice().reverse() : sorted).join(''), moved = segMoved(text, 'half'), big = Math.max(Number(text), Number(moved)), small = Math.min(Number(text), Number(moved));
        return N(`디지털 숫자 카드 3장을 한 번씩 모두 사용하여 가장 ${biggest ? '큰' : '작은'} 세 자리 수를 만들었다. 만든 수를 ${say(t, 2)} 만들어지는 수와 만든 수의 차는?`, big - small, {
          figure: plainRow(digits.map((digit) => G.segDigits(digit, { scale: 0.92, label: `디지털 숫자 카드 ${digit}` }))),
          explain: `가장 ${biggest ? '큰' : '작은'} 수는 ${biggest ? '큰' : '작은'} 숫자부터 차례로 놓은 ${text}이다. 180°만큼 돌리면 6과 9가 서로 바뀌고 차례가 거꾸로 되어 ${josa(Number(moved), '이/가')} 된다. ${big} − ${small} = ${big - small}`,
          facts: { calc: [[`${big}-${small}`, 0]], unseen: [big, small], seg: { from: text, steps: ['half'], to: moved, cards: digits.map(Number), biggest } }
        });
      }),
      H('hard-seg-addition', '뒤집힌 덧셈식', '61', (d) => {
        // 뒤집힌 식을 그대로 더하면 틀린다. 숫자를 하나씩 되뒤집어 처음 식을 찾는다.
        const f = anyFlip(d, 'updown'), [a, b] = d.until(() => [digitText(d, '012358', [2, 3], (t) => /[25]/.test(t)), digitText(d, '012358', [2, 3], (t) => /[25]/.test(t))], ([x, y]) => x.length === y.length && x !== y && Number(x) + Number(y) !== Number(segMoved(x, 'updown')) + Number(segMoved(y, 'updown')));
        const sa = segMoved(a, 'updown'), sb = segMoved(b, 'updown'), sum = Number(a) + Number(b);
        return N(`덧셈식이 적힌 카드를 ${say(f, 4)} 그림과 같이 보였다. 뒤집기 전의 덧셈식을 계산한 값은?`, sum, {
          figure: segLine(sa, '+', sb, `뒤집힌 카드에 보이는 덧셈식 ${sa} + ${sb}`, a.length === 3 ? 0.85 : 1),
          explain: `${f.word}으로 뒤집으면 2와 5가 서로 바뀌고 숫자가 놓인 차례는 그대로이다. 그림의 숫자를 하나씩 되뒤집으면 처음 식은 ${a} + ${b}이므로 ${sum}이다.`,
          facts: { calc: [[`${a}+${b}`, 0]], unseen: [Number(a), Number(b)], seg: { from: a, steps: ['updown'], to: sa, second: { from: b, steps: ['updown'], to: sb } } }
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
