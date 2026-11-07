// 고등학교 미적분Ⅱ 급수(11-5-2) — 실력 문항.
// 이 단원에서 아이들이 흔히 잘못 아는 것
//  - lim aₙ = 0 이면 급수가 수렴한다고 여긴다(근호의 차 꼴은 일반항이 0으로 가도 발산한다). 거꾸로 급수의 합을 일반항의 극한으로 쓴다.
//  - 부분분수로 나눌 때 앞의 계수 1/(두 인수의 차)를 빠뜨리고, 간격이 2·3인 소거에서 남는 항이 여럿인 것을 놓친다.
//  - 등비급수가 수렴할 조건을 −1 < r < 1 만으로 여겨 「첫째항이 0인 경우」를 빠뜨리고, 등비수열의 조건(−1 < r ≤ 1)과 섞는다.
//  - 두 등비수열의 곱·제곱의 공비가 r², rs 임을 쓰지 못하고, Σaₙbₙ = Σaₙ × Σbₙ 처럼 곱에도 Σ를 나누어 쓴다.
//  - 되풀이되는 도형에서 닮음비를 넓이의 비로 바로 쓰거나(제곱을 잊음), 개수가 늘어나는 것을 공비에 넣지 않는다.
// 실력에 둔 잣대(과제 글·new-unit-guide-m): ① 상황·식의 장치 때문에 배운 뜻을 정확히 대야 풀리는 것, ② 세 단계 넘게 이어 생각해야 풀리는 것.
// 각 유형 머리의 주석에 ①·②를 적었다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번.
// 새로 그린 그림(단원 안의 작은 함수): 지름을 k등분한 원이 되풀이되는 그림(splitCircles), 정사각형을 m : n 으로 나누어 되풀이한 그림(ratioSquares),
// 닮은 직사각형을 잘라 내는 그림(goldRects), 코흐 눈송이의 세 단계(kochSteps), 프랙털 카드를 펼친 종이(cardSheet). 반원과 꺾이는 점은 공용 plot.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, N, M, C, inline } = B.kit;
  const { MINUS, gcd, Q, qadd, qsub, qmul, qdiv, isInt, V, sup, nb, rt, poly } = B.kit.mid;
  const { ms, sum, jh, hx, qAns, piAns, plot } = B.kit.hs;
  const { Board, at, sv } = B.kit.mgeo;
  const U = B.kit.u52x;
  const { UNIT, STD4, STD5, H, jn, jq, tq, sT, par, VN, VX, VR, AN, BN, SN, A_, SEQA, SEQB, pn, SI, LIM, range, harm, harmE, harmH, close, fl, choose, val, pos, given, frac, cf, svs } = U;
  const sq2 = (x) => qmul(x, x);

  // ── 그림 ──
  // 반지름 R 인 원 안에 지름을 k등분한 선분을 지름으로 하는 원 k개, 그 원마다 다시 k개 …(세 단계)
  function splitCircles(k) {
    const b = Board(), R0 = 108;
    const draw = (c, r, depth) => { b.disk(c, r, depth === 0 ? 'fill:#e0f2fe' : depth === 1 ? 'fill:#fef3c7' : 'fill:#fce7f3'); if (depth < 2) for (let i = 0; i < k; i += 1) draw([c[0] - r + r / k * (2 * i + 1), c[1]], r / k, depth + 1); };
    draw([0, 0], R0, 0);
    b.seg([-R0, 0], [R0, 0], 'thin');
    return b.svg(`원 안에 지름을 ${k}등분한 선분을 지름으로 하는 원 ${k}개를 그리고, 그 원마다 다시 같은 방법으로 원 ${k}개씩을 그린 그림`);
  }
  // 한 변의 길이가 1인 정사각형 ABCD(A 왼쪽 위, B 왼쪽 아래, C 오른쪽 아래, D 오른쪽 위)를 m : n 으로 나누어 꼭짓점 A 쪽 정사각형을 칠하고 C 쪽 정사각형에서 되풀이
  function ratioSquares() {
    const b = Board(), S = 210, r = 0.38;
    let x = 0, y = 0, s = S;
    b.poly([[0, 0], [0, S], [S, S], [S, 0]], 'fill:none');
    for (let i = 0; i < 5; i += 1) {
      const a = r * s;
      b.poly([[x, y], [x, y + a], [x + a, y + a], [x + a, y]], 'fill:rgba(251,191,36,0.55)');
      b.seg([x + a, y], [x + a, y + s], 'thin').seg([x, y + a], [x + s, y + a], 'thin');
      if (i === 0) b.text([x + a / 2, y + a / 2], svs('S', 1)); else if (i === 1) b.text([x + a / 2, y + a / 2], svs('S', 2), { size: 11 });
      x += a; y += a; s -= a;
    }
    const a1 = r * S;
    b.name([0, 0], 'A', 135).name([0, S], 'B', 225).name([S, S], 'C', 315).name([S, 0], 'D', 45);
    b.name([a1, a1], svs('A', 1), 225, 13).name([a1, S], svs('B', 1), 270).name([S, a1], svs('D', 1), 0);
    b.text([-12, a1 / 2], sv('m'), { size: 12 }).text([-12, a1 + (S - a1) / 2], sv('n'), { size: 12 });
    b.text([a1 / 2, -11], sv('m'), { size: 12 }).text([a1 + (S - a1) / 2, -11], sv('n'), { size: 12 });
    return b.svg('정사각형 ABCD. 변 AB와 변 AD를 각각 m : n으로 내분하는 점을 지나고 변에 평행한 두 직선을 그어, 꼭짓점 A 쪽의 정사각형 S1을 칠하고 꼭짓점 C 쪽의 정사각형 A1B1CD1 안에서 같은 방법을 되풀이한 그림');
  }
  // 긴 변 1인 직사각형에서 짧은 변을 한 변으로 하는 정사각형을 잘라 내기를 되풀이한 그림(황금 직사각형)
  function goldRects(L) {
    const b = Board(), phi = (Math.sqrt(5) - 1) / 2, W = 240;
    let x = 0, y = 0, w = W, h = W * phi;
    b.poly([[0, 0], [W, 0], [W, h], [0, h]], 'fill:#f1f5f9');
    const cols = ['#fde68a', '#bbf7d0', '#bfdbfe', '#fecaca', '#e9d5ff', '#fde68a'];
    for (let i = 0; i < 6; i += 1) {
      const dir = i % 4;
      if (dir === 0) { b.poly([[x, y], [x + h, y], [x + h, y + h], [x, y + h]], 'fill:' + cols[i]); if (i < 2) b.text([x + h / 2, y + h / 2], svs('S', i + 1)); x += h; w -= h; }
      else if (dir === 1) { b.poly([[x, y], [x + w, y], [x + w, y + w], [x, y + w]], 'fill:' + cols[i]); if (i < 2) b.text([x + w / 2, y + w / 2], svs('S', i + 1), { size: 12 }); y += w; h -= w; }
      else if (dir === 2) { b.poly([[x + w - h, y], [x + w, y], [x + w, y + h], [x + w - h, y + h]], 'fill:' + cols[i]); w -= h; }
      else { b.poly([[x, y + h - w], [x + w, y + h - w], [x + w, y + h], [x, y + h]], 'fill:' + cols[i]); h -= w; }
    }
    b.poly([[0, 0], [W, 0], [W, W * phi], [0, W * phi]], 'fill:none');
    b.dim([0, W * phi], [W, W * phi], String(L), [W / 2, 0], 12);
    return b.svg('긴 변의 길이가 ' + L + '인 직사각형 R1에서 짧은 변을 한 변으로 하는 정사각형 S1을 잘라 내고, 남은 직사각형 R2에서 다시 정사각형 S2를 잘라 내기를 되풀이한 그림');
  }
  // 코흐 눈송이 A1, A2, A3
  function kochSteps() {
    const tri = (cx, cy, s) => { const h = s * Math.sqrt(3) / 2; return [[cx - s / 2, cy + h / 3], [cx, cy - 2 * h / 3], [cx + s / 2, cy + h / 3]]; };
    const step = (pts) => { const out = []; for (let i = 0; i < pts.length; i += 1) { const p = pts[i], q = pts[(i + 1) % pts.length], dx = (q[0] - p[0]) / 3, dy = (q[1] - p[1]) / 3, a = [p[0] + dx, p[1] + dy], c = [p[0] + 2 * dx, p[1] + 2 * dy], ang = Math.atan2(dy, dx) - Math.PI / 3, L = Math.hypot(dx, dy); out.push(p, a, [a[0] + L * Math.cos(ang), a[1] + L * Math.sin(ang)], c); } return out; };
    let out = '';
    const shapes = [tri(48, 62, 74)];
    shapes.push(step(tri(150, 62, 74)));
    shapes.push(step(step(tri(252, 62, 74))));
    shapes.forEach((pts, i) => {
      out += `<polygon points="${pts.map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ')}" style="fill:#dbeafe;stroke:#1d4ed8;stroke-width:1.2"/>`;
      out += `<text x="${48 + 102 * i}" y="122" style="font-size:13px;font-style:italic;font-family:'MB Math','Times New Roman',serif" text-anchor="middle">A<tspan style="font-size:10px" dy="3">${i + 1}</tspan></text>`;
    });
    return `<svg class="mb-geo" viewBox="0 0 300 130" width="284" role="img" aria-label="정삼각형 A1, 각 변을 삼등분하여 가운데에 정삼각형을 붙인 A2, 같은 방법을 한 번 더 한 A3">${out}</svg>`;
  }
  // 프랙털 카드를 펼친 종이: 가로 a, 세로 b. 실선은 자르는 선, 점선은 접는 선(세 단계)
  function cardSheet() {
    const W = 264, Hh = 200, x0 = 8, y0 = 8;
    const L = [], Dl = [];
    const seg = (list, x1, y1, x2, y2) => list.push(`<line x1="${(x0 + x1).toFixed(1)}" y1="${(y0 + y1).toFixed(1)}" x2="${(x0 + x2).toFixed(1)}" y2="${(y0 + y2).toFixed(1)}"/>`);
    seg(Dl, 0, Hh / 2, W, Hh / 2);
    const pop = (xa, xb, y, h, depth) => {
      const len = xb - xa, c1 = xa + len / 3, c2 = xa + 2 * len / 3;
      seg(L, c1, y - h, c1, y + h); seg(L, c2, y - h, c2, y + h);
      seg(Dl, c1, y - h, c2, y - h); seg(Dl, c1, y + h, c2, y + h);
      if (depth < 3) { pop(xa, c1, y, h / 2, depth + 1); pop(c2, xb, y, h / 2, depth + 1); pop(c1, c2, y - h, h / 2, depth + 1); pop(c1, c2, y + h, h / 2, depth + 1); }
    };
    pop(0, W, Hh / 2, Hh / 4, 1);
    const ital = "font-style:italic;font-family:'MB Math','Times New Roman',serif;font-size:14px";
    return `<svg class="mb-geo" viewBox="0 0 ${W + 34} ${Hh + 34}" width="${W + 34}" role="img" aria-label="가로 a, 세로 b인 직사각형 종이를 펼친 그림. 가운데 가로 점선이 처음 접는 선이고, 실선은 자르는 선, 점선은 접는 선이다. 1단계에 가운데 직사각형 1개, 2단계에 그 위·아래·왼쪽·오른쪽에 4개, 3단계에 16개의 작은 직사각형이 생긴다.">`
      + `<rect x="${x0}" y="${y0}" width="${W}" height="${Hh}" style="fill:#ccfbf1;stroke:#1f2933;stroke-width:1.6"/>`
      + `<g style="stroke:#1f2933;stroke-width:1.3">${L.join('')}</g><g style="stroke:#1f2933;stroke-width:1;stroke-dasharray:3 2.5">${Dl.join('')}</g>`
      + `<text x="${x0 + W / 2}" y="${y0 + Hh + 20}" style="${ital}" text-anchor="middle">a</text><text x="${x0 + W + 14}" y="${y0 + Hh / 2 + 5}" style="${ital}" text-anchor="middle">b</text></svg>`;
  }

  B.addGroup(UNIT, {
    id: 'hard', title: '실력 문제', standard: STD4,
    types: [
      // ① 분자가 두 제곱 (n+s+g)² − (n+s)² 의 몇 배인지 알아보아야 1/(n+s)² − 1/(n+s+g)² 로 갈라진다.
      H('hard-sqdiff', '두 제곱의 차로 쪼개지는 분수 꼴 급수의 합', '①11', (d) => {
        const g = d.pick([1, 2]), s = d.pick([0, 1, 2]), K = d.pick([1, 2, 3, 4]);
        const m1 = (k) => (k === 0 ? VN : par(pn(1, k)));
        const num = g === 2 ? (2 * K === 1 ? '' : 2 * K) + par(pn(1, s + 1)) : (K === 1 ? pn(2, 2 * s + 1) : K + par(pn(2, 2 * s + 1)));
        const den = m1(s) + sup(2) + m1(s + g) + sup(2);
        const v = qmul(Q(K, g), range(1, g).reduce((acc, j) => qadd(acc, Q(1, (s + j) * (s + j))), Q(0)));
        const lead = cf(Q(K, g));
        return val(`급수 ${SI(frac(num, den))}의 합은?`, v, {
          explain: `${nb(m1(s + g) + sup(2) + ' ' + MINUS + ' ' + m1(s) + sup(2) + ' = ' + (g === 1 ? pn(2, 2 * s + 1) : g + par(pn(2, 2 * s + g))))}이므로 ${nb(frac(num, den) + ' = ' + lead + '{' + frac(1, m1(s) + sup(2)) + ' ' + MINUS + ' ' + frac(1, m1(s + g) + sup(2)) + '}')}이다. 풀어 쓰면 ${g === 1 ? '첫 항' : '앞의 ' + g + '개 항'}만 남으므로 합은 ${nb((g === 1 ? (lead || '') + (lead ? ' × ' : '') + (s === 0 ? '1' : frac(1, (s + 1) + sup(2))) : lead + par(range(1, g).map((j) => (s + j === 1 ? '1' : frac(1, (s + j) + sup(2)))).join(' + '))) + ' = ' + tq(v))}이다.`,
          facts: { value: `${K}/${g}*(${range(1, g).map((j) => `1/(${s + j}*${s + j})`).join('+')})`, derived: [K, g, s + 1, s + 2, 2 * K] }
        });
      }),
      // ① f(n+1) − f(n) 이 분자의 몇 배인지, f(n+1) 이 다음 항의 분모가 됨을 알아보아야 이웃 항이 지워진다.
      H('hard-quadprod', '이차식 두 개의 곱이 분모인 급수의 합', '①12', (d) => {
        const kind = d.int(0, 3), c = d.pick([1, 2, 3, 4, 6]);
        const [numH, f1, f2, diffK, f1v, nn] = [
          [VN, ms('n^2') + ' ' + MINUS + ' ' + VN + ' + 1', ms('n^2') + ' + ' + VN + ' + 1', 2, 1, `${VN}`],
          [par(pn(1, 1)), ms('n^2') + ' + ' + VN + ' + 1', ms('n^2') + ' + 3' + VN + ' + 3', 2, 3, pn(1, 1)],
          [par(pn(2, 1)), ms('n^2') + ' + 1', ms('n^2') + ' + 2' + VN + ' + 2', 1, 2, pn(2, 1)],
          [par(pn(2, 3)), ms('n^2') + ' + 2' + VN + ' + 2', ms('n^2') + ' + 4' + VN + ' + 5', 1, 5, pn(2, 3)]
        ][kind];
        const v = Q(c, diffK * f1v);
        const top = (c === 1 ? '' : c) + (c === 1 ? nn : numH);
        return val(`급수 ${SI(frac(top, par(f1) + par(f2)))}의 합은?`, v, {
          explain: `${f1}에 ${VN} 대신 ${pn(1, 1)}을 넣으면 ${jh(f2, '이/가')} 되고, 두 식의 차는 ${diffK === 1 ? nn : '2' + (kind === 0 ? VN : par(nn))}이다. 따라서 ${nb(frac(top, par(f1) + par(f2)) + ' = ' + cf(Q(c, diffK)) + par(frac(1, f1) + ' ' + MINUS + ' ' + frac(1, f2)))}이고, 이웃한 항이 지워져 첫 항만 남으므로 합은 ${nb(cf(Q(c, diffK)) + ' × ' + frac(1, f1v) + ' = ' + tq(v))}이다.`.replace(' × ' + frac(1, f1v), cf(Q(c, diffK)) === '' ? '' : ' × ' + frac(1, f1v)),
          facts: { value: `${c}/(${diffK}*${f1v})`, derived: [diffK, f1v, 3, 5] }
        });
      }),
      // ① x² + ⋯ = (x − αₙ)(x − βₙ) 에 x = t 를 넣으면 (αₙ − t)(βₙ − t) 가 곧 나온다(근과 계수로 풀면 길어진다). 간격 t 의 소거.
      H('hard-vieta', '이차방정식의 두 근으로 만든 급수의 합', '①17', (d) => {
        const t = d.pick([1, 2, 3]), u = d.int(-3, 3), v0 = -t * t - u * t;
        const coefX = u === 0 ? VN + VX : par(pn(1, u)) + VX;
        const cst = ms('n^2') + (v0 === 0 ? '' : (v0 < 0 ? ' ' + MINUS + ' ' : ' + ') + Math.abs(v0));
        const eq = nb(ms('x^2') + ' + ' + coefX + ' + ' + cst + ' = 0');
        const v = qmul(Q(1, t), harm(t));
        const AL = ms('α_n'), BE = ms('β_n');
        return val(`${VX}에 대한 이차방정식 ${eq}의 두 근을 ${AL}, ${BE}이라 할 때, 급수 ${SI(frac(1, par(AL + ' ' + MINUS + ' ' + t) + par(BE + ' ' + MINUS + ' ' + t)))}의 합은?`, v, {
          explain: `${nb(ms('x^2') + ' + ' + coefX + ' + ' + cst + ' = ' + par(VX + ' ' + MINUS + ' ' + AL) + par(VX + ' ' + MINUS + ' ' + BE))}에 ${nb(VX + ' = ' + josa(t, '을/를'))} 넣으면 ${nb(par(AL + ' ' + MINUS + ' ' + t) + par(BE + ' ' + MINUS + ' ' + t) + ' = ' + VN + par(pn(1, t)))}이다. ${nb(frac(1, VN + par(pn(1, t))) + ' = ' + cf(Q(1, t)) + par(frac(1, VN) + ' ' + MINUS + ' ' + frac(1, pn(1, t))))}이므로 풀어 쓰면 앞의 ${t}개 항만 남아 합은 ${nb(cf(Q(1, t)) + (t === 1 ? '1' : par(harmH(t))) + ' = ' + tq(v))}이다.`,
          facts: { value: `1/${t}*(${harmE(t)})`, derived: [t, 3] }
        });
      }),
      // ② 분자를 갈라 1/√aₖ − 1/√aₖ₊₁ 로 → 소거해 1/√a₁ → 거꾸로 a₁ → 제N항(네 단계)
      H('hard-adroot', '근호 꼴 급수의 합으로 등차수열의 항 구하기', '①19', (d) => {
        const r = d.pick([Q(2, 3), Q(1, 2), Q(3, 2), Q(2), Q(1, 3), Q(3, 4), Q(4, 3), Q(2, 5)]), m = d.pick([4, 9, 16, 5, 3]), Nn = d.int(8, 25);
        const a1 = sq2(r), S = qdiv(Q(1), r), aN = qadd(a1, Q(Nn - 1, m));
        if (aN.q > 99) return null;
        const body = frac(rt(ms('a_{n+1}')) + ' ' + MINUS + ' ' + rt(AN), rt(AN) + rt(ms('a_{n+1}')));
        return val(`모든 항이 양수이고 공차가 ${frac(1, m)}인 등차수열 ${SEQA}에 대하여 ${nb(SI(body) + ' = ' + tq(S))}일 때, ${A_(Nn)}의 값은?`, aN, {
          explain: `${nb(body + ' = ' + frac(1, rt(AN)) + ' ' + MINUS + ' ' + frac(1, rt(ms('a_{n+1}'))))}이므로 부분합은 ${nb(frac(1, rt(A_(1))) + ' ' + MINUS + ' ' + frac(1, rt(ms('a_{n+1}'))))}이다. 공차가 양수라 ${ms('a_{n+1}')}은 한없이 커지므로 합은 ${frac(1, rt(A_(1)))}이고, ${nb(frac(1, rt(A_(1))) + ' = ' + tq(S))}에서 ${nb(A_(1) + ' = ' + tq(a1))}이다. 따라서 ${nb(A_(Nn) + ' = ' + tq(a1) + ' + ' + (Nn - 1) + ' × ' + frac(1, m) + ' = ' + tq(aN))}이다.`,
          facts: { value: `1/(${S.p}/${S.q})**2+(${Nn}-1)/${m}` }
        });
      }),
      // ① 첫째항 x 가 0 이면 공비와 상관없이 수렴(x = 0 을 넣는다), 공비의 부등식 한쪽은 늘 참 — 이차부등식 둘을 따져야 한다.
      H('hard-quadratio', '공비가 이차식인 등비급수가 수렴할 조건', '②8', (d) => {
        const c = d.pick([1, 2]), sg = d.pick([1, -1]);
        const rq = ms('x^2') + (sg > 0 ? ' ' + MINUS + ' ' : ' + ') + (c === 1 ? '' : c) + VX + ' + 1';
        const hi = sg > 0 ? `0 ≤ ${VX} &lt; ${c}` : `${MINUS}${c} &lt; ${VX} ≤ 0`;
        const rows = sg > 0
          ? [[hi, true], [`0 &lt; ${VX} &lt; ${c}`, false], [`0 ≤ ${VX} ≤ ${c}`, false], [`${MINUS}${c} &lt; ${VX} &lt; ${c}`, false], [`${VX} = 0 또는 ${VX} &gt; ${c}`, false]]
          : [[hi, true], [`${MINUS}${c} &lt; ${VX} &lt; 0`, false], [`${MINUS}${c} ≤ ${VX} ≤ 0`, false], [`${MINUS}${c} &lt; ${VX} &lt; ${c}`, false], [`${VX} &lt; ${MINUS}${c} 또는 ${VX} = 0`, false]];
        const series = `${VX} + ${VX}${par(rq)} + ${VX}${par(rq)}${sup(2)} + ⋯`;
        return choose(d, `다음 등비급수가 수렴하도록 하는 실수 ${VX}의 값의 범위는?`, rows.map(([h, ok]) => [nb(h), ok]), {
          figure: hx(series),
          explain: `첫째항이 ${VX}, 공비가 ${rq}이므로 ${nb(VX + ' = 0')} 또는 ${nb(MINUS + '1 &lt; ' + rq + ' &lt; 1')}이어야 한다. ${nb(rq + ' &gt; ' + MINUS + '1')}, 곧 ${nb(ms('x^2') + (sg > 0 ? ' ' + MINUS + ' ' : ' + ') + (c === 1 ? '' : c) + VX + ' + 2 &gt; 0')}은 판별식이 음수라 늘 참이고, ${nb(rq + ' &lt; 1')}에서 ${nb(sg > 0 ? '0 &lt; ' + VX + ' &lt; ' + c : MINUS + c + ' &lt; ' + VX + ' &lt; 0')}이다. ${nb(VX + ' = 0')}을 더하면 ${nb(hi)}이다.`
        });
      }),
      // ② 두 합으로 a₁, b₁ 을 공비의 식으로 → 조건 b₁ = u a₁ + v 로 공비 → 곱의 수열(공비 r²)의 합(네 단계)
      H('hard-samer', '공비가 같은 두 등비수열의 곱의 급수', '②13', (d) => {
        const r = d.pick([Q(1, 2), Q(2, 3), Q(1, 3), Q(3, 4), Q(1, 4), Q(2, 5), Q(3, 5)]), A = d.int(2, 9), u = d.pick([2, 3]), vv = d.int(1, 3);
        const w = qdiv(Q(vv), qsub(Q(1), r));
        if (!isInt(w)) return null;
        const Bv = u * A + w.p, a1 = qmul(Q(A), qsub(Q(1), r)), b1 = qmul(Q(Bv), qsub(Q(1), r)), ans = qdiv(qmul(a1, b1), qsub(Q(1), sq2(r)));
        if (ans.q > 99 || Math.abs(ans.p) > 9999) return null;
        return val(`공비가 같은 두 등비수열 ${SEQA}, ${SEQB}에 대하여 ${nb(ms('b_1') + ' = ' + u + ms('a_1') + ' + ' + vv)}이고 ${nb(SI(AN) + ' = ' + A)}, ${nb(SI(BN) + ' = ' + Bv)}일 때, 급수 ${SI(ms('a_nb_n'))}의 합은?`, ans, {
          explain: `공비를 ${jh(VR, '이라/라')} 하면 ${nb(ms('a_1') + ' = ' + A + par('1 ' + MINUS + ' ' + VR))}, ${nb(ms('b_1') + ' = ' + Bv + par('1 ' + MINUS + ' ' + VR))}이다. ${nb(Bv + par('1 ' + MINUS + ' ' + VR) + ' = ' + u * A + par('1 ' + MINUS + ' ' + VR) + ' + ' + vv)}에서 ${nb('1 ' + MINUS + ' ' + VR + ' = ' + tq(qsub(Q(1), r)))}, ${nb(VR + ' = ' + tq(r))}이고 ${nb(ms('a_1') + ' = ' + tq(a1))}, ${nb(ms('b_1') + ' = ' + tq(b1))}이다. 수열 ${nb('{' + ms('a_nb_n') + '}')}은 첫째항 ${tq(qmul(a1, b1))}, 공비 ${tq(sq2(r))}인 등비수열이므로 합은 ${tq(ans)}이다.`,
          facts: { value: `${A}*(${vv}/(${Bv}-${u}*${A}))*${Bv}*(${vv}/(${Bv}-${u}*${A}))/(1-(1-${vv}/(${Bv}-${u}*${A}))**2)` }
        });
      }),
      // ① a²/(1 − r²) = a/(1 − r) × a/(1 + r) 로 갈라 보아야 첫째항·공비를 따로 구하지 않고 곧 나온다.
      H('hard-oddeven', '홀수째·짝수째 항의 차와 제곱의 급수로 Σaₙ 구하기', '②14', (d) => {
        const a = d.until(() => d.int(-6, 8), (x) => x !== 0), r = d.pick([Q(1, 2), Q(1, 3), Q(2, 3), Q(-1, 2), Q(-1, 3), Q(1, 4), Q(3, 4), Q(2, 5)]);
        const P = qdiv(Q(a), qadd(Q(1), r)), Qv = qdiv(Q(a * a), qsub(Q(1), sq2(r))), v = qdiv(Q(a), qsub(Q(1), r));
        if (P.q > 60 || Qv.q > 60 || Math.abs(Qv.p) > 999) return null;
        return val(`등비수열 ${SEQA}에 대하여 ${nb(SI(par(ms('a_{2n-1}') + ' ' + MINUS + ' ' + ms('a_{2n}'))) + ' = ' + tq(P))}, ${nb(SI(ms('a_n^2')) + ' = ' + tq(Qv))}일 때, 급수 ${SI(AN)}의 합은?`, v, {
          explain: `첫째항을 ${V('a')}, 공비를 ${jh(VR, '이라/라')} 하면 ${nb(ms('a_{2n-1}') + ' ' + MINUS + ' ' + ms('a_{2n}') + ' = ' + V('a') + par('1 ' + MINUS + ' ' + VR) + par(ms('r^2')) + sup(ms('n-1')))}이므로 ${nb(frac(V('a'), '1 + ' + VR) + ' = ' + tq(P))}이다. ${nb(frac(ms('a^2'), '1 ' + MINUS + ' ' + ms('r^2')) + ' = ' + frac(V('a'), '1 ' + MINUS + ' ' + VR) + ' × ' + frac(V('a'), '1 + ' + VR) + ' = ' + tq(Qv))}이므로 ${nb(SI(AN) + ' = ' + frac(V('a'), '1 ' + MINUS + ' ' + VR) + ' = ' + tq(Qv) + ' ÷ ' + par(tq(P)) + ' = ' + tq(v))}이다.`,
          facts: { value: `${jq(Qv)}/${jq(P)}` }
        });
      }),
      // ② 두 조건 → 공비의 합·곱 → 공비 → 제곱과 곱의 세 등비급수(네 단계)
      H('hard-tworatio', '두 등비수열의 공비의 합과 곱으로 Σ(aₙ + bₙ)² 구하기', '②15', (d) => {
        const [r, s] = d.pick([[Q(-1, 3), Q(1, 3)], [Q(1, 2), Q(-1, 4)], [Q(1, 3), Q(-1, 2)], [Q(1, 2), Q(-1, 2)], [Q(2, 3), Q(-1, 3)], [Q(1, 4), Q(-1, 4)], [Q(1, 2), Q(1, 3)], [Q(-1, 2), Q(1, 4)]]);
        const Uv = qadd(qdiv(Q(1), qsub(Q(1), r)), qdiv(Q(1), qsub(Q(1), s))), Wv = qdiv(Q(1), qsub(Q(1), qmul(r, s)));
        const sa = qdiv(Q(1), qsub(Q(1), sq2(r))), sb = qdiv(Q(1), qsub(Q(1), sq2(s))), ans = qadd(qadd(sa, sb), qmul(Q(2), Wv));
        const sum = qadd(r, s), prod = qmul(r, s);
        return val(`${nb(ms('a_1') + ' = ' + ms('b_1') + ' = 1')}인 두 등비수열 ${SEQA}, ${SEQB}에 대하여 두 급수 ${SI(AN)}, ${SI(BN)}이 모두 수렴하고 ${nb(SI(par(AN + ' + ' + BN)) + ' = ' + tq(Uv))}, ${nb(SI(ms('a_nb_n')) + ' = ' + tq(Wv))}일 때, 급수 ${SI(par(AN + ' + ' + BN) + sup(2))}의 합은?`, ans, {
          explain: `두 공비를 ${VR}, ${V('s')}라 하면 ${nb(frac(1, '1 ' + MINUS + ' ' + VR) + ' + ' + frac(1, '1 ' + MINUS + ' ' + V('s')) + ' = ' + tq(Uv))}, ${nb(frac(1, '1 ' + MINUS + ' ' + VR + V('s')) + ' = ' + tq(Wv))}에서 ${nb(VR + V('s') + ' = ' + tq(prod))}, ${nb(VR + ' + ' + V('s') + ' = ' + tq(sum))}이므로 두 공비는 ${tq(r)}, ${tq(s)}이다. ${nb(par(AN + ' + ' + BN) + sup(2) + ' = ' + ms('a_n^2') + ' + ' + ms('b_n^2') + ' + 2' + ms('a_nb_n'))}이고 세 급수가 모두 수렴하므로 합은 ${nb(tq(sa) + ' + ' + tq(sb) + ' + 2 × ' + tq(Wv) + ' = ' + tq(ans))}이다.`,
          facts: { value: `1/(1-${jq(r)}**2)+1/(1-${jq(s)}**2)+2*${jq(Wv)}`, derived: [r.p < 0 ? -r.p : r.p, r.q, s.p < 0 ? -s.p : s.p, s.q] }
        });
      }),
      // ① 공비 = (개수의 비) × (닮음비)² — 개수가 k배로 늘어나는 것을 빠뜨리면 공비가 1/k² 이 된다.
      H('hard-circles', '개수가 늘어나며 작아지는 원의 넓이의 합', '②23', (d) => {
        const k = d.pick([2, 3]), R = k === 2 ? d.pick([2, 3, 4, 5, 6]) : d.pick([2, 4, 6]);
        const p = k === 2 ? 2 * R * R : 3 * R * R / 2;
        const how = k === 2 ? '반지름을 지름으로 하는 원 2개' : '지름을 삼등분한 각 선분을 지름으로 하는 원 3개';
        return piAns(`그림과 같이 반지름의 길이가 ${R}인 원을 그리고, 이 원의 ${how}를 원 안에 그린다. 새로 그린 원마다 같은 방법으로 원 ${k}개씩을 그리는 일을 한없이 되풀이할 때, 그린 원들의 넓이의 합은 ${V('p')}π이다. 상수 ${V('p')}의 값은?`, p, 1, {
          signed: false, figure: splitCircles(k),
          explain: `한 번 그릴 때마다 반지름은 ${frac(1, k)}배, 원의 개수는 ${k}배가 되므로 넓이의 합은 ${nb(k + ' × ' + par(frac(1, k)) + sup(2) + ' = ' + frac(1, k))}배가 된다. 따라서 합은 ${nb(frac(R * R + 'π', '1 ' + MINUS + ' ' + frac(1, k)) + ' = ' + p + 'π')}이다.`,
          facts: { value: `${R}*${R}/(1-1/${k})` }
        });
      }),
      // ② 교점 A₁ → 정사각형 − 사분원 = S₁ → 닮음비 1/2 → 넓이의 공비 1/4 → 합(네 단계)
      H('hard-semicircle', '반원과 직선이 되풀이되는 도형의 넓이의 합', '②25', (d) => {
        const R = d.pick([3, 6, 9, 12]), A = 4 * R * R / 3, Bc = -R * R / 3;
        const arcLow = (cx, cy, r) => (x) => cy - Math.sqrt(Math.max(r * r - (x - cx) * (x - cx), 0));
        const half = (cx, cy, r, name) => ({ x: (t) => cx + r * Math.cos(t), y: (t) => cy + r * Math.sin(t), from: -Math.PI / 2, to: Math.PI / 2, name });
        const fig = plot({
          x: [-0.25, 2.25], y: [-0.25, 2.25], u: 92, xt: [], yt: [{ v: 2, t: String(2 * R) }],
          params: [Object.assign(half(0, 1, 1, 'D_1'), { at: Math.PI / 3, side: 'ur' }), Object.assign(half(1, 0.5, 0.5, 'D_2'), { at: Math.PI / 3, side: 'ur' }), half(1.5, 0.25, 0.25)],
          fill: [{ f: arcLow(0, 1, 1), from: 0, to: 1 }, { f: arcLow(1, 0.5, 0.5), from: 1, to: 1.5 }, { f: arcLow(1.5, 0.25, 0.25), from: 1.5, to: 1.75 }],
          segs: [{ p: [0, 0], q: [1, 1] }, { p: [1, 0], q: [1, 1] }, { p: [1, 0], q: [1.5, 0.5] }, { p: [1.5, 0], q: [1.5, 0.5] }, { p: [1.5, 0], q: [1.75, 0.25] }, { p: [1.75, 0], q: [1.75, 0.25] }],
          dots: [{ x: 0, y: 2, name: 'A_0', side: 'r', said: '반원 D_1의 위쪽 끝 A_0' }, { x: 1, y: 1, name: 'A_1', side: 'ur', said: '직선과 반원 D_1의 교점 A_1' }, { x: 1, y: 0, name: 'B_1', side: 'd', said: 'A_1에서 x축에 내린 수선의 발 B_1' }, { x: 1.5, y: 0.5, name: 'A_2', side: 'ur', said: '직선과 반원 D_2의 교점 A_2' }],
          say: '반원 D1의 지름은 원점과 A0을 잇는 선분이다. 칠한 부분이 S1, S2, S3이다.'
        });
        return inline(`그림과 같이 원점과 점 ${nb(ms('A_0') + '(0, ' + 2 * R + ')')}을 지름의 양 끝으로 하는 원의 오른쪽 반원을 ${ms('D_1')}이라 하자. 원점을 지나고 기울기가 1인 직선이 ${ms('D_1')}과 제1사분면에서 만나는 점을 ${ms('A_1')}, 점 ${ms('A_1')}에서 ${VX}축에 내린 수선의 발을 ${ms('B_1')}이라 하고, 반원 ${ms('D_1')}, ${VX}축, 선분 ${ms('A_1B_1')}로 둘러싸인 도형의 넓이를 ${ms('S_1')}이라 하자. 선분 ${ms('A_1B_1')}을 지름으로 하는 원의 오른쪽 반원 ${ms('D_2')}와 점 ${ms('B_1')}을 지나고 기울기가 1인 직선으로 같은 방법을 되풀이하여 ${ms('S_2')}, ${ms('S_3')}, …을 얻을 때, 급수 ${SI(SN)}의 합은?`, `{0} {1}π`, [{ answer: A, signed: true }, { answer: Bc, signed: true }], {
          figure: fig,
          shown: nb(A + ' ' + MINUS + ' ' + Math.abs(Bc) + 'π'),
          explain: `반원 ${ms('D_1')}의 중심은 ${nb('(0, ' + R + ')')}, 반지름은 ${R}이고 ${nb(ms('A_1') + '(' + R + ', ' + R + ')')}이다. ${ms('S_1')}은 한 변이 ${R}인 정사각형에서 반지름 ${R}인 사분원을 뺀 넓이 ${nb(R * R + ' ' + MINUS + ' ' + frac(R * R + 'π', 4))}이다. 다음 도형은 닮음비가 ${frac(1, 2)}이라 넓이는 ${frac(1, 4)}배씩 줄어들므로 합은 ${nb(frac(R * R + ' ' + MINUS + ' ' + frac(R * R + 'π', 4), '1 ' + MINUS + ' ' + frac(1, 4)) + ' = ' + A + ' ' + MINUS + ' ' + Math.abs(Bc) + 'π')}이다.`,
          facts: { calc: [[`4*${2 * R}*${2 * R}/12`, 0], [`0-${2 * R}*${2 * R}/12`, 1]], derived: [4, 12] }
        });
      }),
      // ② 넓이를 r = m/(m + n) 으로 → 공비 (1 − r)² → 합 r/(2 − r) → 거꾸로 r → 서로소인 m, n(네 단계)
      H('hard-mnsq', '비율로 나누어 되풀이한 정사각형의 넓이의 합에서 비 구하기', '②27', (d) => {
        const [m, n] = d.pick([[2, 5], [1, 2], [1, 3], [2, 3], [3, 4], [1, 4], [3, 5], [2, 7], [3, 7], [4, 5]]);
        const T = Q(m, m + 2 * n), g = gcd(2 * T.p, T.q - T.p);
        return M(`그림과 같이 한 변의 길이가 1인 정사각형 ABCD에서 변 AB와 변 AD를 각각 ${nb(V('m') + ' : ' + V('n'))}으로 내분하는 점을 지나고 변에 평행한 두 직선을 그어 만든 네 사각형 가운데 꼭짓점 A 쪽 정사각형의 넓이를 ${ms('S_1')}, 꼭짓점 C 쪽 정사각형을 ${ms('A_1B_1CD_1')}이라 하자. 정사각형 ${ms('A_1B_1CD_1')}에서 같은 방법으로 얻은 꼭짓점 ${ms('A_1')} 쪽 정사각형의 넓이를 ${ms('S_2')}라 하고, 이와 같은 과정을 한없이 되풀이하였더니 ${nb(sum('k=1', '∞', ms('S_k')) + ' = ' + tq(T))}이었다. 서로소인 자연수 ${V('m')}, ${V('n')}의 값은?`, [{ lead: V('m') + ' =', answer: m }, { lead: V('n') + ' =', answer: n }], {
          figure: ratioSquares(),
          shown: `${V('m')} = ${m}, ${V('n')} = ${n}`,
          explain: `${nb(VR + ' = ' + frac(V('m'), V('m') + ' + ' + V('n')))}이라 하면 ${nb(ms('S_1') + ' = ' + ms('r^2'))}이고, 다음 정사각형의 한 변은 ${nb('1 ' + MINUS + ' ' + VR)}이므로 넓이는 ${nb(par('1 ' + MINUS + ' ' + VR) + sup(2))}배씩 줄어든다. 합은 ${nb(frac(ms('r^2'), '1 ' + MINUS + ' ' + par('1 ' + MINUS + ' ' + VR) + sup(2)) + ' = ' + frac(VR, '2 ' + MINUS + ' ' + VR) + ' = ' + tq(T))}에서 ${nb(VR + ' = ' + tq(Q(m, m + n)))}이므로 ${nb(V('m') + ' : ' + V('n') + ' = ' + m + ' : ' + n)}이다.`,
          facts: { calc: [[`2*${T.p}/${g}`, 0], [`(${T.q}-${T.p})/${g}`, 1]], derived: [g] }
        });
      }),
      // ② 닮음비의 이차방정식 → 첫째 둘레 → 공비 → 합의 유리화(네 단계)
      H('hard-golden', '닮은 직사각형을 잘라 낼 때 둘레의 합', '②28', (d) => {
        const L = d.pick([1, 2, 3, 4, 5]);
        return inline(`그림과 같이 긴 변의 길이가 ${L}인 직사각형 ${ms('R_1')}에서 짧은 변을 한 변으로 하는 정사각형 ${ms('S_1')}을 잘라 내고 남은 직사각형을 ${ms('R_2')}라 하면 ${jh(ms('R_1'), '과/와')} ${ms('R_2')}는 서로 닮음이다. ${ms('R_2')}에서 정사각형 ${ms('S_2')}를 잘라 내고 남은 직사각형 ${ms('R_3')}도 ${ms('R_2')}와 닮음이고, 이와 같은 방법으로 직사각형 ${ms('R_4')}, ${ms('R_5')}, …를 한없이 만들어 간다. 직사각형 ${ms('R_n')}의 둘레의 길이를 ${ms('l_n')}이라 할 때, 급수 ${SI(ms('l_n'))}의 합은?`, `{0} {1}${rt(5)}`, [{ answer: 4 * L, signed: true }, { answer: 2 * L, signed: true }], {
          figure: goldRects(L),
          shown: nb(4 * L + ' + ' + 2 * L + rt(5)),
          explain: `${ms('R_1')}의 짧은 변을 ${VX}라 하면 ${nb(L + ' : ' + VX + ' = ' + VX + ' : ' + par(L + ' ' + MINUS + ' ' + VX))}에서 ${nb(ms('x^2') + ' + ' + L + VX + ' ' + MINUS + ' ' + L * L + ' = 0')}, ${nb(VX + ' = ' + frac((L === 1 ? '' : L) + par(rt(5) + ' ' + MINUS + ' 1'), 2))}이다. 닮음비 ${nb(jh(frac(rt(5) + ' ' + MINUS + ' 1', 2), '이/가'))} 공비이고 ${nb(ms('l_1') + ' = 2' + par(L + ' + ' + VX) + ' = ' + (L === 1 ? '' : L) + par('1 + ' + rt(5)))}이므로 합은 ${nb(frac((L === 1 ? '' : L) + par('1 + ' + rt(5)), '1 ' + MINUS + ' ' + frac(rt(5) + ' ' + MINUS + ' 1', 2)) + ' = ' + 4 * L + ' + ' + 2 * L + rt(5))}이다.`,
          facts: { calc: [[`4*${L}`, 0], [`2*${L}`, 1]], derived: [4, L] }
        });
      }),
      // ② 변의 개수 4배 · 길이 1/3배 → 둘레의 공비 4/3(발산), 새 삼각형의 넓이 공비 4/9 → 넓이의 합(네 단계)
      H('hard-koch', '코흐 눈송이의 둘레와 넓이', '②29', (d, n) => {
        const k = d.int(2, 12), S1 = 5 * k, l1 = 3 * d.int(2, 8);
        if (n === 0) {
          return pos(`그림과 같이 넓이가 ${S1}인 정삼각형 ${ms('A_1')}의 각 변을 삼등분하여 가운데 부분을 한 변으로 하는 정삼각형을 바깥쪽에 그리고 가운데 부분을 지운 도형을 ${ms('A_2')}라 하자. ${ms('A_2')}의 각 변에 같은 과정을 되풀이하여 ${ms('A_3')}, ${ms('A_4')}, …를 만들 때, ${ms('A_n')}의 넓이를 ${SN}이라 하자. ${LIM(SN)}의 값은?`, Q(8 * k), {
            figure: kochSteps(),
            explain: `${ms('A_n')}의 변의 개수는 ${nb('3 × ' + ms('4^{n-1}'))}이고, 새로 붙는 정삼각형 하나의 넓이는 앞 단계의 ${frac(1, 9)}이다. 늘어나는 넓이 ${nb(ms('h_n') + ' = ' + ms('S_{n+1}') + ' ' + MINUS + ' ' + SN)}은 ${nb(ms('h_1') + ' = 3 × ' + frac(S1, 9) + ' = ' + tq(Q(S1, 3)))}이고 ${nb(frac(4, 9))}배씩 줄어든다. 따라서 ${nb(LIM(SN) + ' = ' + S1 + ' + ' + frac(tq(Q(S1, 3)), '1 ' + MINUS + ' ' + frac(4, 9)) + ' = ' + S1 + ' + ' + 3 * k + ' = ' + 8 * k)}이다.`,
            facts: { value: `${S1}+(${S1}/3)/(1-4/9)`, derived: [3, 4, 9] }
          });
        }
        // 보기: [둘레의 극한, 넓이의 극한] — 옳은 것은 (∞, 8S₁/5) 하나뿐(코드가 셈한 값과 맞춰 가린다)
        const right = ['∞', tq(Q(8 * S1, 5))];
        const opts = [['∞', tq(Q(8 * S1, 5))], ['∞', tq(Q(4 * S1, 3))], [String(4 * l1), tq(Q(8 * S1, 5))], ['∞', '∞'], [String(2 * l1), tq(Q(9 * S1, 5))]];
        const rows = opts.map(([a, b2]) => [nb(LIM(ms('l_n')) + ' = ' + a + ', ' + LIM(SN) + ' = ' + b2), a === right[0] && b2 === right[1]]);
        return choose(d, `그림과 같이 둘레의 길이가 ${l1}, 넓이가 ${S1}인 정삼각형 ${ms('A_1')}의 각 변을 삼등분하여 가운데 부분을 한 변으로 하는 정삼각형을 바깥쪽에 그리고 가운데 부분을 지운 도형을 ${ms('A_2')}라 하자. 이와 같은 과정을 되풀이하여 얻은 ${ms('A_n')}의 둘레의 길이를 ${ms('l_n')}, 넓이를 ${SN}이라 할 때, 옳은 것은?`, rows, {
          figure: kochSteps(),
          explain: `한 번 되풀이할 때마다 변의 개수는 4배, 한 변의 길이는 ${frac(1, 3)}배이므로 ${nb(ms('l_n') + ' = ' + l1 + ' × ' + par(frac(4, 3)) + sup(ms('n-1')))}이고 ${nb(frac(4, 3) + ' &gt; 1')}이라 ${nb(LIM(ms('l_n')) + ' = ∞')}이다. 넓이는 첫째 단계에 ${tq(Q(S1, 3))}만큼 늘고, 늘어나는 넓이가 그다음부터 ${frac(4, 9)}배씩 줄어들므로 ${nb(LIM(SN) + ' = ' + S1 + ' + ' + frac(tq(Q(S1, 3)), '1 ' + MINUS + ' ' + frac(4, 9)) + ' = ' + 8 * k)}이다. 둘레는 한없이 길어지지만 넓이는 유한하다.`
        });
      }, { count: 2 }),
      // ② 펼친 그림에서 단계마다 직육면체의 치수와 개수(1, 4, 16, …) → 단계의 부피의 합 → 공비 1/3 → 합(네 단계)
      H('hard-card', '프랙털 카드의 직육면체 부피의 합', '②30', (d) => {
        const a = d.pick([6, 12, 18, 24, 30, 36]), b = d.pick([4, 8, 12, 16]);
        const v = a * b * b / 32;
        if (!Number.isInteger(v)) return null;
        return N(`가로, 세로의 길이가 각각 ${a} cm, ${b} cm인 직사각형 모양의 종이를 가로로 길게 반으로 접고, 접은 선의 3등분점에서 접은 높이의 ${frac(1, 2)}만큼 접은 선에 수직으로 잘라 가운데 부분을 안쪽으로 접어 올린다(1단계). 접은 선이 있는 곳마다 그 접은 선의 3등분점에서 이전 단계에서 자른 길이의 ${frac(1, 2)}만큼 잘라 가운데 부분을 안쪽으로 접어 올리는 일을 한없이 되풀이한다. 두 면이 직각이 되게 펼치면 튀어나온 부분은 모두 직육면체 모양일 때, 이 직육면체들의 부피의 합은? (그림은 3단계까지 자른 종이를 펼친 것이다.)`, v, {
          unit: 'cm³', figure: cardSheet(),
          explain: `1단계 직육면체는 가로 ${tq(Q(a, 3))}, 세로와 높이 ${tq(Q(b, 4))}이고 1개이다. 다음 단계마다 접은 선이 4배가 되어 직육면체의 개수는 4배, 가로는 ${frac(1, 3)}배, 세로와 높이는 ${frac(1, 2)}배가 되므로 단계의 부피의 합은 ${nb('4 × ' + frac(1, 3) + ' × ' + par(frac(1, 2)) + sup(2) + ' = ' + frac(1, 3))}배씩 줄어든다. 1단계 부피는 ${nb(tq(Q(a, 3)) + ' × ' + (isInt(Q(b, 4)) ? tq(Q(b, 4)) : par(tq(Q(b, 4)))) + sup(2) + ' = ' + tq(Q(a * b * b, 48)))}이므로 합은 ${nb(frac(tq(Q(a * b * b, 48)), '1 ' + MINUS + ' ' + frac(1, 3)) + ' = ' + v)}(cm³)이다.`,
          facts: { value: `${a}/3*(${b}/4)**2/(1-1/3)`, derived: [3, 4] }
        });
      }),
      // ② x·y 로 갈라 → 각각 공비 −t² 의 등비급수 → 두 합 → 좌표(네 단계)
      H('hard-spiral', '직각으로 꺾이며 움직이는 점이 가까워지는 점', '②31', (d) => {
        const t = d.pick([Q(1, 2), Q(2, 3), Q(3, 5), Q(3, 4), Q(1, 3), Q(2, 5)]), L = d.pick([1, 2, 3, 5]);
        const t2 = sq2(t), den = qadd(Q(1), t2), X = qdiv(Q(L), den), Y = qmul(X, t);
        const pt = (x, y) => nb('(' + tq(x) + ', ' + tq(y) + ')');
        const cands = [[X, Y], [Y, X], [qdiv(Q(L), qsub(Q(1), t2)), qdiv(qmul(Q(L), t), qsub(Q(1), t2))], [qdiv(Q(L), qadd(Q(1), t)), qdiv(qmul(Q(L), t), qadd(Q(1), t))], [X, X], [qdiv(Q(L), qsub(Q(1), t)), Y]];
        const rows = [], seen = new Set();
        for (const [x, y] of cands) { const key = x.p + '/' + x.q + ',' + y.p + '/' + y.q; if (seen.has(key)) continue; seen.add(key); rows.push([pt(x, y), x.p === X.p && x.q === X.q && y.p === Y.p && y.q === Y.q]); }
        const tt = fl(t), path = [[0, 0]], dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]];
        let len = 1;
        for (let i = 0; i < 7; i += 1) { const p = path[i]; path.push([p[0] + dirs[i % 4][0] * len, p[1] + dirs[i % 4][1] * len]); len *= tt; }
        const fig = plot({
          x: [-0.15, 1.25], y: [-0.15, Math.max(tt, 0.5) + 0.3], u: 160, xt: [{ v: 1, t: String(L) }],
          segs: path.slice(0, 7).map((p, i) => ({ p, q: path[i + 1] })),
          dots: [{ x: 1, y: 0, name: 'P_1', side: 'ur', said: 'x축 위의 점 P_1' }, { x: 1, y: tt, name: 'P_2', side: 'ur', said: 'P_1에서 위쪽으로 간 점 P_2' }, { x: 1 - tt * tt, y: tt, name: 'P_3', side: 'u', said: 'P_2에서 왼쪽으로 간 점 P_3' }],
          say: '점 P가 원점에서 오른쪽, 위쪽, 왼쪽, 아래쪽으로 차례로 꺾이며 움직인다.'
        });
        return choose(d, `그림과 같이 좌표평면 위의 점 ${ms('P_n')}이 원점 O를 출발하여 ${VX}축 또는 ${V('y')}축에 평행하게 오른쪽, 위쪽, 왼쪽, 아래쪽 차례로 꺾이며 ${ms('P_1')}, ${ms('P_2')}, ${ms('P_3')}, …으로 움직인다. ${nb(ms('OP_1') + ' = ' + L)}이고 ${nb(ms('P_1P_2') + ' = ' + tq(t) + ms('OP_1'))}, ${nb(ms('P_2P_3') + ' = ' + tq(t) + ms('P_1P_2'))}, …일 때, 점 ${ms('P_n')}이 한없이 가까워지는 점의 좌표는?`, rows.slice(0, 5), {
          figure: fig,
          explain: `${VX}좌표는 ${nb(L + ' ' + MINUS + ' ' + (L === 1 ? '' : L) + par(tq(t)) + sup(2) + ' + ' + (L === 1 ? '' : L) + par(tq(t)) + sup(4) + ' ' + MINUS + ' ⋯')}로 공비 ${MINUS}${tq(t2)}인 등비급수이므로 ${nb(frac(L, '1 + ' + tq(t2)) + ' = ' + tq(X))}이다. ${V('y')}좌표는 ${nb((L === 1 ? '' : L + ' × ') + tq(t) + ' ' + MINUS + ' ' + (L === 1 ? '' : L) + par(tq(t)) + sup(3) + ' + ⋯ = ' + tq(Y))}이다. 따라서 ${pt(X, Y)}이다.`
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
