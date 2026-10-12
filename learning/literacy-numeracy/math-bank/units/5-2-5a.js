// 5학년 2학기 5단원 직육면체 — 단원 틀, 그림 도구(겨냥도·전개도), 기본 문항(직육면체와 정육면체, 면·모서리·꼭짓점).
// 수집해 둔 교과서 9종의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1~3: 73·79·63꼴, 심화꼴 74꼴)을 번호마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 뺌(까닭) / 미룸」을 가른 대조표는 references/textbooks/수학/_분석/5-2-5/싣기_대조표.md 에 있다.
// (직육면체의 성질·겨냥도·전개도의 기본 문항은 5-2-5b.js, 실력 문항은 5-2-5c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2, ③n = 기본꼴_3, 심n = 심화꼴.
//
// 영역: 도형과 측정 가운데 도형. 직육면체·정육면체의 뜻, 구성 요소, 성질, 겨냥도와 전개도가 이 단원의 일이다.
//   6수03-03 직육면체와 정육면체를 이해하고, 구성 요소와 성질을 탐구하고 설명할 수 있다.
//   6수03-04 직육면체와 정육면체의 겨냥도와 전개도를 그릴 수 있다.
//   교육과정: 「입체도형의 전개도에 대한 평가는 전개도가 될 수 있는 것과 될 수 없는 것을 구별하는 데 중점을 둔다.」
//
// 싣는 기준
//  - 뜻·구성 요소·성질 그 자체를 묻는다. 주는 것(글·겨냥도·전개도), 묻는 것, 도형(직육면체인가 정육면체인가), 쓰는 성질이 다르면 다른 문제다.
//    수나 이름만 다른 것은 한 번만 싣는다.
//  - 길이는 성질을 한 번 바로 대는 것만 싣는다: 평행한 모서리·맞닿는 변의 길이 읽기, 길이가 같은 모서리끼리 묶어 한 번 구하는 합(정육면체 × 12, 직육면체 (세 길이의 합) × 4,
//    한 면의 네 모서리, 보이지 않는 모서리 셋, 보이는 모서리 아홉, 전개도에서 옆면이 이어진 선분), 정육면체의 합에서 한 모서리(÷ 12) 한 번.
//  - 그림은 셈하여 그린다. 겨냥도는 가로·세로·높이를 적힌 수의 비율대로 잡아 비스듬히 본 그림으로 옮기고(평행한 모서리는 정말로 평행하다),
//    보이는 모서리는 실선, 보이지 않는 모서리는 점선으로 긋는다. 전개도는 면을 정확한 크기로 놓고 접는 선은 점선, 자르는 선은 실선으로 긋는다.
//    전개도가 될 수 있는지, 접었을 때 어느 면·점·선분이 만나는지는 상자를 면 위로 굴려 보는 셈(fold)으로 판정한다.
//  - 서술형·작도는 싣지 않는다. 고르기나 수 답으로 바꿀 수 있는 것은 바꾸었다(겨냥도 완성하기 → 빠뜨린 모서리와 그릴 선, 전개도 그리기 → 면을 붙일 자리·알맞은 전개도 고르기).
//
// 뺀 것과 까닭(단원 전체)
//  - 넓이를 구하는 것(①21·35·64 ②72 ③21·59 심64~68): 면의 넓이·겉넓이는 측정(5-1 넓이, 6학년 겉넓이)의 일이다. 「평행한 면의 넓이」 한 번도 싣지 않았다.
//  - 상자를 묶는 끈·리본·테이프의 길이(①70 ②73·74 심62·63), 철사로 만들고 남는 길이(심56): 길이를 여러 번 셈하는 측정 문제다.
//  - 전개도의 둘레·색칠한 부분의 둘레(①63 ②71 ③58 심59~61): 변을 하나하나 대어 더하는 길이 셈이다.
//  - 길이를 거꾸로·거듭 셈하는 것: 모서리의 길이의 합에서 직육면체의 한 모서리(①19 ②21 ③19 심52), 합이 같은 정육면체의 한 모서리(①20 ②22 심51),
//    보이지 않는(보이는) 모서리의 합에서 한 모서리(①45 ②50 ③39), 한 면의 둘레에서 이어 가는 것(②38의 변형 ③20 심54·55), 잘라 낸 나머지의 합(②24의 변형 심58),
//    두 합의 차·비교(심44·45의 변형), 소수의 곱이 낀 큐브(심57)
//  - 주사위 눈의 합·수 규칙 퍼즐(①71~73 ②75·76 ③60 심70·71): 평행한 면을 찾은 뒤의 덧셈·뺄셈 퍼즐이다. 「평행한 면에 적힌 수」를 그대로 묻는 것만 실었다.
//  - 위·앞·옆에서 본 모양(②23의 변형 ③61·63 심19·69), 쌓기나무·색칠한 면 세기(②77의 변형 ③62): 6학년 내용이거나 경우 따지기다.
//  - 최소공배수로 쌓는 정육면체(②77), 가장 짧은 길의 가짓수(②78), 전개도의 가짓수(②79): 다른 단원의 일이거나 경우 세기다.
//  - 설명을 듣고 면·모서리·꼭짓점 맞히기(①11): 「면, 모서리, 꼭짓점의 뜻」과 같은 판단에 수를 단서로 얹은 것이다. 수 단서는 같은 묶음의 「면, 모서리, 꼭짓점의 수」의 답을 흘린다.
//  - 뜻 없는 셈: 면·모서리·꼭짓점의 수의 합과 차(①10 ②14 심4), 보이는 것·보이지 않는 것의 수의 합·차·곱(①39의 변형 ②45 ③37의 변형 심20), 두 답의 합(①26의 변형)
//  - 그리기·색칠하기(①23·40·41·57·65·67·68 ②26·42·57·59·67·68 ③24·34·40·54~56 심24·72), 까닭·같은 점 쓰기(①6·42 ②7 ③4·11·12·35·44 심2·7·23·36): 고르기로 바꿀 수 있는 것은 바꾸어 실었다.
//  - 끈·테이프가 지나간 자리, 상자에 그은 선을 전개도에 옮겨 그리기(①69 ②64 ③57 심73·74): 작도
//  - 무늬가 있는 전개도와 접은 모양(①56 ②63), 자른 모서리대로 펼친 모양(심38): 무늬의 방향·자른 모서리를 그리는 도구가 없어 미루었다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」. 수와 단위 기호는 띄어 쓴다(7 cm).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, N, M, C } = B.kit;
  const G = B.kit.geo;
  const SOLID = '6수03-03', DRAW = '6수03-04';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const TAGS = ['가', '나', '다', '라', '마', '바'], MARKS = ['㉠', '㉡', '㉢', '㉣', '㉤'];
  const cm = (v) => v + ' cm';
  const fixed = (...values) => ({ calc: values.map((v, i) => [String(v), i]), unseen: values });

  // ── 보기 짜기 ────────────────────────────────────────────────
  // 여럿을 고르는 문제의 보기: 맞는 묶음 하나와, 거기서 하나를 빼거나 더하거나 바꾼 틀린 묶음 셋
  function setOptions(d, labels, flags, join) {
    const key = (list) => list.join(join || ', '), right = labels.filter((_, i) => flags[i]), pool = [];
    labels.forEach((_, i) => { const flipped = labels.filter((__, j) => (j === i ? !flags[j] : flags[j])); if (flipped.length) pool.push(flipped); });
    labels.forEach((_, i) => labels.forEach((__, j) => { if (flags[i] && !flags[j]) pool.push(labels.filter((___, k) => (k === i ? false : k === j ? true : flags[k]))); }));
    const out = [right], seen = new Set([key(right)]);
    for (const cand of d.shuffle(pool)) { if (out.length === 4) break; if (!seen.has(key(cand))) { seen.add(key(cand)); out.push(cand); } }
    const list = d.shuffle(out);
    return { options: list.map(key), answer: list.findIndex((o) => key(o) === key(right)), sets: list };
  }
  // 설명 고르기: want 가 true 이면 옳은 것 하나와 틀린 것 셋, false 이면 옳은 것 셋과 틀린 것 하나. 틀린 설명은 [틀린 말, 바로잡는 말]로 적는다.
  function say(d, text, trues, falses, want, lead, figure) {
    const wrong = d.shuffle(falses).slice(0, want ? 3 : 1), rows = d.shuffle((want ? [d.pick(trues)] : d.shuffle(trues).slice(0, 3)).map((t) => [t, true]).concat(wrong.map((f) => [f[0], false])));
    return C(text, rows.map((r) => r[0]), rows.findIndex((r) => r[1] === want), {
      figure, explain: [lead].concat(wrong.map((f) => f[1])).filter(Boolean).join(' '), facts: { truth: rows.map((r) => r[1]), want }
    });
  }
  // 낱말 하나 고르기
  function pickWord(d, text, want, others, explain, figure) {
    const options = d.shuffle([want].concat(others));
    return C(text, options, options.indexOf(want), { figure, explain, facts: { truth: options.map((o) => o === want), want: true } });
  }

  // ── 그림(픽셀 단위) ──────────────────────────────────────────
  const f1 = (n) => Math.round(n * 10) / 10;
  const ptsOf = (list) => list.map((p) => f1(p[0]) + ',' + f1(p[1])).join(' ');
  // 선분. kind: ''(실선), 'dash'(점선), 'thin'(가는 선). css 로 빛깔·굵기를 바꾼다.
  const stroke = (p, q, kind, css) => '<line class="mb-line' + (kind === 'dash' ? ' is-cut' : kind === 'thin' ? ' is-thin' : '') + '"' + (css ? ' style="' + css + '"' : '') + ' x1="' + f1(p[0]) + '" y1="' + f1(p[1]) + '" x2="' + f1(q[0]) + '" y2="' + f1(q[1]) + '"/>';
  const fill = (list, color) => '<polygon points="' + ptsOf(list) + '" style="fill:' + color + ';stroke:none"/>';
  const word = (p, text, kind) => '<text class="mb-label' + (kind ? ' ' + kind : '') + '"' + (/^[㉠-㉤]$/.test(text) ? ' style="font-size:15px"' : '') + ' x="' + f1(p[0]) + '" y="' + f1(p[1]) + '" text-anchor="middle" dominant-baseline="central">' + text + '</text>';
  // 글의 너비(어림): 한글·기호는 글자 크기만큼, 숫자·로마자는 그 0.58배
  const wide = (text, size) => Array.from(String(text)).reduce((s, ch) => s + (/[0-9a-zA-Z]/.test(ch) ? 0.58 : ch === ' ' ? 0.3 : 1), 0) * size;
  const CREAM = '#fff8e1', YELLOW = 'rgba(251,191,36,0.5)', BLUE = 'rgba(96,165,250,0.5)';
  // 그릴 것을 모으며 차지한 자리를 재어, 끝에 꼭 맞는 크기의 그림으로 낸다.
  function canvas() {
    const parts = []; let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    const see = (x, y) => { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); };
    return {
      add: (html) => { parts.push(html); },
      point: (p) => see(p[0], p[1]),
      box: (c, hw, hh) => { see(c[0] - hw, c[1] - hh); see(c[0] + hw, c[1] + hh); },
      size: () => [x1 - x0, y1 - y0],
      // 너비가 64px 에 못 미치는 그림은 양옆 여백을 넓힌다(화면 검사가 너무 좁은 그림을 떨어뜨린다).
      out: (label, pad) => {
        const m = pad == null ? 6 : pad, side = Math.max(m, (64 - (x1 - x0)) / 2), w = x1 - x0 + side * 2, h = y1 - y0 + m * 2;
        return '<svg class="mb-geo" viewBox="' + f1(x0 - side) + ' ' + f1(y0 - m) + ' ' + f1(w) + ' ' + f1(h) + '" width="' + Math.ceil(w) + '" role="img" aria-label="' + label + '">' + parts.join('') + '</svg>';
      }
    };
  }
  // 글 상자(가운데 c, 반너비 hw, 반높이 hh)가 선분 a–b 나 다른 글 상자에 닿는가
  const hitSeg = (c, hw, hh, a, b) => { for (let k = 0; k <= 40; k += 1) { const x = a[0] + (b[0] - a[0]) * k / 40, y = a[1] + (b[1] - a[1]) * k / 40; if (Math.abs(x - c[0]) < hw && Math.abs(y - c[1]) < hh) return true; } return false; };
  // 점 pt 에서 선분 a–b 까지의 거리
  const segGap = (pt, a, b) => { const rx = b[0] - a[0], ry = b[1] - a[1], t = Math.max(0, Math.min(1, ((pt[0] - a[0]) * rx + (pt[1] - a[1]) * ry) / (rx * rx + ry * ry))); return Math.hypot(pt[0] - a[0] - rx * t, pt[1] - a[1] - ry * t); };
  const hitBox = (c, hw, hh, t) => Math.abs(c[0] - t.c[0]) < hw + t.hw && Math.abs(c[1] - t.c[1]) < hh + t.hh;
  const tiles = (list, labels) => G.tiles(list.map((svg, i) => [(labels || TAGS)[i], svg]));

  // ── 직육면체의 얼개 ──────────────────────────────────────────
  // 꼭짓점 번호 v(0~7): 가로 쪽 끝이면 1, 세로(안쪽) 끝이면 2, 높이(위) 쪽 끝이면 4 를 더한다.
  // 이름은 교과서 그림대로 윗면 ㄱㄴㄷㄹ(왼쪽 뒤부터 시계 반대 방향), 아랫면 ㅁㅂㅅㅇ.
  const VERTS = [0, 1, 2, 3, 4, 5, 6, 7];
  const VNAME = ['ㅂ', 'ㅅ', 'ㅁ', 'ㅇ', 'ㄴ', 'ㄷ', 'ㄱ', 'ㄹ'];
  // 면 번호 = 축 × 2 + 쪽: 0 왼쪽, 1 오른쪽, 2 앞, 3 뒤, 4 아래, 5 위
  const FNAME = ['ㄱㅁㅂㄴ', 'ㄷㅅㅇㄹ', 'ㄴㅂㅅㄷ', 'ㄱㅁㅇㄹ', 'ㅁㅂㅅㅇ', 'ㄱㄴㄷㄹ'];
  const FACES = [0, 1, 2, 3, 4, 5];
  const ringOf = (f) => { const ax = f >> 1, s = f & 1, u = (ax + 1) % 3, w = (ax + 2) % 3; return [[0, 0], [1, 0], [1, 1], [0, 1]].map(([i, j]) => (s << ax) | (i << u) | (j << w)); };
  const faceHas = (f, v) => ((v >> (f >> 1)) & 1) === (f & 1);
  const facesAt = (v) => [0, 1, 2].map((ax) => ax * 2 + ((v >> ax) & 1));
  const opposite = (f) => f ^ 1;
  const isPara = (f, g) => f !== g && (f >> 1) === (g >> 1);
  const isPerp = (f, g) => (f >> 1) !== (g >> 1);
  // 모서리 12개: { v: [두 끝], ax: 놓인 방향(0 가로, 1 세로, 2 높이), name, faces: 이 모서리에서 만나는 두 면 }
  const EDGES = [];
  for (let ax = 0; ax < 3; ax += 1) for (const v of VERTS) if (!((v >> ax) & 1)) {
    const w = v | (1 << ax), u1 = (ax + 1) % 3, u2 = (ax + 2) % 3;
    EDGES.push({ v: [v, w], ax, name: [VNAME[v], VNAME[w]].sort().join(''), faces: [u1 * 2 + ((v >> u1) & 1), u2 * 2 + ((v >> u2) & 1)] });
  }
  const edgeOf = (name) => EDGES.findIndex((e) => e.name === name);
  const edgesAt = (v) => EDGES.map((e, i) => (e.v.includes(v) ? i : -1)).filter((i) => i >= 0);
  const face = (f) => '면 ' + FNAME[f], edge = (e) => '모서리 ' + EDGES[e].name;
  // 서로 다른 세 길이(가장 긴 것이 가장 짧은 것의 두 배를 넘지 않아 그림의 비율이 고르다)
  const dims3 = (d, lo, hi) => d.until(() => [d.int(lo, hi), d.int(lo, hi), d.int(lo, hi)], (v) => new Set(v).size === 3 && Math.max(...v) <= 2 * Math.min(...v));

  // ── 그림: 겨냥도 ─────────────────────────────────────────────
  // 비스듬히 본 그림: 안쪽으로 1 들어간 점은 오른쪽으로 DEP[0], 위로 DEP[1] 옮겨 그린다(mirror 이면 왼쪽으로). 평행한 모서리는 그림에서도 평행하다.
  const DEP = [0.5, 0.36];
  // dims: [가로, 세로(안쪽), 높이]. o: { mirror(왼쪽 옆면이 보이게), size: [너비, 높이](px), names(true 또는 { 꼭짓점 번호: 이름 }),
  //   lens: [[모서리 번호, 글], …], tint: { 면 번호: 빛깔 }, faceText: { 면 번호: 글 }, style: { 모서리 번호: 'solid' | 'dash' | 'none' }, bold: [모서리 번호], dots: [꼭짓점 번호], label }
  function sketch(dims, o) {
    const opt = o || {}, dep = [opt.mirror ? -DEP[0] : DEP[0], DEP[1]], size = opt.size || [150, 104];
    const raw = VERTS.map((v) => { const x = v & 1 ? dims[0] : 0, y = v & 2 ? dims[1] : 0, z = v & 4 ? dims[2] : 0; return [x + y * dep[0], -(z + y * dep[1])]; });
    const xs = raw.map((p) => p[0]), ys = raw.map((p) => p[1]), k = Math.min(size[0] / (Math.max(...xs) - Math.min(...xs)), size[1] / (Math.max(...ys) - Math.min(...ys)));
    const P = raw.map(([x, y]) => [x * k, y * k]), mid = [P.reduce((s, p) => s + p[0], 0) / 8, P.reduce((s, p) => s + p[1], 0) / 8];
    const seenF = (f) => seenFace(f, opt.mirror), seenE = (e) => EDGES[e].faces.some(seenF);
    const cv = canvas(), walls = [], taken = [];
    P.forEach(cv.point);
    FACES.filter(seenF).forEach((f) => cv.add(fill(ringOf(f).map((v) => P[v]), CREAM)));
    Object.keys(opt.tint || {}).forEach((f) => cv.add(fill(ringOf(Number(f)).map((v) => P[v]), opt.tint[f])));
    const kindOf = (e) => (opt.style && opt.style[e]) || (seenE(e) ? 'solid' : 'dash');
    for (const pass of ['dash', 'solid']) EDGES.forEach((E, e) => {
      if (kindOf(e) !== pass) return;
      walls.push([P[E.v[0]], P[E.v[1]]]);
      cv.add(stroke(P[E.v[0]], P[E.v[1]], pass === 'dash' ? 'dash' : '', (opt.bold || []).includes(e) ? 'stroke:#dc2626;stroke-width:3.4' : ''));
    });
    (opt.dots || []).forEach((v) => cv.add('<circle cx="' + f1(P[v][0]) + '" cy="' + f1(P[v][1]) + '" r="4" style="fill:#dc2626"/>'));
    const put = (c, text, kind, hw, hh) => { cv.add(word(c, text, kind)); cv.box(c, hw, hh); taken.push({ c, hw, hh }); };
    // 꼭짓점 이름: 그 꼭짓점에서 나가는 모서리들 사이의 빈 쪽 가운데 둘레의 모서리와 가장 멀리 떨어지는 자리에 적는다(테두리의 꼭짓점은 바깥쪽이 된다).
    const names = opt.names === true ? VNAME : opt.names || {}, every = EDGES.map((E) => [P[E.v[0]], P[E.v[1]]]);
    VERTS.forEach((v) => {
      if (!names[v]) return;
      const angs = edgesAt(v).map((e) => { const w = EDGES[e].v[0] === v ? EDGES[e].v[1] : EDGES[e].v[0]; return Math.atan2(P[w][1] - P[v][1], P[w][0] - P[v][0]); }).sort((a, b) => a - b);
      const spots = angs.map((a, i) => { const b = i + 1 < angs.length ? angs[i + 1] : angs[0] + 2 * Math.PI, c = [P[v][0] + 12 * Math.cos((a + b) / 2), P[v][1] + 12 * Math.sin((a + b) / 2)]; return { c, gap: b - a, room: Math.min(...every.map((w) => segGap(c, w[0], w[1]))) }; });
      spots.sort((p, q) => (Math.abs(q.room - p.room) > 0.6 ? q.room - p.room : q.gap - p.gap));
      put(spots[0].c, names[v], '', 6.5, 7);
    });
    Object.keys(opt.faceText || {}).forEach((f) => { const ring = ringOf(Number(f)).map((v) => P[v]); put([ring.reduce((s, p) => s + p[0], 0) / 4, ring.reduce((s, p) => s + p[1], 0) / 4], opt.faceText[f], '', 7, 7.5); });
    // 길이 글: 모서리 옆(되도록 그림 바깥쪽)의 여러 자리 가운데 선이나 다른 글에 닿지 않는 첫 자리에 적는다.
    (opt.lens || []).forEach(([e, text]) => {
      const a = P[EDGES[e].v[0]], b = P[EDGES[e].v[1]], L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = [-(b[1] - a[1]) / L, (b[0] - a[0]) / L], m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      const out = (m[0] - mid[0]) * n[0] + (m[1] - mid[1]) * n[1] >= 0 ? 1 : -1, hw = wide(text, 12) / 2 + 1, hh = 7.5;
      let spot = null;
      for (const s of [out, -out]) for (const gap of [4, 8, 12]) for (const t of [0.5, 0.4, 0.6, 0.3, 0.7]) {
        if (spot) break;
        const far = gap + hw * Math.abs(n[0]) + hh * Math.abs(n[1]), c = [a[0] + (b[0] - a[0]) * t + n[0] * s * far, a[1] + (b[1] - a[1]) * t + n[1] * s * far];
        if (!walls.some((w) => hitSeg(c, hw + 1.5, hh + 1, w[0], w[1])) && !taken.some((box) => hitBox(c, hw + 4, hh + 2, box))) spot = c;
      }
      put(spot || [m[0] + n[0] * out * (14 + hw), m[1] + n[1] * out * (14 + hh)], text, 'is-length', hw, hh);
    });
    return cv.out(opt.label || '직육면체의 겨냥도');
  }
  // 겨냥도에서 보이는 면: 앞, 위, 그리고 옆면 하나(mirror 이면 왼쪽)
  function seenFace(f, mirror) { return f === 2 || f === 5 || f === (mirror ? 0 : 1); }
  const seenEdge = (e, mirror) => EDGES[e].faces.some((f) => seenFace(f, mirror));
  const seenVert = (v, mirror) => facesAt(v).some((f) => seenFace(f, mirror));
  // 세 길이를 적는 자리: 가로는 앞 아래 모서리, 세로는 아래 옆 모서리, 높이는 옆 뒤 모서리(모두 그림의 테두리라 글이 바깥에 놓인다).
  const lenEdges = (mirror) => [edgeOf('ㅂㅅ'), edgeOf(mirror ? 'ㅁㅂ' : 'ㅅㅇ'), edgeOf(mirror ? 'ㄱㅁ' : 'ㄹㅇ')];
  const withLens = (dims, mirror) => lenEdges(mirror).map((e, i) => [e, cm(dims[i])]);
  const saidLens = (dims) => `가로 ${dims[0]} cm, 세로 ${dims[1]} cm, 높이 ${dims[2]} cm`;

  // ── 그림: 여러 가지 입체도형 ─────────────────────────────────
  // 볼록한 입체를 같은 방법으로 비스듬히 본 그림. verts: [x, y(안쪽), z(위)], faces: 꼭짓점 번호의 고리.
  function solid(verts, faces, o) {
    const opt = o || {}, size = opt.size || [84, 70], sub3 = (p, q) => [p[0] - q[0], p[1] - q[1], p[2] - q[2]], dot3 = (p, q) => p[0] * q[0] + p[1] * q[1] + p[2] * q[2];
    const cross3 = (p, q) => [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]];
    const avg = (list) => [0, 1, 2].map((i) => list.reduce((s, p) => s + p[i], 0) / list.length), heart = avg(verts);
    // 면의 바깥쪽 법선이 보는 쪽(오른쪽 위 앞)을 향하면 보이는 면이다.
    const seen = faces.map((ring) => { let n = cross3(sub3(verts[ring[1]], verts[ring[0]]), sub3(verts[ring[2]], verts[ring[0]])); if (dot3(n, sub3(avg(ring.map((v) => verts[v])), heart)) < 0) n = n.map((x) => -x); return dot3(n, [DEP[0], -1, DEP[1]]) > 1e-9; });
    const raw = verts.map(([x, y, z]) => [x + y * DEP[0], -(z + y * DEP[1])]), xs = raw.map((p) => p[0]), ys = raw.map((p) => p[1]), k = Math.min(size[0] / (Math.max(...xs) - Math.min(...xs)), size[1] / (Math.max(...ys) - Math.min(...ys)));
    const P = raw.map(([x, y]) => [x * k, y * k]), cv = canvas(), sides = new Map();
    P.forEach(cv.point);
    faces.forEach((ring, f) => { if (seen[f]) cv.add(fill(ring.map((v) => P[v]), CREAM)); ring.forEach((v, i) => { const w = ring[(i + 1) % ring.length], key = Math.min(v, w) + '-' + Math.max(v, w); sides.set(key, (sides.get(key) || false) || seen[f]); }); });
    for (const pass of [false, true]) sides.forEach((shown, key) => { if (shown !== pass) return; const [v, w] = key.split('-').map(Number); cv.add(stroke(P[v], P[w], shown ? '' : 'dash')); });
    return cv.out(opt.label || '입체도형');
  }
  const boxVerts = (a, b, c) => VERTS.map((v) => [v & 1 ? a : 0, v & 2 ? b : 0, v & 4 ? c : 0]), BOX_FACES = FACES.map(ringOf);
  // 앞면이 다각형 front([x, z])이고 안쪽으로 depth 만큼 들어간 기둥
  function prism(front, depth) {
    const n = front.length, verts = front.map(([x, z]) => [x, 0, z]).concat(front.map(([x, z]) => [x, depth, z])), ring = front.map((_, i) => i);
    return { verts, faces: [ring, ring.map((i) => i + n)].concat(ring.map((i) => [i, (i + 1) % n, (i + 1) % n + n, i + n])) };
  }
  // 둥근 기둥(굽은 면이 있는 도형)
  function cylinder(o) {
    const rx = 27, ry = 9, h = 58, cv = canvas();
    cv.point([-rx, -ry]); cv.point([rx, h + ry]);
    cv.add('<path d="M' + -rx + ' 0V' + h + 'A' + rx + ' ' + ry + ' 0 0 0 ' + rx + ' ' + h + 'V0Z" style="fill:' + CREAM + ';stroke:none"/><ellipse class="mb-poly" cx="0" cy="0" rx="' + rx + '" ry="' + ry + '"/>');
    cv.add('<path class="mb-line is-cut" style="fill:none" d="M' + -rx + ' ' + h + 'A' + rx + ' ' + ry + ' 0 0 1 ' + rx + ' ' + h + '"/><path class="mb-line" style="fill:none" d="M' + -rx + ' ' + h + 'A' + rx + ' ' + ry + ' 0 0 0 ' + rx + ' ' + h + '"/>');
    cv.add(stroke([-rx, 0], [-rx, h]) + stroke([rx, 0], [rx, h]));
    return cv.out((o && o.label) || '위와 아래가 둥글고 옆이 굽은 기둥 모양의 도형');
  }
  // 직육면체가 아닌 입체들: { art(): 그림, said: 그림 설명, why: 직육면체가 아닌 까닭, six: 면이 6개인가 }
  const OTHERS = {
    trap: () => { const p = prism([[0, 0], [5.2, 0], [3.2, 3], [0, 3]], 3.2); return { art: (size) => solid(p.verts, p.faces, { size, label: '사다리꼴 모양의 면 2개와 직사각형 모양의 면 4개로 둘러싸인 도형' }), why: '사다리꼴 모양의 면', six: true }; },
    para: () => { const p = prism([[0, 0], [4, 0], [5.4, 3], [1.4, 3]], 3.2); return { art: (size) => solid(p.verts, p.faces, { size, label: '평행사변형 모양의 면 2개와 직사각형 모양의 면 4개로 둘러싸인 도형' }), why: '직사각형이 아닌 평행사변형 모양의 면', six: true }; },
    cut: () => { const verts = [[0, 0, 0], [5, 0, 0], [5, 3.4, 0], [0, 3.4, 0], [1, 0.7, 3], [4, 0.7, 3], [4, 2.7, 3], [1, 2.7, 3]], faces = [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]]; return { art: (size) => solid(verts, faces, { size, label: '위쪽 면이 아래쪽 면보다 작아서 옆의 면 4개가 사다리꼴 모양인 도형' }), why: '사다리꼴 모양의 면', six: true }; },
    tri: () => { const p = prism([[0, 0], [4.6, 0], [1.6, 3.2]], 3.4); return { art: (size) => solid(p.verts, p.faces, { size, label: '삼각형 모양의 면 2개와 직사각형 모양의 면 3개로 둘러싸인 도형' }), why: '삼각형 모양의 면', six: false }; },
    pyr: () => { const verts = [[0, 0, 0], [4.6, 0, 0], [4.6, 3.6, 0], [0, 3.6, 0], [2.3, 1.8, 3.6]], faces = [[0, 1, 2, 3], [0, 1, 4], [1, 2, 4], [2, 3, 4], [3, 0, 4]]; return { art: (size) => solid(verts, faces, { size, label: '삼각형 모양의 면 4개와 사각형 모양의 면 1개로 둘러싸인 뾰족한 도형' }), why: '삼각형 모양의 면', six: false }; },
    cyl: () => ({ art: () => cylinder(), why: '굽은 면', six: false })
  };
  // 작은 그림 칸에 넣는 직육면체·정육면체
  const boxTile = (a, b, c, label) => solid(boxVerts(a, b, c), BOX_FACES, { label: label || '직사각형 모양의 면 6개로 둘러싸인 도형' });
  const BOXES = [[5, 3, 2.4], [2.6, 2.6, 4.6], [4.4, 3.4, 3], [3, 4.6, 2.2], [5.2, 2.2, 3.2]];
  const cubeTile = () => solid(boxVerts(3, 3, 3), BOX_FACES, { size: [70, 62], label: '크기가 같은 정사각형 모양의 면 6개로 둘러싸인 도형' });

  // ── 전개도: 접어 보기 ────────────────────────────────────────
  // 면은 모눈 위의 직사각형 { x, y, w, h }(y 는 아래로 커진다).
  // 두 직사각형이 선분으로 맞닿는가. dir: s 가 r 의 오른쪽(0)·아래(1)·왼쪽(2)·위(3), full: 맞닿은 두 변이 꼭 같다(접는 선이 될 수 있다), a–b: 맞닿은 선분
  function touch(r, s) {
    if (r.x + r.w === s.x || s.x + s.w === r.x) {
      const lo = Math.max(r.y, s.y), hi = Math.min(r.y + r.h, s.y + s.h), x = r.x + r.w === s.x ? s.x : r.x;
      if (hi > lo) return { dir: r.x + r.w === s.x ? 0 : 2, full: r.y === s.y && r.h === s.h, a: [x, lo], b: [x, hi] };
    }
    if (r.y + r.h === s.y || s.y + s.h === r.y) {
      const lo = Math.max(r.x, s.x), hi = Math.min(r.x + r.w, s.x + s.w), y = r.y + r.h === s.y ? s.y : r.y;
      if (hi > lo) return { dir: r.y + r.h === s.y ? 1 : 3, full: r.x === s.x && r.w === s.w, a: [lo, y], b: [hi, y] };
    }
    return null;
  }
  const overlap = (r, s) => r.x < s.x + s.w && s.x < r.x + r.w && r.y < s.y + s.h && s.y < r.y + r.h;
  // 바닥에 놓인 상자(꼭짓점 여덟의 자리 [x, y, 높이])를 면 r 의 오른쪽·아래·왼쪽·위 변을 축으로 넘어뜨린다.
  const ROLL = [
    (p, r) => [r.x + r.w + p[2], p[1], r.x + r.w - p[0]],
    (p, r) => [p[0], r.y + r.h + p[2], r.y + r.h - p[1]],
    (p, r) => [r.x - p[2], p[1], p[0] - r.x],
    (p, r) => [p[0], r.y - p[2], p[1] - r.y]
  ];
  // 바닥에 닿은 면의 번호와 그 자리
  function bottomOf(pos) {
    const low = VERTS.filter((v) => pos[v][2] === 0);
    if (low.length !== 4) return null;
    const ax = [0, 1, 2].find((i) => low.every((v) => ((v >> i) & 1) === ((low[0] >> i) & 1))), xs = low.map((v) => pos[v][0]), ys = low.map((v) => pos[v][1]), x = Math.min(...xs), y = Math.min(...ys);
    return { face: ax * 2 + ((low[0] >> ax) & 1), x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y };
  }
  // k 개를 고르는 모든 경우
  function choose(list, k) { if (k === 0) return [[]]; if (list.length < k) return []; return choose(list.slice(1), k - 1).map((c) => [list[0]].concat(c)).concat(choose(list.slice(1), k)); }
  // 직사각형 여섯 개가 직육면체의 전개도인가. 꼭 같은 변으로 맞닿은 곳 가운데 다섯 곳을 접는 선으로 골라(나머지는 잘린 곳),
  // 첫 면 위에 상자를 놓고 접는 선을 따라 굴려 본다. 굴린 상자의 바닥이 다음 면과 꼭 맞아야 하고, 여섯 면이 상자의 서로 다른 면이어야 한다.
  // 돌려주는 것: { dims, face: [면마다 상자의 면 번호], pos: [면마다 그 면을 바닥에 둔 상자의 꼭짓점 자리] }. loose 이면 겹치는 면이 있어도 돌려준다(까닭을 가릴 때).
  function fold(rects, loose) {
    if (rects.length !== 6) return null;
    const joins = [];
    for (let i = 0; i < 6; i += 1) for (let j = i + 1; j < 6; j += 1) { const t = touch(rects[i], rects[j]); if (t && t.full) joins.push([i, j, t.dir]); }
    const sizes = [...new Set(rects.reduce((all, r) => all.concat([r.w, r.h]), []))], r0 = rects[0];
    for (const tree of choose(joins, 5)) for (const c of sizes) {
      const pos = [VERTS.map((v) => [r0.x + (v & 1 ? r0.w : 0), r0.y + (v & 2 ? r0.h : 0), v & 4 ? c : 0])], faces = [4], queue = [0];
      let ok = true;
      while (queue.length && ok) {
        const i = queue.shift();
        for (const [a, b, dir] of tree) {
          const j = a === i ? b : b === i ? a : -1;
          if (j < 0 || pos[j]) continue;
          const next = pos[i].map((p) => ROLL[a === i ? dir : (dir + 2) % 4](p, rects[i])), bot = bottomOf(next), r = rects[j];
          if (!bot || bot.x !== r.x || bot.y !== r.y || bot.w !== r.w || bot.h !== r.h) { ok = false; break; }
          pos[j] = next; faces[j] = bot.face; queue.push(j);
        }
      }
      if (ok && VERTS.slice(0, 6).every((i) => pos[i]) && (loose || new Set(faces).size === 6)) return { dims: [r0.w, r0.h, c], face: faces, pos };
    }
    return null;
  }
  const sameKind = (r) => Math.min(r.w, r.h) + 'x' + Math.max(r.w, r.h);
  // 전개도가 되지 않는 까닭: 'count'(면이 6개가 아니다), 'pairs'(모양과 크기가 같은 면이 3쌍이 아니다), 'overlap'(접으면 겹치는 면이 있다), 'edges'(맞닿는 변의 길이가 다르다)
  function whyNot(rects) {
    if (rects.length !== 6) return 'count';
    const tally = {}; rects.forEach((r) => { tally[sameKind(r)] = (tally[sameKind(r)] || 0) + 1; });
    if (Object.keys(tally).some((key) => tally[key] % 2)) return 'pairs';
    return fold(rects, true) ? 'overlap' : 'edges';
  }
  const WHY = { count: (rects) => `면이 ${rects.length}개이다`, pairs: () => '모양과 크기가 같은 면이 3쌍이 아니다', overlap: () => '접었을 때 서로 겹치는 면이 있다', edges: () => '접었을 때 맞닿는 모서리의 길이가 다른 곳이 있다' };
  // 전개도의 점마다 접었을 때의 꼭짓점 번호('x,y' → v). 한 점이 두 꼭짓점이 되는 그림이면 null.
  function cornersOf(rects, res) {
    const map = new Map();
    for (let i = 0; i < rects.length; i += 1) for (const v of VERTS) { const p = res.pos[i][v], key = p[0] + ',' + p[1]; if (p[2] !== 0) continue; if (map.has(key) && map.get(key) !== v) return null; map.set(key, v); }
    return map;
  }
  const insideOf = (rects) => (x, y) => rects.some((r) => x > r.x && x < r.x + r.w && y > r.y && y < r.y + r.h);
  // 한 칸짜리 선분들 가운데 테두리(면 하나에만 속한 것)
  function borderOf(rects) {
    const count = new Map(), put = (x1, y1, x2, y2) => { const key = x1 + ',' + y1 + ',' + x2 + ',' + y2; count.set(key, (count.get(key) || 0) + 1); };
    for (const r of rects) {
      for (let x = r.x; x < r.x + r.w; x += 1) { put(x, r.y, x + 1, r.y); put(x, r.y + r.h, x + 1, r.y + r.h); }
      for (let y = r.y; y < r.y + r.h; y += 1) { put(r.x, y, r.x, y + 1); put(r.x + r.w, y, r.x + r.w, y + 1); }
    }
    return [...count.keys()].filter((key) => count.get(key) === 1).map((key) => key.split(',').map(Number));
  }
  // 한 줄로 이어진 한 칸짜리 선분들을 긴 선분으로 잇는다(꺾이는 곳과 다른 선분이 갈라지는 곳에서 끊는다).
  function joined(units) {
    const out = [];
    for (const flat of [true, false]) {
      const list = units.filter((s) => (s[1] === s[3]) === flat).sort((p, q) => (flat ? p[1] - q[1] || p[0] - q[0] : p[0] - q[0] || p[1] - q[1]));
      let run = null;
      for (const s of list) {
        if (run && (flat ? run[1][1] === s[1] && run[1][0] === s[0] : run[1][0] === s[0] && run[1][1] === s[1])) run[1] = [s[2], s[3]];
        else { run = [[s[0], s[1]], [s[2], s[3]]]; out.push(run); }
      }
    }
    return out;
  }
  // 테두리를 따라 한 바퀴 돌며 만나는 점(면의 꼭짓점인 점만)을 차례로 돌려준다. 맨 위 왼쪽 점에서 시작해 아래쪽으로 돈다(교과서의 ㄱ, ㄴ, ㄷ … 차례).
  // 테두리가 한 줄로 이어지지 않으면(구멍, 한 점에서만 닿은 면) null.
  function outline(rects) {
    const next = new Map(), link = (a, b) => { if (!next.has(a)) next.set(a, []); next.get(a).push(b); };
    for (const [x1, y1, x2, y2] of borderOf(rects)) { link(x1 + ',' + y1, x2 + ',' + y2); link(x2 + ',' + y2, x1 + ',' + y1); }
    if ([...next.values()].some((list) => list.length !== 2)) return null;
    const at = (key) => key.split(',').map(Number), start = [...next.keys()].sort((p, q) => at(p)[1] - at(q)[1] || at(p)[0] - at(q)[0])[0];
    const path = [start]; let prev = start, cur = next.get(start).find((key) => at(key)[1] > at(start)[1]) || next.get(start)[0];
    while (cur !== start) { path.push(cur); const step = next.get(cur).find((key) => key !== prev); prev = cur; cur = step; if (path.length > 400) return null; }
    if (path.length !== next.size) return null;
    const corner = new Set(); rects.forEach((r) => [[r.x, r.y], [r.x + r.w, r.y], [r.x, r.y + r.h], [r.x + r.w, r.y + r.h]].forEach((p) => corner.add(p[0] + ',' + p[1])));
    return path.filter((key) => corner.has(key));
  }
  const POINTS = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
  const boundsOf = (rects) => { const x = Math.min(...rects.map((r) => r.x)), y = Math.min(...rects.map((r) => r.y)); return { x, y, w: Math.max(...rects.map((r) => r.x + r.w)) - x, h: Math.max(...rects.map((r) => r.y + r.h)) - y }; };
  const moved = (rects) => { const b = boundsOf(rects); return rects.map((r) => ({ x: r.x - b.x, y: r.y - b.y, w: r.w, h: r.h })); };
  // 읽는 차례(위에서 아래로, 왼쪽에서 오른쪽으로)로 늘어놓는다. 면의 이름 가~바를 이 차례로 붙인다.
  const sorted = (rects) => rects.slice().sort((p, q) => p.y - q.y || p.x - q.x);
  // 그림을 옆으로 눕히거나 뒤집는다.
  const turned = (rects, how) => moved(rects.map((r) => { let t = how & 1 ? { x: r.y, y: r.x, w: r.h, h: r.w } : { x: r.x, y: r.y, w: r.w, h: r.h }; if (how & 2) t = { x: -t.x - t.w, y: t.y, w: t.w, h: t.h }; if (how & 4) t = { x: t.x, y: -t.y - t.h, w: t.w, h: t.h }; return t; }));

  // ── 전개도: 그림 ─────────────────────────────────────────────
  // o: { unit: 한 칸(px), grid: 모눈을 깐다, names: 점 이름(outline 차례), pointText: { 'x,y': 글 }, faceText: [면마다 글], tint: { 면 번호: 빛깔 },
  //      ghosts: [{ rect, text }](붙일 자리 후보), lens: [{ a, b, text }](선분 옆에 적는 글), label }
  //      most: [너비, 높이]의 한도(px) — 글까지 넣은 그림이 한도를 넘으면 한 칸의 크기를 줄여 다시 그린다(휴대폰 화면의 문제 칸은 290px 이다).
  function netArt(rects, o) {
    const opt = o || {}, most = opt.most || [286, 250], box = boundsOf(rects.concat((opt.ghosts || []).map((g) => g.rect)));
    let u = opt.unit || 20, cv = netCanvas(rects, opt, u);
    for (let k = 0; k < 3; k += 1) {
      const [w, h] = cv.size();
      if (w + 10 <= most[0] && h + 10 <= most[1]) break;
      u = Math.floor(Math.min(u, (most[0] - 10 - (w - box.w * u)) / box.w, (most[1] - 10 - (h - box.h * u)) / box.h) * 10) / 10; cv = netCanvas(rects, opt, u);
    }
    tidy = !cv.far;
    return cv.out(opt.label || '전개도', opt.names || opt.pointText ? 5 : 4);
  }
  // 방금 그린 전개도에서 길이 글이 모두 제 선분 가까이에 놓였는가(멀리 밀려난 글이 있으면 어느 선분의 길이인지 알기 어렵다 — 그런 그림은 다시 뽑는다).
  let tidy = true;
  const netTidy = () => tidy;
  function netCanvas(rects, opt, u) {
    const all = rects.concat((opt.ghosts || []).map((g) => g.rect)), box = boundsOf(all), inside = insideOf(rects);
    const at = (p) => [(p[0] - box.x) * u, (p[1] - box.y) * u], cv = canvas(), taken = [];
    cv.point([0, 0]); cv.point([box.w * u, box.h * u]);
    if (opt.grid) {
      for (let x = 0; x <= box.w; x += 1) cv.add('<line class="mb-gridline" x1="' + x * u + '" y1="0" x2="' + x * u + '" y2="' + box.h * u + '"/>');
      for (let y = 0; y <= box.h; y += 1) cv.add('<line class="mb-gridline" x1="0" y1="' + y * u + '" x2="' + box.w * u + '" y2="' + y * u + '"/>');
    }
    const corners = (r) => [[r.x, r.y], [r.x, r.y + r.h], [r.x + r.w, r.y + r.h], [r.x + r.w, r.y]].map(at);
    rects.forEach((r, i) => cv.add(fill(corners(r), (opt.tint && opt.tint[i]) || (opt.grid ? 'rgba(251,191,36,0.3)' : CREAM))));
    (opt.ghosts || []).forEach((g) => {
      const c = corners(g.rect);
      cv.add('<polygon points="' + ptsOf(c) + '" style="fill:rgba(96,165,250,0.16);stroke:#2563eb;stroke-width:1.2;stroke-dasharray:2 3"/>' + word([(c[0][0] + c[2][0]) / 2, (c[0][1] + c[2][1]) / 2], g.text));
    });
    // 맞닿은 곳은 접는 선(점선), 테두리는 자르는 선(실선)
    for (let i = 0; i < rects.length; i += 1) for (let j = i + 1; j < rects.length; j += 1) { const t = touch(rects[i], rects[j]); if (t) cv.add(stroke(at(t.a), at(t.b), 'dash')); }
    for (const [a, b] of joined(borderOf(rects))) cv.add(stroke(at(a), at(b)));
    const put = (c, text, kind, hw, hh) => { cv.add(word(c, text, kind)); cv.box(c, hw, hh); taken.push({ c, hw, hh }); };
    (opt.faceText || []).forEach((text, i) => { if (text != null) { const r = rects[i]; put(at([r.x + r.w / 2, r.y + r.h / 2]), text, '', 7, 7.5); } });
    // 점 이름: 그 점 둘레에서 그림이 없는 쪽에 적는다.
    const away = (x, y) => { let sx = 0, sy = 0; for (const [dx, dy] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) if (inside(x + dx * 0.25, y + dy * 0.25)) { sx -= dx; sy -= dy; } const s = Math.hypot(sx, sy) || 1; return [sx / s, sy / s]; };
    const names = Object.assign({}, opt.pointText || {});
    if (opt.names) (outline(rects) || []).forEach((key, i) => { names[key] = opt.names[i]; });
    Object.keys(names).forEach((key) => { const [x, y] = key.split(',').map(Number), n = away(x, y), p = at([x, y]); put([p[0] + n[0] * 11, p[1] + n[1] * 11], names[key], '', 6.5, 7); });
    (opt.lens || []).forEach((item) => {
      const a = at(item.a), b = at(item.b), m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], flat = item.a[1] === item.b[1], mx = (item.a[0] + item.b[0]) / 2, my = (item.a[1] + item.b[1]) / 2;
      const n = flat ? [0, inside(mx, my + 0.25) ? -1 : 1] : [inside(mx + 0.25, my) ? -1 : 1, 0], hw = wide(item.text, 12) / 2 + 1, hh = 7.5;
      let spot = null;
      for (const gap of [5, 19]) { if (spot) break; const c = [m[0] + n[0] * (gap + hw), m[1] + n[1] * (gap + hh)]; if (!taken.some((t) => hitBox(c, hw + 5, hh + 3, t))) spot = c; }
      if (!spot) cv.far = true;
      put(spot || [m[0] + n[0] * (33 + hw), m[1] + n[1] * (33 + hh)], item.text, 'is-length', hw, hh);
    });
    return cv;
  }

  // ── 전개도: 정육면체(정사각형 여섯 칸) ───────────────────────
  const normCells = (cells) => { const x0 = Math.min(...cells.map((c) => c[0])), y0 = Math.min(...cells.map((c) => c[1])); return cells.map(([x, y]) => [x - x0, y - y0]).sort((p, q) => p[1] - q[1] || p[0] - q[0]); };
  const cellKey = (cells) => cells.map((c) => c.join(',')).join(' ');
  const cellRects = (cells) => cells.map(([x, y]) => ({ x, y, w: 1, h: 1 }));
  // 칸 n 개를 변끼리 이어 붙인 모양 전부(옮겨서 겹치는 것은 하나로 센다)
  function shapesOf(n) {
    let set = new Map([['0,0', [[0, 0]]]]);
    for (let size = 1; size < n; size += 1) {
      const grown = new Map();
      for (const cells of set.values()) for (const [x, y] of cells) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        if (cells.some((c) => c[0] === x + dx && c[1] === y + dy)) continue;
        const made = normCells(cells.concat([[x + dx, y + dy]])); grown.set(cellKey(made), made);
      }
      set = grown;
    }
    return [...set.values()];
  }
  // 돌리거나 뒤집어 같은 모양이면 같은 열쇠가 나온다.
  const turnCells = (cells, how) => normCells(cells.map(([x, y]) => { let p = how & 1 ? [y, x] : [x, y]; if (how & 2) p = [-p[0], p[1]]; if (how & 4) p = [p[0], -p[1]]; return p; }));
  const freeKey = (cells) => [0, 1, 2, 3, 4, 5, 6, 7].map((how) => cellKey(turnCells(cells, how))).sort()[0];
  const spanOf = (cells) => [Math.max(...cells.map((c) => c[0])) + 1, Math.max(...cells.map((c) => c[1])) + 1];
  // 맞닿은 곳의 수
  const touches = (rects) => { let n = 0; for (let i = 0; i < rects.length; i += 1) for (let j = i + 1; j < rects.length; j += 1) if (touch(rects[i], rects[j])) n += 1; return n; };
  // 정사각형 여섯 칸 모양 216가지를 접어 보아 전개도인 것(11가지 모양)과 아닌 것으로 가른다. 한 줄에 다섯 칸이 넘게 놓인 것은 그림 칸에 넣기 어려워 뺀다.
  const HEX = shapesOf(6).map((cells) => ({ cells, net: Boolean(fold(cellRects(cells))), key: freeKey(cells), span: spanOf(cells) })).filter((s) => s.span[0] <= 4 && s.span[1] <= 5);
  const CUBE_NETS = HEX.filter((s) => s.net);
  // 가짜 전개도로는 네 칸이 한 점에 모이지 않는 것만 쓴다(면 여섯 개가 다섯 곳에서 이어져 있어 접을 수는 있지만 접으면 두 면이 겹친다).
  const CUBE_FAKES = HEX.filter((s) => !s.net && s.span[1] <= 4 && touches(cellRects(s.cells)) === 5);
  // 한 줄에 네 칸이 나란히 놓인 전개도(가장 흔한 꼴)인가
  const hasRow4 = (cells) => { const [w, h] = spanOf(cells), line = (k, flat) => cells.filter((c) => (flat ? c[1] : c[0]) === k).length === 4; return Array.from({ length: Math.max(w, h) }, (_, k) => line(k, true) || line(k, false)).some(Boolean); };
  // 서로 다른 모양으로 n 개 고른다.
  const pickShapes = (d, pool, n, used) => { const seen = new Set(used || []), out = []; for (const s of d.shuffle(pool)) { if (out.length === n) break; if (!seen.has(s.key)) { seen.add(s.key); out.push(s); } } return out; };
  const cubeArt = (cells, o) => netArt(cellRects(cells), Object.assign({ unit: 20, label: `정사각형 ${cells.length}개를 이어 붙인 그림` }, o || {}));

  // ── 전개도: 직육면체 ─────────────────────────────────────────
  // 직육면체를 펼치는 방법: 이웃한 면끼리 이어진 다섯 곳(접는 선)을 고르는 384가지
  const FACE_PAIRS = []; for (const f of FACES) for (const g of FACES) if (f < g && isPerp(f, g)) FACE_PAIRS.push([f, g]);
  const linked = (tree) => { const seen = new Set([0]); let grew = true; while (grew) { grew = false; for (const [a, b] of tree) if (seen.has(a) !== seen.has(b)) { seen.add(a); seen.add(b); grew = true; } } return seen.size === 6; };
  const TREES = choose(FACE_PAIRS, 5).filter(linked);
  // 접는 선(tree)대로 펼친다: 아랫면에서 시작해 상자를 굴리며 면을 놓는다. 겹치면 null.
  // 돌려주는 것: { rects, face: [면 번호], pos: [그 면을 바닥에 둔 상자의 꼭짓점 자리] } — 꼭짓점 번호는 겨냥도(sketch)와 같다.
  function unfold(tree, dims) {
    const pos = {}, rect = {}, queue = [4];
    pos[4] = VERTS.map((v) => [v & 1 ? dims[0] : 0, v & 2 ? dims[1] : 0, v & 4 ? dims[2] : 0]); rect[4] = { x: 0, y: 0, w: dims[0], h: dims[1] };
    while (queue.length) {
      const f = queue.shift();
      for (const [a, b] of tree) {
        const g = a === f ? b : b === f ? a : -1;
        if (g < 0 || pos[g]) continue;
        for (let way = 0; way < 4; way += 1) { const next = pos[f].map((p) => ROLL[way](p, rect[f])), bot = bottomOf(next); if (bot.face === g) { pos[g] = next; rect[g] = { x: bot.x, y: bot.y, w: bot.w, h: bot.h }; break; } }
        queue.push(g);
      }
    }
    const order = FACES.slice().sort((p, q) => rect[p].y - rect[q].y || rect[p].x - rect[q].x), rects = order.map((f) => rect[f]);
    for (let i = 0; i < 6; i += 1) for (let j = i + 1; j < 6; j += 1) if (overlap(rects[i], rects[j])) return null;
    const b = boundsOf(rects);
    return { rects: moved(rects), face: order, pos: order.map((f) => pos[f].map((p) => [p[0] - b.x, p[1] - b.y, p[2]])), dims };
  }
  // 한 줄에 네 면이 나란히 놓였는가(옆면 넷이 한 줄로 이어진 흔한 전개도)
  const hasStrip = (rects) => rects.some((r) => [[1, 0], [0, 1]].some(([dx, dy]) => { let cur = r, n = 1; for (;;) { const nxt = rects.find((s) => (dx ? s.x === cur.x + cur.w && s.y === cur.y && s.h === cur.h : s.y === cur.y + cur.h && s.x === cur.x && s.w === cur.w)); if (!nxt) break; cur = nxt; n += 1; } return n === 4; }));
  // 문제에 쓰기 좋은 직육면체의 전개도 하나. want: { strip: true(옆면 넷이 한 줄) | false(꺾인 꼴) | undefined, cols, rows: 가로·세로 칸 수의 한도 }
  // 맞닿은 곳이 모두 접는 선이고(잘린 채 맞닿은 변이 없다), 점마다 접었을 때의 꼭짓점이 하나이며, 테두리의 점이 14개인 것만 쓴다.
  function boxNet(d, dims, want) {
    const w = want || {};
    return d.until(() => {
      let net = unfold(d.pick(TREES), dims);
      if (!net) return null;
      if (net.rects.length && boundsOf(net.rects).h > boundsOf(net.rects).w) net = flipNet(net, 1);
      if (d.bool()) net = flipNet(net, 2);
      if (d.bool()) net = flipNet(net, 4);
      const b = boundsOf(net.rects);
      if (b.w > (w.cols || 18) || b.h > (w.rows || 14) || touches(net.rects) !== 5) return null;
      if (w.strip != null && hasStrip(net.rects) !== w.strip) return null;
      const ring = outline(net.rects), map = cornersOf(net.rects, net);
      if (!ring || ring.length !== 14 || !map) return null;
      return Object.assign(net, { ring, map });
    }, Boolean);
  }
  // 펼친 그림을 눕히거나(1) 좌우(2)·위아래(4)로 뒤집는다. 꼭짓점 자리도 함께 옮기고 면은 다시 읽는 차례로 늘어놓는다.
  function flipNet(net, how) {
    const b = boundsOf(net.rects), tr = (r) => (how === 1 ? { x: r.y, y: r.x, w: r.h, h: r.w } : how === 2 ? { x: b.w - r.x - r.w, y: r.y, w: r.w, h: r.h } : { x: r.x, y: b.h - r.y - r.h, w: r.w, h: r.h });
    const tp = (p) => (how === 1 ? [p[1], p[0], p[2]] : how === 2 ? [b.w - p[0], p[1], p[2]] : [p[0], b.h - p[1], p[2]]);
    const items = net.rects.map((r, i) => ({ r: tr(r), f: net.face[i], p: net.pos[i].map(tp) })).sort((p, q) => p.r.y - q.r.y || p.r.x - q.r.x);
    return { rects: items.map((it) => it.r), face: items.map((it) => it.f), pos: items.map((it) => it.p), dims: net.dims };
  }
  // 정육면체의 전개도(칸 모양)를 접은 결과까지 붙여 돌려준다. boxNet 과 같은 꼴이다.
  function cubeNet(d, want) {
    const w = want || {}, shape = d.pick(CUBE_NETS.filter((s) => (w.row4 == null || hasRow4(s.cells) === w.row4) && s.span[0] >= s.span[1])), rects = sorted(cellRects(shape.cells)), res = fold(rects);
    return { rects, face: res.face, pos: res.pos, dims: [1, 1, 1], ring: outline(rects), map: cornersOf(rects, res), cells: shape.cells };
  }
  // 면의 이름(점 이름으로): 왼쪽 위에서 시작해 시계 반대 방향으로 읽는다.
  const rectName = (net, i) => { const r = net.rects[i], name = (x, y) => POINTS[net.ring.indexOf(x + ',' + y)]; return name(r.x, r.y) + name(r.x, r.y + r.h) + name(r.x + r.w, r.y + r.h) + name(r.x + r.w, r.y); };
  // 테두리의 선분들(자른 모서리): { a, b: 두 끝의 번호(ring 에서), name, edge: 접었을 때의 모서리(두 꼭짓점 번호를 이은 글) }
  function cutsOf(net) {
    const n = net.ring.length;
    return net.ring.map((key, i) => { const j = (i + 1) % n, va = net.map.get(key), vb = net.map.get(net.ring[j]); return { a: i, b: j, name: [POINTS[i], POINTS[j]].sort().join(''), edge: Math.min(va, vb) + '-' + Math.max(va, vb), at: [key.split(',').map(Number), net.ring[j].split(',').map(Number)] }; });
  }
  // 접었을 때 겹치는 면이 생기게 면 하나를 다른 자리로 옮긴 가짜 전개도(면의 크기와 수는 그대로다)
  function fakeMove(d, rects, limit) {
    const lim = limit || {}, leaves = rects.map((r, i) => (rects.filter((s, j) => j !== i && touch(r, s)).length === 1 ? i : -1)).filter((i) => i >= 0), pool = [];
    for (const i of leaves) {
      const L = rects[i], rest = rects.filter((_, j) => j !== i);
      for (const R of rest) for (const [w, h] of [[L.w, L.h], [L.h, L.w]]) {
        const spots = [];
        if (h === R.h) spots.push({ x: R.x + R.w, y: R.y, w, h }, { x: R.x - w, y: R.y, w, h });
        if (w === R.w) spots.push({ x: R.x, y: R.y + R.h, w, h }, { x: R.x, y: R.y - h, w, h });
        for (const s of spots) {
          if (rest.some((t) => overlap(s, t)) || (s.x === L.x && s.y === L.y && s.w === L.w)) continue;
          const made = sorted(moved(rest.concat([s]))), b = boundsOf(made);
          if (b.w <= (lim.cols || 14) && b.h <= (lim.rows || 10) && !fold(made) && outline(made)) pool.push(made);
        }
      }
    }
    return pool.length ? d.pick(pool) : null;
  }
  // 면 하나의 크기를 바꾼 가짜 전개도(이웃한 면과 붙은 변은 그대로 두고 바깥쪽으로 늘이거나 줄인다)
  function fakeSize(d, rects, limit) {
    const lim = limit || {}, pool = [];
    rects.forEach((L, i) => {
      const rest = rects.filter((_, j) => j !== i), near = rest.filter((s) => touch(L, s));
      if (near.length !== 1) return;
      const t = touch(near[0], L), flat = t.dir === 0 || t.dir === 2, now = flat ? L.w : L.h;
      for (const size of [now - 1, now + 1, now + 2]) {
        if (size < 1) continue;
        const s = flat ? { x: t.dir === 0 ? L.x : L.x + L.w - size, y: L.y, w: size, h: L.h } : { x: L.x, y: t.dir === 1 ? L.y : L.y + L.h - size, w: L.w, h: size };
        if (rest.some((r) => overlap(s, r))) continue;
        const made = sorted(moved(rest.concat([s]))), b = boundsOf(made);
        if (b.w <= (lim.cols || 14) && b.h <= (lim.rows || 10) && !fold(made) && whyNot(made) === 'pairs' && outline(made)) pool.push(made);
      }
    });
    return pool.length ? d.pick(pool) : null;
  }

  // 5-2-5b.js, 5-2-5c.js 가 같은 도구를 쓴다(이 파일이 먼저 불린다).
  B.kit.box525 = { TAGS, MARKS, cm, fixed, setOptions, say, pickWord, canvas, stroke, fill, word, wide, tiles, CREAM, YELLOW, BLUE, VERTS, VNAME, FNAME, FACES, EDGES, ringOf, faceHas, facesAt, opposite, isPara, isPerp, edgeOf, edgesAt, face, edge, dims3,
    sketch, seenFace, seenEdge, seenVert, lenEdges, withLens, saidLens, solid, boxVerts, BOX_FACES, prism, OTHERS, boxTile, BOXES, cubeTile,
    touch, overlap, fold, whyNot, WHY, cornersOf, outline, POINTS, boundsOf, moved, sorted, turned, netArt, netTidy, cellRects, turnCells, spanOf, CUBE_NETS, CUBE_FAKES, hasRow4, pickShapes, cubeArt, TREES, unfold, hasStrip, boxNet, cubeNet, rectName, cutsOf, fakeMove, fakeSize, sameKind, normCells, freeKey };

  B.addUnit({
    id: '5-2-5', grade: 5, semester: 2, no: 5, title: '직육면체', version: 1,
    groups: [
      { id: 'def', title: '직육면체와 정육면체', standard: SOLID, types: [] },
      { id: 'parts', title: '면, 모서리, 꼭짓점', standard: SOLID, types: [] },
      { id: 'faces', title: '직육면체의 성질', standard: SOLID, types: [] },
      { id: 'sketch', title: '직육면체의 겨냥도', standard: DRAW, types: [] },
      { id: 'net', title: '전개도 알아보기', standard: DRAW, types: [] },
      { id: 'fold', title: '전개도를 접었을 때', standard: DRAW, types: [] }
    ]
  });

  // ── 작은 그림: 평면도형, 모눈 위의 사각형 ───────────────────
  function flat(points, label) { const cv = canvas(); points.forEach(cv.point); cv.add('<polygon class="mb-poly" points="' + ptsOf(points) + '"/>'); return cv.out(label); }
  const FLATS = {
    rect: () => ({ art: () => flat([[0, 0], [0, 40], [66, 40], [66, 0]], '직사각형') }),
    square: () => ({ art: () => flat([[0, 0], [0, 48], [48, 48], [48, 0]], '정사각형') }),
    tri: () => ({ art: () => flat([[30, 0], [0, 48], [62, 48]], '삼각형') }),
    circle: () => ({ art: () => { const cv = canvas(); cv.point([0, 0]); cv.point([52, 52]); cv.add('<circle class="mb-poly" cx="26" cy="26" r="26"/>'); return cv.out('원'); } })
  };
  // 모눈 4칸 너비의 작은 그림 칸. 모눈이 비쳐 보이게 옅게 칠한다.
  const gridTile = (points) => {
    const xs = points.map((p) => p[0]), ys = points.map((p) => p[1]), dx = Math.floor((4 - Math.max(...xs) - Math.min(...xs)) / 2), dy = Math.floor((4 - Math.max(...ys) - Math.min(...ys)) / 2);
    return G.board(4, 4, [G.polygon(points.map(([x, y]) => [x + dx, y + dy])).replace('class="mb-poly"', 'class="mb-poly" style="fill:rgba(251,191,36,0.28)"')], { grid: 'lines', label: '모눈종이 위의 사각형' });
  };
  const SQUARES = [[[0, 0], [2, 0], [2, 2], [0, 2]], [[0, 0], [3, 0], [3, 3], [0, 3]], [[0, 0], [4, 0], [4, 4], [0, 4]]];
  const RECTS = [[[0, 0], [4, 0], [4, 2], [0, 2]], [[0, 0], [2, 0], [2, 4], [0, 4]], [[0, 0], [4, 0], [4, 1], [0, 1]], [[0, 0], [3, 0], [3, 4], [0, 4]]];
  const RHOMBI = [[[1, 0], [2, 2], [1, 4], [0, 2]], [[0, 1], [2, 0], [4, 1], [2, 2]]];
  const PGRAMS = [[[1, 0], [4, 0], [3, 3], [0, 3]], [[0, 0], [3, 0], [4, 2], [1, 2]]];
  const TRAPS = [[[1, 0], [3, 0], [4, 3], [0, 3]], [[0, 0], [2, 0], [4, 3], [0, 3]]];
  const NAMED = '꼭짓점에 이름을 붙인 직육면체의 겨냥도. 윗면 ㄱㄴㄷㄹ, 아랫면 ㅁㅂㅅㅇ';
  // 이름만 붙인 겨냥도(길이는 적지 않는다)
  const namedBox = (d, o) => sketch(dims3(d, 4, 8), Object.assign({ names: true, label: NAMED }, o || {}));
  Object.assign(B.kit.box525, { NAMED, namedBox, gridTile });

  // ── 직육면체와 정육면체 ──────────────────────────────────────
  B.addTypes('5-2-5', 'def', [
    T('def-name', '직육면체와 정육면체의 뜻', '①1 ②1 ③1 심3', (d, n) => {
      if (n === 1) return pickWord(d, '정사각형 6개로 둘러싸인 도형을 무엇이라고 하는가?', '정육면체', ['직육면체', '정사각형', '사각형'], '정사각형 6개로 둘러싸인 도형을 정육면체라고 한다.');
      return pickWord(d, '직사각형 6개로 둘러싸인 도형을 무엇이라고 하는가?', '직육면체', ['정육면체', '직사각형', '사각형'], '직사각형 6개로 둘러싸인 도형을 직육면체라고 한다.');
    }, { count: 2 }),
    T('def-find', '여러 도형 가운데 직육면체 고르기', '①2 ②2 ③2 심1', (d) => {
      // 면이 6개이지만 직사각형이 아닌 면이 있는 도형을 꼭 하나 넣는다. 정육면체는 넣지 않는다(직육면체와 정육면체의 포함 관계는 다루지 않는다).
      const six = d.shuffle(['trap', 'para', 'cut']), rest = d.shuffle(['tri', 'pyr', 'cyl']), kinds = [six[0], rest[0], d.bool() ? six[1] : rest[1]];
      const items = d.shuffle(d.shuffle(BOXES).slice(0, 2).map((b) => ({ box: true, art: () => boxTile(b[0], b[1], b[2]) })).concat(kinds.map((k) => OTHERS[k]())));
      const flags = items.map((it) => Boolean(it.box)), made = setOptions(d, TAGS.slice(0, 5), flags);
      return C('직육면체를 모두 고른 것은?', made.options, made.answer, {
        figure: tiles(items.map((it) => it.art())),
        explain: '직사각형 6개로 둘러싸인 도형이 직육면체이다. ' + items.map((it, i) => (it.box ? '' : `${TAGS[i]}에는 ${it.why}이 있다. `)).join('') + `직육면체는 ${TAGS.filter((_, i) => flags[i]).join(', ')}이다.`,
        facts: { sets: { labels: TAGS.slice(0, 5), flags, options: made.sets } }
      });
    }),
    T('def-cube', '여러 도형 가운데 정육면체 고르기', '①3 ②2 ③3 심1', (d) => {
      const items = d.shuffle([{ kind: 'cube', art: cubeTile }].concat(d.shuffle(BOXES).slice(0, 2).map((b, i) => ({ kind: 'box' + i, art: () => boxTile(b[0], b[1], b[2]) })), [Object.assign({ kind: 'other' }, OTHERS[d.pick(['trap', 'para', 'tri', 'cyl'])]())]));
      const at = items.findIndex((it) => it.kind === 'cube');
      return C('다음 도형 가운데 정육면체는?', TAGS.slice(0, 4), at, {
        figure: tiles(items.map((it) => it.art())), explain: `정사각형 6개로 둘러싸인 도형이 정육면체이다. ${TAGS[at]}는 모서리의 길이가 모두 같아서 6개의 면이 모두 정사각형이다. 나머지 도형에는 정사각형이 아닌 면이 있다.`,
        facts: { kindPick: { kinds: items.map((it) => it.kind), target: 'cube' } }
      });
    }),
    T('def-solid', '평면도형과 입체도형 가르기', '①4 ②3', (d) => {
      const n = d.pick([2, 3]), solids = d.shuffle([{ art: () => boxTile(5, 3, 2.4) }, { art: cubeTile }, OTHERS.cyl(), OTHERS.tri(), { art: () => boxTile(2.6, 2.6, 4.6) }]).slice(0, n).map((it) => Object.assign({ solid: true }, it));
      const items = d.shuffle(solids.concat(d.shuffle(['rect', 'square', 'tri', 'circle']).slice(0, 5 - n).map((k) => FLATS[k]())));
      const flags = items.map((it) => Boolean(it.solid)), made = setOptions(d, TAGS.slice(0, 5), flags);
      return C('입체도형을 모두 고른 것은?', made.options, made.answer, {
        figure: tiles(items.map((it) => it.art())),
        explain: `직사각형, 삼각형, 원처럼 종이 위에 납작하게 그려지는 도형은 평면도형이고, 상자처럼 면으로 둘러싸여 공간을 차지하는 도형은 입체도형이다. 입체도형은 ${TAGS.filter((_, i) => flags[i]).join(', ')}이다.`,
        facts: { sets: { labels: TAGS.slice(0, 5), flags, options: made.sets } }
      });
    }),
    T('def-face-word', '면의 모양', '②5 ③1 심3', (d) => (d.bool()
      ? pickWord(d, '직육면체의 면은 모두 어떤 도형인가?', '직사각형', ['평행사변형', '사다리꼴', '삼각형'], '직육면체는 직사각형 6개로 둘러싸인 도형이므로 면은 모두 직사각형이다.')
      : pickWord(d, '정육면체의 면은 모두 어떤 도형인가?', '정사각형', ['마름모', '사다리꼴', '삼각형'], '정육면체는 정사각형 6개로 둘러싸인 도형이므로 면은 모두 정사각형이다.'))),
    T('def-face-pick', '면이 될 수 있는 도형 고르기', '①5 ②6 ③7', (d, n) => {
      // n = 0: 정육면체의 면(정사각형), n = 1: 직육면체의 면(직사각형 — 정사각형은 섞지 않는다)
      const picks = d.shuffle(n === 0 ? d.shuffle(SQUARES).slice(0, 2).concat([d.pick(RECTS), d.pick(RHOMBI), d.pick(PGRAMS.concat(TRAPS))]) : d.shuffle(RECTS).slice(0, 2).concat([d.pick(RHOMBI), d.pick(PGRAMS), d.pick(TRAPS)]));
      const flags = picks.map(n === 0 ? G.isSquare : G.isRectangle), made = setOptions(d, TAGS.slice(0, 5), flags), right = TAGS.filter((_, i) => flags[i]).join(', ');
      return C(`모눈종이에 그린 사각형 가운데 ${n === 0 ? '정육면체' : '직육면체'}의 면이 될 수 있는 것을 모두 고른 것은?`, made.options, made.answer, {
        figure: tiles(picks.map(gridTile)),
        explain: n === 0 ? `정육면체의 면은 모두 정사각형이다. 네 변의 길이가 모두 같고 네 각이 모두 직각인 사각형은 ${right}이다.` : `직육면체의 면은 모두 직사각형이다. 네 각이 모두 직각인 사각형은 ${right}이다.`,
        facts: { sets: { labels: TAGS.slice(0, 5), flags, options: made.sets }, prop: n === 0 ? 'square' : 'rectangle', polys: picks }
      });
    }, { count: 2 }),
    T('def-why-not', '직육면체·정육면체가 아닌 까닭', '①6 ②7 ③4 심2', (d, n) => {
      // 까닭 쓰기를 까닭 고르기로 바꾸었다. 면·모서리·꼭짓점의 수는 직육면체와 같고 면의 모양만 다른 도형을 쓴다(까닭이 하나뿐이다).
      if (n === 1) {
        const dims = dims3(d, 4, 9), rows = d.shuffle([['정사각형이 아닌 면이 있다.', true], ['직사각형이 아닌 면이 있다.', false], ['면이 6개가 아니다.', false], ['꼭짓점이 8개가 아니다.', false]]);
        return C('다음 도형이 정육면체가 아닌 까닭으로 알맞은 것은?', rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
          figure: sketch(dims, { lens: withLens(dims), label: `직육면체의 겨냥도. ${saidLens(dims)}` }),
          explain: `모서리의 길이가 ${dims.map(cm).join(', ')}로 서로 달라서 면이 정사각형이 아니다. 정육면체는 6개의 면이 모두 정사각형이어야 한다.`, facts: { truth: rows.map((r) => r[1]), want: true }
        });
      }
      const other = OTHERS[d.pick(['trap', 'para', 'cut'])](), rows = d.shuffle([['직사각형이 아닌 면이 있다.', true], ['면이 6개가 아니다.', false], ['꼭짓점이 8개가 아니다.', false], ['모서리가 12개가 아니다.', false]]);
      return C('다음 도형이 직육면체가 아닌 까닭으로 알맞은 것은?', rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
        figure: other.art([150, 104]), explain: `이 도형은 면이 6개, 모서리가 12개, 꼭짓점이 8개이지만 ${other.why}이 있다. 직육면체는 6개의 면이 모두 직사각형이어야 한다.`, facts: { truth: rows.map((r) => r[1]), want: true }
      });
    }, { count: 2 }),
    T('def-things', '직육면체 모양인 물건', '②4 ③12', (d) => {
      const want = d.pick(['과자 상자', '벽돌', '두꺼운 사전', '택배 상자']);
      return pickWord(d, '다음 가운데 직육면체 모양인 물건은?', want, d.shuffle(['축구공', '음료수 캔', '삼각자', '고깔모자', '동전', '탁구공']).slice(0, 3), `${josa(want, '은/는')} 직사각형 모양의 면 6개로 둘러싸여 있어 직육면체 모양이다. 나머지 물건에는 둥근 부분이 있거나 직사각형이 아닌 면이 있다.`);
    }),
    T('def-compare', '직육면체와 정육면체의 같은 점과 다른 점', '①13 ②10 ③11 심7', (d, n) => (n === 0
      ? pickWord(d, '직육면체와 정육면체에서 서로 같지 않은 것은?', '면의 모양', ['면의 수', '모서리의 수', '꼭짓점의 수'], '직육면체와 정육면체는 면이 6개, 모서리가 12개, 꼭짓점이 8개로 같다. 면의 모양은 직육면체가 직사각형, 정육면체가 정사각형이다.')
      : pickWord(d, '정육면체에서는 언제나 맞지만 직육면체에서는 맞지 않을 수도 있는 설명은?', '모서리의 길이가 모두 같다.', d.shuffle(['면이 6개이다.', '꼭짓점이 8개이다.', '모서리가 12개이다.', '서로 평행한 면이 3쌍이다.']).slice(0, 3), '정육면체는 면이 모두 정사각형이라서 모서리 12개의 길이가 모두 같다. 직육면체는 길이가 같은 모서리가 4개씩 있을 뿐이다. 나머지 설명은 두 도형에 모두 맞는다.')), { count: 2 }),
    T('def-say', '직육면체·정육면체에 대한 설명', '①14 ②9 ③8·9 심6', (d, n) => (n === 0
      ? say(d, '직육면체에 대한 설명으로 옳지 않은 것은?',
        ['면은 6개이다.', '모서리는 12개이다.', '꼭짓점은 8개이다.', '면과 면이 만나는 선분을 모서리라고 한다.', '모서리와 모서리가 만나는 점을 꼭짓점이라고 한다.', '서로 평행한 모서리 4개는 길이가 같다.'],
        [['직사각형 4개로 둘러싸여 있다.', '직육면체는 직사각형 6개로 둘러싸여 있다.'], ['모서리의 길이는 언제나 모두 같다.', '모서리의 길이가 모두 같은 것은 정육면체이다. 직육면체는 서로 평행한 모서리끼리 길이가 같다.'], ['꼭짓점의 수는 모서리의 수보다 많다.', '꼭짓점은 8개, 모서리는 12개이므로 모서리가 더 많다.'],
          ['면의 수와 꼭짓점의 수는 같다.', '면은 6개, 꼭짓점은 8개이다.'], ['6개의 면은 언제나 모양과 크기가 모두 같다.', '모양과 크기가 같은 것은 마주 보는 면끼리이다.'], ['선분으로 둘러싸인 부분을 꼭짓점이라고 한다.', '선분으로 둘러싸인 부분은 면이다.'], ['모서리는 8개이고 꼭짓점은 12개이다.', '모서리가 12개이고 꼭짓점이 8개이다.']], false)
      : say(d, '정육면체에 대한 설명으로 옳은 것은?',
        ['모서리의 길이가 모두 같다.', '6개의 면은 모양과 크기가 모두 같다.'],
        [['모서리는 모두 8개이다.', '모서리는 12개이다.'], ['꼭짓점은 모두 12개이다.', '꼭짓점은 8개이다.'], ['면은 모두 4개이다.', '면은 6개이다.'], ['길이가 다른 모서리가 있다.', '면이 모두 정사각형이므로 모서리의 길이는 모두 같다.'], ['면의 수와 모서리의 수가 같다.', '면은 6개, 모서리는 12개이다.']], true, '정육면체는 정사각형 6개로 둘러싸인 도형이라서 모서리의 길이가 모두 같고, 6개의 면의 모양과 크기도 모두 같다.')), { count: 2 })
  ]);

  // ── 면, 모서리, 꼭짓점 ───────────────────────────────────────
  B.addTypes('5-2-5', 'parts', [
    T('parts-word', '면, 모서리, 꼭짓점의 뜻', '①7 ②12 ③5 심3', (d) => {
      const [said, want, call, more] = d.pick([['선분으로 둘러싸인 부분', '면', '면이라고', '면과 면이 만나는 선분은 모서리, 모서리와 모서리가 만나는 점은 꼭짓점이다.'], ['면과 면이 만나는 선분', '모서리', '모서리라고', '선분으로 둘러싸인 부분은 면, 모서리와 모서리가 만나는 점은 꼭짓점이다.'], ['모서리와 모서리가 만나는 점', '꼭짓점', '꼭짓점이라고', '선분으로 둘러싸인 부분은 면, 면과 면이 만나는 선분은 모서리이다.']]);
      return pickWord(d, `직육면체에서 ${josa(said, '을/를')} 무엇이라고 하는가?`, want, ['면', '모서리', '꼭짓점'].filter((w) => w !== want).concat(['밑면']), `직육면체에서 ${josa(said, '을/를')} ${call} 한다. ${more}`);
    }),
    T('parts-point', '그림에서 면, 모서리, 꼭짓점 찾기', '①8 ②11 ③5 심3', (d) => {
      // 색칠한 면, 굵은 모서리, 큰 점이 서로 떨어져 있게 고른다.
      const WORDS = ['면', '모서리', '꼭짓점'], order = d.shuffle(WORDS), mark = (w) => MARKS[order.indexOf(w)], [f, edgeName, v] = d.pick([[2, 'ㄹㅇ', 6], [5, 'ㅂㅅ', 3], [1, 'ㄱㄴ', 0]]), e = edgeOf(edgeName);
      const perms = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]].map((p) => p.map((i) => WORDS[i]).join(', ')), right = order.join(', ');
      const options = d.shuffle([right].concat(d.shuffle(perms.filter((p) => p !== right)).slice(0, 3)));
      return C('직육면체에서 ㉠, ㉡, ㉢이 가리키는 부분의 이름을 차례로 쓴 것은?', options, options.indexOf(right), {
        figure: sketch(dims3(d, 4, 8), { tint: { [f]: YELLOW }, faceText: { [f]: mark('면') }, bold: [e], lens: [[e, mark('모서리')]], dots: [v], names: { [v]: mark('꼭짓점') }, label: `직육면체의 겨냥도. ${mark('면')}은 색칠한 부분, ${mark('모서리')}은 굵게 그은 선분, ${mark('꼭짓점')}은 큰 점을 가리킨다.` }),
        explain: `${mark('면')}은 선분으로 둘러싸인 부분이므로 면, ${mark('모서리')}은 면과 면이 만나는 선분이므로 모서리, ${mark('꼭짓점')}은 모서리와 모서리가 만나는 점이므로 꼭짓점이다.`, facts: { truth: options.map((o) => o === right), want: true }
      });
    }),
    T('parts-count', '면, 모서리, 꼭짓점의 수', '①9 ②13 ③6 심4', (d) => {
      const cube = d.bool();
      return M(`${cube ? '정육면체' : '직육면체'}의 면, 모서리, 꼭짓점은 각각 몇 개인가?`, [{ label: '면', answer: 6, unit: '개' }, { label: '모서리', answer: 12, unit: '개' }, { label: '꼭짓점', answer: 8, unit: '개' }], {
        figure: cube ? sketch([5, 5, 5], { size: [112, 104], label: '정육면체의 겨냥도' }) : sketch(dims3(d, 4, 8)),
        explain: '직육면체와 정육면체는 모두 면이 6개, 모서리가 12개, 꼭짓점이 8개이다. 그림에서 점선으로 그린 보이지 않는 부분까지 센다.', facts: fixed(6, 12, 8)
      });
    }),
    T('parts-order', '면, 모서리, 꼭짓점의 수 비교', '②14 심4', (d) => {
      const right = '모서리, 꼭짓점, 면', options = d.shuffle([right, '모서리, 면, 꼭짓점', '꼭짓점, 모서리, 면', '면, 꼭짓점, 모서리']);
      return C('직육면체의 면, 모서리, 꼭짓점을 수가 많은 것부터 차례로 쓴 것은?', options, options.indexOf(right), { explain: '직육면체에서 모서리는 12개, 꼭짓점은 8개, 면은 6개이다.', facts: { truth: options.map((o) => o === right), want: true } });
    }),
    T('parts-meet-count', '한 모서리에서 만나는 면과 한 꼭짓점에서 만나는 모서리의 수', '③29 심5', () => M('직육면체에서 한 모서리에서 만나는 면은 몇 개인가? 또 한 꼭짓점에서 만나는 모서리는 몇 개인가?', [{ label: '한 모서리에서 만나는 면', answer: 2, unit: '개' }, { label: '한 꼭짓점에서 만나는 모서리', answer: 3, unit: '개' }], {
      explain: '모서리는 면과 면이 만나는 선분이므로 한 모서리에서는 면 2개가 만난다. 한 꼭짓점에서는 가로, 세로, 높이 쪽으로 모서리 3개가 만난다.', facts: fixed(2, 3)
    })),
    T('parts-meet', '한 꼭짓점에서 만나는 모서리, 한 모서리에서 만나는 면', '①12 심5', (d, n) => {
      const figure = namedBox(d);
      if (n === 1) {
        const e = d.int(0, 11), E = EDGES[e], has = (f) => E.v.every((v) => faceHas(f, v)), pairs = [];
        for (const f of FACES) for (const g of FACES) if (f < g && isPerp(f, g)) pairs.push([f, g]);
        const right = pairs.find((p) => p.every(has)), near = d.shuffle(pairs.filter((p) => p !== right && p.some(has))).slice(0, 2), far = d.pick(pairs.filter((p) => !p.some(has)));
        const rows = d.shuffle([right].concat(near, [far]));
        return C(`직육면체에서 ${edge(e)}에서 만나는 두 면을 고른 것은?`, rows.map((p) => p.map(face).join(', ')), rows.indexOf(right), {
          figure, explain: `${edge(e)}은 ${face(right[0])}과 ${face(right[1])}이 만나는 선분이다. 모서리의 두 끝이 모두 들어 있는 면을 찾는다.`, facts: { truth: rows.map((p) => p.every(has)), want: true }
        });
      }
      const v = d.pick(VERTS), mine = edgesAt(v), others = d.shuffle(EDGES.map((_, i) => i).filter((i) => !mine.includes(i) && mine.some((m) => EDGES[m].v.some((w) => w !== v && EDGES[i].v.includes(w))))).slice(0, 2);
      const picks = d.shuffle(mine.concat(others)), labels = picks.map((i) => EDGES[i].name), flags = picks.map((i) => mine.includes(i)), made = setOptions(d, labels, flags);
      return C(`직육면체에서 꼭짓점 ${VNAME[v]}에서 만나는 모서리를 모두 고른 것은?`, made.options, made.answer, {
        figure, explain: `꼭짓점 ${VNAME[v]}에서는 모서리 ${mine.map((i) => EDGES[i].name).join(', ')}의 3개가 만난다. 직육면체의 한 꼭짓점에서는 언제나 모서리 3개가 만난다.`, facts: { sets: { labels, flags, options: made.sets } }
      });
    }, { count: 2 }),
    T('parts-len-fill', '평행한 모서리의 길이', '①15 ②16 ③13·14 심9', (d, n) => {
      if (n === 1) {
        const s = d.int(4, 9), hidden = d.bool();
        return M('정육면체의 겨냥도이다. ㉠, ㉡의 길이는 각각 몇 cm인가?', [{ label: '㉠', answer: s, unit: 'cm' }, { label: '㉡', answer: s, unit: 'cm' }], {
          figure: sketch([s, s, s], { size: [112, 104], lens: [[edgeOf('ㅂㅅ'), cm(s)], [edgeOf('ㅅㅇ'), '㉠'], [edgeOf(hidden ? 'ㄱㅁ' : 'ㄹㅇ'), '㉡']], label: `정육면체의 겨냥도. 한 모서리의 길이 ${s} cm. 다른 두 모서리에 ㉠, ㉡` }),
          explain: `정육면체는 모서리 12개의 길이가 모두 같다. 그림에서 비스듬하게 짧게 그려진 모서리도 길이는 ${s} cm이다.`, facts: { calc: [[String(s), 0], [String(s), 1]] }
        });
      }
      // 주어진 세 모서리와 평행한 모서리에 ㉠, ㉡, ㉢을 적는다. 높이 쪽은 보이지 않는 모서리에 적기도 한다.
      const dims = d.until(() => dims3(d, 4, 9), (v) => v[0] >= v[1]), spots = d.shuffle([[edgeOf('ㄱㄹ'), 0], [edgeOf('ㄱㄴ'), 1], [edgeOf(d.bool() ? 'ㄱㅁ' : 'ㄴㅂ'), 2]]);
      return M('직육면체의 겨냥도이다. ㉠, ㉡, ㉢의 길이는 각각 몇 cm인가?', spots.map(([, ax], i) => ({ label: MARKS[i], answer: dims[ax], unit: 'cm' })), {
        figure: sketch(dims, { lens: withLens(dims).concat(spots.map(([e], i) => [e, MARKS[i]])), label: `직육면체의 겨냥도. ${saidLens(dims)}. 이 세 모서리와 평행한 다른 모서리에 ㉠, ㉡, ㉢` }),
        explain: `직육면체에서 서로 평행한 모서리 4개는 길이가 같다. 평행한 모서리의 길이를 찾으면 ${spots.map(([, ax], i) => `${MARKS[i]}은 ${dims[ax]} cm`).join(', ')}이다.`, facts: { calc: spots.map(([, ax], i) => [String(dims[ax]), i]) }
      });
    }, { count: 2 }),
    T('parts-same-count', '길이가 같은 모서리의 수', '①15 ②17 ③15 심8', (d) => {
      const dims = dims3(d, 4, 9), x = d.pick(dims);
      return N(`직육면체에서 길이가 ${x} cm인 모서리는 모두 몇 개인가?`, 4, {
        unit: '개', figure: sketch(dims, { lens: withLens(dims), label: `직육면체의 겨냥도. ${saidLens(dims)}` }),
        explain: `직육면체에는 길이가 같은 모서리가 4개씩 있다. 길이가 ${x} cm인 모서리와 평행한 모서리 3개도 ${x} cm이므로 모두 4개이다.`, facts: fixed(4)
      });
    }),
    T('parts-same-list', '길이가 같은 모서리 찾기', '②17 심8', (d) => {
      const e = d.int(0, 11), same = EDGES.map((_, i) => i).filter((i) => i !== e && EDGES[i].ax === EDGES[e].ax), others = d.shuffle(EDGES.map((_, i) => i).filter((i) => EDGES[i].ax !== EDGES[e].ax && EDGES[i].v.some((v) => EDGES[e].v.includes(v)))).slice(0, 2);
      const picks = d.shuffle(same.concat(others)), labels = picks.map((i) => EDGES[i].name), flags = picks.map((i) => same.includes(i)), made = setOptions(d, labels, flags);
      return C(`세 모서리 ㄱㄴ, ㄴㄷ, ㄴㅂ의 길이가 서로 다른 직육면체이다. ${edge(e)}과 길이가 같은 모서리를 모두 고른 것은?`, made.options, made.answer, {
        figure: namedBox(d), explain: `직육면체에서 서로 평행한 모서리 4개는 길이가 같다. ${edge(e)}과 평행한 모서리는 ${same.map((i) => EDGES[i].name).join(', ')}이다.`, facts: { sets: { labels, flags, options: made.sets } }
      });
    }),
    T('parts-same-cube', '정육면체에서 길이가 같은 모서리의 수', '③15', () => N('정육면체에서 길이가 같은 모서리는 모두 몇 개인가?', 12, { unit: '개', explain: '정육면체는 면이 모두 정사각형이므로 모서리 12개의 길이가 모두 같다.', facts: fixed(12) })),
    T('parts-cube-sum', '정육면체의 모든 모서리의 길이의 합', '①16 ②19 ③16 심41', (d) => {
      const s = d.int(3, 9);
      return N(`한 모서리의 길이가 ${s} cm인 정육면체가 있다. 이 정육면체의 모든 모서리의 길이의 합은 몇 cm인가?`, s * 12, { unit: 'cm', explain: `정육면체는 길이가 같은 모서리가 12개이다. ${s} × 12 = ${s * 12}(cm)`, facts: { calc: [[`${s}*12`, 0]], unseen: [12] } });
    }),
    T('parts-box-sum', '직육면체의 모든 모서리의 길이의 합', '①17 ②18 심42', (d) => {
      const dims = dims3(d, 4, 9), [a, b, c] = dims, total = (a + b + c) * 4;
      return N('직육면체의 모든 모서리의 길이의 합은 몇 cm인가?', total, {
        unit: 'cm', figure: sketch(dims, { lens: withLens(dims), label: `직육면체의 겨냥도. ${saidLens(dims)}` }),
        explain: `직육면체에는 길이가 ${a} cm, ${b} cm, ${c} cm인 모서리가 4개씩 있다. (${a} + ${b} + ${c}) × 4 = ${total}(cm)`, facts: { calc: [[`(${a}+${b}+${c})*4`, 0]], unseen: [4] }
      });
    }),
    T('parts-cube-edge', '모든 모서리의 길이의 합으로 정육면체의 한 모서리 구하기', '①18 ②20 심43', (d) => {
      const s = d.int(3, 9), total = s * 12;
      return N(`모든 모서리의 길이의 합이 ${total} cm인 정육면체가 있다. 이 정육면체의 한 모서리의 길이는 몇 cm인가?`, s, { unit: 'cm', explain: `정육면체는 길이가 같은 모서리가 12개이다. ${total} ÷ 12 = ${s}(cm)`, facts: { calc: [[`${total}/12`, 0]], unseen: [12] } });
    }),
    T('parts-face-around', '한 면을 둘러싼 네 모서리의 길이의 합', '③17', (d) => {
      const dims = dims3(d, 4, 9), f = d.pick([5, 2]), [x, y] = f === 5 ? [dims[0], dims[1]] : [dims[0], dims[2]], total = (x + y) * 2;
      return N('직육면체에서 색칠한 면의 네 모서리의 길이의 합은 몇 cm인가?', total, {
        unit: 'cm', figure: sketch(dims, { tint: { [f]: YELLOW }, lens: withLens(dims), label: `직육면체의 겨냥도. ${saidLens(dims)}. ${f === 5 ? '윗면' : '앞면'}을 색칠했다.` }),
        explain: `색칠한 면은 길이가 ${x} cm인 모서리 2개와 ${y} cm인 모서리 2개로 둘러싸여 있다. (${x} + ${y}) × 2 = ${total}(cm)`, facts: { calc: [[`(${x}+${y})*2`, 0]], unseen: [2] }
      });
    }),
    T('parts-biggest-cube', '직육면체를 잘라 만드는 가장 큰 정육면체', '②24', (d) => {
      const dims = dims3(d, 5, 12), least = Math.min(...dims);
      return N('직육면체 모양의 나무토막을 잘라서 정육면체를 만들려고 한다. 만들 수 있는 가장 큰 정육면체의 한 모서리의 길이는 몇 cm인가?', least, {
        unit: 'cm', figure: sketch(dims, { lens: withLens(dims), label: `직육면체 모양의 나무토막. ${saidLens(dims)}` }),
        explain: `정육면체는 모서리의 길이가 모두 같으므로 한 모서리가 나무토막의 가장 짧은 모서리보다 길 수 없다. 가장 짧은 모서리가 ${least} cm이므로 가장 큰 정육면체의 한 모서리는 ${least} cm이다.`, facts: { calc: [[String(least), 0]] }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
