(function (root, factory) {
  const api = factory(
    typeof module === "object" && module.exports
      ? require("../assets/math.js")
      : root.ToolMath,
  );
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.ProbabilityLab = api;
})(globalThis, function (M) {
  const initial = {
    version: 1,
    mode: "coin",
    theory: false,
    scenes: {
      coin: { weights: [1, 1], counts: [0, 0], last: null },
      dice: {
        weights: [1, 1, 1, 1, 1, 1],
        counts: [0, 0, 0, 0, 0, 0],
        last: null,
      },
      spinner: { weights: [1, 1, 1, 1], counts: [0, 0, 0, 0], last: null },
    },
  };
  function validate(s) {
    if (
      !s ||
      s.version !== 1 ||
      !["coin", "dice", "spinner"].includes(s.mode) ||
      typeof s.theory !== "boolean"
    )
      throw Error("실험 자료를 확인해 주세요.");
    for (const mode of ["coin", "dice", "spinner"]) {
      const d = s.scenes?.[mode],
        size = { coin: 2, dice: 6, spinner: 4 }[mode];
      if (
        !d ||
        !Array.isArray(d.weights) ||
        d.weights.length !== size ||
        d.weights.some((n) => !M.integer(n, 1, 8)) ||
        (mode !== "spinner" && d.weights.some((n) => n !== 1)) ||
        !Array.isArray(d.counts) ||
        d.counts.length !== size ||
        d.counts.some((n) => !M.integer(n, 0, 100000)) ||
        d.counts.reduce((a, b) => a + b, 0) > 100000 ||
        (d.last !== null && !M.integer(d.last, 0, size - 1))
      )
        throw Error("실험 자료를 확인해 주세요.");
    }
    return M.copy(s);
  }
  function randomIndex(
    weights,
    nextUint = () => crypto.getRandomValues(new Uint32Array(1))[0],
  ) {
    const total = weights.reduce((a, b) => a + b, 0),
      limit = Math.floor(4294967296 / total) * total;
    let n;
    // Reject the incomplete tail of the uint32 range before taking modulo.
    // Otherwise outcomes near zero would have a small systematic advantage.
    do {
      n = nextUint();
    } while (n >= limit);
    let ticket = n % total;
    for (let i = 0; i < weights.length; i++) {
      if (ticket < weights[i]) return i;
      ticket -= weights[i];
    }
    throw Error("추첨 범위 오류");
  }
  function sample(scene, n, nextUint) {
    const result = M.copy(scene);
    if (result.counts.reduce((a, b) => a + b, 0) + n > 100000)
      throw Error("기록을 비운 뒤 다시 실험해 주세요.");
    for (let i = 0; i < n; i++) {
      const index = randomIndex(result.weights, nextUint);
      result.counts[index]++;
      result.last = index;
    }
    return result;
  }
  function midAngle(weights, index) {
    const total = weights.reduce((a, b) => a + b, 0);
    return (
      ((weights.slice(0, index).reduce((a, b) => a + b, 0) +
        weights[index] / 2) /
        total) *
      360
    );
  }
  return { initial, validate, randomIndex, sample, midAngle };
});
