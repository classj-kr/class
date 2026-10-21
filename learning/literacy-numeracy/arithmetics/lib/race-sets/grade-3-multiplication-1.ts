// grade-3-multiplication-1 학습지와 순위전 카드가 함께 쓰는 문제 만들기.
export type MultiplicationProblem = { id: string; top: number; bottom: number; result: number };
export type ProblemSet = { seed: number; problems: MultiplicationProblem[] };

export const TOP_RANGES: Array<[number, number]> = [[77, 99], [15, 99], [15, 99], [77, 99]];

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
    problems: TOP_RANGES.flatMap(([minimum, maximum], row) => (
      Array.from({ length: 4 }, (_, column) => {
        const top = integer(next, minimum, maximum);
        const bottom = integer(next, 2, 9);
        return { id: `grade-three-multiply-${row}-${column}`, top, bottom, result: top * bottom };
      })
    )),
  };
}
