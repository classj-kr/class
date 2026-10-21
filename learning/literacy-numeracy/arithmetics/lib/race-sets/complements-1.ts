// complements-1 학습지와 순위전 카드가 함께 쓰는 문제 만들기.
export type SimpleProblem = { id: string; left: number; operator: "+" | "−"; right: number; result: number; hidden: "left" | "right" | "result" };
export type TripleProblem = { id: string; values: [number, number, number]; result: number };
export type ProblemSet = { seed: number; subtractions: SimpleProblem[]; pairs: SimpleProblem[]; triples: TripleProblem[] };

export const SUBTRACTION_RANGES: Array<[number, number]> = [
  [3, 9], [1, 9], [2, 9], [3, 9], [5, 8],
  [3, 9], [1, 9], [2, 9], [3, 9], [5, 8],
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
  const subtractions = SUBTRACTION_RANGES.map(([minimum, maximum], index) => {
    const right = integer(next, minimum, maximum);
    return { id: `subtract-${index}`, left: 10, operator: "−" as const, right, result: 10 - right, hidden: "result" as const };
  });

  const pairs = Array.from({ length: 10 }, (_, index) => {
    const left = integer(next, 1, 9);
    return {
      id: `pair-${index}`,
      left,
      operator: "+" as const,
      right: 10 - left,
      result: 10,
      hidden: (index % 2 === 0 ? "left" : "right") as "left" | "right",
    };
  });

  const triples = Array.from({ length: 10 }, (_, index) => {
    const first = integer(next, 1, 9);
    const extra = integer(next, 2, 9);
    const values = shuffle([first, 10 - first, extra], next) as [number, number, number];
    return { id: `triple-${index}`, values, result: 10 + extra };
  });

  return { seed, subtractions, pairs, triples };
}
