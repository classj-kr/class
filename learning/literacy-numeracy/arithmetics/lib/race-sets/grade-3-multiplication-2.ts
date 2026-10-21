// grade-3-multiplication-2 학습지와 순위전 카드가 함께 쓰는 문제 만들기.
export type Problem = { id: string; multiplicand: number; multiplier: number; product: number };
export type ProblemSet = { seed: number; columns: Problem[][] };

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

export function createProblemSet(seed: number): ProblemSet {
  const next = random(seed);
  return {
    seed,
    columns: Array.from({ length: 2 }, (_, column) => (
      Array.from({ length: 11 }, (_, row) => {
        const multiplicand = integer(next, 11, 99);
        const multiplier = integer(next, 2, 9);
        return {
          id: `grade-three-multiplication-two-${column}-${row}`,
          multiplicand,
          multiplier,
          product: multiplicand * multiplier,
        };
      })
    )),
  };
}
