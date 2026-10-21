// grade-3-fraction-3 학습지와 순위전 카드가 함께 쓰는 문제 만들기.
export type UnitDefinition = { unit: string; convertedUnit: string; factor: number; denominators: readonly number[] };
export type Problem = { id: string; whole: number; numerator: number; denominator: number; unit: string; convertedUnit: string; answer: number };
export type ProblemSet = { seed: number; problems: Problem[] };

export const UNITS: UnitDefinition[] = [
  { unit: "년", convertedUnit: "개월", factor: 12, denominators: [2, 3, 4, 6] },
  { unit: "일", convertedUnit: "시간", factor: 24, denominators: [2, 3, 4, 6, 8] },
  { unit: "시간", convertedUnit: "분", factor: 60, denominators: [2, 3, 4, 5, 6] },
  { unit: "분", convertedUnit: "초", factor: 60, denominators: [2, 3, 4, 5, 6] },
  { unit: "t", convertedUnit: "kg", factor: 1000, denominators: [2, 4, 5, 8] },
  { unit: "kg", convertedUnit: "g", factor: 1000, denominators: [2, 4, 5, 8] },
  { unit: "km", convertedUnit: "m", factor: 1000, denominators: [2, 4, 5, 8] },
  { unit: "m", convertedUnit: "cm", factor: 100, denominators: [2, 4, 5] },
  { unit: "L", convertedUnit: "mL", factor: 1000, denominators: [2, 4, 5, 8] },
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

export function shuffle<T>(values: T[], next: () => number) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(next() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

export function createProblemSet(seed: number): ProblemSet {
  const next = random(seed);
  const selectedUnits = shuffle(UNITS, next).slice(0, 8);
  const problems = selectedUnits.map((definition, index): Problem => {
    const denominator = definition.denominators[integer(next, 0, definition.denominators.length - 1)];
    const whole = index < 6 ? 0 : integer(next, 1, 3);
    const numerator = index < 4
      ? integer(next, 1, denominator - 1)
      : index < 6
        ? integer(next, denominator + 1, denominator + 3)
        : integer(next, 1, denominator - 1);
    return {
      id: `grade-three-unit-fraction-${index}`,
      whole,
      numerator,
      denominator,
      unit: definition.unit,
      convertedUnit: definition.convertedUnit,
      answer: whole * definition.factor + (definition.factor * numerator) / denominator,
    };
  });
  return { seed, problems };
}
