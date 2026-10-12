// 2학년 1학기 5단원 분류하기 — 단원 틀, 그림 도구, 기본 문항(분류 기준 알아보기, 정해진 기준에 따라 분류하기, 분류한 기준 찾기와 기준 정하기).
// 수집해 둔 국정 교과서 평가 자료에서 뽑은 문제 꼴 목록(기본꼴_1: 47꼴, 심화꼴: 38꼴)을 번호마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 뺌(까닭) / 미룸」을 가른 대조표는 references/textbooks/수학/_분석/2-1-5/싣기_대조표.md 에 있다.
// (분류하여 세어 보기·분류한 결과 말하기의 기본 문항과 실력 문항은 2-1-5b.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
//
// 영역: 자료와 가능성.
//   2수04-01 여러 가지 사물을 정해진 기준 또는 자신이 정한 기준으로 분류하여 개수를 세어 보고, 기준에 따른 결과를 말할 수 있다.
//   교육과정: 「기준을 정하여 분류할 때는 … 분명하지 않은 기준으로는 분류하기가 어렵다는 점을 인식하게 한다.」
//            「… 학생들의 수준에 비해 어려운 분류 대상이나 분류 기준을 사용하지 않는다.」
//
// 싣는 기준
//  - 분류할 대상은 눈으로 보아 갈리는 것만 쓴다: 단추(색깔·모양·구멍의 수), 색종이 조각(색깔·모양·크기), 컵(색깔·손잡이의 수),
//    옷(색깔·긴소매와 반소매·줄무늬), 색 카드, 동전과 지폐, 수 카드(자리 수, 20까지의 홀수와 짝수), 낱말로 적은 자료(과일·운동·주스).
//    동물의 갈래, 물건의 쓰임새, 탈것이 다니는 곳, 음식의 갈래처럼 수학 밖 지식으로 갈라야 하는 대상은 쓰지 않는다.
//  - 분명하지 않은 기준의 본보기는 「예쁜·멋진·좋아하는·마음에 드는·갖고 싶은」처럼 사람마다 다른 것만 쓴다.
//    「밝은 색과 어두운 색」「무거운 것과 가벼운 것」처럼 분명한지 애매한 말은 맞는 보기로도 틀린 보기로도 쓰지 않는다.
//  - 주는 것(섞어 놓은 그림, 묶어 놓은 그림, 번호로 적은 분류, 낱말 자료, 센 결과)과 묻는 것(기준, 한 갈래에 드는 것, 수, 바르게 분류한 것,
//    잘못 분류된 것)이 다르면 다른 문제다. 대상(단추·컵)만 다르고 하는 일이 같은 것은 한 번만 싣는다.
//  - 답으로 한글을 적게 하지 않는다. 기준·갈래·번호는 고르기로, 수는 숫자로 받는다. 기준을 스스로 정하는 열린 답은
//    「이 묶음을 분류할 수 있는 기준을 모두 고르면?」으로 바꾸어 실었다. 까닭을 쓰는 꼴은 까닭 고르기로 바꾸어 실었다.
//  - 그림: 대상은 줄 맞추어 섞어 놓는다(갈래별로 모아 놓지 않는다). 색은 빨강·파랑·노랑(네 갈래일 때만 초록까지)만 쓰고,
//    그림 설명(aria-label)과 풀이에 색 이름·모양·구멍의 수를 적는다. 고르는 문제에는 번호(①, ② …)나 기호(㉠, ㉡ …)를 붙인다.
//  - 참·거짓과 답은 손으로 적지 않고 그림을 만든 목록에서 다시 셈한다.
//
// 뺀 것과 까닭(단원 전체. 꼴마다의 판정은 대조표에 있다)
//  - 수학 밖 지식으로 가르는 대상: 쓰임새·다니는 곳(①14), 조류와 어류의 뜻풀이(①17), 음식을 면·밥·빵으로(①30), 다리가 없는 동물(심12), 악기(심20의 일부), 냉장고 칸(심21)
//  - 표만 읽는 꼴(①43): 분류 없이 완성된 표의 두 자리 수를 견주는 것은 2학년 2학기 「표와 그래프」다. 한 자리 수의 센 결과를 보고 판단하는 일은 실었다.
//  - 20을 넘는 수의 홀수·짝수(심14): 홀수와 짝수는 20까지의 수에서만 다룬다 → 20까지의 수 카드로 바꾸어 실었다.
//  - 기준 둘로 네 칸에 분류하기와 거기에 딸린 물음(심35·36), 조건 셋(심38): 교과서는 기준을 하나씩 쓴다. 조건 둘에 맞는 것을 한 번 세는 것(①45 심37)만 실력에 실었다.
//  - 놀이 규칙을 얹은 것: 가위바위보에서 이기는·지는 친구 수(①44), 주사위 눈의 수의 차(심34 — 물음이 「나온 횟수」와 「눈의 수」를 헷갈리게 한다)
//  - 뜻이 같은 것끼리 묶기(심16): 어려움이 분류가 아니라 수를 읽는 말(1학년)에서 온다.
//  - 같은 일: 숫자 카드와 글자 카드로 분류하기(심15)는 눈에 먼저 띄는 색깔 말고 다른 성질로 가르는 「두 갈래로 분류하기」와 하는 일이 같다.
//  - 미룬 것: 동물을 다리 수·날개로 분류하기(①15). 다리와 날개가 보이는 동물 그림이 있어야 한다. 하는 일은 구멍의 수·손잡이의 수로 가르는 문항과 같다.
//  - 서술형으로만 할 수 있는 것은 없다. 좋은 점 쓰기(①47)는 「센 결과만 보고 알 수 없는 것」 고르기로 바꾸어 실었다.
// 묻는 말: 기준·갈래·사람은 「~은?」, 수는 「몇 개인가?」, 세어 적는 것은 「~하시오.」. 풀이는 「~이다.」.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, NAMES, N, M, C, lines, tagged } = B.kit;
  const G = B.kit.geo;
  const STD = '2수04-01';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const CIRC = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩', '⑪', '⑫'];
  const MARKS = ['㉠', '㉡', '㉢', '㉣', '㉤', '㉥'], TAGS = ['가', '나', '다'];
  const zip = (n, make) => Array.from({ length: n }, (_, i) => make(i));
  // 값마다 정해진 수만큼 넣어 섞는다: deal(d, [['red', 3], ['blue', 5]])
  const deal = (d, pairs) => d.shuffle(pairs.reduce((all, pair) => all.concat(Array(pair[1]).fill(pair[0])), []));
  // 값들이 적어도 한 번씩 나오게 n개를 고른다.
  const mixOf = (d, n, values) => d.shuffle(zip(n, (i) => (i < values.length ? values[i] : d.pick(values))));
  // 번호·기호 뒤에 토씨를 붙인다: ③은, ④는, ㉠은, 가는
  function tj(tag, pair) {
    const i = CIRC.indexOf(tag), parts = pair.split('/');
    const batchim = i >= 0 ? josa(i + 1, '은/는').endsWith('은') : MARKS.includes(tag);
    return tag + (batchim ? parts[0] : parts[1]);
  }

  // ── 분류할 대상과 그 성질 ────────────────────────────────────
  const INK = '#1f2933', PEN = 'stroke:' + INK + ';stroke-width:1.4;stroke-linejoin:round;stroke-linecap:round';
  const COLOR = { red: { name: '빨간색', fill: '#f06a64' }, blue: { name: '파란색', fill: '#5b9bf5' }, yellow: { name: '노란색', fill: '#fbd43a' }, green: { name: '초록색', fill: '#4cc27a' } };
  const RBY = ['red', 'blue', 'yellow'], RBYG = ['red', 'blue', 'yellow', 'green'];
  const SHAPE = { round: '원', square: '사각형', circle: '원', triangle: '삼각형' }, FORMS = ['circle', 'triangle', 'square'];
  const NOUN = { button: '단추', piece: '색종이 조각', cup: '컵', shirt: '옷', card: '카드', coin: '돈', bill: '돈', ball: '구슬' };
  const SHORT = { button: '단추', piece: '조각', cup: '컵', shirt: '옷', card: '카드' };
  // 성질: name 기준의 이름, of(대상) 값, word(값) 갈래의 이름, thing(값, 대상 이름) 그 갈래에 드는 것을 가리키는 말
  const AX = {
    color: { name: '색깔', of: (t) => t.color, word: (v) => COLOR[v].name, thing: (v, noun) => COLOR[v].name + ' ' + noun },
    shape: { name: '모양', of: (t) => t.shape, word: (v) => SHAPE[v] + ' 모양', thing: (v, noun) => SHAPE[v] + ' 모양 ' + noun },
    holes: { name: '구멍의 수', of: (t) => t.holes, word: (v) => '구멍 ' + v + '개', thing: (v) => '구멍이 ' + v + '개인 단추' },
    size: { name: '크기', of: (t) => (t.big ? 'big' : 'small'), word: (v) => (v === 'big' ? '큰 것' : '작은 것'), thing: (v, noun) => (v === 'big' ? '큰 ' : '작은 ') + noun },
    handles: { name: '손잡이의 수', of: (t) => t.handles, word: (v) => (v ? '손잡이 ' + v + '개' : '손잡이 없음'), thing: (v) => (v ? '손잡이가 ' + v + '개인 컵' : '손잡이가 없는 컵') },
    sleeve: { name: '소매의 길이', of: (t) => t.sleeve, word: (v) => (v === 'long' ? '긴소매' : '반소매'), thing: (v) => (v === 'long' ? '긴소매 옷' : '반소매 옷') },
    stripe: { name: '무늬', of: (t) => (t.stripe ? 'yes' : 'no'), word: (v) => (v === 'yes' ? '줄무늬 있음' : '줄무늬 없음'), thing: (v) => (v === 'yes' ? '줄무늬가 있는 옷' : '줄무늬가 없는 옷') }
  };
  const valuesOf = (list, axis) => [...new Set(list.map(AX[axis].of))];
  const varies = (list, axis) => valuesOf(list, axis).length > 1;
  const countOf = (list, axis, value) => list.filter((t) => AX[axis].of(t) === value).length;
  // 갈래별 수를 적은 글: 빨간색 단추 5개, 파란색 단추 4개
  const tally = (list, axis, order) => order.map((v) => AX[axis].thing(v, SHORT[list[0].k]) + ' ' + countOf(list, axis, v) + '개').join(', ');
  // 묶음들이 그 성질로 갈라져 있는가: 묶음 안은 모두 같고 묶음끼리는 서로 다르다.
  const separates = (groups, axis) => groups.every((g) => !varies(g, axis)) && new Set(groups.map((g) => AX[axis].of(g[0]))).size === groups.length;
  const buttons = (colors, holes, shapes) => colors.map((color, i) => ({ k: 'button', color, holes: holes[i], shape: shapes ? shapes[i] : 'round' }));
  const pieces = (colors, shapes, bigs) => colors.map((color, i) => ({ k: 'piece', color, shape: shapes[i], big: bigs ? bigs[i] : true }));
  const cups = (colors, handles) => colors.map((color, i) => ({ k: 'cup', color, handles: handles[i] }));
  const shirts = (colors, sleeves, stripes) => colors.map((color, i) => ({ k: 'shirt', color, sleeve: sleeves[i], stripe: stripes ? Boolean(stripes[i]) : false }));
  // 그림 설명에 적는 말. sizes: 큰 것과 작은 것이 섞여 있을 때만 크기를 적는다.
  function describe(t, sizes) {
    if (t.k === 'button') return COLOR[t.color].name + ' ' + SHAPE[t.shape] + ' 모양 단추(구멍 ' + t.holes + '개)';
    if (t.k === 'piece') return COLOR[t.color].name + ' ' + (sizes ? (t.big ? '큰 ' : '작은 ') : '') + SHAPE[t.shape] + ' 모양 조각';
    if (t.k === 'cup') return COLOR[t.color].name + ' 컵(' + AX.handles.word(t.handles) + ')';
    if (t.k === 'shirt') return COLOR[t.color].name + ' ' + AX.sleeve.word(t.sleeve) + ' 옷(' + AX.stripe.word(AX.stripe.of(t)) + ')';
    if (t.k === 'card') return COLOR[t.color].name + ' 카드';
    if (t.k === 'coin') return t.won + '원짜리 동전';
    if (t.k === 'bill') return t.won + '원짜리 지폐';
    return COLOR[t.color].name + ' 구슬';
  }

  // ── 그림 ─────────────────────────────────────────────────────
  const r1 = (n) => Math.round(n * 10) / 10;
  const HOLES = { 2: [[-4.4, 0], [4.4, 0]], 3: [[0, -4.6], [-4.5, 3.6], [4.5, 3.6]], 4: [[-4.2, -4.2], [4.2, -4.2], [-4.2, 4.2], [4.2, 4.2]] };
  const word = (x, y, text, css) => '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="middle" style="' + css + '">' + text + '</text>';
  // 대상 하나를 (x, y)를 가운데로 그린다. 구멍·손잡이·소매·줄무늬는 작게 그려도 보이게 짙은 선으로 그린다.
  function draw(t, x, y) {
    const fill = t.color ? COLOR[t.color].fill : '#fff', paint = 'style="fill:' + fill + ';' + PEN + '"', rim = 'style="fill:none;stroke:rgba(31,41,51,0.3);stroke-width:1"';
    if (t.k === 'button') {
      const body = t.shape === 'square'
        ? '<rect x="' + r1(x - 14) + '" y="' + r1(y - 14) + '" width="28" height="28" rx="5" ' + paint + '/><rect x="' + r1(x - 10.5) + '" y="' + r1(y - 10.5) + '" width="21" height="21" rx="3.5" ' + rim + '/>'
        : '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="15" ' + paint + '/><circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="11.3" ' + rim + '/>';
      return body + HOLES[t.holes].map((h) => '<circle cx="' + r1(x + h[0]) + '" cy="' + r1(y + h[1]) + '" r="2.7" style="fill:#fff;stroke:' + INK + ';stroke-width:1.1"/>').join('');
    }
    if (t.k === 'piece') {
      const s = t.big ? 1 : 0.56;
      if (t.shape === 'circle') return '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + r1(14 * s) + '" ' + paint + '/>';
      if (t.shape === 'triangle') return '<polygon points="' + r1(x) + ',' + r1(y - 14 * s) + ' ' + r1(x + 15 * s) + ',' + r1(y + 12 * s) + ' ' + r1(x - 15 * s) + ',' + r1(y + 12 * s) + '" ' + paint + '/>';
      return '<rect x="' + r1(x - 12.5 * s) + '" y="' + r1(y - 12.5 * s) + '" width="' + r1(25 * s) + '" height="' + r1(25 * s) + '" ' + paint + '/>';
    }
    if (t.k === 'cup') {
      // 손잡이를 먼저 그리고 몸통으로 안쪽 반을 덮는다.
      const ring = (side) => '<ellipse cx="' + r1(x + side * 10.5) + '" cy="' + r1(y - 1) + '" rx="7" ry="7.5" style="fill:none;stroke:' + INK + ';stroke-width:3.2"/>';
      return (t.handles >= 1 ? ring(1) : '') + (t.handles >= 2 ? ring(-1) : '')
        + '<polygon points="' + r1(x - 11) + ',' + r1(y - 13) + ' ' + r1(x + 11) + ',' + r1(y - 13) + ' ' + r1(x + 8.5) + ',' + r1(y + 13) + ' ' + r1(x - 8.5) + ',' + r1(y + 13) + '" ' + paint + '/>'
        + '<path d="M' + r1(x - 10.4) + ' ' + r1(y - 8.5) + 'H' + r1(x + 10.4) + '" ' + rim + '/>';
    }
    if (t.k === 'shirt') {
      const side = t.sleeve === 'long' ? [[-9, -13], [-19.5, 8.5], [-14.8, 11.5], [-9, -1.5], [-9, 14], [9, 14], [9, -1.5], [14.8, 11.5], [19.5, 8.5], [9, -13]]
        : [[-9, -13], [-18, -5.5], [-14, -0.5], [-9, -4.5], [-9, 14], [9, 14], [9, -4.5], [14, -0.5], [18, -5.5], [9, -13]];
      const p = (q) => r1(x + q[0]) + ' ' + r1(y + q[1]);
      return '<path d="M' + p([-4, -13]) + 'L' + side.map(p).join('L') + 'L' + p([4, -13]) + 'Q' + p([0, -8]) + ' ' + p([-4, -13]) + 'Z" ' + paint + '/>'
        + (t.stripe ? [-5.5, -0.5, 4.5, 9.5].map((dy) => '<path d="M' + p([-8.3, dy]) + 'H' + r1(x + 8.3) + '" style="fill:none;stroke:' + INK + ';stroke-width:1.6;opacity:0.85"/>').join('') : '');
    }
    if (t.k === 'card') return '<rect x="' + r1(x - 10) + '" y="' + r1(y - 14) + '" width="20" height="28" rx="3" ' + paint + '/><rect x="' + r1(x - 6.5) + '" y="' + r1(y - 10.5) + '" width="13" height="21" rx="1.5" style="fill:none;stroke:rgba(255,255,255,0.85);stroke-width:1.3"/>';
    if (t.k === 'coin') {
      const r = { 10: 11, 100: 12.5, 500: 14 }[t.won];
      return '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + r + '" style="fill:' + (t.won === 10 ? '#eebf88' : '#e3e8ee') + ';' + PEN + '"/><circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + (r - 2.6) + '" ' + rim + '/>'
        + word(x, y + 3.6, t.won, 'font-size:10px;font-weight:700;fill:' + INK);
    }
    if (t.k === 'bill') return '<rect x="' + r1(x - 18) + '" y="' + r1(y - 10.5) + '" width="36" height="21" rx="2" style="fill:#cfead8;' + PEN + '"/><rect x="' + r1(x - 15.4) + '" y="' + r1(y - 7.9) + '" width="30.8" height="15.8" ' + rim + '/>'
      + word(x, y + 3.6, t.won, 'font-size:10px;font-weight:700;fill:' + INK);
    return '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + t.r + '" ' + paint + '/><ellipse cx="' + r1(x - t.r * 0.36) + '" cy="' + r1(y - t.r * 0.38) + '" rx="' + r1(t.r * 0.24) + '" ry="' + r1(t.r * 0.17) + '" style="fill:#fff;opacity:0.75"/>';
  }
  // 대상 여럿을 줄 맞추어 늘어놓은 그림. o: { per(한 줄에 놓는 수), cw(한 칸의 너비), tags(대상마다 붙이는 번호·기호), head(그림 설명의 머리말),
  //   sum(그림 설명에 덧붙이는 갈래별 수), label(그림 설명 전체를 바꾸어 적을 때) }
  function spread(list, o) {
    const opt = o || {}, n = list.length, per = opt.per || (n <= 6 ? n : n <= 8 ? 4 : n === 12 ? 6 : 5), cw = opt.cw || (per >= 6 ? 46 : per === 5 ? 52 : 50);
    const rh = 38 + (opt.tags ? 16 : 0), rows = Math.ceil(n / per), sizes = new Set(list.map((t) => t.big)).size > 1;
    let body = '';
    list.forEach((t, i) => {
      const cx = (i % per) * cw + cw / 2, top = Math.floor(i / per) * rh;
      body += draw(t, cx, top + 19);
      if (opt.tags) body += word(cx, top + 50, opt.tags[i], 'font-size:13px;font-weight:700;fill:#1d4ed8');
    });
    const width = Math.max(per * cw, 64), height = rows * rh + 2;
    const label = opt.label || (opt.head || NOUN[list[0].k] + ' ' + n + '개') + ': ' + list.map((t, i) => (opt.tags ? opt.tags[i] + ' ' : '') + describe(t, sizes)).join(', ') + (opt.sum ? '. ' + opt.sum : '');
    return '<svg class="mb-geo" viewBox="0 0 ' + width + ' ' + height + '" width="' + width + '" role="img" aria-label="' + label + '">' + body + '</svg>';
  }
  // 묶어 놓은 그림. groups: [{ cap(묶음의 이름), items, tags, label }], o: { per, cw }
  const boxes = (groups, o) => G.tiles(groups.map((g) => [g.cap, spread(g.items, { per: (o && o.per) || 2, cw: (o && o.cw) || (g.items[0].k === 'shirt' || g.items[0].k === 'cup' ? 44 : 40), tags: g.tags, head: g.cap + ' 묶음', label: g.label })]));
  // 낱말·수를 줄 맞추어 적은 것(한 줄에 per 개)
  const grid = (list, per) => '<div class="mb-numbers" style="display:grid;grid-template-columns:repeat(' + (per || 5) + ',auto);gap:6px 14px;justify-content:start">' + list.map((w) => '<span style="font-size:1.05rem">' + w + '</span>').join('') + '</div>';

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
  // 사람마다 달라 분명하지 않은 기준
  const SUBJ = [['예쁜', '예쁘지 않은'], ['멋진', '멋지지 않은'], ['좋아하는', '좋아하지 않는'], ['마음에 드는', '마음에 들지 않는'], ['갖고 싶은', '갖고 싶지 않은']];
  const subj = (p, noun) => `${p[0]} ${josa(noun, '과/와')} ${p[1]} ${noun}`;
  // 낱말 뒤에 붙는 토씨만: after('컵', '과/와') → '과'
  const after = (noun, pair) => josa(noun, pair).slice(noun.length);

  B.kit.g215 = { STD, CIRC, MARKS, TAGS, zip, deal, mixOf, tj, INK, PEN, COLOR, RBY, RBYG, SHAPE, FORMS, NOUN, SHORT, AX, valuesOf, varies, countOf, tally, separates, buttons, pieces, cups, shirts, describe, draw, spread, boxes, grid, setOptions, SUBJ, subj, after };

  // ── 단원 ─────────────────────────────────────────────────────
  B.addUnit({
    id: '2-1-5', grade: 2, semester: 1, no: 5, title: '분류하기', version: 1,
    groups: [
      { id: 'crit', title: '분류 기준 알아보기', standard: STD, types: [] },
      { id: 'sort', title: '정해진 기준에 따라 분류하기', standard: STD, types: [] },
      { id: 'find', title: '분류한 기준 찾기와 기준 정하기', standard: STD, types: [] },
      { id: 'count', title: '분류하여 세어 보기', standard: STD, types: [] },
      { id: 'tell', title: '분류한 결과 말하기', standard: STD, types: [] }
    ]
  });

  // ── 분류 기준 알아보기 ───────────────────────────────────────
  // 한 가지 성질만 두 가지로 갈리는 대상 여덟 개와, 그 성질을 말한 분명한 기준
  function plainSet(d, kind) {
    const a = d.int(3, 5), [x, y] = d.shuffle(RBY);
    if (kind === 'button') return { list: buttons(deal(d, [[x, a], [y, 8 - a]]), Array(8).fill(4)), good: `${COLOR[x].name} 단추와 ${COLOR[y].name} 단추` };
    if (kind === 'shirt') return { list: shirts(Array(8).fill(x), deal(d, [['long', a], ['short', 8 - a]])), good: '긴소매 옷과 반소매 옷' };
    return { list: cups(Array(8).fill(x), deal(d, [[1, a], [0, 8 - a]])), good: '손잡이가 있는 컵과 손잡이가 없는 컵' };
  }
  // 색깔 두 가지와 다른 성질 두 가지가 엇갈린 대상 여덟 개와, 분명한 기준 둘
  function crossSet(d, kind) {
    const [x, y] = d.shuffle(RBY), colors = deal(d, [[x, 4], [y, 4]]), halves = deal(d, [[0, 4], [1, 4]]), noun = NOUN[kind];
    const byColor = `${COLOR[x].name} ${josa(noun, '과/와')} ${COLOR[y].name} ${noun}`;
    if (kind === 'cup') return { list: cups(colors, halves), good: ['손잡이가 있는 컵과 손잡이가 없는 컵', byColor] };
    if (kind === 'shirt') return { list: shirts(colors, halves.map((h) => (h ? 'long' : 'short'))), good: ['긴소매 옷과 반소매 옷', byColor] };
    return { list: buttons(colors, halves.map((h) => (h ? 4 : 2))), good: ['구멍이 2개인 단추와 구멍이 4개인 단추', byColor] };
  }
  const WHY = [['꽃', '예쁜', '예쁘지 않은'], ['과일', '맛있는', '맛없는'], ['책', '재미있는', '재미없는'], ['모자', '멋진', '멋지지 않은'], ['장난감', '갖고 싶은', '갖고 싶지 않은']];
  B.addTypes('2-1-5', 'crit', [
    T('crit-right', '분류 기준으로 알맞은 것', '①1 심1', (d) => {
      const kind = d.pick(['button', 'shirt', 'cup']), noun = NOUN[kind], set = plainSet(d, kind);
      const rows = d.shuffle([[set.good, true]].concat(d.shuffle(SUBJ).slice(0, 3).map((p) => [subj(p, noun), false])));
      return C(`${josa(noun, '을/를')} 분류하려고 한다. 분류 기준으로 알맞은 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
        figure: spread(set.list), explain: `${josa(set.good, '은/는')} 누가 분류해도 결과가 같다. 나머지는 사람마다 결과가 다를 수 있다.`, facts: { truth: rows.map((r) => r[1]), want: true }
      });
    }),
    T('crit-all', '분류 기준으로 알맞은 것 모두 고르기', '①2 심1', (d) => {
      const kind = d.pick(['cup', 'shirt', 'button']), noun = NOUN[kind], set = crossSet(d, kind);
      const rows = d.shuffle(set.good.map((g) => [g, true]).concat(d.shuffle(SUBJ).slice(0, 2).map((p) => [subj(p, noun), false])));
      const marks = MARKS.slice(0, 4), flags = rows.map((r) => r[1]), made = setOptions(d, marks, flags);
      return C(`${josa(noun, '을/를')} 분류하려고 한다. 분류 기준으로 알맞은 것을 모두 고르면?`, made.options, made.answer, {
        figure: spread(set.list) + tagged(rows.map((r) => r[0]), marks),
        explain: `${marks.filter((_, i) => flags[i]).join(', ')}은 누가 분류해도 결과가 같다. ${marks.filter((_, i) => !flags[i]).join(', ')}은 사람마다 결과가 다를 수 있다.`,
        facts: { sets: { labels: marks, flags, options: made.sets } }
      });
    }),
    T('crit-wrong', '분류 기준으로 알맞지 않은 것', '①3', (d) => {
      const [x, y] = d.shuffle(RBY), forms = d.shuffle(FORMS), p = d.pick(SUBJ);
      const list = pieces(deal(d, [[x, 3], [y, 3]]), deal(d, [[forms[0], 3], [forms[1], 3]]), deal(d, [[true, 3], [false, 3]]));
      const rows = d.shuffle([['색깔', true], ['모양', true], ['크기', true], [`${p[0]} 것과 ${p[1]} 것`, false]]);
      return C('색종이 조각을 분류하려고 한다. 분류 기준으로 알맞지 않은 것은?', rows.map((r) => r[0]), rows.findIndex((r) => !r[1]), {
        figure: spread(list), explain: `색깔, 모양, 크기는 누가 분류해도 결과가 같다. ${p[0]} 것은 사람마다 다르다.`, facts: { truth: rows.map((r) => r[1]), want: false }
      });
    }),
    // 분명하지 않은 기준 하나(단추), 분명한 기준 하나(컵)
    T('crit-ok', '분류 기준이 알맞은지 가리기', '①4 심2', (d, n) => {
      const kind = ['button', 'cup'][n], noun = NOUN[kind], set = plainSet(d, kind), p = d.pick(SUBJ), ok = n === 1;
      const pair = ok ? ['손잡이가 있는 컵', '손잡이가 없는 컵'] : [`${p[0]} ${noun}`, `${p[1]} ${noun}`];
      return C(`${josa(noun, '을/를')} 「${pair[0]}」${after(noun, '과/와')} 「${pair[1]}」${after(noun, '으로/로')} 분류하려고 한다. 이 분류 기준은 알맞은가?`, ['알맞다', '알맞지 않다'], ok ? 0 : 1, {
        figure: spread(set.list),
        explain: ok ? '손잡이가 있는지 없는지는 누가 보아도 같다. 누가 분류해도 결과가 같으므로 알맞다.' : `${p[0]} ${noun}인지는 사람마다 생각이 다르다. 분류 기준은 누가 분류해도 결과가 같아야 한다.`,
        facts: { truth: [ok, !ok], want: true }
      });
    }, { count: 2 }),
    // 잘못 말한 사람(분명한 기준 둘과 분명하지 않은 기준 하나), 알맞게 말한 사람(분명한 기준 하나와 분명하지 않은 기준 둘)
    T('crit-who', '분류 기준을 말한 사람', '①5 심5', (d, n) => {
      const kind = ['button', 'cup'][n], noun = NOUN[kind], set = crossSet(d, kind), names = d.shuffle(NAMES).slice(0, 3);
      const one = d.pick([['색깔에 따라 분류한다.', '색깔은'], ['손잡이가 있는 컵과 없는 컵으로 분류한다.', '손잡이가 있는지 없는지는']]);
      const clear = n === 0 ? ['색깔에 따라 분류한다.', '구멍의 수에 따라 분류한다.'] : [one[0]];
      const vague = d.shuffle(SUBJ).slice(0, 3 - clear.length).map((p) => `${p[0]} ${josa(noun, '과/와')} ${p[1]} ${josa(noun, '으로/로')} 분류한다.`);
      const rows = d.shuffle(clear.map((s) => [s, true]).concat(vague.map((s) => [s, false])));
      return C(`${josa(noun, '을/를')} 분류하려고 한다. 분류 기준을 ${n === 0 ? '잘못' : '알맞게'} 말한 사람은?`, names, rows.findIndex((r) => r[1] === (n === 1)), {
        figure: spread(set.list) + lines(rows.map((r, i) => `${names[i]}: ${r[0]}`)),
        explain: n === 0 ? '색깔과 구멍의 수는 누가 보아도 같다. 나머지 한 사람의 기준은 사람마다 결과가 다를 수 있다.' : `${one[1]} 누가 보아도 같다. 나머지 두 사람의 기준은 사람마다 결과가 다를 수 있다.`,
        facts: { truth: rows.map((r) => r[1]), want: n === 1 }
      });
    }, { count: 2 }),
    T('crit-why', '분류 기준이 알맞지 않은 까닭', '①6 심3·4', (d) => {
      const [noun, a, b] = d.pick(WHY);
      const rows = d.shuffle([[`${a} ${josa(noun, '은/는')} 사람마다 다를 수 있다.`, true], ['누가 분류해도 결과가 같다.', false], [`${noun}의 수가 너무 많다.`, false], [`${noun}의 색깔이 여러 가지이다.`, false]]);
      return C(`${josa(noun, '을/를')} 「${a} ${noun}」${after(noun, '과/와')} 「${b} ${noun}」${after(noun, '으로/로')} 분류하려고 한다. 이 분류 기준이 알맞지 않은 까닭은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
        explain: `${a} ${noun}인지는 사람마다 생각이 다르다. 분류 기준은 누가 분류해도 결과가 같아야 한다.`, facts: { truth: rows.map((r) => r[1]), want: true }
      });
    }),
    // 세 성질 가운데 하나만 서로 다르다.
    T('crit-usable', '이 묶음을 분류할 수 있는 기준', '①7·9', (d) => {
      const axes = ['color', 'shape', 'holes'], vary = d.pick(axes), a = d.int(3, 5), [x, y] = d.shuffle(RBY), h = d.shuffle([2, 3, 4]), s = d.shuffle(['round', 'square']);
      const list = buttons(vary === 'color' ? deal(d, [[x, a], [y, 8 - a]]) : Array(8).fill(x), vary === 'holes' ? deal(d, [[h[0], a], [h[1], 8 - a]]) : Array(8).fill(h[0]), vary === 'shape' ? deal(d, [[s[0], a], [s[1], 8 - a]]) : Array(8).fill(s[0]));
      const say = {
        color: [`색깔은 모두 ${COLOR[x].name}이다.`, `색깔은 ${josa(COLOR[x].name, '과/와')} ${COLOR[y].name}이 있다.`],
        shape: [`모양은 모두 ${SHAPE[s[0]]} 모양이다.`, '모양은 원 모양과 사각형 모양이 있다.'],
        holes: [`구멍은 모두 ${h[0]}개이다.`, `구멍의 수는 ${Math.min(h[0], h[1])}개인 것과 ${Math.max(h[0], h[1])}개인 것이 있다.`]
      };
      return C('이 단추를 분류할 수 있는 기준은?', axes.map((ax) => AX[ax].name), axes.indexOf(vary), {
        figure: spread(list), explain: axes.filter((ax) => ax !== vary).map((ax) => say[ax][0]).join(' ') + ' ' + say[vary][1] + ' 서로 다른 것이 있어야 분류할 수 있다.',
        facts: { truth: axes.map((ax) => varies(list, ax)), want: true }
      });
    }),
    // 묻는 성질은 답이 되는 묶음에서만 두 가지가 섞여 있다. 다른 성질은 어느 묶음에나 섞여 있다.
    T('crit-set', '그 기준으로 분류할 수 있는 묶음', '①8 심6', (d) => {
      const axis = d.pick(['color', 'shape']), other = axis === 'color' ? 'shape' : 'color', at = d.int(0, 2), cs = d.shuffle(RBY), fs = d.shuffle(FORMS), vals = { color: cs, shape: fs };
      const sets = TAGS.map((_, i) => {
        const two = (ax) => deal(d, [[vals[ax][i], 2], [vals[ax][(i + 1) % 3], 2]]), asked = i === at ? two(axis) : Array(4).fill(vals[axis][i]), rest = two(other);
        return axis === 'color' ? pieces(asked, rest) : pieces(rest, asked);
      });
      const names = (i) => valuesOf(sets[i], axis).map(AX[axis].word), lone = [0, 1, 2].filter((i) => i !== at);
      return C(`${AX[axis].name}에 따라 분류할 수 있는 묶음은?`, TAGS, at, {
        figure: boxes(sets.map((items, i) => ({ cap: TAGS[i], items }))),
        explain: `${lone.map((i) => `${TAGS[i]}는 모두 ${names(i)[0]}`).join(', ')}이다. ${TAGS[at]}에는 ${josa(names(at)[0], '과/와')} ${josa(names(at)[1], '이/가')} 섞여 있어 ${AX[axis].name}에 따라 분류할 수 있다.`,
        facts: { truth: sets.map((items) => varies(items, axis)), want: true }
      });
    }),
    // 두 칸에 나누어 넣으려면 두 갈래로 갈리는 분명한 기준이어야 한다. 색깔은 세 가지라 세 칸이 있어야 한다.
    T('crit-bins', '칸의 수에 알맞은 분류 기준', '①10', (d) => {
      const kind = d.pick(['shirt', 'cup', 'button']), noun = NOUN[kind], cs = d.shuffle(RBY), colors = deal(d, cs.map((c) => [c, 3])), halves = deal(d, [[0, 4], [1, 5]]), ps = d.shuffle(SUBJ).slice(0, 2);
      const spec = {
        shirt: { list: () => shirts(colors, halves.map((h) => (h ? 'long' : 'short'))), lead: '옷을 서랍 두 칸에 분류하여 넣으려고 한다.', good: '긴소매 옷, 반소매 옷', why: '긴소매 옷과 반소매 옷으로 분류하면 두 칸에 넣을 수 있다. 색깔은 세 가지라 세 칸이 있어야 한다.' },
        cup: { list: () => cups(colors, halves), lead: '컵을 선반 두 칸에 분류하여 놓으려고 한다.', good: '손잡이가 있는 컵, 손잡이가 없는 컵', why: '손잡이가 있는 컵과 없는 컵으로 분류하면 두 칸에 놓을 수 있다. 색깔은 세 가지라 세 칸이 있어야 한다.' },
        button: { list: () => buttons(colors, halves.map((h) => (h ? 4 : 2))), lead: '단추를 상자 두 개에 분류하여 담으려고 한다.', good: '구멍이 2개인 단추, 구멍이 4개인 단추', why: '구멍이 2개인 단추와 4개인 단추로 분류하면 상자 두 개에 담을 수 있다. 색깔은 세 가지라 상자가 세 개 있어야 한다.' }
      }[kind];
      const rows = d.shuffle([[spec.good, true], [cs.map((c) => `${COLOR[c].name} ${noun}`).join(', '), false]].concat(ps.map((p) => [`${p[0]} ${noun}, ${p[1]} ${noun}`, false])));
      return C(`${spec.lead} 알맞은 분류 기준은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
        figure: spread(spec.list()), explain: `${spec.why} 나머지는 사람마다 결과가 다를 수 있다.`, facts: { truth: rows.map((r) => r[1]), want: true }
      });
    }),
    T('crit-kinds', '분류하면 생기는 갈래', '①11', (d) => {
      const SUBS = [[2, 3], [2, 4], [3, 4], [2, 3, 4]], at = d.int(0, 3), [x, y] = d.shuffle(RBY), list = buttons(deal(d, [[x, 4], [y, 4]]), mixOf(d, 8, SUBS[at]));
      const has = [2, 3, 4].filter((h) => countOf(list, 'holes', h) > 0), none = [2, 3, 4].filter((h) => !has.includes(h));
      return C('단추를 구멍의 수에 따라 분류하려고 한다. 이 단추에 있는 구멍의 수를 모두 쓴 것은?', SUBS.map((s) => s.map((h) => h + '개').join(', ')), at, {
        figure: spread(list), explain: none.length ? `구멍이 ${has[0]}개인 단추와 ${has[1]}개인 단추가 있다. 구멍이 ${none[0]}개인 단추는 없다.` : '구멍이 2개인 단추, 3개인 단추, 4개인 단추가 모두 있다.',
        facts: { truth: SUBS.map((s) => s.join() === has.join()), want: true }
      });
    }),
    T('crit-kinds-count', '분류하면 나누어지는 가짓수', '심9', (d) => {
      const k = d.int(2, 3), cs = d.shuffle(RBYG).slice(0, k), list = pieces(d.shuffle(zip(9, (i) => cs[i % k])), d.shuffle(zip(9, (i) => FORMS[i % 3]))), used = RBYG.filter((c) => countOf(list, 'color', c) > 0);
      return N('색종이 조각을 색깔에 따라 분류하면 몇 가지로 나누어지는가?', used.length, {
        unit: '가지', figure: spread(list), explain: `${used.map((c) => COLOR[c].name).join(', ')}의 ${used.length}가지로 나누어진다.`, facts: { count: RBYG.map((c) => used.includes(c)) }
      });
    })
  ]);

  // ── 정해진 기준에 따라 분류하기 ──────────────────────────────
  B.addTypes('2-1-5', 'sort', [
    // 눈에 먼저 띄는 색깔이 아니라 구멍의 수·소매의 길이로 가른다. 두 갈래의 수는 고르지 않다.
    T('sort-two', '두 갈래로 분류하기', '①12·16·31 심10·15', (d, n) => {
      const tags = CIRC.slice(0, n === 0 ? 8 : 7), size = tags.length, a = d.int(3, size - 3), colors = zip(size, () => d.pick(RBY));
      const target = n === 0 ? d.pick([2, 4]) : d.pick(['long', 'short']), axis = n === 0 ? 'holes' : 'sleeve';
      const list = n === 0 ? buttons(colors, deal(d, [[target, a], [6 - target, size - a]])) : shirts(colors, deal(d, [[target, a], [target === 'long' ? 'short' : 'long', size - a]]), zip(size, () => d.bool()));
      const flags = list.map((t) => AX[axis].of(t) === target), made = setOptions(d, tags, flags), phrase = AX[axis].thing(target);
      return C(`${josa(phrase, '을/를')} 모두 고르면?`, made.options, made.answer, {
        figure: spread(list, { tags }), explain: `${josa(phrase, '은/는')} ${tags.filter((_, i) => flags[i]).join(', ')}이다.`, facts: { sets: { labels: tags, flags, options: made.sets } }
      });
    }, { count: 2 }),
    // 한 개뿐인 갈래가 있을 수 있다.
    T('sort-three', '세 갈래로 분류하기', '①13·24 심11·22', (d) => {
      const tags = CIRC.slice(0, 9), c = d.shuffle(d.pick([[4, 3, 2], [4, 4, 1], [5, 2, 2], [3, 3, 3]])), target = d.pick(FORMS);
      const list = pieces(d.shuffle(zip(9, (i) => RBY[i % 3])), deal(d, FORMS.map((f, i) => [f, c[i]]))), flags = list.map((t) => t.shape === target), made = setOptions(d, tags, flags);
      return C(`색종이 조각을 모양에 따라 분류하려고 한다. ${SHAPE[target]} 모양 조각을 모두 고르면?`, made.options, made.answer, {
        figure: spread(list, { tags }), explain: `${SHAPE[target]} 모양 조각은 ${tags.filter((_, i) => flags[i]).join(', ')}이다. 색깔은 보지 않는다.`, facts: { sets: { labels: tags, flags, options: made.sets } }
      });
    }),
    T('sort-count', '한 갈래에 드는 것의 수', '①18', (d) => {
      const c = d.shuffle(d.pick([[2, 4, 3], [1, 5, 3], [2, 5, 2], [3, 4, 2]])), [x, y] = d.shuffle(RBY), target = d.pick([0, 1, 2]);
      const list = cups(zip(9, () => (d.bool() ? x : y)), deal(d, [[0, c[0]], [1, c[1]], [2, c[2]]])), phrase = AX.handles.thing(target);
      return N(`${josa(phrase, '은/는')} 몇 개인가?`, c[target], {
        unit: '개', figure: spread(list), explain: `${josa(phrase, '을/를')} 하나씩 표시하며 세면 ${c[target]}개이다.`, facts: { count: list.map((t) => t.handles === target) }
      });
    }),
    // 틀린 보기: 갈래의 이름을 바꾸어 붙인 것, 두 갈래에서 하나씩 바뀐 것, 하나를 다른 갈래에 넣은 것
    T('sort-right', '바르게 분류한 것', '①19', (d) => {
      const a = d.pick([2, 3, 3, 4]), list = buttons(zip(6, () => d.pick(RBY)), deal(d, [[2, a], [4, 6 - a]]));
      const two = MARKS.filter((_, i) => list[i].holes === 2), four = MARKS.filter((_, i) => list[i].holes === 4), inOrder = (marks) => MARKS.filter((m) => marks.includes(m));
      const p = d.pick(two), q = d.pick(four);
      const rows = d.shuffle([[two, four], [four, two], [inOrder(two.filter((m) => m !== p).concat([q])), inOrder(four.filter((m) => m !== q).concat([p]))],
        two.length > 2 || (two.length === 2 && d.bool()) ? [two.filter((m) => m !== p), inOrder(four.concat([p]))] : [inOrder(two.concat([q])), four.filter((m) => m !== q)]]);
      const right = (row) => row[0].join() === two.join() && row[1].join() === four.join();
      return C('단추를 구멍의 수에 따라 바르게 분류한 것은?', rows.map((row) => `구멍 2개: ${row[0].join(', ')} / 구멍 4개: ${row[1].join(', ')}`), rows.findIndex(right), {
        figure: spread(list, { tags: MARKS }), explain: `구멍이 2개인 단추는 ${two.join(', ')}이고, 구멍이 4개인 단추는 ${four.join(', ')}이다.`, facts: { truth: rows.map(right), want: true }
      });
    })
  ]);

  // ── 분류한 기준 찾기와 기준 정하기 ───────────────────────────
  B.addTypes('2-1-5', 'find', [
    // 묶음 안은 같고 묶음끼리는 다른 성질이 기준이다. 다른 성질은 묶음마다 섞여 있다.
    T('find-crit', '분류한 결과를 보고 기준 찾기', '①20·21 심17·19', (d, n) => {
      let groups, axes, axis;
      if (n === 0) {
        axes = ['color', 'shape', 'holes']; axis = d.pick(axes);
        const vals = { color: d.shuffle(RBY).slice(0, 2), shape: d.shuffle(['round', 'square']), holes: d.shuffle(d.pick([[2, 4], [2, 3], [3, 4]])) };
        const col = (ax, g) => (ax === axis ? Array(4).fill(vals[ax][g]) : deal(d, [[vals[ax][0], 2], [vals[ax][1], 2]]));
        groups = [0, 1].map((g) => buttons(col('color', g), col('holes', g), col('shape', g)));
      } else {
        axes = ['color', 'shape', 'size']; axis = d.pick(['color', 'shape']);
        const vals = { color: d.shuffle(RBY), shape: d.shuffle(FORMS) }, col = (ax, g) => (ax === axis ? Array(4).fill(vals[ax][g]) : mixOf(d, 4, vals[ax]));
        groups = [0, 1, 2].map((g) => pieces(col('color', g), col('shape', g), deal(d, [[true, 2], [false, 2]])));
      }
      const noun = NOUN[groups[0][0].k], rest = axes.filter((ax) => ax !== axis).map((ax) => AX[ax].name);
      return C(`${josa(noun, '을/를')} ${n === 0 ? '두' : '세'} 묶음으로 분류하였다. 분류 기준은?`, axes.map((ax) => AX[ax].name), axes.indexOf(axis), {
        figure: boxes(groups.map((items, g) => ({ cap: TAGS[g], items }))),
        explain: `${groups.map((items, g) => `${TAGS[g]}는 모두 ${AX[axis].word(AX[axis].of(items[0]))}`).join(', ')}이다. ${josa(rest[0], '과/와')} ${josa(rest[1], '은/는')} 묶음 안에 섞여 있다.`,
        facts: { truth: axes.map((ax) => separates(groups, ax)), want: true }
      });
    }, { count: 2 }),
    // 칸에 기준이 적혀 있다. 한 개만 다른 칸에 들어가 있다.
    T('find-wrong', '잘못 분류된 것', '①22 심20', (d) => {
      const kind = d.pick(['piece', 'shirt', 'button']), axis = { piece: 'shape', shirt: 'sleeve', button: 'holes' }[kind], vals = { piece: d.shuffle(FORMS).slice(0, 2), shirt: d.shuffle(['long', 'short']), button: d.shuffle([2, 4]) }[kind];
      const bad = d.int(0, 7), tags = CIRC.slice(0, 8), boxOf = (i) => (i < 4 ? 0 : 1), mine = zip(8, (i) => vals[i === bad ? 1 - boxOf(i) : boxOf(i)]), colors = zip(8, () => d.pick(RBY));
      const list = kind === 'piece' ? pieces(colors, mine) : kind === 'shirt' ? shirts(colors, mine, zip(8, () => d.bool())) : buttons(colors, mine);
      const same = d.pick([0, 1, 2, 3].map((j) => boxOf(bad) * 4 + j).filter((i) => i !== bad)), others = d.shuffle([0, 1, 2, 3].map((j) => (1 - boxOf(bad)) * 4 + j)).slice(0, 2);
      const shown = [bad, same].concat(others).sort((p, q) => p - q), wrong = (i) => AX[axis].of(list[i]) !== vals[boxOf(i)], home = AX[axis].of(list[bad]);
      return C(`${josa(NOUN[kind], '을/를')} ${AX[axis].name}에 따라 분류하였다. 잘못 분류된 것은?`, shown.map((i) => tags[i]), shown.indexOf(bad), {
        figure: boxes([0, 1].map((g) => ({ cap: AX[axis].word(vals[g]), items: list.slice(g * 4, g * 4 + 4), tags: tags.slice(g * 4, g * 4 + 4) }))),
        explain: `${tj(tags[bad], '은/는')} ${AX[axis].thing(home, SHORT[kind])}이다. 「${AX[axis].word(home)}」 칸에 넣어야 한다.`, facts: { truth: shown.map(wrong), want: true }
      });
    }),
    // 색깔·모양·크기가 한 번씩 엇갈린 여덟 조각. 묶어 놓지 않고 번호로만 적은 분류를 보고 기준을 찾는다.
    T('find-by', '번호로 적은 분류를 보고 기준 찾기', '①24', (d) => {
      const cs = d.shuffle(RBY), fs = d.shuffle(FORMS), tags = CIRC.slice(0, 8), axes = ['color', 'shape', 'size'], axis = d.pick(axes);
      const list = d.shuffle(zip(8, (i) => ({ k: 'piece', color: cs[i & 1], shape: fs[(i >> 1) & 1], big: Boolean(i & 4) })));
      const split = (ax) => [0, 1].map((g) => tags.filter((_, i) => (AX[ax].of(list[i]) === AX[ax].of(list[0])) === (g === 0)));
      const groups = split(axis), value = (g) => AX[axis].of(list[tags.indexOf(groups[g][0])]);
      return C('색종이 조각을 두 묶음으로 분류하여 번호를 썼다. 분류 기준은?', axes.map((ax) => AX[ax].name), axes.indexOf(axis), {
        figure: spread(list, { tags }) + lines(groups.map((g, i) => `${TAGS[i]}: ${g.join(', ')}`)),
        explain: `가는 모두 ${AX[axis].thing(value(0), '조각')}, 나는 모두 ${AX[axis].thing(value(1), '조각')}이다.`,
        facts: { truth: axes.map((ax) => split(ax)[0].join() === groups[0].join()), want: true }
      });
    }),
    // 세 성질 가운데 둘만 서로 다르다(기준을 스스로 정하는 열린 답을 고르기로 바꾼 것).
    T('own-all', '분류할 수 있는 기준 모두 고르기', '①9·24·25 심8·22·24', (d) => {
      const axes = ['color', 'sleeve', 'stripe'], fixed = d.pick(axes), [x, y] = d.shuffle(RBY), one = { sleeve: d.pick(['long', 'short']), stripe: d.bool() };
      const list = shirts(fixed === 'color' ? Array(8).fill(x) : deal(d, [[x, 4], [y, 4]]), fixed === 'sleeve' ? Array(8).fill(one.sleeve) : deal(d, [['long', 4], ['short', 4]]), fixed === 'stripe' ? Array(8).fill(one.stripe) : deal(d, [[true, 4], [false, 4]]));
      const labels = axes.map((ax) => AX[ax].name), flags = axes.map((ax) => varies(list, ax)), made = setOptions(d, labels, flags), open = labels.filter((_, i) => flags[i]);
      const shut = { color: `옷이 모두 ${COLOR[x].name}이라`, sleeve: `옷이 모두 ${AX.sleeve.word(one.sleeve)}라`, stripe: `옷이 모두 줄무늬가 ${one.stripe ? '있어' : '없어'}` }[fixed];
      return C('이 옷을 분류할 수 있는 기준을 모두 고르면?', made.options, made.answer, {
        figure: spread(list), explain: `${josa(open.join(', '), '은/는')} 서로 다른 것이 있어 분류할 수 있다. ${shut} ${josa(AX[fixed].name, '은/는')} 기준이 될 수 없다.`,
        facts: { sets: { labels, flags, options: made.sets } }
      });
    }),
    // 색깔로 분류한 수를 알려 주고, 같은 단추를 구멍의 수로 다시 분류하여 센다. 두 결과는 서로 다르다.
    T('own-again', '다른 기준으로 다시 분류하여 세기', '①26 심24', (d) => {
      const [x, y] = d.shuffle(RBY), [a, c] = d.pick([[7, 4], [7, 8], [5, 4], [5, 8], [8, 5], [8, 7], [4, 5], [4, 7]]), list = buttons(deal(d, [[x, a], [y, 12 - a]]), deal(d, [[2, c], [4, 12 - c]]));
      return M(`단추를 색깔에 따라 분류하면 ${COLOR[x].name} ${a}개, ${COLOR[y].name} ${12 - a}개이다. 같은 단추를 구멍의 수에 따라 분류하여 세어 보시오.`, [{ label: '구멍 2개', answer: c, unit: '개' }, { label: '구멍 4개', answer: 12 - c, unit: '개' }], {
        figure: spread(list, { per: 5, sum: tally(list, 'holes', [2, 4]) }), explain: `구멍의 수에 따라 다시 분류하면 ${tally(list, 'holes', [2, 4])}이다. 기준이 바뀌면 분류한 결과도 달라진다.`,
        facts: { tallyOf: { list: list.map((t) => t.holes), target: 2 }, calc: [[String(12 - c), 1]] }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
