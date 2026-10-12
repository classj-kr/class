// 5학년 1학기 6단원 다각형의 둘레와 넓이 — 단원 틀, 그림 도구, 기본 문항(다각형의 둘레, 1 cm²와 넓이 세기, 직사각형과 정사각형의 넓이, 1 m²와 1 km²).
// 수집해 둔 교과서 9종의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1~3: 79·95·95꼴, 심화꼴 111꼴)을 번호마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 뺌(까닭) / 미룸」을 가른 대조표는 references/textbooks/수학/_분석/5-1-6/싣기_대조표.md 에 있다.
// (평행사변형·삼각형·사다리꼴·마름모·여러 도형의 기본 문항은 5-1-6b.js, 실력 문항은 5-1-6c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2, ③n = 기본꼴_3, 심n = 심화꼴.
//
// 영역: 도형과 측정 가운데 측정. 길이와 넓이를 셈하는 것이 이 단원의 일이다.
//   6수03-11 평면도형의 둘레 / 6수03-12 넓이 단위 1 cm², 1 m², 1 km²와 그 관계 / 6수03-13 직사각형과 정사각형의 넓이 / 6수03-14 평행사변형, 삼각형, 사다리꼴, 마름모의 넓이
//
// 싣는 기준
//  - 주는 것(문장·길이를 적은 그림·모눈), 묻는 것, 도형, 구하는 길(바로 구하기, 한 번 거꾸로 구하기, 나누어 더하기, 큰 것에서 빼기, 옮겨 붙이기)이 다르면 다른 문제다.
//    수만 다르거나 상황(이름·물건)만 다른 것은 한 번만 싣는다.
//  - 그림은 적힌 수대로 그린다(길이의 비율이 맞고 직각은 직각이다). 비스듬한 변의 길이를 적는 그림은 직각삼각형의 세 변(3·4·5, 5·12·13 …)으로 짠다.
//    길이 글은 선분 위에 얹지 않고 옆(도형 밖이나 빈 쪽)에 적는다. 높이는 점선과 직각 표시로 그린다. 그림 속 수는 aria-label 에 적는다.
//  - 둘레에서 한 변 구하기, 넓이에서 변·높이 구하기처럼 한 번 거꾸로 셈하는 것은 기본에 싣는다.
//  - 서술형·작도는 싣지 않는다. 고르기나 수 답으로 바꿀 수 있는 것은 바꾸었다(넓이에 맞게 그리기 → 모눈 위 도형 가운데 넓이가 맞는 것 고르기).
//
// 뺀 것과 까닭(이 파일의 네 묶음)
//  - 규칙 찾기가 일인 것(①12·20 ②23 심17·23): 타일 수에 따라 커지는 마름모의 둘레, 규칙에 따라 늘어나는 도형의 넓이 — 규칙과 대응(4-1, 5-1-3)의 일이고 둘레·넓이는 한 번 세는 것뿐이다.
//  - 합과 배·합과 차로 두 수를 찾는 방정식 꼴(③16 심32·33·35), 둘레가 같은 직사각형을 모두 늘어놓는 경우 따지기(①31 ③34 심34)
//  - 겉에 드러난 변을 가려 세는 것이 일의 대부분인 것(②13의 정사각형 8개, 심16), 길이 조건으로 정사각형의 변을 차례로 풀어내는 퍼즐(②38 ③35 심41)
//  - cm²와 km²를 한 줄에 세워 견주는 것(①38 ②43 심48, ③42의 변형): 교육과정 「넓이 단위 사이의 관계 중 1 cm², 1 km² 사이의 단위 환산은 다루지 않는다」
//  - 소수가 낀 단위 바꾸기(②44 ③42 심44): 소수에 10000·1000000을 곱하는 셈은 소수의 곱셈(5-2)
//  - 그리기·긋기(①13 ②11·22 ③17·23 심9·22·42): 「둘레에 맞게 그리기」는 「둘레와 한 변으로 다른 변 구하기」가, 「넓이에 맞게 그리기」는 「넓이가 정해진 도형 찾기」가 같은 일을 수·고르기로 묻는다.
//  - 뜻 없는 셈: 두 도형 둘레의 합(②10·③13의 변형), 길로 나뉜 꽃밭 네 조각의 둘레를 모두 더하기(심15), 두 답의 합(심43의 변형)
//  - 구멍 뚫린 도형의 안팎 테두리를 더하는 둘레(심13): 교과서가 정한 둘레의 뜻(도형을 둘러싼 변의 길이의 합)을 넘는다.
//  - 수집본에 그림이 없어 얼개를 알 수 없는 것(②15 산책길에 둘러싸인 꽃밭, ②30·37 그림 속 변): 지어내지 않았다.
//  - 같은 일을 고르기로 바꾼 것: 같은 넓이끼리 잇기(③41)·단위 넓이가 몇 번 들어가는지(③45)는 단위 바꾸기·줄 수로 넓이 구하기와 같은 문제다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」. 수와 단위 기호는 띄어 쓴다(7 cm, 12 cm², □ m²).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, N, M, C, tagged, lines } = B.kit;
  const G = B.kit.geo;
  const PERI = '6수03-11', UNITS = '6수03-12', RECT = '6수03-13', AREA = '6수03-14';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const TAGS = ['가', '나', '다', '라', '마'], MARKS = ['㉠', '㉡', '㉢', '㉣', '㉤'];
  const NAME = { 3: '정삼각형', 4: '정사각형', 5: '정오각형', 6: '정육각형', 7: '정칠각형', 8: '정팔각형', 9: '정구각형', 10: '정십각형', 12: '정십이각형' };
  // 직각삼각형의 세 변 [짧은 변, 다른 변, 빗변]: 비스듬한 변의 길이를 적는 그림에 쓴다.
  const PYT = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20]];
  const RAD = Math.PI / 180;
  const len = (v, u) => v + ' ' + (u || 'cm');
  const calc = (expr, unseen) => ({ calc: [[expr, 0]], unseen: unseen || [] });

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
  // 설명 고르기: want 가 true 이면 옳은 것 하나와 틀린 것 셋, false 이면 옳은 것 셋과 틀린 것 하나
  function say(d, text, trues, falses, want, explain, figure) {
    const rows = d.shuffle(want ? [[d.pick(trues), true]].concat(d.shuffle(falses).slice(0, 3).map((t) => [t, false])) : d.shuffle(trues).slice(0, 3).map((t) => [t, true]).concat([[d.pick(falses), false]]));
    return C(text, rows.map((r) => r[0]), rows.findIndex((r) => r[1] === want), { figure, explain, facts: { truth: rows.map((r) => r[1]), want } });
  }
  // 낱말 하나 고르기
  function pickWord(d, text, want, others, explain) {
    const options = d.shuffle([want].concat(others));
    return C(text, options, options.indexOf(want), { explain, facts: { truth: options.map((o) => o === want), want: true } });
  }

  // ── 그림: 길이를 적은 도형 ───────────────────────────────────
  const mid = (p, q, t) => { const k = t == null ? 0.5 : t; return [p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k]; };
  const centre = (pts) => [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];
  // 판 안에 맞추기: 가로 box[0], 세로 box[1] 칸을 넘지 않게 같은 배율로 키우고(길이의 비율이 그대로다) 둘레에 여백 pad 를 둔다.
  function place(raw, box, pad) {
    const xs = raw.map((p) => p[0]), ys = raw.map((p) => p[1]), x0 = Math.min(...xs), y0 = Math.min(...ys), w = Math.max(...xs) - x0, h = Math.max(...ys) - y0;
    const k = Math.min(box[0] / w, box[1] / h);
    return { points: raw.map(([x, y]) => [(x - x0) * k + pad[0], (y - y0) * k + pad[1]]), k, cols: w * k + pad[0] * 2, rows: h * k + pad[1] * 2 };
  }
  // 점 여럿으로 이루어진 그림: raw 를 판에 맞춘 뒤 build(맞춘 점들, 맞춤)가 그릴 것을 돌려준다. 휴대폰 너비를 넘지 않게 배율을 누른다.
  function scene(raw, build, o) {
    const opt = o || {}, fit = place(raw, opt.box || [6, 3.8], opt.pad || [1.9, 1.05]);
    return G.board(fit.cols, fit.rows, build(fit.points, fit), { grid: false, scale: Math.min(opt.scale || 1.15, 296 / (32 + fit.cols * 22)), label: opt.label });
  }
  const styled = (svg, css) => svg.replace('class="mb-poly"', 'class="mb-poly" style="' + css + '"');
  const tint = (pts, color) => styled(G.polygon(pts), 'fill:' + (color || 'rgba(251,191,36,0.32)'));
  const ghost = (pts) => styled(G.polygon(pts), 'fill:none;stroke:#5b6770;stroke-width:1.2;stroke-dasharray:4 3');
  const dashed = (p, q) => G.line(p, q, 'mb-line is-cut'), thin = (p, q) => G.line(p, q, 'mb-line is-thin');
  const word = (at, v) => G.text(at, v, 'mb-label is-length');
  // 글 너비의 반(칸). 길이 글(「12 cm」)의 글자 수로 어림한다.
  const half = (v) => (String(v).length + (String(v).includes('□') ? 0.8 : 0)) * 0.155;
  // 선분 p–q 의 옆에 글을 적는다(선 위에 얹지 않는다). toward: 글을 둘 쪽에 있는 점, t: 선분을 따라간 자리(0~1), gap: 선분과 글 사이의 틈
  function beside(p, q, value, toward, t, gap) {
    const m = mid(p, q, t), L = Math.hypot(q[0] - p[0], q[1] - p[1]);
    let n = [-(q[1] - p[1]) / L, (q[0] - p[0]) / L];
    if ((toward[0] - m[0]) * n[0] + (toward[1] - m[1]) * n[1] < 0) n = [-n[0], -n[1]];
    const off = half(value) * Math.abs(n[0]) + 0.3 * Math.abs(n[1]) + (gap == null ? 0.17 : gap);
    return word([m[0] + n[0] * off, m[1] + n[1] * off], value);
  }
  // 부호 있는 넓이의 두 배(꼭짓점이 도는 방향을 안다)
  const area2 = (pts) => pts.reduce((s, p, i) => s + G.cross(p, pts[(i + 1) % pts.length]), 0);
  // 다각형의 변 i(꼭짓점 i 와 i + 1 사이)의 바깥쪽에 글을 적는다. 오목한 도형에서도 바깥쪽을 찾는다.
  function outside(pts, i, value, t) {
    const p = pts[i], q = pts[(i + 1) % pts.length], s = area2(pts) > 0 ? 1 : -1, m = mid(p, q, t);
    return beside(p, q, value, [m[0] + (q[1] - p[1]) * s, m[1] - (q[0] - p[0]) * s], t);
  }
  const edges = (pts) => pts.map((p, i) => [p, pts[(i + 1) % pts.length]]);
  const segGap = (pt, [a, b]) => { const r = G.sub(b, a), t = Math.max(0, Math.min(1, G.dot(G.sub(pt, a), r) / G.dot(r, r))); return Math.hypot(pt[0] - a[0] - r[0] * t, pt[1] - a[1] - r[1] * t); };
  // 글 상자(가운데 c, 반너비 hw, 반높이 hh)와 선분 사이의 틈. 선분이 상자를 지나면 0.
  function boxGap(c, hw, hh, seg) {
    for (let k = 0; k <= 30; k += 1) { const q = mid(seg[0], seg[1], k / 30); if (Math.abs(q[0] - c[0]) < hw && Math.abs(q[1] - c[1]) < hh) return 0; }
    return Math.min(...[[-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0]].map(([x, y]) => segGap([c[0] + x * hw, c[1] + y * hh], seg)));
  }
  // 선분 p–q 의 양옆 여러 자리 가운데 둘레의 선분(walls)과 가장 멀리 떨어지는 자리(글 상자의 가운데)를 고른다.
  function roomiest(p, q, value, walls) {
    const L = Math.hypot(q[0] - p[0], q[1] - p[1]), n = [-(q[1] - p[1]) / L, (q[0] - p[0]) / L], hw = half(value), hh = 0.3, away = hw * Math.abs(n[0]) + hh * Math.abs(n[1]) + 0.2;
    let best = null;
    for (const t of [0.5, 0.6, 0.4, 0.7, 0.3, 0.8]) for (const s of [1, -1]) {
      const m = mid(p, q, t), c = [m[0] + n[0] * s * away, m[1] + n[1] * s * away], room = Math.min(...walls.map((w) => boxGap(c, hw + 0.06, hh + 0.04, w)));
      if (!best || room > best.room + 0.02) best = { room, c };
    }
    return best.c;
  }
  // 높이: 점 a 에서 발 f 까지 점선을 긋고, 발에 직각 표시를 하고, 옆에 글을 적는다. along: 밑변(또는 밑변을 늘인 선) 위의 다른 점.
  // where 가 선분들(둘레의 변)이면 그 변들과 가장 멀리 떨어지는 자리에, 점 하나이면 그 점이 있는 쪽에 글을 적는다. 직각 표시는 글의 반대쪽에 한다.
  function height(a, f, along, value, where, t) {
    if (!value) return dashed(a, f) + G.rightMark(f, a, along);
    const walls = Array.isArray(where[0]), at = walls ? roomiest(a, f, value, where) : null, side = (pt) => G.cross(G.sub(f, a), G.sub(pt, a));
    const toward = walls ? at : where, mark = side(toward) * side(along) > 0 ? [f[0] * 2 - along[0], f[1] * 2 - along[1]] : along;
    return dashed(a, f) + G.rightMark(f, a, mark) + (walls ? word(at, value) : beside(a, f, value, where, t == null ? 0.62 : t, 0.2));
  }
  // 치수선: 선분 p–q 와 나란히, 점 inside 의 반대쪽으로 off 만큼 떨어진 가는 선과 양 끝 눈금, 그 바깥에 글
  function dim(p, q, inside, value, off) {
    const L = Math.hypot(q[0] - p[0], q[1] - p[1]), m = mid(p, q), o = off == null ? 0.5 : off;
    let n = [-(q[1] - p[1]) / L, (q[0] - p[0]) / L];
    if ((inside[0] - m[0]) * n[0] + (inside[1] - m[1]) * n[1] > 0) n = [-n[0], -n[1]];
    const a = [p[0] + n[0] * o, p[1] + n[1] * o], b = [q[0] + n[0] * o, q[1] + n[1] * o], tick = (c) => thin([c[0] - n[0] * 0.16, c[1] - n[1] * 0.16], [c[0] + n[0] * 0.16, c[1] + n[1] * 0.16]);
    return thin(a, b) + tick(a) + tick(b) + beside(a, b, value, [m[0] + n[0] * (o + 2), m[1] + n[1] * (o + 2)]);
  }
  // 밑변 a, 옆변 b, 왼쪽 아래 각이 deg°인 평행사변형 [왼쪽 위, 왼쪽 아래, 오른쪽 아래, 오른쪽 위]
  const pgram = (a, b, deg) => { const c = b * Math.cos(deg * RAD), s = b * Math.sin(deg * RAD); return [[c, 0], [0, s], [a, s], [a + c, 0]]; };
  // 한 변이 오른쪽에 세로로 놓인 정n각형(한 변의 길이 1). 가운데는 c.
  function regular(n, c) {
    const R = 0.5 / Math.sin(Math.PI / n);
    return Array.from({ length: n }, (_, i) => [c[0] + R * Math.cos(Math.PI / n + (i * 2 * Math.PI) / n), c[1] + R * Math.sin(Math.PI / n + (i * 2 * Math.PI) / n)]);
  }

  // ── 그림: 모눈 위의 도형 ─────────────────────────────────────
  // 모눈 위의 도형은 모눈이 비쳐 보이게 옅게 칠한다(칸을 세어야 하므로).
  const gp = (pts, color) => styled(G.polygon(pts), 'fill:' + (color || 'rgba(251,191,36,0.28)'));
  // 칸으로 이루어진 도형: 칸을 옅게 칠하고 테두리만 긋는다. cells: [가로, 세로] 자리의 목록, (dx, dy)만큼 옮겨 그린다.
  function cellsArt(cells, dx, dy) {
    const has = new Set(cells.map((c) => c[0] + ',' + c[1])), out = [], edges = [];
    for (const [x, y] of cells) {
      const X = x + dx, Y = y + dy;
      out.push(styled(G.polygon([[X, Y], [X + 1, Y], [X + 1, Y + 1], [X, Y + 1]]), 'stroke:none;fill:rgba(251,191,36,0.34)'));
      if (!has.has(x + ',' + (y - 1))) edges.push(G.line([X, Y], [X + 1, Y]));
      if (!has.has(x + ',' + (y + 1))) edges.push(G.line([X, Y + 1], [X + 1, Y + 1]));
      if (!has.has((x - 1) + ',' + y)) edges.push(G.line([X, Y], [X, Y + 1]));
      if (!has.has((x + 1) + ',' + y)) edges.push(G.line([X + 1, Y], [X + 1, Y + 1]));
    }
    return out.concat(edges).join('');
  }
  // 가로 w, 세로 h 칸 안에서 서로 이어진 칸 n 개를 고른다(가운데가 뚫린 모양은 쓰지 않는다).
  function blob(d, n, w, h) {
    const key = (c) => c[0] + ',' + c[1];
    const holed = (cells) => {
      const has = new Set(cells.map(key)), seen = new Set(), stack = [[-1, -1]];
      while (stack.length) { const [x, y] = stack.pop(), k = x + ',' + y; if (x < -1 || y < -1 || x > w || y > h || has.has(k) || seen.has(k)) continue; seen.add(k); stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]); }
      return seen.size + cells.length < (w + 2) * (h + 2);
    };
    return d.until(() => {
      const cells = [[d.int(0, w - 1), d.int(0, h - 1)]], has = new Set([key(cells[0])]);
      for (let tries = 0; cells.length < n && tries < 4000; tries += 1) {
        const [x, y] = d.pick(cells), [ax, ay] = d.pick([[1, 0], [-1, 0], [0, 1], [0, -1]]), c = [x + ax, y + ay];
        if (c[0] < 0 || c[0] >= w || c[1] < 0 || c[1] >= h || has.has(key(c))) continue;
        has.add(key(c)); cells.push(c);
      }
      return cells;
    }, (cells) => cells.length === n && !holed(cells));
  }
  // 칸 도형을 가로 cols, 세로 rows 칸인 모눈판의 가운데에 그린다.
  function cellBoard(cells, cols, rows, label, scale, extra) {
    const xs = cells.map((c) => c[0]), ys = cells.map((c) => c[1]);
    const dx = Math.floor((cols - (Math.max(...xs) - Math.min(...xs) + 1)) / 2) - Math.min(...xs), dy = Math.floor((rows - (Math.max(...ys) - Math.min(...ys) + 1)) / 2) - Math.min(...ys);
    return G.board(cols, rows, [cellsArt(cells, dx, dy)].concat(extra || []), { grid: 'lines', scale: scale || 1, label });
  }
  // 모눈 위의 다각형을 가로 cols, 세로 rows 칸인 모눈판의 가운데에 그린다.
  function polyBoard(pts, cols, rows, label, scale, extra) {
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]), dx = Math.floor((cols - Math.max(...xs) - Math.min(...xs)) / 2), dy = Math.floor((rows - Math.max(...ys) - Math.min(...ys)) / 2), move = ([x, y]) => [x + dx, y + dy];
    return G.board(cols, rows, [gp(pts.map(move))].concat(extra ? extra(move) : []), { grid: 'lines', scale: scale || 1, label });
  }
  const tiles = (list) => G.tiles(list.map((svg, i) => [TAGS[i], svg]));
  const cellTile = (cells) => cellBoard(cells, 4, 3, `모눈 ${cells.length}칸을 차지하는 도형`);
  const inside = (pt, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i, i += 1) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > pt[1]) !== (yj > pt[1]) && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) c = !c; } return c; };
  // 변이 모눈의 선이나 칸의 대각선 위에 놓인 다각형이 차지하는 온 칸과 반 칸의 수
  function cellsOf(poly) {
    let full = 0, halves = 0;
    for (let x = 0; x < Math.max(...poly.map((p) => p[0])); x += 1) for (let y = 0; y < Math.max(...poly.map((p) => p[1])); y += 1) {
      const n = [[0.5, 0.2], [0.8, 0.5], [0.5, 0.8], [0.2, 0.5]].filter(([u, v]) => inside([x + u, y + v], poly)).length;
      if (n === 4) full += 1; else if (n === 2) halves += 1; else if (n) throw new Error('칸의 대각선을 따르지 않는 변');
    }
    return { full, halves };
  }

  // 5-1-6b.js, 5-1-6c.js 가 같은 도구를 쓴다(이 파일이 먼저 불린다).
  B.kit.area516 = { TAGS, MARKS, NAME, PYT, RAD, len, calc, setOptions, say, pickWord, mid, centre, place, scene, styled, tint, ghost, dashed, thin, word, half, beside, area2, outside, edges, height, dim, pgram, regular, gp, cellsArt, blob, cellBoard, polyBoard, tiles };

  const GRID = '모눈 한 칸의 넓이는 1 cm²이다. ';
  const HALVES = [[[1, 0], [3, 0], [4, 1], [4, 3], [0, 3], [0, 1]], [[2, 0], [4, 2], [4, 3], [0, 3], [0, 2]], [[0, 0], [3, 0], [5, 2], [2, 2]], [[1, 0], [4, 0], [5, 1], [4, 2], [1, 2], [0, 1]], [[0, 0], [2, 0], [4, 2], [4, 3], [0, 3]], [[1, 0], [3, 0], [4, 1], [3, 2], [1, 2], [0, 1]], [[1, 0], [4, 0], [5, 1], [5, 3], [0, 3], [0, 1]]];
  const SAME_AREA = [[6, 4], [6, 9], [8, 4], [10, 4], [10, 5], [12, 8], [12, 9], [12, 16], [15, 9], [18, 12], [20, 16]];
  const TILE_M2 = [[50, [8, 12, 16, 20, 24, 36]], [20, [25, 50, 75, 100]], [25, [16, 32, 48, 64]], [40, [25, 50, 75]]];

  B.addUnit({
    id: '5-1-6', grade: 5, semester: 1, no: 6, title: '다각형의 둘레와 넓이', version: 1,
    groups: [
      {
        id: 'peri', title: '다각형의 둘레', standard: PERI,
        types: [
          T('peri-sum', '변의 길이를 모두 더해 둘레 구하기', '②1 ③3 심4', (d) => {
            // 직각이 둘인 사각형: 위 t, 세로 h, 아래 t + out, 비스듬한 변 slant (out·h·slant 는 직각삼각형의 세 변)
            const [out, h, slant] = d.pick(PYT), t = d.int(Math.ceil(h / 2), h + 2), b = t + out, flip = d.bool();
            const raw = [[0, 0], [0, h], [b, h], [t, 0]].map(([x, y]) => [flip ? b - x : x, y]), sides = [h, b, slant, t], total = h + b + slant + t;
            return N('사각형의 둘레는 몇 cm인가?', total, {
              unit: 'cm', figure: scene(raw, (p) => [G.polygon(p)].concat(sides.map((v, i) => outside(p, i, len(v)))), { label: `네 변의 길이가 ${sides.map((v) => len(v)).join(', ')}인 사각형` }),
              explain: `둘레는 도형을 둘러싼 변의 길이를 모두 더한 것이다. ${sides.join(' + ')} = ${total}(cm)`, facts: calc(sides.join('+'))
            });
          }),
          T('peri-rect', '직사각형의 둘레', '①1·3 ②2 ③4 심4', (d, n) => {
            const [a, b] = d.until(() => [d.int(8, 28), d.int(5, 19)], ([x, y]) => x > y + 1), p = (a + b) * 2;
            if (n === 1) return N(`어느 직사각형의 가로와 세로를 더하면 ${a + b} cm이다. 이 직사각형의 둘레는 몇 cm인가?`, p, { unit: 'cm', explain: `직사각형의 둘레는 (가로 + 세로) × 2이다. ${a + b} × 2 = ${p}(cm)`, facts: calc(`${a + b}*2`, [2]) });
            return N(`가로가 ${a} cm, 세로가 ${b} cm인 직사각형 모양 액자의 테두리에 끈을 한 바퀴 둘러 붙이려고 한다. 필요한 끈은 몇 cm인가?`, p, {
              unit: 'cm', explain: `직사각형의 둘레는 (가로 + 세로) × 2이다. (${a} + ${b}) × 2 = ${p}(cm)`, facts: calc(`(${a}+${b})*2`, [2])
            });
          }, { count: 2 }),
          T('peri-para', '평행사변형의 둘레', '①1·3 ②3 ③5·7', (d) => {
            const [a, b] = d.until(() => [d.int(7, 16), d.int(4, 11)], ([x, y]) => x >= y + 2 && x <= y * 2 + 1), p = (a + b) * 2;
            return N('평행사변형의 둘레는 몇 cm인가?', p, {
              unit: 'cm', figure: scene(pgram(a, b, d.pick([55, 60, 65, 115, 120, 125])), (q) => [G.polygon(q), outside(q, 0, len(b)), outside(q, 1, len(a))], { label: `이웃한 두 변의 길이가 ${a} cm, ${b} cm인 평행사변형` }),
              explain: `평행사변형은 마주 보는 두 변의 길이가 같다. (${a} + ${b}) × 2 = ${p}(cm)`, facts: calc(`(${a}+${b})*2`, [2])
            });
          }),
          T('peri-rhombus', '마름모의 둘레', '①1·3 ②4 ③6·7', (d) => {
            const s = d.int(6, 19);
            return N(`한 변의 길이가 ${s} cm인 마름모 모양 거울의 테두리에 색 테이프를 한 바퀴 둘러 붙였다. 붙인 색 테이프는 몇 cm인가?`, s * 4, { unit: 'cm', explain: `마름모는 네 변의 길이가 모두 같다. ${s} × 4 = ${s * 4}(cm)`, facts: calc(`${s}*4`, [4]) });
          }),
          T('peri-regular', '정다각형의 둘레', '①2 ②5 ③1·2 심1', (d) => {
            const k = d.pick([3, 5, 6, 7, 8, 9]), s = d.int(4, 12);
            return N(`한 변의 길이가 ${s} cm인 ${NAME[k]}의 둘레는 몇 cm인가?`, s * k, { unit: 'cm', explain: `정다각형은 변의 길이가 모두 같으므로 둘레는 (한 변의 길이) × (변의 수)이다. ${s} × ${k} = ${s * k}(cm)`, facts: calc(`${s}*${k}`, [k]) });
          }),
          T('peri-formula', '둘레를 구하는 식', '①4 ②84 ③2·7 심2', (d, n) => {
            if (n === 1) return N('직사각형의 둘레는 ((가로) + (세로)) × ㉠으로 구한다. ㉠에 알맞은 수는?', 2, { explain: '직사각형에는 가로와 길이가 같은 변이 2개, 세로와 길이가 같은 변이 2개 있다. 그러므로 가로와 세로의 합을 2배 한다.', facts: calc('2', [2]) });
            return pickWord(d, '정다각형의 둘레는 (한 변의 길이) × ( ㉠ )으로 구한다. ㉠에 알맞은 말은?', '변의 수', ['대각선의 수', '한 각의 크기', '높이'], '정다각형은 변의 길이가 모두 같으므로 한 변의 길이에 변의 수를 곱하면 둘레가 된다.');
          }, { count: 2 }),
          T('peri-expr', '둘레를 구하는 식의 옳고 그름', '①5 ②6', (d) => {
            const [a, b] = d.until(() => [d.int(5, 12), d.int(3, 9)], ([x, y]) => x > y && x * y !== (x + y) * 2), p = (a + b) * 2;
            const wrong = d.pick([[`${a} + ${b} × 2`, `${a}+${b}*2`], [`${a} × ${b}`, `${a}*${b}`], [`(${a} + ${b}) × 4`, `(${a}+${b})*4`]]);
            const rows = d.shuffle([[`${a} + ${b} + ${a} + ${b}`, `${a}+${b}+${a}+${b}`], [`(${a} + ${b}) × 2`, `(${a}+${b})*2`], [`${a} × 2 + ${b} × 2`, `${a}*2+${b}*2`], wrong]);
            return C(`가로가 ${a} cm, 세로가 ${b} cm인 직사각형의 둘레를 구하는 식으로 옳지 않은 것은?`, rows.map((r) => r[0]), rows.indexOf(wrong), {
              explain: `직사각형의 둘레는 네 변의 길이를 모두 더한 ${a} + ${b} + ${a} + ${b} = ${p}(cm)이다. ${wrong[0]}의 값은 ${josa(p, '이/가')} 아니다.`,
              facts: { claimed: rows.map((r) => [r[1], p]), claimedWant: false }
            });
          }),
          T('peri-side-regular', '둘레에서 정다각형의 한 변 구하기', '①6 ②7 ③8 심3', (d) => {
            const k = d.pick([3, 5, 6, 7, 8, 9, 12]), s = d.int(4, 17);
            return N(`둘레가 ${s * k} cm인 ${NAME[k]}의 한 변의 길이는 몇 cm인가?`, s, { unit: 'cm', explain: `${NAME[k]}은 변 ${k}개의 길이가 모두 같다. ${s * k} ÷ ${k} = ${s}(cm)`, facts: calc(`${s * k}/${k}`, [k]) });
          }),
          T('peri-name', '한 변의 길이와 둘레로 정다각형의 이름 알기', '③9', (d) => {
            const ks = d.shuffle([3, 5, 6, 7, 8, 9, 10]).slice(0, 4), k = ks[0], s = d.int(4, 12), list = d.shuffle(ks);
            return C(`한 변의 길이가 ${s} cm이고 둘레가 ${s * k} cm인 정다각형의 이름은?`, list.map((v) => NAME[v]), list.indexOf(k), {
              explain: `정다각형의 둘레를 한 변의 길이로 나누면 변의 수가 나온다. ${s * k} ÷ ${s} = ${k}이므로 변이 ${k}개인 ${NAME[k]}이다.`, facts: { pick: { expr: `${s * k}/${s}`, options: list } }
            });
          }),
          T('peri-side-rect', '둘레와 한 변으로 다른 변 구하기', '①7·13 ②8·11 ③11·17 심6·9', (d, n) => {
            const [a, b] = d.until(() => [d.int(8, 19), d.int(4, 12)], ([x, y]) => x >= y + 2 && x <= y * 2 + 1), p = (a + b) * 2;
            if (n === 1) return N(`둘레가 ${p} cm인 평행사변형이다. □ 안에 알맞은 수는?`, b, {
              unit: 'cm', figure: scene(pgram(a, b, d.pick([55, 60, 65, 115, 120, 125])), (q) => [G.polygon(q), outside(q, 0, '□ cm'), outside(q, 1, len(a))], { label: `이웃한 두 변의 길이가 ${a} cm, □ cm인 평행사변형` }),
              explain: `이웃한 두 변의 길이의 합은 둘레의 반이다. ${p} ÷ 2 = ${p / 2}, ${p / 2} − ${a} = ${b}(cm)`, facts: calc(`${p}/2-${a}`, [2])
            });
            return N(`둘레가 ${p} cm인 직사각형이 있다. 가로가 ${a} cm일 때 세로는 몇 cm인가?`, b, { unit: 'cm', explain: `가로와 세로의 합은 둘레의 반이다. ${p} ÷ 2 = ${p / 2}, ${p / 2} − ${a} = ${b}(cm)`, facts: calc(`${p}/2-${a}`, [2]) });
          }, { count: 2 }),
          T('peri-compare', '여러 도형의 둘레 비교', '①8·9 ②10 ③13 심5', (d) => {
            const made = d.until(() => {
              const k = d.pick([5, 6, 8]), s = d.int(4, 9), a = d.int(8, 15), b = d.int(4, 9), r = d.int(6, 13);
              return { k, rows: [[`한 변의 길이가 ${s} cm인 ${NAME[k]}`, `${s}*${k}`, s * k], [`가로가 ${a} cm, 세로가 ${b} cm인 직사각형`, `(${a}+${b})*2`, (a + b) * 2], [`한 변의 길이가 ${r} cm인 마름모`, `${r}*4`, r * 4]] };
            }, (m) => new Set(m.rows.map((r) => r[2])).size === 3 && Math.max(...m.rows.map((r) => r[2])) - Math.min(...m.rows.map((r) => r[2])) <= 10);
            const rows = d.shuffle(made.rows), values = rows.map((r) => r[2]), long = d.bool(), at = values.indexOf(long ? Math.max(...values) : Math.min(...values));
            return C(`둘레가 가장 ${long ? '긴' : '짧은'} 도형은?`, MARKS.slice(0, 3), at, {
              figure: tagged(rows.map((r) => r[0]), MARKS), explain: `둘레를 차례로 구하면 ${rows.map((r, i) => `${MARKS[i]} ${r[2]} cm`).join(', ')}이다. 가장 ${long ? '긴' : '짧은'} 것은 ${MARKS[at]}이다.`,
              facts: { choose: { exprs: rows.map((r) => r[1]), rule: long ? 'max' : 'min' }, unseen: [made.k, 2, 4] }
            });
          }),
          T('peri-diff', '두 직사각형의 둘레의 차', '①9 ③13 심4', (d) => {
            const [a, b, c, e] = d.until(() => [d.int(12, 22), d.int(10, 20), d.int(12, 22), d.int(10, 20)], ([w, x, y, z]) => w < y && w + x > y + z && w + x - y - z <= 6 && w !== x && y !== z);
            return N(`가로가 ${a} m, 세로가 ${b} m인 직사각형 모양 밭 가와 가로가 ${c} m, 세로가 ${e} m인 직사각형 모양 밭 나가 있다. 두 밭의 둘레의 차는 몇 m인가?`, (a + b - c - e) * 2, {
              unit: 'm', explain: `가의 둘레는 (${a} + ${b}) × 2 = ${(a + b) * 2}(m), 나의 둘레는 (${c} + ${e}) × 2 = ${(c + e) * 2}(m)이다. ${(a + b) * 2} − ${(c + e) * 2} = ${(a + b - c - e) * 2}(m)`,
              facts: calc(`(${a}+${b})*2-(${c}+${e})*2`, [2])
            });
          }),
          T('peri-same', '둘레가 같은 두 도형에서 한 변 구하기', '①10 ②9 ③10·12 심7', (d) => {
            const k = d.pick([3, 5, 6, 8]), s = d.pick(k === 3 ? [8, 10, 12, 14] : k === 5 ? [4, 6, 8, 10, 12] : [4, 5, 6, 7, 8, 9]), p = s * k, a = d.int(Math.ceil(p / 4) + 1, p / 2 - 3), b = p / 2 - a;
            return N(`길이가 같은 끈 2개를 남김없이 써서 가로가 ${a} cm, 세로가 ${b} cm인 직사각형과 ${NAME[k]}을 한 개씩 만들었다. ${NAME[k]}의 한 변의 길이는 몇 cm인가?`, s, {
              unit: 'cm', explain: `직사각형의 둘레는 (${a} + ${b}) × 2 = ${p}(cm)이다. ${NAME[k]}의 둘레도 ${p} cm이므로 한 변의 길이는 ${p} ÷ ${k} = ${s}(cm)이다.`, facts: calc(`(${a}+${b})*2/${k}`, [2, k])
            });
          }),
          T('peri-joined', '정다각형 2개를 이어 붙인 도형의 둘레', '①11 ③14', (d) => {
            const k = d.pick([5, 6, 8]), s = d.int(3, 9) * (k === 8 ? 5 : 1), ap = 0.5 / Math.tan(Math.PI / k), left = regular(k, [-ap, 0]), right = left.map(([x, y]) => [-x, y]), edge = Math.floor(k / 2);
            return N(`한 변의 길이가 ${s} cm인 ${NAME[k]} 2개를 한 변이 꼭 맞닿게 이어 붙였다. 이어 붙여 만든 도형의 둘레는 몇 cm인가?`, s * (k * 2 - 2), {
              unit: 'cm', figure: scene(left.concat(right), (p) => [G.polygon(p.slice(0, k)), G.polygon(p.slice(k)), outside(p.slice(0, k), edge, len(s))], { box: [6, 3.4], pad: [1.9, 0.8], label: `한 변의 길이가 ${s} cm인 ${NAME[k]} 2개를 한 변이 맞닿게 이어 붙인 도형` }),
              explain: `맞닿은 변은 도형의 안쪽에 있으므로 둘레가 아니다. 겉에 있는 변은 ${k} × 2 − 2 = ${k * 2 - 2}(개)이므로 둘레는 ${s} × ${k * 2 - 2} = ${s * (k * 2 - 2)}(cm)이다.`,
              facts: calc(`${s}*(${k}*2-2)`, [k, 2])
            });
          }),
          T('peri-wire', '철사로 정다각형을 만들고 남은 길이', '②12', (d) => {
            const k = d.pick([5, 6, 8]), s = d.int(4, 9), rest = d.int(3, 12), total = s * k + rest;
            return N(`길이가 ${total} cm인 철사로 한 변의 길이가 ${s} cm인 ${NAME[k]}을 한 개 만들었다. 남은 철사는 몇 cm인가?`, rest, {
              unit: 'cm', explain: `${NAME[k]}의 둘레는 ${s} × ${k} = ${s * k}(cm)이다. 남은 철사는 ${total} − ${s * k} = ${rest}(cm)이다.`, facts: calc(`${total}-${s}*${k}`, [k])
            });
          }),
          T('peri-talk', '둘레에 대한 설명', '②16', (d) => {
            const s = d.int(4, 9), [a, b] = d.until(() => [d.int(7, 12), d.int(3, 6)], ([x, y]) => x * y !== (x + y) * 2), r = d.int(5, 9);
            const trues = [`둘레가 ${s * 8} cm인 정팔각형의 한 변의 길이는 ${s} cm이다.`, '한 변의 길이가 같은 마름모와 정사각형은 둘레가 같다.', `가로가 ${a} cm, 세로가 ${b} cm인 직사각형의 둘레는 ${(a + b) * 2} cm이다.`, `한 변의 길이가 ${r} cm인 정오각형의 둘레는 ${r * 5} cm이다.`];
            const falses = [`한 변의 길이가 ${r} cm인 정육각형의 둘레는 ${r * 5} cm이다.`, `가로가 ${a} cm, 세로가 ${b} cm인 직사각형의 둘레는 ${a * b} cm이다.`, `둘레가 ${r * 4} cm인 마름모의 한 변의 길이는 ${r * 2} cm이다.`];
            return say(d, '도형의 둘레에 대한 설명으로 옳지 않은 것은?', trues, falses, false, '정다각형과 마름모의 둘레는 (한 변의 길이) × (변의 수)이고, 직사각형의 둘레는 (가로 + 세로) × 2이다. 가로와 세로를 곱한 것은 둘레가 아니라 넓이이다.');
          })
        ]
      },
      {
        id: 'cm2', title: '1 cm²와 넓이 세기', standard: UNITS,
        types: [
          T('cm2-word', '1 cm²의 뜻과 읽기', '①14 ②17 ③18', (d, n) => (n === 0
            ? pickWord(d, '한 변의 길이가 1 cm인 정사각형의 넓이를 바르게 쓴 것은?', '1 cm²', ['1 cm', '4 cm²', '4 cm'], '한 변의 길이가 1 cm인 정사각형의 넓이를 1 cm²라 쓰고 1 제곱센티미터라고 읽는다.')
            : pickWord(d, '5 cm²를 바르게 읽은 것은?', '5 제곱센티미터', ['5 센티미터제곱', '5 센티미터', '제곱 5 센티미터'], '1 cm²는 1 제곱센티미터라고 읽는다. 5 cm²는 5 제곱센티미터이다.')), { count: 2 }),
          T('cm2-talk', '넓이의 단위에 대한 설명', '①15', (d) => say(d, '넓이의 단위 1 cm²에 대한 설명으로 옳은 것은?',
            ['한 변의 길이가 1 cm인 정사각형의 넓이이다.', '3 cm²는 1 cm²가 3개인 넓이이다.'],
            ['길이를 나타내는 단위이다.', '한 변의 길이가 1 cm인 정삼각형의 넓이이다.', '둘레가 1 cm인 정사각형의 넓이이다.', '1 센티미터라고 읽는다.'], true,
            '1 cm²는 한 변의 길이가 1 cm인 정사각형의 넓이이고 1 제곱센티미터라고 읽는다. 넓이는 1 cm²가 몇 개인지로 나타낸다.')),
          T('cm2-count', '단위넓이를 세어 넓이 구하기', '①16 ②18 ③19 심18', (d) => {
            const n = d.int(6, 11), cells = blob(d, n, 5, 3), has = new Set(cells.map((c) => c[0] + ',' + c[1])), flags = [];
            for (let x = 0; x < 5; x += 1) for (let y = 0; y < 3; y += 1) flags.push(has.has(x + ',' + y));
            return N(GRID + '색칠한 도형의 넓이는 몇 cm²인가?', n, { unit: 'cm²', figure: cellBoard(cells, 7, 5, `모눈 ${n}칸을 차지하는 도형`, 1.2), explain: `도형에 1 cm²인 칸이 ${n}개 들어 있으므로 넓이는 ${n} cm²이다.`, facts: { count: flags } });
          }),
          T('cm2-find', '넓이가 정해진 도형 찾기', '①17 ②20·22 ③20·23 심18·22', (d) => {
            const t = d.int(5, 8), areas = d.shuffle([t].concat(d.shuffle([t - 2, t - 1, t + 1, t + 2]).slice(0, 3))), at = areas.indexOf(t);
            return C(GRID + `넓이가 ${t} cm²인 도형은?`, TAGS.slice(0, 4), at, {
              figure: tiles(areas.map((a) => cellTile(blob(d, a, 4, 3)))), explain: `칸을 세면 ${areas.map((a, i) => `${TAGS[i]} ${a}칸`).join(', ')}이다. ${t}칸인 ${TAGS[at]}의 넓이가 ${t} cm²이다.`,
              facts: { kindPick: { kinds: areas.map(String), target: String(t) } }
            });
          }),
          T('cm2-odd', '넓이가 다른 도형 찾기', '①18 ②20 ③21 심19', (d) => {
            const t = d.int(5, 8), other = t + d.pick([-1, 1]), areas = d.shuffle([t, t, t, other]), at = areas.indexOf(other);
            const shapes = d.until(() => areas.map((a) => blob(d, a, 4, 3)), (list) => new Set(list.map((cells) => cells.map((c) => c.join()).sort().join(' '))).size === 4);
            return C(GRID + '넓이가 나머지 셋과 다른 도형은?', TAGS.slice(0, 4), at, {
              figure: tiles(shapes.map(cellTile)), explain: `칸을 세면 ${areas.map((a, i) => `${TAGS[i]} ${a}칸`).join(', ')}이다. 모양이 달라도 칸의 수가 같으면 넓이가 같다. ${TAGS[at]}만 ${other}칸이다.`,
              facts: { choose: { exprs: areas.map(String), rule: 'odd' } }
            });
          }),
          T('cm2-most', '가장 넓은 도형 찾기', '①18 ②21 ③22 심19', (d) => {
            const areas = d.shuffle([4, 5, 6, 7, 8, 9, 10]).slice(0, 4), wide = d.bool(), at = areas.indexOf(wide ? Math.max(...areas) : Math.min(...areas));
            return C(GRID + `넓이가 가장 ${wide ? '넓은' : '좁은'} 도형은?`, TAGS.slice(0, 4), at, {
              figure: tiles(areas.map((a) => cellTile(blob(d, a, 4, 3)))), explain: `칸을 세면 ${areas.map((a, i) => `${TAGS[i]} ${a}칸`).join(', ')}이다. 칸이 가장 ${wide ? '많은' : '적은'} ${TAGS[at]}의 넓이가 가장 ${wide ? '넓다' : '좁다'}.`,
              facts: { choose: { exprs: areas.map(String), rule: wide ? 'max' : 'min' } }
            });
          }),
          T('cm2-diff', '두 도형의 넓이의 차', '①18 ②21 ③22 심19', (d) => {
            const b = d.int(4, 8), a = b + d.int(1, 4);
            return N(GRID + '도형 가는 도형 나보다 몇 cm² 더 넓은가?', a - b, {
              unit: 'cm²', figure: tiles([cellTile(blob(d, a, 4, 3)), cellTile(blob(d, b, 4, 3))]), explain: `가는 ${a}칸이므로 ${a} cm², 나는 ${b}칸이므로 ${b} cm²이다. ${a} − ${b} = ${a - b}(cm²)`, facts: calc(`${a}-${b}`)
            });
          }),
          T('cm2-times', '넓이가 몇 배인지 구하기', '①16·18 ③22 심19', (d) => {
            const a = d.pick([2, 3]), k = d.pick(a === 2 ? [2, 3, 4, 5] : [2, 3, 4]);
            return N(GRID + '도형 나의 넓이는 도형 가의 넓이의 몇 배인가?', k, {
              unit: '배', figure: tiles([cellTile(blob(d, a, 3, 2)), cellTile(blob(d, a * k, 4, 3))]), explain: `가는 ${a}칸이므로 ${a} cm², 나는 ${a * k}칸이므로 ${a * k} cm²이다. ${a * k} ÷ ${a} = ${k}(배)`, facts: calc(`${a * k}/${a}`)
            });
          }),
          T('cm2-half', '반 칸이 섞인 도형의 넓이', '①49 ②19 심20', (d) => {
            const poly = d.pick(HALVES), { full, halves } = cellsOf(poly), area = full + halves / 2, rows = Math.max(...poly.map((p) => p[1])) + 2;
            return N(GRID + '도형의 넓이는 몇 cm²인가?', area, {
              unit: 'cm²', figure: polyBoard(poly, 7, rows, `모눈종이 위의 도형. 온 칸 ${full}개와 반 칸 ${halves}개를 차지한다.`, 1.2),
              explain: `온 칸이 ${full}개, 반 칸이 ${halves}개이다. 반 칸 2개는 한 칸과 넓이가 같으므로 ${full} + ${halves} ÷ 2 = ${area}(cm²)이다.`, facts: calc(`${full}+${halves}/2`, [2])
            });
          }),
          T('cm2-fill', '판에서 채우지 않은 부분의 넓이', '①19 심21', (d) => {
            const k = d.int(9, 16), cells = blob(d, k, 6, 4), frame = styled(G.polygon([[1, 1], [7, 1], [7, 5], [1, 5]]), 'fill:none;stroke-width:2.2');
            return N(`모눈 한 칸의 넓이가 1 cm²인 직사각형 모양 판에 조각을 놓았더니 색칠한 부분만큼 채워졌다. 판에서 조각이 놓이지 않은 부분의 넓이는 몇 cm²인가?`, 24 - k, {
              unit: 'cm²', figure: G.board(8, 6, [cellsArt(cells, 1, 1), frame], { grid: 'lines', scale: 1.15, label: `가로 6칸, 세로 4칸인 판. 색칠한 칸은 ${k}개` }),
              explain: `판은 6 × 4 = 24(칸)이고 색칠한 칸은 ${k}개이다. 색칠하지 않은 칸은 24 − ${k} = ${24 - k}(개)이므로 ${24 - k} cm²이다.`, facts: calc(`6*4-${k}`)
            });
          })
        ]
      },
      {
        id: 'rect', title: '직사각형과 정사각형의 넓이', standard: RECT,
        types: [
          T('rect-grid', '한 줄의 칸 수와 줄 수로 넓이 구하기', '①21 ②24 ③24·45', (d) => {
            const [a, b] = d.until(() => [d.int(3, 7), d.int(2, 5)], ([x, y]) => x !== y);
            return M('모눈 한 칸의 넓이는 1 cm²이다. 직사각형에 1 cm²가 가로 한 줄에 몇 개씩 몇 줄 놓이는지 세어 넓이를 구하시오.', [{ label: '한 줄에', answer: a, unit: '개' }, { label: '줄 수', answer: b, unit: '줄' }, { label: '넓이', answer: a * b, unit: 'cm²' }], {
              figure: polyBoard([[0, 0], [a, 0], [a, b], [0, b]], a + 2, b + 2, `가로 ${a}칸, 세로 ${b}칸인 직사각형`, 1.1),
              explain: `1 cm²가 가로 한 줄에 ${a}개씩 ${b}줄 놓인다. ${a} × ${b} = ${a * b}이므로 넓이는 ${a * b} cm²이다.`, facts: { calc: [[String(a), 0], [String(b), 1], [`${a}*${b}`, 2]] }
            });
          }),
          T('rect-area', '직사각형의 넓이', '①22 ②25 ③25·26 심24', (d) => {
            const [a, b] = d.until(() => [d.int(9, 24), d.int(6, 15)], ([x, y]) => x > y);
            return N(`가로가 ${a} cm, 세로가 ${b} cm인 직사각형 모양 수첩의 넓이는 몇 cm²인가?`, a * b, { unit: 'cm²', explain: `직사각형의 넓이는 (가로) × (세로)이다. ${a} × ${b} = ${a * b}(cm²)`, facts: calc(`${a}*${b}`) });
          }),
          T('rect-square', '정사각형의 넓이', '①23 ②26 ③27', (d) => {
            const s = d.int(7, 25);
            return N(`한 변의 길이가 ${s} cm인 정사각형 모양 손수건의 넓이는 몇 cm²인가?`, s * s, { unit: 'cm²', explain: `정사각형의 넓이는 (한 변의 길이) × (한 변의 길이)이다. ${s} × ${s} = ${s * s}(cm²)`, facts: calc(`${s}*${s}`) });
          }),
          T('rect-both', '직사각형의 둘레와 넓이', '①22·79 심24', (d) => {
            const [a, b] = d.until(() => [d.int(7, 15), d.int(4, 9)], ([x, y]) => x > y && x * y !== (x + y) * 2);
            return M(`가로가 ${a} cm, 세로가 ${b} cm인 직사각형의 둘레와 넓이를 구하시오.`, [{ label: '둘레', answer: (a + b) * 2, unit: 'cm' }, { label: '넓이', answer: a * b, unit: 'cm²' }], {
              explain: `둘레는 변의 길이를 모두 더한 것이므로 (${a} + ${b}) × 2 = ${(a + b) * 2}(cm)이다. 넓이는 (가로) × (세로)이므로 ${a} × ${b} = ${a * b}(cm²)이다.`, facts: { calc: [[`(${a}+${b})*2`, 0], [`${a}*${b}`, 1]], unseen: [2] }
            });
          }),
          T('rect-to-side', '넓이와 한 변으로 다른 변 구하기', '①25 ②28 ③28 심26', (d) => {
            const a = d.int(6, 16), b = d.until(() => d.int(4, 14), (v) => v !== a);
            return N(`넓이가 ${a * b} cm²이고 세로가 ${b} cm인 직사각형의 가로는 몇 cm인가?`, a, { unit: 'cm', explain: `(가로) × ${b} = ${a * b}이므로 가로는 ${a * b} ÷ ${b} = ${a}(cm)이다.`, facts: calc(`${a * b}/${b}`) });
          }),
          T('rect-square-side', '넓이에서 정사각형의 한 변 구하기', '①26 ②29 ③29 심26', (d) => {
            const s = d.int(4, 12);
            return N(`넓이가 ${s * s} cm²인 정사각형의 한 변의 길이는 몇 cm인가?`, s, { unit: 'cm', explain: `같은 수를 두 번 곱하여 ${josa(s * s, '이/가')} 되는 수를 찾는다. ${s} × ${s} = ${s * s}이므로 한 변의 길이는 ${s} cm이다.`, facts: { range: { ineq: `x*x>${s * s - 1}`, lo: 1, hi: 30, want: 'min' } } });
          }),
          T('rect-most', '넓이가 가장 넓은 사각형', '①27 ②27 ③31 심25', (d) => {
            const made = d.until(() => {
              const s = d.int(9, 14), a = d.int(s + 1, s + 6), b = d.int(s - 5, s - 1), c = d.int(s + 2, s + 8), e = d.int(s - 6, s - 2);
              return [[`가로가 ${a} cm, 세로가 ${b} cm인 직사각형`, `${a}*${b}`, a * b], [`한 변의 길이가 ${s} cm인 정사각형`, `${s}*${s}`, s * s], [`가로가 ${c} cm, 세로가 ${e} cm인 직사각형`, `${c}*${e}`, c * e]];
            }, (rows) => new Set(rows.map((r) => r[2])).size === 3 && Math.max(...rows.map((r) => r[2])) - Math.min(...rows.map((r) => r[2])) <= 15 && rows[0][0] !== rows[2][0]);
            const rows = d.shuffle(made), values = rows.map((r) => r[2]), at = values.indexOf(Math.max(...values));
            return C('넓이가 가장 넓은 사각형은?', MARKS.slice(0, 3), at, {
              figure: tagged(rows.map((r) => r[0]), MARKS), explain: `넓이를 차례로 구하면 ${rows.map((r, i) => `${MARKS[i]} ${r[2]} cm²`).join(', ')}이다. 가장 넓은 것은 ${MARKS[at]}이다.`,
              facts: { choose: { exprs: rows.map((r) => r[1]), rule: 'max' } }
            });
          }),
          T('rect-diff', '두 직사각형의 넓이의 차', '①27 ②27 ③46 심25', (d) => {
            const [a, b, c, e] = d.until(() => [d.int(14, 30), d.int(9, 16), d.int(9, 20), d.int(5, 12)], ([w, x, y, z]) => w > x && y > z && w * x > y * z + 20);
            return N(`가로가 ${a} m, 세로가 ${b} m인 직사각형 모양 놀이터는 가로가 ${c} m, 세로가 ${e} m인 직사각형 모양 꽃밭보다 몇 m² 더 넓은가?`, a * b - c * e, {
              unit: 'm²', explain: `놀이터의 넓이는 ${a} × ${b} = ${a * b}(m²), 꽃밭의 넓이는 ${c} × ${e} = ${c * e}(m²)이다. ${a * b} − ${c * e} = ${a * b - c * e}(m²)`, facts: calc(`${a}*${b}-${c}*${e}`)
            });
          }),
          T('rect-same', '넓이가 같은 정사각형과 직사각형', '①28 ②30 ③32 심27', (d) => {
            const [s, b] = d.pick(SAME_AREA), a = (s * s) / b;
            return N(`한 변의 길이가 ${s} cm인 정사각형과 넓이가 같은 직사각형이 있다. 이 직사각형의 세로가 ${b} cm일 때 가로는 몇 cm인가?`, a, {
              unit: 'cm', explain: `정사각형의 넓이는 ${s} × ${s} = ${s * s}(cm²)이다. 직사각형의 넓이도 ${s * s} cm²이므로 가로는 ${s * s} ÷ ${b} = ${a}(cm)이다.`, facts: calc(`${s}*${s}/${b}`)
            });
          }),
          T('rect-peri-area', '둘레에서 넓이 구하기', '①29 ②31·32 ③30 심29·30·38', (d, n) => {
            if (n === 1) { const s = d.int(6, 19); return N(`둘레가 ${s * 4} cm인 정사각형의 넓이는 몇 cm²인가?`, s * s, { unit: 'cm²', explain: `한 변의 길이는 ${s * 4} ÷ 4 = ${s}(cm)이다. 넓이는 ${s} × ${s} = ${s * s}(cm²)이다.`, facts: calc(`(${s * 4}/4)*(${s * 4}/4)`, [4]) }); }
            const [a, b] = d.until(() => [d.int(7, 22), d.int(5, 18)], ([x, y]) => x !== y), p = (a + b) * 2;
            return N(`둘레가 ${p} cm이고 세로가 ${b} cm인 직사각형의 넓이는 몇 cm²인가?`, a * b, {
              unit: 'cm²', explain: `가로와 세로의 합은 ${p} ÷ 2 = ${p / 2}(cm)이므로 가로는 ${p / 2} − ${b} = ${a}(cm)이다. 넓이는 ${a} × ${b} = ${a * b}(cm²)이다.`, facts: calc(`(${p}/2-${b})*${b}`, [2])
            });
          }, { count: 2 }),
          T('rect-area-peri', '넓이에서 둘레 구하기', '①30 ②33', (d, n) => {
            if (n === 1) { const s = d.int(5, 12); return N(`넓이가 ${s * s} m²인 정사각형 모양 꽃밭의 둘레는 몇 m인가?`, s * 4, { unit: 'm', explain: `${s} × ${s} = ${s * s}이므로 한 변의 길이는 ${s} m이다. 둘레는 ${s} × 4 = ${s * 4}(m)이다.`, facts: { range: { ineq: `x*x>${s * s * 16 - 1}`, lo: 1, hi: 100, want: 'min' } } }); }
            const [a, b] = d.until(() => [d.int(8, 25), d.int(5, 16)], ([x, y]) => x !== y);
            return N(`넓이가 ${a * b} cm²이고 가로가 ${a} cm인 직사각형의 둘레는 몇 cm인가?`, (a + b) * 2, {
              unit: 'cm', explain: `세로는 ${a * b} ÷ ${a} = ${b}(cm)이다. 둘레는 (${a} + ${b}) × 2 = ${(a + b) * 2}(cm)이다.`, facts: calc(`(${a * b}/${a}+${a})*2`, [2])
            });
          }, { count: 2 }),
          T('rect-tiles', '정사각형 타일 여러 장의 넓이', '①32 ③19 심38', (d) => {
            const s = d.int(3, 9), k = d.pick([12, 15, 16, 18, 20, 24, 25]);
            return N(`한 변의 길이가 ${s} cm인 정사각형 모양 타일 ${k}장을 겹치지 않게 이어 붙였다. 이어 붙인 타일 전체의 넓이는 몇 cm²인가?`, s * s * k, {
              unit: 'cm²', explain: `타일 한 장의 넓이는 ${s} × ${s} = ${s * s}(cm²)이다. ${k}장의 넓이는 ${s * s} × ${k} = ${s * s * k}(cm²)이다.`, facts: calc(`${s}*${s}*${k}`)
            });
          }),
          T('rect-cover', '직사각형을 덮는 색종이의 수', '①32', (d) => {
            const s = d.pick([2, 4, 5]), a = s * d.int(6, 12), b = s * d.int(3, 8);
            return N(`가로가 ${a} cm, 세로가 ${b} cm인 직사각형 모양 판을 한 변의 길이가 ${s} cm인 정사각형 모양 색종이로 겹치지 않게 빈틈없이 덮으려고 한다. 색종이는 몇 장 필요한가?`, (a / s) * (b / s), {
              unit: '장', explain: `판의 넓이는 ${a} × ${b} = ${a * b}(cm²), 색종이 한 장의 넓이는 ${s} × ${s} = ${s * s}(cm²)이다. ${a * b} ÷ ${s * s} = ${(a / s) * (b / s)}(장)`, facts: calc(`${a}*${b}/(${s}*${s})`)
            });
          }),
          T('rect-biggest-square', '직사각형에서 잘라 낸 가장 큰 정사각형', '②35 ③15 심36', (d, n) => {
            const b = d.int(8, 16), a = b + d.int(3, 12);
            return n === 0
              ? N(`가로가 ${a} cm, 세로가 ${b} cm인 직사각형 모양 종이를 잘라 만들 수 있는 가장 큰 정사각형의 넓이는 몇 cm²인가?`, b * b, { unit: 'cm²', explain: `정사각형은 네 변의 길이가 같으므로 한 변의 길이는 짧은 변의 길이인 ${b} cm까지 될 수 있다. ${b} × ${b} = ${b * b}(cm²)`, facts: calc(`${b}*${b}`) })
              : N(`가로가 ${a} cm, 세로가 ${b} cm인 직사각형 모양 종이에서 가장 큰 정사각형을 한 개 잘라 냈다. 남은 종이의 넓이는 몇 cm²인가?`, (a - b) * b, { unit: 'cm²', explain: `잘라 낸 정사각형의 한 변의 길이는 ${b} cm이다. 남은 종이는 가로가 ${a} − ${b} = ${a - b}(cm), 세로가 ${b} cm인 직사각형이므로 ${a - b} × ${b} = ${(a - b) * b}(cm²)이다.`, facts: calc(`(${a}-${b})*${b}`) });
          }, { count: 2 }),
          T('rect-stretch', '변을 줄이고 늘여 만든 직사각형의 넓이', '②36 ③33', (d) => {
            const s = d.int(8, 15), x = d.int(2, 5), y = d.until(() => d.int(2, 7), (v) => v !== x);
            return N(`한 변의 길이가 ${s} cm인 정사각형의 가로를 ${x} cm 줄이고 세로를 ${y} cm 늘여 직사각형을 만들었다. 이 직사각형의 넓이는 몇 cm²인가?`, (s - x) * (s + y), {
              unit: 'cm²', explain: `가로는 ${s} − ${x} = ${s - x}(cm), 세로는 ${s} + ${y} = ${s + y}(cm)이다. ${s - x} × ${s + y} = ${(s - x) * (s + y)}(cm²)`, facts: calc(`(${s}-${x})*(${s}+${y})`)
            });
          }),
          T('rect-lshape', '직사각형 둘로 나누거나 큰 직사각형에서 빼어 구하는 넓이', '②94 ③90 심39', (d) => {
            const W = d.int(9, 14), H = d.int(7, 10), w = d.int(3, W - 4), h = d.int(3, H - 3), flip = d.bool();
            const raw = [[0, 0], [W - w, 0], [W - w, h], [W, h], [W, H], [0, H]].map(([x, y]) => [flip ? W - x : x, y]);
            return N('이웃한 변이 모두 수직으로 만나는 도형이다. 이 도형의 넓이는 몇 cm²인가?', W * H - w * h, {
              unit: 'cm²', figure: scene(raw, (p) => [G.polygon(p), outside(p, 0, len(W - w)), outside(p, 3, len(H - h)), outside(p, 4, len(W)), outside(p, 5, len(H))], { box: [5.6, 4], label: `직사각형의 한 귀퉁이를 직사각형 모양으로 잘라 낸 도형. 아래쪽 변 ${W} cm, 긴 세로 변 ${H} cm, 위쪽 변 ${W - w} cm, 짧은 세로 변 ${H - h} cm` }),
              explain: `가로 ${W} cm, 세로 ${H} cm인 직사각형에서 가로 ${W} − ${W - w} = ${w}(cm), 세로 ${H} − ${H - h} = ${h}(cm)인 직사각형을 뺀다. ${W} × ${H} − ${w} × ${h} = ${W * H - w * h}(cm²)`,
              facts: calc(`${W}*${H}-(${W}-${W - w})*(${H}-${H - h})`)
            });
          })
        ]
      },
      {
        id: 'units', title: '1 m²와 1 km²', standard: UNITS,
        types: [
          T('unit-word', '1 m², 1 km²의 뜻과 읽기', '①14 ②39 ③36', (d, n) => (n === 0
            ? pickWord(d, '한 변의 길이가 1 m인 정사각형의 넓이를 바르게 쓴 것은?', '1 m²', ['1 m', '4 m²', '100 cm²'], '한 변의 길이가 1 m인 정사각형의 넓이를 1 m²라 쓰고 1 제곱미터라고 읽는다.')
            : pickWord(d, '한 변의 길이가 1 km인 정사각형의 넓이를 바르게 읽은 것은?', '1 제곱킬로미터', ['1 킬로미터제곱', '1 킬로미터', '1 제곱미터'], '한 변의 길이가 1 km인 정사각형의 넓이를 1 km²라 쓰고 1 제곱킬로미터라고 읽는다.')), { count: 2 }),
          T('unit-relation', '넓이 단위 사이의 관계', '①34 ②40 ③37', (d, n) => (n === 0
            ? N('한 변의 길이가 1 m인 정사각형에는 1 cm²가 가로 한 줄에 100개씩 100줄 놓인다. 1 m²는 몇 cm²인가?', 10000, { unit: 'cm²', explain: '1 m = 100 cm이므로 1 m² = 100 cm × 100 cm = 10000 cm²이다.', facts: calc('100*100') })
            : N('한 변의 길이가 1 km인 정사각형에는 1 m²가 가로 한 줄에 1000개씩 1000줄 놓인다. 1 km²는 몇 m²인가?', 1000000, { unit: 'm²', explain: '1 km = 1000 m이므로 1 km² = 1000 m × 1000 m = 1000000 m²이다.', facts: calc('1000*1000') })), { count: 2 }),
          T('unit-m2', 'm²와 cm² 바꾸기', '①35 ②40 ③38 심43', (d, n) => {
            const a = d.int(2, 9) * d.pick([1, 1, 10]) + d.pick([0, 0, 3, 7]);
            return n === 0
              ? N(`${a} m²는 몇 cm²인가?`, a * 10000, { unit: 'cm²', explain: `1 m² = 10000 cm²이다. ${a} m² = ${a * 10000} cm²`, facts: calc(`${a}*10000`, [10000]) })
              : N(`${a * 10000} cm²는 몇 m²인가?`, a, { unit: 'm²', explain: `10000 cm² = 1 m²이다. ${a * 10000} cm² = ${a} m²`, facts: calc(`${a * 10000}/10000`, [10000]) });
          }, { count: 2 }),
          T('unit-km2', 'km²와 m² 바꾸기', '①35 ②40 ③39 심43', (d, n) => {
            const a = d.int(2, 9) * d.pick([1, 1, 10, 100]) + d.pick([0, 0, 4, 6]);
            return n === 0
              ? N(`${a} km²는 몇 m²인가?`, a * 1000000, { unit: 'm²', explain: `1 km² = 1000000 m²이다. ${a} km² = ${a * 1000000} m²`, facts: calc(`${a}*1000000`, [1000000]) })
              : N(`${a * 1000000} m²는 몇 km²인가?`, a, { unit: 'km²', explain: `1000000 m² = 1 km²이다. ${a * 1000000} m² = ${a} km²`, facts: calc(`${a * 1000000}/1000000`, [1000000]) });
          }, { count: 2 }),
          T('unit-compare', '단위가 다른 두 넓이의 크기 비교', '①36 ②42 ③40 심46', (d) => {
            const km = d.bool(), big = km ? 1000000 : 10000, [small, large] = km ? ['m²', 'km²'] : ['cm²', 'm²'], y = d.int(2, 95), x = y * big * d.pick([1, 1, 10]) / d.pick([1, 10]), swap = d.bool();
            const sides = [[`${x} ${small}`, String(x)], [`${y} ${large}`, `${y}*${big}`]], [l, r] = swap ? [sides[1], sides[0]] : sides, lv = swap ? y * big : x, rv = swap ? x : y * big;
            return C('두 넓이의 크기를 비교하여 ○ 안에 알맞은 것을 고르시오.', ['&gt;', '=', '&lt;'], lv > rv ? 0 : lv === rv ? 1 : 2, {
              figure: lines([`${l[0]} ○ ${r[0]}`]), explain: `1 ${large} = ${big} ${small}이므로 ${y} ${large} = ${y * big} ${small}이다. ${x} ${small}와 비교하면 ${l[0]} ${lv > rv ? '&gt;' : lv === rv ? '=' : '&lt;'} ${r[0]}이다.`,
              facts: { choose: { exprs: [l[1], r[1]], rule: 'compare' }, unseen: [big] }
            });
          }),
          T('unit-claims', '단위를 바르게 바꾸었는지 가리기', '①37 ②41 심45', (d) => {
            const [a, b, c] = d.shuffle([2, 3, 4, 5, 6, 7, 8, 9]), bad = d.int(0, 2), up = d.bool();
            const rows = [[(v) => `${a} m² = ${v} cm²`, `${a}*10000`, a * 10000], [(v) => `${v} m² = ${b} km²`, `${b}*1000000`, b * 1000000], [(v) => `${v} cm² = ${c} m²`, `${c}*10000`, c * 10000]];
            const said = rows.map((r, i) => (i === bad ? (up ? r[2] * 10 : r[2] / 10) : r[2]));
            return C('넓이의 단위를 바꾼 것 가운데 옳지 않은 것은?', MARKS.slice(0, 3), bad, {
              figure: tagged(rows.map((r, i) => r[0](said[i])), MARKS), explain: `1 m² = 10000 cm², 1 km² = 1000000 m²이다. ${MARKS[bad]}은 ${rows[bad][0](rows[bad][2])}로 고쳐야 한다.`,
              facts: { claimed: rows.map((r, i) => [r[1], said[i]]), claimedWant: false }
            });
          }),
          T('unit-order', '단위가 다른 넓이를 넓은 것부터 늘어놓기', '③40 심47', (d) => {
            const [a, c] = d.shuffle([2, 3, 4, 5, 6, 7, 8]), b = d.until(() => d.int(11, 95), (v) => v % 10 !== 0 && Math.abs(v - a * 10) > 2 && Math.abs(v - c * 10) > 2);
            const rows = d.shuffle([[`${a} km²`, `${a}*1000000`, a * 1000000], [`${b * 100000} m²`, String(b * 100000), b * 100000], [`${c * 1000000} m²`, String(c * 1000000), c * 1000000]]);
            const right = [0, 1, 2].sort((x, y) => rows[y][2] - rows[x][2]), all = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
            const orders = d.shuffle([right].concat(d.shuffle(all.filter((o) => o.join() !== right.join())).slice(0, 3)));
            return C('넓이가 넓은 것부터 차례대로 쓴 것은?', orders.map((o) => o.map((i) => MARKS[i]).join(', ')), orders.findIndex((o) => o.join() === right.join()), {
              figure: tagged(rows.map((r) => r[0]), MARKS), explain: `단위를 m²로 맞추면 ${rows.map((r, i) => `${MARKS[i]} ${r[2]} m²`).join(', ')}이다. 넓은 것부터 쓰면 ${right.map((i) => MARKS[i]).join(', ')}이다.`,
              facts: { choose: { exprs: rows.map((r) => r[1]), rule: 'descending', orders }, unseen: [1000000] }
            });
          }),
          T('unit-choose', '알맞은 넓이의 단위 고르기', '①39 ②46 ③43 심49', (d) => {
            const [thing, want] = d.pick([['공책 표지', 'cm²'], ['손바닥', 'cm²'], ['엽서', 'cm²'], ['교실 바닥', 'm²'], ['학교 운동장', 'm²'], ['거실 바닥', 'm²'], ['제주도', 'km²'], ['우리나라', 'km²'], ['한라산 국립 공원', 'km²']]), options = d.shuffle(['cm²', 'm²', 'km²']);
            return C(`${thing}의 넓이를 나타내기에 가장 알맞은 단위는?`, options, options.indexOf(want), {
              explain: `손에 들 수 있는 작은 물건은 cm², 방이나 운동장처럼 사람이 들어가는 곳은 m², 도시나 섬처럼 아주 넓은 땅은 km²로 나타낸다. ${thing}의 넓이는 ${want}로 나타내기에 알맞다.`,
              facts: { truth: options.map((o) => o === want), want: true }
            });
          }),
          T('unit-wrong', '넓이의 단위를 잘못 쓴 것 찾기', '③44 심50', (d) => say(d, '넓이의 단위를 알맞게 쓰지 않은 것은?',
            ['공책 표지의 넓이는 약 500 cm²이다.', '교실 바닥의 넓이는 약 65 m²이다.', '축구 경기장의 넓이는 약 7000 m²이다.', '우표 한 장의 넓이는 약 6 cm²이다.', '제주도의 넓이는 약 1850 km²이다.'],
            ['칠판의 넓이는 약 4 km²이다.', '휴대 전화 화면의 넓이는 약 100 m²이다.', '제주도의 넓이는 약 1850 cm²이다.', '방문의 넓이는 약 2 cm²이다.'], false,
            '손에 들 수 있는 물건의 넓이는 cm², 방·교실·경기장의 넓이는 m², 도시나 섬의 넓이는 km²로 나타낸다. 칠판과 방문은 m², 휴대 전화 화면은 cm², 제주도는 km²로 나타내야 알맞다.')),
          T('unit-len-area', '길이의 단위를 바꾸어 넓이 구하기', '①40 ②45 ③47 심51', (d, n) => {
            const [a, b] = d.until(() => [d.int(3, 18), d.int(2, 9)], ([x, y]) => x > y);
            if (n === 0) return N(`가로가 ${a * 100} cm, 세로가 ${b * 100} cm인 직사각형 모양 벽의 넓이는 몇 m²인가?`, a * b, { unit: 'm²', explain: `${a * 100} cm = ${a} m, ${b * 100} cm = ${b} m이다. ${a} × ${b} = ${a * b}(m²)`, facts: calc(`(${a * 100}/100)*(${b * 100}/100)`, [100]) });
            if (n === 1) return N(`가로가 ${a * 1000} m, 세로가 ${b * 1000} m인 직사각형 모양 땅의 넓이는 몇 km²인가?`, a * b, { unit: 'km²', explain: `${a * 1000} m = ${a} km, ${b * 1000} m = ${b} km이다. ${a} × ${b} = ${a * b}(km²)`, facts: calc(`(${a * 1000}/1000)*(${b * 1000}/1000)`, [1000]) });
            return N(`가로가 ${a} km, 세로가 ${b} km인 직사각형 모양 숲의 넓이는 몇 m²인가?`, a * b * 1000000, { unit: 'm²', explain: `넓이는 ${a} × ${b} = ${a * b}(km²)이다. 1 km² = 1000000 m²이므로 ${a * b} km² = ${a * b * 1000000} m²이다.`, facts: calc(`${a}*${b}*1000000`, [1000000]) });
          }, { count: 3 }),
          T('unit-tiles', '타일 여러 장의 넓이를 m²로 나타내기', '①32 심54', (d) => {
            const [s, counts] = d.pick(TILE_M2), k = d.pick(counts), total = s * s * k;
            return N(`한 변의 길이가 ${s} cm인 정사각형 모양 타일 ${k}장을 겹치지 않게 이어 붙여 바닥을 덮었다. 타일로 덮은 바닥의 넓이는 몇 m²인가?`, total / 10000, {
              unit: 'm²', explain: `타일 한 장의 넓이는 ${s} × ${s} = ${s * s}(cm²)이므로 ${k}장의 넓이는 ${s * s} × ${k} = ${total}(cm²)이다. 10000 cm² = 1 m²이므로 ${total} cm² = ${total / 10000} m²이다.`, facts: calc(`${s}*${s}*${k}/10000`, [10000])
            });
          })
        ]
      },
      { id: 'para', title: '평행사변형의 넓이', standard: AREA, types: [] },
      { id: 'tri', title: '삼각형의 넓이', standard: AREA, types: [] },
      { id: 'trap', title: '사다리꼴의 넓이', standard: AREA, types: [] },
      { id: 'rhom', title: '마름모의 넓이', standard: AREA, types: [] },
      { id: 'mix', title: '여러 도형의 넓이', standard: AREA, types: [] }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
