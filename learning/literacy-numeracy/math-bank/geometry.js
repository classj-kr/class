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
  function clock(hour, minute) {
    const R = 46, C = 54;
    const polar = (deg, r) => [C + r * Math.sin((deg * Math.PI) / 180), C - r * Math.cos((deg * Math.PI) / 180)];
    let ticks = '';
    for (let i = 0; i < 12; i += 1) { const outer = polar(i * 30, R - 1), inner = polar(i * 30, R - 6); ticks += '<line class="mb-tick" x1="' + fmt(outer[0]) + '" y1="' + fmt(outer[1]) + '" x2="' + fmt(inner[0]) + '" y2="' + fmt(inner[1]) + '"/>'; }
    let numbers = '';
    for (let n = 1; n <= 12; n += 1) { const p = polar(n * 30, R - 14); numbers += '<text class="mb-clock-number" x="' + fmt(p[0]) + '" y="' + fmt(p[1]) + '" text-anchor="middle" dominant-baseline="central">' + n + '</text>'; }
    const m = polar(minute * 6, R - 10), h = polar((hour % 12) * 30 + minute * 0.5, R - 24);
    return '<svg class="mb-clock" viewBox="0 0 108 108" width="104" role="img" aria-label="시계 ' + hour + '시' + (minute ? ' ' + minute + '분' : '') + '"><circle class="mb-clock-face" cx="' + C + '" cy="' + C + '" r="' + R + '"/>' + ticks + numbers
      + '<line class="mb-hand-hour" x1="' + C + '" y1="' + C + '" x2="' + fmt(h[0]) + '" y2="' + fmt(h[1]) + '"/><line class="mb-hand-minute" x1="' + C + '" y1="' + C + '" x2="' + fmt(m[0]) + '" y2="' + fmt(m[1]) + '"/><circle class="mb-clock-pin" cx="' + C + '" cy="' + C + '" r="2.4"/></svg>';
  }

  B.kit.geo = { sub, dot, cross, len2, isRight, rightAt, rightAngles, isRectangle, isSquare, isRightTriangle, nearRight, looksRight,
    board, polygon, polyline, line, circle, point, text, beyond, beside, outward, vertexLabels, rightMark, straight, curve, rays, tile, tiles, clock };
})(typeof window !== 'undefined' ? window : globalThis);
