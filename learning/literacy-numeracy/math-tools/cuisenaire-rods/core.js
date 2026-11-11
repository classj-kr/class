(function (root, factory) {
  const api = factory(
    typeof module === "object" && module.exports
      ? require("../assets/math.js")
      : root.ToolMath,
  );
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.CuisenaireRods = api;
})(globalThis, function (M) {
  "use strict";

  const MIN_UNIT = 1;
  const MAX_UNIT = 999;
  const MIN_COUNT = 1;
  const MAX_COUNT = 20;
  const MIN_ROWS = 2;
  const MAX_ROWS = 3;

  // Classic Cuisenaire rod palette for 1..10, plus vibrant colors for custom >10 rods
  const ROD_PALETTE = Object.freeze({
    1: { fill: "#f4f1ea", stroke: "#9aa59e", text: "#2c3e37", name: "흰색" },
    2: { fill: "#ef6f6c", stroke: "#b83b38", text: "#ffffff", name: "빨간색" },
    3: { fill: "#7ed08f", stroke: "#3b8f4e", text: "#1d3b24", name: "연두색" },
    4: { fill: "#b388eb", stroke: "#6f42b5", text: "#ffffff", name: "보라색" },
    5: { fill: "#ffd166", stroke: "#c4911a", text: "#3d2c00", name: "노란색" },
    6: { fill: "#2c9c7c", stroke: "#18664f", text: "#ffffff", name: "초록색" },
    7: { fill: "#4a5859", stroke: "#242c2d", text: "#ffffff", name: "검은색" },
    8: { fill: "#a66c47", stroke: "#6e4226", text: "#ffffff", name: "갈색" },
    9: { fill: "#4ea8de", stroke: "#236fa1", text: "#ffffff", name: "파란색" },
    10: { fill: "#f79256", stroke: "#bd581c", text: "#ffffff", name: "주황색" },
  });

  const CUSTOM_PALETTE = Object.freeze([
    { fill: "#38a3a5", stroke: "#1f6e70", text: "#ffffff" },
    { fill: "#f28482", stroke: "#b84a48", text: "#ffffff" },
    { fill: "#84a59d", stroke: "#4d6b64", text: "#ffffff" },
    { fill: "#f6bd60", stroke: "#b88228", text: "#382600" },
  ]);

  const PRESETS = Object.freeze({
    "4-6": {
      label: "4와 6",
      rows: [
        { unit: 4, count: 1 },
        { unit: 6, count: 1 },
      ],
    },
    "6-8": {
      label: "6과 8",
      rows: [
        { unit: 6, count: 1 },
        { unit: 8, count: 1 },
      ],
    },
    "22-33": {
      label: "22와 33",
      rows: [
        { unit: 22, count: 1 },
        { unit: 33, count: 1 },
      ],
    },
    "12-18": {
      label: "12와 18",
      rows: [
        { unit: 12, count: 1 },
        { unit: 18, count: 1 },
      ],
    },
    "3-4-6": {
      label: "3, 4, 6 (세 줄)",
      rows: [
        { unit: 3, count: 1 },
        { unit: 4, count: 1 },
        { unit: 6, count: 1 },
      ],
    },
  });

  const initial = {
    version: 1,
    selectedRow: 0,
    showNumbers: true,
    rows: [
      { unit: 4, count: 3 },
      { unit: 6, count: 2 },
    ],
  };

  function lcmTwo(a, b) {
    if (!a || !b) return 0;
    return Math.abs((a / M.gcd(a, b)) * b);
  }

  function lcmAll(units) {
    return units.reduce((acc, n) => lcmTwo(acc, n), 1);
  }

  function gcdAll(units) {
    return units.reduce((acc, n) => M.gcd(acc, n));
  }

  function styleForRod(unit, rowIndex = 0) {
    if (ROD_PALETTE[unit]) return ROD_PALETTE[unit];
    return CUSTOM_PALETTE[rowIndex % CUSTOM_PALETTE.length];
  }

  function rowTotal(row) {
    return row.unit * row.count;
  }

  // Returns all positions where EVERY row has a rod boundary (common multiples currently reached)
  function alignedMultiples(rows) {
    if (!rows.length) return [];
    const lcm = lcmAll(rows.map((r) => r.unit));
    const minTotal = Math.min(...rows.map(rowTotal));
    const matches = [];
    for (let v = lcm; v <= minTotal; v += lcm) {
      matches.push(v);
    }
    return matches;
  }

  function analysis(state) {
    const units = state.rows.map((r) => r.unit);
    const totals = state.rows.map(rowTotal);
    const lcm = lcmAll(units);
    const gcd = gcdAll(units);
    const matches = alignedMultiples(state.rows);
    const allEqual = totals.every((t) => t === totals[0]);
    const shortestTotal = Math.min(...totals);
    const shortestRowIndex = totals.indexOf(shortestTotal);
    return {
      units,
      totals,
      lcm,
      gcd,
      matches,
      allEqual,
      shortestRowIndex,
      canAutoMatch: rowsCanReachLcm(state.rows, lcm),
    };
  }

  function rowsCanReachLcm(rows, lcm = lcmAll(rows.map((r) => r.unit))) {
    return rows.every((r) => lcm / r.unit <= MAX_COUNT);
  }

  function parseUnit(raw) {
    const text = String(raw ?? "").trim();
    if (!/^\d+$/.test(text)) {
      throw Error("1부터 999까지의 자연수를 입력해 주세요.");
    }
    const n = Number(text);
    if (!M.integer(n, MIN_UNIT, MAX_UNIT)) {
      throw Error("1부터 999까지의 자연수를 입력해 주세요.");
    }
    return n;
  }

  function setRowUnit(state, rowIndex, rawUnit) {
    if (!M.integer(rowIndex, 0, state.rows.length - 1)) {
      throw Error("바꿀 줄을 선택해 주세요.");
    }
    const unit = parseUnit(rawUnit);
    state.rows[rowIndex].unit = unit;
    state.rows[rowIndex].count = 1;
    state.selectedRow = rowIndex;
  }

  function changeCount(state, rowIndex, delta) {
    if (!M.integer(rowIndex, 0, state.rows.length - 1)) return;
    const next = state.rows[rowIndex].count + delta;
    if (next < MIN_COUNT) {
      throw Error("막대는 한 줄에 최소 1개 이상 있어야 해요.");
    }
    if (next > MAX_COUNT) {
      throw Error(`막대는 한 줄에 ${MAX_COUNT}개까지 이어 붙일 수 있어요.`);
    }
    state.rows[rowIndex].count = next;
    state.selectedRow = rowIndex;
  }

  // Step the shortest row forward by 1 rod toward alignment
  function stepShortestRow(state) {
    const totals = state.rows.map(rowTotal);
    const minTotal = Math.min(...totals);
    const idx = totals.indexOf(minTotal);
    if (state.rows[idx].count >= MAX_COUNT) {
      throw Error(`막대는 한 줄에 ${MAX_COUNT}개까지 놓을 수 있어요.`);
    }
    state.rows[idx].count += 1;
    state.selectedRow = idx;
  }

  // Set all rows to the next common multiple (or LCM if not yet reached)
  function matchToNextCommonMultiple(state) {
    const units = state.rows.map((r) => r.unit);
    const lcm = lcmAll(units);
    const maxTotal = Math.max(...state.rows.map(rowTotal));
    const allEqual = state.rows.every((r) => rowTotal(r) === maxTotal);
    let target = Math.max(lcm, Math.ceil(maxTotal / lcm) * lcm);
    if (allEqual && maxTotal >= lcm) {
      // If already aligned at a multiple, cycle to LCM (if > lcm) or next multiple
      const nextTarget = maxTotal + lcm;
      const canNext = state.rows.every((r) => nextTarget / r.unit <= MAX_COUNT);
      target = canNext ? nextTarget : lcm;
    }
    if (state.rows.some((r) => target / r.unit > MAX_COUNT)) {
      target = lcm;
    }
    if (state.rows.some((r) => target / r.unit > MAX_COUNT)) {
      throw Error(
        `최소공배수(${lcm})까지 놓으려면 막대가 ${MAX_COUNT}개보다 많이 필요해요.`,
      );
    }
    state.rows.forEach((r) => {
      r.count = target / r.unit;
    });
  }

  function addRow(state, unit = 8) {
    if (state.rows.length >= MAX_ROWS) {
      throw Error("막대 줄은 3줄까지 비교할 수 있어요.");
    }
    state.rows.push({ unit: M.clamp(unit, MIN_UNIT, MAX_UNIT), count: 1 });
    state.selectedRow = state.rows.length - 1;
  }

  function removeRow(state, rowIndex) {
    if (state.rows.length <= MIN_ROWS) {
      throw Error("공배수를 비교하려면 최소 2줄이 필요해요.");
    }
    if (!M.integer(rowIndex, 0, state.rows.length - 1)) return;
    state.rows.splice(rowIndex, 1);
    state.selectedRow = Math.min(state.selectedRow, state.rows.length - 1);
  }

  function applyPreset(state, key) {
    const p = PRESETS[key];
    if (!p) throw Error("예시를 찾을 수 없어요.");
    state.rows = M.copy(p.rows);
    state.selectedRow = 0;
  }

  function validate(s) {
    if (
      !s ||
      s.version !== 1 ||
      typeof s.showNumbers !== "boolean" ||
      !Array.isArray(s.rows) ||
      !M.integer(s.rows.length, MIN_ROWS, MAX_ROWS) ||
      !M.integer(s.selectedRow, 0, s.rows.length - 1) ||
      s.rows.some(
        (r) =>
          !r ||
          !M.integer(r.unit, MIN_UNIT, MAX_UNIT) ||
          !M.integer(r.count, MIN_COUNT, MAX_COUNT),
      )
    ) {
      throw Error("퀴즈네어 막대 설정을 확인해 주세요.");
    }
    return M.copy(s);
  }

  return {
    MIN_UNIT,
    MAX_UNIT,
    MIN_COUNT,
    MAX_COUNT,
    MIN_ROWS,
    MAX_ROWS,
    ROD_PALETTE,
    PRESETS,
    initial,
    lcmTwo,
    lcmAll,
    gcdAll,
    styleForRod,
    rowTotal,
    alignedMultiples,
    analysis,
    parseUnit,
    setRowUnit,
    changeCount,
    stepShortestRow,
    matchToNextCommonMultiple,
    addRow,
    removeRow,
    applyPreset,
    validate,
  };
});
