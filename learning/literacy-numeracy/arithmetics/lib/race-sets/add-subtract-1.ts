// add-subtract-1 학습지와 순위전 카드가 함께 쓰는 문제 만들기.
export type Field = "left" | "right" | "result";
export type Equation = {
  id: string;
  left: number;
  operator: "+" | "−";
  right: number;
  result: number;
  hidden: [Field];
};
export type ProblemSet = {
  seed: number;
  additions: Equation[];
  subtractions: Equation[];
  mixed: Equation[];
};
export type AdditionSubtractionVariant = "single-digit" | "two-digit" | "within-twenty" | "missing-parts" | "grade-two-missing-parts";

export function random(seed: number) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

export function integer(next: () => number, minimum: number, maximum: number) {
  return minimum + Math.floor(next() * (maximum - minimum + 1));
}

export function shuffle<T>(values: T[], next: () => number) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(next() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

export function createSingleDigitProblemSet(seed: number): ProblemSet {
  const next = random(seed);
  const totals = shuffle([9, 9, 8, 8, 7, 7, 6, 5, 4, 3], next);
  const differences = shuffle([7, 6, 5, 5, 4, 4, 3, 2, 1, 0], next);

  const additions: Equation[] = totals.map((result, index) => {
    const right = result === 3 ? integer(next, 0, 3) : integer(next, 2, result - 2);
    return {
      id: `addition-${index}`,
      left: result - right,
      operator: "+" as const,
      right,
      result,
      hidden: ["result" as const],
    };
  });

  const subtractions: Equation[] = differences.map((result, index) => {
    const left = integer(next, result + 2, 9);
    return {
      id: `subtraction-${index}`,
      left,
      operator: "−" as const,
      right: left - result,
      result,
      hidden: ["result" as const],
    };
  });

  const mixed: Equation[] = [];
  function subtraction(index: number, minimum: number, hidden: [Field], includeEndpoints = false) {
    const left = integer(next, minimum, 9);
    const right = integer(next, includeEndpoints ? 0 : 1, includeEndpoints ? left : left - 1);
    mixed.push({ id: `mixed-${index}`, left, operator: "−", right, result: left - right, hidden });
  }
  function addition(index: number, range: "inside" | "allow-zero" | "allow-result", hidden: [Field]) {
    const result = integer(next, 4, 9);
    const left = integer(next, range === "allow-zero" ? 0 : 1, range === "allow-result" ? result : result - 1);
    mixed.push({ id: `mixed-${index}`, left, operator: "+", right: result - left, result, hidden });
  }

  subtraction(0, 2, ["left"]);
  addition(1, "inside", ["right"]);
  subtraction(2, 2, ["left"]);
  subtraction(3, 4, ["right"], true);
  addition(4, "inside", ["left"]);
  subtraction(5, 4, ["right"], true);
  addition(6, "allow-zero", ["left"]);
  subtraction(7, 2, ["right"]);
  subtraction(8, 4, ["left"]);
  addition(9, "allow-result", ["right"]);

  return { seed, additions, subtractions, mixed };
}

export function createTwoDigitProblemSet(seed: number): ProblemSet {
  const next = random(seed);
  const twoDigit = () => integer(next, 2, 9) * 10 + integer(next, 2, 9);
  const boundedByDigits = (value: number) =>
    integer(next, 0, Math.floor(value / 10)) * 10 + integer(next, 0, value % 10);

  const additions: Equation[] = Array.from({ length: 10 }, (_, index) => {
    const result = twoDigit();
    const right = boundedByDigits(result);
    return {
      id: `addition-${index}`,
      left: result - right,
      operator: "+" as const,
      right,
      result,
      hidden: ["result" as const],
    };
  });

  const subtractions: Equation[] = Array.from({ length: 10 }, (_, index) => {
    const left = twoDigit();
    const right = boundedByDigits(left);
    return {
      id: `subtraction-${index}`,
      left,
      operator: "−" as const,
      right,
      result: left - right,
      hidden: ["result" as const],
    };
  });

  const patterns: Array<["+" | "−", Field]> = [
    ["−", "left"],
    ["+", "right"],
    ["−", "left"],
    ["−", "right"],
    ["+", "left"],
    ["−", "right"],
    ["+", "left"],
    ["−", "right"],
    ["−", "left"],
    ["+", "right"],
  ];

  const mixed: Equation[] = patterns.map(([operator, hidden], index) => {
    if (operator === "−") {
      const left = twoDigit();
      const right = boundedByDigits(left);
      return { id: `mixed-${index}`, left, operator, right, result: left - right, hidden: [hidden] };
    }
    const result = twoDigit();
    const right = boundedByDigits(result);
    return { id: `mixed-${index}`, left: result - right, operator, right, result, hidden: [hidden] };
  });

  return { seed, additions, subtractions, mixed };
}

export function createWithinTwentyProblemSet(seed: number): ProblemSet {
  const next = random(seed);

  function addition(id: string): Equation {
    const result = integer(next, 11, 18);
    const right = integer(next, 6, 9);
    return {
      id,
      left: result - right,
      operator: "+",
      right,
      result,
      hidden: ["result"],
    };
  }

  function subtraction(id: string): Equation {
    const left = integer(next, 11, 18);
    const result = integer(next, 2, 9);
    return {
      id,
      left,
      operator: "−",
      right: left - result,
      result,
      hidden: ["result"],
    };
  }

  const additions = Array.from({ length: 10 }, (_, index) => addition(`addition-${index}`));
  const subtractions = Array.from({ length: 10 }, (_, index) => subtraction(`subtraction-${index}`));
  const mixedPattern: Array<"+" | "−"> = ["−", "−", "+", "−", "+", "−", "+", "−", "+", "−"];
  const mixed = mixedPattern.map((operator, index) =>
    operator === "+" ? addition(`mixed-${index}`) : subtraction(`mixed-${index}`),
  );

  return { seed, additions, subtractions, mixed };
}

export function createMissingPartsProblemSet(seed: number): ProblemSet {
  const next = random(seed);

  function subtraction(id: string, hidden: Field): Equation {
    const left = integer(next, 11, 18);
    const result = integer(next, 2, 9);
    return { id, left, operator: "−", right: left - result, result, hidden: [hidden] };
  }

  function additionFromRight(id: string, hidden: Field): Equation {
    const result = integer(next, 11, 18);
    const right = integer(next, 6, 9);
    return { id, left: result - right, operator: "+", right, result, hidden: [hidden] };
  }

  function additionFromLeft(id: string, hidden: Field): Equation {
    const result = integer(next, 11, 18);
    const left = integer(next, 1, 9);
    return { id, left, operator: "+", right: result - left, result, hidden: [hidden] };
  }

  const additions = [
    subtraction("addition-0", "result"),
    subtraction("addition-1", "result"),
    subtraction("addition-2", "left"),
    subtraction("addition-3", "result"),
    additionFromRight("addition-4", "result"),
    subtraction("addition-5", "right"),
    subtraction("addition-6", "result"),
    additionFromRight("addition-7", "result"),
    additionFromLeft("addition-8", "left"),
    additionFromLeft("addition-9", "right"),
  ];

  const subtractions = [
    subtraction("subtraction-0", "left"),
    subtraction("subtraction-1", "right"),
    additionFromLeft("subtraction-2", "left"),
    subtraction("subtraction-3", "right"),
    subtraction("subtraction-4", "result"),
    subtraction("subtraction-5", "right"),
    additionFromLeft("subtraction-6", "left"),
    subtraction("subtraction-7", "right"),
    subtraction("subtraction-8", "result"),
    subtraction("subtraction-9", "right"),
  ];

  const mixed = [
    subtraction("mixed-0", "left"),
    additionFromLeft("mixed-1", "left"),
    subtraction("mixed-2", "left"),
    subtraction("mixed-3", "result"),
    additionFromLeft("mixed-4", "left"),
    subtraction("mixed-5", "right"),
    subtraction("mixed-6", "result"),
    additionFromLeft("mixed-7", "left"),
    subtraction("mixed-8", "left"),
    subtraction("mixed-9", "right"),
  ];

  return { seed, additions, subtractions, mixed };
}

export function createGradeTwoMissingPartsProblemSet(seed: number): ProblemSet {
  const next = random(seed);

  function standardSubtraction(id: string, hidden: Field): Equation {
    const left = integer(next, 2, 9) * 10 + integer(next, 0, 5);
    const right = integer(next, 0, left);
    return { id, left, operator: "−", right, result: left - right, hidden: [hidden] };
  }

  function derivedAddition(id: string, hidden: Field, resultMinimum = 11): Equation {
    const result = integer(next, resultMinimum, 99);
    const left = integer(next, 9, result);
    return { id, left, operator: "+", right: result - left, result, hidden: [hidden] };
  }

  function largeAddition(id: string, hidden: Field, onesMinimum: number, onesMaximum: number): Equation {
    const left = integer(next, 7, 9) * 10 + integer(next, onesMinimum, onesMaximum);
    const right = integer(next, 7, 9) * 10 + integer(next, onesMinimum, onesMaximum);
    return { id, left, operator: "+", right, result: left + right, hidden: [hidden] };
  }

  function boundedSubtraction(id: string, hidden: Field): Equation {
    const left = integer(next, 1, 9) * 10 + integer(next, 1, 2);
    const result = integer(next, 3, left);
    return { id, left, operator: "−", right: left - result, result, hidden: [hidden] };
  }

  function borrowingSubtraction(id: string, hidden: Field): Equation {
    const left = integer(next, 6, 9) * 10 + integer(next, 6, 8);
    const right = integer(next, 1, 5) * 10 + integer(next, 7, 9);
    return { id, left, operator: "−", right, result: left - right, hidden: [hidden] };
  }

  const additions = [
    standardSubtraction("grade2-left-0", "result"),
    standardSubtraction("grade2-left-1", "result"),
    largeAddition("grade2-left-2", "result", 1, 5),
    boundedSubtraction("grade2-left-3", "result"),
    largeAddition("grade2-left-4", "result", 6, 9),
    standardSubtraction("grade2-left-5", "result"),
    standardSubtraction("grade2-left-6", "result"),
    derivedAddition("grade2-left-7", "result", 21),
    derivedAddition("grade2-left-8", "result"),
    derivedAddition("grade2-left-9", "result"),
  ];

  const subtractions = [
    standardSubtraction("grade2-middle-0", "left"),
    standardSubtraction("grade2-middle-1", "right"),
    derivedAddition("grade2-middle-2", "left"),
    standardSubtraction("grade2-middle-3", "right"),
    standardSubtraction("grade2-middle-4", "result"),
    borrowingSubtraction("grade2-middle-5", "right"),
    derivedAddition("grade2-middle-6", "left"),
    borrowingSubtraction("grade2-middle-7", "right"),
    borrowingSubtraction("grade2-middle-8", "result"),
    derivedAddition("grade2-middle-9", "right"),
  ];

  const mixed = [
    standardSubtraction("grade2-right-0", "left"),
    derivedAddition("grade2-right-1", "left"),
    standardSubtraction("grade2-right-2", "left"),
    standardSubtraction("grade2-right-3", "result"),
    derivedAddition("grade2-right-4", "left"),
    derivedAddition("grade2-right-5", "right"),
    derivedAddition("grade2-right-6", "result"),
    derivedAddition("grade2-right-7", "left", 21),
    borrowingSubtraction("grade2-right-8", "left"),
    borrowingSubtraction("grade2-right-9", "right"),
  ];

  return { seed, additions, subtractions, mixed };
}

export function createProblemSet(seed: number, variant: AdditionSubtractionVariant): ProblemSet {
  if (variant === "grade-two-missing-parts") return createGradeTwoMissingPartsProblemSet(seed);
  if (variant === "two-digit") return createTwoDigitProblemSet(seed);
  if (variant === "within-twenty") return createWithinTwentyProblemSet(seed);
  if (variant === "missing-parts") return createMissingPartsProblemSet(seed);
  return createSingleDigitProblemSet(seed);
}

export function answerId(equation: Equation, field: Field) {
  return `${equation.id}-${field}`;
}

export function expectedEntries(set: ProblemSet) {
  return [...set.additions, ...set.subtractions, ...set.mixed].flatMap((equation) =>
    equation.hidden.map((field) => [answerId(equation, field), String(equation[field])] as const),
  );
}
