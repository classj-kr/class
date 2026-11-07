(function (root, factory) {
  const api = factory(
    typeof module === "object" && module.exports
      ? require("../assets/math.js")
      : root.ToolMath,
  );
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.NumberLine = api;
})(globalThis, function (M) {
  "use strict";
  const initial = {
    version: 1,
    mode: "whole",
    min: 0,
    max: 10,
    denominator: 1,
    a: 2,
    b: 6,
    jumps: [],
    labels: true,
  };
  function validate(s) {
    if (
      !s ||
      s.version !== 1 ||
      !["whole", "fraction", "decimal"].includes(s.mode) ||
      !M.integer(s.min, -20, 100) ||
      !M.integer(s.max, -19, 120) ||
      s.max <= s.min ||
      s.max - s.min > 40 ||
      !M.integer(s.denominator, 1, 12) ||
      !M.integer(s.a, s.min * s.denominator, s.max * s.denominator) ||
      !M.integer(s.b, s.min * s.denominator, s.max * s.denominator) ||
      !Array.isArray(s.jumps) ||
      s.jumps.length > 12 ||
      typeof s.labels !== "boolean"
    )
      throw Error("수직선의 범위를 확인해 주세요.");
    if (
      s.jumps.some(
        (j) =>
          !M.integer(j.from, s.min * s.denominator, s.max * s.denominator) ||
          !M.integer(j.to, s.min * s.denominator, s.max * s.denominator),
      )
    )
      throw Error("이동 범위를 확인해 주세요.");
    return M.copy(s);
  }
  function changeMode(s, mode) {
    s.mode = mode;
    s.min = 0;
    s.max = mode === "whole" ? 10 : mode === "fraction" ? 3 : 2;
    s.denominator = mode === "whole" ? 1 : mode === "fraction" ? 4 : 10;
    s.a = mode === "whole" ? 2 : 2;
    s.b = mode === "whole" ? 6 : mode === "fraction" ? 7 : 15;
    s.jumps = [];
  }
  function parse(value, d) {
    const match = String(value)
      .trim()
      .match(/^(-?\d+)\s*\/\s*(\d+)$/);
    const n = match ? Number(match[1]) / Number(match[2]) : Number(value);
    if (!Number.isFinite(n) || Math.abs(n * d - Math.round(n * d)) > 1e-7)
      throw Error("현재 눈금에 맞는 수를 입력해 주세요.");
    return Math.round(n * d);
  }
  function label(n, s) {
    return s.mode === "fraction"
      ? M.fractionText(n, s.denominator)
      : String(M.round(n / s.denominator, 4));
  }
  return { initial, validate, changeMode, parse, label };
});
