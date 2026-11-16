// 수학 8-2 7단원 도형의 닮음과 피타고라스 정리: 낱말 도식(공용 도구는 math-1.js 의 root.CVMath8)
(function (root) {
  'use strict';
  const { C, svg, put, f, P, g, motion, lab, mt, pill, card, line, pathD, polyD, dot, ring, angMark, tick, arrow, add, sub, mul, dist, unit, mid, lerp } = root.CVMath8;
  const KEY = '8-2/수학/7/';
  const cen = (...p) => [p.reduce((a, q) => a + q[0], 0) / p.length, p.reduce((a, q) => a + q[1], 0) / p.length];
  const vlab = (Pt, G, s, { d = 22, c = C.ink, size = 22 } = {}) => { const q = add(Pt, mul(unit(sub(Pt, G)), d)); return lab(q[0], q[1] + size * .36, s, { c, size }); };
  const tri = (pts, fill = C.mint, stroke = C.ink, w = 4, extra = '') => `<path ${extra} d="${polyD(pts)}" fill="${fill}" stroke="${stroke}" stroke-width="${w}" stroke-linejoin="round"/>`;
  // 변 바깥(무게중심 반대쪽)에 길이 글씨
  const side = (p, q, G, s, { c = C.ink, size = 22, d = 18 } = {}) => {
    const m = mid(p, q), u = unit(sub(q, p)); let n = [-u[1], u[0]];
    if ((m[0] - G[0]) * n[0] + (m[1] - G[1]) * n[1] < 0) n = mul(n, -1);
    const t = add(m, mul(n, d)); return lab(t[0], t[1] + size * .36, s, { c, size });
  };

  // 닮음: 작은 △ABC 와 큰 △DEF → △ABC 를 2배로 늘려 옮기면 △DEF 에 꼭 포개짐 → △ABC ∽ △DEF
  {
    const id = 't82-m7-dalm';
    const sh = [[0, 0], [110, 0], [36, -92]];
    const Bs = [74, 266], Be = [330, 300];
    const S = sh.map((p) => add(Bs, p)), L = sh.map((p) => add(Be, mul(p, 2)));
    const Gs = cen(...S), Gl = cen(...L);
    const body = tri([S[2], S[0], S[1]], C.mint) + tri([L[2], L[0], L[1]], C.sky)
      + vlab(S[2], Gs, 'A') + vlab(S[0], Gs, 'B') + vlab(S[1], Gs, 'C') + vlab(L[2], Gl, 'D') + vlab(L[0], Gl, 'E') + vlab(L[1], Gl, 'F')
      + `<g class="grow">${tri([S[2], S[0], S[1]], C.peach, C.orange, 3, 'vector-effect="non-scaling-stroke" fill-opacity=".7"')}</g>`
      + g('s2', arrow(196, 214, 286, 214, C.orange, '', 3) + lab(241, 200, '× 2', { c: C.orange, size: 24 }), .1)
      + g('s3', lab(250, 52, '△ABC', { size: 30 }) + `<path d="M304 38 Q312 58 320 43 T336 48" stroke="${C.ink}" stroke-width="4" fill="none" stroke-linecap="round"/>` + lab(390, 52, '△DEF', { size: 30 }), .1)
      + pill(110, 50, '닮음', C.green, { size: 28, cls: 'p3', d: .6, fill: C.mint });
    put(KEY + '닮음', svg(id, body, motion(id) + `
      .sc-${id} .grow { transform-box: view-box; transform-origin: ${Bs[0]}px ${Bs[1]}px; opacity: 0; transition: transform 1.2s ease-in-out .3s, opacity .3s ease .1s; }
      .on2 .sc-${id} .grow { opacity: 1; transform: translate(${Be[0] - Bs[0]}px, ${Be[1] - Bs[1]}px) scale(2); }`));
  }

  // 닮음비: 세 변 3, 4, 5 와 6, 8, 10 → 대응변끼리 3 : 6, 4 : 8, 5 : 10 → 모두 1 : 2
  {
    const id = 't82-m7-dalmbi';
    const u = 24, Cs = [64, 250], Cl = [290, 304];
    const s = [add(Cs, [0, -3 * u]), add(Cs, [4 * u, 0]), Cs], l = [add(Cl, [0, -6 * u]), add(Cl, [8 * u, 0]), Cl];
    const Gs = cen(...s), Gl = cen(...l);
    const pair = (k, c, cls, d) => {
      const [i, j] = [[2, 0], [2, 1], [0, 1]][k];
      return g(cls, line(s[i], s[j], { c, w: 7 }) + line(l[i], l[j], { c, w: 7 }), d);
    };
    const R = [['3', '6', C.green], ['4', '8', C.blue], ['5', '10', C.orange]];
    const body = tri(s, C.mint) + tri(l, C.sky)
      + side(s[2], s[0], Gs, '3') + side(s[2], s[1], Gs, '4') + side(s[0], s[1], Gs, '5')
      + side(l[2], l[0], Gl, '6') + side(l[2], l[1], Gl, '8') + side(l[0], l[1], Gl, '10')
      + pair(0, C.green, 's2', .1) + pair(1, C.blue, 's2', .5) + pair(2, C.orange, 's2', .9)
      + R.map(([a, b, c], k) => g('s2', lab(566, 76 + k * 46, `${a} : ${b}`, { c, size: 28 }), .3 + k * .4)).join('')
      + g('s3', `<path d="M512 46 V206" stroke="${C.line}" stroke-width="3"/>` + lab(566, 240, '= 1 : 2', { size: 30 }), .2)
      + pill(566, 300, '닮음비', C.green, { size: 26, cls: 'p3', d: .8, fill: C.mint });
    put(KEY + '닮음비', svg(id, body, motion(id)));
  }

  // 삼각형의 닮음 조건: SSS(세 쌍의 변의 비) → SAS(두 쌍의 변의 비와 끼인각) → AA(두 쌍의 각)
  {
    const id = 't82-m7-jogeon';
    const sh = [[0, 0], [100, 0], [25, -84]];
    const Bs = [60, 228], Be = [300, 270];
    const S = sh.map((p) => add(Bs, p)), L = sh.map((p) => add(Be, mul(p, 2)));
    const Gs = cen(...S), Gl = cen(...L);
    const [sB, sC, sA] = S, [lB, lC, lA] = L;
    const lay = (n, inner) => g(`b${n}${n < 3 ? ` h${n + 1}` : ''}`, inner);
    const body = tri([sA, sB, sC], C.mint) + tri([lA, lB, lC], C.sky)
      + vlab(sA, Gs, 'A') + vlab(sB, Gs, 'B') + vlab(sC, Gs, 'C') + vlab(lA, Gl, 'D') + vlab(lB, Gl, 'E') + vlab(lC, Gl, 'F')
      + lay(1, g('s1', side(sA, sB, Gs, '7', { c: C.green }) + side(lA, lB, Gl, '14', { c: C.green }), .1) + g('s1', side(sB, sC, Gs, '8', { c: C.blue }) + side(lB, lC, Gl, '16', { c: C.blue }), .35)
        + g('s1', side(sA, sC, Gs, '9', { c: C.orange }) + side(lA, lC, Gl, '18', { c: C.orange }), .6)
        + lab(560, 110, '1 : 2', { size: 30 }) + lab(560, 146, '세 쌍', { size: 20, c: C.muted }))
      + lay(2, side(sA, sB, Gs, '7', { c: C.green }) + side(sB, sC, Gs, '8', { c: C.blue }) + side(lA, lB, Gl, '14', { c: C.green }) + side(lB, lC, Gl, '16', { c: C.blue })
        + g('p2', angMark(sB, sA, sC, 28, C.peach) + angMark(lB, lA, lC, 34, C.peach), .3) + lab(560, 110, '1 : 2', { size: 30 }) + lab(560, 146, '∠B = ∠E', { size: 22, c: C.orange }))
      + lay(3, g('p3', angMark(sB, sA, sC, 28, C.peach) + angMark(lB, lA, lC, 34, C.peach), .1) + g('p3', angMark(sC, sB, sA, 28, C.lilac) + angMark(lC, lB, lA, 34, C.lilac), .4)
        + lab(560, 100, '∠B = ∠E', { size: 22, c: C.orange }) + lab(560, 140, '∠C = ∠F', { size: 22, c: C.purple }))
      + pill(110, 334, 'SSS 닮음', C.green, { size: 22, cls: 'p1', d: .8, fill: C.mint })
      + pill(320, 334, 'SAS 닮음', C.green, { size: 22, cls: 'p2', d: .8, fill: C.mint })
      + pill(530, 334, 'AA 닮음', C.green, { size: 22, cls: 'p3', d: .8, fill: C.mint })
;
    put(KEY + '삼각형의 닮음 조건', svg(id, body, motion(id)));
  }

  // 중선·무게중심 공통 삼각형
  const TA = [250, 46], TB = [92, 290], TC = [488, 290], TG = cen(TA, TB, TC);
  const MA = mid(TB, TC), MB = mid(TC, TA), MC = mid(TA, TB);

  // 중선: 삼각형 → 변 BC 의 중점 M(BM = MC) → 꼭짓점 A 와 M 을 이은 선분 AM 이 중선(중선은 3개)
  {
    const id = 't82-m7-jungseon';
    const body = tri([TA, TB, TC], C.mint) + vlab(TA, TG, 'A') + vlab(TB, TG, 'B') + vlab(TC, TG, 'C')
      + g('s2', tick(TB, MA, { c: C.blue }) + tick(MA, TC, { c: C.blue }), .5)
      + dot(MA, { r: 8, c: C.blue, cls: 'p2', d: .2 }) + g('s2', lab(MA[0], MA[1] + 30, 'M', { c: C.blue, size: 24 }), .3)
      + line(TA, MA, { c: C.orange, w: 6, cls: 'd3', d: .1 })
      + g('s3', lab(...add(lerp(TA, MA, .35), [-12, 4]), '중선', { c: C.orange, size: 22, anchor: 'end' }), .7)
      + g('s3', line(TB, MB, { c: C.orange, w: 3, dash: '8 6' }) + line(TC, MC, { c: C.orange, w: 3, dash: '8 6' }), 1.1)
      + pill(575, 200, '중선', C.green, { size: 28, cls: 'p3', d: 1.4, fill: C.mint });
    put(KEY + '중선', svg(id, body, motion(id)));
  }

  // 무게중심: 세 중선 → 한 점 G 에서 만남 → AG : GM = 2 : 1
  {
    const id = 't82-m7-mugejungsim';
    const t1 = lerp(TA, MA, 1 / 3), t2 = lerp(TA, MA, 2 / 3);
    const nrm = unit([-(MA[1] - TA[1]), MA[0] - TA[0]]);
    const bar = (p) => line(add(p, mul(nrm, -12)), add(p, mul(nrm, 12)), { c: C.red, w: 3 });
    const body = tri([TA, TB, TC], C.mint) + vlab(TA, TG, 'A') + vlab(TB, TG, 'B') + vlab(TC, TG, 'C')
      + line(TA, MA, { c: C.orange, w: 4, cls: 'd1', d: .1 }) + line(TB, MB, { c: C.orange, w: 4, cls: 'd1', d: .5 }) + line(TC, MC, { c: C.orange, w: 4, cls: 'd1', d: .9 })
      + g('s1', lab(MA[0], MA[1] + 28, 'M', { size: 22 }), .4)
      + dot(TG, { r: 9, c: C.red, cls: 'p2', d: .1 }) + ring(TG, 12, C.red, 'r2', .2) + g('s2', lab(TG[0] + 16, TG[1] - 20, 'G', { c: C.red, size: 26 }), .5)
      + g('s3', line(TA, TG, { c: C.purple, w: 7 }) + line(TG, MA, { c: C.blue, w: 7 }), .1)
      + g('s3', bar(t1) + bar(t2), .4)
      + g('s3', lab(...add(mid(TA, TG), [-26, 6]), '2', { c: C.purple, size: 26 }) + lab(...add(mid(TG, MA), [-24, 8]), '1', { c: C.blue, size: 26 }), .7)
      + g('s3', lab(560, 160, 'AG : GM', { size: 26 }) + lab(560, 200, '= 2 : 1', { size: 28, c: C.red }), 1)
      + pill(560, 290, '무게중심', C.red, { size: 26, cls: 'p3', d: 1.3, fill: C.peach });
    put(KEY + '무게중심', svg(id, body, motion(id)));
  }

  // 피타고라스 정리: 직각삼각형(3, 4, 5) → 직각을 낀 두 변 위 정사각형 9, 16 → 빗변 위 정사각형 25 → 9 + 16 = 25, a² + b² = c²
  {
    const id = 't82-m7-pita';
    const u = 29, Cc = [200, 228], B = add(Cc, [4 * u, 0]), A = add(Cc, [0, -3 * u]);
    const nH = [3 * u, -4 * u]; // AB 바깥쪽(직각 반대쪽)으로 한 변 5u
    const sqB = [Cc, B, add(B, [0, 4 * u]), add(Cc, [0, 4 * u])], sqA = [A, Cc, add(Cc, [-3 * u, 0]), add(A, [-3 * u, 0])], sqC = [A, B, add(B, nH), add(A, nH)];
    const grid = (Q, n) => { let d = ''; for (let k = 1; k < n; k++) { const a = lerp(Q[0], Q[1], k / n), b = lerp(Q[3], Q[2], k / n), c = lerp(Q[0], Q[3], k / n), e = lerp(Q[1], Q[2], k / n); d += `M${P(a)} L${P(b)} M${P(c)} L${P(e)}`; } return `<path d="${d}" stroke="white" stroke-width="2"/>`; };
    const sq = (Q, n, fill, stroke, num, cls, d) => g(cls, `<path d="${polyD(Q)}" fill="${fill}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/>` + grid(Q, n)
      + (() => { const c = cen(...Q); return `<circle cx="${f(c[0])}" cy="${f(c[1])}" r="18" fill="white" stroke="${stroke}" stroke-width="2.5"/>` + lab(c[0], c[1] + 8, num, { c: stroke, size: 21 }); })(), d);
    const chip = (p, s, c) => `<rect x="${f(p[0] - 14)}" y="${f(p[1] - 14)}" width="28" height="28" rx="7" fill="white" stroke="${c}" stroke-width="2.5"/>` + mt(p[0], p[1] + 8, s, { size: 23, color: c });
    const body = sq(sqB, 4, C.sky, C.blue, '16', 'p2', .5) + sq(sqA, 3, C.mint, C.green, '9', 'p2', .1) + sq(sqC, 5, C.peach, C.orange, '25', 'p3', .1)
      + tri([A, B, Cc], 'white') + `<path d="M${Cc[0]} ${Cc[1] - 16} H${Cc[0] + 16} V${Cc[1]}" stroke="${C.red}" stroke-width="3" fill="none"/>`
      + chip(mid(A, Cc), 'a', C.green) + chip(mid(Cc, B), 'b', C.blue) + chip(mid(A, B), 'c', C.orange)
      + g('s4', mt(520, 120, '{#green|9} + {#blue|16} = {#orange|25}', { size: 30 }), .1)
      + g('s4', mt(520, 184, '{#green|a^2} + {#blue|b^2} = {#orange|c^2}', { size: 32 }), .5)
      + pill(520, 270, '피타고라스 정리', C.green, { size: 22, cls: 'p4', d: 1, fill: C.mint });
    put(KEY + '피타고라스 정리', svg(id, body, motion(id)));
  }
})(typeof window !== 'undefined' ? window : globalThis);
