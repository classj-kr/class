(function (root, factory) {
  const api = factory(
    typeof module === "object" && module.exports
      ? require("../assets/math.js")
      : root.ToolMath,
  );
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.ModelClock = api;
})(globalThis, function (M) {
  "use strict";
  const DAY = 86400;
  const initial = {
    version: 1,
    seconds: 10 * 3600 + 10 * 60,
    secondsHand: false,
    digital: true,
    minutes: true,
    start: null,
  };
  function validate(s) {
    if (
      !s ||
      s.version !== 1 ||
      !M.integer(s.seconds, 0, DAY - 1) ||
      !["secondsHand", "digital", "minutes"].every(
        (k) => typeof s[k] === "boolean",
      ) ||
      (s.start !== null && !M.integer(s.start, 0, DAY - 1))
    )
      throw Error("시각을 확인해 주세요.");
    return M.copy(s);
  }
  function parts(seconds) {
    const n = M.mod(seconds, DAY);
    return { h: Math.floor(n / 3600), m: Math.floor(n / 60) % 60, s: n % 60 };
  }
  function angles(seconds) {
    return {
      hour: M.mod(seconds, 43200) / 120,
      minute: M.mod(seconds, 3600) / 10,
      second: M.mod(seconds, 60) * 6,
    };
  }
  function format(seconds, showSeconds = false) {
    const p = parts(seconds);
    return `${p.h < 12 ? "오전" : "오후"} ${p.h % 12 || 12}:${String(p.m).padStart(2, "0")}${showSeconds ? ":" + String(p.s).padStart(2, "0") : ""}`;
  }
  function delta(from, to) {
    return M.mod(to - from + 180, 360) - 180;
  }
  function elapsed(start, end) {
    return M.mod(end - start, DAY);
  }
  return { DAY, initial, validate, parts, angles, format, delta, elapsed };
});
