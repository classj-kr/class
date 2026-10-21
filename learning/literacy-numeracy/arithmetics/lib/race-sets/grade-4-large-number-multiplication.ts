// grade-4-large-number-multiplication 학습지와 순위전 카드가 함께 쓰는 문제 만들기.
export type UnitName = "십" | "백" | "천" | "만" | "십만" | "백만" | "천만" | "억" | "십억" | "백억" | "천억" | "조";
export type Problem = { id: string; left: number; leftUnit: UnitName; right: number; rightUnit: UnitName; answer: number; resultUnit: UnitName };
export type ProblemSet = { seed: number; problems: Problem[] };

export const UNIT_EXPONENTS: Record<UnitName, number> = {
  십: 1, 백: 2, 천: 3, 만: 4, 십만: 5, 백만: 6, 천만: 7,
  억: 8, 십억: 9, 백억: 10, 천억: 11, 조: 12,
};
export const OUTPUT_UNITS: Record<number, UnitName> = { 4: "만", 8: "억", 12: "조" };
export const UNIT_PAIRS = [
  ["십", "천만"], ["십", "천억"],
  ["백", "천"], ["백", "만"], ["백", "십만"], ["백", "백만"], ["백", "천만"], ["백", "억"], ["백", "십억"], ["백", "백억"], ["백", "천억"],
  ["천", "천"], ["천", "만"], ["천", "십만"], ["천", "백만"], ["천", "천만"], ["천", "십억"], ["천", "백억"], ["천", "천억"], ["천", "조"],
  ["만", "만"], ["만", "십만"], ["만", "백만"], ["만", "천만"], ["만", "억"], ["만", "십억"], ["만", "백억"], ["만", "천억"],
  ["십만", "십만"], ["십만", "백만"], ["십만", "천만"], ["십만", "억"], ["십만", "십억"], ["십만", "백억"],
  ["백만", "백만"], ["백만", "천만"], ["백만", "억"], ["백만", "십억"],
] as const satisfies readonly (readonly [UnitName, UnitName])[];

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

export function shuffle<T>(values: readonly T[], next: () => number) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(next() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

export function representation(leftUnit: UnitName, rightUnit: UnitName) {
  const exponent = UNIT_EXPONENTS[leftUnit] + UNIT_EXPONENTS[rightUnit];
  const resultExponent = exponent >= 12 ? 12 : exponent >= 8 ? 8 : 4;
  return { scale: 10 ** (exponent - resultExponent), resultUnit: OUTPUT_UNITS[resultExponent] };
}

export function coefficients(leftUnit: UnitName, rightUnit: UnitName, scale: number, next: () => number) {
  if (scale === 1000) {
    const left = integer(next, 2, 4);
    const right = left === 4 ? 2 : left === 3 ? integer(next, 2, 3) : integer(next, 2, 4);
    return { left, right };
  }
  if (leftUnit === "천" && rightUnit === "십억") {
    return { left: integer(next, 4, 9), right: integer(next, 4, 9) };
  }
  return { left: integer(next, 2, 9), right: integer(next, 2, 9) };
}

export function createProblemSet(seed: number): ProblemSet {
  const next = random(seed);
  const selectedPairs = shuffle(UNIT_PAIRS, next).slice(0, 10);
  const problems = selectedPairs.map(([leftUnit, rightUnit], index): Problem => {
    const { scale, resultUnit } = representation(leftUnit, rightUnit);
    const { left, right } = coefficients(leftUnit, rightUnit, scale, next);
    return {
      id: `grade-four-large-multiply-${index}`,
      left,
      leftUnit,
      right,
      rightUnit,
      answer: left * right * scale,
      resultUnit,
    };
  });
  return { seed, problems };
}
