// 고등학교 1학년 1학기(공통수학1) 4단원 이차방정식과 이차함수 — 뒤쪽 묶음(제한된 범위에서의 최대·최소, 최대·최소의 활용).
// 틀·도구·싣는 기준·뺀 것은 10-1-4a.js 머리에 있다. ref: ②n = 기본꼴_2의 n번.
//  - 최대·최소는 교육과정(「제한된 범위에서만 다룬다」)대로 늘 x의 값의 범위를 준다. 실생활 문항도 범위(시간, 수평거리, 변수의 범위)를 글에 적는다.
//  - 최댓값과 최솟값은 두 칸(「최댓값: [±][ ]」「최솟값: [±][ ]」)으로 받는다. 높이·넓이·길이·가격처럼 음수일 수 없는 양은 단위를 붙이고 부호 단추 없이 받는다.
//  - 원문이 「최댓값과 최솟값의 합」「Mm」「M + k」「a + b」로 묻는 꼴은 값을 칸마다 따로 묻는다.
//  - 그림: 울타리·테이프 구역·수납함·삼각형 안의 직사각형은 중학교 도형 판(B.kit.mgeo 의 Board)으로, 포물선 위의 직사각형·삼각형은 공용 plane 으로 그린다.
//    그림은 상황의 모양만 보이고(답이 되는 크기로 그리지 않는다) 그림 설명에 읽어야 할 수를 적는다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, tagged, N, M, C, inline } = B.kit;
  const { MINUS, GT, LT, GE, LE, Q, qsub, qmul, isInt, fl, tx, tail, sup, nz, pm, asQ, poly, plane, radAns, radText } = B.kit.mid;
  const { Board, CLEAR } = B.kit.mgeo;
  const { S6, T, X, Y, K, Av, Bv, Mv, Pv, Tv, Fv, X2, XA, YA, iq, jn, sgn, par, is, pt, coefT, more, quadR, fy, linR, eq0, jw, nj, vals, maxMin, sT, nb, coord } = B.kit.m1014;

  // ── 글 ──
  const range = (lo, hi, v) => nb(`${typeof lo === 'string' ? lo : iq(lo)} ${LE} ${v || X} ${LE} ${typeof hi === 'string' ? hi : iq(hi)}`);
  // y = a(x − p)² + q 의 오른쪽(p = 0 이면 ax² + q)
  const stdR = (a, p, q, v) => `${coefT(a)}${p === 0 ? (v || X) + sup(2) : `(${v || X} ${sgn(-p)})${sup(2)}`}${q ? ' ' + sgn(q) : ''}`;
  const val = (a, p, q, x) => a * (x - p) * (x - p) + q;
  const valE = (a, p, q, x) => `(${jn(a)})*((${jn(x)})-(${jn(p)}))*((${jn(x)})-(${jn(p)}))+(${jn(q)})`;
  // 꼭짓점과 양 끝에서의 값을 차례로 적은 글
  const atList = (pairs, v, w) => pairs.map(([x, y]) => `${is(v || X, x)}일 때 ${is(w || Y, y)}`).join(', ');
  // 제한된 범위 [lo, hi] 에서 a(x − p)² + q 의 최댓값·최솟값과 그 자리
  function extremes(a, p, q, lo, hi) {
    const pts = [[lo, val(a, p, q, lo)], [hi, val(a, p, q, hi)]].concat(p > lo && p < hi ? [[p, q]] : []);
    const big = pts.reduce((s, t) => (t[1] > s[1] ? t : s)), small = pts.reduce((s, t) => (t[1] < s[1] ? t : s));
    return { pts: pts.sort((s, t) => s[0] - t[0]), max: big, min: small, inside: p >= lo && p <= hi };
  }
  const where = (p, lo, hi) => (p >= lo && p <= hi ? `꼭짓점의 ${X}좌표 ${jw(iq(p), '은/는')} 범위 안에 있으므로 꼭짓점과 양 끝에서의 값을 비교한다.` : `꼭짓점의 ${X}좌표 ${jw(iq(p), '은/는')} 범위 밖에 있으므로 양 끝에서의 값만 비교한다.`);

  // ── 그림(도형 판) ──
  const HATCH = 'stroke:#5b6770;stroke-width:1';
  // 벽에 붙인 울타리: 벽에 수직인 철망이 parts 개(ㄷ자이면 2)
  function fenceFig(parts) {
    const b = Board(), W = 210, Hh = 82, x0 = 22, x1 = x0 + W - 44;
    b.seg([0, 0], [W, 0], null, 'stroke:#5b6770;stroke-width:3');
    for (let x = 6; x < W; x += 12) b.seg([x, 0], [x - 7, -8], null, HATCH);
    b.text([W / 2, -17], '벽', { plain: true });
    b.poly([[x0, 0], [x1, 0], [x1, Hh], [x0, Hh]], 'fill:rgba(134,239,172,0.28);stroke:none');
    for (let i = 0; i < parts; i += 1) { const x = x0 + (x1 - x0) * i / (parts - 1); b.seg([x, 0], [x, Hh], null, 'stroke:#1d4ed8;stroke-width:2.2'); }
    b.seg([x0, Hh], [x1, Hh], null, 'stroke:#1d4ed8;stroke-width:2.2');
    return b.svg(`벽에 붙여 직사각형 모양으로 친 철망 울타리. 벽 쪽 변에는 철망이 없고, 벽에 수직인 철망이 ${parts}개${parts > 2 ? '(양 끝 둘과 칸막이 ' + (parts - 2) + '개)' : ''}, 벽과 마주 보는 철망이 1개이다.`);
  }
  // 테이프로 표시한 구역: 큰 직사각형을 가로선 하나로 나눈 크기가 같은 두 직사각형
  function tapeFig() {
    const b = Board(), w = 120, h = 150;
    b.poly([[0, 0], [w, 0], [w, h], [0, h]], 'fill:rgba(234,179,8,0.16);stroke:#15803d;stroke-width:2.4');
    b.seg([0, h / 2], [w, h / 2], null, 'stroke:#15803d;stroke-width:2.4');
    return b.svg('테이프로 표시한 구역: 큰 직사각형 안에 가로로 테이프를 하나 더 붙여 위아래로 크기가 같은 직사각형 두 개를 만들었다.');
  }
  // 앞면과 뒷면이 뚫린 수납함(가로 판 boards 개, 양옆 판 2개), 판의 폭 depth cm
  function shelfFig(boards, depth) {
    const b = Board(), w = 96, h = 150, dx = 34, dy = 22, F = (x, y) => [x, y], Bk = (x, y) => [x + dx, y - dy];
    for (let i = 0; i < boards; i += 1) {
      const y = h * i / (boards - 1);
      b.poly([F(0, y), F(w, y), Bk(w, y), Bk(0, y)], i === 0 ? 'fill:rgba(180,140,90,0.25);stroke:#7c5a2a;stroke-width:1.4' : 'fill:rgba(180,140,90,0.12);stroke:#7c5a2a;stroke-width:1.4');
    }
    b.poly([F(w, 0), Bk(w, 0), Bk(w, h), F(w, h)], 'fill:rgba(180,140,90,0.2);stroke:#7c5a2a;stroke-width:1.4');
    b.seg(F(0, 0), F(0, h), null, 'stroke:#7c5a2a;stroke-width:1.6');
    b.seg(Bk(0, 0), Bk(0, h), 'thin');
    b.text([w + dx + 26, -dy + 1], depth + ' cm', { blue: true });
    return b.svg(`앞면과 뒷면이 뚫린 직육면체 모양의 수납함: 가로로 놓인 판이 ${boards}개(위판, 아래판, 선반 ${boards - 2}개)이고 세로로 놓인 판이 양옆에 2개이다. 판의 폭은 ${depth} cm이다.`);
  }
  // 직각삼각형(직각을 낀 두 변 base, height)과 직각인 꼭짓점을 낀 직사각형
  function rightTriFig(base, height, unit) {
    const b = Board(), W = 220, Hh = Math.max(60, Math.min(130, W * height / base)), A = [0, Hh], R = [W, Hh], Tp = [W, 0], rx = W * 0.42, ry = Hh * 0.42;
    b.poly([A, R, Tp], 'fill:rgba(251,146,60,0.18);stroke:#1f2933;stroke-width:1.6');
    b.poly([[W - rx, Hh], [W, Hh], [W, Hh - ry], [W - rx, Hh - ry]], 'fill:rgba(37,99,235,0.18);stroke:#1d4ed8;stroke-width:1.4;stroke-dasharray:4 3');
    b.angle(R, 90, 180, '');
    b.dim(A, R, `${base} ${unit}`, [W / 2, 0], 12);
    b.dim(R, Tp, `${height} ${unit}`, [0, Hh / 2], 12);
    return b.svg(`직각삼각형: 직각을 낀 두 변의 길이가 ${base} ${unit}, ${height} ${unit}이다. 직각인 꼭짓점을 한 꼭짓점으로 하고 두 변이 직각을 낀 두 변 위에 놓인 직사각형을 점선으로 그렸다.`);
  }
  // 이등변삼각형 ABC(밑변 BC)에 내접하는 직사각형 DEFG(변 EF 가 밑변 위)
  function isoFig(base, height) {
    const b = Board(), W = 220, Hh = Math.max(80, Math.min(150, W * height / base)), Bp = [0, Hh], Cp = [W, Hh], Ap = [W / 2, 0], t = 0.45;
    const D = [W / 2 * t, Hh - Hh * t], G = [W - W / 2 * t, Hh - Hh * t], E = [D[0], Hh], Fp = [G[0], Hh];
    b.poly([Ap, Bp, Cp], 'fill:rgba(251,146,60,0.14);stroke:#1f2933;stroke-width:1.6');
    b.poly([D, E, Fp, G], 'fill:rgba(37,99,235,0.18);stroke:#1d4ed8;stroke-width:1.4');
    b.seg(Ap, [W / 2, Hh], 'cut');
    b.name(Ap, 'A', 90); b.name(Bp, 'B', 210); b.name(Cp, 'C', 330); b.name(D, 'D', 150); b.name(G, 'G', 30); b.name(E, 'E', 260); b.name(Fp, 'F', 280);
    b.dim(Bp, Cp, String(base), [W / 2, 0], 30);
    b.text([W / 2 + 12, Hh * 0.3], String(height), { blue: true });
    return b.svg(`이등변삼각형 ABC: 밑변 BC의 길이는 ${base}, 꼭짓점 A에서 밑변에 내린 높이(점선)는 ${height}이다. 직사각형 DEFG는 꼭짓점 D, G가 변 AB, AC 위에, 변 EF가 밑변 BC 위에 있다.`);
  }

  B.addGroup('10-1-4', {
    id: 'maxmin', title: '제한된 범위에서 이차함수의 최대, 최소', standard: S6,
    types: [
      T('mm-std', 'y = a(x − p)² + q 꼴의 제한된 범위에서의 최댓값과 최솟값', '②2', (d, n) => {
        const a = d.pick([1, 2, 3, -1, -2, -3]), p = d.int(-3, 3), q = d.int(-6, 6);
        let lo, hi;
        if (n === 0) { lo = p - d.int(1, 3); hi = p + d.int(1, 3); } else if (d.bool()) { lo = p + d.int(1, 2); hi = lo + d.int(1, 3); } else { hi = p - d.int(1, 2); lo = hi - d.int(1, 3); }
        const e = extremes(a, p, q, lo, hi);
        if (Math.abs(e.max[1]) > 60 || Math.abs(e.min[1]) > 60 || e.max[1] === e.min[1]) return null;
        return maxMin(`${range(lo, hi)}에서 이차함수 ${nb(`${Y} = ${stdR(a, p, q)}`)}의 최댓값과 최솟값을 구하시오.`, e.max[1], e.min[1], {
          explain: `${where(p, lo, hi)} ${atList(e.pts)}이므로 최댓값은 ${iq(e.max[1])}, 최솟값은 ${iq(e.min[1])}이다.`,
          facts: { calc: [[valE(a, p, q, e.max[0]), 0], [valE(a, p, q, e.min[0]), 1]], unseen: [], rule: n === 0 ? 'std-in' : 'std-out' }
        });
      }, { count: 2 }),
      T('mm-gen', 'y = ax² + bx + c 꼴의 제한된 범위에서의 최댓값과 최솟값', '②3', (d, n) => {
        const a = d.pick([1, 1, 2, -1, -1, -2]), p = nz(d, -3, 3), q = d.int(-6, 6), b = -2 * a * p, c = a * p * p + q;
        const g = fy(a, b, c), hint = `${nb(`${Y} = ${quadR(a, b, c)} = ${stdR(a, p, q)}`)}이므로 꼭짓점의 좌표는 ${pt(p, q)}이다. `;
        if (Math.abs(c) > 20) return null;
        if (n < 2) {
          let lo, hi;
          if (n === 0) { lo = p - d.int(1, 3); hi = p + d.int(1, 3); } else if (d.bool()) { lo = p + d.int(1, 2); hi = lo + d.int(1, 3); } else { hi = p - d.int(1, 2); lo = hi - d.int(1, 3); }
          const e = extremes(a, p, q, lo, hi);
          if (Math.abs(e.max[1]) > 60 || Math.abs(e.min[1]) > 60 || e.max[1] === e.min[1]) return null;
          return maxMin(`${range(lo, hi)}일 때, 이차함수 ${g}의 최댓값과 최솟값을 구하시오.`, e.max[1], e.min[1], {
            explain: hint + `${where(p, lo, hi)} ${atList(e.pts)}이므로 최댓값은 ${iq(e.max[1])}, 최솟값은 ${iq(e.min[1])}이다.`,
            facts: { calc: [[`(${jn(a)})*(${jn(e.max[0])})*(${jn(e.max[0])})+(${jn(b)})*(${jn(e.max[0])})+(${jn(c)})`, 0], [`(${jn(a)})*(${jn(e.min[0])})*(${jn(e.min[0])})+(${jn(b)})*(${jn(e.min[0])})+(${jn(c)})`, 1]], derived: [Math.abs(p)], rule: n === 0 ? 'gen-in' : 'gen-out' }
          });
        }
        // 같은 함수, 범위 둘(⑴ 꼭짓점이 범위 안 ⑵ 범위 밖)
        const lo1 = p - d.int(1, 3), hi1 = p + d.int(1, 3), right = d.bool(), lo2 = right ? p + d.int(1, 2) : p - d.int(3, 5), hi2 = lo2 + d.int(1, 3);
        if (!right && hi2 >= p) return null;
        const e1 = extremes(a, p, q, lo1, hi1), e2 = extremes(a, p, q, lo2, hi2);
        if ([e1.max[1], e1.min[1], e2.max[1], e2.min[1]].some((v) => Math.abs(v) > 60) || e1.max[1] === e1.min[1]) return null;
        const at = (x) => `(${jn(a)})*(${jn(x)})*(${jn(x)})+(${jn(b)})*(${jn(x)})+(${jn(c)})`;
        return M(`이차함수 ${g}에 대하여 ${X}의 값의 범위가 다음과 같을 때, 최댓값과 최솟값을 각각 구하시오.`, [
          { lead: '⑴ 최댓값:', answer: e1.max[1], signed: true }, { lead: '최솟값:', answer: e1.min[1], signed: true },
          { lead: '⑵ 최댓값:', answer: e2.max[1], signed: true }, { lead: '최솟값:', answer: e2.min[1], signed: true }], {
          figure: lines([`⑴ ${range(lo1, hi1)}`, `⑵ ${range(lo2, hi2)}`]),
          shown: `⑴ 최댓값 ${iq(e1.max[1])}, 최솟값 ${iq(e1.min[1])} ⑵ 최댓값 ${iq(e2.max[1])}, 최솟값 ${iq(e2.min[1])}`,
          explain: hint + `⑴ ${where(p, lo1, hi1)} ${atList(e1.pts)}이다. ⑵ ${where(p, lo2, hi2)} ${atList(e2.pts)}이다.`,
          facts: { calc: [[at(e1.max[0]), 0], [at(e1.min[0]), 1], [at(e2.max[0]), 2], [at(e2.min[0]), 3]], derived: [Math.abs(p)] }
        });
      }, { count: 3 }),
      T('mm-steps', '최댓값과 최솟값을 구하는 과정의 빈칸', '②4', (d) => {
        const p = nz(d, -4, 4), q = nz(d, -6, 6), lo = p - d.int(1, 3), hi = p + d.int(1, 3), b = -2 * p, c = p * p + q;
        if (hi - p === p - lo || Math.abs(c) > 20) return null;
        const e = extremes(1, p, q, lo, hi);
        const tpl = `${Y} = ${quadR(1, b, c)}<br>${'&nbsp;'.repeat(3)}= (${X} {0})${sup(2)} {1}<br>${is(X, lo)}일 때 ${Y} = {2}, ${is(X, p)}일 때 ${Y} = {3}, ${is(X, hi)}일 때 ${Y} = {4}<br>최댓값: {5}, 최솟값: {6}`;
        return inline(`다음은 ${range(lo, hi)}일 때 이차함수 ${fy(1, b, c)}의 최댓값과 최솟값을 구하는 과정이다. 빈칸에 알맞은 수를 써넣으시오.`, tpl, [
          { answer: -p, signed: true }, { answer: q, signed: true }, { answer: val(1, p, q, lo), signed: true }, { answer: q, signed: true }, { answer: val(1, p, q, hi), signed: true },
          { answer: e.max[1], signed: true }, { answer: e.min[1], signed: true }], {
          shown: `${nb(`${Y} = ${stdR(1, p, q)}`)}, ${atList(e.pts)}, 최댓값 ${iq(e.max[1])}, 최솟값 ${iq(e.min[1])}`,
          explain: `${nb(`${Y} = ${stdR(1, p, q)}`)}이고 꼭짓점의 ${X}좌표 ${jw(iq(p), '은/는')} 범위 안에 있다. ${atList(e.pts)}이므로 최댓값은 ${iq(e.max[1])}, 최솟값은 ${iq(e.min[1])}이다.`,
          facts: { calc: [[`(${jn(b)})/2`, 0], [`(${jn(c)})-(${jn(b)})*(${jn(b)})/4`, 1], [valE(1, p, q, lo), 2], [valE(1, p, q, p), 3], [valE(1, p, q, hi), 4], [valE(1, p, q, e.max[0]), 5], [valE(1, p, q, e.min[0]), 6]], derived: [2, 4, Math.abs(p), Math.abs(q)] }
        });
      }),
      T('mm-given-extreme', '최댓값이나 최솟값이 주어질 때 상수와 다른 값 구하기', '②5', (d, n) => {
        // y = ax² − 2apx + k = a(x − p)² + k − ap², p 는 범위 [lo, hi] 안
        const a = d.pick([1, 1, 2, -1, -1, -2]), p = nz(d, -3, 3), lo = p - d.int(1, 3), hi = p + d.int(1, 3);
        if (hi - p === p - lo) return null;
        const far = hi - p > p - lo ? hi : lo, vName = a > 0 ? '최솟값' : '최댓값', eName = a > 0 ? '최댓값' : '최솟값';
        const g = (kText) => nb(`${Y} = ${quadR(a, -2 * a * p, 0)} + ${kText}`);
        if (n === 0) {
          // 꼭짓점 쪽 값이 주어진다 → k 와 다른 쪽 값
          const vv = nz(d, -8, 8), k = vv + a * p * p, other = vv + a * (far - p) * (far - p), kP = (v) => (v ? `${K} ${sgn(v)}` : K);
          if (Math.abs(k) > 30 || Math.abs(other) > 60 || k === 0) return null;
          return vals(`${range(lo, hi)}일 때, 이차함수 ${g(K)}의 ${vName}은 ${iq(vv)}이고 ${eName}은 ${Mv}이다. 상수 ${K}, ${Mv}의 값은?`, [[K, k], [Mv, other]], {
            explain: `${nb(`${Y} = ${stdR(a, p, 0)} + ${K} ${sgn(-a * p * p)}`)}이고 꼭짓점의 ${X}좌표 ${jw(iq(p), '은/는')} 범위 안에 있다. ${a > 0 ? '아래로' : '위로'} 볼록하므로 ${is(X, p)}일 때 ${vName} ${jw(nb(`${K} ${sgn(-a * p * p)}`), '을/를')} 갖는다. `
              + `${nb(`${K} ${sgn(-a * p * p)} = ${iq(vv)}`)}에서 ${is(K, k)}이다. ${eName}은 꼭짓점에서 더 먼 ${is(X, far)}일 때 ${nb(`${Y} = ${iq(other)}`)}이므로 ${is(Mv, other)}이다.`,
            facts: { calc: [[`(${jn(vv)})+(${jn(a)})*(${jn(p)})*(${jn(p)})`, 0], [`(${jn(vv)})+(${jn(a)})*((${jn(far)})-(${jn(p)}))*((${jn(far)})-(${jn(p)}))`, 1]], derived: [Math.abs(p)] }
          });
        }
        if (n === 1) {
          // 끝 쪽 값이 주어진다 → 꼭짓점 쪽 값
          const ev = nz(d, -8, 8), k = ev - a * (far - p) * (far - p) + a * p * p, vv = k - a * p * p, kP = (v) => (v ? `${K} ${sgn(v)}` : K);
          if (Math.abs(k) > 30 || k === 0) return null;
          return N(`${range(lo, hi)}일 때, 이차함수 ${g(K)}의 ${eName}이 ${iq(ev)}일 때, 이 범위에서 이 함수의 ${vName}은? (단, ${jw(K, '은/는')} 상수이다.)`, vv, {
            signed: true,
            explain: `${nb(`${Y} = ${stdR(a, p, 0)} + ${K} ${sgn(-a * p * p)}`)}이고 꼭짓점의 ${X}좌표 ${jw(iq(p), '은/는')} 범위 안에 있다. ${eName}은 꼭짓점에서 더 먼 ${is(X, far)}일 때의 값 ${nb(kP(a * (far - p) * (far - p) - a * p * p))}이므로 `
              + `${nb(`${kP(a * (far - p) * (far - p) - a * p * p)} = ${iq(ev)}`)}, ${is(K, k)}이다. ${vName}은 ${is(X, p)}일 때 ${nb(`${iq(k)} ${sgn(-a * p * p)} = ${iq(vv)}`)}이다.`,
            facts: { value: `(${jn(ev)})-(${jn(a)})*((${jn(far)})-(${jn(p)}))*((${jn(far)})-(${jn(p)}))`, derived: [Math.abs(p)] }
          });
        }
        // 최댓값과 최솟값의 합이 주어진다 → k
        const k = nz(d, -9, 9), vv = k - a * p * p, ev = vv + a * (far - p) * (far - p), s = vv + ev, kP = (v) => (v ? `${K} ${sgn(v)}` : K);
        if (s === 0 || Math.abs(s) > 60) return null;
        return N(`${range(lo, hi)}일 때, 이차함수 ${g(K)}의 최댓값과 최솟값의 합이 ${iq(s)}이다. 상수 ${K}의 값은?`, k, {
          signed: true,
          explain: `${nb(`${Y} = ${stdR(a, p, 0)} + ${K} ${sgn(-a * p * p)}`)}이고 꼭짓점의 ${X}좌표 ${jw(iq(p), '은/는')} 범위 안에 있다. ${vName}은 ${is(X, p)}일 때 ${nb(`${K} ${sgn(-a * p * p)}`)}, ${eName}은 ${is(X, far)}일 때 ${nb(kP(ev - k))}이다. `
            + `${nb(`2${K} ${sgn(vv - k + ev - k)} = ${iq(s)}`)}에서 ${is(K, k)}이다.`,
          facts: { value: `((${jn(s)})-(${jn(a)})*((${jn(far)})-(${jn(p)}))*((${jn(far)})-(${jn(p)}))+2*(${jn(a)})*(${jn(p)})*(${jn(p)}))/2`, derived: [2, Math.abs(p)] }
        });
      }, { count: 3 }),
      T('mm-two-coef', '최댓값과 최솟값으로 두 계수 구하기', '②6', (d, n) => {
        const a = d.pick([1, 2, 3, -1, -2, -3]), b = nz(d, -8, 8), p = nz(d, -3, 3);
        let lo, hi;
        if (n === 0) { if (d.bool()) { lo = p + d.int(1, 2); hi = lo + d.int(1, 3); } else { hi = p - d.int(1, 2); lo = hi - d.int(1, 3); } } else { lo = p - d.int(1, 3); hi = p + d.int(1, 3); if (hi - p === p - lo) return null; }
        if (n === 1 && a < 0) return null;
        const f = (x) => a * x * x - 2 * a * p * x + b, ends = [[lo, f(lo)], [hi, f(hi)]].concat(n === 1 ? [[p, f(p)]] : []);
        const big = ends.reduce((s, t) => (t[1] > s[1] ? t : s)), small = ends.reduce((s, t) => (t[1] < s[1] ? t : s));
        if (Math.abs(big[1]) > 60 || Math.abs(small[1]) > 60) return null;
        const g = `${Av}${X2} ${more(-2 * p, Av)}${X} + ${Bv}`, cond = n === 1 ? `${Av} ${GT} 0` : `${Av} ${a > 0 ? GT : LT} 0`;
        const sq = (x) => (x - p) * (x - p) - p * p;   // f(x) = a·sq(x) + b
        return vals(`${range(lo, hi)}일 때, 이차함수 ${nb(`${Y} = ${g}`)}의 최댓값은 ${iq(big[1])}이고 최솟값은 ${iq(small[1])}이다. 상수 ${Av}, ${Bv}의 값은? (단, ${nb(cond)})`, [[Av, a], [Bv, b]], {
          explain: `${nb(`${Y} = ${Av}(${X} ${sgn(-p)})${sup(2)} + ${poly([[1, Bv], [-p * p, Av]])}`)}이다. ${where(p, lo, hi)} ${a > 0 ? `${nb(`${Av} ${GT} 0`)}이므로 아래로 볼록하다.` : `${nb(`${Av} ${LT} 0`)}이므로 위로 볼록하다.`} `
            + `최댓값은 ${is(X, big[0])}일 때 ${poly([[sq(big[0]), Av], [1, Bv]])}, 최솟값은 ${is(X, small[0])}일 때 ${poly([[sq(small[0]), Av], [1, Bv]])}이다. 두 식을 연립하면 ${is(Av, a)}, ${is(Bv, b)}이다.`,
          facts: { calc: [[`((${jn(big[1])})-(${jn(small[1])}))/((${jn(sq(big[0]))})-(${jn(sq(small[0]))}))`, 0], [`(${jn(big[1])})-(${jn(sq(big[0]))})*((${jn(big[1])})-(${jn(small[1])}))/((${jn(sq(big[0]))})-(${jn(sq(small[0]))}))`, 1]], derived: [Math.abs(sq(big[0])), Math.abs(sq(small[0]))] }
        });
      }, { count: 2 }),
      T('mm-end-letter', '범위의 끝이 문자일 때 최댓값으로 끝 구하기', '②7', (d) => {
        // lo ≤ x ≤ a, 꼭짓점은 범위의 왼쪽 밖: x = a 에서 최댓값
        const lo = d.int(1, 3), p = lo - d.int(1, 3), c = d.int(-5, 5), a = lo + d.int(2, 5), mx = val(1, p, c - p * p, a);
        if (mx > 60 || p === 0) return null;
        return N(`${range(lo, Av)}일 때, 이차함수 ${fy(1, -2 * p, c)}의 최댓값이 ${iq(mx)}이다. 상수 ${Av}의 값은?`, a, {
          explain: `${nb(`${Y} = ${stdR(1, p, c - p * p)}`)}이고 꼭짓점의 ${X}좌표 ${jw(iq(p), '은/는')} 범위 밖(왼쪽)에 있으므로 ${is(X, Av)}일 때 최댓값을 갖는다. ${nb(`(${Av} ${sgn(-p)})${sup(2)}${c - p * p ? ' ' + sgn(c - p * p) : ''} = ${mx}`)}에서 `
            + `${nb(`${Av} ${sgn(-p)} = ±${a - p}`)}이고, ${nb(`${Av} ${GE} ${lo}`)}이므로 ${is(Av, a)}이다.`,
          facts: { value: `(${jn(p)})+((${jn(mx)})-(${jn(c)})+(${jn(p)})*(${jn(p)}))**0.5`, derived: [0.5, Math.abs(p)] }
        });
      }),
      T('mm-vertex-letter', '꼭짓점의 x좌표가 문자인 최대·최소', '②9', (d, n) => {
        if (n === 0) {
          // a − u ≤ x ≤ a + w, y = x² − 2ax + c, 최댓값은 꼭짓점에서 먼 끝에서
          const u = d.int(1, 4), w = d.int(1, 5), a = d.int(1, 6), c = nz(d, -6, 9);
          if (u === w) return null;
          const far = Math.max(u, w), mx = far * far + c - a * a;
          if (Math.abs(mx) > 40) return null;
          return N(`${range(nb(`${Av} ${MINUS} ${u}`), nb(`${Av} + ${w}`))}에서 이차함수 ${nb(`${Y} = ${X2} ${MINUS} 2${Av}${X} ${sgn(c)}`)}의 최댓값이 ${iq(mx)}일 때, 양수 ${Av}의 값은?`, a, {
            explain: `${nb(`${Y} = (${X} ${MINUS} ${Av})${sup(2)} ${MINUS} ${Av}${sup(2)} ${sgn(c)}`)}이므로 꼭짓점의 ${X}좌표 ${jw(Av, '은/는')} 늘 범위 안에 있다. 아래로 볼록하므로 꼭짓점에서 더 먼 ${is(X, nb(`${Av} ${far === w ? '+' : MINUS} ${far}`))}일 때 최댓값 `
              + `${jw(nb(`${far * far} ${MINUS} ${Av}${sup(2)} ${sgn(c)}`), '을/를')} 갖는다. ${nb(`${far * far} ${MINUS} ${Av}${sup(2)} ${sgn(c)} = ${iq(mx)}`)}에서 ${nb(`${Av}${sup(2)} = ${a * a}`)}이고, ${Av}는 양수이므로 ${is(Av, a)}이다.`,
            facts: { value: `(${far}*${far}+(${jn(c)})-(${jn(mx)}))**0.5`, derived: [0.5] }
          });
        }
        // −r ≤ x ≤ r, y = x² − 2ax + c (a > r): 꼭짓점이 범위의 오른쪽 밖
        const r = d.int(1, 3), a = r + d.int(1, 3), c = nz(d, -5, 5), mx = r * r + 2 * a * r + c, mn = r * r - 2 * a * r + c;
        if (mx > 60) return null;
        return N(`${range(-r, r)}일 때, 이차함수 ${nb(`${Y} = ${X2} ${MINUS} 2${Av}${X} ${sgn(c)}`)}의 최댓값이 ${iq(mx)}이다. 이 범위에서 이 함수의 최솟값은? (단, ${nb(`${Av} ${GT} ${r}`)})`, mn, {
          signed: true,
          explain: `꼭짓점의 ${X}좌표 ${jw(Av, '은/는')} ${r}보다 크므로 범위 밖(오른쪽)에 있다. 범위에서 ${X}의 값이 커지면 ${Y}의 값은 작아지므로 최댓값은 ${is(X, -r)}일 때 ${nb(`${r * r} + ${2 * r}${Av} ${sgn(c)}`)}, 최솟값은 ${is(X, r)}일 때 ${nb(`${r * r} ${MINUS} ${2 * r}${Av} ${sgn(c)}`)}이다. `
            + `${nb(`${r * r} + ${2 * r}${Av} ${sgn(c)} = ${mx}`)}에서 ${is(Av, a)}이므로 최솟값은 ${iq(mn)}이다.`,
          facts: { value: `2*(${r}*${r}+(${jn(c)}))-(${jn(mx)})`, derived: [2] }
        });
      }, { count: 2 }),
      T('mm-symmetric', '대칭인 두 함숫값과 최댓값(최솟값)으로 식을 정해 다른 값 구하기', '②10', (d) => {
        // f(x) = s(x − h)² + E, f(p1) = f(p2), 범위 [lo, hi] 안에 h
        const s = pm(d), h = d.int(-2, 3), gap = d.int(1, 4), p1 = h - gap, p2 = h + gap, E = nz(d, -8, 9), lo = h - d.int(2, 5), hi = h + d.int(2, 5);
        if (hi - h === h - lo || p1 === 0 || p2 === 0) return null;
        const far = hi - h > h - lo ? hi : lo, other = s * (far - h) * (far - h) + E;
        if (Math.abs(other) > 60) return null;
        const head = s < 0 ? `이차함수 ${nb(`${Fv}(${X}) = ${MINUS}${X2} + ${Av}${X} + ${Bv}`)}` : `이차항의 계수가 1인 이차함수 ${Fv}(${X})`;
        const vName = s < 0 ? '최댓값' : '최솟값', eName = s < 0 ? '최솟값' : '최댓값';
        return N(`${range(lo, hi)}에서 ${head}가 다음 조건을 만족시킨다. 이 범위에서 ${Fv}(${X})의 ${eName}은?`, other, {
          signed: true,
          figure: tagged([nb(`${Fv}(${iq(p1)}) = ${Fv}(${iq(p2)})`), `${range(lo, hi)}에서 ${Fv}(${X})의 ${vName}은 ${iq(E)}이다.`], ['㈎', '㈏']),
          explain: `㈎에서 그래프는 직선 ${nb(`${X} = ${frac(`${iq(p1)} + ${par(p2)}`, 2)} = ${iq(h)}`)}에 대하여 대칭이므로 꼭짓점의 ${X}좌표는 ${iq(h)}이고, 범위 안에 있다. ㈏에서 ${is(X, h)}일 때 ${vName} ${jw(iq(E), '을/를')} 가지므로 `
            + `${nb(`${Fv}(${X}) = ${stdR(s, h, E)}`)}이다. ${eName}은 꼭짓점에서 더 먼 ${is(X, far)}일 때 ${iq(other)}이다.`,
          facts: { value: `(${s})*((${jn(far)})-((${jn(p1)})+(${jn(p2)}))/2)*((${jn(far)})-((${jn(p1)})+(${jn(p2)}))/2)+(${jn(E)})`, derived: [2] }
        });
      }),
      T('mm-linear-cond', '일차 조건으로 한 문자를 없앤 두 문자의 곱의 최댓값과 최솟값', '②11', (d) => {
        const s = d.pick([1, 2, 3]), c = 2 * s * nz(d, -3, 3), h = c / (2 * s), lo = h - d.int(1, 4), hi = h + d.int(1, 4), xy = d.bool();
        if (hi - h === h - lo) return null;
        // xy: s·x − y = c → y = sx − c, xy = sx² − cx(아래로 볼록) / ab: s·a + b = c → b = c − sa, ab = −sa² + ca(위로 볼록)
        const A_ = xy ? s : -s, f = (t) => A_ * t * t + (xy ? -c : c) * t, [u, w] = xy ? [V2('x'), V2('y')] : [Av, Bv];
        const ends = [[lo, f(lo)], [hi, f(hi)], [h, f(h)]], big = ends.reduce((p_, t) => (t[1] > p_[1] ? t : p_)), small = ends.reduce((p_, t) => (t[1] < p_[1] ? t : p_));
        if (Math.abs(big[1]) > 99 || Math.abs(small[1]) > 99) return null;
        const cond = xy ? nb(`${s === 1 ? '' : s}${u} ${MINUS} ${w} = ${iq(c)}`) : nb(`${s === 1 ? '' : s}${u} + ${w} = ${iq(c)}`);
        const sub = xy ? is(w, linR(s, -c, u)) : is(w, poly([[c, ''], [-s, u]]));
        const at = (t) => (xy ? `(${s})*(${jn(t)})*(${jn(t)})-(${jn(c)})*(${jn(t)})+0` : `(${jn(c)})*(${jn(t)})-(${s})*(${jn(t)})*(${jn(t)})+0`);
        return maxMin(`두 실수 ${u}, ${w}에 대하여 ${range(lo, hi, u)}이고 ${cond}일 때, ${u}${w}의 최댓값과 최솟값을 구하시오.`, big[1], small[1], {
          explain: `${cond}에서 ${sub}이므로 ${nb(`${u}${w} = ${quadR(A_, xy ? -c : c, 0, u)} = ${stdR(A_, h, f(h), u)}`)}이다. 꼭짓점의 ${u}좌표 ${jw(iq(h), '은/는')} 범위 안에 있다. `
            + `${atList(ends.slice().sort((p_, t) => p_[0] - t[0]), u, u + w)}이므로 최댓값은 ${iq(big[1])}, 최솟값은 ${iq(small[1])}이다.`,
          facts: { calc: [[at(big[0]), 0], [at(small[0]), 1]], derived: [Math.abs(h)] }
        });
      }),
      T('mm-diagonal', '둘레가 일정한 직사각형의 대각선의 길이의 최솟값', '②15', (d) => {
        const half = d.int(2, 12) * 2, L = half * 2, k = half / 2;
        return radAns(`둘레의 길이가 ${L}인 직사각형의 대각선의 길이의 최솟값은?`, k, 2, {
          explain: `가로의 길이를 ${X}라 하면 세로의 길이는 ${nb(`${half} ${MINUS} ${X}`)}이고 ${nb(`0 ${LT} ${X} ${LT} ${half}`)}이다. 대각선의 길이의 제곱은 `
            + `${nb(`${X2} + (${half} ${MINUS} ${X})${sup(2)} = 2(${X} ${MINUS} ${k})${sup(2)} + ${half * half / 2}`)}이므로 ${is(X, k)}일 때 최솟값 ${jw(String(half * half / 2), '을/를')} 갖는다. 따라서 대각선의 길이의 최솟값은 ${nb(`${rt2(half * half / 2)} = ${radText(k, 2)}`)}이다.`,
          facts: { calc: [[`${L}/4`, 0], ['2', 1]], derived: [4, 2] }
        });
      })
    ]
  });
  const V2 = (t) => `<i class="mb-var">${t}</i>`;
  const rt2 = (n) => B.kit.mid.rt(n);

  B.addGroup('10-1-4', {
    id: 'apply', title: '이차함수의 최대, 최소의 활용', standard: S6,
    types: [
      T('app-height', '높이의 식이 주어진 물체의 가장 높을 때와 낮을 때', '②16', (d, n) => {
        if (n === 0) {
          const tv = d.int(1, 4), v = 10 * tv, h0 = d.pick([0, 0, 5, 10, 15, 20]), t1 = Math.max(0, tv - d.int(1, 3)), t2 = tv + d.int(1, 3), y = (t) => -5 * t * t + v * t + h0;
          if (t2 - tv === tv - t1 || y(t2) <= 0 || y(t1) <= 0) return null;
          const far = t2 - tv > tv - t1 ? t2 : t1, mx = y(tv), mn = y(far);
          const head = h0 ? `지면으로부터 ${h0} m의 높이에서 물 로켓을 똑바로 위로 쏘아 올렸을 때` : '어떤 물체를 지면에서 똑바로 위로 쏘아 올렸을 때';
          const eq = nb(`${Y} = ${quadR(-5, v, h0, Tv)}`);
          return M(`${head}, ${Tv}초 후 지면으로부터의 높이를 ${Y} m라 하면 ${Tv}와 ${Y} 사이에 ${eq}인 관계가 성립한다. 쏘아 올린 후 ${t1}초 이상 ${t2}초 이하에서 최대 높이와 최소 높이를 구하시오. (단, ${h0 ? '물 로켓' : '물체'}의 크기는 생각하지 않는다.)`,
            [{ lead: '최대 높이:', answer: mx, unit: 'm' }, { lead: '최소 높이:', answer: mn, unit: 'm' }], {
              shown: `최대 높이 ${mx} m, 최소 높이 ${mn} m`,
              explain: `${nb(`${Y} = ${stdR(-5, tv, mx, Tv)}`)}이므로 ${nb(`${t1} ${LE} ${Tv} ${LE} ${t2}`)}에서 꼭짓점의 ${Tv}좌표 ${jw(String(tv), '은/는')} 범위 안에 있다. ${atList([[t1, y(t1)], [tv, mx], [t2, y(t2)]], Tv)}이므로 최대 높이는 ${mx} m, 최소 높이는 ${mn} m이다.`,
              facts: { calc: [[`0-5*${tv}*${tv}+${v}*${tv}+${h0}`, 0], [`0-5*${far}*${far}+${v}*${far}+${h0}`, 1]], derived: [5, tv, far] }
            });
        }
        const [den, p] = d.pick([[100, 20], [100, 30], [50, 10], [50, 20], [20, 10], [40, 20], [80, 20]]), top = p * p / den, b = Q(2 * p, den);
        const bT = b.p === b.q ? '' : iq(b), eq = nb(`${Y} = ${MINUS}${frac(1, den)}${X2} + ${bT}${X}`);
        return N(`공을 찬 지점으로부터 공이 움직인 수평거리를 ${X} m, 지면으로부터 공까지의 높이를 ${Y} m라 하면 ${range(0, 2 * p)}에서 ${eq}인 관계가 성립한다. 공이 가장 높은 위치에 있을 때의 높이는 몇 m인가? (단, 공의 크기는 생각하지 않는다.)`, top, {
          unit: 'm',
          explain: `${nb(`${Y} = ${MINUS}${frac(1, den)}(${X} ${MINUS} ${p})${sup(2)} + ${top}`)}이고 꼭짓점의 ${X}좌표 ${jw(String(p), '은/는')} 범위 안에 있으므로 ${is(X, p)}일 때 가장 높고 그 높이는 ${top} m이다.`,
          facts: { value: `${p}*${p}/${den}`, derived: [p] }
        });
      }, { count: 2 }),
      T('app-launch', '떨어지는 시각으로 높이의 식을 정하고 최고 높이 구하기', '②17', (d) => {
        const m = d.int(1, 3), a = 10 * m, Tt = 2 * m + d.int(1, 3), c = 5 * Tt * Tt - a * Tt, mx = c + 5 * m * m;
        if (c <= 0 || c > 60) return null;
        return M(`지면으로부터 ${c} m의 높이에 설치된 발사대에서 로켓을 똑바로 위로 발사하려고 한다. 발사한 지 ${Tv}초 후 지면으로부터 로켓의 높이 ${Y} m는 ${nb(`${Y} = ${MINUS}5${Tv}${sup(2)} + ${Av}${Tv} + ${c}`)}이다. 발사한 지 ${Tt}초 후에 로켓이 지면에 떨어졌을 때, 상수 ${Av}의 값과 로켓의 높이의 최댓값을 구하시오. (단, 로켓의 크기는 생각하지 않는다.)`,
          [{ lead: `${Av} =`, answer: a, signed: true }, { lead: '최댓값:', answer: mx, unit: 'm' }], {
            shown: `${is(Av, a)}, 최댓값 ${mx} m`,
            explain: `${is(Tv, Tt)}일 때 ${is(Y, 0)}이므로 ${nb(`${MINUS}5 × ${Tt}${sup(2)} + ${Tt}${Av} + ${c} = 0`)}, ${is(Av, a)}이다. ${nb(`${Y} = ${quadR(-5, a, c, Tv)} = ${stdR(-5, m, mx, Tv)}`)}이고 ${nb(`0 ${LE} ${Tv} ${LE} ${Tt}`)}에서 꼭짓점의 ${Tv}좌표 ${jw(String(m), '은/는')} 범위 안에 있으므로 높이의 최댓값은 ${mx} m이다.`,
            facts: { calc: [[`(5*${Tt}*${Tt}-${c})/${Tt}`, 0], [`${c}+(5*${Tt}*${Tt}-${c})*(5*${Tt}*${Tt}-${c})/(${Tt}*${Tt}*20)`, 1]], derived: [20] }
          });
      }),
      T('app-fence', '벽면을 이용한 울타리의 바닥 넓이의 최댓값', '②18', (d, n) => {
        const parts = n === 0 ? 2 : d.pick([3, 4]), L = parts === 2 ? d.pick([12, 16, 20, 24, 28, 32, 36, 40]) : parts === 3 ? d.pick([12, 18, 24, 30, 36]) : d.pick([16, 24, 32, 40]);
        const x0 = L / (2 * parts), area = L * L / (4 * parts);
        const what = n === 0 ? `길이가 ${L} m인 철망을 벽면에 붙여 ‘ㄷ’ 자 모양으로 치고` : `길이가 ${L} m인 철망으로 벽면 옆에 칸막이가 ${parts - 2}개 있는`;
        return N(`그림과 같이 ${what} 직사각형 모양의 울타리를 만들려고 한다. 벽면에는 철망을 사용하지 않을 때, 울타리 바닥의 넓이의 최댓값은 몇 m²인가? (단, 철망의 두께는 생각하지 않는다.)`, area, {
          unit: 'm²', figure: fenceFig(parts),
          explain: `벽에 수직인 철망 한 개의 길이를 ${X} m라 하면 벽과 마주 보는 철망의 길이는 ${nb(`(${L} ${MINUS} ${parts}${X}) m`)}이고 ${nb(`0 ${LT} ${X} ${LT} ${frac(L, parts)}`)}이다. 바닥의 넓이는 `
            + `${nb(`${X}(${L} ${MINUS} ${parts}${X}) = ${MINUS}${parts}(${X} ${MINUS} ${x0})${sup(2)} + ${area}`)}이므로 ${is(X, x0)}일 때 최댓값 ${area} m²를 갖는다.`,
          facts: { value: `${L}*${L}/(4*${parts})`, derived: [4, parts] }
        });
      }, { count: 2 }),
      T('app-tape', '테이프로 나눈 두 직사각형 구역의 넓이의 최댓값', '②19', (d) => {
        const L = d.pick([24, 36, 48, 60]), w = L / 6, h = L / 4, area = L * L / 24;
        return N(`길이가 ${L} m인 테이프를 이용하여 그림과 같이 크기가 같은 두 직사각형으로 이루어진 구역을 표시하려고 한다. 표시할 수 있는 구역의 넓이의 최댓값은 몇 m²인가? (단, 테이프의 폭은 생각하지 않는다.)`, area, {
          unit: 'm²', figure: tapeFig(),
          explain: `구역의 가로의 길이를 ${X} m라 하면 가로로 붙인 테이프는 3개, 세로로 붙인 테이프는 2개이므로 세로의 길이는 ${nb(`${frac(`${L} ${MINUS} 3${X}`, 2)} m`)}이다. 넓이는 `
            + `${nb(`${X} × ${frac(`${L} ${MINUS} 3${X}`, 2)} = ${MINUS}${frac(3, 2)}(${X} ${MINUS} ${w})${sup(2)} + ${area}`)}이므로 ${is(X, w)}일 때(세로 ${h} m) 최댓값 ${area} m²를 갖는다.`,
          facts: { value: `${L}*${L}/24`, derived: [24] }
        });
      }),
      T('app-shelf', '판으로 만든 수납함의 부피가 최대일 때의 높이', '②20', (d) => {
        const boards = d.pick([3, 4]), depth = d.pick([20, 30, 40]), L = d.pick(boards === 3 ? [120, 144, 168, 192, 216, 240] : [128, 160, 192, 224, 240]), x0 = L / (2 * boards), h = L / 4;
        if (!Number.isInteger(x0)) return null;
        return N(`폭이 ${depth} cm로 일정하고 길이가 ${L} cm인 판을 잘라 붙여 그림과 같이 앞면과 뒷면이 뚫린 직육면체 모양의 수납함을 만들려고 한다. 수납 공간의 부피가 최대가 되도록 할 때, 수납함 전체의 높이는 몇 cm인가? (단, 판의 두께는 생각하지 않는다.)`, h, {
          unit: 'cm', figure: shelfFig(boards, depth),
          explain: `수납함의 가로의 길이를 ${X} cm, 높이를 ${Y} cm라 하면 가로로 놓인 판이 ${boards}개, 세로로 놓인 판이 2개이므로 ${nb(`${boards}${X} + 2${Y} = ${L}`)}, 곧 ${nb(`${Y} = ${frac(`${L} ${MINUS} ${boards}${X}`, 2)}`)}이다. `
            + `부피는 ${nb(`${depth}${X}${Y} = ${depth / 2}${X}(${L} ${MINUS} ${boards}${X})`)}이고 ${nb(`${X}(${L} ${MINUS} ${boards}${X})`)}는 ${is(X, x0)}일 때 가장 크므로 그때 높이는 ${nb(`${frac(`${L} ${MINUS} ${boards * x0}`, 2)} = ${h}`)} cm이다.`,
          facts: { value: `${L}/4`, derived: [4] }
        });
      }),
      T('app-rect-change', '가로를 줄이고 세로를 늘인 직사각형의 넓이의 최댓값', '②21', (d) => {
        const k = d.pick([2, 2, 3]), W = d.int(6, 24), Hh = d.int(4, 20), top = k * W - Hh;
        if (W === Hh || top <= 0 || top % (2 * k) !== 0) return null;
        const x0 = top / (2 * k), area = (W - x0) * (Hh + k * x0), unit = W > 12 ? 'cm' : 'm';
        if (x0 >= W || area > 2000) return null;
        return N(`가로의 길이가 ${W} ${unit}, 세로의 길이가 ${Hh} ${unit}인 직사각형에서 가로의 길이는 ${X} ${unit}만큼 줄이고 세로의 길이는 ${k}${X} ${unit}만큼 늘려서 새로운 직사각형을 만들려고 한다. 새로운 직사각형의 넓이의 최댓값은 몇 ${unit}²인가? (단, ${nb(`0 ${LT} ${X} ${LT} ${W}`)})`, area, {
          unit: unit + '²',
          explain: `새로운 직사각형의 넓이는 ${nb(`(${W} ${MINUS} ${X})(${Hh} + ${k}${X}) = ${quadR(-k, top, W * Hh)} = ${stdR(-k, x0, area)}`)}이므로 ${is(X, x0)}일 때 최댓값 ${area} ${unit}²를 갖는다.`,
          facts: { value: `(${W}-(${k}*${W}-${Hh})/(2*${k}))*(${Hh}+(${k}*${W}-${Hh})/2)`, derived: [2] }
        });
      }),
      T('app-inscribed', '삼각형에 내접하는 직사각형의 넓이의 최댓값', '②22', (d, n) => {
        if (n === 0) {
          const unit = d.pick(['cm', 'm']), base = 2 * d.int(5, 30), height = 2 * d.int(4, 20);
          if (base === height || base * height / 4 > 9999 || base / height > 3.2 || height / base > 1.4) return null;
          const area = base * height / 4;
          return N(`그림과 같이 직각을 낀 두 변의 길이가 각각 ${base} ${unit}, ${height} ${unit}인 직각삼각형 모양의 종이가 있다. 이 종이를 직각을 낀 두 변에 각각 평행하게 잘라서 직사각형 모양을 만들려고 한다. 만들 수 있는 직사각형의 넓이의 최댓값은 몇 ${unit}²인가?`, area, {
            unit: unit + '²', figure: rightTriFig(base, height, unit),
            explain: `직사각형의 세로(높이 쪽) 길이를 ${X} ${unit}라 하면 닮음에서 가로의 길이는 ${nb(`${iq(Q(base, height))}(${height} ${MINUS} ${X})`)}이다. 넓이는 ${nb(`${iq(Q(base, height))}${X}(${height} ${MINUS} ${X})`)}이고 `
              + `${is(X, height / 2)}일 때 최댓값 ${jw(nb(`${iq(Q(base, height))} × ${height / 2} × ${height / 2} = ${area}`), '을/를')} 갖는다.`,
            facts: { value: `${base}*${height}/4`, derived: [4] }
          });
        }
        const base = 2 * d.int(3, 10), height = 2 * d.int(2, 8), area = base * height / 4, rr = Q(height, base), rT = rr.p === rr.q ? '' : iq(rr);
        if (base === height || height / base > 1.3 || base / height > 3) return null;
        return N(`그림과 같이 밑변의 길이가 ${base}, 높이가 ${height}인 이등변삼각형 ABC에 내접하는 직사각형 DEFG의 넓이의 최댓값은? (단, 변 EF는 밑변 BC 위에 있다.)`, area, {
          figure: isoFig(base, height),
          explain: `${nb(`${SGt('DG')} = ${X}`)}, ${nb(`${SGt('DE')} = ${Y}`)}라 하면 삼각형 ADG와 삼각형 ABC는 닮음이므로 ${nb(`${base} : ${height} = ${X} : (${height} ${MINUS} ${Y})`)}, 곧 ${nb(`${Y} = ${height} ${MINUS} ${rT}${X}`)}이다. `
            + `넓이는 ${nb(`${X}${Y} = ${MINUS}${rT}(${X} ${MINUS} ${base / 2})${sup(2)} + ${area}`)}이고 ${nb(`0 ${LT} ${X} ${LT} ${base}`)}이므로 ${is(X, base / 2)}일 때 최댓값 ${jw(String(area), '을/를')} 갖는다.`,
          facts: { value: `${base}*${height}/4`, derived: [4] }
        });
      }, { count: 2 }),
      T('app-under-parabola', '포물선과 x축 사이에 놓인 직사각형의 둘레의 최댓값', '②23', (d, n) => {
        if (n === 0) {
          const c = d.int(3, 9), a0 = Math.round(Math.sqrt(c) * 0.55 * 10) / 10, y0 = Math.round((c - a0 * a0) * 100) / 100, best = 2 * c + 2;
          const fig = coord({ x: [-4, 4], y: [-1, c + 1], tall: 200, noO: true, parabolas: [{ a: -1, q: c }], poly: [[-a0, 0], [a0, 0], [a0, y0], [-a0, y0]],
            points: [{ x: -a0, y: y0, name: 'A', side: 'ul' }, { x: -a0, y: 0, name: 'B', side: 'dl' }, { x: a0, y: 0, name: 'C', side: 'dr' }, { x: a0, y: y0, name: 'D', side: 'ur' }], say: '좌표평면: 위로 볼록한 포물선과 x축 사이에 직사각형 ABCD가 있다. 두 꼭짓점 A, D는 포물선 위에, 두 꼭짓점 B, C는 x축 위에 있다.' });
          return N(`그림과 같이 직사각형 ABCD의 두 꼭짓점 A, D는 이차함수 ${nb(`${Y} = ${MINUS}${X2} + ${c}`)}의 그래프 위에 있고, 두 꼭짓점 B, C는 ${XA} 위에 있다. 직사각형 ABCD의 둘레의 길이의 최댓값은? (단, 점 D는 제1사분면 위의 점이다.)`, best, {
            figure: fig,
            explain: `점 D의 좌표를 ${pt(Pv, `${MINUS}${Pv}${sup(2)} + ${c}`)}라 하면 ${nb(`0 ${LT} ${Pv} ${LT} ${rt2(c)}`)}이고 가로의 길이는 ${nb(`2${Pv}`)}, 세로의 길이는 ${nb(`${MINUS}${Pv}${sup(2)} + ${c}`)}이다. `
              + `둘레의 길이는 ${nb(`2(2${Pv} ${MINUS} ${Pv}${sup(2)} + ${c}) = ${MINUS}2(${Pv} ${MINUS} 1)${sup(2)} + ${best}`)}이므로 ${is(Pv, 1)}일 때 최댓값 ${jw(String(best), '을/를')} 갖는다.`,
            facts: { value: `2*${c}+2`, derived: [2] }
          });
        }
        const b = d.pick([4, 6, 8]), t0 = (b - 2) / 2, best = 2 * (t0 * t0 + b), a0 = Math.round(b * 0.3 * 10) / 10, y0 = Math.round((b * a0 - a0 * a0) * 100) / 100;
        const fig = coord({ x: [-1, b + 1], y: [-1, b * b / 4 + 1], tall: 200, oUp: true, parabolas: [{ a: -1, p: b / 2, q: b * b / 4 }], poly: [[a0, 0], [b - a0, 0], [b - a0, y0], [a0, y0]],
          points: [{ x: a0, y: y0, name: 'A', side: 'ul' }, { x: a0, y: 0, name: 'B', side: 'dl' }, { x: b - a0, y: 0, name: 'C', side: 'dr' }, { x: b - a0, y: y0, name: 'D', side: 'ur' }], say: '좌표평면: 위로 볼록한 포물선과 x축 사이에 직사각형 ABCD가 있다. 두 꼭짓점 A, D는 포물선 위에, 두 꼭짓점 B, C는 x축 위에 있다.' });
        return N(`그림과 같이 직사각형 ABCD의 두 꼭짓점 A, D는 이차함수 ${nb(`${Y} = ${MINUS}${X2} + ${b}${X}`)}의 그래프 위에 있고, 두 꼭짓점 B, C는 ${XA} 위에 있다. 직사각형 ABCD의 둘레의 길이의 최댓값은? (단, 두 점 A, D는 제1사분면 위의 점이고, 점 A의 ${X}좌표는 점 D의 ${X}좌표보다 작다.)`, best, {
          figure: fig,
          explain: `점 B의 좌표를 ${pt(Tv, 0)}이라 하면 그래프는 직선 ${is(X, b / 2)}에 대하여 대칭이므로 C의 좌표는 ${pt(nb(`${b} ${MINUS} ${Tv}`), 0)}이고 ${nb(`0 ${LT} ${Tv} ${LT} ${b / 2}`)}이다. `
            + `${nb(`${SGt('AB')} = ${MINUS}${Tv}${sup(2)} + ${b}${Tv}`)}, ${nb(`${SGt('BC')} = ${b} ${MINUS} 2${Tv}`)}이므로 둘레의 길이는 ${nb(`2(${MINUS}${Tv}${sup(2)} + ${b - 2}${Tv} + ${b}) = ${MINUS}2(${Tv} ${MINUS} ${t0})${sup(2)} + ${best}`)}이고 `
            + `${is(Tv, t0)}일 때 최댓값 ${jw(String(best), '을/를')} 갖는다.`,
          facts: { value: `2*((${b}-2)*(${b}-2)/4+${b})`, derived: [2, 4] }
        });
      }, { count: 2 }),
      T('app-triangle-on-parabola', '포물선 위의 점과 만든 삼각형의 넓이의 최댓값', '②24', (d) => {
        const [a, p] = d.pick([[1, 2], [2, 2], [3, 2], [1, 4], [2, 4]]), top = a * p * p / 4, area = p * top / 2, x0 = p * 0.3, y0 = Math.round(a * x0 * (p - x0) * 100) / 100;
        const fig = plane({ x: [-1, p + 1], y: [-1, top + 1], parabolas: [{ a: -a, p: p / 2, q: top }], poly: [[0, 0], [p, 0], [x0, y0]],
          points: [{ x: p, y: 0, name: 'A', side: 'dr' }, { x: x0, y: y0, name: 'P', side: 'ul' }], ticks: 'none', grid: false });
        return N(`이차함수 ${nb(`${Y} = ${MINUS}${a === 1 ? '' : a}${X}(${X} ${MINUS} ${p})`)}의 그래프가 ${XA}과 만나는 두 점 가운데 원점 O가 아닌 점을 A라 하자. 제1사분면에서 이 그래프 위를 움직이는 점 P에 대하여 삼각형 OAP의 넓이의 최댓값은?`, area, {
          figure: fig,
          explain: `점 A의 좌표는 ${pt(p, 0)}이므로 ${nb(`${SGt('OA')} = ${p}`)}이고, 삼각형 OAP의 넓이는 점 P의 ${Y}좌표가 클수록 크다. ${nb(`${Y} = ${MINUS}${a === 1 ? '' : a}${X}(${X} ${MINUS} ${p}) = ${stdR(-a, p / 2, top)}`)}이고 ${nb(`0 ${LT} ${X} ${LT} ${p}`)}에서 `
            + `${is(X, p / 2)}일 때 ${Y}좌표가 가장 크다(${top}). 따라서 넓이의 최댓값은 ${nb(`${frac(1, 2)} × ${p} × ${top} = ${area}`)}이다.`,
          facts: { value: `${p}*${a}*${p}*${p}/8`, derived: [8] }
        });
      }),
      T('app-revenue', '가격과 판매량이 바뀔 때 판매 금액이 최대가 되는 가격', '②25', (d, n) => {
        if (n === 0) {
          const P0 = d.int(5, 20), k = d.pick([2, 3, 4, 5, 6]), x0 = d.int(2, 15), S0 = k * (2 * x0 + P0), limit = Math.floor(S0 / k) - d.int(0, 3);
          if (x0 > limit || S0 > 900) return null;
          return N(`어느 회사에서 신제품의 가격을 ${P0}만 원으로 정하면 한 달에 ${S0}대가 팔리고, 가격을 ${X}만 원 올리면 판매량은 ${k}${X}대 줄어든다고 한다. 한 달 동안의 총판매 금액이 최대가 될 때 신제품의 가격은 몇 만 원인가? (단, ${nb(`0 ${LE} ${X} ${LE} ${limit}`)})`, P0 + x0, {
            unit: '만 원',
            explain: `가격은 ${nb(`(${P0} + ${X})만 원`)}, 판매량은 ${nb(`(${S0} ${MINUS} ${k}${X})대`)}이므로 총판매 금액은 ${nb(`(${P0} + ${X})(${S0} ${MINUS} ${k}${X}) = ${stdR(-k, x0, (P0 + x0) * (S0 - k * x0))}`)}(만 원)이다. `
              + `꼭짓점의 ${X}좌표 ${jw(String(x0), '은/는')} 범위 안에 있으므로 ${is(X, x0)}일 때 최대이고, 그때 가격은 ${P0 + x0}만 원이다.`,
            facts: { value: `${P0}+(${S0}-${k}*${P0})/(2*${k})`, derived: [2] }
          });
        }
        const r = d.pick([2, 5]), x0 = r === 2 ? 25 : 40, S0 = r === 2 ? 8 * d.int(5, 15) : 5 * d.int(8, 24), P0 = 10000, price = P0 * (100 - x0) / 100, rev = P0 * S0 * (100 - x0) * (100 + r * x0) / 1e8;
        return M(`어느 바자회에서 교복 한 벌의 가격을 ${P0}원으로 정하면 ${S0}벌이 팔리고, 가격을 ${X} % 내리면 판매량은 ${r}${X} % 늘어난다고 한다. 수익금이 최대일 때 교복 한 벌의 가격과 그때의 수익금을 구하시오. (단, ${nb(`0 ${LE} ${X} ${LE} 50`)}이고 수익금은 가격과 판매량의 곱이다.)`,
          [{ lead: '가격:', answer: price, unit: '원' }, { lead: '수익금:', answer: rev, unit: '만 원' }], {
            shown: `${price}원, ${rev}만 원`,
            explain: `가격은 ${nb(`${P0}(1 ${MINUS} ${frac(X, 100)})원`)}, 판매량은 ${nb(`${S0}(1 + ${frac(r + X, 100)})벌`)}이므로 수익금은 ${nb(`${S0}(100 ${MINUS} ${X})(100 + ${r}${X})`)}원이다. `
              + `${nb(`(100 ${MINUS} ${X})(100 + ${r}${X}) = ${stdR(-r, x0, (100 - x0) * (100 + r * x0))}`)}이므로 ${is(X, x0)}일 때 최대이다. 가격은 ${price}원, 수익금은 ${nb(`${price} × ${S0 * (100 + r * x0) / 100}`)}원, 곧 ${rev}만 원이다.`,
            facts: { calc: [[`${P0}*(100-${x0})/100`, 0], [`${P0}*${S0}*(100-${x0})*(100+${r}*${x0})/100000000`, 1]], derived: [100, x0, 100000000] }
          });
      }, { count: 2 }),
      T('app-profit', '원가가 있을 때 이익이 최대가 되는 가격', '②26', (d) => {
        const p0 = 1000 * d.int(2, 9), margin = 100 * d.int(3, 20), c0 = p0 - margin, s0 = d.pick([500, 1000, 2000]), dd = d.pick([20, 40, 50, 100]), e = d.pick([50, 100, 200, 500]);
        const top = margin * e - dd * s0;
        if (top <= 0 || top % (2 * dd * e) !== 0) return null;
        const x0 = top / (2 * dd * e), price = p0 - dd * x0;
        if (x0 < 1 || x0 > 15 || price <= c0) return null;
        return N(`어느 공장에서 생산하는 제품 1개의 원가는 ${c0}원이다. 가격을 ${p0}원으로 하면 한 달에 ${s0}개를 팔 수 있고, 가격을 ${dd}원씩 내릴 때마다 ${e}개씩 더 팔 수 있다고 한다. 한 달 동안의 이익이 최대일 때, 제품 1개의 가격은 몇 원인가? (단, 이익은 (가격 − 원가) × 판매량이다.)`, price, {
          unit: '원',
          explain: `가격을 ${dd}원씩 ${X}번 내리면 1개당 이익은 ${nb(`(${margin} ${MINUS} ${dd}${X})원`)}, 판매량은 ${nb(`(${s0} + ${e}${X})개`)}이므로 이익은 ${nb(`(${margin} ${MINUS} ${dd}${X})(${s0} + ${e}${X})`)}원이다. `
            + `이 식은 ${nb(`${X} = ${frac(`${margin} × ${e} ${MINUS} ${dd} × ${s0}`, `2 × ${dd} × ${e}`)} = ${x0}`)}일 때 최대이므로 가격은 ${nb(`${p0} ${MINUS} ${dd} × ${x0} = ${price}`)}원이다.`,
          facts: { value: `${p0}-${dd}*((${p0}-${c0})*${e}-${dd}*${s0})/(2*${dd}*${e})`, derived: [2] }
        });
      })
    ]
  });
  const SGt = (t) => B.kit.mid.SG(t);
})(typeof window !== 'undefined' ? window : globalThis);
