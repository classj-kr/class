(function (root, factory) {
  const api = factory(
    typeof module === "object" && module.exports
      ? require("../assets/math.js")
      : root.ToolMath,
  );
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.MeasureLab = api;
})(globalThis, function (M) {
  const weights = [100, 500, 1000],
    initial = {
      version: 1,
      mode: "mass",
      left: [2, 0, 1],
      right: [2, 2, 0],
      water: [750, 1250],
      capacity: 2000,
      values: true,
      amount: 250,
    };
  const mass = (counts) => counts.reduce((s, n, i) => s + n * weights[i], 0);
  const grams = (g) =>
    `${Math.floor(g / 1000) ? Math.floor(g / 1000) + " kg " : ""}${g % 1000 || !g ? (g % 1000) + " g" : ""}`.trim();
  const liters = (ml) =>
    `${Math.floor(ml / 1000) ? Math.floor(ml / 1000) + " L " : ""}${ml % 1000 || !ml ? (ml % 1000) + " mL" : ""}`.trim();
  function validate(s) {
    if (
      !s ||
      s.version !== 1 ||
      !["mass", "volume"].includes(s.mode) ||
      ![1000, 2000].includes(s.capacity) ||
      ![50, 100, 250, 500].includes(s.amount) ||
      typeof s.values !== "boolean" ||
      !["left", "right"].every(
        (k) =>
          Array.isArray(s[k]) &&
          s[k].length === 3 &&
          s[k].every((n) => M.integer(n, 0, 20)) &&
          s[k].reduce((a, b) => a + b, 0) <= 20,
      ) ||
      !Array.isArray(s.water) ||
      s.water.length !== 2 ||
      s.water.some((n) => !M.integer(n, 0, s.capacity))
    )
      throw Error("모형의 양을 확인해 주세요.");
    return M.copy(s);
  }
  function pour(water, from, amount, capacity) {
    const to = 1 - from,
      delta = Math.min(amount, water[from], capacity - water[to]),
      result = [...water];
    result[from] -= delta;
    result[to] += delta;
    return result;
  }
  const tilt = (left, right) =>
    M.clamp(
      ((mass(right) - mass(left)) / Math.max(1, mass(left) + mass(right))) * 24,
      -12,
      12,
    );
  return { weights, initial, mass, grams, liters, validate, pour, tilt };
});
