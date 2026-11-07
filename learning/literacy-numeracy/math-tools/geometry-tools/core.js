(function (root, factory) {
  const api = factory(
    typeof module === "object" && module.exports
      ? require("../assets/math.js")
      : root.ToolMath,
  );
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.GeometryTools = api;
})(globalThis, function (M) {
  const initial = {
    version: 1,
    mode: "angle",
    angle: 60,
    base: 0,
    length: 65,
    center: { x: 430, y: 340 },
    tool: { x: 430, y: 340, angle: 0 },
    show: false,
    visible: true,
  };
  function validate(s) {
    if (
      !s ||
      s.version !== 1 ||
      !["angle", "ruler"].includes(s.mode) ||
      !M.integer(s.angle, 0, 180) ||
      !M.finite(s.base, -360, 360) ||
      !M.integer(s.length, 10, 120) ||
      !["show", "visible"].every((k) => typeof s[k] === "boolean") ||
      ![s.center, s.tool].every(
        (p) => p && M.finite(p.x, 80, 920) && M.finite(p.y, 90, 510),
      ) ||
      !M.finite(s.tool.angle, -360, 360)
    )
      throw Error("도형의 범위를 확인해 주세요.");
    return M.copy(s);
  }
  function local(p, tool) {
    const q = M.rotate(
      { x: p.x - tool.x, y: p.y - tool.y },
      (tool.angle * Math.PI) / 180,
    );
    return q;
  }
  function world(p, tool) {
    const q = M.rotate(p, (-tool.angle * Math.PI) / 180);
    return { x: q.x + tool.x, y: q.y + tool.y };
  }
  function endpoints(s) {
    return [
      s.center,
      M.circlePoint(
        s.center.x,
        s.center.y,
        s.mode === "angle" ? 260 : s.length * 5,
        s.base,
      ),
      ...(s.mode === "angle"
        ? [M.circlePoint(s.center.x, s.center.y, 260, s.base + s.angle)]
        : []),
    ];
  }
  return { initial, validate, local, world, endpoints };
});
