// 4학년 1학기 2단원 각도 — 단원 틀과 기본 문항(각의 크기 비교, 각도와 각도기, 예각과 둔각, 각도 어림하기).
// 수집해 둔 교과서 9종의 평가 자료(단원평가·형성평가·수학익힘·수행평가)에서 뽑은 문제 꼴 목록(기본꼴 1~3: 103·109·98꼴, 심화꼴 113꼴)과
// 꼴 목록을 만들 때 빠졌던 문서 뒷부분(덧문서)을 처음부터 끝까지 대조하여, 꼴마다 ① 몇 학년 무슨 단원 내용인가 ② 무엇을 하게 하는 문제인가를 따져서 실었다.
// (천재 박만구의 자료는 1단원 폴더에서 가져왔다. 각도의 합과 차, 삼각형·사각형의 각의 크기의 합, 실력 문항은 4-1-2b.js에 있다.)
// ref 의 ①n 은 기본꼴_1 의 n번, ②n·③n 은 기본꼴_2·3, 심n 은 심화꼴의 n번이다.
//
// 싣는 기준
//  - 주는 것(그림 하나·그림 여럿·글만), 묻는 것(값·고르기·차례·맞는 말), 푸는 길이 다르면 다른 문제다. 숫자만 다르거나 상황(부채·가위·피자)만 다른 것은 한 번만 싣는다.
//  - 뽑은 글에는 그림이 없다. 「그림 모름」인 꼴은 얼개(무엇을 주고 무엇을 묻는가)만 따르고 그림과 수는 새로 정했다.
//  - 그림의 각은 적힌 각도 그대로 그린다. 눈으로 가려야 하는 각(예각·둔각 가리기, 크기 비교)은 직각에서 15° 넘게 떨어진 각만 쓰고, 직각에는 직각 표시를 한다.
//  - 각도기 그림: 안쪽 눈금은 오른쪽이 0, 바깥쪽 눈금은 왼쪽이 0이다. 작은 눈금 한 칸은 5°이다(그래서 「작은 눈금 한 칸은 1°」를 그림으로 묻지 않는다).
//  - 시계: 두 바늘이 이루는 작은 쪽의 각을 정각과 30분에서만 묻는다.
//
// 뺀 것과 까닭
//  - 재거나 그려야 답이 되는 것(작도·활동): 각도기로 재기 ①22~25·45 ②21~23 ③15·16·19 심18~21,
//    각·시곗바늘 그리기 ①12·26·38·39·41·55 ②11·39·41·48 ③30·36·39·47 심23·24·47,
//    어림하고 재어 확인하기 ①46·52 ②42·47 ③41·42 심48(잰 각도를 글로 준 「가장 가깝게 어림한 사람」은 실었다).
//  - 까닭·방법 쓰기(서술형): ①19·32·54 ②16·49 ③7·17·18·20·38·40·46 심9·31·53. 고르기로 바꿀 수 있는 것(잘못 놓은 점, 바르게 읽은 각도)은 바꾸어 실었다.
//  - 경우 따지기: 크고 작은 예각·둔각을 모두 세기 ①35 ②9·33 ③37 심35~38, 30분 간격의 시각을 하나씩 따지기 ①40 심42
//  - 분 단위의 시계 각(짧은바늘이 움직인 만큼을 비례로 셈한다): ②37 심43·45. 30분이 낀 시각의 각을 크기 순서로 놓는 것(①10·②10의 한 갈래)도
//    반 칸 셈이라 뺐고, 30분 시각은 예각·둔각 가리기로만 실었다.
//  - 뜻 없는 셈: 예각의 수와 둔각의 수의 차 ②30
//  - 이미 실은 문제와 묻는 틀만 다른 것: 각 그림에서 예각의 수 세기(①30의 변형, 「둔각 모두 고르기」와 같다), 각도와 이름 잇기 ②27,
//    주어진 각도를 바르게 잰 그림 고르기 ②19(눈금 읽기 두 번)
//  - 앞 학년 되짚기·놀이: ②109 ③26(직각 찾기는 3학년 1학기) ③94~98
//  - 안쪽·바깥쪽 눈금 가운데 바르게 읽은 값 고르기(①18 ②18 ③13 심14)와 0이 아닌 눈금에서 시작한 각(③14)은 오개념 보기를 넣어 실력 문항으로 실었다(4-1-2b.js).
// 묻는 말: 수나 값을 물을 때는 "~은?/~는?", 양을 물을 때는 "몇 ~인가?" 로 맺는다. 각도는 70°처럼 수에 붙여 적고, ° 뒤의 토씨는 「도」에 맞춘다(70°는, 70°를).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { LABELS, NAMES, box, lines, tagged, numbers, josa, N, M, C } = B.kit;
  const G = B.kit.geo;
  const KIND = '4수03-02', DEG = '4수03-24', SUMS = '4수03-25';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const TAGS = ['가', '나', '다', '라', '마', '바'];
  const CIRCLED = ['①', '②', '③', '④'];
  const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  const truthOf = (rows, want) => ({ truth: rows.map((row) => row[1]), want });
  // ①은, ②는 … 동그라미 수 뒤의 토씨는 수를 읽는 소리에 맞춘다.
  const circ = (i, pair) => CIRCLED[i] + josa(i + 1, pair).slice(String(i + 1).length);
  const kindOf = (deg) => (deg < 90 ? '예각' : deg === 90 ? '직각' : '둔각');

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

  // ── 그림 ─────────────────────────────────────────────────────
  // 그림 조각은 { pts: 원점을 기준으로 한 테두리 점들, draw(원점을 놓을 자리): 그림 글, label: 그림 설명 } 꼴로 만들고,
  // 판에 놓을 때 테두리에 맞춰 원점을 옮긴다. 방향은 오른쪽이 0°이고 시계 반대쪽으로 커진다.
  const RAD = Math.PI / 180, Z = [0, 0];
  const at = G.toward;
  const add = (p, q) => [p[0] + q[0], p[1] + q[1]];
  const widthOf = (svg) => Number(svg.match(/ width="(\d+)"/)[1]);
  // 도구가 그린 조각(선·다각형·글)에 모양을 덧입힌다.
  const styled = (svg, style) => svg.replace(/^<(\w+) /, '<$1 style="' + style + '" ');
  function span(points, m) {
    const xs = points.map((p) => p[0]), ys = points.map((p) => p[1]), x0 = Math.min(...xs), y0 = Math.min(...ys);
    return { o: [m - x0, m - y0], cols: Math.max(...xs) - x0 + 2 * m, rows: Math.max(...ys) - y0 + 2 * m };
  }
  // 그림 하나를 판에 꼭 맞게 놓는다. 휴대폰의 카드 안 너비(290px)를 넘으면 줄여 그린다.
  function single(it, scale, m) {
    const sp = span(it.pts, m === undefined ? 0.3 : m), plain = widthOf(G.board(sp.cols, sp.rows, [], { grid: false }));
    return G.board(sp.cols, sp.rows, [it.draw(sp.o)], { grid: false, scale: Math.min(scale || 1, 290 / plain), label: it.label });
  }
  // 이름표가 붙은 칸 여럿. 칸의 크기를 모두 같게 하고 그림은 칸 가운데에 놓는다. limit: 칸 하나의 너비(두 칸이 한 줄에 들어가게 120px)
  function tilesOf(items, tags, limit) {
    const boxes = items.map((it) => span(it.pts, 0.14)), cols = Math.max(...boxes.map((b) => b.cols)), rows = Math.max(...boxes.map((b) => b.rows));
    const scale = Math.min(1, (limit || 120) / widthOf(G.board(cols, rows, [], { grid: false })));
    return G.tiles(items.map((it, i) => {
      const b = boxes[i], o = [b.o[0] + (cols - b.cols) / 2, b.o[1] + (rows - b.rows) / 2];
      return [tags[i], G.board(cols, rows, [it.draw(o)], { grid: false, scale, label: it.label })];
    }));
  }
  // 각 하나. s: { deg 크기, rot 첫 변의 방향, a·b 두 변의 길이, arc: false 이면 각 표시를 하지 않는다 }
  function angleItem(s, label) {
    const rot = s.rot || 0, a = s.a || 2.2, b = s.b || a, r = Math.min(0.62, Math.min(a, b) * 0.42);
    return {
      pts: [Z, at(Z, a, rot), at(Z, b, rot + s.deg)], label,
      draw: (o) => G.line(o, at(o, a, rot)) + G.line(o, at(o, b, rot + s.deg)) + (s.arc === false ? '' : s.deg === 90 ? G.squareMark(o, rot, rot + 90, 0.34) : G.arc(o, rot, rot + s.deg, r))
    };
  }
  const angleTiles = (specs, tags) => tilesOf(specs.map((s, i) => angleItem(s, `각 ${tags[i]}: ${s.deg}°`)), tags);
  // 한 점에서 그은 변들. rays: [방향, 길이, 이름], vertex: 꼭짓점 이름
  function raysItem(rays, vertex, label) {
    const sum = rays.reduce((s, [dir]) => add(s, at(Z, 1, dir)), Z), back = G.bearing(Z, sum) + 180;
    return {
      pts: [Z, at(Z, 0.75, back)].concat(rays.map(([dir, len, nm]) => at(Z, len + (nm ? 0.62 : 0), dir))), label,
      draw: (o) => rays.map(([dir, len, nm]) => G.line(o, at(o, len, dir)) + (nm ? G.text(at(o, len + 0.42, dir), nm) : '')).join('') + (vertex ? G.text(at(o, 0.5, back), vertex) : '')
    };
  }
  // 각도기(반지름 5.1칸)와 그 위의 변. rays: 변의 방향(안쪽 눈금의 수와 같다), o: { names 변 끝의 이름, centre 중심의 이름, extra 덧그림, label }
  function proBoard(rays, o) {
    const c = [6, 6.05], r = 5.1, parts = [G.protractor(c, r, { rays })];
    (o.names || []).forEach((nm, i) => { if (nm) parts.push(G.text(at(c, r + 0.95, rays[i]), nm)); });
    if (o.centre) parts.push(G.text([c[0], c[1] + 0.55], o.centre));
    if (o.extra) parts.push(o.extra(c, r));
    return G.board(12, o.centre ? 6.95 : 6.45, parts, { grid: false, label: o.label });
  }
  // 눈금의 수를 적지 않은 작은 각도기와 그 위에 놓인 각. how: 'right'(바르게), 'centre'(중심이 꼭짓점에서 벗어남), 'base'(밑금이 변에서 벗어남)
  const PLACED = { right: '각도기의 중심을 각의 꼭짓점에, 밑금을 각의 한 변에 맞추었다', centre: '각도기의 중심이 각의 꼭짓점에서 벗어나 있다', base: '각도기의 밑금이 각의 변에서 벗어나 있다' };
  function placedItem(how, deg, r) {
    const v = how === 'centre' ? [r * 0.42, 0] : Z, turn = how === 'base' ? 20 : 0, len = r + 0.45;
    const ends = [at(v, how === 'centre' ? len - v[0] : len, turn), at(v, len, turn + deg)];
    return {
      pts: [[-r, 0], [r, 0], [0, -r], [0, 0.12]].concat(ends), label: '각도기를 놓은 그림: ' + PLACED[how],
      draw: (o) => {
        let out = G.arc(o, 0, 180, r, 'mb-line') + G.line(add(o, [-r, 0]), add(o, [r, 0]));
        for (let t = 10; t < 180; t += 10) out += G.line(at(o, r, t), at(o, r - (t % 30 ? 0.16 : 0.3) * (r / 2.3), t), 'mb-line is-thin');
        out += G.line(o, add(o, [0, -0.3 * (r / 2.3)]), 'mb-line is-thin');
        return out + ends.map((p) => G.line(add(o, v), add(o, p))).join('') + G.point(add(o, v));
      }
    };
  }
  // 도형: 테두리 상자에 맞춰 키운 점들
  function fit(points, w, h) {
    const xs = points.map((p) => p[0]), ys = points.map((p) => p[1]), x0 = Math.min(...xs), y0 = Math.min(...ys);
    const k = Math.min(w / (Math.max(...xs) - x0), h / (Math.max(...ys) - y0));
    return points.map((p) => [(p[0] - x0) * k, (p[1] - y0) * k]);
  }
  // 네 각이 A(왼쪽 아래), B(오른쪽 아래), C(오른쪽 위), D(왼쪽 위)인 사각형. 밑변의 길이는 1, 왼쪽 변의 길이는 s 이다.
  function quadRaw(A, B, D, s) {
    const p3 = at(Z, s, A), u1 = at(Z, 1, A + D - 180), u2 = at(Z, 1, 180 - B);
    const dx = 1 - p3[0], dy = -p3[1], det = -u1[0] * u2[1] + u2[0] * u1[1];
    if (Math.abs(det) < 1e-9) return null;
    const p = (-dx * u2[1] + u2[0] * dy) / det, t = (u1[0] * dy - u1[1] * dx) / det;
    return p > 0.05 && t > 0.05 ? [Z, [1, 0], [1 + t * u2[0], t * u2[1]], p3] : null;
  }
  // 변의 길이가 가장 고른 것을 고른다.
  function quadPts(A, B, D) {
    let best = null;
    for (let s = 0.3; s <= 1.8; s += 0.05) {
      const q = quadRaw(A, B, D, s); if (!q) continue;
      const sides = q.map((p, i) => Math.hypot(p[0] - q[(i + 1) % 4][0], p[1] - q[(i + 1) % 4][1])), score = Math.min(...sides) / Math.max(...sides);
      if (!best || score > best.score) best = { q, score };
    }
    return best.q;
  }
  // 도형 하나(각 표시 없이, 직각에만 직각 표시)
  function shapeItem(points, label) {
    return { pts: points, label, draw: (o) => { const p = points.map((q) => add(q, o)); return G.polygon(p) + p.map((_, i) => (Math.abs(G.angleOf(p, i) - 90) < 0.01 ? G.cornerArc(p, i) : '')).join(''); } };
  }
  const anglesOf = (points) => points.map((_, i) => Math.round(G.angleOf(points, i)));
  // 예각·둔각의 수를 세는 도형(각은 모두 직각에서 15° 넘게 떨어져 있거나 꼭 직각이다)
  const SHAPES = [
    () => G.triangle(60, 70, 1, Z), () => G.triangle(90, 35, 1, Z), () => [[0, 0], [5, 0], [5, 3], [0, 3]],                  // 둔각 0개
    () => G.triangle(30, 40, 1, Z), () => quadPts(90, 60, 90), () => quadPts(90, 70, 70),                                    // 둔각 1개
    () => quadPts(60, 120, 120), () => quadPts(70, 110, 55), () => quadPts(50, 130, 130), () => quadPts(110, 70, 60),        // 둔각 2개
    () => [[0, 4], [4, 4], [4, 2], [2, 1], [0, 2]], () => [[0, 3], [4, 3], [5, 2], [5, 1], [1, 1]]                           // 둔각 3개(오각형)
  ];
  // 시계의 두 바늘이 이루는 작은 쪽의 각(정각과 30분)
  const clockDeg = (h, m) => { const gap = Math.abs((h % 12) * 30 + m / 2 - m * 6); return Math.min(gap, 360 - gap); };
  const TIMES = { 예각: [[1, 0], [2, 0], [10, 0], [11, 0], [4, 30], [7, 30]], 직각: [[3, 0], [9, 0]], 둔각: [[4, 0], [5, 0], [7, 0], [8, 0], [1, 30], [10, 30], [11, 30]] };
  const hourGap = (h) => Math.min(h, 12 - h);

  B.addUnit({
    id: '4-1-2', grade: 4, semester: 1, no: 2, title: '각도', version: 1,
    groups: [
      {
        id: 'compare', title: '각의 크기 비교', standard: KIND,
        types: [
          T('cmp-two', '두 각의 크기 비교', '①1 ②1·5 ③1 심1', (d) => {
            // 더 작은 각의 변을 더 길게 그렸다. 변의 길이로 고르면 틀린다.
            const [small, big] = d.pick([[30, 65], [35, 70], [40, 110], [45, 120], [50, 115], [25, 60], [60, 125]]), wantBig = d.bool();
            const specs = d.shuffle([{ deg: small, rot: d.pick([0, 15, 200]), a: 3.2 }, { deg: big, rot: d.pick([0, 20, 330]), a: 1.6 }]), degs = specs.map((s) => s.deg), answer = degs.indexOf(wantBig ? big : small);
            return C(`두 각 가운데 크기가 더 ${wantBig ? '큰' : '작은'} 각은?`, TAGS.slice(0, 2), answer, {
              figure: angleTiles(specs, TAGS), explain: `각의 크기는 변의 길이와 관계없이 두 변이 벌어진 정도로 비교한다. 두 변이 더 ${wantBig ? '많이' : '적게'} 벌어진 ${TAGS[answer]}의 각이 더 ${wantBig ? '크다' : '작다'}.`,
              facts: { rank: { values: degs, nth: wantBig ? 1 : 2 } }
            });
          }),
          T('cmp-most', '세 각 가운데 가장 큰(작은) 각', '①2 ②2 ③2 심2', (d) => {
            const degs = d.shuffle(d.pick([[25, 60, 120], [40, 70, 135], [30, 110, 150], [20, 50, 115], [35, 65, 140]])), most = d.bool();
            const specs = degs.map((deg) => ({ deg, rot: d.pick([0, 15, 30, 200, 320]), a: d.pick([1.7, 2.2, 2.7]) })), target = most ? Math.max(...degs) : Math.min(...degs);
            return C(`각의 크기가 가장 ${most ? '큰' : '작은'} 것은?`, TAGS.slice(0, 3), degs.indexOf(target), {
              figure: angleTiles(specs, TAGS), explain: `두 변이 가장 ${most ? '많이' : '적게'} 벌어진 ${TAGS[degs.indexOf(target)]}의 각이 가장 ${most ? '크다' : '작다'}.`, facts: { rank: { values: degs, nth: most ? 1 : 3 } }
            });
          }),
          T('cmp-order', '세 각을 크기 순서로 늘어놓기', '①3 ②3 ③3 심2', (d) => {
            const degs = d.shuffle(d.pick([[30, 75, 125], [45, 100, 150], [20, 60, 110], [35, 80, 140]])), down = d.bool();
            const specs = degs.map((deg) => ({ deg, rot: d.pick([0, 20, 200, 330]), a: d.pick([1.8, 2.3, 2.7]) }));
            const right = [0, 1, 2].sort((x, y) => (down ? degs[y] - degs[x] : degs[x] - degs[y])), list = d.shuffle([right].concat(d.shuffle(ORDERS.filter((o) => o.join() !== right.join())).slice(0, 3)));
            return C(`각의 크기가 ${down ? '큰' : '작은'} 것부터 차례로 쓴 것은?`, list.map((o) => o.map((i) => TAGS[i]).join(', ')), list.findIndex((o) => o.join() === right.join()), {
              figure: angleTiles(specs, TAGS), explain: `두 변이 ${down ? '많이' : '적게'} 벌어진 각부터 차례로 쓰면 ${right.map((i) => TAGS[i]).join(', ')}이다.`,
              facts: { choose: { exprs: degs.map(String), rule: down ? 'descending' : 'ascending', orders: list } }
            });
          }),
          T('cmp-than', '보기의 각보다 큰(작은) 각 찾기', '①4 ②4 심4', (d) => {
            const ref = d.pick([60, 70, 110, 120]), bigger = d.bool(), one = bigger ? ref + d.pick([25, 35]) : ref - d.pick([25, 35]);
            const rest = d.shuffle(bigger ? [ref - 20, ref - 30, ref - 40] : [ref + 20, ref + 30, ref + 40]).slice(0, 2), degs = d.shuffle([one].concat(rest));
            const specs = [ref].concat(degs).map((deg) => ({ deg, rot: d.pick([0, 15, 200, 335]), a: d.pick([1.8, 2.3, 2.7]) }));
            return C(`보기의 각보다 크기가 더 ${bigger ? '큰' : '작은'} 각은?`, TAGS.slice(0, 3), degs.indexOf(one), {
              figure: angleTiles(specs, ['보기'].concat(TAGS)), explain: `보기의 각보다 두 변이 더 ${bigger ? '많이' : '적게'} 벌어진 각은 ${TAGS[degs.indexOf(one)]}이다.`,
              facts: { choose: { exprs: degs.map(String), rule: bigger ? 'onlyAbove' : 'onlyBelow', target: ref } }
            });
          }),
          T('cmp-overlap', '투명 종이에 본떠 겹친 두 각', '①5 ②7', (d) => {
            const [a, b] = d.pick([[40, 65], [65, 40], [50, 80], [80, 50], [35, 55], [110, 80], [75, 120], [120, 95]]);   // a: 각 가, b: 각 나
            const it = {
              pts: [Z, [3.5, 0], at(Z, 3.75, a), at(Z, 3.75, b), [0, 0.2]], label: `한 변을 맞추어 겹친 두 각: 각 가는 ${a}°, 각 나는 ${b}°`,
              draw: (o) => G.line(o, at(o, 3.5, 0)) + G.line(o, at(o, 3.2, b)) + G.line(o, at(o, 3.2, a), 'mb-line is-cut') + G.text(at(o, 3.6, a), '가') + G.text(at(o, 3.6, b), '나')
            };
            const rows = [['각 가', a > b], ['각 나', b > a], ['두 각의 크기가 같다.', false]];
            return C('투명 종이에 각 가를 본떠서 각 나 위에 꼭짓점과 한 변이 맞닿도록 겹쳤다. 점선은 각 가의 나머지 한 변이다. 더 큰 각은?', rows.map((row) => row[0]), a > b ? 0 : 1, {
              figure: single(it, 1.15), explain: `각 가의 나머지 한 변이 각 나의 ${a > b ? '바깥쪽' : '안쪽'}에 놓였으므로 각 ${a > b ? '가' : '나'}가 더 크다.`, facts: truthOf(rows, true)
            });
          }),
          T('cmp-unit', '크기가 같은 작은 각의 수로 비교하기', '①6 ②6 ③4 심6', (d) => {
            const unit = d.pick([20, 25, 30]), [m, n] = d.until(() => [d.int(2, 5), d.int(2, 5)], ([x, y]) => x !== y && Math.max(x, y) * unit <= 150), big = m > n ? 0 : 1;
            const fan = (k, tag) => ({
              pts: [Z, [2.4, 0], at(Z, 2.4, k * unit)].concat(k * unit > 90 ? [[0, -2.4]] : []), label: `각 ${tag}: 크기가 같은 작은 각 ${k}개`,
              draw: (o) => { let out = ''; for (let i = 0; i <= k; i += 1) out += G.line(o, at(o, 2.4, i * unit), i === 0 || i === k ? 'mb-line' : 'mb-line is-thin'); return out + G.arc(o, 0, k * unit, 1.05); }
            });
            return N(`각 가와 각 나를 크기가 같은 작은 각으로 나누었다. 각 ${TAGS[big]}는 각 ${TAGS[1 - big]}보다 작은 각 몇 개만큼 더 큰가?`, Math.abs(m - n), {
              unit: '개', figure: tilesOf([fan(m, '가'), fan(n, '나')], TAGS), explain: `각 가는 작은 각 ${m}개, 각 나는 작은 각 ${n}개로 이루어져 있다. ${Math.max(m, n)} - ${Math.min(m, n)} = ${Math.abs(m - n)}`,
              facts: { calc: [[`${Math.max(m, n)}-${Math.min(m, n)}`, 0]] }
            });
          }),
          T('cmp-talk', '각의 크기에 대한 설명', '①7 심8', (d) => {
            const bad = d.shuffle(['변의 길이가 길수록 큰 각이다.', '변의 길이가 짧을수록 큰 각이다.', '각의 변을 길게 늘이면 각의 크기도 커진다.', '두 변의 길이가 같은 각끼리는 크기도 같다.']).slice(0, 3);
            const rows = d.shuffle([['두 변이 많이 벌어질수록 큰 각이다.', true]].concat(bad.map((text) => [text, false])));
            return C('각의 크기에 대한 설명으로 옳은 것은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
              explain: '각의 크기는 두 변이 벌어진 정도이다. 변의 길이와는 관계가 없다.', facts: truthOf(rows, true)
            });
          }),
          T('cmp-between', '크기 순서 사이에 들어갈 각', '①8 심5', (d) => {
            const [hi, lo] = d.pick([[120, 50], [130, 60], [110, 40], [140, 70]]), mid = lo + d.pick([25, 30, 35]), cands = d.shuffle([mid, Math.min(165, hi + d.pick([20, 30])), lo - d.pick([15, 20])]);
            const specs = [hi, lo].concat(cands).map((deg) => ({ deg, rot: d.pick([0, 15, 200, 335]), a: d.pick([1.8, 2.2, 2.6]) }));
            return C('각을 크기가 큰 것부터 차례로 세 개 놓으려고 한다. 첫째 각과 셋째 각이 그림과 같을 때, 둘째 자리에 놓을 수 있는 각은?', TAGS.slice(0, 3), cands.indexOf(mid), {
              figure: angleTiles(specs, ['첫째', '셋째'].concat(TAGS)), explain: `둘째 각은 첫째 각보다 작고 셋째 각보다 커야 한다. 그런 각은 ${TAGS[cands.indexOf(mid)]}이다.`,
              facts: { between: { low: String(lo), high: String(hi), exprs: cands.map(String) } }
            });
          }),
          T('cmp-clock', '시계의 두 바늘이 이루는 각 비교', '①9 ③8 심39', (d) => {
            const hours = d.until(() => d.shuffle([1, 2, 3, 4, 5, 7, 8, 9, 10, 11]).slice(0, 3), (list) => new Set(list.map(hourGap)).size === 3), most = d.bool();
            const gaps = hours.map(hourGap), answer = gaps.indexOf(most ? Math.max(...gaps) : Math.min(...gaps));
            return C(`긴바늘과 짧은바늘이 이루는 작은 쪽의 각이 가장 ${most ? '큰' : '작은'} 시계는?`, TAGS.slice(0, 3), answer, {
              figure: G.tiles(hours.map((h, i) => [TAGS[i], G.clock(h, 0)])), explain: `두 바늘 사이에 있는 큰 눈금의 칸 수는 ${hours.map((h, i) => `${TAGS[i]} ${hourGap(h)}칸`).join(', ')}이다. 칸 수가 가장 ${most ? '많은' : '적은'} ${TAGS[answer]}의 각이 가장 ${most ? '크다' : '작다'}.`,
              facts: { rank: { values: gaps, nth: most ? 1 : 3 } }
            });
          }),
          T('cmp-clock-text', '세 시각의 바늘이 이루는 각의 크기 순서', '①10 ②10', (d) => {
            const hours = d.until(() => d.shuffle([1, 2, 3, 4, 5, 7, 8, 9, 10, 11]).slice(0, 3), (list) => new Set(list.map(hourGap)).size === 3);
            const right = [0, 1, 2].sort((x, y) => hourGap(hours[y]) - hourGap(hours[x])), list = d.shuffle([right].concat(d.shuffle(ORDERS.filter((o) => o.join() !== right.join())).slice(0, 3)));
            return C('긴바늘과 짧은바늘이 이루는 작은 쪽의 각이 큰 시각부터 차례로 쓴 것은?', list.map((o) => o.map((i) => LABELS[i]).join(', ')), list.findIndex((o) => o.join() === right.join()), {
              figure: tagged(hours.map((h) => h + '시')), explain: `두 바늘 사이에 있는 큰 눈금의 칸 수는 ${hours.map((h) => `${h}시에 ${hourGap(h)}칸`).join(', ')}이다. 칸 수가 많을수록 각이 크다.`,
              facts: { choose: { exprs: hours.map((h) => (h <= 6 ? String(h) : `12-${h}`)), rule: 'descending', orders: list }, unseen: [12] }
            });
          }),
          T('cmp-dot', '점을 이어 가장 큰 각 만들기', '①11', (d) => {
            // 꼭짓점에서 가장 먼 점을 고르는 아이가 틀리게, 가장 많이 벌어지는 점은 꼭짓점 가까이에 둔다.
            const dirs = d.pick([[25, 60, 105, 150], [35, 70, 115, 155], [20, 55, 95, 140], [30, 80, 120, 160]]), radii = d.shuffle([2.3, 2.8, 3.2]).concat([1.6]);
            const no = d.shuffle([0, 1, 2, 3]), values = [0, 1, 2, 3].map((k) => dirs[no.indexOf(k)]);   // no[i]: i번째 점에 붙는 번호
            const it = {
              pts: [[0, 0.75], [3.9, 0]].concat(dirs.map((dir, i) => at(Z, radii[i] + 0.75, dir))), label: '반직선 ㄴㄱ과 점 넷: ' + values.map((dir, k) => `${CIRCLED[k]}까지 그으면 ${dir}°`).join(', '),
              draw: (o) => G.line(o, at(o, 3.2, 0)) + G.point(o) + G.point(at(o, 2.6, 0)) + G.text(add(o, [0, 0.52]), 'ㄴ') + G.text(add(o, [2.6, 0.52]), 'ㄱ') + dirs.map((dir, i) => G.point(at(o, radii[i], dir)) + G.text(at(o, radii[i] + 0.5, dir), CIRCLED[no[i]], 'mb-label is-length')).join('')
            };
            return C('점 ㄴ을 꼭짓점으로 하고 반직선 ㄴㄱ을 한 변으로 하는 각을 그리려고 한다. 나머지 한 변이 어느 점을 지나게 그을 때 각의 크기가 가장 큰가?', CIRCLED, no[3], {
              figure: single(it, 1.1), explain: `반직선 ㄴㄱ에서 가장 많이 벌어지게 되는 점은 ${CIRCLED[no[3]]}이다. 꼭짓점에서 먼 점이라고 각이 커지는 것은 아니다.`,
              facts: { rank: { values, nth: 1 } }
            });
          }),
          T('cmp-say', '세 각을 비교한 말', '③5 심7', (d) => {
            const degs = d.shuffle(d.pick([[30, 70, 125], [45, 100, 150], [25, 60, 115], [40, 80, 135]])), [big, mid, small] = [0, 1, 2].sort((x, y) => degs[y] - degs[x]).map((i) => TAGS[i]);
            const specs = degs.map((deg) => ({ deg, rot: d.pick([0, 20, 200, 330]), a: d.pick([1.8, 2.3, 2.7]) }));
            const rows = d.shuffle(d.pick([
              [[`가장 큰 각은 각 ${big}이다.`, true], [`가장 작은 각은 각 ${mid}이다.`, false], [`각 ${josa(small, '은/는')} 각 ${mid}보다 크다.`, false]],
              [[`가장 큰 각은 각 ${mid}이다.`, false], [`가장 작은 각은 각 ${small}이다.`, true], [`각 ${josa(mid, '은/는')} 각 ${big}보다 크다.`, false]],
              [[`가장 큰 각은 각 ${small}이다.`, false], [`가장 작은 각은 각 ${big}이다.`, false], [`각 ${josa(mid, '은/는')} 각 ${small}보다 크다.`, true]]
            ]));
            return C('세 각의 크기를 바르게 비교한 것은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
              figure: angleTiles(specs, TAGS), explain: `두 변이 많이 벌어진 각부터 차례로 쓰면 ${big}, ${mid}, ${small}이다.`, facts: truthOf(rows, true)
            });
          }),
          T('cmp-in-shape', '삼각형의 세 각 가운데 가장 큰(작은) 각', '①2 ②2 심3', (d) => {
            const set = d.shuffle(d.pick([[30, 50, 100], [25, 45, 110], [40, 60, 80], [35, 55, 90], [30, 40, 110]])), most = d.bool(), target = most ? Math.max(...set) : Math.min(...set);
            const pts = fit(G.triangle(set[0], set[1], 1, Z), 7.6, 4.4);
            const it = { pts, label: `삼각형: ㉠은 ${set[0]}°, ㉡은 ${set[1]}°, ㉢은 ${set[2]}°`, draw: (o) => { const p = pts.map((q) => add(q, o)); return G.polygon(p) + [0, 1, 2].map((i) => G.cornerArc(p, i, LABELS[i])).join(''); } };
            return C(`삼각형의 세 각 가운데 크기가 가장 ${most ? '큰' : '작은'} 각은?`, LABELS.slice(0, 3), set.indexOf(target), {
              figure: single(it, 1.1), explain: `두 변이 가장 ${most ? '많이' : '적게'} 벌어진 각은 ${LABELS[set.indexOf(target)]}이다.`, facts: { rank: { values: set, nth: most ? 1 : 3 } }
            });
          })
        ]
      },
      {
        id: 'measure', title: '각도와 각도기', standard: DEG,
        types: [
          T('deg-mean', '1도의 뜻', '①13 ③9 심10', () => N('각의 크기를 각도라고 한다. 직각의 크기를 똑같이 90으로 나눈 것 중 하나는 몇 도인가?', 1, {
            unit: '°', explain: '직각의 크기를 똑같이 90으로 나눈 것 중 하나를 1도라 하고 1°라고 쓴다. 직각의 크기는 90°이다.', facts: { calc: [['90/90', 0]] }
          })),
          T('deg-wrong', '각도에 대한 설명', '①14 심10', (d) => {
            // 틀린 설명과 정면으로 맞서는 옳은 설명은 함께 내지 않는다(둘을 견주면 답이 보인다).
            const [bad, clash] = d.pick([['직각의 크기를 똑같이 100으로 나눈 것 중 하나를 1°라고 한다.', 2], ['직각의 크기는 100°이다.', 1], ['각의 두 변을 길게 그릴수록 각도가 커진다.', 3]]);
            const good = ['각의 크기를 각도라고 한다.', '직각의 크기는 90°이다.', '1°는 직각의 크기를 똑같이 90으로 나눈 것 중 하나이다.', '각도는 두 변이 벌어진 정도를 나타낸다.'].filter((_, i) => i !== clash);
            const rows = d.shuffle(good.map((text) => [text, true]).concat([[bad, false]]));
            return C('각도에 대한 설명으로 옳지 않은 것은?', rows.map((row) => row[0]), rows.findIndex((row) => !row[1]), {
              explain: '각의 크기를 각도라고 한다. 직각의 크기를 똑같이 90으로 나눈 것 중 하나가 1°이고, 직각의 크기는 90°이다. 각도는 변의 길이와 관계가 없다.', facts: truthOf(rows, false)
            });
          }),
          T('pro-how', '각도기로 각도를 재는 방법', '②12 ③10', (d) => {
            const rows = d.shuffle([['중심, 밑금', true], ['밑금, 중심', false], ['중심, 눈금', false], ['눈금, 밑금', false]]);
            return C('각도기로 각도를 재는 방법이다. ㉠, ㉡에 알맞은 말을 차례로 쓴 것은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
              figure: lines([`각도기의 ${box(LABELS[0])}을 각의 꼭짓점에 맞춘다.`, `각도기의 ${box(LABELS[1])}을 각의 한 변에 맞춘다.`, '각의 나머지 변이 가리키는 눈금을 읽는다.']),
              explain: '각도기의 중심을 각의 꼭짓점에 맞추고, 각도기의 밑금을 각의 한 변에 맞춘 다음 나머지 변이 가리키는 눈금을 읽는다.', facts: truthOf(rows, true)
            });
          }),
          T('pro-point', '각도기에서 각의 꼭짓점을 맞출 곳', '①15 ②13', (d) => {
            const marks = d.shuffle(LABELS.slice(0, 4)), c = [6, 6.2], r = 5.0;   // 차례로 중심, 밑금의 오른쪽 끝, 눈금 90, 밑금의 왼쪽 끝
            const spots = [[c, [c[0], c[1] + 0.58]], [[c[0] + r, c[1]], [c[0] + r - 0.1, c[1] + 0.58]], [[c[0], c[1] - r], [c[0], c[1] - r - 0.5]], [[c[0] - r, c[1]], [c[0] - r + 0.1, c[1] + 0.58]]];
            const figure = G.board(12, 7.15, [G.protractor(c, r, {})].concat(spots.map(([p, q], i) => G.point(p) + G.text(q, marks[i], 'mb-label is-length'))), {
              grid: false, label: `각도기: ${marks[0]}은 각도기의 중심, ${marks[1]}은 밑금의 오른쪽 끝, ${marks[2]}은 눈금 90, ${marks[3]}은 밑금의 왼쪽 끝`
            });
            const rows = LABELS.slice(0, 4).map((mark) => [mark, mark === marks[0]]);
            return C('각도기로 각도를 재려고 한다. 각의 꼭짓점을 맞추어야 하는 곳은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
              figure, explain: `각의 꼭짓점에는 각도기의 중심을 맞춘다. 각도기의 중심은 밑금의 한가운데인 ${marks[0]}이다.`, facts: truthOf(rows, true)
            });
          }),
          T('pro-right', '각도기를 바르게 놓은 그림', '①16 ②14 ③11 심16', (d) => {
            const hows = d.shuffle(['right', 'centre', 'base']), deg = d.pick([50, 60, 70, 110, 120, 130]), rows = hows.map((how, i) => [TAGS[i], how === 'right']);
            return C('각도기를 바르게 놓고 각도를 재고 있는 것은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
              figure: tilesOf(hows.map((how) => placedItem(how, deg, 2.3)), TAGS), explain: `각도기의 중심을 각의 꼭짓점에 맞추고 각도기의 밑금을 각의 한 변에 맞춘 것은 ${TAGS[hows.indexOf('right')]}이다. ${TAGS[hows.indexOf('centre')]}는 중심이 꼭짓점에서 벗어났고, ${TAGS[hows.indexOf('base')]}는 밑금이 변에서 벗어났다.`,
              facts: truthOf(rows, true)
            });
          }),
          T('pro-fault', '각도기를 잘못 놓은 점', '①20 ②15 심17', (d) => {
            const how = d.pick(['centre', 'base']), deg = d.pick([50, 60, 70, 110, 120]);
            const rows = d.shuffle([['각도기의 중심을 각의 꼭짓점에 맞추지 않았다.', how === 'centre'], ['각도기의 밑금을 각의 한 변에 맞추지 않았다.', how === 'base'], ['각의 두 변을 각도기보다 짧게 그렸다.', false]]);
            return C('각도기로 각도를 잘못 재고 있다. 잘못한 점은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
              figure: single(placedItem(how, deg, 4.2), 1), explain: how === 'centre' ? '각의 꼭짓점이 각도기의 중심에서 벗어나 있다. 각도기의 중심을 각의 꼭짓점에 맞추어야 한다.' : '각의 두 변이 모두 각도기의 밑금에서 벗어나 있다. 각도기의 밑금을 각의 한 변에 맞추어야 한다.',
              facts: truthOf(rows, true)
            });
          }),
          T('pro-read', '각도기의 눈금 읽기', '①17 ②17 ③12 심11', (d, n) => {
            // 첫째 문제는 안쪽 눈금(오른쪽 0), 둘째 문제는 바깥쪽 눈금(왼쪽 0)을 읽는다.
            const x = d.until(() => d.int(5, 31) * 5, (v) => Math.abs(v - 90) >= 15), inner = n === 0, side = inner ? '안쪽' : '바깥쪽', other = inner ? '바깥쪽' : '안쪽';
            return N('각도기로 잰 각도는 몇 도인가?', x, {
              unit: '°', figure: proBoard(inner ? [0, x] : [180, 180 - x], { label: `각도기: 각의 한 변은 ${side} 눈금 0에, 나머지 변은 ${side} 눈금 ${x}(${other} 눈금 ${180 - x})에 놓여 있다` }),
              explain: `각의 한 변이 ${side} 눈금 0에 맞추어져 있으므로 ${side} 눈금을 읽는다. 나머지 변이 가리키는 ${side} 눈금은 ${x}이므로 ${x}°이다.`, facts: { calc: [[`${x}-0`, 0]], rule: inner ? 'inner' : 'outer' }
            });
          }, { count: 2 }),
          T('pro-split', '한 꼭짓점에서 갈라진 두 각 읽기', '①21 ②20 심13', (d) => {
            const [a, b] = d.until(() => { const p = d.int(5, 14) * 5; return [p, p + d.int(6, 14) * 5]; }, ([p, q]) => q <= 160 && p !== 90 && q !== 90);
            return M('점 ㅁ에 각도기의 중심을 맞추고 변 ㅁㄱ에 밑금을 맞추었다. 각 ㄱㅁㄴ과 각 ㄴㅁㄷ의 크기는 각각 몇 도인가?', [{ label: '각 ㄱㅁㄴ', answer: a, unit: '°' }, { label: '각 ㄴㅁㄷ', answer: b - a, unit: '°' }], {
              figure: proBoard([0, a, b], { names: ['ㄱ', 'ㄴ', 'ㄷ'], centre: 'ㅁ', label: `각도기: 중심 ㅁ에서 그은 변 ㅁㄱ은 안쪽 눈금 0, 변 ㅁㄴ은 안쪽 눈금 ${a}, 변 ㅁㄷ은 안쪽 눈금 ${b}에 놓여 있다` }),
              explain: `변 ㅁㄱ이 안쪽 눈금 0에 놓여 있으므로 안쪽 눈금을 읽는다. 변 ㅁㄴ은 ${a}, 변 ㅁㄷ은 ${josa(b, '을/를')} 가리킨다. 각 ㄱㅁㄴ은 ${a}°이고, 각 ㄴㅁㄷ은 ${b}° - ${a}° = ${b - a}°이다.`,
              facts: { calc: [[`${a}-0`, 0], [`${b}-${a}`, 1]] }
            });
          }),
          T('pro-both-sides', '안쪽 눈금과 바깥쪽 눈금으로 두 각 읽기', '심12', (d) => {
            const [p, q] = d.until(() => [d.int(5, 16) * 5, d.int(20, 31) * 5], ([x, y]) => x + y !== 180);
            return M('점 ㅇ에 각도기의 중심을 맞추었다. 각 ㄱㅇㄴ과 각 ㄹㅇㄷ의 크기는 각각 몇 도인가?', [{ label: '각 ㄱㅇㄴ', answer: p, unit: '°' }, { label: '각 ㄹㅇㄷ', answer: 180 - q, unit: '°' }], {
              figure: proBoard([0, p, q, 180], { names: ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ'], centre: 'ㅇ', label: `각도기: 중심 ㅇ에서 그은 변 ㅇㄱ은 안쪽 눈금 0, 변 ㅇㄴ은 안쪽 눈금 ${p}, 변 ㅇㄷ은 바깥쪽 눈금 ${180 - q}, 변 ㅇㄹ은 바깥쪽 눈금 0에 놓여 있다` }),
              explain: `각 ㄱㅇㄴ은 변 ㅇㄱ이 안쪽 눈금 0에 놓여 있으므로 안쪽 눈금을 읽어 ${p}°이다. 각 ㄹㅇㄷ은 변 ㅇㄹ이 바깥쪽 눈금 0에 놓여 있으므로 바깥쪽 눈금을 읽어 ${180 - q}°이다.`,
              facts: { calc: [[`${p}-0`, 0], [`${180 - q}-0`, 1]] }
            });
          }),
          T('pro-dot', '주어진 각도가 되는 점의 자리', '①27 심22', (d) => {
            // 다른 쪽 눈금에서 같은 수를 찾는 아이가 고를 자리(180° - 답)를 꼭 넣는다.
            const t = d.pick([30, 40, 50, 60, 120, 130, 140, 150]), left = d.bool(), side = left ? '바깥쪽' : '안쪽', step = t === 60 || t === 120 ? 20 : 30;
            const reads = [t, 180 - t, t < 90 ? t + step : t - step, t < 90 ? 180 - t - step : 180 - t + step].sort((x, y) => (left ? y - x : x - y));   // 오른쪽 점부터 ①②③④
            const dirOf = (v) => (left ? 180 - v : v);
            return C(`각도기의 중심을 점 ㄴ에, 밑금을 변 ㄴㄱ에 맞추었다. 크기가 ${t}°인 각 ㄱㄴㄷ을 그리려면 점 ㄷ을 어느 자리에 찍어야 하는가?`, CIRCLED, reads.indexOf(t), {
              figure: proBoard([left ? 180 : 0], {
                names: ['ㄱ'], centre: 'ㄴ', label: `각도기: 변 ㄴㄱ은 ${side} 눈금 0에 놓여 있다. ` + reads.map((v, i) => `${CIRCLED[i]}의 자리는 ${side} 눈금 ${v}`).join(', '),
                extra: (c, r) => reads.map((v, i) => G.point(at(c, r + 0.3, dirOf(v))) + G.text(at(c, r + 0.85, dirOf(v)), CIRCLED[i])).join('')
              }),
              explain: `변 ㄴㄱ이 ${side} 눈금 0에 놓여 있으므로 ${side} 눈금에서 ${josa(t, '을/를')} 찾는다. 그 눈금이 있는 자리는 ${CIRCLED[reads.indexOf(t)]}이다. 다른 쪽 눈금에서 ${josa(t, '을/를')} 찾으면 ${180 - t}°인 각이 된다.`,
              facts: { choose: { exprs: reads.map(String), rule: 'equals', target: t } }
            });
          })
        ]
      },
      {
        id: 'kind', title: '예각과 둔각', standard: KIND,
        types: [
          T('kind-mean', '예각과 둔각의 뜻', '①28 ②24 ③21 심25·26', (d) => {
            const [text, answer] = d.pick([['각도가 0°보다 크고 직각보다 작은 각', '예각'], ['각도가 직각보다 크고 180°보다 작은 각', '둔각']]), rows = d.shuffle(['예각', '직각', '둔각']).map((word) => [word, word === answer]);
            return C(`${text}을 무엇이라고 하는가?`, rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
              explain: '각도가 0°보다 크고 직각보다 작은 각을 예각, 직각보다 크고 180°보다 작은 각을 둔각이라고 한다.', facts: truthOf(rows, true)
            });
          }),
          T('kind-bound', '둔각의 뜻에 들어갈 수', '②24 ③22', () => N('각도가 직각보다 크고 □°보다 작은 각을 둔각이라고 한다. □ 안에 알맞은 수는?', 180, {
            explain: '둔각은 각도가 직각보다 크고 180°보다 작은 각이다. 180°는 직각 2개를 이어 붙인 크기이다.', facts: { calc: [['90+90', 0]], unseen: [90] }
          })),
          T('kind-one', '각을 보고 예각·직각·둔각 가리기', '①29 ②25 ③23', (d) => {
            const deg = d.pick([35, 50, 65, 90, 115, 130, 150]), rows = ['예각', '직각', '둔각'].map((word) => [word, word === kindOf(deg)]);
            return C('각을 보고 예각, 직각, 둔각 중 어느 것인지 고르면?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
              figure: single(angleItem({ deg, rot: d.pick([0, 20, 200, 340]), a: 2.8 }, `각: ${deg}°`), 1.15),
              explain: deg === 90 ? '직각 표시가 있으므로 직각이다.' : `직각보다 ${deg < 90 ? '작은 각이므로 예각' : '크고 180°보다 작은 각이므로 둔각'}이다.`, facts: truthOf(rows, true)
            });
          }),
          T('kind-set', '여러 각 가운데 둔각(예각) 모두 찾기', '①30 ②26 ③24·25 심30', (d) => {
            const obtuse = d.bool(), degs = d.shuffle(d.shuffle([110, 120, 135, 150]).slice(0, 2).concat([90], d.shuffle([25, 40, 55, 65]).slice(0, 2)));
            const flags = degs.map((deg) => (obtuse ? deg > 90 : deg < 90)), specs = degs.map((deg) => ({ deg, rot: d.pick([0, 20, 200, 330]), a: 2.1 })), pick = setOptions(d, TAGS.slice(0, 5), flags);
            return C(`${obtuse ? '둔각' : '예각'}을 모두 고른 것은?`, pick.options, pick.answer, {
              figure: angleTiles(specs, TAGS), explain: `직각보다 ${obtuse ? '크고 180°보다 작은' : '작은'} 각은 ${TAGS.filter((_, i) => flags[i]).join(', ')}이다. ${TAGS[degs.indexOf(90)]}는 직각이다.`,
              facts: { sets: { labels: TAGS.slice(0, 5), flags, options: pick.sets } }
            });
          }),
          T('kind-num-acute', '각도 가운데 예각 모두 찾기', '②28 ③27 심28', (d) => {
            const list = d.shuffle(d.shuffle([15, 25, 45, 60, 70, 88]).slice(0, 2).concat([90], d.shuffle([95, 110, 135, 163]).slice(0, 1), [180])), flags = list.map((v) => v < 90);
            const pick = setOptions(d, list.map((v) => v + '°'), flags);
            return C('예각을 모두 고른 것은?', pick.options, pick.answer, {
              figure: numbers(list.map((v) => v + '°')), explain: `각도가 0°보다 크고 90°보다 작은 각은 ${list.filter((v) => v < 90).map((v) => v + '°').join(', ')}이다. 90°는 직각이므로 예각이 아니다.`,
              facts: { sets: { labels: list.map((v) => v + '°'), flags, options: pick.sets } }
            });
          }),
          T('kind-num-count', '각도 가운데 둔각의 수', '①31 ②29 ③28 심29', (d) => {
            const list = d.shuffle(d.shuffle([95, 105, 125, 150, 163, 175]).slice(0, d.int(2, 3)).concat([90, 180], d.shuffle([20, 49, 65, 78]).slice(0, 2))), flags = list.map((v) => v > 90 && v < 180);
            return N('둔각은 모두 몇 개인가?', flags.filter(Boolean).length, {
              unit: '개', figure: numbers(list.map((v) => v + '°')), explain: `각도가 90°보다 크고 180°보다 작은 각은 ${list.filter((_, i) => flags[i]).map((v) => v + '°').join(', ')}이다. 90°와 180°는 둔각이 아니다.`,
              facts: { count: flags }
            });
          }),
          T('kind-shape', '도형 안의 예각(둔각)의 수', '①33 ②31 ③34 심32', (d) => {
            const [points, angles, obtuse] = d.until(() => { const p = d.pick(SHAPES.slice(3))(); return [p, anglesOf(p), d.bool()]; }, ([, a, ob]) => a.some((v) => (ob ? v > 90 : v < 90)));
            const flags = angles.map((v) => (obtuse ? v > 90 : v < 90)), name = ['삼각형', '사각형', '도형'][points.length - 3];   // 오각형이라는 말은 4학년 2학기에 배운다
            return N(`${name}에서 ${obtuse ? '둔각' : '예각'}은 모두 몇 개인가?`, flags.filter(Boolean).length, {
              unit: '개', figure: single(shapeItem(fit(points, 6, 4), `${name}: 각의 크기는 차례로 ${angles.join('°, ')}°`), 1.15),
              explain: `직각보다 ${obtuse ? '큰' : '작은'} 각을 세면 ${flags.filter(Boolean).length}개이다.${angles.includes(90) ? ' 직각 표시가 있는 각은 직각이다.' : ''}`, facts: { count: flags }
            });
          }),
          T('kind-most-obtuse', '둔각이 가장 많은 도형', '②32 ③35 심33', (d) => {
            const groups = [SHAPES.slice(0, 3), SHAPES.slice(3, 6), SHAPES.slice(6, 10), SHAPES.slice(10)], picked = d.shuffle([0, 1, 2, 3]).slice(0, 3);
            const shapes = picked.map((k) => d.pick(groups[k])()), counts = shapes.map((p) => anglesOf(p).filter((v) => v > 90).length), top = counts.indexOf(Math.max(...counts));
            return C('둔각이 가장 많은 도형은?', TAGS.slice(0, 3), top, {
              figure: tilesOf(shapes.map((p, i) => shapeItem(fit(p, 3.9, 2.9), `도형 ${TAGS[i]}: 둔각 ${counts[i]}개`)), TAGS),
              explain: `둔각의 수는 ${counts.map((n, i) => `${TAGS[i]} ${n}개`).join(', ')}이다.`, facts: { mostAngles: counts }
            });
          }),
          T('kind-rays', '한 점에서 그은 변들이 이루는 각 가운데 둔각(예각)', '①34', (d) => {
            const dirs = d.pick([[0, 40, 110, 160], [0, 25, 50, 160], [0, 60, 120, 170], [0, 20, 60, 130], [0, 30, 150, 170]]), names = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ'];
            const all = []; for (let i = 0; i < 4; i += 1) for (let j = i + 1; j < 4; j += 1) all.push([`각 ${names[i]}ㅁ${names[j]}`, dirs[j] - dirs[i]]);
            const obtuse = d.until(() => d.bool(), (ob) => all.filter(([, v]) => (ob ? v < 90 : v > 90)).length >= 3);
            const list = d.shuffle([d.pick(all.filter(([, v]) => (obtuse ? v > 90 : v < 90)))].concat(d.shuffle(all.filter(([, v]) => (obtuse ? v < 90 : v > 90))).slice(0, 3)));
            return C(`${obtuse ? '둔각' : '예각'}인 것은?`, list.map((row) => row[0]), list.findIndex(([, v]) => (obtuse ? v > 90 : v < 90)), {
              figure: single(raysItem(dirs.map((dir, i) => [dir, 3.1, names[i]]), 'ㅁ', '한 점 ㅁ에서 그은 변 넷: ' + all.map(([nm, v]) => `${nm} ${v}°`).join(', ')), 1.1),
              explain: `직각보다 ${obtuse ? '크고 180°보다 작은' : '작은'} 각은 ${list.find(([, v]) => (obtuse ? v > 90 : v < 90))[0]}이다. 나머지는 모두 ${obtuse ? '예각' : '둔각'}이다.`,
              facts: { between: { low: obtuse ? '90' : '0', high: obtuse ? '180' : '90', exprs: list.map(([, v]) => String(v)) } }
            });
          }),
          T('kind-clock', '시계를 보고 예각·둔각 가리기', '①36 ②34 ③31·32 심40', (d) => {
            const want = d.pick(['예각', '둔각']), other = want === '예각' ? '둔각' : '예각';
            const times = d.shuffle([d.pick(TIMES[want]), d.pick(TIMES.직각)].concat(d.shuffle(TIMES[other]).slice(0, 2))), degs = times.map(([h, m]) => clockDeg(h, m)), answer = degs.findIndex((v) => kindOf(v) === want);
            return C(`긴바늘과 짧은바늘이 이루는 작은 쪽의 각이 ${want}인 시계는?`, TAGS.slice(0, 4), answer, {
              figure: G.tiles(times.map(([h, m], i) => [TAGS[i], G.clock(h, m)])),
              explain: `두 바늘 사이가 큰 눈금 3칸이면 직각이다. ${TAGS[answer]}의 시계는 두 바늘 사이가 3칸보다 ${want === '예각' ? '좁으므로 예각' : '넓으므로 둔각'}이다.`,
              facts: { between: { low: want === '예각' ? '0' : '90', high: want === '예각' ? '90' : '180', exprs: degs.map(String) } }
            });
          }),
          T('kind-clock-text', '시각을 보고 예각·둔각 가리기', '①37 ②35·36 ③33 심41', (d) => {
            const want = d.pick(['예각', '둔각']), other = want === '예각' ? '둔각' : '예각', pool = { 예각: [1, 2, 10, 11], 직각: [3, 9], 둔각: [4, 5, 7, 8] };
            const hours = d.shuffle([d.pick(pool[want]), d.pick(pool.직각)].concat(d.shuffle(pool[other]).slice(0, 2))), answer = hours.findIndex((h) => pool[want].includes(h));
            return C(`시계의 긴바늘과 짧은바늘이 이루는 작은 쪽의 각이 ${want}인 시각은?`, hours.map((h) => h + '시'), answer, {
              explain: `두 바늘 사이가 큰 눈금 3칸인 3시와 9시에 직각이다. ${hours[answer]}시에는 두 바늘 사이가 ${hourGap(hours[answer])}칸이므로 ${want}이다.`,
              facts: { between: { low: want === '예각' ? '0' : '90', high: want === '예각' ? '90' : '180', exprs: hours.map((h) => (h <= 6 ? `${h}*30` : `(12-${h})*30`)) } }
            });
          }),
          T('kind-clock-later', '몇 시간 뒤의 시각에 두 바늘이 이루는 각', '심44', (d) => {
            const [h, k] = d.until(() => [d.int(1, 9), d.int(1, 3)], ([x, y]) => x + y <= 11 && x + y !== 6 && x !== 6), t = h + k, rows = ['예각', '직각', '둔각'].map((word) => [word, word === kindOf(hourGap(t) * 30)]);
            return C(`시계가 나타내는 시각에서 ${k}시간이 지났을 때, 긴바늘과 짧은바늘이 이루는 작은 쪽의 각은 예각, 직각, 둔각 중 어느 것인가?`, rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
              figure: G.clock(h, 0), explain: `시계가 나타내는 시각은 ${h}시이고 ${k}시간 뒤는 ${t}시이다. ${t}시에는 두 바늘 사이가 큰 눈금 ${hourGap(t)}칸이다. 직각은 3칸이므로 ${kindOf(hourGap(t) * 30)}이다.`,
              facts: truthOf(rows, true)
            });
          }),
          T('kind-order', '예각·직각·둔각·180°의 크기 순서', '②38 심27', (d) => {
            const SIZE = ['180°', '둔각', '직각', '예각'], items = d.shuffle(SIZE), ranks = items.map((word) => SIZE.indexOf(word)), right = ranks.map((_, step) => ranks.indexOf(step));
            const swap = (list, i, j) => { const out = list.slice(); out[i] = list[j]; out[j] = list[i]; return out; };
            const list = d.shuffle([right, right.slice().reverse(), swap(right, 0, 1), swap(right, 1, 2)]);
            return C('크기가 큰 것부터 차례로 쓴 것은?', list.map((o) => o.map((i) => LABELS[i]).join(', ')), list.findIndex((o) => o.join() === right.join()), {
              figure: tagged(items), explain: '둔각은 직각보다 크고 180°보다 작다. 예각은 직각보다 작다. 큰 것부터 쓰면 180°, 둔각, 직각, 예각이다.', facts: { sequence: { ranks, options: list } }
            });
          }),
          T('kind-dot', '둔각(예각)이 되게 이을 점', '①42 ②40 ③29 심34', (d) => {
            // 선분 ㄴㄱ의 꼭짓점 ㄴ 바로 위의 점과 이으면 직각이다. 그 점을 기준으로 가린다.
            const obtuse = d.bool(), V = [3, 3], OBT = [[1, 1], [0, 2], [2, 1], [1, 0], [0, 1]], ACU = [[5, 1], [6, 1], [5, 0], [4, 1]];
            const cands = d.shuffle(obtuse ? OBT : ACU).slice(0, 1).concat([d.pick([[3, 0], [3, 1]])], d.shuffle(obtuse ? ACU : OBT).slice(0, 2)).sort((p, q) => p[0] - q[0] || p[1] - q[1]);
            const degs = cands.map((p) => Math.round(Math.atan2(V[1] - p[1], p[0] - V[0]) / RAD * 10) / 10), answer = degs.findIndex((v) => (obtuse ? v > 90 : v < 90)), upright = degs.indexOf(90);
            const parts = [G.line(V, [6, 3]), G.point(V), G.point([6, 3]), G.text([2.72, 3.52], 'ㄴ'), G.text([6.28, 3.52], 'ㄱ')].concat(cands.map((p, i) => G.point(p) + G.text([p[0] + 0.48, p[1] - 0.06], CIRCLED[i], 'mb-label is-length')));
            return C(`점 종이에 선분 ㄱㄴ을 그었다. 각 ㄱㄴㄷ이 ${obtuse ? '둔각' : '예각'}이 되려면 점 ㄷ을 어느 자리에 찍어야 하는가?`, CIRCLED, answer, {
              figure: G.board(7, 4, parts, { grid: 'dots', scale: 1.2, label: '점 종이의 선분 ㄱㄴ과 점 넷: ' + degs.map((v, i) => `${CIRCLED[i]}에 찍으면 각 ㄱㄴㄷ은 ${v}°`).join(', ') }),
              explain: `점 ㄴ의 바로 위에 있는 ${circ(upright, '과/와')} 이으면 직각이 된다. 그보다 ${obtuse ? '더 벌어지게' : '덜 벌어지게'} 되는 ${circ(answer, '과/와')} 이어야 ${obtuse ? '둔각' : '예각'}이 된다.`,
              facts: { between: { low: obtuse ? '90' : '0', high: obtuse ? '180' : '90', exprs: degs.map(String) } }
            });
          })
        ]
      },
      {
        id: 'estimate', title: '각도 어림하기', standard: DEG,
        types: [
          T('est-right-angle', '직각과 견주어 각도 어림하기', '①47·48 ②43·44·50 ③44 심49·50', (d) => {
            const x = d.pick([43, 47, 78, 82, 98, 102, 133, 137]);
            const rows = d.shuffle([['직각의 절반쯤이므로 약 45°이다.', 45], ['직각보다 조금 작으므로 약 80°이다.', 80], ['직각보다 조금 크므로 약 100°이다.', 100], ['직각에 직각의 절반을 더한 것쯤이므로 약 135°이다.', 135]]);
            const it = {
              pts: [Z, [3.8, 0], [0, -3.6], at(Z, 3.8, x)], label: `각 하나와 직각을 나타내는 점선: 각의 크기는 ${x}°`,
              draw: (o) => G.line(o, add(o, [0, -3.6]), 'mb-line is-cut') + G.squareMark(o, 0, 90, 0.3) + G.line(o, add(o, [3.8, 0])) + G.line(o, at(o, 3.8, x)) + G.arc(o, 0, x, 1.1)
            };
            return C('각의 한 변과 직각을 이루는 점선을 그었다. 각도를 바르게 어림한 것은?', rows.map((row) => row[0]), rows.findIndex((row) => Math.abs(row[1] - x) <= 3), {
              figure: single(it, 1.25), explain: `각의 나머지 한 변이 ${x < 60 ? '점선과 아래쪽 변의 가운데쯤에 있다' : x < 90 ? '점선보다 조금 안쪽에 있다' : x < 110 ? '점선보다 조금 바깥쪽에 있다' : '점선을 지나 직각의 절반쯤 더 벌어져 있다'}. ${rows.find((row) => Math.abs(row[1] - x) <= 3)[0]}`,
              facts: { choose: { exprs: rows.map((row) => String(row[1])), rule: 'nearest', target: x } }
            });
          }),
          T('est-set-square', '삼각자의 각과 견주어 각도 어림하기', '①49 ②43 ③43', (d) => {
            const ref = d.pick([30, 45, 60]), more = d.bool(), x = more ? ref + 10 : ref - 10, L = ref === 60 ? 1.9 : 3, top = L * Math.tan(ref * RAD), far = L / Math.cos(ref * RAD) + 0.9;
            const tri = [Z, [L, 0], [L, -top]];
            const it = {
              pts: tri.concat([[L + 1, 0], at(Z, far, x)]), label: `각에 삼각자의 ${ref}°인 각을 겹쳐 놓은 그림: 각의 크기는 ${x}°`,
              draw: (o) => { const p = tri.map((q) => add(q, o)); return G.polygon(p) + G.cornerArc(p, 1) + styled(G.line(o, add(o, [L + 1, 0])), 'stroke-width:2.8') + styled(G.line(o, at(o, far, x)), 'stroke-width:2.8'); }
            };
            const rows = d.shuffle([[`삼각자의 ${ref}°보다 조금 크므로 약 ${ref + 10}°이다.`, ref + 10], [`삼각자의 ${ref}°보다 조금 작으므로 약 ${ref - 10}°이다.`, ref - 10], [`삼각자의 ${ref}°와 크기가 같으므로 ${ref}°이다.`, ref], [`삼각자의 ${ref}°의 2배쯤이므로 약 ${ref * 2}°이다.`, ref * 2]]);
            return C(`굵은 선으로 그린 각의 꼭짓점과 한 변에 삼각자의 ${ref}°인 각을 맞추어 겹쳐 놓았다. 굵은 선으로 그린 각의 크기를 바르게 어림한 것은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[1] === x), {
              figure: single(it, 1.3), explain: `각의 나머지 한 변이 삼각자의 ${more ? '바깥쪽' : '안쪽'}에 있으므로 삼각자의 ${ref}°보다 조금 ${more ? '크다' : '작다'}. 약 ${x}°로 어림할 수 있다.`,
              facts: { choose: { exprs: rows.map((row) => String(row[1])), rule: 'nearest', target: x } }
            });
          }),
          T('est-pick-angle', '약 몇 도인 각 찾기', '①50 ②45', (d) => {
            const [t, real, others] = d.pick([[30, 28, [75, 130]], [60, 62, [20, 115]], [120, 118, [65, 165]], [150, 152, [100, 45]], [45, 47, [110, 150]], [135, 133, [40, 80]]]), degs = d.shuffle([real].concat(others));
            const specs = degs.map((deg) => ({ deg, rot: d.pick([0, 20, 200, 335]), a: 2.2 }));
            return C(`각도를 어림했을 때 약 ${t}°인 각은?`, TAGS.slice(0, 3), degs.indexOf(real), {
              figure: angleTiles(specs, TAGS), explain: `직각(90°)과 비교하여 어림한다. ${{ 30: '직각의 절반보다 작은', 45: '직각의 절반쯤인', 60: '직각보다 작고 직각의 절반보다 큰', 120: '직각보다 조금 큰', 135: '직각에 직각의 절반을 더한 것쯤인', 150: '직각 2개를 이어 붙인 것보다 조금 작은' }[t]} 각은 ${TAGS[degs.indexOf(real)]}이다.`,
              facts: { choose: { exprs: degs.map(String), rule: 'nearest', target: t } }
            });
          }),
          T('est-who', '잰 각도에 가장 가깝게 어림한 사람', '①51 ②46 ③45 심51·52', (d) => {
            const real = d.int(7, 30) * 5, who = d.shuffle(NAMES).slice(0, 3);
            const said = d.until(() => who.map(() => real + d.pick([-25, -20, -15, -10, -5, 5, 10, 15, 20, 25])), (list) => { const gaps = list.map((v) => Math.abs(v - real)).sort((x, y) => x - y); return new Set(list).size === 3 && gaps[0] < gaps[1] && list.every((v) => v >= 10); });
            const gaps = said.map((v) => Math.abs(v - real)), best = gaps.indexOf(Math.min(...gaps));
            return C(`각도기로 재면 ${real}°인 각을 세 사람이 어림했다. 가장 가깝게 어림한 사람은?`, who, best, {
              figure: lines(who.map((w, i) => `${w}: 약 ${said[i]}°`)), explain: `어림한 각도와 잰 각도의 차는 ${who.map((w, i) => `${w} ${gaps[i]}°`).join(', ')}이다. 차가 가장 작은 ${who[best]}의 어림이 가장 가깝다.`,
              facts: { closer: { expr: String(real), estimates: said } }
            });
          }),
          T('est-rule', '어림을 잘했는지 알아보는 방법', '①53', (d) => {
            const rows = d.shuffle([['어림한 각도와 잰 각도의 차가 작을수록 잘 어림한 것이다.', true], ['어림한 각도와 잰 각도의 차가 클수록 잘 어림한 것이다.', false], ['어림한 각도가 클수록 잘 어림한 것이다.', false], ['어림한 각도가 작을수록 잘 어림한 것이다.', false]]);
            return C('각도를 어림한 다음 각도기로 재어 보았다. 옳은 설명은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
              explain: '어림한 각도가 잰 각도에 가까울수록, 곧 두 각도의 차가 작을수록 잘 어림한 것이다.', facts: truthOf(rows, true)
            });
          })
        ]
      },
      { id: 'sum', title: '각도의 합과 차', standard: DEG, types: [] },
      { id: 'tri', title: '삼각형의 세 각의 크기의 합', standard: SUMS, types: [] },
      { id: 'quad', title: '사각형의 네 각의 크기의 합', standard: SUMS, types: [] }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
