(function (root, factory) {
  const api = factory(
    typeof module === "object" && module.exports
      ? require("../assets/math.js")
      : root.ToolMath,
  );
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.AreaLab = api;
})(globalThis, function (M) {
  "use strict";
  const initial = {
    version: 1,
    shape: "parallelogram",
    base: 6,
    height: 4,
    top: 3,
    offset: 2,
    radius: 3,
    method: "sectors",
    sectors: 24,
    rings: 12,
    progress: 0,
    grid: true,
    values: false,
  };
  function validate(input) {
    // 고리 펴기를 넣기 전에 저장한 작업에는 method·rings가 없다. 그때는 부채꼴 조각 방식으로 연다.
    const s =
      input && typeof input === "object"
        ? { method: "sectors", rings: 12, ...input }
        : input;
    if (
      !s ||
      s.version !== 1 ||
      !["parallelogram", "triangle", "trapezoid", "rhombus", "circle"].includes(
        s.shape,
      ) ||
      !["base", "height", "top"].every((k) => M.integer(s[k], 2, 10)) ||
      !M.integer(s.offset, -3, 13) ||
      !M.integer(s.radius, 1, 5) ||
      ![12, 24, 48, 96].includes(s.sectors) ||
      !["sectors", "rings"].includes(s.method) ||
      ![6, 12, 24, 48].includes(s.rings) ||
      !M.finite(s.progress, 0, 1) ||
      !["grid", "values"].every((k) => typeof s[k] === "boolean")
    )
      throw Error("도형의 크기를 확인해 주세요.");
    return M.copy(s);
  }
  const p = (x, y) => ({ x, y });
  function polygon(
    points,
    dx = 0,
    dy = 0,
    angle = 0,
    pivot = { x: 0, y: 0 },
    duplicate = false,
  ) {
    return {
      points: points.map(([x, y]) => p(x, y)),
      dx,
      dy,
      angle,
      pivot,
      duplicate,
    };
  }
  function pieces(s) {
    // Only rigid translation/rotation is used. Triangle and trapezoid proofs
    // intentionally add a congruent copy; their doubled area is labeled in UI.
    const b = s.base,
      h = s.height,
      a = s.top,
      o = M.clamp(s.offset, 0, b),
      mid = p((s.offset + b) / 2, h / 2);
    if (s.shape === "parallelogram")
      return [
        polygon([
          [o, 0],
          [b + o, 0],
          [b, h],
          [o, h],
        ]),
        polygon(
          [
            [0, h],
            [o, h],
            [o, 0],
          ],
          b,
        ),
      ];
    if (s.shape === "triangle") {
      const points = [
        [0, h],
        [b, h],
        [s.offset, 0],
      ];
      return [polygon(points), polygon(points, 0, 0, 180, mid, true)];
    }
    if (s.shape === "trapezoid") {
      const points = [
        [0, h],
        [b, h],
        [(b + a) / 2, 0],
        [(b - a) / 2, 0],
      ];
      return [
        polygon(points),
        polygon(points, 0, 0, 180, p((3 * b + a) / 4, h / 2), true),
      ];
    }
    if (s.shape === "rhombus")
      return [
        polygon([
          [0, h / 2],
          [b / 2, h / 2],
          [b / 2, h],
        ]),
        polygon([
          [b / 2, h / 2],
          [b, h / 2],
          [b / 2, h],
        ]),
        polygon(
          [
            [b / 2, 0],
            [b / 2, h / 2],
            [0, h / 2],
          ],
          b / 2,
          h / 2,
        ),
        polygon(
          [
            [b / 2, 0],
            [b, h / 2],
            [b / 2, h / 2],
          ],
          -b / 2,
          h / 2,
        ),
      ];
    const n = s.sectors,
      r = s.radius,
      alpha = Math.PI / n,
      chord = 2 * r * Math.sin(alpha),
      height = r * Math.cos(alpha);
    return Array.from({ length: n }, (_, i) => ({
      sector: true,
      r,
      alpha,
      startAngle: (i * 360) / n,
      endAngle: i % 2 ? 180 : 0,
      dx: (Math.floor(i / 2) + (i % 2) / 2) * chord - ((n / 2 - 1) * chord) / 2,
      dy: i % 2 ? height : 0,
    }));
  }
  // 고리 펴기: 원을 같은 두께의 고리 n개로 나누고, 맨 위를 잘라 하나씩 곧게 편다.
  // 각 고리의 맨 아래 점은 제자리에 둔 채 굽은 정도만 줄인다(가운데 줄의 길이는 그대로라 넓이도 그대로).
  // 다 펴면 고리 i는 너비 2π×(가운데 반지름), 두께 r/n인 띠가 되고, 띠들이 쌓여
  // 밑변이 원주(2πr), 높이가 반지름(r)인 삼각형에 가까운 계단이 된다.
  function ringShape(r, n, i, t) {
    const dr = r / n,
      a = i * dr,
      b = a + dr,
      mid = (a + b) / 2;
    if (t >= 0.999)
      return { flat: true, x0: -Math.PI * mid, x1: Math.PI * mid, y0: a, y1: b };
    const theta = Math.min(2 * Math.PI * (1 - t), 2 * Math.PI - 1e-6),
      rho = mid / (1 - t),
      outer = rho + dr / 2,
      inner = Math.max(0, rho - dr / 2);
    return { flat: false, cx: 0, cy: b - outer, inner, outer, theta };
  }
  // 띠(굽은 고리)의 넓이: 부채꼴 띠 θ/2·(바깥² − 안쪽²), 다 펴면 직사각형.
  function ringArea(shape) {
    return shape.flat
      ? (shape.x1 - shape.x0) * (shape.y1 - shape.y0)
      : (shape.theta / 2) * (shape.outer ** 2 - shape.inner ** 2);
  }
  function transformed(piece, t) {
    return piece.points.map((point) => {
      const q = M.rotate(
        { x: point.x - piece.pivot.x, y: point.y - piece.pivot.y },
        (piece.angle * t * Math.PI) / 180,
      );
      return {
        x: q.x + piece.pivot.x + piece.dx * t,
        y: q.y + piece.pivot.y + piece.dy * t,
      };
    });
  }
  function area(s) {
    if (s.shape === "circle") return Math.PI * s.radius * s.radius;
    if (s.shape === "trapezoid") return ((s.base + s.top) * s.height) / 2;
    return (
      s.base *
      s.height *
      (s.shape === "triangle" || s.shape === "rhombus" ? 0.5 : 1)
    );
  }
  function bounds(s) {
    if (s.shape === "circle" && s.method === "rings") {
      // 펴는 동안 고리 끝이 원 위로 잠깐 올라간다. 가장 바깥 고리의 끝점을 훑어 그 높이까지 넣는다.
      const r = s.radius;
      let top = -r;
      for (let k = 1; k < 100; k++) {
        const g = ringShape(r, s.rings, s.rings - 1, k / 100);
        if (g.flat) continue;
        for (const radius of [g.inner, g.outer])
          top = Math.min(top, g.cy + radius * Math.cos(g.theta / 2));
      }
      return { minX: -Math.PI * r, maxX: Math.PI * r, minY: top, maxY: r };
    }
    const points = [];
    for (const part of pieces(s)) {
      if (part.sector) {
        for (const x of [0, part.dx])
          for (const y of [0, part.dy])
            points.push(p(x - part.r, y - part.r), p(x + part.r, y + part.r));
      } else {
        points.push(...part.points, ...transformed(part, 1));
        if (part.angle) {
          const radius = Math.max(
            ...part.points.map((q) => M.distance(q, part.pivot)),
          );
          points.push(
            p(part.pivot.x - radius, part.pivot.y - radius),
            p(part.pivot.x + radius, part.pivot.y + radius),
          );
        }
      }
    }
    return {
      minX: Math.min(...points.map((p) => p.x)),
      maxX: Math.max(...points.map((p) => p.x)),
      minY: Math.min(...points.map((p) => p.y)),
      maxY: Math.max(...points.map((p) => p.y)),
    };
  }
  return { initial, validate, pieces, ringShape, ringArea, transformed, area, bounds };
});
