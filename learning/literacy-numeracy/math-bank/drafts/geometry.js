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
  // 꼭짓점 i 에서의 각이 직각인가
  function rightAt(points, i) {
    const n = points.length, v = points[i];
    return dot(sub(points[(i + n - 1) % n], v), sub(points[(i + 1) % n], v)) === 0;
  }
  const rightAngles = (points) => points.filter((_, i) => rightAt(points, i)).length;
  const area2 = (points) => Math.abs(points.reduce((sum, p, i) => sum + cross(p, points[(i + 1) % points.length]), 0));
  const isRectangle = (points) => points.length === 4 && rightAngles(points) === 4;
  const isSquare = (points) => isRectangle(points) && len2(sub(points[0], points[1])) === len2(sub(points[1], points[2]));
  const isRightTriangle = (points) => points.length === 3 && rightAngles(points) === 1;
  // 직각은 아니지만 직각처럼 보이는 각이 있으면 문제로 쓰기 어렵다(약 76°~104°).
  function looksRight(points) {
    const n = points.length;
    return points.some((v, i) => {
      const a = sub(points[(i + n - 1) % n], v), b = sub(points[(i + 1) % n], v);
      const d = dot(a, b);
      return d !== 0 && (d * d) / (len2(a) * len2(b)) < 0.06;
    });
  }
  // 볼록한가(꼭짓점에서 꺾이는 방향이 모두 같다)
  function isConvex(points) {
    const n = points.length; let sign = 0;
    for (let i = 0; i < n; i += 1) {
      const c = cross(sub(points[(i + 1) % n], points[i]), sub(points[(i + 2) % n], points[(i + 1) % n]));
      if (c === 0) return false;
      if (sign && Math.sign(c) !== sign) return false;
      sign = Math.sign(c);
    }
    return true;
  }

  // ── 그리기 ──────────────────────────────────────────────────
  function board(cols, rows, parts, options) {
    const o = options || {};
    const width = PAD * 2 + cols * U, height = PAD * 2 + rows * U;
    let grid = '';
    if (o.grid !== false) for (let x = 0; x <= cols; x += 1) for (let y = 0; y <= rows; y += 1) grid += '<circle class="mb-grid" cx="' + at(x) + '" cy="' + at(y) + '" r="1.3"/>';
    return '<svg class="mb-geo" viewBox="0 0 ' + width + ' ' + height + '" width="' + width + '" height="' + height + '" role="img" aria-label="' + (o.label || '도형') + '">' + grid + parts.join('') + '</svg>';
  }
  const polygon = (points, className) => '<polygon class="' + (className || 'mb-shape') + '" points="' + points.map((p) => at(p[0]) + ',' + at(p[1])).join(' ') + '"/>';
  const line = (p, q, className) => '<line class="' + (className || 'mb-line') + '" x1="' + fmt(at(p[0])) + '" y1="' + fmt(at(p[1])) + '" x2="' + fmt(at(q[0])) + '" y2="' + fmt(at(q[1])) + '"/>';
  const point = (p) => '<circle class="mb-dot" cx="' + at(p[0]) + '" cy="' + at(p[1]) + '" r="3.2"/>';
  const text = (p, value, className) => '<text class="' + (className || 'mb-label') + '" x="' + fmt(at(p[0])) + '" y="' + fmt(at(p[1])) + '" text-anchor="middle" dominant-baseline="central">' + value + '</text>';
  // 점 p 에서 q 쪽으로(또는 반대쪽으로) 칸 수 amount 만큼 더 나간 자리
  function beyond(p, q, amount) {
    const d = sub(q, p), size = Math.sqrt(len2(d));
    return [q[0] + (d[0] / size) * amount, q[1] + (d[1] / size) * amount];
  }
  // 이름표: 도형의 가운데에서 바깥쪽으로 조금 밀어 적는다.
  function outward(points, i, amount) {
    const cx = points.reduce((s, p) => s + p[0], 0) / points.length, cy = points.reduce((s, p) => s + p[1], 0) / points.length;
    const d = [points[i][0] - cx, points[i][1] - cy], size = Math.sqrt(len2(d)) || 1;
    return [points[i][0] + (d[0] / size) * amount, points[i][1] + (d[1] / size) * amount];
  }
  const vertexLabels = (points, names) => points.map((_, i) => text(outward(points, i, 0.62), names[i])).join('');
  // 직각 표시(작은 네모)
  function rightMark(v, p, q) {
    const a = sub(p, v), b = sub(q, v), sa = 0.42 / Math.sqrt(len2(a)), sb = 0.42 / Math.sqrt(len2(b));
    const p1 = [v[0] + a[0] * sa, v[1] + a[1] * sa], p3 = [v[0] + b[0] * sb, v[1] + b[1] * sb], p2 = [p1[0] + b[0] * sb, p1[1] + b[1] * sb];
    return '<polyline class="mb-mark" points="' + [p1, p2, p3].map((p) => fmt(at(p[0])) + ',' + fmt(at(p[1]))).join(' ') + '"/>';
  }
  // 선분·반직선·직선. 반직선 ㄱㄴ은 ㄱ에서 시작해 ㄴ 쪽으로 끝없이 간다.
  function straight(kind, p, q, names) {
    const from = kind === 'line' ? beyond(q, p, 1.1) : p;
    const to = kind === 'segment' ? q : beyond(p, q, 1.1);
    const side = [-(q[1] - p[1]), q[0] - p[0]], size = Math.sqrt(len2(side));
    const off = [(side[0] / size) * 0.6, (side[1] / size) * 0.6];
    return line(from, to) + point(p) + point(q)
      + (names ? text([p[0] + off[0], p[1] + off[1]], names[0]) + text([q[0] + off[0], q[1] + off[1]], names[1]) : '');
  }
  // 굽은 선(선분이 아닌 것의 보기)
  function curve(p, q) {
    const mid = [(p[0] + q[0]) / 2 - (q[1] - p[1]) * 0.45, (p[1] + q[1]) / 2 + (q[0] - p[0]) * 0.45];
    return '<path class="mb-line" fill="none" d="M' + at(p[0]) + ' ' + at(p[1]) + ' Q' + fmt(at(mid[0])) + ' ' + fmt(at(mid[1])) + ' ' + at(q[0]) + ' ' + at(q[1]) + '"/>' + point(p) + point(q);
  }
  // 각: 꼭짓점 v 에서 p, q 쪽으로 그은 두 반직선
  function angle(v, p, q, names) {
    const labels = names ? text(beyond(v, p, 0.55), names[0]) + text(beyond(q, v, 0.55), names[1]) + text(beyond(v, q, 0.55), names[2]) : '';
    return line(v, beyond(v, p, 0.9)) + line(v, beyond(v, q, 0.9)) + point(v) + (names ? point(p) + point(q) : '') + labels;
  }
  // 이름표가 붙은 작은 그림 한 칸(㉠, ㉡ …)
  const tile = (label, svg) => '<figure class="mb-tile"><figcaption>' + label + '</figcaption>' + svg + '</figure>';

  // 시계. 긴바늘은 분, 짧은바늘은 시(분에 따라 조금씩 움직인다).
  function clock(hour, minute, options) {
    const o = options || {}, R = 46, C = 54;
    const polar = (deg, r) => [C + r * Math.sin((deg * Math.PI) / 180), C - r * Math.cos((deg * Math.PI) / 180)];
    let ticks = '';
    for (let i = 0; i < 60; i += 1) {
      const outer = polar(i * 6, R - 1), inner = polar(i * 6, i % 5 === 0 ? R - 7 : R - 4);
      ticks += '<line class="' + (i % 5 === 0 ? 'mb-tick-big' : 'mb-tick') + '" x1="' + fmt(outer[0]) + '" y1="' + fmt(outer[1]) + '" x2="' + fmt(inner[0]) + '" y2="' + fmt(inner[1]) + '"/>';
    }
    let numbers = '';
    for (let n = 1; n <= 12; n += 1) { const p = polar(n * 30, R - 14); numbers += '<text class="mb-clock-number" x="' + fmt(p[0]) + '" y="' + fmt(p[1]) + '" text-anchor="middle" dominant-baseline="central">' + n + '</text>'; }
    const m = polar(minute * 6, R - 12), h = polar((hour % 12) * 30 + minute * 0.5, R - 24);
    let second = '';
    if (o.second != null) { const s = polar(o.second * 6, R - 8); second = '<line class="mb-hand-second" x1="' + C + '" y1="' + C + '" x2="' + fmt(s[0]) + '" y2="' + fmt(s[1]) + '"/>'; }
    return '<svg class="mb-clock" viewBox="0 0 108 108" width="' + (o.size || 120) + '" height="' + (o.size || 120) + '" role="img" aria-label="시계"><circle class="mb-clock-face" cx="' + C + '" cy="' + C + '" r="' + R + '"/>' + ticks + numbers
      + '<line class="mb-hand-hour" x1="' + C + '" y1="' + C + '" x2="' + fmt(h[0]) + '" y2="' + fmt(h[1]) + '"/><line class="mb-hand-minute" x1="' + C + '" y1="' + C + '" x2="' + fmt(m[0]) + '" y2="' + fmt(m[1]) + '"/>' + second + '<circle class="mb-clock-pin" cx="' + C + '" cy="' + C + '" r="2.4"/></svg>';
  }

  B.kit.geo = { sub, dot, cross, len2, rightAt, rightAngles, area2, isRectangle, isSquare, isRightTriangle, looksRight, isConvex,
    board, polygon, line, point, text, beyond, vertexLabels, rightMark, straight, curve, angle, tile, clock };
})(typeof window !== 'undefined' ? window : globalThis);
