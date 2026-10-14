// 6학년 2학기 5단원 원의 넓이 — 원의 넓이 어림하기, 원의 넓이 구하기(구하는 방법 포함), 여러 가지 원의 넓이의 기본 문항.
// 단원 틀과 그림 도구(B.kit.circle625), 싣는 기준, 뺀 것과 까닭은 6-2-5a.js 에 있다. 대조표는 수집본의 _분석/6-2-5/싣기_대조표.md.
//
// 이 파일의 싣는 기준(6-2-5a.js 에 적은 것 말고)
//  - 어림하기: 교과서의 세 가지 길을 모두 싣는다 — 원 안팎의 정사각형, 모눈 세기, 원 안팎의 정육각형. 모눈은 원의 중심을 모눈의 점 위에 놓고
//    「원 안에 완전히 들어가는 칸」과 「원의 둘레가 지나는 칸」을 좌표로 가려 칠한다(반지름 4 cm: 32칸·28칸, 5 cm: 60칸·28칸, 6 cm: 88칸·44칸).
//  - 구하는 방법: 원을 잘게 잘라 이어 붙인 그림은 조각을 실제로 엇갈리게 놓아 그린다. 가로는 원주의 반, 세로는 반지름이다.
//  - 여러 가지 원의 넓이: 기본에는 원의 반·4분의 1(두 단계)과, 식으로 길을 안내한 꼴(정사각형에서 원을 뺀 식의 빈칸, 고리의 넓이를 구하는 식 고르기)만 싣는다.
//    길을 스스로 세워 세 단계로 구하는 색칠한 부분의 넓이는 실력에 있다. 반원과 원의 4분의 1은 「원의 반·4분의 1」로만 풀고 부채꼴이라는 말은 쓰지 않는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { N, M, C, LABELS, lines, frac } = B.kit;
  const G = B.kit.geo;
  const K = B.kit.circle625;
  const { TAGS, THREE, h, P31, note, calc, dIn, nIn, ansD, okA, say, pickWord, orderChoice, tagged, RAD, px, on, TINT, BLUE, WHITE, CREAM, CLEAR, disk, poly, path, thin, dash, word, beside, dim, draw, squareOf, diamondOf, circleFig } = K;
  const FIND = '6수03-16';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const HALF = frac(1, 2);

  // ── 그림 ─────────────────────────────────────────────────────
  // 원과 그 안팎에 꼭 맞는 정사각형. 안쪽 정사각형의 두 대각선(점선)은 원의 지름이다.
  // o: { d: 지름 글(바깥 정사각형 아래에 적는다), r: 반지름 글(가운데에서 오른쪽 끝까지의 치수선으로 적는다), quad: 반지름을 한 변으로 하는 정사각형 하나를 칠한다 }
  function estFig(o) {
    const c = [3, 3], R = 2.1, sq = squareOf(c, R), dia = diamondOf(c, R), parts = [poly(sq, WHITE)];
    if (o.quad) parts.push(poly([[c[0], c[1] - R], [c[0] + R, c[1] - R], [c[0] + R, c[1]], c], TINT + ';stroke:none'), disk(c, R, CLEAR), poly(dia, CLEAR));
    else parts.push(disk(c, R), poly(dia, BLUE));
    parts.push(dash(dia[0], dia[2]), dash(dia[3], dia[1]), G.point(c));
    if (o.r) parts.push(dim([c[0], c[1] + R], sq[2], c, o.r, 0.4));
    if (o.d) parts.push(dim(sq[3], sq[2], c, o.d, 0.4));
    return draw(6, o.d || o.r ? 6.9 : 6, parts, o.label);
  }
  K.estFig = estFig;
  // 모눈 위의 원에서 원 안에 완전히 들어가는 칸(inside)과 원의 둘레가 지나는 칸(edge). 칸은 왼쪽 아래 구석의 좌표로 적는다(원의 중심이 0, 0).
  function cellsOf(r, quarter) {
    const inside = [], edge = [], sq = (v) => v * v;
    for (let x = quarter ? 0 : -r; x < r; x += 1) for (let y = quarter ? 0 : -r; y < r; y += 1) {
      const far = sq(Math.max(Math.abs(x), Math.abs(x + 1))) + sq(Math.max(Math.abs(y), Math.abs(y + 1))), near = sq(Math.min(Math.abs(x), Math.abs(x + 1))) + sq(Math.min(Math.abs(y), Math.abs(y + 1)));
      if (far <= r * r) inside.push([x, y]); else if (near < r * r) edge.push([x, y]);
    }
    return { inside, edge };
  }
  const rule = (p, q) => G.line(p, q, 'mb-gridline').replace('class="mb-gridline"', 'class="mb-gridline" style="stroke:#7c8da0"');
  // 모눈종이에 그린 원(quarter 이면 원의 4분의 1). 원 안에 완전히 들어가는 칸은 파란색, 원의 둘레가 지나는 칸은 노란색으로 칠한다.
  function gridFig(r, quarter) {
    const { inside, edge } = cellsOf(r, quarter), size = quarter ? r : r * 2, place = ([x, y]) => (quarter ? [x, r - 1 - y] : [x + r, r - 1 - y]);
    const cell = (xy, css) => { const [x, y] = place(xy); return poly([[x, y], [x + 1, y], [x + 1, y + 1], [x, y + 1]], css + ';stroke:none'); };
    const parts = inside.map((xy) => cell(xy, 'fill:rgba(96,165,250,0.5)')).concat(edge.map((xy) => cell(xy, 'fill:rgba(251,191,36,0.5)')));
    // 칠한 칸 위에 모눈 선을 다시 긋는다(칸을 세어야 하므로 선이 또렷해야 한다).
    for (let v = 0; v <= size; v += 1) parts.push(rule([v, 0], [v, size]), rule([0, v], [size, v]));
    parts.push(quarter ? path([['M', [0, r]], ['L', [r, r]], ['A', r, [0, 0], 0]], CLEAR) : disk([r, r], r, CLEAR));
    return G.board(size, size, parts, { grid: 'lines', scale: Math.min(1.05, 250 / (32 + size * 22)), label: `모눈종이에 그린 반지름 ${r} cm인 원${quarter ? '의 4분의 1' : ''}. 원 안에 완전히 들어가는 칸(파란색) ${inside.length}칸, 원의 둘레가 지나는 칸(노란색) ${edge.length}칸` });
  }
  // 원과 그 안팎에 꼭 맞는 정육각형. 두 정육각형을 원의 중심에서 꼭짓점으로 그은 선분으로 삼각형 6개씩으로 나눈다.
  // 원 안의 정육각형을 나눈 삼각형 하나는 파란색, 원 밖의 정육각형을 나눈 삼각형 하나는 노란색으로 칠한다.
  function hexEstFig() {
    const c = [3.2, 3.2], R = 2, Ro = R / Math.cos(30 * RAD), inner = [0, 60, 120, 180, 240, 300].map((a) => on(c, R, a)), outer = [0, 60, 120, 180, 240, 300].map((a) => on(c, Ro, a));
    return draw(6.4, 6.4, [poly(outer, WHITE), poly([c, outer[1], outer[2]], TINT + ';stroke:none'), poly([c, inner[4], inner[5]], BLUE + ';stroke:none'), poly(outer, CLEAR), disk(c, R, CLEAR), poly(inner, CLEAR)].concat(outer.map((p) => thin(c, p)), [G.point(c)]),
      '원 안에 꼭 맞는 정육각형과 원 밖에 꼭 맞는 정육각형. 두 정육각형은 원의 중심에서 꼭짓점으로 그은 선분으로 삼각형 6개씩으로 똑같이 나뉜다. 원 안쪽 삼각형 하나는 파란색, 원 바깥쪽 삼각형 하나는 노란색');
  }
  // 원을 똑같은 조각 n개로 잘라(왼쪽) 엇갈리게 이어 붙인 그림(오른쪽). 위쪽 반은 파란색, 아래쪽 반은 노란색 조각이다.
  // o: { wide: 이어 붙인 도형의 가로 글, tall: 세로 글, r: 원 아래에 적는 글 }
  function wedgeFig(o) {
    const n = 16, R = 1.45, c = [1.7, 1.9], th = 360 / n, chord = 2 * R * Math.sin((th / 2) * RAD), hgt = R * Math.cos((th / 2) * RAD), x0 = 4.45, top = c[1] - hgt / 2, bottom = top + hgt, parts = [];
    for (let i = 0; i < n; i += 1) parts.push(path([['M', c], ['L', on(c, R, i * th)], ['A', R, on(c, R, (i + 1) * th), 0]], i < n / 2 ? BLUE : TINT));
    for (let j = 0; j < n / 2; j += 1) {
      parts.push(path([['M', [x0 + (j + 0.5) * chord, bottom]], ['L', [x0 + j * chord, top]], ['A', R, [x0 + (j + 1) * chord, top], 1]], BLUE));
      parts.push(path([['M', [x0 + (j + 1) * chord, top]], ['L', [x0 + (j + 0.5) * chord, bottom]], ['A', R, [x0 + (j + 1.5) * chord, bottom], 0]], TINT));
    }
    parts.push(`<path d="M${px(3.4)} ${px(c[1])}h${14}m-5 -4l5 4l-5 4" style="fill:none;stroke:#1f2933;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round"/>`);
    const left = [x0 + chord / 4, bottom], right = [x0 + (n / 2 + 0.25) * chord, bottom], end = x0 + (n / 2 + 0.5) * chord;
    if (o.wide) parts.push(dim(left, right, [left[0], top], o.wide, 0.34));
    if (o.tall) parts.push(dim([end, top], [end, bottom], [x0, top], o.tall, 0.3));
    if (o.r) parts.push(word([c[0], c[1] + R + 0.42], o.r));
    return draw(end + 0.55 + (o.tall ? String(o.tall).length * 0.31 : 0), 4.3, parts, o.label, 1);
  }
  K.wedgeFig = wedgeFig;
  // 반원(지름이 아래에 놓인다). o: { r: 반지름 글, d: 지름 글, css: 칠 }
  function halfFig(o) {
    const R = 2.3, c = [2.8, 2.85], a = [c[0] - R, c[1]], b = [c[0] + R, c[1]], up = [c[0], c[1] - 1];
    return draw(5.6, 3.85, [path([['M', a], ['A', R, b, 1]], o.css || TINT), G.point(c), o.r ? dim(c, b, up, o.r, 0.34) : dim(a, b, up, o.d, 0.34)], o.label);
  }
  K.halfFig = halfFig;
  // 원의 4분의 1(두 반지름이 직각으로 만난다). o: { r: 반지름 글, css: 칠, tri: 두 반지름을 두 변으로 하는 직각삼각형을 흰색으로 그린다 }
  function quarterFig(o) {
    const R = 3.2, c = [0.9, 3.9], a = [c[0] + R, c[1]], b = [c[0], c[1] - R];
    return draw(5, 4.85, [path([['M', c], ['L', a], ['A', R, b, 0]], o.css || TINT), o.tri ? poly([c, a, b], WHITE) : '', G.squareMark(c, 0, 90), dim(c, a, b, o.r, 0.34)], o.label);
  }
  K.quarterFig = quarterFig;
  // 정사각형과 그 안에 꼭 맞는 원. 원 밖(정사각형 안)을 칠한다. side: 한 변의 길이 글
  function squareCircleFig(side, label) {
    const c = [3, 3], R = 2.2, sq = squareOf(c, R);
    return draw(6, 6.9, [poly(sq, TINT), disk(c, R, WHITE), dim(sq[3], sq[2], c, side, 0.4)], label);
  }
  K.squareCircleFig = squareCircleFig;
  // 중심이 같은 두 원 사이(고리)를 칠한 그림. 두 반지름의 비율대로 그린다.
  function ringFig(big, small, label) {
    const c = [3, 3], R = 2.4;
    return draw(6, 6, [disk(c, R, TINT), disk(c, (R * small) / big, WHITE), G.point(c)], label);
  }
  K.ringFig = ringFig;
  // 직사각형(가로 a, 세로 dia)의 양쪽에 반원을 붙이거나 잘라 낸 그림. 길이의 비율대로 그린다.
  // mode: 'ends'(붙인 두 반원만 칠한다), 'all'(운동장 모양 전체를 칠한다), 'line'(운동장 모양의 테두리), 'cut'(직사각형에서 반원 둘을 잘라 내고 남은 부분을 칠한다)
  function stadiumFig(a, dia, mode, unit, label, showWide) {
    const out = mode !== 'cut', k = Math.min((out ? 7.6 : 6.6) / (a + (out ? dia : 0)), 3.3 / dia), w = a * k, hh = dia * k, r = hh / 2, L = out ? 0.5 + r : 0.6, top = showWide === false ? 0.5 : 1.15, bot = top + hh;
    const tl = [L, top], tr = [L + w, top], br = [L + w, bot], bl = [L, bot], parts = [];
    if (mode === 'ends') parts.push(poly([tl, tr, br, bl], WHITE), path([['M', tl], ['A', r, bl, 0]], TINT), path([['M', tr], ['A', r, br, 1]], TINT));
    else if (mode === 'cut') parts.push(path([['M', tl], ['L', tr], ['A', r, br, 0], ['L', bl], ['A', r, tl, 0]], TINT), dash(tl, bl), dash(tr, br));
    else parts.push(path([['M', tl], ['L', tr], ['A', r, br, 1], ['L', bl], ['A', r, tl, 1]], mode === 'all' ? TINT : CREAM), dash(tl, bl), dash(tr, br));
    if (showWide !== false) parts.push(dim(tl, tr, bl, `${a} ${unit}`, 0.34));
    parts.push(out ? beside(tl, bl, `${dia} ${unit}`, [L + 5, top], 0.5, 0.2) : dim(tr, br, tl, `${dia} ${unit}`, 0.34));
    return draw(L + w + (out ? r + 0.5 : 0.75 + String(dia).length * 0.31 + 1.1), bot + 0.5, parts, label, 1);
  }
  K.stadiumFig = stadiumFig;

  // ── 원의 넓이 어림하기 ───────────────────────────────────────
  const HEX = [[12, 16], [15, 20], [21, 28], [24, 32], [27, 36], [30, 40], [45, 60]];
  B.addTypes('6-2-5', 'est', [
    T('est-squares', '원 안팎의 정사각형으로 넓이 어림하기', '①33 ②35 ③31 심31', (d, n) => {
      if (n === 0) {
        const dia = d.int(3, 12) * 2;
        return M(`지름이 ${dia} cm인 원의 안과 밖에 정사각형을 꼭 맞게 그렸다. 원 안의 정사각형의 넓이와 원 밖의 정사각형의 넓이는 각각 몇 cm²인가?`, [nIn('원 안', (dia * dia) / 2, 'cm²'), nIn('원 밖', dia * dia, 'cm²')], {
          figure: estFig({ d: `${dia} cm`, label: `지름이 ${dia} cm인 원과 그 안팎에 꼭 맞는 정사각형. 원 안의 정사각형의 두 대각선(점선)은 원의 지름이고, 원 밖의 정사각형의 한 변은 ${dia} cm` }),
          explain: `원 안의 정사각형은 두 대각선의 길이가 모두 ${dia} cm인 마름모로 볼 수 있으므로 넓이는 ${dia} × ${dia} ÷ 2 = ${(dia * dia) / 2}(cm²)이다. 원 밖의 정사각형은 한 변의 길이가 ${dia} cm이므로 ${dia} × ${dia} = ${dia * dia}(cm²)이다.`,
          facts: { calc: [[`${dia}*${dia}/2`, 0], [`${dia}*${dia}`, 1]], unseen: [2] }
        });
      }
      const r = d.int(3, 12), dia = r * 2;
      return M(`반지름이 ${r} cm인 원의 안과 밖에 정사각형을 꼭 맞게 그렸다. 원의 넓이는 원 안의 정사각형의 넓이 ㉠ cm²보다 넓고, 원 밖의 정사각형의 넓이 ㉡ cm²보다 좁다. ㉠, ㉡에 알맞은 수는?`, [nIn('㉠', (dia * dia) / 2), nIn('㉡', dia * dia)], {
        figure: estFig({ r: `${r} cm`, label: `반지름이 ${r} cm인 원과 그 안팎에 꼭 맞는 정사각형. 원 안의 정사각형의 두 대각선(점선)은 원의 지름이다` }),
        explain: `원의 지름은 ${r} × 2 = ${dia}(cm)이다. 원 안의 정사각형은 두 대각선의 길이가 ${dia} cm이므로 ${dia} × ${dia} ÷ 2 = ${(dia * dia) / 2}(cm²), 원 밖의 정사각형은 한 변의 길이가 ${dia} cm이므로 ${dia} × ${dia} = ${dia * dia}(cm²)이다.`,
        facts: { calc: [[`${r}*2*${r}*2/2`, 0], [`${r}*2*${r}*2`, 1]], unseen: [2] }
      });
    }, { count: 2 }),
    T('est-sign', '원과 원 안팎의 정사각형의 넓이 비교', '①33 ②34 ③31', (d) => {
      const options = d.shuffle(['&lt;, &lt;', '&lt;, &gt;', '&gt;, &lt;', '&gt;, &gt;']);
      return C('원의 안과 밖에 정사각형을 꼭 맞게 그렸다. 넓이를 비교할 때 ㉠, ㉡에 알맞은 기호를 차례로 나타낸 것은?', options, options.indexOf('&lt;, &lt;'), {
        figure: estFig({ label: '원과 그 안팎에 꼭 맞는 정사각형' }) + lines(['(원 안의 정사각형의 넓이) ㉠ (원의 넓이)', '(원의 넓이) ㉡ (원 밖의 정사각형의 넓이)']),
        explain: '원 안의 정사각형은 원에 다 들어가므로 원보다 좁고, 원은 원 밖의 정사각형에 다 들어가므로 원 밖의 정사각형보다 좁다.', facts: { truth: options.map((o) => o === '&lt;, &lt;'), want: true }
      });
    }),
    T('est-times', '원의 넓이는 (반지름) × (반지름)의 몇 배쯤인가', '①34 ②35', () => M('원의 안과 밖에 정사각형을 꼭 맞게 그리고, 반지름을 한 변으로 하는 정사각형 하나를 색칠하였다. 원 안의 정사각형의 넓이는 색칠한 정사각형의 넓이의 ㉠배이고, 원 밖의 정사각형의 넓이는 색칠한 정사각형의 넓이의 ㉡배이다. ㉠, ㉡에 알맞은 수는?', [nIn('㉠', 2), nIn('㉡', 4)], {
      figure: estFig({ quad: true, label: '원과 그 안팎에 꼭 맞는 정사각형. 점선 2개가 원 밖의 정사각형을 반지름을 한 변으로 하는 정사각형 4개로 나누고, 그 가운데 하나를 색칠했다. 원 안의 정사각형은 색칠한 정사각형의 반과 같은 삼각형 4개로 이루어진다' }),
      explain: '원 밖의 정사각형은 색칠한 정사각형 4개로 이루어진다. 원 안의 정사각형은 색칠한 정사각형의 반인 삼각형 4개로 이루어지므로 색칠한 정사각형 2개와 넓이가 같다. 그러므로 원의 넓이는 (반지름) × (반지름)의 2배보다 넓고 4배보다 좁다.',
      facts: { calc: [['4/2', 0], ['4', 1]], unseen: [2] }
    })),
    T('est-grid', '모눈을 세어 원의 넓이 어림하기', '①35 ②36 ③32 심34', (d, n) => {
      const r = n === 0 ? d.pick([4, 5]) : d.pick([5, 6]), { inside, edge } = cellsOf(r, n === 1), a = inside.length, b = edge.length;
      if (n === 0) return M(`모눈 한 칸의 넓이는 1 cm²이다. 반지름이 ${r} cm인 원을 모눈종이에 그리고, 원 안에 완전히 들어가는 칸은 파란색으로, 원의 둘레가 지나는 칸은 노란색으로 칠하였다. 원의 넓이는 ㉠ cm²보다 넓고 ㉡ cm²보다 좁다. ㉠, ㉡에 알맞은 수는?`, [nIn('㉠', a), nIn('㉡', a + b)], {
        figure: gridFig(r, false), explain: `파란색 칸은 ${a}칸이므로 원의 넓이는 ${a} cm²보다 넓다. 노란색 칸까지 더하면 ${a} + ${b} = ${a + b}(칸)이므로 원의 넓이는 ${a + b} cm²보다 좁다. 원을 4등분하여 한 부분만 센 다음 4배 하면 쉽게 셀 수 있다.`,
        facts: { calc: [[String(a), 0], [`${a}+${b}`, 1]] }
      });
      return M(`모눈 한 칸의 넓이는 1 cm²이다. 반지름이 ${r} cm인 원을 똑같이 4조각으로 나눈 것 가운데 한 조각을 모눈종이에 그리고, 조각 안에 완전히 들어가는 칸은 파란색으로, 원의 둘레가 지나는 칸은 노란색으로 칠하였다. 원 전체의 넓이는 ㉠ cm²보다 넓고 ㉡ cm²보다 좁다. ㉠, ㉡에 알맞은 수는?`, [nIn('㉠', a * 4), nIn('㉡', (a + b) * 4)], {
        figure: gridFig(r, true), explain: `한 조각에서 파란색 칸은 ${a}칸, 노란색 칸까지 더하면 ${a} + ${b} = ${a + b}(칸)이다. 원 전체는 이것의 4배이므로 ${a} × 4 = ${a * 4}(cm²)보다 넓고 ${a + b} × 4 = ${(a + b) * 4}(cm²)보다 좁다.`,
        facts: { calc: [[`${a}*4`, 0], [`(${a}+${b})*4`, 1]] }
      });
    }, { count: 2 }),
    T('est-hex', '원 안팎의 정육각형으로 넓이 어림하기', '①36 ②37 ③33 심32', (d) => {
      const [a, b] = d.pick(HEX);
      return M(`원의 안과 밖에 정육각형을 꼭 맞게 그렸다. 원 안의 정육각형을 똑같이 나눈 삼각형 한 개(파란색)의 넓이는 ${a} cm², 원 밖의 정육각형을 똑같이 나눈 삼각형 한 개(노란색)의 넓이는 ${b} cm²이다. 원의 넓이는 ㉠ cm²보다 넓고 ㉡ cm²보다 좁다. ㉠, ㉡에 알맞은 수는?`, [nIn('㉠', a * 6), nIn('㉡', b * 6)], {
        figure: hexEstFig(), explain: `정육각형은 똑같은 삼각형 6개로 나뉜다. 원 안의 정육각형의 넓이는 ${a} × 6 = ${a * 6}(cm²), 원 밖의 정육각형의 넓이는 ${b} × 6 = ${b * 6}(cm²)이다. 원의 넓이는 그 사이에 있다.`,
        facts: { calc: [[`${a}*6`, 0], [`${b}*6`, 1]] }
      });
    }),
    T('est-pick', '어림한 원의 넓이 고르기', '①37 ③33·34 심33', (d) => {
      // 원 안의 정사각형(반지름 × 반지름의 2배)과 원 밖의 정사각형(4배) 사이에 있는 값은 하나뿐이다.
      const r = d.int(3, 9), q = r * r, list = d.shuffle([q, q * 3, q * 5, q * 6]);
      return C(`반지름이 ${r} cm인 원의 안과 밖에 정사각형을 꼭 맞게 그려서 원의 넓이를 어림하려고 한다. 원의 넓이를 알맞게 어림한 것은?`, list.map((v) => `약 ${v} cm²`), list.indexOf(q * 3), {
        explain: `원 안의 정사각형의 넓이는 ${r * 2} × ${r * 2} ÷ 2 = ${q * 2}(cm²), 원 밖의 정사각형의 넓이는 ${r * 2} × ${r * 2} = ${q * 4}(cm²)이다. 원의 넓이는 ${q * 2} cm²보다 넓고 ${q * 4} cm²보다 좁으므로 약 ${q * 3} cm²가 알맞다.`,
        facts: { between: { low: `${r}*2*${r}*2/2`, high: `${r}*2*${r}*2`, exprs: list.map(String) } }
      });
    })
  ]);

  // ── 원의 넓이 구하기 ─────────────────────────────────────────
  B.addTypes('6-2-5', 'area', [
    T('way-shape', '원을 잘게 잘라 이어 붙인 도형', '①38 ②39 ③35 심35', (d) => pickWord(d, '원을 똑같은 조각으로 잘라 엇갈리게 이어 붙였다. 조각을 한없이 잘게 자를수록 이어 붙인 도형은 어떤 도형에 가까워지는가?', '직사각형', ['정삼각형', '마름모', '사다리꼴'],
      '조각을 잘게 자를수록 굽은 부분이 곧게 펴져서 이어 붙인 도형은 직사각형에 가까워진다.', wedgeFig({ label: '원을 똑같은 조각 16개로 잘라 엇갈리게 이어 붙인 그림' }))),
    T('way-sides', '이어 붙인 직사각형의 가로와 세로', '①38 ②39 ③35', (d) => pickWord(d, '원을 한없이 잘게 잘라 이어 붙여 직사각형을 만들었다. 이 직사각형의 가로 ㉠과 세로 ㉡은 각각 원의 무엇과 같은가?', '㉠ 원주의 반, ㉡ 반지름', ['㉠ 원주, ㉡ 반지름', '㉠ 원주의 반, ㉡ 지름', '㉠ 원주, ㉡ 지름'],
      '조각의 굽은 부분이 위와 아래에 반씩 놓이므로 가로는 원주의 반이고, 세로는 조각의 곧은 변인 원의 반지름이다.', wedgeFig({ wide: '㉠', tall: '㉡', label: '원을 똑같은 조각 16개로 잘라 엇갈리게 이어 붙인 그림. 이어 붙인 도형의 가로는 ㉠, 세로는 ㉡' }))),
    T('way-len', '이어 붙인 직사각형의 가로·세로와 넓이', '①39 ②40 ③37 심35', (d) => {
      const r = d.until(() => d.int(2, 15), okA);
      return M(note(`반지름이 ${r} cm인 원을 한없이 잘게 잘라 이어 붙여 직사각형을 만들었다. 이 직사각형의 가로와 세로, 넓이를 차례로 구하시오.`), [dIn('가로', r * 314, 'cm'), nIn('세로', r, 'cm'), dIn('넓이', r * r * 314, 'cm²')], {
        figure: wedgeFig({ r: `반지름 ${r} cm`, label: `반지름이 ${r} cm인 원을 똑같은 조각 16개로 잘라 엇갈리게 이어 붙인 그림` }),
        explain: `가로는 원주의 반이므로 ${r} × 2 × 3.14 ÷ 2 = ${h(r * 314)}(cm)이고, 세로는 반지름과 같은 ${r} cm이다. 넓이는 ${h(r * 314)} × ${r} = ${h(r * r * 314)}(cm²)이고, 이것이 원의 넓이이다.`,
        facts: { calc: [[`${r}*2*3.14/2`, 0], [String(r), 1], [`${r}*2*3.14/2*${r}`, 2]], unseen: [2] }
      });
    }),
    T('way-formula', '원의 넓이를 구하는 식이 나오는 과정', '①40 ②41 ③36', (d) => pickWord(d, '원의 넓이를 구하는 식이 나오는 과정이다. ㉠, ㉡에 알맞은 말을 차례로 나타낸 것은?', '지름, 반지름', ['반지름, 지름', '지름, 지름', '반지름, 원주'],
      `(원주) = (원주율) × (지름)이므로 ㉠은 지름이다. (지름) × ${HALF} = (반지름)이므로 (원의 넓이) = (원주율) × (반지름) × (반지름)이고 ㉡은 반지름이다.`,
      lines([`(원의 넓이) = (원주) × ${HALF} × (반지름)`, `= (원주율) × ( ㉠ ) × ${HALF} × (반지름)`, '= (원주율) × ( ㉡ ) × (반지름)']))),
    T('way-not', '원의 넓이를 구하는 방법이 아닌 것', '①41', (d) => say(d, '원의 넓이를 구하는 방법으로 알맞지 않은 것은?',
      [`(원주) × ${HALF} × (반지름)`, '(반지름) × (반지름) × (원주율)', `(원주율) × (지름) × ${HALF} × (반지름)`], ['(원주율) × (지름)', '(반지름) × 2 × (원주율)', '(지름) × (지름) × (원주율)'], false,
      `원의 넓이는 (원주) × ${HALF} × (반지름) = (원주율) × (지름) × ${HALF} × (반지름) = (반지름) × (반지름) × (원주율)이다. (원주율) × (지름)과 (반지름) × 2 × (원주율)은 원주를 구하는 식이다.`)),
    T('area-expr', '원의 넓이를 구하는 식 고르기', '①41·42 ③39', (d) => {
      const r = d.until(() => d.int(3, 12), (v) => v !== 10);
      return pickWord(d, note(`반지름이 ${r} cm인 원의 넓이를 구하는 식으로 알맞은 것은?`), `${r} × ${r} × 3.14`, [`${r} × 2 × 3.14`, `${r * 2} × ${r * 2} × 3.14`, `${r} × 3.14`], `원의 넓이는 (반지름) × (반지름) × (원주율)이다. ${r} × ${r} × 3.14 = ${h(r * r * 314)}(cm²)`);
    }),
    T('area-r', '반지름으로 원의 넓이 구하기', '①42 ②42 ③39 심36', (d, n) => {
      if (n === 2) {
        const r = d.until(() => d.int(3, 13), (v) => v !== 10);
        return ansD(note(`반지름이 ${r} m인 원 모양 꽃밭의 넓이는 몇 m²인가?`, P31), r * r * 310, { unit: 'm²', explain: `원의 넓이는 (반지름) × (반지름) × (원주율)이다. ${r} × ${r} × 3.1 = ${h(r * r * 310)}(m²)`, facts: calc(`${r}*${r}*3.1`) });
      }
      // 그림 문항과 컴퍼스 문항의 수가 겹치지 않게 반지름의 범위를 달리한다.
      const r = n === 0 ? d.until(() => d.int(6, 15), okA) : d.int(2, 9);
      if (n === 0) return ansD(note('원의 반지름이 그림과 같을 때, 원의 넓이는 몇 cm²인가?'), r * r * 314, {
        unit: 'cm²', figure: circleFig({ r: `${r} cm`, deg: d.pick([0, 25, 155]), label: `원의 중심과 원 위의 한 점을 이은 반지름 ${r} cm` }), explain: `원의 넓이는 (반지름) × (반지름) × (원주율)이다. ${r} × ${r} × 3.14 = ${h(r * r * 314)}(cm²)`, facts: calc(`${r}*${r}*3.14`)
      });
      return ansD(note(`컴퍼스를 ${r} cm만큼 벌려서 원을 그렸다. 그린 원의 넓이는 몇 cm²인가?`), r * r * 314, { unit: 'cm²', explain: `컴퍼스를 벌린 길이가 원의 반지름이다. ${r} × ${r} × 3.14 = ${h(r * r * 314)}(cm²)`, facts: calc(`${r}*${r}*3.14`) });
    }, { count: 3 }),
    T('area-d', '지름으로 원의 넓이 구하기', '①43 ②43 ③40 심36', (d) => {
      const r = d.until(() => d.int(3, 17), okA), dia = r * 2;
      return ansD(note(`지름이 ${dia} cm인 원 모양 접시의 넓이는 몇 cm²인가?`), r * r * 314, { unit: 'cm²', explain: `반지름은 ${dia} ÷ 2 = ${r}(cm)이다. ${r} × ${r} × 3.14 = ${h(r * r * 314)}(cm²)`, facts: calc(`${dia}/2*${dia}/2*3.14`, [2]) });
    }),
    T('area-compare', '반지름·지름·넓이로 적힌 원의 넓이 비교', '①44 ②48 ③45 심41', (d, n) => {
      // 세 원의 반지름은 서로 다르고 몰려 있다. 지름으로 적힌 원은 적힌 수가 가장 크지만 가장 넓은 원이 아닐 수 있다.
      const [a, b, c] = d.until(() => [d.int(4, 12), d.int(4, 12), d.int(4, 12)], ([x, y, z]) => new Set([x, y, z]).size === 3 && Math.max(x, y, z) - Math.min(x, y, z) <= 3 && okA(z));
      const rows = [[`반지름이 ${a} cm인 원`, a, `${a}*${a}*3.14`], [`지름이 ${b * 2} cm인 원`, b, `${b * 2}/2*${b * 2}/2*3.14`], [`넓이가 ${h(c * c * 314)} cm²인 원`, c, h(c * c * 314)]], shown = d.shuffle(rows);
      const how = `넓이로 비교한다. 반지름이 ${a} cm인 원의 넓이는 ${a} × ${a} × 3.14 = ${h(a * a * 314)}(cm²), 지름이 ${b * 2} cm인 원은 반지름이 ${b} cm이므로 ${b} × ${b} × 3.14 = ${h(b * b * 314)}(cm²)이다.`;
      if (n === 0) return C(note('가장 넓은 원은?'), shown.map((r) => r[0]), shown.findIndex((r) => r[1] === Math.max(a, b, c)), { explain: `${how} 세 넓이 가운데 가장 큰 것은 ${h(Math.max(a, b, c) * Math.max(a, b, c) * 314)} cm²이다.`, facts: { choose: { exprs: shown.map((r) => r[2]), rule: 'max' }, unseen: [2] } });
      const made = orderChoice(d, shown.map((r) => r[1]), false);
      return C(note('넓이가 좁은 원부터 차례로 나열한 것은?'), made.options, made.answer, {
        figure: tagged(shown.map((r) => r[0]), THREE), explain: `${how} 좁은 원부터 차례로 쓰면 ${made.right.map((i) => THREE[i]).join(', ')}이다.`,
        facts: { choose: { exprs: shown.map((r) => r[2]), rule: 'ascending', orders: made.list }, unseen: [2] }
      });
    }, { count: 2 })
  ]);

  // ── 여러 가지 원의 넓이 ──────────────────────────────────────
  B.addTypes('6-2-5', 'mix', [
    T('mix-half', '반원의 넓이', '①52 ②54 ③59 심50', (d, n) => {
      const r = d.until(() => (n === 0 ? d.int(2, 9) : d.int(11, 18)), (v) => v % 10 !== 0);
      if (n === 0) return ansD(note('원을 반으로 자른 모양이다. 반지름이 그림과 같을 때, 이 도형의 넓이는 몇 cm²인가?'), r * r * 157, {
        unit: 'cm²', figure: halfFig({ r: `${r} cm`, label: `반지름이 ${r} cm인 원을 반으로 자른 모양` }), explain: `반지름이 ${r} cm인 원의 넓이의 반이다. ${r} × ${r} × 3.14 ÷ 2 = ${h(r * r * 157)}(cm²)`, facts: calc(`${r}*${r}*3.14/2`, [2])
      });
      return ansD(note(`지름이 ${r * 2} cm인 원 모양 종이를 반으로 접었다. 접은 모양의 넓이는 몇 cm²인가?`), r * r * 157, {
        unit: 'cm²', explain: `종이의 반지름은 ${r * 2} ÷ 2 = ${r}(cm)이므로 넓이는 ${r} × ${r} × 3.14 = ${h(r * r * 314)}(cm²)이다. 반으로 접은 모양의 넓이는 ${h(r * r * 314)} ÷ 2 = ${h(r * r * 157)}(cm²)이다.`,
        facts: calc(`${r * 2}/2*${r * 2}/2*3.14/2`, [2])
      });
    }, { count: 2 }),
    T('mix-quarter', '원의 4분의 1의 넓이', '①53 ②54 ③59 심50', (d, n) => {
      const q = d.until(() => d.int(2, 9), (v) => v !== 10 && (n === 0 || v >= 3)), r = q * 2;
      if (n === 0) return ansD(note('원을 똑같이 4조각으로 나눈 것 가운데 한 조각이다. 반지름이 그림과 같을 때, 이 조각의 넓이는 몇 cm²인가?'), q * q * 314, {
        unit: 'cm²', figure: quarterFig({ r: `${r} cm`, label: `반지름이 ${r} cm인 원을 똑같이 4조각으로 나눈 것 가운데 한 조각. 두 반지름은 직각으로 만난다` }),
        explain: `반지름이 ${r} cm인 원의 넓이를 4로 나눈다. ${r} × ${r} × 3.14 ÷ 4 = ${h(q * q * 314)}(cm²)`, facts: calc(`${r}*${r}*3.14/4`)
      });
      return ansD(note(`지름이 ${r * 2} cm인 원 모양 피자를 똑같이 4조각으로 나누었다. 피자 한 조각의 넓이는 몇 cm²인가?`), q * q * 314, {
        unit: 'cm²', explain: `피자의 반지름은 ${r * 2} ÷ 2 = ${r}(cm)이므로 넓이는 ${r} × ${r} × 3.14 = ${h(r * r * 314)}(cm²)이다. 한 조각의 넓이는 ${h(r * r * 314)} ÷ 4 = ${h(q * q * 314)}(cm²)이다.`,
        facts: calc(`${r * 2}/2*${r * 2}/2*3.14/4`, [2])
      });
    }, { count: 2 }),
    T('mix-two-halves', '두 반원을 모아 원 하나로 구하기', '①56 ②54 ③55 심61', (d) => {
      const r = d.until(() => d.int(3, 9), okA), dia = r * 2, a = dia + d.int(2, 8);
      return ansD(note(`직사각형의 양쪽에 지름이 ${dia} cm인 반원을 한 개씩 붙였다. 색칠한 두 반원의 넓이의 합은 몇 cm²인가?`), r * r * 314, {
        unit: 'cm²', figure: K.stadiumFig(a, dia, 'ends', 'cm', `직사각형의 왼쪽과 오른쪽에 반원을 한 개씩 붙인 모양. 두 반원을 색칠했다. 직사각형의 세로(반원의 지름)는 ${dia} cm`, false),
        explain: `두 반원을 맞붙이면 지름이 ${dia} cm인 원 하나가 된다. 반지름은 ${dia} ÷ 2 = ${r}(cm)이므로 ${r} × ${r} × 3.14 = ${h(r * r * 314)}(cm²)이다.`, facts: calc(`${dia}/2*${dia}/2*3.14`, [2])
      });
    }),
    T('mix-square', '정사각형에서 원을 뺀 넓이의 식', '①50 ②55 ③53 심53', (d) => {
      const r = d.until(() => d.int(2, 15), (v) => v % 10 !== 0), s = r * 2, area = s * s * 100 - r * r * 314;
      return M(note(`한 변의 길이가 ${s} cm인 정사각형 안에 원을 꼭 맞게 그렸다. 색칠한 부분의 넓이를 구하는 식에서 ㉠, ㉡에 알맞은 수는?`), [nIn('㉠', r), dIn('㉡', area)], {
        figure: squareCircleFig(`${s} cm`, `한 변의 길이가 ${s} cm인 정사각형과 그 안에 꼭 맞는 원. 원 밖의 부분을 색칠했다`) + lines([`(색칠한 부분의 넓이) = ${s} × ${s} − ㉠ × ㉠ × 3.14 = ㉡(cm²)`]),
        explain: `원의 지름은 정사각형의 한 변의 길이와 같은 ${s} cm이므로 반지름 ㉠은 ${s} ÷ 2 = ${r}이다. ${s} × ${s} − ${r} × ${r} × 3.14 = ${s * s} − ${h(r * r * 314)} = ${h(area)}(cm²)`,
        facts: { calc: [[`${s}/2`, 0], [`${s}*${s}-${s}/2*${s}/2*3.14`, 1]], unseen: [2] }
      });
    }),
    T('mix-ring-expr', '고리 모양의 넓이를 구하는 식 고르기', '①51 ②53 ③52 심52', (d) => {
      const [big, small] = d.until(() => [d.int(5, 12), d.int(2, 9)], ([x, y]) => y / x >= 0.4 && y / x <= 0.75 && x !== 10 && y !== 10);
      return pickWord(d, note(`반지름이 ${big} cm인 원 안에 중심이 같고 반지름이 ${small} cm인 원을 그렸다. 색칠한 부분의 넓이를 구하는 식으로 알맞은 것은?`), `${big} × ${big} × 3.14 − ${small} × ${small} × 3.14`,
        [`(${big} − ${small}) × (${big} − ${small}) × 3.14`, `${big} × 2 × 3.14 − ${small} × 2 × 3.14`, `${big} × ${big} × 3.14 − ${small} × 3.14`],
        `색칠한 부분의 넓이는 큰 원의 넓이에서 작은 원의 넓이를 뺀 것이다. 반지름의 차 ${big - small} cm로 원의 넓이를 구하면 안 된다.`, ringFig(big, small, '중심이 같은 큰 원과 작은 원. 두 원 사이의 고리 모양을 색칠했다'));
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
