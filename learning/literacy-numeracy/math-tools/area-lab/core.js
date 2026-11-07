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
    sectors: 24,
    progress: 0,
    grid: true,
    values: false,
  };
  function validate(s) {
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
  return { initial, validate, pieces, transformed, area, bounds };
});
