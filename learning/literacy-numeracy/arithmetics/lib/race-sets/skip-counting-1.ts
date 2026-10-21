// skip-counting-1 학습지와 순위전 카드가 함께 쓰는 문제 만들기.
export type SkipProblem = { id: string; values: number[]; hidden: number[] };
export type ProblemSet = { seed: number; problems: SkipProblem[] };

export const BLANK_PATTERNS = [
  [2, 4],
  [3, 4, 5],
  [2, 3, 4],
  [1, 2, 3, 4],
  [2, 4, 6],
  [2, 4],
  [3, 4, 5],
  [2, 3, 4],
  [1, 2, 3, 4],
  [2, 4, 6],
] as const;

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
  const ranks = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], next);
  const sourcePairs: Array<{ start: number; step: number }> = [];

  const specialStep = integer(next, 6, 9);
  sourcePairs.push({ start: integer(next, 1, 46), step: specialStep });

  for (let magnitude = 2; magnitude <= 10; magnitude += 1) {
    const step = ranks[magnitude - 1] > 5 ? magnitude : -magnitude;
    const minimum = step > 0 ? 1 : magnitude === 10 ? 61 : magnitude * 6;
    const maximum = step > 0 ? magnitude === 10 ? 39 : 100 - magnitude * 6 : 99;
    sourcePairs.push({ start: integer(next, minimum, maximum), step });
  }

  const problems = ranks.map((rank, index) => {
    const pair = sourcePairs[rank - 1];
    return {
      id: `skip-${index}`,
      values: Array.from({ length: 7 }, (_, valueIndex) => pair.start + pair.step * valueIndex),
      hidden: [...BLANK_PATTERNS[index]],
    };
  });
  return { seed, problems };
}

export function answerId(problem: SkipProblem, index: number) {
  return `${problem.id}-${index}`;
}
