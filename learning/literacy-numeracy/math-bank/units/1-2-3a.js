// 1학년 2학기 3단원 모양과 시각 — 단원 틀, 그림 도구, 기본 문항(□·△·○ 모양 찾기, 모양의 특징과 본뜨기).
// 수집해 둔 평가 자료(미래엔·아이스크림미디어·천재, 기본 24개 문서와 심화 5개 문서)에서 뽑은 꼴 목록(기본꼴 47, 심화꼴 39)을
// 번호마다 따져 실었다. 꼴(무엇을 주고 무엇을 묻는가)만 가져오고 물건·그림·문장은 새로 만들었다.
// (세 모양으로 꾸민 모양·몇 시·몇 시 30분은 1-2-3b.js, 실력 문항은 1-2-3c.js. 대조표는 수집본의 _분석/1-2-3/싣기_대조표.md)
//
// 영역과 성취기준
//  - 모양 묶음 셋은 도형: [2수03-03] 물건을 관찰하여 삼각형, 사각형, 원의 모양을 찾고, 이를 이용하여 여러 가지 모양을 만든다.
//  - 시각 묶음 둘은 측정: [2수03-07] 시계를 보고 시각을 읽는다. 이 단원에서는 「몇 시」와 「몇 시 30분」뿐이다.
//  - 교육과정의 금: 「모양의 특징을 직관적으로 파악하여 모양을 분류하고, 분류한 모양을 지칭하기 위해 일상용어를 사용」
//    → 「□ 모양」「△ 모양」「○ 모양」이라고만 부른다. 삼각형·사각형·원, 변·꼭짓점이라는 말은 아이에게 보이는 글에 쓰지 않는다
//      (「뾰족한 부분」「곧은 선」「둥근 부분」). 답으로 한글을 적게 하지 않는다(모양과 말은 고르기로, 수는 숫자 칸으로).
//
// 싣는 기준
//  - 물건은 간단한 그림과 이름을 함께 준다. 모양은 물건의 겉모양으로 정하고, 가운데가 뚫린 물건(훌라후프·옷걸이·창문)도 테두리의 모양으로 본다.
//  - □ 모양은 뾰족한 부분이 4군데이고 곧은 선만 있는 네모, △ 모양은 뾰족한 부분이 3군데, ○ 모양은 뾰족한 부분이 없고 둥근 것만 그린다.
//    기본 문항의 모양은 반듯하게 놓고, 기울어지거나 길쭉한 모양은 실력 문항에서만 섞는다.
//  - 찍기·본뜨기는 물건의 색칠한 쪽(평평한 쪽)을 앞에서 본 모양 그대로 그려, 어느 쪽을 대는지가 그림에서 정해지게 한다.
//  - 주는 것과 묻는 것이 다르면 다른 문제로 싣고, 물건·수만 다른 것은 한 번만 싣는다.
//
// 뺀 것과 까닭(이 파일의 두 묶음)
//  - 잇기뿐인 꼴(①8 심6, ①11의 잇기 변형): 「이 물건과 같은 모양은?」으로 바꾸면 ①3과 같아 한 번만 실었다.
//  - 손으로 만든 모양(①13): 손 그림을 그릴 도구가 없어 미루었다. 판단(특징 → 모양)은 feature-read 가 묻는다.
//  - 성냥개비로 만든 모양에서 한 모양 세기(①18): 그림을 볼 수 없고, 크고 작은 모양을 겹쳐 세는 꼴일 수 있다(경우 따지기).
//  - 특징에 맞는 것의 수를 설명하고 쓰기(심12의 변형): 서술형.
// 묻는 말: 값·모양을 물으면 「~은?」, 수를 물으면 「몇 개인가?/몇 군데인가?」. 문장은 짧게, 한 문장에 한 가지만.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, tagged, N, M, C } = B.kit;
  const G = B.kit.geo;
  const SHAPE = '2수03-03', TIME = '2수03-07';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const TAGS = ['가', '나', '다', '라', '마', '바', '사', '아'];
  const KINDS = ['sq', 'tri', 'cir'];
  const MARK = { sq: '□', tri: '△', cir: '○' };
  const say = (k) => MARK[k] + ' 모양';
  const SAYS = KINDS.map(say);
  // 모양을 가리는 특징(풀이에 쓴다)
  const POINTS = { sq: 4, tri: 3 };
  const WHY = { sq: '뾰족한 부분이 4군데인', tri: '뾰족한 부분이 3군데인', cir: '뾰족한 부분이 없고 둥근' };
  const FEATURE = { sq: '뾰족한 부분이 4군데인', tri: '뾰족한 부분이 3군데인', cir: '뾰족한 부분이 없는' };
  const conditions = (list) => '<ul class="mb-conditions">' + list.map((line) => '<li>' + line + '</li>').join('') + '</ul>';
  // 세 모양을 늘어놓는 여섯 가지 차례
  const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];

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

  // ── 그리기 ──────────────────────────────────────────────────
  const INK = '#1f2933', RAD = Math.PI / 180;
  const r2 = (n) => Math.round(n * 100) / 100;
  const st = (fill, width, stroke) => 'style="fill:' + (fill || 'none') + ';stroke:' + (stroke || INK) + ';stroke-width:' + (width || 1.5) + ';stroke-linejoin:round;stroke-linecap:round"';
  const polygon = (list, fill, width, stroke) => '<polygon points="' + list.map((p) => r2(p[0]) + ',' + r2(p[1])).join(' ') + '" ' + st(fill, width, stroke) + '/>';
  const disc = (cx, cy, r, fill, width, stroke) => '<circle cx="' + r2(cx) + '" cy="' + r2(cy) + '" r="' + r2(r) + '" ' + st(fill, width, stroke) + '/>';
  const seg = (x1, y1, x2, y2, width, stroke) => '<line x1="' + r2(x1) + '" y1="' + r2(y1) + '" x2="' + r2(x2) + '" y2="' + r2(y2) + '" ' + st('none', width || 1.2, stroke) + '/>';
  const curve = (d, fill, width, stroke) => '<path d="' + d + '" ' + st(fill, width, stroke) + '/>';
  const word = (x, y, text, size, weight) => '<text class="mb-label" style="font-size:' + (size || 13) + 'px;font-weight:' + (weight || 600) + '" x="' + r2(x) + '" y="' + r2(y) + '" text-anchor="middle" dominant-baseline="central">' + text + '</text>';
  const frame = (W, H, body, label, scale) => '<svg class="mb-geo" viewBox="0 0 ' + W + ' ' + H + '" width="' + Math.round(W * (scale || 1)) + '" role="img" aria-label="' + label + '">' + body + '</svg>';
  const put = (x, y, body, turn) => '<g transform="translate(' + r2(x) + ' ' + r2(y) + ')' + (turn ? ' rotate(' + turn + ')' : '') + '">' + body + '</g>';
  // 왼쪽 위 구석 (x, y)에서 가로 w, 세로 h 인 네모의 네 구석
  const R = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];

  // 모양 조각: { k: 'sq' | 'tri' | 'cir', p(구석들) 또는 c(가운데)·r(반지름), fill }
  const spin = (p, c, deg) => { const a = deg * RAD, x = p[0] - c[0], y = p[1] - c[1]; return [c[0] + x * Math.cos(a) - y * Math.sin(a), c[1] + x * Math.sin(a) + y * Math.cos(a)]; };
  const rect = (cx, cy, w, h, deg) => ({ k: 'sq', p: R(cx - w / 2, cy - h / 2, w, h).map((p) => spin(p, [cx, cy], deg || 0)) });
  const tri = (a, b, c, deg) => { const m = [(a[0] + b[0] + c[0]) / 3, (a[1] + b[1] + c[1]) / 3]; return { k: 'tri', p: [a, b, c].map((p) => spin(p, m, deg || 0)) }; };
  const circ = (cx, cy, r) => ({ k: 'cir', c: [cx, cy], r });
  const paint = (piece, fill) => (piece.k === 'cir' ? disc(piece.c[0], piece.c[1], piece.r, fill || piece.fill) : polygon(piece.p, fill || piece.fill));
  const tally = (pieces) => { const n = { sq: 0, tri: 0, cir: 0 }; pieces.forEach((piece) => { n[piece.k] += 1; }); return n; };
  // 그림 설명에 적는 글: 「□ 모양 3개, △ 모양 1개」(쓰지 않은 모양은 적지 않는다)
  const told = (n) => KINDS.filter((k) => n[k]).map((k) => say(k) + ' ' + n[k] + '개').join(', ');
  const FILLS = ['#fde68a', '#bfdbfe', '#fecaca', '#bbf7d0', '#e9d5ff', '#fed7aa'];

  // ── 물건 그림(가운데가 (0, 0), 가로세로 ±29 안) ───────────────
  const THINGS = [
    { name: '시계', k: 'cir', draw: () => disc(0, 0, 26, '#fff', 2) + [0, 90, 180, 270].map((a) => seg(21 * Math.sin(a * RAD), -21 * Math.cos(a * RAD), 25 * Math.sin(a * RAD), -25 * Math.cos(a * RAD), 1.6)).join('') + seg(0, 0, 0, -16, 1.6) + seg(0, 0, 10, 6, 2.4) + disc(0, 0, 2, INK, 1) },
    { name: '접시', k: 'cir', draw: () => disc(0, 0, 27, '#e0f2fe') + disc(0, 0, 17, '#fff', 1.1) },
    { name: '단추', k: 'cir', draw: () => disc(0, 0, 25, '#fecaca') + disc(0, 0, 19, 'none', 1) + [[-6, -6], [6, -6], [-6, 6], [6, 6]].map(([x, y]) => disc(x, y, 2.6, '#fff', 1)).join('') },
    { name: '바퀴', k: 'cir', draw: () => disc(0, 0, 27, '#64748b') + disc(0, 0, 18, '#f1f5f9', 1.2) + [0, 45, 90, 135].map((a) => seg(-18 * Math.cos(a * RAD), -18 * Math.sin(a * RAD), 18 * Math.cos(a * RAD), 18 * Math.sin(a * RAD), 1)).join('') + disc(0, 0, 4, '#94a3b8', 1) },
    { name: '훌라후프', k: 'cir', draw: () => disc(0, 0, 24, 'none', 7, '#f472b6') + disc(0, 0, 27.5, 'none', 1.2) + disc(0, 0, 20.5, 'none', 1.2) },
    { name: '피자', k: 'cir', draw: () => disc(0, 0, 27, '#fdba74') + disc(0, 0, 22, '#fde68a', 1) + [[-9, -8], [8, -10], [0, 3], [-11, 9], [11, 10]].map(([x, y]) => disc(x, y, 3.6, '#ef4444', 0.8)).join('') },
    { name: '공책', k: 'sq', draw: () => polygon(R(-21, -27, 42, 54), '#fef9c3') + [-15, -6, 3, 12, 21].map((y) => seg(-15, y, 15, y, 0.9, '#94a3b8')).join('') },
    { name: '창문', k: 'sq', draw: () => polygon(R(-27, -23, 54, 46), '#bae6fd', 2.4) + seg(0, -23, 0, 23, 2) + seg(-27, 0, 27, 0, 2) },
    { name: '액자', k: 'sq', draw: () => polygon(R(-28, -22, 56, 44), '#d6a676') + polygon(R(-21, -15, 42, 30), '#fff', 1.1) + curve('M-17 8q8.5 -15 17 0t17 0', 'none', 1.4, '#16a34a') },
    { name: '칠판', k: 'sq', draw: () => polygon(R(-29, -20, 58, 38), '#3f7d5a', 2.2) + seg(-21, -9, 4, -9, 1.3, '#fff') + seg(-21, 0, 13, 0, 1.3, '#fff') + seg(-29, 22, 29, 22, 2.4) },
    { name: '텔레비전', k: 'sq', draw: () => polygon(R(-29, -22, 58, 40), '#475569') + polygon(R(-24, -17, 48, 30), '#e0f2fe', 1) + seg(-12, 18, -16, 25, 1.8) + seg(12, 18, 16, 25, 1.8) },
    { name: '달력', k: 'sq', draw: () => polygon(R(-23, -26, 46, 52), '#fff') + polygon(R(-23, -26, 46, 12), '#fca5a5') + [-11.5, 0, 11.5].map((x) => seg(x, -14, x, 26, 0.8, '#94a3b8')).join('') + [-4, 6, 16].map((y) => seg(-23, y, 23, y, 0.8, '#94a3b8')).join('') + polygon(R(-23, -26, 46, 52), 'none') },
    { name: '수학책', k: 'sq', draw: () => polygon(R(-21, -27, 42, 54), '#93c5fd') + polygon(R(-12, -18, 26, 13), '#fff', 1) + seg(-16, -27, -16, 27, 1) },
    { name: '색종이', k: 'sq', draw: () => polygon(R(-24, -24, 48, 48), '#f9a8d4') },
    { name: '삼각자', k: 'tri', draw: () => polygon([[-26, 24], [26, 24], [-26, -26]], '#bfdbfe') + polygon([[-18, 16], [6, 16], [-18, -7]], '#fff', 1.1) },
    { name: '옷걸이', k: 'tri', draw: () => polygon([[0, -8], [28, 18], [-28, 18]], 'none', 3) + curve('M0 -8v-6q0 -9 7 -9q6 0 6 6', 'none', 2.4) },
    { name: '삼각김밥', k: 'tri', draw: () => polygon([[0, -26], [27, 22], [-27, 22]], '#fff') + polygon(R(-11, 6, 22, 16), '#334155', 1) },
    { name: '표지판', k: 'tri', draw: () => polygon([[0, -25], [27, 21], [-27, 21]], '#fde047', 4, '#dc2626') + seg(0, -7, 0, 7, 3) + disc(0, 13.5, 1.6, INK, 1) },
    { name: '샌드위치', k: 'tri', draw: () => polygon([[-27, -21], [27, -21], [0, 25]], '#fde68a') + seg(-21, -13, 21, -13, 2.2, '#16a34a') + seg(-17.5, -7, 17.5, -7, 2.2, '#ef4444') }
  ];
  const thingsOf = (k) => THINGS.filter((thing) => thing.k === k);
  // 모양마다 정한 수만큼 물건을 겹치지 않게 뽑아 섞는다. counts: { sq, tri, cir }
  const pickThings = (d, counts) => d.shuffle(KINDS.reduce((all, k) => all.concat(d.shuffle(thingsOf(k)).slice(0, counts[k] || 0)), []));
  // 칸마다 하나씩 그린다. o.per: 한 줄의 칸 수, o.tags: 칸에 붙이는 이름(없으면 붙이지 않는다), o.names: false 면 이름을 적지 않는다.
  function cells(list, drawOne, said, o) {
    const opt = o || {}, per = opt.per || Math.min(list.length, 3), cw = opt.cw || (per >= 4 ? 70 : 90), top = opt.tags ? 18 : 6, low = opt.names === false ? 6 : 22, ch = top + 60 + low;
    let out = '';
    list.forEach((item, i) => {
      const x = (i % per) * cw, y = Math.floor(i / per) * ch;
      if (opt.tags) out += word(x + 11, y + 11, opt.tags[i]);
      out += put(x + cw / 2, y + top + 30, drawOne(item, i));
      if (opt.names !== false) out += word(x + cw / 2, y + top + 60 + 10, item.name, 12, 500);
    });
    return frame(Math.min(list.length, per) * cw, Math.ceil(list.length / per) * ch, out, said, opt.scale);
  }
  const thingsFig = (list, o) => cells(list, (thing) => thing.draw(), '물건 그림: ' + list.map((thing, i) => (o && o.tags ? o.tags[i] + ' ' : '') + thing.name).join(', '), o);
  // 모양 조각 여럿(이름 없이). list: 조각(가운데가 (0, 0)), fills: 조각마다의 빛깔
  const shapesFig = (list, fills, o) => cells(list, (piece, i) => paint(piece, fills[i]), '모양 조각 ' + list.length + '개' + (o && o.tags ? ': ' + o.tags.slice(0, list.length).join(', ') : ''), Object.assign({ names: false }, o || {}));
  // 반듯하게 놓인 모양 조각(기본 문항)
  const FLAT = {
    sq: [() => rect(0, 0, 44, 44), () => rect(0, 0, 54, 32), () => rect(0, 0, 32, 54)],
    tri: [() => tri([0, -24], [26, 22], [-26, 22]), () => tri([-24, 22], [24, 22], [-24, -24]), () => tri([24, 22], [-24, 22], [24, -24])],
    cir: [() => circ(0, 0, 25), () => circ(0, 0, 17), () => circ(0, 0, 21)]
  };
  // 길쭉하거나 기울어지거나 거꾸로 놓인 모양 조각(실력 문항)
  const FLAT_HARD = {
    sq: [() => rect(0, 0, 56, 13), () => rect(0, 0, 46, 26, 28), () => rect(0, 0, 36, 36, 45), () => rect(0, 0, 54, 12, -40), () => rect(0, 0, 14, 54)],
    tri: [() => tri([-28, 9], [28, 0], [-28, -9]), () => tri([-26, -21], [26, -21], [0, 24]), () => tri([0, -24], [24, 20], [-24, 20], 28), () => tri([-28, 16], [28, 16], [17, -12]), () => tri([-9, 27], [9, 27], [0, -27])],
    cir: [() => circ(0, 0, 25), () => circ(0, 0, 13)]
  };

  // ── 찍기·본뜨기에 쓰는 물건(색칠한 쪽이 앞을 본다) ─────────────
  const FACE = '#fdba74', PLAIN = '#f8fafc';
  // 상자: 앞쪽이 가로 w, 세로 h
  function boxSolid(w, h, on) {
    const x = -w / 2 - 7, y = -h / 2 + 7, dx = 14, dy = 14;
    return polygon([[x, y], [x + dx, y - dy], [x + w + dx, y - dy], [x + w, y]], PLAIN) + polygon([[x + w, y], [x + w + dx, y - dy], [x + w + dx, y + h - dy], [x + w, y + h]], PLAIN) + polygon(R(x, y, w, h), on ? FACE : PLAIN);
  }
  // 둥근 통: 둥근 쪽(반지름 r)이 앞을 보고, 길이 len 만큼 오른쪽 위로 뻗는다.
  function canSolid(r, len, on) {
    const ux = 0.8, uy = -0.6, fx = -len * ux / 2, fy = -len * uy / 2, bx = -fx, by = -fy, nx = 0.6 * r, ny = 0.8 * r;
    return disc(bx, by, r, PLAIN) + '<polygon points="' + [[fx + nx, fy + ny], [bx + nx, by + ny], [bx - nx, by - ny], [fx - nx, fy - ny]].map((p) => r2(p[0]) + ',' + r2(p[1])).join(' ') + '" style="fill:' + PLAIN + ';stroke:none"/>'
      + seg(fx + nx, fy + ny, bx + nx, by + ny, 1.5) + seg(fx - nx, fy - ny, bx - nx, by - ny, 1.5) + disc(fx, fy, r, on ? FACE : PLAIN);
  }
  // 세모 기둥: 세모 쪽이 앞을 본다. on: 'front'(세모 쪽) | 'side'(옆의 네모 쪽) | 없음
  function prismSolid(on) {
    const a = [-29, 22], b = [15, 22], c = [-7, -18], back = (p) => [p[0] + 16, p[1] - 12];
    return polygon([c, back(c), back(b), b], on === 'side' ? FACE : PLAIN) + polygon([a, b, c], on === 'front' ? FACE : PLAIN);
  }
  // [이름, 색칠한 쪽의 모양, 그림]
  const SOLIDS = [
    { name: '과자 상자', k: 'sq', draw: () => boxSolid(44, 34, true) },
    { name: '필통', k: 'sq', draw: () => boxSolid(50, 22, true) },
    { name: '나무 블록', k: 'sq', draw: () => boxSolid(36, 36, true) },
    { name: '음료수 캔', k: 'cir', draw: () => canSolid(17, 34, true) },
    { name: '통조림통', k: 'cir', draw: () => canSolid(21, 18, true) },
    { name: '삼각김밥', k: 'tri', draw: () => prismSolid('front') },
    { name: '삼각김밥', k: 'sq', side: true, draw: () => prismSolid('side') }
  ];
  const solidsFig = (list, o) => cells(list, (solid) => solid.draw(), '한쪽을 색칠한 물건: ' + list.map((solid, i) => (o && o.tags ? o.tags[i] + ' ' : '') + solid.name).join(', '), o);

  // ── 한쪽이 종이에 가려진 모양 ────────────────────────────────
  // 보이는 쪽에 뾰족한 부분 둘과 가려진 쪽으로 모이는(나란한) 두 선이 남아, 가려진 쪽을 미루어 알 수 있다.
  function hiddenShape(k, turn, fill) {
    const piece = k === 'sq' ? rect(0, 0, 50, 50) : k === 'tri' ? tri([0, -27], [27, 25], [-27, 25]) : circ(0, 0, 26);
    const paper = polygon(R(-33, -34, 66, 32), '#e2e8f0', 1.5) + [-22, -6, 10, 26].map((x) => seg(x, -30, x - 12, -6, 0.8, '#94a3b8')).join('');
    return '<g transform="rotate(' + turn + ')">' + paint(piece, fill) + paper + '</g>';
  }

  // 같은 단원의 다른 파일이 쓰는 도구
  B.kit.g123 = { SHAPE, TIME, TAGS, KINDS, MARK, say, SAYS, POINTS, WHY, FEATURE, ORDERS, conditions, setOptions, INK, RAD, r2, st, polygon, disc, seg, curve, word, frame, put, R, spin, rect, tri, circ, paint, tally, told, FILLS,
    THINGS, thingsOf, pickThings, cells, thingsFig, shapesFig, FLAT, FLAT_HARD, FACE, PLAIN, boxSolid, canSolid, prismSolid, SOLIDS, solidsFig, hiddenShape };

  // 모양에 대한 말과, 그 말이 맞는 모양
  const CLAIMS = [
    ['뾰족한 부분이 3군데이다.', ['tri']], ['뾰족한 부분이 4군데이다.', ['sq']], ['뾰족한 부분이 없다.', ['cir']],
    ['둥근 부분이 있다.', ['cir']], ['둥근 부분이 없다.', ['sq', 'tri']], ['곧은 선이 있다.', ['sq', 'tri']], ['곧은 선이 없다.', ['cir']]
  ];
  // 한 모양만 가리키는 설명
  const TELL = { tri: ['뾰족한 부분이 3군데이다.', '곧은 선만 있다.'], sq: ['뾰족한 부분이 4군데이다.', '둥근 부분이 없다.'], cir: ['뾰족한 부분이 없다.', '둥근 부분만 있다.'] };
  const marks = (order) => order.map((i) => MARK[KINDS[i]]).join(', ');
  const tagNames = (list, hit) => list.map((thing, i) => (hit(thing) ? TAGS[i] + '(' + thing.name + ')' : '')).filter(Boolean).join(', ');

  B.addUnit({
    id: '1-2-3', grade: 1, semester: 2, no: 3, title: '모양과 시각', version: 1,
    groups: [
      {
        id: 'find', title: '□, △, ○ 모양 찾기', standard: SHAPE,
        types: [
          T('find-shape', '물건과 같은 모양 고르기', '①3 심5', (d) => {
            const thing = d.pick(THINGS);
            return C(`${josa(thing.name, '과/와')} 같은 모양은?`, SAYS, KINDS.indexOf(thing.k), {
              figure: thingsFig([thing]), explain: `${josa(thing.name, '은/는')} ${WHY[thing.k]} ${say(thing.k)}이다.`, facts: { kindPick: { kinds: KINDS, target: thing.k } }
            });
          }),
          T('find-pick', '주어진 모양인 물건 고르기', '①2 심5', (d) => {
            // 물건 넷 가운데 그 모양은 하나뿐이다.
            const target = d.pick(KINDS), [p, q] = d.shuffle(KINDS.filter((k) => k !== target));
            const list = pickThings(d, { [target]: 1, [p]: 2, [q]: 1 }), at = list.findIndex((thing) => thing.k === target);
            return C(`${say(target)}인 물건은?`, TAGS.slice(0, 4), at, {
              figure: thingsFig(list, { per: 4, tags: TAGS }), explain: `${josa(list[at].name, '은/는')} ${WHY[target]} ${say(target)}이다.`, facts: { kindPick: { kinds: list.map((thing) => thing.k), target } }
            });
          }),
          T('find-like', '한 물건과 같은 모양인 물건 고르기', '①3', (d) => {
            // 가와 모양이 같은 물건은 나머지 넷 가운데 하나뿐이다.
            const base = d.pick(KINDS), [p, q] = d.shuffle(KINDS.filter((k) => k !== base)), two = d.shuffle(thingsOf(base)).slice(0, 2);
            const rest = d.shuffle([two[1]].concat(pickThings(d, { [p]: 2, [q]: 1 }))), list = [two[0]].concat(rest), at = rest.indexOf(two[1]);
            return C('가와 같은 모양인 물건은?', TAGS.slice(1, 5), at, {
              figure: thingsFig(list, { per: 3, tags: TAGS }), explain: `가(${two[0].name})는 ${say(base)}이다. ${say(base)}인 물건은 ${TAGS[at + 1]}(${two[1].name})이다.`,
              facts: { kindPick: { kinds: rest.map((thing) => thing.k), target: base } }
            });
          }),
          T('find-each', '물건마다 알맞은 모양', '①1 심5', (d) => {
            const order = d.pick(ORDERS), list = order.map((i) => d.pick(thingsOf(KINDS[i])));
            const options = d.shuffle([order].concat(d.shuffle(ORDERS.filter((o) => o !== order)).slice(0, 3)));
            return C('가, 나, 다의 모양을 차례로 쓴 것은?', options.map(marks), options.indexOf(order), {
              figure: thingsFig(list, { per: 3, tags: TAGS }), explain: list.map((thing, i) => `${TAGS[i]}(${thing.name})는 ${say(thing.k)}`).join(', ') + '이다.',
              facts: { truth: options.map((o) => o.every((i, at) => KINDS[i] === list[at].k)), want: true }
            });
          }),
          T('find-all', '한 모양인 물건을 모두 찾기', '①4 심1', (d) => {
            const target = d.pick(KINDS), [p, q] = d.shuffle(KINDS.filter((k) => k !== target)), n = d.int(2, 3);
            const list = pickThings(d, { [target]: n, [p]: 2, [q]: 4 - n }), flags = list.map((thing) => thing.k === target), made = setOptions(d, TAGS.slice(0, 6), flags);
            return C(`${say(target)}인 물건을 모두 고른 것은?`, made.options, made.answer, {
              figure: thingsFig(list, { per: 3, tags: TAGS }), explain: `${say(target)}인 물건은 ${tagNames(list, (thing) => thing.k === target)}이다.`,
              facts: { sets: { labels: TAGS.slice(0, 6), flags, options: made.sets } }
            });
          }),
          T('find-count', '한 모양인 물건의 수', '①5 심2', (d) => {
            const target = d.pick(KINDS), [p, q] = d.shuffle(KINDS.filter((k) => k !== target)), n = d.int(2, 4);
            const list = pickThings(d, { [target]: n, [p]: n === 4 ? 1 : 2, [q]: n === 2 ? 2 : 1 });
            return N(`${say(target)}인 물건은 모두 몇 개인가?`, n, {
              unit: '개', figure: thingsFig(list, { per: 3, tags: TAGS }), explain: `${say(target)}인 물건은 ${tagNames(list, (thing) => thing.k === target)}이다. 모두 ${n}개이다.`,
              facts: { tallyOf: { list: list.map((thing) => thing.k), target } }
            });
          }),
          T('find-odd', '나머지와 모양이 다른 하나', '①6 심4·8', (d) => {
            const [same, other] = d.shuffle(KINDS), list = pickThings(d, { [same]: 4, [other]: 1 }), at = list.findIndex((thing) => thing.k === other);
            return C('모양이 나머지와 다른 물건은?', TAGS.slice(0, 5), at, {
              figure: thingsFig(list, { per: 3, tags: TAGS }), explain: `${TAGS[at]}(${list[at].name})만 ${say(other)}이고 나머지는 모두 ${say(same)}이다.`,
              facts: { truth: list.map((thing) => list.filter((x) => x.k === thing.k).length === 1), want: true }
            });
          }),
          T('find-not', '주어진 모양이 아닌 것', '①7 심3', (d) => {
            // 가운데가 뚫린 물건(훌라후프·옷걸이·창문)을 꼭 넣는다: 테두리의 모양으로 본다.
            const HOLLOW = { cir: '훌라후프', tri: '옷걸이', sq: '창문' };
            const [same, other] = d.shuffle(KINDS), hollow = THINGS.find((thing) => thing.name === HOLLOW[same]);
            const list = d.shuffle([hollow, d.pick(thingsOf(other))].concat(d.shuffle(thingsOf(same).filter((thing) => thing !== hollow)).slice(0, 2))), at = list.findIndex((thing) => thing.k === other);
            return C(`${say(same)}이 아닌 물건은?`, TAGS.slice(0, 4), at, {
              figure: thingsFig(list, { per: 4, tags: TAGS }), explain: `${TAGS[at]}(${list[at].name})는 ${say(other)}이다. ${hollow.name}처럼 가운데가 비어 있는 물건도 테두리의 모양을 본다.`,
              facts: { truth: list.map((thing) => thing.k !== same), want: true }
            });
          }),
          T('find-group', '같은 모양끼리 모은 것 고르기', '①9', (d) => {
            // 세 무리 가운데 하나만 모두 같은 모양이다. 나머지 두 무리에는 다른 모양이 하나씩 끼어 있다.
            const [a, b, c] = d.shuffle(KINDS), pool = { sq: d.shuffle(thingsOf('sq')), tri: d.shuffle(thingsOf('tri')), cir: d.shuffle(thingsOf('cir')) }, take = (k) => pool[k].pop();
            const groups = d.shuffle([[take(a), take(a), take(a)], d.shuffle([take(b), take(b), take(c)]), d.shuffle([take(c), take(c), take(b)])]);
            const pure = groups.map((list) => new Set(list.map((thing) => thing.k)).size === 1), at = pure.indexOf(true);
            return C('같은 모양끼리 모은 것은?', TAGS.slice(0, 3), at, {
              figure: G.tiles(groups.map((list, i) => [TAGS[i], thingsFig(list, { per: 3, cw: 80 })])),
              explain: `${TAGS[at]}의 물건은 모두 ${say(groups[at][0].k)}이다. 나머지에는 다른 모양이 하나씩 섞여 있다.`, facts: { truth: pure, want: true }
            });
          }),
          T('find-gathered', '모아 놓은 물건의 모양', '①10', (d) => {
            const k = d.pick(KINDS), list = d.shuffle(thingsOf(k)).slice(0, 3);
            return C('같은 모양의 물건을 모았다. 어떤 모양을 모은 것인가?', SAYS, KINDS.indexOf(k), {
              figure: thingsFig(list, { per: 3 }), explain: `${josa(list.map((thing) => thing.name).join(', '), '은/는')} 모두 ${WHY[k]} ${say(k)}이다.`,
              facts: { kindPick: { kinds: KINDS, target: k } }
            });
          }),
          T('find-sort', '같은 모양끼리 모아 수 세기', '심7', (d) => {
            // 물건 여덟을 세 모양으로 가른다(모양마다 2~4개).
            const n = d.pick([[3, 3, 2], [3, 2, 3], [2, 3, 3], [4, 2, 2], [2, 4, 2], [2, 2, 4]]), list = pickThings(d, { sq: n[0], tri: n[1], cir: n[2] });
            return M('물건을 같은 모양끼리 모으려고 한다. 모양마다 몇 개씩인가?', KINDS.map((k, i) => ({ label: say(k), answer: n[i], unit: '개' })), {
              figure: thingsFig(list, { per: 4, tags: TAGS }), explain: KINDS.map((k, i) => `${say(k)}은 ${TAGS.filter((_, at) => list[at] && list[at].k === k).join(', ')}의 ${n[i]}개`).join(', ') + '이다.',
              facts: { parts: KINDS.map((k, i) => [list.map((thing) => (thing.k === k ? 1 : 0)).join('+'), i]) }
            });
          })
        ]
      },
      {
        id: 'feature', title: '모양의 특징과 본뜨기', standard: SHAPE,
        types: [
          T('stamp-shape', '찍거나 본뜰 때 나오는 모양', '①11 심9', (d) => {
            const solid = d.pick(SOLIDS), [did, got] = d.pick([['찰흙 위에 찍었다', '찰흙에 찍힌'], ['종이에 대고 본떴다', '종이에 본뜬'], ['물감을 묻혀 종이에 찍었다', '종이에 찍힌']]);
            return C(`${solid.name}의 색칠한 쪽을 ${did}. ${got} 모양은?`, SAYS, KINDS.indexOf(solid.k), {
              figure: solidsFig([solid]), explain: `색칠한 쪽은 ${WHY[solid.k]} ${say(solid.k)}이다. 찍거나 본뜨면 그 쪽의 모양이 그대로 나온다.`, facts: { kindPick: { kinds: KINDS, target: solid.k } }
            });
          }),
          T('stamp-thing', '그 모양이 나오는 물건 고르기', '①12', (d) => {
            // 색칠한 쪽의 모양이 그 모양인 물건은 하나뿐이다. 삼각김밥은 세모 쪽을 칠한 것과 옆쪽을 칠한 것이 따로 있다.
            const target = d.pick(KINDS), hit = d.pick(SOLIDS.filter((solid) => solid.k === target));
            const others = d.until(() => d.shuffle(SOLIDS.filter((solid) => solid.k !== target)).slice(0, 3), (three) => new Set(three.map((solid) => solid.k)).size === 2 && new Set(three.concat([hit]).map((solid) => solid.name + solid.k)).size === 4);
            const list = d.shuffle([hit].concat(others));
            return C(`색칠한 쪽을 종이에 대고 본뜰 때, ${say(target)}이 나오는 물건은?`, TAGS.slice(0, 4), list.indexOf(hit), {
              figure: solidsFig(list, { per: 2, cw: 120, tags: TAGS }), explain: `${TAGS[list.indexOf(hit)]}(${hit.name})의 색칠한 쪽이 ${WHY[target]} ${say(target)}이다.`,
              facts: { kindPick: { kinds: list.map((solid) => solid.k), target } }
            });
          }),
          T('feature-read', '설명을 읽고 모양 고르기', '①14 심11', (d) => {
            const k = d.pick(KINDS);
            return C('설명에 알맞은 모양은?', SAYS, KINDS.indexOf(k), { figure: conditions(TELL[k]), explain: `${FEATURE[k]} 모양은 ${say(k)}이다.`, facts: { kindPick: { kinds: KINDS, target: k } } });
          }),
          T('feature-match', '설명 셋에 알맞은 모양의 차례', '심11', (d) => {
            const order = d.pick(ORDERS), rows = order.map((i) => (KINDS[i] === 'cir' ? d.pick(TELL.cir) : TELL[KINDS[i]][0]));
            const options = d.shuffle([order].concat(d.shuffle(ORDERS.filter((o) => o !== order)).slice(0, 3)));
            return C('㉠, ㉡, ㉢에 알맞은 모양을 차례로 쓴 것은?', options.map(marks), options.indexOf(order), {
              figure: tagged(rows), explain: '뾰족한 부분이 3군데이면 △ 모양, 4군데이면 □ 모양이다. 뾰족한 부분이 없고 둥근 부분만 있으면 ○ 모양이다.',
              facts: { truth: options.map((o) => o.join() === order.join()), want: true }
            });
          }),
          T('feature-say', '모양에 알맞은 설명 고르기', '①15', (d) => {
            const k = d.pick(KINDS), good = d.pick(CLAIMS.filter(([, kinds]) => kinds.includes(k))), rows = d.shuffle([good].concat(d.shuffle(CLAIMS.filter(([, kinds]) => !kinds.includes(k))).slice(0, 3)));
            return C(`${say(k)}에 대한 설명으로 옳은 것은?`, rows.map(([text]) => text), rows.indexOf(good), {
              figure: frame(90, 68, put(45, 34, paint(d.pick(FLAT[k])(), d.pick(FILLS))), say(k)), explain: `${say(k)}은 ${TELL[k].join(' ')}`,
              facts: { truth: rows.map(([, kinds]) => kinds.includes(k)), want: true }
            });
          }),
          T('feature-mixed', '세 모양에 대한 설명 가리기', '①15', (d) => {
            // 모양마다 맞는 말 하나씩과, 틀린 말 하나
            const good = KINDS.map((k) => [k, d.pick(CLAIMS.filter(([, kinds]) => kinds.includes(k)))]), badKind = d.pick(KINDS);
            const bad = [badKind, d.pick(CLAIMS.filter(([text, kinds]) => !kinds.includes(badKind) && text !== good[KINDS.indexOf(badKind)][1][0]))];
            const rows = d.shuffle(good.concat([bad]));
            return C('모양에 대한 설명으로 옳지 않은 것은?', rows.map(([k, [text]]) => `${say(k)}은 ${text}`), rows.indexOf(bad), {
              explain: `${say(badKind)}은 ${TELL[badKind].join(' ')}`, facts: { truth: rows.map(([k, [, kinds]]) => kinds.includes(k)), want: false }
            });
          }),
          T('feature-points', '뾰족한 부분의 수', '①14·15', (d) => {
            const k = d.pick(['sq', 'tri']), piece = d.pick(FLAT[k])();
            return N('모양에서 뾰족한 부분은 모두 몇 군데인가?', POINTS[k], {
              unit: '군데', figure: frame(90, 68, put(45, 34, paint(piece, d.pick(FILLS))), say(k)), explain: `${say(k)}에는 뾰족한 부분이 ${POINTS[k]}군데 있다.`, facts: { segments: { points: piece.p, closed: true } }
            });
          }),
          T('feature-count', '특징에 맞는 물건의 수', '①16 심12', (d) => {
            const target = d.pick(KINDS), [p, q] = d.shuffle(KINDS.filter((k) => k !== target)), n = d.int(2, 3);
            const list = pickThings(d, { [target]: n, [p]: 2, [q]: 4 - n });
            return N(`${FEATURE[target]} 물건은 모두 몇 개인가?`, n, {
              unit: '개', figure: thingsFig(list, { per: 3, tags: TAGS }), explain: `${FEATURE[target]} 모양은 ${say(target)}이다. ${say(target)}인 물건은 ${tagNames(list, (thing) => thing.k === target)}이다.`,
              facts: { tallyOf: { list: list.map((thing) => thing.k), target } }
            });
          }),
          T('feature-all', '특징에 맞는 모양을 모두 찾기', '①16 심12', (d) => {
            // 크기와 생김새가 다른 모양 조각 여섯(반듯하게 놓인 것)
            const target = d.pick(KINDS), [p, q] = d.shuffle(KINDS.filter((k) => k !== target)), n = d.int(2, 3);
            const kinds = d.shuffle([].concat(Array(n).fill(target), Array(2).fill(p), Array(4 - n).fill(q))), used = { sq: d.shuffle(FLAT.sq), tri: d.shuffle(FLAT.tri), cir: d.shuffle(FLAT.cir) };
            const list = kinds.map((k) => { const makeOne = used[k].pop() || d.pick(FLAT[k]); return makeOne(); }), flags = kinds.map((k) => k === target), made = setOptions(d, TAGS.slice(0, 6), flags);
            return C(`${FEATURE[target]} 모양을 모두 고른 것은?`, made.options, made.answer, {
              figure: shapesFig(list, d.shuffle(FILLS), { per: 3, tags: TAGS }), explain: `${FEATURE[target]} 모양은 ${TAGS.filter((_, i) => flags[i]).join(', ')}이다. 크기가 달라도 뾰족한 부분의 수가 같으면 같은 모양이다.`,
              facts: { sets: { labels: TAGS.slice(0, 6), flags, options: made.sets } }
            });
          }),
          T('feature-hidden', '한쪽이 가려진 모양', '①17', (d) => {
            const k = d.pick(KINDS), turn = d.pick([0, 90, 180, 270]);
            const seen = { sq: '보이는 쪽에 뾰족한 부분이 2군데 있고, 두 곧은 선이 나란히 종이 밑으로 들어간다. 가려진 쪽에도 뾰족한 부분이 2군데 있는', tri: '보이는 쪽에 뾰족한 부분이 2군데 있고, 두 곧은 선이 종이 밑으로 갈수록 가까워진다. 가려진 쪽에서 만나 뾰족한 부분이 1군데 더 생기는', cir: '뾰족한 부분이 없고 둥근 부분만 보이는' }[k];
            return C('모양의 한쪽이 종이에 가려져 있다. 어떤 모양인가?', SAYS, KINDS.indexOf(k), {
              figure: frame(90, 84, put(45, 42, hiddenShape(k, turn, d.pick(FILLS))), '한쪽이 종이에 가려진 모양'), explain: `${seen} ${say(k)}이다.`, facts: { kindPick: { kinds: KINDS, target: k } }
            });
          }),
          T('feature-use', '쓰임에 알맞은 모양', '심13', (d) => {
            const thing = d.pick(['자전거 바퀴', '유모차 바퀴', '손수레 바퀴']);
            return C(`${thing}는 잘 굴러가야 한다. 바퀴에 알맞은 모양은?`, SAYS, 2, { explain: '○ 모양은 뾰족한 부분이 없고 둥글어서 잘 굴러간다.', facts: { kindPick: { kinds: KINDS, target: 'cir' } } });
          })
        ]
      },
      { id: 'make', title: '세 모양으로 꾸민 모양', standard: SHAPE, types: [] },
      { id: 'hour', title: '몇 시', standard: TIME, types: [] },
      { id: 'half', title: '몇 시 30분', standard: TIME, types: [] }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
