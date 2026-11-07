(function (root, factory) {
  const api = factory(
    typeof module === "object" && module.exports
      ? require("../assets/math.js")
      : root.ToolMath,
  );
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.DataGraphs = api;
})(globalThis, function (M) {
  const initial = {
    version: 1,
    mode: "bar",
    values: true,
    mean: false,
    table: true,
    categories: {
      unit: "개",
      rows: [
        { label: "사과", value: 8 },
        { label: "귤", value: 5 },
        { label: "배", value: 7 },
        { label: "포도", value: 4 },
      ],
    },
    time: {
      unit: "℃",
      rows: [
        { label: "월", value: 20 },
        { label: "화", value: 23 },
        { label: "수", value: 21 },
        { label: "목", value: 25 },
        { label: "금", value: 26 },
      ],
    },
  };
  function validate(s) {
    if (
      !s ||
      s.version !== 1 ||
      !["bar", "line", "picture", "strip", "pie"].includes(s.mode) ||
      !["values", "mean", "table"].every((k) => typeof s[k] === "boolean")
    )
      throw Error("그래프 자료를 확인해 주세요.");
    for (const data of [s.categories, s.time]) {
      if (
        !data ||
        typeof data.unit !== "string" ||
        data.unit.length > 12 ||
        !Array.isArray(data.rows) ||
        data.rows.length < 1 ||
        data.rows.length > 8 ||
        data.rows.some(
          (r) =>
            !r ||
            typeof r.label !== "string" ||
            !r.label.trim() ||
            r.label.length > 16 ||
            !M.integer(r.value, 0, 1000),
        )
      )
        throw Error("항목은 1~8개, 값은 0~1000까지예요.");
    }
    return M.copy(s);
  }
  const data = (s) => (s.mode === "line" ? s.time : s.categories);
  const total = (rows) => rows.reduce((n, r) => n + r.value, 0);
  const mean = (rows) => total(rows) / rows.length;
  function axis(rows) {
    const max = Math.max(1, ...rows.map((r) => r.value));
    const raw = max / 5,
      power = 10 ** Math.floor(Math.log10(raw));
    const step = [1, 2, 5, 10].map((n) => n * power).find((n) => n >= raw);
    return {
      step: Math.max(1, step),
      max: Math.max(1, step) * Math.ceil(max / Math.max(1, step)),
    };
  }
  const shares = (rows) => {
    const sum = total(rows);
    return rows.map((r) => (sum ? r.value / sum : 0));
  };
  return { initial, validate, data, total, mean, axis, shares };
});
