// 고등학교 미적분Ⅱ 급수(11-5-2) — 뒤쪽 묶음: 등비급수의 수렴·발산과 합, 등비급수가 수렴할 조건, 합에서 거꾸로 구하기,
// 순환소수·실생활, 되풀이되는 도형과 점. 단원 틀과 도구는 11-5-2a.js(B.kit.u52x), 실력 문항은 11-5-2c.js 에 있다.
// 싣는 기준과 뺀 것은 11-5-2a.js 머리에 모아 적었다. ref: ②n = 기본꼴_2의 n번.
// 새로 그린 그림(단원 안의 작은 함수): 색칠을 되풀이한 정사각형(paintSquare), 원과 내접 정다각형이 번갈아 그려진 그림(circPoly),
// 중점을 이어 되풀이한 정사각형(midSquares), 직각이등변삼각형 안의 정사각형(triSquares). 그래프는 공용 plot 으로 그렸다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, N, M, C, inline } = B.kit;
  const { MINUS, gcd, Q, qadd, qsub, qmul, qdiv, isInt, V, sup, nb, rt, poly, rep, tail, ex } = B.kit.mid;
  const { ms, fn, trig, pw, jh, hx, qAns, piAns, plot } = B.kit.hs;
  const { Board, at } = B.kit.mgeo;
  const U = B.kit.u52x;
  const { UNIT, HAN, T, jn, jq, tq, sT, par, VN, VX, VR, AN, BN, SN, A_, SEQA, pn, SI, SK, LIM, joinH, range, close, fl, choose, pickSets, val, pos, given, frac, cf, surd, surdVal, svs } = U;
  const ratio = (x) => (x.q === 1 && x.p > 0 ? String(x.p) : par(tq(x)));   // 거듭제곱의 밑으로 적는 유리수

  // (A + B√k)/D 꼴의 수: 글과 값. D > 0 으로 맞추고 약분한다.
  function surdQ(A, Bc, k, D) {
    let a = A, b = Bc, dd = D;
    if (dd < 0) { a = -a; b = -b; dd = -dd; }
    const g = gcd(gcd(Math.abs(a), Math.abs(b)), dd) || 1; a /= g; b /= g; dd /= g;
    return { a, b, k, d: dd, v: (a + b * Math.sqrt(k)) / dd };
  }
  function surdH(s) {
    const r = (b) => (Math.abs(b) === 1 ? '' : Math.abs(b)) + rt(s.k);
    let top;
    if (s.b === 0) top = sT(s.a);
    else if (s.a === 0) top = (s.b < 0 ? MINUS : '') + r(s.b);
    else top = sT(s.a) + (s.b < 0 ? ' ' + MINUS + ' ' : ' + ') + r(s.b);
    if (s.d === 1) return nb(top);
    if (s.a === 0 && s.b < 0) return nb(MINUS + frac(r(s.b), s.d));
    if (s.b === 0) return nb((s.a < 0 ? MINUS : '') + frac(Math.abs(s.a), s.d));
    return nb(frac(top, s.d));
  }

  // ── 그림 ──
  const RECT = (x, y, w, h, fill) => `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" style="fill:${fill};stroke:#1f2933;stroke-width:1"/>`;
  const PINK = '#fbcfe8', YEL = '#fde68a', BLUE = '#93c5fd';
  // 넓이가 S인 정사각형을 색칠을 되풀이하여 나눈 그림. kind 4: 네 등분(분홍·노랑·파랑, 오른쪽 위를 다시), kind 3: 세 등분(파랑·노랑, 남은 띠를 다시 — 세로·가로를 번갈아)
  function paintSquare(kind) {
    const W = 216, x0 = 6, y0 = 6;
    let out = '', x = x0, y = y0, w = W, h = W;
    for (let i = 0; i < 7; i += 1) {
      if (kind === 4) {
        const hw = w / 2, hh = h / 2;
        out += RECT(x, y + hh, hw, hh, PINK) + RECT(x + hw, y + hh, hw, hh, BLUE) + RECT(x, y, hw, hh, YEL);
        x += hw; w = hw; h = hh;
      } else if (i % 2 === 0) {
        const tw = w / 3; out += RECT(x, y, tw, h, BLUE) + RECT(x + tw, y, tw, h, YEL); x += 2 * tw; w = tw;
      } else {
        const th = h / 3; out += RECT(x, y, w, th, BLUE) + RECT(x, y + th, w, th, YEL); y += 2 * th; h = th;
      }
    }
    out += RECT(x, y, w, h, '#fff') + RECT(x0, y0, W, W, 'none');
    const said = kind === 4
      ? '정사각형을 네 등분하여 세 조각을 분홍색, 파란색, 노란색으로 칠하고 오른쪽 위의 남은 조각을 다시 네 등분하여 같은 방법으로 칠하기를 되풀이한 그림'
      : '정사각형을 세로로 세 등분하여 파란색, 노란색으로 칠하고 남은 띠를 가로로 세 등분하여 파란색, 노란색으로 칠하기를 세로와 가로를 번갈아 되풀이한 그림';
    return `<svg class="mb-geo" viewBox="0 0 ${W + 12} ${W + 12}" width="${W + 12}" role="img" aria-label="${said}">${out}</svg>`;
  }
  // 원과 내접 정다각형(정삼각형 n=3, 정사각형 n=4)을 번갈아 그린 그림
  function circPoly(sides) {
    const b = Board(), c = [0, 0], rs = [];
    let r = 96;
    for (let i = 0; i < 4; i += 1) {
      rs.push(r);
      b.disk(c, r, 'fill:none');
      if (i < 3) {
        const start = sides === 3 ? 90 : 45, pts = range(0, sides - 1).map((k) => at(c, r, start + k * 360 / sides));
        b.poly(pts);
        r = sides === 3 ? r / 2 : r / Math.SQRT2;
      }
    }
    // 이름: C₁ 은 원 바깥에, C₂·C₃ 은 오른쪽 아래 바깥에 적고 가는 선으로 원을 가리킨다(안쪽은 선이 빽빽하다)
    b.text(at(c, rs[0] + 12, 32), svs('C', 1), { size: 13 });
    [1, 2].forEach((i) => { const p = at(c, rs[i], -38), y = rs[0] * 0.5 + (i - 1) * 24; b.seg(p, [rs[0] + 8, y], 'thin'); b.text([rs[0] + 20, y], svs('C', i + 1), { size: 13 }); });
    return b.svg(sides === 3 ? '원 C1에 내접하는 정삼각형, 그 정삼각형에 내접하는 원 C2, 다시 내접하는 정삼각형과 원 C3이 차례로 그려진 그림' : '원 C1에 내접하는 정사각형, 그 정사각형에 내접하는 원 C2, 다시 내접하는 정사각형과 원 C3이 차례로 그려진 그림');
  }
  // 정사각형의 각 변의 중점을 이어 정사각형을 되풀이하여 그린 그림
  function midSquares(s) {
    const b = Board(), c = [0, 0];
    let r = 104, a = 45;
    for (let i = 0; i < 5; i += 1) {
      const pts = range(0, 3).map((k) => at(c, r, a + k * 90));
      b.poly(pts, i === 0 ? 'fill:#e0f2fe' : 'fill:none');
      if (i < 3) b.text(at(c, r - 14, a + 90), svs('A', i + 1), { size: 12 });
      r /= Math.SQRT2; a += 45;
    }
    b.dim(at(c, 104, 225), at(c, 104, 315), s + ' cm', c, 12);
    return b.svg(`한 변의 길이가 ${s} cm인 정사각형 A1 안에 각 변의 중점을 이은 정사각형 A2, A3, …이 차례로 그려진 그림`);
  }
  // 직각이등변삼각형 ABC(C가 직각, 빗변 AB) 안에 꼭짓점 C 쪽부터 정사각형 R1, R2, …을 차례로 그린 그림
  function triSquares(L) {
    const b = Board(), S = 190, Cp = [0, 0], Bp = [-S, 0], Ap = [0, -S];
    b.poly([Ap, Bp, Cp], 'fill:none');
    let right = 0, side = S / 2;
    const cols = ['#bbf7d0', '#fde68a', '#fecaca', '#bfdbfe', '#e9d5ff'];
    for (let i = 0; i < 5; i += 1) {
      b.poly([[right - side, 0], [right, 0], [right, -side], [right - side, -side]], `fill:${cols[i]}`);
      if (i < 3) b.text([right - side / 2, -side / 2], svs('R', i + 1), { size: i === 2 ? 10 : 13 });
      right -= side; side /= 2;
    }
    b.poly([Ap, Bp, Cp], 'fill:none');
    b.name(Ap, 'A', 90).name(Bp, 'B', 200).name(Cp, 'C', 330).corner(Cp, Bp, Ap);
    b.beside(Cp, Ap, String(L), Bp).beside(Bp, Cp, String(L), Ap, { gap: 16 });
    return b.svg(`직각이등변삼각형 ABC. 각 C가 직각이고 AC = BC = ${L}. 꼭짓점 C를 한 꼭짓점으로 하는 정사각형 R1, 그 왼쪽에 이어 붙인 정사각형 R2, R3, …의 위쪽 왼쪽 꼭짓점이 빗변 AB 위에 있다.`);
  }

  // ── 등비급수의 수렴·발산과 합 ──
  B.addTypes(UNIT, 'geo', [
    T('geo-list', '나열한 등비급수 — 첫째항과 공비를 읽어', '②1', (d, n) => {
      if (n === 0) {
        const r = d.pick([Q(-1, 4), Q(1, 3), Q(-1, 3), Q(1, 2), Q(-1, 2), Q(2, 3), Q(-2, 3), Q(3, 4), Q(2, 5), Q(-1, 5)]);
        const a = Q(d.int(1, 6) * (r.q <= 3 ? r.q * r.q : r.q));
        const terms = range(0, 3).map((k) => qmul(a, Q(r.p ** k, r.q ** k)));
        const v = qdiv(a, qsub(Q(1), r));
        if (v.q > 60 || Math.abs(v.p) > 999 || terms.some((t) => t.q > 999 || Math.abs(t.p) > 999)) return null;
        const fig = joinH(terms.map((t) => [t.p < 0, tq(Q(Math.abs(t.p), t.q))])) + ' + ⋯';
        return val('다음 등비급수의 합은?', v, {
          figure: hx(fig),
          explain: `첫째항이 ${tq(a)}, 공비가 ${tq(r)}이고 ${nb(MINUS + '1 &lt; ' + tq(r) + ' &lt; 1')}이므로 수렴하고, 합은 ${nb(frac(tq(a), '1 ' + MINUS + ' ' + par(tq(r))) + ' = ' + tq(v))}이다.`,
          facts: { value: `${jq(terms[0])}/(1-${jq(terms[1])}/${jq(terms[0])})` }
        });
      }
      if (n === 1) {
        const R2 = rt(2), R3 = rt(3);
        const div = [
          [`1 ${MINUS} ${R2} + 2 ${MINUS} 2${R2} + ⋯`, -Math.SQRT2],
          [`1 + ${R2} + 2 + 2${R2} + ⋯`, Math.SQRT2],
          [`${frac(R3, 9)} + ${frac(1, 3)} + ${frac(R3, 3)} + 1 + ⋯`, Math.sqrt(3)],
          [`3 + 4 + ${frac(16, 3)} + ${frac(64, 9)} + ⋯`, 4 / 3],
          [`4 ${MINUS} 6 + 9 ${MINUS} ${frac(27, 2)} + ⋯`, -1.5],
          [`2 ${MINUS} 2 + 2 ${MINUS} 2 + ⋯`, -1]
        ];
        const conv = [
          [`1 + (1 ${MINUS} ${R2}) + (1 ${MINUS} ${R2})${sup(2)} + (1 ${MINUS} ${R2})${sup(3)} + ⋯`, 1 - Math.SQRT2],
          [`3 + ${R3} + 1 + ${frac(R3, 3)} + ⋯`, 1 / Math.sqrt(3)],
          [`1 + (${R3} ${MINUS} 1) + (${R3} ${MINUS} 1)${sup(2)} + ⋯`, Math.sqrt(3) - 1],
          [`9 ${MINUS} 6 + 4 ${MINUS} ${frac(8, 3)} + ⋯`, -2 / 3]
        ];
        const rows = d.shuffle(div).slice(0, 4).concat([d.pick(conv)]).map(([h, r]) => [nb(h), Math.abs(r) < 1]);
        return choose(d, '다음 등비급수 가운데 수렴하는 것은?', rows.map((r) => [hx(r[0]), r[1]]), {
          explain: `등비급수는 공비 ${jh(VR, '이/가')} ${nb(MINUS + '1 &lt; ' + VR + ' &lt; 1')}일 때만 수렴한다. ${rows.filter((r) => r[1]).map((r) => r[0])[0]}의 공비는 절댓값이 1보다 작고, 나머지는 공비의 절댓값이 1 이상이다(${rt(2)} ≒ 1.41, ${rt(3)} ≒ 1.73).`
        });
      }
      // 근호가 든 공비의 등비급수의 합
      const kind = d.int(0, 1), a = d.int(1, 3);
      const aT = (h) => (a === 1 ? h : a + h);
      let fig, right, wrong;
      if (kind === 0) {
        fig = `${a} + ${aT(par('1 ' + MINUS + ' ' + rt(2)))} + ${aT(par('1 ' + MINUS + ' ' + rt(2)) + sup(2))} + ⋯`;
        right = surdQ(0, a, 2, 2); wrong = [surdQ(0, a, 2, 1), surdQ(2 * a, a, 2, 2), surdQ(-a, a, 2, 1), surdQ(a, 0, 2, 2)];
      } else {
        fig = `${a} + ${aT(par(rt(3) + ' ' + MINUS + ' 1'))} + ${aT(par(rt(3) + ' ' + MINUS + ' 1') + sup(2))} + ⋯`;
        right = surdQ(2 * a, a, 3, 1); wrong = [surdQ(2 * a, -a, 3, 1), surdQ(0, a, 3, 3), surdQ(a, a, 3, 1), surdQ(2 * a, 0, 3, 1)];
      }
      const rows = [[surdH(right), true]].concat(wrong.filter((w) => !close(w.v, right.v)).map((w) => [surdH(w), false]));
      return choose(d, '다음 등비급수의 합은?', rows, {
        figure: ex(fig, 4),   // 근호와 괄호가 많아 공용 읽기 글꼴에서 넓어진다 — 글씨를 조금 더 줄인다
        explain: kind === 0
          ? `공비가 ${nb('1 ' + MINUS + ' ' + rt(2))}이고 ${nb(MINUS + '1 &lt; 1 ' + MINUS + ' ' + rt(2) + ' &lt; 0')}이므로 합은 ${nb(frac(a, '1 ' + MINUS + ' (1 ' + MINUS + ' ' + rt(2) + ')') + ' = ' + frac(a, rt(2)) + ' = ' + surdH(right))}이다.`
          : `공비가 ${nb(rt(3) + ' ' + MINUS + ' 1')}이고 ${nb('0 &lt; ' + rt(3) + ' ' + MINUS + ' 1 &lt; 1')}이므로 합은 ${nb(frac(a, '1 ' + MINUS + ' (' + rt(3) + ' ' + MINUS + ' 1)') + ' = ' + frac(a, '2 ' + MINUS + ' ' + rt(3)) + ' = ' + surdH(right))}이다.`
      });
    }, { count: 3 }),
    T('geo-sigma', 'Σ로 준 등비급수 — 지수를 정리해 첫째항과 공비', '②2', (d, n) => {
      if (n === 0) {
        const kind = d.int(0, 3);
        let body, first, r, ex;
        if (kind === 0) { const c = d.int(1, 5), b = d.pick([2, 3, 4, 5]); body = (c === 1 ? '' : c + ' × ') + pw(b, ms('1-n')); first = Q(c); r = Q(1, b); ex = `${c}/(1-1/${b})`; }
        else if (kind === 1) { const b = d.pick([2, 3, 4]), m = d.pick([2, 3]); body = pw(b, ms(m + '-2n')); first = Q(b ** m, b * b); r = Q(1, b * b); ex = `(${b}**${m}/${b}**2)/(1-1/${b}**2)`; }
        else if (kind === 2) { const [p, q] = d.pick([[1, 2], [1, 3], [2, 3], [3, 4], [2, 5], [3, 5]]); body = pw(par(frac(p, q)), ms('n+1')); first = Q(p * p, q * q); r = Q(p, q); ex = `(${p}/${q})**2/(1-${p}/${q})`; }
        else { const [p, q] = d.pick([[1, 2], [1, 3], [2, 3], [3, 4], [1, 4]]), c = d.int(2, 6); body = c + ' × ' + pw(par(frac(p, q)), ms('n-1')); first = Q(c); r = Q(p, q); ex = `${c}/(1-${p}/${q})`; }
        const v = qdiv(first, qsub(Q(1), r));
        return val(`등비급수 ${SI(body)}의 합은?`, v, {
          explain: `${nb(VN + ' = 1')}을 넣으면 첫째항은 ${tq(first)}, 공비는 ${tq(r)}이다. ${nb(MINUS + '1 &lt; ' + tq(r) + ' &lt; 1')}이므로 합은 ${nb(frac(tq(first), '1 ' + MINUS + ' ' + tq(r)) + ' = ' + tq(v))}이다.`,
          facts: { value: ex, rule: 'sigma' + kind }
        });
      }
      // 근호가 든 밑: r = u + v√k, 지수가 n 이면 첫째항 r, n − 1 이면 첫째항 1
      const [u, vv, k] = d.pick([[-1, 1, 2], [-2, 1, 5], [-1, 1, 3], [2, -1, 3]]), expN = d.bool();
      const base = par(vv > 0 ? rt(k) + ' ' + MINUS + ' ' + Math.abs(u) : u + ' ' + MINUS + ' ' + rt(k));
      const D1 = (1 - u) ** 2 - vv * vv * k, Dp = (1 + u) ** 2 - vv * vv * k;
      const inv = surdQ(1 - u, vv, k, D1);                               // 1/(1 − r)
      const rOver = surdQ(u * (1 - u) + vv * vv * k, vv, k, D1);         // r/(1 − r)
      const invP = surdQ(1 + u, -vv, k, Dp);                             // 1/(1 + r)
      const rOverP = surdQ(u * (1 + u) - vv * vv * k, vv, k, Dp);        // r/(1 + r)
      const right = expN ? rOver : inv;
      const cands = [right, expN ? inv : rOver, expN ? rOverP : invP, surdQ(0, 1, k, 1), surdQ(1, 1, k, 1)];
      const rows = [], seen = [];
      for (const c of cands) { if (seen.some((x) => close(x, c.v))) continue; seen.push(c.v); rows.push([surdH(c), close(c.v, right.v)]); }
      if (rows.length < 4) return null;
      return choose(d, `등비급수 ${SI(pw(base, expN ? VN : ms('n-1')))}의 합은?`, rows, {
        explain: `공비 ${jh(base, '은/는')} 0과 1 사이의 수이므로 수렴한다. 첫째항은 ${expN ? base : '1'}이므로 합은 ${nb(frac(expN ? base : '1', '1 ' + MINUS + ' ' + base))}이고, 분모를 유리화하면 ${surdH(right)}이다.`
      });
    }, { count: 2 }),
    T('geo-split', '두 등비급수의 합·차로 나누어 합 구하기', '②3', (d, n) => {
      if (n === 0) {
        const kind = d.int(0, 1);
        if (kind === 0) {
          const c = d.int(3, 8), a = d.int(1, c - 2), b = d.int(a + 1, c - 1), s = d.pick([1, -1]);
          const v = qadd(Q(a, c - a), Q(s * b, c - b));
          if (v.p === 0) return null;
          return val(`급수 ${SI(frac(pw(a, VN) + (s > 0 ? ' + ' : ' ' + MINUS + ' ') + pw(b, VN), pw(c, VN)))}의 합은?`.replace(pw(1, VN), '1'), v, {
            explain: `${nb(SI(par(frac(a, c)) + sup(VN)) + (s > 0 ? ' + ' : ' ' + MINUS + ' ') + SI(par(frac(b, c)) + sup(VN)))}이고 두 등비급수가 모두 수렴하므로 합은 ${nb(frac(a, c - a) + (s > 0 ? ' + ' : ' ' + MINUS + ' ') + frac(b, c - b) + ' = ' + tq(v))}이다.`.replace(frac(1, 1), '1'),
            facts: { value: `(${a}/${c})/(1-${a}/${c})+${jn(s)}*(${b}/${c})/(1-${b}/${c})` }
          });
        }
        const a = d.int(2, 6), b = d.int(a + 1, 9), p = d.int(1, 8), q = d.int(1, 9);
        const v = qsub(Q(p, a - 1), Q(q, b - 1));
        if (v.p === 0) return null;
        return val(`급수 ${SI(par(frac(p, pw(a, VN)) + ' ' + MINUS + ' ' + frac(q, pw(b, VN))))}의 합은?`, v, {
          explain: `${nb(frac(p, pw(a, VN)) + ' = ' + p + ' × ' + par(frac(1, a)) + sup(VN))}, ${nb(frac(q, pw(b, VN)) + ' = ' + q + ' × ' + par(frac(1, b)) + sup(VN))}이므로 합은 ${nb(frac(p, a - 1) + ' ' + MINUS + ' ' + frac(q, b - 1) + ' = ' + tq(v))}이다.`.replace(frac(p, 1), String(p)).replace(frac(q, 1), String(q)),
          facts: { value: `${p}/(${a}-1)-${q}/(${b}-1)`, rule: 'split-recip' }
        });
      }
      if (n === 1) {
        const c = d.int(3, 9), a = d.int(1, c - 1), b = d.int(1, c - 1), s = d.pick([1, -1]);
        if (a === b) return null;
        const v = qadd(Q(a, c - a), Q(-s * b, c + b));
        if (v.p === 0) return null;
        const neg = b === 1 ? par(MINUS + '1') + sup(VN) : par(MINUS + b) + sup(VN);
        const num = (a === 1 ? '1' : pw(a, VN)) + (s > 0 ? ' + ' : ' ' + MINUS + ' ') + neg;
        return val(`급수 ${SI(frac(num, pw(c, VN)))}의 합은?`, v, {
          explain: `${nb(SI(par(frac(a, c)) + sup(VN)) + (s > 0 ? ' + ' : ' ' + MINUS + ' ') + SI(par(MINUS + frac(b, c)) + sup(VN)))}이다. 둘째 급수는 공비가 음수이고 합이 ${nb(frac(MINUS + frac(b, c), '1 + ' + frac(b, c)) + ' = ' + tq(Q(-b, c + b)))}이므로 구하는 합은 ${nb(tq(Q(a, c - a)) + (s > 0 ? ' + ' : ' ' + MINUS + ' ') + par(tq(Q(-b, c + b))) + ' = ' + tq(v))}이다.`,
          facts: { value: `${a}/(${c}-${a})-${jn(s)}*${b}/(${c}+${b})`, rule: 'split-neg' }
        });
      }
      // Σ(p ± q(√2)ⁿ)/2ⁿ = p ± q(√2 + 1)
      const p = d.int(2, 9), q = d.int(1, 3), s = d.pick([1, -1]);
      const A = p + s * q, Bc = s * q;
      if (A === 0) return null;
      const body = frac(p + (s > 0 ? ' + ' : ' ' + MINUS + ' ') + (q === 1 ? '' : q) + par(rt(2)) + sup(VN), pw(2, VN));
      return inline(`급수 ${SI(body)}의 합은?`, `{0} {1}${rt(2)}`, [{ answer: A, signed: true }, { answer: Bc, signed: true }], {
        shown: nb(sT(A) + (Bc < 0 ? ' ' + MINUS + ' ' : ' + ') + (Math.abs(Bc) === 1 ? '' : Math.abs(Bc)) + rt(2)),
        explain: `${nb(SI(frac(p, pw(2, VN))) + ' = ' + p)}이고, ${nb(frac(par(rt(2)) + sup(VN), pw(2, VN)) + ' = ' + par(frac(rt(2), 2)) + sup(VN))}의 합은 ${nb(frac(frac(rt(2), 2), '1 ' + MINUS + ' ' + frac(rt(2), 2)) + ' = ' + frac(rt(2), '2 ' + MINUS + ' ' + rt(2)) + ' = ' + rt(2) + ' + 1')}이다. 따라서 합은 ${nb(p + (s > 0 ? ' + ' : ' ' + MINUS + ' ') + (q === 1 ? '' : q) + par(rt(2) + ' + 1') + ' = ' + sT(A) + (Bc < 0 ? ' ' + MINUS + ' ' : ' + ') + (Math.abs(Bc) === 1 ? '' : Math.abs(Bc)) + rt(2))}이다.`,
        facts: { calc: [[`${p}+${jn(s)}*${q}`, 0], [`${jn(s)}*${q}`, 1]] }
      });
    }, { count: 3 }),
    T('geo-trig', '삼각함수 값이 끼인 등비급수', '②4', (d) => {
      const [p, q] = d.pick([[1, 2], [1, 3], [2, 3], [2, 5], [3, 4], [3, 5], [1, 4]]);
      const kinds = [
        [trig('sin', '(' + VN + 'π + ' + frac('π', 2) + ')'), -1, `${nb(trig('sin', '(' + VN + 'π + ' + frac('π', 2) + ')') + ' = ' + trig('cos', VN + 'π') + ' = ' + par(MINUS + '1') + sup(VN))}`],
        [trig('cos', VN + 'π'), -1, `${nb(trig('cos', VN + 'π') + ' = ' + par(MINUS + '1') + sup(VN))}`],
        [trig('sin', frac('(2' + VN + ' ' + MINUS + ' 1)π', 2)), 1, `${nb(trig('sin', frac('(2' + VN + ' ' + MINUS + ' 1)π', 2)))}는 ${VN}이 홀수일 때 1, 짝수일 때 ${MINUS}1이므로 ${nb(par(MINUS + '1') + sup(ms('n+1')))}`],
        [trig('cos', '(' + VN + ' + 1)π'), 1, `${nb(trig('cos', '(' + VN + ' + 1)π') + ' = ' + par(MINUS + '1') + sup(ms('n+1')))}`]
      ];
      const [tH, sg, why] = d.pick(kinds);
      const r = Q(p, q), v = sg < 0 ? Q(-p, q + p) : Q(p, q + p);
      return val(`급수 ${SI(par(frac(p, q)) + sup(VN) + ' ' + tH)}의 합은?`, v, {
        explain: `${why}이다. 따라서 주어진 급수는 공비가 ${tq(Q(-p, q))}인 등비급수 ${sg < 0 ? '' : MINUS}${SI(par(MINUS + frac(p, q)) + sup(VN))}이고 합은 ${tq(v)}이다.`,
        facts: { value: `${jn(sg)}*${p}/(${q}+${p})` }
      });
    }),
    T('geo-pic', '색칠을 되풀이한 그림으로 등비급수의 합 구하기', '②5', (d, n) => {
      if (n === 0) {
        const S = 3 * d.int(4, 30);
        return pos(`그림은 넓이가 ${S} cm²인 정사각형을 네 등분하여 세 조각을 분홍색, 파란색, 노란색으로 칠하고, 남은 한 조각을 다시 네 등분하여 같은 방법으로 칠하는 일을 한없이 되풀이한 것이다. 파란색으로 칠한 부분 전체의 넓이는?`, Q(S, 3), {
          figure: paintSquare(4), unit: 'cm²',
          explain: `파란색 넓이는 ${nb(frac(S, 4) + ' + ' + frac(S, 16) + ' + ⋯')}로 첫째항 ${frac(S, 4)}, 공비 ${frac(1, 4)}인 등비급수이다. 합은 ${nb(frac(frac(S, 4), '1 ' + MINUS + ' ' + frac(1, 4)) + ' = ' + S / 3)}(cm²)이다. 세 색이 같은 넓이를 나누어 갖고 남는 흰 조각은 0으로 가므로 전체의 ${frac(1, 3)}로 보아도 된다.`,
          facts: { value: `${S}/4/(1-1/4)`, derived: [4] }
        });
      }
      const S = 2 * d.int(5, 45);
      return pos(`그림은 넓이가 ${S} cm²인 정사각형을 세로로 세 등분하여 두 조각을 파란색, 노란색으로 칠하고, 남은 띠를 가로로 세 등분하여 같은 방법으로 칠하는 일을 세로와 가로를 번갈아 한없이 되풀이한 것이다. 파란색으로 칠한 부분 전체의 넓이는?`, Q(S, 2), {
        figure: paintSquare(3), unit: 'cm²',
        explain: `파란색 넓이는 ${nb(frac(S, 3) + ' + ' + frac(S, 9) + ' + ⋯')}로 첫째항 ${frac(S, 3)}, 공비 ${frac(1, 3)}인 등비급수이다. 합은 ${nb(frac(frac(S, 3), '1 ' + MINUS + ' ' + frac(1, 3)) + ' = ' + S / 2)}(cm²)이다. 두 색이 같은 넓이를 나누어 갖고 남는 흰 조각은 0으로 가므로 전체의 ${frac(1, 2)}로 보아도 된다.`,
        facts: { value: `${S}/3/(1-1/3)`, derived: [3] }
      });
    }, { count: 2 })
  ]);

  // ── 등비급수가 수렴할 조건 ──
  // r 를 (−1, 1)에서 고르게 짚어 본 값들(끝 가까이까지)
  const RS = range(1, 1999).map((i) => -1 + i / 1000).concat([-1 + 1e-7, 1 - 1e-7]);
  const always = (fs) => RS.every((r) => fs.every((f) => Math.abs(f(r)) < 1));
  B.addTypes(UNIT, 'cond', [
    T('cond-range', '등비급수가 수렴하도록 하는 x의 범위', '②6', (d, n) => {
      if (n === 0) {
        const a = d.int(-4, 5), b = d.pick([1, 2, 3]), from1 = d.bool();
        if (a === 0 && b === 1) return null;
        const r = b === 1 ? par(pn(1, -a, VX)) : frac(pn(1, -a, VX), b);
        const rp = b === 1 ? r : par(r);   // 분수의 거듭제곱은 괄호로 묶는다
        const fig = (from1 ? '1 + ' + r + ' + ' + rp + sup(2) : r + ' + ' + rp + sup(2) + ' + ' + rp + sup(3)) + ' + ⋯';
        return inline('다음 등비급수가 수렴하도록 하는 실수 ' + VX + '의 값의 범위는?', `{0} &lt; ${VX} &lt; {1}`, [{ answer: a - b, signed: true }, { answer: a + b, signed: true }], {
          figure: hx(fig),
          shown: nb(sT(a - b) + ' &lt; ' + VX + ' &lt; ' + sT(a + b)),
          explain: `공비가 ${r}이므로 ${nb(MINUS + '1 &lt; ' + r + ' &lt; 1')}이어야 한다. ${nb(sT(a - b) + ' &lt; ' + VX + ' &lt; ' + sT(a + b))}이다.${from1 ? '' : ` 첫째항도 ${r}이라 첫째항이 0이 되는 ${nb(VX + ' = ' + sT(a) + tail(Math.abs(a), '은/는'))} 이미 이 범위 안에 있다.`}`,
          facts: { calc: [[`${jn(a)}-${b}`, 0], [`${jn(a)}+${b}`, 1]], derived: [Math.abs(a), b] }
        });
      }
      if (n === 1) {
        const [p, q] = d.pick([[2, 1], [3, 1], [4, 1], [3, 2], [2, 3], [5, 2], [4, 3]]), neg = d.bool();
        const r = Q(neg ? -p : p, q), coefH = (k) => tq(Q(Math.abs(r.p) ** k, r.q ** k)).replace(/^1$/, '');
        const termH = (k) => (k === 1 ? coefH(1) + VX : coefH(k) + VX + sup(k));
        const fig = '1 ' + [1, 2, 3].map((k) => ((neg && k % 2 === 1) ? MINUS + ' ' : '+ ') + termH(k)).join(' ') + ' + ⋯';
        const L = tq(Q(q, p)), lo = nb(MINUS + L);
        const rows = [
          [nb(lo + ' &lt; ' + VX + ' &lt; ' + L), true],
          [nb(MINUS + tq(Q(p, q)) + ' &lt; ' + VX + ' &lt; ' + tq(Q(p, q))), false],
          [nb(lo + ' ≤ ' + VX + ' ≤ ' + L), false],
          [nb('0 &lt; ' + VX + ' &lt; ' + L), false],
          [nb(VX + ' &lt; ' + lo + ' 또는 ' + VX + ' &gt; ' + L), false]
        ];
        return choose(d, `다음 등비급수가 수렴하도록 하는 실수 ${VX}의 값의 범위는?`, rows, {
          figure: hx(fig),
          explain: `공비가 ${nb(tq(r) + VX)}이므로 ${nb(MINUS + '1 &lt; ' + tq(r) + VX + ' &lt; 1')}에서 ${nb(lo + ' &lt; ' + VX + ' &lt; ' + L)}이다.`
        });
      }
      const u = d.pick([1, 2]), w = d.int(3, 9), v0 = u === 2 ? w + 2 * d.int(-2, 2) : d.int(-5, 6);
      const r = frac(pn(u, -v0, VX), w), cnt = u === 1 ? 2 * w - 1 : w - 1;
      return N(`등비급수 ${SI(par(r) + sup(VN))}이 수렴하도록 하는 정수 ${VX}의 개수는?`, cnt, {
        unit: '개',
        explain: `첫째항과 공비가 모두 ${r}이므로 ${nb(MINUS + '1 &lt; ' + r + ' &lt; 1')}이어야 한다. ${nb(sT(v0 - w) + ' &lt; ' + (u === 1 ? '' : u) + VX + ' &lt; ' + sT(v0 + w))}에서 ${nb(tq(Q(v0 - w, u)) + ' &lt; ' + VX + ' &lt; ' + tq(Q(v0 + w, u)))}이므로 정수 ${VX}는 ${cnt}개이다.`,
        facts: { value: u === 1 ? `2*${w}-1` : `${w}-1` }
      });
    }, { count: 3 }),
    T('cond-zero', '첫째항에도 x가 든 등비급수가 수렴할 조건', '②7', (d) => {
      const [a, b] = d.pick([[3, 2], [5, 2], [4, 3], [5, 3], [7, 2], [3, 1], [4, 1]]);
      const L = Q(a - 1, b), R = Q(a + 1, b);
      const Lh = tq(L), Rh = tq(R);
      const rows = [
        [nb(VX + ' = 0 또는 ' + Lh + ' &lt; ' + VX + ' &lt; ' + Rh), true],
        [nb(Lh + ' &lt; ' + VX + ' &lt; ' + Rh), false],
        [nb('0 ≤ ' + VX + ' &lt; ' + Rh), false],
        [nb(VX + ' = 0 또는 ' + Lh + ' ≤ ' + VX + ' ≤ ' + Rh), false],
        [nb(VX + ' = 0 또는 ' + MINUS + Rh + ' &lt; ' + VX + ' &lt; ' + MINUS + Lh), false]
      ];
      return choose(d, `등비급수 ${SI(VX + par(poly([[a, ''], [-b, VX]])) + sup(ms('n-1')))}이 수렴하도록 하는 실수 ${VX}의 값의 범위는?`, rows, {
        explain: `첫째항이 ${VX}, 공비가 ${nb(poly([[a, ''], [-b, VX]]))}이다. 등비급수가 수렴할 필요충분조건은 첫째항이 0이거나 ${nb(MINUS + '1 &lt; ' + poly([[a, ''], [-b, VX]]) + ' &lt; 1')}인 것이므로 ${nb(VX + ' = 0')} 또는 ${nb(Lh + ' &lt; ' + VX + ' &lt; ' + Rh)}이다. ${nb(VX + ' = 0')}을 빠뜨리지 않아야 한다.`
      });
    }),
    T('cond-a', '등비급수의 합이 주어질 때 첫째항이 될 수 있는 값', '②9', (d) => {
      const s = d.pick([Q(1, 6), Q(1, 4), Q(1, 3), Q(1, 2), Q(2, 3), Q(1), Q(3, 2), Q(2), Q(3)]);
      const top = qmul(s, Q(2));
      const inside = d.pick([s, qmul(s, Q(1, 2)), qmul(s, Q(3, 2))]);
      const vals = [inside, Q(0), top, qmul(s, Q(-1)), qmul(s, Q(5, 2))];
      const rows = vals.map((x) => [tq(x), fl(x) > 0 && fl(x) < fl(top)]);
      return choose(d, `등비급수 ${SI(V('a') + VR + sup(ms('n-1')))}의 합이 ${tq(s)}일 때, 다음 중 상수 ${V('a')}의 값이 될 수 있는 것은?`, rows, {
        explain: `수렴하므로 ${nb(MINUS + '1 &lt; ' + VR + ' &lt; 1')}이고 ${nb(frac(V('a'), '1 ' + MINUS + ' ' + VR) + ' = ' + tq(s))}에서 ${nb(V('a') + ' = ' + tq(s) + par('1 ' + MINUS + ' ' + VR))}이다. ${nb('0 &lt; 1 ' + MINUS + ' ' + VR + ' &lt; 2')}이므로 ${nb('0 &lt; ' + V('a') + ' &lt; ' + tq(top))}이고, 이 안의 값은 ${tq(inside)}뿐이다.`
      });
    }),
    T('cond-always', 'Σrⁿ이 수렴할 때 늘 수렴하는 급수', '②10', (d, n) => {
      const R = VR, rn = (h) => par(h) + sup(VN);
      const pool = [
        [SI(rn(frac(R + ' + 1', 2))), [(r) => (r + 1) / 2], `공비 ${jh(frac(R + ' + 1', 2), '은/는')} 0과 1 사이에 있다`],
        [SI(ms('r^{2n+1}')), [(r) => r * r], `공비 ${ms('r^2')}은 0 이상 1 미만이다`],
        [SI(rn(frac(R, 2) + ' + 1')), [(r) => r / 2 + 1], `공비 ${jh(frac(R, 2) + ' + 1', '은/는')} ${frac(1, 2)}과 ${frac(3, 2)} 사이라 1 이상일 수 있다`],
        [SI(rn(MINUS + '2' + R)), [(r) => -2 * r], `공비 ${jh(MINUS + '2' + R, '은/는')} ${MINUS}2와 2 사이라 절댓값이 1 이상일 수 있다`],
        [SI(rn(frac(R + ' ' + MINUS + ' 1', 2))), [(r) => (r - 1) / 2], `공비 ${jh(frac(R + ' ' + MINUS + ' 1', 2), '은/는')} ${MINUS}1과 0 사이에 있다`],
        [SI(rn(frac(R, 2) + ' ' + MINUS + ' 1')), [(r) => r / 2 - 1], `공비 ${jh(frac(R, 2) + ' ' + MINUS + ' 1', '은/는')} ${jh(MINUS + frac(3, 2), '과/와')} ${MINUS}${frac(1, 2)} 사이라 절댓값이 1 이상일 수 있다`],
        [SI(rn(frac('1 ' + MINUS + ' ' + R, 3))), [(r) => (1 - r) / 3], `공비 ${jh(frac('1 ' + MINUS + ' ' + R, 3), '은/는')} 0과 ${frac(2, 3)} 사이에 있다`],
        [SI(rn('2' + R)), [(r) => 2 * r], `공비 ${jh('2' + R, '은/는')} ${MINUS}2와 2 사이라 절댓값이 1 이상일 수 있다`],
        [SI(par(ms('r^n') + ' + ' + ms('r^{2n}'))), [(r) => r, (r) => r * r], `두 등비급수 ${SI(ms('r^n'))}, ${SI(ms('r^{2n}'))}이 모두 수렴한다`],
        [SI(par(ms('r^n') + ' ' + MINUS + ' 3' + ms('r^{2n}'))), [(r) => r, (r) => r * r], `두 등비급수 ${SI(ms('r^n'))}, ${SI(ms('r^{2n}'))}이 모두 수렴한다`],
        [SI(frac(ms('r^n') + ' + ' + par(MINUS + R) + sup(VN), 2)), [(r) => r, (r) => -r], `두 등비급수 ${SI(ms('r^n'))}, ${SI(par(MINUS + R) + sup(VN))}이 모두 수렴한다`],
        [SI(rn(ms('r^2') + ' + 1')), [(r) => r * r + 1], `공비 ${ms('r^2') + ' + 1'}은 1 이상이다`]
      ];
      const rowsAll = d.shuffle(pool).map(([h, fs, why]) => [h, always(fs), why]);
      if (n === 0) {
        const rows = rowsAll.slice(0, 4);
        const k = rows.filter((r) => r[1]).length;
        if (k < 1 || k > 3) return null;
        return pickSets(d, `등비급수 ${SI(ms('r^n'))}이 수렴할 때, 항상 수렴하는 급수만을 보기에서 있는 대로 고른 것은?`, rows.map((r) => [r[0], r[1]]), {
          explain: `${SI(ms('r^n'))}이 수렴하므로 ${nb(MINUS + '1 &lt; ' + R + ' &lt; 1')}이다. ` + rows.map((r, i) => `${HAN[i]}. ${r[2]}. 따라서 ${r[1] ? '항상 수렴한다' : '항상 수렴한다고 할 수 없다'}.`).join(' ')
        });
      }
      const bad = rowsAll.filter((r) => !r[1]), good = rowsAll.filter((r) => r[1]);
      const pickRows = d.shuffle(good.slice(0, 4).concat([bad[0]]));
      return choose(d, `등비급수 ${SI(ms('r^n'))}이 수렴할 때, 다음 중 반드시 수렴한다고 할 수 없는 것은?`, pickRows.map((r) => [r[0], !r[1]]), {
        explain: `${nb(MINUS + '1 &lt; ' + R + ' &lt; 1')}이다. ${bad[0][0]}에서 ${bad[0][2]}. 나머지는 공비가 늘 ${MINUS}1과 1 사이에 있어 항상 수렴한다.`
      });
    }, { count: 2 })
  ]);

  // ── 등비급수의 합에서 거꾸로 구하기 ──
  B.addTypes(UNIT, 'back', [
    T('back-r', '등비급수의 합으로 공비를 구한 뒤 다른 등비급수의 합', '②11', (d, n) => {
      if (n === 0) {
        const r = d.pick([Q(1, 3), Q(1, 2), Q(2, 3), Q(3, 4), Q(2, 5), Q(3, 5), Q(1, 4), Q(4, 5)]);
        const S = qdiv(r, qsub(Q(1), r));
        const targets = [
          ['1 ' + MINUS + ' ' + VR + ' + ' + ms('r^2') + ' ' + MINUS + ' ' + ms('r^3') + ' + ⋯', qdiv(Q(1), qadd(Q(1), r)), `첫째항 1, 공비 ${MINUS}${VR}`, `1/(1+${jq(r)})`],
          ['1 + ' + ms('r^2') + ' + ' + ms('r^4') + ' + ' + ms('r^6') + ' + ⋯', qdiv(Q(1), qsub(Q(1), qmul(r, r))), `첫째항 1, 공비 ${ms('r^2')}`, `1/(1-${jq(r)}**2)`],
          [SI(ms('r^{2n}')), qdiv(qmul(r, r), qsub(Q(1), qmul(r, r))), `첫째항 ${ms('r^2')}, 공비 ${ms('r^2')}`, `${jq(r)}**2/(1-${jq(r)}**2)`],
          [SI(par(MINUS + VR) + sup(VN)), qdiv(qmul(r, Q(-1)), qadd(Q(1), r)), `첫째항 ${MINUS}${VR}, 공비 ${MINUS}${VR}`, `(0-${jq(r)})/(1+${jq(r)})`]
        ];
        const [h, v, how, ex] = d.pick(targets);
        return val(`${nb(SI(ms('r^n')) + ' = ' + tq(S))}일 때, 등비급수 ${h}의 합은?`, v, {
          explain: `${nb(frac(VR, '1 ' + MINUS + ' ' + VR) + ' = ' + tq(S))}에서 ${nb(VR + ' = ' + tq(r))}이다. 구하는 급수는 ${how}인 등비급수이고 ${nb(MINUS + '1 &lt; ' + VR + ' &lt; 1')}이므로 합은 ${tq(v)}이다.`,
          facts: { value: ex.split(jq(r)).join(`((${S.p}/${S.q})/(1+${S.p}/${S.q}))`) }
        });
      }
      // 1 + f + f² + ⋯ = S (f = (a − x)/b) → x → Σ(xⁿ + 1)/cⁿ
      const x = d.pick([Q(1, 5), Q(1, 3), Q(1, 2), Q(2, 3), Q(1), Q(3, 2), Q(-1, 2), Q(1, 4)]), f = d.pick([Q(1, 2), Q(3, 5), Q(1, 3), Q(2, 3), Q(3, 4), Q(-1, 2), Q(2, 5)]);
      const bs = range(1, 6).filter((bb) => isInt(qadd(x, qmul(Q(bb), f))) && qadd(x, qmul(Q(bb), f)).p !== 0);
      if (!bs.length) return null;
      const b = d.pick(bs), a = qadd(x, qmul(Q(b), f)).p, S = qdiv(Q(1), qsub(Q(1), f)), c = d.pick([2, 3]);
      if (fl(x) >= c || fl(x) <= -c) return null;
      const v = qadd(qdiv(x, qsub(Q(c), x)), Q(1, c - 1));
      if (v.q > 99) return null;
      const fShown = b === 1 ? par(poly([[a, ''], [-1, VX]])) : frac(poly([[a, ''], [-1, VX]]), b);
      return val(`등비급수 ${nb('1 + ' + fShown + ' + ' + (b === 1 ? fShown : par(fShown)) + sup(2) + ' + ⋯')}의 합이 ${tq(S)}일 때, 급수 ${SI(frac(ms('x^n') + ' + 1', pw(c, VN)))}의 합은?`, v, {
        explain: `${nb(frac(1, '1 ' + MINUS + ' ' + fShown) + ' = ' + tq(S))}에서 ${nb(fShown + ' = ' + tq(f))}, ${nb(VX + ' = ' + tq(x))}이다. 따라서 ${nb(SI(par(frac(tq(x), c)) + sup(VN)) + ' + ' + SI(par(frac(1, c)) + sup(VN)) + ' = ' + tq(qdiv(x, qsub(Q(c), x))) + ' + ' + tq(Q(1, c - 1)) + ' = ' + tq(v))}이다.`,
        facts: { value: `(${a}-${b}*(1-1/${jq(S)}))/(${c}-(${a}-${b}*(1-1/${jq(S)})))+1/(${c}-1)`, derived: [b, a] }
      });
    }, { count: 2 }),
    T('back-new', '등비수열에서 만든 새 수열의 급수', '②12', (d) => {
      const kind = d.int(0, 1);
      if (kind === 0) {
        const A = d.pick([1, 4, 9, 16, 25]), Bb = d.pick([4, 9, 16, 25]), sa = Math.sqrt(A), sb = Math.sqrt(Bb);
        const v = Q(sb, sa * (sb - 1));
        return val(`첫째항이 ${A}이고 공비가 ${Bb}인 등비수열 ${SEQA}에 대하여 급수 ${SI(frac(1, rt(AN)))}의 합은?`, v, {
          explain: `${nb(AN + ' = ' + A + ' × ' + pw(Bb, ms('n-1')))}이므로 ${nb(frac(1, rt(AN)) + ' = ' + frac(1, sa) + ' × ' + par(frac(1, sb)) + sup(ms('n-1')))}이다. 첫째항 ${frac(1, sa).replace(frac(1, 1), '1')}, 공비 ${frac(1, sb)}인 등비급수이므로 합은 ${tq(v)}이다.`.replace(frac(1, 1), '1'),
          facts: { value: `(1/${A}**0.5)/(1-1/${Bb}**0.5)`, derived: [0.5] }
        });
      }
      const A = d.int(1, 6), Bb = d.pick([2, 3, 4, 5, 6]), v = Q(Bb, A * (Bb - 1));
      return val(`첫째항이 ${A}이고 공비가 ${Bb}인 등비수열 ${SEQA}에 대하여 급수 ${SI(frac(1, AN))}의 합은?`, v, {
        explain: `${nb(frac(1, AN) + ' = ' + frac(1, A) + ' × ' + par(frac(1, Bb)) + sup(ms('n-1')))}이므로 첫째항 ${frac(1, A)}, 공비 ${frac(1, Bb)}인 등비급수이고 합은 ${tq(v)}이다.`.replace(frac(1, 1), '1'),
        facts: { value: `(1/${A})/(1-1/${Bb})`, rule: 'recip' }
      });
    }),
    T('back-sn', '등비수열의 부분합 Sₙ을 끼운 급수', '②16', (d) => {
      const R = d.pick([Q(2), Q(3), Q(3, 2), Q(4, 3), Q(5, 2)]), w = d.pick([Q(1, 3), Q(1, 2), Q(1, 4), Q(2, 3), Q(2, 5)]), a = d.int(1, 6);
      const t = qdiv(w, R);
      if (fl(t) >= 1) return null;
      const v = qmul(qdiv(Q(a), qsub(R, Q(1))), qsub(qdiv(w, qsub(Q(1), w)), qdiv(t, qsub(Q(1), t))));
      if (v.q > 99 || Math.abs(v.p) > 999 || v.p === 0) return null;
      const tH = par(tq(t)) + sup(VN);
      return val(`첫째항이 ${a}이고 공비가 ${tq(R)}인 등비수열의 첫째항부터 제${VN}항까지의 합을 ${SN}이라 할 때, 급수 ${SI(tH + SN)}의 합은?`, v, {
        explain: `${nb(SN + ' = ' + frac((a === 1 ? '' : a) + '{' + ratio(R) + sup(VN) + ' ' + MINUS + ' 1}', tq(R) + ' ' + MINUS + ' 1'))}이므로 ${nb(tH + SN + ' = ' + tq(qdiv(Q(a), qsub(R, Q(1)))) + '{' + par(tq(w)) + sup(VN) + ' ' + MINUS + ' ' + tH + '}')}이다. 두 등비급수가 모두 수렴하므로 합은 ${nb(tq(qdiv(Q(a), qsub(R, Q(1))))+ par(tq(qdiv(w, qsub(Q(1), w))) + ' ' + MINUS + ' ' + tq(qdiv(t, qsub(Q(1), t)))) + ' = ' + tq(v))}이다.`,
        facts: { value: `${a}/(${jq(R)}-1)*((${jq(t)}*${jq(R)})/(1-${jq(t)}*${jq(R)})-${jq(t)}/(1-${jq(t)}))` }
      });
    }),
    T('back-gen', '합으로 준 식에서 일반항을 구한 뒤 등비급수', '②17', (d) => {
      const c = d.int(3, 8), dd = d.int(2, c - 1), e = d.pick([1, 2, 3]);
      if (dd >= c * e) return null;
      const v = qdiv(Q(dd - 1, c), qsub(Q(1), Q(dd, c * e)));
      if (v.q > 99) return null;
      const lhs = `${c}${A_(1)} + ${c}${sup(2)}${A_(2)} + ⋯ + ${c}${sup(VN)}${AN}`;
      const body = e === 1 ? AN : frac(AN, pw(e, ms('n-1')));
      return val(`수열 ${SEQA}이 모든 자연수 ${VN}에 대하여 ${nb(lhs + ' = ' + pw(dd, VN) + ' ' + MINUS + ' 1')}을 만족시킬 때, 급수 ${SI(body)}의 합은?`, v, {
        explain: `${nb(VN + ' ≥ 2')}일 때 ${VN} 대신 ${pn(1, -1)}을 넣은 식을 빼면 ${nb(c + sup(VN) + AN + ' = ' + pw(dd, VN) + ' ' + MINUS + ' ' + pw(dd, ms('n-1')) + ' = ' + (dd - 1 === 1 ? '' : dd - 1) + pw(dd, ms('n-1')))}이고, ${nb(c + A_(1) + ' = ' + (dd - 1))}도 맞으므로 ${nb(AN + ' = ' + frac(dd - 1, c) + par(frac(dd, c)) + sup(ms('n-1')))}이다. ${body}은 첫째항 ${frac(dd - 1, c)}, 공비 ${frac(dd, c * e)}인 등비급수이므로 합은 ${tq(v)}이다.`.replace(frac(1, 1), '1'),
        facts: { value: `((${dd}-1)/${c})/(1-${dd}/(${c}*${e}))` }
      });
    })
  ]);

  // ── 등비급수의 활용 — 순환소수·실생활 ──
  B.addTypes(UNIT, 'use', [
    T('use-rep', '순환소수를 등비급수로 나타내는 과정의 빈칸', '②18', (d, n) => {
      if (n === 0) {
        const ab = d.until(() => d.int(10, 98), (x) => x % 11 !== 0);
        const g = gcd(ab, 99), dot = rep('0.', String(ab));
        const fig = given([`${dot} = 0.${ab} + 0.00${ab} + 0.0000${ab} + ⋯`, `= ${frac(ab, 100)} + ${frac(ab, 10000)} + ${frac(ab, 1000000)} + ⋯`, `첫째항이 ${frac(ab, 100)}, 공비가 ${frac(1, '㈎')}인 등비급수의 합이므로`, `${dot} = ${frac(frac(ab, 100), '1 ' + MINUS + ' ' + frac(1, '㈎'))} = ${frac('㈏', '㈐')}`]);
        return M(`다음은 순환소수 ${jh(dot, '을/를')} 등비급수를 이용하여 분수로 나타내는 과정이다. ㈎, ㈏, ㈐에 알맞은 자연수는? (단, ${frac('㈏', '㈐')}는 기약분수이다.)`, [{ label: '㈎', answer: 100 }, { label: '㈏', answer: ab / g }, { label: '㈐', answer: 99 / g }], {
          figure: fig,
          shown: `㈎ 100, ㈏ ${ab / g}, ㈐ ${99 / g}`,
          explain: `두 자리씩 되풀이되므로 공비는 ${frac(1, 100)}이고, 합은 ${nb(frac(frac(ab, 100), frac(99, 100)) + ' = ' + frac(ab, 99) + (g > 1 ? ' = ' + frac(ab / g, 99 / g) : ''))}이다.`,
          facts: { calc: [['100', 0], [`${ab}/${g}`, 1], [`(100-1)/${g}`, 2]], derived: [g] }
        });
      }
      const a = d.int(1, 9), b = d.until(() => d.int(1, 9), (x) => x !== a);
      const top = 9 * a + b, g = gcd(top, 90), dot = rep('0.' + a, String(b));
      const fig = given([`${dot} = 0.${a} + 0.0${b} + 0.00${b} + 0.000${b} + ⋯`, `= ${frac(a, 10)} + (${frac(b, 100)} + ${frac(b, 1000)} + ⋯)`, `괄호 안은 첫째항이 ${frac(b, 100)}, 공비가 ${frac(1, '㈎')}인 등비급수이므로`, `${dot} = ${frac(a, 10)} + ${frac(frac(b, 100), '1 ' + MINUS + ' ' + frac(1, '㈎'))} = ${frac('㈏', '㈐')}`]);
      return M(`다음은 순환소수 ${dot}를 등비급수를 이용하여 분수로 나타내는 과정이다. ㈎, ㈏, ㈐에 알맞은 자연수는? (단, ${frac('㈏', '㈐')}는 기약분수이다.)`.replace(dot + '를', jh(dot, '을/를')), [{ label: '㈎', answer: 10 }, { label: '㈏', answer: top / g }, { label: '㈐', answer: 90 / g }], {
        figure: fig,
        shown: `㈎ 10, ㈏ ${top / g}, ㈐ ${90 / g}`,
        explain: `소수 둘째 자리부터 한 자리씩 되풀이되므로 공비는 ${frac(1, 10)}이다. ${nb(frac(a, 10) + ' + ' + frac(frac(b, 100), frac(9, 10)) + ' = ' + frac(a, 10) + ' + ' + frac(b, 90) + ' = ' + frac(top, 90) + (g > 1 ? ' = ' + frac(top / g, 90 / g) : ''))}이다.`,
        facts: { calc: [['10', 0], [`(9*${a}+${b})/${g}`, 1], [`90/${g}`, 2]], derived: [g, 9, 90] }
      });
    }, { count: 2 }),
    T('use-pend', '앞의 몇 배씩 줄어드는 거리의 합(진자)', '②19', (d) => {
      const [p, q] = d.pick([[6, 7], [4, 5], [3, 4], [5, 6], [2, 3], [7, 8], [5, 8]]);
      const D1 = q * (q - p) * d.int(1, Math.max(1, Math.floor(160 / (q * (q - p)))));
      if (D1 < 20) return null;
      const D2 = D1 * p / q, total = D1 * q / (q - p);
      return N(`어떤 진자를 놓으면 처음에는 ${D1} cm만큼 움직였다가 방향을 바꾸어 ${D2} cm만큼 움직인다. 이와 같이 진자가 늘 앞서 움직인 거리의 ${frac(p, q)}만큼 방향을 바꾸어 한없이 움직인다고 할 때, 진자가 움직인 거리의 합은?`, total, {
        unit: 'cm',
        explain: `움직인 거리는 첫째항 ${D1}, 공비 ${frac(p, q)}인 등비수열이므로 합은 ${nb(frac(D1, '1 ' + MINUS + ' ' + frac(p, q)) + ' = ' + total)}(cm)이다.`,
        facts: { value: `${D1}/(1-${D2}/${D1})` }
      });
    }),
    T('use-recycle', '수거·재생산이 되풀이되는 재활용 비율', '②20', (d) => {
      const [a, b] = d.pick([[80, 25], [40, 50], [50, 40], [25, 80], [75, 80], [80, 75]]);
      const t = a * b / 100, ans = Math.round(t / (100 - t) * 100);
      return N(`어느 공장에서 만든 페트병의 ${a} %가 수거되고, 수거된 페트병의 ${b} %가 다시 페트병으로 만들어진다. 다시 만든 페트병도 같은 비율로 수거되어 다시 만들어지는 일이 한없이 되풀이된다면, 다시 만들어진 페트병은 모두 처음에 만든 페트병의 몇 %인가?`, ans, {
        unit: '%',
        explain: `한 번 되풀이할 때마다 처음 양의 ${nb(frac(a, 100) + ' × ' + frac(b, 100) + ' = ' + tq(Q(t, 100)))}배가 다시 만들어진다. 다시 만든 양은 첫째항 ${tq(Q(t, 100))}, 공비 ${tq(Q(t, 100))}인 등비급수의 합 ${nb(frac(tq(Q(t, 100)), '1 ' + MINUS + ' ' + tq(Q(t, 100))) + ' = ' + tq(Q(t, 100 - t)))}이므로 ${ans} %이다.`,
        facts: { value: `(${a}*${b}/10000)/(1-${a}*${b}/10000)*100`, derived: [100, 10000] }
      });
    })
  ]);

  // ── 등비급수의 활용 — 되풀이되는 도형과 점 ──
  B.addTypes(UNIT, 'fig', [
    T('fig-circpoly', '원과 내접 정다각형이 번갈아 그려질 때 원의 넓이의 합', '②21', (d, n) => {
      if (n === 0) {
        const r = d.pick([1, 2, 4, 5, 7]);
        return piAns(`그림과 같이 반지름의 길이가 ${r}인 원 ${ms('C_1')}에 내접하는 정삼각형을 그리고, 이 정삼각형에 내접하는 원 ${ms('C_2')}를 그린다. 다시 원 ${ms('C_2')}에 내접하는 정삼각형과 그 정삼각형에 내접하는 원 ${ms('C_3')}을 그리는 일을 한없이 되풀이할 때, 원 ${ms('C_1')}, ${ms('C_2')}, ${ms('C_3')}, …의 넓이의 합은 ${V('k')}π이다. 상수 ${V('k')}의 값은?`, 4 * r * r, 3, {
          signed: false, figure: circPoly(3),
          explain: `정삼각형에 내접하는 원의 반지름은 외접원의 반지름의 ${frac(1, 2)}이다(${nb(ms('r_{n+1}') + ' = ' + ms('r_n') + ' sin 30°')}). 넓이는 ${frac(1, 4)}배씩 줄어드므로 합은 ${nb(frac((r === 1 ? '' : r * r) + 'π', '1 ' + MINUS + ' ' + frac(1, 4)) + ' = ' + frac(4 * r * r, 3) + 'π')}이다.`,
          facts: { value: `${r}*${r}/(1-1/4)`, derived: [4] }
        });
      }
      const r = d.pick([2, 3, 4, 5, 6, 7]);
      return piAns(`그림과 같이 반지름의 길이가 ${r}인 원 ${ms('C_1')}에 내접하는 정사각형을 그리고, 이 정사각형에 내접하는 원 ${ms('C_2')}를 그린다. 다시 원 ${ms('C_2')}에 내접하는 정사각형과 그 정사각형에 내접하는 원 ${ms('C_3')}을 그리는 일을 한없이 되풀이할 때, 원 ${ms('C_1')}, ${ms('C_2')}, ${ms('C_3')}, …의 넓이의 합은 ${V('k')}π이다. 상수 ${V('k')}의 값은?`, 2 * r * r, 1, {
        signed: false, figure: circPoly(4),
        explain: `정사각형에 내접하는 원의 반지름은 외접원의 반지름의 ${frac(1, rt(2))}배이다(${nb(ms('r_{n+1}') + ' = ' + ms('r_n') + ' sin 45°')}). 넓이는 ${frac(1, 2)}배씩 줄어드므로 합은 ${nb(frac(r * r + 'π', '1 ' + MINUS + ' ' + frac(1, 2)) + ' = ' + 2 * r * r + 'π')}이다.`,
        facts: { value: `${r}*${r}/(1-1/2)` }
      });
    }, { count: 2 }),
    T('fig-mid', '정사각형의 중점을 이어 되풀이할 때 넓이의 합', '②22', (d) => {
      const s = d.int(2, 9);
      return pos(`그림과 같이 한 변의 길이가 ${s} cm인 정사각형을 ${ms('A_1')}이라 하고, ${ms('A_1')}의 각 변의 중점을 차례로 이어 만든 정사각형을 ${ms('A_2')}, ${ms('A_2')}의 각 변의 중점을 차례로 이어 만든 정사각형을 ${ms('A_3')}이라 하자. 이와 같은 과정을 한없이 되풀이할 때, 정사각형 ${ms('A_1')}, ${ms('A_2')}, ${ms('A_3')}, …의 넓이의 합은?`, Q(2 * s * s), {
        figure: midSquares(s), unit: 'cm²',
        explain: `각 변의 중점을 이으면 넓이가 ${frac(1, 2)}배가 된다. 넓이는 첫째항 ${s * s}, 공비 ${frac(1, 2)}인 등비수열이므로 합은 ${nb(frac(s * s, '1 ' + MINUS + ' ' + frac(1, 2)) + ' = ' + 2 * s * s)}(cm²)이다.`,
        facts: { value: `${s}*${s}/(1-1/2)` }
      });
    }),
    T('fig-trisq', '직각이등변삼각형 안에 차례로 넣은 정사각형의 넓이의 합', '②24', (d) => {
      const L = d.pick([2, 3, 4, 5, 6, 8, 9]);
      const v = Q(L * L, 3);
      return pos(`그림과 같이 ${nb('AC = BC = ' + L)}인 직각이등변삼각형 ABC에서 꼭짓점 C를 한 꼭짓점으로 하고 한 꼭짓점이 빗변 AB 위에 있는 정사각형을 ${ms('R_1')}이라 하자. 변 BC 위에 ${ms('R_1')}에 이어 붙여 한 꼭짓점이 빗변 AB 위에 있는 정사각형을 ${ms('R_2')}라 하고, 이와 같은 과정을 한없이 되풀이할 때, 정사각형 ${ms('R_1')}, ${ms('R_2')}, ${ms('R_3')}, …의 넓이의 합은?`, v, {
        figure: triSquares(L),
        explain: `${ms('R_1')}의 빗변 위 꼭짓점에서 직각이등변삼각형이 생기므로 ${ms('R_1')}의 한 변의 길이는 ${tq(Q(L, 2))}이고, 다음 정사각형의 한 변은 앞의 ${frac(1, 2)}이다. 넓이는 첫째항 ${tq(Q(L * L, 4))}, 공비 ${frac(1, 4)}인 등비수열이므로 합은 ${nb(frac(tq(Q(L * L, 4)), '1 ' + MINUS + ' ' + frac(1, 4)) + ' = ' + tq(v))}이다.`,
        facts: { value: `(${L}/2)**2/(1-1/4)`, derived: [4] }
      });
    }),
    T('fig-exp', '지수함수 그래프 위의 점을 높이로 한 정삼각형의 넓이의 합', '②26', (d) => {
      const b = d.pick([2, 3, 4]);
      const right = surdQ(0, 1, 3, 3 * (b * b - 1));
      const cands = [right, surdQ(0, 1, 3, b * b - 1), surdQ(1, 0, 3, 3 * (b * b - 1)), surdQ(0, 1, 3, 3 * b * b), surdQ(0, 1, 3, 3 * (b - 1)), surdQ(0, 2, 3, 3 * (b * b - 1))];
      const rows = [], seen = [];
      for (const c of cands) { if (seen.some((x) => close(x, c.v))) continue; seen.push(c.v); rows.push([surdH(c), close(c.v, right.v)]); }
      const f = (x) => Math.pow(1 / b, x), tri = [];
      for (const k of [1, 2, 3]) { const h = f(k), w = h / Math.sqrt(3); tri.push({ p: [k - w, 0], q: [k, h] }, { p: [k, h], q: [k + w, 0] }, { p: [k, 0], q: [k, h], dash: true }); }
      const fig = plot({
        x: [-0.3, 3.8], y: [-0.1, 1.15], u: 56, ys: 2.8, xt: [1, 2, 3], yt: [1],
        curves: [{ f, from: -0.3, to: 3.8, name: 'y=(1/' + b + ')^x', at: 0.45, side: 'ur' }], segs: tri,
        dots: [{ x: 1, y: f(1), name: 'A_1', side: 'ur' }, { x: 2, y: f(2), name: 'A_2', side: 'ur' }],
        say: `x = 1, 2, 3인 곳에서 곡선 위의 점 A_n과 x축 위의 점 H_n을 이은 선분을 높이로 하는 정삼각형이 그려져 있다.`
      });
      return choose(d, `그림과 같이 직선 ${nb(VX + ' = ' + VN)}(${VN}은 자연수)이 곡선 ${nb(jh(V('y') + ' = ' + par(frac(1, b)) + sup(VX), '과/와'))} 만나는 점을 ${ms('A_n')}, ${VX}축과 만나는 점을 ${ms('H_n')}이라 하자. 선분 ${ms('A_nH_n')}을 높이로 하는 정삼각형의 넓이를 ${SN}이라 할 때, 급수 ${SI(SN)}의 합은?`, rows.slice(0, 5), {
        figure: fig,
        explain: `높이가 ${nb(ms('A_nH_n') + ' = ' + par(frac(1, b)) + sup(VN))}인 정삼각형의 한 변은 ${frac(2, rt(3))} × (높이)이므로 넓이는 ${nb(frac(1, rt(3)) + ' × ' + par(frac(1, b * b)) + sup(VN))}이다. 첫째항 ${frac(1, b * b + rt(3))}, 공비 ${frac(1, b * b)}인 등비급수이므로 합은 ${nb(frac(1, (b * b - 1) + rt(3)) + ' = ' + surdH(right))}이다.`
      });
    }),
    T('fig-zigzag', '기울기가 일정하게 바뀌는 꺾은선의 끝점의 극한', '②32', (d) => {
      const [s1, k] = d.pick([[Q(5, 8), Q(8, 5)], [Q(1, 2), Q(3, 2)], [Q(2, 3), Q(2)], [Q(3, 4), Q(4, 3)], [Q(1, 3), Q(3, 2)], [Q(2, 5), Q(5, 2)], [Q(1, 2), Q(2)]]);
      const run1 = qdiv(Q(1), s1), rr = qdiv(Q(1), k), v = qdiv(run1, qsub(Q(1), rr));
      const xs = [0];
      for (let i = 0; i < 3; i += 1) xs.push(xs[i] + fl(run1) * Math.pow(fl(rr), i));
      const xmax = Math.max(fl(v) + 0.5, 3.2);
      const fig = plot({
        x: [-0.2, xmax], y: [-0.2, 3.6], ys: Math.min(1.6, 230 / (3.8 * (224 / (xmax + 0.2)))), yt: [1, 2, 3],
        lines: [{ y: 1, dash: true }, { y: 2, dash: true }, { y: 3, dash: true }],
        segs: [0, 1, 2].map((i) => ({ p: [xs[i], i], q: [xs[i + 1], i + 1] })),
        dots: [1, 2, 3].map((i) => ({ x: xs[i], y: i, name: 'A_' + i, side: 'ul', said: `직선 y = ${i} 위의 점 A_${i}` })),
        say: '원점 O에서 출발한 꺾은선이 직선 y = 1, y = 2, y = 3 위의 점 A_1, A_2, A_3을 차례로 지난다.'
      });
      return val(`그림과 같이 자연수 ${VN}에 대하여 점 ${ms('A_n')}은 직선 ${nb(V('y') + ' = ' + VN)} 위에 있다. 직선 ${ms('A_0A_1')}의 기울기는 ${tq(s1)}이고, 직선 ${ms('A_nA_{n+1}')}의 기울기는 직선 ${ms('A_{n-1}A_n')}의 기울기의 ${tq(k)}배이다. 점 ${ms('A_n')}의 ${VX}좌표를 ${ms('x_n')}이라 할 때, ${LIM(ms('x_n'))}의 값은? (단, 점 ${ms('A_0')}은 원점 O이다.)`, v, {
        figure: fig,
        explain: `한 층(세로 1)을 오를 때 가로로 움직인 거리는 1 ÷ (기울기)이다. 첫 가로 거리는 ${tq(run1)}이고, 기울기가 ${tq(k)}배가 되므로 가로 거리는 ${tq(rr)}배씩 줄어든다. 따라서 ${nb(LIM(ms('x_n')) + ' = ' + frac(tq(run1), '1 ' + MINUS + ' ' + tq(rr)) + ' = ' + tq(v))}이다.`,
        facts: { value: `(1/${jq(s1)})/(1-1/${jq(k)})` }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
