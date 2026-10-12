// 4학년 1학기 4단원 삼각형 — 단원 틀과 기본 문항(변의 길이에 따라 분류하기, 이등변삼각형의 성질, 정삼각형의 성질).
// 수집해 둔 교과서 9종의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1~3: 65·74·68꼴, 심화꼴 64꼴)을 번호마다 따져,
// 꼴마다 ① 몇 학년 무슨 단원 내용인가 ② 무엇을 하게 하는 문제인가를 보고 실었다.
// (각의 크기에 따라 분류하기, 두 가지 기준으로 분류하기의 기본 문항과 실력 문항은 4-1-4b.js에 있다. 대조표는 수집본의 _분석/4-1-4/싣기_대조표.md)
//
// 싣는 기준
//  - 주는 것(글·그림의 얼개), 묻는 것, 푸는 길이 다르면 다른 문제다. 수만 다르거나 상황만 다른 것은 한 번만 싣는다
//    (세 변의 길이로 이름 쓰기 ②5·막대 셋으로 만든 삼각형의 이름 ①7은 「세 변의 길이를 보고 고르기」와, 표에 나누어 쓰기 ②7 ③9는 「그림에서 찾기」와 같은 판단).
//  - 그림은 적힌 수대로 그린다(이등변삼각형은 이등변으로, 60°는 60°로). 길이와 각도를 함께 적는 이등변삼각형은 수가 서로 맞는 것만 골라 쓴다(ISO).
//  - 「이등변삼각형을 모두 고르기」에는 정삼각형을 섞지 않는다. 정삼각형을 이등변삼각형으로 치느냐에 따라 답이 갈리기 때문이다
//    (교과서는 이 포함 관계를 가볍게만 다룬다. 포함 관계 그 자체를 묻는 문항 하나만 실력에 있다).
//
// 뺀 것과 까닭
//  - 세 변의 길이의 합(①34~42 ②14~21 ③33~39 심13~22, ②41·심40의 변형): 둘레는 5학년 「다각형의 둘레와 넓이」이다.
//    끈·철사로 만든 삼각형의 한 변, 이어 붙인 도형의 굵은 선도 같은 갈래다. 출판사가 이 단원에 실었다는 것은 근거가 아니다.
//  - 그리기·재기·표시하기(①10·11 ②12·13·34·35 ③8·17·63·64 심30), 까닭·같은 점·알게 된 점 쓰기(①12·13 ②30·40 ③20 심5·29·58·59, ③19·심27의 까닭 쓰기), 놀이(③68)
//  - 종이를 접어 겹친 각(②32 ③21 일부 ①25·33 심25): 접어 겹친 데서 같은 각을 읽는 것은 5학년 합동·대칭이다.
//    접어 자른 종이가 이등변삼각형이 되는 것(①9 ②8 ③10 심6)은 이 단원의 도입 활동이라 이름만 묻는다.
//  - 분류 기준이 분명한지 가리기(②2): 2학년 「분류하기」 내용이다. 기준을 스스로 정해 쓰기(심59)는 서술형이다.
//  - 뜻 없는 셈: 두 각의 합·차(①19 ②31 ③29, ①27·②37의 변형), 종류마다 센 수끼리 더하기(②53·심46의 변형)
//  - 막대 두 쌍으로 만들 수 있는 이등변삼각형의 수(심11): 경우 세기. 같은 생각(어느 변과도 같을 수 있다)은 「나머지 한 변이 될 수 있는 길이」가 묻는다.
//  - 삼각자의 각(③23)·색종이로 접은 삼각형(①33)·이어 붙인 삼각형의 변을 따라 길이 옮기기(심12): 뽑은 글에 그림이 없어 얼개를 알 수 없다.
//  - 각도를 거듭 셈하는 문제(직사각형·원 안의 이등변삼각형의 각, 이어 붙인 정삼각형의 각, 한 직선 위의 각): 이 단원은 도형 영역이다. 각도를 더하고 빼는 셈은 「각도」 단원(측정)의 일이고, 이어 붙인 도형에서 각을 좇는 것은 중학교 「삼각형·사각형의 성질」「평행선의 성질」 꼴이다(교육과정: 성질은 관찰·측정 같은 귀납으로 이해한다).
//    한 삼각형에 성질을 바로 대는 것(크기가 같은 두 각, 나머지 한 각, 정삼각형의 한 각)만 남겼다(2026-10-12 사용자 지적으로 걷어 냄).
// 각도는 수에 붙여 적고(70°) 길이는 띄어 적는다(7 cm). 묻는 말: 값을 물으면 "~은?", 양을 물으면 "몇 도인가?/몇 cm인가?".
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { table, N, C } = B.kit;
  const G = B.kit.geo;
  const SIDE = '4수03-08', ANGLE = '4수03-09';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const TAGS = ['가', '나', '다', '라', '마'];
  const CIRCLED = ['①', '②', '③', '④'];
  const RAD = Math.PI / 180;

  // ── 그림 ─────────────────────────────────────────────────────
  const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  const mirrored = (points) => points.map(([x, y]) => [-x, y]);
  // 판 안에 맞추기: 가로 box[0], 세로 box[1] 칸을 넘지 않게 키우고 둘레에 여백 pad 를 둔다.
  function place(raw, box, pad) {
    const xs = raw.map((p) => p[0]), ys = raw.map((p) => p[1]), x0 = Math.min(...xs), y0 = Math.min(...ys), w = Math.max(...xs) - x0, h = Math.max(...ys) - y0;
    const k = Math.min(box[0] / w, box[1] / h);
    return { points: raw.map(([x, y]) => [(x - x0) * k + pad[0], (y - y0) * k + pad[1]]), cols: w * k + pad[0] * 2, rows: h * k + pad[1] * 2 };
  }
  // 그림 하나를 휴대폰 카드 너비(300px)를 넘지 않게 그린다. label 에는 그림 속 길이·각도를 글로 적는다.
  const draw = (fit, parts, label, scale) => G.board(fit.cols, fit.rows, parts, { grid: false, scale: Math.min(scale || 1.15, 296 / (32 + fit.cols * 22)), label });
  // 세 변의 길이로 그린 삼각형 [왼쪽 아래, 오른쪽 아래, 위]
  function bySides(base, left, right) {
    const a = Math.acos((left * left + base * base - right * right) / (2 * left * base));
    return [[0, 0], [base, 0], [left * Math.cos(a), -left * Math.sin(a)]];
  }
  // 꼭짓점 v 에서 p 쪽과 q 쪽으로 벌어진 각에 호(직각이면 직각 표시)와 글을 넣는다. 좁은 각은 글이 두 변에 닿지 않게 멀리 적는다.
  // limit: 꼭짓점에서 맞은편 변까지의 거리. 글이 그 변을 넘지 않게 당겨 적는다(납작한 삼각형).
  function wedge(v, p, q, label, r, limit) {
    const a = G.bearing(v, p), b = G.bearing(v, q);
    let from = Math.min(a, b), to = Math.max(a, b);
    if (to - from > 180) { const t = from + 360; from = to; to = t; }
    const open = to - from, way = (from + to) / 2, right = Math.abs(open - 90) < 0.01, half = Math.max(String(label || '').length * 0.17 + 0.12, 0.38);
    // 글이 꼭짓점에서 맞은편 변 쪽으로 차지하는 길이(글은 눕혀 적으므로 옆으로 갈수록 길다)
    const reach = half * Math.abs(Math.cos(way * RAD)) + 0.3 * Math.abs(Math.sin(way * RAD));
    const near = (r || 0.6) + 0.62, far = Math.min(Math.max(near, half / Math.tan((open / 2) * RAD)), limit ? limit - reach - 0.12 : 3);
    // 좁은 각은 글이 꼭짓점에서 멀어지므로 호도 글 바로 앞까지 크게 그려 어느 각의 글인지 알 수 있게 한다.
    const size = far > near + 0.01 ? Math.max(r || 0.6, far - reach - 0.12) : Math.min(r || 0.6, Math.max(0.3, far - 0.52));
    return (right ? G.squareMark(v, from, to) : G.arc(v, from, to, size)) + (label ? G.text(G.toward(v, right ? 1.05 : far, way), label, 'mb-label is-length') : '');
  }
  // 다각형의 꼭짓점 i 안쪽에 각 표시와 글을 넣는다. 삼각형이면 글이 맞은편 변에 닿지 않게 한다.
  function corner(points, i, label, r) {
    const n = points.length, v = points[i], p = points[(i + n - 1) % n], q = points[(i + 1) % n];
    if (n !== 3) return wedge(v, p, q, label, r);
    const unit = (w) => { const size = Math.hypot(w[0], w[1]); return [w[0] / size, w[1] / size]; }, u1 = unit(G.sub(p, v)), u2 = unit(G.sub(q, v)), u = unit([u1[0] + u2[0], u1[1] + u2[1]]);
    return wedge(v, p, q, label, r, G.cross(G.sub(p, v), G.sub(q, p)) / G.cross(u, G.sub(q, p)));
  }
  // 변 p–q 의 바깥쪽(점 away 의 반대쪽)에 글을 적는다.
  function sideSpot(p, q, away, value) {
    const m = mid(p, q), len = Math.hypot(q[0] - p[0], q[1] - p[1]);
    let n = [-(q[1] - p[1]) / len, (q[0] - p[0]) / len];
    if ((away[0] - m[0]) * n[0] + (away[1] - m[1]) * n[1] > 0) n = [-n[0], -n[1]];
    const off = 0.42 + Math.abs(n[0]) * String(value).length * 0.15;
    return [m[0] + n[0] * off, m[1] + n[1] * off];
  }
  const sideText = (p, q, away, value) => G.text(sideSpot(p, q, away, value), value, 'mb-label is-length');
  const sideOf = (points, i, j, value) => sideText(points[i], points[j], points[3 - i - j], value);
  const tinted = (points) => G.polygon(points).replace('class="mb-poly"', 'class="mb-poly" style="fill:#fcd34d"');
  // 삼각형 여럿을 두 줄로 늘어놓고 가, 나, 다 … 를 붙인다. cells: [{ raw: 꼭짓점 셋, sides: [변 0–1, 변 0–2, 변 1–2 에 적을 글] }]
  function gallery(cells, label) {
    const W = 6, H = 4.4, parts = [], PAIRS = [[0, 1], [0, 2], [1, 2]];
    cells.forEach((cell, i) => {
      // 삼각형과 변에 적은 글을 한 덩어리로 보고 칸의 가운데에 놓는다(옆 칸의 글과 붙지 않게).
      const ox = (i % 2) * W, oy = Math.floor(i / 2) * H, at = place(cell.raw, [3.1, 2.3], [0, 0]).points;
      const spots = PAIRS.map(([a, b], k) => { const c = sideSpot(at[a], at[b], at[3 - a - b], cell.sides[k]), half = cell.sides[k].length * 0.16; return [[c[0] - half, c[1] - 0.3], [c[0] + half, c[1] + 0.3]]; });
      const all = at.concat(...spots), xs = all.map((p) => p[0]), ys = all.map((p) => p[1]);
      const dx = ox + (W - Math.max(...xs) - Math.min(...xs)) / 2, dy = oy + 0.25 + (H - Math.max(...ys) - Math.min(...ys)) / 2, points = at.map(([x, y]) => [x + dx, y + dy]);
      parts.push(G.polygon(points), G.text([ox + 0.3, oy + 0.4], TAGS[i]));
      PAIRS.forEach(([a, b], k) => parts.push(sideOf(points, a, b, cell.sides[k])));
      if (cell.square) points.forEach((_, v) => { if (Math.abs(G.angleOf(points, v) - 90) < 0.01) parts.push(corner(points, v)); });
    });
    return G.board(W * 2 - 0.3, Math.ceil(cells.length / 2) * H - 0.2, parts, { grid: false, scale: 1, label });
  }
  const cm = (v) => v + ' cm';
  const sidesCell = (s) => ({ raw: bySides(s[0], s[1], s[2]), sides: s.map(cm) });
  const told = (list) => '삼각형 ' + list.length + '개. ' + list.map((s, i) => `${TAGS[i]}: 세 변의 길이 ${s.map(cm).join(', ')}`).join(' / ');
  // 밑변의 두 각이 b° 인 이등변삼각형 [왼쪽 아래 ㄴ, 오른쪽 아래 ㄷ, 위 ㄱ]. 납작한 것은 넓게, 뾰족한 것은 높게 그려 각에 적은 글이 서로 닿지 않게 한다.
  const isoFit = (b) => place(G.triangle(b, b, 1, [0, 0]), [b <= 40 ? 7 : 5.4, 5.6], [1.5, 0.95]);
  const NAMES3 = ['ㄴ', 'ㄷ', 'ㄱ'];
  // 서로의 중심을 지나는 크기가 같은 두 원: 중심 ㄱ, ㄴ 과 두 원이 만나는 점 ㄷ
  function twoCircles(radius) {
    const r = 2.3, a = [3.1, 3.2], b = [a[0] + r, a[1]], c = [a[0] + r / 2, a[1] - (r * Math.sqrt(3)) / 2];
    const ring = (p) => G.circle(p, r).replace('class="mb-poly"', 'class="mb-poly is-plain"');
    const parts = [ring(a), ring(b), G.polygon([a, b, c]), G.point(a), G.point(b), G.point(c), G.text([a[0] - 0.45, a[1] + 0.42], 'ㄱ'), G.text([b[0] + 0.45, b[1] + 0.42], 'ㄴ'), G.text([c[0], c[1] - 0.5], 'ㄷ')]
      .concat(radius ? [G.text([(a[0] + b[0]) / 2, a[1] + 0.45], cm(radius), 'mb-label is-length')] : []);
    return G.board(a[0] + r * 2 + 0.8, a[1] + r + 0.9, parts, { grid: false, scale: 1.2, label: '크기가 같은 두 원이 서로의 중심 ㄱ, ㄴ을 지난다. 두 원이 만나는 점 ㄷ과 두 중심을 이은 삼각형 ㄱㄴㄷ' + (radius ? `. 선분 ㄱㄴ의 길이 ${radius} cm` : '') });
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

  // ── 그림 감 ──────────────────────────────────────────────────
  // 세 변의 길이(cm). 어느 변을 밑에 놓아도 삼각형이 너무 납작하지 않은 것만 골랐다.
  const ISO_SIDES = [[5, 5, 8], [6, 6, 4], [7, 7, 4], [4, 4, 6], [8, 8, 5], [5, 5, 3], [6, 6, 9], [7, 7, 10]];
  const OTHER_SIDES = [[4, 5, 6], [5, 6, 8], [4, 6, 7], [5, 7, 9], [6, 7, 9], [4, 7, 8], [6, 8, 9], [5, 6, 7], [7, 8, 10], [6, 9, 10]];
  const sideKind = (s) => (new Set(s).size === 1 ? 'equi' : new Set(s).size === 2 ? 'iso' : 'other');
  // 길이와 각도를 함께 적는 이등변삼각형: [크기가 같은 두 각, 밑변 cm, 길이가 같은 두 변 cm]. 길이는 각도에 맞는 값(오차 4% 안)이다.
  const ISO = [[30, 7, 4], [35, 10, 6], [40, 9, 6], [50, 9, 7], [55, 7, 6], [65, 5, 6], [70, 7, 10], [75, 5, 10]];
  const lattice = (cols, rows) => { const out = []; for (let x = 0; x <= cols; x += 1) for (let y = 0; y <= rows; y += 1) out.push([x, y]); return out; };
  const len2 = (p, q) => G.len2(G.sub(p, q));
  const sides2 = (t) => [len2(t[0], t[1]), len2(t[1], t[2]), len2(t[0], t[2])];
  const isoLattice = (t) => new Set(sides2(t)).size < 3;
  // 눈으로 보아도 세 변의 길이가 모두 다른가(가장 가까운 두 변의 길이가 15% 넘게 다르다)
  const plainlyUneven = (t) => { const s = sides2(t).map(Math.sqrt).sort((x, y) => x - y); return s[1] / s[0] > 1.15 && s[2] / s[1] > 1.15; };

  B.addUnit({
    id: '4-1-4', grade: 4, semester: 1, no: 4, title: '삼각형', version: 3,
    groups: [
      {
        id: 'sides', title: '변의 길이에 따라 삼각형 분류하기', standard: SIDE,
        types: [
          T('sides-word', '뜻에 맞는 삼각형의 이름', '①1 ②1 ③1 심3', (d) => {
            const [say, want] = d.pick([['두 변의 길이가 같은 삼각형', '이등변삼각형'], ['세 변의 길이가 같은 삼각형', '정삼각형']]);
            const list = d.shuffle(['이등변삼각형', '정삼각형', '직각삼각형', '둔각삼각형']);
            return C(`${say}을 무엇이라고 하는가?`, list, list.indexOf(want), { explain: `${say}을 ${want}이라고 한다.`, facts: { truth: list.map((word) => word === want), want: true } });
          }),
          T('sides-find-iso', '그림에서 이등변삼각형 찾기', '①2 ②3·7 ③2·9 심1', (d) => {
            // 정삼각형은 섞지 않는다(정삼각형을 이등변삼각형으로 치느냐에 따라 답이 갈린다).
            const picks = d.shuffle(d.shuffle(ISO_SIDES).slice(0, 2).concat(d.shuffle(OTHER_SIDES).slice(0, 2))).map((s) => d.shuffle(s));
            const flags = picks.map((s) => sideKind(s) === 'iso'), made = setOptions(d, TAGS.slice(0, 4), flags);
            return C('이등변삼각형을 모두 고른 것은?', made.options, made.answer, {
              figure: gallery(picks.map(sidesCell), told(picks)),
              explain: `두 변의 길이가 같은 삼각형이 이등변삼각형이다. ${TAGS.filter((_, i) => flags[i]).join(', ')}는 두 변의 길이가 같고, 나머지는 세 변의 길이가 모두 다르다.`,
              facts: { sets: { labels: TAGS.slice(0, 4), flags, options: made.sets } }
            });
          }),
          T('sides-find-equi', '그림에서 정삼각형 찾기', '①3 ②4·7 ③3·9 심1', (d) => {
            const s = d.int(4, 8), two = d.shuffle(ISO_SIDES).slice(0, 2), picks = d.shuffle([[s, s, s], d.shuffle(two[0]), d.shuffle(two[1]), d.shuffle(d.pick(OTHER_SIDES))]);
            const kinds = picks.map(sideKind), at = kinds.indexOf('equi');
            return C('정삼각형은?', TAGS.slice(0, 4), at, {
              figure: gallery(picks.map(sidesCell), told(picks)), explain: `세 변의 길이가 같은 삼각형이 정삼각형이다. ${TAGS[at]}는 세 변의 길이가 모두 ${s} cm이다.`,
              facts: { kindPick: { kinds: kinds.map((kind, i) => (kind === 'equi' ? 'equi' : 'no' + i)), target: 'equi' } }
            });
          }),
          T('sides-list-iso', '세 변의 길이를 보고 이등변삼각형 고르기', '①4·7 ②5·6 ③4 심2', (d) => {
            const rows = d.shuffle([d.pick(ISO_SIDES)].concat(d.shuffle(OTHER_SIDES).slice(0, 3))).map((s) => d.shuffle(s)), at = rows.findIndex((s) => sideKind(s) === 'iso');
            return C('세 변의 길이가 다음과 같은 삼각형 가운데 이등변삼각형은?', rows.map((s) => s.map(cm).join(', ')), at, {
              explain: `두 변의 길이가 같은 삼각형이 이등변삼각형이다. 세 변의 길이가 ${rows[at].map(cm).join(', ')}인 삼각형은 두 변의 길이가 같다.`,
              facts: { kindPick: { kinds: rows.map((s, i) => (sideKind(s) === 'iso' ? 'iso' : 'no' + i)), target: 'iso' } }
            });
          }),
          T('sides-list-equi', '세 변의 길이를 보고 정삼각형 고르기', '②6 ③4 심2', (d) => {
            // 두 변만 같은 삼각형을 섞는다(같은 수가 보이면 정삼각형이라고 여기는 아이가 고른다).
            const s = d.int(5, 9), t = d.pick([s - 2, s - 1, s + 1, s + 2]), [u, v] = d.until(() => [d.int(4, 10), d.int(4, 10)], ([x, y]) => x !== y && x !== s && x * 2 > y);
            const rows = d.shuffle([[s, s, s], d.shuffle([s, s, t]), d.shuffle([u, u, v]), d.shuffle(d.pick(OTHER_SIDES))]), at = rows.findIndex((r) => sideKind(r) === 'equi');
            return C('세 변의 길이가 다음과 같은 삼각형 가운데 정삼각형은?', rows.map((r) => r.map(cm).join(', ')), at, {
              explain: `세 변의 길이가 같은 삼각형이 정삼각형이다. 세 변의 길이가 모두 ${s} cm인 삼각형을 고른다. 두 변의 길이만 같은 삼각형은 이등변삼각형이다.`,
              facts: { kindPick: { kinds: rows.map((r, i) => (sideKind(r) === 'equi' ? 'equi' : 'no' + i)), target: 'equi' } }
            });
          }),
          T('sides-sticks', '정삼각형을 만들 막대 고르기', '①8 ③12', (d) => {
            const base = d.int(5, 9), lengths = [base, base + 1, base + 2], counts = d.shuffle([3, d.int(1, 2), d.int(1, 2)]), at = counts.indexOf(3);
            return C('길이가 다른 세 가지 막대가 있다. 이 가운데 3개를 골라 세 변으로 하는 정삼각형을 한 개 만들려고 한다. 골라야 하는 막대는?', lengths.map((v) => `${v} cm인 막대`), at, {
              figure: table(['막대의 길이', '막대의 수'], lengths.map((v, i) => [cm(v), counts[i] + '개'])),
              explain: `정삼각형은 세 변의 길이가 같으므로 길이가 같은 막대가 3개 있어야 한다. ${lengths[at]} cm인 막대만 3개 있다.`,
              facts: { only: { values: counts, test: 'atLeast', target: 3 } }
            });
          }),
          T('sides-side-iso', '이등변삼각형의 변의 길이', '①5 ②9 ③6 심7', (d) => {
            const [leg, base] = d.until(() => [d.int(5, 12), d.int(4, 12)], ([k, b]) => b !== k && b * 2 >= k && b * 2 <= k * 3);
            const fit = place(bySides(base, leg, leg), [5, 4.2], [1.6, 0.95]), p = fit.points, left = d.bool();
            return N(`삼각형 ㄱㄴㄷ은 변 ㄱㄴ과 변 ㄱㄷ의 길이가 같은 이등변삼각형이다. 변 ${left ? 'ㄱㄷ' : 'ㄱㄴ'}의 길이는 몇 cm인가?`, leg, {
              unit: 'cm', figure: draw(fit, [G.polygon(p), G.vertexLabels(p, NAMES3), sideOf(p, left ? 0 : 1, 2, cm(leg)), sideOf(p, 0, 1, cm(base))], `삼각형 ㄱㄴㄷ. 변 ${left ? 'ㄱㄴ' : 'ㄱㄷ'}의 길이 ${leg} cm, 변 ㄴㄷ의 길이 ${base} cm`),
              explain: `변 ㄱㄴ과 변 ㄱㄷ의 길이가 같으므로 변 ${left ? 'ㄱㄷ' : 'ㄱㄴ'}의 길이는 변 ${left ? 'ㄱㄴ' : 'ㄱㄷ'}의 길이와 같은 ${leg} cm이다.`, facts: { calc: [[String(leg), 0]] }
            });
          }),
          T('sides-side-equi', '정삼각형의 변의 길이', '①5 ②10 ③7 심7', (d) => {
            const s = d.int(3, 15), fit = place(bySides(1, 1, 1), [4.6, 4.2], [1.6, 0.95]), p = fit.points, [given, ask] = d.pick([[[0, 2], 'ㄴㄷ'], [[0, 1], 'ㄱㄷ'], [[1, 2], 'ㄱㄴ']]);
            const said = { '0,2': 'ㄱㄴ', '0,1': 'ㄴㄷ', '1,2': 'ㄱㄷ' }[given.join()];
            return N(`삼각형 ㄱㄴㄷ은 정삼각형이다. 변 ${ask}의 길이는 몇 cm인가?`, s, {
              unit: 'cm', figure: draw(fit, [G.polygon(p), G.vertexLabels(p, NAMES3), sideOf(p, given[0], given[1], cm(s))], `정삼각형 ㄱㄴㄷ. 변 ${said}의 길이 ${s} cm`),
              explain: `정삼각형은 세 변의 길이가 같으므로 변 ${ask}의 길이도 ${s} cm이다.`, facts: { calc: [[String(s), 0]] }
            });
          }),
          T('sides-third', '이등변삼각형의 나머지 한 변이 될 수 있는 길이', '①6 ②11 ③5 심10', (d) => {
            // 어느 변과도 같을 수 있어 답이 둘이다. 두 경우 모두 삼각형이 되는 수만 쓴다(짧은 변 둘을 더하면 긴 변보다 길다).
            const [a, b] = d.until(() => [d.int(4, 9), d.int(5, 13)], ([x, y]) => x < y && x * 2 > y + 1);
            const values = [a, b, b - a, a + b], labels = values.map(cm);
            const makes = (v) => { const s = [a, b, v].sort((x, y) => x - y); return (v === a || v === b) && s[0] + s[1] > s[2]; };
            const flags = values.map(makes), sets = d.shuffle([[labels[0]], [labels[1]], [labels[0], labels[1]], [labels[2], labels[3]]]);
            return C(`두 변의 길이가 ${a} cm, ${b} cm인 이등변삼각형이 있다. 나머지 한 변의 길이가 될 수 있는 것을 모두 고른 것은?`, sets.map((s) => s.join(', ')), sets.findIndex((s) => s.length === 2 && s[0] === labels[0]), {
              explain: `이등변삼각형은 두 변의 길이가 같다. 나머지 한 변이 ${a} cm이면 세 변이 ${a} cm, ${a} cm, ${b} cm이고, ${b} cm이면 ${a} cm, ${b} cm, ${b} cm이다. 두 경우 모두 이등변삼각형이다.`,
              facts: { sets: { labels, flags, options: sets } }
            });
          }),
          T('sides-fold', '접어서 자른 종이를 펼친 삼각형', '①9 ②8 ③10 심6', (d) => {
            // 접은 채로 한 번에 자르면 겹쳐 있던 두 변이 같이 잘린다. 접힌 조각은 직각삼각형이지만 펼친 삼각형에는 직각이 없다.
            const flip = d.bool(), x0 = 2.9, y0 = 0.5, w = 2.4, h = 4.4, side = (x) => (flip ? x0 * 2 + w - x : x);
            const fold = side(x0), open = side(x0 + w), top = [fold, y0 + 0.6], foot = [fold, y0 + h], out = [side(x0 + 1.7), y0 + h];
            const parts = [tinted([top, foot, out]).replace('fill:#fcd34d', 'fill:#fcd34d;stroke:none'), G.line([fold, y0], [open, y0]), G.line([open, y0], [open, y0 + h]), G.line([open, y0 + h], [fold, y0 + h]), G.line(top, out), G.line([fold, y0], [fold, y0 + h], 'mb-line is-cut'),
              G.text([fold + (flip ? 1.25 : -1.25), y0 + 1.6], '접은 곳', 'mb-label is-small')];
            const list = d.shuffle(['이등변삼각형', '직각삼각형', '세 변의 길이가 모두 다른 삼각형']);
            return C('색종이를 반으로 접은 다음, 접은 채로 그림과 같이 선을 긋고 그 선을 따라 잘랐다. 색칠한 부분을 펼치면 어떤 삼각형이 되는가?', list, list.indexOf('이등변삼각형'), {
              figure: G.board(x0 * 2 + w, y0 + h + 0.5, parts, { grid: false, scale: 1.2, label: '반으로 접은 색종이. 접은 곳의 한 점에서 아래쪽 변의 한 점까지 비스듬히 선을 그어, 접은 곳에 닿아 있는 삼각형 부분을 색칠하였다.' }),
              explain: '접은 채로 자르면 겹쳐 있던 두 변이 한꺼번에 잘리므로 펼친 삼각형은 두 변의 길이가 같다. 두 변의 길이가 같은 삼각형은 이등변삼각형이다.',
              facts: { truth: list.map((word) => word === '이등변삼각형'), want: true }
            });
          }),
          T('sides-circles', '두 원으로 그린 삼각형의 이름', '③11', (d) => {
            // 세 변이 모두 반지름이다(3학년 2학기 「원」과 잇는다). 이등변삼각형은 보기에 넣지 않는다(정삼각형도 이등변삼각형이라 답이 갈린다).
            const r = d.int(3, 9), list = d.shuffle(['정삼각형', '직각삼각형', '둔각삼각형', '세 변의 길이가 모두 다른 삼각형']);
            return C(`반지름이 ${r} cm인 두 원이 서로의 중심 ㄱ, ㄴ을 지난다. 두 원이 만나는 점 ㄷ과 두 원의 중심을 이어 삼각형 ㄱㄴㄷ을 그렸다. 삼각형 ㄱㄴㄷ은 어떤 삼각형인가?`, list, list.indexOf('정삼각형'), {
              figure: twoCircles(r), explain: `변 ㄱㄴ, 변 ㄱㄷ, 변 ㄴㄷ은 모두 원의 반지름이라 길이가 ${r} cm로 같다. 세 변의 길이가 같으므로 정삼각형이다.`,
              facts: { truth: list.map((word) => word === '정삼각형'), want: true }
            });
          }),
          T('sides-point', '이등변삼각형이 되는 점', '③31', (d) => {
            // 선분의 두 끝 점에서 같은 거리에 있는 점은 선분의 한가운데 위에 있다. 나머지 점과 이으면 세 변의 길이가 눈에 띄게 다르다.
            const [a, b] = d.pick([[[1, 4], [5, 4]], [[2, 4], [6, 4]], [[1, 4], [3, 4]], [[3, 4], [5, 4]], [[0, 4], [4, 4]]]), middle = (a[0] + b[0]) / 2;
            const spots = lattice(6, 3), far = (p, q) => Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]) >= 2;
            const points = d.until(() => d.shuffle(spots).slice(0, 4), (list) => list.filter((c) => c[0] === middle).length === 1 && list.every((c) => (c[0] === middle ? isoLattice([a, b, c]) : !isoLattice([a, b, c]) && plainlyUneven([a, b, c])))
              && list.every((p, i) => list.every((q, j) => i === j || far(p, q))));
            const base = [G.line(a, b), G.point(a), G.point(b), G.text([a[0] - 0.1, a[1] + 0.6], 'ㄱ'), G.text([b[0] + 0.1, b[1] + 0.6], 'ㄴ')].concat(points.map((p, i) => G.point(p) + G.text([p[0] + 0.5, p[1] - 0.35], CIRCLED[i], 'mb-label is-small')));
            const at = points.findIndex((c) => isoLattice([a, b, c]));
            return C('선분 ㄱㄴ의 두 끝 점과 한 점을 이어 이등변삼각형을 그리려고 한다. 이어야 할 점은?', CIRCLED, at, {
              figure: G.board(6, 5, base, { grid: 'dots', scale: 1.4, label: '점 종이 위의 선분 ㄱㄴ과 점 넷' }),
              explain: `점 ${CIRCLED[at]}${['은', '는', '은', '는'][at]} 점 ㄱ과 점 ㄴ에서 같은 거리에 있다. 이으면 두 변의 길이가 같은 삼각형이 된다.` + G.board(6, 5, [G.polygon([a, b, points[at]])].concat(base), { grid: 'dots', label: '이등변삼각형' }),
              facts: { kindPick: { kinds: points.map((c, i) => (isoLattice([a, b, c]) ? 'iso' : 'no' + i)), target: 'iso' } }
            });
          })
        ]
      },
      {
        id: 'iso', title: '이등변삼각형의 성질', standard: SIDE,
        types: [
          T('iso-word', '이등변삼각형의 성질', '①14 ②22 ③1', (d) => {
            const rows = d.shuffle([['두 각의 크기가 같다.', true], ['세 각의 크기가 모두 다르다.', false], ['세 각의 크기가 언제나 모두 같다.', false], ['세 변의 길이가 모두 다르다.', false]]);
            return C('이등변삼각형에 대한 설명으로 옳은 것은?', rows.map(([text]) => text), rows.findIndex(([, ok]) => ok), {
              explain: '이등변삼각형은 두 변의 길이가 같고, 길이가 같은 두 변에 있는 두 각의 크기가 같다.', facts: { truth: rows.map(([, ok]) => ok), want: true }
            });
          }),
          T('iso-same-angles', '크기가 같은 두 각', '①15 ②23 ③17', (d) => {
            const b = d.pick([40, 50, 70, 75]), fit = isoFit(b), p = fit.points;
            const rows = d.shuffle([['각 ㄱㄴㄷ과 각 ㄱㄷㄴ', true], ['각 ㄴㄱㄷ과 각 ㄱㄴㄷ', false], ['각 ㄴㄱㄷ과 각 ㄱㄷㄴ', false]]);
            return C('삼각형 ㄱㄴㄷ에서 변 ㄱㄴ과 변 ㄱㄷ의 길이가 같다. 크기가 같은 두 각은?', rows.map(([text]) => text), rows.findIndex(([, ok]) => ok), {
              figure: draw(fit, [G.polygon(p), G.vertexLabels(p, NAMES3)], '변 ㄱㄴ과 변 ㄱㄷ의 길이가 같은 삼각형 ㄱㄴㄷ'),
              explain: '이등변삼각형은 길이가 같은 두 변에 있는 두 각의 크기가 같다. 변 ㄱㄴ과 변 ㄱㄷ이 만나는 각 ㄴㄱㄷ을 뺀 나머지 두 각, 곧 각 ㄱㄴㄷ과 각 ㄱㄷㄴ의 크기가 같다.',
              facts: { truth: rows.map(([, ok]) => ok), want: true }
            });
          }),
          T('iso-base-base', '크기가 같은 두 각 가운데 하나', '①16 ②24 ③13 심23', (d) => {
            const [b, , leg] = d.pick(ISO), fit = isoFit(b), p = fit.points, left = d.bool();
            return N('삼각형에서 ㉠의 크기는 몇 도인가?', b, {
              unit: '°', figure: draw(fit, [G.polygon(p), sideOf(p, 0, 2, cm(leg)), sideOf(p, 1, 2, cm(leg)), corner(p, left ? 0 : 1, b + '°'), corner(p, left ? 1 : 0, '㉠')], `두 변의 길이가 ${leg} cm로 같은 삼각형. 길이가 같은 두 변에 있는 두 각 가운데 하나는 ${b}°, 다른 하나는 ㉠`),
              explain: `두 변의 길이가 같으므로 이등변삼각형이다. 길이가 같은 두 변에 있는 두 각의 크기가 같으므로 ㉠ = ${b}°이다.`, facts: { calc: [[String(b), 0]], rule: 'base-base' }
            });
          }),
          T('iso-apex-base', '나머지 한 각으로 크기가 같은 두 각 구하기', '①17 ②25 ③14 심24', (d) => {
            const [b, , leg] = d.pick(ISO), top = 180 - b * 2, fit = isoFit(b), p = fit.points;
            return N('삼각형에서 ㉠의 크기는 몇 도인가?', b, {
              unit: '°', figure: draw(fit, [G.polygon(p), sideOf(p, 0, 2, cm(leg)), sideOf(p, 1, 2, cm(leg)), corner(p, 2, top + '°'), corner(p, d.bool() ? 0 : 1, '㉠')], `두 변의 길이가 ${leg} cm로 같은 삼각형. 길이가 같은 두 변 사이의 각은 ${top}°, 나머지 두 각 가운데 하나는 ㉠`),
              explain: `이등변삼각형이므로 나머지 두 각의 크기가 같다. 두 각의 크기의 합은 180° − ${top}° = ${180 - top}°이므로 ㉠ = ${180 - top}° ÷ 2 = ${b}°이다.`,
              facts: { calc: [[`(180-${top})/2`, 0]], unseen: [180, 2], rule: 'apex-base' }
            });
          }),
          T('iso-base-apex', '크기가 같은 두 각으로 나머지 한 각 구하기', '①18 ②26 ③15 심23', (d) => {
            const [b, , leg] = d.pick(ISO), fit = isoFit(b), p = fit.points;
            return N('삼각형에서 ㉠의 크기는 몇 도인가?', 180 - b * 2, {
              unit: '°', figure: draw(fit, [G.polygon(p), sideOf(p, 0, 2, cm(leg)), sideOf(p, 1, 2, cm(leg)), corner(p, d.bool() ? 0 : 1, b + '°'), corner(p, 2, '㉠')], `두 변의 길이가 ${leg} cm로 같은 삼각형. 길이가 같은 두 변에 있는 두 각 가운데 하나는 ${b}°, 길이가 같은 두 변 사이의 각은 ㉠`),
              explain: `이등변삼각형이므로 표시하지 않은 각도 ${b}°이다. ㉠ = 180° − ${b}° − ${b}° = ${180 - b * 2}°이다.`,
              facts: { calc: [[`180-${b}*2`, 0]], unseen: [180, 2], rule: 'base-apex' }
            });
          }),
          T('iso-list-three', '세 각의 크기를 보고 이등변삼각형 고르기', '①22 ②29 심28', (d) => {
            // 60°, 60°, 60°는 넣지 않는다(정삼각형).
            const b = d.pick([25, 35, 40, 45, 50, 55, 65, 70, 75, 80]), key = (t) => t.slice().sort((x, y) => x - y).join();
            const others = d.until(() => [0, 1, 2].map(() => { const x = d.int(4, 18) * 5, y = d.int(4, 18) * 5; return [x, y, 180 - x - y]; }), (list) => list.every((t) => t[2] >= 20 && new Set(t).size === 3) && new Set(list.map(key)).size === 3);
            const rows = d.shuffle([d.shuffle([b, b, 180 - b * 2])].concat(others)), at = rows.findIndex((t) => new Set(t).size === 2), deg = (t) => t.map((v) => v + '°').join(', ');
            return C('세 각의 크기가 다음과 같은 삼각형 가운데 이등변삼각형은?', rows.map(deg), at, {
              explain: `이등변삼각형은 두 각의 크기가 같다. 세 각의 크기가 ${deg(rows[at])}인 삼각형은 두 각의 크기가 ${b}°로 같다.`,
              facts: { kindPick: { kinds: rows.map((t, i) => (new Set(t).size === 2 ? 'iso' : 'no' + i)), target: 'iso' } }
            });
          }),
          T('iso-list-two', '두 각의 크기를 보고 이등변삼각형 고르기', '①23 ②28 ③18·19 심27', (d) => {
            // 적힌 두 각은 서로 다르다. 나머지 한 각을 구해야 크기가 같은 두 각이 보인다.
            const b = d.pick([35, 40, 45, 50, 55, 65, 70, 75, 80]), third = (t) => 180 - t[0] - t[1], iso = (t) => t[0] === t[1] || third(t) === t[0] || third(t) === t[1], key = (t) => t.slice().sort((x, y) => x - y).join();
            const others = d.until(() => [0, 1, 2].map(() => [d.int(4, 22) * 5, d.int(4, 22) * 5]), (list) => list.every((t) => third(t) >= 15 && !iso(t)) && new Set(list.map(key).concat([key([b, 180 - b * 2])])).size === 4);
            const rows = d.shuffle([d.shuffle([b, 180 - b * 2])].concat(others)), at = rows.findIndex(iso), deg = (t) => t.map((v) => v + '°').join(', ');
            return C('두 각의 크기가 다음과 같은 삼각형 가운데 이등변삼각형은?', rows.map(deg), at, {
              explain: `나머지 한 각의 크기를 구하여 크기가 같은 두 각이 있는지 본다. 두 각이 ${deg(rows[at])}이면 나머지 한 각은 180° − ${rows[at][0]}° − ${rows[at][1]}° = ${third(rows[at])}°이므로 두 각의 크기가 ${b}°로 같다.`,
              facts: { kindPick: { kinds: rows.map((t, i) => (iso(t) ? 'iso' : 'no' + i)), target: 'iso' } }
            });
          }),
          T('iso-side-angles', '두 각의 크기가 같은 삼각형의 변', '②27 ③16', (d) => {
            const [b, base, leg] = d.pick(ISO.filter((row) => row[0] >= 35 && row[0] <= 70)), fit = isoFit(b), p = fit.points, left = d.bool();
            return N(`삼각형 ㄱㄴㄷ에서 변 ${left ? 'ㄱㄷ' : 'ㄱㄴ'}의 길이는 몇 cm인가?`, leg, {
              unit: 'cm', figure: draw(fit, [G.polygon(p), G.vertexLabels(p, NAMES3), corner(p, 0, b + '°'), corner(p, 1, b + '°'), sideOf(p, left ? 0 : 1, 2, cm(leg)), sideOf(p, 0, 1, cm(base))], `삼각형 ㄱㄴㄷ. 각 ㄱㄴㄷ과 각 ㄱㄷㄴ은 ${b}°, 변 ${left ? 'ㄱㄴ' : 'ㄱㄷ'}의 길이 ${leg} cm, 변 ㄴㄷ의 길이 ${base} cm`),
              explain: `두 각의 크기가 ${b}°로 같으므로 이등변삼각형이다. 변 ㄱㄴ과 변 ㄱㄷ의 길이가 같으므로 ${leg} cm이다.`, facts: { calc: [[String(leg), 0]], rule: 'equal-angles' }
            });
          }),
          T('iso-side-third', '나머지 한 각을 구해 변의 길이 알아내기', '②27 심8', (d) => {
            // 적힌 두 각은 서로 다르다. 나머지 한 각을 구하면 크기가 같은 두 각이 나온다.
            const [b, base, leg] = d.pick(ISO.filter((row) => row[0] >= 35)), top = 180 - b * 2, fit = isoFit(b), p = fit.points, left = d.bool();
            return N(`삼각형 ㄱㄴㄷ에서 변 ${left ? 'ㄱㄷ' : 'ㄱㄴ'}의 길이는 몇 cm인가?`, leg, {
              unit: 'cm', figure: draw(fit, [G.polygon(p), G.vertexLabels(p, NAMES3), corner(p, 2, top + '°'), corner(p, left ? 1 : 0, b + '°'), sideOf(p, left ? 0 : 1, 2, cm(leg)), sideOf(p, 0, 1, cm(base))], `삼각형 ㄱㄴㄷ. 각 ㄴㄱㄷ은 ${top}°, 각 ${left ? 'ㄱㄷㄴ' : 'ㄱㄴㄷ'}은 ${b}°, 변 ${left ? 'ㄱㄴ' : 'ㄱㄷ'}의 길이 ${leg} cm, 변 ㄴㄷ의 길이 ${base} cm`),
              explain: `각 ${left ? 'ㄱㄴㄷ' : 'ㄱㄷㄴ'}은 180° − ${top}° − ${b}° = ${b}°이다. 각 ㄱㄴㄷ과 각 ㄱㄷㄴ의 크기가 같으므로 이등변삼각형이고, 변 ㄱㄴ과 변 ㄱㄷ의 길이가 같다. 그러므로 ${leg} cm이다.`,
              facts: { calc: [[String(leg), 0]], rule: 'third-angle' }
            });
          })
        ]
      },
      {
        id: 'equi', title: '정삼각형의 성질', standard: SIDE,
        types: [
          T('equi-say', '정삼각형에 대한 설명', '①26 ②36·38·39 ③26·27·32', (d) => {
            const wrong = d.pick(['한 각이 직각인 정삼각형도 있다.', '둔각삼각형이다.', '한 변의 길이가 길수록 한 각의 크기도 크다.', '세 각의 크기가 모두 30°이다.']);
            const rows = d.shuffle(d.shuffle(['세 변의 길이가 모두 같다.', '세 각의 크기가 모두 같다.', '한 각의 크기는 60°이다.', '세 각의 크기의 합은 180°이다.']).slice(0, 3).map((text) => [text, true]).concat([[wrong, false]]));
            return C('정삼각형에 대한 설명으로 옳지 않은 것은?', rows.map(([text]) => text), rows.findIndex(([, ok]) => !ok), {
              explain: '정삼각형은 세 변의 길이가 같고, 세 각의 크기가 모두 60°로 같다. 변의 길이가 달라져도 한 각의 크기는 언제나 60°이다.', facts: { truth: rows.map(([, ok]) => ok), want: false }
            });
          }),
          T('equi-angle', '세 변의 길이가 같은 삼각형의 각', '①27 ②37 ③24 심2·7', (d) => {
            const s = d.int(3, 12), fit = place(bySides(1, 1, 1), [4.6, 4.2], [1.6, 0.95]), p = fit.points;
            return N('삼각형에서 ㉠의 크기는 몇 도인가?', 60, {
              unit: '°', figure: draw(fit, [G.polygon(p), sideOf(p, 0, 1, cm(s)), sideOf(p, 0, 2, cm(s)), sideOf(p, 1, 2, cm(s)), corner(p, d.int(0, 2), '㉠')], `세 변의 길이가 모두 ${s} cm인 삼각형. 한 각이 ㉠`),
              explain: '세 변의 길이가 같으므로 정삼각형이다. 정삼각형은 세 각의 크기가 같으므로 한 각의 크기는 180° ÷ 3 = 60°이다.', facts: { calc: [['180/3', 0]], unseen: [180, 3], rule: 'equi' }
            });
          }),
          T('equi-side-angles', '두 각이 60°인 삼각형의 변', '①28 ②41 ③25 심9', (d) => {
            const s = d.int(4, 15), fit = place(bySides(1, 1, 1), [4.6, 4.2], [1.6, 0.95]), p = fit.points, ask = d.pick(['ㄱㄴ', 'ㄱㄷ']);
            return N(`삼각형 ㄱㄴㄷ에서 변 ${ask}의 길이는 몇 cm인가?`, s, {
              unit: 'cm', figure: draw(fit, [G.polygon(p), G.vertexLabels(p, NAMES3), corner(p, 0, '60°'), corner(p, 1, '60°'), sideOf(p, 0, 1, cm(s))], `삼각형 ㄱㄴㄷ. 각 ㄱㄴㄷ과 각 ㄱㄷㄴ은 60°, 변 ㄴㄷ의 길이 ${s} cm`),
              explain: `나머지 한 각도 180° − 60° − 60° = 60°이다. 세 각의 크기가 모두 60°이므로 정삼각형이고, 세 변의 길이가 같다. 그러므로 ${s} cm이다.`, facts: { calc: [[String(s), 0]], rule: 'two-sixty' }
            });
          }),
          T('equi-side-two', '두 변의 길이가 같고 한 각이 60°인 삼각형의 변', '②41', (d) => {
            // 이등변삼각형의 성질로 나머지 두 각이 60°임을 알아내야 정삼각형인 것이 보인다.
            const s = d.int(4, 15), fit = place(bySides(1, 1, 1), [4.6, 4.2], [1.6, 0.95]), p = fit.points;
            return N('삼각형 ㄱㄴㄷ에서 변 ㄴㄷ의 길이는 몇 cm인가?', s, {
              unit: 'cm', figure: draw(fit, [G.polygon(p), G.vertexLabels(p, NAMES3), corner(p, 2, '60°'), sideOf(p, 0, 2, cm(s)), sideOf(p, 1, 2, cm(s))], `삼각형 ㄱㄴㄷ. 변 ㄱㄴ과 변 ㄱㄷ의 길이 ${s} cm, 각 ㄴㄱㄷ은 60°`),
              explain: `두 변의 길이가 같으므로 이등변삼각형이고, 나머지 두 각은 180° − 60° = 120°를 똑같이 둘로 나눈 60°씩이다. 세 각의 크기가 모두 60°이므로 정삼각형이고, 변 ㄴㄷ의 길이도 ${s} cm이다.`,
              facts: { calc: [[String(s), 0]], rule: 'two-sides-sixty' }
            });
          }),
          T('equi-sum', '두 각의 크기의 합을 보고 정삼각형 고르기', '①29 ②29 심31', (d) => {
            const sums = d.shuffle([120].concat(d.shuffle([80, 90, 100, 110, 130, 140]).slice(0, 3)));
            return C('두 각의 크기의 합이 다음과 같은 삼각형 가운데 정삼각형이 될 수 있는 것은?', sums.map((v) => v + '°'), sums.indexOf(120), {
              explain: '정삼각형은 세 각의 크기가 모두 60°이다. 두 각의 크기의 합이 120°이면 나머지 한 각이 180° − 120° = 60°이다. 합이 120°가 아니면 나머지 한 각이 60°가 아니므로 정삼각형이 될 수 없다.',
              facts: { choose: { exprs: sums.map((v) => `180-${v}`), rule: 'equals', target: 60 }, unseen: [180] }
            });
          }),
          T('equi-row', '이어 붙인 정삼각형의 선분의 길이', '①31', (d) => {
            // 둘레가 아니라, 한 직선 위에 놓인 두 변의 길이를 정삼각형의 성질로 읽는다.
            const s = d.int(3, 12), h = Math.sqrt(3) / 2, A = [0, h], Bm = [1, h], Cr = [2, h], D = [0.5, 0], E = [1.5, 0], fit = place([A, Bm, Cr, D, E], [7.4, 3.2], [1.1, 0.9]), [a, b, c, e, f] = fit.points;
            return N(`한 변의 길이가 ${s} cm인 정삼각형 3개를 겹치지 않게 이어 붙였다. 선분 ㄱㄴ의 길이는 몇 cm인가?`, s * 2, {
              unit: 'cm', figure: draw(fit, [G.polygon([a, c, f, e]), G.line(e, b), G.line(b, f), G.point(a), G.point(c), G.text([a[0] - 0.2, a[1] + 0.55], 'ㄱ'), G.text([c[0] + 0.2, c[1] + 0.55], 'ㄴ'), sideText(e, f, b, cm(s))], `정삼각형 3개를 한 줄로 이어 붙인 사다리꼴 모양. 짧은 윗변은 정삼각형의 한 변으로 ${s} cm, 긴 아랫변 ㄱㄴ은 정삼각형의 변 2개를 이은 것`),
              explain: `정삼각형은 세 변의 길이가 같으므로 작은 삼각형의 변은 모두 ${s} cm이다. 선분 ㄱㄴ은 변 2개를 이은 것이므로 ${s} + ${s} = ${s * 2}(cm)이다.`, facts: { calc: [[`${s}+${s}`, 0]] }
            });
          }),
          T('equi-overlap', '겹쳐 놓은 두 정삼각형', '③28', (d) => {
            // 겹쳐진 삼각형의 두 각이 정삼각형의 각(60°)이라 나머지 각도 60°이다.
            const s = d.int(3, 9), h = Math.sqrt(3) / 2, o = 0.42;
            const fit = place([[0, 0], [1, 0], [0.5, -h], [1 - o, 0], [2 - o, 0], [1.5 - o, -h], [1 - o / 2, -o * h]], [7.4, 3.6], [0.9, 0.95]), [a, b, c, e, f, g, top] = fit.points;
            return N('정삼각형 2개를 한 변이 같은 직선 위에 놓이도록 겹쳐 놓았다. 색칠한 삼각형에서 ㉠의 길이는 몇 cm인가?', s, {
              unit: 'cm', figure: draw(fit, [G.polygon([a, b, c]), G.polygon([e, f, g]), tinted([e, b, top]), G.point(e), G.point(b), sideText(e, b, top, cm(s)), sideText(e, top, b, '㉠')], `정삼각형 2개가 겹쳐진 부분은 작은 삼각형이다. 작은 삼각형의 아래쪽 변의 길이 ${s} cm, 비스듬한 변의 길이 ㉠`),
              explain: `색칠한 삼각형의 아래쪽 두 각은 정삼각형의 각이므로 60°씩이고, 나머지 한 각도 180° − 60° − 60° = 60°이다. 세 각의 크기가 모두 60°이므로 정삼각형이고, 세 변의 길이가 모두 ${s} cm이다.`,
              facts: { calc: [[String(s), 0]] }
            });
          })
        ]
      },
      { id: 'angles', title: '각의 크기에 따라 삼각형 분류하기', standard: ANGLE, types: [] },
      { id: 'both', title: '두 가지 기준으로 분류하기', standard: ANGLE, types: [] }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
