// 고등학교 기하 Ⅲ-2 벡터의 성분과 내적(11-4-7) — 뒤쪽 묶음(벡터의 내적, 성분으로 나타낸 내적과 내적의 성질, 두 벡터가 이루는 각과 수직, 도형에서 내적의 활용).
// 단원 틀과 싣는 기준·뺀 것은 11-4-7a.js 머리에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 공간①15 = 11-4-5 꼴 목록의 15번.
// 내적의 정의는 교과서를 따라 θ가 90°보다 크면 −|a⃗||b⃗|cos(180° − θ)로 풀이를 쓴다(두 벡터가 이루는 각도 cos(180° − θ)로 구한다).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, N, M, C, inline } = B.kit;
  const { MINUS, Q, qadd, qmul, gcd, tx, V, nb, poly, rt, sqParts, radAns, SG } = B.kit.mid;
  const { vec, jh, qAns, fn, space } = B.kit.hs;
  const hms = B.kit.hs.ms;
  const { Board, at, awayFrom } = B.kit.mgeo;
  const K = B.kit.u1147;
  const { UNIT, T, num, jn, par, tup, pt, va, vb, vc, vk, vx, vy, VV, dotv, addv, subv, mulv, sq, dotJ, dotT, dt, ab, ratio, NOTE1, isSqFree, isSquare, rad, rootQ, sRootQ,
    valsQ, radFix, degAns, rowsFig, choose, RATIOS, nameOut, centerOf, onSeg } = K;
  const TH = V('θ'), COS = fn('cos'), DEG = '°';
  const sqJ = (u) => u.map((x) => jn(x) + '*' + jn(x)).join('+');
  const nz = (d, lo, hi) => { if (lo === 0 && hi === 0) throw new Error('0이 아닌 수를 고를 수 없다'); let x = 0; while (x === 0) x = d.int(lo, hi); return x; };
  const vecOf = (d, dim, lo, hi) => Array.from({ length: dim }, () => d.int(lo, hi));
  const nzVec = (d, dim, lo, hi) => Array.from({ length: dim }, () => nz(d, lo, hi));
  const sqH = (h) => '|' + h + '|<sup>2</sup>';
  // 검사 식에서 √n 을 간단히 한 글(2√2)에 보이는 수로 n 을 적는다: 8 → 2*2*2
  const exR = (n2) => { const [c0, t0] = sqParts(n2); return t0 === 1 ? `${c0}*${c0}` : c0 === 1 ? String(t0) : `${c0}*${c0}*${t0}`; };
  // cos 의 값 글
  const COSV = { 0: '1', 30: frac(rt('3'), 2), 45: frac(rt('2'), 2), 60: frac(1, 2), 90: '0' };
  // 내적과 두 크기의 제곱으로 두 벡터가 이루는 각(도). 보기 좋은 각이 아니면 null.
  const angOf = (dt0, s1, s2) => {
    const P = dt0 * dt0, R = s1 * s2;
    if (dt0 === 0) return 90;
    if (4 * P === R) return dt0 > 0 ? 60 : 120;
    if (2 * P === R) return dt0 > 0 ? 45 : 135;
    if (4 * P === 3 * R) return dt0 > 0 ? 30 : 150;
    if (P === R) return dt0 > 0 ? 0 : 180;
    return null;
  };
  // 각을 구하는 풀이 글(교과서처럼 내적이 음수이면 cos(180° − θ)로). dotH 내적 글, dot 내적 값, magH 두 크기의 곱 글.
  const angWhy = (dotH, dot, magH, deg) => (deg === 90 ? `${nb(dotH + ' = 0')}이므로 ${nb(TH + ' = 90°')}이다.`
    : deg < 90 ? `${nb(dotH + ' = ' + num(dot))} &gt; 0이므로 ${nb(COS + ' ' + TH + ' = ' + frac(num(dot), magH) + ' = ' + COSV[deg])}이고 ${nb(TH + ' = ' + deg + DEG)}이다.`
      : `${nb(dotH + ' = ' + num(dot))} &lt; 0이므로 ${nb(COS + '(180° ' + MINUS + ' ' + TH + ') = ' + frac(num(-dot), magH) + ' = ' + COSV[180 - deg])}이고, ${nb('180° ' + MINUS + ' ' + TH + ' = ' + (180 - deg) + DEG)}에서 ${nb(TH + ' = ' + deg + DEG)}이다.`);
  // 크기의 곱 √(s1 s2) 을 간단히 한 글
  const magOf = (s1, s2) => rad(s1 * s2);
  const vsum = (p, q) => poly([[p, va], [q, vb]]);   // pa⃗ + qb⃗

  // ── 벡터의 내적(뜻) ──
  B.addTypes(UNIT, 'dot', [
    T('dot-def', '크기와 끼인각으로 내적 구하기', '②1', (d) => {
      const th = d.pick([30, 45, 60, 90, 120, 135, 150]), p = d.int(1, 5), q = d.int(2, 6), acute = th < 90, base = acute ? th : 180 - th;
      let aH = String(p), mag, value;
      if (base === 45) { aH = (p === 1 ? '' : p) + rt('2'); mag = p * q; value = `${p}*${q}`; }
      else if (base === 30) { if ((p * q) % 2) return null; aH = (p === 1 ? '' : p) + rt('3'); mag = 3 * p * q / 2; value = `${p}*${q}*3/2`; }
      else if (base === 60) { if ((p * q) % 2) return null; mag = p * q / 2; value = `${p}*${q}/2`; }
      else { mag = 0; value = '0'; }
      const ans = th > 90 ? -mag : mag;
      const why = th === 90 ? `두 벡터가 이루는 각의 크기가 90°이므로 ${nb(dt(va, vb) + ' = ' + ab(va) + ab(vb) + COS + ' 90° = 0')}이다.`
        : acute ? `${nb(dt(va, vb) + ' = ' + ab(va) + ab(vb) + COS + ' ' + th + DEG + ' = ' + aH + ' × ' + q + ' × ' + COSV[th] + ' = ' + num(ans))}이다.`
          : `θ가 90°보다 크므로 ${nb(dt(va, vb) + ' = ' + MINUS + ab(va) + ab(vb) + COS + '(180° ' + MINUS + ' ' + th + '°)')} = ${nb(MINUS + aH + ' × ' + q + ' × ' + COSV[base] + ' = ' + num(ans))}이다.`;
      return N(`두 벡터 ${va}, ${jh(vb, '이/가')} ${nb(ab(va) + ' = ' + aH)}, ${nb(ab(vb) + ' = ' + q)}이고, 두 벡터 ${va}, ${jh(vb, '이/가')} 이루는 각의 크기가 ${th}°일 때, ${dt(va, vb)}의 값은?`, ans, {
        signed: true, explain: why,
        facts: { value: th > 90 ? `0-${value}` : value, derived: [2, 3] }
      });
    }),
    T('dot-plane', '평면도형에서 두 벡터의 내적', '②2', (d, n) => {
      if (n === 0) {
        // ∠B = 90° 인 직각삼각형: AB⃗ · AC⃗ = AB², CA⃗ · CB⃗ = CB²
        const p = d.int(2, 7), w = d.int(2, 7), h2 = p * p + w * w, fromA = d.bool();
        if (p === w) return null;
        const k = 140 / Math.max(p, w), A = [0, 0], Bp = [p * k, 0], Cp = [p * k, -w * k];
        const g = Board().poly([A, Bp, Cp]);
        g.corner(Bp, A, Cp, '');
        const cen = centerOf([A, Bp, Cp]);
        nameOut(g, A, 'A', cen); nameOut(g, Bp, 'B', cen); nameOut(g, Cp, 'C', cen);
        if (fromA) g.beside(A, Bp, String(p), cen); else g.beside(Bp, Cp, String(w), cen);
        const hypH = rad(h2), [hc, ht] = sqParts(h2), plainHyp = ht === 1 ? String(hc) : (hc === 1 ? '' : hc) + '√' + ht;
        const figure = g.svg(`∠B = 90°인 직각삼각형 ABC(A 왼쪽, B 오른쪽 아래, C 오른쪽 위). ${fromA ? '변 AB의 길이 ' + B.kit.josa(p, '이/가') : '변 BC의 길이 ' + B.kit.josa(w, '이/가')} 적혀 있다. 빗변 AC의 길이는 ${plainHyp}.`);
        const leg = fromA ? p : w, X = fromA ? 'A' : 'C', Y = fromA ? 'B' : 'B', Z = fromA ? 'C' : 'A';
        return N(`그림과 같이 ${nb('∠B = 90°')}, ${nb(SG(X + Y) + ' = ' + leg)}, ${nb(SG('AC') + ' = ' + hypH)}인 직각삼각형 ABC에서 ${dt(vec(X + Y), vec(X + Z))}의 값은?`, leg * leg, {
          figure,
          explain: `두 벡터 ${vec(X + Y)}, ${jh(vec(X + Z), '이/가')} 이루는 각은 ∠${X}이고 ${nb(COS + ' ' + X + ' = ' + frac(SG(X + Y), SG('AC')))}이므로 ${nb(dt(vec(X + Y), vec(X + Z)) + ' = ' + SG(X + Y) + ' × ' + SG('AC') + ' × ' + frac(SG(X + Y), SG('AC')) + ' = ' + SG(X + Y) + '<sup>2</sup> = ' + leg * leg)}이다.`,
          facts: { value: `${leg}*${leg}` }
        });
      }
      if (n === 1) {
        const p = d.int(2, 6), q = d.int(2, 7), angB = d.pick([60, 120]);
        if ((p * q) % 2 || p === q) return null;
        const v1 = angB === 60 ? -p * q / 2 : p * q / 2, v2 = -v1;
        const k = 130 / (q + p * 0.5), Bp = [0, 0], Cp = [q * k, 0], A = at(Bp, p * k, angB), D = [A[0] + q * k, A[1]];
        const g = Board().poly([A, Bp, Cp, D]), cen = centerOf([A, Bp, Cp, D]);
        g.angle(Bp, 0, angB, angB + DEG);
        nameOut(g, A, 'A', cen); nameOut(g, Bp, 'B', cen); nameOut(g, Cp, 'C', cen); nameOut(g, D, 'D', cen);
        g.beside(A, Bp, String(p), cen); g.beside(A, D, String(q), cen);
        const figure = g.svg(`평행사변형 ABCD(A 왼쪽 위, B 왼쪽 아래, C 오른쪽 아래, D 오른쪽 위). 변 AB의 길이 ${p}, 변 AD의 길이 ${q}, ∠ABC = ${angB}°.`);
        return M(`그림과 같이 ${nb(SG('AB') + ' = ' + p)}, ${nb(SG('AD') + ' = ' + q)}, ${nb('∠ABC = ' + angB + DEG)}인 평행사변형 ABCD에서 다음 내적의 값을 구하시오.`, [
          { answer: v1, signed: true, lead: dt(vec('AB'), vec('BC')) + ' =' }, { answer: v2, signed: true, lead: dt(vec('AD'), vec('CD')) + ' =' }], {
          figure, shown: `${nb(dt(vec('AB'), vec('BC')) + ' = ' + num(v1))}, ${nb(dt(vec('AD'), vec('CD')) + ' = ' + num(v2))}`,
          explain: `두 벡터 ${vec('AB')}, ${vec('BC')}의 시점을 맞추면 이루는 각은 ${180 - angB}°이므로 ${angB === 60 ? nb(dt(vec('AB'), vec('BC')) + ' = ' + MINUS + p + ' × ' + q + ' × ' + COS + ' 60° = ' + num(v1)) : nb(dt(vec('AB'), vec('BC')) + ' = ' + p + ' × ' + q + ' × ' + COS + ' 60° = ' + num(v1))}이다. ${nb(vec('AD') + ' = ' + vec('BC'))}, ${nb(vec('CD') + ' = ' + MINUS + vec('AB'))}이므로 ${nb(dt(vec('AD'), vec('CD')) + ' = ' + MINUS + dt(vec('BC'), vec('AB')) + ' = ' + num(v2))}이다.`,
          facts: { calc: [[angB === 60 ? `0-${p}*${q}/2` : `${p}*${q}/2`, 0], [angB === 60 ? `${p}*${q}/2` : `0-${p}*${q}/2`, 1]], derived: [2] }
        });
      }
      const s = 2 * d.int(1, 5), [X, Y, Z] = d.shuffle(['A', 'B', 'C']);
      return N(`한 변의 길이가 ${s}인 정삼각형 ABC에서 ${dt(vec(X + Y), vec(X + Z))}의 값은?`, s * s / 2, {
        explain: `${nb(ab(vec(X + Y)) + ' = ' + ab(vec(X + Z)) + ' = ' + s)}이고 두 벡터가 이루는 각의 크기는 60°이므로 ${nb(dt(vec(X + Y), vec(X + Z)) + ' = ' + s + ' × ' + s + ' × ' + COS + ' 60° = ' + s * s / 2)}이다.`,
        facts: { value: `${s}*${s}/2`, derived: [2] }
      });
    }, { count: 3 }),
    T('dot-cube', '정육면체에서 두 벡터의 내적', '②3', (d) => {
      const s = d.int(1, 3);
      const P = { H: [0, 0, 0], E: [s, 0, 0], F: [s, s, 0], G: [0, s, 0], D: [0, 0, s], A: [s, 0, s], B: [s, s, s], C: [0, s, s] };
      const vOf = (nm) => subv(P[nm[1]], P[nm[0]]);
      const PAIRS = [['AB', 'EG'], ['AC', 'AG'], ['AF', 'AG'], ['AB', 'CE'], ['AH', 'BG'], ['AC', 'EG'], ['AD', 'FG'], ['BD', 'BH'], ['AF', 'DG']];
      const pairs = d.shuffle(PAIRS).slice(0, 2).map(([x, y]) => ({ x, y, v: dotv(vOf(x), vOf(y)) }));
      if (pairs.some((p) => p.v === 0)) return null;
      // 꼭짓점 이름은 모서리가 비어 있는 쪽에 손으로 둔다(공용 box 의 자리 잡기는 B, H 를 모서리에 걸친다).
      const u = Math.round(78 / s), sp = space({ u }).box([0, 0, 0], [s, s, s]);
      for (const [nm, ang] of [['A', 180], ['B', 330], ['C', 45], ['D', 110], ['E', 225], ['F', 315], ['G', 0], ['H', 290]]) sp.name(P[nm], nm, ang, 12);
      const fig = sp.svg(`한 모서리의 길이가 ${s}인 정육면체. 윗면 ABCD(A 앞 왼쪽, B 앞 오른쪽, C 뒤 오른쪽, D 뒤 왼쪽), 아랫면 EFGH(E는 A, F는 B, G는 C, H는 D의 바로 아래).`);
      const lead = (p) => dt(vec(p.x), vec(p.y)) + ' =';
      return M(`그림과 같이 한 모서리의 길이가 ${s}인 정육면체에서 다음 내적의 값을 구하시오.`, pairs.map((p) => ({ answer: p.v, signed: true, lead: lead(p) })), {
        figure: fig, shown: pairs.map((p) => nb(dt(vec(p.x), vec(p.y)) + ' = ' + num(p.v))).join(', '),
        explain: `꼭짓점 H를 원점으로 하여 E(${s}, 0, 0), G(0, ${s}, 0), D(0, 0, ${s})이 되게 좌표를 잡으면 ` + pairs.map((p) => `${nb(vec(p.x) + ' = ' + tup(vOf(p.x)))}, ${nb(vec(p.y) + ' = ' + tup(vOf(p.y)))}이므로 ${nb(dt(vec(p.x), vec(p.y)) + ' = ' + num(p.v))}`).join('이고, ') + '이다.',
        facts: { calc: pairs.map((p, i) => [`${jn(p.v / (s * s))}*${s}*${s}`, i]), derived: pairs.map((p) => Math.abs(p.v / (s * s))) }
      });
    }),
    T('dot-area', '넓이와 두 변의 길이로 내적 구하기', '②4', (d) => {
      const [c, si, h] = d.pick([[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [8, 15, 17], [15, 8, 17]]), u = d.int(1, 2), w = d.int(3, 9), area = u * w * si / 2;
      if (!Number.isInteger(area)) return null;
      const AB = h * u;
      return N(`${nb(SG('AB') + ' = ' + AB)}, ${nb(SG('AC') + ' = ' + w)}인 삼각형 ABC의 넓이가 ${area}일 때, ${dt(vec('AB'), vec('AC'))}의 값은? <span style="white-space:nowrap">(단, ∠BAC는 예각이다.)</span>`, u * w * c, {
        explain: `${nb('∠BAC = ' + TH)}라 하면 ${nb(frac(1, 2) + ' × ' + AB + ' × ' + w + ' × ' + fn('sin') + ' ' + TH + ' = ' + area)}이므로 ${nb(fn('sin') + ' ' + TH + ' = ' + frac(si, h))}이다. ${TH}는 예각이므로 ${nb(COS + ' ' + TH + ' = ' + frac(c, h))}이고 ${nb(dt(vec('AB'), vec('AC')) + ' = ' + AB + ' × ' + w + ' × ' + frac(c, h) + ' = ' + u * w * c)}이다.`,
        facts: { value: `2*${area}*${c}/${si}`, derived: [2, c, si] }
      });
    }),
    T('dot-toarea', '내적과 크기로 평행사변형의 넓이 구하기', '②5', (d) => {
      const p = d.int(2, 7), q = d.int(2, 7), angle = d.pick([60, 120]), m = angle === 60 ? p * q / 2 : -p * q / 2, coef = p * q / 2;
      if (!Number.isInteger(m) || coef < 2 || p === q) return null;
      return radAns(`평행사변형 OABC에서 ${nb(vec('OA') + ' = ' + va)}, ${nb(vec('OC') + ' = ' + vb)}라 하자. ${nb(ab(va) + ' = ' + p)}, ${nb(ab(vb) + ' = ' + q)}, ${nb(dt(va, vb) + ' = ' + num(m))}일 때, 평행사변형 OABC의 넓이는?`, coef, 3, {
        explain: `두 벡터 ${va}, ${jh(vb, '이/가')} 이루는 각의 크기를 ${jh(TH, '이라/라')} 하면 ${angle === 60 ? nb(COS + ' ' + TH + ' = ' + frac(m, p * q) + ' = ' + frac(1, 2)) + '이므로 ' + nb(TH + ' = 60°') : nb(COS + '(180° ' + MINUS + ' ' + TH + ') = ' + frac(-m, p * q) + ' = ' + frac(1, 2)) + '이므로 ' + nb(TH + ' = 120°')}이다. 넓이는 ${nb(p + ' × ' + q + ' × ' + fn('sin') + ' 60° = ' + (coef === 1 ? '' : coef) + rt('3'))}이다.`,
        facts: { calc: [[`${p}*${q}/2`, 0], ['3', 1]], derived: [2, 3] }
      });
    })
  ]);

  // ── 성분으로 나타낸 내적과 내적의 성질 ──
  B.addTypes(UNIT, 'dotc', [
    T('dotc-comp', '성분으로 나타낸 두 벡터의 내적', '②6', (d) => {
      const a2 = nzVec(d, 2, -6, 6), b2 = nzVec(d, 2, -6, 6), a3 = vecOf(d, 3, -5, 5), b3 = vecOf(d, 3, -5, 5);
      if (a3.filter((x) => x === 0).length > 1 || b3.filter((x) => x === 0).length > 1) return null;
      return M('다음 두 벡터의 내적을 구하시오.', [{ answer: dotv(a2, b2), signed: true, label: '⑴' }, { answer: dotv(a3, b3), signed: true, label: '⑵' }], {
        figure: rowsFig([`${VV(va, a2)}, ${VV(vb, b2)}`, `${VV(va, a3)}, ${VV(vb, b3)}`], ['⑴', '⑵']),
        shown: `⑴ ${num(dotv(a2, b2))}, ⑵ ${num(dotv(a3, b3))}`,
        explain: `⑴ ${nb(dt(va, vb) + ' = ' + dotT(a2, b2) + ' = ' + num(dotv(a2, b2)))}이다. ⑵ ${nb(dt(va, vb) + ' = ' + dotT(a3, b3) + ' = ' + num(dotv(a3, b3)))}이다.`,
        facts: { calc: [[dotJ(a2, b2), 0], [dotJ(a3, b3), 1]] }
      });
    }),
    T('dotc-unknown', '내적의 값이 주어질 때 미지수 구하기', '②7', (d) => {
      const i = d.int(0, 2), j = (i + d.int(1, 2)) % 3, a = nzVec(d, 3, -4, 4), b = nzVec(d, 3, -4, 4), e = nz(d, -5, 5), sg = d.pick([1, -1]), k0 = nz(d, -5, 5);
      const slope = b[i] + sg * a[j];
      if (slope === 0) return null;
      const rest = [0, 1, 2].filter((l) => l !== i && l !== j), cst = rest.reduce((s, l) => s + a[l] * b[l], 0) + a[j] * e, T0 = cst + slope * k0;
      const aS = a.map((x, l) => (l === i ? vk : x)), bS = b.map((x, l) => (l === j ? poly([[e, ''], [sg, vk]]) : x));
      const cstJ = rest.map((l) => `${jn(a[l])}*${jn(b[l])}`).concat([`${jn(a[j])}*${jn(e)}`]).join('+');
      return qAns(`두 벡터 ${VV(va, aS)}, ${VV(vb, bS)}에 대하여 ${nb(dt(va, vb) + ' = ' + num(T0))}일 때, 실수 ${vk}의 값은?`, k0, {
        signed: true,
        explain: `${nb(dt(va, vb) + ' = ' + poly([[slope, vk], [cst, '']]))}이므로 ${nb(poly([[slope, vk], [cst, '']]) + ' = ' + num(T0))}에서 ${nb(vk + ' = ' + num(k0))}이다.`,
        facts: { value: `(${jn(T0)}-(${cstJ}))/(${jn(b[i])}+${jn(sg)}*${jn(a[j])})` }
      });
    }),
    T('dotc-expr', '성분으로 나타낸 식의 내적', '②8', (d) => {
      const a = nzVec(d, 3, -4, 4), b = nzVec(d, 3, -4, 4);
      const [p, q, r, s] = d.pick([[1, 1, 1, -1], [1, 2, 1, -1], [2, -1, 1, 1], [1, -1, 1, -2], [1, 1, 2, -1]]);
      const u = addv(mulv(p, a), mulv(q, b)), v = addv(mulv(r, a), mulv(s, b)), ans = dotv(u, v);
      const expr = nb('(' + vsum(p, q) + ') · (' + vsum(r, s) + ')');
      const uJ = a.map((x, l) => `(${p}*${jn(x)}+${jn(q)}*${jn(b[l])})`), vJ = a.map((x, l) => `(${r}*${jn(x)}+${jn(s)}*${jn(b[l])})`);
      return N(`두 벡터 ${VV(va, a)}, ${VV(vb, b)}에 대하여 ${expr}의 값은?`, ans, {
        signed: true,
        explain: `${nb(vsum(p, q) + ' = ' + tup(u))}, ${nb(vsum(r, s) + ' = ' + tup(v))}이므로 ${nb(expr + ' = ' + dotT(u, v) + ' = ' + num(ans))}이다.`,
        facts: { value: uJ.map((t, l) => `${t}*${vJ[l]}`).join('+') }
      });
    }),
    T('dotc-dist', '내적의 성질로 식의 값 구하기', '②9', (d) => {
      const p = nz(d, -6, 6), q = nz(d, -6, 6), x = d.int(1, 3), y = d.int(1, 3), z = d.int(1, 3), w = d.int(2, 3);
      if (p === q || Math.abs(p) === Math.abs(q)) return null;
      const v1 = x * p + y * q, v2 = z * p - w * q;
      const e1 = nb(dt(va, '(' + poly([[x, vb], [y, vc]]) + ')')), e2 = nb(dt('(' + poly([[z, vb], [-w, vc]]) + ')', va));
      return M(`세 벡터 ${va}, ${vb}, ${vc}에 대하여 ${nb(dt(va, vb) + ' = ' + num(p))}, ${nb(dt(va, vc) + ' = ' + num(q))}일 때, 다음 값을 구하시오.`, [{ answer: v1, signed: true, label: '⑴' }, { answer: v2, signed: true, label: '⑵' }], {
        figure: rowsFig([e1, e2], ['⑴', '⑵']),
        shown: `⑴ ${num(v1)}, ⑵ ${num(v2)}`,
        explain: `${nb(e1 + ' = ' + poly([[x, dt(va, vb)], [y, dt(va, vc)]]) + ' = ' + num(v1))}, ${nb(e2 + ' = ' + poly([[z, dt(vb, va)], [-w, dt(vc, va)]]) + ' = ' + num(v2))}이다.`,
        facts: { calc: [[`${x}*${jn(p)}+${y}*${jn(q)}`, 0], [`${z}*${jn(p)}-${w}*${jn(q)}`, 1]] }
      });
    }),
    T('dotc-size', '크기와 내적으로 |pa⃗ + qb⃗| 구하기', '②11', (d, n) => {
      const p = d.int(1, 3), q = nz(d, -3, 3);
      if (p === q && Math.abs(p) === 1) return null;
      if (n === 0) {
        const A = d.int(2, 12), Bv = d.int(1, 5), m = nz(d, -6, 6);
        if (m * m >= A * Bv * Bv) return null;
        const V2 = p * p * A + 2 * p * q * m + q * q * Bv * Bv;
        if (!isSquare(V2) || V2 === 0) return null;
        const T0 = Math.sqrt(V2), aH = rad(A), Aexpr = exR(A);
        return N(`두 벡터 ${va}, ${vb}에 대하여 ${nb(ab(va) + ' = ' + aH)}, ${nb(ab(vb) + ' = ' + Bv)}, ${nb(dt(va, vb) + ' = ' + num(m))}일 때, ${ab(vsum(p, q))}의 값은?`, T0, {
          explain: `${nb(sqH(vsum(p, q)) + ' = ' + poly([[p * p, sqH(va)], [2 * p * q, dt(va, vb)], [q * q, sqH(vb)]]))} = ${nb(p * p * A + ' ' + (2 * p * q * m < 0 ? MINUS : '+') + ' ' + Math.abs(2 * p * q * m) + ' + ' + q * q * Bv * Bv + ' = ' + V2)}이므로 ${nb(ab(vsum(p, q)) + ' = ' + T0)}이다.`,
          facts: { value: `(${jn(p)}*${jn(p)}*${Aexpr}+2*${jn(p)}*${jn(q)}*${jn(m)}+${jn(q)}*${jn(q)}*${Bv}*${Bv})/${T0}`, derived: [2, T0] }
        });
      }
      const P = d.int(1, 6), Bv = d.int(1, 6), angle = d.pick([60, 120]), sg = angle === 60 ? 1 : -1;
      const V2 = p * p * P * P + q * q * Bv * Bv + sg * p * q * P * Bv;
      if (V2 <= 0 || isSquare(V2)) return null;
      const [c, t] = sqParts(V2);
      return radFix(`두 벡터 ${va}, ${jh(vb, '이/가')} 이루는 각의 크기가 ${angle}°이고 ${nb(ab(va) + ' = ' + P)}, ${nb(ab(vb) + ' = ' + Bv)}일 때, ${ab(vsum(p, q))}의 값은?`, c, t, {
        explain: `${nb(dt(va, vb) + ' = ' + (sg < 0 ? MINUS : '') + P + ' × ' + Bv + ' × ' + COS + ' 60° = ' + tx(Q(sg * P * Bv, 2)))}이므로 ${nb(sqH(vsum(p, q)) + ' = ' + poly([[p * p, sqH(va)], [2 * p * q, dt(va, vb)], [q * q, sqH(vb)]]))} = ${nb(V2 + '')}, ${nb(ab(vsum(p, q)) + ' = ' + rad(V2))}이다.`,
        facts: { calc: [[String(c), 0], [`(${jn(p)}*${jn(p)}*${P}*${P}+${jn(q)}*${jn(q)}*${Bv}*${Bv}+${jn(sg)}*${jn(p)}*${jn(q)}*${P}*${Bv})/(${c}*${c})`, 1]], derived: [c] }
      });
    }, { count: 2 }),
    T('dotc-chain', '한 크기 조건에서 내적을 구해 다른 크기 구하기', '②12', (d) => {
      const A = d.int(1, 5), Bv = d.int(1, 5), m = nz(d, -6, 6), p = d.int(1, 3), q = nz(d, -3, 3), r = d.int(1, 3), s = nz(d, -3, 3);
      if (m * m >= A * A * Bv * Bv || (Math.abs(p) === Math.abs(r) && Math.abs(q) === Math.abs(s))) return null;
      const S = p * p * A * A + 2 * p * q * m + q * q * Bv * Bv, V2 = r * r * A * A + 2 * r * s * m + s * s * Bv * Bv;
      if (S <= 0 || V2 <= 0 || isSquare(V2)) return null;
      const [cs, ts] = sqParts(S), Sexpr = ts === 1 ? `${cs}*${cs}` : cs === 1 ? String(ts) : `${cs}*${cs}*${ts}`;
      const [c, t] = sqParts(V2), mExpr = `(${Sexpr}-${jn(p)}*${jn(p)}*${A}*${A}-${jn(q)}*${jn(q)}*${Bv}*${Bv})/(2*${jn(p)}*${jn(q)})`;
      return inline(`두 벡터 ${va}, ${vb}에 대하여 ${nb(ab(va) + ' = ' + A)}, ${nb(ab(vb) + ' = ' + Bv)}, ${nb(ab(vsum(p, q)) + ' = ' + rad(S))}일 때, ${dt(va, vb)}의 값과 ${ab(vsum(r, s))}의 값을 구하시오.` + NOTE1,
        `${nb(dt(va, vb) + ' = {0}')}, ${nb(ab(vsum(r, s)) + ' = {1}' + rt('{2}'))}`, [{ answer: m, signed: true }, { answer: c }, { answer: t }], {
          shown: `${nb(dt(va, vb) + ' = ' + num(m))}, ${nb(ab(vsum(r, s)) + ' = ' + rad(V2))}`,
          explain: `${nb(sqH(vsum(p, q)) + ' = ' + poly([[p * p * A * A, ''], [2 * p * q, dt(va, vb)], [q * q * Bv * Bv, '']]) + ' = ' + S)}이므로 ${nb(dt(va, vb) + ' = ' + num(m))}이다. ${nb(sqH(vsum(r, s)) + ' = ' + poly([[r * r * A * A + s * s * Bv * Bv, ''], [2 * r * s * m, '']]) + ' = ' + V2)}이므로 ${nb(ab(vsum(r, s)) + ' = ' + rad(V2))}이다.`,
          facts: { calc: [[mExpr, 0], [String(c), 1], [`(${jn(r)}*${jn(r)}*${A}*${A}+2*${jn(r)}*${jn(s)}*(${mExpr})+${jn(s)}*${jn(s)}*${Bv}*${Bv})/(${c}*${c})`, 2]], derived: [2, c] }
        });
    }),
    T('dotc-sumdiff', '|a⃗ + b⃗|, |a⃗ − b⃗|로 식의 값 구하기', '②13', (d) => {
      const A2 = d.int(2, 12), B2 = d.int(2, 12), m = nz(d, -5, 5), x = d.int(2, 3);
      if (m * m >= A2 * B2) return null;
      const P2 = A2 + B2 + 2 * m, Q2 = A2 + B2 - 2 * m, ans = (x * x + 1) * (A2 + B2) - 4 * x * m;
      const ex = (n2) => { const [c0, t0] = sqParts(n2); return t0 === 1 ? `${c0}*${c0}` : c0 === 1 ? String(t0) : `${c0}*${c0}*${t0}`; };
      const cond = nb(ab(va + ' + ' + vb) + ' = ' + rad(P2)) + ', ' + nb(ab(va + ' ' + MINUS + ' ' + vb) + ' = ' + rad(Q2));
      const ask = nb(sqH(poly([[x, va], [-1, vb]])) + ' + ' + sqH(poly([[1, va], [-x, vb]])));
      return N(`두 벡터 ${va}, ${jh(vb, '이/가')} ${jh(cond, '을/를')} 만족시킬 때, ${ask}의 값은?`, ans, {
        explain: `${nb(sqH(va) + ' + 2' + dt(va, vb) + ' + ' + sqH(vb) + ' = ' + P2)}, ${nb(sqH(va) + ' ' + MINUS + ' 2' + dt(va, vb) + ' + ' + sqH(vb) + ' = ' + Q2)}에서 ${nb(sqH(va) + ' + ' + sqH(vb) + ' = ' + (A2 + B2))}, ${nb(dt(va, vb) + ' = ' + num(m))}이다. ${nb(ask + ' = ' + (x * x + 1) + '(' + sqH(va) + ' + ' + sqH(vb) + ') ' + MINUS + ' ' + 4 * x + dt(va, vb))} = ${ans}이다.`,
        facts: { value: `(${x}*${x}+1)*((${ex(P2)})+(${ex(Q2)}))/2-${x}*((${ex(P2)})-(${ex(Q2)}))`, derived: [2] }
      });
    }),
    T('dotc-perpdot', '수직 조건으로 내적의 값 구하기', '②14', (d) => {
      const p = d.int(1, 5), q = d.int(1, 5), x = d.int(2, 6), y = d.int(1, 3);
      if (x * y === 1 || p === q) return null;
      const v = Q(y * q * q - x * p * p, 1 - x * y);
      if (v.q === 1 || v.p * v.p >= p * p * q * q * v.q * v.q) return null;
      return qAns(`두 벡터 ${va}, ${vb}에 대하여 ${nb(ab(va) + ' = ' + p)}, ${nb(ab(vb) + ' = ' + q)}이고 두 벡터 ${nb(vsum(x, 1))}, ${nb(vsum(1, -y))}가 서로 수직일 때, ${dt(va, vb)}의 값은?`, v, {
        signed: true,
        explain: `${nb('(' + vsum(x, 1) + ') · (' + vsum(1, -y) + ') = ' + poly([[x, sqH(va)], [1 - x * y, dt(va, vb)], [-y, sqH(vb)]]) + ' = 0')}이므로 ${nb(poly([[x * p * p, ''], [1 - x * y, dt(va, vb)], [-y * q * q, '']]) + ' = 0')}, 곧 ${nb(dt(va, vb) + ' = ' + tx(v))}이다.`,
        facts: { value: `(${y}*${q}*${q}-${x}*${p}*${p})/(1-${x}*${y})` }
      });
    }),
    T('dotc-circle', '한 점에서 거리가 같은 세 점과 내적', '②16', (d) => {
      const p = d.int(4, 16), q = d.int(4, 16);
      if (p === q || (p - q) % 2) return null;
      const v = (p * p - q * q) / 2;
      return N(`평면 위의 네 점 O, A, B, C에 대하여 ${nb(SG('OA') + ' = ' + SG('OB') + ' = ' + SG('OC'))}이고 ${nb(SG('AB') + ' = ' + p)}, ${nb(SG('BC') + ' = ' + q)}일 때, ${dt(vec('OB'), vec('AC'))}의 값은?`, v, {
        signed: true,
        explain: `${nb(SG('OA') + ' = ' + SG('OB') + ' = ' + SG('OC') + ' = ' + V('r'))}라 하자. ${nb(sqH(vec('OB') + ' ' + MINUS + ' ' + vec('OA')) + ' = ' + p * p)}에서 ${nb(dt(vec('OA'), vec('OB')) + ' = ' + V('r') + '<sup>2</sup> ' + MINUS + ' ' + tx(Q(p * p, 2)))}, ${nb(sqH(vec('OC') + ' ' + MINUS + ' ' + vec('OB')) + ' = ' + q * q)}에서 ${nb(dt(vec('OB'), vec('OC')) + ' = ' + V('r') + '<sup>2</sup> ' + MINUS + ' ' + tx(Q(q * q, 2)))}이다. ${nb(dt(vec('OB'), vec('AC')) + ' = ' + dt(vec('OB'), vec('OC')) + ' ' + MINUS + ' ' + dt(vec('OB'), vec('OA')) + ' = ' + num(v))}이다.`,
        facts: { value: `(${p}*${p}-${q}*${q})/2`, derived: [2] }
      });
    }),
    T('dotc-ft', '(ta⃗ + b⃗) · (ta⃗ − b⃗)의 최솟값', '②17', (d) => {
      const a = nzVec(d, 2, -4, 4), b = nzVec(d, 2, -4, 4);
      if (String(a) === String(b)) return null;
      const ft = hms('f(t)'), tV = V('t');
      return N(`두 벡터 ${VV(va, a)}, ${VV(vb, b)}에 대하여 ${nb(ft + ' = (' + tV + va + ' + ' + vb + ') · (' + tV + va + ' ' + MINUS + ' ' + vb + ')')}일 때, ${ft}의 최솟값은? <span style="white-space:nowrap">(단, ${tV}는 실수이다.)</span>`, -sq(b), {
        signed: true,
        explain: `${nb(ft + ' = ' + tV + '<sup>2</sup>' + sqH(va) + ' ' + MINUS + ' ' + sqH(vb) + ' = ' + sq(a) + tV + '<sup>2</sup> ' + MINUS + ' ' + sq(b))}이므로 ${nb(tV + ' = 0')}일 때 최솟값 ${jh(num(-sq(b)), '을/를')} 갖는다.`,
        facts: { value: `0-(${sqJ(b)})` }
      });
    }),
    T('dotc-min', '|a⃗ + kb⃗|의 최솟값', '②18', (d) => {
      const a = vecOf(d, 3, -3, 3), b = vecOf(d, 3, -3, 3), A2 = sq(a), B2 = sq(b), m = dotv(a, b), D = A2 * B2 - m * m;
      if (A2 === 0 || B2 === 0 || m === 0 || D <= 0) return null;
      const right = Q(D, B2), cand = [right, Q(D, B2 * B2), Q(A2), Q(A2 * B2 + m * m, B2)];
      if (cand.some((x, i) => cand.some((y, j) => j > i && x.p * y.q === y.p * x.q))) return null;
      const rows = cand.map((x, i) => [rootQ(x), i === 0]);
      const kq = Q(-m, B2);
      return choose(d, `두 벡터 ${VV(va, a)}, ${jh(VV(vb, b), '과/와')} 실수 ${vk}에 대하여 ${ab(va + ' + ' + vk + vb)}의 최솟값은?`, rows, true, {
        explain: `${nb(sqH(va + ' + ' + vk + vb) + ' = ' + poly([[B2, vk + '<sup>2</sup>'], [2 * m, vk], [A2, '']]))}이고 이 식은 ${nb(vk + ' = ' + tx(kq))}일 때 가장 작은 값 ${jh(tx(right), '을/를')} 갖는다. 따라서 최솟값은 ${rows[0][0]}이다.`,
        facts: {}
      });
    })
  ]);

  // ── 두 벡터가 이루는 각과 수직 ──
  B.addTypes(UNIT, 'angle', [
    T('ang-comp', '성분으로 두 벡터가 이루는 각의 크기 구하기', '②26', (d, n) => {
      const dim = n === 0 ? 2 : 3, a = vecOf(d, dim, -4, 4), b = vecOf(d, dim, -4, 4), s1 = sq(a), s2 = sq(b), m = dotv(a, b), deg = angOf(m, s1, s2);
      if (!s1 || !s2 || deg === null || deg === 0 || deg === 180 || deg === 90) return null;
      if (a.filter((x) => x === 0).length > 1 || b.filter((x) => x === 0).length > 1) return null;
      return degAns(`두 벡터 ${VV(va, a)}, ${jh(VV(vb, b), '이/가')} 이루는 각의 크기는?`, deg, {
        explain: `두 벡터가 이루는 각의 크기를 ${jh(TH, '이라/라')} 하면 ${nb(dt(va, vb) + ' = ' + dotT(a, b) + ' = ' + num(m))}, ${nb(ab(va) + ab(vb) + ' = ' + rt(String(s1)) + rt(String(s2)) + ' = ' + magOf(s1, s2))}이다. ` + angWhy(dt(va, vb), m, magOf(s1, s2), deg),
        facts: { value: String(deg), derived: [deg] }
      });
    }, { count: 2 }),
    T('ang-ops', '연산한 두 벡터가 이루는 각의 크기 구하기', '②27', (d) => {
      const a = vecOf(d, 3, -2, 2), b = vecOf(d, 3, -2, 2), [p, q] = d.pick([[1, -2], [1, 2], [2, -1], [1, -1], [1, 1]]), [r, s] = d.pick([[-2, -3], [2, 1], [1, -3], [-1, 2], [3, 1], [2, -3]]);
      const u = addv(mulv(p, a), mulv(q, b)), v = addv(mulv(r, a), mulv(s, b)), s1 = sq(u), s2 = sq(v), m = dotv(u, v), deg = angOf(m, s1, s2);
      if (!sq(a) || !sq(b) || !s1 || !s2 || deg === null || [0, 90, 180].includes(deg) || p * s === q * r) return null;
      const U = vsum(p, q), W = vsum(r, s);
      return degAns(`두 벡터 ${VV(va, a)}, ${VV(vb, b)}에 대하여 두 벡터 ${nb(U)}, ${jh(nb(W), '이/가')} 이루는 각의 크기는?`, deg, {
        explain: `${nb(U + ' = ' + tup(u))}, ${nb(W + ' = ' + tup(v))}이므로 내적은 ${num(m)}, 크기의 곱은 ${nb(rt(String(s1)) + rt(String(s2)) + ' = ' + magOf(s1, s2))}이다. 두 벡터가 이루는 각의 크기를 ${jh(TH, '이라/라')} 하면 ` + angWhy('(' + U + ') · (' + W + ')', m, magOf(s1, s2), deg),
        facts: { value: String(deg), derived: [deg] }
      });
    }),
    T('ang-size', '크기와 |pa⃗ − qb⃗|로 두 벡터가 이루는 각 구하기', '②28', (d) => {
      const A = d.int(1, 6), Bv = d.int(1, 6), angle = d.pick([60, 120]), p = d.int(1, 3), q = d.int(1, 3);
      if ((A * Bv) % 2 || (p === 1 && q === 1 && A === Bv)) return null;
      const m = angle === 60 ? A * Bv / 2 : -A * Bv / 2, S = p * p * A * A - 2 * p * q * m + q * q * Bv * Bv;
      if (S <= 0) return null;
      const W = vsum(p, -q);
      return degAns(`두 벡터 ${va}, ${vb}에 대하여 ${nb(ab(va) + ' = ' + A)}, ${nb(ab(vb) + ' = ' + Bv)}, ${nb(ab(W) + ' = ' + rad(S))}일 때, 두 벡터 ${va}, ${jh(vb, '이/가')} 이루는 각의 크기는?`, angle, {
        explain: `${nb(sqH(W) + ' = ' + poly([[p * p * A * A, ''], [-2 * p * q, dt(va, vb)], [q * q * Bv * Bv, '']]) + ' = ' + S)}이므로 ${nb(dt(va, vb) + ' = ' + num(m))}이다. 두 벡터가 이루는 각의 크기를 ${jh(TH, '이라/라')} 하면 ` + angWhy(dt(va, vb), m, String(A * Bv), angle),
        facts: { value: String(angle), derived: [angle] }
      });
    }),
    T('ang-perpratio', '수직 조건과 크기의 비로 두 벡터가 이루는 각 구하기', '②29', (d) => {
      // |a⃗| = k|b⃗| (또는 |b⃗| = k|a⃗|), (a⃗ + b⃗) ⊥ (pa⃗ − qb⃗) 에서 cos = ±1/2 인 것만 쓴다.
      const k = d.int(2, 3), flip = d.bool(), p = d.int(1, 6), q = nz(d, -15, 15);
      if (q === p || q === -p) return null;
      // flip 이 아니면 |a| = k t, |b| = t: cos = (q − p k²)/(k(p − q)); flip 이면 |a| = t, |b| = k t: cos = (q k² − p)/(k(p − q))
      const num0 = flip ? q * k * k - p : q - p * k * k, den = k * (p - q);
      if (2 * Math.abs(num0) !== Math.abs(den) || num0 === 0) return null;
      const deg = num0 * den > 0 ? 60 : 120;
      const cond = flip ? nb(ab(vb) + ' = ' + k + ab(va)) : nb(ab(va) + ' = ' + k + ab(vb));
      const W = vsum(p, -q), tt = flip ? sqH(va) : sqH(vb), s1 = flip ? 1 : k * k, s2 = flip ? k * k : 1;
      return degAns(`영벡터가 아닌 두 벡터 ${va}, ${vb}에 대하여 ${cond}이고, 두 벡터 ${nb(vsum(1, 1))}, ${jh(nb(W), '이/가')} 서로 수직일 때, 두 벡터 ${va}, ${jh(vb, '이/가')} 이루는 각의 크기는?`, deg, {
        explain: `${nb('(' + vsum(1, 1) + ') · (' + W + ') = ' + poly([[p, sqH(va)], [p - q, dt(va, vb)], [-q, sqH(vb)]]) + ' = 0')}에 ${jh(cond, '을/를')} 넣으면 ${nb(poly([[p * s1 - q * s2, tt], [p - q, dt(va, vb)]]) + ' = 0')}, 곧 ${nb(dt(va, vb) + ' = ' + tx(Q(q * s2 - p * s1, p - q)) + tt)}이다. ${nb(ab(va) + ab(vb) + ' = ' + k + tt)}이므로 두 벡터가 이루는 각은 ${deg}°이다.`,
        facts: { value: String(deg), derived: [deg] }
      });
    }),
    T('ang-three', '세 조건으로 두 벡터가 이루는 각의 cos 값 구하기', '②30', (d) => {
      const g = d.pick([1, 2, 3, 5]), x = d.int(1, 4), y = d.int(1, 4), A2 = x * x * g, B2 = y * y * g, xyg = x * y * g;
      if (x === y) return null;
      const m = nz(d, -xyg + 1, xyg - 1);
      const P2 = A2 + B2 + 2 * m, Q2 = A2 + B2 - 2 * m, R = A2 - B2;
      if (P2 <= 0 || Q2 <= 0) return null;
      const v = Q(m, xyg), ex = (n2) => { const [c0, t0] = sqParts(n2); return t0 === 1 ? `${c0}*${c0}` : c0 === 1 ? String(t0) : `${c0}*${c0}*${t0}`; };
      return qAns(`두 벡터 ${va}, ${jh(vb, '이/가')} 다음 조건을 만족시킨다. 두 벡터 ${va}, ${jh(vb, '이/가')} 이루는 각의 크기를 ${jh(TH, '이라/라')} 할 때, ${COS} ${TH}의 값은?`, v, {
        signed: true,
        figure: rowsFig([`${nb(ab(va + ' + ' + vb) + ' = ' + rad(P2))}, ${nb(ab(va + ' ' + MINUS + ' ' + vb) + ' = ' + rad(Q2))}`, nb('(' + va + ' + ' + vb + ') · (' + va + ' ' + MINUS + ' ' + vb + ') = ' + num(R))], ['㈎', '㈏']),
        explain: `㈎에서 ${nb(sqH(va) + ' + 2' + dt(va, vb) + ' + ' + sqH(vb) + ' = ' + P2)}, ${nb(sqH(va) + ' ' + MINUS + ' 2' + dt(va, vb) + ' + ' + sqH(vb) + ' = ' + Q2)}이므로 ${nb(sqH(va) + ' + ' + sqH(vb) + ' = ' + (A2 + B2))}, ${nb(dt(va, vb) + ' = ' + num(m))}이다. ㈏에서 ${nb(sqH(va) + ' ' + MINUS + ' ' + sqH(vb) + ' = ' + num(R))}이므로 ${nb(sqH(va) + ' = ' + A2)}, ${nb(sqH(vb) + ' = ' + B2)}이다. 따라서 ${nb(COS + ' ' + TH + ' = ' + frac(num(m), rad(A2) + ' × ' + rad(B2)) + ' = ' + tx(v))}이다.`,
        facts: { value: `((${ex(P2)})-(${ex(Q2)}))/4/${xyg}`, derived: [4, xyg] }
      });
    }),
    T('ang-sumdiff', '크기가 같은 두 벡터의 합과 차가 이루는 각', '②31', (d) => {
      const s = d.int(1, 4), th0 = d.pick([60, 120]), c2 = th0 === 60 ? 1 : -1, p = nz(d, -3, 3), r = nz(d, -3, 3);
      if (p === r || p === -r) return null;   // r = −p 이면 크기가 같은 두 벡터의 합·차(②32)와 같은 일이다
      const U = 2 + (p + r) * c2 + 2 * p * r, Su = 2 + 2 * p * c2 + 2 * p * p, Sv = 2 + 2 * r * c2 + 2 * r * r, deg = angOf(U, Su, Sv);
      if (deg === null || [0, 180].includes(deg) || Su <= 0 || Sv <= 0) return null;
      const X = vsum(1, p), Y = vsum(1, r), s2 = s * s, dd = Q(U * s2, 2), uu = Q(Su * s2, 2), vv = Q(Sv * s2, 2);
      return degAns(`두 벡터 ${va}, ${jh(vb, '이/가')} 이루는 각의 크기가 ${th0}°이고 ${nb(ab(va) + ' = ' + ab(vb) + ' = ' + s)}일 때, 두 벡터 ${nb(X)}, ${jh(nb(Y), '이/가')} 이루는 각의 크기는?`, deg, {
        explain: `${nb(dt(va, vb) + ' = ' + tx(Q(c2 * s2, 2)))}이므로 ${nb(sqH(X) + ' = ' + tx(uu))}, ${nb(sqH(Y) + ' = ' + tx(vv))}, ${nb('(' + X + ') · (' + Y + ') = ' + tx(dd))}이다. 두 벡터가 이루는 각의 크기를 ${jh(TH, '이라/라')} 하면 ${deg === 90 ? '내적이 0이므로 ' + nb(TH + ' = 90°') : deg < 90 ? nb(COS + ' ' + TH + ' = ' + COSV[deg]) + '이므로 ' + nb(TH + ' = ' + deg + DEG) : nb(COS + '(180° ' + MINUS + ' ' + TH + ') = ' + COSV[180 - deg]) + '이므로 ' + nb(TH + ' = ' + deg + DEG)}이다.`,
        facts: { value: String(deg), derived: [deg] }
      });
    }),
    T('ang-rhombus', '합과 차가 수직일 조건', '②32', (d) => {
      const k = d.int(1, 3), kb = (h) => (k === 1 ? h : k + h);
      const rows = k === 1 ? [
        [nb(ab(va) + ' = ' + ab(vb)), true], [nb(dt(va, vb) + ' = 0'), false], [nb(ab(va + ' + ' + vb) + ' = ' + ab(va + ' ' + MINUS + ' ' + vb)), false], [nb(dt(va, vb) + ' = ' + ab(va) + ab(vb)), false], [nb(ab(va) + ' = 2' + ab(vb)), false]
      ] : [
        [nb(ab(va) + ' = ' + kb(ab(vb))), true], [nb(ab(vb) + ' = ' + kb(ab(va))), false], [nb(dt(va, vb) + ' = 0'), false], [nb(ab(va) + ' = ' + k * k + ab(vb)), false], [nb(ab(va + ' + ' + kb(vb)) + ' = ' + ab(va + ' ' + MINUS + ' ' + kb(vb))), false]
      ];
      return choose(d, `영벡터가 아니고 서로 평행하지 않은 두 벡터 ${va}, ${vb}에 대하여 두 벡터 ${nb(va + ' + ' + kb(vb))}, ${jh(nb(va + ' ' + MINUS + ' ' + kb(vb)), '이/가')} 서로 수직일 때, 항상 성립하는 것은?`, rows, true, {
        explain: `${nb('(' + va + ' + ' + kb(vb) + ') · (' + va + ' ' + MINUS + ' ' + kb(vb) + ') = ' + sqH(va) + ' ' + MINUS + ' ' + (k === 1 ? '' : k * k) + sqH(vb) + ' = 0')}이므로 ${nb(ab(va) + ' = ' + kb(ab(vb)))}이다.`
      });
    }),
    T('ang-circle', '원 위의 세 점과 합이 영벡터인 벡터', '②33', (d) => {
      const r = 2 * d.int(1, 3), v = -r * r / 2;
      return M(`중심이 O이고 반지름의 길이가 ${r}인 원 위의 세 점 A, B, C가 ${nb(vec('OA') + ' + ' + vec('OB') + ' + ' + vec('OC') + ' = ' + vec('0'))}을 만족시킬 때, ${dt(vec('OA'), vec('OB'))}의 값과 ∠AOB의 크기를 구하시오.`, [
        { answer: v, signed: true, lead: dt(vec('OA'), vec('OB')) + ' =' }, { answer: 120, lead: '∠AOB =', unit: '°' }], {
        shown: `${nb(dt(vec('OA'), vec('OB')) + ' = ' + num(v))}, ∠AOB = 120°`,
        explain: `${nb(vec('OA') + ' + ' + vec('OB') + ' = ' + MINUS + vec('OC'))}의 양변의 크기를 제곱하면 ${nb(r * r + ' + 2' + dt(vec('OA'), vec('OB')) + ' + ' + r * r + ' = ' + r * r)}이므로 ${nb(dt(vec('OA'), vec('OB')) + ' = ' + num(v))}이다. ${nb(COS + '(180° ' + MINUS + ' ∠AOB) = ' + frac(r * r / 2, r * r) + ' = ' + frac(1, 2))}이므로 ∠AOB = 120°이다.`,
        facts: { calc: [[`0-${r}*${r}/2`, 0], ['120', 1]], derived: [2, 120] }
      });
    }),
    T('ang-perp', '성분으로 나타낸 두 벡터의 수직 조건', '②34', (d, n) => {
      if (n === 0) {
        const a = nzVec(d, 2, -6, 6), j = d.int(0, 1), o = 1 - j, r = nz(d, -6, 6), v = Q(-a[o] * r, a[j]);
        if (v.q === 1) return null;
        const bS = [0, 0]; bS[j] = vk; bS[o] = r;
        return qAns(`두 벡터 ${VV(va, a)}, ${jh(VV(vb, bS), '이/가')} 서로 수직일 때, 실수 ${vk}의 값은?`, v, {
          signed: true,
          explain: `${nb(dt(va, vb) + ' = ' + (j === 0 ? par(a[0]) + vk + ' + ' + par(a[1]) + ' × ' + par(r) : par(a[0]) + ' × ' + par(r) + ' + ' + par(a[1]) + vk) + ' = 0')}이므로 ${nb(vk + ' = ' + tx(v))}이다.`,
          facts: { value: `0-${jn(a[o])}*${jn(r)}/${jn(a[j])}` }
        });
      }
      const e1 = nz(d, -4, 4), sg = d.pick([1, -1]), a2 = nz(d, -5, 5), a3 = nz(d, -4, 4), b1 = nz(d, -4, 4), b2 = nz(d, -4, 4), den = sg * b1 + a3, top = -(b1 * e1 + a2 * b2);
      if (den === 0 || top % den !== 0 || top === 0) return null;
      const k = top / den;
      const aS = [poly([[e1, ''], [sg, vk]]), a2, a3], bS = [b1, b2, vk];
      return qAns(`두 벡터 ${VV(va, aS)}, ${jh(VV(vb, bS), '이/가')} 서로 수직일 때, 실수 ${vk}의 값은?`, k, {
        signed: true,
        explain: `${nb(dt(va, vb) + ' = ' + par(b1) + '(' + poly([[e1, ''], [sg, vk]]) + ') + ' + par(a2) + ' × ' + par(b2) + ' + ' + par(a3) + vk)} = ${nb(poly([[den, vk], [b1 * e1 + a2 * b2, '']]) + ' = 0')}이므로 ${nb(vk + ' = ' + num(k))}이다.`,
        facts: { value: `0-(${jn(b1)}*${jn(e1)}+${jn(a2)}*${jn(b2)})/(${jn(sg)}*${jn(b1)}+${jn(a3)})` }
      });
    }, { count: 2 }),
    T('ang-perpops', '연산한 두 벡터의 수직 조건', '②35', (d) => {
      const a = vecOf(d, 2, -4, 4), b = vecOf(d, 2, -4, 4), x = d.int(1, 3), y = d.int(1, 4), A2 = sq(a), B2 = sq(b), m = dotv(a, b);
      const den = x * A2 + m, top = -y * (x * m + B2);
      if (!A2 || !B2 || den === 0 || top % den !== 0 || top === 0 || a[0] * b[1] === a[1] * b[0]) return null;
      const k = top / den;
      if (Math.abs(k) > 12) return null;
      const u = addv(mulv(x, a), b);
      return qAns(`두 벡터 ${VV(va, a)}, ${VV(vb, b)}에 대하여 두 벡터 ${nb(vsum(x, 1))}, ${jh(nb(vk + va + ' + ' + (y === 1 ? '' : y) + vb), '이/가')} 서로 수직일 때, 실수 ${vk}의 값은?`, k, {
        signed: true,
        explain: `${nb(vsum(x, 1) + ' = ' + tup(u))}, ${nb(vk + va + ' + ' + (y === 1 ? '' : y) + vb + ' = ' + tup([poly([[a[0], vk], [y * b[0], '']]), poly([[a[1], vk], [y * b[1], '']])]))}이고 내적이 0이므로 ${nb(poly([[u[0] * a[0] + u[1] * a[1], vk], [y * dotv(u, b), '']]) + ' = 0')}, 곧 ${nb(vk + ' = ' + num(k))}이다.`,
        facts: { value: `0-${y}*(${x}*(${dotJ(a, b)})+(${sqJ(b)}))/(${x}*(${sqJ(a)})+(${dotJ(a, b)}))` }
      });
    }),
    T('ang-perpsize', '수직이고 크기가 주어진 벡터 구하기', '②36', (d, n) => {
      if (n === 0) {
        const a = nzVec(d, 2, -4, 4), t = d.int(1, 2), g0 = gcd(Math.abs(a[0]), Math.abs(a[1]));
        if (g0 !== 1) return null;
        const L = t * t * sq(a), w = [-t * a[1], t * a[0]], wn = mulv(-1, w), par0 = [t * a[0], t * a[1]];
        const set = (list) => list.map((v) => tup(v)).join(' 또는 ');
        const rows = [[set([w, wn]), true], [tup(w), false], [tup(wn), false], [set([par0, mulv(-1, par0)]), false], [set([mulv(2, w), mulv(-2, w)]), false]];
        return choose(d, `벡터 ${VV(va, a)}에 수직이고 크기가 ${rad(L)}인 벡터 ${jh(vb, '을/를')} 모두 구한 것은?`, rows, true, {
          explain: `${nb(vb + ' = (' + vx + ', ' + vy + ')')}라 하면 ${nb(dt(va, vb) + ' = ' + poly([[a[0], vx], [a[1], vy]]) + ' = 0')}, ${nb(vx + '<sup>2</sup> + ' + vy + '<sup>2</sup> = ' + L)}이다. 이를 풀면 ${set([w, wn])}이다.`
        });
      }
      const y1 = nz(d, -4, 4), y2 = nz(d, -4, 4), a3 = d.int(1, 3), sum0 = y1 + y2;
      if (y1 === y2 || sum0 === 0 || sum0 % a3 !== 0 || y1 === -y2) return null;
      const z0 = sum0 / a3, L = y1 * y1 + y2 * y2 + z0 * z0, a = [1, -1, a3];
      const sol = [[-y2, y1], [-y1, y2]], pr = (s) => nb(vx + ' = ' + num(s[0]) + ', ' + vy + ' = ' + num(s[1]));
      const ok = (s) => s[0] - s[1] + a3 * z0 === 0 && s[0] * s[0] + s[1] * s[1] + z0 * z0 === L;
      const sets = [sol, [sol[0]], [sol[1]], [[y1, -y2], [y2, -y1]], [[y2, y1], [y1, y2]]];
      const isRight = (S) => S.length === 2 && S.every(ok);
      const rows = sets.map((S) => [S.map(pr).join(' 또는 '), isRight(S)]);
      return choose(d, `두 벡터 ${VV(va, a)}, ${jh(VV(vb, [vx, vy, z0]), '이/가')} 서로 수직이고 ${nb(ab(vb) + ' = ' + rad(L))}일 때, 실수 ${vx}, ${vy}의 값을 모두 구한 것은?`, rows, true, {
        explain: `${nb(dt(va, vb) + ' = ' + vx + ' ' + MINUS + ' ' + vy + ' ' + (a3 * z0 < 0 ? MINUS : '+') + ' ' + Math.abs(a3 * z0) + ' = 0')}, ${nb(vx + '<sup>2</sup> + ' + vy + '<sup>2</sup> + ' + z0 * z0 + ' = ' + L)}이다. ${jh(nb(vx + ' = ' + poly([[1, vy], [-a3 * z0, '']])), '을/를')} 넣어 풀면 ${sol.map(pr).join(' 또는 ')}이다.`
      });
    }, { count: 2 }),
    T('ang-points', '세 점이 이루는 각의 cos 값', '공간①15', (d) => {
      const A = vecOf(d, 3, -3, 5), P = vecOf(d, 3, -3, 5), Cq = vecOf(d, 3, -3, 5);
      const BA = subv(A, P), BC = subv(Cq, P), AB = subv(P, A), AC = subv(Cq, A), CA = subv(A, Cq), CB = subv(P, Cq);
      const s1 = sq(BA), s2 = sq(BC), m = dotv(BA, BC);
      if (!s1 || !s2 || !sq(AC) || m === 0 || m * m === s1 * s2) return null;
      const cosOf = (u, v) => { const k = dotv(u, v); return { sg: Math.sign(k), r: Q(k * k, sq(u) * sq(v)) }; };
      const cands = [cosOf(BA, BC), { sg: -Math.sign(m), r: Q(m * m, s1 * s2) }, cosOf(AB, AC), cosOf(CA, CB)];
      if (cands.some((c) => c.sg === 0)) return null;
      const key = (c) => c.sg + ':' + c.r.p + '/' + c.r.q;
      if (new Set(cands.map(key)).size !== 4) return null;
      const rows = cands.map((c, i) => [sRootQ(c.sg, c.r), i === 0]);
      return choose(d, `좌표공간의 세 점 ${pt('A', A)}, ${pt('B', P)}, ${pt('C', Cq)}에 대하여 ${nb('∠ABC = ' + TH)}라 할 때, ${COS} ${TH}의 값은?`, rows, true, {
        explain: `${nb(vec('BA') + ' = ' + tup(BA))}, ${nb(vec('BC') + ' = ' + tup(BC))}이므로 ${nb(dt(vec('BA'), vec('BC')) + ' = ' + num(m))}, ${nb(ab(vec('BA')) + ab(vec('BC')) + ' = ' + rt(String(s1)) + rt(String(s2)))}이다. ${m > 0 ? '내적이 양수이므로 ' + nb(COS + ' ' + TH + ' = ' + frac(num(m), magOf(s1, s2)) + ' = ' + rows[0][0]) : '내적이 음수이므로 θ는 둔각이고 ' + nb(COS + '(180° ' + MINUS + ' ' + TH + ') = ' + frac(num(-m), magOf(s1, s2))) + ', 곧 ' + nb(COS + ' ' + TH + ' = ' + rows[0][0])}이다.`
      });
    }),
    T('ang-mono', '끼인각의 크기와 내적의 대소', '②43', (d) => {
      const [p, q, mm] = d.pick([[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13], [12, 5, 13]]), sx = d.pick([1, -1]), sy = d.pick([1, -1]), A = [sx * p, sy * q];
      const u = vec('u'), v = vec('v'), dv = dt(u, v);
      const rows = [
        [`${TH}가 커질수록 ${jh(dv, '은/는')} 작아지고, 가장 큰 값은 ${mm}이다.`, true],
        [`${TH}가 커질수록 ${jh(dv, '은/는')} 작아지고, 가장 큰 값은 ${mm * mm}이다.`, false],
        [`${TH}가 커질수록 ${jh(dv, '은/는')} 커지고, 가장 큰 값은 ${mm}이다.`, false],
        [`${TH}가 커질수록 ${jh(dv, '은/는')} 작아지고, 가장 작은 값은 0이다.`, false],
        [`${TH}가 커질수록 ${jh(dv, '은/는')} 커지고, 가장 작은 값은 ${MINUS}${mm}이다.`, false]
      ];
      return choose(d, `좌표평면 위의 점 ${jh(pt('A', A), '과/와')} 원 ${nb(vx + '<sup>2</sup> + ' + vy + '<sup>2</sup> = 1')} 위를 움직이는 점 B에 대하여 ${nb(u + ' = ' + vec('OA'))}, ${nb(v + ' = ' + vec('OB'))}라 하고, 두 벡터 ${u}, ${jh(v, '이/가')} 이루는 각의 크기를 ${nb(TH + '(0° ≤ ' + TH + ' ≤ 180°)')}라 하자. 다음 가운데 옳은 것은? <span style="white-space:nowrap">(단, O는 원점이다.)</span>`, rows, true, {
        explain: `${nb(ab(u) + ' = ' + mm)}, ${nb(ab(v) + ' = 1')}이므로 ${TH}가 90° 이하일 때 ${nb(dv + ' = ' + mm + COS + ' ' + TH)}, 90°보다 클 때 ${nb(dv + ' = ' + MINUS + mm + COS + '(180° ' + MINUS + ' ' + TH + ')')}이다. ${TH}가 커질수록 ${jh(dv, '은/는')} 작아지고, ${nb(TH + ' = 0°')}일 때 가장 큰 값 ${mm}, ${nb(TH + ' = 180°')}일 때 가장 작은 값 ${MINUS}${jh(String(mm), '을/를')} 갖는다.`
      });
    })
  ]);

  // ── 도형에서 내적의 활용 ──
  B.addTypes(UNIT, 'use', [
    T('use-tri', '정삼각형에서 내분점을 이은 벡터의 합의 크기', '②19', (d) => {
      const [p, q] = d.pick(RATIOS), [r1, r2] = d.pick([[1, 3], [3, 1], [1, 2], [2, 1], [2, 3], [3, 2], [1, 4], [4, 1]]), u = d.int(1, 2), s = (p + q) * u;
      const ans = u * u * (p * p + p * (p + q) + (p + q) * (p + q));
      const dl = Q(p, p + q), e = Q(r1, r1 + r2), f = Q(r2, r1 + r2);
      return N(`한 변의 길이가 ${s}인 정삼각형 ABC에서 선분 AB를 ${ratio(p, q, '으로/로')} 내분하는 점을 D, 선분 AC를 ${nb(r1 + ' : ' + r2)}, ${ratio(r2, r1, '으로/로')} 내분하는 점을 각각 E, F라 할 때, ${sqH(vec('BF') + ' + ' + vec('DE'))}의 값은?`, ans, {
        explain: `${nb(vec('AB') + ' = ' + va)}, ${nb(vec('AC') + ' = ' + vb)}라 하면 ${nb(vec('BF') + ' = ' + poly([[f, vb], [-1, va]]))}, ${nb(vec('DE') + ' = ' + poly([[e, vb], [qmul(dl, Q(-1)), va]]))}이므로 ${nb(vec('BF') + ' + ' + vec('DE') + ' = ' + poly([[qadd(Q(-1), qmul(dl, Q(-1))), va], [1, vb]]))}이다. ${nb(dt(va, vb) + ' = ' + s + ' × ' + s + ' × ' + COS + ' 60° = ' + tx(Q(s * s, 2)))}이므로 크기의 제곱은 ${ans}이다.`,
        facts: { value: `${s}*${s}*((1+${p}/(${p}+${q}))*(1+${p}/(${p}+${q}))-(1+${p}/(${p}+${q}))+1)` }
      });
    }),
    T('use-hex', '정육각형에서 두 대각선 벡터의 합의 크기', '②20', (d) => {
      const s = d.int(2, 4), [X, Y, kk] = d.pick([['B', 'C', 7], ['B', 'D', 7], ['C', 'D', 13], ['D', 'E', 13], ['D', 'F', 7], ['E', 'F', 7]]);
      const L = { B: [1, ''], C: [1, '3'], D: [2, ''], E: [1, '3'], F: [1, ''] }, IDX = { B: 0, C: 1, D: 2, E: 3, F: 4 }, gap = 30 * Math.abs(IDX[Y] - IDX[X]);
      const lenH = (Z) => { const [c0, r0] = L[Z]; return (c0 * s === 1 && r0 ? '' : String(c0 * s)) + (r0 ? rt(r0) : ''); };
      const sq1 = (Z) => L[Z][0] * L[Z][0] * (L[Z][1] ? 3 : 1);
      const middle = kk - sq1(X) - sq1(Y);
      // 그림: A 왼쪽 위에서 시계 반대쪽으로 B, C, D, E, F
      const g = Board(), R = 62, pts = {}; 'ABCDEF'.split('').forEach((nm, i) => { pts[nm] = at([0, 0], R, 120 + 60 * i); });
      g.poly('ABCDEF'.split('').map((nm) => pts[nm])).seg(pts.A, pts[X]).seg(pts.A, pts[Y]);
      'ABCDEF'.split('').forEach((nm) => nameOut(g, pts[nm], nm, [0, 0]));
      const figure = g.svg(`정육각형 ABCDEF(A 왼쪽 위에서 시계 반대 방향으로 B, C, D, E, F). 꼭짓점 A에서 ${X}, ${Y}로 선분이 그어져 있다.`);
      return radAns(`그림과 같이 한 변의 길이가 ${s}인 정육각형 ABCDEF에서 ${ab(vec('A' + X) + ' + ' + vec('A' + Y))}의 값은?`, s, kk, {
        figure,
        explain: `${nb(ab(vec('A' + X)) + ' = ' + lenH(X))}, ${nb(ab(vec('A' + Y)) + ' = ' + lenH(Y))}이고 두 벡터가 이루는 각의 크기는 ${gap}°이다. ${nb(sqH(vec('A' + X) + ' + ' + vec('A' + Y)) + ' = ' + sq1(X) * s * s + ' + ' + middle * s * s + ' + ' + sq1(Y) * s * s + ' = ' + kk * s * s)}이므로 값은 ${s}${rt(String(kk))}이다.`,
        facts: { calc: [[String(s), 0], [String(kk), 1]], derived: [kk] }
      });
    }),
    T('use-tetra', '정사면체에서 내분점을 잇는 벡터의 내적', '②21', (d) => {
      const [m, n] = d.pick(RATIOS.concat([[1, 1], [1, 1]])), [p, q] = d.pick(RATIOS.concat([[1, 1], [1, 1]]));
      const v = Q(n * q + n * p + 2 * m * q + m * p, 2 * (m + n) * (p + q));
      const say1 = m === n ? '선분 AB의 중점을 P' : `선분 AB를 ${ratio(m, n, '으로/로')} 내분하는 점을 P`, say2 = p === q ? '선분 BC의 중점을 Q' : `선분 BC를 ${ratio(p, q, '으로/로')} 내분하는 점을 Q`;
      const g = Board(), O = [0, 0], A = [-88, 108], Bp = [-12, 140], Cq = [84, 104], P = onSeg(A, Bp, m / (m + n)), Qp = onSeg(Bp, Cq, p / (p + q));
      g.seg(O, A).seg(O, Bp).seg(O, Cq).seg(A, Bp).seg(Bp, Cq).seg(A, Cq, 'cut').seg(O, P, 'thin').seg(O, Qp, 'thin').dot(P).dot(Qp);
      const cen = centerOf([O, A, Bp, Cq]);
      nameOut(g, O, 'O', cen); nameOut(g, A, 'A', cen); nameOut(g, Bp, 'B', cen); nameOut(g, Cq, 'C', cen); g.name(P, 'P', 225); g.name(Qp, 'Q', 315);
      const figure = g.svg('정사면체 OABC(O 위, A 왼쪽, B 앞, C 오른쪽 — 모서리 AC는 점선). 모서리 AB 위의 점 P, 모서리 BC 위의 점 Q와 O를 잇는 선분이 그어져 있다.');
      return qAns(`그림과 같이 한 모서리의 길이가 1인 정사면체 OABC에서 ${say1}, ${say2}라 할 때, ${dt(vec('OP'), vec('OQ'))}의 값은?`, v, {
        figure,
        explain: `${nb(vec('OA') + ' = ' + va)}, ${nb(vec('OB') + ' = ' + vb)}, ${nb(vec('OC') + ' = ' + vc)}라 하면 ${nb(vec('OP') + ' = ' + frac(poly([[n, va], [m, vb]]), m + n))}, ${nb(vec('OQ') + ' = ' + frac(poly([[q, vb], [p, vc]]), p + q))}이다. 서로 다른 두 벡터의 내적은 ${nb('1 × 1 × ' + COS + ' 60° = ' + frac(1, 2))}, ${nb(dt(vb, vb) + ' = 1')}이므로 ${nb(dt(vec('OP'), vec('OQ')) + ' = ' + tx(v))}이다.`,
        facts: { value: `(${n}*${q}+${n}*${p}+2*${m}*${q}+${m}*${p})/(2*(${m}+${n})*(${p}+${q}))`, derived: [2] }
      });
    }),
    T('use-bisect', '각의 이등분선과 내적', '②22', (d) => {
      const p = d.int(2, 6), q = d.int(2, 8), m = nz(d, -p * q + 1, p * q - 1);
      if (p === q) return null;
      const v = Q((q - p) * (p * q + m), p + q), g0 = gcd(p, q);
      if (v.q === 1) return null;
      const AD = frac(poly([[q, va], [p, vb]]), p + q);
      return qAns(`${nb(SG('AB') + ' = ' + p)}, ${nb(SG('AC') + ' = ' + q)}인 삼각형 ABC에서 ${nb(dt(vec('AB'), vec('AC')) + ' = ' + num(m))}이다. ∠BAC의 이등분선이 변 BC와 만나는 점 D에 대하여 ${nb(SG('BD') + ' : ' + SG('DC') + ' = ' + p / g0 + ' : ' + q / g0)}일 때, ${dt(vec('AD'), vec('BC'))}의 값은?`, v, {
        signed: true,
        explain: `${nb(vec('AB') + ' = ' + va)}, ${nb(vec('AC') + ' = ' + vb)}라 하면 D는 선분 BC를 ${ratio(p / g0, q / g0, '으로/로')} 내분하므로 ${nb(vec('AD') + ' = ' + AD)}, ${nb(vec('BC') + ' = ' + vb + ' ' + MINUS + ' ' + va)}이다. ${nb(sqH(va) + ' = ' + p * p)}, ${nb(sqH(vb) + ' = ' + q * q)}이므로 ${nb(dt(vec('AD'), vec('BC')) + ' = ' + frac(poly([[-q * p * p, ''], [q - p, '(' + num(m) + ')'], [p * q * q, '']]), p + q))} = ${tx(v)}이다.`,
        facts: { value: `((${q}-${p})*(${p}*${q}+${jn(m)}))/(${p}+${q})` }
      });
    }),
    T('use-point', '벡터 등식으로 점을 찾고 내적 구하기', '②23', (d) => {
      const k = d.int(2, 4), u = d.int(1, 3), w = (k + 1) * u, h = d.int(2, 8), ans = k * u * u;
      return N(`${nb('∠B = 90°')}, ${nb(SG('AB') + ' = ' + h)}, ${nb(SG('BC') + ' = ' + w)}인 직각삼각형 ABC가 있다. 선분 BC 위의 점 P가 ${jh(nb(k + vec('AP') + ' = ' + vec('PB') + ' + ' + k + vec('AC')), '을/를')} 만족시킬 때, ${dt(vec('AP'), vec('PC'))}의 값은?`, ans, {
        explain: `${nb(vec('PB') + ' = ' + vec('AB') + ' ' + MINUS + ' ' + vec('AP'))}이므로 ${nb((k + 1) + vec('AP') + ' = ' + vec('AB') + ' + ' + k + vec('AC'))}, 곧 P는 선분 BC를 ${ratio(k, 1, '으로/로')} 내분하는 점이다. ${nb(SG('BP') + ' = ' + k * u)}, ${nb(SG('PC') + ' = ' + u)}이고, 두 벡터 ${vec('AP')}, ${jh(vec('PC'), '이/가')} 이루는 각은 ∠APB이며 ${nb(COS + '(∠APB) = ' + frac(SG('BP'), SG('AP')))}이므로 ${nb(dt(vec('AP'), vec('PC')) + ' = ' + SG('AP') + ' × ' + SG('PC') + ' × ' + frac(SG('BP'), SG('AP')) + ' = ' + k * u + ' × ' + u + ' = ' + ans)}이다.`,
        facts: { value: `${k}*${w}/(${k}+1)*${w}/(${k}+1)` }
      });
    }),
    T('use-circle', '내적으로 원의 방정식 구하기', '②40', (d) => {
      const h = nz(d, -4, 4), k = nz(d, -4, 4), dx = nz(d, -4, 4), dy = d.int(-4, 4), A = [h - dx, k - dy], P = [h + dx, k + dy], r2 = dx * dx + dy * dy;
      const tpl = `(${vx} {0})<sup>2</sup> + (${vy} {1})<sup>2</sup> = {2}`;
      const fac = (v, c) => (c === 0 ? v : '(' + poly([[1, v], [-c, '']]) + ')');
      const shownE = `(${poly([[1, vx], [-h, '']])})<sup>2</sup> + (${poly([[1, vy], [-k, '']])})<sup>2</sup> = ${r2}`;
      return inline(`두 점 ${pt('A', A)}, ${pt('B', P)}에 대하여 ${jh(nb(dt(vec('AP'), vec('BP')) + ' = 0'), '을/를')} 만족시키는 점 P가 나타내는 도형의 방정식을 구하시오.`, tpl, [{ answer: -h, signed: true }, { answer: -k, signed: true }, { answer: r2 }], {
        shown: shownE,
        explain: `점 P의 좌표를 ${nb('(' + vx + ', ' + vy + ')')}라 하면 ${nb(dt(vec('AP'), vec('BP')) + ' = ' + fac(vx, A[0]) + fac(vx, P[0]) + ' + ' + fac(vy, A[1]) + fac(vy, P[1]) + ' = 0')}이고, 정리하면 ${nb(shownE)}이다.`,
        facts: { calc: [[`0-(${jn(A[0])}+${jn(P[0])})/2`, 0], [`0-(${jn(A[1])}+${jn(P[1])})/2`, 1], [`((${jn(P[0])}-${jn(A[0])})*(${jn(P[0])}-${jn(A[0])})+(${jn(P[1])}-${jn(A[1])})*(${jn(P[1])}-${jn(A[1])}))/4`, 2]], derived: [2, 4] }
      });
    }),
    T('use-area', '세 점을 꼭짓점으로 하는 삼각형의 넓이', '②41', (d, n) => {
      if (n === 0) {
        const A = vecOf(d, 2, -4, 5), P = vecOf(d, 2, -4, 8), Cq = vecOf(d, 2, -4, 8), u = subv(P, A), w = subv(Cq, A), det = u[0] * w[1] - u[1] * w[0];
        if (det === 0 || det % 2) return null;
        const [U, W] = det > 0 ? [u, w] : [w, u], ux = (i) => `(${jn(det > 0 ? P[i] : Cq[i])}-${jn(A[i])})`, wx = (i) => `(${jn(det > 0 ? Cq[i] : P[i])}-${jn(A[i])})`;
        return N(`세 점 ${pt('A', A)}, ${pt('B', P)}, ${jh(pt('C', Cq), '을/를')} 꼭짓점으로 하는 삼각형 ABC의 넓이는?`, Math.abs(det) / 2, {
          explain: `${nb(vec('AB') + ' = ' + tup(u))}, ${nb(vec('AC') + ' = ' + tup(w))}이다. 두 벡터 (${V('a')}<sub>1</sub>, ${V('a')}<sub>2</sub>), (${V('b')}<sub>1</sub>, ${V('b')}<sub>2</sub>)로 만든 삼각형의 넓이는 ${nb(frac(1, 2) + '|' + hms('a_1 b_2 - a_2 b_1') + '|')}이므로 ${nb(frac(1, 2) + ' × |' + par(U[0]) + ' × ' + par(W[1]) + ' ' + MINUS + ' ' + par(U[1]) + ' × ' + par(W[0]) + '| = ' + Math.abs(det) / 2)}이다.`,
          facts: { value: `(${ux(0)}*${wx(1)}-${ux(1)}*${wx(0)})/2`, derived: [2] }
        });
      }
      const rows = [[hms('a_1 b_2 - a_2 b_1'), true], [hms('a_1 b_1 + a_2 b_2'), false], [hms('a_2 b_1 - a_1 b_2'), false], [hms('a_1 a_2 + b_1 b_2'), false]];
      return choose(d, `원점 O와 제1사분면 위의 두 점 ${hms('A(a_1, a_2)')}, ${hms('B(b_1, b_2)')}에 대하여 직선 OA의 기울기가 직선 OB의 기울기보다 작다. 점 ${hms('C(-a_2, a_1)')}을 잡으면 ${nb(dt(vec('OA'), vec('OC')) + ' = 0')}이므로 ∠AOC = 90°이고, ${nb('∠AOB = ' + TH)}라 하면 ${nb('∠BOC = 90° ' + MINUS + ' ' + TH)}이다. 따라서 삼각형 OAB의 넓이는 ${nb(frac(1, 2) + ' × ' + SG('OA') + ' × ' + SG('OB') + ' × ' + fn('sin') + ' ' + TH)} = ${nb(frac(1, 2) + ' × ' + dt(vec('OC'), vec('OB')))} = ${nb(frac(1, 2) + ' × (□)')}이다. □ 안에 알맞은 식은?`, rows, true, {
        explain: `${nb(SG('OA') + ' = ' + SG('OC'))}이고 ${nb(fn('sin') + ' ' + TH + ' = ' + COS + '(90° ' + MINUS + ' ' + TH + ')')}이므로 ${nb(SG('OA') + ' × ' + SG('OB') + ' × ' + fn('sin') + ' ' + TH + ' = ' + dt(vec('OC'), vec('OB')))}이다. ${nb(vec('OC') + ' = ' + hms('(-a_2, a_1)'))}, ${nb(vec('OB') + ' = ' + hms('(b_1, b_2)'))}이므로 ${nb(dt(vec('OC'), vec('OB')) + ' = ' + hms('-a_2 b_1 + a_1 b_2'))}이다.`
      });
    }, { count: 2 }),
    T('use-cossim', '내적으로 구한 유사도 비교하기', '②42', (d) => {
      const POOL = [[1, 2, 2, 3], [2, 4, 4, 6], [3, 6, 6, 9], [2, 3, 6, 7], [1, 4, 8, 9], [4, 4, 7, 9], [6, 6, 7, 11], [2, 6, 9, 11], [4, 8, 8, 12]];
      const one = () => { const q = d.pick(POOL); return { v: d.shuffle(q.slice(0, 3)), m: q[3] }; };
      const U = [one(), one(), one()];
      if (new Set(U.map((x) => String(x.v.map((c) => c / x.m)))).size !== 3) return null;
      const PAIR = [[0, 1], [0, 2], [1, 2]], NM = ['A', 'B', 'C'];
      const vals = PAIR.map(([i, j]) => Q(dotv(U[i].v, U[j].v), U[i].m * U[j].m));
      const best = vals.map((x) => x.p / x.q), top = Math.max(...best);
      if (best.filter((x) => Math.abs(x - top) < 1e-12).length !== 1) return null;
      const rowsT = U.map((x, i) => `<tr><th>${NM[i]}</th> ${x.v.map((c) => '<td>' + c + '</td>').join(' ')}</tr>`).join(' ');
      const said = '평점 표: ' + U.map((x, i) => NM[i] + ' ' + x.v.join(', ')).join(' / ');
      const table = `<table class="mb-table" aria-label="${said}"><tbody><tr><th>사람</th> <th>제품 1</th> <th>제품 2</th> <th>제품 3</th></tr> ${rowsT}</tbody></table>`;
      const opts = PAIR.map(([i, j]) => `${NM[i]}와 ${NM[j]}`);
      return C(`다음 표는 세 사람 A, B, C가 세 제품에 매긴 평점이다. 두 사람의 평점을 차례로 성분으로 하는 두 벡터가 이루는 각의 크기를 ${jh(TH, '이라/라')} 할 때, ${COS} ${TH}의 값을 두 사람의 유사도라 하자. 유사도가 가장 큰 두 사람은?`, opts, best.indexOf(top), {
        figure: table,
        explain: `세 사람의 평점 벡터의 크기는 차례로 ${U.map((x) => x.m).join(', ')}이다. 유사도는 ` + PAIR.map(([i, j], k) => `${NM[i]}와 ${NM[j]}: ${nb(frac(dotv(U[i].v, U[j].v), U[i].m * U[j].m) + (vals[k].q === U[i].m * U[j].m ? '' : ' = ' + tx(vals[k])))}`).join(', ') + `이므로 가장 큰 것은 ${opts[best.indexOf(top)]}이다.`,
        facts: { choose: { exprs: PAIR.map(([i, j]) => `(${dotJ(U[i].v, U[j].v)})/(${U[i].m}*${U[j].m})`), rule: 'max' }, unseen: [...new Set(U.map((x) => x.m))] }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
