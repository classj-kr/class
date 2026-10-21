// grade-3-length 학습지와 순위전 카드가 함께 쓰는 문제 만들기.
export type Operator = "+" | "−";
export type UnitPair = { major: "km" | "m" | "cm"; minor: "m" | "cm" | "mm"; base: 1000 | 100 | 10 };
export type LengthValue = { major: number; minor: number };
export type LengthProblem = {
  id: string;
  units: UnitPair;
  operator: Operator;
  left: LengthValue;
  right: LengthValue;
  result: LengthValue;
};
export type ProblemSet = { seed: number; problems: LengthProblem[] };

export const UNIT_PAIRS: UnitPair[] = [
  { major: "km", minor: "m", base: 1000 },
  { major: "m", minor: "cm", base: 100 },
  { major: "cm", minor: "mm", base: 10 },
];

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

export function makeProblem(id: string, units: UnitPair, operator: Operator, left: LengthValue, right: LengthValue): LengthProblem {
  const leftTotal = left.major * units.base + left.minor;
  const rightTotal = right.major * units.base + right.minor;
  const total = operator === "+" ? leftTotal + rightTotal : leftTotal - rightTotal;
  return { id, units, operator, left, right, result: { major: Math.floor(total / units.base), minor: total % units.base } };
}

export function standardAddition(next: () => number, units: UnitPair, id: string): LengthProblem {
  if (units.base === 1000) return makeProblem(id, units, "+", { major: integer(next, 1, 5), minor: integer(next, 100, 999) }, { major: integer(next, 1, 3), minor: integer(next, 666, 999) });
  if (units.base === 100) return makeProblem(id, units, "+", { major: integer(next, 1, 3), minor: integer(next, 10, 99) }, { major: integer(next, 1, 9), minor: integer(next, 40, 99) });
  return makeProblem(id, units, "+", { major: integer(next, 1, 9), minor: integer(next, 1, 9) }, { major: integer(next, 6, 9), minor: integer(next, 4, 9) });
}

export function subtraction(next: () => number, units: UnitPair, id: string): LengthProblem {
  if (units.base === 1000) {
    const leftMajor = integer(next, 3, 6);
    return makeProblem(id, units, "−", { major: leftMajor, minor: integer(next, 1, 500) }, { major: integer(next, 1, leftMajor - 1), minor: integer(next, 200, 999) });
  }
  if (units.base === 100) {
    const leftMajor = integer(next, 5, 9);
    return makeProblem(id, units, "−", { major: leftMajor, minor: integer(next, 1, 41) }, { major: integer(next, 1, leftMajor - 1), minor: integer(next, 29, 99) });
  }
  const leftMajor = integer(next, 5, 9);
  return makeProblem(id, units, "−", { major: leftMajor, minor: integer(next, 1, 7) }, { major: integer(next, 1, leftMajor - 1), minor: integer(next, 4, 9) });
}

export function secondAddition(next: () => number, units: UnitPair, id: string): LengthProblem {
  if (units.base !== 100) return standardAddition(next, units, id);
  return makeProblem(id, units, "+", { major: integer(next, 2, 9), minor: integer(next, 5, 9) * 10 }, { major: integer(next, 2, 9), minor: integer(next, 5, 9) * 10 });
}

export function createProblemSet(seed: number): ProblemSet {
  const next = random(seed);
  return {
    seed,
    problems: [
      ...UNIT_PAIRS.map((units, index) => standardAddition(next, units, `grade-three-length-add-a-${index}`)),
      ...UNIT_PAIRS.map((units, index) => subtraction(next, units, `grade-three-length-subtract-${index}`)),
      ...UNIT_PAIRS.map((units, index) => secondAddition(next, units, `grade-three-length-add-b-${index}`)),
    ],
  };
}
