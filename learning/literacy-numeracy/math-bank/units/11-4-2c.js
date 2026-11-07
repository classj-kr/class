// 고등학교 기하 Ⅰ-2 타원 — 실력 문항. 단원 틀·싣는 기준·뺀 것과 까닭은 11-4-2a.js 머리에 적었다. 도구는 B.kit.u42x(11-4-2a.js).
// ref: ①n = 이 단원 기본꼴_1의 n번, ②n = 기본꼴_2의 n번. 수집본에 기출 모의고사가 없어 대단원 평가·중단원 평가의 끝 문제가 실력의 바탕이다.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것
//  - 「x²의 분모가 a²」로 외워, 분모가 큰 쪽이 y²인 타원에서도 장축을 x축 위에 두거나 초점을 (±c, 0)으로 적는다.
//  - 타원의 정의(두 초점까지의 거리의 합 = 장축의 길이)를 좌표로만 풀려 하고, 초점을 지나는 선분·두 타원이 함께 가진 초점에서 거리를 바꿔 쓰지 못한다.
//  - 밖의 점에서 그은 접선을 기울기 공식으로만 구해 좌표축에 평행한 접선을 빠뜨린다.
//  - 평행한 두 접선이 원점에 대하여 대칭인 두 점에서의 접선이라는 것, 두 접점을 잇는 직선이 접선의 식과 같은 꼴이라는 것을 떠올리지 못한다.
//
// 실력에 둔 까닭(①은 뜻을 정확히 대야 풀리는 함정, ②는 세 단계 넘게 잇는 문제)
//  ① hard-share(두 타원의 정의를 빼면 함께 가진 초점까지의 거리가 지워진다), hard-swap(장축·단축·초점의 역할을 새 타원에 다시 대기),
//    hard-locus(내접·외접을 중심 사이 거리로 바꾸면 거리의 합이 일정 — 타원), hard-normal(접선에 수직인 직선은 ∠F′PF의 이등분선),
//    hard-polar(두 접점이 같은 일차식을 만족한다 — 접점을 구하지 않는다)
//  ② hard-right(정의 + 피타고라스 → 연립 → 높이), hard-mid(정의 → 중점 연결 → 새 타원의 정의), hard-cos(삼각비 → 길이 → 꼭짓점 → 두 정의 빼기),
//    hard-para(평행사변형 → 수선 → 정의 + 피타고라스), hard-ellpara(포물선의 정의 → 타원의 정의 → 직각삼각형 둘), hard-rect(넓이 → 절대부등식 → 등호),
//    hard-tanlen(이등변삼각형 → 접점의 좌표 → 접선 → 대입), hard-pardist(접선 둘 → 거리의 식 → 범위)
// ①29(중16)의 원문 답 ⑤ 33√7/2 는 점 Q가 제1사분면에 있을 때의 값이다(원문이 말한 제2사분면이면 33√7/5). 원문 글의 조건(Q는 제2사분면)대로 코드로 다시 셈했다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, N, M, C, inline } = B.kit;
  const { MINUS, Q, tx, nb, V, sup, poly, nz, rt, sqParts, radText, SG } = B.kit.mid;
  const { ms, jh, plot } = B.kit.hs;
  const { S2, S4, H, gcd, isSq, sqrtI, jn, sg, rootTx, X, Y, X2, Y2, pt, named, ellEq, coefOf, coefTx, normLine, lineTx, sameLine, radLen, ellFig } = B.kit.u42x;

  const hard = [
    H('hard-right', '두 초점을 바라보는 각이 직각인 점 — 정의와 피타고라스 정리', '①21', (d) => {
      const a = d.int(3, 9), aa = a * a, b2 = d.int(1, aa - 1), d2 = aa - 2 * b2;
      if (d2 <= 0 || !isSq(d2)) return null;
      const dd = sqrtI(d2), PF = a - dd, PF2 = a + dd, FQ = PF + d.int(1, 6), area = FQ * PF2 / 2;
      if (!Number.isInteger(area)) return null;
      const c = Math.sqrt(aa - b2), P = [a * dd / c, b2 / c], Fp = [c, 0], Qp = [c + (P[0] - c) * FQ / PF, P[1] * FQ / PF];
      const figure = ellFig({ aa, bb: b2, x: [-a - 0.4, Math.max(a, Qp[0]) + 0.5], y: [-Math.sqrt(b2) - 0.4, Math.max(Math.sqrt(b2), Qp[1]) + 0.5],
        segs: [{ p: [-c, 0], q: P }, { p: Fp, q: Qp }, { p: [-c, 0], q: Qp }],
        dots: [{ x: c, y: 0, name: 'F', side: 'd', said: 'x좌표가 양수인 초점' }, { x: -c, y: 0, name: "F'", side: 'd', said: 'x좌표가 음수인 초점' }, { x: P[0], y: P[1], name: 'P', side: 'ul', said: '타원 위의 제1사분면의 점' }, { x: Qp[0], y: Qp[1], name: 'Q', said: '선분 FP의 연장선 위의 점' }] });
      return N(`그림과 같이 타원 ${ellEq(aa, b2)}의 두 초점 가운데 ${X}좌표가 양수인 점을 F, 음수인 점을 F′이라 하자. 이 타원 위의 제1사분면의 점 P에서 ${nb('∠F′PF = 90°')}이고, 선분 FP의 연장선 위에 ${nb(SG('FQ') + ' = ' + FQ)}인 점 Q를 잡을 때, 삼각형 QF′F의 넓이는? (단, 점 Q의 ${Y}좌표는 양수이다.)`, area, {
        figure,
        explain: `${nb(SG('PF') + ' = ' + V('p'))}, ${nb(SG('PF′') + ' = ' + V('q'))}라 하면 타원의 정의에서 ${nb(ms('p + q') + ' = ' + 2 * a)}이고, ${nb(SG('FF′') + sup(2) + ' = 4 × (' + aa + ' ' + MINUS + ' ' + b2 + ') = ' + 4 * (aa - b2))}이므로 직각삼각형 F′PF에서 ${nb(ms('p^2 + q^2') + ' = ' + 4 * (aa - b2))}이다. 연립하면 ${nb(ms('pq') + ' = ' + 2 * b2)}이고 점 P가 F에 가까우므로 ${nb(ms('p') + ' = ' + PF)}, ${nb(ms('q') + ' = ' + PF2)}이다. 선분 F′P는 직선 FQ에 수직이므로 넓이는 ${nb(`½ × ${SG('FQ')} × ${SG('F′P')} = ½ × ${FQ} × ${PF2} = ${area}`)}이다.`,
        facts: { value: `${FQ}*(${aa}**0.5+(${aa}-2*${b2})**0.5)/2` } });
    }),
    H('hard-share', '초점 하나를 함께 갖는 두 타원 — 거리의 차', '①23', (d) => {
      const L1 = d.int(4, 14), L2 = L1 + d.int(2, 10), ans = 2 * (L2 - L1);
      return N(`한 직선 위의 서로 다른 세 점 F₁, F₂, F₃에 대하여 두 점 F₁, F₂를 초점으로 하고 장축의 길이가 ${L1}인 타원 C₁과, 두 점 F₂, F₃을 초점으로 하고 장축의 길이가 ${L2}인 타원 C₂가 있다. 두 타원이 만나는 서로 다른 두 점을 A, B라 할 때, ${nb('|' + SG('AF₁') + ' ' + MINUS + ' ' + SG('AF₃') + '| + |' + SG('BF₁') + ' ' + MINUS + ' ' + SG('BF₃') + '|')}의 값은?`, ans, {
        explain: `점 A는 두 타원 위에 있으므로 ${nb(SG('AF₁') + ' + ' + SG('AF₂') + ' = ' + L1)}, ${nb(SG('AF₂') + ' + ' + SG('AF₃') + ' = ' + L2)}이다. 두 식을 빼면 ${SG('AF₂')}가 지워져 ${nb('|' + SG('AF₁') + ' ' + MINUS + ' ' + SG('AF₃') + '| = ' + (L2 - L1))}이다. 점 B도 같으므로 구하는 값은 ${nb(`${L2 - L1} + ${L2 - L1} = ${ans}`)}이다.`,
        facts: { value: `2*(${L2}-${L1})` } });
    }),
    H('hard-swap', '장축·단축·초점의 역할을 바꾼 타원과 원', '①25', (d) => {
      const k = d.pick([2, 4, 6, 8, 10, 12]), a2 = 3 * k / 2, Av = V('a');
      return N(`타원 ${nb(frac(X2, Av + sup(2)) + ' + ' + frac(Y2, k) + ' = 1')} ${nb(`(${Av}${sup(2)} &gt; ${k})`)}의 단축을 장축으로 하고 이 타원의 두 초점을 이은 선분을 단축으로 하는 타원을 E라 하자. 타원 E의 단축을 지름으로 하는 원이 타원 E의 두 초점을 지날 때, 상수 ${nb(Av + sup(2))}의 값은?`, a2, {
        explain: `주어진 타원의 단축의 양 끝은 ${nb('(0, ±' + rootTx(k) + ')')}, 두 초점은 ${nb('(±' + rt(Av + sup(2) + ' ' + MINUS + ' ' + k) + ', 0)')}이므로 E는 ${nb(frac(X2, Av + sup(2) + ' ' + MINUS + ' ' + k) + ' + ' + frac(Y2, k) + ' = 1')}이고 장축이 ${Y}축 위에 있다. E의 두 초점은 ${nb('(0, ±' + rt(k + ' ' + MINUS + ' (' + Av + sup(2) + ' ' + MINUS + ' ' + k + ')') + ')')}이고, 원의 반지름은 E의 짧은 반축 ${rt(Av + sup(2) + ' ' + MINUS + ' ' + k)}이다. 원이 두 초점을 지나므로 ${nb(`${2 * k} ${MINUS} ${Av}${sup(2)} = ${Av}${sup(2)} ${MINUS} ${k}`)}, 곧 ${nb(Av + sup(2) + ' = ' + a2)}이다.`,
        facts: { value: `3*${k}/2` } });
    }),
    H('hard-locus', '두 원에 내접·외접하는 원의 중심이 그리는 타원', '①26', (d) => {
      const R = d.int(4, 9), r = d.int(1, R - 2), dd = d.pick([2, 4, 6]);
      if (dd + r >= R || (R + r) % 2 !== 0) return null;
      const a = (R + r) / 2, h = dd / 2, b2 = a * a - h * h;
      const shown = nb(frac('(' + poly([[1, X], [-h, '']]) + ')' + sup(2), a * a) + ' + ' + frac(Y2, b2) + ' = 1');
      return inline(`좌표평면에서 원 ${nb(X2 + ' + ' + Y2 + ' = ' + R * R)}에 내접하면서 원 ${nb('(' + poly([[1, X], [-dd, '']]) + ')' + sup(2) + ' + ' + Y2 + ' = ' + r * r)}에 외접하는 원의 중심을 P라 할 때, 점 P가 나타내는 도형의 방정식을 구하시오.`,
        frac('(' + X + ' {0})' + sup(2), '{1}') + ' + ' + frac(Y2, '{2}') + ' = 1', [{ answer: -h, signed: true }, { answer: a * a }, { answer: b2 }], {
          shown,
          explain: `중심이 P인 원의 반지름을 ${jh(V('r'), '이라/라')} 하자. 큰 원(중심 O, 반지름 ${R})에 내접하므로 ${nb(SG('OP') + ' = ' + R + ' ' + MINUS + ' ' + V('r'))}, 작은 원(중심 A(${dd}, 0), 반지름 ${r})에 외접하므로 ${nb(SG('AP') + ' = ' + r + ' + ' + V('r'))}이다. 더하면 ${nb(SG('OP') + ' + ' + SG('AP') + ' = ' + (R + r))}이므로 점 P는 두 점 O, A를 초점으로 하고 장축의 길이가 ${R + r}인 타원 위에 있다. 중심은 ${pt(h, 0)}, 긴 반축은 ${a}, 초점까지의 거리는 ${h}이므로 ${shown}이다.`,
          facts: { calc: [[`0-${dd}/2`, 0], [`((${R * R}**0.5+${r * r}**0.5)/2)**2`, 1], [`((${R * R}**0.5+${r * r}**0.5)/2)**2-(${dd}/2)**2`, 2]] } });
    }),
    H('hard-mid', '중심이 원점이 아닌 타원 위의 점과 중점 — 원점이 중심인 타원', '①27', (d) => {
      const c1 = d.int(2, 5), A = 2 * d.int(c1 + 1, 3 * c1 - 1), a = A / 2, b2 = a * a - c1 * c1, PF = 2 * A - 4 * c1, Av = V('a'), Bv = V('b');
      return inline(`두 초점이 ${named('F', 3 * c1, 0)}, ${named('F′', -c1, 0)}이고 장축의 길이가 ${2 * A}인 타원 C가 있다. ${nb(SG('F′F') + ' = ' + SG('F′P'))}인 타원 C 위의 점 P에 대하여 선분 F′P의 중점을 Q라 하자. 한 초점이 F′인 타원 ${nb(frac(X2, Av + sup(2)) + ' + ' + frac(Y2, Bv + sup(2)) + ' = 1')}이 점 Q를 지날 때, 상수 ${nb(Av + sup(2))}, ${nb(Bv + sup(2))}의 값을 구하시오.`,
        `${Av}${sup(2)} = {0}, ${Bv}${sup(2)} = {1}`, [{ answer: a * a }, { answer: b2 }], {
          shown: `${nb(Av + sup(2) + ' = ' + a * a)}, ${nb(Bv + sup(2) + ' = ' + b2)}`,
          explain: `${nb(SG('F′P') + ' = ' + SG('F′F') + ' = ' + 4 * c1)}이고 타원 C의 정의에서 ${nb(SG('PF') + ' = ' + 2 * A + ' ' + MINUS + ' ' + 4 * c1 + ' = ' + PF)}이다. 원점이 중심인 타원의 다른 초점은 F″(${c1}, 0)이고, 이 점은 선분 F′F의 중점이다. Q는 선분 F′P의 중점이므로 ${nb(SG('QF″') + ' = ½' + SG('PF') + ' = ' + PF / 2)}, ${nb(SG('QF′') + ' = ' + 2 * c1)}이다. 따라서 이 타원의 장축의 길이는 ${nb(`${2 * c1} + ${PF / 2} = ${A}`)}, 긴 반축은 ${a}이고 ${nb(Av + sup(2) + ' = ' + a * a)}, ${nb(Bv + sup(2) + ` = ${a * a} ${MINUS} ${c1 * c1} = ${b2}`)}이다.`,
          facts: { calc: [[`(${2 * A}/4)**2`, 0], [`(${2 * A}/4)**2-${c1}**2`, 1]] } });
    }),
    H('hard-cos', '두 타원이 만나는 점에서 거리의 차 — cos 조건', '①28', (d) => {
      const [p, s, q] = d.pick([[12, 5, 13], [4, 3, 5], [24, 7, 25], [40, 9, 41], [60, 11, 61]]), twoA = q + s, a1 = twoA / 2, c = p / 2, FP = a1 - c, M0 = s * s + FP * FP, N0 = twoA - FP;
      const sh = d.int(0, 4), opts = [0, 1, 2, 3, 4].map((i) => i - sh).map((t) => [N0 + t, M0 + t]);
      if (opts.some(([, m]) => m <= 0 || isSq(m))) return null;
      const texts = opts.map(([n, m]) => nb(`${n} ${MINUS} ${rootTx(m)}`));
      return C(`두 초점이 ${nb('F(' + V('c') + ', 0)')}, ${nb('F′(' + MINUS + V('c') + ', 0)')} ${nb(`(${V('c')} &gt; 0)`)}이고 장축의 길이가 ${twoA}인 타원을 C₁이라 하자. 점 F를 지나고 ${X}축에 수직인 직선이 타원 C₁과 제1사분면에서 만나는 점을 A라 하고, 두 점 F, A를 초점으로 하고 점 ${named('P', a1, 0)}을 지나는 타원을 C₂라 하자. 두 타원 C₁, C₂가 만나는 점 가운데 P가 아닌 점을 Q라 하자. ${nb('cos(∠FF′A) = ' + frac(p, q))}일 때, ${nb(SG('F′Q') + ' ' + MINUS + ' ' + SG('AQ'))}의 값은?`, texts, sh, {
        explain: `삼각형 AF′F는 ∠F가 직각이므로 ${nb(SG('F′F') + ' : ' + SG('F′A') + ' = ' + p + ' : ' + q)}이고 ${nb(SG('FA') + ' : ' + SG('F′A') + ' = ' + s + ' : ' + q)}이다. 타원의 정의에서 ${nb(SG('F′A') + ' + ' + SG('FA') + ' = ' + twoA)}이므로 ${nb(SG('F′A') + ' = ' + q)}, ${nb(SG('FA') + ' = ' + s)}, ${nb(SG('F′F') + ' = ' + p)}, ${nb(V('c') + ' = ' + c)}이다. 점 P(${a1}, 0)은 C₁의 꼭짓점이므로 ${nb(SG('FP') + ' = ' + FP)}, ${nb(SG('AP') + ' = ' + rt(`${s}${sup(2)} + ${FP}${sup(2)}`) + ' = ' + rootTx(M0))}이고 C₂의 장축의 길이는 ${nb(rootTx(M0) + ' + ' + FP)}이다. 점 Q는 두 타원 위에 있으므로 ${nb(SG('F′Q') + ' + ' + SG('FQ') + ' = ' + twoA)}, ${nb(SG('AQ') + ' + ' + SG('FQ') + ' = ' + rootTx(M0) + ' + ' + FP)}이고, 빼면 ${nb(SG('F′Q') + ' ' + MINUS + ' ' + SG('AQ') + ' = ' + N0 + ' ' + MINUS + ' ' + rootTx(M0))}이다.`,
        facts: { truth: opts.map((o, i) => i === sh), want: true } });
    }),
    H('hard-para', '두 초점을 지나는 평행한 두 직선과 평행사변형의 넓이', '①29', (d) => {
      const a = d.int(3, 10), c = d.int(1, a - 1), m = d.int(1, 2 * c - 1), h2 = 4 * c * c - m * m, [k, s] = sqParts(h2), b2 = a * a - c * c;
      if (s < 2) return null;
      const t = Q(2 * b2, 2 * a + m), R = Q(2 * b2 * k, 2 * a + m);
      if (R.q < 2 || -c + (2 * b2 / (2 * a - m)) * (m / (2 * c)) < 0) return null;
      const h = Math.sqrt(h2), u = [-m / (2 * c), h / (2 * c)], tq = 2 * b2 / (2 * a + m), Qp = [-c + tq * u[0], tq * u[1]], Pp = [-Qp[0], -Qp[1]], l = V('l'), mv = V('m');
      const figure = ellFig({ aa: a * a, bb: b2, lines: [{ p: [-c, 0], q: Qp }, { p: [c, 0], q: Pp }],
        dots: [{ x: c, y: 0, name: 'F', side: 'ur', said: 'x좌표가 양수인 초점' }, { x: -c, y: 0, name: "F'", side: 'dl', said: 'x좌표가 음수인 초점' }, { x: Qp[0], y: Qp[1], name: 'Q', side: 'l', said: '직선 m과 타원이 제2사분면에서 만나는 점' }, { x: Pp[0], y: Pp[1], name: 'P', side: 'r', said: '직선 l과 타원이 제4사분면에서 만나는 점' }] });
      return inline(`그림과 같이 타원 ${ellEq(a * a, b2)}의 두 초점을 F, F′이라 하자. 초점 F를 지나는 직선 ${jh(l, '이/가')} 타원과 제4사분면에서 만나는 점을 P, 초점 F′을 지나는 직선 ${jh(mv, '이/가')} 타원과 제2사분면에서 만나는 점을 Q라 하자. 두 직선 ${l}, ${mv}이 서로 평행하고 두 직선 사이의 거리가 ${rootTx(h2)}일 때, 사각형 QF′PF의 넓이는? (단, 점 F의 ${X}좌표는 양수이다.)`,
        frac('{0}' + rt('{1}'), '{2}'), [{ answer: R.p }, { answer: s }, { answer: R.q }], {
          figure, shown: frac(radText(R.p, s), R.q),
          explain: `두 초점은 F(${c}, 0), F′(${MINUS}${c}, 0)이다. 점 F에서 직선 ${mv}에 내린 수선의 발을 H라 하면 ${nb(SG('FH') + ' = ' + rootTx(h2))}, ${nb(SG('F′H') + ' = ' + rt(`${4 * c * c} ${MINUS} ${h2}`) + ' = ' + m)}이고, 점 Q는 F′을 사이에 두고 H의 반대쪽에 있다. ${nb(SG('QF′') + ' = ' + V('t'))}라 하면 ${nb(SG('QH') + ' = ' + V('t') + ' + ' + m)}, ${nb(SG('QF') + ' = ' + 2 * a + ' ' + MINUS + ' ' + V('t'))}이고 직각삼각형 QHF에서 ${nb(`(${2 * a} ${MINUS} ${V('t')})${sup(2)} = (${V('t')} + ${m})${sup(2)} + ${h2}`)}이므로 ${nb(V('t') + ' = ' + tx(t))}이다. 타원은 원점에 대하여 대칭이므로 사각형 QF′PF는 평행사변형이고, 넓이는 ${nb(SG('QF′') + ' × ' + SG('FH') + ' = ' + tx(t) + ' × ' + rootTx(h2) + ' = ')}${frac(radText(R.p, s), R.q)}이다.`,
          facts: { calc: [[`2*${b2}*(${h2}/${s})**0.5*${R.q}/(2*${a * a}**0.5+(4*${c}**2-${h2})**0.5)`, 0], [`${s}`, 1], [`${R.q}`, 2]] } });
    }),
    H('hard-ellpara', '초점을 함께 갖는 타원과 포물선 — 단축의 길이', '①30', (d) => {
      const a = d.int(3, 12), dd = d.int(1, 2 * a - 1), S = 2 * dd * dd - (2 * a - dd) * (2 * a - dd);
      if (S <= 0 || !isSq(S)) return null;
      const fq = sqrtI(S), c2 = dd - fq, c = c2 / 2;
      if (c2 <= 0 || c >= a) return null;
      const minor2 = 4 * a * a - c2 * c2, [k, s] = sqParts(minor2);
      if (k < 2 || s < 2) return null;
      const b = Math.sqrt(a * a - c * c), xp = dd - c, yp = Math.sqrt(4 * c * xp), yl = Math.max(b, yp) + 0.6;
      const figure = ellFig({ aa: a * a, bb: b * b, y: [-yl, yl], params: [{ x: (t) => t * t / (4 * c), y: (t) => t, from: -yl, to: yl, said: '포물선' }],
        segs: [{ p: [c, 0], q: [xp, yp] }, { p: [-c, 0], q: [xp, yp] }],
        dots: [{ x: c, y: 0, name: 'F', side: 'd', said: '초점 F(c, 0)' }, { x: -c, y: 0, name: "F'", side: 'd', said: '초점 F′(−c, 0)' }, { x: xp, y: yp, name: 'P', side: 'ul', said: '타원과 포물선이 제1사분면에서 만나는 점' }] });
      return radLen(`그림과 같이 두 초점이 ${nb('F(' + V('c') + ', 0)')}, ${nb('F′(' + MINUS + V('c') + ', 0)')}이고 장축의 길이가 ${2 * a}인 타원과, 초점이 ${nb('F(' + V('c') + ', 0)')}이고 꼭짓점이 원점인 포물선이 제1사분면에서 만나는 점을 P라 하자. ${nb(SG('PF') + ' = ' + dd)}일 때, 타원의 단축의 길이는? ${nb(`(단, ${V('c')} &gt; 0`)}이고 점 P의 ${X}좌표는 ${V('c')}보다 크다.)`, k, s, '', {
        figure,
        explain: `포물선의 준선은 ${nb(X + ' = ' + MINUS + V('c'))}이므로 점 P에서 준선에 내린 수선의 발을 H라 하면 ${nb(SG('PH') + ' = ' + SG('PF') + ' = ' + dd)}이다. 타원의 정의에서 ${nb(SG('PF′') + ' = ' + 2 * a + ' ' + MINUS + ' ' + dd + ' = ' + (2 * a - dd))}이다. 점 P에서 ${X}축에 내린 수선의 발을 R이라 하면 ${nb(SG('PR') + sup(2) + ' = ' + (2 * a - dd) + sup(2) + ' ' + MINUS + ' ' + dd + sup(2) + ' = ' + ((2 * a - dd) ** 2 - dd * dd))}(직각삼각형 HF′P, ${nb(SG('F′R') + ' = ' + SG('PH'))})이고, 직각삼각형 PFR에서 ${nb(SG('FR') + ' = ' + rt(`${dd * dd} ${MINUS} ${(2 * a - dd) ** 2 - dd * dd}`) + ' = ' + fq)}이다. ${nb(SG('F′R') + ' = 2' + V('c') + ' + ' + fq + ' = ' + dd)}에서 ${nb(V('c') + ' = ' + tx(Q(c2, 2)))}이므로 단축의 길이는 ${nb('2' + rt(`${a * a} ${MINUS} ${tx(Q(c2 * c2, 4))}`) + ' = ' + radText(k, s))}이다.`,
        facts: { calc: [[`((${2 * a}**2-(${dd}-(2*${dd}**2-(${2 * a}-${dd})**2)**0.5)**2)/${s})**0.5`, 0], [`${s}`, 1]] } });
    }),
    H('hard-rect', '타원에 내접하는 직사각형의 최대 넓이', '②4', (d) => {
      const A = d.int(5, 40), Bh = d.int(3, A - 1), area = 2 * A * Bh;
      if (area > 9999) return null;
      return N(`장축의 길이가 ${2 * A} m, 단축의 길이가 ${2 * Bh} m인 타원 모양의 땅에, 네 꼭짓점이 모두 타원 위에 있고 각 변이 장축 또는 단축에 평행한 직사각형 모양의 꽃밭을 만들려고 한다. 꽃밭의 넓이의 최댓값은?`, area, {
        unit: 'm²',
        explain: `타원의 중심을 원점, 장축을 ${X}축에 놓으면 타원은 ${ellEq(A * A, Bh * Bh)}이다. 제1사분면의 꼭짓점을 ${nb('(' + ms('x') + ', ' + ms('y') + ')')}라 하면 넓이는 ${nb('4' + ms('xy'))}이다. 산술평균과 기하평균의 관계에서 ${nb('1 = ' + frac(X2, A * A) + ' + ' + frac(Y2, Bh * Bh) + ' ≥ 2 × ' + frac(ms('xy'), A * Bh))}이므로 ${nb(ms('xy') + ' ≤ ' + tx(Q(A * Bh, 2)))}, 곧 넓이는 ${nb(`4 × ${tx(Q(A * Bh, 2))} = ${area}`)} m² 이하이다. 등호는 ${nb(frac(X, A) + ' = ' + frac(Y, Bh))}일 때 성립하므로 최댓값은 ${area} m²이다.`,
        facts: { value: `2*(${2 * A}/2)*(${2 * Bh}/2)` } });
    }),
    H('hard-normal', '접선에 수직인 직선이 두 초점 사이를 나누는 비', '②16', (d) => {
      const a = d.int(3, 8), aa = a * a, bb = d.int(1, aa - 1), c = Math.sqrt(aa - bb), dd = d.int(1, a - 1);
      if (dd <= a - c + 1e-9) return null;
      const g = gcd(2 * a - dd, dd), b = Math.sqrt(bb), xp = a * (a - dd) / c, yp = b * Math.sqrt(1 - (xp * xp) / aa), qx = xp * (c * c) / aa, slope = -bb * xp / (aa * yp);
      const figure = ellFig({ aa, bb, lines: [{ p: [xp, yp], q: [xp + 1, yp + slope] }], segs: [{ p: [xp, yp], q: [qx, 0] }, { p: [-c, 0], q: [xp, yp] }, { p: [c, 0], q: [xp, yp] }],
        dots: [{ x: c, y: 0, name: 'F', side: 'dr', said: 'x좌표가 양수인 초점' }, { x: -c, y: 0, name: "F'", side: 'dl', said: 'x좌표가 음수인 초점' }, { x: xp, y: yp, name: 'P', side: 'ur', said: '타원 위의 제1사분면의 점' }, { x: qx, y: 0, name: 'Q', side: 'dl', said: '접선에 수직인 직선과 x축의 교점' }] });
      return inline(`그림과 같이 타원 ${ellEq(aa, bb)}의 두 초점을 F, F′이라 하자. 이 타원 위의 제1사분면의 점 P에 대하여 ${nb(SG('PF') + ' = ' + dd)}이고, 점 P를 지나고 점 P에서의 접선에 수직인 직선이 ${X}축과 만나는 점을 Q라 할 때, ${nb(SG('QF′') + ' : ' + SG('QF'))}를 가장 간단한 자연수의 비로 나타내시오. (단, 점 F의 ${X}좌표는 양수이다.)`,
        '{0} : {1}', [{ answer: (2 * a - dd) / g }, { answer: dd / g }], {
          figure, shown: nb(`${(2 * a - dd) / g} : ${dd / g}`),
          explain: `타원의 정의에서 ${nb(SG('PF′') + ' = ' + 2 * a + ' ' + MINUS + ' ' + dd + ' = ' + (2 * a - dd))}이다. 타원 위의 점 P를 지나고 ∠F′PF의 이등분선에 수직인 직선이 P에서의 접선이므로, 접선에 수직인 직선 PQ는 ∠F′PF의 이등분선이다. 각의 이등분선의 성질에서 ${nb(SG('QF′') + ' : ' + SG('QF') + ' = ' + SG('PF′') + ' : ' + SG('PF') + ` = ${2 * a - dd} : ${dd}`)}${g > 1 ? ' = ' + nb(`${(2 * a - dd) / g} : ${dd / g}`) : ''}이다.`,
          facts: { calc: [[`(2*${aa}**0.5-${dd})/${g}`, 0], [`${dd}/${g}`, 1]] } });
    }),
    H('hard-polar', '밖의 점에서 그은 두 접선의 접점을 지나는 직선', '②23', (d) => {
      const p = d.int(1, 6), q = d.int(1, 6), r = d.int(2, 40), u = nz(d, -4, 4), v = nz(d, -4, 4);
      if (p === q || gcd(p, q) !== 1 || p * u * u + q * v * v <= r) return null;
      const right = normLine(p * u, q * v, r);
      // 틀린 보기: p·q 를 바꿔 넣음, p·q 를 빠뜨림, x·y 좌표를 바꿔 넣음, 오른쪽 변의 부호를 바꿈, 오른쪽 변을 두 배로
      const wrong = [normLine(q * u, p * v, r), normLine(u, v, r), normLine(p * v, q * u, r), normLine(p * u, q * v, -r), normLine(p * u, q * v, 2 * r)].filter((l, i, all) => !sameLine(l, right) && all.findIndex((m) => sameLine(m, l)) === i);
      if (wrong.length < 4) return null;
      const list = d.shuffle([right].concat(d.shuffle(wrong).slice(0, 4))), at = list.findIndex((l) => sameLine(l, right));
      return C(`점 ${pt(u, v)}에서 타원 ${coefTx(p, q, r)}에 그은 두 접선의 접점을 P, Q라 할 때, 직선 PQ의 방정식은?`, list.map(lineTx), at, {
        explain: `${nb('P(' + ms('x_1') + ', ' + ms('y_1') + ')')}에서의 접선 ${jh(nb(poly([[p, ms('x_1x')], [q, ms('y_1y')]]) + ' = ' + r), '이/가')} 점 ${jh(pt(u, v), '을/를')} 지나므로 ${nb(poly([[p * u, ms('x_1')], [q * v, ms('y_1')]]) + ' = ' + r)}이다. ${nb('Q(' + ms('x_2') + ', ' + ms('y_2') + ')')}에서도 ${nb(poly([[p * u, ms('x_2')], [q * v, ms('y_2')]]) + ' = ' + r)}이다. 곧 두 점 P, Q는 모두 직선 ${nb(poly([[p * u, X], [q * v, Y]]) + ' = ' + r)} 위에 있으므로 직선 PQ는 ${lineTx(right)}이다(접점을 따로 구하지 않아도 된다).`,
        facts: { truth: list.map((l) => sameLine(l, right)), want: true } });
    }),
    H('hard-tanlen', '접선의 길이가 원점까지의 거리와 같은 점', '②24', (d) => {
      const LIST = [4, 6, 9, 10, 12, 14, 16, 20], onY = d.bool(), mainSq = d.pick(LIST), other = d.int(2, 24);
      if (other === mainSq) return null;
      const aa = onY ? other : mainSq, bb = onY ? mainSq : other, [k, s] = sqParts(2 * mainSq), Av = V('a');
      const P = onY ? nb('P(0, ' + Av + ')') : nb('P(' + Av + ', 0)');
      return radLen(`점 ${P}에서 타원 ${ellEq(aa, bb)}에 그은 접선의 접점을 T라 할 때, 원점 O에 대하여 ${nb(SG('PT') + ' = ' + SG('OT'))}가 성립하도록 하는 양수 ${Av}의 값은?`, k, s, '', {
        explain: `삼각형 POT는 ${nb(SG('PT') + ' = ' + SG('OT'))}인 이등변삼각형이므로 점 T에서 ${onY ? Y : X}축에 내린 수선의 발은 선분 OP의 중점이고, 점 T의 ${onY ? Y : X}좌표는 ${frac(Av, 2)}이다. 점 T에서의 접선 ${nb(onY ? frac(ms('x_1x'), aa) + ' + ' + frac(Av + Y, 2 * bb) + ' = 1' : frac(Av + X, 2 * aa) + ' + ' + frac(ms('y_1y'), bb) + ' = 1')}이 점 P를 지나므로 ${nb(frac(Av + sup(2), 2 * mainSq) + ' = 1')}, 곧 ${nb(Av + sup(2) + ' = ' + 2 * mainSq)}이다. 따라서 ${nb(Av + ' = ' + radText(k, s))}이다.`,
        facts: { calc: [[`(2*${mainSq}/${s})**0.5`, 0], [`${s}`, 1]] } });
    }),
    H('hard-pardist', '서로 평행한 두 접선 사이 거리의 최솟값과 최댓값', '②26 ➌', (d) => {
      const A = d.int(1, 6), Bs = d.int(1, 6);
      if (A === Bs) return null;
      const E = coefOf(A * A, Bs * Bs), lo = 2 * Math.min(A, Bs), hi = 2 * Math.max(A, Bs), l = V('l'), mv = V('m');
      return M(`타원 ${E.text} 위의 점 P에서의 접선을 ${jh(l, '이라/라')} 하고, 이 타원에 접하고 직선 ${l}에 평행한 다른 직선을 ${jh(mv, '이라/라')} 하자. 점 P가 타원 위를 움직일 때, 두 직선 ${l}, ${mv} 사이의 거리의 최솟값과 최댓값을 구하시오.`,
        [{ label: '최솟값', answer: lo }, { label: '최댓값', answer: hi }], {
          explain: `점 P를 ${jh(nb('(' + ms('x_1') + ', ' + ms('y_1') + ')'), '이라/라')} 하면 ${l}: ${nb(poly([[E.p, ms('x_1x')], [E.q, ms('y_1y')]]) + ' = ' + E.r)}, ${mv}: ${nb(poly([[E.p, ms('x_1x')], [E.q, ms('y_1y')]]) + ' = ' + MINUS + E.r)}(원점에 대하여 대칭인 점에서의 접선)이다. 두 직선 사이의 거리는 ${nb(frac(2 * E.r, rt(poly([[E.p * E.p, ms('x_1^2')], [E.q * E.q, ms('y_1^2')]]))))}이고, ${jh(nb(poly([[E.p, ms('x_1^2')], [E.q, ms('y_1^2')]]) + ' = ' + E.r), '을/를')} 써서 한 문자로 나타내면 점 P가 단축의 끝일 때 가장 작고(단축의 길이 ${lo}), 장축의 끝일 때 가장 크다(장축의 길이 ${hi}).`,
          facts: { calc: [[`2*(${E.r}/${Math.max(E.p, E.q)})**0.5`, 0], [`2*(${E.r}/${Math.min(E.p, E.q)})**0.5`, 1]] } });
    })
  ];

  B.addGroup('11-4-2', { id: 'hard', title: '실력 문제', standard: S2, types: hard.map((t) => (/^hard-(normal|polar|tanlen|pardist)$/.test(t.id) ? Object.assign(t, { standard: S4 }) : t)) });
})(typeof window !== 'undefined' ? window : globalThis);
