// 5학년 2학기 3단원 합동과 대칭 — 단원 틀, 판정·그림 도구, 기본 문항(도형의 합동, 합동인 도형의 성질, 선대칭도형과 대칭축).
// 수집해 둔 교과서 9종의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1~3: 86·75·72꼴, 심화꼴 66꼴)을 번호마다 따져,
// 꼴마다 ① 몇 학년 무슨 단원 내용인가 ② 어느 영역의 일을 시키는가를 보고 실었다.
// (선대칭도형의 성질과 그리기, 점대칭도형, 선대칭과 점대칭 함께는 5-2-3b.js, 실력 문항은 5-2-3c.js. 대조표는 수집본의 _분석/5-2-3/싣기_대조표.md)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2, ③n = 기본꼴_3, 심n = 심화꼴.
//
// 영역: 도형과 측정 가운데 도형.
//   6수03-01 도형의 합동을 이해하고, 합동인 도형의 성질을 탐구하고 설명할 수 있다.
//   6수03-02 실생활과 연결하여 선대칭도형과 점대칭도형을 이해하고 그릴 수 있다.
//
// 싣는 기준
//  - 뜻(완전히 겹친다), 합동인 도형 찾기, 대응점·대응변·대응각 찾기, 선대칭도형·점대칭도형 가리기, 대칭축과 대칭의 중심 찾기·세기,
//    대칭축·대칭의 중심과 대응점의 관계, 완성한 도형 고르기, 글자·숫자·무늬의 대칭을 싣는다.
//  - 길이와 각도는 성질을 한 번 바로 대는 데까지만 싣는다: 대응변의 길이, 대응각의 크기, 대칭축(대칭의 중심)까지의 거리,
//    대응변을 옮겨 둘레를 한 번 구하기, 대응각을 옮긴 뒤 세 각의 합(네 각의 합)을 한 번 쓰기.
//  - 그리기(작도)는 고르기로 바꾼다: 완성한 도형 고르기, 대응점의 자리 고르기, 나머지 꼭짓점의 자리 고르기.
//  - 그림은 좌표로 만든다. 합동인 도형은 한 도형을 돌리거나 뒤집어 만들고, 합동이 아닌 도형은 모눈 한 칸이 넘게 다르게 그린다.
//    합동·선대칭·점대칭인지는 손으로 적지 않고 좌표로 판정한 값(congruent, axesOf, isHalfTurn)을 쓴다.
//    대칭이 아닌 도형은 「거의 대칭」으로 보이지 않는 것만 쓴다(looksFoldable, looksTurnable 로 걸러 낸다).
//    모눈 위의 도형을 세거나 고르는 문항은 그림의 좌표를 facts.again 에도 넘겨, 다른 길(여덟 가지로 옮겨 겹쳐 보기, 점을 촘촘히 찍어 접어 보기)로 다시 따질 수 있게 했다.
//  - 길이나 각도를 적은 그림은 적힌 수대로 그린다. 길이 글은 선분 옆(도형 밖)에 적고, 그림 속 수는 aria-label 에도 적는다.
//  - 글자와 숫자는 글꼴에 따라 답이 갈리지 않게 선분으로 그린 글자 카드와 디지털 숫자만 쓴다. 대칭인지 가르는 문항에는 숫자 1을 쓰지 않는다(획이 한 줄이라 보는 눈에 따라 답이 갈린다).
//
// 뺀 것과 까닭(이 파일의 세 묶음)
//  - 각도를 이어 셈하는 것(①28·29·30 ②23·24 ③71·72 심49~53): 한 직선 위에 맞닿은 두 합동 삼각형의 사이 각, 합동인 이등변삼각형의 밑각,
//    겹쳐 놓거나 이어 붙인 합동 삼각형의 각, 접은 종이의 각 — 측정(각도)의 셈이고 중학교 「삼각형의 성질」 꼴이다. 직선 위의 각 180°를 쓰는 것은 한 번이어도 싣지 않았다.
//  - 선이 여럿 그어진 그림에서 크고 작은 합동인 도형 세기(①12 ②12): 경우 따지기
//  - 넓이가 일의 대부분인 것(①24의 사다리꼴 넓이, ②20·③20의 직각삼각형 넓이, ②21 넓이에서 거꾸로 한 변): 넓이 셈(5-1-6). 대응변을 한 번 옮기는 직사각형의 넓이 하나만 실었다.
//  - 합동인 정다각형을 이어 붙인 모양의 둘레(③21): 겉에 드러난 변 세기 — 5-1-6 「정다각형 2개를 이어 붙인 도형의 둘레」와 같은 일
//  - 그리기·나누기·만들기(①10·11 ②8·9 ③9 심61·62)는 고르기로 바꾸어 실었고, 까닭 쓰기(①6 ②11 ③7)는 설명 고르기로 바꾸어 실었다.
//  - 두 변의 길이의 합(①19의 변형), 두 도형의 대칭축 수의 합(①37의 변형): 뜻 없는 셈
//  - 단어 속 선대칭 글자 수 견주기(①34): 세기를 두 번 하는 것뿐이다. 붙여 만든 도형을 두고 한 말(③31): 그림과 말이 수집본에 없다. 정육각형에 대한 ○×(②36)의 「한 대각선을 따라 접으면」: 어느 대각선인지 모호하다(대칭축의 수는 실었다).
// 낱말: 「서로 합동」「대응점·대응변·대응각」「대칭축」「대칭의 중심」. 길이는 띄어 쓰고(7 cm) 각도는 붙여 쓴다(65°).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { N, M, C } = B.kit;
  const G = B.kit.geo;
  const CONG = '6수03-01', SYM = '6수03-02';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const TAGS = ['가', '나', '다', '라', '마', '바', '사', '아'], MARKS = ['㉠', '㉡', '㉢', '㉣', '㉤'];
  const JA = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ'];
  const RAD = Math.PI / 180;
  const cm = (v) => v + ' cm';
  const calc = (expr, unseen) => ({ calc: [[expr, 0]], unseen: unseen || [] });

  // ── 점과 벡터 ────────────────────────────────────────────────
  const sub = G.sub, dot = G.dot, cross = G.cross, len2 = G.len2;
  const dist = (p, q) => Math.hypot(q[0] - p[0], q[1] - p[1]);
  const mid = (p, q, t) => { const k = t == null ? 0.5 : t; return [p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k]; };
  const mean = (pts) => [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];
  const unitV = (v) => { const s = Math.hypot(v[0], v[1]) || 1; return [v[0] / s, v[1] / s]; };
  const area2 = (pts) => pts.reduce((s, p, i) => s + cross(p, pts[(i + 1) % pts.length]), 0);
  const insidePoly = (pt, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i, i += 1) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > pt[1]) !== (yj > pt[1]) && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) c = !c; } return c; };

  // ── 판정: 합동, 선대칭, 점대칭 ────────────────────────────────
  // 꼭짓점이 모눈의 점이 아니어도(정다각형, 각도로 지은 도형) 되도록 조금의 틈(TOL)을 두고 견준다.
  const TOL = 1e-6;
  const samePt = (p, q) => Math.abs(p[0] - q[0]) < TOL && Math.abs(p[1] - q[1]) < TOL;
  // 한 줄에 놓인 꼭짓점은 걷어 낸다(변의 가운데에 찍힌 점이 있어도 같은 도형이다).
  const tidy = (pts) => pts.filter((p, i) => Math.abs(cross(sub(p, pts[(i + pts.length - 1) % pts.length]), sub(pts[(i + 1) % pts.length], p))) > TOL);
  const sidesOf = (pts) => { const t = tidy(pts); return t.map((p, i) => [p, t[(i + 1) % t.length]]); };
  const sameSeg = (s, t) => (samePt(s[0], t[0]) && samePt(s[1], t[1])) || (samePt(s[0], t[1]) && samePt(s[1], t[0]));
  // 선분 묶음(도형의 변, 글자의 획) 둘이 같은 자리에 놓인 같은 그림인가
  const sameFig = (a, b) => a.length === b.length && a.every((s) => b.some((t) => sameSeg(s, t)));
  // 점 p 를 직선 a–b 로 접어 옮긴 자리, 점 c 를 중심으로 180° 돌린 자리
  const mirror = (p, a, b) => { const r = sub(b, a), t = dot(sub(p, a), r) / len2(r), f = [a[0] + r[0] * t, a[1] + r[1] * t]; return [2 * f[0] - p[0], 2 * f[1] - p[1]]; };
  const halfTurn = (p, c) => [2 * c[0] - p[0], 2 * c[1] - p[1]];
  const endsOf = (segs) => { const out = []; segs.forEach((s) => s.forEach((p) => { if (!out.some((q) => samePt(p, q))) out.push(p); })); return out; };
  const onLine = (p, a, b) => Math.abs(cross(sub(p, a), sub(b, a))) < TOL * (1 + len2(sub(b, a)));
  // 직선 a–b 가 이 그림의 대칭축인가(접으면 완전히 겹치는가)
  const isAxis = (segs, a, b) => sameFig(segs.map((s) => s.map((p) => mirror(p, a, b))), segs);
  // 대칭축을 모두 찾는다. 접어서 겹치려면 끝점이 끝점으로 가야 하므로, 끝점 두 개를 맞바꾸는 직선(두 점을 이은 선분을 수직으로 똑같이 나누는 직선)과
  // 끝점 두 개를 지나는 직선만 따져 보면 된다.
  function axesOf(segs) {
    const pts = endsOf(segs), out = [];
    const tryLine = (a, b) => { if (!out.some(([p, q]) => onLine(a, p, q) && onLine(b, p, q)) && isAxis(segs, a, b)) out.push([a, b]); };
    for (let i = 0; i < pts.length; i += 1) for (let j = i + 1; j < pts.length; j += 1) {
      const m = mid(pts[i], pts[j]), r = sub(pts[j], pts[i]);
      tryLine(m, [m[0] - r[1], m[1] + r[0]]); tryLine(pts[i], pts[j]);
    }
    return out;
  }
  // 점대칭인가: 180° 돌려서 겹치려면 끝점들의 한가운데가 대칭의 중심이어야 한다.
  const centerOf = (segs) => mean(endsOf(segs));
  const isHalfTurn = (segs) => { const c = centerOf(segs); return sameFig(segs.map((s) => s.map((p) => halfTurn(p, c))), segs); };
  // 합동: 변의 길이와 꺾이는 각이 차례대로 같으면 밀거나 돌려서 겹친다. 뒤집은 것과 견주어 같으면 뒤집어서 겹친다.
  const close = (a, b) => Math.abs(a - b) < TOL * (1 + Math.abs(a) + Math.abs(b));
  function bends(pts) {
    const t = tidy(pts), n = t.length;
    return t.map((p, i) => { const e = sub(t[(i + 1) % n], p), f = sub(t[(i + 2) % n], t[(i + 1) % n]); return [len2(e), cross(e, f), dot(e, f)]; });
  }
  const bendsMatch = (a, b) => a.length === b.length && a.some((_, k) => a.every((v, i) => { const w = b[(i + k) % b.length]; return close(v[0], w[0]) && close(v[1], w[1]) && close(v[2], w[2]); }));
  const flipX = (pts) => pts.map(([x, y]) => [-x, y]);
  const backward = (pts) => pts.slice().reverse();
  const slideFit = (a, b) => bendsMatch(bends(a), bends(b)) || bendsMatch(bends(a), bends(backward(b)));   // 밀거나 돌려서 겹친다
  const flipFit = (a, b) => slideFit(a, flipX(b));                                                         // 뒤집어서 겹친다
  const congruent = (a, b) => slideFit(a, b) || flipFit(a, b);
  // 거의 대칭으로 보이는가: 대칭축이 아닌 직선으로 접었을 때(대칭의 중심이 아닌데 180° 돌렸을 때) 얼마나 어긋나는지를 잰다.
  // 끝점(꼭짓점)이 끝점에서 벗어난 거리와, 선 위의 점이 그림에서 벗어난 거리 가운데 큰 쪽이 어긋난 거리다. 이 거리가 slack 칸보다 작으면 눈으로 가릴 수 없다.
  const offEnds = (p, pts) => Math.min(...pts.map((q) => dist(p, q)));
  const offSeg = (p, [a, b]) => { const r = sub(b, a), t = Math.max(0, Math.min(1, dot(sub(p, a), r) / len2(r))); return Math.hypot(p[0] - a[0] - r[0] * t, p[1] - a[1] - r[1] * t); };
  const offFig = (p, segs) => Math.min(...segs.map((s) => offSeg(p, s)));
  const samplesOf = (segs) => segs.reduce((out, [a, b]) => { const n = Math.max(2, Math.ceil(dist(a, b) / 0.3)); for (let i = 0; i <= n; i += 1) out.push(mid(a, b, i / n)); return out; }, []);
  const gapBy = (segs, move) => { const pts = endsOf(segs); return Math.max(Math.max(...pts.map((p) => offEnds(move(p), pts))), Math.max(...samplesOf(segs).map((p) => offFig(move(p), segs)))); };
  // 대칭축이 아닌 직선(가운데를 지나는 직선을 2°씩 돌려 본다) 가운데 가장 잘 포개지는 것으로 접었을 때 어긋나는 거리
  function foldGap(segs) {
    const exact = axesOf(segs).map(([a, b]) => unitV(sub(b, a))), c = centerOf(segs);
    let best = Infinity;
    for (let deg = 0; deg < 180; deg += 2) {
      const r = [Math.cos(deg * RAD), Math.sin(deg * RAD)];
      if (exact.some((e) => Math.abs(cross(e, r)) < Math.sin(14 * RAD))) continue;
      best = Math.min(best, gapBy(segs, (p) => mirror(p, c, [c[0] + r[0], c[1] + r[1]])));
    }
    return best;
  }
  const turnGap = (segs) => { const c = centerOf(segs); return isHalfTurn(segs) ? Infinity : gapBy(segs, (p) => halfTurn(p, c)); };
  const looksFoldable = (segs, slack) => foldGap(segs) < (slack || 0.4);
  const looksTurnable = (segs, slack) => turnGap(segs) < (slack || 0.4);
  // 도형 하나의 갈래: axes(대칭축의 수), turn(점대칭인가)
  const kindOf = (segs) => ({ axes: axesOf(segs).length, turn: isHalfTurn(segs) });
  const kindOfPoly = (pts) => kindOf(sidesOf(pts));

  // 판정 도구가 생각대로 도는지 아는 답으로 먼저 본다(어긋나면 단원을 만들지 않는다).
  (function selfCheck() {
    const sq = [[0, 0], [2, 0], [2, 2], [0, 2]], rect = [[0, 0], [4, 0], [4, 2], [0, 2]], pg = [[1, 0], [4, 0], [3, 2], [0, 2]], iso = [[2, 0], [4, 3], [0, 3]], flag = [[0, 0], [3, 0], [3, 2], [1, 2], [1, 3], [0, 3]];
    const hex = Array.from({ length: 6 }, (_, i) => [Math.cos(i * 60 * RAD), Math.sin(i * 60 * RAD)]), pent = Array.from({ length: 5 }, (_, i) => [Math.cos(i * 72 * RAD), Math.sin(i * 72 * RAD)]);
    const want = [[sq, 4, true], [rect, 2, true], [pg, 0, true], [iso, 1, false], [flag, 0, false], [hex, 6, true], [pent, 5, false]];
    if (want.some(([p, axes, turn]) => kindOfPoly(p).axes !== axes || kindOfPoly(p).turn !== turn)) throw new Error('대칭 판정이 아는 답과 다르다');
    const turned = flag.map(([x, y]) => [5 - y, x + 2]), over = flag.map(([x, y]) => [7 - x, y]);
    if (!slideFit(flag, turned) || slideFit(flag, over) || !flipFit(flag, over) || !congruent(flag, over) || congruent(flag, [[0, 0], [3, 0], [3, 1], [1, 1], [1, 3], [0, 3]]) || congruent(sq, rect) || !congruent(pg, flipX(pg)))
      throw new Error('합동 판정이 아는 답과 다르다');
  })();

  // ── 도형 옮기기 ──────────────────────────────────────────────
  // 돌리기 넷(0°, 90°, 180°, 270°)과 뒤집기. 옮긴 뒤에는 왼쪽 위 구석에 붙여 놓는다(모눈의 점은 모눈의 점으로 간다).
  const TURN = [(p) => p, ([x, y]) => [-y, x], ([x, y]) => [-x, -y], ([x, y]) => [y, -x]];
  const moveOf = (q, over) => (p) => TURN[q](over ? [-p[0], p[1]] : p);
  const toCorner = (pts) => { const x0 = Math.min(...pts.map((p) => p[0])), y0 = Math.min(...pts.map((p) => p[1])); return pts.map(([x, y]) => [x - x0, y - y0]); };
  const image = (pts, q, over) => toCorner(pts.map(moveOf(q, over)));
  const scaled = (pts, k) => pts.map(([x, y]) => [x * k, y * k]);
  const spanOf = (pts) => [Math.max(...pts.map((p) => p[0])) - Math.min(...pts.map((p) => p[0])), Math.max(...pts.map((p) => p[1])) - Math.min(...pts.map((p) => p[1]))];
  const samePlace = (a, b) => G.samePoints(a, b);

  // ── 보기 짜기 ────────────────────────────────────────────────
  // 여럿을 고르는 문제의 보기: 맞는 묶음 하나와, 거기서 하나를 빼거나 더하거나 바꾼 틀린 묶음 셋
  function setOptions(d, labels, flags) {
    const key = (list) => list.join(', '), right = labels.filter((_, i) => flags[i]), pool = [];
    labels.forEach((_, i) => { const flipped = labels.filter((__, j) => (j === i ? !flags[j] : flags[j])); if (flipped.length) pool.push(flipped); });
    labels.forEach((_, i) => labels.forEach((__, j) => { if (flags[i] && !flags[j]) pool.push(labels.filter((___, k) => (k === i ? false : k === j ? true : flags[k]))); }));
    const out = [right], seen = new Set([key(right)]);
    for (const cand of d.shuffle(pool)) { if (out.length === 4) break; if (!seen.has(key(cand))) { seen.add(key(cand)); out.push(cand); } }
    const list = d.shuffle(out);
    return { options: list.map(key), answer: list.findIndex((o) => key(o) === key(right)), sets: list };
  }
  // 「모두 고른 것」 문항 한 벌: 보기와 답, 검사 근거
  function setItem(d, text, labels, flags, o) {
    if (!flags.some(Boolean) || flags.every(Boolean)) throw new Error('모두 맞거나 모두 틀린 보기는 쓰지 않는다');
    const made = setOptions(d, labels, flags);
    // o.again: 그림 속 좌표(다른 길로 다시 따져 볼 때 쓴다 — verify 도구)
    return C(text, made.options, made.answer, Object.assign({}, o, { facts: Object.assign({ sets: { labels, flags, options: made.sets } }, o.again ? { again: o.again } : {}) }));
  }
  // 하나를 고르는 문항: flags 가운데 참이 하나뿐이다.
  function oneItem(text, labels, flags, o) {
    if (flags.filter(Boolean).length !== 1) throw new Error('답이 하나가 아니다');
    return C(text, labels, flags.indexOf(true), Object.assign({}, o, { facts: Object.assign({ kindPick: { kinds: flags.map((hit, i) => (hit ? 'hit' : 'no' + i)), target: 'hit' } }, o.again ? { again: o.again } : {}) }));
  }
  // 설명 고르기: want 가 true 이면 옳은 것 하나와 틀린 것 셋, false 이면 옳은 것 셋과 틀린 것 하나
  function say(d, text, trues, falses, want, explain, figure) {
    const rows = d.shuffle(want ? [[d.pick(trues), true]].concat(d.shuffle(falses).slice(0, 3).map((t) => [t, false])) : d.shuffle(trues).slice(0, 3).map((t) => [t, true]).concat([[d.pick(falses), false]]));
    return C(text, rows.map((r) => r[0]), rows.findIndex((r) => r[1] === want), { figure, explain, facts: { truth: rows.map((r) => r[1]), want } });
  }
  // 참·거짓이 정해진 줄들 가운데 want 인 것이 하나뿐인 고르기. rows: [글, 참인가]
  function truthItem(d, text, rows, want, o) {
    const list = d.shuffle(rows);
    if (list.filter((r) => r[1] === want).length !== 1) throw new Error('답이 하나가 아니다');
    return C(text, list.map((r) => r[0]), list.findIndex((r) => r[1] === want), Object.assign({}, o, { facts: { truth: list.map((r) => r[1]), want } }));
  }
  // 낱말 하나 고르기
  function pickWord(d, text, want, others, explain) {
    const options = d.shuffle([want].concat(others));
    return C(text, options, options.indexOf(want), { explain, facts: { truth: options.map((o) => o === want), want: true } });
  }
  const tagList = (labels, flags) => labels.filter((_, i) => flags[i]).join(', ');

  // ── 그림: 모눈 위의 도형 ─────────────────────────────────────
  // 휴대폰 너비에 들어가는 그림의 가장 큰 너비(px)
  const FIT = 296;
  const FILL = 'rgba(251,191,36,0.28)';
  const paint = (svg, css) => svg.replace('class="mb-poly"', 'class="mb-poly" style="' + css + '"');
  const gp = (pts, fill) => paint(G.polygon(pts), 'fill:' + (fill || FILL));
  const restyle = (svg, css) => svg.replace(/class="mb-line[^"]*"/, 'class="mb-line" style="' + css + '"');
  const CUT_CSS = 'stroke:#b42318;stroke-width:1.5;stroke-dasharray:5 3';
  const AXIS_CSS = 'stroke:#1d4ed8;stroke-width:1.5;stroke-dasharray:9 3 2 3';
  const cutLine = (p, q) => restyle(G.line(p, q), CUT_CSS);         // 자르는 점선
  const axisLine = (p, q) => restyle(G.line(p, q), AXIS_CSS);       // 대칭축(일점쇄선)
  const thinLine = (p, q) => G.line(p, q, 'mb-line is-thin');
  const centreDot = (p) => G.point(p).replace('r="2.8"', 'r="3.2" style="fill:#b42318"');
  // 점과 그 이름(이름은 점의 오른쪽 위). 이름이 도형의 선 위에 놓여도 읽히게 글자 둘레를 희게 두른다.
  const halo = (svg) => svg.replace('<text ', '<text style="paint-order:stroke;stroke:#fff;stroke-width:3px;stroke-linejoin:round" ');
  const mark = (p, name) => G.point(p).replace('r="2.8"', 'r="3.2"') + halo(G.text([p[0] + 0.42, p[1] - 0.42], name));
  // 모눈판(가로 cols, 세로 rows 칸)의 가운데에 도형을 놓는다. extra(move): 덧그릴 것(자르는 점선, 대칭축, 점)
  function onGrid(pts, o) {
    const opt = o || {}, xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]), cols = opt.cols || 4, rows = opt.rows || 4;
    const dx = Math.floor((cols - Math.max(...xs) - Math.min(...xs)) / 2), dy = Math.floor((rows - Math.max(...ys) - Math.min(...ys)) / 2), move = ([x, y]) => [x + dx, y + dy];
    return G.board(cols, rows, [gp(pts.map(move), opt.fill)].concat(opt.extra ? opt.extra(move) : []), { grid: opt.grid === false ? false : 'lines', scale: opt.scale || 0.92, label: opt.label || '모눈종이 위의 도형' });
  }
  const tiles = (list, tags) => G.tiles(list.map((svg, i) => [(tags || TAGS)[i], svg]));
  const gridTiles = (list, o) => tiles(list.map((pts) => onGrid(pts, o)));

  // ── 그림: 이름·길이·각도를 적은 도형 ─────────────────────────
  // 그릴 것을 모았다가 차지한 자리를 재어, 여백 없이 판에 올린다. 글(이름표)의 너비도 자리에 넣어 재므로 글이 판 밖으로 잘리지 않는다.
  const LEN = 'mb-label is-length';
  const halfOf = (value) => String(value).split('').reduce((s, ch) => s + (/[ㄱ-ㆎ가-힣㉠-㉿□]/.test(ch) ? 0.3 : ch === ' ' ? 0.08 : ch === '°' ? 0.11 : 0.155), 0);
  function Sheet() { this.items = []; this.box = [Infinity, Infinity, -Infinity, -Infinity]; this.segs = []; this.texts = []; }
  Sheet.prototype.grow = function (p, rx, ry) { const b = this.box; b[0] = Math.min(b[0], p[0] - (rx || 0)); b[1] = Math.min(b[1], p[1] - (ry || 0)); b[2] = Math.max(b[2], p[0] + (rx || 0)); b[3] = Math.max(b[3], p[1] + (ry || 0)); return this; };
  Sheet.prototype.add = function (points, draw) { points.forEach((p) => this.grow(p)); this.items.push(draw); return this; };
  Sheet.prototype.poly = function (pts, css) { pts.forEach((p, i) => this.segs.push([p, pts[(i + 1) % pts.length]])); return this.add(pts, (m) => (css ? paint(G.polygon(pts.map(m)), css) : G.polygon(pts.map(m)))); };
  Sheet.prototype.line = function (p, q, kind) { this.segs.push([p, q]); return this.add([p, q], (m) => (kind === 'axis' ? axisLine(m(p), m(q)) : kind === 'cut' ? cutLine(m(p), m(q)) : kind === 'thin' ? thinLine(m(p), m(q)) : kind === 'dash' ? G.line(m(p), m(q), 'mb-line is-cut') : G.line(m(p), m(q)))); };
  Sheet.prototype.circle = function (c, r) { this.grow(c, r, r); this.items.push((m) => G.circle(m(c), r)); return this; };
  Sheet.prototype.dot = function (p, red) { return this.add([p], (m) => (red ? centreDot(m(p)) : G.point(m(p)))); };
  Sheet.prototype.text = function (at, value, cls) { const hw = halfOf(value) + 0.06; this.grow(at, hw, 0.36); this.texts.push({ at, hw }); this.items.push((m) => G.text(m(at), value, cls)); return this; };
  // 글이 선이나 다른 글과 겹치는가(겹치면 그림을 다시 짓는다). 글자 둘레의 빈 곳은 닿아도 되므로 글 상자를 조금 줄여서 본다.
  const boxOf = (t) => ({ c: t.at, hw: Math.max(0.14, t.hw - 0.05), hh: 0.28 });
  const boxOnLine = (b, [p, q]) => { const n = Math.max(2, Math.ceil(dist(p, q) / 0.08)); for (let i = 0; i <= n; i += 1) { const at = mid(p, q, i / n); if (Math.abs(at[0] - b.c[0]) < b.hw && Math.abs(at[1] - b.c[1]) < b.hh) return true; } return false; };
  const boxOnBox = (b, c) => Math.abs(b.c[0] - c.c[0]) < b.hw + c.hw && Math.abs(b.c[1] - c.c[1]) < b.hh + c.hh;
  Sheet.prototype.clash = function () {
    const boxes = this.texts.map(boxOf);
    return boxes.some((b, i) => boxes.some((c, j) => i < j && boxOnBox(b, c)) || this.segs.some((seg) => boxOnLine(b, seg)));
  };
  // 이 자리에 글을 적어도 선이나 다른 글과 겹치지 않는가
  Sheet.prototype.free = function (at, value) { const b = boxOf({ at, hw: halfOf(value) + 0.06 }); return !this.texts.some((t) => boxOnBox(b, boxOf(t))) && !this.segs.some((seg) => boxOnLine(b, seg)); };
  // 선분 p–q 옆의 여러 자리 가운데 선이나 다른 글과 겹치지 않는 첫 자리에 글을 적는다. spots: [선분을 따라간 자리(0~1), 어느 쪽(1 또는 −1)]
  Sheet.prototype.besideFree = function (p, q, value, spots) {
    const L = dist(p, q), n = [-(q[1] - p[1]) / L, (q[0] - p[0]) / L], off = halfOf(value) * Math.abs(n[0]) + 0.3 * Math.abs(n[1]) + 0.26;
    const list = (spots || [[0.5, 1], [0.5, -1], [0.3, 1], [0.7, 1], [0.3, -1], [0.7, -1]]).map(([t, s]) => { const m = mid(p, q, t); return [m[0] + n[0] * off * s, m[1] + n[1] * off * s]; });
    return this.text(list.find((at) => this.free(at, value)) || list[0], value, LEN);
  };
  // 선분 p–q 의 옆에 글을 적는다(선 위에 얹지 않는다). toward: 글을 둘 쪽에 있는 점, t: 선분을 따라간 자리(0~1), gap: 선분과 글 사이의 틈
  Sheet.prototype.beside = function (p, q, value, toward, t, gap) {
    const m = mid(p, q, t), L = dist(p, q);
    let n = [-(q[1] - p[1]) / L, (q[0] - p[0]) / L];
    if ((toward[0] - m[0]) * n[0] + (toward[1] - m[1]) * n[1] < 0) n = [-n[0], -n[1]];
    const off = halfOf(value) * Math.abs(n[0]) + 0.3 * Math.abs(n[1]) + (gap == null ? 0.26 : gap);
    return this.text([m[0] + n[0] * off, m[1] + n[1] * off], value, LEN);
  };
  // 다각형의 변 i(꼭짓점 i 와 i + 1 사이)의 바깥쪽에 글을 적는다.
  Sheet.prototype.side = function (pts, i, value, t) {
    const p = pts[i], q = pts[(i + 1) % pts.length], s = area2(pts) > 0 ? 1 : -1, m = mid(p, q, t);
    return this.beside(p, q, value, [m[0] + (q[1] - p[1]) * s, m[1] - (q[0] - p[0]) * s], t);
  };
  // 꼭짓점 o 에서 from°~to° 로 벌어진 각에 호(직각이면 직각 표시)와 글을 넣는다. 좁은 각은 글이 두 변에 닿지 않게 멀리 적는다.
  Sheet.prototype.sector = function (o, from, to, label, r) {
    const span = to - from, at = (from + to) / 2;
    if (Math.abs(span - 90) < 0.01) { this.add([o], (m) => G.squareMark(m(o), from, to)); return label ? this.text(G.toward(o, 1.05, at), label, LEN) : this; }
    if (!label) return this.add([o], (m) => G.arc(m(o), from, to, r || 0.5));
    // 글 상자가 두 변 사이에 들어가는 가장 가까운 자리(좁은 각일수록 꼭짓점에서 멀다). 호는 꼭짓점과 글 사이에 긋는다.
    const R = Math.max(0.95, 0.3 + (halfOf(label) + 0.06) / Math.tan((Math.min(span, 170) / 2) * RAD)), arcR = Math.max(0.4, Math.min(0.62, R - 0.52));
    this.add([o], (m) => G.arc(m(o), from, to, arcR));
    return this.text(G.toward(o, R, at), label, LEN);
  };
  // 다각형의 꼭짓점 i 안쪽에 각 표시와 글을 넣는다(볼록한 꼭짓점).
  Sheet.prototype.corner = function (pts, i, label, r) {
    const n = pts.length, a = G.bearing(pts[i], pts[(i + n - 1) % n]), b = G.bearing(pts[i], pts[(i + 1) % n]);
    let from = Math.min(a, b), to = Math.max(a, b);
    if (to - from > 180) { const t = from + 360; from = to; to = t; }
    return this.sector(pts[i], from, to, label, r);
  };
  // 점 v 에서 p 쪽과 q 쪽으로 벌어진 각(180°보다 작은 쪽)에 표시와 글
  Sheet.prototype.between = function (v, p, q, label, r) {
    const a = G.bearing(v, p), b = G.bearing(v, q);
    let from = Math.min(a, b), to = Math.max(a, b);
    if (to - from > 180) { const t = from + 360; from = to; to = t; }
    return this.sector(v, from, to, label, r);
  };
  // 꼭짓점의 이름: 두 변이 벌어진 쪽의 반대편(도형 밖)에 적는다. skip: 이름을 따로 적을 꼭짓점 번호들
  const nameSpot = (pts, i, amount) => {
    const n = pts.length, v = pts[i], a = unitV(sub(pts[(i + n - 1) % n], v)), b = unitV(sub(pts[(i + 1) % n], v));
    let w = [a[0] + b[0], a[1] + b[1]];
    w = Math.hypot(w[0], w[1]) < 1e-6 ? [-a[1], a[0]] : unitV(w);
    const out = [v[0] - w[0] * amount, v[1] - w[1] * amount];
    return insidePoly(out, pts) ? [v[0] + w[0] * amount, v[1] + w[1] * amount] : out;
  };
  Sheet.prototype.names = function (pts, names, skip, amount) { pts.forEach((_, i) => { if (!(skip || []).includes(i)) this.text(nameSpot(pts, i, amount || 0.46), names[i]); }); return this; };
  Sheet.prototype.size = function () { return [this.box[2] - this.box[0], this.box[3] - this.box[1]]; };
  // 판에 올린다. 휴대폰 너비를 넘지 않게 배율을 누른다.
  const boardScale = (cols, scale) => Math.min(scale || 1.12, FIT / (32 + cols * 22));
  Sheet.prototype.svg = function (label, scale) {
    const b = this.box, m = ([x, y]) => [x - b[0], y - b[1]], cols = b[2] - b[0], rows = b[3] - b[1];
    return G.board(cols, rows, this.items.map((draw) => draw(m)), { grid: false, scale: boardScale(cols, scale), label });
  };
  // 그림 두 장을 한 판에 나란히 놓는다(가로로 다 들어가지 않으면 위아래로 놓는다). 두 그림의 배율은 같다(합동인 도형은 같은 크기로 보여야 한다).
  function joinSheets(a, b, label, scale) {
    const [aw, ah] = a.size(), [bw, bh] = b.size(), wide = aw + 1.5 + bw <= 12.4, gap = wide ? 1.5 : 0.5;
    const cols = wide ? aw + gap + bw : Math.max(aw, bw), rows = wide ? Math.max(ah, bh) : ah + gap + bh;
    const ma = ([x, y]) => [x - a.box[0] + (wide ? 0 : (cols - aw) / 2), y - a.box[1] + (wide ? (rows - ah) / 2 : 0)];
    const mb = ([x, y]) => [x - b.box[0] + (wide ? aw + gap : (cols - bw) / 2), y - b.box[1] + (wide ? (rows - bh) / 2 : ah + gap)];
    return G.board(cols, rows, a.items.map((draw) => draw(ma)).concat(b.items.map((draw) => draw(mb))), { grid: false, scale: boardScale(cols, scale), label });
  }
  // 꼭짓점에 이름을 붙이는 차례: 맨 위(같으면 왼쪽) 꼭짓점에서 시작해 시계 반대 방향으로 돈다(교과서의 ㄱㄴㄷㄹ 차례).
  function around(pts) {
    const n = pts.length, ccw = area2(pts) < 0;   // 화면은 세로가 아래로 커지므로 부호가 거꾸로다.
    let s = 0;
    pts.forEach((p, i) => { if (p[1] < pts[s][1] - 1e-9 || (Math.abs(p[1] - pts[s][1]) < 1e-9 && p[0] < pts[s][0])) s = i; });
    return Array.from({ length: n }, (_, k) => (s + (ccw ? k : n - k)) % n);
  }
  const canon = (pts) => around(pts).map((i) => pts[i]);
  // 여러 도형을 같은 배율로, 가장 큰 것이 가로 maxW·세로 maxH 칸 안에 들어가게 맞춘다.
  function sizeTo(list, maxW, maxH) {
    const k = Math.min(...list.map((pts) => { const [w, h] = spanOf(pts); return Math.min(maxW / w, maxH / h); }));
    return list.map((pts) => scaled(toCorner(pts), k));
  }

  // ── 도형 짓기: 길이로, 각도로 ─────────────────────────────────
  // 세 변의 길이가 a(오른쪽 변), b(왼쪽 변), c(밑변)인 삼각형 [왼쪽 아래, 오른쪽 아래, 위]
  function triBySides(a, b, c) { const x = (b * b + c * c - a * a) / (2 * c); return [[0, 0], [c, 0], [x, -Math.sqrt(b * b - x * x)]]; }
  // 네 변의 길이가 a(밑변), b(오른쪽 변), c(윗변), e(왼쪽 변)이고 오른쪽 아래 각이 deg°인 사각형 [왼쪽 아래, 오른쪽 아래, 오른쪽 위, 왼쪽 위]. 지을 수 없으면 빈 값
  function quadBySides(a, b, c, e, deg) {
    const p0 = [0, 0], p1 = [a, 0], p2 = G.toward(p1, b, 180 - deg), L = dist(p0, p2);
    if (L >= c + e - 0.5 || L <= Math.abs(c - e) + 0.5) return null;
    const along = (L * L + e * e - c * c) / (2 * L), up = Math.sqrt(e * e - along * along), u = unitV(sub(p2, p0));
    return [p0, p1, p2, [u[0] * along + u[1] * up, u[1] * along - u[0] * up]];
  }
  // 네 각이 차례로 A(왼쪽 아래), Bq(오른쪽 아래), Cq(오른쪽 위), 나머지(왼쪽 위)이고 밑변이 a, 오른쪽 변이 b 인 사각형. 지을 수 없으면 빈 값
  function quadByAngles(a, b, A, Bq, Cq) {
    const p0 = [0, 0], p1 = [a, 0], p2 = G.toward(p1, b, 180 - Bq), h = 360 - Bq - Cq, r0 = [Math.cos(A * RAD), -Math.sin(A * RAD)], r2 = [Math.cos(h * RAD), -Math.sin(h * RAD)];
    const den = cross(r0, r2); if (Math.abs(den) < 1e-6) return null;
    const t = cross(sub(p2, p0), r2) / den, s = cross(sub(p2, p0), r0) / den;
    return t > 0.5 && s > 0.5 ? [p0, p1, p2, [r0[0] * t, r0[1] * t]] : null;
  }
  const anglesOf = (pts) => pts.map((_, i) => G.angleOf(pts, i));
  const convex = (pts) => { const s = pts.map((p, i) => Math.sign(cross(sub(pts[(i + 1) % pts.length], p), sub(pts[(i + 2) % pts.length], pts[(i + 1) % pts.length])))); return s.every((v) => v === s[0] && v !== 0); };

  // ── 합동인 두 도형 그림 ──────────────────────────────────────
  // A: 첫 도형(이름 붙이는 차례로 놓인 점들), q·over: 둘째 도형으로 옮기는 돌리기·뒤집기.
  // o: { sides1, sides2: { 첫 도형의 변 번호 i(꼭짓점 i 와 i+1 사이): 글 }, angles1, angles2: { 첫 도형의 꼭짓점 번호: 글 }, label(둘째 도형의 것도 첫 도형의 번호로 적는다) }
  // 돌려주는 것: figure, na(첫 도형의 꼭짓점 이름), nb(첫 도형의 꼭짓점 i 에 대응하는 둘째 도형의 꼭짓점 이름)
  function pairFig(A, q, over, o) {
    // 각의 크기를 적는 그림은 글이 도형 안에 들어가야 하므로 크게 그린다.
    const n = A.length, has = (x) => Object.keys(x || {}).length > 0, room = has(o.angles1) || has(o.angles2) ? [6, 4.4] : has(o.sides1) || has(o.sides2) ? [4.6, 3.6] : [4.3, 3.5];
    const [P, Q] = sizeTo([A, A.map(moveOf(q, over))], o.maxW || room[0], o.maxH || room[1]);
    const order = around(Q), na = JA.slice(0, n), nb = [];
    order.forEach((index, k) => { nb[index] = JA[n + k]; });
    const one = (pts, names, sides, angles) => {
      const sheet = new Sheet().poly(pts).names(pts, names);
      Object.keys(sides || {}).forEach((i) => sheet.side(pts, Number(i), sides[i]));
      Object.keys(angles || {}).forEach((i) => sheet.corner(pts, Number(i), angles[i]));
      return sheet;
    };
    const first = one(P, na, o.sides1, o.angles1), second = one(Q, nb, o.sides2, o.angles2);
    return { figure: joinSheets(first, second, typeof o.label === 'function' ? o.label(na, nb) : o.label, o.scale), na, nb, n, P, Q, clash: first.clash() || second.clash() };
  }
  // 이름 짓기. 꼭짓점 이름을 그림에 적힌 차례(ㄱㄴㄷ …)로 읽는다: 변 i(꼭짓점 i 와 i+1 사이), 각 i(꼭짓점 i 가 가운데)
  const inOrder = (names) => names.slice().sort((x, y) => JA.indexOf(x) - JA.indexOf(y));
  const sideName = (names, i) => '변 ' + inOrder([names[i], names[(i + 1) % names.length]]).join('');
  const angleName = (names, i) => { const [a, b] = inOrder([names[(i + names.length - 1) % names.length], names[(i + 1) % names.length]]); return '각 ' + a + names[i] + b; };
  const shapeWord = (n) => ({ 3: '삼각형', 4: '사각형', 5: '오각형', 6: '육각형', 8: '팔각형' }[n]);
  const told = (names) => shapeWord(names.length) + ' ' + inOrder(names).join('');

  // ── 대응을 눈으로 찾을 수 있는 도형 짓기 ──────────────────────
  // 삼각형의 세 변(긴 변과 짧은 변이 뚜렷이 다르다), 세 각(20° 넘게 다르다), 사각형의 네 각
  const TRI_SIDES = [[5, 7, 9], [6, 8, 11], [7, 9, 12], [5, 8, 10], [6, 9, 11], [8, 10, 13], [7, 10, 13], [9, 12, 16]];
  const TRI_ANGLES = [[40, 60, 80], [30, 50, 100], [35, 60, 85], [30, 65, 85], [25, 55, 100], [35, 50, 95]];
  const QUAD_ANGLES = [[60, 125, 80, 95], [75, 95, 130, 60], [80, 100, 115, 65], [55, 110, 125, 70]];
  // 이름 붙이는 차례로 놓은 점들(A)과 변의 길이(sides), 각의 크기(angles). 번호는 이름 차례다.
  const measured = (pts) => { const A = canon(pts); return { A, sides: A.map((p, i) => dist(p, A[(i + 1) % A.length])), angles: anglesOf(A) }; };
  const whole = (v) => Math.abs(v - Math.round(v)) < 1e-6;
  const sidedTri = (d) => { const [a, b, c] = d.shuffle(d.pick(TRI_SIDES)); return measured(triBySides(a, b, c)); };
  const sidedQuad = (d) => measured(d.until(() => {
    const s = d.shuffle([5, 6, 7, 8, 9, 10, 11, 12, 13, 14]).slice(0, 4);
    return s.some((x, i) => s.some((y, j) => i < j && Math.abs(x - y) < 2)) ? null : quadBySides(s[0], s[1], s[2], s[3], d.pick([70, 80, 90, 100, 110]));
  }, (q) => q && convex(q) && anglesOf(q).every((x) => x >= 55 && x <= 130)));
  const angledTri = (d) => { const [a, b] = d.shuffle(d.pick(TRI_ANGLES)); return measured(G.triangle(a, b, 5, [0, 0])); };
  const angledQuad = (d) => d.until(() => {
    const set = d.pick(QUAD_ANGLES), k = d.int(0, 3), ang = (d.bool() ? set : set.slice().reverse()).map((_, i, all) => all[(i + k) % 4]), q = quadByAngles(d.int(4, 7), d.int(3, 6), ang[0], ang[1], ang[2]);
    return q ? Object.assign(measured(q), { unit: d.pick([1, 2, 3]) }) : null;
  }, (m) => m && convex(m.A) && m.sides.every((s) => s >= 2.8 && s <= 9));
  // 글이 선이나 다른 글과 겹치지 않는 그림이 나올 때까지 다시 짓는다.
  const drawn = (d, make) => d.until(make, (fig) => !fig.clash);
  // 합동인 두 도형 그림에 길이와 각도를 적는다. show: { s1, s2: 길이를 적을 변 번호들(첫 도형, 둘째 도형), a1, a2: 크기를 적을 각 번호들 } — 번호는 모두 첫 도형의 이름 차례다.
  function labelled(m, q, over, show, o) {
    const u = m.unit || 1, len = (i) => Math.round(m.sides[i] * u), deg = (i) => Math.round(m.angles[i]);
    if ((show.s1 || []).concat(show.s2 || []).some((i) => !whole(m.sides[i] * u)) || (show.a1 || []).concat(show.a2 || []).some((i) => !whole(m.angles[i]))) throw new Error('그림에 적을 수가 어림한 값이다');
    const pick = (list, value) => (list || []).reduce((out, i) => { out[i] = value(i); return out; }, {});
    const fig = pairFig(m.A, q, over, Object.assign({
      sides1: pick(show.s1, (i) => cm(len(i))), sides2: pick(show.s2, (i) => cm(len(i))), angles1: pick(show.a1, (i) => deg(i) + '°'), angles2: pick(show.a2, (i) => deg(i) + '°'),
      label: (na, nb) => `서로 합동인 ${told(na)}과 ${told(nb)}. ` + [].concat((show.s1 || []).map((i) => `${sideName(na, i)} ${cm(len(i))}`), (show.a1 || []).map((i) => `${angleName(na, i)} ${deg(i)}°`),
        (show.s2 || []).map((i) => `${sideName(nb, i)} ${cm(len(i))}`), (show.a2 || []).map((i) => `${angleName(nb, i)} ${deg(i)}°`)).join(', ')
    }, o || {}));
    return Object.assign(fig, { len, deg });
  }

  // ── 모눈 위의 도형 감: 합동 찾기 ──────────────────────────────
  // base: 돌리고 뒤집은 모양이 서로 다른 치우친 도형, alike: 모양은 비슷하지만 합동이 아닌 도형(모눈 한 칸이 넘게 다르다)
  const LOPS = [
    { base: [[0, 0], [3, 0], [3, 2], [1, 2], [1, 3], [0, 3]], alike: [[[0, 0], [3, 0], [3, 1], [1, 1], [1, 3], [0, 3]], [[0, 0], [2, 0], [2, 2], [1, 2], [1, 3], [0, 3]], [[0, 0], [3, 0], [3, 2], [2, 2], [2, 3], [0, 3]]] },   // 깃발
    { base: [[0, 0], [2, 0], [3, 3], [0, 3]], alike: [[[0, 0], [1, 0], [3, 3], [0, 3]], [[0, 0], [2, 0], [3, 2], [0, 2]], [[0, 0], [2, 0], [4, 3], [0, 3]]] },                                                        // 한쪽만 비스듬한 사각형
    { base: [[0, 0], [0, 3], [2, 3]], alike: [[[0, 0], [0, 3], [3, 3]], [[0, 0], [0, 4], [2, 4]], [[0, 0], [0, 3], [1, 3]]] },                                                                                           // 직각삼각형
    { base: [[1, 0], [3, 0], [2, 2], [0, 2]], alike: [[[1, 0], [4, 0], [3, 2], [0, 2]], [[2, 0], [4, 0], [2, 2], [0, 2]], [[1, 0], [3, 0], [2, 3], [0, 3]]] },                                                         // 평행사변형
    { base: [[0, 0], [2, 0], [3, 2], [3, 3], [0, 3]], alike: [[[0, 0], [1, 0], [3, 2], [3, 3], [0, 3]], [[0, 0], [2, 0], [3, 1], [3, 3], [0, 3]], [[0, 0], [2, 0], [3, 2], [3, 4], [0, 4]]] },                         // 한 귀를 비스듬히 자른 사각형
    { base: [[0, 0], [1, 0], [3, 1], [1, 2], [1, 3], [0, 3]], alike: [[[0, 0], [1, 0], [3, 1], [1, 2], [1, 4], [0, 4]], [[0, 0], [1, 0], [2, 1], [1, 2], [1, 3], [0, 3]], [[0, 0], [1, 0], [3, 2], [1, 2], [1, 3], [0, 3]]] }, // 세모 깃발
    { base: [[0, 0], [4, 2], [1, 2]], alike: [[[0, 0], [4, 2], [2, 2]], [[0, 0], [4, 3], [1, 3]], [[1, 0], [4, 2], [1, 2]]] }                                                                                            // 세 변의 길이가 모두 다른 삼각형(한 변이 모눈의 선 위에 있다)
  ];
  // 크기만 다른 도형(모양은 같다): 작은 것을 2배로 키운 것
  const SIZED = [[[0, 0], [1, 0], [2, 2], [0, 2]], [[0, 0], [0, 2], [1, 2]], [[0, 0], [1, 0], [2, 2], [1, 2]], [[0, 0], [2, 2], [1, 2]]];
  const eightOf = (p) => [0, 1, 2, 3].map((q) => image(p, q, false)).concat([0, 1, 2, 3].map((q) => image(p, q, true)));
  for (const { base, alike } of LOPS) {
    if (alike.some((p) => congruent(base, p)) || eightOf(base).some((p) => !congruent(base, p))) throw new Error('합동 찾기 도형 감이 생각과 다르다');
    if (eightOf(base).filter((p, i, all) => all.findIndex((q) => samePlace(p, q)) === i).length < 4) throw new Error('돌리고 뒤집은 모양이 너무 겹친다');
  }
  if (SIZED.some((p) => congruent(p, scaled(p, 2)) || kindOfPoly(p).axes > 0)) throw new Error('크기만 다른 도형 감이 생각과 다르다');
  // 한 도형을 돌리거나 뒤집은 모양 가운데 놓인 꼴이 서로 다른 것 count 개(over: 뒤집은 것만, 안 뒤집은 것만, 아무것이나)
  function someImages(d, p, count, avoid) {
    const out = [];
    for (const cand of d.shuffle(eightOf(p))) { if (out.length === count) break; if (!out.concat(avoid || []).some((x) => samePlace(x, cand))) out.push(cand); }
    if (out.length < count) throw new Error('놓인 꼴이 모자란다');
    return out;
  }
  const anyImage = (d, p) => image(p, d.int(0, 3), d.bool());
  // 색종이 색(모눈이 비쳐 보이게 옅게 칠한다)
  const PAPER = ['rgba(250,204,21,0.42)', 'rgba(59,130,246,0.30)', 'rgba(244,63,94,0.28)', 'rgba(34,197,94,0.32)'];

  // ── 자르는 선 ────────────────────────────────────────────────
  // 도형을 선분 p–q(두 끝이 도형의 둘레 위에 있다)로 잘라 두 조각을 만든다.
  function cutBy(pts, p, q) {
    const ring = [];
    pts.forEach((v, i) => { const w = pts[(i + 1) % pts.length]; ring.push(v); for (const c of [p, q]) if (!samePt(c, v) && !samePt(c, w) && Math.abs(cross(sub(c, v), sub(w, v))) < TOL && dot(sub(c, v), sub(c, w)) < 0) ring.push(c); });
    const ip = ring.findIndex((v) => samePt(v, p)), iq = ring.findIndex((v) => samePt(v, q));
    if (ip < 0 || iq < 0) throw new Error('자르는 선의 끝이 둘레 위에 없다');
    const walk = (a, b) => { const out = [ring[a]]; for (let i = a; i !== b;) { i = (i + 1) % ring.length; out.push(ring[i]); } return out; };
    return [walk(ip, iq), walk(iq, ip)];
  }
  const halvesFit = (pts, p, q) => { const [a, b] = cutBy(pts, p, q); return congruent(a, b); };
  // 선 하나로 자른 도형(모눈 4×4칸 안): [도형, 자르는 선의 두 끝]
  const CUTS = [
    [[[0, 0], [4, 0], [4, 2], [0, 2]], [0, 0], [4, 2]],            // 직사각형의 대각선
    [[[0, 0], [4, 0], [4, 2], [0, 2]], [2, 0], [2, 2]],            // 직사각형을 반으로 나누는 세로선
    [[[0, 0], [4, 0], [4, 2], [0, 2]], [1, 0], [3, 2]],            // 직사각형의 한가운데를 지나는 비스듬한 선
    [[[0, 0], [4, 0], [4, 3], [0, 3]], [1, 0], [1, 3]],            // 직사각형의 한쪽으로 치우친 세로선
    [[[0, 0], [4, 0], [4, 2], [0, 2]], [0, 0], [2, 2]],            // 직사각형의 한 꼭짓점에서 맞은편 변의 가운데로
    [[[1, 0], [4, 0], [3, 2], [0, 2]], [1, 0], [3, 2]],            // 평행사변형의 대각선
    [[[1, 0], [4, 0], [3, 2], [0, 2]], [2, 0], [2, 2]],            // 평행사변형의 한가운데를 지나는 세로선
    [[[2, 0], [4, 3], [0, 3]], [2, 0], [2, 3]],                    // 이등변삼각형의 꼭짓점에서 밑변의 가운데로
    [[[2, 0], [4, 4], [0, 4]], [1, 2], [3, 2]],                    // 이등변삼각형을 밑변과 나란히 자른 선
    [[[0, 0], [0, 3], [4, 3]], [0, 3], [2, 1.5]],                  // 직각삼각형의 직각 꼭짓점에서 맞은편 변의 가운데로(넓이는 같고 모양이 다르다)
    [[[1, 0], [3, 0], [4, 3], [0, 3]], [2, 0], [2, 3]],            // 양쪽이 같은 사다리꼴을 반으로 나누는 세로선
    [[[1, 0], [3, 0], [4, 3], [0, 3]], [1, 0], [4, 3]],            // 양쪽이 같은 사다리꼴의 대각선
    [[[0, 0], [2, 0], [4, 3], [0, 3]], [2, 0], [2, 3]],            // 한쪽만 비스듬한 사다리꼴의 세로선
    [[[0, 0], [3, 0], [3, 3], [0, 3]], [0, 0], [3, 3]],            // 정사각형의 대각선
    [[[2, 0], [4, 2], [2, 4], [0, 2]], [0, 2], [4, 2]]             // 마름모의 대각선
  ].map(([pts, p, q]) => ({ pts, p, q, fit: halvesFit(pts, p, q) }));
  if (CUTS.filter((c) => c.fit).length !== 9) throw new Error('자른 도형 감의 합동 판정이 생각과 다르다');
  const cutTile = (c) => onGrid(c.pts, { extra: (m) => [cutLine(m(c.p), m(c.q))], label: '점선이 하나 그어진 도형' });

  // 여러 조각으로 자른 도형: lines(자르는 선), pieces(조각). 조각이 모두 서로 합동인지는 좌표로 가린다.
  const allFit = (pieces) => pieces.every((a, i) => pieces.every((b, j) => i >= j || congruent(a, b)));
  const fan = (pts, c) => pts.map((p, i) => [p, pts[(i + 1) % pts.length], c]);
  const R42 = [[0, 0], [4, 0], [4, 2], [0, 2]], R43 = [[0, 0], [4, 0], [4, 3], [0, 3]], PG = [[1, 0], [4, 0], [3, 2], [0, 2]], RH = [[2, 0], [4, 2], [2, 4], [0, 2]], SQ = [[0, 0], [3, 0], [3, 3], [0, 3]], TZ = [[1, 0], [3, 0], [4, 3], [0, 3]];
  const strips = (w, h, xs) => [0].concat(xs, [w]).slice(0, -1).map((x, i) => { const x2 = xs.concat([w])[i]; return [[x, 0], [x2, 0], [x2, h], [x, h]]; });
  const MANY = [
    { pts: R42, lines: [[[0, 0], [4, 2]], [[4, 0], [0, 2]]], pieces: fan(R42, [2, 1]) },                                           // 직사각형의 두 대각선
    { pts: R42, lines: [[[2, 0], [2, 2]], [[0, 1], [4, 1]]], pieces: [[[0, 0], [2, 0], [2, 1], [0, 1]], [[2, 0], [4, 0], [4, 1], [2, 1]], [[0, 1], [2, 1], [2, 2], [0, 2]], [[2, 1], [4, 1], [4, 2], [2, 2]]] },
    { pts: R43, lines: [[[1, 0], [1, 3]], [[2, 0], [2, 3]], [[3, 0], [3, 3]]], pieces: strips(4, 3, [1, 2, 3]) },                  // 직사각형을 똑같은 띠 넷으로
    { pts: R43, lines: [[[1, 0], [1, 3]], [[2, 0], [2, 3]]], pieces: strips(4, 3, [1, 2]) },                                       // 직사각형을 너비가 다른 띠 셋으로
    { pts: PG, lines: [[[1, 0], [3, 2]], [[4, 0], [0, 2]]], pieces: fan(PG, [2, 1]) },                                             // 평행사변형의 두 대각선
    { pts: RH, lines: [[[2, 0], [2, 4]], [[0, 2], [4, 2]]], pieces: fan(RH, [2, 2]) },                                             // 마름모의 두 대각선
    { pts: SQ, lines: [[[0, 0], [3, 3]], [[3, 0], [0, 3]]], pieces: fan(SQ, [1.5, 1.5]) },                                         // 정사각형의 두 대각선
    { pts: TZ, lines: [[[1, 0], [4, 3]], [[3, 0], [0, 3]]], pieces: fan(TZ, [2, 1]) }                                              // 사다리꼴의 두 대각선
  ].map((m) => Object.assign(m, { fit: allFit(m.pieces) }));
  if (MANY.some((m) => Math.abs(m.pieces.reduce((s, p) => s + Math.abs(area2(p)), 0) - Math.abs(area2(m.pts))) > TOL) || MANY.map((m) => m.fit).join() !== 'false,true,true,false,false,true,true,false') throw new Error('여러 조각으로 자른 도형 감이 생각과 다르다');
  const manyTile = (m) => onGrid(m.pts, { extra: (mv) => m.lines.map(([p, q]) => cutLine(mv(p), mv(q))), label: '점선이 여러 개 그어진 도형' });
  // 정삼각형을 세 조각으로 나누는 네 가지
  const TRI3 = (() => {
    const s = 3.6, h = s * Math.sqrt(3) / 2, A = [s / 2, 0], Bp = [0, h], Cp = [s, h], g = mean([A, Bp, Cp]), mAB = mid(A, Bp), mBC = mid(Bp, Cp), mCA = mid(Cp, A);
    const b1 = mid(Bp, Cp, 1 / 3), b2 = mid(Bp, Cp, 2 / 3), l1 = mid(A, Bp, 1 / 3), l2 = mid(A, Bp, 2 / 3), r1 = mid(A, Cp, 1 / 3), r2 = mid(A, Cp, 2 / 3), pts = [A, Bp, Cp];
    return [
      { pts, lines: [[g, A], [g, Bp], [g, Cp]], pieces: [[A, Bp, g], [Bp, Cp, g], [Cp, A, g]] },
      { pts, lines: [[g, mAB], [g, mBC], [g, mCA]], pieces: [[A, mAB, g, mCA], [Bp, mBC, g, mAB], [Cp, mCA, g, mBC]] },
      { pts, lines: [[l1, r1], [l2, r2]], pieces: [[A, l1, r1], [l1, l2, r2, r1], [l2, Bp, Cp, r2]] },
      { pts, lines: [[A, b1], [A, b2]], pieces: [[A, Bp, b1], [A, b1, b2], [A, b2, Cp]] }
    ].map((m) => Object.assign(m, { fit: allFit(m.pieces) }));
  })();
  if (TRI3.map((m) => m.fit).join() !== 'true,true,false,false') throw new Error('정삼각형을 나눈 감이 생각과 다르다');
  const plainTile = (m) => { const sheet = new Sheet().poly(m.pts); m.lines.forEach(([p, q]) => sheet.line(p, q, 'cut')); return sheet.svg('점선을 따라 세 조각으로 나눈 정삼각형', 1); };

  // 직사각형 종이를 선을 따라 여러 조각으로 자른 그림(모눈). 조각은 이름 차례(가, 나, 다 …)로 적는다. 조각을 모두 합치면 직사각형이 되는지 넓이로 확인한다.
  const DISSECT = [
    { cols: 7, rows: 4, pieces: [[[0, 0], [2, 0], [2, 4]], [[0, 0], [2, 4], [0, 4]], [[2, 0], [4, 0], [4, 2], [2, 2]], [[2, 2], [4, 2], [4, 4], [2, 4]], [[4, 0], [7, 0], [4, 4]], [[7, 0], [7, 4], [4, 4]]] },
    { cols: 6, rows: 4, pieces: [[[0, 0], [2, 0], [0, 4]], [[2, 0], [4, 0], [2, 4], [0, 4]], [[4, 0], [6, 0], [5, 2], [3, 2]], [[3, 2], [5, 2], [4, 4], [2, 4]], [[6, 0], [6, 4], [4, 4]]] },
    { cols: 6, rows: 4, pieces: [[[0, 0], [3, 0], [3, 2], [0, 2]], [[3, 0], [6, 0], [6, 2]], [[3, 0], [6, 2], [3, 2]], [[0, 2], [2, 2], [2, 4], [0, 4]], [[2, 2], [6, 2], [6, 4], [2, 4]]] }
  ];
  if (DISSECT.some((c) => Math.abs(c.pieces.reduce((s, p) => s + Math.abs(area2(p)) / 2, 0) - c.cols * c.rows) > TOL)) throw new Error('조각을 합쳐도 직사각형이 되지 않는다');
  // 선이 여럿 그어진 도형 하나(모눈 10×6칸, 도형은 한 칸 안쪽에 놓는다): lines: [한 끝, 다른 끝] — 이름은 첫 끝의 바깥에 적는다.
  const LINED = [
    { word: '평행사변형', pts: [[2, 0], [8, 0], [6, 4], [0, 4]], lines: [[[2, 0], [6, 4]], [[5, 0], [3, 4]], [[8, 0], [0, 4]], [[6, 0], [6, 4]], [[3, 0], [1, 2]]] },
    { word: '직사각형', pts: [[0, 0], [8, 0], [8, 4], [0, 4]], lines: [[[0, 0], [8, 4]], [[4, 0], [4, 4]], [[2, 0], [6, 4]], [[3, 0], [3, 4]], [[8, 0], [0, 2]]] },
    { word: '사다리꼴', pts: [[2, 0], [6, 0], [8, 4], [0, 4]], lines: [[[4, 0], [4, 4]], [[2, 0], [8, 4]], [[1, 2], [7, 2]], [[6, 0], [0, 4]]] },
    { word: '이등변삼각형', pts: [[4, 0], [8, 4], [0, 4]], lines: [[[4, 0], [4, 4]], [[0, 4], [6, 2]], [[2, 2], [6, 2]], [[8, 4], [2, 2]]] }
  ];

  // ── 선대칭·점대칭 도형 감(모눈 4×4칸 안) ──────────────────────
  // 갈래는 손으로 적은 것(want)과 좌표로 판정한 것이 같아야 한다. [도형, 대칭축의 수, 점대칭인가]
  const POOL = [
    [[[1, 0], [2, 4], [0, 4]], 1, false], [[[2, 0], [4, 2], [0, 2]], 1, false], [[[1, 0], [3, 0], [4, 3], [0, 3]], 1, false], [[[2, 0], [4, 2], [4, 4], [0, 4], [0, 2]], 1, false],
    [[[0, 0], [3, 0], [3, 1], [2, 1], [2, 3], [1, 3], [1, 1], [0, 1]], 1, false], [[[2, 0], [4, 2], [3, 2], [3, 4], [1, 4], [1, 2], [0, 2]], 1, false], [[[2, 0], [4, 1], [2, 4], [0, 1]], 1, false],
    [[[0, 0], [1, 0], [1, 2], [3, 2], [3, 0], [4, 0], [4, 3], [0, 3]], 1, false],
    [[[0, 1], [4, 2], [0, 3]], 1, false], [[[0, 0], [3, 0], [3, 1], [1, 1], [1, 3], [3, 3], [3, 4], [0, 4]], 1, false], [[[0, 1], [2, 1], [2, 0], [4, 2], [2, 4], [2, 3], [0, 3]], 1, false], [[[0, 0], [3, 1], [3, 3], [0, 4]], 1, false],
    [[[0, 0], [0, 3], [3, 3]], 1, false], [[[0, 0], [1, 0], [1, 2], [3, 2], [3, 3], [0, 3]], 1, false], [[[0, 0], [2, 1], [4, 4], [1, 2]], 1, false],
    [[[0, 0], [4, 0], [4, 2], [0, 2]], 2, true], [[[0, 0], [2, 0], [2, 4], [0, 4]], 2, true], [[[2, 0], [4, 1], [2, 2], [0, 1]], 2, true], [[[1, 0], [2, 2], [1, 4], [0, 2]], 2, true],
    [[[0, 0], [1, 0], [1, 1], [2, 1], [2, 0], [3, 0], [3, 3], [2, 3], [2, 2], [1, 2], [1, 3], [0, 3]], 2, true], [[[1, 0], [3, 0], [4, 1], [3, 2], [1, 2], [0, 1]], 2, true],
    [[[0, 0], [3, 0], [3, 1], [2, 1], [2, 3], [3, 3], [3, 4], [0, 4], [0, 3], [1, 3], [1, 1], [0, 1]], 2, true],
    [[[0, 0], [3, 0], [3, 3], [0, 3]], 4, true], [[[1, 0], [2, 0], [2, 1], [3, 1], [3, 2], [2, 2], [2, 3], [1, 3], [1, 2], [0, 2], [0, 1], [1, 1]], 4, true], [[[2, 0], [4, 2], [2, 4], [0, 2]], 4, true],
    [[[1, 0], [4, 0], [3, 2], [0, 2]], 0, true], [[[0, 0], [2, 0], [4, 3], [2, 3]], 0, true], [[[0, 0], [2, 0], [2, 2], [3, 2], [3, 3], [1, 3], [1, 1], [0, 1]], 0, true],
    [[[1, 1], [3, 0], [3, 1], [4, 3], [3, 3], [1, 4], [1, 3], [0, 1]], 0, true], [[[0, 0], [3, 0], [4, 2], [4, 3], [1, 3], [0, 1]], 0, true], [[[0, 0], [2, 0], [2, 1], [4, 1], [4, 3], [2, 3], [2, 2], [0, 2]], 0, true],
    [[[0, 0], [4, 2], [2, 3]], 0, false], [[[0, 0], [0, 3], [2, 3]], 0, false], [[[0, 0], [2, 0], [4, 3], [0, 3]], 0, false], [[[0, 0], [3, 0], [3, 2], [1, 2], [1, 3], [0, 3]], 0, false],
    [[[0, 0], [2, 0], [3, 2], [3, 3], [0, 3]], 0, false], [[[0, 0], [1, 0], [1, 3], [3, 3], [3, 4], [0, 4]], 0, false], [[[0, 0], [1, 0], [3, 1], [1, 2], [1, 3], [0, 3]], 0, false]
  ].map(([pts, axes, turn]) => {
    const segs = sidesOf(pts), k = kindOf(segs);
    if (k.axes !== axes || k.turn !== turn) throw new Error('도형 감의 대칭 갈래가 생각과 다르다: ' + JSON.stringify(pts));
    if (looksFoldable(segs, 0.45) || looksTurnable(segs, 0.45)) throw new Error('거의 대칭으로 보이는 도형: ' + JSON.stringify(pts) + ' ' + foldGap(segs).toFixed(2) + ' ' + turnGap(segs).toFixed(2));
    return { pts, axes, turn, line: axes > 0 };
  });
  const from = (d, test, count, avoid) => { const list = d.shuffle(POOL.filter((s) => test(s) && !(avoid || []).includes(s))).slice(0, count); if (list.length < count) throw new Error('도형 감이 모자란다'); return list; };
  const LINE_ONLY = (s) => s.line && !s.turn, TURN_ONLY = (s) => !s.line && s.turn, BOTH = (s) => s.line && s.turn, NEITHER = (s) => !s.line && !s.turn;

  // 정다각형(모눈 밖): 한 변이 아래에 가로로 놓인다. 가운데는 [0, 0], 반지름 r.
  const regular = (n, r) => Array.from({ length: n }, (_, i) => { const a = (90 + 180 / n + (i * 360) / n) * RAD; return [r * Math.cos(a), r * Math.sin(a)]; });
  const REG_NAME = { 3: '정삼각형', 4: '정사각형', 5: '정오각형', 6: '정육각형', 8: '정팔각형' };
  for (const n of [3, 4, 5, 6, 8]) if (kindOfPoly(regular(n, 1.8)).axes !== n || kindOfPoly(regular(n, 1.8)).turn !== (n % 2 === 0)) throw new Error('정다각형의 대칭 판정이 생각과 다르다');

  // ── 글자 카드(선분으로 그린 글자)와 디지털 숫자 ────────────────
  // 틀은 가로 3, 세로 4(정사각형이 아니어서 비스듬한 대칭축이 생기지 않는다). 획 하나가 선분 하나다.
  const LETTERS = {
    A: [[[0, 4], [1.5, 0]], [[1.5, 0], [3, 4]], [[0.75, 2], [2.25, 2]]], C: [[[3, 0], [0, 0]], [[0, 0], [0, 4]], [[0, 4], [3, 4]]],
    E: [[[0, 0], [0, 4]], [[0, 0], [3, 0]], [[0, 2], [2.3, 2]], [[0, 4], [3, 4]]], F: [[[0, 0], [0, 4]], [[0, 0], [3, 0]], [[0, 2], [2.3, 2]]],
    H: [[[0, 0], [0, 4]], [[3, 0], [3, 4]], [[0, 2], [3, 2]]], I: [[[1.5, 0], [1.5, 4]], [[0.4, 0], [2.6, 0]], [[0.4, 4], [2.6, 4]]],
    K: [[[0, 0], [0, 4]], [[0, 2], [3, 0]], [[0, 2], [3, 4]]], L: [[[0, 0], [0, 4]], [[0, 4], [3, 4]]],
    M: [[[0, 4], [0, 0]], [[0, 0], [1.5, 2.2]], [[1.5, 2.2], [3, 0]], [[3, 0], [3, 4]]], N: [[[0, 4], [0, 0]], [[0, 0], [3, 4]], [[3, 4], [3, 0]]],
    S: [[[3, 0], [0, 0]], [[0, 0], [0, 2]], [[0, 2], [3, 2]], [[3, 2], [3, 4]], [[3, 4], [0, 4]]], T: [[[0, 0], [3, 0]], [[1.5, 0], [1.5, 4]]],
    U: [[[0, 0], [0, 4]], [[0, 4], [3, 4]], [[3, 4], [3, 0]]], V: [[[0, 0], [1.5, 4]], [[1.5, 4], [3, 0]]],
    X: [[[0, 0], [3, 4]], [[3, 0], [0, 4]]], Y: [[[0, 0], [1.5, 2]], [[3, 0], [1.5, 2]], [[1.5, 2], [1.5, 4]]], Z: [[[0, 0], [3, 0]], [[3, 0], [0, 4]], [[0, 4], [3, 4]]]
  };
  const JAMO = {
    ㄱ: [[[0, 0], [3, 0]], [[3, 0], [3, 4]]], ㄴ: [[[0, 0], [0, 4]], [[0, 4], [3, 4]]], ㄷ: [[[0, 0], [3, 0]], [[0, 0], [0, 4]], [[0, 4], [3, 4]]],
    ㄹ: [[[0, 0], [3, 0]], [[3, 0], [3, 2]], [[3, 2], [0, 2]], [[0, 2], [0, 4]], [[0, 4], [3, 4]]], ㅁ: [[[0, 0], [3, 0]], [[3, 0], [3, 4]], [[3, 4], [0, 4]], [[0, 4], [0, 0]]],
    ㅂ: [[[0, 0], [0, 4]], [[3, 0], [3, 4]], [[0, 2], [3, 2]], [[0, 4], [3, 4]]], ㅅ: [[[1.5, 0], [0, 4]], [[1.5, 0], [3, 4]]],
    ㅋ: [[[0, 0], [3, 0]], [[3, 0], [3, 4]], [[0, 2], [3, 2]]], ㅌ: [[[0, 0], [3, 0]], [[0, 2], [3, 2]], [[0, 4], [3, 4]], [[0, 0], [0, 4]]],
    ㅍ: [[[0, 0], [3, 0]], [[0, 4], [3, 4]], [[1, 0], [1, 4]], [[2, 0], [2, 4]]]
  };
  // 글자의 갈래를 획의 좌표로 가린다. 손으로 적은 표(선대칭, 점대칭)와 어긋나면 멈춘다.
  const glyphKind = (segs) => { const k = kindOf(segs); if (looksFoldable(segs, 0.45) || looksTurnable(segs, 0.45)) throw new Error('거의 대칭으로 보이는 글자'); return { axes: k.axes, turn: k.turn, line: k.axes > 0 }; };
  const LETTER_KIND = {}, JAMO_KIND = {};
  Object.keys(LETTERS).forEach((ch) => { LETTER_KIND[ch] = glyphKind(LETTERS[ch]); });
  Object.keys(JAMO).forEach((ch) => { JAMO_KIND[ch] = glyphKind(JAMO[ch]); });
  const kindText = (table) => Object.keys(table).map((ch) => ch + table[ch].axes + (table[ch].turn ? 'o' : 'x')).join(' ');
  if (kindText(LETTER_KIND) !== 'A1x C1x E1x F0x H2o I2o K1x L0x M1x N0o S0o T1x U1x V1x X2o Y1x Z0o') throw new Error('알파벳 카드의 대칭 갈래가 생각과 다르다: ' + kindText(LETTER_KIND));
  if (kindText(JAMO_KIND) !== 'ㄱ0x ㄴ0x ㄷ1x ㄹ0o ㅁ2o ㅂ1x ㅅ1x ㅋ0x ㅌ1x ㅍ2o') throw new Error('자음 카드의 대칭 갈래가 생각과 다르다: ' + kindText(JAMO_KIND));
  // 글자 카드: 테두리 안에 굵은 획으로 그린다. extra: 덧그릴 것(대칭축 따위, 틀 좌표)
  function strokeCard(segs, o) {
    const opt = o || {}, w = opt.w || 3, h = opt.h || 4, pad = 0.6, at = ([x, y]) => [x + pad, y + pad];
    const bold = (p, q) => restyle(G.line(at(p), at(q)), 'stroke-width:3.4');
    const frame = paint(G.polygon([[0, 0], [w + pad * 2, 0], [w + pad * 2, h + pad * 2], [0, h + pad * 2]]), 'fill:#fff;stroke:#94a3b8;stroke-width:1.2');
    return G.board(w + pad * 2, h + pad * 2, [frame].concat(segs.map(([p, q]) => bold(p, q)), opt.extra ? opt.extra(at) : []), { grid: false, scale: opt.scale || 0.62, label: opt.label || '선분으로 그린 글자 카드' });
  }
  const letterTiles = (table, list, tags) => tiles(list.map((ch) => strokeCard(table[ch])), tags);
  // 디지털 숫자의 획을 선분으로(칸의 가로 1, 세로 2). 숫자 하나를 도형으로 보고 대칭을 가린다.
  const SEG_AT = { a: [[0, 0], [1, 0]], b: [[1, 0], [1, 1]], c: [[1, 1], [1, 2]], d: [[0, 2], [1, 2]], e: [[0, 1], [0, 2]], f: [[0, 0], [0, 1]], g: [[0, 1], [1, 1]] };
  const DIGITS = [0, 2, 3, 4, 5, 6, 7, 8, 9];
  const DIGIT_KIND = {};
  DIGITS.forEach((n) => {
    const lit = G.SEGMENTS[n], k = kindOf(lit.split('').map((s) => SEG_AT[s]));
    // 엔진의 획 셈(옆으로 뒤집기·위아래로 뒤집기·반 바퀴 돌리기)과도 맞춰 본다.
    const folds = (G.segMove(lit, 'side') === lit ? 1 : 0) + (G.segMove(lit, 'updown') === lit ? 1 : 0);
    if (k.axes !== folds || k.turn !== (G.segMove(lit, 'half') === lit)) throw new Error('디지털 숫자의 대칭 판정이 어긋난다: ' + n);
    DIGIT_KIND[n] = { axes: k.axes, turn: k.turn, line: k.axes > 0 };
  });
  const digitCard = (n, scale) => G.segDigits(String(n), { scale: scale || 0.92, label: '디지털 숫자 카드 ' + n });
  const plainRow = (list) => '<div class="mb-tiles">' + list.join('') + '</div>';

  // 5-2-3b.js, 5-2-3c.js 가 같은 도구를 쓴다(이 파일이 먼저 불린다).
  B.kit.sym523 = { TAGS, MARKS, JA, RAD, cm, calc, sub, dot, cross, len2, dist, mid, mean, unitV, area2, insidePoly, TOL, samePt, tidy, sidesOf, sameFig, mirror, halfTurn, endsOf, onLine, isAxis, axesOf, centerOf, isHalfTurn,
    slideFit, flipFit, congruent, foldGap, turnGap, looksFoldable, looksTurnable, kindOf, kindOfPoly, moveOf, toCorner, image, scaled, spanOf, samePlace, setOptions, setItem, oneItem, say, truthItem, pickWord, tagList,
    FILL, paint, gp, restyle, cutLine, axisLine, thinLine, centreDot, halo, mark, onGrid, tiles, gridTiles, LEN, halfOf, Sheet, joinSheets, boardScale, around, canon, sizeTo, triBySides, quadBySides, quadByAngles, anglesOf, convex,
    pairFig, sideName, angleName, shapeWord, told, inOrder, TRI_SIDES, TRI_ANGLES, QUAD_ANGLES, measured, whole, sidedTri, sidedQuad, angledTri, angledQuad, labelled, drawn, nameSpot, flipX, FIT, LOPS, SIZED, eightOf, someImages, anyImage, PAPER, cutBy, halvesFit, CUTS, cutTile, allFit, POOL, from, LINE_ONLY, TURN_ONLY, BOTH, NEITHER, regular, REG_NAME,
    LETTERS, JAMO, LETTER_KIND, JAMO_KIND, strokeCard, letterTiles, SEG_AT, DIGITS, DIGIT_KIND, digitCard, plainRow };

  B.addUnit({
    id: '5-2-3', grade: 5, semester: 2, no: 3, title: '합동과 대칭', version: 1,
    groups: [
      { id: 'cong', title: '도형의 합동', standard: CONG, types: [] },
      { id: 'match', title: '합동인 도형의 성질', standard: CONG, types: [] },
      { id: 'line', title: '선대칭도형과 대칭축', standard: SYM, types: [] },
      { id: 'lsym', title: '선대칭도형의 성질과 그리기', standard: SYM, types: [] },
      { id: 'point', title: '점대칭도형과 대칭의 중심', standard: SYM, types: [] },
      { id: 'psym', title: '점대칭도형의 성질과 그리기', standard: SYM, types: [] },
      { id: 'both', title: '선대칭도형과 점대칭도형', standard: SYM, types: [] }
    ]
  });

  // ── 도형의 합동 ──────────────────────────────────────────────
  B.addTypes('5-2-3', 'cong', [
    T('cong-word', '합동의 뜻', '①1 ②1 ③1 심1', (d, n) => (n === 0
      ? pickWord(d, '모양과 크기가 같아서 포개었을 때 완전히 겹치는 두 도형을 서로 무엇이라고 하는가?', '합동', ['대칭', '대응', '평행'], '모양과 크기가 같아서 포개었을 때 완전히 겹치는 두 도형을 서로 합동이라고 한다.')
      : truthItem(d, '색종이 두 장을 포개어 놓고 한꺼번에 오려서 도형 두 개를 만들었다. 두 도형에 대한 설명으로 옳은 것은?', [['모양과 크기가 모두 같다.', true], ['모양은 같고 크기는 다르다.', false], ['크기는 같고 모양은 다르다.', false], ['모양과 크기가 모두 다르다.', false]], true,
        { explain: '포개어 놓고 함께 오린 두 도형은 다시 포개었을 때 완전히 겹친다. 모양과 크기가 모두 같으므로 두 도형은 서로 합동이다.' })), { count: 2 }),
    T('cong-pick', '주어진 도형과 합동인 도형', '①3 ②2 ③2 심2', (d) => {
      // 정답은 돌리거나 뒤집어 놓는다. 오답은 모양은 비슷하지만 변의 길이가 모눈 한 칸씩 다른 도형 셋이다.
      const lop = d.pick(LOPS), shown = anyImage(d, lop.base), [want] = someImages(d, lop.base, 1, [shown]);
      const list = d.shuffle([want].concat(lop.alike.map((p) => anyImage(d, p)))), flags = list.map((p) => congruent(shown, p)), at = flags.indexOf(true);
      return oneItem('주어진 도형과 서로 합동인 도형은?', TAGS.slice(0, 4), flags, {
        figure: G.tiles([['주어진 도형', onGrid(shown)]]) + gridTiles(list), again: { kind: 'congruent', base: shown, polys: list, flags },
        explain: `모양과 크기가 같아서 포개었을 때 완전히 겹치는 도형을 찾는다. ${TAGS[at]}는 주어진 도형을 ${slideFit(shown, list[at]) ? '돌리면' : '뒤집으면'} 완전히 겹친다. 나머지는 변의 길이가 달라서 겹치지 않는다.`
      });
    }),
    T('cong-why', '모양은 같고 크기가 다른 두 도형', '①2·6 ②11 ③7·8 심5', (d) => {
      const small = anyImage(d, d.pick(SIZED)), big = scaled(small, 2);
      if (congruent(small, big)) throw new Error('크기가 다른 두 도형이 합동이다');
      return truthItem(d, '두 도형 가와 나에 대한 설명으로 옳은 것은?', [['모양은 같지만 크기가 달라서 서로 합동이 아니다.', true], ['모양이 같으므로 서로 합동이다.', false], ['변의 수가 같으므로 서로 합동이다.', false], ['포개었을 때 완전히 겹치므로 서로 합동이다.', false]], true, {
        figure: gridTiles(d.bool() ? [small, big] : [big, small]),
        explain: '두 도형은 모양이 같지만 변의 길이가 서로 다르다. 포개었을 때 완전히 겹치지 않으므로 서로 합동이 아니다. 합동인 두 도형은 모양과 크기가 모두 같다.'
      });
    }),
    T('cong-pairs', '여러 도형에서 합동인 짝 찾기', '①4 ②3 ③3 심2', (d, n) => {
      // 도형 여섯 개: 서로 합동인 짝 둘(또는 셋)과, 모양은 비슷하지만 한 칸이 다른 도형. 생각한 짝 말고는 합동인 것이 없어야 한다(다른 갈래의 도형끼리 우연히 합동이 되면 다시 고른다).
      const pairCount = (list) => list.reduce((sum, a, i) => sum + list.filter((b, j) => i < j && congruent(a, b)).length, 0);
      if (n === 1) {
        // 몇 쌍인지 세기: 합동인 짝이 둘 또는 셋이다.
        const three = d.bool(), list = d.until(() => { const [x, y, z] = d.shuffle(LOPS).slice(0, 3); return d.shuffle(someImages(d, x.base, 2).concat(someImages(d, y.base, 2), three ? someImages(d, z.base, 2) : [anyImage(d, d.pick(x.alike)), anyImage(d, d.pick(y.alike))])); }, (made) => pairCount(made) === (three ? 3 : 2));
        const pairs = [], hits = [];
        list.forEach((a, i) => list.forEach((b, j) => { if (i < j) { pairs.push(congruent(a, b)); if (congruent(a, b)) hits.push(`${TAGS[i]}와 ${TAGS[j]}`); } }));
        return N('도형 가~바 가운데 서로 합동인 도형은 모두 몇 쌍인가?', hits.length, {
          unit: '쌍', figure: gridTiles(list), explain: `돌리거나 뒤집어서 포개었을 때 완전히 겹치는 도형끼리 짝을 짓는다. ${hits.join(', ')}가 서로 합동이므로 모두 ${hits.length}쌍이다.`, facts: { count: pairs }
        });
      }
      // 짝을 바르게 지은 것 고르기. 오답: 모양은 비슷하지만 한 칸이 다른 도형과 짝을 지은 것
      const shapes = d.until(() => { const [x, y] = d.shuffle(LOPS).slice(0, 2), xs = someImages(d, x.base, 2), ys = someImages(d, y.base, 2); return { x1: xs[0], x2: xs[1], y1: ys[0], y2: ys[1], xa: anyImage(d, d.pick(x.alike)), ya: anyImage(d, d.pick(y.alike)) }; }, (made) => pairCount(Object.keys(made).map((key) => made[key])) === 2);
      const order = d.shuffle(Object.keys(shapes));
      const tag = (key) => TAGS[order.indexOf(key)], pairText = ([a, b]) => [tag(a), tag(b)].sort().join('와 '), optionOf = (pairs) => pairs.map(pairText).sort().join(', ');
      const rows = [[['x1', 'x2'], ['y1', 'y2']], [['x1', 'xa'], ['y1', 'y2']], [['x1', 'x2'], ['y1', 'ya']], [['x2', 'xa'], ['y2', 'ya']]].map((pairs) => [optionOf(pairs), pairs.every(([a, b]) => congruent(shapes[a], shapes[b]))]);
      return truthItem(d, '서로 합동인 도형끼리 바르게 짝 지은 것은?', rows, true, {
        figure: gridTiles(order.map((key) => shapes[key])),
        explain: `돌리거나 뒤집어서 포개었을 때 완전히 겹치는 도형끼리 짝을 짓는다. ${rows[0][0]}가 서로 합동이다. 모양이 비슷해도 변의 길이가 다르면 합동이 아니다.`
      });
    }, { count: 2 }),
    T('cong-odd', '나머지와 합동이 아닌 도형', '②4 심2', (d) => {
      const lop = d.pick(LOPS), list = d.shuffle(someImages(d, lop.base, 3).concat([anyImage(d, d.pick(lop.alike))]));
      const flags = list.map((p) => !list.some((q) => q !== p && congruent(p, q))), at = flags.indexOf(true);
      return oneItem('나머지 셋과 서로 합동이 아닌 도형은?', TAGS.slice(0, 4), flags, {
        figure: gridTiles(list), explain: `${TAGS.slice(0, 4).filter((_, i) => i !== at).join(', ')}는 돌리거나 뒤집어서 포개면 완전히 겹친다. ${TAGS[at]}는 변의 길이가 달라서 나머지 도형과 겹치지 않는다.`
      });
    }),
    T('cong-paper', '색종이 조각에서 합동 찾기', '①5 ③4 심2', (d) => {
      // 색깔이 같아도 크기가 다르면 합동이 아니고, 색깔이 달라도 돌리거나 뒤집어서 겹치면 합동이다.
      const [x, y] = d.shuffle(LOPS).slice(0, 2), colors = d.shuffle(PAPER), shown = anyImage(d, x.base), same = someImages(d, x.base, 2, [shown]), [a1, a2] = d.shuffle(x.alike);
      const rows = d.shuffle([[same[0], colors[1]], [same[1], colors[2]], [anyImage(d, a1), colors[0]], [anyImage(d, a2), colors[3]], [anyImage(d, y.base), colors[1]]]);
      const labels = TAGS.slice(1, 6), flags = rows.map(([p]) => congruent(shown, p)), paper = (p, fill) => onGrid(p, { fill, label: '모눈종이 위에 놓은 색종이 조각' });
      return setItem(d, '색종이를 오려 만든 조각이다. 색깔은 생각하지 않을 때, 조각 가와 서로 합동인 조각을 모두 고른 것은?', labels, flags, {
        figure: tiles([paper(shown, colors[0])].concat(rows.map(([p, fill]) => paper(p, fill)))), again: { kind: 'congruent', base: shown, polys: rows.map((r) => r[0]), flags },
        explain: `색깔이 달라도 모양과 크기가 같아서 포개었을 때 완전히 겹치면 합동이다. 가를 돌리거나 뒤집어서 완전히 겹치는 조각은 ${tagList(labels, flags)}이다. 색깔이 같아도 변의 길이가 다르면 합동이 아니다.`
      });
    }),
    T('cong-stamp', '무늬를 찍은 도장', '③6 심3', (d) => {
      // 도장에 새긴 모양은 찍힌 모양을 뒤집은 것이다(뒤집어도 합동이다). 오답: 모양은 비슷하지만 한 칸이 다른 도장 셋
      const lop = d.pick(LOPS), motif = d.until(() => anyImage(d, lop.base), (p) => spanOf(p)[0] <= 3), [w, h] = spanOf(motif), cols = w * 3 + 4, rows = h + 2;
      const strip = G.board(cols, rows, [0, 1, 2].map((k) => gp(motif.map(([x, y]) => [x + 1 + k * (w + 1), y + 1]))), { grid: 'lines', scale: Math.min(1, FIT / (32 + cols * 22)), label: '같은 모양을 세 번 찍은 무늬' });
      const list = d.shuffle([toCorner(flipX(motif))].concat(lop.alike.map((p) => anyImage(d, p)))), flags = list.map((p) => congruent(motif, p)), at = flags.indexOf(true);
      return oneItem('모양 도장 하나를 여러 번 찍어 무늬를 만들었다. 찍힌 모양과 도장에 새긴 모양은 서로 합동이다. 이 무늬를 만든 도장에 새긴 모양은?', TAGS.slice(0, 4), flags, {
        figure: strip + gridTiles(list), again: { kind: 'congruent', base: motif, polys: list, flags },
        explain: `찍힌 모양과 변의 길이가 모두 같은 도장을 찾는다. ${TAGS[at]}는 뒤집어서 포개면 찍힌 모양과 완전히 겹치므로 합동이다. 나머지는 변의 길이가 달라서 겹치지 않는다.`
      });
    }),
    T('cong-cut', '잘랐을 때 두 조각이 합동인 도형', '①7 ②5 ③5 심4', (d, n) => {
      const fits = d.shuffle(CUTS.filter((c) => c.fit)), rest = d.shuffle(CUTS.filter((c) => !c.fit));
      if (n === 1) {
        const list = d.shuffle(fits.slice(0, 3).concat(rest.slice(0, 1))), flags = list.map((c) => !halvesFit(c.pts, c.p, c.q)), at = flags.indexOf(true);
        return oneItem('점선을 따라 잘랐을 때 만들어지는 두 도형이 서로 합동이 아닌 것은?', TAGS.slice(0, 4), flags, {
          figure: tiles(list.map(cutTile)), explain: `자른 두 조각을 돌리거나 뒤집어서 포개어 본다. ${TAGS[at]}의 두 조각은 모양이나 크기가 달라서 완전히 겹치지 않는다.`
        });
      }
      const k = d.int(2, 3), list = d.shuffle(fits.slice(0, k).concat(rest.slice(0, 4 - k))), labels = TAGS.slice(0, 4), flags = list.map((c) => halvesFit(c.pts, c.p, c.q));
      return setItem(d, '점선을 따라 잘랐을 때 만들어지는 두 도형이 서로 합동인 것을 모두 고른 것은?', labels, flags, {
        figure: tiles(list.map(cutTile)), explain: `자른 두 조각을 돌리거나 뒤집어서 포개었을 때 완전히 겹치는 것을 찾는다. 그런 도형은 ${tagList(labels, flags)}이다.`
      });
    }, { count: 2 }),
    T('cong-cut-line', '합동이 되게 자르는 점선', '①7 ②6 심4', (d) => {
      const shape = d.pick(LINED), lines = d.until(() => d.shuffle(shape.lines).slice(0, 4), (list) => list.some(([p, q]) => halvesFit(shape.pts, p, q)) && !list.every(([p, q]) => halvesFit(shape.pts, p, q)));
      const labels = TAGS.slice(0, 4), flags = lines.map(([p, q]) => halvesFit(shape.pts, p, q)), at = ([x, y]) => [x + 1, y + 1];
      const parts = [gp(shape.pts.map(at))].concat(lines.map(([p, q], i) => cutLine(at(p), at(q)) + G.text(G.beyond(at(q), at(p), 0.5), TAGS[i])));
      return setItem(d, `${shape.word}에 점선 가, 나, 다, 라를 그었다. 점선 하나를 따라 잘랐을 때 만들어지는 두 도형이 서로 합동이 되는 점선을 모두 고른 것은?`, labels, flags, {
        figure: G.board(10, 6, parts, { grid: 'lines', scale: 1.12, label: `모눈종이 위의 ${shape.word}에 점선 가, 나, 다, 라가 그어져 있다.` }),
        explain: `점선마다 잘린 두 조각을 돌리거나 뒤집어서 포개어 본다. 두 조각이 완전히 겹치는 점선은 ${tagList(labels, flags)}이다.`
      });
    }),
    T('cong-cut-all', '잘랐을 때 조각이 모두 합동인 도형', '①8·9·10 ②9 심62', (d, n) => {
      if (n === 1) {
        // 정삼각형을 세 조각으로: 넓이가 같아도 모양이 다르면 합동이 아니다(꼭짓점에서 밑변을 셋으로 나눈 점까지 자른 것).
        const list = d.shuffle(TRI3), labels = TAGS.slice(0, 4), flags = list.map((m) => allFit(m.pieces));
        return setItem(d, '정삼각형을 점선을 따라 잘라 세 조각으로 나누었다. 세 조각이 모두 서로 합동인 것을 모두 고른 것은?', labels, flags, {
          figure: tiles(list.map(plainTile)), explain: `세 조각을 돌려서 포개었을 때 모두 완전히 겹치는 것을 찾는다. 그런 것은 ${tagList(labels, flags)}이다. 나머지는 조각의 모양이 서로 다르다.`
        });
      }
      const list = d.shuffle(d.shuffle(MANY.filter((m) => m.fit)).slice(0, 1).concat(d.shuffle(MANY.filter((m) => !m.fit)).slice(0, 3))), flags = list.map((m) => allFit(m.pieces)), at = flags.indexOf(true);
      return oneItem('도형을 점선을 따라 모두 잘랐을 때, 만들어지는 조각이 모두 서로 합동인 것은?', TAGS.slice(0, 4), flags, {
        figure: tiles(list.map(manyTile)), explain: `조각을 돌리거나 뒤집어서 포개었을 때 모두 완전히 겹치는 것은 ${TAGS[at]}이다. 나머지는 마주 보는 조각끼리만 합동이거나 조각의 크기가 서로 다르다.`
      });
    }, { count: 2 }),
    T('cong-pieces', '여러 조각으로 자른 종이에서 합동인 조각', '②7 심4', (d) => {
      // 오답: 모양은 비슷하지만 변의 길이가 다른 조각끼리 짝 지은 것(폭이 다른 직각삼각형, 크기가 다른 직사각형)
      const cut = d.pick(DISSECT), n = cut.pieces.length, pairs = [];
      for (let i = 0; i < n; i += 1) for (let j = i + 1; j < n; j += 1) pairs.push([`${TAGS[i]}와 ${TAGS[j]}`, congruent(cut.pieces[i], cut.pieces[j])]);
      const rows = d.shuffle(pairs.filter((r) => r[1])).slice(0, 1).concat(d.shuffle(pairs.filter((r) => !r[1])).slice(0, 3)), scale = Math.min(1.15, FIT / (32 + cut.cols * 22));
      return truthItem(d, '직사각형 모양의 종이를 선을 따라 잘라 여러 조각으로 나누었다. 서로 합동인 조각끼리 짝 지은 것은?', rows, true, {
        figure: G.board(cut.cols, cut.rows, cut.pieces.map((p) => gp(p)).concat(cut.pieces.map((p, i) => halo(G.text(mean(p), TAGS[i])))), { grid: 'lines', scale, label: `모눈종이 위의 직사각형을 조각 ${TAGS.slice(0, n).join(', ')}로 나눈 그림` }),
        explain: `조각을 돌리거나 뒤집어서 포개었을 때 완전히 겹치는 것끼리 짝을 짓는다. 서로 합동인 조각은 ${pairs.filter((r) => r[1]).map((r) => r[0]).join(', ')}이다. 모양이 비슷해도 변의 길이가 다르면 합동이 아니다.`
      });
    }),
    T('cong-draw', '합동인 삼각형의 나머지 꼭짓점', '①11 ②8 ③9 심61', (d) => {
      // 그리기를 고르기로: 한 변이 정해졌을 때 나머지 꼭짓점의 자리. 오답은 한두 칸 어긋난 점들이다.
      const cols = 10, rows = 6, key = (p) => p.join(',');
      const made = d.until(() => {
        // 삼각형 ㄱㄴㄷ: 변 ㄱㄴ은 세로로 놓인다(점 ㄷ은 왼쪽이나 오른쪽). 둘째 삼각형은 90° 돌려 놓으므로 선분 ㄹㅁ은 가로로 놓인다.
        const [len, x, y] = d.pick([[3, 2, 3], [4, 2, 4], [3, 1, 3], [4, 3, 4], [3, 2, 2], [4, 2, 1], [4, 1, 4]]), left = d.bool(), A = [[left ? x : 0, 0], [left ? x : 0, len], [left ? 0 : x, y]].map(([u, v]) => [u + 1, v + 1]);
        const moved = toCorner(A.map(moveOf(d.pick([1, 3]), d.bool()))), [w, h] = spanOf(moved), dx = d.int(6, cols - w), dy = d.int(0, rows - h), Bm = moved.map(([u, v]) => [u + dx, v + dy]);
        const near = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1], [2, 0], [-2, 0], [2, 1], [-2, 1], [2, -1], [-2, -1]].map(([u, v]) => [Bm[2][0] + u, Bm[2][1] + v]);
        const wrong = d.shuffle(near.filter((c) => c[0] >= 6 && c[0] <= cols && c[1] >= 0 && c[1] <= rows && key(c) !== key(Bm[0]) && key(c) !== key(Bm[1]) && Math.abs(cross(sub(Bm[1], Bm[0]), sub(c, Bm[0]))) >= 2 && !congruent(A, [Bm[0], Bm[1], c]))).slice(0, 3);
        return { A, Bm, wrong };
      }, (m) => m.wrong.length === 3 && [m.Bm[2]].concat(m.wrong).every((p, i, all) => all.every((q, j) => i === j || dist(p, q) > 1.2)));
      const { A, Bm } = made, cands = d.shuffle([Bm[2]].concat(made.wrong)), flags = cands.map((c) => congruent(A, [Bm[0], Bm[1], c])), at = flags.indexOf(true);
      // 선분 ㄹㅁ의 이름은 보기 점들의 반대쪽에 적는다.
      const away = unitV(sub(mid(Bm[0], Bm[1]), Bm[2])), nameAt = (p) => [p[0] + away[0] * 0.5, p[1] + away[1] * 0.5];
      const parts = [gp(A)].concat(A.map((_, i) => G.text(nameSpot(A, i, 0.45), JA[i])), [restyle(G.line(Bm[0], Bm[1]), 'stroke-width:2.4'), G.point(Bm[0]), G.point(Bm[1]), G.text(nameAt(Bm[0]), 'ㄹ'), G.text(nameAt(Bm[1]), 'ㅁ')], cands.map((c, i) => mark(c, TAGS[i])));
      return oneItem('모눈종이에 삼각형 ㄱㄴㄷ과 서로 합동인 삼각형을 그리려고 한다. 선분 ㄹㅁ을 한 변으로 할 때, 나머지 한 꼭짓점이 될 수 있는 점은?', TAGS.slice(0, 4), flags, {
        figure: G.board(cols, rows, parts, { grid: 'lines', scale: 1.12, label: '모눈종이 위의 삼각형 ㄱㄴㄷ과 선분 ㄹㅁ, 점 가, 나, 다, 라' }),
        explain: `선분 ㄹㅁ은 변 ㄱㄴ과 길이가 같다. 점 ${TAGS[at]}를 꼭짓점으로 하면 나머지 두 변의 길이도 삼각형 ㄱㄴㄷ의 두 변과 각각 같아져서, 돌리거나 뒤집어 포개었을 때 완전히 겹친다.`
      });
    }),
    T('cong-talk', '합동인 두 도형에 대한 설명', '①13 ③8', (d) => say(d, '서로 합동인 두 도형에 대한 설명으로 옳지 않은 것은?',
      ['두 도형의 모양이 같다.', '두 도형의 크기가 같다.', '두 도형의 넓이가 같다.', '두 도형의 변의 수가 같다.', '한 도형을 돌려서 포개었을 때 완전히 겹치면 두 도형은 합동이다.', '한 도형을 뒤집어서 포개었을 때 완전히 겹치면 두 도형은 합동이다.'],
      ['두 도형의 둘레가 서로 다르다.', '두 도형의 넓이가 서로 다르다.', '놓인 방향이 다르면 두 도형은 합동이 아니다.'], false,
      '합동인 두 도형은 포개었을 때 완전히 겹치므로 모양, 크기, 변의 수, 둘레, 넓이가 모두 같다. 놓인 방향이 달라도 돌리거나 뒤집어서 완전히 겹치면 합동이다.'))
  ]);

  // ── 합동인 도형의 성질 ────────────────────────────────────────
  // 둘째 도형은 첫 도형을 뒤집거나 돌려 놓는다. 도형은 대칭이 아닌 것만 써서 대응이 하나로 정해진다.
  B.addTypes('5-2-3', 'match', [
    T('match-word', '대응점·대응변·대응각의 뜻', '①15 ②1 ③10', (d) => {
      const [what, word] = d.pick([['점', '대응점'], ['변', '대응변'], ['각', '대응각']]);
      return pickWord(d, `서로 합동인 두 도형을 포개었을 때 완전히 겹치는 ${what}을 무엇이라고 하는가?`, word, ['대응점', '대응변', '대응각'].filter((w) => w !== word).concat(['대칭축']),
        '서로 합동인 두 도형을 포개었을 때 완전히 겹치는 점을 대응점, 겹치는 변을 대응변, 겹치는 각을 대응각이라고 한다.');
    }),
    T('match-find', '합동인 두 도형에서 대응점·대응변·대응각 찾기', '①16 ②13 ③12 심6', (d, n) => {
      if (n === 0) {
        // 대응점: 뒤집어 놓은 사각형
        const fig = drawn(d, () => labelled(sidedQuad(d), d.pick([0, 2]), true, {})), i = d.int(0, 3), names = inOrder(fig.nb);
        return oneItem(`${told(fig.na)}과 ${told(fig.nb)}은 서로 합동이다. 점 ${fig.na[i]}의 대응점은?`, names.map((x) => '점 ' + x), names.map((x) => x === fig.nb[i]), {
          figure: fig.figure, explain: `${told(fig.nb)}은 ${told(fig.na)}을 뒤집어 놓은 것이다. 두 사각형을 포개었을 때 점 ${fig.na[i]}과 겹치는 점은 점 ${fig.nb[i]}이다.`
        });
      }
      if (n === 1) {
        // 대응변: 돌려 놓은 삼각형
        const fig = drawn(d, () => labelled(sidedTri(d), d.pick([1, 2, 3]), false, {})), i = d.int(0, 2), sides = d.shuffle([0, 1, 2]);
        return oneItem(`${told(fig.na)}과 ${told(fig.nb)}은 서로 합동이다. ${sideName(fig.na, i)}의 대응변은?`, sides.map((j) => sideName(fig.nb, j)), sides.map((j) => j === i), {
          figure: fig.figure, explain: `${told(fig.nb)}은 ${told(fig.na)}을 돌려 놓은 것이다. 길이가 같은 변끼리 겹치도록 포개면 ${sideName(fig.na, i)}과 겹치는 변은 ${sideName(fig.nb, i)}이다.`
        });
      }
      // 대응각: 뒤집고 돌려 놓은 사각형
      const fig = drawn(d, () => labelled(sidedQuad(d), d.pick([1, 3]), true, {})), i = d.int(0, 3), corners = d.shuffle([0, 1, 2, 3]);
      return oneItem(`${told(fig.na)}과 ${told(fig.nb)}은 서로 합동이다. ${angleName(fig.na, i)}의 대응각은?`, corners.map((j) => angleName(fig.nb, j)), corners.map((j) => j === i), {
        figure: fig.figure, explain: `두 사각형을 포개었을 때 점 ${fig.na[i]}과 겹치는 점은 점 ${fig.nb[i]}이다. ${angleName(fig.na, i)}과 겹치는 각은 ${angleName(fig.nb, i)}이다.`
      });
    }, { count: 3 }),
    T('match-pairs', '대응점·대응변·대응각의 수', '①17 ②14 ③13 심7', (d) => {
      const k = d.pick([5, 6, 8]), what = d.pick(['대응점', '대응변', '대응각']);
      return N(`서로 합동인 두 ${shapeWord(k)}에는 ${what}이 모두 몇 쌍 있는가?`, k, {
        unit: '쌍', explain: `${shapeWord(k)}에는 꼭짓점, 변, 각이 각각 ${k}개씩 있다. 서로 합동인 두 ${shapeWord(k)}을 포개면 모두 겹치므로 대응점, 대응변, 대응각이 각각 ${k}쌍씩 있다.`, facts: calc(String(k), [k])
      });
    }),
    T('match-prop', '합동인 도형의 성질', '①18 ②17 ③11', (d) => say(d, '서로 합동인 두 도형의 성질로 옳은 것은?',
      ['각각의 대응변의 길이는 서로 같다.', '각각의 대응각의 크기는 서로 같다.'],
      ['대응변의 길이는 서로 같지만 대응각의 크기는 서로 다르다.', '포개었을 때 겹치는 점을 대응각이라고 한다.', '대응변은 한 쌍뿐이다.', '대응각의 크기는 서로 같지만 대응변의 길이는 서로 다르다.', '대응변끼리는 길이가 서로 다를 수도 있다.'], true,
      '서로 합동인 두 도형은 포개었을 때 완전히 겹친다. 그래서 각각의 대응변의 길이가 서로 같고, 각각의 대응각의 크기가 서로 같다.')),
    T('match-side', '대응변의 길이', '①19 ②15 ③14 심8', (d) => {
      // 뒤집어 놓은 사각형: 묻는 변의 대응변은 첫 도형에 적혀 있다. 둘째 도형에는 다른 변의 길이가 하나 적혀 있다.
      const order = d.shuffle([0, 1, 2, 3]), i = order[0], fig = drawn(d, () => labelled(sidedQuad(d), d.pick([0, 2]), true, { s1: order.slice(0, 3), s2: [order[3]] }));
      return N(`두 사각형은 서로 합동이다. ${sideName(fig.nb, i)}은 몇 cm인가?`, fig.len(i), {
        unit: 'cm', figure: fig.figure, explain: `${sideName(fig.nb, i)}의 대응변은 ${sideName(fig.na, i)}이다. 대응변의 길이는 서로 같으므로 ${sideName(fig.nb, i)}은 ${cm(fig.len(i))}이다.`, facts: calc(String(fig.len(i)))
      });
    }),
    T('match-angle', '대응각의 크기', '①20 ②15 ③15 심8', (d) => {
      // 돌려 놓은 삼각형: 첫 도형에 두 각의 크기가 적혀 있다.
      const order = d.shuffle([0, 1, 2]), i = order[0], fig = drawn(d, () => labelled(angledTri(d), d.pick([1, 2, 3]), d.bool(), { a1: order.slice(0, 2) }));
      return N(`두 삼각형은 서로 합동이다. ${angleName(fig.nb, i)}의 크기는 몇 도인가?`, fig.deg(i), {
        unit: '°', figure: fig.figure, explain: `${angleName(fig.nb, i)}의 대응각은 ${angleName(fig.na, i)}이다. 대응각의 크기는 서로 같으므로 ${angleName(fig.nb, i)}은 ${fig.deg(i)}°이다.`, facts: calc(String(fig.deg(i)))
      });
    }),
    T('match-both', '대응변의 길이와 대응각의 크기', '①20 ②15 ③16 심8', (d) => {
      // 사각형 하나에 변의 길이 둘과 각의 크기 셋을 적는다(길이를 적는 변은 길이가 자연수인 두 변).
      const made = d.until(() => {
        const m = angledQuad(d), sides = [0, 1, 2, 3].filter((i) => whole(m.sides[i])), corners = d.shuffle([0, 1, 2, 3]).slice(0, 3);
        return { sides, corners, fig: labelled(m, d.pick([1, 2, 3]), d.bool(), { s1: sides, a1: corners }) };
      }, (x) => !x.fig.clash);
      const { sides, corners, fig } = made, si = d.pick(sides), ai = corners[0];
      return M(`두 사각형은 서로 합동이다. ${sideName(fig.nb, si)}의 길이와 ${angleName(fig.nb, ai)}의 크기를 구하시오.`, [{ label: sideName(fig.nb, si), answer: fig.len(si), unit: 'cm' }, { label: angleName(fig.nb, ai), answer: fig.deg(ai), unit: '°' }], {
        figure: fig.figure,
        explain: `${sideName(fig.nb, si)}의 대응변은 ${sideName(fig.na, si)}이므로 ${cm(fig.len(si))}이고, ${angleName(fig.nb, ai)}의 대응각은 ${angleName(fig.na, ai)}이므로 ${fig.deg(ai)}°이다.`,
        facts: { calc: [[String(fig.len(si)), 0], [String(fig.deg(ai)), 1]] }
      });
    }),
    T('match-talk', '합동인 두 도형에 대한 설명 가려내기', '②16 심6', (d) => {
      // 두 변과 그 사이의 각을 적은 삼각형. 틀린 설명 하나: 대응점을 잘못 댄 것, 다른 변의 길이를 댄 것, 대응각이 아닌 각에 크기를 댄 것
      const made = d.until(() => {
        const [b, c] = d.shuffle([d.int(5, 8), d.int(10, 14)]), deg = d.pick([40, 50, 60, 70, 100, 110]), m = measured([[0, 0], [c, 0], G.toward([0, 0], b, deg)]);
        const v = m.angles.findIndex((x) => whole(x) && Math.round(x) === deg);
        return Object.assign(m, { deg, v, fig: v < 0 ? null : labelled(m, d.pick([1, 2, 3]), d.bool(), { s1: [(v + 2) % 3, v], a1: [v] }) });
      }, (m) => m.v >= 0 && !m.fig.clash && Math.abs(m.angles[(m.v + 1) % 3] - m.deg) >= 15 && m.sides.every((x, i) => m.sides.every((y, j) => i === j || Math.max(x, y) / Math.min(x, y) >= 1.18)));
      const v = made.v, s1 = (v + 2) % 3, s2 = v, o1 = (v + 1) % 3, fig = made.fig, bad = d.int(0, 3);
      const rows = [
        [`점 ${fig.na[o1]}의 대응점은 점 ${fig.nb[bad === 0 ? v : o1]}이다.`, bad !== 0],
        [`${sideName(fig.nb, s1)}의 길이는 ${cm(fig.len(bad === 1 ? s2 : s1))}이다.`, bad !== 1],
        [`${angleName(fig.nb, bad === 2 ? o1 : v)}의 크기는 ${fig.deg(v)}°이다.`, bad !== 2],
        [`${sideName(fig.na, s2)}의 대응변은 ${sideName(fig.nb, bad === 3 ? s1 : s2)}이다.`, bad !== 3]
      ];
      return truthItem(d, '두 삼각형은 서로 합동이다. 옳지 않은 설명은?', rows, false, {
        figure: fig.figure, explain: `두 삼각형을 포개면 점 ${fig.na.map((x, i) => `${x}과 점 ${fig.nb[i]}`).join(', 점 ')}이 각각 겹친다. 대응변의 길이와 대응각의 크기는 서로 같다. 틀린 설명을 바르게 고치면 「${[`점 ${fig.na[o1]}의 대응점은 점 ${fig.nb[o1]}이다.`, `${sideName(fig.nb, s1)}의 길이는 ${cm(fig.len(s1))}이다.`, `${angleName(fig.nb, v)}의 크기는 ${fig.deg(v)}°이다.`, `${sideName(fig.na, s2)}의 대응변은 ${sideName(fig.nb, s2)}이다.`][bad]}」이다.`
      });
    }),
    T('match-peri', '대응변으로 구하는 둘레', '①21 ②18 ③18 심9', (d) => {
      // 길이가 두 도형에 둘씩 나뉘어 적혀 있다.
      const order = d.shuffle([0, 1, 2, 3]), fig = drawn(d, () => labelled(sidedQuad(d), d.pick([0, 2]), true, { s1: order.slice(0, 2), s2: order.slice(2) })), lens = [0, 1, 2, 3].map(fig.len), total = lens.reduce((s, x) => s + x, 0);
      return N(`두 사각형은 서로 합동이다. ${told(fig.nb)}의 둘레는 몇 cm인가?`, total, {
        unit: 'cm', figure: fig.figure,
        explain: `대응변의 길이는 서로 같다. ${order.slice(0, 2).map((i) => `${sideName(fig.nb, i)}은 ${sideName(fig.na, i)}과 같은 ${cm(lens[i])}`).join(', ')}이다. 네 변의 길이를 더하면 ${lens.join(' + ')} = ${total}(cm)`, facts: calc(lens.join('+'))
      });
    }),
    T('match-peri-iso', '합동인 두 이등변삼각형의 둘레', '①22', (d) => {
      const fig = drawn(d, () => {
        const [x, y] = d.until(() => [d.int(8, 15), d.int(5, 14)], ([p, q]) => Math.abs(p - q) >= 3 && q <= p * 1.5 && q >= p * 0.5);
        return Object.assign(labelled(measured(triBySides(x, x, y)), d.pick([1, 3]), false, { s1: [0], s2: [1] }), { a: x, b: y });
      }), { a, b } = fig, total = a + a + b;
      return N(`삼각형 ㄱㄴㄷ은 변 ㄱㄴ과 변 ㄱㄷ의 길이가 같은 이등변삼각형이고, ${told(fig.nb)}은 삼각형 ㄱㄴㄷ과 서로 합동이다. 삼각형 ㄱㄴㄷ의 둘레는 몇 cm인가?`, total, {
        unit: 'cm', figure: fig.figure,
        explain: `변 ㄱㄷ은 변 ㄱㄴ과 길이가 같으므로 ${cm(a)}이다. 변 ㄴㄷ의 대응변은 ${sideName(fig.nb, 1)}이므로 ${cm(b)}이다. 둘레는 ${a} + ${a} + ${b} = ${total}(cm)`, facts: calc(`${a}+${a}+${b}`)
      });
    }),
    T('match-peri-back', '둘레를 알 때 남은 한 변', '①23 ②19 ③19 심36', (d) => {
      const order = d.shuffle([0, 1, 2]), fig = drawn(d, () => labelled(sidedTri(d), d.pick([1, 2, 3]), d.bool(), { s1: [order[0]], s2: [order[1]] })), lens = [0, 1, 2].map(fig.len), total = lens[0] + lens[1] + lens[2], ask = order[2];
      return N(`두 삼각형은 서로 합동이고, ${told(fig.na)}의 둘레는 ${cm(total)}이다. ${sideName(fig.na, ask)}은 몇 cm인가?`, lens[ask], {
        unit: 'cm', figure: fig.figure,
        explain: `${sideName(fig.na, order[1])}의 대응변은 ${sideName(fig.nb, order[1])}이므로 ${cm(lens[order[1]])}이다. 둘레에서 두 변의 길이를 빼면 ${total} − ${lens[order[0]]} − ${lens[order[1]]} = ${lens[ask]}(cm)`, facts: calc(`${total}-${lens[order[0]]}-${lens[order[1]]}`)
      });
    }),
    T('match-joined', '한 직선 위에 맞닿은 두 합동 삼각형', '①25 심34', (d) => {
      // 직각삼각형 ㄱㄴㄷ을 돌려 옮긴 것이 삼각형 ㄷㄹㅁ이다. 짧은 변과 긴 변이 한 직선 위에 엇갈려 놓인다.
      const [p, q] = d.until(() => d.shuffle([d.int(6, 12), d.int(13, 24)]), ([x, y]) => Math.max(x, y) / Math.min(x, y) >= 1.4 && Math.max(x, y) / Math.min(x, y) <= 2.4);
      const k = Math.min(8.6 / (p + q), 3.8 / Math.max(p, q)), at = (x, y) => [x * k, y * k], n2 = at(0, 0), n3 = at(p, 0), n4 = at(p + q, 0), n1 = at(0, -q), n5 = at(p + q, -p);
      const sheet = new Sheet().poly([n1, n2, n3]).poly([n3, n4, n5]).corner([n1, n2, n3], 1).corner([n3, n4, n5], 1)
        .text([n1[0] - 0.1, n1[1] - 0.42], 'ㄱ').text([n2[0] - 0.1, n2[1] + 0.45], 'ㄴ').text([n3[0], n3[1] + 0.45], 'ㄷ').text([n4[0] + 0.1, n4[1] + 0.45], 'ㄹ').text([n5[0] + 0.1, n5[1] - 0.42], 'ㅁ')
        .beside(n1, n2, cm(q), [n1[0] - 2, n1[1]]).beside(n4, n5, cm(p), [n4[0] + 2, n4[1]]);
      return N('삼각형 ㄱㄴㄷ과 삼각형 ㄷㄹㅁ은 서로 합동이고, 세 점 ㄴ, ㄷ, ㄹ은 한 직선 위에 있다. 선분 ㄴㄹ은 몇 cm인가?', p + q, {
        unit: 'cm', figure: sheet.svg(`한 직선 위에 맞닿아 놓인 직각삼각형 ㄱㄴㄷ과 직각삼각형 ㄷㄹㅁ. 변 ㄱㄴ ${cm(q)}, 변 ㄹㅁ ${cm(p)}. 각 ㄱㄴㄷ과 각 ㄷㄹㅁ은 직각이다.`),
        explain: `직각인 각끼리 대응각이다. 변 ㄴㄷ의 대응변은 변 ㄹㅁ이므로 ${cm(p)}이고, 변 ㄷㄹ의 대응변은 변 ㄱㄴ이므로 ${cm(q)}이다. 선분 ㄴㄹ은 ${p} + ${q} = ${p + q}(cm)`, facts: calc(`${p}+${q}`)
      });
    }),
    T('match-angle-sum', '대응각을 옮겨 남은 한 각 구하기', '①27 ②22 ③17 심47·48', (d, n) => {
      // 각도 셈은 한 번뿐이다: 대응각을 옮긴 뒤 세 각의 합(네 각의 합)에서 뺀다.
      if (n === 0) {
        const order = d.shuffle([0, 1, 2]), fig = drawn(d, () => labelled(angledTri(d), d.pick([1, 2, 3]), d.bool(), { a1: [order[0]], a2: [order[1]] })), [x, y, z] = order.map(fig.deg);
        return N(`서로 합동인 두 삼각형에서 ${angleName(fig.na, order[2])}은 몇 도인가?`, z, {
          unit: '°', figure: fig.figure,
          explain: `${angleName(fig.na, order[1])}의 대응각은 ${angleName(fig.nb, order[1])}이므로 ${y}°이다. 삼각형의 세 각의 크기의 합은 180°이므로 ${angleName(fig.na, order[2])}은 180° − ${x}° − ${y}° = ${z}°`, facts: calc(`180-${x}-${y}`, [180])
        });
      }
      const order = d.shuffle([0, 1, 2, 3]), fig = drawn(d, () => labelled(angledQuad(d), d.pick([0, 2]), true, { a1: order.slice(0, 2), a2: [order[2]] })), [w, x, y, z] = order.map(fig.deg);
      return N(`서로 합동인 두 사각형에서 ${angleName(fig.nb, order[3])}은 몇 도인가?`, z, {
        unit: '°', figure: fig.figure,
        explain: `대응각의 크기는 서로 같으므로 ${angleName(fig.nb, order[0])}은 ${w}°, ${angleName(fig.nb, order[1])}은 ${x}°이다. 사각형의 네 각의 크기의 합은 360°이므로 ${angleName(fig.nb, order[3])}은 360° − ${w}° − ${x}° − ${y}° = ${z}°`, facts: calc(`360-${w}-${x}-${y}`, [360])
      });
    }, { count: 2 })
  ]);

  // ── 선대칭도형과 대칭축 ───────────────────────────────────────
  // 직선을 하나 그은 도형(모눈 4×4칸 안): [도형, 직선이 지나는 두 점]. 그 직선이 대칭축인지는 좌표로 가린다.
  const DRAWN_AXES = [
    [[[1, 0], [2, 4], [0, 4]], [1, 0], [1, 4]], [[[0, 0], [4, 0], [4, 2], [0, 2]], [2, 0], [2, 2]], [[[0, 0], [4, 0], [4, 2], [0, 2]], [0, 1], [4, 1]],
    [[[2, 0], [4, 1], [2, 4], [0, 1]], [2, 0], [2, 4]], [[[1, 0], [3, 0], [4, 3], [0, 3]], [2, 0], [2, 3]], [[[2, 0], [4, 2], [2, 4], [0, 2]], [0, 2], [4, 2]],
    [[[0, 0], [4, 0], [4, 2], [0, 2]], [0, 0], [4, 2]], [[[1, 0], [4, 0], [3, 2], [0, 2]], [1, 0], [3, 2]], [[[1, 0], [4, 0], [3, 2], [0, 2]], [2, 0], [2, 2]],
    [[[2, 0], [4, 2], [0, 2]], [0, 2], [3, 1]], [[[1, 0], [3, 0], [4, 3], [0, 3]], [0.5, 1.5], [3.5, 1.5]], [[[0, 0], [0, 3], [2, 3]], [0, 3], [1, 1.5]]
  ].map(([pts, p, q]) => ({ pts, p, q, axis: isAxis(sidesOf(pts), p, q) }));
  if (DRAWN_AXES.map((a) => (a.axis ? 'o' : 'x')).join('') !== 'ooooooxxxxxx') throw new Error('직선을 그은 도형 감의 대칭축 판정이 생각과 다르다');
  // 도형 밖으로 조금 나가게 그은 대칭축
  const longAxis = (p, q, by) => axisLine(G.beyond(q, p, by == null ? 0.45 : by), G.beyond(p, q, by == null ? 0.45 : by));
  const axisTile = (a) => onGrid(a.pts, { extra: (m) => [longAxis(m(a.p), m(a.q))], label: '직선이 하나 그어진 도형' });
  // 직선이 넷 그어진 도형 하나(모눈 8×6칸)
  const AXIS_PICK = [
    { word: '직사각형', pts: [[1, 1], [7, 1], [7, 5], [1, 5]], lines: [[[4, 1], [4, 5]], [[1, 3], [7, 3]], [[1, 1], [7, 5]], [[7, 1], [1, 5]]] },
    { word: '마름모', pts: [[4, 1], [7, 3], [4, 5], [1, 3]], lines: [[[4, 1], [4, 5]], [[1, 3], [7, 3]], [[5.5, 2], [2.5, 4]], [[2.5, 2], [5.5, 4]]] },
    { word: '이등변삼각형', pts: [[4, 1], [7, 5], [1, 5]], lines: [[[4, 1], [4, 5]], [[1, 5], [5.5, 3]], [[7, 5], [2.5, 3]], [[2.5, 3], [5.5, 3]]] },
    { word: '사다리꼴', pts: [[2, 1], [6, 1], [7, 5], [1, 5]], lines: [[[4, 1], [4, 5]], [[1.5, 3], [6.5, 3]], [[2, 1], [7, 5]], [[6, 1], [1, 5]]] }
  ];
  // 모눈 밖의 도형 한 칸(정다각형, 원): 칸의 크기를 같게 맞춘다.
  const plainShape = (n, label) => { const sheet = new Sheet().grow([-2, -2]).grow([2, 2]); if (n) sheet.poly(regular(n, 1.8)); else sheet.circle([0, 0], 1.8); return sheet.svg(label || (n ? REG_NAME[n] : '원'), 0.9); };
  const axesText = (n) => (n === Infinity ? '셀 수 없이 많다' : n + '개');
  B.addTypes('5-2-3', 'line', [
    T('line-word', '선대칭도형과 대칭축의 뜻', '①31 ②27 ③23', (d, n) => (n === 0
      ? pickWord(d, '한 직선을 따라 접었을 때 완전히 겹치는 도형을 무엇이라고 하는가?', '선대칭도형', ['점대칭도형', '합동', '대칭축'], '한 직선을 따라 접었을 때 완전히 겹치는 도형을 선대칭도형이라 하고, 그 직선을 대칭축이라고 한다.')
      : pickWord(d, '선대칭도형을 접었을 때 완전히 겹치게 하는 직선을 무엇이라고 하는가?', '대칭축', ['대칭의 중심', '대응변', '수선'], '선대칭도형은 한 직선을 따라 접었을 때 완전히 겹친다. 이때 그 직선을 대칭축이라고 한다.')), { count: 2 }),
    T('line-find', '선대칭도형 찾기', '①32 ②28 ③24 심10', (d) => {
      // 선대칭이 아닌 것에는 점대칭뿐인 도형(평행사변형 따위)을 꼭 하나 넣는다.
      const lines = from(d, (s) => s.line, d.int(2, 3)), list = d.shuffle(lines.concat(from(d, TURN_ONLY, 1), from(d, NEITHER, 4 - lines.length))), labels = TAGS.slice(0, 5), flags = list.map((s) => kindOfPoly(s.pts).axes > 0);
      return setItem(d, '선대칭도형을 모두 고른 것은?', labels, flags, {
        figure: gridTiles(list.map((s) => s.pts)), again: { kind: 'line', polys: list.map((s) => s.pts), flags }, explain: `한 직선을 따라 접었을 때 완전히 겹치는 도형을 찾는다. 선대칭도형은 ${tagList(labels, flags)}이다. 나머지는 어느 직선으로 접어도 완전히 겹치지 않는다.`
      });
    }),
    T('line-axis-right', '대칭축을 바르게 그은 도형', '②28·32 ③26', (d) => {
      const list = d.shuffle(d.shuffle(DRAWN_AXES.filter((a) => a.axis)).slice(0, 1).concat(d.shuffle(DRAWN_AXES.filter((a) => !a.axis)).slice(0, 3))), flags = list.map((a) => isAxis(sidesOf(a.pts), a.p, a.q)), at = flags.indexOf(true);
      return oneItem('도형에 직선을 하나씩 그었다. 그은 직선이 그 도형의 대칭축인 것은?', TAGS.slice(0, 4), flags, {
        figure: tiles(list.map(axisTile)), explain: `그은 직선을 따라 접었을 때 완전히 겹치는 것을 찾는다. ${TAGS[at]}만 완전히 겹친다. 나머지는 직선을 따라 접으면 양쪽이 어긋난다.`
      });
    }),
    T('line-letter', '선대칭 모양인 글자', '①33 ②29 ③25 심29', (d) => {
      // 선분으로 그린 알파벳 카드. 선대칭이 아닌 것에는 점대칭뿐인 글자(N, S, Z)를 꼭 넣는다.
      const names = Object.keys(LETTERS), line = d.shuffle(names.filter((ch) => LETTER_KIND[ch].line)).slice(0, 3), turn = d.shuffle(names.filter((ch) => !LETTER_KIND[ch].line && LETTER_KIND[ch].turn)).slice(0, 2), none = d.shuffle(names.filter((ch) => !LETTER_KIND[ch].line && !LETTER_KIND[ch].turn)).slice(0, 1);
      const list = line.concat(turn, none).sort(), flags = list.map((ch) => kindOf(LETTERS[ch]).axes > 0);
      return setItem(d, '선분으로 그린 알파벳 카드이다. 선대칭도형 모양인 글자를 모두 고른 것은?', list, flags, {
        figure: letterTiles(LETTERS, list, list), explain: `한 직선을 따라 접었을 때 완전히 겹치는 글자를 찾는다. 대칭축이 세로로 놓이는 글자도 있고 가로로 놓이는 글자도 있다. 선대칭도형 모양인 글자는 ${tagList(list, flags)}이다.`
      });
    }),
    T('line-jamo-axes', '자음자의 대칭축 수', '②30 심29', (d) => {
      const names = Object.keys(JAMO), by = (n) => d.shuffle(names.filter((ch) => JAMO_KIND[ch].axes === n)), list = d.shuffle(by(1).slice(0, 2).concat(by(2).slice(0, 1), by(0).slice(0, 2))), flags = list.map((ch) => kindOf(JAMO[ch]).axes === 1);
      return setItem(d, '선분으로 그린 자음자 카드이다. 대칭축이 1개인 글자를 모두 고른 것은?', list, flags, {
        figure: letterTiles(JAMO, list, list), explain: `글자마다 접었을 때 완전히 겹치는 직선을 찾아 센다. ${list.map((ch) => `${ch}은 ${kindOf(JAMO[ch]).axes}개`).join(', ')}이다. 대칭축이 1개인 글자는 ${tagList(list, flags)}이다.`
      });
    }),
    T('line-axis-pick', '그어진 직선 가운데 대칭축 고르기', '①35·36 ②31·33 ③26·27 심66', (d) => {
      const shape = d.pick(AXIS_PICK), order = d.shuffle(shape.lines), labels = TAGS.slice(0, 4), flags = order.map(([p, q]) => isAxis(sidesOf(shape.pts), p, q));
      const parts = [gp(shape.pts)].concat(order.map(([p, q], i) => longAxis(p, q, 0.6) + G.text(G.beyond(q, p, 0.95), TAGS[i])));
      return setItem(d, `${shape.word}에 직선 가, 나, 다, 라를 그었다. 이 도형의 대칭축을 모두 고른 것은?`, labels, flags, {
        figure: G.board(8, 6, parts, { grid: 'lines', scale: 1.15, label: `모눈종이 위의 ${shape.word}에 직선 가, 나, 다, 라가 그어져 있다.` }),
        explain: `직선마다 그 직선을 따라 접었을 때 완전히 겹치는지 본다. 완전히 겹치는 직선은 ${tagList(labels, flags)}이다. 도형을 똑같은 두 조각으로 나누는 직선이라도 접었을 때 겹치지 않으면 대칭축이 아니다.`
      });
    }),
    T('line-axis-count', '대칭축의 수', '①37 ②34 ③28 심20', (d, n) => {
      if (n === 1) {
        const k = d.pick([3, 5, 6, 8]), count = kindOfPoly(regular(k, 1.8)).axes;
        return N(`${REG_NAME[k]}의 대칭축은 모두 몇 개인가?`, count, {
          unit: '개', figure: plainShape(k), explain: `${REG_NAME[k]}은 ${k % 2 ? '꼭짓점과 마주 보는 변의 가운데를 지나는 직선' : '마주 보는 꼭짓점을 지나는 직선과 마주 보는 변의 가운데를 지나는 직선'}으로 접으면 완전히 겹친다. 그런 직선은 모두 ${count}개이다.`, facts: calc(String(count), [count])
        });
      }
      const [shape] = from(d, (s) => s.axes >= 2, 1), count = kindOfPoly(shape.pts).axes;
      return N('모눈종이에 그린 도형의 대칭축은 모두 몇 개인가?', count, {
        unit: '개', figure: onGrid(shape.pts, { scale: 1.3 }), explain: `접었을 때 완전히 겹치는 직선을 모두 찾는다. 가로, 세로, 비스듬한 방향을 하나씩 따져 보면 대칭축은 모두 ${count}개이다.`, facts: calc(String(count), [count])
      });
    }, { count: 2 }),
    T('line-axis-most', '대칭축의 수 비교', '①38 ②35 ③29 심21', (d, n) => {
      if (n === 1) {
        // 대칭축이 1개, 2개, 4개인 도형을 하나씩
        const list = d.shuffle([1, 2, 4].map((k) => from(d, (s) => s.axes === k, 1)[0])), counts = list.map((s) => kindOfPoly(s.pts).axes), tags = TAGS.slice(0, 3);
        const want = tags.slice().sort((x, y) => counts[tags.indexOf(x)] - counts[tags.indexOf(y)]).join(', ');
        const orders = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]].map((o) => o.map((i) => tags[i]).join(', ')), rows = [[want, true]].concat(d.shuffle(orders.filter((o) => o !== want)).slice(0, 3).map((o) => [o, false]));
        return truthItem(d, '세 도형을 대칭축이 적은 것부터 차례로 늘어놓은 것은?', rows, true, {
          figure: gridTiles(list.map((s) => s.pts)), explain: `대칭축의 수를 세면 ${tags.map((t, i) => `${t}는 ${counts[i]}개`).join(', ')}이다. 적은 것부터 늘어놓으면 ${want}이다.`
        });
      }
      const ks = d.shuffle([0].concat(d.shuffle([3, 4, 5, 6]).slice(0, 3))), counts = ks.map((k) => (k ? kindOfPoly(regular(k, 1.8)).axes : Infinity)), flags = counts.map((c) => c === Math.max(...counts)), at = flags.indexOf(true);
      return oneItem('대칭축이 가장 많은 도형은?', TAGS.slice(0, 4), flags, {
        figure: tiles(ks.map((k) => plainShape(k))), explain: `대칭축의 수는 ${ks.map((k, i) => `${TAGS[i]}(${k ? REG_NAME[k] : '원'}) ${axesText(counts[i])}`).join(', ')}이다. 원은 중심을 지나는 직선이면 어느 것으로 접어도 완전히 겹치므로 대칭축이 셀 수 없이 많다.`
      });
    }, { count: 2 })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
