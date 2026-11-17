(function (root, factory) {
  const api = factory(
    typeof module === "object" && module.exports
      ? require("../assets/math.js")
      : root.ToolMath,
  );
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.PatternBlocks = api;
})(globalThis, function (M) {
  "use strict";
  const h = Math.sqrt(3) / 2;
  const shapes = {
    triangle: [
      [0, (-2 * h) / 3],
      [-0.5, h / 3],
      [0.5, h / 3],
    ],
    square: [
      [-0.5, -0.5],
      [0.5, -0.5],
      [0.5, 0.5],
      [-0.5, 0.5],
    ],
    rhombus: [
      [-0.75, -h / 2],
      [0.25, -h / 2],
      [0.75, h / 2],
      [-0.25, h / 2],
    ],
    thin: [
      [-(1 + Math.sqrt(3) / 2) / 2, -0.25],
      [(1 - Math.sqrt(3) / 2) / 2, -0.25],
      [(1 + Math.sqrt(3) / 2) / 2, 0.25],
      [-(1 - Math.sqrt(3) / 2) / 2, 0.25],
    ],
    trapezoid: [
      [-1, -h / 2],
      [1, -h / 2],
      [0.5, h / 2],
      [-0.5, h / 2],
    ],
    hexagon: Array.from({ length: 6 }, (_, i) => [
      Math.cos((i * Math.PI) / 3),
      Math.sin((i * Math.PI) / 3),
    ]),
  };
  const tangram = [
    [
      [0, 0],
      [4, 0],
      [2, 2],
    ],
    [
      [0, 0],
      [2, 2],
      [0, 4],
    ],
    [
      [2, 4],
      [4, 4],
      [4, 2],
    ],
    [
      [2, 2],
      [3, 1],
      [3, 3],
    ],
    [
      [0, 4],
      [1, 3],
      [2, 4],
    ],
    [
      [1, 3],
      [2, 2],
      [3, 3],
      [2, 4],
    ],
    [
      [3, 1],
      [4, 0],
      [4, 2],
      [3, 3],
    ],
  ];
  function centered(values) {
    const cx = values.reduce((s, p) => s + p[0], 0) / values.length,
      cy = values.reduce((s, p) => s + p[1], 0) / values.length;
    return values.map(([x, y]) => ({ x: x - cx, y: y - cy }));
  }
  function local(piece) {
    return centered(
      piece.type.startsWith("t") && /^t\d$/.test(piece.type)
        ? tangram[Number(piece.type[1])]
        : shapes[piece.type],
    );
  }
  function points(piece) {
    return local(piece).map((p) => {
      const q = M.rotate(
        { x: p.x * (piece.flip ? -1 : 1) * piece.size, y: p.y * piece.size },
        (piece.angle * Math.PI) / 180,
      );
      return { x: q.x + piece.x, y: q.y + piece.y };
    });
  }
  function piece(id, type, x, y) {
    return {
      id,
      type,
      x,
      y,
      size: /^t\d$/.test(type) ? 48 : 82,
      angle: 0,
      flip: false,
      color: M.colors[(Object.keys(shapes).indexOf(type) + 6) % 6],
    };
  }
  function tangramPieces() {
    return tangram.map((_, i) => ({
      ...piece(
        `t-${i}`,
        `t${i}`,
        170 + (i % 4) * 210,
        170 + Math.floor(i / 4) * 270,
      ),
      color: M.colors[i % 6],
    }));
  }
  const initial = {
    version: 1,
    mode: "pattern",
    scenes: { pattern: [], tangram: tangramPieces() },
    grid: false,
    snap: true,
    axis: false,
    outline: false,
  };
  function validate(s) {
    if (
      !s ||
      s.version !== 1 ||
      !["pattern", "tangram"].includes(s.mode) ||
      !["grid", "snap", "axis", "outline"].every(
        (k) => typeof s[k] === "boolean",
      )
    )
      throw Error("도형판을 읽을 수 없어요.");
    const ids = new Set();
    for (const mode of ["pattern", "tangram"]) {
      const rows = s.scenes?.[mode];
      if (
        !Array.isArray(rows) ||
        rows.length > 48 ||
        (mode === "tangram" && rows.length !== 7)
      )
        throw Error("조각 수를 확인해 주세요.");
      for (const p of rows) {
        if (
          !p ||
          !(
            (mode === "pattern" && Object.hasOwn(shapes, p.type)) ||
            (mode === "tangram" && /^t[0-6]$/.test(p.type))
          ) ||
          typeof p.id !== "string" ||
          !/^[-a-z0-9]{1,60}$/.test(p.id) ||
          ids.has(p.id) ||
          !M.finite(p.x, 0, 1000) ||
          !M.finite(p.y, 0, 600) ||
          !M.finite(p.size, 30, 110) ||
          !M.finite(p.angle, -360, 360) ||
          typeof p.flip !== "boolean" ||
          !M.colors.includes(p.color)
        )
          throw Error("조각을 읽을 수 없어요.");
        ids.add(p.id);
      }
    }
    if (new Set(s.scenes.tangram.map((p) => p.type)).size !== 7)
      throw Error("칠교 조각이 빠졌어요.");
    return M.copy(s);
  }
  function constrain(piece) {
    const ps = points(piece),
      minX = Math.min(...ps.map((p) => p.x)),
      maxX = Math.max(...ps.map((p) => p.x)),
      minY = Math.min(...ps.map((p) => p.y)),
      maxY = Math.max(...ps.map((p) => p.y));
    piece.x += minX < 8 ? 8 - minX : maxX > 992 ? 992 - maxX : 0;
    piece.y += minY < 8 ? 8 - minY : maxY > 592 ? 592 - maxY : 0;
    return piece;
  }
  // 칠교 조각은 한 칸 48의 절반(24) 격자라 꼭짓점이 격자 점에 맞는다.
  const gridStep = (mode) => (mode === "tangram" ? 24 : 25);
  // grid: 격자 간격(없으면 격자에 붙이지 않음). vertices: 다른 조각 꼭짓점에 붙일지.
  function snap(piece, others, { grid = 0, vertices = true } = {}) {
    const own = points(piece);
    let delta = null,
      best = Infinity;
    const offer = (a, b) => {
      const distance = M.distance(a, b);
      if (distance < best) {
        best = distance;
        delta = { x: b.x - a.x, y: b.y - a.y };
      }
    };
    // 격자가 켜져 있으면 가장 가까운 꼭짓점을 가장 가까운 격자 점에 착 붙인다.
    if (grid)
      for (const a of own)
        offer(a, { x: Math.round(a.x / grid) * grid, y: Math.round(a.y / grid) * grid });
    // 격자가 꺼져 있을 때만 다른 조각 꼭짓점에 붙인다(격자 점이 우선).
    if (vertices && !grid) {
      best = 14;
      for (const a of own)
        for (const other of others)
          for (const b of points(other)) if (M.distance(a, b) < 14) offer(a, b);
    }
    const target = delta ? { ...piece, x: piece.x + delta.x, y: piece.y + delta.y } : { ...piece },
      kept = constrain({ ...target });
    // 판 가장자리에서 밀려 들어왔으면 안쪽 격자 점으로 한 번 더 맞춘다.
    if (grid)
      for (const axis of ["x", "y"]) {
        if (kept[axis] === target[axis]) continue;
        const values = points(kept).map((p) => p[axis]);
        kept[axis] += kept[axis] > target[axis]
          ? Math.ceil(Math.min(...values) / grid) * grid - Math.min(...values)
          : Math.floor(Math.max(...values) / grid) * grid - Math.max(...values);
      }
    return kept;
  }
  return {
    shapes,
    tangram,
    initial,
    piece,
    points,
    local,
    validate,
    snap,
    gridStep,
    constrain,
    tangramPieces,
  };
});
