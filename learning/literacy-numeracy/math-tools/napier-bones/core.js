(function (root, factory) {
  const api = factory(
    typeof module === "object" && module.exports
      ? require("../assets/math.js")
      : root.ToolMath,
  );
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.NapierBones = api;
})(globalThis, function (M) {
  "use strict";

  const MIN_NUM = 2;
  const MAX_NUM = 999;
  const MIN_NUMBERS = 2;
  const MAX_NUMBERS = 4;
  const ROW_OPTIONS = [9, 12, 15, 20];

  const PRESETS = Object.freeze({
    "4-6": { label: "4와 6", numbers: [4, 6], rows: 9 },
    "6-8": { label: "6과 8", numbers: [6, 8], rows: 9 },
    "22-33": { label: "22와 33 (두 자리)", numbers: [22, 33], rows: 9 },
    "12-18": { label: "12와 18 (두 자리)", numbers: [12, 18], rows: 9 },
    "15-25": { label: "15와 25 (두 자리)", numbers: [15, 25], rows: 9 },
    "3-4-6": { label: "3, 4, 6 (세 수)", numbers: [3, 4, 6], rows: 9 },
  });

  const initial = {
    version: 1,
    mode: "lcm", // "lcm" | "multiply"
    numbers: [4, 6],
    rows: 9,
    selectedMultiple: 12,
    showDiagonals: true,
    showMultiples: true,
    multiplicand: 348,
    multiplier: 7,
  };

  function lcmTwo(a, b) {
    if (!a || !b) return 0;
    return Math.abs((a / M.gcd(a, b)) * b);
  }

  function lcmAll(numbers) {
    return numbers.reduce((acc, n) => lcmTwo(acc, n), 1);
  }

  function gcdAll(numbers) {
    return numbers.reduce((acc, n) => M.gcd(acc, n));
  }

  function digitsOf(n) {
    return String(Math.abs(Math.trunc(n)))
      .split("")
      .map(Number);
  }

  // Returns Napier bone cell breakdown for a (possibly multi-digit) number at row k
  function boneRow(number, k) {
    const digits = digitsOf(number);
    const cells = digits.map((d) => {
      const prod = d * k;
      return {
        digit: d,
        product: prod,
        tens: Math.floor(prod / 10),
        ones: prod % 10,
      };
    });
    // Diagonal sums from right (lowest place) to left
    const diagonals = [];
    for (let i = cells.length - 1; i >= 0; i--) {
      const ones = cells[i].ones;
      const prevTens = i < cells.length - 1 ? cells[i + 1].tens : 0;
      diagonals.unshift({
        leftTens: i < cells.length - 1 ? cells[i + 1].tens : null,
        rightOnes: ones,
        sum: ones + prevTens,
      });
    }
    if (cells[0].tens > 0) {
      diagonals.unshift({
        leftTens: cells[0].tens,
        rightOnes: null,
        sum: cells[0].tens,
      });
    }
    return {
      number,
      multiplier: k,
      value: number * k,
      digits,
      cells,
      diagonals,
    };
  }

  function commonMultiplesInfo(numbers, rows = 9) {
    const lcm = lcmAll(numbers);
    const gcd = gcdAll(numbers);
    const visibleMultiplesByNum = numbers.map((n) =>
      Array.from({ length: rows }, (_, i) => n * (i + 1)),
    );
    const commonInTable = [];
    for (let k = 1; k <= rows; k++) {
      const candidate = numbers[0] * k;
      if (
        numbers.every((n) => {
          const q = candidate / n;
          return Number.isInteger(q) && q >= 1 && q <= rows;
        })
      ) {
        commonInTable.push(candidate);
      }
    }
    const firstFiveCommon = Array.from({ length: 5 }, (_, i) => lcm * (i + 1));
    const factorsForLcm = numbers.map((n) => ({
      number: n,
      multiplier: lcm / n,
      inVisibleRows: lcm / n <= rows,
    }));
    return {
      numbers: [...numbers],
      lcm,
      gcd,
      commonInTable,
      firstFiveCommon,
      factorsForLcm,
      visibleMultiplesByNum,
    };
  }

  function parseCustomNumber(raw) {
    const text = String(raw ?? "").trim();
    if (!/^\d+$/.test(text)) {
      throw Error("2부터 999까지의 자연수를 입력해 주세요.");
    }
    const n = Number(text);
    if (!M.integer(n, MIN_NUM, MAX_NUM)) {
      throw Error("2부터 999까지의 자연수를 입력해 주세요.");
    }
    return n;
  }

  function addNumber(state, rawNumber) {
    const n = parseCustomNumber(rawNumber);
    if (state.numbers.includes(n)) {
      throw Error(`${n} 막대는 이미 놓여 있어요.`);
    }
    if (state.numbers.length >= MAX_NUMBERS) {
      throw Error("비교할 수 막대는 4개까지 놓을 수 있어요. 기존 막대를 지운 뒤 추가해 주세요.");
    }
    state.numbers = [...state.numbers, n];
    state.selectedMultiple = lcmAll(state.numbers);
  }

  function replaceNumber(state, index, rawNumber) {
    if (!M.integer(index, 0, state.numbers.length - 1)) {
      throw Error("바꿀 막대를 선택해 주세요.");
    }
    const n = parseCustomNumber(rawNumber);
    const dupIndex = state.numbers.indexOf(n);
    if (dupIndex !== -1 && dupIndex !== index) {
      throw Error(`${n} 막대는 이미 놓여 있어요.`);
    }
    const next = [...state.numbers];
    next[index] = n;
    state.numbers = next;
    state.selectedMultiple = lcmAll(state.numbers);
  }

  function removeNumber(state, index) {
    if (state.numbers.length <= MIN_NUMBERS) {
      throw Error("공배수를 비교하려면 막대가 2개 이상 필요해요.");
    }
    if (!M.integer(index, 0, state.numbers.length - 1)) {
      throw Error("지울 막대를 확인해 주세요.");
    }
    state.numbers = state.numbers.filter((_, i) => i !== index);
    state.selectedMultiple = lcmAll(state.numbers);
  }

  function toggleQuickNumber(state, n) {
    if (!M.integer(n, MIN_NUM, MAX_NUM)) return;
    const idx = state.numbers.indexOf(n);
    if (idx !== -1) {
      if (state.numbers.length <= MIN_NUMBERS) {
        throw Error("공배수를 비교하려면 막대가 2개 이상 필요해요.");
      }
      state.numbers = state.numbers.filter((v) => v !== n);
    } else {
      if (state.numbers.length >= MAX_NUMBERS) {
        throw Error("막대는 4개까지 놓을 수 있어요. 먼저 하나를 빼거나 직접 입력으로 바꿔 보세요.");
      }
      state.numbers = [...state.numbers, n];
    }
    state.selectedMultiple = lcmAll(state.numbers);
  }

  function applyPreset(state, key) {
    const preset = PRESETS[key];
    if (!preset) throw Error("예시를 찾을 수 없어요.");
    state.mode = "lcm";
    state.numbers = [...preset.numbers];
    state.rows = preset.rows;
    state.selectedMultiple = lcmAll(state.numbers);
  }

  function validate(s) {
    if (
      !s ||
      s.version !== 1 ||
      !["lcm", "multiply"].includes(s.mode) ||
      !Array.isArray(s.numbers) ||
      !M.integer(s.numbers.length, MIN_NUMBERS, MAX_NUMBERS) ||
      s.numbers.some((n) => !M.integer(n, MIN_NUM, MAX_NUM)) ||
      new Set(s.numbers).size !== s.numbers.length ||
      !ROW_OPTIONS.includes(s.rows) ||
      typeof s.showDiagonals !== "boolean" ||
      typeof s.showMultiples !== "boolean" ||
      !M.integer(s.multiplicand, 1, 9999) ||
      !M.integer(s.multiplier, 1, 9)
    ) {
      throw Error("네이피어 계산봉 설정을 확인해 주세요.");
    }
    const copy = M.copy(s);
    if (!M.integer(copy.selectedMultiple, 1, 1000000000)) {
      copy.selectedMultiple = lcmAll(copy.numbers);
    }
    return copy;
  }

  return {
    MIN_NUM,
    MAX_NUM,
    MIN_NUMBERS,
    MAX_NUMBERS,
    ROW_OPTIONS,
    PRESETS,
    initial,
    lcmTwo,
    lcmAll,
    gcdAll,
    digitsOf,
    boneRow,
    commonMultiplesInfo,
    parseCustomNumber,
    addNumber,
    replaceNumber,
    removeNumber,
    toggleQuickNumber,
    applyPreset,
    validate,
  };
});
