// grade-3-measurement 학습지와 순위전 카드가 함께 쓰는 문제 만들기.
export type Operator = "+" | "−";
export type Range = readonly [number, number];
export type Quantity = { major: number; minor: number };
export type Problem = {
  id: string;
  majorUnit: "kg" | "L";
  minorUnit: "g" | "mL";
  operator: Operator;
  left: Quantity;
  right: Quantity;
  answer: Quantity;
};
export type ProblemSet = { seed: number; problems: Problem[] };
export type Answer = { major: string; minor: string };

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

export function integer(next: () => number, [minimum, maximum]: Range) {
  return minimum + Math.floor(next() * (maximum - minimum + 1));
}

export function quantity(next: () => number, majorRange: Range, minorRange: Range): Quantity {
  return { major: integer(next, majorRange), minor: integer(next, minorRange) };
}

export function twoDigitMajor(next: () => number, highRange: Range, lowRange: Range) {
  return integer(next, highRange) * 10 + integer(next, lowRange);
}

export function makeProblem(id: string, majorUnit: "kg" | "L", operator: Operator, left: Quantity, right: Quantity): Problem {
  const leftTotal = left.major * 1000 + left.minor;
  const rightTotal = right.major * 1000 + right.minor;
  const total = operator === "+" ? leftTotal + rightTotal : leftTotal - rightTotal;
  return {
    id,
    majorUnit,
    minorUnit: majorUnit === "kg" ? "g" : "mL",
    operator,
    left,
    right,
    answer: { major: Math.floor(total / 1000), minor: total % 1000 },
  };
}

export function createProblemSet(seed: number): ProblemSet {
  const next = random(seed);
  const firstKgLeft = quantity(next, [1, 9], [1, 666]);
  const firstLLeft = quantity(next, [1, 9], [100, 999]);
  const firstKgSubtractLeft = quantity(next, [2, 9], [1, 500]);
  const middleKgLeft = { major: twoDigitMajor(next, [5, 9], [1, 4]), minor: integer(next, [1, 500]) };
  const middleKgRight = { major: twoDigitMajor(next, [1, 4], [4, 9]), minor: integer(next, [200, 999]) };
  const middleLLeft = quantity(next, [2, 5], [1, 500]);
  const middleLRight = quantity(next, [1, middleLLeft.major - 1], [200, 999]);
  const lastLLeft = quantity(next, [2, 5], [1, 500]);
  const lastLRight = quantity(next, [1, lastLLeft.major - 1], [200, 999]);
  const lastKgLeft = { major: twoDigitMajor(next, [5, 9], [1, 4]), minor: integer(next, [1, 500]) };
  const lastKgRight = { major: twoDigitMajor(next, [1, 4], [4, 9]), minor: integer(next, [200, 999]) };

  return {
    seed,
    problems: [
      makeProblem("measurement-0", "kg", "+", firstKgLeft, quantity(next, [5, 9], [666, 999])),
      makeProblem("measurement-1", "L", "+", firstLLeft, quantity(next, [5, 9], [666, 999])),
      makeProblem("measurement-2", "kg", "−", firstKgSubtractLeft, quantity(next, [1, firstKgSubtractLeft.major - 1], [200, 999])),
      makeProblem("measurement-3", "kg", "−", middleKgLeft, middleKgRight),
      makeProblem("measurement-4", "L", "−", middleLLeft, middleLRight),
      makeProblem("measurement-5", "L", "−", lastLLeft, lastLRight),
      makeProblem("measurement-6", "kg", "+", quantity(next, [1, 9], [1, 666]), quantity(next, [5, 9], [777, 999])),
      makeProblem("measurement-7", "L", "+", quantity(next, [1, 9], [100, 999]), quantity(next, [5, 9], [666, 999])),
      makeProblem("measurement-8", "kg", "−", lastKgLeft, lastKgRight),
    ],
  };
}

export function expectedField(value: string | undefined, expected: number) {
  return expected === 0 ? value === "" || value === "0" : value === String(expected);
}
