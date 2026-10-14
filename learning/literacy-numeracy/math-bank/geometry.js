// 도형 그림과 도형 판정. engine.js 다음에 불러 MathBank.kit.geo 로 쓴다.
// 좌표는 모눈 칸 단위(가로 x, 세로 y는 아래로 커진다)이고, 꼭짓점은 모두 모눈의 점 위에 둔다.
// 그래야 직각인지 아닌지를 눈대중이 아니라 정수 셈(내적이 0)으로 판정할 수 있다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const U = 22, PAD = 16;
  const at = (v) => PAD + v * U;
  const fmt = (n) => Math.round(n * 100) / 100;

  // ── 판정 ────────────────────────────────────────────────────
  const sub = (p, q) => [p[0] - q[0], p[1] - q[1]];
  const dot = (u, v) => u[0] * v[0] + u[1] * v[1];
  const cross = (u, v) => u[0] * v[1] - u[1] * v[0];
  const len2 = (u) => dot(u, u);
  // 점 v 에서 p 쪽과 q 쪽으로 벌어진 각이 직각인가
  const isRight = (v, p, q) => dot(sub(p, v), sub(q, v)) === 0;
  // 꼭짓점 i 에서의 각이 직각인가
  function rightAt(points, i) {
    const n = points.length;
    return isRight(points[i], points[(i + n - 1) % n], points[(i + 1) % n]);
  }
  const rightAngles = (points) => points.filter((_, i) => rightAt(points, i)).length;
  const isRectangle = (points) => points.length === 4 && rightAngles(points) === 4;
  const isSquare = (points) => isRectangle(points) && len2(sub(points[0], points[1])) === len2(sub(points[1], points[2]));
  const isRightTriangle = (points) => points.length === 3 && rightAngles(points) === 1;
  // 직각은 아니지만 직각처럼 보이는 각(약 76°~104°)이 있으면 눈으로 가릴 수 없어 문제로 쓰지 않는다.
  function nearRight(v, p, q) {
    const a = sub(p, v), b = sub(q, v), d = dot(a, b);
    return d !== 0 && (d * d) / (len2(a) * len2(b)) < 0.06;
  }
  const looksRight = (points) => points.some((v, i) => nearRight(v, points[(i + points.length - 1) % points.length], points[(i + 1) % points.length]));

  // ── 그리기 ──────────────────────────────────────────────────
  // grid: 'dots'(점 종이), 'lines'(모눈종이), false(바탕 없음). scale: 그림 하나만 보일 때 키워 그리는 배율(글씨도 함께 커진다)
  function board(cols, rows, parts, options) {
    const o = options || {};
    const width = PAD * 2 + cols * U, height = PAD * 2 + rows * U;
    let grid = '';
    if (o.grid === 'dots') for (let x = 0; x <= cols; x += 1) for (let y = 0; y <= rows; y += 1) grid += '<circle class="mb-grid" cx="' + at(x) + '" cy="' + at(y) + '" r="1.4"/>';
    if (o.grid === 'lines') {
      for (let x = 0; x <= cols; x += 1) grid += '<line class="mb-gridline" x1="' + at(x) + '" y1="' + at(0) + '" x2="' + at(x) + '" y2="' + at(rows) + '"/>';
      for (let y = 0; y <= rows; y += 1) grid += '<line class="mb-gridline" x1="' + at(0) + '" y1="' + at(y) + '" x2="' + at(cols) + '" y2="' + at(y) + '"/>';
    }
    return '<svg class="mb-geo" viewBox="0 0 ' + width + ' ' + height + '" width="' + Math.round(width * (o.scale || 1)) + '" role="img" aria-label="' + (o.label || '도형 그림') + '">' + grid + parts.join('') + '</svg>';
  }
  const polygon = (points, className) => '<polygon class="' + (className || 'mb-poly') + '" points="' + points.map((p) => fmt(at(p[0])) + ',' + fmt(at(p[1]))).join(' ') + '"/>';
  const polyline = (points) => '<polyline class="mb-line" fill="none" points="' + points.map((p) => fmt(at(p[0])) + ',' + fmt(at(p[1]))).join(' ') + '"/>';
  const line = (p, q, className) => '<line class="' + (className || 'mb-line') + '" x1="' + fmt(at(p[0])) + '" y1="' + fmt(at(p[1])) + '" x2="' + fmt(at(q[0])) + '" y2="' + fmt(at(q[1])) + '"/>';
  const circle = (center, radius) => '<circle class="mb-poly" cx="' + fmt(at(center[0])) + '" cy="' + fmt(at(center[1])) + '" r="' + fmt(radius * U) + '"/>';
  const point = (p) => '<circle class="mb-dot" cx="' + fmt(at(p[0])) + '" cy="' + fmt(at(p[1])) + '" r="2.8"/>';
  const text = (p, value, className) => '<text class="' + (className || 'mb-label') + '" x="' + fmt(at(p[0])) + '" y="' + fmt(at(p[1])) + '" text-anchor="middle" dominant-baseline="central">' + value + '</text>';
  // 점 q 에서, p→q 방향으로 칸 수 amount 만큼 더 나간 자리
  function beyond(p, q, amount) {
    const d = sub(q, p), size = Math.sqrt(len2(d));
    return [q[0] + (d[0] / size) * amount, q[1] + (d[1] / size) * amount];
  }
  // 선 p→q 의 옆으로 amount 만큼 비켜난 자리(이름표용)
  function beside(p, q, at0, amount) {
    const side = [-(q[1] - p[1]), q[0] - p[0]], size = Math.sqrt(len2(side));
    return [at0[0] + (side[0] / size) * amount, at0[1] + (side[1] / size) * amount];
  }
  // 이름표: 도형의 가운데에서 바깥쪽으로 조금 밀어 적는다.
  function outward(points, i, amount) {
    const cx = points.reduce((s, p) => s + p[0], 0) / points.length, cy = points.reduce((s, p) => s + p[1], 0) / points.length;
    const d = [points[i][0] - cx, points[i][1] - cy], size = Math.sqrt(len2(d)) || 1;
    return [points[i][0] + (d[0] / size) * amount, points[i][1] + (d[1] / size) * amount];
  }
  const vertexLabels = (points, names) => points.map((_, i) => text(outward(points, i, 0.6), names[i])).join('');
  // 직각 표시(작은 네모)
  function rightMark(v, p, q) {
    const a = sub(p, v), b = sub(q, v), sa = 0.4 / Math.sqrt(len2(a)), sb = 0.4 / Math.sqrt(len2(b));
    const p1 = [v[0] + a[0] * sa, v[1] + a[1] * sa], p3 = [v[0] + b[0] * sb, v[1] + b[1] * sb], p2 = [p1[0] + b[0] * sb, p1[1] + b[1] * sb];
    return '<polyline class="mb-mark" points="' + [p1, p2, p3].map((p) => fmt(at(p[0])) + ',' + fmt(at(p[1]))).join(' ') + '"/>';
  }
  // 선분·반직선·직선. 반직선 ㄱㄴ은 ㄱ에서 시작해 ㄴ 쪽으로 끝없이 간다(ㄴ을 지나 더 그린다).
  function straight(kind, p, q, names) {
    const from = kind === 'line' ? beyond(q, p, 1) : p;
    const to = kind === 'segment' ? q : beyond(p, q, 1);
    return line(from, to) + point(p) + point(q)
      + (names ? text(beside(p, q, p, 0.62), names[0]) + text(beside(p, q, q, 0.62), names[1]) : '');
  }
  // 굽은 선(곧은 선이 아닌 보기)
  function curve(p, q, names) {
    const mid = [(p[0] + q[0]) / 2 - (q[1] - p[1]) * 0.45, (p[1] + q[1]) / 2 + (q[0] - p[0]) * 0.45];
    return '<path class="mb-line" fill="none" d="M' + at(p[0]) + ' ' + at(p[1]) + ' Q' + fmt(at(mid[0])) + ' ' + fmt(at(mid[1])) + ' ' + at(q[0]) + ' ' + at(q[1]) + '"/>' + point(p) + point(q)
      + (names ? text(beside(q, p, p, 0.62), names[0]) + text(beside(q, p, q, 0.62), names[1]) : '');
  }
  // 한 점 v 에서 여러 쪽으로 뻗은 반직선. ends: 지나는 점들, names: [꼭짓점 이름, 지나는 점 이름 …]
  function rays(v, ends, names) {
    let out = '';
    ends.forEach((p, i) => { out += line(v, beyond(v, p, 0.7)) + (names ? point(p) + text(beyond(v, p, 0.42 + 0.7), names[i + 1], 'mb-label') : ''); });
    return out + point(v) + (names ? text(labelBehind(v, ends), names[0]) : '');
  }
  // 꼭짓점 이름은 반직선들이 뻗은 쪽의 반대편에 적는다.
  function labelBehind(v, ends) {
    const sum = ends.reduce((s, p) => { const d = sub(p, v), size = Math.sqrt(len2(d)); return [s[0] + d[0] / size, s[1] + d[1] / size]; }, [0, 0]);
    const size = Math.sqrt(len2(sum)) || 1;
    return [v[0] - (sum[0] / size) * 0.6, v[1] - (sum[1] / size) * 0.6];
  }
  // 이름표가 붙은 작은 그림 칸 여럿(가, 나, 다 …)
  const tile = (label, svg) => '<figure class="mb-tile"><figcaption>' + label + '</figcaption>' + svg + '</figure>';
  const tiles = (list) => '<div class="mb-tiles">' + list.map(([label, svg]) => tile(label, svg)).join('') + '</div>';

  // 시계. 긴바늘은 분, 짧은바늘은 시.
  // 시계. second 를 주면 초바늘과 작은 눈금 60개를 그리고 크게 그린다(초까지 읽는 문항).
  // 초까지 읽는 시계의 긴바늘은 교과서 그림처럼 분 눈금에 딱 맞춰 그린다.
  function clock(hour, minute, second) {
    const R = 46, C = 54, fine = second !== undefined;
    const polar = (deg, r) => [C + r * Math.sin((deg * Math.PI) / 180), C - r * Math.cos((deg * Math.PI) / 180)];
    let ticks = '';
    for (let i = 0; i < (fine ? 60 : 12); i += 1) {
      const step = fine ? 6 : 30, big = !fine || i % 5 === 0, outer = polar(i * step, R - 1), inner = polar(i * step, R - (big ? 6 : 3.5));
      ticks += '<line class="' + (big ? 'mb-tick' : 'mb-tick mb-tick-small') + '" x1="' + fmt(outer[0]) + '" y1="' + fmt(outer[1]) + '" x2="' + fmt(inner[0]) + '" y2="' + fmt(inner[1]) + '"/>';
    }
    let numbers = '';
    for (let n = 1; n <= 12; n += 1) { const p = polar(n * 30, R - 14); numbers += '<text class="mb-clock-number" x="' + fmt(p[0]) + '" y="' + fmt(p[1]) + '" text-anchor="middle" dominant-baseline="central">' + n + '</text>'; }
    const m = polar(minute * 6, R - 10), h = polar((hour % 12) * 30 + minute * 0.5, R - 24), sec = fine ? polar(second * 6, R - 5) : null;
    return '<svg class="mb-clock' + (fine ? ' mb-clock-fine' : '') + '" viewBox="0 0 108 108" width="' + (fine ? 176 : 104) + '" role="img" aria-label="시계 ' + hour + '시' + (minute ? ' ' + minute + '분' : '') + (fine ? ' ' + second + '초' : '') + '"><circle class="mb-clock-face" cx="' + C + '" cy="' + C + '" r="' + R + '"/>' + ticks + numbers
      + '<line class="mb-hand-hour" x1="' + C + '" y1="' + C + '" x2="' + fmt(h[0]) + '" y2="' + fmt(h[1]) + '"/><line class="mb-hand-minute" x1="' + C + '" y1="' + C + '" x2="' + fmt(m[0]) + '" y2="' + fmt(m[1]) + '"/>'
      + (fine ? '<line class="mb-hand-second" x1="' + C + '" y1="' + C + '" x2="' + fmt(sec[0]) + '" y2="' + fmt(sec[1]) + '"/>' : '') + '<circle class="mb-clock-pin" cx="' + C + '" cy="' + C + '" r="2.4"/></svg>';
  }

  // ── 각도(4학년) ──────────────────────────────────────────────
  // 여기서는 꼭짓점이 모눈의 점 위에 있지 않아도 된다. 방향은 오른쪽이 0°이고 시계 반대쪽으로 커진다.
  const RAD = Math.PI / 180;
  const toward = (v, r, deg) => [v[0] + r * Math.cos(deg * RAD), v[1] - r * Math.sin(deg * RAD)];
  const xy = (p) => fmt(at(p[0])) + ' ' + fmt(at(p[1]));
  // v 에서 p 를 바라보는 방향(도)
  const bearing = (v, p) => (Math.atan2(v[1] - p[1], p[0] - v[0]) / RAD + 360) % 360;
  // 호: v 를 중심으로 from° 에서 to° 까지 시계 반대쪽으로 그린다(to 가 from 보다 크다).
  function arc(v, from, to, r, className) {
    return '<path class="' + (className || 'mb-line is-thin') + '" style="fill:none" d="M' + xy(toward(v, r, from)) + 'A' + fmt(r * U) + ' ' + fmt(r * U) + ' 0 ' + (to - from > 180 ? 1 : 0) + ' 0 ' + xy(toward(v, r, to)) + '"/>';
  }
  // 직각 표시(모눈 밖의 꼭짓점에도 쓴다)
  function squareMark(v, from, to, size) {
    const s = size || 0.38, p1 = toward(v, s, from), p3 = toward(v, s, to), p2 = [p1[0] + p3[0] - v[0], p1[1] + p3[1] - v[1]];
    return '<polyline class="mb-mark" points="' + [p1, p2, p3].map((p) => fmt(at(p[0])) + ',' + fmt(at(p[1]))).join(' ') + '"/>';
  }
  // 각: 꼭짓점 v 에서 from°, to° 쪽으로 그은 두 변과 그 사이의 호.
  // options: length(변의 길이, 기본 2.6), r(호의 반지름), label(호 옆에 적는 글: '70°', '㉠'), names([from 쪽 끝, 꼭짓점, to 쪽 끝]의 이름), arc: false(호를 그리지 않는다)
  function angle(v, from, to, options) {
    const o = options || {}, len = o.length || 2.6, r = o.r || 0.75, mid = (from + to) / 2;
    let out = line(v, toward(v, len, from)) + line(v, toward(v, len, to));
    if (o.arc !== false) out += to - from === 90 ? squareMark(v, from, to) : arc(v, from, to, r);
    // 좁은 각은 두 변 사이에 글이 들어가지 않으므로 변의 끝보다 바깥쪽에 적는다.
    if (o.label) out += text(toward(v, to - from < 40 ? len + 0.6 : r + 0.6, mid), o.label, 'mb-label is-length');
    if (o.names) out += text(toward(v, len + 0.42, from), o.names[0]) + text(toward(v, 0.5, mid + 180), o.names[1]) + text(toward(v, len + 0.42, to), o.names[2]);
    return out;
  }
  // 각도기: 중심 c, 반지름 r. 밑금은 가로로 놓인다. 안쪽 눈금은 오른쪽이 0, 바깥쪽 눈금은 왼쪽이 0이다.
  // options.rays: 중심에서 그을 변의 방향(도) 배열. 변은 각도기 밖까지 나간다.
  function protractor(c, r, options) {
    const o = options || {}, small = (inner) => 'style="font-size:' + (o.font || 8.5) + 'px;font-weight:600' + (inner ? ';fill:#1d4ed8' : '') + '"';
    const label = (p, value, inner) => '<text class="mb-label" ' + small(inner) + ' x="' + fmt(at(p[0])) + '" y="' + fmt(at(p[1])) + '" text-anchor="middle" dominant-baseline="central">' + value + '</text>';
    const thin = (p, q) => '<line class="mb-line" style="stroke-width:0.8" x1="' + fmt(at(p[0])) + '" y1="' + fmt(at(p[1])) + '" x2="' + fmt(at(q[0])) + '" y2="' + fmt(at(q[1])) + '"/>';
    let out = '<path class="mb-poly" style="fill:#fff" d="M' + xy([c[0] - r, c[1]]) + 'A' + fmt(r * U) + ' ' + fmt(r * U) + ' 0 0 1 ' + xy([c[0] + r, c[1]]) + 'Z"/>';
    for (let d = 0; d <= 180; d += 5) out += thin(toward(c, r, d), toward(c, r - (d % 10 ? 0.14 : 0.26), d));
    for (let d = 0; d <= 180; d += 10) out += label(toward(c, r - 0.55, d), 180 - d) + label(toward(c, r - 1.4, d), d, true);
    out += thin([c[0], c[1]], [c[0], c[1] - 0.3]) + '<circle class="mb-dot" cx="' + fmt(at(c[0])) + '" cy="' + fmt(at(c[1])) + '" r="2"/>';
    for (const d of o.rays || []) out += line(c, toward(c, r + 0.55, d));
    return out;
  }
  // 다각형의 꼭짓점 i 에서 안쪽 각의 크기(도)
  function angleOf(points, i) {
    const n = points.length, a = bearing(points[i], points[(i + n - 1) % n]), b = bearing(points[i], points[(i + 1) % n]), d = Math.abs(a - b);
    return d > 180 ? 360 - d : d;
  }
  // 볼록한 다각형의 꼭짓점 i 안쪽에 각 표시(호나 직각 표시)와 글(label)을 넣는다.
  function cornerArc(points, i, label, r) {
    const n = points.length, a = bearing(points[i], points[(i + n - 1) % n]), b = bearing(points[i], points[(i + 1) % n]);
    let from = Math.min(a, b), to = Math.max(a, b);
    if (to - from > 180) { const t = from + 360; from = to; to = t; }
    const size = r || 0.6, right = Math.abs(to - from - 90) < 0.01;
    return (right ? squareMark(points[i], from, to) : arc(points[i], from, to, size)) + (label ? text(toward(points[i], size + (to - from < 40 ? 0.95 : 0.6), (from + to) / 2), label, 'mb-label is-length') : '');
  }
  // 밑변의 두 각이 left°, right° 인 삼각형의 세 꼭짓점 [왼쪽 아래, 오른쪽 아래, 위]. origin 은 왼쪽 아래 꼭짓점, base 는 밑변의 길이.
  function triangle(left, right, base, origin) {
    const side = base * Math.sin(right * RAD) / Math.sin((left + right) * RAD);
    return [origin, [origin[0] + base, origin[1]], toward(origin, side, left)];
  }

  // ── 평면도형의 이동 ──────────────────────────────────────────
  // 모눈판(가로 cols, 세로 rows) 위의 점들을 뒤집는다. way: 'side'(왼쪽·오른쪽으로 뒤집기), 'updown'(위·아래로 뒤집기)
  const flip = (points, cols, rows, way) => points.map((p) => (way === 'side' ? [cols - p[0], p[1]] : [p[0], rows - p[1]]));
  // 정사각형 모눈판(한 변 size) 위의 점들을 시계 방향으로 90° × quarters 만큼 돌린다(시계 반대 방향은 음수).
  function turn(points, size, quarters) {
    let out = points;
    for (let k = 0; k < ((quarters % 4) + 4) % 4; k += 1) out = out.map((p) => [size - p[1], p[0]]);
    return out;
  }
  // 꼭짓점이 놓인 자리가 모두 같은가(꼭짓점의 차례·시작점은 달라도 된다). 움직인 뒤에도 처음과 같은 모양인지 볼 때 쓴다.
  const samePoints = (a, b) => { const key = (list) => list.map((p) => fmt(p[0]) + ',' + fmt(p[1])).sort().join(' '); return key(a) === key(b); };
  // 그린 것(parts)을 통째로 뒤집거나 돌려 그린다(글자처럼 점으로 나타내기 어려운 것). way: 'side', 'updown', 1·2·3(시계 방향으로 90° × n)
  function moved(parts, cols, rows, way) {
    const cx = at(cols / 2), cy = at(rows / 2);
    const how = way === 'side' ? 'translate(' + fmt(cx * 2) + ' 0) scale(-1 1)' : way === 'updown' ? 'translate(0 ' + fmt(cy * 2) + ') scale(1 -1)' : 'rotate(' + (way * 90) + ' ' + fmt(cx) + ' ' + fmt(cy) + ')';
    return '<g transform="' + how + '">' + (Array.isArray(parts) ? parts.join('') : parts) + '</g>';
  }
  // 디지털 숫자(일곱 획). 획 이름: a 위, b 오른쪽 위, c 오른쪽 아래, d 아래, e 왼쪽 아래, f 왼쪽 위, g 가운데
  const SEGMENTS = { 0: 'abcdef', 1: 'bc', 2: 'abdeg', 3: 'abcdg', 4: 'bcfg', 5: 'acdfg', 6: 'acdefg', 7: 'abc', 8: 'abcdefg', 9: 'abcdfg' };
  const SEG_SIDE = { a: 'a', b: 'f', c: 'e', d: 'd', e: 'c', f: 'b', g: 'g' }, SEG_UPDOWN = { a: 'd', b: 'c', c: 'b', d: 'a', e: 'f', f: 'e', g: 'g' };
  const segSwap = (segs, table) => segs.split('').map((c) => table[c]).sort().join('');
  // 숫자 한 자리의 획을 뒤집거나 반 바퀴 돌린다. way: 'side', 'updown', 'half'(180° 돌리기)
  const segMove = (segs, way) => (way === 'side' ? segSwap(segs, SEG_SIDE) : way === 'updown' ? segSwap(segs, SEG_UPDOWN) : segSwap(segSwap(segs, SEG_SIDE), SEG_UPDOWN));
  // 켜진 획이 나타내는 숫자(숫자가 아니면 null). 뒤집어 왼쪽으로 간 1도 1로 읽는다.
  function segRead(segs) {
    const key = segs.split('').sort().join('');
    if (key === 'ef') return 1;
    const hit = Object.keys(SEGMENTS).find((d) => SEGMENTS[d] === key);
    return hit == null ? null : Number(hit);
  }
  // 디지털 숫자로 쓴 수(글 '205')를 뒤집거나 반 바퀴 돌렸을 때의 획 묶음. 옆으로 뒤집기와 반 바퀴 돌리기는 자리의 차례도 거꾸로 된다.
  function segNumber(digits, way) {
    const cells = String(digits).split('').map((d) => (way ? segMove(SEGMENTS[d], way) : SEGMENTS[d]));
    return way === 'side' || way === 'half' ? cells.reverse() : cells;
  }
  // 획 묶음을 수(글)로 읽는다. 숫자가 아닌 자리가 있으면 null. 맨 앞의 0도 그대로 둔다('081').
  const segText = (cells) => { const read = cells.map(segRead); return read.some((d) => d == null) ? null : read.join(''); };
  // 디지털 숫자 그림. cells: 수(글 '205') 또는 segNumber 가 준 획 묶음. options: scale, label(그림 설명), card: false(테두리 없이)
  function segDigits(cells, options) {
    const o = options || {}, list = typeof cells === 'string' ? segNumber(cells) : cells, w = 26, h = 46, gap = 12, pad = Math.max(10, Math.ceil((66 - list.length * w - (list.length - 1) * gap) / 2));
    const width = pad * 2 + list.length * w + (list.length - 1) * gap, height = 20 + h;
    const bar = (x1, y1, x2, y2) => '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" style="stroke:#1e293b;stroke-width:5;stroke-linecap:round"/>';
    let out = o.card === false ? '' : '<rect x="1" y="1" width="' + (width - 2) + '" height="' + (height - 2) + '" rx="6" style="fill:#fff;stroke:#94a3b8;stroke-width:1.5"/>';
    list.forEach((segs, i) => {
      const x = pad + i * (w + gap), y = 10, m = y + h / 2, r = x + w, b = y + h, e = 4;
      const where = { a: [x + e, y, r - e, y], b: [r, y + e, r, m - e], c: [r, m + e, r, b - e], d: [x + e, b, r - e, b], e: [x, m + e, x, b - e], f: [x, y + e, x, m - e], g: [x + e, m, r - e, m] };
      segs.split('').forEach((s) => { out += bar.apply(null, where[s]); });
    });
    return '<svg class="mb-geo" viewBox="0 0 ' + width + ' ' + height + '" width="' + Math.round(width * (o.scale || 1)) + '" role="img" aria-label="' + (o.label || '디지털 숫자') + '">' + out + '</svg>';
  }

  B.kit.geo = { sub, dot, cross, len2, isRight, rightAt, rightAngles, isRectangle, isSquare, isRightTriangle, nearRight, looksRight,
    board, polygon, polyline, line, circle, point, text, beyond, beside, outward, vertexLabels, rightMark, straight, curve, rays, tile, tiles, clock,
    toward, bearing, arc, squareMark, angle, protractor, angleOf, cornerArc, triangle,
    flip, turn, samePoints, moved, SEGMENTS, segMove, segRead, segNumber, segText, segDigits };
})(typeof window !== 'undefined' ? window : globalThis);
