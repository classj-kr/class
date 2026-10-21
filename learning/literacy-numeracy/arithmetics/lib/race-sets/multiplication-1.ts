// multiplication-1 학습지와 순위전 카드가 함께 쓰는 문제 만들기.
export type BlankPosition = "factor" | "result";
export type MultiplicationProblem = {
  id: string;
  multiplicand: number;
  factor: number;
  product: number;
  blank: BlankPosition;
};
export type ProblemSet = { seed: number; columns: MultiplicationProblem[][] };

export const FACTOR_BLANK_ROWS = new Set([2, 5, 8]);

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

export function shuffle<T>(values: T[], next: () => number) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(next() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

export function randomInteger(min: number, max: number, next: () => number) {
  return min + Math.floor(next() * (max - min + 1));
}

export function makeColumn(
  columnIndex: number,
  multiplicands: number[],
  factors: number[],
): MultiplicationProblem[] {
  return factors.map((factor, rowIndex) => {
    const multiplicand = multiplicands[rowIndex];
    return {
      id: `multiplication-${columnIndex}-${rowIndex}`,
      multiplicand,
      factor,
      product: multiplicand * factor,
      blank: FACTOR_BLANK_ROWS.has(rowIndex) ? "factor" : "result",
    };
  });
}

export function createProblemSet(seed: number): ProblemSet {
  const next = random(seed);
  const twoFactors = [...shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9], next), randomInteger(3, 9, next)];
  const fiveFactors = [...shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9], next), randomInteger(3, 9, next)];
  const mixedMultiplicands = Array.from({ length: 10 }, (_, index) => index % 2 === 0 ? 2 : 5);
  const mixedFactors = Array.from({ length: 10 }, (_, index) => randomInteger(index === 9 ? 3 : 2, 9, next));

  return {
    seed,
    columns: [
      makeColumn(0, Array(10).fill(2), twoFactors),
      makeColumn(1, Array(10).fill(5), fiveFactors),
      makeColumn(2, mixedMultiplicands, mixedFactors),
    ],
  };
}
