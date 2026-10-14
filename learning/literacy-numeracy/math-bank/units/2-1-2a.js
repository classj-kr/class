// 2학년 1학기 2단원 여러 가지 도형 — 단원 틀, 그림 도구(도형 모음·물건·꾸민 그림·자를 종이·칠교판),
// 기본 문항(삼각형·사각형·원 찾기, 변과 꼭짓점·도형의 특징, 도형 세기와 자르기, 칠교판).
// 수집해 둔 국정 교과서 평가 자료(미래엔·아이스크림미디어·천재 27개 문서)에서 뽑은 문제 꼴 목록(기본꼴_1: 53꼴, 심화꼴: 32꼴)을 번호마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/2-1-2/싣기_대조표.md 에 있다.
// (쌓기나무 그림 도구와 쌓기나무 문항, 실력 문항은 2-1-2b.js 에 있다.)  ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
//
// 영역: 도형과 측정 가운데 도형.
//   2수03-02 쌓기나무를 이용하여 여러 가지 입체도형의 모양을 만들고, 그 모양에 대해 위치나 방향을 이용하여 말할 수 있다.
//   2수03-03 교실 및 생활 주변에서 여러 가지 물건을 관찰하여 삼각형, 사각형, 원의 모양을 찾고, 이를 이용하여 여러 가지 모양을 만들 수 있다.
//   2수03-04 삼각형, 사각형, 원을 직관적으로 이해하고, 그 모양을 그릴 수 있다.
//   2수03-05 삼각형, 사각형에서 각각의 공통점을 찾아 말할 수 있다.
//   교육과정: 「삼각형, 사각형, 원은 예인 것과 예가 아닌 것을 분류하는 활동을 통하여 직관적으로 이해하게 한다.」
//            「쌓기나무로 만든 입체도형의 모양에 대해서 '∼의 앞', '∼의 오른쪽', '∼의 위', '2층' 등을 사용하여 말하게 한다.」
//   이 학년군의 도형 용어는 삼각형, 사각형, 원, 꼭짓점, 변뿐이다. 그 밖의 것은 「곧은 선」「굽은 선」「둥근 부분」「뾰족한 부분」으로 말한다(그림 설명 글도 같다).
//
// 싣는 기준
//  - 주는 것(도형 그림, 물건, 글, 칠교 모양, 쌓은 모양)과 묻는 것(고르기, 모두 고르기, 수, 까닭, 옳은 말)이 다르면 다른 문제다. 그림만 다른 것은 한 번만 싣는다.
//    「찾기」는 도형마다(삼각형·사각형·원) 하나씩 둔다. 예가 아닌 것이 도형마다 다르기 때문이다.
//  - 도형 이름·변·꼭짓점·위치 말을 한글로 쓰게 하는 답은 고르기로 바꾸었다(교육과정: 한글로 쓰게 하는 것은 지양한다). 답 칸에는 수만 받는다.
//  - 기본 문항의 예가 아닌 것은 누가 보아도 뚜렷한 것(변이 5개인 도형, 원, 길쭉하게 둥근 도형)만 쓴다. 삼각형·사각형과 아슬아슬하게 다른 것(한쪽이 굽은 선, 끊어진 곳)은
//    「아닌 까닭 고르기」와 실력 문항에 쓴다.
//  - 오각형·육각형은 2022 개정 교육과정에서 이 학년군의 내용이 아니고 수집본에도 한 문항도 없다. 변이 5개인 도형은 「사각형이 아닌 것」 같은 예가 아닌 보기로만 나오고 이름을 부르지 않는다.
//  - 도형 그림은 모눈 선 없이 그린다(직각을 묻지 않는다). 그림 속 도형의 종류는 그림 설명(aria-label)에 「곧은 선 3개로 둘러싸인 도형」처럼 적는다.
//  - 물건은 찾을 수 있는 모양이 한 가지뿐인 것 아홉 가지를 선 그림으로 그린다. 꾸민 그림은 도형끼리 겹치지 않게 놓는다(겹치면 크고 작은 도형 세기가 된다).
//  - 칠교 조각으로 만든 모양은 조각마다 크기가 칠교판의 조각과 같고, 조각끼리 변을 맞대어 붙인 것만 쓴다.
//
// 뺀 것과 까닭(단원 전체)
//  - 크고 작은 도형 세기(①26 심14): 한 칸·두 칸·세 칸짜리를 나누어 세는 경우 따지기가 어려움의 전부다.
//  - 세 도형의 꼭짓점이 모두 되는 점(심13): 도형마다 꼭짓점을 적어 겹치는 점을 가리는 조건 풀이다.
//  - 주어진 조각으로 만들 수 없는 모양(①36)·조각을 모두 써서 사각형을 만들 수 없는 묶음(심20): 보기마다 조각을 돌려 가며 맞추어 보아야 하고, 만져 보지 않으면 가릴 길이 없다.
//  - 도형 안에 적힌 수 더하기(①24 심7), 변·꼭짓점의 수 더하기(①14 심12): 어려움이 도형이 아니라 셈에서 온다. 「삼각형의 변과 사각형의 꼭짓점은 각각 몇 개」처럼 각각 묻는 것은 실었다.
//  - 앞에서 본 모양(심25): 위·앞·옆에서 본 모양은 6학년 「공간과 입체」이다. 가려져 보이지 않는 쌓기나무를 따지는 것도 6학년이라, 쌓은 모양은 모든 쌓기나무가 보이게 그린다.
//  - 그리기·색칠하기·만들기(①27·29·34·35 심15·18·19), 글로 쓰는 서술형(①8·53 심32). 고르기나 빈칸으로 바꿀 수 있는 것(①7·20·21·45·49·52 심5·31)은 바꾸어 실었다.
//  - 더 높이 쌓을 수 있는 쪽(①44): 쌓기 놀이 뒤의 관찰이고 성취기준의 일(모양 만들기, 위치와 방향으로 말하기)이 아니다.
// 묻는 말: 「~은?」「몇 개인가?」. 풀이는 「~이다.」 한 문장에 한 가지만 적는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, N, M, C } = B.kit;
  const G = B.kit.geo;
  const BLOCK = '2수03-02', FIND = '2수03-03', KNOW = '2수03-04', COMMON = '2수03-05';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const TAGS = ['가', '나', '다', '라', '마', '바', '사', '아', '자'], MARKS = ['㉠', '㉡', '㉢', '㉣', '㉤', '㉥', '㉦'];
  const KINDS = ['tri', 'quad', 'circle'], NAME = { tri: '삼각형', quad: '사각형', circle: '원' };
  const MEAN = { tri: '삼각형은 변이 3개, 꼭짓점이 3개인 도형이다.', quad: '사각형은 변이 4개, 꼭짓점이 4개인 도형이다.', circle: '원은 어느 쪽에서 보아도 똑같이 동그란 모양의 도형이다.' };
  const conditions = (list) => '<ul class="mb-conditions">' + list.map((line) => '<li>' + line + '</li>').join('') + '</ul>';
  // 검사가 다시 셈할 식: 세어서 얻은 수를 1+1+1 로 적는다.
  const ones = (n) => (n ? Array(n).fill('1').join('+') : '0');
  const listed = (labels, flags) => labels.filter((_, i) => flags[i]).join(', ');

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

  // ── 도형 감 ──────────────────────────────────────────────────
  // 모두 가로 4칸, 세로 3칸 안에 그린 점들이다(세로는 아래로 커진다). 굽은 선은 촘촘한 점으로 그린다.
  const RAD = Math.PI / 180;
  const bend = (p, c, q) => Array.from({ length: 15 }, (_, i) => { const t = i / 14, u = 1 - t; return [u * u * p[0] + 2 * u * t * c[0] + t * t * q[0], u * u * p[1] + 2 * u * t * c[1] + t * t * q[1]]; });
  const ring = (c, rx, ry, from, to) => { const out = []; for (let a = from; a <= to + 0.01; a += 6) out.push([c[0] + rx * Math.cos(a * RAD), c[1] + ry * Math.sin(a * RAD)]); return out; };
  const LOOKS = {
    // 삼각형: 앞의 넷은 반듯한 것, 뒤의 넷은 길쭉하거나 납작하거나 비스듬한 것
    tri: [[[0, 3], [4, 3], [2, 0]], [[0.2, 3], [3.8, 3], [0.2, 0.2]], [[0, 2.8], [4, 2.2], [1.2, 0]], [[0, 0.2], [4, 0.2], [2, 3]],
      [[1.5, 3], [2.5, 3], [2, 0]], [[0, 3], [4, 3], [3.3, 2]], [[0, 0], [4, 1.5], [0.3, 1.3]], [[0.5, 0], [3.5, 0.4], [3.2, 3]]],
    // 사각형: 앞의 넷은 반듯한 것, 뒤의 넷은 비스듬하거나 길쭉한 것
    quad: [[[0, 0.4], [4, 0.4], [4, 2.6], [0, 2.6]], [[0.5, 0], [3.5, 0], [3.5, 3], [0.5, 3]], [[1, 0.3], [3, 0.3], [4, 2.7], [0, 2.7]], [[0.3, 0.2], [3.6, 0.8], [4, 3], [0, 2.2]],
      [[2, 0], [3.6, 1.5], [2, 3], [0.4, 1.5]], [[0, 2.4], [0.6, 3], [4, 0.6], [3.4, 0]], [[1.55, 0], [2.45, 0], [2.45, 3], [1.55, 3]], [[0, 0.6], [4, 0], [3.2, 3], [1, 1.9]]],
    // 위가 좁아 삼각형처럼 보이는 사각형, 안으로 꺾여 뾰족한 변 4개짜리 도형
    cut3: [[[0, 3], [4, 3], [2.5, 0.5], [1.5, 0.5]]],
    dart: [[[0, 3], [2, 0], [4, 3], [2, 2]]],
    // 변이 5개인 도형(둘째는 한 귀퉁이가 잘려 사각형처럼 보인다)
    five: [[[0, 1.2], [2, 0], [4, 1.2], [4, 3], [0, 3]], [[0, 0.3], [2.9, 0.3], [4, 1.3], [4, 2.7], [0, 2.7]], [[0.6, 0], [3.4, 0.3], [4, 2], [2, 3], [0, 1.8]]],
    circle: [1.5, 1.1, 0.75].map((r) => ring([2, 1.5], r, r, 0, 354)),
    oval: [ring([2, 1.5], 2, 1.1, 0, 354), ring([2, 1.5], 1, 1.5, 0, 354)],
    // 원과 아슬아슬하게 다른 것: 조금만 길쭉한 것(가로와 세로가 4 : 3쯤), 한쪽이 조금 좁은 것
    squash: [ring([2, 1.5], 1.7, 1.25, 0, 354), ring([2, 1.5], 1.12, 1.5, 0, 354)],
    egg: [ring([0, 0], 1, 1.3, 0, 354).map(([x, y]) => [1.8 + x * (x > 0 ? 1.85 : 1.25), 1.5 + y])],
    half: [ring([2, 2.5], 1.9, 1.9, 180, 360)],
    dee: [ring([2, 1.5], 1.5, 1.5, 40, 320)],
    // 삼각형·사각형과 아슬아슬하게 다른 것: 한 변이 굽은 선, 꼭대기가 둥근 것, 끊어진 것
    curvy3: [[[0, 3], [4, 3]].concat(bend([4, 3], [4.3, 0.4], [2, 0])), [[2, 0], [4, 3]].concat(bend([4, 3], [2, 1.9], [0, 3]))],
    curvy4: [[[4, 2.7], [0, 2.7], [0, 0.8]].concat(bend([0, 0.8], [2, -0.6], [4, 0.8])), [[3, 2.7], [0, 2.7], [0, 0.3]].concat(bend([3, 0.3], [4.9, 1.5], [3, 2.7]))],
    round3: [[[0, 3], [4, 3]].concat(bend([2.6, 0.9], [2, 0], [1.4, 0.9]))],
    open3: [[[2.6, 3], [4, 3], [2, 0], [0, 3], [1.4, 3]], [[0.5, 2.25], [2, 0], [4, 3], [0.95, 3]]],
    open4: [[[0, 1.3], [0, 0.4], [4, 0.4], [4, 2.6], [0, 2.6], [0, 2.25]], [[1.3, 0.4], [0, 0.4], [0, 2.6], [4, 2.6], [4, 0.4], [2.5, 0.4]]]
  };
  const PLAIN = { tri: 4, quad: 4 };
  // sides: 곧은 선의 수, curved: 굽은 선이나 둥근 부분이 있다, open: 끊어진 곳이 있다, said: 그림 설명에 적는 말
  const KIND = {
    tri: { sides: 3, said: '곧은 선 3개로 둘러싸인 도형' },
    quad: { sides: 4, said: '곧은 선 4개로 둘러싸인 도형' },
    cut3: { is: 'quad', sides: 4, said: '곧은 선 4개로 둘러싸인 도형' },
    dart: { sides: 4, said: '곧은 선 4개로 둘러싸인 도형' },
    five: { sides: 5, said: '곧은 선 5개로 둘러싸인 도형' },
    circle: { sides: 0, curved: true, said: '어느 쪽에서 보아도 똑같이 동그란 도형' },
    oval: { sides: 0, curved: true, said: '한쪽으로 길쭉하게 둥근 도형' },
    squash: { sides: 0, curved: true, said: '한쪽으로 조금 길쭉하게 둥근 도형' },
    egg: { sides: 0, curved: true, said: '한쪽이 더 좁게 둥근 도형' },
    half: { sides: 1, curved: true, said: '곧은 선 1개와 굽은 선으로 둘러싸인 도형' },
    dee: { sides: 1, curved: true, said: '곧은 선 1개와 굽은 선으로 둘러싸인 도형' },
    curvy3: { sides: 2, curved: true, said: '곧은 선 2개와 굽은 선으로 둘러싸인 도형' },
    curvy4: { sides: 3, curved: true, said: '곧은 선 3개와 굽은 선으로 둘러싸인 도형' },
    round3: { sides: 3, curved: true, round: true, said: '곧은 선 3개와 둥근 부분으로 둘러싸인 도형' },
    open3: { sides: 3, open: true, said: '곧은 선 3개로 그렸지만 끊어진 곳이 있는 도형' },
    open4: { sides: 4, open: true, said: '곧은 선 4개로 그렸지만 끊어진 곳이 있는 도형' }
  };
  // 한 갈래의 도형 n개(서로 다른 생김새). look: 'plain'(반듯한 것만), 'odd'(길쭉하거나 비스듬한 것만), 없으면 아무것이나. 왼쪽·오른쪽, 위·아래로 뒤집어 섞는다.
  function shapesOf(d, kind, n, look) {
    const all = LOOKS[kind], cut = PLAIN[kind] || all.length, pool = look === 'plain' ? all.slice(0, cut) : look === 'odd' ? all.slice(cut) : all;
    return d.shuffle(pool).slice(0, n || 1).map((pts) => {
      const fx = d.bool(), fy = d.bool();
      return Object.assign({}, KIND[kind], { kind: KIND[kind].is || kind, look: kind, pts: pts.map(([x, y]) => [fx ? 4 - x : x, fy ? 3 - y : y]) });
    });
  }
  // 여러 갈래를 섞은 모음. recipe: [[갈래, 개수, look] …]
  const mix = (d, recipe) => d.shuffle(recipe.reduce((all, [kind, n, look]) => all.concat(shapesOf(d, kind, n, look)), []));
  // 갈래 이름 목록(같은 이름이 거듭 나올 수 있다)을 [[갈래, 개수] …]로 묶는다.
  const tally = (kinds) => [...new Set(kinds)].map((kind) => [kind, kinds.filter((k) => k === kind).length]);
  // 삼각형·사각형이 아닌 까닭
  const why = (s) => (s.open ? '끊어진 곳이 있다' : s.round ? '둥근 부분이 있다' : s.curved ? '굽은 선이 있다' : `곧은 선이 ${s.sides}개이다`);
  // 같은 까닭끼리 묶어 한 문장씩 적는다: 「나, 사는 굽은 선이 있다. 라는 끊어진 곳이 있다.」
  function reasons(shapes, tags, skip, say) {
    const groups = new Map();
    shapes.forEach((s, i) => { if (skip(s)) return; const r = (say || why)(s); groups.set(r, (groups.get(r) || []).concat([tags[i]])); });
    return [...groups].map(([r, list]) => `${list.join(', ')}는 ${r}.`).join(' ');
  }

  // ── 도형 모음 그림 ───────────────────────────────────────────
  // 도형을 칸마다 하나씩 그리고 가, 나, 다 … 를 붙인다. 끊어진 도형이 섞여 있으면 모두 속을 칠하지 않는다(칠한 것과 안 칠한 것으로 가려지지 않게).
  // o: { tags: false(이름표 없이), per(한 줄에 놓는 수), k(배율), extra(자리 잡은 점들 목록) → 덧그릴 것 }
  function gallery(shapes, o) {
    const opt = o || {}, n = shapes.length, tags = opt.tags === false ? null : (opt.tags || TAGS), per = opt.per || (n <= 3 ? n : n === 4 ? 2 : 3);
    const W = opt.W || (per >= 3 ? 4 : per === 2 ? 5.6 : 6.4), Ht = opt.H || (per >= 3 ? 3.6 : per === 2 ? 4.2 : 4.4), k = opt.k || (per >= 3 ? 0.72 : per === 2 ? 0.95 : 1.15);
    const plain = shapes.some((s) => s.open), parts = [], placed = [];
    shapes.forEach((s, i) => {
      const ox = (i % per) * W, oy = Math.floor(i / per) * Ht, xs = s.pts.map((p) => p[0]), ys = s.pts.map((p) => p[1]), top = tags ? 0.5 : 0;
      const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
      const pts = s.pts.map(([x, y]) => [(x - cx) * k + ox + W / 2 - 0.1, (y - cy) * k + oy + top + (Ht - top - 0.2) / 2]);
      placed.push(pts);
      parts.push(s.open ? G.polyline(pts) : G.polygon(pts, plain ? 'mb-poly is-plain' : 'mb-poly'));
      if (tags) parts.push(G.text([ox + 0.25, oy + 0.35], tags[i]));
    });
    if (opt.extra) parts.push(opt.extra(placed));
    const said = `도형 ${n}개. ` + shapes.map((s, i) => (tags ? tags[i] + ': ' : '') + s.said).join(' / ');
    return G.board(per * W - 0.2, Math.ceil(n / per) * Ht - 0.2, parts, { grid: false, scale: opt.scale, label: opt.label || said });
  }

  // ── 물건 그림 ────────────────────────────────────────────────
  // 간단한 선 그림. 물건마다 찾을 수 있는 모양은 한 가지뿐이게 그린다(창문 안의 칸도 사각형, 삼각자 안의 구멍도 삼각형).
  const icon = (name, body) => '<svg class="mb-geo" viewBox="0 0 80 66" width="88" role="img" aria-label="' + name + ' 그림">' + body + '</svg>';
  const seg = (x1, y1, x2, y2, w) => '<line class="mb-line" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" style="stroke-width:' + (w || 1.1) + '"/>';
  const poly = (pts, plain) => '<polygon class="mb-poly' + (plain ? ' is-plain" style="stroke-width:1.1' : '') + '" points="' + pts + '"/>';
  const disc = (r, plain) => '<circle class="mb-poly' + (plain ? ' is-plain" style="stroke-width:1.1' : '') + '" cx="40" cy="33" r="' + r + '"/>';
  const box4 = (x, y, w, h, plain) => '<rect class="mb-poly' + (plain ? ' is-plain" style="stroke-width:1.1' : '') + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '"/>';
  const ticks = Array.from({ length: 12 }, (_, i) => { const a = i * 30 * RAD, r = i % 3 ? 24 : 22; return seg((40 + 27 * Math.sin(a)).toFixed(1), (33 - 27 * Math.cos(a)).toFixed(1), (40 + r * Math.sin(a)).toFixed(1), (33 - r * Math.cos(a)).toFixed(1)); }).join('');
  const THINGS = [
    { name: '시계', kind: 'circle', body: disc(27) + ticks + seg(40, 33, 40, 15, 1.8) + seg(40, 33, 52, 39, 1.8) },
    { name: '동전', kind: 'circle', body: disc(25) + disc(20, true) + '<text class="mb-label" style="font-size:13px" x="40" y="33.5" text-anchor="middle" dominant-baseline="central">100</text>' },
    { name: '접시', kind: 'circle', body: disc(27) + disc(17, true) },
    { name: '공책', kind: 'quad', body: box4(19, 6, 42, 54) + [18, 28, 38, 48].map((y) => seg(26, y, 54, y)).join('') },
    { name: '창문', kind: 'quad', body: box4(12, 9, 56, 48) + seg(40, 9, 40, 57, 1.6) + seg(12, 33, 68, 33, 1.6) },
    { name: '칠판', kind: 'quad', body: box4(6, 12, 68, 42) + box4(11, 17, 58, 32, true) },
    { name: '삼각자', kind: 'tri', body: poly('12,58 68,58 12,8') + poly('22,50 44,50 22,30', true) },
    { name: '표지판', kind: 'tri', body: seg(40, 50, 40, 64, 3) + poly('40,5 72,50 8,50') + poly('40,17 60,44 20,44', true) },
    { name: '깃발', kind: 'tri', body: seg(22, 5, 22, 62, 2.4) + poly('22,7 66,20 22,33') }
  ];
  const thingTiles = (list) => G.tiles(list.map((t, i) => [TAGS[i] + ' ' + t.name, icon(t.name, t.body)]));
  // 글로만 묻는 물건(모양이 뚜렷한 것만). trace: 종이에 대고 본뜰 수 있는 납작한 물건
  const WORDS = { circle: ['동전', '접시', '단추', '자전거 바퀴', '훌라후프'], quad: ['수학책', '공책', '칠판', '달력', '색종이'], tri: ['삼각자'] };
  const TRACE = { circle: ['동전', '접시', '단추'], quad: ['수학책', '공책', '색종이'], tri: ['삼각자'] };

  // ── 꾸민 그림 ────────────────────────────────────────────────
  // 삼각형·사각형·원을 겹치지 않게 놓아 꾸민 그림. items: ['tri' | 'quad', 점들] 또는 ['circle', 가운데, 반지름]
  const rect = (x, y, w, h) => ['quad', [[x, y], [x + w, y], [x + w, y + h], [x, y + h]]];
  const tri3 = (a, b, c) => ['tri', [a, b, c]];
  const ball = (x, y, r) => ['circle', [x, y], r];
  function trainPic(d) {
    const cars = d.int(2, 3), smoke = d.int(0, 2), loads = d.int(0, 2), items = [], ex = cars * 2.3;
    for (let i = 0; i < cars; i += 1) {
      const x = i * 2.3;
      items.push(rect(x, 2.2, 2, 1.3), ball(x + 0.5, 3.9, 0.4), ball(x + 1.5, 3.9, 0.4));
      if (i < loads) items.push(tri3([x + 0.6, 2.2], [x + 1.4, 2.2], [x + 1, 1.5]));
    }
    items.push(rect(ex, 1.4, 1.7, 2.1), ball(ex + 0.45, 3.9, 0.4), ball(ex + 1.25, 3.9, 0.4), tri3([ex + 1.7, 2.5], [ex + 2.6, 3.5], [ex + 1.7, 3.5]), rect(ex + 0.9, 0.75, 0.45, 0.65));
    if (smoke >= 1) items.push(ball(ex + 1.12, 0.38, 0.25));
    if (smoke >= 2) items.push(ball(ex + 0.45, 0.32, 0.3));
    return { name: '기차', items, cols: ex + 2.6, rows: 4.3 };
  }
  function townPic(d) {
    const parts = d.shuffle(['house'].concat(d.bool() ? ['house'] : [], ['tree' + d.int(1, 2)], d.bool() ? ['tree' + d.int(1, 2)] : [], Array(d.int(0, 2)).fill('ball'))), items = [];
    let x = 0.2;
    parts.forEach((part) => {
      if (part === 'house') { items.push(rect(x, 2.6, 1.8, 1.6), tri3([x - 0.2, 2.6], [x + 2, 2.6], [x + 0.9, 1.5])); x += 2.5; }
      else if (part === 'ball') { items.push(ball(x + 0.3, 3.9, 0.3)); x += 0.9; }
      else {
        items.push(rect(x + 0.4, 3.4, 0.4, 0.8));
        if (part === 'tree1') items.push(tri3([x, 3.4], [x + 1.2, 3.4], [x + 0.6, 2]));
        else items.push(tri3([x, 3.4], [x + 1.2, 3.4], [x + 0.6, 2.5]), tri3([x + 0.1, 2.5], [x + 1.1, 2.5], [x + 0.6, 1.6]));
        x += 1.6;
      }
    });
    const cols = Math.max(x, 4.6);
    items.push(ball(cols - 0.6, 0.6, 0.5));
    return { name: '마을', items, cols, rows: 4.3 };
  }
  function robotPic(d) {
    const horn = d.bool(), ears = d.bool(), hands = !ears || d.bool();
    const items = [rect(2.1, 0.9, 1.8, 1.2), rect(1.7, 2.1, 2.6, 2), rect(0.9, 2.3, 0.8, 0.5), rect(4.3, 2.3, 0.8, 0.5), rect(2.1, 4.1, 0.6, 0.9), rect(3.3, 4.1, 0.6, 0.9),
      tri3([1.9, 5.7], [2.9, 5.7], [2.4, 5]), tri3([3.1, 5.7], [4.1, 5.7], [3.6, 5])];
    if (horn) items.push(tri3([2.7, 0.9], [3.3, 0.9], [3, 0.2]));
    if (ears) items.push(ball(1.82, 1.5, 0.26), ball(4.18, 1.5, 0.26));
    if (hands) items.push(ball(0.6, 2.55, 0.3), ball(5.4, 2.55, 0.3));
    return { name: '로봇', items, cols: 6, rows: 5.8 };
  }
  // 갈래마다 세는 문항은 마을·로봇, 가장 많이 놓은 도형을 묻는 문항은 기차·로봇에서 고른다(한 묶음에 같은 그림이 거듭 나오지 않게).
  const picture = (d, makers) => d.pick(makers)(d);
  const picCounts = (pic) => KINDS.map((kind) => pic.items.filter((it) => it[0] === kind).length);
  function pictureArt(pic) {
    const [t, q, c] = picCounts(pic);
    return G.board(pic.cols, pic.rows, pic.items.map((it) => (it[0] === 'circle' ? G.circle(it[1], it[2]) : G.polygon(it[1]))),
      { grid: false, scale: Math.min(1.15, 296 / (32 + pic.cols * 22)), label: `삼각형, 사각형, 원 모양을 놓아 꾸민 ${pic.name} 그림. 곧은 선 3개로 둘러싸인 도형 ${t}개, 곧은 선 4개로 둘러싸인 도형 ${q}개, 동그란 도형 ${c}개` });
  }

  // ── 점선을 따라 자르는 종이 ──────────────────────────────────
  // paper: 종이의 모양, cuts: 점선, pieces: 잘라 생기는 조각(변이 3개 아니면 4개인 것만 쓴다). same: 조각이 모두 같은 도형인가
  const PAPER = { rect: [[0, 0], [6, 0], [6, 4], [0, 4]], tri: [[0, 4], [6, 4], [3, 0]] };
  const CUTS = [
    { paper: 'rect', cuts: [[[0, 0], [6, 4]], [[6, 0], [0, 4]]], pieces: [[[0, 0], [6, 0], [3, 2]], [[6, 0], [6, 4], [3, 2]], [[6, 4], [0, 4], [3, 2]], [[0, 4], [0, 0], [3, 2]]] },
    { paper: 'rect', cuts: [[[0, 0], [6, 4]]], pieces: [[[0, 0], [6, 0], [6, 4]], [[0, 0], [6, 4], [0, 4]]] },
    { paper: 'rect', cuts: [[[3, 0], [3, 4]], [[0, 2], [6, 2]]], pieces: [[[0, 0], [3, 0], [3, 2], [0, 2]], [[3, 0], [6, 0], [6, 2], [3, 2]], [[0, 2], [3, 2], [3, 4], [0, 4]], [[3, 2], [6, 2], [6, 4], [3, 4]]] },
    { paper: 'rect', cuts: [[[2, 0], [2, 4]], [[4, 0], [4, 4]]], pieces: [[[0, 0], [2, 0], [2, 4], [0, 4]], [[2, 0], [4, 0], [4, 4], [2, 4]], [[4, 0], [6, 0], [6, 4], [4, 4]]] },
    { paper: 'rect', cuts: [[[2, 0], [4, 4]]], pieces: [[[0, 0], [2, 0], [4, 4], [0, 4]], [[2, 0], [6, 0], [6, 4], [4, 4]]] },
    { paper: 'rect', cuts: [[[3, 0], [0, 4]], [[3, 0], [6, 4]]], pieces: [[[0, 0], [3, 0], [0, 4]], [[3, 0], [6, 4], [0, 4]], [[3, 0], [6, 0], [6, 4]]] },
    { paper: 'tri', cuts: [[[3, 0], [3, 4]]], pieces: [[[0, 4], [3, 4], [3, 0]], [[3, 4], [6, 4], [3, 0]]] },
    { paper: 'tri', cuts: [[[1.5, 2], [4.5, 2]], [[1.5, 2], [3, 4]], [[4.5, 2], [3, 4]]], pieces: [[[0, 4], [3, 4], [1.5, 2]], [[3, 4], [6, 4], [4.5, 2]], [[1.5, 2], [4.5, 2], [3, 0]], [[3, 4], [4.5, 2], [1.5, 2]]] },
    { paper: 'tri', cuts: [[[3, 0], [2, 4]], [[3, 0], [4, 4]]], pieces: [[[0, 4], [2, 4], [3, 0]], [[2, 4], [4, 4], [3, 0]], [[4, 4], [6, 4], [3, 0]]] },
    // 삼각형과 사각형이 함께 생기는 것
    { paper: 'rect', cuts: [[[0, 0], [4, 4]]], pieces: [[[0, 0], [4, 4], [0, 4]], [[0, 0], [6, 0], [6, 4], [4, 4]]] },
    { paper: 'rect', cuts: [[[3, 0], [3, 4]], [[0, 0], [3, 4]]], pieces: [[[0, 0], [3, 0], [3, 4]], [[0, 0], [3, 4], [0, 4]], [[3, 0], [6, 0], [6, 4], [3, 4]]] },
    { paper: 'rect', cuts: [[[2, 0], [0, 4]], [[4, 0], [6, 4]]], pieces: [[[0, 0], [2, 0], [0, 4]], [[2, 0], [4, 0], [6, 4], [0, 4]], [[4, 0], [6, 0], [6, 4]]] },
    { paper: 'rect', cuts: [[[0, 2], [6, 2]], [[0, 0], [6, 2]]], pieces: [[[0, 0], [6, 0], [6, 2]], [[0, 0], [6, 2], [0, 2]], [[0, 2], [6, 2], [6, 4], [0, 4]]] },
    { paper: 'rect', cuts: [[[2, 0], [2, 4]], [[4, 0], [4, 4]], [[2, 0], [4, 4]]], pieces: [[[0, 0], [2, 0], [2, 4], [0, 4]], [[2, 0], [4, 0], [4, 4]], [[2, 0], [4, 4], [2, 4]], [[4, 0], [6, 0], [6, 4], [4, 4]]] },
    { paper: 'rect', cuts: [[[3, 0], [6, 2]], [[6, 2], [3, 4]], [[3, 4], [0, 2]], [[0, 2], [3, 0]]], pieces: [[[0, 0], [3, 0], [0, 2]], [[3, 0], [6, 0], [6, 2]], [[6, 2], [6, 4], [3, 4]], [[3, 4], [0, 4], [0, 2]], [[3, 0], [6, 2], [3, 4], [0, 2]]] },
    { paper: 'tri', cuts: [[[1.5, 2], [4.5, 2]]], pieces: [[[1.5, 2], [4.5, 2], [3, 0]], [[0, 4], [6, 4], [4.5, 2], [1.5, 2]]] },
    { paper: 'tri', cuts: [[[1.5, 2], [4.5, 2]], [[3, 2], [3, 4]]], pieces: [[[1.5, 2], [4.5, 2], [3, 0]], [[0, 4], [3, 4], [3, 2], [1.5, 2]], [[3, 4], [6, 4], [4.5, 2], [3, 2]]] },
    { paper: 'tri', cuts: [[[1.5, 2], [3, 4]], [[4.5, 2], [3, 4]]], pieces: [[[0, 4], [3, 4], [1.5, 2]], [[3, 4], [6, 4], [4.5, 2]], [[1.5, 2], [3, 4], [4.5, 2], [3, 0]]] }
  ];
  const cutCounts = (cut) => [3, 4].map((n) => cut.pieces.filter((p) => p.length === n).length);
  const cutArt = (cut) => G.board(6, 4, [G.polygon(PAPER[cut.paper])].concat(cut.cuts.map(([p, q]) => G.line(p, q, 'mb-line is-cut'))), {
    grid: false, scale: 1.25,
    label: `점선 ${cut.cuts.length}개가 그어진 ${cut.paper === 'rect' ? '사각형' : '삼각형'} 모양의 종이. 점선을 따라 자르면 조각이 ${cut.pieces.length}개 생긴다. 조각마다 변의 수: ${cut.pieces.map((p) => p.length).join(', ')}`
  });

  // ── 칠교판 ───────────────────────────────────────────────────
  // 한 변이 4칸인 정사각형을 일곱 조각으로 나눈 것. 큰 삼각형 2(L), 중간 삼각형 1(M), 작은 삼각형 2(S), 사각형 2(Q 반듯한 것, P 비스듬한 것).
  const TAN = [['L', [[0, 0], [4, 0], [2, 2]]], ['L', [[0, 0], [2, 2], [0, 4]]], ['Q', [[2, 2], [3, 1], [4, 2], [3, 3]]], ['S', [[4, 0], [4, 2], [3, 1]]], ['S', [[2, 2], [3, 3], [1, 3]]], ['P', [[0, 4], [1, 3], [3, 3], [2, 4]]], ['M', [[4, 2], [4, 4], [2, 4]]]];
  // 조각 하나를 작은 삼각형 둘로 가른 것(두 조각을 붙여 만드는 문제의 풀이 그림)
  const SPLIT = { Q: [[[2, 2], [4, 2], [3, 1]], [[2, 2], [4, 2], [3, 3]]], M: [[[4, 2], [4, 4], [3, 3]], [[4, 4], [2, 4], [3, 3]]], P: [[[0, 4], [2, 4], [1, 3]], [[1, 3], [3, 3], [2, 4]]] };
  const SYM = [([x, y]) => [x, y], ([x, y]) => [4 - x, y], ([x, y]) => [x, 4 - y], ([x, y]) => [4 - x, 4 - y], ([x, y]) => [y, x], ([x, y]) => [4 - y, x], ([x, y]) => [y, 4 - x], ([x, y]) => [4 - y, 4 - x]];
  const centre = (pts) => [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];
  const area = (pts) => Math.abs(pts.reduce((s, p, i) => { const q = pts[(i + 1) % pts.length]; return s + p[0] * q[1] - p[1] * q[0]; }, 0)) / 2;
  // 칠교판을 돌리거나 뒤집어 놓고, 위에서부터 왼쪽부터 차례로 ㉠ ~ ㉦ 을 붙인다.
  function tanBoard(d) {
    const turn = d.pick(SYM);
    const pieces = TAN.map(([kind, pts]) => ({ kind, pts: pts.map(turn) })).sort((a, b) => { const p = centre(a.pts), q = centre(b.pts); return Math.abs(p[1] - q[1]) > 0.2 ? p[1] - q[1] : p[0] - q[0]; });
    pieces.forEach((piece, i) => { piece.mark = MARKS[i]; });
    return { pieces, turn };
  }
  // 칠교 조각으로 만든 모양(조각끼리 변을 맞대어 붙인 것)
  const FORMS = {
    cat: { name: '고양이 얼굴', pieces: [['Q', [[1, 2], [2, 1], [3, 2], [2, 3]]], ['S', [[1, 0], [1, 2], [2, 1]]], ['S', [[3, 0], [3, 2], [2, 1]]]] },
    fish: { name: '물고기', pieces: [['L', [[2, 0], [2, 4], [0, 2]]], ['L', [[2, 0], [2, 4], [4, 2]]], ['S', [[3, 1], [5, 1], [4, 2]]], ['P', [[3, 3], [4, 2], [6, 2], [5, 3]]]] },
    boat: { name: '돛단배', pieces: [['P', [[0, 3], [2, 3], [3, 4], [1, 4]]], ['S', [[2, 3], [4, 3], [3, 4]]], ['M', [[2, 3], [2, 1], [4, 3]]], ['L', [[2, -1], [2, 3], [0, 1]]]] },
    house: { name: '집', pieces: [['L', [[0, 2], [4, 2], [2, 0]]], ['M', [[1, 2], [3, 2], [1, 4]]], ['S', [[3, 2], [3, 4], [2, 3]]], ['S', [[1, 4], [3, 4], [2, 3]]], ['Q', [[3, 1], [4, 0], [5, 1], [4, 2]]]] },
    bigHouse: { name: '큰 집', pieces: [['L', [[0, 2], [4, 2], [2, 0]]], ['L', [[0, 4], [4, 4], [2, 2]]], ['M', [[0, 2], [2, 2], [0, 4]]], ['S', [[2, 2], [4, 2], [3, 3]]], ['S', [[4, 2], [4, 4], [3, 3]]], ['Q', [[3, 1], [4, 0], [5, 1], [4, 2]]], ['P', [[4, 2], [4, 4], [5, 3], [5, 1]]]] }
  };
  // 만든 모양 하나(왼쪽·오른쪽을 뒤집기도 한다)
  function formOf(d, id) {
    const form = FORMS[id], flip = d.bool();
    return { name: form.name, pieces: form.pieces.map(([kind, pts]) => ({ kind, pts: pts.map(([x, y]) => [flip ? 6 - x : x, y]) })) };
  }
  // 조각들을 그린다. o: { u(한 칸의 크기), marks(조각에 기호를 적는다), dash(점선으로 그을 선들), label }
  function tanArt(pieces, o) {
    const opt = o || {}, u = opt.u || 34, all = pieces.reduce((list, p) => list.concat(p.pts), []);
    const x0 = Math.min(...all.map((p) => p[0])), y0 = Math.min(...all.map((p) => p[1])), w = (Math.max(...all.map((p) => p[0])) - x0) * u, h = (Math.max(...all.map((p) => p[1])) - y0) * u;
    const side = Math.max(5, (66 - w) / 2), at = (p) => ((p[0] - x0) * u + side).toFixed(1) + ',' + ((p[1] - y0) * u + 5).toFixed(1);
    let body = pieces.map((p) => '<polygon class="mb-poly" points="' + p.pts.map(at).join(' ') + '"/>').join('');
    (opt.dash || []).forEach(([p, q]) => { const [a, b] = [at(p).split(','), at(q).split(',')]; body += '<line class="mb-line is-cut" x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '"/>'; });
    if (opt.marks) pieces.forEach((p) => { const [x, y] = at(centre(p.pts)).split(','); body += '<text class="mb-label" style="font-size:16px" x="' + x + '" y="' + y + '" text-anchor="middle" dominant-baseline="central">' + p.mark + '</text>'; });
    const said = opt.label || `칠교 조각 ${pieces.length}개. 조각마다 변의 수: ${pieces.map((p) => p.pts.length).join(', ')}`;
    return '<svg class="mb-geo" viewBox="0 0 ' + (w + side * 2).toFixed(1) + ' ' + (h + 10).toFixed(1) + '" width="' + Math.ceil(w + side * 2) + '" role="img" aria-label="' + said + '">' + body + '</svg>';
  }
  const tanCounts = (pieces) => [3, 4].map((n) => pieces.filter((p) => p.pts.length === n).length);
  // 만든 모양의 한 칸 크기: 작은 모양은 크게, 큰 모양은 카드 너비를 넘지 않게
  const formUnit = (pieces) => { const xs = pieces.reduce((list, p) => list.concat(p.pts.map((q) => q[0])), []); return Math.min(42, Math.floor(210 / (Math.max(...xs) - Math.min(...xs)))); };

  // ── 도형에 대한 말 ───────────────────────────────────────────
  // 참·거짓은 손으로 적지 않고 아래 표에서 셈한다. straight: 곧은 선으로만 둘러싸여 있다, same: 크기가 달라도 모양이 모두 같다
  const FACT = { 삼각형: { sides: 3, corners: 3, straight: true, same: false }, 사각형: { sides: 4, corners: 4, straight: true, same: false }, 원: { sides: 0, corners: 0, straight: false, same: true } };
  const SAY = {
    sides: (s, n) => [`변이 ${n}개이다.`, FACT[s].sides === n],
    corners: (s, n) => [`꼭짓점이 ${n}개이다.`, FACT[s].corners === n],
    straight: (s) => ['곧은 선으로 둘러싸여 있다.', FACT[s].straight],
    noStraight: (s) => ['곧은 선이 없다.', !FACT[s].straight],
    curved: (s) => ['굽은 선이 있다.', !FACT[s].straight],
    round: (s) => ['둥근 부분이 있다.', !FACT[s].straight],
    pointy: (s) => ['뾰족한 부분이 있다.', FACT[s].corners > 0],
    noPointy: (s) => ['뾰족한 부분이 없다.', FACT[s].corners === 0],
    none: (s) => ['변과 꼭짓점이 없다.', FACT[s].sides === 0 && FACT[s].corners === 0],
    equal: (s) => ['변의 수와 꼭짓점의 수가 같다.', FACT[s].sides === FACT[s].corners],
    moreSides: (s) => ['변이 꼭짓점보다 많다.', FACT[s].sides > FACT[s].corners],
    same: (s) => [`모든 ${s}은 모양이 같다.`, FACT[s].same],
    size: (s) => [`모든 ${s}은 크기가 같다.`, false],
    sameLook: (s) => ['크기가 달라도 모양은 모두 같다.', FACT[s].same]
  };
  // 참인 말 a개와 거짓인 말 b개를 골라 섞는다.
  function saying(d, list, a, b) {
    const rows = d.shuffle(d.shuffle(list.filter((row) => row[1])).slice(0, a).concat(d.shuffle(list.filter((row) => !row[1])).slice(0, b)));
    return { options: rows.map((row) => row[0]), truth: rows.map((row) => row[1]) };
  }

  B.addUnit({
    id: '2-1-2', grade: 2, semester: 1, no: 2, title: '여러 가지 도형', version: 1,
    groups: [
      {
        id: 'find', title: '삼각형, 사각형, 원 찾기', standard: KNOW,
        types: [
          T('find-one', '도형 여럿 가운데 한 도형 찾기', '①1', (d, n) => {
            const kind = KINDS[n], extra = d.pick(kind === 'circle' ? ['five', 'half'] : ['five', 'half', 'oval']);
            const list = mix(d, [['tri', 1, 'plain'], ['quad', 1, 'plain'], ['circle', 1], [extra, 1]]), at = list.findIndex((s) => s.kind === kind);
            return C(`다음 중 ${NAME[kind]}은?`, TAGS.slice(0, 4), at, { figure: gallery(list), explain: `${MEAN[kind]} ${NAME[kind]}은 ${TAGS[at]}이다.`, facts: { truth: list.map((s) => s.kind === kind), want: true } });
          }, { count: 3 }),
          T('find-all', '한 도형을 모두 찾기', '①2 심1', (d, n) => {
            const kind = KINDS[n], hit = d.int(2, 3);
            const fill = { tri: ['quad', 'quad', 'circle', 'five', 'half', 'oval'], quad: ['tri', 'tri', 'circle', 'five', 'half', 'oval'], circle: ['tri', 'tri', 'quad', 'quad', 'oval', 'half', 'five'] }[kind];
            const list = mix(d, [[kind, hit]].concat(tally(d.shuffle(fill).slice(0, 6 - hit)))), flags = list.map((s) => s.kind === kind), made = setOptions(d, TAGS.slice(0, 6), flags);
            return C(`${NAME[kind]}을 모두 고른 것은?`, made.options, made.answer, {
              figure: gallery(list), explain: `${MEAN[kind]} ${NAME[kind]}은 ${listed(TAGS, flags)}이다.`, facts: { sets: { labels: TAGS.slice(0, 6), flags, options: made.sets } }
            });
          }, { count: 3 }),
          T('find-not', '사각형이 아닌 것', '①3', (d) => {
            const list = mix(d, [['quad', 3], ['five', 1]]), at = list.findIndex((s) => s.kind !== 'quad');
            return C('사각형이 아닌 것은?', TAGS.slice(0, 4), at, { figure: gallery(list), explain: `사각형은 변이 4개이다. ${TAGS[at]}는 변이 5개이다.`, facts: { truth: list.map((s) => s.kind !== 'quad'), want: true } });
          }),
          T('find-name', '도형의 이름', '①4·7 심3', (d) => {
            const kind = d.pick(KINDS), shape = shapesOf(d, kind, 1, kind === 'circle' ? null : 'odd')[0], names = d.shuffle(KINDS.map((k) => NAME[k]));
            return C('도형의 이름은?', names, names.indexOf(NAME[kind]), { figure: gallery([shape], { tags: false }), explain: MEAN[kind], facts: { truth: names.map((name) => name === NAME[kind]), want: true } });
          }),
          T('find-thing', '물건에서 도형 찾기', '①5 심4', (d) => {
            const kind = d.pick(KINDS), own = d.pick(THINGS.filter((t) => t.kind === kind)), list = d.shuffle([own].concat(d.shuffle(THINGS.filter((t) => t.kind !== kind)).slice(0, 3))), at = list.indexOf(own);
            return C(`${NAME[kind]} 모양을 찾을 수 있는 물건은?`, TAGS.slice(0, 4), at, {
              figure: thingTiles(list), explain: `${TAGS[at]}(${own.name})에서 ${NAME[kind]} 모양을 찾을 수 있다.`, facts: { truth: list.map((t) => t.kind === kind), want: true }
            });
          }, { standard: FIND }),
          T('find-thing-count', '도형을 찾을 수 있는 물건의 수', '①5', (d) => {
            const kind = d.pick(KINDS), hit = d.int(2, 3);
            const list = d.shuffle(d.shuffle(THINGS.filter((t) => t.kind === kind)).slice(0, hit).concat(d.shuffle(THINGS.filter((t) => t.kind !== kind)).slice(0, 5 - hit))), flags = list.map((t) => t.kind === kind);
            return N(`${NAME[kind]} 모양을 찾을 수 있는 물건은 모두 몇 개인가?`, hit, {
              unit: '개', figure: thingTiles(list), explain: `${NAME[kind]} 모양을 찾을 수 있는 물건은 ${list.filter((t) => t.kind === kind).map((t) => t.name).join(', ')}이다.`, facts: { count: flags }
            });
          }, { standard: FIND }),
          T('find-thing-word', '도형을 찾을 수 없는 물건', '①5·8', (d) => {
            const kind = d.pick(['circle', 'quad']), other = kind === 'circle' ? 'quad' : 'circle', odd = d.pick(WORDS[other].concat(WORDS.tri));
            const list = d.shuffle(d.shuffle(WORDS[kind]).slice(0, 3).concat([odd])), oddKind = WORDS.tri.includes(odd) ? 'tri' : other;
            return C(`${NAME[kind]} 모양을 찾을 수 없는 물건은?`, list, list.indexOf(odd), {
              explain: `${odd}에서는 ${NAME[oddKind]} 모양을 찾을 수 있다. 나머지 물건에서는 ${NAME[kind]} 모양을 찾을 수 있다.`, facts: { truth: list.map((word) => !WORDS[kind].includes(word)), want: true }
            });
          }, { standard: FIND }),
          T('find-trace', '본뜨면 그려지는 도형', '①6 심4', (d) => {
            const kind = d.pick(KINDS), own = d.pick(TRACE[kind]), rest = d.shuffle(KINDS.filter((k) => k !== kind).reduce((all, k) => all.concat(TRACE[k]), [])).slice(0, 3);
            const list = d.shuffle([own].concat(rest));
            return C(`종이에 대고 본뜨면 ${NAME[kind]}을 그릴 수 있는 물건은?`, list, list.indexOf(own), {
              explain: `${josa(own, '을/를')} 종이에 대고 본뜨면 ${NAME[kind]}이 그려진다.`, facts: { truth: list.map((word) => TRACE[kind].includes(word)), want: true }
            });
          }, { standard: FIND })
        ]
      },
      {
        id: 'parts', title: '변과 꼭짓점, 도형의 특징', standard: COMMON,
        types: [
          T('parts-name', '변과 꼭짓점 가리기', '①9 심8', (d) => {
            // ㉠, ㉡ 가운데 하나는 곧은 선(변)을, 하나는 두 곧은 선이 만나는 점(꼭짓점)을 가리킨다.
            const shape = shapesOf(d, d.pick(['tri', 'quad']), 1, 'plain')[0], n = shape.pts.length, at = d.int(0, n - 1), corner = (at + 2 + (n === 4 ? d.int(0, 1) : 0)) % n, sideFirst = d.bool();
            const mark = (pts) => {
              const mid = centre(pts), a = pts[at], b = pts[(at + 1) % n], m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], v = pts[corner];
              const away = (p, r) => { const u = [p[0] - mid[0], p[1] - mid[1]], size = Math.hypot(u[0], u[1]); return [p[0] + (u[0] / size) * r, p[1] + (u[1] / size) * r]; };
              const big = (p, value) => G.text(p, value).replace('<text ', '<text style="font-size:16px" ');
              return G.line(away(m, 0.15), away(m, 0.75), 'mb-line is-thin') + big(away(m, 1.15), sideFirst ? '㉠' : '㉡') + G.line(away(v, 0.15), away(v, 0.75), 'mb-line is-thin') + big(away(v, 1.15), sideFirst ? '㉡' : '㉠');
            };
            const rows = d.shuffle([['변', '꼭짓점'], ['꼭짓점', '변'], ['변', '변'], ['꼭짓점', '꼭짓점']]), right = sideFirst ? '변,꼭짓점' : '꼭짓점,변';
            return C('㉠과 ㉡의 이름을 바르게 짝 지은 것은?', rows.map(([a, b]) => `㉠ ${a}, ㉡ ${b}`), rows.findIndex((row) => row.join() === right), {
              figure: gallery([shape], { tags: false, W: 7.4, H: 5.6, extra: (placed) => mark(placed[0]), label: `${shape.said}. ${sideFirst ? '㉠' : '㉡'}은 곧은 선을, ${sideFirst ? '㉡' : '㉠'}은 두 곧은 선이 만나는 점을 가리킨다` }),
              explain: '도형을 둘러싼 곧은 선을 변, 두 곧은 선이 만나는 점을 꼭짓점이라고 한다.', facts: { truth: rows.map((row) => row.join() === right), want: true }
            });
          }, { standard: KNOW }),
          T('parts-count', '도형의 변과 꼭짓점의 수', '①10', (d) => {
            const kind = d.pick(['tri', 'quad']), shape = shapesOf(d, kind, 1, 'odd')[0], n = shape.pts.length;
            return M('도형의 변과 꼭짓점은 각각 몇 개인가?', [{ label: '변', answer: n, unit: '개' }, { label: '꼭짓점', answer: n, unit: '개' }], {
              figure: gallery([shape], { tags: false }), explain: `곧은 선이 ${n}개, 두 곧은 선이 만나는 점이 ${n}개이다. ${NAME[kind]}은 변이 ${n}개, 꼭짓점이 ${n}개이다.`, facts: { calc: [[String(shape.sides), 0], [String(shape.sides), 1]] }
            });
          }),
          T('parts-two', '삼각형과 사각형의 변·꼭짓점의 수', '①10·14', (d) => {
            // 변·꼭짓점의 수를 더하게 하지 않고 각각 묻는다.
            const [a, b] = d.shuffle(['삼각형', '사각형']), [p, q] = d.shuffle(['변', '꼭짓점']), key = { 변: 'sides', 꼭짓점: 'corners' };
            return M(`${a}의 ${p}과 ${b}의 ${q}은 각각 몇 개인가?`, [{ label: `${a}의 ${p}`, answer: FACT[a][key[p]], unit: '개' }, { label: `${b}의 ${q}`, answer: FACT[b][key[q]], unit: '개' }], {
              explain: '삼각형은 변이 3개, 꼭짓점이 3개이다. 사각형은 변이 4개, 꼭짓점이 4개이다.', facts: { parts: [[ones(FACT[a][key[p]]), 0], [ones(FACT[b][key[q]]), 1]] }
            });
          }),
          T('parts-three', '세 도형의 변(꼭짓점)의 수', '①11', (d) => {
            const list = mix(d, [['tri', 1], ['quad', 1], ['circle', 1]]), what = d.pick(['변', '꼭짓점']);
            return M(`도형 가, 나, 다의 ${what}은 각각 몇 개인가?`, list.map((s, i) => ({ label: TAGS[i], answer: s.sides, unit: '개' })), {
              figure: gallery(list), explain: list.map((s, i) => `${TAGS[i]}는 ${NAME[s.kind]}이므로 ${s.sides}개`).join(', ') + `이다. 원에는 변과 꼭짓점이 없다.`, facts: { parts: list.map((s, i) => [ones(s.kind === 'circle' ? 0 : s.pts.length), i]) }
            });
          }),
          T('parts-none', '변과 꼭짓점이 없는 도형', '①12', (d) => {
            const list = mix(d, [['tri', 1], ['quad', 1], ['circle', 1], ['five', 1]]), at = list.findIndex((s) => s.kind === 'circle');
            return C('변과 꼭짓점이 없는 도형은?', TAGS.slice(0, 4), at, { figure: gallery(list), explain: `${TAGS[at]}는 원이다. 원에는 곧은 선이 없으므로 변과 꼭짓점이 없다.`, facts: { truth: list.map((s) => s.sides === 0), want: true } });
          }, { standard: KNOW }),
          T('parts-order', '변의 수가 적은 도형부터 차례로 쓰기', '①13', (d) => {
            const list = mix(d, [['tri', 1], ['quad', 1], ['circle', 1]]), ranks = list.map((s) => [0, 3, 4].indexOf(s.sides));
            const orders = d.shuffle(d.shuffle([[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]].filter((o) => o.map((i) => ranks[i]).join() !== '0,1,2')).slice(0, 3).concat([[0, 1, 2].map((r) => ranks.indexOf(r))]));
            return C('변의 수가 적은 도형부터 차례로 쓴 것은?', orders.map((o) => o.map((i) => TAGS[i]).join(', ')), orders.findIndex((o) => o.map((i) => ranks[i]).join() === '0,1,2'), {
              figure: gallery(list), explain: list.map((s, i) => `${TAGS[i]}는 변이 ${s.sides}개`).join(', ') + '이다.', facts: { sequence: { ranks, options: orders } }
            });
          }),
          T('parts-riddle', '설명을 읽고 도형 찾기', '①15 심9', (d, n) => {
            const kind = n === 0 ? d.pick(['tri', 'quad']) : 'circle', k = KIND[kind].sides, names = d.shuffle(KINDS.map((x) => NAME[x]));
            const lines = n === 0 ? ['곧은 선으로 둘러싸여 있다.', `두 곧은 선이 만나는 점이 ${k}개이다.`] : d.shuffle(['뾰족한 부분이 없다.', '어느 쪽에서 보아도 똑같이 동그란 모양이다.', '곧은 선이 없다.']).slice(0, 2);
            return C('다음에서 설명하는 도형은?', names, names.indexOf(NAME[kind]), {
              figure: conditions(lines), explain: n === 0 ? `두 곧은 선이 만나는 점은 꼭짓점이다. 꼭짓점이 ${k}개인 도형은 ${NAME[kind]}이다.` : MEAN.circle,
              facts: { truth: names.map((name) => (n === 0 ? FACT[name].corners === k && FACT[name].straight : !FACT[name].straight)), want: true }
            });
          }, { count: 2, standard: KNOW }),
          T('parts-by-sides', '변(꼭짓점)의 수로 도형 찾기', '①15 심2', (d) => {
            const kind = d.pick(['tri', 'quad']), k = KIND[kind].sides, what = d.pick(['변', '꼭짓점']), hit = d.int(2, 3), other = kind === 'tri' ? 'quad' : 'tri';
            const list = mix(d, [[kind, hit]].concat(tally(d.shuffle([other, other, 'five', 'circle', 'circle']).slice(0, 6 - hit)))), flags = list.map((s) => s.kind === kind), made = setOptions(d, TAGS.slice(0, 6), flags);
            return C(`${what}이 ${k}개인 도형을 모두 고른 것은?`, made.options, made.answer, {
              figure: gallery(list), explain: `도형마다 ${what}의 수를 세면 ` + list.map((s, i) => `${TAGS[i]} ${s.sides}개`).join(', ') + '이다.', facts: { sets: { labels: TAGS.slice(0, 6), flags, options: made.sets } }
            });
          }),
          T('parts-say-tri', '삼각형에 대한 설명', '①16 심10', (d) => {
            const s = '삼각형', made = saying(d, [SAY.sides(s, 3), SAY.corners(s, 3), SAY.straight(s), SAY.equal(s), SAY.sides(s, 4), SAY.corners(s, 4), SAY.curved(s), SAY.round(s), SAY.noPointy(s), SAY.same(s), SAY.moreSides(s)], 1, 3);
            return C('삼각형에 대한 설명으로 옳은 것은?', made.options, made.truth.indexOf(true), { explain: '삼각형은 곧은 선 3개로 둘러싸인 도형이다. 변이 3개, 꼭짓점이 3개이고 모양은 여러 가지이다.', facts: { truth: made.truth, want: true } });
          }),
          T('parts-say-quad', '사각형에 대한 설명', '①16', (d) => {
            const s = '사각형', made = saying(d, [SAY.sides(s, 4), SAY.corners(s, 4), SAY.straight(s), SAY.equal(s), SAY.pointy(s), SAY.sides(s, 5), SAY.corners(s, 3), SAY.curved(s), SAY.round(s), SAY.same(s), SAY.moreSides(s)], 3, 1);
            return C('사각형에 대한 설명으로 옳지 않은 것은?', made.options, made.truth.indexOf(false), { explain: '사각형은 곧은 선 4개로 둘러싸인 도형이다. 변이 4개, 꼭짓점이 4개이고 모양은 여러 가지이다.', facts: { truth: made.truth, want: false } });
          }),
          T('parts-say-circle', '원에 대한 설명', '①17·18·20', (d) => {
            const s = '원', made = saying(d, [SAY.noPointy(s), SAY.noStraight(s), SAY.none(s), SAY.sameLook(s), SAY.size(s), SAY.straight(s), SAY.corners(s, 1), SAY.pointy(s)], 3, 1);
            return C('원에 대한 설명으로 옳지 않은 것은?', made.options, made.truth.indexOf(false), { explain: '원은 어느 쪽에서 보아도 똑같이 동그란 모양이다. 곧은 선과 뾰족한 부분이 없다. 크기는 달라도 모양은 모두 같다.', facts: { truth: made.truth, want: false } });
          }, { standard: KNOW }),
          T('parts-common', '삼각형과 사각형의 같은 점', '①19', (d) => {
            // 두 도형 모두에 맞는 말만 같은 점이다.
            const both = (make) => { const a = make('삼각형'), b = make('사각형'); return [a[0], a[1] && b[1]]; };
            const rows = [[SAY.pointy, null], [SAY.straight, null], [SAY.sides, 4], [SAY.corners, 3], [SAY.round, null], [SAY.curved, null], [SAY.none, null]].map(([say, n]) => both((s) => say(s, n)))
              .concat([['변과 꼭짓점이 있다.', FACT.삼각형.sides > 0 && FACT.사각형.sides > 0], ['변의 수가 같다.', FACT.삼각형.sides === FACT.사각형.sides], ['꼭짓점의 수가 같다.', FACT.삼각형.corners === FACT.사각형.corners]]);
            const made = saying(d, rows, 1, 3);
            return C('삼각형과 사각형의 같은 점은?', made.options, made.truth.indexOf(true), { explain: '삼각형과 사각형은 모두 곧은 선으로 둘러싸여 있고 변과 꼭짓점이 있다. 변과 꼭짓점은 삼각형이 3개씩, 사각형이 4개씩이다.', facts: { truth: made.truth, want: true } });
          }),
          T('parts-differ', '삼각형과 사각형의 다른 점', '①19·20', (d) => {
            // 「~에만 …이 있다」는 한쪽에만 맞을 때 참이다.
            const only = (a, text, test) => [`${a}에만 ${text}`, test(FACT[a]) && !test(FACT[a === '삼각형' ? '사각형' : '삼각형'])];
            const rows = [['변의 수가 다르다.', FACT.삼각형.sides !== FACT.사각형.sides], ['꼭짓점의 수가 다르다.', FACT.삼각형.corners !== FACT.사각형.corners],
              only('삼각형', '뾰족한 부분이 있다.', (f) => f.corners > 0), only('사각형', '변이 있다.', (f) => f.sides > 0), only('삼각형', '곧은 선이 있다.', (f) => f.straight), only('사각형', '꼭짓점이 있다.', (f) => f.corners > 0), only('삼각형', '굽은 선이 있다.', (f) => !f.straight)];
            const made = saying(d, rows, 1, 3);
            return C('삼각형과 사각형의 다른 점은?', made.options, made.truth.indexOf(true), { explain: '삼각형은 변과 꼭짓점이 3개씩이고, 사각형은 변과 꼭짓점이 4개씩이다. 곧은 선과 뾰족한 부분은 두 도형에 모두 있다.', facts: { truth: made.truth, want: true } });
          }),
          T('why-not', '삼각형·사각형이 아닌 까닭', '①21 심5', (d, n) => {
            // 사각형(삼각형)처럼 보이지만 아닌 도형 하나. 까닭은 보기 가운데 하나만 그 도형에 맞는다.
            const kind = n === 0 ? 'quad' : 'tri', k = KIND[kind].sides, look = d.pick(n === 0 ? ['curvy4', 'five', 'open4'] : ['curvy3', 'dart', 'open3']);
            const shape = look === 'five' ? Object.assign({}, KIND.five, { kind: 'five', pts: LOOKS.five[1] }) : shapesOf(d, look, 1)[0], more = n === 0 ? 5 : 4;
            const rows = d.shuffle([['굽은 선이 있다.', Boolean(shape.curved)], ['끊어진 곳이 있다.', Boolean(shape.open)], [`변이 ${more}개이다.`, !shape.curved && !shape.open && shape.sides === more], ['뾰족한 부분이 없다.', shape.sides === 0]]);
            return C(`도형은 ${NAME[kind]}이 아니다. 그 까닭은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
              figure: gallery([shape], { tags: false }), explain: `${NAME[kind]}은 곧은 선 ${k}개로 둘러싸인 도형이다. 이 도형은 ${why(shape).replace('곧은 선이', '변이')}.`, facts: { truth: rows.map((row) => row[1]), want: true }
            });
          }, { count: 2, standard: KNOW })
        ]
      },
      {
        id: 'count', title: '도형 세기와 자르기', standard: KNOW,
        types: [
          T('count-mixed', '섞여 있는 도형을 갈래마다 세기', '①22 심1', (d) => {
            const [a, b, c, o] = d.until(() => [d.int(1, 3), d.int(1, 3), d.int(1, 2), d.int(1, 2)], (v) => { const sum = v[0] + v[1] + v[2] + v[3]; return sum >= 7 && sum <= 8 && new Set(v.slice(0, 3)).size >= 2; });
            const list = mix(d, [['tri', a], ['quad', b], ['circle', c]].concat(tally(d.shuffle(['five', 'half', 'oval']).slice(0, o))));
            return M('삼각형, 사각형, 원은 각각 몇 개인가?', KINDS.map((kind) => ({ label: NAME[kind], answer: list.filter((s) => s.kind === kind).length, unit: '개' })), {
              figure: gallery(list), explain: KINDS.map((kind) => `${NAME[kind]}은 ${listed(TAGS, list.map((s) => s.kind === kind))}`).join(', ') + '이다.',
              facts: { parts: KINDS.map((kind, i) => [ones(list.filter((s) => s.said === KIND[kind].said).length), i]) }
            });
          }),
          T('count-picture', '도형으로 꾸민 그림에서 세기', '①23', (d) => {
            const pic = picture(d, [townPic, robotPic]), counts = picCounts(pic);
            return M(`삼각형, 사각형, 원 모양을 놓아 ${pic.name} 그림을 꾸몄다. 삼각형, 사각형, 원은 각각 몇 개인가?`, KINDS.map((kind, i) => ({ label: NAME[kind], answer: counts[i], unit: '개' })), {
              figure: pictureArt(pic), explain: `삼각형은 ${counts[0]}개, 사각형은 ${counts[1]}개, 원은 ${counts[2]}개이다.`, facts: { calc: counts.map((v, i) => [String(v), i]) }
            });
          }, { standard: FIND }),
          T('count-most', '가장 많이 놓은 도형', '심6', (d) => {
            const pic = d.until(() => picture(d, [trainPic, robotPic]), (p) => new Set(picCounts(p)).size === 3), counts = picCounts(pic), names = KINDS.map((kind) => NAME[kind]);
            return C(`삼각형, 사각형, 원 모양을 놓아 ${pic.name} 그림을 꾸몄다. 가장 많이 놓은 도형은?`, names, counts.indexOf(Math.max(...counts)), {
              figure: pictureArt(pic), explain: `삼각형은 ${counts[0]}개, 사각형은 ${counts[1]}개, 원은 ${counts[2]}개이다.`, facts: { rank: { values: counts, nth: 1 } }
            });
          }, { standard: FIND }),
          T('cut-what', '점선을 따라 자르면 생기는 도형', '①25', (d) => {
            const cut = d.pick(CUTS.filter((c) => cutCounts(c).includes(0))), [t, q] = cutCounts(cut), n = t + q, kind = t ? 'tri' : 'quad', other = t ? 'quad' : 'tri', lines = cut.cuts.length;
            const wrong = n === lines ? n + 1 : lines, rows = d.shuffle([[kind, n], [other, n], [kind, wrong], [other, wrong]]);
            return C('종이를 점선을 따라 모두 잘랐다. 어떤 도형이 몇 개 생기는가?', rows.map(([k, v]) => `${NAME[k]} ${v}개`), rows.findIndex(([k, v]) => k === kind && v === n), {
              figure: cutArt(cut), explain: `조각이 ${n}개 생긴다. 조각마다 변이 ${t ? 3 : 4}개이므로 ${NAME[kind]}이 ${n}개 생긴다.`,
              facts: { truth: rows.map(([k, v]) => cut.pieces.every((p) => p.length === KIND[k].sides) && cut.pieces.length === v), want: true }
            });
          }),
          T('cut-count', '점선을 따라 자르면 생기는 삼각형과 사각형의 수', '①25', (d) => {
            const cut = d.pick(CUTS.filter((c) => !cutCounts(c).includes(0))), [t, q] = cutCounts(cut);
            return M('종이를 점선을 따라 모두 잘랐다. 삼각형과 사각형은 각각 몇 개 생기는가?', [{ label: '삼각형', answer: t, unit: '개' }, { label: '사각형', answer: q, unit: '개' }], {
              figure: cutArt(cut), explain: `조각마다 변의 수를 센다. 변이 3개인 조각이 ${t}개, 변이 4개인 조각이 ${q}개이다.`, facts: { parts: [3, 4].map((k, i) => [ones(cut.pieces.filter((p) => p.length === k).length), i]) }
            });
          }),
          T('draw-more', '더 그려야 하는 변의 수', '①28', (d) => {
            const kind = d.pick(['tri', 'quad', 'quad']), n = KIND[kind].sides, drawn = kind === 'tri' ? 1 : d.int(1, 2), flip = d.bool(), from = d.int(0, n - 1);
            const dots = (kind === 'tri' ? [[0.5, 3.4], [4.8, 3.1], [2.2, 0.4]] : [[0.5, 0.7], [4.4, 0.3], [5, 3.2], [1, 3.5]]).map(([x, y]) => [flip ? 5.5 - x : x, y]);
            const parts = dots.map((p) => G.point(p));
            for (let i = 0; i < drawn; i += 1) parts.push(G.line(dots[(from + i) % n], dots[(from + i + 1) % n]));
            return N(`점 ${n}개를 곧은 선으로 이어 ${NAME[kind]}을 그리고 있다. 변을 몇 개 더 그려야 하는가?`, n - drawn, {
              unit: '개', figure: G.board(5.5, 3.9, parts, { grid: false, scale: 1.25, label: `점 ${n}개와 그려 놓은 변 ${drawn}개` }),
              explain: `${NAME[kind]}의 변은 ${n}개이다. 변 ${drawn}개를 그렸으므로 ${n - drawn}개를 더 그려야 한다.`, facts: { calc: [[`${n}-${drawn}`, 0]] }
            });
          })
        ]
      },
      {
        id: 'tangram', title: '칠교판', standard: FIND,
        types: [
          T('tan-pieces', '칠교 조각의 도형과 수', '①30 심16', (d) => {
            const { pieces } = tanBoard(d), [t, q] = tanCounts(pieces);
            return M('칠교판의 조각 중 삼각형과 사각형은 각각 몇 개인가?', [{ label: '삼각형', answer: t, unit: '개' }, { label: '사각형', answer: q, unit: '개' }], {
              figure: tanArt(pieces, { u: 40 }), explain: `칠교판의 조각은 모두 7개이다. 삼각형이 ${t}개, 사각형이 ${q}개이다.`, facts: { tangram: pieces.map((p) => p.pts), parts: [[ones(pieces.filter((p) => 'LMS'.includes(p.kind)).length), 0], [ones(pieces.filter((p) => 'QP'.includes(p.kind)).length), 1]] }
            });
          }),
          T('tan-quads', '칠교판에서 사각형 조각 찾기', '①30', (d) => {
            const { pieces } = tanBoard(d), flags = pieces.map((p) => p.pts.length === 4), made = setOptions(d, MARKS, flags);
            return C('칠교판에서 사각형 조각을 모두 고른 것은?', made.options, made.answer, {
              figure: tanArt(pieces, { u: 40, marks: true }), explain: `변이 4개인 조각은 ${listed(MARKS, flags)}이다. 나머지 조각은 변이 3개인 삼각형이다.`, facts: { sets: { labels: MARKS, flags, options: made.sets } }
            });
          }),
          T('tan-say', '칠교판에 대한 설명', '①31 심17', (d) => {
            const { pieces } = tanBoard(d), [t, q] = tanCounts(pieces), tris = pieces.filter((p) => p.pts.length === 3), biggest = pieces.slice().sort((a, b) => area(b.pts) - area(a.pts))[0];
            const made = saying(d, [[`조각은 모두 ${pieces.length}개이다.`, true], ['조각은 모두 8개이다.', pieces.length === 8], [`삼각형 조각은 ${t}개이다.`, true], ['삼각형 조각은 4개이다.', t === 4], [`사각형 조각은 ${q}개이다.`, true], ['사각형 조각은 1개이다.', q === 1],
              ['가장 큰 조각은 삼각형이다.', biggest.pts.length === 3], ['가장 큰 조각은 사각형이다.', biggest.pts.length === 4], ['삼각형 조각은 크기가 모두 같다.', new Set(tris.map((p) => area(p.pts))).size === 1]], 3, 1);
            return C('칠교판에 대한 설명으로 옳지 않은 것은?', made.options, made.truth.indexOf(false), {
              figure: tanArt(pieces, { u: 40 }), explain: `칠교판의 조각은 7개이다. 삼각형이 ${t}개, 사각형이 ${q}개이다. 삼각형은 큰 것 2개, 중간 것 1개, 작은 것 2개이고 가장 큰 조각은 삼각형이다.`, facts: { truth: made.truth, want: false }
            });
          }),
          T('tan-used', '만든 모양에 쓴 삼각형·사각형 조각의 수', '①32', (d) => {
            const form = formOf(d, d.pick(['cat', 'fish', 'boat'])), [t, q] = tanCounts(form.pieces);
            return M(`칠교 조각으로 ${form.name} 모양을 만들었다. 삼각형 조각과 사각형 조각은 각각 몇 개인가?`, [{ label: '삼각형', answer: t, unit: '개' }, { label: '사각형', answer: q, unit: '개' }], {
              figure: tanArt(form.pieces, { u: formUnit(form.pieces) }), explain: `조각마다 변의 수를 센다. 변이 3개인 조각이 ${t}개, 변이 4개인 조각이 ${q}개이다.`, facts: { parts: [[ones(form.pieces.filter((p) => 'LMS'.includes(p.kind)).length), 0], [ones(form.pieces.filter((p) => 'QP'.includes(p.kind)).length), 1]] }
            });
          }),
          T('tan-two', '두 조각으로 다른 조각과 같은 도형 만들기', '①33 심18', (d) => {
            // 넓이가 같아지는 짝은 가장 작은 삼각형 둘뿐이다(조각의 넓이: 큰 삼각형 4, 중간 삼각형·사각형 2, 작은 삼각형 1).
            const { pieces, turn } = tanBoard(d), goal = d.pick(pieces.filter((p) => 'QMP'.includes(p.kind))), small = pieces.filter((p) => p.kind === 'S'), rest = pieces.filter((p) => p !== goal && p.kind !== 'S');
            const pairs = d.shuffle([small].concat(d.shuffle([[small[0], d.pick(rest)], [small[1], d.pick(rest)], d.shuffle(rest).slice(0, 2), [small[0], rest[0]], [small[1], rest[1]]])
              .filter((pair, i, all) => all.findIndex((other) => other.map((p) => p.mark).sort().join() === pair.map((p) => p.mark).sort().join()) === i).slice(0, 3)));
            const fits = (pair) => Math.abs(area(pair[0].pts) + area(pair[1].pts) - area(goal.pts)) < 1e-9 && pair.every((p) => p.kind === 'S');
            const halves = SPLIT[goal.kind].map((pts) => ({ pts: pts.map(turn) }));
            return C(`칠교판의 조각 2개를 붙여 ${goal.mark} 조각과 똑같은 도형을 만들려고 한다. 붙여야 할 두 조각은?`, pairs.map((pair) => pair.map((p) => p.mark).sort().join(', ')), pairs.findIndex(fits), {
              figure: tanArt(pieces, { u: 40, marks: true }),
              explain: `가장 작은 삼각형 조각 ${small.map((p) => p.mark).join(', ')}을 길이가 같은 변끼리 맞대면 ${goal.mark} 조각과 똑같은 도형이 된다.` + tanArt(halves, { u: 34, label: `${goal.mark} 조각을 작은 삼각형 2개로 나눈 그림` }),
              facts: { truth: pairs.map(fits), want: true }
            });
          })
        ]
      },
      { id: 'blocks', title: '쌓기나무로 똑같이 쌓기', standard: BLOCK, types: [] },
      { id: 'place', title: '쌓은 모양을 위치와 방향으로 말하기', standard: BLOCK, types: [] }
    ]
  });

  // 같은 단원의 다른 파일(2-1-2b.js)이 쓰는 도구
  B.kit.g212 = { TAGS, MARKS, KINDS, NAME, KIND, LOOKS, conditions, ones, listed, setOptions, shapesOf, mix, tally, why, reasons, gallery, saying, FACT, SAY, FORMS, formOf, formUnit, tanArt, tanCounts, centre };
})(typeof window !== 'undefined' ? window : globalThis);
