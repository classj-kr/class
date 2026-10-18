// 중학교 3학년 2학기 4단원 원주각 — 단원 틀·원 그림 도구와 앞쪽 묶음
// (원주각과 중심각, 반원에 대한 원주각, 원주각의 크기와 호의 길이, 원의 안과 밖에서 만나는 두 직선).
// 수집해 둔 미래엔(황선욱) 2015 교과서·지도서·평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1: 74꼴, 심화꼴: 24꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 뺌(까닭) / 겹침」을 가른 대조표는 references/textbooks/수학/_분석/9-2-4/싣기_대조표.md 에 있다.
// (원에 내접하는 사각형, 네 점이 한 원 위에 있을 조건, 원의 접선과 현이 이루는 각은 9-2-4b.js 에, 실력 문항은 9-2-4c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
// 영역은 도형과 측정. 성취기준은 9수03-19(원주각의 성질을 이해하고 정당화할 수 있다)이다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(중심각·원주각·호의 길이·호의 비·원주의 몇 분의 1·교점의 각), 묻는 것(원주각·중심각·호의 길이·각 둘), 푸는 길
//    (바로 옮기기 / 직각에서 빼기 / 이등변삼각형 / 삼각형의 외각 / 식 세우기)이 다르면 따로 싣는다. 수만 다른 것은 한 번만 싣는다.
//  - 그림은 수치대로 그린다: 원 위의 점을 호의 크기(도)로 놓으므로 원주각은 그 호의 절반이 된다. 문항을 지을 때마다 그림에서 잰 각이 답과 같은지 확인하고(sure),
//    다르면 문항을 만들지 않는다. 묻는 각은 그림에 x, y 로만 적고, 그림 설명(aria-label)에는 그림에 적힌 수를 모두 말로 적는다.
//    각의 크기와 점의 이름은 그림을 다 그린 뒤에 적는다(Circ): 두 변 사이에서 선·호·다른 글과 겹치지 않고, 다른 선 너머로 넘어가지 않는 자리를
//    꼭짓점에 가까운 곳부터 찾는다. 좁은 각의 크기는 각 바깥에 적고 가는 선으로 가리킨다. 글끼리 겹치면 수와 자리를 다시 뽑고(retry, 60번),
//    글을 깨끗이 놓을 자리가 없는 그림도 처음 12번까지는 다시 뽑는다.
//  - 답: 각도는 「□°」, 각 둘(셋)은 「∠x [ ]°, ∠y [ ]°」, 호의 길이는 「□ cm」 또는 「□π cm」, 근호가 든 길이·넓이는 「[ ]√[ ] cm」「([ ] + [ ]√[ ]) cm²」로 받는다.
//    각·길이·넓이는 음수가 될 수 없어 부호 단추를 달지 않는다. 원문의 「∠x + ∠y」「∠x − ∠y」처럼 따로 구한 두 각을 더하거나 뺀 꼴은 두 각을 따로 묻는다.
//    두 각이 따로는 정해지지 않고 합만 정해지는 그림(①8·44, 심13)은 합을 묻는다.
//  - 교육과정의 금: 「원과 비례에 관한 성질은 다루지 않는다」, 「증명을 할 때, ‘가정’, ‘결론’ 용어는 다루지 않는다」, 「지나치게 엄밀한 형식 논리 규칙의 이용을 요구하는 문제는 다루지 않는다」.
//    증명은 교과서 본문에 실린 설명의 빈칸만 싣는다(①13·68). 할선·현의 길이의 곱, 사인법칙의 꼴은 싣지 않았다.
//  - 앞 학년·앞 단원에서 한 일은 다시 싣지 않는다: 중심각과 호의 정비례(7-2-3), 외심과 두 꼭짓점이 이루는 각(8-2-1), 접선의 길이(9-2-3).
//    다만 이 단원의 원주각 성질을 대어야 풀리는 문제에서 앞의 것을 함께 쓰는 것은 싣는다(접선과 반지름이 수직, 30°·60°·45°의 삼각비, 이등변삼각형).
//  - 꼴 목록에 적힌 원문 답은 따르지 않는다. 답은 모두 코드가 셈하고, 문제 글만 읽고 따로 지은 풀이로 모든 유형을 다시 풀어 맞춰 보았다.
//
// 뺀 것과 까닭(9-2-4b.js, 9-2-4c.js 의 것까지 여기에 모아 적는다)
//  - 교육과정 밖: 두 현의 교점에서 닮은 삼각형으로 길이의 곱을 잇는 꼴(심22·24 — 원과 비례에 관한 성질), 한 각과 맞은편 변으로 외접원의 반지름(심23)과
//    접선과 현이 이루는 각의 코사인으로 지름(심18 — 사인법칙의 꼴, 고등학교).
//  - 서술형 전용: 내접사각형의 대각의 합이 180°임을 설명하기(①13의 예제), 사각형이 원에 내접할 조건을 설명하기(①50의 탐구1·2⑵), △ABC가 이등변삼각형임을 설명하기(①67⑴)
//    — 빈칸 고르기·수로 묻기로 바꿀 수 있는 것은 바꾸어 실었다.
//  - 그림을 알 수 없는 것: 네 점이 한 원 위에 있고 점 O가 그 원의 중심이라는 것을 그림만 알려 주는 꼴(①49), 접선 반대쪽 보각(①53의 기2-02⑵), 두 원의 공통 접선과 두 각의 차(①72의 기2-13).
//  - 겹침(하는 일이 이미 실은 유형과 같다): 심1·5(→ ①17 semi-mid), 심6(→ ①46 cyc-pentagon 첫째 차례), ①3의 표24(→ ①38), ①18의 표23(→ ①15), ①25의 표12(→ arc-move),
//    ①41의 표27·중08(→ cyc-diagonal), ①48의 대23(→ ①34 cross-in)과 기1-10, ①69의 「원주각 → 두 접선이 이루는 각」(→ 같은 유형의 다른 차례)과 ①70의 대15. 자세한 것은 대조표에 적었다.
//  - 판단이 갈릴 수 있는 것: ①74(접선과 현이 이루는 각과 닮음으로 AC² = AH × AB)는 할선·현의 길이의 곱이 아니라 닮음의 비례식이어서 실력에 실었다.
//    심12의 「△ABC를 50° 회전」은 회전 이동을 쓰지 않고 「△ABC ≡ △AB′C′, ∠BAB′ = ∠CAC′」으로 바꾸어 실었다. ①26의 「세 호의 비 → 한 내각」은 8-2-1 실력(외접원의 호의 비)과
//    같은 일이어서 「두 비로 준 세 호 → 세 내각」으로 실었다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」 각도는 수에 붙여 적고(56°) 길이는 띄어 적는다(6 cm).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, N, M, C, inline } = B.kit;
  const { V, nb, SG, rt, grp } = B.kit.mid;
  const { RAD, at, dirOf, dist, mid, meet, sv, TINT, Board, textW } = B.kit.mgeo;
  const UNIT = '9-2-4', S19 = '9수03-19';
  // ref 에 기본꼴(①)만 있으면 기본 자료, 심화꼴(심)만 있으면 심화 자료
  const sourceOf = (ref) => '수집본 ' + (/①/.test(ref) ? (/심/.test(ref) ? '기본·심화' : '기본') : '심화') + ' 자료(' + ref + ')';
  // 그림 속 글끼리 겹치면(Board.clash) 수와 자리를 다시 뽑는다. 60번 안에 못 찾으면 마지막 것을 쓴다.
  // 글이 선에 닿거나 다른 선 너머에 적힐 수밖에 없는 그림(trouble)은 처음 12번만 다시 뽑는다.
  let clashed = false, strict = true;
  const retry = (make) => (d, n) => { let item; for (let k = 0; k < 60; k += 1) { clashed = false; strict = k < 12; item = make(d, n); if (!clashed) return item; } return item; };
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: sourceOf(ref), make: retry(make) }, more || {});
  const X = V('x'), Y = V('y'), Z = V('z'), HALF = frac(1, 2), sg = SG;
  const deg = (v) => v + '°';
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);

  // ── 답 ──
  const degQ = (text, v, o) => N(text, v, Object.assign({ unit: '°' }, o));
  const cmQ = (text, v, o) => N(text, v, Object.assign({ unit: 'cm' }, o));
  // 각 둘(셋)을 함께 받는다. parts: [[이름, 답], …]
  const degs = (text, parts, o) => M(text, parts.map(([label, answer]) => ({ label, answer, unit: '°' })), Object.assign({ shown: parts.map(([label, answer]) => `${label} = ${answer}°`).join(', ') }, o));
  // π가 드는 길이: 칸 뒤에 π와 단위를 붙여 계수만 받는다.
  const piQ = (text, k, unit, o) => Object.assign(N(text, k, Object.assign({}, o, { unit: 'π ' + unit })), { shown: `${k}π ${unit}` });
  // a√b(길이·넓이 — 음수가 될 수 없어 부호 단추를 달지 않는다). a 는 2 이상.
  const radQ = (text, a, n, unit, o) => inline(text, grp('{0}' + rt('{1}') + (unit ? ' ' + unit : '')), [{ answer: a }, { answer: n }], Object.assign({ shown: `${a}${rt(n)}${unit ? ' ' + unit : ''}` }, o));
  // a + b√c(길이·넓이): 「([ ] + [ ]√[ ]) cm」
  const radPlusQ = (text, a, bq, n, unit, o) => inline(text, grp('({0} + {1}' + rt('{2}') + ')' + (unit ? ' ' + unit : '')), [{ answer: a }, { answer: bq }, { answer: n }], Object.assign({ shown: `(${a} + ${bq}${rt(n)})${unit ? ' ' + unit : ''}` }, o));
  // 고르기: 맞는 보기 하나와 틀린 보기들을 섞는다.
  function pickOne(d, text, right, wrongs, o) {
    const opt = o || {}, rows = d.shuffle([[right, true]].concat(wrongs.map((w) => [w, false]))), hit = rows.findIndex((r) => r[1]);
    return C(text, rows.map((r) => r[0]), hit, { figure: opt.figure, explain: opt.explain, facts: Object.assign({ truth: rows.map((r) => r[1]), want: true }, opt.facts || {}) });
  }
  // 「모두 고른 것」: flags 가 참인 기호들이 정답이다. 틀린 보기는 정답과 한두 개 다른 묶음에서 고른다.
  const bits = (m) => { let n = 0; for (let x = m; x; x >>= 1) n += x & 1; return n; };
  function allQ(d, text, tags, flags, o) {
    const n = flags.length, key = (m) => tags.filter((_, i) => m & (1 << i)).join(', '), right = flags.reduce((m, f, i) => m | (f ? 1 << i : 0), 0), pool = [];
    for (let m = 1; m < (1 << n); m += 1) if (m !== right) pool.push(m);
    const wrong = d.shuffle(pool.filter((m) => bits(m ^ right) === 1)).concat(d.shuffle(pool.filter((m) => bits(m ^ right) === 2))).slice(0, 3);
    return pickOne(d, text, key(right), wrong.map(key), o);
  }

  // ── 원 그림 ──────────────────────────────────────────────────
  // 원 O(반지름 R px). 원 위의 점은 각(도)으로 놓는다: 오른쪽이 0°이고 시계 반대쪽으로 커진다(화면의 y 는 아래로 커진다).
  // 원 밖·안의 점은 좌표로 놓는다(put). 선분·각은 점 이름으로 적는다: seg('PA PB'), ang('APB', 글)은 꼭짓점 P 의 각(180°보다 작은 쪽),
  // sweep('BOD', 글)은 꼭짓점 O 에서 OB 쪽에서 시계 반대쪽으로 OD 쪽까지(180°를 넘어도 된다).
  // names() 가 점마다 선이 가장 성긴 쪽에 이름을 적는다(원 위의 점은 원이 지나가는 쪽도 피한다).
  const MARK = 'stroke:#b42318;stroke-width:1.5';
  const onSeg = (p, u, w) => { const L = dist(u, w), t = ((p[0] - u[0]) * (w[0] - u[0]) + (p[1] - u[1]) * (w[1] - u[1])) / (L * L); if (t <= 0.001 || t >= 0.999) return false; const f = [u[0] + (w[0] - u[0]) * t, u[1] + (w[1] - u[1]) * t]; return dist(p, f) < 0.6; };
  // o.hide: 원을 그리지 않는다(네 점이 한 원 위에 있는지를 묻는 그림, 두 원 그림 따위).
  function Circ(R0, o) {
    const R = R0 || 78, b = Board(), O = [0, 0], P = {}, A = {}, segs = [], dims = [];
    // 그린 것을 모두 적어 둔다: 선(lines), 원과 호(rings), 글 상자(boxes). 글을 놓을 자리를 고를 때 이것들과 겹치지 않는 곳을 찾는다.
    const lines = [], rings = [], boxes = [];
    const seg0 = b.seg, disk0 = b.disk, arc0 = b.arc, fan0 = b.fan, poly0 = b.poly, text0 = b.text, angle0 = b.angle;
    b.seg = (p, q, kind, css) => { lines.push([p, q]); return seg0(p, q, kind, css); };
    b.disk = (c, r, css) => { rings.push([c, r, 0, 360]); return disk0(c, r, css); };
    b.arc = (c, r, a0, a1, kind) => { rings.push([c, r, a0, a1]); return arc0(c, r, a0, a1, kind); };
    b.fan = (c, r, a0, a1, css) => { rings.push([c, r, a0, a1]); lines.push([c, at(c, r, a0)], [c, at(c, r, a1)]); return fan0(c, r, a0, a1, css); };
    b.poly = (pts, css) => { pts.forEach((p, i) => lines.push([p, pts[(i + 1) % pts.length]])); return poly0(pts, css); };
    b.text = (p, html, opt) => { const size = (opt && opt.size) || 13, w = textW(html) * size / 13; boxes.push([p[0] - w / 2, p[1] - size * 0.5, p[0] + w / 2, p[1] + size * 0.5]); return text0(p, html, opt); };
    b.angle = (v, a0, a1, label, opt0) => {
      const opt = opt0 || {};
      if (opt.arc !== false) {
        let to = a1; while (to <= a0) to += 360; while (to - a0 > 360) to -= 360;
        const span = to - a0;
        if (Math.abs(span - 90) < 0.01 && (label == null || label === '') && opt.square !== false) { const p1 = at(v, 9, a0), p3 = at(v, 9, to), p2 = [p1[0] + p3[0] - v[0], p1[1] + p3[1] - v[1]]; lines.push([p1, p2], [p2, p3]); }
        else rings.push([v, opt.r || (span < 40 ? 22 : span > 130 ? 11 : 15), a0, to]);
      }
      return angle0(v, a0, a1, label, opt0);
    };
    if (!(o && o.hide)) b.disk(O, R);
    // 글 상자(가운데 c, 너비 w, 높이 13)에 들어오는 선·호의 점 수와, 이미 적은 글 상자와 겹치는지
    // 점들은 8 px 칸으로 나누어 담는다(글 상자 둘레의 칸만 본다). 그림을 다 그린 뒤 한 번 만들고, 가리키는 선을 그을 때마다 더한다.
    const CELL = 8, cellKey = (i, j) => (i + 4096) * 8192 + (j + 4096);
    const cloud = () => {
      const grid = new Map(), put = (x, y) => { const key = cellKey(Math.floor(x / CELL), Math.floor(y / CELL)); let list = grid.get(key); if (!list) grid.set(key, (list = [])); list.push([x, y]); };
      grid.line = (p, q) => { const n = Math.max(1, Math.ceil(dist(p, q) / 1.5)); for (let i = 0; i <= n; i += 1) put(p[0] + (q[0] - p[0]) * i / n, p[1] + (q[1] - p[1]) * i / n); };
      for (const [p, q] of lines) grid.line(p, q);
      for (const [c, r, a0, a1] of rings) { let e = a1; while (e < a0) e += 360; const step = Math.max(0.4, 86 / r); for (let a = a0; a <= e + 1e-9; a += step) { const q = at(c, r, a); put(q[0], q[1]); } }
      return grid;
    };
    const hits = (grid, c, w) => {
      const hx = w / 2 + 1, hy = 7; let n = 0;
      for (let i = Math.floor((c[0] - hx) / CELL); i <= Math.floor((c[0] + hx) / CELL); i += 1) for (let j = Math.floor((c[1] - hy) / CELL); j <= Math.floor((c[1] + hy) / CELL); j += 1) {
        const list = grid.get(cellKey(i, j));
        if (list) for (const [x, y] of list) if (Math.abs(x - c[0]) < hx && Math.abs(y - c[1]) < hy) n += 1;
      }
      return n;
    };
    const boxHit = (c, w) => boxes.some((x) => c[0] - w / 2 < x[2] + 5 && x[0] < c[0] + w / 2 + 5 && c[1] - 6.5 < x[3] + 1 && x[1] < c[1] + 6.5 + 1);
    const badness = (pts, c, w) => hits(pts, c, w) * 10 + (boxHit(c, w) ? 60 : 0);
    // 점 a(꼭짓점이나 선분 위의 점)에서 글의 가운데 c 까지 가는 동안 넘는 선과 원의 수. a 를 지나거나 a 에 바짝 붙어 지나는 선(각의 두 변, 글을 붙일 선분)은 세지 않는다.
    // 다른 선 너머에 적힌 글은 그 선의 것으로 읽히기 쉽다.
    const side = (p, q, r) => (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]);
    const cross = (a, c) => {
      let k = 0;
      for (const [u, w] of lines) {
        if (segDist(a, u, w) < 5) continue;
        if (side(a, c, u) * side(a, c, w) < 0 && side(u, w, a) * side(u, w, c) < 0) k += 1;
      }
      for (const [o, r, a0, a1] of rings) if (a1 - a0 >= 360 && Math.abs(dist(a, o) - r) > 1 && (dist(a, o) - r) * (dist(c, o) - r) < 0) k += 1;
      return k;
    };
    // 글을 깨끗이 놓을 자리가 없으면 그림을 다시 뽑는다(retry).
    let trouble = false;
    // 글 상자(너비 w, 높이 h)의 네 귀가 꼭짓점 v 에서 a0° 쪽 반직선과 a1° 쪽 반직선 사이(시계 반대쪽)에 1.5 넘게 들어가 있는가
    const inWedge = (v, a0, a1, c, w, h) => {
      const c0 = Math.cos(a0 * RAD), s0 = Math.sin(a0 * RAD), c1 = Math.cos(a1 * RAD), s1 = Math.sin(a1 * RAD);
      return [[-1, -1], [1, -1], [1, 1], [-1, 1]].every(([sx, sy]) => { const ux = c[0] + sx * w / 2 - v[0], uy = -(c[1] + sy * h / 2 - v[1]); return c0 * uy - s0 * ux >= 1.5 && s1 * ux - c1 * uy >= 1.5; });
    };
    // 꼭짓점 v 의 a0° → a0 + sp° 사이에 글을 놓을 자리: 두 변 사이에서 선·호·글과 겹치지 않는 곳 가운데 꼭짓점에 가깝고 가운데에 가까운 곳
    const wedgeSpot = (pts, v, a0, sp, label, r0, size) => {
      const k = (size || 13) / 13, w = textW(label) * k + 5, h = 13 * k + 3, m = a0 + sp / 2;
      const base = r0 + 2 + (w / 2) * Math.abs(Math.cos(m * RAD)) + (h / 2) * Math.abs(Math.sin(m * RAD));
      const fs = [0, 0.08, -0.08, 0.16, -0.16, 0.25, -0.25, 0.34, -0.34].concat(sp >= 100 ? [0.4, -0.4, 0.44, -0.44] : []), list = [];
      for (let dd = Math.max(6, base - 4); dd <= base + 28; dd += 2) for (const f of fs) list.push({ dd, f, pen: Math.max(0, dd - base) * 1.2 + Math.max(0, base - dd) * 0.6 + Math.abs(f * sp) * 0.3 });
      // 덜 벌받는 자리부터 보고, 남은 자리의 벌이 지금까지의 가장 나은 점수를 넘으면 그만 본다.
      list.sort((x, y) => x.pen - y.pen);
      let best = null;
      for (const k of list) {
        if (best && k.pen >= best.score) break;
        const c = at(v, k.dd, m + k.f * sp);
        if (sp < 180 && !inWedge(v, a0, a0 + sp, c, w, h)) continue;
        const bad = badness(pts, c, w - 5) + cross(v, c) * 40, score = bad * 100 + k.pen;
        if (!best || score < best.score) best = { c, score, bad };
      }
      return best;
    };
    const pendAng = [], pendName = [];
    const S = { b, P, A, R, O };
    S.on = (map) => { for (const k of Object.keys(map)) { A[k] = map[k]; P[k] = at(O, R, map[k]); } return S; };
    S.put = (map) => { Object.assign(P, map); return S; };
    S.center = () => { P.O = O; b.dot(O); return S; };
    const each = (names, f) => { for (const pair of names.split(' ').filter(Boolean)) f(P[pair[0]], P[pair[1]], pair); return S; };
    S.seg = (names, kind) => each(names, (p, q) => { b.seg(p, q, kind); segs.push([p, q]); });
    // 선분 pq 를 q 너머로 len 만큼 늘여 긋는다. tail 이 있으면 늘인 끝점에 그 이름을 붙인다.
    S.ray = (names, len, tail, kind) => each(names, (p, q) => { const e = at(q, len, dirOf(p, q)); b.seg(p, e, kind); segs.push([p, e]); if (tail) P[tail] = e; });
    // 원 위의 점 n 에서의 접선: l0 는 (n 의 각 + 90°) 쪽, l1 은 (n 의 각 − 90°) 쪽으로 그은 길이. e0, e1 은 두 끝점의 이름(없으면 '').
    S.tangent = (n, l0, l1, e0, e1) => { const a = A[n], p = P[n], q0 = at(p, l0, a + 90), q1 = at(p, l1, a - 90); b.seg(q0, q1); segs.push([q0, q1]); if (e0) P[e0] = q0; if (e1) P[e1] = q1; return S; };
    // 각의 크기 글. 표시(호)는 바로 긋고 글은 그림을 다 그린 뒤(svg) 선·호·다른 글과 겹치지 않는 자리에 적는다.
    // 좁은 각이라 글이 꼭짓점에서 멀리 밀려나야 하면 각 바깥(변 너머)에 적고 가는 선으로 각을 가리킨다.
    S.ang = (name, label, o) => {
      const v = P[name[1]], opt = o || {}, w = textW(String(label || '')) + 4;
      let a0 = dirOf(v, P[name[0]]), a1 = dirOf(v, P[name[2]]);
      if ((a1 - a0 + 360) % 360 > 180) [a0, a1] = [a1, a0];
      const sp = (a1 - a0 + 360) % 360, need = (w / 2 + 3) / Math.tan(Math.max(sp, 1) * RAD / 2) + 8;
      if (!label) { b.corner(v, P[name[0]], P[name[2]], label, opt); return S; }
      if (opt.inside || sp >= 100 || need <= (opt.far || 42)) {
        const r = opt.r || (sp < 40 ? 22 : sp > 130 ? 11 : 15);
        if (opt.arc !== false) b.angle(v, a0, a0 + sp, '', Object.assign({}, opt, { r, square: false }));
        pendAng.push((pts) => {
          const spot = opt.d ? { c: at(v, opt.d, a0 + sp / 2), bad: 0 } : wedgeSpot(pts, v, a0, sp, label, opt.arc === false ? 0 : r, opt.size);
          if (spot.bad >= 30) trouble = true;
          b.text(spot.c, label, { blue: !opt.ink, size: opt.size });
        });
        return S;
      }
      const r = opt.r || 20, m = a0 + sp / 2;
      b.angle(v, a0, a0 + sp, '', { r });
      pendAng.push((pts) => {
        const cands = [];
        for (const side of [-1, 1]) for (const turn of [24, 18, 32, 44, 58]) for (const gap of [0, 6, 12, 20]) {
          if (opt.side && side !== opt.side) continue;
          const dir = side < 0 ? a0 - turn : a0 + sp + turn, c = at(v, r + 9 + gap + w / 2 + 2, dir);
          cands.push({ dir, gap, c, score: badness(pts, c, w - 4) * 100 + gap * 0.8 + Math.abs(turn - 24) * 0.3 - Math.min(room(c), 12) * 0.5 });
        }
        const best = cands.sort((x, y) => x.score - y.score)[0];
        // 각 안쪽의 먼 자리(꼭짓점에서 58 px 안쪽)가 깨끗하고, 바깥 자리가 선·글에 닿거나 가리키는 선이 길어지면 안쪽에 적는다.
        const inner = opt.side ? null : wedgeSpot(pts, v, a0, sp, label, r, opt.size);
        if (inner && inner.bad === 0 && dist(inner.c, v) <= 58 && Math.max(0, dist(inner.c, v) - 44) * 0.5 < best.score) { b.text(inner.c, label, { blue: true }); return; }
        if (best.score >= 3000) trouble = true;
        const lead = [at(v, r + 1, m), at(v, r + 9 + best.gap, best.dir)];
        b.seg(lead[0], lead[1], 'thin'); pts.line(lead[0], lead[1]);
        b.text(best.c, label, { blue: true });
      });
      return S;
    };
    S.sweep = (name, label, o) => { const v = P[name[1]]; b.angle(v, dirOf(v, P[name[0]]), dirOf(v, P[name[2]]), label, o); return S; };
    S.right = (names) => { for (const n of names.split(' ')) b.corner(P[n[1]], P[n[0]], P[n[2]]); return S; };
    // 길이가 같은 호의 표시(호 a0° → a1°, 시계 반대쪽의 가운데에 짧은 금 n 개)
    S.arcTick = (a0, a1, n) => { let e = a1; while (e <= a0) e += 360; const m = (a0 + e) / 2, k = n || 1; for (let i = 0; i < k; i += 1) { const t = m + (i - (k - 1) / 2) * (190 / R); b.seg(at(O, R - 4.5, t), at(O, R + 4.5, t), null, MARK); } return S; };
    S.arcDim = (a0, a1, label, off) => { let e = a1; while (e <= a0) e += 360; b.arcDim(O, R, a0, e, label, off); dims.push([a0, e]); return S; };
    // 선과 원에서 떨어진 거리(callout·길이 글의 자리를 견줄 때)
    const segDist = (c, u, w) => { const L2 = (w[0] - u[0]) ** 2 + (w[1] - u[1]) ** 2, t = Math.max(0, Math.min(1, ((c[0] - u[0]) * (w[0] - u[0]) + (c[1] - u[1]) * (w[1] - u[1])) / (L2 || 1))); return dist(c, [u[0] + (w[0] - u[0]) * t, u[1] + (w[1] - u[1]) * t]); };
    const room = (c) => Math.min(Math.abs(dist(c, O) - R), ...lines.map(([u, w]) => segDist(c, u, w)));
    // 선분 p–q 옆의 길이 글: 선분을 따라 몇 자리, 양쪽, 띄울 거리를 바꿔 보며 선·호·글과 겹치지 않고 선과 원에서 가장 먼 자리에 적는다.
    // away: 되도록 글을 두지 않을 쪽에 있는 점(그 반대쪽이 선·글에 닿을 때만 이쪽에 적는다)
    S.lenText = (p, q, label, away) => {
      const L = dist(p, q), w = textW(label) + 4, n0 = [-(q[1] - p[1]) / L, (q[0] - p[0]) / L], cands = [], pts = cloud();
      for (const t of [0.5, 0.35, 0.65, 0.25, 0.75]) for (const sgn of [1, -1]) for (const gap of [3, 6, 10]) {
        const m = mid(p, q, t), n = [n0[0] * sgn, n0[1] * sgn], off = (w / 2) * Math.abs(n[0]) + 7 * Math.abs(n[1]) + gap, c = [m[0] + n[0] * off, m[1] + n[1] * off];
        const wrong = away && (away[0] - m[0]) * n[0] + (away[1] - m[1]) * n[1] > 0 ? 50 : 0;
        const box = Math.min(...[[-w / 2, -7], [w / 2, -7], [w / 2, 7], [-w / 2, 7], [0, 0]].map(([dx, dy]) => room([c[0] + dx, c[1] + dy])));
        const bad = badness(pts, c, w - 4) + cross(m, c) * 40;
        cands.push({ c, bad, score: bad * 100 + wrong - Math.min(box, 7) + gap * 0.3 + Math.abs(t - 0.5) * 4 });
      }
      const best = cands.sort((x, y) => x.score - y.score)[0];
      if (best.bad >= 30) trouble = true;
      b.text(best.c, label, { blue: true });
      return S;
    };
    S.tick = (names, n) => each(names, (p, q) => b.tick(p, q, n));
    S.arrow = (names) => each(names, (p, q) => b.arrow(p, q));
    S.dot = (names) => { for (const n of names) b.dot(P[n]); return S; };
    // 점의 이름: 점에서 뻗은 선 사이의 빈 쪽에, 선·호·글과 겹치지 않는 자리를 골라 적는다(넓게 빈 쪽, 그 가운데, 점에 가까운 자리가 먼저).
    const nameSpot = (pts, p, n, dirs) => {
      const w = textW(n) + 5, h = 16, list = dirs.map((a) => ((a % 360) + 360) % 360).sort((x, y) => x - y), gaps = [];
      list.forEach((a, i) => gaps.push([a, (i + 1 < list.length ? list[i + 1] : list[0] + 360) - a]));
      const widest = Math.max(...gaps.map((g) => g[1]));
      const cand = [];
      for (const [from, gap] of gaps) {
        if (gap < 24) continue;
        for (const f of [0, 0.12, -0.12, 0.24, -0.24, 0.34, -0.34].concat(gap >= 300 ? [0.42, -0.42, 0.5] : [])) {
          const dir = from + gap / 2 + f * gap, base = 2 + (w / 2) * Math.abs(Math.cos(dir * RAD)) + (h / 2) * Math.abs(Math.sin(dir * RAD));
          for (let dd = base; dd <= base + 16; dd += 2) cand.push({ from, gap, dir, dd, pen: (dd - base) * 1.2 + Math.abs(f) * gap * 0.12 + (widest - gap) * 0.1 });
        }
      }
      cand.sort((x, y) => x.pen - y.pen);
      let best = null;
      for (const k of cand) {
        if (best && k.pen >= best.score) break;
        const c = at(p, k.dd, k.dir);
        if (k.gap < 180 && !inWedge(p, k.from, k.from + k.gap, c, w, h)) continue;
        const bad = badness(pts, c, w - 5), score = bad * 100 + k.pen;
        if (!best || score < best.score) best = { c, score, bad };
      }
      if (best && best.bad >= 30) trouble = true;
      return best;
    };
    S.names = (over) => {
      const set = over || {};
      pendName.push((grid) => {
        for (const n of Object.keys(P)) {
          if (!/^[A-Z]$/.test(n) || set[n] === null) continue;
          const p = P[n];
          if (typeof set[n] === 'number') { b.name(p, n, set[n], 12); continue; }
          const dirs = [];
          for (const [u, w] of segs) {
            if (dist(p, u) < 0.6) dirs.push(dirOf(p, w));
            else if (dist(p, w) < 0.6) dirs.push(dirOf(p, u));
            else if (onSeg(p, u, w)) dirs.push(dirOf(p, u), dirOf(p, w));
          }
          if (A[n] != null) {
            // 호의 길이 치수선의 끝에 있는 점은 이름을 치수선 바깥(옆)으로 비켜 적는다.
            const near = (u, v) => Math.abs(((u - v) % 360 + 540) % 360 - 180) < 3;
            const at0 = dims.filter(([u]) => near(A[n], u)).length, at1 = dims.filter(([, v]) => near(A[n], v)).length;
            if (at0 && at1) { b.text(at(O, R + 27, A[n]), n); continue; }
            if (at0 || at1) { b.text(at(O, R + 12, A[n] + (at0 ? -1 : 1) * (720 / R)), n); continue; }
            dirs.push(A[n] + 90, A[n] - 90);
          }
          // 다른 원(S.b.disk 로 그린 원) 위의 점은 그 원이 지나가는 쪽도 피한다.
          for (const [c, r, a0, a1] of rings) if (a1 - a0 >= 360 && r > 4 && Math.abs(dist(p, c) - r) < 0.8 && !(c === O && A[n] != null)) dirs.push(dirOf(c, p) + 90, dirOf(c, p) - 90);
          const spot = nameSpot(grid, p, n, dirs.length ? dirs : [n === 'O' ? 90 : 270]);
          if (spot) b.text(spot.c, n); else if (dirs.length) b.nameFree(p, n, dirs); else b.name(p, n, n === 'O' ? 270 : 90, 12);
        }
      });
      return S;
    };
    // S.names 가 다루지 않는 이름(O′, C′ 따위): 점 p 에서 dirs 쪽으로 선이 뻗어 있을 때 빈 자리에 적는다.
    S.nameAt = (p, label, dirs) => { pendName.push((grid) => { const spot = nameSpot(grid, p, label, dirs.length ? dirs : [270]); if (spot) b.text(spot.c, label); else b.nameFree(p, label, dirs); }); return S; };
    // 미뤄 둔 글(각의 크기, 점의 이름)을 적는다. 각의 크기를 먼저, 이름을 나중에.
    const flush = () => { if (!pendAng.length && !pendName.length) return; const grid = cloud(); while (pendAng.length) pendAng.shift()(grid); while (pendName.length) pendName.shift()(grid); };
    S.svg = (label) => { flush(); if (b.clash() || (trouble && strict)) clashed = true; return b.svg(label); };
    S.clash = () => { flush(); return b.clash(); };
    return S;
  }
  // 호 a0° → a1°(시계 반대쪽)의 크기
  const span = (a0, a1) => { let e = a1; while (e <= a0) e += 360; return e - a0; };
  // 여러 수가 서로 gap 이상 떨어져 있는가
  const apart = (list, gap) => list.every((x, i) => list.every((y, j) => i === j || Math.abs(x - y) >= gap));
  // 짝수 각(원주각이 자연수가 되게): lo 이상 hi 이하
  const even = (d, lo, hi) => 2 * d.int(Math.ceil(lo / 2), Math.floor(hi / 2));
  // ∠pvq 의 크기(0° ~ 180°)
  const angAt = (v, p, q) => { const t = Math.abs(dirOf(v, p) - dirOf(v, q)) % 360; return t > 180 ? 360 - t : t; };
  // 그림에서 잰 각과 답이 같은가(그림을 수치대로 그렸는지 지을 때마다 확인한다 — 틀리면 문항을 만들지 않는다).
  const sure = (got, want, what) => { if (Math.abs(got - want) > 0.05) throw new Error('그림과 답이 다르다: ' + (what || '') + ' ' + got.toFixed(2) + ' ≠ ' + want); return want; };
  const angOf = (S, name) => angAt(S.P[name[1]], S.P[name[0]], S.P[name[2]]);
  // 단위원 위의 각 a1, a2 의 두 점을 지나는 직선과 a3, a4 의 두 점을 지나는 직선의 교점이 중심에서 떨어진 거리(반지름의 몇 배)
  const reach = (a1, a2, a3, a4) => { const u = (a) => at([0, 0], 1, a), m = meet(u(a1), u(a2), u(a3), u(a4)); return Math.hypot(m[0], m[1]); };

  // ── 묶음: 원주각과 중심각 ──
  const types1 = [
    T('central-half', '중심각의 크기로 원주각의 크기 구하기', '①1', (d) => {
      const c = even(d, 56, 160), x = c / 2, turn = d.int(-15, 15), aP = 90 + turn + d.pick([-1, 1]) * d.int(0, Math.max(0, 70 - c / 4));
      const S = Circ().center().on({ A: 270 - c / 2 + turn, B: 270 + c / 2 + turn, P: aP }).seg('OA OB PA PB').ang('AOB', deg(c)).ang('APB', sv('x'), { square: false }).names();
      sure(angOf(S, 'APB'), x);
      return degQ(`그림과 같이 원 O에서 ∠AOB = ${c}°일 때, ∠${X}의 크기는?`, x, {
        figure: S.svg(`원 O 위에 세 점 A, B, P가 있다. 반지름 OA, OB와 현 PA, PB가 그어져 있다. ∠AOB = ${c}°, ∠APB = x`),
        explain: `∠APB는 호 AB에 대한 원주각이고 ∠AOB는 호 AB에 대한 중심각이다. 한 호에 대한 원주각의 크기는 중심각의 크기의 ${HALF}이므로 ∠${X} = ${HALF} × ${c}° = ${x}°이다.`,
        facts: { calc: [[`${c}/2`, 0]], unseen: [2] }
      });
    }),
    T('central-double', '원주각의 크기로 중심각의 크기 구하기', '①2', (d) => {
      if (d.bool()) {
        const x = d.int(28, 78), c = 2 * x, turn = d.int(-15, 15), aP = 90 + turn + d.pick([-1, 1]) * d.int(0, Math.max(0, 70 - x / 2));
        const S = Circ().center().on({ A: 270 - x + turn, B: 270 + x + turn, P: aP }).seg('OA OB PA PB').ang('APB', deg(x)).ang('AOB', sv('x'), { square: false }).names();
        sure(angOf(S, 'AOB'), c); sure(angOf(S, 'APB'), x);
        return degQ(`그림과 같이 원 O에서 ∠APB = ${x}°일 때, ∠${X}의 크기는?`, c, {
          figure: S.svg(`원 O 위에 세 점 A, B, P가 있다. 반지름 OA, OB와 현 PA, PB가 그어져 있다. ∠APB = ${x}°, ∠AOB = x`),
          explain: `∠APB와 ∠AOB는 각각 호 AB에 대한 원주각과 중심각이다. 중심각의 크기는 원주각의 크기의 2배이므로 ∠${X} = 2 × ${x}° = ${c}°이다.`,
          facts: { calc: [[`2*${x}`, 0]], unseen: [2] }
        });
      }
      // 지름의 한 끝 P 에서 그은 현 PB: 지름 PQ 와 현 PB 가 이루는 원주각 → 반지름 OB 와 OQ 가 이루는 중심각
      const t = d.int(24, 66), turn = d.int(-25, 25), aP = 30 + turn;
      const S = Circ().center().on({ P: aP, Q: aP + 180, B: aP + 180 + 2 * t }).seg('PQ PB OB').ang('QPB', deg(t)).ang('QOB', sv('x'), { square: false }).names();
      sure(angOf(S, 'QOB'), 2 * t); sure(angOf(S, 'QPB'), t);
      return degQ(`그림과 같이 선분 PQ는 원 O의 지름이고 ∠QPB = ${t}°일 때, ∠${X}의 크기는?`, 2 * t, {
        figure: S.svg(`원 O의 지름 PQ와 원 위의 점 B. 현 PB와 반지름 OB가 그어져 있다. ∠QPB = ${t}°, ∠QOB = x`),
        explain: `∠QPB는 호 QB에 대한 원주각이고 ∠QOB는 호 QB에 대한 중심각이다. 중심각의 크기는 원주각의 크기의 2배이므로 ∠${X} = 2 × ${t}° = ${2 * t}°이다.`,
        facts: { calc: [[`2*${t}`, 0]], unseen: [2] }
      });
    }),
    T('central-obtuse', '작은 호 위의 점에서 본 원주각(둔각)과 중심각', '①3', (d, n) => {
      if (n === 0) {
        const c = even(d, 70, 150), x = 180 - c / 2, turn = d.int(-12, 12), j = d.int(-Math.floor(c / 2) + 22, Math.floor(c / 2) - 22);
        const S = Circ().center().on({ A: 90 + c / 2 + turn, B: 90 - c / 2 + turn, P: 90 + turn + j }).seg('OA OB PA PB').ang('AOB', deg(c), { r: 13 }).ang('APB', sv('x'), { square: false }).names();
        sure(angOf(S, 'APB'), x); sure(angOf(S, 'AOB'), c);
        return degQ(`그림과 같이 원 O에서 ∠AOB = ${c}°이고 점 P는 ∠AOB의 안쪽에 있는 호 AB 위의 점일 때, ∠${X}의 크기는?`, x, {
          figure: S.svg(`원 O 위에 세 점 A, B, P가 있다. 점 P는 ∠AOB의 안쪽에 있는 짧은 호 AB 위에 있다. 반지름 OA, OB와 현 PA, PB가 그어져 있다. ∠AOB = ${c}°, ∠APB = x`),
          explain: `점 P가 짧은 호 AB 위에 있으므로 ∠APB는 점 P를 지나지 않는 긴 호 AB에 대한 원주각이다. 긴 호 AB에 대한 중심각은 360° − ${c}° = ${360 - c}°이므로 ∠${X} = ${HALF} × ${360 - c}° = ${x}°이다.`,
          facts: { calc: [[`(360-${c})/2`, 0]], unseen: [360, 2] }
        });
      }
      if (n === 1) {
        const x = d.int(102, 150), c = 360 - 2 * x, turn = d.int(-12, 12), j = d.int(-Math.floor(c / 2) + 20, Math.floor(c / 2) - 20);
        const S = Circ().center().on({ A: 90 + c / 2 + turn, B: 90 - c / 2 + turn, P: 90 + turn + j }).seg('OA OB PA PB').ang('APB', deg(x), { r: 11 }).ang('AOB', sv('x'), { square: false, r: 13 }).names();
        sure(angOf(S, 'APB'), x); sure(angOf(S, 'AOB'), c);
        return degQ(`그림과 같이 원 O에서 점 P는 ∠AOB의 안쪽에 있는 호 AB 위의 점이고 ∠APB = ${x}°일 때, ∠${X}의 크기는?`, c, {
          figure: S.svg(`원 O 위에 세 점 A, B, P가 있다. 점 P는 ∠AOB의 안쪽에 있는 짧은 호 AB 위에 있다. 반지름 OA, OB와 현 PA, PB가 그어져 있다. ∠APB = ${x}°, ∠AOB = x`),
          explain: `∠APB는 점 P를 지나지 않는 긴 호 AB에 대한 원주각이므로 긴 호 AB에 대한 중심각은 2 × ${x}° = ${2 * x}°이다. ∠${X}는 짧은 호 AB에 대한 중심각이므로 360° − ${2 * x}° = ${c}°이다.`,
          facts: { calc: [[`360-2*${x}`, 0]], unseen: [360, 2] }
        });
      }
      // 짧은 호 BD 위의 점 C 에서 본 둔각 ∠BCD → 긴 호 위의 점 A 에서 본 원주각 x 와 큰 쪽 중심각 y
      const c = d.int(106, 136), minor = 360 - 2 * c, turn = d.int(-10, 10), aB = 270 - minor / 2 + turn, aD = 270 + minor / 2 + turn, aC = 270 + turn + d.int(-Math.floor(minor / 5), Math.floor(minor / 5));
      const S = Circ().center().on({ A: 90 + turn + d.int(-20, 20), B: aB, C: aC, D: aD }).seg('AB AD CB CD OB OD').ang('BCD', deg(c), { r: 11 }).ang('BAD', sv('x'), { square: false }).sweep('DOB', sv('y'), { r: 12 }).names({ O: 270 + turn });
      sure(angOf(S, 'BCD'), c); sure(angOf(S, 'BAD'), 180 - c); sure(360 - angOf(S, 'BOD'), 2 * c);
      return degs(`그림과 같이 원 O 위의 네 점 A, B, C, D에 대하여 ∠BCD = ${c}°일 때, ∠${X}와 ∠${Y}의 크기를 차례로 구하시오. (단, ∠${Y}는 점 A 쪽의 호 BD에 대한 중심각이다.)`, [['∠x', 180 - c], ['∠y', 2 * c]], {
        figure: S.svg(`원 O 위에 네 점 A, B, C, D가 있다. 점 C는 짧은 호 BD 위에 있고 점 A는 긴 호 BD 위에 있다. 현 AB, AD, CB, CD와 반지름 OB, OD가 그어져 있다. ∠BCD = ${c}°, ∠BAD = x, 점 A 쪽으로 벌어진 ∠BOD = y`),
        explain: `∠BCD는 점 A를 지나는 호 BAD에 대한 원주각이므로 그 호에 대한 중심각 ∠${Y} = 2 × ${c}° = ${2 * c}°이다. 짧은 호 BD에 대한 중심각은 360° − ${2 * c}° = ${minor}°이므로 ∠${X} = ${HALF} × ${minor}° = ${180 - c}°이다.`,
        facts: { calc: [[`(360-2*${c})/2`, 0], [`2*${c}`, 1]], unseen: [360, 2] }
      });
    }, { count: 3 }),
    T('central-same', '한 호에 대한 원주각의 크기는 모두 같다', '①4', (d, n) => {
      if (n === 0) {
        const t = d.int(26, 68), turn = d.int(-15, 15), aP = 90 + d.int(32, 60) + turn, aQ = 90 - d.int(32, 60) + turn;
        const S = Circ().on({ A: 270 - t + turn, B: 270 + t + turn, P: aP, Q: aQ }).seg('PA PB QA QB').ang('APB', deg(t)).ang('AQB', sv('x'), { square: false }).names();
        sure(angOf(S, 'AQB'), t);
        return degQ(`그림과 같이 원 위의 네 점 A, B, P, Q에 대하여 ∠APB = ${t}°일 때, ∠${X}의 크기는?`, t, {
          figure: S.svg(`원 위에 네 점 A, B, P, Q가 있다. 점 P, Q는 점 A, B와 같은 호 위에 있지 않다. 현 PA, PB, QA, QB가 그어져 있다. ∠APB = ${t}°, ∠AQB = x`),
          explain: `∠APB와 ∠AQB는 모두 호 AB에 대한 원주각이다. 한 호에 대한 원주각의 크기는 모두 같으므로 ∠${X} = ${t}°이다.`,
          facts: { calc: [[`${t}`, 0]] }
        });
      }
      // 다른 호의 원주각이 함께 적힌 그림: ∠ADC 와 ∠ABC 가 같은 호 AC 에 대한 원주각이고 ∠DCB 는 다른 호(DB)에 대한 원주각이다.
      const v = d.until(() => ({ a: d.int(28, 58), b: d.int(24, 52), s1: d.int(56, 100) }), (w) => Math.abs(w.a - w.b) >= 6 && 360 - 2 * w.a - 2 * w.b - w.s1 >= 56 && 360 - 2 * w.a - 2 * w.b - w.s1 <= 110);
      const turn = d.int(-10, 10), aC = 90 - v.a + turn, aA = 90 + v.a + turn, aD = aA + v.s1, aB = aD + 2 * v.b;
      const S = Circ().on({ A: aA, B: aB, C: aC, D: aD }).seg('AD AB DC CB').ang('ADC', deg(v.a)).ang('DCB', deg(v.b)).ang('ABC', sv('x'), { square: false }).names();
      sure(angOf(S, 'ABC'), v.a); sure(angOf(S, 'DCB'), v.b);
      return degQ(`그림과 같이 원 위의 네 점 A, B, C, D에 대하여 ∠ADC = ${v.a}°, ∠DCB = ${v.b}°일 때, ∠${X}의 크기는?`, v.a, {
        figure: S.svg(`원 위에 네 점 A, B, C, D가 있다. 현 AD, AB, DC, CB가 그어져 있고 현 AB와 현 DC가 원의 내부에서 만난다. ∠ADC = ${v.a}°, ∠DCB = ${v.b}°, ∠ABC = x`),
        explain: `∠ABC와 ∠ADC는 모두 호 AC에 대한 원주각이므로 크기가 같다. ∠${X} = ${v.a}°이다. (∠DCB는 호 DB에 대한 원주각이므로 ∠${X}와 관계가 없다.)`,
        facts: { calc: [[`${v.a}`, 0]] }
      });
    }, { count: 2 }),
    T('central-tri', '같은 호에 대한 원주각과 삼각형의 내각·외각', '①5', (d, n) => {
      if (n === 0) {
        // 호 BC(아래, = 2x), 호 CD, 호 DA(= 2f), 호 AB. ∠DEC = (호 DC + 호 AB)/2 = 180 − x − f
        const v = d.until(() => { const x = d.int(28, 58), f = d.int(18, 36), cd = d.int(50, 100); return { x, f, cd, ab: 360 - 2 * x - 2 * f - cd }; }, (w) => w.ab >= 64 && w.ab <= 130 && Math.abs(w.x - w.f) >= 6);
        const turn = d.int(-8, 8), aB = 270 - v.x + turn, aC = 270 + v.x + turn, aD = aC + v.cd, aA = aD + 2 * v.f, e = 180 - v.x - v.f;
        const S = Circ().on({ A: aA, B: aB, C: aC, D: aD });
        S.put({ E: meet(S.P.A, S.P.C, S.P.B, S.P.D) }).seg('AB AC BD DC BC').ang('DEC', deg(e), { r: 12 }).ang('ACD', deg(v.f)).ang('BAC', sv('x'), { square: false }).names();
        sure(angOf(S, 'DEC'), e); sure(angOf(S, 'ACD'), v.f); sure(angOf(S, 'BAC'), v.x);
        return degQ(`그림과 같이 원 위의 네 점 A, B, C, D에 대하여 두 현 AC, BD의 교점을 E라 하자. ∠DEC = ${e}°, ∠ACD = ${v.f}°일 때, ∠${X}의 크기는?`, v.x, {
          figure: S.svg(`원 위에 네 점 A, B, C, D가 있다. 현 AB, AC, BD, DC, BC가 그어져 있고 현 AC와 현 BD가 점 E에서 만난다. ∠DEC = ${e}°, ∠ACD = ${v.f}°, ∠BAC = x`),
          explain: `△ECD에서 ∠EDC = 180° − (${e}° + ${v.f}°) = ${v.x}°이다. ∠BDC와 ∠BAC는 모두 호 BC에 대한 원주각이므로 ∠${X} = ∠BDC = ${v.x}°이다.`,
          facts: { calc: [[`180-${e}-${v.f}`, 0]], unseen: [180] }
        });
      }
      // 호 DC(아래, = 2a), 호 AB(위, = 2y). ∠DEC = a + y
      const v = d.until(() => { const a = d.int(30, 54), y = d.int(18, 40), s2 = d.int(50, 110); return { a, y, s2, s1: 360 - 2 * a - 2 * y - s2 }; }, (w) => w.s1 >= 50 && w.s1 <= 110 && Math.abs(w.a - w.y) >= 6);
      const turn = d.int(-8, 8), aD = 270 - v.a + turn, aC = 270 + v.a + turn, aB = aC + v.s2, aA = aB + 2 * v.y, e = v.a + v.y;
      const S = Circ().on({ A: aA, B: aB, C: aC, D: aD });
      S.put({ E: meet(S.P.A, S.P.C, S.P.B, S.P.D) }).seg('AD AC BD BC').ang('DAC', deg(v.a)).ang('DEC', deg(e), { r: 12 }).ang('DBC', sv('x'), { square: false }).ang('ACB', sv('y'), { square: false }).names();
      sure(angOf(S, 'DBC'), v.a); sure(angOf(S, 'ACB'), v.y); sure(angOf(S, 'DEC'), e);
      return degs(`그림과 같이 원 위의 네 점 A, B, C, D에 대하여 두 현 AC, BD의 교점을 E라 하자. ∠DAC = ${v.a}°, ∠DEC = ${e}°일 때, ∠${X}와 ∠${Y}의 크기를 차례로 구하시오.`, [['∠x', v.a], ['∠y', v.y]], {
        figure: S.svg(`원 위에 네 점 A, B, C, D가 있다. 현 AD, AC, BD, BC가 그어져 있고 현 AC와 현 BD가 점 E에서 만난다. ∠DAC = ${v.a}°, ∠DEC = ${e}°, ∠DBC = x, ∠ACB = y`),
        explain: `∠DBC와 ∠DAC는 모두 호 DC에 대한 원주각이므로 ∠${X} = ${v.a}°이다. ∠DEC는 △EBC의 외각이므로 ∠DEC = ∠${X} + ∠${Y}이고, ∠${Y} = ${e}° − ${v.a}° = ${v.y}°이다.`,
        facts: { calc: [[`${v.a}`, 0], [`${e}-${v.a}`, 1]] }
      });
    }, { count: 2 }),
    T('central-split', '나누어진 호의 원주각과 중심각', '①6', (d, n) => {
      if (n === 0) {
        const v = d.until(() => ({ p: d.int(18, 40), q: d.int(18, 40) }), (w) => w.p + w.q <= 78 && w.p + w.q >= 46 && Math.abs(w.p - w.q) >= 4), turn = d.int(-8, 8);
        const aB = 270 - (v.p + v.q) + turn, aC = aB + 2 * v.p, aD = aC + 2 * v.q, x = 2 * (v.p + v.q);
        const S = Circ().center().on({ B: aB, C: aC, D: aD, P: 90 + d.int(38, 62) + turn, Q: 90 - d.int(38, 62) + turn }).seg('PB PC QC QD OB OD').ang('BPC', deg(v.p)).ang('CQD', deg(v.q)).ang('BOD', sv('x'), { square: false }).names();
        sure(angOf(S, 'BOD'), x); sure(angOf(S, 'BPC'), v.p); sure(angOf(S, 'CQD'), v.q);
        return degQ(`그림과 같이 원 O 위의 다섯 점 B, C, D, P, Q에 대하여 ∠BPC = ${v.p}°, ∠CQD = ${v.q}°일 때, ∠${X}의 크기는?`, x, {
          figure: S.svg(`원 O 위에 다섯 점 B, C, D, P, Q가 있다. 점 C는 호 BD 위에 있다. 현 PB, PC, QC, QD와 반지름 OB, OD가 그어져 있다. ∠BPC = ${v.p}°, ∠CQD = ${v.q}°, ∠BOD = x`),
          explain: `한 호에 대한 중심각의 크기는 원주각의 크기의 2배이므로 ∠BOC = 2 × ${v.p}° = ${2 * v.p}°, ∠COD = 2 × ${v.q}° = ${2 * v.q}°이다. ∠${X} = ${2 * v.p}° + ${2 * v.q}° = ${x}°이다.`,
          facts: { calc: [[`2*(${v.p}+${v.q})`, 0]], unseen: [2] }
        });
      }
      const v = d.until(() => ({ c: even(d, 100, 150), q: d.int(16, 50) }), (w) => w.c / 2 - w.q >= 16 && Math.abs(w.c / 2 - 2 * w.q) >= 4), turn = d.int(-8, 8), x = v.c / 2 - v.q;
      const aA = 270 - v.c / 2 + turn, aC = 270 + v.c / 2 + turn, aB = aC - 2 * v.q;
      const S = Circ().center().on({ A: aA, B: aB, C: aC, P: 90 + d.int(30, 55) + turn, Q: 90 - d.int(30, 55) + turn }).seg('OA OC QB QC PA PB').ang('AOC', deg(v.c), { r: 12 }).ang('BQC', deg(v.q)).ang('APB', sv('x'), { square: false }).names();
      sure(angOf(S, 'APB'), x); sure(angOf(S, 'AOC'), v.c); sure(angOf(S, 'BQC'), v.q);
      return degQ(`그림과 같이 원 O 위의 다섯 점 A, B, C, P, Q에 대하여 ∠AOC = ${v.c}°, ∠BQC = ${v.q}°일 때, ∠${X}의 크기는?`, x, {
        figure: S.svg(`원 O 위에 다섯 점 A, B, C, P, Q가 있다. 점 B는 ∠AOC의 안쪽에 있는 호 AC 위에 있다. 반지름 OA, OC와 현 QB, QC, PA, PB가 그어져 있다. ∠AOC = ${v.c}°, ∠BQC = ${v.q}°, ∠APB = x`),
        explain: `∠BOC = 2∠BQC = 2 × ${v.q}° = ${2 * v.q}°이므로 ∠AOB = ${v.c}° − ${2 * v.q}° = ${v.c - 2 * v.q}°이다. ∠${X}는 호 AB에 대한 원주각이므로 ${HALF} × ${v.c - 2 * v.q}° = ${x}°이다.`,
        facts: { calc: [[`(${v.c}-2*${v.q})/2`, 0]], unseen: [2] }
      });
    }, { count: 2 }),
    T('central-dart', '중심과 원 위의 세 점을 이은 모양에서 중심각', '①7', (d) => {
      const v = d.until(() => ({ a: d.int(20, 40), b: d.int(20, 40) }), (w) => w.a + w.b >= 46 && w.a + w.b <= 80 && Math.abs(w.a - w.b) >= 4), turn = d.int(-12, 12), aB = 90 + turn, x = 2 * (v.a + v.b);
      const S = Circ().center().on({ A: aB + 180 - 2 * v.a, B: aB, C: aB - 180 + 2 * v.b }).seg('BA BC OA OC').ang('OAB', deg(v.a)).ang('OCB', deg(v.b)).ang('AOC', sv('x'), { square: false }).names({ O: 90 + turn });
      sure(angOf(S, 'OAB'), v.a); sure(angOf(S, 'OCB'), v.b); sure(angOf(S, 'AOC'), x);
      return degQ(`그림과 같이 원 O 위의 세 점 A, B, C에 대하여 ∠OAB = ${v.a}°, ∠OCB = ${v.b}°일 때, ∠${X}의 크기는?`, x, {
        figure: S.svg(`원 O 위에 세 점 A, B, C가 있다. 현 BA, BC와 반지름 OA, OC가 그어져 있고 점 O는 ∠ABC의 안쪽에 있다. ∠OAB = ${v.a}°, ∠OCB = ${v.b}°, 점 B의 반대쪽으로 벌어진 ∠AOC = x`),
        explain: `반지름 OB를 그으면 ${nb(`${sg('OA')} = ${sg('OB')} = ${sg('OC')}`)}이므로 ∠OBA = ${v.a}°, ∠OBC = ${v.b}°이고 ∠ABC = ${v.a + v.b}°이다. ∠${X}는 호 AC에 대한 중심각이므로 2 × ${v.a + v.b}° = ${x}°이다.`,
        facts: { calc: [[`2*(${v.a}+${v.b})`, 0]], unseen: [2] }
      });
    }),
    T('central-kite', '중심각과 원주각이 함께 있는 사각형에서 두 각의 합', '①8', (d) => {
      const t = d.int(52, 80), turn = d.int(-8, 8), aC = 270 + turn + d.int(-12, 12), r = 180 - t;
      const S = Circ().center().on({ A: 90 + turn + d.int(-15, 15), B: 270 - t + turn, C: aC, D: 270 + t + turn }).seg('AB AD OB OD BC DC').ang('BAD', deg(t)).ang('OBC', sv('x'), { square: false }).ang('ODC', sv('y'), { square: false }).names({ O: 90 + turn });
      sure(angOf(S, 'BAD'), t); sure(angOf(S, 'OBC') + angOf(S, 'ODC'), r);
      return degQ(`그림과 같이 원 O 위의 네 점 A, B, C, D에 대하여 ∠BAD = ${t}°일 때, ∠${X} + ∠${Y}의 크기는?`, r, {
        figure: S.svg(`원 O 위에 네 점 A, B, C, D가 있다. 현 AB, AD, BC, DC와 반지름 OB, OD가 그어져 있다. 점 C는 점 A와 마주 보는 호 BD 위에 있다. ∠BAD = ${t}°, ∠OBC = x, ∠ODC = y`),
        explain: `∠BOD = 2 × ${t}° = ${2 * t}°이다. ∠BCD는 점 A를 지나는 호 BAD에 대한 원주각이고 그 중심각은 360° − ${2 * t}° = ${360 - 2 * t}°이므로 ∠BCD = ${180 - t}°이다. 사각형 OBCD에서 ∠${X} + ∠${Y} = 360° − (${2 * t}° + ${180 - t}°) = ${r}°이다.`,
        facts: { calc: [[`360-2*${t}-(360-2*${t})/2`, 0]], unseen: [360, 2] }
      });
    }),
    T('central-iso', '반지름이 만드는 이등변삼각형과 원주각', '①9', (d, n) => {
      if (n === 0) {
        const c = even(d, 40, 140), turn = d.int(-15, 15), x = c / 2;
        const S = Circ().center().on({ A: 180 + turn, B: turn, C: turn + c }).seg('AB OC AC').ang('BOC', deg(c), { r: 12 }).ang('ACO', sv('x'), { square: false }).names();
        sure(angOf(S, 'ACO'), x);
        return degQ(`그림과 같이 선분 AB는 원 O의 지름이고 점 C는 원 위의 점이다. ∠BOC = ${c}°일 때, ∠${X}의 크기는?`, x, {
          figure: S.svg(`원 O의 지름 AB와 원 위의 점 C. 반지름 OC와 현 AC가 그어져 있다. ∠BOC = ${c}°, ∠ACO = x`),
          explain: `∠CAB는 호 BC에 대한 원주각이므로 ${HALF} × ${c}° = ${x}°이다. ${sg('OA')} = ${sg('OC')}이므로 △OAC는 이등변삼각형이고 ∠${X} = ∠OAC = ${x}°이다.`,
          facts: { calc: [[`${c}/2`, 0]], unseen: [2] }
        });
      }
      const b = d.int(15, 40), turn = d.int(-10, 10), x = 4 * b;
      const S = Circ().center().on({ A: 90 + turn, B: 270 - 2 * b + turn, C: 270 + 2 * b + turn }).seg('AB AC BC OB OC').tick('AB AC').ang('ABO', deg(b)).ang('BOC', sv('x'), { square: false }).names({ O: 90 + turn });
      sure(angOf(S, 'ABO'), b); sure(angOf(S, 'BOC'), x);
      return degQ(`그림과 같이 △ABC는 원 O에 내접하고 ${sg('AB')} = ${sg('AC')}이다. ∠ABO = ${b}°일 때, ∠${X}의 크기는?`, x, {
        figure: S.svg(`원 O에 내접하는 삼각형 ABC. 변 AB와 변 AC에 길이가 같다는 표시가 있다. 반지름 OB, OC가 그어져 있다. ∠ABO = ${b}°, ∠BOC = x`),
        explain: `반지름 OA를 그으면 ${sg('OA')} = ${sg('OB')}이므로 ∠OAB = ${b}°이다. △OAB ≡ △OAC(SSS 합동)이므로 ∠OAC = ${b}°이고 ∠BAC = ${2 * b}°이다. ∠${X}는 호 BC에 대한 중심각이므로 2 × ${2 * b}° = ${x}°이다.`,
        facts: { calc: [[`2*2*${b}`, 0]], unseen: [2] }
      });
    }, { count: 2 }),
    T('central-tangent', '접선과 반지름이 수직임을 써서 원주각 구하기', '①10', (d) => {
      const p = even(d, 30, 50), aT = 90 + p, R = 74, x = (90 + p) / 2;
      const S = Circ(R).center().on({ A: 180, B: 0, T: aT, C: d.int(236, 300) });
      S.put({ P: [-R / Math.cos((90 - p) * RAD), 0] }).seg('PB OT CT CB').ray('PT', 22).right('OTP').ang('BPT', deg(p), { side: 1, far: 0 }).ang('TCB', sv('x'), { square: false }).names();
      sure(angOf(S, 'OTP'), 90); sure(angOf(S, 'BPT'), p); sure(angOf(S, 'TCB'), x);
      return degQ(`그림에서 직선 PT는 원 O의 접선이고 점 T는 접점이다. 지름 AB의 연장선이 점 P를 지나고 ∠APT = ${p}°일 때, ∠${X}의 크기는?`, x, {
        figure: S.svg(`원 O의 지름 AB의 연장선 위의 점 P에서 원 O에 그은 접선 PT. 반지름 OT, 현 CT, CB가 그어져 있고 점 C는 직선 AB에 대하여 점 T의 반대쪽에 있다. ∠OTP에 직각 표시가 있다. ∠APT = ${p}°, ∠TCB = x`),
        explain: `원의 접선은 접점을 지나는 반지름에 수직이므로 ∠OTP = 90°이고, △OTP에서 ∠TOP = 90° − ${p}° = ${90 - p}°이다. ∠BOT = 180° − ${90 - p}° = ${90 + p}°이므로 ∠${X} = ${HALF} × ${90 + p}° = ${x}°이다.`,
        facts: { calc: [[`(180-(90-${p}))/2`, 0]], unseen: [180, 90, 2] }
      });
    }),
    T('central-area', '원주각으로 반지름과 현이 이루는 삼각형의 넓이 구하기', '①11', (d) => {
      const r = d.pick([4, 6, 8, 10]), t = d.pick([30, 60]), k = (r / 2) * (r / 2), turn = d.int(-10, 10);
      // 반지름 OA의 길이 글은 삼각형 OAB 바깥(OA와 현 CA 사이)에 적는다: 점 C를 A 쪽으로 당겨 그 틈을 넓힌다.
      const S = Circ(96).center().on({ C: 90 + turn + d.int(8, 26), A: 270 - t + turn, B: 270 + t + turn });
      S.b.poly([S.O, S.P.A, S.P.B], TINT);
      S.seg('CA CB OA OB AB').ang('ACB', deg(t)).names().lenText(S.O, S.P.A, `${r} cm`, S.P.B);
      sure(angOf(S, 'ACB'), t);
      const why = t === 60
        ? `∠AOB = 2 × 60° = 120°이다. 점 O에서 ${sg('AB')}에 수선 OH를 그으면 ∠AOH = 60°이므로 ${sg('OH')} = ${HALF} × ${r} = ${r / 2}(cm), ${sg('AH')} = ${r / 2}${rt(3)} cm이고 ${sg('AB')} = ${r}${rt(3)} cm이다. 넓이는 ${HALF} × ${r}${rt(3)} × ${r / 2} = ${k}${rt(3)}(cm²)이다.`
        : `∠AOB = 2 × 30° = 60°이고 ${sg('OA')} = ${sg('OB')}이므로 △OAB는 한 변의 길이가 ${r} cm인 정삼각형이다. 높이는 ${r / 2}${rt(3)} cm이므로 넓이는 ${HALF} × ${r} × ${r / 2}${rt(3)} = ${k}${rt(3)}(cm²)이다.`;
      return radQ(`그림과 같이 원 O에서 ${sg('OA')} = ${r} cm, ∠ACB = ${t}°일 때, 색칠한 △OAB의 넓이는?`, k, 3, 'cm²', {
        figure: S.svg(`원 O 위에 세 점 A, B, C가 있다. 현 CA, CB, AB와 반지름 OA, OB가 그어져 있고 삼각형 OAB가 색칠되어 있다. 반지름 OA의 길이는 ${r} cm, ∠ACB = ${t}°`),
        explain: why, facts: { calc: [[`(${r}/2)*(${r}/2)`, 0], ['3', 1]], unseen: [2, 3] }
      });
    }),
    T('central-proof', '원의 중심이 원주각의 바깥에 있을 때 설명의 빈칸', '①13', (d) => {
      const c = even(d, 70, 110), turn = d.int(-8, 8), aA = 250 + turn, aB = aA + c, aP = aB + d.int(14, 26);
      const S = Circ().center().on({ A: aA, B: aB, P: aP, R: aP + 180 }).seg('PA PB OA OB').seg('PR', 'cut').names();
      const right = '∠RPA, ∠ROA', wrongs = ['∠RPA, ∠AOB', '∠APB, ∠ROA', '∠RPB, ∠ROB'];
      return pickOne(d, `다음은 원 O에서 중심 O가 ∠APB의 바깥에 있을 때 ∠APB = ${HALF}∠AOB임을 설명한 것이다. ㈎, ㈏에 알맞은 것을 차례로 나열한 것은?`, right, wrongs, {
        figure: S.svg('원 O 위에 세 점 A, B, P가 있고 원의 중심 O는 ∠APB의 바깥에 있다. 현 PA, PB와 반지름 OA, OB가 그어져 있고 지름 PR이 점선으로 그어져 있다') + lines([
          '지름 PR를 그으면 중심이 각의 한 변 위에 있는 경우에 의하여',
          `∠APB = ∠RPB − ㈎ = ${HALF}(∠ROB − ㈏) = ${HALF}∠AOB`
        ]),
        explain: `∠RPB는 호 RB에 대한 원주각이고 ∠RPA는 호 RA에 대한 원주각이다. 한 변이 지름인 원주각은 중심각의 ${HALF}이므로 ∠RPB = ${HALF}∠ROB, ∠RPA = ${HALF}∠ROA이고 ∠APB = ∠RPB − ∠RPA = ${HALF}(∠ROB − ∠ROA) = ${HALF}∠AOB이다.`
      });
    })
  ];

  // ── 묶음: 반원에 대한 원주각 ──
  // 점 p 에서 직선 ab 에 내린 수선의 발
  const foot = (p, a, b) => { const ux = b[0] - a[0], uy = b[1] - a[1], t = ((p[0] - a[0]) * ux + (p[1] - a[1]) * uy) / (ux * ux + uy * uy); return [a[0] + ux * t, a[1] + uy * t]; };
  const types2 = [
    T('semi-right', '반원에 대한 원주각으로 직각삼각형의 나머지 각 구하기', '①14', (d) => {
      const a = d.int(24, 66), turn = d.int(-12, 12), x = 90 - a;
      const S = Circ().center().on({ A: 180 + turn, B: turn, C: turn + 2 * a }).seg('AB AC BC').ang('CAB', deg(a)).ang('ABC', sv('x'), { square: false }).names();
      sure(angOf(S, 'ACB'), 90); sure(angOf(S, 'ABC'), x);
      return degQ(`그림과 같이 선분 AB는 원 O의 지름이고 점 C는 원 위의 점이다. ∠CAB = ${a}°일 때, ∠${X}의 크기는?`, x, {
        figure: S.svg(`원 O의 지름 AB와 원 위의 점 C. 현 AC, BC가 그어져 있다. ∠CAB = ${a}°, ∠ABC = x`),
        explain: `∠ACB는 반원에 대한 원주각이므로 90°이다. △ABC에서 ∠${X} = 180° − (90° + ${a}°) = ${x}°이다.`,
        facts: { calc: [[`180-90-${a}`, 0]], unseen: [180, 90] }
      });
    }),
    T('semi-same', '지름 위의 원주각과 같은 호에 대한 원주각', '①15', (d, n) => {
      if (n === 0) {
        const a = d.int(22, 58), turn = d.int(-10, 10), x = 90 - a;
        const S = Circ().center().on({ A: 180 + turn, B: turn, C: turn + 2 * a, D: 180 + turn + d.int(50, 130) }).seg('AB AC BC AD DC').ang('CAB', deg(a)).ang('ADC', sv('x'), { square: false }).names();
        sure(angOf(S, 'ADC'), x); sure(angOf(S, 'ACB'), 90);
        return degQ(`그림과 같이 선분 AB는 원 O의 지름이고 두 점 C, D는 원 위의 점이다. ∠CAB = ${a}°일 때, ∠${X}의 크기는?`, x, {
          figure: S.svg(`원 O의 지름 AB와 원 위의 두 점 C, D. 점 C와 점 D는 지름 AB의 서로 다른 쪽에 있다. 현 AC, BC, AD, DC가 그어져 있다. ∠CAB = ${a}°, ∠ADC = x`),
          explain: `∠ACB는 반원에 대한 원주각이므로 90°이고 ∠ABC = 90° − ${a}° = ${x}°이다. ∠ADC와 ∠ABC는 모두 호 AC에 대한 원주각이므로 ∠${X} = ${x}°이다.`,
          facts: { calc: [[`90-${a}`, 0]], unseen: [90] }
        });
      }
      const a = d.int(22, 60), turn = d.int(-10, 10), x = 90 - a;
      const S = Circ().center().on({ B: 180 + turn, D: turn, A: 180 - 2 * a + turn, C: 270 + turn + d.int(-25, 25) }).seg('BD DA AB CB CD CA').ang('ADB', deg(a)).ang('ACD', sv('x'), { square: false }).names();
      sure(angOf(S, 'ACD'), x); sure(angOf(S, 'ACB'), a);
      return degQ(`그림과 같이 선분 BD는 원 O의 지름이고 두 점 A, C는 원 위의 점이다. ∠ADB = ${a}°일 때, ∠${X}의 크기는?`, x, {
        figure: S.svg(`원 O의 지름 BD와 원 위의 두 점 A, C. 점 A와 점 C는 지름 BD의 서로 다른 쪽에 있다. 현 DA, AB, CB, CD, CA가 그어져 있다. ∠ADB = ${a}°, ∠ACD = x`),
        explain: `∠ACB와 ∠ADB는 모두 호 AB에 대한 원주각이므로 ∠ACB = ${a}°이다. ∠BCD는 반원에 대한 원주각이므로 90°이고 ∠${X} = 90° − ${a}° = ${x}°이다.`,
        facts: { calc: [[`90-${a}`, 0]], unseen: [90] }
      });
    }, { count: 2 }),
    T('semi-iso', '지름 위의 원주각과 반지름이 만드는 이등변삼각형', '①16', (d) => {
      const a = d.int(22, 60), turn = d.int(-10, 10), x = 90 - a;
      const S = Circ().center().on({ A: 180 + turn, B: turn, P: turn + 2 * a }).seg('AB PA PB PO').ang('PAB', deg(a)).ang('OPB', sv('x'), { square: false }).names();
      sure(angOf(S, 'OPB'), x);
      return degQ(`그림과 같이 선분 AB는 원 O의 지름이고 반지름 OP를 그었다. ∠PAB = ${a}°일 때, ∠${X}의 크기는?`, x, {
        figure: S.svg(`원 O의 지름 AB와 원 위의 점 P. 현 PA, PB와 반지름 OP가 그어져 있다. ∠PAB = ${a}°, ∠OPB = x`),
        explain: `∠APB는 반원에 대한 원주각이므로 90°이고 ∠PBA = 90° − ${a}° = ${x}°이다. ${sg('OP')} = ${sg('OB')}이므로 △OPB는 이등변삼각형이고 ∠${X} = ∠OBP = ${x}°이다.`,
        facts: { calc: [[`90-${a}`, 0]], unseen: [90] }
      });
    }),
    T('semi-mid', '지름과 호의 중점', '①17 심1·5', (d, n) => {
      if (n === 0) {
        const s = d.int(10, 22), turn = d.int(-10, 10), x = 90 - 2 * s;
        const S = Circ().center().on({ A: 180 + turn, B: turn, D: turn + 2 * s, C: turn + 4 * s }).seg('AB AC BC AD').arcTick(turn, turn + 2 * s).arcTick(turn + 2 * s, turn + 4 * s).ang('DAB', deg(s)).ang('ABC', sv('x'), { square: false }).names();
        sure(angOf(S, 'DAB'), s); sure(angOf(S, 'ABC'), x);
        return degQ(`그림과 같이 선분 AB는 원 O의 지름이고 점 D는 호 BC의 중점이다. ∠DAB = ${s}°일 때, ∠${X}의 크기는?`, x, {
          figure: S.svg(`원 O의 지름 AB와 원 위의 두 점 C, D. 점 D는 호 BC 위에 있고 호 BD와 호 DC에 길이가 같다는 표시가 있다. 현 AC, BC, AD가 그어져 있다. ∠DAB = ${s}°, ∠ABC = x`),
          explain: `호 BD와 호 DC의 길이가 같으므로 ∠CAD = ∠DAB = ${s}°이고 ∠CAB = ${2 * s}°이다. ∠ACB는 반원에 대한 원주각이므로 90°이고 ∠${X} = 90° − ${2 * s}° = ${x}°이다.`,
          facts: { calc: [[`90-2*${s}`, 0]], unseen: [90, 2] }
        });
      }
      const s = d.int(12, 28), turn = d.int(-10, 10), x = 90 - 2 * s;
      const S = Circ(98).center().on({ A: 180 + turn, B: turn, C: 180 - 2 * s + turn, D: 180 - 4 * s + turn }).seg('AB BC BD AD CD').arcTick(180 - 2 * s + turn, 180 + turn).arcTick(180 - 4 * s + turn, 180 - 2 * s + turn).ang('ABC', deg(s)).ang('BCD', sv('x'), { square: false }).names();
      sure(angOf(S, 'ABC'), s); sure(angOf(S, 'BCD'), x);
      return degQ(`그림과 같이 선분 AB는 원 O의 지름이고 호 AC와 호 CD의 길이가 같다. ∠ABC = ${s}°일 때, ∠${X}의 크기는?`, x, {
        figure: S.svg(`원 O의 지름 AB와 원 위의 두 점 C, D. 점 C, D는 점 A에서 이 차례로 놓여 있고 호 AC와 호 CD에 길이가 같다는 표시가 있다. 현 BC, BD, AD, CD가 그어져 있다. ∠ABC = ${s}°, ∠BCD = x`),
        explain: `호 AC와 호 CD의 길이가 같으므로 ∠CBD = ∠ABC = ${s}°이고 ∠ABD = ${2 * s}°이다. ∠ADB는 반원에 대한 원주각이므로 90°이고 ∠BAD = 90° − ${2 * s}° = ${x}°이다. ∠BCD와 ∠BAD는 모두 호 BD에 대한 원주각이므로 ∠${X} = ${x}°이다.`,
        facts: { calc: [[`90-2*${s}`, 0]], unseen: [90, 2] }
      });
    }, { count: 2 }),
    T('semi-central', '지름 위의 원주각과 중심각을 모으기', '①18', (d) => {
      const c = even(d, 40, 104), turn = d.int(-10, 10), x = 90 + c / 2;
      const S = Circ().center().on({ B: 180 + turn, C: turn, D: turn + c, A: turn + c + d.int(28, Math.max(28, 160 - c)) }).seg('BC AB AC AD OD').ang('COD', deg(c), { r: 12 }).ang('BAD', sv('x'), { square: false }).names();
      sure(angOf(S, 'BAD'), x); sure(angOf(S, 'COD'), c);
      return degQ(`그림과 같이 선분 BC는 원 O의 지름이고 두 점 A, D는 원 위의 점이다. ∠COD = ${c}°일 때, ∠${X}의 크기는?`, x, {
        figure: S.svg(`원 O의 지름 BC와 원 위의 두 점 A, D. 점 A와 점 D는 지름 BC의 같은 쪽에 있고 점 D는 호 AC 위에 있다. 현 AB, AC, AD와 반지름 OD가 그어져 있다. ∠COD = ${c}°, ∠BAD = x`),
        explain: `∠BAC는 반원에 대한 원주각이므로 90°이다. ∠CAD는 호 CD에 대한 원주각이므로 ${HALF} × ${c}° = ${c / 2}°이다. ∠${X} = 90° + ${c / 2}° = ${x}°이다.`,
        facts: { calc: [[`90+${c}/2`, 0]], unseen: [90, 2] }
      });
    }),
    T('semi-outside', '지름의 양 끝과 원 밖의 한 점을 이은 선분', '①19', (d) => {
      const R = 62, v = d.until(() => { const g = d.int(50, 72), al = d.int(56, 80); return { g, al, be: 180 - g - al }; }, (w) => w.be >= 56 && w.be <= 80 && Math.abs(w.al - w.be) >= 4);
      const S = Circ(R).center().on({ A: 180, B: 0 });
      const pC = meet(S.P.A, at(S.P.A, 10, v.al), S.P.B, at(S.P.B, 10, 180 - v.be));
      S.put({ C: pC, D: foot(S.P.B, S.P.A, pC), E: foot(S.P.A, S.P.B, pC) }).seg('AB CA CB OD OE').ang('DOE', deg(180 - 2 * v.g), { r: 12 }).ang('ACB', sv('x'), { square: false }).names();
      const c = 180 - 2 * v.g;
      sure(angOf(S, 'DOE'), c); sure(angOf(S, 'ACB'), v.g); sure(dist(S.O, S.P.D), R); sure(dist(S.O, S.P.E), R);
      return degQ(`그림과 같이 선분 AB는 원 O의 지름이고, 원 밖의 점 C에 대하여 선분 CA, CB가 원과 만나는 점을 각각 D, E라 하자. ∠DOE = ${c}°일 때, ∠${X}의 크기는?`, v.g, {
        figure: S.svg(`원 O의 지름 AB와 원 밖의 점 C. 선분 CA가 원과 점 D에서, 선분 CB가 원과 점 E에서 만난다. 반지름 OD, OE가 그어져 있다. ∠DOE = ${c}°, ∠ACB = x`),
        explain: `선분 AE를 그으면 ∠DAE는 호 DE에 대한 원주각이므로 ${HALF} × ${c}° = ${c / 2}°이다. ∠AEB는 반원에 대한 원주각이므로 90°이고 ∠AEC = 90°이다. △AEC에서 ∠${X} = 180° − (${c / 2}° + 90°) = ${v.g}°이다.`,
        facts: { calc: [[`180-${c}/2-90`, 0]], unseen: [180, 2, 90] }
      });
    })
  ];

  // ── 묶음: 원주각의 크기와 호의 길이 ──
  const DIG = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
  const rgon = (n) => '정' + (n >= 10 ? (n >= 20 ? DIG[Math.floor(n / 10)] : '') + '십' : '') + DIG[n % 10] + '각형';
  // 호 AB(오른쪽)와 호 CD(아래)와 그 원주각의 꼭짓점 P(왼쪽), Q(위)
  function twoArcs(d, a, b) {
    const turn = d.int(-10, 10), S = Circ().on({ A: -a + turn, B: a + turn, C: 270 - b + turn, D: 270 + b + turn, P: 180 + turn + d.int(-14, 14), Q: 90 + turn + d.int(-14, 14) }).seg('PA PB QC QD');
    return { S, turn };
  }
  const types3 = [
    T('arc-same-angle', '길이가 같은 호에 대한 원주각', '①21', (d) => {
      const a = d.int(20, 38), k = d.int(3, 9), { S, turn } = twoArcs(d, a, a);
      S.arcDim(-a + turn, a + turn, `${k} cm`).arcDim(270 - a + turn, 270 + a + turn, `${k} cm`).ang('APB', deg(a)).ang('CQD', sv('x'), { square: false }).names();
      sure(angOf(S, 'CQD'), a);
      return degQ(`그림과 같이 원에서 호 AB와 호 CD의 길이가 모두 ${k} cm이고 ∠APB = ${a}°일 때, ∠${X}의 크기는?`, a, {
        figure: S.svg(`원 위에 여섯 점 A, B, C, D, P, Q가 있다. 현 PA, PB, QC, QD가 그어져 있다. 호 AB와 호 CD의 길이는 모두 ${k} cm이다. ∠APB = ${a}°, ∠CQD = x`),
        explain: `한 원에서 길이가 같은 호에 대한 원주각의 크기는 같다. 호 AB와 호 CD의 길이가 같으므로 ∠${X} = ∠APB = ${a}°이다.`,
        facts: { calc: [[`${a}`, 0]] }
      });
    }),
    T('arc-same-length', '크기가 같은 원주각에 대한 호의 길이', '①22', (d, n) => {
      if (n === 0) {
        const a = d.int(20, 38), k = d.int(3, 9), { S, turn } = twoArcs(d, a, a);
        S.arcDim(-a + turn, a + turn, `${k} cm`).arcDim(270 - a + turn, 270 + a + turn, `${sv('x')} cm`).ang('APB', deg(a)).ang('CQD', deg(a)).names();
        sure(angOf(S, 'CQD'), a);
        return N(`그림과 같이 원에서 ∠APB = ∠CQD = ${a}°이고 호 AB의 길이가 ${k} cm일 때, ${X}의 값은? (단, 호 CD의 길이는 ${X} cm이다.)`, k, {
          figure: S.svg(`원 위에 여섯 점 A, B, C, D, P, Q가 있다. 현 PA, PB, QC, QD가 그어져 있다. ∠APB = ${a}°, ∠CQD = ${a}°, 호 AB의 길이는 ${k} cm, 호 CD의 길이는 x cm`),
          explain: `한 원에서 크기가 같은 원주각에 대한 호의 길이는 같다. ∠APB = ∠CQD이므로 호 CD의 길이는 호 AB의 길이와 같은 ${k} cm이고 ${X} = ${k}이다.`,
          facts: { calc: [[`${k}`, 0]] }
        });
      }
      const a = d.int(22, 36), k = d.int(3, 9), turn = d.int(-10, 10);
      const S = Circ().center().on({ A: 90 + turn, C: 270 + turn, B: 270 - 2 * a + turn, D: 270 + 2 * a + turn }).seg('AB AC AD CD').arcDim(270 - 2 * a + turn, 270 + turn, `${sv('x')} cm`, 9).arcDim(270 + turn, 270 + 2 * a + turn, `${k} cm`, 9).ang('BAC', deg(a)).ang('ACD', deg(90 - a)).names();
      sure(angOf(S, 'BAC'), a); sure(angOf(S, 'ACD'), 90 - a); sure(angOf(S, 'CAD'), a);
      return N(`그림과 같이 선분 AC는 원 O의 지름이고 ∠BAC = ${a}°, ∠ACD = ${90 - a}°, 호 CD의 길이가 ${k} cm일 때, ${X}의 값은? (단, 호 BC의 길이는 ${X} cm이다.)`, k, {
        figure: S.svg(`원 O의 지름 AC와 원 위의 두 점 B, D. 점 B와 점 D는 지름 AC의 서로 다른 쪽에 있다. 현 AB, AD, CD가 그어져 있다. ∠BAC = ${a}°, ∠ACD = ${90 - a}°, 호 BC의 길이는 x cm, 호 CD의 길이는 ${k} cm`),
        explain: `∠ADC는 반원에 대한 원주각이므로 90°이고 ∠CAD = 180° − (90° + ${90 - a}°) = ${a}°이다. ∠BAC = ∠CAD이므로 호 BC와 호 CD의 길이는 같고 ${X} = ${k}이다.`,
        facts: { calc: [[`${k}`, 0]] }
      });
    }, { count: 2 }),
    T('arc-ratio', '원주각의 크기와 호의 길이의 정비례', '①23', (d, n) => {
      const v = d.until(() => { const u = d.pick([5, 6, 7, 8, 9, 10, 12, 14]), [m, q] = d.shuffle([1, 2, 3, 4]).slice(0, 2), t = d.int(2, 5); return { a: u * m, b: u * q, k1: t * m, k2: t * q }; }, (w) => w.a >= 16 && w.b >= 16 && w.a <= 42 && w.b <= 42 && w.a + w.b <= 76 && w.k1 <= 20 && w.k2 <= 20);
      const { S, turn } = twoArcs(d, v.a, v.b);
      if (n === 0) {
        S.arcDim(-v.a + turn, v.a + turn, `${v.k1} cm`).arcDim(270 - v.b + turn, 270 + v.b + turn, `${sv('x')} cm`).ang('APB', deg(v.a)).ang('CQD', deg(v.b)).names();
        sure(angOf(S, 'APB'), v.a); sure(angOf(S, 'CQD'), v.b);
        return N(`그림과 같이 원에서 ∠APB = ${v.a}°, ∠CQD = ${v.b}°이고 호 AB의 길이가 ${v.k1} cm일 때, ${X}의 값은? (단, 호 CD의 길이는 ${X} cm이다.)`, v.k2, {
          figure: S.svg(`원 위에 여섯 점 A, B, C, D, P, Q가 있다. 현 PA, PB, QC, QD가 그어져 있다. ∠APB = ${v.a}°, ∠CQD = ${v.b}°, 호 AB의 길이는 ${v.k1} cm, 호 CD의 길이는 x cm`),
          explain: `한 원에서 호의 길이는 그 호에 대한 원주각의 크기에 정비례한다. ${v.a} : ${v.b} = ${v.k1} : ${X}에서 ${X} = ${v.k1} × ${frac(v.b, v.a)} = ${v.k2}이다.`,
          facts: { calc: [[`${v.k1}*${v.b}/${v.a}`, 0]] }
        });
      }
      S.arcDim(-v.a + turn, v.a + turn, `${v.k1} cm`).arcDim(270 - v.b + turn, 270 + v.b + turn, `${v.k2} cm`).ang('APB', deg(v.a)).ang('CQD', sv('x'), { square: false }).names();
      sure(angOf(S, 'CQD'), v.b);
      return degQ(`그림과 같이 원에서 호 AB, 호 CD의 길이가 각각 ${v.k1} cm, ${v.k2} cm이고 ∠APB = ${v.a}°일 때, ∠${X}의 크기는?`, v.b, {
        figure: S.svg(`원 위에 여섯 점 A, B, C, D, P, Q가 있다. 현 PA, PB, QC, QD가 그어져 있다. 호 AB의 길이는 ${v.k1} cm, 호 CD의 길이는 ${v.k2} cm, ∠APB = ${v.a}°, ∠CQD = x`),
        explain: `한 원에서 원주각의 크기는 호의 길이에 정비례한다. ${v.k1} : ${v.k2} = ${v.a}° : ∠${X}에서 ∠${X} = ${v.a}° × ${frac(v.k2, v.k1)} = ${v.b}°이다.`,
        facts: { calc: [[`${v.a}*${v.k2}/${v.k1}`, 0]] }
      });
    }, { count: 2 }),
    T('arc-two-step', '각을 먼저 구한 다음 호의 길이·각 구하기', '①24', (d, n) => {
      if (n === 0) {
        const v = d.until(() => { const u = d.pick([5, 6, 8, 10, 12, 15]), [m, q] = d.shuffle([1, 2, 3, 4, 5]).slice(0, 2), t = d.int(2, 5); return { a: u * m, b: u * q, k: t * m, x: t * q }; }, (w) => w.a >= 18 && w.b >= 18 && w.a + w.b <= 84 && w.a + w.b >= 50 && w.k <= 20 && w.x <= 25);
        const turn = d.int(-8, 8), aA = 270 - (v.a + v.b) + turn, aB = aA + 2 * v.a, aC = aB + 2 * v.b, c = 2 * (v.a + v.b);
        const S = Circ().center().on({ A: aA, B: aB, C: aC, P: 90 + turn + d.int(-15, 15) }).seg('PA PB PC OA OC').arcDim(aA, aB, `${v.k} cm`).arcDim(aB, aC, `${sv('x')} cm`).ang('APB', deg(v.a)).ang('AOC', deg(c), { r: 12 }).names();
        sure(angOf(S, 'APB'), v.a); sure(angOf(S, 'BPC'), v.b); sure(angOf(S, 'AOC'), c);
        return N(`그림과 같이 원 O에서 호 AB의 길이가 ${v.k} cm이고 ∠APB = ${v.a}°, ∠AOC = ${c}°일 때, ${X}의 값은? (단, 호 BC의 길이는 ${X} cm이다.)`, v.x, {
          figure: S.svg(`원 O 위에 네 점 A, B, C, P가 있다. 점 B는 ∠AOC의 안쪽에 있는 호 AC 위에 있다. 현 PA, PB, PC와 반지름 OA, OC가 그어져 있다. ∠APB = ${v.a}°, ∠AOC = ${c}°, 호 AB의 길이는 ${v.k} cm, 호 BC의 길이는 x cm`),
          explain: `∠APC = ${HALF} × ${c}° = ${c / 2}°이므로 ∠BPC = ${c / 2}° − ${v.a}° = ${v.b}°이다. 호의 길이는 원주각의 크기에 정비례하므로 ${v.a} : ${v.b} = ${v.k} : ${X}에서 ${X} = ${v.x}이다.`,
          facts: { calc: [[`${v.k}*(${c}/2-${v.a})/${v.a}`, 0]], unseen: [2] }
        });
      }
      if (n === 1) {
        const v = d.until(() => { const u = d.pick([5, 6, 7, 8, 9, 10]), [m, q] = d.shuffle([1, 2, 3, 4]).slice(0, 2), t = d.int(2, 5); return { a: u * m, b: u * q, k: t * m, x: t * q }; }, (w) => w.a >= 16 && w.b >= 16 && w.a <= 40 && w.b <= 44 && w.a + w.b <= 80 && w.k <= 20 && w.x <= 20);
        const turn = d.int(-8, 8), S = Circ().on({ A: 180 - v.a + turn, B: 180 + v.a + turn, C: 360 - v.b + turn, D: v.b + turn });
        S.put({ P: meet(S.P.A, S.P.C, S.P.B, S.P.D) }).seg('AD AC BD BC').arcDim(180 - v.a + turn, 180 + v.a + turn, `${v.k} cm`).arcDim(360 - v.b + turn, 360 + v.b + turn, `${sv('x')} cm`).ang('ADB', deg(v.a)).ang('CPD', deg(v.a + v.b), { r: 12 }).names();
        sure(angOf(S, 'ADB'), v.a); sure(angOf(S, 'CPD'), v.a + v.b); sure(angOf(S, 'CAD'), v.b);
        return N(`그림과 같이 원 위의 네 점 A, B, C, D에 대하여 두 현 AC, BD의 교점을 P라 하자. 호 AB의 길이가 ${v.k} cm이고 ∠ADB = ${v.a}°, ∠CPD = ${v.a + v.b}°일 때, ${X}의 값은? (단, 호 CD의 길이는 ${X} cm이다.)`, v.x, {
          figure: S.svg(`원 위에 네 점 A, B, C, D가 있다. 현 AD, AC, BD, BC가 그어져 있고 현 AC와 현 BD가 점 P에서 만난다. 호 AB의 길이는 ${v.k} cm, 호 CD의 길이는 x cm이다. ∠ADB = ${v.a}°, ∠CPD = ${v.a + v.b}°`),
          explain: `∠CPD는 △APD의 외각이므로 ∠CAD = ${v.a + v.b}° − ${v.a}° = ${v.b}°이다. 호의 길이는 원주각의 크기에 정비례하므로 ${v.a} : ${v.b} = ${v.k} : ${X}에서 ${X} = ${v.x}이다.`,
          facts: { calc: [[`${v.k}*(${v.a + v.b}-${v.a})/${v.a}`, 0]] }
        });
      }
      const v = d.pick([[60, 2, 3], [40, 2, 3], [48, 2, 3], [30, 1, 4], [50, 2, 3], [56, 2, 3], [30, 2, 5], [60, 3, 4], [72, 3, 4], [48, 3, 5], [36, 2, 5], [40, 2, 5]].filter(([c, p, q]) => (c * (q - p)) % (2 * p) === 0 && c * q / p <= 170 && c * (q - p) / (2 * p) >= 10 && c * (q - p) / (2 * p) !== c)), [c, p, q] = v, aoc = c * q / p, x = c * (q - p) / (2 * p);
      // 현 PB, PC가 중심 O 가까이 지나가면 ∠AOB의 표시와 글이 현에 덮인다: 두 현이 O에서 16 px 넘게 떨어지게 P를 고른다.
      const turn = d.int(-8, 8), aA = 270 - aoc / 2 + turn, aP = d.until(() => 90 + turn + d.int(-24, 24), (p) => [aA + c, aA + aoc].every((q) => Math.abs(Math.cos((q - p) * RAD / 2)) * 78 >= 16));
      const S = Circ().center().on({ A: aA, B: aA + c, C: aA + aoc, P: aP }).seg('OA OB PB PC').ang('AOB', deg(c), { r: 12 }).ang('BPC', sv('x'), { square: false }).names();
      sure(angOf(S, 'AOB'), c); sure(angOf(S, 'BPC'), x);
      return degQ(`그림과 같이 원 O에서 호 AB와 호 AC의 길이의 비가 ${nb(`${p} : ${q}`)}이고 ∠AOB = ${c}°일 때, ∠${X}의 크기는?`, x, {
        figure: S.svg(`원 O 위에 네 점 A, B, C, P가 있다. 점 B는 호 AC 위에 있고 점 P는 호 AC 위에 있지 않다. 반지름 OA, OB와 현 PB, PC가 그어져 있다. ∠AOB = ${c}°, ∠BPC = x`),
        explain: `호의 길이는 중심각의 크기에 정비례하므로 ∠AOC = ${c}° × ${frac(q, p)} = ${aoc}°이고 ∠BOC = ${aoc}° − ${c}° = ${aoc - c}°이다. ∠${X}는 호 BC에 대한 원주각이므로 ${HALF} × ${aoc - c}° = ${x}°이다.`,
        facts: { calc: [[`${c}*(${q}-${p})/${p}/2`, 0]], unseen: [2] }
      });
    }, { count: 3 }),
    T('arc-move', '길이가 같은 호의 중심각·원주각을 옮기기', '①25', (d, n) => {
      if (n === 0) {
        const a = d.int(22, 40), turn = d.int(-10, 10), x = 2 * a;
        const S = Circ().center().on({ A: 180 - a + turn, B: 180 + a + turn, C: 270 - a + turn + 6, D: 270 + a + turn + 6, P: 80 + turn + d.int(-12, 12) }).seg('PA PB OC OD').arcTick(180 - a + turn, 180 + a + turn).arcTick(270 - a + turn + 6, 270 + a + turn + 6).ang('APB', deg(a)).ang('COD', sv('x'), { square: false }).names();
        sure(angOf(S, 'APB'), a); sure(angOf(S, 'COD'), x);
        return degQ(`그림과 같이 원 O에서 호 AB와 호 CD의 길이가 같다. ∠APB = ${a}°일 때, 두 반지름 OC, OD가 이루는 ∠${X}의 크기는?`, x, {
          figure: S.svg(`원 O 위에 다섯 점 A, B, C, D, P가 있다. 현 PA, PB와 반지름 OC, OD가 그어져 있다. 호 AB와 호 CD에 길이가 같다는 표시가 있다. ∠APB = ${a}°, ∠COD = x`),
          explain: `호 AB에 대한 중심각의 크기는 2 × ${a}° = ${x}°이다. 한 원에서 길이가 같은 호에 대한 중심각의 크기는 같으므로 ∠${X} = ${x}°이다.`,
          facts: { calc: [[`2*${a}`, 0]], unseen: [2] }
        });
      }
      const c = d.int(30, 76), turn = d.int(-10, 10);
      const S = Circ().center().on({ A: 270 - c + turn, B: 270 + turn, C: 270 + c + turn, P: 90 + turn + d.int(-20, 20) }).seg('OB OC PA PC').arcTick(270 - c + turn, 270 + turn).arcTick(270 + turn, 270 + c + turn).ang('BOC', deg(c), { r: 12 }).ang('APC', sv('x'), { square: false }).names();
      sure(angOf(S, 'APC'), c);
      return degQ(`그림과 같이 원 O에서 호 AB와 호 BC의 길이가 같고 ∠BOC = ${c}°일 때, ∠${X}의 크기는?`, c, {
        figure: S.svg(`원 O 위에 네 점 A, B, C, P가 있다. 점 B는 호 AC 위에 있고 호 AB와 호 BC에 길이가 같다는 표시가 있다. 반지름 OB, OC와 현 PA, PC가 그어져 있다. ∠BOC = ${c}°, ∠APC = x`),
        explain: `호 AB와 호 BC의 길이가 같으므로 ∠AOB = ∠BOC = ${c}°이고 ∠AOC = ${2 * c}°이다. ∠${X}는 호 AC에 대한 원주각이므로 ${HALF} × ${2 * c}° = ${c}°이다.`,
        facts: { calc: [[`2*${c}/2`, 0]], unseen: [2] }
      });
    }, { count: 2 }),
    T('arc-three-ratio', '두 호의 길이의 비로 삼각형의 세 내각 구하기', '①26', (d) => {
      const all = [];
      for (let u = 1; u <= 7; u += 1) for (let v = 1; v <= 7; v += 1) for (let w = 1; w <= 7; w += 1) {
        const s = u + v + w;
        if (new Set([u, v, w]).size === 3 && [u, v, w].every((k) => (180 * k) % s === 0 && 180 * k / s >= 24 && 180 * k / s <= 96) && gcd(gcd(u, v), w) === 1) all.push([u, v, w]);
      }
      const [u, v, w] = d.pick(all), s = u + v + w, turn = d.int(-10, 10), g1 = gcd(u, w), g2 = gcd(v, w);
      const aB = 270 - 180 * v / s + turn, aC = 270 + 180 * v / s + turn, aA = aC + 360 * w / s;
      const S = Circ().on({ A: aA, B: aB, C: aC }).seg('AB BC CA').names();
      const A0 = 180 * v / s, B0 = 180 * w / s, C0 = 180 * u / s;
      sure(angOf(S, 'BAC'), A0); sure(angOf(S, 'ABC'), B0); sure(angOf(S, 'BCA'), C0);
      return degs(`그림과 같이 원에 내접하는 △ABC에서 호 AB와 호 CA의 길이의 비는 ${nb(`${u / g1} : ${w / g1}`)}이고, 호 BC와 호 CA의 길이의 비는 ${nb(`${v / g2} : ${w / g2}`)}이다. ∠A, ∠B, ∠C의 크기를 차례로 구하시오.`, [['∠A', A0], ['∠B', B0], ['∠C', C0]], {
        figure: S.svg('원에 내접하는 삼각형 ABC. 호 AB, 호 BC, 호 CA는 각각 나머지 한 꼭짓점을 지나지 않는 호이다'),
        explain: `두 비를 이으면 호 AB : 호 BC : 호 CA = ${nb(`${u} : ${v} : ${w}`)}이다. 각 내각은 맞은편 호에 대한 원주각이고 세 내각의 크기의 합은 180°이므로 ∠A : ∠B : ∠C = ${nb(`${v} : ${w} : ${u}`)}이다. ∠A = 180° × ${frac(v, s)} = ${A0}°, ∠B = 180° × ${frac(w, s)} = ${B0}°, ∠C = 180° × ${frac(u, s)} = ${C0}°이다.`,
        facts: { calc: [[`180*${v}/(${u}+${v}+${w})`, 0], [`180*${w}/(${u}+${v}+${w})`, 1], [`180*${u}/(${u}+${v}+${w})`, 2]], unseen: [180, u, v, w] }
      });
    }),
    T('arc-fraction', '원주의 몇 분의 1인 호와 두 현이 만나 이루는 각', '①27', (d, n) => {
      let m, q, cd;
      if (n === 0) [m, q] = d.until(() => d.shuffle([3, 4, 5, 6, 9, 10, 12]).slice(0, 2), ([x, y]) => 1 / x + 1 / y <= 0.62 && 1 / x + 1 / y >= 0.27 && 180 / x + 180 / y !== 90);
      else [m, q] = d.until(() => [d.pick([4, 5, 6, 9, 10, 12]), null], () => true);
      let pr = null;
      if (n === 1) {
        pr = d.until(() => { const a = d.int(1, 4), b = d.int(1, 5); return [a, b]; }, ([a, b]) => a !== b && gcd(a, b) === 1 && (180 * b) % (m * a) === 0 && 360 * b / (m * a) >= 30 && 360 * b / (m * a) <= 150 && 360 / m + 360 * b / (m * a) <= 220 && 180 / m + 180 * b / (m * a) !== 90);
        cd = 360 * pr[1] / (m * pr[0]);
      } else cd = 360 / q;
      const ab = 360 / m, x = (ab + cd) / 2, turn = d.int(-10, 10);
      const S = Circ().on({ A: 90 - ab / 2 + turn, B: 90 + ab / 2 + turn, C: 270 - cd / 2 + turn, D: 270 + cd / 2 + turn });
      S.b.arc(S.O, S.R, 90 - ab / 2 + turn, 90 + ab / 2 + turn, 'bold'); S.b.arc(S.O, S.R, 270 - cd / 2 + turn, 270 + cd / 2 + turn, 'bold');
      S.put({ P: meet(S.P.A, S.P.C, S.P.B, S.P.D) }).seg('AC BD').ang('APB', sv('x'), { square: false }).names();
      sure(angOf(S, 'APB'), x);
      const head = '그림과 같이 원 위의 네 점 A, B, C, D에 대하여 두 현 AC, BD의 교점을 P라 하자. ';
      const say = S.svg('원 위에 네 점 A, B, C, D가 있고 현 AC와 현 BD가 점 P에서 만난다. 호 AB와 호 CD가 굵게 그려져 있다. ∠APB = x');
      if (n === 0) return degQ(`${head}호 AB, 호 CD의 길이가 각각 원주의 ${frac(1, m)}, ${frac(1, q)}일 때, ∠${X}의 크기는?`, x, {
        figure: say,
        explain: `원주 전체에 대한 원주각의 크기는 180°이므로 ∠ACB = 180° × ${frac(1, m)} = ${ab / 2}°, ∠CBD = 180° × ${frac(1, q)} = ${cd / 2}°이다. ∠${X}는 △PBC의 외각이므로 ${ab / 2}° + ${cd / 2}° = ${x}°이다.`,
        facts: { calc: [[`180/${m}+180/${q}`, 0]], unseen: [180] }
      });
      return degQ(`${head}호 AB의 길이는 원주의 ${frac(1, m)}이고 호 AB와 호 CD의 길이의 비가 ${nb(`${pr[0]} : ${pr[1]}`)}일 때, ∠${X}의 크기는?`, x, {
        figure: say,
        explain: `∠ACB = 180° × ${frac(1, m)} = ${ab / 2}°이다. 원주각의 크기는 호의 길이에 정비례하므로 ∠CBD = ${ab / 2}° × ${frac(pr[1], pr[0])} = ${cd / 2}°이다. ∠${X}는 △PBC의 외각이므로 ${ab / 2}° + ${cd / 2}° = ${x}°이다.`,
        facts: { calc: [[`180/${m}+180/${m}*${pr[1]}/${pr[0]}`, 0]], unseen: [180] }
      });
    }, { count: 2 }),
    T('arc-ratio-in', '호의 길이의 비와 원의 안에서 만나는 두 현', '①28', (d, n) => {
      const k = d.pick([2, 3]), turn = d.int(-8, 8);
      if (n === 0) {
        const x = d.until(() => d.int(14, 30), (v) => (k + 1) * v <= 120 && (k + 1) * v >= 50), e = (k + 1) * x;
        const S = Circ().on({ D: 90 - x + turn, A: 90 + x + turn, B: 270 - k * x + turn, C: 270 + k * x + turn });
        S.put({ P: meet(S.P.A, S.P.C, S.P.B, S.P.D) }).seg('AB AC BD CD').ang('BPC', deg(e), { r: 12 }).ang('ABD', sv('x'), { square: false }).names();
        sure(angOf(S, 'BPC'), e); sure(angOf(S, 'ABD'), x);
        return degQ(`그림과 같이 원 위의 네 점 A, B, C, D에 대하여 두 현 AC, BD의 교점을 P라 하자. 호 BC의 길이가 호 AD의 길이의 ${k}배이고 ∠BPC = ${e}°일 때, ∠${X}의 크기는?`, x, {
          figure: S.svg(`원 위에 네 점 A, B, C, D가 있다. 현 AB, AC, BD, CD가 그어져 있고 현 AC와 현 BD가 점 P에서 만난다. ∠BPC = ${e}°, ∠ABD = x`),
          explain: `∠ACD = ∠ABD = ∠${X}(호 AD에 대한 원주각)이고, 호 BC의 길이가 호 AD의 길이의 ${k}배이므로 ∠BDC = ${k}∠${X}이다. ∠BPC는 △PCD의 외각이므로 ∠${X} + ${k}∠${X} = ${e}°, ∠${X} = ${x}°이다.`,
          facts: { calc: [[`${e}/(${k}+1)`, 0]], unseen: [1] }
        });
      }
      const a = d.until(() => d.int(14, 28), (v) => 180 - (k + 1) * v >= 50 && 180 - (k + 1) * v <= 120 && 180 - (k + 1) * v !== 90), x = 180 - (k + 1) * a;
      const S = Circ().on({ D: 90 - k * a + turn, A: 90 + k * a + turn, B: 270 - a + turn, C: 270 + a + turn });
      S.put({ P: meet(S.P.A, S.P.C, S.P.B, S.P.D) }).seg('AB AC BD CD').ang('BAC', deg(a)).ang('CPD', sv('x'), { square: false }).names();
      sure(angOf(S, 'BAC'), a); sure(angOf(S, 'CPD'), x);
      return degQ(`그림과 같이 원 위의 네 점 A, B, C, D에 대하여 두 현 AC, BD의 교점을 P라 하자. 호 AD의 길이가 호 BC의 길이의 ${k}배이고 ∠BAC = ${a}°일 때, ∠${X}의 크기는?`, x, {
        figure: S.svg(`원 위에 네 점 A, B, C, D가 있다. 현 AB, AC, BD, CD가 그어져 있고 현 AC와 현 BD가 점 P에서 만난다. ∠BAC = ${a}°, ∠CPD = x`),
        explain: `∠BDC = ∠BAC = ${a}°(호 BC에 대한 원주각)이고, 호 AD의 길이가 호 BC의 길이의 ${k}배이므로 ∠ACD = ${k} × ${a}° = ${k * a}°이다. △PCD에서 ∠${X} = 180° − (${a}° + ${k * a}°) = ${x}°이다.`,
        facts: { calc: [[`180-(${k}+1)*${a}`, 0]], unseen: [180, 1] }
      });
    }, { count: 2 }),
    T('arc-ratio-out', '호의 길이의 비와 원의 밖에서 만나는 두 직선', '①29', (d) => {
      const v = d.until(() => { const k = d.pick([2, 3, 4]), y = d.int(14, 30), s1 = d.int(-12, 12), s2 = d.int(-8, 8); return { k, y, s1, s2 }; }, (w) => w.k * w.y <= 100 && (w.k - 1) * w.y >= 24 && w.k * w.y + w.y <= 140 && reach(w.k * w.y + w.s1, 180 - w.y + w.s2, 360 - w.k * w.y + w.s1, 180 + w.y + w.s2) <= 2.4);
      const turn = d.int(-8, 8), S = Circ().on({ A: v.k * v.y + v.s1 + turn, B: 180 - v.y + v.s2 + turn, D: 180 + v.y + v.s2 + turn, C: 360 - v.k * v.y + v.s1 + turn });
      const pP = meet(S.P.A, S.P.B, S.P.C, S.P.D), p = (v.k - 1) * v.y, x = v.k * v.y;
      S.put({ P: pP }).seg('PA PC AD').ang('APC', deg(p)).ang('ADC', sv('x'), { square: false }).names();
      sure(angOf(S, 'APC'), p); sure(angOf(S, 'ADC'), x);
      return degQ(`그림과 같이 원 위의 네 점 A, B, C, D에 대하여 두 현 AB, CD의 연장선의 교점을 P라 하자. 호 AC의 길이가 호 BD의 길이의 ${v.k}배이고 ∠P = ${p}°일 때, ∠${X}의 크기는?`, x, {
        figure: S.svg(`원 위에 네 점 A, B, C, D가 있다. 원 밖의 점 P에서 그은 두 직선이 원과 각각 B, A와 D, C에서 만난다. 현 AD가 그어져 있다. ∠APC = ${p}°, ∠ADC = x`),
        explain: `∠BAD = ∠${Y}라 하면 호 AC의 길이가 호 BD의 길이의 ${v.k}배이므로 ∠ADC = ${v.k}∠${Y}이다. ∠ADC는 △APD의 외각이므로 ${v.k}∠${Y} = ${p}° + ∠${Y}, ∠${Y} = ${v.y}°이고 ∠${X} = ${v.k} × ${v.y}° = ${x}°이다.`,
        facts: { calc: [[`${v.k}*${p}/(${v.k}-1)`, 0]], unseen: [1] }
      });
    }),
    T('arc-mid-tri', '길이가 같은 두 호와 삼각형·내접사각형', '①31', (d, n) => {
      const turn = d.int(-8, 8);
      if (n === 0) {
        const v = d.until(() => ({ b: d.int(24, 40), c: d.int(40, 66) }), (w) => 360 - 4 * w.b - 2 * w.c >= 60 && Math.abs(w.b - w.c) >= 8), x = 180 - v.b - v.c;
        const aB = 270 - 2 * v.b + turn, aD = 270 + 2 * v.b + turn, S = Circ().on({ A: aD + 2 * v.c, B: aB, C: 270 + turn, D: aD });
        S.put({ E: at(S.P.B, 38, dirOf(S.P.C, S.P.B)) }).seg('AB BC CD DA AC BE').arcTick(aB, 270 + turn).arcTick(270 + turn, aD).ang('ACD', deg(v.c)).ang('BAC', deg(v.b)).ang('ABE', sv('x'), { square: false }).names();
        sure(angOf(S, 'ACD'), v.c); sure(angOf(S, 'BAC'), v.b); sure(angOf(S, 'ABE'), x);
        return degQ(`그림과 같이 □ABCD가 원에 내접하고 호 BC와 호 CD의 길이가 같다. 점 E는 변 CB의 연장선 위의 점이고 ∠ACD = ${v.c}°, ∠BAC = ${v.b}°일 때, ∠${X}의 크기는?`, x, {
          figure: S.svg(`원에 내접하는 사각형 ABCD와 대각선 AC. 호 BC와 호 CD에 길이가 같다는 표시가 있다. 점 E는 변 CB를 점 B 너머로 늘인 직선 위에 있다. ∠ACD = ${v.c}°, ∠BAC = ${v.b}°, ∠ABE = x`),
          explain: `호 BC와 호 CD의 길이가 같으므로 ∠CAD = ∠BAC = ${v.b}°이다. △ACD에서 ∠ADC = 180° − (${v.b}° + ${v.c}°) = ${x}°이다. 원에 내접하는 사각형의 한 외각의 크기는 그 내대각의 크기와 같으므로 ∠${X} = ∠ADC = ${x}°이다.`,
          facts: { calc: [[`180-${v.b}-${v.c}`, 0]], unseen: [180] }
        });
      }
      const v = d.until(() => ({ dd: d.int(24, 36), e: d.int(50, 76) }), (w) => { const x = 180 - 2 * w.dd - w.e; return x >= 30 && x <= 70 && 360 - 4 * w.dd - 2 * w.e >= 60; }), x = 180 - 2 * v.dd - v.e;
      const aA = 240 + turn, S = Circ().on({ A: aA, B: aA + 2 * v.dd, C: aA + 4 * v.dd, D: aA + 4 * v.dd + 2 * v.e }).seg('DA DB AC AB').arcTick(aA, aA + 2 * v.dd).arcTick(aA + 2 * v.dd, aA + 4 * v.dd).ang('ADB', deg(v.dd)).ang('DAC', deg(v.e)).ang('ABD', sv('x'), { square: false }).names();
      sure(angOf(S, 'ADB'), v.dd); sure(angOf(S, 'DAC'), v.e); sure(angOf(S, 'ABD'), x);
      return degQ(`그림과 같이 원 위의 네 점 A, B, C, D에 대하여 호 AB와 호 BC의 길이가 같다. ∠ADB = ${v.dd}°, ∠DAC = ${v.e}°일 때, ∠${X}의 크기는?`, x, {
        figure: S.svg(`원 위의 네 점 A, B, C, D. 호 AB와 호 BC에 길이가 같다는 표시가 있다. 현 DA, DB, AC, AB가 그어져 있다. ∠ADB = ${v.dd}°, ∠DAC = ${v.e}°, ∠ABD = x`),
        explain: `호 AB와 호 BC의 길이가 같으므로 ∠CAB = ∠ADB = ${v.dd}°이고 ∠DAB = ${v.e}° + ${v.dd}° = ${v.e + v.dd}°이다. △ABD에서 ∠${X} = 180° − (${v.dd}° + ${v.e + v.dd}°) = ${x}°이다.`,
        facts: { calc: [[`180-2*${v.dd}-${v.e}`, 0]], unseen: [180, 2] }
      });
    }, { count: 2 }),
    T('arc-regular', '원에 내접하는 정다각형의 두 대각선이 이루는 각', '①33', (d) => {
      const n = d.pick([5, 6, 9, 10, 12]), pairs = [];
      for (let i = 2; i <= n - 2; i += 1) for (let j = i + 1; j <= n - 2; j += 1) pairs.push([i, j]);
      const [i, j] = d.pick(pairs), L = 'ABCDEFGHIJKL', turn = 0, map = {};
      for (let k = 0; k < n; k += 1) map[L[k]] = 90 + 360 * k / n + turn;
      const S = Circ(n >= 9 ? 86 : 78).on(map), x = (j - i) * 180 / n;
      S.seg(Array.from({ length: n }, (_, k) => L[k] + L[(k + 1) % n]).join(' ')).seg(`A${L[i]} A${L[j]}`).ang(`${L[i]}A${L[j]}`, sv('x'), { square: false }).names();
      sure(angOf(S, `${L[i]}A${L[j]}`), x);
      return degQ(`그림과 같이 원에 내접하는 ${rgon(n)} ${L.slice(0, n)}에서 두 대각선 A${L[i]}, A${L[j]}가 이루는 ∠${L[i]}A${L[j]}의 크기는?`, x, {
        figure: S.svg(`원에 내접하는 ${rgon(n)} ${L.slice(0, n)}. 꼭짓점이 이 차례로 놓여 있고 대각선 A${L[i]}, A${L[j]}가 그어져 있다. ∠${L[i]}A${L[j]} = x`),
        explain: `${rgon(n)}의 변의 길이는 모두 같으므로 원을 나누는 ${n}개의 호의 길이도 모두 같다. 한 호에 대한 원주각의 크기는 180° ÷ ${n} = ${180 / n}°이고, ∠${L[i]}A${L[j]}는 호 ${j - i}개에 대한 원주각이므로 ${j - i} × ${180 / n}° = ${x}°이다.`,
        facts: { calc: [[`180*(${j}-${i})/${n}`, 0]], unseen: [180, i, j, n] }
      });
    })
  ];

  // ── 묶음: 두 직선이 원의 안·밖에서 만날 때 ──
  const types4 = [
    T('cross-in', '원의 안에서 만나는 두 현이 이루는 각', '①34', (d) => {
      const v = d.until(() => ({ p: d.int(22, 48), q: d.int(22, 48) }), (w) => Math.abs(w.p - w.q) >= 5 && w.p + w.q <= 92), turn = d.int(-8, 8), x = v.p + v.q;
      const S = Circ().on({ B: 270 - v.p + turn, C: 270 + v.p + turn, D: 90 - v.q + turn, A: 90 + v.q + turn });
      S.put({ E: meet(S.P.A, S.P.C, S.P.B, S.P.D) }).seg('AB AC BD DC').ang('BDC', deg(v.p)).ang('ABD', deg(v.q)).ang('BEC', sv('x'), { square: false }).names();
      sure(angOf(S, 'BEC'), x); sure(angOf(S, 'BDC'), v.p); sure(angOf(S, 'ABD'), v.q);
      return degQ(`그림과 같이 원 위의 네 점 A, B, C, D에 대하여 두 현 AC, BD의 교점을 E라 하자. ∠BDC = ${v.p}°, ∠ABD = ${v.q}°일 때, ∠${X}의 크기는?`, x, {
        figure: S.svg(`원 위에 네 점 A, B, C, D가 있다. 현 AB, AC, BD, DC가 그어져 있고 현 AC와 현 BD가 점 E에서 만난다. ∠BDC = ${v.p}°, ∠ABD = ${v.q}°, ∠BEC = x`),
        explain: `∠BAC와 ∠BDC는 모두 호 BC에 대한 원주각이므로 ∠BAC = ${v.p}°이다. ∠BEC는 △ABE의 외각이므로 ∠${X} = ${v.p}° + ${v.q}° = ${x}°이다.`,
        facts: { calc: [[`${v.p}+${v.q}`, 0]] }
      });
    }),
    T('cross-out', '원의 밖에서 만나는 두 직선과 중심각', '심2', (d) => {
      const v = d.until(() => ({ c1: even(d, 100, 170), c2: even(d, 24, 70), s: d.int(-10, 10) }), (w) => w.c1 - w.c2 >= 40 && w.c1 + w.c2 <= 230 && reach(w.c1 / 2 + w.s, 180 - w.c2 / 2, 360 - w.c1 / 2 + w.s, 180 + w.c2 / 2) <= 2.5), turn = d.int(-8, 8), x = (v.c1 - v.c2) / 2;
      const S = Circ().center().on({ A: v.c1 / 2 + turn + v.s, C: 360 - v.c1 / 2 + turn + v.s, B: 180 - v.c2 / 2 + turn, D: 180 + v.c2 / 2 + turn });
      const pP = meet(S.P.A, S.P.B, S.P.C, S.P.D);
      S.put({ P: pP }).seg('PA PC OA OC OB OD').ang('AOC', deg(v.c1), { r: 13 }).ang('BOD', deg(v.c2), { r: 13 }).ang('APC', sv('x'), { square: false }).names();
      sure(angOf(S, 'AOC'), v.c1); sure(angOf(S, 'BOD'), v.c2); sure(angOf(S, 'APC'), x);
      return degQ(`그림과 같이 원 O 위의 네 점 A, B, C, D에 대하여 두 현 AB, CD의 연장선의 교점을 P라 하자. ∠AOC = ${v.c1}°, ∠BOD = ${v.c2}°일 때, ∠${X}의 크기는?`, x, {
        figure: S.svg(`원 O 위에 네 점 A, B, C, D가 있다. 원 밖의 점 P에서 그은 두 직선이 원과 각각 B, A와 D, C에서 만난다. 반지름 OA, OB, OC, OD가 그어져 있다. ∠AOC = ${v.c1}°, ∠BOD = ${v.c2}°, ∠APC = x`),
        explain: `현 AD를 그으면 ∠ADC = ${HALF} × ${v.c1}° = ${v.c1 / 2}°, ∠BAD = ${HALF} × ${v.c2}° = ${v.c2 / 2}°이다. ∠ADC는 △APD의 외각이므로 ∠${X} = ${v.c1 / 2}° − ${v.c2 / 2}° = ${x}°이다.`,
        facts: { calc: [[`(${v.c1}-${v.c2})/2`, 0]], unseen: [2] }
      });
    }),
    T('cross-mix', '원의 안과 밖에서 만나는 두 쌍의 현', '①35', (d, n) => {
      const turn = d.int(-8, 8);
      if (n === 0) {
        const v = d.until(() => ({ p: d.int(40, 66), q: d.int(14, 34) }), (w) => w.p - w.q >= 16 && w.p + w.q <= 96 && reach(15 + w.p, 195 - w.q, 375 - w.p, 195 + w.q) <= 2.5);
        const S = Circ().on({ A: 195 - v.q + turn, B: 195 + v.q + turn, C: 375 - v.p + turn, D: 15 + v.p + turn });
        const pP = meet(S.P.D, S.P.A, S.P.C, S.P.B), e = v.p + v.q, x = v.p - v.q;
          S.put({ P: pP, E: meet(S.P.A, S.P.C, S.P.B, S.P.D) }).seg('PD PC AC BD').ang('DBC', deg(v.p)).ang('DEC', deg(e), { r: 12 }).ang('DPC', sv('x'), { square: false }).names();
        sure(angOf(S, 'DBC'), v.p); sure(angOf(S, 'DEC'), e); sure(angOf(S, 'DPC'), x);
        return degQ(`그림과 같이 원 위의 네 점 A, B, C, D에 대하여 두 현 AC, BD의 교점을 E, 두 현 DA, CB의 연장선의 교점을 P라 하자. ∠DBC = ${v.p}°, ∠DEC = ${e}°일 때, ∠${X}의 크기는?`, x, {
          figure: S.svg(`원 위에 네 점 A, B, C, D가 있다. 현 AC와 현 BD가 원의 안의 점 E에서 만나고, 현 DA와 현 CB를 늘인 직선이 원 밖의 점 P에서 만난다. ∠DBC = ${v.p}°, ∠DEC = ${e}°, ∠DPC = x`),
          explain: `∠DEC는 △EBC의 외각이므로 ∠ECB = ${e}° − ${v.p}° = ${v.q}°이고, ∠ADB = ∠ACB = ${v.q}°(호 AB에 대한 원주각)이다. ∠DBC는 △PBD의 외각이므로 ∠${X} = ${v.p}° − ${v.q}° = ${x}°이다.`,
          facts: { calc: [[`${v.p}-(${e}-${v.p})`, 0]] }
        });
      }
      const v = d.until(() => ({ a: d.int(18, 34), p: d.int(18, 36) }), (w) => 2 * w.a + w.p <= 120 && 2 * w.a + w.p !== 90 && w.a + w.p <= 64 && reach(180 - w.a - w.p, w.a, 180 + w.a + w.p, 360 - w.a) <= 2.5);
      const S = Circ().on({ A: 180 - v.a - v.p + turn, C: 180 + v.a + v.p + turn, D: 360 - v.a + turn, B: v.a + turn });
      const pP = meet(S.P.A, S.P.B, S.P.C, S.P.D), x = 2 * v.a + v.p;
      S.put({ P: pP, E: meet(S.P.A, S.P.D, S.P.C, S.P.B) }).seg('PA PC AD CB').ang('BAD', deg(v.a)).ang('BPD', deg(v.p)).ang('BED', sv('x'), { square: false }).names();
      sure(angOf(S, 'BAD'), v.a); sure(angOf(S, 'BPD'), v.p); sure(angOf(S, 'BED'), x);
      return degQ(`그림과 같이 원 위의 네 점 A, B, C, D에 대하여 두 현 AD, BC의 교점을 E, 두 현 AB, CD의 연장선의 교점을 P라 하자. ∠BAD = ${v.a}°, ∠BPD = ${v.p}°일 때, ∠${X}의 크기는?`, x, {
        figure: S.svg(`원 위에 네 점 A, B, C, D가 있다. 현 AD와 현 BC가 원의 안의 점 E에서 만나고, 현 AB와 현 CD를 늘인 직선이 원 밖의 점 P에서 만난다. ∠BAD = ${v.a}°, ∠BPD = ${v.p}°, ∠BED = x`),
        explain: `∠ADC는 △APD의 외각이므로 ∠ADC = ${v.a}° + ${v.p}° = ${v.a + v.p}°이고, ∠ABC = ∠ADC = ${v.a + v.p}°(호 AC에 대한 원주각)이다. ∠BED는 △ABE의 외각이므로 ∠${X} = ${v.a}° + ${v.a + v.p}° = ${x}°이다.`,
        facts: { calc: [[`2*${v.a}+${v.p}`, 0]], unseen: [2] }
      });
    }, { count: 2 }),
    T('cross-eq', '원의 안과 밖에서 만나는 두 각으로 원주각 구하기', '①36', (d) => {
      const v = d.until(() => ({ x: d.int(16, 34), y: d.int(40, 70) }), (w) => w.y - w.x >= 18 && w.x + w.y <= 96 && reach(360 - w.y, 180 + w.x, w.y, 180 - w.x) <= 2.5), turn = d.int(-8, 8), p = v.y - v.x, q = v.x + v.y;
      const S = Circ().on({ C: 180 - v.x + turn, A: 180 + v.x + turn, B: 360 - v.y + turn, D: v.y + turn });
      const pP = meet(S.P.B, S.P.A, S.P.D, S.P.C);
      S.put({ P: pP, Q: meet(S.P.A, S.P.D, S.P.B, S.P.C) }).seg('PB PD AD BC').ang('BPD', deg(p)).ang('BQD', deg(q), { r: 12 }).ang('ABC', sv('x'), { square: false }).ang('BAD', sv('y'), { square: false }).names();
      sure(angOf(S, 'BPD'), p); sure(angOf(S, 'BQD'), q); sure(angOf(S, 'ABC'), v.x); sure(angOf(S, 'BAD'), v.y);
      return degs(`그림과 같이 원 위의 네 점 A, B, C, D에 대하여 두 현 BA, DC의 연장선의 교점을 P, 두 현 AD, BC의 교점을 Q라 하자. ∠P = ${p}°, ∠BQD = ${q}°일 때, ∠${X}와 ∠${Y}의 크기를 차례로 구하시오.`, [['∠x', v.x], ['∠y', v.y]], {
        figure: S.svg(`원 위에 네 점 A, B, C, D가 있다. 현 BA와 현 DC를 늘인 직선이 원 밖의 점 P에서 만나고, 현 AD와 현 BC가 원의 안의 점 Q에서 만난다. ∠BPD = ${p}°, ∠BQD = ${q}°, ∠ABC = x, ∠BAD = y`),
        explain: `∠ADC = ∠ABC = ∠${X}(호 AC에 대한 원주각)이다. ∠BAD는 △PAD의 외각이므로 ∠${Y} = ${p}° + ∠${X}이고, ∠BQD는 △ABQ의 외각이므로 ∠${X} + ∠${Y} = ${q}°이다. 두 식에서 ∠${X} = ${v.x}°, ∠${Y} = ${v.y}°이다.`,
        facts: { calc: [[`(${q}-${p})/2`, 0], [`(${q}+${p})/2`, 1]], unseen: [2] }
      });
    }),
    T('cross-two-out', '원에 내접하는 사각형의 두 쌍의 변을 늘인 교점', '①37', (d, n) => {
      const v = d.until(() => { const da = even(d, 40, 80), cd = even(d, 40, 80), ab = even(d, 90, 150); return { da, cd, ab, bc: 360 - da - cd - ab, t: d.int(0, 359) }; }, (w) => {
        if (w.bc < 90 || w.bc > 160) return false;
        const e = (w.bc - w.da) / 2, f = (w.ab - w.cd) / 2;
        const A1 = 100, B1 = A1 + w.ab, C1 = B1 + w.bc, D1 = C1 + w.cd;
        return e >= 20 && e <= 56 && f >= 20 && f <= 56 && reach(B1, A1, C1, D1) <= 2.5 && reach(A1, D1, B1, C1) <= 2.5;
      });
      const aA = 100, S = Circ(68).on({ A: aA, B: aA + v.ab, C: aA + v.ab + v.bc, D: aA + v.ab + v.bc + v.cd });
      const pE = meet(S.P.B, S.P.A, S.P.C, S.P.D), pF = meet(S.P.A, S.P.D, S.P.B, S.P.C), e = (v.bc - v.da) / 2, f = (v.ab - v.cd) / 2, xB = (v.cd + v.da) / 2;
      if (n === 0) {
        S.put({ E: pE, F: pF }).seg('EB EC FA FB').ang('BEC', deg(e)).ang('AFB', deg(f)).ang('ABC', sv('x'), { square: false }).names();
        sure(angOf(S, 'BEC'), e); sure(angOf(S, 'AFB'), f); sure(angOf(S, 'ABC'), xB);
        return degQ(`그림과 같이 □ABCD가 원에 내접하고, 두 변 BA, CD의 연장선의 교점을 E, 두 변 AD, BC의 연장선의 교점을 F라 하자. ∠E = ${e}°, ∠F = ${f}°일 때, ∠${X}의 크기는?`, xB, {
          figure: S.svg(`원에 내접하는 사각형 ABCD. 변 BA와 변 CD를 늘인 직선이 점 E에서, 변 AD와 변 BC를 늘인 직선이 점 F에서 만난다. ∠E = ${e}°, ∠F = ${f}°, ∠ABC = x`),
          explain: `△EBC에서 ∠BCD = 180° − (${e}° + ∠${X}), △ABF에서 ∠BAD = 180° − (${f}° + ∠${X})이다. 원에 내접하는 사각형의 대각의 크기의 합은 180°이므로 (180° − ${e}° − ∠${X}) + (180° − ${f}° − ∠${X}) = 180°, ∠${X} = ${xB}°이다.`,
          facts: { calc: [[`(180-${e}-${f})/2`, 0]], unseen: [180, 2] }
        });
      }
      const xQ = f;
      S.put({ P: pE, Q: pF }).seg('PB PC QA QB').ang('ABC', deg(xB)).ang('BPC', deg(e)).ang('AQB', sv('x'), { square: false }).names();
      sure(angOf(S, 'AQB'), xQ); sure(angOf(S, 'ABC'), xB); sure(angOf(S, 'BPC'), e);
      return degQ(`그림과 같이 □ABCD가 원에 내접하고, 두 변 BA, CD의 연장선의 교점을 P, 두 변 AD, BC의 연장선의 교점을 Q라 하자. ∠ABC = ${xB}°, ∠P = ${e}°일 때, ∠${X}의 크기는?`, xQ, {
        figure: S.svg(`원에 내접하는 사각형 ABCD. 변 BA와 변 CD를 늘인 직선이 점 P에서, 변 AD와 변 BC를 늘인 직선이 점 Q에서 만난다. ∠ABC = ${xB}°, ∠P = ${e}°, ∠AQB = x`),
        explain: `△PBC에서 ∠BCD = 180° − (${xB}° + ${e}°) = ${180 - xB - e}°이다. 원에 내접하는 사각형의 대각의 크기의 합은 180°이므로 ∠BAD = ${xB + e}°이다. △ABQ에서 ∠${X} = 180° − (${xB}° + ${xB + e}°) = ${xQ}°이다.`,
        facts: { calc: [[`180-2*${xB}-${e}`, 0]], unseen: [180, 2] }
      });
    }, { count: 2 })
  ];

  B.addUnit({
    id: '9-2-4', grade: 9, semester: 2, no: 4, title: '원주각', version: 1,
    groups: [
      { id: 'central', title: '원주각과 중심각', standard: S19, types: types1 },
      { id: 'semi', title: '반원에 대한 원주각', standard: S19, types: types2 },
      { id: 'arc', title: '원주각의 크기와 호의 길이', standard: S19, types: types3 },
      { id: 'cross', title: '원의 안과 밖에서 만나는 두 직선', standard: S19, types: types4 }
    ]
  });

  B.kit.m924 = { UNIT, S19, T, retry, sourceOf, X, Y, Z, HALF, sg, deg, gcd, degQ, cmQ, degs, piQ, radQ, radPlusQ, pickOne, allQ, Circ, span, apart, even, MARK, angAt, sure, angOf, reach, foot, rgon };
})(typeof window !== 'undefined' ? window : globalThis);
