// 중학교 1학년 2학기 3단원 평면도형의 성질 — 원과 부채꼴 쪽 묶음
// (원과 부채꼴의 용어, 부채꼴의 중심각과 호의 길이·넓이, 원의 둘레와 넓이·부채꼴의 호의 길이와 넓이, 색칠한 부분의 둘레와 넓이).
// 단원 틀과 그림 판, 싣는 기준, 뺀 것과 까닭은 7-2-3a.js 에 있다. ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
//
// 이 파일에서 지킨 것
//  - 원주율은 π로만 적는다. 답은 π의 계수를 받는다(「□π cm」). 한 유형의 계수는 늘 자연수이거나 늘 분수이다(분수 계수는 sector-frac 하나).
//  - 호의 길이·넓이를 적은 그림은 중심각을 수치대로 그린다(호의 길이만 준 부채꼴도 그 길이에서 중심각을 셈해 그린다).
//  - 한 원에서 중심각과 호의 길이·넓이의 정비례는 글에 수치를 모두 적고 그림에도 적는다(그림이 없어도 풀린다).
//  - 현의 길이·삼각형의 넓이가 중심각에 정비례하지 않는다는 것, 반원·지름을 두고 묻는 문장은 실력(7-2-3c.js)에 실었다. 여기 문장 가리기는 용어의 뜻만 묻는다.
//  - 색칠한 부분은 한두 번 셈하는 것만 싣는다: 원에서 원을 뺀 것, 반원에서 반원 둘을 뺀 것, 부채꼴에서 부채꼴을 뺀 띠, 정다각형의 한 내각이 중심각인 부채꼴.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」. 각도는 수에 붙여 적고(108°) 길이는 띄어 적는다(6 cm, 12π cm).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, N, C } = B.kit;
  const { V, nb } = B.kit.mid;
  const G = B.kit.geo;
  const K = B.kit.m723;
  const { UNIT, T, X, sg, degQ, CM, CM2, piN, piF, piPlus, piTwo, gcd, sayQ, RAD, at, XY, arcTo, sv, TINT, WHITE, Board, regPts, inOf, rgon, kx, exSvg, exSay, exHtml } = K;

  const V_L = V('l'), V_R = V('r');
  // 넓이(π 없이)를 답하는 문항
  const cm2Q = (text, v, o) => Object.assign(N(text, v, Object.assign({}, o, { unit: CM2 })), { shown: `${v} ${CM2}` });
  // x에 대한 식 kx + c(길이): 그림 속 글, 그림 설명, 문제 글
  const lenSvg = (k, c) => (c === 0 ? `${kx(k)}${sv('x')}` : `(${kx(k)}${sv('x')}${c > 0 ? '+' : '−'}${Math.abs(c)})`);
  const lenSay = (k, c) => (c === 0 ? `${kx(k)}x` : `(${kx(k)}x ${c > 0 ? '+' : '−'} ${Math.abs(c)})`);
  const lenHtml = (k, c) => (c === 0 ? `${kx(k)}${X}` : `(${kx(k)}${X} ${c > 0 ? '+' : '−'} ${Math.abs(c)})`);
  // 분수나 자연수로 적은 값
  const qv = (p, q) => { const g = gcd(p, q); return q / g === 1 ? String(p / g) : frac(p / g, q / g); };

  // ── 그림 ──
  // 원 O(반지름 R px). pt(a): 원 위에서 a° 쪽에 있는 점
  function ring(R, css) { const b = Board(), O = [0, 0]; b.disk(O, R, css); return { b, O, R, pt: (a) => at(O, R, a) }; }
  // 원 위의 점과 이름, 원의 중심과 이름
  // shift: 이름을 원을 따라 옆으로 비켜 적는다(그 점에서 호의 길이를 나타내는 선이 시작할 때)
  const mark = (c, a, name, shift) => { c.b.dot(c.pt(a)); if (shift) c.b.text(at(c.O, c.R + 12, a + shift), name); else c.b.name(c.pt(a), name, a); };
  // 원의 중심의 이름. dir 가 배열이면 중심에서 뻗은 선들의 방향이고, 가장 넓게 빈 쪽에 적는다.
  const centre = (c, dir) => { c.b.dot(c.O); if (Array.isArray(dir)) c.b.nameFree(c.O, 'O', dir); else c.b.name(c.O, 'O', dir == null ? 270 : dir, 12); };
  // 바깥에 적는 글의 자리: 중심에서 a° 쪽으로, 원(반지름 R)에서 글이 닿지 않을 만큼 떨어진 곳
  const outside = (b, O, R, a, label, gap) => b.text(at(O, R + (K.textW(label) / 2) * Math.abs(Math.cos(a * RAD)) + 7 * Math.abs(Math.sin(a * RAD)) + (gap == null ? 6 : gap), a), label, { blue: true });
  // 원 O 안의 두 부채꼴. parts: [{ a 중심각, angle 중심에 적을 글, arc 호의 길이 글(호 바깥의 치수선), area 넓이 글(부채꼴을 색칠하고 호 바깥에 적는다) }]
  // way: 'h' 왼쪽과 오른쪽에, 'v' 위와 아래에 놓는다
  function twoFans(parts, way) {
    const c = ring(72), b = c.b, mids = way === 'v' ? [90, 270] : [180, 0];
    parts.forEach((p, i) => {
      const a0 = mids[i] - p.a / 2, a1 = mids[i] + p.a / 2;
      if (p.area != null) b.fan(c.O, c.R, a0, a1, TINT); else b.seg(c.O, c.pt(a0)).seg(c.O, c.pt(a1));
      b.angle(c.O, a0, a1, p.angle, { r: 12 });
      if (p.arc != null) b.arcDim(c.O, c.R, a0, a1, p.arc);
      if (p.area != null) outside(b, c.O, c.R, mids[i], p.area);
    });
    // 중심의 이름은 두 부채꼴 사이의 빈 곳(둘째 부채꼴이 끝난 데서 첫째 부채꼴이 시작하는 데까지)에 적는다.
    b.dot(c.O).angle(c.O, mids[1] + parts[1].a / 2, mids[0] - parts[0].a / 2 + (way === 'v' ? 360 : 0), 'O', { arc: false, ink: true });
    return b;
  }
  // 부채꼴 하나(색칠). R: 반지름(px), t: 중심각. o: { radius 반지름 옆에 적을 글, angle 중심에 적을 글, arc 호 바깥에 적을 글 }
  function fanFig(t, o) {
    const R = t <= 100 ? 118 : t <= 180 ? 84 : 66, b = Board(), O = [0, 0], a0 = t <= 180 ? 0 : 90 - t / 2, a1 = a0 + t;
    b.fan(O, R, a0, a1, TINT);
    if (o.radius) b.beside(O, at(O, R, a0), o.radius, at(O, R / 2, (a0 + a1) / 2));
    if (o.angle) b.angle(O, a0, a1, o.angle, { r: 13 });
    if (o.arc) b.arcDim(O, R, a0, a1, o.arc);
    return b;
  }
  // 원의 한 부분을 색칠한 작은 그림. kind: 'fan' 부채꼴, 'bow' 활꼴, 'tri' 두 반지름과 현, 'cut' 원 위의 한 점에서 그은 두 현과 호
  const PART_SAY = { fan: '원에서 두 반지름과 호로 둘러싸인 부분을 색칠', bow: '원에서 현과 호로 둘러싸인 부분을 색칠', tri: '원에서 두 반지름과 현으로 둘러싸인 삼각형을 색칠', cut: '원 위의 한 점에서 그은 두 현과 호로 둘러싸인 부분을 색칠' };
  const PART_NAME = { fan: '두 반지름과 호로 이루어진 부채꼴', bow: '현과 호로 이루어진 활꼴', tri: '두 반지름과 현으로 이루어진 삼각형', cut: '두 현과 호로 이루어진 도형' };
  function partFig(kind, turn) {
    const c = ring(34, WHITE), b = c.b, a0 = turn, a1 = turn + (kind === 'bow' ? 115 : 85), p0 = c.pt(a0), p1 = c.pt(a1);
    if (kind === 'fan') b.fan(c.O, c.R, a0, a1, TINT);
    else if (kind === 'bow') b.shape(`M${XY(p0)}${arcTo(c.O, c.R, a0, a1)}Z`, [p0, p1], TINT);
    else if (kind === 'tri') b.poly([c.O, p0, p1], TINT);
    else { const q = c.pt(a0 + 222); b.shape(`M${XY(q)}L${XY(p0)}${arcTo(c.O, c.R, a0, a1)}Z`, [q, p0, p1], TINT); }
    b.dot(c.O, 2.2);
    return b.svg(PART_SAY[kind]);
  }

  // ── 문장 ──
  const CIRC_TRUE = [
    '원은 평면 위의 한 점에서 일정한 거리에 있는 모든 점으로 이루어진 도형이다.', '원의 중심을 지나는 현은 그 원의 지름이다.', '원 위의 두 점을 지나는 직선을 할선이라고 한다.', '원 위의 두 점을 이은 선분을 현이라고 한다.',
    '원에서 두 반지름과 호로 이루어진 도형을 부채꼴이라고 한다.', '원에서 현과 호로 이루어진 도형을 활꼴이라고 한다.', '부채꼴에서 두 반지름이 이루는 각을 중심각이라고 한다.', '한 원에서 반지름의 길이는 모두 같다.'
  ];
  const CIRC_FALSE = [
    ['원 위의 두 점을 이은 선분을 호라고 한다.', '원 위의 두 점을 이은 선분은 현이다. 호는 원 위의 두 점을 양 끝 점으로 하는 원의 일부분이다.', ['원 위의 두 점을 이은 선분을 현이라고 한다.']],
    ['원 위의 두 점을 지나는 직선을 현이라고 한다.', '원 위의 두 점을 지나는 직선은 할선이다. 현은 원 위의 두 점을 이은 선분이다.', ['원 위의 두 점을 지나는 직선을 할선이라고 한다.', '원 위의 두 점을 이은 선분을 현이라고 한다.']],
    ['원에서 현과 호로 이루어진 도형을 부채꼴이라고 한다.', '현과 호로 이루어진 도형은 활꼴이다.', ['원에서 현과 호로 이루어진 도형을 활꼴이라고 한다.', '원에서 두 반지름과 호로 이루어진 도형을 부채꼴이라고 한다.']],
    ['원에서 두 반지름과 호로 이루어진 도형을 활꼴이라고 한다.', '두 반지름과 호로 이루어진 도형은 부채꼴이다.', ['원에서 현과 호로 이루어진 도형을 활꼴이라고 한다.', '원에서 두 반지름과 호로 이루어진 도형을 부채꼴이라고 한다.']],
    ['한 원에서 현의 길이는 모두 같다.', '현의 길이는 현마다 다를 수 있다. 한 원에서 길이가 모두 같은 것은 반지름이다.', ['한 원에서 반지름의 길이는 모두 같다.']],
    ['원의 중심을 지나는 현은 그 원의 반지름이다.', '원의 중심을 지나는 현은 지름이다.', ['원의 중심을 지나는 현은 그 원의 지름이다.']]
  ];
  const TERMS = [
    { list: [['현', '원 위의 두 점을 이은 선분'], ['할선', '원 위의 두 점을 지나는 직선'], ['호', '원 위의 두 점을 양 끝 점으로 하는 원의 일부분']], options: ['현', '할선', '호', '지름'] },
    { list: [['부채꼴', '원에서 두 반지름과 호로 이루어진 도형'], ['활꼴', '원에서 현과 호로 이루어진 도형'], ['중심각', '부채꼴에서 두 반지름이 이루는 각']], options: ['부채꼴', '활꼴', '중심각', '반원'] }
  ];

  B.addTypes(UNIT, 'circle', [
    T('circ-symbol', '호에 대한 중심각을 기호로 나타내기', '①53', (d) => {
      const c = ring(62), tilt = d.int(-20, 20), aA = d.int(65, 115) + tilt, ask = d.pick(['AB', 'AC']), right = ask === 'AB' ? '∠AOB' : '∠AOC';
      c.b.seg(c.pt(180 + tilt), c.pt(tilt)).seg(c.O, c.pt(aA)).seg(c.pt(aA), c.pt(tilt));
      mark(c, 180 + tilt, 'B'); mark(c, tilt, 'C'); mark(c, aA, 'A'); centre(c, 270 + tilt);
      const options = d.shuffle(['∠AOB', '∠AOC', '∠OAC', '∠OCA']);
      return C(`원 O에서 선분 BC는 지름이다. 호 ${ask}에 대한 중심각은?`, options, options.indexOf(right), {
        figure: c.b.svg('원 O 위에 세 점 A, B, C가 있다. 선분 BC는 원의 중심 O를 지나고, 반지름 OA와 현 AC가 그어져 있다'),
        explain: `호 ${ask}에 대한 중심각은 호의 양 끝 점을 지나는 두 반지름 O${ask[0]}, O${ask[1]}가 이루는 각이므로 ${right}이다.`,
        facts: { truth: options.map((o) => o === right), want: true }
      });
    }),
    T('circ-pick-fig', '색칠한 부분이 부채꼴·활꼴인 그림 고르기', '①54', (d, n) => {
      const want = n === 0 ? 'fan' : 'bow', word = n === 0 ? '부채꼴' : '활꼴', kinds = d.shuffle(['fan', 'bow', 'tri', 'cut']), tags = ['가', '나', '다', '라'], hit = kinds.indexOf(want);
      return C(`다음 중 색칠한 부분이 ${word}인 것은?`, tags, hit, {
        figure: G.tiles(kinds.map((kind, i) => [tags[i], partFig(kind, d.int(0, 11) * 30)])),
        explain: `${word}은 원에서 ${n === 0 ? '두 반지름과 호' : '현과 호'}로 이루어진 도형이다. ${kinds.map((kind, i) => `${tags[i]}는 ${PART_NAME[kind]}`).join(', ')}이다.`,
        facts: { truth: kinds.map((kind) => kind === want), want: true }
      });
    }, { count: 2 }),
    T('circ-term', '원과 부채꼴의 용어의 뜻', '①55', (d, n) => {
      const set = TERMS[n], [term, mean] = d.pick(set.list), options = d.shuffle(set.options);
      return C(`「${mean}」을 무엇이라고 하는가?`, options, options.indexOf(term), {
        explain: `${mean}을 ${term}${term === '호' ? '라고' : '이라고'} 한다.`, facts: { truth: options.map((o) => o === term), want: true }
      });
    }, { count: 2 }),
    T('circ-claims', '원과 부채꼴의 용어에 대한 설명 가리기', '①56', (d) => {
      const wantTrue = d.bool();
      return sayQ(d, `다음 중 원에 대한 설명으로 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, CIRC_TRUE, CIRC_FALSE, wantTrue);
    }),
    T('circ-chord-radius', '반지름과 길이가 같은 현에 대한 중심각', '①58', (d) => {
      const c = ring(64), turn = d.int(-3, 3) * 10, a0 = 60 + turn, a1 = 120 + turn;
      c.b.seg(c.O, c.pt(a0)).seg(c.O, c.pt(a1)).seg(c.pt(a0), c.pt(a1)).tick(c.O, c.pt(a0)).tick(c.O, c.pt(a1)).tick(c.pt(a0), c.pt(a1));
      c.b.angle(c.O, a0, a1, sv('x'), { square: false });
      mark(c, a1, 'A'); mark(c, a0, 'B'); centre(c, 270 + turn);
      return degQ(`원 O에서 현 AB의 길이가 원 O의 반지름의 길이와 같을 때, ∠AOB의 크기는?`, 60, {
        figure: c.b.svg('원 O와 원 위의 두 점 A, B. 반지름 OA, 반지름 OB, 현 AB에 길이가 같다는 표시가 있다. ∠AOB = x'),
        explain: `${sg('OA')} = ${sg('OB')} = ${sg('AB')}이므로 △OAB는 정삼각형이다. 정삼각형의 한 내각의 크기는 180° ÷ 3 = 60°이므로 ∠AOB = 60°이다.`,
        facts: { calc: [['180/3', 0]], unseen: [180, 3] }
      });
    })
  ]);

  // 중심각 두 개와 그에 비례하는 두 양: 중심각 u·m1, u·m2 와 값 k·m1, k·m2
  function twoParts(d, lo, hi) {
    return d.until(() => { const u = d.pick([15, 20, 25, 30, 35, 40, 45, 50, 60]), [m1, m2] = d.shuffle([1, 2, 3, 4, 5, 6]), k = d.int(2, 8); return { a: u * m1, b: u * m2, p: k * m1, q: k * m2 }; },
      (w) => w.a >= (lo || 30) && w.b >= (lo || 30) && w.a <= (hi || 160) && w.b <= (hi || 160) && w.a + w.b <= 300);
  }

  B.addTypes(UNIT, 'central', [
    T('central-arc', '중심각의 크기와 호의 길이의 정비례', '①59', (d, n) => {
      const v = twoParts(d);
      if (n === 0) return N(`원 O에서 중심각의 크기가 ${v.a}°인 부채꼴의 호의 길이가 ${v.p} cm일 때, 중심각의 크기가 ${v.b}°인 부채꼴의 호의 길이는 몇 cm인가?`, v.q, {
        unit: 'cm', figure: twoFans([{ a: v.a, angle: v.a + '°', arc: `${v.p} cm` }, { a: v.b, angle: v.b + '°', arc: `${sv('x')} cm` }], 'h').svg(`원 O 안의 두 부채꼴. 중심각의 크기가 ${v.a}°인 부채꼴의 호의 길이는 ${v.p} cm, 중심각의 크기가 ${v.b}°인 부채꼴의 호의 길이는 x cm`),
        explain: `한 원에서 부채꼴의 호의 길이는 중심각의 크기에 정비례한다. ${v.a} : ${v.b} = ${v.p} : ${X}에서 ${X} = ${v.p} × ${frac(v.b, v.a)} = ${v.q}이다.`,
        facts: { calc: [[`${v.p}*${v.b}/${v.a}`, 0]] }
      });
      return degQ(`원 O에서 호의 길이가 ${v.p} cm인 부채꼴의 중심각의 크기가 ${v.a}°일 때, 호의 길이가 ${v.q} cm인 부채꼴의 중심각의 크기는?`, v.b, {
        figure: twoFans([{ a: v.a, angle: v.a + '°', arc: `${v.p} cm` }, { a: v.b, angle: `${sv('x')}°`, arc: `${v.q} cm` }], 'h').svg(`원 O 안의 두 부채꼴. 호의 길이가 ${v.p} cm인 부채꼴의 중심각의 크기는 ${v.a}°, 호의 길이가 ${v.q} cm인 부채꼴의 중심각의 크기는 x°`),
        explain: `한 원에서 부채꼴의 호의 길이는 중심각의 크기에 정비례한다. ${v.a} : ${X} = ${v.p} : ${v.q}에서 ${X} = ${v.a} × ${frac(v.q, v.p)} = ${v.b}이다.`,
        facts: { calc: [[`${v.a}*${v.q}/${v.p}`, 0]] }
      });
    }, { count: 2 }),
    T('central-area', '중심각의 크기와 부채꼴의 넓이의 정비례', '①60', (d, n) => {
      const v = twoParts(d), u2 = 'cm²';
      if (n === 0) return cm2Q(`원 O에서 중심각의 크기가 ${v.a}°인 부채꼴의 넓이가 ${v.p} ${CM2}일 때, 중심각의 크기가 ${v.b}°인 부채꼴의 넓이는 몇 ${CM2}인가?`, v.q, {
        figure: twoFans([{ a: v.a, angle: v.a + '°', area: `${v.p} ${u2}` }, { a: v.b, angle: v.b + '°', area: `${sv('x')} ${u2}` }], 'h').svg(`원 O 안의 색칠한 두 부채꼴. 중심각의 크기가 ${v.a}°인 부채꼴의 넓이는 ${v.p} ${u2}, 중심각의 크기가 ${v.b}°인 부채꼴의 넓이는 x ${u2}`),
        explain: `한 원에서 부채꼴의 넓이는 중심각의 크기에 정비례한다. ${v.a} : ${v.b} = ${v.p} : ${X}에서 ${X} = ${v.p} × ${frac(v.b, v.a)} = ${v.q}이다.`,
        facts: { calc: [[`${v.p}*${v.b}/${v.a}`, 0]] }
      });
      return degQ(`원 O에서 넓이가 ${v.p} ${CM2}인 부채꼴의 중심각의 크기가 ${v.a}°일 때, 넓이가 ${v.q} ${CM2}인 부채꼴의 중심각의 크기는?`, v.b, {
        figure: twoFans([{ a: v.a, angle: v.a + '°', area: `${v.p} ${u2}` }, { a: v.b, angle: `${sv('x')}°`, area: `${v.q} ${u2}` }], 'h').svg(`원 O 안의 색칠한 두 부채꼴. 넓이가 ${v.p} ${u2}인 부채꼴의 중심각의 크기는 ${v.a}°, 넓이가 ${v.q} ${u2}인 부채꼴의 중심각의 크기는 x°`),
        explain: `한 원에서 부채꼴의 넓이는 중심각의 크기에 정비례한다. ${v.a} : ${X} = ${v.p} : ${v.q}에서 ${X} = ${v.a} × ${frac(v.q, v.p)} = ${v.b}이다.`,
        facts: { calc: [[`${v.a}*${v.q}/${v.p}`, 0]] }
      });
    }, { count: 2 }),
    T('central-whole', '부채꼴의 넓이·호의 길이로 원의 넓이·둘레 구하기', '①60·69', (d, n) => {
      const t = d.pick([20, 24, 30, 36, 40, 45, 60, 72, 120]), v = d.int(2, 9), whole = v * 360 / t;
      if (n === 0) return cm2Q(`원 O에서 중심각의 크기가 ${t}°인 부채꼴의 넓이가 ${v} ${CM2}일 때, 원 O의 넓이는 몇 ${CM2}인가?`, whole, {
        explain: `원은 중심각의 크기가 360°인 부채꼴로 볼 수 있다. 부채꼴의 넓이는 중심각의 크기에 정비례하므로 원의 넓이는 ${v} × ${frac(360, t)} = ${whole}(${CM2})이다.`, facts: { calc: [[`${v}*360/${t}`, 0]], unseen: [360] }
      });
      return N(`원 O에서 중심각의 크기가 ${t}°인 부채꼴의 호의 길이가 ${v} cm일 때, 원 O의 둘레의 길이는 몇 cm인가?`, whole, {
        unit: 'cm', explain: `원의 둘레는 중심각의 크기가 360°인 호로 볼 수 있다. 호의 길이는 중심각의 크기에 정비례하므로 원의 둘레의 길이는 ${v} × ${frac(360, t)} = ${whole}(cm)이다.`, facts: { calc: [[`${v}*360/${t}`, 0]], unseen: [360] }
      });
    }, { count: 2 }),
    T('central-expr', '중심각·호의 길이가 x에 대한 식인 두 부채꼴', '①61 심46', (d, n) => {
      if (n === 0) {
        // 호의 길이 (x + p) cm, (qx + r) cm
        const v = d.until(() => { const w = twoParts(d, 40, 150), x = d.int(2, 12), k = d.pick([2, 3]); return Object.assign(w, { x, k, c1: w.p - x, c2: w.q - k * x }); },
          (w) => w.a < w.b && w.c1 !== 0 && Math.abs(w.c1) <= 12 && Math.abs(w.c2) <= 12 && w.c2 !== 0 && w.b !== w.a * w.k && w.p >= 3);
        return N(`원 O에서 중심각의 크기가 ${v.a}°, ${v.b}°인 두 부채꼴의 호의 길이가 각각 ${nb(lenHtml(1, v.c1) + ' cm')}, ${nb(lenHtml(v.k, v.c2) + ' cm')}일 때, ${X}의 값은?`, v.x, {
          figure: twoFans([{ a: v.a, angle: v.a + '°', arc: `${lenSvg(1, v.c1)} cm` }, { a: v.b, angle: v.b + '°', arc: `${lenSvg(v.k, v.c2)} cm` }], 'v').svg(`원 O 안의 두 부채꼴. 중심각의 크기가 ${v.a}°인 부채꼴의 호의 길이는 ${lenSay(1, v.c1)} cm, 중심각의 크기가 ${v.b}°인 부채꼴의 호의 길이는 ${lenSay(v.k, v.c2)} cm`),
          explain: `호의 길이는 중심각의 크기에 정비례하므로 ${v.a} : ${v.b} = ${lenHtml(1, v.c1)} : ${lenHtml(v.k, v.c2)}이다. ${v.b} × ${lenHtml(1, v.c1)} = ${v.a} × ${lenHtml(v.k, v.c2)}에서 ${X} = ${v.x}이다.`,
          facts: { calc: [[`(${v.a}*(${v.c2})-${v.b}*(${v.c1}))/(${v.b}-${v.a}*${v.k})`, 0]], unseen: [1] }
        });
      }
      // 중심각 (kx + c)°, b°
      const v = d.until(() => { const w = twoParts(d, 45, 150), x = d.int(10, 50), k = d.pick([1, 2, 2, 3]); return Object.assign(w, { x, k, c: w.a - k * x }); }, (w) => w.a >= 80 && w.c !== 0 && Math.abs(w.c) <= 40 && w.c % 5 === 0);
      return N(`원 O에서 호의 길이가 ${v.p} cm, ${v.q} cm인 두 부채꼴의 중심각의 크기가 각각 ${exHtml(v.k, v.c)}, ${v.b}°일 때, ${X}의 값은?`, v.x, {
        figure: twoFans([{ a: v.a, angle: exSvg(v.k, v.c), arc: `${v.p} cm` }, { a: v.b, angle: v.b + '°', arc: `${v.q} cm` }], 'v').svg(`원 O 안의 두 부채꼴. 호의 길이가 ${v.p} cm인 부채꼴의 중심각의 크기는 ${exSay(v.k, v.c)}, 호의 길이가 ${v.q} cm인 부채꼴의 중심각의 크기는 ${v.b}°`),
        explain: `호의 길이는 중심각의 크기에 정비례하므로 ${exHtml(v.k, v.c)} : ${v.b}° = ${v.p} : ${v.q}이다. ${lenHtml(v.k, v.c)} = ${v.b} × ${frac(v.p, v.q)} = ${v.a}에서 ${X} = ${v.x}이다.`,
        facts: { calc: [[`(${v.b}*${v.p}/${v.q}-(${v.c}))/${v.k}`, 0]], unseen: [1] }
      });
    }, { count: 2 }),
    T('central-frac', '원의 둘레의 몇 분의 몇인 호에 대한 중심각', '①62', (d) => {
      const [p, q] = d.pick([[1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 6], [5, 6], [3, 8], [5, 8], [2, 9], [4, 9], [5, 9], [7, 9], [3, 10], [7, 10], [5, 12], [7, 12]]);
      return degQ(`한 원에서 호의 길이가 원의 둘레의 길이의 ${frac(p, q)}인 부채꼴의 중심각의 크기는?`, 360 * p / q, {
        explain: `호의 길이는 중심각의 크기에 정비례하고, 원의 둘레에 대한 중심각의 크기는 360°이다. 중심각의 크기는 360° × ${frac(p, q)} = ${360 * p / q}°이다.`, facts: { calc: [[`360*${p}/${q}`, 0]], unseen: [360] }
      });
    }),
    T('central-ratio', '호의 길이의 비로 중심각의 크기 구하기', '①63', (d, n) => {
      if (n === 0) {
        const [p, q] = d.pick([[3, 2], [2, 3], [1, 2], [2, 1], [1, 3], [3, 1], [1, 4], [4, 1], [1, 5], [5, 1], [4, 5], [5, 4], [7, 2], [2, 7], [3, 7], [7, 3], [7, 5], [5, 7], [5, 13], [13, 5], [7, 8], [8, 7]]), aoc = 180 * p / (p + q), boc = 180 - aoc, ask = d.pick(['AOC', 'BOC']);
        const c = ring(66);
        c.b.seg(c.pt(180), c.pt(0)).seg(c.O, c.pt(boc)); mark(c, 180, 'A'); mark(c, 0, 'B'); mark(c, boc, 'C'); centre(c, 270);
        return degQ(`선분 AB는 원 O의 지름이고 점 C는 원 O 위의 점이다. 호 AC와 호 CB의 길이의 비가 ${nb(`${p} : ${q}`)}일 때, ∠${ask}의 크기는?`, ask === 'AOC' ? aoc : boc, {
          figure: c.b.svg('원 O의 지름 AB와 원 위의 점 C. 반지름 OC가 그어져 있다'),
          explain: `호의 길이는 중심각의 크기에 정비례하므로 ∠AOC : ∠BOC = ${p} : ${q}이다. ∠AOC + ∠BOC = 180°이므로 ∠${ask} = 180° × ${frac(ask === 'AOC' ? p : q, `${p} + ${q}`)} = ${ask === 'AOC' ? aoc : boc}°이다.`,
          facts: { calc: [[`180*${ask === 'AOC' ? p : q}/(${p}+${q})`, 0]], unseen: [180] }
        });
      }
      const tri = d.pick([[2, 3, 4], [3, 4, 5], [4, 5, 6], [5, 6, 7], [3, 5, 7], [5, 7, 8], [7, 8, 9], [6, 7, 11]]), [p, q, r] = d.shuffle(tri), sum = p + q + r, angs = [p, q, r].map((k) => 360 * k / sum), at0 = d.int(0, 2), names = ['AOB', 'BOC', 'COA'];
      const c = ring(66), aB = 90 + angs[0], aC = aB + angs[1];
      c.b.seg(c.O, c.pt(90)).seg(c.O, c.pt(aB)).seg(c.O, c.pt(aC)); mark(c, 90, 'A'); mark(c, aB, 'B'); mark(c, aC, 'C'); const big = angs.indexOf(Math.max(...angs)); c.b.dot(c.O).name(c.O, 'O', [90, aB, aC][big] + angs[big] / 2, 13);
      return degQ(`원 O 위의 세 점 A, B, C에 대하여 호 AB, 호 BC, 호 CA의 길이의 비가 ${nb(`${p} : ${q} : ${r}`)}일 때, ∠${names[at0]}의 크기는?`, angs[at0], {
        figure: c.b.svg('원 O 위에 세 점 A, B, C가 이 차례로 놓여 있고 반지름 OA, OB, OC가 그어져 있다'),
        explain: `호의 길이는 중심각의 크기에 정비례하므로 ∠AOB : ∠BOC : ∠COA = ${p} : ${q} : ${r}이다. 세 중심각의 크기의 합은 360°이므로 ∠${names[at0]} = 360° × ${frac([p, q, r][at0], `${p} + ${q} + ${r}`)} = ${angs[at0]}°이다.`,
        facts: { calc: [[`360*${[p, q, r][at0]}/(${p}+${q}+${r})`, 0]], unseen: [360] }
      });
    }, { count: 2 }),
    T('central-diameter', '지름 위에서 남은 중심각에 대한 호의 길이', '①64', (d) => {
      const a = d.pick([150, 135, 120, 144, 108, 100, 60, 45, 72, 140, 126]), g = gcd(a, 180 - a), k = d.until(() => d.int(1, 4), (w) => w * a / g >= 2 && w * a / g <= 30), L = k * a / g, x = k * (180 - a) / g;
      const c = ring(70);
      c.b.seg(c.pt(180), c.pt(0)).seg(c.O, c.pt(180 - a)).angle(c.O, 180 - a, 180, a + '°', { r: 13 }).arcDim(c.O, c.R, 180 - a, 180, `${L} cm`);
      mark(c, 180, 'A', 13); mark(c, 0, 'C'); mark(c, 180 - a, 'B', -13); centre(c, 270);
      return N(`선분 AC는 원 O의 지름이고 점 B는 원 O 위의 점이다. ∠AOB = ${a}°이고 호 AB의 길이가 ${L} cm일 때, 호 BC의 길이는 몇 cm인가?`, x, {
        unit: 'cm', figure: c.b.svg(`원 O의 지름 AC와 원 위의 점 B. 반지름 OB가 그어져 있다. ∠AOB = ${a}°, 호 AB의 길이는 ${L} cm`),
        explain: `∠BOC = 180° − ${a}° = ${180 - a}°이다. 호의 길이는 중심각의 크기에 정비례하므로 ${a} : ${180 - a} = ${L} : (호 BC의 길이)이다. 호 BC의 길이는 ${L} × ${frac(180 - a, a)} = ${x}(cm)이다.`,
        facts: { calc: [[`${L}*(180-${a})/${a}`, 0]], unseen: [180] }
      });
    }),
    T('central-iso', '반지름으로 생긴 이등변삼각형과 호의 길이', '①66', (d) => {
      const t = d.pick([25, 30, 35, 36, 40, 50, 54, 60]), g = gcd(90 - t, t), k = d.until(() => d.int(1, 4), (w) => w * t / g >= 2 && w * t / g <= 24 && w * (90 - t) / g <= 40), L = k * t / g, x = k * (90 - t) / g;
      const c = ring(70), pA = c.pt(180), pC = c.pt(2 * t);
      c.b.seg(pA, c.pt(0)).seg(c.O, pC).seg(pA, pC).corner(pA, c.O, pC, t + '°').arcDim(c.O, c.R, 0, 2 * t, `${L} cm`);
      mark(c, 180, 'A'); mark(c, 0, 'B', -13); mark(c, 2 * t, 'C', 13); centre(c, 270);
      return N(`선분 AB는 원 O의 지름이고 점 C는 원 O 위의 점이다. ∠CAO = ${t}°이고 호 BC의 길이가 ${L} cm일 때, 호 AC의 길이는 몇 cm인가?`, x, {
        unit: 'cm', figure: c.b.svg(`원 O의 지름 AB와 원 위의 점 C. 현 AC와 반지름 OC가 그어져 있다. ∠CAO = ${t}°, 호 BC의 길이는 ${L} cm`),
        explain: `${sg('OA')} = ${sg('OC')}이므로 ∠OCA = ∠CAO = ${t}°이다. ∠BOC는 △OAC의 외각이므로 ${t}° + ${t}° = ${2 * t}°이고 ∠AOC = 180° − ${2 * t}° = ${180 - 2 * t}°이다. ${180 - 2 * t} : ${2 * t} = (호 AC의 길이) : ${L}에서 호 AC의 길이는 ${x} cm이다.`,
        facts: { calc: [[`${L}*(180-2*${t})/(2*${t})`, 0]], unseen: [180, 2] }
      });
    })
  ]);

  // ── 부채꼴의 호의 길이와 넓이 ──
  const range = (lo, hi) => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
  const ANGLES = [30, 40, 45, 60, 72, 80, 120, 135, 150, 160, 210, 240, 270];
  // 호의 길이와 넓이의 π 계수가 모두 2 이상의 자연수인 (반지름, 중심각)
  const FANS = range(3, 12).reduce((all, r) => all.concat(ANGLES.filter((t) => (r * t) % 180 === 0 && (r * r * t) % 360 === 0 && r * t / 180 >= 2).map((t) => [r, t])), []);
  // 호의 길이의 π 계수가 1보다 큰 분수(자연수가 아닌 수)인 (반지름, 중심각)
  const FRACS = range(2, 10).reduce((all, r) => all.concat([30, 40, 45, 50, 60, 100, 120, 135, 150].filter((t) => (r * t) % 180 !== 0 && r * t > 180 && 180 / gcd(r * t, 180) <= 9).map((t) => [r, t])), []);
  // 넓이 S = rl/2 를 쓰는 부채꼴: 반지름 r, 호의 길이 kπ, 넓이 (rk/2)π. 중심각은 180k/r
  const RLS = range(3, 12).reduce((all, r) => all.concat(range(2, 16).filter((k) => (r * k) % 2 === 0 && 180 * k / r >= 30 && 180 * k / r <= 300).map((k) => [r, k])), []);

  B.addTypes(UNIT, 'sector', [
    T('sector-circle', '원의 둘레의 길이와 넓이', '①70', (d) => {
      const r = d.int(3, 9), byD = d.bool();
      return piTwo(`${byD ? '지름' : '반지름'}의 길이가 ${byD ? 2 * r : r} cm인 원의 둘레의 길이와 넓이는?`, [['둘레', 2 * r, CM], ['넓이', r * r, CM2]], {
        explain: `${byD ? `반지름의 길이는 ${r} cm이다. ` : ''}원의 둘레의 길이는 2π × ${r} = ${2 * r}π(cm), 넓이는 π × ${r}<sup>2</sup> = ${r * r}π(${CM2})이다.`,
        facts: { calc: byD ? [[`${2 * r}`, 0], [`(${2 * r}/2)*(${2 * r}/2)`, 1]] : [[`2*${r}`, 0], [`${r}*${r}`, 1]], unseen: [2] }
      });
    }),
    T('sector-arc-area', '반지름과 중심각으로 부채꼴의 호의 길이와 넓이 구하기', '①71', (d) => {
      const [r, t] = d.pick(FANS), l = r * t / 180, s = r * r * t / 360;
      return piTwo(`반지름의 길이가 ${r} cm이고 중심각의 크기가 ${t}°인 부채꼴의 호의 길이와 넓이는?`, [['호의 길이', l, CM], ['넓이', s, CM2]], {
        figure: fanFig(t, { radius: `${r} cm`, angle: t + '°' }).svg(`색칠한 부채꼴. 반지름의 길이는 ${r} cm, 중심각의 크기는 ${t}°`),
        explain: `호의 길이는 2π × ${r} × ${frac(t, 360)} = ${l}π(cm), 넓이는 π × ${r}<sup>2</sup> × ${frac(t, 360)} = ${s}π(${CM2})이다.`,
        facts: { calc: [[`2*${r}*${t}/360`, 0], [`${r}*${r}*${t}/360`, 1]], unseen: [2, 360] }
      });
    }),
    T('sector-frac', '호의 길이의 π의 계수가 분수인 부채꼴', '①71', (d) => {
      const [r, t] = d.pick(FRACS), g = gcd(r * t, 180), p = r * t / g, q = 180 / g;
      return piF(`반지름의 길이가 ${r} cm이고 중심각의 크기가 ${t}°인 부채꼴의 호의 길이는?`, p, q, CM, {
        explain: `호의 길이는 2π × ${r} × ${frac(t, 360)} = ${frac(p, q)}π(cm)이다.`, facts: { value: `2*${r}*${t}/360`, unseen: [2, 360] }
      });
    }),
    T('sector-rl', '반지름·호의 길이·넓이 사이의 관계', '①72·73·74', (d, n) => {
      const [r, k] = d.pick(RLS), s = r * k / 2, why = `부채꼴의 넓이는 ${frac(1, 2)} × (반지름의 길이) × (호의 길이)이다. `;
      if (n === 0) return piN(`반지름의 길이가 ${r} cm이고 호의 길이가 ${k}π cm인 부채꼴의 넓이는?`, s, CM2, {
        figure: fanFig(180 * k / r, { radius: `${r} cm`, arc: `${k}π cm` }).svg(`색칠한 부채꼴. 반지름의 길이는 ${r} cm, 호의 길이는 ${k}π cm`),
        explain: `${why}${frac(1, 2)} × ${r} × ${k}π = ${s}π(${CM2})이다.`, facts: { calc: [[`${r}*${k}/2`, 0]], unseen: [2] }
      });
      if (n === 1) return piN(`반지름의 길이가 ${r} cm이고 넓이가 ${s}π ${CM2}인 부채꼴의 호의 길이는?`, k, CM, {
        explain: `${why}호의 길이를 ${V_L} cm라 하면 ${frac(1, 2)} × ${r} × ${V_L} = ${s}π에서 ${V_L} = ${k}π이다.`, facts: { calc: [[`2*${s}/${r}`, 0]], unseen: [2] }
      });
      return N(`호의 길이가 ${k}π cm이고 넓이가 ${s}π ${CM2}인 부채꼴의 반지름의 길이는 몇 cm인가?`, r, {
        unit: 'cm', explain: `${why}반지름의 길이를 ${V_R} cm라 하면 ${frac(1, 2)} × ${V_R} × ${k}π = ${s}π에서 ${V_R} = ${r}이다.`, facts: { calc: [[`2*${s}/${k}`, 0]], unseen: [2] }
      });
    }, { count: 3 }),
    T('sector-angle-back', '호의 길이·넓이로 중심각의 크기 구하기', '①75·76', (d, n) => {
      if (n === 0) {
        const [r, k] = d.pick(RLS.filter(([p, q]) => (180 * q) % p === 0)), t = 180 * k / r;
        return degQ(`반지름의 길이가 ${r} cm이고 호의 길이가 ${k}π cm인 부채꼴의 중심각의 크기는?`, t, {
          explain: `중심각의 크기를 ${X}°라 하면 2π × ${r} × ${frac(X, 360)} = ${k}π이다. ${X} = ${k} × ${frac(180, r)} = ${t}이므로 ${t}°이다.`, facts: { calc: [[`180*${k}/${r}`, 0]], unseen: [180] }
        });
      }
      const [r, t] = d.pick(FANS), s = r * r * t / 360;
      return degQ(`반지름의 길이가 ${r} cm이고 넓이가 ${s}π ${CM2}인 부채꼴의 중심각의 크기는?`, t, {
        explain: `중심각의 크기를 ${X}°라 하면 π × ${r}<sup>2</sup> × ${frac(X, 360)} = ${s}π이다. ${X} = ${s} × ${frac(360, r * r)} = ${t}이므로 ${t}°이다.`, facts: { calc: [[`360*${s}/(${r}*${r})`, 0]], unseen: [360] }
      });
    }, { count: 2 }),
    T('sector-radius-back', '중심각과 넓이·호의 길이로 반지름의 길이 구하기', '①77·78', (d, n) => {
      const [r, t] = d.pick(FANS), s = r * r * t / 360, l = r * t / 180;
      if (n === 0) return N(`중심각의 크기가 ${t}°이고 넓이가 ${s}π ${CM2}인 부채꼴의 반지름의 길이는 몇 cm인가?`, r, {
        unit: 'cm', explain: `반지름의 길이를 ${V_R} cm라 하면 π × ${V_R}<sup>2</sup> × ${frac(t, 360)} = ${s}π이다. ${V_R}<sup>2</sup> = ${s} × ${frac(360, t)} = ${r * r}이고 ${r} × ${r} = ${r * r}이므로 ${V_R} = ${r}이다.`,
        facts: { calc: [[`(360*${s}/${t})**0.5`, 0]], unseen: [360, 0.5] }
      });
      return N(`중심각의 크기가 ${t}°이고 호의 길이가 ${l}π cm인 부채꼴의 반지름의 길이는 몇 cm인가?`, r, {
        unit: 'cm', explain: `반지름의 길이를 ${V_R} cm라 하면 2π × ${V_R} × ${frac(t, 360)} = ${l}π이다. ${V_R} = ${l} × ${frac(180, t)} = ${r}이다.`, facts: { calc: [[`180*${l}/${t}`, 0]], unseen: [180] }
      });
    }, { count: 2 }),
    T('sector-pizza', '똑같이 나눈 두 원의 한 조각의 넓이 비교', '①79', (d) => {
      const v = d.until(() => ({ r1: d.pick([6, 8, 9, 10, 12]), r2: d.pick([9, 10, 12, 15, 16, 18]), n1: d.pick([4, 6, 8]), n2: d.pick([6, 8, 9, 10, 12, 16]) }),
        (w) => w.r1 < w.r2 && w.n1 < w.n2 && w.r1 * w.r1 * w.n2 <= 1.6 * w.r2 * w.r2 * w.n1 && w.r2 * w.r2 * w.n1 <= 1.6 * w.r1 * w.r1 * w.n2);
      const a = v.r1 * v.r1 * v.n2, bb = v.r2 * v.r2 * v.n1;
      return C(`반지름의 길이가 ${v.r1} cm인 원 모양의 피자 A를 똑같이 ${v.n1}조각으로 나누고, 반지름의 길이가 ${v.r2} cm인 원 모양의 피자 B를 똑같이 ${v.n2}조각으로 나누었다. 한 조각의 넓이를 바르게 비교한 것은?`,
        ['A의 한 조각이 더 넓다.', '두 조각의 넓이가 같다.', 'B의 한 조각이 더 넓다.'], a > bb ? 0 : a === bb ? 1 : 2, {
          explain: `A의 한 조각의 넓이는 π × ${v.r1}<sup>2</sup> ÷ ${v.n1} = ${qv(v.r1 * v.r1, v.n1)}π(${CM2}), B의 한 조각의 넓이는 π × ${v.r2}<sup>2</sup> ÷ ${v.n2} = ${qv(v.r2 * v.r2, v.n2)}π(${CM2})이다.`,
          facts: { choose: { exprs: [`${v.r1}*${v.r1}/${v.n1}`, `${v.r2}*${v.r2}/${v.n2}`], rule: 'compare' } }
        });
    })
  ]);

  // ── 색칠한 부분의 둘레와 넓이 ──
  // 부채꼴(반지름 r + w)에서 부채꼴(반지름 r)을 뺀 띠. 둘레의 호 부분 (2r + w)t/180, 넓이 ((r + w)² − r²)t/360 의 π 계수가 모두 자연수인 것
  const BANDS = [45, 60, 72, 120].reduce((all, t) => all.concat(range(3, 12).reduce((list, r) => list.concat(range(2, 8).filter((w) => r + w <= 20 && r >= 0.4 * (r + w) && ((2 * r + w) * t) % 180 === 0 && (((r + w) * (r + w) - r * r) * t) % 360 === 0).map((w) => [t, r, w])), [])), []);
  function bandFig(t, r, w) {
    const k = 150 / (r + w), b = Board(), O = [0, 0], p = (len, a) => at(O, len * k, a);
    b.shape(`M${XY(p(r, 0))}L${XY(p(r + w, 0))}${arcTo(O, (r + w) * k, 0, t)}L${XY(p(r, t))}${arcTo(O, r * k, t, 0)}Z`, [p(r, 0), p(r + w, 0), p(r + w, t), p(r, t), p(r + w, t / 2)], TINT);
    b.fan(O, r * k, 0, t).angle(O, 0, t, t + '°', { r: 13 });
    b.dim(O, p(r, 0), `${r} cm`, [0, -20]).dim(p(r, 0), p(r + w, 0), `${w} cm`, [0, -20]);
    return b.svg(`중심이 같고 중심각의 크기가 ${t}°인 두 부채꼴. 작은 부채꼴의 반지름의 길이는 ${r} cm이고, 큰 부채꼴의 반지름은 그보다 ${w} cm 더 길다. 큰 부채꼴에서 작은 부채꼴을 뺀 띠 모양이 색칠되어 있다`);
  }
  // 정n각형의 한 꼭짓점이 중심이고 한 변이 반지름인 부채꼴의 넓이의 π 계수가 2 이상의 자연수인 (n, 한 변)
  const POLYFANS = [[6, 3], [6, 6], [6, 9], [8, 4], [8, 8], [5, 10], [12, 6], [9, 6], [10, 5], [10, 10]];

  B.addTypes(UNIT, 'shade', [
    T('shade-ring', '원에서 원을 잘라 낸 부분의 둘레와 넓이', '①80', (d) => {
      const [R, r] = d.pick([[6, 2], [6, 3], [8, 3], [8, 4], [9, 3], [9, 4], [10, 4], [10, 5], [12, 4], [12, 5], [12, 6], [7, 3], [5, 2]]), k = 66 / R, c = ring(66, TINT), S = [-(R - r) * k, 0];
      c.b.disk(S, r * k, WHITE).seg([-R * k, 0], [(2 * r - R) * k, 0], 'thin').seg(c.O, c.pt(0), 'thin').dot(c.O, 2.2);
      c.b.text([S[0], -9], `${2 * r} cm`, { blue: true }).text([R * k / 2, -9], `${R} cm`, { blue: true, plain: true });
      return piTwo(`반지름의 길이가 ${R} cm인 원에서 지름의 길이가 ${2 * r} cm인 원을 잘라 내었다. 색칠한 부분의 둘레의 길이와 넓이는?`, [['둘레', 2 * R + 2 * r, CM], ['넓이', R * R - r * r, CM2]], {
        figure: c.b.svg(`반지름의 길이가 ${R} cm인 큰 원의 내부에 지름의 길이가 ${2 * r} cm인 작은 원이 있다. 작은 원은 큰 원의 안쪽에서 왼쪽 끝에 닿아 있다. 큰 원에서 작은 원을 뺀 부분이 색칠되어 있다`),
        explain: `색칠한 부분의 둘레는 큰 원의 둘레와 작은 원의 둘레를 더한 것이다. 2π × ${R} + 2π × ${r} = ${2 * R + 2 * r}π(cm)이다. 넓이는 π × ${R}<sup>2</sup> − π × ${r}<sup>2</sup> = ${R * R - r * r}π(${CM2})이다.`,
        facts: { calc: [[`2*${R}+${2 * r}`, 0], [`${R}*${R}-(${2 * r}/2)*(${2 * r}/2)`, 1]], unseen: [2] }
      });
    }),
    T('shade-semis', '반원에서 반원 둘을 잘라 낸 부분의 둘레와 넓이', '①81', (d) => {
      const a = d.int(2, 6), R = 2 * a, k = 100 / R, b = Board(), O = [0, 0], c1 = [a * k, 0], c2 = [-a * k, 0];
      b.shape(`M${XY([-R * k, 0])}${arcTo(O, R * k, 180, 0)}${arcTo(c1, a * k, 0, 180)}${arcTo(c2, a * k, 0, 180)}Z`, [[-R * k, 0], [R * k, 0], [0, -R * k]], TINT);
      b.dim([-R * k, 0], O, `${R} cm`, [0, -20], 9).dim(O, [R * k, 0], `${R} cm`, [0, -20], 9);
      return piTwo(`지름의 길이가 ${2 * R} cm인 반원에서 지름의 길이가 ${R} cm인 반원 2개를 잘라 내었다. 색칠한 부분의 둘레의 길이와 넓이는?`, [['둘레', 4 * a, CM], ['넓이', a * a, CM2]], {
        figure: b.svg(`지름의 길이가 ${2 * R} cm인 큰 반원의 지름 위에 지름의 길이가 ${R} cm인 작은 반원 2개가 나란히 놓여 있다. 큰 반원에서 작은 반원 2개를 뺀 부분이 색칠되어 있다`),
        explain: `색칠한 부분의 둘레는 큰 반원의 호와 작은 반원의 호 2개이다. π × ${R} + (π × ${a}) × 2 = ${4 * a}π(cm)이다. 넓이는 π × ${R}<sup>2</sup> × ${frac(1, 2)} − (π × ${a}<sup>2</sup> × ${frac(1, 2)}) × 2 = ${a * a}π(${CM2})이다.`,
        facts: { calc: [[`${2 * R}/2+2*(${R}/2)`, 0], [`(${2 * R}/2)*(${2 * R}/2)/2-2*(${R}/2)*(${R}/2)/2`, 1]], unseen: [2] }
      });
    }),
    T('shade-band', '부채꼴에서 부채꼴을 잘라 낸 띠의 넓이와 둘레', '①83', (d, n) => {
      const [t, r, w] = d.pick(BANDS), R = r + w, area = (R * R - r * r) * t / 360, arcs = (R + r) * t / 180;
      const lead = `중심각의 크기가 ${t}°이고 반지름의 길이가 ${R} cm인 부채꼴에서 중심이 같고 반지름의 길이가 ${r} cm인 부채꼴을 잘라 내었다.`;
      if (n === 0) return piN(`${lead} 색칠한 부분의 넓이는?`, area, CM2, {
        figure: bandFig(t, r, w), explain: `큰 부채꼴의 넓이에서 작은 부채꼴의 넓이를 뺀다. π × ${R}<sup>2</sup> × ${frac(t, 360)} − π × ${r}<sup>2</sup> × ${frac(t, 360)} = ${qv(R * R * t, 360)}π − ${qv(r * r * t, 360)}π = ${area}π(${CM2})이다.`,
        facts: { calc: [[`(${R}*${R}-${r}*${r})*${t}/360`, 0]], unseen: [360] }
      });
      return piPlus(`${lead} 색칠한 부분의 둘레의 길이는?`, arcs, 2 * w, CM, {
        figure: bandFig(t, r, w), explain: `둘레는 큰 호, 작은 호, 길이가 ${R} − ${r} = ${w}(cm)인 선분 2개로 이루어진다. 2π × ${R} × ${frac(t, 360)} + 2π × ${r} × ${frac(t, 360)} + ${w} × 2 = ${qv(R * t, 180)}π + ${qv(r * t, 180)}π + ${2 * w} = ${arcs}π + ${2 * w}(cm)이다.`,
        facts: { calc: [[`(2*${R}+2*${r})*${t}/360`, 0], [`2*(${R}-${r})`, 1]], unseen: [2, 360] }
      });
    }, { count: 2 }),
    T('shade-poly-sector', '정다각형의 한 내각이 중심각인 부채꼴의 넓이', '①88 심58', (d) => {
      const [n, a] = d.pick(POLYFANS), s = n <= 6 ? 62 : n === 8 ? 48 : n <= 10 ? 40 : 33, P = regPts(n, s), b = Board(), t = inOf(n), area = a * a * t / 360;
      b.fan(P[0], s, 0, t, TINT).poly(P).dim(P[0], P[1], `${a} cm`, [s / 2, -s]);
      return piN(`한 변의 길이가 ${a} cm인 ${rgon(n)}에서 한 꼭짓점을 중심으로 하고 그 꼭짓점에서 만나는 두 변을 반지름으로 하는 부채꼴을 그렸다. 이 부채꼴의 넓이는?`, area, CM2, {
        figure: b.svg(`한 변의 길이가 ${a} cm인 ${rgon(n)}. 한 꼭짓점을 중심으로 하고 그 꼭짓점에서 만나는 두 변을 반지름으로 하는 부채꼴이 ${rgon(n)}의 내부에 색칠되어 있다`),
        explain: `부채꼴의 중심각은 ${rgon(n)}의 한 내각이므로 그 크기는 ${frac(`180° × (${n} − 2)`, n)} = ${t}°이다. 넓이는 π × ${a}<sup>2</sup> × ${frac(t, 360)} = ${area}π(${CM2})이다.`,
        facts: { calc: [[`${a}*${a}*(180*(${n}-2)/${n})/360`, 0]], unseen: [180, 2, 360, n] }
      });
    })
  ]);

  // 같은 단원의 실력 파일(7-2-3c.js)이 함께 쓰는 도구
  Object.assign(K, { cm2Q, lenSvg, lenSay, lenHtml, qv, ring, mark, centre, outside, twoFans, fanFig, range, FANS, RLS });
})(typeof window !== 'undefined' ? window : globalThis);
